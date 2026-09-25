import { saveImage } from '../src/modules/storage.js';
import { compressImage } from '../src/modules/imageUtils.js';
import { prepareImageGenerationMedia } from './imageResultMedia.js';
import { buildCanvasLocalImageFields } from '../src/services/canvasMediaLocalService.js';
import * as a45_0x230de8 from './adapters/RunningHubAdapter.js';
import * as a45_0x82794f from './adapters/ComfyUiAdapter.js';
import { buildImageRequestFromManifest, resolveManifestTaskPolling } from './adapters/ModelApiManifestNormalizer.js';
import { resolveMappedImageResponseValues, resolveMappedResponseValue } from './adapters/modelApiMappingEngine.js';
import { ensureConfig, getProviderConfig } from './configApi.js';
import { applyCameraAngleToPrompt } from './cameraPromptApi.js';
import { processInputImages, processInputImagesPreserveOrder } from './imageUploadApi.js';
import { uploadInputToComfyUi } from './comfyUiUploadApi.js';
import { normalizeApimartBaseUrl } from './apimartUploadApi.js';
import { uploadInputsToVolcengineFiles } from './volcengineFileApi.js';
import { cancelRunningHubTask } from './runninghubTaskApi.js';
import { runDreaminaImageGeneration, runDreaminaImageUpscaleGeneration, buildDreaminaImageUpscaleSubmitPayload, pollDreaminaUntilDone, normalizeDreaminaTaskSnapshot } from './dreaminaGenApi.js';
import { buildOpenAiCliImageSubmitRequest, runOpenAiCliImageGeneration } from './openAiCliImageGenApi.js';
import { localPathToUrl, normalizeLocalPath, pickResultLocalPath } from '../src/utils/localMediaPath.js';
import { isModelApiModel, resolveModelExecution, resolveModelProvider } from '../src/manifests/index.js';
import { requester } from './requester.js';
import { runTaskSingleFlight } from './taskSingleFlight.js';
import { resolveOutputWithLocalization } from './outputLocalization.js';
import { buildRunningHubModelApiUrl, getRunningHubTaskProviderProfileId, normalizeRunningHubModelApiProfileId, resolveRunningHubModelApiProfileId } from '../src/modules/runningHubProviderProfiles.js';
import { isRunningHubWorkflowQueueTarget, resolveRunningHubWorkflowQueueConfig, runWithRunningHubWorkflowQueue } from './runningHubWorkflowQueue.js';
import { hasRunningHubWorkflowPollingTimedOut, resolveRunningHubWorkflowPollingPolicy } from './runningHubWorkflowPollingPolicy.js';
import { ApiError, ErrorType, parseError, parseTaskError, parseNetworkError } from './errors/index.js';
const GENERATION_TIMEOUT = 0xa * 0x3c * 0x3e8;
const MAX_MANIFEST_GENERATION_TIMEOUT = 0x3c * 0x3c * 0x3e8;
export async function cancelRunningHubImageTask(_0x4bd390 = {}) {
  return cancelRunningHubTask(_0x4bd390);
}
const GENERATION_RETRIES = 0x0;
const GENERATION_RETRY_DELAY = 0x3e8;
const APIMART_MIDJOURNEY_MODEL_ID = "apimart/midjourney";
const APIMART_MIDJOURNEY_UPSCALE_RESPONSE_MAPPING = Object["freeze"]({
  'taskIdPath': Object["freeze"](['data[].task_id', "task_id", 'taskId']),
  'statusPath': "status",
  'errorPath': "error",
  'resultPaths': Object["freeze"](["image_urls[]", "image_url", "grid_image_url", 'data.image_urls[]', 'data.image_url', "data.grid_image_url", "data.result.images[].url", "result.images[].url", "data[].url", "results[].url", "results[].imageUrl", "url"])
});
function resolveGenerationRequestTimeout(_0x128697) {
  const _0x154310 = Number(_0x128697?.["requestTimeoutMs"]);
  if (!Number["isFinite"](_0x154310) || _0x154310 <= 0x0) {
    return GENERATION_TIMEOUT;
  }
  return Math["min"](MAX_MANIFEST_GENERATION_TIMEOUT, Math["max"](0x7530, Math['trunc'](_0x154310)));
}
function buildApimartMidjourneyTaskPolling(_0x48ea0c = '') {
  const _0x2d9788 = normalizeApimartBaseUrl(_0x48ea0c);
  return {
    'mode': "task-proxy",
    'method': "GET",
    'urlTemplate': _0x2d9788 + "/v1/midjourney/{taskId}",
    'headersMode': "bearer"
  };
}
function getProviderId(_0x502416) {
  return resolveModelProvider(_0x502416?.["model"], _0x502416?.["provider"]);
}
function resolveModelApiExecutionForPayload(_0x4d065d, _0x4625ba) {
  const _0x12d961 = String(_0x4625ba || '')["trim"]()["toLowerCase"]();
  const _0x4a61c6 = String(_0x4d065d?.["model"] || '')["trim"]();
  if (!_0x4a61c6) {
    return null;
  }
  const _0x4a0972 = resolveModelExecution(_0x4a61c6, {
    'providerHint': _0x12d961
  });
  const _0x3edc9e = _0x4a0972?.['executionManifest'];
  if (!_0x3edc9e || _0x3edc9e["adapterType"] !== 'modelApi' || _0x3edc9e["kind"] !== "image") {
    return null;
  }
  return _0x3edc9e;
}
function resolveImageTaskRuntimeOptions(_0x235424 = {}, _0x4f6550 = '', _0x361e2a = {}) {
  const _0x286613 = String(_0x235424?.["model"] || '')["trim"]();
  if (!_0x286613) {
    return _0x361e2a || {};
  }
  const _0x5586f8 = String(_0x4f6550 || getProviderId(_0x235424) || '')['trim']()["toLowerCase"]();
  const _0x2dd4e9 = resolveModelExecution(_0x286613, {
    'providerHint': _0x5586f8
  });
  const _0x38c209 = _0x2dd4e9?.['executionManifest'];
  if (!_0x38c209 || _0x38c209['adapterType'] !== "modelApi" || _0x38c209["kind"] !== 'image') {
    return _0x361e2a || {};
  }
  const _0xc098c3 = String(_0x38c209["provider"] || _0x5586f8)['trim']()["toLowerCase"]();
  const _0x351be7 = getProviderConfig(_0xc098c3);
  const _0x555db1 = resolveManifestTaskPolling(_0xc098c3, _0x351be7, _0x38c209, {
    'modelManifest': _0x2dd4e9?.["modelManifest"] || null
  });
  return {
    ...(_0x361e2a || {}),
    ...(!_0x361e2a?.['responseMapping'] && _0x38c209["responseMapping"] ? {
      'responseMapping': _0x38c209['responseMapping']
    } : {}),
    ...(!_0x361e2a?.["taskPolling"] && _0x555db1 ? {
      'taskPolling': _0x555db1
    } : {})
  };
}
function shouldSubmitProviderBatchOnce(_0x488e4b, _0x67271a, _0x564eeb) {
  if (!(Number["parseInt"](_0x564eeb, 0xa) > 0x1)) {
    return ![];
  }
  const _0x2ecff4 = resolveModelApiExecutionForPayload(_0x488e4b, _0x67271a);
  const _0x2b1912 = _0x2ecff4?.["extensions"]?.["batchSubmitMode"];
  if (_0x2b1912 === 'providerN') {
    return !![];
  }
  if (!_0x2b1912 || typeof _0x2b1912 !== "object" || Array["isArray"](_0x2b1912)) {
    return ![];
  }
  if (String(_0x2b1912["type"] || '')["trim"]() !== "providerN") {
    return ![];
  }
  if (_0x2b1912["requiresInputImages"] === !![]) {
    const _0x38946a = [_0x488e4b?.["inputUrls"], _0x488e4b?.['image_urls'], _0x488e4b?.["imageUrls"], _0x488e4b?.["images"]];
    const _0x28ef4d = _0x38946a["some"](_0x43556e => Array["isArray"](_0x43556e) ? _0x43556e['some'](_0x3f39b6 => String(_0x3f39b6 || '')["trim"]()) : String(_0x43556e || '')["trim"]());
    if (!_0x28ef4d) {
      return ![];
    }
  }
  const _0x33ac85 = String(_0x2b1912["field"] || '')['trim']();
  if (!_0x33ac85) {
    return !![];
  }
  const _0x2f2903 = Array["isArray"](_0x2b1912["values"]) ? _0x2b1912["values"] : [_0x2b1912["value"]];
  const _0x4c57b1 = _0x2f2903['map'](_0x46da74 => String(_0x46da74 ?? '')["trim"]()['toLowerCase']())['filter'](Boolean);
  if (_0x4c57b1["length"] === 0x0) {
    return !![];
  }
  const _0x4b6b8d = String(_0x488e4b?.[_0x33ac85] ?? '')['trim']()["toLowerCase"]();
  return _0x4c57b1['includes'](_0x4b6b8d);
}
function resolveImageGenerationBatchSize(_0x3d02b3, _0x4d9976) {
  const _0x1ca795 = parseInt(_0x3d02b3?.["batchSize"], 0xa) || 0x1;
  const _0x35aa53 = resolveModelApiExecutionForPayload(_0x3d02b3, _0x4d9976);
  const _0x1ab591 = Number['parseInt'](_0x35aa53?.["extensions"]?.["fixedBatchSize"], 0xa);
  if (Number['isFinite'](_0x1ab591) && _0x1ab591 >= 0x1) {
    return _0x1ab591;
  }
  const _0x44c448 = Number["parseInt"](_0x35aa53?.["extensions"]?.["maxBatchSize"], 0xa);
  if (Number["isFinite"](_0x44c448) && _0x44c448 >= 0x1) {
    return Math["min"](_0x1ca795, _0x44c448);
  }
  return _0x1ca795;
}
function createImageBatchAttemptContext(_0x13f08c) {
  const _0x2c631b = Number["parseInt"](_0x13f08c, 0xa);
  if (!Number["isFinite"](_0x2c631b) || _0x2c631b <= 0x1) {
    return null;
  }
  return {
    '__aicBatchSize': _0x2c631b,
    '__aicBatchSeedNonce': Math["floor"](Math['random']() * 0x3b9aca00)
  };
}
function buildImageBatchAttemptPayload(_0x388ec9, _0x455b53, _0xce997) {
  if (!_0x455b53) {
    return _0x388ec9;
  }
  return {
    ..._0x388ec9,
    ..._0x455b53,
    '__aicBatchIndex': _0xce997
  };
}
function normalizeDreaminaImageGenerateNum(_0x471433 = {}) {
  const _0x156cfb = _0x471433?.["generateNum"] ?? _0x471433?.['generate_num'] ?? _0x471433?.["batchSize"] ?? 0x1;
  const _0x4d227f = Number['parseInt'](_0x156cfb, 0xa);
  if (!Number["isFinite"](_0x4d227f)) {
    return 0x1;
  }
  return Math["max"](0x1, Math["min"](0xa, _0x4d227f));
}
function isRunningHubOpenApiV2AiApp(_0x211074) {
  const _0x531909 = String(_0x211074?.["model"] || '');
  const _0xdf93ae = resolveModelExecution(_0x531909)?.['executionManifest'];
  if (_0xdf93ae?.["adapterType"] === "workflow" && _0xdf93ae?.['submitMode'] === 'openapi-v2-ai-app' && _0xdf93ae?.['queryMode'] === "openapi-v2-query") {
    return !![];
  }
  return ![];
}
function getDreaminaModelVersion(_0x425f79, _0x2581d6 = null) {
  const _0x33b76f = String(_0x2581d6?.["extensions"]?.["dreaminaImage"]?.["modelVersion"] || '')['trim']();
  if (_0x33b76f) {
    return _0x33b76f;
  }
  const _0x52235d = String(_0x425f79?.["modelVersion"] || '')["trim"]();
  if (_0x52235d) {
    return _0x52235d;
  }
  const _0x132baa = String(_0x425f79?.['model'] || '')['trim']();
  if (resolveModelProvider(_0x132baa, _0x425f79?.["provider"]) !== "dreamina") {
    return '';
  }
  const _0x5cfc5c = (_0x132baa["split"]('/')[0x1] || '')["trim"]();
  return /^(4\.0|4\.1|4\.5|5\.0)$/['test'](_0x5cfc5c) ? _0x5cfc5c : '';
}
function getDreaminaAspectRatio(_0x15426e, _0x1512bf) {
  const _0x4a61cc = String(_0x15426e?.['resolvedRatioLabel'] || '')['trim']();
  if (_0x4a61cc) {
    return _0x4a61cc;
  }
  const _0x407661 = String(_0x15426e?.["aspectRatio"] || '')['trim']();
  if (!_0x407661) {
    return '';
  }
  if (_0x407661 === '自适应' || _0x407661 === "auto") {
    return _0x1512bf ? '' : "1:1";
  }
  return _0x407661;
}
function buildDreaminaImageSubmitRequest(_0x2589fd, _0x33a80b, _0x4e27b5 = null) {
  const _0x2cdfe8 = Array["isArray"](_0x2589fd["inputUrls"]) ? _0x2589fd["inputUrls"]["filter"](Boolean) : [];
  const _0x5e5043 = _0x2cdfe8['length'] > 0x0;
  const _0x56289f = getDreaminaModelVersion(_0x2589fd, _0x4e27b5);
  const _0x1f0a2b = getDreaminaAspectRatio(_0x2589fd, _0x5e5043);
  const _0x19b3ef = String(_0x2589fd["imageSize"] || '')["trim"]()['toLowerCase']();
  const _0x172d00 = normalizeDreaminaImageGenerateNum(_0x2589fd);
  const _0x133485 = {
    'prompt': _0x33a80b
  };
  if (_0x1f0a2b) {
    _0x133485["ratio"] = _0x1f0a2b;
  }
  if (_0x19b3ef) {
    _0x133485["resolutionType"] = _0x19b3ef;
  }
  if (_0x56289f) {
    _0x133485["modelVersion"] = _0x56289f;
  }
  if (_0x172d00 > 0x1) {
    _0x133485["generateNum"] = _0x172d00;
  }
  if (_0x2cdfe8["length"] > 0x0) {
    return {
      'url': "/api/v2/dreamina/image2image",
      'headers': {
        'Content-Type': 'application/json'
      },
      'body': {
        ..._0x133485,
        'images': _0x2cdfe8
      }
    };
  }
  return {
    'url': '/api/v2/dreamina/text2image',
    'headers': {
      'Content-Type': "application/json"
    },
    'body': _0x133485
  };
}
function buildDreaminaImageUpscaleSubmitRequest(_0x27ee64) {
  return {
    'url': '/api/v2/dreamina/image_upscale',
    'headers': {
      'Content-Type': "application/json"
    },
    'body': buildDreaminaImageUpscaleSubmitPayload(_0x27ee64)
  };
}
const LOCAL_IMAGE_RUNTIME_HANDLERS = Object["freeze"]({
  'dreaminaImage': Object["freeze"]({
    'buildSubmitRequest': ({
      payload: _0x131ff0,
      finalPrompt: _0x46ae91,
      executionManifest: _0x503519
    }) => buildDreaminaImageSubmitRequest(_0x131ff0, _0x46ae91, _0x503519),
    'run': ({
      payload: _0x328574,
      options: _0x39c68b,
      batchSize: _0x53294b,
      executionManifest: _0x25b31e
    }) => {
      const _0x1d152e = normalizeDreaminaImageGenerateNum({
        ..._0x328574,
        'batchSize': _0x53294b
      });
      const _0x438c70 = getDreaminaModelVersion(_0x328574, _0x25b31e);
      return runDreaminaImageGeneration({
        ..._0x328574,
        ...(_0x438c70 ? {
          'modelVersion': _0x438c70
        } : {}),
        'generateNum': _0x1d152e
      }, _0x39c68b);
    }
  }),
  'dreaminaImageUpscale': Object["freeze"]({
    'buildSubmitRequest': ({
      payload: _0x103a70
    }) => buildDreaminaImageUpscaleSubmitRequest(_0x103a70),
    'run': ({
      payload: _0x43e4cf,
      options: _0x40f711
    }) => runDreaminaImageUpscaleGeneration(_0x43e4cf, _0x40f711)
  }),
  'openAiCliImage': Object["freeze"]({
    'buildSubmitRequest': ({
      payload: _0x2c9afa,
      finalPrompt: _0x82d7a2,
      executionManifest: _0x47a565
    }) => buildOpenAiCliImageSubmitRequest(_0x2c9afa, _0x82d7a2, _0x47a565),
    'run': ({
      payload: _0x7b2aa1,
      executionManifest: _0x5abee1
    }) => runOpenAiCliImageGeneration(_0x7b2aa1, _0x5abee1)
  })
});
function getLocalImageRuntimeHandler(_0x44248b) {
  if (_0x44248b?.['adapterType'] !== "localRuntime") {
    return null;
  }
  const _0xb27633 = String(_0x44248b?.["runtime"] || '')["trim"]();
  return LOCAL_IMAGE_RUNTIME_HANDLERS[_0xb27633] || null;
}
function getImageExecution(_0x255113, _0x5d8e5e) {
  return resolveModelExecution(_0x255113?.['model'], {
    'providerHint': _0x5d8e5e
  });
}
function createMissingImageManifestError(_0x1719b7, _0x4d1f4a) {
  const _0x6a3d3e = String(_0x1719b7?.["model"] || '')["trim"]() || '(empty)';
  const _0xed000a = String(_0x4d1f4a || '')["trim"]()["toLowerCase"]();
  if (_0xed000a === "runninghubwf") {
    return new Error("RunningHub workflow manifest missing: " + _0x6a3d3e + "; RunningHUB request requires a manifest");
  }
  if (_0xed000a === "runninghub") {
    return new Error("RunningHub model API manifest missing: " + _0x6a3d3e);
  }
  const _0x4bb7ae = {
    'agnes': "Agnes AI",
    'apimart': "APIMart",
    'grsai': "GRSAI",
    'ppio': 'PPIO',
    'volcengine': "Volcengine"
  };
  const _0x1ca245 = _0x4bb7ae[_0xed000a];
  if (_0x1ca245) {
    return new Error(_0x1ca245 + " image model API manifest missing: " + _0x6a3d3e);
  }
  return new Error("Image model API manifest missing: " + _0x6a3d3e);
}
function collectDeepMediaUrls(_0x54ef38, _0x4ecf13 = 0x0, _0x4b725d = new WeakSet()) {
  if (_0x54ef38 === undefined || _0x54ef38 === null || _0x4ecf13 > 0x8) {
    return [];
  }
  if (typeof _0x54ef38 === "string") {
    const _0x14604f = _0x54ef38["trim"]();
    return /^https?:\/\//i["test"](_0x14604f) ? [_0x14604f] : [];
  }
  if (Array["isArray"](_0x54ef38)) {
    return _0x54ef38['flatMap'](_0x5195b8 => collectDeepMediaUrls(_0x5195b8, _0x4ecf13 + 0x1, _0x4b725d));
  }
  if (typeof _0x54ef38 !== "object") {
    return [];
  }
  if (_0x4b725d['has'](_0x54ef38)) {
    return [];
  }
  _0x4b725d['add'](_0x54ef38);
  const _0x2c41be = ["url", 'imageUrl', "image_url", "fileUrl", "file_url", "downloadUrl", "download_url"];
  const _0x29c57f = [];
  for (const _0xe96268 of _0x2c41be) {
    _0x29c57f["push"](...collectDeepMediaUrls(_0x54ef38[_0xe96268], _0x4ecf13 + 0x1, _0x4b725d));
  }
  const _0x4cc435 = ["results", "result", "images", "image", 'outputs', "output", "data"];
  for (const _0x367850 of _0x4cc435) {
    _0x29c57f['push'](...collectDeepMediaUrls(_0x54ef38[_0x367850], _0x4ecf13 + 0x1, _0x4b725d));
  }
  return Array['from'](new Set(_0x29c57f["filter"](Boolean)));
}
function extractImageUrls(_0x288fd5, _0x1e331f = null) {
  const _0x2ceca0 = resolveMappedImageResponseValues(_0x288fd5, _0x1e331f);
  if (_0x2ceca0["length"] > 0x0) {
    return _0x2ceca0;
  }
  const _0x2a0179 = [];
  if (_0x288fd5["data"]?.['result']?.["images"] && Array['isArray'](_0x288fd5['data']["result"]["images"])) {
    _0x2a0179["push"](..._0x288fd5["data"]["result"]["images"]['map'](_0x1589ac => Array["isArray"](_0x1589ac["url"]) ? _0x1589ac["url"][0x0] : _0x1589ac['url']));
  } else {
    if (_0x288fd5["result"]?.["images"] && Array["isArray"](_0x288fd5["result"]["images"])) {
      _0x2a0179['push'](..._0x288fd5["result"]["images"]["map"](_0x449f74 => Array["isArray"](_0x449f74["url"]) ? _0x449f74["url"][0x0] : _0x449f74["url"]));
    } else {
      if (_0x288fd5["status"] === 'succeeded' && _0x288fd5["results"]) {
        _0x2a0179["push"](..._0x288fd5["results"]["map"](_0x158ea2 => _0x158ea2["url"]));
      } else {
        if (_0x288fd5["data"]?.[0x0]?.["url"]) {
          _0x2a0179["push"](..._0x288fd5["data"]["map"](_0x232a5f => _0x232a5f["url"]));
        } else {
          if (_0x288fd5["data"]?.[0x0]?.["fileUrl"]) {
            _0x2a0179["push"](..._0x288fd5["data"]['map'](_0x1b2328 => _0x1b2328["fileUrl"]));
          } else {
            if (_0x288fd5['data']?.["results"]) {
              _0x2a0179["push"](..._0x288fd5["data"]["results"]["map"](_0x4fbde3 => _0x4fbde3["url"]));
            } else {
              if (_0x288fd5['data']?.[0x0]?.["image"]) {
                _0x2a0179['push'](..._0x288fd5["data"]["map"](_0xe35d34 => _0xe35d34["image"]));
              } else {
                if (Array["isArray"](_0x288fd5["images"])) {
                  _0x2a0179["push"](..._0x288fd5['images']["map"](_0x267211 => typeof _0x267211 === "string" ? _0x267211 : _0x267211['url'] || _0x267211['image_url']));
                } else {
                  if (Array["isArray"](_0x288fd5["image_urls"])) {
                    _0x2a0179["push"](..._0x288fd5['image_urls']["map"](_0xbe76a8 => typeof _0xbe76a8 === "string" ? _0xbe76a8 : _0xbe76a8['url']));
                  } else {
                    if (Array["isArray"](_0x288fd5["results"])) {
                      _0x2a0179["push"](..._0x288fd5['results']["map"](_0x298f2e => _0x298f2e["url"] || _0x298f2e["imageUrl"] || _0x298f2e["image_url"] || _0x298f2e["image"]));
                    } else {
                      (_0x288fd5["url"] || _0x288fd5['image_url'] || _0x288fd5["fileUrl"] || _0x288fd5["file_url"] || _0x288fd5['image']) && _0x2a0179["push"](_0x288fd5["url"] || _0x288fd5["image_url"] || _0x288fd5["fileUrl"] || _0x288fd5["file_url"] || _0x288fd5["image"]);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  _0x2a0179["length"] === 0x0 && _0x2a0179["push"](...collectDeepMediaUrls(_0x288fd5));
  return Array["from"](new Set(_0x2a0179["filter"](Boolean)));
}
function firstNonEmptyText(..._0x1df5c0) {
  for (const _0x2ff0c0 of _0x1df5c0) {
    let _0x3771b4 = '';
    _0x2ff0c0 && typeof _0x2ff0c0 === "object" ? _0x3771b4 = firstNonEmptyText(_0x2ff0c0['message'], _0x2ff0c0["errorMessage"], _0x2ff0c0["error_message"], _0x2ff0c0["reason"], _0x2ff0c0["detail"], _0x2ff0c0["details"], _0x2ff0c0['msg']) || (() => {
      try {
        return JSON["stringify"](_0x2ff0c0);
      } catch {
        return '';
      }
    })() : _0x3771b4 = String(_0x2ff0c0 || '')["trim"]();
    if (_0x3771b4) {
      return _0x3771b4;
    }
  }
  return '';
}
function pickImageUrlFromResultItem(_0x87df99) {
  if (typeof _0x87df99 === "string") {
    const _0x123b0e = _0x87df99["trim"]();
    return /^https?:\/\//i["test"](_0x123b0e) ? _0x123b0e : '';
  }
  if (!_0x87df99 || typeof _0x87df99 !== 'object') {
    return '';
  }
  for (const _0x3c5cdd of ["url", "imageUrl", "image_url", 'fileUrl', "file_url", 'downloadUrl', "download_url", "image"]) {
    const _0x47cb86 = _0x87df99[_0x3c5cdd];
    const _0x54483e = Array['isArray'](_0x47cb86) ? _0x47cb86[0x0] : _0x47cb86;
    const _0x1a5e35 = String(_0x54483e || '')["trim"]();
    if (/^https?:\/\//i["test"](_0x1a5e35)) {
      return _0x1a5e35;
    }
  }
  return collectDeepMediaUrls(_0x87df99)[0x0] || '';
}
function pickImageResultError(_0x216317) {
  if (!_0x216317 || typeof _0x216317 !== "object") {
    return '';
  }
  const _0x3e4be4 = firstNonEmptyText(_0x216317["error"], _0x216317["errorMessage"], _0x216317["message"], _0x216317["failure_reason"], _0x216317["failReason"], _0x216317["reason"], _0x216317["statusReason"], _0x216317?.['data']?.["error"], _0x216317?.["data"]?.["errorMessage"], _0x216317?.["data"]?.["message"], _0x216317?.["data"]?.["failure_reason"]);
  if (_0x3e4be4) {
    return _0x3e4be4;
  }
  const _0xf4ab3d = String(_0x216317['status'] || _0x216317["taskStatus"] || _0x216317["task_status"] || _0x216317["state"] || '')["trim"]()["toLowerCase"]();
  if (['failed', "fail", 'error', 'rejected', 'blocked', "filtered", "content_filtered", "content-filtered", "sensitive", "violation"]["includes"](_0xf4ab3d)) {
    return '生成失败';
  }
  return '';
}
function getArrayAtPath(_0x32c7f3, _0x46d68f) {
  const _0x5ce48a = String(_0x46d68f || '')["split"]('.')["filter"](Boolean)["reduce"]((_0x4ed650, _0x485c49) => {
    if (_0x4ed650 === undefined || _0x4ed650 === null) {
      return undefined;
    }
    return _0x4ed650[_0x485c49];
  }, _0x32c7f3);
  return Array["isArray"](_0x5ce48a) ? _0x5ce48a : null;
}
function collectImageResultRecordArrays(_0x1ddf79) {
  const _0xc7fab0 = [];
  const _0x483771 = _0x5ea32d => {
    if (!Array['isArray'](_0x5ea32d) || _0xc7fab0["includes"](_0x5ea32d)) {
      return;
    }
    _0xc7fab0["push"](_0x5ea32d);
  };
  for (const _0x323aad of ["data.result.images", "result.images", 'results', "data.results", "data", "images", "image_urls", "outputs", "output.images", "output.results"]) {
    _0x483771(getArrayAtPath(_0x1ddf79, _0x323aad));
  }
  return _0xc7fab0;
}
function normalizeImageResultRecordItem(_0x57c343) {
  const _0x5e9ea8 = pickImageUrlFromResultItem(_0x57c343);
  const _0x3a407c = _0x5e9ea8 ? '' : pickImageResultError(_0x57c343);
  if (!_0x5e9ea8 && !_0x3a407c) {
    return null;
  }
  return {
    'sourceUrl': _0x5e9ea8,
    'error': _0x3a407c,
    'fullData': _0x57c343 && typeof _0x57c343 === "object" ? _0x57c343 : undefined
  };
}
function cloneRecordMetadata(_0x2ec553) {
  return _0x2ec553?.["metadata"] && typeof _0x2ec553["metadata"] === 'object' ? {
    ..._0x2ec553['metadata']
  } : {};
}
function firstApimartMidjourneySourceValue(..._0x3f527a) {
  for (const _0x33b6f2 of _0x3f527a) {
    if (_0x33b6f2 === !![] || _0x33b6f2 === ![]) {
      return _0x33b6f2;
    }
    const _0x1bc613 = String(_0x33b6f2 ?? '')["trim"]();
    if (_0x1bc613) {
      return _0x1bc613;
    }
  }
  return '';
}
function normalizeApimartMidjourneySourceBoolean(_0x371f97) {
  if (_0x371f97 === !![] || _0x371f97 === ![]) {
    return _0x371f97;
  }
  const _0x7d96bf = String(_0x371f97 ?? '')["trim"]()['toLowerCase']();
  if (!_0x7d96bf) {
    return ![];
  }
  return _0x7d96bf === "true" || _0x7d96bf === '1' || _0x7d96bf === 'yes';
}
function resolveApimartMidjourneySourceMetadata(_0x2c926f = {}) {
  const _0x1b3a13 = _0x2c926f?.["generationParams"] && typeof _0x2c926f['generationParams'] === "object" && !Array["isArray"](_0x2c926f["generationParams"]) ? _0x2c926f["generationParams"] : {};
  const _0x9ef8a9 = String(firstApimartMidjourneySourceValue(_0x2c926f?.["mjModel"], _0x2c926f?.["midjourneyModel"], _0x2c926f?.['version'], _0x1b3a13["mjModel"], _0x1b3a13['midjourneyModel'], _0x1b3a13["version"]))['trim']();
  const _0xde6368 = String(firstApimartMidjourneySourceValue(_0x2c926f?.["speed"], _0x1b3a13["speed"]))["trim"]()['toLowerCase']();
  const _0x9cc132 = String(firstApimartMidjourneySourceValue(_0x2c926f?.['prompt'], _0x1b3a13['prompt']))['trim']();
  const _0x2bc347 = String(firstApimartMidjourneySourceValue(_0x2c926f?.["action"], _0x2c926f?.["mjAction"], _0x1b3a13["action"], _0x1b3a13["mjAction"]))["trim"]()["toUpperCase"]();
  const _0x34f2b1 = firstApimartMidjourneySourceValue(_0x2c926f?.['hd'], _0x2c926f?.["isHd"], _0x1b3a13['hd'], _0x1b3a13["isHd"]);
  const _0x2e8180 = {
    ...(_0x9ef8a9 ? {
      'mjModel': _0x9ef8a9
    } : {}),
    ...(_0xde6368 === 'relax' || _0xde6368 === 'fast' || _0xde6368 === "turbo" ? {
      'speed': _0xde6368
    } : {}),
    ...(_0x9cc132 ? {
      'prompt': _0x9cc132
    } : {}),
    ...(_0x2bc347 ? {
      'action': _0x2bc347
    } : {})
  };
  _0x34f2b1 !== '' && (_0x2e8180['hd'] = normalizeApimartMidjourneySourceBoolean(_0x34f2b1));
  return _0x2e8180;
}
function isApimartMidjourneyResponseMapping(_0x4f4cad = null) {
  const _0x159d94 = Array["isArray"](_0x4f4cad?.["resultPaths"]) ? _0x4f4cad["resultPaths"] : [];
  return _0x159d94["includes"]('image_urls[]') && _0x159d94['includes']("grid_image_url");
}
function normalizeApimartMidjourneyButtons(_0xee5553) {
  if (!Array['isArray'](_0xee5553)) {
    return [];
  }
  return _0xee5553["map"](_0x3a6c26 => {
    if (!_0x3a6c26 || typeof _0x3a6c26 !== "object") {
      return null;
    }
    const _0x2556ce = String(_0x3a6c26["customId"] || _0x3a6c26["custom_id"] || _0x3a6c26["customID"] || _0x3a6c26['id'] || '')['trim']();
    const _0x26b7a5 = String(_0x3a6c26["label"] || _0x3a6c26["name"] || _0x3a6c26['text'] || _0x3a6c26['emoji'] || '')["trim"]();
    const _0x2040a0 = {
      ...(_0x2556ce ? {
        'customId': _0x2556ce
      } : {}),
      ...(_0x26b7a5 ? {
        'label': _0x26b7a5
      } : {})
    };
    return Object['keys'](_0x2040a0)["length"] > 0x0 ? _0x2040a0 : null;
  })["filter"](Boolean);
}
function extractApimartMidjourneyImageRecords(_0x2b11ae, _0x103d39 = null, _0x35ce06 = {}) {
  if (!isApimartMidjourneyResponseMapping(_0x103d39)) {
    return [];
  }
  const _0x461237 = _0x2b11ae?.["data"] && typeof _0x2b11ae["data"] === 'object' && !Array["isArray"](_0x2b11ae["data"]) ? {
    ..._0x2b11ae,
    ..._0x2b11ae["data"]
  } : _0x2b11ae;
  const _0x547241 = Array["isArray"](_0x461237?.["image_urls"]) && _0x461237["image_urls"]['length'] > 0x0 ? _0x461237["image_urls"] : String(_0x461237?.["image_url"] || '')["trim"]() ? [_0x461237['image_url']] : [];
  if (_0x547241["length"] === 0x0) {
    return [];
  }
  const _0x3418cc = String(resolveApimartTaskIdStrict(_0x461237) || resolveAsyncImageTaskId(_0x461237, _0x103d39) || _0x461237?.['id'] || '')["trim"]();
  const _0x5dde75 = String(_0x461237?.["grid_image_url"] || '')["trim"]();
  const _0x1a6f88 = String(_0x461237?.['action'] || '')["trim"]();
  const _0x29efb4 = normalizeApimartMidjourneyButtons(_0x461237?.['buttons']);
  const _0x3a0db4 = resolveApimartMidjourneySourceMetadata(_0x35ce06);
  const _0x5897fb = _0x1a6f88 || _0x3a0db4["action"] || '';
  return _0x547241['map']((_0x2ee75e, _0x1da196) => {
    const _0x7a0536 = String(_0x2ee75e || '')["trim"]();
    if (!_0x7a0536) {
      return null;
    }
    return {
      'sourceUrl': _0x7a0536,
      'error': '',
      'metadata': {
        'provider': "apimart",
        'model': APIMART_MIDJOURNEY_MODEL_ID,
        'apimartMidjourney': {
          'taskId': _0x3418cc,
          'index': _0x1da196 + 0x1,
          ..._0x3a0db4,
          ...(_0x5dde75 ? {
            'gridImageUrl': _0x5dde75
          } : {}),
          ...(_0x5897fb ? {
            'action': _0x5897fb
          } : {}),
          ...(_0x29efb4["length"] > 0x0 ? {
            'buttons': _0x29efb4
          } : {})
        }
      }
    };
  })["filter"](Boolean);
}
function extractImageResultRecords(_0x4df9a6, _0x302353 = null, _0x588244 = {}) {
  const _0x330892 = extractApimartMidjourneyImageRecords(_0x4df9a6, _0x302353, _0x588244?.["apimartMidjourneySource"]);
  if (_0x330892["length"] > 0x0) {
    return _0x330892;
  }
  for (const _0x4c6a30 of collectImageResultRecordArrays(_0x4df9a6)) {
    const _0x4512f4 = _0x4c6a30["flatMap"](_0x42a90c => Array["isArray"](_0x42a90c?.["url"]) && _0x42a90c["url"]['length'] > 0x0 ? _0x42a90c['url']['map'](_0x6fa8cb => ({
      ..._0x42a90c,
      'url': _0x6fa8cb
    })) : [_0x42a90c])["map"](_0x1778ef => normalizeImageResultRecordItem(_0x1778ef))["filter"](Boolean);
    if (_0x4512f4['length'] > 0x0) {
      return _0x4512f4;
    }
  }
  const _0x13543f = resolveMappedImageResponseValues(_0x4df9a6, _0x302353);
  if (_0x13543f["length"] > 0x0) {
    return _0x13543f["map"](_0x4dd8b7 => ({
      'sourceUrl': _0x4dd8b7,
      'error': ''
    }));
  }
  return extractImageUrls(_0x4df9a6, _0x302353)["map"](_0x19c982 => ({
    'sourceUrl': _0x19c982,
    'error': ''
  }));
}
function hasImageResultOutput(_0x21fc06, _0x220475 = null) {
  return extractImageResultRecords(_0x21fc06, _0x220475)['some'](_0x1fbc03 => String(_0x1fbc03?.["sourceUrl"] || '')['trim']());
}
export async function buildGenerateImageRequest(_0x443911) {
  await ensureConfig();
  const _0x5321c6 = applyCameraAngleToPrompt(_0x443911["prompt"], _0x443911['cameraAngle']);
  const _0x4e88e6 = getProviderId(_0x443911 || {});
  const _0x3d77e3 = getImageExecution(_0x443911, _0x4e88e6);
  const _0x1b3edd = _0x3d77e3?.["executionManifest"];
  const _0x2e2242 = _0x3d77e3?.['modelManifest'];
  const _0x4b51b8 = getLocalImageRuntimeHandler(_0x1b3edd);
  if (_0x4b51b8) {
    return _0x4b51b8["buildSubmitRequest"]({
      'payload': _0x443911,
      'finalPrompt': _0x5321c6,
      'executionManifest': _0x1b3edd
    });
  }
  const _0x30f424 = {
    'getProviderConfig': getProviderConfig,
    'processInputImages': processInputImages,
    'processInputImagesPreserveOrder': processInputImagesPreserveOrder,
    'loadInputImageBlob': _0x4766c1 => requester({
      'url': _0x4766c1,
      'method': 'GET',
      'provider': "remote",
      'buildUrl': ![],
      'responseType': "blob"
    }),
    'uploadInputToComfyUi': uploadInputToComfyUi,
    'uploadInputsToVolcengineFiles': uploadInputsToVolcengineFiles
  };
  if (_0x1b3edd?.["adapterType"] === "modelApi") {
    const _0x276f61 = await buildImageRequestFromManifest(_0x443911, _0x5321c6, _0x30f424, {
      'expectedProvider': _0x2e2242?.["provider"] || _0x4e88e6
    });
    if (_0x276f61) {
      return _0x276f61;
    }
    throw new Error((_0x2e2242?.["provider"] || _0x4e88e6) + " image model API manifest missing: " + _0x443911["model"]);
  }
  if (_0x1b3edd?.['adapterType'] === 'workflow') {
    if (_0x2e2242?.['provider'] === "comfyui" || _0x4e88e6 === "comfyui") {
      return a45_0x82794f["buildImageRequest"](_0x443911, _0x5321c6, _0x30f424);
    }
    return a45_0x230de8["buildImageRequest"](_0x443911, _0x5321c6, _0x30f424);
  }
  throw createMissingImageManifestError(_0x443911, _0x4e88e6);
}
function parseResponseData(_0x415dec) {
  const _0x2682a1 = _0x415dec["trim"]()['replace'](/^data:\s*/, '');
  try {
    return JSON["parse"](_0x2682a1);
  } catch {
    const _0x5c6faa = extractSseJsonSnapshots(_0x415dec);
    if (_0x5c6faa["length"] > 0x0) {
      for (const _0x28dfd9 of _0x5c6faa) {
        if (resolveAsyncImageTaskId(_0x28dfd9)) {
          return _0x28dfd9;
        }
      }
      return _0x5c6faa[_0x5c6faa["length"] - 0x1];
    }
    throw new ApiError({
      'type': 'PARSE_ERROR',
      'message': "无法解析服务端响应",
      'retryable': ![]
    });
  }
}
function extractSseJsonSnapshots(_0x1e6a93) {
  const _0x4af01b = String(_0x1e6a93 || '')['split']('\x0a')["filter"](_0x8176a0 => _0x8176a0["trim"]()["startsWith"]("data:"));
  if (_0x4af01b["length"] === 0x0) {
    return [];
  }
  const _0x892ef1 = [];
  for (const _0x4af868 of _0x4af01b) {
    const _0x1b7bad = String(_0x4af868 || '')["trim"]()["replace"](/^data:\s*/, '')["trim"]();
    if (!_0x1b7bad || _0x1b7bad === "[DONE]") {
      continue;
    }
    try {
      _0x892ef1["push"](JSON["parse"](_0x1b7bad));
    } catch {}
  }
  return _0x892ef1;
}
function resolveDirectOutputSnapshotFromRawText(_0x295d62) {
  const _0x1cd269 = extractSseJsonSnapshots(_0x295d62);
  for (let _0x4239f0 = _0x1cd269['length'] - 0x1; _0x4239f0 >= 0x0; _0x4239f0 -= 0x1) {
    const _0x2a16d8 = _0x1cd269[_0x4239f0];
    if (hasImageResultOutput(_0x2a16d8)) {
      return _0x2a16d8;
    }
  }
  return null;
}
function extractTaskIdFromRawText(_0x3ffa72) {
  const _0x2f3e45 = String(_0x3ffa72 || '');
  if (!_0x2f3e45) {
    return '';
  }
  const _0x4f77be = [/"task_id"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /"taskId"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /"taskid"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /"submit_id"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /"submitId"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /"job_id"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /"jobId"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /"request_id"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /"requestId"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /"task"\s*:\s*"?([a-zA-Z0-9._:-]{8,})"?/i, /"job"\s*:\s*"?([a-zA-Z0-9._:-]{8,})"?/i, /"request"\s*:\s*"?([a-zA-Z0-9._:-]{8,})"?/i, /"submit"\s*:\s*"?([a-zA-Z0-9._:-]{8,})"?/i, /"id"\s*:\s*"([^"]+)"/i, /\btask[_-]?id\b\s*[:=]\s*["']?([a-zA-Z0-9._:-]+)["']?/i, /\bsubmit[_-]?id\b\s*[:=]\s*["']?([a-zA-Z0-9._:-]+)["']?/i, /\bjob[_-]?id\b\s*[:=]\s*["']?([a-zA-Z0-9._:-]+)["']?/i, /\brequest[_-]?id\b\s*[:=]\s*["']?([a-zA-Z0-9._:-]+)["']?/i, /(?:\?|&)(?:task_id|taskId|taskid|job_id|request_id)=([a-zA-Z0-9._:-]+)/i, /\bid\b\s*[:=]\s*["']?([a-zA-Z0-9._:-]{8,})["']?/i];
  for (const _0x34d023 of _0x4f77be) {
    const _0xdb948c = _0x2f3e45["match"](_0x34d023);
    const _0x7f879e = String(_0xdb948c?.[0x1] || '')["trim"]();
    if (_0x7f879e) {
      return _0x7f879e;
    }
  }
  return '';
}
function extractRunningHubTaskIdFromRawText(_0x499663) {
  const _0x2d981e = String(_0x499663 || '');
  if (!_0x2d981e) {
    return '';
  }
  const _0x1a7390 = [/"task_id"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /"taskId"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /"taskid"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /\btask[_-]?id\b\s*[:=]\s*["']?([a-zA-Z0-9._:-]+)["']?/i, /(?:\?|&)(?:task_id|taskId|taskid)=([a-zA-Z0-9._:-]+)/i];
  for (const _0x3c88e1 of _0x1a7390) {
    const _0x4e2b9e = _0x2d981e["match"](_0x3c88e1);
    const _0x3aec95 = String(_0x4e2b9e?.[0x1] || '')['replace'](/,/g, '')["trim"]();
    if (_0x3aec95) {
      return _0x3aec95;
    }
  }
  return '';
}
function extractTaskIdFromResponseHeaders(_0x56f766) {
  if (!_0x56f766 || typeof _0x56f766['get'] !== "function") {
    return '';
  }
  const _0x3b5793 = ["x-task-id", 'x-taskid', "x-request-id", "x-requestid", 'x-job-id', "x-jobid", 'task-id', "taskid", "request-id", "requestid", 'job-id', "jobid"];
  for (const _0x3a9ecd of _0x3b5793) {
    const _0x5c40de = String(_0x56f766['get'](_0x3a9ecd) || '')["trim"]();
    if (_0x5c40de) {
      return _0x5c40de;
    }
  }
  if (typeof _0x56f766["forEach"] === 'function') {
    let _0x1809c8 = '';
    _0x56f766["forEach"]((_0x2f7462, _0xaeb49) => {
      if (_0x1809c8) {
        return;
      }
      const _0x3f51a9 = String(_0xaeb49 || '')["trim"]()['toLowerCase']();
      const _0x533191 = String(_0x2f7462 || '')['trim']();
      if (!_0x533191) {
        return;
      }
      (_0x3f51a9["includes"]('task') && _0x3f51a9["includes"]('id') || _0x3f51a9["includes"]('job') && _0x3f51a9["includes"]('id') || _0x3f51a9['includes']("request") && _0x3f51a9["includes"]('id') || _0x3f51a9["includes"]('submit') && _0x3f51a9["includes"]('id')) && (_0x1809c8 = _0x533191);
    });
    if (_0x1809c8) {
      return _0x1809c8;
    }
  }
  return '';
}
function normalizeTaskIdValue(_0x3e01a4) {
  return String(_0x3e01a4 ?? '')["replace"](/,/g, '')["trim"]();
}
function resolveRunningHubTaskId(_0x588bbe, _0x105a6c, _0x59a7dc) {
  const _0x22fb3c = extractRunningHubTaskIdFromRawText(_0x105a6c);
  if (_0x22fb3c) {
    return _0x22fb3c;
  }
  const _0x419201 = Array["isArray"](_0x588bbe?.['data']) ? _0x588bbe["data"][0x0] : _0x588bbe?.["data"] && typeof _0x588bbe['data'] === "object" ? _0x588bbe['data'] : null;
  const _0x44804f = Array["isArray"](_0x588bbe?.["results"]) ? _0x588bbe['results'][0x0] : _0x588bbe?.['results'] && typeof _0x588bbe["results"] === "object" ? _0x588bbe["results"] : null;
  const _0x15fc55 = _0x588bbe?.["result"] && typeof _0x588bbe['result'] === "object" ? _0x588bbe["result"] : null;
  const _0x163ffb = _0x588bbe?.['output'] && typeof _0x588bbe["output"] === "object" ? _0x588bbe["output"] : null;
  const _0x416853 = _0x588bbe?.["response"] && typeof _0x588bbe["response"] === "object" ? _0x588bbe["response"] : null;
  const _0x1264eb = [_0x588bbe?.["taskId"], _0x588bbe?.["task_id"], _0x588bbe?.['data']?.["taskId"], _0x588bbe?.["data"]?.["task_id"], _0x419201?.["taskId"], _0x419201?.['task_id'], _0x15fc55?.["taskId"], _0x15fc55?.["task_id"], _0x163ffb?.['taskId'], _0x163ffb?.["task_id"], _0x416853?.["taskId"], _0x416853?.["task_id"], _0x44804f?.["taskId"], _0x44804f?.["task_id"]];
  for (const _0x4aef8c of _0x1264eb) {
    const _0x463a2d = normalizeTaskIdValue(_0x4aef8c);
    if (_0x463a2d) {
      return _0x463a2d;
    }
  }
  return normalizeTaskIdValue(extractTaskIdFromResponseHeaders(_0x59a7dc));
}
function looksLikeTaskToken(_0x42bef6) {
  const _0xc39a8e = String(_0x42bef6 ?? '')["trim"]();
  if (!_0xc39a8e) {
    return ![];
  }
  if (_0xc39a8e['length'] < 0x8) {
    return ![];
  }
  const _0x399e5a = _0xc39a8e["toLowerCase"]();
  if (_0x399e5a === "pending" || _0x399e5a === "running" || _0x399e5a === 'success' || _0x399e5a === "failed" || _0x399e5a === 'queued' || _0x399e5a === "submitted") {
    return ![];
  }
  return /^[a-zA-Z0-9._:-]+$/["test"](_0xc39a8e);
}
function resolveAsyncImageTaskIdLoose(_0x4c1eb0) {
  if (!_0x4c1eb0 || typeof _0x4c1eb0 !== "object") {
    return '';
  }
  const _0x1abac4 = [_0x4c1eb0?.["data"], _0x4c1eb0?.["task"], _0x4c1eb0?.["job"], _0x4c1eb0?.["request"], _0x4c1eb0?.["submit"], _0x4c1eb0?.["payload"]?.["task"], _0x4c1eb0?.["payload"]?.["task_id"], _0x4c1eb0?.["payload"]?.["taskId"]];
  for (const _0x115a43 of _0x1abac4) {
    if (typeof _0x115a43 === 'string' || typeof _0x115a43 === "number") {
      const _0x1746fa = String(_0x115a43)['trim']();
      if (looksLikeTaskToken(_0x1746fa)) {
        return _0x1746fa;
      }
    }
  }
  const _0x12fb12 = findFirstDeepValueByKeyPattern(_0x4c1eb0, /^(task|job|request|submit|task_?id|job_?id|request_?id|submit_?id)$/i);
  if (looksLikeTaskToken(_0x12fb12)) {
    return _0x12fb12;
  }
  return '';
}
function findFirstDeepValueByKeyPattern(_0x1d4dac, _0x454809, _0x26dd54 = 0x8) {
  if (!_0x1d4dac || typeof _0x1d4dac !== 'object') {
    return '';
  }
  const _0x565596 = new WeakSet();
  const _0x8a465e = [{
    'value': _0x1d4dac,
    'depth': 0x0
  }];
  while (_0x8a465e["length"] > 0x0) {
    const {
      value: _0x1c486a,
      depth: _0x25e2c5
    } = _0x8a465e["shift"]();
    if (!_0x1c486a || typeof _0x1c486a !== 'object') {
      continue;
    }
    if (_0x565596["has"](_0x1c486a)) {
      continue;
    }
    _0x565596["add"](_0x1c486a);
    if (_0x25e2c5 > _0x26dd54) {
      continue;
    }
    const _0x16f566 = Array['isArray'](_0x1c486a) ? _0x1c486a["map"]((_0x4dd7b6, _0x1dfd0f) => [String(_0x1dfd0f), _0x4dd7b6]) : Object["entries"](_0x1c486a);
    for (const [_0x49e065, _0x659e64] of _0x16f566) {
      const _0x7b9b15 = String(_0x49e065 || '')['trim']()["toLowerCase"]();
      if (_0x454809['test'](_0x7b9b15)) {
        const _0x242c9d = String(_0x659e64 ?? '')['trim']();
        if (_0x242c9d) {
          return _0x242c9d;
        }
      }
      _0x659e64 && typeof _0x659e64 === "object" && _0x8a465e['push']({
        'value': _0x659e64,
        'depth': _0x25e2c5 + 0x1
      });
    }
  }
  return '';
}
function extractTaskStatusFromRawText(_0x3ec416) {
  const _0x2a3545 = String(_0x3ec416 || '');
  if (!_0x2a3545) {
    return '';
  }
  const _0x44ec85 = [/"status"\s*:\s*"([^"]+)"/i, /"taskStatus"\s*:\s*"([^"]+)"/i, /"task_status"\s*:\s*"([^"]+)"/i, /"phase"\s*:\s*"([^"]+)"/i, /"state"\s*:\s*"([^"]+)"/i, /\bstatus\b\s*[:=]\s*["']?([a-zA-Z_]+)["']?/i, /\bphase\b\s*[:=]\s*["']?([a-zA-Z_]+)["']?/i, /\bstate\b\s*[:=]\s*["']?([a-zA-Z_]+)["']?/i];
  for (const _0x40698f of _0x44ec85) {
    const _0xec6e0e = _0x2a3545["match"](_0x40698f);
    const _0x4537fa = String(_0xec6e0e?.[0x1] || '')["trim"]();
    if (_0x4537fa) {
      return _0x4537fa["toLowerCase"]();
    }
  }
  return '';
}
function resolveAsyncImageTaskId(_0x4d3362, _0x276bf7 = null) {
  const _0x987598 = resolveMappedResponseValue(_0x4d3362, _0x276bf7?.["taskIdPath"]);
  if (_0x987598) {
    return _0x987598;
  }
  const _0x2b8cca = Array["isArray"](_0x4d3362?.["data"]) ? _0x4d3362["data"][0x0] : _0x4d3362?.["data"] && typeof _0x4d3362["data"] === "object" ? _0x4d3362["data"] : null;
  const _0x237995 = Array['isArray'](_0x4d3362?.['results']) ? _0x4d3362['results'][0x0] : _0x4d3362?.["results"] && typeof _0x4d3362["results"] === "object" ? _0x4d3362['results'] : null;
  const _0x46fa4e = _0x4d3362?.['result'] && typeof _0x4d3362['result'] === "object" ? _0x4d3362["result"] : null;
  const _0x5a9ebd = _0x4d3362?.['output'] && typeof _0x4d3362['output'] === "object" ? _0x4d3362["output"] : null;
  const _0x2336d9 = _0x4d3362?.["response"] && typeof _0x4d3362["response"] === "object" ? _0x4d3362["response"] : null;
  const _0x54099e = _0x2b8cca?.['task_id'] || _0x2b8cca?.['taskId'] || _0x2b8cca?.['id'] || _0x46fa4e?.["task_id"] || _0x46fa4e?.["taskId"] || _0x46fa4e?.['id'] || _0x5a9ebd?.["task_id"] || _0x5a9ebd?.['taskId'] || _0x5a9ebd?.['id'] || _0x2336d9?.["task_id"] || _0x2336d9?.["taskId"] || _0x2336d9?.['id'] || _0x4d3362?.["task_id"] || _0x4d3362?.["taskId"] || _0x4d3362?.['data']?.['task_id'] || _0x4d3362?.["data"]?.["taskId"] || _0x4d3362?.['data']?.['id'] || _0x4d3362?.['id'] || _0x237995?.["task_id"] || _0x237995?.['taskId'] || _0x237995?.['id'] || findFirstDeepValueByKeyPattern(_0x4d3362, /^(task_?id|taskid|request_?id|requestid)$/i) || findFirstDeepValueByKeyPattern(_0x4d3362, /^id$/i) || '';
  return String(_0x54099e || '')['trim']();
}
function resolveApimartTaskIdStrict(_0x38e05c) {
  const _0x2de610 = Array['isArray'](_0x38e05c?.['data']) ? _0x38e05c["data"][0x0] : _0x38e05c?.["data"] && typeof _0x38e05c["data"] === 'object' ? _0x38e05c["data"] : null;
  const _0x551ace = Array["isArray"](_0x38e05c?.["results"]) ? _0x38e05c["results"][0x0] : _0x38e05c?.["results"] && typeof _0x38e05c["results"] === "object" ? _0x38e05c["results"] : null;
  const _0x4481b7 = _0x38e05c?.['result'] && typeof _0x38e05c['result'] === "object" ? _0x38e05c['result'] : null;
  const _0x17f2df = _0x38e05c?.["output"] && typeof _0x38e05c['output'] === "object" ? _0x38e05c['output'] : null;
  const _0x4fcf4d = _0x38e05c?.["response"] && typeof _0x38e05c["response"] === "object" ? _0x38e05c["response"] : null;
  const _0x54f8a8 = _0x2de610?.["task_id"] || _0x2de610?.["taskId"] || _0x4481b7?.['task_id'] || _0x4481b7?.["taskId"] || _0x17f2df?.['task_id'] || _0x17f2df?.["taskId"] || _0x4fcf4d?.["task_id"] || _0x4fcf4d?.['taskId'] || _0x38e05c?.['task_id'] || _0x38e05c?.['taskId'] || _0x38e05c?.["data"]?.["task_id"] || _0x38e05c?.["data"]?.['taskId'] || _0x551ace?.['task_id'] || _0x551ace?.["taskId"] || findFirstDeepValueByKeyPattern(_0x38e05c, /^(task_?id|taskid)$/i) || '';
  return String(_0x54f8a8 || '')["trim"]();
}
function collectApimartFallbackTaskIdCandidates(_0x5adffa) {
  const _0x2b22ea = [];
  const _0x757782 = _0x2864d4 => {
    const _0xa166e7 = String(_0x2864d4 || '')['trim']();
    if (!_0xa166e7 || _0x2b22ea['includes'](_0xa166e7)) {
      return;
    }
    _0x2b22ea['push'](_0xa166e7);
  };
  const _0x51a12e = Array['isArray'](_0x5adffa?.["data"]) ? _0x5adffa["data"][0x0] : _0x5adffa?.['data'] && typeof _0x5adffa['data'] === "object" ? _0x5adffa["data"] : null;
  const _0xe6730 = Array['isArray'](_0x5adffa?.['results']) ? _0x5adffa["results"][0x0] : _0x5adffa?.['results'] && typeof _0x5adffa["results"] === "object" ? _0x5adffa["results"] : null;
  const _0x98a531 = _0x5adffa?.["result"] && typeof _0x5adffa["result"] === "object" ? _0x5adffa['result'] : null;
  const _0x3cfb90 = _0x5adffa?.['output'] && typeof _0x5adffa["output"] === 'object' ? _0x5adffa["output"] : null;
  const _0x16a4cc = _0x5adffa?.["response"] && typeof _0x5adffa["response"] === 'object' ? _0x5adffa["response"] : null;
  _0x757782(_0x51a12e?.['id']);
  _0x757782(_0x98a531?.['id']);
  _0x757782(_0x3cfb90?.['id']);
  _0x757782(_0x16a4cc?.['id']);
  _0x757782(_0xe6730?.['id']);
  _0x757782(_0x5adffa?.["data"]?.['id']);
  _0x757782(_0x5adffa?.['id']);
  return _0x2b22ea;
}
function extractApimartTaskIdFromRawText(_0x23ddc3) {
  const _0x5d029d = String(_0x23ddc3 || '');
  if (!_0x5d029d) {
    return '';
  }
  const _0x172a9b = [/"task_id"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /"taskId"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /"taskid"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /\btask[_-]?id\b\s*[:=]\s*["']?([a-zA-Z0-9._:-]+)["']?/i, /(?:\?|&)task_id=([a-zA-Z0-9._:-]+)/i];
  for (const _0x41c38a of _0x172a9b) {
    const _0x53a005 = _0x5d029d["match"](_0x41c38a);
    const _0x15101f = String(_0x53a005?.[0x1] || '')["trim"]();
    if (_0x15101f) {
      return _0x15101f;
    }
  }
  return '';
}
function buildApimartTaskStatusUrl(_0x420be2, _0x3cb0e5 = null, _0x4f4f04 = '') {
  const _0xf0f264 = String(_0x420be2 || '')['trim']();
  const _0x44eac6 = buildManifestPollCandidate(_0xf0f264, _0x3cb0e5);
  if (_0x44eac6?.['url']) {
    return _0x44eac6["url"];
  }
  const _0x3b8e4e = normalizeApimartBaseUrl(_0x4f4f04);
  return _0x3b8e4e + "/v1/tasks/" + encodeURIComponent(_0xf0f264) + "?language=zh";
}
async function probeApimartTaskIdCandidate(_0x1e57c4, _0x1ba01d, _0x1db6f8 = {}) {
  const _0x871195 = String(_0x1e57c4 || '')["trim"]();
  if (!_0x871195) {
    return '';
  }
  const _0xec5caa = getProviderConfig("apimart");
  const _0x521246 = String(_0x1ba01d?.["apiKey"] || _0xec5caa?.["apiKey"] || '')["trim"]();
  if (!_0x521246) {
    return '';
  }
  try {
    const _0xa6e8ff = await requester({
      'url': '/api/v2/proxy/task?apiUrl=' + encodeURIComponent(buildApimartTaskStatusUrl(_0x871195, _0x1db6f8?.["taskPolling"], _0xec5caa?.['apiUrl'])),
      'method': 'GET',
      'headers': {
        'Authorization': "Bearer " + _0x521246
      },
      'provider': "apimart",
      'timeout': 0x7530,
      'signal': _0x1db6f8?.['signal']
    });
    const _0x1eccce = normalizeTaskSnapshotPayload(_0xa6e8ff);
    const _0x472838 = _0x1eccce && typeof _0x1eccce === "object" && _0x1eccce["data"] && typeof _0x1eccce["data"] === "object" && !Array["isArray"](_0x1eccce["data"]);
    const _0x276b60 = _0x472838 ? {
      ..._0x1eccce,
      ..._0x1eccce['data']
    } : normalizeTaskSnapshotPayload(_0xa6e8ff?.["data"] || _0xa6e8ff);
    const _0x5c184c = parseTaskError("apimart", _0x276b60);
    if (_0x5c184c) {
      return '';
    }
    return _0x871195;
  } catch {
    return '';
  }
}
async function resolveApimartTaskIdByProbe(_0x24c9c5, _0x237646, _0x1dd94b = {}) {
  const _0x468caf = collectApimartFallbackTaskIdCandidates(_0x24c9c5);
  for (const _0x7edce of _0x468caf) {
    const _0x110405 = await probeApimartTaskIdCandidate(_0x7edce, _0x237646, _0x1dd94b);
    if (_0x110405) {
      return _0x110405;
    }
  }
  return '';
}
function resolveAsyncImageTaskStatus(_0x2a4f41) {
  const _0x3b577e = Array["isArray"](_0x2a4f41?.["data"]) ? _0x2a4f41["data"][0x0] : _0x2a4f41?.["data"] && typeof _0x2a4f41["data"] === 'object' ? _0x2a4f41["data"] : null;
  const _0x1b2b88 = Array["isArray"](_0x2a4f41?.['results']) ? _0x2a4f41["results"][0x0] : _0x2a4f41?.['results'] && typeof _0x2a4f41['results'] === "object" ? _0x2a4f41["results"] : null;
  const _0x149bbf = _0x2a4f41?.["result"] && typeof _0x2a4f41["result"] === "object" ? _0x2a4f41["result"] : null;
  const _0x5a51e0 = _0x2a4f41?.["output"] && typeof _0x2a4f41["output"] === 'object' ? _0x2a4f41["output"] : null;
  const _0x5875de = _0x2a4f41?.['response'] && typeof _0x2a4f41["response"] === "object" ? _0x2a4f41['response'] : null;
  return String(_0x3b577e?.["status"] || _0x2a4f41?.["status"] || _0x2a4f41?.["taskStatus"] || _0x2a4f41?.["task_status"] || _0x2a4f41?.["data"]?.["status"] || _0x149bbf?.["status"] || _0x149bbf?.["taskStatus"] || _0x149bbf?.["task_status"] || _0x5a51e0?.['status'] || _0x5a51e0?.["taskStatus"] || _0x5a51e0?.["task_status"] || _0x5875de?.["status"] || _0x5875de?.["taskStatus"] || _0x5875de?.["task_status"] || _0x1b2b88?.['status'] || _0x2a4f41?.["state"] || _0x2a4f41?.['phase'] || findFirstDeepValueByKeyPattern(_0x2a4f41, /^(task_?status|taskstatus|status|state|phase)$/i) || '')["trim"]()["toLowerCase"]();
}
function normalizeTaskSnapshotPayload(_0x2059b1) {
  if (_0x2059b1 && typeof _0x2059b1 === "object") {
    return _0x2059b1;
  }
  const _0x195f6d = String(_0x2059b1 || '')["trim"]();
  if (!_0x195f6d) {
    return {};
  }
  try {
    return parseResponseData(_0x195f6d);
  } catch {
    try {
      return JSON["parse"](_0x195f6d);
    } catch {
      return {
        'rawText': _0x195f6d
      };
    }
  }
}
function isAsyncTaskTerminalStatus(_0x56c0b6) {
  const _0x2c97c0 = String(_0x56c0b6 || '')["trim"]()["toLowerCase"]();
  return ["success", "succeeded", 'completed', "complete", "finished", "finish", "done", 'failed', 'failure', "fail", "error", "cancelled", 'canceled', "idle"]["includes"](_0x2c97c0);
}
function isAsyncTaskPendingStatus(_0x3b17d2) {
  const _0x58f752 = String(_0x3b17d2 || '')["trim"]()["toLowerCase"]();
  return ["submitted", "pending", "queued", "waiting", "running", "processing", 'querying', "in_progress"]['includes'](_0x58f752);
}
function isAsyncTaskFailureStatus(_0x3f1a78) {
  const _0x531181 = String(_0x3f1a78 || '')["trim"]()['toLowerCase']();
  return ["failed", "failure", 'fail', "error", 'cancelled', "canceled", "idle"]["includes"](_0x531181);
}
function supportsAsyncImageTaskPolling(_0x17fbaf, _0x17f4a8 = {}) {
  const _0xc5e4c9 = String(_0x17fbaf || '')['trim']()["toLowerCase"]();
  if (_0xc5e4c9 === "comfyui") {
    return !![];
  }
  if (["apimart", "ppio", "grsai"]['includes'](_0xc5e4c9)) {
    return !![];
  }
  const _0xe43fe8 = _0x17f4a8?.["taskPolling"];
  return !!(_0xe43fe8 && typeof _0xe43fe8 === "object" && (String(_0xe43fe8["urlTemplate"] || '')["trim"]() || String(_0xe43fe8["mode"] || '')["trim"]() === "comfyui-history"));
}
function buildManifestPollCandidate(_0x416530, _0x59b59a) {
  if (!_0x59b59a || typeof _0x59b59a !== "object") {
    return null;
  }
  const _0x5d19ca = String(_0x59b59a["urlTemplate"] || '')['trim']();
  if (!_0x5d19ca) {
    return null;
  }
  return {
    'method': String(_0x59b59a["method"] || 'GET')['trim']()["toUpperCase"]() || "GET",
    'mode': String(_0x59b59a["mode"] || "task-proxy")["trim"]() || "task-proxy",
    'url': _0x5d19ca["replace"]('{taskId}', encodeURIComponent(_0x416530))
  };
}
function isComfyUiHistoryPolling(_0x3e0aa9 = {}) {
  return String(_0x3e0aa9?.["mode"] || '')["trim"]() === "comfyui-history";
}
async function pollComfyUiImageTask(_0x21e9c6, _0x2dd7af = {}) {
  const _0x164cab = String(_0x21e9c6 || '')["trim"]();
  const _0x5cc5f3 = _0x2dd7af?.["taskPolling"] || {};
  const _0xf493ff = String(_0x5cc5f3["baseUrl"] || '')["trim"]();
  for (let _0x58fc01 = 0x0; _0x58fc01 < 0x1c2; _0x58fc01++) {
    if (_0x2dd7af?.["signal"]?.["aborted"]) {
      throw new Error("CANCELLED");
    }
    await new Promise(_0x290c09 => setTimeout(_0x290c09, 0x7d0));
    if (_0x2dd7af?.["signal"]?.["aborted"]) {
      throw new Error("CANCELLED");
    }
    const _0xdaa1ea = new URLSearchParams({
      'promptId': _0x164cab,
      ...(_0xf493ff ? {
        'baseUrl': _0xf493ff
      } : {}),
      ...(_0x5cc5f3["allowCloudBaseUrl"] ? {
        'allowCloudBaseUrl': '1'
      } : {})
    });
    const _0x40404d = await requester({
      'url': "/api/v2/comfyui/history?" + _0xdaa1ea["toString"](),
      'method': "GET",
      'provider': "comfyui",
      'timeout': 0x7530,
      'signal': _0x2dd7af?.["signal"]
    });
    const _0x31c9d7 = typeof _0x2dd7af?.["resultExtractor"] === "function" ? _0x2dd7af['resultExtractor'](_0x40404d) : _0x40404d;
    const _0x20b52c = hasImageResultOutput(_0x31c9d7, _0x2dd7af?.['responseMapping']);
    if (_0x20b52c) {
      return _0x31c9d7;
    }
    const _0x3c8ba9 = resolveAsyncImageTaskStatus(_0x31c9d7);
    if (isAsyncTaskFailureStatus(_0x3c8ba9)) {
      throw ApiError["taskFailed"]("comfyui", String(_0x31c9d7?.["error"] || _0x31c9d7?.["message"] || "ComfyUI 任务执行失败"));
    }
  }
  throw ApiError['taskTimeout']("comfyui");
}
async function pollAsyncImageTask(_0x5b8c78, _0x52890c, _0x56af19, _0x3496ff = {}) {
  const _0x1e84f6 = String(_0x5b8c78 || '')['trim']();
  if (!_0x1e84f6) {
    throw new Error("缺少异步图片任务 ID");
  }
  const _0x3ae2ba = String(_0x56af19 || '')['trim']()['toLowerCase']();
  if (_0x3ae2ba === 'comfyui' || isComfyUiHistoryPolling(_0x3496ff?.["taskPolling"])) {
    return pollComfyUiImageTask(_0x1e84f6, _0x3496ff);
  }
  const _0x498119 = getProviderConfig(_0x3ae2ba);
  const _0x2eb75f = String(_0x52890c?.['apiKey'] || _0x498119?.["apiKey"] || '')["trim"]();
  if (!_0x2eb75f) {
    throw ApiError["authError"](_0x3ae2ba, null, "API Key 未配置（厂商：" + _0x3ae2ba + "），无法轮询任务");
  }
  const _0x2fa80b = _0x3496ff?.["pollIntervalMs"] === undefined ? _0x3496ff?.["taskPolling"]?.['pollIntervalMs'] : _0x3496ff['pollIntervalMs'];
  const _0x342a5d = _0x2fa80b === undefined ? 0x7d0 : Math["max"](0x0, Number(_0x2fa80b) || 0x0);
  const _0x111f29 = Math["max"](0x1, Number(_0x3496ff?.["maxPolls"]) || 0x1c2);
  const _0x228d41 = _0x3496ff?.['softTimeout'] === !![];
  for (let _0x3cbc72 = 0x0; _0x3cbc72 < _0x111f29; _0x3cbc72++) {
    if (_0x3496ff?.["signal"]?.["aborted"]) {
      throw new Error("CANCELLED");
    }
    _0x342a5d > 0x0 && (await new Promise(_0xf541a9 => setTimeout(_0xf541a9, _0x342a5d)));
    if (_0x3496ff?.["signal"]?.["aborted"]) {
      throw new Error('CANCELLED');
    }
    const _0x1fddd3 = String(_0x498119?.["apiUrl"] || '')['replace'](/\/+$/, '');
    const _0x4c3d8b = buildManifestPollCandidate(_0x1e84f6, _0x3496ff?.['taskPolling']);
    const _0x1f2dd9 = _0x3ae2ba === "apimart" ? [{
      'method': "GET",
      'mode': 'task-proxy',
      'url': buildApimartTaskStatusUrl(_0x1e84f6, null, _0x498119?.["apiUrl"])
    }] : _0x3ae2ba === 'ppio' ? [{
      'method': "GET",
      'mode': "task-proxy",
      'url': _0x1fddd3 + "/v1/tasks/" + _0x1e84f6
    }] : [];
    const _0x165407 = _0x4c3d8b ? [_0x4c3d8b] : _0x1f2dd9;
    if (_0x165407['length'] === 0x0) {
      throw new Error("异步图片任务查询配置缺失（厂商：" + _0x3ae2ba + '）');
    }
    try {
      let _0x231632 = null;
      let _0xa6d9fd = null;
      for (const _0x3fa11d of _0x165407) {
        try {
          _0x3fa11d['mode'] === "image-proxy" ? _0x231632 = await requester({
            'url': "/api/v2/proxy/image",
            'method': "POST",
            'provider': _0x3ae2ba,
            'timeout': 0x7530,
            'signal': _0x3496ff?.["signal"],
            'headers': {
              'Content-Type': "application/json"
            },
            'body': JSON["stringify"]({
              'apiUrl': _0x3fa11d["url"],
              'apiKey': _0x2eb75f,
              ...(_0x3fa11d["body"] || {})
            })
          }) : _0x231632 = await requester({
            'url': "/api/v2/proxy/task?apiUrl=" + encodeURIComponent(_0x3fa11d["url"]),
            'method': "GET",
            'headers': {
              'Authorization': "Bearer " + _0x2eb75f
            },
            'provider': _0x3ae2ba,
            'timeout': 0x7530,
            'signal': _0x3496ff?.["signal"]
          });
          _0xa6d9fd = null;
          break;
        } catch (_0x27a082) {
          _0xa6d9fd = _0x27a082;
          if (_0x27a082 instanceof ApiError) {
            if (_0x27a082['type'] === ErrorType["AUTH_ERROR"] || _0x27a082["type"] === ErrorType["FORBIDDEN"] || _0x27a082["type"] === ErrorType["INSUFFICIENT_BALANCE"] || _0x27a082["type"] === ErrorType["MODEL_UNAVAILABLE"]) {
              throw _0x27a082;
            }
            if (_0x27a082["type"] === ErrorType["INVALID_PARAMS"]) {
              throw _0x27a082;
            }
          }
        }
      }
      if (!_0x231632) {
        if (_0xa6d9fd instanceof ApiError) {
          throw _0xa6d9fd;
        }
        continue;
      }
      const _0x270230 = normalizeTaskSnapshotPayload(_0x231632);
      const _0x12420d = _0x270230 && typeof _0x270230 === 'object' && _0x270230["data"] && typeof _0x270230["data"] === "object" && !Array["isArray"](_0x270230['data']);
      const _0x3c73b1 = _0x12420d ? {
        ..._0x270230,
        ..._0x270230["data"]
      } : normalizeTaskSnapshotPayload(_0x231632['data'] || _0x231632);
      const _0x1b2c75 = hasImageResultOutput(_0x3c73b1, _0x3496ff?.['responseMapping']);
      if (_0x1b2c75) {
        return _0x3c73b1;
      }
      const _0x7532b1 = parseTaskError(_0x3ae2ba, _0x3c73b1);
      if (_0x7532b1) {
        throw _0x7532b1;
      }
      const _0x4d046a = resolveAsyncImageTaskStatus(_0x3c73b1);
      if (["completed", "succeeded", "success"]["includes"](_0x4d046a)) {
        return _0x3c73b1;
      }
      if (isAsyncTaskPendingStatus(_0x4d046a)) {
        continue;
      }
      if (isAsyncTaskTerminalStatus(_0x4d046a)) {
        const _0x440533 = String(_0x3c73b1?.["rawText"] || '');
        throw ApiError["taskFailed"](_0x3ae2ba, String(_0x3c73b1?.["error"] || _0x3c73b1?.["errorMessage"] || _0x3c73b1?.["message"] || extractTaskStatusFromRawText(_0x440533) || "任务状态异常"));
      }
    } catch (_0x51857e) {
      if (_0x51857e instanceof ApiError) {
        if (_0x51857e["type"] === ErrorType["TASK_FAILED"] || _0x51857e["type"] === ErrorType["CONTENT_FILTERED"] || _0x51857e['type'] === ErrorType["TASK_TIMEOUT"] || _0x51857e["type"] === ErrorType["AUTH_ERROR"] || _0x51857e["type"] === ErrorType["FORBIDDEN"] || _0x51857e["type"] === ErrorType["INVALID_PARAMS"] || _0x51857e['type'] === ErrorType['INSUFFICIENT_BALANCE']) {
          throw _0x51857e;
        }
      }
    }
  }
  if (_0x228d41) {
    return {
      'pending': !![],
      'taskId': _0x1e84f6,
      'provider': _0x3ae2ba,
      'message': "任务仍在处理中，可稍后恢复"
    };
  }
  throw ApiError["taskTimeout"](_0x3ae2ba);
}
function resolveRunningHubImageTaskProviderKey(_0x2ad6c1, _0x4e07fb = {}) {
  if (_0x2ad6c1 === 'runninghubwf') {
    const _0x28b841 = getRunningHubTaskProviderProfileId(_0x4e07fb);
    if (_0x28b841) {
      return normalizeRunningHubModelApiProfileId(_0x28b841);
    }
  }
  if (_0x2ad6c1 === "runninghub" && isModelApiModel(_0x4e07fb?.['model'], 'runninghub')) {
    return resolveRunningHubModelApiProfileId(resolveModelExecution(_0x4e07fb?.["model"], {
      'providerHint': "runninghub"
    })?.['modelManifest']?.["modelId"] || _0x4e07fb?.["model"], getRunningHubTaskProviderProfileId(_0x4e07fb));
  }
  return _0x2ad6c1;
}
function buildRunningHubImageTaskKey(_0x207620, _0x3f7f7f, _0x4f42fb) {
  return resolveRunningHubImageTaskProviderKey(_0x207620, _0x3f7f7f) + ":image:" + _0x4f42fb;
}
async function pollRunningHubTask(_0x17382f, _0x23eeca, _0x12927d, _0x4db843) {
  const _0x69680c = isModelApiModel(_0x23eeca['model'], "runninghub");
  const _0x5f33d1 = _0x12927d === "runninghubwf" && !_0x69680c;
  const _0xe8c8f1 = _0x4db843?.['useOpenapiQuery'] === !![] || _0x69680c || isRunningHubOpenApiV2AiApp(_0x23eeca);
  const _0x26fd23 = _0x5f33d1 ? resolveRunningHubWorkflowPollingPolicy(_0x4db843) : null;
  const _0x31a87d = _0x26fd23 ? _0x26fd23["pollIntervalMs"] : _0x4db843?.["pollIntervalMs"] === undefined ? 0x7d0 : Math["max"](0x0, Number(_0x4db843["pollIntervalMs"]) || 0x0);
  const _0x1f14b1 = _0x26fd23?.["pollTimeoutMs"] || null;
  const _0x5276ae = _0x26fd23 ? _0x26fd23["maxPolls"] : Math['max'](0x1, Number(_0x4db843?.["maxPolls"]) || 0x1c2);
  const _0x190b46 = _0x4db843?.["softTimeout"] === !![];
  const _0x1ee0ae = Date["now"]();
  const _0x16e756 = getRunningHubTaskProviderProfileId(_0x23eeca);
  const _0x51e73c = _0x69680c ? null : getProviderConfig(_0x16e756 || 'runninghubwf');
  const _0x17065d = _0x69680c ? resolveRunningHubModelApiProfileId(resolveModelExecution(_0x23eeca?.["model"], {
    'providerHint': "runninghub"
  })?.["modelManifest"]?.["modelId"] || _0x23eeca?.["model"], _0x16e756) : normalizeRunningHubModelApiProfileId(_0x16e756 || _0x51e73c?.['providerProfileId']);
  const _0x210a46 = _0x69680c ? getProviderConfig(_0x17065d) : _0x51e73c;
  const _0x2aec63 = _0x69680c ? _0x210a46["modelApiKey"] || _0x23eeca["apiKey"] : _0x210a46["apiKey"] || _0x23eeca["apiKey"];
  for (let _0x3aa37c = 0x0; _0x3aa37c < _0x5276ae; _0x3aa37c++) {
    if (_0x1f14b1 !== null && hasRunningHubWorkflowPollingTimedOut(_0x1ee0ae, _0x1f14b1)) {
      break;
    }
    if (_0x4db843?.["signal"]?.["aborted"]) {
      throw new Error("CANCELLED");
    }
    _0x31a87d > 0x0 && (await new Promise(_0x457006 => setTimeout(_0x457006, _0x31a87d)));
    if (_0x4db843?.["signal"]?.['aborted']) {
      throw new Error("CANCELLED");
    }
    if (_0x1f14b1 !== null && hasRunningHubWorkflowPollingTimedOut(_0x1ee0ae, _0x1f14b1)) {
      break;
    }
    try {
      const _0x549e06 = await requester({
        'url': _0xe8c8f1 ? "/api/v2/proxy/image" : '/api/v2/runninghubwf/query',
        'method': 'POST',
        'provider': _0x12927d,
        'timeout': 0x7530,
        'headers': {
          'Content-Type': "application/json"
        },
        'body': JSON["stringify"](_0xe8c8f1 ? {
          'apiUrl': buildRunningHubModelApiUrl(_0x17065d, "/openapi/v2/query"),
          'apiKey': _0x2aec63,
          'taskId': _0x17382f
        } : {
          'apiKey': _0x2aec63,
          'taskId': _0x17382f,
          'providerProfileId': _0x17065d
        })
      });
      const _0x6d8f93 = typeof _0x549e06?.['code'] === "number" ? _0x549e06["code"] : null;
      if (_0x6d8f93 === 0x324 || _0x6d8f93 === 0x32d) {
        continue;
      }
      if (_0x6d8f93 !== null && _0x6d8f93 !== 0x0) {
        throw parseError(_0x12927d, _0x549e06, 0xc8);
      }
      if (_0xe8c8f1 && hasImageResultOutput(_0x549e06, _0x4db843?.["responseMapping"])) {
        return _0x549e06;
      }
      if (_0x6d8f93 === 0x0 && Array["isArray"](_0x549e06["data"])) {
        const _0x29109c = _0x549e06['data']['filter'](_0x54adb6 => _0x54adb6 && typeof _0x54adb6 === 'object');
        if (_0x29109c["length"] === 0x0) {
          continue;
        }
        const _0x345b24 = _0x29109c["some"](_0x57da94 => hasImageResultOutput(_0x57da94, _0x4db843?.["responseMapping"]));
        if (_0x345b24) {
          return _0x549e06;
        }
        for (const _0x137a7b of _0x29109c) {
          const _0x5c6c20 = parseTaskError(_0x12927d, _0x137a7b);
          if (_0x5c6c20) {
            throw _0x5c6c20;
          }
        }
        const _0x403468 = _0x29109c["map"](_0x3f7162 => String(_0x3f7162?.["status"] || _0x3f7162?.["taskStatus"] || _0x3f7162?.["task_status"] || '')["trim"]()['toUpperCase']())["filter"](Boolean);
        const _0x5073b1 = _0x29109c["find"](_0xe98037 => ['FAILED', "FAIL", "ERROR", "CANCELLED", "CANCELED"]["includes"](String(_0xe98037?.["status"] || _0xe98037?.["taskStatus"] || _0xe98037?.["task_status"] || '')['trim']()['toUpperCase']()));
        if (_0x5073b1) {
          throw ApiError["taskFailed"](_0x12927d, String(_0x5073b1?.["errorMessage"] || _0x5073b1?.['error'] || _0x5073b1?.["message"] || "任务执行失败"));
        }
        if (_0x403468['some'](_0x466398 => ["COMPLETED", "SUCCEEDED", 'SUCCESS']["includes"](_0x466398))) {
          continue;
        }
        if (_0x403468["some"](_0x1a44c0 => ["RUNNING", 'PENDING', 'QUEUED', "SUBMITTED", "PROCESSING"]["includes"](_0x1a44c0))) {
          continue;
        }
      }
      const _0x342053 = _0x549e06['data'] && Object["keys"](_0x549e06["data"])['length'] > 0x0 ? _0x549e06["data"] : _0x549e06;
      const _0x5e8cb7 = hasImageResultOutput(_0x342053, _0x4db843?.["responseMapping"]);
      if (_0x5e8cb7) {
        return _0x342053;
      }
      const _0xf40c84 = parseTaskError(_0x12927d, _0x342053);
      if (_0xf40c84) {
        throw _0xf40c84;
      }
      const _0x4c24a3 = (_0x342053["status"] || '')["toUpperCase"]();
      if (['FAILED', "FAIL", 'ERROR', "CANCELLED", "CANCELED"]['includes'](_0x4c24a3)) {
        throw ApiError["taskFailed"](_0x12927d, String(_0x342053?.["errorMessage"] || _0x342053?.["error"] || _0x342053?.["message"] || "任务执行失败"));
      }
      if (["COMPLETED", "SUCCEEDED", "SUCCESS"]['includes'](_0x4c24a3)) {
        if (!hasImageResultOutput(_0x342053, _0x4db843?.["responseMapping"])) {
          continue;
        }
        return _0x342053;
      }
      if (["RUNNING", 'PENDING', "QUEUED", 'SUBMITTED', "PROCESSING"]["includes"](_0x4c24a3)) {
        continue;
      }
    } catch (_0x434682) {
      if (_0x434682 instanceof ApiError) {
        if (_0x434682['type'] === ErrorType["TIMEOUT"]) {
          continue;
        }
        if (_0x434682["type"] === ErrorType["TASK_FAILED"] || _0x434682["type"] === ErrorType['TASK_TIMEOUT'] || _0x434682['type'] === ErrorType["AUTH_ERROR"] || _0x434682["type"] === ErrorType['FORBIDDEN'] || _0x434682['type'] === ErrorType['INVALID_PARAMS'] || _0x434682["type"] === ErrorType["CONTENT_FILTERED"] || _0x434682['type'] === ErrorType["INSUFFICIENT_BALANCE"] || _0x434682["provider"] === "runninghub" && _0x434682['code'] !== null && _0x434682["code"] !== undefined) {
          throw _0x434682;
        }
      }
    }
  }
  if (_0x190b46) {
    return {
      'pending': !![],
      'taskId': String(_0x17382f || '')["trim"](),
      'status': "running",
      'message': "任务仍在 RunningHub 生成中"
    };
  }
  throw ApiError["taskTimeout"](_0x12927d);
}
async function doGenerateOnce(_0x56893f, _0x3904af, _0x38f427) {
  const _0x33ba3b = await buildGenerateImageRequest(_0x56893f);
  const _0x36d870 = resolveGenerationRequestTimeout(_0x33ba3b);
  const _0x4a2040 = String(_0x33ba3b?.["providerProfileId"] || _0x33ba3b?.["rhProviderProfileId"] || _0x56893f?.['providerProfileId'] || _0x56893f?.['rhProviderProfileId'] || '')["trim"]();
  const _0x46fa35 = _0x3904af === "runninghubwf" && _0x4a2040 ? {
    ..._0x56893f,
    'providerProfileId': _0x4a2040,
    'rhProviderProfileId': _0x4a2040
  } : _0x56893f;
  const _0x1a065d = _0x33ba3b?.["responseMapping"] || null;
  const _0x51e871 = String(_0x56893f?.["model"] || '')["trim"]() === APIMART_MIDJOURNEY_MODEL_ID ? resolveApimartMidjourneySourceMetadata(_0x56893f) : {};
  const _0x4de403 = {
    ...(_0x38f427 || {}),
    ...(_0x1a065d ? {
      'responseMapping': _0x1a065d
    } : {}),
    ...(_0x33ba3b?.["taskPolling"] ? {
      'taskPolling': _0x33ba3b["taskPolling"]
    } : {}),
    ...(typeof _0x33ba3b?.["resultExtractor"] === "function" ? {
      'resultExtractor': _0x33ba3b["resultExtractor"]
    } : {}),
    ...(Object["keys"](_0x51e871)['length'] > 0x0 ? {
      'apimartMidjourneySource': _0x51e871
    } : {})
  };
  const _0x107e63 = _0x3904af === "runninghubwf" || _0x3904af === "runninghub";
  const _0x17ea3f = String(_0x33ba3b?.["body"]?.["apiUrl"] || '');
  const _0x2944a5 = _0x38f427?.["useOpenapiQuery"] === !![] || _0x33ba3b?.['useOpenapiQuery'] === !![] || _0x3904af === 'runninghubwf' && _0x33ba3b?.["url"] === "/api/v2/proxy/image" && (typeof _0x33ba3b?.["pollUrlBuilder"] === "function" || _0x17ea3f['includes']('/openapi/v2/run/ai-app/')) || isModelApiModel(_0x56893f?.["model"], _0x3904af) || isRunningHubOpenApiV2AiApp(_0x56893f);
  const _0x1f45b8 = !!_0x38f427?.["signal"] && _0x3904af !== "runninghubwf";
  const _0x3f13ed = String(_0x56893f?.["installId"] || globalThis["window"]?.["__aicInstallId"] || globalThis["__aicInstallId"] || '')["trim"]();
  const _0x10c4bc = {
    ...(_0x33ba3b["headers"] || {
      'Content-Type': "application/json"
    }),
    ...(_0x3f13ed ? {
      'X-AIC-Install-Id': _0x3f13ed
    } : {})
  };
  const _0x490a6c = _0x33ba3b['body'];
  const _0x15fd86 = typeof FormData !== "undefined" && _0x490a6c instanceof FormData;
  let _0x11d168;
  let _0x563b6c = null;
  try {
    const _0x2d1c00 = await requester({
      'url': _0x33ba3b['url'],
      'method': "POST",
      'provider': _0x3904af,
      'timeout': _0x36d870,
      'retries': GENERATION_RETRIES,
      'retryDelay': GENERATION_RETRY_DELAY,
      'signal': _0x1f45b8 ? _0x38f427?.["signal"] : undefined,
      'headers': _0x10c4bc,
      'body': _0x15fd86 ? _0x490a6c : JSON["stringify"](_0x490a6c),
      'responseType': "text",
      'returnMeta': !![]
    });
    _0x11d168 = String(_0x2d1c00?.["data"] ?? '');
    _0x563b6c = _0x2d1c00?.["headers"] || null;
  } catch (_0x12dab1) {
    if (_0x12dab1 instanceof ApiError) {
      throw _0x12dab1;
    }
    throw parseNetworkError(_0x3904af, _0x12dab1, _0x36d870);
  }
  let _0x531b44 = {};
  let _0x1252d5 = null;
  try {
    _0x531b44 = parseResponseData(_0x11d168);
  } catch (_0x44e3e2) {
    _0x1252d5 = _0x44e3e2;
    _0x531b44 = {};
  }
  if (_0x3904af === "runninghubwf") {
    const _0x44d2fc = typeof _0x531b44?.["code"] === "number" ? _0x531b44['code'] : null;
    if (_0x44d2fc !== null && _0x44d2fc !== 0x0) {
      throw parseError(_0x3904af, _0x531b44, 0xc8);
    }
    const _0x54836a = resolveRunningHubTaskId(_0x531b44, _0x11d168, _0x563b6c);
    if (_0x54836a) {
      const _0x10bb06 = buildRunningHubImageTaskKey(_0x3904af, _0x46fa35, _0x54836a);
      _0x38f427?.["onTaskMeta"]?.({
        'taskId': _0x54836a,
        'useOpenapiQuery': _0x2944a5,
        ...(_0x4a2040 ? {
          'providerProfileId': _0x4a2040,
          'rhProviderProfileId': _0x4a2040
        } : {})
      });
      _0x38f427?.["onTaskId"]?.(_0x54836a);
      const _0x1c4204 = await pollRunningHubTask(_0x54836a, _0x46fa35, _0x3904af, {
        ..._0x4de403,
        'useOpenapiQuery': _0x2944a5
      });
      return processTaskResult(_0x1c4204, _0x3904af, {
        ..._0x4de403,
        'taskKey': _0x10bb06
      });
    }
  }
  let _0x2bfc1e = _0x3904af === "apimart" ? resolveApimartTaskIdStrict(_0x531b44) : resolveAsyncImageTaskId(_0x531b44, _0x1a065d);
  let _0x3adbed = resolveAsyncImageTaskStatus(_0x531b44);
  !_0x2bfc1e && _0x3904af !== "apimart" && (_0x2bfc1e = resolveAsyncImageTaskIdLoose(_0x531b44));
  !_0x2bfc1e && (_0x2bfc1e = _0x3904af === "apimart" ? extractApimartTaskIdFromRawText(_0x11d168) : extractTaskIdFromRawText(_0x11d168));
  if (_0x2bfc1e && _0x3904af === "apimart") {
    const _0x42908a = await probeApimartTaskIdCandidate(_0x2bfc1e, _0x56893f, _0x4de403);
    if (!_0x42908a) {
      _0x2bfc1e = '';
    }
  }
  !_0x2bfc1e && _0x3904af === "apimart" && (_0x2bfc1e = await resolveApimartTaskIdByProbe(_0x531b44, _0x56893f, _0x4de403));
  !_0x2bfc1e && _0x3904af !== 'apimart' && (_0x2bfc1e = extractTaskIdFromResponseHeaders(_0x563b6c));
  !_0x3adbed && (_0x3adbed = extractTaskStatusFromRawText(_0x11d168));
  const _0x32a86c = extractImageUrls(_0x531b44, _0x1a065d)["length"] > 0x0;
  if (_0x32a86c && (_0x3904af === 'grsai' || _0x3904af === 'volcengine') && !isAsyncTaskFailureStatus(_0x3adbed)) {
    return processTaskResult(_0x531b44, _0x3904af, _0x4de403);
  }
  if (!_0x32a86c && _0x3904af === "grsai") {
    const _0x3488f2 = resolveDirectOutputSnapshotFromRawText(_0x11d168);
    if (_0x3488f2) {
      return processTaskResult(_0x3488f2, _0x3904af, _0x4de403);
    }
  }
  _0x2bfc1e && !supportsAsyncImageTaskPolling(_0x3904af, _0x4de403) && (_0x2bfc1e = '');
  if (!_0x107e63 && _0x2bfc1e && !isAsyncTaskFailureStatus(_0x3adbed)) {
    _0x38f427?.["onTaskMeta"]?.({
      'taskId': _0x2bfc1e,
      'provider': _0x3904af,
      'kind': 'image'
    });
    _0x38f427?.["onTaskId"]?.(_0x2bfc1e);
    if (_0x32a86c && ['success', "succeeded", "completed", "complete", "done"]["includes"](String(_0x3adbed || '')["toLowerCase"]())) {
      return processTaskResult(_0x531b44, _0x3904af, _0x4de403);
    }
    const _0x3fee53 = await pollAsyncImageTask(_0x2bfc1e, _0x56893f, _0x3904af, _0x4de403);
    return processTaskResult(_0x3fee53, _0x3904af, _0x4de403);
  }
  if (!_0x107e63 && (_0x3904af === 'ppio' || _0x3904af === "grsai") && (!_0x2bfc1e || isAsyncTaskPendingStatus(_0x3adbed))) {
    const _0xd46958 = String(_0x11d168 || '')["slice"](0x0, 0x190);
    let _0x3ac9ac = {};
    if (_0x563b6c && typeof _0x563b6c['forEach'] === "function") {
      const _0xfb9bb5 = {};
      _0x563b6c["forEach"]((_0x3e7eb2, _0x122699) => {
        const _0x3bea2f = String(_0x122699 || '')["toLowerCase"]();
        (_0x3bea2f["includes"]("task") || _0x3bea2f["includes"]("job") || _0x3bea2f["includes"]("request") || _0x3bea2f["includes"]("submit")) && (_0xfb9bb5[_0x122699] = String(_0x3e7eb2 || ''));
      });
      _0x3ac9ac = _0xfb9bb5;
    }
    console["warn"]("[aiImageApi] async submit missing taskId", {
      'providerId': _0x3904af,
      'asyncTaskStatus': _0x3adbed,
      'previewText': _0xd46958,
      'headerSnapshot': _0x3ac9ac,
      'parsedKeys': _0x531b44 && typeof _0x531b44 === "object" && !Array["isArray"](_0x531b44) ? Object["keys"](_0x531b44)["slice"](0x0, 0x14) : []
    });
  }
  if (_0x1252d5 && !_0x107e63) {
    throw _0x1252d5;
  }
  const _0x53ea4a = String(_0x531b44["status"] || _0x531b44?.['data']?.["status"] || '')['toUpperCase']();
  const _0x448df4 = resolveRunningHubTaskId(_0x531b44, _0x11d168, _0x563b6c);
  if (_0x107e63 && _0x448df4 && (!_0x53ea4a || ['RUNNING', "PENDING", "QUEUED", "SUBMITTED"]["includes"](_0x53ea4a))) {
    const _0x36faa7 = _0x448df4;
    const _0x21c09e = buildRunningHubImageTaskKey(_0x3904af, _0x56893f, _0x36faa7);
    _0x38f427?.["onTaskMeta"]?.({
      'taskId': _0x36faa7,
      'useOpenapiQuery': _0x2944a5
    });
    _0x38f427?.["onTaskId"]?.(_0x36faa7);
    const _0x1763fc = await pollRunningHubTask(_0x36faa7, _0x56893f, _0x3904af, {
      ..._0x4de403,
      'useOpenapiQuery': _0x2944a5
    });
    return processTaskResult(_0x1763fc, _0x3904af, {
      ..._0x4de403,
      'taskKey': _0x21c09e
    });
  }
  return processTaskResult(_0x531b44, _0x3904af, _0x4de403);
}
export async function resumeDreaminaImageTask(_0x231c9a, _0x20528f = {}, _0x2d57f5 = {}) {
  const _0x45ead6 = getProviderId(_0x20528f || {});
  if (_0x45ead6 !== "dreamina") {
    throw new Error("仅支持恢复 Dreamina 图片任务");
  }
  const _0x58d2a8 = String(_0x231c9a || '')["trim"]();
  if (!_0x58d2a8) {
    throw new Error('缺少\x20Dreamina\x20提交ID，无法恢复');
  }
  const _0x55567b = await pollDreaminaUntilDone(_0x58d2a8, {
    ..._0x2d57f5,
    'taskKind': "image"
  });
  const _0xaf63a8 = normalizeDreaminaTaskSnapshot(_0x55567b, {
    'submitId': _0x58d2a8
  });
  if (_0xaf63a8?.["phase"] === "failed") {
    throw new Error(_0xaf63a8['failReason'] || "即梦图片任务恢复失败");
  }
  const _0x14eb75 = Array['isArray'](_0xaf63a8?.["outputs"]) ? _0xaf63a8['outputs'] : [];
  if (_0x14eb75["length"] === 0x0) {
    throw new Error("即梦图片任务恢复失败：无可用输出");
  }
  const _0x5c929e = _0x14eb75["map"](_0x18b70c => {
    const _0x4729f1 = _0x18b70c["localUrl"] || _0x18b70c['url'];
    return {
      'sourceId': null,
      'thumbId': null,
      'sourceUrl': _0x18b70c["url"] || _0x4729f1,
      'thumbUrl': _0x4729f1,
      'imageUrl': _0x4729f1,
      'localPath': _0x18b70c["localPath"] || '',
      ...buildCanvasLocalImageFields(_0x18b70c)
    };
  });
  return prepareImageGenerationMedia(_0x5c929e["length"] === 0x1 ? _0x5c929e[0x0] : {
    'isBatch': !![],
    'images': _0x5c929e
  });
}
function normalizeApimartMidjourneyUpscaleSpeed(_0x530b7f) {
  const _0x2f4a18 = String(_0x530b7f || '')["trim"]()["toLowerCase"]();
  return ["relax", 'fast', 'turbo']["includes"](_0x2f4a18) ? _0x2f4a18 : "fast";
}
function normalizeApimartMidjourneyUpscaleIndex(_0x52fcb3) {
  const _0x54dc11 = Number["parseInt"](_0x52fcb3, 0xa);
  if (!Number["isFinite"](_0x54dc11)) {
    return 0x0;
  }
  return _0x54dc11 >= 0x1 && _0x54dc11 <= 0x4 ? _0x54dc11 : 0x0;
}
function normalizeApimartMidjourneyVariationMode(_0x5f26a0) {
  const _0x1adefd = String(_0x5f26a0 || '')['trim']()["toLowerCase"]();
  if (["weak", "low", "low-variation"]['includes'](_0x1adefd)) {
    return "weak";
  }
  if (["strong", "high", "high-variation"]["includes"](_0x1adefd)) {
    return "strong";
  }
  return "medium";
}
function normalizeApimartMidjourneyVersion(_0x219dc3) {
  return String(_0x219dc3 || '')['trim']()["toLowerCase"]()['replace'](/^v/, '');
}
function isApimartMidjourneyRemixVersion(_0x3c350f) {
  const _0x166473 = normalizeApimartMidjourneyVersion(_0x3c350f);
  return _0x166473 === "8.2" || _0x166473 === "8.1";
}
function getApimartMidjourneyVariationEndpoint(_0x4be807, _0x12f60d = '') {
  if (isApimartMidjourneyRemixVersion(_0x12f60d)) {
    return normalizeApimartMidjourneyVariationMode(_0x4be807) === "strong" ? 'remix-strong' : "remix-subtle";
  }
  switch (normalizeApimartMidjourneyVariationMode(_0x4be807)) {
    case "weak":
      return "low-variation";
    case "strong":
      return "high-variation";
    default:
      return "variation";
  }
}
export async function submitApimartMidjourneyUpscaleRequest(_0x2d346e = {}) {
  await ensureConfig();
  const _0x3dfa87 = getProviderConfig("apimart");
  const _0x7aba1c = String(_0x2d346e?.["apiKey"] || _0x3dfa87?.['apiKey'] || '')["trim"]();
  if (!_0x7aba1c) {
    throw ApiError["authError"]("apimart", null, "APIMart API Key 未配置，无法发起 Midjourney 二次操作");
  }
  const _0x35733c = String(_0x2d346e?.["taskId"] || _0x2d346e?.["parentTaskId"] || _0x2d346e?.["mjTaskId"] || '')["trim"]();
  if (!_0x35733c) {
    throw new Error("缺少 APIMart Midjourney task_id");
  }
  const _0x6d159d = String(_0x2d346e?.["customId"] || _0x2d346e?.["custom_id"] || '')["trim"]();
  const _0x3862b2 = normalizeApimartMidjourneyUpscaleIndex(_0x2d346e?.["index"]);
  if (!_0x6d159d && !_0x3862b2) {
    throw new Error("APIMart Midjourney upscale 需要 index 或 custom_id");
  }
  const _0x592012 = normalizeApimartBaseUrl(_0x3dfa87?.['apiUrl']);
  const _0x413109 = {
    'apiUrl': _0x592012 + "/v1/midjourney/generations/upscale",
    'apiKey': _0x7aba1c,
    'task_id': _0x35733c,
    ...(_0x6d159d ? {
      'custom_id': _0x6d159d
    } : {
      'index': _0x3862b2
    }),
    ...(_0x6d159d && String(_0x2d346e?.["prompt"] || '')['trim']() ? {
      'prompt': String(_0x2d346e["prompt"] || '')["trim"]()
    } : {}),
    ...(_0x6d159d ? {} : {
      'speed': normalizeApimartMidjourneyUpscaleSpeed(_0x2d346e?.["speed"])
    })
  };
  const _0x5021 = await requester({
    'url': "/api/v2/proxy/image",
    'method': "POST",
    'provider': "apimart",
    'timeout': GENERATION_TIMEOUT,
    'retries': GENERATION_RETRIES,
    'retryDelay': GENERATION_RETRY_DELAY,
    'signal': _0x2d346e?.['signal'],
    'headers': {
      'Content-Type': "application/json"
    },
    'body': JSON["stringify"](_0x413109),
    'responseType': "text"
  });
  const _0x4c06a9 = typeof _0x5021 === "string" ? parseResponseData(_0x5021) : _0x5021 || {};
  const _0xfcc6da = parseError("apimart", _0x4c06a9, 0xc8);
  if (_0xfcc6da) {
    throw _0xfcc6da;
  }
  const _0x420777 = String(resolveApimartTaskIdStrict(_0x4c06a9) || resolveAsyncImageTaskId(_0x4c06a9, APIMART_MIDJOURNEY_UPSCALE_RESPONSE_MAPPING) || extractApimartTaskIdFromRawText(String(_0x5021 || '')) || '')["trim"]();
  if (!_0x420777) {
    throw new Error("APIMart Midjourney upscale 未返回 task_id");
  }
  return {
    'taskId': _0x420777,
    'parentTaskId': _0x35733c,
    ...(_0x6d159d ? {
      'customId': _0x6d159d
    } : {
      'index': _0x3862b2
    })
  };
}
export async function submitApimartMidjourneyVariationRequest(_0x408ad9 = {}) {
  await ensureConfig();
  const _0xaa4335 = getProviderConfig('apimart');
  const _0x26eceb = String(_0x408ad9?.["apiKey"] || _0xaa4335?.["apiKey"] || '')["trim"]();
  if (!_0x26eceb) {
    throw ApiError['authError']("apimart", null, "APIMart API Key 未配置，无法发起 Midjourney 变体操作");
  }
  const _0x5c5817 = String(_0x408ad9?.["taskId"] || _0x408ad9?.["parentTaskId"] || _0x408ad9?.['mjTaskId'] || '')['trim']();
  if (!_0x5c5817) {
    throw new Error('缺少\x20APIMart\x20Midjourney\x20task_id');
  }
  const _0x4a29f0 = String(_0x408ad9?.["customId"] || _0x408ad9?.["custom_id"] || '')["trim"]();
  const _0x7feac7 = normalizeApimartMidjourneyUpscaleIndex(_0x408ad9?.["index"]);
  if (!_0x4a29f0 && !_0x7feac7) {
    throw new Error('APIMart\x20Midjourney\x20variation\x20需要\x20index\x20或\x20custom_id');
  }
  const _0x2c518c = normalizeApimartMidjourneyVariationMode(_0x408ad9?.["variationMode"] || _0x408ad9?.["mode"] || _0x408ad9?.["strength"]);
  const _0x2dbaf0 = String(_0x408ad9?.["mjModel"] || _0x408ad9?.["midjourneyModel"] || _0x408ad9?.["model"] || _0x408ad9?.["version"] || '')["trim"]();
  const _0x299cec = isApimartMidjourneyRemixVersion(_0x2dbaf0);
  if (_0x299cec && !_0x7feac7) {
    throw new Error('APIMart\x20Midjourney\x20remix\x20需要\x20index');
  }
  const _0x3bdba5 = normalizeApimartBaseUrl(_0xaa4335?.["apiUrl"]);
  const _0x2318e4 = {
    'apiUrl': _0x3bdba5 + '/v1/midjourney/generations/' + getApimartMidjourneyVariationEndpoint(_0x2c518c, _0x2dbaf0),
    'apiKey': _0x26eceb,
    'task_id': _0x5c5817,
    'speed': normalizeApimartMidjourneyUpscaleSpeed(_0x408ad9?.['speed']),
    ...(_0x299cec ? {
      'index': _0x7feac7
    } : _0x4a29f0 ? {
      'custom_id': _0x4a29f0
    } : {
      'index': _0x7feac7
    })
  };
  const _0x4b7bb0 = await requester({
    'url': "/api/v2/proxy/image",
    'method': "POST",
    'provider': "apimart",
    'timeout': GENERATION_TIMEOUT,
    'retries': GENERATION_RETRIES,
    'retryDelay': GENERATION_RETRY_DELAY,
    'signal': _0x408ad9?.['signal'],
    'headers': {
      'Content-Type': 'application/json'
    },
    'body': JSON['stringify'](_0x2318e4),
    'responseType': 'text'
  });
  const _0x632539 = typeof _0x4b7bb0 === "string" ? parseResponseData(_0x4b7bb0) : _0x4b7bb0 || {};
  const _0x452cdd = parseError('apimart', _0x632539, 0xc8);
  if (_0x452cdd) {
    throw _0x452cdd;
  }
  const _0x266096 = String(resolveApimartTaskIdStrict(_0x632539) || resolveAsyncImageTaskId(_0x632539, APIMART_MIDJOURNEY_UPSCALE_RESPONSE_MAPPING) || extractApimartTaskIdFromRawText(String(_0x4b7bb0 || '')) || '')['trim']();
  if (!_0x266096) {
    throw new Error("APIMart Midjourney variation 未返回 task_id");
  }
  return {
    'taskId': _0x266096,
    'parentTaskId': _0x5c5817,
    'variationMode': _0x2c518c,
    ...(_0x2dbaf0 ? {
      'mjModel': _0x2dbaf0
    } : {}),
    ...(_0x299cec ? {
      'index': _0x7feac7
    } : _0x4a29f0 ? {
      'customId': _0x4a29f0
    } : {
      'index': _0x7feac7
    })
  };
}
export async function resumeApimartMidjourneyUpscaleTask(_0xb52a79, _0x4bdc9c = {}, _0x3dd1d9 = {}) {
  await ensureConfig();
  const _0x37eac9 = String(_0xb52a79 || '')["trim"]();
  if (!_0x37eac9) {
    throw new Error("缺少 APIMart Midjourney 任务ID，无法恢复");
  }
  const _0x318687 = getProviderConfig("apimart");
  const _0x3cd877 = {
    ...(_0x4bdc9c && typeof _0x4bdc9c === "object" ? _0x4bdc9c : {}),
    'provider': "apimart",
    'model': APIMART_MIDJOURNEY_MODEL_ID
  };
  const _0x35adc6 = {
    ..._0x3dd1d9,
    'responseMapping': _0x3dd1d9?.["responseMapping"] || APIMART_MIDJOURNEY_UPSCALE_RESPONSE_MAPPING,
    'taskPolling': _0x3dd1d9?.["taskPolling"] || buildApimartMidjourneyTaskPolling(_0x318687?.["apiUrl"])
  };
  return runTaskSingleFlight({
    'provider': "apimart",
    'kind': "image",
    'taskId': _0x37eac9
  }, async () => {
    const _0x4339fc = await pollAsyncImageTask(_0x37eac9, _0x3cd877, "apimart", _0x35adc6);
    if (_0x4339fc?.["pending"]) {
      return _0x4339fc;
    }
    const _0x25608b = await processTaskResult(_0x4339fc, "apimart", {
      'taskKey': "apimart:image:" + _0x37eac9,
      'responseMapping': _0x35adc6["responseMapping"],
      ...(_0x35adc6["apimartMidjourneySource"] ? {
        'apimartMidjourneySource': _0x35adc6["apimartMidjourneySource"]
      } : {})
    });
    if (_0x25608b["length"] === 0x1 && _0x25608b[0x0]?.["error"]) {
      throw new Error(_0x25608b[0x0]["error"] || "Midjourney 二次操作恢复失败");
    }
    return _0x25608b["length"] === 0x1 ? _0x25608b[0x0] : {
      'isBatch': !![],
      'images': _0x25608b
    };
  });
}
export async function resumeAsyncImageTask(_0x5d6782, _0x13a898 = {}, _0x1f2c8b = {}) {
  await ensureConfig();
  const _0x209b51 = getProviderId(_0x13a898 || {});
  if (_0x209b51 === "runninghubwf" || _0x209b51 === "runninghub" || _0x209b51 === "dreamina") {
    throw new Error("仅支持恢复 APIMart/PPIO/GRSAI 等异步图片任务");
  }
  const _0x512c8a = String(_0x5d6782 || '')['trim']();
  if (!_0x512c8a) {
    throw new Error("缺少异步图片任务ID，无法恢复");
  }
  return runTaskSingleFlight({
    'provider': _0x209b51,
    'kind': "image",
    'taskId': _0x512c8a
  }, async () => {
    const _0x184ba8 = resolveImageTaskRuntimeOptions(_0x13a898 || {}, _0x209b51, _0x1f2c8b);
    const _0x49b2d5 = await pollAsyncImageTask(_0x512c8a, _0x13a898 || {}, _0x209b51, _0x184ba8);
    const _0x5184f1 = await processTaskResult(_0x49b2d5, _0x209b51, {
      ..._0x184ba8,
      'taskKey': _0x209b51 + ":image:" + _0x512c8a
    });
    if (_0x5184f1["length"] === 0x1 && _0x5184f1[0x0]?.["error"]) {
      throw new Error(_0x5184f1[0x0]['error'] || "图片任务恢复失败");
    }
    return _0x5184f1["length"] === 0x1 ? _0x5184f1[0x0] : {
      'isBatch': !![],
      'images': _0x5184f1
    };
  });
}
export async function resumeRunningHubImageTask(_0x1491d1, _0x2832d7, _0x1e4bdb = {}) {
  const _0x4da9ee = getProviderId(_0x2832d7 || {});
  if (_0x4da9ee !== "runninghubwf" && _0x4da9ee !== "runninghub") {
    throw new Error("仅支持恢复 RunningHub 图片任务");
  }
  const _0x3cb6fc = String(_0x1491d1 || '')["trim"]();
  if (!_0x3cb6fc) {
    throw new Error('缺少\x20RunningHub\x20任务ID，无法恢复');
  }
  if (!String(_0x2832d7?.["apiKey"] || '')["trim"]()) {
    await ensureConfig();
  }
  const _0x448e29 = _0x1e4bdb?.['useOpenapiQuery'] === !![] || isModelApiModel(_0x2832d7?.["model"], _0x4da9ee) || isRunningHubOpenApiV2AiApp(_0x2832d7);
  const _0x8e38cc = resolveRunningHubImageTaskProviderKey(_0x4da9ee, _0x2832d7);
  return runTaskSingleFlight({
    'provider': _0x8e38cc,
    'kind': "image",
    'taskId': _0x3cb6fc
  }, async () => {
    const _0x36a4ef = await pollRunningHubTask(_0x3cb6fc, _0x2832d7 || {}, _0x4da9ee, {
      ..._0x1e4bdb,
      'useOpenapiQuery': _0x448e29
    });
    if (_0x36a4ef?.['pending']) {
      return _0x36a4ef;
    }
    const _0xa3abb8 = await processTaskResult(_0x36a4ef, _0x4da9ee, {
      ..._0x1e4bdb,
      'taskKey': _0x8e38cc + ":image:" + _0x3cb6fc
    });
    if (_0xa3abb8["length"] === 0x1 && _0xa3abb8[0x0]?.["error"]) {
      throw new Error(_0xa3abb8[0x0]['error'] || "图片任务恢复失败");
    }
    return _0xa3abb8["length"] === 0x1 ? _0xa3abb8[0x0] : {
      'isBatch': !![],
      'images': _0xa3abb8
    };
  });
}
async function processTaskResult(_0x13d894, _0x29f1f9, _0x25f161 = {}) {
  const _0x56e5b7 = extractImageResultRecords(_0x13d894, _0x25f161?.["responseMapping"], _0x25f161);
  const _0x46e91a = _0x56e5b7["some"](_0x542c59 => String(_0x542c59?.["sourceUrl"] || '')["trim"]());
  const _0xca5be3 = _0x56e5b7["some"](_0x20f577 => String(_0x20f577?.["error"] || '')['trim']());
  if (!_0x46e91a) {
    if (_0xca5be3) {
      return await processImageResultRecords(_0x56e5b7, _0x25f161);
    }
    const _0x122b28 = parseError(_0x29f1f9, _0x13d894, 0xc8);
    if (_0x122b28) {
      return [{
        'error': _0x122b28['getUserMessage'](),
        'fullData': _0x13d894,
        'cause': _0x122b28
      }];
    }
    const _0x3e17ca = parseTaskError(_0x29f1f9, _0x13d894);
    if (_0x3e17ca) {
      return [{
        'error': _0x3e17ca["getUserMessage"](),
        'fullData': _0x13d894,
        'cause': _0x3e17ca
      }];
    }
    const _0x1625a9 = _0x13d894["error"] || _0x13d894["errorMessage"] || _0x13d894["message"] || _0x13d894["failure_reason"];
    if (_0x1625a9) {
      return [{
        // 厂商错误可能是对象（如 {error:{message}} 展平后的形态），
        // 必须转成可读字符串，否则上层 new Error(obj) 会得到 "[object Object]"。
        'error': typeof _0x1625a9 === 'string' ? _0x1625a9 : getReadableErrorMessage(_0x1625a9) || JSON['stringify'](_0x1625a9),
        'fullData': _0x13d894
      }];
    }
    throw new ApiError({
      'type': "PARSE_ERROR",
      'provider': _0x29f1f9,
      'message': "无法从服务器响应中提取图片地址",
      'raw': _0x13d894,
      'retryable': ![]
    });
  }
  return await resolveOutputWithLocalization(null, () => processImageResultRecords(_0x56e5b7, _0x25f161), _0x25f161);
}
async function processImages(_0x34a295, _0x588f04 = {}) {
  return await processImageResultRecords((Array["isArray"](_0x34a295) ? _0x34a295 : [])["map"](_0x3a78c3 => ({
    'sourceUrl': _0x3a78c3,
    'error': ''
  })), _0x588f04);
}
const IMAGE_LOCAL_SAVE_FAILURE_MESSAGE = '图片已返回，但保存到本地失败';
function getReadableErrorMessage(_0x57f765) {
  if (!_0x57f765) {
    return '';
  }
  if (typeof _0x57f765["getUserMessage"] === "function") {
    try {
      const _0x46fced = String(_0x57f765['getUserMessage']() || '')["trim"]();
      if (_0x46fced) {
        return _0x46fced;
      }
    } catch {}
  }
  if (typeof _0x57f765 === "string") {
    return _0x57f765["trim"]();
  }
  const _0x5aada3 = _0x57f765?.["message"] || _0x57f765?.["errorMessage"] || _0x57f765?.["error_message"] || _0x57f765?.["reason"] || _0x57f765?.["detail"] || _0x57f765?.["details"] || _0x57f765?.["error"];
  if (_0x5aada3 !== undefined && _0x5aada3 !== null && _0x5aada3 !== _0x57f765) {
    const _0x38403a = getReadableErrorMessage(_0x5aada3);
    if (_0x38403a) {
      return _0x38403a;
    }
  }
  try {
    return JSON["stringify"](_0x57f765);
  } catch {
    return String(_0x57f765 || '')["trim"]();
  }
}
function formatLocalSaveFailureMessage(_0x2906f8) {
  const _0x4ff4cf = getReadableErrorMessage(_0x2906f8);
  if (!_0x4ff4cf) {
    return IMAGE_LOCAL_SAVE_FAILURE_MESSAGE;
  }
  if (_0x4ff4cf['includes']("保存到本地失败")) {
    return _0x4ff4cf;
  }
  return IMAGE_LOCAL_SAVE_FAILURE_MESSAGE + '：' + _0x4ff4cf;
}
async function processImageResultRecords(_0x35f773, _0x501b04 = {}) {
  const _0x44fcc1 = [];
  const _0x2cf965 = window["currentProjectId"] || "default_v2_project";
  for (const _0x5305b9 of Array["isArray"](_0x35f773) ? _0x35f773 : []) {
    const _0x48d4cd = String(_0x5305b9?.['sourceUrl'] || '')["trim"]();
    const _0x241f1e = String(_0x5305b9?.["error"] || '')['trim']();
    const _0x156390 = cloneRecordMetadata(_0x5305b9);
    const _0x1b32b1 = Object["keys"](_0x156390)["length"] > 0x0 ? {
      'metadata': _0x156390
    } : {};
    if (!_0x48d4cd) {
      _0x241f1e && _0x44fcc1["push"]({
        'sourceUrl': '',
        'thumbUrl': '',
        'imageUrl': '',
        'localPath': '',
        'error': _0x241f1e,
        ..._0x1b32b1,
        ...(_0x5305b9?.["fullData"] !== undefined ? {
          'fullData': _0x5305b9["fullData"]
        } : {})
      });
      continue;
    }
    try {
      const {
        saveRemoteImageLocallyDetailed: _0x3bc6be
      } = await import('../src/modules/project.js');
      const _0x13f4b6 = await _0x3bc6be(_0x48d4cd, _0x2cf965, {
        'taskKey': _0x501b04?.['taskKey'],
        'dedupeKey': _0x501b04?.["taskKey"] ? _0x501b04["taskKey"] + ':' + _0x48d4cd : undefined
      });
      const _0x3d0e6d = pickResultLocalPath(_0x13f4b6);
      const _0x2c7fe9 = String(_0x13f4b6?.["localUrl"] || '')["trim"]() || localPathToUrl(_0x3d0e6d);
      if (!_0x3d0e6d || !_0x2c7fe9) {
        throw new Error("本地保存未返回有效路径");
      }
      _0x44fcc1['push'](await prepareImageGenerationMedia({
        'sourceId': null,
        'thumbId': null,
        ...buildCanvasLocalImageFields({
          ..._0x13f4b6,
          'localPath': _0x3d0e6d
        }),
        ..._0x1b32b1
      }));
    } catch (_0x1bb1fd) {
      const _0x112213 = formatLocalSaveFailureMessage(_0x1bb1fd);
      _0x44fcc1['push']({
        'sourceUrl': '',
        'thumbUrl': '',
        'imageUrl': '',
        'localPath': '',
        'error': _0x112213,
        ..._0x1b32b1
      });
    }
  }
  return _0x44fcc1;
}
async function generateImageUnqueued(_0x39b116, _0x31b03f) {
  const _0x1737db = getProviderId(_0x39b116);
  const _0x203363 = getImageExecution(_0x39b116, _0x1737db)?.["executionManifest"];
  const _0xe157ba = resolveImageGenerationBatchSize(_0x39b116, _0x1737db);
  const _0x390b8a = shouldSubmitProviderBatchOnce(_0x39b116, _0x1737db, _0xe157ba);
  const _0x103eea = getLocalImageRuntimeHandler(_0x203363);
  if (_0x103eea) {
    const _0x484397 = await _0x103eea["run"]({
      'payload': _0x39b116,
      'options': _0x31b03f,
      'batchSize': _0xe157ba,
      'executionManifest': _0x203363
    });
    return _0x484397['length'] === 0x1 ? _0x484397[0x0] : {
      'isBatch': !![],
      'images': _0x484397
    };
  }
  if (_0xe157ba <= 0x1 || _0x390b8a) {
    try {
      const _0x5751e3 = await doGenerateOnce(_0x39b116, _0x1737db, _0x31b03f);
      const _0x7ead48 = Array["isArray"](_0x5751e3) ? _0x5751e3 : [_0x5751e3];
      if (_0x7ead48["length"] === 0x1 && _0x7ead48[0x0]['error']) {
        throw new Error(getReadableErrorMessage(_0x7ead48[0x0]['error']) || '图像生成失败', {
          'cause': _0x7ead48[0x0]["cause"]
        });
      }
      return _0x7ead48["length"] === 0x1 ? _0x7ead48[0x0] : {
        'isBatch': !![],
        'images': _0x7ead48
      };
    } catch (_0x47ddeb) {
      if (_0x47ddeb instanceof ApiError) {
        throw new Error(_0x47ddeb["getUserMessage"](), {
          'cause': _0x47ddeb
        });
      }
      throw _0x47ddeb;
    }
  }
  const _0x324418 = [];
  const _0x418558 = createImageBatchAttemptContext(_0xe157ba);
  for (let _0x51fc08 = 0x0; _0x51fc08 < _0xe157ba; _0x51fc08++) {
    try {
      const _0x583f6b = await doGenerateOnce(buildImageBatchAttemptPayload(_0x39b116, _0x418558, _0x51fc08), _0x1737db, _0x31b03f);
      _0x324418["push"](..._0x583f6b);
    } catch (_0x161a7a) {
      _0x161a7a instanceof ApiError ? _0x324418["push"]({
        'error': _0x161a7a["getUserMessage"](),
        'status': "failed",
        'retryable': _0x161a7a["retryable"]
      }) : _0x324418["push"]({
        'error': _0x161a7a["message"] || '未知错误',
        'status': "failed",
        'retryable': ![]
      });
    }
  }
  if (_0x324418["length"] === 0x0) {
    throw new Error("批量生成全部失败");
  }
  if (_0x324418['length'] === 0x1) {
    return _0x324418[0x0];
  }
  return {
    'isBatch': !![],
    'images': _0x324418
  };
}
export async function generateImage(_0x28d685, _0x230974 = {}) {
  const _0x442e9f = getProviderId(_0x28d685);
  const _0x15def2 = getImageExecution(_0x28d685, _0x442e9f)?.["executionManifest"];
  if (isRunningHubWorkflowQueueTarget({
    'providerId': _0x442e9f,
    'adapterType': _0x15def2?.["adapterType"],
    'executionManifest': _0x15def2,
    'payload': _0x28d685
  })) {
    await ensureConfig();
    const _0xcf367 = resolveRunningHubWorkflowQueueConfig({
      'payload': _0x28d685,
      'concurrency': _0x230974?.['runningHubWorkflowConcurrency']
    });
    return runWithRunningHubWorkflowQueue({
      ..._0xcf367,
      'signal': _0x230974?.["signal"],
      'lease': _0x230974?.["runningHubWorkflowQueueLease"],
      'onQueueChange': _0x230974?.["onRunningHubWorkflowQueueChange"],
      'autoProbeConcurrency': _0x230974?.["autoProbeConcurrency"],
      'concurrencyProbe': _0x230974?.["runningHubWorkflowConcurrencyProbe"]
    }, _0x18a0ad => generateImageUnqueued(_0x28d685, {
      ..._0x230974,
      'runningHubWorkflowQueueLease': _0x18a0ad
    }))["then"](prepareImageGenerationMedia);
  }
  return generateImageUnqueued(_0x28d685, _0x230974)["then"](prepareImageGenerationMedia);
}