#!/usr/bin/env python3
"""本地后端服务。

为渲染层提供 web 根静态文件、就绪探针与 /api/v2 路由。

由 Electron 主进程以源码方式拉起：
    python server.py --host=127.0.0.1 --port=8777

环境变量契约（由主进程注入）：
    AIC_APP_ROOT      渲染层 web 根目录
    AICANVAS_PORT     监听端口
    AIC_LOCAL_TOKEN   本地访问令牌，渲染层请求需带上 X-AIC-Local-Token
"""
from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import os
import re
from functools import partial
import signal
import socket
import subprocess
import sys
import threading
import time
import uuid
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, unquote, urlparse

# 允许以 `python server.py` 从项目根直接运行
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.services.json_file_store import JsonFileStore
from backend.services import document_text_service
from backend.services import object_storage_service
from backend.services import remote_proxy_service as proxy_service
from backend.services import custom_provider_service
from backend.services.custom_provider_service import BundleStore, CustomProviderError

# 就绪探针要求的响应头。主进程以 statusCode===200 且该头匹配 SERVER_ID_VALUE 判定后端就绪。
SERVER_ID_HEADER = "x-aicanvas-server"
SERVER_ID_VALUE = "Canvas AI"

# 渲染层用作 ES module 加载，Content-Type 必须是 JS MIME，否则浏览器拒绝执行模块。
_MIME_OVERRIDES = {
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".json": "application/json",
    ".css": "text/css",
    ".html": "text/html",
    ".wasm": "application/wasm",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".cur": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".gltf": "model/gltf+json",
    ".glb": "model/gltf-binary",
    ".task": "application/octet-stream",
    ".aicmodel": "application/octet-stream",
}

# 无需令牌即可访问的路径，必须在鉴权之前判定。
# /api/v2/runtime/info 是主进程的就绪探针，且该探针请求不带令牌。
_AUTH_EXEMPT_PATHS = frozenset({"/api/v2/runtime/info"})

# 开发态下 web 根就是项目根，因此源码、依赖、工具目录都在其内。
# 这些顶层条目不属于渲染层，一律不作为静态资源暴露。
# 注意 electron/ 单独处理：展平布局下它同时存放主进程代码和渲染层引用的页面。
_DENIED_TOP_LEVEL = frozenset({
    ".reference", ".git", ".gitignore", "node_modules",
    "tools", "backend", "runtime", ".electron-runtime", ".userdata",
    "server.py", "package.json", "package-lock.json",
})

# 后端接口的命名空间。
# 注意：渲染层的静态目录 api/ 在 URL 上同样表现为 /api/...，与接口前缀字面重叠。
# 因此不能把所有 /api/* 都当作接口，只认下列已知前缀（外加显式登记的路由）。
#
# 命名冲突实例（务必保持现状）：
#   渲染层有 api/configApi.js   -> URL /api/configApi.js   ，所以 /api/config 只能精确匹配
#   渲染层有 api/projectsV2Api.js -> URL /api/projectsV2Api.js，所以 /api/projects 必须带尾部斜杠
_API_PATH_PREFIXES = ("/api/v2/", "/api/v1/", "/api/collaboration/", "/api/projects/")
_API_EXACT_PATHS = frozenset({"/api/config", "/api/projects"})


class Config:
    def __init__(self, host: str, port: int, web_root: str, token: str | None,
                 user_dir: str, canvas_dir: str, data_dir: str, output_dir: str,
                 assets_dir: str, workflows_dir: str) -> None:
        self.host = host
        self.port = port
        self.web_root = os.path.abspath(web_root)
        self.token = token
        self.user_dir = os.path.abspath(user_dir)
        self.canvas_dir = os.path.abspath(canvas_dir)
        self.data_dir = os.path.abspath(data_dir)
        self.output_dir = os.path.abspath(output_dir)
        self.assets_dir = os.path.abspath(assets_dir)
        self.workflows_dir = os.path.abspath(workflows_dir)
        # 存储根：output/ 与 data/{uploads,assets}/ 都挂在它下面。
        # 渲染层的 localMediaPath 只认这三类**相对**前缀，媒体即按这些 URL 前缀提供。
        self.storage_root = os.path.dirname(self.output_dir)


CONFIG: Config
_USER_STORE: JsonFileStore | None = None
_CANVAS_STORE: JsonFileStore | None = None


def _user_store() -> JsonFileStore:
    """用户配置目录（settings/shortcuts/presets 等）。"""
    global _USER_STORE
    if _USER_STORE is None:
        _USER_STORE = JsonFileStore(CONFIG.user_dir)
    return _USER_STORE


def _canvas_store() -> JsonFileStore:
    """项目目录。"""
    global _CANVAS_STORE
    if _CANVAS_STORE is None:
        _CANVAS_STORE = JsonFileStore(CONFIG.canvas_dir)
    return _CANVAS_STORE


def _log(message: str) -> None:
    sys.stdout.write(f"[server] {message}\n")
    sys.stdout.flush()


# --------------------------------------------------------------------------
# 路由
# --------------------------------------------------------------------------

def _json_response(handler: BaseHTTPRequestHandler, status: int, payload: object,
                   extra_headers: dict[str, str] | None = None) -> None:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    try:
        handler.send_response(status)
        handler.send_header("Content-Type", "application/json; charset=utf-8")
        handler.send_header("Content-Length", str(len(body)))
        handler.send_header("Cache-Control", "no-store")
        for key, value in (extra_headers or {}).items():
            handler.send_header(key, value)
        handler.end_headers()
        handler.wfile.write(body)
    except (BrokenPipeError, ConnectionResetError):
        # 客户端提前断开（长轮询被 abort 是常态），不是错误
        pass


def _handle_runtime_info(handler: BaseHTTPRequestHandler) -> None:
    # PyInstaller 冻结后 sys.frozen 为 True，据此如实上报运行形态
    frozen = bool(getattr(sys, "frozen", False))
    _json_response(
        handler,
        HTTPStatus.OK,
        {
            "name": SERVER_ID_VALUE,
            "version": "0.1.0",
            "packaged": frozen,
            "appPathType": "frozen" if frozen else "development",
            "runtime": {
                "python": sys.version.split()[0],
                "executable": sys.executable,
                "frozen": frozen,
            },
            "chrome": None,
            "versions": {},
        },
        extra_headers={SERVER_ID_HEADER: SERVER_ID_VALUE},
    )


def _handle_heartbeat_stream(handler: BaseHTTPRequestHandler) -> None:
    """SSE 心跳。渲染层的连接监控据此判定后端在线。"""
    handler.send_response(HTTPStatus.OK)
    handler.send_header("Content-Type", "text/event-stream; charset=utf-8")
    handler.send_header("Cache-Control", "no-cache")
    handler.send_header("Connection", "keep-alive")
    handler.send_header("X-Accel-Buffering", "no")
    handler.end_headers()

    try:
        while True:
            handler.wfile.write(b": heartbeat\n\n")
            handler.wfile.flush()
            time.sleep(5)
    except (BrokenPipeError, ConnectionResetError, OSError):
        # 客户端断开，正常结束
        return


# --------------------------------------------------------------------------
# 用户数据（JSON 文件持久化）
# --------------------------------------------------------------------------

# 首次读取时返回的空值。渲染层期望结构正确的空对象/空数组，而不是 null。
_USER_JSON_DEFAULTS: dict[str, object] = {
    "settings.json": {},
    "shortcuts.json": {},
    "asset-categories.json": [],
    "story-workspace.json": {},
    "person-replacement-workspace.json": {},
    "workflows.json": [],
    "presets.json": [],
}


def _handle_user_json(handler: BaseHTTPRequestHandler) -> None:
    name = urlparse(handler.path).path[len("/api/v2/user/"):]
    if not name or name.startswith("/"):
        _json_response(handler, HTTPStatus.NOT_FOUND,
                       {"success": False, "error": "invalid user data name"})
        return

    store = _user_store()
    if handler.command == "POST":
        body = handler.json_body
        if body is _INVALID_BODY:
            _json_response(handler, HTTPStatus.BAD_REQUEST,
                           {"success": False, "error": "invalid json body"})
            return
        ok = store.write(name, body)
        _json_response(handler, HTTPStatus.OK if ok else HTTPStatus.INTERNAL_SERVER_ERROR,
                       {"success": ok})
        return

    _json_response(handler, HTTPStatus.OK, store.read(name, _USER_JSON_DEFAULTS.get(name, {})))


def _handle_user_presets(handler: BaseHTTPRequestHandler) -> None:
    if handler.command == "POST":
        body = handler.json_body
        if body is _INVALID_BODY:
            _json_response(handler, HTTPStatus.BAD_REQUEST,
                           {"success": False, "error": "invalid json body"})
            return
        ok = _user_store().write("presets.json", body)
        _json_response(handler, HTTPStatus.OK if ok else HTTPStatus.INTERNAL_SERVER_ERROR,
                       {"success": ok})
        return
    _json_response(handler, HTTPStatus.OK, _user_store().read("presets.json", []))


def _handle_user_presets_settings(handler: BaseHTTPRequestHandler) -> None:
    _json_response(handler, HTTPStatus.OK, _user_store().read("presets-settings.json", {}))


# --------------------------------------------------------------------------
# 产物与媒体文件
# --------------------------------------------------------------------------

# 渲染层的 localMediaPath 只认这三类相对前缀（Windows 绝对路径会被它拒绝），
# 因此保存的产物与上传素材都放在存储根下这三处，并按同名 URL 前缀对外提供。
_MEDIA_URL_PREFIXES = ("output/", "data/uploads/", "data/assets/")

_OUTPUT_KIND_EXT = {"image": "png", "video": "mp4", "audio": "mp3"}


def _media_file_path(url_path: str) -> str | None:
    """把 /output/... 这类 URL 映射到存储根下的真实文件；越界或不存在返回 None。"""
    relative = _normalized_relative(url_path)
    if not relative:
        return None
    if not any(relative.startswith(prefix) for prefix in _MEDIA_URL_PREFIXES):
        return None
    candidate = os.path.abspath(os.path.join(CONFIG.storage_root, relative))
    if not candidate.startswith(CONFIG.storage_root + os.sep):
        return None
    return candidate if os.path.isfile(candidate) else None


