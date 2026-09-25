import { rhImageDepthModelManifest, rhImageDepthExecutionManifest } from './image/runninghub/runningHubImageDepthManifest.js';
import { rhImageHdModelManifest, rhImageHdExecutionManifest } from './image/runninghub/runningHubImageHdManifest.js';
import { seedVr2ImageHdModelManifest, seedVr2ImageHdExecutionManifest } from './image/runninghub/seedVr2ImageHdManifest.js';
import { qwenImageEditExecutionManifest, qwenImageEditModelManifest } from './image/runninghub/qwenImageEditManifest.js';
import { animeRealExecutionManifest, animeRealModelManifest } from './image/runninghub/animeRealManifest.js';
import { animeRealV3ExecutionManifest, animeRealV3ModelManifest } from './image/runninghub/animeRealV3Manifest.js';
import { personReplaceV21ExecutionManifest, personReplaceV21ModelManifest } from './image/runninghub/personReplaceV21Manifest.js';
import { personReplaceV3ExecutionManifest, personReplaceV3ModelManifest } from './image/runninghub/personReplaceV3Manifest.js';
import { personFullAngleV4ExecutionManifest, personFullAngleV4ModelManifest } from './image/runninghub/personFullAngleV4Manifest.js';
import { controlCameraExecutionManifest, controlCameraModelManifest } from './image/runninghub/controlCameraManifest.js';
import { krea2TextToImageExecutionManifest, krea2TextToImageModelManifest } from './image/runninghub/krea2TextToImageManifest.js';
import { zImageTextToImageExecutionManifest, zImageTextToImageModelManifest } from './image/runninghub/zImageTextToImageManifest.js';
import { rhVideoBasicExecutionManifest, rhVideoBasicModelManifest } from './video/runninghub/runningHubVideoBasicManifest.js';
import { rhVideoLtx23ExecutionManifest, rhVideoLtx23ModelManifest } from './video/runninghub/runningHubVideoLtx23Manifest.js';
import { rhVideoCommercialDigitalHumanExecutionManifest, rhVideoCommercialDigitalHumanModelManifest } from './video/runninghub/runningHubVideoCommercialDigitalHumanManifest.js';
import { rhVideoLipSyncExecutionManifest, rhVideoLipSyncModelManifest } from './video/runninghub/runningHubVideoLipSyncManifest.js';
import { rhVideoV54ExecutionManifest, rhVideoV54ModelManifest } from './video/runninghub/runningHubVideoV54Manifest.js';
import { rhVideoAnimate2V1ExecutionManifest, rhVideoAnimate2V1ModelManifest } from './video/runninghub/runningHubVideoAnimate2V1Manifest.js';
import { rhVideoHailuoH3OmniExecutionManifest, rhVideoHailuoH3OmniModelManifest } from './video/runninghub/runningHubVideoHailuoH3OmniManifest.js';
import { rhVideoHailuoH3AudioDrivenExecutionManifest, rhVideoHailuoH3AudioDrivenModelManifest } from './video/runninghub/runningHubVideoHailuoH3AudioDrivenManifest.js';
import { rhVideoHailuoH3DualSamplingX2ExecutionManifest, rhVideoHailuoH3DualSamplingX2ModelManifest } from './video/runninghub/runningHubVideoHailuoH3DualSamplingX2Manifest.js';
import { rhVideoHailuoH3EditV1ExecutionManifest, rhVideoHailuoH3EditV1ModelManifest } from './video/runninghub/runningHubVideoHailuoH3EditV1Manifest.js';
import { rhVideoBerniniV1ExecutionManifest, rhVideoBerniniV1ModelManifest } from './video/runninghub/runningHubVideoBerniniV1Manifest.js';
import { rhVideoWan22ExecutionManifest, rhVideoWan22ModelManifest } from './video/runninghub/runningHubVideoWan22Manifest.js';
import { rhVideoScailV2ExecutionManifest, rhVideoScailV2ModelManifest, rhVideoScail2V1ExecutionManifest, rhVideoScail2V1ModelManifest } from './video/runninghub/runningHubVideoScail2V1Manifest.js';
import { rhVideoWatermarkRemovalV2ExecutionManifest, rhVideoWatermarkRemovalV2ModelManifest } from './video/runninghub/runningHubVideoWatermarkRemovalV2Manifest.js';
import { rhVideoMattingExecutionManifest, rhVideoMattingModelManifest } from './video/runninghub/runningHubVideoMattingManifest.js';
import { rhVideoHdVipExecutionManifest, rhVideoHdVipModelManifest } from './video/runninghub/runningHubVideoHdVipManifest.js';
import { rhVideoFrameInterpolationExecutionManifest, rhVideoFrameInterpolationModelManifest } from './video/runninghub/runningHubVideoFrameInterpolationManifest.js';
import { rhVideoDepthExecutionManifest, rhVideoDepthModelManifest } from './video/runninghub/runningHubVideoDepthManifest.js';
import { rhAudioIndexTts2CloneExecutionManifest, rhAudioIndexTts2CloneModelManifest } from './audio/runninghub/runningHubAudioIndexTts2CloneManifest.js';
import { rhAudioVoiceConvertExecutionManifest, rhAudioVoiceConvertModelManifest } from './audio/runninghub/runningHubAudioVoiceConvertManifest.js';
import { rhAudioAdvancedVoiceCloneExecutionManifest, rhAudioAdvancedVoiceCloneModelManifest } from './audio/runninghub/runningHubAudioAdvancedVoiceCloneManifest.js';
import { rhAudioSeparationExecutionManifest, rhAudioSeparationModelManifest } from './audio/runninghub/runningHubAudioSeparationManifest.js';
import { vendorImageModelApiExecutionManifests, vendorImageModelApiModelManifests } from './image/modelApi/index.js';
import { dreaminaImageExecutionManifests, dreaminaImageModelManifests } from './image/dreamina/dreaminaImageManifest.js';
import { openAiCliImageExecutionManifests, openAiCliImageModelManifests } from './image/localRuntime/openAiCliImageManifest.js';
import { vendorVideoModelApiExecutionManifests, vendorVideoModelApiModelManifests } from './video/modelApi/vendorVideoModelApiManifests.js';
import { dreaminaVideoExecutionManifests, dreaminaVideoModelManifests } from './video/dreamina/dreaminaVideoManifest.js';
import { vendorTextModelApiExecutionManifests, vendorTextModelApiModelManifests } from './text/modelApi/vendorTextModelApiManifests.js';
import { cliTextExecutionManifests, cliTextModelManifests } from './text/localRuntime/cliTextModelManifests.js';
import { volcengineAudioModelApiExecutionManifests, volcengineAudioModelApiModelManifests } from './audio/modelApi/volcengineAudioModelApiManifests.js';
import { runningHubAudioModelApiExecutionManifests, runningHubAudioModelApiModelManifests } from './audio/modelApi/runningHubAudioModelApiManifests.js';
import { runningHubAudioCatalogModels, runningHubAudioCatalogExecutions } from './audio/modelApi/runningHubAudioCatalog.js';
import { runningHubLyricsModels, runningHubLyricsExecutions } from './text/modelApi/runningHubLyricsManifests.js';
const ALLOWED_ADAPTER_TYPES = new Set(['workflow', "modelApi", 'localRuntime']);
const ALLOWED_PROMPT_EMPTY_POLICIES = new Set(["block", "allowWithInput", "allow"]);
const SUPPORTED_UI_CONTROL_TYPES = new Set(["segmented", 'select', "slider", "stepper", 'toggle', "text", "textarea", "image input", "video input", "audio input"]);
const REQUIRED_MODEL_FIELDS = Object['freeze'](["schemaVersion", "modelId", "provider", "kind", "adapterType", "executionId", "displayName", "uiSchema", "inputSlots", 'outputType']);
const REQUIRED_EXECUTION_FIELDS = Object['freeze'](["schemaVersion", 'id', "provider", "kind", "adapterType", "result"]);
const REQUIRED_WORKFLOW_EXECUTION_FIELDS = Object["freeze"](['submitMode', 'queryMode', "mapping"]);
const REQUIRED_MODEL_API_EXECUTION_FIELDS = Object["freeze"](["endpoint", "method", "model", "bodyMapping", "responseMapping"]);
const REQUIRED_LOCAL_RUNTIME_EXECUTION_FIELDS = Object["freeze"](['runtime']);
const _models = new Map();
const _executions = new Map();
function assertPlainObject(_0x351230, _0x23ec7f) {
  if (!_0x351230 || typeof _0x351230 !== "object" || Array['isArray'](_0x351230)) {
    throw new TypeError("[manifest] " + _0x23ec7f + '\x20must\x20be\x20an\x20object');
  }
}
function isPlainObject(_0x258e28) {
  if (!_0x258e28 || typeof _0x258e28 !== "object" || Array["isArray"](_0x258e28)) {
    return ![];
  }
  const _0x3db2dd = Object["getPrototypeOf"](_0x258e28);
  return _0x3db2dd === Object["prototype"] || _0x3db2dd === null;
}
function assertPlainData(_0x437c6a, _0x5a863e, _0x5da454 = new WeakSet()) {
  if (_0x437c6a === null) {
    return;
  }
  const _0x1ed8fd = typeof _0x437c6a;
  if (_0x1ed8fd === "string" || _0x1ed8fd === "number" || _0x1ed8fd === "boolean") {
    return;
  }
  if (_0x1ed8fd === "function" || _0x1ed8fd === 'symbol' || _0x1ed8fd === "undefined" || _0x1ed8fd === "bigint") {
    throw new TypeError("[manifest] " + _0x5a863e + " must be plain data");
  }
  if (_0x5da454["has"](_0x437c6a)) {
    throw new TypeError("[manifest] " + _0x5a863e + " cannot contain circular references");
  }
  _0x5da454["add"](_0x437c6a);
  if (Array["isArray"](_0x437c6a)) {
    _0x437c6a["forEach"]((_0x1b253f, _0x2e5cd0) => {
      assertPlainData(_0x1b253f, _0x5a863e + '[' + _0x2e5cd0 + ']', _0x5da454);
    });
    return;
  }
  if (!isPlainObject(_0x437c6a)) {
    throw new TypeError("[manifest] " + _0x5a863e + " must be plain data");
  }
  Object["entries"](_0x437c6a)["forEach"](([_0x3334df, _0x47c996]) => {
    assertPlainData(_0x47c996, _0x5a863e + '.' + _0x3334df, _0x5da454);
  });
}
function assertRequiredFields(_0x33d28c, _0x4a973b, _0x17f510) {
  const _0x1ce3eb = _0x4a973b["filter"](_0x18a328 => _0x33d28c[_0x18a328] === undefined || _0x33d28c[_0x18a328] === null || _0x33d28c[_0x18a328] === '');
  if (_0x1ce3eb["length"] > 0x0) {
    throw new Error("[manifest] " + _0x17f510 + '\x20missing\x20required\x20fields:\x20' + _0x1ce3eb["join"](',\x20'));
  }
}
function normalizeRegistryKey(_0x59531a) {
  return String(_0x59531a || '')["trim"]();
}
function getUiSchemaOptionValue(_0x6193dc) {
  return String(_0x6193dc?.["value"] ?? _0x6193dc);
}
function normalizeUiSchemaCompareValue(_0xd79d33) {
  return String(_0xd79d33 ?? '')["trim"]()["toLowerCase"]();
}
function isAdaptiveUiSchemaValue(_0x2ec7ca) {
  const _0x58a8eb = String(_0x2ec7ca || '')["trim"]();
  const _0x1b238f = _0x58a8eb["toLowerCase"]();
  return _0x1b238f === "auto" || _0x1b238f === "adaptive" || _0x1b238f === "default" || _0x58a8eb === "自适应" || _0x58a8eb === '默认';
}
function isAspectRatioUiSchemaField(_0x87572a) {
  const _0x159c5b = normalizeRegistryKey(_0x87572a?.['id'])["toLowerCase"]();
  const _0x1d0bb5 = normalizeRegistryKey(_0x87572a?.['displayRole'])["toLowerCase"]();
  const _0x46a9a2 = normalizeRegistryKey(_0x87572a?.["variant"])["toLowerCase"]();
  return _0x159c5b === "aspectratio" || _0x1d0bb5 === "aspectratio" || _0x46a9a2 === "ratiopill";
}
function getUiSchemaDisableWhen(_0x425f49) {
  if (!_0x425f49 || typeof _0x425f49 !== "object" || Array["isArray"](_0x425f49)) {
    return null;
  }
  const _0x502b39 = _0x425f49["disableWhen"] || _0x425f49['disabledWhen'];
  return _0x502b39 && (Array["isArray"](_0x502b39) || typeof _0x502b39 === 'object' && !Array["isArray"](_0x502b39)) ? _0x502b39 : null;
}
function uiSchemaDisableWhenMatches(_0x2a6b73, _0x4c7788 = {}) {
  if (Array["isArray"](_0x2a6b73)) {
    return _0x2a6b73['some'](_0xe73351 => uiSchemaDisableWhenMatches(_0xe73351, _0x4c7788));
  }
  if (!_0x2a6b73 || typeof _0x2a6b73 !== 'object') {
    return ![];
  }
  if (Array["isArray"](_0x2a6b73["any"])) {
    return _0x2a6b73["any"]['some'](_0x2cd1e5 => uiSchemaDisableWhenMatches(_0x2cd1e5, _0x4c7788));
  }
  if (Array["isArray"](_0x2a6b73["all"])) {
    return _0x2a6b73['all']['every'](_0x2c3665 => uiSchemaDisableWhenMatches(_0x2c3665, _0x4c7788));
  }
  const _0x28e1af = normalizeRegistryKey(_0x2a6b73?.["field"] || _0x2a6b73?.["param"]);
  if (!_0x28e1af) {
    return ![];
  }
  const _0x5a20dc = _0x2a6b73["values"] !== undefined ? _0x2a6b73["values"] : _0x2a6b73["value"];
  const _0x7a0dc = Array['isArray'](_0x5a20dc) ? _0x5a20dc : [_0x5a20dc];
  const _0x1981e0 = _0x7a0dc["map"](normalizeUiSchemaCompareValue);
  const _0x5e085b = normalizeUiSchemaCompareValue(_0x4c7788?.[_0x28e1af]);
  const _0x43cf11 = _0x1981e0["includes"](_0x5e085b);
  return _0x2a6b73["not"] ? !_0x43cf11 : _0x43cf11;
}
function isUiSchemaOptionDisabled(_0xc279eb, _0x58ffc5, _0xb90a51 = {}) {
  if (_0xc279eb?.["disabled"] === !![] || _0xc279eb?.["readOnly"] === !![]) {
    return !![];
  }
  if (!_0x58ffc5 || typeof _0x58ffc5 !== "object" || Array["isArray"](_0x58ffc5)) {
    return ![];
  }
  if (_0x58ffc5["disabled"] === !![]) {
    return !![];
  }
  const _0x1e08d6 = getUiSchemaDisableWhen(_0x58ffc5);
  return _0x1e08d6 ? uiSchemaDisableWhenMatches(_0x1e08d6, _0xb90a51) : ![];
}
function getUiSchemaFieldOptions(_0x2d41e9) {
  const _0x52d986 = Array["isArray"](_0x2d41e9?.["options"]) ? _0x2d41e9["options"] : [];
  const _0x2100b0 = Array['isArray'](_0x2d41e9?.["developerOptions"]) ? _0x2d41e9['developerOptions'] : [];
  return [..._0x52d986, ..._0x2100b0];
}
function findUiSchemaOptionByValue(_0x51a16c, _0x276915) {
  const _0x11cad1 = getUiSchemaFieldOptions(_0x51a16c);
  const _0x1c1b35 = String(_0x276915 ?? '')["trim"]();
  const _0x54b702 = _0x1c1b35['toLowerCase']();
  return _0x11cad1["find"](_0x393d27 => getUiSchemaOptionValue(_0x393d27) === _0x1c1b35) || _0x11cad1["find"](_0x3c7e79 => getUiSchemaOptionValue(_0x3c7e79)["trim"]()['toLowerCase']() === _0x54b702) || null;
}
function findAdaptiveUiSchemaOption(_0x42d12) {
  const _0x1607e5 = getUiSchemaFieldOptions(_0x42d12);
  return _0x1607e5["find"](_0x164d7f => {
    const _0x5cec44 = getUiSchemaOptionValue(_0x164d7f);
    const _0xb4cc25 = String(_0x164d7f?.["label"] ?? _0x5cec44)["trim"]();
    return isAdaptiveUiSchemaValue(_0x5cec44) || isAdaptiveUiSchemaValue(_0xb4cc25);
  }) || null;
}
function findEnabledUiSchemaOption(_0x1b3bf3, _0x3ace77, _0x2c8a3a = {}) {
  const _0x37c57d = findUiSchemaOptionByValue(_0x1b3bf3, _0x3ace77);
  return _0x37c57d && !isUiSchemaOptionDisabled(_0x1b3bf3, _0x37c57d, _0x2c8a3a) ? _0x37c57d : null;
}
function findFirstEnabledUiSchemaOption(_0x5053f8, _0x1802e2 = {}) {
  const _0x3acf7d = getUiSchemaFieldOptions(_0x5053f8);
  return _0x3acf7d["find"](_0x72da9c => _0x72da9c?.['hidden'] !== !![] && !isUiSchemaOptionDisabled(_0x5053f8, _0x72da9c, _0x1802e2)) || null;
}
function getUiSchemaDefaultValueAliases(_0x2a0141) {
  return (Array["isArray"](_0x2a0141?.["defaultValueAliases"]) ? _0x2a0141["defaultValueAliases"] : [])["map"](_0x2c8e2f => String(_0x2c8e2f ?? '')['trim']()["toLowerCase"]())["filter"](Boolean);
}
export function normalizeUiSchemaFieldValue(_0x252934, _0x268a6d, {
  params = {}
} = {}) {
  const _0x26eb1b = String(_0x252934?.["type"] || '')['trim']()["toLowerCase"]();
  if (_0x268a6d === undefined || _0x268a6d === null) {
    return _0x252934?.['defaultValue'] ?? '';
  }
  if (String(_0x268a6d)["trim"]() === '') {
    return _0x252934?.["allowEmpty"] === !![] && (_0x26eb1b === "text" || _0x26eb1b === "textarea") ? '' : _0x252934?.['defaultValue'] ?? '';
  }
  const _0x1b634b = String(_0x268a6d)['trim']()["toLowerCase"]();
  if (getUiSchemaDefaultValueAliases(_0x252934)["includes"](_0x1b634b)) {
    return _0x252934?.["defaultValue"] ?? '';
  }
  if (_0x26eb1b === "toggle") {
    if (_0x268a6d === !![] || _0x268a6d === ![]) {
      return _0x268a6d;
    }
    if (["true", '1', "yes", 'on']['includes'](_0x1b634b)) {
      return !![];
    }
    if (["false", '0', 'no', "off"]['includes'](_0x1b634b)) {
      return ![];
    }
    return _0x252934?.["defaultValue"] === !![];
  }
  if (_0x26eb1b === "slider" && Array["isArray"](_0x252934?.["options"]) && _0x252934['options']["length"]) {
    const _0xca478c = findEnabledUiSchemaOption(_0x252934, _0x268a6d, params);
    if (_0xca478c) {
      return _0xca478c["value"] ?? _0xca478c;
    }
    const _0x3250c6 = findEnabledUiSchemaOption(_0x252934, _0x252934?.["defaultValue"], params);
    if (_0x3250c6) {
      return _0x3250c6["value"] ?? _0x3250c6;
    }
    const _0x187780 = findFirstEnabledUiSchemaOption(_0x252934, params);
    if (_0x187780) {
      return _0x187780["value"] ?? _0x187780;
    }
    return _0x252934?.['defaultValue'] ?? '';
  }
  if (_0x26eb1b !== "segmented" && _0x26eb1b !== 'select') {
    return _0x268a6d;
  }
  const _0x25558c = findEnabledUiSchemaOption(_0x252934, _0x268a6d, params);
  if (_0x25558c) {
    return _0x25558c["value"] ?? _0x25558c;
  }
  if (isAdaptiveUiSchemaValue(_0x268a6d)) {
    const _0x2bb57a = findAdaptiveUiSchemaOption(_0x252934);
    if (_0x2bb57a && !isUiSchemaOptionDisabled(_0x252934, _0x2bb57a, params)) {
      return _0x2bb57a["value"] ?? _0x2bb57a;
    }
    if (isAspectRatioUiSchemaField(_0x252934)) {
      return '自适应';
    }
  }
  const _0x4d8f25 = findEnabledUiSchemaOption(_0x252934, _0x252934?.["defaultValue"], params);
  if (_0x4d8f25) {
    return _0x4d8f25["value"] ?? _0x4d8f25;
  }
  const _0x18bb19 = findFirstEnabledUiSchemaOption(_0x252934, params);
  if (_0x18bb19) {
    return _0x18bb19["value"] ?? _0x18bb19;
  }
  return _0x252934?.['defaultValue'] ?? '';
}
export function sanitizeModelUiSchemaParams(_0x305134, _0x2b3901 = {}, {
  includeDefaults = !![]
} = {}) {
  const _0x5dbfeb = getModelManifest(_0x305134);
  const _0x182db9 = Array['isArray'](_0x5dbfeb?.["uiSchema"]?.["fields"]) ? _0x5dbfeb['uiSchema']["fields"] : [];
  const _0x2abef8 = _0x2b3901 && typeof _0x2b3901 === "object" && !Array["isArray"](_0x2b3901) ? _0x2b3901 : {};
  const _0x422c0a = {};
  return _0x182db9["reduce"]((_0x2d437f, _0x31aa4b) => {
    const _0x363e08 = normalizeRegistryKey(_0x31aa4b?.['id']);
    if (!_0x363e08) {
      return _0x2d437f;
    }
    const _0x5479f6 = {
      ..._0x2abef8,
      ..._0x422c0a,
      ..._0x2d437f
    };
    if (Object["prototype"]['hasOwnProperty']["call"](_0x2abef8, _0x363e08)) {
      _0x2d437f[_0x363e08] = normalizeUiSchemaFieldValue(_0x31aa4b, _0x2abef8[_0x363e08], {
        'params': _0x5479f6
      });
      _0x422c0a[_0x363e08] = _0x2d437f[_0x363e08];
    } else {
      includeDefaults ? (_0x2d437f[_0x363e08] = normalizeUiSchemaFieldValue(_0x31aa4b, _0x31aa4b?.["defaultValue"], {
        'params': _0x5479f6
      }), _0x422c0a[_0x363e08] = _0x2d437f[_0x363e08]) : _0x422c0a[_0x363e08] = normalizeUiSchemaFieldValue(_0x31aa4b, _0x31aa4b?.["defaultValue"], {
        'params': _0x5479f6
      });
    }
    return _0x2d437f;
  }, {});
}
function getManifestRegistryKeys(_0x4098cf, _0x3e1904, _0x462911) {
  const _0x28ca35 = normalizeRegistryKey(_0x4098cf[_0x3e1904]);
  if (!_0x28ca35) {
    throw new Error('[manifest]\x20' + _0x462911 + '\x20has\x20empty\x20' + _0x3e1904);
  }
  const _0x5a26b4 = [_0x28ca35];
  if (_0x4098cf["aliases"] !== undefined) {
    if (!Array["isArray"](_0x4098cf["aliases"])) {
      throw new Error("[manifest] " + _0x462911 + " aliases must be an array");
    }
    _0x4098cf["aliases"]['forEach'](_0x42f0a1 => {
      const _0x3b7548 = normalizeRegistryKey(_0x42f0a1);
      if (_0x3b7548) {
        _0x5a26b4["push"](_0x3b7548);
      }
    });
  }
  return _0x5a26b4;
}
function assertRegistryKeysAvailable(_0x370e22, _0x427d2e, _0x3c4ad5, _0x1695f5) {
  const _0x5aeb7b = new Set();
  _0x370e22['forEach']((_0x1ca4c0, _0x1ab3a9) => {
    const _0x46bd36 = getManifestRegistryKeys(_0x1ca4c0, _0x3c4ad5, _0x1695f5 + '[' + _0x1ab3a9 + ']');
    _0x46bd36['forEach'](_0x17cd02 => {
      if (_0x427d2e['has'](_0x17cd02)) {
        throw new Error("[manifest] " + _0x1695f5 + " duplicate key: " + _0x17cd02);
      }
      if (_0x5aeb7b["has"](_0x17cd02)) {
        throw new Error("[manifest] " + _0x1695f5 + " duplicate key in bundle: " + _0x17cd02);
      }
      _0x5aeb7b['add'](_0x17cd02);
    });
  });
  return _0x5aeb7b;
}
function buildManifestKeyMap(_0x1e8b74, _0x1c8d7c, _0x17d670) {
  const _0x15190f = new Map();
  _0x1e8b74["forEach"]((_0x122876, _0x2897dc) => {
    getManifestRegistryKeys(_0x122876, _0x1c8d7c, _0x17d670 + '[' + _0x2897dc + ']')['forEach'](_0x3bd84e => {
      _0x15190f["set"](_0x3bd84e, _0x122876);
    });
  });
  return _0x15190f;
}
function assertModelExecutionContract(_0x46c775, _0x3a739f) {
  ['adapterType', "kind", "provider"]['forEach'](_0x422aa4 => {
    const _0x5e8898 = normalizeRegistryKey(_0x46c775[_0x422aa4]);
    const _0x594d5b = normalizeRegistryKey(_0x3a739f[_0x422aa4]);
    if (_0x5e8898 !== _0x594d5b) {
      throw new Error("[manifest] model manifest " + _0x46c775["modelId"] + '\x20' + _0x422aa4 + '\x20(' + _0x46c775[_0x422aa4] + ") does not match execution manifest " + _0x3a739f['id'] + '\x20' + _0x422aa4 + '\x20(' + _0x3a739f[_0x422aa4] + ')');
    }
  });
}
function assertBundleModelExecutionLinks(_0x5b69af, _0x380472) {
  _0x5b69af["forEach"](_0x4eee55 => {
    const _0x2d49cc = normalizeRegistryKey(_0x4eee55["executionId"]);
    const _0x13b7fb = _executions['get'](_0x2d49cc) || _0x380472['get'](_0x2d49cc);
    if (!_0x13b7fb) {
      throw new Error('[manifest]\x20model\x20manifest\x20' + _0x4eee55["modelId"] + " references unknown executionId: " + _0x4eee55["executionId"]);
    }
    assertModelExecutionContract(_0x4eee55, _0x13b7fb);
  });
}
function assertAdapterType(_0x24f754, _0x3af2d1) {
  if (!ALLOWED_ADAPTER_TYPES["has"](String(_0x24f754 || ''))) {
    throw new Error("[manifest] " + _0x3af2d1 + " has unsupported adapterType: " + _0x24f754);
  }
}
function assertExecutionTarget(_0x71d1e8) {
  if (_0x71d1e8["adapterType"] !== "workflow") {
    return;
  }
  if (!_0x71d1e8["workflowId"] && !_0x71d1e8['appId']) {
    throw new Error('[manifest]\x20workflow\x20execution\x20missing\x20workflowId/appId');
  }
}
function assertUiSchema(_0x1fb756) {
  const _0x51eef4 = _0x1fb756["uiSchema"];
  assertPlainObject(_0x51eef4, "model manifest uiSchema");
  if (!Array["isArray"](_0x51eef4["fields"])) {
    throw new Error("[manifest] model manifest uiSchema.fields must be an array");
  }
  _0x51eef4["fields"]["forEach"]((_0x19727e, _0x54b714) => {
    assertPlainObject(_0x19727e, "model manifest uiSchema.fields[" + _0x54b714 + ']');
    assertRequiredFields(_0x19727e, ['id', "type"], "model manifest uiSchema.fields[" + _0x54b714 + ']');
    const _0x4779c7 = String(_0x19727e["type"] || '')['trim']()["toLowerCase"]();
    if (_0x4779c7 === "text" || _0x4779c7 === 'textarea') {
      if (_0x19727e['defaultValue'] === undefined || _0x19727e["defaultValue"] === null) {
        throw new Error("[manifest] model manifest uiSchema.fields[" + _0x54b714 + ']\x20missing\x20required\x20fields:\x20defaultValue');
      }
    } else {
      assertRequiredFields(_0x19727e, ['defaultValue'], "model manifest uiSchema.fields[" + _0x54b714 + ']');
    }
    if (!SUPPORTED_UI_CONTROL_TYPES['has'](_0x4779c7)) {
      throw new Error("[manifest] unsupported uiSchema control type: " + _0x19727e["type"]);
    }
    if ((_0x4779c7 === "segmented" || _0x4779c7 === 'select') && (!Array["isArray"](_0x19727e["options"]) || _0x19727e['options']["length"] === 0x0)) {
      throw new Error("[manifest] uiSchema field " + _0x19727e['id'] + " requires non-empty options");
    }
  });
  _0x51eef4["fields"]["forEach"]((_0x3a7f9c, _0x58ad84) => {
    if (normalizeRegistryKey(_0x3a7f9c?.["variant"])["toLowerCase"]() !== 'randomseedrow') {
      return;
    }
    const _0x30e351 = 'uiSchema\x20randomSeedRow\x20field\x20' + (_0x3a7f9c['id'] || _0x58ad84);
    if (String(_0x3a7f9c?.["type"] || '')['trim']()["toLowerCase"]() !== "stepper") {
      throw new Error("[manifest] " + _0x30e351 + " must use the stepper control");
    }
    const _0x4ee5b = normalizeRegistryKey(_0x3a7f9c?.['randomSeedModeField']);
    if (!_0x4ee5b) {
      throw new Error("[manifest] " + _0x30e351 + " requires randomSeedModeField");
    }
    if (_0x3a7f9c?.['randomizeOnSubmit'] !== !![]) {
      throw new Error("[manifest] " + _0x30e351 + " requires randomizeOnSubmit");
    }
    if (normalizeRegistryKey(_0x3a7f9c?.["randomSeedDefaultMode"])["toLowerCase"]() !== 'random') {
      throw new Error("[manifest] " + _0x30e351 + " must default to random mode");
    }
    const _0x9692ba = _0x51eef4['fields']["find"](_0x3ee74a => normalizeRegistryKey(_0x3ee74a?.['id']) === _0x4ee5b);
    if (!_0x9692ba) {
      throw new Error("[manifest] " + _0x30e351 + '\x20references\x20missing\x20mode\x20field\x20' + _0x4ee5b);
    }
    const _0x48cd2e = new Set((Array["isArray"](_0x9692ba['options']) ? _0x9692ba["options"] : [])['map'](_0x58b70d => normalizeRegistryKey(_0x58b70d?.["value"] ?? _0x58b70d)['toLowerCase']()));
    if (String(_0x9692ba['type'] || '')["trim"]()["toLowerCase"]() !== "segmented" || !_0x48cd2e["has"]("random") || !_0x48cd2e["has"]("fixed")) {
      throw new Error("[manifest] " + _0x30e351 + " mode field must provide random/fixed segmented options");
    }
  });
}
function assertPromptConfig(_0x288b40) {
  if (_0x288b40["prompt"] === undefined || _0x288b40["prompt"] === null) {
    return;
  }
  assertPlainObject(_0x288b40["prompt"], "model manifest prompt");
  if (_0x288b40["prompt"]["emptyPolicy"] !== undefined && _0x288b40["prompt"]["emptyPolicy"] !== null && !ALLOWED_PROMPT_EMPTY_POLICIES['has'](String(_0x288b40["prompt"]["emptyPolicy"] || ''))) {
    throw new Error("[manifest] model manifest " + _0x288b40["modelId"] + " prompt.emptyPolicy must be one of: " + Array["from"](ALLOWED_PROMPT_EMPTY_POLICIES)["join"](',\x20'));
  }
  if (_0x288b40["prompt"]["minLength"] !== undefined && _0x288b40["prompt"]["minLength"] !== null) {
    const _0x3ad0d6 = Number(_0x288b40['prompt']['minLength']);
    if (!Number["isInteger"](_0x3ad0d6) || _0x3ad0d6 < 0x0) {
      throw new Error("[manifest] model manifest " + _0x288b40["modelId"] + " prompt.minLength must be a non-negative integer");
    }
  }
}
function assertInputPolicyCondition(_0x3dc983, _0x2998b7) {
  if (Array['isArray'](_0x3dc983)) {
    if (_0x3dc983['length'] === 0x0) {
      throw new Error('[manifest]\x20' + _0x2998b7 + " must not be empty");
    }
    _0x3dc983["forEach"]((_0x21100a, _0x781f2b) => assertInputPolicyCondition(_0x21100a, _0x2998b7 + '[' + _0x781f2b + ']'));
    return;
  }
  assertPlainObject(_0x3dc983, _0x2998b7);
  if (Array["isArray"](_0x3dc983["any"]) || Array['isArray'](_0x3dc983['all'])) {
    const _0x36cdab = Array['isArray'](_0x3dc983["any"]) ? "any" : "all";
    assertInputPolicyCondition(_0x3dc983[_0x36cdab], _0x2998b7 + '.' + _0x36cdab);
    return;
  }
  if (!normalizeRegistryKey(_0x3dc983["field"] ?? _0x3dc983["param"])) {
    throw new Error('[manifest]\x20' + _0x2998b7 + " must declare field or param");
  }
  if (_0x3dc983["value"] === undefined && _0x3dc983['values'] === undefined) {
    throw new Error("[manifest] " + _0x2998b7 + " must declare value or values");
  }
}
function assertInputPolicyExtensions(_0x4bae7c) {
  const _0x224850 = _0x4bae7c['inputSlots'];
  if (_0x224850["preserveHiddenInputsByKind"] !== undefined && typeof _0x224850["preserveHiddenInputsByKind"] !== "boolean") {
    throw new Error('[manifest]\x20model\x20manifest\x20inputSlots.preserveHiddenInputsByKind\x20must\x20be\x20a\x20boolean');
  }
  const _0x34df64 = _0x224850["preserveHiddenInputsByKindFields"];
  if (_0x34df64 !== undefined && (!Array['isArray'](_0x34df64) || _0x34df64["length"] === 0x0 || _0x34df64["some"](_0x54ca27 => !String(_0x54ca27 || '')['trim']()))) {
    throw new Error('[manifest]\x20model\x20manifest\x20inputSlots.preserveHiddenInputsByKindFields\x20must\x20be\x20a\x20non-empty\x20string\x20array');
  }
  if (Array["isArray"](_0x34df64) && _0x224850["preserveHiddenInputsByKind"] !== !![]) {
    throw new Error("[manifest] model manifest inputSlots.preserveHiddenInputsByKindFields requires preserveHiddenInputsByKind");
  }
  const _0xedeacf = _0x224850["policyVariants"] || [];
  if (_0xedeacf && !Array["isArray"](_0xedeacf)) {
    throw new Error("[manifest] model manifest inputSlots.policyVariants must be an array");
  }
  (_0xedeacf || [])["forEach"]((_0x2151bd, _0x4f8192) => {
    const _0x228efd = "model manifest inputSlots.policyVariants[" + _0x4f8192 + ']';
    assertPlainObject(_0x2151bd, _0x228efd);
    assertInputPolicyCondition(_0x2151bd['when'], _0x228efd + ".when");
    if (_0x2151bd["allowedKinds"] !== undefined && !Array["isArray"](_0x2151bd["allowedKinds"])) {
      throw new Error("[manifest] " + _0x228efd + ".allowedKinds must be an array");
    }
    if (_0x2151bd['maxByKind'] !== undefined && !isPlainObject(_0x2151bd['maxByKind'])) {
      throw new Error("[manifest] " + _0x228efd + ".maxByKind must be an object");
    }
    Object["entries"](_0x2151bd["maxByKind"] || {})['forEach'](([_0x1c04be, _0x64d0be]) => {
      const _0x4ea331 = Number(_0x64d0be);
      if (!Number["isFinite"](_0x4ea331) || _0x4ea331 < 0x0) {
        throw new Error("[manifest] " + _0x228efd + '.maxByKind.' + _0x1c04be + " must be a non-negative number");
      }
    });
  });
  const _0x5c4366 = _0x224850['mediaConstraintsByKind'] || {};
  if (_0x5c4366 && !isPlainObject(_0x5c4366)) {
    throw new Error("[manifest] model manifest inputSlots.mediaConstraintsByKind must be an object");
  }
  Object["entries"](_0x5c4366 || {})["forEach"](([_0x52b114, _0x22e9bf]) => {
    const _0x11dabd = "model manifest inputSlots.mediaConstraintsByKind." + _0x52b114;
    assertPlainObject(_0x22e9bf, _0x11dabd);
    ["minDurationSeconds", "maxDurationSeconds", 'maxBytes']['forEach'](_0x554491 => {
      if (_0x22e9bf[_0x554491] === undefined) {
        return;
      }
      const _0x2cfb27 = Number(_0x22e9bf[_0x554491]);
      if (!Number["isFinite"](_0x2cfb27) || _0x2cfb27 <= 0x0) {
        throw new Error("[manifest] " + _0x11dabd + '.' + _0x554491 + " must be positive");
      }
    });
    if (_0x22e9bf["minDurationSeconds"] !== undefined && _0x22e9bf["maxDurationSeconds"] !== undefined && Number(_0x22e9bf["minDurationSeconds"]) > Number(_0x22e9bf["maxDurationSeconds"])) {
      throw new Error('[manifest]\x20' + _0x11dabd + ".minDurationSeconds cannot exceed maxDurationSeconds");
    }
    if (_0x22e9bf["allowedExtensions"] !== undefined && (!Array["isArray"](_0x22e9bf["allowedExtensions"]) || _0x22e9bf["allowedExtensions"]["some"](_0x36fd6 => !String(_0x36fd6 || '')['trim']()))) {
      throw new Error("[manifest] " + _0x11dabd + '.allowedExtensions\x20must\x20be\x20an\x20array\x20of\x20non-empty\x20strings');
    }
  });
}
function assertInputSlots(_0x34cfba) {
  const _0x32b051 = _0x34cfba['inputSlots'];
  assertPlainObject(_0x32b051, 'model\x20manifest\x20inputSlots');
  assertInputPolicyExtensions(_0x34cfba);
  const _0x576ffa = _0x32b051["fixedSlots"] === undefined || _0x32b051['fixedSlots'] === null ? [] : _0x32b051["fixedSlots"];
  if (!Array["isArray"](_0x576ffa)) {
    throw new Error("[manifest] model manifest inputSlots.fixedSlots must be an array");
  }
  const _0x267fbe = new Map();
  const _0x2cb4df = new Map();
  const _0x2f7321 = new Set();
  _0x576ffa["forEach"]((_0x372d42, _0x9b35aa) => {
    assertPlainObject(_0x372d42, "model manifest inputSlots.fixedSlots[" + _0x9b35aa + ']');
    assertRequiredFields(_0x372d42, ['id', "kind"], "model manifest inputSlots.fixedSlots[" + _0x9b35aa + ']');
    const _0x27f257 = normalizeRegistryKey(_0x372d42["kind"]);
    const _0x38bc4d = String(_0x372d42['id'] || '')["trim"]();
    if (_0x38bc4d) {
      _0x2f7321["add"](_0x38bc4d);
    }
    _0x267fbe["set"](_0x27f257, (_0x267fbe['get'](_0x27f257) || 0x0) + 0x1);
    if (_0x372d42['required'] !== undefined && _0x372d42["required"] !== null && typeof _0x372d42["required"] !== "boolean") {
      throw new Error('[manifest]\x20fixed\x20slot\x20' + _0x372d42['id'] + " required must be a boolean");
    }
    _0x372d42["required"] === !![] && _0x2cb4df["set"](_0x27f257, (_0x2cb4df["get"](_0x27f257) || 0x0) + 0x1);
  });
  const _0x598ca9 = _0x32b051["minByKind"] || {};
  if (_0x598ca9 && !isPlainObject(_0x598ca9)) {
    throw new Error("[manifest] model manifest inputSlots.minByKind must be an object");
  }
  Object['entries'](_0x598ca9 || {})["forEach"](([_0x32a6e9, _0x180ccf]) => {
    const _0x3381bc = Number(_0x180ccf);
    if (!Number["isFinite"](_0x3381bc) || _0x3381bc < 0x0) {
      throw new Error("[manifest] model manifest inputSlots.minByKind." + _0x32a6e9 + " must be a non-negative number");
    }
    const _0x3e2399 = normalizeRegistryKey(_0x32a6e9);
    const _0x30c0f9 = _0x267fbe["get"](_0x3e2399) || 0x0;
    if (_0x30c0f9 === 0x0 || _0x3381bc <= 0x0) {
      return;
    }
    const _0x3c79f2 = _0x2cb4df["get"](_0x3e2399) || 0x0;
    if (_0x3c79f2 < _0x3381bc) {
      throw new Error("[manifest] model manifest " + _0x34cfba["modelId"] + " inputSlots." + _0x3e2399 + " requires " + _0x3381bc + " input(s), but only " + _0x3c79f2 + " fixed slot(s) are marked required");
    }
  });
  const _0x3a5a07 = _0x32b051["maxTotalDurationSecondsByKind"] || {};
  if (_0x3a5a07 && !isPlainObject(_0x3a5a07)) {
    throw new Error("[manifest] model manifest inputSlots.maxTotalDurationSecondsByKind must be an object");
  }
  Object['entries'](_0x3a5a07)['forEach'](([_0x6b4548, _0x4833b0]) => {
    const _0x5ba406 = normalizeRegistryKey(_0x6b4548);
    const _0x3e2a63 = Number(_0x4833b0);
    if (_0x5ba406 !== "video" && _0x5ba406 !== "audio" || !Number["isFinite"](_0x3e2a63) || _0x3e2a63 <= 0x0) {
      throw new Error("[manifest] model manifest inputSlots.maxTotalDurationSecondsByKind." + _0x6b4548 + " must be a positive number for video or audio");
    }
    if (!_0x32b051["allowedKinds"]?.["includes"](_0x5ba406)) {
      throw new Error("[manifest] model manifest inputSlots.maxTotalDurationSecondsByKind." + _0x6b4548 + " requires " + _0x5ba406 + " in allowedKinds");
    }
  });
  const _0x4e51cc = _0x32b051['exclusiveGroups'] || [];
  if (_0x4e51cc && !Array["isArray"](_0x4e51cc)) {
    throw new Error('[manifest]\x20model\x20manifest\x20inputSlots.exclusiveGroups\x20must\x20be\x20an\x20array');
  }
  (_0x4e51cc || [])["forEach"]((_0x4e8d1c, _0x4ef290) => {
    assertPlainObject(_0x4e8d1c, "model manifest inputSlots.exclusiveGroups[" + _0x4ef290 + ']');
    if (!Array['isArray'](_0x4e8d1c["slots"]) || _0x4e8d1c["slots"]['length'] < 0x2) {
      throw new Error("[manifest] model manifest inputSlots.exclusiveGroups[" + _0x4ef290 + "].slots must contain at least two slots");
    }
    _0x4e8d1c["slots"]["forEach"](_0x1193f2 => {
      const _0xd6f88d = String(_0x1193f2 || '')["trim"]();
      if (!_0x2f7321["has"](_0xd6f88d)) {
        throw new Error("[manifest] model manifest inputSlots.exclusiveGroups[" + _0x4ef290 + ']\x20references\x20unknown\x20fixed\x20slot:\x20' + _0xd6f88d);
      }
    });
    ['min', "max"]["forEach"](_0x29bdd7 => {
      if (_0x4e8d1c[_0x29bdd7] === undefined || _0x4e8d1c[_0x29bdd7] === null) {
        return;
      }
      const _0x1e2455 = Number(_0x4e8d1c[_0x29bdd7]);
      if (!Number["isFinite"](_0x1e2455) || _0x1e2455 < 0x0) {
        throw new Error("[manifest] model manifest inputSlots.exclusiveGroups[" + _0x4ef290 + '].' + _0x29bdd7 + '\x20must\x20be\x20a\x20non-negative\x20number');
      }
    });
  });
}
export function validateModelManifest(_0x27e6dc) {
  assertPlainObject(_0x27e6dc, "model manifest");
  assertRequiredFields(_0x27e6dc, REQUIRED_MODEL_FIELDS, "model manifest");
  assertAdapterType(_0x27e6dc["adapterType"], "model manifest");
  assertUiSchema(_0x27e6dc);
  assertPromptConfig(_0x27e6dc);
  assertInputSlots(_0x27e6dc);
  return !![];
}
export function validateExecutionManifest(_0x3a02d0) {
  assertPlainObject(_0x3a02d0, "execution manifest");
  assertRequiredFields(_0x3a02d0, REQUIRED_EXECUTION_FIELDS, "execution manifest");
  assertAdapterType(_0x3a02d0["adapterType"], "execution manifest");
  _0x3a02d0["adapterType"] === 'workflow' && assertRequiredFields(_0x3a02d0, REQUIRED_WORKFLOW_EXECUTION_FIELDS, "workflow execution manifest");
  _0x3a02d0["adapterType"] === 'modelApi' && assertRequiredFields(_0x3a02d0, REQUIRED_MODEL_API_EXECUTION_FIELDS, 'modelApi\x20execution\x20manifest');
  _0x3a02d0["adapterType"] === "localRuntime" && assertRequiredFields(_0x3a02d0, REQUIRED_LOCAL_RUNTIME_EXECUTION_FIELDS, 'localRuntime\x20execution\x20manifest');
  assertExecutionTarget(_0x3a02d0);
  return !![];
}
function addModelManifestToRegistry(_0x26248c) {
  const _0x3e0848 = String(_0x26248c["modelId"] || '')["trim"]();
  _models["set"](_0x3e0848, _0x26248c);
  Array["isArray"](_0x26248c["aliases"]) && _0x26248c["aliases"]['forEach'](_0x31b401 => {
    const _0x5865bf = String(_0x31b401 || '')['trim']();
    if (_0x5865bf) {
      _models["set"](_0x5865bf, _0x26248c);
    }
  });
}
function addExecutionManifestToRegistry(_0x14e259) {
  _executions["set"](String(_0x14e259['id']), _0x14e259);
  Array['isArray'](_0x14e259["aliases"]) && _0x14e259["aliases"]["forEach"](_0xbb6536 => {
    const _0x5ca5de = String(_0xbb6536 || '')['trim']();
    if (_0x5ca5de) {
      _executions["set"](_0x5ca5de, _0x14e259);
    }
  });
}
function registerModelManifest(_0x4d0001) {
  validateModelManifest(_0x4d0001);
  const _0x29857f = getExecutionManifest(_0x4d0001["executionId"]);
  if (_0x29857f) {
    assertModelExecutionContract(_0x4d0001, _0x29857f);
  }
  addModelManifestToRegistry(_0x4d0001);
}
function registerExecutionManifest(_0x172314) {
  validateExecutionManifest(_0x172314);
  addExecutionManifestToRegistry(_0x172314);
}
function assertManifestBundle(_0x463846) {
  assertPlainObject(_0x463846, "manifest bundle");
  assertPlainData(_0x463846, "manifest bundle");
  assertRequiredFields(_0x463846, ["sourceId"], 'manifest\x20bundle');
  if (!normalizeRegistryKey(_0x463846["sourceId"])) {
    throw new Error("[manifest] manifest bundle sourceId must be non-empty");
  }
  if (!Array["isArray"](_0x463846["models"])) {
    throw new TypeError("[manifest] manifest bundle.models must be an array");
  }
  if (!Array["isArray"](_0x463846['executions'])) {
    throw new TypeError("[manifest] manifest bundle.executions must be an array");
  }
  const _0x519106 = _0x463846["executions"];
  const _0x5f252b = _0x463846["models"];
  _0x519106["forEach"](validateExecutionManifest);
  _0x5f252b['forEach'](validateModelManifest);
  assertRegistryKeysAvailable(_0x519106, _executions, 'id', 'execution\x20manifest');
  const _0x21805e = buildManifestKeyMap(_0x519106, 'id', 'execution\x20manifest');
  assertRegistryKeysAvailable(_0x5f252b, _models, "modelId", "model manifest");
  assertBundleModelExecutionLinks(_0x5f252b, _0x21805e);
  return {
    'executions': _0x519106,
    'models': _0x5f252b
  };
}
export function validateManifestBundle(_0x12a480) {
  assertManifestBundle(_0x12a480);
  return !![];
}
export function registerManifestBundle(_0x4430d0) {
  const {
    executions: _0x1ed76d,
    models: _0x5d33cb
  } = assertManifestBundle(_0x4430d0);
  _0x1ed76d["forEach"](addExecutionManifestToRegistry);
  _0x5d33cb["forEach"](addModelManifestToRegistry);
  return !![];
}
function removeManifestFromRegistry(_0x1da31e, _0x1e4f22, _0x4fdb0f, _0x196418) {
  const _0x4ea31d = String(_0x1da31e?.[_0x4fdb0f] || '')["trim"]();
  if (!_0x4ea31d) {
    return;
  }
  getManifestRegistryKeys(_0x1da31e, _0x4fdb0f, _0x196418)["forEach"](_0x52620b => {
    const _0x135ede = _0x1e4f22["get"](_0x52620b);
    String(_0x135ede?.[_0x4fdb0f] || '')['trim']() === _0x4ea31d && _0x1e4f22['delete'](_0x52620b);
  });
}
export function unregisterManifestBundle(_0x4a9bdd) {
  const _0x306396 = Array["isArray"](_0x4a9bdd?.["executions"]) ? _0x4a9bdd['executions'] : [];
  const _0x26dfb7 = Array["isArray"](_0x4a9bdd?.["models"]) ? _0x4a9bdd['models'] : [];
  _0x306396['forEach'](_0x1c7e7f => removeManifestFromRegistry(_0x1c7e7f, _executions, 'id', 'execution\x20manifest'));
  _0x26dfb7['forEach'](_0x13dbc2 => removeManifestFromRegistry(_0x13dbc2, _models, "modelId", "model manifest"));
  return !![];
}
registerExecutionManifest(qwenImageEditExecutionManifest);
registerModelManifest(qwenImageEditModelManifest);
registerExecutionManifest(animeRealExecutionManifest);
registerModelManifest(animeRealModelManifest);
registerExecutionManifest(rhImageDepthExecutionManifest);
registerModelManifest(rhImageDepthModelManifest);
registerExecutionManifest(rhImageHdExecutionManifest);
registerModelManifest(rhImageHdModelManifest);
registerExecutionManifest(seedVr2ImageHdExecutionManifest);
registerModelManifest(seedVr2ImageHdModelManifest);
registerExecutionManifest(animeRealV3ExecutionManifest);
registerModelManifest(animeRealV3ModelManifest);
registerExecutionManifest(personReplaceV21ExecutionManifest);
registerModelManifest(personReplaceV21ModelManifest);
registerExecutionManifest(personReplaceV3ExecutionManifest);
registerModelManifest(personReplaceV3ModelManifest);
registerExecutionManifest(personFullAngleV4ExecutionManifest);
registerModelManifest(personFullAngleV4ModelManifest);
registerExecutionManifest(controlCameraExecutionManifest);
registerModelManifest(controlCameraModelManifest);
registerExecutionManifest(krea2TextToImageExecutionManifest);
registerModelManifest(krea2TextToImageModelManifest);
registerExecutionManifest(zImageTextToImageExecutionManifest);
registerModelManifest(zImageTextToImageModelManifest);
registerExecutionManifest(rhVideoBasicExecutionManifest);
registerModelManifest(rhVideoBasicModelManifest);
registerExecutionManifest(rhVideoLtx23ExecutionManifest);
registerModelManifest(rhVideoLtx23ModelManifest);
registerExecutionManifest(rhVideoCommercialDigitalHumanExecutionManifest);
registerModelManifest(rhVideoCommercialDigitalHumanModelManifest);
registerExecutionManifest(rhVideoLipSyncExecutionManifest);
registerModelManifest(rhVideoLipSyncModelManifest);
registerExecutionManifest(rhVideoV54ExecutionManifest);
registerModelManifest(rhVideoV54ModelManifest);
registerExecutionManifest(rhVideoAnimate2V1ExecutionManifest);
registerModelManifest(rhVideoAnimate2V1ModelManifest);
registerExecutionManifest(rhVideoHailuoH3OmniExecutionManifest);
registerModelManifest(rhVideoHailuoH3OmniModelManifest);
registerExecutionManifest(rhVideoHailuoH3AudioDrivenExecutionManifest);
registerModelManifest(rhVideoHailuoH3AudioDrivenModelManifest);
registerExecutionManifest(rhVideoHailuoH3DualSamplingX2ExecutionManifest);
registerModelManifest(rhVideoHailuoH3DualSamplingX2ModelManifest);
registerExecutionManifest(rhVideoHailuoH3EditV1ExecutionManifest);
registerModelManifest(rhVideoHailuoH3EditV1ModelManifest);
registerExecutionManifest(rhVideoBerniniV1ExecutionManifest);
registerModelManifest(rhVideoBerniniV1ModelManifest);
registerExecutionManifest(rhVideoWan22ExecutionManifest);
registerModelManifest(rhVideoWan22ModelManifest);
registerExecutionManifest(rhVideoScail2V1ExecutionManifest);
registerModelManifest(rhVideoScail2V1ModelManifest);
registerExecutionManifest(rhVideoScailV2ExecutionManifest);
registerModelManifest(rhVideoScailV2ModelManifest);
registerExecutionManifest(rhVideoWatermarkRemovalV2ExecutionManifest);
registerModelManifest(rhVideoWatermarkRemovalV2ModelManifest);
registerExecutionManifest(rhVideoMattingExecutionManifest);
registerModelManifest(rhVideoMattingModelManifest);
registerExecutionManifest(rhVideoHdVipExecutionManifest);
registerModelManifest(rhVideoHdVipModelManifest);
registerExecutionManifest(rhVideoFrameInterpolationExecutionManifest);
registerModelManifest(rhVideoFrameInterpolationModelManifest);
registerExecutionManifest(rhVideoDepthExecutionManifest);
registerModelManifest(rhVideoDepthModelManifest);
registerExecutionManifest(rhAudioIndexTts2CloneExecutionManifest);
registerModelManifest(rhAudioIndexTts2CloneModelManifest);
registerExecutionManifest(rhAudioVoiceConvertExecutionManifest);
registerModelManifest(rhAudioVoiceConvertModelManifest);
registerExecutionManifest(rhAudioAdvancedVoiceCloneExecutionManifest);
registerModelManifest(rhAudioAdvancedVoiceCloneModelManifest);
registerExecutionManifest(rhAudioSeparationExecutionManifest);
registerModelManifest(rhAudioSeparationModelManifest);
vendorImageModelApiExecutionManifests["forEach"](registerExecutionManifest);
vendorImageModelApiModelManifests["forEach"](registerModelManifest);
dreaminaImageExecutionManifests["forEach"](registerExecutionManifest);
dreaminaImageModelManifests["forEach"](registerModelManifest);
openAiCliImageExecutionManifests["forEach"](registerExecutionManifest);
openAiCliImageModelManifests["forEach"](registerModelManifest);
vendorVideoModelApiExecutionManifests["forEach"](registerExecutionManifest);
vendorVideoModelApiModelManifests["forEach"](registerModelManifest);
dreaminaVideoExecutionManifests["forEach"](registerExecutionManifest);
dreaminaVideoModelManifests['forEach'](registerModelManifest);
vendorTextModelApiExecutionManifests["forEach"](registerExecutionManifest);
vendorTextModelApiModelManifests["forEach"](registerModelManifest);
cliTextExecutionManifests['forEach'](registerExecutionManifest);
cliTextModelManifests['forEach'](registerModelManifest);
volcengineAudioModelApiExecutionManifests["forEach"](registerExecutionManifest);
volcengineAudioModelApiModelManifests["forEach"](registerModelManifest);
runningHubAudioModelApiExecutionManifests["forEach"](registerExecutionManifest);
runningHubAudioModelApiModelManifests['forEach'](registerModelManifest);
runningHubAudioCatalogExecutions['forEach'](registerExecutionManifest);
runningHubAudioCatalogModels["forEach"](registerModelManifest);
runningHubLyricsExecutions["forEach"](registerExecutionManifest);
runningHubLyricsModels['forEach'](registerModelManifest);
export function getModelManifest(_0x370494) {
  const _0x1203ea = String(_0x370494 || '')["trim"]();
  return _models["get"](_0x1203ea) || null;
}
export function resolveModelManifest(_0x2f93bb, _0x1dd2c7 = '') {
  const _0x51ade6 = getModelManifest(_0x2f93bb);
  if (!_0x51ade6) {
    return null;
  }
  const _0x2d749f = String(_0x1dd2c7 || '')["trim"]();
  if (_0x2d749f && _0x51ade6['provider'] !== _0x2d749f) {
    return null;
  }
  return _0x51ade6;
}
export function getExecutionManifest(_0x24259a) {
  return _executions["get"](String(_0x24259a || '')["trim"]()) || null;
}
export function resolveExecutionManifest(_0x37d726) {
  return getExecutionManifest(_0x37d726);
}
const PROVIDER_PREFIXES = Object["freeze"]({
  'runninghub-model': "runninghub",
  'runninghub': "runninghubwf",
  'dreamina': "dreamina",
  'apimart': "apimart",
  'agnes': "agnes",
  'ppio': 'ppio',
  'grsai': 'grsai',
  'volcengine': "volcengine",
  'comfyui': "comfyui"
});
export function normalizeProviderId(_0x54d69a) {
  const _0x5b3f82 = String(_0x54d69a || '')["trim"]()["toLowerCase"]();
  if (_0x5b3f82 === "runninghub-workflow" || _0x5b3f82 === 'runninghubwf') {
    return "runninghubwf";
  }
  if (_0x5b3f82 === 'runninghub-model') {
    return 'runninghub';
  }
  return _0x5b3f82;
}
function inferProviderFromModelPrefix(_0x269eb0) {
  const _0x4d260c = String(_0x269eb0 || '')["trim"]()["toLowerCase"]();
  const _0x4b54d8 = _0x4d260c["includes"]('/') ? _0x4d260c["split"]('/')[0x0] : '';
  return PROVIDER_PREFIXES[_0x4b54d8] || '';
}
function resolveUniqueModelDisplayName(_0x51dc20, _0x289b23 = '') {
  const _0x538172 = normalizeRegistryKey(_0x51dc20)['toLowerCase']();
  const _0x5b19fd = normalizeProviderId(_0x289b23);
  if (!_0x538172) {
    return null;
  }
  const _0x3c5263 = Array["from"](new Set(_models["values"]()))['filter'](_0x18eb48 => {
    if (normalizeRegistryKey(_0x18eb48?.["displayName"])['toLowerCase']() !== _0x538172) {
      return ![];
    }
    return !_0x5b19fd || normalizeProviderId(_0x18eb48?.["provider"]) === _0x5b19fd;
  });
  return _0x3c5263['length'] === 0x1 ? _0x3c5263[0x0] : null;
}
function resolveModelManifestCandidate(_0x5cda09, _0x465ef6 = '') {
  const _0x4674e9 = normalizeRegistryKey(_0x5cda09);
  const _0x26738e = normalizeProviderId(_0x465ef6);
  if (!_0x4674e9) {
    return null;
  }
  const _0x516faa = getModelManifest(_0x4674e9);
  if (_0x516faa && (!_0x26738e || normalizeProviderId(_0x516faa["provider"]) === _0x26738e)) {
    return {
      'modelManifest': _0x516faa,
      'inputModelId': _0x4674e9,
      'canonicalModelId': _0x516faa["modelId"],
      'source': "exact"
    };
  }
  const _0x4aaf4c = resolveUniqueModelDisplayName(_0x4674e9, _0x26738e);
  if (_0x4aaf4c) {
    return {
      'modelManifest': _0x4aaf4c,
      'inputModelId': _0x4674e9,
      'canonicalModelId': _0x4aaf4c['modelId'],
      'source': "display-name"
    };
  }
  if (_0x26738e && _0x4674e9["includes"]('/')) {
    const [_0x2f3d1d, ..._0x2f644c] = _0x4674e9["split"]('/');
    const _0x4c791a = inferProviderFromModelPrefix(_0x4674e9);
    const _0x3f3486 = _0x2f644c["join"]('/');
    if (_0x3f3486 && (!_0x4c791a || _0x4c791a === _0x26738e)) {
      const _0x14ad2b = getModelManifest(_0x3f3486);
      if (_0x14ad2b && normalizeProviderId(_0x14ad2b['provider']) === _0x26738e) {
        return {
          'modelManifest': _0x14ad2b,
          'inputModelId': _0x4674e9,
          'canonicalModelId': _0x14ad2b["modelId"],
          'source': "stripped:" + _0x2f3d1d
        };
      }
    }
  }
  if (_0x26738e && !_0x4674e9["includes"]('/')) {
    const _0x550520 = getModelManifest(_0x26738e + '/' + _0x4674e9);
    if (_0x550520 && normalizeProviderId(_0x550520["provider"]) === _0x26738e) {
      return {
        'modelManifest': _0x550520,
        'inputModelId': _0x4674e9,
        'canonicalModelId': _0x550520["modelId"],
        'source': "prefixed"
      };
    }
  }
  return null;
}
export function resolveModelProvider(_0x3d49f0, _0x3f7e1e = '', {
  allowProviderHint = !![],
  allowPrefixInference = !![]
} = {}) {
  const _0x527991 = normalizeProviderId(_0x3f7e1e);
  if (_0x527991 && allowProviderHint) {
    return _0x527991;
  }
  const _0x56a61c = resolveModelManifestCandidate(_0x3d49f0, _0x527991);
  if (_0x56a61c?.["modelManifest"]?.["provider"]) {
    return normalizeProviderId(_0x56a61c["modelManifest"]["provider"]);
  }
  return allowPrefixInference ? inferProviderFromModelPrefix(_0x3d49f0) : '';
}
export function resolveModelExecution(_0x11b0ac, _0x4139ed = {}) {
  const _0x493416 = typeof _0x4139ed === "string" ? _0x4139ed : _0x4139ed?.["providerHint"] || _0x4139ed?.['provider'] || '';
  const _0x285e15 = resolveModelManifestCandidate(_0x11b0ac, _0x493416);
  const _0x21b512 = _0x285e15?.["modelManifest"] || null;
  if (!_0x21b512) {
    return null;
  }
  const _0x44b7ea = getExecutionManifest(_0x21b512['executionId']);
  if (!_0x44b7ea) {
    return null;
  }
  return {
    'modelManifest': _0x21b512,
    'executionManifest': _0x44b7ea,
    'inputModelId': _0x285e15['inputModelId'],
    'canonicalModelId': _0x285e15['canonicalModelId'],
    'source': _0x285e15["source"]
  };
}
export function isModelApiModel(_0x26ee69, _0x1b5206 = '') {
  const _0x70727b = resolveModelExecution(_0x26ee69, {
    'providerHint': _0x1b5206
  });
  return _0x70727b?.["modelManifest"]?.["adapterType"] === 'modelApi' && _0x70727b?.["executionManifest"]?.["adapterType"] === "modelApi";
}
export function isWorkflowModel(_0x207247, _0x546a45 = '') {
  const _0x361100 = resolveModelExecution(_0x207247, {
    'providerHint': _0x546a45
  });
  return _0x361100?.["modelManifest"]?.['adapterType'] === "workflow" && _0x361100?.["executionManifest"]?.["adapterType"] === 'workflow';
}
export function isLocalRuntimeModel(_0x4a3c61, _0x24fd80 = '') {
  const _0x175430 = resolveModelExecution(_0x4a3c61, {
    'providerHint': _0x24fd80
  });
  return _0x175430?.["modelManifest"]?.['adapterType'] === "localRuntime" && _0x175430?.["executionManifest"]?.['adapterType'] === "localRuntime";
}
export function getModelsByKind(_0x14ff65) {
  const _0x546d23 = String(_0x14ff65 || '')["trim"]();
  return Array["from"](new Set(_models['values']()))["filter"](_0x411540 => !_0x546d23 || _0x411540['kind'] === _0x546d23);
}
export function listModelManifests() {
  return Array["from"](new Set(_models['values']()));
}