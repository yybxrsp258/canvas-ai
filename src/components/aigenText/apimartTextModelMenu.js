import { getModelsByKind } from '../../manifests/index.js';
import { isModelProviderPubliclyListed } from '../../manifests/modelCatalogVisibility.js';
import { getTextProviderMenuGroups } from '../../manifests/text/textProviderMenuGroups.js';
import { renderNodeMenuGroup } from '../shared/nodeModelMenu.js';
import { buildModelProviderProfileBadgesHtml } from '../shared/modelProviderProfileControl.js';
const TEXT_MODEL_NAME_COLLATOR = new Intl["Collator"]("zh-CN", {
  'numeric': !![],
  'sensitivity': "base"
});
function escapeHtml(_0x5c8ec4) {
  return String(_0x5c8ec4 ?? '')["replace"](/&/g, "&amp;")['replace'](/</g, "&lt;")["replace"](/>/g, "&gt;")['replace'](/"/g, '&quot;')['replace'](/'/g, '&#39;');
}
function getTextMenuMeta(_0x5331ff) {
  const _0x37860f = _0x5331ff?.["extensions"]?.["textMenu"];
  return _0x37860f && typeof _0x37860f === "object" ? _0x37860f : null;
}
function getTextMenuBadge(_0xc9231f) {
  const _0x315147 = String(_0xc9231f?.["badge"] || '')["trim"]();
  return _0x315147 || '';
}
function getTextModelMenuTitle(_0x58fed2) {
  const _0x2e4cc0 = getTextMenuMeta(_0x58fed2);
  return String(_0x2e4cc0?.["title"] || _0x58fed2?.['displayName'] || _0x58fed2?.['modelId'] || '')["trim"]();
}
function compareTextModelMenuItemsByName(_0x51a585, _0x4aab6e) {
  const _0x51c8dd = TEXT_MODEL_NAME_COLLATOR["compare"](getTextModelMenuTitle(_0x51a585), getTextModelMenuTitle(_0x4aab6e));
  if (_0x51c8dd !== 0x0) {
    return _0x51c8dd;
  }
  return TEXT_MODEL_NAME_COLLATOR["compare"](String(_0x51a585?.["modelId"] || ''), String(_0x4aab6e?.["modelId"] || ''));
}
function getCustomProviderMeta(_0x2cbe83) {
  const _0x255021 = _0x2cbe83?.["extensions"]?.["customProvider"];
  return _0x255021 && typeof _0x255021 === 'object' ? _0x255021 : null;
}
function getCustomTextProviderMenuGroups() {
  const _0x4424ae = new Map();
  getModelsByKind("text")['forEach'](_0x21747f => {
    const _0xed93b = getTextMenuMeta(_0x21747f);
    const _0x570743 = getCustomProviderMeta(_0x21747f);
    const _0x5bb20a = String(_0xed93b?.["group"] || _0x21747f?.["provider"] || '')["trim"]();
    if (!_0x5bb20a || !_0x570743 || _0x4424ae['has'](_0x5bb20a)) {
      return;
    }
    _0x4424ae["set"](_0x5bb20a, {
      'id': _0x5bb20a,
      'label': _0x570743["displayName"] || _0x5bb20a,
      'subtitle': _0xed93b?.["subtitle"] || "自定义中转站",
      'icon': _0xed93b?.["icon"] || 'oa',
      'customProvider': !![]
    });
  });
  return Array["from"](_0x4424ae["values"]());
}
function resolveTextIcon(_0x57f3c8) {
  const _0x29f442 = getTextMenuMeta(_0x57f3c8);
  if (_0x29f442?.['icon']) {
    return _0x29f442["icon"];
  }
  const _0x3fcb5b = String(_0x57f3c8?.["modelId"] || '')["toLowerCase"]();
  if (_0x3fcb5b["includes"]("deepseek")) {
    return "deepseek";
  }
  if (_0x3fcb5b["includes"]("gpt")) {
    return 'oa';
  }
  if (_0x3fcb5b["includes"]("gemini")) {
    return "gemini";
  }
  if (_0x3fcb5b["includes"]("qwen")) {
    return "qwen";
  }
  if (_0x3fcb5b['includes']('kimi')) {
    return "moonshot";
  }
  const _0x2f97e5 = String(_0x57f3c8?.["provider"] || '')['toLowerCase']();
  if (_0x2f97e5 === "runninghub") {
    return "gemini";
  }
  if (_0x2f97e5 === "grsai") {
    return "grsai";
  }
  if (_0x2f97e5 === 'ppio') {
    return "ppio";
  }
  return _0x2f97e5 === "apimart" ? 'am' : _0x2f97e5 || 'am';
}
export function getTextModelMenuItems(_0x28d9ff) {
  const _0x24f725 = String(_0x28d9ff || '')["trim"]()['toLowerCase']();
  return getModelsByKind('text')["filter"](_0x4b6e0c => String(_0x4b6e0c?.['provider'] || '')["toLowerCase"]() === _0x24f725 && getTextMenuMeta(_0x4b6e0c)?.["group"] === _0x24f725)["sort"](compareTextModelMenuItemsByName)["map"](_0xee4bc5 => {
    const _0x5fc97c = getTextMenuMeta(_0xee4bc5) || {};
    return Object["freeze"]({
      'modelId': _0xee4bc5["modelId"],
      'provider': _0xee4bc5["provider"],
      'title': getTextModelMenuTitle(_0xee4bc5),
      'subtitle': _0x5fc97c["subtitle"] || _0xee4bc5["description"] || '',
      'icon': resolveTextIcon(_0xee4bc5),
      'badge': getTextMenuBadge(_0x5fc97c)
    });
  });
}
export const TEXT_MODEL_MENU_ITEMS_BY_PROVIDER = Object["freeze"]({
  'grsai': Object["freeze"](getTextModelMenuItems('grsai')),
  'ppio': Object["freeze"](getTextModelMenuItems("ppio")),
  'apimart': Object["freeze"](getTextModelMenuItems("apimart")),
  'agnes': Object['freeze'](getTextModelMenuItems('agnes')),
  'runninghub': Object["freeze"](getTextModelMenuItems("runninghub")),
  'volcengine': Object["freeze"](getTextModelMenuItems("volcengine")),
  'deepseek': Object["freeze"](getTextModelMenuItems("deepseek"))
});
export const TEXT_MODEL_IDS_BY_PROVIDER = Object["freeze"](Object['fromEntries'](Object['entries'](TEXT_MODEL_MENU_ITEMS_BY_PROVIDER)["map"](([_0x60ce14, _0x41ba0e]) => [_0x60ce14, Object["freeze"](_0x41ba0e["map"](_0x1ad541 => _0x1ad541["modelId"]))])));
export const TEXT_MODEL_DISPLAY_NAME_MAP = Object["freeze"](Object["fromEntries"](Object['values'](TEXT_MODEL_MENU_ITEMS_BY_PROVIDER)["flat"]()["map"](_0x1cba14 => [_0x1cba14["modelId"], _0x1cba14['title']])));
export const APIMART_TEXT_MODEL_MENU_ITEMS = Object['freeze'](TEXT_MODEL_MENU_ITEMS_BY_PROVIDER["apimart"]);
export const APIMART_TEXT_MODEL_IDS = Object["freeze"](TEXT_MODEL_IDS_BY_PROVIDER["apimart"]);
export const APIMART_TEXT_MODEL_DISPLAY_NAME_MAP = Object['freeze'](Object["fromEntries"](APIMART_TEXT_MODEL_MENU_ITEMS["map"](_0x186c71 => [_0x186c71['modelId'], _0x186c71["title"]])));
export const RUNNINGHUB_TEXT_MODEL_MENU_ITEMS = Object["freeze"](TEXT_MODEL_MENU_ITEMS_BY_PROVIDER["runninghub"]);
export const RUNNINGHUB_TEXT_MODEL_IDS = Object['freeze'](TEXT_MODEL_IDS_BY_PROVIDER['runninghub']);
export const VOLCENGINE_TEXT_MODEL_MENU_ITEMS = Object['freeze'](TEXT_MODEL_MENU_ITEMS_BY_PROVIDER['volcengine']);
export const VOLCENGINE_TEXT_MODEL_IDS = Object['freeze'](TEXT_MODEL_IDS_BY_PROVIDER['volcengine']);
export function findTextModelMenuItem(_0x213505) {
  const _0x37143f = String(_0x213505 || '')['trim']();
  return getModelsByKind("text")["map"](_0x1e97a7 => {
    const _0x125623 = getTextMenuMeta(_0x1e97a7) || {};
    return {
      'modelId': _0x1e97a7["modelId"],
      'provider': _0x1e97a7["provider"],
      'title': _0x125623["title"] || _0x1e97a7['displayName'],
      'subtitle': _0x125623["subtitle"] || _0x1e97a7["description"] || '',
      'icon': resolveTextIcon(_0x1e97a7),
      'badge': getTextMenuBadge(_0x125623)
    };
  })["find"](_0x136a25 => _0x136a25["modelId"] === _0x37143f) || null;
}
export function buildTextModelIconHTML(_0x48bcf5, _0x5c689e = 0x14) {
  const _0x5059d9 = Math['max'](0xa, Number(_0x5c689e) || 0x14);
  const _0x130652 = _0x5059d9 <= 0xc ? "text-model-icon-small" : "text-model-icon";
  if (_0x48bcf5 === "deepseek") {
    return "<img src=\"images/deepseek.svg\" class=\"" + _0x130652 + "\" alt=\"deepseek\">";
  }
  if (_0x48bcf5 === "gemini") {
    return '<img\x20src=\x22images/gemini.svg\x22\x20class=\x22' + _0x130652 + "\" alt=\"gemini\">";
  }
  if (_0x48bcf5 === "qwen") {
    return "<img src=\"images/qwen.svg\" class=\"" + _0x130652 + "\" alt=\"qwen\">";
  }
  if (_0x48bcf5 === "grsai") {
    return "<img src=\"images/grsai.png\" class=\"" + _0x130652 + " text-model-icon-padded\" alt=\"grsai\">";
  }
  if (_0x48bcf5 === "ppio") {
    return '<img\x20src=\x22images/ppio.png\x22\x20class=\x22' + _0x130652 + "\" alt=\"ppio\">";
  }
  if (_0x48bcf5 === "runninghub") {
    return '<img\x20src=\x22images/RH.png\x22\x20class=\x22' + _0x130652 + '\x22\x20alt=\x22runninghub\x22>';
  }
  if (_0x48bcf5 === "volcengine") {
    return "<img src=\"images/volcengine.svg\" class=\"" + _0x130652 + "\" alt=\"volcengine\">";
  }
  if (_0x48bcf5 === "agnes") {
    return "<div class=\"" + _0x130652 + " text-model-icon-badge\">AG</div>";
  }
  if (_0x48bcf5 === "moonshot") {
    return "<div class=\"" + _0x130652 + " text-model-icon-badge text-model-icon-moonshot\"><span>M</span></div>";
  }
  if (_0x48bcf5 === 'am') {
    return '<div\x20class=\x22' + _0x130652 + '\x20text-model-icon-badge\x20text-model-icon-apimart\x22>AM</div>';
  }
  const _0x3ccafb = _0x48bcf5 === 'oa' ? 'OA' : 'AM';
  return "<div class=\"" + _0x130652 + " text-model-icon-badge\">" + _0x3ccafb + "</div>";
}
export function buildTextModelSmallIconHTML(_0x19a2f8) {
  const _0x1bbef0 = findTextModelMenuItem(_0x19a2f8);
  return _0x1bbef0 ? buildTextModelIconHTML(_0x1bbef0["icon"], 0xc) : '';
}
export function buildTextModelMenuHTML(_0xc5757a, _0x230cfb, _0x42353d = {}) {
  if (!isModelProviderPubliclyListed(_0x230cfb)) {
    return '';
  }
  const _0x5717ac = Array["isArray"](_0x42353d["allowedModelIds"]) ? new Set(_0x42353d["allowedModelIds"]['map'](_0x2ecc2a => String(_0x2ecc2a || '')["trim"]())) : null;
  const _0x51bac5 = getTextModelMenuItems(_0x230cfb)["filter"](_0x2fdd80 => !_0x5717ac || _0x5717ac["has"](_0x2fdd80['modelId']));
  return _0x51bac5["map"](({
    modelId: _0x1c420c,
    provider: _0x146985,
    title: _0x332c08,
    subtitle: _0x4c6bc4,
    icon: _0x201ece,
    badge: _0x15b240
  }) => '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22floating-menu-item\x20node-menu-item\x20' + (_0xc5757a === _0x1c420c ? 'active' : '') + '\x22\x20data-value=\x22' + escapeHtml(_0x1c420c) + "\" data-provider=\"" + escapeHtml(_0x146985) + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + buildTextModelIconHTML(_0x201ece, 0x14) + "\n                    <div class=\"fmi-content\">\n                      <div class=\"fmi-title\">" + escapeHtml(_0x332c08) + (_0x15b240 ? " <span class=\"floating-menu-badge floating-menu-badge-warning floating-menu-badge-inline\">" + escapeHtml(_0x15b240) + "</span>" : '') + "</div>\n                      <div class=\"fmi-sub\">" + escapeHtml(_0x4c6bc4) + "</div>\n                    </div>\n                    " + buildModelProviderProfileBadgesHtml(_0x1c420c) + "\n                  </div>")["join"]('');
}
export function buildTextProviderMenuGroupsHTML(_0x477ccb, _0x497750 = {}) {
  const _0x35f399 = Array["isArray"](_0x497750["providers"]) ? new Set(_0x497750["providers"]["map"](_0xa634b8 => String(_0xa634b8)['toLowerCase']())) : null;
  const _0x54fdbe = [...getTextProviderMenuGroups(), ...getCustomTextProviderMenuGroups()];
  return _0x54fdbe['filter'](_0x27d397 => !_0x35f399 || _0x35f399["has"](_0x27d397['id']) || _0x35f399['has'](_0x27d397["providerId"]))["map"](_0x1e3091 => {
    const _0x16dd4d = buildTextModelMenuHTML(_0x477ccb, _0x1e3091["providerId"] || _0x1e3091['id'], _0x497750);
    if (!_0x16dd4d["trim"]()) {
      return '';
    }
    return renderNodeMenuGroup({
      'id': _0x1e3091['id'],
      'headerClass': _0x1e3091['id'] + "-group-header",
      'submenuClass': _0x1e3091['id'] + "-submenu",
      'toggleAttr': "data-" + _0x1e3091['id'] + '-toggle',
      'label': _0x1e3091["label"],
      'subtitle': _0x1e3091["subtitle"],
      'developerOnly': _0x1e3091["developerOnly"] === !![],
      'iconHtml': _0x1e3091["icon"] === "runninghub" ? "<img src=\"images/RH.png\" class=\"text-model-icon\" alt=\"runninghub\">" : buildTextModelIconHTML(_0x1e3091["icon"], 0x14),
      'itemsHtml': _0x16dd4d
    }, {
      'activeModel': _0x477ccb
    });
  })["join"]('');
}
export function buildApimartTextModelMenuHTML(_0x2b6bcd) {
  return buildTextModelMenuHTML(_0x2b6bcd, "apimart");
}
export function buildRunningHubTextModelMenuHTML(_0x41825a) {
  return buildTextModelMenuHTML(_0x41825a, "runninghub");
}