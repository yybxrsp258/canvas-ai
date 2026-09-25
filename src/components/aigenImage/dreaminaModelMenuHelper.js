import { getModelManifest, getModelsByKind, resolveModelExecution } from '../../manifests/index.js';
import { renderNodeMenuGroup, renderNodeMenuItem } from '../shared/nodeModelMenu.js';
import { positionNodeSubmenu } from '../shared/nodeFooterControls.js';
import { t } from '../../i18n/index.js';
const DREAMINA_IMAGE_ALLOWED_RATIOS = new Set(["21:9", "16:9", '3:2', "4:3", "1:1", "3:4", "2:3", "9:16"]);
const DREAMINA_IMAGE_ADAPTIVE_RATIO_OPTIONS = [{
  'label': '21:9',
  'calc': 0x15 / 0x9
}, {
  'label': "16:9",
  'calc': 0x10 / 0x9
}, {
  'label': "3:2",
  'calc': 0x3 / 0x2
}, {
  'label': '4:3',
  'calc': 0x4 / 0x3
}, {
  'label': "1:1",
  'calc': 0x1 / 0x1
}, {
  'label': "3:4",
  'calc': 0x3 / 0x4
}, {
  'label': '2:3',
  'calc': 0x2 / 0x3
}, {
  'label': "9:16",
  'calc': 0x9 / 0x10
}];
const DREAMINA_IMAGE_ALLOWED_SIZES = new Set(['2K', '4K']);
const DREAMINA_IMAGE_MENU_ICON_HTML = "<img src=\"images/jimeng.png\" class=\"node-menu-icon\" alt=\"dreamina\">";
function getDreaminaImageMenuMeta(_0x2612cb) {
  const _0x4c0e96 = _0x2612cb?.["extensions"]?.["imageMenu"];
  return _0x4c0e96 && _0x4c0e96["group"] === "dreamina" ? _0x4c0e96 : null;
}
function getDreaminaImageManifest(_0x268d09) {
  const _0x434d87 = getModelManifest(_0x268d09);
  return getDreaminaImageMenuMeta(_0x434d87) ? _0x434d87 : null;
}
export function getDreaminaImageModelMenuOptions() {
  return getModelsByKind('image')["filter"](_0x22bb4a => getDreaminaImageMenuMeta(_0x22bb4a))['sort']((_0x37c2d6, _0x586631) => {
    const _0x35d559 = getDreaminaImageMenuMeta(_0x37c2d6);
    const _0x585554 = getDreaminaImageMenuMeta(_0x586631);
    return (_0x35d559?.["order"] || 0x0) - (_0x585554?.["order"] || 0x0);
  })["map"](_0x522ad2 => {
    const _0x38515e = getDreaminaImageMenuMeta(_0x522ad2);
    return {
      'model': _0x522ad2["modelId"],
      'title': _0x38515e["title"] || _0x522ad2["displayName"] || _0x522ad2['modelId'],
      'subtitle': _0x38515e["subtitle"] || _0x522ad2["description"] || '',
      'default': _0x38515e["default"] === !![]
    };
  });
}
export function getDefaultDreaminaImageModelId() {
  const _0x4bd151 = getDreaminaImageModelMenuOptions();
  return _0x4bd151["find"](_0x4b1b9c => _0x4b1b9c["default"] === !![])?.["model"] || _0x4bd151[0x0]?.["model"] || '';
}
export const DREAMINA_IMAGE_MODEL_VERSIONS = Object["freeze"](getDreaminaImageModelMenuOptions()['map'](_0x3f491c => getDreaminaRuntimeModelVersion(_0x3f491c["model"]))['filter'](Boolean));
function getDreaminaRuntimeModelVersion(_0x3583da) {
  const _0x59ca00 = resolveModelExecution(_0x3583da, {
    'providerHint': "dreamina"
  });
  return String(_0x59ca00?.["executionManifest"]?.["extensions"]?.['dreaminaImage']?.['modelVersion'] || '')["trim"]();
}
export function normalizeDreaminaImageModel(_0x227918, _0x562904) {
  const _0x342b71 = String(_0x227918 || '')["trim"]();
  const _0x363917 = String(_0x562904 || '')['trim']()["toLowerCase"]();
  const _0x46ebb2 = getDreaminaImageManifest(_0x342b71);
  if (_0x46ebb2) {
    return _0x46ebb2["modelId"];
  }
  if (!_0x342b71 && _0x363917 === "dreamina") {
    return getDefaultDreaminaImageModelId();
  }
  return _0x342b71;
}
export function getDreaminaImageModelVersion(_0x4a1194, _0x1efea4) {
  const _0xdd5015 = normalizeDreaminaImageModel(_0x4a1194, _0x1efea4);
  if (!_0xdd5015["startsWith"]("dreamina/")) {
    return '';
  }
  return getDreaminaRuntimeModelVersion(_0xdd5015);
}
function getDreaminaImageSizeField(_0x30a4c4 = '') {
  const _0x31dd06 = getDreaminaImageManifest(_0x30a4c4);
  return Array['isArray'](_0x31dd06?.["uiSchema"]?.["fields"]) ? _0x31dd06["uiSchema"]["fields"]["find"](_0x848019 => _0x848019?.['id'] === "imageSize") : null;
}
function getDreaminaImageAllowedSizes(_0x524d33 = '') {
  const _0xe4b482 = getDreaminaImageSizeField(_0x524d33);
  const _0x3ae7b9 = Array["isArray"](_0xe4b482?.['options']) ? _0xe4b482["options"]["map"](_0x45a491 => String(_0x45a491?.["value"] || '')['trim']()['toUpperCase']())["filter"](Boolean) : [];
  return _0x3ae7b9['length'] > 0x0 ? new Set(_0x3ae7b9) : DREAMINA_IMAGE_ALLOWED_SIZES;
}
export function normalizeDreaminaImageSize(_0x5e7999, _0x16ed37 = '') {
  const _0x52db3f = String(_0x5e7999 || '')['trim']()["toUpperCase"]();
  const _0x200d4d = getDreaminaImageSizeField(_0x16ed37);
  const _0x492b29 = getDreaminaImageAllowedSizes(_0x16ed37);
  if (_0x492b29["has"](_0x52db3f)) {
    return _0x52db3f;
  }
  const _0x450ec6 = String(_0x200d4d?.["defaultValue"] || '2K')["trim"]()["toUpperCase"]();
  return _0x492b29['has'](_0x450ec6) ? _0x450ec6 : '2K';
}
export function normalizeDreaminaImageAspectRatio(_0xca7ea0) {
  const _0x2e6817 = String(_0xca7ea0 || '')["trim"]();
  if (!_0x2e6817) {
    return _0x2e6817;
  }
  if (_0x2e6817 === "auto") {
    return "自适应";
  }
  if (_0x2e6817 === "5:4") {
    return "4:3";
  }
  if (_0x2e6817 === "4:5") {
    return "3:4";
  }
  return _0x2e6817;
}
export function isDreaminaImageRatioSupported(_0x1612f2) {
  const _0x30bbb2 = String(_0x1612f2 || '')["trim"]();
  if (!_0x30bbb2 || _0x30bbb2 === "自适应" || _0x30bbb2 === "auto") {
    return !![];
  }
  return DREAMINA_IMAGE_ALLOWED_RATIOS['has'](_0x30bbb2);
}
export function pickClosestDreaminaImageAspectRatio(_0x2702c8, _0x23a5cd) {
  const _0x57e79f = Number(_0x2702c8);
  const _0x145a7d = Number(_0x23a5cd);
  if (!(Number["isFinite"](_0x57e79f) && _0x57e79f > 0x0 && Number["isFinite"](_0x145a7d) && _0x145a7d > 0x0)) {
    return "1:1";
  }
  const _0x26018e = _0x57e79f / _0x145a7d;
  let _0x2d2f8c = DREAMINA_IMAGE_ADAPTIVE_RATIO_OPTIONS[0x0];
  let _0xc5283c = Math['abs'](_0x26018e - _0x2d2f8c["calc"]);
  for (let _0x4c932e = 0x1; _0x4c932e < DREAMINA_IMAGE_ADAPTIVE_RATIO_OPTIONS["length"]; _0x4c932e += 0x1) {
    const _0x2dba4d = DREAMINA_IMAGE_ADAPTIVE_RATIO_OPTIONS[_0x4c932e];
    const _0x74740c = Math["abs"](_0x26018e - _0x2dba4d["calc"]);
    _0x74740c < _0xc5283c && (_0xc5283c = _0x74740c, _0x2d2f8c = _0x2dba4d);
  }
  return _0x2d2f8c["label"];
}
export function buildDreaminaImageNodeNormalizationPatch(_0xeab0dc) {
  const _0x22d2e4 = _0xeab0dc && typeof _0xeab0dc === "object" ? _0xeab0dc : {};
  if (!isDreaminaImageModel(_0x22d2e4["model"], _0x22d2e4["provider"])) {
    return null;
  }
  const _0x5e6efa = normalizeDreaminaImageModel(_0x22d2e4["model"], _0x22d2e4['provider']);
  const _0x1780e1 = normalizeDreaminaImageSize(_0x22d2e4["imageSize"], _0x5e6efa);
  const _0x5e9392 = normalizeDreaminaImageAspectRatio(_0x22d2e4["aspectRatio"]);
  const _0x24dba8 = {};
  _0x5e6efa && _0x5e6efa !== String(_0x22d2e4['model'] || '')["trim"]() && (_0x24dba8["model"] = _0x5e6efa);
  String(_0x22d2e4['provider'] || '')['trim']()["toLowerCase"]() !== "dreamina" && (_0x24dba8["provider"] = "dreamina");
  _0x1780e1 !== String(_0x22d2e4['imageSize'] || '2K')['trim']()['toUpperCase']() && (_0x24dba8["imageSize"] = _0x1780e1);
  if (_0x5e9392 && !isDreaminaImageRatioSupported(_0x5e9392)) {
    _0x24dba8["aspectRatio"] = "1:1";
  } else {
    _0x5e9392 && _0x5e9392 !== String(_0x22d2e4["aspectRatio"] || '')["trim"]() && (_0x24dba8["aspectRatio"] = _0x5e9392);
  }
  return Object["keys"](_0x24dba8)["length"] > 0x0 ? _0x24dba8 : null;
}
export function isDreaminaImageModel(_0x315555, _0x2c133d) {
  const _0x3d3f23 = String(_0x315555 || '')["trim"]();
  const _0x154b1a = String(_0x2c133d || '')["trim"]()['toLowerCase']();
  return _0x154b1a === "dreamina" || _0x3d3f23["startsWith"]('dreamina/');
}
export function getDreaminaImageTriggerIconHTML() {
  return '<img\x20src=\x22images/jimeng.png\x22\x20class=\x22image-model-trigger-icon\x20image-model-trigger-icon-dreamina\x22\x20alt=\x22' + t("aigenImage.dreamina.alt") + '\x22>';
}
export function getDreaminaImageMenuGroupHTML(_0x5b48a1) {
  const _0x390835 = String(_0x5b48a1 || '')["trim"]();
  const _0x483b20 = isDreaminaImageModel(_0x390835, '') ? normalizeDreaminaImageModel(_0x390835, "dreamina") : '';
  const _0x44f74c = _0x5a4bf0 => {
    const _0x4b1fc7 = _0x483b20 === _0x5a4bf0["model"];
    return renderNodeMenuItem({
      'modelId': _0x5a4bf0['model'],
      'provider': "dreamina",
      'label': _0x5a4bf0["title"],
      'description': _0x5a4bf0["subtitle"],
      'iconHtml': DREAMINA_IMAGE_MENU_ICON_HTML,
      'active': _0x4b1fc7
    });
  };
  return renderNodeMenuGroup({
    'id': "dreamina",
    'headerClass': "dreamina-group-header",
    'submenuClass': 'dreamina-submenu',
    'toggleAttr': "data-dreamina-toggle",
    'label': t("aigenImage.dreamina.label"),
    'subtitle': t("aigenImage.dreamina.subtitle"),
    'iconHtml': DREAMINA_IMAGE_MENU_ICON_HTML,
    'itemsHtml': getDreaminaImageModelMenuOptions()["map"](_0x12266f => _0x44f74c(_0x12266f))["join"]('')
  });
}
export function setDreaminaImageTriggerIcon(_0x340181) {
  if (!_0x340181) {
    return;
  }
  const _0x27b831 = _0x340181["firstElementChild"];
  if (!_0x27b831) {
    return;
  }
  const _0x459d50 = document["createElement"]("img");
  _0x459d50['src'] = "images/jimeng.png";
  _0x459d50["className"] = "image-model-trigger-icon image-model-trigger-icon-dreamina";
  _0x27b831["replaceWith"](_0x459d50);
}
export function bindDreaminaImageMenu(_0x2fc018) {
  const {
    modelMenu: _0x2e3851,
    modelTrigger: _0x644f0a,
    modelLabel: _0x37765a,
    nodeId: _0x256174,
    store: _0x4e46bb,
    buildModelPatch: _0x25c7dc,
    afterSelect: _0xb7d43b
  } = _0x2fc018 || {};
  if (!_0x2e3851 || !_0x644f0a || !_0x37765a || !_0x256174 || !_0x4e46bb) {
    return null;
  }
  const _0x4a1076 = _0x2e3851["querySelector"]("[data-dreamina-toggle]");
  const _0x14e20d = _0x2e3851["querySelector"](".dreamina-submenu");
  if (!_0x4a1076 || !_0x14e20d) {
    return null;
  }
  let _0x1f3a4e = null;
  const _0x1802b2 = () => {
    _0x1f3a4e && (clearTimeout(_0x1f3a4e), _0x1f3a4e = null);
    positionNodeSubmenu(_0x4a1076, _0x14e20d);
  };
  const _0x39b2f6 = () => {
    if (_0x1f3a4e) {
      clearTimeout(_0x1f3a4e);
    }
    _0x1f3a4e = setTimeout(() => {
      _0x14e20d["style"]["display"] = 'none';
    }, 0x78);
  };
  _0x4a1076["addEventListener"]("mouseenter", _0x1802b2);
  _0x4a1076["addEventListener"]("mouseleave", _0x39b2f6);
  _0x14e20d["addEventListener"]("mouseenter", _0x1802b2);
  _0x14e20d["addEventListener"]("mouseleave", _0x39b2f6);
  _0x14e20d['querySelectorAll'](".floating-menu-item")["forEach"](_0x2adb74 => {
    _0x2adb74["addEventListener"]('click', _0x51a327 => {
      _0x51a327["stopPropagation"]();
      const _0xdf4d42 = String(_0x2adb74["dataset"]['value'] || getDefaultDreaminaImageModelId())['trim']();
      const _0x9a48dd = String(_0x2adb74['dataset']["provider"] || "dreamina")['trim']();
      const _0x317e21 = _0x2adb74["querySelector"](".fmi-title");
      _0x37765a["textContent"] = _0x317e21 ? _0x317e21['textContent'] : _0xdf4d42;
      _0x2e3851["querySelectorAll"](".floating-menu-item")["forEach"](_0xfe1948 => _0xfe1948["classList"]["remove"]("active"));
      _0x2adb74["classList"]["add"]("active");
      _0x2e3851['classList']["remove"]("show");
      _0x14e20d['style']['display'] = 'none';
      const _0x4896a3 = _0x4e46bb["getState"]?.()["nodes"]?.[_0x256174] || {};
      const _0x42583c = typeof _0x25c7dc === 'function' ? _0x25c7dc(_0x4896a3, _0xdf4d42, _0x9a48dd) : {
        'model': _0xdf4d42,
        'provider': _0x9a48dd
      };
      _0x4e46bb["updateNodeData"](_0x256174, _0x42583c);
      setDreaminaImageTriggerIcon(_0x644f0a);
      _0xb7d43b?.({
        'item': _0x2adb74,
        'model': _0xdf4d42,
        'provider': _0x9a48dd,
        'latestNode': _0x4896a3,
        'patch': _0x42583c,
        'modelMenu': _0x2e3851,
        'submenu': _0x14e20d,
        'modelTrigger': _0x644f0a
      });
    });
  });
  return {
    'header': _0x4a1076,
    'submenu': _0x14e20d
  };
}