import a606_0x4c6a7c from './stores/appStore.js';
import { acquireGenerationExecution } from './generationExecutionPolicy.js';
import { buildGenerationCancelledPatch, buildGenerationFailurePatch, buildGenerationStartPatch, buildGenerationSuccessPatch } from './generationTaskLifecycle.js';
import { buildGenerationProtocolTransitionPatch } from './generationTaskProtocolState.js';
import { GENERATION_TASK_PROTOCOLS, inferGenerationTaskProtocol } from './generationTaskProtocolAdapters.js';
import { playCompletionSound } from '../services/completionSoundService.js';
import { showGenerationCompleteNotification } from '../services/completionNotificationService.js';
import { logDiagnosticEvent } from '../services/diagnosticsService.js';
import { t } from '../i18n/index.js';
import { __resetRunningHubWorkflowQueueForTest, isRunningHubWorkflowQueueTarget, resolveRunningHubWorkflowQueueConfig, runWithRunningHubWorkflowQueue } from '../../api/runningHubWorkflowQueue.js';
import { buildManifestResultPatch } from '../../api/adapters/ManifestResultRenderer.js';
import { reportRuntimeTask } from './generationTaskCenterProjection.js';
import { resolveModelExecution } from '../manifests/index.js';
import { createMissingModelCredentialError, ensureModelGenerationReadiness, getModelGenerationReadiness } from '../services/modelGenerationReadiness.js';
const REQUIRED_SPEC_FIELDS = Object["freeze"](["sourceNodeId", "trigger", "taskType", "provider", "adapterType", "modelId", "executionId", "payload", "cancellable", "resumable", "resultBuilder"]);
const activeTasks = new Map();
let activeTaskSequence = 0x0;
const CANCELLED_MESSAGE_ALIASES = Object["freeze"](["任务已取消", 'Task\x20cancelled']);
function findActiveTaskContext(_0x144f02, {
  storeLike = null,
  taskCenterTaskId = ''
} = {}) {
  const _0x5f4e45 = String(_0x144f02 || '')["trim"]();
  if (!_0x5f4e45) {
    return null;
  }
  const _0x158fb5 = String(taskCenterTaskId || '')['trim']();
  const _0x350626 = Array['from'](activeTasks['values']())["filter"](_0x3c28d8 => _0x3c28d8?.["targetNodeId"] === _0x5f4e45 && (!storeLike || _0x3c28d8["store"] === storeLike) && (!_0x158fb5 || _0x3c28d8["taskCenterTaskId"] === _0x158fb5));
  return _0x350626["find"](_0x24a567 => isContextInFlight(_0x24a567)) || _0x350626[0x0] || null;
}
function normalizeCompletionFeedbackOutcome(_0x201665, _0x588f82) {
  if (_0x201665["status"] === "rejected") {
    return {
      'ok': ![],
      'error': String(_0x201665["reason"]?.["message"] || _0x201665["reason"] || "Unknown error")
    };
  }
  const _0x17ead5 = _0x201665["value"] && typeof _0x201665["value"] === "object" ? _0x201665["value"] : {};
  if (_0x588f82 === 'notification') {
    return {
      'ok': _0x17ead5["success"] !== ![],
      'shown': _0x17ead5["shown"] === !![],
      'reason': String(_0x17ead5["reason"] || ''),
      'error': String(_0x17ead5['error'] || '')
    };
  }
  return {
    'ok': _0x17ead5['ok'] === !![],
    'native': _0x17ead5["native"] === !![],
    'skipped': String(_0x17ead5["skipped"] || ''),
    'error': String(_0x17ead5["error"]?.['message'] || _0x17ead5["error"] || '')
  };
}
function dispatchGenerationCompletionFeedback(_0x4be651, {
  recovering = ![]
} = {}) {
  const _0x2ceb79 = getStateSnapshot(_0x4be651['store'])["nodes"]?.[_0x4be651["targetNodeId"]] || {};
  const _0x1116ae = Promise["allSettled"]([playCompletionSound("generation-success"), showGenerationCompleteNotification({
    'nodeId': _0x4be651["targetNodeId"],
    'navigation': {
      'source': "canvas",
      'nodeId': _0x4be651['targetNodeId'],
      'projectId': _0x4be651["projectId"],
      'canvasId': _0x4be651['taskScopeId']
    },
    'node': _0x2ceb79,
    'mediaKind': _0x4be651['spec']?.["modelManifest"]?.['outputType'] || _0x4be651["spec"]?.["executionManifest"]?.["kind"] || _0x4be651["taskType"] || _0x2ceb79?.["outputType"] || _0x2ceb79?.["type"] || ''
  })])["then"](([_0x39be61, _0x296d19]) => {
    const _0x28ccc6 = normalizeCompletionFeedbackOutcome(_0x39be61, "sound");
    const _0x12ba53 = normalizeCompletionFeedbackOutcome(_0x296d19, "notification");
    const _0x31e1ca = !_0x28ccc6['ok'] && _0x28ccc6["skipped"] !== 'disabled';
    const _0x346bd3 = !_0x12ba53['ok'];
    return logDiagnosticEvent({
      'type': "generation.completion_feedback",
      'level': _0x31e1ca || _0x346bd3 ? "warn" : "info",
      'source': 'renderer',
      'message': "Generation completion feedback dispatched",
      'context': {
        'targetNodeId': _0x4be651["targetNodeId"],
        'taskId': _0x4be651["taskId"],
        'taskType': _0x4be651["taskType"],
        'provider': String(_0x4be651["spec"]?.['provider'] || ''),
        'modelId': String(_0x4be651["spec"]?.["modelId"] || ''),
        'recovering': recovering,
        'sound': _0x28ccc6,
        'notification': _0x12ba53
      }
    });
  });
  void _0x1116ae['catch'](() => {});
  return _0x1116ae;
}
function normalizeProjectId(_0x12d15d) {
  return String(_0x12d15d || '')['trim']();
}
function resolveTaskProjectId(_0x3d54fc = {}, _0x11d7db = {}) {
  return normalizeProjectId(_0x11d7db["projectId"] || _0x3d54fc["projectId"] || globalThis["window"]?.["currentProjectId"] || '');
}
function getCancelledMessage() {
  return t("coreUi.generationTask.cancelled");
}
function nowFrom(_0x28506e = {}) {
  return typeof _0x28506e["now"] === "function" ? _0x28506e["now"]() : Date["now"]();
}
function getStore(_0x1325b3 = {}) {
  return _0x1325b3['store'] || a606_0x4c6a7c;
}
function getStateSnapshot(_0x5c5f28) {
  return typeof _0x5c5f28["getStateRaw"] === "function" ? _0x5c5f28['getStateRaw']() : _0x5c5f28["getState"]();
}
function isWorkflowSpec(_0xbae965 = {}, _0x47ba49 = {}) {
  return inferGenerationTaskProtocol({
    'taskProtocol': _0xbae965["protocol"],
    'adapterType': _0xbae965['adapterType'] || _0x47ba49["adapterType"],
    'provider': _0xbae965["provider"] || _0x47ba49["provider"],
    'async': _0xbae965["async"],
    'node': _0x47ba49
  }) === GENERATION_TASK_PROTOCOLS['WORKFLOW'];
}
function isAsyncModelApiSpec(_0x24288e = {}, _0x9b8eb1 = {}) {
  return inferGenerationTaskProtocol({
    'taskProtocol': _0x24288e["protocol"],
    'adapterType': _0x24288e["adapterType"] || _0x9b8eb1["adapterType"],
    'provider': _0x24288e['provider'] || _0x9b8eb1["provider"],
    'async': _0x24288e["async"],
    'node': _0x9b8eb1
  }) === GENERATION_TASK_PROTOCOLS["ASYNC_MODEL_API"];
}
function isRunningHubWorkflowQueueSpec(_0x2394da = {}) {
  return isRunningHubWorkflowQueueTarget({
    'provider': _0x2394da["provider"],
    'adapterType': _0x2394da['adapterType'],
    'payload': {
      ...(_0x2394da["payload"] && typeof _0x2394da['payload'] === "object" ? _0x2394da["payload"] : {}),
      'model': _0x2394da["modelId"],
      'provider': _0x2394da["provider"],
      'adapterType': _0x2394da['adapterType']
    }
  });
}
function assertSpec(_0x114dfd, {
  requireSubmit = ![],
  requireTarget = ![]
} = {}) {
  if (!_0x114dfd || typeof _0x114dfd !== 'object' || Array["isArray"](_0x114dfd)) {
    throw new Error("[generationTaskRuntime] task spec must be an object");
  }
  const _0x2ced62 = REQUIRED_SPEC_FIELDS["filter"](_0x3e4add => {
    if (_0x3e4add === 'targetNodeId' || _0x3e4add === "payload") {
      return ![];
    }
    if (_0x3e4add === "resultBuilder") {
      return !hasResultNormalizer(_0x114dfd);
    }
    return _0x114dfd[_0x3e4add] === undefined || _0x114dfd[_0x3e4add] === null || _0x114dfd[_0x3e4add] === '';
  });
  if (_0x114dfd["payload"] === undefined) {
    _0x2ced62['push']("payload");
  }
  requireTarget && !String(_0x114dfd['targetNodeId'] || '')['trim']() && _0x2ced62["push"]("targetNodeId");
  requireSubmit && typeof getSubmitFn(_0x114dfd) !== "function" && _0x2ced62["push"]("submit");
  if (_0x2ced62["length"]) {
    throw new Error('[generationTaskRuntime]\x20missing\x20required\x20task\x20fields:\x20' + _0x2ced62["join"](',\x20'));
  }
}
function getSubmitFn(_0x3bc9f5) {
  return _0x3bc9f5["submit"] || _0x3bc9f5["adapter"]?.['submit'] || null;
}
function resolveSpecManifestContext(_0x102b2c = {}) {
  const _0x324981 = _0x102b2c["modelManifest"] && typeof _0x102b2c['modelManifest'] === "object" ? _0x102b2c['modelManifest'] : null;
  const _0x584c36 = _0x102b2c["executionManifest"] && typeof _0x102b2c["executionManifest"] === "object" ? _0x102b2c["executionManifest"] : null;
  if (_0x324981 && _0x584c36) {
    return {
      'modelManifest': _0x324981,
      'executionManifest': _0x584c36
    };
  }
  const _0x315f0c = String(_0x102b2c["modelId"] || '')["trim"]();
  if (!_0x315f0c) {
    return null;
  }
  const _0x2f80e2 = String(_0x102b2c["provider"] || '')["trim"]();
  let _0x384ef1 = null;
  try {
    _0x384ef1 = resolveModelExecution(_0x315f0c, _0x2f80e2 ? {
      'providerHint': _0x2f80e2
    } : {}) || resolveModelExecution(_0x315f0c);
  } catch {
    _0x384ef1 = null;
  }
  if (!_0x384ef1?.["modelManifest"] || !_0x384ef1?.['executionManifest']) {
    return null;
  }
  const _0x200d79 = String(_0x102b2c['executionId'] || '')["trim"]();
  const _0x1dc70d = String(_0x384ef1["executionManifest"]['id'] || '')["trim"]();
  if (_0x200d79 && _0x1dc70d !== _0x200d79) {
    return null;
  }
  return {
    'modelManifest': _0x324981 || _0x384ef1["modelManifest"],
    'executionManifest': _0x584c36 || _0x384ef1["executionManifest"]
  };
}
function hasResultNormalizer(_0x118bb8 = {}) {
  return typeof _0x118bb8['resultBuilder'] === "function" || !!resolveSpecManifestContext(_0x118bb8);
}
function mergeManifestResultPatch(_0x4afe0d, _0xb00714) {
  if (!_0xb00714 || typeof _0xb00714 !== 'object') {
    return _0x4afe0d;
  }
  if (!_0x4afe0d || typeof _0x4afe0d !== 'object' || Array["isArray"](_0x4afe0d)) {
    return _0xb00714;
  }
  return {
    ..._0xb00714,
    ..._0x4afe0d
  };
}
function getPollFn(_0x24cc4c) {
  return _0x24cc4c["poll"] || _0x24cc4c["spec"]?.["poll"] || _0x24cc4c["spec"]?.["adapter"]?.["poll"] || null;
}
function getCancelFn(_0x3b1914, _0x57192d = {}) {
  return _0x57192d["cancel"] || _0x3b1914["cancel"] || _0x3b1914["spec"]?.["cancel"] || _0x3b1914['spec']?.["adapter"]?.['cancel'] || null;
}
function extractTaskId(_0x19947d) {
  const _0x28326b = [_0x19947d?.["taskId"], _0x19947d?.['task_id'], _0x19947d?.['id'], _0x19947d?.["data"]?.["taskId"], _0x19947d?.['data']?.["task_id"], _0x19947d?.["data"]?.['id']];
  return String(_0x28326b['find'](_0x32efb2 => String(_0x32efb2 || '')["trim"]()) || '')['trim']();
}
function extractSubmittedResult(_0x3d24f6) {
  if (!_0x3d24f6 || typeof _0x3d24f6 !== "object") {
    return _0x3d24f6;
  }
  if (Object['prototype']["hasOwnProperty"]["call"](_0x3d24f6, "result")) {
    return _0x3d24f6["result"];
  }
  if (Object["prototype"]["hasOwnProperty"]["call"](_0x3d24f6, "output")) {
    return _0x3d24f6["output"];
  }
  return _0x3d24f6;
}
function isPendingResult(_0x2353ce) {
  return !!_0x2353ce && typeof _0x2353ce === "object" && _0x2353ce["pending"] === !![];
}
function getPendingMessage(_0x4f9379) {
  return String(_0x4f9379?.['message'] || _0x4f9379?.["statusMessage"] || _0x4f9379?.["msg"] || '')["trim"]();
}
function isMissingTargetNodeError(_0x338262, _0x4632a8) {
  const _0x378555 = String(_0x338262?.['message'] || '');
  return _0x378555["includes"]("updateNodeData()") && _0x378555['includes'](String(_0x4632a8 || ''));
}
function persistResumableTaskState(_0x2043eb, _0x51bdb3 = {}) {
  if (_0x2043eb?.["spec"]?.['resumable'] !== !![]) {
    return;
  }
  if (typeof _0x2043eb['persistTaskState'] !== "function") {
    return;
  }
  try {
    const _0x2f4726 = _0x2043eb["persistTaskState"]({
      'sourceNodeId': _0x2043eb["sourceNodeId"],
      'targetNodeId': _0x2043eb['targetNodeId'],
      'taskId': _0x2043eb['taskId'],
      'spec': _0x2043eb["spec"],
      'patch': _0x51bdb3
    });
    _0x2f4726?.['catch']?.(() => {});
  } catch {}
}
function updateTaskNode(_0xdaded3, _0x92e00e, _0x1aedcb, {
  allowMissing = ![]
} = {}) {
  if (!_0x92e00e || !_0x1aedcb || typeof _0x1aedcb !== "object") {
    return ![];
  }
  try {
    _0xdaded3["updateNodeData"](_0x92e00e, _0x1aedcb, {
      'history': "preserve"
    });
    return !![];
  } catch (_0x4a05f8) {
    if (allowMissing && isMissingTargetNodeError(_0x4a05f8, _0x92e00e)) {
      return ![];
    }
    throw _0x4a05f8;
  }
}
function updateContextNode(_0x112718, _0x2bd81a, _0x27ee56, _0x2ab0f2 = {}) {
  if (_0x112718?.["background"] !== !![] && _0x112718?.["isTargetCurrent"]?.() === ![]) {
    return ![];
  }
  const _0x1a7e90 = updateTaskNode(_0x112718["store"], _0x2bd81a, _0x27ee56, _0x2ab0f2);
  if (_0x1a7e90) {
    _0x2bd81a === _0x112718["targetNodeId"] && persistResumableTaskState(_0x112718, _0x27ee56);
    if (typeof _0x112718['mirrorTaskState'] === "function") {
      try {
        const _0x390657 = _0x112718["mirrorTaskState"]({
          'sourceNodeId': _0x112718['sourceNodeId'],
          'targetNodeId': _0x112718['targetNodeId'],
          'taskId': _0x112718["taskId"],
          'taskScopeId': _0x112718["taskScopeId"],
          'spec': _0x112718["spec"],
          'patch': _0x27ee56,
          'updatedNodeId': _0x2bd81a,
          'store': _0x112718["store"]
        });
        _0x390657?.["catch"]?.(_0x3ed63b => {
          console['error']("[generationTaskRuntime] Failed to mirror background task state:", _0x3ed63b);
        });
      } catch (_0x203619) {
        console['error']("[generationTaskRuntime] Failed to mirror background task state:", _0x203619);
      }
    }
  }
  return _0x1a7e90;
}
function updateContextTaskNode(_0x395921, _0x280ec7, _0x15ae90 = {}) {
  return updateContextNode(_0x395921, _0x395921["targetNodeId"], _0x280ec7, _0x15ae90);
}
function notifyTaskChange(_0x5c70cc, _0x47f1ef = {}) {
  reportRuntimeTask(_0x5c70cc, _0x47f1ef);
  typeof _0x5c70cc?.["spec"]?.["onTaskChange"] === 'function' && _0x5c70cc["spec"]["onTaskChange"]({
    'sourceNodeId': _0x5c70cc["sourceNodeId"],
    'targetNodeId': _0x5c70cc['targetNodeId'],
    'taskId': _0x5c70cc["taskId"],
    ..._0x47f1ef
  });
}
function isAbortLike(_0x731677) {
  const _0x33b679 = String(_0x731677?.["message"] || _0x731677 || '');
  return _0x731677?.["name"] === "AbortError" || _0x33b679 === 'CANCELLED' || _0x33b679 === getCancelledMessage() || CANCELLED_MESSAGE_ALIASES["includes"](_0x33b679) || _0x33b679['toLowerCase']()["includes"]("aborted");
}
function parseErrorMessage(_0x4e77b7, _0x461c87 = {}, _0x44d023 = t("coreUi.generationTask.generateFailed")) {
  if (typeof _0x461c87["parseError"] === 'function') {
    const _0x21c6b6 = _0x461c87["parseError"](_0x4e77b7);
    const _0x2ba321 = String(_0x21c6b6 || '')["trim"]();
    if (_0x2ba321) {
      return _0x2ba321;
    }
  }
  if (typeof _0x4e77b7?.["getUserMessage"] === 'function') {
    const _0x2ec409 = String(_0x4e77b7["getUserMessage"]() || '')["trim"]();
    if (_0x2ec409) {
      return _0x2ec409;
    }
  }
  return String(_0x4e77b7?.["message"] || _0x44d023)['trim']() || _0x44d023;
}
function createCancelledError() {
  const _0x3c53ba = new Error(getCancelledMessage());
  _0x3c53ba['name'] = "AbortError";
  return _0x3c53ba;
}
function getQueuedMessage() {
  const _0x94571 = String(t("coreUi.generationTask.queued") || '')["trim"]();
  return _0x94571 && _0x94571 !== "coreUi.generationTask.queued" ? _0x94571 : "Queued";
}
function isCancelledStatus(_0x446593) {
  const _0x84886c = String(_0x446593 || '')['trim']()["toLowerCase"]();
  return _0x84886c === "cancelled" || _0x84886c === "canceled";
}
function isContextCancelled(_0x1283db) {
  if (_0x1283db?.["cancelRequested"] === !![]) {
    return !![];
  }
  const _0x4dd52e = getStateSnapshot(_0x1283db['store'])["nodes"]?.[_0x1283db["targetNodeId"]];
  return isCancelledStatus(_0x4dd52e?.["jobStatus"]) || isCancelledStatus(_0x4dd52e?.["rhTaskStatus"]) || isCancelledStatus(_0x4dd52e?.["asyncTaskStatus"]);
}
function shouldPauseOnAbort(_0x1cd869 = {}, _0x3c952d = {}) {
  if (_0x1cd869["pauseOnAbort"] === !![]) {
    return !![];
  }
  if (_0x1cd869["pauseOnAbort"] !== "afterTaskId") {
    return ![];
  }
  return !!String(_0x3c952d?.["taskId"] || _0x1cd869["taskId"] || '')['trim']();
}
function isContextInFlight(_0x5b2d54) {
  return !!_0x5b2d54 && _0x5b2d54["inFlight"] === !![] && !isContextCancelled(_0x5b2d54);
}
function canAbortContextSignal(_0x5b36c4) {
  if (typeof _0x5b36c4?.["abortController"]?.["abort"] !== "function") {
    return ![];
  }
  return !_0x5b36c4["signal"] || _0x5b36c4["signal"] === _0x5b36c4['abortController']["signal"];
}
function markContextIdle(_0x564c32) {
  if (!_0x564c32) {
    return;
  }
  _0x564c32["inFlight"] = ![];
  _0x564c32["resolveSettled"]?.();
}
function deleteActiveTask(_0x3aa83e, _0x26a07a) {
  _0x26a07a?.['resolveSettled']?.();
  if (_0x26a07a?.['runtimeTaskKey']) {
    activeTasks["delete"](_0x26a07a['runtimeTaskKey']);
    return;
  }
  for (const [_0x11a8e3, _0x2cba0f] of activeTasks['entries']()) {
    _0x2cba0f?.["targetNodeId"] === _0x3aa83e && activeTasks["delete"](_0x11a8e3);
  }
}
function buildAlreadyActiveResult(_0x501166, _0x124af3, _0x2e39cc) {
  return {
    'ok': !![],
    'status': 'running',
    'alreadyActive': !![],
    'targetNodeId': _0x124af3,
    'taskId': String(_0x501166?.["taskId"] || _0x2e39cc || '')['trim']()
  };
}
async function cancelRemoteTask(_0x15aa69, {
  taskId: _0x523a3e,
  node = null,
  options = {}
} = {}) {
  const _0x13e8d3 = String(_0x523a3e || _0x15aa69?.['taskId'] || '')["trim"]();
  const _0x2911ea = getCancelFn(_0x15aa69 || {
    'spec': options["spec"]
  }, options);
  if (typeof _0x2911ea !== "function" || !_0x13e8d3) {
    return;
  }
  return await _0x2911ea({
    'taskId': _0x13e8d3,
    'targetNodeId': _0x15aa69?.['targetNodeId'] || options["targetNodeId"] || '',
    'sourceNodeId': _0x15aa69?.['sourceNodeId'] || node?.["rhSourceNodeId"] || '',
    'spec': _0x15aa69?.["spec"] || options['spec'] || {},
    'node': node
  });
}
function cancelContextRemoteTaskOnce(_0x5b8dde, {
  taskId: _0xc006d1,
  node = null,
  options = {}
} = {}) {
  const _0x4bb9de = String(_0xc006d1 || _0x5b8dde?.["taskId"] || '')['trim']();
  if (!_0x5b8dde || !_0x4bb9de) {
    return Promise["resolve"](cancelRemoteTask(_0x5b8dde, {
      'taskId': _0x4bb9de,
      'node': node,
      'options': options
    }));
  }
  if (_0x5b8dde["remoteCancellationTaskId"] === _0x4bb9de && _0x5b8dde["remoteCancellationPromise"]) {
    return _0x5b8dde['remoteCancellationPromise'];
  }
  _0x5b8dde["remoteCancellationTaskId"] = _0x4bb9de;
  _0x5b8dde["remoteCancellationPromise"] = Promise['resolve'](cancelRemoteTask(_0x5b8dde, {
    'taskId': _0x4bb9de,
    'node': node,
    'options': options
  }));
  return _0x5b8dde["remoteCancellationPromise"];
}
async function ensureTargetNode(_0x3ed461, _0x532a53, _0x362a69) {
  const _0x44660e = String(_0x3ed461['targetNodeId'] || '')["trim"]();
  if (_0x44660e) {
    return _0x44660e;
  }
  if (typeof _0x3ed461["createTargetNode"] !== "function") {
    throw new Error("[generationTaskRuntime] targetNodeId or createTargetNode() is required");
  }
  const _0x41fd7a = await _0x3ed461["createTargetNode"]({
    'spec': _0x3ed461,
    'startedAt': _0x362a69,
    'startPatch': buildGenerationStartPatch({
      'startedAt': _0x362a69
    }),
    'protocolPatch': buildGenerationProtocolTransitionPatch({
      'type': 'start',
      'spec': _0x3ed461,
      'startedAt': _0x362a69
    })
  });
  if (!_0x41fd7a || typeof _0x41fd7a !== "object") {
    throw new Error("[generationTaskRuntime] createTargetNode() must return a node");
  }
  const _0x293c58 = String(_0x41fd7a['id'] || '')["trim"]();
  if (!_0x293c58) {
    throw new Error('[generationTaskRuntime]\x20created\x20target\x20node\x20must\x20include\x20id');
  }
  _0x532a53["addNode"](_0x41fd7a);
  return _0x293c58;
}
function buildContext(_0x1bc664, _0x3feb93, _0x5b5375, _0x229a57, _0x4bdc14) {
  const _0x560753 = _0x4bdc14["abortController"] || (typeof AbortController === "function" ? new AbortController() : null);
  let _0x57e072 = ![];
  let _0x15276b;
  const _0x5bf449 = new Promise(_0x414367 => {
    _0x15276b = _0x414367;
  });
  const _0x499ae5 = {
    'runtimeTaskKey': "generation-task:" + _0x3feb93 + ':' + _0x229a57 + ':' + ++activeTaskSequence,
    'spec': _0x1bc664,
    'store': _0x5b5375,
    'targetNodeId': _0x3feb93,
    'sourceNodeId': String(_0x1bc664['sourceNodeId'] || ''),
    'taskType': String(_0x1bc664['taskType'] || ''),
    'projectId': resolveTaskProjectId(_0x1bc664, _0x4bdc14),
    'taskScopeId': String(_0x4bdc14["taskScopeId"] || _0x1bc664['taskScopeId'] || '')['trim'](),
    'background': ![],
    'isTargetCurrent': _0x4bdc14["isTargetCurrent"],
    'mirrorTaskState': null,
    'startedAt': _0x229a57,
    'taskId': String(_0x1bc664["taskId"] || ''),
    'taskCenterTaskId': '',
    'abortController': _0x560753,
    'signal': _0x4bdc14["signal"] || _0x560753?.["signal"] || null,
    'persistTaskState': _0x4bdc14["persistTaskState"] || _0x1bc664['persistTaskState'] || null,
    'remoteCancellationTaskId': '',
    'remoteCancellationPromise': null,
    'cancelRequested': ![],
    'inFlight': !![],
    'settledPromise': _0x5bf449,
    'resolveSettled'() {
      if (_0x57e072) {
        return;
      }
      _0x57e072 = !![];
      _0x15276b();
    }
  };
  _0x499ae5["getTaskNode"] = () => getStateSnapshot(_0x499ae5["store"])["nodes"]?.[_0x499ae5['targetNodeId']] || null;
  _0x499ae5['getNode'] = _0x319692 => getStateSnapshot(_0x499ae5["store"])["nodes"]?.[String(_0x319692 || '')["trim"]()] || null;
  _0x499ae5["updateTaskNode"] = (_0x479366, _0x515772 = {}) => updateContextTaskNode(_0x499ae5, _0x479366, _0x515772);
  _0x499ae5["updateNode"] = (_0xf09e22, _0x24080c, _0x579711 = {}) => updateContextNode(_0x499ae5, String(_0xf09e22 || '')['trim'](), _0x24080c, _0x579711);
  _0x499ae5["isBackgroundTask"] = () => _0x499ae5["background"] === !![];
  return _0x499ae5;
}
async function pauseTaskContexts(_0x248316, _0x343864, _0x1bbaad = {}) {
  const _0x41afbd = _0x248316["filter"](_0x462e28 => {
    if (_0x462e28?.['spec']?.["resumable"] !== !![]) {
      return !![];
    }
    if (!String(_0x462e28?.["taskId"] || '')["trim"]()) {
      return !![];
    }
    if (!shouldPauseOnAbort(_0x462e28["spec"], _0x462e28)) {
      return !![];
    }
    return !canAbortContextSignal(_0x462e28);
  })["map"](_0x38f314 => ({
    'targetNodeId': _0x38f314["targetNodeId"],
    'taskId': String(_0x38f314["taskId"] || '')['trim'](),
    'taskType': _0x38f314["taskType"],
    'reason': _0x38f314?.['spec']?.["resumable"] !== !![] ? "not-resumable" : !String(_0x38f314?.["taskId"] || '')['trim']() ? "missing-task-id" : !shouldPauseOnAbort(_0x38f314['spec'], _0x38f314) ? 'pause-not-supported' : "abort-unavailable"
  }));
  if (_0x41afbd["length"] > 0x0) {
    return {
      'ok': ![],
      'projectId': _0x343864,
      'activeCount': _0x248316["length"],
      'pausedCount': 0x0,
      'blockers': _0x41afbd
    };
  }
  if (_0x1bbaad["dryRun"] === !![]) {
    return {
      'ok': !![],
      'projectId': _0x343864,
      'activeCount': _0x248316['length'],
      'pausedCount': 0x0,
      'blockers': [],
      'pausedTasks': []
    };
  }
  const _0x3cf697 = [];
  _0x248316["forEach"](_0x26ac3e => {
    _0x26ac3e["abortController"]["signal"]?.["aborted"] !== !![] && _0x26ac3e['abortController']["abort"]();
    _0x3cf697["push"]({
      'targetNodeId': _0x26ac3e['targetNodeId'],
      'taskId': String(_0x26ac3e["taskId"] || '')["trim"](),
      'taskType': _0x26ac3e["taskType"]
    });
  });
  const _0x35694c = Math["max"](0x64, Number(_0x1bbaad['timeoutMs']) || 0xbb8);
  if (_0x248316["length"] > 0x0) {
    let _0x244753 = null;
    const _0xe9278e = new Promise(_0x469676 => {
      _0x244753 = setTimeout(() => _0x469676(![]), _0x35694c);
      _0x244753?.["unref"]?.();
    });
    const _0x42b045 = await Promise["race"]([Promise['all'](_0x248316["map"](_0x2776d2 => _0x2776d2["settledPromise"]))["then"](() => !![]), _0xe9278e]);
    if (_0x244753 !== null) {
      clearTimeout(_0x244753);
    }
    if (!_0x42b045) {
      return {
        'ok': ![],
        'projectId': _0x343864,
        'activeCount': _0x248316["length"],
        'pausedCount': _0x3cf697['length'],
        'blockers': _0x3cf697['map'](_0x3e4386 => ({
          ..._0x3e4386,
          'reason': "pause-timeout"
        })),
        'pausedTasks': _0x3cf697
      };
    }
    await new Promise(_0x4bbaad => setTimeout(_0x4bbaad, 0x0));
  }
  return {
    'ok': !![],
    'projectId': _0x343864,
    'activeCount': _0x248316["length"],
    'pausedCount': _0x3cf697['length'],
    'blockers': [],
    'pausedTasks': _0x3cf697
  };
}
export async function pauseProjectTasks(_0x5af87d, _0x15adf1 = {}) {
  const _0x5b8809 = normalizeProjectId(_0x5af87d);
  const _0x428875 = Array["from"](activeTasks["values"]())["filter"](_0x370400 => isContextInFlight(_0x370400) && normalizeProjectId(_0x370400?.["projectId"]) === _0x5b8809);
  return pauseTaskContexts(_0x428875, _0x5b8809, _0x15adf1);
}
export async function pauseActiveWorkspaceTasks(_0x164c41 = {}) {
  const _0x16d288 = Array["from"](activeTasks["values"]())["filter"](isContextInFlight);
  return pauseTaskContexts(_0x16d288, "active-workspace", _0x164c41);
}
export function handoffActiveGenerationTasks({
  sourceStore = a606_0x4c6a7c,
  targetStore: _0x4604c3,
  taskScopeId: _0x255eeb,
  mirrorTaskState = null
} = {}) {
  const _0x47dc45 = String(_0x255eeb || '')["trim"]();
  if (!_0x4604c3 || !_0x47dc45) {
    return {
      'ok': ![],
      'movedCount': 0x0,
      'taskScopeId': _0x47dc45
    };
  }
  const _0x16363c = Array['from'](activeTasks["values"]())["filter"](_0x37372d => isContextInFlight(_0x37372d) && _0x37372d["store"] === sourceStore);
  _0x16363c["forEach"](_0x52c546 => {
    _0x52c546["store"] = _0x4604c3;
    _0x52c546["taskScopeId"] = _0x47dc45;
    _0x52c546["background"] = !![];
    _0x52c546['mirrorTaskState'] = typeof mirrorTaskState === 'function' ? mirrorTaskState : null;
  });
  return {
    'ok': !![],
    'movedCount': _0x16363c["length"],
    'taskScopeId': _0x47dc45,
    'targetNodeIds': _0x16363c["map"](_0x5f8a01 => _0x5f8a01["targetNodeId"])
  };
}
export function restoreActiveGenerationTasks({
  taskScopeId: _0x45a049,
  targetStore = a606_0x4c6a7c
} = {}) {
  const _0x778173 = String(_0x45a049 || '')["trim"]();
  const _0x162c46 = Array["from"](activeTasks["values"]())["filter"](_0x4107b4 => isContextInFlight(_0x4107b4) && String(_0x4107b4["taskScopeId"] || '')['trim']() === _0x778173);
  _0x162c46["forEach"](_0x3be224 => {
    _0x3be224["store"] = targetStore;
    _0x3be224["background"] = ![];
    _0x3be224['mirrorTaskState'] = null;
  });
  return {
    'ok': !![],
    'restoredCount': _0x162c46["length"],
    'taskScopeId': _0x778173,
    'targetNodeIds': _0x162c46["map"](_0x1f0fd7 => _0x1f0fd7["targetNodeId"])
  };
}
export function hasActiveGenerationTasksForStore(_0x5c8542) {
  return Array["from"](activeTasks["values"]())["some"](_0x2e6dd8 => isContextInFlight(_0x2e6dd8) && _0x2e6dd8["store"] === _0x5c8542);
}
export function hasActiveGenerationTasksForScope(_0x30854b) {
  const _0x1797fb = String(_0x30854b || '')["trim"]();
  if (!_0x1797fb) {
    return ![];
  }
  return Array["from"](activeTasks["values"]())["some"](_0x2dc447 => isContextInFlight(_0x2dc447) && String(_0x2dc447["taskScopeId"] || '')["trim"]() === _0x1797fb);
}
export function shouldPreserveGenerationTaskOnUnmount(_0x6b6876) {
  const _0x246072 = String(_0x6b6876 || '')["trim"]();
  return Array['from'](activeTasks["values"]())["some"](_0xd828b1 => _0xd828b1?.["targetNodeId"] === _0x246072 && isContextInFlight(_0xd828b1) && _0xd828b1["background"] === !![]);
}
export async function normalizeResult(_0x2002d3, {
  spec: _0xad6663,
  context: _0x1e8d6e
} = {}) {
  const _0x25e701 = resolveSpecManifestContext(_0xad6663);
  const _0x3f8c8c = _0x25e701 ? buildManifestResultPatch(_0x2002d3, _0x25e701) : {};
  const _0x131b2e = typeof _0xad6663?.["resultBuilder"] === "function" ? mergeManifestResultPatch(await _0xad6663["resultBuilder"](_0x2002d3, {
    'spec': _0xad6663,
    'targetNodeId': _0x1e8d6e?.["targetNodeId"] || _0xad6663["targetNodeId"],
    'sourceNodeId': _0x1e8d6e?.['sourceNodeId'] || _0xad6663["sourceNodeId"],
    'taskId': _0x1e8d6e?.["taskId"] || _0xad6663["taskId"] || '',
    'startedAt': _0x1e8d6e?.['startedAt'] || _0xad6663["startedAt"] || 0x0,
    'getNode': _0x1e8d6e?.["getNode"],
    'getTaskNode': _0x1e8d6e?.["getTaskNode"],
    'updateNode': _0x1e8d6e?.["updateNode"],
    'updateTaskNode': _0x1e8d6e?.['updateTaskNode'],
    'isBackgroundTask': _0x1e8d6e?.['isBackgroundTask'],
    'manifestResultPatch': _0x3f8c8c
  }), _0x3f8c8c) : _0x3f8c8c;
  if (!_0x131b2e || typeof _0x131b2e !== "object" || Array["isArray"](_0x131b2e) || Object["keys"](_0x131b2e)["length"] === 0x0) {
    if (_0xad6663?.["allowEmptyResult"] === !![]) {
      return {};
    }
    throw new Error('Generation\x20completed\x20without\x20output.');
  }
  return _0x131b2e;
}
async function buildOptionalTaskPatch(_0x136496, _0x4eb650) {
  if (typeof _0x136496 !== 'function') {
    return {};
  }
  const _0x1b2a03 = await _0x136496(..._0x4eb650);
  return _0x1b2a03 && typeof _0x1b2a03 === "object" ? _0x1b2a03 : {};
}
async function buildStartExtraPatch(_0x270c0f, _0x17bc89) {
  if (typeof _0x270c0f?.["startBuilder"] === "function") {
    const _0x4b66e3 = await _0x270c0f["startBuilder"](_0x17bc89);
    return _0x4b66e3 && typeof _0x4b66e3 === "object" ? _0x4b66e3 : {};
  }
  if (_0x270c0f?.["startPatch"] && typeof _0x270c0f["startPatch"] === "object" && !Array["isArray"](_0x270c0f["startPatch"])) {
    return {
      ..._0x270c0f["startPatch"]
    };
  }
  return {};
}
function startTaskContext(_0x3bcda3, _0x3d35ce, {
  recovering = ![]
} = {}) {
  const {
    spec: _0x442c76,
    startedAt: _0x32606d,
    taskId: _0x2d5906
  } = _0x3bcda3;
  if (_0x3bcda3["cancelRequested"] || _0x3bcda3["signal"]?.["aborted"]) {
    throw createCancelledError();
  }
  updateContextTaskNode(_0x3bcda3, {
    ...buildGenerationStartPatch({
      'startedAt': _0x32606d
    }),
    ...buildGenerationProtocolTransitionPatch({
      'type': "start",
      'spec': _0x442c76,
      'startedAt': _0x32606d
    }),
    ...(recovering ? buildGenerationProtocolTransitionPatch({
      'type': "taskId",
      'spec': _0x442c76,
      'taskId': _0x2d5906,
      'startedAt': _0x32606d
    }) : {}),
    ..._0x3d35ce,
    ...(recovering && isWorkflowSpec(_0x442c76) ? {
      'rhTaskRecovering': !![]
    } : {}),
    ...(recovering && isAsyncModelApiSpec(_0x442c76) ? {
      'asyncTaskRecovering': !![]
    } : {})
  });
  const _0x56538a = () => {
    if (isContextCancelled(_0x3bcda3)) {
      throw createCancelledError();
    }
    notifyTaskChange(_0x3bcda3, {
      'status': "running",
      ...(recovering ? {
        'recovering': !![]
      } : {})
    });
  };
  const _0x1c3c44 = typeof _0x442c76["onTaskStart"] === "function" ? _0x442c76["onTaskStart"](_0x3bcda3) : null;
  return _0x1c3c44 && typeof _0x1c3c44['then'] === 'function' ? Promise['resolve'](_0x1c3c44)['then'](_0x56538a) : _0x56538a();
}
export async function pollTask(_0x2cb38f, _0x43f76c = {}) {
  const _0x53df7f = getPollFn(_0x2cb38f);
  if (typeof _0x53df7f !== "function") {
    throw new Error("[generationTaskRuntime] poll function is required");
  }
  return _0x53df7f({
    'taskId': String(_0x2cb38f['taskId'] || _0x2cb38f["spec"]?.["taskId"] || ''),
    'targetNodeId': _0x2cb38f["targetNodeId"] || _0x2cb38f['spec']?.["targetNodeId"],
    'sourceNodeId': _0x2cb38f['sourceNodeId'] || _0x2cb38f['spec']?.["sourceNodeId"],
    'taskType': _0x2cb38f["taskType"] || _0x2cb38f["spec"]?.["taskType"],
    'payload': _0x2cb38f["payload"] || _0x2cb38f["spec"]?.["payload"],
    'spec': _0x2cb38f["spec"] || _0x2cb38f,
    'signal': _0x43f76c['signal'] || _0x2cb38f["signal"] || _0x2cb38f["abortController"]?.['signal'] || null,
    'runningHubWorkflowQueueLease': _0x43f76c['runningHubWorkflowQueueLease'] || _0x2cb38f["runningHubWorkflowQueueLease"] || _0x2cb38f["spec"]?.["runningHubWorkflowQueueLease"] || null
  });
}
export async function submitTask(_0x3c683e, _0x444885 = {}) {
  assertSpec(_0x3c683e, {
    'requireSubmit': !![]
  });
  const _0x2344c1 = {
    'modelId': _0x3c683e["modelId"],
    'provider': _0x3c683e["provider"],
    'providerProfileId': _0x3c683e["providerProfileId"] || _0x3c683e["payload"]?.["providerProfileId"] || _0x3c683e['payload']?.["rhProviderProfileId"],
    'adapterType': _0x3c683e['adapterType'],
    'modelManifest': _0x3c683e["modelManifest"],
    'executionManifest': _0x3c683e["executionManifest"],
    'payload': _0x3c683e["payload"]
  };
  let _0x10bcd7 = getModelGenerationReadiness(_0x2344c1);
  _0x10bcd7["status"] === "unverified" && (_0x10bcd7 = await ensureModelGenerationReadiness({
    ..._0x2344c1,
    'autoVerify': !![]
  }));
  if (_0x444885["isTargetCurrent"]?.() === ![]) {
    return {
      'ok': ![],
      'status': "cancelled",
      'reason': "target-changed",
      'targetNodeId': String(_0x3c683e["targetNodeId"] || ''),
      'taskId': ''
    };
  }
  if (!_0x10bcd7["ready"] && _0x10bcd7['reason'] !== "cli-status-loading") {
    return {
      'ok': ![],
      'status': "failed",
      'blocked': !![],
      'reason': _0x10bcd7["reason"],
      'targetNodeId': String(_0x3c683e["targetNodeId"] || ''),
      'taskId': '',
      'readiness': _0x10bcd7,
      'error': createMissingModelCredentialError(_0x10bcd7)
    };
  }
  const _0x1e908b = getStore(_0x444885);
  const _0x305593 = Number(_0x3c683e["startedAt"] || _0x444885['startedAt'] || nowFrom(_0x444885));
  const _0x33618a = String(_0x3c683e['targetNodeId'] || '')["trim"]();
  const _0x1f31f5 = _0x33618a || (await ensureTargetNode(_0x3c683e, _0x1e908b, _0x305593));
  const _0x760d63 = {
    ..._0x3c683e,
    'targetNodeId': _0x1f31f5
  };
  let _0x1e2b1c = null;
  const _0x221607 = buildContext(_0x760d63, _0x1f31f5, _0x1e908b, _0x305593, _0x444885);
  activeTasks["set"](_0x221607["runtimeTaskKey"], _0x221607);
  reportRuntimeTask(_0x221607, {
    'status': "running",
    'message': t('taskCenter.preparing')
  });
  const _0x4a6473 = (_0x3363bf = {}) => {
    if (!isRunningHubWorkflowQueueSpec(_0x760d63)) {
      return;
    }
    const _0xa9c223 = String(_0x3363bf?.["status"] || '')["trim"]()["toLowerCase"]();
    if (_0xa9c223 === "queued") {
      const _0x5ceb72 = _0x221607["getTaskNode"]?.() || {};
      if (_0x5ceb72["generationQueueStatus"] === 'queued' && _0x5ceb72["rhStatusMessage"] === getQueuedMessage()) {
        return;
      }
      updateContextTaskNode(_0x221607, {
        ...buildGenerationProtocolTransitionPatch({
          'type': 'pending',
          'spec': _0x760d63,
          'context': _0x221607,
          'message': getQueuedMessage()
        }),
        'generationQueueStatus': "queued"
      });
      notifyTaskChange(_0x221607, {
        'status': "queued"
      });
      return;
    }
    if (_0xa9c223 === "running") {
      const _0x1b32d1 = _0x221607["getTaskNode"]?.() || {};
      if (_0x1b32d1['generationQueueStatus'] === "running" && !_0x1b32d1["statusMessage"] && _0x1b32d1['rhStatusMessage'] == null) {
        return;
      }
      updateContextTaskNode(_0x221607, {
        'generationQueueStatus': "running",
        'statusMessage': '',
        'rhStatusMessage': null
      });
      notifyTaskChange(_0x221607, {
        'status': "running"
      });
    }
  };
  const _0x128448 = async (_0x37ee27 = null) => {
    _0x221607["runningHubWorkflowQueueLease"] = _0x37ee27 || null;
    const _0x36c3f8 = getSubmitFn(_0x760d63);
    const _0x462cb8 = await _0x36c3f8(_0x760d63["payload"], {
      'spec': _0x760d63,
      'targetNodeId': _0x1f31f5,
      'sourceNodeId': _0x221607["sourceNodeId"],
      'taskType': _0x221607["taskType"],
      'signal': _0x221607["signal"],
      'getNode': _0x221607["getNode"],
      'getTaskNode': _0x221607["getTaskNode"],
      'updateNode': _0x221607["updateNode"],
      'updateTaskNode': _0x221607["updateTaskNode"],
      'isBackgroundTask': _0x221607["isBackgroundTask"],
      'runningHubWorkflowQueueLease': _0x221607["runningHubWorkflowQueueLease"],
      'onRunningHubWorkflowQueueChange': _0x4a6473,
      'onTaskId': _0x4d9263 => {
        const _0x1dcccb = String(_0x4d9263 || '')["trim"]();
        if (!_0x1dcccb) {
          return;
        }
        _0x221607['taskId'] = _0x1dcccb;
        if (isContextCancelled(_0x221607)) {
          void cancelContextRemoteTaskOnce(_0x221607, {
            'taskId': _0x1dcccb,
            'node': _0x221607['getTaskNode']?.()
          })['catch'](() => {});
          return;
        }
        updateContextTaskNode(_0x221607, buildGenerationProtocolTransitionPatch({
          'type': "taskId",
          'spec': _0x760d63,
          'taskId': _0x1dcccb,
          'startedAt': _0x305593
        }));
        notifyTaskChange(_0x221607, {
          'status': "running"
        });
      }
    });
    const _0x5ad298 = extractTaskId(_0x462cb8);
    _0x5ad298 && (_0x221607['taskId'] = _0x5ad298);
    if (isContextCancelled(_0x221607)) {
      try {
        await cancelContextRemoteTaskOnce(_0x221607, {
          'taskId': _0x221607['taskId'],
          'node': _0x221607["getTaskNode"]?.()
        });
      } catch {}
      throw createCancelledError();
    }
    _0x5ad298 && (updateContextTaskNode(_0x221607, buildGenerationProtocolTransitionPatch({
      'type': "taskId",
      'spec': _0x760d63,
      'taskId': _0x5ad298,
      'startedAt': _0x305593
    })), notifyTaskChange(_0x221607, {
      'status': "running"
    }));
    if (_0x760d63['waitForResult'] === ![]) {
      markContextIdle(_0x221607);
      return {
        'ok': !![],
        'status': 'submitted',
        'targetNodeId': _0x1f31f5,
        'taskId': _0x221607["taskId"]
      };
    }
    const _0x5dfb05 = _0x221607["taskId"] && getPollFn({
      'spec': _0x760d63
    }) ? await pollTask({
      ..._0x221607,
      'spec': _0x760d63
    }, {
      'signal': _0x221607["signal"],
      'runningHubWorkflowQueueLease': _0x221607["runningHubWorkflowQueueLease"]
    }) : extractSubmittedResult(_0x462cb8);
    if (isContextCancelled(_0x221607)) {
      throw createCancelledError();
    }
    if (isPendingResult(_0x5dfb05)) {
      const _0x238450 = getPendingMessage(_0x5dfb05);
      markContextIdle(_0x221607);
      updateContextTaskNode(_0x221607, buildGenerationProtocolTransitionPatch({
        'type': "pending",
        'spec': _0x760d63,
        'context': _0x221607,
        'message': _0x238450
      }));
      notifyTaskChange(_0x221607, {
        'status': 'pending'
      });
      return {
        'ok': !![],
        'status': 'pending',
        'pending': !![],
        'targetNodeId': _0x1f31f5,
        'taskId': _0x221607['taskId'],
        'result': _0x5dfb05
      };
    }
    const _0x4ac044 = await normalizeResult(_0x5dfb05, {
      'spec': _0x760d63,
      'context': _0x221607
    });
    if (isContextCancelled(_0x221607)) {
      throw createCancelledError();
    }
    const _0x5870dd = nowFrom(_0x444885) - _0x305593;
    updateContextTaskNode(_0x221607, {
      ...buildGenerationSuccessPatch({
        'startedAt': _0x305593,
        'duration': _0x5870dd
      }),
      ..._0x4ac044,
      ...buildGenerationProtocolTransitionPatch({
        'type': "terminal",
        'spec': _0x760d63,
        'status': "success"
      })
    });
    deleteActiveTask(_0x1f31f5, _0x221607);
    notifyTaskChange(_0x221607, {
      'status': 'success'
    });
    _0x760d63['completionFeedback'] !== ![] && dispatchGenerationCompletionFeedback(_0x221607);
    return {
      'ok': !![],
      'status': "success",
      'targetNodeId': _0x1f31f5,
      'taskId': _0x221607["taskId"],
      'result': _0x5dfb05
    };
  };
  try {
    const _0x4c810d = acquireGenerationExecution(_0x1e908b, _0x760d63, _0x444885);
    _0x1e2b1c = typeof _0x4c810d === "function" ? _0x4c810d : await _0x4c810d;
    const _0x35fd2f = await buildStartExtraPatch(_0x760d63, _0x221607);
    if (_0x221607["background"] !== !![] && _0x444885["isTargetCurrent"]?.() === ![]) {
      deleteActiveTask(_0x1f31f5, _0x221607);
      reportRuntimeTask(_0x221607, {
        'status': "cancelled"
      });
      return {
        'ok': ![],
        'status': "cancelled",
        'reason': "target-changed",
        'targetNodeId': _0x1f31f5,
        'taskId': ''
      };
    }
    const _0x1d9ee5 = startTaskContext(_0x221607, _0x35fd2f);
    if (_0x1d9ee5) {
      await _0x1d9ee5;
    }
    if (isRunningHubWorkflowQueueSpec(_0x760d63)) {
      const _0xd97b52 = resolveRunningHubWorkflowQueueConfig({
        'payload': _0x760d63['payload'],
        'concurrency': _0x444885["runningHubWorkflowConcurrency"]
      });
      return await runWithRunningHubWorkflowQueue({
        ..._0xd97b52,
        'signal': _0x221607["signal"],
        'lease': _0x444885["runningHubWorkflowQueueLease"],
        'onQueueChange': _0x4a6473,
        'autoProbeConcurrency': _0x444885["autoProbeConcurrency"],
        'concurrencyProbe': _0x444885["runningHubWorkflowConcurrencyProbe"],
        'queuePollIntervalMs': _0x444885['runningHubWorkflowQueuePollIntervalMs']
      }, _0x128448);
    }
    return await _0x128448(_0x444885["runningHubWorkflowQueueLease"] || null);
  } catch (_0x4627d4) {
    try {
      _0x221607["remoteCancellationPromise"] && (await _0x221607["remoteCancellationPromise"]["catch"](() => {}));
      const _0x1825d3 = nowFrom(_0x444885) - _0x305593;
      const _0x28cbf9 = isAbortLike(_0x4627d4);
      const _0x57a69a = _0x221607["getTaskNode"]?.() || {};
      if (_0x28cbf9 && (isCancelledStatus(_0x57a69a?.["jobStatus"]) || isCancelledStatus(_0x57a69a?.["rhTaskStatus"]) || isCancelledStatus(_0x57a69a?.["asyncTaskStatus"]))) {
        notifyTaskChange(_0x221607, {
          'status': "cancelled"
        });
        return {
          'ok': ![],
          'status': "cancelled",
          'targetNodeId': _0x1f31f5,
          'taskId': _0x221607["taskId"],
          'error': _0x4627d4
        };
      }
      if (_0x28cbf9 && shouldPauseOnAbort(_0x760d63, _0x221607)) {
        const _0x15e641 = await buildOptionalTaskPatch(_0x760d63["pauseBuilder"], [_0x221607]);
        updateContextTaskNode(_0x221607, {
          ...buildGenerationProtocolTransitionPatch({
            'type': "pending",
            'spec': _0x760d63,
            'context': _0x221607
          }),
          ..._0x15e641
        }, {
          'allowMissing': !![]
        });
        notifyTaskChange(_0x221607, {
          'status': 'paused'
        });
        return {
          'ok': ![],
          'status': "paused",
          'targetNodeId': _0x1f31f5,
          'taskId': _0x221607['taskId'],
          'error': _0x4627d4
        };
      }
      const _0x212116 = _0x28cbf9 ? '' : parseErrorMessage(_0x4627d4, _0x760d63, t("coreUi.generationTask.generateFailed"));
      const _0x1e5166 = _0x28cbf9 ? buildGenerationCancelledPatch({
        'startedAt': _0x305593,
        'duration': _0x1825d3
      }) : buildGenerationFailurePatch({
        'error': _0x212116,
        'startedAt': _0x305593,
        'duration': _0x1825d3
      });
      const _0x182ea7 = await buildOptionalTaskPatch(_0x1e2b1c ? _0x28cbf9 ? _0x760d63['cancelledBuilder'] : _0x760d63["failureBuilder"] : null, _0x28cbf9 ? [_0x221607] : [_0x4627d4, _0x221607]);
      updateContextTaskNode(_0x221607, {
        ..._0x1e5166,
        ..._0x182ea7,
        ...buildGenerationProtocolTransitionPatch({
          'type': "terminal",
          'spec': _0x760d63,
          'status': _0x28cbf9 ? 'cancelled' : "failed"
        })
      });
      notifyTaskChange(_0x221607, {
        'status': _0x28cbf9 ? "cancelled" : "failed"
      });
      return {
        'ok': ![],
        'status': _0x28cbf9 ? "cancelled" : 'failed',
        'targetNodeId': _0x1f31f5,
        'taskId': _0x221607["taskId"],
        'error': _0x4627d4
      };
    } finally {
      deleteActiveTask(_0x1f31f5, _0x221607);
    }
  } finally {
    const _0x40e6ea = _0x1e2b1c?.();
    if (_0x40e6ea?.["then"]) {
      await _0x40e6ea;
    }
  }
}
export async function cancelTask(_0x27997c, _0x53dda2 = {}) {
  const _0x2ff877 = getStore(_0x53dda2);
  const _0x1a7fad = String(typeof _0x27997c === "object" ? _0x27997c?.["targetNodeId"] || _0x27997c?.['outId'] || _0x27997c?.['id'] : _0x27997c || '')['trim']();
  if (!_0x1a7fad) {
    return {
      'ok': ![],
      'reason': "missing-target"
    };
  }
  const _0x47e7f0 = String(_0x53dda2["taskCenterTaskId"] || (typeof _0x27997c === "object" ? _0x27997c?.["taskCenterTaskId"] : '') || '')['trim']();
  const _0x36f212 = _0x47e7f0 ? findActiveTaskContext(_0x1a7fad, {
    'taskCenterTaskId': _0x47e7f0
  }) : findActiveTaskContext(_0x1a7fad, {
    'storeLike': _0x2ff877
  });
  const _0x5866bc = _0x36f212?.["store"] || _0x2ff877;
  const _0xd019a9 = getStateSnapshot(_0x5866bc)["nodes"]?.[_0x1a7fad] || {};
  const _0x41fc06 = _0x36f212?.['spec'] || _0x53dda2["spec"] || {
    'adapterType': _0xd019a9["adapterType"],
    'provider': _0xd019a9["provider"],
    'async': !!_0xd019a9['asyncTaskId']
  };
  const _0x1631de = _0x53dda2['cancellable'] === !![] || _0x36f212?.["spec"]?.['cancellable'] === !![];
  if (!_0x1631de) {
    if (_0x53dda2["abortLocal"] === !![]) {
      if (_0x36f212) {
        _0x36f212["cancelRequested"] = !![];
      }
      _0x36f212?.["abortController"]?.['abort']?.();
    }
    return {
      'ok': ![],
      'reason': "not-cancellable",
      'targetNodeId': _0x1a7fad
    };
  }
  const _0x19a566 = String(_0x53dda2['taskId'] || _0x36f212?.["taskId"] || _0x27997c?.["taskId"] || _0xd019a9["rhTaskId"] || _0xd019a9["asyncTaskId"] || '');
  const _0x5b61c0 = getCancelFn(_0x36f212 || {
    'spec': _0x41fc06
  }, _0x53dda2);
  let _0xde6e51 = null;
  let _0x48e461 = null;
  try {
    if (_0x36f212) {
      _0x36f212["cancelRequested"] = !![];
    }
    _0x36f212?.['abortController']?.['abort']?.();
  } catch {}
  if (typeof _0x5b61c0 === "function" && _0x19a566) {
    try {
      _0xde6e51 = _0x36f212 ? await cancelContextRemoteTaskOnce(_0x36f212, {
        'taskId': _0x19a566,
        'node': _0xd019a9,
        'options': {
          ..._0x53dda2,
          'cancel': _0x5b61c0,
          'spec': _0x41fc06,
          'targetNodeId': _0x1a7fad
        }
      }) : await cancelRemoteTask({
        'spec': _0x41fc06,
        'targetNodeId': _0x1a7fad
      }, {
        'taskId': _0x19a566,
        'node': _0xd019a9,
        'options': {
          ..._0x53dda2,
          'cancel': _0x5b61c0,
          'spec': _0x41fc06,
          'targetNodeId': _0x1a7fad
        }
      });
    } catch (_0x26d4db) {
      _0x48e461 = _0x26d4db;
    }
  }
  const _0x48d582 = Number(_0xd019a9["generationStartTime"] || _0xd019a9["rhTaskStartedAt"] || 0x0) || 0x0;
  const _0x55b90c = await buildOptionalTaskPatch(_0x53dda2['cancelledBuilder'] || _0x41fc06["cancelledBuilder"], [{
    'spec': _0x41fc06,
    'store': _0x5866bc,
    'targetNodeId': _0x1a7fad,
    'startedAt': _0x48d582,
    'taskId': _0x19a566,
    'remoteResult': _0xde6e51,
    'remoteError': _0x48e461
  }]);
  const _0x99fd79 = _0x36f212 || {
    'spec': _0x41fc06,
    'store': _0x5866bc,
    'targetNodeId': _0x1a7fad,
    'sourceNodeId': String(_0x41fc06["sourceNodeId"] || _0xd019a9["rhSourceNodeId"] || ''),
    'taskId': _0x19a566,
    'persistTaskState': _0x53dda2['persistTaskState'] || _0x41fc06["persistTaskState"] || null
  };
  updateContextTaskNode(_0x99fd79, {
    ...buildGenerationCancelledPatch({
      'startedAt': _0x48d582
    }),
    ..._0x55b90c,
    ...buildGenerationProtocolTransitionPatch({
      'type': 'terminal',
      'spec': _0x41fc06,
      'status': "cancelled"
    })
  });
  deleteActiveTask(_0x1a7fad, _0x36f212);
  notifyTaskChange(_0x36f212, {
    'status': 'cancelled'
  });
  return {
    'ok': !![],
    'status': "cancelled",
    'targetNodeId': _0x1a7fad,
    'taskId': _0x19a566
  };
}
export async function resumeTask(_0x5bcb73, _0x2d4669 = {}) {
  assertSpec(_0x5bcb73, {
    'requireTarget': !![]
  });
  const _0x44c6a4 = getStore(_0x2d4669);
  const _0x54ce59 = String(_0x5bcb73["targetNodeId"] || '')['trim']();
  const _0xd07534 = getStateSnapshot(_0x44c6a4)["nodes"]?.[_0x54ce59] || {};
  const _0x72d311 = Number(_0x5bcb73["startedAt"] || _0xd07534["generationStartTime"] || _0xd07534["rhTaskStartedAt"] || nowFrom(_0x2d4669)) || nowFrom(_0x2d4669);
  const _0x4b4200 = String(_0x5bcb73["taskId"] || _0xd07534["rhTaskId"] || _0xd07534["asyncTaskId"] || '')["trim"]();
  if (!_0x4b4200) {
    throw new Error("[generationTaskRuntime] resumeTask requires taskId");
  }
  const _0x495704 = findActiveTaskContext(_0x54ce59, {
    'storeLike': _0x44c6a4
  });
  if (isContextInFlight(_0x495704)) {
    return buildAlreadyActiveResult(_0x495704, _0x54ce59, _0x4b4200);
  }
  const _0x15161d = {
    ..._0x5bcb73,
    'targetNodeId': _0x54ce59,
    'taskId': _0x4b4200
  };
  let _0x382ed7 = null;
  const _0x212d21 = buildContext(_0x15161d, _0x54ce59, _0x44c6a4, _0x72d311, _0x2d4669);
  _0x212d21["taskId"] = _0x4b4200;
  activeTasks['set'](_0x212d21["runtimeTaskKey"], _0x212d21);
  reportRuntimeTask(_0x212d21, {
    'status': 'running',
    'message': t("taskCenter.recovering")
  });
  try {
    const _0x2ed5f4 = acquireGenerationExecution(_0x44c6a4, _0x15161d, {
      ..._0x2d4669,
      'recovering': !![]
    });
    _0x382ed7 = typeof _0x2ed5f4 === "function" ? _0x2ed5f4 : await _0x2ed5f4;
    const _0x253c81 = await buildStartExtraPatch(_0x15161d, _0x212d21);
    if (_0x212d21["background"] !== !![] && _0x2d4669['isTargetCurrent']?.() === ![]) {
      deleteActiveTask(_0x54ce59, _0x212d21);
      reportRuntimeTask(_0x212d21, {
        'status': 'cancelled'
      });
      return {
        'ok': ![],
        'status': 'cancelled',
        'reason': "target-changed",
        'targetNodeId': _0x54ce59,
        'taskId': ''
      };
    }
    const _0x451ee9 = startTaskContext(_0x212d21, _0x253c81, {
      'recovering': !![]
    });
    if (_0x451ee9) {
      await _0x451ee9;
    }
    const _0x1aafbd = await pollTask({
      ..._0x212d21,
      'spec': _0x15161d
    }, {
      'signal': _0x212d21["signal"]
    });
    if (isContextCancelled(_0x212d21)) {
      throw createCancelledError();
    }
    if (isPendingResult(_0x1aafbd)) {
      const _0x1d49bf = getPendingMessage(_0x1aafbd);
      markContextIdle(_0x212d21);
      updateContextTaskNode(_0x212d21, buildGenerationProtocolTransitionPatch({
        'type': "pending",
        'spec': _0x15161d,
        'context': _0x212d21,
        'message': _0x1d49bf
      }));
      notifyTaskChange(_0x212d21, {
        'status': "pending",
        'recovering': !![]
      });
      return {
        'ok': !![],
        'status': "pending",
        'pending': !![],
        'targetNodeId': _0x54ce59,
        'taskId': _0x4b4200,
        'result': _0x1aafbd
      };
    }
    const _0x35f964 = await normalizeResult(_0x1aafbd, {
      'spec': _0x15161d,
      'context': _0x212d21
    });
    if (isContextCancelled(_0x212d21)) {
      throw createCancelledError();
    }
    const _0x489d1a = nowFrom(_0x2d4669) - _0x72d311;
    updateContextTaskNode(_0x212d21, {
      ...buildGenerationSuccessPatch({
        'startedAt': _0x72d311,
        'duration': _0x489d1a
      }),
      ..._0x35f964,
      ...buildGenerationProtocolTransitionPatch({
        'type': "terminal",
        'spec': _0x15161d,
        'status': 'success'
      })
    });
    deleteActiveTask(_0x54ce59, _0x212d21);
    notifyTaskChange(_0x212d21, {
      'status': "success",
      'recovering': ![]
    });
    _0x15161d["completionFeedback"] !== ![] && dispatchGenerationCompletionFeedback(_0x212d21, {
      'recovering': !![]
    });
    return {
      'ok': !![],
      'status': "success",
      'targetNodeId': _0x54ce59,
      'taskId': _0x4b4200,
      'result': _0x1aafbd
    };
  } catch (_0x2a28d7) {
    try {
      const _0x40430a = nowFrom(_0x2d4669) - _0x72d311;
      const _0x12bf3b = isAbortLike(_0x2a28d7);
      const _0x1e5269 = _0x212d21['getTaskNode']?.() || {};
      if (_0x12bf3b && (isCancelledStatus(_0x1e5269?.["jobStatus"]) || isCancelledStatus(_0x1e5269?.['rhTaskStatus']) || isCancelledStatus(_0x1e5269?.['asyncTaskStatus']))) {
        notifyTaskChange(_0x212d21, {
          'status': 'cancelled',
          'recovering': ![]
        });
        return {
          'ok': ![],
          'status': "cancelled",
          'targetNodeId': _0x54ce59,
          'taskId': _0x4b4200,
          'error': _0x2a28d7
        };
      }
      if (_0x12bf3b && shouldPauseOnAbort(_0x15161d, _0x212d21)) {
        const _0x33ec53 = await buildOptionalTaskPatch(_0x15161d["pauseBuilder"], [_0x212d21]);
        updateContextTaskNode(_0x212d21, {
          ...buildGenerationProtocolTransitionPatch({
            'type': "pending",
            'spec': _0x15161d,
            'context': _0x212d21
          }),
          ..._0x33ec53
        }, {
          'allowMissing': !![]
        });
        notifyTaskChange(_0x212d21, {
          'status': "paused",
          'recovering': ![]
        });
        return {
          'ok': ![],
          'status': "paused",
          'targetNodeId': _0x54ce59,
          'taskId': _0x4b4200,
          'error': _0x2a28d7
        };
      }
      const _0x12915d = _0x12bf3b ? buildGenerationCancelledPatch({
        'startedAt': _0x72d311,
        'duration': _0x40430a
      }) : buildGenerationFailurePatch({
        'error': parseErrorMessage(_0x2a28d7, _0x15161d, t("coreUi.generationTask.resumeFailed")),
        'startedAt': _0x72d311,
        'duration': _0x40430a
      });
      const _0x44e755 = await buildOptionalTaskPatch(_0x382ed7 ? _0x12bf3b ? _0x15161d['cancelledBuilder'] : _0x15161d["failureBuilder"] : null, _0x12bf3b ? [_0x212d21] : [_0x2a28d7, _0x212d21]);
      updateContextTaskNode(_0x212d21, {
        ..._0x12915d,
        ..._0x44e755,
        ...buildGenerationProtocolTransitionPatch({
          'type': 'terminal',
          'spec': _0x15161d,
          'status': _0x12bf3b ? "cancelled" : "failed"
        })
      });
      notifyTaskChange(_0x212d21, {
        'status': _0x12bf3b ? "cancelled" : "failed",
        'recovering': ![]
      });
      return {
        'ok': ![],
        'status': _0x12bf3b ? "cancelled" : "failed",
        'targetNodeId': _0x54ce59,
        'taskId': _0x4b4200,
        'error': _0x2a28d7
      };
    } finally {
      deleteActiveTask(_0x54ce59, _0x212d21);
    }
  } finally {
    const _0x424478 = _0x382ed7?.();
    if (_0x424478?.['then']) {
      await _0x424478;
    }
  }
}
export function getActiveGenerationTask(_0x152f09) {
  const _0x501d52 = String(_0x152f09 || '')["trim"]();
  const _0x974d57 = Array["from"](activeTasks["values"]())["filter"](_0x266951 => _0x266951?.["targetNodeId"] === _0x501d52);
  return _0x974d57["find"](_0x555bf6 => isContextInFlight(_0x555bf6) && _0x555bf6["background"] !== !![]) || _0x974d57["find"](_0x455613 => isContextInFlight(_0x455613)) || _0x974d57[0x0] || null;
}
export function __resetGenerationTaskRuntimeForTest() {
  activeTasks["forEach"](_0x2d9711 => _0x2d9711?.["resolveSettled"]?.());
  activeTasks['clear']();
  activeTaskSequence = 0x0;
  __resetRunningHubWorkflowQueueForTest();
}