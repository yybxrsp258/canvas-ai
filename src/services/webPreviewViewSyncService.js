import { normalizeWebPreviewUrl } from '../modules/webPreviewUrl.js';
import { normalizeWebPreviewTabs } from '../modules/webPreviewTabs.js';
import { isViewportPanPreviewActive, VIEWPORT_PAN_PREVIEW_FRAME_EVENT } from '../core/viewportPanPreview.js';
import { readViewportInteractionState } from '../core/viewportInteractionState.js';
import { CONTEXT_MENU_SHORTCUT_IDS } from '../utils/contextMenuShortcutCatalog.js';
import { getShortcutKeys } from '../modules/shortcuts.js';
import { desktopBridge } from './desktopBridge.js';
const SOFT_OCCLUSION_SELECTOR = '.header';
const HARD_OCCLUSION_SELECTOR = '#settingsOverlay,\x20#aboutOverlay,\x20#feedbackGroupOverlay,\x20#v2PickerOverlay,\x20#nodePickerOverlay,\x20.settings-overlay,\x20.save-dialog-overlay.open,\x20.preset-modal-overlay,\x20.custom-confirm-overlay,\x20.v2-asset-sidebar-panel.show,\x20.v2-workflow-sidebar-panel.show,\x20.sidebar-floating\x20#avatarMenu.open,\x20.sidebar-floating\x20.avatar-menu.open,\x20.node-add-menu,\x20.v2-node-picker,\x20.canvas-proj-dropdown,\x20.web-preview-image-picker-overlay';
const FULLSCREEN_OCCLUSION_SELECTOR = ".web-preview-image-picker-overlay, .v2-image-preview-overlay, .v2-material-comparison-overlay, .storyboard-3d-editor-overlay";
const CANVAS_NODE_OCCLUDER_SELECTOR = '.v2-node,\x20.multi-stack-backplate.is-expanded-card,\x20.multi-flyout-panel\x20>\x20*';
const OCCLUSION_OBSERVER_SELECTOR = [SOFT_OCCLUSION_SELECTOR, HARD_OCCLUSION_SELECTOR, '.sidebar-floating,\x20.canvas-controls-floating,\x20.minimap-wrapper,\x20.save-dialog-overlay,\x20.v2-asset-sidebar-panel,\x20.v2-workflow-sidebar-panel,\x20.v2-crop-overlay,\x20.v2-annotate-overlay,\x20.v2-matting-overlay,\x20.v2-expand-overlay', FULLSCREEN_OCCLUSION_SELECTOR]['join'](',\x20');
const BACKGROUND_SYNC_INTERVAL_MS = 0x32;
const FINAL_INTERACTION_SYNC_DELAY_MS = 0x28;
const FREEZE_SETTLE_HOLD_MS = 0x168;
const PENDING_PAN_FREEZE_MS = 0xf0;
const MIN_VISIBLE_INTERSECTION_SIZE = 0x10;
const SOFT_OCCLUSION_HIDE_RATIO = 0.35;
const FREEZE_ACTIVE_BODY_CLASS = "is-web-preview-freeze-active";
const FREEZE_SETTLING_BODY_CLASS = "is-web-preview-freeze-settling";
const WEB_PREVIEW_FREEZE_BODY_CLASSES = new Set([FREEZE_ACTIVE_BODY_CLASS, FREEZE_SETTLING_BODY_CLASS]);
const DOM_OCCLUSION_SAMPLE_RATIOS = [0.02, 0.1, 0.5, 0.9, 0.98];
const registeredSlotsByNodeId = new Map();
const WEB_PREVIEW_CONTEXT_MENU_SHORTCUT_IDS = CONTEXT_MENU_SHORTCUT_IDS["filter"](_0x44abf6 => _0x44abf6["startsWith"]('context-web-'));
export function collectWebPreviewContextMenuShortcuts() {
  return Object["fromEntries"](WEB_PREVIEW_CONTEXT_MENU_SHORTCUT_IDS["map"](_0x162fa1 => [_0x162fa1, getShortcutKeys(_0x162fa1)]));
}
function normalizeNodeId(_0x473623) {
  return String(_0x473623 || '')["trim"]();
}
function getViewKey(_0x5e932a = {}) {
  return normalizeNodeId(_0x5e932a['nodeId']) + '\x0a' + String(_0x5e932a["tabId"] || '')["trim"]();
}
function getNowMs() {
  const _0x376a4f = globalThis["performance"]?.["now"]?.();
  return Number['isFinite'](_0x376a4f) ? _0x376a4f : Date["now"]();
}
function readCanvasSpaceHeld() {
  return globalThis['window']?.['_spaceHeld'] === !![];
}
function getRequestAnimationFrame() {
  return globalThis['window']?.["requestAnimationFrame"]?.["bind"](globalThis["window"]) || (_0x3be2d7 => setTimeout(_0x3be2d7, 0x10));
}
function getCancelAnimationFrame() {
  return globalThis["window"]?.["cancelAnimationFrame"]?.["bind"](globalThis["window"]) || clearTimeout;
}
function rectIntersects(_0xa7873f, _0x21afbc) {
  return _0xa7873f["left"] < _0x21afbc["right"] && _0xa7873f['right'] > _0x21afbc["left"] && _0xa7873f["top"] < _0x21afbc["bottom"] && _0xa7873f["bottom"] > _0x21afbc["top"];
}
function getRectArea(_0x4b5c1b) {
  return Math["max"](0x0, Number(_0x4b5c1b?.["width"]) || 0x0) * Math['max'](0x0, Number(_0x4b5c1b?.['height']) || 0x0);
}
function getIntersectionArea(_0x20fc7, _0xa40034) {
  if (!rectIntersects(_0x20fc7, _0xa40034)) {
    return 0x0;
  }
  const _0x39f7fb = Math["min"](_0x20fc7["right"], _0xa40034["right"]) - Math["max"](_0x20fc7["left"], _0xa40034["left"]);
  const _0x2f5b40 = Math['min'](_0x20fc7["bottom"], _0xa40034['bottom']) - Math["max"](_0x20fc7["top"], _0xa40034['top']);
  return Math["max"](0x0, _0x39f7fb) * Math["max"](0x0, _0x2f5b40);
}
function parseStackingZIndex(_0x320d02) {
  const _0x3f50ef = String(_0x320d02 ?? '')["trim"]();
  if (!_0x3f50ef || _0x3f50ef === "auto") {
    return 0x0;
  }
  const _0x275dd7 = Number['parseInt'](_0x3f50ef, 0xa);
  return Number["isFinite"](_0x275dd7) ? _0x275dd7 : 0x0;
}
function getElementZIndex(_0x136ea2) {
  const _0x5db90c = globalThis["window"]?.["getComputedStyle"]?.(_0x136ea2);
  if (_0x5db90c?.["display"] === "none" || _0x5db90c?.["visibility"] === 'hidden') {
    return null;
  }
  const _0x5ee983 = Number(_0x5db90c?.['opacity']);
  if (Number["isFinite"](_0x5ee983) && _0x5ee983 <= 0x0) {
    return null;
  }
  return parseStackingZIndex(_0x5db90c?.["zIndex"] || _0x136ea2?.["style"]?.["zIndex"]);
}
function getElementVisibleRect(_0x184915) {
  if (!_0x184915 || _0x184915['hidden'] || _0x184915["isConnected"] === ![]) {
    return null;
  }
  const _0x5666d3 = globalThis["window"]?.["getComputedStyle"]?.(_0x184915);
  if (_0x5666d3?.['display'] === "none" || _0x5666d3?.["visibility"] === "hidden") {
    return null;
  }
  const _0x2535b3 = Number(_0x5666d3?.["opacity"]);
  if (Number["isFinite"](_0x2535b3) && _0x2535b3 <= 0x0) {
    return null;
  }
  const _0x276e10 = _0x184915["getBoundingClientRect"]?.();
  if (!_0x276e10 || (Number(_0x276e10['width']) || 0x0) <= 0x0 || (Number(_0x276e10["height"]) || 0x0) <= 0x0) {
    return null;
  }
  return _0x276e10;
}
function isPotentialNativeViewOccluderElement(_0x242a91) {
  if (!_0x242a91 || _0x242a91["nodeType"] === 0x3 || _0x242a91["hidden"]) {
    return ![];
  }
  const _0x49e2c0 = globalThis['window']?.["getComputedStyle"]?.(_0x242a91);
  if (_0x49e2c0?.['display'] === "none" || _0x49e2c0?.["visibility"] === 'hidden') {
    return ![];
  }
  const _0x3f6321 = Number(_0x49e2c0?.['opacity']);
  if (Number['isFinite'](_0x3f6321) && _0x3f6321 <= 0x0) {
    return ![];
  }
  const _0x2d11fc = String(_0x49e2c0?.["position"] || _0x242a91?.["style"]?.['position'] || '')["trim"]();
  const _0x1ff91f = parseStackingZIndex(_0x49e2c0?.["zIndex"] || _0x242a91?.["style"]?.["zIndex"]);
  if (!['fixed', 'sticky', "absolute"]["includes"](_0x2d11fc) && _0x1ff91f <= 0x0) {
    return ![];
  }
  const _0x3cb11f = _0x242a91["getBoundingClientRect"]?.();
  if (!_0x3cb11f || (Number(_0x3cb11f["width"]) || 0x0) <= 0x0 || (Number(_0x3cb11f["height"]) || 0x0) <= 0x0) {
    return ![];
  }
  return hasVisibleViewportIntersection(_0x3cb11f);
}
function getCanvasOccluderHostElement(_0x707290) {
  try {
    if (_0x707290?.["matches"]?.(".v2-node")) {
      return _0x707290;
    }
  } catch {}
  return _0x707290?.["closest"]?.('.v2-node') || null;
}
function getCanvasOccluderZIndex(_0x124520, _0x181a94) {
  const _0x258abf = getElementZIndex(_0x124520);
  if (_0x258abf === null) {
    return null;
  }
  if (!_0x181a94 || _0x181a94 === _0x124520) {
    return _0x258abf;
  }
  const _0x5be28e = getElementZIndex(_0x181a94);
  if (_0x5be28e === null) {
    return null;
  }
  return Math['max'](_0x258abf, _0x5be28e);
}
function collectCanvasNodeOccluders(_0x47d429 = document) {
  const _0x7757a5 = _0x47d429["querySelectorAll"]?.(CANVAS_NODE_OCCLUDER_SELECTOR) || [];
  const _0xf161ac = [];
  for (const _0x16ef61 of _0x7757a5) {
    const _0x357e7d = getElementVisibleRect(_0x16ef61);
    if (!_0x357e7d) {
      continue;
    }
    const _0x5573e0 = getCanvasOccluderHostElement(_0x16ef61);
    const _0x2eb80a = getCanvasOccluderZIndex(_0x16ef61, _0x5573e0);
    if (_0x2eb80a === null) {
      continue;
    }
    _0xf161ac["push"]({
      'element': _0x16ef61,
      'nodeId': normalizeNodeId(_0x5573e0?.["dataset"]?.['nodeId'] || _0x16ef61?.["dataset"]?.["nodeId"] || _0x16ef61?.['id']),
      'rect': _0x357e7d,
      'zIndex': _0x2eb80a
    });
  }
  return _0xf161ac;
}
function getSlotHostNodeElement(_0x561090) {
  return _0x561090?.["closest"]?.(".v2-node") || null;
}
function isOccludedByHigherCanvasNode(_0x335856, _0x35850, _0xc21349 = []) {
  if (!_0x335856 || !_0x35850 || !_0xc21349["length"]) {
    return ![];
  }
  const _0x458632 = getSlotHostNodeElement(_0x335856);
  const _0x5a9b6c = normalizeNodeId(_0x335856?.['dataset']?.["nodeId"]);
  const _0x1daf71 = getElementZIndex(_0x458632) ?? 0x0;
  for (const _0x382ab9 of _0xc21349) {
    if (!_0x382ab9?.["element"] || _0x382ab9["element"] === _0x458632) {
      continue;
    }
    if (_0x5a9b6c && _0x382ab9["nodeId"] === _0x5a9b6c) {
      continue;
    }
    if (_0x382ab9["zIndex"] <= _0x1daf71) {
      continue;
    }
    if (rectIntersects(_0x35850, _0x382ab9['rect'])) {
      return !![];
    }
  }
  return ![];
}
function getDomOcclusionSamplePoints(_0x5a77fc) {
  const _0x28a382 = globalThis["window"] || {};
  const _0x1c0c6d = Number(_0x28a382["innerWidth"]) || 0x0;
  const _0x571ddd = Number(_0x28a382["innerHeight"]) || 0x0;
  if (_0x1c0c6d <= 0x0 || _0x571ddd <= 0x0) {
    return [];
  }
  const _0x4663a7 = Math["max"](0x0, Number(_0x5a77fc?.["left"]) || 0x0);
  const _0x6481f4 = Math['max'](0x0, Number(_0x5a77fc?.["top"]) || 0x0);
  const _0x33e972 = Math["min"](_0x1c0c6d, Number(_0x5a77fc?.['right']) || 0x0);
  const _0x29d083 = Math["min"](_0x571ddd, Number(_0x5a77fc?.["bottom"]) || 0x0);
  const _0xb9498b = _0x33e972 - _0x4663a7;
  const _0x368400 = _0x29d083 - _0x6481f4;
  if (_0xb9498b < MIN_VISIBLE_INTERSECTION_SIZE || _0x368400 < MIN_VISIBLE_INTERSECTION_SIZE) {
    return [];
  }
  const _0x14014b = [];
  const _0x3312cb = new Set();
  for (const _0x585ba2 of DOM_OCCLUSION_SAMPLE_RATIOS) {
    for (const _0x10085b of DOM_OCCLUSION_SAMPLE_RATIOS) {
      const _0x259ed1 = Math["round"](_0x4663a7 + _0xb9498b * _0x10085b);
      const _0x3ea450 = Math["round"](_0x6481f4 + _0x368400 * _0x585ba2);
      const _0x3a88be = _0x259ed1 + ',' + _0x3ea450;
      if (_0x3312cb["has"](_0x3a88be)) {
        continue;
      }
      _0x3312cb["add"](_0x3a88be);
      _0x14014b["push"]({
        'x': _0x259ed1,
        'y': _0x3ea450
      });
    }
  }
  return _0x14014b;
}
function getElementsFromPoint(_0x24c4df, _0x1b8c4d, _0x3e734f) {
  const _0x346840 = _0x24c4df?.['elementsFromPoint'] ? _0x24c4df : globalThis['document'];
  const _0x3eceac = _0x346840?.["elementsFromPoint"];
  if (typeof _0x3eceac !== "function") {
    return [];
  }
  try {
    return Array['from'](_0x3eceac["call"](_0x346840, _0x1b8c4d, _0x3e734f) || []);
  } catch {
    return [];
  }
}
function isDocumentRootHitElement(_0x12182c) {
  const _0x27e70f = String(_0x12182c?.["tagName"] || '')["toLowerCase"]();
  return _0x27e70f === "html" || _0x27e70f === "body";
}
function isRenderableHitElement(_0x421c3c) {
  if (!_0x421c3c || _0x421c3c["nodeType"] && _0x421c3c['nodeType'] !== 0x1) {
    return ![];
  }
  if (isDocumentRootHitElement(_0x421c3c) || _0x421c3c["hidden"]) {
    return ![];
  }
  const _0x50a008 = globalThis["window"]?.["getComputedStyle"]?.(_0x421c3c);
  if (_0x50a008?.["display"] === "none" || _0x50a008?.["visibility"] === 'hidden') {
    return ![];
  }
  const _0xc5a199 = Number(_0x50a008?.["opacity"]);
  return !(Number["isFinite"](_0xc5a199) && _0xc5a199 <= 0x0);
}
function elementOwnsHit(_0x1027cb, _0x172dd2) {
  return Boolean(_0x1027cb && (_0x1027cb === _0x172dd2 || _0x1027cb['contains']?.(_0x172dd2)));
}
function isOwnedByWebPreviewSlot(_0xa81192, _0x872892) {
  if (!_0xa81192 || !_0x872892) {
    return ![];
  }
  const _0x4c1964 = getSlotHostNodeElement(_0x872892);
  return elementOwnsHit(_0x872892, _0xa81192) || elementOwnsHit(_0x4c1964, _0xa81192);
}
function getTopRenderableHitElement(_0x5d9e44 = []) {
  for (const _0x15e84f of _0x5d9e44) {
    if (isRenderableHitElement(_0x15e84f)) {
      return _0x15e84f;
    }
  }
  return null;
}
function isOccludedByRendererStack(_0x3a1be8, _0x10499e, _0x4de0a4 = document) {
  if (!_0x3a1be8 || !_0x10499e) {
    return ![];
  }
  const _0x565e1b = getDomOcclusionSamplePoints(_0x10499e);
  if (!_0x565e1b['length']) {
    return ![];
  }
  for (const _0x33cef9 of _0x565e1b) {
    const _0x127ccb = getTopRenderableHitElement(getElementsFromPoint(_0x4de0a4, _0x33cef9['x'], _0x33cef9['y']));
    if (!_0x127ccb) {
      continue;
    }
    if (!isOwnedByWebPreviewSlot(_0x127ccb, _0x3a1be8)) {
      return !![];
    }
  }
  return ![];
}
function hasVisibleViewportIntersection(_0xfe90db) {
  const _0x545057 = Number(_0xfe90db?.["width"]) || 0x0;
  const _0xc4c28f = Number(_0xfe90db?.["height"]) || 0x0;
  if (_0x545057 < 0x10 || _0xc4c28f < 0x10) {
    return ![];
  }
  const _0x302d0c = globalThis["window"] || {};
  const _0x283bc3 = Number(_0x302d0c["innerWidth"]) || 0x0;
  const _0x147556 = Number(_0x302d0c["innerHeight"]) || 0x0;
  if (_0x283bc3 <= 0x0 || _0x147556 <= 0x0) {
    return ![];
  }
  const _0x5add6c = Math["min"](_0xfe90db["right"], _0x283bc3) - Math["max"](_0xfe90db["left"], 0x0);
  const _0x589451 = Math["min"](_0xfe90db["bottom"], _0x147556) - Math["max"](_0xfe90db["top"], 0x0);
  return _0x5add6c >= MIN_VISIBLE_INTERSECTION_SIZE && _0x589451 >= MIN_VISIBLE_INTERSECTION_SIZE;
}
function collectOcclusionRects(_0xb596 = document, _0x76843 = SOFT_OCCLUSION_SELECTOR) {
  const _0xf80db2 = _0xb596['querySelectorAll']?.(_0x76843) || [];
  const _0x4ba8f8 = [];
  for (const _0x1b74d5 of _0xf80db2) {
    if (!_0x1b74d5 || _0x1b74d5['hidden']) {
      continue;
    }
    const _0x5c0fc4 = globalThis['window']?.["getComputedStyle"]?.(_0x1b74d5);
    if (_0x5c0fc4?.['display'] === "none" || _0x5c0fc4?.["visibility"] === 'hidden') {
      continue;
    }
    const _0xfbcff4 = Number(_0x5c0fc4?.["opacity"]);
    if (Number["isFinite"](_0xfbcff4) && _0xfbcff4 <= 0x0) {
      continue;
    }
    if (_0x5c0fc4?.['pointerEvents'] === "none") {
      continue;
    }
    const _0x368336 = _0x1b74d5["getBoundingClientRect"]?.();
    if (_0x368336) {
      _0x4ba8f8["push"](_0x368336);
    }
  }
  return _0x4ba8f8;
}
function isOccludedByRects(_0x10c11d, _0x269f52 = []) {
  return _0x269f52["some"](_0x5a71c8 => rectIntersects(_0x10c11d, _0x5a71c8));
}
function isSignificantlyOccludedByRects(_0x5ae4ef, _0x4a54bc = []) {
  const _0x394426 = getRectArea(_0x5ae4ef);
  if (_0x394426 <= 0x0) {
    return ![];
  }
  let _0x1357d2 = 0x0;
  for (const _0x470134 of _0x4a54bc) {
    _0x1357d2 += getIntersectionArea(_0x5ae4ef, _0x470134);
    if (_0x1357d2 / _0x394426 >= SOFT_OCCLUSION_HIDE_RATIO) {
      return !![];
    }
  }
  return ![];
}
function nodeMatchesOcclusionSelector(_0x13b281, {
  includeDescendants = !![]
} = {}) {
  if (!_0x13b281 || _0x13b281["nodeType"] === 0x3) {
    return ![];
  }
  try {
    if (typeof _0x13b281['matches'] === 'function' && _0x13b281['matches'](OCCLUSION_OBSERVER_SELECTOR)) {
      return !![];
    }
    if (isPotentialNativeViewOccluderElement(_0x13b281)) {
      return !![];
    }
    return includeDescendants ? Boolean(_0x13b281['querySelector']?.(OCCLUSION_OBSERVER_SELECTOR)) : ![];
  } catch {
    return ![];
  }
}
function isCanvasPanSurfaceTarget(_0x2cf6ab) {
  if (!_0x2cf6ab) {
    return ![];
  }
  const _0x27e083 = globalThis["document"]?.['getElementById']?.('v2-wrap');
  if (_0x27e083?.['contains']?.(_0x2cf6ab)) {
    return !![];
  }
  return Boolean(_0x2cf6ab['closest']?.(".side-plus-btn"));
}
function isPotentialCanvasPanStartEvent(_0x4d00c2) {
  if (!isCanvasPanSurfaceTarget(_0x4d00c2?.["target"])) {
    return ![];
  }
  const _0x1dd7dc = Number(_0x4d00c2?.["button"]);
  if (_0x1dd7dc === 0x1) {
    return !![];
  }
  return _0x1dd7dc === 0x0 && globalThis["window"]?.["_spaceHeld"] === !![];
}
function isNativePanStartPreviewEvent(_0x16884e) {
  return _0x16884e?.["type"] === "pan-start-preview";
}
function normalizeObservedClassName(_0x60e010 = '') {
  return String(_0x60e010 || '')["split"](/\s+/)["map"](_0x1f9050 => _0x1f9050["trim"]())["filter"](_0x4929b9 => _0x4929b9 && !WEB_PREVIEW_FREEZE_BODY_CLASSES["has"](_0x4929b9))["sort"]()["join"]('\x20');
}
function isOwnFreezeClassMutation(_0x5d6558) {
  if (_0x5d6558?.["type"] !== 'attributes' || _0x5d6558?.["attributeName"] !== 'class') {
    return ![];
  }
  if (_0x5d6558['target'] !== globalThis["document"]?.["body"]) {
    return ![];
  }
  return normalizeObservedClassName(_0x5d6558["oldValue"]) === normalizeObservedClassName(_0x5d6558["target"]?.["className"]);
}
function shouldSyncForOcclusionMutation(_0x5eb0ff = []) {
  for (const _0xe4856d of _0x5eb0ff) {
    if (isOwnFreezeClassMutation(_0xe4856d)) {
      continue;
    }
    if (_0xe4856d?.["type"] === 'attributes' && nodeMatchesOcclusionSelector(_0xe4856d?.['target'], {
      'includeDescendants': ![]
    })) {
      return !![];
    }
    if (_0xe4856d?.["type"] === "childList" && nodeMatchesOcclusionSelector(_0xe4856d?.["target"], {
      'includeDescendants': ![]
    })) {
      return !![];
    }
    for (const _0x12e270 of _0xe4856d?.["addedNodes"] || []) {
      if (nodeMatchesOcclusionSelector(_0x12e270)) {
        return !![];
      }
    }
    for (const _0x4d4e7c of _0xe4856d?.["removedNodes"] || []) {
      if (nodeMatchesOcclusionSelector(_0x4d4e7c)) {
        return !![];
      }
    }
  }
  return ![];
}
function appendSlotToIndex(_0x1ebb35, _0xd68bb7) {
  const _0x3273e9 = _0xd68bb7?.['dataset']?.["nodeId"];
  if (!_0x3273e9) {
    return;
  }
  const _0x325cb9 = _0x1ebb35["get"](_0x3273e9);
  if (_0xd68bb7['dataset']['webPreviewFullscreen'] === "true") {
    _0x1ebb35["set"](_0x3273e9, _0xd68bb7);
    return;
  }
  if (!_0x325cb9) {
    _0x1ebb35["set"](_0x3273e9, _0xd68bb7);
  }
}
function buildSlotIndex(_0x2ca83a = document, _0x4f2391 = []) {
  const _0x34bae8 = new Map();
  const _0x200356 = new Set();
  for (const _0x6b8609 of registeredSlotsByNodeId["values"]()) {
    for (const _0x71c8af of _0x6b8609) {
      if (!_0x71c8af || _0x71c8af['isConnected'] === ![] || _0x200356["has"](_0x71c8af)) {
        continue;
      }
      _0x200356['add'](_0x71c8af);
      appendSlotToIndex(_0x34bae8, _0x71c8af);
    }
  }
  if (_0x4f2391["length"] > 0x0 && _0x4f2391['every'](_0x4841b0 => _0x34bae8["has"](_0x4841b0))) {
    return _0x34bae8;
  }
  const _0x4847ba = _0x2ca83a["querySelectorAll"]?.("[data-web-preview-slot='true']") || [];
  for (const _0x37aa7b of _0x4847ba) {
    if (!_0x37aa7b || _0x200356["has"](_0x37aa7b)) {
      continue;
    }
    _0x200356["add"](_0x37aa7b);
    appendSlotToIndex(_0x34bae8, _0x37aa7b);
  }
  return _0x34bae8;
}
export function registerWebPreviewSlot(_0x2fe157, _0x8f11b3) {
  const _0xbc8eb2 = normalizeNodeId(_0x2fe157);
  if (!_0xbc8eb2 || !_0x8f11b3) {
    return () => {};
  }
  let _0x239e9c = registeredSlotsByNodeId["get"](_0xbc8eb2);
  !_0x239e9c && (_0x239e9c = new Set(), registeredSlotsByNodeId['set'](_0xbc8eb2, _0x239e9c));
  _0x239e9c['add'](_0x8f11b3);
  return () => {
    const _0x57bebe = registeredSlotsByNodeId["get"](_0xbc8eb2);
    if (!_0x57bebe) {
      return;
    }
    _0x57bebe['delete'](_0x8f11b3);
    if (_0x57bebe["size"] === 0x0) {
      registeredSlotsByNodeId["delete"](_0xbc8eb2);
    }
  };
}
export function _clearWebPreviewSlotRegistryForTest() {
  registeredSlotsByNodeId['clear']();
}
function readGraphStoreState(_0x649de2) {
  return typeof _0x649de2?.['getStateRaw'] === 'function' ? _0x649de2['getStateRaw']() : _0x649de2?.["getState"]?.() || {};
}
function hasActiveWebPreviewNodes(_0x5a608f = {}) {
  return Object["values"](_0x5a608f["nodes"] || {})['some'](_0x2bb3f4 => _0x2bb3f4?.["type"] === "web-preview" && normalizeWebPreviewTabs(_0x2bb3f4)["tabs"]['some'](_0x4f4b73 => normalizeWebPreviewUrl(_0x4f4b73["url"]) || _0x4f4b73["pendingPopup"] === !![]));
}
export function createWebPreviewNodeActivityTracker(_0x283507) {
  const _0x463462 = readGraphStoreState(_0x283507);
  let _0x180a84 = Number(_0x463462?.['_persistRev']);
  let _0x553063 = Number["isFinite"](_0x180a84);
  let _0xe7a9a9 = hasActiveWebPreviewNodes(_0x463462);
  return {
    get 'hasActiveNodes'() {
      return _0xe7a9a9;
    },
    'refresh'(_0x67bfb3) {
      const _0x427f0a = _0x67bfb3 || readGraphStoreState(_0x283507);
      const _0x5b436f = Number(_0x427f0a?.['_persistRev']);
      const _0x241512 = Number["isFinite"](_0x5b436f);
      (!_0x241512 || !_0x553063 || _0x5b436f !== _0x180a84) && (_0xe7a9a9 = hasActiveWebPreviewNodes(_0x427f0a), _0x180a84 = _0x5b436f, _0x553063 = _0x241512);
      return _0xe7a9a9;
    }
  };
}
function normalizeCanvasZoom(_0x497a54) {
  const _0x573e1f = Number(_0x497a54);
  if (!Number["isFinite"](_0x573e1f) || _0x573e1f <= 0x0) {
    return 0x1;
  }
  return Math["min"](0x5, Math["max"](0.25, _0x573e1f));
}
function isPendingPanFreezeActive(_0xe49d74) {
  return Number(_0xe49d74?.['pendingPanFreezeUntil'] || 0x0) > getNowMs();
}
function clearPendingPanFreeze(_0xc71dce) {
  if (!_0xc71dce) {
    return;
  }
  _0xc71dce['pendingPanFreezeTimer'] && (clearTimeout(_0xc71dce["pendingPanFreezeTimer"]), _0xc71dce["pendingPanFreezeTimer"] = null);
  _0xc71dce['pendingPanFreezeUntil'] = 0x0;
}
function startPendingPanFreeze(_0x1e5645) {
  if (!_0x1e5645) {
    return;
  }
  clearPendingPanFreeze(_0x1e5645);
  _0x1e5645["pendingPanFreezeUntil"] = getNowMs() + PENDING_PAN_FREEZE_MS;
  _0x1e5645["pendingPanFreezeTimer"] = setTimeout(() => {
    _0x1e5645['pendingPanFreezeTimer'] = null;
    _0x1e5645["pendingPanFreezeUntil"] = 0x0;
    _0x1e5645["scheduleFinalSync"]();
  }, PENDING_PAN_FREEZE_MS);
}
function getCanvasInteractionState(_0x2b872f) {
  const _0x50fdb2 = readViewportInteractionState({
    'panPreviewActive': isViewportPanPreviewActive(),
    'pendingPanFreezeActive': isPendingPanFreezeActive(_0x2b872f)
  });
  const _0x1105bb = _0x50fdb2["isViewportBusy"];
  return {
    'frozen': _0x1105bb,
    'deferZoomFactor': _0x50fdb2["isViewportAnimating"] || _0x50fdb2['isZooming'],
    'settleSnapshot': _0x50fdb2["isViewportAnimating"],
    'showSnapshot': _0x1105bb
  };
}
function getSlotFullscreen(_0x46a333) {
  return _0x46a333?.['dataset']?.['webPreviewFullscreen'] === "true";
}
function getSlotSnapshotComponent(_0x22bbb2) {
  return _0x22bbb2?.["closest"]?.(".web-preview-component") || null;
}
function getSlotSnapshotReady(_0x806017, _0x33e9b7 = '', {
  allowAnyToken = ![]
} = {}) {
  const _0x4e93fe = getSlotSnapshotComponent(_0x806017);
  if (!_0x4e93fe?.["classList"]?.["contains"]?.("has-freeze-snapshot")) {
    return ![];
  }
  if (allowAnyToken) {
    return !![];
  }
  const _0x31ba0f = String(_0x33e9b7 || '')['trim']();
  if (!_0x31ba0f) {
    return !![];
  }
  return getSlotSnapshotToken(_0x806017) === _0x31ba0f;
}
function getSlotSnapshotToken(_0x36b018) {
  const _0x1e104e = getSlotSnapshotComponent(_0x36b018);
  if (!_0x1e104e?.['classList']?.["contains"]?.('has-freeze-snapshot')) {
    return '';
  }
  return String(_0x1e104e?.['dataset']?.["webPreviewSnapshotToken"] || '')["trim"]();
}
function readPositiveNumber(_0x25c76) {
  const _0x5a1c93 = Number(_0x25c76);
  return Number["isFinite"](_0x5a1c93) && _0x5a1c93 > 0x0 ? _0x5a1c93 : 0x0;
}
function getSlotSnapshotMetrics(_0x2e8670) {
  const _0x116be7 = getSlotSnapshotComponent(_0x2e8670);
  if (!_0x116be7?.['classList']?.["contains"]?.("has-freeze-snapshot")) {
    return null;
  }
  const _0x59ae28 = _0x116be7?.["dataset"] || {};
  const _0x2fefce = readPositiveNumber(_0x59ae28['webPreviewSnapshotWidth']);
  const _0x4f1ab4 = readPositiveNumber(_0x59ae28["webPreviewSnapshotHeight"]);
  const _0x5aec8e = readPositiveNumber(_0x59ae28['webPreviewSnapshotZoomFactor']);
  if (!_0x2fefce || !_0x4f1ab4 || !_0x5aec8e) {
    return null;
  }
  return {
    'width': _0x2fefce,
    'height': _0x4f1ab4,
    'zoomFactor': _0x5aec8e
  };
}
function readySnapshotMatchesBounds(_0x5125c8, _0x4ddd2c, _0x387966) {
  if (!_0x4ddd2c) {
    return ![];
  }
  if (getSlotSnapshotToken(_0x5125c8) !== "ready") {
    return ![];
  }
  const _0x506453 = getSlotSnapshotMetrics(_0x5125c8);
  if (!_0x506453) {
    return ![];
  }
  const _0x1f5303 = Math["round"](_0x506453["width"]) === Math["round"](_0x4ddd2c["width"]);
  const _0x7f8802 = Math["round"](_0x506453['height']) === Math["round"](_0x4ddd2c["height"]);
  const _0x29fadb = readPositiveNumber(_0x387966) || 0x1;
  const _0x377062 = Math['abs'](_0x506453['zoomFactor'] - _0x29fadb) < 0.001;
  return _0x1f5303 && _0x7f8802 && _0x377062;
}
function getSlotSnapshotHold(_0x30f58d) {
  return Boolean(getSlotSnapshotComponent(_0x30f58d)?.["classList"]?.["contains"]?.("is-web-preview-loading"));
}
function buildViewPayload({
  node: _0x3b6cbf,
  tabId: _0x23cf80,
  webUrl: _0x539076,
  slot: _0x153ffd,
  active: _0x484cdc,
  selected: _0x3393fe,
  canvasZoom: _0xc496a3,
  interactionState: _0x3a4a3b,
  freezeToken: _0x313cb0,
  fullscreenBlockerRects: _0xda3328,
  softBlockerRects: _0x19d7f7,
  hardBlockerRects: _0x3f99ff,
  canvasNodeOccluders = [],
  root = document,
  canvasSpaceHeld = ![],
  pendingPopup = ![]
}) {
  let _0x462ae2 = ![];
  let _0x36f875 = null;
  let _0x1d6635 = null;
  let _0x4102d7 = ![];
  let _0x2e4deb = ![];
  let _0x19c3e4 = ![];
  let _0x24a6d9 = ![];
  let _0x3297fd = ![];
  const _0x30aaaf = getSlotFullscreen(_0x153ffd);
  if (_0x153ffd?.['isConnected'] !== ![]) {
    const _0x4b8a99 = _0x153ffd?.["getBoundingClientRect"]?.();
    _0x1d6635 = _0x4b8a99 || null;
    const _0x4451f5 = _0x4b8a99 ? {
      'width': Math["round"](_0x4b8a99["width"]),
      'height': Math["round"](_0x4b8a99["height"])
    } : null;
    const _0x2573b7 = Boolean(_0x30aaaf || _0x3393fe);
    _0x3297fd = Boolean(_0x4b8a99 && !_0x30aaaf && !_0x2573b7 && readySnapshotMatchesBounds(_0x153ffd, _0x4451f5, _0xc496a3));
    const _0x19bbab = _0x4b8a99 ? isOccludedByRects(_0x4b8a99, _0xda3328) : ![];
    _0x4102d7 = _0x4b8a99 && !_0x30aaaf ? isOccludedByRects(_0x4b8a99, _0x3f99ff) : ![];
    _0x2e4deb = _0x4b8a99 && !_0x30aaaf ? isSignificantlyOccludedByRects(_0x4b8a99, _0x19d7f7) : ![];
    _0x19c3e4 = Boolean(_0x4b8a99 && !_0x30aaaf && isOccludedByHigherCanvasNode(_0x153ffd, _0x4b8a99, canvasNodeOccluders));
    _0x24a6d9 = Boolean(_0x4b8a99 && !_0x30aaaf && isOccludedByRendererStack(_0x153ffd, _0x4b8a99, root));
    _0x4b8a99 && hasVisibleViewportIntersection(_0x4b8a99) && !_0x19bbab && !_0x4102d7 && !_0x2e4deb && !_0x19c3e4 && !_0x24a6d9 && !_0x3297fd && (_0x462ae2 = !![], _0x36f875 = {
      'x': Math["round"](_0x4b8a99["left"]),
      'y': Math["round"](_0x4b8a99["top"]),
      'width': Math["round"](_0x4b8a99["width"]),
      'height': Math["round"](_0x4b8a99['height'])
    });
  }
  const _0x1adf06 = getSlotSnapshotHold(_0x153ffd);
  const _0x296d92 = Boolean((_0x4102d7 || _0x2e4deb || _0x19c3e4 || _0x24a6d9) && !_0x30aaaf);
  const _0x51f19b = Boolean(_0x296d92 || _0x3297fd);
  const _0x26f81c = Boolean((_0x3a4a3b["frozen"] || _0x1adf06) && !_0x30aaaf && _0x462ae2 || _0x51f19b);
  const _0x5c276c = _0x51f19b && _0x1d6635 && hasVisibleViewportIntersection(_0x1d6635) ? {
    'x': Math['round'](_0x1d6635['left']),
    'y': Math['round'](_0x1d6635["top"]),
    'width': Math['round'](_0x1d6635["width"]),
    'height': Math["round"](_0x1d6635["height"])
  } : null;
  const _0x1b98b1 = Boolean(_0x296d92 && _0x3a4a3b["frozen"]);
  const _0xa8acaa = _0x296d92 && _0x5c276c ? _0x1b98b1 ? String(_0x313cb0 || '0') : ['occlusion', _0x5c276c["width"], _0x5c276c['height'], Number(_0xc496a3 || 0x1)['toFixed'](0x3)]["join"](':') : '';
  const _0x3114f5 = _0x3297fd && !_0x296d92 && _0x5c276c ? ["passive", _0x5c276c["width"], _0x5c276c["height"], Number(_0xc496a3 || 0x1)['toFixed'](0x3)]["join"](':') : '';
  const _0x5bf801 = _0x26f81c ? _0xa8acaa || _0x3114f5 || String(_0x313cb0 || '0') : '';
  const _0x469107 = Boolean(_0x51f19b || _0x26f81c && (_0x3a4a3b["showSnapshot"] || _0x1adf06));
  const _0x4721bb = getSlotSnapshotToken(_0x153ffd);
  const _0xfff9d2 = Boolean(_0x469107 && _0x51f19b && (_0x3297fd || !_0x1b98b1 && readySnapshotMatchesBounds(_0x153ffd, _0x5c276c, _0xc496a3)));
  const _0x15c2ee = Boolean(_0x469107 && (!_0x51f19b || _0x1b98b1 || _0xfff9d2));
  return {
    'nodeId': _0x3b6cbf['id'],
    'tabId': _0x23cf80,
    'webUrl': _0x539076,
    'pendingPopup': pendingPopup,
    'browserProfileId': _0x3b6cbf["browserProfileId"] || '',
    'active': _0x484cdc,
    'visible': _0x462ae2,
    'bounds': _0x36f875,
    'snapshotBounds': _0x5c276c,
    'zoomFactor': _0x30aaaf ? 0x1 : _0xc496a3,
    'deferZoomFactor': _0x30aaaf ? ![] : _0x3a4a3b['deferZoomFactor'],
    'frozen': _0x26f81c,
    'freezeToken': _0x5bf801,
    'snapshotReady': _0x469107 ? getSlotSnapshotReady(_0x153ffd, _0x5bf801, {
      'allowAnyToken': _0x15c2ee
    }) : ![],
    'snapshotToken': _0x4721bb,
    'allowReusableSnapshot': _0x15c2ee,
    'snapshotHold': _0x1adf06,
    'showSnapshot': _0x469107,
    'fullscreen': _0x30aaaf,
    'selected': _0x3393fe,
    'canvasSpaceHeld': canvasSpaceHeld === !![]
  };
}
function syncCachedViewsForBudget(_0x186083, _0x3629d4) {
  if (!_0x3629d4) {
    return _0x186083;
  }
  const _0x3a3a0d = getNowMs();
  const _0x1c81a7 = _0x186083['some'](_0x2ed356 => _0x2ed356?.['frozen'] || _0x2ed356?.["deferZoomFactor"]);
  const _0x35dedc = new Set(_0x186083["map"](getViewKey));
  for (const _0x36028b of [..._0x3629d4["cachedViewsByNodeId"]['keys']()]) {
    if (!_0x35dedc["has"](_0x36028b)) {
      _0x3629d4["cachedViewsByNodeId"]["delete"](_0x36028b);
    }
  }
  if (!_0x1c81a7) {
    _0x3629d4['lastBackgroundSyncAt'] = _0x3a3a0d;
    for (const _0x4a5308 of _0x186083) {
      _0x3629d4["cachedViewsByNodeId"]['set'](getViewKey(_0x4a5308), _0x4a5308);
    }
    return _0x186083;
  }
  const _0x5254c = _0x3a3a0d - _0x3629d4["lastBackgroundSyncAt"] >= BACKGROUND_SYNC_INTERVAL_MS;
  if (_0x5254c) {
    _0x3629d4["lastBackgroundSyncAt"] = _0x3a3a0d;
  }
  return _0x186083["map"](_0x46c3f5 => {
    const _0x198791 = getViewKey(_0x46c3f5);
    const _0x15c1f6 = _0x3629d4["cachedViewsByNodeId"]["get"](_0x198791);
    const _0x22f6b6 = _0x46c3f5['frozen'] === !![] && _0x46c3f5["visible"] === !![] && _0x15c1f6?.["visible"] === !![] && _0x15c1f6?.['bounds'] && _0x15c1f6["webUrl"] === _0x46c3f5["webUrl"] && _0x15c1f6["pendingPopup"] === _0x46c3f5["pendingPopup"] && _0x15c1f6["active"] === _0x46c3f5["active"];
    if (_0x22f6b6) {
      const _0x1ef5e8 = {
        ..._0x15c1f6,
        'selected': _0x46c3f5["selected"],
        'zoomFactor': _0x46c3f5['zoomFactor'],
        'deferZoomFactor': _0x46c3f5["deferZoomFactor"],
        'frozen': !![],
        'freezeToken': _0x46c3f5["freezeToken"],
        'snapshotReady': _0x46c3f5["snapshotReady"],
        'snapshotToken': _0x46c3f5["snapshotToken"],
        'allowReusableSnapshot': _0x46c3f5['allowReusableSnapshot'],
        'snapshotHold': _0x46c3f5["snapshotHold"],
        'showSnapshot': _0x46c3f5["showSnapshot"],
        'syncPriority': _0x15c1f6['frozen'] === !![] ? 'background-throttled' : undefined
      };
      _0x3629d4["cachedViewsByNodeId"]["set"](_0x198791, _0x1ef5e8);
      return _0x1ef5e8;
    }
    const _0x57487f = _0x5254c && _0x46c3f5['frozen'] !== !![];
    const _0x37b0b4 = _0x46c3f5["deferZoomFactor"] === !![] && _0x46c3f5["frozen"] !== !![] && _0x46c3f5["visible"] === !![];
    const _0x432e0b = _0x46c3f5["fullscreen"] || _0x46c3f5['selected'] && !_0x46c3f5["frozen"] || _0x37b0b4 || _0x57487f || !_0x15c1f6 || _0x15c1f6["active"] !== _0x46c3f5["active"] || _0x15c1f6["webUrl"] !== _0x46c3f5["webUrl"] || _0x15c1f6["pendingPopup"] !== _0x46c3f5["pendingPopup"] || _0x15c1f6["visible"] !== _0x46c3f5["visible"] || _0x15c1f6["frozen"] !== _0x46c3f5["frozen"] || _0x15c1f6['freezeToken'] !== _0x46c3f5["freezeToken"] || _0x15c1f6["snapshotReady"] !== _0x46c3f5["snapshotReady"] || _0x15c1f6["snapshotToken"] !== _0x46c3f5["snapshotToken"] || _0x15c1f6["allowReusableSnapshot"] !== _0x46c3f5['allowReusableSnapshot'] || _0x15c1f6["snapshotHold"] !== _0x46c3f5['snapshotHold'];
    if (_0x432e0b) {
      _0x3629d4["cachedViewsByNodeId"]["set"](_0x198791, _0x46c3f5);
      return _0x46c3f5;
    }
    return {
      ..._0x15c1f6,
      'webUrl': _0x46c3f5["webUrl"],
      'pendingPopup': _0x46c3f5['pendingPopup'],
      'active': _0x46c3f5['active'],
      'selected': _0x46c3f5["selected"],
      'zoomFactor': _0x46c3f5["zoomFactor"],
      'deferZoomFactor': _0x46c3f5["deferZoomFactor"],
      'frozen': _0x46c3f5["frozen"],
      'freezeToken': _0x46c3f5['freezeToken'],
      'snapshotReady': _0x46c3f5["snapshotReady"],
      'snapshotToken': _0x46c3f5["snapshotToken"],
      'allowReusableSnapshot': _0x46c3f5["allowReusableSnapshot"],
      'snapshotHold': _0x46c3f5["snapshotHold"],
      'showSnapshot': _0x46c3f5['showSnapshot'],
      'syncPriority': "background-throttled"
    };
  });
}
function buildViewsSignature(_0x48e74c = [], _0x536019 = {}) {
  const _0x26a7fb = _0x48e74c['map'](_0x467b07 => {
    const _0x378cf1 = _0x467b07?.["bounds"] || {};
    return [_0x467b07?.["nodeId"] || '', _0x467b07?.["tabId"] || '', _0x467b07?.["webUrl"] || '', _0x467b07?.["pendingPopup"] === !![] ? 0x1 : 0x0, _0x467b07?.["browserProfileId"] || '', _0x467b07?.['active'] === !![] ? 0x1 : 0x0, _0x467b07?.["visible"] === !![] ? 0x1 : 0x0, Number(_0x378cf1['x'] || 0x0), Number(_0x378cf1['y'] || 0x0), Number(_0x378cf1["width"] || 0x0), Number(_0x378cf1["height"] || 0x0), Number(_0x467b07?.["zoomFactor"] || 0x1)['toFixed'](0x3), _0x467b07?.["deferZoomFactor"] === !![] ? 0x1 : 0x0, _0x467b07?.["frozen"] === !![] ? 0x1 : 0x0, _0x467b07?.["freezeToken"] || '', _0x467b07?.["snapshotReady"] === !![] ? 0x1 : 0x0, _0x467b07?.["snapshotToken"] || '', _0x467b07?.["allowReusableSnapshot"] === !![] ? 0x1 : 0x0, _0x467b07?.["snapshotHold"] === !![] ? 0x1 : 0x0, _0x467b07?.["showSnapshot"] === !![] ? 0x1 : 0x0, _0x467b07?.["fullscreen"] === !![] ? 0x1 : 0x0, _0x467b07?.["selected"] === !![] ? 0x1 : 0x0, _0x467b07?.["canvasSpaceHeld"] === !![] ? 0x1 : 0x0]["join"](':');
  })["join"]('|');
  const _0x1ea908 = Object["entries"](_0x536019)['map'](([_0x3d5aaa, _0xec7a5f]) => _0x3d5aaa + ':' + (_0xec7a5f || [])["join"]('+'))["join"]('|');
  return _0x26a7fb + '#' + _0x1ea908;
}
function clearFinalSyncTimer(_0xd3c2a5) {
  if (!_0xd3c2a5?.['finalSyncTimer']) {
    return;
  }
  clearTimeout(_0xd3c2a5['finalSyncTimer']);
  _0xd3c2a5['finalSyncTimer'] = null;
}
function setBodyClass(_0x2ec810, _0x3216f2) {
  const _0x51e0c5 = globalThis["document"]?.["body"]?.["classList"];
  if (!_0x51e0c5) {
    return;
  }
  const _0x572d50 = Boolean(_0x51e0c5["contains"]?.(_0x2ec810));
  if (_0x3216f2) {
    if (!_0x572d50) {
      _0x51e0c5["add"]?.(_0x2ec810);
    }
  } else {
    _0x572d50 && _0x51e0c5["remove"]?.(_0x2ec810);
  }
}
function setFreezeActiveClass(_0x427202) {
  setBodyClass(FREEZE_ACTIVE_BODY_CLASS, _0x427202);
}
function setFreezeSettlingClass(_0x4454f9) {
  setBodyClass(FREEZE_SETTLING_BODY_CLASS, _0x4454f9);
}
function clearFreezeSettlingTimer(_0x310119) {
  if (!_0x310119?.['freezeSettlingTimer']) {
    return;
  }
  clearTimeout(_0x310119["freezeSettlingTimer"]);
  _0x310119["freezeSettlingTimer"] = null;
}
function scheduleFreezeSettlingClear(_0xdb1c9a) {
  if (!_0xdb1c9a) {
    return;
  }
  setFreezeSettlingClass(!![]);
  clearFreezeSettlingTimer(_0xdb1c9a);
  _0xdb1c9a['freezeSettlingUntil'] = getNowMs() + FREEZE_SETTLE_HOLD_MS;
  _0xdb1c9a['freezeSettlingTimer'] = setTimeout(() => {
    _0xdb1c9a["freezeSettlingTimer"] = null;
    _0xdb1c9a["freezeSettlingUntil"] = 0x0;
    setFreezeSettlingClass(![]);
    if (!getCanvasInteractionState()["frozen"]) {
      setFreezeActiveClass(![]);
    }
    _0xdb1c9a["scheduleFinalSync"]();
  }, FREEZE_SETTLE_HOLD_MS);
}
function createSyncBudgetState(_0x45a07f) {
  const _0x342de7 = {
    'cachedViewsByNodeId': new Map(),
    'finalSyncTimer': null,
    'freezeSettlingTimer': null,
    'freezeSettlingUntil': 0x0,
    'freezeActive': ![],
    'snapshotFreezeActive': ![],
    'snapshotSettleActive': ![],
    'pendingPanFreezeTimer': null,
    'pendingPanFreezeUntil': 0x0,
    'canvasSpaceHeld': readCanvasSpaceHeld(),
    'freezeToken': 0x0,
    'lastBackgroundSyncAt': 0x0,
    'lastViewsSignature': '',
    'scheduleFinalSync'() {
      clearFinalSyncTimer(_0x342de7);
      _0x342de7["finalSyncTimer"] = setTimeout(() => {
        _0x342de7["finalSyncTimer"] = null;
        _0x45a07f();
      }, FINAL_INTERACTION_SYNC_DELAY_MS);
    }
  };
  return _0x342de7;
}
function markInteractionTransition(_0x594ec6, _0x52e7c6) {
  if (!_0x594ec6) {
    return;
  }
  const _0x3cfd6b = Boolean(_0x52e7c6?.['frozen']);
  const _0x545e06 = Boolean(_0x52e7c6?.["showSnapshot"]);
  const _0x27a7f5 = Boolean(_0x52e7c6?.["settleSnapshot"]);
  const _0x4d399a = _0x3cfd6b && !_0x594ec6['freezeActive'];
  const _0x511fb8 = _0x3cfd6b && _0x545e06 && !_0x594ec6["snapshotFreezeActive"];
  if (_0x4d399a || _0x511fb8) {
    clearFreezeSettlingTimer(_0x594ec6);
    _0x594ec6["freezeSettlingUntil"] = 0x0;
    setFreezeSettlingClass(![]);
    _0x594ec6["freezeToken"] += 0x1;
    _0x594ec6["lastBackgroundSyncAt"] = 0x0;
  } else {
    !_0x3cfd6b && _0x594ec6["freezeActive"] && (_0x594ec6["lastBackgroundSyncAt"] = 0x0, _0x594ec6["snapshotSettleActive"] ? scheduleFreezeSettlingClear(_0x594ec6) : (_0x594ec6['freezeSettlingUntil'] = 0x0, setFreezeSettlingClass(![]), setFreezeActiveClass(![]), _0x594ec6["scheduleFinalSync"]()));
  }
  _0x594ec6["freezeActive"] = _0x3cfd6b;
  _0x594ec6["snapshotFreezeActive"] = _0x3cfd6b && _0x545e06;
  _0x594ec6['snapshotSettleActive'] = _0x3cfd6b && _0x27a7f5;
}
function getEffectiveInteractionState(_0x4cf0a1, _0xce2c7f) {
  const _0x469643 = !_0x4cf0a1?.['frozen'] && Number(_0xce2c7f?.["freezeSettlingUntil"] || 0x0) > getNowMs();
  if (!_0x469643) {
    return _0x4cf0a1;
  }
  return {
    'frozen': !![],
    'deferZoomFactor': !![],
    'settleSnapshot': !![],
    'showSnapshot': !![]
  };
}
function collectWebPreviewViews({
  graphStore: _0x2e30b5,
  root = document,
  freezeToken = 0x0,
  interactionState = getCanvasInteractionState(),
  canvasSpaceHeld = readCanvasSpaceHeld()
} = {}) {
  const _0x2560c7 = typeof _0x2e30b5?.['getStateRaw'] === "function" ? _0x2e30b5["getStateRaw"]() : _0x2e30b5?.["getState"]?.() || {};
  const _0x44b089 = new Set(_0x2560c7["selectedNodeIds"] || []);
  const _0x1c0b8d = Object["values"](_0x2560c7["nodes"] || {})['filter'](_0x40da18 => _0x40da18?.["type"] === "web-preview")["map"](_0xbd9d71 => {
    const _0x2937c7 = normalizeWebPreviewTabs(_0xbd9d71);
    return {
      'node': _0xbd9d71,
      'tabState': _0x2937c7,
      'tabs': _0x2937c7["tabs"]["map"](_0x292516 => ({
        'tab': _0x292516,
        'webUrl': normalizeWebPreviewUrl(_0x292516['url']),
        'pendingPopup': _0x292516["pendingPopup"] === !![],
        'active': _0x292516['id'] === _0x2937c7["activeTabId"]
      }))["filter"](_0x181396 => _0x181396['webUrl'] || _0x181396["pendingPopup"])
    };
  })["filter"](_0x2b1ffa => _0x2b1ffa["tabs"]['length'] > 0x0);
  const _0x5ee649 = normalizeCanvasZoom(_0x2560c7['viewport']?.["zoom"]);
  const _0x10e252 = buildSlotIndex(root, _0x1c0b8d["map"](_0x1f2ca3 => _0x1f2ca3["node"]['id']));
  const _0xd974b2 = collectOcclusionRects(root, SOFT_OCCLUSION_SELECTOR);
  const _0x1ed13b = collectOcclusionRects(root, HARD_OCCLUSION_SELECTOR);
  const _0xf1dd0f = collectOcclusionRects(root, FULLSCREEN_OCCLUSION_SELECTOR);
  const _0x26da32 = collectCanvasNodeOccluders(root);
  const _0x182149 = [];
  for (const {
    node: _0x315e8b,
    tabs: _0xdb7f4f
  } of _0x1c0b8d) {
    const _0x22db89 = _0x10e252["get"](_0x315e8b['id']);
    for (const {
      tab: _0x4c9290,
      webUrl: _0x3de50f,
      pendingPopup: _0x10d089,
      active: _0x2a724e
    } of _0xdb7f4f) {
      _0x182149["push"](buildViewPayload({
        'node': _0x315e8b,
        'tabId': _0x4c9290['id'],
        'webUrl': _0x3de50f,
        'pendingPopup': _0x10d089,
        'slot': _0x2a724e ? _0x22db89 : null,
        'active': _0x2a724e,
        'selected': _0x2a724e && _0x44b089["has"](_0x315e8b['id']),
        'canvasZoom': _0x5ee649,
        'interactionState': interactionState,
        'freezeToken': freezeToken,
        'canvasSpaceHeld': canvasSpaceHeld,
        'fullscreenBlockerRects': _0xf1dd0f,
        'softBlockerRects': _0xd974b2,
        'hardBlockerRects': _0x1ed13b,
        'canvasNodeOccluders': _0x26da32,
        'root': root
      }));
    }
  }
  _0x182149["sort"]((_0x5a3548, _0x49b654) => Number(_0x5a3548["selected"]) - Number(_0x49b654["selected"]));
  return _0x182149;
}
export function initWebPreviewViewSyncService({
  graphStore: _0x29b0ee,
  root = document
} = {}) {
  const _0x2c9bce = desktopBridge['webPreview'];
  if (!_0x2c9bce["isAvailable"]()) {
    return {
      'dispose'() {}
    };
  }
  const _0x4caf34 = getRequestAnimationFrame();
  const _0x2176d7 = getCancelAnimationFrame();
  const _0x4c054e = typeof _0x2c9bce["syncViewsFast"] === "function" ? _0x2c9bce['syncViewsFast'] : _0x2c9bce["syncViews"];
  let _0x416f44 = null;
  let _0x503985 = ![];
  const _0x5d4903 = createWebPreviewNodeActivityTracker(_0x29b0ee);
  let _0x1dcf51 = _0x5d4903["hasActiveNodes"];
  let _0x4a153d = null;
  const _0x461f03 = () => {
    _0x416f44 = null;
    if (_0x503985) {
      return;
    }
    const _0x40da7f = getCanvasInteractionState(_0x4a153d);
    markInteractionTransition(_0x4a153d, _0x40da7f);
    const _0x16b6ad = getEffectiveInteractionState(_0x40da7f, _0x4a153d);
    const _0x5de593 = syncCachedViewsForBudget(collectWebPreviewViews({
      'graphStore': _0x29b0ee,
      'root': root,
      'freezeToken': _0x4a153d?.["freezeToken"] || 0x0,
      'interactionState': _0x16b6ad,
      'canvasSpaceHeld': _0x4a153d?.['canvasSpaceHeld'] === !![]
    }), _0x4a153d);
    setFreezeActiveClass(_0x5de593['some'](_0xfd9473 => _0xfd9473?.['showSnapshot'] === !![]));
    const _0x143edb = collectWebPreviewContextMenuShortcuts();
    const _0x2b958a = buildViewsSignature(_0x5de593, _0x143edb);
    if (_0x2b958a === _0x4a153d?.["lastViewsSignature"]) {
      return;
    }
    if (_0x4a153d) {
      _0x4a153d["lastViewsSignature"] = _0x2b958a;
    }
    try {
      const _0x3e7f55 = _0x4c054e({
        'views': _0x5de593,
        'contextMenuShortcuts': _0x143edb
      });
      _0x3e7f55 && typeof _0x3e7f55['catch'] === "function" && void _0x3e7f55["catch"](() => {});
    } catch {}
  };
  const _0x10d763 = () => {
    if (_0x503985 || !_0x1dcf51 || _0x416f44 !== null) {
      return;
    }
    _0x416f44 = _0x4caf34(_0x461f03);
  };
  const _0x32df4a = () => {
    if (_0x503985) {
      return;
    }
    _0x416f44 !== null && (_0x2176d7(_0x416f44), _0x416f44 = null);
    _0x461f03();
  };
  const _0x38f2be = () => {
    const _0x15b4a9 = getCanvasInteractionState(_0x4a153d);
    return _0x15b4a9["frozen"] || _0x15b4a9["deferZoomFactor"] || _0x4a153d?.["freezeActive"] === !![] || Number(_0x4a153d?.['freezeSettlingUntil'] || 0x0) > getNowMs();
  };
  const _0x28582a = () => {
    if (_0x38f2be()) {
      _0x32df4a();
      return;
    }
    _0x10d763();
  };
  const _0x9df6dd = () => {
    if (!_0x1dcf51) {
      return;
    }
    _0x10d763();
  };
  _0x4a153d = createSyncBudgetState(_0x10d763);
  const _0x1be5d4 = () => {
    if (!_0x1dcf51) {
      return;
    }
    if (isViewportPanPreviewActive()) {
      return;
    }
    _0x10d763();
  };
  const _0x57be50 = () => {
    if (!_0x1dcf51) {
      return;
    }
    _0x32df4a();
  };
  const _0x3c071f = () => {
    if (!_0x1dcf51) {
      return;
    }
    startPendingPanFreeze(_0x4a153d);
    _0x32df4a();
  };
  const _0x502058 = _0x118652 => {
    if (!_0x1dcf51) {
      return;
    }
    if (isPotentialCanvasPanStartEvent(_0x118652)) {
      _0x3c071f();
      return;
    }
    _0x10d763();
  };
  const _0x5632d1 = () => {
    clearPendingPanFreeze(_0x4a153d);
    _0x1be5d4();
  };
  const _0x1aa034 = () => {
    if (!_0x1dcf51 || !_0x4a153d) {
      return;
    }
    const _0x484dc6 = readCanvasSpaceHeld();
    if (_0x4a153d["canvasSpaceHeld"] === _0x484dc6) {
      return;
    }
    _0x4a153d["canvasSpaceHeld"] = _0x484dc6;
    _0x32df4a();
  };
  const _0x181e43 = _0x1fa43d => {
    const _0x1ebc02 = _0x1dcf51;
    _0x1dcf51 = _0x5d4903["refresh"](_0x1fa43d);
    if (!_0x1dcf51) {
      if (_0x1ebc02) {
        _0x32df4a();
      }
      return;
    }
    _0x28582a();
  };
  const _0x4cdecc = typeof _0x29b0ee?.["subscribeRaw"] === "function" ? _0x29b0ee['subscribeRaw'](_0x181e43) : () => {};
  const _0x3f0c66 = typeof _0x2c9bce["onEvent"] === "function" ? _0x2c9bce["onEvent"](_0x113c1c => {
    if (isNativePanStartPreviewEvent(_0x113c1c)) {
      _0x3c071f();
    }
    globalThis["window"]?.["dispatchEvent"]?.(new CustomEvent("web-preview:native-event", {
      'detail': _0x113c1c
    }));
  }) : () => {};
  const _0x5bc27d = globalThis["window"]?.["MutationObserver"] || globalThis["MutationObserver"];
  const _0x4d96c2 = typeof _0x5bc27d === 'function' ? new _0x5bc27d(_0xb10b21 => {
    if (!_0x1dcf51) {
      return;
    }
    if (shouldSyncForOcclusionMutation(_0xb10b21)) {
      _0x9df6dd();
    }
  }) : null;
  const _0x9d278f = root?.["body"] || root?.["documentElement"] || root;
  try {
    _0x4d96c2?.['observe']?.(_0x9d278f, {
      'attributes': !![],
      'attributeFilter': ["class", 'style', "hidden"],
      'attributeOldValue': !![],
      'childList': !![],
      'subtree': !![]
    });
  } catch {}
  globalThis["window"]?.['addEventListener']?.('resize', _0x10d763);
  globalThis["window"]?.['addEventListener']?.("scroll", _0x10d763, !![]);
  globalThis["window"]?.["addEventListener"]?.(VIEWPORT_PAN_PREVIEW_FRAME_EVENT, _0x57be50);
  globalThis["window"]?.["addEventListener"]?.("pointerdown", _0x502058, !![]);
  globalThis["window"]?.["addEventListener"]?.('pointermove', _0x1be5d4);
  globalThis['window']?.["addEventListener"]?.('pointerup', _0x5632d1);
  globalThis["window"]?.["addEventListener"]?.("pointercancel", _0x5632d1);
  globalThis["window"]?.['addEventListener']?.('keydown', _0x1aa034);
  globalThis['window']?.["addEventListener"]?.('keyup', _0x1aa034);
  globalThis["window"]?.['addEventListener']?.("blur", _0x1aa034);
  globalThis["window"]?.["addEventListener"]?.("wheel", _0x1be5d4, {
    'passive': !![]
  });
  globalThis["window"]?.["addEventListener"]?.('web-preview:force-sync', _0x32df4a);
  globalThis["window"]?.["addEventListener"]?.("shortcuts-updated", _0x32df4a);
  _0x10d763();
  return {
    'dispose'() {
      _0x503985 = !![];
      clearFinalSyncTimer(_0x4a153d);
      clearFreezeSettlingTimer(_0x4a153d);
      clearPendingPanFreeze(_0x4a153d);
      if (_0x4a153d) {
        _0x4a153d['freezeSettlingUntil'] = 0x0;
      }
      setFreezeActiveClass(![]);
      setFreezeSettlingClass(![]);
      if (_0x416f44 !== null) {
        _0x2176d7(_0x416f44);
      }
      _0x416f44 = null;
      _0x4cdecc?.();
      _0x3f0c66?.();
      globalThis["window"]?.["removeEventListener"]?.("resize", _0x10d763);
      globalThis["window"]?.['removeEventListener']?.('scroll', _0x10d763, !![]);
      globalThis['window']?.["removeEventListener"]?.(VIEWPORT_PAN_PREVIEW_FRAME_EVENT, _0x57be50);
      globalThis["window"]?.["removeEventListener"]?.("pointerdown", _0x502058, !![]);
      globalThis["window"]?.["removeEventListener"]?.('pointermove', _0x1be5d4);
      globalThis["window"]?.["removeEventListener"]?.('pointerup', _0x5632d1);
      globalThis["window"]?.["removeEventListener"]?.("pointercancel", _0x5632d1);
      globalThis['window']?.['removeEventListener']?.("keydown", _0x1aa034);
      globalThis["window"]?.["removeEventListener"]?.('keyup', _0x1aa034);
      globalThis["window"]?.["removeEventListener"]?.("blur", _0x1aa034);
      globalThis["window"]?.["removeEventListener"]?.("wheel", _0x1be5d4, {
        'passive': !![]
      });
      globalThis["window"]?.["removeEventListener"]?.('web-preview:force-sync', _0x32df4a);
      globalThis["window"]?.["removeEventListener"]?.('shortcuts-updated', _0x32df4a);
      _0x4d96c2?.["disconnect"]?.();
      void _0x2c9bce["disposeViews"]?.();
    }
  };
}
export { collectWebPreviewViews };