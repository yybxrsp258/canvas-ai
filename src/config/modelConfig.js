import { getModelManifest, getModelsByKind, resolveModelProvider } from '../manifests/index.js';
import { isModelProviderPubliclyListed } from '../manifests/modelCatalogVisibility.js';
import { t } from '../i18n/index.js';
function getImageMenuMeta(_0x3c46f1) {
  const _0x134679 = _0x3c46f1?.["extensions"]?.["imageMenu"];
  return _0x134679 && typeof _0x134679 === "object" ? _0x134679 : null;
}
function buildManifestImageModelItem(_0x2fa6fc) {
  const _0x11ce46 = getImageMenuMeta(_0x2fa6fc) || {};
  return {
    'id': _0x2fa6fc["modelId"],
    'name': _0x11ce46["title"] || _0x2fa6fc['displayName'] || _0x2fa6fc["modelId"],
    'description': _0x11ce46['subtitle'] || _0x2fa6fc['description'] || '',
    'icon': _0x11ce46['icon'] || _0x2fa6fc["icon"],
    'vip': _0x2fa6fc["vip"] === !![],
    'devOnly': _0x2fa6fc["devOnly"] === !![]
  };
}
function getManifestImageModels({
  provider: _0x53eb49,
  adapterType: _0x2bb138,
  group: _0x39a035
} = {}) {
  return getModelsByKind('image')["filter"](_0x4c870b => {
    if (_0x53eb49 && _0x4c870b["provider"] !== _0x53eb49) {
      return ![];
    }
    if (_0x2bb138 && _0x4c870b["adapterType"] !== _0x2bb138) {
      return ![];
    }
    if (_0x39a035 && getImageMenuMeta(_0x4c870b)?.["group"] !== _0x39a035) {
      return ![];
    }
    return !![];
  })['sort']((_0x3eb430, _0x28faed) => {
    const _0x5453dd = getImageMenuMeta(_0x3eb430);
    const _0x22883d = getImageMenuMeta(_0x28faed);
    return (_0x5453dd?.['order'] || 0x0) - (_0x22883d?.['order'] || 0x0);
  })['map'](buildManifestImageModelItem);
}
const IMAGE_MODEL_PROVIDER_DEFINITIONS = {
  'grsai': {
    'name': 'GRSAI',
    'icon': "images/grsai.png",
    get 'description'() {
      return t('imageModelConfig.providers.grsai.description');
    },
    'models': getManifestImageModels({
      'provider': 'grsai',
      'group': "grsaiModel"
    })
  },
  'ppio': {
    get 'name'() {
      return t("imageModelConfig.providers.ppio.name");
    },
    'icon': "images/ppio.png",
    get 'description'() {
      return t("imageModelConfig.providers.ppio.description");
    },
    'models': getManifestImageModels({
      'provider': "ppio"
    })
  },
  'apimart': {
    'name': 'APIMart',
    'icon': 'AM',
    get 'description'() {
      return t('imageModelConfig.providers.apimart.description');
    },
    'isTextIcon': !![],
    'models': getManifestImageModels({
      'provider': "apimart"
    })
  },
  'runninghub': {
    'name': "RunningHUB",
    'icon': 'images/RH.png',
    get 'description'() {
      return t("imageModelConfig.providers.runninghub.description");
    },
    'models': getManifestImageModels({
      'provider': "runninghub",
      'adapterType': "modelApi"
    })
  },
  'aicanvas': {
    'name': "Canvas AI",
    'icon': "images/favicon.svg",
    get 'description'() {
      return t("imageModelConfig.providers.aicanvas.description");
    },
    'devOnly': !![],
    get 'models'() {
      const _0x4568ef = t("imageModelConfig.providers.aicanvas.placeholderImageModel");
      return [{
        'id': 'aicanvas/image-lite',
        'name': 'Canvas\x20AI\x20Image\x20Lite',
        'description': _0x4568ef,
        'icon': "images/favicon.svg"
      }, {
        'id': "aicanvas/image-pro",
        'name': "Canvas AI Image Pro",
        'description': _0x4568ef,
        'icon': "images/favicon.svg"
      }];
    }
  }
};
export const IMAGE_MODELS = Object["fromEntries"](Object["entries"](IMAGE_MODEL_PROVIDER_DEFINITIONS)["filter"](([_0x4f1e22]) => isModelProviderPubliclyListed(_0x4f1e22)));
export function getModelDisplayName(_0x341e63) {
  const _0x2a063a = getModelManifest(_0x341e63);
  if (_0x2a063a?.['displayName']) {
    return _0x2a063a["displayName"];
  }
  for (const _0x12f1ab of Object["values"](IMAGE_MODELS)) {
    const _0x19703b = _0x12f1ab["models"]["find"](_0x30d894 => _0x30d894['id'] === _0x341e63);
    if (_0x19703b) {
      return _0x19703b["name"];
    }
  }
  return _0x341e63;
}
export function getModelProvider(_0x89c25a) {
  const _0x2cd552 = resolveModelProvider(_0x89c25a, '', {
    'allowProviderHint': ![],
    'allowPrefixInference': ![]
  });
  if (_0x2cd552 === "runninghubwf") {
    return "runninghub";
  }
  if (_0x2cd552) {
    return _0x2cd552;
  }
  return Object['entries'](IMAGE_MODELS)["find"](([, _0x5ca106]) => _0x5ca106["models"]['some'](_0x363e53 => _0x363e53['id'] === _0x89c25a))?.[0x0] || null;
}
export function getProviderIconHtml(_0x47d35d, _0x3d2f99 = 0xc) {
  const _0x3f633b = IMAGE_MODELS[_0x47d35d];
  if (!_0x3f633b) {
    return '';
  }
  if (_0x3f633b["isTextIcon"]) {
    return "<div style=\"width:" + _0x3d2f99 + "px;height:" + _0x3d2f99 + 'px;border-radius:2px;background:var(--bg-node);color:var(--text-primary);font-size:7px;font-weight:900;display:flex;align-items:center;justify-content:center;transform:scale(0.85);\x22>' + _0x3f633b["icon"] + "</div>";
  }
  if (_0x47d35d === "aicanvas") {
    const _0x586bb7 = Math["max"](Number(_0x3d2f99) || 0xc, 0xe);
    return "<img src=\"" + _0x3f633b["icon"] + "\" style=\"width:" + _0x586bb7 + "px;height:" + _0x586bb7 + "px;object-fit:contain;border-radius:2px;flex-shrink:0;\" alt=\"" + _0x47d35d + '\x22>';
  }
  return "<img src=\"" + _0x3f633b["icon"] + '\x22\x20style=\x22width:' + _0x3d2f99 + "px;height:" + _0x3d2f99 + 'px;object-fit:contain;border-radius:2px;flex-shrink:0;background:var(--white-10);padding:2px;\x22\x20alt=\x22' + _0x47d35d + '\x22>';
}