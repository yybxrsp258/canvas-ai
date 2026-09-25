import { isDreaminaStyleVideoModel, normalizeDreaminaVideoRouteMode } from './dreaminaVideoModelHelper.js';
import { PERSON_REPLACE_V3_MODEL_ID, PERSON_REPLACE_V21_MODEL_ID, QWEN_IMAGE_EDIT_MODEL_ID, getModelManifest, normalizeProviderId, resolveModelExecution, resolveModelProvider } from '../manifests/index.js';
import { isHappyHorseModelApiVideo, isSeedance2ModelApiVideo } from './modelApiVideoResolverPolicy.js';
import { t } from '../i18n/index.js';
export const INPUT_KIND_ORDER = Object["freeze"](["text", "image", "video", 'audio']);
export const INPUT_KIND_LABELS = Object["freeze"]({
  'text': '文本',
  'image': '图片',
  'video': '视频',
  'audio': '音频'
});
function modelInputPolicyText(_0x583d5f, _0x4dcab3 = {}) {
  return t("modelInputPolicy." + _0x583d5f, _0x4dcab3);
}
export function getInputKindLabel(_0xba8dd6) {
  const _0x59330a = normalizeInputKind(_0xba8dd6);
  if (!_0x59330a) {
    return modelInputPolicyText("inputKinds.material");
  }
  return modelInputPolicyText('inputKinds.' + _0x59330a);
}
export const RH_PERSON_REPLACE_V21_MODEL = PERSON_REPLACE_V21_MODEL_ID;
export const RH_QWEN_IMAGE_EDIT_MODEL = QWEN_IMAGE_EDIT_MODEL_ID;
const APIMART_WAN27_MODEL_ID = "apimart/wan2.7";
const APIMART_KLING_V3_OMNI_MODEL_ID = "apimart/kling-v3-omni";
const APIMART_VIDU_Q3_MODEL_ID = 'apimart/viduq3';
const RH_PERSON_REPLACE_FIXED_IMAGE_SLOTS = Object["freeze"](['replaceTarget', "replacedImage"]);
const INPUT_TARGET_NODE_TYPES = new Set(['ai-image', "ai-video", 'ai-audio', "ai-text", "group", 'media-clip', 'panorama-360', "panorama_360", 'panorama360', 'storyboard', "storyboard-script", "whiteboard"]);
function normalizeText(_0x3a2bbd) {
  return String(_0x3a2bbd || '')['trim']();
}
export function isRhPersonReplaceV3Model(_0x2259aa) {
  return getModelManifest(_0x2259aa)?.['modelId'] === PERSON_REPLACE_V3_MODEL_ID;
}
function hasExactPersonReplaceFixedImageSlotCapability(_0x48a065) {
  const _0x50f7d1 = _0x48a065?.['capabilities']?.["fixedImageSlots"];
  return Array["isArray"](_0x50f7d1) && _0x50f7d1['length'] === RH_PERSON_REPLACE_FIXED_IMAGE_SLOTS["length"] && _0x50f7d1["every"]((_0x4b1174, _0x423ec2) => _0x4b1174 === RH_PERSON_REPLACE_FIXED_IMAGE_SLOTS[_0x423ec2]);
}
function hasPersonReplaceFixedImageInputSlots(_0x1b867e) {
  const _0x4d66df = _0x1b867e?.['inputSlots']?.["fixedSlots"];
  if (!Array["isArray"](_0x4d66df)) {
    return ![];
  }
  return RH_PERSON_REPLACE_FIXED_IMAGE_SLOTS["every"](_0x6787e2 => _0x4d66df["some"](_0x5c2c13 => _0x5c2c13?.['id'] === _0x6787e2 && _0x5c2c13?.['kind'] === 'image'));
}
function isDreaminaManifestOrModel(_0x7ac2ce, _0x56aa22 = '') {
  return resolveTargetProvider(_0x7ac2ce, _0x56aa22) === "dreamina";
}
function isHappyHorseVideoModel(_0x262dc2, _0xb5fbf7 = '') {
  return isHappyHorseModelApiVideo(_0x262dc2, _0xb5fbf7);
}
function isSeedance2VideoModel(_0x526b71, _0x1eb19c = '') {
  return isSeedance2ModelApiVideo(_0x526b71, _0x1eb19c);
}
function isApimartWan27VideoModel(_0x5d60e1, _0x23013d = '') {
  const _0x34419d = resolveModelExecution(_0x5d60e1, {
    'providerHint': _0x23013d
  }) || resolveModelExecution(_0x5d60e1);
  const _0x3dfe1b = _0x34419d?.["modelManifest"] || getModelManifest(_0x5d60e1);
  const _0x3bb143 = normalizeText(_0x34419d?.["canonicalModelId"] || _0x3dfe1b?.["modelId"] || _0x5d60e1);
  if (_0x3bb143 !== APIMART_WAN27_MODEL_ID) {
    return ![];
  }
  const _0x100a88 = normalizeProviderId(_0x3dfe1b?.["provider"]) || resolveTargetProvider(_0x5d60e1, _0x23013d);
  return !_0x100a88 || _0x100a88 === "apimart";
}
function isApimartKlingV3OmniVideoModel(_0x320c53, _0x569f1d = '') {
  const _0xc81bad = resolveModelExecution(_0x320c53, {
    'providerHint': _0x569f1d
  }) || resolveModelExecution(_0x320c53);
  const _0x313e42 = _0xc81bad?.['modelManifest'] || getModelManifest(_0x320c53);
  const _0x4f5363 = normalizeText(_0xc81bad?.['canonicalModelId'] || _0x313e42?.["modelId"] || _0x320c53);
  if (_0x4f5363 !== APIMART_KLING_V3_OMNI_MODEL_ID) {
    return ![];
  }
  const _0x39cf6a = normalizeProviderId(_0x313e42?.["provider"]) || resolveTargetProvider(_0x320c53, _0x569f1d);
  return !_0x39cf6a || _0x39cf6a === "apimart";
}
function isApimartViduQ3VideoModel(_0x5c1279, _0x6a48b = '') {
  const _0x1d1517 = resolveModelExecution(_0x5c1279, {
    'providerHint': _0x6a48b
  }) || resolveModelExecution(_0x5c1279);
  const _0x5b85e5 = _0x1d1517?.['modelManifest'] || getModelManifest(_0x5c1279);
  const _0x20a335 = normalizeText(_0x1d1517?.['canonicalModelId'] || _0x5b85e5?.["modelId"] || _0x5c1279);
  if (_0x20a335 !== APIMART_VIDU_Q3_MODEL_ID) {
    return ![];
  }
  const _0x29695d = normalizeProviderId(_0x5b85e5?.['provider']) || resolveTargetProvider(_0x5c1279, _0x6a48b);
  return !_0x29695d || _0x29695d === 'apimart';
}
function resolveTargetProvider(_0x3bca4a, _0x4b63a0 = '') {
  const _0x44732a = normalizeProviderId(_0x4b63a0);
  if (_0x44732a) {
    return _0x44732a;
  }
  return resolveModelProvider(_0x3bca4a, '', {
    'allowProviderHint': ![],
    'allowPrefixInference': ![]
  }) || normalizeProviderId(getModelManifest(_0x3bca4a)?.['provider']);
}
export function isRhPersonReplaceWorkflowModel(_0x34b651) {
  const _0x58ea4d = getModelManifest(_0x34b651);
  return _0x58ea4d?.['kind'] === "image" && hasExactPersonReplaceFixedImageSlotCapability(_0x58ea4d) && hasPersonReplaceFixedImageInputSlots(_0x58ea4d);
}
export function isRhQwenImageEditModel(_0x4cfab9) {
  return normalizeText(_0x4cfab9) === RH_QWEN_IMAGE_EDIT_MODEL;
}
const VIDEO_PATH_RE = /\.(?:mp4|mov|m4v|webm|mkv|avi|mpeg|mpg|3gp)(?:[?#].*)?$/i;
const AUDIO_PATH_RE = /\.(?:mp3|wav|m4a|aac|flac|ogg|opus|wma)(?:[?#].*)?$/i;
const IMAGE_PATH_RE = /\.(?:png|jpe?g|webp|gif|bmp|tiff?|avif)(?:[?#].*)?$/i;
export function normalizeInputKind(_0x3b81c3) {
  const _0x3ac55e = _0x3b81c3 && typeof _0x3b81c3 === 'object' ? normalizeText(_0x3b81c3["type"]) : normalizeText(_0x3b81c3);
  if (!_0x3ac55e) {
    return '';
  }
  if (_0x3ac55e === "text" || _0x3ac55e === "source-text" || _0x3ac55e === "ai-text") {
    return "text";
  }
  if (_0x3ac55e === "image" || _0x3ac55e === "source-image" || _0x3ac55e === "ai-image") {
    return 'image';
  }
  if (_0x3ac55e === "video" || _0x3ac55e === 'source-video' || _0x3ac55e === 'ai-video') {
    return 'video';
  }
  if (_0x3ac55e === "audio" || _0x3ac55e === 'source-audio' || _0x3ac55e === "ai-audio") {
    return "audio";
  }
  if (_0x3ac55e["includes"]('text')) {
    return "text";
  }
  if (_0x3ac55e["includes"]("video")) {
    return "video";
  }
  if (_0x3ac55e["includes"]('audio')) {
    return "audio";
  }
  if (_0x3ac55e["includes"]('image')) {
    return 'image';
  }
  return '';
}
function normalizeExplicitMediaKind(_0x595857) {
  const _0x173aa5 = normalizeText(_0x595857)["toLowerCase"]();
  if (!_0x173aa5) {
    return '';
  }
  if (_0x173aa5 === 'text' || _0x173aa5 === "source-text" || _0x173aa5 === "ai-text") {
    return 'text';
  }
  if (_0x173aa5 === "image" || _0x173aa5 === "source-image" || _0x173aa5 === "ai-image" || _0x173aa5 === 'asset-image' || _0x173aa5["startsWith"]("image/")) {
    return "image";
  }
  if (_0x173aa5 === "video" || _0x173aa5 === "source-video" || _0x173aa5 === "ai-video" || _0x173aa5 === "asset-video" || _0x173aa5["startsWith"]("video/")) {
    return 'video';
  }
  if (_0x173aa5 === "audio" || _0x173aa5 === "source-audio" || _0x173aa5 === "ai-audio" || _0x173aa5 === 'asset-audio' || _0x173aa5["startsWith"]("audio/")) {
    return 'audio';
  }
  return '';
}
function hasPathLikeValue(_0x789f8a, _0x4eb8c1, _0x2902ef) {
  if (!_0x789f8a || typeof _0x789f8a !== "object") {
    return ![];
  }
  return _0x4eb8c1["some"](_0x56d93c => _0x2902ef(normalizeText(_0x789f8a?.[_0x56d93c])));
}
function isVideoPath(_0x17f4e6) {
  return VIDEO_PATH_RE["test"](normalizeText(_0x17f4e6));
}
function isAudioPath(_0x517d9f) {
  return AUDIO_PATH_RE["test"](normalizeText(_0x517d9f));
}
function isImagePath(_0x3c7080) {
  return IMAGE_PATH_RE["test"](normalizeText(_0x3c7080));
}
function hasExplicitKind(_0x5bd3d6, _0x1f2e03) {
  if (!_0x5bd3d6 || typeof _0x5bd3d6 !== 'object') {
    return ![];
  }
  const _0x5bf79b = ['kind', 'mediaKind', "mediaTaskKind", "asyncTaskKind", "assetKind", 'assetType', "mediaType", "mimeType"];
  return _0x5bf79b['some'](_0x331294 => normalizeExplicitMediaKind(_0x5bd3d6?.[_0x331294]) === _0x1f2e03);
}
function hasVideoEvidence(_0x1e15e9 = {}, _0x36b85d = null) {
  if (!_0x1e15e9 || typeof _0x1e15e9 !== "object") {
    return ![];
  }
  if (hasExplicitKind(_0x1e15e9, "video")) {
    return !![];
  }
  const _0x39d062 = Array["isArray"](_0x1e15e9["videos"]) ? _0x1e15e9["videos"] : [];
  if (_0x39d062["some"](_0x5e74f3 => getVideoSourceKey(_0x5e74f3) || hasExplicitKind(_0x5e74f3, "video"))) {
    return !![];
  }
  if (hasPathLikeValue(_0x1e15e9, ['videoUrl', "videoLocalPath", "originalVideoUrl", 'localPath', "originalLocalPath", "displayLocalPath", 'src', "url", "resultUrl", "sourceUrl"], isVideoPath)) {
    return !![];
  }
  return hasPathLikeValue(_0x36b85d, ["sourceMediaKey", "videoUrl", "localPath"], isVideoPath);
}
function hasAudioEvidence(_0x47a5ee = {}, _0xc16be8 = null) {
  if (!_0x47a5ee || typeof _0x47a5ee !== "object") {
    return ![];
  }
  if (hasExplicitKind(_0x47a5ee, "audio")) {
    return !![];
  }
  if (Array["isArray"](_0x47a5ee['audios']) && _0x47a5ee["audios"]['length'] > 0x0) {
    return !![];
  }
  if (hasPathLikeValue(_0x47a5ee, ["audioUrl", "audioLocalPath", "localPath", "originalLocalPath", "displayLocalPath", "src", "url", "resultUrl", "sourceUrl"], isAudioPath)) {
    return !![];
  }
  return hasPathLikeValue(_0xc16be8, ['sourceMediaKey', "audioUrl", 'localPath'], isAudioPath);
}
function hasImageEvidence(_0x9f4ba0 = {}, _0x2ca30b = null) {
  if (!_0x9f4ba0 || typeof _0x9f4ba0 !== 'object') {
    return ![];
  }
  if (hasExplicitKind(_0x9f4ba0, "image")) {
    return !![];
  }
  if (Array["isArray"](_0x9f4ba0['images']) && _0x9f4ba0["images"]['length'] > 0x0) {
    return !![];
  }
  if (_0x9f4ba0['thumbId'] || _0x9f4ba0['thumbUrl'] || _0x9f4ba0["imageUrl"] || _0x9f4ba0["posterLocalPath"]) {
    return !![];
  }
  if (hasPathLikeValue(_0x9f4ba0, ['imageUrl', "localPath", "originalLocalPath", "displayLocalPath", 'src', "url", "resultUrl", 'sourceUrl'], isImagePath)) {
    return !![];
  }
  return hasPathLikeValue(_0x2ca30b, ["sourceMediaKey", "imageUrl", "localPath"], isImagePath);
}
export function resolveEffectiveInputKind(_0x4c5c50, _0x341333 = null) {
  if (!_0x4c5c50 || typeof _0x4c5c50 !== "object") {
    return normalizeInputKind(_0x4c5c50);
  }
  const _0x258150 = normalizeInputKind(_0x4c5c50);
  if (hasVideoEvidence(_0x4c5c50, _0x341333)) {
    return "video";
  }
  if (hasAudioEvidence(_0x4c5c50, _0x341333)) {
    return "audio";
  }
  if (_0x258150) {
    return _0x258150;
  }
  if (hasImageEvidence(_0x4c5c50, _0x341333)) {
    return "image";
  }
  return '';
}
function makePolicy(_0x2fc432, _0x5b66c3 = {}) {
  const _0x17e015 = new Set(["text", ...(Array['isArray'](_0x2fc432) ? _0x2fc432 : [])]["map"](_0x46c674 => normalizeInputKind(_0x46c674))['filter'](Boolean));
  return {
    'allowedKinds': INPUT_KIND_ORDER["filter"](_0x295dbb => _0x17e015["has"](_0x295dbb)),
    'maxByKind': {
      ..._0x5b66c3
    }
  };
}
function normalizePolicyCompareValue(_0x44ca62) {
  return String(_0x44ca62 ?? '')["trim"]()["toLowerCase"]();
}
function manifestPolicyConditionMatches(_0x147704, _0x2a5a5c = {}) {
  if (Array["isArray"](_0x147704)) {
    return _0x147704["some"](_0x54d8f7 => manifestPolicyConditionMatches(_0x54d8f7, _0x2a5a5c));
  }
  if (!_0x147704 || typeof _0x147704 !== "object") {
    return ![];
  }
  if (Array['isArray'](_0x147704["any"])) {
    return _0x147704["any"]["some"](_0x30b5a4 => manifestPolicyConditionMatches(_0x30b5a4, _0x2a5a5c));
  }
  if (Array["isArray"](_0x147704['all'])) {
    return _0x147704['all']['every'](_0x149cec => manifestPolicyConditionMatches(_0x149cec, _0x2a5a5c));
  }
  const _0x2f269f = normalizeText(_0x147704["field"] ?? _0x147704['param']);
  if (!_0x2f269f) {
    return ![];
  }
  const _0x12e9b8 = _0x147704["values"] !== undefined ? _0x147704['values'] : _0x147704['value'];
  const _0x5435d4 = (Array["isArray"](_0x12e9b8) ? _0x12e9b8 : [_0x12e9b8])["map"](normalizePolicyCompareValue);
  const _0x5cd3e8 = _0x5435d4["includes"](normalizePolicyCompareValue(_0x2a5a5c?.[_0x2f269f]));
  return _0x147704["not"] === !![] ? !_0x5cd3e8 : _0x5cd3e8;
}
export function getActiveManifestInputPolicyVariant(_0x50aaa8, _0x57ef12 = {}) {
  const _0x110494 = Array["isArray"](_0x50aaa8?.['policyVariants']) ? _0x50aaa8["policyVariants"] : [];
  if (_0x110494['length'] === 0x0) {
    return null;
  }
  const _0x10e812 = _0x57ef12?.["generationParams"] && typeof _0x57ef12["generationParams"] === 'object' && !Array["isArray"](_0x57ef12["generationParams"]) ? _0x57ef12["generationParams"] : {};
  const _0x222265 = {
    ..._0x57ef12,
    ..._0x10e812
  };
  return _0x110494["find"](_0x1fbd54 => manifestPolicyConditionMatches(_0x1fbd54?.['when'], _0x222265)) || null;
}
function makeManifestInputPolicy(_0x467e19, _0x10c6a8 = {}) {
  if (!_0x467e19 || typeof _0x467e19 !== 'object') {
    return null;
  }
  const _0x507ccf = getActiveManifestInputPolicyVariant(_0x467e19, _0x10c6a8);
  const _0x2fd338 = Array["isArray"](_0x507ccf?.["allowedKinds"]) ? _0x507ccf["allowedKinds"] : Array['isArray'](_0x467e19["allowedKinds"]) ? _0x467e19['allowedKinds'] : [];
  const _0x44b2ea = {
    ...(_0x467e19["maxByKind"] || {}),
    ...(_0x507ccf?.["maxByKind"] || {})
  };
  return {
    'allowedKinds': INPUT_KIND_ORDER["filter"](_0x142d4f => _0x2fd338["includes"](_0x142d4f)),
    'maxByKind': _0x44b2ea
  };
}
export function manifestInputPolicyReferencesField(_0x287764, _0x1c853e) {
  const _0x598dd7 = normalizeText(_0x1c853e);
  if (!_0x598dd7) {
    return ![];
  }
  const _0x27b5a3 = _0x33389a => {
    if (Array["isArray"](_0x33389a)) {
      return _0x33389a["some"](_0x27b5a3);
    }
    if (!_0x33389a || typeof _0x33389a !== 'object') {
      return ![];
    }
    if (Array["isArray"](_0x33389a["any"]) && _0x33389a["any"]["some"](_0x27b5a3)) {
      return !![];
    }
    if (Array["isArray"](_0x33389a["all"]) && _0x33389a["all"]["some"](_0x27b5a3)) {
      return !![];
    }
    return normalizeText(_0x33389a["field"] ?? _0x33389a['param']) === _0x598dd7;
  };
  return (Array["isArray"](_0x287764?.['policyVariants']) ? _0x287764['policyVariants'] : [])['some'](_0x1f3292 => _0x27b5a3(_0x1f3292?.['when']));
}
function makeDreaminaStyleVideoPolicy(_0x329ee5) {
  const _0x1a52c8 = _0x329ee5?.['generationParams'] && typeof _0x329ee5["generationParams"] === "object" ? _0x329ee5["generationParams"] : {};
  const _0x15be9a = normalizeDreaminaVideoRouteMode(_0x1a52c8['dreaminaRouteMode'] ?? _0x329ee5?.['dreaminaRouteMode'], _0x329ee5?.['mode']);
  if (_0x15be9a === "frames2video") {
    return makePolicy(["text", 'image'], {
      'image': 0x2,
      'video': 0x0,
      'audio': 0x0
    });
  }
  if (_0x15be9a === "multiframe2video") {
    return makePolicy(["text", 'image'], {
      'image': 0x14,
      'video': 0x0,
      'audio': 0x0
    });
  }
  const _0x333ef9 = resolveModelExecution(_0x329ee5?.["model"], {
    'providerHint': _0x329ee5?.["provider"]
  }) || resolveModelExecution(_0x329ee5?.["model"]);
  const _0x2859f5 = _0x333ef9?.["modelManifest"] || getModelManifest(_0x329ee5?.["model"]);
  const _0x1c498a = makeManifestInputPolicy(_0x2859f5?.["inputSlots"], _0x329ee5);
  return makePolicy(_0x1c498a?.["allowedKinds"] || ["text", "image", "video", "audio"], {
    'image': _0x1c498a?.["maxByKind"]?.["image"] ?? 0x9,
    'video': _0x1c498a?.["maxByKind"]?.["video"] ?? 0x3,
    'audio': _0x1c498a?.["maxByKind"]?.["audio"] ?? 0x3
  });
}
function normalizeHappyHorseVideoMode(_0x4b85eb) {
  const _0x1c6d07 = normalizeText(_0x4b85eb)["toLowerCase"]();
  return _0x1c6d07 === "image" || _0x1c6d07 === "reference" || _0x1c6d07 === "edit" ? _0x1c6d07 : "auto";
}
function getHappyHorseVideoMode(_0x2b1bf5 = {}) {
  const _0x51340f = _0x2b1bf5?.["generationParams"] && typeof _0x2b1bf5["generationParams"] === "object" ? _0x2b1bf5["generationParams"] : {};
  return normalizeHappyHorseVideoMode(_0x51340f["happyhorse_mode"] ?? _0x2b1bf5?.["happyhorse_mode"]);
}
function makeHappyHorseVideoPolicy(_0x36d505) {
  const _0xca9ce4 = getHappyHorseVideoMode(_0x36d505);
  if (_0xca9ce4 === "image") {
    return makePolicy(['text', "image"], {
      'image': 0x1,
      'video': 0x0,
      'audio': 0x0
    });
  }
  if (_0xca9ce4 === "reference") {
    return makePolicy(["text", 'image'], {
      'image': 0x9,
      'video': 0x0,
      'audio': 0x0
    });
  }
  if (_0xca9ce4 === "edit") {
    return makePolicy(["text", 'image', "video"], {
      'image': 0x5,
      'video': 0x1,
      'audio': 0x0
    });
  }
  return makePolicy(['text'], {
    'image': 0x0,
    'video': 0x0,
    'audio': 0x0
  });
}
function normalizeSeedance2VideoMode(_0x8c2b46, _0x280cfb = "text2video") {
  const _0x48b743 = normalizeText(_0x8c2b46)["toLowerCase"]();
  if (_0x48b743 === "multimodal2video" || _0x48b743 === "reference") {
    return "multimodal2video";
  }
  if (_0x48b743 === 'frames2video' || _0x48b743 === "frames") {
    return 'frames2video';
  }
  if (_0x48b743 === "image2video" || _0x48b743 === "image" || _0x48b743 === "frame") {
    return "image2video";
  }
  if (_0x48b743 === "text2video" || _0x48b743 === 'text') {
    return "text2video";
  }
  return _0x280cfb === "multimodal2video" ? "multimodal2video" : "text2video";
}
function getSeedance2VideoMode(_0x5e3a33 = {}) {
  const _0x5f12cc = _0x5e3a33?.["generationParams"] && typeof _0x5e3a33['generationParams'] === 'object' ? _0x5e3a33['generationParams'] : {};
  const _0x1b88f9 = normalizeText(_0x5e3a33?.["provider"])["toLowerCase"]();
  const _0x1270e0 = normalizeText(_0x5e3a33?.['model'])['toLowerCase']();
  const _0x63822b = _0x1b88f9 === "volcengine" || _0x1270e0["startsWith"]("volcengine/");
  return normalizeSeedance2VideoMode(_0x5f12cc["rh_seedance_2_mode"] ?? _0x5f12cc["volcengine_seedance_2_mode"] ?? _0x5e3a33?.["rh_seedance_2_mode"] ?? _0x5e3a33?.["volcengine_seedance_2_mode"], _0x63822b ? 'multimodal2video' : "text2video");
}
function makeSeedance2VideoPolicy(_0xef8d2c) {
  const _0x37dfdc = getSeedance2VideoMode(_0xef8d2c);
  if (_0x37dfdc === "multimodal2video") {
    const _0x5b06da = _0xef8d2c?.['model'];
    const _0x355127 = _0xef8d2c?.["provider"];
    const _0xa1f974 = resolveModelExecution(_0x5b06da, {
      'providerHint': _0x355127
    }) || resolveModelExecution(_0x5b06da);
    const _0x3dabea = _0xa1f974?.["modelManifest"] || getModelManifest(_0x5b06da);
    const _0x35c6af = makeManifestInputPolicy(_0x3dabea?.["inputSlots"], _0xef8d2c);
    return makePolicy(['text', "image", 'video', "audio"], {
      'image': _0x35c6af?.["maxByKind"]?.['image'] ?? 0x9,
      'video': _0x35c6af?.["maxByKind"]?.["video"] ?? 0x3,
      'audio': _0x35c6af?.["maxByKind"]?.["audio"] ?? 0x3
    });
  }
  if (_0x37dfdc === "frames2video") {
    return makePolicy(['text', "image"], {
      'image': 0x2,
      'video': 0x0,
      'audio': 0x0
    });
  }
  if (_0x37dfdc === "image2video") {
    return makePolicy(['text', "image"], {
      'image': 0x1,
      'video': 0x0,
      'audio': 0x0
    });
  }
  return makePolicy(["text"], {
    'image': 0x0,
    'video': 0x0,
    'audio': 0x0
  });
}
function normalizeWan27VideoMode(_0x2982d6) {
  const _0x5adbfe = normalizeText(_0x2982d6)['toLowerCase']();
  return _0x5adbfe === "video" || _0x5adbfe === "reference" || _0x5adbfe === "edit" ? _0x5adbfe : 'image';
}
function getWan27VideoMode(_0x5bf967 = {}) {
  const _0x5b1f21 = _0x5bf967?.['generationParams'] && typeof _0x5bf967["generationParams"] === 'object' ? _0x5bf967["generationParams"] : {};
  return normalizeWan27VideoMode(_0x5b1f21["wan27_mode"] ?? _0x5bf967?.['wan27_mode']);
}
function makeWan27VideoPolicy(_0x493448) {
  const _0x51450e = getWan27VideoMode(_0x493448);
  if (_0x51450e === "video") {
    return makePolicy(["text", "video"], {
      'image': 0x0,
      'video': 0x1,
      'audio': 0x0
    });
  }
  if (_0x51450e === "reference") {
    return makePolicy(["text", "image", "video", "audio"], {
      'image': 0x1,
      'video': 0x1,
      'audio': 0x1
    });
  }
  if (_0x51450e === "edit") {
    return makePolicy(['text', 'video'], {
      'image': 0x0,
      'video': 0x2,
      'audio': 0x0
    });
  }
  return makePolicy(["text", 'image', "audio"], {
    'image': 0x2,
    'video': 0x0,
    'audio': 0x1
  });
}
function normalizeKlingV3OmniVideoMode(_0x906c79) {
  const _0x57f7c2 = normalizeText(_0x906c79)["toLowerCase"]();
  return _0x57f7c2 === "reference" || _0x57f7c2 === "edit" ? _0x57f7c2 : 'image';
}
function getKlingV3OmniVideoMode(_0x3461d1 = {}) {
  const _0x7e3d21 = _0x3461d1?.["generationParams"] && typeof _0x3461d1["generationParams"] === "object" ? _0x3461d1["generationParams"] : {};
  return normalizeKlingV3OmniVideoMode(_0x7e3d21['kling_v3_omni_mode'] ?? _0x3461d1?.["kling_v3_omni_mode"]);
}
function makeKlingV3OmniVideoPolicy(_0x22e95a) {
  const _0x2bb909 = getKlingV3OmniVideoMode(_0x22e95a);
  if (_0x2bb909 === 'reference') {
    return makePolicy(["text", "image", "video"], {
      'image': 0x1,
      'video': 0x1,
      'audio': 0x0
    });
  }
  if (_0x2bb909 === "edit") {
    return makePolicy(['text', 'video'], {
      'image': 0x0,
      'video': 0x1,
      'audio': 0x0
    });
  }
  return makePolicy(["text", "image"], {
    'image': 0x2,
    'video': 0x0,
    'audio': 0x0
  });
}
function normalizeViduQ3GenerationMode(_0x29c826) {
  const _0x35cce3 = normalizeText(_0x29c826)['toLowerCase']();
  return _0x35cce3 === "reference" ? "reference" : "video";
}
function getViduQ3GenerationMode(_0x3b8aa4 = {}) {
  const _0x2b3277 = _0x3b8aa4?.["generationParams"] && typeof _0x3b8aa4["generationParams"] === "object" ? _0x3b8aa4['generationParams'] : {};
  return normalizeViduQ3GenerationMode(_0x2b3277["vidu_q3_generation_mode"] ?? _0x3b8aa4?.["vidu_q3_generation_mode"]);
}
function makeViduQ3VideoPolicy(_0x570017) {
  const _0x34ac83 = getViduQ3GenerationMode(_0x570017);
  return makePolicy(["text", "image"], {
    'image': _0x34ac83 === "reference" ? 0x7 : 0x2,
    'video': 0x0,
    'audio': 0x0
  });
}
export function getTargetInputPolicy(_0x2e7651 = {}) {
  const _0xad8f3c = normalizeText(_0x2e7651?.["type"]);
  const _0x25b24d = normalizeText(_0x2e7651?.["model"]);
  const _0x295320 = normalizeText(_0x2e7651?.["provider"])["toLowerCase"]();
  const _0x4cfa00 = normalizeText(_0x2e7651?.['audioWorkflowKey']);
  if (_0xad8f3c === "ai-image") {
    const _0x489f23 = makeManifestInputPolicy(getModelManifest(_0x25b24d)?.['inputSlots'], _0x2e7651);
    if (_0x489f23) {
      return _0x489f23;
    }
    const _0x5986fc = isRhPersonReplaceWorkflowModel(_0x25b24d) ? 0x2 : isDreaminaManifestOrModel(_0x25b24d, _0x295320) ? 0x1 : 0x9;
    return makePolicy(["text", "image"], {
      'image': _0x5986fc,
      'video': 0x0,
      'audio': 0x0
    });
  }
  if (_0xad8f3c === "ai-video") {
    if (isDreaminaStyleVideoModel(_0x25b24d, _0x295320)) {
      return makeDreaminaStyleVideoPolicy(_0x2e7651);
    }
    if (isHappyHorseVideoModel(_0x25b24d, _0x295320)) {
      return makeHappyHorseVideoPolicy(_0x2e7651);
    }
    if (isSeedance2VideoModel(_0x25b24d, _0x295320)) {
      return makeSeedance2VideoPolicy(_0x2e7651);
    }
    if (isApimartWan27VideoModel(_0x25b24d, _0x295320)) {
      return makeWan27VideoPolicy(_0x2e7651);
    }
    if (isApimartKlingV3OmniVideoModel(_0x25b24d, _0x295320)) {
      return makeKlingV3OmniVideoPolicy(_0x2e7651);
    }
    if (isApimartViduQ3VideoModel(_0x25b24d, _0x295320)) {
      return makeViduQ3VideoPolicy(_0x2e7651);
    }
    const _0x3a4150 = makeManifestInputPolicy(getModelManifest(_0x25b24d)?.["inputSlots"], _0x2e7651);
    if (_0x3a4150) {
      return _0x3a4150;
    }
    return makePolicy(["text", "image", "video"], {
      'audio': 0x0
    });
  }
  if (_0xad8f3c === "ai-audio") {
    const _0x453dd0 = makeManifestInputPolicy(getModelManifest(_0x4cfa00 || _0x25b24d)?.["inputSlots"], _0x2e7651);
    if (_0x453dd0) {
      return _0x453dd0;
    }
    return makePolicy(["text", "audio"], {
      'image': 0x0,
      'video': 0x0,
      'audio': _0x4cfa00 === "voice_convert" ? 0x2 : 0x1
    });
  }
  if (_0xad8f3c === "ai-text") {
    const _0x27fa5c = getModelManifest(_0x25b24d);
    const _0x15f8c0 = makeManifestInputPolicy(_0x27fa5c?.["inputSlots"], _0x2e7651);
    if (_0x15f8c0) {
      return _0x15f8c0;
    }
    const _0x4e253d = resolveTargetProvider(_0x25b24d, _0x295320) || normalizeProviderId(_0x27fa5c?.['provider']);
    if (_0x4e253d === 'apimart') {
      return makePolicy(["text", "image"], {
        'video': 0x0,
        'audio': 0x0
      });
    }
    return makePolicy(["text", "image", 'video', "audio"], {});
  }
  if (_0xad8f3c === "media-clip") {
    return {
      'allowedKinds': ["image", "video", "audio"],
      'maxByKind': {
        'text': 0x0
      }
    };
  }
  if (_0xad8f3c === 'whiteboard') {
    return {
      'allowedKinds': ['image'],
      'maxByKind': {
        'text': 0x0,
        'image': 0x1,
        'video': 0x0,
        'audio': 0x0
      }
    };
  }
  if (_0xad8f3c === 'storyboard-script') {
    const _0x1e367d = normalizeText(_0x2e7651["storyboardScript"]?.["model"]) || _0x25b24d;
    const _0x1fc807 = makeManifestInputPolicy(getModelManifest(_0x1e367d)?.["inputSlots"], _0x2e7651);
    if (_0x1fc807) {
      return _0x1fc807;
    }
  }
  if (_0xad8f3c === "storyboard" || _0xad8f3c === 'storyboard-script') {
    return makePolicy(['text', "image", "video"], {
      'audio': 0x0
    });
  }
  return makePolicy(["text", 'image', 'video', 'audio'], {});
}
export function canTargetReceiveInputs(_0x1b7410 = {}) {
  return INPUT_TARGET_NODE_TYPES["has"](normalizeText(_0x1b7410?.["type"]));
}
export function getVideoSourceKey(_0x1ab117) {
  if (!_0x1ab117 || typeof _0x1ab117 !== 'object') {
    return '';
  }
  return normalizeText(_0x1ab117['localPath']) || normalizeText(_0x1ab117["displayLocalPath"]) || normalizeText(_0x1ab117["originalLocalPath"]) || normalizeText(_0x1ab117["videoLocalPath"]) || normalizeText(_0x1ab117["videoUrl"]) || normalizeText(_0x1ab117["src"]) || normalizeText(_0x1ab117['url']) || normalizeText(_0x1ab117["resultUrl"]) || normalizeText(_0x1ab117["sourceUrl"]);
}
function isUnavailableVideoRecord(_0x926838) {
  const _0x32b1dc = getVideoSourceKey(_0x926838);
  if (!_0x32b1dc) {
    return ![];
  }
  return _0x926838?.["mediaUnavailable"] === !![] && normalizeText(_0x926838?.['mediaUnavailableSource']) === _0x32b1dc;
}
export function hasUsableInputNodeSource(_0x15db99 = {}, _0x18f87e = {}) {
  const _0xb2a7f0 = _0x18f87e?.["edge"] || _0x18f87e || null;
  const _0x2b4ed4 = normalizeInputKind(_0x18f87e?.["kind"]) || resolveEffectiveInputKind(_0x15db99, _0xb2a7f0);
  if (!_0x2b4ed4) {
    return ![];
  }
  if (_0x2b4ed4 !== "video") {
    return !![];
  }
  const _0x50d7d0 = Array["isArray"](_0x15db99?.["videos"]) ? _0x15db99["videos"] : [];
  if (_0x50d7d0["some"](_0x1c772b => getVideoSourceKey(_0x1c772b) && !isUnavailableVideoRecord(_0x1c772b))) {
    return !![];
  }
  if (getVideoSourceKey(_0x15db99) && !isUnavailableVideoRecord(_0x15db99)) {
    return !![];
  }
  const _0x4a1b76 = isVideoPath(_0xb2a7f0?.["sourceMediaKey"]) ? normalizeText(_0xb2a7f0?.["sourceMediaKey"]) : '';
  return Boolean(_0x4a1b76);
}
export function isInputNodeCompatibleWithTarget(_0x2d6de0 = {}, _0x3b000f = {}, _0x2218fb = null) {
  if (!canTargetReceiveInputs(_0x3b000f)) {
    return ![];
  }
  const _0x32cfaf = resolveEffectiveInputKind(_0x2d6de0, _0x2218fb);
  if (!_0x32cfaf) {
    return ![];
  }
  if (!isInputKindAllowed(getTargetInputPolicy(_0x3b000f), _0x32cfaf)) {
    return ![];
  }
  return hasUsableInputNodeSource(_0x2d6de0, {
    'edge': _0x2218fb,
    'kind': _0x32cfaf
  });
}
export function canAppendInputKindWithinLimit(_0x5cd8b9, _0x2e6f29, _0x381f52 = {}) {
  const _0x256cca = normalizeInputKind(_0x2e6f29);
  if (!_0x256cca) {
    return ![];
  }
  if (!isInputKindAllowed(_0x5cd8b9, _0x256cca)) {
    return ![];
  }
  const _0x447a38 = Number(_0x5cd8b9?.["maxByKind"]?.[_0x256cca]);
  if (!Number["isFinite"](_0x447a38)) {
    return !![];
  }
  if (_0x447a38 <= 0x0) {
    return ![];
  }
  return Number(_0x381f52?.[_0x256cca] || 0x0) < _0x447a38;
}
export function isInputKindAllowed(_0x3cf574, _0x30fd74) {
  const _0x305e0d = normalizeInputKind(_0x30fd74);
  if (!_0x305e0d) {
    return ![];
  }
  const _0x3825b0 = Array["isArray"](_0x3cf574?.["allowedKinds"]) ? _0x3cf574["allowedKinds"] : INPUT_KIND_ORDER;
  return _0x3825b0["includes"](_0x305e0d);
}
export function getInputLimitReason(_0x317026, _0x452a60, _0x4e6de = {}) {
  const _0x2e2455 = normalizeInputKind(_0x452a60);
  if (!_0x2e2455) {
    return '';
  }
  if (!isInputKindAllowed(_0x317026, _0x2e2455)) {
    return modelInputPolicyText("unsupported");
  }
  const _0x2c4953 = Number(_0x317026?.['maxByKind']?.[_0x2e2455]);
  if (!Number["isFinite"](_0x2c4953)) {
    return '';
  }
  if (_0x2c4953 <= 0x0) {
    return modelInputPolicyText("unsupported");
  }
  const _0x155f25 = Number(_0x4e6de?.[_0x2e2455] || 0x0);
  if (_0x155f25 < _0x2c4953) {
    return '';
  }
  return modelInputPolicyText("limitReached", {
    'max': _0x2c4953,
    'type': getInputKindLabel(_0x2e2455)
  });
}