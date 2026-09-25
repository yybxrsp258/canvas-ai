import { desktopBridge } from './desktopBridge.js';
const DESKTOP_PREVIEW_URL_CACHE_TTL_MS = 0x1e * 0x3c * 0x3e8;
const desktopPreviewUrlCache = new Map();
const desktopPreviewUrlPendingCache = new Map();
const LOCAL_MEDIA_PATH_PREFIX_RE = /^(?:\/)?(?:output\/|data\/assets\/|data\/uploads\/)/i;
const LOCAL_PREVIEW_SCHEME_RE = /^aic-local-preview:/i;
const DIRECT_LOCAL_MEDIA_FLAG_RE = /^(1|true|yes|on)$/i;
const MEDIA_MIME_BY_EXT = {
  'mp4': "video/mp4",
  'm4v': "video/mp4",
  'webm': "video/webm",
  'mov': "video/quicktime",
  'mp3': "audio/mpeg",
  'wav': "audio/wav",
  'm4a': 'audio/mp4',
  'aac': 'audio/aac',
  'ogg': "audio/ogg",
  'flac': "audio/flac"
};
function normalizeUrl(_0x1f28d3) {
  const _0x3ac885 = String(_0x1f28d3 || '')["trim"]();
  if (!_0x3ac885) {
    return '';
  }
  try {
    return new URL(_0x3ac885, globalThis["location"]?.["href"] || "http://127.0.0.1/")["href"];
  } catch {
    return _0x3ac885;
  }
}
function nowMs() {
  return typeof performance !== 'undefined' && typeof performance["now"] === "function" ? performance["now"]() : Date["now"]();
}
function markMediaSourceAttach(_0x51e482 = {}) {
  globalThis["window"]?.["__runtimeCompareMark"]?.("media-source-attach:complete", _0x51e482);
}
function isDesktopRenderer() {
  return desktopBridge["mediaPreview"]["isAvailable"]();
}
function shouldUseDirectLocalMediaSource() {
  const _0x4b76cb = globalThis["window"] || {};
  const _0x3cd0d3 = _0x4b76cb["__AIC_ALLOW_DIRECT_LOCAL_MEDIA_DIAGNOSTIC__"] ?? globalThis["__AIC_ALLOW_DIRECT_LOCAL_MEDIA_DIAGNOSTIC__"];
  if (!DIRECT_LOCAL_MEDIA_FLAG_RE['test'](String(_0x3cd0d3 || '')["trim"]())) {
    return ![];
  }
  const _0x48a457 = _0x4b76cb["__AIC_DIRECT_LOCAL_MEDIA__"] ?? _0x4b76cb["__AIC_DESKTOP_MEDIA_DIRECT_HTTP__"] ?? globalThis["__AIC_DIRECT_LOCAL_MEDIA__"];
  return DIRECT_LOCAL_MEDIA_FLAG_RE['test'](String(_0x48a457 || '')["trim"]());
}
function isDesktopBlobCandidate(_0xdc493a) {
  void _0xdc493a;
  return ![];
}
function isLoopbackHost(_0x212161) {
  const _0x447a76 = String(_0x212161 || '')["toLowerCase"]();
  return _0x447a76 === "localhost" || _0x447a76 === '127.0.0.1' || _0x447a76 === "::1" || _0x447a76 === '[::1]';
}
function normalizeDesktopLocalMediaPath(_0x1b5a15) {
  const _0x2f401e = String(_0x1b5a15 || '')["trim"]();
  if (!_0x2f401e || /^(?:blob:|data:|file:)/i['test'](_0x2f401e) || LOCAL_PREVIEW_SCHEME_RE["test"](_0x2f401e)) {
    return '';
  }
  let _0x522f94 = _0x2f401e;
  try {
    const _0x3c5cdc = new URL(_0x2f401e, globalThis["location"]?.['href'] || "http://127.0.0.1:8777/");
    const _0x5935e2 = String(globalThis["location"]?.['origin'] || '');
    const _0x36e650 = /^https?:$/i["test"](_0x3c5cdc['protocol']) && (_0x5935e2 && _0x3c5cdc["origin"] === _0x5935e2 || isLoopbackHost(_0x3c5cdc['hostname']));
    if (!_0x36e650) {
      return '';
    }
    _0x522f94 = _0x3c5cdc["pathname"];
  } catch {
    _0x522f94 = _0x2f401e["split"](/[?#]/, 0x1)[0x0];
  }
  _0x522f94 = String(_0x522f94 || '')["replace"](/\\/g, '/')["split"](/[?#]/, 0x1)[0x0];
  try {
    _0x522f94 = decodeURIComponent(_0x522f94);
  } catch {}
  _0x522f94 = _0x522f94["replace"](/^\/+/, '');
  if (!LOCAL_MEDIA_PATH_PREFIX_RE['test'](_0x522f94)) {
    return '';
  }
  return '/' + _0x522f94;
}
function inferMediaMimeType(_0x20201a) {
  const _0x308d13 = String(_0x20201a || '')["split"](/[?#]/, 0x1)[0x0]["match"](/\.([a-z0-9]+)$/i);
  if (!_0x308d13) {
    return '';
  }
  return MEDIA_MIME_BY_EXT[String(_0x308d13[0x1] || '')['toLowerCase']()] || '';
}
function resolveChromeShellAudioPlaybackUrl(_0xdf72d2, _0x483fdd) {
  if (!desktopBridge["isChromeShell"] || String(_0xdf72d2?.["tagName"] || '')["toLowerCase"]() !== "audio") {
    return _0x483fdd;
  }
  const _0x63ab46 = normalizeUrl(_0x483fdd);
  const _0x41034c = normalizeDesktopLocalMediaPath(_0x63ab46);
  if (!_0x41034c) {
    return _0x63ab46;
  }
  try {
    const _0x521600 = String(globalThis["location"]?.["origin"] || '');
    const _0x54e424 = new URL(_0x63ab46);
    if (_0x521600 && _0x54e424["origin"] !== _0x521600) {
      return _0x63ab46;
    }
    if (_0x54e424["hostname"] === "127.0.0.1") {
      _0x54e424["hostname"] = "localhost";
    } else {
      if (_0x54e424["hostname"] === "localhost") {
        _0x54e424['hostname'] = '127.0.0.1';
      } else {
        return _0x63ab46;
      }
    }
    return _0x54e424["href"];
  } catch {
    return _0x63ab46;
  }
}
function readPreviewCache(_0x62b50a) {
  const _0x5b7784 = desktopPreviewUrlCache["get"](_0x62b50a);
  if (!_0x5b7784) {
    return '';
  }
  if (Number(_0x5b7784["expiresAt"] || 0x0) <= Date["now"]()) {
    desktopPreviewUrlCache["delete"](_0x62b50a);
    return '';
  }
  return String(_0x5b7784["url"] || '');
}
function writePreviewCache(_0x326eff, _0x352268) {
  if (!_0x326eff || !_0x352268) {
    return;
  }
  desktopPreviewUrlCache["set"](_0x326eff, {
    'url': _0x352268,
    'expiresAt': Date['now']() + DESKTOP_PREVIEW_URL_CACHE_TTL_MS
  });
}
function getMediaElementSource(_0x5b111b) {
  const _0x6d7c9c = _0x5b111b?.["getAttribute"];
  if (typeof _0x6d7c9c === 'function') {
    return String(_0x6d7c9c['call'](_0x5b111b, "src") || _0x5b111b?.['src'] || '')['trim']();
  }
  return String(_0x5b111b?.["src"] || _0x5b111b?.["currentSrc"] || '')["trim"]();
}
export function getMediaElementCurrentSource(_0x3a3908) {
  return getMediaElementSource(_0x3a3908);
}
export function getMediaElementPlaybackSourceKey(_0x8c3b7f) {
  const _0x4810a6 = getMediaElementSource(_0x8c3b7f);
  if (!_0x4810a6) {
    return '';
  }
  const _0x17f43a = String(_0x8c3b7f?.["dataset"]?.['desktopMediaSourceUrl'] || '')["trim"]();
  if (_0x17f43a) {
    return _0x17f43a;
  }
  return _0x4810a6;
}
export function normalizeMediaPlaybackSourceUrl(_0x5ab2a9) {
  return normalizeUrl(_0x5ab2a9);
}
export function isMediaElementPlaybackSource(_0x4b71b9, _0x2b45a1) {
  const _0xa8890f = getMediaElementPlaybackSourceKey(_0x4b71b9);
  const _0x586e7f = normalizeUrl(_0x2b45a1);
  return !!_0xa8890f && !!_0x586e7f && normalizeUrl(_0xa8890f) === _0x586e7f;
}
export function clearDesktopMediaPlaybackSourceMetadata(_0x572c64) {
  if (!_0x572c64?.['dataset']) {
    return;
  }
  delete _0x572c64["dataset"]["desktopMediaSourceUrl"];
}
function assignMediaElementSource(_0x1306a0, _0x24dfda, _0x3167bd = "auto", _0x279de2 = {}) {
  if (!_0x1306a0 || !_0x24dfda) {
    return '';
  }
  if (typeof _0x279de2["shouldAssign"] === "function" && _0x279de2['shouldAssign']() !== !![]) {
    return '';
  }
  const _0x578f5b = nowMs();
  const _0x4d9bda = normalizeUrl(_0x279de2["originalSourceUrl"] || _0x24dfda);
  const _0x163453 = normalizeUrl(_0x24dfda);
  let _0x362627 = ![];
  LOCAL_PREVIEW_SCHEME_RE["test"](_0x163453) && 'crossOrigin' in _0x1306a0 && _0x1306a0["crossOrigin"] !== "anonymous" && (_0x1306a0['crossOrigin'] = "anonymous", _0x362627 = !![]);
  const _0x609409 = getMediaElementSource(_0x1306a0);
  const _0x5ba8a1 = String(_0x1306a0?.["dataset"]?.["desktopMediaSourceUrl"] || '')["trim"]();
  if (!_0x362627 && _0x609409 && (normalizeUrl(_0x609409) === _0x163453 || _0x5ba8a1 && normalizeUrl(_0x5ba8a1) === _0x4d9bda)) {
    return _0x609409;
  }
  _0x1306a0["preload"] = _0x3167bd || _0x1306a0["preload"] || "auto";
  _0x1306a0["dataset"] && (_0x4d9bda && _0x163453 !== _0x4d9bda ? _0x1306a0['dataset']["desktopMediaSourceUrl"] = _0x4d9bda : delete _0x1306a0["dataset"]['desktopMediaSourceUrl']);
  typeof _0x1306a0["setAttribute"] === 'function' ? _0x1306a0["setAttribute"]("src", _0x24dfda) : _0x1306a0['src'] = _0x24dfda;
  try {
    _0x279de2['onSourceAssigned']?.({
      'originalSourceUrl': _0x4d9bda,
      'playbackUrl': _0x163453
    });
  } catch {}
  if (_0x279de2["load"] !== ![]) {
    try {
      _0x1306a0["load"]?.();
    } catch {}
  }
  markMediaSourceAttach({
    'originalSourceUrl': _0x4d9bda,
    'playbackUrl': _0x163453,
    'tag': String(_0x1306a0?.["tagName"] || '')["toLowerCase"](),
    'loadRequested': _0x279de2["load"] !== ![],
    'durationMs': Math["max"](0x0, nowMs() - _0x578f5b)
  });
  return _0x24dfda;
}
export async function resolveDesktopMediaPlaybackUrl(_0x3a6f69) {
  const _0x7c3242 = normalizeUrl(_0x3a6f69);
  if (desktopBridge['isChromeShell']) {
    return _0x7c3242;
  }
  if (!isDesktopRenderer()) {
    return _0x7c3242;
  }
  const _0x243a3a = normalizeDesktopLocalMediaPath(_0x7c3242 || _0x3a6f69);
  if (!_0x243a3a) {
    return _0x7c3242;
  }
  if (shouldUseDirectLocalMediaSource()) {
    return _0x7c3242;
  }
  const _0xaa4e66 = readPreviewCache(_0x243a3a);
  if (_0xaa4e66) {
    return _0xaa4e66;
  }
  const _0x5102fb = desktopPreviewUrlPendingCache['get'](_0x243a3a);
  if (_0x5102fb) {
    return await _0x5102fb;
  }
  const _0x11ad52 = (async () => {
    try {
      const _0x413923 = await desktopBridge["mediaPreview"]['getLocalPreviewUrl']({
        'localPath': _0x243a3a,
        'type': inferMediaMimeType(_0x243a3a)
      });
      const _0x1e1c81 = String(_0x413923?.["url"] || _0x413923 || '')["trim"]();
      if (_0x1e1c81) {
        writePreviewCache(_0x243a3a, _0x1e1c81);
        return _0x1e1c81;
      }
    } catch {}
    return _0x7c3242;
  })()["finally"](() => {
    desktopPreviewUrlPendingCache["delete"](_0x243a3a);
  });
  desktopPreviewUrlPendingCache["set"](_0x243a3a, _0x11ad52);
  return await _0x11ad52;
}
export async function attachDesktopMediaPlaybackSource(_0x464e89, _0x4c7642, _0x42be3b = {}) {
  if (!_0x464e89) {
    return '';
  }
  const _0x2cb5a5 = normalizeUrl(_0x4c7642);
  const _0x679e88 = isDesktopRenderer() ? await resolveDesktopMediaPlaybackUrl(_0x4c7642) : _0x4c7642;
  const _0x170222 = resolveChromeShellAudioPlaybackUrl(_0x464e89, _0x679e88);
  return assignMediaElementSource(_0x464e89, _0x170222, _0x42be3b["preload"] || _0x464e89['preload'], {
    'originalSourceUrl': _0x2cb5a5,
    'load': _0x42be3b["load"],
    'onSourceAssigned': _0x42be3b['onSourceAssigned'],
    'shouldAssign': _0x42be3b["shouldAssign"]
  });
}
export async function attachMediaElementPlaybackSource(_0x2c29ec, _0x4d7412, _0x5141d4 = {}) {
  if (!_0x2c29ec) {
    return '';
  }
  const _0x52b78f = normalizeUrl(_0x4d7412);
  if (!_0x52b78f) {
    return '';
  }
  const _0x284851 = String(_0x5141d4['playbackUrl'] || '')['trim']();
  const _0x4e71f3 = _0x284851 || (isDesktopRenderer() ? await resolveDesktopMediaPlaybackUrl(_0x4d7412) : _0x4d7412);
  const _0x3a3d7e = _0x284851 ? _0x4e71f3 : resolveChromeShellAudioPlaybackUrl(_0x2c29ec, _0x4e71f3);
  return assignMediaElementSource(_0x2c29ec, _0x3a3d7e, _0x5141d4["preload"] || _0x2c29ec["preload"], {
    'originalSourceUrl': _0x52b78f,
    'load': _0x5141d4['load'],
    'onSourceAssigned': _0x5141d4['onSourceAssigned'],
    'shouldAssign': _0x5141d4['shouldAssign']
  });
}
export const __desktopMediaBlobSourceForTest = {
  'clearBlobCacheForTest'() {
    desktopPreviewUrlCache["clear"]();
    desktopPreviewUrlPendingCache['clear']();
  },
  'isDesktopBlobCandidate': isDesktopBlobCandidate,
  'normalizeDesktopLocalMediaPath': normalizeDesktopLocalMediaPath,
  'normalizeUrl': normalizeUrl,
  'resolveDesktopMediaPlaybackUrl': resolveDesktopMediaPlaybackUrl
};