def _serve_media(handler: BaseHTTPRequestHandler, url_path: str, head_only: bool = False) -> bool:
    file_path = _media_file_path(url_path)
    if file_path is None:
        return False
    try:
        size = os.path.getsize(file_path)
        with open(file_path, "rb") as fh:
            handler.send_response(HTTPStatus.OK)
            handler.send_header("Content-Type", _guess_content_type(file_path))
            handler.send_header("Content-Length", str(size))
            handler.send_header("Cache-Control", "no-cache")
            handler.end_headers()
            if not head_only:
                while chunk := fh.read(64 * 1024):
                    handler.wfile.write(chunk)
    except (BrokenPipeError, ConnectionResetError, OSError):
        pass
    return True


def _write_output(ext: str, data: bytes) -> str:
    """写入产物目录，返回给渲染层用的相对路径（如 output/xxx.png）。"""
    name = f"{int(time.time() * 1000)}-{uuid.uuid4().hex[:8]}.{ext}"
    target = os.path.join(CONFIG.output_dir, name)
    os.makedirs(CONFIG.output_dir, exist_ok=True)
    with open(target, "wb") as fh:
        fh.write(data)
    return f"output/{name}"


def _output_payload(relative_path: str, size: int) -> dict[str, object]:
    # 渲染层会从 localPath / path / url 里挑可用字段，这里一并给出。
    return {
        "success": True,
        "localPath": relative_path,
        "path": relative_path,
        "url": "/" + relative_path,
        "filename": os.path.basename(relative_path),
        "size": size,
    }


def _handle_save_output(handler: BaseHTTPRequestHandler) -> None:
    """POST /api/v2/save_output?ext=png&kind=image：请求体是原始二进制。"""
    params = parse_qs(urlparse(handler.path).query)
    kind = (params.get("kind") or [""])[0].strip().lower()

    ext = (params.get("ext") or [""])[0].strip().lstrip(".").lower()
    if not ext:
        ext = _OUTPUT_KIND_EXT.get(kind, "bin")
    if not ext.isalnum() or len(ext) > 8:
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "invalid ext"})
        return

    data = getattr(handler, "_raw_body", b"")
    if not data:
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "empty body"})
        return

    try:
        relative = _write_output(ext, data)
    except OSError as exc:
        _json_response(handler, HTTPStatus.INTERNAL_SERVER_ERROR,
                       {"success": False, "error": f"cannot write output: {exc}"})
        return

    _json_response(handler, HTTPStatus.OK, _output_payload(relative, len(data)))


def _handle_save_output_from_url(handler: BaseHTTPRequestHandler) -> None:
    """POST /api/v2/save_output_from_url：后端下载远程产物再落盘。"""
    body = handler.json_body
    if body is _INVALID_BODY or not isinstance(body, dict):
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "invalid json body"})
        return

    raw_url = str(body.get("url") or body.get("sourceUrl") or "").strip()
    if not raw_url:
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "missing url"})
        return

    try:
        target = proxy_service.validate_target_url(raw_url)
    except proxy_service.ProxyError as exc:
        _json_response(handler, exc.status, {"success": False, "error": exc.message})
        return

    ext = str(body.get("ext") or "").strip().lstrip(".").lower()
    if not ext:
        ext = os.path.splitext(urlparse(target).path)[1].lstrip(".").lower() or "bin"
        # 去掉可能的查询串残留在扩展名里的情况
        ext = ext.split("?")[0] or "bin"
    if not ext.isalnum() or len(ext) > 8:
        ext = "bin"

    try:
        response = proxy_service.get_session().get(target, timeout=300)
        if response.status_code >= 400:
            _json_response(handler, HTTPStatus.BAD_GATEWAY,
                           {"success": False, "error": f"download failed: HTTP {response.status_code}"})
            return
        data = response.content
    except Exception as exc:  # noqa: BLE001
        _json_response(handler, HTTPStatus.BAD_GATEWAY,
                       {"success": False, "error": f"download failed: {exc}"})
        return

    try:
        relative = _write_output(ext, data)
    except OSError as exc:
        _json_response(handler, HTTPStatus.INTERNAL_SERVER_ERROR,
                       {"success": False, "error": f"cannot write output: {exc}"})
        return

    _json_response(handler, HTTPStatus.OK, _output_payload(relative, len(data)))


def _handle_output_files(handler: BaseHTTPRequestHandler) -> None:
    """GET /api/v2/output-files：列出产物目录。"""
    items: list[dict[str, object]] = []
    try:
        names = sorted(os.listdir(CONFIG.output_dir))
    except OSError:
        names = []
    for name in names:
        full = os.path.join(CONFIG.output_dir, name)
        if not os.path.isfile(full):
            continue
        try:
            stat = os.stat(full)
        except OSError:
            continue
        items.append({
            "filename": name,
            "localPath": f"output/{name}",
            "url": f"/output/{name}",
            "size": stat.st_size,
            "updatedAt": int(stat.st_mtime),
        })
    items.sort(key=lambda item: item["updatedAt"], reverse=True)
    _json_response(handler, HTTPStatus.OK,
                   {"items": items, "total": len(items), "nextOffset": None, "hasMore": False})


# --------------------------------------------------------------------------
# 集合型资源：素材库与工作流（一个实体一个 JSON 文件，文件名即 <id>.json）
# --------------------------------------------------------------------------

_ASSET_STORE: JsonFileStore | None = None
_WORKFLOW_STORE: JsonFileStore | None = None


def _asset_store() -> JsonFileStore:
    global _ASSET_STORE
    if _ASSET_STORE is None:
        _ASSET_STORE = JsonFileStore(CONFIG.assets_dir)
    return _ASSET_STORE


def _workflow_store() -> JsonFileStore:
    global _WORKFLOW_STORE
    if _WORKFLOW_STORE is None:
        _WORKFLOW_STORE = JsonFileStore(CONFIG.workflows_dir)
    return _WORKFLOW_STORE


def _valid_entity_id(raw: object) -> str | None:
    entity_id = str(raw or "").strip()
    if not entity_id or len(entity_id) > 200:
        return None
    if "/" in entity_id or "\\" in entity_id or entity_id.startswith("."):
        return None
    return entity_id


def _collection_list(store: JsonFileStore) -> list[dict]:
    items: list[dict] = []
    for filename in store.list_names(".json"):
        data = store.read(filename)
        if isinstance(data, dict):
            items.append(data)
    return items


def _collection_save(handler: BaseHTTPRequestHandler, store: JsonFileStore,
                     redirect: tuple[str, ...]) -> None:
    body = handler.json_body
    if body is _INVALID_BODY or not isinstance(body, dict):
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "invalid json body"})
        return

    entity_id = _valid_entity_id(body.get("id"))
    if entity_id is None:
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "missing or invalid id"})
        return

    if not store.write(f"{entity_id}.json", body):
        _json_response(handler, HTTPStatus.INTERNAL_SERVER_ERROR,
                       {"success": False, "error": "failed to write record"})
        return

    payload: dict[str, object] = {"success": True, "id": entity_id}
    for key in redirect:
        payload[key] = entity_id
    _json_response(handler, HTTPStatus.OK, payload)


def _collection_delete(handler: BaseHTTPRequestHandler, store: JsonFileStore,
                       prefix: str) -> None:
    name = unquote(urlparse(handler.path).path[len(prefix):])
    if not name or "/" in name or "\\" in name or name.startswith("."):
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "invalid name"})
        return
    if not name.endswith(".json"):
        name += ".json"
    if not store.delete(name):
        _json_response(handler, HTTPStatus.NOT_FOUND,
                       {"success": False, "error": "not found"})
        return
    _json_response(handler, HTTPStatus.OK, {"success": True})


def _handle_assets_list(handler: BaseHTTPRequestHandler) -> None:
    # 渲染层同时接受裸数组与 {items,...} 两种形态，这里给数组。
    # 注意：查询参数（分类/搜索）暂未参与过滤，后续按真实语义补。
    _json_response(handler, HTTPStatus.OK, _collection_list(_asset_store()))


def _handle_assets_save(handler: BaseHTTPRequestHandler) -> None:
    _collection_save(handler, _asset_store(), ("assetId",))


def _handle_assets_delete(handler: BaseHTTPRequestHandler) -> None:
    _collection_delete(handler, _asset_store(), "/api/v2/assets/")


def _handle_workflows_list(handler: BaseHTTPRequestHandler) -> None:
    _json_response(handler, HTTPStatus.OK, _collection_list(_workflow_store()))


def _handle_workflows_save(handler: BaseHTTPRequestHandler) -> None:
    _collection_save(handler, _workflow_store(), ())


def _handle_workflows_delete(handler: BaseHTTPRequestHandler) -> None:
    _collection_delete(handler, _workflow_store(), "/api/v2/workflows/")


def _handle_output_delete(handler: BaseHTTPRequestHandler) -> None:
    """删除产物文件。只允许删除 output/ 下的文件。"""
    body = handler.json_body
    if body is _INVALID_BODY or not isinstance(body, dict):
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "invalid json body"})
        return

    raw_paths = body.get("localPaths")
    deleted: list[str] = []
    missing: list[str] = []

    for raw in (raw_paths if isinstance(raw_paths, list) else []):
        relative = _normalized_relative(str(raw or "").lstrip("/"))
        if not relative or not relative.startswith("output/"):
            missing.append(raw)
            continue
        target = os.path.abspath(os.path.join(CONFIG.storage_root, relative))
        if not target.startswith(CONFIG.storage_root + os.sep) or not os.path.isfile(target):
            missing.append(raw)
            continue
        try:
            os.remove(target)
            deleted.append(raw)
        except OSError:
            missing.append(raw)

    _json_response(handler, HTTPStatus.OK, {
        "success": True,
        "deleted": deleted,
        "deletedDerivatives": [],
        "missing": missing,
    })


# --------------------------------------------------------------------------
# 缩略图保存（渲染层传来 data URL，落盘后回一个可用的 localPath）
# --------------------------------------------------------------------------

_DATA_URL_RE = re.compile(r"^data:image/([a-zA-Z0-9.+-]+);base64,(.*)$", re.DOTALL)


def _servable_relative(path: str) -> str | None:
    """若绝对路径落在可对外提供的前缀下，返回其相对形式；否则 None。"""
    try:
        relative = os.path.relpath(path, CONFIG.storage_root).replace("\\", "/")
    except ValueError:
        return None
    if relative.startswith(".."):
        return None
    return relative if any(relative.startswith(p) for p in _MEDIA_URL_PREFIXES) else None


