import { sanitizeMultiCanvasDataForPersistence as a926_0x562701, sanitizeSerializedCanvasData } from '../../utils/thumbnailPersistence.js';
import { buildUniqueCanvasName, isCanvasProjectFileName, stripCanvasProjectFileExtension } from '../../utils/canvasProjectFileNames.js';
import { buildImageNodeStorageFields, needsImageDerivatives } from '../../services/imageDerivativeService.js';
import { buildCanvasLocalImageFields } from '../../services/canvasMediaLocalService.js';
import { resolveGenerationTaskIdentity } from '../../core/generationExecutionPlan.js';
import { createStableSignature } from '../../utils/stableSignature.js';
import { normalizeLocalPath, pickResultLocalPath } from '../../utils/localMediaPath.js';
import { isModelApiModel, isWorkflowModel as a926_0x3d0703, resolveModelProvider } from '../../manifests/index.js';
import { t } from '../../i18n/index.js';
import { desktopBridge } from '../../services/desktopBridge.js';
import { cancelStartupLoaderGuard } from '../../services/startupLoaderGuard.js';
import { rendererStartupState } from '../../services/rendererStartupState.js';
import { createWorkspaceCacheIdleScheduler, isWorkspaceCacheInteractionBusy } from './workspaceCacheIdleScheduler.js';
export { createStableSignature } from '../../utils/stableSignature.js';
const BOOT_PERF_MEASURE_NAMES = ['project.loadProject', "buildHydrationSafeMultiData", "hydrateTrustedSnapshot", "CanvasTabManager.init", "loader hidden", "historicalAiLocalization queued"];
const WORKSPACE_META_KEY = "workspace_meta";
const LEGACY_WORKSPACE_KEY = "current_state";
const WORKSPACE_CANVAS_KEY_PREFIX = "workspace_canvas::";
const PROJECT_WORKSPACE_META_KEY_PREFIX = "project_workspace_meta::";
const PROJECT_WORKSPACE_CANVAS_KEY_PREFIX = "project_workspace_canvas::";
const DREAMINA_RESUME_BACKUP_KEY = "tapnow_v2_dreamina_resume_backup";
const PAGE_LIFECYCLE_FLUSH_DEDUPE_MS = 0x7d0;
const RECOVERY_SNAPSHOT_DEDUPE_MS = 0x1388;
const PERSISTABLE_SNAPSHOT_REUSE_MS = 0x4b0;
const WORKSPACE_CACHE_PERSIST_DELAY_MS = 0x3e8;
const WORKSPACE_CACHE_META_DELAY_MS = 0x96;
const WORKSPACE_CACHE_BUSY_RETRY_MS = 0xfa;
const INITIAL_LOADER_MAX_VISIBLE_MS = 0x2710;
const INITIAL_IMAGE_READY_POLL_MS = 0x4b;
const INITIAL_IMAGE_READY_MAX_ATTEMPTS = 0x1e;
const INITIAL_IMAGE_READY_MIN_RATIO = 0.8;
const INITIAL_IMAGE_READY_MIN_ATTEMPTS = 0x4;
const INITIAL_IMAGE_READY_STABLE_POLLS = 0x2;
const INITIAL_IMAGE_REVEAL_MAX_ITEMS = 0xc;
const INITIAL_REVEAL_IDLE_TIMEOUT_MS = 0x1f4;
const INITIAL_PROGRESS_FINISH_MS = 0x118;
const INITIAL_IMAGE_REVEAL_BASE_MS = 0x2a8;
const INITIAL_IMAGE_REVEAL_STAGGER_MS = 0x3c;
const INITIAL_IMAGE_REVEAL_MAX_STAGGER_INDEX = 0x5;
const INITIAL_BRAND_IMAGE_HANDOFF_MS = 0x8c;
const INITIAL_BACKGROUND_REVEAL_MS = 0x168;
const INITIAL_IMAGE_LAYER_HANDOFF_MS = 0x64;
const INITIAL_REVEAL_FRAME_TIMEOUT_MS = 0x60;
const INITIAL_CANVAS_IMAGE_NODE_TYPES = new Set(['ai-image', "image", "source-image", "source_image"]);
const DREAMINA_RESUME_BACKUP_FIELDS = ['canvasId', 'nodeId', "generationStartTime", "generationDuration", "dreaminaSubmitId", "dreaminaTaskStatus", 'dreaminaTaskPhase', "dreaminaTaskLabel", "dreaminaTaskStartedAt", 'dreaminaTaskLastCheckedAt', "dreaminaTaskRecovering", "dreaminaTaskLastRaw"];
export function resolveInitialLoaderMinimumVisibleMs(_0x591659, {
  windowObject = globalThis["window"]
} = {}) {
  if (windowObject?.["matchMedia"]?.("(prefers-reduced-motion: reduce)")?.["matches"]) {
    return 0x0;
  }
  const _0x1759aa = Number(_0x591659?.["dataset"]?.['minVisibleMs']);
  if (!Number["isFinite"](_0x1759aa) || _0x1759aa <= 0x0) {
    return 0x0;
  }
  return Math['min'](INITIAL_LOADER_MAX_VISIBLE_MS, Math["round"](_0x1759aa));
}
export function waitForInitialLoaderSequence({
  loader: _0xada6f3,
  windowObject = globalThis["window"],
  scheduleTimeout = globalThis["setTimeout"]
} = {}) {
  const _0x576a59 = resolveInitialLoaderMinimumVisibleMs(_0xada6f3, {
    'windowObject': windowObject
  });
  if (_0x576a59 <= 0x0 || typeof scheduleTimeout !== "function") {
    return Promise["resolve"]();
  }
  return new Promise(_0x15dc5f => {
    scheduleTimeout(_0x15dc5f, _0x576a59);
  });
}
export function waitForInitialRevealFrame({
  windowObject = globalThis["window"],
  scheduleTimeout = globalThis["setTimeout"],
  cancelTimeout = globalThis["clearTimeout"],
  timeoutMs = INITIAL_REVEAL_FRAME_TIMEOUT_MS
} = {}) {
  return new Promise(_0x2ce454 => {
    let _0x5af7ad = ![];
    let _0x4691d9 = null;
    const _0xd9b3fa = () => {
      if (_0x5af7ad) {
        return;
      }
      _0x5af7ad = !![];
      _0x2ce454();
    };
    const _0xeeac7a = typeof windowObject?.["requestAnimationFrame"] === "function";
    const _0x33d76c = _0xeeac7a ? Math['max'](0x10, Number(timeoutMs) || INITIAL_REVEAL_FRAME_TIMEOUT_MS) : 0x10;
    typeof scheduleTimeout === "function" && (_0x4691d9 = scheduleTimeout(_0xd9b3fa, _0x33d76c));
    if (!_0xeeac7a) {
      if (_0x4691d9 === null) {
        _0xd9b3fa();
      }
      return;
    }
    try {
      windowObject["requestAnimationFrame"](() => {
        _0x4691d9 !== null && typeof cancelTimeout === "function" && cancelTimeout(_0x4691d9);
        _0xd9b3fa();
      });
    } catch {
      _0xd9b3fa();
    }
  });
}
export function scheduleInitialLoaderFailOpen({
  loader: _0x21fe92,
  wrapEl: _0x238277,
  canvasEl: _0x53ad21,
  timeoutMs = INITIAL_LOADER_MAX_VISIBLE_MS,
  scheduleTimeout = globalThis["setTimeout"],
  cancelTimeout = globalThis["clearTimeout"],
  onTimeout: _0x3d644a,
  shouldReveal = () => _0x21fe92?.["dataset"]?.["appReady"] === "true"
} = {}) {
  if (!_0x21fe92 || typeof scheduleTimeout !== 'function') {
    return () => {};
  }
  let _0x2dc83e = !![];
  const _0x4b09e9 = scheduleTimeout(() => {
    if (!_0x2dc83e) {
      return;
    }
    _0x2dc83e = ![];
    if (!shouldReveal()) {
      return;
    }
    if (_0x53ad21) {
      _0x53ad21['style']["transition"] = '';
    }
    _0x238277 && (_0x238277["style"]["transition"] = '', _0x238277["style"]["opacity"] = '1', _0x238277["classList"]?.["remove"]?.('is-initial-header-locked'));
    _0x21fe92['style']["opacity"] = '0';
    _0x21fe92['style']['visibility'] = "hidden";
    _0x21fe92["remove"]?.();
    _0x3d644a?.();
  }, Math["max"](0x0, Number(timeoutMs) || INITIAL_LOADER_MAX_VISIBLE_MS));
  return () => {
    if (!_0x2dc83e) {
      return;
    }
    _0x2dc83e = ![];
    if (typeof cancelTimeout === 'function') {
      cancelTimeout(_0x4b09e9);
    }
  };
}
export function hasInitialCanvasImageNodes(_0x12e248) {
  const _0x201bab = _0x429883 => String(_0x429883 || '')["trim"]()['length'] > 0x0;
  const _0x33413a = _0x357089 => !!_0x357089 && [_0x357089["imageUrl"], _0x357089["localPath"], _0x357089["originalLocalPath"], _0x357089["displayLocalPath"], _0x357089["sourceUrl"], _0x357089["src"], _0x357089["thumbId"], _0x357089['thumbUrl'], _0x357089["url"]]["some"](_0x201bab);
  return Object["values"](_0x12e248 || {})["some"](_0x2dd304 => {
    if (!INITIAL_CANVAS_IMAGE_NODE_TYPES["has"](String(_0x2dd304?.["type"] || '')["trim"]()["toLowerCase"]())) {
      return ![];
    }
    if (Array["isArray"](_0x2dd304?.["images"]) && _0x2dd304['images']["some"](_0x33413a)) {
      return !![];
    }
    return _0x33413a(_0x2dd304);
  });
}
function getInitialRevealImageSource(_0x936631) {
  return String(_0x936631?.['currentSrc'] || _0x936631?.["getAttribute"]?.('src') || _0x936631?.["src"] || _0x936631?.["dataset"]?.["lazySrc"] || _0x936631?.["dataset"]?.['lazyPreviewSrc'] || '')["trim"]();
}
function getInitialRevealImages(_0xe6567d) {
  return Array["from"](_0xe6567d?.['querySelectorAll']?.('img.node-img,\x20img.aigen-image-media,\x20.multi-images-container\x20img.v2-media-preview,\x20img.v2-fast-preview-media') || [])["filter"](_0x7775cb => getInitialRevealImageSource(_0x7775cb));
}
function isInitialRevealImageReady(_0x37493a) {
  return getInitialRevealImageSource(_0x37493a) && _0x37493a?.['complete'] === !![] && Number(_0x37493a?.["naturalWidth"] || 0x0) > 0x0;
}
export function collectInitialImageRevealTargets(_0x249c2a) {
  return Array["from"](_0x249c2a?.["querySelectorAll"]?.(".v2-node.image-node") || [])["filter"](_0x11a0ac => getInitialRevealImages(_0x11a0ac)["length"] > 0x0);
}
function getInitialRasterRevealRect(_0x5c8dbf, _0x193087, _0x5ceb00) {
  const _0x21ff31 = getInitialRevealImageRect(_0x5c8dbf);
  const _0x5174e9 = Number(_0x5ceb00?.["width"]);
  const _0x2f082a = Number(_0x5ceb00?.['height']);
  if (!_0x21ff31 || !(_0x5174e9 > 0x0) || !(_0x2f082a > 0x0) || ![_0x193087?.['x'], _0x193087?.['y'], _0x193087?.["width"], _0x193087?.["height"]]["every"](_0x24977d => Number['isFinite'](Number(_0x24977d)))) {
    return null;
  }
  const _0x368184 = _0x21ff31["width"] / _0x5174e9;
  const _0x1a58b7 = _0x21ff31['height'] / _0x2f082a;
  const _0x2d71a6 = _0x21ff31["left"] + (Number(_0x193087['x']) - Number(_0x5ceb00['left'] || 0x0)) * _0x368184;
  const _0x5a4e65 = _0x21ff31['top'] + (Number(_0x193087['y']) - Number(_0x5ceb00["top"] || 0x0)) * _0x1a58b7;
  const _0x46cf9f = Number(_0x193087['width']) * _0x368184;
  const _0xb3a4c3 = Number(_0x193087["height"]) * _0x1a58b7;
  return {
    'left': _0x2d71a6,
    'top': _0x5a4e65,
    'right': _0x2d71a6 + _0x46cf9f,
    'bottom': _0x5a4e65 + _0xb3a4c3,
    'width': _0x46cf9f,
    'height': _0xb3a4c3
  };
}
function isInitialRevealEntryInViewport(_0xe4abdf, {
  viewportWidth: _0x1e2e66,
  viewportHeight: _0x3645d5
} = {}) {
  const _0x1e74f9 = _0xe4abdf?.["rect"];
  if (!_0x1e74f9) {
    return ![];
  }
  return (_0x1e2e66 <= 0x0 || _0x1e74f9["right"] > 0x0 && _0x1e74f9["left"] < _0x1e2e66) && (_0x3645d5 <= 0x0 || _0x1e74f9["bottom"] > 0x0 && _0x1e74f9["top"] < _0x3645d5);
}
export function collectInitialImageRevealEntries(_0x3bdd59, {
  windowObject = globalThis['window']
} = {}) {
  const _0x481c6e = Number(windowObject?.['innerWidth'] || 0x0);
  const _0x935e3c = Number(windowObject?.["innerHeight"] || 0x0);
  const _0x5d5e04 = [];
  const _0x36624f = Array["from"](_0x3bdd59?.['querySelectorAll']?.(".v2-node.image-node, .v2-fast-preview-node--image") || []);
  for (const _0x2e65d3 of _0x36624f) {
    const _0x2d9d39 = getInitialRevealImages(_0x2e65d3)[0x0];
    const _0x3ed25b = getInitialRevealImageSource(_0x2d9d39);
    const _0x4b2c72 = getInitialRevealImageRect(_0x2d9d39);
    if (!_0x3ed25b || !_0x4b2c72) {
      continue;
    }
    _0x5d5e04['push']({
      'image': _0x2d9d39,
      'nodeId': String(_0x2e65d3?.['id'] || _0x2e65d3?.["dataset"]?.["nodeId"] || ''),
      'ready': isInitialRevealImageReady(_0x2d9d39),
      'rect': _0x4b2c72,
      'source': _0x3ed25b
    });
  }
  const _0x108c09 = Array["from"](_0x3bdd59?.["querySelectorAll"]?.('.v2-raster-preview-canvas') || []);
  for (const _0x3b4e4d of _0x108c09) {
    const _0x2cf39f = _0x3b4e4d?.["__aicanvasRasterPreviewStats"]?.['worldBounds'];
    for (const _0x5c12d2 of _0x3b4e4d?.["__aicanvasRasterPreviewRevealItems"] || []) {
      const _0x252825 = String(_0x5c12d2?.['source'] || '')["trim"]();
      const _0x50be34 = getInitialRasterRevealRect(_0x3b4e4d, _0x5c12d2, _0x2cf39f);
      if (!_0x252825 || !_0x50be34) {
        continue;
      }
      _0x5d5e04["push"]({
        'image': null,
        'nodeId': String(_0x5c12d2?.['nodeId'] || ''),
        'objectFit': "cover",
        'objectPosition': "50% 50%",
        'ready': _0x5c12d2?.["ready"] === !![],
        'rect': _0x50be34,
        'source': _0x252825
      });
    }
  }
  const _0x1ade21 = new Set();
  return _0x5d5e04["filter"](_0x1bf7a1 => {
    if (!isInitialRevealEntryInViewport(_0x1bf7a1, {
      'viewportWidth': _0x481c6e,
      'viewportHeight': _0x935e3c
    })) {
      return ![];
    }
    if (!_0x1bf7a1["nodeId"]) {
      return !![];
    }
    if (_0x1ade21['has'](_0x1bf7a1["nodeId"])) {
      return ![];
    }
    _0x1ade21["add"](_0x1bf7a1["nodeId"]);
    return !![];
  });
}
export function shouldUseInitialImageFirstReveal({
  nodes: _0x12c122,
  targetCount: _0x3e46f1,
  reducedMotion = ![]
} = {}) {
  return reducedMotion !== !![] && hasInitialCanvasImageNodes(_0x12c122) && Number(_0x3e46f1 || 0x0) > 0x0;
}
export function resolveInitialImageRevealDurationMs(_0x39a290) {
  const _0x19ea67 = Math["min"](INITIAL_IMAGE_REVEAL_MAX_STAGGER_INDEX, Math["max"](0x0, Math["floor"](Number(_0x39a290 || 0x0)) - 0x1));
  return INITIAL_IMAGE_REVEAL_BASE_MS + _0x19ea67 * INITIAL_IMAGE_REVEAL_STAGGER_MS;
}
export function resolveInitialImageRevealVector(_0x300590) {
  const _0x2a9025 = [{
    'x': "-42vw",
    'y': "0px",
    'rotation': "-7deg"
  }, {
    'x': "0px",
    'y': "-38vh",
    'rotation': "5deg"
  }, {
    'x': "42vw",
    'y': "0px",
    'rotation': '7deg'
  }, {
    'x': "0px",
    'y': "38vh",
    'rotation': "-5deg"
  }];
  const _0x3160fd = Math["max"](0x0, Math["floor"](Number(_0x300590) || 0x0));
  return _0x2a9025[_0x3160fd % _0x2a9025['length']];
}
export function shouldFinishInitialImageReadinessWait({
  totalCount: _0x3bff09,
  readyCount: _0x3a55f9,
  stablePollCount: _0xa1e334,
  attempt: _0xef4a7
} = {}) {
  const _0x33d5e3 = Math['max'](0x0, Math['floor'](Number(_0x3bff09) || 0x0));
  const _0x30fa74 = Math["max"](0x0, Math["floor"](Number(_0x3a55f9) || 0x0));
  if (_0x33d5e3 <= 0x0) {
    return Number(_0xef4a7 || 0x0) >= 0x2;
  }
  if (_0x30fa74 >= _0x33d5e3) {
    return !![];
  }
  return Number(_0xef4a7 || 0x0) >= INITIAL_IMAGE_READY_MIN_ATTEMPTS && _0x30fa74 / _0x33d5e3 >= INITIAL_IMAGE_READY_MIN_RATIO && Number(_0xa1e334 || 0x0) >= INITIAL_IMAGE_READY_STABLE_POLLS;
}
export function selectInitialImageRevealEntries(_0x33eba5, {
  maxItems = INITIAL_IMAGE_REVEAL_MAX_ITEMS
} = {}) {
  const _0x36890a = Array["isArray"](_0x33eba5) ? _0x33eba5 : [];
  const _0x22fd9d = Math["max"](0x0, Math["floor"](Number(maxItems) || 0x0));
  if (_0x22fd9d <= 0x0 || _0x36890a["length"] === 0x0) {
    return [];
  }
  if (_0x36890a["length"] <= _0x22fd9d) {
    return [..._0x36890a];
  }
  if (_0x22fd9d === 0x1) {
    return [_0x36890a[Math['floor']((_0x36890a["length"] - 0x1) / 0x2)]];
  }
  return Array["from"]({
    'length': _0x22fd9d
  }, (_0x28dc3e, _0x170953) => {
    const _0x3c8e07 = Math["round"](_0x170953 * (_0x36890a['length'] - 0x1) / (_0x22fd9d - 0x1));
    return _0x36890a[_0x3c8e07];
  });
}
function getInitialRevealImageRect(_0x78bd67) {
  const _0xa3a842 = _0x78bd67?.["getBoundingClientRect"]?.();
  if (!_0xa3a842 || !Number["isFinite"](_0xa3a842['left']) || !Number["isFinite"](_0xa3a842["top"]) || !Number['isFinite'](_0xa3a842["width"]) || !Number["isFinite"](_0xa3a842["height"]) || _0xa3a842["width"] <= 0x1 || _0xa3a842['height'] <= 0x1) {
    return null;
  }
  return {
    'left': _0xa3a842["left"],
    'top': _0xa3a842["top"],
    'right': Number['isFinite'](_0xa3a842["right"]) ? _0xa3a842['right'] : _0xa3a842["left"] + _0xa3a842["width"],
    'bottom': Number['isFinite'](_0xa3a842['bottom']) ? _0xa3a842["bottom"] : _0xa3a842['top'] + _0xa3a842["height"],
    'width': _0xa3a842["width"],
    'height': _0xa3a842["height"]
  };
}
function scaleInitialRevealPixelLengths(_0x3b7a96, _0x39ef96) {
  const _0x2a2c3e = Number["isFinite"](Number(_0x39ef96)) && Number(_0x39ef96) > 0x0 ? Number(_0x39ef96) : 0x1;
  return String(_0x3b7a96 || '')["replace"](/(-?(?:\d+(?:\.\d+)?|\.\d+))px\b/gi, (_0x48757c, _0x4ecb53) => {
    const _0x5016a2 = Math['round'](Number(_0x4ecb53) * _0x2a2c3e * 0x3e8) / 0x3e8;
    return (Object['is'](_0x5016a2, -0x0) ? 0x0 : _0x5016a2) + 'px';
  });
}
function resolveInitialRevealScale(_0xa2abd, _0x25da3d) {
  const _0x296729 = Number(_0xa2abd?.["offsetWidth"]);
  const _0x4e5313 = Number(_0xa2abd?.['offsetHeight']);
  const _0x52262c = Number['isFinite'](_0x296729) && _0x296729 > 0x0 ? _0x25da3d["width"] / _0x296729 : 0x1;
  const _0x1ac716 = Number["isFinite"](_0x4e5313) && _0x4e5313 > 0x0 ? _0x25da3d['height'] / _0x4e5313 : _0x52262c;
  return {
    'scaleX': _0x52262c,
    'scaleY': _0x1ac716
  };
}
function resolveInitialRevealBorderRadius(_0x162b44, _0x48698e, _0xcf2e41) {
  const _0x355ce0 = String(_0xcf2e41 || '')["trim"]() || '0';
  const {
    scaleX: _0x41970a,
    scaleY: _0x4fbab7
  } = resolveInitialRevealScale(_0x162b44, _0x48698e);
  const [_0x32b4f7, _0x572f5b] = _0x355ce0["split"](/\s*\/\s*/, 0x2);
  if (_0x572f5b) {
    return scaleInitialRevealPixelLengths(_0x32b4f7, _0x41970a) + " / " + scaleInitialRevealPixelLengths(_0x572f5b, _0x4fbab7);
  }
  if (Math["abs"](_0x41970a - _0x4fbab7) < 0.001) {
    return scaleInitialRevealPixelLengths(_0x355ce0, _0x41970a);
  }
  return scaleInitialRevealPixelLengths(_0x355ce0, _0x41970a) + " / " + scaleInitialRevealPixelLengths(_0x355ce0, _0x4fbab7);
}
function resolveInitialRevealClipPath(_0x2ad774, _0x5155b6, _0x5dc770) {
  const _0x284bf1 = String(_0x5dc770 || '')["trim"]() || "none";
  if (_0x284bf1 === "none") {
    return _0x284bf1;
  }
  const {
    scaleX: _0x4509f8,
    scaleY: _0x132e9d
  } = resolveInitialRevealScale(_0x2ad774, _0x5155b6);
  return scaleInitialRevealPixelLengths(_0x284bf1, Math['min'](_0x4509f8, _0x132e9d));
}
function isInitialRevealImageInViewport(_0x41f6b7, {
  viewportWidth: _0xa60ad5,
  viewportHeight: _0x4a75e3
} = {}) {
  const _0x22b5e7 = getInitialRevealImageRect(_0x41f6b7);
  if (!_0x22b5e7) {
    return ![];
  }
  return (_0xa60ad5 <= 0x0 || _0x22b5e7["right"] > 0x0 && _0x22b5e7['left'] < _0xa60ad5) && (_0x4a75e3 <= 0x0 || _0x22b5e7['bottom'] > 0x0 && _0x22b5e7["top"] < _0x4a75e3);
}
export function createInitialImageRevealLayer({
  loader: _0x476a7b,
  imageTargets: _0x5a1f0d,
  documentObject = globalThis["document"],
  windowObject = globalThis["window"]
} = {}) {
  if (!_0x476a7b?.['appendChild'] || !documentObject?.["createElement"] || !Array["isArray"](_0x5a1f0d)) {
    return null;
  }
  const _0x2a78da = documentObject["createElement"]('div');
  _0x2a78da["className"] = "initial-image-reveal-layer";
  _0x2a78da["setAttribute"]?.("aria-hidden", "true");
  const _0x32b4f9 = Number(windowObject?.["innerWidth"] || documentObject?.['documentElement']?.["clientWidth"] || 0x0);
  const _0x1699d3 = Number(windowObject?.["innerHeight"] || documentObject?.["documentElement"]?.["clientHeight"] || 0x0);
  const _0x47278d = _0x5a1f0d["flatMap"](_0x24c520 => {
    const _0x238ba0 = _0x24c520?.['rect'] && _0x24c520?.["source"] ? _0x24c520 : null;
    const _0x189172 = _0x238ba0 ? _0x238ba0["image"] : getInitialRevealImages(_0x24c520)["find"](isInitialRevealImageReady);
    const _0x380098 = _0x238ba0?.["rect"] || getInitialRevealImageRect(_0x189172);
    const _0xe59e29 = _0x238ba0?.["source"] || getInitialRevealImageSource(_0x189172);
    if (_0x238ba0?.["ready"] === ![] || !_0xe59e29 || !_0x380098 || _0x32b4f9 > 0x0 && (_0x380098["right"] <= 0x0 || _0x380098["left"] >= _0x32b4f9) || _0x1699d3 > 0x0 && (_0x380098["bottom"] <= 0x0 || _0x380098["top"] >= _0x1699d3)) {
      return [];
    }
    return [{
      ..._0x238ba0,
      'image': _0x189172,
      'rect': _0x380098,
      'source': _0xe59e29
    }];
  });
  _0x47278d['sort']((_0x4160de, _0x47ebdb) => {
    const _0x55bd5c = _0x4160de['rect']["top"] + _0x4160de["rect"]["height"] / 0x2;
    const _0xbe2d41 = _0x47ebdb["rect"]['top'] + _0x47ebdb['rect']['height'] / 0x2;
    if (_0x55bd5c !== _0xbe2d41) {
      return _0x55bd5c - _0xbe2d41;
    }
    return _0x4160de["rect"]['left'] + _0x4160de["rect"]["width"] / 0x2 - (_0x47ebdb["rect"]["left"] + _0x47ebdb["rect"]["width"] / 0x2);
  });
  selectInitialImageRevealEntries(_0x47278d)["forEach"](({
    image: _0x1ef51c,
    rect: _0x24f083,
    source: _0x2998ac,
    objectFit: _0xe513c6,
    objectPosition: _0x22e0ff,
    borderRadius: _0xe0d636,
    clipPath: _0x247969
  }, _0x512532) => {
    const _0x564940 = documentObject['createElement']("img");
    const _0x209225 = resolveInitialImageRevealVector(_0x512532);
    const _0xaa2755 = _0x1ef51c ? windowObject?.["getComputedStyle"]?.(_0x1ef51c) : null;
    _0x564940['className'] = "initial-image-reveal-item";
    _0x564940["alt"] = '';
    _0x564940["draggable"] = ![];
    _0x564940["decoding"] = "sync";
    _0x564940["loading"] = "eager";
    _0x564940['src'] = _0x2998ac;
    _0x564940["style"]['left'] = _0x24f083["left"] + 'px';
    _0x564940["style"]["top"] = _0x24f083['top'] + 'px';
    _0x564940["style"]["width"] = _0x24f083["width"] + 'px';
    _0x564940["style"]["height"] = _0x24f083["height"] + 'px';
    _0x564940["style"]["objectFit"] = _0xe513c6 || _0xaa2755?.["objectFit"] || "cover";
    _0x564940["style"]["objectPosition"] = _0x22e0ff || _0xaa2755?.["objectPosition"] || '50%\x2050%';
    _0x564940['style']['borderRadius'] = _0x1ef51c ? resolveInitialRevealBorderRadius(_0x1ef51c, _0x24f083, _0xe0d636 || _0xaa2755?.["borderRadius"]) : _0xe0d636 || '0';
    _0x564940["style"]['clipPath'] = _0x1ef51c ? resolveInitialRevealClipPath(_0x1ef51c, _0x24f083, _0x247969 || _0xaa2755?.["clipPath"]) : _0x247969 || "none";
    _0x564940["style"]["setProperty"]('--initial-image-reveal-index', String(Math["min"](_0x512532, INITIAL_IMAGE_REVEAL_MAX_STAGGER_INDEX)));
    _0x564940["style"]['setProperty']('--initial-image-from-x', _0x209225['x']);
    _0x564940["style"]["setProperty"]("--initial-image-from-y", _0x209225['y']);
    _0x564940['style']["setProperty"]("--initial-image-from-rotation", _0x209225["rotation"]);
    _0x2a78da["appendChild"](_0x564940);
  });
  if (!_0x2a78da["childElementCount"]) {
    _0x2a78da["remove"]?.();
    return null;
  }
  _0x476a7b["appendChild"](_0x2a78da);
  return _0x2a78da;
}
function getUntitledProjectName() {
  return t("projectLifecycle.untitledProject");
}
function getUntitledCanvasName() {
  return t('projectLifecycle.untitledCanvas');
}
function getDefaultCanvasName() {
  return t('projectLifecycle.defaultCanvas');
}
function buildWorkspaceCanvasKey(_0x51b789) {
  return '' + WORKSPACE_CANVAS_KEY_PREFIX + String(_0x51b789 || '')["trim"]();
}
function normalizeProjectWorkspaceId(_0x14fbef) {
  return stripCanvasProjectFileExtension(String(_0x14fbef || '')["trim"]())["toLowerCase"]();
}
function buildProjectWorkspaceMetaKey(_0x3eb2d6) {
  return '' + PROJECT_WORKSPACE_META_KEY_PREFIX + encodeURIComponent(normalizeProjectWorkspaceId(_0x3eb2d6));
}
function buildProjectWorkspaceCanvasKey(_0x449856, _0x1a7178) {
  return '' + PROJECT_WORKSPACE_CANVAS_KEY_PREFIX + encodeURIComponent(normalizeProjectWorkspaceId(_0x449856)) + '::' + encodeURIComponent(String(_0x1a7178 || '')["trim"]());
}
function inferAsyncProviderByModel(_0x234ab4, _0x16f3df = '') {
  const _0x1bc8bf = resolveModelProvider(_0x234ab4, '', {
    'allowProviderHint': ![]
  });
  if (_0x1bc8bf) {
    return _0x1bc8bf;
  }
  const _0x218df9 = String(_0x16f3df || '')["trim"]()["toLowerCase"]();
  if (_0x218df9) {
    return _0x218df9;
  }
  const _0x38bdc8 = String(_0x234ab4 || '')['trim']();
  if (_0x38bdc8 && !_0x38bdc8["includes"]('/')) {
    return "grsai";
  }
  return "grsai";
}
function getGenerationKindForNode(_0x5e7315) {
  const _0x1511d1 = String(_0x5e7315?.["type"] || '')['trim']()["toLowerCase"]();
  if (_0x1511d1["includes"]("video")) {
    return "video";
  }
  if (_0x1511d1["includes"]("audio")) {
    return "audio";
  }
  if (_0x1511d1['includes']("image")) {
    return "image";
  }
  return "generation";
}
function resolveProjectLifecycleTaskIdentity(_0x50db45, _0x567053) {
  const _0x1dd85b = String(_0x567053 || '')['trim']();
  const _0x35a0d1 = _0x1dd85b === "asyncModelApi" ? inferAsyncProviderByModel(_0x50db45?.['model'], _0x50db45?.["asyncTaskProvider"] || _0x50db45?.['provider'] || '') : '';
  return resolveGenerationTaskIdentity({
    'kind': getGenerationKindForNode(_0x50db45),
    'node': _0x50db45,
    'taskProtocol': _0x1dd85b,
    'provider': _0x35a0d1
  });
}
function isDreaminaResumeCandidateNode(_0x558849) {
  if (!_0x558849 || typeof _0x558849 !== "object") {
    return ![];
  }
  const _0x24cdd8 = String(_0x558849["type"] || '')["trim"]()["toLowerCase"]();
  if (!["ai-video", 'ai-image', 'source-image', "source-video"]["includes"](_0x24cdd8)) {
    return ![];
  }
  const _0x5e3474 = String(_0x558849["provider"] || '')['trim']()['toLowerCase']();
  const _0x5878d2 = String(_0x558849["model"] || '')["trim"]();
  const _0x1a3363 = _0x5e3474 === "dreamina" || resolveModelProvider(_0x5878d2, _0x5e3474) === 'dreamina';
  if (!_0x1a3363) {
    return ![];
  }
  if (hasDreaminaResultError(_0x558849)) {
    return ![];
  }
  const _0x45501f = String(_0x558849["jobStatus"] || '')['trim']()["toLowerCase"]();
  if (_0x45501f === "error" || _0x45501f === 'failed') {
    return ![];
  }
  if (String(_0x558849["jobError"] || '')['trim']()) {
    return ![];
  }
  const _0x4cb6f9 = resolveProjectLifecycleTaskIdentity(_0x558849, "dreamina");
  if (!_0x4cb6f9["taskId"]) {
    return ![];
  }
  const _0x135c9e = String(_0x558849['dreaminaTaskPhase'] || '')['trim']()["toLowerCase"]();
  const _0x4cb02e = String(_0x558849["dreaminaTaskStatus"] || '')['trim']()["toLowerCase"]();
  if (_0x135c9e === "done" || _0x135c9e === "failed") {
    return ![];
  }
  if (_0x4cb02e === "failed") {
    return ![];
  }
  return !![];
}
function hasDreaminaUsableResult(_0x190169) {
  const _0x210297 = [_0x190169?.["images"], _0x190169?.["videos"]]['filter'](Array["isArray"]);
  return _0x210297["some"](_0x243c74 => _0x243c74['some'](_0x5d74c4 => {
    if (!_0x5d74c4 || typeof _0x5d74c4 !== 'object') {
      return ![];
    }
    return !!String(_0x5d74c4["localPath"] || _0x5d74c4["originalLocalPath"] || _0x5d74c4["displayLocalPath"] || _0x5d74c4["thumbLocalPath"] || _0x5d74c4['imageUrl'] || _0x5d74c4["videoUrl"] || _0x5d74c4["thumbUrl"] || _0x5d74c4["sourceUrl"] || '')["trim"]();
  }));
}
function hasDreaminaResultError(_0x36a05) {
  const _0x28323e = [_0x36a05?.["images"], _0x36a05?.['videos']]["filter"](Array["isArray"]);
  if (_0x28323e['length'] === 0x0) {
    return ![];
  }
  if (hasDreaminaUsableResult(_0x36a05)) {
    return ![];
  }
  return _0x28323e["some"](_0x5980ec => _0x5980ec["some"](_0x1856e0 => _0x1856e0 && typeof _0x1856e0 === 'object' && String(_0x1856e0["error"] || _0x1856e0["message"] || '')["trim"]()));
}
function isAsyncResumeCandidateNode(_0x33d9bd) {
  if (!_0x33d9bd || typeof _0x33d9bd !== "object") {
    return ![];
  }
  const _0x22e915 = String(_0x33d9bd["type"] || '')["trim"]()['toLowerCase']();
  if (!["ai-video", "ai-image", "source-video", "source-image"]["includes"](_0x22e915)) {
    return ![];
  }
  const _0x21e2a4 = resolveProjectLifecycleTaskIdentity(_0x33d9bd, "asyncModelApi");
  if (!_0x21e2a4["taskId"]) {
    return ![];
  }
  const _0x3ba135 = _0x21e2a4['provider'];
  if (!_0x3ba135 || _0x3ba135 === "runninghubwf" || _0x3ba135 === 'runninghub' || _0x3ba135 === 'dreamina') {
    return ![];
  }
  const _0x1eb22e = String(_0x33d9bd["asyncTaskKind"] || '')['trim']()["toLowerCase"]();
  if (_0x1eb22e === "image" && !["ai-image", 'source-image']["includes"](_0x22e915)) {
    return ![];
  }
  if (_0x1eb22e === "video" && !["ai-video", "source-video"]["includes"](_0x22e915)) {
    return ![];
  }
  const _0x3c11de = String(_0x33d9bd["asyncTaskStatus"] || '')["trim"]()["toLowerCase"]();
  if (_0x3c11de === "success" || _0x3c11de === 'failed' || _0x3c11de === 'idle' || _0x3c11de === "cancelled") {
    return ![];
  }
  return !![];
}
function isRunningHubResumeCandidateNode(_0x30b478) {
  if (!_0x30b478 || typeof _0x30b478 !== "object") {
    return ![];
  }
  const _0x4c3b1a = String(_0x30b478["type"] || '')["trim"]()["toLowerCase"]();
  if (!["ai-video", "ai-image", "ai-audio", "source-video", "source-image", "source-audio"]["includes"](_0x4c3b1a)) {
    return ![];
  }
  const _0x1ff879 = String(_0x30b478["provider"] || '')["trim"]()["toLowerCase"]();
  const _0x3668b3 = String(_0x30b478["model"] || '')["trim"]();
  const _0x2f748c = resolveModelProvider(_0x3668b3, _0x1ff879, {
    'allowProviderHint': ![]
  });
  const _0x5e926c = a926_0x3d0703(_0x3668b3, _0x1ff879 || "runninghubwf");
  const _0x10a46e = _0x2f748c === "runninghub" && isModelApiModel(_0x3668b3, "runninghub");
  const _0x66a261 = _0x4c3b1a === 'ai-audio' && _0x1ff879 === 'runninghubwf';
  const _0x4cf14f = _0x4c3b1a === "source-video" && (_0x1ff879 === "runninghubwf" || _0x5e926c);
  const _0xfbd9aa = _0x4c3b1a === 'source-image' && (_0x1ff879 === "runninghubwf" || _0x1ff879 === "runninghub" || _0x5e926c || _0x10a46e);
  const _0x1894ee = _0x4c3b1a === 'source-audio' && _0x1ff879 === "runninghubwf" && _0x5e926c;
  const _0x41cbb8 = _0xfbd9aa || _0x1894ee || _0x4cf14f || _0x66a261 || _0x5e926c || _0x10a46e || _0x1ff879 === "runninghub" || _0x1ff879 === "runninghubwf";
  if (!_0x41cbb8) {
    return ![];
  }
  const _0x26ad7d = resolveProjectLifecycleTaskIdentity(_0x30b478, "workflow");
  if (!_0x26ad7d["taskId"]) {
    return ![];
  }
  const _0x362b41 = String(_0x30b478["rhTaskStatus"] || '')["trim"]()["toLowerCase"]();
  if (_0x362b41 === 'success' || _0x362b41 === "failed" || _0x362b41 === "idle" || _0x362b41 === "cancelled") {
    return ![];
  }
  return !![];
}
function buildDreaminaResumeBackupPayload({
  projectId: _0x49ac29,
  projectName: _0x5a6b0d,
  multiData: _0x48dec3
}) {
  const _0x15750c = Array["isArray"](_0x48dec3?.['canvases']) ? _0x48dec3["canvases"] : [];
  const _0xdb1865 = [];
  _0x15750c["forEach"](_0xd0e14 => {
    const _0x1235f4 = String(_0xd0e14?.['id'] || '')["trim"]();
    if (!_0x1235f4) {
      return;
    }
    const _0x28a4e2 = Array["isArray"](_0xd0e14?.["nodes"]) ? _0xd0e14['nodes'] : [];
    _0x28a4e2["forEach"](_0x45b419 => {
      const _0x31a94b = {
        'canvasId': _0x1235f4,
        'nodeId': String(_0x45b419['id'] || '')['trim'](),
        'generationStartTime': Number(_0x45b419["generationStartTime"] || 0x0),
        'generationDuration': _0x45b419["generationDuration"] == null ? null : Number(_0x45b419["generationDuration"] || 0x0)
      };
      if (isDreaminaResumeCandidateNode(_0x45b419)) {
        const _0x56235b = resolveProjectLifecycleTaskIdentity(_0x45b419, 'dreamina');
        const _0x141c8a = {
          ..._0x31a94b,
          'kind': "dreamina",
          'dreaminaSubmitId': _0x56235b["taskId"],
          'dreaminaTaskStatus': String(_0x45b419["dreaminaTaskStatus"] || '')['trim'](),
          'dreaminaTaskPhase': String(_0x45b419["dreaminaTaskPhase"] || '')["trim"](),
          'dreaminaTaskLabel': String(_0x45b419["dreaminaTaskLabel"] || '')["trim"](),
          'dreaminaTaskStartedAt': _0x56235b["startedAt"],
          'dreaminaTaskLastCheckedAt': Number(_0x45b419['dreaminaTaskLastCheckedAt'] || 0x0),
          'dreaminaTaskRecovering': !!_0x45b419["dreaminaTaskRecovering"]
        };
        _0xdb1865['push'](_0x141c8a);
        return;
      }
      if (isAsyncResumeCandidateNode(_0x45b419)) {
        const _0x2f5769 = resolveProjectLifecycleTaskIdentity(_0x45b419, "asyncModelApi");
        _0xdb1865["push"]({
          ..._0x31a94b,
          'kind': "async",
          'nodeType': String(_0x45b419["type"] || '')["trim"]()["toLowerCase"](),
          'asyncTaskProvider': _0x2f5769["provider"],
          'asyncTaskKind': String(_0x45b419["asyncTaskKind"] || '')["trim"]() || 'image',
          'asyncTaskId': _0x2f5769["taskId"],
          'asyncTaskStatus': String(_0x45b419["asyncTaskStatus"] || '')["trim"](),
          'asyncTaskStartedAt': _0x2f5769["startedAt"],
          'asyncTaskRecovering': !!_0x45b419['asyncTaskRecovering']
        });
        return;
      }
      if (!isRunningHubResumeCandidateNode(_0x45b419)) {
        return;
      }
      const _0x5c8f53 = resolveProjectLifecycleTaskIdentity(_0x45b419, "workflow");
      _0xdb1865["push"]({
        ..._0x31a94b,
        'kind': "runninghub",
        'nodeType': String(_0x45b419["type"] || '')["trim"]()["toLowerCase"](),
        'rhTaskId': _0x5c8f53["taskId"],
        'rhTaskStatus': String(_0x45b419["rhTaskStatus"] || '')["trim"](),
        'rhTaskStartedAt': _0x5c8f53["startedAt"],
        'rhTaskRecovering': !!_0x45b419["rhTaskRecovering"],
        'rhTaskUseOpenapiQuery': _0x45b419["rhTaskUseOpenapiQuery"] === !![]
      });
    });
  });
  return {
    'projectId': _0x49ac29 || "default_v2_project",
    'projectName': _0x5a6b0d || getUntitledProjectName(),
    'timestamp': Date["now"](),
    'items': _0xdb1865
  };
}
function writeDreaminaResumeBackupSync(_0x52c0c8) {
  try {
    const _0x3b5a0c = buildDreaminaResumeBackupPayload(_0x52c0c8);
    if (!Array['isArray'](_0x3b5a0c["items"]) || _0x3b5a0c["items"]['length'] === 0x0) {
      window['localStorage']?.["removeItem"](DREAMINA_RESUME_BACKUP_KEY);
      return;
    }
    window["localStorage"]?.["setItem"](DREAMINA_RESUME_BACKUP_KEY, JSON["stringify"](_0x3b5a0c));
  } catch (_0x2658da) {
    console["warn"]('[projectLifecycle]\x20写入即梦恢复兜底失败:', _0x2658da);
  }
}
function readDreaminaResumeBackupSync() {
  try {
    const _0x40a3b2 = window["localStorage"]?.["getItem"](DREAMINA_RESUME_BACKUP_KEY);
    if (!_0x40a3b2) {
      return null;
    }
    const _0x2952f2 = JSON["parse"](_0x40a3b2);
    if (!_0x2952f2 || typeof _0x2952f2 !== "object") {
      return null;
    }
    if (!Array["isArray"](_0x2952f2["items"]) || _0x2952f2["items"]["length"] === 0x0) {
      return null;
    }
    return _0x2952f2;
  } catch (_0x55be01) {
    console["warn"]("[projectLifecycle] 读取即梦恢复兜底失败:", _0x55be01);
    return null;
  }
}
function mergeDreaminaResumeBackupIntoMultiData(_0x5d07f6, _0x3ae6c1, _0x6ae026) {
  if (!_0x3ae6c1 || typeof _0x3ae6c1 !== "object") {
    return _0x5d07f6;
  }
  if (String(_0x3ae6c1["projectId"] || '') !== String(_0x6ae026 || '')) {
    return _0x5d07f6;
  }
  const _0x16e78f = Array["isArray"](_0x3ae6c1["items"]) ? _0x3ae6c1["items"] : [];
  if (_0x16e78f['length'] === 0x0) {
    return _0x5d07f6;
  }
  const _0x4789c4 = {
    ...(_0x5d07f6 || {}),
    'canvases': Array['isArray'](_0x5d07f6?.['canvases']) ? _0x5d07f6['canvases']["map"](_0x26e249 => ({
      ..._0x26e249,
      'nodes': Array["isArray"](_0x26e249?.["nodes"]) ? _0x26e249["nodes"]["map"](_0x2b35c9 => ({
        ..._0x2b35c9
      })) : []
    })) : []
  };
  const _0x4f82a4 = new Map();
  _0x16e78f["forEach"](_0x2022d9 => {
    const _0x30373d = String(_0x2022d9?.["canvasId"] || '')["trim"]();
    const _0x95d0c7 = String(_0x2022d9?.["nodeId"] || '')["trim"]();
    if (!_0x30373d || !_0x95d0c7) {
      return;
    }
    _0x4f82a4['set'](_0x30373d + '::' + _0x95d0c7, _0x2022d9);
  });
  _0x4789c4['canvases']['forEach'](_0x54ce07 => {
    const _0xbcbefb = String(_0x54ce07?.['id'] || '')["trim"]();
    if (!_0xbcbefb || !Array["isArray"](_0x54ce07["nodes"])) {
      return;
    }
    _0x54ce07["nodes"] = _0x54ce07["nodes"]["map"](_0x59b02d => {
      const _0x163ef4 = String(_0x59b02d?.['id'] || '')["trim"]();
      const _0x1f0ee6 = _0x4f82a4["get"](_0xbcbefb + '::' + _0x163ef4);
      if (!_0x1f0ee6) {
        return _0x59b02d;
      }
      if (String(_0x1f0ee6?.['kind'] || '')["trim"]()["toLowerCase"]() === 'dreamina') {
        if (hasDreaminaResultError(_0x59b02d)) {
          return _0x59b02d;
        }
        const _0x382449 = String(_0x59b02d?.["jobStatus"] || '')["trim"]()["toLowerCase"]();
        if (_0x382449 === "error" || _0x382449 === "failed") {
          return _0x59b02d;
        }
        const _0x422550 = {};
        for (const _0x91bfaf of DREAMINA_RESUME_BACKUP_FIELDS) {
          Object["hasOwn"](_0x1f0ee6, _0x91bfaf) && (_0x422550[_0x91bfaf] = _0x1f0ee6[_0x91bfaf]);
        }
        const _0x27fba4 = Object["hasOwn"](_0x1f0ee6, 'dreaminaTaskLastRaw') && _0x1f0ee6["dreaminaTaskLastRaw"] && typeof _0x1f0ee6['dreaminaTaskLastRaw'] === "object" && !Array['isArray'](_0x1f0ee6["dreaminaTaskLastRaw"]) ? _0x1f0ee6["dreaminaTaskLastRaw"] : null;
        return {
          ..._0x59b02d,
          'generationStartTime': Number(_0x422550["generationStartTime"]) > 0x0 ? Number(_0x422550["generationStartTime"]) : Number(_0x59b02d?.["generationStartTime"] || 0x0),
          'generationDuration': null,
          'dreaminaSubmitId': String(_0x422550["dreaminaSubmitId"] || '')['trim'](),
          'dreaminaTaskStatus': String(_0x422550["dreaminaTaskStatus"] || '')["trim"](),
          'dreaminaTaskPhase': String(_0x422550["dreaminaTaskPhase"] || '')["trim"](),
          'dreaminaTaskLabel': String(_0x422550["dreaminaTaskLabel"] || '')["trim"](),
          'dreaminaTaskStartedAt': Number(_0x422550["dreaminaTaskStartedAt"] || 0x0),
          'dreaminaTaskLastCheckedAt': Number(_0x422550["dreaminaTaskLastCheckedAt"] || 0x0),
          'dreaminaTaskRecovering': !![],
          'dreaminaTaskLastRaw': _0x27fba4 || {}
        };
      }
      if (String(_0x1f0ee6?.["kind"] || '')["trim"]()["toLowerCase"]() !== "runninghub") {
        if (String(_0x1f0ee6?.["kind"] || '')["trim"]()["toLowerCase"]() !== "async") {
          return _0x59b02d;
        }
        const _0x40741f = String(_0x1f0ee6?.["nodeType"] || '')["trim"]()["toLowerCase"]();
        const _0x28f937 = String(_0x59b02d?.["type"] || '')["trim"]()["toLowerCase"]();
        if (_0x40741f && _0x28f937 && _0x40741f !== _0x28f937) {
          return _0x59b02d;
        }
        const _0x425afe = inferAsyncProviderByModel(_0x59b02d?.["model"], _0x1f0ee6["asyncTaskProvider"] || _0x59b02d?.["asyncTaskProvider"] || _0x59b02d?.['provider'] || '');
        return {
          ..._0x59b02d,
          'generationStartTime': Number(_0x1f0ee6["generationStartTime"]) > 0x0 ? Number(_0x1f0ee6["generationStartTime"]) : Number(_0x59b02d?.["generationStartTime"] || 0x0),
          'generationDuration': null,
          'asyncTaskProvider': _0x425afe,
          'asyncTaskKind': String(_0x1f0ee6["asyncTaskKind"] || '')["trim"]() || "image",
          'asyncTaskId': String(_0x1f0ee6["asyncTaskId"] || '')["trim"](),
          'asyncTaskStatus': String(_0x1f0ee6["asyncTaskStatus"] || '')['trim']() || "pending",
          'asyncTaskStartedAt': Number(_0x1f0ee6["asyncTaskStartedAt"] || 0x0),
          'asyncTaskRecovering': !![]
        };
      }
      const _0x797c92 = String(_0x1f0ee6?.["nodeType"] || '')['trim']()["toLowerCase"]();
      const _0x54bf4b = String(_0x59b02d?.["type"] || '')["trim"]()["toLowerCase"]();
      if (_0x797c92 && _0x54bf4b && _0x797c92 !== _0x54bf4b) {
        return _0x59b02d;
      }
      return {
        ..._0x59b02d,
        'generationStartTime': Number(_0x1f0ee6["generationStartTime"]) > 0x0 ? Number(_0x1f0ee6["generationStartTime"]) : Number(_0x59b02d?.["generationStartTime"] || 0x0),
        'generationDuration': null,
        'rhTaskId': String(_0x1f0ee6["rhTaskId"] || '')["trim"](),
        'rhTaskStatus': String(_0x1f0ee6['rhTaskStatus'] || '')['trim']() || "pending",
        'rhTaskStartedAt': Number(_0x1f0ee6["rhTaskStartedAt"] || 0x0),
        'rhTaskRecovering': !![],
        'rhTaskUseOpenapiQuery': _0x1f0ee6['rhTaskUseOpenapiQuery'] === !![]
      };
    });
  });
  return _0x4789c4;
}
function buildCanvasRecordSignature(_0xdb6f8b, _0xbaa414 = _0xdb6f8b?.['_persistRevHint'], _0x4a7f33 = _0xdb6f8b?.["_contentPersistRevHint"]) {
  const _0x52f625 = _0xdb6f8b?.["visualSnapshot"] && typeof _0xdb6f8b['visualSnapshot'] === "object" ? {
    'schemaVersion': Number(_0xdb6f8b["visualSnapshot"]['schemaVersion']) || 0x1,
    'srcLength': String(_0xdb6f8b["visualSnapshot"]["src"] || '')["length"],
    'width': Number(_0xdb6f8b["visualSnapshot"]["width"]) || 0x0,
    'height': Number(_0xdb6f8b["visualSnapshot"]["height"]) || 0x0,
    'capturedAt': Number(_0xdb6f8b["visualSnapshot"]["capturedAt"]) || 0x0,
    'visibleNodeCount': Number(_0xdb6f8b["visualSnapshot"]['visibleNodeCount']) || 0x0,
    'mediaNodeCount': Number(_0xdb6f8b["visualSnapshot"]['mediaNodeCount']) || 0x0,
    'readyMediaNodeCount': Number(_0xdb6f8b["visualSnapshot"]["readyMediaNodeCount"]) || 0x0
  } : null;
  const _0x881420 = Number['isFinite'](_0xbaa414);
  if (Number['isFinite'](_0x4a7f33)) {
    return createStableSignature({
      '_contentPersistRevHint': _0x4a7f33,
      'nodesLength': Array["isArray"](_0xdb6f8b?.["nodes"]) ? _0xdb6f8b["nodes"]["length"] : 0x0,
      'edgesLength': Array["isArray"](_0xdb6f8b?.["edges"]) ? _0xdb6f8b["edges"]["length"] : 0x0,
      'assetsLength': Array["isArray"](_0xdb6f8b?.['assets']) ? _0xdb6f8b["assets"]['length'] : 0x0,
      'visualSnapshot': _0x52f625
    });
  }
  if (_0x881420) {
    const _0x51f666 = _0xdb6f8b?.['viewport'] && typeof _0xdb6f8b['viewport'] === "object" ? _0xdb6f8b['viewport'] : {};
    return createStableSignature({
      '_persistRevHint': _0xbaa414,
      'viewport': {
        'x': Number["isFinite"](_0x51f666?.['x']) ? _0x51f666['x'] : 0x0,
        'y': Number["isFinite"](_0x51f666?.['y']) ? _0x51f666['y'] : 0x0,
        'zoom': Number['isFinite'](_0x51f666?.["zoom"]) ? _0x51f666["zoom"] : 1.1
      },
      'nodesLength': Array["isArray"](_0xdb6f8b?.['nodes']) ? _0xdb6f8b['nodes']["length"] : 0x0,
      'edgesLength': Array["isArray"](_0xdb6f8b?.["edges"]) ? _0xdb6f8b["edges"]["length"] : 0x0,
      'assetsLength': Array["isArray"](_0xdb6f8b?.["assets"]) ? _0xdb6f8b["assets"]['length'] : 0x0,
      'visualSnapshot': _0x52f625
    });
  }
  return createStableSignature({
    'id': _0xdb6f8b?.['id'] ?? null,
    'name': _0xdb6f8b?.['name'] ?? getUntitledCanvasName(),
    'nodes': Array['isArray'](_0xdb6f8b?.["nodes"]) ? _0xdb6f8b["nodes"] : [],
    'edges': Array["isArray"](_0xdb6f8b?.["edges"]) ? _0xdb6f8b["edges"] : [],
    'viewport': _0xdb6f8b?.["viewport"] && typeof _0xdb6f8b['viewport'] === "object" ? _0xdb6f8b["viewport"] : {
      'x': 0x0,
      'y': 0x0,
      'zoom': 1.1
    },
    'assets': Array['isArray'](_0xdb6f8b?.["assets"]) ? _0xdb6f8b["assets"] : [],
    'visualSnapshot': _0x52f625
  });
}
export function buildWorkspaceShardRecords(_0x4de7d8) {
  const _0x551256 = _0x4de7d8?.['projectId'] || "default_v2_project";
  const _0x5f53f6 = _0x4de7d8?.["projectName"] || getUntitledProjectName();
  const _0x5b931a = Array["isArray"](_0x4de7d8?.["multiData"]?.['canvases']) ? _0x4de7d8["multiData"]['canvases'] : [];
  const _0x471f7c = _0x4de7d8?.["multiData"]?.["activeCanvasId"] || _0x5b931a[0x0]?.['id'] || null;
  const _0x2cb901 = Array["isArray"](_0x4de7d8?.['multiData']?.['projectContexts']) ? _0x4de7d8["multiData"]['projectContexts']["filter"](_0x56e519 => _0x56e519?.["canvasId"])['map'](_0x17260d => ({
    ..._0x17260d
  })) : [];
  const _0x4fd8e9 = Number(_0x4de7d8?.["workspaceScopeVersion"]) === 0x1 ? 0x1 : 0x0;
  const _0x1f098f = _0x4de7d8?.["multiDataSanitized"] === !![];
  const _0xe3a406 = new Map((Array["isArray"](_0x4de7d8?.['persistenceRevision']?.["canvases"]) ? _0x4de7d8["persistenceRevision"]["canvases"] : [])["filter"](_0x219c94 => _0x219c94?.['id'] && Number["isFinite"](_0x219c94?.['persistRev']))["map"](_0x5d7bed => [String(_0x5d7bed['id']), Number(_0x5d7bed["persistRev"])]));
  const _0x4e167a = new Map((Array['isArray'](_0x4de7d8?.['persistenceRevision']?.["canvases"]) ? _0x4de7d8["persistenceRevision"]['canvases'] : [])['filter'](_0x57f13f => _0x57f13f?.['id'] && Number["isFinite"](_0x57f13f?.["contentPersistRev"]))['map'](_0x470563 => [String(_0x470563['id']), Number(_0x470563['contentPersistRev'])]));
  const _0x50f844 = Date["now"]();
  const _0x46ba45 = {
    'cacheVersion': 0x2,
    'projectId': _0x551256,
    'projectName': _0x5f53f6,
    'workspaceScopeVersion': _0x4fd8e9,
    'activeCanvasId': _0x471f7c,
    'projectContexts': _0x2cb901,
    'canvasOrder': _0x5b931a["map"](_0x1df8b3 => ({
      'id': _0x1df8b3?.['id'] ?? null,
      'name': _0x1df8b3?.["name"] ?? getUntitledCanvasName(),
      'viewport': _0x1df8b3?.["viewport"] && typeof _0x1df8b3["viewport"] === "object" ? {
        'x': Number(_0x1df8b3["viewport"]['x']) || 0x0,
        'y': Number(_0x1df8b3["viewport"]['y']) || 0x0,
        'zoom': Number(_0x1df8b3["viewport"]['zoom']) || 1.1
      } : {
        'x': 0x0,
        'y': 0x0,
        'zoom': 1.1
      }
    })),
    '_timestamp': _0x50f844
  };
  const _0x21abfa = _0x5b931a['map'](_0x7dbcbb => {
    const _0x2a7b35 = String(_0x7dbcbb?.['id'] || '');
    const _0x5e1127 = _0xe3a406["get"](_0x2a7b35);
    const _0x3c36e5 = _0x4e167a['get'](_0x2a7b35);
    const _0xf99560 = Number["isFinite"](_0x7dbcbb?.["_persistRevHint"]) ? Number(_0x7dbcbb["_persistRevHint"]) : _0x5e1127;
    const _0x4c086f = Number["isFinite"](_0x7dbcbb?.["_contentPersistRevHint"]) ? Number(_0x7dbcbb["_contentPersistRevHint"]) : _0x3c36e5;
    const _0x386ee5 = {
      'id': _0x7dbcbb?.['id'] ?? null,
      'name': _0x7dbcbb?.["name"] ?? getUntitledCanvasName(),
      '_persistRevHint': _0xf99560,
      '_contentPersistRevHint': _0x4c086f,
      'nodes': Array["isArray"](_0x7dbcbb?.["nodes"]) ? _0x7dbcbb["nodes"] : [],
      'edges': Array['isArray'](_0x7dbcbb?.["edges"]) ? _0x7dbcbb['edges'] : [],
      'viewport': _0x7dbcbb?.['viewport'] && typeof _0x7dbcbb["viewport"] === 'object' ? _0x7dbcbb["viewport"] : {
        'x': 0x0,
        'y': 0x0,
        'zoom': 1.1
      },
      'assets': Array['isArray'](_0x7dbcbb?.['assets']) ? _0x7dbcbb['assets'] : [],
      'storyboard3dProjects': Array["isArray"](_0x7dbcbb?.["storyboard3dProjects"]) ? _0x7dbcbb["storyboard3dProjects"] : [],
      'visualSnapshot': _0x7dbcbb?.['visualSnapshot'] && typeof _0x7dbcbb["visualSnapshot"] === "object" ? _0x7dbcbb["visualSnapshot"] : undefined,
      '_timestamp': _0x50f844
    };
    const _0x4cd521 = _0x1f098f ? {
      ..._0x386ee5
    } : sanitizeSerializedCanvasData(_0x386ee5);
    _0x1f098f && (delete _0x4cd521["_persistRevHint"], delete _0x4cd521["_contentPersistRevHint"]);
    return {
      'key': buildWorkspaceCanvasKey(_0x386ee5['id']),
      'record': _0x386ee5,
      'persistedRecord': _0x4cd521,
      'signature': buildCanvasRecordSignature(_0x4cd521, _0xf99560, _0x4c086f)
    };
  });
  return {
    'metaRecord': _0x46ba45,
    'metaSignature': createStableSignature({
      'cacheVersion': _0x46ba45["cacheVersion"],
      'projectId': _0x46ba45["projectId"],
      'projectName': _0x46ba45["projectName"],
      'workspaceScopeVersion': _0x46ba45["workspaceScopeVersion"],
      'activeCanvasId': _0x46ba45["activeCanvasId"],
      'projectContexts': _0x46ba45['projectContexts'],
      'canvasOrder': _0x46ba45['canvasOrder']
    }),
    'canvasRecords': _0x21abfa
  };
}
export function restoreWorkspacePayloadFromShardRecords(_0x1035fd, _0x4cd59f) {
  if (!_0x1035fd || !Array["isArray"](_0x1035fd["canvasOrder"])) {
    return null;
  }
  const _0x49d9fd = new Map();
  for (const _0x3d14b5 of _0x4cd59f || []) {
    if (!_0x3d14b5 || !_0x3d14b5['id']) {
      continue;
    }
    _0x49d9fd['set'](_0x3d14b5['id'], {
      'id': _0x3d14b5['id'],
      'name': _0x3d14b5["name"] || getUntitledCanvasName(),
      '_persistRevHint': Number['isFinite'](_0x3d14b5?.["_persistRevHint"]) ? _0x3d14b5["_persistRevHint"] : undefined,
      '_contentPersistRevHint': Number["isFinite"](_0x3d14b5?.['_contentPersistRevHint']) ? _0x3d14b5['_contentPersistRevHint'] : undefined,
      'nodes': Array["isArray"](_0x3d14b5['nodes']) ? _0x3d14b5['nodes'] : [],
      'edges': Array["isArray"](_0x3d14b5["edges"]) ? _0x3d14b5['edges'] : [],
      'viewport': _0x3d14b5["viewport"] && typeof _0x3d14b5['viewport'] === "object" ? _0x3d14b5["viewport"] : {
        'x': 0x0,
        'y': 0x0,
        'zoom': 1.1
      },
      'assets': Array["isArray"](_0x3d14b5["assets"]) ? _0x3d14b5["assets"] : [],
      'storyboard3dProjects': Array["isArray"](_0x3d14b5["storyboard3dProjects"]) ? _0x3d14b5["storyboard3dProjects"] : [],
      'visualSnapshot': _0x3d14b5["visualSnapshot"] && typeof _0x3d14b5["visualSnapshot"] === 'object' ? _0x3d14b5["visualSnapshot"] : null
    });
  }
  const _0xbcf537 = [];
  for (const _0x3bc4f4 of _0x1035fd["canvasOrder"]) {
    const _0x101362 = _0x3bc4f4?.['id'];
    if (!_0x101362) {
      return null;
    }
    const _0x4761c5 = _0x49d9fd["get"](_0x101362);
    if (!_0x4761c5) {
      return null;
    }
    _0xbcf537["push"]({
      ..._0x4761c5,
      'name': _0x3bc4f4?.["name"] || _0x4761c5["name"] || getUntitledCanvasName(),
      'viewport': _0x3bc4f4?.["viewport"] && typeof _0x3bc4f4["viewport"] === "object" ? {
        ..._0x3bc4f4['viewport']
      } : _0x4761c5['viewport']
    });
  }
  return {
    'projectId': _0x1035fd["projectId"] || "default_v2_project",
    'projectName': _0x1035fd["projectName"] || getUntitledProjectName(),
    'workspaceScopeVersion': Number(_0x1035fd["workspaceScopeVersion"]) === 0x1 ? 0x1 : 0x0,
    'multiData': {
      'canvases': _0xbcf537,
      'activeCanvasId': _0x1035fd["activeCanvasId"] || _0xbcf537[0x0]?.['id'] || null,
      'projectContexts': Array["isArray"](_0x1035fd["projectContexts"]) ? _0x1035fd['projectContexts']["map"](_0x4d749b => ({
        ..._0x4d749b
      })) : []
    }
  };
}
export function buildRecoverySnapshotSignature({
  meta: _0x1f7c8b,
  multiData: _0x3edc06,
  persistenceRevision = null
}) {
  const _0x1781aa = persistenceRevision && typeof persistenceRevision === "object" ? {
    'activeCanvasId': persistenceRevision["activeCanvasId"] || null,
    'canvases': (Array['isArray'](persistenceRevision['canvases']) ? persistenceRevision["canvases"] : [])['map'](_0x5de825 => ({
      'id': _0x5de825?.['id'] || null,
      'name': _0x5de825?.["name"] || '',
      'persistRev': Number['isFinite'](_0x5de825?.['contentPersistRev']) ? Number(_0x5de825["contentPersistRev"]) : Number(_0x5de825?.["persistRev"]) || 0x0
    }))
  } : null;
  return createStableSignature({
    ...(_0x1f7c8b || {}),
    ...(_0x1781aa ? {
      'persistenceRevision': _0x1781aa
    } : {
      'multiData': _0x3edc06
    })
  });
}
function hasCompleteContentPersistenceRevision(_0x4864f8) {
  const _0x2362fb = Array["isArray"](_0x4864f8?.["canvases"]) ? _0x4864f8["canvases"] : [];
  return _0x2362fb["length"] > 0x0 && _0x2362fb["every"](_0x2f4c76 => Number["isFinite"](_0x2f4c76?.["contentPersistRev"]));
}
export function shouldWritePeriodicRecoverySnapshot({
  isChromeShell = ![]
} = {}) {
  return isChromeShell !== !![];
}
export function createProjectLifecycle({
  store: _0x242cf9,
  CanvasTabManager: _0x1b3935,
  project: _0x59c6b3,
  loadCustomPresets: _0x32c5ad,
  migrateLegacyThumbnailsInMultiData: _0x3ca625,
  sanitizeMultiCanvasDataForPersistence: _0x28d474,
  commit: _0x355f4f,
  patchStoreSourceNodeNamesFromFileName: _0xbf38ba,
  applySourceNamesFromFileNameToCanvas: _0x262406
}) {
  let _0x47ed9b = '';
  let _0x3dbbab = '';
  const _0xea1fd4 = new Map();
  let _0x56f72d = new Set();
  let _0x57a988 = ![];
  let _0x35ca02 = null;
  let _0x3f7892 = ![];
  let _0x14a61b = null;
  let _0x4134a2 = 0x0;
  let _0x38a4f8 = null;
  let _0x1787f8 = null;
  let _0x51865f = '';
  let _0x211e50 = '';
  let _0x3b6f0f = 0x0;
  let _0x5e5905 = null;
  let _0x3fa0eb = ![];
  let _0x12b80a = () => {};
  function _0xe38061() {
    _0x47ed9b = '';
    _0x3dbbab = '';
    _0xea1fd4['clear']();
    _0x56f72d = new Set();
    _0x57a988 = ![];
  }
  function _0x411071(_0x545710) {
    const _0x5fe2f0 = {
      'projectId': _0x545710?.['projectId'] || "default_v2_project",
      'projectName': _0x545710?.["projectName"] || getUntitledProjectName(),
      'workspaceScopeVersion': Number(_0x545710?.["workspaceScopeVersion"]) === 0x1 ? 0x1 : 0x0,
      'multiData': _0x545710?.["multiData"] || {
        'canvases': [],
        'activeCanvasId': null
      }
    };
    const {
      metaSignature: _0x2ba142,
      canvasRecords: _0x17ef1a
    } = buildWorkspaceShardRecords(_0x5fe2f0);
    _0x47ed9b = _0x5fe2f0["projectId"];
    _0x3dbbab = _0x2ba142;
    _0xea1fd4["clear"]();
    _0x56f72d = new Set();
    _0x17ef1a["forEach"](({
      record: _0x353432,
      signature: _0x4ee439
    }) => {
      if (!_0x353432?.['id']) {
        return;
      }
      _0xea1fd4['set'](_0x353432['id'], _0x4ee439);
      _0x56f72d["add"](_0x353432['id']);
    });
    _0x57a988 = !![];
  }
  const _0xd2ba14 = {
    'dbName': "TapNowV2Cache",
    'storeName': "workspace",
    'version': 0x1,
    '_dbPromise': null,
    async 'initDB'() {
      if (this["_dbPromise"]) {
        return this['_dbPromise'];
      }
      this["_dbPromise"] = new Promise((_0x432e17, _0x36d1e0) => {
        const _0x30d612 = indexedDB["open"](this["dbName"], this["version"]);
        _0x30d612['onupgradeneeded'] = _0x58f550 => {
          const _0x332c94 = _0x58f550["target"]["result"];
          !_0x332c94["objectStoreNames"]["contains"](this["storeName"]) && _0x332c94['createObjectStore'](this["storeName"]);
        };
        _0x30d612["onsuccess"] = _0x2fbe4f => {
          const _0x14617b = _0x2fbe4f["target"]["result"];
          _0x14617b["onversionchange"] = () => {
            _0x14617b["close"]();
            this['_dbPromise'] = null;
          };
          _0x432e17(_0x14617b);
        };
        _0x30d612['onerror'] = _0x55d8ef => {
          this["_dbPromise"] = null;
          _0x36d1e0(_0x55d8ef['target']['error']);
        };
      });
      return this["_dbPromise"];
    },
    async 'getRecord'(_0x1b7eef) {
      const _0x34ee8f = await this["initDB"]();
      return new Promise((_0x1f5a2d, _0x358f34) => {
        const _0x3348f6 = _0x34ee8f['transaction'](this["storeName"], "readonly");
        const _0x593495 = _0x3348f6["objectStore"](this["storeName"]);
        const _0x442714 = _0x593495["get"](_0x1b7eef);
        _0x442714["onsuccess"] = _0x510c48 => _0x1f5a2d(_0x510c48["target"]["result"] ?? null);
        _0x442714["onerror"] = _0x47134d => _0x358f34(_0x47134d["target"]['error']);
      });
    },
    async 'getRecords'(_0xc2e893) {
      const _0x2aeb95 = await this["initDB"]();
      return new Promise((_0xe60f7c, _0x1bf67d) => {
        const _0x4b70e5 = _0x2aeb95['transaction'](this["storeName"], "readonly");
        const _0x4ea501 = _0x4b70e5["objectStore"](this["storeName"]);
        const _0x69dd79 = _0xc2e893["map"](_0x218308 => new Promise((_0x124c46, _0xc329dc) => {
          const _0x33287c = _0x4ea501["get"](_0x218308);
          _0x33287c["onsuccess"] = _0x39e62d => _0x124c46(_0x39e62d["target"]["result"] ?? null);
          _0x33287c["onerror"] = _0x25bd79 => _0xc329dc(_0x25bd79["target"]["error"]);
        }));
        Promise["all"](_0x69dd79)["then"](_0xe60f7c)["catch"](_0x1bf67d);
      });
    },
    async 'listKeys'() {
      const _0x445efe = await this["initDB"]();
      return new Promise((_0x248ba6, _0x11f296) => {
        const _0x4c879d = _0x445efe["transaction"](this["storeName"], "readonly");
        const _0x106e35 = _0x4c879d["objectStore"](this['storeName']);
        const _0x23593d = _0x106e35["getAllKeys"]();
        _0x23593d["onsuccess"] = _0x357f5c => _0x248ba6(_0x357f5c["target"]['result'] || []);
        _0x23593d["onerror"] = _0x20d7cb => _0x11f296(_0x20d7cb['target']["error"]);
      });
    },
    async 'save'(_0x5d1d23) {
      try {
        const _0x41a85e = {
          'projectId': _0x5d1d23?.["projectId"] || "default_v2_project",
          'projectName': _0x5d1d23?.["projectName"] || getUntitledProjectName(),
          'workspaceScopeVersion': Number(_0x5d1d23?.['workspaceScopeVersion']) === 0x1 ? 0x1 : 0x0,
          'multiData': _0x5d1d23?.['multiData'] || {
            'canvases': [],
            'activeCanvasId': null
          },
          'multiDataSanitized': _0x5d1d23?.["multiDataSanitized"] === !![],
          'persistenceRevision': _0x5d1d23?.["persistenceRevision"] || null
        };
        const {
          metaRecord: _0x1c4814,
          metaSignature: _0x17531e,
          canvasRecords: _0x935788
        } = buildWorkspaceShardRecords(_0x41a85e);
        const _0x152ec3 = await this["initDB"]();
        const _0x486c14 = _0x935788['map'](({
          record: _0x52d077
        }) => String(_0x52d077?.['id'] || '')["trim"]())['filter'](Boolean);
        const _0x3d1559 = new Set(_0x486c14);
        const _0x582b36 = new Set(_0x486c14['map'](_0x5b93cd => buildWorkspaceCanvasKey(_0x5b93cd)));
        const _0x505e63 = _0x47ed9b !== _0x41a85e["projectId"];
        const _0x12a173 = _0x505e63 || !_0x57a988 || _0x56f72d["size"] === 0x0 && _0x935788['length'] > 0x0;
        let _0xb7f941 = [];
        if (_0x505e63) {
          _0x12a173 && (await this["listKeys"]());
        } else {
          if (_0x57a988) {
            _0xb7f941 = Array['from'](_0x56f72d)["filter"](_0x2c3b38 => !_0x3d1559["has"](_0x2c3b38))["map"](_0x215fef => buildWorkspaceCanvasKey(_0x215fef));
          } else {
            if (_0x12a173) {
              const _0x3183ed = await this["listKeys"]();
              const _0x4806ac = _0x3183ed["filter"](_0x2f671a => String(_0x2f671a)["startsWith"](WORKSPACE_CANVAS_KEY_PREFIX));
              _0xb7f941 = _0x4806ac["filter"](_0x9375a7 => !_0x582b36["has"](_0x9375a7));
            }
          }
        }
        const _0xa2ebd = _0x935788["filter"](({
          record: _0x1b18e9,
          signature: _0x4840b8
        }) => _0x505e63 || _0xea1fd4["get"](_0x1b18e9['id']) !== _0x4840b8);
        const _0x303e6c = _0x505e63 || _0x3dbbab !== _0x17531e;
        if (!_0x303e6c && _0xa2ebd["length"] === 0x0 && _0xb7f941["length"] === 0x0) {
          return;
        }
        return new Promise((_0x34a2e3, _0x479702) => {
          const _0x4793ba = _0x152ec3["transaction"](this["storeName"], "readwrite");
          const _0xd8a3bb = _0x4793ba["objectStore"](this["storeName"]);
          _0x303e6c && _0xd8a3bb["put"](_0x1c4814, WORKSPACE_META_KEY);
          _0xa2ebd['forEach'](({
            key: _0xd63cea,
            persistedRecord: _0x9bc4e1
          }) => {
            _0xd8a3bb["put"](_0x9bc4e1, _0xd63cea);
          });
          _0xb7f941["forEach"](_0x30d8bd => {
            _0xd8a3bb["delete"](_0x30d8bd);
          });
          _0x4793ba["oncomplete"] = () => {
            _0x47ed9b = _0x41a85e['projectId'];
            _0x3dbbab = _0x17531e;
            const _0x547dda = new Map();
            _0x935788["forEach"](({
              record: _0x1049e6,
              signature: _0x1f9cdf
            }) => {
              if (!_0x1049e6?.['id']) {
                return;
              }
              _0x547dda["set"](_0x1049e6['id'], _0x1f9cdf);
            });
            _0xea1fd4["clear"]();
            _0x56f72d = new Set();
            _0x547dda["forEach"]((_0x4498ad, _0x259058) => {
              _0xea1fd4["set"](_0x259058, _0x4498ad);
              _0x56f72d["add"](_0x259058);
            });
            _0x57a988 = !![];
            _0x34a2e3();
          };
          _0x4793ba["onerror"] = _0x1c502b => _0x479702(_0x1c502b["target"]['error']);
          _0x4793ba["onabort"] = _0x346e33 => _0x479702(_0x346e33["target"]["error"]);
        });
      } catch (_0x3bbcba) {
        console["warn"]("[V2LocalCache] Save failed:", _0x3bbcba);
      }
    },
    async 'load'() {
      try {
        const _0x1076e8 = await this["getRecord"](WORKSPACE_META_KEY);
        if (_0x1076e8?.["cacheVersion"] === 0x2 && Array["isArray"](_0x1076e8["canvasOrder"])) {
          const _0x142754 = _0x1076e8["canvasOrder"]["map"](_0x58e268 => buildWorkspaceCanvasKey(_0x58e268?.['id']));
          const _0x1eb554 = await this['getRecords'](_0x142754);
          const _0xf5faba = restoreWorkspacePayloadFromShardRecords(_0x1076e8, _0x1eb554);
          if (_0xf5faba?.['multiData']?.['canvases']?.['length']) {
            _0x411071(_0xf5faba);
            return _0xf5faba;
          }
        }
        const _0x12461c = await this["getRecord"](LEGACY_WORKSPACE_KEY);
        if (_0x12461c?.["multiData"]?.["canvases"]?.["length"]) {
          _0xe38061();
          return _0x12461c;
        }
        _0xe38061();
        return null;
      } catch (_0x35e46d) {
        console['warn']('[V2LocalCache]\x20Load\x20failed:', _0x35e46d);
        _0xe38061();
        return null;
      }
    },
    async 'saveProjectSession'(_0x55f046) {
      const _0x56a584 = normalizeProjectWorkspaceId(_0x55f046?.["projectId"]);
      if (!_0x56a584) {
        throw new Error('[V2LocalCache]\x20Project\x20workspace\x20session\x20requires\x20projectId');
      }
      const _0x4731b6 = {
        'projectId': _0x56a584,
        'projectName': _0x55f046?.["projectName"] || getUntitledProjectName(),
        'workspaceScopeVersion': 0x1,
        'multiData': _0x55f046?.["multiData"] || {
          'canvases': [],
          'activeCanvasId': null
        }
      };
      const {
        metaRecord: _0x1ceb1d,
        canvasRecords: _0x123e2e
      } = buildWorkspaceShardRecords(_0x4731b6);
      const _0x3645c1 = buildProjectWorkspaceMetaKey(_0x56a584);
      const _0x355e14 = await this["getRecord"](_0x3645c1);
      const _0x2a250a = new Set(_0x123e2e['map'](({
        record: _0x2669c7
      }) => String(_0x2669c7?.['id'] || '')['trim']())["filter"](Boolean));
      const _0x1f826e = Array['isArray'](_0x355e14?.["canvasOrder"]) ? _0x355e14["canvasOrder"]["map"](_0x429a35 => String(_0x429a35?.['id'] || '')["trim"]())["filter"](_0x403adc => _0x403adc && !_0x2a250a["has"](_0x403adc))['map'](_0x5a3254 => buildProjectWorkspaceCanvasKey(_0x56a584, _0x5a3254)) : [];
      const _0x1b5ba4 = await this['initDB']();
      return new Promise((_0x2bba4c, _0x42fb3f) => {
        const _0xc1c0eb = _0x1b5ba4['transaction'](this["storeName"], 'readwrite');
        const _0x1d5516 = _0xc1c0eb["objectStore"](this['storeName']);
        _0x1d5516['put']({
          ..._0x1ceb1d,
          'projectId': _0x56a584,
          'sessionVersion': 0x1,
          'hasUnsavedChanges': _0x55f046?.["hasUnsavedChanges"] !== ![]
        }, _0x3645c1);
        _0x123e2e["forEach"](({
          record: _0x39fb5d,
          persistedRecord: _0x577f4a
        }) => {
          _0x1d5516['put'](_0x577f4a, buildProjectWorkspaceCanvasKey(_0x56a584, _0x39fb5d['id']));
        });
        _0x1f826e["forEach"](_0x5e2bae => _0x1d5516["delete"](_0x5e2bae));
        _0xc1c0eb["oncomplete"] = () => _0x2bba4c({
          'success': !![],
          'projectId': _0x56a584
        });
        _0xc1c0eb["onerror"] = _0x10d0bb => _0x42fb3f(_0x10d0bb["target"]["error"]);
        _0xc1c0eb['onabort'] = _0x540894 => _0x42fb3f(_0x540894["target"]["error"]);
      });
    },
    async 'loadProjectSession'(_0x3badc1) {
      const _0x4c571d = normalizeProjectWorkspaceId(_0x3badc1);
      if (!_0x4c571d) {
        return null;
      }
      try {
        const _0x2a7c99 = await this["getRecord"](buildProjectWorkspaceMetaKey(_0x4c571d));
        if (_0x2a7c99?.["sessionVersion"] !== 0x1 || !Array["isArray"](_0x2a7c99['canvasOrder'])) {
          return null;
        }
        const _0x2b4c4c = await this["getRecords"](_0x2a7c99["canvasOrder"]["map"](_0x52c2fe => buildProjectWorkspaceCanvasKey(_0x4c571d, _0x52c2fe?.['id'])));
        const _0x26a8f0 = restoreWorkspacePayloadFromShardRecords(_0x2a7c99, _0x2b4c4c);
        if (!_0x26a8f0?.["multiData"]?.["canvases"]?.["length"]) {
          return null;
        }
        return {
          ..._0x26a8f0,
          'projectId': _0x4c571d,
          'hasUnsavedChanges': _0x2a7c99["hasUnsavedChanges"] !== ![],
          'session': !![]
        };
      } catch (_0x2f4dbc) {
        console["warn"]("[V2LocalCache] Load project workspace session failed:", _0x2f4dbc);
        return null;
      }
    },
    async 'clearProjectSession'(_0x1cba94) {
      const _0x4925e3 = normalizeProjectWorkspaceId(_0x1cba94);
      if (!_0x4925e3) {
        return {
          'success': ![],
          'reason': 'missing-project-id'
        };
      }
      try {
        const _0x46e072 = buildProjectWorkspaceMetaKey(_0x4925e3);
        const _0x3eb988 = await this["getRecord"](_0x46e072);
        const _0x52d648 = Array["isArray"](_0x3eb988?.["canvasOrder"]) ? _0x3eb988["canvasOrder"]["map"](_0x484420 => String(_0x484420?.['id'] || '')["trim"]())["filter"](Boolean)["map"](_0x4d0410 => buildProjectWorkspaceCanvasKey(_0x4925e3, _0x4d0410)) : [];
        const _0x11a460 = await this["initDB"]();
        return new Promise((_0x222425, _0x5ebe74) => {
          const _0x390870 = _0x11a460["transaction"](this["storeName"], 'readwrite');
          const _0x4546aa = _0x390870["objectStore"](this["storeName"]);
          _0x4546aa["delete"](_0x46e072);
          _0x52d648['forEach'](_0x225b47 => _0x4546aa["delete"](_0x225b47));
          _0x390870["oncomplete"] = () => _0x222425({
            'success': !![],
            'projectId': _0x4925e3
          });
          _0x390870["onerror"] = _0x2d434f => _0x5ebe74(_0x2d434f["target"]["error"]);
          _0x390870["onabort"] = _0xdd83ed => _0x5ebe74(_0xdd83ed["target"]['error']);
        });
      } catch (_0x1d1b46) {
        console['warn']("[V2LocalCache] Clear project workspace session failed:", _0x1d1b46);
        return {
          'success': ![],
          'projectId': _0x4925e3,
          'error': _0x1d1b46
        };
      }
    },
    async 'clear'() {
      try {
        const _0x18427c = await this["initDB"]();
        const _0x27319e = await this['listKeys']();
        const _0x47f720 = _0x27319e["filter"](_0x41e570 => {
          const _0x8c0c95 = String(_0x41e570);
          return _0x8c0c95 === LEGACY_WORKSPACE_KEY || _0x8c0c95 === WORKSPACE_META_KEY || _0x8c0c95['startsWith'](WORKSPACE_CANVAS_KEY_PREFIX) || _0x8c0c95["startsWith"](PROJECT_WORKSPACE_META_KEY_PREFIX) || _0x8c0c95["startsWith"](PROJECT_WORKSPACE_CANVAS_KEY_PREFIX);
        });
        return new Promise((_0x4d972d, _0x18fd06) => {
          const _0x190db0 = _0x18427c["transaction"](this['storeName'], "readwrite");
          const _0x50e0aa = _0x190db0["objectStore"](this["storeName"]);
          _0x47f720["forEach"](_0x42a06d => _0x50e0aa["delete"](_0x42a06d));
          _0x190db0["oncomplete"] = () => {
            _0xe38061();
            _0x4d972d();
          };
          _0x190db0['onerror'] = _0x57b7ea => _0x18fd06(_0x57b7ea["target"]["error"]);
          _0x190db0["onabort"] = _0x3ebab0 => _0x18fd06(_0x3ebab0["target"]['error']);
        });
      } catch (_0x33913a) {
        console["warn"]("[V2LocalCache] Clear failed:", _0x33913a);
      }
    }
  };
  window["V2LocalCache"] = _0xd2ba14;
  const _0x1b7363 = Object['freeze']({
    'save'(_0x2e9594) {
      return _0xd2ba14["saveProjectSession"](_0x2e9594);
    },
    'load'(_0x12e373) {
      return _0xd2ba14["loadProjectSession"](_0x12e373);
    },
    'clear'(_0x1e8532) {
      return _0xd2ba14["clearProjectSession"](_0x1e8532);
    },
    async 'move'(_0xbf1cff, _0x2a3f20, {
      projectName = ''
    } = {}) {
      const _0x38c348 = normalizeProjectWorkspaceId(_0xbf1cff);
      const _0x12f799 = normalizeProjectWorkspaceId(_0x2a3f20);
      if (!_0x38c348 || !_0x12f799 || _0x38c348 === _0x12f799) {
        return null;
      }
      const _0x33ea20 = await _0xd2ba14["loadProjectSession"](_0x38c348);
      if (!_0x33ea20) {
        return null;
      }
      const _0x4aa4c8 = await _0xd2ba14["saveProjectSession"]({
        ..._0x33ea20,
        'projectId': _0x12f799,
        'projectName': projectName || _0x33ea20["projectName"],
        'hasUnsavedChanges': _0x33ea20["hasUnsavedChanges"]
      });
      await _0xd2ba14['clearProjectSession'](_0x38c348);
      return _0x4aa4c8;
    }
  });
  function _0x38cca6(_0x74a4bf) {
    if (typeof performance?.["mark"] !== "function") {
      return;
    }
    performance["mark"](_0x74a4bf);
  }
  function _0x49cc78(_0x1eddba, _0x22c02d, _0x495ed1) {
    if (typeof performance?.["measure"] !== "function") {
      return;
    }
    try {
      performance["measure"](_0x1eddba, _0x22c02d, _0x495ed1);
    } catch {}
  }
  function _0x197534() {
    if (window['__perfDebug'] !== !![]) {
      return;
    }
    if (typeof performance?.["getEntriesByName"] !== "function") {
      return;
    }
    BOOT_PERF_MEASURE_NAMES["forEach"](_0x5c160f => {
      const _0x5e4c29 = performance["getEntriesByName"](_0x5c160f);
      const _0x274e88 = _0x5e4c29[_0x5e4c29["length"] - 0x1];
      if (!_0x274e88) {
        return;
      }
      console["log"]('[perf]\x20' + _0x5c160f + ':\x20' + _0x274e88["duration"]["toFixed"](0x1) + 'ms');
    });
  }
  function _0x6eaf3({
    projectId: _0x2eac70,
    projectName: _0x48a89f,
    multiData: _0x4ca68c,
    multiDataSanitized = ![],
    persistenceRevision = null
  }) {
    return {
      'projectId': _0x2eac70,
      'projectName': _0x48a89f,
      'workspaceScopeVersion': window["_v2WorkspaceProjectScoped"] === !![] ? 0x1 : 0x0,
      'multiData': _0x4ca68c || {},
      'multiDataSanitized': multiDataSanitized,
      'persistenceRevision': persistenceRevision
    };
  }
  function _0x4eb8dd({
    projectId: _0x50ce17,
    projectName: _0x5ec869,
    multiData: _0x21f81b,
    multiDataSanitized = ![],
    persistenceRevision = null
  }) {
    const _0x18e4d1 = _0x6eaf3({
      'projectId': _0x50ce17,
      'projectName': _0x5ec869,
      'multiData': _0x21f81b,
      'multiDataSanitized': multiDataSanitized,
      'persistenceRevision': persistenceRevision
    });
    writeDreaminaResumeBackupSync(_0x18e4d1);
    return _0xd2ba14['save'](_0x18e4d1);
  }
  function _0x45897f(_0x3f34b5, {
    sanitizeForPersistence = ![],
    captureVisualSnapshot = ![],
    includeProjectContexts = ![]
  } = {}) {
    if (!_0x3f34b5) {
      return null;
    }
    if (typeof _0x3f34b5['getMultiDataSnapshot'] === 'function') {
      return _0x3f34b5["getMultiDataSnapshot"]({
        'sanitizeForPersistence': sanitizeForPersistence,
        'captureVisualSnapshot': captureVisualSnapshot,
        'includeProjectContexts': includeProjectContexts
      });
    }
    if (typeof _0x3f34b5['getMultiData'] === "function") {
      return _0x3f34b5["getMultiData"]();
    }
    return null;
  }
  function _0x278b69() {
    const _0x59e8cf = _0x1b3935?.['getPersistenceRevisionSnapshot']?.() || null;
    if (!_0x59e8cf) {
      return {
        'cacheKey': '',
        'persistenceRevision': null
      };
    }
    const _0x3ea0b6 = typeof _0x1b3935?.["getCanvasProjectContext"] === "function" ? (_0x59e8cf['canvases'] || [])["map"](_0x3c5b48 => ({
      'canvasId': String(_0x3c5b48?.['id'] || ''),
      'context': _0x1b3935["getCanvasProjectContext"](_0x3c5b48?.['id']) || null
    })) : null;
    return {
      'persistenceRevision': _0x59e8cf,
      'cacheKey': createStableSignature({
        'persistenceRevision': _0x59e8cf,
        'projectContexts': _0x3ea0b6,
        'project': _0x18360d()
      })
    };
  }
  function _0x4cda0b(_0x4063ef = _0x278b69()) {
    const _0x313d92 = Date["now"]();
    if (_0x4063ef["cacheKey"] && _0x5e5905?.["cacheKey"] === _0x4063ef["cacheKey"] && _0x313d92 - _0x5e5905["createdAt"] <= PERSISTABLE_SNAPSHOT_REUSE_MS) {
      return _0x5e5905;
    }
    const _0x3d9b04 = typeof _0x1b3935?.["getPersistableMultiDataSnapshot"] === 'function';
    const _0x5b0e3e = _0x3d9b04 ? _0x1b3935["getPersistableMultiDataSnapshot"]({
      'includeProjectContexts': !![]
    }) : _0x45897f(_0x1b3935, {
      'sanitizeForPersistence': ![],
      'includeProjectContexts': !![]
    });
    const _0x4600e6 = _0x3d9b04 ? _0x5b0e3e || {} : a926_0x562701(_0x5b0e3e || {});
    const _0x294c95 = {
      'cacheKey': _0x4063ef["cacheKey"],
      'createdAt': _0x313d92,
      'multiData': _0x4600e6,
      'persistenceRevision': _0x4063ef['persistenceRevision']
    };
    _0x5e5905 = _0x4063ef["cacheKey"] ? _0x294c95 : null;
    return _0x294c95;
  }
  function _0xe83a2f() {
    return document["getElementById"]('projectNameText')?.["textContent"] || getUntitledProjectName();
  }
  function _0x409964() {
    return desktopBridge["project"]['isAvailable']() ? desktopBridge['project'] : null;
  }
  function _0x187582() {
    const _0x5de688 = Number(window["_v2CurrentProjectLastModified"] || 0x0);
    return Number["isFinite"](_0x5de688) && _0x5de688 > 0x0 ? Math["round"](_0x5de688) : 0x0;
  }
  function _0x18360d() {
    return {
      'projectId': window['currentProjectId'] || "default_v2_project",
      'projectName': _0xe83a2f(),
      'filename': window["_v2CurrentFile"] || '',
      'recentId': window["_v2CurrentRecentProjectId"] || '',
      'displayPath': window['_v2CurrentProjectDisplayPath'] || '',
      'lastKnownProjectLastModified': _0x187582(),
      'workspaceScopeVersion': window["_v2WorkspaceProjectScoped"] === !![] ? 0x1 : 0x0
    };
  }
  function _0x4f0408() {
    return _0x1b3935?.['hasDirtyCanvases']?.() === !![];
  }
  async function _0x29ce96(_0x1b7c08 = "auto") {
    const _0xd2c716 = _0x409964();
    if (typeof _0xd2c716?.['writeRecoverySnapshot'] !== "function") {
      return {
        'success': ![],
        'reason': "api-unavailable"
      };
    }
    if (!_0x4f0408()) {
      return {
        'success': ![],
        'reason': 'clean'
      };
    }
    const _0x339b8d = _0x18360d();
    const _0x2e69fe = _0x278b69();
    const _0x4ffb68 = hasCompleteContentPersistenceRevision(_0x2e69fe["persistenceRevision"]);
    let _0x246d3d = _0x2e69fe["persistenceRevision"] ? buildRecoverySnapshotSignature({
      'meta': _0x339b8d,
      'multiData': null,
      'persistenceRevision': _0x2e69fe["persistenceRevision"]
    }) : '';
    const _0x56ed66 = Date["now"]();
    if (_0x246d3d && _0x246d3d === _0x211e50 && (_0x4ffb68 || _0x56ed66 - _0x3b6f0f < RECOVERY_SNAPSHOT_DEDUPE_MS)) {
      return {
        'success': !![],
        'deduped': !![]
      };
    }
    const {
      multiData: _0x107fb9,
      persistenceRevision: _0x136201
    } = _0x4cda0b(_0x2e69fe);
    if (!_0x107fb9?.["canvases"]?.['length']) {
      return {
        'success': ![],
        'reason': "empty-canvas"
      };
    }
    _0x246d3d ||= buildRecoverySnapshotSignature({
      'meta': _0x339b8d,
      'multiData': _0x107fb9,
      'persistenceRevision': _0x136201
    });
    if (_0x246d3d && _0x246d3d === _0x211e50 && (_0x4ffb68 || _0x56ed66 - _0x3b6f0f < RECOVERY_SNAPSHOT_DEDUPE_MS)) {
      return {
        'success': !![],
        'deduped': !![]
      };
    }
    if (_0x1787f8 && _0x51865f === _0x246d3d) {
      return _0x1787f8;
    }
    if (_0x1787f8) {
      return _0x1787f8["catch"](() => null)['then'](() => _0x29ce96(_0x1b7c08));
    }
    _0x1787f8 = _0xd2c716["writeRecoverySnapshot"]({
      ..._0x339b8d,
      'reason': _0x1b7c08,
      'multiData': _0x107fb9
    })["then"](_0x421a49 => {
      _0x421a49?.['success'] !== ![] && (_0x211e50 = _0x246d3d, _0x3b6f0f = Date["now"]());
      return _0x421a49;
    })["finally"](() => {
      _0x1787f8 = null;
      _0x51865f = '';
    });
    _0x51865f = _0x246d3d;
    return _0x1787f8;
  }
  function _0x392325(_0x2b9a52 = "dirty-state") {
    const _0x39c048 = _0x409964();
    if (typeof _0x39c048?.["writeRecoverySnapshot"] !== 'function') {
      return;
    }
    if (!shouldWritePeriodicRecoverySnapshot({
      'isChromeShell': desktopBridge["isChromeShell"]
    })) {
      return;
    }
    _0x38a4f8 !== null && clearTimeout(_0x38a4f8);
    _0x38a4f8 = setTimeout(() => {
      _0x38a4f8 = null;
      _0x180abb(() => {
        void _0x29ce96(_0x2b9a52)["catch"](_0x194266 => {
          console["warn"]("[projectLifecycle] 写入恢复快照失败:", _0x194266);
        });
      }, {
        'timeout': 0x5dc
      });
    }, 0x1f4);
  }
  function _0x2a3760() {
    if (_0x38a4f8 === null) {
      return;
    }
    clearTimeout(_0x38a4f8);
    _0x38a4f8 = null;
  }
  function _0x4a29ad({
    writeRecovery = ![],
    reason = "dirty-state",
    knownHasUnsavedChanges = null
  } = {}) {
    const _0x2b9e2e = _0x409964();
    const _0x413f6c = typeof knownHasUnsavedChanges === 'boolean' ? knownHasUnsavedChanges : _0x4f0408();
    if (typeof _0x2b9e2e?.['setUnsavedState'] === 'function') {
      const _0x56f1de = _0x2b9e2e['setUnsavedState']({
        'hasUnsavedChanges': _0x413f6c,
        'projectName': _0xe83a2f()
      });
      _0x56f1de && typeof _0x56f1de["catch"] === "function" && void _0x56f1de["catch"](_0x166db2 => {
        console['warn']("[projectLifecycle] 同步未保存状态失败:", _0x166db2);
      });
    }
    if (_0x413f6c && writeRecovery) {
      _0x392325(reason);
      return;
    }
    !_0x413f6c && _0x2a3760();
  }
  async function _0x434143() {
    const _0x33fc75 = _0x409964();
    if (typeof _0x33fc75?.["getRecoverySnapshotInfo"] !== "function" || typeof _0x33fc75?.["readRecoverySnapshot"] !== 'function') {
      return null;
    }
    try {
      const _0x471139 = await _0x33fc75["getRecoverySnapshotInfo"](_0x18360d());
      if (!_0x471139?.["exists"]) {
        return null;
      }
      if (_0x471139["isNewerThanProject"] !== !![]) {
        await _0x33fc75["clearRecoverySnapshot"]?.();
        return null;
      }
      const _0x2798a7 = await _0x33fc75["readRecoverySnapshot"]();
      if (!_0x2798a7?.["success"] || !_0x2798a7["data"]) {
        return null;
      }
      return {
        'projectId': _0x2798a7["projectId"] || window["currentProjectId"] || "default_v2_project",
        'projectName': _0x2798a7['projectName'] || getUntitledProjectName(),
        'workspaceScopeVersion': Number(_0x2798a7['workspaceScopeVersion']) === 0x1 ? 0x1 : 0x0,
        'multiData': _0x59c6b3["resolveCanvasData"](_0x2798a7["data"]),
        'recovery': !![],
        'filename': _0x2798a7["filename"] || '',
        'recentId': _0x2798a7["recentId"] || '',
        'displayPath': _0x2798a7["displayPath"] || '',
        'lastModified': Number(_0x2798a7["lastModified"] || 0x0) || 0x0
      };
    } catch (_0x4400a8) {
      console["warn"]('[projectLifecycle]\x20读取恢复快照失败:', _0x4400a8);
      return null;
    }
  }
  function _0x3292e4(_0x2ca881) {
    if (!_0x2ca881?.['recovery']) {
      return;
    }
    window["_v2CurrentFile"] = _0x2ca881["filename"] || '';
    window["_v2CurrentRecentProjectId"] = _0x2ca881['recentId'] || '';
    window["_v2CurrentProjectDisplayPath"] = _0x2ca881["displayPath"] || '';
    window["_v2CurrentProjectLastModified"] = Number(_0x2ca881['lastModified'] || 0x0) || 0x0;
  }
  function _0xf73d3f() {
    if (_0x3fa0eb) {
      return;
    }
    _0x3fa0eb = !![];
    window['__aiCanvasWriteRecoverySnapshotForClose'] = (_0xae54ab = 'window-close') => _0x29ce96(_0xae54ab);
    window["addEventListener"]('aicanvas:dirty-state-changed', () => {
      _0x4a29ad({
        'writeRecovery': !![],
        'reason': "dirty-state"
      });
    });
  }
  function _0x3c5551() {
    if (_0x35ca02) {
      _0x3f7892 = !![];
      return _0x35ca02;
    }
    const _0x4b086b = async () => {
      const {
        multiData: _0x237736,
        persistenceRevision: _0x9bee69
      } = _0x4cda0b();
      const _0x35d34d = window["currentProjectId"];
      const _0x188e03 = _0xe83a2f();
      if (!_0x237736?.["canvases"]?.["length"]) {
        return;
      }
      await _0x4eb8dd({
        'projectId': _0x35d34d,
        'projectName': _0x188e03,
        'multiData': _0x237736,
        'multiDataSanitized': !![],
        'persistenceRevision': _0x9bee69
      });
    };
    _0x35ca02 = (async () => {
      try {
        do {
          _0x3f7892 = ![];
          await _0x4b086b();
        } while (_0x3f7892);
      } finally {
        _0x35ca02 = null;
      }
    })();
    return _0x35ca02;
  }
  function _0x576908(_0x206cd0) {
    return _0x28d474(_0x206cd0 || {});
  }
  const _0x210c7c = 0x4e20;
  const _0x3ec5f7 = 0x55f0;
  function _0x180abb(_0x1a8d17, {
    timeout = 0x5dc,
    delayMs = 0x0,
    retryDelayMs = WORKSPACE_CACHE_BUSY_RETRY_MS,
    onError = _0x117275 => {
      console['warn']("[projectLifecycle] 后台任务失败:", _0x117275);
    }
  } = {}) {
    if (typeof _0x1a8d17 !== 'function') {
      return null;
    }
    const _0x3c404d = createWorkspaceCacheIdleScheduler({
      'run': _0x1a8d17,
      'isBusy': () => isWorkspaceCacheInteractionBusy({
        'documentRef': document,
        'CanvasTabManager': _0x1b3935
      }),
      'retryDelayMs': retryDelayMs,
      'idleTimeoutMs': timeout,
      'onError': onError
    });
    _0x3c404d["schedule"]({
      'delayMs': delayMs
    });
    return _0x3c404d;
  }
  function _0x4ea78e(_0x2f7b94) {
    _0x180abb(_0x2f7b94, {
      'timeout': 0x5dc
    });
  }
  function _0x408874(_0xeb84c6, {
    timeout: _0x3e6759,
    delayMs: _0x5891b9
  } = {}) {
    _0x180abb(_0xeb84c6, {
      'timeout': _0x3e6759,
      'delayMs': _0x5891b9,
      'retryDelayMs': 0x7d0,
      'onError'(_0x9f32d6) {
        console['warn']("[projectLifecycle] 历史图片后台任务失败:", _0x9f32d6);
      }
    });
  }
  function _0x2a6c13() {
    return new Promise(_0x54355d => setTimeout(_0x54355d, 0x0));
  }
  function _0x429840(_0x1478f3) {
    return new Promise(_0x2e8106 => {
      setTimeout(_0x2e8106, Math["max"](0x0, Number(_0x1478f3) || 0x0));
    });
  }
  function _0x3fadaa() {
    return new Promise(_0x2e2eb7 => {
      if (typeof window?.["requestIdleCallback"] === "function") {
        window["requestIdleCallback"](() => _0x2e2eb7(), {
          'timeout': INITIAL_REVEAL_IDLE_TIMEOUT_MS
        });
        return;
      }
      setTimeout(_0x2e2eb7, 0x30);
    });
  }
  async function _0x3bfb9f(_0x1045e3) {
    let _0x104dca = [];
    let _0x57fd88 = -0x1;
    let _0x49c1d0 = 0x0;
    for (let _0x4318d1 = 0x0; _0x4318d1 < INITIAL_IMAGE_READY_MAX_ATTEMPTS; _0x4318d1 += 0x1) {
      const _0x29c245 = collectInitialImageRevealEntries(_0x1045e3, {
        'windowObject': window
      });
      _0x104dca = _0x29c245["filter"](_0x352bc9 => _0x352bc9['ready'] === !![]);
      _0x49c1d0 = _0x104dca["length"] === _0x57fd88 ? _0x49c1d0 + 0x1 : 0x0;
      _0x57fd88 = _0x104dca['length'];
      if (shouldFinishInitialImageReadinessWait({
        'totalCount': _0x29c245["length"],
        'readyCount': _0x104dca["length"],
        'stablePollCount': _0x49c1d0,
        'attempt': _0x4318d1
      })) {
        return _0x104dca;
      }
      await _0x429840(INITIAL_IMAGE_READY_POLL_MS);
    }
    return _0x104dca;
  }
  function _0x5d7f68({
    canvasEl: _0x529d76,
    afterHidden: _0x5928a8
  } = {}) {
    cancelStartupLoaderGuard(window);
    _0x12b80a();
    _0x12b80a = () => {};
    if (_0x529d76) {
      _0x529d76["style"]["transition"] = '';
    }
    if (window["hideGlobalLoading"]) {
      window['hideGlobalLoading']();
    }
    _0x38cca6("loader hidden:end");
    _0x49cc78("loader hidden", "initApp:start", "loader hidden:end");
    if (typeof _0x5928a8 === "function") {
      _0x5928a8();
    }
    _0x197534();
  }
  async function _0x42fd5d({
    wrapEl: _0x2e05ee,
    canvasEl: _0xc5334d,
    animate = ![],
    imageFirst = !![],
    afterHidden: _0x9b7810
  } = {}) {
    const _0x5d4d80 = document['getElementById']("v2-initial-loader");
    const _0x213caf = _0x242cf9['getStateRaw']?.()?.["nodes"] || {};
    const _0x51d7a6 = window?.['matchMedia']?.('(prefers-reduced-motion:\x20reduce)')?.["matches"] === !![];
    let _0x55d6ac;
    _0x5d4d80 && !_0x51d7a6 && (_0x5d4d80["setAttribute"]?.("data-reveal-ready", "true"), _0x55d6ac = _0x429840(INITIAL_PROGRESS_FINISH_MS));
    const _0x47f281 = imageFirst && hasInitialCanvasImageNodes(_0x213caf) && !_0x51d7a6 ? await _0x3bfb9f(_0xc5334d) : [];
    _0x47f281["length"] > 0x0 && (await _0x3fadaa(), await waitForInitialRevealFrame());
    await _0x55d6ac;
    const _0x522ffa = shouldUseInitialImageFirstReveal({
      'nodes': _0x213caf,
      'targetCount': _0x47f281["length"],
      'reducedMotion': _0x51d7a6
    });
    const _0x5e3af3 = _0x522ffa ? createInitialImageRevealLayer({
      'loader': _0x5d4d80,
      'imageTargets': _0x47f281,
      'documentObject': document,
      'windowObject': window
    }) : null;
    if (!_0x522ffa || !_0x5e3af3) {
      if (animate) {
        await _0x429840(0x50);
      }
      if (_0xc5334d) {
        _0xc5334d["style"]['transition'] = '';
      }
      _0x2e05ee && (_0x2e05ee['style']["transition"] = animate ? "opacity 0.2s ease-in-out" : '', _0x2e05ee["style"]["opacity"] = '1');
      _0x5d4d80 ? (_0x5d4d80["style"]['opacity'] = '0', _0x5d4d80['style']["visibility"] = "hidden", setTimeout(() => {
        _0x5d4d80['remove']?.();
        _0x2e05ee?.["classList"]["remove"]("is-initial-header-locked");
      }, 0x190)) : _0x2e05ee?.["classList"]["remove"]("is-initial-header-locked");
      _0x5d7f68({
        'canvasEl': _0xc5334d,
        'afterHidden': _0x9b7810
      });
      return;
    }
    _0x2e05ee['style']['transition'] = '';
    _0x2e05ee["style"]["opacity"] = '1';
    _0x5d4d80["classList"]["add"]("is-initial-image-reveal-shell");
    await _0x429840(INITIAL_BRAND_IMAGE_HANDOFF_MS);
    await waitForInitialRevealFrame();
    _0x5d4d80["classList"]["add"]("is-initial-image-reveal-active");
    await _0x429840(resolveInitialImageRevealDurationMs(_0x47f281["length"]) - INITIAL_BACKGROUND_REVEAL_MS);
    await waitForInitialRevealFrame();
    _0x5d4d80["classList"]["add"]("is-initial-background-reveal");
    await _0x429840(INITIAL_BACKGROUND_REVEAL_MS);
    _0x5d4d80['classList']["add"]('is-initial-image-reveal-handoff');
    await _0x429840(INITIAL_IMAGE_LAYER_HANDOFF_MS);
    _0x5d4d80["style"]["visibility"] = "hidden";
    _0x5d4d80["remove"]?.();
    _0x2e05ee['classList']['remove']("is-initial-header-locked");
    _0x5d7f68({
      'canvasEl': _0xc5334d,
      'afterHidden': _0x9b7810
    });
  }
  function _0x2e24c2({
    projectId: _0x3cb84f,
    projectName: _0x49fdf3,
    multiData: _0x580740
  }) {
    if (!_0x580740?.["canvases"]?.["length"]) {
      return;
    }
    _0x4ea78e(async () => {
      try {
        const {
          changed: _0x31f90f,
          multiData: _0x3fb6d6
        } = await _0x3ca625(_0x580740);
        if (!_0x31f90f) {
          return;
        }
        await _0x4eb8dd({
          'projectId': _0x3cb84f,
          'projectName': _0x49fdf3,
          'multiData': _0x3fb6d6
        });
      } catch (_0x2cd023) {
        console["warn"]('[main]\x20缩略图迁移失败', _0x2cd023);
      }
    });
  }
  function _0x2cb572(_0x499101) {
    const _0x52ad4f = String(_0x499101 || '')['trim']();
    return /^https?:\/\//i["test"](_0x52ad4f) || _0x52ad4f['startsWith']('//');
  }
  function _0x24b01f(_0x1dcfd8) {
    const _0x41c5ff = [];
    for (const _0x1ad6e4 of Object["values"](_0x1dcfd8 || {})) {
      if (!_0x1ad6e4 || _0x1ad6e4['type'] !== "ai-image") {
        continue;
      }
      const _0x34f670 = Array["isArray"](_0x1ad6e4['images']) ? _0x1ad6e4["images"] : [];
      for (let _0x27165a = 0x0; _0x27165a < _0x34f670["length"]; _0x27165a += 0x1) {
        const _0x2b3ade = _0x34f670[_0x27165a] || {};
        if (String(_0x2b3ade["localPath"] || '')['trim']()) {
          continue;
        }
        const _0x45e781 = String(_0x2b3ade['remoteFallbackUrl'] || _0x2b3ade["sourceUrl"] || _0x2b3ade["imageUrl"] || _0x2b3ade["thumbUrl"] || '')["trim"]();
        if (!_0x45e781 || !_0x2cb572(_0x45e781)) {
          continue;
        }
        _0x41c5ff["push"]({
          'nodeId': _0x1ad6e4['id'],
          'idx': _0x27165a,
          'remote': _0x45e781
        });
      }
      if (_0x34f670["length"] === 0x0 && !String(_0x1ad6e4["localPath"] || '')["trim"]() && _0x2cb572(_0x1ad6e4["remoteFallbackUrl"] || _0x1ad6e4["thumbUrl"] || _0x1ad6e4["imageUrl"] || _0x1ad6e4["sourceUrl"])) {
        const _0x452ebd = String(_0x1ad6e4['remoteFallbackUrl'] || _0x1ad6e4["sourceUrl"] || _0x1ad6e4["imageUrl"] || _0x1ad6e4['thumbUrl'] || '')["trim"]();
        if (_0x452ebd) {
          _0x41c5ff['push']({
            'nodeId': _0x1ad6e4['id'],
            'idx': -0x1,
            'remote': _0x452ebd
          });
        }
      }
    }
    return _0x41c5ff;
  }
  function _0x4f5170(_0x5b2650, _0xa29397) {
    if (!_0x5b2650) {
      return ![];
    }
    if (_0xa29397["idx"] >= 0x0) {
      const _0x346e82 = Array['isArray'](_0x5b2650["images"]) ? _0x5b2650["images"] : [];
      const _0x456e27 = _0x346e82[_0xa29397["idx"]];
      if (!_0x456e27 || String(_0x456e27["localPath"] || '')["trim"]()) {
        return ![];
      }
      const _0x389bf7 = String(_0x456e27["remoteFallbackUrl"] || _0x456e27["sourceUrl"] || _0x456e27["imageUrl"] || _0x456e27["thumbUrl"] || '')["trim"]();
      return _0x389bf7 === _0xa29397["remote"];
    }
    if (String(_0x5b2650["localPath"] || '')['trim']()) {
      return ![];
    }
    const _0x222abd = String(_0x5b2650["remoteFallbackUrl"] || _0x5b2650["sourceUrl"] || _0x5b2650["imageUrl"] || _0x5b2650['thumbUrl'] || '')["trim"]();
    return _0x222abd === _0xa29397["remote"];
  }
  function _0x315ec8(_0xc6dcd7, _0x25e37d) {
    const _0x5a60f5 = typeof _0x25e37d === "string" ? String(_0x25e37d || '')["trim"]() : String(_0x25e37d?.['localUrl'] || _0x25e37d?.["url"] || '')["trim"]();
    const _0x383298 = typeof _0x25e37d === 'string' ? normalizeLocalPath(_0x25e37d) : pickResultLocalPath(_0x25e37d) || normalizeLocalPath(_0x5a60f5);
    if (!_0x383298) {
      return ![];
    }
    const _0x5659bc = _0x25e37d && typeof _0x25e37d === "object" ? buildImageNodeStorageFields(_0x25e37d) : {};
    const _0x1b5bac = buildCanvasLocalImageFields(_0x25e37d && typeof _0x25e37d === 'object' ? _0x25e37d : {
      'localPath': _0x383298
    });
    const _0x353fb3 = _0x242cf9["getStateRaw"]()?.['nodes']?.[_0xc6dcd7["nodeId"]];
    if (!_0x4f5170(_0x353fb3, _0xc6dcd7)) {
      return ![];
    }
    const _0x3e5f06 = {};
    if (_0xc6dcd7["idx"] >= 0x0) {
      const _0x3d006e = Array["isArray"](_0x353fb3["images"]) ? _0x353fb3["images"]["slice"]() : [];
      if (!_0x3d006e[_0xc6dcd7["idx"]]) {
        return ![];
      }
      _0x3d006e[_0xc6dcd7["idx"]] = {
        ...(_0x3d006e[_0xc6dcd7["idx"]] || {}),
        ..._0x1b5bac,
        ..._0x5659bc,
        'remoteFallbackUrl': '',
        'localSaveError': '',
        'originalWidth': Number(_0x25e37d?.["originalWidth"] || 0x0) || _0x3d006e[_0xc6dcd7['idx']]?.['originalWidth'],
        'originalHeight': Number(_0x25e37d?.["originalHeight"] || 0x0) || _0x3d006e[_0xc6dcd7["idx"]]?.["originalHeight"]
      };
      _0x3e5f06["images"] = _0x3d006e;
      (_0x353fb3["mainImageIndex"] || 0x0) === _0xc6dcd7["idx"] && (Object["assign"](_0x3e5f06, _0x1b5bac), Object["assign"](_0x3e5f06, _0x5659bc), _0x3e5f06["remoteFallbackUrl"] = '', _0x3e5f06['localSaveError'] = '', _0x3e5f06["originalWidth"] = Number(_0x25e37d?.["originalWidth"] || 0x0) || _0x353fb3['originalWidth'], _0x3e5f06["originalHeight"] = Number(_0x25e37d?.["originalHeight"] || 0x0) || _0x353fb3['originalHeight']);
    } else {
      Object['assign'](_0x3e5f06, _0x1b5bac);
      Object["assign"](_0x3e5f06, _0x5659bc);
      _0x3e5f06["remoteFallbackUrl"] = '';
      _0x3e5f06["localSaveError"] = '';
      _0x3e5f06["originalWidth"] = Number(_0x25e37d?.["originalWidth"] || 0x0) || _0x353fb3["originalWidth"];
      _0x3e5f06["originalHeight"] = Number(_0x25e37d?.["originalHeight"] || 0x0) || _0x353fb3["originalHeight"];
    }
    if (Object['keys'](_0x3e5f06)["length"] === 0x0) {
      return ![];
    }
    _0x242cf9["updateNodeData"](_0xc6dcd7["nodeId"], _0x3e5f06);
    return !![];
  }
  function _0x4548c1(_0x53ba5b) {
    return normalizeLocalPath(_0x53ba5b?.['originalLocalPath'] || _0x53ba5b?.["localPath"]);
  }
  function _0x1e5454(_0x147eb1) {
    return {
      'displayLocalPath': normalizeLocalPath(_0x147eb1?.['displayLocalPath']),
      'thumbLocalPath': normalizeLocalPath(_0x147eb1?.["thumbLocalPath"])
    };
  }
  function _0x850d5f(_0x5e6ecf) {
    return needsImageDerivatives(_0x5e6ecf);
  }
  function _0x259106(_0x51fb19) {
    const _0x4ed5ab = normalizeLocalPath(_0x51fb19)["toLowerCase"]();
    return _0x4ed5ab["includes"]('/_derived/') || _0x4ed5ab['includes']("/derived/") || _0x4ed5ab["includes"]("/videothumbs/");
  }
  function _0x301e09(_0x1dc262) {
    const {
      displayLocalPath: _0x2bda4f,
      thumbLocalPath: _0x22da12
    } = _0x1e5454(_0x1dc262);
    const _0x91b9ed = [_0x2bda4f, _0x22da12]["filter"](Boolean);
    return _0x91b9ed['length'] > 0x0 && _0x91b9ed["every"](_0x259106);
  }
  async function _0xf1d943(_0xb6769d) {
    if (typeof _0x59c6b3?.["checkLocalMediaExists"] !== 'function') {
      return ![];
    }
    const _0x7de113 = _0x4548c1(_0xb6769d);
    if (!_0x7de113) {
      return ![];
    }
    const {
      displayLocalPath: _0x2555db,
      thumbLocalPath: _0x457a1f
    } = _0x1e5454(_0xb6769d);
    const _0x56f87c = [_0x2555db, _0x457a1f]["filter"](Boolean);
    if (_0x56f87c["length"] === 0x0) {
      return ![];
    }
    for (const _0x3161b5 of _0x56f87c) {
      try {
        if (!(await _0x59c6b3["checkLocalMediaExists"](_0x3161b5))) {
          return !![];
        }
      } catch {
        return !![];
      }
    }
    return ![];
  }
  async function _0x20132d(_0x4a80a) {
    if (_0x850d5f(_0x4a80a)) {
      return !![];
    }
    if (_0x301e09(_0x4a80a)) {
      return ![];
    }
    return await _0xf1d943(_0x4a80a);
  }
  async function _0x4cfdda(_0x1bfd19) {
    const _0x17050e = [];
    for (const _0x2ba06f of Object['values'](_0x1bfd19 || {})) {
      if (!_0x2ba06f) {
        continue;
      }
      const _0x42db6e = String(_0x2ba06f["type"] || '')['trim']();
      if (_0x42db6e === "source-image") {
        (await _0x20132d(_0x2ba06f)) && _0x17050e["push"]({
          'nodeId': _0x2ba06f['id'],
          'idx': -0x1,
          'nodeType': _0x42db6e,
          'localPath': _0x4548c1(_0x2ba06f)
        });
        continue;
      }
      if (_0x42db6e !== "ai-image") {
        continue;
      }
      const _0x5649ed = Array["isArray"](_0x2ba06f["images"]) ? _0x2ba06f["images"] : [];
      if (_0x5649ed["length"] > 0x0) {
        for (let _0x4238e1 = 0x0; _0x4238e1 < _0x5649ed["length"]; _0x4238e1 += 0x1) {
          const _0x49fd05 = _0x5649ed[_0x4238e1] || {};
          if (!(await _0x20132d(_0x49fd05))) {
            continue;
          }
          _0x17050e["push"]({
            'nodeId': _0x2ba06f['id'],
            'idx': _0x4238e1,
            'nodeType': _0x42db6e,
            'localPath': _0x4548c1(_0x49fd05)
          });
        }
        continue;
      }
      (await _0x20132d(_0x2ba06f)) && _0x17050e['push']({
        'nodeId': _0x2ba06f['id'],
        'idx': -0x1,
        'nodeType': _0x42db6e,
        'localPath': _0x4548c1(_0x2ba06f)
      });
    }
    return _0x17050e;
  }
  function _0x311f6a(_0x3eb1a6, _0x2ccdab) {
    if (!_0x3eb1a6) {
      return ![];
    }
    if (_0x2ccdab["idx"] >= 0x0) {
      const _0x2790d0 = Array["isArray"](_0x3eb1a6['images']) ? _0x3eb1a6["images"] : [];
      const _0x393783 = _0x2790d0[_0x2ccdab["idx"]];
      if (!_0x393783) {
        return ![];
      }
      return _0x4548c1(_0x393783) === _0x2ccdab['localPath'];
    }
    return _0x4548c1(_0x3eb1a6) === _0x2ccdab["localPath"];
  }
  function _0x3852be(_0xbb7839, _0x3b44f3) {
    const _0x2dfda5 = buildImageNodeStorageFields(_0x3b44f3);
    if (!_0x2dfda5["displayLocalPath"] && !_0x2dfda5["thumbLocalPath"]) {
      return ![];
    }
    const _0x96e262 = _0x242cf9['getStateRaw']()?.["nodes"]?.[_0xbb7839['nodeId']];
    if (!_0x311f6a(_0x96e262, _0xbb7839)) {
      return ![];
    }
    const _0x4db9f6 = {};
    if (_0xbb7839['idx'] >= 0x0) {
      const _0x285905 = Array["isArray"](_0x96e262["images"]) ? _0x96e262["images"]["slice"]() : [];
      if (!_0x285905[_0xbb7839["idx"]]) {
        return ![];
      }
      _0x285905[_0xbb7839["idx"]] = {
        ...(_0x285905[_0xbb7839["idx"]] || {}),
        ..._0x2dfda5,
        'originalWidth': Number(_0x3b44f3?.['originalWidth'] || 0x0) || _0x285905[_0xbb7839["idx"]]?.['originalWidth'],
        'originalHeight': Number(_0x3b44f3?.['originalHeight'] || 0x0) || _0x285905[_0xbb7839["idx"]]?.['originalHeight']
      };
      _0x4db9f6["images"] = _0x285905;
      (_0x96e262["mainImageIndex"] || 0x0) === _0xbb7839['idx'] && Object["assign"](_0x4db9f6, {
        ..._0x2dfda5,
        'originalWidth': Number(_0x3b44f3?.["originalWidth"] || 0x0) || _0x96e262["originalWidth"],
        'originalHeight': Number(_0x3b44f3?.["originalHeight"] || 0x0) || _0x96e262["originalHeight"]
      });
    } else {
      Object["assign"](_0x4db9f6, {
        ..._0x2dfda5,
        'originalWidth': Number(_0x3b44f3?.["originalWidth"] || 0x0) || _0x96e262["originalWidth"],
        'originalHeight': Number(_0x3b44f3?.["originalHeight"] || 0x0) || _0x96e262['originalHeight']
      });
    }
    if (Object['keys'](_0x4db9f6)["length"] === 0x0) {
      return ![];
    }
    _0x242cf9["updateNodeData"](_0xbb7839['nodeId'], _0x4db9f6);
    return !![];
  }
  async function _0x23bae2(_0x27a14d, _0x395df7 = 0xa) {
    if (typeof _0x59c6b3?.['saveRemoteImageLocallyDetailed'] !== "function" && typeof _0x59c6b3?.["saveRemoteImageLocally"] !== "function") {
      return;
    }
    if (!_0x27a14d || window["currentProjectId"] !== _0x27a14d) {
      return;
    }
    const _0x69042a = _0x24b01f(_0x242cf9["getStateRaw"]()?.["nodes"] || {});
    if (_0x69042a["length"] === 0x0) {
      return;
    }
    window["showToast"]?.(t('projectLifecycle.historicalAiLocalizationStarted', {
      'count': _0x69042a['length']
    }), "info");
    let _0x17898c = 0x0;
    await _0x2a6c13();
    for (let _0xd22f12 = 0x0; _0xd22f12 < _0x69042a["length"]; _0xd22f12 += _0x395df7) {
      if (window["currentProjectId"] !== _0x27a14d) {
        return;
      }
      const _0x589002 = _0x69042a["slice"](_0xd22f12, _0xd22f12 + _0x395df7);
      for (const _0x49bec7 of _0x589002) {
        if (window["currentProjectId"] !== _0x27a14d) {
          return;
        }
        try {
          const _0x37d9fc = typeof _0x59c6b3["saveRemoteImageLocallyDetailed"] === "function" ? await _0x59c6b3['saveRemoteImageLocallyDetailed'](_0x49bec7["remote"], _0x27a14d) : await _0x59c6b3['saveRemoteImageLocally'](_0x49bec7['remote'], _0x27a14d);
          _0x315ec8(_0x49bec7, _0x37d9fc) && (_0x17898c += 0x1);
        } catch {}
      }
      _0xd22f12 + _0x395df7 < _0x69042a['length'] && (await _0x2a6c13());
    }
    if (window["currentProjectId"] !== _0x27a14d) {
      return;
    }
    _0x17898c > 0x0 && window["showToast"]?.(t('projectLifecycle.historicalAiLocalizationFixed', {
      'count': _0x17898c
    }), "success");
  }
  async function _0x3f8379(_0x162212, _0x49a483 = 0xa) {
    if (typeof _0x59c6b3?.["ensureLocalImageDerivatives"] !== 'function') {
      return;
    }
    if (!_0x162212 || window['currentProjectId'] !== _0x162212) {
      return;
    }
    const _0x1b8f2a = await _0x4cfdda(_0x242cf9["getStateRaw"]()?.['nodes'] || {});
    if (_0x1b8f2a["length"] === 0x0) {
      return;
    }
    let _0x307e41 = 0x0;
    await _0x2a6c13();
    for (let _0xc13384 = 0x0; _0xc13384 < _0x1b8f2a["length"]; _0xc13384 += _0x49a483) {
      if (window["currentProjectId"] !== _0x162212) {
        return;
      }
      const _0x104639 = _0x1b8f2a["slice"](_0xc13384, _0xc13384 + _0x49a483);
      for (const _0x3cc41d of _0x104639) {
        if (window["currentProjectId"] !== _0x162212) {
          return;
        }
        try {
          const _0x2e68b7 = await _0x59c6b3["ensureLocalImageDerivatives"](_0x3cc41d["localPath"]);
          _0x3852be(_0x3cc41d, _0x2e68b7) && (_0x307e41 += 0x1);
        } catch {}
      }
      _0xc13384 + _0x49a483 < _0x1b8f2a["length"] && (await _0x2a6c13());
    }
    if (window['currentProjectId'] !== _0x162212) {
      return;
    }
    _0x307e41 > 0x0 && (window['_triggerLocalCacheSave']?.(), window["showToast"]?.(t('projectLifecycle.historicalImageDerivativesFixed', {
      'count': _0x307e41
    }), 'success'));
  }
  function _0x5a580c(_0x3b53bb, _0x1ac38c = 0xa) {
    if (!_0x3b53bb) {
      return;
    }
    _0x38cca6("historicalAiLocalization queued:end");
    _0x49cc78("historicalAiLocalization queued", "initApp:start", "historicalAiLocalization queued:end");
    _0x408874(() => _0x23bae2(_0x3b53bb, _0x1ac38c), {
      'timeout': 0x9c4,
      'delayMs': _0x210c7c
    });
  }
  function _0x14b97a(_0xf51d10, _0x540b27 = 0xa) {
    if (!_0xf51d10) {
      return;
    }
    _0x408874(() => _0x3f8379(_0xf51d10, _0x540b27), {
      'timeout': 0xc80,
      'delayMs': _0x3ec5f7
    });
  }
  window['_queueLegacyThumbnailMigration'] = _0x2e24c2;
  function _0x4363a5() {
    return _0x3c5551();
  }
  window["_triggerLocalCacheSave"] = _0x4363a5;
  let _0xcf9763 = ![];
  const _0x149e95 = createWorkspaceCacheIdleScheduler({
    'run': _0x4363a5,
    'isBusy': () => isWorkspaceCacheInteractionBusy({
      'documentRef': document,
      'CanvasTabManager': _0x1b3935
    }),
    'retryDelayMs': WORKSPACE_CACHE_BUSY_RETRY_MS,
    'onError'(_0x2443b0) {
      console["warn"]("[projectLifecycle] 自动缓存保存失败:", _0x2443b0);
    }
  });
  function _0x1b5c05() {
    return _0x149e95['schedule']({
      'delayMs': WORKSPACE_CACHE_META_DELAY_MS
    });
  }
  window["_triggerLocalCacheMetaSave"] = _0x1b5c05;
  function _0x271919() {
    _0x59c6b3["clearProjectPersistenceBlock"]?.();
    window["_isAppLoaded"] = !![];
    window["_checkEmptyHint"]?.();
  }
  function _0x242087({
    pageLifecycle = ![]
  } = {}) {
    _0x149e95["cancel"]();
    if (window["_isAppLoaded"] !== !![]) {
      return null;
    }
    if (!pageLifecycle) {
      return _0x4363a5();
    }
    const _0x1b8215 = Date["now"]();
    if (_0x14a61b) {
      return _0x14a61b;
    }
    if (_0x4134a2 > 0x0 && _0x1b8215 - _0x4134a2 < PAGE_LIFECYCLE_FLUSH_DEDUPE_MS) {
      return _0x35ca02 || Promise["resolve"](null);
    }
    const _0x4d5347 = _0x4363a5();
    if (!_0x4d5347 || typeof _0x4d5347['finally'] !== "function") {
      _0x4134a2 = Date["now"]();
      return _0x4d5347;
    }
    _0x14a61b = _0x4d5347;
    _0x4d5347["finally"](() => {
      _0x14a61b === _0x4d5347 && (_0x4134a2 = Date["now"](), _0x14a61b = null);
    });
    return _0x4d5347;
  }
  function _0x2ca1a3() {
    if (_0xcf9763) {
      return;
    }
    _0xcf9763 = !![];
    _0xf73d3f();
    let _0xbbb0dc = ![];
    _0x242cf9["subscribeSelector"](_0xbc8b08 => _0xbc8b08["_persistRev"], () => {
      if (!_0xbbb0dc) {
        _0xbbb0dc = !![];
        return;
      }
      if (window["_isAppLoaded"] !== !![]) {
        return;
      }
      _0x149e95['schedule']({
        'delayMs': WORKSPACE_CACHE_PERSIST_DELAY_MS
      });
      _0x4a29ad({
        'writeRecovery': !![],
        'reason': "persist-rev",
        'knownHasUnsavedChanges': !![]
      });
    });
  }
  function _0x5ab067() {
    _0x4f0408() && void _0x29ce96("beforeunload")["catch"](() => {});
    return _0x242087({
      'pageLifecycle': !![]
    });
  }
  function _0x190a15() {
    _0x4f0408() && void _0x29ce96("pagehide")["catch"](() => {});
    return _0x242087({
      'pageLifecycle': !![]
    });
  }
  function _0x237e0c() {
    if (document['visibilityState'] !== "hidden") {
      _0x4134a2 = 0x0;
      return;
    }
    _0x4f0408() && void _0x29ce96('visibility-hidden')["catch"](() => {});
    return _0x242087({
      'pageLifecycle': !![]
    });
  }
  async function _0x19a02a() {
    const _0xe47046 = t("projectLifecycle.projectPersistenceLoading");
    _0x59c6b3["setProjectPersistenceBlocked"]?.(_0xe47046);
    window["_isAppLoaded"] = ![];
    const _0x103aa2 = document['getElementById']("v2-wrap");
    const _0x1e8197 = document["getElementById"]("v2-canvas") || document['querySelector'](".v2-canvas");
    const _0x4afef8 = document["getElementById"]('v2-initial-loader');
    const _0x20b898 = waitForInitialLoaderSequence({
      'loader': _0x4afef8,
      'windowObject': window
    });
    _0x12b80a();
    _0x12b80a = scheduleInitialLoaderFailOpen({
      'loader': _0x4afef8,
      'wrapEl': _0x103aa2,
      'canvasEl': _0x1e8197,
      'timeoutMs': INITIAL_LOADER_MAX_VISIBLE_MS,
      'shouldReveal': () => rendererStartupState["snapshot"]()["ready"],
      'onTimeout': () => {
        cancelStartupLoaderGuard(window);
        window["hideGlobalLoading"]?.();
        console["warn"]("[startup] Initial loader exceeded " + INITIAL_LOADER_MAX_VISIBLE_MS + 'ms\x20and\x20was\x20dismissed.');
      }
    });
    try {
      _0x38cca6("initApp:start");
      _0x32c5ad();
      const _0x3a6e9c = readDreaminaResumeBackupSync();
      const _0x8453e0 = await _0x434143();
      const _0x574833 = _0x8453e0 || (await _0xd2ba14["load"]());
      if (_0x574833 && _0x574833["multiData"] && _0x574833["multiData"]["canvases"] && _0x574833['multiData']['canvases']["length"] > 0x0) {
        _0x242cf9["updateViewport"](0x0, 0x0, 0x1);
        _0x3292e4(_0x574833);
        window["currentProjectId"] = _0x574833["projectId"] || "default_v2_project";
        window["_v2WorkspaceProjectScoped"] = Number(_0x574833['workspaceScopeVersion']) === 0x1;
        const _0x5958a1 = document["getElementById"]('projectNameText');
        _0x5958a1 && (_0x5958a1["textContent"] = _0x574833["projectName"] || getUntitledProjectName());
        const _0x184812 = _0x59c6b3['resolveCanvasData'](mergeDreaminaResumeBackupIntoMultiData(_0x574833["multiData"], _0x3a6e9c, _0x574833["projectId"] || window["currentProjectId"]));
        _0x38cca6("buildHydrationSafeMultiData:start");
        const _0x2a0a53 = _0x576908(_0x184812);
        _0x38cca6("buildHydrationSafeMultiData:end");
        _0x49cc78("buildHydrationSafeMultiData", "buildHydrationSafeMultiData:start", 'buildHydrationSafeMultiData:end');
        _0x38cca6("CanvasTabManager.init:start");
        _0x1b3935['init'](_0x2a0a53, {
          'markClean': ![]
        });
        _0x38cca6('CanvasTabManager.init:end');
        _0x49cc78("CanvasTabManager.init", 'CanvasTabManager.init:start', 'CanvasTabManager.init:end');
        _0x2e24c2({
          'projectId': window["currentProjectId"],
          'projectName': _0x574833["projectName"] || getUntitledProjectName(),
          'multiData': _0x184812
        });
        _0x271919();
        _0x4a29ad({
          'writeRecovery': _0x574833["recovery"] === !![],
          'reason': "startup"
        });
        _0x355f4f();
        rendererStartupState["complete"]('project');
        if (!(await rendererStartupState['settled'])["ready"]) {
          return;
        }
        _0x4afef8?.["setAttribute"]?.("data-app-ready", 'true');
        await _0x20b898;
        await _0x42fd5d({
          'wrapEl': _0x103aa2,
          'canvasEl': _0x1e8197,
          'animate': ![],
          'afterHidden': () => {
            _0x5a580c(window['currentProjectId']);
            _0x14b97a(window["currentProjectId"]);
          }
        });
        return;
      }
      _0x1e8197 && (_0x1e8197['style']['transition'] = "none", void _0x1e8197["offsetHeight"]);
      _0x242cf9['updateViewport'](0x0, 0x0, 0x1);
      window["showGlobalLoading"] && window["showGlobalLoading"](t('projectLifecycle.loadingWorkspaceFiles'));
      const _0x46f368 = window["currentProjectId"] || "default_v2_project";
      window["currentProjectId"] = _0x46f368;
      window["_v2WorkspaceProjectScoped"] = !![];
      _0x38cca6('project.loadProject:start');
      const _0x2a0f6e = await _0x59c6b3["loadProject"](_0x46f368, {
        'allowMissing': _0x46f368 === "default_v2_project"
      });
      const _0x32e0aa = mergeDreaminaResumeBackupIntoMultiData(_0x2a0f6e, _0x3a6e9c, _0x46f368);
      _0x38cca6("project.loadProject:end");
      _0x49cc78("project.loadProject", 'project.loadProject:start', "project.loadProject:end");
      _0x38cca6("buildHydrationSafeMultiData:start");
      const _0x5aeb9c = _0x576908(_0x32e0aa);
      _0x38cca6("buildHydrationSafeMultiData:end");
      _0x49cc78("buildHydrationSafeMultiData", "buildHydrationSafeMultiData:start", "buildHydrationSafeMultiData:end");
      _0x38cca6('CanvasTabManager.init:start');
      _0x1b3935["init"](_0x5aeb9c);
      _0x38cca6("CanvasTabManager.init:end");
      _0x49cc78("CanvasTabManager.init", "CanvasTabManager.init:start", "CanvasTabManager.init:end");
      _0x2e24c2({
        'projectId': _0x46f368,
        'projectName': document['getElementById']('projectNameText')?.['textContent'] || getDefaultCanvasName(),
        'multiData': _0x32e0aa
      });
      _0xbf38ba();
      _0x271919();
      _0x4a29ad({
        'writeRecovery': ![],
        'reason': "startup"
      });
      const _0x4ba48b = document["getElementById"]('projectNameText');
      _0x4ba48b && (_0x4ba48b["textContent"] = getDefaultCanvasName());
      const _0x58fc2b = _0x1b3935['getActiveCanvasId']?.() || _0x1b3935["_activeId"];
      _0x58fc2b && _0x1b3935["setCanvasProjectContext"]?.(_0x58fc2b, {
        ...(_0x1b3935["getCanvasProjectContext"]?.(_0x58fc2b) || {}),
        'projectId': _0x46f368,
        'filename': window["_v2CurrentFile"] || '',
        'projectName': getDefaultCanvasName(),
        'isTemporary': ![],
        'workspaceProjectScoped': !![]
      }, {
        'persist': ![]
      });
      rendererStartupState["complete"]("project");
      if (!(await rendererStartupState["settled"])["ready"]) {
        return;
      }
      _0x4afef8?.["setAttribute"]?.('data-app-ready', "true");
      await _0x20b898;
      await _0x42fd5d({
        'wrapEl': _0x103aa2,
        'canvasEl': _0x1e8197,
        'animate': !![],
        'afterHidden': () => {
          _0x5a580c(_0x46f368);
          _0x14b97a(_0x46f368);
        }
      });
    } catch (_0x5bb645) {
      console["error"]("Failed to init app:", _0x5bb645);
      const _0x43bcc6 = t("projectLifecycle.projectPersistenceLoadFailed");
      _0x59c6b3['setProjectPersistenceBlocked']?.(_0x43bcc6);
      window['_isAppLoaded'] = ![];
      rendererStartupState["fail"]("project-hydration");
    }
  }
  function _0x1b4e16(_0x47e688) {
    const _0xc430 = _0x47e688?.['dataTransfer']?.["types"];
    return !!_0xc430 && Array["from"](_0xc430)["includes"]("Files");
  }
  function _0x3cebed(_0x44f276) {
    if (!_0x1b4e16(_0x44f276)) {
      return ![];
    }
    _0x44f276["preventDefault"]();
    if (_0x44f276["dataTransfer"]) {
      _0x44f276["dataTransfer"]["dropEffect"] = "copy";
    }
    return !![];
  }
  function _0x3c5b0d(_0x53d53a) {
    _0x3cebed(_0x53d53a);
  }
  function _0x25d3e7(_0x30b344) {
    if (_0x3cebed(_0x30b344)) {
      return;
    }
    _0x30b344["preventDefault"]();
  }
  function _0x2bc54a(_0x5a5a83) {
    _0x5a5a83['preventDefault']();
    const _0x177379 = _0x5a5a83["dataTransfer"]["files"][0x0];
    if (!_0x177379) {
      return;
    }
    if (/\.aicpkg$/i["test"](_0x177379["name"] || '')) {
      const _0x3124b8 = window['_v2ImportProjectPackageByPath'];
      if (typeof _0x3124b8 !== "function") {
        window["showToast"]?.(t('projectLifecycle.packageUnsupported'), "error");
        return;
      }
      let _0x4e6456 = '';
      try {
        _0x4e6456 = String(desktopBridge["assetImport"]['getPathForFile'](_0x177379) || '')["trim"]();
      } catch {
        _0x4e6456 = '';
      }
      if (!_0x4e6456) {
        const _0x1b773c = window["_v2ImportProjectPackageFile"];
        if (typeof _0x1b773c === "function") {
          void _0x1b773c(_0x177379);
          return;
        }
        window["showToast"]?.(t("projectLifecycle.packagePathMissing"), "error");
        return;
      }
      void _0x3124b8(_0x4e6456);
      return;
    }
    if (!isCanvasProjectFileName(_0x177379["name"])) {
      return;
    }
    const _0x16355e = new FileReader();
    _0x16355e["onload"] = async _0x69e95e => {
      try {
        const _0x591998 = JSON['parse'](_0x69e95e['target']["result"]);
        const _0x5e0a81 = _0x59c6b3['resolveCanvasData'](_0x591998);
        const _0x55d9bb = _0x576908(_0x5e0a81);
        const _0x347735 = _0x55d9bb["canvases"]['find'](_0x234919 => _0x234919['id'] === _0x55d9bb["activeCanvasId"]) || _0x55d9bb["canvases"][0x0];
        if (!_0x347735) {
          throw new Error('Project\x20file\x20has\x20no\x20canvas');
        }
        const _0x450a97 = stripCanvasProjectFileExtension(_0x177379["name"]) || _0x347735['name'];
        const _0x501708 = _0x1b3935['findCanvasIdByProjectIdentity']?.({
          'projectId': _0x450a97,
          'filename': _0x177379["name"]
        }) || '';
        if (_0x501708) {
          await _0x1b3935["switchTo"]?.(_0x501708);
          return;
        }
        const _0x4a362b = buildUniqueCanvasName(_0x450a97, _0x1b3935["_canvases"], {
          'fallbackName': getUntitledCanvasName()
        });
        if ((await _0x1b3935["addCanvas"]()) === ![]) {
          return;
        }
        _0x1b3935['renameCanvas'](_0x1b3935["_activeId"], _0x4a362b);
        const _0x59a467 = {
          ..._0x347735,
          'name': _0x4a362b
        };
        _0x262406(_0x59a467);
        _0x1b3935["hydrateActiveCanvasSnapshot"](_0x59a467);
        _0x1b3935["setCanvasProjectContext"]?.(_0x1b3935["_activeId"], {
          'projectId': _0x450a97,
          'filename': _0x177379["name"],
          'projectName': _0x4a362b,
          'isTemporary': ![],
          'workspaceProjectScoped': !![]
        });
        _0x1b3935["markCanvasClean"](_0x1b3935["_activeId"]);
        _0x355f4f();
        _0x271919();
        _0x1b3935["renderTabs"]();
        _0x2e24c2({
          'projectId': _0x450a97,
          'projectName': _0x4a362b,
          'multiData': _0x5e0a81
        });
        _0x14b97a(_0x450a97);
        window["showToast"]?.(t("projectLifecycle.localArchiveLoaded", {
          'name': _0x4a362b
        }));
      } catch (_0x474025) {
        console['error']('[Drop]\x20读取本地\x20JSON\x20失败:', _0x474025);
        window['showToast']?.(t("projectLifecycle.jsonArchiveParseFailed"), 'error');
      }
    };
    _0x16355e["readAsText"](_0x177379);
  }
  function _0x5a53bc(_0x23a600) {
    const _0x49249b = String(_0x23a600 || '')["replace"](/\s+/g, '\x20')["trim"]();
    if (!_0x49249b) {
      return ![];
    }
    const _0x32213d = _0x1b3935["getActiveCanvasId"]?.() || _0x1b3935['_activeId'];
    if (!_0x32213d) {
      return ![];
    }
    _0x1b3935["renameCanvas"]?.(_0x32213d, _0x49249b);
    const _0x1fcd2d = _0x1b3935["getCanvasProjectContext"]?.(_0x32213d);
    _0x1fcd2d && _0x1b3935["setCanvasProjectContext"]?.(_0x32213d, {
      ..._0x1fcd2d,
      'projectName': _0x49249b
    });
    const _0x474901 = document["getElementById"]('projectNameText');
    if (_0x474901) {
      _0x474901["textContent"] = _0x49249b;
    }
    _0x4363a5();
    return _0x49249b;
  }
  function _0x8ebbb0() {
    const _0x1fa16a = document["getElementById"]('projectNameText');
    if (!_0x1fa16a) {
      return;
    }
    const _0x220f6d = () => {
      const _0x59a3a8 = _0x5a53bc(_0x1fa16a['textContent']);
      if (_0x59a3a8) {
        _0x1fa16a["textContent"] = _0x59a3a8;
      }
    };
    _0x1fa16a["addEventListener"]("blur", _0x220f6d);
    _0x1fa16a["addEventListener"]("keydown", _0x2ac1c7 => {
      _0x2ac1c7["key"] === 'Enter' && (_0x2ac1c7["preventDefault"](), _0x1fa16a["blur"]());
    });
  }
  return {
    'V2LocalCache': _0xd2ba14,
    'projectWorkspaceSessions': _0x1b7363,
    'initApp': _0x19a02a,
    'onBeforeUnload': _0x5ab067,
    'onPageHide': _0x190a15,
    'onVisibilityChange': _0x237e0c,
    'onDocumentDragEnter': _0x3c5b0d,
    'onDocumentDragOver': _0x25d3e7,
    'onDocumentDrop': _0x2bc54a,
    'triggerLocalCacheSave': _0x4363a5,
    'flushPendingLocalCacheSaveNow': _0x242087,
    'resumeProjectPersistenceAfterHydration': _0x271919,
    'renameCurrentProject': _0x5a53bc,
    'bindPersistRevisionAutoSave': _0x2ca1a3,
    'bindHeaderProjectNameAutoSave': _0x8ebbb0
  };
}