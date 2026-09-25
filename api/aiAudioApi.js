import { ensureConfig, getProviderConfig } from './configApi.js';
import { processInputAudios, processInputAudiosPreserveOrder } from './audioUploadApi.js';
import { cancelRunningHubTask } from './runninghubTaskApi.js';
import { requester } from './requester.js';
import { createOperationError } from '../src/utils/operationError.js';
import { runTaskSingleFlight } from './taskSingleFlight.js';
import { parseError } from './errors/index.js';
import * as a44_0x223c10 from './adapters/ComfyUiAdapter.js';
import { buildRunningHubImportedAudioRequest } from './adapters/runningHubImportedAudioWorkflow.js';
import { uploadInputToComfyUi } from './comfyUiUploadApi.js';
import { buildAudioRequestFromManifest } from './adapters/ModelApiManifestNormalizer.js';
import { resolveMappedResponseValues } from './adapters/modelApiMappingEngine.js';
import { buildRunningHubNodeInfoListFromManifest } from './adapters/RunningHubWorkflowMappingAdapter.js';
import { isRunningHubWorkflowQueueTarget, resolveRunningHubWorkflowQueueConfig, runWithRunningHubWorkflowQueue } from './runningHubWorkflowQueue.js';
import { hasRunningHubWorkflowPollingTimedOut, resolveRunningHubWorkflowPollingPolicy } from './runningHubWorkflowPollingPolicy.js';
import { resolveRunningHubTaskLifecycleStatus } from './runninghubTaskLifecycle.js';
import { formatRunningHubFailureMessage } from './errors/parsers/RunningHubErrorParser.js';
import { RH_AUDIO_ADVANCED_VOICE_CLONE_MODEL_ID, RH_AUDIO_SEPARATION_MODEL_ID as a44_0x27b6c2, VOLCENGINE_TTS_MODEL_ID, resolveModelExecution, sanitizeModelUiSchemaParams } from '../src/manifests/index.js';
import { buildRunningHubModelApiUrl, getRunningHubProviderProfileId, isRunningHubInternationalOnlyModel, resolveRunningHubModelApiProfileId, resolveRunningHubModelApiBaseUrl } from '../src/modules/runningHubProviderProfiles.js';
import { normalizeRunningHubInstanceType } from '../src/modules/runningHubInstanceTypes.js';
import { buildRunningHubCatalogRequest, prepareRunningHubCatalogRequest } from './adapters/RunningHubAudioModelApiAdapter.js';
const POLL_INTERVAL_MS = 0x7d0;
const POLL_TIMEOUT_MS = 0x1e * 0x3c * 0x3e8;
const POLL_MAX_COUNT = Math["ceil"](POLL_TIMEOUT_MS / POLL_INTERVAL_MS);
const AUDIO_MODEL_API_REQUEST_TIMEOUT_MS = 0x5 * 0x3c * 0x3e8;
const RUNNINGHUB_AUDIO_QUEUE_LIMIT_RETRY_DELAYS_MS = Object["freeze"]([0x5dc, 0xbb8, 0x1388]);
const VOLCENGINE_TTS_BASE_URL = "https://openspeech.bytedance.com/api/v3/tts/unidirectional";
const VOLCENGINE_TTS_RESOURCE_ID = "seed-tts-2.0";
const VOLCENGINE_TTS_V1_RESOURCE_ID = "seed-tts-1.0";
const VOLCENGINE_ICL_RESOURCE_ID = "seed-icl-2.0";
function isVolcengineSpeechModel(_0x2c1fc3) {
  const _0x5938b6 = String(_0x2c1fc3 || '')["trim"]();
  return _0x5938b6 === VOLCENGINE_TTS_MODEL_ID;
}
function generateReqId() {
  return "aic_" + Date['now']() + '_' + Math["random"]()["toString"](0x24)["slice"](0x2, 0xa);
}
export async function cancelRunningHubAudioTask(_0x160ed6 = {}) {
  return cancelRunningHubTask(_0x160ed6);
}
function getAudioSeparationExecutionManifest() {
  const _0x4c8d91 = resolveModelExecution(a44_0x27b6c2)?.["executionManifest"];
  if (!_0x4c8d91) {
    throw new Error("RunningHub audio workflow manifest missing: " + a44_0x27b6c2);
  }
  return _0x4c8d91;
}
function getAudioSeparationResultNodeIds() {
  const _0x3d38f3 = getAudioSeparationExecutionManifest()?.["mapping"]?.["resultNodes"] || {};
  const _0x2b2a9d = String(_0x3d38f3["vocals"] || '')["trim"]();
  const _0x46e5a4 = String(_0x3d38f3["background"] || '')["trim"]();
  if (!_0x2b2a9d || !_0x46e5a4) {
    throw new Error("RunningHub audio workflow manifest missing result nodes: " + a44_0x27b6c2);
  }
  return {
    'vocals': _0x2b2a9d,
    'background': _0x46e5a4
  };
}
function sleep(_0x401961, _0x1597e0 = null) {
  if (_0x1597e0?.['aborted']) {
    return Promise["reject"](new Error("CANCELLED"));
  }
  return new Promise((_0x44db69, _0xe5fb3b) => {
    let _0x5e945a = null;
    const _0x38cfc3 = () => {
      _0x1597e0?.["removeEventListener"] && _0x1597e0["removeEventListener"]("abort", _0x2a3c7b);
    };
    const _0x2a3c7b = () => {
      if (_0x5e945a !== null) {
        clearTimeout(_0x5e945a);
      }
      _0x38cfc3();
      _0xe5fb3b(new Error("CANCELLED"));
    };
    _0x1597e0?.["addEventListener"] && _0x1597e0['addEventListener']('abort', _0x2a3c7b, {
      'once': !![]
    });
    _0x5e945a = setTimeout(() => {
      _0x38cfc3();
      _0x44db69();
    }, _0x401961);
  });
}
function getRunningHubWorkflowProfileId(_0x9b66b2 = {}) {
  const _0x1226eb = getRunningHubProviderProfileId(_0x9b66b2);
  const _0x56e5c4 = resolveModelExecution(_0x9b66b2?.['model'])?.["modelManifest"]?.['modelId'] || _0x9b66b2?.["model"];
  if (!_0x1226eb && !isRunningHubInternationalOnlyModel(_0x56e5c4)) {
    return '';
  }
  return resolveRunningHubModelApiProfileId(_0x56e5c4, _0x1226eb);
}
function resolveRunningHubAudioWorkflowAppId(_0x17dd32, _0x1fc6b5 = '') {
  const _0x322553 = _0x17dd32?.["extensions"]?.["providerProfileBindings"]?.[String(_0x1fc6b5 || '')["trim"]()];
  return String(_0x322553?.["appId"] || _0x322553?.["workflowId"] || _0x17dd32?.["appId"] || _0x17dd32?.["workflowId"] || '')["trim"]();
}
function getVolcengineOfficialTtsResourceId(_0x2fe215) {
  const _0x1b10f8 = String(_0x2fe215 || '')["trim"]();
  if (/_uranus_bigtts$/i["test"](_0x1b10f8)) {
    return VOLCENGINE_TTS_RESOURCE_ID;
  }
  if (/_mars_bigtts$/i["test"](_0x1b10f8)) {
    return VOLCENGINE_TTS_V1_RESOURCE_ID;
  }
  return '';
}
function isVolcengineIclSpeakerId(_0x9104b0) {
  const _0x274aa0 = String(_0x9104b0 || '')["trim"]();
  if (!_0x274aa0) {
    return ![];
  }
  if (/^(ICL_|S_)/i["test"](_0x274aa0)) {
    return !![];
  }
  return !getVolcengineOfficialTtsResourceId(_0x274aa0);
}
function normalizeTextList(_0x2613ff) {
  if (!Array['isArray'](_0x2613ff)) {
    return [];
  }
  return _0x2613ff["map"](_0x4cca81 => String(_0x4cca81 || '')['trim']())["filter"](Boolean);
}
function normalizeRetryDelays(_0x33567e, _0x403523 = RUNNINGHUB_AUDIO_QUEUE_LIMIT_RETRY_DELAYS_MS) {
  const _0x1f2c52 = Array["isArray"](_0x33567e) ? _0x33567e : _0x403523;
  return _0x1f2c52['map'](_0x33e2be => Math["max"](0x0, Math["trunc"](Number(_0x33e2be) || 0x0)))["filter"](_0x214546 => Number["isFinite"](_0x214546));
}
function normalizeRefList(_0x1179ea) {
  if (!Array["isArray"](_0x1179ea)) {
    return [];
  }
  return _0x1179ea['map'](_0x129e27 => {
    if (!_0x129e27 || typeof _0x129e27 !== "object") {
      return null;
    }
    const _0x3cf65f = String(_0x129e27["url"] || '')["trim"]();
    if (!_0x3cf65f) {
      return null;
    }
    return {
      'edgeId': _0x129e27["edgeId"] ? String(_0x129e27["edgeId"]) : '',
      'sourceId': _0x129e27['sourceId'] ? String(_0x129e27["sourceId"]) : '',
      'sourceType': _0x129e27["sourceType"] ? String(_0x129e27["sourceType"]) : '',
      'refSlot': _0x129e27["refSlot"] ? String(_0x129e27["refSlot"]) : '',
      'url': _0x3cf65f
    };
  })["filter"](Boolean);
}
function parseResponseData(_0x583b83) {
  if (!_0x583b83) {
    return {};
  }
  if (typeof _0x583b83 === 'object') {
    return _0x583b83;
  }
  const _0x147836 = String(_0x583b83 || '')["trim"]();
  if (!_0x147836) {
    return {};
  }
  try {
    return JSON['parse'](_0x147836);
  } catch {}
  const _0x518c24 = _0x147836["split"]('\x0a')["filter"](_0x4d31a7 => _0x4d31a7["trim"]()['startsWith']("data:"));
  if (_0x518c24["length"] > 0x0) {
    const _0x3b4025 = _0x518c24[_0x518c24["length"] - 0x1]["replace"](/^data:\s*/, '');
    try {
      return JSON["parse"](_0x3b4025);
    } catch {}
  }
  throw new Error("无法解析 RunningHub 音频接口响应");
}
function extractRunningHubTaskIdFromRawText(_0x12e042) {
  const _0x2b0a70 = String(_0x12e042 || '');
  if (!_0x2b0a70) {
    return '';
  }
  const _0x519b00 = [/"task_id"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /"taskId"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /"taskid"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /"prompt_id"\s*:\s*"?([a-zA-Z0-9._:-]+)"?/i, /\btask[_-]?id\b\s*[:=]\s*["']?([a-zA-Z0-9._:-]+)["']?/i];
  for (const _0x5c12de of _0x519b00) {
    const _0x7e89b7 = _0x2b0a70["match"](_0x5c12de);
    const _0x560a63 = String(_0x7e89b7?.[0x1] || '')["replace"](/,/g, '')["trim"]();
    if (_0x560a63) {
      return _0x560a63;
    }
  }
  return '';
}
function getTaskId(_0x4c4efe, _0x4680a0 = '') {
  const _0x4c4232 = extractRunningHubTaskIdFromRawText(_0x4680a0);
  if (_0x4c4232) {
    return _0x4c4232;
  }
  const _0x191b57 = Array["isArray"](_0x4c4efe?.["data"]) ? _0x4c4efe['data'][0x0] : _0x4c4efe?.["data"] && typeof _0x4c4efe["data"] === "object" ? _0x4c4efe["data"] : null;
  const _0x217300 = Array["isArray"](_0x4c4efe?.['results']) ? _0x4c4efe['results'][0x0] : _0x4c4efe?.["results"] && typeof _0x4c4efe["results"] === 'object' ? _0x4c4efe["results"] : null;
  const _0xfb5c9a = _0x4c4efe?.["result"] && typeof _0x4c4efe['result'] === 'object' ? _0x4c4efe['result'] : null;
  const _0x1c1ce8 = _0x4c4efe?.["output"] && typeof _0x4c4efe["output"] === 'object' ? _0x4c4efe["output"] : null;
  const _0x27d829 = _0x4c4efe?.["response"] && typeof _0x4c4efe["response"] === "object" ? _0x4c4efe['response'] : null;
  const _0x41902a = [_0x4c4efe?.['taskId'], _0x4c4efe?.["task_id"], _0x4c4efe?.["prompt_id"], _0x4c4efe?.['id'], _0x4c4efe?.["data"]?.['taskId'], _0x4c4efe?.["data"]?.["task_id"], _0x4c4efe?.["data"]?.["prompt_id"], _0x4c4efe?.["data"]?.['id'], _0x191b57?.["taskId"], _0x191b57?.["task_id"], _0x191b57?.["prompt_id"], _0x191b57?.['id'], _0xfb5c9a?.["taskId"], _0xfb5c9a?.["task_id"], _0xfb5c9a?.['prompt_id'], _0xfb5c9a?.['id'], _0x1c1ce8?.['taskId'], _0x1c1ce8?.["task_id"], _0x1c1ce8?.["prompt_id"], _0x1c1ce8?.['id'], _0x27d829?.["taskId"], _0x27d829?.['task_id'], _0x27d829?.["prompt_id"], _0x27d829?.['id'], _0x217300?.['taskId'], _0x217300?.['task_id'], _0x217300?.['prompt_id'], _0x217300?.['id']];
  for (const _0x4dd93d of _0x41902a) {
    const _0x571d2b = String(_0x4dd93d || '')["trim"]();
    if (_0x571d2b) {
      return _0x571d2b;
    }
  }
  return '';
}
function getApiErrorMessage(_0x917a8c, _0x46134a = "音频生成失败") {
  return formatRunningHubFailureMessage(_0x917a8c, _0x917a8c?.["message"] || _0x917a8c?.["error"] || _0x917a8c?.["msg"] || _0x917a8c?.["data"]?.["message"] || _0x917a8c?.["data"]?.["error"] || _0x46134a);
}
function collectResponseText(_0x3dc5b7, _0x26643c = []) {
  if (_0x3dc5b7 === null || _0x3dc5b7 === undefined) {
    return _0x26643c;
  }
  if (typeof _0x3dc5b7 === "string" || typeof _0x3dc5b7 === 'number' || typeof _0x3dc5b7 === "boolean") {
    const _0x464f8a = String(_0x3dc5b7 || '')["trim"]();
    if (_0x464f8a) {
      _0x26643c["push"](_0x464f8a);
    }
    return _0x26643c;
  }
  if (Array['isArray'](_0x3dc5b7)) {
    _0x3dc5b7["forEach"](_0x57d6c5 => collectResponseText(_0x57d6c5, _0x26643c));
    return _0x26643c;
  }
  typeof _0x3dc5b7 === 'object' && ["message", "msg", 'error', "errorMessage", "detail", "summary", "suggestion", "code", 'errorCode', "status"]['forEach'](_0x289520 => {
    Object["prototype"]["hasOwnProperty"]["call"](_0x3dc5b7, _0x289520) && collectResponseText(_0x3dc5b7[_0x289520], _0x26643c);
  });
  return _0x26643c;
}
function getRunningHubAudioCreateResponseText(_0x45ea25) {
  return collectResponseText(_0x45ea25)["join"](" | ");
}
function isRunningHubAudioQueueLimitResponse(_0x34ceff) {
  const _0x2bd745 = getRunningHubAudioCreateResponseText(_0x34ceff);
  if (!_0x2bd745) {
    return ![];
  }
  const _0x4f4864 = _0x2bd745["toLowerCase"]();
  return /api\s*queue\s*limit|queue\s*limit|retry\s*later|rate\s*limit|too\s*many|concurren/["test"](_0x4f4864) || /并发.*(上限|上线|达到|超限|限制)|上限.*并发|降低并发|稍后重试|请求频率/["test"](_0x2bd745);
}
function buildRunningHubAudioCreateError(_0x2b2e03) {
  if (String(_0x2b2e03?.['code'] || '') === "SUBSCRIPTION_REQUIRED") {
    const _0x47a48e = new Error(_0x2b2e03?.["message"] || "该模型为 VIP，请先激活 CDKEY/订阅");
    _0x47a48e["code"] = "SUBSCRIPTION_REQUIRED";
    _0x47a48e["contactText"] = _0x2b2e03?.["contactText"] || '';
    _0x47a48e['contactUrl'] = _0x2b2e03?.["contactUrl"] || '';
    _0x47a48e["requiredModelId"] = String(_0x2b2e03?.["requiredModelId"] || '')['trim']();
    _0x47a48e["subscriptionStatus"] = String(_0x2b2e03?.['subscriptionStatus'] || '')["trim"]();
    _0x47a48e['reasonCode'] = String(_0x2b2e03?.['reasonCode'] || '')["trim"]();
    return _0x47a48e;
  }
  const _0x167b60 = Number(_0x2b2e03?.["code"]);
  if (Number['isFinite'](_0x167b60) && _0x167b60 !== 0x0) {
    return new Error(getApiErrorMessage(_0x2b2e03, "音频任务创建失败"));
  }
  const _0x2171ec = String(_0x2b2e03?.['status'] || '')["toUpperCase"]();
  if (_0x2171ec === 'FAILED') {
    const _0x539a8f = String(_0x2b2e03?.['errorMessage'] || _0x2b2e03?.['msg'] || _0x2b2e03?.["message"] || "音频任务创建失败");
    return new Error(_0x539a8f);
  }
  const _0x351fa9 = String(_0x2b2e03?.["errorCode"] || '')['trim']();
  if (_0x351fa9) {
    const _0x5bedbc = String(_0x2b2e03?.["errorMessage"] || _0x2b2e03?.["msg"] || "音频任务创建失败 (" + _0x351fa9 + ')');
    return new Error(_0x5bedbc);
  }
  return null;
}
async function requestRunningHubAudioCreateTask(_0x549cd3, _0x199132, _0x68346c = {}) {
  const _0x10fb38 = normalizeRetryDelays(_0x68346c?.['queueLimitRetryDelaysMs']);
  for (let _0x6bfd2f = 0x0;; _0x6bfd2f += 0x1) {
    const _0x18cd33 = await requester({
      'url': _0x549cd3['url'],
      'method': "POST",
      'provider': _0x199132,
      'timeout': 0x1d4c0,
      'signal': _0x68346c?.["signal"],
      'headers': _0x549cd3["headers"] || {
        'Content-Type': 'application/json'
      },
      'body': JSON["stringify"](_0x549cd3["body"]),
      'responseType': 'auto'
    });
    const _0x39130d = parseResponseData(_0x18cd33);
    const _0x578415 = buildRunningHubAudioCreateError(_0x39130d);
    if (!_0x578415) {
      return {
        'createRaw': _0x18cd33,
        'createData': _0x39130d
      };
    }
    if (isRunningHubAudioQueueLimitResponse(_0x39130d) && _0x6bfd2f < _0x10fb38['length'] && !_0x68346c?.['signal']?.["aborted"]) {
      await sleep(_0x10fb38[_0x6bfd2f], _0x68346c?.["signal"]);
      continue;
    }
    throw _0x578415;
  }
}
function isLikelyAudioUrl(_0x53c7c9) {
  const _0xf0400b = String(_0x53c7c9 || '')["trim"]();
  if (!_0xf0400b) {
    return ![];
  }
  if (!/^https?:\/\//i["test"](_0xf0400b) && !_0xf0400b["startsWith"]('/')) {
    return ![];
  }
  return /\.(wav|mp3|m4a|flac|aac|ogg|opus|wma|amr|aif|aiff|caf|webm)(\?|#|$)/i['test'](_0xf0400b);
}
function isLikelyImageUrl(_0xc3ff95) {
  const _0x1c18fb = String(_0xc3ff95 || '')['trim']();
  if (!_0x1c18fb) {
    return ![];
  }
  if (/^data:image\//i["test"](_0x1c18fb)) {
    return !![];
  }
  if (!/^https?:\/\//i['test'](_0x1c18fb) && !_0x1c18fb['startsWith']('/')) {
    return ![];
  }
  return /\.(png|jpe?g|webp|gif|bmp|svg|avif)(\?|#|$)/i["test"](_0x1c18fb);
}
function extractAudioResultEntries(_0x404f28) {
  const _0x18edd8 = [];
  const _0x594daa = new WeakSet();
  const _0x354ebd = ["audioUrl", 'audio_url', "url", "fileUrl", "download_url", "output", "mediaUrl"];
  const _0x1dca7f = (_0x15a87e, _0x44209d = '') => {
    if (_0x15a87e == null) {
      return;
    }
    if (Array['isArray'](_0x15a87e)) {
      _0x15a87e["forEach"](_0x343dfa => _0x1dca7f(_0x343dfa, _0x44209d));
      return;
    }
    if (typeof _0x15a87e === "object") {
      _0x511651(_0x15a87e, _0x44209d);
      return;
    }
    const _0x4ff443 = String(_0x15a87e || '')["trim"]();
    if (!_0x4ff443) {
      return;
    }
    _0x18edd8['push']({
      'nodeId': String(_0x44209d || '')["trim"](),
      'audioUrl': _0x4ff443
    });
  };
  const _0x511651 = (_0x21c1ee, _0x4b5205 = '') => {
    if (_0x21c1ee == null) {
      return;
    }
    if (Array['isArray'](_0x21c1ee)) {
      _0x21c1ee["forEach"](_0x13c1f2 => _0x511651(_0x13c1f2, _0x4b5205));
      return;
    }
    if (typeof _0x21c1ee !== "object") {
      return;
    }
    if (_0x594daa["has"](_0x21c1ee)) {
      return;
    }
    _0x594daa["add"](_0x21c1ee);
    const _0x4e43f6 = String(_0x21c1ee["nodeId"] || _0x21c1ee["node_id"] || _0x4b5205 || '')["trim"]();
    _0x354ebd["forEach"](_0x384167 => {
      Object["prototype"]["hasOwnProperty"]["call"](_0x21c1ee, _0x384167) && _0x1dca7f(_0x21c1ee[_0x384167], _0x4e43f6);
    });
    Object["entries"](_0x21c1ee)["forEach"](([_0x2283c3, _0x4b92ca]) => {
      if (_0x2283c3 === 'nodeId' || _0x2283c3 === "node_id" || _0x354ebd["includes"](_0x2283c3)) {
        return;
      }
      _0x4b92ca && typeof _0x4b92ca === 'object' && _0x511651(_0x4b92ca, _0x4e43f6);
    });
  };
  _0x511651(_0x404f28);
  const _0x3ddc6e = [];
  const _0x285db7 = new Set();
  for (const _0x34b92d of _0x18edd8) {
    const _0x318a7b = String(_0x34b92d?.["nodeId"] || '')["trim"]();
    const _0x185118 = String(_0x34b92d?.["audioUrl"] || '')["trim"]();
    if (!_0x185118) {
      continue;
    }
    const _0x5f39f0 = _0x318a7b + '::' + _0x185118;
    if (_0x285db7["has"](_0x5f39f0)) {
      continue;
    }
    _0x285db7["add"](_0x5f39f0);
    _0x3ddc6e['push']({
      'nodeId': _0x318a7b,
      'audioUrl': _0x185118
    });
  }
  const _0x4cd349 = _0x3ddc6e['filter'](_0x4b7cd9 => !isLikelyImageUrl(_0x4b7cd9["audioUrl"]));
  const _0x136b96 = _0x4cd349["filter"](_0x2ad2f9 => isLikelyAudioUrl(_0x2ad2f9["audioUrl"]));
  return _0x136b96["length"] ? _0x136b96 : _0x4cd349;
}
function extractAudioUrls(_0x330abd) {
  return extractAudioResultEntries(_0x330abd)['map'](_0xf87bfe => _0xf87bfe["audioUrl"]);
}
function extractMappedAudioResultEntries(_0x8b4b0, _0x1d8189 = null) {
  const _0x584dc7 = _0x1d8189?.["resultPaths"] || _0x1d8189?.["paths"] || [];
  const _0x50aa36 = resolveMappedResponseValues(_0x8b4b0, _0x584dc7)["map"](_0x3e7109 => String(_0x3e7109 || '')["trim"]())['filter'](Boolean);
  if (_0x50aa36['length'] === 0x0) {
    return extractAudioResultEntries(_0x8b4b0);
  }
  return _0x50aa36["map"](_0x404ee9 => ({
    'nodeId': '',
    'audioUrl': _0x404ee9
  }));
}
function normalizeAudioTaskResult(_0x3550ba, _0x21f9f0, _0x461e68 = 0x1) {
  const _0x570c19 = Array["isArray"](_0x3550ba) ? _0x3550ba["map"](_0x56ff76 => {
    if (_0x56ff76 && typeof _0x56ff76 === 'object') {
      return {
        'nodeId': String(_0x56ff76["nodeId"] || _0x56ff76["node_id"] || '')["trim"](),
        'audioUrl': String(_0x56ff76['audioUrl'] || _0x56ff76["url"] || '')['trim']()
      };
    }
    return {
      'nodeId': '',
      'audioUrl': String(_0x56ff76 || '')["trim"]()
    };
  })["filter"](_0x2f18bf => !!_0x2f18bf["audioUrl"] && !isLikelyImageUrl(_0x2f18bf["audioUrl"])) : [];
  if (_0x570c19["length"] < Math["max"](0x1, Number(_0x461e68) || 0x1)) {
    throw new Error(String(_0x21f9f0 || "任务已完成，但未提取到音频地址"));
  }
  const _0x3f98c9 = _0x570c19["map"](_0x2f756d => ({
    'audioUrl': _0x2f756d['audioUrl'],
    ...(_0x2f756d["nodeId"] ? {
      'nodeId': _0x2f756d["nodeId"]
    } : {})
  }));
  return {
    'audioUrl': _0x570c19[0x0]["audioUrl"],
    'isBatch': _0x570c19["length"] > 0x1,
    'audios': _0x3f98c9
  };
}
function normalizeAudioSeparationTaskResult(_0x4c9249, _0x243dd2) {
  const _0xae3e15 = getAudioSeparationResultNodeIds();
  const _0x584f8b = Array["isArray"](_0x4c9249) ? _0x4c9249['map'](_0x578461 => ({
    'nodeId': String(_0x578461?.["nodeId"] || '')["trim"](),
    'audioUrl': String(_0x578461?.["audioUrl"] || '')["trim"]()
  }))["filter"](_0x3e9a51 => !!_0x3e9a51["audioUrl"]) : [];
  const _0x5988e2 = _0x584f8b["some"](_0x5cebdc => _0x5cebdc['nodeId'] === _0xae3e15["vocals"] || _0x5cebdc["nodeId"] === _0xae3e15['background']);
  let _0x148fbc = _0x584f8b;
  if (_0x5988e2) {
    const _0x5c5f29 = _0x584f8b["find"](_0x4a64ef => _0x4a64ef["nodeId"] === _0xae3e15['vocals']) || null;
    const _0x1c4958 = _0x584f8b["find"](_0x1b2ed8 => _0x1b2ed8['nodeId'] === _0xae3e15["background"]) || null;
    if (!_0x5c5f29 || !_0x1c4958) {
      throw new Error(String(_0x243dd2 || "任务已完成，但未提取到人声和背景声音频地址"));
    }
    _0x148fbc = [{
      ..._0x5c5f29,
      'role': "vocals"
    }, {
      ..._0x1c4958,
      'role': "background"
    }];
  } else {
    _0x148fbc = _0x584f8b["slice"](0x0, 0x2)["map"]((_0x3cd197, _0x53d2ec) => ({
      ..._0x3cd197,
      'role': _0x53d2ec === 0x0 ? 'vocals' : "background"
    }));
  }
  if (_0x148fbc["length"] < 0x2) {
    throw new Error(String(_0x243dd2 || '任务已完成，但未提取到人声和背景声音频地址'));
  }
  return {
    'audioUrl': _0x148fbc[0x0]["audioUrl"],
    'isBatch': !![],
    'vocalsAudioUrl': _0x148fbc[0x0]["audioUrl"],
    'backgroundAudioUrl': _0x148fbc[0x1]["audioUrl"],
    'audios': _0x148fbc['map'](_0x277f3f => ({
      'audioUrl': _0x277f3f["audioUrl"],
      'nodeId': _0x277f3f['nodeId'],
      'role': _0x277f3f["role"]
    }))
  };
}
function normalizeAdvancedVoiceClonePrompt(_0x33b2b0) {
  return String(_0x33b2b0 || '')['trim']()["replace"](/(^|\s+)@?音频1\s*[:：]?\s*/g, "$1[speaker_1]: ")["replace"](/(^|\s+)@?音频2\s*[:：]?\s*/g, "$1[speaker_2]: ")['replace'](/\s+(\[speaker_[12]\]:)/g, "\n$1")['trim']();
}
function getMappingNode(_0x389085, _0x46a2a6, _0x1399ec) {
  const _0x2d5978 = _0x389085?.[_0x46a2a6];
  const _0x20d5cc = String(_0x2d5978?.["nodeId"] || '')['trim']();
  const _0x166973 = String(_0x2d5978?.["fieldName"] || '')["trim"]();
  if (!_0x20d5cc || !_0x166973) {
    throw new Error("音频工作流 manifest 缺少 " + _0x1399ec + " 节点映射");
  }
  return {
    'nodeId': _0x20d5cc,
    'fieldName': _0x166973
  };
}
function createNodeInfo(_0x47a762, _0x2923dd, _0x547aa6 = '') {
  return {
    'nodeId': _0x47a762["nodeId"],
    'fieldName': _0x47a762["fieldName"],
    'fieldValue': _0x2923dd,
    ...(_0x547aa6 ? {
      'description': _0x547aa6
    } : {})
  };
}
function resolveAudioWorkflowInputValue(_0x4ac686 = [], _0x3af55d = {}) {
  const _0xe919cd = String(_0x3af55d['slot'] || _0x3af55d['refSlot'] || '')["trim"]();
  if (_0xe919cd) {
    return (Array['isArray'](_0x4ac686) ? _0x4ac686 : [])['find'](_0x67cfa => String(_0x67cfa?.["refSlot"] || '')["trim"]() === _0xe919cd)?.["url"] || '';
  }
  const _0xd93a6 = Math["max"](0x0, Math["trunc"](Number(_0x3af55d["index"]) || 0x0));
  return String((Array["isArray"](_0x4ac686) ? _0x4ac686 : [])[_0xd93a6]?.['url'] || '');
}
async function buildGenericAudioWorkflowNodeInfoList(_0x2340bd = {}, _0x85d9d8 = [], _0x1af3c3 = '', _0x36ab85 = {}) {
  return buildRunningHubNodeInfoListFromManifest({
    'mapping': _0x2340bd,
    'payload': _0x36ab85,
    'finalPrompt': _0x1af3c3,
    'sourceResolvers': {
      'audioInput': ({
        item: _0x34c5ee
      }) => resolveAudioWorkflowInputValue(_0x85d9d8, _0x34c5ee)
    }
  });
}
const KNOWN_AUDIO_REF_SLOTS = new Set(["audioRef", "audioTarget", "audio1", "audio2", "audio", "sourceAudio", "referenceAudio"]);
function normalizeAudioItemsBySlotOrder(_0x237bc9 = [], _0x2e749c = [], {
  remapKnownForeignSlots = !![]
} = {}) {
  const _0x3859b7 = (Array["isArray"](_0x2e749c) ? _0x2e749c : [])["map"](_0xdf12a9 => String(_0xdf12a9 || '')["trim"]())["filter"](Boolean);
  if (_0x3859b7["length"] === 0x0) {
    return _0x237bc9;
  }
  const _0x4475f5 = new Set();
  return (Array["isArray"](_0x237bc9) ? _0x237bc9 : [])['map'](_0x185387 => {
    const _0x30c1b0 = String(_0x185387?.["refSlot"] || '')["trim"]();
    if (_0x30c1b0 && _0x3859b7["includes"](_0x30c1b0) && !_0x4475f5['has'](_0x30c1b0)) {
      _0x4475f5["add"](_0x30c1b0);
      return {
        ..._0x185387,
        'refSlot': _0x30c1b0
      };
    }
    if (_0x30c1b0 && remapKnownForeignSlots !== !![] && KNOWN_AUDIO_REF_SLOTS["has"](_0x30c1b0)) {
      return {
        ..._0x185387,
        'refSlot': _0x30c1b0
      };
    }
    const _0x498c8b = _0x3859b7["find"](_0x2d1b7e => !_0x4475f5['has'](_0x2d1b7e)) || '';
    if (!_0x498c8b) {
      return {
        ..._0x185387,
        'refSlot': _0x3859b7["includes"](_0x30c1b0) ? _0x30c1b0 : ''
      };
    }
    _0x4475f5["add"](_0x498c8b);
    return {
      ..._0x185387,
      'refSlot': _0x498c8b
    };
  });
}
async function buildNodeInfoList(_0x49ee97, _0x543926, _0x1f30ec, _0x7b4fed = {}) {
  const _0x2fb243 = _0x49ee97?.["mapping"] || {};
  const _0x91c402 = String(_0x2fb243?.["preset"] || '')['trim']();
  if (_0x91c402 === "rh-audio-indextts2-clone") {
    const _0x352dae = normalizeAudioItemsBySlotOrder(_0x543926, ["audioRef", 'audio2'], {
      'remapKnownForeignSlots': ![]
    });
    const _0x31d8f1 = new Map(_0x352dae["map"](_0x5c9040 => [String(_0x5c9040["refSlot"] || ''), _0x5c9040]));
    const _0x3ac6cd = _0x31d8f1["get"]('audioRef') || null;
    const _0x42fe47 = _0x31d8f1["get"]("audio2") || null;
    if (!_0x3ac6cd?.["url"]) {
      throw new Error("音色克隆V1需要参考音色");
    }
    const _0x42ac28 = !!_0x42fe47?.["url"];
    if (!_0x42ac28 && !_0x1f30ec) {
      throw new Error("音色克隆V1需要提示词内容");
    }
    const _0x255fd3 = getMappingNode(_0x2fb243, "refAudioNode", '参考音色');
    const _0x25f033 = getMappingNode(_0x2fb243, 'audio2Node', "音频2");
    const _0x32f28f = getMappingNode(_0x2fb243, "promptNode", "提示词");
    const _0x10e4cf = getMappingNode(_0x2fb243, "indexNode", "模型选择");
    const _0x2cd833 = [createNodeInfo(_0x255fd3, _0x3ac6cd["url"], '克隆声音')];
    _0x42ac28 && _0x2cd833["push"](createNodeInfo(_0x25f033, _0x42fe47["url"], "音频2"));
    const _0x3a4248 = _0x42ac28 ? _0x1f30ec ? '1' : '2' : '0';
    _0x2cd833["push"](createNodeInfo(_0x32f28f, _0x1f30ec, '提示词'), createNodeInfo(_0x10e4cf, _0x3a4248, "模型选择"));
    return _0x2cd833;
  }
  if (_0x91c402 === 'rh-audio-voice-convert') {
    const _0x164832 = normalizeAudioItemsBySlotOrder(_0x543926, ["audioRef", "audioTarget"]);
    const _0x49de68 = new Map(_0x164832['map'](_0x4b741e => [String(_0x4b741e["refSlot"] || ''), _0x4b741e]));
    const _0x5c3223 = _0x49de68["get"]("audioRef") || null;
    const _0x155043 = _0x49de68['get']('audioTarget') || null;
    if (!_0x5c3223?.["url"] || !_0x155043?.["url"]) {
      throw new Error("音色转换需要声线参考和语气参考");
    }
    const _0x3da010 = getMappingNode(_0x2fb243, "refAudioNode", '声线参考');
    const _0x30450f = getMappingNode(_0x2fb243, "targetAudioNode", '语气参考');
    return [createNodeInfo(_0x3da010, _0x5c3223["url"]), createNodeInfo(_0x30450f, _0x155043["url"])];
  }
  if (_0x91c402 === 'rh-audio-advanced-voice-clone') {
    const _0x3f56d3 = normalizeAudioItemsBySlotOrder(_0x543926, ["audio1", "audio2"]);
    const _0x579f8c = new Map(_0x3f56d3["map"](_0x226ef3 => [String(_0x226ef3["refSlot"] || ''), _0x226ef3]));
    const _0x5d82ad = _0x579f8c["get"]('audio1') || null;
    const _0x1d308d = _0x579f8c['get']("audio2") || null;
    if (!_0x1f30ec) {
      throw new Error('进阶声音克隆需要提示词内容');
    }
    const _0x13decf = getMappingNode(_0x2fb243, 'audio1Node', "音频1");
    const _0x41673a = getMappingNode(_0x2fb243, "audio2Node", "音频2");
    const _0x29cb0b = getMappingNode(_0x2fb243, 'promptNode', "提示词");
    const _0x329b1a = getMappingNode(_0x2fb243, "indexNode", '音频数量');
    const _0x121a7a = [];
    _0x5d82ad?.['url'] && _0x121a7a["push"](createNodeInfo(_0x13decf, _0x5d82ad["url"], "audio"));
    _0x1d308d?.["url"] && _0x121a7a["push"](createNodeInfo(_0x41673a, _0x1d308d["url"], "audio"));
    _0x121a7a["push"](createNodeInfo(_0x29cb0b, normalizeAdvancedVoiceClonePrompt(_0x1f30ec), 'prompt'), createNodeInfo(_0x329b1a, String([_0x5d82ad?.["url"], _0x1d308d?.['url']]["filter"](Boolean)["length"]), "index"));
    return _0x121a7a;
  }
  const _0x4ecf4c = await buildGenericAudioWorkflowNodeInfoList(_0x2fb243, _0x543926, _0x1f30ec, _0x7b4fed);
  if (_0x4ecf4c) {
    return _0x4ecf4c;
  }
  throw new Error('未选择可用的音频工作流');
}
export async function buildGenerateAudioRequest(_0x1647c4, _0x375c23 = {}) {
  await ensureConfig();
  const _0xa61aff = String(_0x1647c4?.["audioWorkflowKey"] || '')['trim']();
  const _0x232eae = resolveModelExecution(_0xa61aff);
  if (!_0x232eae) {
    throw new Error('未选择可用的音频模型');
  }
  const _0xb9fda9 = String(_0x232eae['modelManifest']?.["provider"] || _0x1647c4?.["provider"] || "runninghubwf")["trim"]();
  const _0x318972 = normalizeTextList(_0x1647c4?.['textInputs']);
  const _0x5435bd = String(_0x1647c4?.["prompt"] || '')['trim']();
  const _0x37f75c = _0x5435bd || _0x318972['join']('\x0a')["trim"]();
  const _0x2d8fdf = normalizeRefList(_0x1647c4?.["audioRefs"]);
  const _0x383f5f = normalizeRefList(_0x1647c4?.["videoRefs"]);
  const _0x532f07 = String(_0x1647c4?.["installId"] || '')["trim"]();
  const _0x3af114 = _0x1647c4?.["generationParams"] || {};
  if (_0x232eae["executionManifest"]["extensions"]?.["audioModelApi"]) {
    return buildRunningHubCatalogRequest({
      ..._0x1647c4,
      'signal': _0x375c23['signal'] || _0x1647c4["signal"]
    }, _0x37f75c, _0x232eae, {
      'getProviderConfig': getProviderConfig
    });
  }
  if (_0xb9fda9 === 'volcengine-speech' && _0x232eae?.["modelManifest"]?.["modelId"] === "volcengine-speech/tts") {
    return buildVolcengineSpeechRequest({
      'payload': _0x1647c4,
      'resolved': _0x232eae,
      'workflowKey': _0xa61aff,
      'prompt': _0x37f75c,
      'textInputs': _0x318972,
      'audioRefs': _0x2d8fdf,
      'videoRefs': _0x383f5f,
      'installId': _0x532f07,
      'generationParams': _0x3af114
    });
  }
  if (_0xb9fda9 === "runninghub" && _0x232eae?.["executionManifest"]?.["adapterType"] === 'modelApi') {
    return buildRunningHubAudioModelApiRequest({
      'payload': _0x1647c4,
      'resolved': _0x232eae,
      'workflowKey': _0xa61aff,
      'prompt': _0x37f75c,
      'textInputs': _0x318972,
      'audioRefs': _0x2d8fdf,
      'videoRefs': _0x383f5f,
      'installId': _0x532f07,
      'generationParams': _0x3af114
    });
  }
  if (_0x232eae?.["executionManifest"]?.["adapterType"] === 'modelApi') {
    const _0x1fd149 = await buildAudioRequestFromManifest({
      ..._0x1647c4,
      'model': _0xa61aff,
      'audioWorkflowKey': _0xa61aff
    }, _0x37f75c, {
      'getProviderConfig': getProviderConfig,
      'processInputAudios': processInputAudios
    }, {
      'expectedProvider': _0x232eae?.['modelManifest']?.["provider"] || _0xb9fda9
    });
    if (_0x1fd149) {
      return {
        ..._0x1fd149,
        'meta': {
          ...(_0x1fd149["meta"] || {}),
          'audioWorkflowKey': _0xa61aff,
          'audioWorkflowLabel': String(_0x1647c4?.['audioWorkflowLabel'] || '')["trim"](),
          'nodeId': String(_0x1647c4?.["nodeId"] || '')["trim"](),
          'installId': _0x532f07,
          'prompt': _0x37f75c,
          'textInputs': _0x318972,
          'audioRefs': _0x2d8fdf,
          'videoRefs': _0x383f5f
        }
      };
    }
    throw new Error((_0x232eae?.["modelManifest"]?.["provider"] || _0xb9fda9) + " audio model API manifest missing: " + _0xa61aff);
  }
  if (_0xb9fda9 === 'comfyui' && _0x232eae?.["executionManifest"]?.["adapterType"] === "workflow") {
    const _0x1f12c1 = await a44_0x223c10["buildAudioRequest"]({
      ..._0x1647c4,
      'model': _0xa61aff
    }, _0x37f75c, {
      'getProviderConfig': getProviderConfig,
      'uploadInputToComfyUi': uploadInputToComfyUi
    });
    return {
      ..._0x1f12c1,
      'meta': {
        'provider': "comfyui",
        'adapterType': "workflow",
        'audioWorkflowKey': _0xa61aff,
        'audioWorkflowLabel': String(_0x1647c4?.['audioWorkflowLabel'] || '')["trim"](),
        'model': _0x232eae["modelManifest"]['modelId'],
        'executionId': _0x232eae["executionManifest"]['id'],
        'nodeId': String(_0x1647c4?.["nodeId"] || '')["trim"](),
        'installId': _0x532f07,
        'isComfyUiAudio': !![],
        'prompt': _0x37f75c,
        'textInputs': _0x318972,
        'audioRefs': _0x2d8fdf,
        'videoRefs': _0x383f5f
      }
    };
  }
  if (_0x232eae["executionManifest"]["submitMode"] === "runninghub-task-create") {
    return buildRunningHubImportedAudioRequest(_0x1647c4, _0x37f75c, _0x232eae, {
      'getProviderConfig': getProviderConfig
    });
  }
  const _0x240800 = getRunningHubWorkflowProfileId(_0x1647c4);
  const _0xe8d165 = getProviderConfig(_0x240800 || 'runninghubwf');
  const _0x3bc759 = String(_0x240800 || _0xe8d165?.["providerProfileId"] || '')["trim"]();
  const _0x74532f = resolveRunningHubAudioWorkflowAppId(_0x232eae?.["executionManifest"], _0x3bc759);
  if (!_0x74532f) {
    throw new Error("未选择可用的音频工作流");
  }
  const _0x3e1bd2 = String(_0x1647c4?.["apiKey"] || _0xe8d165?.["apiKey"] || '')["trim"]();
  const _0x6a8371 = resolveRunningHubModelApiBaseUrl(_0x3bc759);
  if (!_0x3e1bd2) {
    throw new Error('RunningHub\x20API\x20Key\x20未配置');
  }
  const _0x31d6d5 = normalizeRunningHubInstanceType(_0x1647c4?.["rhInstanceType"]);
  const _0x2aa376 = await processInputAudiosPreserveOrder(_0x2d8fdf["map"](_0x36d197 => _0x36d197["url"]), _0x3e1bd2, {
    'strictUpload': !![],
    'apiUrl': _0x6a8371
  });
  const _0x1ca2ab = _0x2d8fdf["map"]((_0x2cccae, _0x2e33c0) => ({
    ..._0x2cccae,
    'url': String(_0x2aa376[_0x2e33c0] || '')["trim"]()
  }))['filter'](_0x12712e => !!_0x12712e["url"]);
  const _0x14f403 = await buildNodeInfoList(_0x232eae["executionManifest"], _0x1ca2ab, _0x37f75c, _0x1647c4);
  return {
    'url': "/api/v2/proxy/image",
    'headers': {
      'Content-Type': "application/json",
      ...(_0x532f07 ? {
        'X-AIC-Install-Id': _0x532f07
      } : {})
    },
    'body': {
      'apiUrl': _0x6a8371 + "/openapi/v2/run/ai-app/" + _0x74532f,
      'apiKey': _0x3e1bd2,
      'nodeInfoList': _0x14f403,
      'instanceType': _0x31d6d5,
      'usePersonalQueue': 'false'
    },
    'meta': {
      'provider': _0xb9fda9,
      ...(_0x3bc759 ? {
        'providerProfileId': _0x3bc759,
        'rhProviderProfileId': _0x3bc759
      } : {}),
      'apiUrl': _0x6a8371,
      'audioWorkflowKey': _0xa61aff,
      'audioWorkflowLabel': String(_0x1647c4?.["audioWorkflowLabel"] || '')["trim"](),
      'model': _0xa61aff === RH_AUDIO_ADVANCED_VOICE_CLONE_MODEL_ID ? _0x232eae["modelManifest"]["modelId"] : _0xa61aff,
      'executionId': _0x232eae["executionManifest"]['id'],
      'nodeId': String(_0x1647c4?.['nodeId'] || '')["trim"](),
      'installId': _0x532f07,
      'rhInstanceType': _0x31d6d5,
      'prompt': _0x37f75c,
      'textInputs': _0x318972,
      'audioRefs': _0x2d8fdf,
      'videoRefs': _0x383f5f
    }
  };
}
async function buildVolcengineSpeechRequest({
  payload: _0x17da34,
  resolved: _0x17aa2c,
  workflowKey: _0x4a6e36,
  prompt: _0x3f7a2f,
  textInputs: _0x829685,
  audioRefs: _0x2afd27,
  videoRefs: _0x2b7787,
  installId: _0x294777,
  generationParams: _0x34edac
}) {
  const _0x3fc657 = getProviderConfig("volcengine-speech");
  const _0x31a949 = String(_0x17da34?.["apiKey"] || _0x3fc657?.["apiKey"] || '')["trim"]();
  if (!_0x31a949) {
    throw new Error('火山语音\x20API\x20Key\x20未配置，请在设置\x20>\x20API\x20Key\x20>\x20火山语音中配置');
  }
  const _0x2c7a28 = _0x34edac || {};
  const _0xcf5f83 = String(_0x2c7a28["format"] || 'mp3')["trim"]() === "ogg" ? "ogg_opus" : String(_0x2c7a28["format"] || "mp3")["trim"]();
  const _0x10e3dd = Number(_0x2c7a28['speechRate']);
  const _0x4a230e = Number(_0x2c7a28["loudnessRate"]);
  const _0x179c13 = Number(_0x2c7a28["pitch"]);
  const _0x2efd44 = Number(_0x2c7a28["sampleRate"] || 0x5dc0);
  const _0x42a4ce = String(_0x2c7a28["speakerId"] || '')['trim']();
  const _0x255402 = _0x42a4ce && _0x42a4ce !== '-' ? _0x42a4ce : '';
  const _0x93cb53 = "zh_female_vv_uranus_bigtts";
  const _0x17692a = String(_0x2c7a28["voiceType"] || _0x93cb53)["trim"]();
  const _0x403799 = String(_0x2c7a28["voiceMode"] || '')["trim"]();
  const _0x57b7b1 = _0x403799 === "custom" ? _0x255402 || _0x17692a : _0x403799 === 'default' ? _0x17692a : _0x255402 || _0x17692a;
  const _0x3d60a9 = _0x403799 === 'custom' || !_0x403799 && !!_0x255402;
  const _0x3d2893 = getVolcengineOfficialTtsResourceId(_0x57b7b1);
  const _0x22c095 = _0x3d60a9 && isVolcengineIclSpeakerId(_0x57b7b1);
  const _0x257b33 = _0x22c095 ? VOLCENGINE_ICL_RESOURCE_ID : _0x3d2893 || VOLCENGINE_TTS_RESOURCE_ID;
  if (!_0x3f7a2f || !String(_0x3f7a2f)["trim"]()) {
    throw new Error("请输入要合成的文本内容");
  }
  if (!_0x57b7b1) {
    throw new Error("请选择音色或在高级设置中填入自定义音色ID");
  }
  const _0x162e38 = String(_0x3f7a2f)["trim"]();
  const _0x47fa1e = {
    'format': _0xcf5f83,
    'sample_rate': [0x1f40, 0x3e80, 0x5622, 0x5dc0, 0x7d00, 0xac44, 0xbb80]["includes"](_0x2efd44) ? _0x2efd44 : 0x5dc0,
    'speech_rate': Number["isFinite"](_0x10e3dd) && _0x10e3dd >= -0x32 && _0x10e3dd <= 0x64 ? Math["round"](_0x10e3dd) : 0x0,
    'loudness_rate': Number['isFinite'](_0x4a230e) && _0x4a230e >= -0x32 && _0x4a230e <= 0x64 ? Math["round"](_0x4a230e) : 0x0
  };
  _0xcf5f83 === "mp3" && (_0x47fa1e['bit_rate'] = 0x27100);
  const _0x1525a1 = {
    'disable_markdown_filter': ![],
    'disable_emoji_filter': ![]
  };
  Number["isFinite"](_0x179c13) && _0x179c13 !== 0x0 && _0x179c13 >= -0xc && _0x179c13 <= 0xc && (_0x1525a1["post_process"] = {
    'pitch': Math["round"](_0x179c13)
  });
  const _0x5ef516 = {
    'text': _0x162e38,
    'speaker': _0x57b7b1,
    'audio_params': _0x47fa1e,
    'additions': JSON["stringify"](_0x1525a1)
  };
  _0x22c095 && (_0x5ef516["model"] = "seed-tts-2.0-standard");
  const _0x5e0cf7 = {
    'req_params': _0x5ef516
  };
  const _0x56c55e = generateReqId();
  return {
    'url': "/api/v2/proxy/task?apiUrl=" + encodeURIComponent(VOLCENGINE_TTS_BASE_URL),
    'headers': {
      'Content-Type': 'application/json',
      'X-Api-Key': _0x31a949,
      'X-Api-Resource-Id': _0x257b33,
      'X-Api-Request-Id': _0x56c55e
    },
    'body': JSON["stringify"](_0x5e0cf7),
    'meta': {
      'provider': "volcengine-speech",
      'audioWorkflowKey': _0x4a6e36,
      'audioWorkflowLabel': String(_0x17da34?.["audioWorkflowLabel"] || '')['trim'](),
      'model': _0x17aa2c["modelManifest"]['modelId'],
      'executionId': _0x17aa2c["executionManifest"]['id'],
      'nodeId': String(_0x17da34?.["nodeId"] || '')['trim'](),
      'installId': _0x294777,
      'isVolcengineSpeech': !![],
      'audioFormat': _0xcf5f83,
      'prompt': _0x3f7a2f,
      'textInputs': _0x829685,
      'audioRefs': _0x2afd27,
      'videoRefs': _0x2b7787,
      'apiKey': _0x31a949,
      'speakerId': _0x57b7b1
    }
  };
}
async function buildRunningHubAudioModelApiRequest({
  payload: _0x3a284e,
  resolved: _0x5fb3e4,
  workflowKey: _0x175903,
  prompt: _0x15cc03,
  textInputs: _0x53afcc,
  audioRefs: _0x260e64,
  videoRefs: _0x12eeee,
  installId: _0x215a21,
  generationParams: _0x14a463
}) {
  const _0x39114a = resolveRunningHubModelApiProfileId(_0x5fb3e4?.["modelManifest"]?.['modelId'] || _0x175903, getRunningHubProviderProfileId(_0x3a284e));
  const _0x34249c = getProviderConfig(_0x39114a);
  const _0x1c3942 = String(_0x34249c?.["modelApiKey"] || _0x3a284e?.["apiKey"] || _0x34249c?.["apiKey"] || '')["trim"]();
  if (!_0x1c3942) {
    throw new Error("RunningHub API Key 未配置，请在设置 > API Key > RunningHub中配置");
  }
  const _0x22898c = String(_0x5fb3e4?.["modelManifest"]?.["modelType"] || _0x5fb3e4?.["executionManifest"]?.["extensions"]?.["modelType"] || '')["trim"]();
  const _0x53a8dd = String(_0x5fb3e4?.["executionManifest"]?.["model"] || '')["trim"]();
  if (!_0x53a8dd) {
    throw new Error('RunningHub音频模型endpoint未配置');
  }
  const _0x2b4f34 = _0x14a463 && typeof _0x14a463 === "object" && !Array["isArray"](_0x14a463) ? _0x14a463 : {};
  const _0x1068c8 = {
    ..._0x2b4f34,
    ...sanitizeModelUiSchemaParams(_0x175903, _0x2b4f34, {
      'includeDefaults': !![]
    })
  };
  const _0xdc0b6d = buildRunningHubModelApiUrl(_0x39114a, "/openapi/v2/" + _0x53a8dd);
  let _0x3f3c91 = '';
  if (_0x260e64['length'] > 0x0) {
    const _0x11dc12 = String(_0x260e64[0x0]?.["url"] || '')["trim"]();
    if (_0x11dc12) {
      const _0x470889 = await processInputAudiosPreserveOrder([_0x11dc12], _0x1c3942, {
        'strictUpload': !![],
        'apiUrl': resolveRunningHubModelApiBaseUrl(_0x39114a),
        'providerProfileId': _0x39114a
      });
      _0x3f3c91 = String(_0x470889?.[0x0] || '')["trim"]();
    }
  }
  let _0x5000bf = {};
  if (_0x22898c === "suno-single") {
    const _0x179961 = _0x1068c8?.["make_instrumental"] === !![] || _0x1068c8?.["make_instrumental"] === "true";
    const _0x5a328d = String(_0x1068c8?.["title"] || '')['trim']();
    _0x5000bf = {
      'description': _0x15cc03 || '',
      ...(_0x5a328d && _0x5a328d !== '-' ? {
        'title': _0x5a328d
      } : {}),
      'make_instrumental': _0x179961 ? "true" : 'false'
    };
  } else {
    if (_0x22898c === "suno-custom") {
      const _0x5c3a38 = String(_0x1068c8?.["tags"] || "pop")["trim"]() || "pop";
      const _0x138932 = String(_0x1068c8?.["title"] || '')["trim"]();
      const _0x215c09 = !_0x138932 || _0x138932 === '-' ? "Untitled" : _0x138932;
      _0x5000bf = {
        'prompt': _0x15cc03 || '',
        'tags': _0x5c3a38,
        'title': _0x215c09
      };
    } else {
      if (_0x22898c === 'minimax-tts') {
        _0x5000bf = {
          'text': _0x15cc03 || '',
          'voice_id': String(_0x1068c8?.["customVoiceId"] || _0x1068c8?.["voice_id"] || "Wise_Woman")["trim"](),
          'speed': Number(_0x1068c8?.['speed']) || 0x1,
          'volume': Number(_0x1068c8?.["volume"]) || 0x1,
          'pitch': Number["isInteger"](Number(_0x1068c8?.['pitch'])) ? Number(_0x1068c8["pitch"]) : 0x0,
          'emotion': String(_0x1068c8?.["emotion"] || "happy")["trim"](),
          'enable_base64_output': ![],
          'english_normalization': ![],
          ...(Array["isArray"](_0x1068c8?.["pronunciation_dict"]) && _0x1068c8["pronunciation_dict"]['length'] > 0x0 ? {
            'pronunciation_dict': _0x1068c8["pronunciation_dict"]
          } : {})
        };
      } else {
        if (_0x22898c === 'minimax-music-instrumental') {
          _0x5000bf = {
            'prompt': _0x15cc03 || '',
            'is_instrumental': !![],
            'sampleRate': String(_0x1068c8?.["sampleRate"] || "44100")["trim"](),
            'bitrate': String(_0x1068c8?.["bitrate"] || "256000")["trim"](),
            'format': String(_0x1068c8?.["format"] || 'mp3')["trim"]()
          };
        } else {
          if (_0x22898c === "minimax-music") {
            const _0x33e68c = String(_0x1068c8?.["prompt"] || '')["trim"]();
            const _0x147599 = _0x33e68c && _0x33e68c !== '-' ? _0x33e68c : _0x15cc03 || '';
            const _0x181e8c = _0x1068c8?.["lyricsOptimizer"] === !![] || _0x1068c8?.["lyricsOptimizer"] === 'true';
            _0x5000bf = {
              'lyrics': _0x15cc03 || '',
              'prompt': _0x147599,
              'is_instrumental': ![],
              'lyricsOptimizer': _0x181e8c,
              'sampleRate': String(_0x1068c8?.["sampleRate"] || "44100")["trim"](),
              'bitrate': String(_0x1068c8?.["bitrate"] || "256000")["trim"](),
              'format': String(_0x1068c8?.["format"] || 'mp3')["trim"]()
            };
          } else {
            _0x5000bf = {
              'prompt': _0x15cc03 || '',
              ...(_0x3f3c91 ? {
                'audioUrl': _0x3f3c91
              } : {}),
              ..._0x1068c8
            };
          }
        }
      }
    }
  }
  return {
    'url': "/api/v2/proxy/image",
    'headers': {
      'Content-Type': "application/json",
      ...(_0x215a21 ? {
        'X-AIC-Install-Id': _0x215a21
      } : {})
    },
    'body': {
      'apiUrl': _0xdc0b6d,
      'apiKey': _0x1c3942,
      ..._0x5000bf
    },
    'meta': {
      'provider': "runninghub",
      'providerProfileId': _0x39114a,
      'rhProviderProfileId': _0x39114a,
      'audioWorkflowKey': _0x175903,
      'audioWorkflowLabel': String(_0x3a284e?.["audioWorkflowLabel"] || '')["trim"](),
      'model': _0x5fb3e4["modelManifest"]["modelId"],
      'executionId': _0x5fb3e4["executionManifest"]['id'],
      'nodeId': String(_0x3a284e?.["nodeId"] || '')['trim'](),
      'installId': _0x215a21,
      'isRunningHubAudioModelApi': !![],
      'modelType': _0x22898c,
      'prompt': _0x15cc03,
      'textInputs': _0x53afcc,
      'audioRefs': _0x260e64,
      'videoRefs': _0x12eeee
    }
  };
}
export async function buildAudioSeparationRequest(_0xd8f729 = {}) {
  await ensureConfig();
  const _0x435514 = a44_0x27b6c2;
  const _0x1961ca = getAudioSeparationExecutionManifest();
  const _0x1368c7 = _0x1961ca?.["mapping"]?.['sourceAudioNode'];
  const _0x5479de = getRunningHubWorkflowProfileId(_0xd8f729);
  const _0x39f351 = getProviderConfig(_0x5479de || "runninghubwf");
  const _0xa0a569 = String(_0x5479de || _0x39f351?.["providerProfileId"] || '')["trim"]();
  const _0x513608 = resolveRunningHubAudioWorkflowAppId(_0x1961ca, _0xa0a569);
  if (!_0x513608 || !_0x1368c7?.["nodeId"] || !_0x1368c7?.['fieldName']) {
    throw new Error("RunningHub audio workflow manifest missing: " + _0x435514);
  }
  const _0x1c14f6 = resolveRunningHubModelApiBaseUrl(_0xa0a569);
  const _0x267030 = String(_0xd8f729?.['apiKey'] || _0x39f351?.['apiKey'] || '')["trim"]();
  if (!_0x267030) {
    throw new Error("RunningHub API Key 未配置");
  }
  const _0x4ce92d = String(_0xd8f729?.["audioUrl"] || _0xd8f729?.["src"] || _0xd8f729?.["url"] || '')['trim']();
  if (!_0x4ce92d) {
    throw new Error("人声分离需要可用音频");
  }
  let _0x3e6f4c;
  try {
    _0x3e6f4c = await processInputAudiosPreserveOrder([_0x4ce92d], _0x267030, {
      'apiUrl': _0x1c14f6,
      'strictUpload': !![]
    });
  } catch (_0x4217b5) {
    const _0x211798 = String(_0x4217b5?.['getUserMessage']?.() || _0x4217b5?.['message'] || _0x4217b5 || '')["trim"]();
    throw new Error("人声分离素材上传失败：" + (_0x211798 || "未知上传错误"), {
      'cause': _0x4217b5
    });
  }
  const _0x4e0785 = String(_0x3e6f4c?.[0x0] || '')["trim"]();
  if (!_0x4e0785) {
    throw new Error("人声分离素材上传失败：上传服务未返回文件地址");
  }
  const _0x430d07 = normalizeRunningHubInstanceType(_0xd8f729?.['rhInstanceType']);
  return {
    'url': "/api/v2/proxy/image",
    'headers': {
      'Content-Type': "application/json"
    },
    'body': {
      'apiUrl': _0x1c14f6 + '/openapi/v2/run/ai-app/' + _0x513608,
      'apiKey': _0x267030,
      'nodeInfoList': [{
        'nodeId': _0x1368c7["nodeId"],
        'fieldName': _0x1368c7["fieldName"],
        'fieldValue': _0x4e0785,
        'description': "audio"
      }],
      'instanceType': _0x430d07,
      'usePersonalQueue': "false"
    },
    'meta': {
      'provider': "runninghubwf",
      'providerProfileId': _0xa0a569,
      'rhProviderProfileId': _0xa0a569,
      'apiUrl': _0x1c14f6,
      'model': _0x435514,
      'executionId': _0x1961ca['id'],
      'adapterTrace': {
        'source': 'manifest',
        'executionId': _0x1961ca['id'],
        'modelId': _0x435514
      },
      'nodeId': String(_0xd8f729?.['nodeId'] || '')["trim"](),
      'rhInstanceType': _0x430d07,
      'sourceAudioUrl': _0x4ce92d,
      'uploadedAudioUrl': _0x4e0785
    }
  };
}
async function pollRunningHubAudioTask(_0x38a433, _0x4df1e0, _0x726b30 = {}) {
  if (_0x726b30?.['signal']?.["aborted"]) {
    throw new Error("CANCELLED");
  }
  const _0x508c68 = _0x726b30?.["isRunningHubWorkflow"] === !![] ? resolveRunningHubWorkflowPollingPolicy(_0x726b30) : null;
  const _0x1a9602 = _0x508c68?.["pollIntervalMs"] ?? POLL_INTERVAL_MS;
  const _0x59a31d = _0x508c68?.["pollTimeoutMs"] ?? null;
  const _0xc851d = _0x508c68?.["maxPolls"] ?? POLL_MAX_COUNT;
  const _0x3d0749 = Date['now']();
  for (let _0x59b456 = 0x0; _0x59b456 < _0xc851d; _0x59b456++) {
    if (_0x59a31d !== null && hasRunningHubWorkflowPollingTimedOut(_0x3d0749, _0x59a31d)) {
      break;
    }
    if (_0x726b30?.["signal"]?.["aborted"]) {
      throw new Error("CANCELLED");
    }
    (_0x59b456 > 0x0 || _0x726b30?.["pollImmediately"] !== !![]) && (await sleep(_0x1a9602, _0x726b30?.["signal"]));
    if (_0x726b30?.["signal"]?.["aborted"]) {
      throw new Error("CANCELLED");
    }
    if (_0x59a31d !== null && hasRunningHubWorkflowPollingTimedOut(_0x3d0749, _0x59a31d)) {
      break;
    }
    const _0x466cdc = await requester({
      'url': _0x726b30?.["useOpenapiQuery"] === ![] ? "/api/v2/runninghubwf/query" : "/api/v2/proxy/image",
      'method': "POST",
      'provider': "runninghubwf",
      'timeout': 0x7530,
      'signal': _0x726b30?.['signal'],
      'headers': {
        'Content-Type': "application/json"
      },
      'body': JSON["stringify"]({
        'apiUrl': String(_0x726b30?.["apiUrl"] || "https://www.runninghub.cn")["trim"]()['replace'](/\/+$/, '') + "/openapi/v2/query",
        'apiKey': _0x4df1e0,
        'taskId': _0x38a433,
        ...(_0x726b30?.["useOpenapiQuery"] === ![] ? {
          'providerProfileId': _0x726b30["providerProfileId"]
        } : {})
      }),
      'responseType': "auto"
    });
    const _0x101a1b = parseResponseData(_0x466cdc);
    const _0x3ccb39 = Number(_0x101a1b?.["code"]);
    if (Number["isFinite"](_0x3ccb39)) {
      if (_0x3ccb39 === 0x324 || _0x3ccb39 === 0x32d) {
        continue;
      }
      if (_0x3ccb39 !== 0x0) {
        throw new Error(getApiErrorMessage(_0x101a1b, '音频任务轮询失败'));
      }
    }
    const _0x2e0b8b = _0x101a1b?.['data'] && typeof _0x101a1b["data"] === "object" ? _0x101a1b["data"] : _0x101a1b;
    if (_0x726b30?.["useOpenapiQuery"] === ![] && Array['isArray'](_0x2e0b8b) && extractAudioUrls(_0x2e0b8b)['length']) {
      return _0x2e0b8b;
    }
    const _0x5aef7b = resolveRunningHubTaskLifecycleStatus(_0x101a1b);
    if (_0x5aef7b === 'success') {
      if (_0x726b30['isAudioPreparation'] !== !![] && extractAudioUrls(_0x2e0b8b)["length"] === 0x0) {
        throw new Error("音频任务已完成，但未提取到音频地址");
      }
      return _0x2e0b8b;
    }
    if (_0x5aef7b === "cancelled") {
      throw new Error("CANCELLED");
    }
    if (_0x5aef7b === "error") {
      throw new Error(getApiErrorMessage(_0x2e0b8b, "音频任务执行失败"));
    }
    if (!_0x5aef7b) {
      throw new Error("音频任务查询返回了无法识别的状态，请检查任务查询结果");
    }
  }
  throw new Error('音频任务超时，请稍后重试');
}
export async function resumeAudioSeparationTask(_0xdd5b1d, _0x14424b = {}, _0x22eee9 = {}) {
  await ensureConfig();
  const _0xe3086e = getRunningHubWorkflowProfileId(_0x14424b);
  const _0x58768a = getProviderConfig(_0xe3086e || "runninghubwf");
  const _0x2089d9 = String(_0xe3086e || _0x58768a?.['providerProfileId'] || '')['trim']();
  const _0x4d1c21 = resolveRunningHubModelApiBaseUrl(_0x2089d9);
  const _0x3875f2 = String(_0x14424b?.["apiKey"] || _0x58768a?.["apiKey"] || '')["trim"]();
  if (!_0x3875f2) {
    throw new Error("RunningHub API Key 未配置");
  }
  const _0x56a7a9 = String(_0xdd5b1d || '')["trim"]();
  if (!_0x56a7a9) {
    throw new Error("缺少 RunningHub 音频任务ID");
  }
  return runTaskSingleFlight({
    'provider': _0x2089d9 || "runninghubwf",
    'kind': "audio-separation",
    'taskId': _0x56a7a9
  }, async () => {
    const _0x15f426 = await pollRunningHubAudioTask(_0x56a7a9, _0x3875f2, {
      ..._0x22eee9,
      'apiUrl': _0x4d1c21,
      'isRunningHubWorkflow': !![]
    });
    return {
      'taskId': _0x56a7a9,
      ...normalizeAudioSeparationTaskResult(extractAudioResultEntries(_0x15f426), "任务已完成，但未提取到人声和背景声音频地址")
    };
  });
}
export async function resumeRunningHubAudioTask(_0x2e2d0f, _0x5f011d = {}, _0x18ee28 = {}) {
  await ensureConfig();
  const _0x48e456 = String(_0x5f011d?.["provider"] || 'runninghubwf')["trim"]();
  const _0xacf03c = _0x48e456 === "runninghub";
  const _0x11a82e = getRunningHubWorkflowProfileId(_0x5f011d);
  const _0x47594b = _0x11a82e || (_0xacf03c ? "runninghub" : '');
  const _0x159916 = getProviderConfig(_0xacf03c ? _0x47594b : _0x47594b || "runninghubwf");
  const _0xccf851 = String(_0x47594b || _0x159916?.["providerProfileId"] || '')["trim"]();
  const _0x5ba101 = String(_0xacf03c ? _0x159916?.["modelApiKey"] || _0x5f011d?.["apiKey"] || _0x159916?.["apiKey"] || '' : _0x5f011d?.['apiKey'] || _0x159916?.["apiKey"] || '')["trim"]();
  if (!_0x5ba101) {
    throw new Error("RunningHub API Key 未配置");
  }
  const _0x4a048d = String(_0x2e2d0f || '')["trim"]();
  if (!_0x4a048d) {
    throw new Error("缺少 RunningHub 音频任务ID");
  }
  return runTaskSingleFlight({
    'provider': _0xccf851 || _0x48e456,
    'kind': "audio",
    'taskId': _0x4a048d
  }, async () => {
    const _0x2005c5 = await pollRunningHubAudioTask(_0x4a048d, _0x5ba101, {
      ..._0x18ee28,
      'apiUrl': resolveRunningHubModelApiBaseUrl(_0xccf851),
      'isRunningHubWorkflow': !_0xacf03c,
      'useOpenapiQuery': (_0x5f011d["useOpenapiQuery"] ?? _0x18ee28['useOpenapiQuery']) !== ![],
      'providerProfileId': _0xccf851
    });
    return {
      'taskId': _0x4a048d,
      ...normalizeAudioTaskResult(extractAudioResultEntries(_0x2005c5), '任务已完成，但未提取到音频地址')
    };
  });
}
export async function runAudioSeparation(_0x3a54f0 = {}, _0xa0dc60 = {}) {
  const _0x12ed0c = await buildAudioSeparationRequest(_0x3a54f0);
  const _0x509627 = await requester({
    'url': _0x12ed0c['url'],
    'method': 'POST',
    'provider': "runninghubwf",
    'timeout': 0x1d4c0,
    'signal': _0xa0dc60?.["signal"],
    'headers': _0x12ed0c['headers'] || {
      'Content-Type': "application/json"
    },
    'body': JSON['stringify'](_0x12ed0c['body']),
    'responseType': "auto"
  });
  const _0x3c9c91 = parseResponseData(_0x509627);
  const _0x1ff7d5 = Number(_0x3c9c91?.["code"]);
  if (Number['isFinite'](_0x1ff7d5) && _0x1ff7d5 !== 0x0) {
    throw new Error(getApiErrorMessage(_0x3c9c91, '音频任务创建失败'));
  }
  const _0x33368f = getTaskId(_0x3c9c91);
  if (!_0x33368f) {
    return normalizeAudioSeparationTaskResult(extractAudioResultEntries(_0x3c9c91), '音频任务创建成功但未返回人声和背景声音频地址');
  }
  _0xa0dc60?.['onTaskMeta']?.({
    'taskId': String(_0x33368f),
    'useOpenapiQuery': !![],
    'apiKey': String(_0x12ed0c?.["body"]?.['apiKey'] || '')["trim"](),
    'providerProfileId': String(_0x12ed0c?.["meta"]?.["providerProfileId"] || '')["trim"](),
    'apiUrl': String(_0x12ed0c?.["meta"]?.["apiUrl"] || '')["trim"]()
  });
  _0xa0dc60?.['onTaskId']?.(String(_0x33368f));
  const _0x47430a = await pollRunningHubAudioTask(_0x33368f, _0x12ed0c['body']["apiKey"], {
    ..._0xa0dc60,
    'apiUrl': _0x12ed0c?.['meta']?.["apiUrl"],
    'isRunningHubWorkflow': !![]
  });
  return {
    'taskId': _0x33368f,
    ...normalizeAudioSeparationTaskResult(extractAudioResultEntries(_0x47430a), "任务已完成，但未提取到人声和背景声音频地址")
  };
}
async function pollComfyUiAudioTask(_0x3bf480, _0x47cdfe, _0x1b90f5 = {}) {
  const _0x4057d1 = String(_0x3bf480 || '')["trim"]();
  const _0x181856 = String(_0x47cdfe?.["body"]?.["baseUrl"] || '')['trim']();
  for (let _0x5ea20a = 0x0; _0x5ea20a < POLL_MAX_COUNT; _0x5ea20a += 0x1) {
    if (_0x1b90f5?.['signal']?.["aborted"]) {
      throw new Error("CANCELLED");
    }
    await sleep(POLL_INTERVAL_MS, _0x1b90f5?.["signal"]);
    if (_0x1b90f5?.["signal"]?.["aborted"]) {
      throw new Error("CANCELLED");
    }
    const _0x26a79e = new URLSearchParams({
      'promptId': _0x4057d1,
      ...(_0x181856 ? {
        'baseUrl': _0x181856
      } : {}),
      ...(_0x47cdfe?.["body"]?.["allowCloudBaseUrl"] ? {
        'allowCloudBaseUrl': '1'
      } : {})
    });
    const _0x1f5eb7 = await requester({
      'url': "/api/v2/comfyui/history?" + _0x26a79e["toString"](),
      'method': 'GET',
      'provider': "comfyui",
      'timeout': 0x7530,
      'signal': _0x1b90f5?.["signal"]
    });
    const _0x25d616 = typeof _0x47cdfe?.["resultExtractor"] === 'function' ? _0x47cdfe["resultExtractor"](_0x1f5eb7) : _0x1f5eb7;
    if (extractAudioResultEntries(_0x25d616)["length"] > 0x0) {
      return _0x25d616;
    }
    const _0x55dd32 = String(_0x25d616?.["status"] || '')["trim"]()["toUpperCase"]();
    if (['FAILED', "FAIL", 'ERROR', "CANCELLED", "CANCELED"]["includes"](_0x55dd32)) {
      const _0x459579 = parseError("comfyui", _0x25d616, 0xc8);
      if (_0x459579) {
        throw _0x459579;
      }
      throw new Error(String(_0x25d616?.["error"] || _0x25d616?.["message"] || "ComfyUI 音频任务执行失败"));
    }
  }
  throw new Error("ComfyUI 音频任务超时");
}
async function generateComfyUiAudio(_0x51dff3, _0x21e45e = {}) {
  const _0x131227 = await requester({
    'url': _0x51dff3['url'],
    'method': "POST",
    'provider': "comfyui",
    'timeout': 0x1d4c0,
    'signal': _0x21e45e?.["signal"],
    'headers': _0x51dff3['headers'] || {
      'Content-Type': "application/json"
    },
    'body': JSON["stringify"](_0x51dff3["body"]),
    'responseType': "auto"
  });
  const _0x1f4756 = parseResponseData(_0x131227);
  const _0xc2a72 = typeof _0x131227 === "string" ? _0x131227 : JSON['stringify'](_0x1f4756 || {});
  const _0x1da632 = getTaskId(_0x1f4756, _0xc2a72);
  if (!_0x1da632) {
    const _0x1bf791 = parseError('comfyui', _0x1f4756, 0xc8);
    if (_0x1bf791) {
      throw _0x1bf791;
    }
    return normalizeAudioTaskResult(extractAudioResultEntries(_0x1f4756), "ComfyUI 音频任务创建成功但未返回 prompt_id");
  }
  _0x21e45e?.["onTaskMeta"]?.({
    'taskId': String(_0x1da632),
    'provider': 'comfyui',
    'kind': 'audio'
  });
  _0x21e45e?.['onTaskId']?.(String(_0x1da632));
  const _0x1d7fbd = await pollComfyUiAudioTask(_0x1da632, _0x51dff3, _0x21e45e);
  return {
    'taskId': _0x1da632,
    ...normalizeAudioTaskResult(extractAudioResultEntries(_0x1d7fbd), "任务已完成，但未提取到音频地址")
  };
}
export async function generateAudio(_0x4b5cfc, _0x1de34b = {}) {
  let _0x453ab3 = await buildGenerateAudioRequest(_0x4b5cfc, _0x1de34b);
  _0x453ab3 = await prepareRunningHubCatalogRequest(_0x453ab3, {
    'signal': _0x1de34b['signal'],
    'submitAndPoll': async _0x5d10ad => {
      const {
        createData: _0x10c673,
        createRaw: _0x345636
      } = await requestRunningHubAudioCreateTask(_0x5d10ad, "runninghub", {
        'signal': _0x1de34b["signal"]
      });
      const _0x391fcb = getTaskId(_0x10c673, typeof _0x345636 === "string" ? _0x345636 : JSON["stringify"](_0x10c673));
      if (!_0x391fcb) {
        throw new Error('音频前处理未返回\x20taskId');
      }
      return pollRunningHubAudioTask(_0x391fcb, _0x5d10ad['body']["apiKey"], {
        'signal': _0x1de34b["signal"],
        'apiUrl': _0x5d10ad['meta']['apiUrl'],
        'pollImmediately': !![],
        'isAudioPreparation': !![]
      });
    }
  });
  if (_0x453ab3["meta"]?.["isVolcengineSpeech"]) {
    return generateVolcengineSpeech(_0x453ab3, _0x1de34b);
  }
  if (_0x453ab3['meta']?.['isComfyUiAudio']) {
    return generateComfyUiAudio(_0x453ab3, _0x1de34b);
  }
  const _0x44cce9 = _0x453ab3["meta"]?.["provider"] || "runninghubwf";
  if (_0x453ab3['meta']?.["isManifestAudioModelApi"] && _0x44cce9 !== "runninghub") {
    const _0x3f1a13 = await requester({
      'url': _0x453ab3["url"],
      'method': "POST",
      'provider': _0x44cce9,
      'timeout': AUDIO_MODEL_API_REQUEST_TIMEOUT_MS,
      'signal': _0x1de34b?.['signal'],
      'headers': _0x453ab3["headers"] || {
        'Content-Type': "application/json"
      },
      'body': JSON["stringify"](_0x453ab3["body"]),
      'responseType': "auto"
    });
    const _0x65c3f5 = parseResponseData(_0x3f1a13);
    return normalizeAudioTaskResult(extractMappedAudioResultEntries(_0x65c3f5, _0x453ab3['responseMapping']), "音频生成成功但未提取到音频地址");
  }
  const _0x39aec7 = async (_0x38eb37 = null) => {
    const _0x41a1c6 = _0x38eb37 ? {
      ..._0x1de34b,
      'runningHubWorkflowQueueLease': _0x38eb37
    } : _0x1de34b;
    const {
      createRaw: _0x3e809b,
      createData: _0x1a3c64
    } = await requestRunningHubAudioCreateTask(_0x453ab3, _0x44cce9, _0x41a1c6);
    const _0x518911 = typeof _0x3e809b === 'string' ? _0x3e809b : JSON["stringify"](_0x1a3c64 || {});
    const _0x57f330 = getTaskId(_0x1a3c64, _0x518911);
    if (!_0x57f330) {
      console["warn"]("[aiAudioApi] Task submission returned no taskId. Response keys:", Object["keys"](_0x1a3c64 || {}), 'data:', JSON["stringify"](_0x1a3c64 || {})["slice"](0x0, 0x1f4));
      return normalizeAudioTaskResult(extractAudioResultEntries(_0x1a3c64), "音频任务创建成功但未返回 taskId");
    }
    _0x41a1c6?.["onTaskMeta"]?.({
      'taskId': String(_0x57f330),
      'useOpenapiQuery': _0x453ab3['meta']?.["queryMode"] !== "runninghubwf-query",
      'apiKey': String(_0x453ab3?.["body"]?.['apiKey'] || '')["trim"](),
      'providerProfileId': String(_0x453ab3?.["meta"]?.["providerProfileId"] || '')["trim"](),
      'rhProviderProfileId': String(_0x453ab3?.["meta"]?.["rhProviderProfileId"] || _0x453ab3?.['meta']?.["providerProfileId"] || '')["trim"]()
    });
    _0x41a1c6?.['onTaskId']?.(String(_0x57f330));
    const _0x491b6c = await pollRunningHubAudioTask(_0x57f330, _0x453ab3["body"]["apiKey"], {
      ..._0x41a1c6,
      'apiUrl': _0x41a1c6?.["apiUrl"] || _0x453ab3['meta']?.["apiUrl"],
      'useOpenapiQuery': _0x453ab3["meta"]?.["queryMode"] !== "runninghubwf-query",
      'providerProfileId': _0x453ab3["meta"]?.['providerProfileId'],
      'isRunningHubWorkflow': _0x44cce9 === "runninghubwf"
    });
    return {
      'taskId': _0x57f330,
      ...normalizeAudioTaskResult(extractAudioResultEntries(_0x491b6c), "任务已完成，但未提取到音频地址")
    };
  };
  if (isRunningHubWorkflowQueueTarget({
    'providerId': _0x44cce9,
    'adapterType': _0x453ab3["meta"]?.["adapterType"] || _0x4b5cfc?.["adapterType"],
    'payload': {
      ..._0x4b5cfc,
      'apiKey': _0x453ab3?.["body"]?.["apiKey"],
      'provider': _0x44cce9,
      'providerProfileId': _0x453ab3?.["meta"]?.["providerProfileId"] || _0x4b5cfc?.["providerProfileId"],
      'rhProviderProfileId': _0x453ab3?.["meta"]?.["rhProviderProfileId"] || _0x4b5cfc?.['rhProviderProfileId']
    }
  })) {
    const _0xcd9ac7 = resolveRunningHubWorkflowQueueConfig({
      'payload': {
        ..._0x4b5cfc,
        'apiKey': _0x453ab3?.["body"]?.["apiKey"],
        'providerProfileId': _0x453ab3?.['meta']?.['providerProfileId'] || _0x4b5cfc?.['providerProfileId'],
        'rhProviderProfileId': _0x453ab3?.["meta"]?.["rhProviderProfileId"] || _0x4b5cfc?.["rhProviderProfileId"]
      },
      'concurrency': _0x1de34b?.["runningHubWorkflowConcurrency"]
    });
    return runWithRunningHubWorkflowQueue({
      ..._0xcd9ac7,
      'signal': _0x1de34b?.['signal'],
      'lease': _0x1de34b?.["runningHubWorkflowQueueLease"],
      'onQueueChange': _0x1de34b?.["onRunningHubWorkflowQueueChange"],
      'autoProbeConcurrency': _0x1de34b?.["autoProbeConcurrency"],
      'concurrencyProbe': _0x1de34b?.['runningHubWorkflowConcurrencyProbe']
    }, _0x39aec7);
  }
  return _0x39aec7(_0x1de34b?.['runningHubWorkflowQueueLease'] || null);
}
function extractFromJsonObject(_0x421042) {
  const _0x3cd1ad = {
    'dataChunk': '',
    'errorCode': 0x0,
    'errorMsg': ''
  };
  if (!_0x421042 || typeof _0x421042 !== 'object') {
    return _0x3cd1ad;
  }
  if (typeof _0x421042["data"] === 'string' && _0x421042['data']["trim"]()) {
    _0x3cd1ad['dataChunk'] = _0x421042['data']["trim"]();
    return _0x3cd1ad;
  }
  const _0x35a6b8 = Number(_0x421042?.["code"]);
  const _0x431db7 = String(_0x421042?.["message"] || '')['trim']();
  Number["isFinite"](_0x35a6b8) && _0x35a6b8 !== 0x0 && _0x35a6b8 !== 0x1312d00 && (_0x3cd1ad["errorCode"] = _0x35a6b8, _0x3cd1ad["errorMsg"] = _0x431db7 || "未知错误");
  return _0x3cd1ad;
}
function base64ToBytes(_0x324ba2) {
  const _0x516724 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const _0x13e4f0 = String(_0x324ba2 || '')["replace"](/[^A-Za-z0-9+/=]/g, '');
  if (!_0x13e4f0) {
    return new Uint8Array(0x0);
  }
  const _0x5496da = [];
  let _0x19a012 = 0x0;
  while (_0x19a012 < _0x13e4f0["length"]) {
    const _0x4ce4dc = _0x13e4f0[_0x19a012++];
    const _0x422596 = _0x4ce4dc === '=' ? 0x40 : _0x516724["indexOf"](_0x4ce4dc);
    const _0xf2baf = _0x13e4f0[_0x19a012++];
    const _0x1701b7 = _0xf2baf === '=' ? 0x40 : _0x516724["indexOf"](_0xf2baf);
    const _0x2c6951 = _0x13e4f0[_0x19a012++];
    const _0x597429 = _0x2c6951 === '=' ? 0x40 : _0x516724["indexOf"](_0x2c6951);
    const _0x3fa9e8 = _0x13e4f0[_0x19a012++];
    const _0x80fb60 = _0x3fa9e8 === '=' ? 0x40 : _0x516724["indexOf"](_0x3fa9e8);
    _0x5496da["push"](_0x422596 << 0x2 | _0x1701b7 >> 0x4);
    if (_0x597429 !== 0x40) {
      _0x5496da["push"]((_0x1701b7 & 0xf) << 0x4 | _0x597429 >> 0x2);
    }
    if (_0x80fb60 !== 0x40) {
      _0x5496da["push"]((_0x597429 & 0x3) << 0x6 | _0x80fb60);
    }
  }
  return new Uint8Array(_0x5496da);
}
function parseVolcengineTtsResponseText(_0x506e20) {
  const _0x24db67 = String(_0x506e20 || '')["trim"]();
  if (!_0x24db67) {
    throw new Error("火山语音返回空响应");
  }
  console['log']("[VolcengineTTS] 原始响应前300字符:", _0x24db67["slice"](0x0, 0x12c));
  const _0x5869dd = [];
  let _0x10b8a8 = '';
  let _0xafcca9 = 0x0;
  try {
    let _0x4d269c = JSON["parse"](_0x24db67);
    const {
      dataChunk: _0x2962d9,
      errorCode: _0x16ed68,
      errorMsg: _0x5e2f7b
    } = extractFromJsonObject(_0x4d269c);
    let _0x33c533 = _0x2962d9;
    let _0x3ad1c2 = _0x16ed68;
    let _0x33042f = _0x5e2f7b;
    if (_0x33c533 && _0x33c533["startsWith"]('{')) {
      try {
        const _0x3d5711 = JSON['parse'](_0x33c533);
        const _0x3919f5 = extractFromJsonObject(_0x3d5711);
        _0x3919f5["dataChunk"] && (_0x33c533 = _0x3919f5["dataChunk"], _0x3919f5["errorCode"] && !_0x3ad1c2 && (_0x3ad1c2 = _0x3919f5["errorCode"], _0x33042f = _0x3919f5['errorMsg']));
      } catch {}
    }
    if (_0x33c533) {
      _0x5869dd["push"](_0x33c533);
    }
    _0x3ad1c2 && (_0xafcca9 = _0x3ad1c2, _0x10b8a8 = _0x33042f);
    if (_0x5869dd["length"] > 0x0 || _0xafcca9 !== 0x0) {
      return {
        'chunks': _0x5869dd,
        'errorCode': _0x5869dd["length"] > 0x0 ? 0x0 : _0xafcca9,
        'errorMsg': _0x10b8a8
      };
    }
  } catch {}
  const _0x1f4f54 = _0x24db67['split'](/\r?\n/);
  for (const _0x45e71f of _0x1f4f54) {
    const _0x51220d = _0x45e71f['trim']();
    if (!_0x51220d) {
      continue;
    }
    let _0x42cc5a = _0x51220d;
    _0x42cc5a["startsWith"]("data:") && (_0x42cc5a = _0x42cc5a["slice"](0x5)["trim"]());
    if (!_0x42cc5a || _0x42cc5a === "[DONE]") {
      continue;
    }
    try {
      const _0x135a98 = JSON["parse"](_0x42cc5a);
      const {
        dataChunk: _0x4cf04c,
        errorCode: _0x348ba8,
        errorMsg: _0x118c6a
      } = extractFromJsonObject(_0x135a98);
      if (_0x4cf04c) {
        _0x5869dd['push'](_0x4cf04c);
      }
      _0x348ba8 && !_0xafcca9 && (_0xafcca9 = _0x348ba8, _0x10b8a8 = _0x118c6a);
    } catch {
      console["warn"]("[VolcengineTTS] 跳过无法解析的响应行:", _0x42cc5a["slice"](0x0, 0x64));
    }
  }
  if (_0x5869dd["length"] === 0x0 && !_0xafcca9) {
    const _0x19b3a9 = [];
    let _0x4fd9c2 = 0x0;
    let _0x335678 = -0x1;
    let _0x5f19a6 = ![];
    let _0x20ab2b = ![];
    for (let _0x2798d7 = 0x0; _0x2798d7 < _0x24db67['length']; _0x2798d7++) {
      const _0x998527 = _0x24db67[_0x2798d7];
      if (_0x20ab2b) {
        _0x20ab2b = ![];
        continue;
      }
      if (_0x998527 === '\x5c') {
        _0x20ab2b = !![];
        continue;
      }
      if (_0x998527 === '\x22') {
        _0x5f19a6 = !_0x5f19a6;
        continue;
      }
      if (_0x5f19a6) {
        continue;
      }
      if (_0x998527 === '{') {
        if (_0x4fd9c2 === 0x0) {
          _0x335678 = _0x2798d7;
        }
        _0x4fd9c2++;
      } else {
        _0x998527 === '}' && (_0x4fd9c2--, _0x4fd9c2 === 0x0 && _0x335678 !== -0x1 && (_0x19b3a9["push"](_0x24db67['slice'](_0x335678, _0x2798d7 + 0x1)), _0x335678 = -0x1));
      }
    }
    for (const _0x1ec5d8 of _0x19b3a9) {
      try {
        const _0x5e433b = JSON["parse"](_0x1ec5d8);
        const {
          dataChunk: _0x1fdc2a,
          errorCode: _0x30d23c,
          errorMsg: _0x1c5bc2
        } = extractFromJsonObject(_0x5e433b);
        if (_0x1fdc2a) {
          _0x5869dd["push"](_0x1fdc2a);
        }
        _0x30d23c && !_0xafcca9 && (_0xafcca9 = _0x30d23c, _0x10b8a8 = _0x1c5bc2);
      } catch {}
    }
  }
  return {
    'chunks': _0x5869dd,
    'errorCode': _0x5869dd["length"] > 0x0 ? 0x0 : _0xafcca9,
    'errorMsg': _0x10b8a8
  };
}
async function generateVolcengineSpeech(_0xb8009c, _0x1bf2b5 = {}) {
  const _0x151c9e = _0xb8009c["meta"] || {};
  const _0x10315d = String(_0x151c9e["audioFormat"] || "mp3")["trim"]();
  const _0x413b40 = await requester({
    'url': _0xb8009c["url"],
    'method': 'POST',
    'provider': "volcengine-speech",
    'timeout': 0x15f90,
    'signal': _0x1bf2b5?.["signal"],
    'headers': _0xb8009c["headers"] || {
      'Content-Type': "application/json"
    },
    'body': _0xb8009c["body"],
    'responseType': 'text'
  });
  const {
    chunks: _0x5967af,
    errorCode: _0x298bac,
    errorMsg: _0x2feab4
  } = parseVolcengineTtsResponseText(_0x413b40);
  if (_0x298bac !== 0x0) {
    throw new Error("火山语音TTS错误(code=" + _0x298bac + "): " + (_0x2feab4 || "未知错误"));
  }
  if (_0x5967af["length"] === 0x0) {
    console["error"]('[VolcengineTTS]\x20未从响应中提取到音频数据，原始响应:', String(_0x413b40 || '')["slice"](0x0, 0x1f4));
    throw new Error("火山语音未返回音频数据，请检查API Key和参数是否正确");
  }
  let _0x296e36 = _0x5967af["join"]('');
  console['log']("[VolcengineTTS] 解析到", _0x5967af['length'], "个音频chunk，拼接后base64长度:", _0x296e36["length"]);
  if (!_0x296e36) {
    throw new Error("火山语音未返回音频数据");
  }
  const _0x22f6bd = _0x10315d === "ogg_opus" ? "ogg" : _0x10315d;
  const _0x447c8b = _0x296e36["replace"](/[^A-Za-z0-9+/=]/g, '');
  if (!_0x447c8b) {
    throw new Error("火山语音未返回有效的音频数据");
  }
  let _0x5b0e4f;
  try {
    const _0x9ab9ab = atob(_0x447c8b);
    _0x5b0e4f = new Uint8Array(_0x9ab9ab["length"]);
    for (let _0x1a9456 = 0x0; _0x1a9456 < _0x9ab9ab['length']; _0x1a9456++) {
      _0x5b0e4f[_0x1a9456] = _0x9ab9ab["charCodeAt"](_0x1a9456);
    }
  } catch (_0x343f7a) {
    console["warn"]("[VolcengineTTS] atob 解码失败，使用手动 base64 解码器");
    _0x5b0e4f = base64ToBytes(_0x447c8b);
  }
  console["log"]("[VolcengineTTS] base64解码为二进制成功，字节数:", _0x5b0e4f["length"]);
  const _0x4b9c36 = typeof location !== "undefined" && location["protocol"] === "file:" ? "http://127.0.0.1:8777" : '';
  const _0x4d1851 = _0x4b9c36 + '/api/v2/save_output?ext=' + encodeURIComponent(_0x22f6bd) + "&kind=audio";
  let _0x432b8e;
  try {
    _0x432b8e = await fetch(_0x4d1851, {
      'method': "POST",
      'headers': {
        'Content-Type': "application/octet-stream"
      },
      'body': new Blob([_0x5b0e4f], {
        'type': "audio/" + _0x22f6bd
      }),
      'signal': _0x1bf2b5?.['signal']
    });
  } catch (_0x56b647) {
    if (_0x56b647?.["name"] === "AbortError") {
      throw _0x56b647;
    }
    throw createOperationError("音频已生成，但本地保存请求失败", _0x56b647, '无法连接本地保存服务，请重试');
  }
  let _0x58d472;
  try {
    const _0x3b6f07 = await _0x432b8e["text"]();
    try {
      _0x58d472 = JSON["parse"](_0x3b6f07);
    } catch {
      _0x58d472 = {
        'error': _0x3b6f07["trim"]() || '本地保存服务返回空响应'
      };
    }
  } catch (_0x39ff4a) {
    if (_0x39ff4a?.["name"] === "AbortError") {
      throw _0x39ff4a;
    }
    throw createOperationError("音频已生成，但保存响应读取失败", _0x39ff4a, "无法读取本地服务响应，请重试");
  }
  if (!_0x432b8e['ok']) {
    throw createOperationError("音频已生成，但本地保存失败（HTTP " + _0x432b8e["status"] + '）', _0x58d472, "本地服务未返回具体原因，请检查保存目录或重试");
  }
  const _0xdc3377 = String(_0x58d472?.['localPath'] || _0x58d472?.['path'] || _0x58d472?.["originalLocalPath"] || '')["trim"]();
  if (_0xdc3377 && _0x58d472?.["success"] !== ![]) {
    const _0x4e1a02 = '/' + _0xdc3377["replace"](/^\/+/, '');
    console['log']("[VolcengineTTS] 保存成功:", _0xdc3377);
    return {
      'taskId': '',
      'audioUrl': _0x4e1a02,
      'localPath': _0xdc3377,
      'isBatch': ![],
      'audios': [{
        'audioUrl': _0x4e1a02,
        'localPath': _0xdc3377
      }]
    };
  }
  throw createOperationError("音频已生成，但本地保存失败", _0x58d472, "服务端未返回本地路径，请重试");
}