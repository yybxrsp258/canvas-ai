const sidebarSubmenus = new Map();
let activeKey = '';
let globalsInstalled = ![];
function containsTarget(_0x3d49f5, _0x55d78b) {
  return !!_0x3d49f5 && (_0x3d49f5 === _0x55d78b || _0x3d49f5['contains']?.(_0x55d78b));
}
function shouldIgnorePointerDown(_0x5b07f3, _0x273a55) {
  if (typeof _0x5b07f3?.["ignorePointerDown"] !== "function") {
    return ![];
  }
  return _0x5b07f3["ignorePointerDown"](_0x273a55) === !![];
}
function isEntryOpen(_0x545b2c) {
  if (!_0x545b2c) {
    return ![];
  }
  if (typeof _0x545b2c["isOpen"] === "function") {
    return _0x545b2c["isOpen"]();
  }
  return _0x545b2c["panel"]?.["classList"]?.["contains"](_0x545b2c["openClass"]) === !![];
}
function applyDefaultOpen(_0x562741) {
  _0x562741['panel']?.["classList"]?.['add'](_0x562741["openClass"]);
  _0x562741["button"]?.['classList']?.['add'](_0x562741["activeClass"]);
  _0x562741['button']?.['setAttribute']?.("aria-expanded", 'true');
}
function applyDefaultClose(_0x1199b2) {
  _0x1199b2["panel"]?.['classList']?.["remove"](_0x1199b2["openClass"]);
  _0x1199b2["button"]?.['classList']?.["remove"](_0x1199b2["activeClass"]);
  _0x1199b2["button"]?.["setAttribute"]?.("aria-expanded", "false");
}
function closeEntry(_0x591cda) {
  if (!_0x591cda) {
    return;
  }
  if (typeof _0x591cda["close"] === "function") {
    _0x591cda["close"]();
  } else {
    applyDefaultClose(_0x591cda);
  }
  _0x591cda['button']?.["classList"]?.["remove"](_0x591cda["activeClass"]);
  _0x591cda["button"]?.['setAttribute']?.("aria-expanded", 'false');
  if (activeKey === _0x591cda["key"]) {
    activeKey = '';
  }
}
function installGlobals() {
  if (globalsInstalled) {
    return;
  }
  globalsInstalled = !![];
  document["addEventListener"]('pointerdown', _0x710778 => {
    const _0xd2fd15 = sidebarSubmenus["get"](activeKey);
    if (!_0xd2fd15) {
      return;
    }
    if (containsTarget(_0xd2fd15["button"], _0x710778["target"])) {
      return;
    }
    if (containsTarget(_0xd2fd15['panel'], _0x710778["target"])) {
      return;
    }
    if (shouldIgnorePointerDown(_0xd2fd15, _0x710778)) {
      return;
    }
    if (_0xd2fd15["closeOnOutsidePointerDown"] === ![]) {
      return;
    }
    closeEntry(_0xd2fd15);
  }, !![]);
  document['addEventListener']("keydown", _0x2d217a => {
    if (_0x2d217a["key"] !== 'Escape' || _0x2d217a["isComposing"]) {
      return;
    }
    const _0x5023e4 = sidebarSubmenus["get"](activeKey);
    if (!_0x5023e4) {
      return;
    }
    closeEntry(_0x5023e4);
  });
}
export function closeSidebarSubmenu(_0x50a4ee) {
  closeEntry(sidebarSubmenus["get"](_0x50a4ee));
}
export function closeAllSidebarSubmenus(_0x5dd26a = '') {
  for (const [_0x472659, _0x10b417] of sidebarSubmenus["entries"]()) {
    if (_0x472659 !== _0x5dd26a) {
      closeEntry(_0x10b417);
    }
  }
}
export function openSidebarSubmenu(_0x1c2678) {
  const _0x2ad5b1 = sidebarSubmenus["get"](_0x1c2678);
  if (!_0x2ad5b1) {
    return;
  }
  closeAllSidebarSubmenus(_0x1c2678);
  activeKey = _0x1c2678;
  if (typeof _0x2ad5b1["open"] === "function") {
    _0x2ad5b1["open"]();
  } else {
    applyDefaultOpen(_0x2ad5b1);
  }
  _0x2ad5b1["button"]?.["classList"]?.["add"](_0x2ad5b1["activeClass"]);
  _0x2ad5b1["button"]?.["setAttribute"]?.("aria-expanded", "true");
}
export function toggleSidebarSubmenu(_0x1ba573) {
  const _0x5f40f4 = sidebarSubmenus["get"](_0x1ba573);
  if (!_0x5f40f4) {
    return;
  }
  if (activeKey === _0x1ba573 && isEntryOpen(_0x5f40f4)) {
    closeEntry(_0x5f40f4);
    return;
  }
  openSidebarSubmenu(_0x1ba573);
}
export function registerSidebarSubmenu({
  key: _0x48600e,
  button: _0x28ab21,
  panel: _0x4d103c,
  open: _0x2a0110,
  close: _0x3cf221,
  isOpen: _0x10670f,
  ignorePointerDown: _0x460b82,
  closeOnOutsidePointerDown = !![],
  openClass = "show",
  activeClass = "active"
} = {}) {
  if (!_0x48600e || !_0x28ab21 || !_0x4d103c) {
    return;
  }
  installGlobals();
  const _0x38088e = sidebarSubmenus["get"](_0x48600e);
  _0x38088e?.["button"] && _0x38088e["clickHandler"] && _0x38088e['button']["removeEventListener"]?.("click", _0x38088e["clickHandler"]);
  _0x38088e?.["button"] && _0x38088e["dblClickHandler"] && _0x38088e["button"]["removeEventListener"]?.("dblclick", _0x38088e["dblClickHandler"]);
  const _0x25eab6 = {
    'key': _0x48600e,
    'button': _0x28ab21,
    'panel': _0x4d103c,
    'open': _0x2a0110,
    'close': _0x3cf221,
    'isOpen': _0x10670f,
    'ignorePointerDown': _0x460b82,
    'closeOnOutsidePointerDown': closeOnOutsidePointerDown,
    'openClass': openClass,
    'activeClass': activeClass,
    'clickHandler': null,
    'dblClickHandler': null
  };
  _0x25eab6["clickHandler"] = _0x1e25fe => {
    _0x1e25fe["preventDefault"]();
    _0x1e25fe["stopPropagation"]();
    if (Number(_0x1e25fe['detail'] || 0x0) > 0x1) {
      return;
    }
    toggleSidebarSubmenu(_0x48600e);
  };
  _0x25eab6["dblClickHandler"] = _0xfadecd => {
    _0xfadecd["preventDefault"]();
    _0xfadecd["stopPropagation"]();
    closeEntry(_0x25eab6);
  };
  sidebarSubmenus["set"](_0x48600e, _0x25eab6);
  _0x28ab21['setAttribute']?.("aria-haspopup", "menu");
  _0x28ab21["setAttribute"]?.('aria-expanded', isEntryOpen(_0x25eab6) ? "true" : "false");
  _0x28ab21["addEventListener"]("click", _0x25eab6["clickHandler"]);
  _0x28ab21["addEventListener"]('dblclick', _0x25eab6["dblClickHandler"]);
}