def _save_data_url(data_url: str, target_dir: str, base_name: str) -> tuple[str | None, str | None]:
    """把 data URL 写成文件。返回 (相对路径, 错误信息)。"""
    match = _DATA_URL_RE.match(str(data_url or ""))
    if not match:
        return None, "invalid data url"

    ext = match.group(1).lower().replace("jpeg", "jpg")
    if not ext.isalnum() or len(ext) > 8:
        ext = "png"

    try:
        blob = base64.b64decode(match.group(2), validate=False)
    except (ValueError, TypeError):
        return None, "invalid base64 payload"

    filename = f"{base_name}.{ext}"
    target = os.path.join(target_dir, filename)
    try:
        os.makedirs(target_dir, exist_ok=True)
        with open(target, "wb") as fh:
            fh.write(blob)
    except OSError as exc:
        return None, f"cannot write thumbnail: {exc}"

    return _servable_relative(target), None


def _handle_thumb_save(handler: BaseHTTPRequestHandler, target_dir: str,
                       id_field: str) -> None:
    body = handler.json_body
    if body is _INVALID_BODY or not isinstance(body, dict):
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "invalid json body"})
        return

    entity_id = _valid_entity_id(body.get(id_field) or body.get("id"))
    if entity_id is None:
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": f"missing {id_field}"})
        return

    relative, error = _save_data_url(str(body.get("dataUrl") or ""), target_dir, entity_id)
    if error:
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": error})
        return

    payload: dict[str, object] = {"success": True}
    if relative:
        payload["localPath"] = relative
        payload["url"] = "/" + relative
    _json_response(handler, HTTPStatus.OK, payload)


def _handle_asset_thumb_save(handler: BaseHTTPRequestHandler) -> None:
    _handle_thumb_save(handler, os.path.join(CONFIG.assets_dir, "thumbs"), "assetId")


def _handle_output_video_thumbnail(handler: BaseHTTPRequestHandler) -> None:
    _handle_thumb_save(handler, os.path.join(CONFIG.output_dir, "thumbs"), "localPath")


# --------------------------------------------------------------------------
# 图片派生图（显示图/缩略图）
# --------------------------------------------------------------------------

_DERIVATIVE_DISPLAY_MAX_SIDE = 1600
_DERIVATIVE_THUMB_MAX_SIDE = 384


def _handle_image_derivatives_ensure(handler: BaseHTTPRequestHandler) -> None:
    """POST /api/v2/images/derivatives/ensure：为已落盘原图生成显示图与缩略图。

    渲染层契约：displayLocalPath / thumbLocalPath 必须非空且不同于原图路径，
    originalLocalPath 必须与入参一致，否则视为失败。
    """
    body = handler.json_body
    if body is _INVALID_BODY or not isinstance(body, dict):
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "invalid json body"})
        return

    relative = _normalized_relative(str(body.get("localPath") or "").lstrip("/"))
    if not relative:
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "missing localPath"})
        return
    original = os.path.abspath(os.path.join(CONFIG.storage_root, relative))
    if not original.startswith(CONFIG.storage_root + os.sep) or not os.path.isfile(original):
        _json_response(handler, HTTPStatus.NOT_FOUND,
                       {"success": False, "error": f"original not found: {relative}"})
        return

    try:
        from PIL import Image  # 延迟导入：仅该路由需要 Pillow

        with Image.open(original) as opened:
            if opened.mode == "P":
                opened = opened.convert("RGBA")
            elif opened.mode not in ("RGB", "RGBA", "L", "LA"):
                opened = opened.convert("RGB")
            width, height = opened.size
            derivatives_dir = os.path.join(os.path.dirname(original), "derivatives")
            os.makedirs(derivatives_dir, exist_ok=True)
            stem = os.path.splitext(os.path.basename(original))[0]
            produced: dict[str, str] = {}
            for kind, max_side in (("display", _DERIVATIVE_DISPLAY_MAX_SIDE),
                                   ("thumb", _DERIVATIVE_THUMB_MAX_SIDE)):
                target = os.path.join(derivatives_dir, f"{stem}.{kind}.webp")
                if not os.path.isfile(target):
                    worker = opened.copy()
                    worker.thumbnail((max_side, max_side))
                    worker.save(target, "WEBP", quality=86)
                produced[kind] = target

        display_relative = _servable_relative(produced["display"])
        thumb_relative = _servable_relative(produced["thumb"])
        if not display_relative or not thumb_relative:
            _json_response(handler, HTTPStatus.INTERNAL_SERVER_ERROR,
                           {"success": False, "error": "derivatives outside storage root"})
            return
        _json_response(handler, HTTPStatus.OK, {
            "success": True,
            "localPath": relative,
            "originalLocalPath": relative,
            "displayLocalPath": display_relative,
            "thumbLocalPath": thumb_relative,
            "originalWidth": width,
            "originalHeight": height,
        })
    except Exception as exc:  # noqa: BLE001 - 统一转为失败响应
        _json_response(handler, HTTPStatus.INTERNAL_SERVER_ERROR,
                       {"success": False, "error": f"derivatives failed: {exc}"})


def _make_success_handler(data: object = None):
    """旧封装 {success, data} 的成功响应。"""
    return _make_constant_handler({"success": True, "data": data})


# --------------------------------------------------------------------------
# 剧本工作室：文档抽取
# --------------------------------------------------------------------------

def _handle_story_document_extract(handler: BaseHTTPRequestHandler) -> None:
    """POST /api/v2/story-workspace/document/extract：multipart 上传文档，返回纯文本。

    响应为裸 JSON（无 {success, data} 封装），渲染层直接读 res.text。
    """
    content_type = handler.headers.get("Content-Type", "")
    try:
        _fields, files = proxy_service.parse_multipart(
            getattr(handler, "_raw_body", b""), content_type)
    except proxy_service.ProxyError as exc:
        _json_response(handler, exc.status, {"error": exc.message})
        return

    if not files:
        _json_response(handler, HTTPStatus.BAD_REQUEST, {"error": "缺少上传的文档文件。"})
        return

    _field_name, filename, payload = files[0]
    try:
        text, extension, warnings = document_text_service.extract_document_text(filename, payload)
    except document_text_service.DocumentExtractionError as exc:
        _json_response(handler, HTTPStatus.BAD_REQUEST, {"error": exc.message})
        return
    except Exception as exc:  # noqa: BLE001
        _json_response(handler, HTTPStatus.INTERNAL_SERVER_ERROR,
                       {"error": f"文档解析失败：{exc}"})
        return

    _json_response(handler, HTTPStatus.OK, {
        "text": text,
        "characterCount": len(text),
        "extension": extension,
        "warnings": warnings,
    })


# --------------------------------------------------------------------------
# 模型包类功能（人物替换 / 3D 场景）
#
# 这些功能依赖体积很大的本地模型包（GB 级），原版由厂商源分发。
# 本版本不内置下载服务，但**接口契约要完整**：返回明确的"未安装"状态，
# 让界面能给出可操作提示，而不是抛 404 让用户看到无意义的报错。
# --------------------------------------------------------------------------

_MODEL_PACK_LABELS = {
    "person-replacement": "人物识别",
    "storyboard3d": "3D 场景",
}


def _handle_model_pack_status(handler: BaseHTTPRequestHandler, pack: str) -> None:
    _json_response(handler, HTTPStatus.OK, {
        "state": "not-installed",
        "installed": False,
        "downloadedBytes": 0,
        "totalBytes": 0,
        "percent": 0,
        "currentSource": "",
        "completedSources": 0,
        "totalSources": 0,
        "message": f"{_MODEL_PACK_LABELS.get(pack, pack)} 模型包尚未安装。",
    })


def _handle_model_pack_install(handler: BaseHTTPRequestHandler, pack: str) -> None:
    label = _MODEL_PACK_LABELS.get(pack, pack)
    _json_response(handler, HTTPStatus.OK, {
        "success": False,
        "state": "not-installed",
        "error": f"{label} 模型包需从厂商源下载，本版本未内置该下载服务。",
    })


def _handle_model_pack_required(handler: BaseHTTPRequestHandler, pack: str) -> None:
    """需要模型包才能执行的操作。"""
    label = _MODEL_PACK_LABELS.get(pack, pack)
    _json_response(handler, HTTPStatus.SERVICE_UNAVAILABLE, {
        "success": False,
        "error": f"需要先安装{label}模型包。",
        "errorCode": "MODEL_PACK_REQUIRED",
    })


def _handle_story_asset_extract_local(handler: BaseHTTPRequestHandler) -> None:
    """剧本素材的本地抽取：依赖 paddlenlp/PP-UIE-0.5B，未内置。

    渲染层另有基于 LLM 的素材抽取路径（走 aiTextApi），是默认路径；
    这里是用户显式选择"本地抽取"时的备选，故给出明确的能力缺失说明。
    """
    _json_response(handler, HTTPStatus.SERVICE_UNAVAILABLE, {
        "success": False,
        "error": "本地素材抽取依赖 PP-UIE-0.5B 模型，本版本未内置。请改用 AI 抽取。",
        "errorCode": "LOCAL_EXTRACTION_UNAVAILABLE",
    })


# --------------------------------------------------------------------------
# 对象存储（S3 兼容：AWS S3 / 阿里云 OSS / 腾讯云 COS / Cloudflare R2）
#
# 上传请求是 multipart：config（JSON 字符串）+ mediaKind + file，
# 返回 {url}（公开访问地址）。
# --------------------------------------------------------------------------

_OBJECT_STORAGE_KIND_FALLBACK_EXT = {"image": "png", "video": "mp4", "audio": "mp3"}


def _handle_object_storage_test(handler: BaseHTTPRequestHandler) -> None:
    body = handler.json_body
    if body is _INVALID_BODY or not isinstance(body, dict):
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "invalid json body"})
        return
    try:
        result = object_storage_service.test_connection(body.get("config") or body)
    except object_storage_service.ObjectStorageError as exc:
        _json_response(handler, HTTPStatus.OK, {"success": False, "error": exc.message})
        return
    except Exception as exc:  # noqa: BLE001
        _json_response(handler, HTTPStatus.OK, {"success": False, "error": f"连接测试失败：{exc}"})
        return
    _json_response(handler, HTTPStatus.OK, result)


