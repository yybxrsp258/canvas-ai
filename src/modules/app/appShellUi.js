import { t } from '../../i18n/index.js';
const CONNECTION_LINES_VISIBILITY_EVENT = "v2-connection-lines-visibility-changed";
function readConnectionLinesVisible(_0x27166f) {
  return _0x27166f?.["getState"]?.()?.['ui']?.["connectionLinesVisible"] !== ![];
}
function syncConnectionLinesToggleButton(_0x285f23, _0x346e4d) {
  if (!_0x285f23) {
    return;
  }
  const _0x217e0b = _0x346e4d !== ![];
  _0x285f23["classList"]?.["toggle"]?.("active", _0x217e0b);
  _0x285f23["setAttribute"]?.("aria-pressed", _0x217e0b ? 'true' : "false");
}
function dispatchConnectionLinesVisibilityChanged(_0x21af58) {
  const _0x19a939 = globalThis["window"];
  if (!_0x19a939?.["dispatchEvent"]) {
    return;
  }
  const _0x2ba695 = {
    'visible': _0x21af58 !== ![]
  };
  const _0xbc118a = typeof _0x19a939["CustomEvent"] === 'function' ? _0x19a939['CustomEvent'] : typeof globalThis["CustomEvent"] === "function" ? globalThis['CustomEvent'] : null;
  const _0x48133a = _0xbc118a ? new _0xbc118a(CONNECTION_LINES_VISIBILITY_EVENT, {
    'detail': _0x2ba695
  }) : {
    'type': CONNECTION_LINES_VISIBILITY_EVENT,
    'detail': _0x2ba695
  };
  _0x19a939["dispatchEvent"](_0x48133a);
}
function initConnectionLinesToggle({
  button: _0x252e59,
  uiStore: _0x4821ec
} = {}) {
  if (!_0x252e59) {
    return;
  }
  const _0x3b00f4 = (_0x5951df, {
    showToast = ![]
  } = {}) => {
    const _0x544cd6 = _0x5951df !== ![];
    _0x4821ec?.["setConnectionLinesVisible"]?.(_0x544cd6);
    syncConnectionLinesToggleButton(_0x252e59, _0x544cd6);
    dispatchConnectionLinesVisibilityChanged(_0x544cd6);
    showToast && globalThis['window']?.["showToast"]?.(_0x544cd6 ? t("appBusinessEvents.toggles.connectionLines.on") : t("appBusinessEvents.toggles.connectionLines.off"));
    return _0x544cd6;
  };
  syncConnectionLinesToggleButton(_0x252e59, readConnectionLinesVisible(_0x4821ec));
  _0x252e59["addEventListener"]?.('click', () => {
    _0x3b00f4(!readConnectionLinesVisible(_0x4821ec), {
      'showToast': !![]
    });
  });
  globalThis["window"]?.['addEventListener']?.(CONNECTION_LINES_VISIBILITY_EVENT, _0x306aaf => {
    syncConnectionLinesToggleButton(_0x252e59, _0x306aaf?.['detail']?.["visible"] !== ![]);
  });
  _0x4821ec?.["subscribeSelector"]?.(_0x210895 => _0x210895['ui']?.["connectionLinesVisible"] !== ![], _0x7e4cea => syncConnectionLinesToggleButton(_0x252e59, _0x7e4cea));
}
export function initAppShellUi({
  store: _0x475d78,
  uiStore: _0x793755,
  isElectronCompatibilityMode = ![],
  initMinimap: _0x48ae99,
  minimapEl: _0x465191,
  btnMinimapEl: _0x14912d,
  minimapWrapperEl: _0x3ea242,
  btnToggleDotsEl: _0x35e3d7,
  btnConnectionLinesToggleEl: _0x72947,
  btnAddCanvasEl: _0x5482c7,
  addCanvas: _0xcdf324,
  readGridDotsPref: _0x116cba,
  setGridDotsPref: _0xb6ebe,
  showDevToast: _0xbb2d37
} = {}) {
  const _0x23cbdd = document["getElementById"]("canvasRuntimeModeBadge");
  if (_0x23cbdd) {
    const _0x38bd4a = isElectronCompatibilityMode === !![];
    _0x23cbdd["hidden"] = !_0x38bd4a;
    _0x23cbdd["setAttribute"]("aria-hidden", _0x38bd4a ? 'false' : "true");
    _0x23cbdd["textContent"] = _0x38bd4a ? t("appShell.compatibilityModeBadge") : '';
  }
  const _0x1747d7 = document['getElementById']('canvasVersionBadge');
  if (_0x1747d7) {
    const _0x4beeed = document["querySelector"]("meta[name=\"app-version\"]")?.["getAttribute"]('content');
    const _0x5c691f = String(_0x4beeed || '')["trim"]()['replace'](/^v\s*/i, '');
    _0x1747d7['textContent'] = _0x5c691f ? t("appShell.currentVersionBadge", {
      'version': _0x5c691f
    }) : '';
  }
  _0x465191 && _0x48ae99?.(_0x465191, _0x475d78);
  if (_0x14912d && _0x3ea242) {
    const _0x52968f = _0x59a286 => {
      const _0x206ae7 = _0x59a286 === !![];
      _0x3ea242["classList"]['toggle']("open", _0x206ae7);
      _0x14912d["classList"]["toggle"]("active", _0x206ae7);
      _0x14912d["setAttribute"]('aria-pressed', _0x206ae7 ? "true" : "false");
    };
    _0x52968f(_0x3ea242['classList']?.["contains"]?.("open") === !![]);
    _0x14912d["addEventListener"]("click", () => {
      _0x52968f(_0x3ea242["classList"]?.["contains"]?.("open") !== !![]);
    });
    const _0x41c2f4 = () => {
      const _0x3b5b5f = Object["keys"](_0x475d78?.['getState']?.()["nodes"] || {})["length"] > 0x0;
      _0x52968f(_0x3b5b5f);
    };
    setTimeout(_0x41c2f4, 0x96);
  }
  _0x5482c7 && typeof _0xcdf324 === 'function' && _0x5482c7["addEventListener"]('click', () => _0xcdf324());
  if (_0x35e3d7) {
    const _0x5045a9 = _0x437ad1 => {
      const _0x132a21 = _0x437ad1 !== ![];
      _0x35e3d7["classList"]?.["toggle"]?.("active", _0x132a21);
      _0x35e3d7['setAttribute']?.("aria-pressed", _0x132a21 ? "true" : 'false');
    };
    _0x5045a9(_0x116cba?.());
    _0x35e3d7['addEventListener']("click", () => {
      const _0x1e2e69 = _0xb6ebe?.(!_0x116cba?.());
      _0x5045a9(_0x1e2e69);
      window["showToast"]?.(_0x1e2e69 ? t("appBusinessEvents.toggles.gridDots.on") : t("appBusinessEvents.toggles.gridDots.off"));
    });
  }
  initConnectionLinesToggle({
    'button': _0x72947,
    'uiStore': _0x793755
  });
  _0xb6ebe?.(_0x116cba?.());
  void _0xbb2d37;
}