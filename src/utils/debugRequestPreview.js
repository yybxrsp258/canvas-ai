import { maskDebugBearer, maskDebugHeaders, maskDebugPayloadSecrets } from './debugRequestMasking.js';
import { buildDebugJsonPreview } from './debugImagePreview.js';
const LOCAL_PROXY_ONLY_PAYLOAD_KEYS = Object["freeze"](['__aicAllowTaskProbe', "__aicModelCatalogId", "installId", "install_id", "deviceId", "device_id"]);
export const DEBUG_WRENCH_ICON_HTML = '<svg\x20width=\x2214\x22\x20height=\x2214\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22><path\x20d=\x22M14.7\x206.3a1\x201\x200\x200\x200\x200\x201.4l1.6\x201.6a1\x201\x200\x200\x200\x201.4\x200l3.77-3.77a6\x206\x200\x200\x201-7.94\x207.94l-6.91\x206.91a2.12\x202.12\x200\x200\x201-3-3l6.91-6.91a6\x206\x200\x200\x201\x207.94-7.94l-3.76\x203.76z\x22/></svg>';
export function applyDebugWrenchIcon(_0x37281c) {
  if (!_0x37281c) {
    return;
  }
  _0x37281c["innerHTML"] = DEBUG_WRENCH_ICON_HTML;
}
export function buildFinalApiDebugRequest(_0x1818a5, _0x4c1a88 = {}) {
  const _0x537a31 = _0x4c1a88["method"] || "POST";
  const _0x4dba41 = String(_0x1818a5?.['url'] || '');
  const _0x5e1486 = {
    ...(_0x1818a5?.["body"] || {})
  };
  const _0x3d3c17 = String(_0x1818a5?.["apiUrl"] || _0x5e1486["apiUrl"] || '');
  let _0x35104e = _0x1818a5?.["headers"] || {
    'Content-Type': "application/json"
  };
  let _0x405bf8 = _0x5e1486;
  if (_0x5e1486["apiUrl"] && _0x4dba41["startsWith"]("/api/v2/proxy/")) {
    const _0x43a466 = _0x5e1486["apiKey"] || '';
    _0x405bf8 = {
      ..._0x5e1486
    };
    delete _0x405bf8['apiUrl'];
    delete _0x405bf8["apiKey"];
    LOCAL_PROXY_ONLY_PAYLOAD_KEYS["forEach"](_0x59c848 => delete _0x405bf8[_0x59c848]);
    _0x35104e = _0x43a466 ? {
      'Content-Type': "application/json",
      'Authorization': maskDebugBearer(_0x43a466)
    } : _0x35104e;
  } else {
    _0x4dba41 === '/api/v2/runninghubwf/run' && (_0x35104e = {
      'Content-Type': 'application/json'
    });
  }
  return {
    'method': _0x537a31,
    'url': _0x4dba41,
    'apiUrl': _0x3d3c17,
    'headers': maskDebugHeaders(_0x35104e),
    'payload': maskDebugPayloadSecrets(_0x405bf8)
  };
}
export function formatFinalApiDebugRequest(_0x5d2371, _0x4c6a55 = {}) {
  const _0x28782e = buildFinalApiDebugRequest(_0x5d2371, _0x4c6a55);
  return '🎯\x20[最终发给\x20API\x20的参数]\x0a\x0amethod\x20=\x20\x22' + _0x28782e["method"] + "\"\n\nurl = \"" + _0x28782e["url"] + "\"\n\napiUrl = \"" + _0x28782e['apiUrl'] + "\"\n\nheaders = " + JSON["stringify"](_0x28782e['headers'], null, 0x2) + "\n\npayload = " + JSON['stringify'](_0x28782e["payload"], null, 0x2);
}
export function buildFinalApiDebugPreview(_0x259e74, _0x3aae14 = {}) {
  const _0x345a7b = formatFinalApiDebugRequest(_0x259e74, _0x3aae14);
  const _0x519c58 = buildDebugJsonPreview(buildFinalApiDebugRequest(_0x259e74, _0x3aae14)["payload"]);
  const _0x4f9c6e = _0x345a7b["length"] - _0x519c58["content"]["length"];
  return {
    'outputText': _0x345a7b,
    'images': _0x519c58['images']['map'](_0x555af8 => ({
      ..._0x555af8,
      'start': _0x555af8["start"] + _0x4f9c6e,
      'end': _0x555af8["end"] + _0x4f9c6e
    }))
  };
}