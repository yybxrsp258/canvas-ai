function escapeHtmlAttr(_0x1a8e88) {
  return String(_0x1a8e88 ?? '')["replace"](/&/g, "&amp;")["replace"](/"/g, "&quot;")["replace"](/</g, "&lt;")["replace"](/>/g, "&gt;");
}
function escapeHtmlText(_0x5c9a53) {
  return String(_0x5c9a53 ?? '')['replace'](/&/g, "&amp;")["replace"](/</g, "&lt;")["replace"](/>/g, "&gt;");
}
function normalizeOptions(_0x1fb544) {
  return (Array["isArray"](_0x1fb544) ? _0x1fb544 : [])["map"](_0x230cad => {
    if (_0x230cad && typeof _0x230cad === 'object' && !Array["isArray"](_0x230cad)) {
      const _0x317eb5 = String(_0x230cad["value"] ?? '');
      return {
        'value': _0x317eb5,
        'label': String(_0x230cad['label'] ?? _0x317eb5),
        'selectedLabel': String(_0x230cad["selectedLabel"] ?? _0x230cad["displayLabel"] ?? _0x230cad["label"] ?? _0x317eb5),
        'tooltip': String(_0x230cad["tooltip"] || '')['trim'](),
        'disabled': _0x230cad["disabled"] === !![],
        'attrs': _0x230cad["attrs"] && typeof _0x230cad["attrs"] === "object" ? _0x230cad["attrs"] : {}
      };
    }
    const _0x2c87ad = String(_0x230cad ?? '');
    return {
      'value': _0x2c87ad,
      'label': _0x2c87ad,
      'selectedLabel': _0x2c87ad,
      'tooltip': '',
      'disabled': ![],
      'attrs': {}
    };
  });
}
function getSelectedOption(_0x31342e, _0x31890b) {
  const _0xc2fb07 = String(_0x31890b ?? '');
  return _0x31342e["find"](_0xc8ad0 => _0xc8ad0['value'] === _0xc2fb07) || _0x31342e[0x0] || null;
}
function renderExtraAttrs(_0x41a346 = {}) {
  return Object["entries"](_0x41a346)["map"](([_0xe3fb61, _0xf224fc]) => {
    const _0x186116 = String(_0xe3fb61 || '')["trim"]();
    if (!_0x186116) {
      return '';
    }
    if (_0xf224fc === ![] || _0xf224fc === null || _0xf224fc === undefined) {
      return '';
    }
    if (_0xf224fc === !![]) {
      return '\x20' + escapeHtmlAttr(_0x186116);
    }
    return '\x20' + escapeHtmlAttr(_0x186116) + '=\x22' + escapeHtmlAttr(_0xf224fc) + '\x22';
  })['join']('');
}
function renderCaret() {
  return '<svg\x20class=\x22image-toolbar-up-menu-caret\x22\x20width=\x2210\x22\x20height=\x2210\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20aria-hidden=\x22true\x22><polyline\x20points=\x226\x209\x2012\x2015\x2018\x209\x22></polyline></svg>';
}
export function renderToolbarUpMenu({
  fieldId = '',
  value = '',
  options = [],
  wrapClass = "v2-expand-wrap",
  buttonClass = "v2-expand-toolbar-btn",
  triggerClass = '',
  labelClass = '',
  menuClass = "v2-expand-menu",
  itemClass = 'v2-expand-menu-item',
  openClass = 'open',
  title = '',
  menuTitle = '',
  iconHtml = '',
  selectedLabel = '',
  disabled = ![],
  itemsOnly = ![],
  itemValueAttrs = []
} = {}) {
  const _0x5e1d5a = String(fieldId || '')["trim"]();
  const _0x4f2895 = normalizeOptions(options);
  const _0x3ad1ff = getSelectedOption(_0x4f2895, value);
  const _0x55b949 = String(selectedLabel || _0x3ad1ff?.["selectedLabel"] || _0x3ad1ff?.["label"] || value || '');
  const _0x54fa42 = Array["isArray"](itemValueAttrs) ? itemValueAttrs : [];
  const _0x3a0921 = _0x4f2895['map'](_0xd36e74 => {
    const _0x302aef = _0xd36e74["value"] === String(value ?? '');
    const _0x413535 = disabled || _0xd36e74["disabled"];
    const _0x30c7e1 = _0xd36e74["tooltip"] ? " title=\"" + escapeHtmlAttr(_0xd36e74['tooltip']) + "\" data-tooltip=\"" + escapeHtmlAttr(_0xd36e74["tooltip"]) + '\x22' : '';
    const _0x71c669 = _0x54fa42["map"](_0x3bed38 => {
      const _0x203d2a = String(_0x3bed38 || '')["trim"]();
      return _0x203d2a ? '\x20' + escapeHtmlAttr(_0x203d2a) + '=\x22' + escapeHtmlAttr(_0xd36e74["value"]) + '\x22' : '';
    })['join']('');
    return "<div class=\"floating-menu-item image-toolbar-up-menu-item " + escapeHtmlAttr(itemClass) + '\x20' + (_0x302aef ? "active" : '') + '\x20' + (_0x413535 ? "disabled" : '') + "\" data-toolbar-up-menu-item data-toolbar-up-menu-field=\"" + escapeHtmlAttr(_0x5e1d5a) + '\x22\x20data-toolbar-up-menu-value=\x22' + escapeHtmlAttr(_0xd36e74["value"]) + "\" data-toolbar-up-menu-label=\"" + escapeHtmlAttr(_0xd36e74["selectedLabel"]) + "\" data-disabled=\"" + (_0x413535 ? "true" : "false") + '\x22' + _0x71c669 + _0x30c7e1 + renderExtraAttrs(_0xd36e74["attrs"]) + "><span class=\"floating-menu-label\">" + escapeHtmlText(_0xd36e74["label"]) + "</span></div>";
  })["join"]('');
  const _0x17c691 = String(menuTitle || '')["trim"]();
  const _0x216036 = _0x17c691 ? "<div class=\"floating-menu-title ui-schema-floating-menu-title image-toolbar-up-menu-title\">" + escapeHtmlText(_0x17c691) + "</div>" : '';
  if (itemsOnly) {
    return '' + _0x216036 + _0x3a0921;
  }
  const _0x375ddb = disabled ? " disabled aria-disabled=\"true\"" : '';
  const _0x495390 = title ? " title=\"" + escapeHtmlAttr(title) + '\x22' : '';
  return "\n    <div class=\"" + escapeHtmlAttr(wrapClass) + " image-toolbar-up-menu\" data-toolbar-up-menu=\"" + escapeHtmlAttr(_0x5e1d5a) + "\">\n      <button type=\"button\" class=\"" + escapeHtmlAttr(buttonClass) + '\x20' + escapeHtmlAttr(triggerClass) + '\x20image-toolbar-up-menu-toggle\x20' + (disabled ? "is-disabled" : '') + "\" data-toolbar-up-menu-toggle=\"" + escapeHtmlAttr(_0x5e1d5a) + '\x22' + _0x495390 + _0x375ddb + ">\n        " + iconHtml + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22' + escapeHtmlAttr(labelClass) + " image-toolbar-up-menu-label\" data-toolbar-up-menu-label>" + escapeHtmlText(_0x55b949) + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + renderCaret() + '\x0a\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22floating-menu\x20image-toolbar-up-menu-menu\x20' + escapeHtmlAttr(menuClass) + "\" data-toolbar-up-menu-menu=\"" + escapeHtmlAttr(_0x5e1d5a) + "\" data-toolbar-up-menu-open-class=\"" + escapeHtmlAttr(openClass) + "\">\n        " + _0x216036 + "\n        " + _0x3a0921 + "\n      </div>\n    </div>";
}
function getMenuOpenClass(_0x4eea56) {
  return String(_0x4eea56?.["dataset"]?.["toolbarUpMenuOpenClass"] || "open")["trim"]() || "open";
}
function closeMenu(_0x85bb04) {
  if (!_0x85bb04?.["classList"]) {
    return;
  }
  _0x85bb04["classList"]["remove"](getMenuOpenClass(_0x85bb04));
  _0x85bb04["classList"]['remove']("open");
  _0x85bb04['classList']['remove']("show");
}
function closeSiblingMenus(_0x4f9174, _0xe3e3a1 = null) {
  _0x4f9174?.["querySelectorAll"]?.("[data-toolbar-up-menu-menu]")?.["forEach"](_0x8071c6 => {
    if (_0x8071c6 !== _0xe3e3a1) {
      closeMenu(_0x8071c6);
    }
  });
}
function syncMenuSelection({
  menu: _0x184f7b,
  item: _0x902bcc,
  value: _0x668a7e
}) {
  if (!_0x184f7b || !_0x902bcc) {
    return;
  }
  _0x184f7b["querySelectorAll"]?.("[data-toolbar-up-menu-item]")?.["forEach"](_0x4f4e4b => {
    _0x4f4e4b['classList']?.['toggle']?.("active", String(_0x4f4e4b['dataset']?.['toolbarUpMenuValue'] ?? '') === String(_0x668a7e ?? ''));
  });
  const _0x5c32c0 = _0x902bcc["closest"]?.('[data-toolbar-up-menu]');
  const _0x250afd = _0x5c32c0?.["querySelector"]?.('[data-toolbar-up-menu-label]');
  _0x250afd && (_0x250afd["textContent"] = String(_0x902bcc['dataset']?.["toolbarUpMenuLabel"] || _0x902bcc["textContent"] || _0x668a7e || '')['trim']());
}
export function bindToolbarUpMenus(_0x1a1d6b, {
  onSelect: _0x204745,
  onBeforeOpen: _0x16358f
} = {}) {
  if (!_0x1a1d6b?.["addEventListener"]) {
    return () => {};
  }
  const _0x3c124e = _0xc9bf80 => {
    const _0x45200a = _0xc9bf80["target"]?.["closest"]?.("[data-toolbar-up-menu-toggle]");
    if (_0x45200a && _0x1a1d6b["contains"]?.(_0x45200a)) {
      if (_0x45200a["disabled"] === !![]) {
        return;
      }
      _0xc9bf80["stopPropagation"]?.();
      const _0x458dd3 = _0x45200a["closest"]?.("[data-toolbar-up-menu]");
      const _0x5a8ac1 = _0x458dd3?.["querySelector"]?.("[data-toolbar-up-menu-menu]");
      if (!_0x5a8ac1) {
        return;
      }
      const _0x46cf9f = getMenuOpenClass(_0x5a8ac1);
      const _0x2c2755 = !_0x5a8ac1["classList"]?.["contains"]?.(_0x46cf9f);
      _0x16358f?.({
        'fieldId': _0x45200a["dataset"]?.["toolbarUpMenuToggle"] || '',
        'trigger': _0x45200a,
        'menu': _0x5a8ac1,
        'shouldOpen': _0x2c2755
      });
      closeSiblingMenus(_0x1a1d6b, _0x5a8ac1);
      _0x5a8ac1["classList"]?.['toggle']?.(_0x46cf9f, _0x2c2755);
      return;
    }
    const _0xc329de = _0xc9bf80['target']?.["closest"]?.("[data-toolbar-up-menu-item]");
    if (!_0xc329de || !_0x1a1d6b["contains"]?.(_0xc329de)) {
      return;
    }
    if (_0xc329de['dataset']?.["disabled"] === "true") {
      return;
    }
    _0xc9bf80['stopPropagation']?.();
    const _0x19bcb2 = _0xc329de["closest"]?.("[data-toolbar-up-menu-menu]");
    const _0xcc88c7 = _0xc329de['dataset']?.["toolbarUpMenuValue"] || '';
    syncMenuSelection({
      'menu': _0x19bcb2,
      'item': _0xc329de,
      'value': _0xcc88c7
    });
    closeMenu(_0x19bcb2);
    _0x204745?.({
      'fieldId': _0xc329de["dataset"]?.["toolbarUpMenuField"] || '',
      'value': _0xcc88c7,
      'item': _0xc329de,
      'menu': _0x19bcb2,
      'event': _0xc9bf80
    });
  };
  _0x1a1d6b["addEventListener"]("click", _0x3c124e);
  return () => _0x1a1d6b["removeEventListener"]("click", _0x3c124e);
}