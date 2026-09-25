import { getShortcutLabelByAction } from './settingsShared.js';
import { runCircularRevealTransition } from '../../utils/circularRevealTransition.js';
import { resolveRendererVirtualizationTier } from '../../core/rendererVirtualization.js';
import { t } from '../../i18n/index.js';
import { initViewportCursor } from '../viewportCursor.js';
import { CANVAS_TOOLBAR_PLACEMENT_EVENT, normalizeCanvasToolbarPlacement } from '../canvasToolbarPlacement.js';
const FONT_SIZE_MAP = {
  'small': "16px",
  'medium': "21px",
  'large': '26px'
};
const BASE_APP_THEMES = new Set(["dark", "light"]);
const APP_THEME_PRESET_STORAGE_KEY = "v2-app-theme-preset";
const APP_THEME_PRESETS = new Set(["dusk", "dawn", 'day']);
const CURSOR_SIZE_STORAGE_KEY = "v2-cursor-style";
const CURSOR_SIZES = new Set(["small", "medium", "large"]);
const CURSOR_ASSET_PATH = "./images/cursors/windows11-concept-v2/";
const CURSOR_ASSET_FALLBACK_ROOT = "../images/cursors/windows11-concept-v2";
const PROMPT_ACTION_SURFACES = new Set(["transparent", "themed"]);
const LEFT_SIDEBAR_KEYBOARD_FOCUS_CLASS = 'left-sidebar-keyboard-focus';
const LEFT_SIDEBAR_REVEAL_GUARD_CLASS = 'left-sidebar-auto-hide-revealing';
const LEFT_SIDEBAR_REVEAL_GUARD_MS = 0x168;
let leftSidebarAutoHideFocusModeDocument = null;
let leftSidebarRevealGuardTimer = 0x0;
const CURSOR_ROLE_MAP = {
  '--pointer-cursor': {
    'file': "pointer",
    'fallback': "default"
  },
  '--link-cursor': {
    'file': "link",
    'fallback': 'pointer'
  },
  '--grab-cursor': {
    'file': "move",
    'fallback': "grab"
  },
  '--grabbing-cursor': {
    'file': "move",
    'fallback': "grabbing"
  },
  '--text-cursor': {
    'file': "beam",
    'fallback': 'text'
  },
  '--precision-cursor': {
    'file': "precision",
    'fallback': "crosshair"
  },
  '--move-cursor': {
    'file': 'move',
    'fallback': "move"
  },
  '--help-cursor': {
    'file': "help",
    'fallback': "help"
  },
  '--unavailable-cursor': {
    'file': "unavailable",
    'fallback': "not-allowed"
  },
  '--resize-ns-cursor': {
    'file': "vert",
    'fallback': "ns-resize"
  },
  '--resize-ew-cursor': {
    'file': 'horz',
    'fallback': "ew-resize"
  },
  '--resize-nwse-cursor': {
    'file': 'dgn1',
    'fallback': 'nwse-resize'
  },
  '--resize-nesw-cursor': {
    'file': "dgn2",
    'fallback': "nesw-resize"
  },
  '--alternate-cursor': {
    'file': "alternate",
    'fallback': "default"
  },
  '--handwriting-cursor': {
    'file': "handwriting",
    'fallback': "default"
  },
  '--pin-cursor': {
    'file': "pin",
    'fallback': 'pointer'
  },
  '--person-cursor': {
    'file': "person",
    'fallback': "pointer"
  }
};
const CURSOR_ANIMATED_ROLE_MAP = {
  '--wait-cursor': {
    'file': "busy.ani",
    'fallback': "wait"
  },
  '--progress-cursor': {
    'file': "working.ani",
    'fallback': "progress"
  }
};
function shouldBypassThemeRevealTransition(_0x395773) {
  let _0x5c6bd9 = null;
  try {
    _0x5c6bd9 = _0x395773?.() || null;
  } catch {
    _0x5c6bd9 = null;
  }
  return resolveRendererVirtualizationTier({
    'viewport': _0x5c6bd9?.["viewport"],
    'nodeCount': _0x5c6bd9?.["nodeCount"]
  }) === 'very-dense-low-zoom';
}
function runThemeRevealTransition(_0x2a4b82, _0x18910a, {
  getCanvasPresentationContext = null
} = {}) {
  if (shouldBypassThemeRevealTransition(getCanvasPresentationContext)) {
    _0x18910a();
    return null;
  }
  return runCircularRevealTransition({
    'event': _0x2a4b82,
    'apply': _0x18910a,
    'rootClassName': "theme-reveal-transitioning"
  });
}
function normalizeBaseAppTheme(_0x5e77a7) {
  return BASE_APP_THEMES["has"](_0x5e77a7) ? _0x5e77a7 : 'dark';
}
function normalizeAppThemePreset(_0x13d846) {
  return APP_THEME_PRESETS["has"](_0x13d846) ? _0x13d846 : "dusk";
}
function normalizeCursorSize(_0x261ca6) {
  return CURSOR_SIZES["has"](_0x261ca6) ? _0x261ca6 : 'small';
}
function getBaseThemeForPreset(_0x116100) {
  return normalizeAppThemePreset(_0x116100) === "day" ? "light" : 'dark';
}
function isLightCanvasPreset(_0x4c96c1) {
  return normalizeAppThemePreset(_0x4c96c1) !== 'dusk';
}
function getCursorThemeForPreset(_0x4fdaca) {
  return normalizeAppThemePreset(_0x4fdaca) === "day" ? 'dark' : 'light';
}
function getCursorFallbackPreset() {
  return normalizeAppThemePreset(localStorage["getItem"](APP_THEME_PRESET_STORAGE_KEY));
}
function resolveCursorAssetRoot() {
  const _0x409688 = String(globalThis["document"]?.["baseURI"] || '')["trim"]();
  if (!_0x409688) {
    return CURSOR_ASSET_FALLBACK_ROOT;
  }
  try {
    return new URL(CURSOR_ASSET_PATH, _0x409688)["href"]["replace"](/\/$/, '');
  } catch {
    return CURSOR_ASSET_FALLBACK_ROOT;
  }
}
function applyCursorStyle({
  size: _0x42361f,
  preset: _0x2e1522
} = {}) {
  const _0x2fa56e = normalizeCursorSize(_0x42361f || localStorage["getItem"](CURSOR_SIZE_STORAGE_KEY));
  const _0x24e280 = getCursorThemeForPreset(_0x2e1522 || getCursorFallbackPreset());
  const _0x2f9132 = resolveCursorAssetRoot();
  const _0x3b80e4 = document['documentElement'];
  Object['entries'](CURSOR_ROLE_MAP)['forEach'](([_0x2c8875, _0x19e639]) => {
    const _0x2c7c2e = _0x2fa56e === "small" ? [_0x2fa56e] : [_0x2fa56e, "small"];
    const _0x2d13db = _0x2c7c2e["map"](_0xc10045 => "url('" + _0x2f9132 + '/' + _0x24e280 + '/' + _0x19e639["file"] + '-' + _0xc10045 + ".cur')");
    if (_0x2c8875 === '--pointer-cursor') {
      _0x3b80e4["style"]['setProperty']("--pointer-cursor-image", _0x2d13db[0x0]);
    }
    _0x3b80e4['style']['setProperty'](_0x2c8875, [_0x2d13db[0x0], ...(_0x2d13db[0x1] ? ["var(--viewport-edge-cursor, " + _0x2d13db[0x1] + ')'] : []), _0x19e639["fallback"]]["join"](',\x20'));
  });
  Object['entries'](CURSOR_ANIMATED_ROLE_MAP)['forEach'](([_0x45758e, _0x323eb9]) => {
    _0x3b80e4['style']['setProperty'](_0x45758e, "url('" + _0x2f9132 + '/' + _0x24e280 + '/' + _0x323eb9['file'] + "'), " + _0x323eb9["fallback"]);
  });
  initViewportCursor()?.['preload'](_0x2fa56e === "small" ? [] : Object["keys"](CURSOR_ROLE_MAP)["map"](_0x1db4f8 => _0x3b80e4["style"]['getPropertyValue'](_0x1db4f8)));
}
function getUiStoreTheme(_0x401462) {
  try {
    const _0x1a4061 = _0x401462?.["getStateRaw"]?.() || _0x401462?.["getState"]?.() || {};
    return normalizeBaseAppTheme(_0x1a4061["theme"]);
  } catch {
    return "dark";
  }
}
function getSavedAppThemePreset(_0x3d7157) {
  const _0x4f396d = normalizeAppThemePreset(localStorage["getItem"](APP_THEME_PRESET_STORAGE_KEY));
  const _0x1cd141 = getUiStoreTheme(_0x3d7157);
  if (getBaseThemeForPreset(_0x4f396d) === _0x1cd141) {
    return _0x4f396d;
  }
  return _0x1cd141 === "light" ? 'day' : 'dusk';
}
function syncAppThemeButtons(_0x538c9e) {
  const _0x5f5a97 = normalizeAppThemePreset(_0x538c9e);
  document["querySelectorAll"](".cursor-size-btn[data-app-theme]")["forEach"](_0x4d06d7 => {
    const _0xcf207c = _0x4d06d7['dataset']["appTheme"] === _0x5f5a97;
    _0x4d06d7["classList"]["toggle"]("active", _0xcf207c);
    _0x4d06d7["setAttribute"]("aria-pressed", String(_0xcf207c));
    _0x4d06d7['classList']["remove"]('is-disabled');
    _0x4d06d7["setAttribute"]("aria-disabled", "false");
    _0x4d06d7["title"] = '';
  });
}
function syncCanvasTheme(_0x66657b) {
  const _0x450fb7 = document["getElementById"]('v2-wrap');
  const _0x3023dd = normalizeAppThemePreset(_0x66657b);
  const _0x5bb124 = isLightCanvasPreset(_0x66657b);
  document["documentElement"]?.["classList"]?.["toggle"]('is-canvas-theme-light', _0x5bb124);
  if (!_0x450fb7) {
    return;
  }
  _0x450fb7["classList"]["toggle"]("theme-light", _0x5bb124);
  APP_THEME_PRESETS["forEach"](_0x165cce => {
    _0x450fb7["classList"]['toggle']("canvas-theme-" + _0x165cce, _0x165cce === _0x3023dd);
  });
}
function normalizePromptActionSurface(_0x20311d) {
  return PROMPT_ACTION_SURFACES["has"](_0x20311d) ? _0x20311d : 'themed';
}
function applyPromptActionSurface(_0x37f96b) {
  const _0x8139b9 = normalizePromptActionSurface(_0x37f96b);
  localStorage["setItem"]("v2-prompt-action-surface", _0x8139b9);
  document["querySelectorAll"](".cursor-size-btn[data-prompt-action-surface]")['forEach'](_0x5619c1 => {
    _0x5619c1["classList"]['toggle']("active", _0x5619c1["dataset"]['promptActionSurface'] === _0x8139b9);
    _0x5619c1['setAttribute']('aria-pressed', String(_0x5619c1['dataset']["promptActionSurface"] === _0x8139b9));
  });
  document["body"]?.["classList"]["toggle"]("prompt-action-surface-themed", _0x8139b9 === "themed");
  const _0x20f14e = document["getElementById"]("v2-wrap");
  if (!_0x20f14e) {
    return;
  }
  _0x20f14e['classList']["toggle"]("prompt-action-surface-themed", _0x8139b9 === "themed");
}
function getUiPrefs(_0x5c478d) {
  try {
    const _0x46939c = _0x5c478d?.["getStateRaw"]?.() || _0x5c478d?.['getState']?.() || {};
    return _0x46939c?.['ui'] && typeof _0x46939c['ui'] === "object" ? _0x46939c['ui'] : {};
  } catch {
    return {};
  }
}
function syncButtonPair(_0x1e918b, _0x7ea167, _0x19f5cf) {
  const _0x1819c3 = _0x19f5cf === !![];
  document["getElementById"](_0x1e918b)?.['classList']["toggle"]('active', _0x1819c3);
  document['getElementById'](_0x7ea167)?.["classList"]["toggle"]("active", !_0x1819c3);
  document['getElementById'](_0x1e918b)?.["setAttribute"]?.("aria-pressed", String(_0x1819c3));
  document['getElementById'](_0x7ea167)?.['setAttribute']?.("aria-pressed", String(!_0x1819c3));
}
function applyCanvasToolbarPlacement(_0x2d7392) {
  const _0x4fa5ea = normalizeCanvasToolbarPlacement(_0x2d7392);
  const _0x1c1539 = document["getElementById"]("v2-wrap");
  const _0x5de319 = document['querySelector']?.(".sidebar-floating");
  _0x1c1539?.['classList']['toggle']('canvas-toolbar-left', _0x4fa5ea === "left");
  _0x1c1539?.["classList"]["toggle"]("canvas-toolbar-right", _0x4fa5ea === "right");
  _0x1c1539?.['classList']["toggle"]("canvas-toolbar-bottom", _0x4fa5ea === 'bottom');
  _0x5de319?.["setAttribute"]("data-tooltip-placement", _0x4fa5ea === "bottom" ? "top" : 'right');
  const _0x42112a = document["getElementById"]("btnCanvasToolbarPlacementLeft");
  const _0x361c94 = document["getElementById"]('btnCanvasToolbarPlacementRight');
  const _0x448f82 = document['getElementById']("btnCanvasToolbarPlacementBottom");
  _0x42112a?.["classList"]["toggle"]("active", _0x4fa5ea === "left");
  _0x361c94?.["classList"]["toggle"]("active", _0x4fa5ea === "right");
  _0x448f82?.["classList"]["toggle"]('active', _0x4fa5ea === "bottom");
  _0x42112a?.["setAttribute"]('aria-pressed', String(_0x4fa5ea === "left"));
  _0x361c94?.["setAttribute"]("aria-pressed", String(_0x4fa5ea === "right"));
  _0x448f82?.["setAttribute"]("aria-pressed", String(_0x4fa5ea === 'bottom'));
  typeof window?.["dispatchEvent"] === "function" && typeof globalThis["CustomEvent"] === "function" && window["dispatchEvent"](new CustomEvent(CANVAS_TOOLBAR_PLACEMENT_EVENT, {
    'detail': {
      'placement': _0x4fa5ea
    }
  }));
  return _0x4fa5ea;
}
function setCanvasToolbarPlacementPref(_0x20b5cb, _0x40d15c) {
  const _0x389d93 = normalizeCanvasToolbarPlacement(_0x20b5cb);
  _0x40d15c?.["setCanvasToolbarPlacement"]?.(_0x389d93);
  applyCanvasToolbarPlacement(_0x389d93);
  return _0x389d93;
}
function initCanvasToolbarPlacement({
  uiStore: _0xdd8918
} = {}) {
  const _0x47d0a7 = document["getElementById"]("btnCanvasToolbarPlacementLeft");
  const _0x296b85 = document["getElementById"]("btnCanvasToolbarPlacementRight");
  const _0x1be8f2 = document["getElementById"]("btnCanvasToolbarPlacementBottom");
  if (!_0x47d0a7 && !_0x296b85 && !_0x1be8f2) {
    return;
  }
  const _0x30c29c = _0x32d23e => applyCanvasToolbarPlacement(_0x32d23e);
  _0x30c29c(getUiPrefs(_0xdd8918)["canvasToolbarPlacement"]);
  _0x47d0a7?.["addEventListener"]("click", () => setCanvasToolbarPlacementPref("left", _0xdd8918));
  _0x296b85?.["addEventListener"]("click", () => setCanvasToolbarPlacementPref("right", _0xdd8918));
  _0x1be8f2?.["addEventListener"]("click", () => setCanvasToolbarPlacementPref("bottom", _0xdd8918));
  _0xdd8918?.["subscribeSelector"]?.(_0x3d57c3 => normalizeCanvasToolbarPlacement(_0x3d57c3['ui']?.['canvasToolbarPlacement']), _0x30c29c);
}
function syncAutoHidePinButton({
  buttonId: _0x468827,
  autoHideEnabled: _0x2df29a,
  pinKey: _0xfdf2f0,
  autoHideKey: _0x1695f4,
  tooltipAttribute: _0x263742,
  i18nTooltipAttribute: _0x49591a
}) {
  const _0x15198f = document["getElementById"](_0x468827);
  if (!_0x15198f) {
    return;
  }
  const _0x40ebd4 = _0x2df29a !== !![];
  const _0x4b9816 = _0x40ebd4 ? _0x1695f4 : _0xfdf2f0;
  const _0x51640d = t(_0x4b9816);
  _0x15198f['classList']['toggle']('is-pinned', _0x40ebd4);
  _0x15198f['setAttribute']("aria-pressed", String(_0x40ebd4));
  _0x15198f["setAttribute"]("aria-label", _0x51640d);
  _0x15198f["setAttribute"]('data-i18n-aria-label', _0x4b9816);
  _0x15198f["setAttribute"](_0x263742, _0x51640d);
  _0x15198f["setAttribute"](_0x49591a, _0x4b9816);
}
function applyLeftSidebarAutoHidePref(_0x32cd8a) {
  const _0x23a4e1 = _0x32cd8a === !![];
  const _0x12a6f2 = document["getElementById"]("v2-wrap");
  _0x12a6f2?.["classList"]["toggle"]("left-sidebar-auto-hide", _0x23a4e1);
  !_0x23a4e1 && (document['body']?.['classList']["remove"](LEFT_SIDEBAR_KEYBOARD_FOCUS_CLASS), clearLeftSidebarRevealGuard());
  syncButtonPair('btnLeftSidebarAutoHideOn', "btnLeftSidebarAutoHideOff", _0x23a4e1);
  syncAutoHidePinButton({
    'buttonId': "btnLeftSidebarPin",
    'autoHideEnabled': _0x23a4e1,
    'pinKey': "sidebar.pin",
    'autoHideKey': 'sidebar.autoHide',
    'tooltipAttribute': "data-tooltip-right",
    'i18nTooltipAttribute': 'data-i18n-tooltip-right'
  });
  return _0x23a4e1;
}
function clearLeftSidebarRevealGuard() {
  document["getElementById"]("v2-wrap")?.["classList"]["remove"](LEFT_SIDEBAR_REVEAL_GUARD_CLASS);
  leftSidebarRevealGuardTimer && typeof window?.["clearTimeout"] === 'function' && window['clearTimeout'](leftSidebarRevealGuardTimer);
  leftSidebarRevealGuardTimer = 0x0;
}
function startLeftSidebarRevealGuard() {
  const _0x330922 = document["getElementById"]("v2-wrap");
  if (!_0x330922?.["classList"]['contains']("left-sidebar-auto-hide")) {
    return;
  }
  _0x330922["classList"]["add"](LEFT_SIDEBAR_REVEAL_GUARD_CLASS);
  leftSidebarRevealGuardTimer && typeof window?.["clearTimeout"] === "function" && window["clearTimeout"](leftSidebarRevealGuardTimer);
  const _0x1bacf5 = window["setTimeout"]?.(() => {
    _0x330922["classList"]['remove'](LEFT_SIDEBAR_REVEAL_GUARD_CLASS);
    leftSidebarRevealGuardTimer === _0x1bacf5 && (leftSidebarRevealGuardTimer = 0x0);
  }, LEFT_SIDEBAR_REVEAL_GUARD_MS);
  leftSidebarRevealGuardTimer = _0x1bacf5 || 0x0;
}
function initLeftSidebarAutoHideFocusMode() {
  if (leftSidebarAutoHideFocusModeDocument === document) {
    return;
  }
  leftSidebarAutoHideFocusModeDocument = document;
  const _0x3dc97e = () => {
    document['body']?.['classList']["remove"](LEFT_SIDEBAR_KEYBOARD_FOCUS_CLASS);
  };
  document['addEventListener']?.("keydown", _0x3f7c74 => {
    if (_0x3f7c74?.["key"] !== "Tab") {
      return;
    }
    if (!document["getElementById"]("v2-wrap")?.['classList']["contains"]('left-sidebar-auto-hide')) {
      return;
    }
    document['body']?.["classList"]["add"](LEFT_SIDEBAR_KEYBOARD_FOCUS_CLASS);
  }, !![]);
  document['addEventListener']?.("pointerdown", _0x3dc97e, !![]);
  document["querySelector"]?.(".sidebar-floating")?.["addEventListener"]?.('focusout', () => {
    window["setTimeout"]?.(() => {
      !document["querySelector"]?.(".sidebar-floating")?.["matches"]?.(":focus-within") && _0x3dc97e();
    }, 0x0);
  });
  const _0x533156 = document["querySelector"]?.('.left-sidebar-hover-zone');
  _0x533156?.["addEventListener"]?.("pointerenter", startLeftSidebarRevealGuard);
  _0x533156?.['addEventListener']?.("pointerdown", startLeftSidebarRevealGuard);
}
function applyBottomLeftBarAutoHidePref(_0x3ac7b1) {
  const _0x1c1b56 = _0x3ac7b1 === !![];
  const _0x31253b = document["getElementById"]('v2-wrap');
  _0x31253b?.['classList']['toggle']("bottom-left-bar-auto-hide", _0x1c1b56);
  syncButtonPair('btnBottomLeftBarAutoHideOn', "btnBottomLeftBarAutoHideOff", _0x1c1b56);
  syncAutoHidePinButton({
    'buttonId': 'btnBottomLeftBarPin',
    'autoHideEnabled': _0x1c1b56,
    'pinKey': 'canvasControls.pinBar',
    'autoHideKey': "canvasControls.autoHideBar",
    'tooltipAttribute': "data-tooltip",
    'i18nTooltipAttribute': 'data-i18n-tooltip'
  });
  return _0x1c1b56;
}
function setLeftSidebarAutoHidePref(_0x17710d, _0x325162) {
  const _0x25727d = _0x17710d === !![];
  typeof _0x325162?.["setLeftSidebarAutoHideEnabled"] === "function" && _0x325162['setLeftSidebarAutoHideEnabled'](_0x25727d);
  applyLeftSidebarAutoHidePref(_0x25727d);
  return _0x25727d;
}
function setBottomLeftBarAutoHidePref(_0x17bce8, _0x438eba) {
  const _0x2c7f44 = _0x17bce8 === !![];
  typeof _0x438eba?.["setBottomLeftBarAutoHideEnabled"] === 'function' && _0x438eba["setBottomLeftBarAutoHideEnabled"](_0x2c7f44);
  applyBottomLeftBarAutoHidePref(_0x2c7f44);
  return _0x2c7f44;
}
export function initApplicationTheme({
  uiStore: _0xef1696,
  getCanvasPresentationContext = null
} = {}) {
  let _0x5bef4b = getSavedAppThemePreset(_0xef1696);
  const _0x31d6a7 = (_0x2a62b1 = _0x5bef4b) => syncAppThemeButtons(_0x2a62b1);
  const _0x509556 = (_0x57b230 = _0x5bef4b) => {
    _0x5bef4b = normalizeAppThemePreset(_0x57b230);
    localStorage["setItem"](APP_THEME_PRESET_STORAGE_KEY, _0x5bef4b);
    _0x31d6a7(_0x5bef4b);
    syncCanvasTheme(_0x5bef4b);
    applyCursorStyle({
      'preset': _0x5bef4b
    });
  };
  const _0xc103e = _0x5053da => {
    const _0x539738 = normalizeAppThemePreset(_0x5053da);
    _0x509556(_0x539738);
    const _0x53dbb4 = getBaseThemeForPreset(_0x539738);
    typeof _0xef1696?.["setTheme"] === "function" && _0x53dbb4 !== getUiStoreTheme(_0xef1696) && _0xef1696["setTheme"](_0x53dbb4);
  };
  _0x509556();
  document["querySelectorAll"](".cursor-size-btn[data-app-theme]")['forEach'](_0x5eeb82 => {
    _0x5eeb82["addEventListener"]('click', _0x5a1755 => {
      const _0x310930 = normalizeAppThemePreset(_0x5eeb82['dataset']['appTheme']);
      if (_0x310930 === _0x5bef4b) {
        _0xc103e(_0x310930);
        return;
      }
      runThemeRevealTransition(_0x5a1755, () => _0xc103e(_0x310930), {
        'getCanvasPresentationContext': getCanvasPresentationContext
      });
    });
  });
  typeof _0xef1696?.['subscribeSelector'] === "function" && _0xef1696["subscribeSelector"](_0x3d5470 => _0x3d5470["theme"], _0x7d4648 => {
    const _0x598dd0 = normalizeBaseAppTheme(_0x7d4648);
    if (getBaseThemeForPreset(_0x5bef4b) !== _0x598dd0) {
      _0x509556(_0x598dd0 === "light" ? "day" : "dusk");
      return;
    }
    _0x509556(_0x5bef4b);
  });
  window["addEventListener"]?.("aicanvas:runtime-info", () => _0x31d6a7());
}
export function applyGridDotsPref(_0x8096cd) {
  const _0x47acd9 = document['getElementById']("v2-wrap");
  if (!_0x47acd9) {
    return;
  }
  _0x47acd9["classList"]["toggle"]("has-grid-dots", !!_0x8096cd);
}
export function readGridDotsPref() {
  const _0x839fd1 = localStorage["getItem"]("v2-grid-dots");
  if (_0x839fd1 != null) {
    return _0x839fd1 === "true" || _0x839fd1 === '1';
  }
  localStorage["setItem"]("v2-grid-dots", 'true');
  return !![];
}
export function setGridDotsPref(_0x5ef873) {
  const _0x461295 = _0x5ef873 !== ![];
  localStorage["setItem"]("v2-grid-dots", _0x461295 ? 'true' : "false");
  applyGridDotsPref(_0x461295);
  const _0x4535d8 = document["getElementById"]("btnToggleDots");
  const _0x32bfd4 = document["getElementById"]("btnGridDotsOn");
  const _0x556609 = document["getElementById"]("btnGridDotsOff");
  _0x4535d8 && (_0x4535d8["classList"]["toggle"]('active', _0x461295), _0x4535d8["setAttribute"]("aria-pressed", _0x461295 ? "true" : 'false'));
  if (_0x32bfd4) {
    _0x32bfd4["classList"]["toggle"]("active", _0x461295);
  }
  if (_0x556609) {
    _0x556609["classList"]["toggle"]("active", !_0x461295);
  }
  _0x32bfd4?.["setAttribute"]?.("aria-pressed", String(_0x461295));
  _0x556609?.["setAttribute"]?.('aria-pressed', String(!_0x461295));
  return _0x461295;
}
export function applyGridDotsPrefFromStorage() {
  setGridDotsPref(readGridDotsPref());
}
function initCursorSettings() {
  const _0x320349 = _0x1accb6 => {
    const _0x31f04c = normalizeCursorSize(_0x1accb6);
    localStorage["setItem"](CURSOR_SIZE_STORAGE_KEY, _0x31f04c);
    document["querySelectorAll"](".cursor-size-btn[data-size]")["forEach"](_0xdb4e45 => {
      _0xdb4e45["classList"]["toggle"]("active", _0xdb4e45["dataset"]['size'] === _0x31f04c);
      _0xdb4e45["setAttribute"]("aria-pressed", String(_0xdb4e45["dataset"]["size"] === _0x31f04c));
    });
    applyCursorStyle({
      'size': _0x31f04c
    });
  };
  const _0x38b8d4 = localStorage["getItem"](CURSOR_SIZE_STORAGE_KEY) || "small";
  _0x320349(_0x38b8d4);
  document['querySelectorAll'](".cursor-size-btn[data-size]")["forEach"](_0x5e5863 => {
    _0x5e5863["addEventListener"]("click", () => _0x320349(_0x5e5863["dataset"]["size"]));
  });
}
function initPromptActionSurface() {
  const _0x1c2732 = normalizePromptActionSurface(localStorage['getItem']('v2-prompt-action-surface'));
  applyPromptActionSurface(_0x1c2732);
  document["querySelectorAll"](".cursor-size-btn[data-prompt-action-surface]")["forEach"](_0x31c6aa => {
    _0x31c6aa["addEventListener"]('click', () => applyPromptActionSurface(_0x31c6aa["dataset"]['promptActionSurface']));
  });
}
function initAutoHideChromeSettings({
  uiStore: _0x152db5
} = {}) {
  const _0x5fdc6c = document["getElementById"]('btnLeftSidebarAutoHideOn');
  const _0x3358e4 = document["getElementById"]("btnLeftSidebarAutoHideOff");
  const _0x2b6d11 = document['getElementById']("btnBottomLeftBarAutoHideOn");
  const _0x42e2d1 = document["getElementById"]("btnBottomLeftBarAutoHideOff");
  const _0x3342ee = document['getElementById']("btnLeftSidebarPin");
  const _0x27435e = document["getElementById"]("btnBottomLeftBarPin");
  if (!_0x5fdc6c && !_0x3358e4 && !_0x2b6d11 && !_0x42e2d1 && !_0x3342ee && !_0x27435e) {
    return;
  }
  initLeftSidebarAutoHideFocusMode();
  const _0xba5f59 = getUiPrefs(_0x152db5);
  let _0x1ea559 = _0xba5f59['leftSidebarAutoHideEnabled'] === !![];
  let _0x3d65f8 = _0xba5f59["bottomLeftBarAutoHideEnabled"] === !![];
  const _0x370d70 = _0x1efd5d => {
    _0x1ea559 = applyLeftSidebarAutoHidePref(_0x1efd5d);
  };
  const _0x47a7c1 = _0x33721f => {
    _0x3d65f8 = applyBottomLeftBarAutoHidePref(_0x33721f);
  };
  const _0x2f5b8b = _0x38bf37 => {
    _0x1ea559 = _0x38bf37 === !![];
    setLeftSidebarAutoHidePref(_0x1ea559, _0x152db5);
  };
  const _0x91d864 = _0x4044c7 => {
    _0x3d65f8 = _0x4044c7 === !![];
    setBottomLeftBarAutoHidePref(_0x3d65f8, _0x152db5);
  };
  const _0x2c123b = _0xaeecac => {
    if (Number(_0xaeecac?.["detail"]) > 0x0) {
      _0xaeecac["currentTarget"]?.["blur"]?.();
    }
  };
  _0x370d70(_0x1ea559);
  _0x47a7c1(_0x3d65f8);
  _0x5fdc6c?.['addEventListener']("click", () => _0x2f5b8b(!![]));
  _0x3358e4?.["addEventListener"]("click", () => _0x2f5b8b(![]));
  _0x2b6d11?.["addEventListener"]('click', () => _0x91d864(!![]));
  _0x42e2d1?.["addEventListener"]("click", () => _0x91d864(![]));
  _0x3342ee?.["addEventListener"]("click", _0x195283 => {
    _0x2f5b8b(!_0x1ea559);
    _0x2c123b(_0x195283);
  });
  _0x27435e?.['addEventListener']("click", _0x17fb5b => {
    _0x91d864(!_0x3d65f8);
    _0x2c123b(_0x17fb5b);
  });
  typeof _0x152db5?.["subscribeSelector"] === "function" && (_0x152db5["subscribeSelector"](_0x44b3ef => _0x44b3ef['ui']?.["leftSidebarAutoHideEnabled"] === !![], _0x370d70), _0x152db5['subscribeSelector'](_0x223117 => _0x223117['ui']?.["bottomLeftBarAutoHideEnabled"] === !![], _0x47a7c1));
}
function initGridDots() {
  const _0x5351cc = document["getElementById"]("btnGridDotsOn");
  const _0x5c04f2 = document["getElementById"]("btnGridDotsOff");
  const _0x2ee603 = document["getElementById"]('gridDotsShortcutLabel');
  if (!_0x5351cc || !_0x5c04f2) {
    return;
  }
  const _0x48b5b9 = () => {
    if (!_0x2ee603) {
      return;
    }
    _0x2ee603["textContent"] = getShortcutLabelByAction("grid-dots", '.');
  };
  setGridDotsPref(readGridDotsPref());
  _0x48b5b9();
  _0x5351cc["addEventListener"]("click", () => setGridDotsPref(!![]));
  _0x5c04f2["addEventListener"]("click", () => setGridDotsPref(![]));
  window["addEventListener"]("shortcuts-updated", _0x48b5b9);
}
function initFontSize() {
  const _0x34a8d2 = _0x3b4cd9 => {
    if (!FONT_SIZE_MAP[_0x3b4cd9]) {
      _0x3b4cd9 = "small";
    }
    localStorage["setItem"]("v2-input-font-size", _0x3b4cd9);
    document["querySelectorAll"](".cursor-size-btn[data-fontsize]")["forEach"](_0x25e3e1 => {
      _0x25e3e1["classList"]["toggle"]('active', _0x25e3e1["dataset"]['fontsize'] === _0x3b4cd9);
      _0x25e3e1["setAttribute"]('aria-pressed', String(_0x25e3e1["dataset"]["fontsize"] === _0x3b4cd9));
    });
    document['documentElement']["style"]['setProperty']("--prompt-font-size", FONT_SIZE_MAP[_0x3b4cd9]);
  };
  const _0xfa39f6 = localStorage['getItem']("v2-input-font-size") || "small";
  _0x34a8d2(_0xfa39f6);
  document["querySelectorAll"](".cursor-size-btn[data-fontsize]")["forEach"](_0x3d810a => {
    _0x3d810a["addEventListener"]("click", () => _0x34a8d2(_0x3d810a["dataset"]["fontsize"]));
  });
}
export function initAppearanceSettings(_0x56f87e = {}) {
  initApplicationTheme({
    'uiStore': _0x56f87e["uiStore"],
    'getCanvasPresentationContext': _0x56f87e["getCanvasPresentationContext"]
  });
  initCursorSettings();
  initPromptActionSurface();
  initCanvasToolbarPlacement({
    'uiStore': _0x56f87e['uiStore']
  });
  initAutoHideChromeSettings({
    'uiStore': _0x56f87e["uiStore"]
  });
  initGridDots();
  initFontSize();
}