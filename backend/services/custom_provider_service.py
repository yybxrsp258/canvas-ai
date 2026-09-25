"""自定义中转站（custom provider）模型发现与模型清单服务。

渲染层不直连厂商：
- discover 由后端代持钥请求上游 ``/models``，按模型名启发式分类 kind；
- build-manifest-draft 为选中的模型生成最小可运行的 modelApi 清单包（端点为绝对 URL，
  避开运行时 baseUrl 拼接差异）；未经验证的媒体模型只能按 OpenAI 兼容约定猜测，
  真实参数靠"识别文档参数"（analyze-documentation 两阶段）修正；
- 清单包持久化在 data/custom-provider-bundles/，文件名用 sourceId 的 sha1
  （sourceId 含 ':'，Windows 上不能直接作文件名）。

analyze-documentation 是两阶段协议（契约见渲染层 customProviderDiscoveryApi.js）：
第一阶段回 needsAgent + 文档文本，渲染层跑文本模型抽 profile；
第二阶段收 agentAnalysis，后端编译成清单包。
"""
from __future__ import annotations

import hashlib
import re
from typing import Any
from urllib.parse import urlsplit

from backend.services.json_file_store import JsonFileStore
from backend.services import remote_proxy_service as proxy_service

SELECTABLE_KINDS = ("text", "image", "video", "audio")
DOCUMENT_MAX_BYTES = 2 * 1024 * 1024

_DISCOVER_CANDIDATE_TIMEOUT_SEC = 12.0
_DOC_FETCH_TIMEOUT_SEC = 60.0
_DOC_MAX_FETCH_BYTES = 4 * 1024 * 1024

_VIDEO_TOKENS = {
    "video", "sora", "kling", "veo", "seedance", "hailuo", "cogvideo", "animatediff",
    "i2v", "t2v", "v2v", "r2v", "wanx", "pixverse", "luma", "mochi",
    "ltx", "vidu", "pika", "runway", "framepack",
}
_AUDIO_TOKENS = {
    "audio", "tts", "speech", "voice", "music", "sound", "whisper", "suno", "udio",
}
_IMAGE_TOKENS = {
    "image", "img", "dall", "dalle", "flux", "seedream", "midjourney", "sdxl",
    "photo", "drawing", "paint", "pixelart",
    "banana", "recraft", "ideogram", "kolors", "seededit", "t2i", "i2i",
}
# 中转站上常见的品牌别名不含 kind 字眼，靠 token 表兜底（nano-banana = Gemini 图像模型）。
_IMAGE_NAME_HINTS = ("nano-banana", "nanobanana", "nano_banana")
_TEXT_EXPLICIT_TOKENS = {"chat", "completion", "completions", "reasoner", "claude", "gemini"}
_NON_TEXT_MEDIA_HINTS = ("diffusion", "sd-", "sd3", "3d")


class CustomProviderError(Exception):
    """面向渲染层的业务错误（渲染层按 error 文案展示）。"""


def _sha1(text: str) -> str:
    return hashlib.sha1(text.encode("utf-8")).hexdigest()


def _clamp_doc_text(text: str) -> str:
    data = (text or "").encode("utf-8", "replace")
    if len(data) <= DOCUMENT_MAX_BYTES:
        return text or ""
    return data[:DOCUMENT_MAX_BYTES].decode("utf-8", "ignore")


def _safe_slug(value: Any, fallback: str) -> str:
    slug = re.sub(r"[^A-Za-z0-9_-]+", "-", str(value or "").strip())[:80].strip("-")
    return slug or fallback


# --------------------------------------------------------------------------
# URL 推导
# --------------------------------------------------------------------------

def normalize_base_url(raw: Any) -> str:
    return str(raw or "").strip().rstrip("/")


def derive_api_root(base_url: str) -> str:
    """从用户填的 baseUrl 推导"版本前缀根"（含 /v1，不含资源路径）。

    与渲染层 aiTextApi 的补全规则对偶：
      .../v1/chat/completions -> .../v1；.../v1 -> .../v1；https://x -> https://x/v1
    """
    base = normalize_base_url(base_url)
    if not base:
        return ""
    lowered = base.lower()
    for suffix in ("/chat/completions", "/completions", "/responses", "/messages"):
        if lowered.endswith(suffix):
            base = base[: -len(suffix)].rstrip("/")
            break
    if not re.search(r"/v\d+(beta)?$", base.lower()):
        base = base + "/v1"
    return base


def derive_origin_root(base_url: str) -> str:
    """去版本前缀的主机根，如 https://token-x.com。"""
    root = derive_api_root(base_url)
    if not root:
        return ""
    versionless = re.sub(r"/v\d+(beta)?$", "", root, flags=re.I)
    if versionless:
        return versionless
    parts = urlsplit(root)
    return f"{parts.scheme}://{parts.netloc}" if parts.scheme and parts.netloc else root


def chat_completions_url(base_url: str) -> str:
    root = derive_api_root(base_url)
    return root + "/chat/completions" if root else ""


def models_url_candidates(base_url: str) -> list[str]:
    root = derive_api_root(base_url)
    origin = derive_origin_root(base_url)
    candidates: list[str] = []
    if root:
        candidates.append(root + "/models")
    if origin and origin + "/models" not in candidates:
        candidates.append(origin + "/models")
    return candidates


