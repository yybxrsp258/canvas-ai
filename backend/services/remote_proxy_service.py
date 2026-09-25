"""厂商出站代理。

渲染层不直连任何 AI 厂商。所有出站请求都经这里转发：
渲染层把厂商端点（`apiUrl`）与密钥（`apiKey` 或 Authorization 头）交上来，
本服务持钥发起真实请求，并把厂商响应**原样**回传。

关于响应状态码：渲染层拿到响应体后会自己按厂商规则解析错误
（它调用 `parseError(provider, body, 200)`，即假定代理层返回 200）。
因此本服务对**厂商的业务响应一律回 200 + 原始响应体**，
只有在代理层自身失败（参数非法、网络不通、超时）时才返回非 200。
"""
from __future__ import annotations

import json
import os
import urllib.parse
from email import policy
from email.parser import BytesParser
from typing import Any

from backend.services.outbound_http_transport import get_requests_session

_ALLOWED_SCHEMES = ("http", "https")
_DEFAULT_TIMEOUT_SEC = 120.0
_MAX_LOCAL_UPLOAD_BYTES = 512 * 1024 * 1024


class ProxyError(Exception):
    """代理层自身失败（非厂商业务错误）。"""

    def __init__(self, message: str, status: int = 502) -> None:
        super().__init__(message)
        self.status = status
        self.message = message


def validate_target_url(raw: Any) -> str:
    """校验目标 URL。只允许 http/https，且必须有主机名。"""
    url = str(raw or "").strip()
    if not url:
        raise ProxyError("missing apiUrl", 400)
    parsed = urllib.parse.urlsplit(url)
    if parsed.scheme.lower() not in _ALLOWED_SCHEMES:
        raise ProxyError(f"unsupported scheme: {parsed.scheme or '(none)'}", 400)
    if not parsed.hostname:
        raise ProxyError("apiUrl has no host", 400)
    return url


def bearer_header(api_key: Any) -> dict[str, str]:
    key = str(api_key or "").strip()
    return {"Authorization": f"Bearer {key}"} if key else {}


def _session():
    return get_requests_session()


def get_session():
    """供本模块之外（如产物下载）复用同一个 TLS 会话。"""
    return get_requests_session()


def _timeout(value: Any) -> float:
    try:
        seconds = float(value)
    except (TypeError, ValueError):
        return _DEFAULT_TIMEOUT_SEC
    return seconds if seconds > 0 else _DEFAULT_TIMEOUT_SEC


def _split_payload(payload: dict) -> tuple[str, str, dict]:
    """从请求体里取出 apiUrl / apiKey，其余字段作为厂商请求体。"""
    if not isinstance(payload, dict):
        raise ProxyError("request body must be a JSON object", 400)
    target = validate_target_url(payload.get("apiUrl"))
    api_key = payload.get("apiKey")
    vendor_body = {k: v for k, v in payload.items() if k not in ("apiUrl", "apiKey")}
    return target, str(api_key or ""), vendor_body


# --------------------------------------------------------------------------
# JSON 代理（image / completions）
# --------------------------------------------------------------------------

def forward_json(payload: dict, timeout: Any = None) -> tuple[bytes, str]:
    """把请求体中的剩余字段作为 JSON POST 给厂商。"""
    target, api_key, vendor_body = _split_payload(payload)

    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    headers.update(bearer_header(api_key))

    try:
        response = _session().post(target, json=vendor_body, headers=headers,
                                   timeout=_timeout(timeout))
    except Exception as exc:  # requests 的异常族在运行时才可用
        raise ProxyError(f"upstream request failed: {exc}", 502) from exc

    return response.content, response.headers.get("Content-Type", "application/json")


# --------------------------------------------------------------------------
# GET 代理（task 轮询）
# --------------------------------------------------------------------------

