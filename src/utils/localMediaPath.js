const SAFE_LOCAL_PATH_PREFIXES = Object["freeze"](['data/uploads/', "data/assets/", "output/"]);
const BLOCKED_SCHEME_RE = /^(?:blob|data|file|javascript):/i;
const HTTP_SCHEME_RE = /^https?:/i;
const ANY_SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;
const WINDOWS_ABSOLUTE_RE = /^[a-zA-Z]:\//;
const NORMALIZED_LOCAL_PATH_CACHE_LIMIT = 0x400;
const normalizedLocalPathCache = new Map();
function normalizeText(_0x255bcc) {
  return String(_0x255bcc || '')['trim']();
}
function safeDecode(_0x49ec5e) {
  try {
    return decodeURIComponent(_0x49ec5e);
  } catch {
    return _0x49ec5e;
  }
}
function isLocalHttpUrl(_0x4dca9a) {
  const _0x5a00fd = String(_0x4dca9a?.["hostname"] || '')["toLowerCase"]();
  if (!_0x5a00fd) {
    return ![];
  }
  if (_0x5a00fd === "localhost" || _0x5a00fd === "127.0.0.1" || _0x5a00fd === "0.0.0.0" || _0x5a00fd === "::1" || _0x5a00fd === "[::1]") {
    return !![];
  }
  const _0x54ba86 = normalizeText(globalThis["location"]?.["origin"]);
  return !!_0x54ba86 && _0x4dca9a["origin"] === _0x54ba86;
}
function extractPathCandidate(_0x46e187) {
  if (!_0x46e187 || typeof _0x46e187 !== "object" || Array["isArray"](_0x46e187)) {
    return _0x46e187;
  }
  const _0x2c45db = _0x46e187['result'] && typeof _0x46e187['result'] === 'object' ? _0x46e187["result"] : null;
  const _0x45f29b = _0x46e187["video"] && typeof _0x46e187["video"] === "object" ? _0x46e187["video"] : null;
  const _0x24268d = _0x46e187["audio"] && typeof _0x46e187["audio"] === "object" ? _0x46e187["audio"] : null;
  return _0x46e187["localPath"] ?? _0x46e187["path"] ?? _0x46e187['url'] ?? _0x46e187["posterLocalPath"] ?? _0x46e187["coverLocalPath"] ?? _0x46e187["thumbLocalPath"] ?? _0x46e187["displayLocalPath"] ?? _0x46e187["originalLocalPath"] ?? _0x46e187["waveformLocalPath"] ?? _0x45f29b?.['localPath'] ?? _0x45f29b?.["path"] ?? _0x45f29b?.["url"] ?? _0x24268d?.["localPath"] ?? _0x24268d?.["path"] ?? _0x24268d?.['url'] ?? _0x2c45db?.['localPath'] ?? _0x2c45db?.['path'] ?? _0x2c45db?.["url"] ?? _0x2c45db?.["posterLocalPath"] ?? _0x2c45db?.["coverLocalPath"] ?? _0x2c45db?.["thumbLocalPath"] ?? _0x2c45db?.["displayLocalPath"] ?? _0x2c45db?.["originalLocalPath"] ?? _0x2c45db?.["waveformLocalPath"] ?? '';
}
function hasSafeLocalPathPrefix(_0x38df3b) {
  const _0xce63c1 = normalizeText(_0x38df3b)["replace"](/\\/g, '/');
  return SAFE_LOCAL_PATH_PREFIXES["some"](_0x5d8275 => _0xce63c1['startsWith'](_0x5d8275));
}
function getNormalizedLocalPathCacheKey(_0x1f39b8) {
  if (typeof _0x1f39b8 !== "string" || _0x1f39b8["length"] > 0x800) {
    return null;
  }
  const _0x307afd = _0x1f39b8["trim"]();
  if (!_0x307afd || ANY_SCHEME_RE["test"](_0x307afd)) {
    return null;
  }
  return _0x1f39b8;
}
function rememberNormalizedLocalPath(_0x2aaba9, _0x11afef) {
  if (_0x2aaba9 === null) {
    return _0x11afef;
  }
  if (normalizedLocalPathCache["size"] >= NORMALIZED_LOCAL_PATH_CACHE_LIMIT) {
    const _0x2febbf = normalizedLocalPathCache["keys"]()["next"]()["value"];
    if (_0x2febbf !== undefined) {
      normalizedLocalPathCache["delete"](_0x2febbf);
    }
  }
  normalizedLocalPathCache['set'](_0x2aaba9, _0x11afef);
  return _0x11afef;
}
export function isSafeVirtualLocalPath(_0x4f8d6d) {
  const _0x35391a = normalizeText(_0x4f8d6d)['replace'](/\\/g, '/');
  if (!_0x35391a || BLOCKED_SCHEME_RE["test"](_0x35391a) || HTTP_SCHEME_RE["test"](_0x35391a)) {
    return ![];
  }
  if (ANY_SCHEME_RE["test"](_0x35391a) || WINDOWS_ABSOLUTE_RE['test'](_0x35391a) || _0x35391a["startsWith"]('//')) {
    return ![];
  }
  const _0x1f9119 = safeDecode(_0x35391a["split"](/[?#]/, 0x1)[0x0])['replace'](/^\/+/, '');
  const _0x5d5833 = _0x1f9119["split"]('/')["filter"](Boolean);
  if (_0x5d5833["some"](_0x418f6f => _0x418f6f === '.' || _0x418f6f === '..')) {
    return ![];
  }
  return hasSafeLocalPathPrefix(_0x5d5833["join"]('/'));
}
export function normalizeLocalPath(_0xa6b30d) {
  const _0xb05625 = getNormalizedLocalPathCacheKey(_0xa6b30d);
  if (_0xb05625 !== null) {
    const _0x20b3f0 = normalizedLocalPathCache["get"](_0xb05625);
    if (_0x20b3f0 !== undefined) {
      return _0x20b3f0;
    }
  }
  const _0x58e8d7 = extractPathCandidate(_0xa6b30d);
  const _0x6d0a5f = normalizeText(_0x58e8d7);
  if (!_0x6d0a5f || BLOCKED_SCHEME_RE["test"](_0x6d0a5f)) {
    return rememberNormalizedLocalPath(_0xb05625, '');
  }
  if (HTTP_SCHEME_RE["test"](_0x6d0a5f)) {
    return urlToLocalPath(_0x6d0a5f);
  }
  if (ANY_SCHEME_RE['test'](_0x6d0a5f)) {
    return rememberNormalizedLocalPath(_0xb05625, '');
  }
  let _0x5d71bb = _0x6d0a5f["replace"](/\\/g, '/');
  if (WINDOWS_ABSOLUTE_RE["test"](_0x5d71bb) || _0x5d71bb["startsWith"]('//')) {
    return rememberNormalizedLocalPath(_0xb05625, '');
  }
  _0x5d71bb = safeDecode(_0x5d71bb["split"](/[?#]/, 0x1)[0x0])["replace"](/^\/+/, '');
  const _0x130cc2 = [];
  for (const _0x50675b of _0x5d71bb["split"]('/')) {
    const _0x5646b7 = _0x50675b['trim']();
    if (!_0x5646b7 || _0x5646b7 === '.') {
      continue;
    }
    if (_0x5646b7 === '..') {
      return rememberNormalizedLocalPath(_0xb05625, '');
    }
    _0x130cc2["push"](_0x5646b7);
  }
  const _0x165e47 = _0x130cc2["join"]('/');
  return rememberNormalizedLocalPath(_0xb05625, hasSafeLocalPathPrefix(_0x165e47) ? _0x165e47 : '');
}
export function localPathToUrl(_0x37113a) {
  const _0x5429c2 = normalizeLocalPath(_0x37113a);
  return _0x5429c2 ? '/' + _0x5429c2 : '';
}
export function urlToLocalPath(_0x26b41c) {
  const _0x4f028d = normalizeText(_0x26b41c);
  if (!_0x4f028d || BLOCKED_SCHEME_RE['test'](_0x4f028d)) {
    return '';
  }
  if (HTTP_SCHEME_RE["test"](_0x4f028d)) {
    try {
      const _0x1497b1 = new URL(_0x4f028d);
      if (!isLocalHttpUrl(_0x1497b1)) {
        return '';
      }
      return normalizeLocalPath(_0x1497b1["pathname"]);
    } catch {
      return '';
    }
  }
  return normalizeLocalPath(_0x4f028d);
}
export function pickResultLocalPath(_0x1b1e56) {
  return normalizeLocalPath(_0x1b1e56);
}