def to_absolute_endpoint(base_url: str, endpoint: Any) -> str:
    """把 profile 给的相对端点解析到中转站主机根上。

    相对端点常自带 /v1 前缀（文档通用写法），与主机根拼接即可；
    没有版本前缀的（如 /kaming/v1/...）原样挂到主机根。
    """
    value = str(endpoint or "").strip()
    if not value:
        return ""
    if re.match(r"^https?://", value, re.I):
        return value
    if not value.startswith("/"):
        value = "/" + value
    origin = derive_origin_root(base_url)
    if not origin:
        return value
    return origin.rstrip("/") + value


# --------------------------------------------------------------------------
# 发现
# --------------------------------------------------------------------------

def _tokenize(model_id: str) -> set[str]:
    return {tok for tok in re.split(r"[^a-z0-9]+", str(model_id or "").lower()) if tok}


def classify_model_kind(model_id: str) -> str:
    """按模型名启发式判定 kind；拿不准的归 unknown，渲染层允许用户手动改类型。"""
    raw = str(model_id or "").strip().lower()
    if not raw:
        return "unknown"
    tokens = _tokenize(raw)
    if tokens & {"embedding", "embeddings", "embed", "rerank", "moderation", "ocr",
                 "transcribe", "transcription", "assistant", "batch", "realtime",
                 "deep", "research", "search", "computer", "usage", "plan"}:
        return "unknown"
    if "text-embedding" in raw or raw.startswith("bge-") or "-embedding" in raw:
        return "unknown"
    if "deep-research" in raw or "auto" == raw:
        return "unknown"
    if tokens & _VIDEO_TOKENS or "video" in raw:
        return "video"
    if (tokens & _AUDIO_TOKENS) - {"audio"} or "tts" in raw:
        return "audio"
    if "audio" in tokens and not tokens & _IMAGE_TOKENS and not tokens & _TEXT_EXPLICIT_TOKENS:
        # audio 输入的多模态文本模型常叫 *-audio / *-vl-audio，保守归 unknown 让用户自己定
        return "unknown"
    if any(hint in raw for hint in _IMAGE_NAME_HINTS):
        return "image"
    if tokens & _IMAGE_TOKENS or "image" in raw or any(hint in raw for hint in _NON_TEXT_MEDIA_HINTS):
        return "image"
    return "text"


def _extract_model_items(payload: Any) -> list[dict]:
    raw_items: Any = payload
    if isinstance(payload, dict):
        for key in ("data", "models", "items", "result"):
            value = payload.get(key)
            if isinstance(value, list):
                raw_items = value
                break
    if not isinstance(raw_items, list):
        return []
    items: list[dict] = []
    for entry in raw_items:
        if isinstance(entry, str) and entry.strip():
            items.append({"id": entry.strip(), "displayName": entry.strip()})
            continue
        if not isinstance(entry, dict):
            continue
        model_id = str(entry.get("id") or entry.get("model") or entry.get("name") or "").strip()
        if not model_id:
            continue
        display = str(entry.get("name") or entry.get("display_name") or entry.get("title") or model_id).strip()
        items.append({"id": model_id, "displayName": display})
    return items


def discover(payload: dict) -> dict:
    base_url = normalize_base_url(payload.get("baseUrl"))
    if not base_url:
        raise CustomProviderError("缺少 Base URL")
    provider_id = str(payload.get("providerId") or "").strip()
    if not provider_id:
        raise CustomProviderError("缺少 providerId")
    api_key = str(payload.get("apiKey") or "").strip()
    candidates = models_url_candidates(base_url)
    if not candidates:
        raise CustomProviderError("Base URL 无效，无法推导模型列表地址")

    session = proxy_service.get_session()
    headers = {"Accept": "application/json"}
    if api_key:
        headers["Authorization"] = "Bearer " + api_key

    last_error = ""
    upstream: Any = None
    for url in candidates:
        try:
            response = session.get(url, headers=headers, timeout=_DISCOVER_CANDIDATE_TIMEOUT_SEC)
        except Exception as exc:  # noqa: BLE001
            last_error = f"{url} 请求失败：{type(exc).__name__}"
            continue
        if response.status_code != 200:
            last_error = f"{url} 返回 HTTP {response.status_code}"
            continue
        try:
            upstream = response.json()
        except ValueError:
            last_error = f"{url} 返回的不是 JSON"
            continue
        break
    if upstream is None:
        raise CustomProviderError("中转站模型列表获取失败：" + (last_error or "所有候选地址均不可用"))

    items = _extract_model_items(upstream)
    seen: set[str] = set()
    models: list[dict] = []
    unknown: list[dict] = []
    for item in items:
        model_id = item["id"]
        if model_id in seen:
            continue
        seen.add(model_id)
        kind = classify_model_kind(model_id)
        entry = {
            "upstreamModelId": model_id,
            "displayName": item.get("displayName") or model_id,
            "kind": kind,
            "capabilityStatus": "unverified",
        }
        (models if kind in SELECTABLE_KINDS else unknown).append(entry)

    warnings: list[str] = []
    if not items:
        warnings.append("上游返回的模型列表为空")
    return {
        "provider": {
            "providerId": provider_id,
            "name": str(payload.get("name") or "").strip(),
            "baseUrl": base_url,
            "documentationUrl": str(payload.get("documentationUrl") or "").strip(),
        },
        "models": models,
        "unknown": unknown,
        "warnings": warnings,
    }