def forward_get(target_url: Any, incoming_headers: dict, timeout: Any = None) -> tuple[bytes, str]:
    """GET 转发。鉴权头由调用方（渲染层）直接给出，原样传递。"""
    target = validate_target_url(target_url)

    headers = {"Accept": "application/json"}
    # 只透传鉴权相关头，避免把浏览器的本地头带到厂商
    for name in ("Authorization", "X-Api-Key", "x-api-key"):
        value = incoming_headers.get(name)
        if value:
            headers[name] = value

    try:
        response = _session().get(target, headers=headers, timeout=_timeout(timeout))
    except Exception as exc:
        raise ProxyError(f"upstream request failed: {exc}", 502) from exc

    return response.content, response.headers.get("Content-Type", "application/json")


# --------------------------------------------------------------------------
# POST 透传代理（/proxy/task 的 POST 形态：语音探针与语音合成）
# --------------------------------------------------------------------------

# 渲染层直接给出的鉴权与语音业务头，原样带给厂商。
_PASSTHROUGH_REQUEST_HEADERS = (
    "Authorization", "X-Api-Key", "x-api-key",
    "X-Api-Resource-Id", "X-Api-Request-Id", "X-Api-Sequence",
)
# 火山语音把业务错误放在响应头里，渲染层探针依赖这两个头判定失败原因。
_PROBE_RESPONSE_HEADERS = ("x-api-status", "x-api-message")


def forward_post_passthrough(target_url: Any, raw_body: bytes, incoming_headers: dict,
                             timeout: Any = None) -> tuple[int, bytes, str, dict]:
    """POST 转发：请求头透传，厂商状态码与探针响应头原样回传。

    与 forward_json 不同：不重组请求体、不把状态码包成 200。
    连接测试探针要用厂商原始状态码区分鉴权失败与参数校验失败，
    语音合成的错误解析也依赖真实状态码。
    """
    target = validate_target_url(target_url)

    lowered = {str(k).lower(): v for k, v in (incoming_headers or {}).items()}
    headers = {
        "Accept": "application/json",
        "Content-Type": lowered.get("content-type") or "application/json",
    }
    for name in _PASSTHROUGH_REQUEST_HEADERS:
        value = lowered.get(name.lower())
        if value:
            headers[name] = value

    try:
        response = _session().post(target, data=raw_body, headers=headers,
                                   timeout=_timeout(timeout))
    except Exception as exc:
        raise ProxyError(f"upstream request failed: {exc}", 502) from exc

    extra = {name: response.headers[name] for name in _PROBE_RESPONSE_HEADERS
             if response.headers.get(name)}
    return (response.status_code, response.content,
            response.headers.get("Content-Type", "application/json"), extra)


# --------------------------------------------------------------------------
# 原样转发 multipart（/proxy/upload）
# --------------------------------------------------------------------------

def forward_raw(target_url: Any, raw_body: bytes, content_type: str,
                incoming_headers: dict, timeout: Any = None) -> tuple[bytes, str]:
    """把调用方发来的 multipart 原始字节原样转给厂商，无需解析再组装。"""
    target = validate_target_url(target_url)

    headers = {"Content-Type": content_type}
    for name in ("Authorization", "X-Api-Key", "x-api-key"):
        value = incoming_headers.get(name)
        if value:
            headers[name] = value

    try:
        response = _session().post(target, data=raw_body, headers=headers,
                                   timeout=_timeout(timeout))
    except Exception as exc:
        raise ProxyError(f"upstream upload failed: {exc}", 502) from exc

    return response.content, response.headers.get("Content-Type", "application/json")


# --------------------------------------------------------------------------
# multipart 解析（/proxy/apimart-upload）
# --------------------------------------------------------------------------

