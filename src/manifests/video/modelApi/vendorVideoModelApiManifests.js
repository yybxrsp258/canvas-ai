import { APIMART_VIDEO_MODELS } from './apimartVideoModelApiManifests.js';
import { BAILIAN_VIDEO_MODELS } from './bailianVideoModelApiManifests.js';
import { GRSAI_VIDEO_MODELS } from './grsaiVideoModelApiManifests.js';
import { MINIMAX_VIDEO_MODELS } from './minimaxVideoModelApiManifests.js';
import { RUNNINGHUB_HAILUO_H3_VIDEO_MODELS } from './runningHubHailuoH3VideoModelApiManifests.js';
import { RUNNINGHUB_VIDEO_MODELS } from './runningHubVideoModelApiManifests.js';
import { VOLCENGINE_VIDEO_MODELS } from './volcengineVideoModelApiManifests.js';
import { AGNES_VIDEO_MODELS } from './agnesVideoModelApiManifests.js';
import { getRunningHubModelApiProfileIds } from '../../../modules/runningHubProviderProfiles.js';
import { APIMART_VIDEO_RESPONSE_MAPPING, APIMART_VIDEO_TASK_POLLING, SEEDANCE_VIDEO_RATIO_POLICY, VIDEO_SIZE_RATIO_POLICY, createVideoExecutionManifest, createVideoModelApiManifest } from './vendorVideoModelApiShared.js';
const VENDOR_VIDEO_MODELS = Object["freeze"]([...BAILIAN_VIDEO_MODELS, ...GRSAI_VIDEO_MODELS, ...APIMART_VIDEO_MODELS, ...MINIMAX_VIDEO_MODELS, ...RUNNINGHUB_HAILUO_H3_VIDEO_MODELS, ...RUNNINGHUB_VIDEO_MODELS, ...VOLCENGINE_VIDEO_MODELS, ...AGNES_VIDEO_MODELS]);
function isSeedanceVideoManifest(_0x406f07) {
  return _0x406f07?.["endpointMode"] === "seedance-video-generation" || _0x406f07?.['executionExtensions']?.['bodyResolver'] === "volcengineSeedance2Video";
}
function getVideoManifestRatioPolicy(_0x21ea56) {
  if (_0x21ea56?.["ratioPolicy"]) {
    return _0x21ea56['ratioPolicy'];
  }
  return isSeedanceVideoManifest(_0x21ea56) ? SEEDANCE_VIDEO_RATIO_POLICY : VIDEO_SIZE_RATIO_POLICY;
}
export const vendorVideoModelApiModelManifests = Object["freeze"](VENDOR_VIDEO_MODELS["map"](_0x153d6b => createVideoModelApiManifest({
  'modelId': _0x153d6b['modelId'],
  'executionId': _0x153d6b["executionId"],
  'displayName': _0x153d6b["displayName"],
  'provider': _0x153d6b["provider"] || "apimart",
  'vip': _0x153d6b["vip"] === !![],
  'aliases': _0x153d6b["aliases"],
  'icon': _0x153d6b["icon"] || 'AM',
  'description': _0x153d6b["description"],
  'fields': _0x153d6b['fields'],
  'inputSlots': _0x153d6b['inputSlots'],
  'prompt': _0x153d6b['prompt'],
  'help': _0x153d6b['help'],
  'footerPlacementOrder': _0x153d6b["footerPlacementOrder"],
  'extensions': Object["freeze"]({
    ...(_0x153d6b["extensions"] || {}),
    ...(_0x153d6b["provider"] === 'runninghub' ? {
      'providerProfiles': getRunningHubModelApiProfileIds(_0x153d6b["modelId"])
    } : {}),
    'ratioPolicy': getVideoManifestRatioPolicy(_0x153d6b)
  }),
  'ratioPolicy': getVideoManifestRatioPolicy(_0x153d6b)
})));
export const vendorVideoModelApiExecutionManifests = Object['freeze'](VENDOR_VIDEO_MODELS["map"](_0x27aa9d => createVideoExecutionManifest({
  'id': _0x27aa9d['executionId'],
  'model': _0x27aa9d["model"],
  'provider': _0x27aa9d["provider"] || "apimart",
  'endpoint': _0x27aa9d["endpoint"] || '/v1/videos/generations',
  'endpointMode': _0x27aa9d['endpointMode'],
  'extensions': _0x27aa9d['executionExtensions'],
  'bodyMapping': _0x27aa9d['bodyMapping'],
  'modeModels': _0x27aa9d["modeModels"],
  'responseMapping': _0x27aa9d["responseMapping"] || APIMART_VIDEO_RESPONSE_MAPPING,
  'taskPolling': Object["prototype"]["hasOwnProperty"]["call"](_0x27aa9d, "taskPolling") ? _0x27aa9d["taskPolling"] : APIMART_VIDEO_TASK_POLLING,
  'resultTaskIdPath': _0x27aa9d["resultTaskIdPath"] || "task_id"
})));