# --------------------------------------------------------------------------
# 清单草稿与校验
# --------------------------------------------------------------------------

_TEXT_RESPONSE_MAPPING = {
    "resultPaths": ["choices[].message.content", "message.content", "output_text"],
}
_IMAGE_RESPONSE_MAPPING = {
    "resultPaths": ["data[].url", "data.url", "results[].url", "results[].imageUrl", "url"],
    "base64Paths": ["data[].b64_json", "b64_json"],
    "base64DefaultMimeType": "image/png",
    "errorPath": "error.message",
}
_VIDEO_RESPONSE_MAPPING = {
    "resultPaths": ["data[].url", "data.url", "result_url", "video_url", "url"],
    "errorPath": "error.message",
}
_AUDIO_RESPONSE_MAPPING = {
    "resultPaths": ["data[].url", "data.url", "url", "audio_url"],
    "errorPath": "error.message",
}

_KIND_RESPONSE: dict[str, dict] = {
    "text": _TEXT_RESPONSE_MAPPING,
    "image": _IMAGE_RESPONSE_MAPPING,
    "video": _VIDEO_RESPONSE_MAPPING,
    "audio": _AUDIO_RESPONSE_MAPPING,
}
_KIND_OUTPUT = {"text": "text", "image": "image", "video": "video", "audio": "audio"}
# result.urlFields 是"从响应对象里挑 URL 叶子字段名"的清单，与 responseMapping.resultPaths
# （可能是 data[].url 这类数组路径）用途不同，沿用原版清单的固定叶子名。
_KIND_URL_RESULT_FIELDS = {
    "image": ["url", "imageUrl"],
    "video": ["videoUrl", "video_url", "url"],
    "audio": ["url", "audioUrl", "audio_url"],
}
_KIND_MEDIA_SUFFIX = {
    "image": "/images/generations",
    "video": "/video/generations",
    "audio": "/audio/generations",
}

# 渲染层把"清单里带 <kind>Menu 扩展"当作模型进入对应节点模型菜单的准入条件
# （见 getCustomProviderImageGroups / buildCustomProviderVideoMenuGroups /
# getTextModelMenuItems / isAudioModelMenuManifest），且组名回落到 provider，
# 所以中转站模型必须自带一份最小菜单元数据，否则永远不出现在图片/视频/音频/文本节点里。
_KIND_MENU_EXTENSION = {
    "text": "textMenu",
    "image": "imageMenu",
    "video": "videoMenu",
    "audio": "audioMenu",
}
_CUSTOM_PROVIDER_MENU_SUBTITLE = "自定义中转站"
_CUSTOM_PROVIDER_MENU_ROLE = "customProviderModel"


def _provider_badge(provider_name: str, provider_id: str) -> str:
    source = re.sub(r"[^A-Za-z0-9]", "", str(provider_name or "")) or \
        re.sub(r"^custom_", "", str(provider_id or ""))
    return (source[:2] or "CP").upper()


def _custom_provider_extensions(provider_id: str, provider_name: str, kind: str,
                                upstream_model_id: str, display_name: str,
                                order: int, capability: dict) -> dict:
    relay_name = str(provider_name or "").strip() or provider_id
    badge = _provider_badge(relay_name, provider_id)
    return {
        "customProvider": {
            "upstreamModelId": upstream_model_id,
            "displayName": relay_name,
            "badge": badge,
            "capability": capability,
        },
        _KIND_MENU_EXTENSION[kind]: {
            "group": provider_id,
            "role": _CUSTOM_PROVIDER_MENU_ROLE,
            "order": order,
            "title": display_name,
            # 图片/文本菜单读 title，视频/音频菜单读 label，统一都写。
            "label": display_name,
            "subtitle": _CUSTOM_PROVIDER_MENU_SUBTITLE,
            "badge": badge,
        },
    }


def _media_result_fields(kind: str, response_mapping: dict) -> dict:
    result = {"urlFields": list(_KIND_URL_RESULT_FIELDS.get(kind, ["url"]))}
    task_id_path = response_mapping.get("taskIdPath")
    if task_id_path:
        result["taskIdPath"] = task_id_path
    return result


def _draft_execution(provider_id: str, kind: str, execution_id: str,
                     upstream_model_id: str, base_url: str) -> dict:
    common = {
        "schemaVersion": "1.0",
        "id": execution_id,
        "provider": provider_id,
        "kind": kind,
        "adapterType": "modelApi",
        "method": "POST",
        "model": upstream_model_id,
        "headers": {"Content-Type": "application/json"},
    }
    if kind == "text":
        return {
            **common,
            "endpoint": chat_completions_url(base_url),
            "endpointMode": "chat-completion",
            "bodyMapping": {"modelField": "model", "messagesField": "messages"},
            "responseMapping": dict(_TEXT_RESPONSE_MAPPING),
            "result": {"textFields": list(_TEXT_RESPONSE_MAPPING["resultPaths"])},
            "extensions": {"strictUpload": False, "streaming": True},
        }
    api_root = derive_api_root(base_url)
    endpoint = api_root + _KIND_MEDIA_SUFFIX[kind] if api_root else ""
    response_mapping = {key: (list(value) if isinstance(value, list) else value)
                        for key, value in _KIND_RESPONSE[kind].items()}
    execution = {
        **common,
        "endpoint": endpoint,
        "bodyMapping": [
            {"path": "model", "from": "model"},
            {"path": "prompt", "from": "prompt"},
        ],
        "responseMapping": response_mapping,
        "result": _media_result_fields(kind, response_mapping),
        "async": kind == "video",
    }
    return execution


