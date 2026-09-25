function isUsableWindow(_0xa0b6c) {
  return !!_0xa0b6c && _0xa0b6c["isDestroyed"]?.() !== !![];
}
function focusApp(_0x2873d3) {
  try {
    _0x2873d3?.["focus"]?.({
      'steal': !![]
    });
  } catch {
    try {
      _0x2873d3?.['focus']?.();
    } catch {}
  }
}
export function createForegroundDialogPresenterCore({
  app: _0x59b50f,
  dialog: _0x116be6,
  getMainWindow = () => null,
  shouldUseOwnerWindow = () => ![],
  BrowserWindowClass: _0xa5af2b,
  screenApi: _0x39787e
} = {}) {
  let _0x55888a = null;
  function _0xb69fb0() {
    try {
      const _0x56b152 = _0x39787e["getDisplayNearestPoint"](_0x39787e["getCursorScreenPoint"]());
      const _0x47cbd3 = _0x56b152?.['workArea'] || _0x56b152?.["bounds"];
      if (_0x47cbd3) {
        return {
          'x': Math["round"](_0x47cbd3['x'] + Math["max"](0x0, _0x47cbd3["width"] - 0x2)),
          'y': Math["round"](_0x47cbd3['y'] + Math["max"](0x0, _0x47cbd3["height"] - 0x2)),
          'width': 0x1,
          'height': 0x1
        };
      }
    } catch {}
    return {
      'x': -0x7d00,
      'y': -0x7d00,
      'width': 0x1,
      'height': 0x1
    };
  }
  function _0x35723b() {
    _0x55888a = new _0xa5af2b({
      ..._0xb69fb0(),
      'show': ![],
      'frame': ![],
      'transparent': !![],
      'opacity': 0x0,
      'skipTaskbar': !![],
      'alwaysOnTop': !![],
      'focusable': !![],
      'resizable': ![],
      'movable': ![],
      'minimizable': ![],
      'maximizable': ![],
      'webPreferences': {
        'contextIsolation': !![],
        'nodeIntegration': ![],
        'sandbox': !![]
      }
    });
    _0x55888a['on']("closed", () => {
      _0x55888a = null;
    });
    try {
      _0x55888a["setOpacity"](0x0);
    } catch {}
    return _0x55888a;
  }
  function _0x32707d() {
    const _0x288949 = getMainWindow();
    if (isUsableWindow(_0x288949)) {
      return _0x288949;
    }
    if (!shouldUseOwnerWindow()) {
      return null;
    }
    if (isUsableWindow(_0x55888a)) {
      return _0x55888a;
    }
    return _0x35723b();
  }
  function _0xe86d5e(_0x1fbcb8) {
    if (!isUsableWindow(_0x1fbcb8)) {
      return ![];
    }
    try {
      _0x1fbcb8['setBounds'](_0xb69fb0());
    } catch {}
    try {
      _0x1fbcb8['setOpacity'](0x0);
    } catch {}
    try {
      _0x1fbcb8["setAlwaysOnTop"](!![], "screen-saver");
    } catch {}
    try {
      _0x1fbcb8["show"]();
    } catch {}
    focusApp(_0x59b50f);
    try {
      _0x1fbcb8['focus']();
    } catch {}
    try {
      _0x1fbcb8['moveTop']();
    } catch {}
    return !![];
  }
  function _0x577d86(_0x56cd68) {
    if (!isUsableWindow(_0x56cd68)) {
      return ![];
    }
    try {
      if (_0x56cd68['isMinimized']?.()) {
        _0x56cd68['restore']?.();
      }
    } catch {}
    try {
      _0x56cd68["show"]();
    } catch {}
    focusApp(_0x59b50f);
    try {
      _0x56cd68['focus']();
    } catch {}
    try {
      _0x56cd68["moveTop"]();
    } catch {}
    return !![];
  }
  async function _0x18f31d(_0x316645, _0x594e50) {
    const _0x58fccd = _0x32707d();
    const _0x3e9660 = _0x58fccd && _0x58fccd === _0x55888a;
    if (_0x3e9660) {
      _0xe86d5e(_0x58fccd);
    } else {
      _0x58fccd && _0x577d86(_0x58fccd);
    }
    try {
      return _0x58fccd ? await _0x116be6[_0x316645](_0x58fccd, _0x594e50) : await _0x116be6[_0x316645](_0x594e50);
    } finally {
      if (_0x3e9660 && isUsableWindow(_0x55888a)) {
        try {
          _0x55888a['hide']();
        } catch {}
      }
    }
  }
  function _0x8b834() {
    if (isUsableWindow(_0x55888a)) {
      _0x55888a["destroy"]();
    }
    _0x55888a = null;
  }
  return {
    'destroyOwnerWindow': _0x8b834,
    'getDialogParentWindow': _0x32707d,
    'showOpenDialog': _0x2b1cf5 => _0x18f31d("showOpenDialog", _0x2b1cf5),
    'showSaveDialog': _0x326847 => _0x18f31d("showSaveDialog", _0x326847)
  };
}