import { mkdirSync, statSync } from 'node:fs';
import a270_0x313df9 from 'node:path';
const PRESET_WECHAT = "wechat";
const PRESET_HD = 'hd';
function clampNumber(_0x171755, _0x3b34da, _0xb70581, _0x3829ee) {
  const _0x5c8c2e = Number(_0x171755);
  if (!Number['isFinite'](_0x5c8c2e)) {
    return _0x3829ee;
  }
  return Math["max"](_0x3b34da, Math["min"](_0xb70581, _0x5c8c2e));
}
function normalizeInteger(_0x5b6e6b, _0x11b843, _0x1548c5, _0x3af48a) {
  return Math["round"](clampNumber(_0x5b6e6b, _0x11b843, _0x1548c5, _0x3af48a));
}
function normalizePreset(_0x18cea9) {
  return String(_0x18cea9 || '')["trim"]()["toLowerCase"]() === PRESET_HD ? PRESET_HD : PRESET_WECHAT;
}
function normalizeQuality(_0x93affc, _0x420987 = "balanced") {
  const _0x3daf41 = String(_0x93affc || '')["trim"]()['toLowerCase']();
  return ["compact", 'balanced', "high"]["includes"](_0x3daf41) ? _0x3daf41 : _0x420987;
}
function getQualityMaxColors(_0x20a14e) {
  if (_0x20a14e === "compact") {
    return 0x40;
  }
  if (_0x20a14e === "high") {
    return 0x100;
  }
  return 0x80;
}
function getQualityBayerScale(_0x3598a9) {
  if (_0x3598a9 === "compact") {
    return 0x5;
  }
  if (_0x3598a9 === "high") {
    return 0x2;
  }
  return 0x3;
}
export function normalizeVideoToGifOptions(_0x2c5e0e = {}, _0x378560 = {}) {
  const _0x2a5869 = normalizePreset(_0x2c5e0e['preset']);
  const _0x710f44 = Math["max"](0x0, Number(_0x378560["duration"]) || 0x0);
  const _0x2d7865 = _0x710f44 > 0x0 ? Math['min'](0.1, _0x710f44) : 0.1;
  const _0x20eb76 = _0x710f44 > 0x0 ? Math["max"](0x0, _0x710f44 - _0x2d7865) : Number['MAX_SAFE_INTEGER'];
  const _0x1de4df = clampNumber(_0x2c5e0e["start"], 0x0, _0x20eb76, 0x0);
  const _0x5906a4 = Number(_0x2c5e0e["end"]);
  const _0x142cfd = _0x710f44 > _0x1de4df ? _0x710f44 : _0x1de4df + 0x3;
  const _0x54b3f4 = clampNumber(Number['isFinite'](_0x5906a4) ? _0x5906a4 : _0x142cfd, _0x1de4df + _0x2d7865, _0x710f44 > _0x1de4df ? _0x710f44 : Number['MAX_SAFE_INTEGER'], _0x142cfd);
  const _0x4a04b1 = Math['max'](0x0, Number(_0x2c5e0e["sourceWidth"]) || Number(_0x378560["width"]) || 0x0);
  const _0x230cd4 = Math["max"](0x0, Number(_0x2c5e0e["sourceHeight"]) || Number(_0x378560["height"]) || 0x0);
  const _0x4d8bac = 0x2d0;
  const _0x742e00 = Number(_0x2c5e0e["size"]) || Math['max'](Number(_0x2c5e0e["width"]) || 0x0, Number(_0x2c5e0e["height"]) || 0x0) || _0x4d8bac;
  const _0x2ab3e4 = normalizeInteger(_0x742e00, 0x40, 0x780, _0x4d8bac);
  let _0x1205e4 = normalizeInteger(_0x2c5e0e["width"], 0x1, 0x780, _0x2ab3e4);
  let _0x1f2118 = normalizeInteger(_0x2c5e0e["height"], 0x1, 0x780, _0x2ab3e4);
  if (_0x4a04b1 > 0x0 && _0x230cd4 > 0x0) {
    const _0x422a6c = _0x4a04b1 / _0x230cd4;
    _0x422a6c >= 0x1 ? (_0x1205e4 = _0x2ab3e4, _0x1f2118 = Math['max'](0x1, Math["round"](_0x2ab3e4 / _0x422a6c))) : (_0x1205e4 = Math["max"](0x1, Math["round"](_0x2ab3e4 * _0x422a6c)), _0x1f2118 = _0x2ab3e4);
  }
  const _0x2393cf = normalizeQuality(_0x2c5e0e["quality"], _0x2a5869 === PRESET_WECHAT ? "high" : "balanced");
  return {
    'preset': _0x2a5869,
    'quality': _0x2393cf,
    'start': _0x1de4df,
    'end': _0x54b3f4,
    'duration': _0x54b3f4 - _0x1de4df,
    'fps': normalizeInteger(_0x2c5e0e['fps'], 0x4, 0x1e, _0x2a5869 === PRESET_WECHAT ? 0xf : 0x14),
    'width': _0x1205e4,
    'height': _0x1f2118,
    'maxColors': normalizeInteger(_0x2c5e0e["maxColors"], 0x10, 0x100, getQualityMaxColors(_0x2393cf)),
    'bayerScale': normalizeInteger(_0x2c5e0e["bayerScale"], 0x0, 0x5, getQualityBayerScale(_0x2393cf)),
    'targetBytes': normalizeInteger(_0x2c5e0e["targetBytes"], 0x0, 0x32 * 0x400 * 0x400, _0x2a5869 === PRESET_WECHAT ? 0x400 * 0x400 : 0x0)
  };
}
function buildScaleFilter({
  width: _0x23f179,
  height: _0x5cdfdb
}) {
  return 'scale=' + _0x23f179 + ':' + _0x5cdfdb + ":flags=lanczos,setsar=1";
}
export function buildVideoToGifFfmpegArgs({
  sourceAbs: _0xfde3b,
  outAbs: _0x5394f2,
  options = {}
} = {}) {
  if (!_0xfde3b || !_0x5394f2) {
    throw new Error("Invalid video to GIF source");
  }
  const _0xa3c7f6 = normalizeVideoToGifOptions(options);
  const _0xed6527 = buildScaleFilter(_0xa3c7f6);
  const _0x5bedb0 = ["[0:v]fps=" + _0xa3c7f6['fps'] + ',' + _0xed6527 + ",format=rgba,split[palette_source][gif_source]", "[palette_source]palettegen=max_colors=" + _0xa3c7f6["maxColors"] + ":reserve_transparent=1:stats_mode=diff[palette]", "[gif_source][palette]paletteuse=dither=bayer:bayer_scale=" + _0xa3c7f6["bayerScale"] + ":diff_mode=rectangle[out]"]["join"](';');
  return ['-y', "-ss", String(_0xa3c7f6["start"]), '-t', String(_0xa3c7f6["duration"]), '-i', _0xfde3b, "-filter_complex", _0x5bedb0, "-map", "[out]", "-an", "-loop", '0', "-gifflags", '+transdiff', _0x5394f2];
}
export function resolveNextVideoGifAdaptiveProfile({
  profile = {},
  fileSize = 0x0,
  targetBytes = 0x0,
  attempt = 0x0
} = {}) {
  if (!(fileSize > targetBytes && targetBytes > 0x0)) {
    return null;
  }
  const _0x28a002 = attempt >= 0x2;
  const _0x56948d = {
    'fps': _0x28a002 ? Math["max"](0x6, Math["round"]((Number(profile["fps"]) || 0x6) * 0.85)) : Number(profile["fps"]) || 0x6,
    'maxColors': Math["max"](0x20, Math["round"]((Number(profile["maxColors"]) || 0x20) * 0.75)),
    'width': Math["max"](0x1, Math["round"](Number(profile["width"]) || 0x1)),
    'height': Math['max'](0x1, Math["round"](Number(profile['height']) || 0x1))
  };
  if (_0x56948d["width"] === profile["width"] && _0x56948d["height"] === profile['height'] && _0x56948d["fps"] === profile["fps"] && _0x56948d['maxColors'] === profile["maxColors"]) {
    return null;
  }
  return _0x56948d;
}
export function createVideoToGifMediaTaskHandler({
  createOutputFilename: _0x3519f7,
  ffprobeVideoMeta: _0xc2548c,
  getOutputDir: _0x144f2a,
  getRuntimeToolOrFallback: _0x12fba8,
  resolveMediaTaskSource: _0x532c70,
  runFfmpegTask: _0x473acc,
  statFile = statSync,
  toOutputLocalPath: _0x84a73c
}) {
  return async (_0x33ad54, _0xc16dc8) => {
    const _0x170e4b = _0x33ad54["payload"] || {};
    const _0x2a9bdd = _0x532c70(_0x170e4b["src"]);
    const _0x424fb2 = await _0xc2548c(_0xc16dc8, _0x33ad54, _0x2a9bdd);
    if (!_0x424fb2['width'] || !_0x424fb2["height"]) {
      throw new Error('Source\x20video\x20has\x20no\x20video\x20stream');
    }
    const _0x2a165b = normalizeVideoToGifOptions(_0x170e4b['args'] || _0x170e4b, _0x424fb2);
    const _0x5c37fa = a270_0x313df9["join"](_0x144f2a(), "Gif");
    mkdirSync(_0x5c37fa, {
      'recursive': !![]
    });
    const _0x3c438d = _0x3519f7(_0x2a165b['preset'] === PRESET_WECHAT ? "wechat-gif" : 'hd-gif', "gif");
    const _0x2d115d = a270_0x313df9["join"](_0x5c37fa, _0x3c438d);
    const _0x17fa90 = _0x84a73c("Gif", _0x3c438d);
    const _0x43f19d = typeof _0x473acc === 'function' ? _0x473acc : (_0x3a7047, _0x454855, _0x4c0c63, _0xb14eb6) => _0x454855["runProcess"](_0x3a7047, _0x12fba8("ffmpeg"), _0x4c0c63, _0xb14eb6);
    const _0x475472 = _0x2a165b["targetBytes"] > 0x0 ? 0x6 : 0x1;
    let _0x51e032 = 0x0;
    let _0x279b9f = {
      'fps': _0x2a165b["fps"],
      'maxColors': _0x2a165b["maxColors"],
      'width': _0x2a165b["width"],
      'height': _0x2a165b["height"]
    };
    for (let _0x30e910 = 0x0; _0x30e910 < _0x475472; _0x30e910 += 0x1) {
      _0xc16dc8["throwIfCancelled"]?.(_0x33ad54);
      _0xc16dc8["emitProgress"]?.(_0x33ad54, _0x33ad54['progress'] || 0.01, _0x30e910 === 0x0 ? "Encoding GIF" : "Optimizing GIF (" + (_0x30e910 + 0x1) + '/' + _0x475472 + ')', {
        'stage': _0x30e910 === 0x0 ? 'encode' : "optimize"
      });
      const _0x430b5a = buildVideoToGifFfmpegArgs({
        'sourceAbs': _0x2a9bdd,
        'outAbs': _0x2d115d,
        'options': {
          ..._0x2a165b,
          ..._0x279b9f
        }
      });
      await _0x43f19d(_0x33ad54, _0xc16dc8, _0x430b5a, {
        'durationSec': 0x0,
        'progressMessage': 'Encoding\x20GIF'
      });
      _0x51e032 = Number(statFile(_0x2d115d)?.['size'] || 0x0);
      if (!(_0x2a165b["targetBytes"] > 0x0) || _0x51e032 <= _0x2a165b['targetBytes']) {
        break;
      }
      if (_0x30e910 + 0x1 >= _0x475472) {
        break;
      }
      const _0xaf347d = resolveNextVideoGifAdaptiveProfile({
        'profile': _0x279b9f,
        'fileSize': _0x51e032,
        'targetBytes': _0x2a165b["targetBytes"],
        'attempt': _0x30e910 + 0x1
      });
      if (!_0xaf347d) {
        break;
      }
      _0x279b9f = _0xaf347d;
    }
    return {
      'success': !![],
      'filename': _0x3c438d,
      'path': _0x17fa90,
      'localPath': _0x17fa90,
      'url': '/' + _0x17fa90,
      'mimeType': "image/gif",
      'imageWidth': _0x279b9f["width"],
      'imageHeight': _0x279b9f["height"],
      'duration': _0x2a165b["duration"],
      'fps': _0x279b9f["fps"],
      'maxColors': _0x279b9f["maxColors"],
      'fileSize': _0x51e032,
      'targetBytes': _0x2a165b["targetBytes"],
      'targetExceeded': _0x2a165b["targetBytes"] > 0x0 && _0x51e032 > _0x2a165b['targetBytes'],
      'preset': _0x2a165b["preset"]
    };
  };
}