def _draft_model(provider_id: str, kind: str, upstream_model_id: str,
                 display_name: str, execution_id: str, provider_name: str = "",
                 order: int = 1) -> dict:
    return {
        "schemaVersion": "1.0",
        "modelId": f"{provider_id}/{upstream_model_id}",
        "provider": provider_id,
        "kind": kind,
        "adapterType": "modelApi",
        "executionId": execution_id,
        "displayName": display_name or upstream_model_id,
        "outputType": _KIND_OUTPUT[kind],
        "async": kind == "video",
        "cancellable": False,
        "uiSchema": {"fields": []},
        "inputSlots": {
            "allowedKinds": ["text"],
            "minByKind": {"text": 0},
            "maxByKind": {"image": 0, "video": 0, "audio": 0},
        },
        "extensions": _custom_provider_extensions(
            provider_id, provider_name, kind, upstream_model_id,
            display_name or upstream_model_id, order,
            {"status": "unverified", "source": "discovery"}),
    }


def build_manifest_draft(payload: dict) -> dict:
    provider = payload.get("provider") if isinstance(payload.get("provider"), dict) else {}
    provider_id = str(provider.get("providerId") or "").strip()
    if not re.match(r"^custom_[a-z0-9_-]{1,64}$", provider_id):
        raise CustomProviderError("providerId 非法（应为 custom_ 前缀的中转站标识）")
    base_url = normalize_base_url(provider.get("baseUrl") or provider.get("apiUrl"))
    if not base_url:
        raise CustomProviderError("缺少 Base URL，无法生成清单草稿")
    provider_name = str(provider.get("name") or "").strip()
    models = payload.get("models") if isinstance(payload.get("models"), list) else []
    bundle_models: list[dict] = []
    bundle_executions: list[dict] = []
    used_execution_ids: set[str] = set()
    for index, entry in enumerate(models):
        upstream_model_id = str((entry or {}).get("upstreamModelId") or "").strip()
        kind = str((entry or {}).get("kind") or "").strip().lower()
        if not upstream_model_id or kind not in SELECTABLE_KINDS:
            continue
        display_name = str((entry or {}).get("displayName") or upstream_model_id).strip()
        execution_id = f"{provider_id}.modelApi.{kind}.{_safe_slug(upstream_model_id, str(index))}.v1"
        while execution_id in used_execution_ids:
            execution_id += "x"
        used_execution_ids.add(execution_id)
        bundle_models.append(_draft_model(provider_id, kind, upstream_model_id, display_name,
                                          execution_id, provider_name, index + 1))
        bundle_executions.append(
            _draft_execution(provider_id, kind, execution_id, upstream_model_id, base_url))
    if not bundle_models:
        raise CustomProviderError("没有可生成的模型（请确认已选择 text/image/video/audio 类型的模型）")
    return {
        "bundle": {
            "sourceId": f"custom-provider:{provider_id}",
            "provider": {"providerId": provider_id, "name": provider_name, "baseUrl": base_url},
            "models": bundle_models,
            "executions": bundle_executions,
        }
    }


_MODEL_REQUIRED = ("schemaVersion", "modelId", "provider", "kind", "adapterType",
                   "executionId", "displayName", "uiSchema", "inputSlots", "outputType")
_EXECUTION_REQUIRED = ("schemaVersion", "id", "provider", "kind", "adapterType", "result")
_MODEL_API_EXECUTION_REQUIRED = ("endpoint", "method", "model", "bodyMapping", "responseMapping")


def _missing_fields(record: dict, fields: tuple[str, ...]) -> list[str]:
    # 与渲染层 assertRequiredFields 对齐：仅 undefined/null/'' 视为缺失，
    # 空数组/空对象在其判定里算"存在"（例如 result/urlFields 可能合法地为 []）。
    return [field for field in fields if record.get(field) is None or record.get(field) == ""]