def _handle_object_storage_upload(handler: BaseHTTPRequestHandler) -> None:
    content_type = handler.headers.get("Content-Type", "")
    try:
        fields, files = proxy_service.parse_multipart(
            getattr(handler, "_raw_body", b""), content_type)
    except proxy_service.ProxyError as exc:
        _json_response(handler, exc.status, {"success": False, "error": exc.message})
        return

    if not files:
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "缺少待上传的文件。"})
        return

    media_kind = str(fields.get("mediaKind") or "image").strip().lower()
    _field_name, filename, payload = files[0]

    ext = os.path.splitext(filename)[1].lstrip(".").lower()
    if not ext or not ext.isalnum():
        ext = _OBJECT_STORAGE_KIND_FALLBACK_EXT.get(media_kind, "bin")

    key = f"aic/{media_kind}/{int(time.time() * 1000)}-{uuid.uuid4().hex[:8]}.{ext}"
    guessed = _guess_content_type(filename) or "application/octet-stream"

    try:
        url = object_storage_service.upload_object(fields.get("config"), key, payload, guessed)
    except object_storage_service.ObjectStorageError as exc:
        _json_response(handler, exc.status, {"success": False, "error": exc.message})
        return
    except Exception as exc:  # noqa: BLE001
        _json_response(handler, HTTPStatus.BAD_GATEWAY,
                       {"success": False, "error": f"对象存储上传失败：{exc}"})
        return

    _json_response(handler, HTTPStatus.OK, {"success": True, "url": url, "key": key})


# 应用配置（供应商 baseUrl、开关等**非敏感**字段）。
# 供应商 API 密钥不在这里：它们由 Electron 主进程用 safeStorage 加密保存，
# 渲染层经 preload 的 secureSettings IPC 读写，代理请求时随请求体带给后端。
# 注意本路由使用旧的 {success, data} 封装，与 /api/v2/* 的裸 JSON 不同。
def _handle_app_config(handler: BaseHTTPRequestHandler) -> None:
    store = _user_store()
    if handler.command == "POST":
        body = handler.json_body
        if body is _INVALID_BODY:
            _json_response(handler, HTTPStatus.BAD_REQUEST,
                           {"success": False, "error": "invalid json body"})
            return
        ok = store.write("config.json", body)
        _json_response(handler, HTTPStatus.OK if ok else HTTPStatus.INTERNAL_SERVER_ERROR,
                       {"success": ok, "data": None})
        return
    _json_response(handler, HTTPStatus.OK,
                   {"success": True, "data": store.read("config.json", {})})


PROJECT_SUFFIX = ".aicanvas"


def _project_filename(raw: str) -> str | None:
    """把项目名规范为文件名：补后缀，并拒绝路径穿越与隐藏文件。"""
    name = unquote(raw or "").strip()
    if not name:
        return None
    if not name.endswith(PROJECT_SUFFIX):
        name += PROJECT_SUFFIX
    if "/" in name or "\\" in name or name.startswith("."):
        return None
    return name


def _project_request_name(handler: BaseHTTPRequestHandler) -> str | None:
    return _project_filename(urlparse(handler.path).path[len("/api/v2/projects/"):])


def _handle_project_json(handler: BaseHTTPRequestHandler) -> None:
    filename = _project_request_name(handler)
    data = _canvas_store().read(filename) if filename else None
    if data is None:
        # 项目不存在。渲染层对这类请求使用 allow404Null，404 即表示"暂无项目"。
        _json_response(handler, HTTPStatus.NOT_FOUND,
                       {"success": False, "error": "project not found"})
        return
    _json_response(handler, HTTPStatus.OK, data)


def _handle_project_save(handler: BaseHTTPRequestHandler) -> None:
    body = handler.json_body
    if body is _INVALID_BODY or not isinstance(body, dict):
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "invalid project payload"})
        return

    filename = _project_filename(str(body.get("projectName") or ""))
    if filename is None:
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "invalid project name"})
        return

    if not _canvas_store().write(filename, body):
        _json_response(handler, HTTPStatus.INTERNAL_SERVER_ERROR,
                       {"success": False, "error": "failed to write project"})
        return

    # 渲染层从响应里取 filename 回写 currentProjectId（见 projectService._persistProjectSnapshot）
    _json_response(handler, HTTPStatus.OK, {"success": True, "filename": filename})


def _handle_project_list(handler: BaseHTTPRequestHandler) -> None:
    store = _canvas_store()
    items = []
    for filename in store.list_names(PROJECT_SUFFIX):
        stem = filename[: -len(PROJECT_SUFFIX)]
        item: dict[str, object] = {"filename": filename, "name": stem, "projectName": stem}
        data = store.read(filename)
        if isinstance(data, dict):
            if isinstance(data.get("activeCanvasId"), str):
                item["activeCanvasId"] = data["activeCanvasId"]
            canvases = data.get("canvases")
            if isinstance(canvases, list):
                item["canvasCount"] = len(canvases)
        try:
            item["updatedAt"] = int(os.path.getmtime(store.resolve(filename) or ""))
        except (OSError, TypeError, ValueError):
            pass
        items.append(item)
    _json_response(handler, HTTPStatus.OK, items)


def _handle_project_delete(handler: BaseHTTPRequestHandler) -> None:
    filename = _project_request_name(handler)
    if filename is None or not _canvas_store().delete(filename):
        _json_response(handler, HTTPStatus.NOT_FOUND,
                       {"success": False, "error": "project not found"})
        return
    _json_response(handler, HTTPStatus.OK, {"success": True})


def _handle_project_rename(handler: BaseHTTPRequestHandler) -> None:
    filename = _project_request_name(handler)
    body = handler.json_body
    if filename is None or not isinstance(body, dict):
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "invalid rename request"})
        return

    target = _project_filename(str(body.get("name") or ""))
    if target is None:
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "invalid project name"})
        return

    store = _canvas_store()
    data = store.read(filename)
    if data is None:
        _json_response(handler, HTTPStatus.NOT_FOUND,
                       {"success": False, "error": "project not found"})
        return
    if isinstance(data, dict):
        stem = target[: -len(PROJECT_SUFFIX)]
        data["projectName"] = stem
    if not store.write(target, data):
        _json_response(handler, HTTPStatus.INTERNAL_SERVER_ERROR,
                       {"success": False, "error": "failed to write project"})
        return
    if target != filename:
        store.delete(filename)
    _json_response(handler, HTTPStatus.OK, {"success": True, "filename": target})


def _make_constant_handler(payload: object):
    """返回固定 JSON 的路由。用于尚未落地实现的查询类接口。"""
    def _handler(handler: BaseHTTPRequestHandler) -> None:
        _json_response(handler, HTTPStatus.OK, payload)
    return _handler


# Canvas MCP 的 poll 是长轮询：渲染层在 `while (会话有效)` 循环里不断 poll，
# 拿到 request 才去执行。若立即返回空，循环会退化成紧循环（实测每秒上百次请求）。
# 原版后端在此处阻塞等待，本实现沿用该设计。
MCP_POLL_TIMEOUT_SEC = 20.0


def _handle_canvas_mcp_control(handler: BaseHTTPRequestHandler) -> None:
    body = handler.json_body
    if body is _INVALID_BODY or not isinstance(body, dict):
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"ok": False, "errorCode": "BAD_REQUEST", "message": "invalid body"})
        return

    action = str(body.get("action") or "")

    if action == "enable":
        # 必须把请求里的 binding 原样回传：渲染层会用响应对象拼出会话，
        # 并用 `session.binding === getBinding()` 做绑定校验。
        # 之前漏了该字段，导致校验恒失败 → 每次都 disable 后重连，形成 ~1 次/秒的抖动循环。
        _json_response(handler, HTTPStatus.OK, {
            "ok": True,
            "id": uuid.uuid4().hex,
            "url": f"http://{CONFIG.host}:{CONFIG.port}/api/v2/canvas-mcp",
            "token": CONFIG.token or "",
            "binding": body.get("binding") or "",
        })
        return

    if action == "poll":
        time.sleep(MCP_POLL_TIMEOUT_SEC)
        _json_response(handler, HTTPStatus.OK, {"ok": True, "request": None})
        return

    # complete / disable 等其余动作
    _json_response(handler, HTTPStatus.OK, {"ok": True})


# --------------------------------------------------------------------------
# 厂商出站代理（/api/v2/proxy/*）
# --------------------------------------------------------------------------

def _raw_response(handler: BaseHTTPRequestHandler, status: int, body: bytes,
                  content_type: str = "application/json",
                  extra_headers: dict[str, str] | None = None) -> None:
    """原样回传厂商响应体。厂商的业务错误由渲染层按自家规则解析，代理层不介入。"""
    try:
        handler.send_response(status)
        handler.send_header("Content-Type", content_type)
        handler.send_header("Content-Length", str(len(body)))
        handler.send_header("Cache-Control", "no-store")
        for key, value in (extra_headers or {}).items():
            handler.send_header(key, value)
        handler.end_headers()
        if body:
            handler.wfile.write(body)
    except (BrokenPipeError, ConnectionResetError):
        pass


def _proxy_ok(handler: BaseHTTPRequestHandler, result: tuple[bytes, str]) -> None:
    body, content_type = result
    # 关键：厂商响应一律回 200。渲染层调用 parseError(provider, body, 200)，
    # 由它自己从响应体里识别厂商错误码（401/余额不足/参数错误等）。
    _raw_response(handler, HTTPStatus.OK, body, content_type)


def _proxy_failure(handler: BaseHTTPRequestHandler, exc: Exception) -> None:
    if isinstance(exc, proxy_service.ProxyError):
        _json_response(handler, exc.status, {"success": False, "error": exc.message})
        return
    _json_response(handler, HTTPStatus.BAD_GATEWAY,
                   {"success": False, "error": f"proxy error: {exc}"})


def _handle_proxy_json(handler: BaseHTTPRequestHandler) -> None:
    """POST /api/v2/proxy/image 与 /api/v2/proxy/completions：密钥在请求体里。"""
    body = handler.json_body
    if body is _INVALID_BODY:
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "invalid json body"})
        return
    try:
        _proxy_ok(handler, proxy_service.forward_json(body))
    except Exception as exc:  # noqa: BLE001 - 统一转为代理层错误响应
        _proxy_failure(handler, exc)


def _handle_proxy_task(handler: BaseHTTPRequestHandler) -> None:
    """GET /api/v2/proxy/task?apiUrl=...：鉴权头由渲染层直接给出。"""
    params = parse_qs(urlparse(handler.path).query)
    target = (params.get("apiUrl") or [""])[0]
    try:
        _proxy_ok(handler, proxy_service.forward_get(target, dict(handler.headers)))
    except Exception as exc:  # noqa: BLE001
        _proxy_failure(handler, exc)


