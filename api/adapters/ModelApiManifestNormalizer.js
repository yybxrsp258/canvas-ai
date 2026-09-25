import { resolveModelExecution, sanitizeModelUiSchemaParams } from '../../src/manifests/index.js';
import { isAdaptiveRatioLabel, parseRatioLabel, resolveProviderRatioPayload } from '../imageRatioPolicy.js';
import { ApiError } from '../errors/index.js';
import { buildBodyFromMapping } from './modelApiMappingEngine.js';
import { buildChatCompletionsStructuredOutput, buildTextStructuredOutputSystemPrompt, getTextStructuredOutputRequestMeta, normalizeTextStructuredOutput } from './textStructuredOutput.js';
import { uploadModelApiMediaInputs } from '../mediaInputUploadRouter.js';
import { isConfiguredObjectStorageEnabled } from '../objectStorageApi.js';
import { getModelApiBodyResolver, getModelApiEndpointResolver, normalizeApimartNanoBanana2Resolution, normalizeApimartGptImage2Resolution } from './modelApiResolvers/index.js';
import { buildRunningHubModelApiUrl, getRunningHubProviderProfileId, remapRunningHubModelApiUrl, resolveRunningHubModelApiProfileId, resolveRunningHubModelApiBaseUrl } from '../../src/modules/runningHubProviderProfiles.js';
import { normalizeModelProviderProfileId, resolveConfiguredModelProviderProfileFallback } from '../../src/modules/modelProviderProfileSelection.js';
import { buildRunningHubCatalogRequest } from './RunningHubAudioModelApiAdapter.js';
import { buildTextResponsesBody, selectTextMediaExecution } from './textResponsesRequest.js';
function normalizeManifestOptionKey(_0x563806) {
  return String(_0x563806 || '')["trim"]()["toLowerCase"]();
}
function findVideoAspectRatioField(_0x3b0534) {
  return (Array["isArray"](_0x3b0534?.["uiSchema"]?.["fields"]) ? _0x3b0534['uiSchema']["fields"] : [])["find"](_0x2639d8 => String(_0x2639d8?.['id'] || '')["trim"]() === 'aspectRatio');
}
function pickDefaultConcreteVideoAspectRatio(_0xd91dd7) {
  const _0x4e4b37 = findVideoAspectRatioField(_0xd91dd7);
  const _0x30bf6c = Array["isArray"](_0x4e4b37?.["options"]) ? _0x4e4b37["options"] : [];
  let _0x2a3749 = '';
  for (const _0x596910 of _0x30bf6c) {
    const _0x1b7ca4 = String(_0x596910?.["value"] ?? _0x596910 ?? '')['trim']();
    if (_0x1b7ca4 && _0x1b7ca4["includes"](':') && !isAdaptiveRatioLabel(_0x1b7ca4)) {
      if (_0x1b7ca4 === "1:1") {
        return _0x1b7ca4;
      }
      if (!_0x2a3749) {
        _0x2a3749 = _0x1b7ca4;
      }
    }
  }
  return _0x2a3749;
}
function resolvePayloadAspectRatioInput(_0x1eb704 = {}, _0x316a98 = null) {
  const _0x3007f9 = _0x1eb704?.["generationParams"] && typeof _0x1eb704['generationParams'] === "object" && !Array["isArray"](_0x1eb704["generationParams"]) ? _0x1eb704["generationParams"] : {};
  if (Object["prototype"]["hasOwnProperty"]["call"](_0x3007f9, "aspectRatio")) {
    return _0x3007f9["aspectRatio"];
  }
  for (const _0x5c8d5a of ["aspectRatio", "aspect_ratio", 'size']) {
    if (Object["prototype"]["hasOwnProperty"]["call"](_0x1eb704 || {}, _0x5c8d5a)) {
      return _0x1eb704[_0x5c8d5a];
    }
  }
  return findVideoAspectRatioField(_0x316a98)?.["defaultValue"] ?? '';
}
function applyVideoAspectRatioExecutionFallback(_0x377619 = {}, _0x14067d = null) {
  if (!findVideoAspectRatioField(_0x14067d)) {
    return _0x377619;
  }
  const _0x50241d = _0x14067d?.['extensions']?.["ratioPolicy"] || _0x14067d?.["ratioPolicy"] || {};
  if (_0x50241d?.["preserveAdaptive"] === !![]) {
    return _0x377619;
  }
  const _0x20ce52 = resolvePayloadAspectRatioInput(_0x377619, _0x14067d);
  if (!isAdaptiveRatioLabel(_0x20ce52)) {
    return _0x377619;
  }
  const _0x5bbed8 = String(_0x377619?.['resolvedRatioLabel'] || '')['trim']();
  const _0x235881 = _0x5bbed8 && !isAdaptiveRatioLabel(_0x5bbed8) ? _0x5bbed8 : pickDefaultConcreteVideoAspectRatio(_0x14067d);
  if (!_0x235881) {
    return _0x377619;
  }
  return {
    ..._0x377619,
    'aspectRatio': _0x235881,
    'resolvedRatioLabel': _0x235881,
    'generationParams': {
      ...(_0x377619["generationParams"] || {}),
      'aspectRatio': _0x235881
    }
  };
}
function mergeRootAspectRatioIntoGenerationParams(_0x9f3977 = {}, _0x358cd0 = {}) {
  const _0x26228f = _0x358cd0 && typeof _0x358cd0 === 'object' && !Array["isArray"](_0x358cd0) ? {
    ..._0x358cd0
  } : {};
  const _0x2aa9c0 = _0x9f3977?.["generationParams"] && typeof _0x9f3977["generationParams"] === "object" && !Array["isArray"](_0x9f3977["generationParams"]) ? _0x9f3977['generationParams'] : {};
  if (Object["prototype"]['hasOwnProperty']["call"](_0x2aa9c0, 'aspectRatio')) {
    return _0x26228f;
  }
  if (String(_0x9f3977?.["resolvedRatioLabel"] || '')['trim']()) {
    return _0x26228f;
  }
  Object["prototype"]['hasOwnProperty']["call"](_0x9f3977 || {}, "aspectRatio") && !isAdaptiveRatioLabel(_0x9f3977["aspectRatio"]) && (_0x26228f["aspectRatio"] = _0x9f3977["aspectRatio"]);
  return _0x26228f;
}
function mergeUiSchemaDefaultsIntoPayload(_0x17f77b = {}, _0x45fc8d = null) {
  const _0x4a655a = Array["isArray"](_0x45fc8d?.["uiSchema"]?.["fields"]) ? _0x45fc8d["uiSchema"]["fields"] : [];
  if (_0x4a655a['length'] === 0x0) {
    return _0x17f77b;
  }
  const _0x14deb8 = _0x17f77b?.["generationParams"] && typeof _0x17f77b["generationParams"] === "object" && !Array["isArray"](_0x17f77b["generationParams"]) ? {
    ..._0x17f77b['generationParams']
  } : {};
  _0x4a655a["forEach"](_0x51a8ca => {
    const _0x41b999 = String(_0x51a8ca?.['id'] || '')["trim"]();
    if (!_0x41b999 || Object["prototype"]["hasOwnProperty"]['call'](_0x14deb8, _0x41b999)) {
      return;
    }
    if (_0x41b999 === 'aspectRatio' && String(_0x17f77b?.["resolvedRatioLabel"] || '')['trim']()) {
      _0x14deb8[_0x41b999] = _0x17f77b['resolvedRatioLabel'];
      return;
    }
    Object['prototype']['hasOwnProperty']['call'](_0x17f77b || {}, _0x41b999) && (_0x14deb8[_0x41b999] = _0x17f77b[_0x41b999]);
  });
  const _0x551d36 = sanitizeModelUiSchemaParams(_0x45fc8d['modelId'], _0x14deb8, {
    'includeDefaults': !![]
  });
  const _0x94754b = {
    ..._0x17f77b,
    'generationParams': _0x551d36
  };
  _0x4a655a["forEach"](_0x260dae => {
    const _0x3bdca0 = String(_0x260dae?.['id'] || '')['trim']();
    if (!_0x3bdca0 || Object["prototype"]["hasOwnProperty"]["call"](_0x94754b, _0x3bdca0)) {
      return;
    }
    Object['prototype']["hasOwnProperty"]["call"](_0x551d36, _0x3bdca0) && (_0x94754b[_0x3bdca0] = _0x551d36[_0x3bdca0]);
  });
  return _0x94754b;
}
function resolveMappedModelValue(_0x5e7b71, _0x2c35a6) {
  if (!_0x5e7b71) {
    return '';
  }
  if (typeof _0x5e7b71 === "string") {
    return _0x5e7b71;
  }
  if (typeof _0x5e7b71 !== "object" || Array["isArray"](_0x5e7b71)) {
    return '';
  }
  const _0x247458 = String(_0x2c35a6?.['imageSize'] || '')['trim']()['toUpperCase']();
  const _0x3e8e65 = _0x5e7b71["byImageSize"] || {};
  return _0x247458 && _0x3e8e65[_0x247458] || _0x5e7b71["default"] || _0x5e7b71['model'] || '';
}
function resolveExecutionModelToken(_0x4a06f4, _0x4d0818) {
  let _0xbf7348 = _0x4a06f4["model"] || _0x4d0818["model"] || '';
  const _0x66419b = normalizeManifestOptionKey(_0x4d0818["generationParams"]?.["mode"] ?? _0x4d0818["mode"]);
  let _0x23693d = ![];
  if (_0x66419b && _0x4a06f4["modeModels"]) {
    const _0xebc54b = resolveMappedModelValue(_0x4a06f4["modeModels"][_0x66419b], _0x4d0818);
    _0xebc54b && (_0xbf7348 = _0xebc54b, _0x23693d = !![]);
  }
  const _0x1b9fa8 = normalizeManifestOptionKey(_0x4d0818['generationParams']?.["rhModelRoute"] ?? _0x4d0818["rhModelRoute"]);
  if (_0x1b9fa8 && _0x4a06f4['routeModels']) {
    const _0x2d661f = resolveMappedModelValue(_0x4a06f4["routeModels"][_0x1b9fa8], _0x4d0818);
    _0x2d661f && (_0xbf7348 = _0x2d661f, _0x23693d = !![]);
  }
  if (_0x4a06f4['imageSizeModels'] && !_0x23693d) {
    const _0x442ce2 = String(_0x4d0818["imageSize"] || '')["trim"]()["toUpperCase"]();
    _0xbf7348 = _0x4a06f4["imageSizeModels"][_0x442ce2] || _0x4a06f4["imageSizeModels"]['default'] || _0xbf7348;
  }
  return _0xbf7348;
}
function resolveProviderConfig(_0xb04503, _0x9164d, _0x21a7c6) {
  const _0x2dd8af = getRunningHubProviderProfileId(_0x9164d);
  const _0xf31bb0 = resolveConfiguredModelProviderProfileFallback(_0x9164d?.["model"], normalizeModelProviderProfileId(_0x9164d?.["model"], _0x2dd8af));
  const _0x31167d = _0xf31bb0 || (_0xb04503 === "runninghub" ? resolveRunningHubModelApiProfileId(_0x9164d?.["model"], _0x2dd8af) : _0xb04503);
  const _0x1383fc = _0x21a7c6["getProviderConfig"](_0x31167d);
  if (_0xb04503 !== "runninghub") {
    return _0x1383fc;
  }
  return {
    ..._0x1383fc,
    'apiUrl': resolveRunningHubModelApiBaseUrl(_0x31167d)
  };
}
function resolveApiKey(_0x359225, _0x156b81, _0x15a9e1, _0x92dc0d = null) {
  const _0x70ee60 = _0x92dc0d || resolveProviderConfig(_0x359225, _0x156b81, _0x15a9e1);
  if (_0x359225 === "runninghub") {
    return _0x70ee60["modelApiKey"] || _0x156b81["apiKey"];
  }
  return _0x70ee60["apiKey"] || _0x156b81["apiKey"];
}
function isCustomProviderId(_0x15d593) {
  return /^custom_[a-z0-9_-]+$/i["test"](String(_0x15d593 || '')["trim"]());
}
const AIC_IMAGE_TASK_PROBE_CONTROL_KEY = '__aicAllowTaskProbe';
const AIC_MODEL_CATALOG_ID_KEY = "__aicModelCatalogId";
function buildModelCatalogIdentity(_0x1fa0d8, _0x137dc3) {
  const _0x5c1d2d = String(_0x137dc3?.["modelId"] || '')['trim']();
  return _0x1fa0d8 === "binghuo" && _0x5c1d2d ? {
    [AIC_MODEL_CATALOG_ID_KEY]: _0x5c1d2d
  } : {};
}
function supportsManifestImageTaskPolling(_0x133453) {
  return Boolean(_0x133453 && (String(_0x133453["urlTemplate"] || '')["trim"]() || String(_0x133453["mode"] || '')["trim"]() === "comfyui-history"));
}
function isCustomProviderModelManifest(_0x3ad227) {
  const _0x4f1b83 = _0x3ad227?.["extensions"]?.["customProvider"];
  return Boolean(_0x4f1b83 && typeof _0x4f1b83 === "object" && !Array["isArray"](_0x4f1b83));
}
function isSupportedModelApiProvider(_0x344d9c, _0x3d0437 = new Set()) {
  const _0x4d19c9 = String(_0x344d9c || '')['trim']()["toLowerCase"]();
  return _0x3d0437['has'](_0x4d19c9) || isCustomProviderId(_0x4d19c9);
}
function throwMissingApiKey(_0x5545a7) {
  throw ApiError["authError"](_0x5545a7, null, "API Key 未配置（厂商：" + (_0x5545a7 || "unknown") + '）');
}
function getManifestMaxInputCount(_0x1fa31f, _0x5a05b1) {
  const _0x5a0a86 = Number(_0x1fa31f?.["inputSlots"]?.["maxByKind"]?.[_0x5a05b1]);
  return Number["isFinite"](_0x5a0a86) ? Math["max"](0x0, _0x5a0a86) : null;
}
function collectRawImageInputUrls(_0x55d763 = {}, _0x3dfd63 = null) {
  const _0x1d90d2 = getOrderedInputSlotEntries(_0x55d763?.["inputUrlsBySlot"], _0x3dfd63);
  const _0x1caf35 = _0x1d90d2["length"] > 0x0 ? _0x1d90d2["map"](_0xad5700 => _0xad5700["url"]) : Array["isArray"](_0x55d763?.['inputUrls']) ? _0x55d763["inputUrls"] : [];
  return Array['from'](new Set(_0x1caf35["map"](_0x21f34c => String(_0x21f34c || '')["trim"]())["filter"](Boolean)));
}
function collectResolverOwnedImageInputUrls(_0x509177 = {}, _0x512923 = null) {
  const _0x3088fe = collectRawImageInputUrls(_0x509177, _0x512923);
  const _0x41456c = getManifestMaxInputCount(_0x512923, "image");
  return _0x41456c === null ? _0x3088fe : _0x3088fe['slice'](0x0, Math["max"](0x0, _0x41456c));
}
function resolveInputRouteExecutionManifest(_0x256085, _0x2160d2, _0x532e97) {
  const _0x1c5651 = _0x256085?.['extensions']?.["inputRoutes"];
  const _0x3a204e = _0x1c5651 && typeof _0x1c5651 === "object" && !Array["isArray"](_0x1c5651) ? _0x1c5651["image"] : null;
  if (!_0x3a204e || typeof _0x3a204e !== "object" || Array["isArray"](_0x3a204e) || collectRawImageInputUrls(_0x2160d2, _0x532e97)['length'] === 0x0) {
    return _0x256085;
  }
  return {
    ..._0x256085,
    ..._0x3a204e,
    'extensions': {
      ...(_0x256085?.["extensions"] || {}),
      ...(_0x3a204e["extensions"] || {})
    }
  };
}
function isMultipartFormExecution(_0xae4055) {
  return String(_0xae4055?.["requestEncoding"] || '')['trim']()["toLowerCase"]() === "multipart/form-data";
}
async function resolveMultipartInputImages(_0x44a034, _0x1c53cc, _0x3791ca) {
  if (typeof _0x3791ca["loadInputImageBlob"] !== "function") {
    throw new Error("Model API multipart image input loader is not available");
  }
  const _0xddab41 = collectRawImageInputUrls(_0x44a034, _0x1c53cc);
  const _0x3a09a6 = getManifestMaxInputCount(_0x1c53cc, "image");
  const _0x76b42d = _0x3a09a6 === null ? _0xddab41 : _0xddab41["slice"](0x0, _0x3a09a6);
  const _0x94fab8 = [];
  for (const _0x50d13e of _0x76b42d) {
    const _0x4b4020 = await _0x3791ca["loadInputImageBlob"](_0x50d13e);
    if (typeof Blob === "undefined" || !(_0x4b4020 instanceof Blob)) {
      throw new Error("Model API multipart image input did not resolve to a file");
    }
    _0x94fab8["push"](_0x4b4020);
  }
  return _0x94fab8;
}
function multipartFileName(_0x228302, _0x2972d6) {
  const _0x313f72 = String(_0x228302?.['type'] || '')['trim']()["toLowerCase"]();
  const _0x291946 = _0x313f72 === "image/jpeg" ? 'jpg' : _0x313f72 === "image/webp" ? "webp" : _0x313f72 === 'image/gif' ? "gif" : "png";
  return 'image-' + (_0x2972d6 + 0x1) + '.' + _0x291946;
}
function appendMultipartValue(_0x32cc25, _0x2915af, _0x3ba210, _0x22fc63 = 0x0) {
  if (_0x3ba210 === undefined || _0x3ba210 === null || _0x3ba210 === '') {
    return;
  }
  if (typeof Blob !== "undefined" && _0x3ba210 instanceof Blob) {
    _0x32cc25["append"](_0x2915af, _0x3ba210, multipartFileName(_0x3ba210, _0x22fc63));
    return;
  }
  if (Array['isArray'](_0x3ba210)) {
    _0x3ba210["forEach"]((_0x51be35, _0x2c8257) => appendMultipartValue(_0x32cc25, _0x2915af, _0x51be35, _0x2c8257));
    return;
  }
  if (typeof _0x3ba210 === 'object') {
    _0x32cc25["append"](_0x2915af, JSON["stringify"](_0x3ba210));
    return;
  }
  _0x32cc25['append'](_0x2915af, String(_0x3ba210));
}
function buildMultipartFormData(_0x40ab3f = {}) {
  const _0xed80d = new FormData();
  Object['entries'](_0x40ab3f || {})["forEach"](([_0x4580ff, _0x32c607]) => {
    appendMultipartValue(_0xed80d, _0x4580ff, _0x32c607);
  });
  return _0xed80d;
}
function getImageInputUploadPolicy(_0xfb43b = {}) {
  if (_0xfb43b['forceCustomProviderFreeImageHost'] === !![] || isCustomProviderModelManifest(_0xfb43b["modelManifest"])) {
    return {
      'provider': 'freeImageHost',
      'inputKinds': ['image'],
      'applyInputQualityProfile': !![],
      'strictUpload': !![]
    };
  }
  const _0x5d6dd6 = _0xfb43b["executionManifest"]?.["extensions"]?.["imageInputUpload"];
  return _0x5d6dd6 && typeof _0x5d6dd6 === "object" && !Array['isArray'](_0x5d6dd6) ? _0x5d6dd6 : null;
}
function shouldApplyImageInputUploadPolicy(_0x294e9d) {
  if (!_0x294e9d) {
    return ![];
  }
  const _0x3c9d88 = Array["isArray"](_0x294e9d["inputKinds"]) ? _0x294e9d['inputKinds']["map"](_0x546d77 => String(_0x546d77 || '')["trim"]()['toLowerCase']()) : ["image"];
  return _0x3c9d88["includes"]('image');
}
function resolveCustomProviderAssetUploadApiUrl(_0x1e26f5, _0x20ceee) {
  const _0xa57939 = String(_0x1e26f5 || '')['trim']();
  const _0x562117 = String(_0x20ceee || '')["trim"]();
  if (!_0xa57939 || !_0x562117["startsWith"]('/')) {
    throw new Error("Custom provider asset upload manifest is missing a relative endpoint");
  }
  let _0x51e847;
  let _0x5e530a;
  try {
    _0x51e847 = new URL(_0xa57939);
    _0x5e530a = new URL(_0x562117, _0x51e847["origin"]);
  } catch {
    throw new Error("Custom provider asset upload manifest has an invalid endpoint");
  }
  if (_0x5e530a["origin"] !== _0x51e847['origin'] || _0x5e530a["search"] || _0x5e530a["hash"]) {
    throw new Error("Custom provider asset upload endpoint must remain on the provider origin");
  }
  return _0x5e530a["toString"]();
}
function getCustomProviderAssetUploadOptions(_0x4c55ab, _0x56243) {
  return {
    'provider': "customProviderAsset",
    'apiUrl': resolveCustomProviderAssetUploadApiUrl(_0x56243, _0x4c55ab["endpoint"]),
    'multipartField': String(_0x4c55ab["multipartField"] || "file")["trim"]() || "file",
    'responsePath': String(_0x4c55ab["responsePath"] || "url")['trim']() || "url",
    ...(_0x4c55ab["formFields"] ? {
      'formFields': _0x4c55ab["formFields"]
    } : {}),
    'forceProviderUpload': _0x4c55ab["forceProviderUpload"] === !![],
    'allowedExtensions': Array["isArray"](_0x4c55ab['allowedExtensions']) ? _0x4c55ab["allowedExtensions"] : [],
    'maxBytes': _0x4c55ab["maxBytes"],
    'uploadTimeout': _0x4c55ab["uploadTimeout"],
    'compress': _0x4c55ab["compress"] === !![],
    'applyInputQualityProfile': _0x4c55ab["applyInputQualityProfile"] === !![],
    'strictUpload': _0x4c55ab["strictUpload"] !== ![]
  };
}
async function resolveConfiguredImageInputUpload(_0x334443, _0x1bb363, _0x514c10, _0x567ac0, _0x1e1782 = {}) {
  const _0x269849 = getImageInputUploadPolicy(_0x1e1782);
  if (!shouldApplyImageInputUploadPolicy(_0x269849)) {
    return {
      'handled': ![],
      'urls': []
    };
  }
  const _0x5b2340 = String(_0x269849['provider'] || '')['trim']();
  const _0x4f6525 = _0x5b2340["toLowerCase"]()["replace"](/[\s_-]+/g, '');
  if (_0x4f6525 === "freeimagehost") {
    if (typeof _0x567ac0["processInputImages"] !== "function") {
      throw new Error((_0x334443 || "modelApi") + '\x20image\x20input\x20upload\x20is\x20not\x20available');
    }
    const _0x524d1d = await uploadModelApiMediaInputs('image', _0x1bb363, _0x567ac0, {
      'fallbackProvider': "freeImageHost",
      'strictUpload': _0x269849["strictUpload"] !== ![],
      'uploadOptions': {
        'applyInputQualityProfile': _0x269849['applyInputQualityProfile'] !== ![]
      }
    });
    return {
      'handled': !![],
      'urls': _0x524d1d
    };
  }
  if (_0x4f6525 === "apimart") {
    if (typeof _0x567ac0['processInputImages'] !== 'function') {
      throw new Error((_0x334443 || "modelApi") + " image input upload is not available");
    }
    const _0x10d912 = getUploadProviderConfig(_0x567ac0, "apimart");
    const _0x4108b2 = await uploadModelApiMediaInputs("image", _0x1bb363, _0x567ac0, {
      'apiKey': _0x10d912['apiKey'] || '',
      'apiUrl': _0x10d912['apiUrl'],
      'fallbackProvider': "apimart",
      'strictUpload': _0x269849["strictUpload"] !== ![],
      'uploadOptions': {
        'applyInputQualityProfile': _0x269849["applyInputQualityProfile"] !== ![],
        'permanent': _0x269849['permanent'] === !![],
        'uploadTimeout': _0x269849["uploadTimeout"]
      }
    });
    return {
      'handled': !![],
      'urls': _0x4108b2
    };
  }
  if (_0x4f6525 === "grsai") {
    if (typeof _0x567ac0['processInputImages'] !== 'function') {
      throw new Error((_0x334443 || "modelApi") + " image input upload is not available");
    }
    const _0x41a35e = getUploadProviderConfig(_0x567ac0, "grsai");
    const _0x4ca9ec = await uploadModelApiMediaInputs("image", _0x1bb363, _0x567ac0, {
      'apiKey': _0x41a35e["apiKey"] || '',
      'fallbackProvider': "grsai",
      'strictUpload': _0x269849["strictUpload"] !== ![],
      'uploadOptions': {
        'applyInputQualityProfile': _0x269849["applyInputQualityProfile"] !== ![]
      }
    });
    return {
      'handled': !![],
      'urls': _0x4ca9ec
    };
  }
  if (_0x4f6525 === "runninghub") {
    if (typeof _0x567ac0['processInputImages'] !== 'function') {
      throw new Error((_0x334443 || "modelApi") + " image input upload is not available");
    }
    const _0x994e42 = getUploadProviderConfig(_0x567ac0, "runninghub");
    const _0x55db75 = await uploadModelApiMediaInputs("image", _0x1bb363, _0x567ac0, {
      'apiKey': _0x994e42["modelApiKey"] || _0x994e42["apiKey"] || '',
      'apiUrl': _0x994e42["apiUrl"],
      'providerProfileId': 'runninghub',
      'fallbackProvider': 'runninghub',
      'strictUpload': _0x269849["strictUpload"] !== ![],
      'uploadOptions': {
        'applyInputQualityProfile': _0x269849["applyInputQualityProfile"] !== ![]
      }
    });
    return {
      'handled': !![],
      'urls': _0x55db75
    };
  }
  if (_0x4f6525 === "volcenginefiles") {
    if (typeof _0x567ac0["uploadInputsToVolcengineFiles"] !== "function") {
      throw new Error("Volcengine file upload is not available");
    }
    const _0x3894ec = await _0x567ac0["uploadInputsToVolcengineFiles"](_0x1bb363, _0x514c10, {
      'baseUrl': _0x1e1782["baseUrl"],
      'kind': 'image',
      'model': _0x1e1782["executionManifest"]?.['model']
    });
    return {
      'handled': !![],
      'urls': _0x3894ec
    };
  }
  if (_0x4f6525 === "customproviderasset") {
    if (typeof _0x567ac0["processInputImages"] !== "function") {
      throw new Error((_0x334443 || 'modelApi') + '\x20image\x20input\x20upload\x20is\x20not\x20available');
    }
    const _0x36f3be = getCustomProviderAssetUploadOptions(_0x269849, _0x1e1782["baseUrl"]);
    const _0x583656 = await uploadModelApiMediaInputs("image", _0x1bb363, _0x567ac0, {
      'apiKey': _0x514c10,
      'fallbackProvider': 'customProviderAsset',
      'strictUpload': _0x269849["strictUpload"] !== ![],
      'uploadOptions': _0x36f3be
    });
    return {
      'handled': !![],
      'urls': _0x583656
    };
  }
  throw new Error("Unsupported image input upload provider: " + _0x5b2340);
}
function getMediaInputUploadPolicy(_0x409edd = {}, _0x1d0e23) {
  const _0x18ab41 = String(_0x1d0e23 || '')["trim"]()['toLowerCase']();
  const _0x3f38f9 = _0x18ab41 === "video" ? "videoInputUpload" : _0x18ab41 === "audio" ? "audioInputUpload" : '';
  const _0x5026ce = _0x3f38f9 ? _0x409edd["executionManifest"]?.["extensions"]?.[_0x3f38f9] : null;
  return _0x5026ce && typeof _0x5026ce === "object" && !Array["isArray"](_0x5026ce) ? _0x5026ce : null;
}
function shouldApplyMediaInputUploadPolicy(_0x4ff596, _0x301134) {
  if (!_0x4ff596) {
    return ![];
  }
  const _0x429db8 = String(_0x301134 || '')["trim"]()["toLowerCase"]();
  const _0x19d988 = Array["isArray"](_0x4ff596['inputKinds']) ? _0x4ff596["inputKinds"]["map"](_0x150e27 => String(_0x150e27 || '')["trim"]()["toLowerCase"]()) : [_0x429db8];
  return _0x19d988["includes"](_0x429db8);
}
function getUploadProviderConfig(_0x3b0aed, _0x2d17c8) {
  return typeof _0x3b0aed["getProviderConfig"] === "function" ? _0x3b0aed['getProviderConfig'](_0x2d17c8) : {};
}
async function resolveConfiguredMediaInputUpload(_0x29fe00, _0x37ea62, _0x4b5062, _0x87d967, _0x13723c, _0x4dbc6a = {}) {
  const _0x24b00a = getMediaInputUploadPolicy(_0x4dbc6a, _0x37ea62);
  if (!shouldApplyMediaInputUploadPolicy(_0x24b00a, _0x37ea62)) {
    return {
      'handled': ![],
      'urls': []
    };
  }
  const _0x1c8362 = String(_0x24b00a["provider"] || '')["trim"]();
  const _0x589f44 = _0x1c8362["toLowerCase"]()["replace"](/[\s_-]+/g, '');
  if (_0x589f44 === "runninghub") {
    const _0x22374b = await uploadModelApiMediaInputs(_0x37ea62, _0x4b5062, _0x13723c, {
      'strictUpload': _0x24b00a["strictUpload"] !== ![],
      ...(_0x29fe00 === "runninghub" ? {
        'apiKey': _0x87d967,
        'apiUrl': _0x4dbc6a["baseUrl"],
        'providerProfileId': _0x4dbc6a["providerProfileId"]
      } : {})
    });
    return {
      'handled': !![],
      'urls': _0x22374b
    };
  }
  if (_0x589f44 === 'customproviderasset') {
    if (_0x37ea62 === "video" && typeof _0x13723c["processInputVideos"] !== 'function' || _0x37ea62 === "audio" && typeof _0x13723c["processInputAudios"] !== 'function') {
      throw new Error((_0x29fe00 || "modelApi") + '\x20' + _0x37ea62 + '\x20input\x20upload\x20is\x20not\x20available');
    }
    const _0x1955e8 = getCustomProviderAssetUploadOptions(_0x24b00a, _0x4dbc6a['baseUrl']);
    const _0x5ba6e9 = await uploadModelApiMediaInputs(_0x37ea62, _0x4b5062, _0x13723c, {
      'apiKey': _0x87d967,
      'fallbackProvider': "customProviderAsset",
      'strictUpload': _0x24b00a["strictUpload"] !== ![],
      'uploadOptions': _0x1955e8
    });
    return {
      'handled': !![],
      'urls': _0x5ba6e9
    };
  }
  throw new Error("Unsupported " + _0x37ea62 + '\x20input\x20upload\x20provider:\x20' + _0x1c8362);
}
async function resolveInputImages(_0x1bd352, _0xd314b5, _0x19a76e, _0xdb4c53, _0x4e347e = {}) {
  const _0x4a6639 = getManifestMaxInputCount(_0x4e347e["modelManifest"], "image");
  if (_0x4a6639 === 0x0) {
    return [];
  }
  const _0x42e7ae = Array["isArray"](_0xd314b5["inputUrls"]) ? _0xd314b5["inputUrls"] : [];
  if (_0x42e7ae["length"] === 0x0) {
    return [];
  }
  const _0x460509 = _0x4a6639 === null ? _0x42e7ae : _0x42e7ae['slice'](0x0, _0x4a6639);
  assertNoUnsupportedApimartAssetUrls(_0x1bd352, _0x460509, _0x4e347e, 'image');
  const _0x57425e = await resolveConfiguredImageInputUpload(_0x1bd352, _0x460509, _0x19a76e, _0xdb4c53, _0x4e347e);
  if (_0x57425e["handled"]) {
    return _0x57425e["urls"];
  }
  if (_0x1bd352 === "ppio") {
    const _0x381c55 = await uploadModelApiMediaInputs("image", _0x460509, _0xdb4c53, {
      'strictUpload': !![],
      'uploadOptions': {
        'applyInputQualityProfile': !![]
      }
    });
    if (_0x381c55["length"] === 0x0) {
      throw new Error("参考图片上传失败：未返回有效图片地址，已停止生成，请重试或重新选择图片");
    }
    return _0x381c55;
  }
  if (_0x1bd352 === 'volcengine') {
    if (typeof _0xdb4c53["uploadInputsToVolcengineFiles"] !== 'function') {
      throw new Error("Volcengine file upload is not available");
    }
    return _0xdb4c53["uploadInputsToVolcengineFiles"](_0x460509, _0x19a76e, {
      'baseUrl': _0x4e347e["baseUrl"],
      'kind': 'image',
      'model': _0x4e347e["executionManifest"]?.["model"]
    });
  }
  const _0x56a4a3 = _0x1bd352 === 'apimart' || _0x1bd352 === "grsai" || _0x1bd352 === "runninghub";
  const _0x211781 = _0x1bd352 === "apimart" || _0x1bd352 === "runninghub";
  return uploadModelApiMediaInputs("image", _0x460509, _0xdb4c53, {
    ...(_0x56a4a3 ? {
      'apiKey': _0x19a76e,
      'fallbackProvider': _0x1bd352
    } : {}),
    'strictUpload': !![],
    ...(_0x211781 ? {
      'apiUrl': _0x4e347e["baseUrl"],
      'providerProfileId': _0xd314b5["providerProfileId"]
    } : {}),
    'uploadOptions': {
      'applyInputQualityProfile': !![]
    }
  });
}
function normalizeInputUrlsBySlot(_0x5a1825) {
  if (!_0x5a1825 || typeof _0x5a1825 !== 'object' || Array["isArray"](_0x5a1825)) {
    return {};
  }
  return Object['fromEntries'](Object["entries"](_0x5a1825)["map"](([_0x418802, _0xa5dff8]) => [String(_0x418802 || '')["trim"](), String(_0xa5dff8 || '')["trim"]()])['filter'](([_0x5ecf1f, _0x372a99]) => _0x5ecf1f && _0x372a99));
}
function getOrderedInputSlotEntries(_0x5a06b5 = {}, _0x4a7c54 = null) {
  const _0x23a03c = normalizeInputUrlsBySlot(_0x5a06b5);
  const _0x226e1a = Array['isArray'](_0x4a7c54?.["inputSlots"]?.["fixedSlots"]) ? _0x4a7c54["inputSlots"]["fixedSlots"] : [];
  const _0xdcc6f9 = new Map(_0x226e1a["map"](_0x24aede => [String(_0x24aede?.['id'] || '')["trim"](), String(_0x24aede?.["kind"] || '')["trim"]()["toLowerCase"]()])["filter"](([_0x13f3a2]) => _0x13f3a2));
  const _0x5cc52c = _0x226e1a["filter"](_0x38046b => String(_0x38046b?.["kind"] || '')["trim"]()["toLowerCase"]() === 'image')["map"](_0x3bec8a => String(_0x3bec8a?.['id'] || '')['trim']())["filter"](Boolean);
  const _0x1a27c7 = new Set();
  const _0x2ec4ee = [];
  _0x5cc52c["forEach"](_0x1cbec2 => {
    const _0x104d4e = _0x23a03c[_0x1cbec2];
    if (!_0x104d4e || _0x1a27c7["has"](_0x1cbec2)) {
      return;
    }
    _0x2ec4ee["push"]({
      'slot': _0x1cbec2,
      'url': _0x104d4e
    });
    _0x1a27c7['add'](_0x1cbec2);
  });
  Object['entries'](_0x23a03c)['forEach'](([_0x199d98, _0x1dac3d]) => {
    if (_0x1a27c7['has'](_0x199d98)) {
      return;
    }
    const _0x7b5d44 = _0xdcc6f9['get'](_0x199d98);
    if (_0x7b5d44 && _0x7b5d44 !== "image") {
      return;
    }
    _0x2ec4ee["push"]({
      'slot': _0x199d98,
      'url': _0x1dac3d
    });
    _0x1a27c7["add"](_0x199d98);
  });
  return _0x2ec4ee;
}
async function resolveInputImagesBySlot(_0x217e00, _0x2ae81f, _0x2d0736, _0xaf221b, _0x25b84e = {}) {
  const _0x7a0561 = getOrderedInputSlotEntries(_0x2ae81f?.["inputUrlsBySlot"], _0x25b84e['modelManifest']);
  if (_0x7a0561["length"] === 0x0) {
    return {};
  }
  const _0x5e120e = getManifestMaxInputCount(_0x25b84e["modelManifest"], "image");
  const _0x3f1f4f = _0x5e120e === null ? _0x7a0561 : _0x7a0561['slice'](0x0, Math["max"](0x0, _0x5e120e));
  const _0x3a10f3 = await resolveInputImages(_0x217e00, {
    ..._0x2ae81f,
    'inputUrls': _0x3f1f4f["map"](_0x5c0c33 => _0x5c0c33["url"])
  }, _0x2d0736, _0xaf221b, _0x25b84e);
  return Object['fromEntries'](_0x3f1f4f["map"]((_0x44a285, _0x1b8974) => [_0x44a285["slot"], String(_0x3a10f3[_0x1b8974] || '')["trim"]()])["filter"](([, _0x5a57fe]) => _0x5a57fe));
}
function normalizeInputList(_0x5edc57) {
  return Array["isArray"](_0x5edc57) ? _0x5edc57['map'](_0x2a5b3a => String(_0x2a5b3a || '')["trim"]())["filter"](Boolean) : [];
}
function isApimartPrivateAssetUrl(_0x50c5d0) {
  return /^asset:\/\//i["test"](String(_0x50c5d0 || '')["trim"]());
}
function assertNoUnsupportedApimartAssetUrls(_0x4ccdaf, _0x384537, _0x194b8c = {}, _0x253909 = "image") {
  if (String(_0x4ccdaf || '')["trim"]()["toLowerCase"]() !== "apimart") {
    return;
  }
  if (_0x194b8c["executionManifest"]?.["extensions"]?.["allowApimartAssetUrls"] === !![]) {
    return;
  }
  const _0x1aedc9 = normalizeInputList(_0x384537)["find"](isApimartPrivateAssetUrl);
  if (!_0x1aedc9) {
    return;
  }
  const _0x448d85 = _0x253909 === "video" ? '视频' : _0x253909 === "audio" ? '音频' : '图片';
  throw new Error("APIMart " + _0x448d85 + "输入不支持 asset:// 私有素材 URL；请连接原始素材，或使用可公网访问的 " + _0x448d85 + " URL 后重试");
}
function collectVideoInputUrls(_0x2d6517) {
  return Array['from'](new Set([String(_0x2d6517["videoUrl"] || '')["trim"](), ...normalizeInputList(_0x2d6517["videos"]), ...normalizeInputList(_0x2d6517["videoUrls"])]["filter"](Boolean)));
}
function collectAudioInputUrls(_0x13e4d3) {
  return Array["from"](new Set([String(_0x13e4d3['audioUrl'] || '')["trim"](), ...normalizeInputList(_0x13e4d3["audios"]), ...normalizeInputList(_0x13e4d3["audioUrls"])]["filter"](Boolean)));
}
function collectVideoImageInputUrls(_0x12cb51) {
  const _0x57e672 = Array["isArray"](_0x12cb51["images"]) ? _0x12cb51["images"] : Array["isArray"](_0x12cb51["inputUrls"]) ? _0x12cb51["inputUrls"] : [];
  return Array["from"](new Set(_0x57e672["map"](_0x2278a4 => String(_0x2278a4 || '')["trim"]())["filter"](Boolean)));
}
function validateStrictVideoInputCounts(_0x36a3b9, _0x22368b, _0x131211) {
  if (_0x131211?.["extensions"]?.["strictInputCounts"] !== !![]) {
    return;
  }
  const _0x5724d1 = {
    'image': Array["from"](new Set([...collectRawImageInputUrls(_0x36a3b9, _0x22368b), ...collectVideoImageInputUrls(_0x36a3b9)])),
    'video': collectVideoInputUrls(_0x36a3b9),
    'audio': collectAudioInputUrls(_0x36a3b9)
  };
  const _0x1cc04f = {
    'image': "参考图",
    'video': "参考视频",
    'audio': "参考音频"
  };
  for (const [_0x4de780, _0x2b6611] of Object["entries"](_0x5724d1)) {
    const _0x5e9d0d = getManifestMaxInputCount(_0x22368b, _0x4de780);
    const _0x26f539 = _0x22368b?.["inputSlots"]?.["allowedKinds"];
    const _0x3bc903 = _0x5e9d0d === null && Array["isArray"](_0x26f539) && !_0x26f539['map'](_0x1afbb9 => String(_0x1afbb9 || '')['trim']())['includes'](_0x4de780) ? 0x0 : _0x5e9d0d;
    if (_0x3bc903 !== null && _0x2b6611['length'] > _0x3bc903) {
      throw new Error((_0x22368b["displayName"] || "当前模型") + "最多支持 " + _0x3bc903 + '\x20个' + _0x1cc04f[_0x4de780] + "，当前传入 " + _0x2b6611["length"] + " 个，请删减后重试");
    }
  }
}
function resolveStrictUiSchemaFieldLabel(_0x230cf5) {
  const _0x5bf7bd = String(_0x230cf5?.['id'] || '')["trim"]();
  const _0x4bab2e = {
    'aspectRatio': '比例',
    'batchSize': "生成数量",
    'imageSize': "图片分辨率",
    'qualityLevel': '质量'
  };
  return _0x4bab2e[_0x5bf7bd] || String(_0x230cf5?.["label"] || _0x5bf7bd || '参数')["trim"]();
}
function readExplicitUiSchemaValue(_0x33901f, _0x30a579) {
  const _0x1ca446 = _0x33901f?.["generationParams"] && typeof _0x33901f["generationParams"] === "object" && !Array['isArray'](_0x33901f["generationParams"]) ? _0x33901f["generationParams"] : {};
  if (Object["prototype"]["hasOwnProperty"]["call"](_0x1ca446, _0x30a579)) {
    return {
      'provided': !![],
      'value': _0x1ca446[_0x30a579]
    };
  }
  if (Object["prototype"]["hasOwnProperty"]["call"](_0x33901f || {}, _0x30a579)) {
    return {
      'provided': !![],
      'value': _0x33901f[_0x30a579]
    };
  }
  return {
    'provided': ![],
    'value': undefined
  };
}
function isSameStrictUiSchemaOption(_0x2c955d, _0x5c6af6) {
  const _0x16d814 = Number(_0x2c955d);
  const _0x5e0e84 = Number(_0x5c6af6);
  if (String(_0x2c955d ?? '')['trim']() !== '' && String(_0x5c6af6 ?? '')['trim']() !== '' && Number["isFinite"](_0x16d814) && Number["isFinite"](_0x5e0e84)) {
    return _0x16d814 === _0x5e0e84;
  }
  return String(_0x2c955d ?? '')["trim"]()["toLowerCase"]() === String(_0x5c6af6 ?? '')["trim"]()["toLowerCase"]();
}
function validateStrictModelUiSchemaParams(_0x3019c1, _0x4736fe, _0x2bda52) {
  if (_0x2bda52?.['extensions']?.['strictUiSchemaParams'] !== !![]) {
    return;
  }
  const _0x362c44 = Array["isArray"](_0x4736fe?.['uiSchema']?.["fields"]) ? _0x4736fe["uiSchema"]["fields"] : [];
  const _0x34e12e = String(_0x4736fe?.['displayName'] || _0x4736fe?.["modelId"] || "当前模型")['trim']();
  for (const _0x29ced9 of _0x362c44) {
    const _0x268103 = String(_0x29ced9?.['id'] || '')["trim"]();
    if (!_0x268103) {
      continue;
    }
    const _0x1bbf2c = readExplicitUiSchemaValue(_0x3019c1, _0x268103);
    if (!_0x1bbf2c["provided"] || _0x1bbf2c["value"] === undefined || _0x1bbf2c["value"] === null || String(_0x1bbf2c["value"])["trim"]() === '') {
      continue;
    }
    const _0x5b8ae7 = (Array['isArray'](_0x29ced9?.["options"]) ? _0x29ced9["options"] : [])["map"](_0x1cc859 => _0x1cc859 && typeof _0x1cc859 === "object" && !Array["isArray"](_0x1cc859) ? _0x1cc859["value"] : _0x1cc859);
    const _0xa00b8f = resolveStrictUiSchemaFieldLabel(_0x29ced9);
    if (_0x5b8ae7['length'] > 0x0 && !_0x5b8ae7["some"](_0x81a406 => isSameStrictUiSchemaOption(_0x81a406, _0x1bbf2c["value"]))) {
      throw new Error('便宜渠道\x20' + _0x34e12e + '\x20的' + _0xa00b8f + "不支持“" + _0x1bbf2c['value'] + "”，可选：" + _0x5b8ae7['join']('\x20/\x20'));
    }
    const _0x2b9d48 = String(_0x29ced9?.["type"] || '')["trim"]()["toLowerCase"]();
    if (_0x2b9d48 === 'toggle') {
      const _0x17f921 = String(_0x1bbf2c["value"])["trim"]()['toLowerCase']();
      if (_0x1bbf2c["value"] !== !![] && _0x1bbf2c["value"] !== ![] && !['true', "false", '1', '0', "yes", 'no', 'on', "off"]["includes"](_0x17f921)) {
        throw new Error("便宜渠道 " + _0x34e12e + '\x20的' + _0xa00b8f + "只能开启或关闭");
      }
      continue;
    }
    if (!["slider", "stepper"]["includes"](_0x2b9d48) || _0x5b8ae7["length"] > 0x0) {
      continue;
    }
    const _0x183e36 = Number(_0x1bbf2c["value"]);
    const _0x2716e8 = Number(_0x29ced9?.["min"]);
    const _0x44cecf = Number(_0x29ced9?.['max']);
    const _0x59968b = Number(_0x29ced9?.["step"]);
    if (!Number["isFinite"](_0x183e36)) {
      throw new Error("便宜渠道 " + _0x34e12e + '\x20的' + _0xa00b8f + "必须是数字");
    }
    if (Number["isFinite"](_0x2716e8) && _0x183e36 < _0x2716e8) {
      throw new Error("便宜渠道 " + _0x34e12e + '\x20的' + _0xa00b8f + "不能小于 " + _0x2716e8);
    }
    if (Number["isFinite"](_0x44cecf) && _0x183e36 > _0x44cecf) {
      throw new Error("便宜渠道 " + _0x34e12e + '\x20的' + _0xa00b8f + "不能大于 " + _0x44cecf);
    }
    if (Number['isFinite'](_0x59968b) && _0x59968b > 0x0 && Number['isFinite'](_0x2716e8) && Math['abs']((_0x183e36 - _0x2716e8) / _0x59968b - Math["round"]((_0x183e36 - _0x2716e8) / _0x59968b)) > 1e-9) {
      throw new Error('便宜渠道\x20' + _0x34e12e + '\x20的' + _0xa00b8f + "必须按 " + _0x59968b + " 递增");
    }
  }
}
function validateStrictImageInputCounts(_0x349e48, _0x5e4431, _0x3dd8f8) {
  if (_0x3dd8f8?.["extensions"]?.["strictInputCounts"] !== !![]) {
    return;
  }
  const _0x5c6343 = getManifestMaxInputCount(_0x5e4431, "image");
  if (_0x5c6343 === null) {
    return;
  }
  const _0x48f2be = Array["from"](new Set([...collectRawImageInputUrls(_0x349e48, _0x5e4431), ...(Array["isArray"](_0x349e48?.["images"]) ? _0x349e48['images'] : [])]["map"](_0x503f88 => String(_0x503f88 || '')['trim']())["filter"](Boolean)));
  if (_0x48f2be['length'] <= _0x5c6343) {
    return;
  }
  throw new Error((_0x5e4431["displayName"] || "当前模型") + "最多支持 " + _0x5c6343 + " 张参考图，当前传入 " + _0x48f2be['length'] + " 张，请删减后重试");
}
function omitSlotImageUrlsFromVideoInputs(_0x3c96b1 = {}) {
  const _0x214f47 = new Set(Object['values'](normalizeInputUrlsBySlot(_0x3c96b1["inputUrlsBySlot"]))["map"](_0x13995d => String(_0x13995d || '')["trim"]())["filter"](Boolean));
  if (_0x214f47['size'] === 0x0) {
    return _0x3c96b1;
  }
  const _0x1b0af8 = _0x181881 => Array['isArray'](_0x181881) ? _0x181881['filter'](_0x5eccc2 => !_0x214f47["has"](String(_0x5eccc2 || '')["trim"]())) : _0x181881;
  return {
    ..._0x3c96b1,
    'images': _0x1b0af8(_0x3c96b1['images']),
    'inputUrls': _0x1b0af8(_0x3c96b1["inputUrls"])
  };
}
const VIDEO_MODEL_API_PROVIDERS = new Set(["bailian", "agnes", "apimart", "binghuo", "grsai", 'minimax', 'runninghub', 'volcengine']);
const IMAGE_MODEL_API_PROVIDERS = new Set(["bailian", "agnes", "apimart", "binghuo", 'ppio', "grsai", "runninghub", "volcengine"]);
const AUDIO_MODEL_API_PROVIDERS = new Set(["volcengine-speech"]);
function getProviderUploadLabel(_0x9cac7e) {
  const _0x4b7d29 = String(_0x9cac7e || '')["trim"]()["toLowerCase"]();
  if (_0x4b7d29 === "agnes") {
    return "Agnes AI";
  }
  if (_0x4b7d29 === "runninghub") {
    return 'RunningHub';
  }
  if (_0x4b7d29 === "apimart") {
    return "APIMART";
  }
  if (_0x4b7d29 === "volcengine") {
    return "Volcengine";
  }
  return _0x4b7d29 || 'Model\x20API';
}
function isVolcengineContentGenerationMediaUrl(_0x50d315) {
  return /^(?:https?:|asset:\/\/)/i["test"](String(_0x50d315 || '')["trim"]());
}
function getVolcengineContentGenerationMediaLabel(_0x59d806) {
  if (_0x59d806 === "image") {
    return '图片';
  }
  if (_0x59d806 === "video") {
    return '视频';
  }
  if (_0x59d806 === "audio") {
    return '音频';
  }
  return '素材';
}
function isVolcengineFileId(_0x49a58c) {
  return /^file-[A-Za-z0-9_-]+/['test'](String(_0x49a58c || '')["trim"]());
}
function throwVolcengineFilesApiInputError(_0x4c8506) {
  const _0x5435de = getVolcengineContentGenerationMediaLabel(_0x4c8506);
  throw new Error("Volcengine Seedance " + _0x5435de + " input cannot use Files API file_id directly; use a public URL or asset:// asset ID");
}
function assertNoVolcengineFileIds(_0x29d955, _0x5b8839) {
  for (const _0x426a53 of normalizeInputList(_0x29d955)) {
    if (isVolcengineFileId(_0x426a53)) {
      throwVolcengineFilesApiInputError(_0x5b8839);
    }
  }
}
function resolveVolcengineContentGenerationMediaUrls(_0x3b6509, _0x2393d4) {
  const _0x2227e9 = getVolcengineContentGenerationMediaLabel(_0x2393d4);
  const _0xefb603 = [];
  for (const _0x53058a of normalizeInputList(_0x3b6509)) {
    if (isVolcengineContentGenerationMediaUrl(_0x53058a)) {
      _0xefb603['push'](_0x53058a);
      continue;
    }
    isVolcengineFileId(_0x53058a) && throwVolcengineFilesApiInputError(_0x2393d4);
    throw new Error("Volcengine Seedance " + _0x2227e9 + " input needs a public URL or asset:// asset ID; local files require an upload channel that returns a model-usable URL");
  }
  return _0xefb603;
}
async function resolveVideoInputImages(_0xeea64c, _0x8343cc, _0x59a8cb, _0x24b359 = {}) {
  const _0x59383d = String(_0x24b359["provider"] || "apimart")["trim"]()["toLowerCase"]();
  const _0x42c36d = getProviderUploadLabel(_0x59383d);
  const _0x40c779 = getManifestMaxInputCount(_0x24b359["modelManifest"], "image");
  if (_0x40c779 === 0x0) {
    return [];
  }
  const _0x448cfa = collectVideoImageInputUrls(_0xeea64c);
  if (_0x448cfa["length"] === 0x0) {
    return [];
  }
  const _0x941a1f = _0x40c779 === null ? _0x448cfa : _0x448cfa["slice"](0x0, Math['max'](0x0, _0x40c779));
  _0x59383d === "volcengine" && assertNoVolcengineFileIds(_0x941a1f, "image");
  assertNoUnsupportedApimartAssetUrls(_0x59383d, _0x941a1f, _0x24b359, "image");
  const _0x41dc62 = await resolveConfiguredImageInputUpload(_0x59383d, _0x941a1f, _0x8343cc, _0x59a8cb, _0x24b359);
  if (_0x41dc62["handled"]) {
    return Array["isArray"](_0x41dc62["urls"]) ? _0x41dc62["urls"]["map"](_0x146aec => String(_0x146aec || '')["trim"]())["filter"](Boolean) : [];
  }
  if (_0x59383d === "volcengine") {
    if (isConfiguredObjectStorageEnabled()) {
      return await uploadModelApiMediaInputs("image", _0x941a1f, _0x59a8cb, {
        'strictUpload': !![]
      });
    }
    return resolveVolcengineContentGenerationMediaUrls(_0x941a1f, "image");
  }
  if (typeof _0x59a8cb["processInputImages"] !== "function") {
    throw new Error(_0x42c36d + " image input upload is not available");
  }
  const _0x7e10e0 = _0x59383d === "apimart" || _0x59383d === "grsai" || _0x59383d === 'runninghub';
  const _0xce8c23 = _0x59383d === "apimart" || _0x59383d === "runninghub";
  const _0x3dd682 = await uploadModelApiMediaInputs('image', _0x941a1f, _0x59a8cb, {
    ...(_0x7e10e0 ? {
      'apiKey': _0x8343cc,
      'fallbackProvider': _0x59383d
    } : {}),
    ...(_0xce8c23 ? {
      'apiUrl': _0x24b359['baseUrl'],
      'providerProfileId': _0xeea64c["providerProfileId"]
    } : {}),
    'uploadOptions': {
      'applyInputQualityProfile': !![]
    },
    'strictUpload': !![]
  });
  return Array['isArray'](_0x3dd682) ? _0x3dd682["map"](_0x518bbd => String(_0x518bbd || '')["trim"]())["filter"](Boolean) : [];
}
async function resolveInputVideos(_0x3a612d, _0x34df9a, _0x1ca515, _0x1ae769 = {}) {
  const _0x137e9d = String(_0x1ae769['provider'] || "apimart")['trim']()['toLowerCase']();
  const _0xfc8f47 = getProviderUploadLabel(_0x137e9d);
  const _0x3a28a3 = getManifestMaxInputCount(_0x1ae769["modelManifest"], "video");
  if (_0x3a28a3 === 0x0) {
    return [];
  }
  const _0x1275bf = collectVideoInputUrls(_0x3a612d);
  if (_0x1275bf["length"] === 0x0) {
    return [];
  }
  const _0x9f2069 = _0x3a28a3 === null ? _0x1275bf : _0x1275bf['slice'](0x0, _0x3a28a3);
  _0x137e9d === "volcengine" && assertNoVolcengineFileIds(_0x9f2069, "video");
  assertNoUnsupportedApimartAssetUrls(_0x137e9d, _0x9f2069, _0x1ae769, "video");
  const _0x5e8938 = await resolveConfiguredMediaInputUpload(_0x137e9d, "video", _0x9f2069, _0x34df9a, _0x1ca515, _0x1ae769);
  if (_0x5e8938['handled']) {
    return Array['isArray'](_0x5e8938["urls"]) ? _0x5e8938['urls']["map"](_0x185950 => String(_0x185950 || '')["trim"]())['filter'](Boolean) : [];
  }
  if (_0x137e9d === "volcengine") {
    if (isConfiguredObjectStorageEnabled()) {
      return await uploadModelApiMediaInputs('video', _0x9f2069, _0x1ca515, {
        'strictUpload': !![]
      });
    }
    return resolveVolcengineContentGenerationMediaUrls(_0x9f2069, "video");
  }
  if (typeof _0x1ca515["processInputVideos"] !== "function") {
    throw new Error(_0xfc8f47 + '：缺少视频上传能力，请更新应用后重试');
  }
  const _0x391e34 = await uploadModelApiMediaInputs("video", _0x9f2069, _0x1ca515, {
    'strictUpload': !![],
    ...(_0x137e9d === "runninghub" ? {
      'apiKey': _0x34df9a,
      'apiUrl': _0x1ae769["baseUrl"],
      'providerProfileId': _0x3a612d['providerProfileId']
    } : {})
  });
  if (!Array["isArray"](_0x391e34) || _0x391e34["length"] === 0x0) {
    throw new Error(_0xfc8f47 + " 视频上传失败：未返回有效视频地址，请重试或重新选择视频");
  }
  return _0x391e34['map'](_0x94d332 => String(_0x94d332 || '')['trim']())["filter"](Boolean);
}
async function resolveInputAudios(_0x48bba0, _0x423ada, _0x420495, _0x25961f = {}) {
  const _0x2c6b12 = String(_0x25961f["provider"] || "apimart")["trim"]()["toLowerCase"]();
  const _0x1ae28a = getProviderUploadLabel(_0x2c6b12);
  const _0x3d653f = getManifestMaxInputCount(_0x25961f["modelManifest"], "audio");
  if (_0x3d653f === 0x0) {
    return [];
  }
  const _0x5d27f4 = collectAudioInputUrls(_0x48bba0);
  if (_0x5d27f4["length"] === 0x0) {
    return [];
  }
  const _0x25b967 = _0x3d653f === null ? _0x5d27f4 : _0x5d27f4["slice"](0x0, _0x3d653f);
  _0x2c6b12 === 'volcengine' && assertNoVolcengineFileIds(_0x25b967, 'audio');
  assertNoUnsupportedApimartAssetUrls(_0x2c6b12, _0x25b967, _0x25961f, "audio");
  const _0x18857e = await resolveConfiguredMediaInputUpload(_0x2c6b12, "audio", _0x25b967, _0x423ada, _0x420495, _0x25961f);
  if (_0x18857e["handled"]) {
    return Array['isArray'](_0x18857e["urls"]) ? _0x18857e["urls"]['map'](_0x41c79d => String(_0x41c79d || '')['trim']())["filter"](Boolean) : [];
  }
  if (_0x2c6b12 === 'volcengine') {
    if (isConfiguredObjectStorageEnabled()) {
      return await uploadModelApiMediaInputs('audio', _0x25b967, _0x420495, {
        'strictUpload': !![]
      });
    }
    return resolveVolcengineContentGenerationMediaUrls(_0x25b967, "audio");
  }
  if (typeof _0x420495["processInputAudios"] !== "function") {
    throw new Error(_0x1ae28a + "：缺少音频上传能力，请更新应用后重试");
  }
  const _0x399ff1 = await uploadModelApiMediaInputs('audio', _0x25b967, _0x420495, {
    'strictUpload': !![],
    ...(_0x2c6b12 === "runninghub" ? {
      'apiKey': _0x423ada,
      'apiUrl': _0x25961f["baseUrl"],
      'providerProfileId': _0x48bba0['providerProfileId']
    } : {})
  });
  if (!Array["isArray"](_0x399ff1) || _0x399ff1['length'] === 0x0) {
    throw new Error(_0x1ae28a + " 音频上传失败：未返回有效音频地址，请重试或重新选择音频");
  }
  return _0x399ff1["map"](_0x121985 => String(_0x121985 || '')["trim"]())["filter"](Boolean);
}
function resolveProviderRatioSize(_0x28b212, {
  context: _0x824cf
}) {
  const _0x40ad96 = _0x824cf["payload"] || {};
  if (_0x40ad96["suppressAspectRatio"]) {
    return undefined;
  }
  const _0x3699d4 = String(_0x28b212 || _0x40ad96['resolvedRatioLabel'] || _0x40ad96["aspectRatio"] || '')["trim"]()["toLowerCase"]();
  const _0x1f3e2f = _0x3699d4 === "auto" || _0x3699d4 === "adaptive" || _0x3699d4 === "default" || _0x3699d4 === "自适应";
  const _0x54d02a = getApimartSeedreamPolicy(_0x824cf);
  if (_0x54d02a["preserveAdaptiveInputRatio"] === !![] && _0x1f3e2f && hasSeedreamInputImages(_0x824cf)) {
    return "auto";
  }
  const _0xccc3f8 = _0x824cf["body"]?.["resolution"] || _0x40ad96['imageSize'] || '2K';
  const _0x17e417 = resolveProviderRatioPayload({
    'provider': _0x824cf["provider"],
    'model': _0x40ad96["model"],
    'ratioLabel': _0x28b212 || _0x40ad96['resolvedRatioLabel'] || _0x40ad96["aspectRatio"],
    'imageSize': _0xccc3f8,
    'suppressAspectRatio': _0x40ad96["suppressAspectRatio"]
  });
  return _0x17e417?.["params"]?.["size"] || undefined;
}
function normalizeCustomProviderOpenAiImageSize(_0x200a6e, {
  context: _0x397e69
} = {}) {
  const _0xfb67be = _0x397e69?.["payload"] || {};
  const _0x44bf09 = String(_0x200a6e || _0xfb67be?.["generationParams"]?.["imageSize"] || _0xfb67be?.["imageSize"] || '1024x1024')["trim"]();
  const _0x1f14a9 = _0x44bf09["match"](/^(\d{2,5})\s*[xX×]\s*(\d{2,5})$/);
  if (_0x1f14a9) {
    return Number(_0x1f14a9[0x1]) + 'x' + Number(_0x1f14a9[0x2]);
  }
  const _0x43e875 = String(_0xfb67be?.["generationParams"]?.["aspectRatio"] || _0xfb67be?.["resolvedRatioLabel"] || _0xfb67be?.["aspectRatio"] || '')["trim"]();
  if (!_0x43e875 || isAdaptiveRatioLabel(_0x43e875)) {
    return "1024x1024";
  }
  const _0x35563b = parseRatioLabel(_0x43e875);
  if (!_0x35563b) {
    return "1024x1024";
  }
  const _0x3dce2c = _0x35563b['w'] / _0x35563b['h'];
  if (Math['abs'](_0x3dce2c - 0x1) < 0.05) {
    return "1024x1024";
  }
  return _0x3dce2c > 0x1 ? "1536x1024" : "1024x1536";
}
function normalizeCustomProviderDocumentedValueMap(_0x16dee3, {
  spec: _0x5f1d07
} = {}) {
  const _0xa028bb = Array["isArray"](_0x5f1d07?.["values"]) ? _0x5f1d07["values"] : [];
  const _0x260cb5 = _0xa028bb['find'](_0x508a8a => _0x508a8a && (Object['is'](_0x508a8a["uiValue"], _0x16dee3) || String(_0x508a8a["uiValue"]) === String(_0x16dee3)));
  if (!_0x260cb5 || !Object["prototype"]["hasOwnProperty"]['call'](_0x260cb5, "requestValue")) {
    throw new Error('Custom\x20provider\x20documented\x20value\x20mapping\x20is\x20missing\x20for\x20the\x20selected\x20option');
  }
  return _0x260cb5["requestValue"];
}
function normalizeCustomProviderDimensionMap(_0x5cf34d, {
  context: _0x2cf66,
  spec: _0x48981a
} = {}) {
  const _0xa55d4b = _0x2cf66?.["payload"] || {};
  const _0x2e5478 = _0xa55d4b["generationParams"] || {};
  const _0x5ce176 = _0x2e5478["imageSize"] ?? _0xa55d4b['imageSize'];
  const _0x3c4356 = _0x5cf34d ?? _0x2e5478["aspectRatio"] ?? _0xa55d4b["resolvedRatioLabel"] ?? _0xa55d4b["aspectRatio"];
  const _0x1cc1fc = Array["isArray"](_0x48981a?.["values"]) ? _0x48981a["values"] : [];
  const _0x14d307 = _0x1cc1fc["find"](_0x192752 => _0x192752 && String(_0x192752['imageSize']) === String(_0x5ce176) && String(_0x192752['aspectRatio']) === String(_0x3c4356));
  if (!_0x14d307 || !Object['prototype']["hasOwnProperty"]["call"](_0x14d307, "requestValue")) {
    throw new Error("Custom provider documented dimension mapping is missing for the selected resolution and ratio");
  }
  return _0x14d307["requestValue"];
}
function firstArrayItem(_0x56ada0) {
  if (Array["isArray"](_0x56ada0)) {
    return _0x56ada0[0x0] || undefined;
  }
  return _0x56ada0 || undefined;
}
function secondArrayItem(_0x3f8171) {
  if (Array["isArray"](_0x3f8171)) {
    return _0x3f8171[0x1] || undefined;
  }
  return undefined;
}
function normalizeBooleanParam(_0x9a6513) {
  if (_0x9a6513 === !![] || _0x9a6513 === ![]) {
    return _0x9a6513;
  }
  const _0xc2c615 = String(_0x9a6513 ?? '')['trim']()["toLowerCase"]();
  if (["true", '1', 'yes', 'on']["includes"](_0xc2c615)) {
    return !![];
  }
  if (["false", '0', 'no', 'off', '']["includes"](_0xc2c615)) {
    return ![];
  }
  return Boolean(_0x9a6513);
}
function normalizeNumberParam(_0x1275f8) {
  if (_0x1275f8 === undefined || _0x1275f8 === null || String(_0x1275f8)["trim"]() === '') {
    return undefined;
  }
  const _0x5509a1 = Number(_0x1275f8);
  return Number["isFinite"](_0x5509a1) ? _0x5509a1 : undefined;
}
function normalizeIntegerParam(_0x249ab1) {
  const _0x446479 = normalizeNumberParam(_0x249ab1);
  return Number["isFinite"](_0x446479) ? Math['trunc'](_0x446479) : undefined;
}
function normalizeStringParam(_0x211ef1) {
  if (_0x211ef1 === undefined || _0x211ef1 === null) {
    return undefined;
  }
  return String(_0x211ef1);
}
function normalizeApimartImageCount(_0x1b5b4e) {
  const _0x2f8fdd = Number["parseInt"](String(_0x1b5b4e ?? '')["trim"](), 0xa);
  if (!Number["isFinite"](_0x2f8fdd)) {
    return 0x1;
  }
  return Math["max"](0x1, Math["min"](0x4, _0x2f8fdd));
}
function normalizeApimartQwenImageCount(_0x1d9e66) {
  const _0x1f199b = Number["parseInt"](String(_0x1d9e66 ?? '')["trim"](), 0xa);
  if (!Number["isFinite"](_0x1f199b)) {
    return 0x1;
  }
  return Math["max"](0x1, Math["min"](0x6, _0x1f199b));
}
function normalizeApimartQwenImageResolution(_0x363ae1) {
  const _0x545180 = String(_0x363ae1 || '1K')["trim"]()["toUpperCase"]();
  return _0x545180 === '2K' ? '2K' : '1K';
}
function getApimartSeedreamPolicy(_0x350c78 = {}) {
  const _0x10df65 = _0x350c78["executionManifest"]?.["extensions"]?.["apimartSeedream"];
  return _0x10df65 && typeof _0x10df65 === "object" && !Array['isArray'](_0x10df65) ? _0x10df65 : {};
}
function getVolcengineSeedreamPolicy(_0x4b8d1f = {}) {
  const _0x5b47b2 = _0x4b8d1f["executionManifest"]?.["extensions"]?.["volcengineSeedream"];
  return _0x5b47b2 && typeof _0x5b47b2 === 'object' && !Array["isArray"](_0x5b47b2) ? _0x5b47b2 : {};
}
function normalizeResolutionList(_0x59dc19) {
  return Array["isArray"](_0x59dc19) ? _0x59dc19["map"](_0x63b347 => String(_0x63b347 || '')["trim"]()["toUpperCase"]())["filter"](Boolean) : [];
}
function normalizeApimartSeedreamResolution(_0x6d98eb, {
  context: _0x51b9aa
} = {}) {
  const _0x5e2ad7 = getApimartSeedreamPolicy(_0x51b9aa);
  const _0x2b9d34 = String(_0x6d98eb || '2K')["trim"]()['toUpperCase']();
  const _0x4bac4b = normalizeResolutionList(_0x5e2ad7["allowedResolutions"]);
  return _0x4bac4b["includes"](_0x2b9d34) ? _0x2b9d34 : '2K';
}
function normalizeVolcengineSeedreamResolution(_0x4bd5c8, {
  context: _0x169ecc
} = {}) {
  const _0x1fa322 = getVolcengineSeedreamPolicy(_0x169ecc);
  const _0x3e56d5 = String(_0x1fa322["defaultResolution"] || '2K')['trim']()["toUpperCase"]();
  const _0x272db2 = String(_0x4bd5c8 || _0x3e56d5)["trim"]()["toUpperCase"]();
  const _0x5d4e72 = normalizeResolutionList(_0x1fa322["allowedResolutions"]);
  return _0x5d4e72['includes'](_0x272db2) ? _0x272db2 : _0x3e56d5;
}
function hasSeedreamInputImages(_0x50b3a9 = {}) {
  if (Array["isArray"](_0x50b3a9["inputImages"]) && _0x50b3a9["inputImages"]["length"] > 0x0) {
    return !![];
  }
  const _0x2ef1ca = _0x50b3a9["payload"] || {};
  const _0x28a866 = [_0x2ef1ca["inputUrls"], _0x2ef1ca["image_urls"], _0x2ef1ca["imageUrls"], _0x2ef1ca["image"], _0x2ef1ca["images"]];
  return _0x28a866["some"](_0x5bbca3 => Array['isArray'](_0x5bbca3) ? _0x5bbca3["some"](_0x1b75f5 => String(_0x1b75f5 || '')["trim"]()) : String(_0x5bbca3 || '')["trim"]());
}
function hasManifestInputImages(_0x668209 = {}) {
  if (Array["isArray"](_0x668209["inputImages"]) && _0x668209["inputImages"]['length'] > 0x0) {
    return !![];
  }
  const _0x501f78 = _0x668209["payload"] || {};
  const _0x386214 = [_0x501f78['inputUrls'], _0x501f78["image_urls"], _0x501f78["imageUrls"], _0x501f78["image"], _0x501f78["images"]];
  return _0x386214["some"](_0x561b86 => Array["isArray"](_0x561b86) ? _0x561b86["some"](_0x47f59e => String(_0x47f59e || '')["trim"]()) : String(_0x561b86 || '')["trim"]()) || Object["values"](normalizeInputUrlsBySlot(_0x501f78['inputUrlsBySlot']))['some'](Boolean);
}
function normalizeApimartSeedreamImageCount(_0x40699f, {
  context: _0x4408c0
} = {}) {
  const _0x2f11ef = getApimartSeedreamPolicy(_0x4408c0);
  const _0x5a4c06 = Number['parseInt'](String(_0x40699f ?? '')["trim"](), 0xa);
  const _0x24fae8 = Number["isFinite"](_0x5a4c06) ? _0x5a4c06 : 0x1;
  const _0x25a574 = Number["parseInt"](String(_0x2f11ef["maxBatchSize"] ?? 0x1)["trim"](), 0xa);
  const _0x440f8f = Number['isFinite'](_0x25a574) && _0x25a574 >= 0x1 ? _0x25a574 : 0x1;
  const _0x397a56 = Math["max"](0x1, Math["min"](_0x440f8f, _0x24fae8));
  if (!hasSeedreamInputImages(_0x4408c0)) {
    const _0x509a3e = Number["parseInt"](String(_0x2f11ef['textToImageBatchSize'] ?? '')["trim"](), 0xa);
    if (Number["isFinite"](_0x509a3e) && _0x509a3e >= 0x1) {
      return Math["min"](_0x397a56, _0x509a3e);
    }
  }
  return _0x397a56;
}
function normalizeVolcengineSeedreamCountValue(_0x2dd199, _0x477c7c = {}) {
  const _0x5ed097 = getVolcengineSeedreamPolicy(_0x477c7c);
  const _0x18a620 = Number["parseInt"](String(_0x2dd199 ?? '')["trim"](), 0xa);
  const _0x16a59c = Number['isFinite'](_0x18a620) ? _0x18a620 : 0x1;
  const _0x1c7e8d = Number["parseInt"](String(_0x5ed097["maxBatchSize"] ?? 0x1)["trim"](), 0xa);
  const _0xa09ac9 = Number["isFinite"](_0x1c7e8d) && _0x1c7e8d >= 0x1 ? _0x1c7e8d : 0x1;
  return Math["max"](0x1, Math["min"](_0xa09ac9, _0x16a59c));
}
function normalizeVolcengineSeedreamImageCount(_0x20e3fa, {
  context: _0x110b81
} = {}) {
  const _0xe87913 = normalizeVolcengineSeedreamCountValue(_0x20e3fa, _0x110b81);
  return _0xe87913 > 0x1 ? _0xe87913 : undefined;
}
function resolveVolcengineSeedreamSequentialMode(_0x50749d, {
  context: _0x123054
} = {}) {
  const _0x12156a = normalizeVolcengineSeedreamCountValue(_0x50749d, _0x123054);
  return _0x12156a > 0x1 ? 'auto' : "disabled";
}
function resolveVolcengineSeedreamSize(_0x1f367c, {
  context: _0x4e25b4
} = {}) {
  const _0x548326 = _0x4e25b4?.["payload"] || {};
  const _0x3cdd4c = getVolcengineSeedreamPolicy(_0x4e25b4);
  const _0x3a3c48 = normalizeVolcengineSeedreamResolution(_0x548326["imageSize"], {
    'context': _0x4e25b4
  });
  if (_0x548326['suppressAspectRatio']) {
    return _0x3a3c48;
  }
  const _0x1c9603 = String(_0x1f367c || _0x548326["resolvedRatioLabel"] || _0x548326["aspectRatio"] || '')["trim"]();
  const _0x287cce = _0x1c9603["toLowerCase"]();
  const _0x3b225d = !_0x1c9603 || _0x287cce === 'auto' || _0x287cce === 'adaptive' || _0x287cce === "自适应";
  if (_0x3cdd4c["preserveAdaptiveInputRatio"] === !![] && _0x3cdd4c["supportsAdaptiveSize"] === !![] && _0x3b225d && hasSeedreamInputImages(_0x4e25b4)) {
    return 'adaptive';
  }
  const _0x2d1084 = resolveProviderRatioPayload({
    'provider': _0x4e25b4["provider"],
    'model': _0x548326["model"],
    'ratioLabel': _0x1c9603 || _0x548326['resolvedRatioLabel'] || _0x548326["aspectRatio"] || "1:1",
    'imageSize': _0x3a3c48,
    'suppressAspectRatio': ![]
  });
  const _0x36b6f0 = _0x2d1084?.["resolvedRatioLabel"] || '1:1';
  const _0xd53550 = _0x3cdd4c["dimensionMapByResolution"] && typeof _0x3cdd4c["dimensionMapByResolution"] === "object" ? _0x3cdd4c['dimensionMapByResolution'][_0x3a3c48] : null;
  if (_0xd53550?.[_0x36b6f0]) {
    return _0xd53550[_0x36b6f0];
  }
  const _0x57eef0 = Number(_0x2d1084?.["params"]?.["width"]);
  const _0x1790b3 = Number(_0x2d1084?.["params"]?.['height']);
  if (Number['isFinite'](_0x57eef0) && _0x57eef0 > 0x0 && Number['isFinite'](_0x1790b3) && _0x1790b3 > 0x0) {
    return Math["round"](_0x57eef0) + 'x' + Math['round'](_0x1790b3);
  }
  return _0x3a3c48;
}
function normalizeApimartWanImageResolution(_0x34d609, {
  context: _0x5d1fa9
} = {}) {
  const _0x1b60f9 = String(_0x34d609 || '2K')["trim"]()["toUpperCase"]();
  const _0x5b444d = String(_0x5d1fa9?.['modelToken'] || '')["trim"]()["toLowerCase"]();
  if (_0x1b60f9 === '1K') {
    return '1K';
  }
  if (_0x1b60f9 === '4K' && _0x5b444d === "wan2.7-image-pro" && !hasManifestInputImages(_0x5d1fa9)) {
    return '4K';
  }
  return '2K';
}
function normalizeApimartVideoResolutionUpper(_0x1c0586) {
  const _0x3c7f88 = String(_0x1c0586 || '720P')["trim"]()["toUpperCase"]();
  if (_0x3c7f88 === '1080P') {
    return "1080P";
  }
  if (_0x3c7f88 === '720P') {
    return '720P';
  }
  if (_0x3c7f88 === "540P") {
    return "540P";
  }
  if (_0x3c7f88 === "480P") {
    return '480P';
  }
  return "720P";
}
function normalizeApimartVideoResolutionLower(_0x4c3129) {
  const _0x5da5dd = String(_0x4c3129 || '720p')["trim"]()['toLowerCase']();
  if (_0x5da5dd === "1080p") {
    return "1080p";
  }
  return "720p";
}
function normalizeApimartVeo3VideoResolution(_0x3dd2b0) {
  const _0x2e319f = String(_0x3dd2b0 || "720p")["trim"]()["toLowerCase"]();
  if (_0x2e319f === '4k') {
    return '4k';
  }
  if (_0x2e319f === '1080p') {
    return "1080p";
  }
  return "720p";
}
function normalizeApimartViduQ3ModelToken(_0xafa917 = {}) {
  return String(_0xafa917?.['modelToken'] || _0xafa917?.["body"]?.["model"] || _0xafa917?.["payload"]?.["generationParams"]?.["mode"] || _0xafa917?.['payload']?.["mode"] || 'viduq3-turbo')["trim"]()['toLowerCase']();
}
function normalizeApimartViduVideoResolution(_0x10d749, {
  context: _0x1737e6
} = {}) {
  const _0x93aff6 = String(_0x10d749 || "720p")["trim"]()["toLowerCase"]();
  const _0x566f23 = normalizeApimartViduQ3ModelToken(_0x1737e6);
  if (_0x566f23 === 'viduq3-mix') {
    return _0x93aff6 === "1080p" ? "1080p" : "720p";
  }
  if (_0x93aff6 === "540p" || _0x93aff6 === '720p' || _0x93aff6 === "1080p") {
    return _0x93aff6;
  }
  return '720p';
}
function normalizeApimartViduVideoDuration(_0xa782b1, {
  context: _0x3c48da
} = {}) {
  const _0x4a311e = normalizeApimartViduQ3ModelToken(_0x3c48da);
  const _0x57ca8d = _0x4a311e === 'viduq3' ? 0x3 : 0x1;
  const _0x58cb2f = 0x10;
  const _0x2ac086 = Number(_0xa782b1);
  const _0x581efe = 0x5;
  const _0x4875de = Number["isFinite"](_0x2ac086) ? Math["trunc"](_0x2ac086) : _0x581efe;
  return Math["min"](_0x58cb2f, Math["max"](_0x57ca8d, _0x4875de));
}
function normalizeApimartHailuo23VideoResolution(_0x2c0f8e) {
  const _0x593212 = String(_0x2c0f8e || "768p")['trim']()["toLowerCase"]();
  if (_0x593212 === "1080p") {
    return "1080p";
  }
  return '768p';
}
function normalizeApimartHailuo23VideoDuration(_0x1a706b, {
  context: _0xb774e9
} = {}) {
  const _0x3e453a = String(_0xb774e9?.["body"]?.["resolution"] || _0xb774e9?.["payload"]?.['generationParams']?.["resolution"] || _0xb774e9?.["payload"]?.["resolution"] || '')["trim"]()['toLowerCase']();
  if (_0x3e453a === "1080p") {
    return 0x6;
  }
  return Number(_0x1a706b) === 0xa ? 0xa : 0x6;
}
function normalizeApimartVideoRatio(_0x4fa1ad) {
  const _0x3d8da0 = String(_0x4fa1ad ?? '')['trim']();
  const _0xa68e70 = _0x3d8da0["toLowerCase"]();
  if (!_0x3d8da0 || _0xa68e70 === "auto" || _0xa68e70 === 'adaptive' || _0xa68e70 === 'default' || _0x3d8da0 === "自适应" || _0x3d8da0 === '默认') {
    return undefined;
  }
  return _0x3d8da0;
}
const AGNES_IMAGE_SIZE_BY_RATIO = Object["freeze"]({
  '1:1': "1024x1024",
  '4:3': '1024x768',
  '3:4': "768x1024",
  '3:2': "1024x682",
  '2:3': "682x1024",
  '16:9': "1024x576",
  '9:16': "576x1024"
});
const AGNES_IMAGE_SIZE_SCALE_BY_QUALITY = Object['freeze']({
  '1K': 0x1,
  '2K': 0x2,
  '3K': 0x3,
  '4K': 0x4
});
const AGNES_VIDEO_DIMENSIONS_BY_RATIO = Object["freeze"]({
  '1:1': Object["freeze"]({
    'width': 0x400,
    'height': 0x400
  }),
  '4:3': Object["freeze"]({
    'width': 0x400,
    'height': 0x300
  }),
  '3:4': Object["freeze"]({
    'width': 0x300,
    'height': 0x400
  }),
  '3:2': Object["freeze"]({
    'width': 0x480,
    'height': 0x300
  }),
  '2:3': Object['freeze']({
    'width': 0x300,
    'height': 0x480
  }),
  '16:9': Object["freeze"]({
    'width': 0x480,
    'height': 0x288
  }),
  '9:16': Object["freeze"]({
    'width': 0x288,
    'height': 0x480
  })
});
function normalizeAgnesRatioLabel(_0x14cf69, _0x16122a = '4:3') {
  const _0xb66b8b = String(_0x14cf69 || '')["trim"]();
  if (/^\d+x\d+$/i["test"](_0xb66b8b)) {
    return _0xb66b8b['toLowerCase']();
  }
  const _0x1aa34a = _0xb66b8b["replace"](/\s+/g, '')["replace"]('：', ':')["toLowerCase"]();
  if (!_0x1aa34a || ['auto', "adaptive", "default"]["includes"](_0x1aa34a)) {
    return _0x16122a;
  }
  const _0x53245b = /^(\d+)[/:x](\d+)$/i['exec'](_0x1aa34a);
  if (!_0x53245b) {
    return _0x16122a;
  }
  return Number(_0x53245b[0x1]) + ':' + Number(_0x53245b[0x2]);
}
function normalizeAgnesImageQuality(_0x56f3f7, _0x312ea3 = '1K') {
  const _0x40a022 = String(_0x56f3f7 || '')["trim"]()['toUpperCase']();
  return Object["prototype"]["hasOwnProperty"]["call"](AGNES_IMAGE_SIZE_SCALE_BY_QUALITY, _0x40a022) ? _0x40a022 : _0x312ea3;
}
function normalizeAgnesVideoResolution(_0x286171, _0x18461c = {}) {
  const _0x5db14b = String(_0x286171 || _0x18461c?.["payload"]?.["generationParams"]?.["resolution"] || _0x18461c?.['payload']?.['resolution'] || _0x18461c?.["payload"]?.["videoSize"] || "720P")["trim"]()["toUpperCase"]();
  if (_0x5db14b === "480P") {
    return '480P';
  }
  return _0x5db14b === '1080P' ? "1080P" : '720P';
}
function normalizeAgnesImageSize(_0x25ea7d, {
  context: _0x57dd1d
} = {}) {
  const _0x45b763 = _0x25ea7d || _0x57dd1d?.["payload"]?.['resolvedRatioLabel'] || _0x57dd1d?.["payload"]?.["generationParams"]?.["aspectRatio"] || _0x57dd1d?.['payload']?.['aspectRatio'];
  const _0x3552ad = String(_0x45b763 || '')["trim"]();
  if (/^\d+x\d+$/i['test'](_0x3552ad)) {
    return _0x3552ad['toLowerCase']();
  }
  const _0x16bb81 = normalizeAgnesRatioLabel(_0x45b763, "4:3");
  const _0x525acb = AGNES_IMAGE_SIZE_BY_RATIO[_0x16bb81] || AGNES_IMAGE_SIZE_BY_RATIO["4:3"];
  const _0x5e0e47 = normalizeAgnesImageQuality(_0x57dd1d?.["payload"]?.["generationParams"]?.["imageSize"] || _0x57dd1d?.["payload"]?.["imageSize"] || _0x57dd1d?.["payload"]?.["resolution"]);
  const _0x30c1db = AGNES_IMAGE_SIZE_SCALE_BY_QUALITY[_0x5e0e47] || 0x1;
  if (_0x30c1db === 0x1) {
    return _0x525acb;
  }
  const [_0x24bdc3, _0x47b49b] = _0x525acb['split']('x')["map"](_0x1dc2de => Number(_0x1dc2de));
  if (!Number["isFinite"](_0x24bdc3) || !Number["isFinite"](_0x47b49b)) {
    return _0x525acb;
  }
  return Math["round"](_0x24bdc3 * _0x30c1db) + 'x' + Math["round"](_0x47b49b * _0x30c1db);
}
function resolveAgnesVideoDimensions(_0x33749a, _0x5525ce = {}) {
  const _0x54ff38 = _0x33749a || _0x5525ce?.['payload']?.["resolvedRatioLabel"] || _0x5525ce?.["payload"]?.["generationParams"]?.["aspectRatio"] || _0x5525ce?.["payload"]?.["aspectRatio"];
  const _0x5e49e0 = normalizeAgnesRatioLabel(_0x54ff38, '3:2');
  const _0x3c3e75 = AGNES_VIDEO_DIMENSIONS_BY_RATIO[_0x5e49e0] || AGNES_VIDEO_DIMENSIONS_BY_RATIO['3:2'];
  const _0x453ac4 = normalizeAgnesVideoResolution('', _0x5525ce);
  if (_0x453ac4 === "480P") {
    return Object["freeze"]({
      'width': Math["max"](0x8, Math["round"](_0x3c3e75["width"] * 0x2 / 0x3 / 0x8) * 0x8),
      'height': Math['max'](0x8, Math["round"](_0x3c3e75["height"] * 0x2 / 0x3 / 0x8) * 0x8)
    });
  }
  if (_0x453ac4 !== "1080P") {
    return _0x3c3e75;
  }
  return Object["freeze"]({
    'width': Math["round"](_0x3c3e75['width'] * 1.5),
    'height': Math["round"](_0x3c3e75['height'] * 1.5)
  });
}
function normalizeAgnesVideoWidth(_0x251eba, {
  context: _0x5a696b
} = {}) {
  return resolveAgnesVideoDimensions(_0x251eba, _0x5a696b)["width"];
}
function normalizeAgnesVideoHeight(_0x55ae7c, {
  context: _0x50970e
} = {}) {
  return resolveAgnesVideoDimensions(_0x55ae7c, _0x50970e)["height"];
}
function normalizeAgnesVideoFrameRate(_0x2f89b6, {
  spec: _0x54246c
} = {}) {
  const _0x5ce318 = Number(_0x2f89b6);
  const _0x2fb836 = Number["isFinite"](Number(_0x54246c?.["fallback"])) ? Math['trunc'](Number(_0x54246c["fallback"])) : 0x18;
  const _0x5a2bc5 = Number["isFinite"](_0x5ce318) ? Math["trunc"](_0x5ce318) : _0x2fb836;
  const _0x22f61d = Number["isFinite"](Number(_0x54246c?.["min"])) ? Math["trunc"](Number(_0x54246c['min'])) : 0x1;
  const _0x523ca1 = Number["isFinite"](Number(_0x54246c?.["max"])) ? Math["trunc"](Number(_0x54246c['max'])) : 0x3c;
  return Math["min"](Math["max"](_0x5a2bc5, _0x22f61d), _0x523ca1);
}
function resolveAgnesVideoFrameRate(_0x2ed5f7 = {}, _0x2dfad8 = {}) {
  const _0x69e39f = [_0x2ed5f7?.["body"]?.["frame_rate"], _0x2ed5f7?.['payload']?.["generationParams"]?.["frame_rate"], _0x2ed5f7?.["payload"]?.["generationParams"]?.["frameRate"], _0x2ed5f7?.["payload"]?.['frame_rate'], _0x2ed5f7?.["payload"]?.["frameRate"], _0x2dfad8?.['frameRate']];
  for (const _0x4d3742 of _0x69e39f) {
    if (_0x4d3742 === undefined || _0x4d3742 === null || String(_0x4d3742)["trim"]() === '') {
      continue;
    }
    return normalizeAgnesVideoFrameRate(_0x4d3742, {
      'spec': {
        'min': _0x2dfad8?.["frameRateMin"],
        'max': _0x2dfad8?.["frameRateMax"],
        'fallback': _0x2dfad8?.['frameRate']
      }
    });
  }
  return normalizeAgnesVideoFrameRate(undefined, {
    'spec': {
      'min': _0x2dfad8?.['frameRateMin'],
      'max': _0x2dfad8?.["frameRateMax"],
      'fallback': _0x2dfad8?.['frameRate']
    }
  });
}
function normalizeAgnesVideoNumFrames(_0xfca731, {
  context: _0x4ecf17,
  spec: _0x4c3853
} = {}) {
  const _0x15d3f2 = Number(_0xfca731);
  const _0x3a919c = Number['isFinite'](_0x15d3f2) && _0x15d3f2 > 0x0 ? _0x15d3f2 : 0x5;
  const _0x1ed05c = resolveAgnesVideoFrameRate(_0x4ecf17, _0x4c3853);
  const _0x12a2bd = Number["isFinite"](Number(_0x4c3853?.["min"])) ? Math["trunc"](Number(_0x4c3853["min"])) : 0x31;
  const _0x5af4a6 = Number["isFinite"](Number(_0x4c3853?.['max'])) ? Math["trunc"](Number(_0x4c3853["max"])) : 0x1b9;
  const _0x40a72a = Math["max"](0x1, _0x12a2bd);
  const _0x3bdc35 = Math["max"](_0x40a72a, _0x5af4a6);
  const _0xa8820b = Math["max"](_0x40a72a, Math["round"](_0x3a919c * _0x1ed05c) + 0x1);
  const _0xd7c04a = Math["min"](_0xa8820b, _0x3bdc35);
  const _0x7cf024 = Math["round"]((_0xd7c04a - 0x1) / 0x8) * 0x8 + 0x1;
  return Math["min"](_0x3bdc35, Math["max"](_0x40a72a, _0x7cf024));
}
function normalizeApimartOptionalText(_0x3b1854) {
  const _0x473eb7 = String(_0x3b1854 ?? '')['trim']();
  const _0x2e54d6 = _0x473eb7["toLowerCase"]();
  if (!_0x473eb7 || _0x2e54d6 === "auto" || _0x2e54d6 === "none") {
    return undefined;
  }
  return _0x473eb7;
}
function normalizeApimartOptionalInteger(_0xb0130b) {
  const _0x2fc460 = String(_0xb0130b ?? '')["trim"]();
  const _0x24d10b = _0x2fc460["toLowerCase"]();
  if (!_0x2fc460 || _0x24d10b === "auto" || _0x24d10b === "none") {
    return undefined;
  }
  const _0x596639 = Number(_0x2fc460);
  return Number["isFinite"](_0x596639) ? Math['trunc'](_0x596639) : undefined;
}
function resolveSeedModeValue(_0x2ac9f0 = {}, _0x186903 = "seed_mode", _0x29720b = "fixed") {
  const _0x229705 = String(_0x186903 || 'seed_mode')["trim"]();
  const _0x483704 = _0x2ac9f0?.["generationParams"] && typeof _0x2ac9f0["generationParams"] === "object" && !Array["isArray"](_0x2ac9f0["generationParams"]) ? _0x2ac9f0["generationParams"] : {};
  const _0x5d8ab9 = _0x483704[_0x229705] ?? _0x483704['seedMode'] ?? _0x2ac9f0[_0x229705] ?? _0x2ac9f0["seedMode"] ?? _0x29720b;
  const _0x215232 = String(_0x5d8ab9 ?? _0x29720b)["trim"]()["toLowerCase"]();
  return _0x215232 === 'random' ? "random" : 'fixed';
}
function generateIntegerSeed(_0x22004a, _0x2e9b28) {
  const _0x35ffae = Math["min"](_0x22004a, _0x2e9b28);
  const _0x431c49 = Math["max"](_0x22004a, _0x2e9b28);
  return _0x35ffae + Math['floor'](Math["random"]() * (_0x431c49 - _0x35ffae + 0x1));
}
function normalizeAgnesVideoSeed(_0x30c708, {
  context: _0x31e3e6,
  spec: _0x559a12
} = {}) {
  const _0x1bb9f2 = resolveSeedModeValue(_0x31e3e6?.["payload"] || {}, _0x559a12?.["modeField"], _0x559a12?.['defaultMode'] || "random");
  if (_0x1bb9f2 === "random") {
    const _0x3c9564 = Number["isFinite"](Number(_0x559a12?.["min"])) ? Math["trunc"](Number(_0x559a12["min"])) : 0x0;
    const _0x471804 = Number["isFinite"](Number(_0x559a12?.["max"])) ? Math["trunc"](Number(_0x559a12["max"])) : 0x7fffffff;
    return generateIntegerSeed(_0x3c9564, _0x471804);
  }
  return normalizeApimartOptionalInteger(_0x30c708);
}
function normalizeIntegerRange(_0x4766a1, {
  spec: _0x288a31
} = {}) {
  const _0x402efc = Number(_0x4766a1);
  const _0x380d4c = Number['isFinite'](Number(_0x288a31?.["fallback"])) ? Math['trunc'](Number(_0x288a31["fallback"])) : 0x0;
  const _0x33f6b4 = Number['isFinite'](_0x402efc) ? Math["trunc"](_0x402efc) : _0x380d4c;
  const _0x37c5fd = Number["isFinite"](Number(_0x288a31?.["min"])) ? Math['trunc'](Number(_0x288a31["min"])) : _0x33f6b4;
  const _0x467907 = Number["isFinite"](Number(_0x288a31?.["max"])) ? Math["trunc"](Number(_0x288a31["max"])) : _0x33f6b4;
  return Math["min"](Math["max"](_0x33f6b4, _0x37c5fd), _0x467907);
}
function formatAllowedImageCounts(_0x39f2e5) {
  if (_0x39f2e5["length"] <= 0x1) {
    return String(_0x39f2e5[0x0] ?? '');
  }
  if (_0x39f2e5["length"] === 0x2) {
    return _0x39f2e5[0x0] + " or " + _0x39f2e5[0x1];
  }
  return _0x39f2e5["slice"](0x0, -0x1)["join"](',\x20') + ',\x20or\x20' + _0x39f2e5['at'](-0x1);
}
function normalizeImageCountOptions(_0x367c59, {
  spec: _0x2bf940
} = {}) {
  const _0x199426 = (Array["isArray"](_0x367c59) ? _0x367c59 : [])["map"](_0x1fad8d => String(_0x1fad8d || '')["trim"]())["filter"](Boolean);
  if (_0x199426["length"] === 0x0) {
    return _0x199426;
  }
  const _0xb9205d = (Array["isArray"](_0x2bf940?.["allowedCounts"]) ? _0x2bf940["allowedCounts"] : [])["map"](_0x2fc813 => Number(_0x2fc813))["filter"](_0x2298ec => Number["isInteger"](_0x2298ec) && _0x2298ec >= 0x0);
  if (_0xb9205d["length"] === 0x0 || _0xb9205d["includes"](_0x199426['length'])) {
    return _0x199426;
  }
  const _0x130b37 = String(_0x2bf940?.["label"] || "This model")["trim"]() || 'This\x20model';
  throw new Error(_0x130b37 + " supports only " + formatAllowedImageCounts(_0xb9205d) + " reference images");
}
function normalizeApimartKlingVideoMode(_0x48709b) {
  const _0x7c8413 = String(_0x48709b || '')['trim']()['toLowerCase']();
  return _0x7c8413 === "pro" ? "pro" : 'std';
}
function normalizeApimartKlingVideoMode4k(_0x2b5c8a) {
  const _0x4dcd17 = String(_0x2b5c8a || '')['trim']()["toLowerCase"]();
  if (_0x4dcd17 === '4k') {
    return '4k';
  }
  return _0x4dcd17 === "pro" ? 'pro' : "std";
}
function normalizeRunningHubKlingVideoMode(_0x163e21) {
  return normalizeApimartKlingVideoMode(_0x163e21);
}
function normalizeRunningHubKlingV3Model(_0x135a12) {
  const _0xcb6c4 = String(_0x135a12 || '')["trim"]()['toLowerCase']();
  if (_0xcb6c4 === '4k') {
    return '4k';
  }
  if (_0xcb6c4 === "pro") {
    return "pro";
  }
  return "std";
}
function normalizeRunningHubKlingV3AspectRatio(_0xaf9e26) {
  const _0x2f6089 = normalizeApimartVideoRatio(_0xaf9e26);
  return ['16:9', '9:16', '1:1']["includes"](_0x2f6089) ? _0x2f6089 : undefined;
}
function normalizeRunningHubKlingV3Duration(_0x1dbe2c) {
  const _0x2c3713 = Math['trunc'](Number(_0x1dbe2c));
  const _0xe1da47 = Number['isFinite'](_0x2c3713) ? _0x2c3713 : 0x5;
  return String(Math["min"](0xf, Math['max'](0x3, _0xe1da47)));
}
function normalizeRunningHubKlingV3CfgScale(_0x579a0a) {
  const _0x3db6b8 = Number(_0x579a0a);
  if (!Number["isFinite"](_0x3db6b8)) {
    return 0.5;
  }
  return Math["min"](0x1, Math["max"](0x0, Math["round"](_0x3db6b8 * 0xa) / 0xa));
}
function normalizeRunningHubKlingV3ShotType(_0x58d41d) {
  const _0x124c92 = String(_0x58d41d || '')["trim"]()['toLowerCase']();
  return _0x124c92 === 'intelligence' ? "intelligence" : "customize";
}
function normalizeRunningHubKlingO3Model(_0x496997) {
  return normalizeRunningHubKlingV3Model(_0x496997);
}
function normalizeRunningHubKlingO3AspectRatio(_0x11a45b) {
  return normalizeRunningHubKlingV3AspectRatio(_0x11a45b);
}
function normalizeRunningHubKlingO3Duration(_0x2ff7bf) {
  return normalizeRunningHubKlingV3Duration(_0x2ff7bf);
}
function normalizeRunningHubKlingO3ShotType(_0x68923c) {
  return normalizeRunningHubKlingV3ShotType(_0x68923c);
}
function normalizeRunningHubKlingO1AspectRatio(_0x36bfb6) {
  const _0x2fa6bd = String(_0x36bfb6 || "9:16")["trim"]();
  return ["16:9", '9:16', "1:1"]['includes'](_0x2fa6bd) ? _0x2fa6bd : '9:16';
}
function normalizeRunningHubKlingO1Duration(_0x9532af) {
  const _0x2504de = Number(_0x9532af);
  return Number["isFinite"](_0x2504de) && Math["trunc"](_0x2504de) === 0xa ? '10' : '5';
}
function normalizeRunningHubHailuo23Duration(_0x274288) {
  const _0x1ea903 = Number(_0x274288);
  return Number["isFinite"](_0x1ea903) && Math["trunc"](_0x1ea903) === 0xa ? '10' : '6';
}
function normalizeRunningHubHappyHorseResolution(_0xe3af9) {
  return normalizeApimartVideoResolutionLower(_0xe3af9);
}
function normalizeRunningHubHappyHorseAspectRatio(_0x2ee63b) {
  const _0x52ae42 = normalizeApimartVideoRatio(_0x2ee63b);
  return ['16:9', "9:16", "1:1", '4:3', "3:4"]['includes'](_0x52ae42) ? _0x52ae42 : undefined;
}
function normalizeRunningHubHappyHorseDuration(_0x3aed5d) {
  const _0x2be2e7 = Math["trunc"](Number(_0x3aed5d));
  const _0x4a0098 = Number["isFinite"](_0x2be2e7) ? _0x2be2e7 : 0x5;
  return String(Math["min"](0xf, Math['max'](0x3, _0x4a0098)));
}
function normalizeRunningHubHappyHorseAudioSetting(_0x2bea7e) {
  const _0x25c7be = String(_0x2bea7e || '')['trim']()['toLowerCase']();
  return _0x25c7be === 'origin' ? 'origin' : "auto";
}
function normalizeRunningHubSeedance2Resolution(_0x4e72fc) {
  const _0x1ee610 = String(_0x4e72fc || "720p")["trim"]()["toLowerCase"]();
  if (_0x1ee610 === "native1080p") {
    return "native1080p";
  }
  if (['480p', "720p", "1080p", '2k', '4k']['includes'](_0x1ee610)) {
    return _0x1ee610;
  }
  return "720p";
}
function normalizeRunningHubSeedance2Duration(_0x37a1f9) {
  const _0x222508 = Math['trunc'](Number(_0x37a1f9));
  const _0x54ab72 = Number["isFinite"](_0x222508) ? _0x222508 : 0x5;
  return String(Math["min"](0xf, Math["max"](0x4, _0x54ab72)));
}
function normalizeRunningHubSeedance25Duration(_0x35d8dc) {
  const _0x54e119 = Math["trunc"](Number(_0x35d8dc));
  if (_0x54e119 === -0x1) {
    return '-1';
  }
  const _0x30a997 = Number["isFinite"](_0x54e119) ? _0x54e119 : -0x1;
  return _0x30a997 === -0x1 ? '-1' : String(Math['min'](0x1e, Math["max"](0x4, _0x30a997)));
}
function normalizeRunningHubSeedance2Ratio(_0x2a1ede) {
  const _0xbd1538 = String(_0x2a1ede ?? '')["trim"]();
  const _0x27e9dc = _0xbd1538["toLowerCase"]();
  if (!_0xbd1538 || _0x27e9dc === "auto" || _0x27e9dc === 'adaptive' || _0x27e9dc === "default" || _0xbd1538 === "自适应" || _0xbd1538 === '默认') {
    return 'adaptive';
  }
  return ["16:9", "4:3", "1:1", "3:4", "9:16", "21:9"]["includes"](_0xbd1538) ? _0xbd1538 : 'adaptive';
}
function normalizeRunningHubVeo3Resolution(_0x367732) {
  const _0x500996 = String(_0x367732 || "720p")["trim"]()["toLowerCase"]();
  if (_0x500996 === '4k') {
    return '4k';
  }
  if (_0x500996 === "1080p") {
    return '1080p';
  }
  return "720p";
}
function normalizeRunningHubVeo3AspectRatio(_0x4c5bb5) {
  const _0x44d3e9 = normalizeApimartVideoRatio(_0x4c5bb5);
  return ["16:9", "9:16"]['includes'](_0x44d3e9) ? _0x44d3e9 : undefined;
}
function normalizeRunningHubVeo3Duration(_0x964b4f) {
  const _0x497e3a = Math['trunc'](Number(_0x964b4f));
  return [0x4, 0x6, 0x8]["includes"](_0x497e3a) ? String(_0x497e3a) : '8';
}
function normalizeRunningHubWan27Mode(_0x2f5b81 = {}) {
  const _0x49c4ad = String(_0x2f5b81?.["payload"]?.["generationParams"]?.["wan27_mode"] || _0x2f5b81?.["payload"]?.["wan27_mode"] || _0x2f5b81?.["body"]?.["wan27_mode"] || "image")["trim"]()["toLowerCase"]();
  return _0x49c4ad === "video" || _0x49c4ad === "reference" || _0x49c4ad === "edit" ? _0x49c4ad : "image";
}
function normalizeRunningHubWan27Resolution(_0x31a93b) {
  const _0x22ac68 = String(_0x31a93b || "720P")["trim"]()["toUpperCase"]();
  return _0x22ac68 === "1080P" ? "1080P" : "720P";
}
function normalizeRunningHubWan27AspectRatio(_0x5593ec) {
  const _0xca5924 = normalizeApimartVideoRatio(_0x5593ec);
  return ["16:9", '9:16', '1:1', "4:3", "3:4"]["includes"](_0xca5924) ? _0xca5924 : undefined;
}
function normalizeRunningHubWan27Duration(_0x30addf, {
  context: _0x2931c5
} = {}) {
  const _0x4d670b = Math["trunc"](Number(_0x30addf));
  const _0x15d108 = normalizeRunningHubWan27Mode(_0x2931c5);
  if (_0x15d108 === "edit") {
    if (_0x4d670b === 0x0) {
      return '0';
    }
    const _0x5b7364 = Number["isFinite"](_0x4d670b) ? _0x4d670b : 0x5;
    return String(Math["min"](0xa, Math['max'](0x2, _0x5b7364)));
  }
  const _0x59f9be = Number["isFinite"](_0x4d670b) ? _0x4d670b : 0x5;
  return String(Math["min"](0xf, Math["max"](0x5, _0x59f9be)));
}
function resolveApimartGoogleSearch(_0x39e874, {
  context: _0xb3aa38
}) {
  const _0x52d9f2 = _0xb3aa38?.['payload'] || {};
  return normalizeBooleanParam(_0x39e874) || normalizeBooleanParam(_0x52d9f2["google_image_search"]);
}
function resolveApimartGoogleImageSearch(_0x19a51e, {
  context: _0x5ca258
}) {
  const _0x318d3f = _0x5ca258?.["body"] || {};
  const _0x5f5804 = _0x5ca258?.["payload"] || {};
  return normalizeBooleanParam(_0x19a51e) && normalizeBooleanParam(_0x318d3f["google_search"] ?? _0x5f5804['google_search']);
}
const BODY_MAPPING_TRANSFORMS = Object["freeze"]({
  'apimartNanoBanana2Resolution': _0x44cf52 => normalizeApimartNanoBanana2Resolution(_0x44cf52),
  'apimartGptImage2Resolution': _0x34d1fd => normalizeApimartGptImage2Resolution(_0x34d1fd),
  'apimartImageCount': normalizeApimartImageCount,
  'apimartQwenImageCount': normalizeApimartQwenImageCount,
  'apimartQwenImageResolution': normalizeApimartQwenImageResolution,
  'apimartSeedreamResolution': normalizeApimartSeedreamResolution,
  'apimartSeedreamImageCount': normalizeApimartSeedreamImageCount,
  'volcengineSeedreamSize': resolveVolcengineSeedreamSize,
  'volcengineSeedreamImageCount': normalizeVolcengineSeedreamImageCount,
  'volcengineSeedreamSequentialMode': resolveVolcengineSeedreamSequentialMode,
  'apimartWanImageResolution': normalizeApimartWanImageResolution,
  'apimartVideoResolutionUpper': normalizeApimartVideoResolutionUpper,
  'apimartVideoResolutionLower': normalizeApimartVideoResolutionLower,
  'apimartVeo3VideoResolution': normalizeApimartVeo3VideoResolution,
  'apimartViduVideoResolution': normalizeApimartViduVideoResolution,
  'apimartViduVideoDuration': normalizeApimartViduVideoDuration,
  'apimartHailuo23VideoResolution': normalizeApimartHailuo23VideoResolution,
  'apimartHailuo23VideoDuration': normalizeApimartHailuo23VideoDuration,
  'apimartVideoRatio': normalizeApimartVideoRatio,
  'customProviderDimensionMap': normalizeCustomProviderDimensionMap,
  'customProviderDocumentedValueMap': normalizeCustomProviderDocumentedValueMap,
  'customProviderOpenAiImageSize': normalizeCustomProviderOpenAiImageSize,
  'agnesImageSize': normalizeAgnesImageSize,
  'agnesVideoWidth': normalizeAgnesVideoWidth,
  'agnesVideoHeight': normalizeAgnesVideoHeight,
  'agnesVideoFrameRate': normalizeAgnesVideoFrameRate,
  'agnesVideoNumFrames': normalizeAgnesVideoNumFrames,
  'agnesVideoSeed': normalizeAgnesVideoSeed,
  'apimartOptionalText': normalizeApimartOptionalText,
  'apimartOptionalInteger': normalizeApimartOptionalInteger,
  'integerRange': normalizeIntegerRange,
  'imageCountOptions': normalizeImageCountOptions,
  'apimartKlingVideoMode': normalizeApimartKlingVideoMode,
  'apimartKlingVideoMode4k': normalizeApimartKlingVideoMode4k,
  'runninghubKlingVideoMode': normalizeRunningHubKlingVideoMode,
  'runninghubKlingV3Model': normalizeRunningHubKlingV3Model,
  'runninghubKlingV3AspectRatio': normalizeRunningHubKlingV3AspectRatio,
  'runninghubKlingV3Duration': normalizeRunningHubKlingV3Duration,
  'runninghubKlingV3CfgScale': normalizeRunningHubKlingV3CfgScale,
  'runninghubKlingV3ShotType': normalizeRunningHubKlingV3ShotType,
  'runninghubKlingO3Model': normalizeRunningHubKlingO3Model,
  'runninghubKlingO3AspectRatio': normalizeRunningHubKlingO3AspectRatio,
  'runninghubKlingO3Duration': normalizeRunningHubKlingO3Duration,
  'runninghubKlingO3ShotType': normalizeRunningHubKlingO3ShotType,
  'runninghubKlingO1AspectRatio': normalizeRunningHubKlingO1AspectRatio,
  'runninghubKlingO1Duration': normalizeRunningHubKlingO1Duration,
  'runninghubHailuo23Duration': normalizeRunningHubHailuo23Duration,
  'runninghubHappyHorseResolution': normalizeRunningHubHappyHorseResolution,
  'runninghubHappyHorseAspectRatio': normalizeRunningHubHappyHorseAspectRatio,
  'runninghubHappyHorseDuration': normalizeRunningHubHappyHorseDuration,
  'runninghubHappyHorseAudioSetting': normalizeRunningHubHappyHorseAudioSetting,
  'runninghubSeedance2Resolution': normalizeRunningHubSeedance2Resolution,
  'runninghubSeedance2Duration': normalizeRunningHubSeedance2Duration,
  'runninghubSeedance25Duration': normalizeRunningHubSeedance25Duration,
  'runninghubSeedance2Ratio': normalizeRunningHubSeedance2Ratio,
  'runninghubVeo3Resolution': normalizeRunningHubVeo3Resolution,
  'runninghubVeo3AspectRatio': normalizeRunningHubVeo3AspectRatio,
  'runninghubVeo3Duration': normalizeRunningHubVeo3Duration,
  'runninghubWan27Resolution': normalizeRunningHubWan27Resolution,
  'runninghubWan27AspectRatio': normalizeRunningHubWan27AspectRatio,
  'runninghubWan27Duration': normalizeRunningHubWan27Duration,
  'apimartGoogleSearch': resolveApimartGoogleSearch,
  'apimartGoogleImageSearch': resolveApimartGoogleImageSearch,
  'booleanParam': normalizeBooleanParam,
  'numberParam': normalizeNumberParam,
  'integerParam': normalizeIntegerParam,
  'stringParam': normalizeStringParam,
  'first': firstArrayItem,
  'second': secondArrayItem,
  'providerRatioSize': resolveProviderRatioSize
});
function resolveRequestManifest(_0x5143ee, _0x4edc78, _0x3e7699) {
  let _0x557a51 = _0x5143ee;
  let _0x275ead = resolveModelExecution(_0x5143ee["model"], {
    'providerHint': _0x4edc78
  });
  if (_0x4edc78 && (!_0x275ead?.['modelManifest'] || _0x275ead['modelManifest']["provider"] !== _0x4edc78) && !String(_0x5143ee["model"] || '')['includes']('/')) {
    const _0x3bd399 = _0x4edc78 + '/' + _0x5143ee["model"];
    const _0x523455 = resolveModelExecution(_0x3bd399);
    _0x523455?.['modelManifest']?.["provider"] === _0x4edc78 && (_0x275ead = _0x523455, _0x557a51 = {
      ..._0x5143ee,
      'model': _0x3bd399
    });
  }
  _0x275ead?.["canonicalModelId"] && _0x275ead["canonicalModelId"] !== String(_0x5143ee["model"] || '')['trim']() && (_0x557a51 = {
    ..._0x5143ee,
    'model': _0x275ead['canonicalModelId']
  });
  const _0x10f518 = _0x275ead?.['modelManifest'];
  const _0x3a80f5 = _0x275ead?.["executionManifest"];
  if (!_0x10f518 || !_0x3a80f5 || _0x10f518['adapterType'] !== "modelApi" || _0x3a80f5['adapterType'] !== "modelApi" || _0x10f518['kind'] !== _0x3e7699 || _0x3a80f5['kind'] !== _0x3e7699) {
    return null;
  }
  const _0x433069 = _0x10f518["provider"];
  if (_0x4edc78 && _0x433069 !== _0x4edc78) {
    return null;
  }
  if (_0x433069 === 'runninghub') {
    const _0x584eb6 = resolveRunningHubModelApiProfileId(_0x10f518["modelId"], _0x557a51?.['providerProfileId'] || _0x557a51?.["rhProviderProfileId"]);
    _0x557a51 = {
      ..._0x557a51,
      'providerProfileId': _0x584eb6,
      'rhProviderProfileId': _0x584eb6
    };
  }
  return {
    'provider': _0x433069,
    'modelManifest': _0x10f518,
    'executionManifest': _0x3a80f5,
    'effectivePayload': _0x557a51
  };
}
async function buildManifestMappedBody(_0x5b33e8) {
  const _0x172172 = await buildBodyFromMapping({
    'bodyMapping': _0x5b33e8["executionManifest"]["bodyMapping"],
    'context': _0x5b33e8,
    'transforms': BODY_MAPPING_TRANSFORMS
  });
  const _0x20eeba = _0x5b33e8['executionManifest']["extensions"]?.["bodyResolver"];
  if (!_0x20eeba) {
    return _0x172172;
  }
  const _0x4aee61 = getModelApiBodyResolver(_0x20eeba);
  if (typeof _0x4aee61 !== 'function') {
    throw new Error("Unsupported model API bodyResolver: " + _0x20eeba);
  }
  return _0x4aee61({
    ..._0x5b33e8,
    'currentBody': _0x172172
  });
}
function resolveDefaultApiUrl(_0x40caeb, _0x45af42, _0x42eef5) {
  const _0x454618 = String(_0x42eef5['endpoint'] || '')["trim"]();
  if (/^https?:\/\//i["test"](_0x454618)) {
    return _0x454618;
  }
  const _0x20992d = _0x40caeb === "grsai" ? String(_0x45af42['apiUrl'] || '')["replace"](/\/v1\/?$/, '')["replace"](/\/+$/, '') : String(_0x45af42["apiUrl"] || '')["replace"](/\/+$/, '');
  const _0x142cad = _0x454618["match"](/^\/(v\d+(?:beta)?)(?:\/|$)/i)?.[0x1];
  if (_0x142cad && new RegExp('/' + _0x142cad + '$', 'i')["test"](_0x20992d)) {
    return '' + _0x20992d['slice'](0x0, -(_0x142cad['length'] + 0x1)) + _0x454618;
  }
  return '' + _0x20992d + _0x454618;
}
const CUSTOM_PROVIDER_TASK_SUCCESS_STATUS_ALIASES = Object["freeze"](["succeeded", "success", 'completed', "complete", "done", 'finished']);
const CUSTOM_PROVIDER_TASK_FAILURE_STATUS_ALIASES = Object["freeze"](["failed", "failure", 'fail', 'error', "cancelled", "canceled", 'expired']);
export function resolveManifestTaskPolling(_0x1ce24c, _0x4226e5, _0x32229f, _0x959b0d) {
  const _0x20c585 = _0x32229f["extensions"]?.['taskPolling'];
  if (!_0x20c585 || typeof _0x20c585 !== "object" || Array["isArray"](_0x20c585)) {
    return null;
  }
  const _0x4f2466 = String(_0x4226e5["apiUrl"] || '')["replace"](/\/v1\/?$/, '')["replace"](/\/+$/, '');
  const _0x22b2f6 = String(_0x20c585["urlTemplate"] || '')["trim"]();
  const _0x528b5b = Array["isArray"](_0x20c585["fallbackUrlTemplates"]) ? _0x20c585['fallbackUrlTemplates']["map"](_0x46762c => String(_0x46762c || '')["trim"]())["filter"](Boolean)["map"](_0x32e069 => _0x32e069["replace"]("{baseUrl}", _0x4f2466)) : [];
  const _0x5be559 = Number(_0x20c585["pollIntervalMs"]);
  const _0x5c84a0 = Number(_0x20c585['maxWaitMs']);
  const _0x4afa11 = typeof _0x20c585["waitUntilTerminal"] === "boolean" ? _0x20c585["waitUntilTerminal"] : isCustomProviderId(_0x1ce24c);
  const _0x1f66ee = _0x20c585['continuePollingOnSuccessWithoutResult'] === !![];
  const _0x36a1d6 = _0x57761c => Array["isArray"](_0x57761c) ? [...new Set(_0x57761c["map"](_0x578543 => String(_0x578543 || '')['trim']()['toLowerCase']())["filter"](_0x2801c8 => /^[a-z][a-z0-9_-]{0,63}$/["test"](_0x2801c8)))]["slice"](0x0, 0x10) : [];
  const _0x19ae86 = isCustomProviderId(_0x1ce24c);
  const _0x1f80e8 = _0x36a1d6([...(Array['isArray'](_0x20c585["successStatuses"]) ? _0x20c585["successStatuses"] : []), ...(_0x19ae86 ? CUSTOM_PROVIDER_TASK_SUCCESS_STATUS_ALIASES : [])]);
  const _0x188c89 = _0x36a1d6([...(Array["isArray"](_0x20c585["failedStatuses"]) ? _0x20c585['failedStatuses'] : []), ...(_0x19ae86 ? CUSTOM_PROVIDER_TASK_FAILURE_STATUS_ALIASES : [])]);
  const _0x2e367e = (_0x5f0f97, _0x62f22f = []) => {
    const _0x5d9d5b = Array["isArray"](_0x5f0f97) ? _0x5f0f97 : _0x62f22f;
    return [...new Set(_0x5d9d5b["map"](_0x15a5b1 => Number(_0x15a5b1))["filter"](_0x48e15f => Number["isInteger"](_0x48e15f) && _0x48e15f >= 0x190 && _0x48e15f <= 0x257))]["slice"](0x0, 0x10);
  };
  const _0x26d1a7 = _0x20c585["transportErrorPolicy"] && typeof _0x20c585['transportErrorPolicy'] === "object" && !Array['isArray'](_0x20c585['transportErrorPolicy']) ? _0x20c585['transportErrorPolicy'] : null;
  const _0x396c96 = isCustomProviderId(_0x1ce24c);
  const _0x1dde79 = _0x26d1a7 || _0x396c96 ? {
    'maxConsecutiveErrors': Math["min"](0xa, Math["max"](0x1, Math["trunc"](Number(_0x26d1a7?.["maxConsecutiveErrors"]) || 0x3))),
    'retryableStatuses': _0x2e367e(_0x26d1a7?.["retryableStatuses"], [0x198, 0x1a9, 0x1ad, 0x1f4, 0x1f6, 0x1f7, 0x1f8]),
    'terminalStatuses': _0x2e367e(_0x26d1a7?.["terminalStatuses"], [0x190, 0x191, 0x193, 0x194, 0x195, 0x199, 0x19a, 0x19d, 0x1a6]),
    'surfaceLastError': _0x26d1a7?.["surfaceLastError"] !== ![]
  } : null;
  return {
    'method': String(_0x20c585['method'] || "GET")["trim"]()['toUpperCase']() || 'GET',
    'mode': String(_0x20c585["mode"] || "task-proxy")["trim"]() || "task-proxy",
    'urlTemplate': _0x22b2f6["replace"]("{baseUrl}", _0x4f2466),
    ...(_0x20c585['downloadTaskContent'] === !![] ? {
      'downloadTaskContent': !![]
    } : {}),
    ...(_0x528b5b["length"] > 0x0 ? {
      'fallbackUrlTemplates': _0x528b5b
    } : {}),
    'headersMode': String(_0x20c585['headersMode'] || "bearer")["trim"]() || "bearer",
    ...(Number["isFinite"](_0x5be559) ? {
      'pollIntervalMs': Math["min"](0x7530, Math['max'](0x3e8, Math["trunc"](_0x5be559)))
    } : {}),
    ...(Number["isFinite"](_0x5c84a0) ? {
      'maxWaitMs': Math["min"](0x2 * 0x3c * 0x3c * 0x3e8, Math["max"](0x3c * 0x3e8, Math["trunc"](_0x5c84a0)))
    } : {}),
    ...(_0x4afa11 ? {
      'waitUntilTerminal': !![]
    } : {}),
    ...(_0x1f66ee ? {
      'continuePollingOnSuccessWithoutResult': !![]
    } : {}),
    ...(_0x1f80e8['length'] > 0x0 ? {
      'successStatuses': _0x1f80e8
    } : {}),
    ...(_0x188c89["length"] > 0x0 ? {
      'failedStatuses': _0x188c89
    } : {}),
    ...(_0x1dde79 ? {
      'transportErrorPolicy': _0x1dde79
    } : {}),
    'provider': _0x1ce24c,
    'executionId': _0x32229f['id'],
    'modelId': _0x959b0d?.["modelManifest"]?.['modelId'] || ''
  };
}
const SAFE_MANIFEST_ERROR_RULE_TYPES = new Set(["AUTH_ERROR", "CONTENT_FILTERED", "FORBIDDEN", "INSUFFICIENT_BALANCE", "INVALID_PARAMS", "MODEL_UNAVAILABLE", "NETWORK_ERROR", 'RATE_LIMIT', 'SERVER_ERROR', 'SERVICE_UNAVAILABLE', "TASK_FAILED", 'TIMEOUT', 'UNKNOWN']);
export function resolveManifestErrorRules(_0x2ebe0a = {}) {
  const _0x1e519d = _0x2ebe0a?.['extensions']?.["errorRules"];
  if (!Array["isArray"](_0x1e519d)) {
    return [];
  }
  return _0x1e519d["slice"](0x0, 0xc)["flatMap"](_0x574c4c => {
    if (!_0x574c4c || typeof _0x574c4c !== 'object' || Array["isArray"](_0x574c4c)) {
      return [];
    }
    const _0x5f5a8f = String(_0x574c4c["phase"] || "any")["trim"]()["toLowerCase"]();
    const _0x516a4f = String(_0x574c4c["type"] || '')["trim"]()['toUpperCase']();
    const _0x316404 = [...new Set((Array["isArray"](_0x574c4c["httpStatuses"]) ? _0x574c4c["httpStatuses"] : [])['map'](_0x3c9f6c => Number(_0x3c9f6c))["filter"](_0x485845 => Number["isInteger"](_0x485845) && _0x485845 >= 0x190 && _0x485845 <= 0x257))]["slice"](0x0, 0xc);
    const _0x58a6c3 = [...new Set((Array['isArray'](_0x574c4c['messageIncludesAny']) ? _0x574c4c["messageIncludesAny"] : [])['map'](_0x4f4f2a => String(_0x4f4f2a || '')['replace'](/\s+/g, '\x20')["trim"]())["filter"](_0x3684c8 => _0x3684c8 && _0x3684c8["length"] <= 0xf0))]["slice"](0x0, 0x6);
    if (!["any", 'submit', "poll"]['includes'](_0x5f5a8f) || !SAFE_MANIFEST_ERROR_RULE_TYPES["has"](_0x516a4f) || typeof _0x574c4c["retryable"] !== "boolean" || _0x316404["length"] === 0x0 && _0x58a6c3["length"] === 0x0) {
      return [];
    }
    const _0x33ef6a = String(_0x574c4c["userMessage"] || '')["replace"](/\s+/g, '\x20')["trim"]()["slice"](0x0, 0x1f4);
    const _0x734217 = String(_0x574c4c["hint"] || '')['replace'](/\s+/g, '\x20')["trim"]()['slice'](0x0, 0x1f4);
    return [{
      'phase': _0x5f5a8f,
      ...(_0x316404['length'] > 0x0 ? {
        'httpStatuses': _0x316404
      } : {}),
      ...(_0x58a6c3["length"] > 0x0 ? {
        'messageIncludesAny': _0x58a6c3
      } : {}),
      'type': _0x516a4f,
      'retryable': _0x574c4c['retryable'],
      ...(_0x33ef6a ? {
        'userMessage': _0x33ef6a
      } : {}),
      ...(_0x734217 ? {
        'hint': _0x734217
      } : {})
    }];
  });
}
function resolveManifestApiUrl(_0x4ef7b9, _0x133d59, _0x408971, _0x14b703) {
  const _0x1d57db = _0x408971["extensions"]?.["endpointResolver"];
  let _0x4cc0da = '';
  if (!_0x1d57db) {
    _0x4cc0da = resolveDefaultApiUrl(_0x4ef7b9, _0x133d59, _0x408971);
  } else {
    const _0x3f233c = getModelApiEndpointResolver(_0x1d57db);
    if (typeof _0x3f233c !== "function") {
      throw new Error("Unsupported model API endpointResolver: " + _0x1d57db);
    }
    _0x4cc0da = _0x3f233c({
      'provider': _0x4ef7b9,
      'cfg': _0x133d59,
      'executionManifest': _0x408971,
      ..._0x14b703
    });
  }
  if (!_0x4cc0da) {
    throw new Error('Model\x20API\x20endpointResolver\x20returned\x20empty\x20url:\x20' + _0x1d57db);
  }
  if (_0x4ef7b9 === "runninghub") {
    return remapRunningHubModelApiUrl(_0x4cc0da, _0x14b703?.["payload"]?.["providerProfileId"]);
  }
  return _0x4cc0da;
}
function doesResolverOwnInputResolution(_0x4a73ee) {
  const _0x4b7eca = _0x4a73ee?.["extensions"] || {};
  return _0x4b7eca["resolverOwnsInputs"] === !![] || String(_0x4b7eca["inputResolutionMode"] || '')["trim"]() === 'resolverOwned';
}
export async function buildVideoRequestFromManifest(_0x42fa04, _0x27596e, _0x420262, _0xed88d6 = {}) {
  const _0x36d31d = String(_0xed88d6["expectedProvider"] || '')["trim"]()["toLowerCase"]();
  const _0x5bba5a = resolveRequestManifest(_0x42fa04, _0x36d31d, "video");
  if (!_0x5bba5a) {
    return null;
  }
  const {
    provider: _0x5c034e,
    modelManifest: _0x1cfbda,
    executionManifest: _0x343668,
    effectivePayload: _0x28a3e5
  } = _0x5bba5a;
  if (!isSupportedModelApiProvider(_0x5c034e, VIDEO_MODEL_API_PROVIDERS)) {
    return null;
  }
  validateStrictModelUiSchemaParams(_0x28a3e5, _0x1cfbda, _0x343668);
  validateStrictVideoInputCounts(_0x28a3e5, _0x1cfbda, _0x343668);
  const _0x3d3549 = sanitizeModelUiSchemaParams(_0x1cfbda['modelId'], _0x28a3e5["generationParams"], {
    'includeDefaults': !![]
  });
  const _0xcbea63 = applyVideoAspectRatioExecutionFallback({
    ..._0x28a3e5,
    'generationParams': mergeRootAspectRatioIntoGenerationParams(_0x28a3e5, _0x3d3549)
  }, _0x1cfbda);
  const _0x6138f9 = resolveProviderConfig(_0x5c034e, _0xcbea63, _0x420262);
  const _0x3a9d81 = resolveApiKey(_0x5c034e, _0xcbea63, _0x420262, _0x6138f9);
  !_0x3a9d81 && throwMissingApiKey(_0x5c034e);
  const _0x19bb2e = isCustomProviderModelManifest(_0x1cfbda);
  const _0x52c7f8 = doesResolverOwnInputResolution(_0x343668) && !_0x19bb2e;
  const _0x3bd357 = _0x52c7f8 ? {} : await resolveInputImagesBySlot(_0x5c034e, _0xcbea63, _0x3a9d81, _0x420262, {
    'modelManifest': _0x1cfbda,
    'baseUrl': _0x6138f9["apiUrl"],
    'executionManifest': _0x343668,
    'forceCustomProviderFreeImageHost': _0x19bb2e
  });
  const _0x1c52c2 = Object['keys'](_0x3bd357)["length"] > 0x0;
  const _0x16b953 = _0x1c52c2 ? Object['values'](_0x3bd357)['map'](_0x51532a => String(_0x51532a || '')['trim']())["filter"](Boolean) : [];
  const _0x1d6e49 = !_0x52c7f8 ? await resolveVideoInputImages(_0x1c52c2 ? omitSlotImageUrlsFromVideoInputs(_0xcbea63) : _0xcbea63, _0x3a9d81, _0x420262, {
    'modelManifest': _0x343668["extensions"]?.["bodyResolver"] ? null : _0x1cfbda,
    'provider': _0x5c034e,
    'baseUrl': _0x6138f9["apiUrl"],
    'executionManifest': _0x343668,
    'forceCustomProviderFreeImageHost': _0x19bb2e
  }) : [];
  const _0x51df95 = _0x52c7f8 ? [] : _0x1c52c2 ? Array["from"](new Set([..._0x16b953, ..._0x1d6e49])) : _0x1d6e49;
  const _0x5548f5 = _0x52c7f8 ? [] : await resolveInputVideos(_0xcbea63, _0x3a9d81, _0x420262, {
    'modelManifest': _0x1cfbda,
    'provider': _0x5c034e,
    'baseUrl': _0x6138f9["apiUrl"],
    'executionManifest': _0x343668,
    'providerProfileId': _0xcbea63["providerProfileId"]
  });
  const _0x11d6ae = _0x52c7f8 ? [] : await resolveInputAudios(_0xcbea63, _0x3a9d81, _0x420262, {
    'modelManifest': _0x1cfbda,
    'provider': _0x5c034e,
    'baseUrl': _0x6138f9['apiUrl'],
    'executionManifest': _0x343668,
    'providerProfileId': _0xcbea63["providerProfileId"]
  });
  const _0x5811f9 = resolveExecutionModelToken(_0x343668, _0xcbea63);
  const _0x5e0fbb = {
    'provider': _0x5c034e,
    'modelManifest': _0x1cfbda,
    'executionManifest': _0x343668,
    'rawPayload': _0x28a3e5,
    'payload': _0xcbea63,
    'finalPrompt': _0x27596e,
    'modelToken': _0x5811f9,
    'apiKey': _0x3a9d81,
    'ctx': _0x420262,
    'finalUrls': _0x51df95,
    'finalUrlsBySlot': _0x3bd357,
    'inputImages': _0x51df95,
    'inputVideos': _0x5548f5,
    'inputAudios': _0x11d6ae
  };
  const _0x30117a = await buildManifestMappedBody(_0x5e0fbb);
  return {
    'url': "/api/v2/proxy/image",
    'headers': _0x343668["headers"] || {
      'Content-Type': "application/json"
    },
    'body': {
      'apiUrl': resolveManifestApiUrl(_0x5c034e, _0x6138f9, _0x343668, _0x5e0fbb),
      'apiKey': _0x3a9d81,
      ..._0x30117a,
      ...buildModelCatalogIdentity(_0x5c034e, _0x1cfbda)
    },
    'responseMapping': _0x343668["responseMapping"],
    'errorRules': resolveManifestErrorRules(_0x343668),
    'taskPolling': resolveManifestTaskPolling(_0x5c034e, _0x6138f9, _0x343668, _0x5e0fbb),
    'useOpenapiQuery': _0x5c034e === "runninghub",
    'adapterTrace': {
      'source': "manifest",
      'executionId': _0x343668['id'],
      'modelId': _0x42fa04["model"]
    }
  };
}
function getFixedInputSlotOrderByKind(_0x21f6a8 = null, _0x2d0f76 = '') {
  const _0x5b8e97 = String(_0x2d0f76 || '')["trim"]();
  const _0x534f43 = Array["isArray"](_0x21f6a8?.["inputSlots"]?.["fixedSlots"]) ? _0x21f6a8['inputSlots']["fixedSlots"] : [];
  return _0x534f43["filter"](_0x1d5e9d => String(_0x1d5e9d?.["kind"] || '')["trim"]() === _0x5b8e97)["map"](_0xbffd47 => String(_0xbffd47?.['id'] || '')["trim"]())["filter"](Boolean);
}
function getAudioRefUrl(_0x2ed116 = {}) {
  return String(_0x2ed116?.['url'] || _0x2ed116?.["audioUrl"] || _0x2ed116?.["src"] || '')["trim"]();
}
function orderAudioRefsByManifestSlots(_0x48bda0 = [], _0x47c1c6 = null) {
  const _0x476b7c = (Array['isArray'](_0x48bda0) ? _0x48bda0 : [])['filter'](_0x1a3b57 => getAudioRefUrl(_0x1a3b57));
  const _0xa663d9 = getFixedInputSlotOrderByKind(_0x47c1c6, "audio");
  if (_0xa663d9["length"] === 0x0 || _0x476b7c["length"] <= 0x1) {
    return _0x476b7c;
  }
  const _0x1b7947 = new Set();
  const _0x3f4161 = [];
  _0xa663d9['forEach'](_0x274ad4 => {
    const _0xf3a36f = _0x476b7c["findIndex"]((_0xaafd66, _0x4c0518) => !_0x1b7947['has'](_0x4c0518) && String(_0xaafd66?.['refSlot'] || '')["trim"]() === _0x274ad4);
    if (_0xf3a36f < 0x0) {
      return;
    }
    _0x1b7947['add'](_0xf3a36f);
    _0x3f4161["push"](_0x476b7c[_0xf3a36f]);
  });
  _0x476b7c["forEach"]((_0x34a0ec, _0x101d72) => {
    if (!_0x1b7947["has"](_0x101d72)) {
      _0x3f4161["push"](_0x34a0ec);
    }
  });
  return _0x3f4161;
}
function mergeAudioRefsIntoPayload(_0x36e993 = {}, _0x472227 = null) {
  const _0x5e5da8 = Array["isArray"](_0x36e993?.['audioRefs']) ? _0x36e993["audioRefs"] : [];
  const _0x4d5aad = orderAudioRefsByManifestSlots(_0x5e5da8, _0x472227)["map"](_0x56ba5c => getAudioRefUrl(_0x56ba5c))["filter"](Boolean);
  if (_0x4d5aad["length"] === 0x0) {
    return _0x36e993;
  }
  const _0x40e243 = normalizeInputList(_0x36e993["audioUrls"]);
  const _0x599d90 = new Set(_0x4d5aad);
  return {
    ..._0x36e993,
    'audioUrls': [..._0x40e243['filter'](_0x51571a => !_0x599d90["has"](_0x51571a)), ..._0x4d5aad]
  };
}
function createModelApiRequestId() {
  const _0x4769bf = Math['random']()["toString"](0x10)["slice"](0x2, 0xa);
  return Date["now"]() + '-' + _0x4769bf;
}
function buildTaskProxyHeaders(_0x4d483f, _0xeb89ac, _0x4e7b4a) {
  const _0x987b0f = {
    ...(_0x4d483f || {})
  };
  const _0x2c22ea = String(_0x4e7b4a?.["extensions"]?.["apiKeyHeader"] || '')["trim"]();
  _0x2c22ea && _0xeb89ac && !Object["prototype"]["hasOwnProperty"]["call"](_0x987b0f, _0x2c22ea) && (_0x987b0f[_0x2c22ea] = _0xeb89ac);
  const _0x2a506c = String(_0x4e7b4a?.["extensions"]?.['requestIdHeader'] || '')["trim"]();
  _0x2a506c && !Object["keys"](_0x987b0f)['some'](_0x3cd694 => _0x3cd694["toLowerCase"]() === _0x2a506c["toLowerCase"]()) && (_0x987b0f[_0x2a506c] = createModelApiRequestId());
  const _0x3be972 = String(_0x4e7b4a?.['extensions']?.["resourceId"] || '')["trim"]();
  _0x3be972 && !Object["keys"](_0x987b0f)["some"](_0x56ae33 => _0x56ae33["toLowerCase"]() === 'x-api-resource-id') && (_0x987b0f["X-Api-Resource-Id"] = _0x3be972);
  return _0x987b0f;
}
export async function buildAudioRequestFromManifest(_0x2d1cdb, _0x570fcd, _0x24cd13, _0x1ddb3 = {}) {
  const _0x9bd9c1 = String(_0x1ddb3["expectedProvider"] || '')["trim"]()["toLowerCase"]();
  const _0x353aca = resolveRequestManifest(_0x2d1cdb, _0x9bd9c1, "audio");
  if (!_0x353aca) {
    return null;
  }
  const {
    provider: _0x8d3457,
    modelManifest: _0x1f6ac0,
    executionManifest: _0x146dee,
    effectivePayload: _0x385ada
  } = _0x353aca;
  if (!isSupportedModelApiProvider(_0x8d3457, AUDIO_MODEL_API_PROVIDERS)) {
    return null;
  }
  const _0x159f5b = mergeAudioRefsIntoPayload(_0x385ada, _0x1f6ac0);
  const _0x3b9f00 = mergeUiSchemaDefaultsIntoPayload(_0x159f5b, _0x1f6ac0);
  const _0x27dd2e = resolveProviderConfig(_0x8d3457, _0x3b9f00, _0x24cd13);
  const _0x2277bc = resolveApiKey(_0x8d3457, _0x3b9f00, _0x24cd13, _0x27dd2e);
  !_0x2277bc && throwMissingApiKey(_0x8d3457);
  const _0x3524f1 = await resolveInputImagesBySlot(_0x8d3457, _0x3b9f00, _0x2277bc, _0x24cd13, {
    'modelManifest': _0x1f6ac0,
    'provider': _0x8d3457,
    'baseUrl': _0x27dd2e["apiUrl"],
    'executionManifest': _0x146dee
  });
  const _0x264f5c = Object["keys"](_0x3524f1)["length"] > 0x0 ? Object["values"](_0x3524f1) : await resolveInputImages(_0x8d3457, _0x3b9f00, _0x2277bc, _0x24cd13, {
    'modelManifest': _0x1f6ac0,
    'provider': _0x8d3457,
    'baseUrl': _0x27dd2e["apiUrl"],
    'executionManifest': _0x146dee
  });
  const _0x35c8af = await resolveInputAudios(_0x3b9f00, _0x2277bc, _0x24cd13, {
    'modelManifest': _0x1f6ac0,
    'provider': _0x8d3457,
    'baseUrl': _0x27dd2e["apiUrl"],
    'executionManifest': _0x146dee
  });
  const _0x48773b = resolveExecutionModelToken(_0x146dee, _0x3b9f00);
  const _0x4ef2da = {
    'provider': _0x8d3457,
    'modelManifest': _0x1f6ac0,
    'executionManifest': _0x146dee,
    'payload': _0x3b9f00,
    'finalPrompt': _0x570fcd,
    'modelToken': _0x48773b,
    'apiKey': _0x2277bc,
    'ctx': _0x24cd13,
    'inputImages': _0x264f5c,
    'inputVideos': [],
    'inputAudios': _0x35c8af
  };
  const _0x246e3b = await buildManifestMappedBody(_0x4ef2da);
  const _0x202104 = resolveManifestApiUrl(_0x8d3457, _0x27dd2e, _0x146dee, _0x4ef2da);
  const _0x4ae336 = String(_0x146dee["extensions"]?.["proxyMode"] || '')["trim"]()["toLowerCase"]();
  if (_0x4ae336 === "task") {
    return {
      'url': '/api/v2/proxy/task?apiUrl=' + encodeURIComponent(_0x202104),
      'headers': buildTaskProxyHeaders(_0x146dee["headers"] || {
        'Content-Type': "application/json"
      }, _0x2277bc, _0x146dee),
      'body': _0x246e3b,
      'responseMapping': _0x146dee["responseMapping"],
      'errorRules': resolveManifestErrorRules(_0x146dee),
      'adapterTrace': {
        'source': "manifest",
        'executionId': _0x146dee['id'],
        'modelId': _0x3b9f00["model"]
      },
      'meta': {
        'provider': _0x8d3457,
        'adapterType': "modelApi",
        'audioWorkflowKey': _0x1f6ac0["modelId"],
        'audioWorkflowLabel': _0x1f6ac0["displayName"] || _0x1f6ac0["modelId"],
        'model': _0x1f6ac0["modelId"],
        'executionId': _0x146dee['id'],
        'isManifestAudioModelApi': !![]
      }
    };
  }
  return {
    'url': "/api/v2/proxy/image",
    'headers': _0x146dee["headers"] || {
      'Content-Type': "application/json"
    },
    'body': {
      'apiUrl': _0x202104,
      'apiKey': _0x2277bc,
      ..._0x246e3b
    },
    'responseMapping': _0x146dee["responseMapping"],
    'errorRules': resolveManifestErrorRules(_0x146dee),
    'adapterTrace': {
      'source': "manifest",
      'executionId': _0x146dee['id'],
      'modelId': _0x3b9f00["model"]
    },
    'meta': {
      'provider': _0x8d3457,
      'adapterType': "modelApi",
      'audioWorkflowKey': _0x1f6ac0["modelId"],
      'audioWorkflowLabel': _0x1f6ac0["displayName"] || _0x1f6ac0["modelId"],
      'model': _0x1f6ac0["modelId"],
      'executionId': _0x146dee['id'],
      'isManifestAudioModelApi': !![]
    }
  };
}
function normalizeTextMaxOutputTokens(_0x58e653) {
  const _0x361552 = Math["trunc"](Number(_0x58e653) || 0x0);
  return _0x361552 > 0x0 ? _0x361552 : 0x0;
}
function resolveGeminiNativeVideoApiUrl(_0x31fa28, _0x356281, _0x75a02, _0x421194) {
  const _0x27c887 = _0x75a02["extensions"]?.["geminiNativeVideo"];
  const _0x578afe = String(_0x27c887?.["endpointTemplate"] || '')["trim"]();
  if (!_0x578afe || !_0x578afe["includes"]("{model}")) {
    throw new Error('Gemini\x20native\x20video\x20manifest\x20requires\x20an\x20endpointTemplate\x20with\x20{model}');
  }
  const _0x3c8409 = _0x578afe['replace']("{model}", encodeURIComponent(_0x421194['modelToken']));
  const _0x295b88 = resolveDefaultApiUrl(_0x31fa28, _0x356281, {
    'endpoint': _0x3c8409
  });
  return _0x31fa28 === 'runninghub' ? remapRunningHubModelApiUrl(_0x295b88, _0x421194?.["payload"]?.["providerProfileId"]) : _0x295b88;
}
function buildGeminiNativeThinkingConfig(_0x478743, _0x2f7b7a) {
  const _0x4d9d2e = String(_0x478743?.["type"] || '')["trim"]()["toLowerCase"]();
  if (_0x4d9d2e !== "disabled") {
    return {};
  }
  const _0x52c639 = _0x2f7b7a?.["thinkingControl"];
  if (_0x52c639?.["disabledUnsupported"] === !![]) {
    throw new Error('当前\x20Gemini\x20模型不支持关闭思考，请改用支持无思考模式的模型');
  }
  const _0x582505 = Number(_0x52c639?.["disabledBudget"]);
  if (!Number["isFinite"](_0x582505) || _0x582505 < 0x0) {
    return {};
  }
  return {
    'thinkingConfig': {
      'thinkingBudget': Math["trunc"](_0x582505),
      'includeThoughts': _0x52c639?.["includeThoughts"] === !![]
    }
  };
}
function buildGeminiNativeGenerationConfig(_0x39ca2e, _0x58af5f, _0x4cfba6, _0x146e57) {
  const _0x22657d = normalizeTextStructuredOutput(_0x39ca2e);
  return {
    ...(_0x58af5f ? {
      'maxOutputTokens': _0x58af5f
    } : {}),
    ...buildGeminiNativeThinkingConfig(_0x4cfba6, _0x146e57),
    ...(_0x22657d ? {
      'responseMimeType': "application/json",
      'responseJsonSchema': _0x22657d["schema"]
    } : {})
  };
}
export async function buildTextRequestFromManifest(_0x46dca5, _0x27449c, _0x2c2732, _0x1788f9 = {}) {
  const _0x325dff = String(_0x1788f9["expectedProvider"] || '')["trim"]()['toLowerCase']();
  const _0x368462 = resolveRequestManifest(_0x46dca5, _0x325dff, "text");
  if (!_0x368462) {
    return null;
  }
  const {
    provider: _0x590a73,
    modelManifest: _0x2ba7bb,
    effectivePayload: _0x56f774
  } = _0x368462;
  if (_0x368462['executionManifest']["extensions"]?.['audioModelApi']) {
    return buildRunningHubCatalogRequest(_0x56f774, _0x27449c, _0x368462, _0x2c2732);
  }
  const _0x47b124 = mergeUiSchemaDefaultsIntoPayload(_0x56f774, _0x2ba7bb);
  const _0x421523 = selectTextMediaExecution(_0x368462["executionManifest"], _0x47b124, _0x2c2732);
  const _0x464ec7 = resolveProviderConfig(_0x590a73, _0x47b124, _0x2c2732);
  const _0x2f794f = resolveApiKey(_0x590a73, _0x47b124, _0x2c2732, _0x464ec7) || _0x464ec7["apiKey"];
  if (!_0x2f794f) {
    throwMissingApiKey(_0x590a73);
  }
  const _0x1d35cc = resolveExecutionModelToken(_0x421523, _0x47b124);
  const _0x1a868a = {
    'provider': _0x590a73,
    'modelManifest': _0x2ba7bb,
    'executionManifest': _0x421523,
    'payload': _0x47b124,
    'finalPrompt': _0x27449c,
    'modelToken': _0x1d35cc,
    'apiKey': _0x2f794f,
    'ctx': _0x2c2732,
    'inputImages': [],
    'inputVideos': [],
    'inputAudios': []
  };
  const _0x2f8442 = isCustomProviderModelManifest(_0x2ba7bb);
  const _0x9966d8 = String(_0x421523['extensions']?.["structuredOutputMode"] || "json_schema")["trim"]();
  const _0x164e4d = getTextStructuredOutputRequestMeta(_0x47b124['structuredOutput'], {
    'mode': _0x9966d8
  });
  const _0xaaae68 = normalizeTextMaxOutputTokens(_0x47b124['maxOutputTokens']);
  const _0x2af57b = String(_0x47b124["thinking"]?.['type'] || '')["trim"]();
  const _0x4e9a3d = String(_0x421523["extensions"]?.["thinkingControlMode"] || '')["trim"]();
  const _0x5304fc = String(_0x47b124["reasoningEffort"] || _0x47b124["reasoning_effort"] || '')["trim"]()['toLowerCase']();
  const _0x39a280 = ["none", 'minimal', "low", "medium", "high"]["includes"](_0x5304fc) ? _0x5304fc : '';
  const _0x460979 = _0x421523["extensions"]?.["reasoningEffortMode"] === "openai" ? _0x39a280 || (_0x2af57b === 'disabled' ? "minimal" : _0x2af57b === "enabled" ? 'medium' : '') : '';
  const _0x5c8f14 = _0x421523["extensions"]?.["geminiNativeVideo"];
  const _0x45da80 = Array["isArray"](_0x47b124["inputVideoUrls"]) ? _0x47b124["inputVideoUrls"]["filter"](Boolean) : [];
  if (_0x5c8f14 && _0x45da80["length"] > 0x0) {
    if (typeof _0x2c2732['buildGeminiNativeVideoUserParts'] !== "function") {
      throw new Error("Gemini native video manifest requires user content resolver");
    }
    const _0x3048bc = buildGeminiNativeGenerationConfig(_0x47b124["structuredOutput"], _0xaaae68, _0x47b124["thinking"], _0x5c8f14);
    const _0x1236fd = typeof _0x2c2732["resolveChatCompletionInputUrls"] === "function" ? _0x2c2732["resolveChatCompletionInputUrls"]({
      'providerId': _0x590a73,
      'mediaPolicy': _0x5c8f14["mediaPolicy"] || "image-video",
      'inputUrls': _0x47b124["inputUrls"] || [],
      'inputImageUrls': _0x47b124['inputImageUrls'] || [],
      'inputVideoUrls': _0x45da80,
      'inputAudioUrls': []
    }) : {
      'inputUrls': _0x47b124["inputUrls"] || [],
      'inputImageUrls': _0x47b124["inputImageUrls"] || [],
      'inputVideoUrls': _0x45da80
    };
    const _0x94d654 = await _0x2c2732["buildGeminiNativeVideoUserParts"](_0x27449c, _0x1236fd, _0x2f794f, _0x590a73, {
      'mediaPolicy': _0x5c8f14["mediaPolicy"] || "image-video",
      'inputImageUrls': _0x47b124['inputImageUrls'] || [],
      'inputVideoUrls': _0x45da80,
      'videoInputEncoding': _0x5c8f14["videoInputEncoding"],
      'signal': _0x47b124["signal"],
      'imageUploadProvider': _0x5c8f14["imageUploadProvider"] || _0x5c8f14["uploadProvider"] || _0x590a73,
      'videoUploadProvider': _0x5c8f14["videoUploadProvider"] || _0x5c8f14["uploadProvider"] || _0x590a73,
      'apiUrl': _0x464ec7["apiUrl"]
    });
    return {
      'url': "/api/v2/proxy/completions",
      'headers': _0x421523["headers"] || {
        'Content-Type': "application/json"
      },
      'body': {
        'apiUrl': resolveGeminiNativeVideoApiUrl(_0x590a73, _0x464ec7, _0x421523, _0x1a868a),
        'apiKey': _0x2f794f,
        ...(_0x47b124['systemPrompt'] ? {
          'systemInstruction': {
            'parts': [{
              'text': _0x47b124["systemPrompt"]
            }]
          }
        } : {}),
        'contents': [{
          'role': "user",
          'parts': _0x94d654
        }],
        ...(Object["keys"](_0x3048bc)["length"] > 0x0 ? {
          'generationConfig': _0x3048bc
        } : {})
      },
      'responseMapping': _0x421523["responseMapping"],
      'errorRules': resolveManifestErrorRules(_0x421523),
      'isProxy': !![],
      'structuredOutput': _0x164e4d,
      'adapterTrace': {
        'source': "manifest",
        'executionId': _0x421523['id'],
        'modelId': _0x47b124['model']
      }
    };
  }
  if (_0x421523["endpointMode"] === 'responses') {
    const _0x34253e = await buildTextResponsesBody({
      'executionManifest': _0x421523,
      'payload': _0x47b124,
      'finalPrompt': _0x27449c,
      'apiKey': _0x2f794f,
      'provider': _0x590a73,
      'modelToken': _0x1d35cc,
      'cfg': _0x464ec7,
      'ctx': _0x2c2732,
      'maxOutputTokens': _0xaaae68,
      'thinkingType': _0x2af57b,
      'thinkingControlMode': _0x4e9a3d,
      'forceCustomProviderFreeImageHost': _0x2f8442
    });
    return {
      'url': "/api/v2/proxy/completions",
      'headers': _0x421523["headers"] || {
        'Content-Type': 'application/json'
      },
      'body': {
        'apiUrl': resolveManifestApiUrl(_0x590a73, _0x464ec7, _0x421523, _0x1a868a),
        ..._0x34253e
      },
      'responseMapping': _0x421523["responseMapping"],
      'errorRules': resolveManifestErrorRules(_0x421523),
      'isProxy': !![],
      'structuredOutput': _0x164e4d,
      'adapterTrace': {
        'source': "manifest",
        'executionId': _0x421523['id'],
        'modelId': _0x47b124["model"]
      }
    };
  }
  const _0x5ed9fd = String(_0x421523["endpointMode"] || '')["trim"]();
  if (!_0x5ed9fd || _0x5ed9fd === "chat-completion") {
    if (typeof _0x2c2732["buildChatCompletionUserContent"] !== "function") {
      throw new Error("chat-completion text manifest requires user content resolver");
    }
    const _0x41c0c4 = typeof _0x2c2732['resolveChatCompletionInputUrls'] === "function" ? _0x2c2732["resolveChatCompletionInputUrls"]({
      'providerId': _0x590a73,
      'mediaPolicy': _0x421523['extensions']?.["chatCompletionInputPolicy"],
      'inputUrls': _0x47b124["inputUrls"] || [],
      'inputImageUrls': _0x47b124['inputImageUrls'] || [],
      'inputVideoUrls': _0x47b124["inputVideoUrls"] || [],
      'inputAudioUrls': _0x47b124["inputAudioUrls"] || []
    }) : _0x47b124["inputImageUrls"] || _0x47b124["inputUrls"] || [];
    const _0x35ff71 = await _0x2c2732['buildChatCompletionUserContent'](_0x27449c, _0x41c0c4, _0x2f794f, _0x590a73, {
      'mediaPolicy': _0x421523['extensions']?.["chatCompletionInputPolicy"],
      'inputImageUrls': _0x47b124["inputImageUrls"] || [],
      'inputVideoUrls': _0x47b124['inputVideoUrls'] || [],
      'inputAudioUrls': _0x47b124["inputAudioUrls"] || [],
      'forceCustomProviderFreeImageHost': _0x2f8442,
      'apiUrl': _0x464ec7["apiUrl"],
      'providerProfileId': _0x47b124["providerProfileId"],
      'strictUpload': _0x421523["extensions"]?.["strictUpload"] === !![],
      'mediaInputEncoding': _0x421523["extensions"]?.["mediaInputEncoding"],
      'signal': _0x47b124["signal"]
    });
    return {
      'url': "/api/v2/proxy/completions",
      'headers': _0x421523["headers"] || {
        'Content-Type': "application/json"
      },
      'body': {
        'apiUrl': resolveManifestApiUrl(_0x590a73, _0x464ec7, _0x421523, _0x1a868a),
        'apiKey': _0x2f794f,
        'model': _0x1d35cc,
        'stream': _0x421523["extensions"]?.["streaming"] === !![],
        'messages': [{
          'role': 'system',
          'content': buildTextStructuredOutputSystemPrompt(_0x47b124['systemPrompt'], _0x47b124["structuredOutput"], {
            'mode': _0x9966d8
          })
        }, {
          'role': "user",
          'content': _0x35ff71
        }],
        ...(_0xaaae68 ? {
          'max_tokens': _0xaaae68
        } : {}),
        ...(_0x460979 ? {
          'reasoning_effort': _0x460979
        } : _0x2af57b && _0x4e9a3d === "thinking" ? {
          'thinking': {
            'type': _0x2af57b
          }
        } : {}),
        ...buildChatCompletionsStructuredOutput(_0x47b124["structuredOutput"], {
          'mode': _0x9966d8
        }),
        ...(await buildBodyFromMapping({
          'bodyMapping': _0x421523["extensions"]?.['chatCompletionBodyMapping'] || [],
          'context': _0x1a868a
        }))
      },
      'responseMapping': _0x421523["responseMapping"],
      'errorRules': resolveManifestErrorRules(_0x421523),
      'isProxy': !![],
      'structuredOutput': _0x164e4d,
      'adapterTrace': {
        'source': "manifest",
        'executionId': _0x421523['id'],
        'modelId': _0x47b124['model']
      }
    };
  }
  if (_0x5ed9fd && _0x5ed9fd !== "image-to-text") {
    throw new Error('Unsupported\x20text\x20manifest\x20endpointMode:\x20' + _0x5ed9fd);
  }
  const _0x233af2 = Array["isArray"](_0x47b124['inputImageUrls']) ? _0x47b124["inputImageUrls"] : [];
  if (_0x233af2["length"] === 0x0) {
    throw new Error("RunningHub image-to-text manifest requires an image input");
  }
  const _0x2afb1f = await _0x2c2732["buildRunningHubTextImageUrl"](_0x233af2, _0x2f794f, {
    'apiUrl': _0x464ec7["apiUrl"],
    'providerProfileId': _0x47b124["providerProfileId"]
  });
  if (!_0x2afb1f) {
    throw new Error("RunningHub 图像识别输入准备失败：未返回有效图片地址，请重新选择图片后重试");
  }
  return {
    'url': "/api/v2/proxy/image",
    'headers': _0x421523["headers"] || {
      'Content-Type': "application/json"
    },
    'body': {
      'apiUrl': buildRunningHubModelApiUrl(_0x47b124["providerProfileId"], '/openapi/v2/' + _0x421523["model"]),
      'apiKey': _0x2f794f,
      'prompt': _0x27449c,
      'imageUrl': _0x2afb1f
    },
    'responseMapping': _0x421523["responseMapping"],
    'errorRules': resolveManifestErrorRules(_0x421523),
    'isProxy': !![],
    'adapterTrace': {
      'source': "manifest",
      'executionId': _0x421523['id'],
      'modelId': _0x47b124["model"]
    }
  };
}
export async function buildImageRequestFromManifest(_0x435fbe, _0x393abd, _0x7aad61, _0x40ce1f = {}) {
  const _0x3f51d9 = String(_0x40ce1f["expectedProvider"] || '')['trim']()['toLowerCase']();
  const _0x26e225 = resolveRequestManifest(_0x435fbe, _0x3f51d9, 'image');
  if (!_0x26e225) {
    return null;
  }
  const {
    provider: _0x32cbdb,
    modelManifest: _0x4e730c,
    executionManifest: _0x3557e4,
    effectivePayload: _0x5e3ba1
  } = _0x26e225;
  if (!isSupportedModelApiProvider(_0x32cbdb, IMAGE_MODEL_API_PROVIDERS)) {
    return null;
  }
  validateStrictModelUiSchemaParams(_0x5e3ba1, _0x4e730c, _0x3557e4);
  validateStrictImageInputCounts(_0x5e3ba1, _0x4e730c, _0x3557e4);
  const _0x212535 = mergeUiSchemaDefaultsIntoPayload(_0x5e3ba1, _0x4e730c);
  const _0x13cd30 = resolveProviderConfig(_0x32cbdb, _0x212535, _0x7aad61);
  const _0x23a738 = resolveApiKey(_0x32cbdb, _0x212535, _0x7aad61, _0x13cd30);
  !_0x23a738 && throwMissingApiKey(_0x32cbdb);
  const _0x35d7a5 = resolveInputRouteExecutionManifest(_0x3557e4, _0x212535, _0x4e730c);
  const _0x945bf = isMultipartFormExecution(_0x35d7a5);
  const _0x4c495d = doesResolverOwnInputResolution(_0x35d7a5) && !isCustomProviderModelManifest(_0x4e730c);
  const _0xea6aef = _0x945bf || _0x4c495d ? {} : await resolveInputImagesBySlot(_0x32cbdb, _0x212535, _0x23a738, _0x7aad61, {
    'modelManifest': _0x4e730c,
    'executionManifest': _0x35d7a5,
    'baseUrl': _0x13cd30["apiUrl"]
  });
  const _0x5922ae = Object['keys'](_0xea6aef)["length"] > 0x0;
  const _0x11adba = _0x945bf ? await resolveMultipartInputImages(_0x212535, _0x4e730c, _0x7aad61) : _0x4c495d ? collectResolverOwnedImageInputUrls(_0x212535, _0x4e730c) : _0x5922ae ? Object["values"](_0xea6aef) : await resolveInputImages(_0x32cbdb, _0x212535, _0x23a738, _0x7aad61, {
    'modelManifest': _0x4e730c,
    'executionManifest': _0x35d7a5,
    'baseUrl': _0x13cd30["apiUrl"]
  });
  const _0x2376d6 = resolveExecutionModelToken(_0x35d7a5, _0x212535);
  const _0x1fe0c1 = {
    'provider': _0x32cbdb,
    'modelManifest': _0x4e730c,
    'executionManifest': _0x35d7a5,
    'payload': _0x212535,
    'finalPrompt': _0x393abd,
    'modelToken': _0x2376d6,
    'apiKey': _0x23a738,
    'ctx': _0x7aad61,
    'finalUrls': _0x11adba,
    'finalUrlsBySlot': _0xea6aef,
    'inputImages': _0x11adba,
    'inputVideos': [],
    'inputAudios': []
  };
  const _0x44619 = await buildManifestMappedBody(_0x1fe0c1);
  const _0x3c1efd = _0x32cbdb === "runninghub";
  const _0x358c23 = resolveManifestApiUrl(_0x32cbdb, _0x13cd30, _0x35d7a5, _0x1fe0c1);
  const _0x26950c = resolveManifestTaskPolling(_0x32cbdb, _0x13cd30, _0x35d7a5, _0x1fe0c1);
  // 内部控制键（__aic* 前缀）只供本地代理层语义使用，严禁进入厂商请求体：
  // 严格校验未知字段的厂商队列（如 Agnes 国际版）会直接拒收。
  const _0x42cccb = Number(_0x35d7a5["extensions"]?.["requestTimeoutMs"]);
  const _0x3eb42c = Number["isFinite"](_0x42cccb) && _0x42cccb > 0x0 ? {
    'requestTimeoutMs': Math["trunc"](_0x42cccb)
  } : {};
  if (_0x945bf) {
    return {
      'url': "/api/v2/proxy/upload?apiUrl=" + encodeURIComponent(_0x358c23),
      'headers': {
        'Authorization': "Bearer " + _0x23a738
      },
      'body': buildMultipartFormData(_0x44619),
      'responseMapping': _0x35d7a5["responseMapping"],
      'errorRules': resolveManifestErrorRules(_0x35d7a5),
      'taskPolling': _0x26950c,
      ..._0x3eb42c,
      'adapterTrace': {
        'source': "manifest",
        'executionId': _0x35d7a5['id'],
        'modelId': _0x212535["model"]
      }
    };
  }
  return {
    'url': "/api/v2/proxy/image",
    'headers': _0x35d7a5["headers"] || {
      'Content-Type': "application/json"
    },
    'body': {
      'apiUrl': _0x358c23,
      'apiKey': _0x23a738,
      ..._0x44619,
      ...buildModelCatalogIdentity(_0x32cbdb, _0x4e730c)
    },
    'responseMapping': _0x35d7a5["responseMapping"],
    'errorRules': resolveManifestErrorRules(_0x35d7a5),
    'taskPolling': _0x26950c,
    ..._0x3eb42c,
    'adapterTrace': {
      'source': 'manifest',
      'executionId': _0x35d7a5['id'],
      'modelId': _0x435fbe["model"]
    },
    ...(_0x3c1efd ? {
      'isAsync': !![],
      'taskIdPath': _0x3557e4["responseMapping"]?.['taskIdPath'] || _0x3557e4["result"]?.["taskIdPath"] || "taskId",
      'useOpenapiQuery': !![],
      'pollUrlBuilder': () => buildRunningHubModelApiUrl(_0x212535['providerProfileId'], '/openapi/v2/query'),
      'resultExtractor': _0x1e1946 => {
        if (_0x1e1946["status"] === "COMPLETED" && Array["isArray"](_0x1e1946["results"])) {
          return _0x1e1946["results"]["map"](_0x2e4314 => _0x2e4314["url"] || _0x2e4314["imageUrl"] || _0x2e4314["videoUrl"])['filter'](Boolean);
        }
        return [];
      }
    } : {})
  };
}