def validate_manifest_draft(bundle: Any) -> dict:
    errors: list[str] = []
    if not isinstance(bundle, dict):
        return {"ok": False, "errors": ["manifest bundle must be an object"]}
    if not str(bundle.get("sourceId") or "").strip():
        errors.append("manifest bundle requires sourceId")
    models = bundle.get("models")
    executions = bundle.get("executions")
    if not isinstance(models, list) or not isinstance(executions, list):
        return {"ok": False, "errors": errors or ["models/executions must be arrays"]}
    execution_by_id: dict[str, dict] = {}
    for execution in executions:
        if not isinstance(execution, dict):
            errors.append("execution manifest must be an object")
            continue
        execution_id = str(execution.get("id") or "").strip()
        if not execution_id:
            errors.append("execution manifest requires id")
            continue
        if execution_id in execution_by_id:
            errors.append(f"duplicate execution id in bundle: {execution_id}")
        errors.extend(f"execution manifest {execution_id} missing {field}"
                      for field in _missing_fields(execution, _EXECUTION_REQUIRED))
        if execution.get("adapterType") == "modelApi":
            errors.extend(f"modelApi execution {execution_id} missing {field}"
                          for field in _missing_fields(execution, _MODEL_API_EXECUTION_REQUIRED))
        execution_by_id[execution_id] = execution
    seen_model_ids: set[str] = set()
    for model in models:
        if not isinstance(model, dict):
            errors.append("model manifest must be an object")
            continue
        model_id = str(model.get("modelId") or "").strip()
        if not model_id:
            errors.append("model manifest requires modelId")
            continue
        if model_id in seen_model_ids:
            errors.append(f"duplicate modelId in bundle: {model_id}")
        seen_model_ids.add(model_id)
        errors.extend(f"model manifest {model_id} missing {field}"
                      for field in _missing_fields(model, _MODEL_REQUIRED))
        ui_schema = model.get("uiSchema")
        fields = ui_schema.get("fields") if isinstance(ui_schema, dict) else None
        if not isinstance(fields, list):
            errors.append(f"model manifest {model_id} uiSchema.fields must be an array")
        else:
            for position, field in enumerate(fields):
                if not isinstance(field, dict) or not field.get("id") or not field.get("type") \
                        or "defaultValue" not in field:
                    errors.append(f"model manifest {model_id} uiSchema.fields[{position}] "
                                  "requires id/type/defaultValue")
        execution = execution_by_id.get(str(model.get("executionId") or "").strip())
        if execution is None:
            errors.append(f"model manifest {model_id} references unknown executionId")
            continue
        for field in ("adapterType", "kind", "provider"):
            if str(model.get(field) or "").strip() != str(execution.get(field) or "").strip():
                errors.append(f"model manifest {model_id} {field} does not match execution manifest")
    return {"ok": not errors, "errors": errors[:20], "bundle": bundle}


# --------------------------------------------------------------------------
# 清单包持久化
# --------------------------------------------------------------------------

class BundleStore:
    def __init__(self, root: str) -> None:
        self._store = JsonFileStore(root)

    @staticmethod
    def _key(source_id: str) -> str:
        return _sha1(source_id) + ".json"

    def list(self) -> list[dict]:
        items: list[dict] = []
        for name in self._store.list_names(".json"):
            record = self._store.read(name)
            if isinstance(record, dict) and str(record.get("sourceId") or "").strip() \
                    and isinstance(record.get("bundle"), dict):
                items.append({"sourceId": record["sourceId"], "bundle": record["bundle"]})
        return items

    def save(self, bundle: Any) -> dict:
        if not isinstance(bundle, dict):
            raise CustomProviderError("清单包必须是 JSON 对象")
        source_id = str(bundle.get("sourceId") or "").strip()
        if not source_id:
            raise CustomProviderError("清单包缺少 sourceId")
        record = {"sourceId": source_id, "bundle": bundle}
        if not self._store.write(self._key(source_id), record):
            raise CustomProviderError("清单包写入失败")
        return {"item": record}

    def delete(self, source_id: str) -> bool:
        return self._store.delete(self._key(str(source_id or "").strip()))


# --------------------------------------------------------------------------
# 文档分析（两阶段）
# --------------------------------------------------------------------------

_SCRIPT_STYLE_RE = re.compile(r"<(script|style)[^>]*>.*?</\1>", re.S | re.I)
_BLOCK_TAG_RE = re.compile(r"<br\s*/?>|</p>|</div>|</li>|</h\d>", re.I)
_TAG_RE = re.compile(r"<[^>]+>")
_WS_RE = re.compile(r"[ \t\f\r]+")
_BLANK_LINES_RE = re.compile(r"\n{3,}")


