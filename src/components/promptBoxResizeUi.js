import { applyPromptBoxHeight, getPromptBoxHeightBounds, normalizePromptBoxHeight } from './promptBoxResize.js';
const EDGE_HIT_TOP_OFFSET = 0x14;
const EDGE_HIT_BOTTOM_OFFSET = 0xa;
export function syncPromptBoxSizeFromData(_0x3d5fae, _0x484707 = _0x3d5fae?.["_data"]) {
  if (!_0x3d5fae?.["promptEl"] || _0x3d5fae["_isPromptBoxResizing"]) {
    return;
  }
  const _0x3c2703 = getPromptBoxHeightBounds(_0x3d5fae['_promptPanel']);
  const _0x23f82f = normalizePromptBoxHeight(_0x484707?.["promptBoxHeight"], _0x3c2703);
  applyPromptBoxHeight(_0x3d5fae["promptEl"], _0x23f82f);
}
export function setupPromptBoxResize(_0x4e1ca8, {
  store: _0x5f274f,
  getStateSnapshot: _0x29f83c
}) {
  if (!_0x4e1ca8?.["_promptPanel"] || _0x4e1ca8["_promptResizeHandle"]) {
    return;
  }
  _0x4e1ca8['_promptResizeHandle'] = !![];
  const _0x4b357f = () => _0x29f83c()['ui']?.["promptBoxResizeEnabled"] !== ![] && !_0x4e1ca8["_promptPanel"]["classList"]['contains']('is-prompt-expanded');
  const _0x397b77 = _0x552024 => !!_0x552024?.['closest'](".floating-menu, .img-model-menu");
  const _0xb57749 = _0x3fdd96 => {
    const _0x313589 = _0x4e1ca8["_promptPanel"]["getBoundingClientRect"]();
    return _0x3fdd96 >= _0x313589["bottom"] - EDGE_HIT_TOP_OFFSET && _0x3fdd96 <= _0x313589["bottom"] + EDGE_HIT_BOTTOM_OFFSET;
  };
  const _0x23b67c = _0x4f9494 => {
    if (!_0x4e1ca8["_promptPanel"]) {
      return;
    }
    if (!_0x4b357f()) {
      _0x4e1ca8['_promptPanel']["classList"]["remove"]("is-resize-hover");
      return;
    }
    if (_0x4e1ca8['_isPromptBoxResizing']) {
      _0x4e1ca8["_promptPanel"]["classList"]["add"]("is-resize-hover");
      return;
    }
    const _0xed4ec8 = !_0x397b77(_0x4f9494?.["target"]) && _0xb57749(_0x4f9494["clientY"]);
    _0x4e1ca8["_promptPanel"]["classList"]["toggle"]("is-resize-hover", _0xed4ec8);
  };
  const _0x810793 = () => {
    !_0x4e1ca8['_isPromptBoxResizing'] && _0x4e1ca8["_promptPanel"]?.["classList"]["remove"]('is-resize-hover');
  };
  const _0x353edd = () => {
    _0x4e1ca8["_promptPanel"]?.['removeEventListener']('pointerdown', _0x3d8bf2);
    _0x4e1ca8["_promptPanel"]?.["removeEventListener"]("pointermove", _0x23b67c);
    _0x4e1ca8['_promptPanel']?.["removeEventListener"]("pointerleave", _0x810793);
    _0x4e1ca8['_promptPanel']?.['classList']["remove"]('is-resize-hover');
  };
  const _0x3d8bf2 = _0x46d50d => {
    if (!_0x4e1ca8["_promptInputWrap"] || !_0x4e1ca8["promptEl"]) {
      return;
    }
    if (!_0x4b357f()) {
      return;
    }
    if (_0x46d50d["button"] !== 0x0) {
      return;
    }
    if (!_0xb57749(_0x46d50d["clientY"])) {
      return;
    }
    if (_0x46d50d["target"]?.["closest"](".prompt-submit") || _0x397b77(_0x46d50d["target"])) {
      return;
    }
    _0x46d50d["stopPropagation"]();
    _0x46d50d["preventDefault"]();
    const _0x18b49d = getPromptBoxHeightBounds(_0x4e1ca8["_promptPanel"]);
    const _0x14e610 = _0x46d50d["clientY"];
    const _0x44791f = _0x4e1ca8["promptEl"]["getBoundingClientRect"]()["height"];
    _0x4e1ca8["_isPromptBoxResizing"] = !![];
    _0x4e1ca8['_promptInputWrap']["classList"]["add"]('is-resizing');
    _0x4e1ca8["_promptPanel"]["classList"]['add']("is-resize-hover");
    const _0x51b9de = _0x407bd5 => {
      _0x407bd5["preventDefault"]();
      const _0x3c7960 = normalizePromptBoxHeight(_0x44791f + (_0x407bd5["clientY"] - _0x14e610), _0x18b49d);
      applyPromptBoxHeight(_0x4e1ca8['promptEl'], _0x3c7960);
    };
    const _0x2d9614 = _0x3316cd => {
      _0x3316cd["preventDefault"]();
      window['removeEventListener']("pointermove", _0x51b9de);
      window["removeEventListener"]("pointerup", _0x2d9614);
      window['removeEventListener']("pointercancel", _0x2d9614);
      const _0x414f92 = normalizePromptBoxHeight(_0x4e1ca8["promptEl"]?.["getBoundingClientRect"]()['height'], _0x18b49d);
      applyPromptBoxHeight(_0x4e1ca8['promptEl'], _0x414f92);
      _0x4e1ca8["_promptInputWrap"]['classList']['remove']("is-resizing");
      _0x4e1ca8['_isPromptBoxResizing'] = ![];
      _0x4e1ca8["_promptPanel"]["classList"]["remove"]('is-resize-hover');
      _0x23b67c(_0x3316cd);
      _0x5f274f["updateNodeData"](_0x4e1ca8["nodeId"], {
        'promptBoxHeight': _0x414f92
      });
    };
    window["addEventListener"]('pointermove', _0x51b9de);
    window["addEventListener"]("pointerup", _0x2d9614);
    window['addEventListener']("pointercancel", _0x2d9614);
    _0x4e1ca8['_promptResizeCleanup'] = () => {
      _0x353edd();
      window["removeEventListener"]("pointermove", _0x51b9de);
      window["removeEventListener"]("pointerup", _0x2d9614);
      window['removeEventListener']('pointercancel', _0x2d9614);
    };
  };
  _0x4e1ca8["_promptPanel"]["addEventListener"]("pointermove", _0x23b67c);
  _0x4e1ca8["_promptPanel"]["addEventListener"]("pointerleave", _0x810793);
  _0x4e1ca8["_promptPanel"]["addEventListener"]('pointerdown', _0x3d8bf2);
  _0x4e1ca8["_promptResizeCleanup"] = _0x353edd;
}