def _handle_proxy_task_post(handler: BaseHTTPRequestHandler) -> None:
    """POST /api/v2/proxy/task?apiUrl=...：语音探针/语音合成等带鉴权头的 JSON POST。

    与 GET 形态不同：厂商状态码与 x-api-status/x-api-message 探针头原样回传，
    渲染层据此区分鉴权失败、参数校验失败与地址错误。
    """
    params = parse_qs(urlparse(handler.path).query)
    target = (params.get("apiUrl") or [""])[0]
    try:
        status, body, content_type, extra = proxy_service.forward_post_passthrough(
            target, getattr(handler, "_raw_body", b""), dict(handler.headers))
    except Exception as exc:  # noqa: BLE001
        _proxy_failure(handler, exc)
        return
    _raw_response(handler, status, body, content_type, extra)


def _handle_proxy_raw_upload(handler: BaseHTTPRequestHandler) -> None:
    """POST /api/v2/proxy/upload?apiUrl=...：multipart 原始字节原样转发。"""
    params = parse_qs(urlparse(handler.path).query)
    target = (params.get("apiUrl") or [""])[0]
    content_type = handler.headers.get("Content-Type", "")
    try:
        _proxy_ok(handler, proxy_service.forward_raw(
            target, getattr(handler, "_raw_body", b""), content_type, dict(handler.headers)))
    except Exception as exc:  # noqa: BLE001
        _proxy_failure(handler, exc)


def _handle_proxy_apimart_upload(handler: BaseHTTPRequestHandler) -> None:
    """POST /api/v2/proxy/apimart-upload：解析 multipart 后重新上报到 APIMART。"""
    content_type = handler.headers.get("Content-Type", "")
    try:
        _proxy_ok(handler, proxy_service.forward_apimart_upload(
            getattr(handler, "_raw_body", b""), content_type))
    except Exception as exc:  # noqa: BLE001
        _proxy_failure(handler, exc)


def _handle_proxy_local_media(handler: BaseHTTPRequestHandler) -> None:
    """POST /api/v2/proxy/upload-local-media?apiUrl=...：读取本地文件后上传。"""
    params = parse_qs(urlparse(handler.path).query)
    body = handler.json_body
    if body is _INVALID_BODY or not isinstance(body, dict):
        _json_response(handler, HTTPStatus.BAD_REQUEST,
                       {"success": False, "error": "invalid json body"})
        return
    target = (params.get("apiUrl") or [""])[0]
    if target:
        body = {**body, "apiUrl": target}
    try:
        _proxy_ok(handler, proxy_service.forward_local_media(body))
    except Exception as exc:  # noqa: BLE001
        _proxy_failure(handler, exc)


# --------------------------------------------------------------------------
# 即梦（Dreamina）CLI 登录：OAuth Device Flow
# --------------------------------------------------------------------------
# 渲染层（appTopbarDreaminaSession.js + dreaminaCliApi.js）通过 /api/v2/dreamina/*
# 驱动即梦官方 CLI 完成登录。这些端点用 apiBase 的 get/post/request 调用，后者会把
# HTTP 裸响应体自动包进 {success, data}，故此处一律返回**裸对象**（不要再包一层）。
#
# 登录流程：
#   1) POST /login/web -> 同步执行 `dreamina login --headless`，解析 device flow，
#      置 phase=oauth_ready，并起后台线程执行 `login checklogin --device_code --poll`
#      持续轮询授权结果；
#   2) 渲染层每 800ms GET /login/runtime 读取 phase/authorizeUrl，引导用户在浏览器授权；
#   3) 授权成功后后台线程置 phase=success，并用 `user_credit` 探测登录态与积分。

_DREAMINA_LOCK = threading.Lock()
_DREAMINA_CREDIT_TTL = 5.0
_DREAMINA_DEFAULT_POLL_SEC = 300


def _dreamina_new_runtime() -> dict:
    return {
        "active": False,
        "phase": "idle",
        "loginMode": "",
        "startedAt": 0,
        "completedAt": 0,
        "authorizeUrl": "",
        "callbackUrl": "",
        "qrAvailable": False,
        "qrVersion": "",
        "outputTail": [],
        "message": "",
        "error": "",
    }


_DREAMINA_RUNTIME: dict = _dreamina_new_runtime()
_DREAMINA_CREDIT_CACHE: dict = {"at": 0.0, "loggedIn": False, "credit": None}
# 会话代号：每次发起登录/登出自增，用于让陈旧的后台轮询线程不再覆盖新会话状态。
_DREAMINA_GEN: int = 0


def _dreamina_now_ms() -> int:
    return int(time.time() * 1000)


def _dreamina_cli_path() -> str:
    """解析即梦 CLI 可执行文件路径。优先环境变量，其次运行时目录约定。"""
    env_path = os.environ.get("AIC_DREAMINA_CLI_EXE", "").strip()
    if env_path and os.path.exists(env_path):
        return env_path
    exe_name = "dreamina.exe" if os.name == "nt" else "dreamina"
    roots: list[str] = []
    app_root = os.environ.get("AIC_APP_ROOT", "").strip()
    if app_root:
        roots.append(app_root)
    roots.append(os.path.dirname(os.path.abspath(__file__)))
    meipass = getattr(sys, "_MEIPASS", "")
    if meipass:
        roots.append(str(meipass))
    for root in roots:
        cand = os.path.join(root, ".electron-runtime", "runtime", "dreamina", exe_name)
        if os.path.exists(cand):
            return cand
    return env_path


def _dreamina_decode(raw: bytes) -> str:
    if not raw:
        return ""
    for enc in ("utf-8", "gbk"):
        try:
            return raw.decode(enc)
        except Exception:  # noqa: BLE001
            continue
    return raw.decode("utf-8", errors="replace")


def _dreamina_run(args: list[str], timeout: int = 30) -> tuple[int, str]:
    """执行即梦 CLI，返回 (returncode, stdout+stderr 合并文本)。"""
    cli = _dreamina_cli_path()
    if not cli or not os.path.exists(cli):
        raise RuntimeError("未找到即梦 CLI（dreamina.exe），请确认运行时资源已就绪。")
    creationflags = getattr(subprocess, "CREATE_NO_WINDOW", 0)
    try:
        proc = subprocess.run(
            [cli, *args],
            capture_output=True,
            timeout=timeout,
            creationflags=creationflags,
        )
    except subprocess.TimeoutExpired:
        raise RuntimeError(f"即梦 CLI 执行超时：{' '.join(args)}")
    out = _dreamina_decode(proc.stdout or b"")
    err = _dreamina_decode(proc.stderr or b"")
    text = (out + ("\n" + err if err else "")).strip()
    return proc.returncode, text


def _dreamina_parse_credit(text: str):
    """从 user_credit 输出中尽力解析积分字段；解析不到则返回 None。"""
    if not text:
        return None
    try:
        data = json.loads(text)
        if isinstance(data, dict):
            return {
                "total_credit": data.get("total_credit", 0),
                "vip_credit": data.get("vip_credit", 0),
                "gift_credit": data.get("gift_credit", 0),
                "purchase_credit": data.get("purchase_credit", 0),
            }
    except Exception:  # noqa: BLE001
        pass
    credit: dict = {}
    for key in ("total_credit", "vip_credit", "gift_credit", "purchase_credit"):
        m = re.search(key + r"[\"'\s:=]*([0-9]+)", text)
        if m:
            credit[key] = int(m.group(1))
    if not credit:
        m = re.search(r"([0-9]+)", text)
        if m:
            credit["total_credit"] = int(m.group(1))
    return credit or None


def _dreamina_probe_login(force: bool = False):
    """通过 user_credit 探测登录态；带短 TTL 缓存，避免频繁调用 CLI。"""
    now = time.time()
    with _DREAMINA_LOCK:
        cache = _DREAMINA_CREDIT_CACHE
        if not force and cache.get("at") and (now - cache["at"]) < _DREAMINA_CREDIT_TTL:
            return cache["loggedIn"], cache["credit"]
    logged_in = False
    credit = None
    try:
        code, text = _dreamina_run(["user_credit"], timeout=20)
        logged_in = code == 0
        if logged_in:
            credit = _dreamina_parse_credit(text)
    except Exception:  # noqa: BLE001
        logged_in = False
    with _DREAMINA_LOCK:
        _DREAMINA_CREDIT_CACHE.update({"at": now, "loggedIn": logged_in, "credit": credit})
    return logged_in, credit


def _dreamina_parse_device_flow(text: str) -> dict:
    def grab(key: str) -> str:
        m = re.search(key + r"\s*[:：]\s*(\S+)", text or "")
        return m.group(1).strip() if m else ""
    return {
        "verification_uri": grab("verification_uri"),
        "user_code": grab("user_code"),
        "device_code": grab("device_code"),
        "poll_interval": grab("poll_interval"),
        "expires_at": grab("expires_at"),
    }


def _dreamina_poll_seconds(expires_at: str) -> int:
    if not expires_at:
        return _DREAMINA_DEFAULT_POLL_SEC
    try:
        from datetime import datetime
        dt = datetime.fromisoformat(expires_at)
        remain = int((dt - datetime.now(dt.tzinfo)).total_seconds())
        return max(30, min(remain - 5, 900))
    except Exception:  # noqa: BLE001
        return _DREAMINA_DEFAULT_POLL_SEC


def _dreamina_append_tail_locked(text: str) -> None:
    if not text:
        return
    lines = [ln.rstrip() for ln in text.splitlines() if ln.strip()]
    tail = _DREAMINA_RUNTIME["outputTail"]
    tail.extend(lines)
    if len(tail) > 40:
        del tail[:-40]


def _dreamina_runtime_snapshot() -> dict:
    with _DREAMINA_LOCK:
        snap = dict(_DREAMINA_RUNTIME)
        snap["outputTail"] = list(_DREAMINA_RUNTIME["outputTail"])
        return snap


def _dreamina_status_payload() -> dict:
    runtime = _dreamina_runtime_snapshot()
    logged_in, credit = _dreamina_probe_login(force=False)
    installed = bool(_dreamina_cli_path())
    return {
        "loggedIn": logged_in,
        "available": installed,
        "installed": installed,
        "credit": credit,
        "runtime": runtime,
        "message": "",
    }


