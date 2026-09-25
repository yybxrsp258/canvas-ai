import { findClosestNode, getViewportScreenCenter, hitTestNode, worldToScreen } from '../../core/math.js';
import { getShortcuts } from '../shortcuts.js';
import { CANVAS_WHEEL_BEHAVIOR_PAN, readCanvasWheelBehavior } from '../settings/canvasControlSettings.js';
const CANVAS_UI_EXCLUSION_SELECTOR = '.header,\x20.sidebar-floating,\x20.canvas-controls-floating,\x20.empty-hint,\x20.fab-btn,\x20.mascot-wrap,\x20.node-add-menu,\x20.minimap-wrapper,\x20[data-ui-stop=\x221\x22]';
const CANVAS_PAN_OVERLAY_SELECTOR = '.side-plus-btn';
const ACTIVE_WHITEBOARD_INTERACTION_SELECTOR = ".whiteboard-node-component.is-whiteboard-editing";
function selectVideoInteractionLockState(_0x2eab5d = {}) {
  const _0x427aa0 = _0x2eab5d["videoKeying"] || null;
  const _0x5695ea = _0x2eab5d["videoClip"] || null;
  const _0x4a29cf = _0x427aa0?.['active'] ? _0x427aa0 : _0x5695ea?.["active"] ? _0x5695ea : null;
  return {
    'active': !!_0x4a29cf?.["active"],
    'nodeId': _0x4a29cf?.["nodeId"] || null
  };
}
function getInitialState(_0x17bdb0) {
  if (typeof _0x17bdb0?.["getState"] === "function") {
    return _0x17bdb0["getState"]() || {};
  }
  return {};
}
function subscribeSelectorOrPrime(_0x17da85, _0x25f3d5, _0x2cc8e0) {
  if (typeof _0x17da85?.["subscribeSelector"] === 'function') {
    return _0x17da85["subscribeSelector"](_0x25f3d5, _0x2cc8e0);
  }
  _0x2cc8e0(_0x25f3d5(getInitialState(_0x17da85)));
  return () => {};
}
function subscribeRawOrPrime(_0x47d88a, _0x477b6e) {
  if (typeof _0x47d88a?.["subscribeRaw"] === 'function') {
    return _0x47d88a["subscribeRaw"](_0x477b6e);
  }
  _0x477b6e(getInitialState(_0x47d88a));
  return () => {};
}
function getRequiredInteractionFunction(_0x328692, _0x436c6b) {
  const _0x415cf4 = _0x328692?.[_0x436c6b];
  if (typeof _0x415cf4 !== "function") {
    throw new TypeError('[appCanvasPointerBindings]\x20missing\x20interaction.' + _0x436c6b);
  }
  return _0x415cf4;
}
export function createCanvasPointerStateCache({
  graphStore: _0x2392f0,
  uiStore: _0x493393
} = {}) {
  const _0x5b830d = {
    'nodes': {},
    'videoInteractionLock': null,
    'pickerVisible': ![],
    'annotateActive': ![]
  };
  const _0x421770 = [subscribeRawOrPrime(_0x2392f0, _0x4d7629 => {
    _0x5b830d["nodes"] = _0x4d7629?.["nodes"] || {};
  }), subscribeSelectorOrPrime(_0x493393, selectVideoInteractionLockState, _0x494b5e => {
    _0x5b830d["videoInteractionLock"] = _0x494b5e?.["active"] ? _0x494b5e : null;
  }), subscribeSelectorOrPrime(_0x493393, _0xaaf942 => !!_0xaaf942['picker']?.["visible"], _0xfbe4e => {
    _0x5b830d["pickerVisible"] = !!_0xfbe4e;
  }), subscribeSelectorOrPrime(_0x493393, _0x3be281 => !!_0x3be281["annotate"]?.["active"], _0x18cff6 => {
    _0x5b830d["annotateActive"] = !!_0x18cff6;
  })];
  return {
    'cache': _0x5b830d,
    'dispose'() {
      _0x421770["forEach"](_0x42d497 => _0x42d497?.());
    }
  };
}
function isVideoInteractionLocked(_0x4fae29) {
  return !!_0x4fae29["videoInteractionLock"]?.["active"];
}
function isPanoramaEditing(_0x300755) {
  const _0x388831 = _0x300755?.["type"] === "panorama-360" ? _0x300755?.["panorama360Node"] : _0x300755?.["sceneNode"];
  return (_0x300755?.["type"] === "panorama-scene" || _0x300755?.["type"] === 'panorama-360') && _0x300755?.["isCollapsed"] !== !![] && _0x388831?.['ui']?.["isEditing"] === !![];
}
function blurActiveEditableForCanvasPointer(_0x20f7a6, _0x15dfc4) {
  if (!_0x20f7a6) {
    return;
  }
  if (_0x20f7a6['closest']?.("input, textarea, [contenteditable='true']")) {
    return;
  }
  const _0x35a4be = _0x15dfc4?.['activeElement'];
  if (!_0x35a4be) {
    return;
  }
  const _0x5bc4da = _0x35a4be["tagName"] === "INPUT" || _0x35a4be["tagName"] === 'TEXTAREA' || _0x35a4be["contentEditable"] === "true";
  _0x5bc4da && typeof _0x35a4be['blur'] === "function" && _0x35a4be["blur"]();
}
function isScrollableTextEditWheel(_0xeee2a9, _0x3863c9) {
  const _0x11fa5e = _0xeee2a9?.["closest"]?.('.source-text-content');
  if (!_0x11fa5e || _0x3863c9?.["activeElement"] !== _0x11fa5e) {
    return ![];
  }
  return _0x11fa5e["scrollHeight"] > _0x11fa5e["clientHeight"];
}
function getWheelDeltaScale(_0x363463, _0x1a24be) {
  if (_0x363463 === 0x1) {
    return 0x10;
  }
  if (_0x363463 === 0x2) {
    return Math["max"](0x1, Number(_0x1a24be) || 0x320);
  }
  return 0x1;
}
function normalizeWheelDelta(_0x57dc8f, _0x7bf5d, _0x4a76b7) {
  const _0x4736da = Number(_0x57dc8f);
  if (!Number["isFinite"](_0x4736da)) {
    return 0x0;
  }
  return _0x4736da * getWheelDeltaScale(_0x7bf5d, _0x4a76b7);
}
export function resolveCanvasWheelGesture(_0x495eb0, _0x3fd4b5 = readCanvasWheelBehavior(), _0x4aad6e = {}) {
  const _0x255597 = _0x3fd4b5 === CANVAS_WHEEL_BEHAVIOR_PAN ? "pan" : "zoom";
  const _0x5566c6 = Number(_0x495eb0?.["deltaMode"]) || 0x0;
  const _0x3cb5b9 = Number(_0x495eb0?.['deltaX']) || 0x0;
  const _0xea5823 = Number(_0x495eb0?.['deltaY']) || 0x0;
  if (_0x255597 !== 'pan' || _0x495eb0?.["ctrlKey"] || _0x495eb0?.["metaKey"]) {
    const _0xb5c457 = _0xea5823 || _0x3cb5b9;
    return {
      'type': "zoom",
      'deltaY': normalizeWheelDelta(_0xb5c457, _0x5566c6, _0xea5823 ? _0x4aad6e["height"] : _0x4aad6e['width'])
    };
  }
  if (_0x495eb0?.["shiftKey"]) {
    const _0x263211 = _0x3cb5b9 || _0xea5823;
    return {
      'type': "pan",
      'deltaX': normalizeWheelDelta(_0x263211, _0x5566c6, _0x4aad6e["width"]),
      'deltaY': 0x0
    };
  }
  return {
    'type': "pan",
    'deltaX': normalizeWheelDelta(_0x3cb5b9, _0x5566c6, _0x4aad6e["width"]),
    'deltaY': normalizeWheelDelta(_0xea5823, _0x5566c6, _0x4aad6e['height'])
  };
}
function getElementComputedStyle(_0x4c5d14, _0x2136d5) {
  const _0x531bff = _0x4c5d14?.["ownerDocument"]?.["defaultView"]?.["getComputedStyle"] || _0x2136d5?.['getComputedStyle'];
  if (typeof _0x531bff !== "function") {
    return null;
  }
  try {
    return _0x531bff["call"](_0x4c5d14?.['ownerDocument']?.['defaultView'] || _0x2136d5, _0x4c5d14);
  } catch {
    return null;
  }
}
function isScrollableOverflowValue(_0x55bc53) {
  return _0x55bc53 === 'auto' || _0x55bc53 === "scroll" || _0x55bc53 === 'overlay';
}
export function findScrollableWheelAncestor(_0x5c3966, _0x4c1387, _0x2a6794) {
  let _0x3d9876 = _0x5c3966?.['nodeType'] === 0x3 ? _0x5c3966['parentElement'] : _0x5c3966;
  while (_0x3d9876 && _0x3d9876 !== _0x4c1387) {
    const _0x59d265 = Number(_0x3d9876['scrollHeight']) > Number(_0x3d9876['clientHeight']);
    const _0x5b4fd2 = Number(_0x3d9876['scrollWidth']) > Number(_0x3d9876["clientWidth"]);
    if (_0x5b4fd2 || _0x59d265) {
      const _0x57441d = getElementComputedStyle(_0x3d9876, _0x2a6794);
      const _0x3f42f2 = _0x57441d?.['overflow'];
      const _0x3fd92b = _0x59d265 && (isScrollableOverflowValue(_0x57441d?.['overflowY']) || isScrollableOverflowValue(_0x3f42f2));
      const _0x1b8acd = _0x5b4fd2 && (isScrollableOverflowValue(_0x57441d?.['overflowX']) || isScrollableOverflowValue(_0x3f42f2));
      if (_0x1b8acd || _0x3fd92b) {
        return _0x3d9876;
      }
    }
    _0x3d9876 = _0x3d9876["parentElement"] || null;
  }
  return null;
}
function isCanvasPanSurfaceTarget(_0x2f361d, _0x1a4e83) {
  if (!_0x2f361d || !_0x1a4e83) {
    return ![];
  }
  if (_0x1a4e83['contains']?.(_0x2f361d)) {
    return !![];
  }
  return !!_0x2f361d["closest"]?.(CANVAS_PAN_OVERLAY_SELECTOR);
}
function isActiveWhiteboardInteractionTarget(_0x121b69) {
  return !!_0x121b69?.['closest']?.(ACTIVE_WHITEBOARD_INTERACTION_SELECTOR);
}
function normalizeModifierShortcutToken(_0x2bebc1) {
  const _0x5b348d = String(_0x2bebc1 || '')['trim']()["toLowerCase"]();
  if (_0x5b348d === 'ctrl' || _0x5b348d === "control" || _0x5b348d === "meta") {
    return 'Ctrl';
  }
  if (_0x5b348d === "shift") {
    return "Shift";
  }
  if (_0x5b348d === "alt" || _0x5b348d === "option") {
    return 'Alt';
  }
  return '';
}
function isPointerModifierShortcutActive(_0x25c638, _0x461cf7, _0x613843) {
  const _0xbbb14d = getShortcuts?.()?.[_0x461cf7]?.["keys"];
  const _0x2fe360 = Array["isArray"](_0xbbb14d) && _0xbbb14d['length'] > 0x0 ? _0xbbb14d : [_0x613843];
  if (_0x2fe360["length"] !== 0x1) {
    return ![];
  }
  const _0xb105d9 = normalizeModifierShortcutToken(_0x2fe360[0x0]);
  if (_0xb105d9 === "Ctrl") {
    return !!(_0x25c638?.["ctrlKey"] || _0x25c638?.["metaKey"]);
  }
  if (_0xb105d9 === "Shift") {
    return _0x25c638?.["shiftKey"] === !![];
  }
  if (_0xb105d9 === "Alt") {
    return _0x25c638?.["altKey"] === !![];
  }
  return ![];
}
function createLastPointerTracker(_0x5ce604, _0x318493 = {}) {
  const _0x59b89a = getViewportScreenCenter(_0x318493, Number(_0x5ce604?.["innerWidth"]) || 0x0, Number(_0x5ce604?.["innerHeight"]) || 0x0);
  const _0x46f924 = {
    'x': _0x59b89a['x'],
    'y': _0x59b89a['y']
  };
  function _0x1166df() {
    if (!_0x5ce604) {
      return;
    }
    _0x5ce604["_lastMx"] = _0x46f924['x'];
    _0x5ce604["_lastMy"] = _0x46f924['y'];
  }
  function _0x39ccbc(_0x1ff3ed) {
    _0x46f924['x'] = _0x1ff3ed["clientX"];
    _0x46f924['y'] = _0x1ff3ed["clientY"];
    _0x1166df();
  }
  _0x1166df();
  return {
    'updateFromEvent': _0x39ccbc,
    'getCursorScreenPosition'() {
      return {
        'x': _0x46f924['x'],
        'y': _0x46f924['y']
      };
    }
  };
}
export function installAppCanvasPointerBindings({
  graphStore: _0x1eee53,
  uiStore: _0x211e3e,
  wrap: _0x12b104,
  appViewport: _0x50dcb1,
  interaction: _0x477813,
  targetWindow = typeof window === "undefined" ? null : window,
  targetDocument = typeof document === "undefined" ? null : document,
  getCanvasWheelBehavior = readCanvasWheelBehavior
} = {}) {
  const _0x386be5 = getRequiredInteractionFunction(_0x477813, 'getDragContext');
  const _0x4ddf24 = getRequiredInteractionFunction(_0x477813, "handlePointerDown");
  const _0x27b795 = getRequiredInteractionFunction(_0x477813, "handlePointerMove");
  const _0x518ec9 = getRequiredInteractionFunction(_0x477813, "handlePointerUp");
  const _0x430542 = getRequiredInteractionFunction(_0x477813, 'handleWheel');
  const _0x55cbf0 = getRequiredInteractionFunction(_0x477813, "handleWheelPan");
  const _0x7055f4 = typeof _0x477813?.['settleWheelZoom'] === 'function' ? _0x477813["settleWheelZoom"] : null;
  const _0x477fb1 = typeof _0x477813?.['settleWheelPan'] === "function" ? _0x477813["settleWheelPan"] : null;
  const _0x2675ee = getRequiredInteractionFunction(_0x477813, 'initConnectionHandles');
  const _0x387f7c = getRequiredInteractionFunction(_0x477813, "initPickConnect");
  const _0x1e4428 = createCanvasPointerStateCache({
    'graphStore': _0x1eee53,
    'uiStore': _0x211e3e
  });
  const {
    cache: _0x13d8b0
  } = _0x1e4428;
  const _0x49f1d2 = createLastPointerTracker(targetWindow, _0x1eee53?.["getState"]?.()?.["viewport"] || {});
  const _0x20160e = [];
  let _0x535681 = null;
  let _0x53d8b4 = ![];
  function _0x3810f1() {
    return targetDocument?.['getElementById']?.("v2-wrap") || _0x12b104 || null;
  }
  function _0x188262(_0x2793d7, _0x1283f1, _0x111408, _0x3d29d8) {
    if (!_0x2793d7 || typeof _0x2793d7["addEventListener"] !== "function") {
      return;
    }
    _0x2793d7["addEventListener"](_0x1283f1, _0x111408, _0x3d29d8);
    _0x20160e['push'](() => _0x2793d7["removeEventListener"]?.(_0x1283f1, _0x111408, _0x3d29d8));
  }
  function _0x342d9f() {
    const _0x49745a = _0x386be5();
    return _0x535681 != null || !!_0x49745a?.["isPanning"] || !!_0x49745a?.["isDragging"] || !!_0x49745a?.["isConnecting"] || !!_0x49745a?.['isBoxSelecting'] || !!_0x49745a?.['isDraggingCell'];
  }
  function _0x21fecf(_0x545e3d, _0x2e511d) {
    const _0x108017 = resolveCanvasWheelGesture(_0x545e3d, getCanvasWheelBehavior?.(), {
      'width': Number(targetWindow?.["innerWidth"]) || 0x0,
      'height': Number(targetWindow?.["innerHeight"]) || 0x0
    });
    const _0xad1dfd = _0x108017['type'] === "zoom" ? _0x108017["deltaY"] !== 0x0 : _0x108017["deltaX"] !== 0x0 || _0x108017["deltaY"] !== 0x0;
    if (!_0xad1dfd) {
      return ![];
    }
    _0x545e3d["preventDefault"]();
    _0x545e3d["__aiCanvasWheelHandled"] = !![];
    if (isVideoInteractionLocked(_0x13d8b0)) {
      return !![];
    }
    _0x108017["type"] === "zoom" ? (_0x477fb1?.(), _0x50dcb1?.['clearTrackedFocus']?.("wheel-zoom"), _0x430542(_0x545e3d['clientX'], _0x545e3d["clientY"], _0x108017["deltaY"], _0x2e511d)) : (_0x7055f4?.(), _0x50dcb1?.["clearTrackedFocus"]?.("wheel-pan"), _0x55cbf0(_0x108017["deltaX"], _0x108017['deltaY'], _0x2e511d));
    return !![];
  }
  targetWindow && (targetWindow['_mathImports'] = {
    'findClosestNode': findClosestNode,
    'worldToScreen': worldToScreen,
    'hitTestNode': hitTestNode
  });
  const _0x80436 = _0x3810f1();
  _0x387f7c(_0x80436);
  _0x2675ee(_0x80436);
  _0x188262(targetWindow, "pointerdown", _0x10d02a => {
    (_0x10d02a["button"] === 0x0 || _0x10d02a["button"] === 0x1 || _0x10d02a["button"] === 0x2) && (_0x7055f4?.(), _0x477fb1?.());
    const _0xda1e1b = _0x3810f1();
    if (!isCanvasPanSurfaceTarget(_0x10d02a["target"], _0xda1e1b)) {
      return;
    }
    if (isActiveWhiteboardInteractionTarget(_0x10d02a["target"])) {
      (_0x10d02a["button"] === 0x0 || _0x10d02a["button"] === 0x1) && _0x50dcb1?.["clearTrackedFocus"]?.("whiteboard-geometry-start");
      return;
    }
    const _0x5ebc19 = _0x10d02a["target"]?.["closest"]?.(".panorama-scene-viewport");
    if (_0x5ebc19) {
      const _0x249180 = _0x5ebc19["closest"](".v2-node");
      const _0xf9a40b = _0x249180?.['id'] || '';
      const _0x57a9af = _0xf9a40b ? _0x13d8b0["nodes"]?.[_0xf9a40b] : null;
      if (isPanoramaEditing(_0x57a9af)) {
        return;
      }
    }
    const _0x18c026 = _0x13d8b0["videoInteractionLock"];
    if (_0x18c026?.['active']) {
      const _0x3b6b1f = _0x18c026['nodeId'] ? targetDocument?.["getElementById"]?.(_0x18c026['nodeId']) : null;
      if (_0x3b6b1f && _0x3b6b1f['contains'](_0x10d02a["target"])) {
        return;
      }
      _0x10d02a["preventDefault"]();
      _0x10d02a["stopPropagation"]();
      return;
    }
    const _0x376e51 = _0x10d02a["button"] === 0x1 || targetWindow?.["_spaceHeld"] && _0x10d02a["button"] === 0x0;
    if (!_0x376e51) {
      return;
    }
    _0x10d02a["preventDefault"]();
    _0x10d02a["stopPropagation"]();
    _0x50dcb1?.["clearTrackedFocus"]?.("pan-start");
    if (targetWindow?.["_spaceHeld"]) {
      _0xda1e1b['style']['cursor'] = "var(--grab-cursor)";
    }
    const _0x51f0bf = _0x386be5();
    const _0xafbb2c = !!_0x51f0bf?.['isDragging'];
    try {
      _0xda1e1b["setPointerCapture"](_0x10d02a["pointerId"]);
      _0x535681 = _0x10d02a['pointerId'];
    } catch {}
    !_0xafbb2c && _0x4ddf24(_0x10d02a["clientX"], _0x10d02a["clientY"], !![], ![], _0x10d02a);
  }, {
    'capture': !![]
  });
  _0x188262(_0x12b104, "pointerdown", _0x42180a => {
    _0x49f1d2["updateFromEvent"](_0x42180a);
    if (isActiveWhiteboardInteractionTarget(_0x42180a["target"])) {
      return;
    }
    const _0x3c46b4 = _0x42180a["target"]?.["closest"]?.(CANVAS_UI_EXCLUSION_SELECTOR);
    if (_0x3c46b4) {
      return;
    }
    blurActiveEditableForCanvasPointer(_0x42180a["target"], targetDocument);
    _0x211e3e?.["hideContextMenu"]?.();
    const _0x3eb310 = _0x13d8b0['videoInteractionLock'];
    if (_0x3eb310?.["active"]) {
      const _0x1ec08e = _0x3eb310["nodeId"] ? targetDocument?.['getElementById']?.(_0x3eb310["nodeId"]) : null;
      if (!_0x1ec08e || !_0x1ec08e["contains"](_0x42180a["target"])) {
        return;
      }
      return;
    }
    const _0x3dd830 = isPointerModifierShortcutActive(_0x42180a, "duplicate-with-edges", "Alt") && !targetWindow?.['_spaceHeld'];
    if (_0x13d8b0["pickerVisible"]) {
      _0x211e3e?.['hidePicker']?.();
      return;
    }
    (_0x42180a["button"] === 0x0 || _0x42180a["button"] === 0x1) && _0x50dcb1?.["clearTrackedFocus"]?.("canvas-geometry-start");
    _0x4ddf24(_0x42180a['clientX'], _0x42180a["clientY"], ![], _0x3dd830, _0x42180a);
    if (_0x535681 != null) {
      return;
    }
    const _0x1ec748 = _0x386be5();
    _0x1ec748["isPanning"] && _0x50dcb1?.["clearTrackedFocus"]?.("pan-start");
    if (_0x1ec748['isPanning'] || _0x1ec748["isConnecting"] || _0x1ec748["isBoxSelecting"] || _0x1ec748["isDraggingCell"]) {
      try {
        _0x12b104["setPointerCapture"](_0x42180a["pointerId"]);
        _0x535681 = _0x42180a["pointerId"];
      } catch {}
    }
  });
  _0x188262(_0x12b104, 'dblclick', () => {});
  _0x188262(_0x12b104, 'pointermove', _0x56ca0c => {
    _0x49f1d2['updateFromEvent'](_0x56ca0c);
    if (isActiveWhiteboardInteractionTarget(_0x56ca0c["target"]) && !_0x342d9f()) {
      return;
    }
    if (isVideoInteractionLocked(_0x13d8b0)) {
      return;
    }
    _0x53d8b4 && _0x386be5()?.["isDragging"] && (_0x56ca0c['__aiCanvasLeftDragHeld'] = !![]);
    _0x27b795(_0x56ca0c["clientX"], _0x56ca0c["clientY"], _0x56ca0c);
    if (_0x535681 != null) {
      return;
    }
    const _0x29deaf = _0x386be5();
    if (_0x29deaf["isDragging"] && _0x29deaf['hasMoved']) {
      try {
        _0x12b104["setPointerCapture"](_0x56ca0c["pointerId"]);
        _0x535681 = _0x56ca0c['pointerId'];
      } catch {}
    }
  });
  _0x188262(_0x12b104, 'pointerup', _0x41adea => {
    if (isVideoInteractionLocked(_0x13d8b0)) {
      return;
    }
    const _0x443a7c = _0x386be5();
    const _0x1d8c64 = !!_0x443a7c?.["isDragging"] && _0x41adea["button"] !== 0x0 && (_0x41adea["buttons"] & 0x1) !== 0x0;
    if (_0x1d8c64) {
      _0x53d8b4 = !![];
      _0x41adea["__aiCanvasLeftDragHeld"] = !![];
      _0x27b795(_0x41adea["clientX"], _0x41adea["clientY"], _0x41adea);
      if (targetWindow?.["_spaceHeld"]) {
        _0x12b104["style"]['cursor'] = "var(--grab-cursor)";
      }
      return;
    }
    _0x53d8b4 = ![];
    _0x535681 = null;
    _0x518ec9(_0x41adea["clientX"], _0x41adea["clientY"]);
    if (targetWindow?.["_spaceHeld"]) {
      _0x12b104["style"]["cursor"] = "var(--grab-cursor)";
    }
  });
  _0x188262(_0x12b104, 'pointercancel', _0x10f7f4 => {
    _0x53d8b4 = ![];
    _0x535681 = null;
    if (isVideoInteractionLocked(_0x13d8b0)) {
      return;
    }
    _0x518ec9(_0x10f7f4["clientX"], _0x10f7f4["clientY"], !![]);
    if (targetWindow?.['_spaceHeld']) {
      _0x12b104["style"]["cursor"] = "var(--grab-cursor)";
    }
  });
  _0x188262(targetWindow, "blur", () => {
    _0x535681 = null;
    _0x53d8b4 = ![];
    _0x518ec9(0x0, 0x0, !![]);
  });
  _0x188262(targetDocument, "pointerup", _0x28f5b9 => {
    const _0x299f6e = _0x3810f1();
    const _0x5a2c91 = _0x386be5();
    const _0x14d0bb = !!_0x5a2c91?.["isDragging"] && _0x28f5b9['button'] !== 0x0 && (_0x28f5b9["buttons"] & 0x1) !== 0x0;
    if (_0x535681 != null) {
      if (_0x14d0bb) {
        _0x53d8b4 = !![];
        _0x28f5b9["__aiCanvasLeftDragHeld"] = !![];
        _0x27b795(_0x28f5b9['clientX'], _0x28f5b9['clientY'], _0x28f5b9);
        return;
      }
      _0x53d8b4 = ![];
      _0x535681 = null;
      return;
    }
    if (_0x299f6e && _0x299f6e['contains'](_0x28f5b9['target'])) {
      return;
    }
    if (_0x14d0bb) {
      _0x53d8b4 = !![];
      _0x28f5b9["__aiCanvasLeftDragHeld"] = !![];
      _0x27b795(_0x28f5b9["clientX"], _0x28f5b9["clientY"], _0x28f5b9);
      return;
    }
    _0x53d8b4 = ![];
    _0x518ec9();
    targetWindow?.['_spaceHeld'] && _0x299f6e && (_0x299f6e["style"]["cursor"] = "var(--grab-cursor)");
  });
  _0x188262(_0x12b104, 'wheel', _0x486f30 => {
    if (_0x486f30['__aiCanvasWheelHandled']) {
      return;
    }
    _0x49f1d2['updateFromEvent'](_0x486f30);
    const _0x92e147 = _0x486f30["target"];
    if (isActiveWhiteboardInteractionTarget(_0x92e147)) {
      return;
    }
    if (findScrollableWheelAncestor(_0x92e147, _0x12b104, targetWindow)) {
      return;
    }
    const _0x459cbf = _0x92e147?.["tagName"];
    const _0x25e08c = _0x459cbf === "INPUT" || _0x459cbf === "TEXTAREA" || _0x92e147?.["contentEditable"] === "true" || _0x92e147?.['closest']?.("[contenteditable=\"true\"]");
    if (_0x25e08c || isScrollableTextEditWheel(_0x92e147, targetDocument)) {
      return;
    }
    _0x21fecf(_0x486f30, _0x92e147);
  }, {
    'passive': ![]
  });
  _0x188262(targetDocument, "wheel", _0x554c53 => {
    (_0x554c53["ctrlKey"] || _0x554c53["metaKey"]) && _0x554c53["preventDefault"]();
    const _0x37fcc2 = _0x554c53["target"];
    if (!_0x37fcc2) {
      return;
    }
    _0x49f1d2["updateFromEvent"](_0x554c53);
    const _0x476709 = _0x37fcc2['closest']?.(".side-plus-btn");
    const _0x487d6c = _0x37fcc2["closest"]?.("#v2-conn-scissor-btn") || _0x37fcc2['closest']?.(".conn-scissor-btn");
    if (!_0x476709 && !_0x487d6c) {
      return;
    }
    if (_0x13d8b0['annotateActive']) {
      return;
    }
    _0x21fecf(_0x554c53, _0x37fcc2);
  }, {
    'passive': ![],
    'capture': !![]
  });
  _0x188262(_0x12b104, "mousedown", _0x4c2b06 => {
    if (_0x4c2b06['button'] === 0x1) {
      _0x4c2b06['preventDefault']();
    }
  });
  return {
    'getCursorScreenPosition': _0x49f1d2["getCursorScreenPosition"],
    'dispose'() {
      _0x20160e["splice"](0x0)["forEach"](_0xb2fc39 => _0xb2fc39());
      _0x1e4428["dispose"]();
    }
  };
}