def _html_to_text(html: str) -> str:
    text = _SCRIPT_STYLE_RE.sub(" ", html)
    text = _BLOCK_TAG_RE.sub("\n", text)
    text = _TAG_RE.sub(" ", text)
    text = (text.replace("&nbsp;", " ").replace("&amp;", "&")
                .replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"'))
    text = _WS_RE.sub(" ", text)
    return _BLANK_LINES_RE.sub("\n\n", text).strip()


def _looks_structured(text: str) -> bool:
    sample = (text or "").lstrip()[:200]
    return sample.startswith("{") or sample.startswith("[") or \
        bool(re.match(r"^(openapi|swagger):", sample, re.I))


def _fetch_documentation(url: str) -> dict:
    parts = urlsplit(url)
    if parts.scheme.lower() not in ("http", "https") or not parts.netloc:
        raise CustomProviderError("API 文档地址必须是 http/https URL")
    session = proxy_service.get_session()
    try:
        response = session.get(url, headers={"Accept": "text/html,application/json;q=0.9,*/*;q=0.8"},
                               timeout=_DOC_FETCH_TIMEOUT_SEC, stream=True)
    except Exception as exc:  # noqa: BLE001
        raise CustomProviderError(f"API 文档抓取失败：{type(exc).__name__}") from exc
    try:
        if response.status_code != 200:
            raise CustomProviderError(f"API 文档抓取失败：HTTP {response.status_code}")
        chunks: list[bytes] = []
        total = 0
        for chunk in response.iter_content(chunk_size=65536):
            if not chunk:
                continue
            chunks.append(chunk)
            total += len(chunk)
            if total >= _DOC_MAX_FETCH_BYTES:
                break
    finally:
        response.close()
    raw = b"".join(chunks)[:_DOC_MAX_FETCH_BYTES]
    content_type = (response.headers.get("Content-Type") or "").split(";")[0].strip().lower()
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        text = raw.decode("gb18030", "replace")
    if "html" in content_type or text.lstrip()[:200].lower().startswith(("<!doctype", "<html")):
        text = _html_to_text(text)
        content_type = "text/plain"
    return {
        "url": url,
        "contentType": content_type or "text/plain",
        "source": "openapi_spec" if _looks_structured(text) else "web_page",
        "text": _clamp_doc_text(text),
    }


def _phase1_analyze(payload: dict) -> dict:
    documentation_url = str(payload.get("documentationUrl") or "").strip() or \
        str((payload.get("provider") or {}).get("documentationUrl") or "").strip()
    document = payload.get("documentationDocument")
    if isinstance(document, dict) and str(document.get("text") or "").strip():
        text = _clamp_doc_text(str(document.get("text")))
        prepared = {
            "url": "",
            "contentType": str(document.get("contentType") or "text/plain"),
            "source": "local_document",
            "text": text,
        }
    elif documentation_url:
        prepared = _fetch_documentation(documentation_url)
        text = prepared["text"]
    else:
        raise CustomProviderError("请先填写 API 文档地址或选择本地文档")
    if not text.strip():
        raise CustomProviderError("API 文档内容为空")
    prepared["fingerprint"] = _sha1(text)[:16]
    return {
        "needsAgent": True,
        "document": prepared,
        "analysis": {"documentationUrl": documentation_url},
    }


def _profile_kind(profile: dict) -> str:
    for kind in (profile.get("kinds") or []):
        kind = str(kind).strip().lower()
        if kind in SELECTABLE_KINDS:
            return kind
    endpoint = str(profile.get("endpoint") or "").lower()
    for needle, kind in (("chat", "text"), ("completion", "text"), ("message", "text"),
                         ("image", "image"), ("video", "video"),
                         ("audio", "audio"), ("music", "audio"), ("speech", "audio")):
        if needle in endpoint:
            return kind
    return ""


_IMAGE_INPUT_KEYS = {"image", "images", "image_url", "image_urls", "reference_image",
                     "reference_images", "ref_image", "ref_images", "input_image",
                     "img", "img_url", "img2img", "init_image"}
_VIDEO_INPUT_KEYS = {"video", "video_url", "video_urls", "input_video", "reference_video"}
_AUDIO_INPUT_KEYS = {"audio", "audio_url", "input_audio", "reference_audio"}
_BODY_SKIP_KEYS = {"model", "prompt", "messages", "input", "stream", "user", "metadata"}


def _request_schema_properties(profile: dict) -> dict:
    request_schema = profile.get("requestSchema")
    if not isinstance(request_schema, dict):
        return {}
    properties = request_schema.get("properties")
    return properties if isinstance(properties, dict) else {}


def _ui_field(prop_name: str, spec: dict) -> dict | None:
    enum = spec.get("enum")
    if isinstance(enum, list) and enum:
        options = [{"value": value, "label": str(value)} for value in enum[:40]
                   if isinstance(value, (str, int, float, bool))]
        if not options:
            return None
        default = spec.get("default")
        if default not in [option["value"] for option in options]:
            default = options[0]["value"]
        return {"id": prop_name, "type": "select", "label": prop_name,
                "defaultValue": default, "options": options}
    if spec.get("type") in ("integer", "number") and (
            spec.get("minimum") is not None or spec.get("maximum") is not None):
        try:
            low = float(spec.get("minimum", 0))
            high = float(spec.get("maximum", low + 1))
            default = float(spec.get("default", low))
            step = float(spec.get("multipleOf") or 1)
        except (TypeError, ValueError):
            return None
        if not (high > low) or step <= 0:
            return None
        return {"id": prop_name, "type": "slider", "label": prop_name,
                "min": low, "max": high, "step": step,
                "defaultValue": min(max(default, low), high)}
    if spec.get("type") == "boolean":
        return {"id": prop_name, "type": "toggle", "label": prop_name,
                "defaultValue": bool(spec.get("default", False))}
    return None


def _as_string_list(value: Any) -> list[str]:
    return [str(item).strip() for item in value if str(item).strip()] if isinstance(value, list) else []


def _compiled_body_mapping(kind: str, profile: dict) -> list | dict:
    if kind == "text":
        return {"modelField": "model", "messagesField": "messages"}
    entries: list[dict] = [{"path": "model", "from": "model"}, {"path": "prompt", "from": "prompt"}]
    fixed = profile.get("fixedParams")
    fixed = fixed if isinstance(fixed, dict) else {}
    for key, value in fixed.items():
        entries.append({"path": str(key), "from": "constant", "value": value})
    for prop_name, spec in _request_schema_properties(profile).items():
        prop_name = str(prop_name)
        if prop_name in _BODY_SKIP_KEYS or prop_name in fixed or not isinstance(spec, dict):
            continue
        if prop_name in _IMAGE_INPUT_KEYS:
            entries.append({"path": prop_name, "from": "inputImages"})
            continue
        if prop_name in _VIDEO_INPUT_KEYS:
            entries.append({"path": prop_name, "from": "inputVideos"})
            continue
        if prop_name in _AUDIO_INPUT_KEYS:
            entries.append({"path": prop_name, "from": "inputAudios"})
            continue
        if _ui_field(prop_name, spec) is not None:
            entries.append({"path": prop_name, "from": "param", "field": [prop_name]})
    return entries


def _compiled_input_slots(kind: str, profile: dict) -> dict:
    names = set(_request_schema_properties(profile))
    allowed = ["text"]
    max_by_kind = {"image": 0, "video": 0, "audio": 0}
    if kind in ("image", "video") and names & _IMAGE_INPUT_KEYS:
        allowed.append("image")
        max_by_kind["image"] = 4
    if kind == "video" and names & _VIDEO_INPUT_KEYS:
        allowed.append("video")
        max_by_kind["video"] = 1
    if kind == "audio" and names & _AUDIO_INPUT_KEYS:
        allowed.append("audio")
        max_by_kind["audio"] = 2
    return {"allowedKinds": allowed, "minByKind": {"text": 0}, "maxByKind": max_by_kind}


def _compiled_response_and_polling(kind: str, profile: dict) -> tuple[dict, dict]:
    base = {key: (list(value) if isinstance(value, list) else value)
            for key, value in _KIND_RESPONSE[kind].items()}
    documented_results = [path for path in _as_string_list(profile.get("responsePaths")) if path]
    lifecycle = profile.get("taskLifecycle")
    lifecycle = lifecycle if isinstance(lifecycle, dict) else {}
    task_id_path = str(lifecycle.get("taskIdPath") or "").strip()
    response_mapping: dict = {}
    polling: dict = {}
    if task_id_path:
        response_mapping["taskIdPath"] = task_id_path
        if str(lifecycle.get("statusPath") or "").strip():
            response_mapping["statusPath"] = str(lifecycle["statusPath"]).strip()
        response_mapping["resultPaths"] = documented_results or list(base.get("resultPaths") or [])
        error_paths = _as_string_list(lifecycle.get("errorPaths"))
        if error_paths:
            response_mapping["errorPaths"] = error_paths
        elif base.get("errorPath"):
            response_mapping["errorPath"] = base["errorPath"]
        polling = {
            "successStatuses": [status.lower() for status in _as_string_list(lifecycle.get("successStatuses"))],
            "failedStatuses": [status.lower() for status in _as_string_list(lifecycle.get("failedStatuses"))],
        }
        if lifecycle.get("pollIntervalMs") is not None:
            polling["pollIntervalMs"] = int(lifecycle["pollIntervalMs"])
        if lifecycle.get("maxWaitMs") is not None:
            polling["maxWaitMs"] = int(lifecycle["maxWaitMs"])
        status_endpoint = str(lifecycle.get("statusEndpoint") or "").strip()
        if status_endpoint:
            polling["urlTemplate"] = status_endpoint
            polling["waitUntilTerminal"] = True
    else:
        response_mapping = dict(base)
        if documented_results:
            response_mapping["resultPaths"] = documented_results
    base64 = profile.get("responseBase64")
    base64 = base64 if isinstance(base64, dict) else {}
    data_paths = _as_string_list(base64.get("dataPaths"))
    if data_paths:
        response_mapping["base64Paths"] = data_paths
        mime_paths = _as_string_list(base64.get("mimeTypePaths"))
        if mime_paths:
            response_mapping["mimeTypePaths"] = mime_paths
        response_mapping["base64DefaultMimeType"] = str(
            base64.get("defaultMimeType") or "image/png") or "image/png"
    return response_mapping, polling


def _phase2_analyze(payload: dict) -> dict:
    agent = payload.get("agentAnalysis")
    if not isinstance(agent, dict):
        raise CustomProviderError("Agent 分析结果缺失")
    provider = payload.get("provider") if isinstance(payload.get("provider"), dict) else {}
    provider_id = str(provider.get("providerId") or "").strip()
    base_url = normalize_base_url(provider.get("baseUrl") or provider.get("apiUrl"))
    if not re.match(r"^custom_[a-z0-9_-]{1,64}$", provider_id):
        raise CustomProviderError("providerId 非法")
    if not base_url:
        raise CustomProviderError("缺少 Base URL")
    provider_name = str(provider.get("name") or "").strip()

    selected: list[tuple[str, str]] = []
    for entry in (payload.get("models") if isinstance(payload.get("models"), list) else []):
        upstream_model_id = str((entry or {}).get("upstreamModelId") or "").strip()
        kind = str((entry or {}).get("kind") or "").strip().lower()
        if upstream_model_id and kind in SELECTABLE_KINDS and (upstream_model_id, kind) not in selected:
            selected.append((upstream_model_id, kind))

    result_status: dict[str, dict] = {}
    for entry in (agent.get("modelResults") if isinstance(agent.get("modelResults"), list) else []):
        if not isinstance(entry, dict):
            continue
        model_id = str(entry.get("upstreamModelId") or "").strip()
        if model_id and model_id not in result_status:
            result_status[model_id] = entry

    bundle_models: list[dict] = []
    bundle_executions: list[dict] = []
    used_execution_ids: set[str] = set()
    matched: set[tuple[str, str]] = set()

    for profile in (agent.get("profiles") if isinstance(agent.get("profiles"), list) else []):
        if not isinstance(profile, dict):
            continue
        endpoint = str(profile.get("endpoint") or "").strip()
        profile_model_ids = [mid for mid in _as_string_list(profile.get("modelIds")) if mid]
        kind = _profile_kind(profile)
        if not endpoint or not profile_model_ids or kind not in SELECTABLE_KINDS:
            continue
        targets = [(upstream_model_id, kind_key) for (upstream_model_id, kind_key) in selected
                   if upstream_model_id in profile_model_ids and kind_key == kind
                   and (upstream_model_id, kind_key) not in matched]
        if not targets:
            continue
        response_mapping, polling = _compiled_response_and_polling(kind, profile)
        ui_fields_source = _request_schema_properties(profile)
        fixed = profile.get("fixedParams") if isinstance(profile.get("fixedParams"), dict) else {}
        for upstream_model_id, kind_key in targets:
            result_entry = result_status.get(upstream_model_id) or {}
            status = str(result_entry.get("status") or "").strip().lower()
            if status and status not in ("found", "async_lifecycle"):
                continue
            matched.add((upstream_model_id, kind_key))
            execution_id = f"{provider_id}.modelApi.{kind_key}.{_safe_slug(upstream_model_id, str(len(bundle_models)))}.doc"
            while execution_id in used_execution_ids:
                execution_id += "x"
            used_execution_ids.add(execution_id)

            body_mapping = _compiled_body_mapping(kind_key, profile)
            ui_fields: list[dict] = []
            for prop_name, spec in ui_fields_source.items():
                prop_name = str(prop_name)
                if prop_name in _BODY_SKIP_KEYS or prop_name in fixed or not isinstance(spec, dict):
                    continue
                field = _ui_field(prop_name, spec)
                if field is not None:
                    ui_fields.append(field)

            execution: dict = {
                "schemaVersion": "1.0",
                "id": execution_id,
                "provider": provider_id,
                "kind": kind_key,
                "adapterType": "modelApi",
                "endpoint": to_absolute_endpoint(base_url, endpoint),
                "method": (str(profile.get("method") or "POST").strip().upper() or "POST"),
                "model": upstream_model_id,
                "headers": {"Content-Type": "application/json"},
                "bodyMapping": body_mapping,
                "responseMapping": response_mapping,
                "result": (
                    {"textFields": list(response_mapping.get("resultPaths") or [])
                     or ["choices[].message.content"]}
                    if kind_key == "text"
                    else _media_result_fields(kind_key, response_mapping)
                ),
            }
            extensions: dict = {}
            if str(profile.get("requestEncoding") or "").strip().lower() == "multipart/form-data":
                execution["requestEncoding"] = "multipart/form-data"
                execution["headers"] = {}
            if polling:
                extensions["taskPolling"] = polling
            asset_upload = profile.get("assetUpload")
            if isinstance(asset_upload, dict) and str(asset_upload.get("endpoint") or "").strip():
                extensions["customAssetUpload"] = {
                    "endpoint": str(asset_upload["endpoint"]).strip(),
                    "multipartField": str(asset_upload.get("multipartField") or "file").strip() or "file",
                    "responsePath": str(asset_upload.get("responsePath") or "url").strip() or "url",
                }
            error_rules = [rule for rule in (profile.get("errorRules") or []) if isinstance(rule, dict)]
            if error_rules:
                extensions["errorRules"] = error_rules
            if kind_key == "text":
                extensions["strictUpload"] = False
                extensions["streaming"] = True
            if extensions:
                execution["extensions"] = extensions

            model: dict = {
                "schemaVersion": "1.0",
                "modelId": f"{provider_id}/{upstream_model_id}",
                "provider": provider_id,
                "kind": kind_key,
                "adapterType": "modelApi",
                "executionId": execution_id,
                "displayName": str(result_entry.get("matchedLabel") or upstream_model_id).strip() or upstream_model_id,
                "outputType": _KIND_OUTPUT[kind_key],
                "async": bool(polling.get("urlTemplate")),
                "cancellable": False,
                "uiSchema": {"fields": ui_fields},
                "inputSlots": _compiled_input_slots(kind_key, profile),
                "extensions": _custom_provider_extensions(
                    provider_id, provider_name, kind_key, upstream_model_id,
                    str(result_entry.get("matchedLabel") or upstream_model_id).strip() or upstream_model_id,
                    len(bundle_models) + 1,
                    {
                        "status": "documented",
                        "source": "documentation-agent",
                        "evidenceUrls": _as_string_list(result_entry.get("evidenceUrls"))[:8],
                    }),
            }
            bundle_models.append(model)
            bundle_executions.append(execution)

    analysis = {
        "documentedModels": len(bundle_models),
        "agentModelResults": [
            {
                "upstreamModelId": str(entry.get("upstreamModelId") or ""),
                "kind": str(entry.get("kind") or "").strip().lower(),
                "status": str(entry.get("status") or "").strip().lower(),
                "notes": str(entry.get("notes") or "")[:500],
            }
            for entry in (agent.get("modelResults") if isinstance(agent.get("modelResults"), list) else [])
            if isinstance(entry, dict)
        ],
        "agentReview": {"needsRepair": False, "issues": []},
        "warnings": _as_string_list(agent.get("warnings"))[:20],
    }
    if not bundle_models:
        return {"analysis": analysis}
    return {
        "bundle": {
            "sourceId": f"custom-provider:{provider_id}",
            "provider": {"providerId": provider_id},
            "models": bundle_models,
            "executions": bundle_executions,
        },
        "analysis": analysis,
    }


def analyze_documentation(payload: dict) -> dict:
    if payload.get("agentAnalysis") is not None:
        return _phase2_analyze(payload)
    return _phase1_analyze(payload)
