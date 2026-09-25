import { IMAGE_MODELS, getModelDisplayName, getModelProvider } from '../config/modelConfig.js';
import { positionAnchoredSubmenu } from '../utils/submenuPosition.js';
import { bindToolbarUpMenus, renderToolbarUpMenu } from './imageToolbarUpMenu.js';
import { NANO_BANANA_FAMILIES, getDefaultModeForNanoBananaFamily, getNanoBananaModeLabel, getNanoBananaModeOptions, getNanoBananaSelectionFromModel, isNanoBananaFamily, resolveNanoBananaModelBySelection } from './nanoBananaModeRules.js';
import { CONTROL_CAMERA_MODEL_ID, getModelManifest, getModelsByKind } from '../manifests/index.js';
import { t } from '../i18n/index.js';
import { translateManifestText } from '../i18n/manifestText.js';
import { renderOpenAiLogoHtml } from '../components/shared/openAiLogo.js';
const IMAGE_FUNCTION_PROVIDER_META = Object["freeze"]({
  'grsai': Object["freeze"]({
    'name': "GRSAI",
    'icon': "images/grsai.png",
    get 'description'() {
      return t("imageFunctionMenu.providers.grsai.description");
    }
  }),
  'apimart': Object['freeze']({
    'name': "APIMart",
    'icon': 'AM',
    get 'description'() {
      return t("imageFunctionMenu.providers.apimart.description");
    },
    'isTextIcon': !![],
    'modelIconStrategy': "provider"
  }),
  'runninghub': Object["freeze"]({
    get 'name'() {
      return t("imageFunctionMenu.providers.runninghub.name");
    },
    'icon': "images/RH.png",
    get 'description'() {
      return t("imageFunctionMenu.providers.runninghub.description");
    },
    'modelIconStrategy': "provider"
  }),
  'openai-cli': Object["freeze"]({
    'name': "OpenAI CLI",
    'iconHtml': renderOpenAiLogoHtml("node-menu-icon"),
    get 'description'() {
      return translateManifestText('使用本机已登录的\x20OpenAI\x20CLI\x20账号');
    },
    'modelIconStrategy': "provider"
  })
});
const IMAGE_FUNCTION_MENU_PROVIDER_BY_GROUP = Object["freeze"]({
  'grsaiModel': 'grsai',
  'apimart': "apimart",
  'runninghubModel': "runninghub"
});
const DEFAULT_IMAGE_FUNCTION_PROVIDER = "runninghub";
const DEFAULT_FREE_ANGLE_PROVIDER = "runninghubwf";
const DEFAULT_FREE_ANGLE_MODEL = CONTROL_CAMERA_MODEL_ID;
const FREE_ANGLE_ONLY_MODEL_IDS = Object["freeze"]([CONTROL_CAMERA_MODEL_ID]);
const IMAGE_FUNCTION_ALLOWED_FAMILIES = Object['freeze'](new Set([NANO_BANANA_FAMILIES["NANOBANANA_2"], NANO_BANANA_FAMILIES["NANOBANANA_PRO"], NANO_BANANA_FAMILIES["GPT_IMAGE_2"]]));
export function isImageFreeAngleOnlyModel(_0x26614d) {
  const _0x47b809 = String(_0x26614d || '')["trim"]();
  return FREE_ANGLE_ONLY_MODEL_IDS["includes"](_0x47b809);
}
const escapeHtmlAttr = _0x4c4bec => String(_0x4c4bec || '')["replace"](/&/g, "&amp;")["replace"](/"/g, "&quot;")["replace"](/</g, "&lt;")['replace'](/>/g, '&gt;');
const escapeHtmlText = _0x2ab40a => String(_0x2ab40a || '')["replace"](/&/g, "&amp;")["replace"](/</g, '&lt;')['replace'](/>/g, "&gt;");
const canShowDevOnlyModels = () => typeof window !== "undefined" && window["DEV_MODE"] === !![];
function buildImageFunctionModelFromManifest(_0xbacf1d) {
  if (!_0xbacf1d) {
    return null;
  }
  const _0x1a223c = _0xbacf1d["extensions"]?.["imageMenu"] || {};
  const _0x3918b3 = _0x1a223c["icon"] || _0xbacf1d["icon"] || "images/RH.png";
  return {
    'id': _0xbacf1d['modelId'],
    'family': _0x1a223c["family"] || '',
    'name': _0x1a223c["title"] || _0xbacf1d["displayName"] || _0xbacf1d["modelId"],
    'description': _0x1a223c['subtitle'] || _0xbacf1d["description"] || '',
    'icon': _0x3918b3,
    'isTextIcon': _0x1a223c["isTextIcon"] === !![] || !/\.(?:png|svg|jpg|jpeg|webp)$/i["test"](String(_0x3918b3 || ''))
  };
}
function getImageFunctionFamily(_0x539e12) {
  return String(_0x539e12?.["extensions"]?.['imageFunctionMenu']?.["family"] || _0x539e12?.["extensions"]?.["nanoBanana"]?.["family"] || '')["trim"]();
}
function isAllowedImageFunctionManifest(_0x1a0d73) {
  return _0x1a0d73?.["extensions"]?.["imageFunctionMenu"]?.["enabled"] === !![] || IMAGE_FUNCTION_ALLOWED_FAMILIES["has"](getImageFunctionFamily(_0x1a0d73));
}
function isAllowedImageFunctionModel(_0x332e14) {
  return isAllowedImageFunctionManifest(getModelManifest(_0x332e14));
}
function hasManifestModeField(_0x44e0e9) {
  const _0x492bf0 = getModelManifest(_0x44e0e9)?.["uiSchema"]?.["fields"];
  return Array['isArray'](_0x492bf0) && _0x492bf0['some'](_0x4710e6 => _0x4710e6?.['id'] === "mode");
}
function buildImageGenerationNodeCatalog() {
  const _0x14d800 = {};
  getModelsByKind("image")["map"](_0x51f7d3 => ({
    'manifest': _0x51f7d3,
    'imageMenu': _0x51f7d3?.["extensions"]?.["imageMenu"] || null
  }))["filter"](({
    manifest: _0x53d677,
    imageMenu: _0x23c092
  }) => _0x23c092?.["group"] && isAllowedImageFunctionManifest(_0x53d677))['sort']((_0x5a39a1, _0x5b7a2d) => {
    const _0x1d943e = Number(_0x5a39a1["imageMenu"]?.["order"] ?? 0x3e7);
    const _0x390380 = Number(_0x5b7a2d['imageMenu']?.['order'] ?? 0x3e7);
    return _0x1d943e - _0x390380;
  })["forEach"](({
    manifest: _0x169827,
    imageMenu: _0xa0438
  }) => {
    const _0x2973f6 = IMAGE_FUNCTION_MENU_PROVIDER_BY_GROUP[_0xa0438["group"]] || _0x169827['provider'];
    const _0xf89af1 = IMAGE_FUNCTION_PROVIDER_META[_0x2973f6];
    if (!_0xf89af1) {
      return;
    }
    !_0x14d800[_0x2973f6] && (_0x14d800[_0x2973f6] = {
      ..._0xf89af1,
      'models': []
    });
    const _0x14cdcc = buildImageFunctionModelFromManifest(_0x169827);
    if (_0x14cdcc) {
      _0x14d800[_0x2973f6]['models']["push"](_0x14cdcc);
    }
  });
  return _0x14d800;
}
function buildFreeAngleOnlyProvider() {
  const _0x12a684 = FREE_ANGLE_ONLY_MODEL_IDS["map"](_0xb8c691 => buildImageFunctionModelFromManifest(getModelManifest(_0xb8c691)))['filter'](Boolean);
  return {
    'name': t("imageFunctionMenu.providers.runninghubWorkflow.name"),
    'icon': "images/RH.png",
    'description': t("imageFunctionMenu.providers.runninghubWorkflow.description"),
    'models': _0x12a684
  };
}
export function buildImageFreeAngleModelCatalog() {
  const _0x4e0f77 = buildImageGenerationNodeCatalog();
  const _0x542fdc = buildFreeAngleOnlyProvider();
  _0x542fdc['models']["length"] > 0x0 && (_0x4e0f77["runninghubwf"] = _0x542fdc);
  return _0x4e0f77;
}
export function getDefaultImageFreeAngleModelState(_0x252844 = buildImageFreeAngleModelCatalog()) {
  const _0x505268 = _0x252844?.[DEFAULT_FREE_ANGLE_PROVIDER]?.["models"]?.['find'](_0x3a3a82 => _0x3a3a82?.['id'] === DEFAULT_FREE_ANGLE_MODEL);
  if (_0x505268) {
    return {
      'provider': DEFAULT_FREE_ANGLE_PROVIDER,
      'model': _0x505268['id']
    };
  }
  return getDefaultImageFunctionModelState(_0x252844);
}
function buildRawImageModelCatalog(_0x5c279a = IMAGE_MODELS) {
  const _0x5d869a = {};
  Object['entries'](_0x5c279a || {})["forEach"](([_0x1335ba, _0x25e893]) => {
    if (_0x25e893?.["devOnly"] && !canShowDevOnlyModels()) {
      return;
    }
    const _0x2394b3 = Array["isArray"](_0x25e893?.['models']) ? _0x25e893["models"] : [];
    const _0x2e7c20 = _0x2394b3["filter"](_0x35dcdb => {
      if (!_0x35dcdb || typeof _0x35dcdb !== "object") {
        return ![];
      }
      return _0x35dcdb["disabled"] !== !![];
    });
    if (_0x2e7c20["length"] === 0x0) {
      return;
    }
    _0x5d869a[_0x1335ba] = {
      ..._0x25e893,
      'models': _0x2e7c20
    };
  });
  return _0x5d869a;
}
export function buildImageFunctionModelCatalog(_0x200c79 = IMAGE_MODELS) {
  if (_0x200c79 === IMAGE_MODELS) {
    return buildImageGenerationNodeCatalog();
  }
  return buildRawImageModelCatalog(_0x200c79);
}
export function findImageFunctionProviderByModel(_0x5eaa2b, _0x2d3e6e) {
  const _0x485a24 = String(_0x2d3e6e || '')["trim"]();
  if (!_0x485a24) {
    return null;
  }
  for (const [_0x2f8358, _0x262090] of Object["entries"](_0x5eaa2b || {})) {
    const _0x30d11e = Array["isArray"](_0x262090?.["models"]) ? _0x262090["models"] : [];
    if (_0x30d11e['some'](_0x15a042 => _0x15a042?.['id'] === _0x485a24)) {
      return _0x2f8358;
    }
  }
  const _0x278b79 = getModelProvider(_0x485a24);
  return _0x5eaa2b?.[_0x278b79] && isAllowedImageFunctionModel(_0x485a24) ? _0x278b79 : null;
}
export function getDefaultImageFunctionModelState(_0xe52e6d = buildImageFunctionModelCatalog()) {
  const _0x1f0905 = _0xe52e6d?.[DEFAULT_IMAGE_FUNCTION_PROVIDER]?.["models"]?.['find'](_0xceaf76 => _0xceaf76?.["family"] === "nanobanana-pro")?.['id'] || '';
  const _0x97c987 = _0xe52e6d?.[DEFAULT_IMAGE_FUNCTION_PROVIDER]?.["models"]?.['find'](_0x4b39c3 => _0x4b39c3?.['id'] === _0x1f0905);
  if (_0x97c987) {
    return {
      'provider': DEFAULT_IMAGE_FUNCTION_PROVIDER,
      'model': _0x97c987['id']
    };
  }
  const _0xa54740 = Object["keys"](_0xe52e6d || {});
  const _0x2063d7 = _0xa54740[0x0] || Object["keys"](IMAGE_MODELS)[0x0] || '';
  const _0x1b739e = _0xe52e6d?.[_0x2063d7]?.["models"]?.[0x0];
  return {
    'provider': _0x2063d7 || null,
    'model': _0x1b739e?.['id'] || null
  };
}
export function getImageFunctionModelDisplayName(_0x1394f3, _0x2f259f = buildImageFunctionModelCatalog()) {
  const _0x53bfe2 = String(_0x1394f3 || '')["trim"]();
  if (!_0x53bfe2) {
    return '';
  }
  for (const _0x15d481 of Object["values"](_0x2f259f || {})) {
    const _0x3614bd = Array["isArray"](_0x15d481?.["models"]) ? _0x15d481["models"] : [];
    const _0x23d40f = _0x3614bd["find"](_0x4770a9 => _0x4770a9?.['id'] === _0x53bfe2);
    if (_0x23d40f) {
      return _0x23d40f['name'] || _0x23d40f['id'] || _0x53bfe2;
    }
  }
  return getModelDisplayName(_0x53bfe2);
}
export function getImageFunctionNanoSelection(_0x4c0528, _0x33464b = '', _0x458a22 = '2K') {
  const _0x5caf39 = getNanoBananaSelectionFromModel(_0x4c0528, _0x458a22, _0x33464b);
  if (!_0x5caf39 || !isNanoBananaFamily(_0x5caf39["family"])) {
    return null;
  }
  if (_0x5caf39["family"] === 'gpt-image-2') {
    return null;
  }
  const _0x2422d9 = String(_0x33464b || '')["trim"]()["toLowerCase"]();
  const _0x33957b = String(_0x5caf39['provider'] || '')["trim"]()['toLowerCase']();
  if (_0x2422d9 && _0x33957b !== _0x2422d9) {
    return null;
  }
  if (_0x33957b === "grsai" && !hasManifestModeField(_0x5caf39["rawModel"])) {
    return null;
  }
  return _0x5caf39;
}
export function resolveImageFunctionModelFromMenuItem({
  model: _0x2396e7,
  provider: _0x1a27dd,
  family: _0x5ac087,
  imageSize = '2K'
} = {}) {
  const _0x5083ce = String(_0x1a27dd || '')['trim']();
  const _0x4e1d35 = String(_0x5ac087 || '')["trim"]();
  if (_0x4e1d35 && isNanoBananaFamily(_0x4e1d35)) {
    const _0x1197a2 = getDefaultModeForNanoBananaFamily(_0x4e1d35, _0x5083ce);
    return {
      'model': resolveNanoBananaModelBySelection({
        'family': _0x4e1d35,
        'mode': _0x1197a2,
        'imageSize': imageSize,
        'provider': _0x5083ce
      }),
      'provider': _0x5083ce,
      'family': _0x4e1d35,
      'mode': _0x1197a2
    };
  }
  return {
    'model': String(_0x2396e7 || '')['trim'](),
    'provider': _0x5083ce,
    'family': '',
    'mode': ''
  };
}
export function resolveImageFunctionModelByMode({
  model: _0x175bc6,
  provider: _0x33cee0,
  imageSize = '2K',
  mode: _0xd52d9a
} = {}) {
  const _0x2253aa = getImageFunctionNanoSelection(_0x175bc6, _0x33cee0, imageSize);
  if (!_0x2253aa) {
    return null;
  }
  const _0x218529 = String(_0xd52d9a || '')["trim"]();
  if (!_0x218529) {
    return null;
  }
  return {
    'model': resolveNanoBananaModelBySelection({
      'family': _0x2253aa["family"],
      'mode': _0x218529,
      'imageSize': imageSize,
      'provider': _0x2253aa["provider"]
    }),
    'provider': _0x2253aa["provider"],
    'family': _0x2253aa["family"],
    'mode': _0x218529
  };
}
export function buildImageFunctionModeMenuHTML({
  model = '',
  provider = '',
  imageSize = '2K'
} = {}) {
  const _0x3b6b51 = getImageFunctionNanoSelection(model, provider, imageSize);
  if (!_0x3b6b51) {
    return '';
  }
  return renderToolbarUpMenu({
    'fieldId': "mode",
    'value': _0x3b6b51["mode"],
    'menuTitle': translateManifestText('模式选择'),
    'options': getNanoBananaModeOptions(_0x3b6b51["family"], _0x3b6b51['provider'])['map'](_0x4cb9ff => ({
      'value': _0x4cb9ff["mode"],
      'label': _0x4cb9ff["label"],
      'tooltip': _0x4cb9ff["tooltip"]
    })),
    'itemClass': '',
    'itemsOnly': !![],
    'itemValueAttrs': ["data-nb-mode"]
  });
}
export function getImageFunctionModeLabel({
  model = '',
  provider = '',
  imageSize = '2K'
} = {}) {
  const _0x447927 = getImageFunctionNanoSelection(model, provider, imageSize);
  if (!_0x447927) {
    return t("imageFunctionMenu.modes.normal");
  }
  return getNanoBananaModeLabel(_0x447927['family'], _0x447927["mode"], _0x447927["provider"]);
}
export function isImageFunctionModeVisible({
  model = '',
  provider = '',
  imageSize = '2K'
} = {}) {
  return !!getImageFunctionNanoSelection(model, provider, imageSize);
}
export function buildImageFunctionModeControlHTML({
  model = '',
  provider = '',
  imageSize = '2K',
  wrapClass = "v2-expand-wrap",
  buttonClass = "v2-expand-toolbar-btn"
} = {}) {
  const _0x456271 = isImageFunctionModeVisible({
    'model': model,
    'provider': provider,
    'imageSize': imageSize
  });
  const _0x5f1faf = getImageFunctionModeLabel({
    'model': model,
    'provider': provider,
    'imageSize': imageSize
  });
  const _0x5d90fd = getImageFunctionNanoSelection(model, provider, imageSize);
  return "\n    " + renderToolbarUpMenu({
    'fieldId': "mode",
    'value': _0x5d90fd?.["mode"] || '',
    'menuTitle': translateManifestText("模式选择"),
    'options': _0x5d90fd ? getNanoBananaModeOptions(_0x5d90fd['family'], _0x5d90fd["provider"])['map'](_0x569a54 => ({
      'value': _0x569a54["mode"],
      'label': _0x569a54['label'],
      'tooltip': _0x569a54["tooltip"]
    })) : [],
    'wrapClass': wrapClass + " image-function-mode-wrap " + (_0x456271 ? '' : 'is-hidden'),
    'buttonClass': buttonClass + " image-function-mode-toggle",
    'labelClass': "image-function-mode-label",
    'menuClass': "nb-mode-menu image-function-mode-menu",
    'openClass': "show",
    'selectedLabel': _0x5f1faf,
    'itemClass': '',
    'itemValueAttrs': ["data-nb-mode"]
  });
}
export function syncImageFunctionModeControl({
  root: _0x3914ef,
  model: _0x356b96,
  provider = '',
  imageSize = '2K'
} = {}) {
  if (!_0x3914ef) {
    return null;
  }
  const _0x3be7a6 = _0x3914ef["querySelector"](".image-function-mode-wrap");
  const _0x1f1804 = _0x3914ef["querySelector"](".image-function-mode-label");
  const _0x110557 = _0x3914ef["querySelector"]('.image-function-mode-menu');
  const _0x5b4119 = isImageFunctionModeVisible({
    'model': _0x356b96,
    'provider': provider,
    'imageSize': imageSize
  });
  _0x3be7a6?.["classList"]["toggle"]("is-hidden", !_0x5b4119);
  _0x1f1804 && (_0x1f1804["textContent"] = getImageFunctionModeLabel({
    'model': _0x356b96,
    'provider': provider,
    'imageSize': imageSize
  }));
  if (_0x110557) {
    _0x110557["innerHTML"] = buildImageFunctionModeMenuHTML({
      'model': _0x356b96,
      'provider': provider,
      'imageSize': imageSize
    });
    if (!_0x5b4119) {
      _0x110557["classList"]["remove"]("show");
    }
  }
  return getImageFunctionNanoSelection(_0x356b96, provider, imageSize);
}
export function bindImageFunctionModeMenu({
  modeMenu: _0x2acf83,
  onSelect: _0x590361
} = {}) {
  if (!_0x2acf83 || typeof _0x590361 !== "function") {
    return () => {};
  }
  return bindToolbarUpMenus(_0x2acf83, {
    'onSelect': ({
      value: _0x28a828,
      item: _0x527e14
    }) => {
      const _0x36101f = String(_0x28a828 || _0x527e14?.["dataset"]?.['nbMode'] || '')["trim"]();
      if (!_0x36101f) {
        return;
      }
      _0x590361({
        'mode': _0x36101f,
        'item': _0x527e14
      });
    }
  });
}
function getProviderIconHtml(_0x1c3b97, _0x24d209, _0x4862ca = '') {
  if (_0x1c3b97?.["iconHtml"]) {
    return _0x1c3b97["iconHtml"];
  }
  if (_0x1c3b97?.["isTextIcon"]) {
    return "<span class=\"image-function-model-icon image-function-model-icon-text " + escapeHtmlAttr(_0x4862ca) + '\x22>' + escapeHtmlText(_0x1c3b97["icon"]) + '</span>';
  }
  const _0x1edbfd = _0x1c3b97?.["icon"] || '';
  if (!_0x1edbfd) {
    return '';
  }
  return "<img class=\"image-function-model-icon " + escapeHtmlAttr(_0x4862ca) + "\" src=\"" + escapeHtmlAttr(_0x1edbfd) + "\" alt=\"" + escapeHtmlAttr(_0x24d209) + '\x22>';
}
function getModelIconHtml(_0x19bdf6, _0x38d45c, _0x4e0233, _0x5c6122 = '') {
  if (_0x38d45c?.["modelIconStrategy"] === "provider") {
    return getProviderIconHtml(_0x38d45c, _0x4e0233, _0x5c6122);
  }
  const _0x39db0a = _0x19bdf6?.['icon'] || _0x38d45c?.["icon"] || '';
  if (_0x19bdf6?.["isTextIcon"]) {
    return "<span class=\"image-function-model-icon image-function-model-icon-text " + escapeHtmlAttr(_0x5c6122) + '\x22>' + escapeHtmlText(_0x19bdf6['icon'] || _0x19bdf6["name"] || _0x38d45c?.["icon"] || '') + "</span>";
  }
  if (_0x38d45c?.["isTextIcon"] && !_0x39db0a) {
    return '<span\x20class=\x22image-function-model-icon\x20image-function-model-icon-text\x20' + escapeHtmlAttr(_0x5c6122) + '\x22>' + escapeHtmlText(_0x38d45c["icon"]) + "</span>";
  }
  if (!_0x39db0a) {
    return '';
  }
  return "<img class=\"image-function-model-icon " + escapeHtmlAttr(_0x5c6122) + '\x22\x20src=\x22' + escapeHtmlAttr(_0x39db0a) + "\" alt=\"" + escapeHtmlAttr(_0x4e0233) + '\x22>';
}
export function getImageFunctionModelTriggerIconHTML(_0x121a65, _0x583dae = '', _0x1b2b61 = buildImageFunctionModelCatalog()) {
  const _0x2218bc = _0x1b2b61;
  const _0x44eb22 = _0x583dae || findImageFunctionProviderByModel(_0x2218bc, _0x121a65) || "grsai";
  const _0xd78f38 = _0x2218bc[_0x44eb22] || _0x2218bc["grsai"];
  return getProviderIconHtml(_0xd78f38, _0x44eb22, "image-function-model-trigger-icon");
}
export function buildImageFunctionModelMenuHTML({
  activeModel = '',
  activeProvider = '',
  modelCatalog = buildImageFunctionModelCatalog()
} = {}) {
  const _0x2ab32b = String(activeModel || '')["trim"]();
  const _0x5583c9 = String(activeProvider || '')["trim"]();
  return Object["entries"](modelCatalog || {})["map"](([_0xb49ced, _0x2231ed]) => {
    const _0x1065cf = _0x2231ed?.['devOnly'] === !![];
    if (_0x1065cf) {
      return '';
    }
    const _0x15e931 = _0x2231ed?.["disabled"] === !![];
    const _0x18a944 = getProviderIconHtml(_0x2231ed, _0xb49ced);
    const _0xafaccc = (_0x2231ed["models"] || [])["map"](_0x3a0a87 => {
      const _0x26f823 = _0x15e931 || _0x3a0a87?.["disabled"] === !![];
      const _0x2a356e = _0x2ab32b === _0x3a0a87['id'] || _0x3a0a87['family'] && getImageFunctionNanoSelection(_0x2ab32b, _0xb49ced)?.["family"] === _0x3a0a87["family"] || !_0x2ab32b && _0x5583c9 && _0x5583c9 === _0xb49ced;
      return "\n            <div class=\"floating-menu-item " + (_0x2a356e ? "active" : '') + "\" data-value=\"" + escapeHtmlAttr(_0x3a0a87['id']) + "\" data-provider=\"" + escapeHtmlAttr(_0xb49ced) + '\x22\x20' + (_0x3a0a87["family"] ? "data-image-function-family=\"" + escapeHtmlAttr(_0x3a0a87["family"]) + '\x22' : '') + '\x20' + (_0x26f823 ? "data-disabled=\"true\"" : '') + ">\n              " + getModelIconHtml(_0x3a0a87, _0x2231ed, _0xb49ced) + "\n              <div class=\"fmi-content\">\n                <div class=\"fmi-title\">" + escapeHtmlText(_0x3a0a87["name"] || _0x3a0a87['id']) + "</div>\n                <div class=\"fmi-sub\">" + escapeHtmlText(_0x3a0a87['description'] || _0x2231ed["description"] || '') + "</div>\n              </div>\n              " + (_0x26f823 ? '<span\x20class=\x22floating-menu-badge\x20floating-menu-badge-danger\x22>不可用</span>' : '') + "\n            </div>";
    })["join"]('');
    return "\n        <div class=\"" + escapeHtmlAttr(_0xb49ced) + '-group-header\x20floating-menu-item\x22\x20data-image-function-provider=\x22' + escapeHtmlAttr(_0xb49ced) + "\" data-" + escapeHtmlAttr(_0xb49ced) + "-toggle>\n          " + _0x18a944 + "\n          <div class=\"fmi-content\">\n            <div class=\"fmi-title\">" + escapeHtmlText(_0x2231ed['name'] || _0xb49ced) + "</div>\n            <div class=\"fmi-sub\">" + escapeHtmlText(_0x2231ed["description"] || '') + "</div>\n          </div>\n          " + (_0x15e931 ? "<span class=\"floating-menu-badge floating-menu-badge-danger floating-menu-badge-inline\">不可用</span>" : '') + "\n          <svg class=\"image-function-model-chevron\" width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" aria-hidden=\"true\"><polyline points=\"9 18 15 12 9 6\"></polyline></svg>\n        </div>\n        <div class=\"" + escapeHtmlAttr(_0xb49ced) + "-submenu image-function-model-submenu\">\n          " + _0xafaccc + "\n        </div>";
  })["join"]('');
}
export function syncImageFunctionModelMenuActive({
  modelMenu: _0x5947d6,
  model: _0xa285f3,
  provider = ''
} = {}) {
  if (!_0x5947d6) {
    return;
  }
  const _0x287b90 = String(_0xa285f3 || '')["trim"]();
  const _0xfd6828 = String(provider || '')["trim"]();
  const _0x2522be = getImageFunctionNanoSelection(_0x287b90, _0xfd6828);
  _0x5947d6['querySelectorAll'](".floating-menu-item")["forEach"](_0x19b434 => {
    if (!_0x19b434["dataset"]['value']) {
      _0x19b434["classList"]['remove']('active');
      return;
    }
    const _0x50977c = String(_0x19b434["dataset"]['imageFunctionFamily'] || '')["trim"]();
    const _0x37d6aa = _0x19b434["dataset"]['value'] === _0x287b90 || !!_0x50977c && _0x2522be?.["provider"] === _0x19b434['dataset']["provider"] && _0x2522be?.["family"] === _0x50977c || !_0x287b90 && _0xfd6828 && _0x19b434["dataset"]['provider'] === _0xfd6828;
    _0x19b434["classList"]["toggle"]("active", _0x37d6aa);
  });
}
export function closeImageFunctionModelSubmenus(_0x5ca20f) {
  _0x5ca20f?.["querySelectorAll"]('.image-function-model-submenu')["forEach"](_0xb40764 => {
    _0xb40764['style']["display"] = "none";
  });
}
export function bindImageFunctionModelMenu({
  modelMenu: _0x1dd039,
  onSelect: _0x8a7db0,
  closeMenu: _0x2d3a6a,
  onOpenSubmenu: _0xc41d48
} = {}) {
  if (!_0x1dd039 || typeof _0x8a7db0 !== 'function') {
    return () => {};
  }
  const _0x5ae03f = [];
  let _0x5640c3 = 0x0;
  const _0x2fd63b = () => {
    if (_0x5640c3) {
      clearTimeout(_0x5640c3);
    }
    _0x5640c3 = 0x0;
  };
  const _0x448243 = (_0x2b9c83, _0x7985f3 = 0x78) => {
    _0x2fd63b();
    _0x5640c3 = setTimeout(() => {
      _0x2b9c83['style']["display"] = "none";
      _0x5640c3 = 0x0;
    }, _0x7985f3);
  };
  _0x1dd039['querySelectorAll']("[data-image-function-provider]")['forEach'](_0x448567 => {
    const _0xd0f91e = _0x448567['dataset']["imageFunctionProvider"];
    const _0x59dff2 = _0x1dd039["querySelector"]('.' + _0xd0f91e + "-submenu");
    if (!_0x59dff2) {
      return;
    }
    const _0x14d82e = () => {
      _0x2fd63b();
      closeImageFunctionModelSubmenus(_0x1dd039);
      _0x59dff2["style"]["display"] = "flex";
      const _0x209daa = _0x448567["getBoundingClientRect"]?.();
      const _0x41cada = _0x1dd039["getBoundingClientRect"]?.();
      _0x209daa && _0x41cada && positionAnchoredSubmenu({
        'submenu': _0x59dff2,
        'anchorRect': _0x209daa,
        'horizontalAnchorRect': _0x41cada,
        'containerRect': _0x41cada,
        'preferredSide': "right",
        'position': "absolute"
      });
      _0xc41d48?.({
        'header': _0x448567,
        'submenu': _0x59dff2,
        'providerKey': _0xd0f91e
      });
    };
    const _0x132236 = () => _0x448243(_0x59dff2);
    _0x448567["addEventListener"]("mouseenter", _0x14d82e);
    _0x448567["addEventListener"]('mouseleave', _0x132236);
    _0x59dff2["addEventListener"]("mouseenter", _0x14d82e);
    _0x59dff2['addEventListener']("mouseleave", _0x132236);
    _0x5ae03f['push'](() => {
      _0x448567["removeEventListener"]("mouseenter", _0x14d82e);
      _0x448567["removeEventListener"]("mouseleave", _0x132236);
      _0x59dff2['removeEventListener']("mouseenter", _0x14d82e);
      _0x59dff2["removeEventListener"]('mouseleave', _0x132236);
    });
  });
  const _0x38ea6c = _0x3ed4a4 => {
    const _0x32a73d = _0x3ed4a4['target']["closest"](".floating-menu-item[data-value]");
    if (!_0x32a73d || !_0x1dd039['contains'](_0x32a73d)) {
      return;
    }
    _0x3ed4a4["stopPropagation"]();
    if (_0x32a73d["dataset"]["disabled"] === "true") {
      return;
    }
    const _0x507859 = String(_0x32a73d["dataset"]["value"] || '')['trim']();
    const _0x2148a0 = String(_0x32a73d["dataset"]['provider'] || getModelProvider(_0x507859) || '')["trim"]();
    const _0x3ed0d1 = resolveImageFunctionModelFromMenuItem({
      'model': _0x507859,
      'provider': _0x2148a0,
      'family': _0x32a73d["dataset"]["imageFunctionFamily"]
    });
    if (!_0x3ed0d1["model"] || !_0x3ed0d1['provider']) {
      return;
    }
    _0x8a7db0({
      ..._0x3ed0d1,
      'item': _0x32a73d
    });
    syncImageFunctionModelMenuActive({
      'modelMenu': _0x1dd039,
      'model': _0x3ed0d1["model"],
      'provider': _0x3ed0d1["provider"]
    });
    closeImageFunctionModelSubmenus(_0x1dd039);
    _0x2d3a6a?.();
  };
  _0x1dd039["addEventListener"]('click', _0x38ea6c);
  _0x5ae03f["push"](() => _0x1dd039["removeEventListener"]("click", _0x38ea6c));
  return () => {
    _0x2fd63b();
    _0x5ae03f["forEach"](_0x4bfda4 => _0x4bfda4());
  };
}
export { getModelDisplayName };