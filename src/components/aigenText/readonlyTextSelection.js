function getCaretRangeFromPoint(_0x31cee2, _0xc503a3, _0x56e2d7) {
  if (typeof _0x31cee2?.['caretRangeFromPoint'] === "function") {
    return _0x31cee2["caretRangeFromPoint"](_0xc503a3, _0x56e2d7);
  }
  const _0xc32fb9 = _0x31cee2?.["caretPositionFromPoint"]?.(_0xc503a3, _0x56e2d7);
  if (!_0xc32fb9 || typeof _0x31cee2?.["createRange"] !== "function") {
    return null;
  }
  const _0x6f6504 = _0x31cee2["createRange"]();
  _0x6f6504["setStart"](_0xc32fb9["offsetNode"], _0xc32fb9["offset"]);
  return _0x6f6504;
}
function setSelection(_0x3a0245, _0x539b2c, _0x12c063) {
  const _0xf5ed44 = _0x3a0245?.["getSelection"]?.();
  if (!_0xf5ed44 || !_0x539b2c || !_0x12c063) {
    return;
  }
  _0xf5ed44["removeAllRanges"]();
  if (typeof _0xf5ed44["setBaseAndExtent"] === "function") {
    _0xf5ed44['setBaseAndExtent'](_0x539b2c["startContainer"], _0x539b2c["startOffset"], _0x12c063["startContainer"], _0x12c063["startOffset"]);
    return;
  }
  const _0x507c06 = _0x539b2c["startContainer"]["ownerDocument"]["createRange"]();
  _0x507c06["setStart"](_0x539b2c["startContainer"], _0x539b2c['startOffset']);
  _0x507c06["setEnd"](_0x12c063["startContainer"], _0x12c063["startOffset"]);
  _0xf5ed44["addRange"](_0x507c06);
}
function findActiveReadonlyTextRoot(_0x25b8e9) {
  if (!_0x25b8e9) {
    return null;
  }
  const _0x15228 = _0x25b8e9["nodeType"] === 0x1 ? _0x25b8e9 : _0x25b8e9["parentElement"];
  if (!_0x15228) {
    return null;
  }
  if (typeof _0x15228["closest"] === "function") {
    return _0x15228["closest"](".aigen-text-output.is-text-selection-active") || _0x15228["closest"]("[data-readonly-text-selection-root=\"true\"]");
  }
  let _0x2b800b = _0x15228;
  while (_0x2b800b) {
    if (_0x2b800b['classList']?.["contains"]?.("aigen-text-output") && _0x2b800b['classList']?.["contains"]?.("is-text-selection-active")) {
      return _0x2b800b;
    }
    if (_0x2b800b["dataset"]?.["readonlyTextSelectionRoot"] === "true") {
      return _0x2b800b;
    }
    _0x2b800b = _0x2b800b['parentElement'];
  }
  return null;
}
function rangeTouchesActiveReadonlyText(_0x36460f, _0x2f20c9) {
  if (!_0x36460f) {
    return ![];
  }
  if (findActiveReadonlyTextRoot(_0x36460f["commonAncestorContainer"]) || findActiveReadonlyTextRoot(_0x36460f["startContainer"]) || findActiveReadonlyTextRoot(_0x36460f["endContainer"])) {
    return !![];
  }
  const _0x544fae = Array["from"](_0x2f20c9?.["querySelectorAll"]?.(".aigen-text-output.is-text-selection-active, [data-readonly-text-selection-root=\"true\"]") || []);
  return _0x544fae["some"](_0x38e0f6 => {
    try {
      if (typeof _0x36460f['intersectsNode'] === "function") {
        return _0x36460f["intersectsNode"](_0x38e0f6);
      }
    } catch (_0x1e8655) {
      return ![];
    }
    return _0x38e0f6["contains"]?.(_0x36460f["startContainer"]) || _0x38e0f6['contains']?.(_0x36460f["endContainer"]);
  });
}
export function hasActiveReadonlyTextSelection(_0x58bf60 = document) {
  const _0x10a45d = _0x58bf60?.["getSelection"]?.();
  if (!_0x10a45d || _0x10a45d["isCollapsed"] || !String(_0x10a45d["toString"]?.() || '')["trim"]()) {
    return ![];
  }
  const _0x1b6c8b = Number(_0x10a45d["rangeCount"]) || 0x0;
  for (let _0x394603 = 0x0; _0x394603 < _0x1b6c8b; _0x394603 += 0x1) {
    if (rangeTouchesActiveReadonlyText(_0x10a45d["getRangeAt"](_0x394603), _0x58bf60)) {
      return !![];
    }
  }
  return ![];
}
export function bindReadonlyTextSelection(_0x21a7fe, _0x259cff = {}) {
  if (!_0x21a7fe?.["addEventListener"]) {
    return () => {};
  }
  const _0x16a812 = _0x21a7fe["ownerDocument"] || document;
  const _0x55e133 = _0x16a812["defaultView"] || window;
  let _0x5a9802 = ![];
  const _0x5509b9 = () => {
    if (_0x5a9802) {
      return;
    }
    _0x5a9802 = !![];
    _0x21a7fe["classList"]?.["add"]("is-text-selection-active");
    _0x259cff["onActivate"]?.();
  };
  const _0x4df6ac = () => {
    if (!_0x5a9802) {
      return;
    }
    _0x5a9802 = ![];
    _0x259cff["onDeactivate"]?.();
    _0x21a7fe['classList']?.['remove']("is-text-selection-active");
    _0x16a812["body"]?.["classList"]["remove"]("is-aigen-text-selecting");
  };
  const _0x418480 = _0x2b0037 => {
    if (_0x2b0037['button'] !== 0x0) {
      return;
    }
    if (_0x2b0037["target"]?.["closest"]?.("a, button")) {
      return;
    }
    if (!_0x5a9802) {
      return;
    }
    _0x2b0037["preventDefault"]();
    _0x2b0037["stopPropagation"]();
    _0x16a812["body"]?.["classList"]['add']('is-aigen-text-selecting');
    const _0x1fbea2 = getCaretRangeFromPoint(_0x16a812, _0x2b0037["clientX"], _0x2b0037["clientY"]);
    const _0x4e0287 = _0x6b2430 => {
      const _0x374bef = getCaretRangeFromPoint(_0x16a812, _0x6b2430["clientX"], _0x6b2430['clientY']);
      _0x1fbea2 && _0x374bef && _0x21a7fe["contains"](_0x1fbea2["startContainer"]) && _0x21a7fe['contains'](_0x374bef['startContainer']) && setSelection(_0x55e133, _0x1fbea2, _0x374bef);
      _0x6b2430["preventDefault"]();
      _0x6b2430["stopPropagation"]();
    };
    const _0x33301a = _0xbe3d55 => {
      _0x4e0287(_0xbe3d55);
      _0x16a812["body"]?.['classList']['remove']("is-aigen-text-selecting");
      _0x16a812["removeEventListener"]("pointermove", _0x4e0287, !![]);
      _0x16a812['removeEventListener']("pointerup", _0x33301a, !![]);
      _0x16a812["removeEventListener"]("pointercancel", _0x33301a, !![]);
    };
    _0x16a812['addEventListener']('pointermove', _0x4e0287, !![]);
    _0x16a812['addEventListener']("pointerup", _0x33301a, !![]);
    _0x16a812['addEventListener']('pointercancel', _0x33301a, !![]);
  };
  const _0x5052c7 = _0x58f59b => {
    _0x58f59b["preventDefault"]();
    _0x58f59b['stopPropagation']();
    _0x5509b9();
  };
  const _0x30df17 = _0x1ab291 => {
    if (!_0x5a9802 || _0x21a7fe["contains"](_0x1ab291["target"])) {
      return;
    }
    _0x4df6ac();
  };
  const _0x554072 = _0x6654b => {
    if (_0x6654b["key"] === 'Escape') {
      _0x4df6ac();
    }
  };
  _0x21a7fe["addEventListener"]("pointerdown", _0x418480, !![]);
  _0x21a7fe['addEventListener']("dblclick", _0x5052c7);
  _0x16a812["addEventListener"]('pointerdown', _0x30df17, !![]);
  _0x16a812["addEventListener"]('keydown', _0x554072, !![]);
  return () => {
    _0x4df6ac();
    _0x21a7fe["removeEventListener"]("pointerdown", _0x418480, !![]);
    _0x21a7fe['removeEventListener']('dblclick', _0x5052c7);
    _0x16a812["removeEventListener"]("pointerdown", _0x30df17, !![]);
    _0x16a812["removeEventListener"]("keydown", _0x554072, !![]);
  };
}