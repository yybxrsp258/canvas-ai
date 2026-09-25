import { executeCommand } from '../core/interaction.js';
import { RENDERER_VIRTUALIZATION_CONFIG } from '../core/rendererVirtualization.js';
import { liftRendererNodePresentationZIndex } from '../core/rendererNodePresentation.js';
import { getAlignableSelectionNodes, screenToWorld } from '../core/math.js';
import { cancelSelectedGenerateButtons, executeSelectedGenerateButtons, hasActiveSelectedGenerateBatch, hasRunningSelectedGenerateNodes } from '../modules/groupExecution.js';
import { getSelectedMediaComposeKind } from '../modules/mediaComposeSelection.js';
import { hasMaterialComparisonPair } from '../modules/materialComparisonEntries.js';
import { exportSelectedNodesBatch } from '../modules/nodeBatchExport.js';
import { showContextMenu } from '../modules/interaction/contextMenuPresenter.js';
import { stopActiveSyncVideoPlayback, syncPlaySelectedVideos } from '../modules/videoSyncPlayback.js';
import { t } from '../i18n/index.js';
let _inited = ![];
let _guardInstalled = ![];
const LABEL_RENAME_CLICK_THRESHOLD_PX = 0x5;
const NODE_LABEL_RENAMING_CLASS = "is-renaming-label";
const EDGE_SCISSOR_HOVER_DELAY_MS = 0x1f4;
const EDGE_POINTER_HIT_DISABLED_BODY_CLASSES = ['is-panning', "is-dragging", "is-zooming", "is-edge-interaction-lite"];
export function shouldResolvePooledEdgePointerHit({
  target: _0x2f4399,
  canvasEl: _0xbf85b4,
  scissorBtn = null,
  bodyClassList = null
} = {}) {
  if (!_0x2f4399 || !_0xbf85b4) {
    return ![];
  }
  if (_0x2f4399 !== _0xbf85b4 && !_0xbf85b4["contains"]?.(_0x2f4399)) {
    return ![];
  }
  if (EDGE_POINTER_HIT_DISABLED_BODY_CLASSES["some"](_0xc99de4 => bodyClassList?.["contains"]?.(_0xc99de4))) {
    return ![];
  }
  if (scissorBtn && (_0x2f4399 === scissorBtn || scissorBtn["contains"]?.(_0x2f4399))) {
    return ![];
  }
  if (_0x2f4399["closest"]?.("g.connection-group[data-conn-id]")) {
    return ![];
  }
  if (_0x2f4399["closest"]?.(".v2-node")) {
    return ![];
  }
  if (_0x2f4399["closest"]?.('[data-ui-stop=\x221\x22]')) {
    return ![];
  }
  if (_0x2f4399['closest']?.("button")) {
    return ![];
  }
  if (_0x2f4399['closest']?.("input")) {
    return ![];
  }
  if (_0x2f4399["closest"]?.("textarea")) {
    return ![];
  }
  if (_0x2f4399['closest']?.('select')) {
    return ![];
  }
  if (_0x2f4399["closest"]?.("[contenteditable=\"true\"]")) {
    return ![];
  }
  return !![];
}
function _formatNodeLabelText(_0x1fae12) {
  const _0x28420c = String(_0x1fae12 || '')["trim"]();
  if (!_0x28420c) {
    return '';
  }
  const _0x26898b = /^[\x00-\x7F]*$/["test"](_0x28420c);
  if (_0x26898b && _0x28420c["length"] > 0x14) {
    return _0x28420c["slice"](0x0, 0x14) + "...";
  }
  return _0x28420c;
}
function _escapeHtml(_0x4279ba) {
  return String(_0x4279ba || '')["replace"](/[&<>"']/g, _0x5abf27 => {
    if (_0x5abf27 === '&') {
      return "&amp;";
    }
    if (_0x5abf27 === '<') {
      return '&lt;';
    }
    if (_0x5abf27 === '>') {
      return '&gt;';
    }
    if (_0x5abf27 === '\x22') {
      return "&quot;";
    }
    return "&#39;";
  });
}
function _stackHasRendererJs(_0x30baf2) {
  const _0x3ed5e3 = _getGuardCallsite(_0x30baf2);
  if (!_0x3ed5e3) {
    return ![];
  }
  return _0x3ed5e3['includes']('renderer.js') || _0x3ed5e3['includes']("/renderer.js") || _0x3ed5e3["includes"]("\\renderer.js");
}
function _getGuardCallsite(_0x451456) {
  const _0x149694 = String(_0x451456 || '')["split"]('\x0a');
  for (const _0x39d51d of _0x149694) {
    if (!_0x39d51d['includes']("at ")) {
      continue;
    }
    const _0x142a73 = _0x39d51d['match'](/\(([^)]+)\)/);
    const _0x382a4e = (_0x142a73 ? _0x142a73[0x1] : _0x39d51d["replace"](/^\s*at\s+/, ''))["trim"]();
    if (!_0x382a4e['includes']('.js')) {
      continue;
    }
    const _0x5c3532 = _0x382a4e["replace"](/:\d+:\d+$/, '');
    if (_0x5c3532['includes']("rendererUiEvents.js") || _0x5c3532["includes"]("/rendererUiEvents.js") || _0x5c3532['includes']("\\rendererUiEvents.js")) {
      continue;
    }
    return _0x5c3532;
  }
  return '';
}
function _createGuardError() {
  return new Error('[架构守卫]\x20禁止在\x20renderer.js\x20中绑定\x20DOM\x20事件，请迁移到\x20UI\x20层');
}
export function installRendererEventBindingGuard() {
  if (_guardInstalled) {
    return;
  }
  _guardInstalled = !![];
  const _0x5aff47 = EventTarget["prototype"]["addEventListener"];
  EventTarget["prototype"]['addEventListener'] = function (..._0x37f1af) {
    const _0x3c1029 = new Error()["stack"];
    if (_stackHasRendererJs(_0x3c1029)) {
      throw _createGuardError();
    }
    return _0x5aff47['apply'](this, _0x37f1af);
  };
  const _0x3c5ff1 = (_0x502d40, _0x57b2da) => {
    if (!_0x502d40) {
      return;
    }
    const _0xe0fc00 = Object["getOwnPropertyDescriptor"](_0x502d40, _0x57b2da);
    if (!_0xe0fc00 || typeof _0xe0fc00['set'] !== "function") {
      return;
    }
    Object["defineProperty"](_0x502d40, _0x57b2da, {
      'configurable': _0xe0fc00['configurable'],
      'enumerable': _0xe0fc00['enumerable'],
      'get': _0xe0fc00["get"],
      'set'(_0x537773) {
        const _0x3cf161 = new Error()['stack'];
        if (_stackHasRendererJs(_0x3cf161)) {
          throw _createGuardError();
        }
        return _0xe0fc00["set"]["call"](this, _0x537773);
      }
    });
  };
  const _0x5367dc = ["onclick", "onmouseenter", "onmouseleave", "onpointerdown", "onpointerup", "onpointermove"];
  for (const _0x19087f of _0x5367dc) {
    _0x3c5ff1(globalThis["HTMLElement"]?.["prototype"], _0x19087f);
    _0x3c5ff1(globalThis["SVGElement"]?.["prototype"], _0x19087f);
  }
}
export function initRendererUiEvents({
  wrap: _0x16145c,
  store: _0x498920,
  canDeleteEdge = () => !![]
}) {
  if (_inited) {
    return;
  }
  _inited = !![];
  const _0x20f52d = new WeakMap();
  const _0x17afb3 = new Map();
  const _0xf7b9f4 = {
    'ms-align-left': 'left',
    'ms-align-h-center': 'h-center',
    'ms-align-right': 'right',
    'ms-align-top': "top",
    'ms-align-v-center': "v-center",
    'ms-align-bottom': "bottom",
    'ms-distribute-h': 'distribute-h',
    'ms-distribute-v': "distribute-v",
    'ms-arrange-grid': 'arrange-grid'
  };
  let _0x262f74 = null;
  let _0x356fb0 = null;
  let _0x4385b1 = null;
  let _0x9b140b = null;
  let _0x33252f = null;
  let _0x315a62 = null;
  let _0x38c2ca = '';
  let _0x3f863a = null;
  let _0x37d0fa = {
    'x': 0x0,
    'y': 0x0
  };
  const _0x3dafd7 = document["getElementById"]("v2-canvas");
  const _0x5084a3 = !!_0x3dafd7;
  const _0x3ffaad = (_0x11cba0, _0x440deb = null) => typeof canDeleteEdge === "function" ? canDeleteEdge({
    'edgeId': _0x11cba0,
    'event': _0x440deb,
    'store': _0x498920
  }) !== ![] : canDeleteEdge !== ![];
  const _0x3b1248 = ({
    restoreFocus = ![]
  } = {}) => {
    const _0x2df04c = _0x262f74;
    _0x262f74 = null;
    _0x2df04c?.["close"]?.({
      'restoreFocus': restoreFocus
    });
  };
  const _0x49523b = () => {
    _0x3b1248();
    _0x498920?.['setAlignPanelVisible']?.(![]);
  };
  const _0x26e2dc = (_0x2d276e = undefined) => {
    const _0x2ab669 = _0x498920?.["getState"]?.();
    if (_0x2ab669?.['ui']?.["alignFeatureEnabled"] === ![]) {
      _0x49523b();
      return;
    }
    executeCommand("align_nodes", {
      'mode': "arrange-grid",
      'columns': _0x2d276e
    });
  };
  const _0x338800 = (_0x45687f, _0x3cabf4, _0x2b9512) => {
    if (!_0x45687f || _0x45687f["disabled"]) {
      return;
    }
    _0x3b1248();
    _0x45687f["setAttribute"]("aria-expanded", "true");
    let _0x4669d0 = null;
    _0x4669d0 = showContextMenu(_0x3cabf4, _0x2b9512, [{
      'label': t("coreUi.renderer.align.gridAuto"),
      'icon': 'grid',
      'shortcutActionId': "context-align-grid-auto",
      'action': () => _0x26e2dc()
    }, 'sep', ...[0x2, 0x3, 0x4, 0x5]['map'](_0x1d4a63 => ({
      'label': t("coreUi.renderer.align.gridColumns", {
        'count': _0x1d4a63
      }),
      'icon': "grid",
      'shortcutActionId': "context-align-grid-" + _0x1d4a63,
      'action': () => _0x26e2dc(_0x1d4a63)
    }))], {
      'ariaLabel': t("coreUi.renderer.align.gridMenu"),
      'ensureItemIcons': !![],
      'includeNodePicker': ![],
      'restoreTarget': _0x45687f,
      'ownerRoot': _0x45687f["ownerDocument"] || document,
      'ownerElement': _0x45687f,
      'onClose': () => {
        _0x45687f["setAttribute"]('aria-expanded', 'false');
        _0x262f74 === _0x4669d0 && (_0x262f74 = null);
      }
    });
    _0x262f74 = _0x4669d0;
  };
  const _0x2ba4db = _0x37c06a => {
    const _0x1e18a4 = _0x37c06a?.["closest"]?.('.v2-node');
    if (!_0x1e18a4) {
      return '';
    }
    return _0x1e18a4["dataset"]["nodeId"] || _0x1e18a4['id'] || '';
  };
  const _0x2830fa = _0x2d4a9d => {
    if (!_0x2d4a9d) {
      return;
    }
    window['v2Renderer']?.["pinNode"]?.(_0x2d4a9d, "recent-ui");
    const _0x456f86 = _0x17afb3["get"](_0x2d4a9d);
    if (_0x456f86) {
      clearTimeout(_0x456f86);
    }
    const _0x270538 = setTimeout(() => {
      _0x17afb3["delete"](_0x2d4a9d);
      window["v2Renderer"]?.['unpinNode']?.(_0x2d4a9d, 'recent-ui');
    }, RENDERER_VIRTUALIZATION_CONFIG["recentPinMs"]);
    _0x17afb3["set"](_0x2d4a9d, _0x270538);
  };
  const _0xab504a = _0x527ed4 => {
    if (!_0x527ed4) {
      return;
    }
    window["v2Renderer"]?.['pinNode']?.(_0x527ed4, "focus");
  };
  const _0x5a995d = (_0x1a1e76, _0x5383ea) => {
    if (!_0x1a1e76 || !_0x5383ea) {
      return;
    }
    _0x3f863a && (clearTimeout(_0x3f863a), _0x3f863a = null);
    _0x38c2ca && _0x38c2ca !== _0x5383ea && window['v2Renderer']?.["flushNode"]?.(_0x38c2ca);
    _0x38c2ca = _0x5383ea;
    liftRendererNodePresentationZIndex(_0x1a1e76, "180");
  };
  const _0x1de087 = (_0x5de6b9, _0x566a34) => {
    if (!_0x566a34) {
      return;
    }
    if (_0x3f863a) {
      clearTimeout(_0x3f863a);
    }
    _0x3f863a = setTimeout(() => {
      _0x3f863a = null;
      const _0x26ec46 = document["activeElement"];
      if (_0x5de6b9 && _0x26ec46 && _0x5de6b9["contains"](_0x26ec46)) {
        return;
      }
      window["v2Renderer"]?.['unpinNode']?.(_0x566a34, 'focus');
      _0x38c2ca === _0x566a34 && (_0x38c2ca = '', window['v2Renderer']?.["flushNode"]?.(_0x566a34));
    }, 0x4b0);
  };
  const _0x2abc91 = (_0xd0f94f, _0x2b1700) => {
    window["v2Renderer"]?.["setEdgeInteractionHighlight"]?.(_0xd0f94f, _0x2b1700);
    const _0x2107cd = document["querySelector"]("g.connection-group[data-conn-id=\"" + _0xd0f94f + '\x22]');
    _0x2107cd && (_0x2b1700 ? _0x2107cd['classList']["add"]("connection-highlighted") : _0x2107cd["classList"]["remove"]('connection-highlighted'));
  };
  const _0x96eda9 = (_0x38cf49, _0xc1c738) => {
    window['v2Renderer']?.["setHoveredEdge"]?.(_0x38cf49, _0xc1c738);
  };
  const _0x2a64e9 = ({
    preserveHover = ![]
  } = {}) => {
    clearTimeout(_0x33252f);
    clearTimeout(_0x315a62);
    _0x33252f = null;
    _0x315a62 = null;
    _0x9b140b && _0x2abc91(_0x9b140b, ![]);
    !preserveHover && _0x4385b1 && (_0x96eda9(_0x4385b1, ![]), _0x4385b1 = null);
    _0x9b140b = null;
    if (_0x356fb0) {
      _0x356fb0['style']["display"] = "none";
    }
  };
  const _0x14469a = () => {
    if (_0x356fb0) {
      return _0x356fb0;
    }
    _0x356fb0 = document["createElement"]('div');
    _0x356fb0['id'] = "v2-conn-scissor-btn";
    _0x356fb0["className"] = "conn-scissor-btn";
    const _0x5a9c37 = "http://www.w3.org/2000/svg";
    const _0x35e892 = document["createElementNS"](_0x5a9c37, "svg");
    _0x35e892["setAttribute"]("width", '16');
    _0x35e892["setAttribute"]("height", '16');
    _0x35e892["setAttribute"]("viewBox", "0 0 24 24");
    _0x35e892['setAttribute']("fill", "none");
    _0x35e892['setAttribute']("stroke", "currentColor");
    _0x35e892["setAttribute"]("stroke-width", '2.5');
    _0x35e892["setAttribute"]("stroke-linecap", "round");
    _0x35e892['setAttribute']("stroke-linejoin", "round");
    const _0x1616a3 = document["createElementNS"](_0x5a9c37, "circle");
    _0x1616a3["setAttribute"]('cx', '6');
    _0x1616a3["setAttribute"]('cy', '6');
    _0x1616a3["setAttribute"]('r', '3');
    const _0x14595e = document['createElementNS'](_0x5a9c37, "circle");
    _0x14595e["setAttribute"]('cx', '6');
    _0x14595e["setAttribute"]('cy', '18');
    _0x14595e["setAttribute"]('r', '3');
    const _0x2155ca = document["createElementNS"](_0x5a9c37, "line");
    _0x2155ca["setAttribute"]('x1', '20');
    _0x2155ca["setAttribute"]('y1', '4');
    _0x2155ca["setAttribute"]('x2', "8.12");
    _0x2155ca["setAttribute"]('y2', "15.88");
    const _0x2c9803 = document["createElementNS"](_0x5a9c37, "line");
    _0x2c9803["setAttribute"]('x1', '14.47');
    _0x2c9803["setAttribute"]('y1', "14.48");
    _0x2c9803['setAttribute']('x2', '20');
    _0x2c9803["setAttribute"]('y2', '20');
    const _0xbf29a5 = document["createElementNS"](_0x5a9c37, "line");
    _0xbf29a5["setAttribute"]('x1', "8.12");
    _0xbf29a5['setAttribute']('y1', "8.12");
    _0xbf29a5['setAttribute']('x2', '12');
    _0xbf29a5["setAttribute"]('y2', '12');
    _0x35e892['appendChild'](_0x1616a3);
    _0x35e892["appendChild"](_0x14595e);
    _0x35e892['appendChild'](_0x2155ca);
    _0x35e892["appendChild"](_0x2c9803);
    _0x35e892["appendChild"](_0xbf29a5);
    _0x356fb0["appendChild"](_0x35e892);
    _0x356fb0["style"]["position"] = _0x5084a3 ? 'absolute' : "fixed";
    _0x356fb0['style']["display"] = "none";
    _0x356fb0["style"]['zIndex'] = _0x5084a3 ? '9' : '90';
    _0x356fb0["style"]['transform'] = "translate(-50%, -50%)";
    _0x356fb0["style"]["pointerEvents"] = "auto";
    (_0x3dafd7 || document["body"])['appendChild'](_0x356fb0);
    _0x356fb0["addEventListener"]("pointerdown", _0x34c199 => _0x34c199["stopPropagation"]());
    _0x356fb0["addEventListener"]("click", _0x7e62ea => {
      _0x7e62ea["stopPropagation"]();
      _0x9b140b && _0x3ffaad(_0x9b140b, _0x7e62ea) && (executeCommand("delete_edge", {
        'id': _0x9b140b
      }), _0x2a64e9());
    });
    _0x356fb0["addEventListener"]("mouseenter", () => {
      clearTimeout(_0x315a62);
      _0x315a62 = null;
    });
    _0x356fb0["addEventListener"]('mouseleave', () => {
      _0x2a64e9();
    });
    return _0x356fb0;
  };
  const _0x12f6a4 = (_0x3522e7, _0x43bb10) => {
    const _0x1411df = _0x14469a();
    if (_0x5084a3) {
      const _0x673d54 = _0x498920?.["getStateRaw"]?.()?.['viewport'] || _0x498920?.["getState"]?.()?.["viewport"] || {};
      const _0x2064ec = screenToWorld(_0x3522e7, _0x43bb10, _0x673d54);
      _0x1411df['style']["left"] = _0x2064ec['x'] + 'px';
      _0x1411df["style"]["top"] = _0x2064ec['y'] + 'px';
      return;
    }
    _0x1411df['style']["left"] = _0x3522e7 + 'px';
    _0x1411df['style']["top"] = _0x43bb10 + 'px';
  };
  const _0x4df343 = (_0x4c58e0, _0x30002c = null) => {
    if (!_0x4c58e0) {
      return;
    }
    if (_0x4385b1 === _0x4c58e0) {
      return;
    }
    _0x4385b1 && _0x96eda9(_0x4385b1, ![]);
    if (_0x9b140b && _0x9b140b !== _0x4c58e0) {
      _0x2abc91(_0x9b140b, ![]);
      _0x9b140b = null;
      if (_0x356fb0) {
        _0x356fb0["style"]["display"] = "none";
      }
    }
    _0x4385b1 = _0x4c58e0;
    _0x96eda9(_0x4c58e0, !![]);
    if (!_0x3ffaad(_0x4c58e0, _0x30002c)) {
      _0x2a64e9({
        'preserveHover': !![]
      });
      return;
    }
    clearTimeout(_0x33252f);
    clearTimeout(_0x315a62);
    _0x315a62 = null;
    _0x14469a();
    _0x33252f = setTimeout(() => {
      _0x4385b1 === _0x4c58e0 && (_0x9b140b = _0x4c58e0, _0x2abc91(_0x4c58e0, !![]), _0x12f6a4(_0x37d0fa['x'], _0x37d0fa['y']), _0x356fb0["style"]['display'] = 'flex');
    }, EDGE_SCISSOR_HOVER_DELAY_MS);
  };
  const _0x52929d = (_0x50d197, _0x56b4d6) => {
    if (_0x356fb0 && _0x56b4d6 && (_0x56b4d6 === _0x356fb0 || _0x356fb0['contains'](_0x56b4d6))) {
      return;
    }
    _0x96eda9(_0x50d197, ![]);
    if (_0x4385b1 === _0x50d197) {
      _0x4385b1 = null;
    }
    clearTimeout(_0x33252f);
    _0x33252f = null;
    if (_0x9b140b !== _0x50d197) {
      return;
    }
    _0x315a62 = setTimeout(() => {
      if (_0x9b140b === _0x50d197) {
        _0x2a64e9();
      }
    }, 0x64);
  };
  _0x498920?.["subscribeRaw"] && _0x498920["subscribeRaw"](_0x1e20a9 => {
    if (!_0x9b140b) {
      return;
    }
    if (!_0x1e20a9?.["edges"]?.[_0x9b140b]) {
      _0x2a64e9();
    }
  });
  document["addEventListener"]('pointerdown', _0x371e07 => {
    const _0x16ee33 = _0x2ba4db(_0x371e07["target"]);
    if (_0x16ee33) {
      _0x2830fa(_0x16ee33);
    }
    const _0x477d25 = _0x371e07["target"]?.["closest"]?.('.node-label[contenteditable=\x22true\x22]');
    if (_0x477d25) {
      _0x371e07['stopPropagation']();
    }
  }, !![]);
  document["addEventListener"]("focusin", _0xce57fd => {
    const _0x535c54 = _0xce57fd["target"]?.['closest']?.(".v2-node");
    const _0x52a8ec = _0x535c54?.["dataset"]?.["nodeId"] || _0x535c54?.['id'] || '';
    _0x52a8ec && (_0xab504a(_0x52a8ec), _0x5a995d(_0x535c54, _0x52a8ec));
  }, !![]);
  document["addEventListener"]("focusout", _0xdce5f8 => {
    const _0x1e9611 = _0xdce5f8["target"]?.['closest']?.(".v2-node");
    const _0x42608a = _0x1e9611?.["dataset"]?.["nodeId"] || _0x1e9611?.['id'] || '';
    if (_0x42608a) {
      _0x1de087(_0x1e9611, _0x42608a);
    }
  }, !![]);
  document["addEventListener"]('pointerdown', _0x32c5ca => {
    const _0x2f5eb5 = _0x32c5ca['target']?.["closest"]?.(".node-label[data-node-id]");
    if (!_0x2f5eb5) {
      return;
    }
    if (_0x2f5eb5['getAttribute']('contenteditable') === "true") {
      _0x32c5ca['stopPropagation']();
      return;
    }
    _0x20f52d["set"](_0x2f5eb5, {
      'x': _0x32c5ca["clientX"],
      'y': _0x32c5ca["clientY"]
    });
  });
  document["addEventListener"]("keyup", _0x441dfa => {
    if (_0x441dfa["key"] === 'Control') {
      _0x2a64e9();
    }
  });
  document["addEventListener"]("click", _0x569403 => {
    const _0x5c0ff4 = _0x569403["target"]?.["closest"]?.(".v2-pick-connect-banner [data-ui-action=\"exit-pick-connect\"]");
    if (_0x5c0ff4) {
      _0x569403['stopPropagation']();
      executeCommand("set_pick_connect_mode", {
        'active': ![]
      });
      return;
    }
    const _0x155fe3 = _0x569403['target']?.["closest"]?.("#v2-picker button[data-node-type]");
    if (_0x155fe3) {
      _0x569403["stopPropagation"]();
      const _0x283f41 = _0x498920?.["getState"]?.();
      const _0x206f7f = _0x283f41?.["picker"];
      const _0xa1496a = _0x155fe3["dataset"]["nodeType"];
      const _0x392489 = Number(_0x155fe3["dataset"]["width"]) || 0x12c;
      const _0x48f578 = Number(_0x155fe3["dataset"]["height"]) || 0x12c;
      const _0x280725 = _0x155fe3["dataset"]['defaultLabel'] || t('coreUi.renderer.defaultNodeNames.node');
      _0x206f7f && _0x206f7f["visible"] && (executeCommand("create_node", {
        'type': _0xa1496a,
        'x': _0x206f7f['x'],
        'y': _0x206f7f['y'],
        'width': _0x392489,
        'height': _0x48f578,
        'label': _0x280725,
        'content': ''
      }), executeCommand("hide_picker"));
      return;
    }
    const _0x56d729 = _0x569403["target"]?.['closest']?.("#v2-align-center-panel button[data-ui-action]");
    if (_0x56d729) {
      _0x569403["stopPropagation"]();
      if (_0x56d729["disabled"]) {
        return;
      }
      const _0x1a0ea1 = _0xf7b9f4[_0x56d729["dataset"]['uiAction']];
      if (!_0x1a0ea1) {
        return;
      }
      const _0x437be1 = _0x498920?.['getState']?.();
      if (_0x437be1?.['ui']?.["alignFeatureEnabled"] === ![]) {
        _0x49523b();
        return;
      }
      executeCommand("align_nodes", {
        'mode': _0x1a0ea1
      });
      return;
    }
    const _0x3467d8 = _0x569403["target"]?.["closest"]?.(".v2-multi-select-tab button[data-ui-action]");
    if (_0x3467d8) {
      _0x569403["stopPropagation"]();
      if (_0x3467d8['disabled']) {
        return;
      }
      const _0x4a1fe3 = _0x3467d8['dataset']["uiAction"];
      if (_0x4a1fe3 === "ms-sync-video-play") {
        if (stopActiveSyncVideoPlayback()) {
          return;
        }
        const _0x39f404 = _0x498920?.["getState"]?.();
        const _0x531bf2 = _0x39f404?.['selectedNodeIds'] || [];
        _0x531bf2["length"] >= 0x2 && void syncPlaySelectedVideos({
          'selectedIds': _0x531bf2,
          'state': _0x39f404,
          'loop': _0x569403["shiftKey"] === !![],
          'shouldStopOnPointerEvent': _0x3626aa => _0x3626aa?.['target']?.['closest']?.('.v2-multi-select-tab\x20button[data-ui-action=\x22ms-sync-video-play\x22]') !== _0x3467d8
        });
        return;
      }
      if (_0x4a1fe3 === "ms-run-selected") {
        const _0x1d8ecd = _0x498920?.["getState"]?.();
        const _0x4706ea = _0x1d8ecd?.["selectedNodeIds"] || [];
        const _0x15b594 = _0x279955 => {
          const _0x232dae = _0x498920?.["getState"]?.();
          const _0x4f791c = _0x279955 || hasRunningSelectedGenerateNodes(_0x232dae?.["nodes"] || {}, _0x232dae?.["selectedNodeIds"] || _0x4706ea);
          const _0x37f309 = _0x4f791c ? t('groupExecution.stopSelected') : t('coreUi.renderer.multiSelect.runSelected');
          _0x3467d8["dataset"]["batchActive"] = String(_0x4f791c);
          _0x3467d8["dataset"]["tooltip"] = _0x37f309;
          _0x3467d8['setAttribute']("aria-label", _0x37f309);
          _0x3467d8['setAttribute']('aria-busy', String(_0x4f791c));
          _0x3467d8["classList"]["toggle"]("is-active", _0x4f791c);
        };
        if (hasActiveSelectedGenerateBatch() || hasRunningSelectedGenerateNodes(_0x1d8ecd?.["nodes"] || {}, _0x4706ea)) {
          cancelSelectedGenerateButtons({
            'selectedIds': _0x4706ea,
            'state': _0x1d8ecd
          });
          _0x15b594(![]);
          return;
        }
        _0x4706ea["length"] > 0x0 && executeSelectedGenerateButtons({
          'selectedIds': _0x4706ea,
          'state': _0x1d8ecd,
          'onStateChange': _0x15b594
        });
        return;
      }
      if (_0x4a1fe3 === "ms-asset") {
        const _0x1106ce = _0x498920?.["getState"]?.()?.["selectedNodeIds"] || [];
        _0x1106ce["length"] > 0x0 && import("../modules/AssetManager.js")['then'](({
          assetManager: _0x534005
        }) => {
          _0x534005["showLibrarySavePanel"]([..._0x1106ce], _0x3467d8);
        });
        return;
      }
      if (_0x4a1fe3 === "ms-batch-download") {
        const _0x28e2a9 = _0x498920?.["getState"]?.() || {};
        void exportSelectedNodesBatch({
          'state': _0x28e2a9
        });
        return;
      }
      if (_0x4a1fe3 === "ms-group") {
        const _0x464c90 = _0x498920?.["getState"]?.()?.["selectedNodeIds"] || [];
        _0x464c90["length"] >= 0x2 && executeCommand("group", {
          'ids': _0x464c90
        });
        return;
      }
      if (_0x4a1fe3 === "ms-material-comparison") {
        const _0x498e76 = _0x498920?.["getState"]?.() || {};
        const _0x519716 = _0x498e76["selectedNodeIds"] || [];
        const _0x2e59d4 = _0x519716["map"](_0x240a4a => _0x498e76["nodes"]?.[_0x240a4a])["filter"](Boolean);
        if (!hasMaterialComparisonPair(_0x2e59d4)) {
          return;
        }
        _0x3467d8['disabled'] = !![];
        _0x3467d8["classList"]['add']("is-loading");
        _0x3467d8["setAttribute"]('aria-busy', 'true');
        import('../modules/materialComparison.js')['then'](({
          openMaterialComparison: _0x27eea1
        }) => {
          _0x27eea1(_0x2e59d4);
        })["catch"](() => {
          globalThis["window"]?.['showToast']?.(t("canvasInteraction.toasts.materialComparisonFailed"), 'error');
        })["finally"](() => {
          _0x3467d8["disabled"] = ![];
          _0x3467d8["classList"]["remove"]("is-loading");
          _0x3467d8['setAttribute']("aria-busy", "false");
        });
        return;
      }
      if (_0x4a1fe3 === 'ms-create-collage') {
        const _0xc5128b = _0x498920?.['getState']?.()?.['selectedNodeIds'] || [];
        _0xc5128b["length"] >= 0x2 && executeCommand("create_collage_from_selection", {
          'ids': _0xc5128b
        });
        return;
      }
      if (_0x4a1fe3 === "ms-compose-video") {
        const _0x305877 = _0x498920?.["getState"]?.();
        const _0x913e07 = _0x305877?.["selectedNodeIds"] || [];
        _0x913e07["length"] >= 0x2 && import('../modules/VideoComposeController.js')["then"](({
          composeSelectedAudios: _0x38d787,
          composeSelectedVideos: _0x91947c
        }) => {
          const _0x357824 = getSelectedMediaComposeKind(_0x305877?.["nodes"] || {}, _0x913e07) || _0x3467d8["dataset"]["composeKind"];
          _0x357824 === 'audio' ? _0x38d787(_0x913e07, _0x3467d8) : _0x91947c(_0x913e07, _0x3467d8);
        });
        return;
      }
      if (_0x4a1fe3 === "ms-reset-image-size") {
        const _0x5c10d2 = _0x498920?.["getState"]?.()?.["selectedNodeIds"] || [];
        _0x5c10d2['length'] > 0x0 && executeCommand("reset_source_media_size", {
          'ids': _0x5c10d2
        });
        return;
      }
      return;
    }
    !_0x569403['target']?.["closest"]?.("#v2-align-center-panel") && _0x49523b();
    const _0x329346 = _0x569403["target"]?.["closest"]?.(".node-label[data-node-id]");
    if (_0x329346) {
      if (_0x329346["getAttribute"]("contenteditable") === "true") {
        return;
      }
      const _0xe4f7a4 = _0x20f52d["get"](_0x329346) || {
        'x': _0x569403["clientX"],
        'y': _0x569403["clientY"]
      };
      const _0x1717f3 = _0x569403['clientX'] - _0xe4f7a4['x'];
      const _0x42e193 = _0x569403["clientY"] - _0xe4f7a4['y'];
      if (Math['sqrt'](_0x1717f3 * _0x1717f3 + _0x42e193 * _0x42e193) > LABEL_RENAME_CLICK_THRESHOLD_PX) {
        return;
      }
      _0x569403['stopPropagation']();
      const _0x3d7c7e = _0x329346['dataset']["defaultName"] || t("app.sourceDefaults.node");
      const _0x4e09a5 = _0x329346["dataset"]["fullName"] || '';
      const _0x2c4b94 = _0x329346["closest"](".v2-node");
      _0x329346['textContent'] = _0x4e09a5 || _0x3d7c7e;
      _0x329346["contentEditable"] = "true";
      if (_0x2c4b94) {
        _0x2c4b94["classList"]["add"](NODE_LABEL_RENAMING_CLASS);
      }
      _0x329346["focus"]();
    }
  });
  document["addEventListener"]("contextmenu", _0x2832ea => {
    const _0x52d122 = _0x2832ea['target']?.["closest"]?.("#v2-align-center-panel button[data-ui-action=\"ms-arrange-grid\"]");
    if (!_0x52d122) {
      return;
    }
    _0x2832ea['preventDefault']();
    _0x2832ea["stopPropagation"]();
    _0x2832ea["stopImmediatePropagation"]?.();
    _0x338800(_0x52d122, _0x2832ea["clientX"], _0x2832ea["clientY"]);
  }, !![]);
  document["addEventListener"]("keydown", _0x1e9647 => {
    const _0x439e1f = _0x1e9647['target']?.["closest"]?.("#v2-align-center-panel button[data-ui-action=\"ms-arrange-grid\"]");
    const _0x2882f6 = _0x1e9647["key"] === "ArrowDown" || _0x1e9647["key"] === "ContextMenu" || _0x1e9647['key'] === "F10" && _0x1e9647["shiftKey"];
    if (_0x439e1f && _0x2882f6) {
      _0x1e9647["preventDefault"]();
      _0x1e9647['stopPropagation']();
      const _0x3832bb = _0x439e1f["getBoundingClientRect"]();
      _0x338800(_0x439e1f, _0x3832bb['left'] + _0x3832bb["width"] / 0x2, _0x3832bb["bottom"] + 0x8);
      return;
    }
    const _0x35d57c = _0x1e9647["target"]?.["closest"]?.(".node-label[data-node-id]");
    if (!_0x35d57c) {
      return;
    }
    if (_0x35d57c['getAttribute']("contenteditable") !== "true") {
      return;
    }
    _0x1e9647["key"] === 'Enter' && (_0x1e9647["preventDefault"](), _0x35d57c["blur"]());
  });
  document["addEventListener"]("focusout", _0x3325c2 => {
    const _0x25b6ae = _0x3325c2["target"]?.['closest']?.(".node-label[data-node-id]");
    if (!_0x25b6ae) {
      return;
    }
    if (_0x25b6ae['getAttribute']("contenteditable") !== "true") {
      return;
    }
    const _0x38034e = _0x25b6ae["dataset"]["defaultName"] || t("app.sourceDefaults.node");
    const _0x28db9d = _0x25b6ae["dataset"]["nodeId"];
    const _0x488c56 = _0x25b6ae["dataset"]['isBeta'] === '1';
    const _0x272dc8 = _0x25b6ae["closest"](".v2-node");
    const _0x286426 = _0x25b6ae['innerText']["trim"]()["replace"](/Beta\s*$/i, '')["trim"]() || _0x38034e;
    _0x25b6ae['contentEditable'] = 'false';
    if (_0x272dc8) {
      _0x272dc8["classList"]['remove'](NODE_LABEL_RENAMING_CLASS);
    }
    if (_0x28db9d) {
      executeCommand('rename_node', {
        'id': _0x28db9d,
        'name': _0x286426
      });
    }
    const _0x312109 = _formatNodeLabelText(_0x286426);
    _0x25b6ae['dataset']["fullName"] = _0x286426;
    _0x25b6ae["title"] = _0x286426 || t("app.nodeLabel.renameTooltip");
    if (_0x488c56) {
      _0x25b6ae["replaceChildren"]();
      _0x25b6ae["appendChild"](document['createTextNode'](_0x312109 || _0x38034e));
      const _0x163116 = document["createElement"]("span");
      _0x163116["className"] = 'v2-node-beta-pill';
      _0x163116["textContent"] = "Beta";
      _0x25b6ae['appendChild'](_0x163116);
    } else {
      _0x25b6ae['textContent'] = _0x312109 || _0x38034e;
    }
  });
  document['addEventListener']("pointerover", _0x235118 => {
    const _0x5b3b1d = _0x235118["target"]?.["closest"]?.("g.connection-group[data-conn-id]");
    if (_0x5b3b1d) {
      if (_0x235118["relatedTarget"] && _0x5b3b1d['contains'](_0x235118["relatedTarget"])) {
        return;
      }
      const _0x1a7a2c = _0x5b3b1d['getAttribute']("data-conn-id");
      _0x4df343(_0x1a7a2c, _0x235118);
      return;
    }
    const _0x23acce = _0x235118['target']?.['closest']?.("#v2-picker button[data-node-type]");
    if (_0x23acce) {
      _0x23acce["style"]["background"] = 'var(--blue-25)';
      return;
    }
  });
  document["addEventListener"]("pointerout", _0x236140 => {
    const _0x466263 = _0x236140['target']?.["closest"]?.('g.connection-group[data-conn-id]');
    if (_0x466263) {
      if (_0x236140['relatedTarget'] && _0x466263["contains"](_0x236140["relatedTarget"])) {
        return;
      }
      _0x52929d(_0x466263['getAttribute']("data-conn-id"), _0x236140['relatedTarget']);
      return;
    }
    const _0x519d53 = _0x236140["target"]?.["closest"]?.("#v2-picker button[data-node-type]");
    if (_0x519d53) {
      _0x519d53["style"]['background'] = 'var(--blue-10)';
      return;
    }
  });
  document["addEventListener"]('pointermove', _0x37447c => {
    _0x37d0fa['x'] = _0x37447c['clientX'];
    _0x37d0fa['y'] = _0x37447c["clientY"];
    const _0x95550b = _0x37447c["target"]?.["closest"]?.("g.connection-group[data-conn-id]");
    const _0x19594d = _0x356fb0 && (_0x37447c["target"] === _0x356fb0 || _0x356fb0["contains"]?.(_0x37447c["target"]));
    if (_0x95550b) {
      _0x4df343(_0x95550b['getAttribute']('data-conn-id'), _0x37447c);
    } else {
      if (!_0x19594d) {
        const _0x42ca7d = shouldResolvePooledEdgePointerHit({
          'target': _0x37447c['target'],
          'canvasEl': _0x3dafd7,
          'scissorBtn': _0x356fb0,
          'bodyClassList': document["body"]?.["classList"]
        });
        const _0x4abf3f = _0x42ca7d ? window["v2Renderer"]?.['hitTestEdgeAtScreenPoint']?.(_0x37447c["clientX"], _0x37447c['clientY']) || '' : '';
        if (_0x4abf3f) {
          _0x4df343(_0x4abf3f, _0x37447c);
        } else {
          _0x4385b1 && _0x52929d(_0x4385b1, _0x37447c["relatedTarget"]);
        }
      }
    }
    if (!_0x9b140b || !_0x356fb0 || _0x356fb0["style"]["display"] === 'none') {
      return;
    }
    _0x12f6a4(_0x37447c["clientX"], _0x37447c["clientY"]);
  });
  _0x16145c?.['addEventListener']?.("pointerdown", _0x2e5a80 => {
    const _0x4d14cd = _0x2e5a80["target"]?.["closest"]?.('[data-ui-stop=\x221\x22]');
    if (_0x4d14cd) {
      _0x2e5a80["stopPropagation"]();
    }
  });
  window['addEventListener']("v2-align-feature-changed", () => {
    _0x49523b();
  });
  _0x498920?.["subscribeSelector"]?.(_0x117e4d => ({
    'enabled': _0x117e4d?.['ui']?.["alignFeatureEnabled"] !== ![],
    'alignableCount': getAlignableSelectionNodes(_0x117e4d?.["nodes"] || {}, Array['isArray'](_0x117e4d?.['selectedNodeIds']) ? _0x117e4d["selectedNodeIds"] : [])['length']
  }), ({
    enabled: _0x4b3fab,
    alignableCount: _0x4e9a35
  }) => {
    (!_0x4b3fab || _0x4e9a35 < 0x2) && _0x49523b();
  });
}