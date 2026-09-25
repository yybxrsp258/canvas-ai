import { positionAnchoredSubmenu } from '../../utils/submenuPosition.js';
import { createFocusNavigation } from '../../utils/focusNavigation.js';
import { createContextMenuIcon } from './contextMenuIcons.js';
import { getShortcutLabel, resolveShortcutActionForEvent } from '../shortcuts.js';
let activeContextMenuSession = null;
export function removeContextMenus({
  includeNodePicker = !![]
} = {}) {
  const _0x3818f9 = activeContextMenuSession;
  activeContextMenuSession = null;
  _0x3818f9?.["close"]?.({
    'restoreFocus': ![]
  });
  Array["from"](document["querySelectorAll"]?.(".v2-canvas-ctx-menu") || [])["forEach"](_0x19518c => _0x19518c["remove"]());
  includeNodePicker && document["querySelector"]?.(".v2-node-picker")?.['remove']();
}
function placeMenu(_0x453669, _0x38fa65, _0x5edc7a, _0x5acb09 = 0x0, _0x433ebd = "auto") {
  document["body"]['appendChild'](_0x453669);
  const _0x4c77cc = Math["max"](0x0, Number(_0x5acb09) || 0x0) + 0x8;
  const _0x42a585 = _0x433ebd === "top" ? Math["max"](0x0, Math["min"](_0x5edc7a, window["innerHeight"] - 0x8) - _0x4c77cc) : Math['max'](0x78, window["innerHeight"] - _0x4c77cc - 0x8);
  _0x453669['style']["maxHeight"] = _0x42a585 + 'px';
  _0x453669["style"]['overflowY'] = "auto";
  _0x453669["style"]['overscrollBehavior'] = "contain";
  const _0x2bd4fa = _0x453669["offsetWidth"] || 0xf0;
  const _0xcb3c88 = Math['min'](_0x453669["offsetHeight"] || 0xc8, _0x42a585);
  const _0x35aaaf = _0x38fa65 + _0x2bd4fa > window["innerWidth"] ? _0x38fa65 - _0x2bd4fa : _0x38fa65;
  const _0x5174ca = Math['min'](Math["max"](0x8, _0x35aaaf), Math["max"](0x8, window["innerWidth"] - _0x2bd4fa - 0x8));
  const _0x2f4ab3 = _0x433ebd === "top" || _0x5edc7a + _0xcb3c88 > window["innerHeight"] ? _0x5edc7a - _0xcb3c88 : _0x5edc7a;
  const _0x440cd3 = Math['max'](_0x4c77cc, window['innerHeight'] - _0xcb3c88 - 0x8);
  const _0x554b00 = Math["min"](Math["max"](_0x2f4ab3, _0x4c77cc), _0x440cd3);
  _0x453669["style"]['left'] = _0x5174ca + 'px';
  _0x453669['style']["top"] = _0x554b00 + 'px';
}
function placeSubmenu(_0x5b5306, _0x3cef08, _0x5e73f3 = 0x0) {
  const _0x1d0618 = _0x3cef08['getBoundingClientRect']();
  positionAnchoredSubmenu({
    'submenu': _0x5b5306,
    'anchorRect': _0x1d0618,
    'preferredSide': "right",
    'position': "fixed",
    'gap': 0x4,
    'viewportMargin': 0x8,
    'viewportWidth': window['innerWidth'],
    'viewportHeight': window['innerHeight'],
    'viewportTop': Math["max"](0x0, Number(_0x5e73f3) || 0x0),
    'submenuWidth': _0x5b5306["offsetWidth"] || 0xd6
  });
}
function installMenuWheelContainment(_0x1975cc) {
  _0x1975cc["addEventListener"]('wheel', _0x139995 => {
    const _0x1a7f31 = Math["max"](0x0, Number(_0x1975cc["clientHeight"]) || 0x0);
    const _0x27ac31 = Math["max"](0x0, (Number(_0x1975cc["scrollHeight"]) || 0x0) - _0x1a7f31);
    if (_0x27ac31 <= 0x0) {
      return;
    }
    const _0xc02892 = _0x139995["deltaMode"] === 0x1 ? 0x10 : _0x139995['deltaMode'] === 0x2 ? Math['max'](0x1, _0x1a7f31) : 0x1;
    const _0x221721 = (Number(_0x139995["deltaY"]) || 0x0) * _0xc02892;
    if (!_0x221721) {
      return;
    }
    _0x1975cc["scrollTop"] = Math["min"](_0x27ac31, Math["max"](0x0, (Number(_0x1975cc["scrollTop"]) || 0x0) + _0x221721));
    _0x139995["preventDefault"]?.();
    _0x139995["stopPropagation"]?.();
  }, {
    'passive': ![]
  });
}
function installMenuContextBoundary(_0x3c5270) {
  _0x3c5270["addEventListener"]("contextmenu", _0x58efd4 => {
    _0x58efd4["preventDefault"]?.();
    _0x58efd4["stopPropagation"]?.();
  });
}
function createSeparator(_0x2e4541) {
  const _0x14ab4e = document["createElement"]("div");
  _0x14ab4e["className"] = "v2-menu-sep";
  _0x14ab4e["setAttribute"]("role", "separator");
  _0x14ab4e['addEventListener']('mouseenter', _0x2e4541);
  return _0x14ab4e;
}
function createMenuRow(_0x31bdaa, {
  onActivate: _0x43f164,
  onEnter: _0x5a421b,
  onKeyDown: _0x432fb4,
  ensureItemIcons = ![]
}) {
  const _0x2d6f8e = Array["isArray"](_0x31bdaa["subItems"]) && _0x31bdaa["subItems"]['length'] > 0x0;
  const _0x479c0d = String(_0x31bdaa["shortcutActionId"] || '')["trim"]();
  const _0x209c9d = _0x479c0d ? getShortcutLabel(_0x479c0d) : String(_0x31bdaa["kbd"] || '')['trim']();
  const _0xfb157e = !!_0x209c9d;
  const _0x493f4d = _0x31bdaa['disabled'] === !![];
  const _0x5a87b2 = typeof _0x31bdaa["checked"] === 'boolean';
  const _0x4fbc39 = String(_0x31bdaa['desc'] || _0x31bdaa['subtitle'] || '')["trim"]();
  const _0x26d0ae = document["createElement"]("div");
  _0x26d0ae['className'] = ["v2-menu-row", _0xfb157e || _0x2d6f8e ? "v2-menu-row-split" : '', _0x4fbc39 ? "has-desc" : '', _0x493f4d ? 'is-disabled' : '', _0x31bdaa["danger"] === !![] ? "is-danger" : '', _0x5a87b2 && _0x31bdaa["checked"] ? "is-checked" : '']["filter"](Boolean)["join"]('\x20');
  _0x26d0ae["dataset"]['menuItem'] = '1';
  if (_0x479c0d) {
    _0x26d0ae['dataset']["shortcutAction"] = _0x479c0d;
  }
  _0x26d0ae["tabIndex"] = -0x1;
  _0x26d0ae["setAttribute"]("role", _0x5a87b2 ? 'menuitemcheckbox' : "menuitem");
  _0x26d0ae["setAttribute"]("aria-disabled", _0x493f4d ? "true" : "false");
  if (_0x5a87b2) {
    _0x26d0ae["setAttribute"]("aria-checked", _0x31bdaa['checked'] ? 'true' : "false");
  }
  _0x2d6f8e && (_0x26d0ae['setAttribute']('aria-haspopup', "menu"), _0x26d0ae["setAttribute"]("aria-expanded", "false"));
  const _0xa39ab5 = document['createElement']("span");
  _0xa39ab5['className'] = [_0x2d6f8e ? "v2-menu-rowlabel" : '', _0x4fbc39 ? "v2-menu-lbl" : '']["filter"](Boolean)["join"]('\x20');
  _0xa39ab5['textContent'] = _0x31bdaa['label'] || '';
  if (_0x5a87b2) {
    const _0x336fd3 = document["createElement"]("span");
    _0x336fd3['className'] = 'v2-menu-checkmark';
    _0x336fd3["setAttribute"]("aria-hidden", "true");
    _0x336fd3['textContent'] = _0x31bdaa["checked"] ? '✓' : '';
    _0x26d0ae["appendChild"](_0x336fd3);
  }
  let _0x137908 = _0x31bdaa["iconEl"]?.["cloneNode"] ? _0x31bdaa["iconEl"]['cloneNode'](!![]) : createContextMenuIcon(_0x31bdaa["icon"]);
  !_0x137908 && ensureItemIcons && (_0x137908 = createContextMenuIcon("action"));
  if (_0x137908) {
    const _0x53ef89 = document["createElement"]('span');
    _0x53ef89["className"] = "v2-menu-leading-icon";
    _0x53ef89["setAttribute"]("aria-hidden", "true");
    _0x53ef89["appendChild"](_0x137908);
    _0x26d0ae["appendChild"](_0x53ef89);
  }
  if (_0x31bdaa["badge"]) {
    const _0x231b7e = document["createElement"]("span");
    _0x231b7e["textContent"] = _0x31bdaa["badge"];
    _0x231b7e['className'] = "v2-badge-beta";
    _0xa39ab5["appendChild"](_0x231b7e);
  }
  if (_0x4fbc39) {
    const _0x59ae30 = document['createElement']("span");
    _0x59ae30['className'] = 'v2-menu-txt-wrap';
    const _0x2efb00 = document["createElement"]("span");
    _0x2efb00["className"] = "v2-menu-sub";
    _0x2efb00['textContent'] = _0x4fbc39;
    _0x59ae30["appendChild"](_0xa39ab5);
    _0x59ae30["appendChild"](_0x2efb00);
    _0x26d0ae["appendChild"](_0x59ae30);
  } else {
    _0x26d0ae["appendChild"](_0xa39ab5);
  }
  if (_0x2d6f8e) {
    if (_0xfb157e) {
      const _0x377987 = document["createElement"]("span");
      _0x377987["className"] = "v2-menu-kbd";
      _0x377987["textContent"] = _0x209c9d;
      _0x26d0ae['appendChild'](_0x377987);
    }
    const _0x2c43e9 = document["createElement"]("span");
    _0x2c43e9["textContent"] = '▶';
    _0x2c43e9["className"] = "v2-menu-arrow v2-menu-arrow-ml8";
    _0x26d0ae["appendChild"](_0x2c43e9);
  } else {
    if (_0xfb157e) {
      const _0x244798 = document["createElement"]("span");
      _0x244798['className'] = "v2-menu-kbd";
      _0x244798["textContent"] = _0x209c9d;
      _0x26d0ae['appendChild'](_0x244798);
    }
  }
  _0x26d0ae["addEventListener"]("mouseenter", () => _0x5a421b(_0x26d0ae, _0x31bdaa));
  _0x26d0ae['addEventListener']('keydown', _0x5ed52f => _0x432fb4(_0x26d0ae, _0x31bdaa, _0x5ed52f));
  !_0x2d6f8e && _0x26d0ae["addEventListener"]("pointerdown", _0x20c319 => {
    _0x20c319["preventDefault"]?.();
    _0x20c319["stopPropagation"]();
    if (_0x20c319['button'] !== undefined && _0x20c319["button"] !== 0x0) {
      return;
    }
    if (_0x493f4d) {
      return;
    }
    _0x43f164(_0x31bdaa, _0x20c319);
  });
  return _0x26d0ae;
}
function markSidebarSubmenuOwner(_0x24f31c, _0x5cb36d) {
  const _0x244869 = String(_0x5cb36d || '')["trim"]();
  if (_0x244869) {
    _0x24f31c['dataset']["sidebarSubmenuOwner"] = _0x244869;
  }
}
export function showContextMenu(_0x314e65, _0x5e0972, _0x1f5d11, _0x275815 = {}) {
  const _0x547fc5 = _0x275815["restoreTarget"] || activeContextMenuSession?.["restoreTarget"] || document["activeElement"] || null;
  removeContextMenus({
    'includeNodePicker': _0x275815["includeNodePicker"] !== ![]
  });
  const _0x2e5167 = document['createElement']('div');
  const _0x1f2297 = _0x275815["ownerElement"];
  _0x2e5167['className'] = _0x275815["className"] || "v2-canvas-ctx-menu";
  _0x2e5167['setAttribute']("role", "menu");
  const _0x255e0b = createFocusNavigation();
  _0x255e0b["addRoot"](_0x2e5167);
  if (_0x275815["ariaLabel"]) {
    _0x2e5167["setAttribute"]("aria-label", _0x275815["ariaLabel"]);
  }
  markSidebarSubmenuOwner(_0x2e5167, _0x275815['sidebarSubmenuOwner']);
  const _0xaffa53 = [];
  const _0x429063 = Math['max'](0x0, Number(_0x275815["viewportTop"]) || 0x0);
  const _0x52d580 = _0x275815["ensureItemIcons"] === !![];
  const _0x513ef1 = 0xb4;
  let _0x1fc387 = null;
  let _0x51434e = ![];
  let _0x53d04a = null;
  let _0x12915d = ![];
  let _0x36daee = ![];
  const _0x2c9f6f = new WeakMap();
  const _0x1d994b = () => {
    if (_0x1fc387 === null) {
      return;
    }
    clearTimeout(_0x1fc387);
    _0x1fc387 = null;
  };
  const _0x3289b9 = (_0xbef96f = 0x0) => {
    _0x1d994b();
    for (let _0x3cd41a = _0xaffa53["length"] - 0x1; _0x3cd41a >= _0xbef96f; _0x3cd41a--) {
      _0x255e0b["removeRoot"](_0xaffa53[_0x3cd41a]);
      _0xaffa53[_0x3cd41a]?.["__contextMenuAnchor"]?.["setAttribute"]?.("aria-expanded", "false");
      _0xaffa53[_0x3cd41a]?.["remove"]();
    }
    _0xaffa53["splice"](_0xbef96f);
  };
  const _0x1c774d = (_0x105f7f = 0x0) => {
    _0x1d994b();
    _0x1fc387 = setTimeout(() => {
      _0x1fc387 = null;
      _0x3289b9(_0x105f7f);
    }, _0x513ef1);
  };
  const _0x36d738 = _0x55a0ce => !!_0x55a0ce && (_0x2e5167["contains"](_0x55a0ce) || _0xaffa53["some"](_0x1ca48e => _0x1ca48e?.["contains"](_0x55a0ce)));
  const _0x3ba2e8 = ({
    restoreFocus = !![]
  } = {}) => {
    if (_0x36daee) {
      return;
    }
    _0x36daee = !![];
    _0x1d994b();
    _0x3289b9(0x0);
    _0x255e0b["destroy"]();
    _0x2e5167["remove"]();
    _0x53d04a?.["disconnect"]?.();
    _0x53d04a = null;
    _0x51434e && (document["removeEventListener"]("pointerdown", _0x9c08a1, !![]), _0x51434e = ![]);
    _0x12915d && (document['removeEventListener']("keydown", _0x52628d, !![]), _0x12915d = ![]);
    if (activeContextMenuSession === _0x598915) {
      activeContextMenuSession = null;
    }
    restoreFocus && _0x547fc5?.["focus"] && _0x547fc5?.['isConnected'] !== ![] && _0x547fc5["focus"]();
    _0x275815['onClose']?.();
  };
  const _0xd7b00a = _0x43754b => Array["from"](_0x43754b?.["children"] || [])["filter"](_0x2d639e => _0x2d639e?.['dataset']?.["menuItem"] === '1' && _0x2d639e['getAttribute']?.('aria-disabled') !== "true");
  const _0x244623 = _0x225946 => _0xd7b00a(_0x225946)[0x0]?.["focus"]?.();
  const _0x5504ec = () => [_0x2e5167, ..._0xaffa53]["flatMap"](_0x512642 => _0xd7b00a(_0x512642))['filter'](_0xc4d879 => String(_0xc4d879?.["dataset"]?.["shortcutAction"] || '')["trim"]());
  const _0x52628d = _0x5e6e74 => {
    if (_0x36daee || _0x5e6e74?.['repeat'] === !![]) {
      return;
    }
    const _0x37c588 = _0x5504ec();
    const _0x2f8bc0 = resolveShortcutActionForEvent(_0x5e6e74, _0x37c588["map"](_0x5570b7 => _0x5570b7["dataset"]["shortcutAction"]));
    if (!_0x2f8bc0) {
      return;
    }
    const _0x25c1ac = _0x37c588['find'](_0x52ae99 => _0x52ae99['dataset']["shortcutAction"] === _0x2f8bc0);
    const _0x1b6447 = _0x25c1ac ? _0x2c9f6f["get"](_0x25c1ac) : null;
    if (typeof _0x1b6447 !== "function") {
      return;
    }
    _0x5e6e74["preventDefault"]?.();
    _0x5e6e74["stopPropagation"]?.();
    _0x5e6e74["stopImmediatePropagation"]?.();
    _0x1b6447(_0x5e6e74);
  };
  const _0x2a1c83 = (_0x34a922, _0x1fb457, _0x51bc56) => {
    const _0x5d0f4c = _0xd7b00a(_0x34a922);
    if (_0x5d0f4c["length"] === 0x0) {
      return;
    }
    const _0x43cb72 = Math["max"](0x0, _0x5d0f4c['indexOf'](_0x1fb457));
    const _0x1b5e4f = (_0x43cb72 + _0x51bc56 + _0x5d0f4c['length']) % _0x5d0f4c["length"];
    _0x5d0f4c[_0x1b5e4f]?.['focus']?.();
  };
  const _0x494c86 = (_0x4ab4ba, _0x1824f6) => {
    if (_0x36daee || _0x4ab4ba?.["disabled"] === !![]) {
      return;
    }
    _0x3ba2e8();
    _0x4ab4ba?.['action']?.(_0x1824f6);
  };
  const _0x2e0d7b = ({
    panel: _0xda2ec2,
    parentRow = null,
    level = null,
    row: _0xb85a47,
    item: _0x160b8e,
    event: _0x376727,
    openSubmenu: _0x292f17
  }) => {
    const _0x3f8d70 = String(_0x376727['key'] || '');
    if (_0x3f8d70 === 'ArrowDown' || _0x3f8d70 === "ArrowUp") {
      _0x376727["preventDefault"]?.();
      _0x2a1c83(_0xda2ec2, _0xb85a47, _0x3f8d70 === "ArrowDown" ? 0x1 : -0x1);
      return;
    }
    if (_0x3f8d70 === 'Home' || _0x3f8d70 === "End") {
      _0x376727["preventDefault"]?.();
      const _0x3678ab = _0xd7b00a(_0xda2ec2);
      _0x3678ab[_0x3f8d70 === "Home" ? 0x0 : _0x3678ab['length'] - 0x1]?.["focus"]?.();
      return;
    }
    if (_0x3f8d70 === "Escape") {
      _0x376727["preventDefault"]?.();
      _0x376727["stopPropagation"]?.();
      _0x3ba2e8();
      return;
    }
    if (_0x3f8d70 === 'ArrowLeft' && parentRow && level !== null) {
      _0x376727["preventDefault"]?.();
      _0x3289b9(level);
      parentRow["focus"]?.();
      return;
    }
    const _0x56c74a = Array["isArray"](_0x160b8e?.["subItems"]) && _0x160b8e["subItems"]["length"] > 0x0;
    if (_0x3f8d70 === "ArrowRight" && _0x56c74a && _0x160b8e["disabled"] !== !![]) {
      _0x376727["preventDefault"]?.();
      const _0x133b65 = _0x292f17?.();
      _0x244623(_0x133b65);
      return;
    }
    if ((_0x3f8d70 === "Enter" || _0x3f8d70 === '\x20') && _0x160b8e["disabled"] !== !![]) {
      _0x376727["preventDefault"]?.();
      _0x376727["stopPropagation"]?.();
      if (_0x56c74a) {
        const _0x5385c9 = _0x292f17?.();
        _0x244623(_0x5385c9);
      } else {
        _0x494c86(_0x160b8e, _0x376727);
      }
    }
  };
  const _0x1c4493 = (_0x17b9b0, _0x3d5e36, _0x52a702) => {
    _0x3289b9(_0x52a702);
    const _0x4fa07b = document["createElement"]("div");
    _0x4fa07b["className"] = "v2-canvas-ctx-menu v2-submenu";
    _0x4fa07b["setAttribute"]("role", "menu");
    _0x255e0b["addRoot"](_0x4fa07b);
    installMenuContextBoundary(_0x4fa07b);
    installMenuWheelContainment(_0x4fa07b);
    _0x4fa07b["__contextMenuAnchor"] = _0x3d5e36;
    _0x3d5e36?.["setAttribute"]?.("aria-expanded", 'true');
    markSidebarSubmenuOwner(_0x4fa07b, _0x275815["sidebarSubmenuOwner"]);
    _0x4fa07b["addEventListener"]("mouseenter", _0x1d994b);
    _0x17b9b0["forEach"](_0x382201 => {
      if (_0x382201 === 'sep' || _0x382201?.["type"] === "separator") {
        _0x4fa07b['appendChild'](createSeparator(() => _0x3289b9(_0x52a702 + 0x1)));
        return;
      }
      const _0xcfafa = () => _0x1c4493(_0x382201["subItems"], _0x2e8167, _0x52a702 + 0x1);
      const _0x2e8167 = createMenuRow(_0x382201, {
        'ensureItemIcons': _0x52d580,
        'onEnter': (_0x558293, _0x2c61cc) => {
          _0x2c61cc["disabled"] !== !![] && Array["isArray"](_0x2c61cc["subItems"]) && _0x2c61cc["subItems"]['length'] > 0x0 ? _0x1c4493(_0x2c61cc['subItems'], _0x558293, _0x52a702 + 0x1) : _0x3289b9(_0x52a702 + 0x1);
        },
        'onActivate': _0x494c86,
        'onKeyDown': (_0x66bd37, _0x192d6e, _0x1a4920) => _0x2e0d7b({
          'panel': _0x4fa07b,
          'parentRow': _0x3d5e36,
          'level': _0x52a702,
          'row': _0x66bd37,
          'item': _0x192d6e,
          'event': _0x1a4920,
          'openSubmenu': () => _0x1c4493(_0x192d6e["subItems"], _0x66bd37, _0x52a702 + 0x1)
        })
      });
      _0x2e8167["dataset"]["shortcutAction"] && _0x382201["disabled"] !== !![] && _0x2c9f6f["set"](_0x2e8167, _0x28b523 => {
        if (Array['isArray'](_0x382201['subItems']) && _0x382201["subItems"]["length"] > 0x0) {
          const _0x3b68da = _0xcfafa();
          _0x244623(_0x3b68da);
        } else {
          _0x494c86(_0x382201, _0x28b523);
        }
      });
      _0x4fa07b["appendChild"](_0x2e8167);
    });
    document["body"]["appendChild"](_0x4fa07b);
    _0xaffa53[_0x52a702] = _0x4fa07b;
    placeSubmenu(_0x4fa07b, _0x3d5e36, _0x429063);
    return _0x4fa07b;
  };
  _0x1f5d11["forEach"](_0x5c2685 => {
    if (_0x5c2685 === "sep" || _0x5c2685?.["type"] === "separator") {
      _0x2e5167["appendChild"](createSeparator(() => _0x3289b9(0x0)));
      return;
    }
    let _0x294cde = null;
    const _0x41b4a1 = () => _0x1c4493(_0x5c2685['subItems'], _0x294cde, 0x0);
    _0x294cde = createMenuRow(_0x5c2685, {
      'ensureItemIcons': _0x52d580,
      'onEnter': (_0x540a4e, _0x5e48fb) => {
        _0x5e48fb['disabled'] !== !![] && Array["isArray"](_0x5e48fb["subItems"]) && _0x5e48fb["subItems"]["length"] > 0x0 ? _0x1c4493(_0x5e48fb["subItems"], _0x540a4e, 0x0) : _0x3289b9(0x0);
      },
      'onActivate': _0x494c86,
      'onKeyDown': (_0x2d9eb1, _0x4b98bc, _0x32f2b4) => _0x2e0d7b({
        'panel': _0x2e5167,
        'row': _0x2d9eb1,
        'item': _0x4b98bc,
        'event': _0x32f2b4,
        'openSubmenu': () => _0x1c4493(_0x4b98bc["subItems"], _0x2d9eb1, 0x0)
      })
    });
    _0x294cde["dataset"]['shortcutAction'] && _0x5c2685["disabled"] !== !![] && _0x2c9f6f["set"](_0x294cde, _0x1b50b1 => {
      if (Array["isArray"](_0x5c2685['subItems']) && _0x5c2685["subItems"]["length"] > 0x0) {
        const _0x56cffb = _0x41b4a1();
        _0x244623(_0x56cffb);
      } else {
        _0x494c86(_0x5c2685, _0x1b50b1);
      }
    });
    _0x2e5167["appendChild"](_0x294cde);
  });
  _0x2e5167['addEventListener']("mouseenter", _0x1d994b);
  installMenuContextBoundary(_0x2e5167);
  installMenuWheelContainment(_0x2e5167);
  _0x2e5167["addEventListener"]("mouseleave", _0x70ed78 => {
    !_0x36d738(_0x70ed78["relatedTarget"]) && _0x1c774d(0x0);
  });
  placeMenu(_0x2e5167, _0x314e65, _0x5e0972, _0x429063, _0x275815["preferredPlacement"]);
  const _0x9c08a1 = _0x223805 => {
    const _0x2f94b7 = _0x2e5167["contains"](_0x223805["target"]) || _0xaffa53["some"](_0xfeded9 => _0xfeded9?.['contains'](_0x223805["target"]));
    const _0xd82ed3 = _0x275815['dismissOnOwnerPointerDown'] === ![] && (_0x223805["target"] === _0x1f2297 || _0x1f2297?.['contains']?.(_0x223805['target']));
    !_0x2f94b7 && !_0xd82ed3 && _0x3ba2e8();
  };
  const _0x598915 = {
    'menu': _0x2e5167,
    'restoreTarget': _0x547fc5,
    'close': _0x3ba2e8
  };
  activeContextMenuSession = _0x598915;
  const _0x18f1b7 = _0x275815["ownerRoot"];
  const _0x49b2a3 = _0x275815["mutationObserver"] || _0x18f1b7?.["ownerDocument"]?.["defaultView"]?.['MutationObserver'] || globalThis["MutationObserver"];
  _0x18f1b7 && _0x1f2297 && typeof _0x49b2a3 === 'function' && (_0x53d04a = new _0x49b2a3(() => {
    (_0x1f2297["isConnected"] === ![] || _0x18f1b7["contains"]?.(_0x1f2297) === ![]) && _0x3ba2e8({
      'restoreFocus': ![]
    });
  }), _0x53d04a['observe'](_0x18f1b7, {
    'childList': !![],
    'subtree': !![]
  }));
  requestAnimationFrame(() => {
    if (_0x36daee) {
      return;
    }
    document["addEventListener"]("pointerdown", _0x9c08a1, !![]);
    _0x51434e = !![];
    document["addEventListener"]('keydown', _0x52628d, !![]);
    _0x12915d = !![];
    if (_0x275815['autoFocus'] !== ![]) {
      _0x244623(_0x2e5167);
    }
  });
  return {
    'menu': _0x2e5167,
    'close': _0x4dc5d5 => _0x3ba2e8(_0x4dc5d5)
  };
}