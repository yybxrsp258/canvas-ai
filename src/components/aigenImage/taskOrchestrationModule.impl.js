import { getDefaultDreaminaImageModelId, getDreaminaImageModelVersion, isDreaminaImageModel, normalizeDreaminaImageAspectRatio, normalizeDreaminaImageModel, normalizeDreaminaImageSize } from './dreaminaModelMenuHelper.js';
import { setNodeMediaLodHoverPromoted } from '../../modules/canvasImageLod.js';
import { readImagePromptParts, getImagePromptReferenceLabel, resolveImagePromptAsset } from './imageGenerationPrompt.js';
import { disposeImageSchemaRatioResizeAnimation } from '../shared/generationDisplayPolicy.js';
import { NANO_BANANA_FAMILIES, resolveNanoBananaModelBySelection, resolveNanoBananaSelectionFromModel } from '../../modules/nanoBananaModeRules.js';
import { getRatioCapability, isAdaptiveRatioLabel, parseRatioLabel, pickClosestRatioForProviderModel, resolveAdaptiveSourceSize, resolveProviderRatioPayload } from '../../../api/imageRatioPolicy.js';
import { appendAssetMentionToPrompt, createPromptMediaReferenceState, getPromptAssetInputRefsFromNode, insertPresetPromptIntoEditor, isRunningHubWorkflowNode, previewPresetPromptInEditor, shouldUsePromptPreviewForPreset } from '../../modules/nodePromptShared.js';
import { getFixedInputSlotConfigFromManifest } from '../../modules/fixedInputAssetRefs.js';
import { getPromptPresetTemplateEmptyInputMessage, requiresPromptPresetInput, resolvePromptPresetTemplate } from '../../modules/promptPresetTemplate.js';
import { normalizeImageSizeForProviderModel } from '../../modules/imageModelCapabilities.js';
import { getRunningHubTaskProviderProfileId, normalizeRunningHubModelApiProfileId } from '../../modules/runningHubProviderProfiles.js';
import { resolveModelGenerationProviderProfileId } from '../../modules/modelProviderProfileSelection.js';
import { getGenerationRatioSizeWithDom, pickGenerationRatioSourceEdge } from '../../modules/generationRatioSource.js';
import { getTargetInputPolicy, isRhPersonReplaceWorkflowModel, isRhQwenImageEditModel, isInputKindAllowed, resolveEffectiveInputKind } from '../../modules/modelInputPolicy.js';
import { getModelManifest, isModelApiModel, isWorkflowModel, resolveModelExecution, resolveModelProvider, sanitizeModelUiSchemaParams } from '../../manifests/index.js';
import { evaluateGenerationPromptBoundary } from '../../modules/generationPromptPolicy.js';
import { showProviderApiKeyMissingToast, showProviderApiKeyMissingToastForError } from '../../modules/providerApiKeyMissingToast.js';
import { guardModelGenerationCredentials } from '../../modules/modelCredentialUi.js';
import { showCliLoginMissingToast } from '../../modules/cliLoginMissingToast.js';
import { buildFixedSlotOccupancy, countManifestInputRecords, getMissingManifestInputRequirement } from './manifestInputRequirements.js';
import { isPreviewModeEnabled, isPreviewNodeLoading, startPreviewNodeLoading } from '../../modules/previewMode.js';
import { createPreviewGenerateButtonCallbacks, resetGenerateButtonIdleUi, setGenerateButtonCancellableUi, setGenerateButtonLoadingUi } from '../../modules/previewGenerateButtonUi.js';
import { buildGenerationCancelledPatch, buildGenerationStartPatch } from '../../core/generationTaskLifecycle.js';
import { cancelTask, resumeTask, submitTask } from '../../core/generationTaskRuntime.js';
import { createGenerationCancelPlanFromNode, createGenerationResumePlanFromNode, createGenerationSubmitPlan } from '../../core/generationExecutionPlan.js';
import { getGenerationErrorMessage, isGenerationAbortError } from '../../core/generationTaskErrorState.js';
import { buildAsyncTaskPatch, buildDreaminaTaskPatch, buildRunningHubTaskPatch } from '../../core/generationTaskProtocolState.js';
import { shouldAllowCancel, shouldShowGenerationBusyUi } from '../../core/generationTaskUiState.js';
import { createGenerationTaskRecoveryOwner } from '../../core/generationTaskRecoveryOwner.js';
import { resolveGenerationInputImageUrl } from '../../services/imageReferenceUrlService.js';
import { logDiagnosticEvent } from '../../services/diagnosticsService.js';
import { createPayloadObjectUrlLease, releasePayloadObjectUrlLease } from '../../services/payloadObjectUrlLease.js';
import { GENERATION_HISTORY_EVENT } from '../../modules/generationHistoryAssets.js';
import { buildImageGenerationFailurePatch, buildImageGenerationResultPatch, getImageGenerationResultError, getSuccessfulImageGenerationItems, normalizeImageGenerationResult } from './imageGenerationResultRenderer.js';
import { getImageInputGateMissingMessage, getImageInputGateUploadedUrl, getImageNodeInputGate, shouldUseImageWorkflowBusyButton } from './imageNodeManifestPolicies.js';
import { t } from '../../i18n/index.js';
import { normalizeLocalPath } from '../../utils/localMediaPath.js';
import { isCustomAiAppManifest, shouldAllowEmptyCustomAiAppInputs } from '../shared/rhAiAppNodeBehavior.js';
const DREAMINA_STALE_ACTIVE_RESUME_MS = 0xf * 0x3e8;
const DREAMINA_NON_RECOVERABLE_STATUSES = new Set(["cancelled", 'canceled', 'complete', "completed", "done", "error", "fail", 'failed', 'finish', "finished", 'idle', 'success', "succeeded"]);
const DREAMINA_NON_RECOVERABLE_PHASES = new Set(["cancelled", "canceled", "complete", "completed", 'done', 'error', "fail", "failed", "finish", "finished", "success", "succeeded"]);
const ASYNC_IMAGE_MODEL_API_PROVIDERS = new Set(["apimart", "grsai", "ppio"]);
function normalizeTaskStatus(_0x4c6198) {
  return String(_0x4c6198 || '')['trim']()["toLowerCase"]();
}
function isAsyncImageModelApiProvider(_0x1e1446) {
  return ASYNC_IMAGE_MODEL_API_PROVIDERS["has"](String(_0x1e1446 || '')["trim"]()['toLowerCase']());
}
function getImageProviderApiKeyMissingMessage(_0x530921 = {}) {
  if (String(_0x530921?.["apiKey"] || '')["trim"]()) {
    return '';
  }
  const _0x2dba8f = String(_0x530921?.["provider"] || '')["trim"]()["toLowerCase"]();
  if (!_0x2dba8f) {
    return '';
  }
  if (_0x2dba8f === "volcengine") {
    return t("aigenImage.task.apiKeyMissing.volcengine");
  }
  if (_0x2dba8f === "runninghub") {
    return isModelApiModel(_0x530921?.['model'], "runninghub") ? t("aigenImage.task.apiKeyMissing.runninghubModel") : t("aigenImage.task.apiKeyMissing.runninghub");
  }
  if (_0x2dba8f === "runninghubwf") {
    return t("aigenImage.task.apiKeyMissing.runninghub");
  }
  if (_0x2dba8f === "apimart") {
    return t('aigenImage.task.apiKeyMissing.apimart');
  }
  if (_0x2dba8f === "ppio") {
    return t("aigenImage.task.apiKeyMissing.ppio");
  }
  if (_0x2dba8f === 'grsai') {
    return t("aigenImage.task.apiKeyMissing.grsai");
  }
  return '';
}
const REFERENCE_LABEL_ALIASES = Object['freeze']({
  'text': Object["freeze"](['文本', "Text"]),
  'image': Object["freeze"](['图片', "Image"]),
  'video': Object['freeze'](['视频', 'Video']),
  'audio': Object["freeze"](['音频', "Audio"])
});
function getReferenceTypeLabel(_0xe5fcc0) {
  const _0x1bc3f4 = {
    'text': t('aigenImage.refs.types.text'),
    'image': t("aigenImage.refs.types.image"),
    'video': t('aigenImage.refs.types.video'),
    'audio': t("aigenImage.refs.types.audio")
  };
  return _0x1bc3f4[_0xe5fcc0] || String(_0xe5fcc0 || '');
}
function buildReferenceLabelAliases(_0x137de4, _0x93e443) {
  const _0x4c1ede = ['@' + getReferenceTypeLabel(_0x137de4) + _0x93e443, ...(REFERENCE_LABEL_ALIASES[_0x137de4] || [])["map"](_0x37e9c4 => '@' + _0x37e9c4 + _0x93e443)];
  return Array['from'](new Set(_0x4c1ede));
}
function createSchemaParamAccess({
  model: _0x412961,
  data: _0x3cd4f8,
  generationParams: _0x27f2e6,
  manifestFields: _0x46f9c4
}) {
  const _0x3ea93c = _0x5035f0 => _0x46f9c4["find"](_0x2d7551 => String(_0x2d7551?.['id'] || '') === _0x5035f0) || null;
  const _0x4bc225 = _0x3948c6 => {
    const _0x18cc51 = _0x3ea93c(_0x3948c6);
    if (!_0x18cc51) {
      return undefined;
    }
    if (_0x27f2e6[_0x3948c6] !== undefined) {
      return _0x27f2e6[_0x3948c6];
    }
    if (_0x3cd4f8 && typeof _0x3cd4f8 === "object" && !Array["isArray"](_0x3cd4f8) && _0x3cd4f8[_0x3948c6] !== undefined) {
      return _0x3cd4f8[_0x3948c6];
    }
    return _0x18cc51["defaultValue"];
  };
  const _0x559694 = _0x54d332 => {
    const _0x18ded5 = _0x4bc225(_0x54d332);
    if (_0x18ded5 === undefined || _0x18ded5 === null || String(_0x18ded5)["trim"]() === '') {
      throw new Error("Manifest model " + _0x412961 + " missing " + _0x54d332);
    }
    return _0x18ded5;
  };
  return {
    'getManifestField': _0x3ea93c,
    'readSchemaParam': _0x4bc225,
    'requireSchemaParam': _0x559694
  };
}
function isGrsaiGptImage2Model(_0x4a6d7f, _0x5f3a2e) {
  const _0x194b6d = resolveNanoBananaSelectionFromModel(_0x5f3a2e, '2K', _0x4a6d7f || "grsai");
  return _0x194b6d?.["provider"] === 'grsai' && _0x194b6d["family"] === NANO_BANANA_FAMILIES["GPT_IMAGE_2"];
}
function resolveGrsaiGptImage2ModelForSize({
  provider: _0x2faaac,
  model: _0x19e7e4,
  imageSize: _0x1bc358
} = {}) {
  if (!isGrsaiGptImage2Model(_0x2faaac, _0x19e7e4)) {
    return _0x19e7e4;
  }
  const _0x469312 = String(_0x1bc358 || '1K')["trim"]()['toUpperCase']();
  const _0x2b0edd = resolveModelExecution(_0x19e7e4, {
    'providerHint': "grsai"
  }) || resolveModelExecution(resolveNanoBananaSelectionFromModel(_0x19e7e4, _0x469312, "grsai")?.['model'], {
    'providerHint': "grsai"
  });
  const _0x457ba8 = _0x2b0edd?.["executionManifest"]?.["imageSizeModels"];
  if (!_0x457ba8 || typeof _0x457ba8 !== 'object') {
    return _0x19e7e4;
  }
  return _0x457ba8[_0x469312] || _0x457ba8["default"] || _0x2b0edd?.["modelManifest"]?.['modelId'] || _0x19e7e4;
}
function resolveImageSizeForProviderModel({
  provider: _0x4f402c,
  model: _0x5a7dfa,
  imageSize: _0x2b0d69
} = {}) {
  const _0x582f89 = normalizeImageSizeForProviderModel({
    'provider': _0x4f402c,
    'model': _0x5a7dfa,
    'imageSize': _0x2b0d69
  });
  if (_0x582f89) {
    return _0x582f89;
  }
  if (!String(_0x2b0d69 || '')["trim"]() && String(_0x4f402c || '')["trim"]()["toLowerCase"]() === "runninghub" && String(_0x5a7dfa || '')["trim"]() === 'runninghub-model/rhart-image-g') {
    return '1K';
  }
  const _0x426a32 = String(_0x2b0d69 || (isGrsaiGptImage2Model(_0x4f402c, _0x5a7dfa) ? '1K' : '2K'))["trim"]()["toUpperCase"]();
  return _0x426a32 || '2K';
}
function sanitizeTaskGenerationParams(_0x430075, _0xa6ee2e = {}) {
  const _0x32142f = _0xa6ee2e && typeof _0xa6ee2e === "object" && !Array["isArray"](_0xa6ee2e) ? _0xa6ee2e : {};
  const _0x2d6bc5 = sanitizeModelUiSchemaParams(_0x430075, _0x32142f, {
    'includeDefaults': ![]
  });
  Object["prototype"]["hasOwnProperty"]['call'](_0x32142f, "aspectRatio") && (_0x2d6bc5["aspectRatio"] = _0x32142f["aspectRatio"]);
  return {
    ..._0x32142f,
    ..._0x2d6bc5
  };
}
function normalizeTaskBooleanParam(_0x206cc7) {
  if (_0x206cc7 === !![] || _0x206cc7 === ![]) {
    return _0x206cc7;
  }
  const _0x55da09 = String(_0x206cc7 ?? '')["trim"]()["toLowerCase"]();
  if (["true", '1', "yes", 'on']["includes"](_0x55da09)) {
    return !![];
  }
  if (["false", '0', 'no', 'off', '']["includes"](_0x55da09)) {
    return ![];
  }
  return Boolean(_0x206cc7);
}
function hasOwnObjectField(_0x6c16e7, _0x2139be) {
  return _0x6c16e7 && typeof _0x6c16e7 === "object" && !Array["isArray"](_0x6c16e7) && Object["prototype"]["hasOwnProperty"]['call'](_0x6c16e7, _0x2139be);
}
function normalizeImageBatchSize(_0x27175b, _0x58954d = 0x1) {
  const _0x19c0ba = Number["parseInt"](_0x27175b, 0xa);
  if (!Number["isFinite"](_0x19c0ba) || _0x19c0ba < 0x1) {
    return _0x58954d;
  }
  return _0x19c0ba;
}
function resolveImageNodeBatchSize({
  data = {},
  generationParams = {},
  rawGenerationParams = {}
} = {}) {
  const _0x5cd0ef = hasOwnObjectField(data, "batchSize");
  const _0x5a8fdd = normalizeImageBatchSize(data?.['batchSize'], 0x1);
  if (hasOwnObjectField(generationParams, 'batchSize')) {
    return normalizeImageBatchSize(generationParams["batchSize"], _0x5a8fdd);
  }
  if (hasOwnObjectField(rawGenerationParams, 'batchSize')) {
    return normalizeImageBatchSize(rawGenerationParams["batchSize"], _0x5a8fdd);
  }
  return _0x5cd0ef ? _0x5a8fdd : 0x1;
}
const IMAGE_PAYLOAD_SCHEMA_PARAM_EXCLUDES = Object["freeze"](new Set(["mode", "rhModelRoute", "imageSize", "aspectRatio", 'batchSize', "google_search", "google_image_search"]));
function buildImageSchemaPayloadParams({
  enabled: _0x1ee44e,
  manifestFields: _0x53eb75,
  readSchemaParam: _0x458788
} = {}) {
  if (!_0x1ee44e || !Array["isArray"](_0x53eb75)) {
    return {};
  }
  return _0x53eb75["reduce"]((_0xf9f5f2, _0x23e215) => {
    const _0x3a47c3 = String(_0x23e215?.['id'] || '')["trim"]();
    if (!_0x3a47c3 || IMAGE_PAYLOAD_SCHEMA_PARAM_EXCLUDES["has"](_0x3a47c3)) {
      return _0xf9f5f2;
    }
    _0xf9f5f2[_0x3a47c3] = _0x458788(_0x3a47c3);
    return _0xf9f5f2;
  }, {});
}
function reorderImageInputUrlsByRefOrder(_0x4e08b3 = [], _0x13b744 = []) {
  const _0x526b19 = (Array["isArray"](_0x4e08b3) ? _0x4e08b3 : [])["map"](_0x574d8c => String(_0x574d8c || '')["trim"]())["filter"](Boolean);
  if (_0x526b19['length'] <= 0x1) {
    return _0x526b19;
  }
  const _0x414c02 = new Set(_0x526b19);
  const _0x55735f = [];
  const _0x1ad1a1 = _0x2839df => {
    const _0x287a2b = String(_0x2839df || '')['trim']();
    if (!_0x287a2b || !_0x414c02["has"](_0x287a2b)) {
      return;
    }
    _0x55735f["push"](_0x287a2b);
    _0x414c02["delete"](_0x287a2b);
  };
  (Array['isArray'](_0x13b744) ? _0x13b744 : [])["forEach"](_0x58e0ac => {
    _0x1ad1a1(_0x58e0ac?.["url"]);
  });
  _0x526b19["forEach"](_0x1ad1a1);
  return _0x55735f;
}
function buildInputUrlsByFixedImageSlot({
  fixedInputConfig = null,
  imageRefs = [],
  assetInputRefs = []
} = {}) {
  const _0x2b27b4 = (fixedInputConfig?.['visibleSlots'] || [])["map"](_0x5b5bdd => String(_0x5b5bdd || '')["trim"]())["filter"](_0x496353 => _0x496353 && String(fixedInputConfig?.["slotKindById"]?.[_0x496353] || '') === "image");
  if (_0x2b27b4["length"] === 0x0) {
    return {};
  }
  const _0x3d0f9c = {};
  const _0x246297 = new Set();
  const _0x4b6b6b = (_0x15e6eb, _0x1a7b6d) => {
    const _0x52e5d0 = String(_0x15e6eb || '')['trim']();
    const _0x1cf634 = String(_0x1a7b6d || '')['trim']();
    if (!_0x52e5d0 || !_0x1cf634 || _0x3d0f9c[_0x52e5d0]) {
      return ![];
    }
    if (!_0x2b27b4["includes"](_0x52e5d0)) {
      return ![];
    }
    _0x3d0f9c[_0x52e5d0] = _0x1cf634;
    _0x246297["add"](_0x1cf634);
    return !![];
  };
  const _0x1955e6 = _0x580e42 => {
    const _0xdf1ce4 = String(_0x580e42 || '')["trim"]();
    if (!_0xdf1ce4 || _0x246297["has"](_0xdf1ce4)) {
      return ![];
    }
    const _0x73a288 = _0x2b27b4['find'](_0x3cfabf => !_0x3d0f9c[_0x3cfabf]);
    return _0x4b6b6b(_0x73a288, _0xdf1ce4);
  };
  (Array["isArray"](imageRefs) ? imageRefs : [])["forEach"](_0x94586f => {
    _0x4b6b6b(_0x94586f?.["refSlot"], _0x94586f?.["url"]);
  });
  (Array["isArray"](assetInputRefs) ? assetInputRefs : [])["forEach"](_0x4989ef => {
    _0x4b6b6b(_0x4989ef?.['refSlot'], _0x4989ef?.["url"]);
  });
  (Array["isArray"](imageRefs) ? imageRefs : [])["forEach"](_0x3d0a2d => {
    _0x1955e6(_0x3d0a2d?.['url']);
  });
  (Array["isArray"](assetInputRefs) ? assetInputRefs : [])['forEach'](_0x28740f => {
    const _0xf8a034 = resolveEffectiveInputKind(_0x28740f) || _0x28740f?.["type"];
    if (_0xf8a034 === "image") {
      _0x1955e6(_0x28740f?.['url']);
    }
  });
  return _0x3d0f9c;
}
export function createAIGenerateNodeTaskOrchestrationModule(_0x80084d) {
  const {
    store: _0xcebdf2,
    api: _0x5bad71,
    getDisplayModelName: _0x4880a6,
    _handlePillHover: _0x34266d,
    _handlePillOut: _0x242fac,
    _syncEdgesOrderFromPills: _0x4f90e6,
    _syncPillLabels: _0x39f37f,
    _checkAtTrigger: _0x474797,
    _populateMentionMenu: _0x8b1964,
    _insertMentionPill: _0x3a717a,
    _handlePillKeyboard: _0x1fa51b,
    _rehydratePromptPills: _0x5bbe2a,
    _handleMentionMenuKeyboard: _0x1d84f4,
    TEXT_TOOLBAR_HTML: _0x59cf45,
    bindTextToolbarEvents: _0x47c3d7,
    IMAGE_TOOLBAR_HTML: _0xb32491,
    bindImageToolbarEvents: _0x5e2fd5,
    showDevToast: _0x5dc035,
    getImage: _0x255c6c,
    openNodeImagePreview: _0x431a2b,
    getPromptPresets: _0x2a6cbd,
    openCustomPresetsManager: _0x7a4491,
    startLoading: _0x16225d,
    stopLoading: _0x23d14c,
    bindRefThumbHoverPreview: _0x59a9a5,
    ensureThumbDecoded: _0x658cef,
    revealRefThumbMedia: _0x48526f,
    getRefKindByNodeType: _0x3f0213,
    uploadFile: _0x4f3be7,
    ensureConfig: _0x554ecc,
    getProviderConfig: _0xb2beda,
    generateId: _0x4c68cb,
    checkSlashTrigger: _0x2d6f58,
    handleSlashKeyboardNavigation: _0x24a914,
    closeSlashMenu: _0x5af9f8,
    activateMenuKeyboard: _0x274051,
    ImageFreeAngleController: _0x2fd0e0
  } = _0x80084d;
  const _0x31006f = _0x80084d["taskRuntime"]?.['submitTask'] || submitTask;
  const _0x532ffa = _0x80084d['taskRuntime']?.["resumeTask"] || resumeTask;
  const _0x16abbe = _0x80084d["taskRuntime"]?.["cancelTask"] || cancelTask;
  const _0x1eec84 = _0x80084d["guardCredentials"] || guardModelGenerationCredentials;
  const _0x4c18a5 = () => typeof _0xcebdf2["getStateRaw"] === "function" ? _0xcebdf2['getStateRaw']() : _0xcebdf2["getState"]();
  const _0x5090b0 = (_0x3ce6d4, _0x2fbdbf) => _0x3ce6d4?.["getTaskNode"]?.() || _0xcebdf2["getState"]()["nodes"]?.[_0x2fbdbf] || {};
  const _0x195f6f = (_0x436f4f, _0xa6fa91, _0x4beaed) => {
    if (typeof _0x436f4f?.['updateTaskNode'] === 'function') {
      return _0x436f4f["updateTaskNode"](_0x4beaed);
    }
    _0xcebdf2["updateNodeData"](_0xa6fa91, _0x4beaed);
    return !![];
  };
  class _0x2b6930 {
    ['_getGenerationTaskRecoveryOwner']() {
      !this["_generationTaskRecoveryOwner"] && (this["_generationTaskRecoveryOwner"] = createGenerationTaskRecoveryOwner({
        'readTaskNode': () => _0x4c18a5()["nodes"]?.[this["nodeId"]] || this["_data"] || {},
        'updateTaskNode': _0x491a29 => _0xcebdf2["updateNodeData"](this['nodeId'], _0x491a29),
        'persist': _0x270769 => {
          if (_0x270769 === "dreamina") {
            return this["_persistDreaminaResumeCache"]();
          }
          if (_0x270769 === "asyncModelApi") {
            return this["_persistAsyncResumeCache"]();
          }
          return this["_persistRunningHubResumeCache"]();
        }
      }), this["_generationTaskRecoveryOwner"]['bindLegacyState'](this));
      return this["_generationTaskRecoveryOwner"];
    }
    ["_persistRunningHubResumeCache"]() {
      try {
        window["_triggerLocalCacheSave"]?.();
      } catch {}
    }
    ["_persistDreaminaResumeCache"]() {
      this['_persistRunningHubResumeCache']();
    }
    ['_persistAsyncResumeCache']() {
      this["_persistRunningHubResumeCache"]();
    }
    ["_isDreaminaImageNode"](_0x2058e4 = this["_data"]) {
      return resolveModelProvider(_0x2058e4?.["model"], _0x2058e4?.["provider"]) === "dreamina";
    }
    async ["_ensureDreaminaCliLoggedIn"](_0x15c8f6 = this["_data"]) {
      if (!this['_isDreaminaImageNode'](_0x15c8f6)) {
        return !![];
      }
      const _0x23d8ed = _0x5bad71?.["getCachedDreaminaCliStatus"]?.();
      if (_0x23d8ed?.["loggedIn"] === !![]) {
        return !![];
      }
      if (_0x23d8ed?.["loggedIn"] === ![]) {
        showCliLoginMissingToast(t("aigenImage.task.dreaminaLoginRequired"), {
          'providerId': 'dreamina',
          'actionLabel': t("aigenImage.task.openSettings")
        });
        return ![];
      }
      const _0x1cb4c1 = _0x5bad71?.["fetchDreaminaCliStatusFromServer"];
      if (typeof _0x1cb4c1 !== 'function') {
        showCliLoginMissingToast(t("aigenImage.task.dreaminaLoginStatusUnavailable"), {
          'providerId': "dreamina",
          'actionLabel': t("aigenImage.task.openSettings")
        });
        return ![];
      }
      try {
        const _0x4fef61 = await _0x1cb4c1({
          'refresh': ![]
        });
        if (_0x4fef61?.["loggedIn"] === !![]) {
          return !![];
        }
        showCliLoginMissingToast(t('aigenImage.task.dreaminaLoginRequired'), {
          'providerId': "dreamina",
          'actionLabel': t("aigenImage.task.openSettings")
        });
        return ![];
      } catch (_0x3621c9) {
        console["warn"]('[AIGenerateNode]\x20检查即梦\x20CLI\x20登录状态失败:', _0x3621c9);
        showCliLoginMissingToast(t("aigenImage.task.dreaminaLoginStatusUnavailable"), {
          'providerId': "dreamina",
          'actionLabel': t("aigenImage.task.openSettings")
        });
        return ![];
      }
    }
    ["_inferProviderFromModel"](_0x4217f5, _0x3e6d89 = '') {
      return resolveModelProvider(_0x4217f5, '', {
        'allowProviderHint': ![]
      }) || resolveModelProvider(_0x4217f5, _0x3e6d89) || resolveModelProvider(_0x4217f5, "grsai");
    }
    ["_isRunninghubTaskModel"](_0x4ffff2, _0xda9cf1) {
      const _0x17ec25 = resolveModelProvider(_0x4ffff2, _0xda9cf1, {
        'allowProviderHint': ![]
      });
      const _0x6bd982 = String(_0xda9cf1 || _0x17ec25 || '')["trim"]()["toLowerCase"]();
      return (_0x6bd982 === "runninghub" || _0x17ec25 === "runninghub") && isModelApiModel(_0x4ffff2, 'runninghub') || this['_isRunninghubWorkflowModel'](_0x4ffff2, _0xda9cf1);
    }
    ["_isRunningHubNanoBananaModel"](_0x554aa2 = this["_data"]?.["model"]) {
      const _0x295d52 = resolveNanoBananaSelectionFromModel(_0x554aa2, '2K', "runninghub");
      return _0x295d52?.["provider"] === "runninghub" && _0x295d52["family"] === NANO_BANANA_FAMILIES["NANOBANANA"];
    }
    ["_isRunningHubRecoverableRunningTask"](_0x531fc4 = this["_data"]) {
      if (!this["_isRunninghubTaskModel"](_0x531fc4?.["model"], _0x531fc4?.["provider"])) {
        return ![];
      }
      const _0xa28a51 = String(_0x531fc4?.['rhTaskId'] || '')["trim"]();
      if (!_0xa28a51) {
        return ![];
      }
      const _0x431ae0 = String(_0x531fc4?.['rhTaskStatus'] || '')["trim"]()['toLowerCase']();
      if (_0x431ae0 === "complete" || _0x431ae0 === 'completed' || _0x431ae0 === 'done' || _0x431ae0 === "error" || _0x431ae0 === "finish" || _0x431ae0 === "finished" || _0x431ae0 === "success" || _0x431ae0 === 'succeeded' || _0x431ae0 === 'failed' || _0x431ae0 === 'fail' || _0x431ae0 === 'idle' || _0x431ae0 === "cancelled" || _0x431ae0 === "canceled") {
        return ![];
      }
      return !![];
    }
    ["_isDreaminaRecoverableRunningTask"](_0x4d56ab = this["_data"]) {
      if (!this["_isDreaminaImageNode"](_0x4d56ab)) {
        return ![];
      }
      const _0x7cd368 = String(_0x4d56ab?.["dreaminaSubmitId"] || '')["trim"]();
      if (!_0x7cd368) {
        return ![];
      }
      const _0x3e80a4 = normalizeTaskStatus(_0x4d56ab?.['jobStatus']);
      const _0x24876c = normalizeTaskStatus(_0x4d56ab?.['dreaminaTaskPhase']);
      const _0x417c0b = normalizeTaskStatus(_0x4d56ab?.["dreaminaTaskStatus"]);
      if (DREAMINA_NON_RECOVERABLE_STATUSES["has"](_0x3e80a4)) {
        return ![];
      }
      if (DREAMINA_NON_RECOVERABLE_PHASES["has"](_0x24876c)) {
        return ![];
      }
      if (DREAMINA_NON_RECOVERABLE_STATUSES["has"](_0x417c0b)) {
        return ![];
      }
      return !![];
    }
    ['_isStaleActiveDreaminaTask'](_0x17e3c0 = this["_data"]) {
      if (!this['_isGenerating']) {
        return ![];
      }
      if (_0x17e3c0?.['dreaminaTaskRecovering'] === !![]) {
        return ![];
      }
      if (this["_dreaminaResumePromise"]) {
        return ![];
      }
      const _0x43022b = Number(_0x17e3c0?.["dreaminaTaskLastCheckedAt"] || _0x17e3c0?.["dreaminaTaskStartedAt"] || _0x17e3c0?.['generationStartTime'] || 0x0);
      if (!Number["isFinite"](_0x43022b) || _0x43022b <= 0x0) {
        return ![];
      }
      return Date["now"]() - _0x43022b >= DREAMINA_STALE_ACTIVE_RESUME_MS;
    }
    ['_isAsyncRecoverableRunningTask'](_0x53a327 = this["_data"]) {
      const _0x5d704d = String(_0x53a327?.["asyncTaskId"] || '')["trim"]();
      if (!_0x5d704d) {
        return ![];
      }
      const _0x2e838b = this['_inferProviderFromModel'](_0x53a327?.["model"], _0x53a327?.['asyncTaskProvider'] || _0x53a327?.["provider"] || '');
      if (!_0x2e838b || _0x2e838b === "runninghubwf" || _0x2e838b === "runninghub" || _0x2e838b === 'dreamina') {
        return ![];
      }
      const _0x350125 = String(_0x53a327?.["asyncTaskKind"] || '')["trim"]()["toLowerCase"]();
      if (_0x350125 && _0x350125 !== "image") {
        return ![];
      }
      const _0x138c99 = String(_0x53a327?.["asyncTaskStatus"] || '')['trim']()["toLowerCase"]();
      if (_0x138c99 === "success" || _0x138c99 === 'failed' || _0x138c99 === "idle" || _0x138c99 === "cancelled") {
        return ![];
      }
      return !![];
    }
    ["_hasImageGenerationResult"](_0x4aa029 = this['_data']) {
      const _0x2e23cf = Array["isArray"](_0x4aa029?.["images"]) ? _0x4aa029["images"] : [];
      const _0x45cefe = _0x2e23cf["some"](_0x2835a1 => {
        if (!_0x2835a1 || typeof _0x2835a1 !== "object") {
          return ![];
        }
        if (String(_0x2835a1?.['error'] || '')["trim"]()) {
          return ![];
        }
        return !!normalizeLocalPath(_0x2835a1?.["localPath"] || _0x2835a1?.['originalLocalPath'] || _0x2835a1?.['displayLocalPath'] || _0x2835a1?.["imageUrl"] || _0x2835a1?.['sourceUrl'] || _0x2835a1?.["thumbUrl"] || '');
      });
      if (_0x45cefe) {
        return !![];
      }
      return !!normalizeLocalPath(_0x4aa029?.["localPath"] || _0x4aa029?.["originalLocalPath"] || _0x4aa029?.['displayLocalPath'] || _0x4aa029?.['imageUrl'] || _0x4aa029?.["sourceUrl"] || _0x4aa029?.["thumbUrl"] || '');
    }
    ["_shouldFallbackRegenerateAsyncTask"](_0xd669eb = this['_data']) {
      const _0x2a8d6f = String(_0xd669eb?.["asyncTaskId"] || '')['trim']();
      if (_0x2a8d6f) {
        return ![];
      }
      const _0x3660e6 = this["_inferProviderFromModel"](_0xd669eb?.['model'], _0xd669eb?.["asyncTaskProvider"] || _0xd669eb?.["provider"] || '');
      if (!['ppio', "apimart"]["includes"](_0x3660e6)) {
        return ![];
      }
      const _0x4a4e5d = String(_0xd669eb?.['asyncTaskStatus'] || '')['trim']()["toLowerCase"]();
      const _0x107900 = ["submitted", "pending", "queued", "waiting", "running", "processing", 'querying', "in_progress"]["includes"](_0x4a4e5d);
      if (!_0x107900) {
        return ![];
      }
      if (this["_hasImageGenerationResult"](_0xd669eb)) {
        return ![];
      }
      if (_0xd669eb?.["generationDuration"] != null) {
        return ![];
      }
      return !![];
    }
    async ['_maybeFallbackRegenerateAsyncTask'](_0x147663 = this["_data"]) {
      if (!this['_shouldFallbackRegenerateAsyncTask'](_0x147663)) {
        return ![];
      }
      if (this["_asyncFallbackRegeneratePromise"]) {
        return !![];
      }
      if (this['_isGenerating']) {
        return !![];
      }
      const _0x234b35 = (async () => {
        const _0x53422a = _0xcebdf2["getState"]()["nodes"]?.[this['nodeId']] || _0x147663 || {};
        const _0x3d0bce = Number(_0x53422a?.["generationStartTime"] || 0x0) > 0x0 ? Number(_0x53422a['generationStartTime']) : Date["now"]();
        _0xcebdf2["updateNodeData"](this["nodeId"], this['_buildAsyncTaskPatch']({
          'provider': this["_inferProviderFromModel"](_0x53422a?.["model"], _0x53422a?.["asyncTaskProvider"] || _0x53422a?.['provider'] || ''),
          'kind': 'image',
          'taskId': '',
          'status': "pending",
          'startedAt': _0x3d0bce,
          'recovering': !![]
        }));
        this["_persistAsyncResumeCache"]();
        await this["_onGenerate"]();
      })();
      this["_asyncFallbackRegeneratePromise"] = _0x234b35["finally"](() => {
        this["_asyncFallbackRegeneratePromise"] = null;
      });
      return !![];
    }
    ['_buildRunningHubTaskPatch']({
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
    ["_buildDreaminaTaskPatch"]({
      submitId = '',
      status = "pending",
      phase = "generating",
      label = t("aigenImage.task.generating"),
      startedAt = 0x0,
      lastCheckedAt = Date['now'](),
      recovering = ![],
      raw = {}
    } = {}) {
      return buildDreaminaTaskPatch({
        'submitId': submitId,
        'status': status,
        'phase': phase,
        'label': label,
        'startedAt': startedAt,
        'lastCheckedAt': lastCheckedAt,
        'recovering': recovering,
        'raw': raw,
        'defaultLabel': t("aigenImage.task.generating")
      });
    }
    ["_buildDreaminaFailurePatch"]({
      error = '',
      startedAt = 0x0,
      submitId = '',
      lastCheckedAt = Date["now"](),
      raw = {}
    } = {}) {
      const _0x411c0d = _0xcebdf2['getState']()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      const _0x22abc5 = String(error?.['message'] || error || t("aigenImage.task.generationFailed"))["trim"]() || t("aigenImage.task.generationFailed");
      const _0x57d9e6 = String(submitId || '')["trim"]() || String(_0x411c0d?.["dreaminaSubmitId"] || '')["trim"]();
      const _0x1f0b5e = Number(startedAt) > 0x0 ? Number(startedAt) : Number(_0x411c0d?.["dreaminaTaskStartedAt"] || _0x411c0d?.["generationStartTime"] || Date["now"]());
      return {
        ...buildImageGenerationFailurePatch({
          'error': _0x22abc5,
          'startedAt': _0x1f0b5e
        }),
        ...this["_buildDreaminaTaskPatch"]({
          'submitId': _0x57d9e6,
          'status': "failed",
          'phase': "failed",
          'label': _0x22abc5,
          'startedAt': _0x1f0b5e,
          'lastCheckedAt': Number(lastCheckedAt || Date['now']()),
          'recovering': ![],
          'raw': raw
        })
      };
    }
    ["_finalizeDreaminaImageFailure"](_0x1b107c = {}) {
      const _0x245f17 = this['_buildDreaminaFailurePatch'](_0x1b107c);
      _0xcebdf2["updateNodeData"](this["nodeId"], _0x245f17);
      this["_persistDreaminaResumeCache"]();
      this["_isGenerating"] = ![];
      this["_dreaminaActiveSubmitId"] = '';
      this["btnEl"] && resetGenerateButtonIdleUi(this["btnEl"]);
      _0x23d14c(this["previewEl"]);
      this['_updateSubmitButtonState']?.();
      return _0x245f17;
    }
    ["_buildAsyncTaskPatch"]({
      provider = '',
      kind = "image",
      taskId = '',
      status = 'pending',
      startedAt = 0x0,
      recovering = ![]
    } = {}) {
      const _0x1891e7 = String(status || "pending")["trim"]() || "pending";
      const _0x4f5937 = String(taskId || '')["trim"]();
      let _0x1ae0c4 = String(provider || '')['trim']()['toLowerCase']();
      !_0x1ae0c4 && (_0x4f5937 || _0x1891e7 !== "idle") && (_0x1ae0c4 = this["_inferProviderFromModel"](this["_data"]?.["model"] || '', ''));
      return buildAsyncTaskPatch({
        'provider': _0x1ae0c4,
        'kind': kind,
        'taskId': _0x4f5937,
        'status': _0x1891e7,
        'startedAt': startedAt,
        'recovering': recovering
      });
    }
    ["_syncLocalTaskNodeData"]() {
      const _0x5667ec = _0xcebdf2["getState"]()['nodes']?.[this["nodeId"]];
      if (_0x5667ec) {
        this["_data"] = _0x5667ec;
      }
      return this["_data"] || {};
    }
    ['_applyDreaminaTaskPatch'](_0x399e2c = {}, _0x15384a = {}) {
      const _0x50a173 = _0xcebdf2['getState']()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      const _0x33947a = {
        'generationStartTime': Number(_0x50a173?.['generationStartTime']) > 0x0 ? Number(_0x50a173["generationStartTime"]) : Number(_0x399e2c?.['startedAt'] || Date["now"]()),
        'generationDuration': null,
        ...this["_buildDreaminaTaskPatch"](_0x399e2c),
        ..._0x15384a
      };
      _0xcebdf2['updateNodeData'](this["nodeId"], _0x33947a);
      this["_syncLocalTaskNodeData"]();
      this["_persistDreaminaResumeCache"]();
      return _0x33947a;
    }
    ['_stopRunningHubRecovery'](_0xca94d8 = ![]) {
      this["_getGenerationTaskRecoveryOwner"]()["stop"]("workflow", {
        'resetRecovering': _0xca94d8
      });
    }
    ["_stopDreaminaRecovery"](_0x23c745 = ![]) {
      this['_getGenerationTaskRecoveryOwner']()["stop"]('dreamina', {
        'resetRecovering': _0x23c745
      });
    }
    ["_stopAsyncRecovery"](_0x2595c1 = ![]) {
      this["_getGenerationTaskRecoveryOwner"]()['stop']('asyncModelApi', {
        'resetRecovering': _0x2595c1
      });
    }
    ["_applyImageGenerationResult"](_0x21cd37, _0x1f2a88, {
      writeStore = !![]
    } = {}) {
      const _0x22ab35 = normalizeImageGenerationResult(_0x21cd37);
      const _0x47631 = buildImageGenerationResultPatch(_0x22ab35, {
        'startedAt': _0x1f2a88
      });
      if (!_0x47631) {
        return null;
      }
      writeStore && _0xcebdf2['updateNodeData'](this['nodeId'], _0x47631);
      this['_dispatchGenerationHistoryAssets'](getSuccessfulImageGenerationItems(_0x22ab35), _0x1f2a88);
      return {
        'patch': _0x47631,
        'normalizedResult': _0x22ab35,
        'items': getSuccessfulImageGenerationItems(_0x22ab35)
      };
    }
    ['_dispatchGenerationHistoryAssets'](_0x36f4f9, _0x4b082a) {
      if (typeof window === "undefined" || typeof window["dispatchEvent"] !== 'function') {
        return;
      }
      const _0x40a487 = Array["isArray"](_0x36f4f9) ? _0x36f4f9["filter"](_0x197a47 => _0x197a47 && typeof _0x197a47 === "object" && !_0x197a47["error"]) : [];
      if (_0x40a487["length"] === 0x0) {
        return;
      }
      const _0x1789f7 = _0xcebdf2["getState"]()["nodes"]?.[this['nodeId']] || this['_data'] || {};
      try {
        window['dispatchEvent'](new CustomEvent(GENERATION_HISTORY_EVENT, {
          'detail': {
            'kind': 'image',
            'sourceNodeId': this["nodeId"],
            'nodeData': _0x1789f7,
            'images': _0x40a487,
            'startedAt': _0x4b082a,
            'createdAt': Date['now']()
          }
        }));
      } catch {}
    }
    ["_getImageGenerationResultError"](_0x49006d) {
      return getImageGenerationResultError(_0x49006d);
    }
    async ["_buildResumePayload"](_0xdd9ad1 = this["_data"], _0x636b13 = {}) {
      const _0x25c177 = _0xdd9ad1 || {};
      let _0x13ef9a = String(normalizeDreaminaImageModel(_0x25c177?.["model"], _0x25c177?.["provider"]) || _0x25c177?.["model"] || '')["trim"]();
      const _0x18977c = _0x25c177["generationParams"] && typeof _0x25c177['generationParams'] === 'object' && !Array["isArray"](_0x25c177["generationParams"]) ? _0x25c177["generationParams"] : {};
      const _0x492efc = getModelManifest(_0x13ef9a);
      if (!_0x492efc) {
        throw new Error("Missing model manifest: " + _0x13ef9a);
      }
      const _0x415094 = sanitizeTaskGenerationParams(_0x13ef9a, _0x18977c);
      const _0x1d09fb = _0x492efc["adapterType"] === "modelApi";
      const _0x2b8ed6 = Array['isArray'](_0x492efc?.['uiSchema']?.['fields']) ? _0x492efc["uiSchema"]['fields'] : [];
      const {
        getManifestField: _0x452105,
        readSchemaParam: _0x4c69ec,
        requireSchemaParam: _0x2b1d9b
      } = createSchemaParamAccess({
        'model': _0x13ef9a,
        'data': this["_data"],
        'generationParams': _0x415094,
        'manifestFields': _0x2b8ed6
      });
      const _0x7f0d97 = _0x452105("imageSize") ? _0x2b1d9b('imageSize') : undefined;
      const _0x224df8 = _0x1d09fb ? _0x4c69ec("mode") : undefined;
      const _0x2edbc6 = resolveNanoBananaSelectionFromModel(_0x13ef9a, _0x7f0d97 || '2K', _0x25c177?.["provider"]);
      if (_0x2edbc6) {
        if (!_0x1d09fb && _0x224df8 !== undefined) {
          _0x13ef9a = resolveNanoBananaModelBySelection({
            'family': _0x2edbc6["family"],
            'mode': _0x224df8,
            'imageSize': _0x7f0d97 || '2K',
            'provider': _0x2edbc6['provider'] || _0x25c177?.["provider"]
          });
        } else {
          !_0x1d09fb && (_0x13ef9a = _0x2edbc6['model']);
        }
      }
      const _0x1aba10 = String(_0x636b13?.["providerHint"] || _0x25c177?.["provider"] || '')["trim"]()['toLowerCase']();
      isDreaminaImageModel(_0x13ef9a, _0x1aba10) && (_0x13ef9a = normalizeDreaminaImageModel(_0x13ef9a, _0x1aba10) || _0x13ef9a || getDefaultDreaminaImageModelId());
      const _0x5bb3b0 = this["_inferProviderFromModel"](_0x13ef9a, _0x1aba10);
      const _0x3f0664 = resolveImageSizeForProviderModel({
        'provider': _0x5bb3b0,
        'model': _0x13ef9a,
        'imageSize': _0x7f0d97
      });
      !getModelManifest(_0x13ef9a) && (_0x13ef9a = resolveGrsaiGptImage2ModelForSize({
        'provider': _0x5bb3b0,
        'model': _0x13ef9a,
        'imageSize': _0x3f0664
      }));
      const _0x2ede1f = getRunningHubTaskProviderProfileId(_0x25c177);
      const _0x478950 = resolveModelGenerationProviderProfileId(_0x13ef9a, _0x5bb3b0, _0x2ede1f);
      await _0x554ecc();
      const _0x28cd93 = _0xb2beda(_0x478950 || _0x5bb3b0) || {};
      let _0x54490c = '';
      if (_0x5bb3b0 === "runninghub") {
        _0x54490c = isModelApiModel(_0x13ef9a, _0x5bb3b0) ? _0x28cd93["modelApiKey"] || '' : _0x28cd93["apiKey"] || '';
      } else {
        _0x5bb3b0 === 'runninghubwf' ? _0x54490c = _0x28cd93['apiKey'] || '' : _0x54490c = _0x28cd93['apiKey'] || globalThis["window"]?.['_appApiKey'] || '';
      }
      return {
        'nodeId': this["nodeId"],
        'model': _0x13ef9a,
        'provider': _0x5bb3b0,
        ...(_0x478950 ? {
          'providerProfileId': _0x478950,
          'rhProviderProfileId': _0x478950
        } : {}),
        'apiKey': _0x54490c
      };
    }
    async ["_maybeResumeRunningHubTaskImpl"]() {
      const _0x21a64f = _0x4c18a5()['nodes']?.[this["nodeId"]] || this["_data"] || {};
      if (this["_isGenerating"] && _0x21a64f?.['rhTaskRecovering'] !== !![]) {
        return;
      }
      if (!this['_isRunninghubTaskModel'](_0x21a64f?.["model"], _0x21a64f?.["provider"])) {
        this["_stopRunningHubRecovery"](![]);
        return;
      }
      if (!this["_isRunningHubRecoverableRunningTask"](_0x21a64f)) {
        this["_stopRunningHubRecovery"](![]);
        return;
      }
      const _0x24c343 = String(_0x21a64f?.["rhTaskId"] || '')['trim']();
      if (!_0x24c343) {
        this["_stopRunningHubRecovery"](![]);
        return;
      }
      if (this["_rhResumeTaskId"] === _0x24c343 && this["_rhResumePromise"]) {
        return;
      }
      this['_stopRunningHubRecovery'](![]);
      const _0x472d34 = Number(_0x21a64f?.["rhTaskStartedAt"] || _0x21a64f?.["generationStartTime"] || Date["now"]());
      const _0x51a3aa = _0x21a64f?.['rhTaskUseOpenapiQuery'] === !![] || isModelApiModel(_0x21a64f?.['model'], _0x21a64f?.['provider'] || 'runninghub');
      this["_rhResumeTaskId"] = _0x24c343;
      const _0x49dd62 = (async () => {
        let _0x28c455 = null;
        const _0x3affc7 = this["_isRunninghubWorkflowModel"](_0x21a64f?.["model"], _0x21a64f?.["provider"]);
        const _0xaa4dc4 = shouldUseImageWorkflowBusyButton(_0x21a64f?.['model']);
        try {
          const _0xd63bff = await this['_buildResumePayload'](_0x21a64f);
          if (!_0xd63bff) {
            return;
          }
          _0x28c455 = new AbortController();
          this["_rhResumeAbortController"] = _0x28c455;
          this['_rhTaskId'] = _0x24c343;
          this['_rhApiKey'] = String(_0xd63bff?.["apiKey"] || '')['trim']() || this["_rhApiKey"] || null;
          this['_rhCancelRequested'] = ![];
          this['_isGenerating'] = !![];
          this["btnEl"] && (_0x3affc7 ? setGenerateButtonCancellableUi(this["btnEl"], {
            'busy': _0xaa4dc4
          }) : setGenerateButtonLoadingUi(this["btnEl"]));
          _0x16225d(this["previewEl"]);
          const _0x49bbd1 = await _0x532ffa(createGenerationResumePlanFromNode({
            'kind': "image",
            'node': _0x21a64f,
            'taskProtocol': 'workflow',
            'sourceNodeId': this['nodeId'],
            'targetNodeId': this["nodeId"],
            'trigger': "node",
            'taskType': 'image-generation',
            'payload': _0xd63bff,
            'cancellable': _0x3affc7,
            'resumable': !![],
            'pauseOnAbort': !![],
            'startBuilder': () => ({
              'rhStatusMessage': null,
              'rhStatusCode': null,
              'rhTaskUseOpenapiQuery': _0x51a3aa
            }),
            'onTaskStart': () => {
              this["_persistRunningHubResumeCache"]();
            },
            'poll': async () => _0x5bad71['resumeRunningHubImageTask'](_0x24c343, _0xd63bff, {
              'signal': _0x28c455["signal"],
              'useOpenapiQuery': _0x51a3aa
            }),
            'resultBuilder': async (_0x5fc00f, _0x7dd76d) => {
              const _0x33f04a = this["_getImageGenerationResultError"](_0x5fc00f);
              if (_0x33f04a) {
                throw new Error(_0x33f04a);
              }
              const _0x247c6a = this['_applyImageGenerationResult'](_0x5fc00f, _0x7dd76d['startedAt'], {
                'writeStore': ![]
              });
              return {
                ...(_0x247c6a?.["patch"] || {}),
                ...this["_buildRunningHubTaskPatch"]({
                  'taskId': _0x24c343,
                  'status': "success",
                  'startedAt': _0x7dd76d['startedAt'],
                  'recovering': ![],
                  'useOpenapiQuery': _0x51a3aa
                })
              };
            },
            'failureBuilder': (_0x53230d, _0x2d0330) => ({
              ...buildImageGenerationFailurePatch({
                'error': _0x53230d?.['message'] || t("aigenImage.task.generationFailed"),
                'startedAt': _0x2d0330["startedAt"]
              }),
              'rhStatusMessage': _0x53230d?.['message'] || t("aigenImage.task.generationFailed"),
              'rhStatusCode': Number['isFinite'](Number(_0x53230d?.["code"])) ? Number(_0x53230d["code"]) : null,
              ...this["_buildRunningHubTaskPatch"]({
                'taskId': _0x24c343,
                'status': "failed",
                'startedAt': _0x2d0330["startedAt"],
                'recovering': ![],
                'useOpenapiQuery': _0x51a3aa
              })
            }),
            'cancelledBuilder': _0x3cbe2a => {
              const _0x412454 = _0x3cbe2a['getTaskNode']?.() || {};
              const _0x5842b8 = _0x412454["generationDuration"] == null ? Date["now"]() - _0x3cbe2a["startedAt"] : _0x412454['generationDuration'];
              return this["_buildRunningHubCancelResultPatch"]({
                'latest': _0x412454,
                'message': _0x412454['rhStatusMessage'] || t("aigenImage.task.interrupted"),
                'code': _0x412454["rhStatusCode"],
                'duration': _0x5842b8,
                'taskId': _0x24c343
              });
            },
            'parseError': _0x521788 => getGenerationErrorMessage(_0x521788, t("aigenImage.task.generationFailed"))
          }), {
            'store': _0xcebdf2,
            'startedAt': _0x472d34,
            'abortController': _0x28c455
          });
          if (_0x49bbd1["status"] === "pending") {
            this['_persistRunningHubResumeCache']();
            return;
          }
          this["_persistRunningHubResumeCache"]();
        } catch (_0x146ca8) {
          if (_0x28c455?.["signal"]?.["aborted"] || isGenerationAbortError(_0x146ca8)) {
            return;
          }
          _0xcebdf2["updateNodeData"](this["nodeId"], {
            'generationDuration': Math['max'](0x0, Date["now"]() - _0x472d34),
            'rhStatusMessage': _0x146ca8?.["message"] || t("aigenImage.task.generationFailed"),
            'rhStatusCode': Number["isFinite"](Number(_0x146ca8?.["code"])) ? Number(_0x146ca8['code']) : null,
            ...this["_buildRunningHubTaskPatch"]({
              'taskId': _0x24c343,
              'status': 'failed',
              'startedAt': _0x472d34,
              'recovering': ![],
              'useOpenapiQuery': _0x51a3aa
            })
          });
          this["_persistRunningHubResumeCache"]();
        } finally {
          _0x28c455 && this["_rhResumeAbortController"] === _0x28c455 && (this["_rhResumeAbortController"] = null);
          this["_rhResumeTaskId"] === _0x24c343 && (this['_rhResumeTaskId'] = '');
          this["_rhResumePromise"] = null;
          const _0xe9bc6e = this['_syncLocalTaskNodeData']();
          const _0x31085f = shouldShowGenerationBusyUi(_0xe9bc6e);
          this["_isGenerating"] = _0x31085f;
          if (_0x31085f) {
            this["_rhTaskId"] = String(_0xe9bc6e?.["rhTaskId"] || _0x24c343 || '')["trim"]();
          } else {
            this['_rhTaskId'] = null;
            if (!this["_rhCancelRequested"]) {
              this["_rhApiKey"] = null;
            }
            this["btnEl"] && resetGenerateButtonIdleUi(this['btnEl']);
            _0x23d14c(this["previewEl"]);
          }
          this["_updateSubmitButtonState"]();
        }
      })();
      this["_rhResumePromise"] = _0x49dd62;
    }
    async ["_maybeResumeDreaminaTaskImpl"]() {
      const _0x3949d5 = _0x4c18a5()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      const _0x4805f3 = String(_0x3949d5?.['dreaminaSubmitId'] || '')['trim']();
      const _0x5d3c8a = String(this["_dreaminaActiveSubmitId"] || '')["trim"]();
      if (this["_isGenerating"] && _0x3949d5?.['dreaminaTaskRecovering'] !== !![] && _0x5d3c8a && _0x5d3c8a === _0x4805f3 && !this["_isStaleActiveDreaminaTask"](_0x3949d5)) {
        return;
      }
      if (!this['_isDreaminaImageNode'](_0x3949d5)) {
        this["_stopDreaminaRecovery"](![]);
        return;
      }
      if (!this["_isDreaminaRecoverableRunningTask"](_0x3949d5)) {
        this["_stopDreaminaRecovery"](![]);
        return;
      }
      if (!_0x4805f3) {
        this['_stopDreaminaRecovery'](![]);
        return;
      }
      if (this["_dreaminaResumeSubmitId"] === _0x4805f3) {
        return;
      }
      this["_stopDreaminaRecovery"](![]);
      const _0x16fe24 = Number(_0x3949d5?.['dreaminaTaskStartedAt'] || _0x3949d5?.["generationStartTime"] || Date["now"]());
      this["_dreaminaResumeSubmitId"] = _0x4805f3;
      const _0x3469b7 = (async () => {
        let _0x2d3014 = null;
        try {
          const _0x4b090a = await this["_buildResumePayload"](_0x3949d5);
          if (!_0x4b090a) {
            return;
          }
          _0x2d3014 = new AbortController();
          this["_dreaminaResumeAbortController"] = _0x2d3014;
          this["_isGenerating"] = !![];
          this['btnEl'] && setGenerateButtonLoadingUi(this["btnEl"]);
          _0x16225d(this["previewEl"]);
          const _0x53feb1 = await _0x532ffa(createGenerationResumePlanFromNode({
            'kind': "image",
            'node': _0x3949d5,
            'taskProtocol': "dreamina",
            'sourceNodeId': this["nodeId"],
            'targetNodeId': this["nodeId"],
            'trigger': "node",
            'taskType': "image-generation",
            'payload': _0x4b090a,
            'cancellable': ![],
            'resumable': !![],
            'pauseOnAbort': !![],
            'startBuilder': () => this["_buildDreaminaTaskPatch"]({
              'submitId': _0x4805f3,
              'status': "pending",
              'phase': "generating",
              'label': String(_0x3949d5?.["dreaminaTaskLabel"] || '')['trim']() || t("aigenImage.task.generating"),
              'startedAt': _0x16fe24,
              'lastCheckedAt': Date["now"](),
              'recovering': !![],
              'raw': _0x3949d5?.["dreaminaTaskLastRaw"] || {}
            }),
            'onTaskStart': () => {
              this["_persistDreaminaResumeCache"]();
            },
            'pauseBuilder': _0x3b96eb => this['_buildDreaminaTaskPatch']({
              'submitId': _0x4805f3,
              'status': String(_0x3949d5?.["dreaminaTaskStatus"] || '')["trim"]() || "pending",
              'phase': String(_0x3949d5?.["dreaminaTaskPhase"] || '')["trim"]() || "generating",
              'label': String(_0x3949d5?.["dreaminaTaskLabel"] || '')["trim"]() || t('aigenImage.task.generating'),
              'startedAt': _0x3b96eb["startedAt"],
              'lastCheckedAt': Date["now"](),
              'recovering': ![],
              'raw': _0x3949d5?.["dreaminaTaskLastRaw"] || {}
            }),
            'poll': async () => _0x5bad71['resumeDreaminaImageTask'](_0x4805f3, _0x4b090a, {
              'signal': _0x2d3014["signal"]
            }),
            'resultBuilder': async (_0x50ceff, _0x5b1c48) => {
              const _0x4012af = this["_getImageGenerationResultError"](_0x50ceff);
              if (_0x4012af) {
                throw new Error(_0x4012af);
              }
              const _0x5a5680 = this["_applyImageGenerationResult"](_0x50ceff, _0x5b1c48["startedAt"], {
                'writeStore': ![]
              });
              return {
                ...(_0x5a5680?.["patch"] || {}),
                ...this["_buildDreaminaTaskPatch"]({
                  'submitId': _0x4805f3,
                  'status': "success",
                  'phase': "done",
                  'label': t("aigenImage.task.completed"),
                  'startedAt': _0x5b1c48["startedAt"],
                  'lastCheckedAt': Date['now'](),
                  'recovering': ![],
                  'raw': {}
                })
              };
            },
            'failureBuilder': (_0x5da854, _0x108386) => this['_buildDreaminaFailurePatch']({
              'error': _0x5da854,
              'startedAt': _0x108386["startedAt"],
              'submitId': _0x4805f3,
              'lastCheckedAt': Date['now'](),
              'raw': {}
            }),
            'cancelledBuilder': _0x50a1c8 => ({
              'generationDuration': Date['now']() - _0x50a1c8["startedAt"],
              ...this['_buildDreaminaTaskPatch']({
                'submitId': _0x4805f3,
                'status': "pending",
                'phase': "generating",
                'label': String(_0x3949d5?.["dreaminaTaskLabel"] || '')['trim']() || t('aigenImage.task.generating'),
                'startedAt': _0x50a1c8["startedAt"],
                'lastCheckedAt': Date["now"](),
                'recovering': ![],
                'raw': _0x3949d5?.["dreaminaTaskLastRaw"] || {}
              })
            }),
            'parseError': _0x2ac35e => getGenerationErrorMessage(_0x2ac35e, t("aigenImage.task.generationFailed"))
          }), {
            'store': _0xcebdf2,
            'startedAt': _0x16fe24,
            'abortController': _0x2d3014
          });
          if (_0x53feb1["status"] === 'pending') {
            this["_persistDreaminaResumeCache"]();
            return;
          }
          _0x53feb1["status"] === 'failed' && (this["_dreaminaActiveSubmitId"] = '');
          this["_persistDreaminaResumeCache"]();
        } catch (_0x40e9eb) {
          if (_0x2d3014?.["signal"]?.['aborted'] || isGenerationAbortError(_0x40e9eb)) {
            return;
          }
          this["_finalizeDreaminaImageFailure"]({
            'error': _0x40e9eb,
            'startedAt': _0x16fe24,
            'submitId': _0x4805f3,
            'lastCheckedAt': Date["now"](),
            'raw': {}
          });
        } finally {
          _0x2d3014 && this["_dreaminaResumeAbortController"] === _0x2d3014 && (this["_dreaminaResumeAbortController"] = null);
          this["_dreaminaResumeSubmitId"] === _0x4805f3 && (this["_dreaminaResumeSubmitId"] = '');
          this["_dreaminaResumePromise"] = null;
          const _0x4c375f = this['_syncLocalTaskNodeData']();
          const _0x13ffe7 = shouldShowGenerationBusyUi(_0x4c375f);
          this["_isGenerating"] = _0x13ffe7;
          !_0x13ffe7 && (this["btnEl"] && resetGenerateButtonIdleUi(this['btnEl']), _0x23d14c(this["previewEl"]));
          this["_updateSubmitButtonState"]();
        }
      })();
      this["_dreaminaResumePromise"] = _0x3469b7;
    }
    async ["_maybeResumeAsyncTaskImpl"]() {
      const _0x17db62 = _0x4c18a5()['nodes']?.[this["nodeId"]] || this["_data"] || {};
      if (this['_isGenerating'] && _0x17db62?.["asyncTaskRecovering"] !== !![]) {
        return;
      }
      if (!this['_isAsyncRecoverableRunningTask'](_0x17db62)) {
        const _0x324c49 = await this["_maybeFallbackRegenerateAsyncTask"](_0x17db62);
        if (_0x324c49) {
          return;
        }
        this["_stopAsyncRecovery"](![]);
        return;
      }
      const _0xe78352 = String(_0x17db62?.["asyncTaskId"] || '')['trim']();
      if (!_0xe78352) {
        const _0x2a6d84 = await this["_maybeFallbackRegenerateAsyncTask"](_0x17db62);
        if (_0x2a6d84) {
          return;
        }
        this["_stopAsyncRecovery"](![]);
        return;
      }
      const _0x24e033 = this['_getGenerationTaskRecoveryOwner']();
      const _0x9e858e = _0x24e033["claim"]('asyncModelApi', _0xe78352);
      if (!_0x9e858e['claimed']) {
        return _0x9e858e["promise"];
      }
      const _0x2f25cb = Number(_0x17db62?.['asyncTaskStartedAt'] || _0x17db62?.["generationStartTime"] || Date['now']());
      const _0x3ce94c = this["_inferProviderFromModel"](_0x17db62?.['model'], _0x17db62?.["asyncTaskProvider"] || _0x17db62?.["provider"] || '');
      const _0x39d16e = _0x9e858e['controller'];
      const _0x335a26 = (async () => {
        try {
          const _0x18f0c0 = await this['_buildResumePayload'](_0x17db62, {
            'providerHint': _0x3ce94c
          });
          if (!_0x18f0c0) {
            return;
          }
          this["_isGenerating"] = !![];
          this['btnEl'] && setGenerateButtonLoadingUi(this["btnEl"]);
          _0x16225d(this["previewEl"]);
          const _0x947eb4 = await _0x532ffa(createGenerationResumePlanFromNode({
            'kind': "image",
            'node': _0x17db62,
            'taskProtocol': 'asyncModelApi',
            'sourceNodeId': this["nodeId"],
            'targetNodeId': this["nodeId"],
            'trigger': "node",
            'taskType': "image-generation",
            'payload': _0x18f0c0,
            'pauseOnAbort': !![],
            'persistTaskState': () => this['_persistAsyncResumeCache'](),
            'poll': async () => _0x5bad71['resumeAsyncImageTask'](_0xe78352, _0x18f0c0, {
              'signal': _0x39d16e["signal"]
            }),
            'resultBuilder': async (_0x5ca7b2, _0x2d9432) => {
              const _0x13ccd1 = this['_getImageGenerationResultError'](_0x5ca7b2);
              if (_0x13ccd1) {
                throw new Error(_0x13ccd1);
              }
              const _0x40857 = this['_applyImageGenerationResult'](_0x5ca7b2, _0x2d9432["startedAt"], {
                'writeStore': ![]
              });
              return _0x40857?.["patch"] || {};
            },
            'parseError': _0x3a9206 => getGenerationErrorMessage(_0x3a9206, t("aigenImage.task.generationFailed"))
          }), {
            'store': _0xcebdf2,
            'startedAt': _0x2f25cb,
            'abortController': _0x39d16e
          });
          if (_0x947eb4["status"] === "pending") {
            return;
          }
        } catch (_0xcbc64a) {
          if (_0x39d16e?.['signal']?.["aborted"] || isGenerationAbortError(_0xcbc64a)) {
            return;
          }
          _0xcebdf2["updateNodeData"](this["nodeId"], {
            'generationDuration': Math["max"](0x0, Date['now']() - _0x2f25cb),
            ...this["_buildAsyncTaskPatch"]({
              'provider': _0x3ce94c,
              'kind': "image",
              'taskId': _0xe78352,
              'status': 'failed',
              'startedAt': _0x2f25cb,
              'recovering': ![]
            })
          });
          this["_persistAsyncResumeCache"]();
        } finally {
          _0x24e033["finish"]('asyncModelApi', {
            'taskId': _0xe78352,
            'controller': _0x39d16e
          });
          const _0x793f9 = this["_syncLocalTaskNodeData"]();
          const _0x4c9bb0 = _0x24e033["isBusy"](_0x793f9);
          this['_isGenerating'] = _0x4c9bb0;
          !_0x4c9bb0 && (this['btnEl'] && resetGenerateButtonIdleUi(this['btnEl']), _0x23d14c(this['previewEl']));
          this['_updateSubmitButtonState']();
        }
      })();
      _0x24e033["setPromise"]("asyncModelApi", _0x335a26);
    }
    async ['_buildPayload'](_0x1dc041 = null) {
      const _0x1c2257 = createPayloadObjectUrlLease({
        'ownerId': "ai-image:" + this["nodeId"] + ':payload',
        'kind': "image"
      });
      try {
        const _0xbe33d6 = _0xcebdf2["getState"]();
        const _0xff7612 = _0xbe33d6["nodes"]?.[this["nodeId"]];
        if (_0xff7612) {
          this['_data'] = _0xff7612;
        }
        const _0x1925f8 = _0xcebdf2['getIncomingEdges'](this["nodeId"]);
        const _0x275d5c = _0xbe33d6["nodes"] || {};
        const _0x155c88 = getTargetInputPolicy(_0x275d5c?.[this["nodeId"]] || this["_data"] || {});
        const _0x39ab97 = getFixedInputSlotConfigFromManifest(_0x275d5c?.[this["nodeId"]] || this["_data"] || {});
        const _0x40baaf = getImageNodeInputGate(this["_data"]?.["model"]);
        const _0x216ffd = String(_0x40baaf["kind"] || '')["trim"]();
        const _0x50fb24 = Number(_0x40baaf['max']);
        const _0xfd7122 = isRhPersonReplaceWorkflowModel(this["_data"]?.["model"]);
        const _0x3c40c0 = isRhQwenImageEditModel(this['_data']?.["model"]);
        const _0x24c05b = getModelManifest(this["_data"]?.['model'])?.["inputSlots"];
        const _0x3ed6a6 = Math["max"](0x0, Number(_0x24c05b?.["maxByKind"]?.["image"]) || 0x0);
        const _0x126cd9 = _0x3ed6a6 || 0x3;
        const _0x599892 = getImageInputGateUploadedUrl(this["_data"], _0x40baaf);
        const _0x12ffdd = {
          'text': [],
          'image': [],
          'video': [],
          'audio': []
        };
        const _0x884b89 = {
          'text': 0x0,
          'image': 0x0,
          'video': 0x0,
          'audio': 0x0
        };
        const _0x238ef8 = new Map();
        for (const _0x47b36b of _0x1925f8) {
          const _0x4f7bef = _0x275d5c[_0x47b36b['sourceId']];
          if (!_0x4f7bef) {
            continue;
          }
          const _0x33de04 = resolveEffectiveInputKind(_0x4f7bef, _0x47b36b);
          if (!_0x33de04) {
            continue;
          }
          if (!isInputKindAllowed(_0x155c88, _0x33de04)) {
            continue;
          }
          if (_0x216ffd && _0x33de04 !== _0x216ffd) {
            continue;
          }
          if (_0x216ffd && Number['isFinite'](_0x50fb24) && _0x884b89[_0x216ffd] >= _0x50fb24) {
            continue;
          }
          if (_0xfd7122 && _0x33de04 !== "image") {
            continue;
          }
          if (_0xfd7122 && _0x884b89['image'] >= 0x2) {
            continue;
          }
          if (_0x3c40c0 && _0x33de04 !== "image") {
            continue;
          }
          if (_0x3c40c0 && _0x884b89["image"] >= _0x126cd9) {
            continue;
          }
          let _0x2fa608 = '';
          let _0xb512e0 = '';
          if (_0x33de04 === "text") {
            _0x2fa608 = (_0x4f7bef['outputText'] || _0x4f7bef["text"] || _0x4f7bef["content"] || _0x4f7bef["prompt"] || _0x4f7bef["label"] || '')["trim"]();
            if (!_0x2fa608) {
              continue;
            }
          } else {
            _0x33de04 === 'image' && (_0xb512e0 = resolveGenerationInputImageUrl(_0x4f7bef));
            if (!_0xb512e0 && _0x4f7bef["sourceId"]) {
              const _0x2e20a1 = await _0x255c6c(_0x4f7bef["sourceId"]);
              _0x2e20a1 && (_0xb512e0 = _0x1c2257["create"](_0x2e20a1, {
                'sourceUrl': _0x4f7bef["sourceId"]
              }));
            }
            if (!_0xb512e0) {
              _0xb512e0 = _0x4f7bef["src"] || _0x4f7bef["imageUrl"] || _0x4f7bef["thumbUrl"] || '';
            }
            if (!_0xb512e0) {
              continue;
            }
          }
          _0x884b89[_0x33de04]++;
          const _0x385f6c = buildReferenceLabelAliases(_0x33de04, _0x884b89[_0x33de04]);
          const _0xf95cfb = _0x385f6c[0x0];
          const _0x58a9b1 = _0x33de04 === 'image' ? String(_0x4f7bef["mask"] || '') : '';
          const _0x41898b = _0x58a9b1["trim"]();
          const _0x49eb7b = _0x33de04 === "image" && _0x41898b ? _0x41898b["startsWith"]('/') ? _0x41898b : '/' + _0x41898b["replace"](/^\//, '') : '';
          if (_0x33de04 === 'image' && _0x49eb7b) {
            _0x238ef8["set"](_0xb512e0, _0x49eb7b);
          }
          _0x12ffdd[_0x33de04]['push']({
            'label': _0xf95cfb,
            'labels': _0x385f6c,
            'content': _0x2fa608,
            'url': _0xb512e0,
            'maskUrl': _0x49eb7b,
            'used': ![],
            'sourceId': _0x47b36b["sourceId"],
            'refSlot': _0x47b36b['refSlot'] || ''
          });
        }
        const _0x1706ee = [..._0x12ffdd["text"], ..._0x12ffdd['image'], ..._0x12ffdd['video'], ..._0x12ffdd["audio"]];
        const _0xfa28a0 = {};
        _0x1706ee['forEach'](_0x389eb6 => {
          (_0x389eb6['labels'] || [_0x389eb6['label']])["forEach"](_0xec03cd => {
            _0xfa28a0[_0xec03cd["replace"](/\s+/g, '')] = _0x389eb6;
          });
        });
        const _0x5f11d0 = {};
        _0x1706ee["forEach"](_0x12ff78 => {
          if (_0x12ff78["sourceId"]) {
            _0x5f11d0[_0x12ff78["sourceId"]] = _0x12ff78;
          }
        });
        let _0x5338db = [];
        const _0x6df621 = [];
        const {
          mediaCounts: _0x4283e6,
          dedupeState: _0x999211
        } = createPromptMediaReferenceState(Object["entries"](_0x12ffdd)["flatMap"](([_0x2a9c12, _0x1e453c]) => _0x1e453c["map"](_0x52194f => ({
          ..._0x52194f,
          'type': _0x2a9c12
        }))));
        const _0x527382 = _0x275d5c?.[this['nodeId']] || this["_data"] || {};
        const _0x506bb9 = getPromptAssetInputRefsFromNode(_0x527382, {
          'allowedTypes': ["image"]
        });
        const _0x95f981 = () => (_0x12ffdd['image'] || [])["some"](_0x41c7ba => !!_0x41c7ba['url']) || _0x5338db['some'](Boolean) || _0x6df621["some"](_0x574dc6 => _0x574dc6["type"] === "image" && _0x574dc6["url"]) || _0x506bb9["some"](_0x33c357 => {
          const _0x5340b0 = resolveEffectiveInputKind(_0x33c357) || _0x33c357['type'];
          return _0x5340b0 === "image" && !!_0x33c357["url"];
        });
        const _0x4770a9 = _0x5d04e6 => {
          let _0x3d2be1 = '';
          for (const _0x53af51 of readImagePromptParts(_0x5d04e6, this['_data']?.["prompt"])) {
            if (!_0x53af51["reference"]) {
              _0x3d2be1 += _0x53af51["text"];
            } else {
              const _0x3277df = _0x53af51['nodeId'];
              const _0x10089e = _0x53af51["label"];
              const _0x10fb6d = [];
              if (appendAssetMentionToPrompt({
                'domNode': _0x53af51["domNode"],
                'resolveAssetMentionRef': () => resolveImagePromptAsset(_0x53af51),
                'rawLabel': _0x10089e,
                'promptParts': _0x10fb6d,
                'inputRefs': _0x6df621,
                'mediaCounts': _0x4283e6,
                'dedupeState': _0x999211,
                'allowedTypes': ["text", 'image']
              })) {
                _0x3d2be1 += _0x10fb6d["join"]('');
                _0x6df621["forEach"](_0x473846 => {
                  _0x473846["type"] === "image" && _0x473846['url'] && !_0x5338db['includes'](_0x473846['url']) && _0x5338db["push"](_0x473846["url"]);
                });
                continue;
              }
              const _0x5df54f = getImagePromptReferenceLabel(_0x53af51, _0x10089e) || _0x10089e;
              const _0x4f10d2 = _0x5df54f['replace'](/\s+/g, '');
              const _0x5b9e69 = _0x3277df && _0x5f11d0[_0x3277df] || _0xfa28a0[_0x4f10d2];
              const _0x2abdd3 = getImagePromptReferenceLabel(_0x53af51, _0x5b9e69?.["label"] || _0x5df54f) || _0x5df54f;
              if (_0x5b9e69) {
                _0x5b9e69["used"] = !![];
                if (_0x5b9e69['content']) {
                  _0x3d2be1 += '\x20' + _0x5b9e69["content"] + '\x20';
                } else {
                  if (_0x5b9e69['url']) {
                    _0x3d2be1 += '\x20' + _0x2abdd3 + '\x20';
                    if (!_0xfd7122 && !_0x5338db["includes"](_0x5b9e69["url"])) {
                      _0x5338db["push"](_0x5b9e69["url"]);
                    }
                  }
                }
              } else {
                _0x3d2be1 += '\x20' + _0x2abdd3 + '\x20';
              }
            }
          }
          let _0x2afee9 = _0x3d2be1["replace"](/[\s\u00A0\u200B-\u200D\uFEFF]+/g, '\x20')["trim"]();
          if (_0x1dc041) {
            let _0x4f1da3 = _0x2afee9;
            if (requiresPromptPresetInput(_0x1dc041)) {
              const _0x144961 = [];
              _0x12ffdd['text']["forEach"](_0xc5cd9b => {
                const _0x488045 = (_0xc5cd9b["labels"] || [_0xc5cd9b["label"]])["map"](_0x4f240e => new RegExp(_0x4f240e['replace'](/[.*+?^${}()|[\]\\]/g, "\\$&")["replace"](/\s+/g, "[\\s\\u00A0]*"), 'g'));
                !_0xc5cd9b["used"] && _0xc5cd9b["content"] && !_0x488045["some"](_0x56fcc6 => _0x56fcc6['test'](_0x2afee9)) && (_0x144961["push"](_0xc5cd9b["content"]), _0xc5cd9b["used"] = !![]);
              });
              _0x4f1da3 = [..._0x144961, _0x2afee9]["filter"](Boolean)["join"]('\x0a')["trim"]();
            }
            _0x2afee9 = resolvePromptPresetTemplate(_0x1dc041, _0x4f1da3, {
              'hasImageInput': _0x95f981
            });
          } else {
            _0x2afee9 = _0x2afee9 || '';
          }
          return _0x2afee9;
        };
        let _0x40c337 = _0x4770a9(this["promptEl"]);
        const _0x27c0b2 = _0x1706ee["flatMap"](_0x522a69 => (_0x522a69["labels"] || [_0x522a69["label"]])["map"](_0x56155c => ({
          'ref': _0x522a69,
          'label': _0x56155c
        })))["sort"]((_0x5d587a, _0x2aaa40) => _0x2aaa40["label"]["length"] - _0x5d587a["label"]['length']);
        _0x27c0b2["forEach"](({
          ref: _0x2777b2,
          label: _0x59afa3
        }) => {
          if (!_0x2777b2["used"]) {
            const _0x3863df = new RegExp(_0x59afa3["replace"](/[.*+?^${}()|[\]\\]/g, "\\$&")["replace"](/\s+/g, "[\\s\\u00A0]*"), 'g');
            if (_0x3863df["test"](_0x40c337)) {
              _0x2777b2["used"] = !![];
              if (_0x2777b2["content"]) {
                _0x40c337 = _0x40c337["replace"](_0x3863df, '\x20' + _0x2777b2["content"] + '\x20');
              } else {
                if (_0x2777b2["url"]) {
                  _0x40c337 = _0x40c337["replace"](_0x3863df, '\x20' + _0x59afa3["trim"]() + '\x20');
                  if (!_0xfd7122 && !_0x5338db['includes'](_0x2777b2['url'])) {
                    _0x5338db['push'](_0x2777b2["url"]);
                  }
                }
              }
            }
          }
        });
        let _0x14c534 = '';
        _0x12ffdd["text"]["forEach"](_0x7b0c74 => {
          !_0x7b0c74["used"] && _0x7b0c74["content"] && (_0x14c534 += _0x7b0c74["content"] + '\x0a', _0x7b0c74["used"] = !![]);
        });
        _0x14c534 && (_0x40c337 = _0x14c534 + _0x40c337);
        !_0xfd7122 && _0x1706ee['forEach'](_0x29e772 => {
          !_0x29e772["used"] && _0x29e772['url'] && !_0x5338db["includes"](_0x29e772['url']) && _0x5338db["push"](_0x29e772["url"]);
        });
        requiresPromptPresetInput(_0x1dc041) && _0x506bb9['forEach'](_0x1eb32c => {
          const _0x59d1a3 = resolveEffectiveInputKind(_0x1eb32c) || _0x1eb32c["type"];
          _0x59d1a3 === "image" && _0x1eb32c["url"] && !_0x5338db['includes'](_0x1eb32c["url"]) && _0x5338db['push'](_0x1eb32c["url"]);
        });
        _0x5338db = reorderImageInputUrlsByRefOrder(_0x5338db, _0x12ffdd["image"]);
        if (_0x216ffd === "image") {
          if (_0x599892) {
            _0x5338db = [_0x599892];
          } else {
            Number["isFinite"](_0x50fb24) && (_0x5338db = _0x5338db["slice"](0x0, _0x50fb24));
          }
        }
        if (_0xfd7122) {
          const _0x23c5aa = ['replaceTarget', "replacedImage"];
          const _0x10d7af = _0x12ffdd["image"] || [];
          const _0x544f9f = _0x1bcba5 => String(_0x10d7af["find"](_0x17bf26 => String(_0x17bf26["refSlot"] || '') === _0x1bcba5)?.['url'] || '');
          const _0x11e3aa = String(_0x10d7af[0x0]?.["url"] || '');
          const _0x2a25b6 = String(_0x10d7af["find"](_0x4df9bf => String(_0x4df9bf["url"] || '') !== _0x11e3aa)?.["url"] || '');
          const _0x357ddc = _0x544f9f(_0x23c5aa[0x0]) || _0x11e3aa;
          const _0x426bc7 = _0x544f9f(_0x23c5aa[0x1]) || _0x2a25b6;
          _0x5338db = [_0x357ddc, _0x426bc7]["filter"](Boolean);
        }
        _0x3c40c0 && (_0x5338db = _0x5338db["filter"](Boolean)["slice"](0x0, _0x126cd9));
        const _0x1a1873 = _0xfd7122 ? {} : buildInputUrlsByFixedImageSlot({
          'fixedInputConfig': _0x39ab97,
          'imageRefs': _0x12ffdd["image"],
          'assetInputRefs': _0x6df621
        });
        const _0xac594b = !!this['_data']?.["rhAiAppManifestBundle"] && _0x1a1873 && typeof _0x1a1873 === "object" && !Array["isArray"](_0x1a1873);
        const _0x5ee2b0 = this["_data"]['generationParams'] && typeof this["_data"]["generationParams"] === 'object' && !Array["isArray"](this['_data']["generationParams"]) ? this["_data"]["generationParams"] : {};
        const _0x385275 = normalizeDreaminaImageModel(this["_data"]["model"], this["_data"]["provider"]) || this["_data"]["model"];
        const _0x20f6e4 = getModelManifest(_0x385275);
        if (!_0x20f6e4) {
          throw new Error("Missing model manifest: " + this["_data"]['model']);
        }
        const _0xfb0446 = sanitizeTaskGenerationParams(_0x385275, _0x5ee2b0);
        const _0x174299 = _0x20f6e4["adapterType"] === "modelApi";
        const _0x44027b = Array["isArray"](_0x20f6e4?.["uiSchema"]?.["fields"]) ? _0x20f6e4["uiSchema"]["fields"] : [];
        const {
          getManifestField: _0x29b91d,
          readSchemaParam: _0x37f6da,
          requireSchemaParam: _0x14bff8
        } = createSchemaParamAccess({
          'model': _0x385275,
          'data': this["_data"],
          'generationParams': _0xfb0446,
          'manifestFields': _0x44027b
        });
        const _0x58ab30 = _0x29b91d("imageSize") ? _0x14bff8("imageSize") : undefined;
        const _0x1a4a78 = _0x29b91d("aspectRatio") ? _0x14bff8("aspectRatio") : "自适应";
        const _0xa9fe5d = resolveImageNodeBatchSize({
          'data': this["_data"],
          'generationParams': _0xfb0446,
          'rawGenerationParams': _0x5ee2b0
        });
        const _0x4c01f3 = _0x174299 && _0x29b91d("google_image_search") ? normalizeTaskBooleanParam(_0x37f6da("google_image_search")) : undefined;
        const _0x18a483 = _0x174299 && _0x29b91d("google_search") ? normalizeTaskBooleanParam(_0x37f6da("google_search")) || _0x4c01f3 === !![] : undefined;
        const _0x216c50 = buildImageSchemaPayloadParams({
          'enabled': _0x174299 || _0x20f6e4['adapterType'] === "workflow",
          'manifestFields': _0x44027b,
          'readSchemaParam': _0x37f6da
        });
        let _0x39e3a9 = _0x385275 || "nano-banana-2";
        const _0x5c82e1 = _0x174299 ? _0x37f6da("mode") : undefined;
        const _0x5e4f37 = _0x37f6da('rhModelRoute');
        const _0x5b1b8b = resolveNanoBananaSelectionFromModel(_0x39e3a9, _0x58ab30 || '2K', this["_data"]["provider"]);
        if (_0x5b1b8b) {
          if (!_0x174299 && _0x5c82e1 !== undefined) {
            _0x39e3a9 = resolveNanoBananaModelBySelection({
              'family': _0x5b1b8b["family"],
              'mode': _0x5c82e1,
              'imageSize': _0x58ab30 || '2K',
              'provider': _0x5b1b8b["provider"] || this["_data"]['provider']
            });
          } else {
            !_0x174299 && (_0x39e3a9 = _0x5b1b8b["model"]);
          }
        }
        isDreaminaImageModel(_0x39e3a9, this["_data"]["provider"]) && (_0x39e3a9 = normalizeDreaminaImageModel(_0x39e3a9, this["_data"]["provider"]) || getDefaultDreaminaImageModelId());
        const _0xe4f5d0 = this["_inferProviderFromModel"](_0x39e3a9, this['_data']['provider']);
        const _0x1f7369 = resolveImageSizeForProviderModel({
          'provider': _0xe4f5d0,
          'model': _0x39e3a9,
          'imageSize': _0x58ab30
        });
        !getModelManifest(_0x39e3a9) && (_0x39e3a9 = resolveGrsaiGptImage2ModelForSize({
          'provider': _0xe4f5d0,
          'model': _0x39e3a9,
          'imageSize': _0x1f7369
        }));
        const _0xe16c3f = isRunningHubWorkflowNode({
          ...this["_data"],
          'model': _0x39e3a9,
          'provider': _0xe4f5d0
        });
        if (_0xe16c3f) {
          const _0x54963a = _0x275d5c?.[this["nodeId"]] || this['_data'] || {};
          getPromptAssetInputRefsFromNode(_0x54963a, {
            'allowedTypes': ["image"]
          })["forEach"](_0x39698a => {
            if (resolveEffectiveInputKind(_0x39698a) !== "image") {
              return;
            }
            if (_0x39698a["url"] && !_0x5338db["includes"](_0x39698a["url"])) {
              _0x5338db["push"](_0x39698a['url']);
            }
          });
        }
        if (_0xe4f5d0 === "dreamina") {
          const _0x152fd3 = [];
          const _0x252e32 = _0x5ae751 => {
            const _0x2a931c = String(_0x5ae751 || '')['trim']();
            if (!_0x2a931c || _0x2a931c["startsWith"]('blob:')) {
              return;
            }
            if (!_0x152fd3['includes'](_0x2a931c)) {
              _0x152fd3["push"](_0x2a931c);
            }
          };
          (_0x12ffdd["image"] || [])["forEach"](_0x57e5c8 => {
            const _0x1dcd8a = _0x275d5c?.[_0x57e5c8?.["sourceId"]] || null;
            const _0xc003db = _0x1dcd8a ? resolveGenerationInputImageUrl(_0x1dcd8a) : '';
            _0x252e32(_0xc003db);
            _0x252e32(_0x57e5c8?.['url']);
          });
          _0x5338db = _0x152fd3["slice"](0x0, 0x1);
        }
        const _0x51b273 = _0x5338db["map"](_0x5da22e => String(_0x238ef8["get"](_0x5da22e) || ''));
        const _0x945433 = [...(_0x12ffdd["text"] || [])["map"](_0x4012be => ({
          'kind': "text",
          'refSlot': _0x4012be?.["refSlot"] || ''
        })), ...(_0x12ffdd["image"] || [])["filter"](_0x334b64 => String(_0x334b64?.["url"] || '')["trim"]())["map"](_0x563ac8 => ({
          'kind': "image",
          'refSlot': _0x563ac8?.["refSlot"] || ''
        })), ...(_0x12ffdd['video'] || [])["filter"](_0x24547e => String(_0x24547e?.["url"] || '')["trim"]())['map'](_0x16d809 => ({
          'kind': 'video',
          'refSlot': _0x16d809?.['refSlot'] || ''
        })), ...(_0x12ffdd["audio"] || [])["filter"](_0x3bb916 => String(_0x3bb916?.["url"] || '')['trim']())["map"](_0x4f0828 => ({
          'kind': "audio",
          'refSlot': _0x4f0828?.['refSlot'] || ''
        })), ..._0x6df621["map"](_0x1acc62 => ({
          'kind': resolveEffectiveInputKind(_0x1acc62) || _0x1acc62?.["type"],
          'refSlot': _0x1acc62?.["refSlot"] || ''
        }))["filter"](_0x406f8f => String(_0x406f8f["kind"] || '')['trim']())];
        const _0x764e8f = countManifestInputRecords(_0x945433);
        _0x764e8f["image"] = _0x5338db["filter"](Boolean)["length"];
        const _0xf12ff3 = {
          ...buildFixedSlotOccupancy({
            'fixedInputConfig': _0x39ab97,
            'inputRecords': _0x945433
          }),
          ...Object["fromEntries"](Object['entries'](_0x1a1873 || {})["filter"](([, _0x50ecc7]) => String(_0x50ecc7 || '')["trim"]())["map"](([_0x5b48a7]) => [_0x5b48a7, !![]]))
        };
        const _0xfad831 = shouldAllowEmptyCustomAiAppInputs(_0x20f6e4);
        const _0x2772f2 = _0xfad831 ? null : getMissingManifestInputRequirement({
          'inputSlots': _0x20f6e4?.['inputSlots'],
          'fixedInputConfig': _0x39ab97,
          'inputCounts': _0x764e8f,
          'occupiedFixedSlots': _0xf12ff3
        });
        if (_0x216ffd === "image" && _0x5338db['length'] === 0x0) {
          window["showToast"]?.(getImageInputGateMissingMessage(_0x40baaf) || t("aigenImage.task.referenceImageRequired"), "warn");
          return null;
        }
        if (_0xfd7122 && _0x5338db["length"] < 0x2) {
          window["showToast"]?.(t('aigenImage.task.replacePairRequired'), 'warn');
          return null;
        }
        if (_0x3c40c0 && _0x5338db["length"] < 0x1) {
          window["showToast"]?.(t("aigenImage.task.referenceImageRequired"), "warn");
          return null;
        }
        if (_0x2772f2) {
          window["showToast"]?.(_0x2772f2["kind"] === 'image' ? t("aigenImage.task.referenceImageRequired") : t("aigenImage.task.promptOrReferenceRequired"), "warn");
          return null;
        }
        const _0x2156b5 = getPromptPresetTemplateEmptyInputMessage(_0x1dc041);
        if (_0x2156b5 && !_0x40c337 && _0x5338db['length'] === 0x0) {
          window["showToast"]?.(_0x2156b5, "warn");
          return null;
        }
        const _0x387c5a = evaluateGenerationPromptBoundary({
          'model': _0x39e3a9,
          'provider': _0xe4f5d0,
          'promptText': _0x40c337,
          'hasInput': Object["values"](_0x764e8f)["some"](_0x24d614 => Number(_0x24d614) > 0x0)
        });
        if (!_0x387c5a['ok']) {
          console["warn"]("[AIGenerateNode] prompt boundary blocked generation");
          window['showToast']?.(t("aigenImage.task.promptOrReferenceRequired"), "warn");
          return null;
        }
        const _0x1a4bc1 = String(_0x275d5c?.[this["nodeId"]]?.["providerProfileId"] || _0x275d5c?.[this["nodeId"]]?.['rhProviderProfileId'] || this["_data"]?.["providerProfileId"] || this['_data']?.['rhProviderProfileId'] || '')['trim']();
        const _0xaeaf15 = resolveModelGenerationProviderProfileId(_0x39e3a9, _0xe4f5d0, _0x1a4bc1);
        await _0x554ecc();
        const _0x332d62 = _0xb2beda(_0xaeaf15 || _0xe4f5d0);
        let _0x1ad9da = '';
        if (_0xe4f5d0 === 'runninghub') {
          _0x1ad9da = isModelApiModel(_0x39e3a9, _0xe4f5d0) ? _0x332d62["modelApiKey"] || '' : _0x332d62["apiKey"] || '';
        } else {
          _0xe4f5d0 === "runninghubwf" ? _0x1ad9da = _0x332d62["apiKey"] || '' : _0x1ad9da = _0x332d62["apiKey"] || window["_appApiKey"] || '';
        }
        let _0x33321f = String(globalThis["window"]?.["__aicInstallId"] || '')["trim"]();
        if (typeof globalThis["window"]?.["ensureSubscriptionInstallId"] === "function") {
          try {
            _0x33321f = String(await window["ensureSubscriptionInstallId"]())["trim"]();
          } catch {}
        }
        const _0x19b9a6 = String(_0x1a4a78 || "自适应")["trim"]();
        const _0x597f1c = isAdaptiveRatioLabel(_0x19b9a6);
        const _0x146c87 = _0x1925f8["filter"](_0x4421a8 => {
          const _0x498851 = String(_0x4421a8?.["refSlot"] || '')["toLowerCase"]();
          if (_0x498851["includes"]('mask')) {
            return ![];
          }
          const _0x3b2a8a = _0x275d5c?.[_0x4421a8?.['sourceId']];
          return resolveEffectiveInputKind(_0x3b2a8a, _0x4421a8) === 'image';
        });
        const _0x19bd94 = pickGenerationRatioSourceEdge(_0x146c87, _0x275d5c?.[this['nodeId']] || this["_data"] || {});
        let _0x17956c = 0x0;
        let _0x47f8cb = 0x0;
        if (_0x19bd94?.["sourceId"]) {
          const _0x5f55f7 = _0x19bd94["sourceId"];
          const _0x5db42d = (_0x80084d["getInputRatioSize"] || getGenerationRatioSizeWithDom)({
            'nodeId': _0x5f55f7,
            'nodeData': _0x275d5c[_0x5f55f7],
            'edge': _0x19bd94,
            'includeNodeFrame': !![]
          });
          _0x5db42d && (_0x17956c = _0x5db42d['width'], _0x47f8cb = _0x5db42d["height"]);
        }
        const _0x1f58ce = _0x275d5c?.[this["nodeId"]] || {};
        const _0x6bb93c = resolveAdaptiveSourceSize({
          'displayWidth': Number(_0x1f58ce?.["width"] || this["_data"]?.["width"] || 0x0),
          'displayHeight': Number(_0x1f58ce?.['height'] || this["_data"]?.["height"] || 0x0),
          'inputWidth': _0x17956c,
          'inputHeight': _0x47f8cb
        });
        const _0x12e08b = _0xe4f5d0 === "dreamina" ? normalizeDreaminaImageAspectRatio(_0x19b9a6) : _0x19b9a6;
        const _0x5263ba = parseRatioLabel(_0x12e08b)?.["label"] || '';
        const _0x5bb1f1 = _0x1f7369;
        const _0x1af38f = _0x597f1c ? pickClosestRatioForProviderModel({
          'provider': _0xe4f5d0,
          'model': _0x39e3a9,
          'width': _0x6bb93c["width"],
          'height': _0x6bb93c["height"],
          'imageSize': _0x5bb1f1
        }) : pickClosestRatioForProviderModel({
          'provider': _0xe4f5d0,
          'model': _0x39e3a9,
          'ratioLabel': _0x5263ba || _0x12e08b || "1:1",
          'imageSize': _0x5bb1f1
        });
        const _0x4e2086 = resolveProviderRatioPayload({
          'provider': _0xe4f5d0,
          'model': _0x39e3a9,
          'ratioLabel': _0x1af38f,
          'imageSize': _0x5bb1f1
        });
        const _0x14ed3a = getRatioCapability(_0xe4f5d0, _0x39e3a9);
        const _0xbca73f = _0x14ed3a === "none";
        const _0xd15c15 = _0xe4f5d0 === "dreamina" ? normalizeDreaminaImageSize(_0x58ab30 || '2K', _0x39e3a9) : _0x3c40c0 && String(_0x1f7369)["toUpperCase"]() === '4K' ? '2K' : _0x1f7369;
        const _0x2aecbe = _0xe4f5d0 === "dreamina" ? getDreaminaImageModelVersion(_0x39e3a9, _0xe4f5d0) : '';
        const _0x337b95 = {
          'prompt': _0x40c337,
          'model': _0x39e3a9,
          'aspectRatio': _0x4e2086["resolvedRatioLabel"],
          'resolvedRatioLabel': _0x4e2086['resolvedRatioLabel'],
          'adaptiveSource': _0x6bb93c["source"],
          'ratioCapability': _0x14ed3a,
          'imageSize': _0xd15c15,
          'modelVersion': _0x2aecbe,
          ..._0x216c50,
          ...(_0x5c82e1 !== undefined ? {
            'mode': _0x5c82e1
          } : {}),
          ...(_0x5e4f37 !== undefined ? {
            'rhModelRoute': _0x5e4f37
          } : {}),
          ...(_0x18a483 !== undefined ? {
            'google_search': _0x18a483
          } : {}),
          ...(_0x4c01f3 !== undefined ? {
            'google_image_search': _0x4c01f3
          } : {}),
          'batchSize': parseInt(_0xa9fe5d) || 0x1,
          'inputUrls': _0x5338db,
          ...(Object["keys"](_0x1a1873)["length"] > 0x0 ? {
            'inputUrlsBySlot': _0x1a1873
          } : {}),
          ...(_0xac594b ? _0x1a1873 : {}),
          'inputMaskUrls': _0x51b273,
          'apiKey': _0x1ad9da,
          'installId': _0x33321f,
          'rhResolution': _0x37f6da("rhResolution") ?? _0x37f6da("rhAnimeRealResolution"),
          'rhAnimeRealResolution': _0x37f6da("rhAnimeRealResolution"),
          'rhInstanceType': _0x37f6da("rhInstanceType"),
          'rhQwenEditMode': _0x3c40c0 ? String(_0x37f6da("rhQwenEditMode") || '')['trim']() : undefined,
          'rhQwenFirstImageMode': _0x3c40c0 ? String(_0x37f6da('rhQwenFirstImageMode') || '')['trim']() : undefined,
          'provider': _0xe4f5d0,
          ...(_0xaeaf15 ? {
            'providerProfileId': _0xaeaf15
          } : {}),
          'cameraAngle': this["_data"]["cameraAngle"] || null,
          'ratioNotice': _0x4e2086["notice"] || '',
          ...(_0xbca73f ? {
            'suppressAspectRatio': !![]
          } : {})
        };
        return _0x1c2257["bind"](_0x337b95);
      } finally {
        _0x1c2257["release"]();
      }
    }
    async ["_handleGenerateOrCancel"](_0x2156d3 = null) {
      const _0x3a3ac1 = _0xcebdf2["getState"]()['nodes']?.[this["nodeId"]] || this['_data'] || {};
      const _0x70b2e = this["_isRunninghubWorkflowModel"](_0x3a3ac1?.["model"], _0x3a3ac1?.['provider']);
      if (shouldAllowCancel(_0x3a3ac1, {
        'cancellable': _0x70b2e,
        'cancelInFlight': this['_rhCancelInFlight'] === !![]
      })) {
        await this["_cancelRunningHubWorkflowTask"]();
        return;
      }
      await this["_onGenerate"](_0x2156d3);
    }
    ['_buildRunningHubCancelResultPatch']({
      latest = {},
      message = t('aigenImage.task.interrupted'),
      code = null,
      duration = null,
      taskId = ''
    } = {}) {
      const _0x26c7a2 = Number(latest?.['rhTaskStartedAt'] || latest?.["generationStartTime"] || 0x0);
      const _0x4e680c = String(message || t('aigenImage.task.interrupted'))['trim']() || t("aigenImage.task.interrupted");
      const _0x430d13 = code === null || code === undefined || code === '' ? null : Number(code);
      return {
        'rhStatusMessage': _0x4e680c,
        'rhStatusCode': Number["isFinite"](_0x430d13) ? _0x430d13 : null,
        'images': [],
        'imageUrl': '',
        'thumbUrl': '',
        'localPath': '',
        ...buildGenerationCancelledPatch({
          'startedAt': _0x26c7a2,
          'duration': duration
        }),
        ...this["_buildRunningHubTaskPatch"]({
          'taskId': taskId,
          'status': "cancelled",
          'startedAt': _0x26c7a2,
          'recovering': ![],
          'useOpenapiQuery': latest?.["rhTaskUseOpenapiQuery"] === !![]
        })
      };
    }
    async ["_cancelRunningHubWorkflowTask"]() {
      const _0x54dd3d = _0xcebdf2["getState"]()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      const _0x331d3c = this["_rhApiKey"] || '';
      const _0x2825c2 = String(this["_rhTaskId"] || '')["trim"]() || String(_0x54dd3d?.['rhTaskId'] || '')['trim']();
      const _0x483f79 = Date["now"]();
      const _0x17cf66 = Number(_0x54dd3d?.["generationStartTime"]);
      const _0x2f6228 = _0x54dd3d?.["generationDuration"] != null ? _0x54dd3d["generationDuration"] : Number["isFinite"](_0x17cf66) && _0x17cf66 > 0x0 ? Math["max"](0x0, _0x483f79 - _0x17cf66) : 0x0;
      this["_rhCancelRequested"] = !![];
      if (this['_rhCancelInFlight']) {
        return;
      }
      this["_rhAbortController"] && !this["_rhAbortController"]["signal"]["aborted"] && this["_rhAbortController"]["abort"]();
      const _0x113463 = !_0x331d3c;
      const _0x29e271 = !_0x2825c2;
      try {
        this["_rhCancelInFlight"] = !![];
        const _0x3c75fb = ({
          remoteResult: _0x5b2235,
          remoteError: _0x30e7cb
        }) => {
          const _0x2137ea = Number(_0x5b2235?.["code"]);
          const _0x19a018 = String(_0x5b2235?.["msg"] || _0x5b2235?.["message"] || '')['trim']();
          const _0x23725d = _0x113463 ? t("aigenImage.task.cancelMissingApiKey") : _0x29e271 ? t('aigenImage.task.interruptedMissingTaskId') : '';
          const _0x2b7e5c = _0x23725d || (_0x30e7cb ? _0x30e7cb["message"] || t("aigenImage.task.cancelFailed") : _0x2137ea === 0x0 ? _0x19a018 || t("aigenImage.task.cancelSuccess") : _0x2137ea === 0x327 ? _0x19a018 || t('aigenImage.task.taskNotFound') : _0x19a018 || t("aigenImage.task.cancelFailed"));
          return this['_buildRunningHubCancelResultPatch']({
            'latest': _0x54dd3d,
            'message': _0x2b7e5c,
            'code': _0x29e271 ? 0x32d : _0x2137ea,
            'duration': _0x2f6228
          });
        };
        await _0x16abbe(this["nodeId"], {
          'store': _0xcebdf2,
          'taskId': _0x2825c2,
          'cancellable': !![],
          'cancel': ({
            taskId: _0x13033c
          }) => {
            if (!_0x331d3c) {
              throw new Error(t("aigenImage.task.cancelMissingApiKey"));
            }
            return _0x5bad71["cancelRunningHubWorkflowTask"]({
              'apiKey': _0x331d3c,
              'taskId': _0x13033c,
              'providerProfileId': _0x54dd3d?.["providerProfileId"] || _0x54dd3d?.["rhProviderProfileId"] || ''
            });
          },
          'cancelledBuilder': _0x3c75fb,
          'spec': createGenerationCancelPlanFromNode({
            'kind': "image",
            'node': _0x54dd3d,
            'taskProtocol': "workflow",
            'sourceNodeId': this["nodeId"],
            'targetNodeId': this["nodeId"],
            'trigger': "node",
            'taskType': "image-generation",
            'payload': _0x54dd3d,
            'cancellable': !![],
            'resumable': !![],
            'cancelledBuilder': _0x3c75fb
          })
        });
        this["_persistRunningHubResumeCache"]();
        const _0x2a48b1 = _0xcebdf2["getState"]()['nodes']?.[this["nodeId"]] || {};
        const _0x27c832 = Number(_0x2a48b1?.["rhStatusCode"]);
        const _0x3fe211 = String(_0x2a48b1?.["rhStatusMessage"] || '')["trim"]();
        if (!_0x113463 && !_0x29e271) {
          if (_0x27c832 === 0x0) {
            window["showToast"]?.(t("aigenImage.task.cancelledToast"), "success");
          } else {
            if (_0x3fe211) {
              window["showToast"]?.(_0x3fe211, "error");
            }
          }
        }
      } finally {
        this['_rhCancelInFlight'] = ![];
        this["_isGenerating"] = ![];
        this["_rhAbortController"] = null;
        this['_rhTaskId'] = null;
        this['_rhApiKey'] = null;
        this["btnEl"] && (resetGenerateButtonIdleUi(this["btnEl"]), this["_updateSubmitButtonState"]());
        _0x23d14c(this["previewEl"]);
      }
    }
    ["_getPreviewGenerateButtonLoadingOptions"]() {
      return createPreviewGenerateButtonCallbacks(this, t("aigenImage.controls.generate"));
    }
    async ['runGeneration'](_0x126414 = {}) {
      return this["_onGenerate"](null, _0x126414);
    }
    async ["cancelGeneration"]() {
      return this['_cancelRunningHubWorkflowTask']();
    }
    ["getGenerationStatus"]() {
      const _0x1cf4d6 = _0xcebdf2["getState"]?.()?.["nodes"]?.[this["nodeId"]] || this['_data'] || {};
      const _0x1657af = String(_0x1cf4d6['jobStatus'] || _0x1cf4d6["asyncTaskStatus"] || _0x1cf4d6["rhTaskStatus"] || (this["_isGenerating"] ? "running" : "idle"));
      return {
        'nodeId': this["nodeId"],
        'jobStatus': _0x1657af,
        'isGenerating': this['_isGenerating'] === !![] || _0x1657af === "running" || _0x1657af === "pending",
        'taskId': String(this['_rhTaskId'] || _0x1cf4d6["rhTaskId"] || _0x1cf4d6['asyncTaskId'] || _0x1cf4d6["taskId"] || ''),
        'cancellable': !![],
        'resumable': Boolean(_0x1cf4d6["asyncTaskId"] || _0x1cf4d6['rhTaskId'])
      };
    }
    async ["_onGenerate"](_0x278bb8 = null, _0x40aa92 = {}) {
      if (this["_isGenerating"] || this['_generationSubmitInFlight'] === !![]) {
        return;
      }
      if (_0x40aa92?.["insertPrompt"] === !![] || shouldUsePromptPreviewForPreset(_0x278bb8) || isPreviewModeEnabled()) {
        return this["_executeGeneration"](_0x278bb8, _0x40aa92);
      }
      this['_generationSubmitInFlight'] = !![];
      this['btnEl'] && setGenerateButtonLoadingUi(this['btnEl'], {
        'title': t("aigenImage.task.submitting"),
        'disabled': !![],
        'ariaLabel': t("aigenImage.task.submitting")
      });
      try {
        return await this['_executeGeneration'](_0x278bb8, _0x40aa92);
      } finally {
        this["_generationSubmitInFlight"] = ![];
        !this["_isGenerating"] && this["btnEl"] && this['_updateSubmitButtonState']?.();
      }
    }
    async ['_executeGeneration'](_0x2b3f43 = null, _0x942225 = {}) {
      if (_0x942225?.["insertPrompt"] === !![]) {
        insertPresetPromptIntoEditor({
          'storeApi': _0xcebdf2,
          'nodeId': this["nodeId"],
          'promptEl': this["promptEl"],
          'template': _0x2b3f43,
          'inEdges': _0xcebdf2["getIncomingEdges"](this['nodeId']),
          'nodes': _0xcebdf2["getState"]()['nodes'] || {},
          'allowedAssetTypes': ["text", "image"]
        });
        this["_updateSubmitButtonState"]?.();
        return;
      }
      if (shouldUsePromptPreviewForPreset(_0x2b3f43)) {
        const _0x3e91eb = await this["_buildPayload"](_0x2b3f43);
        if (!_0x3e91eb) {
          return;
        }
        try {
          previewPresetPromptInEditor({
            'storeApi': _0xcebdf2,
            'nodeId': this["nodeId"],
            'promptEl': this["promptEl"],
            'promptText': _0x3e91eb["prompt"]
          });
        } finally {
          releasePayloadObjectUrlLease(_0x3e91eb);
        }
        return;
      }
      if (isPreviewModeEnabled()) {
        !isPreviewNodeLoading(this["nodeId"]) && startPreviewNodeLoading(this["nodeId"], this["previewEl"], this["_getPreviewGenerateButtonLoadingOptions"]());
        return;
      }
      const _0x2bcd9b = _0xcebdf2["getState"]?.()?.['nodes']?.[this['nodeId']] || this["_data"] || {};
      const _0xa8cd37 = _0x1eec84({
        'modelId': _0x2bcd9b?.["model"],
        'provider': _0x2bcd9b?.["provider"],
        'providerProfileId': _0x2bcd9b?.["providerProfileId"] || _0x2bcd9b?.["rhProviderProfileId"]
      });
      if (!_0xa8cd37["ready"]) {
        return;
      }
      const _0x1b022c = await this["_buildPayload"](_0x2b3f43);
      if (_0x80084d["isTargetCurrent"]?.() === ![]) {
        releasePayloadObjectUrlLease(_0x1b022c);
        return {
          'ok': ![],
          'status': "cancelled",
          'reason': 'target-changed',
          'targetNodeId': this["nodeId"]
        };
      }
      if (!_0x1b022c) {
        return {
          'ok': ![],
          'status': "failed",
          'errorCode': "GENERATION_INPUT_INVALID",
          'message': t("aigenImage.task.promptOrReferenceRequired"),
          'targetNodeId': this["nodeId"],
          'taskId': ''
        };
      }
      try {
        const _0x4f91c9 = getImageProviderApiKeyMissingMessage(_0x1b022c);
        if (_0x4f91c9) {
          showProviderApiKeyMissingToast(_0x4f91c9, {
            'providerId': _0x1b022c?.['providerProfileId'] || _0x1b022c?.["provider"],
            'model': _0x1b022c?.["model"],
            'adapterType': isModelApiModel(_0x1b022c?.["model"], "runninghub") ? "modelApi" : _0x1b022c?.["adapterType"]
          });
          return;
        }
        const _0x380549 = this["_isDreaminaImageNode"](_0x1b022c);
        if (_0x380549) {
          if (this["_dreaminaLoginPreflightInFlight"]) {
            return;
          }
          this['_dreaminaLoginPreflightInFlight'] = !![];
          this["btnEl"] && setGenerateButtonLoadingUi(this["btnEl"], {
            'title': t('aigenImage.task.checkingDreaminaLogin')
          });
          let _0x5ca1d4 = ![];
          try {
            _0x5ca1d4 = await this['_ensureDreaminaCliLoggedIn'](_0x1b022c);
          } finally {
            this["_dreaminaLoginPreflightInFlight"] = ![];
            !_0x5ca1d4 && this["btnEl"] && (resetGenerateButtonIdleUi(this['btnEl']), this["_updateSubmitButtonState"]?.());
          }
          if (!_0x5ca1d4) {
            return;
          }
        }
        const _0x3e988d = this["_isRunninghubTaskModel"](_0x1b022c["model"], _0x1b022c['provider']);
        const _0x5290dd = this["_isRunninghubWorkflowModel"](_0x1b022c['model'], _0x1b022c["provider"]);
        const _0x5bfb6d = _0x380549;
        const _0x3abb2c = this['_inferProviderFromModel'](_0x1b022c?.["model"], _0x1b022c?.["provider"] || this["_data"]?.["provider"] || '');
        const _0x5bb776 = !_0x3e988d && !_0x5bfb6d && isAsyncImageModelApiProvider(_0x3abb2c);
        const _0x507468 = resolveModelProvider(_0x1b022c?.["model"], _0x1b022c?.["provider"], {
          'allowProviderHint': ![]
        }) === "runninghub" && isModelApiModel(_0x1b022c?.['model'], 'runninghub');
        const _0x2fab9b = shouldUseImageWorkflowBusyButton(_0x1b022c["model"]);
        _0x3e988d && this["_stopRunningHubRecovery"](!![]);
        _0x5bfb6d && this["_stopDreaminaRecovery"](!![]);
        _0x5bb776 && this["_stopAsyncRecovery"](!![]);
        this["_rhCancelRequested"] = ![];
        const _0x2756b2 = _0x3e988d || _0x5bfb6d || _0x5bb776;
        this["_rhApiKey"] = _0x3e988d ? _0x1b022c["apiKey"] : null;
        this["_rhTaskId"] = null;
        this["_rhAbortController"] = _0x2756b2 ? new AbortController() : null;
        this["_isGenerating"] = !![];
        this['btnEl'] && (_0x5290dd ? setGenerateButtonCancellableUi(this["btnEl"], {
          'busy': _0x2fab9b
        }) : setGenerateButtonLoadingUi(this['btnEl']));
        _0x16225d(this["previewEl"]);
        const _0x383881 = Number(_0xcebdf2["getState"]()["nodes"]?.[this["nodeId"]]?.["generationStartTime"] || this['_data']?.["generationStartTime"] || 0x0);
        const _0x360181 = Math['max'](Date["now"](), Number["isFinite"](_0x383881) ? Math["trunc"](_0x383881) + 0x1 : 0x0);
        const _0x1c0e02 = {
          ...buildGenerationStartPatch({
            'startedAt': _0x360181
          }),
          'rhStatusMessage': null,
          'rhStatusCode': null
        };
        _0x3e988d && (_0x1b022c?.["providerProfileId"] && (_0x1c0e02["rhProviderProfileId"] = normalizeRunningHubModelApiProfileId(_0x1b022c?.["providerProfileId"])), Object['assign'](_0x1c0e02, this["_buildRunningHubTaskPatch"]({
          'taskId': '',
          'status': "pending",
          'startedAt': _0x360181,
          'recovering': ![],
          'useOpenapiQuery': _0x507468
        })), Object["assign"](_0x1c0e02, {
          ...this['_buildDreaminaTaskPatch']({
            'submitId': '',
            'status': "idle",
            'phase': 'idle',
            'label': '',
            'startedAt': 0x0,
            'lastCheckedAt': 0x0,
            'recovering': ![],
            'raw': {}
          }),
          ...this['_buildAsyncTaskPatch']({
            'provider': '',
            'kind': 'image',
            'taskId': '',
            'status': "idle",
            'startedAt': 0x0,
            'recovering': ![]
          })
        }));
        _0x5bfb6d && (Object["assign"](_0x1c0e02, this["_buildDreaminaTaskPatch"]({
          'submitId': '',
          'status': 'pending',
          'phase': "generating",
          'label': t("aigenImage.task.submitting"),
          'startedAt': _0x360181,
          'lastCheckedAt': 0x0,
          'recovering': ![],
          'raw': {}
        })), Object["assign"](_0x1c0e02, {
          ...this["_buildRunningHubTaskPatch"]({
            'taskId': '',
            'status': "idle",
            'startedAt': 0x0,
            'recovering': ![],
            'useOpenapiQuery': ![]
          }),
          ...this['_buildAsyncTaskPatch']({
            'provider': '',
            'kind': "image",
            'taskId': '',
            'status': "idle",
            'startedAt': 0x0,
            'recovering': ![]
          })
        }));
        _0x5bb776 && (Object["assign"](_0x1c0e02, this['_buildAsyncTaskPatch']({
          'provider': _0x3abb2c,
          'kind': "image",
          'taskId': '',
          'status': "pending",
          'startedAt': _0x360181,
          'recovering': ![]
        })), Object["assign"](_0x1c0e02, {
          ...this["_buildRunningHubTaskPatch"]({
            'taskId': '',
            'status': 'idle',
            'startedAt': 0x0,
            'recovering': ![],
            'useOpenapiQuery': ![]
          }),
          ...this["_buildDreaminaTaskPatch"]({
            'submitId': '',
            'status': 'idle',
            'phase': "idle",
            'label': '',
            'startedAt': 0x0,
            'lastCheckedAt': 0x0,
            'recovering': ![],
            'raw': {}
          })
        }));
        !_0x3e988d && !_0x5bfb6d && !_0x5bb776 && Object["assign"](_0x1c0e02, {
          ...this["_buildRunningHubTaskPatch"]({
            'taskId': '',
            'status': 'idle',
            'startedAt': 0x0,
            'recovering': ![],
            'useOpenapiQuery': ![]
          }),
          ...this["_buildDreaminaTaskPatch"]({
            'submitId': '',
            'status': "idle",
            'phase': "idle",
            'label': '',
            'startedAt': 0x0,
            'lastCheckedAt': 0x0,
            'recovering': ![],
            'raw': {}
          }),
          ...this["_buildAsyncTaskPatch"]({
            'provider': '',
            'kind': "image",
            'taskId': '',
            'status': "idle",
            'startedAt': 0x0,
            'recovering': ![]
          })
        });
        _0x1c0e02['ratioNotice'] = String(_0x1b022c?.["ratioNotice"] || '');
        let _0x2bf5ee = null;
        try {
          _0x2bf5ee = await _0x31006f(createGenerationSubmitPlan({
            'kind': 'image',
            'sourceNodeId': this["nodeId"],
            'targetNodeId': this['nodeId'],
            'trigger': "node",
            'taskType': 'image-generation',
            'provider': _0x1b022c['provider'] || _0x3abb2c || this["_data"]?.["provider"] || '',
            'adapterType': _0x5290dd ? "workflow" : "modelApi",
            'modelId': _0x1b022c["model"] || this['_data']?.["model"] || '',
            'payload': _0x1b022c,
            'cancellable': _0x5290dd,
            'resumable': _0x3e988d || _0x5bfb6d || _0x5bb776,
            'async': _0x5bb776,
            'pauseOnAbort': _0x2756b2,
            'startBuilder': () => _0x1c0e02,
            'pauseBuilder': _0x5a55b2 => {
              const _0xe5f59a = _0x5a55b2['getTaskNode']?.() || {};
              if (_0x5bfb6d) {
                return this['_buildDreaminaTaskPatch']({
                  'submitId': String(this["_dreaminaActiveSubmitId"] || '')["trim"]() || String(_0xe5f59a?.['dreaminaSubmitId'] || '')['trim'](),
                  'status': String(_0xe5f59a?.['dreaminaTaskStatus'] || '')["trim"]() || 'pending',
                  'phase': String(_0xe5f59a?.["dreaminaTaskPhase"] || '')["trim"]() || "generating",
                  'label': String(_0xe5f59a?.["dreaminaTaskLabel"] || '')["trim"]() || t("aigenImage.task.generating"),
                  'startedAt': _0x5a55b2["startedAt"],
                  'lastCheckedAt': Date["now"](),
                  'recovering': ![],
                  'raw': _0xe5f59a?.["dreaminaTaskLastRaw"] || {}
                });
              }
              if (_0x3e988d) {
                return this["_buildRunningHubTaskPatch"]({
                  'taskId': String(this["_rhTaskId"] || '')["trim"]() || String(_0xe5f59a?.['rhTaskId'] || '')['trim']() || String(_0x5a55b2?.["taskId"] || '')["trim"](),
                  'status': String(_0xe5f59a?.["rhTaskStatus"] || '')['trim']() || "running",
                  'startedAt': _0x5a55b2["startedAt"],
                  'recovering': ![],
                  'useOpenapiQuery': _0xe5f59a?.["rhTaskUseOpenapiQuery"] === !![] || _0x507468
                });
              }
              return {};
            },
            'onTaskStart': () => {
              this['_syncLocalTaskNodeData']();
              if (_0x3e988d) {
                this['_persistRunningHubResumeCache']();
              }
              if (_0x5bfb6d) {
                this['_persistDreaminaResumeCache']();
              }
              if (_0x5bb776) {
                this['_persistAsyncResumeCache']();
              }
            },
            'submit': async (_0x4edc19, _0x4e3fc5 = {}) => _0x5bad71["generateImage"](_0x1b022c, {
              'taskKey': "node:" + this["nodeId"] + ":image:" + _0x360181,
              'signal': this["_rhAbortController"]?.['signal'] || _0x4e3fc5["signal"],
              'runningHubWorkflowQueueLease': _0x4e3fc5["runningHubWorkflowQueueLease"],
              'onProgress': _0x5bfb6d ? (_0x4d56c6 = {}) => {
                const _0x3690bf = String(_0x4d56c6?.["status"] || "pending")["trim"]() || "pending";
                const _0x482c6d = String(_0x4d56c6?.["phase"] || 'generating')["trim"]() || 'generating';
                const _0x2458b8 = String(_0x4d56c6?.["failReason"] || _0x4d56c6?.['failureReason'] || _0x4d56c6?.["error"] || _0x4d56c6?.["message"] || _0x4d56c6?.["label"] || '')['trim']();
                if (_0x3690bf["toLowerCase"]() === "failed" || _0x3690bf["toLowerCase"]() === "fail" || _0x3690bf['toLowerCase']() === "error" || _0x482c6d["toLowerCase"]() === "failed" || _0x482c6d['toLowerCase']() === "fail" || _0x482c6d["toLowerCase"]() === "error") {
                  const _0x1074da = {
                    'error': _0x2458b8 || t("aigenImage.task.generationFailed"),
                    'startedAt': _0x360181,
                    'submitId': String(_0x4d56c6?.["submitId"] || '')["trim"]() || String(_0x5090b0(_0x4e3fc5, this["nodeId"])?.["dreaminaSubmitId"] || '')["trim"](),
                    'lastCheckedAt': Number(_0x4d56c6?.['lastCheckedAt'] || Date["now"]()),
                    'raw': _0x4d56c6?.["raw"] || {}
                  };
                  _0x4e3fc5['isBackgroundTask']?.() ? _0x195f6f(_0x4e3fc5, this["nodeId"], this["_buildDreaminaFailurePatch"](_0x1074da)) : this["_finalizeDreaminaImageFailure"](_0x1074da);
                  return;
                }
                const _0x55f3a5 = {
                  'submitId': String(_0x4d56c6?.["submitId"] || '')['trim']() || String(_0x5090b0(_0x4e3fc5, this['nodeId'])?.['dreaminaSubmitId'] || '')["trim"](),
                  'status': _0x3690bf,
                  'phase': _0x482c6d,
                  'label': String(_0x4d56c6?.["label"] || t('aigenImage.task.generating'))["trim"]() || t("aigenImage.task.generating"),
                  'startedAt': _0x360181,
                  'lastCheckedAt': Number(_0x4d56c6?.['lastCheckedAt'] || Date["now"]()),
                  'recovering': ![],
                  'raw': _0x4d56c6?.['raw'] || {}
                };
                if (_0x4e3fc5["isBackgroundTask"]?.()) {
                  const _0x4782d7 = _0x5090b0(_0x4e3fc5, this["nodeId"]);
                  _0x195f6f(_0x4e3fc5, this['nodeId'], {
                    'generationStartTime': Number(_0x4782d7?.["generationStartTime"]) > 0x0 ? Number(_0x4782d7["generationStartTime"]) : Number(_0x55f3a5["startedAt"] || Date["now"]()),
                    'generationDuration': null,
                    ...this['_buildDreaminaTaskPatch'](_0x55f3a5)
                  });
                } else {
                  this["_applyDreaminaTaskPatch"](_0x55f3a5);
                }
              } : undefined,
              'onTaskMeta': ({
                taskId: _0x5a10aa,
                useOpenapiQuery: _0x5a5cc1,
                provider: _0x1a400a
              }) => {
                const _0x191cea = String(_0x5a10aa || '')["trim"]();
                if (!_0x191cea) {
                  return;
                }
                if (_0x3e988d) {
                  this["_rhTaskId"] = _0x191cea;
                  _0x4e3fc5['onTaskId']?.(_0x191cea);
                  _0x195f6f(_0x4e3fc5, this["nodeId"], {
                    'rhStatusMessage': null,
                    'rhStatusCode': null,
                    'rhTaskUseOpenapiQuery': _0x5a5cc1 === !![]
                  });
                  !_0x4e3fc5['isBackgroundTask']?.() && (this["_syncLocalTaskNodeData"](), this["_persistRunningHubResumeCache"]());
                  _0x5290dd && this["_rhCancelRequested"] && this["_cancelRunningHubWorkflowTask"]();
                  return;
                }
                if (_0x5bfb6d) {
                  this['_dreaminaActiveSubmitId'] = _0x191cea;
                  const _0x58b868 = {
                    'submitId': _0x191cea,
                    'status': "pending",
                    'phase': "generating",
                    'label': t("aigenImage.task.generating"),
                    'startedAt': _0x360181,
                    'lastCheckedAt': Date["now"](),
                    'recovering': ![],
                    'raw': {}
                  };
                  if (_0x4e3fc5["isBackgroundTask"]?.()) {
                    const _0xf07b4b = _0x5090b0(_0x4e3fc5, this["nodeId"]);
                    _0x195f6f(_0x4e3fc5, this['nodeId'], {
                      'generationStartTime': Number(_0xf07b4b?.["generationStartTime"]) > 0x0 ? Number(_0xf07b4b["generationStartTime"]) : Number(_0x58b868['startedAt'] || Date['now']()),
                      'generationDuration': null,
                      ...this["_buildDreaminaTaskPatch"](_0x58b868)
                    });
                  } else {
                    this["_applyDreaminaTaskPatch"](_0x58b868);
                  }
                  _0x4e3fc5["onTaskId"]?.(_0x191cea);
                  return;
                }
                _0x5bb776 && (_0x4e3fc5["onTaskId"]?.(_0x191cea), _0x195f6f(_0x4e3fc5, this["nodeId"], {
                  'asyncTaskProvider': this["_inferProviderFromModel"](_0x1b022c?.["model"], _0x1a400a || _0x3abb2c || this["_data"]?.['provider'] || ''),
                  'asyncTaskKind': "image"
                }), !_0x4e3fc5["isBackgroundTask"]?.() && (this["_syncLocalTaskNodeData"](), this['_persistAsyncResumeCache']()));
              },
              'onTaskId': _0x3cc919 => {
                const _0x50720e = String(_0x3cc919 || '')["trim"]();
                if (!_0x50720e) {
                  return;
                }
                if (_0x3e988d) {
                  this["_rhTaskId"] = _0x50720e;
                  _0x4e3fc5["onTaskId"]?.(_0x50720e);
                  const _0x2ca11d = _0x5090b0(_0x4e3fc5, this["nodeId"]);
                  _0x195f6f(_0x4e3fc5, this["nodeId"], {
                    'rhStatusMessage': null,
                    'rhStatusCode': null,
                    'rhTaskUseOpenapiQuery': _0x2ca11d?.["rhTaskUseOpenapiQuery"] === !![] || _0x507468
                  });
                  !_0x4e3fc5["isBackgroundTask"]?.() && (this["_syncLocalTaskNodeData"](), this['_persistRunningHubResumeCache']());
                  _0x5290dd && this['_rhCancelRequested'] && this["_cancelRunningHubWorkflowTask"]();
                  return;
                }
                if (_0x5bfb6d) {
                  this['_dreaminaActiveSubmitId'] = _0x50720e;
                  const _0x1e9fbd = {
                    'submitId': _0x50720e,
                    'status': "pending",
                    'phase': "generating",
                    'label': t("aigenImage.task.generating"),
                    'startedAt': _0x360181,
                    'lastCheckedAt': Date["now"](),
                    'recovering': ![],
                    'raw': {}
                  };
                  if (_0x4e3fc5["isBackgroundTask"]?.()) {
                    const _0x336c9a = _0x5090b0(_0x4e3fc5, this["nodeId"]);
                    _0x195f6f(_0x4e3fc5, this['nodeId'], {
                      'generationStartTime': Number(_0x336c9a?.['generationStartTime']) > 0x0 ? Number(_0x336c9a["generationStartTime"]) : Number(_0x1e9fbd["startedAt"] || Date["now"]()),
                      'generationDuration': null,
                      ...this['_buildDreaminaTaskPatch'](_0x1e9fbd)
                    });
                  } else {
                    this['_applyDreaminaTaskPatch'](_0x1e9fbd);
                  }
                  _0x4e3fc5['onTaskId']?.(_0x50720e);
                  return;
                }
                if (_0x5bb776) {
                  const _0x4a7280 = _0x5090b0(_0x4e3fc5, this['nodeId']);
                  _0x4e3fc5["onTaskId"]?.(_0x50720e);
                  _0x195f6f(_0x4e3fc5, this["nodeId"], {
                    'asyncTaskProvider': this["_inferProviderFromModel"](_0x4a7280?.["model"] || _0x1b022c?.['model'], _0x4a7280?.["asyncTaskProvider"] || _0x3abb2c || this["_data"]?.["provider"] || ''),
                    'asyncTaskKind': "image"
                  });
                  !_0x4e3fc5["isBackgroundTask"]?.() && (this["_syncLocalTaskNodeData"](), this["_persistAsyncResumeCache"]());
                }
              }
            }),
            'cancel': _0x5290dd ? async ({
              taskId: _0x54b53b
            }) => {
              const _0x4eda01 = this["_rhApiKey"] || _0x1b022c["apiKey"] || '';
              const _0x4cb5dc = String(_0x54b53b || '')["trim"]();
              if (!_0x4eda01 || !_0x4cb5dc) {
                return null;
              }
              return _0x5bad71['cancelRunningHubWorkflowTask']({
                'apiKey': _0x4eda01,
                'taskId': _0x4cb5dc,
                'providerProfileId': _0x1b022c?.["providerProfileId"] || _0x1b022c?.["rhProviderProfileId"] || ''
              });
            } : undefined,
            'resultBuilder': async (_0x33d07b, _0x2f9aa9) => {
              const _0x17b0d0 = this["_getImageGenerationResultError"](_0x33d07b);
              if (_0x17b0d0) {
                throw new Error(_0x17b0d0);
              }
              const _0x51c050 = this["_applyImageGenerationResult"](_0x33d07b, _0x2f9aa9["startedAt"], {
                'writeStore': ![]
              });
              const _0x4cb2dd = {
                ...(_0x51c050?.['patch'] || {})
              };
              if (_0x3e988d) {
                const _0x1b04e7 = _0x2f9aa9["getTaskNode"]?.() || {};
                Object["assign"](_0x4cb2dd, this["_buildRunningHubTaskPatch"]({
                  'taskId': String(this["_rhTaskId"] || '')['trim']() || String(_0x1b04e7?.["rhTaskId"] || '')["trim"](),
                  'status': 'success',
                  'startedAt': _0x2f9aa9["startedAt"],
                  'recovering': ![],
                  'useOpenapiQuery': _0x1b04e7?.["rhTaskUseOpenapiQuery"] === !![] || _0x507468
                }));
                this["_persistRunningHubResumeCache"]();
              } else {
                if (_0x5bfb6d) {
                  const _0x39fc61 = _0x2f9aa9["getTaskNode"]?.() || {};
                  Object["assign"](_0x4cb2dd, this["_buildDreaminaTaskPatch"]({
                    'submitId': String(_0x39fc61?.['dreaminaSubmitId'] || '')["trim"](),
                    'status': "success",
                    'phase': "done",
                    'label': t("aigenImage.task.completed"),
                    'startedAt': _0x2f9aa9["startedAt"],
                    'lastCheckedAt': Date["now"](),
                    'recovering': ![],
                    'raw': {}
                  }));
                  this["_persistDreaminaResumeCache"]();
                } else {
                  if (_0x5bb776) {
                    const _0x437442 = _0x2f9aa9["getTaskNode"]?.() || {};
                    Object["assign"](_0x4cb2dd, this["_buildAsyncTaskPatch"]({
                      'provider': this["_inferProviderFromModel"](_0x437442?.["model"] || _0x1b022c?.["model"], _0x437442?.["asyncTaskProvider"] || _0x3abb2c || ''),
                      'kind': 'image',
                      'taskId': String(_0x437442?.["asyncTaskId"] || '')["trim"]() || String(_0x2f9aa9?.["taskId"] || '')["trim"](),
                      'status': "success",
                      'startedAt': _0x2f9aa9["startedAt"],
                      'recovering': ![]
                    }));
                    this["_persistAsyncResumeCache"]();
                  }
                }
              }
              return _0x4cb2dd;
            },
            'failureBuilder': (_0x3df6be, _0x2bca1f) => {
              if (_0x5bfb6d) {
                const _0x431f2d = _0x2bca1f["getTaskNode"]?.() || {};
                return this['_buildDreaminaFailurePatch']({
                  'error': _0x3df6be,
                  'startedAt': _0x2bca1f["startedAt"],
                  'submitId': String(this['_dreaminaActiveSubmitId'] || '')["trim"]() || String(_0x431f2d?.["dreaminaSubmitId"] || '')["trim"](),
                  'lastCheckedAt': Date["now"](),
                  'raw': _0x431f2d?.["dreaminaTaskLastRaw"] || {}
                });
              }
              const _0x1071f7 = {
                ...buildImageGenerationFailurePatch({
                  'error': _0x3df6be?.["message"] || t("aigenImage.task.generationFailed"),
                  'startedAt': _0x2bca1f["startedAt"]
                })
              };
              if (_0x3e988d) {
                const _0x4a2d5f = _0x2bca1f["getTaskNode"]?.() || {};
                Object["assign"](_0x1071f7, {
                  'rhStatusMessage': _0x3df6be?.['message'] || t('aigenImage.task.generationFailed'),
                  'rhStatusCode': Number['isFinite'](Number(_0x3df6be?.['code'])) ? Number(_0x3df6be["code"]) : null
                }, this["_buildRunningHubTaskPatch"]({
                  'taskId': String(this['_rhTaskId'] || '')["trim"]() || String(_0x4a2d5f?.["rhTaskId"] || '')["trim"](),
                  'status': "failed",
                  'startedAt': _0x2bca1f['startedAt'],
                  'recovering': ![],
                  'useOpenapiQuery': _0x4a2d5f?.["rhTaskUseOpenapiQuery"] === !![] || _0x507468
                }));
              } else {
                if (_0x5bb776) {
                  const _0xf60f0 = _0x2bca1f["getTaskNode"]?.() || {};
                  Object["assign"](_0x1071f7, this['_buildAsyncTaskPatch']({
                    'provider': this["_inferProviderFromModel"](_0xf60f0?.['model'] || _0x1b022c?.["model"], _0xf60f0?.["asyncTaskProvider"] || _0x3abb2c || ''),
                    'kind': 'image',
                    'taskId': String(_0xf60f0?.['asyncTaskId'] || '')["trim"]() || String(_0x2bca1f?.['taskId'] || '')["trim"](),
                    'status': 'failed',
                    'startedAt': _0x2bca1f["startedAt"],
                    'recovering': ![]
                  }));
                }
              }
              return _0x1071f7;
            },
            'cancelledBuilder': _0x1ea1c7 => {
              const _0x2ada49 = _0x1ea1c7["getTaskNode"]?.() || {};
              const _0x3be2a4 = _0x2ada49["generationDuration"] == null ? Date["now"]() - _0x1ea1c7["startedAt"] : _0x2ada49['generationDuration'];
              if (_0x5290dd) {
                return this["_buildRunningHubCancelResultPatch"]({
                  'latest': _0x2ada49,
                  'message': _0x2ada49['rhStatusMessage'] || t("aigenImage.task.interrupted"),
                  'code': _0x2ada49["rhStatusCode"],
                  'duration': _0x3be2a4,
                  'taskId': String(this['_rhTaskId'] || '')['trim']() || String(_0x2ada49?.["rhTaskId"] || '')["trim"]()
                });
              }
              return {
                'images': [],
                'imageUrl': '',
                'thumbUrl': '',
                'localPath': ''
              };
            },
            'parseError': _0x2a286c => getGenerationErrorMessage(_0x2a286c, t("aigenImage.task.generationFailed"))
          }), {
            'store': _0xcebdf2,
            'startedAt': _0x360181,
            'abortController': this["_rhAbortController"]
          });
          if (_0x2bf5ee["status"] === "failed") {
            const _0x1df186 = _0x2bf5ee["error"];
            console['error']("[AIGenerateNode] 生成失败:", _0x1df186);
            showProviderApiKeyMissingToastForError(_0x1df186, {
              'providerId': _0x1b022c?.["provider"],
              'model': _0x1b022c?.['model'],
              'adapterType': "modelApi"
            });
            void logDiagnosticEvent({
              'type': 'generation.image_failed',
              'level': "error",
              'source': "renderer",
              'message': _0x1df186?.["message"] || t("aigenImage.task.imageGenerationFailed"),
              'error': _0x1df186,
              'context': {
                'nodeId': this['nodeId'],
                'provider': _0x1b022c?.["provider"] || '',
                'model': _0x1b022c?.["model"] || '',
                'isRhTaskModel': _0x3e988d,
                'isDreaminaTask': _0x5bfb6d,
                'isAsyncTaskModel': _0x5bb776
              }
            });
          }
          if (_0x3e988d) {
            this["_persistRunningHubResumeCache"]();
          }
          if (_0x5bfb6d) {
            this["_persistDreaminaResumeCache"]();
          }
          if (_0x5bb776) {
            this["_persistAsyncResumeCache"]();
          }
          return _0x2bf5ee;
        } finally {
          const _0x16bd8e = this["_syncLocalTaskNodeData"]();
          const _0x1db5d4 = shouldShowGenerationBusyUi(_0x16bd8e);
          this["_isGenerating"] = _0x1db5d4;
          this["_dreaminaActiveSubmitId"] = '';
          this['_rhAbortController'] = null;
          if (_0x3e988d && _0x1db5d4) {
            const _0x32120e = String(_0x16bd8e?.["rhTaskId"] || '')["trim"]();
            if (_0x32120e) {
              this['_rhTaskId'] = _0x32120e;
            }
          } else {
            this["_rhTaskId"] = null;
            if (!this["_rhCancelRequested"]) {
              this["_rhApiKey"] = null;
            }
          }
          this["btnEl"] && this["_updateSubmitButtonState"]?.();
          if (!_0x1db5d4) {
            if (this["btnEl"]) {
              resetGenerateButtonIdleUi(this['btnEl']);
            }
            _0x23d14c(this["previewEl"]);
          }
        }
      } finally {
        releasePayloadObjectUrlLease(_0x1b022c);
      }
    }
    ['unmount']() {
      disposeImageSchemaRatioResizeAnimation(this, {
        'nodeId': this["nodeId"],
        'previewEl': this["previewEl"]
      });
      this["_assetMentionRegistryUnsubscribe"]?.();
      this["_assetMentionRegistryUnsubscribe"] = null;
      this['_assetMentionRegistryRefreshPending'] = ![];
      this["_generationNodeHelpTip"]?.["remove"]();
      this['_generationNodeHelpTip'] = null;
      this["_promptPresetTrigger"]?.["remove"]();
      this["_promptPresetTrigger"] = null;
      this["_promptExpansion"]?.["remove"]();
      this["_promptExpansion"] = null;
      this["_modelProviderProfileControl"]?.["remove"]();
      this["_modelProviderProfileControl"] = null;
      this["_unbindImageLocaleChange"]?.();
      this["_unbindImageLocaleChange"] = null;
      this["_uiSchemaCleanup"]?.();
      this['_uiSchemaCleanup'] = null;
      this["_footerControllerCleanup"]?.();
      this['_footerControllerCleanup'] = null;
      this["_disposeImageObjectUrls"]?.();
      this["_lowZoomHoverRefreshTimer"] && (clearTimeout(this["_lowZoomHoverRefreshTimer"]), this["_lowZoomHoverRefreshTimer"] = null);
      setNodeMediaLodHoverPromoted(this["_root"], ![]);
    }
  }
  return _0x2b6930["prototype"];
}