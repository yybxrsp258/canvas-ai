import { generateThumbnail } from '../modules/imageUtils.js';
import { ensureLocalImageDerivatives, uploadFile } from './projectService.js';
import { buildImageNodeStorageFields } from './imageDerivativeService.js';
import a1702_0x3ac6f7 from '../core/stores/appStore.js';
import { screenToWorld } from '../core/math.js';
import { showError, showWarning } from './toastService.js';
import { setThumbnail } from './thumbnailCacheService.js';
import { installMediaTaskUpdateListener, shouldApplyMediaTaskEventToNode } from './mediaTaskService.js';
import { logDiagnosticEvent } from './diagnosticsService.js';
import { logDragImportProfile } from './dragImportDiagnostics.js';
import { desktopBridge } from './desktopBridge.js';
import { subscribeAssetUpdates } from './assetUpdateService.js';
import { saveTextDownload } from './downloadSaveService.js';
import { isProjectImportFileName } from '../utils/canvasProjectFileNames.js';
import { localPathToUrl, pickResultLocalPath } from '../utils/localMediaPath.js';
import { t } from '../i18n/index.js';
import { AI_GENERATION_NODE_SHORT_SIDE, AI_TEXT_DEFAULT_RATIO, MEDIA_CLIP_COMPACT_SIZE, SOURCE_MEDIA_AUTO_RESIZE_SHORT_SIDE } from './mediaSizingPolicy.js';
export const CANVAS_VIDEO_IMPORT_MAX_BYTES = 0x12c * 0x400 * 0x400;
export const CANVAS_VIDEO_IMPORT_MAX_MB = Math["round"](CANVAS_VIDEO_IMPORT_MAX_BYTES / 0x400 / 0x400);
import { WEB_PREVIEW_MIN_SIZE } from '../modules/webPreviewSizing.js';
import { WHITEBOARD_DEFAULT_SIZE } from '../modules/whiteboard/whiteboardNodeData.js';
export { AI_GENERATION_NODE_SHORT_SIDE, AI_TEXT_DEFAULT_RATIO, MEDIA_CLIP_COMPACT_SIZE, SOURCE_MEDIA_AUTO_RESIZE_SHORT_SIDE } from './mediaSizingPolicy.js';
function _toOneLineMessage(_0x32d68e) {
  const _0x520345 = typeof _0x32d68e === 'string' ? _0x32d68e : _0x32d68e?.['message'] ? String(_0x32d68e["message"]) : t("fileService.unknownError");
  return _0x520345["replace"](/\s+/g, '\x20')["trim"]();
}
function _profileDragImport(_0x110076, _0x37ebed = {}) {
  logDragImportProfile(_0x110076, _0x37ebed);
}
const ASSET_MEDIA_TASK_STATUS_RANK = new Map([['waiting', 0x1], ["processing", 0x2], ["cancelled", 0x3], ["failed", 0x3], ["complete", 0x3]]);
let _assetUpdatedListenerInstalled = ![];
function normalizeAssetUpdatedAt(_0x1f91c5) {
  const _0x19e058 = String(_0x1f91c5 || '')["trim"]();
  if (!_0x19e058) {
    return '';
  }
  const _0x2024dd = Date["parse"](_0x19e058);
  return Number["isFinite"](_0x2024dd) ? _0x2024dd : '';
}
function normalizeAssetRevision(_0x55961d) {
  const _0x320eb5 = Math["trunc"](Number(_0x55961d));
  return Number["isFinite"](_0x320eb5) && _0x320eb5 > 0x0 ? _0x320eb5 : 0x0;
}
export function shouldApplyElectronAssetUpdateToNode(_0x48b138 = {}, _0x95a490 = {}) {
  const _0xb5f832 = normalizeAssetRevision(_0x95a490?.["assetRevision"]);
  const _0x40fe6b = normalizeAssetRevision(_0x48b138?.['assetRevision']);
  if (_0xb5f832 > 0x0 && _0x40fe6b > 0x0) {
    return _0xb5f832 > _0x40fe6b;
  }
  const _0x1173aa = normalizeAssetUpdatedAt(_0x95a490?.["assetUpdatedAt"] || _0x95a490?.["updatedAt"]);
  const _0x12dcf0 = normalizeAssetUpdatedAt(_0x48b138?.["assetUpdatedAt"]);
  const _0x5ecaf8 = _0x1173aa !== '' && _0x12dcf0 !== '';
  if (_0x5ecaf8 && _0x1173aa < _0x12dcf0) {
    return ![];
  }
  const _0x94d61 = {
    'taskId': _0x95a490?.["mediaTaskId"] || '',
    'kind': _0x95a490?.["mediaTaskKind"] || '',
    'status': _0x95a490?.["mediaTaskStatus"] || ''
  };
  if (shouldApplyMediaTaskEventToNode(_0x48b138, _0x94d61)) {
    const _0x1bb3b4 = String(_0x94d61["taskId"] || '')["trim"]();
    const _0x19ca0f = String(_0x48b138?.["mediaTaskId"] || '')["trim"]();
    if (!_0x1bb3b4 || !_0x19ca0f || _0x1bb3b4 === _0x19ca0f) {
      const _0x6b560e = ASSET_MEDIA_TASK_STATUS_RANK['get'](String(_0x94d61["status"] || '')['trim']()["toLowerCase"]()) || 0x0;
      const _0x371d7c = ASSET_MEDIA_TASK_STATUS_RANK["get"](String(_0x48b138?.["mediaTaskStatus"] || '')['trim']()["toLowerCase"]()) || 0x0;
      if (_0x6b560e < _0x371d7c) {
        return ![];
      }
    }
    return !![];
  }
  return _0x5ecaf8 && _0x1173aa > _0x12dcf0;
}
function assignPositiveNumber(_0x37964e, _0x3c87a5, ..._0x1e05b6) {
  const _0x5db649 = _0x1e05b6["map"](_0x509d26 => Number(_0x509d26))["find"](_0x49ec5d => Number['isFinite'](_0x49ec5d) && _0x49ec5d > 0x0);
  if (_0x5db649 !== undefined) {
    _0x37964e[_0x3c87a5] = _0x5db649;
  }
}
export function buildElectronAssetNodePatch(_0x4e696c = {}) {
  const _0xc69a48 = String(_0x4e696c?.["assetId"] || '')['trim']();
  if (!_0xc69a48) {
    return {};
  }
  const _0x1cc5da = {
    'assetId': _0xc69a48,
    'localPath': _0x4e696c?.["localPath"] || _0x4e696c?.["originalLocalPath"] || '',
    'originalLocalPath': _0x4e696c?.["originalLocalPath"] || _0x4e696c?.['localPath'] || '',
    'displayLocalPath': _0x4e696c?.['displayLocalPath'] || '',
    'thumbLocalPath': _0x4e696c?.["thumbLocalPath"] || _0x4e696c?.['posterLocalPath'] || '',
    'posterLocalPath': _0x4e696c?.["posterLocalPath"] || '',
    'waveformLocalPath': _0x4e696c?.["waveformLocalPath"] || '',
    'derivativeStatus': _0x4e696c?.["derivativeStatus"] || _0x4e696c?.['status'] || '',
    'mediaTaskId': _0x4e696c?.["mediaTaskId"] || '',
    'mediaTaskKind': _0x4e696c?.['mediaTaskKind'] || '',
    'mediaTaskStatus': _0x4e696c?.["mediaTaskStatus"] || '',
    'mediaTaskProgress': Number(_0x4e696c?.["mediaTaskProgress"] || 0x0) || 0x0,
    'mediaTaskError': _0x4e696c?.["mediaTaskError"] || '',
    'videoProxyStatus': _0x4e696c?.["videoProxyStatus"] || '',
    'videoProxyVersion': _0x4e696c?.["videoProxyVersion"] || '',
    'videoCodec': _0x4e696c?.["videoCodec"] || ''
  };
  const _0x43e701 = String(_0x4e696c?.["assetUpdatedAt"] || _0x4e696c?.["updatedAt"] || '')['trim']();
  const _0x58342c = normalizeAssetRevision(_0x4e696c?.["assetRevision"]);
  if (_0x58342c > 0x0) {
    _0x1cc5da["assetRevision"] = _0x58342c;
  }
  if (_0x43e701) {
    _0x1cc5da["assetUpdatedAt"] = _0x43e701;
  }
  assignPositiveNumber(_0x1cc5da, 'videoWidth', _0x4e696c?.['videoWidth'], _0x4e696c?.["width"]);
  assignPositiveNumber(_0x1cc5da, "videoHeight", _0x4e696c?.['videoHeight'], _0x4e696c?.["height"]);
  assignPositiveNumber(_0x1cc5da, "videoDuration", _0x4e696c?.["videoDuration"]);
  assignPositiveNumber(_0x1cc5da, "videoFps", _0x4e696c?.["videoFps"]);
  if (_0x4e696c?.["kind"] === "image") {
    _0x1cc5da["src"] = _0x4e696c?.["displayUrl"] || _0x4e696c?.["url"] || '';
    _0x1cc5da['imageUrl'] = _0x4e696c?.['displayUrl'] || _0x4e696c?.["url"] || '';
    _0x1cc5da['sourceUrl'] = _0x4e696c?.['originalUrl'] || '';
    _0x1cc5da["thumbUrl"] = _0x4e696c?.["thumbUrl"] || '';
  } else {
    if (_0x4e696c?.["kind"] === "video") {
      _0x1cc5da['src'] = _0x4e696c?.['displayUrl'] || _0x4e696c?.["url"] || _0x4e696c?.["originalUrl"] || '';
      _0x1cc5da['videoUrl'] = _0x4e696c?.['displayUrl'] || _0x4e696c?.["url"] || _0x4e696c?.["originalUrl"] || '';
      _0x1cc5da["sourceUrl"] = _0x4e696c?.["originalUrl"] || _0x4e696c?.["url"] || '';
      _0x1cc5da["thumbUrl"] = _0x4e696c?.['posterUrl'] || _0x4e696c?.["thumbUrl"] || '';
    } else {
      _0x4e696c?.['kind'] === 'audio' && (_0x1cc5da['src'] = _0x4e696c?.['originalUrl'] || _0x4e696c?.["url"] || '', _0x1cc5da["audioUrl"] = _0x4e696c?.["originalUrl"] || _0x4e696c?.["url"] || '');
    }
  }
  return _0x1cc5da;
}
export function applyElectronAssetUpdate(_0xe3d706 = {}, _0x5cb373 = a1702_0x3ac6f7) {
  const _0x14badc = String(_0xe3d706?.['assetId'] || '')["trim"]();
  if (!_0x14badc) {
    return [];
  }
  const _0x301ea6 = typeof _0x5cb373?.['getStateRaw'] === "function" ? _0x5cb373["getStateRaw"]() : _0x5cb373?.["getState"]?.();
  const _0x365646 = _0x301ea6?.["nodes"] || {};
  const _0x33faf4 = [];
  Object["values"](_0x365646)["forEach"](_0x2e3b72 => {
    if (String(_0x2e3b72?.['assetId'] || '')["trim"]() !== _0x14badc) {
      return;
    }
    if (!shouldApplyElectronAssetUpdateToNode(_0x2e3b72, _0xe3d706)) {
      return;
    }
    const _0x31a3d6 = buildElectronAssetNodePatch(_0xe3d706);
    const _0x8f3977 = Object['entries'](_0x31a3d6)["some"](([_0x58d612, _0x4c4fc5]) => _0x2e3b72?.[_0x58d612] !== _0x4c4fc5);
    if (!_0x8f3977) {
      return;
    }
    _0x5cb373['updateNodeData'](_0x2e3b72['id'], _0x31a3d6);
    _0x33faf4["push"](_0x2e3b72['id']);
  });
  return _0x33faf4;
}
function installElectronAssetUpdatedListener() {
  if (_assetUpdatedListenerInstalled) {
    return;
  }
  _assetUpdatedListenerInstalled = !![];
  if (!desktopBridge["assetImport"]["canSubscribeUpdates"]()) {
    return;
  }
  subscribeAssetUpdates(_0x40e27b => {
    applyElectronAssetUpdate(_0x40e27b);
  });
}
installElectronAssetUpdatedListener();
installMediaTaskUpdateListener();
export function getBaseName(_0x2d3e37) {
  const _0x1add87 = String(_0x2d3e37 || '')["trim"]();
  return _0x1add87['replace'](/\.[^/.]+$/, '');
}
function getDefaultNodeName(_0x9076e0) {
  const _0x52f372 = {
    'source-image': t("fileService.defaultNames.image"),
    'source-video': t("fileService.defaultNames.video"),
    'source-audio': t("fileService.defaultNames.audio"),
    'media-clip': t("fileService.defaultNames.mediaClip"),
    'source-text': t("fileService.defaultNames.text")
  };
  return _0x52f372[_0x9076e0] || t("fileService.defaultNames.file");
}
export function getNodeTypeByFile(_0x2266ca) {
  if (_0x2266ca["type"]["startsWith"]('image/')) {
    return "source-image";
  }
  if (_0x2266ca["type"]["startsWith"]("video/")) {
    return "source-video";
  }
  if (_0x2266ca["type"]['startsWith']("audio/")) {
    return "source-audio";
  }
  if (_0x2266ca["type"] === "text/plain" || _0x2266ca["name"]["endsWith"](".txt")) {
    return "source-text";
  }
  return null;
}
export function getNodeDefaultSize(_0x1c87cd) {
  const _0x6bbd8a = {
    'source-image': {
      'width': 0x200,
      'height': 0x120
    },
    'source-video': {
      'width': 0x200,
      'height': 0x120
    },
    'web-preview': {
      ...WEB_PREVIEW_MIN_SIZE
    },
    'web-reference-card': {
      'width': 0x1a4,
      'height': 0x168
    },
    'source-audio': {
      'width': 0x140,
      'height': 0x8c
    },
    'media-clip': {
      ...MEDIA_CLIP_COMPACT_SIZE
    },
    'collage': {
      'width': 0x240,
      'height': 0x240
    },
    'whiteboard': {
      ...WHITEBOARD_DEFAULT_SIZE
    },
    'source-text': {
      'width': 0x200,
      'height': 0x120
    },
    'comment-note': {
      'width': 0x104,
      'height': 0x78
    },
    'debug': {
      'width': 0x168,
      'height': 0x280
    },
    'storyboard': {
      'width': 0x384,
      'height': 0x384
    },
    'storyboard-script': {
      'width': 0x400,
      'height': 0x240
    },
    'panorama-scene': {
      'width': 0x400,
      'height': 0x240
    },
    'panorama-360': {
      'width': 0x400,
      'height': 0x240
    }
  };
  return _0x6bbd8a[_0x1c87cd] || {
    'width': 0x140,
    'height': 0xb4
  };
}
export function getAutoMediaSizeByShortSide(_0x291b02, _0x3484ce, _0x2c9323 = SOURCE_MEDIA_AUTO_RESIZE_SHORT_SIDE) {
  const _0x37abcb = Math["max"](0x1, Number(_0x291b02) || 0x1);
  const _0x3d8662 = Math["max"](0x1, Number(_0x3484ce) || 0x1);
  const _0x4c165a = Math["max"](0x1, Number(_0x2c9323) || SOURCE_MEDIA_AUTO_RESIZE_SHORT_SIDE);
  const _0x59da3b = Math["min"](_0x37abcb, _0x3d8662);
  const _0x287fff = _0x4c165a / _0x59da3b;
  return {
    'width': Math["max"](0x1, Math["round"](_0x37abcb * _0x287fff)),
    'height': Math["max"](0x1, Math["round"](_0x3d8662 * _0x287fff))
  };
}
export function getAIGenerationNodeSize(_0x240c14, _0x3972b, _0x1740a6 = AI_GENERATION_NODE_SHORT_SIDE) {
  const _0x14d739 = Math["max"](0x1, Number(_0x1740a6) || AI_GENERATION_NODE_SHORT_SIDE);
  const _0x1d39a2 = Number(_0x240c14) || 0x0;
  const _0x4bbd2f = Number(_0x3972b) || 0x0;
  if (_0x1d39a2 > 0x0 && _0x4bbd2f > 0x0) {
    return getAutoMediaSizeByShortSide(_0x1d39a2, _0x4bbd2f, _0x14d739);
  }
  return {
    'width': _0x14d739,
    'height': _0x14d739
  };
}
export function getAIGenerationDefaultSizeByType(_0x163dbc, _0x5114dc = AI_GENERATION_NODE_SHORT_SIDE) {
  const _0x511937 = String(_0x163dbc || '')['trim']();
  if (_0x511937 === "ai-text") {
    return getAutoMediaSizeByShortSide(AI_TEXT_DEFAULT_RATIO["width"], AI_TEXT_DEFAULT_RATIO["height"], _0x5114dc);
  }
  if (_0x511937 === "ai-image" || _0x511937 === "ai-video") {
    return getAIGenerationNodeSize(undefined, undefined, _0x5114dc);
  }
  return {
    'width': Math["max"](0x1, Number(_0x5114dc) || AI_GENERATION_NODE_SHORT_SIDE),
    'height': Math["max"](0x1, Number(_0x5114dc) || AI_GENERATION_NODE_SHORT_SIDE)
  };
}
export function buildSourceMediaNodePayload(_0x236b0b = {}) {
  const _0x3dc984 = String(_0x236b0b['type'] || '')['trim']();
  if (_0x3dc984 !== "source-image" && _0x3dc984 !== "source-video") {
    throw new Error("Unsupported source media type: " + (_0x3dc984 || "unknown"));
  }
  const _0x5a2af3 = {
    ..._0x236b0b,
    'id': _0x236b0b['id'],
    'type': _0x3dc984,
    'x': Number(_0x236b0b['x']) || 0x0,
    'y': Number(_0x236b0b['y']) || 0x0,
    'src': _0x236b0b["src"] || '',
    'localPath': _0x236b0b["localPath"] || '',
    'fileName': _0x236b0b['fileName'] || '',
    'name': _0x236b0b['name'] || getDefaultNodeName(_0x3dc984)
  };
  delete _0x5a2af3['naturalWidth'];
  delete _0x5a2af3["naturalHeight"];
  const _0x4f6010 = Number(_0x236b0b["naturalWidth"] || 0x0);
  const _0x47f251 = Number(_0x236b0b['naturalHeight'] || 0x0);
  const _0x267cd4 = Number(_0x236b0b["width"] || 0x0);
  const _0x4c9f48 = Number(_0x236b0b['height'] || 0x0);
  const _0x5813dd = _0x4f6010 > 0x0 && _0x47f251 > 0x0;
  const _0x79992b = _0x267cd4 > 0x0 && _0x4c9f48 > 0x0;
  const _0x2c578d = _0x79992b && (_0x236b0b["needsAutoResize"] === ![] || _0x236b0b["fixedSize"] === !![] || _0x236b0b["useExplicitSizeAsSource"] === !![]);
  const _0x5cde40 = _0x5813dd ? getAutoMediaSizeByShortSide(_0x4f6010, _0x47f251) : _0x2c578d ? {
    'width': _0x267cd4,
    'height': _0x4c9f48
  } : getNodeDefaultSize(_0x3dc984);
  const _0x3bc9a0 = !!String(_0x236b0b["src"] || _0x236b0b['localPath'] || '')['trim']();
  const _0x33c7a6 = typeof _0x236b0b["needsAutoResize"] === "boolean" ? _0x236b0b["needsAutoResize"] : !_0x5813dd && !_0x2c578d;
  _0x33c7a6 && _0x5a2af3["fixedSize"] && (_0x5a2af3["fixedSize"] = ![]);
  return {
    ..._0x5a2af3,
    'width': _0x5cde40["width"],
    'height': _0x5cde40['height'],
    'needsAutoResize': _0x33c7a6
  };
}
export function buildSourceAudioNodePayload(_0x592324 = {}) {
  const _0x51cfaf = String(_0x592324["type"] || "source-audio")["trim"]();
  if (_0x51cfaf !== "source-audio") {
    throw new Error("Unsupported source audio type: " + (_0x51cfaf || "unknown"));
  }
  const _0x113719 = getNodeDefaultSize('source-audio');
  const _0x4a7a21 = Number(_0x592324["width"]) > 0x0 ? Number(_0x592324["width"]) : _0x113719['width'];
  const _0x250573 = Number(_0x592324['height']) > 0x0 ? Number(_0x592324["height"]) : _0x113719['height'];
  return {
    ..._0x592324,
    'id': _0x592324['id'],
    'type': "source-audio",
    'x': Number(_0x592324['x']) || 0x0,
    'y': Number(_0x592324['y']) || 0x0,
    'width': _0x4a7a21,
    'height': _0x250573,
    'src': _0x592324["src"] || '',
    'localPath': _0x592324["localPath"] || '',
    'fileName': _0x592324["fileName"] || '',
    'name': _0x592324["name"] || getDefaultNodeName("source-audio"),
    'needsAutoResize': ![],
    'fixedSize': typeof _0x592324["fixedSize"] === 'boolean' ? _0x592324['fixedSize'] : !![]
  };
}
function generateNodeId(_0x46b58e, _0x3e3228 = 0x0) {
  return _0x46b58e + '-' + Date["now"]() + '-' + Math["random"]()['toString'](0x24)['slice'](0x2, 0x7) + '-' + _0x3e3228;
}
const WEB_PREVIEW_IMAGE_DROP_MIME = "application/x-ai-canvas-web-preview-image";
const IMAGE_URL_EXTENSION_RE = /\.(?:png|jpe?g|webp|gif|bmp|svg|avif)(?:[?#].*)?$/i;
const VIDEO_URL_EXTENSION_RE = /\.(?:mp4|webm|mov|m4v|ogv)(?:[?#].*)?$/i;
const STREAM_MEDIA_URL_EXTENSION_RE = /\.(?:m3u8|mpd)(?:[?#].*)?$/i;
const WEB_IMAGE_REMOTE_IMPORT_CONCURRENCY = 0x3;
const WEB_VIDEO_TRUSTED_SOURCE_TYPES = new Set(['video', 'video-source', "source", "video-resource", "douyin-detail"]);
const _webImageRemoteImportQueue = [];
let _webImageRemoteImportActive = 0x0;
function normalizeHttpDropUrl(_0x4dfd85) {
  const _0x1d44b4 = String(_0x4dfd85 || '')["trim"]();
  if (!_0x1d44b4) {
    return '';
  }
  try {
    const _0x46f143 = new URL(_0x1d44b4, globalThis["location"]?.["href"] || 'https://example.invalid/');
    if (_0x46f143["protocol"] !== 'http:' && _0x46f143["protocol"] !== "https:") {
      return '';
    }
    _0x46f143['username'] = '';
    _0x46f143["password"] = '';
    return _0x46f143["href"];
  } catch {
    return '';
  }
}
function toPositiveMediaDimension(_0x31ebeb) {
  const _0x404997 = Number(_0x31ebeb);
  if (!Number["isFinite"](_0x404997) || _0x404997 <= 0x0) {
    return 0x0;
  }
  return Math["max"](0x1, Math["round"](_0x404997));
}
function normalizeWebImagePayloadSize(_0x4f312f = {}) {
  const _0x186eab = toPositiveMediaDimension(_0x4f312f?.["width"] ?? _0x4f312f?.['naturalWidth'] ?? _0x4f312f?.['imageWidth']);
  const _0x4e00d2 = toPositiveMediaDimension(_0x4f312f?.['height'] ?? _0x4f312f?.["naturalHeight"] ?? _0x4f312f?.["imageHeight"]);
  return _0x186eab > 0x0 && _0x4e00d2 > 0x0 ? {
    'width': _0x186eab,
    'height': _0x4e00d2
  } : {};
}
function readDataTransferText(_0x359db9, _0x55cf1e) {
  try {
    return String(_0x359db9?.['getData']?.(_0x55cf1e) || '')["trim"]();
  } catch {
    return '';
  }
}
function normalizeWebImagePayload(_0x5c17fd = {}) {
  const _0x4baf7a = normalizeHttpDropUrl(_0x5c17fd?.["url"]);
  if (!_0x4baf7a) {
    return null;
  }
  const _0x109db7 = normalizeHttpDropUrl(_0x5c17fd?.["pageUrl"] || _0x5c17fd?.["sourceUrl"] || _0x5c17fd?.["webPageUrl"] || '');
  return {
    'kind': "image",
    'url': _0x4baf7a,
    'title': String(_0x5c17fd?.["title"] || _0x5c17fd?.['alt'] || '')["trim"]()["slice"](0x0, 0xa0),
    'pageUrl': _0x109db7,
    'sourceUrl': _0x109db7,
    'nodeId': String(_0x5c17fd?.["nodeId"] || '')["trim"](),
    'tabId': String(_0x5c17fd?.["tabId"] || '')["trim"](),
    ...normalizeWebImagePayloadSize(_0x5c17fd)
  };
}
function normalizeWebVideoPayload(_0x29ef81 = {}) {
  const _0x3b8f37 = normalizeHttpDropUrl(_0x29ef81?.["url"]);
  if (!_0x3b8f37) {
    return null;
  }
  const _0x23d84d = String(_0x29ef81?.["mimeType"] || '')["trim"]();
  const _0x488c37 = String(_0x29ef81?.["sourceType"] || '')['trim']()["toLowerCase"]();
  try {
    const _0x125e10 = new URL(_0x3b8f37)["pathname"];
    if (STREAM_MEDIA_URL_EXTENSION_RE["test"](_0x125e10)) {
      return null;
    }
    const _0x34c97b = _0x23d84d["toLowerCase"]()["startsWith"]("video/") || VIDEO_URL_EXTENSION_RE["test"](_0x125e10) || WEB_VIDEO_TRUSTED_SOURCE_TYPES['has'](_0x488c37);
    if (!_0x34c97b) {
      return null;
    }
  } catch {
    return null;
  }
  const _0x3f9ab1 = normalizeHttpDropUrl(_0x29ef81?.["pageUrl"] || _0x29ef81?.["sourceUrl"] || _0x29ef81?.["webPageUrl"] || '');
  return {
    'kind': 'video',
    'url': _0x3b8f37,
    'title': String(_0x29ef81?.['title'] || '')['trim']()['slice'](0x0, 0xa0),
    'pageUrl': _0x3f9ab1,
    'sourceUrl': _0x3f9ab1,
    'nodeId': String(_0x29ef81?.["nodeId"] || '')["trim"](),
    'tabId': String(_0x29ef81?.["tabId"] || '')["trim"](),
    'width': Math["max"](0x0, Math["round"](Number(_0x29ef81?.["width"] || 0x0) || 0x0)),
    'height': Math["max"](0x0, Math["round"](Number(_0x29ef81?.["height"] || 0x0) || 0x0)),
    'duration': Math["max"](0x0, Number(_0x29ef81?.['duration'] || 0x0) || 0x0),
    'mimeType': _0x23d84d,
    'sourceType': _0x488c37,
    'rightsConfirmed': _0x29ef81?.['rightsConfirmed'] === !![]
  };
}
function parseWebPreviewImagePayload(_0x6dc575) {
  try {
    const _0x32b486 = JSON["parse"](String(_0x6dc575 || ''));
    if (_0x32b486?.["kind"] !== "image") {
      return null;
    }
    return normalizeWebImagePayload(_0x32b486);
  } catch {
    return null;
  }
}
function extractFirstUriListUrl(_0x109cb6) {
  return String(_0x109cb6 || '')['split'](/\r?\n/)['map'](_0x334647 => _0x334647["trim"]())["find"](_0x480fc4 => _0x480fc4 && !_0x480fc4["startsWith"]('#')) || '';
}
function decodeHtmlAttribute(_0x4ab3bc) {
  return String(_0x4ab3bc || '')["replace"](/&amp;/g, '&')["replace"](/&quot;/g, '\x22')["replace"](/&#39;/g, '\x27')["replace"](/&lt;/g, '<')["replace"](/&gt;/g, '>');
}
function extractImageUrlFromHtml(_0x398b07) {
  const _0xeb5b57 = String(_0x398b07 || '');
  const _0x3466a0 = _0xeb5b57["match"](/<img\b[^>]*\bsrc\s*=\s*(["'])(?<src>.*?)\1/i);
  return normalizeHttpDropUrl(decodeHtmlAttribute(_0x3466a0?.["groups"]?.["src"] || ''));
}
function looksLikeImageUrl(_0x2e6af7) {
  const _0x4e60e8 = normalizeHttpDropUrl(_0x2e6af7);
  if (!_0x4e60e8) {
    return '';
  }
  try {
    const _0x487eb4 = new URL(_0x4e60e8);
    if (IMAGE_URL_EXTENSION_RE["test"](_0x487eb4['pathname'])) {
      return _0x4e60e8;
    }
    const _0x56cc2e = _0x487eb4["searchParams"]["get"]("format") || _0x487eb4['searchParams']["get"]("type") || '';
    return /^(?:png|jpe?g|webp|gif|bmp|svg|avif)$/i['test'](_0x56cc2e) ? _0x4e60e8 : '';
  } catch {
    return '';
  }
}
export function extractWebImageDropUrl(_0x45d3db) {
  return extractWebImageDropPayload(_0x45d3db)?.["url"] || '';
}
export function extractWebImageDropPayload(_0x573eea) {
  const _0x3622ca = parseWebPreviewImagePayload(readDataTransferText(_0x573eea, WEB_PREVIEW_IMAGE_DROP_MIME));
  if (_0x3622ca) {
    return _0x3622ca;
  }
  const _0x2465bb = extractImageUrlFromHtml(readDataTransferText(_0x573eea, "text/html"));
  if (_0x2465bb) {
    return normalizeWebImagePayload({
      'url': _0x2465bb
    });
  }
  const _0x53045b = looksLikeImageUrl(extractFirstUriListUrl(readDataTransferText(_0x573eea, "text/uri-list")));
  if (_0x53045b) {
    return normalizeWebImagePayload({
      'url': _0x53045b
    });
  }
  const _0x3059d8 = looksLikeImageUrl(readDataTransferText(_0x573eea, "text/plain"));
  return _0x3059d8 ? normalizeWebImagePayload({
    'url': _0x3059d8
  }) : null;
}
function getRemoteImageFileName(_0x52cde5) {
  try {
    const _0xa3d564 = new URL(_0x52cde5);
    const _0x24b5a4 = decodeURIComponent(_0xa3d564["pathname"]["split"]('/')["filter"](Boolean)["pop"]() || '');
    return _0x24b5a4 || t("fileService.defaultNames.webImage");
  } catch {
    return t("fileService.defaultNames.webImage");
  }
}
function getRemoteVideoFileName(_0x1f2d79) {
  try {
    const _0x5b5682 = new URL(_0x1f2d79);
    const _0x2b400d = decodeURIComponent(_0x5b5682["pathname"]["split"]('/')["filter"](Boolean)["pop"]() || '');
    if (_0x2b400d && !STREAM_MEDIA_URL_EXTENSION_RE["test"](_0x2b400d)) {
      return _0x2b400d;
    }
    return t("fileService.defaultNames.webVideo");
  } catch {
    return t("fileService.defaultNames.webVideo");
  }
}
export function buildWebImageDropNodePayload({
  url: _0x2f13c8,
  title = '',
  pageUrl = '',
  nodeId: _0x5b6527,
  worldX: _0x18ce26,
  worldY: _0x5a7152,
  width = 0x0,
  height = 0x0
} = {}) {
  const _0x2bf9be = normalizeHttpDropUrl(_0x2f13c8);
  if (!_0x2bf9be) {
    return null;
  }
  const _0x50de19 = getRemoteImageFileName(_0x2bf9be);
  const _0x4b5b10 = normalizeHttpDropUrl(pageUrl);
  const _0x481657 = String(title || '')["trim"]()["slice"](0x0, 0xa0);
  const _0xea0e62 = toPositiveMediaDimension(width);
  const _0x2be37d = toPositiveMediaDimension(height);
  const _0x507020 = _0xea0e62 > 0x0 && _0x2be37d > 0x0;
  return buildSourceMediaNodePayload({
    'id': _0x5b6527 || generateNodeId("source-image"),
    'type': 'source-image',
    'x': _0x18ce26,
    'y': _0x5a7152,
    'naturalWidth': _0xea0e62,
    'naturalHeight': _0x2be37d,
    ...(_0x507020 ? {
      'imageWidth': _0xea0e62,
      'imageHeight': _0x2be37d
    } : {}),
    'capturePreviewUrl': _0x2bf9be,
    'webSourceUrl': _0x2bf9be,
    'webPageUrl': _0x4b5b10,
    'webSourceTitle': _0x481657,
    'fileName': _0x50de19,
    'name': _0x481657 || getBaseName(_0x50de19) || t("fileService.defaultNames.webImage"),
    'needsAutoResize': !![],
    'isGenerating': !![],
    'jobStatus': "running",
    'jobError': null,
    'generationStartTime': Date['now'](),
    'generationDuration': null
  });
}
function buildRemoteImageImportPatch(_0x2a9a3f = {}, _0xfc4afd = {}) {
  const _0x7f8df5 = buildImageNodeStorageFields(_0x2a9a3f);
  const _0x4ced59 = localPathToUrl(_0x7f8df5["displayLocalPath"] || _0x7f8df5["originalLocalPath"] || _0x7f8df5['localPath']);
  const _0x20fc87 = localPathToUrl(_0x7f8df5["originalLocalPath"] || _0x7f8df5["localPath"] || _0x7f8df5["displayLocalPath"]);
  const _0x49da9f = localPathToUrl(_0x7f8df5['thumbLocalPath']);
  return {
    'assetId': _0x2a9a3f?.["assetId"] || '',
    'assetRevision': normalizeAssetRevision(_0x2a9a3f?.["assetRevision"]),
    'assetUpdatedAt': _0x2a9a3f?.["assetUpdatedAt"] || _0x2a9a3f?.["updatedAt"] || '',
    'derivativeStatus': _0x2a9a3f?.["derivativeStatus"] || _0x2a9a3f?.["status"] || '',
    ..._0x7f8df5,
    'src': _0x4ced59 || _0x20fc87 || '',
    'imageUrl': _0x4ced59 || _0x20fc87 || '',
    'sourceUrl': _0x20fc87 || _0x4ced59 || '',
    'thumbUrl': _0x49da9f,
    'isGenerating': ![],
    'jobStatus': null,
    'jobError': null,
    'generationDuration': Date["now"]() - Number(_0xfc4afd?.["generationStartTime"] || Date["now"]()),
    'capturePreviewUrl': ''
  };
}
export function buildWebVideoSourceNodePayload({
  url: _0x2f94bc,
  title = '',
  pageUrl = '',
  nodeId: _0xa6ca21,
  worldX: _0x13f448,
  worldY: _0x5d3b4d,
  width = 0x0,
  height = 0x0,
  duration = 0x0
} = {}) {
  const _0x30d91d = normalizeHttpDropUrl(_0x2f94bc);
  if (!_0x30d91d) {
    return null;
  }
  try {
    if (STREAM_MEDIA_URL_EXTENSION_RE["test"](new URL(_0x30d91d)["pathname"])) {
      return null;
    }
  } catch {
    return null;
  }
  const _0x45c188 = getRemoteVideoFileName(_0x30d91d);
  const _0x11f197 = normalizeHttpDropUrl(pageUrl);
  const _0x306f3b = String(title || '')["trim"]()['slice'](0x0, 0xa0);
  return buildSourceMediaNodePayload({
    'id': _0xa6ca21 || generateNodeId("source-video"),
    'type': "source-video",
    'x': _0x13f448,
    'y': _0x5d3b4d,
    'webSourceUrl': _0x30d91d,
    'webPageUrl': _0x11f197,
    'webSourceTitle': _0x306f3b,
    'webMediaKind': "video",
    'webRightsConfirmed': !![],
    'fileName': _0x45c188,
    'name': _0x306f3b || getBaseName(_0x45c188) || t('fileService.defaultNames.webVideo'),
    'naturalWidth': width,
    'naturalHeight': height,
    'videoWidth': Number(width || 0x0) || 0x0,
    'videoHeight': Number(height || 0x0) || 0x0,
    'videoDuration': Number(duration || 0x0) || 0x0,
    'needsAutoResize': !![],
    'isGenerating': !![],
    'jobStatus': "running",
    'jobError': null,
    'generationStartTime': Date['now'](),
    'generationDuration': null
  });
}
function buildRemoteVideoImportPatch(_0x367449 = {}, _0x4c155f = {}) {
  const _0x373b75 = _0x367449?.['localPath'] || _0x367449?.['originalLocalPath'] || '';
  const _0x2f4908 = _0x367449?.["displayLocalPath"] || '';
  const _0x21cb5b = _0x2f4908 || _0x373b75;
  const _0x504717 = localPathToUrl(_0x21cb5b);
  const _0x245d65 = localPathToUrl(_0x373b75 || _0x2f4908);
  const _0x3473ba = _0x367449?.["posterLocalPath"] || _0x367449?.["thumbLocalPath"] || '';
  const _0x121e46 = _0x367449?.["posterUrl"] || _0x367449?.["thumbUrl"] || localPathToUrl(_0x3473ba);
  const _0x48b4c4 = String(_0x367449?.['mediaTaskStatus'] || '')["trim"]();
  const _0x448c71 = String(_0x367449?.["videoProxyStatus"] || '')['trim']();
  const _0x265fdd = _0x48b4c4 === "waiting" || _0x48b4c4 === "processing" || _0x448c71 === "processing";
  return {
    'assetId': _0x367449?.["assetId"] || '',
    'assetRevision': normalizeAssetRevision(_0x367449?.["assetRevision"]),
    'assetUpdatedAt': _0x367449?.["assetUpdatedAt"] || _0x367449?.["updatedAt"] || '',
    'localPath': _0x373b75,
    'originalLocalPath': _0x367449?.["originalLocalPath"] || _0x373b75,
    'displayLocalPath': _0x2f4908,
    'posterLocalPath': _0x367449?.['posterLocalPath'] || '',
    'thumbLocalPath': _0x3473ba,
    'derivativeStatus': _0x367449?.["derivativeStatus"] || _0x367449?.["status"] || '',
    'mediaTaskId': _0x367449?.["mediaTaskId"] || '',
    'mediaTaskKind': _0x367449?.['mediaTaskKind'] || '',
    'mediaTaskStatus': _0x48b4c4,
    'mediaTaskProgress': Number(_0x367449?.["mediaTaskProgress"] || 0x0) || 0x0,
    'mediaTaskError': _0x367449?.["mediaTaskError"] || '',
    'videoProxyStatus': _0x448c71,
    'videoProxyVersion': _0x367449?.["videoProxyVersion"] || '',
    'videoCodec': _0x367449?.["videoCodec"] || '',
    'videoDuration': Number(_0x367449?.["videoDuration"] || 0x0) || Number(_0x4c155f?.['videoDuration'] || 0x0) || 0x0,
    'videoFps': Number(_0x367449?.['videoFps'] || 0x0) || 0x0,
    'videoWidth': Number(_0x367449?.["videoWidth"] || _0x367449?.["width"] || 0x0) || Number(_0x4c155f?.["videoWidth"] || 0x0) || 0x0,
    'videoHeight': Number(_0x367449?.["videoHeight"] || _0x367449?.["height"] || 0x0) || Number(_0x4c155f?.["videoHeight"] || 0x0) || 0x0,
    'src': _0x448c71 === 'processing' ? '' : _0x504717 || _0x245d65 || '',
    'videoUrl': _0x448c71 === "processing" ? '' : _0x504717 || _0x245d65 || '',
    'sourceUrl': _0x245d65 || _0x504717 || '',
    'thumbUrl': _0x121e46,
    'isGenerating': _0x265fdd,
    'jobStatus': _0x265fdd ? "running" : null,
    'jobError': null,
    'generationDuration': Date["now"]() - Number(_0x4c155f?.["generationStartTime"] || Date['now']()),
    'capturePreviewUrl': ''
  };
}
function getRemoteImportApi() {
  if (!desktopBridge['assetImport']["canImportRemoteAsset"]()) {
    return null;
  }
  return _0x28c4cc => desktopBridge['assetImport']["importRemoteAsset"](_0x28c4cc);
}
function pumpWebImageRemoteImportQueue() {
  while (_webImageRemoteImportActive < WEB_IMAGE_REMOTE_IMPORT_CONCURRENCY && _webImageRemoteImportQueue['length'] > 0x0) {
    const _0x40c4f2 = _webImageRemoteImportQueue["shift"]();
    _webImageRemoteImportActive += 0x1;
    Promise['resolve']()["then"](_0x40c4f2)["catch"](() => {})["finally"](() => {
      _webImageRemoteImportActive = Math["max"](0x0, _webImageRemoteImportActive - 0x1);
      pumpWebImageRemoteImportQueue();
    });
  }
}
function enqueueWebImageRemoteImport(_0x39d7b8) {
  if (typeof _0x39d7b8 !== "function") {
    return;
  }
  _webImageRemoteImportQueue["push"](_0x39d7b8);
  pumpWebImageRemoteImportQueue();
}
function buildWebImageRemoteImportFallbackPatch(_0xe68127, _0x4f8f47 = {}) {
  return {
    'isGenerating': ![],
    'jobStatus': null,
    'jobError': null,
    'webImportStatus': "failed",
    'webImportError': String(_0xe68127 || t("fileService.errors.remoteImageImportFailed")),
    'generationDuration': Date["now"]() - Number(_0x4f8f47?.["generationStartTime"] || Date["now"]())
  };
}
export function scheduleWebImageRemoteImport(_0x41a494, _0x27357e = {}, _0xfce2bc = {}) {
  const _0x315b84 = normalizeWebImagePayload(_0x27357e);
  if (!_0x41a494 || !_0x315b84) {
    return ![];
  }
  const _0x5df70d = _0xfce2bc["storeInstance"] || a1702_0x3ac6f7;
  const _0x4f81a6 = _0xfce2bc["projectId"] || globalThis["window"]?.['currentProjectId'] || 'default_v2_project';
  const _0x10a498 = _0xfce2bc["importRemoteAsset"] || getRemoteImportApi();
  const _0x3eed4d = _0x5d3451 => {
    const _0x4163f1 = _0x5df70d["getState"]?.()?.['nodes']?.[_0x41a494] || _0x5df70d["getStateRaw"]?.()?.["nodes"]?.[_0x41a494];
    if (!_0x4163f1) {
      return;
    }
    const _0x2f0c1f = normalizeHttpDropUrl(_0x4163f1["capturePreviewUrl"]);
    const _0x22550a = normalizeHttpDropUrl(_0x4163f1["webSourceUrl"]);
    if (_0x2f0c1f === _0x315b84["url"] || _0x22550a === _0x315b84['url']) {
      _0x5df70d["updateNodeData"]?.(_0x41a494, buildWebImageRemoteImportFallbackPatch(_0x5d3451, _0x4163f1));
      return;
    }
    _0x5df70d["updateNodeData"]?.(_0x41a494, {
      'isGenerating': ![],
      'jobStatus': "error",
      'jobError': String(_0x5d3451 || t("fileService.errors.remoteImageImportFailed")),
      'generationDuration': Date["now"]() - Number(_0x4163f1['generationStartTime'] || Date["now"]())
    });
  };
  enqueueWebImageRemoteImport(async () => {
    const _0x302294 = _0x5df70d["getState"]?.()?.["nodes"]?.[_0x41a494] || _0x5df70d["getStateRaw"]?.()?.["nodes"]?.[_0x41a494];
    if (!_0x302294) {
      return;
    }
    if (typeof _0x10a498 !== "function") {
      _0x3eed4d(t("fileService.errors.remoteImportUnsupported"));
      return;
    }
    try {
      const _0x5a97be = await _0x10a498({
        'url': _0x315b84["url"],
        'pageUrl': _0x315b84["pageUrl"],
        'referrer': _0x315b84["pageUrl"],
        'title': _0x315b84["title"],
        'name': getRemoteImageFileName(_0x315b84["url"]),
        'projectId': _0x4f81a6,
        'nodeId': _0x315b84["nodeId"],
        'tabId': _0x315b84['tabId']
      });
      const _0x77d7d2 = _0x5df70d['getState']?.()?.["nodes"]?.[_0x41a494] || _0x5df70d['getStateRaw']?.()?.["nodes"]?.[_0x41a494];
      if (!_0x77d7d2) {
        return;
      }
      _0x5df70d["updateNodeData"]?.(_0x41a494, buildRemoteImageImportPatch(_0x5a97be, _0x77d7d2));
    } catch (_0x351838) {
      const _0x3028f6 = _toOneLineMessage(_0x351838);
      _0x3eed4d(_0x3028f6 || t("fileService.errors.remoteImageImportFailed"));
      void logDiagnosticEvent({
        'type': "import.web_image_failed",
        'level': "warn",
        'source': "renderer",
        'message': _0x3028f6 || t("fileService.errors.remoteImageImportFailed"),
        'error': _0x351838,
        'context': {
          'url': _0x315b84["url"],
          'pageUrl': _0x315b84["pageUrl"],
          'projectId': _0x4f81a6
        }
      });
    }
  });
  return !![];
}
export function scheduleWebVideoRemoteImport(_0x1c7662, _0x275632 = {}, _0x3a327a = {}) {
  const _0x2f79c9 = normalizeWebVideoPayload(_0x275632);
  if (!_0x1c7662 || !_0x2f79c9) {
    return ![];
  }
  const _0x27dbfc = _0x3a327a["storeInstance"] || a1702_0x3ac6f7;
  const _0x44f664 = _0x3a327a["projectId"] || globalThis["window"]?.["currentProjectId"] || 'default_v2_project';
  const _0x232ea1 = _0x3a327a['importRemoteAsset'] || getRemoteImportApi();
  const _0x306a78 = _0x5d5145 => {
    const _0x999ff4 = _0x27dbfc["getState"]?.()?.["nodes"]?.[_0x1c7662] || _0x27dbfc["getStateRaw"]?.()?.["nodes"]?.[_0x1c7662];
    if (!_0x999ff4) {
      return;
    }
    _0x27dbfc["updateNodeData"]?.(_0x1c7662, {
      'isGenerating': ![],
      'jobStatus': "error",
      'jobError': String(_0x5d5145 || t("fileService.errors.remoteVideoImportFailed")),
      'generationDuration': Date['now']() - Number(_0x999ff4["generationStartTime"] || Date["now"]())
    });
  };
  enqueueWebImageRemoteImport(async () => {
    const _0x261770 = _0x27dbfc["getState"]?.()?.["nodes"]?.[_0x1c7662] || _0x27dbfc["getStateRaw"]?.()?.["nodes"]?.[_0x1c7662];
    if (!_0x261770) {
      return;
    }
    if (typeof _0x232ea1 !== "function") {
      _0x306a78(t("fileService.errors.remoteImportUnsupported"));
      return;
    }
    if (_0x2f79c9['rightsConfirmed'] !== !![]) {
      _0x306a78(t("fileService.errors.webVideoRightsRequired"));
      return;
    }
    try {
      const _0x375f72 = await _0x232ea1({
        'kind': "video",
        'url': _0x2f79c9["url"],
        'pageUrl': _0x2f79c9["pageUrl"],
        'referrer': _0x2f79c9["pageUrl"],
        'title': _0x2f79c9["title"],
        'name': getRemoteVideoFileName(_0x2f79c9['url']),
        'type': _0x2f79c9["mimeType"],
        'projectId': _0x44f664,
        'nodeId': _0x2f79c9["nodeId"],
        'tabId': _0x2f79c9["tabId"]
      });
      const _0x2ffe5a = _0x27dbfc['getState']?.()?.["nodes"]?.[_0x1c7662] || _0x27dbfc["getStateRaw"]?.()?.["nodes"]?.[_0x1c7662];
      if (!_0x2ffe5a) {
        return;
      }
      _0x27dbfc['updateNodeData']?.(_0x1c7662, buildRemoteVideoImportPatch(_0x375f72, _0x2ffe5a));
    } catch (_0x509868) {
      const _0x99fd4c = _toOneLineMessage(_0x509868);
      _0x306a78(_0x99fd4c || t("fileService.errors.remoteVideoImportFailed"));
      void logDiagnosticEvent({
        'type': "import.web_video_failed",
        'level': "warn",
        'source': "renderer",
        'message': _0x99fd4c || t("fileService.errors.remoteVideoImportFailed"),
        'error': _0x509868,
        'context': {
          'url': _0x2f79c9["url"],
          'pageUrl': _0x2f79c9['pageUrl'],
          'projectId': _0x44f664
        }
      });
    }
  });
  return !![];
}
export function createWebImageSourceNode({
  payload: _0x8bc86f,
  worldX: _0x44e57a,
  worldY: _0x768bc2,
  storeInstance = a1702_0x3ac6f7,
  projectId: _0x36949a,
  select = !![],
  importRemote = !![],
  importRemoteAsset: _0x2424ce
} = {}) {
  const _0x23d16b = normalizeWebImagePayload(_0x8bc86f);
  if (!_0x23d16b) {
    return null;
  }
  const _0x18ffec = buildWebImageDropNodePayload({
    'url': _0x23d16b['url'],
    'title': _0x23d16b["title"],
    'pageUrl': _0x23d16b["pageUrl"],
    'width': _0x23d16b["width"],
    'height': _0x23d16b["height"],
    'worldX': _0x44e57a,
    'worldY': _0x768bc2
  });
  if (!_0x18ffec) {
    return null;
  }
  storeInstance["addNode"]?.(_0x18ffec);
  if (select) {
    storeInstance["setSelectedNodes"]?.([_0x18ffec['id']]);
  }
  importRemote && scheduleWebImageRemoteImport(_0x18ffec['id'], _0x23d16b, {
    'storeInstance': storeInstance,
    'projectId': _0x36949a,
    'importRemoteAsset': _0x2424ce
  });
  return _0x18ffec;
}
export function createWebVideoSourceNode({
  payload: _0x47bb22,
  worldX: _0x494be4,
  worldY: _0x1a9ae6,
  storeInstance = a1702_0x3ac6f7,
  projectId: _0x23e499,
  select = !![],
  importRemote = !![],
  importRemoteAsset: _0x4d040e
} = {}) {
  const _0x14dfca = normalizeWebVideoPayload(_0x47bb22);
  if (!_0x14dfca || _0x14dfca["rightsConfirmed"] !== !![]) {
    return null;
  }
  const _0x3d3fdd = buildWebVideoSourceNodePayload({
    'url': _0x14dfca["url"],
    'title': _0x14dfca['title'],
    'pageUrl': _0x14dfca["pageUrl"],
    'width': _0x14dfca["width"],
    'height': _0x14dfca["height"],
    'duration': _0x14dfca["duration"],
    'worldX': _0x494be4,
    'worldY': _0x1a9ae6
  });
  if (!_0x3d3fdd) {
    return null;
  }
  storeInstance["addNode"]?.(_0x3d3fdd);
  if (select) {
    storeInstance["setSelectedNodes"]?.([_0x3d3fdd['id']]);
  }
  importRemote && scheduleWebVideoRemoteImport(_0x3d3fdd['id'], _0x14dfca, {
    'storeInstance': storeInstance,
    'projectId': _0x23e499,
    'importRemoteAsset': _0x4d040e
  });
  return _0x3d3fdd;
}
function createObjectUrlForFilePreview(_0x5740d1) {
  const _0x605c93 = String(_0x5740d1?.["type"] || '')['trim']();
  if (!_0x605c93["startsWith"]('image/') && !_0x605c93["startsWith"]("video/")) {
    return '';
  }
  const _0x167479 = globalThis['window']?.['URL'] || globalThis['URL'];
  if (typeof _0x167479?.["createObjectURL"] !== "function") {
    return '';
  }
  try {
    return _0x167479["createObjectURL"](_0x5740d1);
  } catch {
    return '';
  }
}
function revokeObjectUrl(_0xbe938f) {
  const _0xe21405 = String(_0xbe938f || '')["trim"]();
  if (!_0xe21405['startsWith']('blob:')) {
    return;
  }
  const _0x473597 = globalThis["window"]?.["URL"] || globalThis["URL"];
  if (typeof _0x473597?.['revokeObjectURL'] !== "function") {
    return;
  }
  try {
    _0x473597['revokeObjectURL'](_0xe21405);
  } catch {}
}
function scheduleRevokeObjectUrl(_0x214024) {
  const _0x44523f = String(_0x214024 || '')["trim"]();
  if (!_0x44523f['startsWith']("blob:")) {
    return;
  }
  const _0x4dc7b8 = globalThis["window"]?.["setTimeout"] || globalThis['setTimeout'];
  if (typeof _0x4dc7b8 === "function") {
    _0x4dc7b8(() => revokeObjectUrl(_0x44523f), 0x0);
    return;
  }
  revokeObjectUrl(_0x44523f);
}
function normalizeNaturalSize(_0x504698, _0x521517) {
  const _0x2379d1 = Math["round"](Number(_0x504698) || 0x0);
  const _0x1b378b = Math["round"](Number(_0x521517) || 0x0);
  if (_0x2379d1 <= 0x0 || _0x1b378b <= 0x0) {
    return null;
  }
  return {
    'width': _0x2379d1,
    'height': _0x1b378b
  };
}
function pickNaturalSize(_0x322719 = {}) {
  return normalizeNaturalSize(_0x322719?.["width"] ?? _0x322719?.["naturalWidth"], _0x322719?.["height"] ?? _0x322719?.["naturalHeight"]);
}
async function readImageFileNaturalSize(_0x237fa5) {
  if (!_0x237fa5) {
    return null;
  }
  const _0xeeaae3 = globalThis?.['createImageBitmap'];
  if (typeof _0xeeaae3 === "function") {
    try {
      const _0x289a51 = await _0xeeaae3(_0x237fa5);
      const _0x1d747c = normalizeNaturalSize(_0x289a51?.['width'], _0x289a51?.["height"]);
      if (typeof _0x289a51?.['close'] === 'function') {
        _0x289a51["close"]();
      }
      if (_0x1d747c) {
        return _0x1d747c;
      }
    } catch {}
  }
  const _0x30200d = globalThis["Image"] || globalThis["window"]?.["Image"];
  const _0x46748c = globalThis["window"]?.["URL"] || globalThis["URL"];
  if (!_0x30200d || typeof _0x46748c?.["createObjectURL"] !== 'function') {
    return null;
  }
  let _0x3d1168 = '';
  try {
    _0x3d1168 = _0x46748c['createObjectURL'](_0x237fa5);
  } catch {
    return null;
  }
  return new Promise(_0x1ca4e0 => {
    const _0x5e6ce2 = new _0x30200d();
    let _0x5a1f29 = ![];
    let _0x304af7 = null;
    const _0x27758d = _0x5b86ea => {
      if (_0x5a1f29) {
        return;
      }
      _0x5a1f29 = !![];
      if (_0x304af7) {
        clearTimeout(_0x304af7);
      }
      revokeObjectUrl(_0x3d1168);
      _0x1ca4e0(_0x5b86ea);
    };
    _0x304af7 = setTimeout(() => _0x27758d(null), 0x7d0);
    _0x5e6ce2["onload"] = () => _0x27758d(normalizeNaturalSize(_0x5e6ce2["naturalWidth"] || _0x5e6ce2["width"], _0x5e6ce2['naturalHeight'] || _0x5e6ce2["height"]));
    _0x5e6ce2["onerror"] = () => _0x27758d(null);
    _0x5e6ce2["src"] = _0x3d1168;
  });
}
async function readVideoFileNaturalSize(_0x28bc7e) {
  const _0x2081dc = globalThis["document"];
  const _0xb91584 = globalThis['window']?.["URL"] || globalThis["URL"];
  if (!_0x28bc7e || typeof _0x2081dc?.["createElement"] !== "function") {
    return null;
  }
  if (typeof _0xb91584?.["createObjectURL"] !== "function") {
    return null;
  }
  let _0x35d2dd = '';
  try {
    _0x35d2dd = _0xb91584["createObjectURL"](_0x28bc7e);
  } catch {
    return null;
  }
  return new Promise(_0x39d1a2 => {
    const _0x3a11b6 = _0x2081dc["createElement"]('video');
    let _0x4dedf7 = ![];
    let _0x3d8cef = null;
    const _0x4d623b = _0x34fa74 => {
      if (_0x4dedf7) {
        return;
      }
      _0x4dedf7 = !![];
      if (_0x3d8cef) {
        clearTimeout(_0x3d8cef);
      }
      _0x3a11b6['removeAttribute']('src');
      try {
        _0x3a11b6["load"]?.();
      } catch {}
      revokeObjectUrl(_0x35d2dd);
      _0x39d1a2(_0x34fa74);
    };
    _0x3d8cef = setTimeout(() => _0x4d623b(null), 0x9c4);
    _0x3a11b6['preload'] = "metadata";
    _0x3a11b6['muted'] = !![];
    _0x3a11b6['onloadedmetadata'] = () => {
      const _0x359297 = normalizeNaturalSize(_0x3a11b6["videoWidth"], _0x3a11b6["videoHeight"]);
      const _0x3fd64a = Number(_0x3a11b6['duration'] || 0x0);
      if (!_0x359297) {
        _0x4d623b(Number['isFinite'](_0x3fd64a) && _0x3fd64a > 0x0 ? {
          'duration': _0x3fd64a
        } : null);
        return;
      }
      _0x4d623b(Number["isFinite"](_0x3fd64a) && _0x3fd64a > 0x0 ? {
        ..._0x359297,
        'duration': _0x3fd64a
      } : _0x359297);
    };
    _0x3a11b6["onerror"] = () => _0x4d623b(null);
    _0x3a11b6["src"] = _0x35d2dd;
  });
}
export async function readFileNaturalSize(_0x2e671a, _0x4675c5 = '') {
  const _0x33f0f9 = String(_0x4675c5 || getNodeTypeByFile(_0x2e671a) || '')["trim"]();
  if (_0x33f0f9 === 'source-image') {
    return readImageFileNaturalSize(_0x2e671a);
  }
  if (_0x33f0f9 === "source-video") {
    return readVideoFileNaturalSize(_0x2e671a);
  }
  return null;
}
function getElectronImportLocalFile() {
  if (!desktopBridge["assetImport"]["canImportLocalFile"]()) {
    return null;
  }
  return _0x22f8b7 => desktopBridge['assetImport']['importLocalFile'](_0x22f8b7);
}
function getElectronLocalPreviewUrl() {
  if (!desktopBridge["mediaPreview"]['isAvailable']()) {
    return null;
  }
  return _0x3e1e43 => desktopBridge['mediaPreview']["getLocalPreviewUrl"](_0x3e1e43);
}
function getElectronFilePath(_0xdf86f5) {
  if (!desktopBridge['assetImport']["canResolveFilePath"]()) {
    return '';
  }
  const _0x2e8d8b = String(_0xdf86f5?.['path'] || '')["trim"]();
  if (_0x2e8d8b) {
    _profileDragImport("electron-file-path:direct", {
      'name': _0xdf86f5?.["name"] || '',
      'path': _0x2e8d8b
    });
    return _0x2e8d8b;
  }
  try {
    const _0x423384 = String(desktopBridge["assetImport"]["getPathForFile"](_0xdf86f5) || '')['trim']();
    _profileDragImport("electron-file-path:webutils", {
      'name': _0xdf86f5?.["name"] || '',
      'path': _0x423384
    });
    return _0x423384;
  } catch (_0x25500e) {
    _profileDragImport("electron-file-path:error", {
      'name': _0xdf86f5?.["name"] || '',
      'error': _toOneLineMessage(_0x25500e)
    });
    return '';
  }
}
function canUseElectronLocalImport(_0x16099c) {
  return !!(getElectronImportLocalFile() && getElectronFilePath(_0x16099c));
}
function isPreviewablePendingFile(_0x1deb15, _0x5e344b = '') {
  const _0x3d5f7f = String(_0x1deb15?.['type'] || '')["trim"]();
  return _0x5e344b === 'source-image' || _0x5e344b === 'source-video' || _0x3d5f7f["startsWith"]("image/") || _0x3d5f7f["startsWith"]('video/');
}
function isAllowedCapturePreviewUrl(_0x1b8775) {
  const _0xb5b849 = String(_0x1b8775 || '')["trim"]();
  return _0xb5b849["startsWith"]("blob:") || _0xb5b849["startsWith"]("data:image/") || _0xb5b849['startsWith']("aic-local-preview:");
}
function waitForNextPaint() {
  const _0x4f637f = globalThis["window"]?.["requestAnimationFrame"] || globalThis["requestAnimationFrame"];
  if (typeof _0x4f637f === "function") {
    return new Promise(_0x4a4e38 => {
      let _0x14dc9b = ![];
      let _0xd9d6e4 = null;
      const _0x28ecc6 = () => {
        if (_0x14dc9b) {
          return;
        }
        _0x14dc9b = !![];
        if (_0xd9d6e4) {
          clearTimeout(_0xd9d6e4);
        }
        _0x4a4e38();
      };
      _0xd9d6e4 = setTimeout(_0x28ecc6, 0x32);
      _0x4f637f(_0x28ecc6);
    });
  }
  return new Promise(_0x4e198e => setTimeout(_0x4e198e, 0x0));
}
async function createCapturePreviewUrlForFile(_0x30bda6, _0x5074b6 = '') {
  if (!isPreviewablePendingFile(_0x30bda6, _0x5074b6)) {
    return '';
  }
  const _0x15e6a8 = getElectronLocalPreviewUrl();
  const _0x27ac18 = getElectronImportLocalFile();
  if (_0x15e6a8 && _0x27ac18) {
    const _0x1fec11 = getElectronFilePath(_0x30bda6);
    if (_0x1fec11) {
      try {
        const _0x15844a = await _0x15e6a8({
          'path': _0x1fec11,
          'name': _0x30bda6?.["name"] || '',
          'type': _0x30bda6?.["type"] || ''
        });
        const _0x4dbb39 = typeof _0x15844a === "string" ? _0x15844a : String(_0x15844a?.["url"] || '')['trim']();
        if (isAllowedCapturePreviewUrl(_0x4dbb39)) {
          _profileDragImport("electron-preview-url:done", {
            'name': _0x30bda6?.['name'] || '',
            'url': _0x4dbb39
          });
          return _0x4dbb39;
        }
      } catch (_0xe6bacc) {
        _profileDragImport("electron-preview-url:error", {
          'name': _0x30bda6?.["name"] || '',
          'error': _toOneLineMessage(_0xe6bacc)
        });
      }
    }
  }
  return createObjectUrlForFilePreview(_0x30bda6);
}
async function importFileWithBestAvailableFlow(_0x145026, _0x47cf02, _0x565fb6 = '') {
  const _0x49d9d2 = getElectronImportLocalFile();
  if (_0x49d9d2) {
    const _0x51774a = getElectronFilePath(_0x145026);
    if (_0x51774a) {
      try {
        const _0x27c5f5 = await _0x49d9d2({
          'path': _0x51774a,
          'name': _0x145026?.["name"] || '',
          'type': _0x145026?.['type'] || '',
          'projectId': _0x47cf02
        });
        _profileDragImport('electron-import:done', {
          'name': _0x145026?.["name"] || '',
          'localPath': _0x27c5f5?.["localPath"] || '',
          'displayLocalPath': _0x27c5f5?.["displayLocalPath"] || '',
          'thumbLocalPath': _0x27c5f5?.['thumbLocalPath'] || ''
        });
        const _0x773ff0 = String(_0x27c5f5?.["localPath"] || '')["trim"]();
        const _0x4f008e = !!String(_0x27c5f5?.['displayLocalPath'] || _0x27c5f5?.['thumbLocalPath'] || _0x27c5f5?.["originalLocalPath"] || '')["trim"]();
        if (_0x27c5f5 && _0x565fb6 === "source-image" && _0x773ff0 && !_0x4f008e) {
          try {
            _profileDragImport("ensure-derivatives:start", {
              'localPath': _0x773ff0
            });
            const _0x1a0ebb = await ensureLocalImageDerivatives(_0x773ff0);
            _profileDragImport('ensure-derivatives:done', {
              'localPath': _0x1a0ebb?.['localPath'] || '',
              'displayLocalPath': _0x1a0ebb?.["displayLocalPath"] || '',
              'thumbLocalPath': _0x1a0ebb?.['thumbLocalPath'] || ''
            });
            return _0x1a0ebb;
          } catch (_0x2d1e32) {
            console['warn']('[fileService]\x20Electron\x20本地导入图片派生生成失败，使用原始文件:', _0x2d1e32);
            return _0x27c5f5;
          }
        }
        if (_0x27c5f5) {
          return _0x27c5f5;
        }
      } catch (_0x5eaec9) {
        console["warn"]('[fileService]\x20Electron\x20本地导入失败，回退上传流程:', _0x5eaec9);
      }
    }
  }
  return uploadFile(_0x145026, _0x47cf02);
}
export function buildPendingFileNodePayload(_0x27827c, _0x1ca5ec, _0x296be6, _0x28f931, _0x3e55bc = {}) {
  const _0x36f00a = getNodeTypeByFile(_0x27827c);
  if (!_0x36f00a || _0x36f00a === "source-text") {
    return null;
  }
  const _0x2250b0 = _0x28f931 || generateNodeId(_0x36f00a);
  const _0x583160 = getBaseName(_0x27827c?.["name"]);
  const _0x507b8d = pickNaturalSize(_0x3e55bc["mediaNaturalSize"] || {
    'width': _0x3e55bc['naturalWidth'],
    'height': _0x3e55bc['naturalHeight']
  });
  const _0x2dd77c = {
    'id': _0x2250b0,
    'type': _0x36f00a,
    'x': _0x1ca5ec,
    'y': _0x296be6,
    'fileName': _0x27827c?.["name"] || '',
    'name': _0x583160 || getDefaultNodeName(_0x36f00a),
    'isGenerating': !![],
    'jobStatus': 'running',
    'jobError': null,
    'generationStartTime': Date["now"](),
    'generationDuration': null
  };
  if (_0x36f00a === 'source-image' || _0x36f00a === "source-video") {
    return buildSourceMediaNodePayload({
      ..._0x2dd77c,
      'naturalWidth': _0x507b8d?.["width"],
      'naturalHeight': _0x507b8d?.["height"],
      'capturePreviewUrl': typeof _0x3e55bc['capturePreviewUrl'] === "string" ? _0x3e55bc['capturePreviewUrl'] : createObjectUrlForFilePreview(_0x27827c)
    });
  }
  if (_0x36f00a === "source-audio") {
    return buildSourceAudioNodePayload(_0x2dd77c);
  }
  return null;
}
function readTextFile(_0x54acd2) {
  return new Promise((_0x253ca0, _0x5956a5) => {
    const _0x6c5900 = new FileReader();
    _0x6c5900["onload"] = _0x367332 => _0x253ca0(_0x367332["target"]["result"]);
    _0x6c5900["onerror"] = _0x5956a5;
    _0x6c5900['readAsText'](_0x54acd2, "UTF-8");
  });
}
export async function resolveImageImportThumbnailData({
  suppliedThumbnail: _0xc1f98,
  canUseLocalImport = ![],
  generateThumbnailData: _0x54f004
} = {}) {
  if (_0xc1f98 != null) {
    try {
      const _0x502c80 = String((await _0xc1f98) || '')["trim"]();
      if (_0x502c80) {
        return _0x502c80;
      }
    } catch {}
  }
  if (canUseLocalImport || typeof _0x54f004 !== "function") {
    return null;
  }
  return _0x54f004();
}
export async function processFile(_0x42b340, _0xe35bfb, _0x30b47d, _0x4b688b, _0x12f7b2 = {}) {
  const _0x59ea27 = getNodeTypeByFile(_0x42b340);
  if (!_0x59ea27) {
    console["warn"]('[fileService]\x20暂不支持此类型文件:\x20' + _0x42b340['type']);
    showWarning(t('fileService.errors.unsupportedFileType', {
      'file': _0x42b340['name'] || _0x42b340["type"] || t("fileService.defaultNames.unknownFile")
    }));
    return null;
  }
  const {
    width: _0x264450,
    height: _0x4036e2
  } = getNodeDefaultSize(_0x59ea27);
  const _0x34a2b6 = _0x12f7b2?.["nodeId"] || generateNodeId(_0x59ea27);
  const _0x567c56 = getBaseName(_0x42b340['name']);
  const _0x184027 = _0x12f7b2?.["mediaNaturalSize"] || {
    'width': _0x12f7b2?.["naturalWidth"],
    'height': _0x12f7b2?.["naturalHeight"],
    'duration': _0x12f7b2?.["duration"]
  };
  const _0x26767d = pickNaturalSize(_0x184027);
  const _0x253d92 = Number(_0x184027?.["duration"] || _0x184027?.['videoDuration'] || 0x0);
  try {
    if (_0x59ea27 === "source-text") {
      const _0x3a7536 = await readTextFile(_0x42b340);
      return {
        'id': _0x34a2b6,
        'type': _0x59ea27,
        'x': _0xe35bfb,
        'y': _0x30b47d,
        'width': _0x264450,
        'height': _0x4036e2,
        'text': _0x3a7536,
        'content': _0x3a7536,
        'fileName': _0x42b340["name"],
        'name': _0x567c56 || t("fileService.defaultNames.text"),
        'isGenerating': ![],
        'jobStatus': null,
        'jobError': null
      };
    } else {
      const _0x3d170e = _0x12f7b2?.["thumbnailDataUrlPromise"] ?? _0x12f7b2?.['thumbnailDataUrl'];
      const _0x23974e = canUseElectronLocalImport(_0x42b340);
      const _0x54e027 = () => {
        const _0x5d8b9f = URL["createObjectURL"](_0x42b340);
        return generateThumbnail(_0x5d8b9f)["finally"](() => {
          URL['revokeObjectURL'](_0x5d8b9f);
        });
      };
      const _0x18eb68 = _0x59ea27 !== 'source-image' ? Promise['resolve'](null) : resolveImageImportThumbnailData({
        'suppliedThumbnail': _0x3d170e,
        'canUseLocalImport': _0x23974e,
        'generateThumbnailData': _0x54e027
      });
      const _0x150394 = await importFileWithBestAvailableFlow(_0x42b340, _0x4b688b, _0x59ea27);
      const _0x155e3b = await _0x18eb68;
      const _0x2459e2 = pickResultLocalPath(_0x150394);
      const _0x81d385 = localPathToUrl(_0x2459e2);
      if (_0x59ea27 === "source-image" && _0x155e3b) {
        try {
          await setThumbnail({
            'localPath': _0x2459e2,
            'src': _0x81d385,
            'imageUrl': _0x81d385
          }, _0x155e3b);
        } catch (_0x53af77) {
          console['warn']('[fileService]\x20写入缩略图缓存失败:', _0x53af77);
        }
      }
      const _0x5a39a5 = _0x59ea27 === 'source-image' ? buildImageNodeStorageFields(_0x150394) : {};
      const _0x5de4f1 = {
        'assetId': _0x150394['assetId'] || '',
        'assetRevision': normalizeAssetRevision(_0x150394["assetRevision"]),
        'assetUpdatedAt': _0x150394['assetUpdatedAt'] || _0x150394["updatedAt"] || '',
        'originalLocalPath': _0x150394["originalLocalPath"] || _0x150394["localPath"] || '',
        'displayLocalPath': _0x150394["displayLocalPath"] || '',
        'posterLocalPath': _0x150394["posterLocalPath"] || '',
        'waveformLocalPath': _0x150394["waveformLocalPath"] || '',
        'derivativeStatus': _0x150394["derivativeStatus"] || _0x150394["status"] || '',
        'mediaTaskId': _0x150394["mediaTaskId"] || '',
        'mediaTaskKind': _0x150394["mediaTaskKind"] || '',
        'mediaTaskStatus': _0x150394["mediaTaskStatus"] || '',
        'mediaTaskProgress': Number(_0x150394["mediaTaskProgress"] || 0x0) || 0x0,
        'mediaTaskError': _0x150394["mediaTaskError"] || '',
        'videoProxyStatus': _0x150394["videoProxyStatus"] || '',
        'videoProxyVersion': _0x150394["videoProxyVersion"] || '',
        'videoCodec': _0x150394["videoCodec"] || '',
        'videoDuration': Number(_0x150394["videoDuration"] || _0x253d92 || 0x0) || 0x0,
        'videoFps': Number(_0x150394["videoFps"] || 0x0) || 0x0
      };
      _0x59ea27 === 'source-video' && (_0x150394['posterLocalPath'] || _0x150394["posterUrl"] || _0x150394["thumbUrl"]) && (_0x5de4f1['thumbUrl'] = _0x150394["posterUrl"] || _0x150394["thumbUrl"] || '', _0x5de4f1["thumbLocalPath"] = _0x150394["posterLocalPath"] || _0x150394["thumbLocalPath"] || '');
      const _0x3b29bd = String(_0x150394["mediaTaskStatus"] || '')["trim"]();
      const _0x2569b9 = String(_0x150394["videoProxyStatus"] || '')['trim']();
      const _0x2e0eee = _0x3b29bd === "waiting" || _0x3b29bd === 'processing';
      const _0xebe2b6 = _0x59ea27 === "source-video" && _0x2e0eee && isAllowedCapturePreviewUrl(_0x12f7b2?.["capturePreviewUrl"]) ? String(_0x12f7b2["capturePreviewUrl"] || '')["trim"]() : '';
      const _0x182fa9 = Number(_0x150394['videoWidth'] || _0x150394['width'] || 0x0) || _0x26767d?.["width"] || 0x0;
      const _0x55dcea = Number(_0x150394["videoHeight"] || _0x150394['height'] || 0x0) || _0x26767d?.["height"] || 0x0;
      const _0x4980d4 = Number(_0x5a39a5["originalWidth"] || _0x150394['originalWidth'] || 0x0) || _0x26767d?.["width"] || 0x0;
      const _0x383686 = Number(_0x5a39a5["originalHeight"] || _0x150394['originalHeight'] || 0x0) || _0x26767d?.['height'] || 0x0;
      const _0x55b0d8 = _0x59ea27 === "source-video" && _0x2569b9 === 'processing' ? '' : localPathToUrl(_0x150394["displayLocalPath"]) || _0x81d385;
      const _0x1e9156 = _0x59ea27 === "source-image" ? {
        'originalWidth': _0x4980d4 || undefined,
        'originalHeight': _0x383686 || undefined,
        'imageWidth': _0x4980d4 || undefined,
        'imageHeight': _0x383686 || undefined
      } : {};
      const _0x1e026a = _0x59ea27 === 'source-video' ? {
        'videoWidth': _0x182fa9,
        'videoHeight': _0x55dcea
      } : {};
      const _0x371263 = {
        'id': _0x34a2b6,
        'type': _0x59ea27,
        'x': _0xe35bfb,
        'y': _0x30b47d,
        'width': _0x264450,
        'height': _0x4036e2,
        'src': _0x59ea27 === "source-video" ? _0x55b0d8 : _0x81d385,
        'localPath': _0x2459e2,
        ..._0x5de4f1,
        ..._0x5a39a5,
        'fileName': _0x42b340['name'],
        ...(_0x59ea27 === "source-video" ? {
          'fileSize': Number(_0x150394["size"] || _0x42b340?.["size"] || 0x0) || 0x0,
          'stagedUploadId': _0x150394["stagedUploadId"] || '',
          'canonicalImportPending': _0x150394["canonicalImportPending"] === !![],
          'canonicalImportStatus': _0x150394["canonicalImportStatus"] || '',
          'canonicalImportError': _0x150394["canonicalImportError"] || ''
        } : {}),
        'name': _0x567c56 || getDefaultNodeName(_0x59ea27),
        ..._0x1e9156,
        'naturalWidth': _0x59ea27 === "source-video" ? _0x182fa9 : _0x4980d4,
        'naturalHeight': _0x59ea27 === 'source-video' ? _0x55dcea : _0x383686,
        ..._0x1e026a,
        'isGenerating': _0x2e0eee,
        'jobStatus': _0x2e0eee ? 'running' : null,
        'jobError': null,
        'generationDuration': null,
        'capturePreviewUrl': _0xebe2b6
      };
      if (_0x59ea27 === 'source-image' || _0x59ea27 === "source-video") {
        return buildSourceMediaNodePayload(_0x371263);
      }
      return _0x371263;
    }
  } catch (_0x375c38) {
    console['error']("[fileService] 文件 " + _0x42b340["name"] + " 处理失败:", _0x375c38);
    throw _0x375c38;
  }
}
export async function handleFileDrop(_0x2e704e, _0x2b6fc6) {
  const _0x5a95f4 = _0x2e704e['dataTransfer']['files'];
  if (!_0x5a95f4 || _0x5a95f4["length"] === 0x0) {
    return ![];
  }
  _profileDragImport("drop:start", {
    'count': _0x5a95f4["length"],
    'projectId': _0x2b6fc6
  });
  if (_0x5a95f4["length"] === 0x1 && isProjectImportFileName(_0x5a95f4[0x0]["name"] || '')) {
    return ![];
  }
  _0x2e704e["preventDefault"]();
  _0x2e704e["stopPropagation"]();
  const {
    viewport: _0x2b6387
  } = a1702_0x3ac6f7["getState"]();
  const _0x12af01 = screenToWorld(_0x2e704e["clientX"], _0x2e704e["clientY"], _0x2b6387);
  let _0xe7933d = _0x12af01['x'];
  let _0x2e19d0 = _0x12af01['y'];
  let _0x3e43f7 = ![];
  let _0x2b3c17 = ![];
  for (let _0x4c456f = 0x0; _0x4c456f < _0x5a95f4["length"]; _0x4c456f++) {
    const _0x2f73d4 = _0x5a95f4[_0x4c456f];
    const _0x14e288 = getNodeTypeByFile(_0x2f73d4);
    _profileDragImport('file:start', {
      'name': _0x2f73d4?.["name"] || '',
      'type': _0x2f73d4?.["type"] || '',
      'size': _0x2f73d4?.["size"] || 0x0,
      'nodeType': _0x14e288,
      'canUseElectronLocalImport': canUseElectronLocalImport(_0x2f73d4)
    });
    if (_0x14e288 === "source-video" && Number(_0x2f73d4?.['size'] || 0x0) > CANVAS_VIDEO_IMPORT_MAX_BYTES) {
      _0x2b3c17 = !![];
      showError(t("fileService.errors.videoTooLarge", {
        'file': _0x2f73d4?.["name"] || t("fileService.defaultNames.video"),
        'maxMB': CANVAS_VIDEO_IMPORT_MAX_MB
      }));
      continue;
    }
    let _0x30dcad = '';
    let _0x3b827e = null;
    let _0x41ed68 = Promise["resolve"](null);
    if (_0x14e288 && _0x14e288 !== "source-text") {
      const _0x2c6a20 = createCapturePreviewUrlForFile(_0x2f73d4, _0x14e288);
      _0x41ed68 = readFileNaturalSize(_0x2f73d4, _0x14e288)["catch"](() => null);
      _0x14e288 === 'source-video' ? _0x30dcad = await _0x2c6a20 : [_0x30dcad, _0x3b827e] = await Promise["all"]([_0x2c6a20, _0x41ed68]);
    }
    _0x3b827e && _profileDragImport("file:natural-size", {
      'name': _0x2f73d4?.["name"] || '',
      'width': _0x3b827e["width"],
      'height': _0x3b827e['height']
    });
    const _0x561b94 = _0x14e288 && _0x14e288 !== 'source-text' ? buildPendingFileNodePayload(_0x2f73d4, _0xe7933d, _0x2e19d0, generateNodeId(_0x14e288, _0x4c456f), {
      'capturePreviewUrl': _0x30dcad,
      'mediaNaturalSize': _0x3b827e
    }) : null;
    const _0x2f58c7 = _0x561b94?.['capturePreviewUrl'] || '';
    _0x561b94 && (a1702_0x3ac6f7["addNode"](_0x561b94), a1702_0x3ac6f7["setSelectedNodes"]([_0x561b94['id']]), _profileDragImport("pending:add", {
      'id': _0x561b94['id'],
      'name': _0x2f73d4?.["name"] || '',
      'hasCapturePreviewUrl': !!_0x561b94["capturePreviewUrl"],
      'jobStatus': _0x561b94["jobStatus"] || ''
    }), _0x3e43f7 = !![], _0xe7933d += 0x1e, _0x2e19d0 += 0x1e, _0x561b94["type"] === "source-video" && (void _0x41ed68["then"](_0x4c86bd => {
      const _0x560951 = pickNaturalSize(_0x4c86bd);
      const _0xcd7211 = Number(_0x4c86bd?.['duration'] || _0x4c86bd?.["videoDuration"] || 0x0);
      const _0x294a37 = Number["isFinite"](_0xcd7211) && _0xcd7211 > 0x0;
      if (!_0x560951 && !_0x294a37) {
        return;
      }
      _0x3b827e = {
        ...(_0x560951 || {}),
        ...(_0x294a37 ? {
          'duration': _0xcd7211
        } : {})
      };
      const _0x12fb0b = a1702_0x3ac6f7['getState']()["nodes"]?.[_0x561b94['id']];
      if (!_0x12fb0b) {
        return;
      }
      const _0x8ac06d = {};
      _0x294a37 && Number(_0x12fb0b['videoDuration'] || 0x0) !== _0xcd7211 && (_0x8ac06d["videoDuration"] = _0xcd7211);
      const _0x346c6b = !!String(_0x12fb0b['localPath'] || _0x12fb0b['originalLocalPath'] || _0x12fb0b["displayLocalPath"] || '')["trim"]() && Number(_0x12fb0b["videoWidth"] || 0x0) > 0x0 && Number(_0x12fb0b['videoHeight'] || 0x0) > 0x0 && _0x12fb0b["needsAutoResize"] === ![];
      if (_0x560951 && !_0x346c6b) {
        const _0x40ad1a = getAutoMediaSizeByShortSide(_0x560951["width"], _0x560951["height"]);
        Object["assign"](_0x8ac06d, {
          'width': _0x40ad1a["width"],
          'height': _0x40ad1a['height'],
          'videoWidth': _0x560951['width'],
          'videoHeight': _0x560951['height'],
          'needsAutoResize': ![]
        });
      }
      Object["keys"](_0x8ac06d)["length"] > 0x0 && a1702_0x3ac6f7["updateNodeData"](_0x561b94['id'], _0x8ac06d);
      _profileDragImport("pending:video-natural-size", {
        'id': _0x561b94['id'],
        'width': _0x560951?.["width"] || 0x0,
        'height': _0x560951?.["height"] || 0x0,
        'duration': _0x294a37 ? _0xcd7211 : 0x0
      });
    }), await waitForNextPaint()));
    try {
      _profileDragImport("process:start", {
        'name': _0x2f73d4?.["name"] || '',
        'pendingId': _0x561b94?.['id'] || ''
      });
      const _0x166f69 = await processFile(_0x2f73d4, _0x561b94 ? _0x561b94['x'] : _0xe7933d, _0x561b94 ? _0x561b94['y'] : _0x2e19d0, _0x2b6fc6, _0x561b94 ? {
        'nodeId': _0x561b94['id'],
        'mediaNaturalSize': _0x3b827e,
        'capturePreviewUrl': _0x30dcad
      } : {
        'mediaNaturalSize': _0x3b827e,
        'capturePreviewUrl': _0x30dcad
      });
      _profileDragImport("process:done", {
        'name': _0x2f73d4?.["name"] || '',
        'pendingId': _0x561b94?.['id'] || '',
        'localPath': _0x166f69?.["localPath"] || '',
        'displayLocalPath': _0x166f69?.["displayLocalPath"] || '',
        'thumbLocalPath': _0x166f69?.["thumbLocalPath"] || '',
        'jobStatus': _0x166f69?.["jobStatus"] || ''
      });
      if (_0x166f69) {
        if (_0x561b94) {
          const _0x1a0ece = a1702_0x3ac6f7["getState"]()["nodes"]?.[_0x561b94['id']];
          if (_0x1a0ece) {
            const _0x37ef62 = pickNaturalSize({
              'width': _0x166f69["videoWidth"],
              'height': _0x166f69['videoHeight']
            });
            const _0x33af5c = pickNaturalSize({
              'width': _0x1a0ece["videoWidth"],
              'height': _0x1a0ece["videoHeight"]
            });
            const _0x45388a = _0x561b94['type'] === "source-video" && !_0x37ef62 && _0x33af5c && _0x1a0ece['needsAutoResize'] === ![] ? {
              ..._0x166f69,
              'width': _0x1a0ece["width"],
              'height': _0x1a0ece["height"],
              'videoWidth': _0x33af5c['width'],
              'videoHeight': _0x33af5c["height"],
              'needsAutoResize': ![]
            } : _0x166f69;
            const _0x53a38b = Number(_0x1a0ece["videoDuration"] || 0x0);
            const _0x452928 = Number(_0x45388a['videoDuration'] || 0x0);
            const _0xe63a47 = _0x561b94["type"] === 'source-video' && String(_0x2f58c7 || '')['startsWith']('blob:') && _0x45388a["capturePreviewUrl"] !== _0x2f58c7;
            const _0x158763 = _0x561b94["type"] === "source-video" ? {
              ..._0x45388a,
              ...(_0x452928 <= 0x0 && _0x53a38b > 0x0 ? {
                'videoDuration': _0x53a38b
              } : {}),
              ...(_0xe63a47 ? {
                'capturePreviewUrl': _0x2f58c7
              } : {})
            } : _0x45388a;
            a1702_0x3ac6f7["updateNodeData"](_0x561b94['id'], _0x158763);
            _profileDragImport("pending:update-final", {
              'id': _0x561b94['id'],
              'localPath': _0x166f69?.["localPath"] || '',
              'displayLocalPath': _0x166f69?.["displayLocalPath"] || '',
              'thumbLocalPath': _0x166f69?.["thumbLocalPath"] || ''
            });
            !_0xe63a47 && _0x166f69["capturePreviewUrl"] !== _0x2f58c7 && scheduleRevokeObjectUrl(_0x2f58c7);
          } else {
            revokeObjectUrl(_0x2f58c7);
          }
        } else {
          a1702_0x3ac6f7["addNode"](_0x166f69);
          a1702_0x3ac6f7["setSelectedNodes"]([_0x166f69['id']]);
          _0x3e43f7 = !![];
          _0xe7933d += 0x1e;
          _0x2e19d0 += 0x1e;
        }
      }
    } catch (_0xb0381a) {
      const _0x32eef5 = _toOneLineMessage(_0xb0381a);
      const _0x3c0de3 = _0x32eef5 || t("fileService.errors.importFailed");
      void logDiagnosticEvent({
        'type': "import.file_failed",
        'level': "error",
        'source': "renderer",
        'message': _0x3c0de3,
        'error': _0xb0381a,
        'context': {
          'fileName': _0x2f73d4?.["name"] || '',
          'fileType': _0x2f73d4?.["type"] || '',
          'fileSize': Number(_0x2f73d4?.['size'] || 0x0) || 0x0,
          'projectId': _0x2b6fc6 || ''
        }
      });
      _0x561b94 && a1702_0x3ac6f7['getState']()["nodes"]?.[_0x561b94['id']] && a1702_0x3ac6f7['updateNodeData'](_0x561b94['id'], {
        'isGenerating': ![],
        'jobStatus': "error",
        'jobError': _0x3c0de3,
        'generationDuration': Date['now']() - Number(_0x561b94['generationStartTime'] || Date["now"]()),
        'capturePreviewUrl': ''
      });
      revokeObjectUrl(_0x2f58c7);
      showError(t("fileService.errors.importFailedWithFile", {
        'file': _0x2f73d4?.["name"] || t("fileService.defaultNames.file"),
        'reason': _0x32eef5 ? t('fileService.errors.importFailedReason', {
          'reason': _0x32eef5
        }) : ''
      })["trim"]());
      console["error"]("[fileService] 处理文件失败:", _0xb0381a);
    }
  }
  return _0x3e43f7 || _0x2b3c17;
}
export async function handleWebImageUrlDrop(_0x58cd4d, _0x2c65f8 = {}) {
  const _0x5a8b8b = extractWebImageDropPayload(_0x58cd4d?.["dataTransfer"]);
  if (!_0x5a8b8b?.["url"]) {
    return ![];
  }
  _0x58cd4d?.["preventDefault"]?.();
  _0x58cd4d?.["stopPropagation"]?.();
  const _0x4c2d16 = _0x2c65f8["storeInstance"] || a1702_0x3ac6f7;
  const _0x511f1e = typeof _0x4c2d16["getState"] === "function" ? _0x4c2d16["getState"]() : {};
  const _0x4b1b1a = screenToWorld(_0x58cd4d?.["clientX"] || 0x0, _0x58cd4d?.["clientY"] || 0x0, _0x511f1e['viewport'] || {});
  const _0x5dc32c = createWebImageSourceNode({
    'payload': _0x5a8b8b,
    'worldX': _0x4b1b1a['x'],
    'worldY': _0x4b1b1a['y'],
    'storeInstance': _0x4c2d16,
    'projectId': _0x2c65f8["projectId"],
    'importRemote': _0x2c65f8['importRemote'] !== ![]
  });
  if (!_0x5dc32c) {
    return ![];
  }
  _profileDragImport("web-image:add", {
    'id': _0x5dc32c['id'],
    'url': _0x5a8b8b['url'],
    'pageUrl': _0x5a8b8b["pageUrl"] || ''
  });
  return !![];
}
export function downloadJson(_0x1bdfff, _0x4b7e54) {
  return saveTextDownload({
    'filename': _0x4b7e54,
    'content': JSON["stringify"](_0x1bdfff, null, 0x2),
    'mimeType': 'application/json',
    'filterName': "JSON"
  });
}
export function readJsonFile(_0x557cdc) {
  return new Promise((_0x2e2550, _0x1d4d17) => {
    const _0x5d1a81 = new FileReader();
    _0x5d1a81["onload"] = _0x2d1815 => {
      try {
        const _0x581e6f = JSON["parse"](_0x2d1815["target"]['result']);
        _0x2e2550(_0x581e6f);
      } catch (_0x4fa1bb) {
        _0x1d4d17(new Error(t("fileService.errors.jsonParseFailed")));
      }
    };
    _0x5d1a81["onerror"] = () => _0x1d4d17(new Error(t("fileService.errors.fileReadFailed")));
    _0x5d1a81["readAsText"](_0x557cdc);
  });
}