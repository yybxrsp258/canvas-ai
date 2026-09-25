import a227_0x5b8f78 from 'electron';
import a227_0x1f0cff from 'node:path';
import { disableWindowsWindowTransitions } from './windowsWindowTransitions.js';
const {
  BrowserWindow,
  nativeTheme,
  screen
} = typeof a227_0x5b8f78 === "object" && a227_0x5b8f78 ? a227_0x5b8f78 : {};
export const GLOBAL_CAPTURE_ACTION_IDS = Object['freeze'](["source-text", 'ai-text', "ai-image", "ai-video", "preset-draft"]);
const AI_ACTION_IDS = new Set(["ai-text", "ai-image", "ai-video"]);
const CAPTURE_PHASES = new Set(["capturing", "ready", "error"]);
const DEFAULT_WINDOW_SIZE = Object["freeze"]({
  'width': 0x190,
  'height': 0x34
});
const EXPANDED_HEIGHT = 0x104;
const NATIVE_TRANSPARENT_BACKGROUND = '#' + '0'["repeat"](0x8);
function clamp(_0x2fecd9, _0x16aa9b, _0x319e6d) {
  if (_0x319e6d < _0x16aa9b) {
    return _0x16aa9b;
  }
  return Math["min"](_0x319e6d, Math['max'](_0x16aa9b, _0x2fecd9));
}
function normalizeScreenArea(_0x539a08 = {}) {
  return {
    'x': Math["round"](Number(_0x539a08?.['x']) || 0x0),
    'y': Math["round"](Number(_0x539a08?.['y']) || 0x0),
    'width': Math["max"](0x1, Math["round"](Number(_0x539a08?.["width"]) || 0x1)),
    'height': Math["max"](0x1, Math["round"](Number(_0x539a08?.["height"]) || 0x1))
  };
}
export function resolveGlobalCaptureWindowBounds({
  cursor = {
    'x': 0x0,
    'y': 0x0
  },
  workArea = {
    'x': 0x0,
    'y': 0x0,
    'width': 0x500,
    'height': 0x2d0
  },
  size = DEFAULT_WINDOW_SIZE,
  margin = 0xc,
  offset = 0xe
} = {}) {
  const _0x3b180d = normalizeScreenArea(workArea);
  const _0x4cae1b = Math["max"](0x0, Math["round"](Number(margin) || 0x0));
  const _0x2f5294 = Math["max"](0x1, _0x3b180d['width'] - _0x4cae1b * 0x2);
  const _0x52d40f = Math["max"](0x1, _0x3b180d["height"] - _0x4cae1b * 0x2);
  const _0x7a97c = Math["min"](_0x2f5294, Math['max'](0x1, Math["round"](Number(size?.["width"]) || DEFAULT_WINDOW_SIZE["width"])));
  const _0x107d17 = Math["min"](_0x52d40f, Math['max'](0x1, Math["round"](Number(size?.['height']) || DEFAULT_WINDOW_SIZE['height'])));
  const _0x26f5da = Math["round"](Number(cursor?.['x']) || _0x3b180d['x']);
  const _0x35305e = Math["round"](Number(cursor?.['y']) || _0x3b180d['y']);
  const _0x205726 = Math['max'](0x0, Math["round"](Number(offset) || 0x0));
  const _0x1067e5 = _0x3b180d['x'] + _0x4cae1b;
  const _0xa8251e = _0x3b180d['y'] + _0x4cae1b;
  const _0x453068 = _0x3b180d['x'] + _0x3b180d["width"] - _0x4cae1b - _0x7a97c;
  const _0x4a6a54 = _0x3b180d['y'] + _0x3b180d['height'] - _0x4cae1b - _0x107d17;
  let _0x4b0063 = _0x26f5da + _0x205726;
  let _0x3d499f = _0x35305e + _0x205726;
  _0x4b0063 + _0x7a97c > _0x3b180d['x'] + _0x3b180d["width"] - _0x4cae1b && (_0x4b0063 = _0x26f5da - _0x7a97c - _0x205726);
  _0x3d499f + _0x107d17 > _0x3b180d['y'] + _0x3b180d["height"] - _0x4cae1b && (_0x3d499f = _0x35305e - _0x107d17 - _0x205726);
  return {
    'x': clamp(_0x4b0063, _0x1067e5, _0x453068),
    'y': clamp(_0x3d499f, _0xa8251e, _0x4a6a54),
    'width': _0x7a97c,
    'height': _0x107d17
  };
}
export function createGlobalCaptureWindowController({
  dirname: _0x3f9048,
  BrowserWindowClass = BrowserWindow,
  screenApi = screen,
  nativeThemeApi = nativeTheme,
  onAction = async () => ({
    'ok': !![]
  }),
  logDiagnosticEvent = () => {},
  prepareWindow = disableWindowsWindowTransitions,
  windowSize = DEFAULT_WINDOW_SIZE,
  focusRetryDelayMs = 0x18,
  pendingShowDelayMs = 0x78,
  setTimeoutFn = setTimeout,
  clearTimeoutFn = clearTimeout
} = {}) {
  let _0x569819 = null;
  let _0x37b07f = null;
  let _0x490123 = null;
  let _0x2825f7 = null;
  let _0x55ce66 = '';
  let _0x11361c = ![];
  let _0x39552d = null;
  let _0x38a2fd = null;
  let _0x4d7f97 = 0x0;
  let _0x164f2a = 0x0;
  let _0x3565ea = ![];
  let _0x5b2b89 = "source-text";
  let _0xb6123f = ![];
  function _0x2b25d5() {
    return Boolean(_0x569819 && !_0x569819['isDestroyed']?.());
  }
  function _0x4205f8(_0x77c570) {
    return _0x2b25d5() && _0x569819['webContents'] === _0x77c570;
  }
  function _0x2b9943() {
    return _0x2b25d5() && _0x569819["isVisible"]?.() === !![];
  }
  function _0x3c288c() {
    _0x2825f7?.['dispatchAbort']?.["abort"]();
    if (_0x38a2fd !== null) {
      clearTimeoutFn(_0x38a2fd);
    }
    _0x38a2fd = null;
    _0x2825f7 = null;
    _0x11361c = ![];
  }
  function _0x13d22e() {
    if (_0x39552d === null) {
      return;
    }
    clearTimeoutFn(_0x39552d);
    _0x39552d = null;
  }
  function _0x598f67(_0x4504c8) {
    if (_0x4504c8["isFocused"]?.() === !![]) {
      return;
    }
    _0x4504c8["focus"]?.();
    _0x2825f7 && _0x4504c8["isFocused"]?.() === !![] && (_0x11361c = !![]);
  }
  function _0x10cd67(_0x19e8b7, _0x45a5e9) {
    _0x13d22e();
    _0x39552d = setTimeoutFn(() => {
      _0x39552d = null;
      if (!_0x2b25d5() || _0x569819 !== _0x19e8b7 || !_0x2b9943() || _0x2825f7?.['captureId'] !== _0x45a5e9 || _0x19e8b7["isFocused"]?.() === !![]) {
        return;
      }
      _0x598f67(_0x19e8b7);
    }, focusRetryDelayMs);
  }
  function _0x4a3909() {
    _0x13d22e();
    if (_0x2825f7) {
      _0x55ce66 = _0x2825f7['captureId'];
    }
    if (!_0x2b25d5()) {
      _0x3c288c();
      return ![];
    }
    _0x569819["hide"]?.();
    _0x569819["webContents"]?.["setBackgroundThrottling"]?.(!![]);
    _0x3c288c();
    return !![];
  }
  async function _0x520c70() {
    if (_0xb6123f) {
      throw new Error('capture-controller-destroyed');
    }
    if (_0x2b25d5()) {
      if (_0x37b07f) {
        await _0x37b07f;
      }
      return _0x569819;
    }
    _0x569819 = new BrowserWindowClass({
      'width': windowSize["width"],
      'height': windowSize["height"],
      'title': "发送到 Canvas AI 无限画布",
      'show': ![],
      'frame': ![],
      'thickFrame': ![],
      'roundedCorners': ![],
      'transparent': !![],
      'backgroundColor': NATIVE_TRANSPARENT_BACKGROUND,
      'backgroundMaterial': "none",
      'hasShadow': ![],
      'paintWhenInitiallyHidden': !![],
      'alwaysOnTop': !![],
      'focusable': !![],
      'skipTaskbar': !![],
      'resizable': ![],
      'movable': ![],
      'minimizable': ![],
      'maximizable': ![],
      'fullscreenable': ![],
      'webPreferences': {
        'preload': a227_0x1f0cff["join"](_0x3f9048, "globalCaptureWindowPreload.cjs"),
        'contextIsolation': !![],
        'nodeIntegration': ![],
        'sandbox': !![],
        'backgroundThrottling': ![]
      }
    });
    _0x569819['on']?.("closed", () => {
      _0x13d22e();
      _0x569819 = null;
      _0x37b07f = null;
      _0x3c288c();
    });
    _0x569819['on']?.("blur", () => {
      if (_0x2825f7 && _0x11361c && !_0x2825f7["pending"]) {
        _0x4a3909();
      }
    });
    _0x569819['on']?.("focus", () => {
      if (_0x2825f7) {
        _0x11361c = !![];
      }
    });
    const _0x45d16e = _0x569819;
    const _0x3379db = Promise["resolve"]()["then"](() => prepareWindow(_0x45d16e))["then"](_0x12676d => {
      if (_0x12676d?.['ok'] === ![]) {
        throw new Error(_0x12676d["reason"] || "native-window-preparation-failed");
      }
      if (_0x12676d?.['ok'] && !_0x12676d["skipped"]) {
        logDiagnosticEvent({
          'type': 'global_capture.window_transitions_disabled',
          'level': "info",
          'source': "main",
          'message': 'Native\x20popup\x20transitions\x20disabled\x20before\x20presentation'
        });
      }
    })["catch"](_0x16b8af => {
      logDiagnosticEvent({
        'type': "global_capture.window_transitions_unavailable",
        'level': 'warn',
        'source': 'main',
        'message': 'Native\x20popup\x20transitions\x20could\x20not\x20be\x20disabled',
        'error': _0x16b8af
      });
    });
    _0x37b07f = Promise["all"]([_0x569819["loadFile"](a227_0x1f0cff["join"](_0x3f9048, "globalCaptureWindow.html")), _0x3379db])["catch"](_0x3ca7b3 => {
      _0x37b07f = null;
      throw _0x3ca7b3;
    });
    await _0x37b07f;
    return _0x569819;
  }
  function _0x102cc2() {
    if (_0x490123) {
      return _0x490123;
    }
    _0x490123 = _0x520c70()['catch'](_0x3ccf24 => {
      logDiagnosticEvent({
        'type': "global_capture.window_prewarm_failed",
        'level': 'warn',
        'source': "main",
        'message': "Global capture window prewarm failed",
        'error': _0x3ccf24
      });
    })["finally"](() => {
      _0x490123 = null;
    });
    return _0x490123;
  }
  async function _0x4a0f94(_0x3f3918 = {}) {
    if (_0xb6123f) {
      return {
        'ok': ![],
        'reason': 'capture-controller-destroyed'
      };
    }
    const _0x5e85c7 = String(_0x3f3918?.['text'] || '')["trim"]();
    const _0x35c9bc = String(_0x3f3918?.['captureId'] || '')["trim"]();
    if (_0x35c9bc && _0x35c9bc === _0x55ce66) {
      return {
        'ok': ![],
        'reason': "capture-cancelled"
      };
    }
    const _0x1e7caf = String(_0x3f3918?.["phase"] || '')["trim"]();
    const _0x59f84b = CAPTURE_PHASES["has"](_0x1e7caf) ? _0x1e7caf : _0x5e85c7 ? "ready" : '';
    if (!_0x35c9bc || !_0x59f84b || _0x59f84b === "ready" && !_0x5e85c7) {
      return {
        'ok': ![],
        'reason': "invalid-capture"
      };
    }
    try {
      const _0x1fabc5 = await _0x520c70();
      if (_0xb6123f) {
        return {
          'ok': ![],
          'reason': "capture-controller-destroyed"
        };
      }
      if (_0x35c9bc === _0x55ce66) {
        return {
          'ok': ![],
          'reason': "capture-cancelled"
        };
      }
      if (!_0x1fabc5 || _0x1fabc5["isDestroyed"]?.()) {
        return {
          'ok': ![],
          'reason': "window-unavailable"
        };
      }
      const _0x5c0a1a = _0x2825f7?.["captureId"] === _0x35c9bc ? _0x2825f7 : null;
      if (!_0x5c0a1a) {
        _0x2825f7?.["dispatchAbort"]?.['abort']();
      }
      const _0x1cfb4e = _0x5c0a1a?.["cursor"] || screenApi["getCursorScreenPoint"]?.() || {
        'x': 0x0,
        'y': 0x0
      };
      const _0x1369c2 = screenApi["getDisplayNearestPoint"]?.(_0x1cfb4e) || {};
      const _0x52cf81 = _0x5c0a1a?.["workArea"] || normalizeScreenArea(_0x1369c2["workArea"] || _0x1369c2["bounds"] || {
        'x': 0x0,
        'y': 0x0,
        'width': 0x500,
        'height': 0x2d0
      });
      const _0x161117 = resolveGlobalCaptureWindowBounds({
        'cursor': _0x1cfb4e,
        'workArea': _0x52cf81,
        'size': windowSize
      });
      if (_0x38a2fd !== null) {
        clearTimeoutFn(_0x38a2fd);
      }
      _0x38a2fd = null;
      const _0x503647 = ++_0x4d7f97;
      _0x2825f7 = {
        'captureId': _0x35c9bc,
        'presentationId': _0x503647,
        'text': _0x5e85c7,
        'phase': _0x59f84b,
        'cursor': _0x1cfb4e,
        'workArea': _0x52cf81,
        'bounds': _0x161117,
        'pending': ![]
      };
      !_0x5c0a1a && (_0x11361c = ![], _0x1fabc5["setBounds"]?.(_0x161117), _0x1fabc5["setAlwaysOnTop"]?.(!![], "pop-up-menu"), _0x1fabc5["setVisibleOnAllWorkspaces"]?.(!![], {
        'visibleOnFullScreen': !![]
      }));
      _0x1fabc5["webContents"]?.['setBackgroundThrottling']?.(![]);
      _0x1fabc5["webContents"]?.["send"]?.("globalCaptureWindow:present", {
        'captureId': _0x35c9bc,
        'presentationId': _0x503647,
        'text': _0x5e85c7,
        'phase': _0x59f84b,
        'errorReason': String(_0x3f3918?.['errorReason'] || '')["trim"](),
        'shortcutLabel': String(_0x3f3918?.["shortcutLabel"] || 'Alt+C')["trim"]() || "Alt+C",
        'theme': nativeThemeApi?.["shouldUseDarkColors"] === ![] ? 'light' : "dark",
        'runImmediately': _0x3565ea,
        'activeActionId': _0x5b2b89
      });
      _0x13d22e();
      return {
        'ok': !![],
        'captureId': _0x35c9bc,
        'bounds': _0x161117,
        'phase': _0x59f84b
      };
    } catch (_0x1fcab3) {
      _0x3c288c();
      logDiagnosticEvent({
        'type': "global_capture.window_show_failed",
        'level': 'error',
        'source': "main",
        'message': 'Global\x20capture\x20window\x20failed\x20to\x20show',
        'error': _0x1fcab3
      });
      return {
        'ok': ![],
        'reason': 'window-show-failed'
      };
    }
  }
  async function _0x24588f(_0x59bc37 = {}, _0x55669b = null) {
    if (!_0x4205f8(_0x55669b)) {
      return {
        'ok': ![],
        'reason': "untrusted-sender"
      };
    }
    const _0x558ab6 = _0x2825f7;
    if (!_0x558ab6 || _0x558ab6['captureId'] !== _0x59bc37["captureId"] || _0x558ab6["presentationId"] !== _0x59bc37["presentationId"]) {
      return {
        'ok': ![],
        'reason': "stale-presentation"
      };
    }
    if (_0x558ab6["presented"]) {
      return {
        'ok': !![]
      };
    }
    _0x558ab6['presented'] = !![];
    if (!_0x2b9943()) {
      try {
        const _0x246da0 = await _0x569819["webContents"]['capturePage'](undefined, {
          'stayHidden': !![],
          'stayAwake': !![]
        });
        if (_0x246da0['isEmpty']()) {
          throw new Error('empty-capture-frame');
        }
      } catch (_0x8799a3) {
        if (_0x2825f7 === _0x558ab6) {
          _0x4a3909();
        }
        logDiagnosticEvent({
          'type': 'global_capture.window_frame_failed',
          'level': "error",
          'source': "main",
          'message': "Global capture window frame unavailable",
          'error': _0x8799a3
        });
        return {
          'ok': ![],
          'reason': 'window-frame-failed'
        };
      }
      if (_0x2825f7 !== _0x558ab6 || !_0x2b25d5()) {
        return {
          'ok': ![],
          'reason': "stale-presentation"
        };
      }
    }
    const _0x38cb4e = () => {
      _0x38a2fd = null;
      if (_0x2825f7 !== _0x558ab6 || !_0x2b25d5()) {
        return;
      }
      if (!_0x2b9943()) {
        if (_0x558ab6["phase"] === 'capturing') {
          _0x569819['showInactive']?.();
        } else {
          _0x569819["show"]?.();
        }
      }
      _0x558ab6['phase'] !== 'capturing' && (_0x598f67(_0x569819), _0x10cd67(_0x569819, _0x558ab6["captureId"]));
    };
    if (_0x558ab6['phase'] === "capturing") {
      _0x38a2fd = setTimeoutFn(_0x38cb4e, pendingShowDelayMs);
    } else {
      _0x38cb4e();
    }
    return {
      'ok': !![]
    };
  }
  function _0x383649(_0x4808c1 = {}, _0x166884 = null) {
    if (!_0x4205f8(_0x166884)) {
      return {
        'ok': ![],
        'reason': 'untrusted-sender'
      };
    }
    if (!_0x2825f7 || _0x2825f7['captureId'] !== _0x4808c1?.["captureId"]) {
      return {
        'ok': ![],
        'reason': 'stale-capture'
      };
    }
    if (_0x2825f7["pending"] || _0x2825f7["phase"] !== "ready") {
      return {
        'ok': ![],
        'reason': "capture-not-ready"
      };
    }
    const {
      bounds: _0x25e605,
      workArea: _0x10c431
    } = _0x2825f7;
    const _0x361129 = _0x4808c1?.["expanded"] === !![];
    const _0x403d40 = _0x361129 ? Math["min"](EXPANDED_HEIGHT, Math["max"](0x1, _0x10c431["height"] - 0x18)) : _0x25e605['height'];
    const _0xb2533e = _0x361129 && _0x25e605['y'] + _0x403d40 > _0x10c431['y'] + _0x10c431["height"] - 0xc;
    const _0x5c6d8b = {
      ..._0x25e605,
      'height': _0x403d40,
      'y': _0xb2533e ? Math["max"](_0x10c431['y'] + 0xc, _0x25e605['y'] + _0x25e605['height'] - _0x403d40) : _0x25e605['y']
    };
    _0x569819["setBounds"]?.(_0x5c6d8b);
    return {
      'ok': !![],
      'expanded': _0x361129,
      'opensUp': _0xb2533e,
      'bounds': _0x5c6d8b
    };
  }
  async function _0x1a11d8(_0x585d69 = {}, _0x8aa2bf = null) {
    if (!_0x4205f8(_0x8aa2bf)) {
      return {
        'ok': ![],
        'reason': "untrusted-sender"
      };
    }
    const _0x8ada1e = String(_0x585d69?.["actionId"] || '')['trim']();
    const _0x955ae4 = String(_0x585d69?.["captureId"] || '')["trim"]();
    if (!GLOBAL_CAPTURE_ACTION_IDS["includes"](_0x8ada1e)) {
      return {
        'ok': ![],
        'reason': "invalid-action"
      };
    }
    if (!_0x2825f7 || _0x2825f7['captureId'] !== _0x955ae4) {
      return {
        'ok': ![],
        'reason': "stale-capture"
      };
    }
    if (_0x2825f7["pending"]) {
      return {
        'ok': ![],
        'reason': "action-in-flight"
      };
    }
    if (_0x2825f7["phase"] !== 'ready' || !_0x2825f7["text"]) {
      return {
        'ok': ![],
        'reason': "capture-not-ready"
      };
    }
    const _0x5ec2fb = _0x2825f7;
    const _0x2f1726 = AI_ACTION_IDS["has"](_0x8ada1e) ? _0x585d69?.["runImmediately"] === !![] : ![];
    if (AI_ACTION_IDS["has"](_0x8ada1e) && _0x585d69?.["rememberRunImmediately"] !== ![]) {
      _0x3565ea = _0x2f1726;
    }
    _0x5b2b89 = _0x8ada1e;
    _0x13d22e();
    _0x5ec2fb['pending'] = !![];
    _0x5ec2fb["dispatchAbort"] = new AbortController();
    let _0x297ea1;
    try {
      const _0x3638b3 = await onAction({
        'eventId': 'global-capture-' + _0x5ec2fb["captureId"] + '-' + ++_0x164f2a,
        'actionId': _0x8ada1e,
        'text': _0x5ec2fb["text"],
        'runImmediately': _0x2f1726,
        'source': "globalCaptureWindow",
        'createdAt': Date["now"]()
      }, {
        'signal': _0x5ec2fb['dispatchAbort']["signal"]
      });
      _0x297ea1 = _0x3638b3 && typeof _0x3638b3 === "object" ? _0x3638b3 : {
        'ok': ![],
        'reason': "dispatch-failed"
      };
    } catch (_0x4bff5f) {
      logDiagnosticEvent({
        'type': 'global_capture.action_dispatch_failed',
        'level': "error",
        'source': "main",
        'message': "Global capture action dispatch failed",
        'error': _0x4bff5f,
        'context': {
          'actionId': _0x8ada1e
        }
      });
      _0x297ea1 = {
        'ok': ![],
        'reason': "dispatch-failed"
      };
    }
    _0x2825f7 === _0x5ec2fb && _0x2b25d5() && (_0x5ec2fb["pending"] = ![], _0x297ea1['ok'] === ![] ? (_0x569819['show']?.(), _0x598f67(_0x569819)) : _0x4a3909());
    return _0x297ea1;
  }
  function _0x396174(_0x12ebf8 = {}, _0x448951 = null) {
    if (!_0x4205f8(_0x448951)) {
      return {
        'ok': ![],
        'reason': "untrusted-sender"
      };
    }
    const _0x105d07 = String(_0x12ebf8?.["captureId"] || '')["trim"]();
    if (_0x105d07 && _0x2825f7?.["captureId"] !== _0x105d07) {
      return {
        'ok': ![],
        'reason': 'stale-capture'
      };
    }
    _0x4a3909();
    return {
      'ok': !![]
    };
  }
  function _0x604b1d() {
    _0xb6123f = !![];
    _0x13d22e();
    _0x37b07f = null;
    _0x490123 = null;
    _0x3c288c();
    if (!_0x2b25d5()) {
      return;
    }
    _0x569819["destroy"]?.();
  }
  return {
    'cancel': _0x396174,
    'chooseAction': _0x1a11d8,
    'destroy': _0x604b1d,
    'didPresent': _0x24588f,
    'hide': _0x4a3909,
    'isTrustedSender': _0x4205f8,
    'isVisible': _0x2b9943,
    'prewarm': _0x102cc2,
    'setExpanded': _0x383649,
    'show': _0x4a0f94
  };
}