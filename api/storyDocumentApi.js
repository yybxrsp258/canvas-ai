import { post as a155_0x545e91 } from './requester.js';
export const STORY_DOCUMENT_EXTRACT_PATH = "/api/v2/story-workspace/document/extract";
export const STORY_DOCUMENT_MAX_FILE_BYTES = 0x14 * 0x400 * 0x400;
export const STORY_DOCUMENT_SUPPORTED_EXTENSIONS = Object["freeze"](["txt", "md", "markdown", "docx", "pdf"]);
function getFileExtension(_0x205c06) {
  const _0x2207b9 = String(_0x205c06 || '')["trim"]();
  const _0x5212c1 = _0x2207b9["lastIndexOf"]('.');
  return _0x5212c1 >= 0x0 ? _0x2207b9["slice"](_0x5212c1 + 0x1)["toLowerCase"]() : '';
}
export function validateStoryDocumentFile(_0x4031c0) {
  if (!_0x4031c0) {
    return {
      'ok': ![],
      'error': '请选择剧本文件。'
    };
  }
  const _0x1b0e67 = getFileExtension(_0x4031c0["name"]);
  if (_0x1b0e67 === "doc") {
    return {
      'ok': ![],
      'error': '暂不支持旧版\x20DOC\x20文件，请先另存为\x20DOCX、PDF\x20或\x20TXT。'
    };
  }
  if (!STORY_DOCUMENT_SUPPORTED_EXTENSIONS["includes"](_0x1b0e67)) {
    return {
      'ok': ![],
      'error': "仅支持 TXT、Markdown、DOCX 和文本型 PDF 文件。"
    };
  }
  const _0x80ec47 = Number(_0x4031c0["size"] || 0x0);
  if (_0x80ec47 <= 0x0) {
    return {
      'ok': ![],
      'error': '剧本文件为空。'
    };
  }
  if (_0x80ec47 > STORY_DOCUMENT_MAX_FILE_BYTES) {
    return {
      'ok': ![],
      'error': "剧本文件不能超过 20 MB。"
    };
  }
  return {
    'ok': !![],
    'extension': _0x1b0e67
  };
}
function normalizeStoryMarkdownText(_0x2a71e0) {
  let _0x4cf8b0 = String(_0x2a71e0 || '');
  if (!_0x4cf8b0) {
    return _0x4cf8b0;
  }
  _0x4cf8b0 = _0x4cf8b0["replace"](/!\[([^\]]*)\]\([^)]*\)/gu, '$1');
  _0x4cf8b0 = _0x4cf8b0["replace"](/\[([^\]]*)\]\([^)]*\)/gu, '$1');
  _0x4cf8b0 = _0x4cf8b0["replace"](/`{1,3}([^`]+)`{1,3}/gu, '$1');
  _0x4cf8b0 = _0x4cf8b0["replace"](/\*\*([^*]+)\*\*/gu, '$1');
  _0x4cf8b0 = _0x4cf8b0["replace"](/__([^_]+)__/gu, '$1');
  _0x4cf8b0 = _0x4cf8b0["replace"](/(^|[^*])\*([^*\n]+)\*/gu, '$1$2');
  _0x4cf8b0 = _0x4cf8b0["replace"](/~~([^~]+)~~/gu, '$1');
  _0x4cf8b0 = _0x4cf8b0["replace"](/^[ \t]*```[^\n]*$/gmu, '');
  _0x4cf8b0 = _0x4cf8b0["replace"](/^[ \t]*(?:[-*_][ \t]*){3,}$/gmu, '');
  return _0x4cf8b0;
}
export async function extractStoryDocumentText(_0x415eac, _0x5ecadc = {}) {
  const _0x667e43 = validateStoryDocumentFile(_0x415eac);
  if (!_0x667e43['ok']) {
    throw new Error(_0x667e43["error"]);
  }
  const _0x4e92c0 = new FormData();
  let _0x2c8a2f = String(_0x415eac['name'] || "script." + _0x667e43["extension"]);
  if (_0x667e43["extension"] === "markdown") {
    _0x2c8a2f = _0x2c8a2f["replace"](/\.markdown$/iu, ".md");
  }
  _0x4e92c0["append"]("file", _0x415eac, _0x2c8a2f);
  const _0x48a4e6 = await a155_0x545e91(STORY_DOCUMENT_EXTRACT_PATH, _0x4e92c0, {
    'provider': 'local',
    'signal': _0x5ecadc["signal"],
    'timeout': Number(_0x5ecadc["timeout"]) || 0x15f90
  });
  const _0x1261ae = typeof _0x48a4e6?.["text"] === "string" ? _0x48a4e6["text"] : '';
  if (!_0x1261ae["trim"]()) {
    throw new Error("文档解析结果没有可用文本。");
  }
  const _0x3f7d2a = _0x667e43["extension"] === "md" || _0x667e43["extension"] === "markdown" ? normalizeStoryMarkdownText(_0x1261ae) : _0x1261ae;
  return {
    ..._0x48a4e6,
    'text': _0x3f7d2a,
    'characterCount': _0x3f7d2a["length"],
    'extension': String(_0x48a4e6?.["extension"] || _0x667e43['extension']),
    'warnings': Array['isArray'](_0x48a4e6?.["warnings"]) ? _0x48a4e6["warnings"] : []
  };
}