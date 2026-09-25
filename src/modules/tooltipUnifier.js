const TOOLTIP_ATTRS = ['data-tooltip', 'data-tooltip-right'];
const OVERFLOW_TOOLTIP_ATTR = "data-tooltip-overflow";
const NATIVE_TITLE_BACKUP_ATTR = 'data-native-title';
const GENERATED_TOOLTIP_ATTR = 'data-tooltip-source';
const GENERATED_TOOLTIP_VALUE = "native-title";
const TOOLTIP_PORTAL_CLASS = "global-tooltip";
const TOOLTIP_PORTAL_READY_CLASS = "has-global-tooltip-portal";
const TOOLTIP_ARROW_CLASS = "global-tooltip-arrow";
const DEFAULT_TOOLTIP_PLACEMENT = "top";
const RIGHT_TOOLTIP_PLACEMENT = 'right';
const TOOLTIP_GAP_PX = 0xc;
const TOOLTIP_VIEWPORT_PADDING_PX = 0x8;
const TOOLTIP_ARROW_PADDING_PX = 0xc;
const TOOLTIP_INTERACTION_SUPPRESS_MS = 0x1a4;
const GLOBAL_TOOLTIP_EXCLUDE_SELECTOR = '.generation-node-help-tip';
let installed = null;
function isElementNode(_0x2b3266) {
  return _0x2b3266 && _0x2b3266["nodeType"] === 0x1;
}
function clamp(_0x35ca17, _0x3d431b, _0x607856) {
  const _0x174508 = Number["isFinite"](_0x3d431b) ? _0x3d431b : 0x0;
  const _0x6d9a46 = Number["isFinite"](_0x607856) ? Math["max"](_0x174508, _0x607856) : _0x174508;
  return Math['min'](Math['max'](_0x35ca17, _0x174508), _0x6d9a46);
}
function normalizeRect(_0x32cb82 = {}) {
  const _0x530926 = Number(_0x32cb82['left']) || 0x0;
  const _0x3e5027 = Number(_0x32cb82["top"]) || 0x0;
  const _0x1588ed = Number(_0x32cb82["width"]) || Math["max"](0x0, (Number(_0x32cb82["right"]) || _0x530926) - _0x530926);
  const _0x473e5a = Number(_0x32cb82["height"]) || Math["max"](0x0, (Number(_0x32cb82["bottom"]) || _0x3e5027) - _0x3e5027);
  return {
    'left': _0x530926,
    'top': _0x3e5027,
    'right': Number(_0x32cb82["right"]) || _0x530926 + _0x1588ed,
    'bottom': Number(_0x32cb82['bottom']) || _0x3e5027 + _0x473e5a,
    'width': _0x1588ed,
    'height': _0x473e5a
  };
}
function normalizeViewport(_0x535bc7 = {}) {
  return {
    'width': Number(_0x535bc7["width"]) || Number(_0x535bc7["innerWidth"]) || Number(globalThis["innerWidth"]) || 0x0,
    'height': Number(_0x535bc7["height"]) || Number(_0x535bc7["innerHeight"]) || Number(globalThis["innerHeight"]) || 0x0,
    'padding': Number(_0x535bc7["padding"]) >= 0x0 ? Number(_0x535bc7["padding"]) : TOOLTIP_VIEWPORT_PADDING_PX,
    'gap': Number(_0x535bc7["gap"]) >= 0x0 ? Number(_0x535bc7['gap']) : TOOLTIP_GAP_PX,
    'arrowPadding': Number(_0x535bc7["arrowPadding"]) >= 0x0 ? Number(_0x535bc7["arrowPadding"]) : TOOLTIP_ARROW_PADDING_PX
  };
}
function getTooltipNow(_0x5433b4) {
  const _0x5e7c96 = _0x5433b4?.['defaultView'] || globalThis;
  const _0x8b4d0e = _0x5e7c96["performance"] || globalThis["performance"];
  if (typeof _0x8b4d0e?.["now"] === "function") {
    return _0x8b4d0e["now"]();
  }
  return Date["now"]();
}
export function computeTooltipPosition(_0x55dddb, _0x36b563, _0x376454, _0x49eaf0 = DEFAULT_TOOLTIP_PLACEMENT) {
  const _0x771f40 = normalizeRect(_0x55dddb);
  const _0x504e3a = normalizeRect(_0x36b563);
  const _0x1b0034 = normalizeViewport(_0x376454);
  const _0x11cd98 = _0x1b0034['width'] - _0x1b0034["padding"] - _0x504e3a["width"];
  const _0x1903af = _0x1b0034["height"] - _0x1b0034["padding"] - _0x504e3a['height'];
  const _0x5cc983 = _0x771f40["left"] + _0x771f40["width"] / 0x2;
  const _0x499a28 = _0x771f40["top"] + _0x771f40["height"] / 0x2;
  let _0x926816 = _0x49eaf0 === RIGHT_TOOLTIP_PLACEMENT ? RIGHT_TOOLTIP_PLACEMENT : "top";
  let _0x4b5240 = _0x5cc983 - _0x504e3a["width"] / 0x2;
  let _0x662067 = _0x771f40["top"] - _0x504e3a['height'] - _0x1b0034["gap"];
  if (_0x926816 === "top") {
    const _0x352a79 = _0x771f40["bottom"] + _0x1b0034["gap"];
    _0x662067 < _0x1b0034["padding"] && _0x352a79 + _0x504e3a["height"] <= _0x1b0034["height"] - _0x1b0034["padding"] && (_0x926816 = "bottom", _0x662067 = _0x352a79);
    _0x4b5240 = clamp(_0x4b5240, _0x1b0034['padding'], _0x11cd98);
    _0x662067 = clamp(_0x662067, _0x1b0034['padding'], _0x1903af);
    return {
      'left': _0x4b5240,
      'top': _0x662067,
      'placement': _0x926816,
      'arrowLeft': clamp(_0x5cc983 - _0x4b5240, _0x1b0034["arrowPadding"], _0x504e3a['width'] - _0x1b0034["arrowPadding"]),
      'arrowTop': null
    };
  }
  _0x4b5240 = _0x771f40["right"] + _0x1b0034["gap"];
  _0x662067 = _0x499a28 - _0x504e3a["height"] / 0x2;
  _0x4b5240 + _0x504e3a["width"] > _0x1b0034["width"] - _0x1b0034["padding"] && _0x771f40['left'] - _0x1b0034["gap"] - _0x504e3a["width"] >= _0x1b0034["padding"] && (_0x926816 = "left", _0x4b5240 = _0x771f40['left'] - _0x1b0034["gap"] - _0x504e3a["width"]);
  _0x4b5240 = clamp(_0x4b5240, _0x1b0034["padding"], _0x11cd98);
  _0x662067 = clamp(_0x662067, _0x1b0034["padding"], _0x1903af);
  return {
    'left': _0x4b5240,
    'top': _0x662067,
    'placement': _0x926816,
    'arrowLeft': null,
    'arrowTop': clamp(_0x499a28 - _0x662067, _0x1b0034["arrowPadding"], _0x504e3a['height'] - _0x1b0034["arrowPadding"])
  };
}
function hasUnifiedTooltip(_0x16d736) {
  return TOOLTIP_ATTRS["some"](_0x325bb8 => {
    const _0x59f27e = _0x16d736["getAttribute"](_0x325bb8);
    return typeof _0x59f27e === "string" && _0x59f27e["trim"]();
  });
}
function shouldMirrorToAriaLabel(_0x4f99a3) {
  if (_0x4f99a3["hasAttribute"]("aria-label")) {
    return ![];
  }
  const _0x4963f5 = String(_0x4f99a3["tagName"] || '')["toLowerCase"]();
  if (_0x4963f5 === 'button' || _0x4963f5 === "input" || _0x4963f5 === "select") {
    return !![];
  }
  return _0x4f99a3["hasAttribute"]("role") || _0x4f99a3["hasAttribute"]("tabindex");
}
export function unifyNativeTooltipElement(_0x57628d) {
  if (!isElementNode(_0x57628d) || !_0x57628d["hasAttribute"]("title")) {
    return ![];
  }
  const _0x15c84b = String(_0x57628d["getAttribute"]('title') || '')["trim"]();
  const _0x5065ed = _0x57628d["getAttribute"](GENERATED_TOOLTIP_ATTR) === GENERATED_TOOLTIP_VALUE;
  if (_0x15c84b) {
    (_0x5065ed || !hasUnifiedTooltip(_0x57628d)) && (_0x57628d["setAttribute"]("data-tooltip", _0x15c84b), _0x57628d["setAttribute"](GENERATED_TOOLTIP_ATTR, GENERATED_TOOLTIP_VALUE));
    _0x57628d['setAttribute'](NATIVE_TITLE_BACKUP_ATTR, _0x15c84b);
    shouldMirrorToAriaLabel(_0x57628d) && _0x57628d["setAttribute"]("aria-label", _0x15c84b);
  } else {
    _0x5065ed && (_0x57628d['removeAttribute']("data-tooltip"), _0x57628d["removeAttribute"](GENERATED_TOOLTIP_ATTR), _0x57628d["removeAttribute"](NATIVE_TITLE_BACKUP_ATTR));
  }
  _0x57628d["removeAttribute"]("title");
  return !![];
}
export function unifyNativeTooltips(_0x4e0ed4 = globalThis["document"]) {
  if (!_0x4e0ed4) {
    return 0x0;
  }
  let _0x2f1785 = 0x0;
  if (isElementNode(_0x4e0ed4) && unifyNativeTooltipElement(_0x4e0ed4)) {
    _0x2f1785 += 0x1;
  }
  const _0x5e109a = _0x4e0ed4["querySelectorAll"]?.("[title]");
  if (!_0x5e109a) {
    return _0x2f1785;
  }
  _0x5e109a['forEach'](_0x597f8e => {
    if (unifyNativeTooltipElement(_0x597f8e)) {
      _0x2f1785 += 0x1;
    }
  });
  return _0x2f1785;
}
function normalizeMutationRecord(_0x386956) {
  _0x386956["type"] === 'attributes' && unifyNativeTooltipElement(_0x386956["target"]);
}
function getTooltipDescriptor(_0x2d2b41) {
  if (!isElementNode(_0x2d2b41)) {
    return null;
  }
  if (_0x2d2b41["closest"]?.(GLOBAL_TOOLTIP_EXCLUDE_SELECTOR)) {
    return null;
  }
  if (_0x2d2b41['hasAttribute']?.(OVERFLOW_TOOLTIP_ATTR) && !(Number(_0x2d2b41["scrollWidth"]) > Number(_0x2d2b41["clientWidth"]) + 0x1 || Number(_0x2d2b41["scrollHeight"]) > Number(_0x2d2b41['clientHeight']) + 0x1)) {
    return null;
  }
  const _0x134be2 = String(_0x2d2b41["closest"]?.("[data-tooltip-placement]")?.["getAttribute"]?.("data-tooltip-placement") || '')["trim"]();
  const _0x32b0d4 = _0x134be2 === DEFAULT_TOOLTIP_PLACEMENT || _0x134be2 === RIGHT_TOOLTIP_PLACEMENT ? _0x134be2 : null;
  const _0x5ae135 = String(_0x2d2b41['getAttribute']("data-tooltip-right") || '')["trim"]();
  if (_0x5ae135) {
    if (_0x2d2b41['getAttribute']('aria-expanded') === "true") {
      return null;
    }
    return {
      'text': _0x5ae135,
      'placement': _0x32b0d4 || RIGHT_TOOLTIP_PLACEMENT
    };
  }
  const _0x4827dd = String(_0x2d2b41["getAttribute"]('data-tooltip') || '')["trim"]();
  if (_0x4827dd) {
    return {
      'text': _0x4827dd,
      'placement': _0x32b0d4 || DEFAULT_TOOLTIP_PLACEMENT
    };
  }
  return null;
}
function findTooltipTarget(_0x4b2ede) {
  let _0x566080 = isElementNode(_0x4b2ede) ? _0x4b2ede : _0x4b2ede?.["parentElement"];
  while (isElementNode(_0x566080)) {
    if (getTooltipDescriptor(_0x566080)) {
      return _0x566080;
    }
    _0x566080 = _0x566080["parentElement"];
  }
  return null;
}
function createTooltipPortal(_0x525a37) {
  const _0x51d8fd = _0x525a37["createElement"]("div");
  _0x51d8fd["className"] = TOOLTIP_PORTAL_CLASS;
  _0x51d8fd['setAttribute']("role", "tooltip");
  _0x51d8fd['hidden'] = !![];
  const _0x34a5c1 = _0x525a37["createElement"]("div");
  _0x34a5c1["className"] = TOOLTIP_ARROW_CLASS;
  _0x51d8fd["appendChild"](_0x34a5c1);
  _0x525a37["body"]?.["appendChild"](_0x51d8fd);
  return {
    'portal': _0x51d8fd,
    'arrow': _0x34a5c1
  };
}
export function installTooltipUnifier(_0x45bf0d = globalThis["document"]) {
  if (!_0x45bf0d?.["documentElement"]) {
    return () => {};
  }
  if (installed) {
    return installed["cleanup"];
  }
  unifyNativeTooltips(_0x45bf0d);
  _0x45bf0d["documentElement"]["classList"]?.["add"](TOOLTIP_PORTAL_READY_CLASS);
  let _0x446d6d = null;
  let _0x54aa68 = null;
  let _0x3c8cdb = null;
  let _0x189304 = 0x0;
  let _0x2c1453 = null;
  let _0x3322d4 = null;
  let _0x387661 = ![];
  const _0x69ffc5 = new Set();
  const _0x1c5eff = () => {
    if (_0x54aa68 && _0x54aa68['isConnected'] !== ![]) {
      return _0x54aa68;
    }
    if (!_0x45bf0d['body'] || typeof _0x45bf0d['createElement'] !== "function") {
      return null;
    }
    const _0x4a224f = createTooltipPortal(_0x45bf0d);
    _0x54aa68 = _0x4a224f["portal"];
    _0x3c8cdb = _0x4a224f["arrow"];
    return _0x54aa68;
  };
  const _0x551a34 = (_0x205698 = null) => {
    if (_0x205698 && _0x446d6d !== _0x205698) {
      return;
    }
    _0x446d6d = null;
    if (!_0x54aa68) {
      return;
    }
    _0x54aa68['classList']?.['remove']("is-visible");
    _0x54aa68["hidden"] = !![];
  };
  const _0x3b18ff = _0x57ada7 => {
    if (getTooltipNow(_0x45bf0d) >= _0x189304) {
      _0x2c1453 = null;
      return ![];
    }
    if (!_0x2c1453) {
      return !![];
    }
    return _0x57ada7 === _0x2c1453 || _0x57ada7?.["contains"]?.(_0x2c1453) || _0x2c1453?.["contains"]?.(_0x57ada7);
  };
  const _0xc86fd6 = _0x4be9d3 => {
    _0x2c1453 = isElementNode(_0x4be9d3) ? _0x4be9d3 : null;
    _0x189304 = Math["max"](_0x189304, getTooltipNow(_0x45bf0d) + TOOLTIP_INTERACTION_SUPPRESS_MS);
  };
  const _0x225ecb = () => {
    if (!_0x446d6d || !_0x54aa68 || _0x54aa68['hidden']) {
      return;
    }
    if (!_0x45bf0d["documentElement"]["contains"]?.(_0x446d6d)) {
      _0x551a34();
      return;
    }
    const _0x4446e2 = getTooltipDescriptor(_0x446d6d);
    if (!_0x4446e2) {
      _0x551a34();
      return;
    }
    const _0x1d7268 = _0x446d6d["getBoundingClientRect"]?.();
    const _0x13448a = _0x54aa68['getBoundingClientRect']?.();
    if (!_0x1d7268 || !_0x13448a) {
      return;
    }
    const _0x157e56 = _0x45bf0d["defaultView"] || globalThis;
    const _0x271c5c = computeTooltipPosition(_0x1d7268, _0x13448a, {
      'width': _0x157e56["innerWidth"],
      'height': _0x157e56['innerHeight']
    }, _0x4446e2["placement"]);
    _0x54aa68["style"]["left"] = _0x271c5c["left"] + 'px';
    _0x54aa68["style"]['top'] = _0x271c5c['top'] + 'px';
    _0x54aa68["dataset"]['placement'] = _0x271c5c["placement"];
    _0x54aa68["classList"]?.["toggle"]("is-placement-right", _0x271c5c["placement"] === "right");
    _0x54aa68["classList"]?.["toggle"]('is-placement-left', _0x271c5c['placement'] === "left");
    _0x54aa68['classList']?.["toggle"]("is-placement-bottom", _0x271c5c["placement"] === 'bottom');
    _0x54aa68['classList']?.['toggle']('is-placement-top', _0x271c5c["placement"] === "top");
    _0x3c8cdb && (_0x271c5c["arrowLeft"] != null && (_0x3c8cdb['style']['left'] = _0x271c5c["arrowLeft"] + 'px', _0x3c8cdb['style']['top'] = ''), _0x271c5c["arrowTop"] != null && (_0x3c8cdb['style']['top'] = _0x271c5c["arrowTop"] + 'px', _0x3c8cdb["style"]["left"] = ''));
  };
  const _0x595cc9 = (_0x1da3d4, {
    force = ![]
  } = {}) => {
    if (!force && _0x3b18ff(_0x1da3d4)) {
      _0x551a34(_0x1da3d4);
      return;
    }
    const _0x29bbaa = getTooltipDescriptor(_0x1da3d4);
    if (!_0x29bbaa) {
      _0x551a34(_0x1da3d4);
      return;
    }
    const _0x21ca93 = _0x1c5eff();
    if (!_0x21ca93) {
      return;
    }
    _0x446d6d = _0x1da3d4;
    _0x21ca93["textContent"] = _0x29bbaa['text'];
    if (_0x3c8cdb) {
      _0x21ca93["appendChild"](_0x3c8cdb);
    }
    _0x21ca93["hidden"] = ![];
    _0x21ca93["classList"]?.["remove"]('is-visible');
    _0x21ca93["style"]["left"] = "0px";
    _0x21ca93["style"]['top'] = "0px";
    _0x225ecb();
    _0x21ca93['classList']?.['add']('is-visible');
  };
  const _0x26304d = _0x3eb15f => {
    if (!isElementNode(_0x3eb15f)) {
      return;
    }
    const _0x1f4bf3 = _0x3eb15f["classList"]?.["contains"]("is-tooltip-pinned");
    if (_0x1f4bf3 && getTooltipDescriptor(_0x3eb15f)) {
      _0x595cc9(_0x3eb15f, {
        'force': !![]
      });
      return;
    }
    if (_0x446d6d === _0x3eb15f) {
      const _0x76856d = getTooltipDescriptor(_0x3eb15f);
      if (_0x76856d) {
        _0x595cc9(_0x3eb15f);
      } else {
        _0x551a34(_0x3eb15f);
      }
    }
  };
  const _0x47e7e3 = () => {
    _0x3322d4 = null;
    _0x387661 = ![];
    const _0x32bc5c = new Set(_0x69ffc5);
    _0x69ffc5['clear']();
    const _0xa80816 = Array["from"](_0x32bc5c)["filter"](_0x120fdd => {
      let _0x346bd = _0x120fdd?.['parentElement'];
      while (isElementNode(_0x346bd)) {
        if (_0x32bc5c["has"](_0x346bd)) {
          return ![];
        }
        _0x346bd = _0x346bd["parentElement"];
      }
      return !![];
    });
    _0xa80816['forEach'](_0x5ba433 => {
      if (_0x5ba433?.["isConnected"] === ![] || !_0x45bf0d["documentElement"]["contains"]?.(_0x5ba433)) {
        return;
      }
      unifyNativeTooltips(_0x5ba433);
    });
  };
  const _0x9acfb7 = () => {
    if (_0x3322d4 != null || _0x387661) {
      return;
    }
    const _0x1a704a = _0x45bf0d["defaultView"] || globalThis;
    if (typeof _0x1a704a["requestAnimationFrame"] === "function") {
      _0x3322d4 = _0x1a704a["requestAnimationFrame"](_0x47e7e3);
      return;
    }
    _0x387661 = !![];
    queueMicrotask(_0x47e7e3);
  };
  const _0x4ca777 = _0x170aeb => {
    if (!isElementNode(_0x170aeb)) {
      return;
    }
    _0x69ffc5["add"](_0x170aeb);
    _0x9acfb7();
  };
  const _0x42418c = _0x45bf0d["defaultView"]?.["MutationObserver"] || globalThis["MutationObserver"];
  const _0x2b1153 = _0x42418c ? new _0x42418c(_0x5ca600 => {
    _0x5ca600["forEach"](_0x5c890e => {
      _0x5c890e["type"] === "childList" ? _0x5c890e["addedNodes"]?.["forEach"]?.(_0x4ca777) : normalizeMutationRecord(_0x5c890e);
      _0x5c890e["type"] === "attributes" && ['class', "data-tooltip", "data-tooltip-right", OVERFLOW_TOOLTIP_ATTR, "aria-expanded"]["includes"](_0x5c890e["attributeName"]) && _0x26304d(_0x5c890e["target"]);
    });
    _0x446d6d && !_0x45bf0d["documentElement"]["contains"]?.(_0x446d6d) && _0x551a34();
  }) : null;
  _0x2b1153?.["observe"](_0x45bf0d["documentElement"], {
    'subtree': !![],
    'childList': !![],
    'attributes': !![],
    'attributeFilter': ["title", "class", "data-tooltip", 'data-tooltip-right', OVERFLOW_TOOLTIP_ATTR, 'aria-expanded']
  });
  const _0x3f2284 = _0x2dccaa => {
    const _0x55384b = _0x2dccaa['target']?.["closest"]?.('[title]') || _0x2dccaa['target'];
    unifyNativeTooltipElement(_0x55384b);
    const _0xff15a8 = findTooltipTarget(_0x2dccaa["target"]);
    if (_0xff15a8) {
      _0x595cc9(_0xff15a8);
    }
  };
  const _0x433a03 = _0x44b82f => {
    if (!_0x446d6d) {
      return;
    }
    if (_0x446d6d["contains"]?.(_0x44b82f["relatedTarget"])) {
      return;
    }
    _0x551a34(_0x446d6d);
  };
  const _0x3c53f0 = _0x1c1125 => {
    const _0xe2f9bc = _0x1c1125["target"]?.["closest"]?.('[title]') || _0x1c1125["target"];
    unifyNativeTooltipElement(_0xe2f9bc);
    const _0x14b8f7 = findTooltipTarget(_0x1c1125["target"]);
    if (_0x14b8f7) {
      _0x595cc9(_0x14b8f7);
    }
  };
  const _0x2dc0f4 = _0x41d23e => {
    if (!_0x446d6d) {
      return;
    }
    if (_0x446d6d["contains"]?.(_0x41d23e["relatedTarget"])) {
      return;
    }
    _0x551a34(_0x446d6d);
  };
  const _0x3234c0 = () => {
    _0x551a34();
  };
  const _0x3bc368 = _0x2d1a5c => {
    _0xc86fd6(_0x2d1a5c["target"]);
    _0x551a34();
  };
  const _0xfd6cac = _0x1ac9ec => {
    _0xc86fd6(_0x1ac9ec["target"]);
    _0x551a34();
  };
  _0x45bf0d["addEventListener"]?.('pointerover', _0x3f2284, !![]);
  _0x45bf0d['addEventListener']?.("pointerout", _0x433a03, !![]);
  _0x45bf0d["addEventListener"]?.('focusin', _0x3c53f0, !![]);
  _0x45bf0d['addEventListener']?.("focusout", _0x2dc0f4, !![]);
  _0x45bf0d["addEventListener"]?.('pointerdown', _0x3bc368, !![]);
  _0x45bf0d["addEventListener"]?.('click', _0xfd6cac, !![]);
  _0x45bf0d["addEventListener"]?.("scroll", _0x3234c0, !![]);
  _0x45bf0d["defaultView"]?.['addEventListener']?.('scroll', _0x3234c0, !![]);
  _0x45bf0d["defaultView"]?.["addEventListener"]?.('resize', _0x3234c0);
  const _0x1c468a = () => {
    _0x2b1153?.["disconnect"]();
    const _0x45a62a = _0x45bf0d['defaultView'] || globalThis;
    _0x3322d4 != null && typeof _0x45a62a["cancelAnimationFrame"] === 'function' && _0x45a62a['cancelAnimationFrame'](_0x3322d4);
    _0x3322d4 = null;
    _0x387661 = ![];
    _0x69ffc5["clear"]();
    _0x45bf0d["removeEventListener"]?.('pointerover', _0x3f2284, !![]);
    _0x45bf0d['removeEventListener']?.("pointerout", _0x433a03, !![]);
    _0x45bf0d["removeEventListener"]?.("focusin", _0x3c53f0, !![]);
    _0x45bf0d["removeEventListener"]?.("focusout", _0x2dc0f4, !![]);
    _0x45bf0d['removeEventListener']?.('pointerdown', _0x3bc368, !![]);
    _0x45bf0d["removeEventListener"]?.('click', _0xfd6cac, !![]);
    _0x45bf0d['removeEventListener']?.('scroll', _0x3234c0, !![]);
    _0x45bf0d["defaultView"]?.["removeEventListener"]?.("scroll", _0x3234c0, !![]);
    _0x45bf0d['defaultView']?.["removeEventListener"]?.("resize", _0x3234c0);
    _0x45bf0d["documentElement"]['classList']?.['remove'](TOOLTIP_PORTAL_READY_CLASS);
    _0x54aa68?.["remove"]?.();
    _0x446d6d = null;
    _0x54aa68 = null;
    _0x3c8cdb = null;
    _0x2c1453 = null;
    installed = null;
  };
  installed = {
    'cleanup': _0x1c468a
  };
  return _0x1c468a;
}