def _dreamina_poll_worker(device_code: str, poll_seconds: int, gen: int) -> None:
    """后台线程：轮询 OAuth 授权结果，直到成功/失败/超时。"""
    with _DREAMINA_LOCK:
        if _DREAMINA_GEN != gen:
            return
        _DREAMINA_RUNTIME["phase"] = "polling"
    timeout = max(30, poll_seconds + 15)
    code = 1
    text = ""
    try:
        code, text = _dreamina_run(
            ["login", "checklogin", f"--device_code={device_code}", f"--poll={poll_seconds}"],
            timeout=timeout,
        )
    except Exception as exc:  # noqa: BLE001
        with _DREAMINA_LOCK:
            if _DREAMINA_GEN != gen:
                return
            _DREAMINA_RUNTIME.update({
                "phase": "failed", "active": False, "completedAt": _dreamina_now_ms(),
                "error": str(exc),
            })
        return
    logged_in, _credit = _dreamina_probe_login(force=True)
    with _DREAMINA_LOCK:
        if _DREAMINA_GEN != gen:
            return
        _dreamina_append_tail_locked(text)
        if code == 0 or logged_in:
            _DREAMINA_RUNTIME.update({
                "phase": "success", "active": False, "completedAt": _dreamina_now_ms(),
                "message": "登录成功", "error": "",
            })
        else:
            _DREAMINA_RUNTIME.update({
                "phase": "failed", "active": False, "completedAt": _dreamina_now_ms(),
                "error": text or "登录未完成或授权超时",
            })


def _dreamina_start_login(mode: str = "web", force: bool = False,
                          relogin: bool = False) -> dict:
    """发起即梦登录：同步取 device flow，随后起后台线程轮询授权。"""
    global _DREAMINA_GEN
    with _DREAMINA_LOCK:
        if _DREAMINA_RUNTIME["active"] and not force:
            snap = dict(_DREAMINA_RUNTIME)
            snap["outputTail"] = list(_DREAMINA_RUNTIME["outputTail"])
            return snap
        _DREAMINA_GEN += 1
        gen = _DREAMINA_GEN
        _DREAMINA_RUNTIME.clear()
        _DREAMINA_RUNTIME.update(_dreamina_new_runtime())
        login_mode = "headless" if mode == "headless" else "web"
        _DREAMINA_RUNTIME.update({
            "active": True,
            "phase": "preparing",
            "loginMode": login_mode,
            "startedAt": _dreamina_now_ms(),
        })
    args = [("relogin" if relogin else "login"), "--headless"]
    try:
        code, text = _dreamina_run(args, timeout=30)
    except Exception as exc:  # noqa: BLE001
        with _DREAMINA_LOCK:
            _DREAMINA_RUNTIME.update({
                "phase": "failed", "active": False, "completedAt": _dreamina_now_ms(),
                "error": str(exc),
            })
        return _dreamina_runtime_snapshot()
    flow = _dreamina_parse_device_flow(text)
    device_code = flow.get("device_code", "")
    authorize_url = flow.get("verification_uri", "")
    poll_seconds = _dreamina_poll_seconds(flow.get("expires_at", ""))
    with _DREAMINA_LOCK:
        _dreamina_append_tail_locked(text)
        if code != 0 or not device_code:
            _DREAMINA_RUNTIME.update({
                "phase": "failed", "active": False, "completedAt": _dreamina_now_ms(),
                "error": text or "无法发起即梦登录（未获取到 device_code）",
            })
            failed = dict(_DREAMINA_RUNTIME)
            failed["outputTail"] = list(_DREAMINA_RUNTIME["outputTail"])
            return failed
        _DREAMINA_RUNTIME.update({
            "phase": "oauth_ready",
            "authorizeUrl": authorize_url,
            "message": "请在浏览器中完成即梦授权",
        })
    threading.Thread(
        target=_dreamina_poll_worker,
        args=(device_code, poll_seconds, gen),
        daemon=True,
    ).start()
    return _dreamina_runtime_snapshot()


def _handle_dreamina_status(handler: BaseHTTPRequestHandler) -> None:
    params = parse_qs(urlparse(handler.path).query)
    if params.get("refresh"):
        _dreamina_probe_login(force=True)
    _json_response(handler, HTTPStatus.OK, _dreamina_status_payload())


def _handle_dreamina_login_runtime(handler: BaseHTTPRequestHandler) -> None:
    _json_response(handler, HTTPStatus.OK, _dreamina_runtime_snapshot())


def _dreamina_login_response(handler: BaseHTTPRequestHandler) -> None:
    _json_response(handler, HTTPStatus.OK, {
        "status": _dreamina_status_payload(),
        "runtime": _dreamina_runtime_snapshot(),
    })


def _handle_dreamina_login_web(handler: BaseHTTPRequestHandler) -> None:
    body = handler.json_body
    force = bool(body.get("force")) if isinstance(body, dict) else False
    _dreamina_start_login(mode="web", force=force, relogin=False)
    _dreamina_login_response(handler)


def _handle_dreamina_login_headless(handler: BaseHTTPRequestHandler) -> None:
    _dreamina_start_login(mode="headless", force=True, relogin=False)
    _dreamina_login_response(handler)


def _handle_dreamina_relogin(handler: BaseHTTPRequestHandler) -> None:
    _dreamina_start_login(mode="headless", force=True, relogin=True)
    _dreamina_login_response(handler)


def _handle_dreamina_logout(handler: BaseHTTPRequestHandler) -> None:
    global _DREAMINA_GEN
    try:
        _dreamina_run(["logout"], timeout=20)
    except Exception:  # noqa: BLE001
        pass
    _dreamina_probe_login(force=True)
    with _DREAMINA_LOCK:
        # 作废任何在跑的轮询线程，避免它稍后覆盖已登出的状态。
        _DREAMINA_GEN += 1
        _DREAMINA_RUNTIME.clear()
        _DREAMINA_RUNTIME.update(_dreamina_new_runtime())
    _dreamina_login_response(handler)


def _handle_dreamina_login_import(handler: BaseHTTPRequestHandler) -> None:
    # 复刻版通过官方 CLI 的 OAuth Device Flow 登录，不接受外部粘贴登录态导入。
    logged_in, _credit = _dreamina_probe_login(force=True)
    if not logged_in:
        _json_response(handler, HTTPStatus.OK, {
            "success": False,
            "message": "当前不支持手动导入登录态，请点击“授权登录”通过浏览器完成即梦授权。",
            "status": _dreamina_status_payload(),
        })
        return
    _dreamina_login_response(handler)


# --------------------------------------------------------------------------
# 自定义中转站（模型发现 / 清单草稿 / 文档分析）
# 渲染层对每个路由都按 {success, data} 解包（见 customProviderDiscoveryApi.js），
# 且必须回 HTTP 200：404/5xx 会被 apiBase 当成空数据，界面显示"发现 0 个模型"
# 而不是真实错误，所以业务错误一律以 200 + {success:false,error} 回传。
# --------------------------------------------------------------------------

_CP_BUNDLE_STORE: BundleStore | None = None


def _custom_provider_bundle_store() -> BundleStore:
    global _CP_BUNDLE_STORE
    if _CP_BUNDLE_STORE is None:
        _CP_BUNDLE_STORE = BundleStore(
            os.path.join(CONFIG.data_dir, "custom-provider-bundles"))
    return _CP_BUNDLE_STORE


def _custom_provider_ok(handler: BaseHTTPRequestHandler, data: object) -> None:
    _json_response(handler, HTTPStatus.OK, {"success": True, "data": data})


def _custom_provider_error(handler: BaseHTTPRequestHandler, message: str) -> None:
    _json_response(handler, HTTPStatus.OK, {"success": False, "error": message})


def _custom_provider_body(handler: BaseHTTPRequestHandler) -> dict | None:
    body = handler.json_body
    if body is _INVALID_BODY or not isinstance(body, dict):
        return None
    return body


def _handle_custom_provider_call(handler, call) -> None:
    """统一封装：body 校验 + CustomProviderError -> 200 {success:false,error}。"""
    body = _custom_provider_body(handler)
    if body is None:
        _custom_provider_error(handler, "invalid json body")
        return
    try:
        _custom_provider_ok(handler, call(body))
    except CustomProviderError as exc:
        _custom_provider_error(handler, str(exc))
    except Exception as exc:  # noqa: BLE001
        _custom_provider_error(handler, f"中转站服务异常：{type(exc).__name__}: {exc}")


def _handle_custom_provider_discover(handler) -> None:
    _handle_custom_provider_call(handler, custom_provider_service.discover)


def _handle_custom_provider_build_draft(handler) -> None:
    _handle_custom_provider_call(handler, custom_provider_service.build_manifest_draft)


def _handle_custom_provider_validate_draft(handler) -> None:
    _handle_custom_provider_call(handler, custom_provider_service.validate_manifest_draft)


def _handle_custom_provider_analyze(handler) -> None:
    _handle_custom_provider_call(handler, custom_provider_service.analyze_documentation)


def _handle_custom_provider_save_bundle(handler) -> None:
    body = _custom_provider_body(handler)
    if body is None:
        _custom_provider_error(handler, "invalid json body")
        return
    try:
        _custom_provider_ok(handler, _custom_provider_bundle_store().save(body))
    except CustomProviderError as exc:
        _custom_provider_error(handler, str(exc))
    except Exception as exc:  # noqa: BLE001
        _custom_provider_error(handler, f"保存失败：{type(exc).__name__}: {exc}")


def _handle_custom_provider_list_bundles(handler) -> None:
    _custom_provider_ok(handler, {"items": _custom_provider_bundle_store().list()})


def _handle_custom_provider_delete_bundle(handler) -> None:
    prefix = "/api/v2/custom-providers/manifest-bundles/"
    source_id = unquote(urlparse(handler.path).path[len(prefix):]).strip()
    if not source_id:
        _custom_provider_error(handler, "invalid sourceId")
        return
    deleted = _custom_provider_bundle_store().delete(source_id)
    _custom_provider_ok(handler, {"deleted": deleted, "sourceId": source_id})


