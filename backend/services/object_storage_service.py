"""S3 兼容的对象存储上传（SigV4 签名）。

支持 AWS S3 / 阿里云 OSS / 腾讯云 COS / Cloudflare R2 —— 它们都实现 S3 API。

签名算法按 AWS Signature Version 4 规范实现；正确性用 AWS 官方公布的
标准测试向量校验（见 tools/verify-sigv4.mjs 的对照测试），
因此**即使没有真实凭证也能确认签名实现是对的**。
"""
from __future__ import annotations

import datetime as _dt
import hashlib
import hmac
import json
import posixpath
import urllib.parse
from typing import Any

_ALGORITHM = "AWS4-HMAC-SHA256"
_SERVICE = "s3"
_UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD"


class ObjectStorageError(Exception):
    def __init__(self, message: str, status: int = 400) -> None:
        super().__init__(message)
        self.message = message
        self.status = status


# --------------------------------------------------------------------------
# 签名原语
# --------------------------------------------------------------------------

def _sha256_hex(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _hmac(key: bytes, msg: str) -> bytes:
    return hmac.new(key, msg.encode("utf-8"), hashlib.sha256).digest()


def derive_signing_key(secret_key: str, date_stamp: str, region: str, service: str = _SERVICE) -> bytes:
    """派生签名密钥：kDate -> kRegion -> kService -> kSigning。"""
    k_date = _hmac(("AWS4" + secret_key).encode("utf-8"), date_stamp)
    k_region = _hmac(k_date, region)
    k_service = _hmac(k_region, service)
    return _hmac(k_service, "aws4_request")


def _canonical_uri(path: str) -> str:
    """S3 的 URI 规范：按段编码，保留 '/'，每段做 RFC3986 编码。"""
    if not path:
        return "/"
    segments = path.split("/")
    encoded = [urllib.parse.quote(seg, safe="-_.~") for seg in segments]
    return "/".join(encoded) or "/"


def _canonical_query(params: dict[str, str]) -> str:
    if not params:
        return ""
    pairs = sorted((urllib.parse.quote(k, safe="-_.~"), urllib.parse.quote(str(v), safe="-_.~"))
                   for k, v in params.items())
    return "&".join(f"{k}={v}" for k, v in pairs)


def build_canonical_request(method: str, path: str, query: dict[str, str],
                            headers: dict[str, str], payload_hash: str) -> tuple[str, str]:
    """返回 (规范化请求, 已签名头列表)。"""
    lowered = {k.lower(): " ".join(str(v).split()) for k, v in headers.items()}
    signed_names = ";".join(sorted(lowered))
    canonical_headers = "".join(f"{name}:{lowered[name]}\n" for name in sorted(lowered))
    canonical = "\n".join([
        method.upper(),
        _canonical_uri(path),
        _canonical_query(query),
        canonical_headers,
        signed_names,
        payload_hash,
    ])
    return canonical, signed_names


def build_string_to_sign(timestamp: str, scope: str, canonical_request: str) -> str:
    return "\n".join([
        _ALGORITHM,
        timestamp,
        scope,
        _sha256_hex(canonical_request.encode("utf-8")),
    ])


def build_authorization(access_key: str, scope: str, signed_names: str, signature: str) -> str:
    return (f"{_ALGORITHM} Credential={access_key}/{scope}, "
            f"SignedHeaders={signed_names}, Signature={signature}")


def sign_headers(method: str, url: str, region: str, access_key: str, secret_key: str,
                 payload: bytes, content_type: str | None = None,
                 session_token: str | None = None,
                 extra_headers: dict[str, str] | None = None,
                 now: _dt.datetime | None = None) -> dict[str, str]:
    """为一次请求生成带签名的完整头。

    extra_headers 会一并纳入签名；now 可注入，便于用固定时间做对照测试。
    """
    parsed = urllib.parse.urlsplit(url)
    host = parsed.netloc
    path = parsed.path or "/"
    query = dict(urllib.parse.parse_qsl(parsed.query, keep_blank_values=True))

    moment = (now or _dt.datetime.now(_dt.timezone.utc)).astimezone(_dt.timezone.utc)
    amz_date = moment.strftime("%Y%m%dT%H%M%SZ")
    date_stamp = moment.strftime("%Y%m%d")

    headers: dict[str, str] = {
        "host": host,
        "x-amz-content-sha256": _sha256_hex(payload),
        "x-amz-date": amz_date,
    }
    if content_type:
        headers["content-type"] = content_type
    if session_token:
        headers["x-amz-security-token"] = session_token
    for name, value in (extra_headers or {}).items():
        headers[name] = value

    canonical, signed_names = build_canonical_request(
        method, path, query, headers, headers["x-amz-content-sha256"])

    scope = f"{date_stamp}/{region}/{_SERVICE}/aws4_request"
    string_to_sign = build_string_to_sign(amz_date, scope, canonical)
    signing_key = derive_signing_key(secret_key, date_stamp, region)
    signature = hmac.new(signing_key, string_to_sign.encode("utf-8"), hashlib.sha256).hexdigest()

    out = {k: v for k, v in headers.items() if k != "host"}
    out["Authorization"] = build_authorization(access_key, scope, signed_names, signature)
    return out


# --------------------------------------------------------------------------
# 配置解析
# --------------------------------------------------------------------------

def normalize_config(raw: Any) -> dict[str, str]:
    if isinstance(raw, str):
        try:
            raw = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise ObjectStorageError("对象存储配置不是合法 JSON。") from exc
    if not isinstance(raw, dict):
        raise ObjectStorageError("对象存储配置缺失。")

    def pick(*names: str) -> str:
        for n in names:
            v = raw.get(n)
            if v not in (None, ""):
                return str(v).strip()
        return ""

    config = {
        "endpoint": pick("endpoint", "s3Endpoint"),
        "region": pick("region", "location", "s3Region"),
        "bucket": pick("bucket"),
        "accessKeyId": pick("accessKeyId", "accessKey"),
        "secretAccessKey": pick("secretAccessKey", "secretKey"),
        "publicBaseUrl": pick("publicBaseUrl"),
        "sessionToken": pick("sessionToken"),
    }
    missing = [k for k in ("endpoint", "region", "bucket", "accessKeyId", "secretAccessKey")
               if not config[k]]
    if missing:
        raise ObjectStorageError("对象存储配置不完整，缺少：" + "、".join(missing))
    return config


def _object_url(config: dict[str, str], key: str) -> str:
    endpoint = config["endpoint"].rstrip("/")
    if not endpoint.startswith(("http://", "https://")):
        raise ObjectStorageError("Endpoint 必须是 http/https 地址。")
    # 路径风格寻址（S3 / OSS / COS / R2 均支持）
    return f"{endpoint}/{config['bucket']}/{_canonical_uri(key).lstrip('/')}"


def public_url(config: dict[str, str], key: str) -> str:
    base = (config.get("publicBaseUrl") or "").rstrip("/")
    if base:
        return f"{base}/{urllib.parse.quote(key, safe='/')}"
    return _object_url(config, key)


# --------------------------------------------------------------------------
# 上传 / 连通性测试
# --------------------------------------------------------------------------

def upload_object(config_raw: Any, key: str, data: bytes, content_type: str) -> str:
    """上传并返回公开访问 URL。"""
    from backend.services.outbound_http_transport import get_requests_session

    config = normalize_config(config_raw)
    target = _object_url(config, key)

    headers = sign_headers(
        "PUT", target, config["region"], config["accessKeyId"], config["secretAccessKey"],
        data, content_type=content_type or "application/octet-stream",
        session_token=config["sessionToken"] or None,
    )
    headers["Content-Type"] = content_type or "application/octet-stream"
    headers["Content-Length"] = str(len(data))

    try:
        response = get_requests_session().put(target, data=data, headers=headers, timeout=300)
    except Exception as exc:  # noqa: BLE001
        raise ObjectStorageError(f"对象存储上传失败：{exc}", 502) from exc

    if response.status_code >= 400:
        raise ObjectStorageError(
            f"对象存储返回 HTTP {response.status_code}：{response.text[:200]}", 502)

    return public_url(config, key)


def test_connection(config_raw: Any) -> dict[str, object]:
    """用一个极小的探测对象验证凭证与桶是否可用。"""
    config = normalize_config(config_raw)
    probe_key = "aic-connection-test.txt"
    payload = b"ok"
    url = upload_object(config, probe_key, payload, "text/plain")
    return {"success": True, "url": url, "key": probe_key}
