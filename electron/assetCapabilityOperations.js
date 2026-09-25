import { createHash, randomBytes } from 'node:crypto';
import { createReadStream, existsSync, mkdirSync, realpathSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import a185_0x3ec8a5 from 'node:path';
import { createAssetDerivativeScheduler } from './assetDerivativeScheduler.js';
import { createAssetIndexCoordinator } from './assetIndexCoordinator.js';
import { readAssetIndexFile, writeAssetIndexFile } from './assetIndexFileStore.js';
import { getExistingAssetOriginalFilename, materializeAssetOriginal } from './assetOriginalStore.js';
import { createKeyedOperationQueue } from './keyedOperationQueue.js';
import { VIDEO_PLAYBACK_PROXY_VERSION, getVideoPlaybackProxyFilename, isCurrentVideoPlaybackProxyLocalPath, needsBrowserVideoProxy } from './videoPlaybackProxy.js';
const ASSET_MEDIA_TASK_FIELDS = Object['freeze'](["mediaTaskId", "mediaTaskKind", "mediaTaskStatus", "mediaTaskProgress", 'mediaTaskError']);
function requireFunction(_0x575d59, _0x16bc0c) {
  if (typeof _0x575d59 !== "function") {
    throw new TypeError(_0x16bc0c + " must be a function");
  }
  return _0x575d59;
}
function sanitizeUploadFilename(_0x401cd1) {
  const _0x232be7 = a185_0x3ec8a5["basename"](String(_0x401cd1 || 'upload'));
  return _0x232be7["replace"](/[\\/:*?"<>|]/g, '_')["trim"]() || "upload";
}
function getSafeOriginalExtension(_0x5bf820, _0x11deae = '') {
  const _0x2aa8f3 = a185_0x3ec8a5['extname'](sanitizeUploadFilename(_0x5bf820))['toLowerCase']();
  if (_0x2aa8f3 && _0x2aa8f3["length"] <= 0xc) {
    return _0x2aa8f3;
  }
  const _0x155913 = String(_0x11deae || '')["split"](';')[0x0]["trim"]()["toLowerCase"]();
  const _0x12b9d0 = {
    'image/png': '.png',
    'image/jpeg': ".jpg",
    'image/webp': '.webp',
    'image/gif': ".gif",
    'image/bmp': '.bmp',
    'image/avif': '.avif',
    'video/mp4': ".mp4",
    'video/webm': ".webm",
    'video/quicktime': '.mov',
    'audio/mpeg': ".mp3",
    'audio/mp3': ".mp3",
    'audio/wav': '.wav',
    'audio/x-wav': '.wav',
    'audio/mp4': ".m4a",
    'audio/x-m4a': '.m4a',
    'audio/aac': ".aac",
    'audio/ogg': '.ogg',
    'audio/flac': ".flac",
    'audio/webm': ".webm"
  };
  return _0x12b9d0[_0x155913] || '.bin';
}
function classifyAssetKind(_0x3df497 = '', _0x933de9 = '') {
  const _0x180118 = String(_0x933de9 || '')['split'](';')[0x0]["trim"]()["toLowerCase"]();
  if (_0x180118['startsWith']("image/")) {
    return "image";
  }
  if (_0x180118["startsWith"]('video/')) {
    return 'video';
  }
  if (_0x180118['startsWith']('audio/')) {
    return "audio";
  }
  const _0xc641e7 = a185_0x3ec8a5["extname"](String(_0x3df497 || ''))['toLowerCase']();
  if (/\.(?:png|jpe?g|webp|gif|bmp|avif|svg)$/i['test'](_0xc641e7)) {
    return "image";
  }
  if (/\.(?:mp4|webm|mov|m4v|avi|mkv)$/i["test"](_0xc641e7)) {
    return "video";
  }
  if (/\.(?:mp3|wav|m4a|aac|ogg|flac|opus|webm)$/i["test"](_0xc641e7)) {
    return 'audio';
  }
  return "file";
}
function hashBuffer(_0x20c5c3) {
  return createHash("sha256")["update"](_0x20c5c3)["digest"]('hex');
}
async function hashFileSha256(_0x28eaec) {
  return await new Promise((_0x18ff9e, _0x20349e) => {
    const _0x27a35b = createHash('sha256');
    const _0x40a472 = createReadStream(_0x28eaec);
    _0x40a472['on']("data", _0x2223b7 => _0x27a35b["update"](_0x2223b7));
    _0x40a472["once"]("error", _0x20349e);
    _0x40a472["once"]('end', () => _0x18ff9e(_0x27a35b["digest"]("hex")));
  });
}
function bufferFromImportPayload(_0x5a4001 = {}) {
  const _0x1bf6c5 = _0x5a4001?.["bytes"];
  if (!_0x1bf6c5) {
    return null;
  }
  if (Buffer['isBuffer'](_0x1bf6c5)) {
    return _0x1bf6c5;
  }
  if (_0x1bf6c5 instanceof ArrayBuffer) {
    return Buffer["from"](_0x1bf6c5);
  }
  if (ArrayBuffer["isView"](_0x1bf6c5)) {
    return Buffer["from"](_0x1bf6c5["buffer"], _0x1bf6c5['byteOffset'], _0x1bf6c5['byteLength']);
  }
  if (Array["isArray"](_0x1bf6c5)) {
    return Buffer["from"](_0x1bf6c5);
  }
  return null;
}
function resizeImageToMaxEdge(_0xa51cfe, _0x198a4b) {
  const _0x20c515 = _0xa51cfe["getSize"]();
  const _0x32566b = Number(_0x20c515["width"]) || 0x0;
  const _0x1a668d = Number(_0x20c515["height"]) || 0x0;
  if (_0x32566b <= 0x0 || _0x1a668d <= 0x0) {
    return null;
  }
  const _0x182aea = Math["max"](_0x32566b, _0x1a668d);
  if (_0x182aea <= _0x198a4b) {
    return _0xa51cfe;
  }
  const _0x37bd74 = _0x198a4b / _0x182aea;
  return _0xa51cfe["resize"]({
    'width': Math["max"](0x1, Math["round"](_0x32566b * _0x37bd74)),
    'height': Math['max'](0x1, Math['round'](_0x1a668d * _0x37bd74)),
    'quality': 'best'
  });
}
function writeImageDerivativeAtomically(_0x3aca7f, _0x4c7e60) {
  const _0x15e206 = _0x3aca7f + '.' + randomBytes(0x8)["toString"]("hex") + ".tmp";
  try {
    writeFileSync(_0x15e206, _0x4c7e60);
    renameSync(_0x15e206, _0x3aca7f);
  } finally {
    rmSync(_0x15e206, {
      'force': !![]
    });
  }
}
function preserveLatestAssetFields(_0x1a0ff9, _0x2dfb50, _0x21b6da) {
  for (const _0x3c9570 of _0x21b6da) {
    Object["prototype"]["hasOwnProperty"]["call"](_0x2dfb50, _0x3c9570) && (_0x1a0ff9[_0x3c9570] = _0x2dfb50[_0x3c9570]);
  }
}
export function buildAssetCapabilityResponse(_0x169d3a, {
  reused = ![],
  derivativeStatus = ''
} = {}) {
  const _0x337c1a = _0x169d3a["kind"] === "image" || _0x169d3a["kind"] === "video" ? _0x169d3a["displayLocalPath"] || _0x169d3a["originalLocalPath"] : _0x169d3a['originalLocalPath'];
  return {
    'success': !![],
    'assetId': _0x169d3a["assetId"],
    'assetRevision': Math['max'](0x0, Math['trunc'](Number(_0x169d3a["assetRevision"] || 0x0)) || 0x0),
    'assetUpdatedAt': _0x169d3a['updatedAt'] || '',
    'reused': !!reused,
    'kind': _0x169d3a['kind'],
    'url': _0x337c1a ? '/' + _0x337c1a : '',
    'localPath': _0x169d3a["originalLocalPath"] || '',
    'originalLocalPath': _0x169d3a["originalLocalPath"] || '',
    'displayLocalPath': _0x169d3a["displayLocalPath"] || '',
    'thumbLocalPath': _0x169d3a["thumbLocalPath"] || _0x169d3a["posterLocalPath"] || '',
    'posterLocalPath': _0x169d3a["posterLocalPath"] || '',
    'waveformLocalPath': _0x169d3a["waveformLocalPath"] || '',
    'filename': _0x169d3a["originalName"] || _0x169d3a['filename'] || '',
    'storedFilename': a185_0x3ec8a5["basename"](_0x169d3a["originalLocalPath"] || ''),
    'size': Number(_0x169d3a['size'] || 0x0),
    'type': _0x169d3a["mimeType"] || '',
    'derivativeStatus': derivativeStatus || _0x169d3a["status"] || '',
    'status': _0x169d3a["status"] || '',
    'mediaTaskId': _0x169d3a["mediaTaskId"] || '',
    'mediaTaskKind': _0x169d3a["mediaTaskKind"] || '',
    'mediaTaskStatus': _0x169d3a["mediaTaskStatus"] || '',
    'mediaTaskProgress': Number(_0x169d3a["mediaTaskProgress"] || 0x0) || 0x0,
    'mediaTaskError': _0x169d3a['mediaTaskError'] || '',
    'videoProxyStatus': _0x169d3a["videoProxyStatus"] || '',
    'videoProxyVersion': _0x169d3a["videoProxyVersion"] || '',
    'videoCodec': _0x169d3a["videoCodec"] || '',
    'videoWidth': Number(_0x169d3a["videoWidth"] || _0x169d3a["width"] || 0x0) || 0x0,
    'videoHeight': Number(_0x169d3a['videoHeight'] || _0x169d3a["height"] || 0x0) || 0x0,
    'videoDuration': Number(_0x169d3a["videoDuration"] || 0x0) || 0x0,
    'videoFps': Number(_0x169d3a["videoFps"] || 0x0) || 0x0,
    'width': Number(_0x169d3a['width'] || _0x169d3a["videoWidth"] || 0x0) || 0x0,
    'height': Number(_0x169d3a['height'] || _0x169d3a['videoHeight'] || 0x0) || 0x0,
    'originalUrl': _0x169d3a["originalLocalPath"] ? '/' + _0x169d3a['originalLocalPath'] : '',
    'displayUrl': _0x169d3a["displayLocalPath"] ? '/' + _0x169d3a["displayLocalPath"] : '',
    'thumbUrl': _0x169d3a['thumbLocalPath'] ? '/' + _0x169d3a["thumbLocalPath"] : _0x169d3a["posterLocalPath"] ? '/' + _0x169d3a["posterLocalPath"] : '',
    'posterUrl': _0x169d3a["posterLocalPath"] ? '/' + _0x169d3a["posterLocalPath"] : '',
    'waveformUrl': _0x169d3a['waveformLocalPath'] ? '/' + _0x169d3a["waveformLocalPath"] : ''
  };
}
export function createAssetCapabilityOperations({
  getAssetsDir: _0x114bc6,
  getMediaTaskQueue: _0x1e4d95,
  createImageFromPath: _0x60ab78,
  createImageDerivatives = null,
  probeVideoPlaybackInfo: _0x56091e,
  publishAssetUpdate = () => {},
  shouldBufferAssetUpdates = () => ![],
  isImportLoggingEnabled = () => ![],
  now = Date["now"],
  createRandomHex = _0x1fa0a1 => randomBytes(_0x1fa0a1)['toString']("hex"),
  logInfo = (..._0x47621c) => console["log"](..._0x47621c),
  logWarning = (..._0xfbcaf8) => console["warn"](..._0xfbcaf8)
} = {}) {
  const _0x44959a = requireFunction(_0x114bc6, "getAssetsDir");
  const _0x472819 = requireFunction(_0x1e4d95, 'getMediaTaskQueue');
  const _0x5f3366 = requireFunction(_0x60ab78, "createImageFromPath");
  const _0x5ce842 = requireFunction(_0x56091e, 'probeVideoPlaybackInfo');
  const _0x5d735f = requireFunction(now, "now");
  const _0x56fda0 = createKeyedOperationQueue();
  const _0x54a665 = [];
  function _0x1a5c6b(..._0xce448a) {
    return ["data", 'assets', ..._0xce448a]["filter"](Boolean)["join"]('/')["replace"](/\\/g, '/');
  }
  function _0x3937d3() {
    return a185_0x3ec8a5["join"](_0x44959a(), "original");
  }
  function _0x229077() {
    return a185_0x3ec8a5['join'](_0x44959a(), "assets.index.json");
  }
  function _0x13ab71() {
    return readAssetIndexFile(_0x229077());
  }
  function _0x32988e(_0x3eab35) {
    writeAssetIndexFile(_0x229077(), _0x3eab35);
  }
  const _0x1c8336 = createAssetIndexCoordinator({
    'readIndex': _0x13ab71,
    'writeIndex': _0x32988e,
    'now': () => new Date(_0x5d735f())["toISOString"]()
  });
  function _0x464516(_0x50e7f5) {
    const _0x148a6c = a185_0x3ec8a5['join'](_0x44959a(), "derived", "video");
    const _0x596e5f = getVideoPlaybackProxyFilename(_0x50e7f5);
    return {
      'proxyAbs': a185_0x3ec8a5["join"](_0x148a6c, _0x596e5f)
    };
  }
  function _0x28d00f(_0x582b78 = {}) {
    if (_0x582b78['videoProxyVersion'] !== VIDEO_PLAYBACK_PROXY_VERSION) {
      return ![];
    }
    if (!isCurrentVideoPlaybackProxyLocalPath(_0x582b78["displayLocalPath"], _0x582b78["assetId"])) {
      return ![];
    }
    const {
      proxyAbs: _0x1639b4
    } = _0x464516(_0x582b78["assetId"]);
    try {
      return existsSync(_0x1639b4) && statSync(_0x1639b4)["size"] > 0x0;
    } catch {
      return ![];
    }
  }
  function _0x42d7d9(_0x4b05d0 = {}) {
    if (_0x4b05d0["kind"] !== "video") {
      return ![];
    }
    if (!_0x4b05d0["posterLocalPath"]) {
      return ![];
    }
    if (_0x4b05d0["videoProxyStatus"] === "not_required") {
      return !![];
    }
    return _0x28d00f(_0x4b05d0);
  }
  function _0xa15584(_0x53f171, _0x2b7665) {
    const _0x9d5d8c = _0x53f171 || {};
    const _0x4f550f = {
      ..._0x9d5d8c,
      ..._0x2b7665,
      'createdAt': _0x9d5d8c["createdAt"] || _0x2b7665["createdAt"]
    };
    _0x9d5d8c['mediaTaskId'] && preserveLatestAssetFields(_0x4f550f, _0x9d5d8c, ASSET_MEDIA_TASK_FIELDS);
    if (_0x4f550f["kind"] === "video") {
      if (_0x9d5d8c["posterLocalPath"]) {
        _0x4f550f["posterLocalPath"] = _0x9d5d8c["posterLocalPath"];
      }
      if (_0x9d5d8c["thumbLocalPath"]) {
        _0x4f550f["thumbLocalPath"] = _0x9d5d8c["thumbLocalPath"];
      }
      _0x28d00f(_0x9d5d8c) && preserveLatestAssetFields(_0x4f550f, _0x9d5d8c, ['displayLocalPath', "videoProxyStatus", "videoProxyVersion"]);
      _0x4f550f["status"] = _0x42d7d9(_0x4f550f) ? "ready" : "processing";
      if (_0x4f550f["status"] === "ready") {
        _0x4f550f['error'] = '';
      }
    } else {
      if (_0x4f550f["kind"] === "audio") {
        _0x9d5d8c["waveformLocalPath"] && (_0x4f550f["waveformLocalPath"] = _0x9d5d8c["waveformLocalPath"]);
        _0x4f550f["status"] = _0x4f550f['waveformLocalPath'] ? 'ready' : "processing";
        if (_0x4f550f['status'] === "ready") {
          _0x4f550f['error'] = '';
        }
      }
    }
    return _0x4f550f;
  }
  function _0x4106ee(_0x1f768f, _0x1399ff, _0x200b80 = {}) {
    return _0x1c8336["patch"](_0x1f768f, _0x1399ff, _0x200b80);
  }
  function _0x471da6(_0x19ffc3) {
    if (!_0x19ffc3) {
      return;
    }
    const _0xfddbf6 = buildAssetCapabilityResponse(_0x19ffc3);
    if (shouldBufferAssetUpdates()) {
      _0x54a665['push'](_0xfddbf6);
      while (_0x54a665['length'] > 0xc8) {
        _0x54a665['shift']();
      }
    }
    publishAssetUpdate(_0xfddbf6);
  }
  function _0x34ea75() {
    return _0x54a665["splice"](0x0, _0x54a665["length"]);
  }
  const _0x5eae5a = createAssetDerivativeScheduler({
    'readAssetRecord': _0x305871 => _0x13ab71()["assets"][_0x305871] || null,
    'getQueue': _0x472819,
    'updateAssetRecord': _0x4106ee,
    'sendAssetUpdated': _0x471da6,
    'createTaskId': _0x20f2a6 => "asset-" + _0x20f2a6 + '-' + _0x5d735f() + '-' + createRandomHex(0x6)
  });
  async function _0x22d2fa(_0x19c1a6, _0x15446b, _0x37c530 = {}) {
    const _0x4aac8d = a185_0x3ec8a5["join"](_0x44959a(), "derived", "image");
    const _0x967db9 = a185_0x3ec8a5['join'](_0x4aac8d, _0x19c1a6 + ".display.png");
    const _0x107224 = a185_0x3ec8a5["join"](_0x4aac8d, _0x19c1a6 + ".thumb.png");
    const _0x565634 = {
      'displayLocalPath': _0x1a5c6b("derived", "image", _0x19c1a6 + '.display.png'),
      'thumbLocalPath': _0x1a5c6b("derived", "image", _0x19c1a6 + ".thumb.png"),
      'imageDerivativeVersion': createImageDerivatives ? 0x2 : 0x1
    };
    if (_0x37c530['imageDerivativeVersion'] === _0x565634["imageDerivativeVersion"] && _0x37c530['originalWidth'] > 0x0 && _0x37c530["originalHeight"] > 0x0 && [_0x967db9, _0x107224]["every"](_0x49df9a => existsSync(_0x49df9a) && statSync(_0x49df9a)["size"] > 0x0)) {
      return {
        ..._0x565634,
        'originalWidth': _0x37c530["originalWidth"],
        'originalHeight': _0x37c530["originalHeight"]
      };
    }
    if (createImageDerivatives) {
      const _0x21c092 = await createImageDerivatives(_0x15446b);
      if (!(_0x21c092['originalWidth'] > 0x0 && _0x21c092["originalHeight"] > 0x0 && _0x21c092["displayPng"]?.['length'] && _0x21c092["thumbPng"]?.["length"])) {
        throw new Error("Incomplete image derivatives");
      }
      mkdirSync(_0x4aac8d, {
        'recursive': !![]
      });
      writeImageDerivativeAtomically(_0x967db9, _0x21c092["displayPng"]);
      writeImageDerivativeAtomically(_0x107224, _0x21c092["thumbPng"]);
      return {
        ..._0x565634,
        'originalWidth': _0x21c092["originalWidth"],
        'originalHeight': _0x21c092["originalHeight"]
      };
    }
    const _0x154ce9 = _0x5f3366(_0x15446b);
    const _0x18bd46 = _0x154ce9["getSize"]();
    const _0x315c90 = Number(_0x18bd46["width"]) || 0x0;
    const _0x1a3297 = Number(_0x18bd46["height"]) || 0x0;
    if (_0x154ce9["isEmpty"]() || _0x315c90 <= 0x0 || _0x1a3297 <= 0x0) {
      return {};
    }
    mkdirSync(_0x4aac8d, {
      'recursive': !![]
    });
    const _0x18465f = resizeImageToMaxEdge(_0x154ce9, 0x500);
    const _0x20fe5a = resizeImageToMaxEdge(_0x154ce9, 0x140);
    if (!_0x18465f || !_0x20fe5a) {
      return {};
    }
    writeImageDerivativeAtomically(_0x967db9, _0x18465f["toPNG"]());
    writeImageDerivativeAtomically(_0x107224, _0x20fe5a['toPNG']());
    return {
      ..._0x565634,
      'displayLocalPath': _0x1a5c6b("derived", "image", _0x19c1a6 + '.display.png'),
      'thumbLocalPath': _0x1a5c6b('derived', "image", _0x19c1a6 + ".thumb.png"),
      'originalWidth': _0x315c90,
      'originalHeight': _0x1a3297
    };
  }
  async function _0x51410a(_0x267fda = {}) {
    const _0x5b2346 = _0x5d735f();
    const _0x46364b = String(_0x267fda?.["path"] || '')["trim"]();
    const _0xe3fe75 = bufferFromImportPayload(_0x267fda);
    if (!_0x46364b && !_0xe3fe75) {
      throw new Error('缺少文件路径或文件内容');
    }
    const _0x365968 = _0x46364b ? realpathSync(_0x46364b) : '';
    let _0x826d0c = null;
    if (_0x365968) {
      if (!a185_0x3ec8a5['isAbsolute'](_0x365968)) {
        throw new Error("文件路径必须是绝对路径");
      }
      _0x826d0c = statSync(_0x365968);
      if (!_0x826d0c['isFile']()) {
        throw new Error("只支持导入文件");
      }
    }
    const _0x463dc3 = sanitizeUploadFilename(_0x267fda?.["name"] || (_0x365968 ? a185_0x3ec8a5["basename"](_0x365968) : "asset"));
    const _0xe68d0a = String(_0x267fda?.["type"] || '')["trim"]();
    const _0x13c461 = _0xe3fe75 ? hashBuffer(_0xe3fe75) : await hashFileSha256(_0x365968);
    return _0x56fda0['run'](_0x13c461, async () => {
      const _0x11ac13 = classifyAssetKind(_0x463dc3, _0xe68d0a);
      const _0x382ae1 = getSafeOriginalExtension(_0x463dc3, _0xe68d0a);
      const _0x4ba284 = _0x13ab71();
      const _0x4be5ea = _0x4ba284["assets"][_0x13c461] || {};
      const _0x178ae1 = _0x3937d3();
      mkdirSync(_0x178ae1, {
        'recursive': !![]
      });
      const _0x1e1adf = getExistingAssetOriginalFilename(_0x13c461, _0x4be5ea) || '' + _0x13c461 + _0x382ae1;
      const _0x31f8b9 = a185_0x3ec8a5["join"](_0x178ae1, _0x1e1adf);
      const _0x1552e3 = _0x1a5c6b("original", _0x1e1adf);
      const _0x549840 = _0xe3fe75 ? _0xe3fe75["length"] : Number(_0x826d0c?.['size'] || 0x0);
      const _0x8e1767 = await materializeAssetOriginal({
        'targetPath': _0x31f8b9,
        'expectedSha256': _0x13c461,
        'expectedSize': _0x549840,
        ...(_0xe3fe75 ? {
          'sourceBuffer': _0xe3fe75
        } : {
          'sourcePath': _0x365968
        })
      });
      const _0x52537d = _0x8e1767['reused'];
      const _0xcc94c9 = new Date(_0x5d735f())["toISOString"]();
      let _0x54ee04 = {
        ..._0x4be5ea,
        'assetId': _0x13c461,
        'kind': _0x11ac13,
        'originalName': _0x463dc3,
        'filename': _0x463dc3,
        'mimeType': _0xe68d0a,
        'size': _0x549840,
        'sha256': _0x13c461,
        'originalLocalPath': _0x1552e3,
        'createdAt': _0x4be5ea["createdAt"] || _0xcc94c9,
        'updatedAt': _0xcc94c9,
        'status': _0x4be5ea["status"] || (_0x11ac13 === "image" || _0x11ac13 === "file" ? "ready" : 'processing'),
        'error': _0x4be5ea["error"] || ''
      };
      if (_0x11ac13 === "image") {
        try {
          _0x54ee04 = {
            ..._0x54ee04,
            ...(await _0x22d2fa(_0x13c461, _0x31f8b9, _0x54ee04)),
            'status': 'ready',
            'error': ''
          };
        } catch (_0x374826) {
          _0x54ee04 = {
            ..._0x54ee04,
            'status': "partial",
            'imageDerivativeVersion': 0x0,
            'error': String(_0x374826?.["message"] || _0x374826)
          };
          logWarning("[electron] image asset derivative failed:", _0x374826);
        }
      } else {
        if (_0x11ac13 === "video") {
          try {
            const _0x2041ca = await _0x5ce842(_0x31f8b9);
            const _0x5b8df9 = needsBrowserVideoProxy(_0x2041ca);
            const _0x953a2e = _0x54ee04['videoProxyVersion'] === VIDEO_PLAYBACK_PROXY_VERSION && isCurrentVideoPlaybackProxyLocalPath(_0x54ee04['displayLocalPath'], _0x13c461);
            _0x54ee04 = {
              ..._0x54ee04,
              'displayLocalPath': _0x5b8df9 ? _0x54ee04['displayLocalPath'] || '' : '',
              'videoCodec': _0x2041ca["codecName"],
              'videoWidth': _0x2041ca["width"],
              'videoHeight': _0x2041ca["height"],
              'width': _0x2041ca["width"],
              'height': _0x2041ca["height"],
              'videoDuration': _0x2041ca["duration"],
              'videoFps': _0x2041ca["fps"],
              'videoProxyStatus': _0x5b8df9 ? _0x953a2e ? "generated" : "processing" : 'not_required',
              'videoProxyVersion': _0x5b8df9 && _0x953a2e ? VIDEO_PLAYBACK_PROXY_VERSION : ''
            };
          } catch (_0x3727a2) {
            _0x54ee04 = {
              ..._0x54ee04,
              'videoProxyStatus': _0x54ee04["videoProxyVersion"] === VIDEO_PLAYBACK_PROXY_VERSION && isCurrentVideoPlaybackProxyLocalPath(_0x54ee04["displayLocalPath"], _0x13c461) ? 'generated' : "processing",
              'error': _0x54ee04['error'] || String(_0x3727a2?.["message"] || _0x3727a2)
            };
            logWarning("[electron] video asset metadata probe failed:", _0x3727a2);
          }
          _0x54ee04["status"] = _0x42d7d9(_0x54ee04) ? "ready" : "processing";
        } else {
          _0x11ac13 === "audio" && (_0x54ee04['status'] = _0x54ee04['waveformLocalPath'] ? 'ready' : 'processing');
        }
      }
      _0x54ee04 = _0x1c8336["commit"](_0x13c461, _0x115500 => _0xa15584(_0x115500, _0x54ee04));
      const _0x1f2aed = _0x5eae5a(_0x54ee04);
      _0x1f2aed && (_0x54ee04 = _0x13ab71()["assets"][_0x13c461] || {
        ..._0x54ee04,
        'status': "processing",
        'mediaTaskId': _0x1f2aed["taskId"],
        'mediaTaskKind': _0x1f2aed["kind"],
        'mediaTaskStatus': _0x1f2aed["status"],
        'mediaTaskProgress': _0x1f2aed["progress"],
        'mediaTaskError': ''
      });
      isImportLoggingEnabled() && logInfo('[asset-import]\x20done', {
        't': _0x5d735f(),
        'elapsedMs': _0x5d735f() - _0x5b2346,
        'assetId': _0x13c461,
        'kind': _0x11ac13,
        'reused': _0x52537d,
        'originalLocalPath': _0x1552e3,
        'status': _0x54ee04["status"]
      });
      return buildAssetCapabilityResponse(_0x54ee04, {
        'reused': _0x52537d,
        'derivativeStatus': _0x54ee04["status"]
      });
    });
  }
  return {
    'buildAssetResponse': buildAssetCapabilityResponse,
    'consumeAssetUpdateEvents': _0x34ea75,
    'importAssetToLibrary': _0x51410a,
    'isVideoAssetReady': _0x42d7d9,
    'readAssetIndex': _0x13ab71,
    'sendAssetUpdated': _0x471da6,
    'toAssetLocalPath': _0x1a5c6b,
    'updateAssetRecord': _0x4106ee
  };
}