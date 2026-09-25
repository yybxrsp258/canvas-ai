import { localPathToUrl, normalizeLocalPath, pickResultLocalPath } from '../utils/localMediaPath.js';
import { resolveNormalizedMediaCrop } from '../core/math.js';
export const DEFAULT_VIDEO_FRAME_CAPTURE_FPS = 0x18;
export function getVideoFrameSource(_0x415220) {
  return String(_0x415220?.['currentSrc'] || _0x415220?.["src"] || _0x415220?.['getAttribute']?.('src') || '')["trim"]();
}
export function isVideoFrameReady(_0xb8dbcf) {
  return !!getVideoFrameSource(_0xb8dbcf) && _0xb8dbcf?.['seeking'] !== !![] && Number(_0xb8dbcf?.['readyState'] || 0x0) >= 0x2 && Number(_0xb8dbcf?.["videoWidth"] || 0x0) > 0x0 && Number(_0xb8dbcf?.["videoHeight"] || 0x0) > 0x0;
}
function drawVideoFrameToCanvas(_0x384b95, _0x477b62) {
  if (!isVideoFrameReady(_0x384b95)) {
    throw new Error('video\x20frame\x20is\x20not\x20ready');
  }
  const _0x51ca4d = Math["max"](0x1, Math["trunc"](Number(_0x384b95["videoWidth"]) || 0x0));
  const _0x3c70a9 = Math["max"](0x1, Math["trunc"](Number(_0x384b95["videoHeight"]) || 0x0));
  const _0x515bf5 = document["createElement"]("canvas");
  const _0x1edbd9 = resolveNormalizedMediaCrop(_0x477b62, _0x51ca4d, _0x3c70a9);
  _0x515bf5["width"] = _0x1edbd9["width"];
  _0x515bf5['height'] = _0x1edbd9["height"];
  const _0x456138 = _0x515bf5["getContext"]('2d');
  if (!_0x456138) {
    throw new Error("canvas context is unavailable");
  }
  if (_0x477b62) {
    _0x456138["drawImage"](_0x384b95, _0x1edbd9['x'], _0x1edbd9['y'], _0x1edbd9["width"], _0x1edbd9["height"], 0x0, 0x0, _0x1edbd9['width'], _0x1edbd9["height"]);
  } else {
    _0x456138["drawImage"](_0x384b95, 0x0, 0x0, _0x51ca4d, _0x3c70a9);
  }
  return {
    'canvas': _0x515bf5,
    'width': _0x1edbd9["width"],
    'height': _0x1edbd9["height"]
  };
}
function dataUrlToBlob(_0x35acde) {
  const _0x359ac6 = String(_0x35acde || '');
  const _0x5b752b = _0x359ac6['match'](/^data:([^;,]+)?(;base64)?,(.*)$/);
  if (!_0x5b752b) {
    throw new Error("invalid data url");
  }
  const _0x1ea9ac = _0x5b752b[0x1] || "application/octet-stream";
  const _0x494f67 = _0x5b752b[0x3] || '';
  const _0x1c38ba = _0x5b752b[0x2] ? atob(_0x494f67) : decodeURIComponent(_0x494f67);
  const _0x205853 = new Uint8Array(_0x1c38ba["length"]);
  for (let _0x55b8ad = 0x0; _0x55b8ad < _0x1c38ba["length"]; _0x55b8ad += 0x1) {
    _0x205853[_0x55b8ad] = _0x1c38ba["charCodeAt"](_0x55b8ad);
  }
  return new Blob([_0x205853], {
    'type': _0x1ea9ac
  });
}
function extFromImageType(_0x1adc5b) {
  const _0x1f8bf7 = String(_0x1adc5b || '')["toLowerCase"]();
  if (_0x1f8bf7["includes"]("jpeg") || _0x1f8bf7['includes']("jpg")) {
    return "jpg";
  }
  if (_0x1f8bf7["includes"]("webp")) {
    return "webp";
  }
  return 'png';
}
function normalizeFrameIndex(_0x7524b2) {
  const _0x4b2820 = Number(_0x7524b2);
  if (!Number['isFinite'](_0x4b2820) || _0x4b2820 <= 0x0) {
    return 0x1;
  }
  return Math['max'](0x1, Math["round"](_0x4b2820));
}
export function resolveVideoFrameCaptureIndex(_0x1be913, {
  currentTimeSec = 0x0,
  fallbackDurationSec = 0x0,
  fallbackFrameRate = 0x0
} = {}) {
  const _0x2c961b = Number(_0x1be913?.["videoFps"]);
  const _0x554a3b = Number(_0x1be913?.["videoFrameCount"]);
  const _0x3259d1 = Number(_0x1be913?.["videoDuration"]);
  const _0x4215a5 = Number["isFinite"](_0x3259d1) && _0x3259d1 > 0x0 ? _0x3259d1 : Number(fallbackDurationSec);
  const _0x1aa312 = Number(fallbackFrameRate);
  const _0x3425a7 = Number["isFinite"](_0x2c961b) && _0x2c961b > 0x0 ? _0x2c961b : Number['isFinite'](_0x554a3b) && _0x554a3b > 0x0 && Number["isFinite"](_0x4215a5) && _0x4215a5 > 0x0 ? _0x554a3b / _0x4215a5 : Number['isFinite'](_0x1aa312) && _0x1aa312 > 0x0 ? _0x1aa312 : 0x0;
  if (Number["isFinite"](_0x3425a7) && _0x3425a7 > 0x0) {
    let _0x5c456c = Math["floor"](Math["max"](0x0, Number(currentTimeSec) || 0x0) * _0x3425a7) + 0x1;
    Number['isFinite'](_0x554a3b) && _0x554a3b > 0x0 ? _0x5c456c = Math["max"](0x1, Math["min"](Math["round"](_0x554a3b), _0x5c456c)) : _0x5c456c = Math["max"](0x1, _0x5c456c);
    return {
      'frameIndex': _0x5c456c,
      'nextSnapSeq': null,
      'usedSequence': ![]
    };
  }
  const _0x233361 = Math["max"](0x1, Math["floor"](Number(_0x1be913?.["snapSeq"]) || 0x0) + 0x1);
  return {
    'frameIndex': _0x233361,
    'nextSnapSeq': _0x233361,
    'usedSequence': !![]
  };
}
export function buildVideoFrameCaptureNodeName(_0x589f7e, {
  frameIndex: _0x5998ea,
  fallbackName = '',
  formatSourceFrameName: _0x2de09a
} = {}) {
  const _0x5ab5e6 = normalizeFrameIndex(_0x5998ea);
  const _0x5efe79 = String(fallbackName || '')["trim"]();
  const _0x4bd32d = String(_0x589f7e?.["name"] || '')["trim"]();
  if (!_0x4bd32d) {
    return _0x5efe79;
  }
  if (typeof _0x2de09a === "function") {
    const _0x1d9ddd = String(_0x2de09a({
      'sourceName': _0x4bd32d,
      'frameIndex': _0x5ab5e6
    }) || '')["trim"]();
    if (_0x1d9ddd) {
      return _0x1d9ddd;
    }
  }
  return _0x5efe79 || _0x4bd32d + '.' + _0x5ab5e6;
}
export function waitForVideoFrame(_0x1afa29, {
  timeoutMs = 0x9c4
} = {}) {
  if (isVideoFrameReady(_0x1afa29)) {
    return Promise["resolve"](!![]);
  }
  if (!getVideoFrameSource(_0x1afa29)) {
    return Promise["resolve"](![]);
  }
  return new Promise(_0x5acf04 => {
    let _0x2c0c3a = ![];
    const _0x4b5b7f = ['loadeddata', "canplay", "canplaythrough", 'seeked', "timeupdate"];
    const _0x19f1b3 = _0x1362ea => {
      if (_0x2c0c3a) {
        return;
      }
      _0x2c0c3a = !![];
      clearTimeout(_0x4f5637);
      for (const _0x124a82 of _0x4b5b7f) {
        _0x1afa29["removeEventListener"]?.(_0x124a82, _0x379559);
      }
      _0x1afa29["removeEventListener"]?.("error", _0x472086);
      _0x1afa29['removeEventListener']?.('abort', _0x472086);
      _0x5acf04(_0x1362ea === !![]);
    };
    const _0x379559 = () => {
      if (isVideoFrameReady(_0x1afa29)) {
        _0x19f1b3(!![]);
      }
    };
    const _0x472086 = () => _0x19f1b3(![]);
    const _0x4f5637 = setTimeout(() => _0x19f1b3(isVideoFrameReady(_0x1afa29)), timeoutMs);
    for (const _0x1af3f0 of _0x4b5b7f) {
      _0x1afa29['addEventListener']?.(_0x1af3f0, _0x379559);
    }
    _0x1afa29["addEventListener"]?.("error", _0x472086);
    _0x1afa29["addEventListener"]?.('abort', _0x472086);
    if (Number(_0x1afa29['readyState'] || 0x0) < 0x1) {
      try {
        _0x1afa29['load']?.();
      } catch {}
    }
  });
}
export function captureVideoFrameDataUrl(_0x119b7e, {
  type = "image/png",
  quality: _0x47f310
} = {}) {
  const {
    canvas: _0x5ba494
  } = drawVideoFrameToCanvas(_0x119b7e);
  return _0x5ba494["toDataURL"](type, _0x47f310);
}
export async function captureVideoFrameBlob(_0x249529, {
  type = "image/png",
  quality: _0xacf8c,
  crop: _0x5091a7
} = {}) {
  const {
    canvas: _0x2a2363
  } = drawVideoFrameToCanvas(_0x249529, _0x5091a7);
  if (typeof _0x2a2363['toBlob'] === "function") {
    const _0xfe6cb1 = await new Promise(_0x4b5477 => {
      _0x2a2363["toBlob"](_0x4b5477, type, _0xacf8c);
    });
    if (!_0xfe6cb1) {
      throw new Error("video frame blob export failed");
    }
    return _0xfe6cb1;
  }
  return dataUrlToBlob(_0x2a2363["toDataURL"](type, _0xacf8c));
}
export async function captureVideoFrameSnapshot(_0x233d2a, {
  type = "image/png",
  quality: _0x364733,
  fileNamePrefix = "video_frame",
  crop: _0x4fd887
} = {}) {
  const _0x1d197d = Math["max"](0x1, Math["trunc"](Number(_0x233d2a?.["videoWidth"]) || 0x0));
  const _0x11c7e7 = Math["max"](0x1, Math["trunc"](Number(_0x233d2a?.["videoHeight"]) || 0x0));
  const _0x12254b = extFromImageType(type);
  const _0x544206 = fileNamePrefix + '_' + Date["now"]() + '.' + _0x12254b;
  const _0x39b307 = await captureVideoFrameBlob(_0x233d2a, {
    'type': type,
    'quality': _0x364733,
    'crop': _0x4fd887
  });
  const _0x362cc0 = resolveNormalizedMediaCrop(_0x4fd887, _0x1d197d, _0x11c7e7);
  return {
    'blob': _0x39b307,
    'width': _0x362cc0['width'],
    'height': _0x362cc0['height'],
    'originalWidth': _0x362cc0["width"],
    'originalHeight': _0x362cc0["height"],
    'type': _0x39b307["type"] || type,
    'ext': _0x12254b,
    'fileName': _0x544206
  };
}
export async function captureAnnotatedVideoFrameSnapshot(_0x1c1944, _0x1363ad, {
  type = "image/png",
  quality: _0x405e55,
  fileNamePrefix = "video_annotation",
  strokeStyle = 'CanvasText'
} = {}) {
  const {
    canvas: _0x3e2513,
    width: _0x31f67c,
    height: _0x49151c
  } = drawVideoFrameToCanvas(_0x1c1944);
  const _0x443c4d = _0x3e2513["getContext"]('2d');
  if (!_0x443c4d) {
    throw new Error("canvas context is unavailable");
  }
  const _0x224b40 = Math["max"](0x0, Number(_0x1363ad?.['x']) || 0x0);
  const _0x789b60 = Math["max"](0x0, Number(_0x1363ad?.['y']) || 0x0);
  const _0x570a20 = Math["max"](0x1, Number(_0x1363ad?.["width"]) || 0x1);
  const _0x58067d = Math["max"](0x1, Number(_0x1363ad?.["height"]) || 0x1);
  _0x443c4d["save"]();
  _0x443c4d["strokeStyle"] = strokeStyle;
  _0x443c4d["lineWidth"] = Math["max"](0x3, Math["round"](Math["min"](_0x31f67c, _0x49151c) / 0xb4));
  _0x443c4d["setLineDash"]([Math['max'](0x6, _0x443c4d["lineWidth"] * 2.5), Math["max"](0x4, _0x443c4d["lineWidth"] * 1.5)]);
  _0x443c4d['strokeRect'](_0x224b40, _0x789b60, _0x570a20, _0x58067d);
  _0x443c4d['restore']();
  const _0x29a7f5 = await new Promise(_0x5e3bd7 => _0x3e2513['toBlob'](_0x5e3bd7, type, _0x405e55));
  if (!_0x29a7f5) {
    throw new Error("annotated video frame blob export failed");
  }
  const _0x399206 = extFromImageType(type);
  return {
    'blob': _0x29a7f5,
    'width': _0x31f67c,
    'height': _0x49151c,
    'originalWidth': _0x31f67c,
    'originalHeight': _0x49151c,
    'type': _0x29a7f5["type"] || type,
    'ext': _0x399206,
    'fileName': fileNamePrefix + '_' + Date["now"]() + '.' + _0x399206
  };
}
export async function saveVideoFrameSnapshot(_0x31e9d5, _0x221718) {
  if (typeof _0x221718 !== "function") {
    throw new Error("saveOutputBlob is required");
  }
  if (!_0x31e9d5?.["blob"]) {
    throw new Error("video frame snapshot is required");
  }
  const _0x25a701 = String(_0x31e9d5['type'] || _0x31e9d5['blob']["type"] || "image/png");
  const _0x1f5d26 = String(_0x31e9d5["ext"] || extFromImageType(_0x25a701));
  const _0x30278f = String(_0x31e9d5['fileName'] || "video_frame_" + Date['now']() + '.' + _0x1f5d26);
  const _0x399b1f = Math["max"](0x1, Math["trunc"](Number(_0x31e9d5["width"] || _0x31e9d5['originalWidth']) || 0x0));
  const _0x270ec5 = Math["max"](0x1, Math["trunc"](Number(_0x31e9d5['height'] || _0x31e9d5["originalHeight"]) || 0x0));
  const _0x4a90fa = typeof File === "function" ? new File([_0x31e9d5["blob"]], _0x30278f, {
    'type': _0x25a701
  }) : _0x31e9d5["blob"];
  const _0x1894d1 = await _0x221718(_0x4a90fa, {
    'ext': _0x1f5d26
  });
  const _0x43d750 = pickResultLocalPath(_0x1894d1);
  const _0x594286 = String(_0x1894d1?.["url"] || '')["trim"]() || localPathToUrl(_0x43d750);
  if (!_0x594286 || !_0x43d750) {
    throw new Error("saved video frame did not return a local image path");
  }
  const _0x3a2f0d = normalizeLocalPath(_0x1894d1?.["originalLocalPath"] || _0x43d750);
  const _0x5a801b = normalizeLocalPath(_0x1894d1?.['displayLocalPath']);
  const _0x157215 = normalizeLocalPath(_0x1894d1?.["thumbLocalPath"]);
  return {
    'src': _0x594286,
    'localPath': _0x43d750,
    'originalLocalPath': _0x3a2f0d,
    'displayLocalPath': _0x5a801b,
    'thumbLocalPath': _0x157215,
    'originalWidth': Number(_0x1894d1?.['originalWidth'] || _0x399b1f) || _0x399b1f,
    'originalHeight': Number(_0x1894d1?.["originalHeight"] || _0x270ec5) || _0x270ec5,
    'fileName': _0x1894d1?.["filename"] || _0x30278f
  };
}
export function createVideoFrameCapturePreviewUrl(_0x31679e, {
  urlApi = globalThis["window"]?.['URL'] || globalThis["URL"]
} = {}) {
  if (!_0x31679e || typeof urlApi?.["createObjectURL"] !== "function") {
    return '';
  }
  try {
    return urlApi["createObjectURL"](_0x31679e);
  } catch {
    return '';
  }
}
export function startVideoFrameSnapshotPersistence(_0x456832, _0x3591e7, {
  onPreview: _0x2b205b
} = {}) {
  if (!_0x456832?.["blob"]) {
    throw new Error("video frame snapshot is required");
  }
  const _0x100cf2 = createVideoFrameCapturePreviewUrl(_0x456832['blob']);
  typeof _0x2b205b === "function" && _0x2b205b({
    'previewUrl': _0x100cf2,
    'snapshot': _0x456832
  });
  const _0xd05b32 = Promise['resolve']()["then"](() => saveVideoFrameSnapshot(_0x456832, _0x3591e7));
  return {
    'previewUrl': _0x100cf2,
    'savePromise': _0xd05b32
  };
}
export async function saveVideoFrameCapture(_0x30d337, _0x187fb4, {
  type = "image/png",
  quality: _0x5c817d,
  fileNamePrefix = 'video_frame'
} = {}) {
  const _0xe6f614 = await captureVideoFrameSnapshot(_0x30d337, {
    'type': type,
    'quality': _0x5c817d,
    'fileNamePrefix': fileNamePrefix
  });
  return saveVideoFrameSnapshot(_0xe6f614, _0x187fb4);
}