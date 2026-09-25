import * as a47_0x39c147 from './adapters/RunningHubAdapter.js';
import { saveModelApiVideoContent } from './modelApiVideoContent.js';
import * as a47_0x315070 from './adapters/ComfyUiAdapter.js';
import { buildVideoRequestFromManifest, resolveManifestErrorRules, resolveManifestTaskPolling } from './adapters/ModelApiManifestNormalizer.js';
import { resolveMappedResponseValue, resolveMappedResponseValues } from './adapters/modelApiMappingEngine.js';
import { ensureConfig, getProviderConfig } from './configApi.js';
import { applyCameraAngleToPrompt } from './cameraPromptApi.js';
import { processInputImages } from './imageUploadApi.js';
import { processInputVideos } from './videoUploadApi.js';
import { processInputAudios } from './audioUploadApi.js';
import { uploadInputToComfyUi } from './comfyUiUploadApi.js';
import { uploadInputsToVolcengineFiles } from './volcengineFileApi.js';
import { fetchRemoteBlob, SAVE_OUTPUT_FROM_URL_TIMEOUT_MS } from './projectsV2Api.js';
import { cancelRunningHubTask } from './runninghubTaskApi.js';
import { buildDreaminaVideoSubmitRequest, normalizeDreaminaTaskSnapshot, pollDreaminaUntilDone, queryDreaminaResult, runDreaminaVideoGeneration } from './dreaminaGenApi.js';
import { isModelApiModel, normalizeProviderId, resolveModelExecution } from '../src/manifests/index.js';
import { localPathToUrl, pickResultLocalPath, urlToLocalPath } from '../src/utils/localMediaPath.js';
import { requester } from './requester.js';
import { runTaskSingleFlight } from './taskSingleFlight.js';
import { ensureVideoResultThumbnail } from './videoResultThumbnailApi.js';
import { resolveOutputWithLocalization } from './outputLocalization.js';
import { isRunningHubWorkflowQueueTarget, resolveRunningHubWorkflowQueueConfig, runWithRunningHubWorkflowQueue } from './runningHubWorkflowQueue.js';
import { hasRunningHubWorkflowPollingTimedOut, resolveRunningHubWorkflowPollingPolicy } from './runningHubWorkflowPollingPolicy.js';
import { ApiError, ErrorType, parseError, parseTaskError, parseNetworkError, applyManifestErrorRules } from './errors/index.js';
import { buildRunningHubModelApiUrl, getRunningHubTaskProviderProfileId, normalizeRunningHubModelApiProfileId, resolveRunningHubModelApiProfileId, resolveRunningHubModelApiBaseUrl } from '../src/modules/runningHubProviderProfiles.js';
import { normalizeModelProviderProfileId } from '../src/modules/modelProviderProfileSelection.js';
const GENERATION_TIMEOUT = 0xa * 0x3c * 0x3e8;
const VIDEO_RESULT_SAVE_TIMEOUT_MS = SAVE_OUTPUT_FROM_URL_TIMEOUT_MS;
const VIDEO_RESULT_SAVE_RETRIES = 0x3;
const VIDEO_RESULT_SAVE_RETRY_DELAY_MS = 0x3e8;
export async function cancelRunningHubVideoTask(_0x2f0138 = {}) {
  return cancelRunningHubTask(_0x2f0138);
}
function resolveVideoExecution(_0x4c3ea0 = {}) {
  const _0xe8dd57 = normalizeProviderId(_0x4c3ea0?.["provider"]);
  return resolveModelExecution(_0x4c3ea0?.['model'], {
    'providerHint': _0xe8dd57
  });
}
function resolveVideoProviderId(_0x460462 = {}, _0x4286eb = null) {
  return normalizeProviderId(_0x4286eb?.['modelManifest']?.["provider"] || _0x460462?.["provider"]);
}
function resolveVideoRuntimeProviderKey(_0x44e022 = {}, _0x1bf9a3 = '') {
  const _0x19654d = getRunningHubTaskProviderProfileId(_0x44e022);
  const _0xa879d4 = resolveVideoExecution(_0x44e022);
  const _0x214da7 = normalizeModelProviderProfileId(_0xa879d4?.["modelManifest"] || _0x44e022?.["model"], _0x19654d);
  if (_0x214da7) {
    return _0x214da7;
  }
  if (_0x1bf9a3 === "runninghubwf") {
    if (_0x19654d) {
      return normalizeRunningHubModelApiProfileId(_0x19654d);
    }
  }
  return _0x1bf9a3 === "runninghub" && isModelApiModel(_0x44e022?.['model'], "runninghub") ? resolveRunningHubModelApiProfileId(_0xa879d4?.['modelManifest']?.['modelId'] || _0x44e022?.["model"], _0x19654d) : _0x1bf9a3;
}
function resolveVideoProviderConfig(_0x144d6f = {}, _0x253757 = '') {
  const _0x4d6adb = resolveVideoRuntimeProviderKey(_0x144d6f, _0x253757);
  const _0x19560b = getProviderConfig(_0x4d6adb) || {};
  return _0x253757 === "runninghub" ? {
    ..._0x19560b,
    'apiUrl': resolveRunningHubModelApiBaseUrl(_0x4d6adb)
  } : _0x19560b;
}
function resolveVideoTaskRuntimeOptions(_0x4cbd87 = {}, _0xc83e04 = '', _0x5b06f9 = {}) {
  const _0x2933d9 = String(_0x4cbd87?.["model"] || '')["trim"]();
  if (!_0x2933d9) {
    return _0x5b06f9 || {};
  }
  const _0x34d1d7 = normalizeProviderId(_0xc83e04 || _0x4cbd87?.["provider"]);
  const _0x3b3a09 = resolveModelExecution(_0x2933d9, {
    'providerHint': _0x34d1d7
  });
  const _0x20f5f3 = _0x3b3a09?.['executionManifest'];
  if (!_0x20f5f3 || _0x20f5f3["adapterType"] !== "modelApi" || _0x20f5f3["kind"] !== 'video') {
    return _0x5b06f9 || {};
  }
  const _0x32db87 = normalizeProviderId(_0x20f5f3["provider"] || _0x34d1d7);
  const _0x1bd9b3 = resolveVideoProviderConfig(_0x4cbd87, _0x32db87);
  const _0x5a93f7 = resolveManifestTaskPolling(_0x32db87, _0x1bd9b3, _0x20f5f3, {
    'modelManifest': _0x3b3a09?.["modelManifest"] || null,
    'payload': _0x4cbd87
  });
  const _0x4fc13e = resolveManifestErrorRules(_0x20f5f3);
  return {
    ...(_0x5b06f9 || {}),
    ...(!_0x5b06f9?.["responseMapping"] && _0x20f5f3["responseMapping"] ? {
      'responseMapping': _0x20f5f3["responseMapping"]
    } : {}),
    ...(!_0x5b06f9?.["taskPolling"] && _0x5a93f7 ? {
      'taskPolling': _0x5a93f7
    } : {}),
    ...(!_0x5b06f9?.["errorRules"] && _0x4fc13e['length'] > 0x0 ? {
      'errorRules': _0x4fc13e
    } : {})
  };
}
export async function buildGenerateVideoRequest(_0x31ddc2) {
  const _0x25e5dd = applyCameraAngleToPrompt(_0x31ddc2["prompt"], _0x31ddc2["cameraAngle"]);
  const _0x1a7a6e = resolveVideoExecution(_0x31ddc2);
  const _0x3efca4 = resolveVideoProviderId(_0x31ddc2, _0x1a7a6e);
  const _0x57bd24 = _0x1a7a6e?.['executionManifest'];
  const _0x22699 = _0x1a7a6e?.["modelManifest"];
  if (_0x57bd24?.["adapterType"] === "localRuntime" && _0x57bd24?.['runtime'] === "dreaminaVideo") {
    const _0x1bc847 = buildDreaminaVideoSubmitRequest({
      ..._0x31ddc2,
      'prompt': _0x25e5dd
    });
    return {
      'url': _0x1bc847["url"],
      'headers': {
        'Content-Type': "application/json"
      },
      'body': _0x1bc847["body"]
    };
  }
  if (!_0x3efca4 || !_0x57bd24) {
    const _0x6a1036 = String(_0x31ddc2?.['model'] || '')["trim"]() || "(empty)";
    throw new Error("Video model API manifest missing: " + _0x6a1036);
  }
  await ensureConfig();
  if (_0x57bd24["adapterType"] === 'modelApi') {
    const _0x375ab5 = await buildVideoRequestFromManifest(_0x31ddc2, _0x25e5dd, {
      'getProviderConfig': getProviderConfig,
      'processInputImages': processInputImages,
      'processInputVideos': processInputVideos,
      'processInputAudios': processInputAudios,
      'uploadInputsToVolcengineFiles': uploadInputsToVolcengineFiles
    }, {
      'expectedProvider': _0x22699?.["provider"] || _0x3efca4
    });
    if (_0x375ab5) {
      return _0x375ab5;
    }
    throw new Error((_0x22699?.['provider'] || _0x3efca4) + " video model API manifest missing: " + _0x31ddc2["model"]);
  }
  if (_0x57bd24['adapterType'] === "workflow") {
    if (_0x22699?.["provider"] === "comfyui" || _0x3efca4 === "comfyui") {
      return a47_0x315070["buildVideoRequest"](_0x31ddc2, _0x25e5dd, {
        'getProviderConfig': getProviderConfig,
        'processInputImages': processInputImages,
        'processInputVideos': processInputVideos,
        'processInputAudios': processInputAudios,
        'uploadInputToComfyUi': uploadInputToComfyUi
      });
    }
    return a47_0x39c147["buildVideoRequest"](_0x31ddc2, _0x25e5dd, {
      'getProviderConfig': getProviderConfig,
      'processInputImages': processInputImages,
      'processInputVideos': processInputVideos,
      'processInputAudios': processInputAudios
    });
  }
  throw new ApiError({
    'type': "UNSUPPORTED_PROVIDER",
    'provider': _0x3efca4,
    'message': "暂不支持厂商 " + _0x3efca4 + '\x20的视频生成',
    'retryable': ![]
  });
}
async function pollRunningHubVideoTask(_0x3c49a6, _0x520acb, _0x4b09da, _0x529711) {
  const _0x1ce6d3 = createRunningHubWorkflowQueueChangeEmitter(_0x529711?.["onRunningHubWorkflowQueueChange"]);
  const _0x5427e9 = (_0xa12af5, _0x44b4be = {}) => {
    _0x1ce6d3?.({
      'status': _0xa12af5,
      'queueIndex': _0xa12af5 === "queued" ? 0x0 : -0x1,
      'queueLength': _0xa12af5 === "queued" ? 0x1 : 0x0,
      'reason': "provider-task-status",
      'taskId': String(_0x3c49a6 || ''),
      ..._0x44b4be
    });
  };
  const _0xde0275 = isModelApiModel(_0x520acb['model'], "runninghub");
  const _0x266bfc = _0x4b09da === "runninghubwf" && !_0xde0275 ? resolveRunningHubWorkflowPollingPolicy(_0x529711) : null;
  const _0x4bbcda = _0x266bfc?.['pollIntervalMs'] ?? 0x7d0;
  const _0x1f64c2 = _0x266bfc?.['pollTimeoutMs'] ?? null;
  const _0x3919c0 = _0x266bfc?.["maxPolls"] ?? 0x4b0;
  const _0x436573 = Date["now"]();
  const _0x58c81e = _0x529711?.['useOpenapiQuery'] === !![] || _0xde0275;
  const _0x1f8bd1 = getRunningHubTaskProviderProfileId(_0x520acb);
  const _0x3c46cb = _0xde0275 ? null : getProviderConfig(_0x1f8bd1 || 'runninghubwf');
  const _0x21b252 = _0xde0275 ? resolveRunningHubModelApiProfileId(resolveVideoExecution(_0x520acb)?.['modelManifest']?.["modelId"] || _0x520acb?.['model'], _0x1f8bd1) : normalizeRunningHubModelApiProfileId(_0x1f8bd1 || _0x3c46cb?.["providerProfileId"]);
  const _0x5aea6c = _0xde0275 ? resolveVideoProviderConfig(_0x520acb, "runninghub") : _0x3c46cb;
  const _0x284f5c = _0xde0275 ? _0x5aea6c["modelApiKey"] || _0x520acb['apiKey'] : _0x5aea6c["apiKey"] || _0x520acb['apiKey'];
  for (let _0x25d58d = 0x0; _0x25d58d < _0x3919c0; _0x25d58d++) {
    if (_0x1f64c2 !== null && hasRunningHubWorkflowPollingTimedOut(_0x436573, _0x1f64c2)) {
      break;
    }
    if (_0x529711?.["signal"]?.["aborted"]) {
      throw new Error("CANCELLED");
    }
    _0x4bbcda > 0x0 && (await new Promise(_0x43b325 => setTimeout(_0x43b325, _0x4bbcda)));
    if (_0x1f64c2 !== null && hasRunningHubWorkflowPollingTimedOut(_0x436573, _0x1f64c2)) {
      break;
    }
    try {
      const _0xb3e5a7 = await requester({
        'url': _0x58c81e ? "/api/v2/proxy/image" : "/api/v2/runninghubwf/query",
        'method': "POST",
        'provider': _0x4b09da,
        'timeout': 0x7530,
        'headers': {
          'Content-Type': "application/json"
        },
        'body': JSON['stringify'](_0x58c81e ? {
          'apiUrl': buildRunningHubModelApiUrl(_0x21b252, "/openapi/v2/query"),
          'apiKey': _0x284f5c,
          'taskId': _0x3c49a6
        } : {
          'apiKey': _0x284f5c,
          'taskId': _0x3c49a6,
          'providerProfileId': _0x21b252
        })
      });
      if (_0x58c81e) {
        const _0x15cacf = Number(_0xb3e5a7?.["code"]);
        const _0x2ebebf = _0xb3e5a7?.["code"] !== undefined && _0xb3e5a7?.["code"] !== null && Number["isFinite"](_0x15cacf) ? _0x15cacf : null;
        if (_0x2ebebf === 0x32d) {
          _0x5427e9("queued");
          continue;
        }
        if (_0x2ebebf === 0x324) {
          _0x5427e9('running');
          continue;
        }
        if (_0x2ebebf !== null && _0x2ebebf !== 0x0) {
          throw parseError(_0x4b09da, _0xb3e5a7, 0xc8);
        }
        if (extractVideoUrls(_0xb3e5a7, _0x529711?.['responseMapping'])["length"] > 0x0) {
          return _0xb3e5a7;
        }
      }
      if (!_0x58c81e) {
        const _0x162340 = Number(_0xb3e5a7?.["code"]);
        const _0x21cce2 = _0xb3e5a7?.["code"] !== undefined && _0xb3e5a7?.["code"] !== null && Number["isFinite"](_0x162340) ? _0x162340 : null;
        if (_0x21cce2 === 0x0 && Array["isArray"](_0xb3e5a7["data"]) && _0xb3e5a7["data"]['length'] > 0x0) {
          if (extractVideoUrls(_0xb3e5a7, _0x529711?.["responseMapping"])["length"] > 0x0) {
            return _0xb3e5a7;
          }
          const _0x18698b = _0xb3e5a7['data']["map"](_0x38fe87 => String(_0x38fe87?.["status"] || _0x38fe87?.["taskStatus"] || '')["trim"]()["toUpperCase"]())["filter"](Boolean);
          if (_0x18698b["some"](_0x4516d1 => ['QUEUED', "QUEUEING", "PENDING", "WAITING", 'SUBMITTED']["includes"](_0x4516d1))) {
            _0x5427e9('queued');
          } else {
            _0x18698b["some"](_0x45f465 => ["RUNNING", "PROCESSING", "IN_PROGRESS"]["includes"](_0x45f465)) && _0x5427e9("running");
          }
          if (_0x18698b["some"](_0x1ade98 => ["FAILED", 'FAIL', "ERROR", 'CANCELLED', 'CANCELED']["includes"](_0x1ade98))) {
            const _0x413636 = parseError(_0x4b09da, _0xb3e5a7, 0xc8);
            throw _0x413636 || new ApiError({
              'type': "TASK_FAILED",
              'provider': _0x4b09da,
              'message': "视频任务执行失败",
              'raw': _0xb3e5a7,
              'retryable': ![]
            });
          }
          continue;
        }
        if (_0x21cce2 === 0x32d) {
          _0x5427e9('queued');
          continue;
        }
        if (_0x21cce2 === 0x324) {
          _0x5427e9('running');
          continue;
        }
        if (_0x21cce2 !== null && _0x21cce2 !== 0x0) {
          throw parseError(_0x4b09da, _0xb3e5a7, 0xc8);
        }
      }
      const _0x47ebb6 = _0xb3e5a7["data"] && Object["keys"](_0xb3e5a7['data'])["length"] > 0x0 ? _0xb3e5a7["data"] : _0xb3e5a7;
      if (extractVideoUrls(_0x47ebb6, _0x529711?.["responseMapping"])["length"] > 0x0) {
        return _0x47ebb6;
      }
      const _0x2c9d61 = parseTaskError(_0x4b09da, _0x47ebb6);
      if (_0x2c9d61) {
        throw _0x2c9d61;
      }
      const _0xe57254 = (_0x47ebb6["status"] || '')['toUpperCase']();
      if (["QUEUED", "QUEUEING", 'PENDING', "WAITING", 'SUBMITTED']["includes"](_0xe57254)) {
        _0x5427e9("queued");
      } else {
        ["RUNNING", 'PROCESSING', "IN_PROGRESS"]["includes"](_0xe57254) && _0x5427e9('running');
      }
      if (["COMPLETED", "SUCCEEDED", "SUCCESS"]["includes"](_0xe57254)) {
        if (extractVideoUrls(_0x47ebb6, _0x529711?.["responseMapping"])["length"] === 0x0) {
          continue;
        }
        return _0x47ebb6;
      }
    } catch (_0x1fc1d3) {
      if (_0x1fc1d3 instanceof ApiError) {
        if (_0x1fc1d3["retryable"] === ![] || _0x1fc1d3["type"] === ErrorType["TASK_FAILED"] || _0x1fc1d3["type"] === ErrorType['TASK_TIMEOUT'] || _0x1fc1d3["type"] === ErrorType["AUTH_ERROR"] || _0x1fc1d3['type'] === ErrorType["FORBIDDEN"] || _0x1fc1d3["type"] === ErrorType['INVALID_PARAMS'] || _0x1fc1d3["type"] === ErrorType["INSUFFICIENT_BALANCE"]) {
          throw _0x1fc1d3;
        }
      }
    }
  }
  throw ApiError["taskTimeout"](_0x4b09da);
}
function parseVideoResponseData(_0x40b20e) {
  if (!_0x40b20e) {
    return {};
  }
  if (typeof _0x40b20e === "object") {
    return _0x40b20e;
  }
  const _0x42fce4 = String(_0x40b20e || '')["trim"]();
  if (!_0x42fce4) {
    return {};
  }
  try {
    return JSON["parse"](_0x42fce4["replace"](/^data:\s*/, ''));
  } catch {
    const _0x3f1ce9 = extractSseJsonSnapshots(_0x42fce4);
    if (_0x3f1ce9['length'] > 0x0) {
      for (const _0x5ece03 of _0x3f1ce9) {
        if (resolveAsyncVideoTaskId(_0x5ece03)) {
          return _0x5ece03;
        }
      }
      return _0x3f1ce9[_0x3f1ce9["length"] - 0x1];
    }
    throw new ApiError({
      'type': "PARSE_ERROR",
      'message': "无法解析服务端响应",
      'retryable': ![]
    });
  }
}
function extractSseJsonSnapshots(_0x75d88f) {
  const _0x3f28ed = String(_0x75d88f || '')["split"]('\x0a')['filter'](_0x2a1c5d => _0x2a1c5d['trim']()["startsWith"]('data:'));
  if (_0x3f28ed["length"] === 0x0) {
    return [];
  }
  const _0xe6044f = [];
  for (const _0x5d8b44 of _0x3f28ed) {
    const _0x2434ce = String(_0x5d8b44 || '')["trim"]()["replace"](/^data:\s*/, '')["trim"]();
    if (!_0x2434ce || _0x2434ce === "[DONE]") {
      continue;
    }
    try {
      _0xe6044f["push"](JSON["parse"](_0x2434ce));
    } catch {}
  }
  return _0xe6044f;
}
function extractRunningHubTaskIdFromRawText(_0x2ed416) {
  const _0x5cc496 = String(_0x2ed416 || '');
  if (!_0x5cc496) {
    return '';
  }
  const _0x165950 = [/"task_id"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /"taskId"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /"taskid"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /\btask[_-]?id\b\s*[:=]\s*["']?([a-zA-Z0-9._:-]+)["']?/i, /(?:\?|&)(?:task_id|taskId|taskid)=([a-zA-Z0-9._:-]+)/i];
  for (const _0x4702ee of _0x165950) {
    const _0x38ce3a = _0x5cc496['match'](_0x4702ee);
    const _0x377801 = String(_0x38ce3a?.[0x1] || '')["replace"](/,/g, '')['trim']();
    if (_0x377801) {
      return _0x377801;
    }
  }
  return '';
}
function extractTaskIdFromResponseHeaders(_0x960bff) {
  if (!_0x960bff || typeof _0x960bff["get"] !== "function") {
    return '';
  }
  const _0x427b96 = ["x-task-id", "x-taskid", "x-request-id", 'x-requestid', 'x-job-id', "x-jobid", "task-id", "taskid", "request-id", "requestid", "job-id", "jobid"];
  for (const _0x1ce4b0 of _0x427b96) {
    const _0x2af7eb = String(_0x960bff["get"](_0x1ce4b0) || '')["trim"]();
    if (_0x2af7eb) {
      return _0x2af7eb;
    }
  }
  if (typeof _0x960bff["forEach"] === 'function') {
    let _0x53f413 = '';
    _0x960bff["forEach"]((_0x11ba22, _0x54a75a) => {
      if (_0x53f413) {
        return;
      }
      const _0xf48776 = String(_0x54a75a || '')['trim']()["toLowerCase"]();
      const _0x54915e = String(_0x11ba22 || '')["trim"]();
      if (!_0x54915e) {
        return;
      }
      (_0xf48776["includes"]("task") && _0xf48776["includes"]('id') || _0xf48776["includes"]('job') && _0xf48776['includes']('id') || _0xf48776["includes"]("request") && _0xf48776["includes"]('id')) && (_0x53f413 = _0x54915e);
    });
    if (_0x53f413) {
      return _0x53f413;
    }
  }
  return '';
}
function normalizeTaskIdValue(_0x71850) {
  return String(_0x71850 ?? '')["replace"](/,/g, '')["trim"]();
}
function looksLikeTaskToken(_0x177826) {
  const _0x1244cf = String(_0x177826 ?? '')["trim"]();
  if (!_0x1244cf || _0x1244cf['length'] < 0x8) {
    return ![];
  }
  const _0x3b9735 = _0x1244cf['toLowerCase']();
  if (['pending', "running", "success", "succeeded", "completed", "failed", "queued", "submitted"]["includes"](_0x3b9735)) {
    return ![];
  }
  return /^[a-zA-Z0-9._:-]+$/["test"](_0x1244cf);
}
function findFirstDeepValueByKeyPattern(_0x280200, _0x59815a, _0x1db473 = 0x8) {
  if (!_0x280200 || typeof _0x280200 !== 'object') {
    return '';
  }
  const _0x156011 = new WeakSet();
  const _0xb1f7ee = [{
    'value': _0x280200,
    'depth': 0x0
  }];
  while (_0xb1f7ee['length'] > 0x0) {
    const {
      value: _0x45a67e,
      depth: _0x3e90a4
    } = _0xb1f7ee['shift']();
    if (!_0x45a67e || typeof _0x45a67e !== "object") {
      continue;
    }
    if (_0x156011['has'](_0x45a67e)) {
      continue;
    }
    _0x156011['add'](_0x45a67e);
    if (_0x3e90a4 > _0x1db473) {
      continue;
    }
    const _0x4bac51 = Array["isArray"](_0x45a67e) ? _0x45a67e["map"]((_0x48860d, _0x37e1ac) => [String(_0x37e1ac), _0x48860d]) : Object['entries'](_0x45a67e);
    for (const [_0x4d86f3, _0x501cce] of _0x4bac51) {
      const _0x5a767a = String(_0x4d86f3 || '')['trim']()['toLowerCase']();
      if (_0x59815a["test"](_0x5a767a)) {
        const _0x81f97e = String(_0x501cce ?? '')["trim"]();
        if (_0x81f97e) {
          return _0x81f97e;
        }
      }
      _0x501cce && typeof _0x501cce === "object" && _0xb1f7ee["push"]({
        'value': _0x501cce,
        'depth': _0x3e90a4 + 0x1
      });
    }
  }
  return '';
}
function resolveRunningHubVideoTaskId(_0x4829cf, _0x52d19d = '', _0x33d790 = null, _0x2e1beb = null) {
  const _0x256fd4 = resolveMappedResponseValue(_0x4829cf, _0x2e1beb?.['taskIdPath']);
  if (_0x256fd4) {
    return normalizeTaskIdValue(_0x256fd4);
  }
  const _0xbeca5a = extractRunningHubTaskIdFromRawText(_0x52d19d);
  if (_0xbeca5a) {
    return _0xbeca5a;
  }
  const _0xe36a5a = resolveAsyncVideoTaskId(_0x4829cf, _0x2e1beb);
  if (_0xe36a5a) {
    return normalizeTaskIdValue(_0xe36a5a);
  }
  return normalizeTaskIdValue(extractTaskIdFromResponseHeaders(_0x33d790));
}
function normalizeVideoSubmitDiagnosticToken(_0x1100b8) {
  if (_0x1100b8 === null || _0x1100b8 === undefined || typeof _0x1100b8 === "object") {
    return '';
  }
  return String(_0x1100b8)["trim"]()["replace"](/[^a-zA-Z0-9._:-]/g, '')["slice"](0x0, 0x50);
}
function getVideoSubmitDiagnosticCandidates(_0x56f5b8) {
  return [_0x56f5b8, _0x56f5b8?.['data'], _0x56f5b8?.["result"], _0x56f5b8?.["output"], _0x56f5b8?.["response"], _0x56f5b8?.["results"]]["flatMap"](_0x24437b => Array["isArray"](_0x24437b) ? _0x24437b : [_0x24437b])['filter'](_0x523f6f => _0x523f6f && typeof _0x523f6f === "object");
}
function getVideoSubmitDiagnosticToken(_0x95750e, _0x387ec7 = []) {
  const _0x7d8aa0 = getVideoSubmitDiagnosticCandidates(_0x95750e);
  for (const _0xdfb91e of _0x7d8aa0) {
    for (const _0x1f3837 of _0x387ec7) {
      const _0x5bdea9 = normalizeVideoSubmitDiagnosticToken(_0xdfb91e?.[_0x1f3837]);
      if (_0x5bdea9) {
        return _0x5bdea9;
      }
    }
  }
  return '';
}
function isVideoSubmitSuccessCode(_0x5357ec) {
  return ['', '0', '200', '201', "202", 'ok', 'success']['includes'](String(_0x5357ec || '')['trim']()["toLowerCase"]());
}
function hasExplicitVideoSubmitFailureSignal(_0x4d7eaf) {
  const _0x30b1b7 = getVideoSubmitDiagnosticCandidates(_0x4d7eaf);
  const _0x2686d4 = new Set(["failed", "failure", "error", "cancelled", "canceled", 'rejected', 'denied', "expired"]);
  const _0x35ce20 = new Set(['ok', "success", "succeeded", "submitted", 'accepted', "queued", "running", "processing", '提交成功', "任务已提交", "已受理", "排队中", '处理中']);
  for (const _0x4d9569 of _0x30b1b7) {
    if (_0x4d9569["success"] === ![] || _0x4d9569['ok'] === ![]) {
      return !![];
    }
    const _0x4103a9 = String(_0x4d9569["status"] || _0x4d9569['taskStatus'] || _0x4d9569["task_status"] || '')["trim"]()["toLowerCase"]();
    if (_0x2686d4['has'](_0x4103a9)) {
      return !![];
    }
    const _0x2cce82 = normalizeVideoSubmitDiagnosticToken(_0x4d9569["errorCode"] ?? _0x4d9569["error_code"]);
    if (_0x2cce82 && _0x2cce82 !== '0') {
      return !![];
    }
    const _0x291c97 = normalizeVideoSubmitDiagnosticToken(_0x4d9569['code']);
    if (_0x291c97 && !isVideoSubmitSuccessCode(_0x291c97)) {
      return !![];
    }
    for (const _0xb6b559 of ["error", "errorMessage", "error_message", "failedReason", "failReason", "fail_reason", "failure_reason"]) {
      const _0xabfe10 = _0x4d9569[_0xb6b559];
      if (_0xabfe10 !== null && _0xabfe10 !== undefined && _0xabfe10 !== '') {
        return !![];
      }
    }
    const _0x474f39 = String(_0x4d9569["message"] || _0x4d9569["msg"] || '')['trim']();
    if (_0x474f39 && !_0x35ce20["has"](_0x474f39["toLowerCase"]())) {
      return !![];
    }
  }
  return ![];
}
function buildVideoSubmitMissingResultError(_0x2a2e08, _0x2b9260, {
  expectsTaskId = !![]
} = {}) {
  const _0x78e9c = getVideoSubmitDiagnosticToken(_0x2b9260, ["status", "taskStatus", "task_status"]);
  const _0x2b4f26 = getVideoSubmitDiagnosticToken(_0x2b9260, ["errorCode", "error_code"]);
  const _0x196673 = getVideoSubmitDiagnosticToken(_0x2b9260, ["code"]);
  const _0x3af606 = _0x2b4f26 || (!isVideoSubmitSuccessCode(_0x196673) ? _0x196673 : '');
  const _0x5bc666 = _0x2b9260 === null ? "null" : _0x2b9260 === undefined ? "undefined" : Array["isArray"](_0x2b9260) ? 'array-' + _0x2b9260["length"] : typeof _0x2b9260;
  const _0x101633 = _0x2b9260 && typeof _0x2b9260 === "object" && !Array['isArray'](_0x2b9260) ? Object["keys"](_0x2b9260)['map'](_0x100da9 => normalizeVideoSubmitDiagnosticToken(_0x100da9))['filter'](Boolean)["slice"](0x0, 0xc) : [];
  const _0x45fd60 = [_0x78e9c ? "状态：" + _0x78e9c : '', _0x3af606 ? "错误码：" + _0x3af606 : '', "响应类型：" + _0x5bc666, _0x101633["length"] ? "响应字段：" + _0x101633['join'](',') : '']["filter"](Boolean);
  const _0x55ad3c = expectsTaskId ? '任务创建响应异常：服务端未返回任务\x20ID' : "视频生成响应异常：服务端未返回视频结果";
  return new ApiError({
    'type': "PARSE_ERROR",
    'provider': _0x2a2e08,
    'code': _0x3af606 || undefined,
    'message': '' + _0x55ad3c + (_0x45fd60["length"] ? '（' + _0x45fd60['join']('；') + '）' : ''),
    'raw': _0x2b9260,
    'retryable': ![]
  });
}
export async function resumeRunningHubVideoTask(_0x57dffd, _0x438350, _0x8ead60 = {}) {
  const _0x4b2b30 = resolveVideoExecution(_0x438350);
  const _0x3cf9aa = resolveVideoProviderId(_0x438350, _0x4b2b30);
  if (_0x3cf9aa !== "runninghubwf") {
    throw new Error("仅支持恢复 RunningHub 工作流视频任务");
  }
  const _0x271446 = String(_0x57dffd || '')["trim"]();
  if (!_0x271446) {
    throw new Error('缺少\x20RunningHub\x20视频任务ID，无法恢复');
  }
  if (!String(_0x438350?.["apiKey"] || '')["trim"]()) {
    await ensureConfig();
  }
  const _0x5c9485 = _0x8ead60?.['useOpenapiQuery'] === !![];
  return runTaskSingleFlight({
    'provider': resolveVideoRuntimeProviderKey(_0x438350, _0x3cf9aa),
    'kind': "video",
    'taskId': _0x271446
  }, async () => {
    const _0x59c50a = await pollRunningHubVideoTask(_0x271446, _0x438350 || {}, _0x3cf9aa, {
      ..._0x8ead60,
      'useOpenapiQuery': _0x5c9485
    });
    const _0x187303 = processVideoTaskResult(_0x59c50a, _0x3cf9aa, _0x8ead60);
    return await resolveVideoResultWithOutputLocalization(_0x187303, {
      'providerId': _0x3cf9aa,
      'taskKey': _0x3cf9aa + ":video:" + _0x271446,
      'signal': _0x8ead60?.["signal"],
      'saveTimeoutMs': _0x8ead60?.["saveTimeoutMs"]
    }, _0x8ead60);
  });
}
export async function resumeAsyncVideoTask(_0x11b8e8, _0x1387dc = {}, _0x4f5e5e = {}) {
  const _0x5431dd = resolveVideoExecution(_0x1387dc);
  const _0x58c77b = resolveVideoProviderId(_0x1387dc, _0x5431dd);
  if (_0x58c77b === "runninghubwf" || _0x58c77b === 'dreamina') {
    throw new Error("仅支持恢复非 RunningHub/Dreamina 的异步视频任务");
  }
  const _0x230e55 = String(_0x11b8e8 || '')["trim"]();
  if (!_0x230e55) {
    throw new Error("缺少异步视频任务ID，无法恢复");
  }
  await ensureConfig();
  const _0x31ed62 = resolveVideoTaskRuntimeOptions(_0x1387dc || {}, _0x58c77b, _0x4f5e5e);
  const _0x40847c = resolveVideoProviderConfig(_0x1387dc, _0x58c77b);
  const _0x489d70 = String(_0x1387dc?.['apiKey'] || (_0x58c77b === "runninghub" ? _0x40847c?.["modelApiKey"] : '') || _0x40847c?.["apiKey"] || '')["trim"]();
  if (!_0x489d70) {
    throw new Error("API Key 未配置（厂商：" + _0x58c77b + "），无法恢复视频任务");
  }
  return runTaskSingleFlight({
    'provider': resolveVideoRuntimeProviderKey(_0x1387dc, _0x58c77b),
    'kind': 'video',
    'taskId': _0x230e55
  }, async () => {
    if (_0x58c77b === 'runninghub') {
      const _0x52df6e = await pollRunningHubVideoTask(_0x230e55, {
        ..._0x1387dc,
        'apiKey': _0x489d70
      }, _0x58c77b, {
        ..._0x31ed62,
        'useOpenapiQuery': !![]
      });
      const _0x2d466b = processVideoTaskResult(_0x52df6e, _0x58c77b, _0x31ed62);
      return await resolveVideoResultWithOutputLocalization(_0x2d466b, {
        'providerId': _0x58c77b,
        'taskKey': resolveVideoRuntimeProviderKey(_0x1387dc, _0x58c77b) + ":video:" + _0x230e55,
        'signal': _0x4f5e5e?.["signal"],
        'saveTimeoutMs': _0x4f5e5e?.["saveTimeoutMs"]
      }, _0x4f5e5e);
    }
    const _0xcf1252 = await pollVideoTask(_0x230e55, _0x58c77b, _0x489d70, _0x31ed62);
    return await resolveVideoResultWithOutputLocalization(_0xcf1252, {
      'providerId': _0x58c77b,
      'taskKey': _0x58c77b + ":video:" + _0x230e55,
      'signal': _0x4f5e5e?.["signal"],
      'saveTimeoutMs': _0x4f5e5e?.['saveTimeoutMs']
    }, _0x4f5e5e);
  });
}
function normalizeDreaminaVideoTaskResult(_0xd3f988, _0x28dd1d, {
  allowPending = ![]
} = {}) {
  const _0x4f12fe = normalizeDreaminaTaskSnapshot(_0xd3f988, {
    'submitId': _0x28dd1d
  });
  if (_0x4f12fe?.["phase"] === "failed") {
    const _0x409073 = new Error(_0x4f12fe?.["failReason"] || _0x4f12fe?.["label"] || "查询失败");
    _0x409073['dreaminaSnapshot'] = _0x4f12fe;
    throw _0x409073;
  }
  if (allowPending && _0x4f12fe?.['phase'] !== "done") {
    return {
      'pending': !![],
      'message': _0x4f12fe?.["label"] || '',
      'dreaminaSnapshot': _0x4f12fe
    };
  }
  const _0x4e47a1 = Array["isArray"](_0x4f12fe?.['outputs']) ? _0x4f12fe['outputs'] : [];
  const _0xa54027 = _0x4e47a1["map"](_0x5a4fc1 => {
    const _0x434064 = pickResultLocalPath(_0x5a4fc1);
    return {
      'videoUrl': localPathToUrl(_0x434064) || _0x5a4fc1["localUrl"] || _0x5a4fc1["url"],
      'localPath': _0x434064
    };
  });
  return {
    'isBatch': _0xa54027['length'] > 0x1,
    'dreaminaSnapshot': _0x4f12fe,
    'videos': _0xa54027,
    'videoUrl': localPathToUrl(pickResultLocalPath(_0x4e47a1[0x0])) || _0x4e47a1[0x0]?.["localUrl"] || _0x4e47a1[0x0]?.["url"] || '',
    'localPath': pickResultLocalPath(_0x4e47a1[0x0])
  };
}
export async function probeDreaminaVideoTask(_0x38366b, _0x57614c = {}) {
  const _0x41177a = String(_0x38366b || '')['trim']();
  if (!_0x41177a) {
    throw new Error("缺少 Dreamina 提交ID，无法核验视频任务");
  }
  const _0x2cad1d = await queryDreaminaResult(_0x41177a, {
    'autoDownload': !![],
    'retries': _0x57614c?.["retries"],
    'retryDelay': _0x57614c?.["retryDelay"],
    'signal': _0x57614c?.["signal"]
  });
  return normalizeDreaminaVideoTaskResult(_0x2cad1d, _0x41177a, {
    'allowPending': !![]
  });
}
export async function resumeDreaminaVideoTask(_0x374921, _0x460ea4 = {}) {
  const _0x217d1c = String(_0x374921 || '')['trim']();
  if (!_0x217d1c) {
    throw new Error("缺少 Dreamina 提交ID，无法恢复视频任务");
  }
  const _0x49af0f = await pollDreaminaUntilDone(_0x217d1c, {
    ..._0x460ea4,
    'taskKind': "video"
  });
  return normalizeDreaminaVideoTaskResult(_0x49af0f, _0x217d1c);
}
function buildManifestVideoTaskPollUrls(_0x1dc5fb, _0x2aed74) {
  const _0x1ee0ce = [];
  const _0x1b9f7d = _0x1a4137 => {
    const _0x95b2ca = String(_0x1a4137 || '')["trim"]();
    if (!_0x95b2ca) {
      return;
    }
    const _0x2ba186 = _0x95b2ca["replace"]('{taskId}', encodeURIComponent(String(_0x1dc5fb)));
    if (_0x2ba186 && !_0x1ee0ce["includes"](_0x2ba186)) {
      _0x1ee0ce["push"](_0x2ba186);
    }
  };
  _0x1b9f7d(_0x2aed74?.["urlTemplate"]);
  Array["isArray"](_0x2aed74?.["fallbackUrlTemplates"]) && _0x2aed74["fallbackUrlTemplates"]['forEach'](_0x1b9f7d);
  return _0x1ee0ce;
}
const ASYNC_VIDEO_SUCCESS_STATUSES = new Set(["completed", 'complete', 'done', "finished", "succeeded", "success"]);
const ASYNC_VIDEO_FAILURE_STATUSES = new Set(["failed", 'failure', 'fail', 'error', "cancelled", "canceled", "expired"]);
function shouldRethrowVideoPollingError(_0x27a03a) {
  if (!(_0x27a03a instanceof ApiError)) {
    return ![];
  }
  return _0x27a03a["type"] === ErrorType['TASK_FAILED'] || _0x27a03a["type"] === ErrorType["CONTENT_FILTERED"] || _0x27a03a['type'] === ErrorType["TASK_TIMEOUT"] || _0x27a03a['type'] === ErrorType['AUTH_ERROR'] || _0x27a03a["type"] === ErrorType["FORBIDDEN"] || _0x27a03a["type"] === ErrorType["INVALID_PARAMS"] || _0x27a03a["type"] === ErrorType["INSUFFICIENT_BALANCE"] || _0x27a03a['type'] === ErrorType["MODEL_UNAVAILABLE"] || _0x27a03a['type'] === "PARSE_ERROR";
}
function isAgnesTaskNotExistError(_0x2bbc48) {
  if (!(_0x2bbc48 instanceof ApiError)) {
    return ![];
  }
  const _0x578b51 = String(_0x2bbc48["message"] || '')["trim"]()['toLowerCase']();
  return _0x578b51["includes"]('task_not_exist') || _0x578b51["includes"]("task not exist") || _0x578b51["includes"]('task\x20not\x20found') || _0x578b51["includes"]("video not found") || _0x578b51["includes"]("任务不存在") || _0x578b51["includes"]("任务或视频未找到");
}
function isAgnesVideoId(_0x2842ca) {
  return /^video_/i["test"](String(_0x2842ca || '')["trim"]());
}
function shouldTryManifestPollFallback({
  err: _0x4e6fff,
  pollIndex: _0x875922,
  pollUrls: _0x1e99fd,
  providerId: _0x3afea9,
  pollUrl: _0x1410fd,
  taskId: _0x508fe3
} = {}) {
  if (_0x875922 >= _0x1e99fd["length"] - 0x1 || !(_0x4e6fff instanceof ApiError)) {
    return ![];
  }
  const _0x12338b = String(_0x3afea9 || '')["trim"]()["toLowerCase"]();
  if (_0x12338b === "agnes" && isAgnesVideoId(_0x508fe3)) {
    return ![];
  }
  if (Number(_0x4e6fff["status"] || _0x4e6fff["code"] || 0x0) === 0x194) {
    return !![];
  }
  return _0x12338b === 'agnes' && String(_0x1410fd || '')["includes"]("/agnesapi?") && isAgnesTaskNotExistError(_0x4e6fff);
}
function resolveVideoPollIntervalMs(_0x4ee18d = {}) {
  const _0x1c7261 = Number(_0x4ee18d?.["taskPolling"]?.["pollIntervalMs"] || _0x4ee18d?.["pollIntervalMs"] || 0x7d0);
  if (!Number["isFinite"](_0x1c7261)) {
    return 0x7d0;
  }
  return Math["min"](0x7530, Math["max"](0x3e8, Math["trunc"](_0x1c7261)));
}
function resolveVideoPollAttempts(_0x575644 = {}, _0x35b8d = 0x7d0) {
  const _0x10f9ab = Number(_0x575644?.["taskPolling"]?.['maxWaitMs'] || _0x575644?.["maxWaitMs"]);
  if (!Number["isFinite"](_0x10f9ab) || _0x10f9ab <= 0x0) {
    return 0x258;
  }
  const _0x2dcd82 = Math["min"](0x2 * 0x3c * 0x3c * 0x3e8, Math["max"](0x3c * 0x3e8, Math["trunc"](_0x10f9ab)));
  return Math["max"](0x1, Math["ceil"](_0x2dcd82 / Math['max'](0x1, _0x35b8d)));
}
function resolveVideoTransportErrorPolicy(_0x112083 = {}) {
  const _0x547681 = _0x112083?.["taskPolling"]?.["transportErrorPolicy"];
  if (!_0x547681 || typeof _0x547681 !== 'object' || Array["isArray"](_0x547681)) {
    return null;
  }
  const _0x49f83b = _0x188d53 => new Set((Array["isArray"](_0x188d53) ? _0x188d53 : [])["map"](_0x58334b => Number(_0x58334b))['filter'](_0x223e10 => Number["isInteger"](_0x223e10) && _0x223e10 >= 0x190 && _0x223e10 <= 0x257));
  return {
    'maxConsecutiveErrors': Math['min'](0xa, Math['max'](0x1, Math["trunc"](Number(_0x547681["maxConsecutiveErrors"]) || 0x3))),
    'retryableStatuses': _0x49f83b(_0x547681["retryableStatuses"]),
    'terminalStatuses': _0x49f83b(_0x547681["terminalStatuses"]),
    'surfaceLastError': _0x547681['surfaceLastError'] !== ![]
  };
}
function getVideoPollingErrorStatus(_0x31664e) {
  const _0x4943fc = Number(_0x31664e?.["status"] ?? _0x31664e?.["code"]);
  return Number["isInteger"](_0x4943fc) ? _0x4943fc : null;
}
async function pollVideoTask(_0x48b3ca, _0x2da2ec, _0x5bb842, _0x82e944 = {}) {
  const _0x4964b6 = getProviderConfig(_0x2da2ec);
  const _0x223d55 = resolveVideoPollIntervalMs(_0x82e944);
  const _0x23ef16 = _0x82e944?.['taskPolling']?.['waitUntilTerminal'] === !![];
  const _0x3574bd = _0x23ef16 ? Number["POSITIVE_INFINITY"] : resolveVideoPollAttempts(_0x82e944, _0x223d55);
  const _0x53b7ea = Number["isFinite"](_0x3574bd) ? _0x3574bd * _0x223d55 : Number['POSITIVE_INFINITY'];
  const _0x121eaf = Date['now']();
  const _0x5d2ad1 = resolveVideoTransportErrorPolicy(_0x82e944);
  let _0x3e4351 = 0x0;
  let _0x11a92e = null;
  for (let _0x319036 = 0x0; _0x319036 < _0x3574bd; _0x319036++) {
    if (Date["now"]() - _0x121eaf >= _0x53b7ea) {
      break;
    }
    if (_0x82e944?.['signal']?.['aborted']) {
      throw new Error("CANCELLED");
    }
    await new Promise(_0x4c1978 => setTimeout(_0x4c1978, _0x223d55));
    if (_0x82e944?.['signal']?.["aborted"]) {
      throw new Error("CANCELLED");
    }
    const _0x50df27 = encodeURIComponent(String(_0x48b3ca));
    const _0x1e9770 = String(_0x4964b6['apiUrl'] || '')["replace"](/\/+$/, '') + "/v1/tasks/" + _0x50df27 + (String(_0x2da2ec || '')["trim"]()['toLowerCase']() === 'apimart' ? "?language=zh" : '');
    const _0x204b72 = buildManifestVideoTaskPollUrls(_0x48b3ca, _0x82e944?.['taskPolling']);
    const _0x1d9601 = _0x204b72["length"] > 0x0 ? _0x204b72 : [_0x1e9770];
    for (let _0x5ab2c1 = 0x0; _0x5ab2c1 < _0x1d9601["length"]; _0x5ab2c1 += 0x1) {
      const _0xa72c31 = _0x1d9601[_0x5ab2c1];
      try {
        const _0x431289 = await requester({
          'url': '/api/v2/proxy/task?apiUrl=' + encodeURIComponent(_0xa72c31),
          'method': "GET",
          'headers': {
            'Authorization': "Bearer " + _0x5bb842
          },
          'provider': _0x2da2ec,
          'timeout': 0x7530,
          'signal': _0x82e944?.['signal']
        });
        _0x3e4351 = 0x0;
        _0x11a92e = null;
        const _0x172510 = normalizeAsyncVideoTaskInfo(_0x431289);
        const _0x25a307 = resolveAsyncVideoTaskStatus(_0x172510, _0x82e944?.["responseMapping"]);
        const _0x13c1ff = parseTaskError(_0x2da2ec, _0x172510);
        if (_0x13c1ff) {
          throw _0x13c1ff;
        }
        const _0x50982d = isAsyncVideoTaskSuccessStatus(_0x25a307, _0x82e944?.["taskPolling"]?.["successStatuses"]);
        const _0x3780c0 = extractVideoUrls(_0x172510, _0x82e944?.["responseMapping"])["length"] > 0x0;
        if (_0x50982d && _0x82e944?.['taskPolling']?.['downloadTaskContent'] === !![]) {
          return await saveModelApiVideoContent(_0xa72c31, _0x5bb842, {
            ..._0x82e944,
            'providerId': _0x2da2ec
          });
        }
        if (_0x3780c0 && (!_0x25a307 || _0x50982d)) {
          return processVideoTaskResult(_0x172510, _0x2da2ec, _0x82e944);
        }
        if (_0x50982d) {
          if (_0x82e944?.["taskPolling"]?.["continuePollingOnSuccessWithoutResult"] === !![]) {
            break;
          }
          throw new ApiError({
            'type': "PARSE_ERROR",
            'provider': _0x2da2ec,
            'message': '无法从服务器响应中提取视频地址',
            'raw': _0x172510,
            'retryable': ![]
          });
        }
        if (isAsyncVideoTaskFailureStatus(_0x25a307, _0x82e944?.["taskPolling"]?.["failedStatuses"])) {
          throw ApiError['taskFailed'](_0x2da2ec, extractAsyncVideoTaskFailureReason(_0x172510, _0x82e944?.["responseMapping"]) || "任务状态异常");
        }
        break;
      } catch (_0x3da4d4) {
        const _0x4070c0 = applyManifestErrorRules(_0x3da4d4, _0x82e944?.["errorRules"], {
          'provider': _0x2da2ec,
          'phase': "poll"
        });
        const _0x4d2026 = shouldTryManifestPollFallback({
          'err': _0x4070c0,
          'pollIndex': _0x5ab2c1,
          'pollUrls': _0x1d9601,
          'providerId': _0x2da2ec,
          'pollUrl': _0xa72c31,
          'taskId': _0x48b3ca
        });
        if (_0x4d2026) {
          continue;
        }
        if (shouldRethrowVideoPollingError(_0x4070c0)) {
          throw _0x4070c0;
        }
        if (!_0x5d2ad1) {
          break;
        }
        const _0x87331 = getVideoPollingErrorStatus(_0x4070c0);
        if (_0x4070c0?.["manifestRuleMatched"] === !![] && _0x4070c0?.["retryable"] === ![]) {
          throw _0x4070c0;
        }
        const _0x183253 = _0x4070c0?.["type"] === ErrorType['RATE_LIMIT'];
        if (!_0x183253 && _0x87331 !== null && _0x5d2ad1['terminalStatuses']["has"](_0x87331)) {
          throw _0x4070c0;
        }
        const _0x87aef7 = _0x183253 || (_0x87331 === null ? _0x4070c0?.["retryable"] !== ![] : _0x5d2ad1['retryableStatuses']["has"](_0x87331));
        if (!_0x87aef7) {
          throw _0x4070c0;
        }
        _0x11a92e = _0x4070c0;
        _0x3e4351 += 0x1;
        if (_0x3e4351 >= _0x5d2ad1["maxConsecutiveErrors"]) {
          throw _0x4070c0;
        }
        break;
      }
    }
  }
  if (_0x5d2ad1?.['surfaceLastError'] && _0x11a92e) {
    throw _0x11a92e;
  }
  throw ApiError["taskTimeout"](_0x2da2ec);
}
function normalizeTaskSnapshotPayload(_0x2aee92) {
  if (_0x2aee92 && typeof _0x2aee92 === "object") {
    return _0x2aee92;
  }
  const _0x25023f = String(_0x2aee92 || '')['trim']();
  if (!_0x25023f) {
    return {};
  }
  try {
    return JSON["parse"](_0x25023f);
  } catch {
    return {
      'rawText': _0x25023f
    };
  }
}
function normalizeAsyncVideoTaskInfo(_0x56ff0f) {
  const _0x76d5fb = normalizeTaskSnapshotPayload(_0x56ff0f);
  const _0x7bd99b = _0x76d5fb && typeof _0x76d5fb === "object" && _0x76d5fb["data"] && typeof _0x76d5fb["data"] === 'object' && !Array['isArray'](_0x76d5fb['data']);
  return _0x7bd99b ? {
    ..._0x76d5fb,
    ..._0x76d5fb["data"]
  } : normalizeTaskSnapshotPayload(_0x76d5fb?.["data"] || _0x76d5fb);
}
function resolveAsyncVideoTaskStatus(_0x16b96f, _0x3f1f90 = null) {
  const _0x13051a = resolveMappedResponseValue(_0x16b96f, _0x3f1f90?.['statusPath']);
  if (_0x13051a) {
    return String(_0x13051a)['trim']()["toLowerCase"]();
  }
  const _0x41e051 = Array["isArray"](_0x16b96f?.['data']) ? _0x16b96f["data"][0x0] : _0x16b96f?.["data"] && typeof _0x16b96f["data"] === "object" ? _0x16b96f["data"] : null;
  const _0x34a3db = Array["isArray"](_0x16b96f?.["results"]) ? _0x16b96f["results"][0x0] : _0x16b96f?.["results"] && typeof _0x16b96f["results"] === "object" ? _0x16b96f["results"] : null;
  const _0xaf18a3 = _0x16b96f?.['result'] && typeof _0x16b96f["result"] === "object" ? _0x16b96f['result'] : null;
  const _0x5e7156 = _0x16b96f?.["output"] && typeof _0x16b96f["output"] === "object" ? _0x16b96f["output"] : null;
  return String(_0x41e051?.["status"] || _0x16b96f?.['status'] || _0x16b96f?.["taskStatus"] || _0x16b96f?.['task_status'] || _0x16b96f?.["data"]?.["status"] || _0xaf18a3?.["status"] || _0xaf18a3?.['taskStatus'] || _0xaf18a3?.["task_status"] || _0x5e7156?.["status"] || _0x5e7156?.["taskStatus"] || _0x5e7156?.["task_status"] || _0x34a3db?.["status"] || _0x16b96f?.["state"] || _0x16b96f?.["phase"] || '')["trim"]()['toLowerCase']();
}
function resolveAsyncVideoTaskStatuses(_0x9758b3, _0x1ee454) {
  const _0x17a100 = Array["isArray"](_0x9758b3) ? _0x9758b3["map"](_0x25f663 => String(_0x25f663 || '')["trim"]()["toLowerCase"]())["filter"](_0x97a12f => /^[a-z][a-z0-9_-]{0,63}$/['test'](_0x97a12f)) : [];
  return _0x17a100["length"] > 0x0 ? new Set(_0x17a100) : _0x1ee454;
}
function isAsyncVideoTaskSuccessStatus(_0x506159, _0x5bac8f = null) {
  return resolveAsyncVideoTaskStatuses(_0x5bac8f, ASYNC_VIDEO_SUCCESS_STATUSES)['has'](String(_0x506159 || '')['trim']()['toLowerCase']());
}
function isAsyncVideoTaskFailureStatus(_0x41e4b7, _0x5d46d2 = null) {
  const _0x54ee8a = String(_0x41e4b7 || '')["trim"]()["toLowerCase"]();
  return ASYNC_VIDEO_FAILURE_STATUSES["has"](_0x54ee8a) || resolveAsyncVideoTaskStatuses(_0x5d46d2, ASYNC_VIDEO_FAILURE_STATUSES)["has"](_0x54ee8a);
}
function stringifyTaskFailureValue(_0x29e16d) {
  if (_0x29e16d == null) {
    return '';
  }
  if (typeof _0x29e16d === "string") {
    return _0x29e16d["trim"]();
  }
  if (typeof _0x29e16d === "number" || typeof _0x29e16d === "boolean") {
    return String(_0x29e16d);
  }
  if (typeof _0x29e16d === 'object') {
    const _0x47d783 = _0x29e16d["message"] || _0x29e16d['errorMessage'] || _0x29e16d["error_message"] || _0x29e16d["detail"] || _0x29e16d['reason'] || _0x29e16d["type"] || _0x29e16d['status'] || _0x29e16d["code"];
    if (_0x47d783) {
      return stringifyTaskFailureValue(_0x47d783);
    }
    try {
      return JSON["stringify"](_0x29e16d);
    } catch {
      return String(_0x29e16d || '')["trim"]();
    }
  }
  return String(_0x29e16d || '')["trim"]();
}
function extractAsyncVideoTaskFailureReason(_0x30b87f, _0x292ed7 = null) {
  const _0x432f00 = resolveMappedResponseValues(_0x30b87f, _0x292ed7?.["errorPaths"]);
  const _0x3d3531 = [..._0x432f00, _0x30b87f?.["error"], _0x30b87f?.["error"]?.["message"], _0x30b87f?.["error"]?.['error']?.['message'], _0x30b87f?.["errorMessage"], _0x30b87f?.["error_message"], _0x30b87f?.["message"], _0x30b87f?.["failedReason"], _0x30b87f?.['failReason'], _0x30b87f?.["fail_reason"], _0x30b87f?.["failure_reason"], _0x30b87f?.["data"]?.["error"], _0x30b87f?.['data']?.["error"]?.["message"], _0x30b87f?.["data"]?.["error"]?.["error"]?.['message'], _0x30b87f?.["data"]?.['errorMessage'], _0x30b87f?.['data']?.['error_message'], _0x30b87f?.["data"]?.["message"], _0x30b87f?.["data"]?.["failedReason"], _0x30b87f?.["data"]?.["failReason"], _0x30b87f?.["data"]?.['fail_reason'], _0x30b87f?.["data"]?.["failure_reason"], _0x30b87f?.["result"]?.['error'], _0x30b87f?.["result"]?.["error"]?.["message"], _0x30b87f?.["result"]?.['errorMessage'], _0x30b87f?.["result"]?.["message"], _0x30b87f?.["rawText"]];
  for (const _0x5c5d0b of _0x3d3531) {
    const _0x2b80f6 = stringifyTaskFailureValue(_0x5c5d0b);
    if (_0x2b80f6) {
      return _0x2b80f6;
    }
  }
  return stringifyTaskFailureValue(_0x30b87f?.["error"]) || stringifyTaskFailureValue(_0x30b87f?.["data"]?.["error"]) || stringifyTaskFailureValue(_0x30b87f?.["result"]?.["error"]) || '';
}
function isLikelyVideoUrl(_0x3934a8) {
  const _0xb8c2d0 = String(_0x3934a8 || '')['trim']();
  if (!_0xb8c2d0) {
    return ![];
  }
  if (!/^https?:\/\//i["test"](_0xb8c2d0) && !_0xb8c2d0["startsWith"]('/')) {
    return ![];
  }
  return /\.(mp4|mov|webm|mkv|avi|m4v|m3u8)(\?|#|$)/i['test'](_0xb8c2d0);
}
const RESULT_MEDIA_KIND_FIELDS = ["mediaKind", "mediaType", 'mimeType', "contentType", 'fileType', "outputType", "type", "format", 'extension', "ext"];
function inferVideoResultMediaKind(_0x3ff6c9 = {}, _0x3f5603 = '') {
  const _0x3b2ff0 = String(_0x3f5603 || '')["toLowerCase"]();
  if (/(^|[_-])video($|[_-])/['test'](_0x3b2ff0) || _0x3b2ff0 === "videourl") {
    return 'video';
  }
  if (/(^|[_-])audio($|[_-])/["test"](_0x3b2ff0) || _0x3b2ff0 === "audiourl") {
    return 'audio';
  }
  if (/(^|[_-])(image|img|thumb|thumbnail|poster|cover)($|[_-])/["test"](_0x3b2ff0)) {
    return "image";
  }
  if (!_0x3ff6c9 || typeof _0x3ff6c9 !== 'object' || Array["isArray"](_0x3ff6c9)) {
    return '';
  }
  for (const _0x55ae8b of RESULT_MEDIA_KIND_FIELDS) {
    const _0x5dd0f9 = String(_0x3ff6c9[_0x55ae8b] || '')["trim"]()['toLowerCase']();
    if (!_0x5dd0f9) {
      continue;
    }
    if (/video|mp4|mov|webm|mkv|avi|m4v|m3u8/["test"](_0x5dd0f9)) {
      return "video";
    }
    if (/audio|mp3|wav|aac|m4a|flac|ogg/['test'](_0x5dd0f9)) {
      return "audio";
    }
    if (/image|png|jpe?g|webp|gif/["test"](_0x5dd0f9)) {
      return "image";
    }
  }
  return '';
}
function extractVideoResultEntries(_0x23dfe4) {
  const _0xad4e12 = [];
  const _0x2ecaea = new WeakSet();
  const _0x36f60d = ["videoUrl", "video_url", 'url', 'fileUrl', "file_url", "downloadUrl", "download_url", "contentUrl", "content_url", "output", "mediaUrl", 'media_url', "resultUrl", "result_url", "video"];
  const _0x3f970 = ['thumbUrl', "thumbnailUrl", 'thumbnail_url', "posterUrl", "poster_url"];
  const _0x52cd07 = (_0x58a35b, _0x38fa04 = '') => {
    if (!_0x58a35b || typeof _0x58a35b !== "object" || Array['isArray'](_0x58a35b)) {
      return String(_0x38fa04 || '')['trim']();
    }
    for (const _0x240590 of _0x3f970) {
      const _0x4728fb = String(_0x58a35b[_0x240590] || '')["trim"]();
      if (_0x4728fb) {
        return _0x4728fb;
      }
    }
    return String(_0x38fa04 || '')["trim"]();
  };
  const _0x58f634 = (_0x195ff1, _0x2c38be = {}, _0x2ea2c6 = '') => {
    if (_0x195ff1 == null) {
      return;
    }
    if (Array['isArray'](_0x195ff1)) {
      _0x195ff1["forEach"](_0x338703 => _0x58f634(_0x338703, _0x2c38be, _0x2ea2c6));
      return;
    }
    if (typeof _0x195ff1 === "object") {
      _0x2de6ec(_0x195ff1, _0x2c38be);
      return;
    }
    const _0x266caf = String(_0x195ff1 || '')['trim']();
    if (!_0x266caf) {
      return;
    }
    _0xad4e12['push']({
      'videoUrl': _0x266caf,
      'thumbUrl': _0x52cd07(_0x2c38be),
      'mediaKind': inferVideoResultMediaKind(_0x2c38be, _0x2ea2c6)
    });
  };
  const _0x2de6ec = (_0x4f0f6f, _0x3b0b2b = {}) => {
    if (_0x4f0f6f == null) {
      return;
    }
    if (Array['isArray'](_0x4f0f6f)) {
      _0x4f0f6f["forEach"](_0x466647 => _0x2de6ec(_0x466647, _0x3b0b2b));
      return;
    }
    if (typeof _0x4f0f6f !== "object") {
      return;
    }
    if (_0x2ecaea["has"](_0x4f0f6f)) {
      return;
    }
    _0x2ecaea["add"](_0x4f0f6f);
    const _0x120650 = {
      ..._0x3b0b2b,
      ..._0x4f0f6f,
      'thumbUrl': _0x52cd07(_0x4f0f6f, _0x52cd07(_0x3b0b2b)),
      'mediaKind': inferVideoResultMediaKind(_0x4f0f6f) || inferVideoResultMediaKind(_0x3b0b2b)
    };
    _0x36f60d["forEach"](_0x132db1 => {
      Object["prototype"]['hasOwnProperty']["call"](_0x4f0f6f, _0x132db1) && _0x58f634(_0x4f0f6f[_0x132db1], _0x120650, _0x132db1);
    });
    Object['entries'](_0x4f0f6f)["forEach"](([_0x1aff6e, _0x5043eb]) => {
      if (_0x36f60d["includes"](_0x1aff6e) || _0x3f970['includes'](_0x1aff6e)) {
        return;
      }
      if (_0x5043eb && typeof _0x5043eb === "object") {
        _0x2de6ec(_0x5043eb, _0x120650);
      }
    });
  };
  _0x2de6ec(_0x23dfe4);
  const _0x374fca = [];
  const _0x286f08 = new Set();
  for (const _0x1d7d57 of _0xad4e12) {
    const _0x1a7422 = String(_0x1d7d57?.['videoUrl'] || '')["trim"]();
    if (!_0x1a7422 || _0x286f08["has"](_0x1a7422)) {
      continue;
    }
    _0x286f08["add"](_0x1a7422);
    const _0xbb28a8 = String(_0x1d7d57?.["thumbUrl"] || '')['trim']();
    _0x374fca['push']({
      'videoUrl': _0x1a7422,
      ...(_0xbb28a8 ? {
        'thumbUrl': _0xbb28a8
      } : {}),
      'mediaKind': String(_0x1d7d57?.["mediaKind"] || '')["trim"]()
    });
  }
  const _0xe51ce5 = _0x374fca["filter"](_0x4b40de => _0x4b40de["mediaKind"] === "video" || isLikelyVideoUrl(_0x4b40de["videoUrl"]));
  const _0x5c324d = _0xe51ce5["length"] ? _0xe51ce5 : _0x374fca;
  return _0x5c324d['map'](({
    mediaKind: _0x1644b6,
    ..._0x5a33c4
  }) => _0x5a33c4);
}
function resolveAsyncVideoTaskId(_0xe280ea, _0xa40fda = null) {
  const _0x22c37e = resolveMappedResponseValue(_0xe280ea, _0xa40fda?.["taskIdPath"]);
  if (_0x22c37e) {
    return _0x22c37e;
  }
  if (typeof _0xe280ea?.["data"] === 'string' || typeof _0xe280ea?.["data"] === "number") {
    const _0x16d2ab = String(_0xe280ea["data"])["trim"]();
    if (looksLikeTaskToken(_0x16d2ab)) {
      return _0x16d2ab;
    }
  }
  if (typeof _0xe280ea === "string" || typeof _0xe280ea === "number") {
    const _0x44c113 = String(_0xe280ea)["trim"]();
    if (looksLikeTaskToken(_0x44c113)) {
      return _0x44c113;
    }
  }
  const _0x2237f5 = Array["isArray"](_0xe280ea?.["data"]) ? _0xe280ea["data"][0x0] : _0xe280ea?.["data"] && typeof _0xe280ea["data"] === "object" ? _0xe280ea["data"] : Array["isArray"](_0xe280ea?.["results"]) ? _0xe280ea["results"][0x0] : _0xe280ea?.["results"] && typeof _0xe280ea["results"] === "object" ? _0xe280ea["results"] : null;
  const _0x5703f9 = _0xe280ea?.["result"] && typeof _0xe280ea["result"] === "object" ? _0xe280ea["result"] : null;
  const _0x3a0d95 = _0xe280ea?.["output"] && typeof _0xe280ea['output'] === "object" ? _0xe280ea["output"] : null;
  const _0x2eb135 = _0xe280ea?.["response"] && typeof _0xe280ea['response'] === "object" ? _0xe280ea["response"] : null;
  const _0x47088c = _0x2237f5?.["task_id"] || _0x2237f5?.["taskId"] || _0x2237f5?.['id'] || _0xe280ea?.['task_id'] || _0xe280ea?.['taskId'] || _0xe280ea?.['id'] || _0xe280ea?.["data"]?.["task_id"] || _0xe280ea?.["data"]?.["taskId"] || _0xe280ea?.["data"]?.['id'] || _0x5703f9?.["task_id"] || _0x5703f9?.['taskId'] || _0x5703f9?.['id'] || _0x3a0d95?.['task_id'] || _0x3a0d95?.["taskId"] || _0x3a0d95?.['id'] || _0x2eb135?.['task_id'] || _0x2eb135?.["taskId"] || _0x2eb135?.['id'] || findFirstDeepValueByKeyPattern(_0xe280ea, /^(task_?id|taskid|request_?id|requestid)$/i) || findFirstDeepValueByKeyPattern(_0xe280ea, /^id$/i) || '';
  return String(_0x47088c || '')["trim"]();
}
function extractVideoUrls(_0x561dfc, _0x2dd41b = null) {
  if (_0x561dfc === null || _0x561dfc === undefined) {
    return [];
  }
  const _0x2ffb8e = resolveMappedResponseValues(_0x561dfc, _0x2dd41b?.['resultPaths']);
  if (_0x2ffb8e['length'] > 0x0) {
    return _0x2ffb8e;
  }
  const _0x39ac45 = extractVideoResultEntries(_0x561dfc);
  if (_0x39ac45["length"] > 0x0) {
    return _0x39ac45['map'](_0x3355d1 => _0x3355d1['videoUrl']);
  }
  const _0x100fc0 = [];
  const _0x29c925 = _0x1a00e5 => {
    if (_0x1a00e5 == null) {
      return;
    }
    if (Array["isArray"](_0x1a00e5)) {
      for (const _0x2c6e5f of _0x1a00e5) {
        _0x29c925(_0x2c6e5f);
      }
      return;
    }
    if (typeof _0x1a00e5 === "object") {
      _0x29c925(_0x1a00e5["videoUrl"] || _0x1a00e5["video_url"] || _0x1a00e5["url"] || _0x1a00e5["fileUrl"] || _0x1a00e5["video"] || _0x1a00e5["output"] || _0x1a00e5["mediaUrl"]);
      return;
    }
    const _0x500742 = String(_0x1a00e5 || '')['trim']();
    if (_0x500742) {
      _0x100fc0["push"](_0x500742);
    }
  };
  const _0x3e8983 = _0x424782 => {
    const _0x370ee8 = [];
    const _0x74037f = new Set();
    let _0x40b31f = 0x0;
    const _0x37be28 = (_0xa0ae5, _0x433c5) => {
      if (_0x40b31f > 0x1f40) {
        return;
      }
      if (_0x433c5 > 0x6) {
        return;
      }
      _0x40b31f++;
      if (!_0xa0ae5) {
        return;
      }
      if (typeof _0xa0ae5 === "string") {
        const _0x527474 = _0xa0ae5['trim']();
        isLikelyVideoUrl(_0x527474) && !_0x74037f["has"](_0x527474) && (_0x74037f["add"](_0x527474), _0x370ee8["push"](_0x527474));
        return;
      }
      if (Array['isArray'](_0xa0ae5)) {
        for (const _0x1667c of _0xa0ae5) {
          _0x37be28(_0x1667c, _0x433c5 + 0x1);
        }
        return;
      }
      if (typeof _0xa0ae5 === "object") {
        for (const _0x1ffa58 of Object['values'](_0xa0ae5)) {
          _0x37be28(_0x1ffa58, _0x433c5 + 0x1);
        }
      }
    };
    _0x37be28(_0x424782, 0x0);
    return _0x370ee8;
  };
  if (_0x561dfc['result']?.["videos"] && Array["isArray"](_0x561dfc["result"]["videos"])) {
    for (const _0x1cce9d of _0x561dfc['result']["videos"]) {
      _0x29c925(_0x1cce9d?.["url"] || _0x1cce9d);
    }
  } else {
    if (_0x561dfc['status'] === "succeeded" && _0x561dfc['results']) {
      for (const _0x4e9993 of _0x561dfc["results"]) {
        _0x29c925(_0x4e9993);
      }
    } else {
      if (_0x561dfc["data"]?.[0x0]?.["url"]) {
        for (const _0x26f500 of _0x561dfc['data']) {
          _0x29c925(_0x26f500);
        }
      } else {
        if (_0x561dfc["data"]?.[0x0]?.['fileUrl']) {
          for (const _0x36b742 of _0x561dfc["data"]) {
            _0x29c925(_0x36b742?.["fileUrl"]);
          }
        } else {
          if (_0x561dfc["data"]?.["results"]) {
            for (const _0x2ecba2 of _0x561dfc["data"]['results']) {
              _0x29c925(_0x2ecba2);
            }
          } else {
            if (_0x561dfc["data"]?.[0x0]?.["video"]) {
              for (const _0xc6849a of _0x561dfc['data']) {
                _0x29c925(_0xc6849a?.['video']);
              }
            } else {
              if (Array["isArray"](_0x561dfc["data"])) {
                for (const _0x4fa905 of _0x561dfc['data']) {
                  _0x29c925(_0x4fa905);
                }
              } else {
                if (Array["isArray"](_0x561dfc["videos"])) {
                  for (const _0x5bca74 of _0x561dfc["videos"]) {
                    _0x29c925(_0x5bca74);
                  }
                } else {
                  if (_0x561dfc["status"] === "COMPLETED" && _0x561dfc["results"]) {
                    for (const _0x3b2f57 of _0x561dfc["results"]) {
                      _0x29c925(_0x3b2f57);
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
  const _0x48c5bf = _0x100fc0["filter"](Boolean);
  const _0x29f17d = _0x48c5bf["filter"](isLikelyVideoUrl);
  if (_0x29f17d['length'] > 0x0) {
    return Array["from"](new Set(_0x29f17d));
  }
  if (_0x48c5bf["length"] > 0x0) {
    return Array["from"](new Set(_0x48c5bf));
  }
  return _0x3e8983(_0x561dfc);
}
function extractVideoEntries(_0x37da72, _0x4ff4ff = null) {
  const _0x5a910c = extractVideoResultEntries(_0x37da72);
  if (_0x5a910c['length'] > 0x0) {
    return _0x5a910c;
  }
  const _0x2ecbfc = resolveMappedResponseValues(_0x37da72, _0x4ff4ff?.['resultPaths']);
  if (_0x2ecbfc["length"] > 0x0) {
    return _0x2ecbfc["map"](_0x2fa5c6 => ({
      'videoUrl': String(_0x2fa5c6 || '')["trim"]()
    }))["filter"](_0x5874a0 => _0x5874a0["videoUrl"]);
  }
  return extractVideoUrls(_0x37da72, _0x4ff4ff)["map"](_0x3eb16c => ({
    'videoUrl': String(_0x3eb16c || '')["trim"]()
  }))['filter'](_0x5937d => _0x5937d["videoUrl"]);
}
function processVideoTaskResult(_0x4074fd, _0x346a73, _0x1e28ae = {}) {
  const _0x225abe = extractVideoEntries(_0x4074fd, _0x1e28ae?.["responseMapping"]);
  if (_0x225abe['length'] === 0x0) {
    const _0x356a40 = parseError(_0x346a73, _0x4074fd, 0xc8);
    if (_0x356a40) {
      throw _0x356a40;
    }
    const _0x2a2c36 = parseTaskError(_0x346a73, _0x4074fd);
    if (_0x2a2c36) {
      throw new ApiError({
        'type': "TASK_FAILED",
        'provider': _0x346a73,
        'message': _0x2a2c36["getUserMessage"](),
        'retryable': ![]
      });
    }
    const _0x4343fe = extractAsyncVideoTaskFailureReason(_0x4074fd, _0x1e28ae?.["responseMapping"]);
    if (_0x4343fe) {
      throw new ApiError({
        'type': "TASK_FAILED",
        'provider': _0x346a73,
        'message': _0x4343fe,
        'retryable': ![]
      });
    }
    throw new ApiError({
      'type': "PARSE_ERROR",
      'provider': _0x346a73,
      'message': "无法从服务器响应中提取视频地址",
      'raw': _0x4074fd,
      'retryable': ![]
    });
  }
  return {
    'videoUrl': _0x225abe[0x0]["videoUrl"],
    'thumbUrl': _0x225abe[0x0]["thumbUrl"],
    'isBatch': _0x225abe["length"] > 0x1,
    'videos': _0x225abe
  };
}
function extractVideoUrl(_0x2f84e4) {
  if (_0x2f84e4 === null || _0x2f84e4 === undefined) {
    return null;
  }
  return _0x2f84e4["videoUrl"] || _0x2f84e4['url'] || _0x2f84e4["data"] && _0x2f84e4["data"][0x0]?.["url"] || null;
}
function _normalizeRemoteUrl(_0x37d806) {
  const _0x434cf2 = String(_0x37d806 || '')["trim"]();
  if (!_0x434cf2) {
    return '';
  }
  if (_0x434cf2['startsWith']('//')) {
    return "https:" + _0x434cf2;
  }
  if (_0x434cf2['startsWith']('/')) {
    return _0x434cf2;
  }
  if (/^data:/i["test"](_0x434cf2)) {
    return _0x434cf2;
  }
  if (/^blob:/i["test"](_0x434cf2)) {
    return _0x434cf2;
  }
  if (/^https?:\/\//i["test"](_0x434cf2)) {
    return _0x434cf2;
  }
  return "https://" + _0x434cf2["replace"](/^\/+/, '');
}
function _guessExtFromUrl(_0x257bbf, _0x3b8edc) {
  try {
    const _0x595927 = new URL(String(_0x257bbf || ''), location?.["href"] || undefined);
    const _0x2d27c6 = String(_0x595927["pathname"] || '');
    const _0xbbfb3f = _0x2d27c6["split"]('/')['filter'](Boolean)["pop"]() || '';
    const _0x4e7214 = _0xbbfb3f["lastIndexOf"]('.');
    if (_0x4e7214 > 0x0 && _0x4e7214 < _0xbbfb3f['length'] - 0x1) {
      const _0x418799 = _0xbbfb3f["slice"](_0x4e7214 + 0x1)["toLowerCase"]();
      if (/^[a-z0-9]{1,5}$/["test"](_0x418799)) {
        return _0x418799;
      }
    }
  } catch {}
  return _0x3b8edc;
}
function _toLocalPathIfSameOrigin(_0x52da74) {
  return urlToLocalPath(_0x52da74);
}
function _isRelativeApiUrl(_0x539445) {
  const _0x100fd9 = String(_0x539445 || '')["trim"]();
  return _0x100fd9["startsWith"]('/') && !_0x100fd9['startsWith']('//');
}
function _canFetchOutputUrl(_0x322968) {
  const _0x22d951 = String(_0x322968 || '')["trim"]();
  return /^https?:\/\//i["test"](_0x22d951) || /^data:/i["test"](_0x22d951) || /^blob:/i["test"](_0x22d951) || _isRelativeApiUrl(_0x22d951);
}
async function _fetchOutputBlob(_0x5d6b6e, _0x51c2b5, _0xe05107 = 0x1d4c0) {
  if (_isRelativeApiUrl(_0x5d6b6e)) {
    return await requester({
      'url': _0x5d6b6e,
      'method': "GET",
      'provider': "local",
      'responseType': "blob",
      'signal': _0x51c2b5,
      'timeout': _0xe05107
    });
  }
  return await fetchRemoteBlob(_0x5d6b6e, {
    'signal': _0x51c2b5,
    'timeout': _0xe05107
  });
}
async function _trySaveOutputByClientDownload(_0x40f85c, _0x3c40de, _0x18c78f = {}) {
  const _0x2bc201 = String(_0x40f85c || '')["trim"]();
  if (!_canFetchOutputUrl(_0x2bc201)) {
    return {
      'localPath': null,
      'error': "invalid url"
    };
  }
  const _0x44b882 = _0x18c78f?.["signal"];
  const _0x58de9b = Number(_0x18c78f?.["timeoutMs"]) > 0x0 ? Number(_0x18c78f["timeoutMs"]) : 0x1d4c0;
  let _0x2402f8 = null;
  try {
    _0x2402f8 = await _fetchOutputBlob(_0x2bc201, _0x44b882, _0x58de9b);
  } catch (_0x14e67c) {
    const _0x1af9e6 = _0x14e67c instanceof Error ? _0x14e67c['message'] : String(_0x14e67c || '');
    return {
      'localPath': null,
      'error': _0x1af9e6 || 'client\x20download\x20failed'
    };
  }
  if (!_0x2402f8) {
    return {
      'localPath': null,
      'error': "empty blob"
    };
  }
  const _0x9cad5b = String(_0x3c40de || '')["trim"]()["toLowerCase"]() || "bin";
  const _0x34adb6 = new URLSearchParams({
    'ext': _0x9cad5b
  });
  try {
    const _0x2b2709 = await requester({
      'url': "/api/v2/save_output?" + _0x34adb6['toString'](),
      'method': "POST",
      'provider': "local",
      'timeout': _0x58de9b,
      'signal': _0x44b882,
      'headers': {
        'Content-Type': "application/octet-stream"
      },
      'body': _0x2402f8
    });
    return {
      'localPath': pickResultLocalPath(_0x2b2709) || null,
      'error': null
    };
  } catch (_0x2af4a1) {
    const _0x17eba7 = _0x2af4a1 instanceof Error ? _0x2af4a1["message"] : String(_0x2af4a1 || '');
    return {
      'localPath': null,
      'error': _0x17eba7 || "save failed"
    };
  }
}
async function trySaveOutputFromUrl(_0x4defb3, _0x54a5a1 = {}) {
  const _0x34e01f = _toLocalPathIfSameOrigin(_0x4defb3);
  if (_0x34e01f) {
    return {
      'localPath': _0x34e01f,
      'error': null
    };
  }
  const _0x169b4c = _normalizeRemoteUrl(_0x4defb3);
  if (!_0x169b4c) {
    return {
      'localPath': null,
      'error': 'empty\x20url'
    };
  }
  const _0x2c7a61 = _guessExtFromUrl(_0x169b4c, "mp4");
  const _0x577974 = Number(_0x54a5a1?.["timeoutMs"]) > 0x0 ? Number(_0x54a5a1["timeoutMs"]) : VIDEO_RESULT_SAVE_TIMEOUT_MS;
  const _0x19b6b6 = _0x54a5a1?.['signal'];
  try {
    if (_isRelativeApiUrl(_0x169b4c)) {
      return await _trySaveOutputByClientDownload(_0x169b4c, _0x2c7a61, {
        'signal': _0x19b6b6,
        'timeoutMs': _0x577974
      });
    }
    const _0x201f60 = await requester({
      'url': '/api/v2/save_output_from_url',
      'method': "POST",
      'provider': 'local',
      'timeout': _0x577974,
      'signal': _0x19b6b6,
      'retries': VIDEO_RESULT_SAVE_RETRIES,
      'retryDelay': VIDEO_RESULT_SAVE_RETRY_DELAY_MS,
      'headers': {
        'Content-Type': "application/json"
      },
      'body': JSON["stringify"]({
        'url': _0x169b4c,
        'ext': _0x2c7a61,
        'maxBytes': 0x400 * 0x400 * 0x400,
        'dedupeKey': _0x54a5a1?.["dedupeKey"]
      })
    });
    return {
      'localPath': pickResultLocalPath(_0x201f60) || null,
      'error': null
    };
  } catch (_0x2b698b) {
    const _0x205bed = _0x2b698b instanceof Error ? String(_0x2b698b["message"] || '') : String(_0x2b698b || '');
    const _0x439cd0 = _0x2b698b instanceof ApiError ? _0x2b698b["status"] : null;
    const _0x400ffe = _0x439cd0 === 0x190 || _0x439cd0 === 0x191 || _0x439cd0 === 0x193 || _0x439cd0 === 0x1f6 || _0x439cd0 === 0x1f8;
    if (_0x400ffe) {
      const _0x5254df = await _trySaveOutputByClientDownload(_0x169b4c, _0x2c7a61, {
        'signal': _0x19b6b6,
        'timeoutMs': _0x577974
      });
      if (_0x5254df['localPath']) {
        return _0x5254df;
      }
      if (_0x5254df['error']) {
        return {
          'localPath': null,
          'error': '' + _0x205bed + (_0x5254df['error'] ? '；浏览器兜底失败：' + _0x5254df['error'] : '')
        };
      }
    }
    return {
      'localPath': null,
      'error': _0x205bed || 'save\x20failed'
    };
  }
}
function getVideoResultSourceUrl(_0xf23bde) {
  if (typeof _0xf23bde === "string") {
    return String(_0xf23bde || '')["trim"]();
  }
  if (!_0xf23bde || typeof _0xf23bde !== 'object' || Array["isArray"](_0xf23bde)) {
    return '';
  }
  return String(_0xf23bde["videoUrl"] || _0xf23bde["url"] || _0xf23bde["localUrl"] || localPathToUrl(_0xf23bde["localPath"]) || '')["trim"]();
}
function buildPostProcessedVideoItem(_0x3a8b7c, _0xf359b9 = {}) {
  const _0x527509 = _0x3a8b7c && typeof _0x3a8b7c === "object" && !Array["isArray"](_0x3a8b7c) ? _0x3a8b7c : {
    'videoUrl': _0x3a8b7c
  };
  const _0x4c9d3b = pickResultLocalPath(_0xf359b9) || pickResultLocalPath(_0x527509);
  if (!_0x4c9d3b) {
    const _0x544c8d = String(_0xf359b9?.["error"] || "本地保存未返回有效路径")["trim"]();
    throw new Error("视频已返回，但保存到本地失败：" + _0x544c8d);
  }
  const _0x50b09b = localPathToUrl(_0x4c9d3b);
  if (!_0x50b09b) {
    throw new Error("视频已返回，但保存到本地失败：本地路径无效");
  }
  const _0x32d830 = {
    ..._0x527509,
    'videoUrl': _0x50b09b,
    'sourceUrl': _0x50b09b,
    'url': _0x50b09b,
    'src': _0x50b09b,
    'resultUrl': _0x50b09b,
    'localUrl': _0x50b09b,
    'thumbUrl': '',
    'posterUrl': ''
  };
  _0x32d830["localPath"] = _0x4c9d3b;
  for (const _0x393876 of ['displayLocalPath', "posterUrl", "thumbUrl", "posterLocalPath", "thumbLocalPath", "videoThumbSrc", "videoProxyStatus", 'videoCodec']) {
    if (_0xf359b9?.[_0x393876]) {
      _0x32d830[_0x393876] = _0xf359b9[_0x393876];
    }
  }
  if (_0xf359b9?.["error"]) {
    _0x32d830["saveError"] = _0xf359b9["error"];
  } else {
    delete _0x32d830['saveError'];
  }
  delete _0x32d830["remoteFallbackUrl"];
  delete _0x32d830["localSaveError"];
  return _0x32d830;
}
async function finalizePostProcessedVideoItem(_0x10594a, _0x367b97 = {}) {
  const _0x5368f5 = buildPostProcessedVideoItem(_0x10594a, _0x367b97);
  try {
    return await ensureVideoResultThumbnail(_0x5368f5);
  } catch {
    return _0x5368f5;
  }
}
async function postProcessVideoResult(_0x25029e, _0x1429dc = {}) {
  if (!_0x25029e) {
    return _0x25029e;
  }
  if (Array["isArray"](_0x25029e["videos"])) {
    const _0x37585c = [];
    for (const _0x1b4204 of _0x25029e["videos"]) {
      const _0x9c66a5 = getVideoResultSourceUrl(_0x1b4204);
      if (!_0x9c66a5) {
        continue;
      }
      const _0x201f2a = await trySaveOutputFromUrl(_0x9c66a5, {
        'dedupeKey': _0x1429dc?.["taskKey"] ? _0x1429dc['taskKey'] + ':' + _0x9c66a5 : undefined,
        'signal': _0x1429dc?.["signal"],
        'timeoutMs': _0x1429dc?.["saveTimeoutMs"]
      });
      _0x37585c["push"](await finalizePostProcessedVideoItem(_0x1b4204, _0x201f2a));
    }
    if (_0x37585c["length"] === 0x0 && getVideoResultSourceUrl(_0x25029e)) {
      const _0x345dba = {
        ..._0x25029e
      };
      delete _0x345dba["isBatch"];
      delete _0x345dba["videos"];
      return await postProcessVideoResult(_0x345dba, _0x1429dc);
    }
    if (_0x37585c["length"] === 0x0) {
      throw new ApiError({
        'type': "PARSE_ERROR",
        'provider': _0x1429dc?.["providerId"] || "unknown",
        'message': "无法从服务器响应中提取视频地址",
        'raw': _0x25029e,
        'retryable': ![]
      });
    }
    return {
      'isBatch': Boolean(_0x25029e["isBatch"] || _0x37585c["length"] > 0x1),
      'videos': _0x37585c,
      'videoUrl': _0x37585c[0x0]?.['videoUrl'],
      'sourceUrl': _0x37585c[0x0]?.['sourceUrl'],
      'posterUrl': _0x37585c[0x0]?.["posterUrl"],
      'thumbUrl': _0x37585c[0x0]?.["thumbUrl"],
      'localPath': _0x37585c[0x0]?.["localPath"],
      'displayLocalPath': _0x37585c[0x0]?.['displayLocalPath'],
      'posterLocalPath': _0x37585c[0x0]?.["posterLocalPath"],
      'thumbLocalPath': _0x37585c[0x0]?.["thumbLocalPath"],
      'videoThumbSrc': _0x37585c[0x0]?.["videoThumbSrc"],
      'videoProxyStatus': _0x37585c[0x0]?.["videoProxyStatus"],
      'videoCodec': _0x37585c[0x0]?.['videoCodec'],
      'saveError': _0x37585c[0x0]?.['saveError']
    };
  }
  if (_0x25029e['videoUrl']) {
    const _0x613926 = await trySaveOutputFromUrl(_0x25029e["videoUrl"], {
      'dedupeKey': _0x1429dc?.['taskKey'] ? _0x1429dc["taskKey"] + ':' + _0x25029e["videoUrl"] : undefined,
      'signal': _0x1429dc?.['signal'],
      'timeoutMs': _0x1429dc?.["saveTimeoutMs"]
    });
    return await finalizePostProcessedVideoItem(_0x25029e, _0x613926);
  }
  return _0x25029e;
}
async function resolveVideoResultWithOutputLocalization(_0x16d200, _0x263ac3 = {}, _0x188b0f = {}) {
  return await resolveOutputWithLocalization(_0x16d200, () => postProcessVideoResult(_0x16d200, _0x263ac3), _0x188b0f);
}
function isComfyUiHistoryPolling(_0x1a9bb5 = {}) {
  return String(_0x1a9bb5?.["mode"] || '')['trim']() === "comfyui-history";
}
async function pollComfyUiVideoTask(_0x21a983, _0x3704ef = {}) {
  const _0x9e1101 = String(_0x21a983 || '')["trim"]();
  const _0x5c5c86 = _0x3704ef?.["taskPolling"] || {};
  const _0x3e2145 = String(_0x5c5c86["baseUrl"] || '')['trim']();
  for (let _0x2c08e7 = 0x0; _0x2c08e7 < 0x258; _0x2c08e7++) {
    if (_0x3704ef?.["signal"]?.['aborted']) {
      throw new Error('CANCELLED');
    }
    await new Promise(_0xe086d8 => setTimeout(_0xe086d8, 0x7d0));
    if (_0x3704ef?.["signal"]?.["aborted"]) {
      throw new Error("CANCELLED");
    }
    const _0x545921 = new URLSearchParams({
      'promptId': _0x9e1101,
      ...(_0x3e2145 ? {
        'baseUrl': _0x3e2145
      } : {}),
      ...(_0x5c5c86['allowCloudBaseUrl'] ? {
        'allowCloudBaseUrl': '1'
      } : {})
    });
    const _0x42eb1c = await requester({
      'url': "/api/v2/comfyui/history?" + _0x545921["toString"](),
      'method': 'GET',
      'provider': "comfyui",
      'timeout': 0x7530,
      'signal': _0x3704ef?.["signal"]
    });
    const _0x5c8283 = typeof _0x3704ef?.["resultExtractor"] === "function" ? _0x3704ef["resultExtractor"](_0x42eb1c) : _0x42eb1c;
    if (extractVideoUrls(_0x5c8283, _0x3704ef?.["responseMapping"])['length'] > 0x0) {
      return _0x5c8283;
    }
    const _0xc3afc2 = resolveAsyncVideoTaskStatus(_0x5c8283, _0x3704ef?.["responseMapping"]);
    if (isAsyncVideoTaskFailureStatus(_0xc3afc2, _0x3704ef?.["taskPolling"]?.["failedStatuses"])) {
      const _0x76c8b6 = parseError("comfyui", _0x5c8283, 0xc8);
      if (_0x76c8b6) {
        throw _0x76c8b6;
      }
      throw ApiError["taskFailed"]('comfyui', extractAsyncVideoTaskFailureReason(_0x5c8283, _0x3704ef?.["responseMapping"]) || "ComfyUI 任务执行失败");
    }
  }
  throw ApiError["taskTimeout"]("comfyui");
}
async function generateVideoUnqueued(_0x42115b, _0xa450ab = {}) {
  const _0x3ec3d9 = resolveVideoExecution(_0x42115b);
  const _0x3df87c = resolveVideoProviderId(_0x42115b, _0x3ec3d9);
  const _0x5b26bd = _0x3ec3d9?.["executionManifest"];
  const _0x376e56 = _0x5b26bd?.['adapterType'] === "workflow";
  if (_0x5b26bd?.['adapterType'] === "localRuntime" && _0x5b26bd?.["runtime"] === "dreaminaVideo") {
    const _0x135c21 = {
      ..._0x42115b,
      'prompt': applyCameraAngleToPrompt(_0x42115b["prompt"], _0x42115b["cameraAngle"])
    };
    return await runDreaminaVideoGeneration(_0x135c21, _0xa450ab);
  }
  const _0x4f3d0b = await buildGenerateVideoRequest(_0x42115b);
  const _0xd20d92 = String(_0x4f3d0b?.["providerProfileId"] || _0x4f3d0b?.["rhProviderProfileId"] || _0x42115b?.["providerProfileId"] || _0x42115b?.["rhProviderProfileId"] || '')['trim']();
  const _0x57f302 = _0x3df87c === "runninghubwf" && _0xd20d92 ? {
    ..._0x42115b,
    'providerProfileId': _0xd20d92,
    'rhProviderProfileId': _0xd20d92
  } : _0x42115b;
  const _0x462808 = _0x4f3d0b?.['responseMapping'] || null;
  const _0x319345 = {
    ...(_0xa450ab || {}),
    ...(_0x462808 ? {
      'responseMapping': _0x462808
    } : {}),
    ...(_0x4f3d0b?.['taskPolling'] ? {
      'taskPolling': _0x4f3d0b["taskPolling"]
    } : {}),
    ...(Array["isArray"](_0x4f3d0b?.["errorRules"]) && _0x4f3d0b['errorRules']["length"] > 0x0 ? {
      'errorRules': _0x4f3d0b['errorRules']
    } : {}),
    ...(typeof _0x4f3d0b?.["resultExtractor"] === "function" ? {
      'resultExtractor': _0x4f3d0b["resultExtractor"]
    } : {})
  };
  const _0x2b82ce = {
    ...(_0x4f3d0b["headers"] || {})
  };
  const _0x3739ce = String(_0x42115b?.["installId"] || '')["trim"]();
  if (_0x3739ce) {
    _0x2b82ce["X-AIC-Install-Id"] = _0x3739ce;
  }
  let _0x56c333;
  let _0x24f397 = '';
  let _0x3f252e = null;
  try {
    if (_0x376e56) {
      const _0x2c7fbf = await requester({
        'url': _0x4f3d0b["url"],
        'method': "POST",
        'provider': _0x3df87c,
        'timeout': GENERATION_TIMEOUT,
        'signal': _0xa450ab?.["signal"],
        'headers': _0x2b82ce,
        'body': JSON["stringify"](_0x4f3d0b['body']),
        'responseType': "text",
        'returnMeta': !![]
      });
      _0x24f397 = String(_0x2c7fbf?.["data"] ?? '');
      _0x3f252e = _0x2c7fbf?.["headers"] || null;
      _0x56c333 = parseVideoResponseData(_0x24f397);
    } else {
      _0x56c333 = await requester({
        'url': _0x4f3d0b["url"],
        'method': 'POST',
        'provider': _0x3df87c,
        'timeout': GENERATION_TIMEOUT,
        'signal': _0xa450ab?.["signal"],
        'headers': _0x2b82ce,
        'body': JSON["stringify"](_0x4f3d0b["body"])
      });
    }
  } catch (_0x125471) {
    const _0xe83fa6 = _0x125471 instanceof ApiError ? _0x125471 : parseNetworkError(_0x3df87c, _0x125471, GENERATION_TIMEOUT);
    throw applyManifestErrorRules(_0xe83fa6, _0x319345["errorRules"], {
      'provider': _0x3df87c,
      'phase': "submit"
    });
  }
  let _0x35a040 = null;
  let _0x41aa84 = '';
  if (_0x376e56) {
    if (String(_0x56c333?.["code"] || '') === 'SUBSCRIPTION_REQUIRED') {
      const _0x48a8fa = new Error(_0x56c333?.['message'] || '该模型为\x20VIP，请先激活\x20CDKEY/订阅');
      _0x48a8fa['code'] = "SUBSCRIPTION_REQUIRED";
      _0x48a8fa["contactText"] = _0x56c333?.["contactText"] || '';
      _0x48a8fa["contactUrl"] = _0x56c333?.['contactUrl'] || '';
      throw _0x48a8fa;
    }
    const _0x1e0647 = Number(_0x56c333?.["code"]);
    const _0x158a62 = _0x56c333?.["code"] !== undefined && _0x56c333?.["code"] !== null && Number["isFinite"](_0x1e0647) ? _0x1e0647 : null;
    const _0x4d03ce = resolveRunningHubVideoTaskId(_0x56c333, _0x24f397, _0x3f252e, _0x462808) || null;
    const _0x107188 = _0x4d03ce && (_0x158a62 === 0x324 || _0x158a62 === 0x32d);
    if (_0x158a62 !== null && _0x158a62 !== 0x0 && !_0x107188) {
      const _0x3fcc49 = parseError(_0x3df87c, _0x56c333, 0xc8);
      throw _0x3fcc49 || new ApiError({
        'type': "TASK_FAILED",
        'provider': _0x3df87c,
        'code': _0x158a62,
        'message': String(_0x56c333?.["message"] || _0x56c333?.["msg"] || "RunningHub 任务提交失败"),
        'raw': _0x56c333,
        'retryable': _0x158a62 === 0x1a5
      });
    }
    if (_0x3df87c === "comfyui") {
      const _0x5713b9 = parseError(_0x3df87c, _0x56c333, 0xc8);
      if (_0x5713b9) {
        throw _0x5713b9;
      }
    }
    if (_0x4d03ce) {
      const _0x1e2d32 = String(_0x4d03ce);
      _0x158a62 === 0x32d && _0xa450ab?.["onRunningHubWorkflowQueueChange"]?.({
        'status': 'queued',
        'queueIndex': 0x0,
        'queueLength': 0x1,
        'reason': "provider-accepted-queue",
        'taskId': _0x1e2d32
      });
      _0x41aa84 = resolveVideoRuntimeProviderKey(_0x57f302, _0x3df87c) + ":video:" + _0x1e2d32;
      const _0x275d64 = _0x4f3d0b["useOpenapiQuery"] === !![] || _0x4f3d0b['url'] === "/api/v2/proxy/image";
      _0xa450ab?.["onTaskMeta"]?.({
        'taskId': _0x1e2d32,
        'useOpenapiQuery': _0x275d64,
        ...(_0xd20d92 ? {
          'providerProfileId': _0xd20d92,
          'rhProviderProfileId': _0xd20d92
        } : {})
      });
      _0xa450ab?.['onTaskId']?.(_0x1e2d32);
      const _0x5c9e87 = _0x3df87c === "comfyui" || isComfyUiHistoryPolling(_0x319345["taskPolling"]) ? await pollComfyUiVideoTask(_0x1e2d32, _0x319345) : await pollRunningHubVideoTask(_0x1e2d32, _0x57f302, _0x3df87c, {
        ..._0x319345,
        'useOpenapiQuery': _0x275d64
      });
      _0x35a040 = processVideoTaskResult(_0x5c9e87, _0x3df87c, _0x319345);
    }
  }
  if (!_0x35a040) {
    const _0x374f8c = resolveAsyncVideoTaskId(_0x56c333, _0x462808);
    if (_0x374f8c) {
      const _0x1b4dee = String(_0x374f8c);
      _0x41aa84 = resolveVideoRuntimeProviderKey(_0x42115b, _0x3df87c) + ':video:' + _0x1b4dee;
      const _0x30f159 = resolveVideoProviderConfig(_0x42115b, _0x3df87c);
      const _0x393af4 = _0x4f3d0b["useOpenapiQuery"] === !![] || _0x3df87c === "runninghub" && _0x4f3d0b["url"] === "/api/v2/proxy/image";
      const _0x3f64d7 = _0x42115b["apiKey"] || (_0x3df87c === "runninghub" ? _0x30f159["modelApiKey"] : '') || _0x30f159["apiKey"];
      _0xa450ab?.["onTaskMeta"]?.({
        'taskId': _0x1b4dee,
        'provider': _0x3df87c,
        'kind': "video",
        ...(_0x393af4 ? {
          'useOpenapiQuery': !![]
        } : {})
      });
      _0xa450ab?.['onTaskId']?.(_0x1b4dee);
      if (_0x393af4) {
        const _0x4c6a4e = await pollRunningHubVideoTask(_0x1b4dee, {
          ..._0x42115b,
          'apiKey': _0x3f64d7
        }, _0x3df87c, {
          ..._0x319345,
          'useOpenapiQuery': !![]
        });
        _0x35a040 = processVideoTaskResult(_0x4c6a4e, _0x3df87c, _0x319345);
      } else {
        _0x35a040 = await pollVideoTask(_0x1b4dee, _0x3df87c, _0x3f64d7, _0x319345);
      }
    }
  }
  if (!_0x35a040) {
    const _0x20b496 = extractVideoUrls(_0x56c333, _0x462808)[0x0] || extractVideoUrl(_0x56c333);
    if (!_0x20b496) {
      if (hasExplicitVideoSubmitFailureSignal(_0x56c333)) {
        const _0x13471f = parseError(_0x3df87c, _0x56c333, 0xc8);
        if (_0x13471f) {
          _0x13471f["message"] = _0x13471f["getUserMessage"]();
          throw _0x13471f;
        }
        const _0x525191 = extractAsyncVideoTaskFailureReason(_0x56c333, _0x462808);
        if (_0x525191) {
          throw new ApiError({
            'type': "TASK_FAILED",
            'provider': _0x3df87c,
            'message': _0x525191,
            'raw': _0x56c333,
            'retryable': ![]
          });
        }
      }
      throw buildVideoSubmitMissingResultError(_0x3df87c, _0x56c333, {
        'expectsTaskId': _0x376e56 || _0x4f3d0b?.["isAsync"] === !![] || Boolean(_0x319345["taskPolling"]) || Boolean(_0x462808?.["taskIdPath"])
      });
    }
    _0x35a040 = {
      'videoUrl': _0x20b496
    };
  }
  return await resolveVideoResultWithOutputLocalization(_0x35a040, {
    'providerId': _0x3df87c,
    ...(_0x41aa84 ? {
      'taskKey': _0x41aa84
    } : {}),
    'signal': _0xa450ab?.["signal"],
    'saveTimeoutMs': _0xa450ab?.['saveTimeoutMs']
  }, _0xa450ab);
}
function createRunningHubWorkflowQueueChangeEmitter(_0xaf0c19) {
  if (typeof _0xaf0c19 !== "function") {
    return null;
  }
  let _0x24fbd8 = '';
  return (_0xf99ed7 = {}) => {
    const _0x46e15f = String(_0xf99ed7?.["status"] || '')["trim"]()["toLowerCase"]();
    const _0x4d3d4e = Number(_0xf99ed7?.["queueIndex"] ?? -0x1);
    const _0x976c22 = Number(_0xf99ed7?.["queueLength"] ?? 0x0);
    const _0x36e074 = _0x46e15f + ':' + _0x4d3d4e + ':' + _0x976c22;
    if (_0x36e074 === _0x24fbd8) {
      return ![];
    }
    _0x24fbd8 = _0x36e074;
    _0xaf0c19(_0xf99ed7);
    return !![];
  };
}
export async function generateVideo(_0x159d8d, _0x4718fc = {}) {
  const _0x211c72 = createRunningHubWorkflowQueueChangeEmitter(_0x4718fc?.['onRunningHubWorkflowQueueChange']);
  const _0x10d802 = _0x211c72 ? {
    ..._0x4718fc,
    'onRunningHubWorkflowQueueChange': _0x211c72
  } : _0x4718fc;
  const _0x75ce78 = resolveVideoExecution(_0x159d8d);
  const _0x23d0b4 = resolveVideoProviderId(_0x159d8d, _0x75ce78);
  const _0x9e4ca7 = _0x75ce78?.['executionManifest'];
  if (isRunningHubWorkflowQueueTarget({
    'providerId': _0x23d0b4,
    'adapterType': _0x9e4ca7?.["adapterType"],
    'executionManifest': _0x9e4ca7,
    'payload': _0x159d8d
  })) {
    await ensureConfig();
    const _0x562d48 = resolveRunningHubWorkflowQueueConfig({
      'payload': _0x159d8d,
      'concurrency': _0x4718fc?.["runningHubWorkflowConcurrency"]
    });
    return runWithRunningHubWorkflowQueue({
      ..._0x562d48,
      'signal': _0x10d802?.["signal"],
      'lease': _0x10d802?.["runningHubWorkflowQueueLease"],
      'onQueueChange': _0x10d802?.["onRunningHubWorkflowQueueChange"],
      'autoProbeConcurrency': _0x10d802?.["autoProbeConcurrency"],
      'concurrencyProbe': _0x10d802?.["runningHubWorkflowConcurrencyProbe"],
      'queuePollIntervalMs': _0x10d802?.["runningHubWorkflowQueuePollIntervalMs"]
    }, _0x18e155 => generateVideoUnqueued(_0x159d8d, {
      ..._0x10d802,
      'runningHubWorkflowQueueLease': _0x18e155
    }));
  }
  return generateVideoUnqueued(_0x159d8d, _0x10d802);
}
export const __test__ = {
  'extractVideoEntries': extractVideoEntries,
  'extractVideoUrls': extractVideoUrls,
  'processVideoTaskResult': processVideoTaskResult
};