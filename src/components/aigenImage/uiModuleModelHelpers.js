import { NANO_BANANA_FAMILIES, getDefaultModeForNanoBananaFamily, getNanoBananaModeOptions, isNanoBananaFamily, resolveNanoBananaModelBySelection, resolveNanoBananaSelectionFromModel } from '../../modules/nanoBananaModeRules.js';
import { getDreaminaImageMenuGroupHTML, getDreaminaImageTriggerIconHTML } from './dreaminaModelMenuHelper.js';
import { isRunningHubGptImage2OfficialModel, normalizeImageSizeForProviderModel } from '../../modules/imageModelCapabilities.js';
import { getAllowedRatiosForProviderModel, pickClosestRatioForProviderModel } from '../../../api/imageRatioPolicy.js';
import { renderCustomRelayQuickAddRow } from '../shared/customRelayModelQuickAdd.js';
import { ANIME_REAL_MODEL_ID, PERSON_REPLACE_V21_MODEL_ID, PERSON_REPLACE_V3_MODEL_ID, QWEN_IMAGE_EDIT_MODEL_ID, getModelsByKind, getModelManifest, resolveModelExecution, resolveModelProvider } from '../../manifests/index.js';
import { isModelManifestPubliclyListed } from '../../manifests/modelCatalogVisibility.js';
import { renderNodeMenuGroup, renderNodeMenuItem } from '../shared/nodeModelMenu.js';
import { buildModelProviderProfileBadgesHtml } from '../shared/modelProviderProfileControl.js';
import { positionNodeSubmenu } from '../shared/nodeFooterControls.js';
import { isAdaptiveImageAspectRatioValue } from '../shared/generationDisplayPolicy.js';
import { renderComfyUiCloudWorkflowLogoHtml, renderComfyUiLocalWorkflowLogoHtml, renderComfyUiWorkflowLogoHtmlFromIconKind } from '../shared/customAiAppLogo.js';
import { t } from '../../i18n/index.js';
import { renderOpenAiLogoHtml } from '../shared/openAiLogo.js';
import { buildModelProviderProfileSelectionPatch } from '../../modules/modelProviderProfileSelection.js';
export const GRSAI_GPT_IMAGE_2_MODEL = 'gpt-image-2';
const GRSAI_GPT_IMAGE_2_VIP_MODEL = 'gpt-image-2-vip';
export const APIMART_GPT_IMAGE_2_MODEL = "apimart/gpt-image-2";
export const APIMART_QWEN_IMAGE_MODEL = 'apimart/qwen-image-2.0';
export const APIMART_Z_IMAGE_TURBO_MODEL = "apimart/z-image-turbo";
export const APIMART_WAN_IMAGE_MODEL = "apimart/wan2.7-image";
export const VOLCENGINE_SEEDREAM_5_PRO_MODEL = 'volcengine/seedream-5.0-pro';
export const VOLCENGINE_SEEDREAM_5_MODEL = "volcengine/seedream-5.0";
export const VOLCENGINE_SEEDREAM_4_5_MODEL = "volcengine/seedream-4.5";
export const VOLCENGINE_SEEDREAM_4_MODEL = "volcengine/seedream-4.0";
export const RH_ANIME_REAL_MODEL = ANIME_REAL_MODEL_ID;
const GRSAI_IMAGE_MENU_ICON_HTML = '<img\x20src=\x22images/grsai.png\x22\x20class=\x22node-menu-icon\x20node-menu-icon-padded\x22\x20alt=\x22grsai\x22>';
const AGNES_BADGE_ICON_HTML = '<div\x20class=\x22node-menu-icon\x20node-menu-icon-badge\x20node-menu-icon-badge-dark\x22>AG</div>';
const OPENAI_CLI_LOGO_ICON_HTML = renderOpenAiLogoHtml("node-menu-icon");
const COMFYUI_CLOUD_WORKFLOW_ICON_HTML = renderComfyUiCloudWorkflowLogoHtml({
  'className': "node-menu-icon"
});
const COMFYUI_LOCAL_WORKFLOW_ICON_HTML = renderComfyUiLocalWorkflowLogoHtml({
  'className': "node-menu-icon"
});
function getDefaultImagePromptPlaceholder() {
  return t("aigenImage.prompt.placeholder");
}
function normalizeGrsaiModelToken(_0x756527) {
  let _0x45c584 = String(_0x756527 || '')["trim"]()["toLowerCase"]();
  _0x45c584["startsWith"]("grsai/") && (_0x45c584 = _0x45c584["slice"]('grsai/'["length"])['trim']());
  return _0x45c584;
}
function isAdvancedModeEnabled() {
  return typeof window !== "undefined" && window["ADVANCED_MODE"] === !![];
}
function getManifestUiField(_0x22d00b, _0x4f479d) {
  const _0x1ef6fb = getModelManifest(_0x22d00b)?.["uiSchema"]?.['fields'];
  return Array["isArray"](_0x1ef6fb) ? _0x1ef6fb["find"](_0x3b3d46 => _0x3b3d46?.['id'] === _0x4f479d) || null : null;
}
const IMAGE_SIZE_ORDER = Object['freeze'](['1K', '2K', '3K', '4K']);
function normalizeImageSizeToken(_0x4209b1) {
  return String(_0x4209b1 || '')["trim"]()["toUpperCase"]();
}
function pickSupportedImageSize(_0x313f6e, _0x289e09) {
  const _0x5d2109 = (Array["isArray"](_0x289e09?.['options']) ? _0x289e09["options"] : [])["map"](_0x250e62 => normalizeImageSizeToken(_0x250e62?.["value"] ?? _0x250e62))["filter"](Boolean);
  const _0x1beec1 = normalizeImageSizeToken(_0x313f6e);
  if (!_0x5d2109['length'] || !_0x1beec1 || _0x5d2109['includes'](_0x1beec1)) {
    return '';
  }
  const _0x39f9f2 = IMAGE_SIZE_ORDER["indexOf"](_0x1beec1);
  const _0x636dd9 = _0x5d2109["map"](_0x2917b2 => ({
    'value': _0x2917b2,
    'rank': IMAGE_SIZE_ORDER["indexOf"](_0x2917b2)
  }))["filter"](_0xaecc24 => _0xaecc24["rank"] >= 0x0)['sort']((_0x41f01e, _0x4b3cd5) => _0x41f01e["rank"] - _0x4b3cd5["rank"]);
  if (_0x39f9f2 >= 0x0 && _0x636dd9["length"] > 0x0) {
    const _0x5c419f = _0x636dd9["filter"](_0x3935d8 => _0x3935d8["rank"] <= _0x39f9f2)['at'](-0x1);
    return _0x5c419f?.['value'] || _0x636dd9[0x0]["value"];
  }
  const _0x251c08 = normalizeImageSizeToken(_0x289e09?.['defaultValue']);
  return _0x5d2109["includes"](_0x251c08) ? _0x251c08 : _0x5d2109[0x0];
}
function pickNearestNumber(_0x12d54f, _0x5cc99e, _0x44e47f) {
  const _0x5e09a3 = (Array["isArray"](_0x5cc99e) ? _0x5cc99e : [])["map"](_0x43bfd9 => Number(_0x43bfd9))["filter"](Number["isFinite"]);
  if (_0x5e09a3["length"] === 0x0) {
    return _0x44e47f;
  }
  const _0x3b94f4 = Number(_0x12d54f);
  if (!Number["isFinite"](_0x3b94f4)) {
    return _0x44e47f;
  }
  return _0x5e09a3["reduce"]((_0x34adf7, _0x1ae481) => Math["abs"](_0x1ae481 - _0x3b94f4) < Math["abs"](_0x34adf7 - _0x3b94f4) ? _0x1ae481 : _0x34adf7, _0x5e09a3[0x0]);
}
export function isGrsaiGptImage2ModelToken(_0x47a640) {
  const _0x6c4a5 = normalizeGrsaiModelToken(_0x47a640);
  return _0x6c4a5 === GRSAI_GPT_IMAGE_2_MODEL || _0x6c4a5 === GRSAI_GPT_IMAGE_2_VIP_MODEL;
}
export function isGrsaiGptImage2Selection(_0x47b95b, _0x252465) {
  const _0x5ac7ee = String(_0x47b95b || '')['trim']()["toLowerCase"]();
  const _0x257a23 = String(_0x252465 || '')["trim"]()["toLowerCase"]();
  const _0x53b03e = normalizeGrsaiModelToken(_0x257a23);
  if (!isGrsaiGptImage2ModelToken(_0x53b03e)) {
    return ![];
  }
  return _0x5ac7ee === "grsai" || _0x257a23["startsWith"]('grsai/') || !_0x5ac7ee && !_0x257a23["includes"]('/');
}
export function isApimartGptImage2Selection(_0x4a16a9, _0x425a36) {
  const _0x48e170 = String(_0x4a16a9 || '')['trim']()["toLowerCase"]();
  const _0x379692 = String(_0x425a36 || '')['trim']()["toLowerCase"]();
  return _0x379692 === APIMART_GPT_IMAGE_2_MODEL || _0x48e170 === "apimart" && _0x379692 === GRSAI_GPT_IMAGE_2_MODEL;
}
export function isRunningHubGptImage2Selection(_0x3aaf66, _0x5ec99f) {
  const _0x34e462 = String(_0x3aaf66 || '')['trim']()["toLowerCase"]();
  const _0x5680f1 = resolveNanoBananaSelectionFromModel(_0x5ec99f, '2K', _0x34e462 || 'runninghub');
  return _0x5680f1?.["provider"] === "runninghub" && _0x5680f1["family"] === NANO_BANANA_FAMILIES["GPT_IMAGE_2"];
}
export function getImageSizeCapabilityProvider(_0x343cb3, _0x55f85d) {
  return isGrsaiGptImage2Selection(_0x343cb3, _0x55f85d) ? 'grsai' : _0x343cb3;
}
export function getEffectiveImageSizeForUi(_0x473c4c, _0x5051ff, _0x30b372) {
  const _0xd1af05 = String(_0x30b372 || '')["trim"]();
  if (_0xd1af05) {
    return _0xd1af05["toUpperCase"]();
  }
  return isGrsaiGptImage2Selection(_0x473c4c, _0x5051ff) ? '1K' : '2K';
}
function getPlainSchemaParams(_0x36dfe7) {
  return _0x36dfe7 && typeof _0x36dfe7 === 'object' && !Array['isArray'](_0x36dfe7) ? {
    ..._0x36dfe7
  } : {};
}
export function normalizeQwenImageEditMode(_0x1afad3) {
  const _0xa9698f = String(_0x1afad3 || '')["trim"]()['toLowerCase']();
  return _0xa9698f === "qwen2509" || _0xa9698f === 'qwen-edit2509' || _0xa9698f === "2509" || _0xa9698f === '0' ? "qwen2509" : 'qwen2511';
}
export function getQwenImageEditModeLabel(_0x23ab70) {
  return normalizeQwenImageEditMode(_0x23ab70) === "qwen2509" ? "2509" : "2511";
}
export function getQwenImageEditModeTooltip(_0x43ea2d) {
  const _0x276c84 = normalizeQwenImageEditMode(_0x43ea2d);
  const _0x1aed2e = getQwenUiFieldOptions("rhQwenEditMode")["find"](_0x3227cf => _0x3227cf["value"] === _0x276c84);
  if (_0x1aed2e?.['tooltip']) {
    return _0x1aed2e['tooltip'];
  }
  return _0x276c84 === "qwen2509" ? t("aigenImage.qwen.versionTooltips.qwen2509") : t("aigenImage.qwen.versionTooltips.qwen2511");
}
export function normalizeQwenFirstImageMode(_0x565770) {
  const _0x15f343 = String(_0x565770 || '')["trim"]()['toLowerCase']();
  if (_0x15f343 === 'pose' || _0x15f343 === '1' || _0x15f343 === "姿势图") {
    return "pose";
  }
  if (_0x15f343 === "depth" || _0x15f343 === '2' || _0x15f343 === "深度图") {
    return "depth";
  }
  return 'original';
}
export function getQwenFirstImageModeLabel(_0xda80ac) {
  const _0x2d1dfd = normalizeQwenFirstImageMode(_0xda80ac);
  const _0x1d6b2d = getQwenUiFieldOptions("rhQwenFirstImageMode")['find'](_0x2b0325 => _0x2b0325["value"] === _0x2d1dfd);
  if (_0x1d6b2d?.['label']) {
    return _0x1d6b2d["label"];
  }
  if (_0x2d1dfd === "pose") {
    return t("aigenImage.qwen.firstImageModes.pose");
  }
  if (_0x2d1dfd === "depth") {
    return t("aigenImage.qwen.firstImageModes.depth");
  }
  return t("aigenImage.qwen.firstImageModes.original");
}
function getQwenModelManifest() {
  return getModelManifest(QWEN_IMAGE_EDIT_MODEL_ID);
}
function getQwenUiField(_0x2dfe8a) {
  const _0x597826 = getQwenModelManifest()?.["uiSchema"]?.["fields"];
  return Array['isArray'](_0x597826) ? _0x597826["find"](_0xedeeae => _0xedeeae?.['id'] === _0x2dfe8a) || null : null;
}
function getQwenUiFieldOptions(_0x4598d4) {
  const _0x142fc0 = getQwenUiField(_0x4598d4)?.['options'];
  return Array["isArray"](_0x142fc0) ? _0x142fc0 : [];
}
export function getQwenImageEditModelManifest() {
  return getQwenModelManifest();
}
export function getQwenFirstImageModeOptions() {
  const _0x1745f1 = getQwenUiFieldOptions('rhQwenFirstImageMode');
  return _0x1745f1["length"] ? _0x1745f1 : [{
    'value': "original",
    'label': t("aigenImage.qwen.firstImageModes.original")
  }, {
    'value': 'pose',
    'label': t("aigenImage.qwen.firstImageModes.pose")
  }, {
    'value': 'depth',
    'label': t("aigenImage.qwen.firstImageModes.depth")
  }];
}
export function getPersonReplaceV21ResolutionOptions() {
  const _0x1ea2e3 = getManifestUiField(PERSON_REPLACE_V21_MODEL_ID, "rhResolution");
  const _0x433be9 = Array['isArray'](_0x1ea2e3?.["options"]) ? _0x1ea2e3["options"] : [];
  const _0x46137f = isAdvancedModeEnabled() && Array["isArray"](_0x1ea2e3?.["advancedOptions"]) ? _0x1ea2e3['advancedOptions'] : [];
  return [..._0x433be9, ..._0x46137f]['map'](_0x3d143e => Number(_0x3d143e))['filter'](Number["isFinite"]);
}
export function normalizePersonReplaceV21Resolution(_0x2bc5e4) {
  const _0x52a3f4 = getManifestUiField(PERSON_REPLACE_V21_MODEL_ID, 'rhResolution');
  const _0x5badd3 = getPersonReplaceV21ResolutionOptions();
  const _0x258ebb = Number(_0x52a3f4?.["defaultValue"]) || 0x500;
  return pickNearestNumber(_0x2bc5e4, _0x5badd3, _0x258ebb);
}
export function buildRunningHubGptImage2OfficialPatch({
  provider = '',
  model = '',
  imageSize = '',
  aspectRatio = ''
} = {}) {
  if (!isRunningHubGptImage2OfficialModel(model, provider)) {
    return {};
  }
  const _0x2ede2d = normalizeImageSizeForProviderModel({
    'model': model,
    'provider': provider,
    'imageSize': imageSize
  });
  const _0x53f9e6 = {};
  const _0x2abe08 = String(imageSize || '')["trim"]()["toUpperCase"]();
  _0x2ede2d && _0x2ede2d !== _0x2abe08 && (_0x53f9e6["imageSize"] = _0x2ede2d);
  if (!isAdaptiveImageAspectRatioValue(aspectRatio)) {
    const _0x4eb7fc = String(aspectRatio || '')["trim"]()['replace'](/[：∶]/g, ':')['replace'](/\s+/g, '');
    const _0x2bbb1f = new Set(getAllowedRatiosForProviderModel(provider, model, _0x2ede2d)["map"](_0x5e023c => _0x5e023c["label"]));
    _0x4eb7fc && !_0x2bbb1f['has'](_0x4eb7fc) && (_0x53f9e6["aspectRatio"] = pickClosestRatioForProviderModel({
      'provider': provider,
      'model': model,
      'ratioLabel': _0x4eb7fc,
      'imageSize': _0x2ede2d
    }));
  }
  return _0x53f9e6;
}
export function getImagePromptPlaceholderForModel(_0x380d82) {
  const _0x42c637 = resolveModelProvider(_0x380d82);
  const _0x36820e = getModelManifest(_0x380d82) || resolveModelExecution(_0x380d82, {
    'providerHint': _0x42c637
  })?.["modelManifest"] || null;
  const _0x39102a = String(_0x36820e?.["prompt"]?.["placeholder"] || '')['trim']();
  if (_0x39102a) {
    return _0x39102a;
  }
  return getDefaultImagePromptPlaceholder();
}
export function escapeHtmlAttr(_0x2ca93f) {
  return String(_0x2ca93f ?? '')['replace'](/&/g, '&amp;')["replace"](/"/g, "&quot;")["replace"](/</g, "&lt;")["replace"](/>/g, "&gt;");
}
const APIMART_BADGE_ICON_HTML = "<div class=\"node-menu-icon node-menu-icon-badge node-menu-icon-apimart\">AM</div>";
const BINGHUO_BADGE_ICON_HTML = "<div class=\"node-menu-icon node-menu-icon-badge\">BH</div>";
function isSavedRhAiAppManifest(_0x1b30be) {
  return Boolean(String(_0x1b30be?.["extensions"]?.['rhAiApp']?.["appKey"] || '')["trim"]());
}
function isSavedComfyUiWorkflowManifest(_0x500579) {
  return Boolean(String(_0x500579?.["extensions"]?.["comfyUiWorkflow"]?.["appKey"] || '')['trim']());
}
function getImageMenuMeta(_0x1b8c63) {
  if (_0x1b8c63?.["extensions"]?.['rhAiApp'] && !isSavedRhAiAppManifest(_0x1b8c63)) {
    return null;
  }
  if (_0x1b8c63?.["extensions"]?.['comfyUiWorkflow'] && !isSavedComfyUiWorkflowManifest(_0x1b8c63)) {
    return null;
  }
  const _0x2de118 = _0x1b8c63?.["extensions"]?.["imageMenu"];
  if (_0x2de118 && typeof _0x2de118 === "object") {
    return _0x2de118;
  }
  if (_0x1b8c63?.["extensions"]?.['rhAiApp']) {
    return {
      'group': "rhAiApp",
      'order': 0x3e7,
      'title': 'RH\x20AI应用',
      'subtitle': _0x1b8c63["description"] || '',
      'icon': _0x1b8c63['icon'] || "images/RH.png",
      'iconAlt': "runninghub"
    };
  }
  return null;
}
function getCustomProviderMeta(_0x3c4c8a) {
  const _0x3224bb = _0x3c4c8a?.["extensions"]?.["customProvider"];
  return _0x3224bb && typeof _0x3224bb === 'object' ? _0x3224bb : null;
}
function getCustomProviderBadgeText(_0xd7333f, _0x18d710 = {}) {
  return String(getCustomProviderMeta(_0xd7333f)?.["badge"] || _0x18d710["badge"] || 'CP')["trim"]()["slice"](0x0, 0x2) || 'CP';
}
export function getImageModelMenuManifests(_0x35e860) {
  const _0x455d84 = String(_0x35e860 || '')['trim']();
  return getModelsByKind("image")["filter"](isModelManifestPubliclyListed)["filter"](_0x450bf7 => !_0x450bf7['uiPlacement']?.["length"] || _0x450bf7["uiPlacement"]["includes"]("node"))['filter'](_0x5135b4 => getImageMenuMeta(_0x5135b4)?.["group"] === _0x455d84)['sort']((_0x2a50f8, _0x5e5f97) => {
    const _0x4fb5a6 = getImageMenuMeta(_0x2a50f8);
    const _0x3b6efb = getImageMenuMeta(_0x5e5f97);
    return (_0x4fb5a6?.['order'] || 0x0) - (_0x3b6efb?.["order"] || 0x0);
  });
}
function renderImageMenuGroupHTML({
  headerClass: _0x28476e,
  toggleAttr: _0x3356ea,
  submenuClass: _0x2895fb,
  iconHtml: _0x57fd51,
  title: _0x3c8e46,
  subtitle: _0x336677,
  vip = ![],
  badgeHtml = '',
  itemsHtml = '',
  attrs: _0x3b596b,
  developerOnly = ![]
}) {
  return renderNodeMenuGroup({
    'id': _0x2895fb,
    'headerClass': _0x28476e,
    'toggleAttr': _0x3356ea,
    'submenuClass': _0x2895fb,
    'iconHtml': _0x57fd51,
    'label': _0x3c8e46,
    'subtitle': _0x336677,
    'vip': vip,
    'badgeHtml': badgeHtml,
    'itemsHtml': itemsHtml,
    'attrs': _0x3b596b,
    'developerOnly': developerOnly
  });
}
function renderImageManifestIconHTML(_0x1b64d9, _0xe9a4c7 = {}) {
  if (_0xe9a4c7["iconKind"] === 'customProviderBadge') {
    const _0x1ee212 = getCustomProviderBadgeText(_0x1b64d9, _0xe9a4c7);
    return "<div class=\"node-menu-icon node-menu-icon-badge\">" + escapeHtmlAttr(_0x1ee212) + "</div>";
  }
  if (_0xe9a4c7["iconKind"] === 'openAiBadge') {
    return OPENAI_CLI_LOGO_ICON_HTML;
  }
  if (_0xe9a4c7["iconKind"] === "apimartBadge") {
    return APIMART_BADGE_ICON_HTML;
  }
  if (_0xe9a4c7["iconKind"] === "binghuoBadge") {
    return BINGHUO_BADGE_ICON_HTML;
  }
  if (_0xe9a4c7["iconKind"] === "agnesBadge") {
    return AGNES_BADGE_ICON_HTML;
  }
  if (_0xe9a4c7["iconKind"] === "comfyUiCloudWorkflowBadge") {
    return COMFYUI_CLOUD_WORKFLOW_ICON_HTML;
  }
  if (_0xe9a4c7["iconKind"] === "comfyUiLocalWorkflowBadge") {
    return COMFYUI_LOCAL_WORKFLOW_ICON_HTML;
  }
  const _0x16b4ca = _0xe9a4c7['icon'] || _0x1b64d9?.["icon"] || '';
  if (!_0x16b4ca) {
    return '';
  }
  const _0x2f511d = _0xe9a4c7["iconAlt"] || _0x1b64d9?.["provider"] || _0x1b64d9?.["displayName"] || '';
  return "<img src=\"" + escapeHtmlAttr(_0x16b4ca) + '\x22\x20class=\x22node-menu-icon\x22\x20alt=\x22' + escapeHtmlAttr(_0x2f511d) + '\x22>';
}
function getCustomProviderImageGroups(_0xf844f8 = '') {
  const _0x2d8f2e = new Map();
  getModelsByKind("image")["filter"](isModelManifestPubliclyListed)["forEach"](_0x39a99e => {
    const _0x31f20b = getImageMenuMeta(_0x39a99e);
    const _0x20b08c = getCustomProviderMeta(_0x39a99e);
    const _0x7f00b6 = String(_0x31f20b?.["group"] || _0x39a99e?.["provider"] || '')["trim"]();
    if (!_0x31f20b || !_0x20b08c || !_0x7f00b6) {
      return;
    }
    !_0x2d8f2e['has'](_0x7f00b6) && _0x2d8f2e["set"](_0x7f00b6, {
      'providerId': _0x7f00b6,
      'displayName': _0x20b08c["displayName"] || _0x7f00b6,
      'subtitle': _0x31f20b["subtitle"] || "自定义中转站",
      'badge': _0x20b08c["badge"] || _0x31f20b['badge'] || 'CP',
      'items': []
    });
    _0x2d8f2e['get'](_0x7f00b6)["items"]['push'](_0x39a99e);
  });
  return Array["from"](_0x2d8f2e["values"]())["map"](_0xff6a09 => {
    const _0x2c43f2 = _0xff6a09["providerId"]["replace"](/[^A-Za-z0-9_-]/g, '-');
    return renderImageMenuGroupHTML({
      'headerClass': 'custom-provider-image-group-header\x20custom-provider-image-group-' + _0x2c43f2,
      'toggleAttr': 'data-custom-provider-image-toggle',
      'submenuClass': "custom-provider-image-submenu-" + _0x2c43f2,
      'iconHtml': '<div\x20class=\x22node-menu-icon\x20node-menu-icon-badge\x22>' + escapeHtmlAttr(_0xff6a09['badge']) + "</div>",
      'title': _0xff6a09["displayName"],
      'subtitle': _0xff6a09["subtitle"],
      'attrs': {
        'data-custom-provider-image-group': _0xff6a09["providerId"]
      },
      'itemsHtml': _0xff6a09["items"]["sort"]((_0x4e7147, _0x589586) => Number(getImageMenuMeta(_0x4e7147)?.['order'] || 0x0) - Number(getImageMenuMeta(_0x589586)?.['order'] || 0x0))["map"](_0x56c98e => renderImageManifestMenuItemHTML(_0x56c98e, _0xf844f8))['join']('')
    });
  });
}
function renderImageManifestMenuItemHTML(_0x58897a, _0x5caf46) {
  const _0x18fc22 = getImageMenuMeta(_0x58897a) || {};
  const _0x37a7a3 = _0x58897a?.['modelId'] || '';
  const _0x415275 = _0x58897a?.["provider"] || '';
  const _0x41022c = String(_0x5caf46 || '') === _0x37a7a3;
  const _0x2be8ba = _0x58897a?.['vip'] === !![] && _0x18fc22["showVipBadge"] !== ![];
  const _0x329ff1 = Array["isArray"](_0x58897a?.["extensions"]?.["providerProfiles"]) && _0x58897a['extensions']['providerProfiles']["length"] ? buildModelProviderProfileBadgesHtml(_0x58897a, {
    'vip': _0x2be8ba
  }) : '';
  return renderNodeMenuItem({
    'modelId': _0x37a7a3,
    'provider': _0x415275,
    'label': _0x18fc22["title"] || _0x58897a?.['displayName'] || _0x37a7a3,
    'priceText': _0x18fc22["priceText"] || '',
    'description': _0x18fc22["subtitle"] || _0x58897a?.["description"] || '',
    'iconHtml': renderImageManifestIconHTML(_0x58897a, _0x18fc22),
    'active': _0x41022c,
    'vip': _0x2be8ba,
    'badgeHtml': _0x329ff1
  });
}
export function buildGrsaiImageMenuGroupHTML(_0x59b255, _0xabc3f6 = '') {
  return renderImageMenuGroupHTML({
    'headerClass': "grsai-group-header",
    'toggleAttr': "data-grsai-toggle",
    'submenuClass': "grsai-submenu",
    'iconHtml': GRSAI_IMAGE_MENU_ICON_HTML,
    'title': "GRSAI",
    'subtitle': "高性能 AI 图像生成服务",
    'itemsHtml': buildNanoBananaFamilyMenuHTML(_0x59b255, _0xabc3f6)
  });
}
export function buildApimartImageMenuGroupHTML(_0x3963c0) {
  const _0x2e737f = getImageModelMenuManifests("apimart")["map"](_0x28fab6 => renderImageManifestMenuItemHTML(_0x28fab6, _0x3963c0))["join"]('');
  return renderImageMenuGroupHTML({
    'headerClass': "apimart-group-header",
    'toggleAttr': "data-apimart-toggle",
    'submenuClass': 'apimart-submenu',
    'iconHtml': APIMART_BADGE_ICON_HTML,
    'title': "APIMart",
    'subtitle': "一个 API 搞定一切——节省 30-70%",
    'itemsHtml': _0x2e737f
  });
}
export function buildAgnesImageMenuGroupHTML(_0x3561ed) {
  const _0x4d73b6 = getImageModelMenuManifests("agnes")["map"](_0x4cd4e5 => renderImageManifestMenuItemHTML(_0x4cd4e5, _0x3561ed))["join"]('');
  return renderImageMenuGroupHTML({
    'headerClass': "agnes-group-header",
    'toggleAttr': "data-agnes-toggle",
    'submenuClass': "agnes-submenu",
    'iconHtml': AGNES_BADGE_ICON_HTML,
    'title': "Agnes AI",
    'subtitle': 'Agnes\x20Image\x20model\x20API',
    'itemsHtml': _0x4d73b6
  });
}
export function buildBinghuoImageMenuGroupHTML(_0x50a090) {
  const _0x54257b = getImageModelMenuManifests("binghuo")["map"](_0x55efe8 => renderImageManifestMenuItemHTML(_0x55efe8, _0x50a090))["join"]('');
  if (!_0x54257b) {
    return '';
  }
  return renderImageMenuGroupHTML({
    'headerClass': "binghuo-image-group-header",
    'toggleAttr': 'data-binghuo-image-toggle',
    'submenuClass': "binghuo-image-submenu",
    'iconHtml': BINGHUO_BADGE_ICON_HTML,
    'title': "便宜渠道bh",
    'subtitle': "炳火图片生成 API",
    'itemsHtml': _0x54257b
  });
}
export function buildVolcengineImageMenuGroupHTML(_0x24cd8c) {
  return buildOfficialImageMenuGroupHTML(_0x24cd8c, 'volcengine', "火山方舟", "images/volcengine.svg", "Ark Seedream 图像生成 API");
}
function buildOfficialImageMenuGroupHTML(_0x4a4adf, _0x5c9288, _0xa24c34, _0x1808ad, _0x38667e) {
  const _0x287068 = getImageModelMenuManifests(_0x5c9288)['map'](_0x33bd7c => renderImageManifestMenuItemHTML(_0x33bd7c, _0x4a4adf))["join"]('');
  return renderImageMenuGroupHTML({
    'headerClass': _0x5c9288 + "-group-header",
    'toggleAttr': 'data-' + _0x5c9288 + "-toggle",
    'submenuClass': _0x5c9288 + "-submenu",
    'iconHtml': '<img\x20src=\x22' + _0x1808ad + '\x22\x20class=\x22node-menu-icon\x22\x20alt=\x22' + _0x5c9288 + '\x22>',
    'title': _0xa24c34,
    'subtitle': _0x38667e,
    'itemsHtml': _0x287068
  });
}
export function buildOpenAiCliImageMenuGroupHTML(_0x9141d6) {
  const _0x5e2f6b = getImageModelMenuManifests("openai-cli")['map'](_0x573c2b => renderImageManifestMenuItemHTML(_0x573c2b, _0x9141d6))["join"]('');
  if (!_0x5e2f6b) {
    return '';
  }
  return renderImageMenuGroupHTML({
    'headerClass': "openai-cli-image-group-header",
    'toggleAttr': 'data-openai-cli-image-toggle',
    'submenuClass': "openai-cli-image-submenu",
    'iconHtml': OPENAI_CLI_LOGO_ICON_HTML,
    'title': "OpenAI CLI",
    'subtitle': "使用本机已登录的 OpenAI CLI 账号",
    'itemsHtml': _0x5e2f6b
  });
}
export function buildRunningHubImageModelMenuGroupHTML(_0x1893ac, _0x11a1cd = '') {
  return renderImageMenuGroupHTML({
    'headerClass': "runninghub-group-header",
    'toggleAttr': "data-runninghub-toggle",
    'submenuClass': "runninghub-submenu",
    'iconHtml': '<img\x20src=\x22images/RH.png\x22\x20class=\x22node-menu-icon\x22\x20alt=\x22runninghub\x22>',
    'title': "RunningHub模型",
    'subtitle': "模型 API：文生图/图生图/图片编辑",
    'itemsHtml': buildRunningHubNanoBananaFamilyMenuHTML(_0x1893ac, _0x11a1cd)
  });
}
export function buildRunningHubWorkflowImageMenuGroupHTML(_0x301ec3, _0x100b9e = null) {
  const _0x5e1ea2 = Array["isArray"](_0x100b9e) ? _0x100b9e["map"](getModelManifest)["filter"](_0x302dfe => _0x302dfe?.['kind'] === "image" && getImageMenuMeta(_0x302dfe)?.['group'] === "runninghubWorkflow") : getImageModelMenuManifests("runninghubWorkflow");
  const _0x3bb454 = _0x5e1ea2['map'](_0x25dcd4 => buildManifestModelMenuItemHTML(_0x25dcd4["modelId"], _0x301ec3))["join"]('');
  return renderImageMenuGroupHTML({
    'headerClass': 'runninghubwf-group-header',
    'toggleAttr': "data-runninghubwf-toggle",
    'submenuClass': "runninghubwf-submenu",
    'iconHtml': "<img src=\"images/RH.png\" class=\"node-menu-icon\" alt=\"runninghub\">",
    'title': "RunningHUB工作流",
    'subtitle': '工作流模板：替换/风格迁移，结果更可控',
    'itemsHtml': _0x3bb454
  });
}
export function buildRhAiAppImageMenuGroupHTML(_0x1f4d38) {
  const _0x265463 = getImageModelMenuManifests('rhAiApp')['map'](_0x4579aa => renderImageManifestMenuItemHTML(_0x4579aa, _0x1f4d38))['join']('');
  if (!_0x265463) {
    return '';
  }
  return renderImageMenuGroupHTML({
    'headerClass': "rh-ai-app-image-group-header",
    'toggleAttr': "data-rh-ai-app-toggle",
    'submenuClass': "rh-ai-app-image-submenu",
    'iconHtml': '<img\x20src=\x22images/RH.png\x22\x20class=\x22node-menu-icon\x22\x20alt=\x22runninghub\x22>',
    'title': 'RH\x20AI应用',
    'subtitle': "自定义 RunningHub AI App",
    'itemsHtml': _0x265463
  });
}
function buildComfyUiWorkflowImageMenuGroupHTML({
  activeModel: _0x34d12a,
  group: _0x3ee9fe,
  headerClass: _0xb40f8a,
  toggleAttr: _0x49ee28,
  submenuClass: _0x4865ac,
  iconHtml: _0x390a5d,
  title: _0x4421f1,
  subtitle: _0x4bcab7
} = {}) {
  const _0x5315e5 = getImageModelMenuManifests(_0x3ee9fe)['map'](_0x270352 => renderImageManifestMenuItemHTML(_0x270352, _0x34d12a))["join"]('');
  if (!_0x5315e5) {
    return '';
  }
  return renderImageMenuGroupHTML({
    'headerClass': _0xb40f8a,
    'toggleAttr': _0x49ee28,
    'submenuClass': _0x4865ac,
    'iconHtml': _0x390a5d,
    'title': _0x4421f1,
    'subtitle': _0x4bcab7,
    'itemsHtml': _0x5315e5
  });
}
export function buildComfyUiCloudWorkflowImageMenuGroupHTML(_0x4daecc) {
  return buildComfyUiWorkflowImageMenuGroupHTML({
    'activeModel': _0x4daecc,
    'group': 'comfyUiCloudWorkflow',
    'headerClass': "comfyui-cloud-workflow-group-header",
    'toggleAttr': "data-comfyui-cloud-workflow-toggle",
    'submenuClass': 'comfyui-cloud-workflow-submenu',
    'iconHtml': COMFYUI_CLOUD_WORKFLOW_ICON_HTML,
    'title': "云端工作流",
    'subtitle': '保存的\x20ComfyUI\x20云端工作流'
  });
}
export function buildComfyUiLocalWorkflowImageMenuGroupHTML(_0x292946) {
  return buildComfyUiWorkflowImageMenuGroupHTML({
    'activeModel': _0x292946,
    'group': "comfyUiLocalWorkflow",
    'headerClass': "comfyui-local-workflow-group-header",
    'toggleAttr': "data-comfyui-local-workflow-toggle",
    'submenuClass': 'comfyui-local-workflow-submenu',
    'iconHtml': COMFYUI_LOCAL_WORKFLOW_ICON_HTML,
    'title': "本地工作流",
    'subtitle': "保存的 ComfyUI 本地工作流"
  });
}
export function buildImageModelMenuHTML({
  activeModel = '',
  nanoSelection = null,
  excludeRunningHubWorkflowModels = ![],
  allowedWorkflowModelIds = null,
  customRelayQuickAdd = ![]
} = {}) {
  if (Array["isArray"](allowedWorkflowModelIds)) {
    return "<div class=\"floating-menu img-model-menu\">" + buildRunningHubWorkflowImageMenuGroupHTML(activeModel, allowedWorkflowModelIds) + '</div>';
  }
  return '<div\x20class=\x22floating-menu\x20img-model-menu\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + buildGrsaiImageMenuGroupHTML(nanoSelection, activeModel) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + getDreaminaImageMenuGroupHTML(activeModel) + "\n                " + buildOpenAiCliImageMenuGroupHTML(activeModel) + "\n                " + buildApimartImageMenuGroupHTML(activeModel) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + buildBinghuoImageMenuGroupHTML(activeModel) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + buildAgnesImageMenuGroupHTML(activeModel) + "\n                " + buildVolcengineImageMenuGroupHTML(activeModel) + "\n                " + buildOfficialImageMenuGroupHTML(activeModel, "bailian", "阿里云百炼", "images/qwen.svg", "官方 · Qwen Image 3.0") + "\n                " + getCustomProviderImageGroups(activeModel)["join"]('') + "\n                " + buildRhAiAppImageMenuGroupHTML(activeModel) + "\n                " + buildComfyUiCloudWorkflowImageMenuGroupHTML(activeModel) + "\n                " + buildComfyUiLocalWorkflowImageMenuGroupHTML(activeModel) + "\n                " + buildRunningHubImageModelMenuGroupHTML(nanoSelection, activeModel) + "\n                " + (excludeRunningHubWorkflowModels ? '' : buildRunningHubWorkflowImageMenuGroupHTML(activeModel)) + (customRelayQuickAdd ? renderCustomRelayQuickAddRow("image") : '') + "\n              </div>";
}
function getLatestImageMenuNodeData(_0x2171fe, _0x102e0a, _0xd18aed = {}) {
  const _0x5dd3f9 = typeof _0x2171fe?.['getStateRaw'] === 'function' ? _0x2171fe["getStateRaw"]() : _0x2171fe?.['getState']?.() || {};
  return _0x5dd3f9['nodes']?.[_0x102e0a] || _0xd18aed || {};
}
function getImageMenuItemTitle(_0x4c7832, _0x363d06 = '') {
  const _0x42ce0f = _0x4c7832?.['querySelector']?.(".fmi-title") || _0x4c7832?.["querySelector"]?.(".floating-menu-label");
  return _0x42ce0f ? _0x42ce0f["textContent"] : _0x363d06;
}
function clearImageModelMenuActive(_0x523761) {
  _0x523761?.['querySelectorAll']?.(".floating-menu-item")?.['forEach'](_0x36dcdc => _0x36dcdc["classList"]["remove"]("active"));
}
export function bindImageModelMenuSubmenu({
  modelMenu: _0xff8ee7,
  modelTrigger: _0x2224d1,
  modelLabel: _0x281b7a,
  nodeId: _0x445a62,
  store: _0x47fc06,
  fallbackNodeData = {},
  toggleSelector = '',
  submenuSelector = '',
  headerEl = null,
  submenuEl = null,
  defaultProvider = '',
  buildModelPatch: _0x5b6c0c,
  resolveSelection: _0x33d7a4,
  beforeSelect: _0x5d6981,
  onDisabled: _0x63f703,
  afterSelect: _0x3f6ff4
} = {}) {
  if (!_0xff8ee7 || !_0x281b7a || !_0x445a62 || !_0x47fc06) {
    return null;
  }
  const _0x227c73 = headerEl || _0xff8ee7["querySelector"](toggleSelector);
  const _0x3ecdcd = submenuEl || _0xff8ee7["querySelector"](submenuSelector);
  if (!_0x227c73 || !_0x3ecdcd) {
    return null;
  }
  let _0x18755e = null;
  const _0x2d7d6f = () => {
    _0x18755e && (clearTimeout(_0x18755e), _0x18755e = null);
    positionNodeSubmenu(_0x227c73, _0x3ecdcd);
  };
  const _0x2f168d = (_0x4a1b3d = 0x78) => {
    if (_0x18755e) {
      clearTimeout(_0x18755e);
    }
    _0x18755e = setTimeout(() => {
      _0x3ecdcd["style"]["display"] = 'none';
    }, _0x4a1b3d);
  };
  _0x227c73['addEventListener']("mouseenter", _0x2d7d6f);
  _0x227c73["addEventListener"]("mouseleave", () => _0x2f168d());
  _0x3ecdcd["addEventListener"]('mouseenter', _0x2d7d6f);
  _0x3ecdcd['addEventListener']("mouseleave", () => _0x2f168d());
  _0x3ecdcd['querySelectorAll'](".floating-menu-item")["forEach"](_0x24c612 => {
    _0x24c612["addEventListener"]("click", _0x348270 => {
      _0x348270["stopPropagation"]();
      if (_0x24c612['dataset']["disabled"] === "true") {
        _0x63f703?.({
          'item': _0x24c612,
          'modelMenu': _0xff8ee7,
          'submenu': _0x3ecdcd,
          'modelTrigger': _0x2224d1
        });
        return;
      }
      const _0x1b3c75 = getLatestImageMenuNodeData(_0x47fc06, _0x445a62, fallbackNodeData);
      const _0x37b380 = (typeof _0x33d7a4 === "function" ? _0x33d7a4({
        'item': _0x24c612,
        'latestNode': _0x1b3c75,
        'defaultProvider': defaultProvider
      }) : null) || {
        'model': _0x24c612["dataset"]["value"],
        'provider': _0x24c612['dataset']["provider"] || defaultProvider
      };
      const _0x3a354c = String(_0x37b380["model"] || '')["trim"]();
      const _0x9b77fb = String(_0x37b380["provider"] || defaultProvider)["trim"]();
      if (!_0x3a354c || !_0x9b77fb) {
        return;
      }
      if (typeof _0x5d6981 === 'function' && _0x5d6981({
        'item': _0x24c612,
        'model': _0x3a354c,
        'provider': _0x9b77fb,
        'latestNode': _0x1b3c75,
        'selection': _0x37b380
      }) === ![]) {
        return;
      }
      _0x281b7a["textContent"] = _0x37b380["label"] || getImageMenuItemTitle(_0x24c612, _0x3a354c);
      clearImageModelMenuActive(_0xff8ee7);
      _0x24c612["classList"]["add"]("active");
      _0xff8ee7["classList"]["remove"]("show");
      _0x3ecdcd['style']['display'] = "none";
      const _0x33eebb = _0x37b380['patch'] && typeof _0x37b380["patch"] === 'object' ? _0x37b380['patch'] : {
        'model': _0x3a354c,
        'provider': _0x9b77fb
      };
      const _0x3537c6 = typeof _0x5b6c0c === "function" ? _0x5b6c0c(_0x1b3c75, _0x3a354c, _0x9b77fb, _0x33eebb) : {
        ..._0x33eebb,
        'model': _0x3a354c,
        'provider': _0x9b77fb
      };
      _0x47fc06["updateNodeData"](_0x445a62, _0x3537c6);
      _0x3f6ff4?.({
        'item': _0x24c612,
        'model': _0x3a354c,
        'provider': _0x9b77fb,
        'latestNode': _0x1b3c75,
        'patch': _0x3537c6,
        'selection': _0x37b380,
        'modelMenu': _0xff8ee7,
        'submenu': _0x3ecdcd,
        'modelTrigger': _0x2224d1
      });
    });
  });
  return {
    'header': _0x227c73,
    'submenu': _0x3ecdcd
  };
}
export function resolveGrsaiImageMenuSelection({
  item: _0x141126,
  latestNode: _0x58872c
} = {}) {
  const _0x5e7c6b = 'grsai';
  const _0x2b945d = String(_0x141126?.["dataset"]?.["value"] || '')["trim"]();
  let _0x3de1da = _0x2b945d;
  let _0x177756 = {
    'model': _0x3de1da,
    'provider': _0x5e7c6b
  };
  if (isGrsaiGptImage2ModelToken(_0x3de1da)) {
    _0x3de1da = GRSAI_GPT_IMAGE_2_MODEL;
    _0x177756 = {
      'model': _0x3de1da,
      'provider': _0x5e7c6b,
      'imageSize': '1K'
    };
  } else {
    if (!_0x3de1da) {
      const _0x45c810 = String(_0x141126?.['dataset']?.["nbFamily"] || '')["trim"]();
      if (!_0x45c810) {
        return null;
      }
      const _0x3bee32 = getPlainSchemaParams(_0x58872c?.['generationParams'])["imageSize"] || '2K';
      const _0x24abfb = getDefaultModeForNanoBananaFamily(_0x45c810, _0x5e7c6b);
      _0x3de1da = resolveNanoBananaModelBySelection({
        'family': _0x45c810,
        'mode': _0x24abfb,
        'imageSize': _0x3bee32,
        'provider': _0x5e7c6b
      });
      _0x177756 = {
        'model': _0x3de1da,
        'provider': _0x5e7c6b
      };
    }
  }
  return {
    'model': _0x3de1da,
    'provider': _0x5e7c6b,
    'patch': _0x177756
  };
}
export function resolveApimartImageMenuSelection({
  item: _0xadaf8b,
  latestNode: _0x1dbd97
} = {}) {
  const _0x158459 = String(_0xadaf8b?.["dataset"]?.["value"] || '')["trim"]();
  const _0x530a3c = String(_0xadaf8b?.['dataset']?.["provider"] || "apimart")["trim"]();
  const _0x3a01c4 = {
    'model': _0x158459,
    'provider': _0x530a3c
  };
  if (_0x158459 === "apimart/seedream-4.5" || _0x158459 === "apimart/seedream-5.0-lite" || _0x158459 === APIMART_GPT_IMAGE_2_MODEL || _0x158459 === APIMART_QWEN_IMAGE_MODEL || _0x158459 === APIMART_Z_IMAGE_TURBO_MODEL || _0x158459 === APIMART_WAN_IMAGE_MODEL) {
    const _0x3c5cd9 = getPlainSchemaParams(_0x1dbd97?.["generationParams"])["imageSize"] || _0x1dbd97?.["imageSize"] || '2K';
    (_0x158459 === 'apimart/seedream-4.5' || _0x158459 === 'apimart/seedream-5.0-lite') && _0x3c5cd9 === '1K' && (_0x3a01c4["imageSize"] = '2K');
    _0x158459 === "apimart/seedream-5.0-lite" && _0x3c5cd9 === '4K' && (_0x3a01c4['imageSize'] = '3K');
    _0x158459 === APIMART_GPT_IMAGE_2_MODEL && _0x3c5cd9 === '3K' && (_0x3a01c4['imageSize'] = '2K');
    (_0x158459 === APIMART_QWEN_IMAGE_MODEL || _0x158459 === APIMART_Z_IMAGE_TURBO_MODEL) && _0x3c5cd9 !== '1K' && _0x3c5cd9 !== '2K' && (_0x3a01c4['imageSize'] = '1K');
    _0x158459 === APIMART_WAN_IMAGE_MODEL && _0x3c5cd9 !== '1K' && _0x3c5cd9 !== '2K' && (_0x3a01c4["imageSize"] = '2K');
  }
  return {
    'model': _0x158459,
    'provider': _0x530a3c,
    'patch': _0x3a01c4
  };
}
export function resolveVolcengineImageMenuSelection({
  item: _0x498c6a,
  latestNode: _0x2a95e1
} = {}) {
  const _0x39bc01 = String(_0x498c6a?.["dataset"]?.['value'] || '')["trim"]();
  const _0x12d535 = String(_0x498c6a?.["dataset"]?.["provider"] || 'volcengine')["trim"]();
  const _0x4cf11c = {
    'model': _0x39bc01,
    'provider': _0x12d535
  };
  const _0x534283 = getPlainSchemaParams(_0x2a95e1?.["generationParams"])["imageSize"] || _0x2a95e1?.['imageSize'] || '2K';
  const _0x39ec55 = pickSupportedImageSize(_0x534283, getManifestUiField(_0x39bc01, "imageSize"));
  _0x39ec55 && (_0x4cf11c["imageSize"] = _0x39ec55);
  return {
    'model': _0x39bc01,
    'provider': _0x12d535,
    'patch': _0x4cf11c
  };
}
export function resolveRunningHubWorkflowImageMenuSelection({
  item: _0xd9928f
} = {}) {
  return {
    'model': _0xd9928f?.["dataset"]?.["value"],
    'provider': _0xd9928f?.["dataset"]?.['provider'] || "runninghubwf"
  };
}
export function resolveRunningHubModelImageMenuSelection({
  item: _0x269af1,
  latestNode: _0x1647c9
} = {}) {
  const _0x191306 = String(_0x269af1?.["dataset"]?.["nbFamily"] || '')['trim']();
  let _0x2dae2c = _0x269af1?.["dataset"]?.['value'];
  let _0x3b5605 = _0x269af1?.['dataset']?.['provider'] || "runninghubwf";
  if (_0x191306) {
    _0x3b5605 = 'runninghub';
    const _0x30eaf9 = getPlainSchemaParams(_0x1647c9?.['generationParams'])["imageSize"] || '2K';
    const _0x45c220 = getDefaultModeForNanoBananaFamily(_0x191306, _0x3b5605);
    _0x2dae2c = resolveNanoBananaModelBySelection({
      'family': _0x191306,
      'mode': _0x45c220,
      'imageSize': _0x30eaf9,
      'provider': _0x3b5605
    });
  }
  if (!_0x2dae2c || !_0x3b5605) {
    return null;
  }
  const _0x12568a = buildModelProviderProfileSelectionPatch(_0x1647c9, _0x2dae2c, _0x269af1?.['dataset']?.['credentialResolvedProviderProfileId']);
  _0x12568a["rhProviderProfileId"] === '' && !Object["hasOwn"](_0x1647c9 || {}, "rhProviderProfileId") && delete _0x12568a['rhProviderProfileId'];
  return {
    'model': _0x2dae2c,
    'provider': _0x3b5605,
    'patch': _0x12568a
  };
}
function createImageTriggerIcon(_0x2858ce, _0x977719 = "img") {
  const _0x4b0773 = _0x2858ce?.['ownerDocument'] || (typeof document !== "undefined" ? document : null);
  return _0x4b0773?.["createElement"]?.(_0x977719) || null;
}
function replaceImageModelTriggerFirstIcon(_0x367677, _0x243300) {
  const _0x3f8889 = _0x367677?.["firstElementChild"];
  if (!_0x3f8889 || !_0x243300) {
    return;
  }
  _0x3f8889["replaceWith"](_0x243300);
}
function createImageTriggerIconFromHTML(_0x9d71de, _0x539252) {
  const _0x2988a9 = _0x9d71de?.['ownerDocument'] || (typeof document !== "undefined" ? document : null);
  const _0x2d2022 = _0x2988a9?.["createElement"]?.("template");
  if (!_0x2d2022) {
    return null;
  }
  _0x2d2022["innerHTML"] = String(_0x539252 || '')["trim"]();
  return _0x2d2022["content"]?.["firstElementChild"] || null;
}
function setSimpleImageModelTriggerIcon(_0x5cde39, _0x7bd12b = {}) {
  const _0x75b0b2 = createImageTriggerIcon(_0x5cde39, 'img');
  if (!_0x75b0b2) {
    return;
  }
  _0x75b0b2["src"] = _0x7bd12b['src'] || '';
  if (_0x7bd12b["alt"]) {
    _0x75b0b2["alt"] = _0x7bd12b['alt'];
  }
  _0x75b0b2["className"] = ["image-model-trigger-icon", _0x7bd12b["className"] || '']["filter"](Boolean)['join']('\x20');
  replaceImageModelTriggerFirstIcon(_0x5cde39, _0x75b0b2);
}
function setApimartImageModelTriggerIcon(_0x50255b) {
  const _0x2c7920 = createImageTriggerIcon(_0x50255b, "div");
  if (!_0x2c7920) {
    return;
  }
  _0x2c7920["className"] = "image-model-trigger-icon image-model-trigger-badge image-model-trigger-icon-apimart";
  _0x2c7920['innerText'] = 'AM';
  replaceImageModelTriggerFirstIcon(_0x50255b, _0x2c7920);
}
function setAgnesImageModelTriggerIcon(_0x2a397c) {
  const _0x5910c3 = createImageTriggerIcon(_0x2a397c, "div");
  if (!_0x5910c3) {
    return;
  }
  _0x5910c3["className"] = 'image-model-trigger-icon\x20image-model-trigger-badge';
  _0x5910c3["innerText"] = 'AG';
  replaceImageModelTriggerFirstIcon(_0x2a397c, _0x5910c3);
}
function setOpenAiCliImageModelTriggerIcon(_0x1c48ff) {
  const _0x4032d9 = createImageTriggerIconFromHTML(_0x1c48ff, renderOpenAiLogoHtml("image-model-trigger-icon"));
  if (!_0x4032d9) {
    return;
  }
  replaceImageModelTriggerFirstIcon(_0x1c48ff, _0x4032d9);
}
function getComfyUiWorkflowIconKind(_0x52ca78 = '', _0x47f1c6 = null) {
  const _0x44e0d8 = _0x47f1c6?.["querySelector"]?.(".custom-ai-app-logo");
  if (_0x44e0d8?.["classList"]?.["contains"]("custom-ai-app-logo--comfyui-cloud")) {
    return "comfyUiCloudWorkflowBadge";
  }
  if (_0x44e0d8?.['classList']?.["contains"]("custom-ai-app-logo--comfyui-local")) {
    return 'comfyUiLocalWorkflowBadge';
  }
  const _0x355ca9 = String(_0x52ca78 || '')["trim"]() || String(_0x47f1c6?.["dataset"]?.["value"] || _0x47f1c6?.['getAttribute']?.("data-value") || '')["trim"]();
  const _0x37fe60 = String(getModelManifest(_0x355ca9)?.["extensions"]?.['imageMenu']?.["iconKind"] || '')['trim']();
  return _0x37fe60;
}
function renderComfyUiWorkflowTriggerIconHTML(_0x52fb9c = '') {
  return renderComfyUiWorkflowLogoHtmlFromIconKind(getComfyUiWorkflowIconKind(_0x52fb9c), {
    'className': "image-model-trigger-icon"
  });
}
function setComfyUiWorkflowTriggerIcon(_0x4f25ae, _0x5cdbe7 = null) {
  const _0x42825e = createImageTriggerIconFromHTML(_0x4f25ae, renderComfyUiWorkflowLogoHtmlFromIconKind(getComfyUiWorkflowIconKind('', _0x5cdbe7), {
    'className': "image-model-trigger-icon"
  }));
  if (!_0x42825e) {
    return;
  }
  replaceImageModelTriggerFirstIcon(_0x4f25ae, _0x42825e);
}
function resolveImageTriggerManifest(_0x59905b = '', _0x319552 = '') {
  const _0xe7cd6d = String(_0x59905b || '')["trim"]();
  if (_0xe7cd6d) {
    const _0x7d4777 = getModelManifest(_0xe7cd6d);
    if (_0x7d4777) {
      return _0x7d4777;
    }
  }
  const _0x2828a7 = String(_0x319552 || '')["trim"]();
  if (!_0xe7cd6d && !_0x2828a7) {
    return null;
  }
  try {
    return resolveModelExecution(_0xe7cd6d, {
      'providerHint': _0x2828a7
    })?.["modelManifest"] || resolveModelExecution(_0xe7cd6d)?.["modelManifest"] || null;
  } catch {
    return null;
  }
}
function renderCustomProviderTriggerBadgeHTML(_0x25376f, _0x50db3a = {}) {
  const _0x524091 = getCustomProviderBadgeText(_0x25376f, _0x50db3a);
  return "<div class=\"image-model-trigger-icon image-model-trigger-badge\">" + escapeHtmlAttr(_0x524091) + '</div>';
}
function setCustomProviderImageModelTriggerIcon(_0x210407, _0x546030, _0x184339 = {}) {
  const _0x48d549 = createImageTriggerIcon(_0x210407, 'div');
  if (!_0x48d549) {
    return;
  }
  _0x48d549["className"] = 'image-model-trigger-icon\x20image-model-trigger-badge';
  _0x48d549["innerText"] = getCustomProviderBadgeText(_0x546030, _0x184339);
  replaceImageModelTriggerFirstIcon(_0x210407, _0x48d549);
}
export function setImageModelTriggerIcon(_0x557eb8, _0x4506c1, _0x105828 = null) {
  const _0x415a34 = String(_0x105828?.['dataset']?.['value'] || '')["trim"]();
  const _0x3b50c7 = resolveImageTriggerManifest(_0x415a34, _0x4506c1);
  const _0x3d33e2 = getImageMenuMeta(_0x3b50c7) || {};
  if (_0x3d33e2["iconKind"] === 'customProviderBadge') {
    setCustomProviderImageModelTriggerIcon(_0x557eb8, _0x3b50c7, _0x3d33e2);
    return;
  }
  if (_0x3d33e2["iconKind"] === "binghuoBadge") {
    setCustomProviderImageModelTriggerIcon(_0x557eb8, _0x3b50c7, _0x3d33e2);
    return;
  }
  if (_0x3d33e2['iconKind'] === "openAiBadge") {
    setOpenAiCliImageModelTriggerIcon(_0x557eb8);
    return;
  }
  const _0x3d78b8 = String(_0x4506c1 || '')["trim"]()["toLowerCase"]();
  if (_0x3d78b8 === "apimart") {
    setApimartImageModelTriggerIcon(_0x557eb8, _0x105828);
    return;
  }
  if (_0x3d78b8 === "agnes") {
    setAgnesImageModelTriggerIcon(_0x557eb8, _0x105828);
    return;
  }
  if (_0x3d78b8 === "binghuo") {
    setCustomProviderImageModelTriggerIcon(_0x557eb8, _0x3b50c7, {
      'badge': 'BH'
    });
    return;
  }
  if (_0x3d78b8 === "aicanvas") {
    setSimpleImageModelTriggerIcon(_0x557eb8, {
      'src': 'images/favicon.svg',
      'alt': "aicanvas",
      'className': 'image-model-trigger-icon-large'
    });
    return;
  }
  if (_0x3d78b8 === "runninghub" || _0x3d78b8 === "runninghubwf") {
    setSimpleImageModelTriggerIcon(_0x557eb8, {
      'src': "images/RH.png",
      'alt': "runninghub",
      'className': 'image-model-trigger-icon-soft'
    });
    return;
  }
  if (_0x3d78b8 === 'comfyui') {
    setComfyUiWorkflowTriggerIcon(_0x557eb8, _0x105828);
    return;
  }
  if (_0x3d78b8 === 'ppio') {
    setSimpleImageModelTriggerIcon(_0x557eb8, {
      'src': "images/gemini.svg",
      'alt': "ppio"
    });
    return;
  }
  if (_0x3d78b8 === "volcengine") {
    setSimpleImageModelTriggerIcon(_0x557eb8, {
      'src': "images/volcengine.svg",
      'alt': "volcengine"
    });
    return;
  }
  setSimpleImageModelTriggerIcon(_0x557eb8, {
    'src': "images/grsai.png",
    'alt': "grsai",
    'className': 'image-model-trigger-icon-padded'
  });
}
export function renderImageModelTriggerIconHTML({
  model = '',
  provider = ''
} = {}) {
  const _0x55acff = String(model || '')["trim"]();
  const _0x2edae7 = resolveImageTriggerManifest(_0x55acff, provider);
  const _0x41fa81 = getImageMenuMeta(_0x2edae7) || {};
  if (_0x41fa81["iconKind"] === "customProviderBadge") {
    return renderCustomProviderTriggerBadgeHTML(_0x2edae7, _0x41fa81);
  }
  if (_0x41fa81["iconKind"] === 'binghuoBadge') {
    return renderCustomProviderTriggerBadgeHTML(_0x2edae7, _0x41fa81);
  }
  if (_0x41fa81['iconKind'] === "openAiBadge") {
    return renderOpenAiLogoHtml("image-model-trigger-icon");
  }
  const _0xe9f332 = String(resolveModelProvider(_0x55acff, provider) || provider || '')["trim"]()["toLowerCase"]();
  if (_0xe9f332 === "apimart") {
    return "<div class=\"image-model-trigger-icon image-model-trigger-badge image-model-trigger-icon-apimart\">AM</div>";
  }
  if (_0xe9f332 === "agnes") {
    return "<div class=\"image-model-trigger-icon image-model-trigger-badge\">AG</div>";
  }
  if (_0xe9f332 === 'binghuo') {
    return '<div\x20class=\x22image-model-trigger-icon\x20image-model-trigger-badge\x22>BH</div>';
  }
  if (_0xe9f332 === "aicanvas" || _0x55acff["startsWith"]("aicanvas/")) {
    return "<img src=\"images/favicon.svg\" class=\"image-model-trigger-icon image-model-trigger-icon-large\" alt=\"aicanvas\">";
  }
  if (_0xe9f332 === 'dreamina') {
    return getDreaminaImageTriggerIconHTML();
  }
  if (_0xe9f332 === "runninghub" || _0xe9f332 === "runninghubwf") {
    return "<img src=\"images/RH.png\" class=\"image-model-trigger-icon image-model-trigger-icon-soft\" alt=\"runninghub\">";
  }
  if (_0xe9f332 === "comfyui") {
    return renderComfyUiWorkflowTriggerIconHTML(_0x55acff);
  }
  if (_0xe9f332 === "ppio") {
    return '<img\x20src=\x22images/gemini.svg\x22\x20class=\x22image-model-trigger-icon\x22\x20alt=\x22ppio\x22>';
  }
  if (_0xe9f332 === "volcengine") {
    return "<img src=\"images/volcengine.svg\" class=\"image-model-trigger-icon\" alt=\"volcengine\">";
  }
  return '<img\x20src=\x22images/grsai.png\x22\x20class=\x22image-model-trigger-icon\x20image-model-trigger-icon-padded\x22\x20alt=\x22grsai\x22>';
}
export function syncImageModelTriggerIcon(_0x59f498, _0x3baf6d = {}) {
  if (!_0x59f498 || !_0x3baf6d?.["model"]) {
    return;
  }
  const _0x154ff1 = createImageTriggerIconFromHTML(_0x59f498, renderImageModelTriggerIconHTML({
    'model': _0x3baf6d['model'],
    'provider': _0x3baf6d["provider"]
  }));
  const _0x56ccdb = _0x59f498['firstElementChild'];
  _0x154ff1 && _0x56ccdb?.['outerHTML'] !== _0x154ff1['outerHTML'] && _0x56ccdb?.['replaceWith']?.(_0x154ff1);
}
export function buildNanoBananaFamilyMenuHTML(_0x5d26a9, _0x1296d5 = '') {
  const _0x29f5e3 = _0x5d26a9?.["provider"] === "grsai" ? _0x5d26a9?.["family"] || '' : '';
  const _0x11ea2e = normalizeGrsaiModelToken(_0x1296d5);
  return getImageModelMenuManifests("grsaiModel")['map'](_0x16958d => {
    const _0x4539af = getImageMenuMeta(_0x16958d) || {};
    if (_0x4539af["role"] === 'directModel') {
      const _0x45a4a8 = _0x16958d["modelId"] || GRSAI_GPT_IMAGE_2_MODEL;
      const _0x1af072 = normalizeGrsaiModelToken(_0x45a4a8);
      const _0x401f77 = isGrsaiGptImage2ModelToken(_0x1af072) ? isGrsaiGptImage2ModelToken(_0x11ea2e) : _0x11ea2e === _0x1af072;
      return renderNodeMenuItem({
        'modelId': _0x45a4a8,
        'provider': "grsai",
        'label': _0x4539af["title"] || _0x16958d["displayName"] || "GPT image 2",
        'description': _0x4539af["subtitle"] || _0x16958d["description"] || '',
        'iconHtml': GRSAI_IMAGE_MENU_ICON_HTML,
        'active': _0x401f77
      });
    }
    const _0x249b89 = String(_0x4539af['family'] || '')['trim']();
    const _0x34be18 = _0x4539af["disabled"] === !![];
    const _0x5e12bc = _0x29f5e3 === _0x249b89;
    return renderNodeMenuItem({
      'provider': "grsai",
      'label': _0x4539af["title"] || _0x16958d['displayName'] || _0x249b89,
      'description': _0x4539af["subtitle"] || '',
      'iconHtml': GRSAI_IMAGE_MENU_ICON_HTML,
      'active': _0x5e12bc,
      'disabled': _0x34be18,
      'credentialModelId': _0x16958d['modelId'] || '',
      'attrs': {
        'data-nb-family': _0x249b89 || undefined
      }
    });
  })["join"]('');
}
export function buildRunningHubNanoBananaFamilyMenuHTML(_0x53cb02, _0x1a6010 = '') {
  const _0x20990c = _0x53cb02?.["provider"] === "runninghub" ? _0x53cb02?.['family'] || '' : '';
  return getImageModelMenuManifests("runninghubModel")["map"](_0x4b272d => {
    const _0x23f85c = getImageMenuMeta(_0x4b272d) || {};
    if (_0x23f85c["role"] === "directModel") {
      return renderNodeMenuItem({
        'modelId': _0x4b272d["modelId"] || '',
        'provider': _0x4b272d['provider'] || "runninghub",
        'label': _0x23f85c["title"] || _0x4b272d["displayName"] || _0x4b272d["modelId"] || '',
        'description': _0x23f85c["subtitle"] || _0x4b272d["description"] || '',
        'iconHtml': renderImageManifestIconHTML(_0x4b272d, _0x23f85c),
        'active': String(_0x1a6010 || '') === _0x4b272d["modelId"],
        'vip': _0x4b272d?.["vip"] === !![],
        'badgeHtml': buildModelProviderProfileBadgesHtml(_0x4b272d, {
          'vip': _0x4b272d?.["vip"] === !![]
        })
      });
    }
    const _0x3a54a6 = String(_0x23f85c["family"] || '')["trim"]();
    return renderNodeMenuItem({
      'provider': "runninghub",
      'label': _0x23f85c['title'] || _0x4b272d["displayName"] || _0x3a54a6,
      'description': _0x23f85c["subtitle"] || _0x4b272d["description"] || '',
      'icon': _0x23f85c['icon'] || _0x4b272d["icon"] || 'images/gemini.svg',
      'iconAlt': _0x23f85c["alt"] || _0x3a54a6,
      'active': _0x20990c === _0x3a54a6,
      'credentialModelId': _0x4b272d["modelId"] || '',
      'badgeHtml': buildModelProviderProfileBadgesHtml(_0x4b272d, {
        'vip': _0x4b272d?.["vip"] === !![]
      }),
      'attrs': {
        'data-nb-family': _0x3a54a6 || undefined
      }
    });
  })['join']('');
}
export function shouldShowNanoBananaModeSelector({
  family: _0x1ec770,
  provider = '',
  isModelApiManifest = ![]
} = {}) {
  if (!isNanoBananaFamily(_0x1ec770)) {
    return ![];
  }
  return String(provider || '')['trim']()["toLowerCase"]() === "runninghub" ? !![] : !isModelApiManifest;
}
export function buildNanoBananaModeMenuHTML(_0x4e31c9, _0x6d77bd, _0x23b0b5 = '') {
  if (!isNanoBananaFamily(_0x4e31c9)) {
    return '';
  }
  const _0x30067b = getNanoBananaModeOptions(_0x4e31c9, _0x23b0b5);
  return _0x30067b['map'](_0x4a9b8e => {
    const _0x5a3b5c = _0x4a9b8e["tooltip"] ? " title=\"" + escapeHtmlAttr(_0x4a9b8e["tooltip"]) + '\x22\x20data-tooltip=\x22' + escapeHtmlAttr(_0x4a9b8e["tooltip"]) + '\x22' : '';
    const _0x17f212 = _0x4a9b8e["mode"] === _0x6d77bd;
    return '<div\x20class=\x22floating-menu-item\x20' + (_0x17f212 ? "active" : '') + "\" data-nb-mode=\"" + _0x4a9b8e["mode"] + '\x22' + _0x5a3b5c + "><span class=\"floating-menu-label\">" + _0x4a9b8e["label"] + "</span></div>";
  })["join"]('');
}
export function buildQwenImageEditModeMenuHTML(_0x38b360) {
  const _0x12278a = normalizeQwenImageEditMode(_0x38b360);
  const _0x387f41 = getQwenUiFieldOptions("rhQwenEditMode");
  const _0x256d4f = _0x387f41["length"] ? _0x387f41 : [{
    'value': "qwen2511",
    'label': '2511'
  }, {
    'value': "qwen2509",
    'label': "2509"
  }];
  return _0x256d4f['map'](_0x384ee9 => {
    const _0x56f828 = escapeHtmlAttr(getQwenImageEditModeTooltip(_0x384ee9["value"]));
    return "<div class=\"floating-menu-item " + (_0x12278a === _0x384ee9['value'] ? 'active' : '') + "\" data-qwen-mode=\"" + _0x384ee9["value"] + "\" title=\"" + _0x56f828 + "\" data-tooltip=\"" + _0x56f828 + '\x22><span\x20class=\x22floating-menu-label\x22>' + _0x384ee9["label"] + "</span></div>";
  })["join"]('');
}
export function buildQwenImageEditModelMenuItemHTML(_0x1aca15) {
  return buildManifestModelMenuItemHTML(QWEN_IMAGE_EDIT_MODEL_ID, _0x1aca15, {
    'title': t('aigenImage.modelMenu.qwenEdit.title'),
    'description': t("aigenImage.modelMenu.qwenEdit.description")
  });
}
export function buildAnimeRealModelMenuItemHTML(_0x468b0e) {
  return buildManifestModelMenuItemHTML(ANIME_REAL_MODEL_ID, _0x468b0e, {
    'title': t("aigenImage.modelMenu.animeReal.title"),
    'description': t("aigenImage.modelMenu.animeReal.description")
  });
}
export function buildPersonReplaceV21ModelMenuItemHTML(_0x1f02fe) {
  return buildManifestModelMenuItemHTML(PERSON_REPLACE_V21_MODEL_ID, _0x1f02fe, {
    'title': t("aigenImage.modelMenu.personReplaceV21.title"),
    'description': t("aigenImage.modelMenu.personReplaceV21.description")
  });
}
export function buildPersonReplaceV3ModelMenuItemHTML(_0x35155c) {
  return buildManifestModelMenuItemHTML(PERSON_REPLACE_V3_MODEL_ID, _0x35155c, {
    'title': t("aigenImage.modelMenu.personReplaceV3.title"),
    'description': t("aigenImage.modelMenu.personReplaceV3.description")
  });
}
function buildManifestModelMenuItemHTML(_0x235b93, _0x111f21, _0x4029ee = {}) {
  const _0x451835 = getModelManifest(_0x235b93);
  const _0x388863 = _0x451835?.["modelId"] || _0x235b93;
  const _0x2ebdab = _0x451835?.["provider"] || "runninghubwf";
  const _0x3cf202 = _0x451835?.["icon"] || 'images/RH.png';
  const _0x1937f2 = _0x451835?.['displayName'] || _0x4029ee["title"] || _0x388863;
  const _0x1537ee = _0x451835?.['description'] || _0x4029ee["description"] || '';
  const _0x3a9562 = _0x451835?.["vip"] === !![] || _0x4029ee['vip'] === !![];
  const _0x3a19c1 = getModelManifest(_0x111f21);
  const _0x3310d1 = _0x111f21 === _0x235b93 || _0x111f21 === _0x388863 || _0x3a19c1?.['modelId'] === _0x388863;
  return renderNodeMenuItem({
    'modelId': _0x388863,
    'provider': _0x2ebdab,
    'label': _0x1937f2,
    'description': _0x1537ee,
    'icon': _0x3cf202,
    'iconAlt': "runninghub",
    'vip': _0x3a9562,
    'active': _0x3310d1
  }, {
    'activeModel': _0x111f21
  });
}
export function buildQwenFirstImageModeControlsHTML(_0x248238) {
  const _0x470cf3 = normalizeQwenFirstImageMode(_0x248238);
  return getQwenFirstImageModeOptions()["map"](_0x99ca14 => {
    const _0x4dff1f = normalizeQwenFirstImageMode(_0x99ca14['value']);
    return "<button type=\"button\" class=\"img-rp-quality-item qwen-first-image-mode-opt " + (_0x470cf3 === _0x4dff1f ? 'active' : '') + "\" data-value=\"" + escapeHtmlAttr(_0x4dff1f) + '\x22>' + escapeHtmlAttr(_0x99ca14["label"]) + "</button>";
  })["join"]('');
}