# 精确路由：(方法, 路径) -> 处理函数。
ROUTES: dict[tuple[str, str], object] = {
    ("GET", "/api/v2/runtime/info"): _handle_runtime_info,
    ("GET", "/api/v2/heartbeat_stream"): _handle_heartbeat_stream,
    ("GET", "/api/v2/user/presets"): _handle_user_presets,
    ("POST", "/api/v2/user/presets"): _handle_user_presets,
    ("GET", "/api/v2/user/presets/settings"): _handle_user_presets_settings,
    ("POST", "/api/v2/projects/save"): _handle_project_save,
    ("GET", "/api/v2/projects"): _handle_project_list,
    # 遗留路由（不在 /api/v2/ 下，用旧封装）
    ("GET", "/api/config"): _handle_app_config,
    ("POST", "/api/config"): _handle_app_config,
    ("GET", "/api/projects"): _handle_project_list,
    # 厂商出站代理（精确匹配的三个；带查询参数的走前缀路由）
    ("POST", "/api/v2/proxy/image"): _handle_proxy_json,
    ("POST", "/api/v2/proxy/completions"): _handle_proxy_json,
    ("POST", "/api/v2/proxy/apimart-upload"): _handle_proxy_apimart_upload,
    # 产物落盘
    ("POST", "/api/v2/save_output_from_url"): _handle_save_output_from_url,
    ("GET", "/api/v2/output-files"): _handle_output_files,
    # 占位实现：接受请求并返回成功/空数据，避免渲染层因启动期调用失败而中断。
    # 这些都需要在后续阶段按真实语义替换。
    ("POST", "/api/v2/app-activity/startup"): _make_constant_handler({"success": True}),
    ("POST", "/api/v2/canvas-mcp/control"): _handle_canvas_mcp_control,
    # 素材库与工作流（集合型 JSON 持久化）
    ("GET", "/api/v2/assets"): _handle_assets_list,
    ("POST", "/api/v2/assets/save"): _handle_assets_save,
    ("GET", "/api/v2/workflows"): _handle_workflows_list,
    ("POST", "/api/v2/workflows/save"): _handle_workflows_save,
    ("POST", "/api/v2/output-files/delete"): _handle_output_delete,
    ("POST", "/api/v2/assets/thumb/save"): _handle_asset_thumb_save,
    ("POST", "/api/v2/output-files/video-thumbnail"): _handle_output_video_thumbnail,
    ("POST", "/api/v2/images/derivatives/ensure"): _handle_image_derivatives_ensure,
    # 剧本工作室：文档抽取
    ("POST", "/api/v2/story-workspace/document/extract"): _handle_story_document_extract,
    # 对象存储（S3 兼容）
    ("POST", "/api/v2/object-storage/test"): _handle_object_storage_test,
    ("POST", "/api/v2/object-storage/upload"): _handle_object_storage_upload,
    # 本项目不做订阅门禁：激活/清除授权一律视为成功（见记忆 feedback-no-activation-gate）
    ("POST", "/api/v2/subscription/activate"): _make_success_handler(
        {"authorized": True, "vip": True}),
    ("POST", "/api/v2/subscription/authorization/clear"): _make_success_handler(None),
    # 自更新暂未接入自有更新源，先回"无更新"
    ("POST", "/api/v2/update/check"): _make_success_handler({"updateAvailable": False}),
    ("POST", "/api/v2/update/apply"): _make_success_handler(None),
    ("POST", "/api/v2/collaboration/control"): _make_success_handler(None),
    ("GET", "/api/v2/canvas-shortcuts"): _make_constant_handler({}),
    ("GET", "/api/v2/cli-providers/status"): _make_constant_handler({}),
    ("GET", "/api/v2/collaboration/config"): _make_constant_handler({}),
    # 自定义中转站：模型发现 / 清单草稿 / 保存 / 文档分析
    ("POST", "/api/v2/custom-providers/discover"): _handle_custom_provider_discover,
    ("POST", "/api/v2/custom-providers/build-manifest-draft"): _handle_custom_provider_build_draft,
    ("POST", "/api/v2/custom-providers/validate-manifest-draft"): _handle_custom_provider_validate_draft,
    ("POST", "/api/v2/custom-providers/save-manifest-bundle"): _handle_custom_provider_save_bundle,
    ("POST", "/api/v2/custom-providers/analyze-documentation"): _handle_custom_provider_analyze,
    ("GET", "/api/v2/custom-providers/manifest-bundles"): _handle_custom_provider_list_bundles,
    ("GET", "/api/v2/dreamina/status"): _handle_dreamina_status,
    ("GET", "/api/v2/dreamina/login/runtime"): _handle_dreamina_login_runtime,
    ("POST", "/api/v2/dreamina/login/web"): _handle_dreamina_login_web,
    ("POST", "/api/v2/dreamina/login"): _handle_dreamina_login_headless,
    ("POST", "/api/v2/dreamina/relogin"): _handle_dreamina_relogin,
    ("POST", "/api/v2/dreamina/logout"): _handle_dreamina_logout,
    ("POST", "/api/v2/dreamina/login/import"): _handle_dreamina_login_import,
    # 模型包类功能：契约完整，状态明确（见 handler 处说明）
    ("GET", "/api/v2/person-replacement/model-pack/status"):
        partial(_handle_model_pack_status, pack="person-replacement"),
    ("POST", "/api/v2/person-replacement/model-pack/install"):
        partial(_handle_model_pack_install, pack="person-replacement"),
    ("POST", "/api/v2/person-replacement/detect"):
        partial(_handle_model_pack_required, pack="person-replacement"),
    ("POST", "/api/v2/person-replacement/identify"):
        partial(_handle_model_pack_required, pack="person-replacement"),
    ("GET", "/api/v2/storyboard3d/model-pack/status"):
        partial(_handle_model_pack_status, pack="storyboard3d"),
    ("POST", "/api/v2/storyboard3d/model-pack/install"):
        partial(_handle_model_pack_install, pack="storyboard3d"),
    ("POST", "/api/v2/story-workspace/assets/extract-local"): _handle_story_asset_extract_local,
    # 本项目不复用原版的订阅/VIP 门禁，一律返回不阻断的状态。
    # status:"active" 使 normalizeSubscriptionPayload 得到 active 态，彻底避免任何
    # 检查 status !== 'active' 的调用点弹出订阅/激活框。
    ("GET", "/api/v2/subscription/status"): _make_constant_handler(
        {"authorized": True, "vip": True, "status": "active"}),
}

# Electron 模式下渲染层本应经 preload IPC 调用桌面能力；当 IPC 处理器没有返回句柄时，
# desktopBridge 会回退成对这些 HTTP 路由的轮询（chromeShellPost）。
# 桌面桥地址只在 Chrome Shell 模式下注入给后端，故此处给出**空实现**，
# 返回结构与桌面桥一致（{success, data}），避免 4xx 刷屏。
_DESKTOP_EMPTY_RESULTS: dict[str, object] = {
    "/api/v2/desktop/asset/consume-updates": [],
    "/api/v2/desktop/media-task/list": {"tasks": []},
    "/api/v2/desktop/diagnostics/log-event": None,
    "/api/v2/desktop/text-preset/consume-events": [],
    "/api/v2/desktop/screenshot/consume-global-capture-events": [],
    "/api/v2/desktop/storage-migration/read": None,
    "/api/v2/desktop/text-preset/update-global-shortcut": None,
    "/api/v2/desktop/screenshot/update-global-shortcut": None,
}

for _desktop_path, _desktop_result in _DESKTOP_EMPTY_RESULTS.items():
    ROUTES[("POST", _desktop_path)] = _make_constant_handler(
        {"success": True, "data": _desktop_result})


# 精确桩在精准匹配表里，会**先于**下面的前缀代理命中；
# 因此有桌面桥时，这些路径也要改走代理，否则 chrome-shell 的就绪上报到不了主进程。
def _install_desktop_bridge_routing() -> None:
    if not os.environ.get("AIC_DESKTOP_BRIDGE_URL"):
        return
    for _desktop_path in _DESKTOP_EMPTY_RESULTS:
        ROUTES[("POST", _desktop_path)] = _handle_desktop_bridge_proxy


# chrome-shell 模式下渲染层跑在真实浏览器里，所有桌面能力（原生对话框、截图、
# 媒体任务、以及**渲染就绪上报**）都要经后端反向代理到 Electron 主进程的桌面桥。
# 主进程在 chrome-shell 启动时会注入 AIC_DESKTOP_BRIDGE_URL / _TOKEN。
# Electron 模式下这两个变量不存在，回退到上面的空实现（那时渲染层走 preload IPC）。
def _handle_desktop_bridge_proxy(handler: BaseHTTPRequestHandler) -> None:
    bridge_url = os.environ.get("AIC_DESKTOP_BRIDGE_URL")
    if not bridge_url:
        # Electron 模式：渲染层本应走 IPC，走到这里说明是回退调用，给空实现即可
        _json_response(handler, HTTPStatus.OK, {"success": True, "data": None})
        return

    path = urlparse(handler.path).path
    target = bridge_url.rstrip("/") + path
    token = os.environ.get("AIC_DESKTOP_BRIDGE_TOKEN") or ""
    body = getattr(handler, "_raw_body", b"") or b"{}"

    headers = {"Content-Type": "application/json"}
    if token:
        headers["X-AIC-Local-Token"] = token

    try:
        response = proxy_service.get_session().post(target, data=body, headers=headers, timeout=120)
    except Exception as exc:  # noqa: BLE001
        _json_response(handler, HTTPStatus.BAD_GATEWAY,
                       {"success": False, "error": f"desktop bridge unreachable: {exc}"})
        return

    _raw_response(handler, response.status_code, response.content,
                  response.headers.get("Content-Type", "application/json"))


# 前缀路由兜底：任何未显式实现的 /api/v2/desktop/* 都交给桥代理处理
# （登记在下方 PREFIX_ROUTES 定义之后）

# 前缀路由：(前缀, 方法, 处理函数)。在精确路由未命中后按顺序匹配。
PREFIX_ROUTES: list[tuple[str, str, object]] = [
    ("/api/v2/user/", "GET", _handle_user_json),
    ("/api/v2/user/", "POST", _handle_user_json),
    ("/api/v2/projects/", "GET", _handle_project_json),
    ("/api/v2/projects/", "DELETE", _handle_project_delete),
    ("/api/v2/projects/", "PATCH", _handle_project_rename),
    # 代理类路由都带 ?apiUrl= 查询参数，必须走前缀匹配。
    # 注意顺序：upload-local-media 必须排在 upload 之前，否则会被后者抢先匹配。
    ("/api/v2/proxy/upload-local-media", "POST", _handle_proxy_local_media),
    ("/api/v2/proxy/upload", "POST", _handle_proxy_raw_upload),
    ("/api/v2/proxy/task", "GET", _handle_proxy_task),
    ("/api/v2/proxy/task", "POST", _handle_proxy_task_post),
    # save_output 带 ?ext=&kind= 查询参数，走前缀匹配。
    # /api/v2/save_output_from_url 也以此开头，但它在精确表里已先命中，不会走到这里。
    ("/api/v2/save_output", "POST", _handle_save_output),
    # 集合实体的删除按 <name>.json 走前缀匹配
    ("/api/v2/assets/", "DELETE", _handle_assets_delete),
    ("/api/v2/workflows/", "DELETE", _handle_workflows_delete),
    # 自定义中转站清单包删除：按 sourceId（含 ':'，需 urldecode）
    ("/api/v2/custom-providers/manifest-bundles/", "DELETE", _handle_custom_provider_delete_bundle),
    # chrome-shell 模式下所有未显式实现的桌面能力都代理到 Electron 桌面桥
    ("/api/v2/desktop/", "POST", _handle_desktop_bridge_proxy),
]

