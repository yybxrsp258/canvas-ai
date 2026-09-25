import { observePlaybackStallProgress } from './mediaPlaybackStallProgress.js';
const DEBUG_STORAGE_KEY = "aic.videoPlaybackDebug";
const DEBUG_URL_PARAM = 'aicVideoDebug';
const DEFAULT_MIN_BUFFER_AHEAD_SECONDS = 0.75;
const DEFAULT_READY_TIMEOUT_MS = 0x2bc;
const DEFAULT_RECOVERY_DEBOUNCE_MS = 0xfa;
const DEFAULT_RECOVERY_COOLDOWN_MS = 0x384;
const DEFAULT_STARTUP_RECOVERY_GRACE_MS = 0xfa0;
const DEFAULT_STARTUP_RECOVERY_MIN_PLAYED_SECONDS = 0.08;
const NATIVE_LOOP_BOUNDARY_EPSILON_SECONDS = 0.15;
const HOVER_PLAYBACK_INTENT = "hover";
const EXCLUSIVE_PLAYBACK_INTENT = "exclusive";
const videoRecoveryStates = new WeakMap();
const activePlaybackVideos = new Set();
export function isVideoPlaybackDebugEnabled() {
  try {
    if (globalThis["window"]?.['AIC_VIDEO_DEBUG'] === !![]) {
      return !![];
    }
  } catch {}
  try {
    const _0x3cf627 = globalThis['localStorage']?.["getItem"](DEBUG_STORAGE_KEY);
    if (_0x3cf627 === '1' || _0x3cf627 === "true") {
      return !![];
    }
  } catch {}
  try {
    const _0x8356fa = globalThis["window"]?.["location"]?.['search'] || '';
    if (_0x8356fa) {
      const _0x3f1434 = new URLSearchParams(_0x8356fa);
      const _0x3d5c52 = _0x3f1434["get"](DEBUG_URL_PARAM);
      if (_0x3d5c52 === '1' || _0x3d5c52 === "true") {
        return !![];
      }
    }
  } catch {}
  return ![];
}
export function getVideoCurrentSource(_0x1dab3b) {
  if (!_0x1dab3b) {
    return '';
  }
  return String(_0x1dab3b["currentSrc"] || _0x1dab3b["getAttribute"]?.("src") || _0x1dab3b["src"] || '')["trim"]();
}
export function getVideoBufferedRanges(_0x4f8f84) {
  const _0x28298f = [];
  const _0x35b3f5 = _0x4f8f84?.["buffered"];
  if (!_0x35b3f5) {
    return _0x28298f;
  }
  for (let _0x9c8afd = 0x0; _0x9c8afd < _0x35b3f5["length"]; _0x9c8afd++) {
    try {
      _0x28298f["push"]({
        'start': _0x35b3f5["start"](_0x9c8afd),
        'end': _0x35b3f5["end"](_0x9c8afd)
      });
    } catch {}
  }
  return _0x28298f;
}
export function getVideoBufferedAhead(_0x1c699c, _0x3e08b8 = null) {
  if (!_0x1c699c) {
    return 0x0;
  }
  const _0x173967 = _0x3e08b8 !== null && _0x3e08b8 !== undefined;
  const _0x3d1e05 = _0x173967 && Number["isFinite"](Number(_0x3e08b8)) ? Number(_0x3e08b8) : Number(_0x1c699c["currentTime"] || 0x0);
  let _0x5b59fc = 0x0;
  for (const _0x5d7799 of getVideoBufferedRanges(_0x1c699c)) {
    if (_0x5d7799["end"] < _0x3d1e05) {
      continue;
    }
    _0x5d7799["start"] <= _0x3d1e05 + 0.15 && (_0x5b59fc = Math["max"](_0x5b59fc, _0x5d7799["end"] - _0x3d1e05));
  }
  return _0x5b59fc;
}
export function hasVideoBufferedAhead(_0x3c04de, _0x568462 = DEFAULT_MIN_BUFFER_AHEAD_SECONDS) {
  if (!_0x3c04de) {
    return ![];
  }
  const _0x1c103c = Number(_0x3c04de["duration"]);
  const _0x4069e2 = Number(_0x3c04de["currentTime"] || 0x0);
  if (Number["isFinite"](_0x1c103c) && _0x1c103c > 0x0) {
    const _0x34bb29 = _0x1c103c - _0x4069e2;
    if (_0x34bb29 <= Math['max'](0.35, _0x568462)) {
      return !![];
    }
  }
  if (Number(_0x3c04de["readyState"] || 0x0) >= 0x4) {
    return !![];
  }
  return getVideoBufferedAhead(_0x3c04de, _0x4069e2) >= _0x568462;
}
export function getVideoPlaybackSnapshot(_0x14f377) {
  return {
    'currentTime': Number(_0x14f377?.["currentTime"] || 0x0),
    'duration': Number(_0x14f377?.["duration"] || 0x0),
    'readyState': Number(_0x14f377?.['readyState'] || 0x0),
    'networkState': Number(_0x14f377?.["networkState"] || 0x0),
    'paused': !!_0x14f377?.["paused"],
    'preload': String(_0x14f377?.["preload"] || ''),
    'src': getVideoCurrentSource(_0x14f377),
    'buffered': getVideoBufferedRanges(_0x14f377)
  };
}
export function logVideoPlaybackEvent(_0x492ce8, _0x142e9d, _0x38663e = {}) {
  const _0x4bf129 = videoRecoveryStates['get'](_0x492ce8) || {};
  const _0x500e68 = _0x38663e["label"] || _0x4bf129["label"] || 'video';
  if (!isVideoPlaybackDebugEnabled()) {
    return;
  }
  try {
    console["debug"]("[video-playback]", _0x500e68, _0x142e9d, {
      ...getVideoPlaybackSnapshot(_0x492ce8),
      ...(_0x38663e["extra"] || {})
    });
  } catch {}
}
export function attachVideoPlaybackRecovery(_0x412625, _0x51f07a = {}) {
  if (!_0x412625) {
    return null;
  }
  let _0x25c449 = videoRecoveryStates['get'](_0x412625);
  !_0x25c449 ? (_0x25c449 = {
    'disposed': ![],
    'label': "video",
    'ensureSrc': null,
    'shouldRecover': null,
    'minBufferAhead': DEFAULT_MIN_BUFFER_AHEAD_SECONDS,
    'readyTimeoutMs': DEFAULT_READY_TIMEOUT_MS,
    'recoveryDebounceMs': DEFAULT_RECOVERY_DEBOUNCE_MS,
    'recoveryCooldownMs': DEFAULT_RECOVERY_COOLDOWN_MS,
    'startupRecoveryGraceMs': DEFAULT_STARTUP_RECOVERY_GRACE_MS,
    'startupRecoveryMinPlayedSeconds': DEFAULT_STARTUP_RECOVERY_MIN_PLAYED_SECONDS,
    'recoveryTimer': null,
    'lastRecoveryAt': 0x0,
    'lastPlayRequestAt': 0x0,
    'lastPlayingAt': 0x0,
    'presentedSource': '',
    'recoverySourceKey': '',
    'recoverySourceGeneration': 0x0,
    'playbackIntent': EXCLUSIVE_PLAYBACK_INTENT,
    'playRequestGeneration': 0x0
  }, videoRecoveryStates["set"](_0x412625, _0x25c449), installMediaEventListeners(_0x412625, _0x25c449)) : _0x25c449["disposed"] = ![];
  updateRecoveryState(_0x25c449, _0x51f07a);
  syncRecoverySourceIdentity(_0x412625, _0x25c449);
  rememberPresentedVideoSource(_0x412625, _0x25c449);
  return _0x25c449;
}
export function detachVideoPlaybackRecovery(_0x56b767) {
  if (!_0x56b767) {
    return ![];
  }
  const _0x30241b = videoRecoveryStates['get'](_0x56b767);
  const _0x3e7e1d = activePlaybackVideos['delete'](_0x56b767);
  if (!_0x30241b) {
    return _0x3e7e1d;
  }
  _0x30241b["disposed"] = !![];
  _0x30241b["playRequestGeneration"] = Number(_0x30241b["playRequestGeneration"] || 0x0) + 0x1;
  if (_0x30241b["recoveryTimer"] !== null) {
    clearTimeout(_0x30241b["recoveryTimer"]);
  }
  _0x30241b["recoveryTimer"] = null;
  _0x30241b["ensureSrc"] = null;
  _0x30241b["shouldRecover"] = null;
  return !![];
}
export async function prepareVideoForPlayback(_0x3544f1, _0x1c8139 = {}) {
  if (!_0x3544f1) {
    return ![];
  }
  const _0x1ddc72 = attachVideoPlaybackRecovery(_0x3544f1, _0x1c8139);
  if (!(await ensureVideoSource(_0x3544f1, _0x1ddc72))) {
    return ![];
  }
  const _0x1e9b78 = _0x1c8139["preload"] === "metadata" || _0x1c8139["playbackIntent"] === HOVER_PLAYBACK_INTENT ? "metadata" : "auto";
  _0x3544f1["preload"] !== _0x1e9b78 && (_0x3544f1['preload'] = _0x1e9b78);
  logVideoPlaybackEvent(_0x3544f1, "prepare", {
    'label': _0x1ddc72["label"]
  });
  return !![];
}
export function claimVideoPlaybackOwnership(_0x31ed78, _0x27389f = {}) {
  if (!_0x31ed78) {
    return ![];
  }
  const _0x573cae = attachVideoPlaybackRecovery(_0x31ed78, _0x27389f);
  const _0xb6e723 = resolvePlaybackIntent(_0x31ed78, _0x573cae, _0x27389f["playbackIntent"]);
  if (_0x27389f["allowConcurrent"] !== !![] && !prepareActiveVideosForPlayback(_0x31ed78, _0xb6e723)) {
    logVideoPlaybackEvent(_0x31ed78, "play-blocked", {
      'label': _0x573cae["label"],
      'extra': {
        'playbackIntent': _0xb6e723
      }
    });
    return ![];
  }
  _0x573cae["playbackIntent"] = _0xb6e723;
  return !![];
}
export async function playVideoWithRecovery(_0x52088a, _0xda6b7d = {}) {
  if (!_0x52088a) {
    return ![];
  }
  const _0x74a9fa = attachVideoPlaybackRecovery(_0x52088a, _0xda6b7d);
  const _0x14d923 = Number(_0x74a9fa["playRequestGeneration"] || 0x0) + 0x1;
  _0x74a9fa['playRequestGeneration'] = _0x14d923;
  const _0x4bc765 = () => _0x74a9fa["playRequestGeneration"] === _0x14d923;
  const _0x54526e = await prepareVideoForPlayback(_0x52088a, _0xda6b7d);
  if (!_0x54526e || !_0x4bc765()) {
    return ![];
  }
  if (!shouldContinuePlayback(_0xda6b7d)) {
    if (_0x4bc765()) {
      safePause(_0x52088a);
    }
    return ![];
  }
  if (_0xda6b7d["waitForReadyBeforePlay"] === !![]) {
    await waitForVideoReadiness(_0x52088a, _0x74a9fa["readyTimeoutMs"]);
    if (!_0x4bc765()) {
      return ![];
    }
    if (!shouldContinuePlayback(_0xda6b7d)) {
      if (_0x4bc765()) {
        safePause(_0x52088a);
      }
      return ![];
    }
  }
  if (!claimVideoPlaybackOwnership(_0x52088a, _0xda6b7d)) {
    if (_0x4bc765() && _0x52088a['paused'] === ![]) {
      safePause(_0x52088a);
    }
    return ![];
  }
  if (!_0x4bc765()) {
    return ![];
  }
  try {
    _0x74a9fa["lastPlayRequestAt"] = Date['now']();
    const _0x179045 = _0x52088a["play"]?.();
    _0x179045 && typeof _0x179045["then"] === 'function' && (await _0x179045);
  } catch (_0x5bc0c3) {
    !isIgnorablePlayError(_0x5bc0c3) && logVideoPlaybackEvent(_0x52088a, "play-error", {
      'label': _0x74a9fa["label"],
      'extra': {
        'name': _0x5bc0c3?.["name"] || '',
        'message': _0x5bc0c3?.["message"] || String(_0x5bc0c3 || '')
      }
    });
    return ![];
  }
  if (!_0x4bc765()) {
    return ![];
  }
  if (!shouldContinuePlayback(_0xda6b7d)) {
    safePause(_0x52088a);
    return ![];
  }
  activePlaybackVideos["add"](_0x52088a);
  logVideoPlaybackEvent(_0x52088a, "play-request", {
    'label': _0x74a9fa["label"]
  });
  return !![];
}
function updateRecoveryState(_0x5c8a30, _0x128a77) {
  if (!_0x5c8a30) {
    return;
  }
  Number['isFinite'](Number(_0x128a77["stallTimeoutMs"])) && (_0x5c8a30['stallTimeoutMs'] = Math["max"](0x0, Number(_0x128a77['stallTimeoutMs'])));
  if (_0x128a77['label']) {
    _0x5c8a30["label"] = String(_0x128a77['label']);
  }
  if (typeof _0x128a77["ensureSrc"] === "function") {
    _0x5c8a30['ensureSrc'] = _0x128a77['ensureSrc'];
  }
  if (typeof _0x128a77["shouldRecover"] === 'function') {
    _0x5c8a30["shouldRecover"] = _0x128a77["shouldRecover"];
  }
  Number["isFinite"](Number(_0x128a77["minBufferAhead"])) && (_0x5c8a30["minBufferAhead"] = Math['max'](0.5, Number(_0x128a77['minBufferAhead'])));
  Number["isFinite"](Number(_0x128a77["readyTimeoutMs"])) && (_0x5c8a30["readyTimeoutMs"] = Math["max"](0x64, Number(_0x128a77["readyTimeoutMs"])));
  Number['isFinite'](Number(_0x128a77["recoveryDebounceMs"])) && (_0x5c8a30["recoveryDebounceMs"] = Math['max'](0x32, Number(_0x128a77["recoveryDebounceMs"])));
  Number["isFinite"](Number(_0x128a77['recoveryCooldownMs'])) && (_0x5c8a30["recoveryCooldownMs"] = Math["max"](0x64, Number(_0x128a77["recoveryCooldownMs"])));
  Number["isFinite"](Number(_0x128a77["startupRecoveryGraceMs"])) && (_0x5c8a30["startupRecoveryGraceMs"] = Math['max'](0x0, Number(_0x128a77['startupRecoveryGraceMs'])));
  Number["isFinite"](Number(_0x128a77["startupRecoveryMinPlayedSeconds"])) && (_0x5c8a30["startupRecoveryMinPlayedSeconds"] = Math['max'](0x0, Number(_0x128a77["startupRecoveryMinPlayedSeconds"])));
}
function installMediaEventListeners(_0x398531, _0x29b5c7) {
  const _0x28cdfd = ["play", 'playing', "pause", "waiting", "stalled", "progress", "canplay"];
  for (const _0xd6e6bb of _0x28cdfd) {
    _0x398531['addEventListener']?.(_0xd6e6bb, () => {
      logVideoPlaybackEvent(_0x398531, _0xd6e6bb, {
        'label': _0x29b5c7['label']
      });
    });
  }
  for (const _0x4b19ad of ["waiting", "stalled"]) {
    _0x398531['addEventListener']?.(_0x4b19ad, () => {
      if (_0x29b5c7["disposed"]) {
        return;
      }
      scheduleStallRecovery(_0x398531, _0x29b5c7, _0x4b19ad);
    });
  }
  for (const _0x6a7a6f of ["progress", "timeupdate"]) {
    _0x398531["addEventListener"]?.(_0x6a7a6f, () => {
      if (_0x29b5c7["disposed"] || _0x29b5c7["recoveryTimer"] === null) {
        return;
      }
      observePlaybackStallProgress(_0x29b5c7, getVideoPlaybackSnapshot(_0x398531));
    });
  }
  _0x398531["addEventListener"]?.("play", () => {
    if (_0x29b5c7["disposed"]) {
      activePlaybackVideos["delete"](_0x398531);
      return;
    }
    syncRecoverySourceIdentity(_0x398531, _0x29b5c7);
    _0x29b5c7['lastPlayRequestAt'] = Date["now"]();
    activePlaybackVideos["add"](_0x398531);
  });
  _0x398531['addEventListener']?.("playing", () => {
    if (_0x29b5c7["disposed"]) {
      return;
    }
    syncRecoverySourceIdentity(_0x398531, _0x29b5c7);
    _0x29b5c7["lastPlayingAt"] = Date["now"]();
    _0x29b5c7["stallProgress"] = null;
    rememberPresentedVideoSource(_0x398531, _0x29b5c7, {
      'force': !![]
    });
  });
  for (const _0x14d75e of ["loadeddata", "canplay", 'canplaythrough']) {
    _0x398531["addEventListener"]?.(_0x14d75e, () => {
      if (_0x29b5c7["disposed"]) {
        return;
      }
      syncRecoverySourceIdentity(_0x398531, _0x29b5c7);
      rememberPresentedVideoSource(_0x398531, _0x29b5c7);
    });
  }
  for (const _0x573629 of ["loadstart", "emptied"]) {
    _0x398531["addEventListener"]?.(_0x573629, () => {
      if (_0x29b5c7['disposed']) {
        return;
      }
      syncRecoverySourceIdentity(_0x398531, _0x29b5c7);
    });
  }
  _0x398531["addEventListener"]?.("pause", () => activePlaybackVideos["delete"](_0x398531));
  _0x398531['addEventListener']?.("ended", () => activePlaybackVideos["delete"](_0x398531));
}
function getVideoRecoverySourceKey(_0x5be0aa) {
  if (!_0x5be0aa) {
    return '';
  }
  try {
    const _0x386a55 = _0x5be0aa['getAttribute']?.("src");
    if (typeof _0x386a55 === "string") {
      return _0x386a55["trim"]();
    }
  } catch {}
  return String(_0x5be0aa["currentSrc"] || _0x5be0aa["src"] || '')["trim"]();
}
function syncRecoverySourceIdentity(_0x49200d, _0x4552b4) {
  const _0x5f1e28 = getVideoRecoverySourceKey(_0x49200d);
  if (!_0x4552b4) {
    return {
      'sourceKey': _0x5f1e28,
      'generation': 0x0
    };
  }
  _0x5f1e28 !== String(_0x4552b4['recoverySourceKey'] || '') && (_0x4552b4["recoveryTimer"] !== null && (clearTimeout(_0x4552b4["recoveryTimer"]), _0x4552b4["recoveryTimer"] = null), _0x4552b4["recoverySourceKey"] = _0x5f1e28, _0x4552b4["recoverySourceGeneration"] = Number(_0x4552b4["recoverySourceGeneration"] || 0x0) + 0x1, _0x4552b4['lastRecoveryAt'] = 0x0, _0x4552b4['presentedSource'] = '', _0x4552b4["stallProgress"] = null);
  return {
    'sourceKey': _0x5f1e28,
    'generation': Number(_0x4552b4["recoverySourceGeneration"] || 0x0)
  };
}
function captureRecoverySourceIdentity(_0xfe3062, _0x2197fb) {
  return syncRecoverySourceIdentity(_0xfe3062, _0x2197fb);
}
function isRecoverySourceIdentityCurrent(_0x3c3f1c, _0xf73475, _0x41d316) {
  if (!_0x41d316) {
    return ![];
  }
  const _0x1a6de4 = syncRecoverySourceIdentity(_0x3c3f1c, _0xf73475);
  return _0x1a6de4['sourceKey'] === _0x41d316["sourceKey"] && _0x1a6de4["generation"] === _0x41d316["generation"];
}
function rememberPresentedVideoSource(_0x1bf484, _0x1dc1bb, {
  force = ![]
} = {}) {
  if (!_0x1bf484 || !_0x1dc1bb) {
    return '';
  }
  const _0x515f5a = getVideoCurrentSource(_0x1bf484);
  if (!_0x515f5a || !force && Number(_0x1bf484["readyState"] || 0x0) < 0x2) {
    return '';
  }
  _0x1dc1bb["presentedSource"] = _0x515f5a;
  return _0x515f5a;
}
function hasPresentedCurrentVideoSource(_0x293c74, _0x24fae4) {
  const _0x40a62d = getVideoCurrentSource(_0x293c74);
  return !!_0x40a62d && _0x40a62d === String(_0x24fae4?.["presentedSource"] || '');
}
function isPresentedNativeLoopBoundary(_0x324e11, _0x3f09ce) {
  if (_0x324e11?.["loop"] !== !![]) {
    return ![];
  }
  if (!hasPresentedCurrentVideoSource(_0x324e11, _0x3f09ce)) {
    return ![];
  }
  const _0x42b64e = Number(_0x324e11["duration"]);
  const _0x5831f6 = Number(_0x324e11['currentTime']);
  return Number["isFinite"](_0x42b64e) && _0x42b64e > 0x0 && Number['isFinite'](_0x5831f6) && _0x5831f6 >= 0x0 && _0x5831f6 <= NATIVE_LOOP_BOUNDARY_EPSILON_SECONDS;
}
async function ensureVideoSource(_0x63b12d, _0x189e09) {
  const _0x5b4ecd = () => {
    if (typeof _0x63b12d?.['getAttribute'] !== "function") {
      return '';
    }
    const _0x34ae05 = String(_0x63b12d['getAttribute']("src") || '')["trim"]();
    if (_0x34ae05) {
      return _0x34ae05;
    }
    return String(_0x63b12d["querySelector"]?.("source[src]")?.["getAttribute"]?.("src") || '')['trim']();
  };
  const _0x21a40e = _0x5b4ecd();
  if (_0x21a40e) {
    return !![];
  }
  if (typeof _0x189e09?.["ensureSrc"] !== 'function' && getVideoCurrentSource(_0x63b12d)) {
    return !![];
  }
  if (typeof _0x189e09?.["ensureSrc"] !== "function") {
    return ![];
  }
  try {
    await _0x189e09['ensureSrc'](_0x63b12d);
  } catch {}
  if (typeof _0x63b12d?.['getAttribute'] === "function") {
    return !!_0x5b4ecd();
  }
  return !!getVideoCurrentSource(_0x63b12d);
}
function scheduleStallRecovery(_0x27c42f, _0x31cc38, _0xf079c6, _0x5106e4 = null) {
  const _0x574f74 = captureRecoverySourceIdentity(_0x27c42f, _0x31cc38);
  observePlaybackStallProgress(_0x31cc38, getVideoPlaybackSnapshot(_0x27c42f));
  if (_0x31cc38["recoveryTimer"] !== null) {
    clearTimeout(_0x31cc38["recoveryTimer"]);
  }
  const _0x57eb47 = setTimeout(() => {
    if (_0x31cc38["recoveryTimer"] !== _0x57eb47) {
      return;
    }
    _0x31cc38["recoveryTimer"] = null;
    void recoverStalledPlayback(_0x27c42f, _0x31cc38, _0xf079c6, _0x574f74);
  }, Math["max"](0x32, Number(_0x5106e4 ?? _0x31cc38["recoveryDebounceMs"] ?? DEFAULT_RECOVERY_DEBOUNCE_MS)));
  _0x31cc38["recoveryTimer"] = _0x57eb47;
}
async function recoverStalledPlayback(_0x1d4f78, _0x4e0224, _0x3c0a6b, _0x146945) {
  if (!_0x1d4f78 || !isRecoverySourceIdentityCurrent(_0x1d4f78, _0x4e0224, _0x146945) || !shouldRecoverPlayback(_0x1d4f78, _0x4e0224)) {
    return;
  }
  const _0x3a81e8 = Date["now"]();
  const _0xcdbaae = getStartupRecoveryDelayMs(_0x1d4f78, _0x4e0224, _0x3a81e8);
  if (_0xcdbaae > 0x0) {
    logVideoPlaybackEvent(_0x1d4f78, _0x3c0a6b + '-startup-grace', {
      'label': _0x4e0224['label'],
      'extra': {
        'retryInMs': _0xcdbaae
      }
    });
    const _0x1f8c27 = setTimeout(() => {
      if (_0x4e0224["recoveryTimer"] !== _0x1f8c27) {
        return;
      }
      _0x4e0224["recoveryTimer"] = null;
      void recoverStalledPlayback(_0x1d4f78, _0x4e0224, _0x3c0a6b, _0x146945);
    }, _0xcdbaae);
    _0x4e0224["recoveryTimer"] = _0x1f8c27;
    return;
  }
  const _0x596b3d = Math["max"](0x64, Number(_0x4e0224["recoveryCooldownMs"] || DEFAULT_RECOVERY_COOLDOWN_MS));
  if (_0x3a81e8 - Number(_0x4e0224["lastRecoveryAt"] || 0x0) < _0x596b3d) {
    return;
  }
  if (hasVideoBufferedAhead(_0x1d4f78, _0x4e0224["minBufferAhead"])) {
    return;
  }
  const _0x1d7b73 = observePlaybackStallProgress(_0x4e0224, getVideoPlaybackSnapshot(_0x1d4f78), _0x3a81e8);
  if (_0x1d7b73 > 0x0) {
    scheduleStallRecovery(_0x1d4f78, _0x4e0224, _0x3c0a6b, _0x1d7b73);
    return;
  }
  if (!(await ensureVideoSource(_0x1d4f78, _0x4e0224))) {
    return;
  }
  if (!isRecoverySourceIdentityCurrent(_0x1d4f78, _0x4e0224, _0x146945)) {
    return;
  }
  if (isPresentedNativeLoopBoundary(_0x1d4f78, _0x4e0224)) {
    return;
  }
  _0x4e0224['lastRecoveryAt'] = _0x3a81e8;
  const _0x18de9e = !!_0x1d4f78["paused"];
  logVideoPlaybackEvent(_0x1d4f78, _0x3c0a6b + '-recovery', {
    'label': _0x4e0224["label"]
  });
  const _0xb01903 = await reloadVideoPreservingTime(_0x1d4f78, _0x4e0224, _0x3c0a6b, _0x146945);
  if (_0xb01903 && isRecoverySourceIdentityCurrent(_0x1d4f78, _0x4e0224, _0x146945) && !_0x18de9e && shouldRecoverPlayback(_0x1d4f78, _0x4e0224)) {
    try {
      const _0x186b60 = _0x1d4f78["play"]?.();
      _0x186b60 && typeof _0x186b60["catch"] === "function" && _0x186b60["catch"](() => {});
    } catch {}
  }
}
function getStartupRecoveryDelayMs(_0x2fd7b3, _0x2ce4ee, _0x104f29 = Date['now']()) {
  const _0x540739 = Math["max"](0x0, Number(_0x2ce4ee?.["startupRecoveryGraceMs"] ?? DEFAULT_STARTUP_RECOVERY_GRACE_MS));
  if (!(_0x540739 > 0x0)) {
    return 0x0;
  }
  const _0x215edf = Math["max"](Number(_0x2ce4ee?.["lastPlayRequestAt"] || 0x0), Number(_0x2ce4ee?.['lastPlayingAt'] || 0x0));
  if (!(_0x215edf > 0x0)) {
    return 0x0;
  }
  const _0x1a058d = _0x104f29 - _0x215edf;
  if (_0x1a058d >= _0x540739) {
    return 0x0;
  }
  const _0x2107b6 = Math["max"](0x0, Number(_0x2ce4ee?.['startupRecoveryMinPlayedSeconds'] ?? DEFAULT_STARTUP_RECOVERY_MIN_PLAYED_SECONDS));
  if (Number(_0x2fd7b3?.["currentTime"] || 0x0) > _0x2107b6) {
    return 0x0;
  }
  return Math["max"](0x32, Math['ceil'](_0x540739 - _0x1a058d));
}
function shouldRecoverPlayback(_0x572084, _0x3d4441) {
  if (_0x3d4441?.["disposed"]) {
    return ![];
  }
  if (_0x572084?.["isConnected"] === ![]) {
    return ![];
  }
  if (typeof _0x3d4441?.['shouldRecover'] === "function") {
    try {
      return !!_0x3d4441["shouldRecover"](_0x572084);
    } catch {
      return ![];
    }
  }
  return !_0x572084?.["paused"];
}
async function reloadVideoPreservingTime(_0x25e2c1, _0xbe0641, _0x4f6979, _0x457d98) {
  if (!isRecoverySourceIdentityCurrent(_0x25e2c1, _0xbe0641, _0x457d98)) {
    return ![];
  }
  const _0x2a844a = getVideoCurrentSource(_0x25e2c1);
  if (!_0x2a844a) {
    return ![];
  }
  const _0x9b2b86 = Number(_0x25e2c1["currentTime"] || 0x0);
  const _0x4e7dbf = () => {
    if (!isRecoverySourceIdentityCurrent(_0x25e2c1, _0xbe0641, _0x457d98)) {
      return ![];
    }
    if (!(_0x9b2b86 > 0x0)) {
      return !![];
    }
    const _0x161a9e = Number(_0x25e2c1["duration"]);
    const _0x47ae07 = Number["isFinite"](_0x161a9e) && _0x161a9e > 0x0 ? Math["min"](_0x9b2b86, Math["max"](0x0, _0x161a9e - 0.05)) : _0x9b2b86;
    try {
      _0x25e2c1["currentTime"] = _0x47ae07;
    } catch {}
    return !![];
  };
  logVideoPlaybackEvent(_0x25e2c1, _0x4f6979 + "-load", {
    'label': _0xbe0641['label']
  });
  try {
    if (!_0x25e2c1["getAttribute"]?.('src') && _0x2a844a) {
      _0x25e2c1['src'] = _0x2a844a;
    }
    _0x25e2c1["load"]?.();
  } catch {}
  if (!isRecoverySourceIdentityCurrent(_0x25e2c1, _0xbe0641, _0x457d98)) {
    return ![];
  }
  if (Number(_0x25e2c1['readyState'] || 0x0) >= 0x1 && !_0x4e7dbf()) {
    return ![];
  }
  await waitForVideoReadiness(_0x25e2c1, _0xbe0641["readyTimeoutMs"]);
  if (!isRecoverySourceIdentityCurrent(_0x25e2c1, _0xbe0641, _0x457d98)) {
    return ![];
  }
  if (!_0x4e7dbf()) {
    return ![];
  }
  return !![];
}
function waitForVideoReadiness(_0x5aab78, _0x5d56dd) {
  if (!_0x5aab78 || Number(_0x5aab78['readyState'] || 0x0) >= 0x2) {
    return Promise['resolve'](!![]);
  }
  return new Promise(_0x23522f => {
    let _0x757243 = ![];
    const _0x3f0557 = ["loadeddata", "canplay", "canplaythrough", 'progress', 'error'];
    const _0x471171 = () => {
      if (_0x757243) {
        return;
      }
      _0x757243 = !![];
      clearTimeout(_0x1e87fe);
      for (const _0x50fd65 of _0x3f0557) {
        _0x5aab78["removeEventListener"]?.(_0x50fd65, _0x38a3b9);
      }
    };
    const _0x38a3b9 = () => {
      _0x471171();
      _0x23522f(Number(_0x5aab78['readyState'] || 0x0) >= 0x2);
    };
    const _0x1e87fe = setTimeout(() => {
      _0x471171();
      _0x23522f(Number(_0x5aab78["readyState"] || 0x0) >= 0x2);
    }, Math["max"](0x64, Number(_0x5d56dd || DEFAULT_READY_TIMEOUT_MS)));
    for (const _0x14c0a5 of _0x3f0557) {
      _0x5aab78['addEventListener']?.(_0x14c0a5, _0x38a3b9);
    }
  });
}
function shouldContinuePlayback(_0x3f55db) {
  if (typeof _0x3f55db["shouldContinue"] !== "function") {
    return !![];
  }
  try {
    return !!_0x3f55db["shouldContinue"]();
  } catch {
    return ![];
  }
}
function safePause(_0x3ca288) {
  try {
    _0x3ca288?.["pause"]?.();
  } catch {}
}
function resolvePlaybackIntent(_0x21482f, _0x18305e, _0x1795c9) {
  const _0x4151fc = _0x1795c9 === HOVER_PLAYBACK_INTENT ? HOVER_PLAYBACK_INTENT : EXCLUSIVE_PLAYBACK_INTENT;
  if (_0x4151fc === HOVER_PLAYBACK_INTENT && activePlaybackVideos["has"](_0x21482f) && _0x21482f?.["paused"] === ![] && _0x18305e?.["playbackIntent"] !== HOVER_PLAYBACK_INTENT) {
    return EXCLUSIVE_PLAYBACK_INTENT;
  }
  return _0x4151fc;
}
function prepareActiveVideosForPlayback(_0x4e5de9, _0x6bbb00) {
  let _0x1061e2 = ![];
  for (const _0x11b327 of Array["from"](activePlaybackVideos)) {
    if (!_0x11b327 || _0x11b327 === _0x4e5de9) {
      continue;
    }
    if (_0x11b327['isConnected'] === ![]) {
      activePlaybackVideos['delete'](_0x11b327);
      continue;
    }
    const _0x373c9d = videoRecoveryStates["get"](_0x11b327)?.['playbackIntent'] || EXCLUSIVE_PLAYBACK_INTENT;
    if (_0x6bbb00 === HOVER_PLAYBACK_INTENT && _0x373c9d !== HOVER_PLAYBACK_INTENT) {
      _0x1061e2 = !![];
      continue;
    }
    safePause(_0x11b327);
    activePlaybackVideos['delete'](_0x11b327);
  }
  return !_0x1061e2;
}
export function __resetVideoPlaybackRecoveryForTest() {
  activePlaybackVideos["clear"]();
}
function isIgnorablePlayError(_0x4a1f78) {
  const _0x400701 = _0x4a1f78 && typeof _0x4a1f78 === 'object' ? _0x4a1f78["name"] : '';
  const _0x5c30f9 = _0x4a1f78 && typeof _0x4a1f78 === "object" ? String(_0x4a1f78["message"] || '') : String(_0x4a1f78 || '');
  return _0x400701 === 'AbortError' || _0x5c30f9['includes']("interrupted by a call to pause");
}