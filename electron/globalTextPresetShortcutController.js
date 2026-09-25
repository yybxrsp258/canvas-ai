import a228_0x58ecfe from 'electron';
import { copySelectedTextToClipboard } from './selectedTextCapture.js';
import { createGlobalCaptureDelivery } from './globalCaptureDelivery.js';
const {
  clipboard = {},
  globalShortcut = {}
} = typeof a228_0x58ecfe === "object" && a228_0x58ecfe ? a228_0x58ecfe : {};
export const GLOBAL_CAPTURE_LAUNCHER_SHORTCUT_ID = "global-capture-launcher";
export const GLOBAL_TEXT_PRESET_SHORTCUT_ID = "global-text-preset";
const SUPPORTED_SHORTCUT_IDS = new Set([GLOBAL_CAPTURE_LAUNCHER_SHORTCUT_ID, GLOBAL_TEXT_PRESET_SHORTCUT_ID]);
const SUPPORTED_CAPTURE_ACTION_IDS = new Set(['source-text', "ai-text", "ai-image", "ai-video", "preset-draft"]);
function normalizeShortcutToken(_0x3ab33f) {
  const _0x3945b0 = String(_0x3ab33f || '')["trim"]();
  if (!_0x3945b0) {
    return '';
  }
  const _0x3c33ce = _0x3945b0["toLowerCase"]();
  if (_0x3c33ce === "ctrl" || _0x3c33ce === "control" || _0x3c33ce === "cmdorctrl" || _0x3c33ce === "commandorcontrol" || _0x3c33ce === "commandorctrl") {
    return "CommandOrControl";
  }
  if (_0x3c33ce === "shift") {
    return "Shift";
  }
  if (_0x3c33ce === "alt" || _0x3c33ce === "option") {
    return 'Alt';
  }
  if (_0x3c33ce === "space") {
    return "Space";
  }
  if (_0x3c33ce === "backquote" || _0x3945b0 === '`' || _0x3945b0 === '~') {
    return '`';
  }
  if (/^f([1-9]|1[0-9]|2[0-4])$/i["test"](_0x3945b0)) {
    return _0x3945b0["toUpperCase"]();
  }
  if (/^[a-z]$/i["test"](_0x3945b0)) {
    return _0x3945b0["toUpperCase"]();
  }
  if (/^[0-9]$/["test"](_0x3945b0)) {
    return _0x3945b0;
  }
  const _0x4b1367 = new Map([["enter", "Enter"], ["return", 'Enter'], ["tab", "Tab"], ["escape", "Escape"], ["esc", "Escape"], ["backspace", "Backspace"], ["delete", "Delete"], ["del", 'Delete'], ["insert", "Insert"], ["ins", 'Insert'], ['home', "Home"], ['end', "End"], ["pageup", "PageUp"], ["pagedown", "PageDown"], ['up', 'Up'], ["down", 'Down'], ["left", "Left"], ["right", 'Right'], ['+', "Plus"], ['=', 'Plus'], ['-', 'Minus'], [',', "Comma"], ['.', "Period"], ['/', 'Slash'], ['\x5c', "Backslash"], [';', 'Semicolon'], ['\x27', "Quote"], ['[', "BracketLeft"], [']', "BracketRight"]]);
  return _0x4b1367["get"](_0x3c33ce) || '';
}
function normalizeGlobalShortcutPayload(_0xa0e59f = {}, {
  allowEmpty = !![]
} = {}) {
  const _0x4e51d8 = Array['isArray'](_0xa0e59f?.["keys"]) ? _0xa0e59f["keys"] : typeof _0xa0e59f?.["accelerator"] === "string" ? _0xa0e59f["accelerator"]['split']('+') : [];
  const _0x2d80b1 = _0x4e51d8['map'](normalizeShortcutToken)["filter"](Boolean);
  if (allowEmpty && _0x2d80b1['length'] === 0x0) {
    return {
      'ok': !![],
      'accelerator': '',
      'keys': []
    };
  }
  const _0x79dbf = [];
  if (_0x2d80b1["includes"]("CommandOrControl")) {
    _0x79dbf["push"]('CommandOrControl');
  }
  if (_0x2d80b1["includes"]('Shift')) {
    _0x79dbf['push']("Shift");
  }
  if (_0x2d80b1["includes"]("Alt")) {
    _0x79dbf['push']("Alt");
  }
  const _0xfd8770 = _0x2d80b1["filter"](_0x1d9e47 => _0x1d9e47 !== "CommandOrControl" && _0x1d9e47 !== "Shift" && _0x1d9e47 !== 'Alt');
  if (_0xfd8770['length'] !== 0x1) {
    return {
      'ok': ![],
      'reason': "invalid-shortcut"
    };
  }
  const _0x3ea638 = [..._0x79dbf, _0xfd8770[0x0]];
  return {
    'ok': !![],
    'accelerator': _0x3ea638['join']('+'),
    'keys': _0x3ea638
  };
}
function createInitialBinding(_0xcc2081, _0x5b8f14) {
  const _0x6f738f = normalizeGlobalShortcutPayload({
    'accelerator': _0x5b8f14
  }, {
    'allowEmpty': !![]
  });
  return {
    'actionId': _0xcc2081,
    'accelerator': _0x6f738f['ok'] ? _0x6f738f["accelerator"] : '',
    'registered': ![]
  };
}
export function createGlobalTextPresetShortcutController({
  accelerator = 'Alt+C',
  accelerators = {},
  clipboardApi = clipboard,
  globalShortcutApi = globalShortcut,
  copySelectedText = copySelectedTextToClipboard,
  focusCanvas: _0x5edc77,
  getMainWindow: _0x3c42a0,
  showCapturePanel = async () => ({
    'ok': ![],
    'reason': "panel-unavailable"
  }),
  hideCapturePanel = () => ![],
  isCapturePanelVisible = () => ![],
  logDiagnosticEvent = () => {},
  delivery = createGlobalCaptureDelivery(),
  hasKeyReleaseTracking = () => ![]
} = {}) {
  const _0x1d6acd = new Map([[GLOBAL_CAPTURE_LAUNCHER_SHORTCUT_ID, createInitialBinding(GLOBAL_CAPTURE_LAUNCHER_SHORTCUT_ID, accelerators[GLOBAL_CAPTURE_LAUNCHER_SHORTCUT_ID] ?? accelerator)], [GLOBAL_TEXT_PRESET_SHORTCUT_ID, createInitialBinding(GLOBAL_TEXT_PRESET_SHORTCUT_ID, accelerators[GLOBAL_TEXT_PRESET_SHORTCUT_ID] ?? '')]]);
  let _0x163a47 = ![];
  let _0x2835a9 = ![];
  let _0x16924a = null;
  let _0x427788 = null;
  let _0x2379ca = '';
  let _0x4a51e4 = '';
  let _0x1e60a7 = 0x0;
  let _0x34c938 = 0x0;
  const _0x39850b = new Map(Array["from"](_0x1d6acd["values"](), _0x2dee87 => [_0x2dee87["actionId"], {
    'ok': ![],
    'actionId': _0x2dee87["actionId"],
    'registered': ![],
    'accelerator': _0x2dee87['accelerator'],
    'reason': _0x2dee87['accelerator'] ? 'not-registered' : "unbound"
  }]));
  function _0xd810c5(_0x2412f9) {
    const _0x4e5976 = _0x3c42a0?.();
    if (!_0x4e5976 || _0x4e5976["isDestroyed"]?.()) {
      return;
    }
    if (_0x4e5976["webContents"]?.["isDestroyed"]?.()) {
      return;
    }
    try {
      _0x4e5976["webContents"]?.['send']?.("textPreset:globalShortcutStatus", _0x2412f9);
    } catch {}
  }
  function _0x5b9b26(_0x4fca44 = null) {
    if (_0x4fca44 && typeof _0x4fca44 === "object") {
      _0xd810c5(_0x4fca44);
      return;
    }
    _0x39850b["forEach"](_0x111466 => _0xd810c5({
      ..._0x111466
    }));
  }
  function _0x448c58(_0x5d70e9, _0x4dfb68 = {}) {
    const _0x276455 = _0x1d6acd['get'](_0x5d70e9);
    if (!_0x276455) {
      return null;
    }
    const _0x428793 = {
      ...(_0x39850b["get"](_0x5d70e9) || {}),
      ..._0x4dfb68,
      'actionId': _0x5d70e9,
      'accelerator': _0x276455['accelerator'],
      'updatedAt': Date['now']()
    };
    _0x39850b["set"](_0x5d70e9, _0x428793);
    _0xd810c5({
      ..._0x428793
    });
    return _0x428793;
  }
  function _0x125fa5(_0x4b3436, _0x51c83f, _0x4f22f1 = '') {
    try {
      logDiagnosticEvent({
        'type': "global_capture.selection_read",
        'level': _0x51c83f?.['ok'] === !![] && _0x4f22f1 ? "info" : 'warn',
        'source': 'main',
        'message': _0x51c83f?.['ok'] === !![] && _0x4f22f1 ? "Global selected text read succeeded" : "Global selected text read returned no text",
        'context': {
          'shortcutActionId': _0x4b3436,
          'ok': _0x51c83f?.['ok'] === !![] && Boolean(_0x4f22f1),
          'reason': String(_0x51c83f?.["reason"] || (_0x4f22f1 ? '' : "no-selected-text")),
          'captureSource': String(_0x51c83f?.['source'] || "clipboard-shortcut"),
          'programName': String(_0x51c83f?.["programName"] || ''),
          'method': Number(_0x51c83f?.["method"]) || 0x0,
          'textLength': _0x4f22f1['length']
        }
      });
    } catch {}
  }
  async function _0x3853b0(_0x39f166) {
    if (_0x39f166 === "source-text") {
      return;
    }
    try {
      await _0x5edc77?.();
    } catch (_0x3ca998) {
      logDiagnosticEvent({
        'type': "global_capture.focus_failed",
        'level': "warn",
        'source': "main",
        'message': "Canvas focus failed after global capture action",
        'error': _0x3ca998,
        'context': {
          'actionId': _0x39f166
        }
      });
    }
  }
  async function _0xa1de05(_0x29f7e8 = {}, {
    signal: _0x2e2000
  } = {}) {
    const _0x45f106 = String(_0x29f7e8?.["actionId"] || '')['trim']();
    if (!SUPPORTED_CAPTURE_ACTION_IDS["has"](_0x45f106)) {
      return {
        'ok': ![],
        'reason': "invalid-action"
      };
    }
    const _0x31f935 = {
      'eventId': String(_0x29f7e8?.["eventId"] || '')["trim"]() || "global-capture-" + Date["now"]() + '-' + ++_0x1e60a7,
      'text': String(_0x29f7e8?.["text"] || '')["trim"](),
      'actionId': _0x45f106,
      'runImmediately': _0x29f7e8?.["runImmediately"] === !![],
      'source': String(_0x29f7e8?.["source"] || "globalShortcut"),
      'createdAt': Number(_0x29f7e8?.["createdAt"]) || Date["now"]()
    };
    if (!_0x31f935["text"]) {
      return {
        'ok': ![],
        'reason': "no-selected-text"
      };
    }
    const _0x259095 = delivery['enqueue'](_0x31f935, {
      'signal': _0x2e2000
    });
    if (!_0x259095['ok']) {
      return _0x259095;
    }
    const _0x2c0d3f = _0x3c42a0?.();
    if (_0x2c0d3f && !_0x2c0d3f['isDestroyed']?.() && !_0x2c0d3f["webContents"]?.["isDestroyed"]?.()) {
      try {
        _0x2c0d3f["webContents"]?.['send']?.('textPreset:selectedTextReady', _0x31f935);
      } catch {}
    }
    return {
      ...(await _0x259095["completion"]),
      'event': _0x31f935
    };
  }
  async function _0x3d65fa(_0x370e4c = {}, {
    signal: _0x46ccd6
  } = {}) {
    if (_0x2835a9 || _0x46ccd6?.["aborted"]) {
      return {
        'ok': ![],
        'reason': "capture-cancelled"
      };
    }
    const _0x1fb57c = String(_0x370e4c?.["actionId"] || '')['trim']();
    if (!SUPPORTED_CAPTURE_ACTION_IDS["has"](_0x1fb57c)) {
      return {
        'ok': ![],
        'reason': 'invalid-action'
      };
    }
    _0x2379ca = '';
    _0x4a51e4 = '';
    await _0x3853b0(_0x1fb57c);
    if (_0x2835a9 || _0x46ccd6?.["aborted"]) {
      return {
        'ok': ![],
        'reason': "capture-cancelled"
      };
    }
    const _0x3580db = await _0xa1de05(_0x370e4c, {
      'signal': _0x46ccd6
    });
    _0x448c58(GLOBAL_CAPTURE_LAUNCHER_SHORTCUT_ID, {
      'ok': _0x3580db['ok'] === !![],
      'registered': _0x1d6acd["get"](GLOBAL_CAPTURE_LAUNCHER_SHORTCUT_ID)?.['registered'] === !![],
      'reason': _0x3580db['ok'] === !![] ? "dispatched" : _0x3580db["reason"]
    });
    return _0x3580db;
  }
  async function _0x5c71ee(_0x40daf2) {
    const _0x3023a3 = _0x40daf2 === GLOBAL_CAPTURE_LAUNCHER_SHORTCUT_ID;
    const _0x4aea21 = _0x3023a3 ? Date["now"]() + '-' + ++_0x34c938 : '';
    const _0x1f6dc2 = _0x1d6acd['get'](_0x40daf2)?.["accelerator"] || "Alt+C";
    try {
      _0x3023a3 && (_0x2379ca = _0x4aea21, _0x4a51e4 = "capturing");
      const _0x361155 = Promise["resolve"](copySelectedText())['then'](_0x341ed => ({
        'status': 'fulfilled',
        'value': _0x341ed
      }), _0x208185 => ({
        'status': "rejected",
        'reason': _0x208185
      }));
      if (_0x3023a3) {
        const _0x2beda3 = await showCapturePanel({
          'captureId': _0x4aea21,
          'text': '',
          'phase': "capturing",
          'shortcutLabel': _0x1f6dc2
        });
        if (!_0x2beda3?.['ok']) {
          _0x2379ca === _0x4aea21 && (_0x2379ca = '', _0x4a51e4 = '');
          const _0xa31fe0 = _0x2beda3?.['reason'] || 'panel-failed';
          _0x448c58(_0x40daf2, {
            'ok': ![],
            'registered': _0x1d6acd["get"](_0x40daf2)?.['registered'] === !![],
            'reason': _0xa31fe0
          });
          await _0x361155;
          return {
            'ok': ![],
            'reason': _0xa31fe0
          };
        }
      }
      const _0x103ea3 = await _0x361155;
      if (_0x2835a9 || _0x3023a3 && _0x2379ca !== _0x4aea21) {
        return {
          'ok': ![],
          'reason': 'capture-cancelled'
        };
      }
      if (_0x103ea3["status"] === 'rejected') {
        throw _0x103ea3["reason"];
      }
      const _0x5c415b = _0x103ea3["value"];
      if (!_0x5c415b?.['ok']) {
        const _0x5c3149 = _0x5c415b?.["reason"] || "copy-failed";
        _0x125fa5(_0x40daf2, _0x5c415b);
        if (_0x3023a3) {
          _0x2379ca = _0x4aea21;
          _0x4a51e4 = "error";
          const _0x577f06 = await showCapturePanel({
            'captureId': _0x4aea21,
            'text': '',
            'phase': "error",
            'errorReason': _0x5c3149,
            'shortcutLabel': _0x1f6dc2
          });
          _0x577f06?.['ok'] !== !![] && _0x2379ca === _0x4aea21 && (_0x2379ca = '', _0x4a51e4 = '');
        }
        _0x448c58(_0x40daf2, {
          'ok': ![],
          'registered': _0x1d6acd["get"](_0x40daf2)?.["registered"] === !![],
          'reason': _0x5c3149
        });
        return {
          'ok': ![],
          'reason': _0x5c3149
        };
      }
      const _0x4b743d = typeof _0x5c415b?.["text"] === 'string' ? _0x5c415b["text"] : clipboardApi?.["readText"]?.() || '';
      const _0x755be8 = String(_0x4b743d)["trim"]();
      if (!_0x755be8) {
        _0x125fa5(_0x40daf2, _0x5c415b);
        if (_0x3023a3) {
          _0x2379ca = _0x4aea21;
          _0x4a51e4 = 'error';
          const _0x4eedc9 = await showCapturePanel({
            'captureId': _0x4aea21,
            'text': '',
            'phase': "error",
            'errorReason': "no-selected-text",
            'shortcutLabel': _0x1f6dc2
          });
          _0x4eedc9?.['ok'] !== !![] && _0x2379ca === _0x4aea21 && (_0x2379ca = '', _0x4a51e4 = '');
        }
        _0x448c58(_0x40daf2, {
          'ok': ![],
          'registered': _0x1d6acd["get"](_0x40daf2)?.["registered"] === !![],
          'reason': "no-selected-text"
        });
        return {
          'ok': ![],
          'reason': 'no-selected-text'
        };
      }
      _0x125fa5(_0x40daf2, _0x5c415b, _0x755be8);
      if (_0x40daf2 === GLOBAL_TEXT_PRESET_SHORTCUT_ID) {
        const _0x4c1b70 = await _0x3d65fa({
          'text': _0x755be8,
          'actionId': 'preset-draft',
          'runImmediately': ![],
          'source': "globalShortcut"
        });
        _0x448c58(_0x40daf2, {
          'ok': _0x4c1b70['ok'] === !![],
          'registered': _0x1d6acd["get"](_0x40daf2)?.["registered"] === !![],
          'reason': _0x4c1b70['ok'] === !![] ? 'dispatched' : _0x4c1b70["reason"]
        });
        return _0x4c1b70;
      }
      _0x2379ca = _0x4aea21;
      _0x4a51e4 = "ready";
      const _0x3e0211 = await showCapturePanel({
        'captureId': _0x4aea21,
        'text': _0x755be8,
        'phase': "ready",
        'shortcutLabel': _0x1f6dc2
      });
      _0x3e0211?.['ok'] !== !![] && _0x2379ca === _0x4aea21 && (_0x2379ca = '', _0x4a51e4 = '', hideCapturePanel?.());
      _0x448c58(_0x40daf2, {
        'ok': _0x3e0211?.['ok'] === !![],
        'registered': _0x1d6acd["get"](_0x40daf2)?.['registered'] === !![],
        'reason': _0x3e0211?.['ok'] === !![] ? 'shown' : _0x3e0211?.["reason"] || "panel-failed"
      });
      return _0x3e0211?.['ok'] === !![] ? {
        'ok': !![],
        'captureId': _0x4aea21,
        'text': _0x755be8
      } : {
        'ok': ![],
        'reason': _0x3e0211?.["reason"] || 'panel-failed'
      };
    } catch (_0x4d84d5) {
      if (_0x2835a9 || _0x3023a3 && _0x2379ca !== _0x4aea21) {
        return {
          'ok': ![],
          'reason': 'capture-cancelled'
        };
      }
      if (_0x3023a3) {
        _0x2379ca = _0x4aea21;
        _0x4a51e4 = 'error';
        try {
          const _0x1d5666 = await showCapturePanel({
            'captureId': _0x4aea21,
            'text': '',
            'phase': "error",
            'errorReason': "capture-failed",
            'shortcutLabel': _0x1f6dc2
          });
          _0x1d5666?.['ok'] !== !![] && _0x2379ca === _0x4aea21 && (_0x2379ca = '', _0x4a51e4 = '');
        } catch {
          _0x2379ca === _0x4aea21 && (_0x2379ca = '', _0x4a51e4 = '');
        }
      }
      _0x448c58(_0x40daf2, {
        'ok': ![],
        'registered': _0x1d6acd["get"](_0x40daf2)?.["registered"] === !![],
        'reason': 'capture-failed'
      });
      logDiagnosticEvent({
        'type': "global_capture.capture_failed",
        'level': "error",
        'source': "main",
        'message': "Global selected text capture failed",
        'error': _0x4d84d5,
        'context': {
          'shortcutActionId': _0x40daf2
        }
      });
      return {
        'ok': ![],
        'reason': 'capture-failed'
      };
    }
  }
  function _0x201720(_0x498c2c) {
    if (_0x2835a9) {
      return Promise['resolve']({
        'ok': ![],
        'reason': 'capture-controller-destroyed'
      });
    }
    const _0x2afa04 = _0x5c71ee(_0x498c2c);
    const _0x2f4df8 = _0x2afa04["finally"](() => {
      if (_0x16924a === _0x2f4df8) {
        _0x16924a = null;
      }
    });
    _0x16924a = _0x2f4df8;
    return _0x2f4df8;
  }
  function _0x191956(_0x3a183c, _0x3f84a0) {
    if (_0x427788) {
      return _0x427788;
    }
    const _0x4fe888 = _0x3a183c["then"](_0x1ea063 => {
      if (_0x1ea063?.['ok'] === !![]) {
        return _0x1ea063;
      }
      return _0x201720(_0x3f84a0);
    });
    const _0x12d2ac = _0x4fe888['finally'](() => {
      if (_0x427788 === _0x12d2ac) {
        _0x427788 = null;
      }
    });
    _0x427788 = _0x12d2ac;
    return _0x12d2ac;
  }
  async function _0x5c4932(_0x401bfa = GLOBAL_CAPTURE_LAUNCHER_SHORTCUT_ID) {
    if (_0x2835a9) {
      return {
        'ok': ![],
        'reason': 'capture-controller-destroyed'
      };
    }
    if (!SUPPORTED_SHORTCUT_IDS["has"](_0x401bfa)) {
      return {
        'ok': ![],
        'reason': "invalid-shortcut-action"
      };
    }
    if (_0x401bfa === GLOBAL_CAPTURE_LAUNCHER_SHORTCUT_ID && (isCapturePanelVisible?.() || _0x2379ca)) {
      const _0x4c501d = _0x4a51e4 === "error";
      _0x2379ca = '';
      _0x4a51e4 = '';
      _0x427788 = null;
      hideCapturePanel?.();
      if (_0x4c501d) {
        _0x448c58(_0x401bfa, {
          'ok': !![],
          'registered': _0x1d6acd["get"](_0x401bfa)?.["registered"] === !![],
          'reason': "retrying"
        });
      } else {
        _0x448c58(_0x401bfa, {
          'ok': !![],
          'registered': _0x1d6acd["get"](_0x401bfa)?.['registered'] === !![],
          'reason': "dismissed"
        });
        return {
          'ok': !![],
          'dismissed': !![]
        };
      }
    }
    if (_0x16924a) {
      return _0x191956(_0x16924a, _0x401bfa);
    }
    try {
      return await _0x201720(_0x401bfa);
    } catch {
      return {
        'ok': ![],
        'reason': 'capture-failed'
      };
    }
  }
  function _0x2ca521(_0x5c5736) {
    if (_0x5c5736) {
      _0x5c5736["held"] = ![];
    }
    if (!_0x5c5736?.["registered"] || !_0x5c5736['accelerator']) {
      return;
    }
    try {
      globalShortcutApi?.["unregister"]?.(_0x5c5736["accelerator"]);
    } catch {}
    _0x5c5736["registered"] = ![];
  }
  function _0x110ef6(_0xc52e9a) {
    if (!_0xc52e9a["accelerator"]) {
      _0xc52e9a["registered"] = ![];
      _0x448c58(_0xc52e9a["actionId"], {
        'ok': !![],
        'registered': ![],
        'reason': "unbound"
      });
      return !![];
    }
    let _0x137881 = ![];
    try {
      _0x137881 = globalShortcutApi?.["register"]?.(_0xc52e9a['accelerator'], () => {
        if (_0xc52e9a["held"] || _0x2835a9) {
          return;
        }
        _0xc52e9a["held"] = !![];
        void _0x5c4932(_0xc52e9a["actionId"])['finally'](() => {
          if (!hasKeyReleaseTracking()) {
            _0xc52e9a["held"] = ![];
          }
        });
      }) === !![];
    } catch (_0x51bcf0) {
      logDiagnosticEvent({
        'type': "global_capture.shortcut_register_failed",
        'level': 'error',
        'source': "main",
        'message': "Global capture shortcut registration threw",
        'error': _0x51bcf0,
        'context': {
          'actionId': _0xc52e9a["actionId"],
          'accelerator': _0xc52e9a["accelerator"]
        }
      });
    }
    _0xc52e9a["registered"] = _0x137881;
    _0x448c58(_0xc52e9a["actionId"], {
      'ok': _0x137881,
      'registered': _0x137881,
      'reason': _0x137881 ? "registered" : 'registration-failed'
    });
    return _0x137881;
  }
  function _0x483acb() {
    if (_0x2835a9) {
      return ![];
    }
    if (_0x163a47) {
      return _0x1d6acd['get'](GLOBAL_CAPTURE_LAUNCHER_SHORTCUT_ID)?.['registered'] === !![];
    }
    _0x163a47 = !![];
    let _0x329ed2 = !![];
    _0x1d6acd['forEach'](_0x264cf5 => {
      if (!_0x110ef6(_0x264cf5)) {
        _0x329ed2 = ![];
      }
    });
    return _0x329ed2;
  }
  function _0x385626() {
    _0x1d6acd["forEach"](_0x2ca521);
    _0x163a47 = ![];
  }
  function _0x391f08(_0x261272 = {}) {
    if (_0x261272["injected"] === !![]) {
      return;
    }
    const _0x1d9284 = normalizeShortcutToken(_0x261272["uniKey"]);
    for (const _0x987785 of _0x1d6acd['values']()) {
      if (_0x261272["keysReleased"] === !![] || _0x987785["accelerator"]["split"]('+')["includes"](_0x1d9284)) {
        _0x987785['held'] = ![];
      }
    }
  }
  function _0x554bde() {
    _0x2835a9 = !![];
    _0x2379ca = '';
    _0x4a51e4 = '';
    _0x427788 = null;
    _0x385626();
    delivery["destroy"]();
  }
  function _0x5470b1(_0xc6243 = {}) {
    const _0x2b2efc = String(_0xc6243?.["actionId"] || GLOBAL_CAPTURE_LAUNCHER_SHORTCUT_ID)["trim"]();
    if (!SUPPORTED_SHORTCUT_IDS["has"](_0x2b2efc)) {
      return {
        'ok': ![],
        'actionId': _0x2b2efc,
        'registered': ![],
        'reason': "invalid-action"
      };
    }
    const _0x55d598 = normalizeGlobalShortcutPayload(_0xc6243, {
      'allowEmpty': !![]
    });
    const _0xadcfc = _0x1d6acd["get"](_0x2b2efc);
    if (!_0x55d598['ok']) {
      return {
        ..._0x448c58(_0x2b2efc, {
          'ok': ![],
          'registered': _0xadcfc["registered"] === !![],
          'reason': _0x55d598['reason'] || "invalid-shortcut"
        })
      };
    }
    if (_0x55d598['accelerator'] === _0xadcfc['accelerator']) {
      if (_0x163a47 && _0xadcfc["accelerator"] && !_0xadcfc["registered"]) {
        _0x110ef6(_0xadcfc);
      }
      _0x5b9b26(_0x39850b["get"](_0x2b2efc));
      return {
        ..._0x39850b['get'](_0x2b2efc)
      };
    }
    _0x2ca521(_0xadcfc);
    _0xadcfc['accelerator'] = _0x55d598["accelerator"];
    _0x39850b["set"](_0x2b2efc, {
      'ok': ![],
      'actionId': _0x2b2efc,
      'registered': ![],
      'accelerator': _0xadcfc["accelerator"],
      'reason': _0xadcfc["accelerator"] ? 'not-registered' : "unbound"
    });
    if (_0x163a47) {
      _0x110ef6(_0xadcfc);
    } else {
      _0x5b9b26(_0x39850b['get'](_0x2b2efc));
    }
    return {
      ..._0x39850b["get"](_0x2b2efc)
    };
  }
  function _0x3e2c90() {
    return delivery["consumeEvents"]();
  }
  function _0x20c4c1(_0xe1a447 = {}) {
    const _0x1a0685 = String(_0xe1a447?.["actionId"] || GLOBAL_CAPTURE_LAUNCHER_SHORTCUT_ID)["trim"]();
    return _0x39850b["has"](_0x1a0685) ? {
      ..._0x39850b["get"](_0x1a0685)
    } : {
      'ok': ![],
      'actionId': _0x1a0685,
      'registered': ![],
      'reason': 'invalid-action'
    };
  }
  return {
    'captureSelectedText': _0x5c4932,
    'destroy': _0x554bde,
    'releaseShortcutKey': _0x391f08,
    'configureGlobalShortcut': _0x5470b1,
    'consumeEvents': _0x3e2c90,
    'claimEvent': delivery["claim"],
    'acknowledgeEvent': delivery["acknowledge"],
    'dispatchCaptureAction': _0x3d65fa,
    'getShortcutStatus': _0x20c4c1,
    'installGlobalShortcut': _0x483acb,
    'sendShortcutStatus': _0x5b9b26,
    'uninstallGlobalShortcut': _0x385626
  };
}
export const __globalTextPresetShortcutControllerForTest = {
  'normalizeGlobalShortcutPayload': normalizeGlobalShortcutPayload
};