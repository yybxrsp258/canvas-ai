import { applyPromptBoxHeight, getPromptBoxHeightBounds, normalizePromptBoxHeight } from '../promptBoxResize.js';
const EDGE_HIT_TOP_OFFSET = 0x14;
const EDGE_HIT_BOTTOM_OFFSET = 0xa;
export function syncPromptBoxSizeFromData(_0x5d11dc, _0x4998ef = _0x5d11dc?.["_data"]) {
  if (!_0x5d11dc?.["promptEl"] || _0x5d11dc["_isPromptBoxResizing"]) {
    return;
  }
  const _0x230966 = getPromptBoxHeightBounds(_0x5d11dc["_promptPanel"]);
  const _0x5c337b = normalizePromptBoxHeight(_0x4998ef?.["promptBoxHeight"], _0x230966);
  applyPromptBoxHeight(_0x5d11dc["promptEl"], _0x5c337b);
}
export function setupPromptBoxResize(_0xdb7da3, {
  store: _0x410563,
  getStateSnapshot: _0x4ae307
}) {
  if (!_0xdb7da3?.["_promptPanel"] || _0xdb7da3["_promptResizeHandle"]) {
    return;
  }
  _0xdb7da3["_promptResizeHandle"] = !![];
  const _0x4536be = () => _0x4ae307()['ui']?.["promptBoxResizeEnabled"] !== ![] && !_0xdb7da3["_promptPanel"]["classList"]["contains"]("is-prompt-expanded");
  const _0x25fbcc = _0x5cf5af => !!_0x5cf5af?.['closest'](".floating-menu, .img-model-menu");
  const _0x2b5e56 = _0x2d5a0c => {
    const _0x1015c8 = _0xdb7da3["_promptPanel"]['getBoundingClientRect']();
    return _0x2d5a0c >= _0x1015c8["bottom"] - EDGE_HIT_TOP_OFFSET && _0x2d5a0c <= _0x1015c8["bottom"] + EDGE_HIT_BOTTOM_OFFSET;
  };
  const _0x212b23 = _0x4a6390 => {
    if (!_0xdb7da3["_promptPanel"]) {
      return;
    }
    if (!_0x4536be()) {
      _0xdb7da3['_promptPanel']["classList"]["remove"]('is-resize-hover');
      return;
    }
    if (_0xdb7da3["_isPromptBoxResizing"]) {
      _0xdb7da3["_promptPanel"]["classList"]["add"]('is-resize-hover');
      return;
    }
    const _0x3468b9 = !_0x25fbcc(_0x4a6390?.["target"]) && _0x2b5e56(_0x4a6390['clientY']);
    _0xdb7da3["_promptPanel"]["classList"]["toggle"]("is-resize-hover", _0x3468b9);
  };
  _0xdb7da3["_promptPanel"]["addEventListener"]("pointermove", _0x212b23);
  _0xdb7da3["_promptPanel"]["addEventListener"]("pointerleave", () => {
    !_0xdb7da3["_isPromptBoxResizing"] && _0xdb7da3['_promptPanel']?.["classList"]["remove"]("is-resize-hover");
  });
  const _0x37dcaf = _0x4544b5 => {
    if (!_0xdb7da3["_promptInputWrap"] || !_0xdb7da3["promptEl"]) {
      return;
    }
    if (!_0x4536be()) {
      return;
    }
    if (_0x4544b5['button'] !== 0x0) {
      return;
    }
    if (!_0x2b5e56(_0x4544b5['clientY'])) {
      return;
    }
    if (_0x4544b5["target"]?.["closest"](".prompt-submit") || _0x25fbcc(_0x4544b5["target"])) {
      return;
    }
    _0x4544b5["stopPropagation"]();
    _0x4544b5["preventDefault"]();
    const _0x58e734 = getPromptBoxHeightBounds(_0xdb7da3["_promptPanel"]);
    const _0x43f1fd = _0x4544b5["clientY"];
    const _0x24aed9 = _0xdb7da3["promptEl"]["getBoundingClientRect"]()["height"];
    _0xdb7da3["_isPromptBoxResizing"] = !![];
    _0xdb7da3["_promptInputWrap"]["classList"]["add"]("is-resizing");
    _0xdb7da3["_promptPanel"]["classList"]["add"]("is-resize-hover");
    const _0x5f304d = _0x33fc5b => {
      _0x33fc5b['preventDefault']();
      const _0xa81135 = normalizePromptBoxHeight(_0x24aed9 + (_0x33fc5b["clientY"] - _0x43f1fd), _0x58e734);
      applyPromptBoxHeight(_0xdb7da3["promptEl"], _0xa81135);
    };
    const _0x3da6f2 = _0x385ef6 => {
      _0x385ef6['preventDefault']();
      window["removeEventListener"]("pointermove", _0x5f304d);
      window["removeEventListener"]('pointerup', _0x3da6f2);
      window["removeEventListener"]("pointercancel", _0x3da6f2);
      const _0x7795f6 = normalizePromptBoxHeight(_0xdb7da3["promptEl"]?.["getBoundingClientRect"]()["height"], _0x58e734);
      applyPromptBoxHeight(_0xdb7da3["promptEl"], _0x7795f6);
      _0xdb7da3["_promptInputWrap"]['classList']["remove"]('is-resizing');
      _0xdb7da3["_isPromptBoxResizing"] = ![];
      _0xdb7da3["_promptPanel"]["classList"]["remove"]("is-resize-hover");
      _0x212b23(_0x385ef6);
      _0x410563['updateNodeData'](_0xdb7da3["nodeId"], {
        'promptBoxHeight': _0x7795f6
      });
    };
    window["addEventListener"]("pointermove", _0x5f304d);
    window["addEventListener"]("pointerup", _0x3da6f2);
    window["addEventListener"]("pointercancel", _0x3da6f2);
  };
  _0xdb7da3['_promptPanel']['addEventListener']("pointerdown", _0x37dcaf);
}