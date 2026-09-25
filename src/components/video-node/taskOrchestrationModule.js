import { normalizeRunningHubInstanceType } from '../../modules/runningHubInstanceTypes.js';
import { APIMART_DREAMINA_VIDEO_DEFAULT_MODEL, ensureDreaminaStyleVideoModelForTask, getDreaminaStyleVideoDefaultModel, getDreaminaStyleVideoModelVersion, isDreaminaStyleVideoModel, isDreaminaVideoRouteModeEnabled, normalizeDreaminaStyleVideoDuration, normalizeDreaminaVideoAspectRatio, normalizeDreaminaStyleVideoModel, normalizeDreaminaStyleVideoResolution, normalizeDreaminaVideoRouteMode, resolveDreaminaStyleVideoProvider, resolveDreaminaVideoTaskType, validateDreaminaVideoRouteSelection } from '../../modules/dreaminaVideoModelHelper.js';
import { getPromptAssetInputRefsFromNode, createPromptMediaReferenceState, insertPresetPromptIntoEditor, isRunningHubWorkflowNode, previewPresetPromptInEditor, resolvePresetPromptTextWithTextRefs, shouldUsePromptPreviewForPreset } from '../../modules/nodePromptShared.js';
import { isPreviewModeEnabled, isPreviewNodeLoading, startPreviewNodeLoading } from '../../modules/previewMode.js';
import { evaluateGenerationPromptBoundary } from '../../modules/generationPromptPolicy.js';
import { createPreviewGenerateButtonCallbacks, resetGenerateButtonIdleUi, setGenerateButtonCancellableUi, setGenerateButtonLoadingUi } from '../../modules/previewGenerateButtonUi.js';
import { resolveGenerationInputImageUrl } from '../../services/imageReferenceUrlService.js';
import { logDiagnosticEvent } from '../../services/diagnosticsService.js';
import { createPayloadObjectUrlLease, releasePayloadObjectUrlLease } from '../../services/payloadObjectUrlLease.js';
import { buildGenerationStartPatch } from '../../core/generationTaskLifecycle.js';
import { cancelTask, getActiveGenerationTask, resumeTask, submitTask } from '../../core/generationTaskRuntime.js';
import { createGenerationCancelPlanFromNode, createGenerationResumePlanFromNode, createGenerationSubmitPlan } from '../../core/generationExecutionPlan.js';
import { getGenerationErrorMessage, isGenerationAbortError } from '../../core/generationTaskErrorState.js';
import { showRunningHubMediaUploadGuideForError } from '../../modules/runningHubMediaUploadGuide.js';
import { showProviderApiKeyMissingToast, showProviderApiKeyMissingToastForError } from '../../modules/providerApiKeyMissingToast.js';
import { guardModelGenerationCredentials } from '../../modules/modelCredentialUi.js';
import { buildAsyncTaskPatch, buildDreaminaTaskPatch, buildRunningHubTaskPatch } from '../../core/generationTaskProtocolState.js';
import { shouldAllowCancel, shouldShowGenerationBusyUi } from '../../core/generationTaskUiState.js';
import { createGenerationTaskRecoveryOwner } from '../../core/generationTaskRecoveryOwner.js';
import { GENERATION_HISTORY_EVENT } from '../../modules/generationHistoryAssets.js';
import { GENERATION_TASK_CENTER_EVENT } from '../../modules/generationTaskCenterEvents.js';
import { localPathToUrl, normalizeLocalPath } from '../../utils/localMediaPath.js';
import { resolveVideoWorkflowSchemaParam } from './runningHubVideoUiSchema.js';
import { buildVideoGenerationFailurePatch, buildVideoGenerationResultPatch, normalizeVideoGenerationResult } from './videoGenerationResultRenderer.js';
import { buildRunningHubVideoWorkflowSubmitPatch, getDefaultRunningHubVideoWorkflowModelId, shouldScopeRunningHubVideoSubmitEdges } from './runningHubVideoSubmitPayload.js';
import { isModelApiModel, resolveModelExecution, resolveModelProvider } from '../../manifests/index.js';
import { buildRhAiAppResultDisplayPatch } from '../shared/rhAiAppNodeBehavior.js';
import { getVideoSourceKey, resolveEffectiveInputKind } from '../../modules/modelInputPolicy.js';
import { validateModelMediaInputLimits } from '../../modules/modelMediaInputLimits.js';
import { t } from '../../i18n/index.js';
import { getRunningHubTaskProviderProfileId, normalizeRunningHubModelApiProfileId } from '../../modules/runningHubProviderProfiles.js';
import { resolveModelGenerationProviderProfileId } from '../../modules/modelProviderProfileSelection.js';
import { buildSubmitRandomizedSeedPatch, compileModelApiVideoSubmit, validateModelApiVideoPrompt } from './modelApiVideoSubmitCompiler.js';
import { resolveVideoSubmitInputMaterials } from './videoSubmitInputMaterials.js';
import { applySegmentRetakeSubmitParameterPolicy, applySegmentRetakeTaskPayload, clearSegmentRetakeSessionOnSuccess, createSegmentRetakeGenerationLifecycle } from '../../modules/videoRetake/segmentRetakeGenerationLifecycle.js';
import { applyVideoNodeAdaptiveAspectRatio } from './videoNodeAdaptiveAspectRatio.js';
import { getRhAiAppVideoResultMediaKey, hasObviouslyInvalidAsyncVideoResult, isRhAiAppVideoNodeData } from './videoResultNodeData.js';
const DREAMINA_UPLOAD_DURATION_ERROR_TOAST_MS = 0x2328;
function videoTaskText(_0x2f788d, _0x3ddc8b = {}) {
  return t("videoTask." + _0x2f788d, _0x3ddc8b);
}
function getModelMediaInputLimitMessage(_0x466829 = {}) {
  const _0x43d309 = String(_0x466829?.["code"] || '')["trim"]();
  if (!_0x43d309) {
    return '';
  }
  return videoTaskText("validation.mediaInputLimits." + _0x43d309, {
    'max': _0x466829['max'],
    'actual': _0x466829["actual"]
  });
}
function getVideoGenerateTitle() {
  return videoTaskText("controls.generateTitle");
}
function getVideoCancelTooltip() {
  return videoTaskText('controls.cancelTooltip');
}
const DREAMINA_STALE_ACTIVE_RESUME_MS = 0xf * 0x3e8;
const DREAMINA_COLD_RECOVERY_STALE_AFTER_MS = 0x18 * 0x3c * 0x3c * 0x3e8;
const CANCELLED_TASK_STATUSES = new Set(["cancelled", 'canceled']);
const DREAMINA_NON_RECOVERABLE_STATUSES = new Set(["cancelled", 'canceled', "complete", "completed", "done", "error", "fail", "failed", "finish", "finished", "idle", "success", "succeeded"]);
const DREAMINA_NON_RECOVERABLE_PHASES = new Set(["cancelled", "canceled", "complete", "completed", "done", "error", 'fail', "failed", 'finish', "finished", "success", "succeeded"]);
const dreaminaBackgroundQueueToastKeys = new Set();
const LOCAL_ASYNC_TASK_TIMEOUT_MESSAGES = new Set(["任务处理超时，请稍后查询结果", "Task processing timed out. Please query the result later."]);
function normalizeTaskStatus(_0x3d3db4) {
  return String(_0x3d3db4 || '')["trim"]()["toLowerCase"]();
}
function isRecoverableInterruptedDreaminaStyleTask(_0xb7052c = {}) {
  const _0x15e36b = String(_0xb7052c?.["model"] || '')['trim']();
  const _0x1bd3a2 = String(_0xb7052c?.['provider'] || '')['trim']();
  const _0x403f15 = resolveModelExecution(_0x15e36b, {
    'providerHint': _0x1bd3a2
  }) || resolveModelExecution(_0x15e36b);
  if (_0x403f15?.["modelManifest"]?.["extensions"]?.["dreaminaStyleVideo"] == null || _0x403f15?.["modelManifest"]?.["cancellable"] !== ![]) {
    return ![];
  }
  return [_0xb7052c?.["jobStatus"], _0xb7052c?.['dreaminaTaskPhase'], _0xb7052c?.["dreaminaTaskStatus"]]['map'](normalizeTaskStatus)["every"](_0x17ff36 => CANCELLED_TASK_STATUSES["has"](_0x17ff36));
}
function isRecoverableCustomProviderLocalTimeout(_0x58f7c9 = {}) {
  const _0x3a47df = String(_0x58f7c9?.['asyncTaskProvider'] || _0x58f7c9?.['provider'] || '')["trim"]();
  if (!/^custom_[a-z0-9_-]+$/i["test"](_0x3a47df)) {
    return ![];
  }
  const _0x5611b4 = Array["isArray"](_0x58f7c9?.["videos"]) ? _0x58f7c9["videos"]["map"](_0x4dea51 => String(_0x4dea51?.["error"] || '')['trim']()) : [];
  return [String(_0x58f7c9?.['jobError'] || '')["trim"](), ..._0x5611b4]["some"](_0x22040e => LOCAL_ASYNC_TASK_TIMEOUT_MESSAGES["has"](_0x22040e));
}
function mapDreaminaSnapshotToTaskCenterStatus(_0x456c37 = {}) {
  const _0x130976 = String(_0x456c37?.["phase"] || '')["trim"]()['toLowerCase']();
  const _0x329ff1 = String(_0x456c37?.['status'] || '')["trim"]()["toLowerCase"]();
  if (_0x130976 === "done" || _0x329ff1 === "success") {
    return "complete";
  }
  if (_0x130976 === 'cancelled' || _0x329ff1 === "cancelled" || _0x329ff1 === "canceled") {
    return "cancelled";
  }
  if (_0x130976 === "failed" || _0x329ff1 === 'failed') {
    return "failed";
  }
  if (_0x130976 === 'queued' || _0x130976 === 'pending') {
    return 'waiting';
  }
  return "processing";
}
function buildDreaminaTaskCenterMessage(_0x16c61c = {}) {
  const _0x208388 = String(_0x16c61c?.["label"] || '')['trim']();
  const _0x242928 = Number(_0x16c61c?.["queueIndex"]);
  const _0x3996a3 = Number(_0x16c61c?.['queueLength']);
  if (Number['isFinite'](_0x242928) && _0x242928 >= 0x0 && Number['isFinite'](_0x3996a3) && _0x3996a3 > 0x0) {
    return (_0x208388 || videoTaskText('task.queueing')) + '\x20' + (Math["trunc"](_0x242928) + 0x1) + '/' + Math["trunc"](_0x3996a3);
  }
  return _0x208388 || '';
}
function isDreaminaUploadDurationErrorMessage(_0xf414fa) {
  const _0x9e8e2e = String(_0xf414fa || '')["trim"]();
  return _0x9e8e2e['startsWith']("上传源视频失败：") || _0x9e8e2e["startsWith"]("上传源音频失败：");
}
function getPlainObject(_0x4cea06) {
  return _0x4cea06 && typeof _0x4cea06 === "object" && !Array["isArray"](_0x4cea06) ? _0x4cea06 : {};
}
export function createVideoNodeTaskOrchestrationModule(_0x357fae) {
  const {
    store: _0x83e6cc,
    api: _0x4d33ed,
    getImage: _0x146aa6,
    startLoading: _0x11b621,
    stopLoading: _0x32c4ac,
    checkLocalMediaExists = async () => !![],
    ensureConfig: _0x20de72,
    getProviderConfig: _0x3104b9,
    isVideoVipModel: _0x4a9e7b,
    ensureVipSessionRecheck: _0xb5220a
  } = _0x357fae;
  const _0xb5294c = "DREAMINA_POLL_TIMEOUT";
  const _0x2a60ca = 0x14 * 0x3c * 0x3e8;
  const _0x51d57a = 0x14 * 0x3e8;
  const _0x352659 = 0x18 * 0x3c * 0x3c * 0x3e8;
  const _0x19e582 = () => typeof _0x83e6cc["getStateRaw"] === "function" ? _0x83e6cc["getStateRaw"]() : _0x83e6cc['getState']();
  const _0x40285a = (_0x1928d0, _0x1fa189) => _0x1928d0?.["getTaskNode"]?.() || _0x83e6cc["getState"]()["nodes"]?.[_0x1fa189] || {};
  const _0x50e78d = (_0x9b4401, _0xe99491, _0x5e8db7) => {
    if (typeof _0x9b4401?.["updateTaskNode"] === "function") {
      return _0x9b4401['updateTaskNode'](_0x5e8db7);
    }
    _0x83e6cc["updateNodeData"](_0xe99491, _0x5e8db7);
    return !![];
  };
  class _0x1c33e3 {
    ["_getGenerationTaskRecoveryOwner"]() {
      !this['_generationTaskRecoveryOwner'] && (this["_generationTaskRecoveryOwner"] = createGenerationTaskRecoveryOwner({
        'readTaskNode': () => _0x19e582()["nodes"]?.[this["nodeId"]] || this["_data"] || {},
        'updateTaskNode': _0x5415bc => _0x83e6cc["updateNodeData"](this['nodeId'], _0x5415bc),
        'persist': _0x290948 => {
          if (_0x290948 === "dreamina") {
            return this['_persistDreaminaResumeCache']();
          }
          if (_0x290948 === "asyncModelApi") {
            return this["_persistAsyncResumeCache"]();
          }
          return this['_persistRunningHubResumeCache']();
        }
      }), this["_generationTaskRecoveryOwner"]["bindLegacyState"](this));
      return this["_generationTaskRecoveryOwner"];
    }
    async ["_preflightConnectedLocalVideoInputs"](_0x49618e = null) {
      if (typeof checkLocalMediaExists !== 'function') {
        return !![];
      }
      const _0x3d221e = _0x19e582();
      const _0x257d01 = _0x3d221e?.["nodes"] || {};
      const _0x5df54b = typeof _0x83e6cc['getIncomingEdges'] === 'function' ? _0x83e6cc["getIncomingEdges"](this["nodeId"]) : [];
      const _0x2fd0d4 = new Set();
      const _0x240b8d = async _0x5a63d3 => {
        if (_0x2fd0d4["has"](_0x5a63d3)) {
          return !![];
        }
        _0x2fd0d4['add'](_0x5a63d3);
        try {
          return (await checkLocalMediaExists(_0x5a63d3)) === !![];
        } catch {
          return ![];
        }
      };
      const _0x2d9d74 = _0x34b1b7 => {
        window['showToast']?.(videoTaskText("validation.localVideoMissing", {
          'path': _0x34b1b7
        }), 'error');
      };
      for (const _0x34a8a9 of _0x5df54b) {
        const _0x44aba6 = String(_0x34a8a9?.["sourceId"] || '')["trim"]();
        const _0x5dbf9f = _0x257d01[_0x44aba6];
        if (!_0x5dbf9f || resolveEffectiveInputKind(_0x5dbf9f, _0x34a8a9) !== "video") {
          continue;
        }
        let _0x2f8174 = _0x5dbf9f;
        let _0x506917 = -0x1;
        const _0x822e2d = Array["isArray"](_0x5dbf9f["videos"]) ? _0x5dbf9f["videos"] : [];
        if (String(_0x5dbf9f["type"] || '') === "ai-video" && _0x822e2d["length"] > 0x0) {
          const _0x1b1426 = String(_0x34a8a9?.["sourceMediaKey"] || '')["trim"]();
          _0x1b1426 && (_0x506917 = _0x822e2d['findIndex'](_0x2e150f => getVideoSourceKey(_0x2e150f) === _0x1b1426));
          if (_0x506917 < 0x0) {
            const _0x2e3173 = Number(_0x5dbf9f["mainVideoIndex"]);
            _0x506917 = Number["isFinite"](_0x2e3173) ? Math["max"](0x0, Math["min"](_0x822e2d["length"] - 0x1, Math["trunc"](_0x2e3173))) : 0x0;
          }
          _0x2f8174 = _0x822e2d[_0x506917] || _0x5dbf9f;
        }
        const _0x532e93 = getVideoSourceKey(_0x2f8174) || getVideoSourceKey(_0x5dbf9f);
        const _0x1e3008 = normalizeLocalPath(_0x532e93);
        if (!_0x1e3008) {
          continue;
        }
        if (await _0x240b8d(_0x1e3008)) {
          continue;
        }
        const _0x153ae5 = _0x19e582()?.["nodes"]?.[_0x44aba6] || _0x5dbf9f;
        if (_0x506917 >= 0x0 && Array["isArray"](_0x153ae5["videos"])) {
          const _0x51bf42 = _0x153ae5["videos"]["map"]((_0x174641, _0x126c5e) => _0x126c5e === _0x506917 ? {
            ..._0x174641,
            'mediaUnavailable': !![],
            'mediaUnavailableSource': _0x532e93
          } : _0x174641);
          _0x83e6cc["updateNodeData"](_0x44aba6, {
            'videos': _0x51bf42
          });
        } else {
          _0x83e6cc["updateNodeData"](_0x44aba6, {
            'mediaUnavailable': !![],
            'mediaUnavailableSource': _0x532e93
          });
        }
        _0x2d9d74(_0x1e3008);
        return ![];
      }
      const _0x2bf439 = [...(Array['isArray'](_0x49618e?.["videos"]) ? _0x49618e['videos'] : []), _0x49618e?.['video'], _0x49618e?.['videoUrl'], _0x49618e?.["sourceVideo"]];
      for (const _0x43b877 of _0x2bf439) {
        const _0x4a4701 = normalizeLocalPath(_0x43b877);
        if (!_0x4a4701 || (await _0x240b8d(_0x4a4701))) {
          continue;
        }
        _0x2d9d74(_0x4a4701);
        return ![];
      }
      return !![];
    }
    ['_isDreaminaPollTimeoutError'](_0x939644) {
      const _0x207d38 = String(_0x939644?.['code'] || '')["trim"]()["toUpperCase"]();
      if (_0x207d38 === _0xb5294c || _0x207d38 === 'TIMEOUT') {
        return !![];
      }
      const _0x7842ea = String(_0x939644?.["type"] || '')["trim"]()["toUpperCase"]();
      if (_0x7842ea === "TIMEOUT" || _0x7842ea === "TASK_TIMEOUT") {
        return !![];
      }
      const _0x100aa6 = String(_0x939644?.["message"] || '')["trim"]()["toLowerCase"]();
      return _0x100aa6["includes"]('timeout') || _0x100aa6['includes']('超时');
    }
    ['_buildDreaminaBackgroundPendingSnapshot'](_0x174561 = '') {
      return this["_buildDreaminaPendingSnapshot"]({
        'submitId': _0x174561,
        'phase': "generating",
        'label': videoTaskText("task.backgroundQueueing")
      });
    }
    ["_showDreaminaBackgroundQueueingToast"](_0x22df58 = '') {
      const _0x46c01e = String(_0x22df58 || '')["trim"]() || String(_0x83e6cc['getState']()["nodes"]?.[this["nodeId"]]?.["dreaminaSubmitId"] || '')["trim"]() || String(this["nodeId"] || '')["trim"]();
      if (_0x46c01e && dreaminaBackgroundQueueToastKeys["has"](_0x46c01e)) {
        return;
      }
      if (_0x46c01e) {
        dreaminaBackgroundQueueToastKeys["add"](_0x46c01e);
      }
      window["showToast"]?.(videoTaskText("toasts.dreaminaBackgroundQueueing"), 'warning');
    }
    ['_hasResolvedVideoResult'](_0x5c6a1d = this["_data"]) {
      const _0x15bf50 = Array["isArray"](_0x5c6a1d?.["videos"]) ? _0x5c6a1d['videos'] : [];
      if (_0x15bf50['length'] > 0x0) {
        return !![];
      }
      return !!String(_0x5c6a1d?.["videoUrl"] || '')['trim']() || !!String(_0x5c6a1d?.["localPath"] || '')["trim"]();
    }
    ["_persistDreaminaResumeCache"]() {
      try {
        window["_triggerLocalCacheSave"]?.();
      } catch {}
    }
    ['_persistRunningHubResumeCache']() {
      try {
        window["_triggerLocalCacheSave"]?.();
      } catch {}
    }
    ["_persistAsyncResumeCache"]() {
      this["_persistRunningHubResumeCache"]();
    }
    ["_resolveDreaminaResumeSubmitId"](_0x1840f5 = {}) {
      const _0x20ce67 = _0x1840f5?.["dreaminaTaskLastRaw"] && typeof _0x1840f5["dreaminaTaskLastRaw"] === 'object' && !Array['isArray'](_0x1840f5["dreaminaTaskLastRaw"]) ? _0x1840f5["dreaminaTaskLastRaw"] : {};
      const _0x489035 = String(_0x20ce67['remoteSubmitId'] || _0x20ce67["remote_submit_id"] || '')["trim"]();
      if (_0x489035) {
        return _0x489035;
      }
      return String(_0x1840f5?.["dreaminaSubmitId"] || '')["trim"]();
    }
    ["_isDreaminaRecoverableRunningTask"](_0x5ed4ac = this["_data"]) {
      if (!this["_isDreaminaVideoNode"](_0x5ed4ac)) {
        return ![];
      }
      const _0x517f8d = String(_0x5ed4ac?.["dreaminaSubmitId"] || '')["trim"]();
      if (!_0x517f8d) {
        return ![];
      }
      const _0x14ea83 = normalizeTaskStatus(_0x5ed4ac?.['jobStatus']);
      const _0x44d3c7 = normalizeTaskStatus(_0x5ed4ac?.["dreaminaTaskPhase"]);
      const _0x1f30b3 = normalizeTaskStatus(_0x5ed4ac?.["dreaminaTaskStatus"]);
      if (!isRecoverableInterruptedDreaminaStyleTask(_0x5ed4ac)) {
        if (DREAMINA_NON_RECOVERABLE_STATUSES["has"](_0x14ea83)) {
          return ![];
        }
        if (DREAMINA_NON_RECOVERABLE_PHASES["has"](_0x44d3c7)) {
          return ![];
        }
        if (DREAMINA_NON_RECOVERABLE_STATUSES['has'](_0x1f30b3)) {
          return ![];
        }
      }
      return !![];
    }
    ['_isStaleActiveDreaminaTask'](_0x1f6bc7 = this["_data"]) {
      if (!this['_isGenerating']) {
        return ![];
      }
      if (_0x1f6bc7?.['dreaminaTaskRecovering'] === !![]) {
        return ![];
      }
      if (this["_dreaminaResumePromise"]) {
        return ![];
      }
      const _0x3bf2a6 = Number(_0x1f6bc7?.['dreaminaTaskLastCheckedAt'] || _0x1f6bc7?.["dreaminaTaskStartedAt"] || _0x1f6bc7?.['generationStartTime'] || 0x0);
      if (!Number['isFinite'](_0x3bf2a6) || _0x3bf2a6 <= 0x0) {
        return ![];
      }
      return Date["now"]() - _0x3bf2a6 >= DREAMINA_STALE_ACTIVE_RESUME_MS;
    }
    ["_shouldProbeStaleDreaminaRecovery"](_0x1dd73b = this["_data"]) {
      if (!this['_isDreaminaRecoverableRunningTask'](_0x1dd73b)) {
        return ![];
      }
      if (getActiveGenerationTask(this["nodeId"])) {
        return ![];
      }
      const _0x262de1 = Number(_0x1dd73b?.["dreaminaTaskLastCheckedAt"] || _0x1dd73b?.['dreaminaTaskStartedAt'] || _0x1dd73b?.["generationStartTime"] || 0x0);
      if (!Number["isFinite"](_0x262de1) || _0x262de1 <= 0x0) {
        return ![];
      }
      return Date["now"]() - _0x262de1 >= DREAMINA_COLD_RECOVERY_STALE_AFTER_MS;
    }
    ["_isUncertainStaleDreaminaRecoveryError"](_0x5489e1) {
      const _0x47f31a = _0x5489e1?.["dreaminaSnapshot"];
      const _0xcdf3c2 = normalizeTaskStatus(_0x47f31a?.['phase']);
      const _0x2da0a3 = normalizeTaskStatus(_0x47f31a?.["status"]);
      return _0xcdf3c2 !== "failed" && _0x2da0a3 !== "failed";
    }
    ['_shouldKeepDreaminaLoading'](_0x4d8115 = _0x83e6cc['getState']()["nodes"]?.[this['nodeId']] || this["_data"] || {}) {
      if (!this["_isDreaminaVideoNode"](_0x4d8115)) {
        return ![];
      }
      const _0x5da99c = normalizeTaskStatus(_0x4d8115?.["jobStatus"]);
      const _0x4ba895 = normalizeTaskStatus(_0x4d8115?.["dreaminaTaskPhase"]);
      const _0x5b046b = normalizeTaskStatus(_0x4d8115?.["dreaminaTaskStatus"]);
      if (!isRecoverableInterruptedDreaminaStyleTask(_0x4d8115)) {
        if (DREAMINA_NON_RECOVERABLE_STATUSES['has'](_0x5da99c)) {
          return ![];
        }
        if (DREAMINA_NON_RECOVERABLE_PHASES["has"](_0x4ba895)) {
          return ![];
        }
        if (DREAMINA_NON_RECOVERABLE_STATUSES["has"](_0x5b046b)) {
          return ![];
        }
      }
      if (_0x4d8115?.['isGenerating'] === !![]) {
        return !![];
      }
      if (String(_0x4d8115?.['jobStatus'] || '')["trim"]()["toLowerCase"]() === 'running') {
        return !![];
      }
      if (_0x4d8115?.["dreaminaTaskRecovering"] === !![]) {
        return !![];
      }
      if (this["_dreaminaResumePromise"]) {
        return !![];
      }
      return this["_isDreaminaRecoverableRunningTask"](_0x4d8115);
    }
    ["_inferAsyncProviderFromModel"](_0x45af21, _0x1fe953 = '') {
      const _0x4e7b87 = resolveModelProvider(_0x45af21, '', {
        'allowProviderHint': ![]
      });
      if (_0x4e7b87) {
        return _0x4e7b87;
      }
      const _0x41c593 = String(_0x1fe953 || '')["trim"]()["toLowerCase"]();
      if (_0x41c593) {
        return _0x41c593;
      }
      const _0x22acc0 = String(_0x45af21 || '')['trim']();
      if (_0x22acc0 && !_0x22acc0["includes"]('/')) {
        return "grsai";
      }
      return '';
    }
    ["_isRunningHubRecoverableRunningTask"](_0xcd52bd = this["_data"]) {
      if (!this['_isRunninghubWorkflowModel'](_0xcd52bd?.["model"], _0xcd52bd?.["provider"])) {
        return ![];
      }
      const _0x3e45e5 = String(_0xcd52bd?.['rhTaskId'] || '')["trim"]();
      if (!_0x3e45e5) {
        return ![];
      }
      const _0x356c72 = String(_0xcd52bd?.['rhTaskStatus'] || '')["trim"]()["toLowerCase"]();
      if (_0x356c72 === "success" || _0x356c72 === "failed" || _0x356c72 === "idle" || _0x356c72 === "cancelled") {
        return ![];
      }
      return !![];
    }
    ["_isAsyncRecoverableRunningTask"](_0x231914 = this['_data']) {
      const _0x341444 = String(_0x231914?.["asyncTaskId"] || '')['trim']();
      if (!_0x341444) {
        return ![];
      }
      const _0x39313a = this["_inferAsyncProviderFromModel"](_0x231914?.["model"], _0x231914?.['asyncTaskProvider'] || _0x231914?.["provider"] || '');
      if (!_0x39313a || _0x39313a === "runninghubwf" || _0x39313a === "runninghub" || _0x39313a === "dreamina") {
        return ![];
      }
      const _0x4dbd2f = String(_0x231914?.["asyncTaskKind"] || '')["trim"]()["toLowerCase"]();
      if (_0x4dbd2f && _0x4dbd2f !== "video") {
        return ![];
      }
      const _0x3fe613 = String(_0x231914?.["asyncTaskStatus"] || '')["trim"]()["toLowerCase"]();
      const _0x5e1949 = _0x3fe613 === 'failed' && isRecoverableCustomProviderLocalTimeout(_0x231914);
      if (_0x3fe613 === "success" && !hasObviouslyInvalidAsyncVideoResult(_0x231914) || _0x3fe613 === 'failed' && !_0x5e1949 || _0x3fe613 === "idle" || _0x3fe613 === "cancelled") {
        return ![];
      }
      return !![];
    }
    ["_buildRunningHubTaskPatch"]({
      taskId = '',
      status = "pending",
      startedAt = 0x0,
      recovering = ![],
      useOpenapiQuery = ![]
    } = {}) {
      return buildRunningHubTaskPatch({
        'taskId': taskId,
        'status': status,
        'startedAt': startedAt,
        'recovering': recovering,
        'useOpenapiQuery': useOpenapiQuery
      });
    }
    ["_buildAsyncTaskPatch"]({
      provider = '',
      kind = "video",
      taskId = '',
      status = 'pending',
      startedAt = 0x0,
      recovering = ![]
    } = {}) {
      return buildAsyncTaskPatch({
        'provider': provider,
        'kind': kind,
        'taskId': taskId,
        'status': status,
        'startedAt': startedAt,
        'recovering': recovering
      });
    }
    async ["_buildResumePayload"](_0x2308ad = this["_data"], _0x3b2491 = {}) {
      const _0x3ff9b3 = _0x2308ad || {};
      const _0x2b3731 = String(_0x3ff9b3?.["model"] || '')["trim"]();
      const _0x1aa8c7 = this["_inferAsyncProviderFromModel"](_0x2b3731, _0x3b2491?.['providerHint'] || _0x3ff9b3?.['asyncTaskProvider'] || _0x3ff9b3?.['provider'] || '');
      if (!_0x2b3731 || !_0x1aa8c7) {
        throw new Error(videoTaskText("errors.missingAsyncResumeModelOrProvider"));
      }
      const _0x22dfd9 = getRunningHubTaskProviderProfileId(_0x3ff9b3);
      const _0x1a1ca9 = resolveModelGenerationProviderProfileId(_0x2b3731, _0x1aa8c7, _0x22dfd9);
      await _0x20de72();
      const _0x5b0cb0 = _0x3104b9(_0x1a1ca9 || _0x1aa8c7) || {};
      const _0x30d025 = String(_0x1aa8c7 === 'runninghub' ? _0x5b0cb0["modelApiKey"] || _0x5b0cb0["apiKey"] || '' : _0x5b0cb0["apiKey"] || window["_appApiKey"] || '')["trim"]();
      return {
        'nodeId': this["nodeId"],
        'model': _0x2b3731,
        'provider': _0x1aa8c7,
        ...(_0x1a1ca9 ? {
          'providerProfileId': _0x1a1ca9,
          'rhProviderProfileId': _0x1a1ca9
        } : {}),
        'apiKey': _0x30d025
      };
    }
    ['_syncLocalTaskNodeData']() {
      const _0x17adc6 = _0x83e6cc['getState']()["nodes"]?.[this["nodeId"]];
      if (_0x17adc6) {
        this["_data"] = _0x17adc6;
      }
      return this["_data"] || {};
    }
    ["_emitDreaminaTaskCenterUpdate"](_0x262765 = {}, _0x45c682 = {}) {
      const _0x16ac1e = String(_0x262765?.["submitId"] || _0x45c682['taskId'] || _0x83e6cc['getState']()["nodes"]?.[this["nodeId"]]?.["dreaminaSubmitId"] || '')["trim"]();
      const _0x3adf85 = globalThis["window"];
      if (!_0x16ac1e || typeof _0x3adf85?.["dispatchEvent"] !== "function") {
        return;
      }
      const _0x23011b = String(_0x45c682["status"] || mapDreaminaSnapshotToTaskCenterStatus(_0x262765))["trim"]();
      const _0x1866f3 = _0x23011b === "complete" || _0x23011b === 'failed' || _0x23011b === 'cancelled';
      _0x3adf85["dispatchEvent"](new CustomEvent(GENERATION_TASK_CENTER_EVENT, {
        'detail': {
          'taskId': _0x16ac1e,
          'nodeId': this["nodeId"],
          'kind': "dreaminaVideo",
          'status': _0x23011b,
          'progress': _0x23011b === 'complete' ? 0x1 : _0x23011b === 'waiting' ? 0x0 : 0.45,
          'message': String(_0x45c682["message"] || buildDreaminaTaskCenterMessage(_0x262765))['trim'](),
          'error': _0x23011b === "failed" ? String(_0x45c682["error"] || _0x262765?.["failReason"] || _0x262765?.["label"] || '')["trim"]() : '',
          'result': _0x45c682['result'] && typeof _0x45c682["result"] === "object" ? _0x45c682["result"] : null,
          'cancellable': !![],
          'createdAt': Number(_0x45c682['createdAt'] || _0x83e6cc["getState"]()['nodes']?.[this["nodeId"]]?.["dreaminaTaskStartedAt"] || Date["now"]()),
          'startedAt': Number(_0x45c682["startedAt"] || _0x83e6cc["getState"]()["nodes"]?.[this["nodeId"]]?.["dreaminaTaskStartedAt"] || 0x0),
          'finishedAt': _0x1866f3 ? Date['now']() : 0x0
        }
      }));
    }
    ["_buildDreaminaTaskPatch"](_0x2bd4a7, _0xc7b1a8 = {}) {
      const _0x5ee13d = buildDreaminaTaskPatch({
        'submitId': _0x2bd4a7?.["submitId"] || '',
        'status': _0x2bd4a7?.["status"] || "pending",
        'phase': _0x2bd4a7?.["phase"] || "generating",
        'label': _0x2bd4a7?.["label"] || '',
        'lastCheckedAt': _0x2bd4a7?.['lastCheckedAt'] || Date["now"](),
        'recovering': _0xc7b1a8["recovering"] === !![],
        'raw': _0x2bd4a7?.["raw"] || {},
        'defaultLabel': videoTaskText("task.generating")
      });
      _0xc7b1a8["startedAt"] != null && (_0x5ee13d["dreaminaTaskStartedAt"] = Number(_0xc7b1a8["startedAt"] || 0x0));
      return _0x5ee13d;
    }
    ["_applyDreaminaTaskSnapshot"](_0x12adbe, _0x16c5e2 = {}) {
      const _0x2c27f7 = _0x83e6cc['getState']()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      const _0x4a4dcc = this['_buildDreaminaTaskPatch'](_0x12adbe, {
        'recovering': _0x16c5e2["recovering"] === !![],
        'startedAt': _0x16c5e2["startedAt"] != null ? _0x16c5e2['startedAt'] : _0x2c27f7?.['dreaminaTaskStartedAt']
      });
      _0x83e6cc['updateNodeData'](this["nodeId"], _0x4a4dcc);
      this['_syncLocalTaskNodeData']();
      this["_persistDreaminaResumeCache"]();
      this["_emitDreaminaTaskCenterUpdate"](_0x12adbe, {
        'startedAt': _0x4a4dcc['dreaminaTaskStartedAt']
      });
      return _0x4a4dcc;
    }
    ['_stopDreaminaRecovery'](_0x39f0e4 = ![]) {
      this["_getGenerationTaskRecoveryOwner"]()["stop"]("dreamina", {
        'resetRecovering': _0x39f0e4
      });
      this['_dreaminaActiveSubmitId'] = '';
    }
    ["_stopRunningHubRecovery"](_0x53a190 = ![]) {
      this["_getGenerationTaskRecoveryOwner"]()["stop"]("workflow", {
        'resetRecovering': _0x53a190
      });
    }
    ["_stopAsyncRecovery"](_0x3c7154 = ![]) {
      this["_getGenerationTaskRecoveryOwner"]()['stop']("asyncModelApi", {
        'resetRecovering': _0x3c7154
      });
    }
    ['_buildDreaminaPendingSnapshot']({
      submitId = '',
      phase = "generating",
      label = videoTaskText("task.generating"),
      raw = {}
    } = {}) {
      return {
        'submitId': String(submitId || '')["trim"](),
        'status': 'pending',
        'phase': phase,
        'label': label,
        'queueStatus': '',
        'queueIndex': null,
        'queueLength': null,
        'outputs': [],
        'failReason': '',
        'raw': raw && typeof raw === "object" && !Array["isArray"](raw) ? raw : {},
        'isTerminal': ![],
        'hasOutputs': ![],
        'lastCheckedAt': Date["now"]()
      };
    }
    ['_buildDreaminaFailedSnapshot'](_0x52622b, _0x51c8c9, _0x3111c8 = {}) {
      return {
        'submitId': String(_0x52622b || '')["trim"](),
        'status': "failed",
        'phase': 'failed',
        'label': String(_0x51c8c9 || '')["trim"]() || videoTaskText("task.queryFailed"),
        'queueStatus': '',
        'queueIndex': null,
        'queueLength': null,
        'outputs': [],
        'failReason': String(_0x51c8c9 || '')["trim"](),
        'raw': _0x3111c8 && typeof _0x3111c8 === "object" && !Array["isArray"](_0x3111c8) ? _0x3111c8 : {},
        'isTerminal': !![],
        'hasOutputs': ![],
        'lastCheckedAt': Date['now']()
      };
    }
    ["_applyDreaminaSuccessResult"](_0x183d47, _0x5f06ff, _0x6091ea = null, {
      writeStore = !![],
      returnPatch = ![]
    } = {}) {
      const _0x1388b9 = normalizeVideoGenerationResult(_0x183d47);
      const _0x22402b = _0x1388b9['items'];
      const _0x44a810 = this["_isDreaminaVideoNode"](_0x83e6cc['getState']()["nodes"]?.[this["nodeId"]] || this['_data'] || {});
      const _0x223cdb = String(_0x6091ea?.["submitId"] || '')["trim"]() || String(_0x83e6cc["getState"]()["nodes"]?.[this['nodeId']]?.["dreaminaSubmitId"] || '')["trim"]();
      const _0x2a7ca3 = _0x44a810 ? _0x6091ea ? this['_buildDreaminaTaskPatch'](_0x6091ea, {
        'recovering': ![],
        'startedAt': _0x5f06ff
      }) : {
        'isGenerating': ![],
        'jobStatus': "success",
        'dreaminaSubmitId': _0x223cdb,
        'dreaminaTaskStatus': 'success',
        'dreaminaTaskPhase': "done",
        'dreaminaTaskLabel': videoTaskText("task.completed"),
        'dreaminaTaskStartedAt': _0x5f06ff,
        'dreaminaTaskLastCheckedAt': Date["now"](),
        'dreaminaTaskLastRaw': {},
        'dreaminaTaskRecovering': ![]
      } : {};
      const _0x42cbfa = buildVideoGenerationResultPatch(_0x1388b9, {
        'startedAt': _0x5f06ff
      });
      clearSegmentRetakeSessionOnSuccess(_0x83e6cc["getState"]()["nodes"]?.[this["nodeId"]] || this["_data"], _0x42cbfa);
      const _0x4cd885 = _0x42cbfa ? {
        ..._0x42cbfa,
        ..._0x2a7ca3
      } : null;
      _0x42cbfa && (writeStore && (_0x83e6cc["updateNodeData"](this["nodeId"], _0x4cd885), this["_persistDreaminaResumeCache"]()), _0x44a810 && this["_emitDreaminaTaskCenterUpdate"](_0x6091ea || {
        'submitId': _0x223cdb,
        'status': "success",
        'phase': "done",
        'label': videoTaskText('task.completed')
      }, {
        'status': "complete",
        'startedAt': _0x5f06ff,
        'result': _0x22402b[0x0] || _0x1388b9
      }));
      if (returnPatch) {
        return {
          'videos': _0x22402b,
          'patch': _0x4cd885 || {},
          'normalizedResult': _0x1388b9
        };
      }
      return _0x22402b;
    }
    ["_scheduleDreaminaResultEnrichment"](_0x44cf56) {
      if (!(Array["isArray"](_0x44cf56) && _0x44cf56['length'] > 0x0)) {
        return;
      }
      {
        const _0x1a41cb = this['nodeId'];
        const _0x3088f6 = ++this["_resultThumbToken"];
        (async () => {
          for (let _0x4f4027 = 0x0; _0x4f4027 < _0x44cf56["length"]; _0x4f4027++) {
            if (_0x3088f6 !== this["_resultThumbToken"]) {
              return;
            }
            const _0x28d85b = _0x83e6cc['getState']()["nodes"]?.[_0x1a41cb];
            if (!_0x28d85b) {
              return;
            }
            const _0x2d2cb = Array['isArray'](_0x28d85b["videos"]) ? _0x28d85b["videos"] : [];
            const _0x49b4a0 = _0x2d2cb[_0x4f4027];
            if (!_0x49b4a0 || typeof _0x49b4a0 !== "object") {
              continue;
            }
            const _0x5851eb = !!String(_0x49b4a0["thumbUrl"] || '')['trim']();
            if (_0x5851eb) {
              const _0x3205e0 = Number(_0x28d85b["mainVideoIndex"]);
              const _0x49d88a = Number['isFinite'](_0x3205e0) ? Math["max"](0x0, Math["trunc"](_0x3205e0)) : 0x0;
              _0x4f4027 === _0x49d88a && !String(_0x28d85b['thumbUrl'] || '')["trim"]() && _0x83e6cc["updateNodeData"](_0x1a41cb, {
                'thumbUrl': String(_0x49b4a0["thumbUrl"])["trim"]()
              });
              continue;
            }
            const _0x34f254 = this["_resolveVideoMetaSrcFromVideoData"](_0x49b4a0);
            if (!_0x34f254) {
              continue;
            }
            if (!(_0x34f254["startsWith"]('/output/') || _0x34f254['startsWith']("/data/"))) {
              continue;
            }
            const _0x5527e1 = "gen|" + _0x1a41cb + '|' + _0x4f4027 + '|' + _0x34f254;
            if (this["_videoThumbPending"]["has"](_0x5527e1)) {
              continue;
            }
            this["_videoThumbPending"]["add"](_0x5527e1);
            let _0x4d918c = null;
            try {
              _0x4d918c = await _0x4d33ed["fetchVideoFirstFrameThumbFromServer"](_0x34f254, {
                'nodeId': _0x1a41cb,
                'assetId': String(_0x49b4a0['assetId'] || _0x49b4a0["thumbId"] || '')
              });
            } catch {
              _0x4d918c = null;
            } finally {
              this["_videoThumbPending"]["delete"](_0x5527e1);
            }
            if (_0x3088f6 !== this["_resultThumbToken"]) {
              return;
            }
            const _0x50be55 = String(_0x4d918c?.['thumbUrl'] || _0x4d918c?.["url"] || '')["trim"]();
            if (!_0x50be55) {
              continue;
            }
            const _0x5a39e9 = _0x83e6cc["getState"]()['nodes']?.[_0x1a41cb];
            if (!_0x5a39e9) {
              return;
            }
            const _0x3bf903 = Array['isArray'](_0x5a39e9["videos"]) ? _0x5a39e9["videos"] : [];
            const _0x4050f1 = _0x3bf903[_0x4f4027];
            if (!_0x4050f1 || typeof _0x4050f1 !== 'object') {
              continue;
            }
            const _0x14446c = {
              ..._0x4050f1
            };
            if (!String(_0x14446c['thumbUrl'] || '')["trim"]() && _0x50be55) {
              _0x14446c['thumbUrl'] = _0x50be55;
            }
            const _0x17eb24 = _0x3bf903['slice']();
            _0x17eb24[_0x4f4027] = _0x14446c;
            const _0x4a426e = {
              'videos': _0x17eb24
            };
            const _0x5ec0ac = Number(_0x5a39e9["mainVideoIndex"]);
            const _0xa78e47 = Number["isFinite"](_0x5ec0ac) ? Math['max'](0x0, Math['trunc'](_0x5ec0ac)) : 0x0;
            if (_0x4f4027 === _0xa78e47) {
              if (!String(_0x5a39e9['thumbUrl'] || '')["trim"]() && _0x50be55) {
                _0x4a426e["thumbUrl"] = _0x50be55;
              }
            }
            _0x83e6cc["updateNodeData"](_0x1a41cb, _0x4a426e);
          }
        })();
      }
      {
        const _0x3c34c2 = this["nodeId"];
        const _0x35d896 = ++this["_resultMetaEnrichmentToken"];
        (async () => {
          for (let _0xb78f0c = 0x0; _0xb78f0c < _0x44cf56["length"]; _0xb78f0c++) {
            if (_0x35d896 !== this["_resultMetaEnrichmentToken"]) {
              return;
            }
            const _0x398618 = _0x83e6cc['getState']()["nodes"]?.[_0x3c34c2];
            if (!_0x398618) {
              return;
            }
            const _0x1ac7c4 = Array['isArray'](_0x398618["videos"]) ? _0x398618["videos"] : [];
            const _0x372a96 = _0x1ac7c4[_0xb78f0c];
            if (!_0x372a96 || typeof _0x372a96 !== "object") {
              continue;
            }
            const _0x342d31 = Number(_0x372a96["videoWidth"] || 0x0);
            const _0x5b2b83 = Number(_0x372a96["videoHeight"] || 0x0);
            if (_0x342d31 > 0x0 && _0x5b2b83 > 0x0) {
              const _0x440200 = Number(_0x398618["mainVideoIndex"]);
              const _0xc36384 = Number["isFinite"](_0x440200) ? Math["max"](0x0, Math["trunc"](_0x440200)) : 0x0;
              if (_0xb78f0c === _0xc36384 && isRhAiAppVideoNodeData(_0x398618)) {
                const _0x1529fb = buildRhAiAppResultDisplayPatch({
                  'nodeData': _0x398618,
                  'mediaWidth': _0x342d31,
                  'mediaHeight': _0x5b2b83,
                  'mediaKey': getRhAiAppVideoResultMediaKey(_0x372a96, _0x398618)
                });
                if (Object['keys'](_0x1529fb)["length"] > 0x0) {
                  _0x83e6cc["updateNodeData"](_0x3c34c2, _0x1529fb);
                }
              }
              continue;
            }
            const _0x17a480 = this["_resolveVideoMetaSrcFromVideoData"](_0x372a96);
            if (!_0x17a480) {
              continue;
            }
            let _0x1d9d61 = null;
            try {
              _0x1d9d61 = await _0x4d33ed['fetchVideoMetaFromServer'](_0x17a480);
            } catch {
              _0x1d9d61 = null;
            }
            if (_0x35d896 !== this["_resultMetaEnrichmentToken"]) {
              return;
            }
            if (!_0x1d9d61 || _0x1d9d61["success"] !== !![]) {
              continue;
            }
            const _0x8d9c14 = Math["round"](Number(_0x1d9d61["width"]) || 0x0);
            const _0x5602cf = Math["round"](Number(_0x1d9d61['height']) || 0x0);
            const _0x259e1e = Number(_0x1d9d61["duration"]);
            if (!(_0x8d9c14 > 0x0 && _0x5602cf > 0x0)) {
              continue;
            }
            const _0xade25e = _0x83e6cc["getState"]()["nodes"]?.[_0x3c34c2];
            if (!_0xade25e) {
              return;
            }
            const _0x1a1b36 = Array["isArray"](_0xade25e["videos"]) ? _0xade25e["videos"] : [];
            const _0x3854a2 = _0x1a1b36[_0xb78f0c];
            if (!_0x3854a2 || typeof _0x3854a2 !== "object") {
              continue;
            }
            const _0x2219b8 = Number(_0x3854a2["videoWidth"] || 0x0);
            const _0x2e3a36 = Number(_0x3854a2["videoHeight"] || 0x0);
            if (_0x2219b8 > 0x0 && _0x2e3a36 > 0x0) {
              continue;
            }
            const _0x12b090 = {
              ..._0x3854a2,
              'videoWidth': _0x8d9c14,
              'videoHeight': _0x5602cf
            };
            Number["isFinite"](_0x259e1e) && _0x259e1e > 0x0 && !(Number(_0x12b090["duration"]) > 0x0) && (_0x12b090['duration'] = _0x259e1e);
            const _0x37de1c = _0x1a1b36["slice"]();
            _0x37de1c[_0xb78f0c] = _0x12b090;
            const _0x2915b8 = {
              'videos': _0x37de1c
            };
            const _0x674f1 = Number(_0xade25e['mainVideoIndex']);
            const _0x16de02 = Number["isFinite"](_0x674f1) ? Math['max'](0x0, Math['trunc'](_0x674f1)) : 0x0;
            if (_0xb78f0c === _0x16de02) {
              _0x2915b8["videoWidth"] = _0x8d9c14;
              _0x2915b8["videoHeight"] = _0x5602cf;
              _0x2915b8["selectedVideoWidth"] = _0x8d9c14;
              _0x2915b8['selectedVideoHeight'] = _0x5602cf;
              if (Number["isFinite"](_0x259e1e) && _0x259e1e > 0x0) {
                _0x2915b8['videoDuration'] = _0x259e1e;
              }
              isRhAiAppVideoNodeData(_0xade25e) && Object['assign'](_0x2915b8, buildRhAiAppResultDisplayPatch({
                'nodeData': _0xade25e,
                'mediaWidth': _0x8d9c14,
                'mediaHeight': _0x5602cf,
                'mediaKey': getRhAiAppVideoResultMediaKey(_0x3854a2, _0xade25e)
              }));
            }
            _0x83e6cc['updateNodeData'](_0x3c34c2, _0x2915b8);
          }
        })();
      }
    }
    ["_finalizeVideoSuccessSideEffects"](_0x25230a, _0x4179ea) {
      this["_scheduleDreaminaResultEnrichment"](_0x25230a);
      this["_dispatchGenerationHistoryVideos"](_0x25230a, _0x4179ea);
      const _0x226f20 = _0x25230a['find'](_0x47f564 => _0x47f564?.["saveError"])?.['saveError'];
      _0x226f20 && window["showToast"]?.(videoTaskText("toasts.localSaveFailed", {
        'error': _0x226f20
      }), "warning");
    }
    ['_finalizeDreaminaSuccessResult'](_0x28823d, _0x21b809, _0x1032d7 = null, _0x3a873c = {}) {
      const _0x5f5d25 = this["_applyDreaminaSuccessResult"](_0x28823d, _0x21b809, _0x1032d7, {
        'writeStore': _0x3a873c["writeStore"] !== ![],
        'returnPatch': _0x3a873c["returnPatch"] === !![]
      });
      const _0x60ce91 = Array["isArray"](_0x5f5d25) ? _0x5f5d25 : _0x5f5d25?.["videos"] || [];
      this["_finalizeVideoSuccessSideEffects"](_0x60ce91, _0x21b809);
      return _0x3a873c['returnPatch'] === !![] ? {
        ...(_0x5f5d25 && !Array["isArray"](_0x5f5d25) ? _0x5f5d25 : {}),
        'videos': _0x60ce91
      } : _0x60ce91;
    }
    ["_dispatchGenerationHistoryVideos"](_0x12819c, _0x48b78c) {
      if (typeof window === "undefined" || typeof window['dispatchEvent'] !== 'function') {
        return;
      }
      const _0x3a7a01 = Array["isArray"](_0x12819c) ? _0x12819c["filter"](_0xa85b6a => _0xa85b6a && typeof _0xa85b6a === "object" && !_0xa85b6a['error']) : [];
      if (_0x3a7a01["length"] === 0x0) {
        return;
      }
      const _0x15abf4 = _0x83e6cc["getState"]()["nodes"]?.[this['nodeId']] || this['_data'] || {};
      try {
        window['dispatchEvent'](new CustomEvent(GENERATION_HISTORY_EVENT, {
          'detail': {
            'kind': 'video',
            'sourceNodeId': this["nodeId"],
            'nodeData': _0x15abf4,
            'videos': _0x3a7a01,
            'startedAt': _0x48b78c,
            'createdAt': Date["now"]()
          }
        }));
      } catch {}
    }
    async ['_maybeResumeDreaminaTaskImpl']() {
      if (this["_videoSubmitInFlight"] === !![]) {
        return;
      }
      const _0x3dec5b = _0x19e582()['nodes']?.[this["nodeId"]] || this["_data"] || {};
      if (!this["_isDreaminaVideoNode"](_0x3dec5b)) {
        this["_stopDreaminaRecovery"](![]);
        return;
      }
      if (!this["_isDreaminaRecoverableRunningTask"](_0x3dec5b)) {
        this["_stopDreaminaRecovery"](![]);
        return;
      }
      const _0x3d5790 = this["_resolveDreaminaResumeSubmitId"](_0x3dec5b);
      if (!_0x3d5790) {
        this["_stopDreaminaRecovery"](![]);
        return;
      }
      const _0x51522a = String(this["_dreaminaActiveSubmitId"] || '')['trim']();
      if (this['_isGenerating'] && _0x3dec5b?.["dreaminaTaskRecovering"] !== !![] && _0x51522a && _0x51522a === _0x3d5790 && !this["_isStaleActiveDreaminaTask"](_0x3dec5b)) {
        return;
      }
      if (this["_dreaminaResumeSubmitId"] === _0x3d5790) {
        return;
      }
      this["_stopDreaminaRecovery"](![]);
      const _0x461ec2 = Number(_0x3dec5b?.["dreaminaTaskStartedAt"] || _0x3dec5b?.["generationStartTime"] || Date["now"]());
      const _0x1aceb5 = resolveDreaminaStyleVideoProvider(_0x3dec5b?.["model"], _0x3dec5b?.['provider']);
      const _0x2c1ef5 = _0x1aceb5 === "dreamina" && this["_shouldProbeStaleDreaminaRecovery"](_0x3dec5b);
      this['_dreaminaResumeSubmitId'] = _0x3d5790;
      this["_dreaminaActiveSubmitId"] = _0x3d5790;
      const _0x4be4e9 = (async () => {
        let _0x5c8a59 = null;
        try {
          _0x5c8a59 = new AbortController();
          this['_dreaminaResumeAbortController'] = _0x5c8a59;
          this["_isGenerating"] = !![];
          this['_setGenerateButtonBusyUi']({
            'cancellable': ![]
          });
          _0x11b621(this["previewEl"]);
          const _0x30c04d = await resumeTask(createGenerationResumePlanFromNode({
            'kind': 'video',
            'node': _0x3dec5b,
            'taskProtocol': "dreamina",
            'sourceNodeId': this["nodeId"],
            'targetNodeId': this["nodeId"],
            'trigger': "node",
            'taskType': "video-generation",
            'provider': _0x1aceb5 || "dreamina",
            'adapterType': _0x1aceb5 === "dreamina" ? 'localRuntime' : "modelApi",
            'payload': {
              ..._0x3dec5b,
              'provider': _0x1aceb5 || _0x3dec5b?.["provider"] || "dreamina",
              'model': _0x1aceb5 === 'apimart' ? _0x3dec5b?.['model'] || APIMART_DREAMINA_VIDEO_DEFAULT_MODEL : _0x3dec5b?.["model"] || ''
            },
            'cancellable': ![],
            'resumable': !![],
            'pauseOnAbort': !![],
            'startBuilder': () => ({
              ...this["_buildDreaminaTaskPatch"](this['_buildDreaminaPendingSnapshot']({
                'submitId': _0x3d5790,
                'phase': "generating",
                'label': String(_0x3dec5b?.["dreaminaTaskLabel"] || '')['trim']() || videoTaskText("task.generating"),
                'raw': _0x3dec5b?.["dreaminaTaskLastRaw"] || {}
              }), {
                'recovering': !![],
                'startedAt': _0x461ec2
              })
            }),
            'onTaskStart': () => {
              this["_persistDreaminaResumeCache"]();
            },
            'poll': async _0x508273 => {
              const _0x33cba1 = _0x508273?.["payload"] || {};
              if (_0x1aceb5 && _0x1aceb5 !== 'dreamina') {
                return _0x4d33ed["resumeAsyncVideoTask"](_0x3d5790, _0x33cba1, {
                  'signal': _0x5c8a59["signal"]
                });
              }
              const _0x21e064 = async _0x564120 => {
                if (!_0x564120 || _0x5c8a59["signal"]["aborted"]) {
                  return;
                }
                _0x508273?.["isBackgroundTask"]?.() ? _0x50e78d(_0x508273, this['nodeId'], this["_buildDreaminaTaskPatch"](_0x564120, {
                  'recovering': !![],
                  'startedAt': _0x461ec2
                })) : this["_applyDreaminaTaskSnapshot"](_0x564120, {
                  'recovering': !![],
                  'startedAt': _0x461ec2
                });
              };
              if (_0x2c1ef5) {
                if (typeof _0x4d33ed["probeDreaminaVideoTask"] !== "function") {
                  throw new Error("Dreamina 历史任务核验能力不可用");
                }
                const _0x3b60c6 = await _0x4d33ed['probeDreaminaVideoTask'](_0x3d5790, {
                  'signal': _0x5c8a59['signal']
                });
                await _0x21e064(_0x3b60c6?.['dreaminaSnapshot']);
                if (_0x3b60c6?.["pending"] !== !![]) {
                  return _0x3b60c6;
                }
              }
              return _0x4d33ed["resumeDreaminaVideoTask"](_0x3d5790, {
                'signal': _0x5c8a59["signal"],
                'intervalMs': _0x51d57a,
                'maxWaitMs': _0x2c1ef5 ? _0x2a60ca : _0x352659,
                'onProgress': _0x21e064
              });
            },
            'resultBuilder': async (_0x5fa5c2, _0x2f7239) => {
              const _0x15485b = _0x5fa5c2?.["dreaminaSnapshot"] || null;
              const _0x52b008 = this["_applyDreaminaSuccessResult"](_0x5fa5c2, _0x2f7239["startedAt"], _0x15485b, {
                'writeStore': ![],
                'returnPatch': !![]
              });
              return _0x52b008?.['patch'] || {};
            },
            'failureBuilder': (_0x379cb8, _0x4c183e) => {
              if (_0x2c1ef5 && this["_isUncertainStaleDreaminaRecoveryError"](_0x379cb8)) {
                const _0xd96f5 = videoTaskText("task.staleRecoveryStopped", {
                  'message': _0x379cb8?.["message"] || videoTaskText("task.queryFailed")
                });
                const _0x16c784 = this['_buildDreaminaPendingSnapshot']({
                  'submitId': _0x3d5790,
                  'phase': String(_0x3dec5b?.["dreaminaTaskPhase"] || '')["trim"]() || "generating",
                  'label': _0xd96f5,
                  'raw': _0x3dec5b?.["dreaminaTaskLastRaw"] || {}
                });
                return Object["assign"](buildVideoGenerationFailurePatch({
                  'error': _0xd96f5,
                  'startedAt': _0x4c183e["startedAt"]
                }), this["_buildDreaminaTaskPatch"](_0x16c784, {
                  'recovering': ![],
                  'startedAt': _0x4c183e["startedAt"]
                }));
              }
              if (!_0x2c1ef5 && this['_isDreaminaPollTimeoutError'](_0x379cb8)) {
                const _0x1ee0f5 = this["_buildDreaminaBackgroundPendingSnapshot"](_0x3d5790);
                return Object["assign"]({
                  'isGenerating': !![],
                  'jobStatus': "running",
                  'jobError': null,
                  'generationDuration': Date["now"]() - _0x4c183e["startedAt"]
                }, this["_buildDreaminaTaskPatch"](_0x1ee0f5, {
                  'recovering': ![],
                  'startedAt': _0x4c183e['startedAt']
                }));
              }
              const _0xd026b3 = _0x379cb8?.["dreaminaSnapshot"] || null;
              const _0xaa0fa9 = _0x379cb8?.["message"] || _0xd026b3?.['failReason'] || _0xd026b3?.["label"] || videoTaskText("task.queryFailed");
              return Object['assign'](buildVideoGenerationFailurePatch({
                'error': _0xaa0fa9,
                'startedAt': _0x4c183e["startedAt"]
              }), _0xd026b3 ? this['_buildDreaminaTaskPatch'](_0xd026b3, {
                'recovering': ![],
                'startedAt': _0x4c183e["startedAt"]
              }) : this["_buildDreaminaTaskPatch"](this['_buildDreaminaFailedSnapshot'](_0x3d5790, _0xaa0fa9), {
                'recovering': ![],
                'startedAt': _0x4c183e["startedAt"]
              }));
            },
            'cancelledBuilder': _0x1521d3 => Object["assign"]({
              'generationDuration': Date['now']() - _0x1521d3['startedAt']
            }, this['_buildDreaminaTaskPatch'](this["_buildDreaminaPendingSnapshot"]({
              'submitId': _0x3d5790,
              'phase': "generating",
              'label': String(_0x3dec5b?.["dreaminaTaskLabel"] || '')['trim']() || videoTaskText('task.generating'),
              'raw': _0x3dec5b?.["dreaminaTaskLastRaw"] || {}
            }), {
              'recovering': ![],
              'startedAt': _0x1521d3["startedAt"]
            })),
            'parseError': _0x193262 => getGenerationErrorMessage(_0x193262, videoTaskText("task.queryFailed"))
          }), {
            'store': _0x83e6cc,
            'startedAt': _0x461ec2,
            'abortController': _0x5c8a59
          });
          if (_0x30c04d['status'] === "pending") {
            this["_persistDreaminaResumeCache"]();
            return;
          }
          if (_0x30c04d['status'] === "success") {
            const _0x4a91e3 = normalizeVideoGenerationResult(_0x30c04d['result'])["items"];
            this["_finalizeVideoSuccessSideEffects"](_0x4a91e3, _0x461ec2);
          }
          if (_0x30c04d['status'] === "failed" && this["_isDreaminaPollTimeoutError"](_0x30c04d["error"])) {
            this['_showDreaminaBackgroundQueueingToast'](_0x3d5790);
          } else {
            _0x30c04d['status'] === "failed" && (this["_dreaminaActiveSubmitId"] = '');
          }
          this["_persistDreaminaResumeCache"]();
        } catch (_0x3b3761) {
          if (_0x5c8a59?.["signal"]?.['aborted'] || isGenerationAbortError(_0x3b3761)) {
            return;
          }
          const _0x24c766 = _0x3b3761?.["message"] || videoTaskText("task.queryFailed");
          const _0x35993b = this["_buildDreaminaFailedSnapshot"](_0x3d5790, _0x24c766);
          _0x83e6cc["updateNodeData"](this["nodeId"], Object['assign'](buildVideoGenerationFailurePatch({
            'error': _0x24c766,
            'startedAt': _0x461ec2
          }), this["_buildDreaminaTaskPatch"](_0x35993b, {
            'recovering': ![],
            'startedAt': _0x461ec2
          })));
          this["_persistDreaminaResumeCache"]();
        } finally {
          _0x5c8a59 && this["_dreaminaResumeAbortController"] === _0x5c8a59 && (this["_dreaminaResumeAbortController"] = null);
          this["_dreaminaResumeSubmitId"] === _0x3d5790 && (this["_dreaminaResumeSubmitId"] = '');
          this["_dreaminaResumePromise"] = null;
          const _0x4799f7 = this['_syncLocalTaskNodeData']();
          const _0x581e6e = shouldShowGenerationBusyUi(_0x4799f7) || this["_shouldKeepDreaminaLoading"](_0x4799f7);
          this['_isGenerating'] = _0x581e6e;
          !_0x581e6e && (this["_dreaminaActiveSubmitId"] = '');
          _0x581e6e ? this['_updateSubmitButtonState']?.() : (this["_resetGenerateButtonIdleUi"]({
            'cancellable': ![]
          }), _0x32c4ac(this["previewEl"]), this["_updateSubmitButtonState"]?.());
        }
      })();
      this['_dreaminaResumePromise'] = _0x4be4e9;
    }
    async ["_maybeResumeRunningHubTaskImpl"]() {
      const _0xb5dfa4 = _0x19e582()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      if (!this['_isRunninghubWorkflowModel'](_0xb5dfa4?.["model"], _0xb5dfa4?.["provider"])) {
        this["_stopRunningHubRecovery"](![]);
        return;
      }
      if (!this["_isRunningHubRecoverableRunningTask"](_0xb5dfa4)) {
        this["_stopRunningHubRecovery"](![]);
        return;
      }
      const _0x72d819 = String(_0xb5dfa4?.["rhTaskId"] || '')['trim']();
      if (!_0x72d819) {
        this["_stopRunningHubRecovery"](![]);
        return;
      }
      if (this["_rhResumeTaskId"] === _0x72d819 && this["_rhResumePromise"]) {
        return;
      }
      this["_stopRunningHubRecovery"](![]);
      const _0x4f7e24 = Number(_0xb5dfa4?.['rhTaskStartedAt'] || _0xb5dfa4?.["generationStartTime"] || Date['now']());
      const _0x4b7376 = _0xb5dfa4?.['rhTaskUseOpenapiQuery'] === !![];
      this["_rhResumeTaskId"] = _0x72d819;
      const _0x212f12 = (async () => {
        let _0x204eb2 = null;
        let _0x1d7d12 = null;
        try {
          const _0x34eac6 = await this['_buildPayload']();
          _0x1d7d12 = _0x34eac6;
          if (!_0x34eac6) {
            return;
          }
          _0x204eb2 = new AbortController();
          this['_rhResumeAbortController'] = _0x204eb2;
          this["_rhAbortController"] = _0x204eb2;
          this["_rhTaskId"] = _0x72d819;
          this["_rhApiKey"] = String(_0x34eac6?.["apiKey"] || '')["trim"]() || this["_rhApiKey"] || null;
          this['_rhCancelRequested'] = ![];
          this["_rhRemoteCancelSent"] = ![];
          this["_isGenerating"] = !![];
          this["_setGenerateButtonBusyUi"]({
            'cancellable': !![]
          });
          _0x11b621(this['previewEl']);
          const _0x443c8 = await resumeTask(createGenerationResumePlanFromNode({
            'kind': "video",
            'node': _0xb5dfa4,
            'taskProtocol': "workflow",
            'sourceNodeId': this["nodeId"],
            'targetNodeId': this["nodeId"],
            'trigger': "node",
            'taskType': "video-generation",
            'payload': _0x34eac6,
            'cancellable': !![],
            'resumable': !![],
            'pauseOnAbort': !![],
            'startBuilder': () => ({
              'rhStatusMessage': null,
              'rhStatusCode': null,
              'rhTaskUseOpenapiQuery': _0x4b7376
            }),
            'onTaskStart': () => {
              this["_persistRunningHubResumeCache"]();
            },
            'poll': async () => _0x4d33ed["resumeRunningHubVideoTask"](_0x72d819, _0x34eac6, {
              'signal': _0x204eb2['signal'],
              'useOpenapiQuery': _0x4b7376
            }),
            'resultBuilder': async (_0x1c92af, _0x1de81e) => {
              const _0x411146 = this["_applyDreaminaSuccessResult"](_0x1c92af, _0x1de81e["startedAt"], null, {
                'writeStore': ![],
                'returnPatch': !![]
              });
              return {
                ...(_0x411146?.["patch"] || {}),
                'rhStatusMessage': null,
                'rhStatusCode': null,
                ...this["_buildRunningHubTaskPatch"]({
                  'taskId': _0x72d819,
                  'status': "success",
                  'startedAt': _0x1de81e["startedAt"],
                  'recovering': ![],
                  'useOpenapiQuery': _0x4b7376
                })
              };
            },
            'failureBuilder': (_0xbc4566, _0x2b8beb) => ({
              ...buildVideoGenerationFailurePatch({
                'error': _0xbc4566?.["message"] || videoTaskText('task.generationFailed'),
                'startedAt': _0x2b8beb["startedAt"],
                'duration': Date['now']() - _0x2b8beb["startedAt"]
              }),
              'rhStatusMessage': _0xbc4566?.["message"] || videoTaskText("task.generationFailed"),
              'rhStatusCode': Number["isFinite"](Number(_0xbc4566?.['code'])) ? Number(_0xbc4566['code']) : null,
              ...this["_buildRunningHubTaskPatch"]({
                'taskId': _0x72d819,
                'status': "failed",
                'startedAt': _0x2b8beb["startedAt"],
                'recovering': ![],
                'useOpenapiQuery': _0x4b7376
              })
            }),
            'cancelledBuilder': _0x10cbb1 => ({
              'videos': [],
              'videoUrl': '',
              'localPath': '',
              'generationDuration': Date["now"]() - _0x10cbb1["startedAt"],
              'rhStatusMessage': videoTaskText('cancel.interrupted'),
              'rhStatusCode': null,
              ...this["_buildRunningHubTaskPatch"]({
                'taskId': _0x72d819,
                'status': 'cancelled',
                'startedAt': _0x10cbb1["startedAt"],
                'recovering': ![],
                'useOpenapiQuery': _0x4b7376
              })
            }),
            'parseError': _0x6b9114 => getGenerationErrorMessage(_0x6b9114, videoTaskText("task.generationFailed"))
          }), {
            'store': _0x83e6cc,
            'startedAt': _0x4f7e24,
            'abortController': _0x204eb2
          });
          if (_0x443c8["status"] === 'pending') {
            this['_persistRunningHubResumeCache']();
            return;
          }
          if (_0x443c8["status"] === 'success') {
            const _0x185f7d = normalizeVideoGenerationResult(_0x443c8["result"])["items"];
            this["_finalizeVideoSuccessSideEffects"](_0x185f7d, _0x4f7e24);
          }
          this['_persistRunningHubResumeCache']();
        } catch (_0x21dd44) {
          if (_0x204eb2?.["signal"]?.["aborted"] || isGenerationAbortError(_0x21dd44)) {
            return;
          }
          _0x83e6cc["updateNodeData"](this["nodeId"], {
            'generationDuration': Math["max"](0x0, Date["now"]() - _0x4f7e24),
            'rhStatusMessage': _0x21dd44?.["message"] || videoTaskText('task.generationFailed'),
            'rhStatusCode': Number['isFinite'](Number(_0x21dd44?.["code"])) ? Number(_0x21dd44["code"]) : null,
            ...this['_buildRunningHubTaskPatch']({
              'taskId': _0x72d819,
              'status': "failed",
              'startedAt': _0x4f7e24,
              'recovering': ![],
              'useOpenapiQuery': _0x4b7376
            })
          });
          this['_persistRunningHubResumeCache']();
        } finally {
          _0x204eb2 && this["_rhResumeAbortController"] === _0x204eb2 && (this["_rhResumeAbortController"] = null);
          _0x204eb2 && this['_rhAbortController'] === _0x204eb2 && (this["_rhAbortController"] = null);
          this["_rhResumeTaskId"] === _0x72d819 && (this['_rhResumeTaskId'] = '');
          releasePayloadObjectUrlLease(_0x1d7d12);
          this["_rhResumePromise"] = null;
          const _0x2628c2 = this["_syncLocalTaskNodeData"]();
          const _0x3c5a67 = shouldShowGenerationBusyUi(_0x2628c2);
          this['_isGenerating'] = _0x3c5a67;
          if (_0x3c5a67) {
            this["_rhTaskId"] = String(_0x2628c2?.["rhTaskId"] || _0x72d819 || '')["trim"]();
          } else {
            this["_rhTaskId"] = null;
            if (!this["_rhCancelRequested"]) {
              this["_rhApiKey"] = null;
            }
            this["_resetGenerateButtonIdleUi"]({
              'cancellable': !![]
            });
            _0x32c4ac(this["previewEl"]);
          }
          this['_updateSubmitButtonState']();
        }
      })();
      this["_rhResumePromise"] = _0x212f12;
    }
    async ['_maybeResumeAsyncTaskImpl']() {
      const _0x374740 = _0x19e582()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      if (this["_isGenerating"] && _0x374740?.["asyncTaskRecovering"] !== !![]) {
        return;
      }
      if (!this["_isAsyncRecoverableRunningTask"](_0x374740)) {
        this["_stopAsyncRecovery"](![]);
        return;
      }
      const _0x8b1495 = String(_0x374740?.["asyncTaskId"] || '')["trim"]();
      if (!_0x8b1495) {
        this["_stopAsyncRecovery"](![]);
        return;
      }
      const _0x391f95 = this["_getGenerationTaskRecoveryOwner"]();
      const _0x3aa43a = _0x391f95["claim"]("asyncModelApi", _0x8b1495);
      if (!_0x3aa43a["claimed"]) {
        return _0x3aa43a["promise"];
      }
      const _0x5f0f6c = Number(_0x374740?.["asyncTaskStartedAt"] || _0x374740?.["generationStartTime"] || Date["now"]());
      const _0x5d7b2f = this["_inferAsyncProviderFromModel"](_0x374740?.["model"], _0x374740?.["asyncTaskProvider"] || _0x374740?.["provider"] || '');
      const _0x12ef98 = _0x3aa43a['controller'];
      const _0x12bae4 = (async () => {
        try {
          const _0x3215ed = await this['_buildResumePayload'](_0x374740, {
            'providerHint': _0x5d7b2f
          });
          if (!_0x3215ed) {
            return;
          }
          this["_isGenerating"] = !![];
          this["_setGenerateButtonBusyUi"]({
            'cancellable': ![]
          });
          _0x11b621(this["previewEl"]);
          const _0x23213c = await resumeTask(createGenerationResumePlanFromNode({
            'kind': "video",
            'node': _0x374740,
            'taskProtocol': "asyncModelApi",
            'sourceNodeId': this["nodeId"],
            'targetNodeId': this['nodeId'],
            'trigger': "node",
            'taskType': "video-generation",
            'payload': _0x3215ed,
            'pauseOnAbort': !![],
            'persistTaskState': () => this["_persistAsyncResumeCache"](),
            'poll': async () => _0x4d33ed["resumeAsyncVideoTask"](_0x8b1495, _0x3215ed, {
              'signal': _0x12ef98["signal"]
            }),
            'resultBuilder': async (_0x1c911f, _0x2f5d96) => {
              const _0x2320da = this["_applyDreaminaSuccessResult"](_0x1c911f, _0x2f5d96['startedAt'], null, {
                'writeStore': ![],
                'returnPatch': !![]
              });
              return _0x2320da?.["patch"] || {};
            },
            'parseError': _0x301b66 => getGenerationErrorMessage(_0x301b66, videoTaskText('task.generationFailed'))
          }), {
            'store': _0x83e6cc,
            'startedAt': _0x5f0f6c,
            'abortController': _0x12ef98
          });
          if (_0x23213c["status"] === "pending") {
            return;
          }
          if (_0x23213c['status'] === "success") {
            const _0x4bc14a = normalizeVideoGenerationResult(_0x23213c["result"])["items"];
            this["_finalizeVideoSuccessSideEffects"](_0x4bc14a, _0x5f0f6c);
          }
        } catch (_0x4984c8) {
          if (_0x12ef98?.["signal"]?.["aborted"] || isGenerationAbortError(_0x4984c8)) {
            return;
          }
          _0x83e6cc['updateNodeData'](this["nodeId"], {
            ...buildVideoGenerationFailurePatch({
              'error': _0x4984c8?.["message"] || videoTaskText("task.generationFailed"),
              'startedAt': _0x5f0f6c,
              'duration': Math['max'](0x0, Date["now"]() - _0x5f0f6c)
            }),
            ...this["_buildAsyncTaskPatch"]({
              'provider': _0x5d7b2f,
              'kind': "video",
              'taskId': _0x8b1495,
              'status': "failed",
              'startedAt': _0x5f0f6c,
              'recovering': ![]
            })
          });
          this["_persistAsyncResumeCache"]();
        } finally {
          _0x391f95["finish"]('asyncModelApi', {
            'taskId': _0x8b1495,
            'controller': _0x12ef98
          });
          const _0x44e2de = this["_syncLocalTaskNodeData"]();
          const _0x2176a4 = _0x391f95["isBusy"](_0x44e2de);
          this["_isGenerating"] = _0x2176a4;
          !_0x2176a4 && (this['_resetGenerateButtonIdleUi']({
            'cancellable': ![]
          }), _0x32c4ac(this["previewEl"]));
          this["_updateSubmitButtonState"]();
        }
      })();
      _0x391f95["setPromise"]("asyncModelApi", _0x12bae4);
    }
    async ['_handleGenerateOrCancelImpl'](_0x47a066 = null) {
      const _0x4a8720 = _0x83e6cc['getState']()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      const _0x14553d = this["_isRunninghubWorkflowModel"](_0x4a8720?.["model"], _0x4a8720?.["provider"]);
      !_0x14553d && this['_dreaminaResumePromise'] && this["_stopDreaminaRecovery"](!![]);
      !_0x14553d && this["_asyncResumePromise"] && this['_stopAsyncRecovery'](!![]);
      if (shouldAllowCancel(_0x4a8720, {
        'cancellable': _0x14553d,
        'cancelInFlight': this["_rhCancelInFlight"] === !![]
      })) {
        await this['_cancelRunningHubWorkflowTask']();
        return;
      }
      await this["_onGenerate"](_0x47a066);
    }
    async ["_cancelRunningHubWorkflowTaskImpl"]() {
      const _0x16da92 = _0x83e6cc["getState"]()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      const _0x1114d6 = this['_rhApiKey'] || '';
      const _0x5d2751 = String(this["_rhTaskId"] || '')["trim"]() || String(_0x16da92?.["rhTaskId"] || '')['trim']();
      const _0x4c4be4 = Date["now"]();
      const _0x55bf0b = Number(_0x16da92?.["generationStartTime"]);
      const _0x3b3cad = _0x16da92?.["generationDuration"] != null ? _0x16da92["generationDuration"] : Number["isFinite"](_0x55bf0b) && _0x55bf0b > 0x0 ? Math["max"](0x0, _0x4c4be4 - _0x55bf0b) : 0x0;
      this["_rhCancelRequested"] = !![];
      this["_rhAbortController"] && !this["_rhAbortController"]["signal"]["aborted"] && this["_rhAbortController"]['abort']();
      const _0x3c6349 = !_0x1114d6;
      const _0x5e966a = !_0x5d2751;
      try {
        this["_rhRemoteCancelSent"] = !_0x3c6349 && !_0x5e966a;
        const _0x1873d8 = ({
          remoteResult: _0x46fdd4,
          remoteError: _0x1473ef,
          startedAt: _0x57aefc
        }) => {
          const _0x44f6f4 = Number(_0x46fdd4?.["code"]);
          const _0x4ccbc0 = _0x3c6349 ? videoTaskText("cancel.missingApiKey") : _0x5e966a ? videoTaskText('cancel.interruptedNoTaskId') : '';
          const _0x5e3ac8 = _0x4ccbc0 || (_0x1473ef ? _0x1473ef["message"] || videoTaskText('cancel.failed') : _0x44f6f4 === 0x0 ? videoTaskText("cancel.success") : _0x44f6f4 === 0x327 ? videoTaskText("cancel.taskNotFound") : _0x46fdd4?.["msg"] || videoTaskText("cancel.failed"));
          return {
            'rhStatusMessage': _0x5e3ac8,
            'rhStatusCode': _0x5e966a ? 0x32d : Number["isFinite"](_0x44f6f4) ? _0x44f6f4 : null,
            'videos': [],
            'videoUrl': '',
            'localPath': '',
            'generationDuration': _0x3b3cad,
            ...this["_buildRunningHubTaskPatch"]({
              'taskId': _0x5d2751,
              'status': 'cancelled',
              'startedAt': Number(_0x57aefc || _0x16da92?.['rhTaskStartedAt'] || _0x16da92?.['generationStartTime'] || 0x0),
              'recovering': ![],
              'useOpenapiQuery': _0x16da92?.["rhTaskUseOpenapiQuery"] === !![]
            })
          };
        };
        await cancelTask(this["nodeId"], {
          'store': _0x83e6cc,
          'taskId': _0x5d2751,
          'cancellable': !![],
          'cancel': ({
            taskId: _0x38dc56
          }) => {
            if (!_0x1114d6) {
              throw new Error(videoTaskText("cancel.missingApiKey"));
            }
            return _0x4d33ed['cancelRunningHubWorkflowTask']({
              'apiKey': _0x1114d6,
              'taskId': _0x38dc56,
              'providerProfileId': _0x16da92?.["providerProfileId"] || _0x16da92?.['rhProviderProfileId'] || ''
            });
          },
          'cancelledBuilder': _0x1873d8,
          'spec': createGenerationCancelPlanFromNode({
            'kind': "video",
            'node': _0x16da92,
            'taskProtocol': "workflow",
            'sourceNodeId': this['nodeId'],
            'targetNodeId': this["nodeId"],
            'trigger': "node",
            'taskType': "video-generation",
            'payload': _0x16da92,
            'cancellable': !![],
            'resumable': !![],
            'cancelledBuilder': _0x1873d8
          })
        });
        this['_persistRunningHubResumeCache']();
      } finally {
        this["_isGenerating"] = ![];
        this['_rhAbortController'] = null;
        this['_rhTaskId'] = null;
        this["_rhApiKey"] = null;
        this["_rhRemoteCancelSent"] = ![];
        this["_stopRunningHubRecovery"](!![]);
        this["_resetGenerateButtonIdleUi"]({
          'cancellable': !![]
        });
        _0x32c4ac(this["previewEl"]);
        this["_updateSubmitButtonState"]();
      }
    }
    ["_setGenerateButtonBusyUi"]({
      cancellable = ![]
    } = {}) {
      if (!this["btnEl"]) {
        return;
      }
      if (cancellable) {
        const _0x3e497d = getVideoCancelTooltip();
        setGenerateButtonCancellableUi(this["btnEl"], {
          'title': _0x3e497d,
          'tooltip': _0x3e497d,
          'ariaLabel': videoTaskText("controls.cancelGenerateAria"),
          'color': "var(--red)",
          'busy': !![]
        });
        return;
      }
      const _0x5079e8 = getVideoGenerateTitle();
      setGenerateButtonLoadingUi(this["btnEl"], {
        'title': _0x5079e8,
        'disabled': !![],
        'ariaLabel': _0x5079e8
      });
    }
    ["_resetGenerateButtonIdleUi"]({
      cancellable = ![]
    } = {}) {
      if (!this["btnEl"]) {
        return;
      }
      const _0xfb9d71 = getVideoGenerateTitle();
      resetGenerateButtonIdleUi(this["btnEl"], _0xfb9d71);
      if (cancellable) {
        this["btnEl"]["removeAttribute"]("title");
        this["btnEl"]['setAttribute']("data-tooltip", getVideoCancelTooltip());
        return;
      }
      this['btnEl']["removeAttribute"]("data-tooltip");
      this["btnEl"]["title"] = _0xfb9d71;
    }
    ["_getPreviewGenerateButtonLoadingOptions"]() {
      return createPreviewGenerateButtonCallbacks(this, getVideoGenerateTitle());
    }
    async ['_onGenerateImpl'](_0xae1192 = null, _0x11e8ce = {}) {
      if (this['_isGenerating']) {
        return;
      }
      if (_0x11e8ce?.['insertPrompt'] === !![]) {
        insertPresetPromptIntoEditor({
          'storeApi': _0x83e6cc,
          'nodeId': this["nodeId"],
          'promptEl': this["promptEl"],
          'template': _0xae1192,
          'inEdges': _0x83e6cc['getIncomingEdges'](this["nodeId"]),
          'nodes': _0x83e6cc["getState"]()["nodes"] || {},
          'allowedAssetTypes': ["text", 'image', "video", 'audio']
        });
        this["_updateSubmitButtonState"]?.();
        return;
      }
      if (shouldUsePromptPreviewForPreset(_0xae1192)) {
        const _0x310b2a = await this['_buildPayload'](_0xae1192);
        if (!_0x310b2a) {
          return;
        }
        try {
          previewPresetPromptInEditor({
            'storeApi': _0x83e6cc,
            'nodeId': this["nodeId"],
            'promptEl': this['promptEl'],
            'promptText': _0x310b2a["prompt"]
          });
        } finally {
          releasePayloadObjectUrlLease(_0x310b2a);
        }
        return;
      }
      if (isPreviewModeEnabled()) {
        !isPreviewNodeLoading(this["nodeId"]) && startPreviewNodeLoading(this['nodeId'], this["previewEl"], this["_getPreviewGenerateButtonLoadingOptions"]());
        return;
      }
      if (this["_videoSubmitInFlight"] === !![]) {
        return;
      }
      const _0x2c0556 = _0x83e6cc["getState"]()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      const _0x24bc69 = typeof this["_shouldKeepDreaminaLoading"] === "function" && typeof this["_isDreaminaVideoNode"] === "function" ? this["_shouldKeepDreaminaLoading"](_0x2c0556) : ![];
      if (shouldShowGenerationBusyUi(_0x2c0556) || _0x24bc69) {
        return;
      }
      const _0x507473 = createSegmentRetakeGenerationLifecycle(this, {
        'nodeData': _0x2c0556,
        'store': _0x83e6cc,
        'startLoading': _0x11b621,
        'stopLoading': _0x32c4ac
      });
      if (_0x507473['reject']()) {
        return;
      }
      this["_videoSubmitInFlight"] = !![];
      let _0x2e879d = null;
      try {
        _0x507473['begin']();
        const _0x5c8caa = String(this["_data"]?.["model"] || '')["trim"]();
        const _0x2e1ecb = String(this['_data']?.['provider'] || '')["trim"]();
        await _0xb5220a(_0x5c8caa, _0x2e1ecb);
        if (!this["_guardVipSelection"](this["_data"]?.['model'] || '', _0x2e1ecb)) {
          return;
        }
        const _0x50a3ee = guardModelGenerationCredentials({
          'modelId': _0x5c8caa,
          'provider': _0x2e1ecb,
          'providerProfileId': _0x2c0556?.["providerProfileId"] || _0x2c0556?.['rhProviderProfileId']
        });
        if (!_0x50a3ee["ready"]) {
          return;
        }
        if (typeof window["ensureSubscriptionInstallId"] === "function") {
          try {
            await window["ensureSubscriptionInstallId"]();
          } catch {}
        }
        const _0x1f96d5 = await this['_buildPayload'](_0xae1192, {
          'randomizeSubmitParams': !![]
        });
        _0x2e879d = _0x1f96d5;
        if (!_0x1f96d5) {
          return;
        }
        if (!(await this["_preflightConnectedLocalVideoInputs"](_0x1f96d5))) {
          return;
        }
        const _0x304ba7 = String(_0x1f96d5["model"] || '')['trim']();
        if (_0x4a9e7b(_0x304ba7, _0x1f96d5["provider"]) && !String(_0x1f96d5["installId"] || '')['trim']()) {
          window['showToast']?.(videoTaskText("toasts.missingInstallId"), "error");
          return;
        }
        const _0x16d247 = this["_isRunninghubWorkflowModel"](_0x1f96d5['model'], _0x1f96d5['provider']);
        const _0x565ec6 = String(_0x1f96d5?.["provider"] || '')['trim']()["toLowerCase"]() === "runninghub" && isModelApiModel(_0x1f96d5?.["model"], "runninghub");
        if (_0x565ec6 && !String(_0x1f96d5?.["apiKey"] || '')["trim"]()) {
          showProviderApiKeyMissingToast("请先填写 RunningHub 模型 API Key", {
            'providerId': _0x1f96d5?.["providerProfileId"] || 'runninghub',
            'keyType': "modelApi",
            'model': _0x1f96d5?.["model"]
          });
          return;
        }
        const _0x3bf21b = this["_isDreaminaVideoNode"](_0x1f96d5);
        const _0x46d1d1 = String(_0x1f96d5?.["provider"] || this["_data"]?.["provider"] || '')["trim"]()["toLowerCase"]();
        const _0x20abb7 = !_0x16d247 && !_0x3bf21b;
        _0x3bf21b && this["_stopDreaminaRecovery"](!![]);
        _0x16d247 && this["_stopRunningHubRecovery"](!![]);
        _0x20abb7 && this['_stopAsyncRecovery'](!![]);
        this["_rhGenToken"] = (this['_rhGenToken'] || 0x0) + 0x1;
        const _0x5b602a = this["_rhGenToken"];
        this["_rhCancelRequested"] = ![];
        this["_rhRemoteCancelSent"] = ![];
        this["_rhApiKey"] = _0x16d247 ? _0x1f96d5["apiKey"] : null;
        this['_rhTaskId'] = null;
        this["_rhAbortController"] = _0x3bf21b || _0x16d247 || _0x20abb7 ? new AbortController() : null;
        this["_isGenerating"] = !![];
        this['_setGenerateButtonBusyUi']({
          'cancellable': _0x16d247
        });
        if (!_0x507473["hasStartedPresentation"]()) {
          _0x11b621(this["previewEl"]);
        }
        const _0x235374 = Date["now"]();
        const _0x25bcf5 = {
          ...buildGenerationStartPatch({
            'startedAt': _0x235374
          }),
          'generationStartTime': _0x235374,
          'generationDuration': null,
          'rhStatusMessage': null,
          'rhStatusCode': null
        };
        (_0x16d247 || _0x565ec6) && _0x1f96d5?.["providerProfileId"] && (_0x25bcf5["rhProviderProfileId"] = normalizeRunningHubModelApiProfileId(_0x1f96d5?.["providerProfileId"]));
        _0x3bf21b && (Object["assign"](_0x25bcf5, {
          'dreaminaSubmitId': '',
          'dreaminaTaskStatus': "pending",
          'dreaminaTaskPhase': "generating",
          'dreaminaTaskLabel': videoTaskText('task.submitting'),
          'dreaminaTaskStartedAt': _0x235374,
          'dreaminaTaskLastCheckedAt': null,
          'dreaminaTaskLastRaw': {},
          'dreaminaTaskRecovering': ![]
        }), Object["assign"](_0x25bcf5, {
          ...this['_buildRunningHubTaskPatch']({
            'taskId': '',
            'status': 'idle',
            'startedAt': 0x0,
            'recovering': ![],
            'useOpenapiQuery': ![]
          }),
          ...this["_buildAsyncTaskPatch"]({
            'provider': '',
            'kind': "video",
            'taskId': '',
            'status': 'idle',
            'startedAt': 0x0,
            'recovering': ![]
          })
        }));
        _0x16d247 && (Object['assign'](_0x25bcf5, {
          'rhTaskId': '',
          'rhTaskStatus': "pending",
          'rhTaskStartedAt': _0x235374,
          'rhTaskRecovering': ![],
          'rhTaskUseOpenapiQuery': ![]
        }), Object["assign"](_0x25bcf5, {
          'dreaminaSubmitId': '',
          'dreaminaTaskStatus': "idle",
          'dreaminaTaskPhase': 'done',
          'dreaminaTaskLabel': '',
          'dreaminaTaskStartedAt': 0x0,
          'dreaminaTaskLastCheckedAt': null,
          'dreaminaTaskLastRaw': {},
          'dreaminaTaskRecovering': ![],
          ...this['_buildAsyncTaskPatch']({
            'provider': '',
            'kind': 'video',
            'taskId': '',
            'status': "idle",
            'startedAt': 0x0,
            'recovering': ![]
          })
        }));
        _0x20abb7 && (Object['assign'](_0x25bcf5, this['_buildAsyncTaskPatch']({
          'provider': _0x46d1d1,
          'kind': 'video',
          'taskId': '',
          'status': "pending",
          'startedAt': _0x235374,
          'recovering': ![]
        })), Object["assign"](_0x25bcf5, {
          ...this['_buildRunningHubTaskPatch']({
            'taskId': '',
            'status': "idle",
            'startedAt': 0x0,
            'recovering': ![],
            'useOpenapiQuery': ![]
          }),
          'dreaminaSubmitId': '',
          'dreaminaTaskStatus': 'idle',
          'dreaminaTaskPhase': "done",
          'dreaminaTaskLabel': '',
          'dreaminaTaskStartedAt': 0x0,
          'dreaminaTaskLastCheckedAt': null,
          'dreaminaTaskLastRaw': {},
          'dreaminaTaskRecovering': ![]
        }));
        try {
          const _0x1a468f = await submitTask(createGenerationSubmitPlan({
            'kind': 'video',
            'sourceNodeId': this["nodeId"],
            'targetNodeId': this['nodeId'],
            'trigger': "node",
            'taskType': 'video-generation',
            'provider': _0x1f96d5["provider"] || _0x46d1d1 || this['_data']?.["provider"] || '',
            'adapterType': _0x16d247 ? 'workflow' : "modelApi",
            'modelId': _0x1f96d5['model'] || this["_data"]?.["model"] || '',
            'payload': _0x1f96d5,
            'cancellable': _0x16d247,
            'resumable': _0x3bf21b || _0x16d247 || _0x20abb7,
            'pauseOnAbort': _0x3bf21b || _0x16d247 || _0x20abb7 ? "afterTaskId" : ![],
            'async': _0x20abb7,
            'startBuilder': () => _0x25bcf5,
            'onTaskStart': () => {
              _0x507473["markTaskStarted"]();
              this["_syncLocalTaskNodeData"]();
              if (_0x3bf21b) {
                this['_persistDreaminaResumeCache']();
              }
              if (_0x16d247) {
                this['_persistRunningHubResumeCache']();
              }
              if (_0x20abb7) {
                this['_persistAsyncResumeCache']();
              }
            },
            'submit': async (_0x39ffe0, _0x2cdaf4 = {}) => _0x4d33ed["generateVideo"](_0x1f96d5, {
              ...(_0x2cdaf4['signal'] ? {
                'signal': _0x2cdaf4["signal"]
              } : {}),
              'runningHubWorkflowQueueLease': _0x2cdaf4["runningHubWorkflowQueueLease"],
              ...(_0x3bf21b ? {
                'maxWaitMs': _0x2a60ca
              } : {}),
              'onTaskMeta': ({
                taskId: _0x185866,
                useOpenapiQuery: _0xf841ba,
                provider: _0x3d9295
              }) => {
                if (_0x5b602a !== this["_rhGenToken"]) {
                  return;
                }
                const _0x379358 = String(_0x185866 || '')["trim"]();
                if (!_0x379358) {
                  return;
                }
                if (_0x16d247) {
                  this["_rhTaskId"] = _0x379358;
                  _0x2cdaf4["onTaskId"]?.(_0x379358);
                  _0x50e78d(_0x2cdaf4, this["nodeId"], {
                    'rhStatusMessage': null,
                    'rhStatusCode': null,
                    'rhTaskUseOpenapiQuery': _0xf841ba === !![]
                  });
                  !_0x2cdaf4["isBackgroundTask"]?.() && (this["_syncLocalTaskNodeData"](), this["_persistRunningHubResumeCache"]());
                  return;
                }
                if (_0x3bf21b) {
                  this["_dreaminaActiveSubmitId"] = _0x379358;
                  const _0xc13587 = this["_buildDreaminaPendingSnapshot"]({
                    'submitId': _0x379358,
                    'phase': "generating",
                    'label': videoTaskText('task.generating')
                  });
                  _0x2cdaf4['isBackgroundTask']?.() ? _0x50e78d(_0x2cdaf4, this['nodeId'], this['_buildDreaminaTaskPatch'](_0xc13587, {
                    'recovering': ![],
                    'startedAt': _0x235374
                  })) : this["_applyDreaminaTaskSnapshot"](_0xc13587, {
                    'recovering': ![],
                    'startedAt': _0x235374
                  });
                  _0x2cdaf4["onTaskId"]?.(_0x379358);
                  return;
                }
                _0x20abb7 && (_0x2cdaf4["onTaskId"]?.(_0x379358), _0x50e78d(_0x2cdaf4, this["nodeId"], {
                  'asyncTaskProvider': String(_0x3d9295 || _0x46d1d1 || this['_data']?.["provider"] || '')['trim']()["toLowerCase"](),
                  'asyncTaskKind': "video"
                }), !_0x2cdaf4["isBackgroundTask"]?.() && (this["_syncLocalTaskNodeData"](), this["_persistAsyncResumeCache"]()));
              },
              'onTaskId': _0x39102e => {
                if (_0x5b602a !== this["_rhGenToken"]) {
                  return;
                }
                const _0x70bdc0 = String(_0x39102e || '')["trim"]();
                if (!_0x70bdc0) {
                  return;
                }
                if (_0x3bf21b) {
                  this['_dreaminaActiveSubmitId'] = _0x70bdc0;
                  const _0x46b62f = this["_buildDreaminaPendingSnapshot"]({
                    'submitId': _0x70bdc0,
                    'phase': "generating",
                    'label': videoTaskText('task.generating')
                  });
                  _0x2cdaf4["isBackgroundTask"]?.() ? _0x50e78d(_0x2cdaf4, this['nodeId'], this["_buildDreaminaTaskPatch"](_0x46b62f, {
                    'recovering': ![],
                    'startedAt': _0x235374
                  })) : this["_applyDreaminaTaskSnapshot"](_0x46b62f, {
                    'recovering': ![],
                    'startedAt': _0x235374
                  });
                  _0x2cdaf4['onTaskId']?.(_0x70bdc0);
                  return;
                }
                if (_0x16d247) {
                  this["_rhTaskId"] = _0x70bdc0;
                  _0x2cdaf4["onTaskId"]?.(_0x70bdc0);
                  const _0x241e97 = _0x40285a(_0x2cdaf4, this["nodeId"]);
                  _0x50e78d(_0x2cdaf4, this["nodeId"], {
                    'rhStatusMessage': null,
                    'rhStatusCode': null,
                    'rhTaskUseOpenapiQuery': _0x241e97?.["rhTaskUseOpenapiQuery"] === !![]
                  });
                  !_0x2cdaf4["isBackgroundTask"]?.() && (this["_syncLocalTaskNodeData"](), this["_persistRunningHubResumeCache"]());
                  const _0x11c627 = this['_rhApiKey'] || '';
                  this["_rhCancelRequested"] && !this["_rhRemoteCancelSent"] && _0x11c627 && _0x70bdc0 && (this["_rhRemoteCancelSent"] = !![], (async () => {
                    if (_0x5b602a !== this["_rhGenToken"]) {
                      return;
                    }
                    const _0x96dda8 = ({
                      remoteResult: _0x51ea33,
                      remoteError: _0x1217ac
                    }) => {
                      const _0x493fde = Number(_0x51ea33?.["code"]);
                      const _0x42d0c5 = _0x1217ac ? _0x1217ac["message"] || videoTaskText("cancel.failed") : _0x493fde === 0x0 ? videoTaskText("cancel.success") : _0x493fde === 0x327 ? videoTaskText("cancel.taskNotFound") : _0x51ea33?.["msg"] || videoTaskText("cancel.failed");
                      return {
                        'rhStatusMessage': _0x42d0c5,
                        'rhStatusCode': Number["isFinite"](_0x493fde) ? _0x493fde : null,
                        'videos': [],
                        'videoUrl': '',
                        'localPath': '',
                        ...this["_buildRunningHubTaskPatch"]({
                          'taskId': _0x70bdc0,
                          'status': "cancelled",
                          'startedAt': _0x235374,
                          'recovering': ![],
                          'useOpenapiQuery': _0x83e6cc["getState"]()["nodes"]?.[this["nodeId"]]?.["rhTaskUseOpenapiQuery"] === !![]
                        })
                      };
                    };
                    await cancelTask(this["nodeId"], {
                      'store': _0x83e6cc,
                      'taskId': _0x70bdc0,
                      'cancellable': !![],
                      'cancel': ({
                        taskId: _0x36f9fc
                      }) => _0x4d33ed['cancelRunningHubWorkflowTask']({
                        'apiKey': _0x11c627,
                        'taskId': _0x36f9fc,
                        'providerProfileId': _0x1f96d5?.["providerProfileId"] || _0x1f96d5?.["rhProviderProfileId"] || ''
                      }),
                      'cancelledBuilder': _0x96dda8,
                      'spec': createGenerationCancelPlanFromNode({
                        'kind': "video",
                        'node': _0x83e6cc['getState']()["nodes"]?.[this['nodeId']] || {},
                        'taskProtocol': 'workflow',
                        'sourceNodeId': this["nodeId"],
                        'targetNodeId': this["nodeId"],
                        'trigger': "node",
                        'taskType': 'video-generation',
                        'payload': _0x1f96d5,
                        'taskId': _0x70bdc0,
                        'cancellable': !![],
                        'resumable': !![],
                        'cancelledBuilder': _0x96dda8
                      })
                    });
                    if (_0x5b602a !== this['_rhGenToken']) {
                      return;
                    }
                    this['_persistRunningHubResumeCache']();
                  })());
                  return;
                }
                if (_0x20abb7) {
                  const _0x63baa3 = _0x40285a(_0x2cdaf4, this["nodeId"]);
                  _0x2cdaf4["onTaskId"]?.(_0x70bdc0);
                  _0x50e78d(_0x2cdaf4, this["nodeId"], {
                    'asyncTaskProvider': String(_0x63baa3?.["asyncTaskProvider"] || _0x46d1d1 || this["_data"]?.['provider'] || '')['trim']()["toLowerCase"](),
                    'asyncTaskKind': 'video'
                  });
                  !_0x2cdaf4["isBackgroundTask"]?.() && (this["_syncLocalTaskNodeData"](), this["_persistAsyncResumeCache"]());
                }
              },
              'onProgress': _0x3bf21b ? async _0x3660d5 => {
                if (_0x5b602a !== this['_rhGenToken']) {
                  return;
                }
                _0x2cdaf4["isBackgroundTask"]?.() ? _0x50e78d(_0x2cdaf4, this["nodeId"], this["_buildDreaminaTaskPatch"](_0x3660d5, {
                  'recovering': ![],
                  'startedAt': _0x235374
                })) : this["_applyDreaminaTaskSnapshot"](_0x3660d5, {
                  'recovering': ![],
                  'startedAt': _0x235374
                });
              } : undefined
            }),
            'cancel': _0x16d247 ? async ({
              taskId: _0x53f462
            }) => {
              const _0x553214 = this["_rhApiKey"] || _0x1f96d5["apiKey"] || '';
              const _0x10e1d8 = String(_0x53f462 || '')["trim"]();
              if (!_0x553214 || !_0x10e1d8) {
                return null;
              }
              return _0x4d33ed["cancelRunningHubWorkflowTask"]({
                'apiKey': _0x553214,
                'taskId': _0x10e1d8,
                'providerProfileId': _0x1f96d5?.["providerProfileId"] || _0x1f96d5?.["rhProviderProfileId"] || ''
              });
            } : undefined,
            'resultBuilder': (_0x31769e, _0x463eaa) => {
              const _0x5a6eec = this["_applyDreaminaSuccessResult"](_0x31769e, _0x463eaa["startedAt"], null, {
                'writeStore': ![],
                'returnPatch': !![]
              });
              const _0x1bdb19 = {
                ...(_0x5a6eec?.["patch"] || {})
              };
              if (_0x16d247) {
                const _0x190568 = _0x463eaa['getTaskNode']?.() || {};
                Object["assign"](_0x1bdb19, {
                  'rhStatusMessage': null,
                  'rhStatusCode': null
                }, this['_buildRunningHubTaskPatch']({
                  'taskId': String(this["_rhTaskId"] || '')["trim"]() || String(_0x190568?.['rhTaskId'] || '')["trim"](),
                  'status': "success",
                  'startedAt': _0x463eaa["startedAt"],
                  'recovering': ![],
                  'useOpenapiQuery': _0x190568?.["rhTaskUseOpenapiQuery"] === !![]
                }));
              } else {
                if (_0x20abb7) {
                  const _0x538b1b = _0x463eaa['getTaskNode']?.() || {};
                  Object["assign"](_0x1bdb19, this["_buildAsyncTaskPatch"]({
                    'provider': String(_0x538b1b?.['asyncTaskProvider'] || _0x46d1d1 || '')["trim"](),
                    'kind': 'video',
                    'taskId': String(_0x538b1b?.["asyncTaskId"] || '')['trim'](),
                    'status': "success",
                    'startedAt': _0x463eaa['startedAt'],
                    'recovering': ![]
                  }));
                }
              }
              return _0x1bdb19;
            },
            'failureBuilder': (_0x1addf6, _0x12cc58) => {
              const _0x3c1738 = _0x1addf6?.["message"] || videoTaskText('task.generationFailed');
              if (_0x3bf21b && this["_isDreaminaPollTimeoutError"](_0x1addf6)) {
                const _0x360f7e = _0x12cc58["getTaskNode"]?.() || {};
                const _0x2c9a71 = String(_0x360f7e?.["dreaminaSubmitId"] || '')["trim"]();
                const _0x449f97 = this["_buildDreaminaBackgroundPendingSnapshot"](_0x2c9a71);
                return Object["assign"]({
                  'isGenerating': !![],
                  'jobStatus': "running",
                  'jobError': null,
                  'generationDuration': Date["now"]() - _0x12cc58["startedAt"]
                }, this["_buildDreaminaTaskPatch"](_0x449f97, {
                  'recovering': ![],
                  'startedAt': Number(_0x360f7e?.["dreaminaTaskStartedAt"] || _0x360f7e?.["generationStartTime"] || _0x12cc58["startedAt"])
                }));
              }
              const _0x431090 = String(_0x1addf6?.["code"] || '') === "SUBSCRIPTION_REQUIRED" ? {} : buildVideoGenerationFailurePatch({
                'error': _0x3c1738,
                'startedAt': _0x12cc58['startedAt'],
                'duration': Date["now"]() - _0x12cc58['startedAt']
              });
              if (_0x3bf21b) {
                const _0x2e7a81 = _0x12cc58['getTaskNode']?.() || {};
                const _0x2baf3f = this["_buildDreaminaFailedSnapshot"](_0x2e7a81?.["dreaminaSubmitId"] || '', _0x3c1738);
                Object["assign"](_0x431090, this["_buildDreaminaTaskPatch"](_0x2baf3f, {
                  'recovering': ![],
                  'startedAt': _0x12cc58["startedAt"]
                }));
                this["_emitDreaminaTaskCenterUpdate"](_0x2baf3f, {
                  'status': "failed",
                  'error': _0x3c1738,
                  'startedAt': _0x12cc58["startedAt"]
                });
              }
              if (_0x16d247) {
                const _0x5f4f39 = _0x12cc58["getTaskNode"]?.() || {};
                Object["assign"](_0x431090, {
                  'rhStatusMessage': _0x3c1738,
                  'rhStatusCode': Number["isFinite"](Number(_0x1addf6?.["code"])) ? Number(_0x1addf6["code"]) : null
                }, this["_buildRunningHubTaskPatch"]({
                  'taskId': String(this["_rhTaskId"] || '')["trim"]() || String(_0x5f4f39?.["rhTaskId"] || '')["trim"](),
                  'status': "failed",
                  'startedAt': _0x12cc58["startedAt"],
                  'recovering': ![],
                  'useOpenapiQuery': _0x5f4f39?.["rhTaskUseOpenapiQuery"] === !![]
                }));
              }
              if (_0x20abb7) {
                const _0x438a47 = _0x12cc58["getTaskNode"]?.() || {};
                Object["assign"](_0x431090, this["_buildAsyncTaskPatch"]({
                  'provider': String(_0x438a47?.["asyncTaskProvider"] || _0x46d1d1 || '')["trim"](),
                  'kind': "video",
                  'taskId': String(_0x438a47?.["asyncTaskId"] || '')["trim"](),
                  'status': "failed",
                  'startedAt': _0x12cc58["startedAt"],
                  'recovering': ![]
                }));
              }
              return _0x431090;
            },
            'cancelledBuilder': _0x28d045 => {
              const _0x4d6667 = _0x28d045["getTaskNode"]?.() || {};
              return {
                'videos': [],
                'videoUrl': '',
                'localPath': '',
                'generationDuration': Date["now"]() - _0x28d045["startedAt"],
                ...(_0x16d247 ? {
                  'rhStatusMessage': videoTaskText("task.generationCancelled"),
                  'rhStatusCode': null,
                  ...this["_buildRunningHubTaskPatch"]({
                    'taskId': String(this["_rhTaskId"] || '')["trim"]() || String(_0x4d6667?.["rhTaskId"] || '')['trim'](),
                    'status': "cancelled",
                    'startedAt': _0x28d045["startedAt"],
                    'recovering': ![],
                    'useOpenapiQuery': _0x4d6667?.["rhTaskUseOpenapiQuery"] === !![]
                  })
                } : {})
              };
            },
            'parseError': _0x300b4c => getGenerationErrorMessage(_0x300b4c, videoTaskText("task.generationFailed"))
          }), {
            'store': _0x83e6cc,
            'startedAt': _0x235374,
            'abortController': this["_rhAbortController"]
          });
          if (_0x1a468f["status"] === 'pending') {
            return _0x1a468f;
          }
          if (_0x1a468f["status"] === "success") {
            const _0x5bec98 = normalizeVideoGenerationResult(_0x1a468f["result"])['items'];
            this["_finalizeVideoSuccessSideEffects"](_0x5bec98, _0x235374);
            if (_0x3bf21b) {
              this["_persistDreaminaResumeCache"]();
            }
            if (_0x16d247) {
              this['_persistRunningHubResumeCache']();
            }
            if (_0x20abb7) {
              this["_persistAsyncResumeCache"]();
            }
            return _0x1a468f;
          }
          const _0x3a199e = _0x1a468f["error"];
          if (_0x1a468f["status"] === 'failed' && String(_0x3a199e?.["code"] || '') === "SUBSCRIPTION_REQUIRED") {
            const _0x4fe685 = String(_0x3a199e?.["requiredModelId"] || '')["trim"]();
            const _0x32bdd7 = _0x4fe685 || this["_data"]?.['model'] || '';
            const _0x30d202 = String(this['_data']?.["provider"] || '')['trim']();
            const _0x5c567c = window["handleSubscriptionRequired"];
            if (typeof _0x5c567c === "function") {
              await _0x5c567c({
                'modelId': _0x32bdd7,
                'provider': _0x30d202,
                'error': _0x3a199e
              });
            } else {
              if (typeof window["openSubscriptionDialog"] === 'function') {
                const _0x29be9b = window["getSubscriptionState"]?.() || {};
                String(_0x29be9b["status"] || '')['toLowerCase']() !== "active" ? window["openSubscriptionDialog"]({
                  'modelId': _0x32bdd7,
                  'provider': _0x30d202
                }) : window['showToast']?.(_0x3a199e?.["message"] || videoTaskText("toasts.subscriptionSyncing"), "warning");
              }
            }
            return _0x1a468f;
          }
          if (_0x1a468f["status"] === 'failed' && _0x3bf21b && this["_isDreaminaPollTimeoutError"](_0x3a199e)) {
            this["_persistDreaminaResumeCache"]();
            this["_showDreaminaBackgroundQueueingToast"](_0x83e6cc["getState"]()["nodes"]?.[this["nodeId"]]?.["dreaminaSubmitId"] || '');
            return _0x1a468f;
          }
          if (_0x1a468f['status'] === "failed") {
            const _0x4a5b90 = _0x3a199e?.["message"] || '';
            const _0x2aff32 = showRunningHubMediaUploadGuideForError(_0x3a199e);
            const _0x5c81aa = !_0x2aff32 && showProviderApiKeyMissingToastForError(_0x3a199e, {
              'providerId': _0x1f96d5?.["provider"],
              'model': _0x1f96d5?.["model"],
              'adapterType': _0x565ec6 ? 'modelApi' : _0x1f96d5?.["adapterType"]
            });
            void logDiagnosticEvent({
              'type': "generation.video_failed",
              'level': "error",
              'source': 'renderer',
              'message': _0x4a5b90 || videoTaskText('task.videoGenerationFailed'),
              'error': _0x3a199e,
              'context': {
                'nodeId': this["nodeId"],
                'provider': _0x1f96d5?.["provider"] || '',
                'model': _0x1f96d5?.["model"] || '',
                'providerProfileId': _0x1f96d5?.["providerProfileId"] || _0x1f96d5?.['rhProviderProfileId'] || '',
                'isDreamina': _0x3bf21b,
                'isRhWorkflow': _0x16d247,
                'isAsyncTaskModel': _0x20abb7
              }
            });
            !_0x2aff32 && !_0x5c81aa && window["showToast"]?.(_0x4a5b90, "error", isDreaminaUploadDurationErrorMessage(_0x4a5b90) ? DREAMINA_UPLOAD_DURATION_ERROR_TOAST_MS : undefined);
            if (_0x3bf21b) {
              this["_persistDreaminaResumeCache"]();
            }
            if (_0x16d247) {
              this['_persistRunningHubResumeCache']();
            }
            if (_0x20abb7) {
              this["_persistAsyncResumeCache"]();
            }
            return _0x1a468f;
          }
          return _0x1a468f;
        } catch (_0x363454) {
          if (_0x16d247 && (this["_rhCancelRequested"] || isGenerationAbortError(_0x363454))) {
            return;
          }
          if (String(_0x363454?.['code'] || '') === "SUBSCRIPTION_REQUIRED") {
            const _0x58009c = String(_0x363454?.["requiredModelId"] || '')['trim']();
            const _0x547d9f = _0x58009c || this['_data']?.["model"] || '';
            const _0x122b27 = String(this["_data"]?.['provider'] || '')["trim"]();
            const _0x34b9dd = window["handleSubscriptionRequired"];
            if (typeof _0x34b9dd === "function") {
              await _0x34b9dd({
                'modelId': _0x547d9f,
                'provider': _0x122b27,
                'error': _0x363454
              });
            } else {
              if (typeof window["openSubscriptionDialog"] === 'function') {
                const _0x417145 = window["getSubscriptionState"]?.() || {};
                String(_0x417145["status"] || '')["toLowerCase"]() !== "active" ? window["openSubscriptionDialog"]({
                  'modelId': _0x547d9f,
                  'provider': _0x122b27
                }) : window['showToast']?.(_0x363454?.['message'] || videoTaskText("toasts.subscriptionSyncing"), "warning");
              }
            }
            return;
          }
          if (_0x3bf21b && this["_isDreaminaPollTimeoutError"](_0x363454)) {
            const _0x2c5c7f = _0x83e6cc['getState']()["nodes"]?.[this['nodeId']] || {};
            const _0x1044aa = String(_0x2c5c7f?.["dreaminaSubmitId"] || '')["trim"]();
            const _0x17c2ce = this["_buildDreaminaBackgroundPendingSnapshot"](_0x1044aa);
            _0x83e6cc['updateNodeData'](this["nodeId"], Object["assign"]({
              'isGenerating': !![],
              'jobStatus': "running",
              'jobError': null,
              'generationDuration': Date["now"]() - _0x235374
            }, this["_buildDreaminaTaskPatch"](_0x17c2ce, {
              'recovering': ![],
              'startedAt': Number(_0x2c5c7f?.['dreaminaTaskStartedAt'] || _0x2c5c7f?.["generationStartTime"] || _0x235374)
            })));
            this['_persistDreaminaResumeCache']();
            this["_showDreaminaBackgroundQueueingToast"](_0x1044aa);
            return;
          }
          const _0x52d38a = _0x363454?.["message"] || '';
          const _0x25963b = showRunningHubMediaUploadGuideForError(_0x363454);
          const _0x18f439 = !_0x25963b && showProviderApiKeyMissingToastForError(_0x363454, {
            'providerId': _0x1f96d5?.["provider"],
            'model': _0x1f96d5?.["model"],
            'adapterType': _0x565ec6 ? 'modelApi' : _0x1f96d5?.["adapterType"]
          });
          void logDiagnosticEvent({
            'type': 'generation.video_failed',
            'level': "error",
            'source': "renderer",
            'message': _0x52d38a || videoTaskText("task.videoGenerationFailed"),
            'error': _0x363454,
            'context': {
              'nodeId': this['nodeId'],
              'provider': _0x1f96d5?.['provider'] || '',
              'model': _0x1f96d5?.["model"] || '',
              'providerProfileId': _0x1f96d5?.["providerProfileId"] || _0x1f96d5?.['rhProviderProfileId'] || '',
              'isDreamina': _0x3bf21b,
              'isRhWorkflow': _0x16d247,
              'isAsyncTaskModel': _0x20abb7
            }
          });
          !_0x25963b && !_0x18f439 && window["showToast"]?.(_0x52d38a, 'error', isDreaminaUploadDurationErrorMessage(_0x52d38a) ? DREAMINA_UPLOAD_DURATION_ERROR_TOAST_MS : undefined);
          const _0x5a9fab = buildVideoGenerationFailurePatch({
            'error': _0x52d38a || videoTaskText('task.generationFailed'),
            'startedAt': _0x235374,
            'duration': Date['now']() - _0x235374
          });
          _0x3bf21b && Object["assign"](_0x5a9fab, this['_buildDreaminaTaskPatch'](this["_buildDreaminaFailedSnapshot"](_0x83e6cc["getState"]()["nodes"]?.[this["nodeId"]]?.["dreaminaSubmitId"] || '', _0x363454?.["message"] || videoTaskText("task.generationFailed")), {
            'recovering': ![],
            'startedAt': _0x235374
          }));
          _0x16d247 && Object["assign"](_0x5a9fab, {
            'rhStatusMessage': _0x363454?.["message"] || videoTaskText("task.generationFailed"),
            'rhStatusCode': Number["isFinite"](Number(_0x363454?.['code'])) ? Number(_0x363454['code']) : null
          }, this["_buildRunningHubTaskPatch"]({
            'taskId': String(this["_rhTaskId"] || '')['trim']() || String(_0x83e6cc["getState"]()["nodes"]?.[this["nodeId"]]?.["rhTaskId"] || '')["trim"](),
            'status': "failed",
            'startedAt': _0x235374,
            'recovering': ![],
            'useOpenapiQuery': _0x83e6cc["getState"]()['nodes']?.[this["nodeId"]]?.["rhTaskUseOpenapiQuery"] === !![]
          }));
          if (_0x20abb7) {
            const _0xe3e59f = _0x83e6cc["getState"]()["nodes"]?.[this["nodeId"]] || {};
            Object["assign"](_0x5a9fab, this["_buildAsyncTaskPatch"]({
              'provider': String(_0xe3e59f?.["asyncTaskProvider"] || _0x46d1d1 || '')["trim"](),
              'kind': "video",
              'taskId': String(_0xe3e59f?.['asyncTaskId'] || '')["trim"](),
              'status': 'failed',
              'startedAt': _0x235374,
              'recovering': ![]
            }));
          }
          _0x3bf21b && this["_emitDreaminaTaskCenterUpdate"]({
            'submitId': _0x5a9fab["dreaminaSubmitId"],
            'status': _0x5a9fab["dreaminaTaskStatus"],
            'phase': _0x5a9fab['dreaminaTaskPhase'],
            'label': _0x5a9fab["dreaminaTaskLabel"],
            'failReason': _0x52d38a
          }, {
            'status': "failed",
            'error': _0x52d38a,
            'startedAt': _0x235374
          });
          _0x83e6cc["updateNodeData"](this["nodeId"], _0x5a9fab);
          if (_0x3bf21b) {
            this["_persistDreaminaResumeCache"]();
          }
          if (_0x16d247) {
            this["_persistRunningHubResumeCache"]();
          }
          if (_0x20abb7) {
            this['_persistAsyncResumeCache']();
          }
        } finally {
          const _0x54366d = this["_syncLocalTaskNodeData"]();
          const _0x278508 = shouldShowGenerationBusyUi(_0x54366d);
          this["_isGenerating"] = _0x278508;
          _0x3bf21b && !_0x278508 && (this['_dreaminaActiveSubmitId'] = '');
          this["_rhAbortController"] = null;
          if (_0x16d247 && _0x278508) {
            const _0x20c066 = String(_0x54366d?.['rhTaskId'] || '')["trim"]();
            if (_0x20c066) {
              this['_rhTaskId'] = _0x20c066;
            }
          } else {
            this["_rhTaskId"] = null;
            if (!this['_rhCancelRequested']) {
              this["_rhApiKey"] = null;
            }
          }
          _0x278508 ? this["_updateSubmitButtonState"]?.() : (this["_resetGenerateButtonIdleUi"]({
            'cancellable': _0x16d247
          }), _0x32c4ac(this["previewEl"]), this["_updateSubmitButtonState"]?.());
        }
      } finally {
        _0x507473["restoreBeforeTaskStart"]();
        releasePayloadObjectUrlLease(_0x2e879d);
        this['_videoSubmitInFlight'] = ![];
      }
    }
    async ["_buildPayloadImpl"](_0x53d9b4 = null, _0xbf6389 = {}) {
      const _0x3dffef = createPayloadObjectUrlLease({
        'ownerId': "ai-video:" + this["nodeId"] + ":payload",
        'kind': 'image'
      });
      try {
        const _0x5b29b6 = _0x83e6cc["getState"]?.() || {};
        const _0x588200 = _0x5b29b6["nodes"]?.[this["nodeId"]];
        _0x588200 && typeof _0x588200 === "object" && (this["_data"] = _0x588200);
        let _0x2055f2 = _0x83e6cc["getIncomingEdges"](this["nodeId"]);
        shouldScopeRunningHubVideoSubmitEdges(this["_data"] || {}) && (_0x2055f2 = _0x2055f2['filter'](_0x5b281f => _0x5b281f?.['targetId'] === this["nodeId"]));
        const _0x2f0be6 = _0x5b29b6["nodes"] || {};
        let _0x28bf0c = [];
        let _0x490edc = [];
        const _0x579208 = [];
        for (const _0x3dc2a9 of _0x2055f2) {
          const _0x3ccf15 = _0x2f0be6[_0x3dc2a9["sourceId"]];
          const _0x544055 = String(_0x3ccf15?.["type"] || '')["toLowerCase"]();
          const _0x1b198b = _0x544055 === "source-image" || _0x544055 === "image" || _0x544055 === "ai-image";
          let _0x5899db = '';
          _0x1b198b && (_0x5899db = resolveGenerationInputImageUrl(_0x3ccf15));
          let _0x581b38 = _0x1b198b ? _0x5899db : _0x3ccf15?.["videoUrl"] || _0x3ccf15?.['imageUrl'] || '';
          if (String(_0x3ccf15?.["type"] || '') === "ai-video") {
            const _0x4d2432 = String(_0x3dc2a9?.["sourceMediaKey"] || '')['trim']();
            if (_0x4d2432) {
              const _0xafd317 = Array["isArray"](_0x3ccf15?.["videos"]) ? _0x3ccf15["videos"] : [];
              const _0x32f9c7 = _0xafd317["find"](_0x52c8aa => {
                const _0x5d2f8f = String(_0x52c8aa?.["localPath"] || '')["trim"]() || String(_0x52c8aa?.['videoUrl'] || '')["trim"]();
                return _0x5d2f8f === _0x4d2432;
              });
              _0x32f9c7 && (_0x581b38 = localPathToUrl(_0x32f9c7["localPath"]) || String(_0x32f9c7['videoUrl'] || '')["trim"]() || _0x581b38);
            }
          }
          if (!_0x581b38 && _0x2f0be6[_0x3dc2a9["sourceId"]]?.['sourceId']) {
            const _0x4d0cf5 = await _0x146aa6(_0x2f0be6[_0x3dc2a9["sourceId"]]["sourceId"]);
            _0x4d0cf5 && (_0x581b38 = _0x3dffef["create"](_0x4d0cf5, {
              'sourceUrl': _0x2f0be6[_0x3dc2a9['sourceId']]["sourceId"]
            }));
          }
          if (_0x581b38 && !_0x28bf0c["includes"](_0x581b38)) {
            _0x28bf0c["push"](_0x581b38);
          }
          if (_0x581b38) {
            _0x579208['push']({
              'type': resolveEffectiveInputKind(_0x3ccf15, _0x3dc2a9),
              'url': _0x581b38
            });
          }
          if (_0x1b198b) {
            const _0x25e1ff = String(_0x5899db || _0x581b38 || '')["trim"]();
            _0x25e1ff && !_0x25e1ff['startsWith']("blob:") && !_0x490edc['includes'](_0x25e1ff) && _0x490edc['push'](_0x25e1ff);
          }
        }
        const _0x49c3c0 = [];
        const _0xbb74d7 = createPromptMediaReferenceState(_0x579208);
        const _0x5d116b = resolvePresetPromptTextWithTextRefs({
          'template': _0x53d9b4,
          'promptEl': this["promptEl"],
          'inEdges': _0x2055f2,
          'nodes': _0x2f0be6,
          'assetInputRefs': _0x49c3c0,
          'assetMediaCounts': _0xbb74d7['mediaCounts'],
          'assetDedupeState': _0xbb74d7["dedupeState"],
          'dedupeAssetMentions': !![],
          'allowedAssetTypes': ["text", "image", "video", "audio"]
        });
        const _0x3374f5 = this["_data"]['model'] || getDefaultRunningHubVideoWorkflowModelId();
        const _0x287022 = isDreaminaStyleVideoModel(_0x3374f5, this['_data']["provider"]) ? resolveDreaminaStyleVideoProvider(_0x3374f5, this['_data']["provider"]) : '';
        const _0x3e24a4 = this["_data"]["provider"] || _0x287022 || resolveModelProvider(_0x3374f5) || "grsai";
        const _0x3667b5 = isRunningHubWorkflowNode({
          ...this['_data'],
          'model': _0x3374f5,
          'provider': _0x3e24a4
        });
        if (_0x3667b5) {
          const _0x2b3697 = _0x2f0be6?.[this["nodeId"]] || this['_data'] || {};
          _0x49c3c0["push"](...getPromptAssetInputRefsFromNode(_0x2b3697, {
            'allowedTypes': ["image", 'video', "audio"]
          }));
        }
        for (const _0x1ca787 of _0x49c3c0) {
          if (_0x1ca787["url"] && !_0x28bf0c["includes"](_0x1ca787["url"])) {
            _0x28bf0c["push"](_0x1ca787["url"]);
          }
          _0x1ca787['type'] === 'image' && _0x1ca787["url"] && !_0x490edc["includes"](_0x1ca787["url"]) && _0x490edc["push"](_0x1ca787["url"]);
        }
        const _0x4a7211 = isDreaminaStyleVideoModel(_0x3374f5, _0x3e24a4);
        const _0x22abfe = _0x4a7211 ? _0x490edc["slice"](0x0, 0x1) : _0x28bf0c;
        const _0x3d36f7 = resolveModelExecution(_0x3374f5, {
          'providerHint': _0x3e24a4
        }) || resolveModelExecution(_0x3374f5);
        const _0x301478 = _0x3d36f7?.['modelManifest']?.["adapterType"] === 'modelApi' && _0x3d36f7?.["modelManifest"]?.["kind"] === "video" && _0x3d36f7?.["executionManifest"]?.["adapterType"] === 'modelApi';
        const _0x1cd006 = this["_isRunninghubWorkflowModel"](_0x3374f5, _0x3e24a4) || _0x3667b5;
        if (_0x301478) {
          const _0x49940a = validateModelApiVideoPrompt({
            'model': _0x3374f5,
            'provider': _0x3e24a4,
            'prompt': _0x5d116b
          });
          if (!_0x49940a['ok']) {
            window["showToast"]?.(_0x49940a['message'], "warn");
            return null;
          }
        }
        const _0x42ff9c = evaluateGenerationPromptBoundary({
          'model': _0x3374f5,
          'provider': _0x3e24a4,
          'promptText': _0x5d116b,
          'hasInput': ![]
        });
        if (!_0x42ff9c['ok']) {
          return null;
        }
        const _0x4b1e70 = this['_data']["resolution"] || "1080p";
        const _0x4628a0 = _0x1cd006 ? normalizeRunningHubInstanceType(resolveVideoWorkflowSchemaParam(this["_data"], _0x3374f5, "rhInstanceType")) : this["_data"]["rhInstanceType"];
        const _0x3f4147 = String(_0x2f0be6?.[this["nodeId"]]?.["providerProfileId"] || _0x2f0be6?.[this["nodeId"]]?.["rhProviderProfileId"] || this["_data"]?.["providerProfileId"] || this["_data"]?.["rhProviderProfileId"] || '')["trim"]();
        const _0x177c74 = resolveModelGenerationProviderProfileId(_0x3374f5, _0x3e24a4, _0x3f4147);
        await _0x20de72();
        const _0x261c0a = _0x3104b9(_0x177c74 || _0x3e24a4);
        let _0x5b88ed = '';
        if (_0x3e24a4 === 'runninghub') {
          _0x5b88ed = isModelApiModel(_0x3374f5, _0x3e24a4) ? _0x261c0a["modelApiKey"] || '' : _0x261c0a["apiKey"] || '';
        } else {
          _0x3e24a4 === "runninghubwf" ? _0x5b88ed = _0x261c0a["apiKey"] || '' : _0x5b88ed = _0x261c0a["apiKey"] || '';
        }
        const _0x5542ff = getPlainObject(this["_data"]["generationParams"]);
        const _0x4360c9 = (_0x3e198d, _0x13900a) => Object["prototype"]["hasOwnProperty"]["call"](_0x5542ff, _0x3e198d) ? _0x5542ff[_0x3e198d] : _0x13900a;
        const _0x4d29f2 = {
          'prompt': _0x5d116b,
          'model': _0x3374f5,
          'generationParams': {
            ..._0x5542ff
          },
          'aspectRatio': _0x4360c9("aspectRatio", this["_data"]['aspectRatio'] || "1:1"),
          'resolution': _0x4360c9("resolution", _0x4b1e70),
          'videoSize': _0x4360c9('resolution', _0x4b1e70),
          'duration': _0x4360c9("duration", this["_data"]["duration"] || 0x5),
          'mode': this["_data"]["mode"] || "全能参考",
          'provider': _0x3e24a4,
          ...(_0x177c74 ? {
            'providerProfileId': _0x177c74
          } : {}),
          'apiKey': _0x5b88ed,
          'cameraAngle': this["_data"]['cameraAngle'],
          'inputUrls': _0x22abfe,
          'rhInstanceType': _0x4628a0,
          'installId': String(window["__aicInstallId"] || '')["trim"]()
        };
        if (_0xbf6389?.["randomizeSubmitParams"] === !![] && _0x301478) {
          const _0x54f052 = buildSubmitRandomizedSeedPatch({
            'modelManifest': _0x3d36f7?.["modelManifest"] || null,
            'nodeData': this["_data"],
            'payload': _0x4d29f2
          });
          _0x54f052 && (_0x4d29f2['generationParams'] = _0x54f052['requestParams'], _0x83e6cc["updateNodeData"]?.(this["nodeId"], _0x54f052['storePatch']), this["_data"] = {
            ...(this["_data"] || {}),
            ..._0x54f052['storePatch']
          });
        }
        const _0x5449e4 = resolveVideoSubmitInputMaterials({
          'inEdges': _0x2055f2,
          'nodes': _0x2f0be6,
          'assetInputRefs': _0x49c3c0,
          'initialImageUrls': _0x490edc,
          'resolveMediaUrl': _0x8a6ea1 => this["_resolveMediaUrl"](_0x8a6ea1)
        });
        if (!(await applySegmentRetakeTaskPayload(this, {
          'inputMaterials': _0x5449e4,
          'payload': _0x4d29f2,
          'store': _0x83e6cc
        }))) {
          return null;
        }
        const {
          getAudioUrl: _0x52f276,
          getImageUrl: _0x9878f4,
          getMaskImageUrl: _0x5c8df0,
          getVideoUrl: _0x52de06
        } = _0x5449e4['helpers'];
        if (_0x4a7211) {
          let _0x1b37dd = this["_data"];
          typeof this["_normalizeDreaminaNodeData"] === 'function' && (_0x1b37dd = this["_normalizeDreaminaNodeData"](this["_data"], {
            'syncStore': !![]
          }) || this["_data"], this["_data"] = _0x1b37dd);
          const _0xea4060 = getPlainObject(_0x1b37dd?.["generationParams"]);
          const _0x133ee9 = (_0x39916a, _0x477e6d) => {
            const _0x3f8029 = Array["isArray"](_0x39916a) ? _0x39916a : [_0x39916a];
            for (const _0x1a5778 of _0x3f8029) {
              const _0x16e7b3 = String(_0x1a5778 || '')["trim"]();
              if (_0x16e7b3 && Object["prototype"]["hasOwnProperty"]['call'](_0xea4060, _0x16e7b3)) {
                return _0xea4060[_0x16e7b3];
              }
            }
            return _0x477e6d;
          };
          const _0x9dcd61 = resolveDreaminaStyleVideoProvider(_0x1b37dd?.['model'] || _0x3374f5, _0x1b37dd?.["provider"] || _0x3e24a4);
          const {
            images: _0x4c573e,
            videos: _0xafb313,
            audios: _0x17aa5d,
            videoEntries: _0x7d6aa3,
            audioEntries: _0x2e4544,
            providerAssetRefs: _0x2ab226
          } = _0x5449e4["dreamina"];
          const _0x4ec5b6 = validateModelMediaInputLimits({
            'inputSlots': _0x3d36f7?.["modelManifest"]?.['inputSlots'] || null,
            'images': _0x4c573e,
            'videos': _0xafb313,
            'audios': _0x17aa5d,
            'videoEntries': _0x7d6aa3,
            'audioEntries': _0x2e4544
          });
          if (!_0x4ec5b6['ok']) {
            window["showToast"]?.(getModelMediaInputLimitMessage(_0x4ec5b6), 'warn');
            return null;
          }
          const _0x3a4ddf = normalizeDreaminaVideoRouteMode(_0x133ee9(["dreaminaRouteMode", "volcengine_seedance_2_mode", "rh_seedance_2_mode"], _0x1b37dd?.["dreaminaRouteMode"]), _0x1b37dd?.['mode']);
          if (!isDreaminaVideoRouteModeEnabled(_0x3a4ddf)) {
            window["showToast"]?.(videoTaskText("toasts.smartMultiframeUnavailable"), "warn");
            return null;
          }
          const _0xc9659f = resolveDreaminaVideoTaskType({
            'routeMode': _0x3a4ddf,
            'imageCount': _0x4c573e["length"],
            'videoCount': _0xafb313['length'],
            'audioCount': _0x17aa5d["length"]
          });
          const _0x47f0c3 = validateDreaminaVideoRouteSelection({
            'routeMode': _0x3a4ddf,
            'taskType': _0xc9659f,
            'model': _0x1b37dd?.["model"],
            'provider': _0x9dcd61,
            'imageCount': _0x4c573e["length"],
            'videoCount': _0xafb313['length'],
            'audioCount': _0x17aa5d["length"]
          });
          if (_0x47f0c3) {
            window["showToast"]?.(_0x47f0c3, "warn");
            return null;
          }
          const _0x4b1916 = ensureDreaminaStyleVideoModelForTask(_0xc9659f, normalizeDreaminaStyleVideoModel(_0x1b37dd?.["model"], _0x9dcd61), _0x9dcd61) || normalizeDreaminaStyleVideoModel(_0x1b37dd?.["model"], _0x9dcd61);
          const _0x2f5f1c = normalizeDreaminaStyleVideoResolution(_0xc9659f, _0x4b1916, _0x133ee9("resolution", _0x1b37dd?.["resolution"] || _0x1b37dd?.["videoSize"]), _0x9dcd61);
          const _0x131c55 = normalizeDreaminaVideoAspectRatio(_0x133ee9("aspectRatio", _0x1b37dd?.["aspectRatio"]));
          const _0x34e5a8 = normalizeDreaminaStyleVideoDuration(_0xc9659f, _0x4b1916, _0x133ee9("duration", _0x1b37dd?.["duration"]), _0x9dcd61);
          const _0x184396 = getDreaminaStyleVideoDefaultModel(_0xc9659f, _0x9dcd61);
          const _0x112552 = {
            'prompt': _0x5d116b,
            'provider': _0x9dcd61,
            'model': _0x4b1916 || _0x184396,
            'generationParams': {
              ..._0xea4060
            },
            'modelVersion': _0x9dcd61 === "dreamina" ? getDreaminaStyleVideoModelVersion(_0x4b1916, _0x9dcd61) : '',
            'dreaminaRouteMode': _0x3a4ddf,
            'dreaminaTaskType': _0xc9659f,
            'aspectRatio': _0x131c55,
            'duration': _0x34e5a8,
            'resolution': _0x2f5f1c,
            'videoResolution': _0x2f5f1c,
            'videoSize': _0x2f5f1c,
            'images': _0x4c573e,
            'videos': _0xafb313,
            'audios': _0x17aa5d,
            'inputUrls': _0x4c573e["slice"](),
            'providerAssetRefs': _0x2ab226,
            'installId': String(window["__aicInstallId"] || '')['trim']()
          };
          Object["keys"](_0xea4060)["length"] <= 0x0 && delete _0x112552["generationParams"];
          applyVideoNodeAdaptiveAspectRatio(_0x112552, {
            'inEdges': _0x2055f2,
            'nodes': _0x2f0be6,
            'nodeData': _0x1b37dd,
            'provider': _0x9dcd61,
            'model': _0x112552['model'],
            'modelManifest': _0x3d36f7?.["modelManifest"] || null
          });
          if (_0x2ab226['length'] <= 0x0) {
            delete _0x112552['providerAssetRefs'];
          }
          if (!_0x112552["modelVersion"]) {
            delete _0x112552["modelVersion"];
          }
          !_0x2f5f1c && (delete _0x112552["resolution"], delete _0x112552['videoResolution'], delete _0x112552["videoSize"]);
          if (_0xc9659f === "text2video") {
            if (!_0x5d116b) {
              return null;
            }
            _0x112552["inputUrls"] = [];
            _0x112552["images"] = [];
            _0x112552["videos"] = [];
            _0x112552["audios"] = [];
            return _0x3dffef["bind"](_0x112552);
          }
          if (_0xc9659f === "image2video") {
            if (!_0x5d116b || !_0x4c573e[0x0]) {
              return null;
            }
            _0x112552["image"] = _0x4c573e[0x0];
            _0x112552["inputUrls"] = [_0x4c573e[0x0]];
            _0x112552["images"] = [_0x4c573e[0x0]];
            if (_0x9dcd61 === "dreamina") {
              delete _0x112552["aspectRatio"];
            }
            return _0x3dffef["bind"](_0x112552);
          }
          if (_0xc9659f === "frames2video") {
            if (!_0x5d116b || _0x4c573e['length'] < 0x2) {
              return null;
            }
            _0x112552['first'] = _0x4c573e[0x0];
            _0x112552["last"] = _0x4c573e[0x1];
            _0x112552["inputUrls"] = _0x4c573e['slice'](0x0, 0x2);
            _0x112552["images"] = _0x4c573e["slice"](0x0, 0x2);
            if (_0x9dcd61 === 'dreamina') {
              delete _0x112552["aspectRatio"];
            }
            return _0x3dffef["bind"](_0x112552);
          }
          if (_0xc9659f === "multiframe2video") {
            const _0x53ca87 = _0x4c573e['slice'](0x0, 0x14);
            if (_0x53ca87['length'] < 0x2) {
              return null;
            }
            const _0x171ab8 = Math['max'](0x0, _0x53ca87["length"] - 0x1);
            const _0xdb4029 = Array["isArray"](_0x1b37dd?.["dreaminaTransitionPrompts"]) ? _0x1b37dd["dreaminaTransitionPrompts"] : [];
            const _0x1c7b91 = Array["isArray"](_0x1b37dd?.["dreaminaTransitionDurations"]) ? _0x1b37dd["dreaminaTransitionDurations"] : [];
            const _0x3d9d8a = [];
            const _0x34afc1 = [];
            for (let _0x3984b9 = 0x0; _0x3984b9 < _0x171ab8; _0x3984b9 += 0x1) {
              const _0x3db240 = String(_0xdb4029[_0x3984b9] || '')["trim"]() || _0x5d116b;
              const _0x6f3995 = Number(_0x1c7b91[_0x3984b9]);
              const _0x8ea2f7 = Number['isFinite'](_0x6f3995) && _0x6f3995 > 0x0 ? Math["max"](0x1, Math['trunc'](_0x6f3995)) : 0x3;
              _0x3d9d8a['push'](_0x3db240);
              _0x34afc1["push"](_0x8ea2f7);
            }
            if (!_0x5d116b && !_0x3d9d8a["some"](_0x2edf94 => String(_0x2edf94 || '')["trim"]())) {
              return null;
            }
            _0x112552['images'] = _0x53ca87;
            _0x112552['inputUrls'] = _0x53ca87['slice']();
            _0x112552["transitionPrompts"] = _0x3d9d8a;
            _0x112552['transitionDurations'] = _0x34afc1;
            _0x53ca87["length"] === 0x2 && (_0x112552['prompt'] = _0x3d9d8a[0x0] || _0x5d116b, _0x112552["duration"] = _0x34afc1[0x0] || 0x3, delete _0x112552["transitionPrompts"], delete _0x112552["transitionDurations"]);
            delete _0x112552['modelVersion'];
            delete _0x112552["model"];
            delete _0x112552["aspectRatio"];
            delete _0x112552['resolution'];
            delete _0x112552["videoResolution"];
            delete _0x112552["videoSize"];
            return _0x3dffef['bind'](_0x112552);
          }
          if (_0xc9659f === "multimodal2video") {
            if (_0x4c573e["length"] <= 0x0 && _0xafb313['length'] <= 0x0 && _0x17aa5d["length"] <= 0x0) {
              return null;
            }
            if (!_0x112552['modelVersion']) {
              if (_0x9dcd61 === 'dreamina') {
                _0x112552["model"] = _0x184396 || _0x112552["model"];
                _0x112552["modelVersion"] = getDreaminaStyleVideoModelVersion(_0x112552["model"], _0x9dcd61);
              } else {
                !_0x112552["model"] && (_0x112552["model"] = APIMART_DREAMINA_VIDEO_DEFAULT_MODEL);
              }
            }
            return _0x3dffef["bind"](applySegmentRetakeSubmitParameterPolicy(_0x1b37dd, _0x112552));
          }
          return null;
        }
        if (_0x1cd006) {
          const _0x444e35 = await buildRunningHubVideoWorkflowSubmitPatch({
            'model': _0x3374f5,
            'nodeData': this["_data"],
            'inEdges': _0x2055f2,
            'nodes': _0x2f0be6,
            'assetInputRefs': _0x49c3c0,
            'inputMaterials': _0x5449e4["modelApi"],
            'prompt': _0x5d116b,
            'helpers': {
              'getVideoUrl': _0x52de06,
              'getImageUrl': _0x9878f4,
              'getMaskImageUrl': _0x5c8df0,
              'getAudioUrl': _0x52f276
            }
          });
          if (_0x444e35 === null) {
            return null;
          }
          Object["assign"](_0x4d29f2, _0x444e35["payloadPatch"] || {});
          applyVideoNodeAdaptiveAspectRatio(_0x4d29f2, {
            'inEdges': _0x2055f2,
            'nodes': _0x2f0be6,
            'nodeData': this["_data"],
            'provider': _0x3e24a4,
            'model': _0x3374f5,
            'modelManifest': _0x3d36f7?.['modelManifest'] || null
          });
          Object["keys"](_0x444e35["updateData"] || {})['length'] > 0x0 && _0x83e6cc["updateNodeData"](this["nodeId"], _0x444e35["updateData"]);
          return _0x3dffef['bind'](_0x4d29f2);
        }
        if (_0x301478 && !_0x4a7211) {
          const _0x58d49c = compileModelApiVideoSubmit({
            'payload': _0x4d29f2,
            'model': _0x3374f5,
            'provider': _0x3e24a4,
            'nodeData': this["_data"],
            'modelExecution': _0x3d36f7,
            'inputMaterials': _0x5449e4['modelApi'],
            'assetInputRefs': _0x49c3c0,
            'assetVideoCount': _0x5449e4["assetVideoCount"],
            'inEdges': _0x2055f2,
            'nodes': _0x2f0be6
          });
          if (!_0x58d49c['ok']) {
            window["showToast"]?.(_0x58d49c["message"], "warn");
            return null;
          }
          return _0x3dffef["bind"](applySegmentRetakeSubmitParameterPolicy(this["_data"], _0x58d49c["payload"]));
        }
        return _0x3dffef["bind"](_0x4d29f2);
      } finally {
        _0x3dffef['release']();
      }
    }
  }
  return _0x1c33e3["prototype"];
}