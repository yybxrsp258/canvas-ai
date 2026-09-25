import { resolveModelExecution } from '../../src/manifests/index.js';
import { normalizeRatioLabelText } from '../imageRatioPolicy.js';
import { buildImageRequestFromManifest } from './ModelApiManifestNormalizer.js';
import { buildRunningHubNodeInfoListFromManifest as a26_0x54ed94 } from './RunningHubWorkflowMappingAdapter.js';
import { getRunningHubWorkflowPayloadResolver } from './runninghubWorkflowResolvers/index.js';
import { getRunningHubProviderProfileId, normalizeRunningHubModelApiProfileId, resolveRunningHubModelApiBaseUrl } from '../../src/modules/runningHubProviderProfiles.js';
import { normalizeRunningHubInstanceType } from '../../src/modules/runningHubInstanceTypes.js';
import { uploadModelApiMediaInputs } from '../mediaInputUploadRouter.js';
import { createMediaUploadError } from '../mediaUploadErrorDetails.js';
const RH_V54_SOURCE_VIDEO_MISSING_MESSAGE = "未获取到源视频 URL，请重新连接或重新上传源视频后再生成。";
const RH_V54_SOURCE_VIDEO_UPLOAD_FAILED_MESSAGE = '源视频上传失败';
const RH_VIDEO_FPS_OPTIONS = Object["freeze"]([0x10, 0x18, 0x1e]);
const RH_MIN_VIDEO_RESOLUTION = 0x340;
const RUNNINGHUB_WORKFLOW_DEFAULT_RATIO = "1:1";
const RUNNINGHUB_WORKFLOW_RATIO_SET = new Set(["1:1", "9:16", '16:9', '3:4', '4:3', "3:2", "2:3", "5:4", "4:5", '21:9']);
const CUSTOM_AI_APP_MEDIA_NODE_SOURCES = new Set(["imageInput", "videoInput", "audioInput"]);
function getRunningHubWorkflowProfileId(_0x1a284d = {}) {
  const _0x320de7 = getRunningHubProviderProfileId(_0x1a284d);
  return _0x320de7 ? normalizeRunningHubModelApiProfileId(_0x320de7) : '';
}
function getRunningHubWorkflowBaseUrl(_0x58b7d2 = {}) {
  const _0x202fe4 = String(_0x58b7d2?.["runningHubApiUrl"] || '')["trim"]();
  if (_0x202fe4) {
    return _0x202fe4["replace"](/\/+$/, '');
  }
  return resolveRunningHubModelApiBaseUrl(getRunningHubWorkflowProfileId(_0x58b7d2));
}
export function resolveRunningHubWorkflowResourceId(_0x4d4dcc, _0x37b2d9 = {}) {
  const _0x568416 = getRunningHubWorkflowProfileId(_0x37b2d9) || "runninghub";
  const _0x286392 = _0x4d4dcc?.['extensions']?.["providerProfileBindings"]?.[_0x568416];
  const _0x4d94b5 = _0x4d4dcc?.["submitMode"] === "runninghub-task-create";
  const _0x146ecf = _0x4d94b5 ? _0x286392?.["workflowId"] || _0x286392?.["appId"] : _0x286392?.["appId"] || _0x286392?.["workflowId"];
  const _0x53d1a1 = _0x4d94b5 ? _0x4d4dcc?.['workflowId'] || _0x4d4dcc?.['appId'] : _0x4d4dcc?.["appId"] || _0x4d4dcc?.["workflowId"];
  return String(_0x146ecf || _0x53d1a1 || '')['trim']();
}
function isImportedRunningHubAiAppManifest(_0xe99fe) {
  return Boolean(_0xe99fe?.["extensions"]?.['rhAiApp']) && _0xe99fe["extensions"]["rhAiApp"]["sourceType"] !== 'runninghub-workflow';
}
function relaxCustomAiAppMediaNodeMappings(_0x2c0ed6 = null, {
  enabled = ![]
} = {}) {
  if (!enabled || !_0x2c0ed6 || typeof _0x2c0ed6 !== "object" || Array['isArray'](_0x2c0ed6)) {
    return _0x2c0ed6;
  }
  const _0x5263be = Array["isArray"](_0x2c0ed6['nodeInfoList']) ? _0x2c0ed6['nodeInfoList']['map'](_0x262684 => CUSTOM_AI_APP_MEDIA_NODE_SOURCES["has"](String(_0x262684?.["source"] || '')["trim"]()) ? {
    ..._0x262684,
    'required': ![]
  } : _0x262684) : _0x2c0ed6["nodeInfoList"];
  return {
    ..._0x2c0ed6,
    'nodeInfoList': _0x5263be
  };
}
function isAdvancedModeEnabled() {
  return typeof window !== "undefined" && window["ADVANCED_MODE"] === !![];
}
function normalizeRhVideoFps(_0x33762f) {
  const _0x17ec27 = Math["trunc"](Number(_0x33762f));
  return RH_VIDEO_FPS_OPTIONS["includes"](_0x17ec27) ? _0x17ec27 : 0x18;
}
function normalizeRhVideoResolution(_0x48185b, _0x17b3f5 = RH_MIN_VIDEO_RESOLUTION) {
  const _0x5d8208 = Number(_0x48185b);
  return Number["isFinite"](_0x5d8208) ? Math["max"](RH_MIN_VIDEO_RESOLUTION, Math["trunc"](_0x5d8208)) : _0x17b3f5;
}
function normalizeRunningHubWorkflowRatio(_0x97d83b, _0x37b3c1 = RUNNINGHUB_WORKFLOW_DEFAULT_RATIO) {
  const _0xe3dca1 = String(_0x97d83b || '')["trim"]();
  const _0xfa3f04 = RUNNINGHUB_WORKFLOW_RATIO_SET["has"](String(_0x37b3c1 || '')["trim"]()) ? String(_0x37b3c1 || '')['trim']() : RUNNINGHUB_WORKFLOW_DEFAULT_RATIO;
  if (!_0xe3dca1) {
    return _0xfa3f04;
  }
  const _0xed4a48 = normalizeRatioLabelText(_0xe3dca1);
  const _0x2c9653 = _0xed4a48["toLowerCase"]();
  if (_0x2c9653 === "auto" || _0x2c9653 === 'default' || _0xed4a48 === '默认' || _0xed4a48 === '自适应' || _0x2c9653 === "original" || _0xed4a48 === "原图比例") {
    return _0xfa3f04;
  }
  if (!_0xed4a48['includes'](':')) {
    return _0xfa3f04;
  }
  const [_0xe14db3, _0x5f5082] = _0xed4a48["split"](':');
  const _0x37140e = Number['parseFloat'](_0xe14db3);
  const _0x2a77c2 = Number["parseFloat"](_0x5f5082);
  if (!(_0x37140e > 0x0 && _0x2a77c2 > 0x0)) {
    return _0xfa3f04;
  }
  const _0x57e260 = _0x37140e + ':' + _0x2a77c2;
  return RUNNINGHUB_WORKFLOW_RATIO_SET['has'](_0x57e260) ? _0x57e260 : _0xfa3f04;
}
function normalizeQwenImageEditModeIndex(_0x2d90dd) {
  const _0x211a9e = String(_0x2d90dd || '')['trim']()["toLowerCase"]();
  if (_0x211a9e === '0' || _0x211a9e === "qwen2509" || _0x211a9e === "2509") {
    return '0';
  }
  return '1';
}
function normalizeQwenFirstImageModeIndex(_0x1aa95e) {
  const _0x5c3d72 = String(_0x1aa95e || '')["trim"]()['toLowerCase']();
  if (_0x5c3d72 === '1' || _0x5c3d72 === "pose" || _0x5c3d72 === "姿势图") {
    return '1';
  }
  if (_0x5c3d72 === '2' || _0x5c3d72 === "depth" || _0x5c3d72 === "深度图") {
    return '2';
  }
  return '0';
}
function getImageWorkflowLongSideMap(_0x1f0bce = {}) {
  const _0x185e22 = _0x1f0bce?.["longSideByImageSize"] && typeof _0x1f0bce["longSideByImageSize"] === "object" ? _0x1f0bce["longSideByImageSize"] : null;
  return _0x185e22 || Object["freeze"]({
    '1K': 0x400,
    '1.5K': 0x600,
    '2K': 0x780
  });
}
function resolveImageWorkflowQualityKey(_0x4eec12, _0x516edb = {}) {
  const _0x2cab81 = getImageWorkflowLongSideMap(_0x516edb);
  const _0x2c038a = String(_0x516edb?.["defaultImageSize"] || '2K')["trim"]()["toUpperCase"]();
  const _0x5d43f4 = String(_0x4eec12 || _0x2c038a)["trim"]()["toUpperCase"]();
  const _0x59b98b = Object["keys"](_0x2cab81);
  return _0x59b98b["find"](_0x19a07d => String(_0x19a07d)["trim"]()["toUpperCase"]() === _0x5d43f4) || _0x59b98b["find"](_0x373385 => String(_0x373385)["trim"]()["toUpperCase"]() === _0x2c038a) || _0x59b98b[0x0] || '2K';
}
function resolveImageWorkflowDimensions(_0x482603, _0x1262ab, _0x5a1f23 = {}) {
  const _0x4ed1bf = resolveImageWorkflowQualityKey(_0x482603, _0x5a1f23);
  const _0x6689f9 = Number(getImageWorkflowLongSideMap(_0x5a1f23)[_0x4ed1bf]) || 0x780;
  const _0x55d341 = String(_0x5a1f23?.['defaultAspectRatio'] || RUNNINGHUB_WORKFLOW_DEFAULT_RATIO)["trim"]();
  const _0x45f4c1 = normalizeRunningHubWorkflowRatio(_0x1262ab, _0x55d341);
  const [_0x452bf9, _0x197b19] = _0x45f4c1['split'](':');
  const _0x533123 = Number['parseFloat'](_0x452bf9) || 0x1;
  const _0x3b34ca = Number["parseFloat"](_0x197b19) || 0x1;
  const _0x39be10 = _0x533123 >= _0x3b34ca;
  const _0x77cca4 = _0x39be10 ? _0x6689f9 : _0x6689f9 * _0x533123 / _0x3b34ca;
  const _0x35a0ee = _0x39be10 ? _0x6689f9 * _0x3b34ca / _0x533123 : _0x6689f9;
  const _0x5b1c2f = Math["max"](0x1, Number(_0x5a1f23?.["align"]) || 0x40);
  const _0x3fa3df = Math["max"](0x1, Number(_0x5a1f23?.["minDimension"]) || 0x200);
  const _0x334130 = _0x4983d9 => Math["max"](_0x3fa3df, Math["round"](Number(_0x4983d9 || 0x0) / _0x5b1c2f) * _0x5b1c2f);
  return {
    'width': _0x334130(_0x77cca4),
    'height': _0x334130(_0x35a0ee)
  };
}
function resolveManifestDimensionsValue(_0x3fd954, _0x53e7a8, _0x55560f, _0x29adb5) {
  const _0x3a3bce = [...(Array["isArray"](_0x53e7a8?.[_0x55560f + "Fields"]) ? _0x53e7a8[_0x55560f + "Fields"] : []), _0x53e7a8?.[_0x55560f + "Field"], _0x55560f === 'imageSize' ? "imageSize" : "resolvedRatioLabel", _0x55560f === 'imageSize' ? "generationParams.imageSize" : "aspectRatio", _0x55560f === 'aspectRatio' ? "generationParams.aspectRatio" : '']['filter'](Boolean);
  return resolveManifestPayloadValue(_0x3fd954, _0x3a3bce, _0x29adb5);
}
function normalizeManifestDimensionNode(_0x3a5574, _0x3fd7e3, _0x50b910) {
  if (_0x3a5574 && typeof _0x3a5574 === "object" && !Array['isArray'](_0x3a5574)) {
    return {
      'nodeId': String(_0x3a5574['nodeId'] || '')["trim"](),
      'fieldName': String(_0x3a5574["fieldName"] || _0x50b910)["trim"]() || _0x50b910,
      'description': _0x3a5574["description"] || _0x50b910
    };
  }
  return {
    'nodeId': String(_0x3fd7e3?.["nodeId"] || '')["trim"](),
    'fieldName': String(_0x50b910 === "width" ? _0x3fd7e3?.["widthFieldName"] || "width" : _0x3fd7e3?.["heightFieldName"] || "height")['trim'](),
    'description': _0x50b910
  };
}
function pushManifestDimensionsNodes(_0x2f9705, _0x32627f, _0x3256f3) {
  const _0x427a15 = normalizeManifestDimensionNode(_0x32627f?.["widthNode"], _0x32627f, 'width');
  const _0xfc8536 = normalizeManifestDimensionNode(_0x32627f?.["heightNode"], _0x32627f, "height");
  [[_0x427a15, _0x3256f3['width']], [_0xfc8536, _0x3256f3["height"]]]['forEach'](([_0x51658e, _0x4c03d9]) => {
    if (!_0x51658e["nodeId"] || !_0x51658e["fieldName"]) {
      return;
    }
    _0x2f9705['push']({
      'nodeId': _0x51658e["nodeId"],
      'fieldName': _0x51658e["fieldName"],
      'fieldValue': String(_0x4c03d9),
      'description': _0x51658e["description"]
    });
  });
}
function normalizeManifestMappedValue(_0x57a7f4, _0x13b597) {
  const _0x516106 = String(_0x57a7f4 ?? _0x13b597?.["defaultValue"] ?? '')["trim"]();
  const _0x3513a4 = _0x13b597?.["valueMap"] || {};
  return _0x3513a4[_0x516106] || _0x3513a4[_0x516106["toLowerCase"]()] || _0x3513a4[String(_0x13b597?.['defaultValue'] || '')] || _0x516106;
}
function formatManifestPromptNodeValue(_0x495e7b, _0x4d1aae) {
  const _0x5e1a77 = String(_0x495e7b || '')["trim"]();
  const _0x142ced = String(_0x4d1aae?.["defaultValue"] ?? '');
  const _0x5f1507 = _0x5e1a77 || _0x142ced;
  if (!_0x5f1507) {
    return '';
  }
  return '' + String(_0x4d1aae?.["prefix"] ?? '') + _0x5f1507 + String(_0x4d1aae?.["suffix"] ?? '');
}
function normalizeManifestImageNode(_0x1b8aab, _0x47fd74) {
  if (_0x1b8aab && typeof _0x1b8aab === "object" && !Array["isArray"](_0x1b8aab)) {
    return {
      'nodeId': String(_0x1b8aab["nodeId"] || '')['trim'](),
      'fieldName': String(_0x1b8aab["fieldName"] || 'image')["trim"]() || "image",
      'description': _0x1b8aab["description"] || '图' + (_0x47fd74 + 0x1)
    };
  }
  return {
    'nodeId': String(_0x1b8aab || '')["trim"](),
    'fieldName': "image",
    'description': '图' + (_0x47fd74 + 0x1)
  };
}
function getManifestPayloadPathValue(_0x2a53e9, _0x298242) {
  const _0x597248 = String(_0x298242 || '')["trim"]();
  if (!_0x597248) {
    return undefined;
  }
  return _0x597248['split']('.')['reduce']((_0x4fb195, _0x1060d1) => {
    if (_0x4fb195 === undefined || _0x4fb195 === null) {
      return undefined;
    }
    return _0x4fb195[_0x1060d1];
  }, _0x2a53e9);
}
function resolveManifestPayloadValue(_0x360130, _0x45694e = [], _0x53c74b = undefined, {
  allowEmpty = ![]
} = {}) {
  const _0x1ad781 = Array["isArray"](_0x45694e) ? _0x45694e : [_0x45694e];
  for (const _0x3f9e14 of _0x1ad781['filter'](Boolean)) {
    const _0x7165e = getManifestPayloadPathValue(_0x360130, _0x3f9e14);
    if (allowEmpty && _0x7165e !== undefined && _0x7165e !== null) {
      return _0x7165e;
    }
    if (_0x7165e !== undefined && _0x7165e !== null && String(_0x7165e)['trim']() !== '') {
      return _0x7165e;
    }
  }
  return _0x53c74b;
}
function normalizeManifestValueNodeValue(_0x217e9e, _0x5e7aa1) {
  const _0x5481c1 = [...(Array["isArray"](_0x5e7aa1?.["allowedValues"]) ? _0x5e7aa1["allowedValues"] : []), ...(isAdvancedModeEnabled() && Array["isArray"](_0x5e7aa1?.["advancedAllowedValues"]) ? _0x5e7aa1["advancedAllowedValues"] : [])]["map"](_0xda5822 => Number(_0xda5822))["filter"](Number["isFinite"]);
  if (_0x5481c1["length"] === 0x0) {
    return _0x217e9e;
  }
  const _0x2ccd4e = Number(_0x217e9e);
  const _0x2e26d8 = Number(_0x5e7aa1?.["defaultValue"]);
  const _0x417f94 = Number["isFinite"](_0x2ccd4e) ? _0x2ccd4e : Number["isFinite"](_0x2e26d8) ? _0x2e26d8 : _0x5481c1[0x0];
  return _0x5481c1["reduce"]((_0x535636, _0x1505ea) => Math["abs"](_0x1505ea - _0x417f94) < Math["abs"](_0x535636 - _0x417f94) ? _0x1505ea : _0x535636, _0x5481c1[0x0]);
}
function buildRunningHubImageResultExtractor() {
  return _0x517aae => {
    if (_0x517aae['status'] === "COMPLETED" && Array['isArray'](_0x517aae["results"])) {
      return _0x517aae["results"]["map"](_0x5ba632 => _0x5ba632["url"] || _0x5ba632["imageUrl"])["filter"](Boolean);
    }
    return [];
  };
}
function buildOpenApiImageWorkflowRequest({
  executionManifest: _0x5b8694,
  payload: _0x31f9dc,
  apiKey: _0x4126df,
  nodeInfoList: _0x5d7352
}) {
  const _0x10cc2b = normalizeRunningHubInstanceType(_0x31f9dc[_0x5b8694["instanceType"]?.["field"]]);
  const _0x4e03da = resolveRunningHubWorkflowResourceId(_0x5b8694, _0x31f9dc);
  return {
    'url': "/api/v2/proxy/image",
    'headers': {
      'Content-Type': "application/json"
    },
    'body': {
      'apiUrl': getRunningHubWorkflowBaseUrl(_0x31f9dc) + "/openapi/v2/run/ai-app/" + _0x4e03da,
      'apiKey': _0x4126df,
      'nodeInfoList': _0x5d7352,
      'instanceType': _0x10cc2b,
      'usePersonalQueue': 'false'
    },
    'isAsync': !![],
    'taskIdPath': _0x5b8694["result"]?.["taskIdPath"] || "taskId",
    'adapterTrace': {
      'source': "manifest",
      'executionId': _0x5b8694['id'],
      'modelId': _0x31f9dc["model"]
    },
    'pollUrlBuilder': () => getRunningHubWorkflowBaseUrl(_0x31f9dc) + "/openapi/v2/query",
    'resultExtractor': buildRunningHubImageResultExtractor()
  };
}
async function buildOpenApiAiAppWorkflowRequestFromManifest({
  executionManifest: _0x18f73d,
  modelManifest = null,
  payload: _0x37527c,
  finalPrompt: _0x2bf161,
  finalUrls: _0x48fc27,
  apiKey: _0x1e4fd8,
  ctx: _0x169df7
}) {
  if (!_0x18f73d || _0x18f73d["adapterType"] !== "workflow" || !["openapi-v2-ai-app", "runninghub-task-create"]["includes"](_0x18f73d["submitMode"])) {
    return null;
  }
  const _0x28401c = relaxCustomAiAppMediaNodeMappings(_0x18f73d["mapping"] || {}, {
    'enabled': isImportedRunningHubAiAppManifest(modelManifest)
  });
  if (Array["isArray"](_0x28401c["nodeInfoList"])) {
    const _0x507d70 = await a26_0x54ed94({
      'mapping': _0x28401c,
      'payload': _0x37527c,
      'finalPrompt': _0x2bf161,
      'sourceResolvers': {
        'imageInput': ({
          item: _0x5de1a0
        }) => resolveRunningHubFirstImageInput(_0x37527c, _0x1e4fd8, _0x169df7, {
          'field': String(_0x5de1a0?.['field'] || 'inputUrls')["trim"](),
          'required': _0x5de1a0?.["required"] === !![],
          'missingMessage': _0x5de1a0?.["missingMessage"] || "请接入参考图",
          'uploadFailedMessage': _0x5de1a0?.['uploadFailedMessage'] || "参考图上传失败",
          'compress': _0x5de1a0?.['compress'] !== ![]
        }),
        'videoInput': ({
          item: _0x1001e2
        }) => {
          const _0x199b74 = String(_0x1001e2?.["urlField"] || _0x1001e2?.["field"] || "videoUrl")["trim"]();
          const _0x86e530 = String(_0x1001e2?.["fileField"] || "videoFile")["trim"]();
          const _0xc549f2 = String(getManifestPayloadPathValue(_0x37527c, _0x199b74) || '')["trim"]();
          const _0x1bb918 = getManifestPayloadPathValue(_0x37527c, _0x86e530);
          if (!_0x1001e2?.['required'] && !_0xc549f2 && !_0x1bb918) {
            return '';
          }
          return resolveRunningHubVideoInput(_0x37527c, _0x1e4fd8, {
            'urlField': _0x199b74,
            'fileField': _0x86e530,
            'missingMessage': _0x1001e2?.["missingMessage"] || '请接入源视频',
            'uploadFailedMessage': _0x1001e2?.["uploadFailedMessage"] || "源视频上传失败"
          });
        },
        'audioInput': ({
          item: _0x27d54e
        }) => {
          const _0xbf3a47 = String(_0x27d54e?.["urlField"] || _0x27d54e?.["field"] || 'audioUrl')["trim"]();
          const _0x1cae64 = String(_0x27d54e?.["fileField"] || "audioFile")["trim"]();
          const _0x2081c6 = String(getManifestPayloadPathValue(_0x37527c, _0xbf3a47) || '')['trim']();
          const _0x45d7b7 = getManifestPayloadPathValue(_0x37527c, _0x1cae64);
          if (!_0x27d54e?.['required'] && !_0x2081c6 && !_0x45d7b7) {
            return '';
          }
          return resolveRunningHubAudioInput(_0x37527c, _0x1e4fd8, {
            'urlField': _0xbf3a47,
            'fileField': _0x1cae64,
            'required': _0x27d54e?.['required'] === !![],
            'missingMessage': _0x27d54e?.["missingMessage"] || '请接入音频'
          });
        }
      },
      'transforms': {
        'normalizeRhVideoFps': _0x4f876e => normalizeRhVideoFps(_0x4f876e),
        'normalizeRhVideoResolution': (_0x9d14f3, _0x230ffb) => normalizeRhVideoResolution(_0x9d14f3, Number["isFinite"](Number(_0x230ffb["fallback"])) ? Number(_0x230ffb["fallback"]) : RH_MIN_VIDEO_RESOLUTION)
      }
    });
    if (!_0x507d70) {
      return null;
    }
    if (_0x18f73d["submitMode"] === "runninghub-task-create") {
      return {
        ...buildTaskCreateVideoWorkflowRequest({
          'executionManifest': _0x18f73d,
          'payload': _0x37527c,
          'apiKey': _0x1e4fd8,
          'nodeInfoList': _0x507d70
        }),
        'resultExtractor': buildRunningHubImageResultExtractor()
      };
    }
    return buildOpenApiImageWorkflowRequest({
      'executionManifest': _0x18f73d,
      'payload': _0x37527c,
      'apiKey': _0x1e4fd8,
      'nodeInfoList': _0x507d70
    });
  }
  const _0x2d3389 = _0x18f73d['validation'] || {};
  const _0xb602de = Math['max'](0x1, Number(_0x28401c["maxInputImages"]) || 0x1);
  const _0x57e4b9 = _0x48fc27["filter"](Boolean)["slice"](0x0, _0xb602de);
  const _0x49356b = Math["max"](0x0, Number(_0x2d3389["minInputImages"]) || 0x0);
  if (_0x57e4b9["length"] < _0x49356b) {
    throw new Error(_0x2d3389['missingInputMessage'] || "请先添加至少一张参考图再生成");
  }
  const _0x401259 = [];
  const _0x576274 = Array["isArray"](_0x28401c['imageNodes']) ? _0x28401c['imageNodes'] : [];
  _0x57e4b9["forEach"]((_0x691f95, _0x3cdd14) => {
    const _0x51cdb1 = normalizeManifestImageNode(_0x576274[_0x3cdd14], _0x3cdd14);
    const _0x41fcd1 = _0x51cdb1["nodeId"];
    if (!_0x41fcd1) {
      return;
    }
    _0x401259["push"]({
      'nodeId': _0x41fcd1,
      'fieldName': _0x51cdb1["fieldName"],
      'fieldValue': _0x691f95,
      'description': _0x51cdb1['description']
    });
  });
  const _0x1a5bf0 = Array["isArray"](_0x28401c["optionalImageNodes"]) ? _0x28401c["optionalImageNodes"] : [];
  if (_0x1a5bf0["length"] > 0x0) {
    const _0x526a23 = _0x1a5bf0["map"](_0x1832bb => String(resolveManifestPayloadValue(_0x37527c, _0x1832bb['fields'], '') || '')["trim"]());
    const _0x1508a1 = _0x169df7?.['processInputImagesPreserveOrder'] && _0x526a23['some'](Boolean) ? await _0x169df7["processInputImagesPreserveOrder"](_0x526a23, _0x1e4fd8, {
      'compress': ![],
      'provider': "runninghub",
      'strictUpload': !![],
      'apiUrl': getRunningHubWorkflowBaseUrl(_0x37527c)
    }) : _0x526a23;
    _0x1a5bf0["forEach"]((_0x2173a5, _0x3e6149) => {
      const _0x569860 = String(_0x526a23[_0x3e6149] || '')['trim']();
      const _0x50f3ca = String(_0x1508a1?.[_0x3e6149] || '')['trim']();
      if (_0x569860 && !_0x50f3ca) {
        throw new Error((_0x2173a5?.['uploadFailedMessage'] || "可选参考图上传失败") + "：第 " + (_0x3e6149 + 0x1) + " 项未返回有效图片地址");
      }
      if (!_0x50f3ca || !_0x2173a5?.["nodeId"] || !_0x2173a5?.["fieldName"]) {
        return;
      }
      _0x401259['push']({
        'nodeId': String(_0x2173a5["nodeId"]),
        'fieldName': String(_0x2173a5["fieldName"]),
        'fieldValue': _0x50f3ca,
        'description': _0x2173a5["description"] || String(_0x2173a5['fieldName'])
      });
      _0x2173a5["enableNode"]?.["nodeId"] && _0x2173a5["enableNode"]?.["fieldName"] && _0x401259['push']({
        'nodeId': String(_0x2173a5["enableNode"]["nodeId"]),
        'fieldName': String(_0x2173a5["enableNode"]["fieldName"]),
        'fieldValue': String(_0x2173a5["enableNode"]["value"] ?? 'true'),
        'description': _0x2173a5["enableNode"]["description"] || String(_0x2173a5["enableNode"]['fieldName'])
      });
    });
  }
  _0x28401c['promptNode']?.['nodeId'] && _0x28401c["promptNode"]?.["fieldName"] && _0x401259['push']({
    'nodeId': String(_0x28401c['promptNode']["nodeId"]),
    'fieldName': String(_0x28401c["promptNode"]["fieldName"]),
    'fieldValue': formatManifestPromptNodeValue(_0x2bf161, _0x28401c["promptNode"]),
    'description': _0x28401c['promptNode']["description"] || "提示词"
  });
  if (_0x28401c["dimensionsNode"]?.["nodeId"] || _0x28401c["dimensionsNode"]?.['widthNode']?.["nodeId"] || _0x28401c["dimensionsNode"]?.["heightNode"]?.['nodeId']) {
    const _0x3cb456 = _0x28401c["dimensionsNode"];
    const _0x335f22 = resolveImageWorkflowDimensions(resolveManifestDimensionsValue(_0x37527c, _0x3cb456, "imageSize", _0x3cb456["defaultImageSize"]), resolveManifestDimensionsValue(_0x37527c, _0x3cb456, 'aspectRatio', _0x3cb456["defaultAspectRatio"]), _0x3cb456);
    pushManifestDimensionsNodes(_0x401259, _0x3cb456, _0x335f22);
  }
  [_0x28401c["firstImageModeNode"], _0x28401c["editModeNode"]]['forEach'](_0x3eb118 => {
    if (!_0x3eb118?.["nodeId"] || !_0x3eb118?.['fieldName'] || !_0x3eb118?.["field"]) {
      return;
    }
    _0x401259["push"]({
      'nodeId': String(_0x3eb118["nodeId"]),
      'fieldName': String(_0x3eb118['fieldName']),
      'fieldValue': normalizeManifestMappedValue(_0x37527c[_0x3eb118["field"]], _0x3eb118),
      'description': _0x3eb118 === _0x28401c["firstImageModeNode"] ? '把第一张图变为' : "模式选择"
    });
  });
  Array["isArray"](_0x28401c['valueNodes']) && _0x28401c['valueNodes']['forEach'](_0x42ab73 => {
    if (!_0x42ab73?.['nodeId'] || !_0x42ab73?.['fieldName']) {
      return;
    }
    const _0x197297 = [_0x42ab73["field"], ...(Array["isArray"](_0x42ab73["fallbackFields"]) ? _0x42ab73['fallbackFields'] : [])]['filter'](Boolean);
    let _0x214c4a = '';
    for (const _0x3a5ee3 of _0x197297) {
      const _0x26fac8 = getManifestPayloadPathValue(_0x37527c, _0x3a5ee3);
      if (_0x26fac8 !== undefined && _0x26fac8 !== null && String(_0x26fac8)["trim"]() !== '') {
        _0x214c4a = _0x26fac8;
        break;
      }
    }
    if (_0x214c4a === '') {
      _0x214c4a = _0x42ab73["defaultValue"] ?? '';
    }
    _0x214c4a = normalizeManifestValueNodeValue(_0x214c4a, _0x42ab73);
    _0x401259['push']({
      'nodeId': String(_0x42ab73["nodeId"]),
      'fieldName': String(_0x42ab73['fieldName']),
      'fieldValue': String(_0x214c4a),
      'description': _0x42ab73["description"] || String(_0x42ab73["fieldName"])
    });
  });
  if (_0x28401c["imageCountNode"]?.["nodeId"] && _0x28401c["imageCountNode"]?.["fieldName"]) {
    const _0x75f29 = Number(_0x28401c['imageCountNode']["offset"]) || 0x0;
    _0x401259["push"]({
      'nodeId': String(_0x28401c['imageCountNode']["nodeId"]),
      'fieldName': String(_0x28401c["imageCountNode"]["fieldName"]),
      'fieldValue': String(Math["max"](0x0, _0x57e4b9["length"] + _0x75f29)),
      'description': "入参多少张图片"
    });
  }
  return buildOpenApiImageWorkflowRequest({
    'executionManifest': _0x18f73d,
    'payload': _0x37527c,
    'apiKey': _0x1e4fd8,
    'nodeInfoList': _0x401259
  });
}
function normalizeVideoMattingMaskModeIndex(_0x55ddb1) {
  const _0x30983f = String(_0x55ddb1 || '')["trim"]();
  if (!_0x30983f || _0x30983f === '0') {
    return '0';
  }
  if (_0x30983f === '1') {
    return '1';
  }
  if (_0x30983f === '2') {
    return '2';
  }
  const _0x372db0 = _0x30983f["toLowerCase"]();
  if (_0x372db0 === 'sam3') {
    return '1';
  }
  if (_0x372db0 === "ma2" || _0x372db0 === 'matanyone2') {
    return '2';
  }
  return '0';
}
function buildRunningHubVideoResultExtractor() {
  return _0x16796b => {
    if (_0x16796b["status"] === "COMPLETED" && Array["isArray"](_0x16796b["results"])) {
      return _0x16796b["results"]["map"](_0xe98666 => _0xe98666["videoUrl"] || _0xe98666['url'])["filter"](Boolean);
    }
    return [];
  };
}
function buildOpenApiVideoWorkflowRequest({
  executionManifest: _0x12d1ae,
  payload: _0x1e6350,
  apiKey: _0x234386,
  nodeInfoList: _0x4631fd
}) {
  const _0x44aa02 = normalizeRunningHubInstanceType(_0x1e6350[_0x12d1ae['instanceType']?.["field"]]);
  const _0x3038fd = resolveRunningHubWorkflowResourceId(_0x12d1ae, _0x1e6350);
  return {
    'url': "/api/v2/proxy/image",
    'headers': {
      'Content-Type': "application/json"
    },
    'body': {
      'apiUrl': getRunningHubWorkflowBaseUrl(_0x1e6350) + "/openapi/v2/run/ai-app/" + _0x3038fd,
      'apiKey': _0x234386,
      'nodeInfoList': _0x4631fd,
      'instanceType': _0x44aa02,
      'usePersonalQueue': "false"
    },
    'isAsync': !![],
    'taskIdPath': _0x12d1ae["result"]?.["taskIdPath"] || "taskId",
    'adapterTrace': {
      'source': "manifest",
      'executionId': _0x12d1ae['id'],
      'modelId': _0x1e6350['model']
    },
    'pollUrlBuilder': () => getRunningHubWorkflowBaseUrl(_0x1e6350) + '/openapi/v2/query',
    'resultExtractor': buildRunningHubVideoResultExtractor()
  };
}
function buildTaskCreateVideoWorkflowRequest({
  executionManifest: _0x398ad1,
  payload: _0x1df646,
  apiKey: _0x4f0fe4,
  nodeInfoList: _0x46a83e
}) {
  const _0x9769ad = normalizeRunningHubInstanceType(_0x1df646[_0x398ad1["instanceType"]?.["field"]]);
  const _0x1364af = Number(_0x398ad1["extensions"]?.["taskCreate"]?.["retainSeconds"]);
  const _0x1590ae = (Array["isArray"](_0x46a83e) ? _0x46a83e : [])["map"](({
    nodeId: _0x3e3ccc,
    fieldName: _0x1d2c19,
    fieldValue: _0x3f75dc
  }) => ({
    'nodeId': _0x3e3ccc,
    'fieldName': _0x1d2c19,
    'fieldValue': _0x3f75dc
  }));
  return {
    'url': "/api/v2/runninghubwf/run",
    'apiUrl': getRunningHubWorkflowBaseUrl(_0x1df646) + '/task/openapi/create',
    'headers': {
      'Content-Type': "application/json"
    },
    'body': {
      'apiKey': _0x4f0fe4,
      'providerProfileId': getRunningHubWorkflowProfileId(_0x1df646) || "runninghub",
      'workflowId': resolveRunningHubWorkflowResourceId(_0x398ad1, _0x1df646),
      'addMetadata': ![],
      'nodeInfoList': _0x1590ae,
      'instanceType': _0x9769ad,
      'usePersonalQueue': "false",
      ...(Number['isFinite'](_0x1364af) && _0x1364af > 0x0 ? {
        'retainSeconds': _0x1364af
      } : {})
    },
    'isAsync': !![],
    'taskIdPath': _0x398ad1["result"]?.["taskIdPath"] || "taskId",
    'adapterTrace': {
      'source': 'manifest',
      'executionId': _0x398ad1['id'],
      'modelId': _0x1df646["model"]
    },
    'pollUrlBuilder': () => getRunningHubWorkflowBaseUrl(_0x1df646) + "/openapi/v2/query",
    'resultExtractor': buildRunningHubVideoResultExtractor()
  };
}
function pushManifestNode(_0x1531b7, _0x65e7f, _0x17f3e5, _0x176e3c = {}) {
  if (!_0x65e7f?.['nodeId'] || !_0x65e7f?.["fieldName"]) {
    return;
  }
  _0x1531b7['push']({
    'nodeId': String(_0x65e7f["nodeId"]),
    'fieldName': String(_0x176e3c["fieldName"] || _0x65e7f["fieldName"]),
    'fieldValue': _0x17f3e5 === null ? null : String(_0x17f3e5),
    ...(_0x65e7f['description'] || _0x176e3c["description"] ? {
      'description': _0x176e3c["description"] || _0x65e7f["description"]
    } : {})
  });
}
function getMappedValue(_0x5d87a6, _0xcc8210, _0x608c19 = '') {
  const _0x307bef = String(_0x5d87a6 ?? '')["trim"]();
  const _0x4e5418 = _0xcc8210?.["valueMap"] || {};
  if (_0x307bef && _0x4e5418[_0x307bef] !== undefined) {
    return _0x4e5418[_0x307bef];
  }
  if (_0x307bef && _0x4e5418[_0x307bef["toLowerCase"]()] !== undefined) {
    return _0x4e5418[_0x307bef["toLowerCase"]()];
  }
  return _0xcc8210?.["defaultValue"] ?? _0x608c19;
}
async function resolveRunningHubVideoInput(_0x340afb, _0x1eded4, {
  urlField = "videoUrl",
  fileField = "videoFile",
  missingMessage = "请接入源视频",
  uploadFailedMessage = "源视频上传失败"
} = {}) {
  let _0x5370a0 = '';
  const _0x2024bf = String(_0x340afb[urlField] || '')["trim"]();
  try {
    if (_0x2024bf) {
      const {
        processInputVideos: _0x1d975d
      } = await import('../videoUploadApi.js');
      const _0x3c4f2b = await _0x1d975d([_0x2024bf], _0x1eded4, {
        'strictUpload': !![],
        'apiUrl': getRunningHubWorkflowBaseUrl(_0x340afb)
      });
      if (_0x3c4f2b["length"] > 0x0) {
        _0x5370a0 = _0x3c4f2b[0x0];
      }
    } else {
      if (_0x340afb[fileField]) {
        const {
          uploadVideoToRunningHub: _0x4c0493
        } = await import("../videoUploadApi.js");
        _0x5370a0 = await _0x4c0493(_0x340afb[fileField], _0x1eded4, {
          'apiUrl': getRunningHubWorkflowBaseUrl(_0x340afb)
        });
      }
    }
  } catch (_0x4dbcf0) {
    throw createMediaUploadError(_0x4dbcf0, {
      'kind': 'video',
      'label': uploadFailedMessage
    });
  }
  if (!_0x5370a0) {
    if (!_0x2024bf && !_0x340afb[fileField]) {
      throw new Error(missingMessage);
    }
    throw createMediaUploadError(null, {
      'kind': "video",
      'label': uploadFailedMessage
    });
  }
  return _0x5370a0;
}
async function resolveRunningHubOptionalVideoInput(_0xc6e151, _0x5f5c2f, _0x163303) {
  const _0x207301 = String(_0xc6e151[_0x163303] || '')['trim']();
  if (!_0x207301) {
    return '';
  }
  const {
    processInputVideos: _0x1aa4a4
  } = await import("../videoUploadApi.js");
  const _0x2d37f4 = await _0x1aa4a4([_0x207301], _0x5f5c2f, {
    'strictUpload': !![],
    'apiUrl': getRunningHubWorkflowBaseUrl(_0xc6e151)
  });
  return String(_0x2d37f4?.[0x0] || '')["trim"]();
}
async function resolveRunningHubAudioInput(_0x286ffd, _0x1c901d, {
  urlField = "audioUrl",
  fileField = "audioFile",
  required = ![],
  missingMessage = "请接入音频"
} = {}) {
  let _0x1f1ea7 = '';
  const _0xe67a0e = String(_0x286ffd[urlField] || '')["trim"]();
  if (_0xe67a0e) {
    const {
      processInputAudios: _0x376532
    } = await import("../audioUploadApi.js");
    const _0x4a096e = await _0x376532([_0xe67a0e], _0x1c901d, {
      'apiUrl': getRunningHubWorkflowBaseUrl(_0x286ffd)
    });
    if (_0x4a096e["length"] > 0x0) {
      _0x1f1ea7 = _0x4a096e[0x0];
    }
  } else {
    if (_0x286ffd[fileField]) {
      const {
        uploadAudioToRunningHub: _0xa3ce48
      } = await import('../audioUploadApi.js');
      _0x1f1ea7 = await _0xa3ce48(_0x286ffd[fileField], _0x1c901d, {
        'apiUrl': getRunningHubWorkflowBaseUrl(_0x286ffd)
      });
    }
  }
  if (required && !_0x1f1ea7) {
    throw new Error(missingMessage);
  }
  return _0x1f1ea7;
}
async function resolveRunningHubFirstImageInput(_0x3d9f01, _0x1913cb, _0x30e2fb, {
  field = "inputUrls",
  required = ![],
  missingMessage = "请接入参考图",
  uploadFailedMessage = "参考图上传失败",
  compress = !![]
} = {}) {
  const _0x373070 = getManifestPayloadPathValue(_0x3d9f01, field);
  const _0x2d3c9f = Array["isArray"](_0x373070) ? _0x373070 : String(_0x373070 || '')["trim"]() ? [_0x373070] : [];
  if (!_0x2d3c9f['length']) {
    if (required) {
      throw new Error(missingMessage);
    }
    return '';
  }
  let _0x4a2592;
  try {
    _0x4a2592 = await uploadModelApiMediaInputs("image", _0x2d3c9f, _0x30e2fb, {
      'apiKey': _0x1913cb,
      'apiUrl': getRunningHubWorkflowBaseUrl(_0x3d9f01),
      'fallbackProvider': "runninghub",
      'strictUpload': !![],
      'uploadOptions': {
        'applyInputQualityProfile': compress
      }
    });
  } catch (_0x294280) {
    throw createMediaUploadError(_0x294280, {
      'kind': 'image',
      'label': uploadFailedMessage
    });
  }
  const _0x228aad = String(_0x4a2592?.[0x0] || '')["trim"]();
  if (!_0x228aad) {
    throw createMediaUploadError(null, {
      'kind': 'image',
      'label': uploadFailedMessage
    });
  }
  return _0x228aad;
}
async function uploadRunningHubMediaInputs(_0x54f002, _0x4f2b24, _0x5a5a04, _0x377e5a, _0x1beb85, {
  uploadFailedMessage = "RunningHUB 素材上传失败"
} = {}) {
  try {
    return await uploadModelApiMediaInputs(_0x54f002, _0x4f2b24, _0x1beb85, {
      'apiKey': _0x377e5a,
      'apiUrl': getRunningHubWorkflowBaseUrl(_0x5a5a04),
      'fallbackProvider': "runninghub",
      'strictUpload': !![]
    });
  } catch (_0x4625ee) {
    throw createMediaUploadError(_0x4625ee, {
      'kind': _0x54f002,
      'label': uploadFailedMessage
    });
  }
}
function getRunningHubWorkflowResolverHelpers() {
  return {
    'buildOpenApiVideoWorkflowRequest': buildOpenApiVideoWorkflowRequest,
    'buildTaskCreateVideoWorkflowRequest': buildTaskCreateVideoWorkflowRequest,
    'getMappedValue': getMappedValue,
    'getRunningHubWorkflowBaseUrl': getRunningHubWorkflowBaseUrl,
    'normalizeRhVideoFps': normalizeRhVideoFps,
    'normalizeRhVideoResolution': normalizeRhVideoResolution,
    'normalizeVideoMattingMaskModeIndex': normalizeVideoMattingMaskModeIndex,
    'pushManifestNode': pushManifestNode,
    'resolveRunningHubAudioInput': resolveRunningHubAudioInput,
    'resolveRunningHubFirstImageInput': resolveRunningHubFirstImageInput,
    'resolveRunningHubOptionalVideoInput': resolveRunningHubOptionalVideoInput,
    'resolveRunningHubVideoInput': resolveRunningHubVideoInput,
    'sourceVideoMissingMessage': RH_V54_SOURCE_VIDEO_MISSING_MESSAGE,
    'sourceVideoUploadFailedMessage': RH_V54_SOURCE_VIDEO_UPLOAD_FAILED_MESSAGE,
    'uploadRunningHubMediaInputs': uploadRunningHubMediaInputs
  };
}
async function buildVideoWorkflowRequestFromManifest({
  executionManifest: _0xb3a50f,
  modelManifest = null,
  payload: _0x5942f6,
  finalPrompt: _0x44ec48,
  apiKey: _0x3551e4,
  ctx: _0x23d548
}) {
  if (!_0xb3a50f || _0xb3a50f["adapterType"] !== "workflow") {
    return null;
  }
  const _0x244e77 = relaxCustomAiAppMediaNodeMappings(_0xb3a50f["mapping"] || {}, {
    'enabled': isImportedRunningHubAiAppManifest(modelManifest)
  });
  const _0x33f359 = String(_0xb3a50f["extensions"]?.["payloadResolver"] || '')["trim"]();
  if (_0x33f359) {
    const _0x16915b = getRunningHubWorkflowPayloadResolver(_0x33f359);
    if (!_0x16915b) {
      throw new Error("Unsupported RunningHub workflow payloadResolver: " + _0x33f359);
    }
    return _0x16915b({
      'executionManifest': _0xb3a50f,
      'payload': _0x5942f6,
      'finalPrompt': _0x44ec48,
      'apiKey': _0x3551e4,
      'ctx': _0x23d548,
      'helpers': getRunningHubWorkflowResolverHelpers()
    });
  }
  const _0x414de7 = await a26_0x54ed94({
    'mapping': _0x244e77,
    'payload': _0x5942f6,
    'finalPrompt': _0x44ec48,
    'sourceResolvers': {
      'imageInput': ({
        item: _0x1b83c9
      }) => resolveRunningHubFirstImageInput(_0x5942f6, _0x3551e4, _0x23d548, {
        'field': String(_0x1b83c9?.["field"] || "inputUrls")["trim"](),
        'required': _0x1b83c9?.["required"] === !![],
        'missingMessage': _0x1b83c9?.['missingMessage'] || "请接入参考图",
        'uploadFailedMessage': _0x1b83c9?.['uploadFailedMessage'] || '参考图上传失败',
        'compress': _0x1b83c9?.["compress"] !== ![]
      }),
      'videoInput': ({
        item: _0x10dd56
      }) => {
        const _0x15479d = String(_0x10dd56?.['urlField'] || _0x10dd56?.["field"] || 'videoUrl')["trim"]();
        const _0x327ff7 = String(_0x10dd56?.["fileField"] || "videoFile")['trim']();
        const _0x2875ad = String(_0x5942f6[_0x15479d] || '')["trim"]();
        const _0x33e5dc = _0x5942f6[_0x327ff7];
        if (!_0x10dd56?.["required"] && !_0x2875ad && !_0x33e5dc) {
          return '';
        }
        return resolveRunningHubVideoInput(_0x5942f6, _0x3551e4, {
          'urlField': _0x15479d,
          'fileField': _0x327ff7,
          'missingMessage': _0x10dd56?.["missingMessage"] || "请接入源视频",
          'uploadFailedMessage': _0x10dd56?.["uploadFailedMessage"] || "源视频上传失败"
        });
      },
      'audioInput': ({
        item: _0x3a335f
      }) => {
        const _0x3754f2 = String(_0x3a335f?.["urlField"] || _0x3a335f?.['field'] || "audioUrl")["trim"]();
        const _0x5c583d = String(_0x3a335f?.["fileField"] || "audioFile")["trim"]();
        const _0x1d58eb = String(_0x5942f6[_0x3754f2] || '')['trim']();
        const _0x164052 = _0x5942f6[_0x5c583d];
        if (!_0x3a335f?.["required"] && !_0x1d58eb && !_0x164052) {
          return '';
        }
        return resolveRunningHubAudioInput(_0x5942f6, _0x3551e4, {
          'urlField': _0x3754f2,
          'fileField': _0x5c583d,
          'required': _0x3a335f?.["required"] === !![],
          'missingMessage': _0x3a335f?.["missingMessage"] || "请接入音频"
        });
      }
    },
    'transforms': {
      'normalizeRhVideoFps': _0xea4e5 => normalizeRhVideoFps(_0xea4e5),
      'normalizeRhVideoResolution': (_0x32561a, _0x5de038) => normalizeRhVideoResolution(_0x32561a, Number["isFinite"](Number(_0x5de038["fallback"])) ? Number(_0x5de038['fallback']) : RH_MIN_VIDEO_RESOLUTION)
    }
  });
  if (!_0x414de7) {
    return null;
  }
  if (_0xb3a50f["submitMode"] === "openapi-v2-ai-app") {
    return buildOpenApiVideoWorkflowRequest({
      'executionManifest': _0xb3a50f,
      'payload': _0x5942f6,
      'apiKey': _0x3551e4,
      'nodeInfoList': _0x414de7
    });
  }
  if (_0xb3a50f["submitMode"] === "runninghub-task-create") {
    return buildTaskCreateVideoWorkflowRequest({
      'executionManifest': _0xb3a50f,
      'payload': _0x5942f6,
      'apiKey': _0x3551e4,
      'nodeInfoList': _0x414de7
    });
  }
  throw new Error("Unsupported RunningHub video workflow submitMode: " + _0xb3a50f['submitMode']);
}
export async function buildImageRequest(_0x2c859f, _0x369f40, _0x21b656) {
  if (!_0x2c859f["model"]) {
    throw new Error("未指定模型，无法发起图像生成请求");
  }
  const _0x55a4b9 = getRunningHubWorkflowProfileId(_0x2c859f);
  const _0x51fd43 = _0x21b656["getProviderConfig"](_0x55a4b9 || "runninghubwf");
  const _0x7f90bf = normalizeRunningHubModelApiProfileId(_0x55a4b9 || _0x51fd43?.["providerProfileId"]);
  const _0xa434e6 = _0x2c859f['apiKey'] || _0x51fd43["apiKey"];
  const _0x3ec30b = {
    ..._0x2c859f,
    'providerProfileId': _0x7f90bf,
    'rhProviderProfileId': _0x7f90bf,
    'runningHubApiUrl': resolveRunningHubModelApiBaseUrl(_0x7f90bf)
  };
  if (!_0xa434e6) {
    throw new Error("API Key 未配置，无法发起 RunningHUB 请求");
  }
  const _0x21ad9e = _0x21b656["processInputImagesPreserveOrder"] || _0x21b656["processInputImages"];
  const _0x2a1c89 = await _0x21ad9e(_0x3ec30b["inputUrls"], _0xa434e6, {
    'applyInputQualityProfile': !![],
    'provider': "runninghub",
    'strictUpload': !![],
    'apiUrl': _0x3ec30b["runningHubApiUrl"]
  });
  const _0x2ad96a = Array['isArray'](_0x2a1c89) ? _0x2a1c89["map"](_0x2a90de => String(_0x2a90de || '')["trim"]()) : [];
  const _0x1fd79a = resolveModelExecution(_0x2c859f["model"]);
  const _0xe9edc3 = await buildOpenApiAiAppWorkflowRequestFromManifest({
    'executionManifest': _0x1fd79a?.["executionManifest"],
    'modelManifest': _0x1fd79a?.["modelManifest"],
    'payload': _0x3ec30b,
    'finalPrompt': _0x369f40,
    'finalUrls': _0x2ad96a,
    'apiKey': _0xa434e6,
    'ctx': _0x21b656
  });
  if (_0xe9edc3) {
    return {
      ..._0xe9edc3,
      'providerProfileId': _0x7f90bf,
      'rhProviderProfileId': _0x7f90bf,
      'runningHubApiUrl': _0x3ec30b["runningHubApiUrl"]
    };
  }
  throw new Error("RunningHub workflow manifest missing: " + _0x2c859f["model"]);
}
export async function buildVideoRequest(_0xebacd7, _0x5c81c1, _0x3c7c49) {
  const _0x20c283 = getRunningHubWorkflowProfileId(_0xebacd7);
  const _0x5320ea = _0x3c7c49["getProviderConfig"](_0x20c283 || "runninghubwf");
  const _0xd1250b = normalizeRunningHubModelApiProfileId(_0x20c283 || _0x5320ea?.['providerProfileId']);
  const _0x38806f = _0xebacd7["apiKey"] || _0x5320ea["apiKey"];
  const _0x3e91dc = {
    ..._0xebacd7,
    'providerProfileId': _0xd1250b,
    'rhProviderProfileId': _0xd1250b,
    'runningHubApiUrl': resolveRunningHubModelApiBaseUrl(_0xd1250b)
  };
  if (!_0x38806f) {
    throw new Error("API Key 未配置，无法发起 RunningHUB 视频生成请求");
  }
  const _0x4f0c69 = resolveModelExecution(_0xebacd7["model"]);
  const _0x1336d4 = await buildVideoWorkflowRequestFromManifest({
    'executionManifest': _0x4f0c69?.['executionManifest'],
    'modelManifest': _0x4f0c69?.["modelManifest"],
    'payload': _0x3e91dc,
    'finalPrompt': _0x5c81c1,
    'apiKey': _0x38806f,
    'ctx': _0x3c7c49
  });
  if (_0x1336d4) {
    return {
      ..._0x1336d4,
      'providerProfileId': _0xd1250b,
      'rhProviderProfileId': _0xd1250b,
      'runningHubApiUrl': _0x3e91dc['runningHubApiUrl']
    };
  }
  throw new Error("RunningHub video workflow manifest missing: " + _0xebacd7["model"]);
}
export async function buildModelRequest(_0x207128, _0x3512ae, _0x167ba9) {
  const _0x1f197a = await buildImageRequestFromManifest(_0x207128, _0x3512ae, _0x167ba9, {
    'expectedProvider': "runninghub"
  });
  if (_0x1f197a) {
    return _0x1f197a;
  }
  throw new Error("RunningHub model API manifest missing: " + _0x207128["model"]);
}