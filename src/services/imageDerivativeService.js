import { localPathToUrl, normalizeLocalPath } from '../utils/localMediaPath.js';
function firstNonEmptyString(..._0xf7f7d2) {
  for (const _0x50ce4a of _0xf7f7d2) {
    const _0x2f6173 = normalizeLocalPath(_0x50ce4a);
    if (_0x2f6173) {
      return _0x2f6173;
    }
  }
  return '';
}
function toPositiveInt(_0x536b23) {
  const _0x3d5c04 = Number(_0x536b23);
  if (!Number["isFinite"](_0x3d5c04) || _0x3d5c04 <= 0x0) {
    return 0x0;
  }
  return Math["max"](0x1, Math["round"](_0x3d5c04));
}
export function toLocalPathUrl(_0x502af2) {
  return localPathToUrl(_0x502af2);
}
export function normalizeImageDerivativeFields(_0x16993a = {}) {
  const _0x11d4a5 = firstNonEmptyString(_0x16993a?.["localPath"]);
  const _0x3bcf84 = firstNonEmptyString(_0x16993a?.["originalLocalPath"], _0x11d4a5);
  const _0x4cc4f7 = firstNonEmptyString(_0x16993a?.['displayLocalPath']);
  const _0xbac003 = firstNonEmptyString(_0x16993a?.['thumbLocalPath']);
  const _0x3a604f = toPositiveInt(_0x16993a?.["originalWidth"]);
  const _0x333f9d = toPositiveInt(_0x16993a?.["originalHeight"]);
  return {
    'localPath': _0x11d4a5,
    'originalLocalPath': _0x3bcf84,
    'displayLocalPath': _0x4cc4f7,
    'thumbLocalPath': _0xbac003,
    'originalWidth': _0x3a604f,
    'originalHeight': _0x333f9d
  };
}
export function hasImageDerivativeFields(_0xbf813a = {}) {
  return Boolean(firstNonEmptyString(_0xbf813a?.["originalLocalPath"], _0xbf813a?.["displayLocalPath"], _0xbf813a?.["thumbLocalPath"]) || toPositiveInt(_0xbf813a?.['originalWidth']) || toPositiveInt(_0xbf813a?.["originalHeight"]));
}
export function needsImageDerivatives(_0x1862bf = {}) {
  const _0x56f760 = normalizeImageDerivativeFields(_0x1862bf);
  const _0x55be8b = _0x56f760["originalLocalPath"] || _0x56f760["localPath"];
  if (!_0x55be8b || /\.svg$/i["test"](_0x55be8b)) {
    return ![];
  }
  return [_0x56f760["displayLocalPath"], _0x56f760["thumbLocalPath"]]["some"](_0xed7eae => !_0xed7eae || _0xed7eae === _0x55be8b);
}
export function buildImageNodeStorageFields(_0x25386d = {}) {
  const _0x41f349 = normalizeImageDerivativeFields(_0x25386d);
  const _0x41cf54 = {
    'localPath': _0x41f349["localPath"] || _0x41f349["originalLocalPath"] || '',
    'originalLocalPath': _0x41f349["originalLocalPath"] || '',
    'displayLocalPath': _0x41f349["displayLocalPath"] || '',
    'thumbLocalPath': _0x41f349['thumbLocalPath'] || ''
  };
  _0x41f349["originalWidth"] > 0x0 && (_0x41cf54["originalWidth"] = _0x41f349["originalWidth"]);
  _0x41f349["originalHeight"] > 0x0 && (_0x41cf54["originalHeight"] = _0x41f349["originalHeight"]);
  return _0x41cf54;
}
export function pickCanvasImageLocalPath(_0xee6d7f = {}) {
  const _0x16153a = normalizeImageDerivativeFields(_0xee6d7f);
  return firstNonEmptyString(_0x16153a['displayLocalPath'], _0x16153a["originalLocalPath"], _0x16153a["localPath"], _0x16153a["thumbLocalPath"]);
}
export function pickCanvasThumbLocalPath(_0x519e3d = {}) {
  const _0x388e17 = normalizeImageDerivativeFields(_0x519e3d);
  return firstNonEmptyString(_0x388e17["thumbLocalPath"], _0x388e17["displayLocalPath"], _0x388e17["originalLocalPath"], _0x388e17["localPath"]);
}
export function pickPreviewImageLocalPath(_0x194bb2 = {}) {
  const _0x1ebb46 = normalizeImageDerivativeFields(_0x194bb2);
  return firstNonEmptyString(_0x1ebb46["originalLocalPath"], _0x1ebb46["localPath"]);
}
export function pickPreviewFallbackLocalPath(_0x24d2e4 = {}) {
  const _0xbc29a2 = normalizeImageDerivativeFields(_0x24d2e4);
  return firstNonEmptyString(_0xbc29a2["displayLocalPath"], _0xbc29a2["thumbLocalPath"]);
}