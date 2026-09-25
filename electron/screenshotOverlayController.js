import { BrowserWindow, desktopCapturer, globalShortcut, screen } from 'electron';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import a284_0x2dcfe2 from 'node:path';
export function createScreenshotOverlayController({
  appRoot: _0x1f8e29,
  dirname: _0x282c60,
  accelerator: _0x4ac327,
  getMainWindow: _0x12c677,
  focusCanvas = () => {},
  logDiagnosticEvent: _0x17c9ff
}) {
  function _0x2fb396(_0x4837be) {
    const _0x1e848d = String(_0x4837be || '')["trim"]();
    if (!_0x1e848d) {
      return '';
    }
    const _0x3e027c = _0x1e848d["toLowerCase"]();
    if (_0x3e027c === "ctrl" || _0x3e027c === "control" || _0x3e027c === 'cmdorctrl' || _0x3e027c === "commandorcontrol" || _0x3e027c === "commandorctrl") {
      return "CommandOrControl";
    }
    if (_0x3e027c === 'shift') {
      return "Shift";
    }
    if (_0x3e027c === "alt" || _0x3e027c === "option") {
      return 'Alt';
    }
    if (_0x3e027c === "space") {
      return "Space";
    }
    if (_0x3e027c === "backquote" || _0x1e848d === '`' || _0x1e848d === '~') {
      return '`';
    }
    if (/^f([1-9]|1[0-9]|2[0-4])$/i["test"](_0x1e848d)) {
      return _0x1e848d['toUpperCase']();
    }
    if (/^[a-z]$/i['test'](_0x1e848d)) {
      return _0x1e848d["toUpperCase"]();
    }
    if (/^[0-9]$/["test"](_0x1e848d)) {
      return _0x1e848d;
    }
    const _0x3e0d54 = new Map([["enter", "Enter"], ["return", "Enter"], ['tab', "Tab"], ["escape", "Escape"], ['esc', "Escape"], ["backspace", 'Backspace'], ["delete", "Delete"], ["del", "Delete"], ["insert", 'Insert'], ["ins", "Insert"], ["home", "Home"], ['end', "End"], ["pageup", 'PageUp'], ["pagedown", "PageDown"], ['up', 'Up'], ["down", "Down"], ["left", "Left"], ['right', 'Right'], ['+', 'Plus'], ['=', 'Plus'], ['-', "Minus"], [',', "Comma"], ['.', "Period"], ['/', "Slash"], ['\x5c', "Backslash"], [';', "Semicolon"], ['\x27', 'Quote'], ['[', "BracketLeft"], [']', "BracketRight"]]);
    return _0x3e0d54["get"](_0x3e027c) || '';
  }
  function _0x29dd68(_0x99cbe6) {
    const _0x30174c = (Array["isArray"](_0x99cbe6) ? _0x99cbe6 : [])["map"](_0x167c85 => _0x2fb396(_0x167c85))["filter"](Boolean);
    const _0x2c88f7 = [];
    if (_0x30174c['includes']("CommandOrControl")) {
      _0x2c88f7["push"]("CommandOrControl");
    }
    if (_0x30174c["includes"]("Shift")) {
      _0x2c88f7["push"]("Shift");
    }
    if (_0x30174c["includes"]("Alt")) {
      _0x2c88f7["push"]("Alt");
    }
    const _0x3c4b64 = _0x30174c['filter'](_0x341bde => _0x341bde !== "CommandOrControl" && _0x341bde !== "Shift" && _0x341bde !== "Alt");
    if (_0x3c4b64['length'] !== 0x1) {
      return null;
    }
    return [..._0x2c88f7, _0x3c4b64[0x0]];
  }
  function _0x2d5ad1(_0x4283ed = {}) {
    const _0x11c3d7 = Array['isArray'](_0x4283ed?.["keys"]) ? _0x4283ed['keys'] : typeof _0x4283ed?.['accelerator'] === "string" ? _0x4283ed["accelerator"]["split"]('+') : [];
    const _0x2c5635 = _0x29dd68(_0x11c3d7);
    if (!_0x2c5635) {
      return {
        'ok': ![],
        'reason': 'invalid-shortcut'
      };
    }
    return {
      'ok': !![],
      'accelerator': _0x2c5635['join']('+'),
      'keys': _0x2c5635
    };
  }
  const _0xbc04ed = _0x2d5ad1({
    'accelerator': _0x4ac327 || "Alt+Q"
  });
  const _0x230057 = _0xbc04ed['ok'] ? _0xbc04ed["accelerator"] : "Alt+Q";
  let _0x46094c = _0x230057;
  let _0x3a630f = null;
  let _0x536c32 = null;
  let _0x36e2b3 = null;
  let _0x1082c8 = '';
  let _0x356055 = ![];
  let _0x327000 = '';
  let _0x3422f0 = null;
  const _0x292958 = [];
  let _0xeaa991 = {
    'ok': ![],
    'registered': ![],
    'accelerator': _0x46094c,
    'reason': 'not-registered'
  };
  function _0x3a7f0c(_0x5b69f6, _0x14077b, _0x4d26e6 = 0x14) {
    _0x5b69f6["push"](_0x14077b);
    while (_0x5b69f6["length"] > _0x4d26e6) {
      _0x5b69f6["shift"]();
    }
  }
  function _0x1f74a0(_0x271094, _0x4e5106, _0xeb4cc0) {
    const _0x2c5ccf = Number(_0x271094);
    if (!Number["isFinite"](_0x2c5ccf)) {
      return _0x4e5106;
    }
    return Math["min"](_0xeb4cc0, Math["max"](_0x4e5106, _0x2c5ccf));
  }
  async function _0x744df4() {
    const _0x6b98cc = screen['getCursorScreenPoint']();
    const _0x28711d = screen["getDisplayNearestPoint"](_0x6b98cc);
    const _0x59031c = Number(_0x28711d?.["scaleFactor"] || 0x1) || 0x1;
    const _0x1e8e8d = _0x28711d?.["bounds"] || {
      'x': 0x0,
      'y': 0x0,
      'width': 0x0,
      'height': 0x0
    };
    const _0x35bafa = {
      'width': Math["max"](0x1, Math["round"](Number(_0x1e8e8d["width"] || 0x1) * _0x59031c)),
      'height': Math["max"](0x1, Math['round'](Number(_0x1e8e8d["height"] || 0x1) * _0x59031c))
    };
    const _0x95df5f = await desktopCapturer["getSources"]({
      'types': ["screen"],
      'thumbnailSize': _0x35bafa
    });
    const _0x516b10 = _0x95df5f["find"](_0x14d183 => String(_0x14d183["display_id"] || '') === String(_0x28711d['id'])) || _0x95df5f[0x0];
    const _0x4b9dd5 = _0x516b10?.["thumbnail"];
    if (!_0x4b9dd5 || _0x4b9dd5["isEmpty"]()) {
      return {
        'ok': ![],
        'reason': "no-image"
      };
    }
    return {
      'ok': !![],
      'mimeType': "image/png",
      'dataUrl': _0x4b9dd5["toDataURL"](),
      'display': {
        'id': String(_0x28711d['id']),
        'scaleFactor': _0x59031c,
        'bounds': {
          'x': _0x1e8e8d['x'],
          'y': _0x1e8e8d['y'],
          'width': _0x1e8e8d['width'],
          'height': _0x1e8e8d['height']
        },
        'imageSize': _0x4b9dd5["getSize"]()
      },
      'cursor': {
        'screenX': Math['round'](_0x6b98cc['x']),
        'screenY': Math["round"](_0x6b98cc['y']),
        'x': Math["round"](_0x1f74a0(_0x6b98cc['x'] - _0x1e8e8d['x'], 0x0, Math['max'](0x0, _0x1e8e8d["width"]))),
        'y': Math["round"](_0x1f74a0(_0x6b98cc['y'] - _0x1e8e8d['y'], 0x0, Math["max"](0x0, _0x1e8e8d['height'])))
      }
    };
  }
  function _0x149064(_0x1591fa = _0xeaa991) {
    const _0x3b60dd = _0x12c677();
    if (!_0x3b60dd || _0x3b60dd["isDestroyed"]()) {
      return;
    }
    if (_0x3b60dd["webContents"]["isDestroyed"]()) {
      return;
    }
    _0x3b60dd["webContents"]["send"]("screenshot:globalShortcutStatus", {
      'accelerator': _0x46094c,
      ..._0x1591fa
    });
  }
  function _0xa68ba2(_0x6963f1 = {}) {
    _0xeaa991 = {
      'accelerator': _0x46094c,
      ..._0xeaa991,
      ..._0x6963f1,
      'accelerator': _0x46094c
    };
    _0x149064();
  }
  function _0x762269() {
    if (!_0x3a630f || _0x3a630f["isDestroyed"]()) {
      return;
    }
    void _0x3a630f["webContents"]["executeJavaScript"]('window.__resetScreenshotOverlay?.()');
    _0x3a630f['setOpacity'](0x1);
    _0x3a630f["setAlwaysOnTop"](![]);
    _0x3a630f["hide"]();
  }
  function _0x3be286() {
    _0x536c32 = null;
    if (!_0x3a630f || _0x3a630f["isDestroyed"]()) {
      return;
    }
    _0x3a630f["destroy"]();
  }
  function _0x51b055(_0x5e3076 = {}) {
    const _0x551fec = _0x5e3076?.["display"]?.["bounds"];
    if (_0x551fec && _0x551fec["width"] > 0x0 && _0x551fec['height'] > 0x0) {
      return {
        'x': Math['round'](_0x551fec['x']),
        'y': Math['round'](_0x551fec['y']),
        'width': Math['round'](_0x551fec["width"]),
        'height': Math["round"](_0x551fec["height"])
      };
    }
    const _0x5830df = screen["getDisplayNearestPoint"](screen['getCursorScreenPoint']())?.["bounds"];
    return _0x5830df || {
      'x': 0x0,
      'y': 0x0,
      'width': 0x500,
      'height': 0x2d0
    };
  }
  function _0x41cad7() {
    return {
      'x': -0x7d00,
      'y': -0x7d00,
      'width': 0x1,
      'height': 0x1
    };
  }
  async function _0x5c3690(_0x1d4d4d = null) {
    if (_0x3a630f && !_0x3a630f['isDestroyed']()) {
      if (_0x536c32) {
        await _0x536c32;
      }
      return _0x3a630f;
    }
    const _0x3d928f = _0x1d4d4d ? _0x51b055(_0x1d4d4d) : _0x41cad7();
    _0x3a630f = new BrowserWindow({
      ..._0x3d928f,
      'title': "Screenshot Overlay",
      'show': ![],
      'frame': ![],
      'transparent': !![],
      'paintWhenInitiallyHidden': !![],
      'fullscreen': ![],
      'fullscreenable': ![],
      'alwaysOnTop': ![],
      'skipTaskbar': !![],
      'resizable': ![],
      'movable': ![],
      'minimizable': ![],
      'maximizable': ![],
      'backgroundColor': "#00000000",
      'webPreferences': {
        'preload': a284_0x2dcfe2["join"](_0x282c60, 'screenshotOverlayPreload.cjs'),
        'contextIsolation': !![],
        'nodeIntegration': ![],
        'sandbox': !![]
      }
    });
    _0x3a630f['on']("closed", () => {
      _0x3a630f = null;
      _0x536c32 = null;
    });
    _0x536c32 = _0x3a630f["loadFile"](a284_0x2dcfe2["join"](_0x282c60, "screenshotOverlay.html"))['catch'](_0xc3a3ef => {
      _0x536c32 = null;
      throw _0xc3a3ef;
    });
    await _0x536c32;
    return _0x3a630f;
  }
  function _0x419e03() {
    if (_0x3422f0) {
      return _0x3422f0;
    }
    _0x3422f0 = _0x5c3690()["catch"](_0x2e4e3b => {
      _0x17c9ff({
        'type': "screenshot.global_overlay_prewarm_failed",
        'level': 'warn',
        'source': 'main',
        'message': "Global screenshot overlay prewarm failed",
        'error': _0x2e4e3b
      });
    })["finally"](() => {
      _0x3422f0 = null;
    });
    return _0x3422f0;
  }
  async function _0x5dea67(_0x4ab455) {
    const _0x10cede = await _0x5c3690();
    if (!_0x10cede || _0x10cede["isDestroyed"]()) {
      return ![];
    }
    _0x10cede["setOpacity"](0x1);
    _0x10cede["setBounds"](_0x4ab455 || _0x51b055());
    await _0x10cede["webContents"]["executeJavaScript"]("window.__prepareScreenshotOverlay ? window.__prepareScreenshotOverlay() : window.__resetScreenshotOverlay?.()");
    _0x10cede["setAlwaysOnTop"](!![], 'screen-saver');
    _0x10cede["setVisibleOnAllWorkspaces"](!![], {
      'visibleOnFullScreen': !![]
    });
    _0x10cede['show']();
    _0x10cede['focus']();
    return !![];
  }
  async function _0x3019f1(_0x49df11) {
    if (!_0x3a630f || _0x3a630f["isDestroyed"]()) {
      return ![];
    }
    const _0x22c0e6 = await _0x3a630f['webContents']["executeJavaScript"]('window.__startScreenshotOverlay(' + JSON["stringify"](_0x49df11) + ')');
    if (!_0x22c0e6) {
      return ![];
    }
    return !![];
  }
  async function _0x116d85() {
    if (_0x3a630f && !_0x3a630f["isDestroyed"]() && _0x3a630f["isVisible"]()) {
      _0x3a630f["show"]();
      _0x3a630f["focus"]();
      return;
    }
    try {
      const _0x281e79 = _0x51b055();
      const _0x5ad0bb = await _0x5dea67(_0x281e79);
      if (!_0x5ad0bb) {
        _0xa68ba2({
          'ok': ![],
          'registered': _0xeaa991["registered"] === !![],
          'reason': "overlay-start-failed"
        });
        return;
      }
      const _0x4c9348 = await _0x744df4();
      if (!_0x4c9348?.['ok']) {
        _0x762269();
        _0xa68ba2({
          'ok': ![],
          'registered': _0xeaa991["registered"] === !![],
          'reason': _0x4c9348?.['reason'] || "capture-failed"
        });
        _0x17c9ff({
          'type': "screenshot.global_capture_failed",
          'level': 'warn',
          'source': "main",
          'message': "Global screenshot capture failed",
          'context': _0x4c9348 || {}
        });
        return;
      }
      const _0x41a462 = await _0x3019f1(_0x4c9348);
      !_0x41a462 && (_0x762269(), _0xa68ba2({
        'ok': ![],
        'registered': _0xeaa991['registered'] === !![],
        'reason': "overlay-start-failed"
      }), _0x17c9ff({
        'type': "screenshot.global_overlay_start_failed",
        'level': "warn",
        'source': "main",
        'message': "Global screenshot overlay failed to start",
        'context': {
          'display': _0x4c9348['display'],
          'cursor': _0x4c9348["cursor"]
        }
      }));
    } catch (_0x1ad3dd) {
      _0x762269();
      _0xa68ba2({
        'ok': ![],
        'registered': _0xeaa991["registered"] === !![],
        'reason': "capture-failed",
        'error': String(_0x1ad3dd?.['message'] || _0x1ad3dd)
      });
      _0x17c9ff({
        'type': "screenshot.global_overlay_failed",
        'level': "error",
        'source': 'main',
        'message': "Global screenshot overlay failed",
        'error': _0x1ad3dd
      });
    }
  }
  function _0x50cb3b() {
    if (_0x356055 && _0x327000 === _0x46094c) {
      return;
    }
    _0x396122();
    let _0x5729f7 = ![];
    try {
      _0x5729f7 = globalShortcut["register"](_0x46094c, () => {
        void _0x116d85();
      });
    } catch (_0x4f57ec) {
      _0x17c9ff({
        'type': "screenshot.global_shortcut_register_failed",
        'level': "error",
        'source': "main",
        'message': "Global screenshot shortcut registration threw",
        'error': _0x4f57ec
      });
    }
    _0x356055 = _0x5729f7;
    _0x327000 = _0x5729f7 ? _0x46094c : '';
    _0xa68ba2({
      'ok': _0x5729f7,
      'registered': _0x5729f7,
      'reason': _0x5729f7 ? "registered" : "registration-failed"
    });
    if (_0x5729f7) {
      void _0x419e03();
    }
    _0x17c9ff({
      'type': _0x5729f7 ? 'screenshot.global_shortcut_registered' : "screenshot.global_shortcut_register_failed",
      'level': _0x5729f7 ? "info" : "warn",
      'source': 'main',
      'message': _0x5729f7 ? "Global screenshot shortcut registered" : 'Global\x20screenshot\x20shortcut\x20registration\x20failed',
      'context': {
        'accelerator': _0x46094c
      }
    });
  }
  function _0x4aa5d7() {
    if (_0x20cb1d() && _0x5025a7()) {
      _0xa68ba2({
        'ok': ![],
        'registered': ![],
        'reason': "native-helper-starting"
      });
      return;
    }
    _0x50cb3b();
  }
  function _0x396122() {
    if (!_0x356055 && !_0x327000) {
      return;
    }
    try {
      globalShortcut["unregister"](_0x327000 || _0x46094c);
    } catch {}
    _0x356055 = ![];
    _0x327000 = '';
  }
  function _0x1c797d() {
    _0x4e3756();
    _0x396122();
  }
  function _0x2550f9(_0x32f0b9 = {}) {
    const _0x17230f = _0x2d5ad1(_0x32f0b9);
    if (!_0x17230f['ok']) {
      _0xa68ba2({
        'ok': ![],
        'registered': _0xeaa991["registered"] === !![],
        'reason': _0x17230f["reason"] || "invalid-shortcut"
      });
      return {
        'ok': ![],
        'registered': _0xeaa991["registered"] === !![],
        'accelerator': _0x46094c,
        'reason': _0x17230f["reason"] || "invalid-shortcut"
      };
    }
    if (_0x17230f["accelerator"] === _0x46094c) {
      _0x149064();
      return {
        ..._0xeaa991,
        'ok': _0xeaa991['ok'] === !![],
        'accelerator': _0x46094c
      };
    }
    _0x1c797d();
    _0x46094c = _0x17230f['accelerator'];
    _0xeaa991 = {
      'ok': ![],
      'registered': ![],
      'accelerator': _0x46094c,
      'reason': "not-registered"
    };
    _0x4aa5d7();
    return {
      ..._0xeaa991,
      'accelerator': _0x46094c
    };
  }
  async function _0x4e59df(_0x43a4e8 = {}) {
    const _0x1c08a0 = String(_0x43a4e8?.["pngBase64"] || '')["trim"]();
    if (!_0x1c08a0) {
      return {
        'ok': ![],
        'reason': "empty-payload"
      };
    }
    _0x762269();
    _0x500bee({
      'pngBase64': _0x1c08a0,
      'mimeType': String(_0x43a4e8?.["mimeType"] || "image/png") || "image/png",
      'source': 'globalShortcut',
      'actionId': _0x43a4e8?.["actionId"],
      'runImmediately': _0x43a4e8?.['runImmediately']
    });
    return {
      'ok': !![]
    };
  }
  async function _0x42e30a() {
    _0x762269();
    return {
      'ok': !![]
    };
  }
  function _0x4d8b0d() {
    return a284_0x2dcfe2["join"](_0x1f8e29, "native", "screenshot-helper", "bin", "screenshot-helper.exe");
  }
  function _0x2c9527() {
    return a284_0x2dcfe2["join"](_0x1f8e29, "images", "cursors", 'windows11-concept-v2', "light");
  }
  function _0x20cb1d() {
    return !![];
  }
  function _0x500bee(_0x524a1d = {}) {
    const _0x5b7dad = String(_0x524a1d?.["pngBase64"] || '')['trim']();
    if (!_0x5b7dad) {
      return ![];
    }
    const _0x2deab1 = {
      'pngBase64': _0x5b7dad,
      'mimeType': String(_0x524a1d?.["mimeType"] || "image/png") || "image/png",
      'source': _0x524a1d?.["source"] || "nativeHelper",
      'createdAt': Date['now']()
    };
    _0x524a1d?.["actionId"] === "reverse-prompt" && (_0x2deab1['actionId'] = "reverse-prompt", _0x2deab1['runImmediately'] = _0x524a1d?.["runImmediately"] === !![], Promise["resolve"]()['then'](() => focusCanvas())["catch"](() => {}));
    _0x3a7f0c(_0x292958, _0x2deab1, 0x8);
    const _0xdc73d3 = _0x12c677();
    _0xdc73d3 && !_0xdc73d3['isDestroyed']() && !_0xdc73d3["webContents"]['isDestroyed']() && _0xdc73d3["webContents"]['send']("screenshot:globalCaptureReady", _0x2deab1);
    return !![];
  }
  function _0x583b31() {
    return _0x292958["splice"](0x0, _0x292958['length']);
  }
  function _0x580abf() {
    return {
      ..._0xeaa991,
      'accelerator': _0x46094c
    };
  }
  function _0x33d0b7(_0x4a9953) {
    if (!_0x20cb1d()) {
      return;
    }
    const _0x2fd327 = String(_0x4a9953 || '')["trim"]();
    if (!_0x2fd327) {
      return;
    }
    let _0x4eec1c = null;
    try {
      _0x4eec1c = JSON["parse"](_0x2fd327);
    } catch (_0x1e651c) {
      _0x17c9ff({
        'type': 'screenshot.native_helper_bad_message',
        'level': 'warn',
        'source': "main",
        'message': "Native screenshot helper sent an invalid message",
        'context': {
          'raw': _0x2fd327["slice"](0x0, 0xa0)
        },
        'error': _0x1e651c
      });
      return;
    }
    if (_0x4eec1c?.["type"] === "status") {
      const _0x2d6cf8 = _0x4eec1c['registered'] === !![];
      _0xa68ba2({
        'ok': _0x2d6cf8,
        'registered': _0x2d6cf8,
        'reason': _0x2d6cf8 ? "registered-native" : "native-registration-failed"
      });
      !_0x2d6cf8 && (_0x4e3756(), _0x50cb3b());
      return;
    }
    _0x4eec1c?.["type"] === "capture" && _0x500bee({
      'pngBase64': _0x4eec1c["pngBase64"],
      'mimeType': _0x4eec1c['mimeType'] || 'image/png',
      'source': "nativeHelper",
      'actionId': _0x4eec1c["actionId"],
      'runImmediately': _0x4eec1c["runImmediately"]
    });
  }
  function _0x5025a7() {
    if (process["platform"] !== 'win32') {
      return ![];
    }
    if (_0x36e2b3 && !_0x36e2b3["killed"]) {
      return !![];
    }
    const _0x217e79 = _0x4d8b0d();
    if (!existsSync(_0x217e79)) {
      _0x17c9ff({
        'type': "screenshot.native_helper_missing",
        'level': "warn",
        'source': 'main',
        'message': "Native screenshot helper executable is missing",
        'context': {
          'helperPath': _0x217e79
        }
      });
      return ![];
    }
    try {
      _0x1082c8 = '';
      _0x36e2b3 = spawn(_0x217e79, [], {
        'env': {
          ...process["env"],
          'AICANVAS_CURSOR_DIR': _0x2c9527(),
          'AICANVAS_THEME_TOKENS_PATH': a284_0x2dcfe2["join"](_0x1f8e29, 'styles', "variables.css"),
          'AICANVAS_SCREENSHOT_ACCELERATOR': _0x46094c
        },
        'stdio': ["ignore", 'pipe', "pipe"],
        'windowsHide': !![]
      });
    } catch (_0x3e869a) {
      _0x17c9ff({
        'type': "screenshot.native_helper_start_failed",
        'level': 'error',
        'source': "main",
        'message': "Native screenshot helper failed to start",
        'error': _0x3e869a,
        'context': {
          'helperPath': _0x217e79
        }
      });
      _0x36e2b3 = null;
      return ![];
    }
    _0x36e2b3['stdout']?.['setEncoding']('utf8');
    _0x36e2b3["stdout"]?.['on']("data", _0x4efc1c => {
      _0x1082c8 += String(_0x4efc1c || '');
      let _0x37f448 = _0x1082c8["indexOf"]('\x0a');
      while (_0x37f448 >= 0x0) {
        const _0x1fc63e = _0x1082c8["slice"](0x0, _0x37f448);
        _0x1082c8 = _0x1082c8["slice"](_0x37f448 + 0x1);
        _0x33d0b7(_0x1fc63e);
        _0x37f448 = _0x1082c8["indexOf"]('\x0a');
      }
    });
    _0x36e2b3["stderr"]?.["setEncoding"]("utf8");
    _0x36e2b3["stderr"]?.['on']("data", _0x2a762b => {
      _0x17c9ff({
        'type': "screenshot.native_helper_stderr",
        'level': "warn",
        'source': "main",
        'message': "Native screenshot helper stderr",
        'context': {
          'text': String(_0x2a762b || '')["slice"](0x0, 0x3e8)
        }
      });
    });
    _0x36e2b3['on']("exit", (_0x4b990e, _0x494844) => {
      _0x36e2b3 = null;
      _0x1082c8 = '';
      _0x20cb1d() && _0xa68ba2({
        'ok': ![],
        'registered': ![],
        'reason': "native-helper-exited"
      });
      _0x17c9ff({
        'type': "screenshot.native_helper_exited",
        'level': _0x4b990e === 0x0 ? 'info' : "warn",
        'source': "main",
        'message': 'Native\x20screenshot\x20helper\x20exited',
        'context': {
          'code': _0x4b990e,
          'signal': _0x494844
        }
      });
    });
    _0x36e2b3['on']("error", _0x59eba7 => {
      _0x36e2b3 = null;
      _0x20cb1d() && _0xa68ba2({
        'ok': ![],
        'registered': ![],
        'reason': "native-helper-error",
        'error': String(_0x59eba7?.["message"] || _0x59eba7)
      });
    });
    return !![];
  }
  function _0x4e3756() {
    if (!_0x36e2b3 || _0x36e2b3["killed"]) {
      return;
    }
    try {
      _0x36e2b3["kill"]();
    } catch {} finally {
      _0x36e2b3 = null;
      _0x1082c8 = '';
    }
  }
  return {
    'captureDesktopDisplay': _0x744df4,
    'configureGlobalScreenshotShortcut': _0x2550f9,
    'consumeGlobalScreenshotCaptureEvents': _0x583b31,
    'destroyScreenshotOverlayWindow': _0x3be286,
    'getGlobalScreenshotShortcutStatus': _0x580abf,
    'handleScreenshotOverlayCancel': _0x42e30a,
    'handleScreenshotOverlayConfirm': _0x4e59df,
    'installGlobalScreenshotShortcut': _0x4aa5d7,
    'sendGlobalScreenshotShortcutStatus': _0x149064,
    'uninstallGlobalScreenshotShortcut': _0x1c797d
  };
}