# 有桌面桥时，把上面那 8 个精确桩也改走代理（精确表先于前缀表命中）
_install_desktop_bridge_routing()


def _is_api_path(path: str) -> bool:
    return path.startswith(_API_PATH_PREFIXES) or path in _API_EXACT_PATHS


_INVALID_BODY = object()


def _parse_json_body(raw: bytes) -> object:
    """解析请求体；空体返回 None，非法 JSON 返回 _INVALID_BODY。"""
    if not raw:
        return None
    try:
        return json.loads(raw.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return _INVALID_BODY


# --------------------------------------------------------------------------
# 静态文件
# --------------------------------------------------------------------------

def _normalized_relative(url_path: str) -> str | None:
    """把 URL 路径规范化成相对路径；出现 `..` 一律拒绝。

    必须先规范化再判定黑名单/前缀：否则 `/data/uploads/../../server.py`
    这类路径的**首段**看起来无害（data），上跳后却会落到 web 根下的敏感文件，
    而"仍在上层目录内"的包含性检查反而会放行。
    """
    relative = unquote(url_path).lstrip("/").replace("\\", "/")
    parts: list[str] = []
    for segment in relative.split("/"):
        if segment in ("", "."):
            continue
        if segment == "..":
            return None
        parts.append(segment)
    return "/".join(parts)


def _resolve_static_path(url_path: str) -> str | None:
    """把 URL 路径映射到 web 根内的真实文件路径；越界或不存在返回 None。"""
    relative = _normalized_relative(url_path)
    if relative is None:
        return None
    if not relative:
        relative = "index.html"

    top, _, remainder = relative.partition("/")
    if top == "electron":
        # 渲染层只需要 electron/ 下的 HTML 页面（如 legacyStorageMigration.html）。
        # 主进程代码与 preload 脚本不对外暴露。
        if not remainder or "/" in remainder or not remainder.endswith(".html"):
            return None
    elif top in _DENIED_TOP_LEVEL or top.startswith("requirements."):
        return None

    candidate = os.path.abspath(os.path.join(CONFIG.web_root, relative))
    # 目录穿越防护：解析后必须仍在 web 根内
    if candidate != CONFIG.web_root and not candidate.startswith(CONFIG.web_root + os.sep):
        return None
    if os.path.isdir(candidate):
        candidate = os.path.join(candidate, "index.html")
    return candidate if os.path.isfile(candidate) else None


def _guess_content_type(path: str) -> str:
    ext = os.path.splitext(path)[1].lower()
    override = _MIME_OVERRIDES.get(ext)
    if override:
        return override
    guessed, _ = mimetypes.guess_type(path)
    return guessed or "application/octet-stream"


def _serve_static(handler: BaseHTTPRequestHandler, url_path: str, head_only: bool = False) -> bool:
    file_path = _resolve_static_path(url_path)
    if file_path is None:
        return False

    try:
        size = os.path.getsize(file_path)
        with open(file_path, "rb") as fh:
            handler.send_response(HTTPStatus.OK)
            handler.send_header("Content-Type", _guess_content_type(file_path))
            handler.send_header("Content-Length", str(size))
            handler.send_header("Cache-Control", "no-cache")
            handler.end_headers()
            if not head_only:
                while chunk := fh.read(64 * 1024):
                    handler.wfile.write(chunk)
    except (BrokenPipeError, ConnectionResetError):
        return True
    return True


# --------------------------------------------------------------------------
# 请求处理
# --------------------------------------------------------------------------

class RequestHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    server_version = "CanvasAILocal/0.1"
    sys_version = ""

    def log_message(self, fmt: str, *args: object) -> None:
        _log(f"{self.address_string()} {fmt % args}")

    # -- 鉴权 ---------------------------------------------------------------

    def _is_authorized(self, path: str) -> bool:
        if path in _AUTH_EXEMPT_PATHS:
            return True
        if not CONFIG.token:
            # 未注入令牌（例如独立调试运行）时不强制，但明确告警
            return True
        if self.headers.get("X-AIC-Local-Token") == CONFIG.token:
            return True

        # chrome-shell 模式下渲染层跑在**真实浏览器**里，没有 Electron 的
        # webRequest 钩子，拿不到主进程注入的令牌（实测这些请求会 401）。
        # 因此把"请求来自应用自身的页面"也作为一种凭据：Origin/Referer 必须是本服务地址。
        #
        # 这样是否安全：浏览器发起的跨站请求必然带上对方站点的 Origin，
        # 不会等于本服务地址，因而仍被拒绝；而本服务只绑定 127.0.0.1。
        app_origin = f"http://{CONFIG.host}:{CONFIG.port}"
        if (self.headers.get("Origin") or "").strip() == app_origin:
            return True
        if (self.headers.get("Referer") or "").strip().startswith(app_origin + "/"):
            return True
        return False

    # -- 分发 ---------------------------------------------------------------

    def _read_request_body(self) -> bytes:
        if self.command not in ("POST", "PUT", "PATCH", "DELETE"):
            return b""
        raw_length = self.headers.get("Content-Length")
        if not raw_length:
            return b""
        try:
            length = int(raw_length)
        except ValueError:
            return b""
        return self.rfile.read(length) if length > 0 else b""

    @property
    def json_body(self) -> object:
        return _parse_json_body(getattr(self, "_raw_body", b""))

    def _dispatch(self, method: str, head_only: bool) -> None:
        path = urlparse(self.path).path
        # 必须在任何响应分支之前读完请求体。否则未读的 body 字节会被
        # 当作下一个请求行解析，在 keep-alive 连接上导致后续请求 400。
        self._raw_body = self._read_request_body()

        if _is_api_path(path):
            if not self._is_authorized(path):
                _json_response(self, HTTPStatus.UNAUTHORIZED,
                               {"success": False, "error": "unauthorized"})
                return

            handler = ROUTES.get((method, path))
            if handler is not None:
                handler(self)
                return

            for prefix, prefix_method, prefix_handler in PREFIX_ROUTES:
                if method == prefix_method and path.startswith(prefix):
                    prefix_handler(self)
                    return

            _json_response(self, HTTPStatus.NOT_FOUND,
                           {"success": False, "error": f"no such route: {method} {path}"})
            return

        if method not in ("GET", "HEAD"):
            self.send_error(HTTPStatus.METHOD_NOT_ALLOWED)
            return

        # 产物/素材（/output/... 等）来自存储根，与应用静态资源不同根，须先判。
        if _serve_media(self, path, head_only):
            return

        if _serve_static(self, path, head_only):
            return

        # SPA 回退只对无扩展名的应用路由生效。
        # 对 .js/.css 等资源回退 index.html 会让浏览器报出误导性的
        # "Failed to fetch dynamically imported module"，掩盖真正的缺失文件。
        if not os.path.splitext(path)[1] and _serve_static(self, "/index.html", head_only):
            return
        self.send_error(HTTPStatus.NOT_FOUND)

    def do_GET(self) -> None:  # noqa: N802
        self._dispatch("GET", head_only=False)

    def do_HEAD(self) -> None:  # noqa: N802
        self._dispatch("HEAD", head_only=True)

    def do_POST(self) -> None:  # noqa: N802
        self._dispatch("POST", head_only=False)

    def do_DELETE(self) -> None:  # noqa: N802
        self._dispatch("DELETE", head_only=False)

    def do_PATCH(self) -> None:  # noqa: N802
        self._dispatch("PATCH", head_only=False)

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Allow", "GET, HEAD, POST, DELETE, PATCH, OPTIONS")
        self.send_header("Content-Length", "0")
        self.end_headers()


# --------------------------------------------------------------------------
# 入口
# --------------------------------------------------------------------------

def _parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Canvas AI local backend")
    parser.add_argument("--host", default=os.environ.get("AIC_BIND_HOST", "127.0.0.1"))
    parser.add_argument("--port", type=int,
                        default=int(os.environ.get("AICANVAS_PORT", "8777")))
    return parser.parse_args(argv)


def _port_available(host: str, port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        probe.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            probe.bind((host, port))
        except OSError:
            return False
    return True


def main(argv: list[str] | None = None) -> int:
    global CONFIG

    args = _parse_args(argv if argv is not None else sys.argv[1:])
    web_root = os.environ.get("AIC_APP_ROOT") or os.getcwd()
    token = os.environ.get("AIC_LOCAL_TOKEN") or None

    # 主进程按 buildPackagedServerEnv() 注入这些路径；
    # 独立调试运行时回退到项目内的 .userdata，避免污染真实用户目录。
    fallback_root = os.path.join(os.path.abspath(web_root), ".userdata")
    user_dir = os.environ.get("AIC_USER_DIR") or os.path.join(fallback_root, "user")
    canvas_dir = os.environ.get("AIC_CANVAS_DIR") or os.path.join(fallback_root, "projects")
    data_dir = os.environ.get("AIC_DATA_DIR") or os.path.join(fallback_root, "data")
    output_dir = os.environ.get("AIC_OUTPUT_DIR") or os.path.join(fallback_root, "output")
    assets_dir = os.environ.get("AIC_ASSETS_DIR") or os.path.join(data_dir, "assets")
    workflows_dir = os.environ.get("AIC_WORKFLOWS_DIR") or os.path.join(data_dir, "workflows")

    CONFIG = Config(host=args.host, port=args.port, web_root=web_root, token=token,
                    user_dir=user_dir, canvas_dir=canvas_dir, data_dir=data_dir,
                    output_dir=output_dir, assets_dir=assets_dir,
                    workflows_dir=workflows_dir)

    if not _port_available(args.host, args.port):
        _log(f"port {args.port} on {args.host} is already in use")
        return 1

    if not token:
        _log("warning: AIC_LOCAL_TOKEN not set; /api/* auth is disabled")

    httpd = ThreadingHTTPServer((args.host, args.port), RequestHandler)
    httpd.daemon_threads = True

    _log(f"listening on http://{args.host}:{args.port}")
    _log(f"web root: {CONFIG.web_root}")
    _log(f"user dir: {CONFIG.user_dir}")
    _log(f"routes: {len(ROUTES)} exact + {len(PREFIX_ROUTES)} prefix")

    def _shutdown(_signum: int, _frame: object) -> None:
        _log("shutting down")
        threading.Thread(target=httpd.shutdown, daemon=True).start()

    for sig in (signal.SIGINT, signal.SIGTERM):
        try:
            signal.signal(sig, _shutdown)
        except (ValueError, OSError):
            pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
