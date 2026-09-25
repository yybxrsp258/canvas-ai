import { RH_AI_APP_PERSISTENT_ADVANCED_CLASS } from './rhAiAppNodeBehavior.js';
import { isInsideOwnedFloatingMenu } from './floatingMenuLayer.js';
function isPersistentAdvancedPanel(_0x299507) {
  return _0x299507?.['classList']?.['contains']?.(RH_AI_APP_PERSISTENT_ADVANCED_CLASS);
}
function hidePopup(_0x5c0cfe) {
  if (!_0x5c0cfe) {
    return;
  }
  if (_0x5c0cfe['classList']?.['contains']("floating-menu")) {
    _0x5c0cfe["classList"]['remove']("show");
    return;
  }
  if (_0x5c0cfe["classList"]?.["contains"]("rh-adv-panel") || _0x5c0cfe["classList"]?.["contains"]("rh-vram-adv-panel")) {
    if (isPersistentAdvancedPanel(_0x5c0cfe)) {
      _0x5c0cfe["classList"]['add']('show');
      _0x5c0cfe["style"]['display'] = '';
      return;
    }
    _0x5c0cfe["classList"]["remove"]('show');
    _0x5c0cfe["style"]["display"] = '';
    return;
  }
  _0x5c0cfe["style"]["display"] = 'none';
}
function showPopup(_0xd81d82, _0x1421b0 = "block") {
  if (!_0xd81d82) {
    return;
  }
  if (_0xd81d82["classList"]?.["contains"]("floating-menu")) {
    _0xd81d82["classList"]["add"]("show");
    return;
  }
  _0xd81d82["style"]["display"] = _0x1421b0;
}
function syncAdvancedButtonState(_0x496b44, _0x4e5709, _0x13eb7f) {
  _0x496b44["querySelectorAll"](_0x4e5709)['forEach'](_0x1b9a1c => {
    const _0xd1f2a6 = _0x1b9a1c['closest']?.(".prompt-panel-footer, .aigen-image-model-selector, .aigen-video-model-selector") || _0x496b44;
    const _0x54586a = _0xd1f2a6["querySelector"]?.(_0x13eb7f) || _0x496b44["querySelector"]?.(_0x13eb7f);
    _0x1b9a1c["setAttribute"]?.("aria-expanded", String(_0x54586a?.["classList"]?.["contains"]?.('show') === !![]));
  });
}
export function syncNodeFooterAdvancedButtonState(_0x53b140) {
  if (!_0x53b140) {
    return;
  }
  syncAdvancedButtonState(_0x53b140, ".rh-adv-btn", '.rh-adv-panel');
  syncAdvancedButtonState(_0x53b140, ".rh-adv2-btn", ".rh-vram-adv-panel");
}
export function closeNodeFooterMenus(_0x4548b3, _0xf11e0e = null, _0x336ec2 = {}) {
  if (!_0x4548b3) {
    return;
  }
  const _0x420721 = _0x336ec2?.["preserveAdvPanel"] || null;
  _0x4548b3['querySelectorAll']('.node-model-menu,\x20.img-model-menu,\x20.floating-menu.show,\x20.ui-schema-floating-menu.show')["forEach"](_0x3808ab => {
    if (_0x3808ab !== _0xf11e0e) {
      _0x3808ab["classList"]["remove"]("show");
    }
  });
  _0x4548b3['querySelectorAll'](".node-menu-submenu, .node-model-submenu, .ui-schema-popup, .img-ratio-popup, .rh-res-popup, .vid-duration-pop")["forEach"](_0x885948 => {
    if (_0x885948 !== _0xf11e0e) {
      hidePopup(_0x885948);
    }
  });
  _0x4548b3["querySelectorAll"](".rh-adv-panel, .rh-vram-adv-panel")["forEach"](_0x13c276 => {
    if (_0x13c276 === _0xf11e0e) {
      return;
    }
    if (_0x420721 && _0x13c276["contains"](_0x420721)) {
      return;
    }
    hidePopup(_0x13c276);
  });
  syncNodeFooterAdvancedButtonState(_0x4548b3);
}
export function positionNodeSubmenu(_0x3216fa, _0x1ac624) {
  if (!_0x3216fa || !_0x1ac624) {
    return;
  }
  showPopup(_0x1ac624, "flex");
  _0x1ac624["style"]["top"] = "0px";
  _0x1ac624['style']["maxHeight"] = '';
  _0x1ac624['style']["overflowY"] = '';
  const _0x245dc2 = _0x3216fa["closest"]('.node-model-menu,\x20.img-model-menu');
  if (!_0x245dc2) {
    return;
  }
  const _0x4dcefc = _0x3216fa['offsetTop'] || 0x0;
  const _0x2cebf2 = Number(globalThis["window"]?.['innerHeight']) || Number(globalThis['document']?.["documentElement"]?.["clientHeight"]) || 0x0;
  const _0x5b2171 = 0xc;
  const _0x22a0a9 = Math["max"](_0x5b2171, Number(globalThis["window"]?.["__canvasFloatingMenuViewportTop"]) || 0x0);
  const _0x34f3f7 = _0x1ac624['offsetHeight'] || _0x1ac624["getBoundingClientRect"]?.()["height"] || _0x1ac624["scrollHeight"] || 0x0;
  const _0x238be7 = _0x245dc2["getBoundingClientRect"]?.() || {
    'top': 0x0
  };
  const _0x437a38 = _0x3216fa["getBoundingClientRect"]?.() || null;
  const _0x37096d = _0x245dc2["clientHeight"] || _0x238be7["height"] || _0x1ac624['parentElement']?.["clientHeight"] || 0x0;
  const _0x13ecac = _0x2cebf2 > _0x5b2171 * 0x2 && _0x34f3f7 > 0x0 ? Math["min"](_0x34f3f7, _0x2cebf2 - _0x22a0a9 - _0x5b2171) : _0x34f3f7;
  const _0x506cdf = _0x1ac624["dataset"]?.["nodeSubmenuPlacement"];
  if (_0x506cdf === "viewport-left" || _0x506cdf === "viewport-auto" || _0x506cdf === "viewport-auto-up") {
    const _0x514cef = _0x1ac624["offsetWidth"] || _0x1ac624["getBoundingClientRect"]?.()["width"] || _0x238be7['width'] || 0xf0;
    const _0x3c9ebb = Number(globalThis["window"]?.["innerWidth"]) || Number(globalThis["document"]?.["documentElement"]?.['clientWidth']) || 0x0;
    const _0xc839c5 = Math["max"](_0x22a0a9, _0x2cebf2 - _0x5b2171 - _0x13ecac);
    const _0x5f5503 = Number(_0x238be7["top"]) || 0x0;
    const _0x4460c0 = Number(_0x238be7['bottom']) || _0x5f5503 + _0x37096d;
    const _0x361e39 = _0x506cdf === 'viewport-auto-up' ? _0x4460c0 - _0x13ecac : Number(_0x437a38?.['top']) || _0x5f5503 + _0x4dcefc;
    const _0x2edcd6 = Math["min"](Math["max"](_0x361e39, _0x22a0a9), _0xc839c5);
    const _0x509f8a = Math["max"](_0x5b2171, _0x3c9ebb - _0x5b2171 - _0x514cef);
    const _0x28367d = Number(_0x238be7["left"]) || 0x0;
    const _0x566500 = Number(_0x238be7['width']) || 0x0;
    const _0x3a2093 = Number(_0x238be7["right"]) || _0x28367d + _0x566500;
    const _0x3784e6 = Number['parseFloat'](globalThis["window"]?.["getComputedStyle"]?.(_0x245dc2)?.["borderRightWidth"]) || 0x0;
    const _0x1337e9 = _0x28367d - _0x514cef - 0x6;
    const _0xc6a309 = _0x3a2093 - _0x3784e6 + 0x6;
    let _0x281472 = _0x1337e9;
    if (_0x506cdf === 'viewport-auto' || _0x506cdf === 'viewport-auto-up') {
      const _0x42877c = _0xc6a309 + _0x514cef <= _0x3c9ebb - _0x5b2171;
      const _0x30d9ae = _0x1337e9 >= _0x5b2171;
      if (_0x42877c || !_0x30d9ae) {
        _0x281472 = _0xc6a309;
      }
    }
    _0x281472 = Math['max'](_0x5b2171, Math["min"](_0x281472, _0x509f8a));
    _0x1ac624["style"]["position"] = "fixed";
    _0x1ac624['style']["right"] = 'auto';
    _0x1ac624["style"]["left"] = _0x281472 + 'px';
    _0x1ac624['style']["top"] = _0x2edcd6 + 'px';
    _0x34f3f7 > _0x13ecac && (_0x1ac624["style"]["maxHeight"] = Math["floor"](_0x13ecac) + 'px', _0x1ac624["style"]['overflowY'] = "auto");
    return;
  }
  const _0x38bc58 = Math['max'](0x0, _0x37096d - _0x13ecac);
  let _0x788db8 = Math["min"](_0x4dcefc, _0x38bc58);
  if (_0x2cebf2 > _0x5b2171 * 0x2 && _0x13ecac > 0x0) {
    const _0x35a266 = _0x2cebf2 - _0x5b2171 - _0x13ecac;
    const _0x4d42bd = Math["min"](Math['max'](_0x238be7["top"] + _0x788db8, _0x5b2171), _0x35a266);
    _0x788db8 = _0x4d42bd - _0x238be7["top"];
    _0x34f3f7 > _0x13ecac && (_0x1ac624['style']['maxHeight'] = Math["floor"](_0x13ecac) + 'px', _0x1ac624["style"]["overflowY"] = "auto");
  }
  _0x1ac624["style"]["top"] = Math["round"](_0x788db8) + 'px';
}
export function createFloatingModelMenuPortal({
  menu: _0x2109a8,
  trigger: _0x149def,
  host: _0xc04ede,
  documentObject = globalThis["document"],
  windowObject = globalThis["window"],
  portalClass = "floating-model-menu-portal",
  submenuPlacement = "viewport-auto"
} = {}) {
  if (!_0x2109a8 || !_0x149def || !_0xc04ede?.["appendChild"]) {
    return {
      'isOpen': () => _0x2109a8?.["classList"]?.["contains"]?.("show") === !![],
      'open'() {
        _0x2109a8?.["classList"]?.["add"]?.("show");
        _0x149def?.["setAttribute"]?.("aria-expanded", "true");
      },
      'close'() {
        _0x2109a8?.["classList"]?.['remove']?.("show");
        _0x149def?.["setAttribute"]?.("aria-expanded", "false");
      },
      'contains': _0x117cc0 => _0x2109a8?.["contains"]?.(_0x117cc0) === !![],
      'destroy'() {}
    };
  }
  const _0x520b10 = ["position", 'left', 'top', "right", 'bottom', "animation", "transform", "max-height", "overflow-x", "overflow-y", 'overscroll-behavior'];
  const _0x2d86a7 = ["max-height", "overflow-x", 'overflow-y', 'overscroll-behavior'];
  const _0x4f779f = new Map(_0x520b10["map"](_0x405006 => [_0x405006, _0x2109a8['style']?.["getPropertyValue"]?.(_0x405006) || '']));
  const _0x1a25b2 = new Map();
  let _0x38b161 = null;
  let _0x3bd572 = null;
  let _0x5b3033 = ![];
  const _0x45efc5 = _0x475092 => {
    const _0xde2735 = _0x4f779f["get"](_0x475092);
    if (_0xde2735) {
      _0x2109a8["style"]?.['setProperty']?.(_0x475092, _0xde2735);
    } else {
      _0x2109a8["style"]?.["removeProperty"]?.(_0x475092);
    }
  };
  const _0x514c54 = () => {
    _0x2d86a7['forEach'](_0x45efc5);
  };
  const _0x98c96d = () => {
    _0x2109a8["querySelectorAll"]?.(".node-model-submenu")['forEach'](_0x19e983 => {
      !_0x1a25b2["has"](_0x19e983) && _0x1a25b2["set"](_0x19e983, _0x19e983["dataset"]?.["nodeSubmenuPlacement"]);
      _0x19e983["dataset"] && (_0x19e983["dataset"]["nodeSubmenuPlacement"] = submenuPlacement);
    });
  };
  const _0x498c48 = () => {
    _0x1a25b2['forEach']((_0x144570, _0x19c307) => {
      if (!_0x19c307?.["dataset"]) {
        return;
      }
      if (_0x144570 === undefined) {
        delete _0x19c307["dataset"]["nodeSubmenuPlacement"];
      } else {
        _0x19c307["dataset"]["nodeSubmenuPlacement"] = _0x144570;
      }
      ['position', "left", "top", "right", "max-height", 'overflow-y']["forEach"](_0x275da8 => _0x19c307["style"]?.["removeProperty"]?.(_0x275da8));
    });
    _0x1a25b2["clear"]();
  };
  const _0x3ea80b = () => {
    if (!_0x5b3033 || !_0x2109a8["classList"]["contains"]("show")) {
      return;
    }
    _0x514c54();
    const _0x44d7f3 = _0x149def["getBoundingClientRect"]?.();
    const _0x4247e3 = _0x2109a8["getBoundingClientRect"]?.();
    if (!_0x44d7f3 || !_0x4247e3) {
      return;
    }
    const _0x4f144c = Number(windowObject?.["innerWidth"]) || Number(documentObject?.["documentElement"]?.["clientWidth"]) || 0x0;
    const _0x585a0d = Number(windowObject?.["innerHeight"]) || Number(documentObject?.["documentElement"]?.["clientHeight"]) || 0x0;
    const _0x44fa1c = _0xc04ede["getBoundingClientRect"]?.() || {
      'top': 0x0,
      'left': 0x0,
      'right': _0x4f144c,
      'bottom': _0x585a0d
    };
    const _0x333249 = 0xc;
    const _0x58af1f = 0xc;
    const _0x506c4d = Math["max"](_0x333249, (Number(_0x44fa1c["left"]) || 0x0) + _0x333249);
    const _0x473343 = Math["max"](_0x333249, (Number(_0x44fa1c["top"]) || 0x0) + _0x333249);
    const _0x13e230 = Math["min"](_0x4f144c - _0x333249, Number(_0x44fa1c["right"]) || _0x4f144c - _0x333249);
    const _0x370e34 = Math['min'](_0x585a0d - _0x333249, Number(_0x44fa1c['bottom']) || _0x585a0d - _0x333249);
    const _0x4d797a = Math['max'](0x0, _0x370e34 - _0x473343);
    const _0x382179 = Math["min"](_0x4247e3['height'], _0x4d797a);
    _0x4247e3['height'] > _0x4d797a && (_0x2109a8['style']?.["setProperty"]?.("max-height", Math['floor'](_0x4d797a) + 'px'), _0x2109a8["style"]?.["setProperty"]?.("overflow-x", "hidden"), _0x2109a8["style"]?.["setProperty"]?.("overflow-y", 'auto'), _0x2109a8["style"]?.["setProperty"]?.("overscroll-behavior", "contain"));
    const _0x45637a = Math["max"](_0x506c4d, _0x13e230 - _0x4247e3['width']);
    const _0x306e49 = Math["max"](_0x473343, _0x370e34 - _0x382179);
    const _0x40870a = Math['min'](Math["max"](_0x44d7f3["left"], _0x506c4d), _0x45637a);
    const _0x6bb8a3 = _0x44d7f3["top"] - _0x58af1f - _0x382179;
    const _0x1a378f = _0x44d7f3["bottom"] + _0x58af1f;
    const _0x565c49 = _0x6bb8a3 >= _0x473343 ? Math["min"](_0x6bb8a3, _0x306e49) : Math["min"](Math["max"](_0x1a378f, _0x473343), _0x306e49);
    _0x2109a8["style"]?.["setProperty"]?.('position', "fixed");
    _0x2109a8["style"]?.["setProperty"]?.('left', _0x40870a + 'px');
    _0x2109a8["style"]?.["setProperty"]?.("top", _0x565c49 + 'px');
    _0x2109a8["style"]?.["setProperty"]?.("right", 'auto');
    _0x2109a8["style"]?.['setProperty']?.("bottom", "auto");
  };
  const _0x5814f9 = () => {
    if (!_0x5b3033) {
      return;
    }
    _0x498c48();
    if (portalClass) {
      _0x2109a8["classList"]['remove'](portalClass);
    }
    _0x520b10["forEach"](_0x45efc5);
    if (_0x38b161?.["isConnected"]) {
      const _0x15fe50 = _0x3bd572?.["parentNode"] === _0x38b161 ? _0x3bd572 : null;
      _0x38b161["insertBefore"](_0x2109a8, _0x15fe50);
    }
    _0x38b161 = null;
    _0x3bd572 = null;
    _0x5b3033 = ![];
  };
  const _0x204b77 = () => {
    closeNodeFooterMenus(_0x2109a8);
    _0x2109a8['classList']['remove']("show");
    _0x149def['setAttribute']?.("aria-expanded", "false");
    _0x5814f9();
  };
  const _0x3a46b7 = () => {
    if (!_0x5b3033) {
      _0x38b161 = _0x2109a8['parentNode'];
      _0x3bd572 = _0x2109a8['nextSibling'];
      _0xc04ede["appendChild"](_0x2109a8);
      if (portalClass) {
        _0x2109a8['classList']["add"](portalClass);
      }
      _0x5b3033 = !![];
    }
    _0x2109a8["style"]?.["setProperty"]?.("animation", "none");
    _0x2109a8['style']?.["setProperty"]?.("transform", 'none');
    _0x98c96d();
    _0x2109a8["classList"]["add"]("show");
    _0x149def['setAttribute']?.("aria-expanded", "true");
    _0x3ea80b();
  };
  documentObject?.["addEventListener"]?.('scroll', _0x3ea80b, !![]);
  windowObject?.["addEventListener"]?.("resize", _0x3ea80b);
  return {
    'isOpen': () => _0x2109a8["classList"]['contains']('show'),
    'open': _0x3a46b7,
    'close': _0x204b77,
    'contains': _0xdf4acc => _0x2109a8["contains"]?.(_0xdf4acc) === !![],
    'destroy'() {
      _0x204b77();
      documentObject?.['removeEventListener']?.('scroll', _0x3ea80b, !![]);
      windowObject?.["removeEventListener"]?.("resize", _0x3ea80b);
    }
  };
}
export function createFloatingUiSchemaPopupPortal({
  selector: _0x2c5242,
  host: _0x253688,
  documentObject = globalThis["document"],
  windowObject = globalThis["window"],
  placement = 'inline',
  portalClass = 'aigen-ui-schema-popup-portal',
  horizontalAlign = "center",
  contextClass = ''
} = {}) {
  if (!_0x2c5242 || placement !== 'portal-auto-up' || !_0x253688?.["appendChild"]) {
    return {
      'close'() {},
      'contains': () => ![],
      'destroy'() {}
    };
  }
  const _0x538e73 = ['animation', "transition", "position", "left", 'top', "right", "bottom", 'transform', 'min-width', "max-height", "overflow-x", "overflow-y"];
  const _0x5ab6c9 = ["click", "mousedown", "input", "change"];
  const _0x49cb1e = 0xc;
  const _0x1c8edc = 0x8;
  let _0x71da19 = null;
  let _0xbc1a08 = 0x0;
  const _0x4a1472 = () => {
    if (!_0xbc1a08) {
      return;
    }
    windowObject?.['cancelAnimationFrame']?.(_0xbc1a08);
    _0xbc1a08 = 0x0;
  };
  const _0x106082 = () => {
    const _0x3604c6 = Number(windowObject?.['innerWidth']) || Number(documentObject?.["documentElement"]?.["clientWidth"]) || 0x0;
    const _0x199dff = Number(windowObject?.["innerHeight"]) || Number(documentObject?.["documentElement"]?.["clientHeight"]) || 0x0;
    const _0x75699b = _0x253688['getBoundingClientRect']?.() || {
      'top': 0x0,
      'left': 0x0,
      'right': _0x3604c6,
      'bottom': _0x199dff
    };
    return {
      'left': Math['max'](_0x49cb1e, (Number(_0x75699b['left']) || 0x0) + _0x49cb1e),
      'top': Math["max"](_0x49cb1e, (Number(_0x75699b["top"]) || 0x0) + _0x49cb1e),
      'right': Math["min"](_0x3604c6 - _0x49cb1e, Number(_0x75699b['right']) || _0x3604c6 - _0x49cb1e),
      'bottom': Math["min"](_0x199dff - _0x49cb1e, Number(_0x75699b["bottom"]) || _0x199dff - _0x49cb1e)
    };
  };
  const _0x40d1be = () => {
    _0xbc1a08 = 0x0;
    const _0x4ac9a5 = _0x71da19?.["popup"];
    const _0xaa3d34 = _0x71da19?.["trigger"] || _0x71da19?.["fieldEl"];
    if (!_0x4ac9a5?.["isConnected"] || !_0xaa3d34?.["isConnected"]) {
      return;
    }
    const _0x526e0a = _0xaa3d34["getBoundingClientRect"]?.();
    if (!_0x526e0a) {
      return;
    }
    const _0x3c19ec = _0x106082();
    const _0x1db4a7 = Number(_0x526e0a["width"]) || Math["max"](0x0, (Number(_0x526e0a["right"]) || 0x0) - (Number(_0x526e0a["left"]) || 0x0));
    if (_0x71da19?.['preservesAnchorWidth'] && _0x1db4a7 > 0x0) {
      const _0x450217 = Math["max"](0x0, _0x3c19ec['right'] - _0x3c19ec["left"]);
      const _0x1bcb33 = Math["min"](Math["ceil"](_0x1db4a7), Math["floor"](_0x450217));
      _0x1bcb33 > 0x0 && _0x4ac9a5['style']?.["setProperty"]?.("min-width", _0x1bcb33 + 'px');
    }
    const _0x4fdce8 = _0x4ac9a5["getBoundingClientRect"]?.();
    if (!_0x4fdce8 || _0x4fdce8["width"] <= 0x0) {
      return;
    }
    const _0xf66f0b = Math["max"](0x50, _0x3c19ec['bottom'] - _0x3c19ec["top"]);
    const _0x47657a = Math['min'](_0x4fdce8["height"] || _0x4ac9a5['scrollHeight'] || _0xf66f0b, _0xf66f0b);
    const _0x2fc40e = _0x71da19?.["ownerProxy"]?.["classList"]?.['contains']?.('ui-schema-pill-menu') ? 0xc : _0x1c8edc;
    const _0x55f29d = Math['max'](_0x3c19ec['left'], _0x3c19ec["right"] - _0x4fdce8['width']);
    const _0x21e0ef = horizontalAlign === "start" ? _0x526e0a["left"] : horizontalAlign === "end" ? _0x526e0a['right'] - _0x4fdce8["width"] : _0x526e0a["left"] + (_0x1db4a7 - _0x4fdce8['width']) / 0x2;
    const _0x4118a6 = Math["min"](Math["max"](_0x21e0ef, _0x3c19ec["left"]), _0x55f29d);
    const _0x5dd802 = Math["max"](_0x3c19ec["top"], _0x3c19ec["bottom"] - _0x47657a);
    const _0x5efdca = _0x526e0a["top"] - _0x2fc40e - _0x47657a;
    const _0x4fa449 = _0x526e0a["bottom"] + _0x2fc40e;
    const _0x4d668b = _0x5efdca >= _0x3c19ec["top"] ? Math["min"](_0x5efdca, _0x5dd802) : Math['min'](Math["max"](_0x4fa449, _0x3c19ec["top"]), _0x5dd802);
    _0x4ac9a5["style"]?.["setProperty"]?.("position", "fixed");
    _0x4ac9a5["style"]?.["setProperty"]?.('left', _0x4118a6 + 'px');
    _0x4ac9a5['style']?.['setProperty']?.("top", _0x4d668b + 'px');
    _0x4ac9a5["style"]?.['setProperty']?.('right', "auto");
    _0x4ac9a5["style"]?.["setProperty"]?.("bottom", "auto");
    _0x4ac9a5["style"]?.["setProperty"]?.("transform", "none");
    _0x4ac9a5['style']?.["setProperty"]?.('max-height', Math["floor"](_0xf66f0b) + 'px');
    _0x4ac9a5['style']?.["setProperty"]?.("overflow-x", "hidden");
    _0x4ac9a5['style']?.["setProperty"]?.('overflow-y', "auto");
  };
  const _0x52ee69 = () => {
    if (!_0x71da19) {
      return;
    }
    _0x4a1472();
    const _0xc1c68b = windowObject?.["requestAnimationFrame"]?.["bind"]?.(windowObject) || (_0x3523b1 => windowObject?.['setTimeout']?.(_0x3523b1, 0x0));
    _0xbc1a08 = _0xc1c68b(_0x40d1be);
  };
  const _0x369ed6 = _0x2d4247 => {
    const _0x5b29a6 = windowObject?.["CustomEvent"] || globalThis["CustomEvent"];
    if (typeof _0x5b29a6 !== 'function' || !_0x71da19) {
      return;
    }
    _0x2c5242['dispatchEvent']?.(new _0x5b29a6("ui-schema-portaled-interaction", {
      'detail': {
        'fieldEl': _0x71da19['fieldEl'],
        'nativeEvent': _0x2d4247,
        'popup': _0x71da19["popup"]
      }
    }));
  };
  const _0x444077 = _0x17f597 => _0x17f597["stopPropagation"]();
  const _0x4c67ca = () => {
    _0x4a1472();
    if (!_0x71da19) {
      return;
    }
    const {
      popup: _0x2f511f,
      fieldEl: _0x545e6,
      originalParent: _0x424307,
      originalNextSibling: _0x1947db,
      originalStyles: _0x1e5600,
      ownerProxy: _0x42b944
    } = _0x71da19;
    _0x5ab6c9["forEach"](_0x3e8a08 => {
      _0x2f511f["removeEventListener"]?.(_0x3e8a08, _0x369ed6, !![]);
    });
    _0x2f511f["removeEventListener"]?.("wheel", _0x444077);
    _0x2f511f['classList']?.["remove"]?.(portalClass);
    _0x2f511f["__uiSchemaPortalRoot"] === _0x2c5242 && delete _0x2f511f['__uiSchemaPortalRoot'];
    _0x545e6?.["__uiSchemaPortaledPopup"] === _0x2f511f && delete _0x545e6["__uiSchemaPortaledPopup"];
    _0x1e5600["forEach"]((_0x34189d, _0x500587) => {
      if (_0x34189d) {
        _0x2f511f['style']?.["setProperty"]?.(_0x500587, _0x34189d);
      } else {
        _0x2f511f['style']?.["removeProperty"]?.(_0x500587);
      }
    });
    if (_0x424307?.['isConnected']) {
      const _0x497184 = _0x1947db?.["parentNode"] === _0x424307 ? _0x1947db : null;
      _0x424307["insertBefore"](_0x2f511f, _0x497184);
    }
    _0x42b944?.["remove"]?.();
    _0x71da19 = null;
  };
  const _0x319f7e = () => {
    const _0x3d8ed8 = _0x71da19?.['popup'];
    const _0x336064 = _0x71da19?.["trigger"];
    _0x3d8ed8 && (_0x3d8ed8['classList']?.['remove']?.("show", "is-closing"), _0x3d8ed8['setAttribute']?.("aria-hidden", "true"), _0x3d8ed8["classList"]?.["contains"]?.('floating-menu') ? _0x3d8ed8["style"]?.["setProperty"]?.("display", '') : _0x3d8ed8["style"]?.['setProperty']?.('display', 'none'));
    _0x336064?.["setAttribute"]?.("aria-expanded", "false");
    _0x4c67ca();
  };
  const _0x23aeac = ({
    popup: _0x38eb9d,
    fieldEl: _0x23b477
  }) => {
    const _0x253cba = _0x23b477?.["querySelector"]?.("[data-ui-schema-menu-trigger]") || _0x23b477;
    const _0x30bb1d = _0x38eb9d["parentElement"] || _0x23b477;
    const _0x24a4ba = String(_0x30bb1d?.["className"] || '')['split'](/\s+/u);
    const _0x225f71 = _0x30bb1d?.["classList"]?.["contains"]?.("ui-schema-advanced-dropdown") || _0x24a4ba['includes']("ui-schema-advanced-dropdown");
    const _0x691f80 = new Map(_0x538e73["map"](_0x2c1036 => [_0x2c1036, _0x38eb9d["style"]?.['getPropertyValue']?.(_0x2c1036) || '']));
    const _0x51bf69 = documentObject?.["createElement"]?.("div") || null;
    _0x51bf69 && (_0x51bf69["className"] = [String(_0x30bb1d?.["className"] || '')["trim"](), String(_0x23b477?.["className"] || '')['trim'](), 'aigen-ui-schema-owner-proxy', contextClass]["filter"](Boolean)["join"]('\x20'));
    _0x71da19 = {
      'popup': _0x38eb9d,
      'fieldEl': _0x23b477,
      'trigger': _0x253cba,
      'originalParent': _0x38eb9d["parentNode"],
      'originalNextSibling': _0x38eb9d["nextSibling"],
      'originalStyles': _0x691f80,
      'ownerProxy': _0x51bf69,
      'preservesAnchorWidth': _0x225f71
    };
    _0x23b477['__uiSchemaPortaledPopup'] = _0x38eb9d;
    _0x38eb9d["__uiSchemaPortalRoot"] = _0x2c5242;
    _0x253cba?.["setAttribute"]?.("aria-expanded", 'true');
    _0x253688["appendChild"](_0x51bf69 || _0x38eb9d);
    _0x51bf69?.["appendChild"]?.(_0x38eb9d);
    _0x38eb9d["classList"]?.["add"]?.(portalClass);
    _0x38eb9d["style"]?.["setProperty"]?.('animation', "none");
    _0x38eb9d['style']?.["setProperty"]?.("transition", 'none');
    _0x38eb9d["style"]?.["setProperty"]?.('transform', "none");
    _0x5ab6c9["forEach"](_0x1fd573 => {
      _0x38eb9d["addEventListener"]?.(_0x1fd573, _0x369ed6, !![]);
    });
    _0x38eb9d["addEventListener"]?.("wheel", _0x444077, {
      'passive': !![]
    });
    _0x52ee69();
  };
  const _0x155107 = _0x57b859 => {
    const _0x3a1087 = _0x57b859?.['detail']?.["popup"] || null;
    const _0x6877a9 = _0x57b859?.["detail"]?.["fieldEl"] || null;
    if (!_0x3a1087 || !_0x6877a9) {
      return;
    }
    const _0x10ffbb = _0x2c5242["contains"]?.(_0x6877a9) || _0x3a1087["__uiSchemaPortalRoot"] === _0x2c5242;
    if (!_0x10ffbb) {
      return;
    }
    if (!_0x57b859["detail"]?.['shouldOpen']) {
      if (_0x3a1087 === _0x71da19?.['popup']) {
        _0x319f7e();
      }
      return;
    }
    if (_0x71da19?.["popup"] !== _0x3a1087) {
      _0x319f7e();
    }
    if (!_0x71da19) {
      _0x23aeac({
        'popup': _0x3a1087,
        'fieldEl': _0x6877a9
      });
    }
    _0x52ee69();
  };
  const _0x251a3e = _0x5abf72 => {
    if (!_0x71da19 || _0x5abf72?.['detail']?.["popup"] !== _0x71da19["popup"]) {
      return;
    }
    _0x4a1472();
    _0x40d1be();
  };
  const _0x395692 = _0x12d293 => {
    (!_0x12d293?.["detail"]?.["popup"] || _0x12d293["detail"]["popup"] === _0x71da19?.["popup"]) && _0x319f7e();
  };
  _0x2c5242["addEventListener"]?.("ui-schema-menu-before-open", _0x155107);
  _0x2c5242["addEventListener"]?.("ui-schema-menu-after-open", _0x251a3e);
  _0x2c5242["addEventListener"]?.('ui-schema-portaled-close-request', _0x395692);
  documentObject?.['addEventListener']?.("scroll", _0x52ee69, !![]);
  windowObject?.["addEventListener"]?.("resize", _0x52ee69);
  return {
    'close': _0x319f7e,
    'contains': _0x5eae16 => _0x71da19?.["popup"]?.["contains"]?.(_0x5eae16) === !![],
    'destroy'() {
      _0x319f7e();
      _0x2c5242["removeEventListener"]?.("ui-schema-menu-before-open", _0x155107);
      _0x2c5242["removeEventListener"]?.("ui-schema-menu-after-open", _0x251a3e);
      _0x2c5242["removeEventListener"]?.('ui-schema-portaled-close-request', _0x395692);
      documentObject?.["removeEventListener"]?.("scroll", _0x52ee69, !![]);
      windowObject?.['removeEventListener']?.("resize", _0x52ee69);
    }
  };
}
export function bindNodeModelMenuTrigger({
  root: _0x54a1b7,
  trigger: _0x4409f4,
  menu: _0x2e4b9e,
  closeOthers: _0xcd88e4,
  activateMenuKeyboard: _0x1d3550
} = {}) {
  if (!_0x54a1b7 || !_0x4409f4 || !_0x2e4b9e) {
    return () => {};
  }
  const _0x1069cf = _0x4cd433 => {
    _0x4cd433["stopPropagation"]();
    const _0x3e7fae = !_0x2e4b9e["classList"]['contains']("show");
    if (typeof _0xcd88e4 === 'function') {
      _0xcd88e4(_0x2e4b9e);
    } else {
      closeNodeFooterMenus(_0x54a1b7, _0x2e4b9e);
    }
    _0x2e4b9e["classList"]["toggle"]("show", _0x3e7fae);
    _0x3e7fae && typeof _0x1d3550 === "function" && _0x1d3550(_0x2e4b9e);
  };
  _0x4409f4['addEventListener']("click", _0x1069cf);
  return () => _0x4409f4["removeEventListener"]("click", _0x1069cf);
}
export function bindNodeModelMenuPrewarm({
  trigger: _0xa358b7,
  prepare: _0x866e66,
  windowObject = globalThis['window']
} = {}) {
  const _0x2cbefa = () => null;
  if (!_0xa358b7?.['addEventListener'] || typeof _0x866e66 !== "function") {
    return {
      'prepareNow': _0x2cbefa,
      'schedule': _0x2cbefa,
      'destroy': _0x2cbefa
    };
  }
  let _0x233bef = ![];
  let _0x3ea22f = null;
  let _0x126ee4 = null;
  const _0x1d9e8b = windowObject?.["requestIdleCallback"]?.["bind"](windowObject);
  const _0xc75baa = windowObject?.["cancelIdleCallback"]?.["bind"](windowObject);
  const _0x371adf = windowObject?.["setTimeout"]?.['bind'](windowObject) || globalThis["setTimeout"];
  const _0x28db05 = windowObject?.["clearTimeout"]?.["bind"](windowObject) || globalThis["clearTimeout"];
  const _0x7b255d = () => {
    _0x3ea22f !== null && (_0xc75baa?.(_0x3ea22f), _0x3ea22f = null);
    _0x126ee4 !== null && (_0x28db05?.(_0x126ee4), _0x126ee4 = null);
  };
  const _0xfc30b8 = () => {
    _0x3ea22f = null;
    _0x126ee4 = null;
    if (_0x233bef || _0xa358b7["isConnected"] === ![]) {
      return null;
    }
    return _0x866e66();
  };
  const _0x27a80d = () => {
    if (_0x233bef || _0x3ea22f !== null || _0x126ee4 !== null) {
      return null;
    }
    _0x1d9e8b ? _0x3ea22f = _0x1d9e8b(_0xfc30b8, {
      'timeout': 0x64
    }) : _0x126ee4 = _0x371adf?.(_0xfc30b8, 0x0) ?? null;
    return null;
  };
  const _0x4af9c6 = () => {
    if (_0x233bef) {
      return null;
    }
    _0x7b255d();
    return _0x866e66();
  };
  _0xa358b7["addEventListener"]("pointerenter", _0x27a80d);
  _0xa358b7["addEventListener"]("focus", _0x27a80d);
  _0xa358b7["addEventListener"]("pointerdown", _0x4af9c6);
  return {
    'prepareNow': _0x4af9c6,
    'schedule': _0x27a80d,
    'destroy'() {
      if (_0x233bef) {
        return;
      }
      _0x233bef = !![];
      _0x7b255d();
      _0xa358b7["removeEventListener"]?.("pointerenter", _0x27a80d);
      _0xa358b7["removeEventListener"]?.("focus", _0x27a80d);
      _0xa358b7["removeEventListener"]?.('pointerdown', _0x4af9c6);
    }
  };
}
export function bindNodeSubmenus(_0x45e833, {
  delay = 0x78
} = {}) {
  if (!_0x45e833) {
    return () => {};
  }
  const _0x3a0170 = [];
  const _0x378086 = new Map();
  const _0x3e31d5 = _0x45e833["querySelectorAll"]("[data-node-menu-submenu]");
  _0x3e31d5['forEach'](_0x57350a => {
    const _0x13084d = _0x57350a["dataset"]['nodeMenuSubmenu'] || '';
    const _0x27fd42 = _0x13084d ? _0x45e833["querySelector"](_0x13084d) : null;
    if (!_0x27fd42) {
      return;
    }
    const _0x1b4c4c = () => {
      clearTimeout(_0x378086["get"](_0x27fd42));
      positionNodeSubmenu(_0x57350a, _0x27fd42);
    };
    const _0x457893 = () => {
      clearTimeout(_0x378086["get"](_0x27fd42));
      _0x378086["set"](_0x27fd42, setTimeout(() => {
        hidePopup(_0x27fd42);
        _0x378086['delete'](_0x27fd42);
      }, delay));
    };
    _0x57350a['addEventListener']("mouseenter", _0x1b4c4c);
    _0x57350a["addEventListener"]("mouseleave", _0x457893);
    _0x57350a["addEventListener"]("click", _0x1b4c4c);
    _0x27fd42["addEventListener"]("mouseenter", _0x1b4c4c);
    _0x27fd42["addEventListener"]("mouseleave", _0x457893);
    _0x3a0170["push"](() => {
      clearTimeout(_0x378086["get"](_0x27fd42));
      _0x57350a["removeEventListener"]('mouseenter', _0x1b4c4c);
      _0x57350a["removeEventListener"]("mouseleave", _0x457893);
      _0x57350a['removeEventListener']("click", _0x1b4c4c);
      _0x27fd42["removeEventListener"]("mouseenter", _0x1b4c4c);
      _0x27fd42["removeEventListener"]("mouseleave", _0x457893);
    });
  });
  return () => _0x3a0170["forEach"](_0x475e67 => _0x475e67());
}
export function bindNodeFooterController(_0x5051d3, _0x528e56 = {}) {
  if (!_0x5051d3) {
    return () => {};
  }
  const _0x145535 = [];
  _0x145535["push"](bindNodeSubmenus(_0x5051d3));
  const _0x4c1d0b = _0x4c9675 => {
    const _0x215317 = _0x4c9675?.["detail"]?.["fieldEl"] || null;
    closeNodeFooterMenus(_0x5051d3, null, {
      'preserveAdvPanel': _0x215317
    });
  };
  _0x5051d3["addEventListener"]("ui-schema-menu-before-open", _0x4c1d0b);
  _0x145535["push"](() => _0x5051d3['removeEventListener']("ui-schema-menu-before-open", _0x4c1d0b));
  const _0x2b81ef = _0xd13c4f => {
    const _0x1f06da = _0xd13c4f['target']?.['closest']?.(".ui-schema-floating-menu, .floating-menu");
    _0x1f06da && _0x5051d3["contains"](_0x1f06da) && _0xd13c4f["stopPropagation"]();
  };
  _0x5051d3["addEventListener"]("wheel", _0x2b81ef, {
    'passive': !![]
  });
  _0x145535["push"](() => _0x5051d3['removeEventListener']("wheel", _0x2b81ef));
  const _0x1fd7d3 = _0x488951 => {
    const _0x5c54ea = _0x5051d3["contains"](_0x488951['target']) || isInsideOwnedFloatingMenu(_0x5051d3, _0x488951["target"]);
    if (!_0x5c54ea) {
      closeNodeFooterMenus(_0x5051d3);
    }
    typeof _0x528e56["onDocumentClick"] === "function" && _0x528e56["onDocumentClick"](_0x488951, {
      'isInsideRoot': _0x5c54ea
    });
    !_0x5c54ea && typeof _0x528e56["onOutsideClose"] === "function" && _0x528e56['onOutsideClose']();
  };
  document?.['addEventListener']?.("click", _0x1fd7d3);
  _0x145535["push"](() => document?.["removeEventListener"]?.("click", _0x1fd7d3));
  return () => _0x145535["forEach"](_0x1cd364 => _0x1cd364());
}