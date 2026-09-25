import { translateManifestText } from '../../i18n/manifestText.js';
const RIGHT_CHEVRON_HTML = "<svg class=\"node-menu-caret\" width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" aria-hidden=\"true\"><polyline points=\"9 18 15 12 9 6\"></polyline></svg>";
const NODE_MENU_ICON_IMAGE_ATTRS = '\x20loading=\x22eager\x22\x20decoding=\x22async\x22\x20fetchpriority=\x22high\x22\x20draggable=\x22false\x22';
const NODE_MENU_PRICE_SUFFIX_PATTERN = /(?:^|\s)((?:[¥￥]\s*)?\d+(?:\.\d+)?\s*元\s*[\/／]\s*[^\s\/／]{1,16})\s*$/u;
export function escapeNodeMenuHtml(_0x14e21b) {
  return String(_0x14e21b ?? '')["replace"](/&/g, "&amp;")["replace"](/</g, "&lt;")["replace"](/>/g, "&gt;")['replace'](/"/g, "&quot;")["replace"](/'/g, '&#39;');
}
function splitNodeMenuPrice(_0x1d2a25, _0x52c9ff = '') {
  const _0x116ac9 = String(_0x1d2a25 || '')["trim"]();
  const _0x1f9884 = String(_0x52c9ff || '')["trim"]();
  if (_0x1f9884 && _0x116ac9["endsWith"](_0x1f9884)) {
    return {
      'label': _0x116ac9["slice"](0x0, -_0x1f9884["length"])['trimEnd'](),
      'priceText': _0x1f9884
    };
  }
  const _0x3b55bb = _0x116ac9["match"](NODE_MENU_PRICE_SUFFIX_PATTERN);
  if (_0x3b55bb) {
    return {
      'label': _0x116ac9["slice"](0x0, _0x3b55bb["index"])["trimEnd"](),
      'priceText': _0x1f9884 || _0x3b55bb[0x1]["trim"]()
    };
  }
  return {
    'label': _0x116ac9,
    'priceText': _0x1f9884
  };
}
function renderBadge(_0x59ebd5 = {}) {
  if (_0x59ebd5["badgeHtml"]) {
    return _0x59ebd5["badgeHtml"];
  }
  if (_0x59ebd5["vip"]) {
    return '<span\x20class=\x22floating-menu-badge\x20floating-menu-badge-warning\x22>VIP</span>';
  }
  if (_0x59ebd5["disabled"]) {
    return "<span class=\"floating-menu-badge floating-menu-badge-danger\">" + escapeNodeMenuHtml(translateManifestText("不可用")) + "</span>";
  }
  return '';
}
function renderIcon(_0x34ecb0 = {}, _0x1ee9cd = 0x14) {
  if (_0x34ecb0['iconHtml']) {
    return _0x34ecb0['iconHtml'];
  }
  if (!_0x34ecb0["icon"]) {
    return '';
  }
  const _0x30a7f8 = Number(_0x1ee9cd) || 0x14;
  const _0x1dc9f3 = _0x30a7f8 <= 0xc ? "node-menu-icon-small" : "node-menu-icon";
  return "<img src=\"" + escapeNodeMenuHtml(_0x34ecb0["icon"]) + '\x22\x20class=\x22' + _0x1dc9f3 + "\" alt=\"" + escapeNodeMenuHtml(_0x34ecb0['iconAlt'] || _0x34ecb0["label"] || '') + '\x22' + NODE_MENU_ICON_IMAGE_ATTRS + '>';
}
function attrsFromObject(_0x3f5a4d = {}) {
  return Object['entries'](_0x3f5a4d)['filter'](([, _0x1b144e]) => _0x1b144e !== undefined && _0x1b144e !== null && _0x1b144e !== ![])["map"](([_0xd42ec9, _0x446a03]) => _0x446a03 === !![] ? '\x20' + escapeNodeMenuHtml(_0xd42ec9) : '\x20' + escapeNodeMenuHtml(_0xd42ec9) + '=\x22' + escapeNodeMenuHtml(_0x446a03) + '\x22')["join"]('');
}
export function renderNodeMenuItem(_0x58b2df = {}, _0x5eeeb3 = {}) {
  const _0x5e870 = String(_0x5eeeb3['activeModel'] || '');
  const _0x2d6186 = String(_0x58b2df["modelId"] ?? _0x58b2df["value"] ?? '');
  const _0x29e5e1 = String(_0x58b2df['provider'] ?? '');
  const _0x3ef592 = _0x58b2df['active'] === !![] || !!_0x2d6186 && _0x5e870 === _0x2d6186 || Array["isArray"](_0x58b2df["aliases"]) && _0x58b2df["aliases"]['includes'](_0x5e870);
  const _0x3d93eb = ['floating-menu-item', "node-menu-item", _0x58b2df["className"] || '', _0x3ef592 ? 'active' : '', _0x58b2df["disabled"] ? "disabled" : '']["filter"](Boolean)["join"]('\x20');
  const _0x1c3026 = {
    'data-value': _0x2d6186 || undefined,
    'data-provider': _0x29e5e1 || undefined,
    'data-credential-model': _0x58b2df["credentialModelId"] || undefined,
    'data-disabled': _0x58b2df['disabledValue'] || (_0x58b2df["disabled"] ? "true" : undefined),
    ..._0x58b2df['attrs']
  };
  const _0x28ecdd = splitNodeMenuPrice(translateManifestText(_0x58b2df["label"] ?? _0x2d6186), translateManifestText(_0x58b2df["priceText"] || ''));
  const _0x454df4 = escapeNodeMenuHtml(_0x28ecdd["label"]);
  const _0x3c6734 = _0x28ecdd['priceText'] ? '' + _0x454df4 + (_0x454df4 ? '\x20' : '') + "<span class=\"node-menu-price\">" + escapeNodeMenuHtml(_0x28ecdd["priceText"]) + "</span>" : _0x454df4;
  const _0x27de81 = translateManifestText(_0x58b2df['subtitle'] || _0x58b2df["description"] || '');
  return "<div class=\"" + _0x3d93eb + '\x22' + attrsFromObject(_0x1c3026) + ">\n    " + renderIcon(_0x58b2df) + "\n    <div class=\"fmi-content\">\n      <div class=\"fmi-title\">" + _0x3c6734 + "</div>\n      " + (_0x27de81 ? "<div class=\"fmi-sub\">" + escapeNodeMenuHtml(_0x27de81) + "</div>" : '') + "\n    </div>\n    " + renderBadge(_0x58b2df) + "\n  </div>";
}
export function renderNodeMenuGroup(_0x3fdec9 = {}, _0x173fa2 = {}) {
  const _0x23837d = String(_0x3fdec9['id'] || '')["trim"]();
  const _0x4caf09 = _0x3fdec9["submenuClass"] || _0x23837d + "-submenu";
  const _0x43c672 = _0x3fdec9['headerClass'] || _0x23837d + "-group-header";
  const _0x54cf01 = _0x3fdec9["toggleAttr"] || "data-" + _0x23837d + "-toggle";
  const _0x47320c = _0x3fdec9["developerOnly"] === !![] ? "node-menu-developer-only" : '';
  const _0x30527a = [_0x43c672, 'floating-menu-item', "node-menu-group-header", _0x3fdec9["className"] || '', _0x47320c]["filter"](Boolean)["join"]('\x20');
  const _0x2c71ba = ['node-model-submenu', "node-menu-submenu", _0x4caf09, _0x47320c]["filter"](Boolean)["join"]('\x20');
  const _0x4a8172 = {
    [_0x54cf01]: !![],
    'data-node-menu-submenu': '.' + _0x4caf09,
    ..._0x3fdec9['attrs']
  };
  const _0x250923 = _0x3fdec9["itemsHtml"] || (Array["isArray"](_0x3fdec9["items"]) ? _0x3fdec9["items"]["map"](_0x54edbd => renderNodeMenuItem(_0x54edbd, _0x173fa2))["join"]('') : '');
  return "\n    <div class=\"" + _0x30527a + '\x22' + attrsFromObject(_0x4a8172) + ">\n      " + renderIcon(_0x3fdec9) + "\n      <div class=\"fmi-content\">\n        <div class=\"fmi-title\">" + escapeNodeMenuHtml(translateManifestText(_0x3fdec9["label"] || _0x23837d)) + '</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x3fdec9["subtitle"] ? "<div class=\"fmi-sub\">" + escapeNodeMenuHtml(translateManifestText(_0x3fdec9["subtitle"])) + '</div>' : '') + "\n      </div>\n      " + renderBadge(_0x3fdec9) + "\n      " + (_0x3fdec9["chevron"] === ![] ? '' : RIGHT_CHEVRON_HTML) + "\n    </div>\n    <div class=\"" + escapeNodeMenuHtml(_0x2c71ba) + "\">\n      " + _0x250923 + "\n    </div>";
}
export function renderNodeModelMenu(_0x2c4606 = {}) {
  const _0x263498 = String(_0x2c4606["activeModel"] || '');
  const _0x148004 = Array["isArray"](_0x2c4606['groups']) ? _0x2c4606["groups"] : [];
  const _0x485e53 = Array['isArray'](_0x2c4606["items"]) ? _0x2c4606["items"] : [];
  const _0x2744bd = [..._0x485e53["map"](_0x41a003 => renderNodeMenuItem(_0x41a003, {
    'activeModel': _0x263498
  })), ..._0x148004["map"](_0x4f70aa => renderNodeMenuGroup(_0x4f70aa, {
    'activeModel': _0x263498
  }))]["join"]('');
  const _0x33709b = ['floating-menu', "img-model-menu", "node-model-menu", _0x2c4606["className"] || '']["filter"](Boolean)["join"]('\x20');
  return '<div\x20class=\x22' + _0x33709b + "\" data-node-menu-kind=\"" + escapeNodeMenuHtml(_0x2c4606["kind"] || '') + '\x22>' + _0x2744bd + (_0x2c4606["footerHtml"] || '') + "</div>";
}
export function renderNodeModelTrigger({
  iconHtml = '',
  label = '',
  className = '',
  caretHtml = ''
} = {}) {
  const _0x146fdb = ["img-pill-btn", 'img-model-btn-trigger', "node-model-trigger", className]["filter"](Boolean)["join"]('\x20');
  return '<button\x20type=\x22button\x22\x20class=\x22' + _0x146fdb + "\">\n    " + iconHtml + '\x0a\x20\x20\x20\x20<span\x20class=\x22img-model-label\x22>' + escapeNodeMenuHtml(label) + '</span>\x0a\x20\x20\x20\x20' + caretHtml + '\x0a\x20\x20</button>';
}