import { existsSync, mkdirSync, renameSync, statSync, unlinkSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import a259_0x30dd80 from 'node:path';
import { configureFfmpegVideoEncoderRuntime, runFfmpegVideoTask } from './ffmpegVideoEncoderRuntime.js';
import { MediaTaskQueue } from './mediaTaskQueue.js';
import { registerLocalMediaTaskHandlers } from './mediaTasks/registerLocalMediaTaskHandlers.js';
import { registerSharedMediaTaskHandlers } from './mediaTasks/registerSharedMediaTaskHandlers.js';
import { runToolCapture } from './toolCapture.js';
import { VIDEO_PLAYBACK_PROXY_VERSION, buildVideoPlaybackProxyFfmpegArgs, createVideoPlaybackProxyWorkDeduper, getVideoPlaybackProxyFilename, needsBrowserVideoProxy, resolveVideoPlaybackProxyTimeoutMs } from './videoPlaybackProxy.js';
const ASSET_IMPORT_FFPROBE_TIMEOUT_MS = 0x7530;
const LONG_MEDIA_TASK_NOTIFICATION_MS = 0x4e20;
const PERSON_REPLACEMENT_COMPOSE_TASK_PURPOSE = "person-replacement-compose";
const VIDEO_PROXY_TRANSCODE_PRESET = 'veryfast';
const VIDEO_PROXY_TRANSCODE_CRF = '23';
function requireFunction(_0x3bb639, _0x45661e) {
  if (typeof _0x3bb639 !== 'function') {
    throw new TypeError(_0x45661e + " must be a function");
  }
  return _0x3bb639;
}
function parseFfprobeRatio(_0x25a77a) {
  const _0x23f49a = String(_0x25a77a || '')["trim"]();
  if (!_0x23f49a) {
    return 0x0;
  }
  if (!_0x23f49a['includes']('/')) {
    return Number(_0x23f49a) || 0x0;
  }
  const [_0x1b91ab, _0x218171] = _0x23f49a["split"]('/');
  const _0x54c86d = Number(_0x218171);
  if (!_0x54c86d) {
    return 0x0;
  }
  return (Number(_0x1b91ab) || 0x0) / _0x54c86d;
}
export function buildMediaTaskStatePatch(_0x3d9a30 = {}) {
  const _0x2bd6ae = String(_0x3d9a30?.["status"] || '');
  const _0x3ec825 = {
    'mediaTaskId': _0x3d9a30?.["taskId"] || '',
    'mediaTaskKind': _0x3d9a30?.["kind"] || '',
    'mediaTaskStatus': _0x2bd6ae,
    'mediaTaskProgress': Number(_0x3d9a30?.["progress"] || 0x0) || 0x0,
    'mediaTaskError': _0x3d9a30?.['error'] || ''
  };
  if (_0x2bd6ae === 'waiting' || _0x2bd6ae === "processing") {
    _0x3ec825["isGenerating"] = !![];
    _0x3ec825['jobStatus'] = "running";
  } else {
    if (_0x2bd6ae === "complete") {
      _0x3ec825['isGenerating'] = ![];
      _0x3ec825["jobStatus"] = "success";
    } else {
      if (_0x2bd6ae === "failed") {
        _0x3ec825["isGenerating"] = ![];
        _0x3ec825["jobStatus"] = "error";
        _0x3ec825["jobError"] = _0x3ec825["mediaTaskError"] || "Media task failed";
      } else {
        _0x2bd6ae === "cancelled" && (_0x3ec825["isGenerating"] = ![], _0x3ec825["jobStatus"] = null);
      }
    }
  }
  return _0x3ec825;
}
function getMediaTaskDisplayName(_0x13536a) {
  const _0x35f048 = String(_0x13536a || '')["trim"]();
  const _0x48115b = {
    'videoPoster': '视频处理',
    'audioWaveform': "音频波形",
    'videoFirstFrame': '视频封面',
    'videoCut': "视频剪辑",
    'videoReverse': "视频倒放",
    'audioCut': "音频剪辑",
    'videoAudioSeparate': '音频分离',
    'videoCompose': "视频合成",
    'videoAudioMux': "完整视频封装",
    'audioCompose': '音频合并',
    'audioVoiceCompose': "语音工作室合成",
    'mediaClipExport': "剪辑导出"
  };
  return _0x48115b[_0x35f048] || "媒体任务";
}
function formatNotificationBody(_0xa61b9e, _0x311cc5) {
  const _0x2582bb = String(_0xa61b9e || _0x311cc5 || '')["replace"](/\s+/g, '\x20')["trim"]();
  if (_0x2582bb['length'] <= 0xb4) {
    return _0x2582bb;
  }
  return _0x2582bb["slice"](0x0, 0xb1) + "...";
}
export function createMediaTaskRuntime({
  appRoot: _0x4f167f,
  platform: _0xacb3ef,
  env = process["env"],
  getRuntimeToolOrFallback: _0x1ceed3,
  getAssetsDir: _0x552efb,
  getOutputDir: _0x5d4274,
  resolveLocalVirtualPath: _0x20123d,
  updateAssetRecord: _0x5a30b8,
  sendAssetUpdated: _0x4a40b4,
  setTaskbarProgressSource: _0x393762,
  setPowerSaveBlocker: _0x6fc74f,
  NotificationCtor: _0x38e809,
  focusMainWindow: _0x3ab98d,
  publishTaskUpdate: _0x55b737,
  getDoubaoAsrConfig: _0x225e70,
  getBailianAsrConfig: _0x3389f3,
  getPythonCertificateEnv: _0x3063ec,
  getFunasrModelRootDir: _0x319ca7,
  getUserDataRoot: _0x107de6,
  resolveFallbackPythonCommand: _0x5ccdca,
  resolvePythonCommand: _0xf72fb0,
  MediaTaskQueueCtor = MediaTaskQueue,
  registerLocalHandlers = registerLocalMediaTaskHandlers,
  registerSharedHandlers = registerSharedMediaTaskHandlers,
  configureFfmpegRuntime = configureFfmpegVideoEncoderRuntime,
  runCapture = runToolCapture,
  runFfmpegTask = runFfmpegVideoTask
} = {}) {
  const _0x3ee193 = requireFunction(_0x1ceed3, "getRuntimeToolOrFallback");
  const _0x369d54 = requireFunction(_0x552efb, 'getAssetsDir');
  const _0x436f87 = requireFunction(_0x5d4274, 'getOutputDir');
  const _0xfcb8ed = requireFunction(_0x20123d, "resolveLocalVirtualPath");
  const _0x1d7e79 = requireFunction(_0x5a30b8, "updateAssetRecord");
  const _0x169e59 = requireFunction(_0x4a40b4, "sendAssetUpdated");
  const _0xca81c0 = typeof _0x55b737 === 'function' ? _0x55b737 : () => {};
  const _0x1f1507 = typeof _0x3ab98d === 'function' ? _0x3ab98d : () => {};
  const _0x30a133 = createVideoPlaybackProxyWorkDeduper();
  const _0x4f8888 = new Set();
  let _0xe4fe29 = null;
  let _0x40eb5a = {
    'activeCount': 0x0,
    'waitingCount': 0x0,
    'totalCount': 0x0,
    'progress': 0x0,
    'activeTasks': []
  };
  function _0x585384(_0x5b3395, _0x7275bc) {
    const _0x3fc487 = String(_0x5b3395 || 'media')["replace"](/[^a-z0-9_-]/gi, '_') || "media";
    const _0x1f1a84 = String(_0x7275bc || "bin")["replace"](/^\.+/, '')["replace"](/[^a-z0-9]/gi, '') || "bin";
    return _0x3fc487 + '_' + Date["now"]() + '_' + randomBytes(0x3)["toString"]("hex") + '.' + _0x1f1a84;
  }
  function _0x293548(..._0x9219cc) {
    return ["output", ..._0x9219cc]["filter"](Boolean)["join"]('/')["replace"](/\\/g, '/');
  }
  function _0x3a2295(..._0x4190cb) {
    return ["data", "assets", ..._0x4190cb]["filter"](Boolean)['join']('/')["replace"](/\\/g, '/');
  }
  function _0x356750(_0x1fc918) {
    const _0x4ef4ee = _0xfcb8ed(_0x1fc918);
    if (!_0x4ef4ee) {
      throw new Error("Invalid media source path");
    }
    return _0x4ef4ee;
  }
  async function _0x48a42f(_0x4ea8bd, _0x38a62e = "FFprobe failed") {
    const _0x36708b = await runCapture(_0x3ee193("ffprobe"), _0x4ea8bd, {
      'cwd': _0x4f167f,
      'timeoutMs': ASSET_IMPORT_FFPROBE_TIMEOUT_MS
    });
    const _0x11a5c2 = _0x36708b["toString"]("utf8")["trim"]();
    if (!_0x11a5c2) {
      throw new Error(_0x38a62e);
    }
    try {
      return JSON["parse"](_0x11a5c2);
    } catch {
      throw new Error(_0x38a62e);
    }
  }
  async function _0x124b0b(_0x3cc28e, _0x51bebf, _0x56a6a4, _0x1b3fad = "FFprobe failed") {
    const _0x10bf4b = await _0x3cc28e['runProcess'](_0x51bebf, _0x3ee193("ffprobe"), _0x56a6a4, {
      'timeoutMs': ASSET_IMPORT_FFPROBE_TIMEOUT_MS
    });
    const _0x1b279f = _0x10bf4b['stdout']["toString"]('utf8')["trim"]();
    if (!_0x1b279f) {
      throw new Error(_0x1b3fad);
    }
    try {
      return JSON["parse"](_0x1b279f);
    } catch {
      throw new Error(_0x1b3fad);
    }
  }
  async function _0x4618fc(_0x276626, _0x4beab1, _0x562a1e) {
    const _0x3ee066 = await _0x124b0b(_0x276626, _0x4beab1, ['-v', "error", "-select_streams", "v:0", "-show_entries", "format=duration:stream=avg_frame_rate,r_frame_rate,nb_frames,duration,width,height", "-of", "json", _0x562a1e]);
    const _0x8d5692 = Array["isArray"](_0x3ee066["streams"]) && _0x3ee066["streams"][0x0] ? _0x3ee066["streams"][0x0] : {};
    const _0x266728 = _0x3ee066["format"] || {};
    return {
      'duration': Number(_0x266728['duration'] || 0x0) || Number(_0x8d5692["duration"] || 0x0) || 0x0,
      'fps': parseFfprobeRatio(_0x8d5692["avg_frame_rate"]) || parseFfprobeRatio(_0x8d5692["r_frame_rate"]) || 0x0,
      'width': Math["trunc"](Number(_0x8d5692["width"] || 0x0)) || 0x0,
      'height': Math['trunc'](Number(_0x8d5692["height"] || 0x0)) || 0x0
    };
  }
  async function _0xe33f48(_0x11e96d, _0xc2133b, _0x4a4ab0) {
    try {
      const _0x1b8523 = await _0x11e96d["runProcess"](_0xc2133b, _0x3ee193("ffprobe"), ['-v', "error", "-select_streams", 'a:0', "-show_entries", "stream=codec_type", "-of", 'default=nw=1:nk=1', _0x4a4ab0], {
        'timeoutMs': ASSET_IMPORT_FFPROBE_TIMEOUT_MS
      });
      return _0x1b8523['stdout']["toString"]('utf8')["toLowerCase"]()["includes"]("audio");
    } catch {
      return ![];
    }
  }
  async function _0x31ac32(_0x3bb644, _0x2f2ea5, _0x6219c) {
    const _0x2156b2 = await _0x124b0b(_0x3bb644, _0x2f2ea5, ['-v', 'error', "-select_streams", "v:0", "-show_entries", 'format=duration,format_name:stream=codec_name,codec_tag_string,pix_fmt,profile,width,height', "-of", 'json', _0x6219c]);
    return _0x10f69b(_0x2156b2);
  }
  function _0x10f69b(_0x315072 = {}) {
    const _0x41ba30 = Array["isArray"](_0x315072["streams"]) && _0x315072["streams"][0x0] ? _0x315072["streams"][0x0] : {};
    const _0x3938f8 = _0x315072['format'] || {};
    return {
      'codecName': String(_0x41ba30["codec_name"] || '')["trim"]()["toLowerCase"](),
      'codecTag': String(_0x41ba30["codec_tag_string"] || '')["trim"]()["toLowerCase"](),
      'pixelFormat': String(_0x41ba30['pix_fmt'] || '')["trim"]()['toLowerCase'](),
      'profile': String(_0x41ba30["profile"] || '')["trim"](),
      'formatName': String(_0x3938f8["format_name"] || '')["trim"]()["toLowerCase"](),
      'duration': Number(_0x3938f8['duration'] || 0x0) || 0x0,
      'fps': parseFfprobeRatio(_0x41ba30["avg_frame_rate"]) || parseFfprobeRatio(_0x41ba30["r_frame_rate"]) || 0x0,
      'width': Math['trunc'](Number(_0x41ba30["width"] || 0x0)) || 0x0,
      'height': Math["trunc"](Number(_0x41ba30['height'] || 0x0)) || 0x0
    };
  }
  async function _0x5aa89a(_0x5eff11) {
    const _0x2906e7 = await _0x48a42f(['-v', 'error', "-select_streams", 'v:0', "-show_entries", "format=duration,format_name:stream=avg_frame_rate,r_frame_rate,codec_name,codec_tag_string,pix_fmt,profile,width,height", "-of", "json", _0x5eff11]);
    return _0x10f69b(_0x2906e7);
  }
  function _0x436169(_0x48497e) {
    const _0x5a47a4 = a259_0x30dd80["join"](_0x369d54(), 'derived', "video");
    const _0x26db41 = getVideoPlaybackProxyFilename(_0x48497e);
    return {
      'derivedDir': _0x5a47a4,
      'proxyAbs': a259_0x30dd80["join"](_0x5a47a4, _0x26db41),
      'proxyLocalPath': _0x3a2295('derived', "video", _0x26db41)
    };
  }
  async function _0x538da6(_0x2b7649, _0x1fdcb2, _0x18679c, _0x2fe934) {
    const _0x233463 = await _0x31ac32(_0x1fdcb2, _0x2b7649, _0x18679c);
    if (!needsBrowserVideoProxy(_0x233463)) {
      return {
        'displayLocalPath': '',
        'displayUrl': '',
        'videoProxyStatus': "not_required",
        'videoProxyVersion': '',
        'videoCodec': _0x233463["codecName"]
      };
    }
    const {
      derivedDir: _0x1fc22c,
      proxyAbs: _0x29a970,
      proxyLocalPath: _0x4d21f2
    } = _0x436169(_0x2fe934);
    mkdirSync(_0x1fc22c, {
      'recursive': !![]
    });
    let _0x168b50 = ![];
    try {
      _0x168b50 = existsSync(_0x29a970) && statSync(_0x29a970)["size"] > 0x0;
    } catch {
      _0x168b50 = ![];
    }
    if (!_0x168b50) {
      const _0x27d77b = _0x29a970 + '.' + process["pid"] + '.' + Date["now"]() + ".tmp.mp4";
      try {
        await runFfmpegTask(_0x2b7649, _0x1fdcb2, buildVideoPlaybackProxyFfmpegArgs({
          'inputPath': _0x18679c,
          'outputPath': _0x27d77b,
          'preset': VIDEO_PROXY_TRANSCODE_PRESET,
          'crf': VIDEO_PROXY_TRANSCODE_CRF
        }), {
          'durationSec': _0x233463["duration"],
          'progressMessage': "Transcoding video",
          'timeoutMs': resolveVideoPlaybackProxyTimeoutMs(_0x233463["duration"])
        });
        renameSync(_0x27d77b, _0x29a970);
      } catch (_0xad6a23) {
        try {
          if (existsSync(_0x27d77b)) {
            unlinkSync(_0x27d77b);
          }
        } catch {}
        throw _0xad6a23;
      }
    }
    return {
      'displayLocalPath': _0x4d21f2,
      'displayUrl': '/' + _0x4d21f2,
      'videoProxyStatus': 'generated',
      'videoProxyVersion': VIDEO_PLAYBACK_PROXY_VERSION,
      'videoCodec': _0x233463["codecName"]
    };
  }
  function _0x53153e(_0x1e21c4, _0x3bf141, _0x16344d, _0x2583e1) {
    const _0x53db8c = [VIDEO_PLAYBACK_PROXY_VERSION, String(_0x2583e1 || '')["trim"](), a259_0x30dd80["resolve"](_0x16344d)["toLowerCase"]()]['join']('|');
    return _0x30a133['run'](_0x53db8c, () => _0x538da6(_0x1e21c4, _0x3bf141, _0x16344d, _0x2583e1));
  }
  function _0x25ce64(_0x3c3ea7, _0x31fae0 = 0xbe) {
    const _0x4c6e75 = _0x3c3ea7["buffer"]["slice"](_0x3c3ea7["byteOffset"], _0x3c3ea7["byteOffset"] + _0x3c3ea7["byteLength"]);
    const _0x34742b = new Float32Array(_0x4c6e75, 0x0, Math['floor'](_0x3c3ea7['byteLength'] / 0x4));
    const _0x47786c = Math["max"](0x28, Math['min'](0x190, Number(_0x31fae0) || 0xbe));
    const _0x45d1f6 = Math['max'](0x1, Math["floor"](_0x34742b['length'] / _0x47786c));
    const _0x5bde32 = [];
    for (let _0x36b3df = 0x0; _0x36b3df < _0x47786c; _0x36b3df += 0x1) {
      const _0x2c222c = _0x36b3df * _0x45d1f6;
      const _0x51b1a0 = Math["min"](_0x34742b["length"], _0x2c222c + _0x45d1f6);
      let _0xac3059 = 0x0;
      for (let _0x4a7beb = _0x2c222c; _0x4a7beb < _0x51b1a0; _0x4a7beb += 0x1) {
        _0xac3059 = Math["max"](_0xac3059, Math['abs'](Number(_0x34742b[_0x4a7beb]) || 0x0));
      }
      _0x5bde32["push"](Number(Math["min"](0x1, _0xac3059)['toFixed'](0x4)));
    }
    return {
      'version': 0x1,
      'samples': _0x47786c,
      'peaks': _0x5bde32
    };
  }
  function _0x4915f9(_0x4be6d2 = {}) {
    _0x40eb5a = {
      'activeCount': Number(_0x4be6d2["activeCount"] || 0x0) || 0x0,
      'waitingCount': Number(_0x4be6d2["waitingCount"] || 0x0) || 0x0,
      'totalCount': Number(_0x4be6d2["totalCount"] || 0x0) || 0x0,
      'progress': Number(_0x4be6d2["progress"] || 0x0) || 0x0,
      'activeTasks': Array["isArray"](_0x4be6d2['activeTasks']) ? _0x4be6d2["activeTasks"] : []
    };
    const _0x42438d = _0x40eb5a["activeCount"] > 0x0;
    _0x393762?.("media", _0x42438d ? Math['max'](0.01, _0x40eb5a["progress"]) : -0x1);
    _0x6fc74f?.("media", _0x42438d);
  }
  function _0x5706e4(_0x211912 = {}) {
    const _0x5700fe = String(_0x211912["status"] || '');
    if (_0x5700fe !== "complete" && _0x5700fe !== "failed") {
      return;
    }
    if (String(_0x211912["purpose"] || '')['trim']() === PERSON_REPLACEMENT_COMPOSE_TASK_PURPOSE) {
      return;
    }
    const _0x1a8a51 = String(_0x211912["taskId"] || '')["trim"]();
    if (!_0x1a8a51 || _0x4f8888["has"](_0x1a8a51)) {
      return;
    }
    const _0x3f1be7 = Number(_0x211912["startedAt"] || 0x0) || 0x0;
    const _0x376821 = Number(_0x211912["finishedAt"] || Date['now']()) || Date["now"]();
    if (!_0x3f1be7 || _0x376821 - _0x3f1be7 < LONG_MEDIA_TASK_NOTIFICATION_MS) {
      return;
    }
    if (typeof _0x38e809?.['isSupported'] === "function" && !_0x38e809["isSupported"]()) {
      return;
    }
    _0x4f8888["add"](_0x1a8a51);
    _0x4f8888["size"] > 0x1f4 && _0x4f8888['delete'](_0x4f8888["values"]()['next']()["value"]);
    const _0x4d46c3 = getMediaTaskDisplayName(_0x211912['kind']);
    const _0x482841 = _0x5700fe === "failed";
    try {
      const _0x42cc0e = new _0x38e809({
        'title': '' + _0x4d46c3 + (_0x482841 ? '失败' : '完成'),
        'body': _0x482841 ? formatNotificationBody(_0x211912['error'], "任务处理失败。") : formatNotificationBody('', '长时间媒体任务已处理完成。'),
        'silent': String(_0x211912["kind"] || '') === "audioVoiceCompose"
      });
      _0x42cc0e['on']("click", _0x1f1507);
      _0x42cc0e["show"]();
    } catch (_0x1c1019) {
      console["warn"]("[electron] failed to show media task notification:", _0x1c1019);
    }
  }
  function _0x4018d2(_0x2662a8) {
    const _0x44f9c4 = String(_0x2662a8?.["status"] || '');
    if (_0x2662a8?.['assetId'] && (_0x44f9c4 === 'failed' || _0x44f9c4 === "cancelled")) {
      const _0x4ace18 = _0x1d7e79(_0x2662a8['assetId'], {
        'status': "partial",
        'error': _0x2662a8["error"] || _0x44f9c4,
        'mediaTaskId': _0x2662a8["taskId"] || '',
        'mediaTaskKind': _0x2662a8["kind"] || '',
        'mediaTaskStatus': _0x44f9c4,
        'mediaTaskProgress': Number(_0x2662a8["progress"] || 0x0) || 0x0,
        'mediaTaskError': _0x2662a8["error"] || ''
      }, {
        'expectedMediaTaskId': _0x2662a8["taskId"]
      });
      _0x169e59(_0x4ace18);
    }
    _0x5706e4(_0x2662a8);
    _0xca81c0(_0x2662a8);
  }
  function _0x1f3c63() {
    if (_0xe4fe29) {
      return _0xe4fe29;
    }
    _0xe4fe29 = new MediaTaskQueueCtor({
      'concurrency': 0x2,
      'onUpdate': _0x4018d2,
      'onActivity': _0x4915f9
    });
    configureFfmpegRuntime({
      'ffmpegPath': _0x3ee193("ffmpeg"),
      'platform': _0xacb3ef,
      'runCapture': runCapture,
      'cwd': _0x4f167f
    });
    registerLocalHandlers(_0xe4fe29, {
      'buildWaveformJsonFromFloat32': _0x25ce64,
      'createOutputFilename': _0x585384,
      'ensureAssetVideoPlaybackProxy': _0x53153e,
      'ffprobeHasAudio': _0xe33f48,
      'ffprobeVideoMeta': _0x4618fc,
      'getAssetsDir': _0x369d54,
      'getOutputDir': _0x436f87,
      'getRuntimeToolOrFallback': _0x3ee193,
      'runFfmpegTask': runFfmpegTask,
      'resolveMediaTaskSource': _0x356750,
      'sendAssetUpdated': _0x169e59,
      'toAssetLocalPath': _0x3a2295,
      'toOutputLocalPath': _0x293548,
      'updateAssetRecord': _0x1d7e79
    });
    registerSharedHandlers(_0xe4fe29, {
      'createOutputFilename': _0x585384,
      'ffprobeHasAudio': _0xe33f48,
      'ffprobeVideoMeta': _0x4618fc,
      'getAsrRuntimeManifestUrl': () => String(env["AIC_ASR_RUNTIME_MANIFEST_URL"] || "https://modelscope.cn/models/q502892879/asr-runtime/resolve/master/asr-runtime-manifest.json")["trim"](),
      'getDoubaoAsrConfig': _0x225e70,
      'getBailianAsrConfig': _0x3389f3,
      'getPythonCertificateEnv': _0x3063ec,
      'getFunasrModelRootDir': _0x319ca7,
      'getOutputDir': _0x436f87,
      'getRuntimeToolOrFallback': _0x3ee193,
      'getUserDataRoot': _0x107de6,
      'runFfmpegTask': runFfmpegTask,
      'resolveMediaTaskSource': _0x356750,
      'resolveFallbackPythonCommand': _0x5ccdca,
      'resolvePythonCommand': _0xf72fb0,
      'appRoot': _0x4f167f,
      'toOutputLocalPath': _0x293548
    });
    return _0xe4fe29;
  }
  return {
    'buildStatePatch': buildMediaTaskStatePatch,
    'getActivity': () => ({
      ..._0x40eb5a,
      'activeTasks': [..._0x40eb5a["activeTasks"]]
    }),
    'getQueue': _0x1f3c63,
    'probeVideoPlaybackInfoForImport': _0x5aa89a
  };
}