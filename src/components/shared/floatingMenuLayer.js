import { positionAnchoredSubmenu } from '../../utils/submenuPosition.js';

/**
 * 模型选择弹层。
 *
 * 画布节点与剧本工作室里的模型菜单原本是节点卡片内的 position:absolute 元素，会被
 * .v2-canvas-stage（overflow:hidden + contain:layout paint）和节点卡片裁掉上半截，
 * 且被裁掉的部分无法滚动看到。这里把打开中的模型菜单搬到"最近的、不会成为 fixed 包含块的祖先"
 * 之下（画布是 #v2-wrap，剧本工作室是 .story-workspace-root，两者都还在主题作用域内，
 * CSS 变量不会因为搬家而丢失），再按视口带定位：优先向上弹，放不下向下，再放不下就限高内部滚动。
 */
const MODEL_MENU_SELECTOR = '.floating-menu.img-model-menu, .floating-menu.node-model-menu';
const LAYER_CLASS = 'floating-menu-layer';
const SUBMENU_SELECTOR = '.node-model-submenu';
const SUBMENU_PLACEMENT = 'viewport-auto';
const GAP = 12;
const MARGIN = 12;
const MIN_BAND_HEIGHT = 180;
const TRANSFERRED_PROPS = ['position', 'left', 'top', 'right', 'bottom', 'max-height', 'overflow-x', 'overflow-y', 'overscroll-behavior', 'animation', 'transform'];
const FONT_SNAPSHOT_SELECTOR = '.floating-menu-item, .node-menu-item, .floating-menu-label, .node-menu-group-header';
const SUBMENU_RESET_PROPS = ['position', 'left', 'top', 'right', 'max-height', 'overflow-y'];
const LAYER_OWNERS = new WeakMap();
export function isInsideOwnedFloatingMenu(_0x5051d3, _0x488951) {
  const _0x30d0c4 = _0x5051d3 && _0x488951?.["closest"]?.('.' + LAYER_CLASS);
  if (!_0x30d0c4) {
    return ![];
  }
  const _0x313e1f = LAYER_OWNERS["get"](_0x30d0c4);
  return !!_0x313e1f && (_0x313e1f === _0x5051d3 || !!_0x5051d3["contains"]?.(_0x313e1f));
}
const CONTAINING_BLOCK_TESTS = [_0x2ee1cb, _0x5a6d68, _0x22f7c2, _0x327cb7, _0x15c5da];
function _0x2ee1cb(_0x4dcf0e) {
  return !!_0x4dcf0e && _0x4dcf0e !== 'none';
}
function _0x5a6d68(_0x19c439) {
  return /(^|\s)(paint|layout|strict|content)(\s|$)/['test'](_0x19c439 || '');
}
function _0x22f7c2(_0x3d7ed4) {
  return _0x3d7ed4 === 'layout' || _0x3d7ed4 === 'size';
}
function _0x327cb7(_0x3157e8) {
  return /(^|\s|,)(transform|filter|backdrop-filter|perspective)(\s|$|,)/['test'](_0x3157e8 || '');
}
function _0x15c5da(_0x2b4977) {
  return _0x2b4977 === "hidden";
}
const CONTAINING_BLOCK_PROPERTIES = ['transform', 'contain', 'container-type', 'will-change', 'content-visibility'];
function isContainingBlockElement(_0x4ce882) {
  const _0x3801d0 = _0x4ce882?.ownerDocument?.defaultView;
  const _0x10bc55 = _0x3801d0?.['getComputedStyle']?.(_0x4ce882);
  if (!_0x10bc55) {
    return ![];
  }
  return CONTAINING_BLOCK_PROPERTIES['some']((_0x31c258, _0x57a786) => CONTAINING_BLOCK_TESTS[_0x57a786](_0x10bc55["getPropertyValue"](_0x31c258)));
}
function resolveLayerHost(_0x41c211) {
  const _0x1a3255 = _0x41c211.ownerDocument;
  let _0x3496bd = null;
  let _0x5e3367 = _0x41c211["parentElement"];
  while (_0x5e3367 && _0x5e3367 !== _0x1a3255["body"]) {
    isContainingBlockElement(_0x5e3367) && (_0x3496bd = _0x5e3367);
    _0x5e3367 = _0x5e3367["parentElement"];
  }
  return _0x3496bd?.["parentElement"] || _0x1a3255["body"];
}
function toUsableRect(_0x4228b0) {
  const _0x10284d = _0x4228b0?.["getBoundingClientRect"]?.();
  if (!_0x10284d) {
    return null;
  }
  return _0x10284d["width"] || _0x10284d["height"] || _0x10284d["top"] || _0x10284d["left"] ? _0x10284d : null;
}
function resolveAnchorRect(_0x40f2b5) {
  const _0x2423f2 = _0x40f2b5["parent"]?.["querySelector"]?.(".img-model-btn-trigger, .node-model-trigger, button");
  const _0x3c883a = toUsableRect(_0x2423f2) || toUsableRect(_0x40f2b5["parent"]);
  if (_0x3c883a) {
    return _0x3c883a;
  }
  const _0x28c22d = _0x40f2b5["anchorCandidate"];
  if (_0x28c22d?.["isConnected"] && !_0x40f2b5["menu"]["contains"](_0x28c22d)) {
    return toUsableRect(_0x28c22d["closest"]?.("button, [role=\x22button\x22]") || _0x28c22d) || toUsableRect(_0x28c22d);
  }
  return null;
}
function readChromeBottom(_0x11bb6b, _0x4403b3) {
  const _0x4321f2 = _0x11bb6b["querySelector"]?.(".header");
  const _0x2740f1 = toUsableRect(_0x4321f2);
  if (!_0x2740f1 || _0x2740f1["top"] > MARGIN) {
    return 0x0;
  }
  return Math["min"](Math["max"](_0x2740f1["bottom"], 0x0), (_0x4403b3 || 0x0) * 0.4);
}
function placeLayerMenu(_0x4f7342) {
  const {
    menu: _0x3527d4
  } = _0x4f7342;
  if (!_0x3527d4["isConnected"]) {
    releaseLayerMenu(_0x4f7342);
    return ![];
  }
  const _0x16758b = _0x3527d4.ownerDocument;
  const _0x53d3f3 = _0x16758b.defaultView;
  const _0x2c476e = Number(_0x53d3f3?.["innerWidth"]) || 0x0;
  const _0x3f5dc1 = Number(_0x53d3f3?.["innerHeight"]) || 0x0;
  const _0x1d78f5 = resolveAnchorRect(_0x4f7342);
  if (!_0x1d78f5 || !_0x3f5dc1) {
    return;
  }
  _0x3527d4["style"]["removeProperty"]("max-height");
  _0x3527d4["style"]["removeProperty"]("overflow-y");
  _0x3527d4["style"]["bottom"] = 'auto';
  const _0x47ca8c = Math.max(_0x3527d4["getBoundingClientRect"]?.()["height"] || 0x0, _0x3527d4["scrollHeight"] || 0x0);
  let _0x3d0b66 = readChromeBottom(_0x16758b, _0x3f5dc1);
  _0x3f5dc1 - _0x3d0b66 - MARGIN * 0x2 < MIN_BAND_HEIGHT && (_0x3d0b66 = 0x0);
  const _0x47a6c7 = _0x1d78f5["top"] - GAP - (_0x3d0b66 + MARGIN);
  const _0x10382a = _0x3f5dc1 - MARGIN - _0x1d78f5["bottom"] - GAP;
  const _0x18fc9f = _0x47ca8c <= _0x47a6c7 ? "above" : _0x47ca8c <= _0x10382a ? "below" : _0x47a6c7 >= _0x10382a ? "above" : "below";
  positionAnchoredSubmenu({
    'submenu': _0x3527d4,
    'anchorRect': _0x1d78f5,
    'verticalPlacement': _0x18fc9f,
    'verticalGap': GAP,
    'position': "fixed",
    'viewportMargin': MARGIN,
    'viewportWidth': _0x2c476e,
    'viewportHeight': _0x3f5dc1,
    'viewportTop': _0x3d0b66,
    'horizontalPlacement': 'center'
  });
  const _0x25e405 = _0x3527d4["getBoundingClientRect"]?.()["width"] || 0x0;
  _0x2c476e && _0x25e405 && (_0x3527d4["style"]["left"] = Math["round"](Math["min"](Math["max"](_0x1d78f5["left"], MARGIN), Math["max"](MARGIN, _0x2c476e - MARGIN - _0x25e405))) + 'px');
  _0x3527d4["style"]["right"] = 'auto';
  return !![];
}
function promoteLayerMenu(_0x5a889d, _0x4f19c9) {
  const _0x177756 = _0x5a889d.ownerDocument;
  if (!resolveAnchorRect({
    'menu': _0x5a889d,
    'parent': _0x5a889d["parentNode"],
    'anchorCandidate': _0x4f19c9
  })) {
    return null;
  }
  const _0x138521 = {
    "menu": _0x5a889d,
    'parent': _0x5a889d["parentNode"],
    'nextSibling': _0x5a889d["nextSibling"],
    'anchorCandidate': _0x4f19c9,
    'styles': new Map(TRANSFERRED_PROPS["map"](_0x4a53f8 => [_0x4a53f8, _0x5a889d["style"]["getPropertyValue"](_0x4a53f8) || ''])),
    'submenus': [],
    'fonts': [],
    'host': null
  };
  _0x5a889d["querySelectorAll"]?.(SUBMENU_SELECTOR)["forEach"](_0x2893b8 => {
    _0x138521["submenus"]['push']({
      'el': _0x2893b8,
      'placement': _0x2893b8["dataset"] ? _0x2893b8["dataset"]["nodeSubmenuPlacement"] : undefined
    });
    _0x2893b8["dataset"] && (_0x2893b8["dataset"]["nodeSubmenuPlacement"] = SUBMENU_PLACEMENT);
  });
  const _0x11e5e8 = resolveLayerHost(_0x5a889d);
  const _0x33c1c8 = _0x177756["defaultView"];
  const _0x2bd5cf = _0x33c1c8 ? [..._0x5a889d["querySelectorAll"](FONT_SNAPSHOT_SELECTOR)] : [];
  const _0x1e611c = _0x2bd5cf["map"](_0x4c1f77 => _0x33c1c8["getComputedStyle"](_0x4c1f77)["fontSize"]);
  _0x11e5e8 && _0x5a889d["parentNode"] !== _0x11e5e8 && _0x11e5e8["appendChild"](_0x5a889d);
  _0x138521["host"] = _0x11e5e8 || null;
  LAYER_OWNERS["set"](_0x5a889d, _0x138521["parent"]);
  _0x5a889d["classList"]["add"](LAYER_CLASS);
  _0x5a889d["style"]["setProperty"]("animation", "none");
  _0x5a889d["style"]["setProperty"]("transform", "none");
  _0x2bd5cf["forEach"]((_0x4c1f77, _0x5c8f3c) => {
    if (!_0x4c1f77["isConnected"]) {
      return;
    }
    const _0x3016b7 = _0x1e611c[_0x5c8f3c];
    _0x33c1c8["getComputedStyle"](_0x4c1f77)["fontSize"] === _0x3016b7 || (_0x138521["fonts"]['push']({
      'el': _0x4c1f77,
      'inline': _0x4c1f77["style"]["fontSize"] || ''
    }), _0x4c1f77["style"]["setProperty"]("font-size", _0x3016b7));
  });
  placeLayerMenu(_0x138521);
  return _0x138521;
}
function releaseLayerMenu(_0x2e90a7) {
  if (!_0x2e90a7) {
    return;
  }
  const _0x48247f = _0x2e90a7["menu"];
  LAYER_OWNERS["delete"](_0x48247f);
  _0x48247f["classList"]?.["remove"]?.(LAYER_CLASS);
  _0x2e90a7["styles"]["forEach"]((_0x1647b6, _0x11d8e9) => {
    _0x1647b6 ? _0x48247f["style"]?.["setProperty"]?.(_0x11d8e9, _0x1647b6) : _0x48247f["style"]?.["removeProperty"]?.(_0x11d8e9);
  });
  _0x2e90a7["fonts"]["forEach"](({
    el: _0x4c1f77,
    inline: _0x3016b7
  }) => {
    _0x3016b7 ? _0x4c1f77["style"]?.["setProperty"]?.("font-size", _0x3016b7) : _0x4c1f77["style"]?.["removeProperty"]?.("font-size");
  });
  _0x2e90a7["submenus"]["forEach"](({
    el: _0x3616f2,
    placement: _0x3228f5
  }) => {
    if (!_0x3616f2?.["dataset"]) {
      return;
    }
    _0x3228f5 === undefined ? delete _0x3616f2["dataset"]["nodeSubmenuPlacement"] : _0x3616f2["dataset"]["nodeSubmenuPlacement"] = _0x3228f5;
    SUBMENU_RESET_PROPS["forEach"](_0x2f17e8 => _0x3616f2["style"]?.["removeProperty"]?.(_0x2f17e8));
  });
  if (_0x48247f["isConnected"] && _0x2e90a7["parent"]?.["isConnected"] && _0x2e90a7["parent"] !== _0x48247f["parentNode"]) {
    const _0x5f98ef = _0x2e90a7["nextSibling"]?.["parentNode"] === _0x2e90a7["parent"] ? _0x2e90a7["nextSibling"] : null;
    _0x2e90a7["parent"]["insertBefore"](_0x48247f, _0x5f98ef);
  }
}
export function installFloatingMenuLayer({
  documentObject = globalThis["document"],
  windowObject = globalThis["window"]
} = {}) {
  if (!documentObject?.documentElement || !windowObject?.MutationObserver || windowObject.__canvasFloatingMenuLayer) {
    return () => {};
  }
  let _0x1b5d19 = null;
  let _0x3df3a8 = null;
  const syncViewportTop = () => {
    windowObject.__canvasFloatingMenuViewportTop = readChromeBottom(documentObject, Number(windowObject["innerHeight"]) || 0x0) || '';
  };
  syncViewportTop();
  const _0x5dd966 = _0x17d6f9 => _0x17d6f9?.["nodeType"] === 0x1 && _0x17d6f9["matches"]?.(MODEL_MENU_SELECTOR) === !![];
  const _0x1e18b3 = () => {
    syncViewportTop();
    _0x1b5d19 && placeLayerMenu(_0x1b5d19) === ![] && (_0x1b5d19 = null);
  };
  const _0x2af75c = () => {
    _0x1b5d19 && (_0x1b5d19["menu"]["classList"]["remove"]("show"), releaseLayerMenu(_0x1b5d19), _0x1b5d19 = null);
  };
  const _0x4d2c34 = _0x30f389 => {
    for (const _0x178969 of _0x30f389) {
      const _0x4e7dc7 = _0x178969["target"];
      if (!_0x5dd966(_0x4e7dc7)) {
        if (_0x1b5d19?.["menu"] === _0x4e7dc7) {
          releaseLayerMenu(_0x1b5d19);
          _0x1b5d19 = null;
        }
        continue;
      }
      if (!_0x4e7dc7["classList"]["contains"]("show")) {
        _0x1b5d19?.["menu"] === _0x4e7dc7 && (releaseLayerMenu(_0x1b5d19), _0x1b5d19 = null);
        continue;
      }
      if (_0x4e7dc7["style"]["position"] === "fixed" && _0x1b5d19?.["menu"] !== _0x4e7dc7) {
        continue;
      }
      if (_0x1b5d19?.["menu"] === _0x4e7dc7) {
        placeLayerMenu(_0x1b5d19) === ![] && (_0x1b5d19 = null);
        continue;
      }
      _0x2af75c();
      _0x1b5d19 = promoteLayerMenu(_0x4e7dc7, _0x3df3a8) || null;
    }
  };
  const _0x24cecb = new windowObject["MutationObserver"](_0x4d2c34);
  _0x24cecb["observe"](documentObject["documentElement"], {
    'attributes': !![],
    'attributeFilter': ['class'],
    'subtree': !![]
  });
  const _0x3ea590 = () => {
    if (!_0x1b5d19) {
      return;
    }
    const _0x6e17c5 = _0x1b5d19["menu"]["isConnected"] && _0x1b5d19["parent"]?.["isConnected"];
    if (_0x6e17c5) {
      return;
    }
    const _0x5b7ab3 = _0x1b5d19;
    _0x1b5d19 = null;
    _0x5b7ab3["menu"]["classList"]["remove"]("show");
    releaseLayerMenu(_0x5b7ab3);
    _0x5b7ab3["parent"]?.["isConnected"] || _0x5b7ab3["menu"]["remove"]();
  };
  const _0x600b21 = new windowObject["MutationObserver"](_0x3ea590);
  _0x600b21["observe"](documentObject["documentElement"], {
    'childList': !![],
    'subtree': !![]
  });
  const _0x31d8e5 = _0x5749b => {
    _0x3df3a8 = _0x5749b?.["target"] || null;
  };
  documentObject["addEventListener"]?.("pointerdown", _0x31d8e5, !![]);
  documentObject["addEventListener"]?.("scroll", _0x1e18b3, !![]);
  const _0x21f2d5 = _0x28a24b => {
    _0x28a24b["target"]?.["closest"]?.('.' + LAYER_CLASS) && (_0x28a24b["__aiCanvasWheelHandled"] = !![], _0x28a24b["stopPropagation"]());
  };
  documentObject["addEventListener"]?.("wheel", _0x21f2d5, !![]);
  windowObject["addEventListener"]?.("resize", _0x1e18b3);
  windowObject.__canvasFloatingMenuLayer = !![];
  return () => {
    _0x2af75c();
    _0x24cecb["disconnect"]();
    _0x600b21["disconnect"]();
    documentObject["removeEventListener"]?.("pointerdown", _0x31d8e5, !![]);
    documentObject["removeEventListener"]?.("scroll", _0x1e18b3, !![]);
    documentObject["removeEventListener"]?.("wheel", _0x21f2d5, !![]);
    windowObject["removeEventListener"]?.("resize", _0x1e18b3);
    delete windowObject.__canvasFloatingMenuLayer;
  };
}
