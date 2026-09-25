import { isNodeType } from '../modules/registry.js';
import { resolveRendererLowZoomMountLimit } from './rendererVirtualization.js';
export const RENDERER_DEFER_MEDIA_ON_MOUNT_FLAG = "__rendererDeferMediaOnMount";
export const RENDERER_DEFER_DETAILS_ON_MOUNT_FLAG = "__rendererDeferDetailsOnMount";
export const RENDERER_EAGER_VIDEO_PREVIEW_ON_MOUNT_FLAG = '__rendererEagerVideoPreviewOnMount';
export const RENDERER_PREBUILD_OFFSCREEN_FLAG = '__rendererPrebuildOffscreen';
const MAX_VISIBLE_AUDIO_WARMUP_COUNT = 0x4;
export function shouldDeferRendererMediaOnMount(_0x258b52 = {}) {
  return _0x258b52?.[RENDERER_DEFER_MEDIA_ON_MOUNT_FLAG] === !![];
}
export function shouldDeferRendererDetailsOnMount(_0x44c2b1 = {}) {
  return _0x44c2b1?.[RENDERER_DEFER_DETAILS_ON_MOUNT_FLAG] === !![];
}
export function shouldUseRendererEagerVideoPreviewOnMount(_0x323a80 = {}) {
  return _0x323a80?.[RENDERER_EAGER_VIDEO_PREVIEW_ON_MOUNT_FLAG] === !![];
}
export function shouldPrebuildRendererRuntimeOffscreen(_0x947d1b = {}) {
  return _0x947d1b?.[RENDERER_PREBUILD_OFFSCREEN_FLAG] === !![];
}
export function shouldActivateRendererMediaHoverPlayback({
  viewport: _0x26178e,
  nodeCount = 0x0,
  isSelected = ![]
} = {}) {
  if (isSelected === !![]) {
    return !![];
  }
  return resolveRendererLowZoomMountLimit({
    'viewport': _0x26178e,
    'nodeCount': nodeCount
  }) <= 0x0;
}
export function withRendererDeferredMountHints(_0x4d6f46 = {}, {
  deferMedia = ![],
  deferDetails = ![],
  eagerVideoPreview = ![],
  prebuildOffscreen = ![]
} = {}) {
  if (!deferMedia && !deferDetails && !eagerVideoPreview && !prebuildOffscreen) {
    return _0x4d6f46;
  }
  return {
    ...(_0x4d6f46 || {}),
    ...(deferMedia ? {
      [RENDERER_DEFER_MEDIA_ON_MOUNT_FLAG]: !![]
    } : {}),
    ...(deferDetails ? {
      [RENDERER_DEFER_DETAILS_ON_MOUNT_FLAG]: !![]
    } : {}),
    ...(eagerVideoPreview ? {
      [RENDERER_EAGER_VIDEO_PREVIEW_ON_MOUNT_FLAG]: !![]
    } : {}),
    ...(prebuildOffscreen ? {
      [RENDERER_PREBUILD_OFFSCREEN_FLAG]: !![]
    } : {})
  };
}
export function withRendererDeferredMediaHint(_0x10eb23 = {}, _0x7c2b56 = ![]) {
  return withRendererDeferredMountHints(_0x10eb23, {
    'deferMedia': _0x7c2b56
  });
}
export function scheduleRendererVisibleAudioSurfaceHydration({
  node: _0x317480,
  nodeId: _0x47bd07,
  isVisible: _0x4dff28,
  isSelected: _0x1728e8,
  viewport: _0x4bd8fb,
  nodeCount: _0x49bfa,
  visibleAudioRank = 0x1,
  component: _0x415c0a,
  deferredMedia: _0x138f42
} = {}) {
  if (!_0x47bd07) {
    return ![];
  }
  if (!isNodeType(_0x317480, ["source-audio", "ai-audio", 'audio'])) {
    return ![];
  }
  _0x415c0a?.['setRendererAudioSurfaceVisible']?.(_0x4dff28 === !![]);
  if (_0x4dff28 !== !![]) {
    return ![];
  }
  if (_0x1728e8 !== !![] && (resolveRendererLowZoomMountLimit({
    'viewport': _0x4bd8fb,
    'nodeCount': _0x49bfa
  }) > 0x0 || Number(visibleAudioRank) > MAX_VISIBLE_AUDIO_WARMUP_COUNT)) {
    return ![];
  }
  if (_0x415c0a?.["prepareRendererVisibleAudioSurface"]?.() !== !![]) {
    return ![];
  }
  if (_0x1728e8) {
    _0x138f42?.["hydrateNow"]?.(_0x47bd07);
  } else {
    _0x138f42?.['enqueue']?.(_0x47bd07, {
      'urgent': !![]
    });
  }
  return !![];
}
export function createRendererVisibleAudioSurfaceHydrationPass({
  viewport: _0x59b5be,
  nodeCount: _0x191476,
  deferredMedia: _0x2b28bb
} = {}) {
  let _0x3f18f5 = 0x0;
  return ({
    node: _0x547ebb,
    nodeId: _0x41aa33,
    isVisible: _0x51797c,
    isSelected: _0x577997,
    component: _0x3baf01
  } = {}) => {
    const _0x571b7b = _0x577997 !== !![] && _0x51797c === !![] && isNodeType(_0x547ebb, ["source-audio", "ai-audio", "audio"]) ? _0x3f18f5 += 0x1 : 0x1;
    return scheduleRendererVisibleAudioSurfaceHydration({
      'node': _0x547ebb,
      'nodeId': _0x41aa33,
      'isVisible': _0x51797c,
      'isSelected': _0x577997,
      'viewport': _0x59b5be,
      'nodeCount': _0x191476,
      'visibleAudioRank': _0x571b7b,
      'component': _0x3baf01,
      'deferredMedia': _0x2b28bb
    });
  };
}
const DEFAULT_MEDIA_HYDRATION_BATCH_SIZE = 0x3;
const DEFAULT_MEDIA_HYDRATION_RETRY_MS = 0x78;
const DEFAULT_MEDIA_HYDRATION_FALLBACK_MS = 0x18;
const DEFAULT_MEDIA_HYDRATION_IDLE_TIMEOUT_MS = 0xb4;
const DEFAULT_VIDEO_HYDRATION_BATCH_SIZE = 0x1;
const VIDEO_MEDIA_NODE_TYPES = new Set(["source-video", 'ai-video', "video"]);
function getWindowLike() {
  return typeof window !== "undefined" ? window : globalThis;
}
function getDeferredMediaComponentType(_0xd4883) {
  return String(_0xd4883?.["_data"]?.["type"] || _0xd4883?.["nodeData"]?.["type"] || _0xd4883?.["data"]?.["type"] || '')["trim"]()['toLowerCase']();
}
function isDeferredVideoMediaComponent(_0x4b5ea1) {
  return VIDEO_MEDIA_NODE_TYPES["has"](getDeferredMediaComponentType(_0x4b5ea1));
}
export function createRendererDeferredMediaController({
  getComponent: _0x2c97f2,
  getNodeType: _0x3d5629,
  isInteractionBusy: _0x4012a1,
  onHydrateMedia: _0x4a22fc,
  onHydrateDiagnostic: _0x23fb4f,
  canHydrateMedia: _0x37476e,
  canHydrateVideo: _0x34101e,
  batchSize = DEFAULT_MEDIA_HYDRATION_BATCH_SIZE,
  videoBatchSize = DEFAULT_VIDEO_HYDRATION_BATCH_SIZE
} = {}) {
  let _0x1bed1f = [];
  let _0x36fc28 = new Set();
  let _0x798370 = new Set();
  let _0x45ecfa = null;
  let _0x328529 = '';
  let _0x55fdf3 = ![];
  const _0x513882 = Math["max"](0x1, Math["trunc"](Number(batchSize) || 0x1));
  const _0x306196 = Math["max"](0x1, Math["min"](_0x513882, Math["trunc"](Number(videoBatchSize) || 0x1)));
  const _0x508964 = (_0x57e267, _0x6b5995) => typeof _0x3d5629 === "function" ? VIDEO_MEDIA_NODE_TYPES['has'](_0x3d5629(_0x57e267)) : isDeferredVideoMediaComponent(_0x6b5995);
  function _0x18b4b4(_0x579b63) {
    const _0x471279 = _0x1bed1f["filter"](_0x3d4a49 => _0x3d4a49 !== _0x579b63);
    const _0x425f34 = _0x471279['findIndex'](_0x3339ce => !_0x798370["has"](_0x3339ce));
    if (_0x425f34 < 0x0) {
      _0x471279['push'](_0x579b63);
    } else {
      _0x471279["splice"](_0x425f34, 0x0, _0x579b63);
    }
    _0x1bed1f = _0x471279;
  }
  function _0x46ec46() {
    if (_0x45ecfa === null) {
      return;
    }
    const _0x5ac78b = getWindowLike();
    if (_0x328529 === "idle" && typeof _0x5ac78b["cancelIdleCallback"] === "function") {
      _0x5ac78b["cancelIdleCallback"](_0x45ecfa);
    } else {
      _0x328529 === "timeout" && clearTimeout(_0x45ecfa);
    }
    _0x45ecfa = null;
    _0x328529 = '';
  }
  function _0x358946(_0x2a48ba = DEFAULT_MEDIA_HYDRATION_FALLBACK_MS, _0x257fad = ![]) {
    if (_0x55fdf3 || _0x1bed1f["length"] === 0x0) {
      return;
    }
    if (_0x45ecfa !== null) {
      if (!_0x257fad) {
        return;
      }
      _0x46ec46();
    }
    const _0x20ccb1 = getWindowLike();
    if (!_0x257fad && _0x4012a1?.()) {
      _0x328529 = 'timeout';
      _0x45ecfa = setTimeout(_0x13a628, DEFAULT_MEDIA_HYDRATION_RETRY_MS);
      return;
    }
    if (_0x257fad || _0x1bed1f['length'] >= _0x513882 * 0x4) {
      _0x328529 = "timeout";
      _0x45ecfa = setTimeout(_0x13a628, Math['max'](0x0, Number(_0x2a48ba) || 0x0));
      return;
    }
    if (typeof _0x20ccb1["requestIdleCallback"] === 'function') {
      _0x328529 = "idle";
      _0x45ecfa = _0x20ccb1["requestIdleCallback"](_0x13a628, {
        'timeout': DEFAULT_MEDIA_HYDRATION_IDLE_TIMEOUT_MS
      });
      return;
    }
    _0x328529 = "timeout";
    _0x45ecfa = setTimeout(_0x13a628, Math["max"](0x0, Number(_0x2a48ba) || 0x0));
  }
  function _0x59cdcd(_0x253418) {
    _0x36fc28["delete"](_0x253418);
    _0x798370["delete"](_0x253418);
    const _0xded2f3 = _0x2c97f2?.(_0x253418);
    if (typeof _0x37476e === "function" && _0x37476e(_0x253418, _0xded2f3) !== !![]) {
      return {
        'isVideoMedia': _0x508964(_0x253418, _0xded2f3),
        'hydrated': ![]
      };
    }
    const _0x26e7eb = _0x508964(_0x253418, _0xded2f3);
    const _0x1c6096 = typeof _0x23fb4f === "function" && typeof performance !== 'undefined' && typeof performance["now"] === "function" ? performance["now"]() : 0x0;
    _0xded2f3?.["hydrateDeferredMedia"]?.();
    _0x4a22fc?.(_0x253418);
    if (typeof _0x23fb4f === "function") {
      const _0x57afef = typeof performance !== "undefined" && typeof performance["now"] === "function" ? performance["now"]() : _0x1c6096;
      _0x23fb4f({
        'nodeId': _0x253418,
        'isVideoMedia': _0x26e7eb,
        'durationMs': Math["max"](0x0, _0x57afef - _0x1c6096)
      });
    }
    return {
      'isVideoMedia': _0x26e7eb,
      'hydrated': !![]
    };
  }
  function _0x1d04fb() {
    if (typeof _0x37476e !== "function" || _0x1bed1f["length"] === 0x0) {
      return;
    }
    _0x1bed1f = _0x1bed1f["filter"](_0x337e3b => {
      if (!_0x36fc28["has"](_0x337e3b)) {
        return ![];
      }
      const _0xb403f9 = _0x2c97f2?.(_0x337e3b);
      if (_0x37476e(_0x337e3b, _0xb403f9) === !![]) {
        return !![];
      }
      _0x36fc28["delete"](_0x337e3b);
      _0x798370['delete'](_0x337e3b);
      return ![];
    });
  }
  function _0x13a628(_0x63625c = null) {
    _0x45ecfa = null;
    _0x328529 = '';
    if (_0x55fdf3) {
      return;
    }
    _0x1d04fb();
    if (_0x1bed1f["length"] === 0x0) {
      return;
    }
    const _0x467072 = _0x4012a1?.() === !![];
    if (_0x467072 && !_0x1bed1f["some"](_0x1c2cd5 => _0x798370["has"](_0x1c2cd5))) {
      _0x358946(DEFAULT_MEDIA_HYDRATION_RETRY_MS);
      return;
    }
    const _0x6f7eb2 = () => {
      if (!_0x63625c || _0x63625c['didTimeout']) {
        return !![];
      }
      if (typeof _0x63625c["timeRemaining"] !== "function") {
        return !![];
      }
      return _0x63625c['timeRemaining']() > 0x8;
    };
    let _0x47ca6c = 0x0;
    let _0xdd9f1c = 0x0;
    while (_0x1bed1f["length"] > 0x0 && _0x47ca6c < _0x513882 && _0x6f7eb2()) {
      const _0x3529f8 = _0x1bed1f["findIndex"](_0x39e92f => {
        if (!_0x36fc28['has'](_0x39e92f)) {
          return !![];
        }
        if (_0x467072 && !_0x798370["has"](_0x39e92f)) {
          return ![];
        }
        const _0x1756e3 = _0x2c97f2?.(_0x39e92f);
        return !_0x508964(_0x39e92f, _0x1756e3) || typeof _0x34101e !== "function" || _0x34101e(_0x39e92f, _0x1756e3) === !![];
      });
      if (_0x3529f8 < 0x0) {
        break;
      }
      const [_0x38190c] = _0x1bed1f["splice"](_0x3529f8, 0x1);
      if (!_0x36fc28['has'](_0x38190c)) {
        continue;
      }
      const {
        isVideoMedia: _0x31ba33,
        hydrated: _0x46759
      } = _0x59cdcd(_0x38190c);
      if (!_0x46759) {
        continue;
      }
      _0x47ca6c += 0x1;
      if (_0x31ba33) {
        _0xdd9f1c += 0x1;
        if (_0xdd9f1c >= _0x306196) {
          break;
        }
      }
    }
    if (_0x1bed1f["length"] > 0x0) {
      const _0x1d1b7e = _0x1bed1f["some"](_0x1c8a89 => _0x798370["has"](_0x1c8a89));
      _0x358946(_0x1d1b7e ? 0x0 : undefined, _0x1d1b7e);
    }
  }
  function _0x5b9fd9(_0x2156d6, _0x4fc1c9 = {}) {
    if (!_0x2156d6) {
      return;
    }
    const _0x362b24 = _0x2c97f2?.(_0x2156d6);
    if (typeof _0x37476e === 'function' && _0x37476e(_0x2156d6, _0x362b24) !== !![]) {
      _0x37ff8f(_0x2156d6);
      return;
    }
    const _0xac3895 = _0x4fc1c9?.["urgent"] === !![];
    if (_0x36fc28["has"](_0x2156d6)) {
      _0xac3895 && !_0x798370["has"](_0x2156d6) && (_0x798370["add"](_0x2156d6), _0x18b4b4(_0x2156d6), _0x358946(0x0, !![]));
      return;
    }
    _0x36fc28['add'](_0x2156d6);
    if (_0xac3895) {
      _0x798370["add"](_0x2156d6);
      _0x18b4b4(_0x2156d6);
    } else {
      _0x1bed1f["push"](_0x2156d6);
    }
    _0x358946(_0xac3895 ? 0x0 : undefined, _0xac3895);
  }
  function _0x37ff8f(_0x5075b6) {
    if (!_0x5075b6) {
      return;
    }
    _0x36fc28['delete'](_0x5075b6);
    _0x798370["delete"](_0x5075b6);
  }
  function _0x37fe9d(_0x2635b9) {
    if (!_0x2635b9 || _0x55fdf3) {
      return null;
    }
    _0x36fc28["delete"](_0x2635b9);
    _0x798370["delete"](_0x2635b9);
    _0x1bed1f = _0x1bed1f["filter"](_0x44d709 => _0x44d709 !== _0x2635b9);
    const _0x6c5ab0 = _0x2c97f2?.(_0x2635b9);
    if (typeof _0x37476e === 'function' && _0x37476e(_0x2635b9, _0x6c5ab0) !== !![]) {
      return null;
    }
    return _0x59cdcd(_0x2635b9);
  }
  function _0x9002d6() {
    _0x46ec46();
    _0x1bed1f = [];
    _0x36fc28 = new Set();
    _0x798370 = new Set();
  }
  return {
    'clear': _0x9002d6,
    'enqueue': _0x5b9fd9,
    'flush': _0x13a628,
    'forget': _0x37ff8f,
    'hydrateNow': _0x37fe9d,
    'pause': () => {
      _0x55fdf3 = !![];
      _0x46ec46();
    },
    'resume': () => {
      _0x55fdf3 = ![];
      _0x358946();
    },
    'getQueuedCount': () => _0x36fc28["size"]
  };
}