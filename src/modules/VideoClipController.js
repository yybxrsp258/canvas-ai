import a1605_0x3a192f from '../core/stores/appStore.js';
import { findAvailablePosition, generateId } from '../core/math.js';
import { commit } from './history.js';
import { calcSafeSpawnPosNearNode, calcSpawnStartFromAnchor, getNodeSpawnPrefs } from './nodeSpawn.js';
import { cutVideoRangeToLocal } from '../services/videoCutService.js';
import { fetchVideoMetaFromServer } from '../../api/videoMetaApi.js';
import { fetchVideoFirstFrameThumbFromServer } from '../../api/videoThumbApi.js';
import { buildSourceMediaNodePayload, getAutoMediaSizeByShortSide } from '../services/fileService.js';
import { resolveCanvasVideoPosterUrl, resolveCanvasVideoUrl } from '../services/canvasMediaLocalService.js';
import { SMART_CLIP_DEFAULT_FPS, SMART_CLIP_DEFAULT_SEGMENTS, SMART_CLIP_FPS_OPTIONS, SMART_CLIP_MAX_SEGMENTS, SMART_CLIP_MIN_SEGMENTS, SMART_CLIP_OUTPUT_MODE_KEYFRAMES, SMART_CLIP_OUTPUT_MODE_SEGMENTS, normalizeSmartClipFps, normalizeSmartClipMaxSegments, normalizeSmartClipOutputMode, normalizeSmartClipRunOptions, runSmartClipJob } from '../services/smartClipJobService.js';
import { localPathToUrl, pickResultLocalPath } from '../utils/localMediaPath.js';
import { attachDesktopMediaPlaybackSource } from '../services/desktopMediaBlobSource.js';
import { extractCurrentVideoFrameToImageNode } from './videoFrameExtraction.js';
import { t } from '../i18n/index.js';
import { captureVideoFrameSnapshot, saveVideoFrameSnapshot, waitForVideoFrame } from '../components/videoFrameCapture.js';
import { playVideoWithRecovery } from '../components/video-node/mediaPlaybackRecovery.js';
import { saveOutputBlob } from './project.js';
import { renderVideoTimelineThumbnails } from './videoTimelineThumbnails.js';
import { resolveNodeVideoElement } from './nodeVideoElement.js';
import { mirrorMediaClipRange, renderMediaClipReverseIcon, resolveMediaClipReverseControlState } from '../components/media-clip/mediaClipReverseControl.js';
import { createVideoRangeTimelineView } from '../components/media-clip/videoRangeTimelineView.js';
export function normalizeVideoCutResultLocalPath(_0x4ff68c) {
  return pickResultLocalPath(_0x4ff68c);
}
export function shouldVideoClipSelectionPointerUpSeek(_0x3ce3c3 = '', _0x54b9fa = ![]) {
  return String(_0x3ce3c3 || '') === "move" && _0x54b9fa !== !![];
}
export function resolveVideoClipSelectionBodyCursor(_0x39f8fd = "grab") {
  return _0x39f8fd === "pointer" ? "var(--pointer-cursor)" : "var(--grab-cursor)";
}
const SMART_CLIP_IMAGE_EXT_RE = /\.(?:png|jpe?g|webp|bmp|gif)(?:[?#]|$)/i;
const VIDEO_CLIP_SEEK_EPSILON_SEC = 0.035;
const VIDEO_CLIP_PLAY_SEEK_TIMEOUT_MS = 0x384;
export const SMART_CLIP_KEYFRAME_DEFAULT_OPTIONS = Object["freeze"]({
  'mode': 'stable',
  'maxSegments': SMART_CLIP_DEFAULT_SEGMENTS,
  'fps': SMART_CLIP_DEFAULT_FPS,
  'outputMode': SMART_CLIP_OUTPUT_MODE_KEYFRAMES
});
function videoClipText(_0x303250, _0x58a76b = {}) {
  return t('videoClip.' + _0x303250, _0x58a76b);
}
function escapeClipHelperHtml(_0x1eda94) {
  return String(_0x1eda94 ?? '')["replace"](/[&<>"']/g, _0x5b4e18 => {
    if (_0x5b4e18 === '&') {
      return "&amp;";
    }
    if (_0x5b4e18 === '<') {
      return "&lt;";
    }
    if (_0x5b4e18 === '>') {
      return "&gt;";
    }
    if (_0x5b4e18 === '\x22') {
      return '&quot;';
    }
    return "&#39;";
  });
}
function clipHelperLabel(_0x2f5262, _0x246618 = {}) {
  return escapeClipHelperHtml(videoClipText(_0x2f5262, _0x246618));
}
export { normalizeSmartClipFps, normalizeSmartClipMaxSegments, normalizeSmartClipOutputMode };
export function isSmartClipImageResult(_0x184666, _0x42bac9 = pickResultLocalPath(_0x184666)) {
  const _0x293131 = String(_0x184666?.["outputType"] || _0x184666?.["type"] || '')['trim']()["toLowerCase"]();
  const _0x4166d4 = String(_0x184666?.["mimeType"] || _0x184666?.["contentType"] || '')["trim"]()["toLowerCase"]();
  return _0x293131 === "image" || _0x4166d4['startsWith']("image/") || SMART_CLIP_IMAGE_EXT_RE['test'](String(_0x42bac9 || _0x184666?.["url"] || _0x184666?.["path"] || ''));
}
function resolveSmartClipResultUrl(_0x1873b9, _0x5f4a35) {
  return localPathToUrl(_0x5f4a35) || String(_0x1873b9?.["url"] || _0x1873b9?.["src"] || _0x1873b9?.["imageUrl"] || '')["trim"]();
}
function getWindowTimer(_0x22d47f) {
  const _0x5bf7ba = globalThis["window"]?.[_0x22d47f] || globalThis[_0x22d47f];
  return typeof _0x5bf7ba === "function" ? _0x5bf7ba["bind"](globalThis["window"] || globalThis) : null;
}
function waitForSmartClipVideoEvent(_0x3953ff, _0x143474, _0x5cf55c = 0x2710) {
  const _0x27dad1 = getWindowTimer("setTimeout");
  const _0x1e15e4 = getWindowTimer("clearTimeout");
  if (!_0x3953ff || typeof _0x27dad1 !== "function") {
    return Promise["resolve"](![]);
  }
  return new Promise(_0x1842ab => {
    let _0x571d4c = ![];
    let _0x45a724 = null;
    const _0x550ac2 = () => {
      for (const _0x2aad30 of _0x143474) {
        _0x3953ff["removeEventListener"]?.(_0x2aad30, _0x38d0ec);
      }
      _0x3953ff["removeEventListener"]?.("error", _0x50bb00);
      _0x3953ff['removeEventListener']?.('abort', _0x50bb00);
      if (_0x45a724 && typeof _0x1e15e4 === "function") {
        _0x1e15e4(_0x45a724);
      }
    };
    const _0x2d6f9b = _0x2e8284 => {
      if (_0x571d4c) {
        return;
      }
      _0x571d4c = !![];
      _0x550ac2();
      _0x1842ab(_0x2e8284 === !![]);
    };
    const _0x38d0ec = () => _0x2d6f9b(!![]);
    const _0x50bb00 = () => _0x2d6f9b(![]);
    for (const _0x893f2d of _0x143474) {
      _0x3953ff['addEventListener']?.(_0x893f2d, _0x38d0ec, {
        'once': !![]
      });
    }
    _0x3953ff["addEventListener"]?.("error", _0x50bb00, {
      'once': !![]
    });
    _0x3953ff["addEventListener"]?.("abort", _0x50bb00, {
      'once': !![]
    });
    _0x45a724 = _0x27dad1(() => _0x2d6f9b(![]), _0x5cf55c);
  });
}
async function captureSmartClipVideoFirstFrame(_0x2110b2, _0x56bb52) {
  const _0x40e6c8 = globalThis['document'];
  if (!_0x40e6c8 || !_0x2110b2) {
    throw new Error("missing video url");
  }
  const _0x4ea96f = _0x40e6c8['createElement']("video");
  _0x4ea96f["muted"] = !![];
  _0x4ea96f["playsInline"] = !![];
  _0x4ea96f["preload"] = 'auto';
  _0x4ea96f['crossOrigin'] = 'anonymous';
  _0x4ea96f['style']["position"] = "fixed";
  _0x4ea96f["style"]["left"] = "-10000px";
  _0x4ea96f["style"]["top"] = "-10000px";
  _0x4ea96f['style']["width"] = "1px";
  _0x4ea96f["style"]["height"] = "1px";
  _0x4ea96f["style"]["opacity"] = '0';
  _0x40e6c8["body"]?.["appendChild"](_0x4ea96f);
  try {
    _0x4ea96f['src'] = _0x2110b2;
    try {
      _0x4ea96f["load"]?.();
    } catch {}
    const _0x5d55df = await waitForVideoFrame(_0x4ea96f, {
      'timeoutMs': 0x2710
    });
    if (!_0x5d55df) {
      throw new Error("video frame is not ready");
    }
    Number(_0x4ea96f["currentTime"] || 0x0) > 0.001 && (_0x4ea96f['currentTime'] = 0x0, await waitForSmartClipVideoEvent(_0x4ea96f, ["seeked", "timeupdate"], 0x1388));
    return await captureVideoFrameSnapshot(_0x4ea96f, {
      'fileNamePrefix': _0x56bb52
    });
  } finally {
    try {
      _0x4ea96f["pause"]?.();
      _0x4ea96f["removeAttribute"]?.("src");
      _0x4ea96f["load"]?.();
    } catch {}
    _0x4ea96f["remove"]?.();
  }
}
async function extractSmartClipVideoResultFirstFrame(_0xd7a6b7, _0x192a12, _0x566a50) {
  const _0x2cd67c = resolveSmartClipResultUrl(_0xd7a6b7, _0x192a12);
  if (!_0x2cd67c) {
    throw new Error("missing video segment url");
  }
  const _0x437713 = await captureSmartClipVideoFirstFrame(_0x2cd67c, "smart_clip_keyframe_" + (_0x566a50 + 0x1));
  return saveVideoFrameSnapshot(_0x437713, saveOutputBlob);
}
function emitSmartClipProgress(_0x10c26b, _0x3f5a6f) {
  if (typeof _0x10c26b !== "function") {
    return;
  }
  try {
    _0x10c26b(_0x3f5a6f);
  } catch {}
}
function getSmartClipStageText(_0x2b99b1) {
  if (_0x2b99b1 === "detect") {
    return videoClipText('smartClip.stages.detect');
  }
  if (_0x2b99b1 === "cut") {
    return videoClipText("smartClip.stages.cut");
  }
  if (_0x2b99b1 === "frame") {
    return videoClipText('smartClip.stages.frame');
  }
  return videoClipText("smartClip.stages.processing");
}
function buildSmartClipProgressPayload(_0x2238ac = {}) {
  const _0x42bd6b = Math["max"](0x0, Math['min'](0x1, Number(_0x2238ac['progress'] || 0x0)));
  const _0x3f4831 = Math["round"](_0x42bd6b * 0x64);
  const _0x3ce69e = Number(_0x2238ac["doneCount"] || 0x0);
  const _0x3954fb = Number(_0x2238ac['total'] || 0x0);
  const _0x14feea = String(_0x2238ac["stage"] || '');
  const _0x29199a = getSmartClipStageText(_0x14feea);
  return {
    'stage': _0x14feea,
    'stageText': _0x29199a,
    'progress': _0x42bd6b,
    'pct': _0x3f4831,
    'doneCount': _0x3ce69e,
    'total': _0x3954fb,
    'text': _0x3954fb > 0x0 ? videoClipText("smartClip.progressWithTotal", {
      'stage': _0x29199a,
      'done': _0x3ce69e,
      'total': _0x3954fb,
      'pct': _0x3f4831
    }) : videoClipText('smartClip.progressPercent', {
      'stage': _0x29199a,
      'pct': _0x3f4831
    })
  };
}
function pickPositiveNumber(..._0x26db1d) {
  for (const _0x5d90bb of _0x26db1d) {
    const _0x396caa = Number(_0x5d90bb);
    if (Number["isFinite"](_0x396caa) && _0x396caa > 0x0) {
      return _0x396caa;
    }
  }
  return 0x0;
}
function normalizeVideoClipReverseControl(_0x5a0056) {
  if (!_0x5a0056 || typeof _0x5a0056['onChange'] !== "function") {
    return null;
  }
  const _0x4f4fc7 = _0x5a0056["isReversed"] === !![];
  return {
    'isReversed': _0x4f4fc7,
    'materializedIsReversed': typeof _0x5a0056['materializedIsReversed'] === "boolean" ? _0x5a0056['materializedIsReversed'] : _0x4f4fc7,
    'pending': ![],
    'onChange': _0x5a0056["onChange"]
  };
}
function pickSelectedVideoItem(_0x480386) {
  const _0x4dbef3 = Array["isArray"](_0x480386?.['videos']) ? _0x480386["videos"] : [];
  if (!_0x4dbef3["length"]) {
    return null;
  }
  const _0x3ad2d7 = Number(_0x480386?.["mainVideoIndex"]);
  const _0x9e3c72 = Number["isFinite"](_0x3ad2d7) ? Math["max"](0x0, Math["trunc"](_0x3ad2d7)) : 0x0;
  return _0x4dbef3[Math["min"](_0x9e3c72, _0x4dbef3["length"] - 0x1)] || _0x4dbef3[0x0] || null;
}
const DIRECT_VIDEO_SOURCE_RE = /^(?:https?:|blob:|data:)/i;
const BLOCKED_VIDEO_SOURCE_RE = /^(?:file|javascript):/i;
function normalizeDirectVideoSource(_0x221bf0) {
  const _0x2f0dca = String(_0x221bf0 || '')["trim"]();
  if (!_0x2f0dca || BLOCKED_VIDEO_SOURCE_RE['test'](_0x2f0dca)) {
    return '';
  }
  const _0x31d3a6 = localPathToUrl(_0x2f0dca);
  if (_0x31d3a6) {
    return _0x31d3a6;
  }
  if (_0x2f0dca["startsWith"]('/') && !_0x2f0dca["startsWith"]('//')) {
    return _0x2f0dca;
  }
  return DIRECT_VIDEO_SOURCE_RE["test"](_0x2f0dca) ? _0x2f0dca : '';
}
export function resolveVideoClipSourceUrl(_0x1926f4) {
  if (!_0x1926f4) {
    return '';
  }
  const _0x16c567 = pickSelectedVideoItem(_0x1926f4);
  const _0x5caff8 = _0x16c567 ? [_0x16c567, _0x1926f4] : [_0x1926f4];
  for (const _0x3c3509 of _0x5caff8) {
    const _0x5e79c3 = resolveCanvasVideoUrl(_0x3c3509);
    if (_0x5e79c3) {
      return _0x5e79c3;
    }
    for (const _0x5881d7 of ["src", "videoUrl", "url", "resultUrl", "sourceUrl"]) {
      const _0x5f1608 = normalizeDirectVideoSource(_0x3c3509?.[_0x5881d7]);
      if (_0x5f1608) {
        return _0x5f1608;
      }
    }
  }
  return '';
}
export function buildVideoCutNodeMeta(_0x22fccc, _0x4574f1, _0xd058cb, _0x3b9d9e) {
  const _0x2c10bd = Number(_0x4574f1);
  const _0x1cbcd9 = Number(_0xd058cb);
  const _0x1af100 = Number["isFinite"](_0x2c10bd) && Number["isFinite"](_0x1cbcd9) && _0x1cbcd9 > _0x2c10bd ? _0x1cbcd9 - _0x2c10bd : 0x0;
  const _0x365653 = pickSelectedVideoItem(_0x22fccc);
  const _0x25c290 = pickPositiveNumber(_0x365653?.["videoDuration"], _0x365653?.["duration"], _0x22fccc?.["videoDuration"], _0x22fccc?.['duration']);
  const _0x14fda0 = pickPositiveNumber(_0x365653?.["videoFrameCount"], _0x365653?.["frameCount"], _0x22fccc?.["videoFrameCount"], _0x22fccc?.["frameCount"]);
  const _0x1d88d8 = pickPositiveNumber(_0x3b9d9e, _0x365653?.["videoFps"], _0x365653?.["fps"], _0x22fccc?.["videoFps"], _0x22fccc?.["fps"]) || (_0x14fda0 > 0x0 && _0x25c290 > 0x0 ? _0x14fda0 / _0x25c290 : 0x0);
  const _0x311440 = pickPositiveNumber(_0x365653?.["videoWidth"], _0x365653?.["width"], _0x22fccc?.["videoWidth"], _0x22fccc?.["selectedVideoWidth"]);
  const _0xe0704d = pickPositiveNumber(_0x365653?.["videoHeight"], _0x365653?.["height"], _0x22fccc?.["videoHeight"], _0x22fccc?.["selectedVideoHeight"]);
  const _0x579951 = {};
  if (_0x1af100 > 0x0) {
    _0x579951['videoDuration'] = _0x1af100;
  }
  if (_0x1d88d8 > 0x0) {
    _0x579951["videoFps"] = _0x1d88d8;
  }
  _0x1af100 > 0x0 && _0x1d88d8 > 0x0 && (_0x579951["videoFrameCount"] = Math["max"](0x1, Math["round"](_0x1af100 * _0x1d88d8)));
  if (_0x311440 > 0x0) {
    _0x579951["videoWidth"] = Math["round"](_0x311440);
  }
  if (_0xe0704d > 0x0) {
    _0x579951["videoHeight"] = Math["round"](_0xe0704d);
  }
  return _0x579951;
}
export function buildVideoCutNodePlaybackFields(_0x31c51c) {
  const _0xc3219e = pickResultLocalPath({
    'localPath': _0x31c51c
  });
  const _0x379a05 = localPathToUrl(_0xc3219e);
  return {
    'src': _0x379a05,
    'videoUrl': _0x379a05,
    'localPath': _0xc3219e,
    'originalLocalPath': _0xc3219e,
    'videoThumbSrc': _0x379a05
  };
}
function applyVideoCutThumbResultToNode(_0x40ce1c, _0x160b8f, _0x43de23 = {}) {
  const _0x4a10dd = String(_0x40ce1c || '')["trim"]();
  const _0x5ea190 = String(_0x160b8f || '')["trim"]();
  if (!_0x4a10dd || !_0x5ea190) {
    return;
  }
  const _0x4d8888 = String(_0x43de23["thumbUrl"] || _0x43de23["url"] || '')['trim']();
  const _0x3c2f1b = pickResultLocalPath(_0x43de23);
  if (!_0x4d8888 && !_0x3c2f1b) {
    return;
  }
  const _0x1d356b = a1605_0x3a192f['getState']()["nodes"]?.[_0x4a10dd];
  if (!_0x1d356b) {
    return;
  }
  const _0x3ac359 = resolveCanvasVideoUrl(_0x1d356b);
  if (_0x3ac359 && _0x3ac359 !== _0x5ea190) {
    return;
  }
  const _0x5281c8 = {
    'videoThumbSrc': _0x5ea190,
    'videoThumbUnavailableSource': ''
  };
  _0x4d8888 && !String(_0x1d356b["thumbUrl"] || '')['trim']() && (_0x5281c8["thumbUrl"] = _0x4d8888);
  _0x3c2f1b && !String(_0x1d356b["posterLocalPath"] || '')["trim"]() && (_0x5281c8["posterLocalPath"] = _0x3c2f1b);
  a1605_0x3a192f["updateNodeData"](_0x4a10dd, _0x5281c8);
}
function ensureVideoCutNodeThumb(_0x1dc147, _0x257b0b) {
  const _0x459ff8 = localPathToUrl(_0x257b0b);
  if (!_0x459ff8) {
    return;
  }
  fetchVideoFirstFrameThumbFromServer(_0x459ff8)["then"](_0x399d1c => applyVideoCutThumbResultToNode(_0x1dc147, _0x459ff8, _0x399d1c))["catch"](() => {});
}
export async function runSmartClipFromVideoNode({
  nodeId: _0xfe5cd7,
  options: _0x6ad3e4,
  onProgress: _0x164319,
  shouldContinue: _0x2f69d7
} = {}) {
  const _0x434118 = normalizeSmartClipRunOptions(_0x6ad3e4);
  const _0x2ca887 = String(_0xfe5cd7 || '')['trim']();
  const _0x11df9a = a1605_0x3a192f["getState"]()["nodes"];
  const _0x34df8c = _0x11df9a[_0x2ca887];
  if (!_0x34df8c) {
    throw new Error(videoClipText("errors.videoNodeMissing"));
  }
  const _0x8dc1c = localPathToUrl(_0x34df8c["localPath"]) || _0x34df8c["src"] || _0x34df8c["videoUrl"] || _0x34df8c["resultUrl"] || '';
  if (!_0x8dc1c) {
    throw new Error(videoClipText('errors.invalidSource'));
  }
  emitSmartClipProgress(_0x164319, {
    'stage': "prepare",
    'stageText': videoClipText('smartClip.stages.prepare'),
    'text': videoClipText("smartClip.preparing"),
    'outputMode': _0x434118['outputMode']
  });
  let _0x51a188;
  try {
    _0x51a188 = await runSmartClipJob({
      'src': _0x8dc1c,
      'options': _0x434118,
      'shouldContinue': _0x2f69d7,
      'onProgress': _0x24455a => {
        emitSmartClipProgress(_0x164319, {
          ...buildSmartClipProgressPayload(_0x24455a),
          'outputMode': _0x434118["outputMode"]
        });
      }
    });
  } catch (_0x137950) {
    if (_0x137950?.["code"] === 'endpoint_unavailable') {
      throw new Error(videoClipText("errors.smartClipEndpointMissing"));
    }
    if (_0x137950?.["code"] === "missing_job_id") {
      throw new Error(videoClipText("errors.startMissingJobId"));
    }
    if (_0x137950?.["code"] === "cancelled") {
      throw new Error(videoClipText("errors.exitedClipMode"));
    }
    throw _0x137950;
  }
  {
    const _0x3d8268 = _0x51a188["job"] || {};
    const _0x3d8f84 = _0x51a188["segments"];
    if (!_0x3d8f84["length"]) {
      return {
        'ok': ![],
        'reason': "no-segments",
        'nodeIds': [],
        'outputMode': _0x434118["outputMode"]
      };
    }
    const _0x487350 = a1605_0x3a192f["getState"]()['nodes'][_0x2ca887];
    if (!_0x487350) {
      throw new Error(videoClipText("errors.sourceNodeMissing"));
    }
    const _0x2d3810 = normalizeSmartClipOutputMode(_0x3d8268['outputMode'] || _0x434118['outputMode']);
    const _0xc3da3f = _0x2d3810 === SMART_CLIP_OUTPUT_MODE_KEYFRAMES;
    const _0x483449 = getAutoMediaSizeByShortSide(_0x487350["width"] || 0x200, _0x487350["height"] || 0x120);
    const {
      spacing: _0x24806a,
      direction: _0x4bb247,
      avoidOverlap: _0xadab5d
    } = getNodeSpawnPrefs();
    const {
      startX: _0x49be84,
      startY: _0x4921e9
    } = calcSpawnStartFromAnchor(_0x487350, _0x24806a, _0x4bb247);
    const _0x2369a1 = [];
    const _0x48b0dc = {
      ...(a1605_0x3a192f["getState"]()["nodes"] || {})
    };
    for (let _0x2a70c5 = 0x0; _0x2a70c5 < _0x3d8f84["length"]; _0x2a70c5++) {
      const _0x4847fb = _0x3d8f84[_0x2a70c5] || {};
      const _0x570853 = pickResultLocalPath(_0x4847fb);
      if (!_0x570853) {
        continue;
      }
      let _0x323a08 = _0x4847fb;
      let _0x5ab946 = _0x570853;
      if (_0xc3da3f && !isSmartClipImageResult(_0x4847fb, _0x570853)) {
        emitSmartClipProgress(_0x164319, {
          'stage': "frame",
          'stageText': videoClipText("smartClip.stages.frame"),
          'progress': _0x3d8f84["length"] > 0x0 ? _0x2a70c5 / _0x3d8f84['length'] : 0x0,
          'pct': _0x3d8f84['length'] > 0x0 ? Math["round"](_0x2a70c5 / _0x3d8f84['length'] * 0x64) : 0x0,
          'doneCount': _0x2a70c5,
          'total': _0x3d8f84['length'],
          'text': videoClipText("smartClip.extractingFrame", {
            'current': _0x2a70c5 + 0x1,
            'total': _0x3d8f84["length"]
          }),
          'outputMode': _0x2d3810
        });
        try {
          _0x323a08 = await extractSmartClipVideoResultFirstFrame(_0x4847fb, _0x570853, _0x2a70c5);
          _0x5ab946 = pickResultLocalPath(_0x323a08);
        } catch (_0xe49f42) {
          console["warn"]("[VideoClipController] smart clip keyframe fallback failed:", _0xe49f42);
          continue;
        }
        if (!_0x5ab946) {
          continue;
        }
      }
      const _0x1300b0 = normalizeSmartClipFps(_0x4847fb['fps'] || _0x434118["fps"]);
      const _0x643565 = Number(_0x4847fb['duration']) > 0x0 ? Number(_0x4847fb["duration"]) : 0x0;
      const _0xf2a77c = pickPositiveNumber(_0x323a08["width"], _0x323a08['imageWidth'], _0x323a08["originalWidth"], _0x487350['videoWidth'], _0x487350['selectedVideoWidth'], _0x487350["originalWidth"], _0x487350["width"], 0x200);
      const _0xa174b6 = pickPositiveNumber(_0x323a08["height"], _0x323a08["imageHeight"], _0x323a08["originalHeight"], _0x487350['videoHeight'], _0x487350["selectedVideoHeight"], _0x487350["originalHeight"], _0x487350["height"], 0x120);
      const _0x13f607 = _0xc3da3f ? getAutoMediaSizeByShortSide(_0xf2a77c, _0xa174b6) : _0x483449;
      const _0x2663e0 = _0xadab5d ? findAvailablePosition(_0x48b0dc, _0x49be84, _0x4921e9, _0x13f607["width"], _0x13f607["height"], _0x24806a, _0x4bb247) : {
        'x': _0x49be84,
        'y': _0x4921e9
      };
      const _0x26322a = generateId(_0xc3da3f ? "source-image-smart-frame" : "source-video-scene");
      const _0x13fddd = _0xc3da3f ? null : buildVideoCutNodePlaybackFields(_0x5ab946);
      const _0x25cd01 = _0xc3da3f ? buildSourceMediaNodePayload({
        'id': _0x26322a,
        'type': "source-image",
        'x': _0x2663e0['x'],
        'y': _0x2663e0['y'],
        'width': _0x13f607["width"],
        'height': _0x13f607["height"],
        'name': videoClipText('smartClip.keyframeNodeName', {
          'index': _0x2a70c5 + 0x1
        }),
        'src': localPathToUrl(_0x5ab946),
        'localPath': _0x5ab946,
        'originalLocalPath': _0x323a08["originalLocalPath"] || _0x5ab946,
        'displayLocalPath': _0x323a08["displayLocalPath"] || '',
        'thumbLocalPath': _0x323a08['thumbLocalPath'] || '',
        'fileName': _0x323a08["fileName"] || _0x4847fb["fileName"] || '',
        'naturalWidth': _0xf2a77c,
        'naturalHeight': _0xa174b6,
        'originalWidth': _0xf2a77c,
        'originalHeight': _0xa174b6,
        'needsAutoResize': ![],
        'fixedSize': !![]
      }) : buildSourceMediaNodePayload({
        'id': _0x26322a,
        'type': "source-video",
        'x': _0x2663e0['x'],
        'y': _0x2663e0['y'],
        'width': _0x13f607["width"],
        'height': _0x13f607['height'],
        'name': videoClipText("smartClip.segmentNodeName", {
          'index': _0x2a70c5 + 0x1
        }),
        ..._0x13fddd,
        'videoDuration': _0x643565 || undefined,
        'videoFps': _0x1300b0,
        'videoFrameCount': _0x643565 > 0x0 ? Math['max'](0x1, Math["round"](_0x643565 * _0x1300b0)) : undefined,
        'needsAutoResize': ![],
        'fixedSize': !![]
      });
      a1605_0x3a192f['addNode'](_0x25cd01);
      _0x48b0dc[_0x26322a] = _0x25cd01;
      _0x2369a1['push'](_0x26322a);
      !_0xc3da3f && ensureVideoCutNodeThumb(_0x26322a, _0x5ab946);
    }
    if (!_0x2369a1["length"]) {
      return {
        'ok': ![],
        'reason': _0xc3da3f ? "no-keyframes" : 'no-results',
        'nodeIds': [],
        'outputMode': _0x2d3810
      };
    }
    a1605_0x3a192f["setSelectedNodes"](_0x2369a1);
    commit();
    window["_triggerLocalCacheSave"]?.();
    return {
      'ok': !![],
      'nodeIds': _0x2369a1,
      'outputMode': _0x2d3810
    };
  }
}
export function runSmartClipKeyframeExtractionFromVideoNode({
  nodeId: _0x50ed09,
  options: _0x4772fe,
  onProgress: _0x5370a6,
  shouldContinue: _0x10b18e
} = {}) {
  return runSmartClipFromVideoNode({
    'nodeId': _0x50ed09,
    'options': {
      ...SMART_CLIP_KEYFRAME_DEFAULT_OPTIONS,
      ...(_0x4772fe && typeof _0x4772fe === "object" ? _0x4772fe : {}),
      'outputMode': SMART_CLIP_OUTPUT_MODE_KEYFRAMES
    },
    'onProgress': _0x5370a6,
    'shouldContinue': _0x10b18e
  });
}
const VideoClipController = {
  'active': ![],
  'nodeId': null,
  'anchorNodeId': null,
  'wrapperEl': null,
  'barEl': null,
  'trackEl': null,
  'selectionEl': null,
  'leftHandleEl': null,
  'rightHandleEl': null,
  'playheadEl': null,
  'labelEl': null,
  'cancelBtnEl': null,
  'reverseBtnEl': null,
  'confirmBtnEl': null,
  'thumbEls': null,
  'videoEl': null,
  'durationSec': 0x0,
  'startSec': 0x0,
  'endSec': 0x0,
  '_dragMode': null,
  '_dragOffsetPx': 0x0,
  '_onKeyDown': null,
  '_onDocClick': null,
  '_onLoadedMeta': null,
  '_onDurationChange': null,
  '_onPointerMove': null,
  '_onPointerUp': null,
  '_smartClipFps': SMART_CLIP_DEFAULT_FPS,
  '_smartClipMaxSegmentDrag': null,
  '_onSmartClipMaxSegmentDragMove': null,
  '_onSmartClipMaxSegmentDragUp': null,
  '_suppressSmartClipMaxSegmentClick': ![],
  '_retryRaf': 0x0,
  '_retryCount': 0x0,
  '_thumbToken': 0x0,
  '_sourceToken': 0x0,
  '_reverseRequestToken': 0x0,
  '_clipSessionToken': 0x0,
  '_playheadRaf': 0x0,
  '_rangeLoopSeekPending': ![],
  '_rangePlaybackSeq': 0x0,
  '_pendingPlaybackStartSec': null,
  '_hiddenEls': null,
  '_sourceOptions': null,
  '_reverseControl': null,
  '_msgInterval': null,
  '_msgEls': null,
  'init'(_0x36d332) {
    if (!_0x36d332) {
      return;
    }
    if (this["active"]) {
      this["exit"]({
        'silent': !![]
      });
    }
    this["_sourceOptions"] = null;
    this["_reverseControl"] = null;
    const _0x1d6c78 = a1605_0x3a192f['getState']()['nodes'][_0x36d332];
    if (!_0x1d6c78) {
      return;
    }
    this["_clipSessionToken"]++;
    this['active'] = !![];
    this["nodeId"] = _0x36d332;
    this["anchorNodeId"] = _0x36d332;
    this["_rangeLoopSeekPending"] = ![];
    this['_rangePlaybackSeq'] += 0x1;
    this["_pendingPlaybackStartSec"] = null;
    a1605_0x3a192f["setVideoClipState"]({
      'active': !![],
      'nodeId': _0x36d332
    });
    this["_retryCount"] = 0x0;
    this["_mountWhenReady"]();
  },
  'initForSource'(_0x14204c = {}) {
    const _0x44ff08 = _0x14204c['wrapperEl'];
    const _0x2714cc = localPathToUrl(_0x14204c["sourceLocalPath"]) || String(_0x14204c["sourceUrl"] || '')["trim"]();
    if (!_0x44ff08 || !_0x2714cc) {
      window["showToast"]?.(videoClipText("errors.invalidSource"), "warn");
      return ![];
    }
    if (this["active"]) {
      this['exit']({
        'silent': !![]
      });
    }
    this["_clipSessionToken"]++;
    this["active"] = !![];
    this['videoEl'] = _0x14204c["videoEl"] || null;
    this['nodeId'] = String(_0x14204c["anchorId"] || _0x14204c["nodeId"] || "video-source-clip");
    this['anchorNodeId'] = this["nodeId"];
    this["wrapperEl"] = _0x44ff08;
    this["durationSec"] = 0x0;
    this["startSec"] = Math["max"](0x0, Number(_0x14204c["initialStartSec"]) || 0x0);
    this["endSec"] = Math["max"](this['startSec'], Number(_0x14204c['initialEndSec']) || this["startSec"]);
    this["_rangeLoopSeekPending"] = ![];
    this['_rangePlaybackSeq'] += 0x1;
    this['_pendingPlaybackStartSec'] = null;
    this['_retryCount'] = 0x0;
    this["_sourceOptions"] = {
      ..._0x14204c,
      'sourceUrl': _0x2714cc,
      'dimMode': _0x14204c["dimMode"] === !![],
      'embedded': _0x14204c["embedded"] === !![]
    };
    !this['_sourceOptions']["embedded"] && a1605_0x3a192f['setVideoClipState']({
      'active': !![],
      'nodeId': this["nodeId"]
    });
    this['_reverseControl'] = normalizeVideoClipReverseControl(_0x14204c["reverseControl"]);
    !this["_sourceOptions"]["embedded"] && (this["_applyFrozenUI"](!![]), this["_applyDimMode"](this["_sourceOptions"]["dimMode"]));
    this['_createUI']();
    this["_bindEvents"]();
    this["_syncDurationAndDefaults"]();
    this["_render"]();
    return !![];
  },
  '_applyDimMode'(_0xb8923d) {
    const _0x50b363 = document['getElementById']("v2-wrap");
    if (_0x50b363) {
      if (_0xb8923d) {
        _0x50b363['classList']["add"]("is-video-clip-mode");
      } else {
        _0x50b363['classList']["remove"]("is-video-clip-mode");
      }
    }
    if (this["wrapperEl"]) {
      if (_0xb8923d) {
        this["wrapperEl"]["classList"]["add"]("is-video-clip-target");
      } else {
        this['wrapperEl']['classList']["remove"]('is-video-clip-target');
      }
    }
  },
  '_applyFrozenUI'(_0x437c49) {
    if (!this["wrapperEl"]) {
      return;
    }
    const _0x12dd35 = "is-video-clipping";
    if (_0x437c49) {
      this['wrapperEl']["classList"]["add"](_0x12dd35);
    } else {
      this["wrapperEl"]["classList"]["remove"](_0x12dd35);
    }
    this['_applyFrozenOverlaysHidden'](_0x437c49);
  },
  '_applyFrozenOverlaysHidden'(_0x5cb6b6) {
    if (!this['wrapperEl']) {
      return;
    }
    if (_0x5cb6b6) {
      if (Array["isArray"](this["_hiddenEls"]) && this['_hiddenEls']["length"]) {
        return;
      }
      const _0x20d964 = ['.video-controls', ".video-mute-btn", '.node-upload-hint', ".video-center-indicator", ".gen-video-center-indicator", '.multi-toggle-btn'];
      const _0x582aee = [];
      _0x20d964["forEach"](_0x507fd => {
        this["wrapperEl"]['querySelectorAll'](_0x507fd)['forEach'](_0x6672d8 => {
          _0x582aee["push"]({
            'el': _0x6672d8,
            'prevDisplay': _0x6672d8["style"]["display"]
          });
          _0x6672d8["style"]['display'] = "none";
        });
      });
      this["_hiddenEls"] = _0x582aee;
      return;
    }
    const _0x2577b0 = Array["isArray"](this["_hiddenEls"]) ? this["_hiddenEls"] : [];
    this['_hiddenEls'] = null;
    _0x2577b0["forEach"](({
      el: _0x56d789,
      prevDisplay: _0x1f4f95
    }) => {
      if (!_0x56d789 || !_0x56d789["isConnected"]) {
        return;
      }
      _0x56d789["style"]["display"] = _0x1f4f95 || '';
    });
  },
  '_mountWhenReady'() {
    const _0x1d0bd1 = this['nodeId'];
    const _0x22d66c = () => {
      if (!this["active"] || this["nodeId"] !== _0x1d0bd1) {
        return;
      }
      const _0x3bbcc9 = document["getElementById"](_0x1d0bd1);
      if (!_0x3bbcc9) {
        this["_retryCount"]++;
        if (this["_retryCount"] > 0xa) {
          this['exit']({
            'silent': !![]
          });
          return;
        }
        this['_retryRaf'] = requestAnimationFrame(_0x22d66c);
        return;
      }
      this["wrapperEl"] = _0x3bbcc9;
      this["_applyFrozenUI"](!![]);
      this['_applyDimMode'](!![]);
      this['_createUI']();
      this['_bindEvents']();
      this['_syncDurationAndDefaults']();
      this["_render"]();
    };
    this["_retryRaf"] = requestAnimationFrame(_0x22d66c);
  },
  '_createUI'() {
    if (!this["wrapperEl"]) {
      return;
    }
    this['wrapperEl']["querySelectorAll"]('.v2-video-clipbar')["forEach"](_0x2ff3a9 => _0x2ff3a9["remove"]());
    const _0x3ae86d = document['createElement']("div");
    _0x3ae86d['className'] = 'v2-video-clipbar';
    if (this["_sourceOptions"]) {
      _0x3ae86d["classList"]['add']("v2-video-source-clipbar");
    }
    this["_sourceOptions"]?.['embedded'] && _0x3ae86d['classList']["add"]('v2-video-clipbar--embedded');
    _0x3ae86d["addEventListener"]('pointerdown', _0x3a2b31 => _0x3a2b31['stopPropagation']());
    _0x3ae86d["addEventListener"]("click", _0x984a5c => _0x984a5c['stopPropagation']());
    _0x3ae86d["addEventListener"]("dblclick", _0x192ade => {
      _0x192ade["preventDefault"]();
      _0x192ade["stopPropagation"]();
    });
    if (this["_sourceOptions"]?.["embedded"]) {
      const _0x2aadd2 = document["createElement"]('div');
      _0x2aadd2["className"] = "v2-video-cliprow";
      const _0x107fed = createVideoRangeTimelineView({
        'documentRef': document
      });
      _0x2aadd2["appendChild"](_0x107fed["trackEl"]);
      _0x3ae86d["appendChild"](_0x2aadd2);
      this["wrapperEl"]['appendChild'](_0x3ae86d);
      this["barEl"] = _0x3ae86d;
      this["cancelBtnEl"] = null;
      this["reverseBtnEl"] = null;
      this["confirmBtnEl"] = null;
      this['trackEl'] = _0x107fed["trackEl"];
      this["selectionEl"] = _0x107fed["selectionEl"];
      this["leftHandleEl"] = _0x107fed["leftHandleEl"];
      this["rightHandleEl"] = _0x107fed["rightHandleEl"];
      this['playheadEl'] = _0x107fed["playheadEl"];
      this["labelEl"] = _0x107fed["labelEl"];
      this["thumbEls"] = _0x107fed['thumbEls'];
      this["_msgInterval"] = null;
      this["_msgEls"] = null;
      return;
    }
    const _0x2ec3c8 = document["createElement"]('button');
    _0x2ec3c8["type"] = "button";
    _0x2ec3c8["className"] = "v2-video-clipbtn cancel";
    _0x2ec3c8["title"] = videoClipText('controls.cancel');
    {
      const _0xcab034 = "http://www.w3.org/2000/svg";
      const _0x345369 = document["createElementNS"](_0xcab034, "svg");
      _0x345369["setAttribute"]("width", '20');
      _0x345369["setAttribute"]("height", '20');
      _0x345369["setAttribute"]("viewBox", "0 0 24 24");
      _0x345369["setAttribute"]("fill", "none");
      _0x345369["setAttribute"]('stroke', 'currentColor');
      _0x345369['setAttribute']("stroke-width", '2');
      const _0x2bbf4e = document["createElementNS"](_0xcab034, "path");
      _0x2bbf4e["setAttribute"]('d', "M18 6L6 18");
      const _0x98baf1 = document["createElementNS"](_0xcab034, "path");
      _0x98baf1['setAttribute']('d', 'M6\x206l12\x2012');
      _0x345369['appendChild'](_0x2bbf4e);
      _0x345369["appendChild"](_0x98baf1);
      _0x2ec3c8["appendChild"](_0x345369);
    }
    const _0x56a0f4 = document["createElement"]("button");
    _0x56a0f4['type'] = 'button';
    _0x56a0f4['className'] = "v2-video-clipbtn confirm";
    _0x56a0f4['title'] = videoClipText("controls.done");
    {
      const _0x3d5026 = "http://www.w3.org/2000/svg";
      const _0x5d0a71 = document['createElementNS'](_0x3d5026, "svg");
      _0x5d0a71["setAttribute"]('width', '24');
      _0x5d0a71["setAttribute"]("height", '24');
      _0x5d0a71['setAttribute']("viewBox", "0 0 24 24");
      _0x5d0a71["setAttribute"]("fill", "none");
      _0x5d0a71["setAttribute"]("stroke", "currentColor");
      _0x5d0a71['setAttribute']('stroke-width', "2.5");
      const _0x5415da = document['createElementNS'](_0x3d5026, "polyline");
      _0x5415da["setAttribute"]('points', "20 6 9 17 4 12");
      _0x5d0a71["appendChild"](_0x5415da);
      _0x56a0f4["appendChild"](_0x5d0a71);
    }
    let _0x33e100 = null;
    this['_reverseControl'] && (_0x33e100 = document["createElement"]("button"), _0x33e100["type"] = "button", _0x33e100["className"] = 'v2-video-clipbtn\x20reverse', _0x33e100['innerHTML'] = renderMediaClipReverseIcon({
      'className': 'v2-video-clip-reverse-icon'
    }));
    const _0x437cf8 = document["createElement"]("div");
    _0x437cf8["className"] = "v2-video-cliprow";
    const {
      trackEl: _0x5da54f,
      selectionEl: _0x4a73e4,
      leftHandleEl: _0x3bf4f3,
      rightHandleEl: _0x2b0776,
      playheadEl: _0x341635,
      labelEl: _0x2f635b,
      thumbEls: _0x4422d0
    } = createVideoRangeTimelineView({
      'documentRef': document
    });
    const _0x1f63f2 = document["createElement"]('div');
    _0x1f63f2["className"] = "v2-video-cliphelper-row";
    const _0x173389 = document["createElement"]("div");
    _0x173389["className"] = "v2-video-cliphelper-left";
    const _0x4bd5b5 = [{
      'html': "<span class=\"v2-video-cliphelperkbd\">Esc</span><span>" + clipHelperLabel("helper.cancel") + "</span>\n               <span style=\"display:flex;align-items:center;margin-left:4px;\">\n                 <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" ry=\"2\"></rect><path d=\"M6 8h.001\"></path><path d=\"M10 8h.001\"></path><path d=\"M14 8h.001\"></path><path d=\"M18 8h.001\"></path><path d=\"M8 12h.001\"></path><path d=\"M12 12h.001\"></path><path d=\"M16 12h.001\"></path><path d=\"M7 16h10\"></path></svg>\n               </span>"
    }, {
      'html': '<span\x20class=\x22v2-video-cliphelperkbd\x22>Space</span><span>' + clipHelperLabel("helper.rangePlayPause") + "</span>"
    }, {
      'html': "<span class=\"v2-video-cliphelperkbd\">←</span> <span class=\"v2-video-cliphelperkbd\">→</span> <span>" + clipHelperLabel('helper.moveSelectionByFrame') + "</span>"
    }, {
      'html': "<span class=\"v2-video-cliphelperkbd\">Shift</span> + <span class=\"v2-video-cliphelperkbd\">←</span>/<span class=\"v2-video-cliphelperkbd\">→</span> <span>" + clipHelperLabel("helper.moveSelectionByLargeStep", {
        'frames': 0xa
      }) + "</span>"
    }, {
      'html': '<span\x20class=\x22v2-video-cliphelperkbd\x22>I</span>/<span\x20class=\x22v2-video-cliphelperkbd\x22>O</span>\x20<span>' + clipHelperLabel("helper.setInOut") + "</span>"
    }, {
      'html': "<span class=\"v2-video-cliphelperkbd\">Ctrl</span> + <span class=\"v2-video-cliphelperkbd\">←</span>/<span class=\"v2-video-cliphelperkbd\">→</span> <span>" + clipHelperLabel("helper.fineTuneInPoint", {
        'frames': 0x1
      }) + "</span>"
    }, {
      'html': "<span class=\"v2-video-cliphelperkbd\">Alt</span> + <span class=\"v2-video-cliphelperkbd\">←</span>/<span class=\"v2-video-cliphelperkbd\">→</span> <span>" + clipHelperLabel("helper.fineTuneOutPoint", {
        'frames': 0x1
      }) + "</span>"
    }, {
      'html': "<span class=\"v2-video-cliphelperkbd\">" + clipHelperLabel("helper.wheelKey") + '</span><span>' + clipHelperLabel("helper.wheelMove") + "</span>"
    }, {
      'html': '<span\x20class=\x22v2-video-cliphelperkbd\x22>' + clipHelperLabel('helper.clickKey') + "</span><span>" + clipHelperLabel("helper.jumpPlayhead") + "</span>"
    }, {
      'html': '<span\x20class=\x22v2-video-cliphelperkbd\x22>' + clipHelperLabel("helper.doubleClickRangeKey") + '</span><span>' + clipHelperLabel("helper.resetDefaultRange", {
        'seconds': 0x3
      }) + "</span>"
    }];
    this["_msgEls"] = _0x4bd5b5['map']((_0x28d8a8, _0x458706) => {
      const _0x3ee074 = document["createElement"]("div");
      _0x3ee074["className"] = "v2-video-cliphelper-msg";
      if (_0x458706 !== 0x0) {
        _0x3ee074["classList"]["add"]("hide-down");
      }
      _0x3ee074['innerHTML'] = _0x28d8a8['html'];
      _0x173389["appendChild"](_0x3ee074);
      return _0x3ee074;
    });
    let _0x695f6f = 0x0;
    this["_msgInterval"] = setInterval(() => {
      if (!this["active"] || !this["_msgEls"]) {
        return;
      }
      const _0x4fc15c = this['_msgEls'][_0x695f6f];
      _0x695f6f = (_0x695f6f + 0x1) % this["_msgEls"]["length"];
      const _0x3e2e7d = this["_msgEls"][_0x695f6f];
      _0x4fc15c["classList"]["remove"]("hide-down");
      _0x4fc15c["classList"]["add"]('hide-up');
      _0x3e2e7d["classList"]['remove']("hide-up");
      _0x3e2e7d['classList']["remove"]('hide-down');
      setTimeout(() => {
        _0x4fc15c && _0x4fc15c["classList"]['contains']("hide-up") && (_0x4fc15c['classList']["remove"]("hide-up"), _0x4fc15c['classList']['add']("hide-down"));
      }, 0x12c);
    }, 0xfa0);
    this['_smartClipMode'] = this["_smartClipMode"] || "stable";
    this["_smartClipMaxSegments"] = normalizeSmartClipMaxSegments(this['_smartClipMaxSegments']);
    this["_smartClipFps"] = normalizeSmartClipFps(this["_smartClipFps"]);
    this["_smartClipOutputMode"] = normalizeSmartClipOutputMode(this['_smartClipOutputMode']);
    const _0x5ad8cd = document["createElement"]("div");
    _0x5ad8cd["className"] = 'v2-video-clip-actions';
    const _0xd8b4dc = document['createElement']("div");
    _0xd8b4dc['className'] = 'v2-video-clip-smartwrap';
    const _0x241bdf = document["createElement"]("button");
    _0x241bdf["className"] = "v2-video-clip-smartbtn";
    const _0x25d043 = '<svg\x20width=\x2214\x22\x20height=\x2214\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20stroke-linecap=\x22round\x22\x20stroke-linejoin=\x22round\x22><path\x20d=\x22M21\x2016V8a2\x202\x200\x200\x200-1-1.73l-7-4a2\x202\x200\x200\x200-2\x200l-7\x204A2\x202\x200\x200\x200\x203\x208v8a2\x202\x200\x200\x200\x201\x201.73l7\x204a2\x202\x200\x200\x200\x202\x200l7-4A2\x202\x200\x200\x200\x2021\x2016z\x22></path><polyline\x20points=\x223.27\x206.96\x2012\x2012.01\x2020.73\x206.96\x22></polyline><line\x20x1=\x2212\x22\x20y1=\x2222.08\x22\x20x2=\x2212\x22\x20y2=\x2212\x22></line></svg>';
    const _0x3d07ef = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><g style=\"animation:spin 1s linear infinite;transform-origin:50% 50%;transform-box:fill-box;\"><path d=\"M21 12a9 9 0 1 1-6.219-8.56\"/></g></svg>";
    const _0x5664dc = () => escapeClipHelperHtml(videoClipText('smartPanel.smartClipButton'));
    _0x241bdf["innerHTML"] = _0x25d043 + '\x20' + _0x5664dc();
    const _0x102b0f = document['createElement']("button");
    _0x102b0f['type'] = "button";
    _0x102b0f["className"] = "v2-video-clip-smartbtn v2-video-clip-framebtn";
    _0x102b0f['title'] = videoClipText("smartPanel.extractFrame");
    _0x102b0f["setAttribute"]("aria-label", videoClipText("smartPanel.extractFrame"));
    const _0x14d455 = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z\"></path><circle cx=\"12\" cy=\"13\" r=\"4\"></circle></svg>";
    _0x102b0f["innerHTML"] = _0x14d455;
    const _0x3ef6d3 = document['createElement']("div");
    _0x3ef6d3["className"] = "v2-video-clip-smartpanel";
    const _0x2f0dd8 = document["createElement"]('div');
    _0x2f0dd8['className'] = "v2-video-clip-smartpanel-title";
    _0x2f0dd8['textContent'] = videoClipText("smartPanel.title");
    const _0xade33 = document["createElement"]("div");
    _0xade33["className"] = 'v2-video-clip-smartpanel-row';
    const _0x2fef8d = document["createElement"]("div");
    _0x2fef8d['className'] = 'v2-video-clip-smartpanel-label';
    _0x2fef8d['textContent'] = videoClipText('smartPanel.output');
    const _0x14124b = document["createElement"]("span");
    _0x14124b["className"] = 'rh-tip';
    _0x14124b["setAttribute"]("data-tooltip", videoClipText("smartPanel.outputTip"));
    _0x14124b["textContent"] = '!';
    _0x2fef8d['appendChild'](_0x14124b);
    const _0x4060d4 = document["createElement"]('div');
    _0x4060d4["className"] = "v2-video-clip-modegroup v2-video-clip-outputgroup";
    const _0x1fc1de = document["createElement"]("button");
    _0x1fc1de["type"] = 'button';
    _0x1fc1de["className"] = 'v2-video-clip-modebtn';
    _0x1fc1de["dataset"]['outputMode'] = SMART_CLIP_OUTPUT_MODE_SEGMENTS;
    _0x1fc1de["textContent"] = videoClipText("smartPanel.outputSegments");
    const _0x434a5d = document["createElement"]("button");
    _0x434a5d['type'] = "button";
    _0x434a5d["className"] = "v2-video-clip-modebtn";
    _0x434a5d['dataset']['outputMode'] = SMART_CLIP_OUTPUT_MODE_KEYFRAMES;
    _0x434a5d["textContent"] = videoClipText("smartPanel.outputKeyframes");
    _0x4060d4["appendChild"](_0x1fc1de);
    _0x4060d4["appendChild"](_0x434a5d);
    _0xade33['appendChild'](_0x2fef8d);
    _0xade33['appendChild'](_0x4060d4);
    const _0xc5235c = document['createElement']("div");
    _0xc5235c["className"] = 'v2-video-clip-smartpanel-row';
    const _0x6c8f8e = document['createElement']("div");
    _0x6c8f8e["className"] = 'v2-video-clip-smartpanel-label';
    _0x6c8f8e["textContent"] = videoClipText('smartPanel.mode');
    const _0x2802a8 = document["createElement"]('span');
    _0x2802a8["className"] = "rh-tip";
    _0x2802a8["setAttribute"]('data-tooltip', videoClipText("smartPanel.modeTip"));
    _0x2802a8["textContent"] = '!';
    _0x6c8f8e['appendChild'](_0x2802a8);
    const _0x1e45c5 = document["createElement"]("div");
    _0x1e45c5["className"] = "v2-video-clip-modegroup";
    const _0x6c55dd = document['createElement']('button');
    _0x6c55dd['type'] = "button";
    _0x6c55dd["className"] = 'v2-video-clip-modebtn';
    _0x6c55dd["dataset"]["mode"] = "stable";
    _0x6c55dd["textContent"] = videoClipText("smartPanel.modeStable");
    const _0xbf9df5 = document["createElement"]('button');
    _0xbf9df5["type"] = "button";
    _0xbf9df5["className"] = 'v2-video-clip-modebtn';
    _0xbf9df5['dataset']["mode"] = "balanced";
    _0xbf9df5["textContent"] = videoClipText("smartPanel.modeBalanced");
    const _0x5172a3 = document["createElement"]("button");
    _0x5172a3['type'] = 'button';
    _0x5172a3['className'] = "v2-video-clip-modebtn";
    _0x5172a3["dataset"]["mode"] = 'sensitive';
    _0x5172a3['textContent'] = videoClipText('smartPanel.modeSensitive');
    _0x1e45c5["appendChild"](_0x6c55dd);
    _0x1e45c5["appendChild"](_0xbf9df5);
    _0x1e45c5["appendChild"](_0x5172a3);
    _0xc5235c["appendChild"](_0x6c8f8e);
    _0xc5235c["appendChild"](_0x1e45c5);
    const _0x5d8195 = document['createElement']("div");
    _0x5d8195["className"] = "v2-video-clip-smartpanel-row";
    const _0x4a636 = document["createElement"]('div');
    _0x4a636["className"] = "v2-video-clip-smartpanel-label";
    _0x4a636["textContent"] = videoClipText("smartPanel.fps");
    const _0x4f23e1 = document['createElement']("span");
    _0x4f23e1["className"] = "rh-tip";
    _0x4f23e1["setAttribute"]("data-tooltip", videoClipText('smartPanel.fpsTip'));
    _0x4f23e1["textContent"] = '!';
    _0x4a636["appendChild"](_0x4f23e1);
    const _0x2efef0 = document["createElement"]("div");
    _0x2efef0['className'] = "v2-video-clip-modegroup v2-video-clip-fpsgroup";
    const _0x332aee = SMART_CLIP_FPS_OPTIONS["map"](_0x4b4210 => {
      const _0x3aa66a = document["createElement"]("button");
      _0x3aa66a["type"] = 'button';
      _0x3aa66a["className"] = "v2-video-clip-modebtn v2-video-clip-fpsbtn";
      _0x3aa66a["dataset"]["fps"] = String(_0x4b4210);
      _0x3aa66a['textContent'] = videoClipText("smartPanel.fpsValue", {
        'fps': _0x4b4210
      });
      _0x2efef0["appendChild"](_0x3aa66a);
      return _0x3aa66a;
    });
    _0x5d8195['appendChild'](_0x4a636);
    _0x5d8195["appendChild"](_0x2efef0);
    const _0xf5fa2f = document["createElement"]("div");
    _0xf5fa2f['className'] = 'v2-video-clip-smartpanel-row';
    const _0x338e1c = document["createElement"]("div");
    _0x338e1c["className"] = "v2-video-clip-smartpanel-label";
    _0x338e1c["textContent"] = videoClipText('smartPanel.maxSegments');
    const _0x555df5 = document["createElement"]("span");
    _0x555df5['className'] = 'rh-tip';
    _0x555df5['setAttribute']("data-tooltip", videoClipText("smartPanel.maxSegmentsTip", {
      'max': SMART_CLIP_MAX_SEGMENTS
    }));
    _0x555df5["textContent"] = '!';
    _0x338e1c["appendChild"](_0x555df5);
    const _0xe365c7 = document["createElement"]('div');
    _0xe365c7["className"] = "v2-video-clip-maxsegwrap";
    const _0x102cb3 = document["createElement"]("div");
    _0x102cb3["className"] = "rh-stepper-value v2-video-clip-maxseg";
    _0x102cb3["setAttribute"]("role", "spinbutton");
    _0x102cb3["setAttribute"]("aria-label", videoClipText("smartPanel.maxSegmentsAria"));
    _0x102cb3['setAttribute']("aria-valuemin", String(SMART_CLIP_MIN_SEGMENTS));
    _0x102cb3["setAttribute"]("aria-valuemax", String(SMART_CLIP_MAX_SEGMENTS));
    _0x102cb3["tabIndex"] = 0x0;
    const _0x4c5df0 = document["createElement"]('span');
    _0x4c5df0["className"] = "v2-video-clip-maxseg-suffix";
    _0x4c5df0["textContent"] = videoClipText("smartPanel.segmentUnit");
    _0xe365c7['appendChild'](_0x102cb3);
    _0xe365c7["appendChild"](_0x4c5df0);
    _0xf5fa2f['appendChild'](_0x338e1c);
    _0xf5fa2f['appendChild'](_0xe365c7);
    const _0x443211 = document["createElement"]("div");
    _0x443211["className"] = "v2-video-clip-smartpanel-hint";
    _0x443211["textContent"] = videoClipText('smartPanel.hintDefault');
    const _0x3da577 = document["createElement"]("div");
    _0x3da577["className"] = "v2-video-clip-smartpanel-actions";
    const _0x16bb49 = document["createElement"]("button");
    _0x16bb49["type"] = "button";
    _0x16bb49["className"] = "v2-video-clip-panelbtn";
    _0x16bb49['textContent'] = videoClipText("controls.cancel");
    const _0x2c69b7 = document['createElement']("button");
    _0x2c69b7["type"] = "button";
    _0x2c69b7["className"] = 'v2-video-clip-panelbtn\x20primary';
    _0x2c69b7['textContent'] = videoClipText('controls.start');
    _0x3da577['appendChild'](_0x16bb49);
    _0x3da577["appendChild"](_0x2c69b7);
    _0x3ef6d3["appendChild"](_0x2f0dd8);
    _0x3ef6d3["appendChild"](_0xade33);
    _0x3ef6d3["appendChild"](_0xc5235c);
    _0x3ef6d3["appendChild"](_0x5d8195);
    _0x3ef6d3['appendChild'](_0xf5fa2f);
    _0x3ef6d3["appendChild"](_0x443211);
    _0x3ef6d3["appendChild"](_0x3da577);
    const _0x11d402 = [_0x1fc1de, _0x434a5d];
    const _0x308c8c = () => {
      const _0x580174 = normalizeSmartClipOutputMode(this["_smartClipOutputMode"]);
      this["_smartClipOutputMode"] = _0x580174;
      _0x11d402["forEach"](_0x33500d => {
        _0x33500d['classList']["toggle"]("is-active", _0x33500d["dataset"]['outputMode'] === _0x580174);
      });
      const _0x80f27b = _0x580174 === SMART_CLIP_OUTPUT_MODE_KEYFRAMES;
      _0x5d8195["classList"]["toggle"]('is-disabled', _0x80f27b);
      _0x332aee["forEach"](_0x48ecdb => {
        _0x48ecdb["disabled"] = _0x80f27b;
        _0x48ecdb["setAttribute"]('aria-disabled', _0x80f27b ? "true" : "false");
      });
      _0x443211["textContent"] = _0x80f27b ? videoClipText('smartPanel.hintKeyframes') : videoClipText('smartPanel.hintDefault');
      const _0x23a12b = this['_smartClipMode'] || "stable";
      [_0x6c55dd, _0xbf9df5, _0x5172a3]['forEach'](_0x375634 => {
        if (!_0x375634) {
          return;
        }
        if (_0x375634['dataset']["mode"] === _0x23a12b) {
          _0x375634["classList"]["add"]("is-active");
        } else {
          _0x375634['classList']["remove"]('is-active');
        }
      });
      const _0x591ee9 = normalizeSmartClipFps(this["_smartClipFps"]);
      this["_smartClipFps"] = _0x591ee9;
      _0x332aee["forEach"](_0x3077c9 => {
        _0x3077c9['classList']["toggle"]("is-active", Number(_0x3077c9["dataset"]["fps"]) === _0x591ee9);
      });
      const _0x45f14b = normalizeSmartClipMaxSegments(this['_smartClipMaxSegments']);
      this['_smartClipMaxSegments'] = _0x45f14b;
      _0x102cb3['textContent'] = String(_0x45f14b);
      _0x102cb3["setAttribute"]('aria-valuenow', String(_0x45f14b));
    };
    _0x308c8c();
    const _0x5527f8 = () => {
      if (!this['_smartClipMaxSegmentDrag']) {
        return;
      }
      this["_smartClipMaxSegmentDrag"]['el']?.["classList"]?.['remove']("is-dragging");
      this['_smartClipMaxSegmentDrag']["doc"]?.["removeEventListener"]?.('mousemove', this["_onSmartClipMaxSegmentDragMove"]);
      this["_smartClipMaxSegmentDrag"]["doc"]?.["removeEventListener"]?.("mouseup", this["_onSmartClipMaxSegmentDragUp"]);
      this['_smartClipMaxSegmentDrag'] = null;
    };
    const _0x4f4ac6 = _0x138035 => {
      this['_smartClipMaxSegments'] = normalizeSmartClipMaxSegments(_0x138035);
      _0x308c8c();
    };
    const _0x535c12 = () => {
      if (!_0x102cb3?.["isConnected"]) {
        return;
      }
      const _0x118cd1 = normalizeSmartClipMaxSegments(this["_smartClipMaxSegments"]);
      const _0x4e62b6 = document["createElement"]("input");
      _0x4e62b6["className"] = "rh-stepper-input v2-video-clip-maxseg-input";
      _0x4e62b6['type'] = "number";
      _0x4e62b6['min'] = String(SMART_CLIP_MIN_SEGMENTS);
      _0x4e62b6["max"] = String(SMART_CLIP_MAX_SEGMENTS);
      _0x4e62b6["step"] = '1';
      _0x4e62b6["value"] = String(_0x118cd1);
      let _0x20b7e3 = ![];
      const _0x35caff = _0x35cb68 => {
        if (_0x20b7e3) {
          return;
        }
        _0x20b7e3 = !![];
        _0x4f4ac6(_0x35cb68 ? _0x4e62b6['value'] : _0x118cd1);
        _0x4e62b6["replaceWith"](_0x102cb3);
        _0x308c8c();
      };
      _0x4e62b6["addEventListener"]("click", _0x5b9327 => _0x5b9327['stopPropagation']());
      _0x4e62b6['addEventListener']("mousedown", _0x578985 => _0x578985['stopPropagation']());
      _0x4e62b6["addEventListener"]("keydown", _0x38f021 => {
        _0x38f021["stopPropagation"]();
        if (_0x38f021["key"] === 'Enter') {
          _0x35caff(!![]);
        }
        if (_0x38f021["key"] === "Escape") {
          _0x35caff(![]);
        }
      });
      _0x4e62b6["addEventListener"]("blur", () => _0x35caff(!![]));
      _0x102cb3['replaceWith'](_0x4e62b6);
      _0x4e62b6['focus']();
      _0x4e62b6["select"]();
    };
    this["_onSmartClipMaxSegmentDragMove"] = _0x4a039f => {
      const _0x8334d5 = this["_smartClipMaxSegmentDrag"];
      if (!_0x8334d5) {
        return;
      }
      const _0x25783c = _0x4a039f["clientX"] - _0x8334d5['x'];
      const _0x2a7182 = Math['trunc'](_0x25783c / 0x6);
      const _0x49d51a = normalizeSmartClipMaxSegments(_0x8334d5["base"] + _0x2a7182);
      _0x49d51a !== _0x8334d5['last'] && (_0x8334d5["moved"] = !![], _0x8334d5['last'] = _0x49d51a, _0x4f4ac6(_0x49d51a));
    };
    this['_onSmartClipMaxSegmentDragUp'] = () => {
      const _0x1784a0 = this['_smartClipMaxSegmentDrag'];
      if (!_0x1784a0) {
        return;
      }
      _0x5527f8();
      _0x1784a0["moved"] && (this["_suppressSmartClipMaxSegmentClick"] = !![], _0x4f4ac6(_0x1784a0['last']));
    };
    const _0x162e08 = () => {
      _0x3ef6d3['classList']["remove"]("is-open");
      this['_onSmartClipDocDown'] && (document["removeEventListener"]("pointerdown", this["_onSmartClipDocDown"], !![]), this['_onSmartClipDocDown'] = null);
    };
    const _0x37d7aa = () => {
      if (_0x241bdf["dataset"]['loading'] === "true") {
        return;
      }
      _0x308c8c();
      _0x3ef6d3["classList"]['add']("is-open");
      !this["_onSmartClipDocDown"] && (this["_onSmartClipDocDown"] = _0x42c842 => {
        if (!this["active"]) {
          return;
        }
        const _0x338d7e = _0x42c842?.["target"];
        if (!_0x338d7e) {
          return;
        }
        if (_0xd8b4dc['contains'](_0x338d7e)) {
          return;
        }
        _0x162e08();
      }, document['addEventListener']("pointerdown", this["_onSmartClipDocDown"], !![]));
    };
    const _0x35782b = () => {
      if (_0x3ef6d3["classList"]['contains']("is-open")) {
        _0x162e08();
      } else {
        _0x37d7aa();
      }
    };
    const _0xd02d31 = _0x44a35b => {
      this['_smartClipMode'] = _0x44a35b;
      _0x308c8c();
    };
    const _0x2be254 = _0x357f73 => {
      this["_smartClipOutputMode"] = normalizeSmartClipOutputMode(_0x357f73);
      _0x308c8c();
    };
    const _0x2de5b7 = _0x1adeb5 => {
      this["_smartClipFps"] = normalizeSmartClipFps(_0x1adeb5);
      _0x308c8c();
    };
    _0x11d402["forEach"](_0x5056cc => {
      _0x5056cc["onclick"] = _0x4f4cb4 => {
        _0x4f4cb4["stopPropagation"]();
        _0x2be254(_0x5056cc["dataset"]["outputMode"]);
      };
    });
    [_0x6c55dd, _0xbf9df5, _0x5172a3]["forEach"](_0x107dde => {
      _0x107dde['onclick'] = _0x83a896 => {
        _0x83a896["stopPropagation"]();
        _0xd02d31(_0x107dde["dataset"]["mode"] || 'stable');
      };
    });
    _0x332aee["forEach"](_0x1c7439 => {
      _0x1c7439["onclick"] = _0x4bf63e => {
        _0x4bf63e["stopPropagation"]();
        _0x2de5b7(_0x1c7439["dataset"]["fps"]);
      };
    });
    _0x102cb3["onmousedown"] = _0x30bbe0 => {
      if (_0x30bbe0["button"] !== 0x0) {
        return;
      }
      _0x30bbe0['preventDefault']();
      _0x30bbe0['stopPropagation']();
      const _0x568e53 = document;
      const _0x43df9d = normalizeSmartClipMaxSegments(this['_smartClipMaxSegments']);
      _0x5527f8();
      this["_smartClipMaxSegmentDrag"] = {
        'x': _0x30bbe0["clientX"],
        'base': _0x43df9d,
        'last': _0x43df9d,
        'moved': ![],
        'el': _0x102cb3,
        'doc': _0x568e53
      };
      _0x102cb3["classList"]["add"]("is-dragging");
      _0x568e53["addEventListener"]("mousemove", this["_onSmartClipMaxSegmentDragMove"]);
      _0x568e53["addEventListener"]("mouseup", this["_onSmartClipMaxSegmentDragUp"]);
    };
    _0x102cb3["onclick"] = _0x3e9c4b => {
      _0x3e9c4b['stopPropagation']();
      if (this["_suppressSmartClipMaxSegmentClick"]) {
        this["_suppressSmartClipMaxSegmentClick"] = ![];
        return;
      }
      _0x535c12();
    };
    _0x102cb3["onkeydown"] = _0x186816 => {
      _0x186816["stopPropagation"]();
      if (_0x186816['key'] === 'Enter' || _0x186816["key"] === '\x20') {
        _0x186816["preventDefault"]();
        _0x535c12();
        return;
      }
      if (_0x186816["key"] === "ArrowRight" || _0x186816["key"] === "ArrowUp") {
        _0x186816["preventDefault"]();
        _0x4f4ac6(Number(this["_smartClipMaxSegments"]) + 0x1);
        return;
      }
      (_0x186816["key"] === "ArrowLeft" || _0x186816["key"] === "ArrowDown") && (_0x186816["preventDefault"](), _0x4f4ac6(Number(this["_smartClipMaxSegments"]) - 0x1));
    };
    _0x16bb49["onclick"] = _0x102379 => {
      _0x102379["stopPropagation"]();
      _0x162e08();
    };
    const _0x1fc32d = async ({
      mode: _0x17aba7,
      maxSegments: _0x2e89e9,
      fps: _0x318c1c,
      outputMode: _0x136f4e
    }) => {
      const _0x5301c9 = normalizeSmartClipOutputMode(_0x136f4e);
      const _0x36ae7c = _0x5301c9 === SMART_CLIP_OUTPUT_MODE_KEYFRAMES;
      _0x241bdf["dataset"]["loading"] = "true";
      _0x241bdf["disabled"] = !![];
      _0x241bdf["innerHTML"] = _0x3d07ef + '\x20' + escapeClipHelperHtml(videoClipText("smartClip.preparing"));
      window['showToast']?.(_0x36ae7c ? videoClipText("smartClip.startedKeyframes") : videoClipText("smartClip.startedSegments"), 'info');
      try {
        const _0x377cab = await runSmartClipFromVideoNode({
          'nodeId': this['anchorNodeId'],
          'options': {
            'mode': _0x17aba7,
            'maxSegments': _0x2e89e9,
            'fps': _0x318c1c,
            'outputMode': _0x5301c9
          },
          'shouldContinue': () => this["active"],
          'onProgress': _0x17becb => {
            if (!_0x241bdf?.["isConnected"] || !_0x17becb?.["text"]) {
              return;
            }
            _0x241bdf["innerHTML"] = _0x3d07ef + '\x20' + _0x17becb["text"];
          }
        });
        if (!_0x377cab?.['ok']) {
          window['showToast']?.(_0x377cab?.["reason"] === "no-segments" ? videoClipText("smartClip.noSegments") : _0x36ae7c ? videoClipText("smartClip.noKeyframes") : videoClipText("smartClip.noResults"), _0x377cab?.["reason"] === 'no-segments' ? "info" : "error");
          return;
        }
        window["showToast"]?.(_0x36ae7c ? videoClipText('smartClip.completeKeyframes', {
          'count': _0x377cab["nodeIds"]["length"]
        }) : videoClipText('smartClip.completeSegments', {
          'count': _0x377cab['nodeIds']["length"]
        }), "success");
        this["exit"]({
          'silent': !![]
        });
      } catch (_0x53480b) {
        const _0x5baa92 = _0x53480b instanceof Error ? _0x53480b["message"] : String(_0x53480b || videoClipText('errors.smartClipFailed'));
        window['showToast']?.(videoClipText("smartClip.failedWithError", {
          'error': _0x5baa92
        }), "error");
      } finally {
        _0x162e08();
        _0x241bdf && _0x241bdf['isConnected'] && (_0x241bdf["dataset"]["loading"] = "false", _0x241bdf['disabled'] = ![], _0x241bdf['innerHTML'] = _0x25d043 + '\x20' + _0x5664dc());
      }
    };
    _0x2c69b7['onclick'] = async _0x1e070b => {
      _0x1e070b["stopPropagation"]();
      _0x162e08();
      const _0x428024 = this["_smartClipMode"] || 'stable';
      const _0x27f848 = normalizeSmartClipMaxSegments(this['_smartClipMaxSegments']);
      const _0x3a569d = normalizeSmartClipFps(this["_smartClipFps"]);
      const _0x5e4c75 = normalizeSmartClipOutputMode(this['_smartClipOutputMode']);
      await _0x1fc32d({
        'mode': _0x428024,
        'maxSegments': _0x27f848,
        'fps': _0x3a569d,
        'outputMode': _0x5e4c75
      });
    };
    _0x241bdf["onclick"] = _0x58e3f8 => {
      _0x58e3f8['stopPropagation']();
      _0x35782b();
    };
    _0x102b0f["onclick"] = async _0x5e139 => {
      _0x5e139["stopPropagation"]();
      _0x162e08();
      if (_0x102b0f["dataset"]["loading"] === 'true') {
        return;
      }
      _0x102b0f["dataset"]['loading'] = "true";
      _0x102b0f["disabled"] = !![];
      _0x102b0f["innerHTML"] = _0x3d07ef;
      try {
        const _0x3c4ae2 = this['videoEl'] || this["_getVideoEl"]();
        await extractCurrentVideoFrameToImageNode({
          'videoEl': _0x3c4ae2,
          'anchorNodeId': this["anchorNodeId"],
          'fallbackDurationSec': this["_readDurationSec"](_0x3c4ae2) || this["durationSec"],
          'logPrefix': '[VideoClipController]'
        });
      } finally {
        _0x102b0f && _0x102b0f["isConnected"] && (_0x102b0f["dataset"]["loading"] = "false", _0x102b0f["disabled"] = ![], _0x102b0f["innerHTML"] = _0x14d455);
      }
    };
    _0xd8b4dc["appendChild"](_0x241bdf);
    _0xd8b4dc['appendChild'](_0x3ef6d3);
    _0x5ad8cd["appendChild"](_0xd8b4dc);
    _0x5ad8cd["appendChild"](_0x102b0f);
    _0x1f63f2['appendChild'](_0x173389);
    if (!this["_sourceOptions"]) {
      _0x1f63f2['appendChild'](_0x5ad8cd);
    }
    _0x437cf8["appendChild"](_0x2ec3c8);
    _0x437cf8["appendChild"](_0x5da54f);
    if (_0x33e100) {
      _0x437cf8["appendChild"](_0x33e100);
    }
    _0x437cf8["appendChild"](_0x56a0f4);
    _0x3ae86d['appendChild'](_0x437cf8);
    _0x3ae86d["appendChild"](_0x1f63f2);
    this["wrapperEl"]["appendChild"](_0x3ae86d);
    this["barEl"] = _0x3ae86d;
    this['cancelBtnEl'] = _0x2ec3c8;
    this["reverseBtnEl"] = _0x33e100;
    this["confirmBtnEl"] = _0x56a0f4;
    this["trackEl"] = _0x5da54f;
    this["selectionEl"] = _0x4a73e4;
    this["leftHandleEl"] = _0x3bf4f3;
    this["rightHandleEl"] = _0x2b0776;
    this["playheadEl"] = _0x341635;
    this["labelEl"] = _0x2f635b;
    this["thumbEls"] = _0x4422d0;
  },
  '_isSourceReverseEditLocked'() {
    const _0x2d141d = this['_reverseControl'];
    return Boolean(_0x2d141d && (_0x2d141d["pending"] === !![] || _0x2d141d["isReversed"] !== _0x2d141d["materializedIsReversed"]));
  },
  '_renderSourceReverseControl'() {
    const _0x2e0887 = this["_reverseControl"];
    const _0x298338 = this['reverseBtnEl'];
    const _0x4be1d1 = this["_isSourceReverseEditLocked"]();
    this['barEl'] && (this["barEl"]['classList']["toggle"]("is-reverse-locked", _0x4be1d1), this["barEl"]["setAttribute"]('aria-busy', String(_0x2e0887?.["pending"] === !![])));
    this["trackEl"] && this['trackEl']["setAttribute"]('aria-disabled', String(_0x4be1d1));
    if (!_0x2e0887 || !_0x298338) {
      return;
    }
    const _0x79b846 = resolveMediaClipReverseControlState(_0x2e0887);
    const _0x334819 = this['confirmBtnEl']?.["dataset"]?.["loading"] === "true";
    _0x298338["classList"]["toggle"]("is-active", _0x79b846["isReversed"]);
    _0x298338["classList"]["toggle"]("is-loading", _0x79b846["pending"]);
    _0x298338["disabled"] = _0x79b846["pending"] || _0x334819;
    _0x298338["dataset"]['tooltip'] = _0x79b846["label"];
    _0x298338["title"] = _0x79b846["label"];
    _0x298338["setAttribute"]('aria-label', _0x79b846["label"]);
    _0x298338['setAttribute']('aria-pressed', _0x79b846['ariaPressed']);
    _0x298338['setAttribute']("aria-busy", _0x79b846['ariaBusy']);
  },
  async '_replaceSourceAfterReverse'(_0x5aa4fc = {}) {
    const _0x22c246 = this['_sourceOptions'];
    if (!_0x22c246) {
      throw new Error("当前裁剪视频源已失效");
    }
    const _0x247868 = String(_0x5aa4fc["sourceLocalPath"] || '')["trim"]();
    const _0xb6905b = localPathToUrl(_0x247868) || String(_0x5aa4fc["sourceUrl"] || '')['trim']();
    if (!_0xb6905b) {
      throw new Error('倒放完成后未返回可用的视频源');
    }
    const _0x3ffde4 = Number(this['durationSec']) || 0x0;
    const _0x554ffc = {
      'startSec': this["startSec"],
      'endSec': this["endSec"]
    };
    const _0x21c1a9 = mirrorMediaClipRange({
      'startSec': this['startSec'],
      'endSec': this['endSec'],
      'durationSec': _0x3ffde4
    });
    this["startSec"] = _0x21c1a9["startSec"];
    this["endSec"] = _0x21c1a9["endSec"];
    this["videoEl"] && (this['_onLoadedMeta'] && this["videoEl"]["removeEventListener"]("loadedmetadata", this["_onLoadedMeta"]), this["_onDurationChange"] && this["videoEl"]["removeEventListener"]("durationchange", this['_onDurationChange']));
    this["_onLoadedMeta"] = null;
    this["_onDurationChange"] = null;
    this["_sourceOptions"] = {
      ..._0x22c246,
      'sourceLocalPath': _0x247868,
      'sourceUrl': _0xb6905b,
      'durationSec': _0x3ffde4,
      ...(_0x5aa4fc['posterUrl'] ? {
        'posterUrl': String(_0x5aa4fc["posterUrl"])["trim"]()
      } : {}),
      'sourceData': {
        ...(_0x22c246['sourceData'] || {}),
        'localPath': _0x247868,
        'videoDuration': _0x3ffde4
      }
    };
    try {
      await this["_syncDurationAndDefaults"]();
    } catch (_0xf2fd1b) {
      this["_sourceOptions"] = _0x22c246;
      this["startSec"] = _0x554ffc['startSec'];
      this['endSec'] = _0x554ffc['endSec'];
      if (this["active"]) {
        try {
          await this["_syncDurationAndDefaults"]();
        } catch (_0x11850d) {}
      }
      throw _0xf2fd1b;
    }
    if (!this["active"]) {
      return ![];
    }
    const _0xfe7c8e = this['videoEl'] || this["_getVideoEl"]();
    if (_0xfe7c8e) {
      try {
        _0xfe7c8e["currentTime"] = this["startSec"];
      } catch (_0x136cdf) {}
    }
    this["_render"]();
    return !![];
  },
  async '_toggleSourceReverse'() {
    const _0x1a5c46 = this["_reverseControl"];
    if (!this["active"] || !_0x1a5c46 || _0x1a5c46["pending"] === !![] || this['confirmBtnEl']?.["dataset"]?.["loading"] === "true") {
      return ![];
    }
    const _0x13102f = ++this["_reverseRequestToken"];
    const _0x1351f8 = {
      'isReversed': _0x1a5c46["isReversed"],
      'materializedIsReversed': _0x1a5c46["materializedIsReversed"]
    };
    const _0x4581e8 = !_0x1a5c46["isReversed"];
    let _0x1a301c = ![];
    this["_pauseRangePlaybackForRangeEdit"]();
    _0x1a5c46["isReversed"] = _0x4581e8;
    _0x1a5c46["pending"] = !![];
    this["_render"]();
    try {
      const _0x4e9c86 = await _0x1a5c46["onChange"](_0x4581e8);
      if (!this["active"] || _0x13102f !== this["_reverseRequestToken"] || _0x1a5c46 !== this["_reverseControl"]) {
        return ![];
      }
      _0x1a301c = !![];
      const _0x23cdbc = typeof _0x4e9c86?.["isReversed"] === "boolean" ? _0x4e9c86["isReversed"] : _0x4581e8;
      const _0x1239db = typeof _0x4e9c86?.["materializedIsReversed"] === "boolean" ? _0x4e9c86["materializedIsReversed"] : _0x4e9c86?.['ok'] === ![] ? _0x1351f8["materializedIsReversed"] : _0x23cdbc;
      _0x1a5c46["isReversed"] = _0x23cdbc;
      if (_0x4e9c86?.['ok'] === ![]) {
        _0x1a5c46['materializedIsReversed'] = _0x1351f8["materializedIsReversed"];
        !_0x4e9c86?.["suppressToast"] && _0x4e9c86?.["error"] && window["showToast"]?.(String(_0x4e9c86["error"]), "error");
        return ![];
      }
      if (_0x23cdbc !== _0x1239db) {
        _0x1a5c46["materializedIsReversed"] = _0x1239db;
        return ![];
      }
      _0x1239db !== _0x1351f8["materializedIsReversed"] && (await this["_replaceSourceAfterReverse"](_0x4e9c86));
      _0x1a5c46['materializedIsReversed'] = _0x1239db;
      return !![];
    } catch (_0x424d8c) {
      this["active"] && _0x13102f === this["_reverseRequestToken"] && _0x1a5c46 === this["_reverseControl"] && (!_0x1a301c && (_0x1a5c46["isReversed"] = _0x1351f8["isReversed"]), _0x1a5c46["materializedIsReversed"] = _0x1351f8["materializedIsReversed"], window["showToast"]?.(_0x424d8c?.['message'] || "视频倒放失败，请重试。", "error"));
      return ![];
    } finally {
      this["active"] && _0x13102f === this['_reverseRequestToken'] && _0x1a5c46 === this["_reverseControl"] && (_0x1a5c46['pending'] = ![], this["_render"]());
    }
  },
  '_bindEvents'() {
    if (!this["barEl"]) {
      return;
    }
    const _0x35f8fe = resolveVideoClipSelectionBodyCursor(this["_sourceOptions"]?.["selectionBodyCursor"]);
    if (this["selectionEl"]) {
      this["selectionEl"]["style"]["cursor"] = _0x35f8fe;
    }
    this['cancelBtnEl']?.['addEventListener']("click", _0x5b8166 => {
      _0x5b8166['stopPropagation']();
      this["exit"]();
    });
    this['confirmBtnEl']?.['addEventListener']("click", _0x54c443 => {
      _0x54c443["stopPropagation"]();
      this["_confirm"]();
    });
    this["reverseBtnEl"]?.["addEventListener"]("click", _0x5b2f6b => {
      _0x5b2f6b["stopPropagation"]();
      void this["_toggleSourceReverse"]();
    });
    const _0x3243d6 = _0xaa5a0f => {
      if (!this['trackEl'] || !this['active'] || this["_dragMode"] || this["_isSourceReverseEditLocked"]()) {
        return;
      }
      const _0x42dd9e = _0xaa5a0f["clientX"];
      const _0x8caf10 = this["selectionEl"]["getBoundingClientRect"]();
      const _0x24debd = 0x14;
      const _0x520052 = Math['abs'](_0x42dd9e - _0x8caf10['left']) < _0x24debd;
      const _0x20a5dd = Math['abs'](_0x42dd9e - _0x8caf10["right"]) < _0x24debd;
      if (_0x520052) {
        this["leftHandleEl"]["classList"]["add"]("hover-active");
        this["rightHandleEl"]["classList"]["remove"]("hover-active");
        this["selectionEl"]["style"]['cursor'] = "var(--resize-ew-cursor)";
      } else {
        _0x20a5dd ? (this["rightHandleEl"]["classList"]["add"]("hover-active"), this["leftHandleEl"]["classList"]["remove"]("hover-active"), this["selectionEl"]['style']["cursor"] = "var(--resize-ew-cursor)") : (this["leftHandleEl"]["classList"]['remove']("hover-active"), this["rightHandleEl"]["classList"]["remove"]("hover-active"), this['selectionEl']["style"]["cursor"] = _0x35f8fe);
      }
    };
    this["trackEl"]?.["addEventListener"]("pointermove", _0x3243d6);
    const _0xe68a48 = 0x1e;
    const _0x8c18be = _0x3843d8 => Number(_0x3843d8 || 0x1) / _0xe68a48 * 0x1;
    const _0x3c4825 = () => {
      const _0xdbd59b = this["durationSec"];
      if (!Number["isFinite"](_0xdbd59b) || _0xdbd59b <= 0x0) {
        return 0.1;
      }
      return Math["min"](0.1, _0xdbd59b);
    };
    const _0x5a0c73 = (_0x57d589, _0x129ebb, _0x22ad1a) => Math["max"](_0x129ebb, Math["min"](_0x22ad1a, _0x57d589));
    const _0x5c47d5 = _0x5a3482 => {
      if (!this["trackEl"] || !this['active']) {
        return;
      }
      const _0xc228e9 = this["durationSec"];
      if (!Number["isFinite"](_0xc228e9) || _0xc228e9 <= 0x0) {
        return;
      }
      const _0x5d2e22 = this["videoEl"] || this["_getVideoEl"]();
      if (!_0x5d2e22) {
        return;
      }
      const _0x1876ef = this["trackEl"]["getBoundingClientRect"]();
      if (!_0x1876ef["width"]) {
        return;
      }
      const _0x2a4948 = _0x5a3482 - _0x1876ef["left"];
      const _0x1faf1b = _0x5a0c73(_0x2a4948 / _0x1876ef['width'], 0x0, 0x1);
      const _0x20015a = _0x1faf1b * _0xc228e9;
      const _0x2247c8 = Math['max'](0x0, _0xc228e9 - 0.001);
      const _0x4cbb4a = _0x5a0c73(_0x20015a, 0x0, _0x2247c8);
      this["_pauseRangePlaybackForRangeEdit"](_0x5d2e22);
      this['_pendingPlaybackStartSec'] = _0x4cbb4a;
      try {
        _0x5d2e22["currentTime"] = _0x4cbb4a;
      } catch (_0x1264ed) {}
      this['_renderPlayhead']();
    };
    const _0x4123bc = () => {
      const _0x1dc948 = this['videoEl'] || this["_getVideoEl"]();
      if (!_0x1dc948) {
        return;
      }
      if (!_0x1dc948["paused"]) {
        return;
      }
      const _0x4f2bc7 = Number(_0x1dc948["currentTime"]) || 0x0;
      if (_0x4f2bc7 >= this["startSec"] && _0x4f2bc7 <= this["endSec"]) {
        return;
      }
      try {
        _0x1dc948["currentTime"] = this['startSec'];
      } catch (_0x2f3d7e) {}
    };
    const _0x991833 = (_0x338548, _0x4043c2) => {
      const _0xa22d8d = this["durationSec"];
      if (!Number["isFinite"](_0xa22d8d) || _0xa22d8d <= 0x0) {
        return;
      }
      const _0x47e874 = this["_pauseRangePlaybackForRangeEdit"]();
      const _0x1bad33 = _0x8c18be(_0x4043c2) * (_0x338548 >= 0x0 ? 0x1 : -0x1);
      const _0x1a85ca = _0x3c4825();
      const _0x483f6a = Math['max'](_0x1a85ca, this['endSec'] - this["startSec"]);
      let _0x1bfbc1 = this['startSec'] + _0x1bad33;
      let _0x1f70f7 = this["endSec"] + _0x1bad33;
      _0x1bfbc1 < 0x0 && (_0x1bfbc1 = 0x0, _0x1f70f7 = _0x483f6a);
      _0x1f70f7 > _0xa22d8d && (_0x1f70f7 = _0xa22d8d, _0x1bfbc1 = Math["max"](0x0, _0xa22d8d - _0x483f6a));
      this["startSec"] = _0x1bfbc1;
      this["endSec"] = _0x1f70f7;
      if (_0x47e874) {
        try {
          _0x47e874["currentTime"] = _0x1bfbc1;
        } catch (_0x14b6da) {}
      } else {
        _0x4123bc();
      }
      this["_render"]();
    };
    const _0x138dbf = _0x47fd61 => {
      const _0x5b1476 = this['durationSec'];
      if (!Number["isFinite"](_0x5b1476) || _0x5b1476 <= 0x0) {
        return;
      }
      const _0x2665a9 = this["_pauseRangePlaybackForRangeEdit"]();
      const _0x12f34d = _0x8c18be(0x1) * (_0x47fd61 >= 0x0 ? 0x1 : -0x1);
      const _0x3ce176 = _0x3c4825();
      const _0x59d7a4 = Math['max'](0x0, this['endSec'] - _0x3ce176);
      this["startSec"] = _0x5a0c73(this['startSec'] + _0x12f34d, 0x0, _0x59d7a4);
      if (_0x2665a9) {
        try {
          _0x2665a9['currentTime'] = this["startSec"];
        } catch (_0x46c872) {}
      }
      this["_render"]();
    };
    const _0x1e0926 = _0x466622 => {
      const _0x52c247 = this["durationSec"];
      if (!Number["isFinite"](_0x52c247) || _0x52c247 <= 0x0) {
        return;
      }
      const _0x3c5642 = this["_pauseRangePlaybackForRangeEdit"]();
      const _0x2547e7 = _0x8c18be(0x1) * (_0x466622 >= 0x0 ? 0x1 : -0x1);
      const _0x196b3d = _0x3c4825();
      const _0x1efdcb = Math["min"](_0x52c247, this['startSec'] + _0x196b3d);
      this["endSec"] = _0x5a0c73(this["endSec"] + _0x2547e7, _0x1efdcb, _0x52c247);
      if (_0x3c5642) {
        try {
          _0x3c5642["currentTime"] = this['endSec'];
        } catch (_0x5c4184) {}
      }
      this['_render']();
    };
    const _0x2c27e8 = _0x4b120a => {
      const _0x273b3c = this["durationSec"];
      if (!Number['isFinite'](_0x273b3c) || _0x273b3c <= 0x0) {
        return;
      }
      const _0x2584f3 = this["videoEl"] || this["_getVideoEl"]();
      if (!_0x2584f3) {
        return;
      }
      this["_pauseRangePlaybackForRangeEdit"](_0x2584f3);
      let _0x324567 = Number(_0x2584f3["currentTime"]) || 0x0;
      _0x324567 = _0x5a0c73(_0x324567, 0x0, _0x273b3c);
      const _0x11d24e = _0x3c4825();
      if (_0x4b120a === 'in') {
        const _0x316f67 = Math["max"](0x0, this["endSec"] - _0x11d24e);
        this["startSec"] = _0x5a0c73(_0x324567, 0x0, _0x316f67);
      } else {
        const _0x7722d3 = Math["min"](_0x273b3c, this["startSec"] + _0x11d24e);
        this["endSec"] = _0x5a0c73(_0x324567, _0x7722d3, _0x273b3c);
      }
      this["_render"]();
    };
    const _0x4455bd = _0x288a79 => {
      if (!this["trackEl"] || !this["active"] || this["_isSourceReverseEditLocked"]()) {
        return;
      }
      const _0x138c73 = _0x288a79["target"]['closest'](".v2-video-cliphandle");
      const _0x2db36f = !!_0x288a79['target']['closest'](".v2-video-clipselection");
      const _0x5c38a7 = this["trackEl"]["getBoundingClientRect"]();
      if (!_0x5c38a7["width"]) {
        return;
      }
      const _0x17a5a7 = _0x288a79["clientX"];
      const _0x51b235 = this["selectionEl"]["getBoundingClientRect"]();
      const _0x18d208 = 0x14;
      const _0x2cddc9 = Math["abs"](_0x17a5a7 - _0x51b235["left"]) < _0x18d208;
      const _0x38487a = Math["abs"](_0x17a5a7 - _0x51b235['right']) < _0x18d208;
      if (_0x2cddc9 || _0x138c73 && _0x138c73["dataset"]["handle"] === "left") {
        this["_dragMode"] = 'left';
        this["leftHandleEl"]["classList"]["add"]("hover-active");
      } else {
        if (_0x38487a || _0x138c73 && _0x138c73["dataset"]["handle"] === "right") {
          this['_dragMode'] = "right";
          this['rightHandleEl']["classList"]["add"]("hover-active");
        } else {
          _0x2db36f ? this["_dragMode"] = "move" : this['_dragMode'] = "scrub";
        }
      }
      if (this["_dragMode"] === "move") {
        const _0x1efad5 = this["selectionEl"]["getBoundingClientRect"]();
        this['_dragOffsetPx'] = _0x288a79["clientX"] - _0x1efad5['left'];
      } else {
        this["_dragOffsetPx"] = 0x0;
      }
      _0x288a79["preventDefault"]();
      _0x288a79["stopPropagation"]();
      const _0x67faa4 = Number(_0x288a79["clientX"] || 0x0);
      let _0x5c9b6a = ![];
      if (this["_dragMode"] === "scrub") {
        _0x5c47d5(_0x288a79["clientX"]);
      } else {
        if (this["_dragMode"] !== "move") {
          this["_handleDragAtClientX"](_0x288a79["clientX"]);
        }
      }
      this["_onPointerMove"] = _0xba68c2 => {
        if (!this["active"] || !this["trackEl"]) {
          return;
        }
        _0xba68c2["preventDefault"]();
        _0xba68c2["stopPropagation"]();
        const _0x3043bc = Number(_0xba68c2["clientX"] || 0x0);
        if (this["_dragMode"] === "scrub") {
          _0x5c47d5(_0x3043bc);
          return;
        }
        if (this["_dragMode"] === 'move') {
          if (!_0x5c9b6a && Math["abs"](_0x3043bc - _0x67faa4) <= 0x2) {
            return;
          }
          _0x5c9b6a = !![];
        }
        this["_handleDragAtClientX"](_0x3043bc);
      };
      this["_onPointerUp"] = _0x5ccf4e => {
        if (!this["active"]) {
          return;
        }
        _0x5ccf4e["preventDefault"]();
        _0x5ccf4e["stopPropagation"]();
        const _0x1247cc = this["_dragMode"];
        const _0x3e016b = shouldVideoClipSelectionPointerUpSeek(_0x1247cc, _0x5c9b6a);
        const _0xc8da2a = Number['isFinite'](Number(_0x5ccf4e["clientX"])) ? Number(_0x5ccf4e["clientX"]) : _0x67faa4;
        window["removeEventListener"]("pointermove", this['_onPointerMove'], !![]);
        window["removeEventListener"]("pointerup", this['_onPointerUp'], !![]);
        this["_dragMode"] = null;
        this['_dragOffsetPx'] = 0x0;
        this["leftHandleEl"]?.["classList"]['remove']("hover-active");
        this['rightHandleEl']?.["classList"]['remove']('hover-active');
        this["_onPointerMove"] = null;
        this["_onPointerUp"] = null;
        if (_0x3e016b) {
          _0x5c47d5(_0xc8da2a);
        } else {
          this["_render"]();
        }
      };
      window["addEventListener"]('pointermove', this['_onPointerMove'], !![]);
      window["addEventListener"]('pointerup', this["_onPointerUp"], !![]);
    };
    this["trackEl"]?.["addEventListener"]("pointerdown", _0x4455bd);
    this['trackEl']?.['addEventListener']("wheel", _0x257aee => {
      if (!this["active"] || this['_isSourceReverseEditLocked']()) {
        return;
      }
      _0x257aee["preventDefault"]();
      _0x257aee["stopPropagation"]();
      const _0x46b2c8 = Number(_0x257aee["deltaX"]) || 0x0;
      const _0x532863 = Number(_0x257aee["deltaY"]) || 0x0;
      const _0x242819 = Math["abs"](_0x46b2c8) > Math["abs"](_0x532863) ? _0x46b2c8 : _0x532863;
      if (!_0x242819) {
        return;
      }
      const _0x21b81e = _0x242819 > 0x0 ? 0x1 : -0x1;
      if (_0x257aee["ctrlKey"] || _0x257aee["metaKey"]) {
        _0x138dbf(_0x21b81e);
      } else {
        if (_0x257aee['altKey']) {
          _0x1e0926(_0x21b81e);
        } else {
          const _0x3d8d1e = _0x257aee["shiftKey"] ? 0xa : 0x1;
          _0x991833(_0x21b81e, _0x3d8d1e);
        }
      }
    }, {
      'passive': ![]
    });
    this["selectionEl"]?.["addEventListener"]('dblclick', _0x10c7ea => {
      if (!this["active"] || this["_isSourceReverseEditLocked"]()) {
        return;
      }
      _0x10c7ea["preventDefault"]();
      _0x10c7ea['stopPropagation']();
      const _0x2ef904 = this['durationSec'];
      if (!_0x2ef904 || !Number["isFinite"](_0x2ef904) || _0x2ef904 <= 0x0) {
        return;
      }
      const _0x3cc79c = this["selectionEl"]["getBoundingClientRect"]();
      const _0x13f091 = _0x10c7ea["clientX"];
      const _0x2470e7 = 0x18;
      if (_0x13f091 - _0x3cc79c["left"] < _0x2470e7 || _0x3cc79c["right"] - _0x13f091 < _0x2470e7) {
        return;
      }
      const _0xceac5d = Math["min"](0x3, _0x2ef904);
      const _0x51bbf9 = (this['startSec'] + this["endSec"]) / 0x2;
      const _0x4b8b7f = Math['max'](0x0, Math["min"](_0x2ef904 - _0xceac5d, _0x51bbf9 - _0xceac5d / 0x2));
      const _0x3bf1e6 = this["_pauseRangePlaybackForRangeEdit"]();
      this["startSec"] = _0x4b8b7f;
      this["endSec"] = _0x4b8b7f + _0xceac5d;
      if (_0x3bf1e6 && _0x3bf1e6["paused"]) {
        _0x3bf1e6['currentTime'] = this["startSec"];
      }
      this["_render"]();
    });
    this['_onKeyDown'] = _0x1b42d0 => {
      if (!this["active"]) {
        return;
      }
      const _0x5394d7 = _0x1b42d0["target"];
      if (_0x5394d7?.['isContentEditable'] || ['INPUT', 'TEXTAREA', "SELECT"]["includes"](String(_0x5394d7?.["tagName"] || ''))) {
        return;
      }
      if (_0x1b42d0['key'] === "Escape") {
        if (this["_sourceOptions"]?.["embedded"]) {
          this['_sourceOptions']?.['onEscape']?.();
          return;
        }
        _0x1b42d0["preventDefault"]();
        this["exit"]();
        return;
      }
      if (this["_isSourceReverseEditLocked"]()) {
        return;
      }
      if (_0x1b42d0['key'] === '\x20' || _0x1b42d0["code"] === "Space") {
        this["_handlePlaybackShortcutKey"](_0x1b42d0);
        return;
      }
      if (_0x1b42d0['key'] === 'i' || _0x1b42d0["key"] === 'I') {
        _0x1b42d0["preventDefault"]();
        _0x2c27e8('in');
        return;
      }
      if (_0x1b42d0["key"] === 'o' || _0x1b42d0['key'] === 'O') {
        _0x1b42d0["preventDefault"]();
        _0x2c27e8("out");
        return;
      }
      if (_0x1b42d0["key"] === "ArrowLeft" || _0x1b42d0["key"] === "ArrowRight") {
        _0x1b42d0["preventDefault"]();
        const _0x1a0ea0 = _0x1b42d0["key"] === "ArrowRight" ? 0x1 : -0x1;
        if (_0x1b42d0['ctrlKey'] || _0x1b42d0["metaKey"]) {
          _0x138dbf(_0x1a0ea0);
          return;
        }
        if (_0x1b42d0["altKey"]) {
          _0x1e0926(_0x1a0ea0);
          return;
        }
        const _0x4cfea3 = _0x1b42d0["shiftKey"] ? 0xa : 0x1;
        _0x991833(_0x1a0ea0, _0x4cfea3);
      }
    };
    window["addEventListener"]('keydown', this["_onKeyDown"], !![]);
    this['_onDocClick'] && (document["removeEventListener"]("pointerdown", this["_onDocClick"], !![]), this["_onDocClick"] = null);
    !this["_sourceOptions"]?.["embedded"] && (this["_onDocClick"] = _0xa7235d => {
      if (!this["active"] || !this["barEl"]) {
        return;
      }
      if (this["barEl"]["contains"](_0xa7235d["target"])) {
        return;
      }
      this["exit"]({
        'silent': !![],
        'reason': "dismiss"
      });
    }, document['addEventListener']("pointerdown", this["_onDocClick"], !![]));
  },
  '_getVideoEl'() {
    if (!this["wrapperEl"]) {
      return null;
    }
    if (this["_sourceOptions"] && this['videoEl']) {
      return this["videoEl"];
    }
    const _0xe78bcd = this["_resolveActiveVideoData"]();
    this["videoEl"] = resolveNodeVideoElement(this["wrapperEl"], _0xe78bcd?.["mainVideoIndex"]);
    return this["videoEl"];
  },
  '_getVideoElementSource'(_0x3daf1a) {
    return String(_0x3daf1a?.['getAttribute']?.('src') || _0x3daf1a?.['currentSrc'] || _0x3daf1a?.["src"] || '')["trim"]();
  },
  '_setClipMediaKeepAlive'(_0x31873d, _0x44e240) {
    if (!_0x31873d?.['dataset']) {
      return;
    }
    if (_0x44e240) {
      _0x31873d['dataset']['desktopMediaKeepAlive'] = "video-clip";
      return;
    }
    _0x31873d['dataset']["desktopMediaKeepAlive"] === 'video-clip' && delete _0x31873d["dataset"]["desktopMediaKeepAlive"];
  },
  '_readDurationSec'(_0x16048f) {
    if (!_0x16048f) {
      return 0x0;
    }
    const _0x2611f3 = Number(_0x16048f["duration"]);
    if (Number["isFinite"](_0x2611f3) && _0x2611f3 > 0x0) {
      return _0x2611f3;
    }
    const _0x399e50 = _0x16048f["seekable"];
    if (_0x399e50 && _0x399e50["length"]) {
      const _0x37b5bb = Number(_0x399e50['end'](_0x399e50["length"] - 0x1));
      if (Number['isFinite'](_0x37b5bb) && _0x37b5bb > 0x0) {
        return _0x37b5bb;
      }
    }
    return 0x0;
  },
  '_resolveKnownDurationSec'(_0x75da9) {
    const _0x5ca227 = pickSelectedVideoItem(_0x75da9);
    const _0x3b76dd = pickPositiveNumber(_0x5ca227?.["videoDuration"], _0x5ca227?.["duration"], _0x75da9?.["videoDuration"], _0x75da9?.["duration"]);
    if (_0x3b76dd > 0x0) {
      return _0x3b76dd;
    }
    const _0xcb36b5 = pickPositiveNumber(_0x5ca227?.["videoFrameCount"], _0x5ca227?.["frameCount"], _0x75da9?.["videoFrameCount"], _0x75da9?.['frameCount']);
    const _0x284b1d = pickPositiveNumber(_0x5ca227?.["videoFps"], _0x5ca227?.["fps"], _0x75da9?.['videoFps'], _0x75da9?.["fps"]);
    return _0xcb36b5 > 0x0 && _0x284b1d > 0x0 ? _0xcb36b5 / _0x284b1d : 0x0;
  },
  '_resolveActiveVideoData'() {
    if (!this['_sourceOptions']) {
      return a1605_0x3a192f["getState"]()["nodes"]?.[this["nodeId"]] || null;
    }
    const _0x5943fb = this["_sourceOptions"]['sourceData'] && typeof this["_sourceOptions"]["sourceData"] === "object" ? this["_sourceOptions"]["sourceData"] : {};
    return {
      ..._0x5943fb,
      'src': this["_sourceOptions"]["sourceUrl"],
      'videoUrl': this["_sourceOptions"]['sourceUrl'],
      'localPath': String(this["_sourceOptions"]["sourceLocalPath"] || _0x5943fb["localPath"] || ''),
      'videoDuration': pickPositiveNumber(this["_sourceOptions"]["durationSec"], _0x5943fb['videoDuration'], _0x5943fb['duration']),
      'videoWidth': pickPositiveNumber(this['_sourceOptions']['videoWidth'], _0x5943fb["videoWidth"], _0x5943fb["width"]),
      'videoHeight': pickPositiveNumber(this["_sourceOptions"]['videoHeight'], _0x5943fb["videoHeight"], _0x5943fb["height"]),
      'thumbUrl': String(this["_sourceOptions"]["posterUrl"] || _0x5943fb['thumbUrl'] || _0x5943fb['posterUrl'] || '')
    };
  },
  '_resolveActiveVideoSrc'() {
    if (this["_sourceOptions"]) {
      return localPathToUrl(this['_sourceOptions']['sourceLocalPath']) || String(this['_sourceOptions']["sourceUrl"] || '')["trim"]();
    }
    return this["_resolveVideoSrcFromNode"](this["_resolveActiveVideoData"]());
  },
  '_applyDurationSec'(_0x50b4c5) {
    const _0x3b9175 = Number(_0x50b4c5);
    if (!Number["isFinite"](_0x3b9175) || _0x3b9175 <= 0x0) {
      return ![];
    }
    this["durationSec"] = _0x3b9175;
    if (!(this["endSec"] > this['startSec'])) {
      const _0x56b1fc = Math["min"](0x3, _0x3b9175);
      const _0x54503c = Math["max"](0x0, (_0x3b9175 - _0x56b1fc) / 0x2);
      this["startSec"] = _0x54503c;
      this["endSec"] = _0x54503c + _0x56b1fc;
      return !![];
    }
    this["startSec"] = Math["max"](0x0, Math['min'](this["startSec"], _0x3b9175));
    this["endSec"] = Math["max"](0x0, Math["min"](this["endSec"], _0x3b9175));
    if (this["endSec"] <= this['startSec']) {
      const _0x1e63a0 = Math['min'](0x3, _0x3b9175);
      this["startSec"] = 0x0;
      this['endSec'] = _0x1e63a0;
    }
    return !![];
  },
  async '_applyVideoMetaDurationFallback'(_0x51a754, _0x3e868f) {
    const _0x210aae = String(_0x51a754 || '')['trim']();
    if (!_0x210aae) {
      return;
    }
    try {
      const _0x3ff9c8 = await fetchVideoMetaFromServer(_0x210aae);
      if (!this["active"] || _0x3e868f !== this['_sourceToken']) {
        return;
      }
      const _0x3e9226 = _0x3ff9c8 && typeof _0x3ff9c8 === "object" && _0x3ff9c8["data"] ? _0x3ff9c8["data"] : _0x3ff9c8;
      const _0x33a500 = pickPositiveNumber(_0x3e9226?.["duration"], _0x3e9226?.["videoDuration"], _0x3e9226?.["format"]?.["duration"], _0x3e9226?.["stream"]?.["duration"]);
      this['_applyDurationSec'](_0x33a500) && (this["_render"](), this["_startPlayheadLoop"]());
    } catch (_0x1ff87e) {}
  },
  async '_syncDurationAndDefaults'() {
    const _0x4ea1e4 = this["_resolveActiveVideoData"]();
    const _0xe71d96 = this['_resolveActiveVideoSrc']();
    const _0x4fcb51 = String(_0xe71d96 || '')["trim"]();
    const _0xbc1bcf = ++this["_sourceToken"];
    this["videoEl"] = this["_getVideoEl"]();
    this["_applyDurationSec"](this['_resolveKnownDurationSec'](_0x4ea1e4)) && this["_render"]();
    if (this["videoEl"]) {
      const _0xcaf173 = this["videoEl"];
      const _0x14c497 = this["_sourceOptions"];
      const _0x1b71db = () => this["active"] && _0xbc1bcf === this["_sourceToken"] && this["videoEl"] === _0xcaf173 && this['_sourceOptions'] === _0x14c497;
      const _0x310b22 = String(this["videoEl"]["dataset"]?.["videoClipSourceUrl"] || '')["trim"]();
      this['_setClipMediaKeepAlive'](this["videoEl"], !![]);
      try {
        this["videoEl"]["pause"]();
      } catch (_0x5c9a75) {}
      try {
        this['videoEl']["loop"] = ![];
      } catch (_0x3b7146) {}
      if (_0x4fcb51 && _0x310b22 !== _0x4fcb51) {
        await attachDesktopMediaPlaybackSource(this["videoEl"], _0x4fcb51, {
          'shouldAssign': _0x1b71db
        });
        if (!_0x1b71db()) {
          return;
        }
        if (!this["_getVideoElementSource"](this['videoEl'])) {
          this["videoEl"]["preload"] = "metadata";
          this["videoEl"]["src"] = _0x4fcb51;
          try {
            this["videoEl"]["load"]?.();
          } catch (_0x5a390a) {}
        }
        this["videoEl"]["dataset"] && (this['videoEl']["dataset"]["videoClipSourceUrl"] = _0x4fcb51);
      }
    }
    const _0x4635cb = this['_readDurationSec'](this["videoEl"]);
    if (this["_applyDurationSec"](_0x4635cb)) {
      this["_render"]();
    } else {
      !(this['durationSec'] > 0x0) && _0x4fcb51 && void this["_applyVideoMetaDurationFallback"](_0x4fcb51, _0xbc1bcf);
    }
    this["videoEl"] && (this["_onLoadedMeta"] = () => {
      if (!this["active"]) {
        return;
      }
      const _0x3cb84a = this['_readDurationSec'](this["videoEl"]);
      this['_applyDurationSec'](_0x3cb84a, this["videoEl"]);
      this["_render"]();
    }, this["_onDurationChange"] = () => {
      if (!this["active"]) {
        return;
      }
      const _0x1d0585 = this['_readDurationSec'](this['videoEl']);
      this["_applyDurationSec"](_0x1d0585, this["videoEl"]);
      this["_render"]();
    }, this["videoEl"]["addEventListener"]('loadedmetadata', this['_onLoadedMeta'], {
      'once': !![]
    }), this['videoEl']["addEventListener"]('durationchange', this["_onDurationChange"]));
    this['_renderThumbs']();
    this["_startPlayheadLoop"]();
  },
  '_startPlayheadLoop'() {
    if (this["_playheadRaf"]) {
      cancelAnimationFrame(this["_playheadRaf"]);
    }
    const _0x22f277 = () => {
      if (!this["active"]) {
        return;
      }
      this["_renderPlayhead"]();
      this['_playheadRaf'] = requestAnimationFrame(_0x22f277);
    };
    this['_playheadRaf'] = requestAnimationFrame(_0x22f277);
  },
  '_renderPlayhead'() {
    if (!this["playheadEl"] || !this["trackEl"]) {
      return;
    }
    const _0x2c15c9 = this['durationSec'];
    if (!Number["isFinite"](_0x2c15c9) || _0x2c15c9 <= 0x0) {
      this["playheadEl"]['style']["display"] = "none";
      return;
    }
    const _0x5ea86b = this['videoEl'] || this["_getVideoEl"]();
    if (!_0x5ea86b) {
      this["playheadEl"]['style']['display'] = "none";
      return;
    }
    let _0xd5213 = Number(_0x5ea86b["currentTime"]) || 0x0;
    const _0xa1093c = Number(this["_pendingPlaybackStartSec"]);
    _0x5ea86b["paused"] && _0x5ea86b["seeking"] && this["_pendingPlaybackStartSec"] !== null && Number["isFinite"](_0xa1093c) && (_0xd5213 = _0xa1093c);
    if (_0xd5213 < this["startSec"] || _0xd5213 > this["endSec"]) {
      if (!_0x5ea86b["paused"] && !_0x5ea86b["seeking"] && this['_rangeLoopSeekPending'] !== !![]) {
        this["_rangeLoopSeekPending"] = !![];
        try {
          _0x5ea86b["currentTime"] = this["startSec"];
        } catch (_0x5143b2) {}
        _0xd5213 = this["startSec"];
      }
    } else {
      !_0x5ea86b["seeking"] && (this["_rangeLoopSeekPending"] = ![]);
    }
    const _0x98675 = Math["max"](0x0, Math["min"](0x1, _0xd5213 / _0x2c15c9));
    this["playheadEl"]["style"]["display"] = 'block';
    this["playheadEl"]["style"]["left"] = _0x98675 * 0x64 + '%';
  },
  '_handlePlaybackShortcutKey'(_0x536e15) {
    if (!this["active"] || this["_isSourceReverseEditLocked"]()) {
      return ![];
    }
    if (!(_0x536e15?.['key'] === '\x20' || _0x536e15?.['code'] === "Space")) {
      return ![];
    }
    _0x536e15["preventDefault"]?.();
    _0x536e15['stopPropagation']?.();
    if (!_0x536e15["repeat"]) {
      void this["_togglePlayRange"]();
    }
    return !![];
  },
  '_pauseRangePlaybackForRangeEdit'(_0x1ff051 = this["videoEl"] || this["_getVideoEl"]()) {
    this["_rangePlaybackSeq"] += 0x1;
    this["_rangeLoopSeekPending"] = ![];
    this["_pendingPlaybackStartSec"] = null;
    if (!_0x1ff051) {
      return null;
    }
    try {
      if (!_0x1ff051['paused']) {
        _0x1ff051["pause"]();
      }
    } catch (_0x59dd85) {}
    return _0x1ff051;
  },
  async '_togglePlayRange'() {
    if (this["_isSourceReverseEditLocked"]()) {
      return ![];
    }
    const _0x469e2c = ++this["_rangePlaybackSeq"];
    const _0x3bfe7f = this["_getVideoEl"]();
    if (!_0x3bfe7f) {
      return ![];
    }
    await this["_ensureVideoPlaybackSource"](_0x3bfe7f);
    if (!this["active"] || _0x469e2c !== this["_rangePlaybackSeq"]) {
      return ![];
    }
    let _0x46204a = Number(this["durationSec"]);
    if (!Number["isFinite"](_0x46204a) || _0x46204a <= 0x0) {
      _0x46204a = this["_readDurationSec"](_0x3bfe7f);
      if (!Number['isFinite'](_0x46204a) || _0x46204a <= 0x0) {
        return ![];
      }
      if (this["_applyDurationSec"](_0x46204a)) {
        this["_render"]();
      }
    }
    try {
      if (!_0x3bfe7f["paused"]) {
        _0x3bfe7f['pause']();
        this["_pendingPlaybackStartSec"] = null;
        this["_renderPlayhead"]();
        return !![];
      }
    } catch (_0x2bcd4d) {}
    const _0xd5b819 = Math["max"](0x0, Math["min"](this['startSec'], _0x46204a));
    const _0x3d1feb = Math['max'](_0xd5b819, Math['min'](this["endSec"], _0x46204a));
    if (!(_0x3d1feb > _0xd5b819)) {
      return ![];
    }
    const _0x3337cb = Number(_0x3bfe7f['currentTime']) || 0x0;
    const _0x4b6a41 = this["_pendingPlaybackStartSec"];
    const _0x4288d7 = Number(_0x4b6a41);
    const _0x72b44e = _0x4b6a41 !== null && _0x4b6a41 !== undefined && Number["isFinite"](_0x4288d7) && _0x4288d7 >= _0xd5b819 && _0x4288d7 < _0x3d1feb;
    const _0x582ca1 = _0x72b44e ? _0x4288d7 : _0xd5b819;
    (_0x72b44e || _0x3337cb < _0xd5b819 || _0x3337cb >= _0x3d1feb) && (await this["_seekVideoForRangePlayback"](_0x3bfe7f, _0x582ca1));
    if (!this["active"] || _0x469e2c !== this["_rangePlaybackSeq"]) {
      return ![];
    }
    this["_pendingPlaybackStartSec"] === _0x4b6a41 && (this["_pendingPlaybackStartSec"] = null);
    const _0xecfa93 = await playVideoWithRecovery(_0x3bfe7f, {
      'label': "video-clip:" + (this['nodeId'] || "unknown") + ":range",
      'ensureSrc': () => this["_ensureVideoPlaybackSource"](_0x3bfe7f),
      'minBufferAhead': 0.5,
      'readyTimeoutMs': 0x1f4,
      'recoveryDebounceMs': 0x96,
      'recoveryCooldownMs': 0x1f4,
      'shouldRecover': _0x510fd9 => this['active'] === !![] && this["videoEl"] === _0x510fd9 && _0x510fd9?.["isConnected"] !== ![] && !_0x510fd9?.["paused"],
      'shouldContinue': () => this["active"] === !![] && _0x469e2c === this["_rangePlaybackSeq"] && this['videoEl'] === _0x3bfe7f
    });
    _0xecfa93 && (this["_rangeLoopSeekPending"] = ![], this["_renderPlayhead"]());
    return _0xecfa93;
  },
  async '_ensureVideoPlaybackSource'(_0x30e234 = this['videoEl']) {
    if (!_0x30e234) {
      return ![];
    }
    if (this["_getVideoElementSource"](_0x30e234)) {
      if (_0x30e234["preload"] !== "auto") {
        _0x30e234["preload"] = "auto";
      }
      return !![];
    }
    const _0x1a6b38 = String(this["_resolveActiveVideoSrc"]() || '')["trim"]();
    if (!_0x1a6b38) {
      return ![];
    }
    await attachDesktopMediaPlaybackSource(_0x30e234, _0x1a6b38, {
      'preload': "auto"
    });
    if (_0x30e234["dataset"]) {
      _0x30e234["dataset"]["videoClipSourceUrl"] = _0x1a6b38;
    }
    return !!this["_getVideoElementSource"](_0x30e234);
  },
  async '_seekVideoForRangePlayback'(_0x38c724, _0x302be7) {
    if (!_0x38c724) {
      return ![];
    }
    const _0x547c49 = Math["max"](0x0, Number(_0x302be7) || 0x0);
    const _0x201666 = Number(_0x38c724["currentTime"] || 0x0);
    if (Math["abs"](_0x201666 - _0x547c49) <= VIDEO_CLIP_SEEK_EPSILON_SEC && Number(_0x38c724["readyState"] || 0x0) >= 0x2 && !_0x38c724["seeking"]) {
      return !![];
    }
    this['_rangeLoopSeekPending'] = !![];
    try {
      _0x38c724['currentTime'] = _0x547c49;
    } catch (_0x4a8ee0) {}
    await this['_waitForRangePlaybackSeek'](_0x38c724);
    this["_rangeLoopSeekPending"] = ![];
    return !![];
  },
  '_waitForRangePlaybackSeek'(_0x32f75b) {
    if (!_0x32f75b || Number(_0x32f75b["readyState"] || 0x0) >= 0x2 && !_0x32f75b['seeking']) {
      return Promise['resolve'](!![]);
    }
    return new Promise(_0x2b766d => {
      let _0x3a4f10 = ![];
      const _0x32cd00 = ["seeked", 'canplay', 'canplaythrough', 'loadeddata', 'timeupdate'];
      const _0x53f856 = () => {
        if (_0x3a4f10) {
          return;
        }
        _0x3a4f10 = !![];
        clearTimeout(_0x198111);
        _0x32cd00['forEach'](_0x36f76c => _0x32f75b["removeEventListener"]?.(_0x36f76c, _0x404cbc));
        _0x32f75b['removeEventListener']?.("error", _0x404cbc);
        _0x32f75b["removeEventListener"]?.("abort", _0x404cbc);
        _0x2b766d(!![]);
      };
      const _0x404cbc = () => {
        if (Number(_0x32f75b["readyState"] || 0x0) >= 0x2 || !_0x32f75b['seeking']) {
          _0x53f856();
        }
      };
      const _0x198111 = setTimeout(_0x53f856, VIDEO_CLIP_PLAY_SEEK_TIMEOUT_MS);
      _0x32cd00['forEach'](_0x3807aa => _0x32f75b['addEventListener']?.(_0x3807aa, _0x404cbc));
      _0x32f75b["addEventListener"]?.("error", _0x404cbc);
      _0x32f75b['addEventListener']?.('abort', _0x404cbc);
    });
  },
  '_resolveVideoSrcFromNode'(_0x1cb2e8) {
    return resolveVideoClipSourceUrl(_0x1cb2e8);
  },
  async '_renderThumbs'() {
    const _0x59d93b = ++this["_thumbToken"];
    const _0x4eb6e3 = Array["isArray"](this['thumbEls']) ? this["thumbEls"] : [];
    if (!_0x4eb6e3["length"]) {
      return;
    }
    const _0x19de93 = this["_resolveActiveVideoData"]();
    const _0x3c7459 = this["_resolveActiveVideoSrc"]();
    const _0x21c00f = resolveCanvasVideoPosterUrl(_0x19de93);
    const _0x45ed33 = await renderVideoTimelineThumbnails({
      'src': _0x3c7459,
      'posterUrl': _0x21c00f,
      'thumbs': _0x4eb6e3,
      'isCurrent': () => this['active'] && this['_thumbToken'] === _0x59d93b
    });
    if (!this['active'] || this["_thumbToken"] !== _0x59d93b) {
      return;
    }
    this["trackEl"]?.["dataset"] && (this["trackEl"]['dataset']['thumbnailState'] = _0x45ed33['source']);
    _0x45ed33["errors"]["length"] >= 0x2 && (_0x45ed33["source"] === "poster" || _0x45ed33["source"] === "empty") && console["warn"]('[VideoClipController]\x20timeline\x20thumbnail\x20extraction\x20fell\x20back:', _0x45ed33["errors"]["map"](_0x4d51ee => _0x4d51ee["message"]));
  },
  '_handleDragAtClientX'(_0x118530) {
    if (!this["trackEl"] || !this["active"] || this["_isSourceReverseEditLocked"]()) {
      return;
    }
    const _0x2d1016 = this["durationSec"];
    if (!_0x2d1016 || !Number["isFinite"](_0x2d1016) || _0x2d1016 <= 0x0) {
      this['_render']();
      return;
    }
    const _0x71a9a5 = this["trackEl"]["getBoundingClientRect"]();
    if (!_0x71a9a5["width"]) {
      return;
    }
    const _0x4ba8fe = _0x118530 - _0x71a9a5["left"];
    const _0x5c3708 = Math["max"](0x0, Math["min"](0x1, _0x4ba8fe / _0x71a9a5['width']));
    const _0x1ce882 = _0x5c3708 * _0x2d1016;
    const _0x3d0f83 = Math["min"](0.1, _0x2d1016);
    const _0x3d51b4 = Math["max"](_0x3d0f83, this["endSec"] - this["startSec"]);
    const _0x134647 = this["_dragMode"] === "left" || this["_dragMode"] === "right" || this["_dragMode"] === "move" || this['_dragMode'] === "set" ? this["_pauseRangePlaybackForRangeEdit"]() : null;
    if (this['_dragMode'] === "left") {
      const _0x117437 = Math["max"](0x0, Math["min"](_0x1ce882, this["endSec"] - _0x3d0f83));
      this["startSec"] = _0x117437;
      if (_0x134647) {
        try {
          _0x134647["currentTime"] = _0x117437;
        } catch (_0x3a8951) {}
      }
    } else {
      if (this["_dragMode"] === "right") {
        const _0x395ba1 = Math['max'](this['startSec'] + _0x3d0f83, Math['min'](_0x2d1016, _0x1ce882));
        this['endSec'] = _0x395ba1;
      } else {
        if (this["_dragMode"] === "move") {
          const _0x54051b = this["selectionEl"]["getBoundingClientRect"]()["left"] - _0x71a9a5['left'];
          const _0x599066 = _0x118530 - _0x71a9a5['left'] - this["_dragOffsetPx"];
          const _0x3b60ce = _0x599066 - _0x54051b;
          const _0x540137 = _0x3b60ce / _0x71a9a5["width"] * _0x2d1016;
          const _0xa89e24 = Math["max"](0x0, Math["min"](_0x2d1016 - _0x3d51b4, this["startSec"] + _0x540137));
          this['startSec'] = _0xa89e24;
          this["endSec"] = _0xa89e24 + _0x3d51b4;
          if (_0x134647) {
            try {
              _0x134647["currentTime"] = _0xa89e24;
            } catch (_0x2a13ce) {}
          }
        } else {
          if (this["_dragMode"] === "set") {
            const _0x178cf3 = Math["min"](0x3, _0x2d1016);
            const _0x17f6c1 = Math['max'](0x0, Math["min"](_0x2d1016 - _0x178cf3, _0x1ce882 - _0x178cf3 / 0x2));
            this['startSec'] = _0x17f6c1;
            this["endSec"] = _0x17f6c1 + _0x178cf3;
          }
        }
      }
    }
    this['_render']();
  },
  '_render'() {
    this["_renderSourceReverseControl"]();
    if (!this["active"] || !this["trackEl"] || !this['selectionEl'] || !this['leftHandleEl'] || !this["rightHandleEl"]) {
      return;
    }
    const _0x2f1c5d = this["durationSec"];
    const _0x110120 = Number['isFinite'](_0x2f1c5d) && _0x2f1c5d > 0x0;
    const _0x1d84eb = _0x110120 ? Math['max'](0x0, Math['min'](this['startSec'], _0x2f1c5d)) : 0x0;
    const _0x5b6e00 = _0x110120 ? Math["max"](0x0, Math['min'](this["endSec"], _0x2f1c5d)) : 0x0;
    const _0x46a01b = Math["max"](0x0, _0x5b6e00 - _0x1d84eb);
    if (_0x110120) {
      const _0x433ad5 = _0x1d84eb / _0x2f1c5d * 0x64;
      const _0x57a216 = _0x46a01b / _0x2f1c5d * 0x64;
      this["selectionEl"]["style"]['left'] = _0x433ad5 + '%';
      this["selectionEl"]["style"]["width"] = _0x57a216 + '%';
      this['leftHandleEl']['style']["left"] = _0x433ad5 + '%';
      this["rightHandleEl"]["style"]["left"] = _0x433ad5 + _0x57a216 + '%';
      this["labelEl"] && (this["labelEl"]["textContent"] = _0x46a01b["toFixed"](0x2) + 's', this["labelEl"]["style"]["left"] = _0x433ad5 + _0x57a216 / 0x2 + '%');
    } else {
      this['selectionEl']["style"]['left'] = '0%';
      this["selectionEl"]["style"]["width"] = '0%';
      this['leftHandleEl']["style"]["left"] = '0%';
      this["rightHandleEl"]["style"]["left"] = '0%';
      this["labelEl"] && (this["labelEl"]["textContent"] = videoClipText("controls.loading"), this['labelEl']["style"]["left"] = "50%");
    }
    this["_renderPlayhead"]();
    if (this["confirmBtnEl"]) {
      const _0x4f42f6 = _0x110120 && _0x46a01b >= 0.1 && !this["_isSourceReverseEditLocked"]();
      this["confirmBtnEl"]['disabled'] = !_0x4f42f6;
      this["confirmBtnEl"]["dataset"]["disabled"] = _0x4f42f6 ? "false" : "true";
      this['confirmBtnEl']["dataset"]['loading'] !== "true" && (this["confirmBtnEl"]["innerHTML"] = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"><polyline points=\"20 6 9 17 4 12\"></polyline></svg>");
    }
    if (_0x110120 && typeof this["_sourceOptions"]?.["onRangeChange"] === "function") {
      try {
        this["_sourceOptions"]["onRangeChange"]({
          'startSec': _0x1d84eb,
          'endSec': _0x5b6e00,
          'durationSec': _0x46a01b,
          'sourceDurationSec': _0x2f1c5d,
          'transient': Boolean(this["_dragMode"])
        });
      } catch (_0x5b1caa) {}
    }
  },
  'setSourceRange'(_0x4fcb9, _0x47a625, {
    seek = !![]
  } = {}) {
    if (!this["active"] || !this['_sourceOptions']) {
      return ![];
    }
    const _0x249e20 = Number(this["durationSec"]) || 0x0;
    if (_0x249e20 <= 0x0) {
      return ![];
    }
    const _0xbe1a97 = Math['max'](0x0, Math["min"](_0x249e20, Number(_0x4fcb9) || 0x0));
    const _0x35d6f6 = Math["max"](_0xbe1a97, Math['min'](_0x249e20, Number(_0x47a625) || _0x249e20));
    this["startSec"] = _0xbe1a97;
    this["endSec"] = _0x35d6f6;
    if (seek) {
      const _0x15c8c1 = this['videoEl'] || this['_getVideoEl']();
      if (_0x15c8c1) {
        this['_pauseRangePlaybackForRangeEdit'](_0x15c8c1);
        try {
          _0x15c8c1["currentTime"] = _0xbe1a97;
        } catch (_0x2694c3) {}
      }
    }
    this["_render"]();
    return !![];
  },
  'getSourceTimelineElements'() {
    if (!this["active"] || !this['_sourceOptions']) {
      return null;
    }
    return {
      'barEl': this["barEl"],
      'trackEl': this['trackEl'],
      'playheadEl': this["playheadEl"],
      'selectionEl': this["selectionEl"]
    };
  },
  async '_confirm'() {
    if (!this['confirmBtnEl']) {
      return;
    }
    const _0x552c63 = this['confirmBtnEl'];
    if (_0x552c63["dataset"]["disabled"] === "true") {
      return;
    }
    if (this["_isSourceReverseEditLocked"]()) {
      return;
    }
    const _0xd7e779 = this["_clipSessionToken"];
    const _0x14e10d = this["_sourceOptions"];
    const _0x4d952a = a1605_0x3a192f['getState']()["nodes"];
    const _0xed8909 = _0x14e10d ? this['_resolveActiveVideoData']() : _0x4d952a[this["anchorNodeId"]];
    if (!_0xed8909) {
      this['exit']({
        'silent': !![]
      });
      return;
    }
    const _0x52e5ef = this["durationSec"];
    if (!_0x52e5ef || !Number["isFinite"](_0x52e5ef) || _0x52e5ef <= 0x0) {
      return;
    }
    const _0xd848bd = Math['max'](0x0, Math["min"](this['startSec'], _0x52e5ef));
    const _0x1c4a4f = Math["max"](0x0, Math["min"](this["endSec"], _0x52e5ef));
    if (!(_0x1c4a4f > _0xd848bd)) {
      return;
    }
    const _0x4c99b1 = _0x14e10d ? this["_resolveActiveVideoSrc"]() : localPathToUrl(_0xed8909["localPath"]) || _0xed8909['src'] || _0xed8909['videoUrl'] || _0xed8909["resultUrl"] || '';
    if (!_0x4c99b1) {
      return;
    }
    _0x552c63["dataset"]["disabled"] = "true";
    _0x552c63['dataset']["loading"] = "true";
    _0x552c63['innerHTML'] = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><g style=\"animation:spin 1s linear infinite;transform-origin:50% 50%;transform-box:fill-box;\"><path d=\"M21 12a9 9 0 1 1-6.219-8.56\"/></g></svg>";
    window["showToast"]?.(videoClipText("cut.processing"), "info");
    this['_renderSourceReverseControl']();
    try {
      const _0x8af407 = await cutVideoRangeToLocal({
        'src': _0x4c99b1,
        'startSec': _0xd848bd,
        'endSec': _0x1c4a4f,
        'nodeId': this['anchorNodeId']
      });
      const _0x271eb5 = _0x8af407["data"];
      if (_0xd7e779 !== this["_clipSessionToken"] || _0x14e10d !== this["_sourceOptions"]) {
        return;
      }
      const _0x15772d = _0x8af407['result'];
      const _0x524680 = _0x8af407["localPath"];
      if (_0x14e10d) {
        typeof _0x14e10d["onConfirm"] === "function" && (await _0x14e10d["onConfirm"]({
          'startSec': _0xd848bd,
          'endSec': _0x1c4a4f,
          'durationSec': _0x1c4a4f - _0xd848bd,
          'sourceUrl': _0x4c99b1,
          'sourceLocalPath': String(_0x14e10d['sourceLocalPath'] || ''),
          'cutLocalPath': _0x524680,
          'videoUrl': localPathToUrl(_0x524680),
          ...(this["_reverseControl"] ? {
            'isReversed': this["_reverseControl"]['isReversed'],
            'materializedIsReversed': this['_reverseControl']["materializedIsReversed"]
          } : {}),
          'fps': pickPositiveNumber(_0x15772d?.["fps"], _0x271eb5?.['fps']),
          'data': _0x271eb5,
          'result': _0x15772d
        }));
        if (_0xd7e779 !== this["_clipSessionToken"] || _0x14e10d !== this["_sourceOptions"]) {
          return;
        }
        window["showToast"]?.(videoClipText('cut.success'), "success");
        this["exit"]({
          'silent': !![],
          'reason': "confirm"
        });
        return;
      }
      const {
        width: _0x4bf884,
        height: _0x318b49
      } = getAutoMediaSizeByShortSide(_0xed8909["width"] || 0x200, _0xed8909["height"] || 0x120);
      const _0x50888e = calcSafeSpawnPosNearNode(a1605_0x3a192f["getState"]()["nodes"], _0xed8909, _0x4bf884, _0x318b49);
      const _0x30879c = generateId('source-video-cut');
      const _0x51106c = pickPositiveNumber(_0x15772d?.["fps"], _0x271eb5?.['fps']);
      const _0x3260d9 = buildVideoCutNodeMeta(_0xed8909, _0xd848bd, _0x1c4a4f, _0x51106c);
      const _0x1e3715 = buildVideoCutNodePlaybackFields(_0x524680);
      a1605_0x3a192f["addNode"](buildSourceMediaNodePayload({
        'id': _0x30879c,
        'type': 'source-video',
        'x': _0x50888e['x'],
        'y': _0x50888e['y'],
        'width': _0x4bf884,
        'height': _0x318b49,
        'name': videoClipText("cut.newNodeName", {
          'name': _0xed8909["name"] || videoClipText("cut.videoFallback")
        }),
        ..._0x1e3715,
        ..._0x3260d9,
        'needsAutoResize': ![],
        'fixedSize': !![]
      }));
      a1605_0x3a192f["setSelectedNodes"]([_0x30879c]);
      commit();
      ensureVideoCutNodeThumb(_0x30879c, _0x524680);
      window['_triggerLocalCacheSave']?.();
      window["showToast"]?.(videoClipText("cut.success"), "success");
      this['exit']({
        'silent': !![],
        'reason': 'confirm'
      });
    } catch (_0x58fac6) {
      if (_0xd7e779 !== this["_clipSessionToken"] || _0x14e10d !== this["_sourceOptions"]) {
        return;
      }
      const _0x5d5e0d = _0x58fac6 instanceof Error ? _0x58fac6["message"] : String(_0x58fac6 || videoClipText("errors.cutFailed"));
      window["showToast"]?.(videoClipText("cut.failedWithError", {
        'error': _0x5d5e0d
      }), "error");
      _0x552c63['dataset']["loading"] = "false";
      this['_render']();
      _0x552c63["dataset"]["loading"] = "false";
    }
    _0x552c63['dataset']["loading"] = 'false';
  },
  'exit'({
    silent = ![],
    reason = ''
  } = {}) {
    if (!this["active"]) {
      return;
    }
    const _0x3899b3 = this["_sourceOptions"];
    const _0x13b9f3 = this["_reverseControl"] ? {
      'isReversed': this['_reverseControl']['isReversed'],
      'materializedIsReversed': this["_reverseControl"]["materializedIsReversed"]
    } : null;
    const _0x5c19bd = String(reason || (silent ? "silent" : 'cancel'));
    this['active'] = ![];
    this["_thumbToken"]++;
    this["_sourceToken"]++;
    this["_reverseRequestToken"]++;
    this["_clipSessionToken"]++;
    this['_rangeLoopSeekPending'] = ![];
    this["_rangePlaybackSeq"] += 0x1;
    this['_pendingPlaybackStartSec'] = null;
    !_0x3899b3?.["embedded"] && a1605_0x3a192f["setVideoClipState"]({
      'active': ![],
      'nodeId': null
    });
    if (this['_playheadRaf']) {
      cancelAnimationFrame(this['_playheadRaf']);
    }
    this["_playheadRaf"] = 0x0;
    if (this['_retryRaf']) {
      cancelAnimationFrame(this['_retryRaf']);
    }
    this["_retryRaf"] = 0x0;
    if (this["videoEl"]) {
      this["_setClipMediaKeepAlive"](this["videoEl"], ![]);
      if (this["_onLoadedMeta"]) {
        this['videoEl']["removeEventListener"]('loadedmetadata', this["_onLoadedMeta"]);
      }
      if (this['_onDurationChange']) {
        this["videoEl"]["removeEventListener"]("durationchange", this['_onDurationChange']);
      }
    }
    this["_onKeyDown"] && (window["removeEventListener"]("keydown", this["_onKeyDown"], !![]), this["_onKeyDown"] = null);
    this["_onSmartClipDocDown"] && (document["removeEventListener"]("pointerdown", this["_onSmartClipDocDown"], !![]), this['_onSmartClipDocDown'] = null);
    this["_smartClipMaxSegmentDrag"] && (this["_smartClipMaxSegmentDrag"]['el']?.["classList"]?.["remove"]("is-dragging"), this["_smartClipMaxSegmentDrag"]['doc']?.["removeEventListener"]?.("mousemove", this["_onSmartClipMaxSegmentDragMove"]), this['_smartClipMaxSegmentDrag']["doc"]?.['removeEventListener']?.("mouseup", this["_onSmartClipMaxSegmentDragUp"]), this['_smartClipMaxSegmentDrag'] = null);
    this['_onSmartClipMaxSegmentDragMove'] = null;
    this['_onSmartClipMaxSegmentDragUp'] = null;
    this["_suppressSmartClipMaxSegmentClick"] = ![];
    if (this["_onPointerMove"]) {
      window["removeEventListener"]('pointermove', this["_onPointerMove"], !![]);
    }
    if (this["_onPointerUp"]) {
      window["removeEventListener"]('pointerup', this["_onPointerUp"], !![]);
    }
    this['_onLoadedMeta'] = null;
    this['_onDurationChange'] = null;
    this['_onPointerMove'] = null;
    this["_onPointerUp"] = null;
    this["_dragMode"] = null;
    this["_dragOffsetPx"] = 0x0;
    this["_onDocClick"] && (document["removeEventListener"]("pointerdown", this["_onDocClick"], !![]), this["_onDocClick"] = null);
    this['durationSec'] = 0x0;
    this["startSec"] = 0x0;
    this["endSec"] = 0x0;
    this['nodeId'] = null;
    this["anchorNodeId"] = null;
    this["_sourceOptions"] = null;
    this["_reverseControl"] = null;
    this["videoEl"] = null;
    this["trackEl"] = null;
    this["selectionEl"] = null;
    this["leftHandleEl"] = null;
    this["rightHandleEl"] = null;
    this["playheadEl"] = null;
    this["labelEl"] = null;
    this["cancelBtnEl"] = null;
    this["reverseBtnEl"] = null;
    this["confirmBtnEl"] = null;
    this["thumbEls"] = null;
    this["_msgInterval"] && (clearInterval(this["_msgInterval"]), this['_msgInterval'] = null);
    this['_msgEls'] = null;
    this["_applyFrozenUI"](![]);
    this["_applyDimMode"](![]);
    if (this["barEl"]) {
      this['barEl']["remove"]();
    }
    this["barEl"] = null;
    this['wrapperEl'] = null;
    if (!silent) {
      window["showToast"]?.(videoClipText('cut.cancelled'), 'info');
    }
    try {
      _0x3899b3?.["onExit"]?.({
        'reason': _0x5c19bd,
        ..._0x13b9f3
      });
    } catch (_0xbbb855) {}
  }
};
const VIDEO_CLIP_CONTROLLER_METHOD_KEYS = new Set(Object["entries"](VideoClipController)['filter'](([, _0x422a0a]) => typeof _0x422a0a === "function")["map"](([_0x591c70]) => _0x591c70));
const VIDEO_CLIP_CONTROLLER_INITIAL_STATE = Object['freeze'](Object["fromEntries"](Object['entries'](VideoClipController)["filter"](([_0x359388]) => !VIDEO_CLIP_CONTROLLER_METHOD_KEYS["has"](_0x359388))));
export default VideoClipController;
export function createVideoClipController() {
  const _0x34f032 = Object["create"](VideoClipController);
  for (const _0x37bb9c of Object["keys"](VideoClipController)) {
    if (VIDEO_CLIP_CONTROLLER_METHOD_KEYS["has"](_0x37bb9c)) {
      continue;
    }
    const _0x13287f = Object["hasOwn"](VIDEO_CLIP_CONTROLLER_INITIAL_STATE, _0x37bb9c) ? VIDEO_CLIP_CONTROLLER_INITIAL_STATE[_0x37bb9c] : undefined;
    _0x34f032[_0x37bb9c] = Array["isArray"](_0x13287f) ? [..._0x13287f] : _0x13287f && typeof _0x13287f === "object" ? {
      ..._0x13287f
    } : _0x13287f;
  }
  return _0x34f032;
}