def parse_multipart(raw_body: bytes, content_type: str) -> tuple[dict[str, str], list[tuple[str, str, bytes]]]:
    """把 multipart 体拆成 (普通字段, 文件列表)。

    返回 (fields, files)，files 元素为 (字段名, 文件名, 内容)。
    """
    if "multipart/form-data" not in (content_type or "").lower():
        raise ProxyError("expected multipart/form-data", 400)

    message = BytesParser(policy=policy.default).parsebytes(
        b"Content-Type: " + content_type.encode("utf-8", "replace") + b"\r\n\r\n" + raw_body
    )
    if not message.is_multipart():
        raise ProxyError("malformed multipart body", 400)

    fields: dict[str, str] = {}
    files: list[tuple[str, str, bytes]] = []

    for part in message.iter_parts():
        name = part.get_param("name", header="content-disposition")
        if not name:
            continue
        payload = part.get_payload(decode=True) or b""
        filename = part.get_filename()
        if filename:
            files.append((name, filename, payload))
        else:
            fields[name] = payload.decode(part.get_content_charset() or "utf-8", "replace")

    return fields, files


def forward_apimart_upload(raw_body: bytes, content_type: str) -> tuple[bytes, str]:
    """APIMART 素材上传：解析出 apiUrl / apiKey 与文件后重新上报。"""
    fields, files = parse_multipart(raw_body, content_type)

    base_url = str(fields.get("apiUrl") or "https://api.apib.ai").strip().rstrip("/")
    api_key = str(fields.get("apiKey") or "").strip()
    if not files:
        raise ProxyError("missing upload file", 400)

    target = validate_target_url(base_url + "/v1/uploads/images")
    upload_field, filename, payload = files[0]

    headers = {"Accept": "application/json"}
    headers.update(bearer_header(api_key))

    data = {
        "contentType": fields.get("contentType", "image/png"),
        "fileExtension": fields.get("fileExtension", "png"),
        "permanent": fields.get("permanent", "0"),
    }

    try:
        response = _session().post(
            target,
            files={"file": (filename, payload, data["contentType"])},
            data=data,
            headers=headers,
            timeout=_DEFAULT_TIMEOUT_SEC,
        )
    except Exception as exc:
        raise ProxyError(f"upstream upload failed: {exc}", 502) from exc

    return response.content, response.headers.get("Content-Type", "application/json")


# --------------------------------------------------------------------------
# 本地文件上传（/proxy/upload-local-media）
# --------------------------------------------------------------------------

def forward_local_media(payload: dict, timeout: Any = None) -> tuple[bytes, str]:
    """读取本地文件并作为 multipart 上传到厂商。

    该路由要求后端读本地磁盘，是渲染层无法自行完成的部分。
    出于安全只接受**已存在的普通文件**，拒绝目录与特殊文件，并限制大小。
    """
    if not isinstance(payload, dict):
        raise ProxyError("request body must be a JSON object", 400)

    target = validate_target_url(payload.get("apiUrl"))
    local_path = str(payload.get("localPath") or "").strip()
    if not local_path or not os.path.isabs(local_path):
        raise ProxyError("localPath must be an absolute path", 400)
    if not os.path.isfile(local_path):
        raise ProxyError("localPath is not a regular file", 400)

    max_bytes = payload.get("maxBytes")
    try:
        limit = int(max_bytes)
    except (TypeError, ValueError):
        limit = _MAX_LOCAL_UPLOAD_BYTES
    size = os.path.getsize(local_path)
    if size > limit:
        raise ProxyError(f"file too large: {size} > {limit} bytes", 413)

    filename = str(payload.get("filename") or os.path.basename(local_path))
    field_name = str(payload.get("multipartField") or "file")

    headers = {"Accept": "application/json"}
    for name in ("Authorization", "X-Api-Key", "x-api-key"):
        value = payload.get(name)
        if value:
            headers[name] = value

    try:
        with open(local_path, "rb") as handle:
            response = _session().post(
                target,
                files={field_name: (filename, handle)},
                headers=headers,
                timeout=_timeout(timeout),
            )
    except OSError as exc:
        raise ProxyError(f"cannot read local file: {exc}", 400) from exc
    except Exception as exc:
        raise ProxyError(f"upstream upload failed: {exc}", 502) from exc

    return response.content, response.headers.get("Content-Type", "application/json")


def error_payload(exc: ProxyError) -> bytes:
    return json.dumps({"success": False, "error": exc.message},
                      ensure_ascii=False).encode("utf-8")
