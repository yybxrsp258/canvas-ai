import { buildImageNodeStorageFields, pickCanvasImageLocalPath, pickCanvasThumbLocalPath, pickPreviewFallbackLocalPath, pickPreviewImageLocalPath, toLocalPathUrl } from './imageDerivativeService.js';
import { isSafeVirtualLocalPath, localPathToUrl, normalizeLocalPath } from '../utils/localMediaPath.js';
const REMOTE_HTTP_RE = /^https?:\/\//i;
const IMAGE_NODE_TYPES = new Set(["source-image", 'image', "ai-image"]);
const VIDEO_NODE_TYPES = new Set(["source-video", "video", "ai-video"]);
const AUDIO_NODE_TYPES = new Set(["source-audio", 'audio', 'ai-audio']);
export const VIDEO_PROXY_VERSION_V2_1280 = "v2-1280";
const IMAGE_TRIGGER_KEYS = ["src", "imageUrl", 'sourceUrl', 'thumbUrl', 'url', 'resultUrl', "localPath", 'originalLocalPath', 'displayLocalPath', "thumbLocalPath"];
const VIDEO_TRIGGER_KEYS = ["src", "videoUrl", "thumbUrl", 'url', "resultUrl", "localPath", "originalLocalPath", "displayLocalPath", "posterLocalPath", "videoThumbSrc", "videoMetaSrc", "videoProxyVersion", "pendingVideoProxyLocalPath", "pendingVideoProxyVersion"];
const AUDIO_TRIGGER_KEYS = ["src", "audioUrl", "url", 'resultUrl', "localPath"];
function hasOwn(_0x3543e2, _0x5beef8) {
  return !!_0x3543e2 && Object['prototype']["hasOwnProperty"]['call'](_0x3543e2, _0x5beef8);
}
function normalizeText(_0x858b6c) {
  return String(_0x858b6c || '')["trim"]();
}
function firstNonEmptyString(..._0x57d2f3) {
  for (const _0x3e1887 of _0x57d2f3) {
    const _0x3e7847 = normalizeText(_0x3e1887);
    if (_0x3e7847) {
      return _0x3e7847;
    }
  }
  return '';
}
function touchesAnyKey(_0x5d1903, _0x3fb4da) {
  return Array["isArray"](_0x3fb4da) && _0x3fb4da["some"](_0x5a0659 => hasOwn(_0x5d1903, _0x5a0659));
}
function normalizeLocalUrlText(_0x1ad898) {
  const _0x459adc = normalizeCanvasLocalPath(_0x1ad898);
  return localPathToUrl(_0x459adc);
}
function pickLocalPath(_0x362968, _0x94b66c) {
  for (const _0x5be12a of _0x94b66c) {
    const _0x18d577 = normalizeCanvasLocalPath(_0x362968?.[_0x5be12a]);
    if (_0x18d577) {
      return _0x18d577;
    }
  }
  return '';
}
function copyCommonImageMeta(_0x3c4d94, _0x4ece4c) {
  const {
    originalWidth: _0x2be7fa,
    originalHeight: _0x4324c9
  } = buildImageNodeStorageFields(_0x4ece4c);
  if (_0x2be7fa) {
    _0x3c4d94["originalWidth"] = _0x2be7fa;
  }
  if (_0x4324c9) {
    _0x3c4d94["originalHeight"] = _0x4324c9;
  }
  if (hasOwn(_0x4ece4c, "assetId")) {
    _0x3c4d94['assetId'] = normalizeText(_0x4ece4c["assetId"]);
  }
  if (hasOwn(_0x4ece4c, "sourceId")) {
    _0x3c4d94['sourceId'] = normalizeText(_0x4ece4c["sourceId"]);
  }
  if (hasOwn(_0x4ece4c, 'thumbId')) {
    _0x3c4d94['thumbId'] = normalizeText(_0x4ece4c["thumbId"]);
  }
  if (hasOwn(_0x4ece4c, 'fileName')) {
    _0x3c4d94["fileName"] = _0x4ece4c['fileName'];
  }
  if (hasOwn(_0x4ece4c, "error")) {
    _0x3c4d94['error'] = _0x4ece4c["error"];
  }
  hasOwn(_0x4ece4c, "derivativeStatus") && (_0x3c4d94["derivativeStatus"] = normalizeText(_0x4ece4c['derivativeStatus']));
}
function copyCommonVideoMeta(_0x15970f, _0x1245b3) {
  if (hasOwn(_0x1245b3, "assetId")) {
    _0x15970f["assetId"] = normalizeText(_0x1245b3["assetId"]);
  }
  if (hasOwn(_0x1245b3, "fileName")) {
    _0x15970f['fileName'] = _0x1245b3["fileName"];
  }
  if (hasOwn(_0x1245b3, "thumbId")) {
    _0x15970f['thumbId'] = normalizeText(_0x1245b3["thumbId"]);
  }
  hasOwn(_0x1245b3, "videoProxyStatus") && (_0x15970f["videoProxyStatus"] = normalizeText(_0x1245b3["videoProxyStatus"]));
  hasOwn(_0x1245b3, "videoProxyVersion") && (_0x15970f["videoProxyVersion"] = normalizeText(_0x1245b3['videoProxyVersion']));
  hasOwn(_0x1245b3, "pendingVideoProxyLocalPath") && (_0x15970f["pendingVideoProxyLocalPath"] = normalizeCanvasLocalPath(_0x1245b3["pendingVideoProxyLocalPath"]));
  hasOwn(_0x1245b3, "pendingVideoProxyVersion") && (_0x15970f['pendingVideoProxyVersion'] = normalizeText(_0x1245b3["pendingVideoProxyVersion"]));
  if (hasOwn(_0x1245b3, "videoCodec")) {
    _0x15970f["videoCodec"] = normalizeText(_0x1245b3["videoCodec"]);
  }
  if (hasOwn(_0x1245b3, "videoWidth")) {
    _0x15970f["videoWidth"] = Number(_0x1245b3["videoWidth"] || 0x0) || 0x0;
  }
  if (hasOwn(_0x1245b3, 'videoHeight')) {
    _0x15970f["videoHeight"] = Number(_0x1245b3["videoHeight"] || 0x0) || 0x0;
  }
  if (hasOwn(_0x1245b3, "videoDuration")) {
    _0x15970f['videoDuration'] = Number(_0x1245b3["videoDuration"] || 0x0) || 0x0;
  }
  if (hasOwn(_0x1245b3, "videoFps")) {
    _0x15970f["videoFps"] = Number(_0x1245b3['videoFps'] || 0x0) || 0x0;
  }
  hasOwn(_0x1245b3, "derivativeStatus") && (_0x15970f["derivativeStatus"] = normalizeText(_0x1245b3["derivativeStatus"]));
}
function buildNormalizedImageStorage(_0x163ace = {}) {
  const _0x58a2cc = pickLocalPath(_0x163ace, ["localPath", "originalLocalPath", 'displayLocalPath', "imageUrl", 'sourceUrl', 'src', "url", "resultUrl"]);
  const _0x1e778b = pickLocalPath(_0x163ace, ['originalLocalPath', "localPath", "originalUrl", "sourceUrl", "imageUrl", 'src', 'url', "resultUrl"]);
  const _0x553568 = pickLocalPath(_0x163ace, ["displayLocalPath", "displayUrl", "imageUrl", "src", 'url', 'resultUrl']);
  const _0x4c78ad = pickLocalPath(_0x163ace, ["thumbLocalPath", 'thumbUrl']);
  return buildImageNodeStorageFields({
    ..._0x163ace,
    'localPath': _0x58a2cc,
    'originalLocalPath': _0x1e778b,
    'displayLocalPath': _0x553568,
    'thumbLocalPath': _0x4c78ad
  });
}
export function resolveCanvasImageSourceUrl(_0x226ec7 = {}) {
  const _0x5d02e9 = buildNormalizedImageStorage(_0x226ec7);
  const _0xa7a7ff = pickPreviewImageLocalPath(_0x5d02e9) || _0x5d02e9["originalLocalPath"] || _0x5d02e9['localPath'];
  return toLocalPathUrl(_0xa7a7ff);
}
function resolveCanvasImageDisplayPath(_0x401938 = {}) {
  return pickCanvasImageLocalPath(buildNormalizedImageStorage(_0x401938));
}
function resolveCanvasImageThumbPath(_0x234712 = {}) {
  return pickCanvasThumbLocalPath(buildNormalizedImageStorage(_0x234712));
}
export function isRemoteHttpUrl(_0x1ad97b) {
  return REMOTE_HTTP_RE["test"](normalizeText(_0x1ad97b));
}
export function normalizeCanvasLocalPath(_0xe6db2) {
  return normalizeLocalPath(_0xe6db2);
}
export function toCanvasLocalUrl(_0x5885c1) {
  return localPathToUrl(_0x5885c1);
}
export function resolveCanvasImageDisplayUrl(_0xa6a715 = {}) {
  return toLocalPathUrl(resolveCanvasImageDisplayPath(_0xa6a715));
}
export function resolveCanvasImageThumbUrl(_0x1866bc = {}) {
  return toLocalPathUrl(resolveCanvasImageThumbPath(_0x1866bc));
}
export function resolveCanvasImageLowZoomUrl(_0x547bf6 = {}) {
  return resolveCanvasImageThumbUrl(_0x547bf6) || resolveCanvasImageDisplayUrl(_0x547bf6) || resolveCanvasImageSourceUrl(_0x547bf6);
}
export function resolveCanvasImagePreviewUrl(_0x52d1c6 = {}) {
  const _0x5ee1b0 = buildNormalizedImageStorage(_0x52d1c6);
  const _0x4b871b = firstNonEmptyString(pickPreviewImageLocalPath(_0x5ee1b0), pickPreviewFallbackLocalPath(_0x5ee1b0));
  return toLocalPathUrl(_0x4b871b);
}
export function resolveCanvasVideoLocalPath(_0x210e4e = {}) {
  const _0x1767f2 = pickLocalPath(_0x210e4e, ["displayLocalPath"]);
  if (_0x1767f2) {
    return _0x1767f2;
  }
  const _0x25fd7b = normalizeText(_0x210e4e?.["videoProxyStatus"]);
  if (_0x25fd7b === "processing" || _0x25fd7b === "waiting") {
    return '';
  }
  return pickLocalPath(_0x210e4e, ["src", "videoUrl", "url", "resultUrl", "localPath"]);
}
export function resolveCanvasVideoUrl(_0x450175 = {}) {
  return toCanvasLocalUrl(resolveCanvasVideoLocalPath(_0x450175));
}
export function resolveCanvasVideoDisplayUrl(_0x236eff = {}) {
  return resolveCanvasVideoUrl(_0x236eff);
}
export function buildCanvasVideoProxyPromotionPatch(_0x4ebf43 = {}) {
  const _0xdf9da9 = pickLocalPath(_0x4ebf43, ["pendingVideoProxyLocalPath"]);
  const _0x5c6f7b = normalizeText(_0x4ebf43?.["pendingVideoProxyVersion"]);
  if (!_0xdf9da9 || _0x5c6f7b !== VIDEO_PROXY_VERSION_V2_1280) {
    return null;
  }
  return {
    ...buildCanvasLocalVideoFields({
      'displayLocalPath': _0xdf9da9,
      'videoProxyStatus': "generated",
      'videoProxyVersion': _0x5c6f7b
    }),
    'pendingVideoProxyLocalPath': '',
    'pendingVideoProxyVersion': '',
    'videoProxyMigrationStatus': "promoted",
    'videoProxyMigrationError': ''
  };
}
function normalizeCanvasVideoPosterUrl(_0x162550, {
  localOnly = ![]
} = {}) {
  const _0x38e90a = normalizeText(_0x162550);
  if (!_0x38e90a) {
    return '';
  }
  if (/^data:image\//i['test'](_0x38e90a) || /^blob:/i["test"](_0x38e90a) || /^aic-local-preview:/i["test"](_0x38e90a)) {
    return _0x38e90a;
  }
  if (/^(?:https?:|file:)/i["test"](_0x38e90a)) {
    return '';
  }
  const _0x2da0e7 = localPathToUrl(_0x38e90a);
  if (_0x2da0e7) {
    return _0x2da0e7;
  }
  return localOnly ? '' : _0x38e90a;
}
export function resolveCanvasVideoPosterUrl(_0x1a0ae5 = {}) {
  const _0x37c2e9 = Array["isArray"](_0x1a0ae5?.["videos"]) ? _0x1a0ae5["videos"] : [];
  const _0x4afb52 = Math["max"](0x0, Number(_0x1a0ae5?.["mainVideoIndex"]) || 0x0);
  const _0x17e0c8 = _0x37c2e9[_0x4afb52] || _0x37c2e9[0x0] || null;
  const _0x1d5810 = [[_0x17e0c8?.["posterLocalPath"], !![]], [_0x17e0c8?.["previewLocalPath"], !![]], [_0x17e0c8?.["thumbLocalPath"], !![]], [_0x17e0c8?.['thumbnailLocalPath'], !![]], [_0x17e0c8?.["posterUrl"], ![]], [_0x17e0c8?.["previewUrl"], ![]], [_0x17e0c8?.["thumbUrl"], ![]], [_0x17e0c8?.["thumbnailUrl"], ![]], [_0x1a0ae5?.["posterLocalPath"], !![]], [_0x1a0ae5?.["previewLocalPath"], !![]], [_0x1a0ae5?.["thumbLocalPath"], !![]], [_0x1a0ae5?.["thumbnailLocalPath"], !![]], [_0x1a0ae5?.['posterUrl'], ![]], [_0x1a0ae5?.["previewUrl"], ![]], [_0x1a0ae5?.["thumbUrl"], ![]], [_0x1a0ae5?.["thumbnailUrl"], ![]]];
  for (const [_0xfda386, _0x2a928b] of _0x1d5810) {
    const _0x47dabd = normalizeCanvasVideoPosterUrl(_0xfda386, {
      'localOnly': _0x2a928b
    });
    if (_0x47dabd) {
      return _0x47dabd;
    }
  }
  return '';
}
export function resolveCanvasAudioLocalPath(_0xb72c5c = {}) {
  const _0x5ca33b = Array['isArray'](_0xb72c5c?.["audios"]) ? _0xb72c5c['audios'] : [];
  const _0x56f4a8 = Number["isFinite"](Number(_0xb72c5c?.['mainAudioIndex'])) ? Math["max"](0x0, Math["trunc"](Number(_0xb72c5c['mainAudioIndex']))) : 0x0;
  const _0x10ed45 = _0x5ca33b[_0x56f4a8] || _0x5ca33b[0x0] || null;
  const _0x5cad3c = pickLocalPath(_0x10ed45, ["localPath", 'audioUrl', "src", 'url', "resultUrl"]);
  if (_0x5cad3c) {
    return _0x5cad3c;
  }
  return pickLocalPath(_0xb72c5c, ["localPath", "audioUrl", "src", 'url', 'resultUrl']);
}
export function resolveCanvasAudioUrl(_0x3e36d3 = {}) {
  return toCanvasLocalUrl(resolveCanvasAudioLocalPath(_0x3e36d3));
}
export function buildCanvasLocalImageFields(_0x480230 = {}, _0x3d16f2 = {}) {
  const _0x267280 = buildNormalizedImageStorage(_0x480230);
  const _0x22766d = toLocalPathUrl(pickCanvasImageLocalPath(_0x267280));
  const _0x3adef9 = resolveCanvasImageSourceUrl(_0x267280);
  const _0x3436bb = toLocalPathUrl(pickCanvasThumbLocalPath(_0x267280));
  const _0x23aa75 = _0x3d16f2["includeSrc"] === !![] || hasOwn(_0x480230, "src");
  const _0x4739c5 = _0x3d16f2["includeCanonicalUrl"] === !![] || hasOwn(_0x480230, 'url');
  const _0x3e82e5 = _0x3d16f2["includeResultUrl"] === !![] || hasOwn(_0x480230, "resultUrl");
  const _0x3b82d9 = {};
  (hasOwn(_0x480230, "localPath") || _0x267280['localPath'] || _0x267280["originalLocalPath"]) && (_0x3b82d9["localPath"] = _0x267280["localPath"] || '', _0x3b82d9['originalLocalPath'] = _0x267280["originalLocalPath"] || '');
  (hasOwn(_0x480230, 'displayLocalPath') || _0x267280["displayLocalPath"]) && (_0x3b82d9["displayLocalPath"] = _0x267280['displayLocalPath'] || '');
  (hasOwn(_0x480230, "thumbLocalPath") || hasOwn(_0x480230, 'thumbUrl') || _0x267280["thumbLocalPath"]) && (_0x3b82d9['thumbLocalPath'] = _0x267280["thumbLocalPath"] || '');
  (touchesAnyKey(_0x480230, ["imageUrl", 'sourceUrl', "thumbUrl", "localPath", 'originalLocalPath', "displayLocalPath", "thumbLocalPath", 'src', "url", "resultUrl"]) || _0x22766d || _0x3adef9 || _0x3436bb) && (_0x3b82d9["imageUrl"] = _0x22766d || '', _0x3b82d9['sourceUrl'] = _0x3adef9 || '', _0x3b82d9["thumbUrl"] = _0x3436bb || '');
  if (_0x23aa75) {
    _0x3b82d9["src"] = _0x22766d || '';
  }
  if (_0x4739c5) {
    _0x3b82d9["url"] = _0x22766d || '';
  }
  if (_0x3e82e5) {
    _0x3b82d9["resultUrl"] = _0x22766d || '';
  }
  copyCommonImageMeta(_0x3b82d9, _0x480230);
  return _0x3b82d9;
}
export function buildCanvasLocalVideoFields(_0x2cd7f0 = {}, _0x57c1d2 = {}) {
  const _0x412655 = pickLocalPath(_0x2cd7f0, ["localPath", "originalLocalPath", "videoUrl", "src", 'url', 'resultUrl']);
  const _0x2b56bf = pickLocalPath(_0x2cd7f0, ["originalLocalPath"]);
  const _0x2c15e0 = pickLocalPath(_0x2cd7f0, ["displayLocalPath"]);
  const _0x19285f = resolveCanvasVideoLocalPath(_0x2cd7f0);
  const _0x47e4ee = toLocalPathUrl(_0x19285f);
  const _0x368b22 = toCanvasLocalUrl(_0x2cd7f0?.['thumbUrl']);
  const _0x2d9cdc = pickLocalPath(_0x2cd7f0, ["posterLocalPath"]);
  const _0x10db21 = toLocalPathUrl(_0x2d9cdc);
  const _0x1da50a = toCanvasLocalUrl(_0x2cd7f0?.['videoThumbSrc'] || _0x19285f);
  const _0xd94725 = _0x57c1d2["includeCanonicalUrl"] === !![] || hasOwn(_0x2cd7f0, "url");
  const _0x546b33 = _0x57c1d2["includeResultUrl"] === !![] || hasOwn(_0x2cd7f0, "resultUrl");
  const _0x48ebbe = {};
  (hasOwn(_0x2cd7f0, 'localPath') || hasOwn(_0x2cd7f0, "videoUrl") || hasOwn(_0x2cd7f0, "src") || hasOwn(_0x2cd7f0, 'url') || hasOwn(_0x2cd7f0, "resultUrl") || hasOwn(_0x2cd7f0, "displayLocalPath") || _0x19285f) && ((hasOwn(_0x2cd7f0, "localPath") || hasOwn(_0x2cd7f0, "videoUrl") || hasOwn(_0x2cd7f0, "src") || hasOwn(_0x2cd7f0, "url") || hasOwn(_0x2cd7f0, "resultUrl") || _0x412655) && (_0x48ebbe["localPath"] = _0x412655 || ''), (hasOwn(_0x2cd7f0, 'originalLocalPath') || _0x2b56bf) && (_0x48ebbe['originalLocalPath'] = _0x2b56bf || ''), (hasOwn(_0x2cd7f0, "displayLocalPath") || _0x2c15e0) && (_0x48ebbe['displayLocalPath'] = _0x2c15e0 || ''), _0x48ebbe["videoUrl"] = _0x47e4ee || '', _0x48ebbe["src"] = _0x47e4ee || '');
  (hasOwn(_0x2cd7f0, "thumbUrl") || _0x368b22) && (_0x48ebbe["thumbUrl"] = _0x368b22 || _0x10db21 || '');
  if (hasOwn(_0x2cd7f0, "posterLocalPath") || _0x2d9cdc) {
    _0x48ebbe["posterLocalPath"] = _0x2d9cdc || '';
    if (!_0x48ebbe['thumbUrl']) {
      _0x48ebbe["thumbUrl"] = _0x10db21 || '';
    }
  }
  hasOwn(_0x2cd7f0, "videoThumbSrc") && (_0x48ebbe["videoThumbSrc"] = _0x1da50a || '');
  hasOwn(_0x2cd7f0, "videoMetaSrc") && (_0x48ebbe['videoMetaSrc'] = toCanvasLocalUrl(_0x2cd7f0["videoMetaSrc"] || _0x19285f));
  if (_0xd94725) {
    _0x48ebbe["url"] = _0x47e4ee || '';
  }
  if (_0x546b33) {
    _0x48ebbe["resultUrl"] = _0x47e4ee || '';
  }
  copyCommonVideoMeta(_0x48ebbe, _0x2cd7f0);
  return _0x48ebbe;
}
export function buildCanvasLocalAudioFields(_0xddfb36 = {}, _0x171308 = {}) {
  const _0x1436d3 = resolveCanvasAudioLocalPath(_0xddfb36);
  const _0x1ae0b7 = toLocalPathUrl(_0x1436d3);
  const _0x118478 = pickLocalPath(_0xddfb36, ["waveformLocalPath"]);
  const _0xc072af = _0x171308["includeCanonicalUrl"] === !![] || hasOwn(_0xddfb36, "url");
  const _0x45b00f = _0x171308["includeResultUrl"] === !![] || hasOwn(_0xddfb36, 'resultUrl');
  const _0x45c2fb = {};
  (hasOwn(_0xddfb36, "localPath") || hasOwn(_0xddfb36, "audioUrl") || hasOwn(_0xddfb36, "src") || hasOwn(_0xddfb36, 'url') || hasOwn(_0xddfb36, 'resultUrl') || _0x1436d3) && (_0x45c2fb['localPath'] = _0x1436d3 || '', _0x45c2fb["audioUrl"] = _0x1ae0b7 || '', _0x45c2fb["src"] = _0x1ae0b7 || '');
  if (_0xc072af) {
    _0x45c2fb['url'] = _0x1ae0b7 || '';
  }
  if (_0x45b00f) {
    _0x45c2fb['resultUrl'] = _0x1ae0b7 || '';
  }
  (hasOwn(_0xddfb36, "waveformLocalPath") || _0x118478) && (_0x45c2fb["waveformLocalPath"] = _0x118478 || '');
  if (hasOwn(_0xddfb36, "assetId")) {
    _0x45c2fb["assetId"] = normalizeText(_0xddfb36["assetId"]);
  }
  hasOwn(_0xddfb36, 'derivativeStatus') && (_0x45c2fb['derivativeStatus'] = normalizeText(_0xddfb36['derivativeStatus']));
  if (hasOwn(_0xddfb36, "fileName")) {
    _0x45c2fb["fileName"] = _0xddfb36["fileName"];
  }
  return _0x45c2fb;
}
function normalizeRemoteMediaFallback() {
  return '';
}
function normalizeImageCollection(_0x5e5957) {
  if (!Array["isArray"](_0x5e5957)) {
    return _0x5e5957;
  }
  return _0x5e5957["map"](_0x45be9a => {
    if (!_0x45be9a || typeof _0x45be9a !== "object") {
      return _0x45be9a;
    }
    return {
      ..._0x45be9a,
      ...buildCanvasLocalImageFields(_0x45be9a, {
        'includeSrc': hasOwn(_0x45be9a, 'src'),
        'includeCanonicalUrl': hasOwn(_0x45be9a, "url"),
        'includeResultUrl': hasOwn(_0x45be9a, 'resultUrl')
      }),
      'remoteFallbackUrl': normalizeRemoteMediaFallback(_0x45be9a)
    };
  });
}
function normalizeVideoCollection(_0xd8e8c8) {
  if (!Array["isArray"](_0xd8e8c8)) {
    return _0xd8e8c8;
  }
  return _0xd8e8c8["map"](_0x1f81ea => {
    if (!_0x1f81ea || typeof _0x1f81ea !== 'object') {
      return _0x1f81ea;
    }
    return {
      ..._0x1f81ea,
      ...buildCanvasLocalVideoFields(_0x1f81ea, {
        'includeCanonicalUrl': hasOwn(_0x1f81ea, "url"),
        'includeResultUrl': hasOwn(_0x1f81ea, "resultUrl")
      }),
      'remoteFallbackUrl': normalizeRemoteMediaFallback(_0x1f81ea)
    };
  });
}
function normalizeAudioCollection(_0x1b2644) {
  if (!Array['isArray'](_0x1b2644)) {
    return _0x1b2644;
  }
  return _0x1b2644["map"](_0x56750b => {
    if (!_0x56750b || typeof _0x56750b !== 'object') {
      return _0x56750b;
    }
    return {
      ..._0x56750b,
      ...buildCanvasLocalAudioFields(_0x56750b, {
        'includeCanonicalUrl': hasOwn(_0x56750b, "url"),
        'includeResultUrl': hasOwn(_0x56750b, 'resultUrl')
      })
    };
  });
}
function validateUrlField(_0x3ba13b, _0x5c60f9) {
  const _0x2534ad = normalizeText(_0x5c60f9);
  if (!_0x2534ad) {
    return;
  }
  if (normalizeLocalUrlText(_0x2534ad) !== _0x2534ad) {
    throw new Error("[canvasMediaLocalService] " + _0x3ba13b + " 必须是本地 URL");
  }
}
function validatePathField(_0x114bb5, _0xbc123e) {
  const _0x4f4e59 = normalizeText(_0xbc123e);
  if (!_0x4f4e59) {
    return;
  }
  const _0xc402f6 = normalizeCanvasLocalPath(_0x4f4e59);
  if (!_0xc402f6 || !isSafeVirtualLocalPath(_0xc402f6)) {
    throw new Error("[canvasMediaLocalService] " + _0x114bb5 + " 必须是本地路径");
  }
}
export function assertCanvasMediaPatchLocalOnly(_0x4c51db = {}) {
  if (!_0x4c51db || typeof _0x4c51db !== "object") {
    return;
  }
  const _0x28eb0f = _0x100dcd => {
    if (!_0x100dcd || typeof _0x100dcd !== "object") {
      return;
    }
    for (const _0x20c2a0 of ["src", "imageUrl", "sourceUrl", "thumbUrl", "videoUrl", 'audioUrl', 'url', "resultUrl", "videoThumbSrc", "videoMetaSrc"]) {
      if (hasOwn(_0x100dcd, _0x20c2a0)) {
        validateUrlField(_0x20c2a0, _0x100dcd[_0x20c2a0]);
      }
    }
    for (const _0x8f263 of ['localPath', "originalLocalPath", "displayLocalPath", "pendingVideoProxyLocalPath", "thumbLocalPath", "posterLocalPath", "waveformLocalPath", 'imageLocalPath', "path"]) {
      if (hasOwn(_0x100dcd, _0x8f263)) {
        validatePathField(_0x8f263, _0x100dcd[_0x8f263]);
      }
    }
  };
  _0x28eb0f(_0x4c51db);
  if (Array["isArray"](_0x4c51db["images"])) {
    for (const _0x4661c8 of _0x4c51db["images"]) {
      _0x28eb0f(_0x4661c8);
    }
  }
  if (Array["isArray"](_0x4c51db['videos'])) {
    for (const _0x1d3081 of _0x4c51db['videos']) {
      _0x28eb0f(_0x1d3081);
    }
  }
  if (Array['isArray'](_0x4c51db["audios"])) {
    for (const _0xcf9cd4 of _0x4c51db["audios"]) {
      _0x28eb0f(_0xcf9cd4);
    }
  }
}
export function sanitizeCanvasNodeMediaPatchForStore(_0x17305d = {}, _0x2f080f = null) {
  if (!_0x17305d || typeof _0x17305d !== "object" || Array["isArray"](_0x17305d)) {
    return _0x17305d;
  }
  const _0x25423e = normalizeText(_0x17305d['type'] || _0x2f080f?.["type"]);
  const _0x141659 = {
    ..._0x17305d
  };
  hasOwn(_0x17305d, "images") && (_0x141659['images'] = normalizeImageCollection(_0x17305d['images']));
  (hasOwn(_0x17305d, 'remoteFallbackUrl') || hasOwn(_0x17305d, "localSaveError")) && (_0x141659['remoteFallbackUrl'] = normalizeRemoteMediaFallback({
    ...(_0x2f080f && typeof _0x2f080f === "object" ? _0x2f080f : {}),
    ..._0x17305d
  }));
  hasOwn(_0x17305d, 'videos') && (_0x141659['videos'] = normalizeVideoCollection(_0x17305d["videos"]));
  hasOwn(_0x17305d, "audios") && (_0x141659["audios"] = normalizeAudioCollection(_0x17305d["audios"]));
  const _0x2889cf = hasOwn(_0x17305d, "images") || !VIDEO_NODE_TYPES["has"](_0x25423e) && !AUDIO_NODE_TYPES["has"](_0x25423e) && (touchesAnyKey(_0x17305d, IMAGE_TRIGGER_KEYS) || IMAGE_NODE_TYPES["has"](_0x25423e) && touchesAnyKey(_0x17305d, ["src", "localPath", "fileName"]));
  _0x2889cf && Object["assign"](_0x141659, buildCanvasLocalImageFields(_0x17305d, {
    'includeSrc': hasOwn(_0x17305d, "src") || IMAGE_NODE_TYPES['has'](_0x25423e),
    'includeCanonicalUrl': hasOwn(_0x17305d, "url"),
    'includeResultUrl': hasOwn(_0x17305d, "resultUrl")
  }));
  const _0x42e8d0 = hasOwn(_0x17305d, "videos") || touchesAnyKey(_0x17305d, ["videoUrl", "videoThumbSrc", "videoMetaSrc", "posterLocalPath", "videoProxyStatus", "videoProxyVersion"]) || VIDEO_NODE_TYPES['has'](_0x25423e) && touchesAnyKey(_0x17305d, VIDEO_TRIGGER_KEYS);
  _0x42e8d0 && Object["assign"](_0x141659, buildCanvasLocalVideoFields(_0x17305d, {
    'includeCanonicalUrl': hasOwn(_0x17305d, 'url'),
    'includeResultUrl': hasOwn(_0x17305d, "resultUrl")
  }));
  const _0x4f98cd = hasOwn(_0x17305d, 'audios') || hasOwn(_0x17305d, 'audioUrl') || AUDIO_NODE_TYPES['has'](_0x25423e) && touchesAnyKey(_0x17305d, ['src', 'localPath', 'waveformLocalPath', 'fileName']);
  _0x4f98cd && Object['assign'](_0x141659, buildCanvasLocalAudioFields(_0x17305d, {
    'includeCanonicalUrl': hasOwn(_0x17305d, 'url'),
    'includeResultUrl': hasOwn(_0x17305d, "resultUrl")
  }));
  return _0x141659;
}