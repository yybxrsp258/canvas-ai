import { openDebugRequestWindow } from '../modules/debugRequestWindow.js';
import { normalizeRunningHubInstanceType } from '../modules/runningHubInstanceTypes.js';
import a311_0xe0f4bd from '../core/stores/appStore.js';
import { buildCanvasLocalImageFields } from '../services/canvasMediaLocalService.js';
import { collectAudioWorkflowImageInputs, buildAudioWorkflowImageSlotItems } from './audio-node/audioWorkflowImageInputs.js';
import { bindRendererMediaPlaybackPin } from './shared/rendererMediaPlaybackPin.js';
import { shouldPreserveGenerationTaskOnUnmount } from '../core/generationTaskRuntime.js';
import { onLocaleChange, t } from '../i18n/index.js';
import { buildGenerateAudioRequest, cancelRunningHubAudioTask, generateAudio, resumeRunningHubAudioTask } from '../../api/aiAudioApi.js';
import { ensureConfig, getProviderConfig } from '../../api/configApi.js';
import { saveRemoteAudioLocallyDetailed, uploadFile } from '../modules/project.js';
import { getNodeDefaultSize } from '../services/fileService.js';
import { openExternalLink } from '../services/externalLinkService.js';
import { subscribeAssetMentionRegistry } from '../modules/assetMentionRegistry.js';
import { removeCoveredAssetInputRefForConnection } from '../modules/promptAssetInputOverride.js';
import { cancelAudioSeparationTaskForNode, getRunningAudioSeparationTaskForNode, runAudioSeparationFromNode } from '../modules/AudioSeparationController.js';
import { bindRunningHubToolbarTaskButton } from './nodeToolbar/runningHubToolbarTaskButton.js';
import { _handlePillHover, _handlePillOut, _checkAtTrigger, _handleMentionMenuKeyboard, _handlePillKeyboard, _rehydratePromptPills, _syncEdgesOrderFromPills, _syncPillLabels, getAssetInputRefsFromPromptAndNode, getPromptAssetInputRefsFromNode, handleRefThumbDeleteClick, insertPresetPromptIntoEditor, previewPresetPromptInEditor, resolvePresetPromptTextWithTextRefs, shouldUsePromptPreviewForPreset, flushPromptHtmlCommit, handlePromptPaste, handlePromptSelectAll, schedulePromptHtmlCommit, shouldSubmitPromptByKeyboard } from '../modules/nodePromptShared.js';
import { isPreviewModeEnabled, isPreviewNodeLoading, startPreviewNodeLoading, stopPreviewNodeLoading, syncPreviewNodeLoading } from '../modules/previewMode.js';
import { createPreviewGenerateButtonCallbacks, resetGenerateButtonIdleUi, setGenerateButtonCancellableUi, setGenerateButtonLoadingUi } from '../modules/previewGenerateButtonUi.js';
import { AUDIO_TOOLBAR_HTML } from './NodeToolbarConfig.js';
import { startLoading, stopLoading } from '../modules/loadingOverlay.js';
import a311_0x446dc7 from '../modules/AudioClipController.js';
import { findAvailablePosition, generateId } from '../core/math.js';
import { getNodeSpawnPrefs } from '../modules/nodeSpawn.js';
import { ensureThumbDecoded, revealRefThumbMedia } from '../modules/refThumbMediaReveal.js';
import { createReferenceInputThumbnailHtml, resolveReferenceVideoThumbnail } from '../modules/referenceInputThumbnail.js';
import { escapeInputSlotLabelHtml, formatInputSlotLabelHtml } from './shared/inputSlotLabelFormatter.js';
import { checkSlashTrigger, handleSlashKeyboardNavigation } from '../modules/slashMenu.js';
import { shouldSkipPromptTriggerForBulkInput } from '../modules/promptTriggerComposition.js';
import { clearVirtualizedPromptCommit, isVirtualizedPromptEditorCurrent } from '../modules/promptPasteVirtualization.js';
import { activateMenuKeyboard } from '../modules/floatingMenuKeyboard.js';
import { bindRefThumbHoverPreview } from '../modules/refThumbHoverPreview.js';
import { bindRefThumbFixedSlotDrag } from '../modules/refThumbDragController.js';
import { getAudioNodeWaveformPath } from '../utils/audioWaveform.js';
import { createAudioPlaybackProgressController } from '../utils/audioPlaybackProgress.js';
import { loadAudioDurationMetadataSec, normalizeAudioDurationSec, pickAudioDurationSec } from '../services/audioMetadataService.js';
import { beginAudioPlayback, registerAudioPlaybackClient } from '../modules/audioPlaybackCoordinator.js';
import { sanitizePromptHtml } from '../utils/dom.js';
import { GENERATION_HISTORY_EVENT } from '../modules/generationHistoryAssets.js';
import { showProviderApiKeyMissingToast, showProviderApiKeyMissingToastForError } from '../modules/providerApiKeyMissingToast.js';
import { applyModelCredentialButtonState, bindModelCredentialMenu, guardModelGenerationCredentials, resetModelCredentialButtonState, syncModelCredentialMenu } from '../modules/modelCredentialUi.js';
import { createModelProviderProfileControl } from './shared/modelProviderProfileControl.js';
import { normalizeRunningHubModelApiProfileId } from '../modules/runningHubProviderProfiles.js';
import { applyPromptBoxHeight, getPromptBoxHeightBounds, normalizePromptBoxHeight } from './promptBoxResize.js';
import { buildCanvasLocalVideoFields, resolveCanvasAudioUrl, resolveCanvasVideoUrl } from '../services/canvasMediaLocalService.js';
import { attachMediaElementPlaybackSource, clearDesktopMediaPlaybackSourceMetadata, getMediaElementCurrentSource, getMediaElementPlaybackSourceKey, isMediaElementPlaybackSource } from '../services/desktopMediaBlobSource.js';
import { localPathToUrl, normalizeLocalPath, pickResultLocalPath } from '../utils/localMediaPath.js';
import { DEBUG_WRENCH_ICON_HTML, buildFinalApiDebugPreview } from '../utils/debugRequestPreview.js';
import { createPromptAttachmentButtonHTML } from './refAttachmentButton.js';
import { getModelManifest, RH_AUDIO_ADVANCED_VOICE_CLONE_MODEL_ID } from '../manifests/index.js';
import { isVipModel as a311_0x2973e2, resolveVipGateModelId } from '../modules/subscriptionAccess.js';
import { buildAudioWorkflowItems } from './audio-node/audioModelMenuHelpers.js';
import { buildAudioWorkflowFooterHtml, isRunningHubAudioWorkflowItem } from './audio-node/audioFooterSchemaSlots.js';
import { isCustomAiAppManifest } from './shared/rhAiAppNodeBehavior.js';
import { bindAudioWorkflowSchemaSlotControls, closeAudioWorkflowAdvancedPanel, collectAudioWorkflowSchemaSlotElements, syncAudioWorkflowSchemaSlots } from './audio-node/audioWorkflowSchemaSlotSync.js';
import { buildAudioWorkflowDefaultSyncPatch, buildAudioWorkflowSelectionPatch, getAudioWorkflowUiSchemaField } from './audio-node/audioWorkflowSelectionPatch.js';
import { buildAudioGenerationResultPatch } from './audio-node/audioGenerationResultRenderer.js';
import { MULTI_RESULT_BACKPLATE_CLASS, MULTI_RESULT_STACK_WRAP_CLASS, buildMultiResultBackplateItems, buildMultiResultCollapsedFrame, buildMultiResultExpandedSlotMap, clearMultiResultStackClasses, createMultiResultBackplates, syncMultiResultStackClasses } from './aigenImage/multiResultStackBackplates.js';
import { getAudioWorkflowInputLimit, getAudioWorkflowSlots } from './audio-node/audioWorkflowRefSlots.js';
import { buildAudioWorkflowInputPlan } from './audio-node/audioWorkflowInputPlan.js';
import { bindAudioDownloadAction } from './nodeToolbar/audioActions/downloadAction.js';
import { bindAudioVoiceStudioAction } from './nodeToolbar/audioActions/voiceStudioAction.js';
import { bindPreviewUploadToolbarAction } from '../modules/previewUploadEntry.js';
import { bindNodeFooterController, bindNodeModelMenuTrigger } from './shared/nodeFooterControls.js';
import { bindGenerationNodeCredentialLifecycle } from './shared/generationNodeCredentialLifecycle.js';
import { createGenerationNodeHelpTipController, getGenerationNodeHelpTooltip } from './generationNodeHelpTip.js';
import { createPromptPresetTriggerController } from './promptPresetTrigger.js';
import { attachNodePromptExpansion } from './nodePromptExpansion.js';
import { getTaskMessage, resolveGenerationButtonMode, shouldAllowCancel, shouldShowGenerationBusyUi } from '../core/generationTaskUiState.js';
import { createAudioNodeTaskOrchestration } from './audio-node/taskOrchestrationModule.js';
import { shouldDeferRendererDetailsOnMount, shouldDeferRendererMediaOnMount } from '../core/rendererDeferredMedia.js';
const WAVE_PATH = 'M10,40\x20L10,40\x20M20,20\x20L20,60\x20M30,25\x20L30,55\x20M40,30\x20L40,50\x20M50,22\x20L50,58\x20M60,28\x20L60,52\x20M70,24\x20L70,56\x20M80,20\x20L80,60\x20M90,26\x20L90,54\x20M100,22\x20L100,58\x20M110,30\x20L110,50\x20M120,15\x20L120,65\x20M130,35\x20L130,45\x20M140,30\x20L140,50\x20M150,40\x20L150,40\x20M160,30\x20L160,50\x20M170,22\x20L170,58\x20M180,28\x20L180,52\x20M190,24\x20L190,56';
function buildAudioPlaceholderSvg({
  width = 0x2c,
  height = 0x2c
} = {}) {
  return "<svg class=\"placeholder-icon-svg\" width=\"" + width + "\" height=\"" + height + "\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\">\n    <path d=\"M9 18V5l12-2v13\"/>\n    <circle cx=\"6\" cy=\"18\" r=\"3\"/>\n    <circle cx=\"18\" cy=\"16\" r=\"3\"/>\n  </svg>";
}
const ADVANCED_VOICE_CLONE_WORKFLOW_KEY = RH_AUDIO_ADVANCED_VOICE_CLONE_MODEL_ID;
const ADVANCED_VOICE_CLONE_MIN_SECONDS = 0x3;
const ADVANCED_VOICE_CLONE_MAX_SECONDS = 15.05;
function aigenAudioText(_0x12ba46, _0x346f17 = {}) {
  return t('aigenAudioNode.' + _0x12ba46, _0x346f17);
}
const AUDIO_WORKFLOW_VALIDATORS = Object["freeze"]({
  'indextts2_clone'(_0x257b61) {
    const _0x312a4e = Array['isArray'](_0x257b61?.["audioRefs"]) ? _0x257b61['audioRefs'] : [];
    const _0x22960e = _0x312a4e["some"](_0x183549 => String(_0x183549?.["refSlot"] || '') === "audioRef");
    if (!_0x22960e) {
      return aigenAudioText("validation.referenceVoiceRequired");
    }
    const _0x52c998 = _0x312a4e["some"](_0x555d51 => String(_0x555d51?.["refSlot"] || '') === "audio2");
    if (!_0x52c998 && !String(_0x257b61?.["prompt"] || '')["trim"]()) {
      return aigenAudioText("validation.promptRequired");
    }
    return '';
  },
  'voice_convert'(_0x371a78) {
    const _0x570f0e = Array["isArray"](_0x371a78?.["audioRefs"]) ? _0x371a78["audioRefs"] : [];
    const _0x5aa664 = _0x570f0e["some"](_0x4e5a91 => String(_0x4e5a91?.["refSlot"] || '') === "audioRef");
    const _0x10e3f8 = _0x570f0e["some"](_0x3d977c => String(_0x3d977c?.["refSlot"] || '') === 'audioTarget');
    if (!_0x5aa664 || !_0x10e3f8) {
      return aigenAudioText("validation.voiceConvertRefsRequired");
    }
    return '';
  },
  [ADVANCED_VOICE_CLONE_WORKFLOW_KEY](_0x1fe40d) {
    if (!String(_0x1fe40d?.['prompt'] || '')["trim"]()) {
      return aigenAudioText('validation.promptRequired');
    }
    return '';
  }
});
const AUDIO_WORKFLOW_ITEMS = buildAudioWorkflowItems(AUDIO_WORKFLOW_VALIDATORS);
const AUDIO_WORKFLOW_MAP = new Map(AUDIO_WORKFLOW_ITEMS["map"](_0x587b72 => [_0x587b72["key"], _0x587b72]));
const AUDIO_WORKFLOW_LABEL_MAP = new Map(AUDIO_WORKFLOW_ITEMS["map"](_0x143780 => [_0x143780["label"], _0x143780["key"]]));
export function doesAudioWorkflowAcceptTextInput(_0x320e03 = '') {
  const _0x47869a = getModelManifest(String(_0x320e03 || '')["trim"]());
  const _0x393abe = _0x47869a?.["inputSlots"]?.["allowedKinds"];
  if (!Array["isArray"](_0x393abe)) {
    return !![];
  }
  return _0x393abe["map"](_0x12893a => String(_0x12893a || '')["trim"]())['includes']('text');
}
function resolveAudioWorkflowPromptPlaceholder(_0x95f8dd = '') {
  const _0x2fdb77 = getModelManifest(String(_0x95f8dd || '')["trim"]());
  return String(_0x2fdb77?.["prompt"]?.["placeholder"] || '')["trim"]() || aigenAudioText('prompt.placeholder');
}
function syncAudioPromptPlaceholder(_0x52524c, _0x10e089 = '') {
  if (!_0x52524c) {
    return;
  }
  const _0xb49f37 = resolveAudioWorkflowPromptPlaceholder(_0x10e089);
  if (_0x52524c["dataset"]) {
    _0x52524c["dataset"]["placeholder"] = _0xb49f37;
    return;
  }
  _0x52524c["setAttribute"]?.("data-placeholder", _0xb49f37);
}
const TEXT_INPUT_TYPES = new Set(["source-text", "text", 'ai-text', "custom-ai-text"]);
const AUDIO_INPUT_TYPES = new Set(["source-audio", 'audio', "ai-audio"]);
const AUDIO_PLAY_LOADING_DEADLINE_MS = 0x1388;
const VIDEO_INPUT_TYPES = new Set(["source-video", "video", 'ai-video']);
const AUDIO_RESULT_WIDTH = 0x1a4;
const AUDIO_RESULT_HEIGHT = 0xb4;
const AUDIO_RESULT_RATIO = AUDIO_RESULT_WIDTH / AUDIO_RESULT_HEIGHT;
const getStoreSnapshot = () => typeof a311_0xe0f4bd['getStateRaw'] === "function" ? a311_0xe0f4bd['getStateRaw']() : a311_0xe0f4bd["getState"]();
function getWorkflowGateModelId(_0xb86c5e) {
  if (!a311_0x2973e2(_0xb86c5e, "runninghubwf")) {
    return '';
  }
  return resolveVipGateModelId(_0xb86c5e, 'runninghubwf');
}
function escapeAudioWorkflowIconText(_0xabe10b) {
  return String(_0xabe10b ?? '')["replace"](/&/g, "&amp;")["replace"](/</g, "&lt;")["replace"](/>/g, '&gt;')["replace"](/"/g, '&quot;')["replace"](/'/g, '&#39;');
}
function createDynamicWorkflowItemFromManifest(_0x161beb) {
  const _0x1a8fd3 = String(_0x161beb || '')["trim"]();
  if (!_0x1a8fd3) {
    return null;
  }
  const _0x383bbe = getModelManifest(_0x1a8fd3);
  const _0x109d3c = _0x383bbe?.["extensions"]?.["customProvider"];
  const _0x1fcc49 = _0x383bbe?.["extensions"]?.["audioMenu"] || {};
  if (!_0x383bbe || _0x383bbe["kind"] !== "audio" || !["workflow", 'modelApi']["includes"](_0x383bbe["adapterType"]) || _0x383bbe["provider"] !== 'runninghubwf' && !isCustomAiAppManifest(_0x383bbe) && !_0x109d3c) {
    return null;
  }
  return Object["freeze"]({
    'key': _0x383bbe["modelId"],
    'label': _0x1fcc49['label'] || _0x383bbe["displayName"] || _0x383bbe["modelId"],
    'subtitle': _0x1fcc49['subtitle'] || _0x383bbe["description"] || '',
    'icon': _0x383bbe["icon"] || "images/RH.png",
    'iconAlt': "runninghub",
    'iconHtml': _0x1fcc49["iconKind"] === "customProviderBadge" ? "<div class=\"node-menu-icon node-menu-icon-badge\">" + escapeAudioWorkflowIconText(String(_0x109d3c?.["badge"] || 'CP')['slice'](0x0, 0x2)) + "</div>" : '',
    'provider': _0x383bbe["provider"],
    'adapterType': _0x383bbe["adapterType"],
    'executionId': _0x383bbe["executionId"] || '',
    'async': _0x383bbe["async"] === !![],
    'cancellable': _0x383bbe["cancellable"] === !![],
    'vip': _0x383bbe["vip"] === !![],
    'group': isCustomAiAppManifest(_0x383bbe) ? "rhAiApp" : _0x1fcc49["group"] || "runninghubWorkflow",
    'validate': () => ''
  });
}
function getWorkflowByKey(_0x38d414) {
  const _0x4db915 = String(_0x38d414 || '')['trim']();
  return AUDIO_WORKFLOW_MAP["get"](_0x4db915) || createDynamicWorkflowItemFromManifest(_0x4db915);
}
function resolveWorkflowKeyFromNodeData(_0x2644bf = {}) {
  const _0x56453d = [_0x2644bf["audioWorkflowKey"], _0x2644bf["model"], _0x2644bf["audioWorkflowLabel"]]['map'](_0x543388 => String(_0x543388 || '')["trim"]());
  for (const _0x41bc4f of _0x56453d) {
    if (!_0x41bc4f) {
      continue;
    }
    const _0x436588 = (AUDIO_WORKFLOW_MAP["has"](_0x41bc4f) ? _0x41bc4f : '') || AUDIO_WORKFLOW_LABEL_MAP['get'](_0x41bc4f) || '';
    if (_0x436588) {
      return _0x436588;
    }
    const _0x29b6fd = createDynamicWorkflowItemFromManifest(_0x41bc4f);
    if (_0x29b6fd?.["key"]) {
      return _0x29b6fd['key'];
    }
  }
  return '';
}
function getDefaultWorkflow() {
  return AUDIO_WORKFLOW_ITEMS[0x0];
}
export { isRunningHubAudioWorkflowItem };
function getPlainGenerationParams(_0x5da306) {
  return _0x5da306 && typeof _0x5da306 === "object" && !Array["isArray"](_0x5da306) ? {
    ..._0x5da306
  } : {};
}
function resolveWorkflowSchemaParam(_0x2397a7, _0x1221fc, _0x164db4) {
  const _0x186b45 = getAudioWorkflowUiSchemaField(_0x1221fc, _0x164db4);
  if (!_0x186b45) {
    throw new Error('RunningHub\x20audio\x20manifest\x20' + _0x1221fc + '\x20missing\x20' + _0x164db4);
  }
  if (_0x186b45["defaultValue"] === undefined) {
    throw new Error("RunningHub audio manifest " + _0x1221fc + '\x20missing\x20' + _0x164db4 + " defaultValue");
  }
  const _0xe5085a = getPlainGenerationParams(_0x2397a7?.["generationParams"]);
  const _0x443261 = Object["prototype"]['hasOwnProperty']["call"](_0xe5085a, _0x164db4) ? _0xe5085a[_0x164db4] : _0x186b45["defaultValue"];
  if (_0x443261 === undefined || _0x443261 === null || String(_0x443261)["trim"]() === '') {
    throw new Error("RunningHub audio manifest " + _0x1221fc + " missing " + _0x164db4);
  }
  return _0x443261;
}
function normalizePromptForBackend(_0x53b76a, _0x4a17d1) {
  if (!doesAudioWorkflowAcceptTextInput(_0x53b76a)) {
    return '';
  }
  const _0x244e81 = String(_0x4a17d1 || '')["trim"]();
  if (_0x53b76a !== ADVANCED_VOICE_CLONE_WORKFLOW_KEY) {
    return _0x244e81;
  }
  return _0x244e81["replace"](/(^|\s+)@?音频1\s*[:：]?\s*/g, "$1[speaker_1]: ")["replace"](/(^|\s+)@?音频2\s*[:：]?\s*/g, "$1[speaker_2]: ")['replace'](/\s+(\[speaker_[12]\]:)/g, '\x0a$1')["trim"]();
}
function toLocalAssetUrl(_0x4f8452) {
  return localPathToUrl(_0x4f8452);
}
function isLikelyImageUrl(_0x35419b) {
  const _0x3e2c1b = String(_0x35419b || '')["trim"]()["toLowerCase"]();
  if (!_0x3e2c1b) {
    return ![];
  }
  if (_0x3e2c1b["startsWith"]("data:image/")) {
    return !![];
  }
  return /\.(png|jpe?g|webp|gif|bmp|svg|avif)(\?|#|$)/i["test"](_0x3e2c1b);
}
function localUrlFromPath(_0x3aa5aa) {
  return localPathToUrl(_0x3aa5aa);
}
function normalizeAudioRemoteUrl(_0x43a97d) {
  const _0xd17a16 = String(_0x43a97d || '')['trim']();
  if (!_0xd17a16) {
    return '';
  }
  if (_0xd17a16["startsWith"]('/')) {
    return _0xd17a16;
  }
  if (/^data:/i["test"](_0xd17a16)) {
    return _0xd17a16;
  }
  if (/^blob:/i["test"](_0xd17a16)) {
    return _0xd17a16;
  }
  if (_0xd17a16["startsWith"]('//')) {
    return "https:" + _0xd17a16;
  }
  if (/^https?:\/\//i['test'](_0xd17a16)) {
    return _0xd17a16;
  }
  return "https://" + _0xd17a16['replace'](/^\/+/, '');
}
export class AIGenAudioNode {
  constructor(_0x224943) {
    this["_data"] = _0x224943;
    this["nodeId"] = _0x224943['id'];
    this["previewEl"] = null;
    this["audioEl"] = null;
    this["_placeholderEl"] = null;
    this["refBarEl"] = null;
    this["promptEl"] = null;
    this["btnEl"] = null;
    this['modelWrap'] = null;
    this["_currentSrc"] = null;
    this['_audioLoadToken'] = 0x0;
    this["_audioLoadInFlightSource"] = '';
    this['_audioLoadInFlightPreload'] = '';
    this["_audioPlayAttemptToken"] = 0x0;
    this["_audioPlayDeadlineTimer"] = null;
    this["_audioPlayPending"] = ![];
    this["_playbackResumeSource"] = '';
    this["_playbackResumeTime"] = 0x0;
    this["_lastEdgeSig"] = null;
    this["_isGenerating"] = ![];
    this['_modelMenu'] = null;
    this["_runninghubSubmenu"] = null;
    this["_modelLabelEl"] = null;
    this['_workflowSchemaSlotElements'] = null;
    this["_lastRenderedWorkflowKey"] = '';
    this["_docClickHandler"] = null;
    this["_submenuCloseTimer"] = null;
    this["_unbindRefThumbHoverPreview"] = null;
    this["_attachBtnIcon"] = null;
    this["_audioRefUploadInput"] = null;
    this["_audioRefUploadSlot"] = '';
    this["_audioRefUploadAnchorNodeId"] = '';
    this["_lastRefMediaSig"] = '';
    this["_lastWorkflowKey"] = '';
    this["_refBarWorkflowKey"] = '';
    this['_speedIdx'] = 0x0;
    this["_audioCard"] = null;
    this["_audioMainSurface"] = null;
    this["_audioMultiResultsContainer"] = null;
    this["_audioMultiStackWrap"] = null;
    this['_audioMultiBackdropWrap'] = null;
    this["_audioMultiToggleBtn"] = null;
    this["_audioMultiBackplateEls"] = [];
    this["_lastAudioResultsKeyStr"] = '';
    this["_lastMainAudioIndex"] = 0x0;
    this["_lastIsAudiosExpanded"] = ![];
    this['_waveBgEl'] = null;
    this["_wavePlayed"] = null;
    this['_progressLine'] = null;
    this["_bar"] = null;
    this["_controlsEl"] = null;
    this["_playBtn"] = null;
    this["_timeEl"] = null;
    this["_waveBgPath"] = null;
    this['_waveFgPath'] = null;
    this["_waveformLocalPath"] = '';
    this["_waveToken"] = 0x0;
    this["_cancelDeferredWaveform"] = null;
    this["_waveformAbortController"] = null;
    this["_statusOverlayEl"] = null;
    this["_isSeeking"] = ![];
    this["_progressController"] = null;
    this["_audioDurationProbeToken"] = 0x0;
    this["_promptPanel"] = null;
    this["_promptInputWrap"] = null;
    this["_isPromptBoxResizing"] = ![];
    this['_promptResizeHandle'] = ![];
    this["_promptResizeCleanup"] = null;
    this["_rhCancelInFlight"] = ![];
    this["_assetMentionRegistryUnsubscribe"] = null;
    this['_assetMentionRegistryRefreshPending'] = ![];
    this["_vipInstallId"] = '';
    this['_vipSelectionRetryInProgress'] = ![];
    this['_generationNodeHelpTip'] = null;
    this["_modelProviderProfileControl"] = null;
    this["_uiSchemaCleanup"] = null;
    this["_footerControllerCleanup"] = null;
    this["_unsubscribeLocale"] = null;
    this["_toolbarActionCleanups"] = [];
    this["footerEl"] = null;
    this["_rendererDetailsDeferred"] = shouldDeferRendererDetailsOnMount(_0x224943);
    this["_rendererMediaDeferred"] = shouldDeferRendererMediaOnMount(_0x224943);
    this['_audioTaskOrchestration'] = createAudioNodeTaskOrchestration({
      'nodeId': this["nodeId"],
      'store': a311_0xe0f4bd,
      'api': {
        'generateAudio': generateAudio,
        'resumeRunningHubAudioTask': resumeRunningHubAudioTask,
        'cancelRunningHubAudioTask': cancelRunningHubAudioTask
      },
      'ensureConfig': ensureConfig,
      'getProviderConfig': getProviderConfig,
      'buildResultPatch': (_0x5eced2, _0x4ae9b7) => this["_buildAudioResultPatch"](_0x5eced2, _0x4ae9b7),
      'afterResultCommit': (_0x3052b2, _0x4c8f94) => this['_applyAudioResultProjection'](_0x3052b2, _0x4c8f94),
      'persistTaskState': () => this["_persistRunningHubResumeCache"](),
      'setBusyState': ({
        isGenerating: _0x37cbcf,
        cancelInFlight: _0x218db7
      }) => {
        this["_isGenerating"] = _0x37cbcf;
        this["_rhCancelInFlight"] = _0x218db7;
        this['_setGeneratingUi']();
      },
      'setLoading': _0x1f318d => {
        if (!this["previewEl"]) {
          return;
        }
        if (_0x1f318d) {
          startLoading(this['previewEl']);
        } else {
          stopLoading(this['previewEl']);
        }
      },
      'onSuccess': (_0x16c52a, {
        recovering = ![]
      } = {}) => {
        if (recovering) {
          return;
        }
        window['showToast']?.(aigenAudioText("generation.completed"), "success");
      },
      'onFailure': (_0x431b17, _0x38606a) => this["_handleAudioTaskFailure"](_0x431b17, _0x38606a),
      'messages': {
        'generationFailed': () => aigenAudioText("generation.failed"),
        'interrupted': () => aigenAudioText("generation.interrupted"),
        'interruptedMissingTaskId': () => aigenAudioText("cancel.interruptedMissingTaskId"),
        'cancelSuccess': () => aigenAudioText("cancel.success"),
        'cancelFailed': () => aigenAudioText("cancel.failed"),
        'cancelTaskMissing': () => aigenAudioText('cancel.taskMissing'),
        'missingApiKey': () => aigenAudioText('cancel.missingApiKey')
      }
    });
  }
  ['_getCurrentWorkflow']() {
    const _0x5aaa37 = resolveWorkflowKeyFromNodeData(this['_data']);
    return getWorkflowByKey(_0x5aaa37) || getDefaultWorkflow();
  }
  ["_syncWorkflowDefaults"]() {
    const _0x3c6e3c = this["_getCurrentWorkflow"]();
    const _0x51bda4 = getStoreSnapshot()['nodes']?.[this["nodeId"]] || this["_data"];
    const _0x29734f = buildAudioWorkflowDefaultSyncPatch({
      'nodeData': _0x51bda4,
      'workflow': _0x3c6e3c
    });
    if (!Object['keys'](_0x29734f)["length"]) {
      return;
    }
    a311_0xe0f4bd["updateNodeData"](this["nodeId"], _0x29734f);
    this["_data"] = {
      ..._0x51bda4,
      ..._0x29734f
    };
  }
  ['_setSelectedWorkflow'](_0x4cb0a0) {
    const _0x9cb672 = getWorkflowByKey(_0x4cb0a0);
    if (!_0x9cb672) {
      return;
    }
    if (!this["_guardVipWorkflowSelection"](_0x9cb672["key"], () => {
      this['_vipSelectionRetryInProgress'] = !![];
      try {
        this['_setSelectedWorkflow'](_0x9cb672["key"]);
      } finally {
        this["_vipSelectionRetryInProgress"] = ![];
      }
    })) {
      return;
    }
    const _0x1b7c04 = a311_0xe0f4bd['getState']?.()?.["nodes"]?.[this['nodeId']] || this["_data"];
    const _0x56bc91 = buildAudioWorkflowSelectionPatch({
      'nodeData': _0x1b7c04,
      'workflow': _0x9cb672
    });
    a311_0xe0f4bd['updateNodeData'](this["nodeId"], _0x56bc91);
    this["_data"] = {
      ...this['_data'],
      ..._0x56bc91
    };
    this['_enforceWorkflowAudioInputLimit']();
    this["_lastEdgeSig"] = null;
    this['_lastRefMediaSig'] = '';
    this['_lastWorkflowKey'] = '';
    this["_lastRenderedWorkflowKey"] = '';
    this["_refBarWorkflowKey"] = '';
    this["_renderRefBar"]();
    this["_refreshWorkflowUi"]();
    this["_updateSubmitButtonState"]();
  }
  ["_closeModelMenu"]() {
    this['_modelMenu']?.["classList"]["remove"]("show");
    if (this["_runninghubSubmenu"]) {
      this["_runninghubSubmenu"]["style"]["display"] = "none";
    }
    this["_submenuCloseTimer"] && (clearTimeout(this["_submenuCloseTimer"]), this['_submenuCloseTimer'] = null);
  }
  ["_openSubmenu"]() {
    if (!this["_runninghubSubmenu"]) {
      return;
    }
    this['_submenuCloseTimer'] && (clearTimeout(this["_submenuCloseTimer"]), this['_submenuCloseTimer'] = null);
    this["_runninghubSubmenu"]["style"]["display"] = "flex";
  }
  ["_scheduleCloseSubmenu"]() {
    if (this["_submenuCloseTimer"]) {
      clearTimeout(this["_submenuCloseTimer"]);
    }
    this["_submenuCloseTimer"] = setTimeout(() => {
      if (this["_runninghubSubmenu"]) {
        this["_runninghubSubmenu"]["style"]["display"] = 'none';
      }
      this["_submenuCloseTimer"] = null;
    }, 0x96);
  }
  ['_refreshWorkflowUi']() {
    const _0x4df54b = this["_getCurrentWorkflow"]();
    const _0x830b0d = getStoreSnapshot()["nodes"]?.[this["nodeId"]] || this["_data"];
    this["_data"] !== _0x830b0d && (this['_data'] = _0x830b0d);
    if (this["_modelLabelEl"]) {
      this["_modelLabelEl"]["textContent"] = _0x4df54b["label"];
    }
    this['_syncPromptInputVisibility'](_0x4df54b["key"]);
    this['_syncAudioPromptHelpTip'](_0x4df54b["key"]);
    const _0xdd3e9a = syncAudioWorkflowSchemaSlots({
      'root': this["_root"],
      'workflow': _0x4df54b,
      'nodeData': this["_data"],
      'elements': this["_workflowSchemaSlotElements"],
      'lastRenderedWorkflowKey': this["_lastRenderedWorkflowKey"]
    });
    this["_lastRenderedWorkflowKey"] = _0xdd3e9a["lastRenderedWorkflowKey"];
    this["_runninghubSubmenu"]?.["querySelectorAll"](".floating-menu-item")["forEach"](_0x50a18e => {
      _0x50a18e["classList"]["toggle"]("active", _0x50a18e["dataset"]["value"] === _0x4df54b["key"]);
    });
    this["_modelMenu"]?.["querySelectorAll"](".node-menu-submenu .floating-menu-item")["forEach"](_0x3e4974 => {
      _0x3e4974["classList"]["toggle"]("active", _0x3e4974["dataset"]["value"] === _0x4df54b["key"]);
    });
    this["_syncModelProviderProfileControl"]();
  }
  ["refreshModelRegistryUi"]() {
    if (this["_rendererDetailsDeferred"] === !![] || !this["footerEl"]) {
      return ![];
    }
    this["_renderFooter"](this['footerEl']);
    this["_refreshWorkflowUi"]();
    this["_updateSubmitButtonState"]();
    return !![];
  }
  ["_getGenerationNodeHelpText"](_0x1dbe80 = this["_getCurrentWorkflow"]()["key"]) {
    return getGenerationNodeHelpTooltip({
      'kind': "audio",
      'key': _0x1dbe80
    });
  }
  ["_ensureGenerationNodeHelpTip"]() {
    if (this["_generationNodeHelpTip"] || !this["_promptPanel"]) {
      return this['_generationNodeHelpTip'];
    }
    this["_generationNodeHelpTip"] = createGenerationNodeHelpTipController({
      'panel': this["_promptPanel"],
      'getHelpText': () => this["_getGenerationNodeHelpText"](),
      'ariaLabel': aigenAudioText("help.ariaLabel")
    });
    return this["_generationNodeHelpTip"];
  }
  ["_syncAudioPromptHelpTip"]() {
    this["_ensureGenerationNodeHelpTip"]()?.["sync"]();
  }
  ["_ensureModelProviderProfileControl"]() {
    if (this["_modelProviderProfileControl"] || !this['_promptPanel']) {
      return this["_modelProviderProfileControl"];
    }
    this["_modelProviderProfileControl"] = createModelProviderProfileControl({
      'panel': this["_promptPanel"],
      'getNodeData': () => a311_0xe0f4bd["getState"]()["nodes"]?.[this["nodeId"]] || this['_data'] || {},
      'onChange': _0x1db02e => a311_0xe0f4bd["updateNodeData"](this["nodeId"], _0x1db02e)
    });
    return this["_modelProviderProfileControl"];
  }
  ["_syncModelProviderProfileControl"]() {
    this["_ensureModelProviderProfileControl"]()?.["sync"]();
  }
  ["_syncPromptInputVisibility"](_0x3df4bd = this["_getCurrentWorkflow"]()["key"]) {
    if (!this['_promptInputWrap'] || !this["promptEl"]) {
      return;
    }
    const _0x32bbe6 = doesAudioWorkflowAcceptTextInput(_0x3df4bd);
    this["_promptInputWrap"]["hidden"] = !_0x32bbe6;
    this["_promptInputWrap"]["classList"]['toggle']("is-hidden", !_0x32bbe6);
    this["promptEl"]['setAttribute']("aria-hidden", _0x32bbe6 ? "false" : "true");
    this["promptEl"]["contentEditable"] = _0x32bbe6 ? "true" : "false";
    syncAudioPromptPlaceholder(this["promptEl"], _0x3df4bd);
  }
  ['_resolveAudioRefUrl'](_0x30bc97) {
    return resolveCanvasAudioUrl(_0x30bc97);
  }
  ['_getAudioResultItems'](_0x351bff = this["_data"]) {
    const _0x19e7df = Array["isArray"](_0x351bff?.["audios"]) ? _0x351bff["audios"] : [];
    if (_0x19e7df['length'] > 0x0) {
      return _0x19e7df["filter"](_0x2d7a2e => _0x2d7a2e && typeof _0x2d7a2e === "object")["map"](_0x4c06d4 => ({
        ..._0x4c06d4,
        'audioUrl': resolveCanvasAudioUrl(_0x4c06d4) || String(_0x4c06d4['audioUrl'] || '')["trim"]()
      }))["filter"](_0x581d57 => String(_0x581d57["audioUrl"] || _0x581d57['localPath'] || '')["trim"]());
    }
    const _0xc31e4c = resolveCanvasAudioUrl(_0x351bff);
    if (!_0xc31e4c) {
      return [];
    }
    return [{
      'audioUrl': _0xc31e4c,
      'src': _0xc31e4c,
      'localPath': normalizeLocalPath(_0x351bff?.["localPath"] || _0xc31e4c),
      'waveformLocalPath': _0x351bff?.['waveformLocalPath'],
      'audioDuration': _0x351bff?.['audioDuration'],
      'assetId': _0x351bff?.["assetId"],
      'derivativeStatus': _0x351bff?.["derivativeStatus"],
      'fileName': _0x351bff?.["fileName"]
    }];
  }
  ['_getMainAudioIndex'](_0x3055be = this["_data"], _0x3f3e63 = 0x0) {
    const _0x18da49 = Number(_0x3055be?.['mainAudioIndex']);
    if (!Number['isFinite'](_0x18da49) || _0x18da49 < 0x0) {
      return 0x0;
    }
    return Math['min'](Math["max"](0x0, Math["trunc"](_0x18da49)), Math["max"](0x0, _0x3f3e63 - 0x1));
  }
  ["_resolveNodeAudioUrl"](_0x234745) {
    const _0x4059fb = this["_getAudioResultItems"](_0x234745);
    if (_0x4059fb["length"] > 0x0) {
      const _0x1030d3 = this["_getMainAudioIndex"](_0x234745, _0x4059fb["length"]);
      return resolveCanvasAudioUrl(_0x4059fb[_0x1030d3] || _0x4059fb[0x0]) || '';
    }
    return '';
  }
  ["_applyAudioMultiToggleVisual"](_0x4a3077, _0x5ca2ac) {
    const _0x29ae02 = this["_audioMultiToggleBtn"];
    if (!_0x29ae02) {
      return;
    }
    _0x29ae02['classList']["toggle"]("is-expanded", !!_0x4a3077);
    _0x29ae02["innerHTML"] = _0x4a3077 ? '<span>' + _0x5ca2ac + "</span><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"9 18 15 12 9 6\"></polyline></svg>" : "<span>" + _0x5ca2ac + "</span><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>";
  }
  ['_clearAudioMultiResultStack']() {
    this["_audioMultiResultsContainer"] && this["_audioMultiResultsContainer"]["remove"]();
    this["_audioMultiToggleBtn"] && this['_audioMultiToggleBtn']['remove']();
    clearMultiResultStackClasses({
      'previewEl': this['previewEl'],
      'stackWrap': this["_audioMultiStackWrap"]
    });
    this['_audioMultiResultsContainer'] = null;
    this["_audioMultiStackWrap"] = null;
    this['_audioMultiBackdropWrap'] = null;
    this["_audioMultiToggleBtn"] = null;
    this["_audioMultiBackplateEls"] = [];
    this["_lastAudioResultsKeyStr"] = '';
  }
  ["_applyAudioMultiStackLayout"]({
    count: _0x59f3b7,
    mainIndex: _0x2767dd,
    expanded: _0x46dad9
  }) {
    if (!this["previewEl"] || !this['_audioMultiBackdropWrap']) {
      return;
    }
    const _0x3feaa9 = this["previewEl"]['offsetWidth'] || this["_data"]?.["width"] || AUDIO_RESULT_WIDTH;
    const _0x31e6e3 = this["previewEl"]["offsetHeight"] || this["_data"]?.["height"] || AUDIO_RESULT_HEIGHT;
    const _0x1ea76c = 0xc;
    const _0x3709ff = 0x26;
    const _0x9daa8a = 0x12;
    const _0x4d6fd6 = Math['max'](0x1, _0x3feaa9 - _0x3709ff - 0x4);
    const _0x56626c = Math["max"](0x1, _0x31e6e3 - _0x9daa8a * 0x2);
    const _0x2b7182 = buildMultiResultExpandedSlotMap({
      'imageCount': _0x59f3b7,
      'mainIndex': _0x2767dd,
      'previewWidth': _0x3feaa9,
      'previewHeight': _0x31e6e3,
      'gap': _0x1ea76c
    });
    this["_audioMultiBackdropWrap"]["querySelectorAll"]('.' + MULTI_RESULT_BACKPLATE_CLASS)["forEach"](_0x56ab55 => {
      const _0x59a85b = Number(_0x56ab55["dataset"]?.['imageIndex']);
      const _0x4f0a58 = Math["max"](0x1, Number(_0x56ab55['dataset']?.["stackIndex"]) || 0x1);
      const _0x1bf9c0 = buildMultiResultCollapsedFrame(_0x4f0a58);
      const _0x145a97 = _0x2b7182["get"](_0x59a85b);
      const _0x4c072c = !!_0x46dad9 && !!_0x145a97;
      const _0x46f611 = _0x56ab55["querySelector"](".multi-stack-backplate-media");
      const _0x1c4f66 = "translate(" + _0x1bf9c0['x'] + 'px,\x20' + _0x1bf9c0['y'] + "px) rotate(" + _0x1bf9c0['rotate'] + 'deg)\x20scale(' + _0x1bf9c0["scale"] + ')';
      Object['assign'](_0x56ab55["style"], {
        'display': _0x4c072c ? 'block' : "none",
        'top': _0x4c072c ? _0x145a97["top"] + 'px' : _0x9daa8a + 'px',
        'left': _0x4c072c ? _0x145a97["left"] + 'px' : _0x3709ff + 'px',
        'width': _0x4c072c ? _0x3feaa9 + 'px' : _0x4d6fd6 + 'px',
        'height': _0x4c072c ? _0x31e6e3 + 'px' : _0x56626c + 'px',
        'opacity': _0x4c072c ? '1' : String(_0x1bf9c0["opacity"]),
        'pointerEvents': _0x4c072c ? "auto" : 'none',
        'zIndex': _0x4c072c ? String(0x2 + _0x145a97["order"]) : String(_0x4f0a58),
        'borderRadius': _0x4c072c ? '18px' : '0\x20var(--radius-16)\x20var(--radius-16)\x200',
        'transform': _0x4c072c ? "translate(0px, 0px) rotate(0deg) scale(1)" : _0x1c4f66,
        'filter': _0x4c072c ? "brightness(1) saturate(1)" : 'brightness(0.86)\x20saturate(0.92)',
        'transformOrigin': _0x4c072c ? 'bottom\x20left' : 'center\x20right'
      });
      _0x56ab55["classList"]['toggle']("is-expanded-card", _0x4c072c);
      _0x46f611 && (_0x46f611["style"]["opacity"] = _0x4c072c ? '1' : '0', _0x46f611["style"]["transform"] = _0x4c072c ? "scale(1)" : "scale(1.02)");
    });
  }
  ['_syncAudioMultiResultStack'](_0xc12b84 = this["_data"]) {
    if (!this["previewEl"]) {
      return;
    }
    const _0x459a2a = this["_getAudioResultItems"](_0xc12b84);
    const _0xefc70e = _0x459a2a["length"];
    if (_0xefc70e <= 0x1) {
      this["_clearAudioMultiResultStack"]();
      return;
    }
    this['_root']?.["style"]["setProperty"]("overflow", "visible");
    const _0x2ca18b = this["_getMainAudioIndex"](_0xc12b84, _0xefc70e);
    const _0x44b589 = !!_0xc12b84?.["isAudiosExpanded"];
    const _0xf4679a = _0x459a2a["map"](_0x1d25a6 => [String(_0x1d25a6['audioUrl'] || ''), String(_0x1d25a6["localPath"] || '')]["join"]('|'))["join"]('||');
    const _0x27d245 = _0xf4679a !== this["_lastAudioResultsKeyStr"] || _0x2ca18b !== this["_lastMainAudioIndex"] || !this["_audioMultiResultsContainer"] || !this["_audioMultiStackWrap"] || !this["_audioMultiBackdropWrap"];
    if (_0x27d245) {
      this["_clearAudioMultiResultStack"]();
      const _0x28eb4f = document["createElement"]("div");
      _0x28eb4f['className'] = 'audio-multi-results-container';
      const _0x8b834d = document["createElement"]("div");
      _0x8b834d["className"] = MULTI_RESULT_STACK_WRAP_CLASS;
      const _0x257335 = buildMultiResultBackplateItems({
        'imageCount': _0xefc70e,
        'mainIndex': _0x2ca18b
      });
      const _0x46a467 = createMultiResultBackplates(document, _0xefc70e, {
        'items': _0x257335
      });
      _0x46a467 && (_0x8b834d["appendChild"](_0x46a467), _0x46a467["querySelectorAll"]('.' + MULTI_RESULT_BACKPLATE_CLASS)['forEach'](_0xd0776e => {
        const _0x45fb2e = Number(_0xd0776e['dataset']?.["imageIndex"]);
        if (!Number["isFinite"](_0x45fb2e)) {
          return;
        }
        this["_audioMultiBackplateEls"][_0x45fb2e] = _0xd0776e;
        const _0xcc51c5 = document["createElement"]("div");
        _0xcc51c5['className'] = "multi-stack-backplate-media audio-multi-wave-preview";
        _0xcc51c5['innerHTML'] = "<svg width=\"100%\" height=\"80\" viewBox=\"0 0 200 80\" preserveAspectRatio=\"none\">\n              <path d=\"" + WAVE_PATH + "\" stroke=\"var(--blue)\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n              <path d=\"M0,40 L200,40\" stroke=\"var(--blue)\" stroke-width=\"1\" stroke-dasharray=\"2 4\" opacity=\"0.4\"/>\n            </svg>";
        _0xd0776e["appendChild"](_0xcc51c5);
        _0xd0776e['addEventListener']("pointerdown", _0x36a91 => {
          const _0x1ab401 = a311_0xe0f4bd['getState']()["nodes"]?.[this["nodeId"]] || {};
          if (_0x1ab401?.["isAudiosExpanded"]) {
            _0x36a91['stopPropagation']();
          }
        });
        _0xd0776e["addEventListener"]("click", _0x34d95c => {
          const _0x4ca473 = a311_0xe0f4bd["getState"]()["nodes"]?.[this["nodeId"]] || {};
          if (!_0x4ca473?.["isAudiosExpanded"]) {
            return;
          }
          _0x34d95c["preventDefault"]();
          _0x34d95c["stopPropagation"]();
          this["_selectMainAudioResult"](Number(_0xd0776e["dataset"]?.["imageIndex"]));
        });
      }));
      const _0x5f1a2d = document["createElement"]('button');
      _0x5f1a2d["type"] = "button";
      _0x5f1a2d["className"] = "multi-toggle-btn audio-multi-toggle-btn";
      _0x5f1a2d['addEventListener']("pointerdown", _0x2590d7 => {
        if (_0x2590d7["button"] !== 0x0) {
          return;
        }
        _0x2590d7["preventDefault"]();
        _0x2590d7["stopPropagation"]();
        const _0x3d923b = a311_0xe0f4bd["getState"]()["nodes"]?.[this["nodeId"]] || {};
        if (_0x3d923b?.["isAudiosExpanded"]) {
          this["_selectMainAudioResult"](_0x3d923b["mainAudioIndex"] ?? this["_lastMainAudioIndex"] ?? 0x0);
          return;
        }
        a311_0xe0f4bd['updateNodeData'](this["nodeId"], {
          'isAudiosExpanded': !![]
        });
      });
      _0x5f1a2d["addEventListener"]("click", _0x2d13aa => {
        _0x2d13aa["preventDefault"]();
        _0x2d13aa["stopPropagation"]();
      });
      _0x28eb4f["appendChild"](_0x8b834d);
      this['_audioMainSurface'] && this["_audioMainSurface"]["parentNode"] === this["previewEl"] ? this['previewEl']['insertBefore'](_0x28eb4f, this["_audioMainSurface"]) : this["previewEl"]["appendChild"](_0x28eb4f);
      this["previewEl"]['appendChild'](_0x5f1a2d);
      this["_audioMultiResultsContainer"] = _0x28eb4f;
      this["_audioMultiStackWrap"] = _0x8b834d;
      this["_audioMultiBackdropWrap"] = _0x46a467;
      this["_audioMultiToggleBtn"] = _0x5f1a2d;
      this["_lastAudioResultsKeyStr"] = _0xf4679a;
    }
    syncMultiResultStackClasses({
      'previewEl': this['previewEl'],
      'stackWrap': this["_audioMultiStackWrap"],
      'isActive': _0xefc70e > 0x1,
      'isExpanded': _0x44b589
    });
    this["_applyAudioMultiToggleVisual"](_0x44b589, _0xefc70e);
    this["_applyAudioMultiStackLayout"]({
      'count': _0xefc70e,
      'mainIndex': _0x2ca18b,
      'expanded': _0x44b589
    });
    this["_lastMainAudioIndex"] = _0x2ca18b;
    this['_lastIsAudiosExpanded'] = _0x44b589;
  }
  ['_selectMainAudioResult'](_0x44b4b5 = 0x0) {
    const _0x3748e0 = a311_0xe0f4bd["getState"]()['nodes']?.[this['nodeId']] || this['_data'] || {};
    const _0x2c1dfd = this['_getAudioResultItems'](_0x3748e0);
    if (_0x2c1dfd['length'] === 0x0) {
      return;
    }
    const _0x5a074a = Number["isFinite"](Number(_0x44b4b5)) ? Math["min"](_0x2c1dfd["length"] - 0x1, Math['max'](0x0, Math["trunc"](Number(_0x44b4b5)))) : 0x0;
    const _0x14648f = _0x2c1dfd[_0x5a074a] || _0x2c1dfd[0x0];
    const _0x28657f = resolveCanvasAudioUrl(_0x14648f);
    if (!_0x28657f) {
      return;
    }
    const _0x42bc42 = {
      'mainAudioIndex': _0x5a074a,
      'isAudiosExpanded': ![],
      'audioUrl': _0x28657f,
      'src': _0x28657f,
      'localPath': normalizeLocalPath(_0x14648f["localPath"] || _0x28657f)
    };
    for (const _0x4c4313 of ["waveformLocalPath", 'assetId', 'derivativeStatus', "fileName", 'audioDuration']) {
      if (_0x14648f[_0x4c4313] !== undefined) {
        _0x42bc42[_0x4c4313] = _0x14648f[_0x4c4313];
      }
    }
    a311_0xe0f4bd["updateNodeData"](this["nodeId"], _0x42bc42);
  }
  ["_resolveVideoRefUrl"](_0x10c61c) {
    const _0xe30fae = Number['isFinite'](Number(_0x10c61c?.['mainVideoIndex'])) ? Math["max"](0x0, Math["trunc"](Number(_0x10c61c["mainVideoIndex"]))) : 0x0;
    const _0x1d6179 = Array['isArray'](_0x10c61c?.["videos"]) ? _0x10c61c["videos"][_0xe30fae] || _0x10c61c["videos"][0x0] : null;
    return resolveCanvasVideoUrl(_0x1d6179) || resolveCanvasVideoUrl(_0x10c61c);
  }
  async ["_persistAudioOutput"](_0x5b7b81) {
    const _0x40ad1c = normalizeAudioRemoteUrl(_0x5b7b81);
    if (!_0x40ad1c) {
      return {
        'localPath': '',
        'audioUrl': ''
      };
    }
    const _0x1c7b93 = normalizeLocalPath(_0x40ad1c);
    if (_0x1c7b93) {
      const _0x3da396 = _0x1c7b93;
      return {
        'localPath': _0x3da396,
        'audioUrl': localUrlFromPath(_0x3da396)
      };
    }
    try {
      const _0x45a0e9 = await saveRemoteAudioLocallyDetailed(_0x40ad1c);
      const _0x582db9 = pickResultLocalPath(_0x45a0e9);
      if (_0x582db9) {
        const _0x2329f5 = pickAudioDurationSec(_0x45a0e9?.["audioDuration"], _0x45a0e9?.["duration"]);
        return {
          ...(_0x45a0e9 && typeof _0x45a0e9 === "object" ? _0x45a0e9 : {}),
          'localPath': _0x582db9,
          'audioUrl': localUrlFromPath(_0x582db9),
          ...(_0x2329f5 > 0x0 ? {
            'audioDuration': _0x2329f5
          } : {})
        };
      }
    } catch (_0x13c421) {
      console["error"]("[AIGenAudioNode] 音频落盘失败:", _0x13c421);
      const _0x15043f = _0x13c421?.['message'] ? ':\x20' + _0x13c421["message"] : '';
      throw new Error(aigenAudioText("errors.localSaveGeneratedFailed") + _0x15043f);
    }
    throw new Error(aigenAudioText("errors.localSaveGeneratedFailed"));
  }
  ["_persistRunningHubResumeCache"]() {
    try {
      window["_triggerLocalCacheSave"]?.();
    } catch {}
  }
  ['_isRunningHubRecoverableRunningTask'](_0x5e4c01 = this["_data"]) {
    const _0x25448a = String(_0x5e4c01?.['provider'] || '')['trim']()["toLowerCase"]();
    if (_0x25448a !== "runninghubwf" && _0x25448a !== "runninghub") {
      return ![];
    }
    const _0x3d18fb = String(_0x5e4c01?.['rhTaskId'] || '')['trim']();
    if (!_0x3d18fb) {
      return ![];
    }
    const _0x10e05c = String(_0x5e4c01?.['rhTaskStatus'] || '')['trim']()['toLowerCase']();
    if (_0x10e05c === "success" || _0x10e05c === "failed" || _0x10e05c === 'idle' || _0x10e05c === 'cancelled') {
      return ![];
    }
    return !![];
  }
  ["_stopRunningHubRecovery"](_0x36b5b8 = ![]) {
    this["_audioTaskOrchestration"]?.['resetRecovery']({
      'resetRecovering': _0x36b5b8
    });
  }
  ['_setGeneratingUi']() {
    if (!this["btnEl"]) {
      return;
    }
    const _0xc7568c = a311_0xe0f4bd['getState']()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
    const _0x18c8ec = String(_0xc7568c?.["provider"] || "runninghubwf")["toLowerCase"]();
    const _0x815df5 = _0x18c8ec === "runninghubwf" || _0x18c8ec === "runninghub";
    const _0x5c6648 = resolveGenerationButtonMode(_0xc7568c, {
      'cancellable': _0x815df5,
      'cancelInFlight': this["_rhCancelInFlight"] === !![]
    });
    if (_0x5c6648['busy']) {
      _0x815df5 ? setGenerateButtonCancellableUi(this["btnEl"], {
        'title': aigenAudioText("buttons.generateCancellable"),
        'tooltip': aigenAudioText('buttons.generateCancellable'),
        'ariaLabel': aigenAudioText("buttons.cancelAudioGeneration"),
        'color': "var(--red)",
        'busy': !![]
      }) : setGenerateButtonLoadingUi(this['btnEl'], {
        'title': aigenAudioText('buttons.generate'),
        'disabled': !![],
        'ariaLabel': aigenAudioText("buttons.generate")
      });
      this["btnEl"]["disabled"] = _0x5c6648["disabled"];
      this["btnEl"]["style"]["cursor"] = _0x5c6648["cursor"];
      return;
    }
    resetGenerateButtonIdleUi(this["btnEl"], aigenAudioText('buttons.generate'));
    this['_updateSubmitButtonState']();
  }
  ["_guardVipWorkflowSelection"](_0x2ed57a, _0x217478 = null) {
    const _0x26ac72 = getWorkflowGateModelId(_0x2ed57a);
    if (!_0x26ac72) {
      return !![];
    }
    const _0x1de3b2 = window["isModelAllowedBySubscription"];
    const _0x69a56f = typeof _0x1de3b2 === "function" ? _0x1de3b2(_0x26ac72, 'runninghubwf') : !![];
    if (_0x69a56f) {
      return !![];
    }
    if (this["_vipSelectionRetryInProgress"]) {
      return ![];
    }
    typeof window["openSubscriptionDialog"] === "function" ? window["openSubscriptionDialog"]({
      'modelId': _0x26ac72,
      'provider': "runninghubwf",
      'onSuccess': _0x217478
    }) : window['showToast']?.(aigenAudioText("vip.needAuthorization"), "warn");
    return ![];
  }
  async ["runGeneration"](_0x26030b = {}) {
    return this["_onGenerate"](null, _0x26030b);
  }
  async ["cancelGeneration"]() {
    return this["_audioTaskOrchestration"]["cancelGeneration"]();
  }
  ["getGenerationStatus"]() {
    return this["_audioTaskOrchestration"]["getGenerationStatus"]();
  }
  async ['_handleGenerateOrCancel'](_0x3176ad = null) {
    const _0x29bffe = a311_0xe0f4bd["getState"]()["nodes"]?.[this['nodeId']] || this["_data"] || {};
    const _0x3a3856 = String(_0x29bffe?.["provider"] || "runninghubwf")['trim']()["toLowerCase"]();
    const _0x25f4cc = _0x3a3856 === "runninghubwf" || _0x3a3856 === "runninghub";
    if (shouldAllowCancel(_0x29bffe, {
      'cancellable': _0x25f4cc,
      'cancelInFlight': this["_rhCancelInFlight"] === !![]
    })) {
      await this["_cancelRunningHubWorkflowTask"]();
      return;
    }
    await this["_onGenerate"](_0x3176ad);
  }
  async ["_cancelRunningHubWorkflowTask"]() {
    return this["_audioTaskOrchestration"]["cancelGeneration"]();
  }
  async ["_buildAudioResultPatch"](_0x1a03fa, _0x57d316) {
    const _0x245451 = await buildAudioGenerationResultPatch(_0x1a03fa, {
      'startedAt': _0x57d316,
      'persistAudioOutput': _0x4b1354 => this["_persistAudioOutput"](_0x4b1354)
    });
    if (!_0x245451?.["audioUrl"] || !_0x245451?.['localPath']) {
      throw new Error(aigenAudioText("errors.localSaveGeneratedFailed"));
    }
    return _0x245451;
  }
  ["_applyAudioResultProjection"](_0x5b9293, _0xeac8a0) {
    const _0x55fcd6 = {
      'audioUrl': _0x5b9293["audioUrl"],
      'src': _0x5b9293['src'],
      'localPath': _0x5b9293["localPath"],
      'audioDuration': _0x5b9293["audioDuration"],
      'waveformLocalPath': _0x5b9293['waveformLocalPath'],
      'assetId': _0x5b9293["assetId"],
      'derivativeStatus': _0x5b9293["derivativeStatus"],
      'fileName': _0x5b9293['fileName']
    };
    this["_dispatchGenerationHistoryAudio"](_0x5b9293["audios"] || _0x55fcd6, _0xeac8a0);
    this['_applyResultWideLayout']({
      ...this["_data"],
      ..._0x5b9293,
      ..._0x55fcd6
    }, !![]);
    this["_syncAudioMultiResultStack"]({
      ...this["_data"],
      ..._0x5b9293,
      ..._0x55fcd6
    });
    return {
      'finalUrl': _0x55fcd6['audioUrl'],
      'finalLocalPath': _0x55fcd6["localPath"],
      'patch': _0x5b9293
    };
  }
  async ["_applyAudioResultAndStore"](_0x16db87, _0x4b7ca, {
    writeStore = !![]
  } = {}) {
    const _0x5c9e3f = await this["_buildAudioResultPatch"](_0x16db87, _0x4b7ca);
    if (writeStore) {
      a311_0xe0f4bd["updateNodeData"](this['nodeId'], _0x5c9e3f);
    }
    return this["_applyAudioResultProjection"](_0x5c9e3f, _0x4b7ca);
  }
  ["_dispatchGenerationHistoryAudio"](_0x4e8182, _0x40fc42) {
    if (typeof window === 'undefined' || typeof window["dispatchEvent"] !== "function") {
      return;
    }
    const _0x3b581a = (Array["isArray"](_0x4e8182) ? _0x4e8182 : [_0x4e8182])["filter"](_0x271cf5 => _0x271cf5 && typeof _0x271cf5 === "object" && String(_0x271cf5["audioUrl"] || _0x271cf5["localPath"] || '')['trim']());
    if (_0x3b581a['length'] === 0x0) {
      return;
    }
    const _0x5d79b9 = a311_0xe0f4bd["getState"]()['nodes']?.[this['nodeId']] || this["_data"] || {};
    try {
      window["dispatchEvent"](new CustomEvent(GENERATION_HISTORY_EVENT, {
        'detail': {
          'kind': "audio",
          'sourceNodeId': this["nodeId"],
          'nodeData': _0x5d79b9,
          'audios': _0x3b581a,
          'startedAt': _0x40fc42,
          'createdAt': Date["now"]()
        }
      }));
    } catch {}
  }
  async ["_maybeResumeRunningHubTask"]() {
    const _0x5ef9c8 = getStoreSnapshot()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
    if (this["_isGenerating"] && _0x5ef9c8?.["rhTaskRecovering"] !== !![]) {
      return null;
    }
    if (!this["_isRunningHubRecoverableRunningTask"](_0x5ef9c8)) {
      this["_stopRunningHubRecovery"](![]);
      return null;
    }
    const _0x5e0d35 = await this["_buildPayload"]();
    if (!_0x5e0d35) {
      return null;
    }
    return this["_audioTaskOrchestration"]["resumeIfNeeded"]({
      'payload': _0x5e0d35,
      'startedAt': Number(_0x5ef9c8?.['rhTaskStartedAt'] || _0x5ef9c8?.["generationStartTime"] || Date["now"]())
    });
  }
  ["_applyResultWideLayout"](_0x12e0bc = null, _0x2314cb = ![]) {
    const _0x3469a6 = _0x12e0bc || this["_data"] || {};
    const _0x46a5d4 = this["_resolveNodeAudioUrl"](_0x3469a6);
    if (!_0x46a5d4) {
      return;
    }
    const _0x2e72ac = Number(_0x3469a6['width'] || 0x0);
    const _0x2fdc1e = Number(_0x3469a6["height"] || 0x0);
    if (!_0x2314cb && _0x2e72ac > 0x0 && _0x2fdc1e > 0x0) {
      const _0x153147 = _0x2e72ac / _0x2fdc1e;
      const _0x35433a = _0x153147 >= 0x2 && _0x2e72ac >= AUDIO_RESULT_WIDTH - 0x14 && _0x2fdc1e <= AUDIO_RESULT_HEIGHT + 0x28;
      const _0x40bed8 = Math["abs"](_0x153147 - AUDIO_RESULT_RATIO) <= 0.08;
      if (_0x35433a || _0x40bed8) {
        return;
      }
    }
    const _0x3dd5c9 = _0x2e72ac > 0x0 ? _0x2e72ac : AUDIO_RESULT_WIDTH;
    const _0xaa9f9f = _0x2fdc1e > 0x0 ? _0x2fdc1e : AUDIO_RESULT_HEIGHT;
    const _0x32d538 = Number(_0x3469a6['x'] || 0x0) + _0x3dd5c9 / 0x2;
    const _0x26dd9f = Number(_0x3469a6['y'] || 0x0) + _0xaa9f9f / 0x2;
    const _0x1651bc = Math["round"](_0x32d538 - AUDIO_RESULT_WIDTH / 0x2);
    const _0x34c5c2 = Math["round"](_0x26dd9f - AUDIO_RESULT_HEIGHT / 0x2);
    if (_0x2e72ac === AUDIO_RESULT_WIDTH && _0x2fdc1e === AUDIO_RESULT_HEIGHT && Number(_0x3469a6['x'] || 0x0) === _0x1651bc && Number(_0x3469a6['y'] || 0x0) === _0x34c5c2) {
      return;
    }
    a311_0xe0f4bd["updateNodeData"](this["nodeId"], {
      'width': AUDIO_RESULT_WIDTH,
      'height': AUDIO_RESULT_HEIGHT,
      'x': _0x1651bc,
      'y': _0x34c5c2
    });
  }
  ["_collectInputs"](_0x351400 = null) {
    const _0x593709 = a311_0xe0f4bd["getIncomingEdges"](this["nodeId"]);
    const _0x48b9f5 = getStoreSnapshot()['nodes'] || {};
    const _0x500d5a = [];
    const _0x1280fe = [];
    const _0x732733 = [];
    const _0x8cb79f = this["_getCurrentWorkflow"]()["key"];
    const _0x2921e4 = doesAudioWorkflowAcceptTextInput(_0x8cb79f);
    _0x593709['forEach'](_0x41eb1c => {
      const _0x9c0a81 = _0x48b9f5[_0x41eb1c["sourceId"]];
      if (!_0x9c0a81) {
        return;
      }
      const _0x1cc71b = String(_0x9c0a81["type"] || '');
      if (_0x2921e4 && TEXT_INPUT_TYPES["has"](_0x1cc71b)) {
        const _0x48b66c = String(_0x9c0a81["outputText"] || _0x9c0a81['text'] || _0x9c0a81['content'] || _0x9c0a81['prompt'] || '')['trim']();
        if (!_0x48b66c) {
          return;
        }
        _0x500d5a["push"]({
          'edgeId': _0x41eb1c['id'],
          'sourceId': _0x41eb1c['sourceId'],
          'sourceType': _0x1cc71b,
          'text': _0x48b66c
        });
        return;
      }
      if (AUDIO_INPUT_TYPES["has"](_0x1cc71b)) {
        const _0x1bc7f1 = this["_resolveAudioRefUrl"](_0x9c0a81);
        if (!_0x1bc7f1) {
          return;
        }
        _0x1280fe['push']({
          'edgeId': _0x41eb1c['id'],
          'sourceId': _0x41eb1c["sourceId"],
          'sourceType': _0x1cc71b,
          'refSlot': String(_0x41eb1c?.["refSlot"] || ''),
          'fileName': _0x9c0a81["fileName"],
          'size': _0x9c0a81['fileSize'],
          'audioDuration': pickAudioDurationSec(_0x9c0a81["audioDuration"], _0x9c0a81["duration"]),
          'url': _0x1bc7f1
        });
        return;
      }
      if (VIDEO_INPUT_TYPES["has"](_0x1cc71b)) {
        const _0x4f8141 = this['_resolveVideoRefUrl'](_0x9c0a81);
        if (!_0x4f8141) {
          return;
        }
        _0x732733["push"]({
          'edgeId': _0x41eb1c['id'],
          'sourceId': _0x41eb1c["sourceId"],
          'sourceType': _0x1cc71b,
          'url': _0x4f8141
        });
      }
    });
    const _0xe03ed2 = [];
    const _0x1b8688 = _0x2921e4 ? resolvePresetPromptTextWithTextRefs({
      'template': _0x351400,
      'promptEl': this["promptEl"],
      'inEdges': _0x593709,
      'nodes': _0x48b9f5,
      'assetInputRefs': _0xe03ed2,
      'assetMediaCounts': {
        'image': 0x0,
        'video': 0x0,
        'audio': 0x0
      },
      'allowedAssetTypes': ["text", 'audio']
    }) : '';
    const _0xd1601f = _0x48b9f5?.[this["nodeId"]] || this["_data"] || {};
    _0xe03ed2['push'](...getPromptAssetInputRefsFromNode(_0xd1601f, {
      'allowedTypes': ["audio"]
    }));
    const _0x5b00f7 = buildAudioWorkflowInputPlan({
      'workflowKey': _0x8cb79f,
      'audioRefs': _0x1280fe,
      'assetInputRefs': _0xe03ed2
    });
    return {
      'prompt': String(_0x1b8688 || '')["trim"](),
      'textInputs': _0x500d5a,
      'audioRefs': _0x5b00f7["audioRefs"],
      'imageRefs': collectAudioWorkflowImageInputs(_0x8cb79f, _0x593709, _0x48b9f5),
      'videoRefs': _0x732733
    };
  }
  ["_validatePayload"](_0x36e7b3) {
    const _0x57e480 = getWorkflowByKey(_0x36e7b3?.["audioWorkflowKey"]) || getDefaultWorkflow();
    const _0x47c1cd = _0x57e480["validate"](_0x36e7b3);
    return {
      'ok': !_0x47c1cd,
      'message': _0x47c1cd
    };
  }
  ["_buildPayloadSnapshot"](_0x5d5b96 = null) {
    const _0x2ba13c = this["_getCurrentWorkflow"]();
    const _0x22cde5 = this['_collectInputs'](_0x5d5b96);
    const _0x478304 = String(_0x2ba13c["provider"] || 'runninghubwf')["trim"]();
    const _0x5c0d79 = String(_0x2ba13c["adapterType"] || "workflow")["trim"]();
    const _0x7be1d = String(this["_data"]?.["providerProfileId"] || this['_data']?.["rhProviderProfileId"] || '')['trim']();
    const _0x2f104d = (_0x478304 === "runninghubwf" || _0x478304 === "runninghub") && _0x7be1d ? normalizeRunningHubModelApiProfileId(_0x7be1d) : '';
    const _0x1d63a3 = getPlainGenerationParams(this["_data"]?.["generationParams"]);
    const _0x1faee1 = {
      'nodeId': this["nodeId"],
      'provider': _0x478304,
      'adapterType': _0x5c0d79,
      'audioWorkflowKey': _0x2ba13c["key"],
      'audioWorkflowLabel': _0x2ba13c["label"],
      'executionId': _0x2ba13c["executionId"] || '',
      'prompt': normalizePromptForBackend(_0x2ba13c["key"], _0x22cde5['prompt']),
      'textInputs': _0x22cde5['textInputs']["map"](_0x6e3ccb => _0x6e3ccb["text"]),
      'audioRefs': _0x22cde5["audioRefs"],
      'imageRefs': _0x22cde5['imageRefs'],
      'videoRefs': _0x22cde5["videoRefs"],
      'generationParams': _0x1d63a3,
      'installId': String(this['_vipInstallId'] || window["__aicInstallId"] || '')['trim'](),
      ...(_0x2f104d ? {
        'providerProfileId': _0x2f104d,
        'rhProviderProfileId': _0x2f104d
      } : {})
    };
    _0x478304 === "runninghubwf" && (_0x1faee1['rhInstanceType'] = normalizeRunningHubInstanceType(resolveWorkflowSchemaParam(this['_data'], _0x2ba13c["key"], "rhInstanceType")));
    const _0x31e2a1 = this['_validatePayload'](_0x1faee1);
    return {
      'payload': _0x1faee1,
      'validation': _0x31e2a1
    };
  }
  ['_enforceWorkflowAudioInputLimit']() {
    const _0x42cfb1 = this["_getCurrentWorkflow"]();
    const _0x2eb9bb = getAudioWorkflowInputLimit(_0x42cfb1["key"]);
    const _0x457971 = a311_0xe0f4bd["getIncomingEdges"](this["nodeId"]);
    const _0x3cf9d5 = getStoreSnapshot()["nodes"] || {};
    const _0x54fbe2 = _0x457971['filter'](_0x3f1881 => {
      const _0x42a8f6 = _0x3cf9d5[_0x3f1881["sourceId"]];
      return AUDIO_INPUT_TYPES["has"](String(_0x42a8f6?.['type'] || ''));
    });
    if (_0x54fbe2["length"] <= _0x2eb9bb) {
      return;
    }
    const _0x25c3cb = [..._0x54fbe2]["sort"]((_0x1563bc, _0x2396f0) => {
      const _0x593b08 = Number(_0x1563bc?.["createdAt"] || 0x0);
      const _0x387a60 = Number(_0x2396f0?.["createdAt"] || 0x0);
      return _0x593b08 - _0x387a60;
    });
    const _0xa344eb = _0x25c3cb["slice"](0x0, Math["max"](0x0, _0x25c3cb["length"] - _0x2eb9bb));
    if (!_0xa344eb["length"]) {
      return;
    }
    a311_0xe0f4bd["batch"](() => {
      _0xa344eb['forEach'](_0x17801e => a311_0xe0f4bd['removeEdge'](_0x17801e['id']));
    });
  }
  ["_syncPickConnectVisualState"]() {
    const _0xb17b72 = getStoreSnapshot()["pickConnectMode"] || {};
    const _0x91f001 = !!(_0xb17b72["active"] && _0xb17b72["sourceNodeId"] === this["nodeId"]);
    const _0xbce0df = this["refBarEl"]?.['querySelector'](".prompt-attachment-btn .btn-icon") || this["_attachBtnIcon"];
    _0xbce0df && (this["_attachBtnIcon"] = _0xbce0df, _0xbce0df['style']["transition"] = 'opacity\x200.2s\x20ease,\x20transform\x200.2s\x20ease', _0xbce0df["style"]["opacity"] = _0x91f001 ? '0' : '', _0xbce0df["style"]['transform'] = _0x91f001 ? "scale(0.4)" : '', _0xbce0df["style"]["pointerEvents"] = _0x91f001 ? "none" : '');
    if (this["_placeholderEl"]) {
      const _0x54c004 = this["_placeholderEl"]["querySelector"](".placeholder-icon-svg");
      if (_0x54c004) {
        if (_0x91f001) {
          _0x54c004["classList"]["add"]("is-pick-connecting");
        } else {
          _0x54c004["classList"]["remove"]('is-pick-connecting');
        }
      }
    }
  }
  ["_fmtTime"](_0x208e53) {
    if (!_0x208e53 || isNaN(_0x208e53)) {
      return "0:00";
    }
    return Math["floor"](_0x208e53 / 0x3c) + ':' + String(Math["floor"](_0x208e53 % 0x3c))["padStart"](0x2, '0');
  }
  ["_setPlayIcon"](_0x5db4ed) {
    const _0x3b840a = this["_playBtn"]?.["querySelector"]?.("svg");
    if (!_0x3b840a) {
      return;
    }
    const _0x387e16 = 'http://www.w3.org/2000/svg';
    while (_0x3b840a["firstChild"]) {
      _0x3b840a["removeChild"](_0x3b840a['firstChild']);
    }
    if (_0x5db4ed) {
      const _0x316a74 = document["createElementNS"](_0x387e16, 'polygon');
      _0x316a74['setAttribute']("points", "5 3 19 12 5 21 5 3");
      _0x3b840a["appendChild"](_0x316a74);
      return;
    }
    const _0x51303d = document["createElementNS"](_0x387e16, "rect");
    _0x51303d["setAttribute"]('x', '6');
    _0x51303d['setAttribute']('y', '4');
    _0x51303d["setAttribute"]("width", '4');
    _0x51303d['setAttribute']('height', '16');
    const _0x410358 = document["createElementNS"](_0x387e16, "rect");
    _0x410358['setAttribute']('x', '14');
    _0x410358["setAttribute"]('y', '4');
    _0x410358["setAttribute"]("width", '4');
    _0x410358['setAttribute']("height", '16');
    _0x3b840a["appendChild"](_0x51303d);
    _0x3b840a["appendChild"](_0x410358);
  }
  ["_setPlaybackBuffering"](_0xa28d4c) {
    const _0x4758ed = this["_playBtn"];
    if (!_0x4758ed) {
      return;
    }
    _0x4758ed["classList"]?.["toggle"]?.("is-buffering", _0xa28d4c === !![]);
    if (_0xa28d4c === !![]) {
      _0x4758ed["setAttribute"]?.("aria-busy", 'true');
    } else {
      _0x4758ed['removeAttribute']?.("aria-busy");
    }
  }
  ["_seekTo"](_0x5420d1) {
    const _0x384d07 = this["_readAudioDurationSec"]();
    if (!this["audioEl"] || _0x384d07 <= 0x0 || !this["_bar"]) {
      return;
    }
    const _0xd71862 = this["_bar"]["getBoundingClientRect"]();
    if (!_0xd71862["width"]) {
      return;
    }
    let _0x20bcbe = (_0x5420d1 - _0xd71862["left"]) / _0xd71862["width"];
    _0x20bcbe = Math["max"](0x0, Math["min"](0x1, _0x20bcbe));
    const _0x438c59 = _0x20bcbe * _0x384d07;
    if (!isFinite(_0x438c59)) {
      return;
    }
    this["_isSeeking"] = !![];
    this["audioEl"]['currentTime'] = _0x438c59;
    this["_progressController"]?.["sync"]({
      'currentTime': _0x438c59,
      'duration': _0x384d07,
      'force': !![],
      'showLine': !![]
    });
    this['audioEl']["addEventListener"]("seeked", () => {
      this["_isSeeking"] = ![];
      this["_progressController"]?.['sync']({
        'force': !![],
        'showLine': !![]
      });
    }, {
      'once': !![]
    });
  }
  ["_setAudioPreviewResultState"](_0x5c07cd) {
    const _0x38a4ec = !!_0x5c07cd;
    if (this["_waveBgEl"]) {
      this["_waveBgEl"]["style"]['display'] = _0x38a4ec ? '' : "none";
    }
    if (this["_wavePlayed"]) {
      this['_wavePlayed']["style"]['display'] = _0x38a4ec ? '' : "none";
    }
    if (this['_progressLine']) {
      this['_progressLine']["style"]['display'] = _0x38a4ec ? '' : 'none';
    }
    if (this["_bar"]) {
      this["_bar"]["style"]['display'] = _0x38a4ec ? '' : "none";
    }
    if (this["_controlsEl"]) {
      this["_controlsEl"]["style"]["display"] = _0x38a4ec ? '' : 'none';
    }
    if (this["_placeholderEl"]) {
      this['_placeholderEl']["style"]["display"] = _0x38a4ec ? "none" : '';
    }
  }
  ["_getCurrentGateModelId"]() {
    return getWorkflowGateModelId(this["_getCurrentWorkflow"]()['key']);
  }
  async ['_ensureVipAccessForCurrentWorkflow']() {
    const _0x30c6d7 = this['_getCurrentGateModelId']();
    if (!_0x30c6d7) {
      this["_vipInstallId"] = '';
      return !![];
    }
    const _0x304489 = window['isModelAllowedBySubscription'];
    const _0x1c72f8 = typeof _0x304489 === 'function' ? _0x304489(_0x30c6d7, "runninghubwf") : !![];
    if (!_0x1c72f8) {
      typeof window["openSubscriptionDialog"] === "function" ? window["openSubscriptionDialog"]({
        'modelId': _0x30c6d7,
        'provider': "runninghubwf"
      }) : window["showToast"]?.(aigenAudioText("vip.needAuthorization"), 'warn');
      return ![];
    }
    if (typeof window['ensureSubscriptionInstallId'] === "function") {
      try {
        this['_vipInstallId'] = String(await window['ensureSubscriptionInstallId']())['trim']();
      } catch {
        this["_vipInstallId"] = '';
      }
    } else {
      this["_vipInstallId"] = String(window['__aicInstallId'] || '')['trim']();
    }
    return !![];
  }
  async ["_resolveAudioDurationSec"](_0x17a44b) {
    const _0xea3969 = String(_0x17a44b || '')['trim']();
    if (!_0xea3969) {
      return 0x0;
    }
    return await loadAudioDurationMetadataSec(_0xea3969, {
      'timeoutMs': 0x1388
    });
  }
  async ["_validateAdvancedVoiceCloneDurations"](_0x4c4113 = []) {
    if (this["_getCurrentWorkflow"]()["key"] !== ADVANCED_VOICE_CLONE_WORKFLOW_KEY) {
      return !![];
    }
    const _0x51cd1a = Array["isArray"](_0x4c4113) ? _0x4c4113 : [];
    for (const _0x2e3ac2 of _0x51cd1a) {
      const _0x47994c = await this["_resolveAudioDurationSec"](_0x2e3ac2?.["url"]);
      if (Number['isFinite'](_0x47994c) && _0x47994c > 0x0 && (_0x47994c < ADVANCED_VOICE_CLONE_MIN_SECONDS || _0x47994c > ADVANCED_VOICE_CLONE_MAX_SECONDS)) {
        const _0x2dce7f = String(_0x2e3ac2?.["refSlot"] || '') === "audio2" ? aigenAudioText("refs.audio2") : aigenAudioText("refs.audio1");
        window["showToast"]?.(aigenAudioText("validation.advancedVoiceDuration", {
          'label': _0x2dce7f,
          'duration': _0x47994c['toFixed'](0x1)
        }), "warn");
        return ![];
      }
    }
    return !![];
  }
  ["_createStatusCard"](_0x5d6355, _0x32828d) {
    const _0x950f06 = document["createElement"]("div");
    _0x950f06["className"] = "gen-status-card";
    Object['assign'](_0x950f06['style'], {
      'display': "flex",
      'flexDirection': 'column',
      'alignItems': "center",
      'justifyContent': 'center',
      'width': "100%",
      'height': "100%",
      'gap': "8px",
      'padding': "16px",
      'boxSizing': "border-box",
      'background': "var(--bg-panel-card)",
      'textAlign': "center"
    });
    const _0x429271 = Number(_0x32828d) === 0x0;
    const _0x3ea8e2 = _0x429271 ? 'var(--green)' : "var(--white-80)";
    _0x950f06["innerHTML"] = "\n      <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"" + _0x3ea8e2 + "\" stroke-width=\"2\">\n        <circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"" + (_0x429271 ? "M8 12l2.5 2.5L16 9" : "M12 8v5") + "\" />" + (_0x429271 ? '' : "<line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\" />") + "\n      </svg>\n      <span style=\"color:" + _0x3ea8e2 + ";font-size:12px;font-weight:600;line-height:1.4;\">" + _0x5d6355 + "</span>\n    ";
    return _0x950f06;
  }
  ["_ensureStatusOverlayEl"]() {
    if (this["_statusOverlayEl"]) {
      return this["_statusOverlayEl"];
    }
    this['_statusOverlayEl'] = document['createElement']("div");
    this["_statusOverlayEl"]['className'] = "dreamina-status-overlay";
    Object['assign'](this['_statusOverlayEl']['style'], {
      'position': "absolute",
      'inset': '0',
      'display': "flex",
      'alignItems': "center",
      'justifyContent': 'center',
      'pointerEvents': 'none',
      'padding': '16px',
      'boxSizing': "border-box",
      'zIndex': '11'
    });
    this["previewEl"]?.["appendChild"](this['_statusOverlayEl']);
    return this["_statusOverlayEl"];
  }
  ['_clearStatusOverlay']() {
    if (!this["_statusOverlayEl"]) {
      return;
    }
    this["_statusOverlayEl"]["remove"]();
    this["_statusOverlayEl"] = null;
  }
  ["_syncStatusOverlay"](_0x8353e = this["_data"], _0x4623c6 = ![]) {
    const _0x3f3500 = String(_0x8353e?.["rhStatusMessage"] || '')["trim"]() || (String(_0x8353e?.["jobStatus"] || '')["toLowerCase"]() === "error" ? getTaskMessage(_0x8353e) : '');
    const _0x2fba76 = _0x8353e?.["rhStatusCode"];
    if (!_0x4623c6 && _0x3f3500) {
      const _0x2cd920 = this['_ensureStatusOverlayEl']();
      _0x2cd920["innerHTML"] = '';
      _0x2cd920['appendChild'](this["_createStatusCard"](_0x3f3500, _0x2fba76));
      if (this["_placeholderEl"]) {
        this["_placeholderEl"]["style"]["display"] = 'none';
      }
      return;
    }
    this['_clearStatusOverlay']();
  }
  ["_cancelWaveformRequest"]() {
    this['_waveformLoadingKey'] = '';
    this["_waveToken"] = Number(this["_waveToken"] || 0x0) + 0x1;
    const _0x3ebaad = this["_waveformAbortController"];
    this["_waveformAbortController"] = null;
    try {
      _0x3ebaad?.["abort"]?.();
    } catch {}
  }
  async ["_ensureWaveform"](_0x2a19ff) {
    const _0x2f1656 = String(_0x2a19ff || '')["trim"]();
    if (!_0x2f1656 || this['_rendererWaveformVisible'] !== !![]) {
      return;
    }
    const _0x553dae = JSON["stringify"]([_0x2f1656, this['_data']?.["waveformLocalPath"] || '']);
    if (_0x553dae === this["_waveformLoadingKey"]) {
      return;
    }
    this['_cancelWaveformRequest']();
    if (_0x553dae === this["_waveformLoadedKey"]) {
      return;
    }
    this["_waveformLoadingKey"] = _0x553dae;
    const _0x5caa16 = this["_waveToken"];
    const _0x2631f8 = typeof AbortController === "function" ? new AbortController() : null;
    this['_waveformAbortController'] = _0x2631f8;
    const _0x30f61d = localPathToUrl(this["_data"]?.["waveformLocalPath"]);
    this["_waveformLocalPath"] = String(this["_data"]?.["waveformLocalPath"] || '')['trim']();
    let _0x50ddbd = 0x0;
    const _0x147648 = {
      'width': 0xc8,
      'height': 0x50,
      'samples': 0xbe,
      'signal': _0x2631f8?.["signal"],
      'onDuration': this["_readAudioDurationSec"]() > 0x0 ? undefined : _0x1062fe => {
        _0x50ddbd = _0x1062fe;
      }
    };
    let _0x1544fe = '';
    try {
      _0x1544fe = await getAudioNodeWaveformPath(_0x2f1656, _0x30f61d, _0x147648);
    } finally {
      this["_waveformAbortController"] === _0x2631f8 && (this['_waveformAbortController'] = null, this["_waveformLoadingKey"] = '');
    }
    if (_0x2631f8?.["signal"]?.["aborted"]) {
      return;
    }
    if (!this["audioEl"] || !this["_root"] || !this["_root"]["isConnected"]) {
      return;
    }
    if (_0x5caa16 !== this["_waveToken"]) {
      return;
    }
    this["_applyResolvedAudioDuration"](_0x50ddbd, _0x2f1656);
    if (!_0x1544fe) {
      return;
    }
    this['_waveformLoadedKey'] = _0x553dae;
    if (this['_waveBgPath']) {
      this["_waveBgPath"]['setAttribute']('d', _0x1544fe);
    }
    if (this["_waveFgPath"]) {
      this["_waveFgPath"]['setAttribute']('d', _0x1544fe);
    }
  }
  ['setRendererAudioSurfaceVisible'](_0x5ec649) {
    if (this['_rendererWaveformVisible'] === _0x5ec649) {
      return;
    }
    this["_rendererWaveformVisible"] = _0x5ec649;
    if (_0x5ec649) {
      void this["_ensureWaveform"](this['_currentSrc']);
    } else {
      this["_cancelWaveformRequest"]();
    }
  }
  ["_renderInitialFooter"](_0x300ea2) {
    this["footerEl"] = _0x300ea2;
    if (this["_rendererDetailsDeferred"]) {
      this["_renderDeferredFooterShell"](_0x300ea2);
    } else {
      this["_renderFooter"](_0x300ea2);
    }
  }
  ["_renderDeferredFooterShell"](_0x3982cb) {
    if (!_0x3982cb) {
      return;
    }
    if (_0x3982cb['dataset']) {
      _0x3982cb['dataset']["deferredDetailsShell"] = '1';
    }
    _0x3982cb["innerHTML"] = "\n      <div class=\"prompt-actions\">\n        <button type=\"button\" class=\"prompt-submit img-gen-btn\" disabled title=\"" + aigenAudioText('buttons.generate') + "\">\n          <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"5\"/><polyline points=\"5 12 12 5 19 12\"/></svg>\n        </button>\n      </div>";
    this['modelWrap'] = null;
    this["_modelMenu"] = null;
    this['_runninghubSubmenu'] = null;
    this["_modelLabelEl"] = null;
    this["_workflowSchemaSlotElements"] = null;
    this["btnEl"] = _0x3982cb["querySelector"]('.img-gen-btn');
    this['btnEl']?.["addEventListener"]("click", () => {
      flushPromptHtmlCommit(this);
      this["_handleGenerateOrCancel"]();
    });
  }
  ['_renderFooter'](_0x5927bd) {
    if (!_0x5927bd) {
      return;
    }
    if (_0x5927bd['dataset']) {
      delete _0x5927bd["dataset"]['deferredDetailsShell'];
    }
    const _0x1095d3 = this['_getCurrentWorkflow']();
    _0x5927bd["innerHTML"] = buildAudioWorkflowFooterHtml({
      'workflow': _0x1095d3,
      'nodeData': this["_data"],
      'workflowItems': buildAudioWorkflowItems(AUDIO_WORKFLOW_VALIDATORS),
      'debugIconHtml': DEBUG_WRENCH_ICON_HTML,
      'labels': {
        'advanced': aigenAudioText("controls.advancedSettings"),
        'debugTitle': aigenAudioText("debug.buttonTitle"),
        'generateTitle': aigenAudioText('buttons.generate')
      }
    });
    this["modelWrap"] = _0x5927bd['querySelector']('.img-model-wrap');
    this["btnEl"] = _0x5927bd["querySelector"](".img-gen-btn");
    const _0x5b779f = _0x5927bd["querySelector"]('.debug-wrench-btn');
    const _0x14221b = collectAudioWorkflowSchemaSlotElements(_0x5927bd);
    const _0x1970b0 = _0x14221b["modelTrigger"];
    const _0x3e9d2b = _0x5927bd['querySelector'](".img-model-menu");
    const _0xdfddbd = _0x5927bd["querySelector"]("[data-runninghub-toggle]");
    const _0x98249e = _0x5927bd["querySelector"](".runninghub-submenu");
    const _0x2d14d1 = _0x5927bd["querySelector"](".img-model-label");
    const _0x5d1c08 = _0x14221b["advancedButton"];
    const _0x1d8578 = _0x14221b['advancedPanel'];
    this["_modelMenu"] = _0x3e9d2b;
    this["_runninghubSubmenu"] = _0x98249e;
    this["_modelLabelEl"] = _0x2d14d1;
    this["_workflowSchemaSlotElements"] = _0x14221b;
    _0x5d1c08 && _0x1d8578 && _0x5d1c08["addEventListener"]("click", _0x32259d => {
      _0x32259d["stopPropagation"]();
      const _0x24f216 = _0x1d8578["classList"]["toggle"]('show');
      _0x5d1c08["classList"]["toggle"]("active", _0x24f216);
      _0x5d1c08['setAttribute']("aria-expanded", String(_0x24f216));
    });
    _0x5927bd['addEventListener']("click", _0x1075ce => {
      const _0x3bfabd = _0x1075ce["target"]['closest']?.("[data-ui-schema-field-help-url]");
      if (!_0x3bfabd || !_0x5927bd['contains'](_0x3bfabd)) {
        return;
      }
      _0x1075ce["preventDefault"]();
      _0x1075ce["stopPropagation"]();
      const _0x451f68 = String(_0x3bfabd['dataset']['uiSchemaFieldHelpUrl'] || '')["trim"]();
      if (_0x451f68) {
        void openExternalLink(_0x451f68)["catch"](() => {});
      }
    });
    this["_footerControllerCleanup"]?.();
    const _0x235a31 = bindNodeFooterController(_0x5927bd, {
      'onOutsideClose': () => {
        this['_closeModelMenu']();
        closeAudioWorkflowAdvancedPanel(this["_workflowSchemaSlotElements"]);
      }
    });
    this["_footerControllerCleanup"] = bindGenerationNodeCredentialLifecycle(this, _0x235a31);
    this["_uiSchemaCleanup"]?.();
    this['_uiSchemaCleanup'] = bindAudioWorkflowSchemaSlotControls({
      'footer': _0x5927bd,
      'nodeId': this['nodeId'],
      'nodeData': this["_data"],
      'store': a311_0xe0f4bd
    });
    _0x5b779f?.["addEventListener"]('click', _0x197483 => {
      _0x197483["stopPropagation"]();
      if (globalThis["window"]?.['DEV_MODE'] !== !![]) {
        return;
      }
      flushPromptHtmlCommit(this);
      openDebugRequestWindow({
        'prepare': async () => {
          const _0x7fdd26 = await this["_buildPayload"]();
          if (!_0x7fdd26) {
            throw new Error("请先填写提示词或连接参考素材。");
          }
          return buildFinalApiDebugPreview(await buildGenerateAudioRequest(_0x7fdd26));
        }
      });
    });
    bindNodeModelMenuTrigger({
      'root': _0x5927bd,
      'trigger': _0x1970b0,
      'menu': _0x3e9d2b,
      'activateMenuKeyboard': activateMenuKeyboard
    });
    const _0x1ace5b = {
      'listenConfigChanges': ![],
      'getProviderProfileId': () => {
        const _0x4dbe00 = a311_0xe0f4bd["getState"]?.()?.["nodes"]?.[this["nodeId"]] || this["_data"] || {};
        return _0x4dbe00["providerProfileId"] || _0x4dbe00["rhProviderProfileId"] || '';
      }
    };
    this['_modelCredentialMenuCleanup']?.();
    this['_modelCredentialMenuCleanup'] = bindModelCredentialMenu(_0x3e9d2b, _0x1ace5b);
    _0x1970b0?.["addEventListener"]('click', () => {
      void syncModelCredentialMenu(_0x3e9d2b, _0x1ace5b);
    });
    const _0x396ddd = _0x2aba0b => {
      if (_0x2aba0b["classList"]["contains"]("node-menu-group-header")) {
        return;
      }
      if (_0x2aba0b['dataset']["boundClick"] === "true") {
        return;
      }
      _0x2aba0b["dataset"]['boundClick'] = "true";
      _0x2aba0b['addEventListener']("click", _0x17797a => {
        _0x17797a["stopPropagation"]();
        if (_0x2aba0b['dataset']["disabled"] === 'true') {
          return;
        }
        const _0xc52273 = String(_0x2aba0b["dataset"]["value"] || '')["trim"]();
        if (!_0xc52273) {
          return;
        }
        const _0x305c9f = this["_getCurrentWorkflow"]()['key'];
        this['_setSelectedWorkflow'](_0xc52273);
        this["_getCurrentWorkflow"]()["key"] !== _0x305c9f && this["_closeModelMenu"]();
      });
    };
    _0x98249e?.["querySelectorAll"]('.floating-menu-item')['forEach'](_0x396ddd);
    _0x3e9d2b?.["querySelectorAll"](".node-menu-submenu .floating-menu-item")['forEach'](_0x396ddd);
    _0xdfddbd?.['addEventListener']('click', _0x56bb3e => {
      _0x56bb3e["stopPropagation"]();
    });
    this['btnEl']?.['addEventListener']("click", () => {
      flushPromptHtmlCommit(this);
      this["_handleGenerateOrCancel"]();
    });
  }
  ['mount']() {
    this['_clearToolbarActionBindings']();
    const _0x4fad1f = document["createElement"]("div");
    _0x4fad1f["classList"]["add"]("aigen-node-root", 'aigen-audio-root');
    this["_root"] = _0x4fad1f;
    _0x4fad1f['innerHTML'] = AUDIO_TOOLBAR_HTML;
    this["previewEl"] = document["createElement"]('div');
    this['previewEl']["className"] = "node-card media-card audio-card aigen-audio-preview";
    this["_audioCard"] = this['previewEl'];
    const _0x5759d6 = document["createElement"]("div");
    _0x5759d6['className'] = 'audio-main-surface';
    this['_audioMainSurface'] = _0x5759d6;
    this["previewEl"]["appendChild"](_0x5759d6);
    const _0x62199f = document["createElement"]("div");
    _0x62199f["className"] = "waveform waveform-bg";
    _0x62199f["innerHTML"] = "<svg width=\"100%\" height=\"80\" viewBox=\"0 0 200 80\" preserveAspectRatio=\"none\">\n      <path d=\"" + WAVE_PATH + "\" stroke=\"var(--blue)\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n      <path d=\"M0,40 L200,40\" stroke=\"var(--blue)\" stroke-width=\"1\" stroke-dasharray=\"2 4\" opacity=\"0.4\"/>\n    </svg>";
    _0x5759d6["appendChild"](_0x62199f);
    this["_waveBgEl"] = _0x62199f;
    const _0x5486f9 = document['createElement']("div");
    _0x5486f9['className'] = "waveform waveform-unplayed";
    _0x5486f9['innerHTML'] = '<svg\x20width=\x22100%\x22\x20height=\x2280\x22\x20viewBox=\x220\x200\x20200\x2080\x22\x20preserveAspectRatio=\x22none\x22>\x0a\x20\x20\x20\x20\x20\x20<path\x20d=\x22' + WAVE_PATH + '\x22\x20stroke=\x22var(--blue)\x22\x20stroke-width=\x222\x22\x20stroke-linecap=\x22round\x22/>\x0a\x20\x20\x20\x20\x20\x20<path\x20d=\x22M0,40\x20L200,40\x22\x20stroke=\x22var(--blue)\x22\x20stroke-width=\x221\x22\x20stroke-dasharray=\x222\x204\x22\x20opacity=\x220.4\x22/>\x0a\x20\x20\x20\x20</svg>';
    _0x5759d6["appendChild"](_0x5486f9);
    this["_wavePlayed"] = _0x5486f9;
    const _0x5e6924 = this['previewEl']["querySelectorAll"](".waveform-bg svg path");
    const _0x341687 = this["previewEl"]['querySelectorAll'](".waveform-unplayed svg path");
    this['_waveBgPath'] = _0x5e6924 && _0x5e6924["length"] ? _0x5e6924[0x0] : null;
    this["_waveFgPath"] = _0x341687 && _0x341687['length'] ? _0x341687[0x0] : null;
    const _0x26411a = document["createElement"]("div");
    _0x26411a["className"] = "media-progress-line";
    _0x5759d6['appendChild'](_0x26411a);
    this["_progressLine"] = _0x26411a;
    const _0x313163 = document["createElement"]('div');
    _0x313163["className"] = "media-progress-bar";
    _0x5759d6["appendChild"](_0x313163);
    this["_bar"] = _0x313163;
    const _0x28abae = document['createElement']("div");
    _0x28abae["className"] = "audio-controls";
    _0x28abae["innerHTML"] = "\n      <button type=\"button\" class=\"audio-play-btn\">\n        <svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg>\n      </button>\n      <div class=\"audio-time-wrap\">\n        <span class=\"audio-time-display\">0:00 / 0:00</span>\n      </div>";
    _0x5759d6["appendChild"](_0x28abae);
    this["_controlsEl"] = _0x28abae;
    this["_playBtn"] = _0x28abae["querySelector"](".audio-play-btn");
    this["_timeEl"] = _0x28abae["querySelector"](".audio-time-display");
    this['audioEl'] = document["createElement"]("audio");
    this["audioEl"]["className"] = "audio-player";
    this['audioEl']["controls"] = ![];
    this['audioEl']["draggable"] = ![];
    this["audioEl"]["preload"] = 'none';
    this['_progressController'] = createAudioPlaybackProgressController({
      'audioEl': this["audioEl"],
      'wavePlayedEl': this["_wavePlayed"],
      'progressLineEl': this["_progressLine"],
      'timeEl': this["_timeEl"],
      'trackEl': this["_bar"],
      'formatTime': _0x2b5cc7 => this["_fmtTime"](_0x2b5cc7),
      'shouldSuppressSync': () => this['_isSeeking']
    })['attach']();
    const _0x43aa81 = document["createElement"]('div');
    _0x43aa81["className"] = "img-node-placeholder";
    Object["assign"](_0x43aa81["style"], {
      'display': "flex",
      'flexDirection': "column",
      'alignItems': "center",
      'justifyContent': 'center',
      'gap': "8px",
      'color': 'var(--text-muted)',
      'pointerEvents': "none",
      'userSelect': "none"
    });
    _0x43aa81["innerHTML"] = "\n            " + buildAudioPlaceholderSvg();
    this["_placeholderEl"] = _0x43aa81;
    _0x5759d6["appendChild"](this["audioEl"]);
    _0x5759d6["appendChild"](_0x43aa81);
    syncPreviewNodeLoading(this["nodeId"], this["previewEl"], this["_getPreviewGenerateButtonLoadingOptions"]());
    let _0x342c34 = {
      'x': 0x0,
      'y': 0x0
    };
    this["previewEl"]['addEventListener']('pointerdown', _0x2d1880 => {
      if (_0x2d1880["target"]["closest"](".media-progress-bar")) {
        return;
      }
      _0x342c34 = {
        'x': _0x2d1880["clientX"],
        'y': _0x2d1880["clientY"]
      };
    });
    this["previewEl"]["addEventListener"]('pointerup', _0x5bf17c => {
      if (_0x5bf17c["target"]["closest"](".media-progress-bar") || _0x5bf17c["target"]["closest"](".audio-play-btn") || _0x5bf17c['target']['closest'](".audio-controls") || _0x5bf17c['target']["closest"](".audio-multi-toggle-btn") || _0x5bf17c["target"]['closest']('.multi-stack-backplate')) {
        return;
      }
      const _0x46f01a = Math["hypot"](_0x5bf17c["clientX"] - _0x342c34['x'], _0x5bf17c["clientY"] - _0x342c34['y']);
      if (_0x46f01a >= 0x5) {
        return;
      }
      if (!this['audioEl'] || !this["audioEl"]["duration"]) {
        return;
      }
      const _0xca8e0f = this["previewEl"]['getBoundingClientRect']();
      const _0x381721 = Math["max"](0x0, Math["min"](0x1, (_0x5bf17c['clientX'] - _0xca8e0f["left"]) / _0xca8e0f['width']));
      const _0x172cfe = _0x381721 * this["audioEl"]["duration"];
      this["audioEl"]["currentTime"] = _0x172cfe;
      this["_progressController"]?.['sync']({
        'currentTime': _0x172cfe,
        'duration': this["audioEl"]["duration"],
        'force': !![],
        'showLine': !![]
      });
    });
    this["_bar"]?.["addEventListener"]("click", _0x206b1d => {
      this['_seekTo'](_0x206b1d["clientX"]);
    });
    this["_playBtn"]?.["addEventListener"]('pointerdown', _0x454a55 => {
      _0x454a55["stopPropagation"]();
      if (!this['_currentSrc']) {
        return;
      }
      if (this["audioEl"]['paused']) {
        this['_playAudio']();
      } else {
        this['audioEl']["pause"]();
      }
    });
    this["audioEl"]["addEventListener"]('play', () => this["_setPlayIcon"](![]));
    this["audioEl"]["addEventListener"]("pause", () => {
      this["_setPlaybackBuffering"](![]);
      this['_setPlayIcon'](!![]);
    });
    this["audioEl"]["addEventListener"]('waiting', () => {
      if (this["audioEl"]?.["paused"] === ![]) {
        this["_setPlaybackBuffering"](!![]);
      }
    });
    this["audioEl"]['addEventListener']('playing', () => {
      this["_setPlaybackBuffering"](![]);
    });
    this["audioEl"]['addEventListener']("ended", () => {
      this['_setPlaybackBuffering'](![]);
    });
    this['_unregisterAudioPlaybackClient']?.();
    this["_unregisterAudioPlaybackClient"] = registerAudioPlaybackClient(this["nodeId"], {
      'stopForExternalPlayback': () => this['_stopAudioForExternalPlayback']()
    });
    this['_releaseRendererPlaybackPin']?.();
    this["_releaseRendererPlaybackPin"] = bindRendererMediaPlaybackPin(this["audioEl"], this["nodeId"]);
    const _0x30cb83 = this["_resolveNodeAudioUrl"](this["_data"]);
    _0x30cb83 ? this["_rendererMediaDeferred"] ? this["_prepareDeferredAudio"](_0x30cb83) : (this['_prepareAudio'](_0x30cb83), this["_applyResultWideLayout"](this["_data"], ![]), this["_setAudioPreviewResultState"](!![]), this["_syncAudioMultiResultStack"](this["_data"])) : (this["_setAudioPreviewResultState"](![]), this["_syncStatusOverlay"](this['_data'], ![]), this["_syncAudioMultiResultStack"](this["_data"]));
    _0x4fad1f["appendChild"](this["previewEl"]);
    const _0x5ae325 = document["createElement"]("div");
    _0x5ae325["className"] = 'text-prompt-panel';
    this["_promptPanel"] = _0x5ae325;
    this["_syncModelProviderProfileControl"]();
    _0x5ae325["addEventListener"]('pointerdown', _0x3810cf => {
      _0x3810cf["stopPropagation"]();
    });
    _0x5ae325["addEventListener"]('dblclick', _0x54c080 => {
      !_0x54c080['target']["closest"](".prompt-textarea") && (_0x54c080["preventDefault"](), _0x54c080["stopPropagation"]());
    });
    this['refBarEl'] = document["createElement"]("div");
    this["refBarEl"]["className"] = "node-ref-bar";
    _0x5ae325['appendChild'](this["refBarEl"]);
    this['refBarEl']["addEventListener"]("click", _0x16057a => {
      if (handleRefThumbDeleteClick(this, _0x16057a)) {
        return;
      }
      const _0x20b722 = _0x16057a["target"]["closest"](".rh-v5-ref-box[data-slot]");
      if (_0x20b722) {
        _0x16057a['stopPropagation']();
        _0x16057a["preventDefault"]();
        const _0x2a3ba7 = String(_0x20b722['dataset']['slot'] || '')["trim"]();
        if (!_0x2a3ba7 || !this["_audioRefUploadInput"] || this["_audioRefUploadPending"]) {
          return;
        }
        this["_audioRefUploadSlot"] = _0x2a3ba7;
        this["_audioRefUploadAnchorNodeId"] = this["nodeId"];
        this["_audioRefUploadInput"]['accept'] = getAudioWorkflowSlots(this["_getCurrentWorkflow"]()["key"], {
          'includeImages': !![]
        })["find"](_0x43550a => _0x43550a['slot'] === _0x2a3ba7)?.["kind"] === "image" ? 'image/png,image/jpeg,image/webp' : "audio/*";
        this["_audioRefUploadInput"]["click"]();
        return;
      }
      const _0x88588f = _0x16057a["target"]['closest']('.prompt-attachment-btn');
      if (!_0x88588f || _0x16057a["_pickConnectHandled"]) {
        return;
      }
      _0x16057a['stopPropagation']();
      _0x16057a["preventDefault"]();
      const _0x283884 = a311_0xe0f4bd["getState"]()["pickConnectMode"];
      _0x283884 && _0x283884["active"] && _0x283884["sourceNodeId"] === this["nodeId"] ? a311_0xe0f4bd["setPickConnectMode"]({
        'active': ![]
      }) : a311_0xe0f4bd["setPickConnectMode"]({
        'active': !![],
        'sourceNodeId': this["nodeId"],
        'handleDirection': 'left',
        'preferredRefSlot': undefined
      });
      this['_syncPickConnectVisualState']();
    });
    this["refBarEl"]["addEventListener"]("pointerdown", _0x25b1c6 => {
      if (_0x25b1c6["target"]['closest'](".prompt-attachment-btn, .ref-thumb-delete, .ref-upload-slot, .rh-v5-ref-box")) {
        _0x25b1c6["stopPropagation"]();
      }
    });
    this['_unbindRefThumbHoverPreview'] = bindRefThumbHoverPreview(this["refBarEl"]);
    this["_audioRefUploadInput"] = document["createElement"]("input");
    this['_audioRefUploadInput']['type'] = 'file';
    this["_audioRefUploadInput"]['accept'] = "audio/*";
    this["_audioRefUploadInput"]["style"]["display"] = "none";
    _0x5ae325['appendChild'](this["_audioRefUploadInput"]);
    this["_audioRefUploadInput"]["addEventListener"]("change", async _0x583a89 => {
      const _0x4b4867 = _0x583a89["target"]['files']?.[0x0];
      const _0x23ab25 = String(this['_audioRefUploadSlot'] || '')["trim"]();
      const _0x1052d3 = String(this["_audioRefUploadAnchorNodeId"] || '')["trim"]();
      if (!_0x4b4867 || !_0x23ab25 || !_0x1052d3) {
        this['_audioRefUploadInput']["value"] = '';
        return;
      }
      if (this["_audioRefUploadPending"]) {
        return;
      }
      const _0x5105c5 = this["_getCurrentWorkflow"]()["key"];
      const _0xdd9372 = this["_root"];
      const _0x430119 = this['refBarEl'];
      this['_audioRefUploadPending'] = !![];
      _0x430119?.['setAttribute']("aria-busy", "true");
      startLoading(_0x430119);
      this["_updateSubmitButtonState"]();
      try {
        const _0x5c5b42 = getAudioWorkflowSlots(this["_getCurrentWorkflow"]()["key"], {
          'includeImages': !![]
        })["find"](_0x37f6b7 => _0x37f6b7["slot"] === _0x23ab25)?.['kind'] || "audio";
        if (!String(_0x4b4867["type"] || '')["startsWith"](_0x5c5b42 + '/')) {
          throw new Error(_0x5c5b42 === "image" ? "请选择图片文件" : aigenAudioText("upload.audioOnly"));
        }
        const _0x4a05e6 = window['currentProjectId'] || "default_v2_project";
        const _0x413764 = await uploadFile(_0x4b4867, _0x4a05e6);
        if (this["_root"] !== _0xdd9372 || !_0xdd9372?.["isConnected"] || this["_getCurrentWorkflow"]()['key'] !== _0x5105c5) {
          return;
        }
        const _0x1dc007 = String(_0x413764?.["url"] || '')["trim"]();
        if (!_0x1dc007) {
          throw new Error(aigenAudioText("upload.missingUrl"));
        }
        const _0x4086a4 = a311_0xe0f4bd['getState']();
        const _0xd613eb = _0x4086a4["nodes"]?.[_0x1052d3];
        if (!_0xd613eb) {
          throw new Error(aigenAudioText("upload.anchorMissing"));
        }
        const _0x1e2372 = pickResultLocalPath(_0x413764) || normalizeLocalPath(_0x1dc007);
        const _0x57ae2e = 0x140;
        const _0x2686c8 = _0x5c5b42 === "image" ? 0xf0 : 0x8c;
        const {
          spacing: _0xfe4bb7,
          direction: _0x3ca1fb,
          avoidOverlap: _0xe1895c
        } = getNodeSpawnPrefs();
        const _0x3310bb = _0x3ca1fb === "down" ? "down" : "left";
        const _0x1b9c9d = Number(_0xd613eb['x']) || 0x0;
        const _0x9aa0d9 = Number(_0xd613eb['y']) || 0x0;
        const _0x47bda2 = Number(_0xd613eb['width']) || 0x168;
        const _0x501f3b = Number(_0xd613eb['height']) || 0x168;
        const _0x4dc505 = _0x9aa0d9 + Math["round"]((_0x501f3b - _0x2686c8) / 0x2);
        let _0x4c8da0 = _0x4dc505;
        if (_0x23ab25 === "audioRef" && this["_getCurrentWorkflow"]()["key"] === "voice_convert") {
          _0x4c8da0 = _0x4dc505 - Math["round"](_0x2686c8 / 0x2) - 0x8;
        } else {
          _0x23ab25 === "audioTarget" && this['_getCurrentWorkflow']()["key"] === "voice_convert" && (_0x4c8da0 = _0x4dc505 + Math["round"](_0x2686c8 / 0x2) + 0x8);
        }
        const _0x4eb813 = _0x1b9c9d - _0xfe4bb7 - _0x57ae2e;
        const _0x39fe27 = _0xe1895c ? findAvailablePosition(_0x4086a4["nodes"] || {}, _0x4eb813, _0x3310bb === "down" ? _0x9aa0d9 + _0x501f3b + _0xfe4bb7 : _0x4c8da0, _0x57ae2e, _0x2686c8, _0xfe4bb7, _0x3310bb) : {
          'x': _0x4eb813,
          'y': _0x3310bb === 'down' ? _0x9aa0d9 + _0x501f3b + _0xfe4bb7 : _0x4c8da0
        };
        a311_0xe0f4bd["batch"](() => {
          const _0x186a94 = a311_0xe0f4bd["getIncomingEdges"](this['nodeId']);
          for (const _0x1e6975 of _0x186a94) {
            if (String(_0x1e6975?.["refSlot"] || '') === _0x23ab25) {
              a311_0xe0f4bd['removeEdge'](_0x1e6975['id']);
            }
          }
          removeCoveredAssetInputRefForConnection({
            'targetId': this["nodeId"],
            'sourceKind': _0x5c5b42,
            'refSlot': _0x23ab25
          });
          const _0x1e54fc = generateId("node");
          a311_0xe0f4bd["addNode"]({
            'id': _0x1e54fc,
            'type': "source-" + _0x5c5b42,
            'x': _0x39fe27['x'],
            'y': _0x39fe27['y'],
            'width': _0x57ae2e,
            'height': _0x2686c8,
            'src': _0x1dc007,
            'localPath': _0x1e2372,
            'assetId': _0x413764["assetId"] || '',
            'originalLocalPath': _0x413764['originalLocalPath'] || _0x413764['localPath'] || '',
            'waveformLocalPath': _0x413764["waveformLocalPath"] || '',
            'derivativeStatus': _0x413764["derivativeStatus"] || _0x413764["status"] || '',
            'mediaTaskId': _0x413764["mediaTaskId"] || '',
            'mediaTaskKind': _0x413764['mediaTaskKind'] || '',
            'mediaTaskStatus': _0x413764['mediaTaskStatus'] || '',
            'mediaTaskProgress': Number(_0x413764["mediaTaskProgress"] || 0x0) || 0x0,
            'mediaTaskError': _0x413764["mediaTaskError"] || '',
            'fileName': _0x413764["filename"] || _0x4b4867['name'] || '',
            'fileSize': _0x4b4867["size"],
            'name': _0x4b4867["name"] || aigenAudioText("upload.sourceAudioName"),
            ...(_0x5c5b42 === "image" ? buildCanvasLocalImageFields(_0x413764, {
              'includeSrc': !![]
            }) : {})
          });
          a311_0xe0f4bd['addEdge']({
            'id': generateId("edge"),
            'sourceId': _0x1e54fc,
            'targetId': this["nodeId"],
            'refSlot': _0x23ab25,
            'createdAt': Date["now"]()
          });
          a311_0xe0f4bd['setSelectedNodes']([this["nodeId"]]);
        });
        this["_updateSubmitButtonState"]();
      } catch (_0x44baa8) {
        window["showToast"]?.(_0x44baa8?.["message"] || aigenAudioText("upload.failedRetry"), "error");
      } finally {
        this["_audioRefUploadPending"] = ![];
        _0x430119?.['removeAttribute']("aria-busy");
        stopLoading(_0x430119);
        this["_audioRefUploadInput"]['value'] = '';
        this['_audioRefUploadSlot'] = '';
        this['_audioRefUploadAnchorNodeId'] = '';
        this["_updateSubmitButtonState"]();
      }
    });
    const _0x3cbab1 = document["createElement"]("div");
    _0x3cbab1["className"] = 'prompt-input-wrapper';
    this["_promptInputWrap"] = _0x3cbab1;
    this["promptEl"] = document["createElement"]("div");
    this["promptEl"]["className"] = "prompt-textarea custom-textarea";
    this["promptEl"]["contentEditable"] = "true";
    this['promptEl']["spellcheck"] = ![];
    syncAudioPromptPlaceholder(this["promptEl"], this["_getCurrentWorkflow"]()["key"]);
    this["_flushPromptHtmlCommit"] = () => flushPromptHtmlCommit(this);
    this["promptEl"]['addEventListener']("input", _0x20982a => {
      schedulePromptHtmlCommit(this);
      checkSlashTrigger(_0x20982a, {
        'promptEl': this["promptEl"],
        'nodeType': this["_data"]["type"],
        'nodeId': this['nodeId'],
        'onGenerate': (_0x20aa32, _0x461098) => this['_onGenerate'](_0x20aa32, _0x461098)
      });
      _checkAtTrigger(this, _0x20982a);
      if (shouldSkipPromptTriggerForBulkInput(_0x20982a)) {
        return;
      }
      _syncEdgesOrderFromPills(this);
      this["_updateSubmitButtonState"]();
    });
    this["promptEl"]["addEventListener"]("blur", () => {
      flushPromptHtmlCommit(this);
    });
    this["promptEl"]["addEventListener"]("mouseover", _0x53b1a6 => _handlePillHover(_0x53b1a6, this));
    this['promptEl']['addEventListener']("mouseout", _0x33ff33 => _handlePillOut(_0x33ff33, this));
    this['promptEl']['addEventListener']("keydown", _0x5b6a28 => {
      if (handlePromptSelectAll(this, _0x5b6a28)) {
        return;
      }
      if (_handleMentionMenuKeyboard(_0x5b6a28)) {
        return;
      }
      if (handleSlashKeyboardNavigation(_0x5b6a28)) {
        return;
      }
      if (shouldSubmitPromptByKeyboard(_0x5b6a28)) {
        _0x5b6a28['preventDefault']();
        flushPromptHtmlCommit(this);
        this["btnEl"]?.["click"]();
        return;
      }
      _handlePillKeyboard(this, _0x5b6a28);
    });
    this["promptEl"]["addEventListener"]("paste", _0x3ee77a => {
      handlePromptPaste(this, _0x3ee77a);
    });
    !this['_rendererDetailsDeferred'] && this["_data"]['prompt'] && (this['promptEl']['innerHTML'] = sanitizePromptHtml(this["_data"]["prompt"]), _rehydratePromptPills(this));
    _0x3cbab1['appendChild'](this["promptEl"]);
    _0x5ae325["appendChild"](_0x3cbab1);
    this["_promptPresetTrigger"] = createPromptPresetTriggerController({
      'panel': _0x5ae325,
      'getPromptEl': () => this["promptEl"],
      'getNodeType': () => this['_data']?.["type"],
      'getNodeId': () => this["nodeId"],
      'onGenerate': (_0x35c038, _0x15bd97) => this['_onGenerate'](_0x35c038, _0x15bd97)
    });
    !this["_rendererDetailsDeferred"] && (this['_syncPromptBoxSizeFromData'](this["_data"]), this["_setupPromptBoxResize"](), this["_syncWorkflowDefaults"](), this["_syncPromptInputVisibility"](), this["_syncAudioPromptHelpTip"]());
    const _0x440ac6 = document["createElement"]("div");
    _0x440ac6["className"] = "prompt-panel-footer";
    this["_renderInitialFooter"](_0x440ac6);
    this["_docClickHandler"] = null;
    _0x5ae325['appendChild'](_0x440ac6);
    _0x4fad1f["appendChild"](_0x5ae325);
    attachNodePromptExpansion(this, {
      'panel': _0x5ae325
    });
    const _0x2d9ae1 = _0x4fad1f['querySelector'](".node-floating-toolbar");
    if (_0x2d9ae1) {
      _0x2d9ae1["addEventListener"]("pointerdown", _0x5db3c6 => _0x5db3c6['stopPropagation']());
      const _0x1fbb6a = _0x2d9ae1["querySelector"]('.act-clip,\x20.clip-btn');
      const _0x243185 = _0x2d9ae1["querySelector"](".act-separate, .separate-btn");
      const _0x1d6d99 = _0x2d9ae1['querySelector'](".act-voice-studio");
      const _0x5e5720 = _0x2d9ae1["querySelector"]('.act-speed,\x20.speed-btn');
      const _0x5ec68c = _0x2d9ae1["querySelector"]('.act-upload');
      const _0x55066c = _0x2d9ae1['querySelector']('.act-download,\x20.download-btn');
      const _0x481b74 = [0x1, 1.25, 1.5, 0x2];
      _0x1fbb6a?.['addEventListener']("pointerdown", _0x39dead => {
        _0x39dead["stopPropagation"]();
        a311_0x446dc7["init"](this["nodeId"]);
      });
      this["_toolbarActionCleanups"]["push"](bindRunningHubToolbarTaskButton({
        'button': _0x243185,
        'getTask': () => getRunningAudioSeparationTaskForNode(this["nodeId"]),
        'cancelTask': () => cancelAudioSeparationTaskForNode(this["nodeId"], {
          'notify': !![]
        }),
        'cancelTooltip': aigenAudioText('toolbar.cancelAudioSeparation'),
        'eventTypes': ['pointerdown', "click"]
      }));
      _0x243185?.["addEventListener"]("pointerdown", _0x325719 => {
        if (getRunningAudioSeparationTaskForNode(this["nodeId"])) {
          _0x325719["preventDefault"]();
          _0x325719["stopPropagation"]();
          void cancelAudioSeparationTaskForNode(this["nodeId"], {
            'notify': !![]
          });
          return;
        }
        _0x325719["stopPropagation"]();
        void runAudioSeparationFromNode(this["nodeId"]);
      });
      _0x5e5720?.["addEventListener"]("pointerdown", _0x159740 => {
        _0x159740["stopPropagation"]();
        this["_speedIdx"] = (this["_speedIdx"] + 0x1) % _0x481b74["length"];
        const _0x2810ca = _0x481b74[this["_speedIdx"]];
        if (this["audioEl"]) {
          this["audioEl"]["playbackRate"] = _0x2810ca;
        }
        _0x5e5720["textContent"] = _0x2810ca['toFixed'](0x1) + 'x';
      });
      this["_toolbarActionCleanups"]["push"](bindPreviewUploadToolbarAction({
        'button': _0x5ec68c
      }), bindAudioDownloadAction({
        'button': _0x55066c,
        'getNodeData': () => a311_0xe0f4bd["getState"]()["nodes"]?.[this["nodeId"]] || this['_data'] || {},
        'getAudioElement': () => this["audioEl"],
        'notifyMissing': () => window['showToast']?.(aigenAudioText("download.missingAudio"), 'warn')
      }), bindAudioVoiceStudioAction({
        'button': _0x1d6d99,
        'getNodeId': () => this["nodeId"]
      }));
    }
    if (!this["_rendererDetailsDeferred"]) {
      this["_renderRefBar"]();
    }
    this["_assetMentionRegistryUnsubscribe"]?.();
    this["_assetMentionRegistryUnsubscribe"] = subscribeAssetMentionRegistry(() => {
      if (this["_assetMentionRegistryRefreshPending"]) {
        return;
      }
      this['_assetMentionRegistryRefreshPending'] = !![];
      queueMicrotask(() => {
        this["_assetMentionRegistryRefreshPending"] = ![];
        if (!a311_0xe0f4bd["getState"]()["nodes"]?.[this['nodeId']]) {
          return;
        }
        if (this["_rendererDetailsDeferred"]) {
          return;
        }
        _rehydratePromptPills(this);
        this['_renderRefBar']();
        this['_updateSubmitButtonState']();
      });
    });
    this["_syncPickConnectVisualState"]();
    if (!this['_rendererDetailsDeferred']) {
      this["_syncLocaleTexts"]();
    }
    this['_unsubscribeLocale'] = onLocaleChange(() => {
      this["_syncLocaleTexts"]({
        'rerenderRefs': !![]
      });
    });
    queueMicrotask(() => {
      a311_0xe0f4bd["getState"]()['nodes']?.[this['nodeId']] && this['_maybeResumeRunningHubTask']();
    });
    return _0x4fad1f;
  }
  ["hydrateDeferredDetails"]() {
    if (this['_rendererDetailsDeferred'] !== !![]) {
      return ![];
    }
    this["_rendererDetailsDeferred"] = ![];
    this["_data"] = a311_0xe0f4bd['getState']?.()?.["nodes"]?.[this["nodeId"]] || this["_data"];
    this['_syncWorkflowDefaults']();
    this["_data"] = a311_0xe0f4bd['getState']?.()?.['nodes']?.[this["nodeId"]] || this["_data"];
    if (this["promptEl"] && document["activeElement"] !== this["promptEl"] && this["_data"]?.["prompt"] !== undefined) {
      if (!isVirtualizedPromptEditorCurrent(this, this["_data"]["prompt"])) {
        const _0x56278d = sanitizePromptHtml(this["_data"]['prompt'] || '');
        this['promptEl']['innerHTML'] !== _0x56278d && (clearVirtualizedPromptCommit(this), this["promptEl"]["innerHTML"] = _0x56278d, _rehydratePromptPills(this));
      }
    }
    this["_syncPromptBoxSizeFromData"](this['_data']);
    this["_setupPromptBoxResize"]();
    this['_syncPromptInputVisibility']();
    this["_syncAudioPromptHelpTip"]();
    this['_syncModelProviderProfileControl']();
    this["_renderFooter"](this["footerEl"]);
    this["_renderRefBar"]();
    this["_syncPickConnectVisualState"]();
    this["_syncLocaleTexts"]();
    return !![];
  }
  ['_syncLocaleTexts'](_0x393db5 = {}) {
    if (this['_rendererDetailsDeferred']) {
      return;
    }
    this["promptEl"] && syncAudioPromptPlaceholder(this["promptEl"], this["_getCurrentWorkflow"]()["key"]);
    this["_root"]?.["querySelector"]?.(".debug-wrench-btn")?.["setAttribute"]?.('title', aigenAudioText("debug.buttonTitle"));
    _0x393db5["rerenderRefs"] === !![] && this['refBarEl'] && (this["_refBarWorkflowKey"] = '', this['_renderRefBar']());
    this['_updateSubmitButtonState']();
  }
  ['_updateSubmitButtonState']() {
    if (!this["btnEl"]) {
      return;
    }
    const _0x341cf7 = getStoreSnapshot()['nodes']?.[this['nodeId']] || this["_data"] || {};
    const _0x48427e = resolveGenerationButtonMode(_0x341cf7, {
      'cancellable': String(_0x341cf7?.['provider'] || "runninghubwf")["toLowerCase"]() === 'runninghubwf',
      'cancelInFlight': this["_rhCancelInFlight"] === !![]
    });
    if (_0x48427e['busy']) {
      String(_0x341cf7?.["provider"] || 'runninghubwf')["toLowerCase"]() === 'runninghubwf' ? setGenerateButtonCancellableUi(this['btnEl'], {
        'title': aigenAudioText("buttons.generateCancellable"),
        'tooltip': aigenAudioText("buttons.generateCancellable"),
        'ariaLabel': aigenAudioText("buttons.cancelAudioGeneration"),
        'color': "var(--red)",
        'busy': !![]
      }) : setGenerateButtonLoadingUi(this["btnEl"], {
        'title': aigenAudioText("buttons.generate"),
        'disabled': !![],
        'ariaLabel': aigenAudioText("buttons.generate")
      });
      this["btnEl"]["disabled"] = _0x48427e["disabled"];
      this['btnEl']['style']["cursor"] = _0x48427e['cursor'];
      return;
    }
    resetGenerateButtonIdleUi(this["btnEl"], aigenAudioText("buttons.generate"));
    resetModelCredentialButtonState(this['btnEl']);
    const {
      payload: _0x4cd062,
      validation: _0x44edf2
    } = this["_buildPayloadSnapshot"]();
    const _0x3c6023 = _0x44edf2['ok'] && !!_0x4cd062["audioWorkflowKey"] && !this["_audioRefUploadPending"];
    !_0x3c6023 ? (this["btnEl"]['disabled'] = !![], this["btnEl"]["style"]["cursor"] = "var(--unavailable-cursor)") : (this["btnEl"]["disabled"] = ![], this['btnEl']["style"]["cursor"] = '', applyModelCredentialButtonState(this["btnEl"], {
      'modelId': _0x4cd062['audioWorkflowKey'] || _0x341cf7?.["model"],
      'provider': _0x4cd062["provider"] || _0x341cf7?.["provider"],
      'providerProfileId': _0x4cd062["providerProfileId"] || _0x341cf7?.["providerProfileId"] || _0x341cf7?.['rhProviderProfileId'],
      'adapterType': _0x4cd062['adapterType']
    }));
  }
  ['_getAudioElementSource']() {
    return getMediaElementPlaybackSourceKey(this['audioEl']);
  }
  ['_getAudioElementCurrentSource']() {
    return getMediaElementCurrentSource(this["audioEl"]);
  }
  ['_isAudioElementReady']() {
    if (!this["audioEl"] || !this["_getAudioElementCurrentSource"]()) {
      return ![];
    }
    const _0x32596b = Number(this["audioEl"]["readyState"] || 0x0);
    return _0x32596b >= 0x2;
  }
  ["_readAudioDurationSec"]() {
    const _0x25daf8 = normalizeAudioDurationSec(this["audioEl"]?.["duration"]);
    const _0x6b681b = getStoreSnapshot()["nodes"]?.[this["nodeId"]];
    const _0x5834fe = pickAudioDurationSec(_0x6b681b?.["audioDuration"], !_0x6b681b ? this["_data"]?.["audioDuration"] : 0x0, !_0x6b681b ? this["_data"]?.['duration'] : 0x0);
    if (_0x5834fe > 0x0) {
      if (!(_0x25daf8 > 0x0)) {
        return _0x5834fe;
      }
      const _0x534a91 = Math["max"](0x1, _0x5834fe * 0.25);
      if (Math["abs"](_0x5834fe - _0x25daf8) > _0x534a91) {
        return _0x5834fe;
      }
    }
    return _0x25daf8;
  }
  ["_syncKnownAudioDurationUi"]({
    currentTime = 0x0,
    showLine = ![]
  } = {}) {
    const _0x115d79 = this["_readAudioDurationSec"]();
    if (!(_0x115d79 > 0x0)) {
      return ![];
    }
    const _0x42a830 = Number(currentTime);
    const _0x46d104 = Number["isFinite"](_0x42a830) ? Math["max"](0x0, Math["min"](_0x42a830, _0x115d79)) : 0x0;
    const _0x4c3fd4 = this["_progressController"]?.["sync"]({
      'currentTime': _0x46d104,
      'duration': _0x115d79,
      'force': !![],
      'showLine': showLine
    });
    if (!showLine) {
      this["_progressController"]?.["hideLine"]?.();
    }
    !_0x4c3fd4 && this["_timeEl"] && (this['_timeEl']["textContent"] = this["_fmtTime"](_0x46d104) + " / " + this["_fmtTime"](_0x115d79));
    return !![];
  }
  ["_applyResolvedAudioDuration"](_0x5c38de, _0x41b34a = this["_currentSrc"]) {
    if (_0x41b34a && this["_currentSrc"] !== _0x41b34a) {
      return ![];
    }
    const _0x5c80a6 = normalizeAudioDurationSec(_0x5c38de);
    if (!(_0x5c80a6 > 0x0)) {
      return ![];
    }
    const _0xdf3927 = getStoreSnapshot()["nodes"]?.[this["nodeId"]];
    const _0x424d69 = pickAudioDurationSec(_0xdf3927?.["audioDuration"], this['_data']?.["audioDuration"], this["_data"]?.["duration"]);
    if (_0x424d69 > 0x0) {
      if (Math["abs"](_0x424d69 - _0x5c80a6) <= 0.001) {
        return this['_syncKnownAudioDurationUi']({
          'currentTime': this["audioEl"]?.["currentTime"] || 0x0,
          'showLine': Number(this["audioEl"]?.["currentTime"] || 0x0) > 0x0
        });
      }
      const _0x16f1b5 = Math["max"](0x1, _0x424d69 * 0.25);
      if (Math['abs'](_0x424d69 - _0x5c80a6) > _0x16f1b5) {
        return ![];
      }
    }
    _0xdf3927 ? (a311_0xe0f4bd["updateNodeData"](this["nodeId"], {
      'audioDuration': _0x5c80a6
    }), this["_data"] = {
      ...(this['_data'] || {}),
      'audioDuration': _0x5c80a6
    }, this['_syncKnownAudioDurationUi']({
      'currentTime': this["audioEl"]?.["currentTime"] || 0x0,
      'showLine': Number(this["audioEl"]?.["currentTime"] || 0x0) > 0x0
    })) : (this["_data"] = {
      ...(this["_data"] || {}),
      'audioDuration': _0x5c80a6
    }, this["_syncKnownAudioDurationUi"]({
      'currentTime': this["audioEl"]?.["currentTime"] || 0x0,
      'showLine': Number(this["audioEl"]?.["currentTime"] || 0x0) > 0x0
    }));
    return !![];
  }
  ["_rememberAudioDuration"](_0x452dc1 = this["_currentSrc"]) {
    if (!this["audioEl"] || _0x452dc1 && this["_currentSrc"] !== _0x452dc1) {
      return;
    }
    const _0x2f5561 = this["_readAudioDurationSec"]();
    if (!(_0x2f5561 > 0x0)) {
      return;
    }
    this['_applyResolvedAudioDuration'](_0x2f5561, _0x452dc1);
  }
  ["_rewindEndedAudioIfNeeded"]() {
    if (!this["audioEl"]) {
      return;
    }
    const _0x419fc5 = this["_readAudioDurationSec"]();
    if (!(_0x419fc5 > 0x0)) {
      return;
    }
    const _0x33ad33 = Number(this["audioEl"]["currentTime"] || 0x0);
    const _0x3cf27a = Number["isFinite"](_0x33ad33) && _0x33ad33 >= _0x419fc5 - 0.05;
    if (this["audioEl"]["ended"] !== !![] && !_0x3cf27a) {
      return;
    }
    try {
      this["audioEl"]["currentTime"] = 0x0;
    } catch {}
    this["_progressController"]?.['sync']({
      'currentTime': 0x0,
      'duration': _0x419fc5,
      'force': !![],
      'showLine': !![]
    });
  }
  ["_clearPlaybackResume"]() {
    this["_playbackResumeSource"] = '';
    this["_playbackResumeTime"] = 0x0;
  }
  ["_restorePlaybackPosition"](_0x30a965) {
    if (!this["audioEl"] || Number(this['audioEl']["readyState"] || 0x0) < 0x1 || this["_currentSrc"] !== _0x30a965 || this["_playbackResumeSource"] !== _0x30a965) {
      return ![];
    }
    const _0x131514 = Number(this['_playbackResumeTime'] || 0x0);
    let _0x152e6d = Number['isFinite'](_0x131514) ? Math['max'](0x0, _0x131514) : 0x0;
    const _0x431ab2 = this["_readAudioDurationSec"]();
    if (_0x431ab2 > 0x0) {
      _0x152e6d = Math["min"](_0x152e6d, _0x431ab2);
      if (_0x152e6d >= _0x431ab2 - 0.05) {
        _0x152e6d = 0x0;
      }
    }
    try {
      this["audioEl"]['currentTime'] = _0x152e6d;
    } catch {
      return ![];
    }
    this["_clearPlaybackResume"]();
    _0x431ab2 > 0x0 && this["_progressController"]?.["sync"]({
      'currentTime': _0x152e6d,
      'duration': _0x431ab2,
      'force': !![],
      'showLine': _0x152e6d > 0x0
    });
    return !![];
  }
  ['_clearAudioElementSource']() {
    this['_setPlaybackBuffering'](![]);
    this["_audioPlayPending"] = ![];
    if (!this["audioEl"]) {
      return;
    }
    this["_audioPlayAttemptToken"] = Number(this["_audioPlayAttemptToken"] || 0x0) + 0x1;
    this["_audioPlayDeadlineTimer"] && (clearTimeout(this["_audioPlayDeadlineTimer"]), this["_audioPlayDeadlineTimer"] = null);
    this["_audioLoadToken"] = Number(this["_audioLoadToken"] || 0x0) + 0x1;
    this['_audioLoadInFlightSource'] = '';
    this["_audioLoadInFlightPreload"] = '';
    try {
      this["audioEl"]["pause"]?.();
    } catch {}
    this['audioEl']['removeAttribute']?.("src");
    clearDesktopMediaPlaybackSourceMetadata(this["audioEl"]);
    this["audioEl"]['preload'] = 'none';
    try {
      this["audioEl"]["load"]?.();
    } catch {}
  }
  ["_bindAudioLoadHandlers"](_0x17f839) {
    if (!this["audioEl"]) {
      return;
    }
    const _0x9903df = () => {
      this["_currentSrc"] === _0x17f839 && (this["_rememberAudioDuration"](_0x17f839), this['_restorePlaybackPosition'](_0x17f839));
    };
    const _0x5673cc = () => {
      this['_currentSrc'] === _0x17f839 && (this["_rememberAudioDuration"](_0x17f839), this["_setPlaybackBuffering"](![]));
    };
    this["audioEl"]["onloadedmetadata"] = _0x9903df;
    this["audioEl"]['ondurationchange'] = _0x9903df;
    this["audioEl"]["onloadeddata"] = _0x5673cc;
    this["audioEl"]["oncanplay"] = _0x5673cc;
    this["audioEl"]["onplaying"] = _0x5673cc;
    this["audioEl"]["onerror"] = () => {
      if (this["_currentSrc"] === _0x17f839) {
        this["_setPlaybackBuffering"](![]);
      }
    };
  }
  ['_prepareAudio'](_0x13a8c3) {
    const _0x53c5a5 = String(_0x13a8c3 || '')["trim"]();
    if (!_0x53c5a5) {
      typeof this["_cancelDeferredWaveform"] === "function" && (this["_cancelDeferredWaveform"](), this["_cancelDeferredWaveform"] = null);
      this["_cancelWaveformRequest"]();
      this["_clearAudioElementSource"]();
      this["_currentSrc"] = null;
      this["_clearPlaybackResume"]();
      this["_progressController"]?.["reset"]();
      this["_audioDurationProbeToken"] += 0x1;
      return ![];
    }
    const _0x1573bb = this["_currentSrc"] !== _0x53c5a5;
    this["_currentSrc"] = _0x53c5a5;
    this['_clearStatusOverlay']();
    _0x1573bb && (this['_progressController']?.["reset"](), this['_clearPlaybackResume']());
    const _0x385dac = !!this['_getAudioElementCurrentSource']();
    const _0x185c3b = _0x385dac && isMediaElementPlaybackSource(this['audioEl'], _0x53c5a5);
    this["_getAudioElementSource"]() && !_0x185c3b && this["_clearAudioElementSource"]();
    if (!_0x185c3b) {
      this['audioEl']["preload"] = "none";
    }
    this["_bindAudioLoadHandlers"](_0x53c5a5);
    this["_syncKnownAudioDurationUi"]({
      'currentTime': 0x0,
      'showLine': ![]
    });
    stopLoading(this["previewEl"]);
    void this["_ensureWaveform"](_0x53c5a5);
    if (this["_placeholderEl"]) {
      this["_placeholderEl"]['style']["display"] = 'none';
    }
    this['_setAudioPreviewResultState'](!![]);
    this["_syncStatusOverlay"](this['_data'], !![]);
    return !![];
  }
  ['_prepareDeferredAudio'](_0x1b8600) {
    const _0xcacaaa = String(_0x1b8600 || '')["trim"]();
    if (!_0xcacaaa) {
      return this["_prepareAudio"]('');
    }
    if (this['_currentSrc'] !== _0xcacaaa) {
      this["_clearPlaybackResume"]();
    }
    this["_currentSrc"] = _0xcacaaa;
    this["_audioDurationProbeToken"] += 0x1;
    typeof this['_cancelDeferredWaveform'] === "function" && (this["_cancelDeferredWaveform"](), this['_cancelDeferredWaveform'] = null);
    this['_cancelWaveformRequest']();
    this["_clearStatusOverlay"]();
    this["_progressController"]?.["reset"]?.();
    this["_syncKnownAudioDurationUi"]({
      'currentTime': 0x0,
      'showLine': ![]
    });
    if (this["_placeholderEl"]) {
      this['_placeholderEl']["style"]['display'] = "none";
    }
    this["_setAudioPreviewResultState"](!![]);
    this["_syncStatusOverlay"](this["_data"], !![]);
    if (this["_rendererWaveformVisible"] === !![]) {
      void this["_ensureWaveform"](_0xcacaaa);
    }
    return !![];
  }
  ['prepareRendererVisibleAudioSurface']() {
    return this["_rendererMediaDeferred"] === !![] && !!this["audioEl"] && !!this["_currentSrc"];
  }
  async ["hydrateDeferredMedia"]() {
    if (this['_rendererMediaDeferred']) {
      this['_rendererMediaDeferred'] = ![];
    }
    const _0x4003a4 = this["_resolveNodeAudioUrl"](this["_data"]);
    _0x4003a4 ? (this["_prepareAudio"](_0x4003a4), this["_applyResultWideLayout"](this["_data"], ![]), this["_syncAudioMultiResultStack"](this["_data"])) : (this["_setAudioPreviewResultState"](![]), this["_syncStatusOverlay"](this["_data"], ![]), this["_syncAudioMultiResultStack"](this["_data"]));
    return !!_0x4003a4 && !!this["audioEl"];
  }
  async ['_loadAudio'](_0x437155, {
    showLoading = !![],
    preload = "auto"
  } = {}) {
    const _0x1e1abe = String(_0x437155 || '')['trim']();
    if (!_0x1e1abe) {
      return this["_prepareAudio"]('');
    }
    const _0x4f5b29 = preload === 'metadata' ? 'metadata' : "auto";
    const _0x205893 = this["_currentSrc"] !== _0x1e1abe;
    this["_currentSrc"] = _0x1e1abe;
    this["_clearStatusOverlay"]();
    _0x205893 && (this['_progressController']?.["reset"](), this["_clearPlaybackResume"]());
    this["_bindAudioLoadHandlers"](_0x1e1abe);
    const _0x499b1d = Number(this["_audioLoadToken"] || 0x0) + 0x1;
    this["_audioLoadToken"] = _0x499b1d;
    this["_audioLoadInFlightSource"] = _0x1e1abe;
    this["_audioLoadInFlightPreload"] = _0x4f5b29;
    try {
      const _0x10181 = !!this["_getAudioElementCurrentSource"]();
      const _0x183da6 = !isMediaElementPlaybackSource(this["audioEl"], _0x1e1abe) || !_0x10181;
      const _0x4d9538 = Number(this["audioEl"]?.["networkState"] || 0x0);
      const _0x19d9d8 = Number(this["audioEl"]?.["readyState"] || 0x0);
      const _0x3bb6fe = !_0x183da6 && _0x19d9d8 === 0x0 && (_0x4d9538 === 0x0 || _0x4d9538 === 0x1 || _0x4d9538 === 0x3);
      if (!_0x183da6 && this["_isAudioElementReady"]()) {
        _0x4f5b29 === 'auto' && this["audioEl"]['preload'] !== 'auto' && (this["audioEl"]["preload"] = "auto");
        this["_setPlaybackBuffering"](![]);
        return !![];
      }
      showLoading && (_0x183da6 || _0x3bb6fe) && this["_setPlaybackBuffering"](!![]);
      if (!_0x183da6) {
        const _0x5f5cdd = _0x4f5b29 === "auto" || this["audioEl"]["preload"] === "auto" ? 'auto' : "metadata";
        this["audioEl"]["preload"] !== _0x5f5cdd && (this["audioEl"]["preload"] = _0x5f5cdd);
        if (_0x3bb6fe) {
          try {
            this["audioEl"]["load"]?.();
          } catch {}
        }
      } else {
        await attachMediaElementPlaybackSource(this['audioEl'], _0x1e1abe, {
          'preload': _0x4f5b29,
          'warmRanges': ![],
          'shouldAssign': () => this['_audioLoadToken'] === _0x499b1d && this['_currentSrc'] === _0x1e1abe && this['audioEl']?.["isConnected"] !== ![]
        });
      }
      if (this["_isAudioElementReady"]()) {
        this["_setPlaybackBuffering"](![]);
      }
      if (this["_placeholderEl"]) {
        this["_placeholderEl"]["style"]["display"] = 'none';
      }
      this['_setAudioPreviewResultState'](!![]);
      this["_syncStatusOverlay"](this["_data"], !![]);
      return !![];
    } finally {
      this['_audioLoadToken'] === _0x499b1d && (this['_audioLoadInFlightSource'] = '', this["_audioLoadInFlightPreload"] = '');
    }
  }
  async ["_playAudio"]() {
    if (!this["audioEl"] || !this["_currentSrc"] || this["_audioPlayPending"] === !![]) {
      return;
    }
    this["_audioPlayPending"] = !![];
    beginAudioPlayback(this['nodeId']);
    const _0x22d4df = this["_currentSrc"];
    const _0x39c2ad = Number(this['_audioPlayAttemptToken'] || 0x0) + 0x1;
    this["_audioPlayAttemptToken"] = _0x39c2ad;
    if (this['_audioPlayDeadlineTimer']) {
      clearTimeout(this['_audioPlayDeadlineTimer']);
    }
    const _0x194ec9 = () => {
      if (this["_audioPlayAttemptToken"] !== _0x39c2ad) {
        return;
      }
      this["_audioPlayPending"] = ![];
      this["_audioPlayDeadlineTimer"] && (clearTimeout(this["_audioPlayDeadlineTimer"]), this["_audioPlayDeadlineTimer"] = null);
    };
    this["_audioPlayDeadlineTimer"] = setTimeout(() => {
      if (this["_audioPlayAttemptToken"] !== _0x39c2ad || this["_currentSrc"] !== _0x22d4df) {
        return;
      }
      this["_audioPlayDeadlineTimer"] = null;
      this["_clearAudioElementSource"]();
      this["_setPlayIcon"](!![]);
    }, AUDIO_PLAY_LOADING_DEADLINE_MS);
    let _0x55770d = ![];
    try {
      _0x55770d = await this["_loadAudio"](_0x22d4df, {
        'showLoading': !![],
        'preload': "metadata"
      });
    } catch (_0x401cb3) {
      _0x194ec9();
      this["_setPlaybackBuffering"](![]);
      if (_0x401cb3?.["name"] !== "AbortError") {
        console["warn"]('[AIGenAudioNode]\x20load\x20failed:', _0x401cb3);
      }
      return;
    }
    if (!_0x55770d || !this["_getAudioElementCurrentSource"]()) {
      _0x194ec9();
      this["_setPlaybackBuffering"](![]);
      return;
    }
    this["_restorePlaybackPosition"](_0x22d4df);
    this["_rewindEndedAudioIfNeeded"]();
    let _0x33722b;
    try {
      _0x33722b = this["audioEl"]["play"]();
    } catch (_0x332e4d) {
      _0x194ec9();
      this["_setPlaybackBuffering"](![]);
      console['warn']("[AIGenAudioNode] play failed:", _0x332e4d);
      return;
    }
    _0x33722b && typeof _0x33722b['catch'] === "function" ? _0x33722b["then"](() => {
      _0x194ec9();
      this["_setPlaybackBuffering"](![]);
    })["catch"](_0x5b00bc => {
      _0x194ec9();
      this["_setPlaybackBuffering"](![]);
      if (_0x5b00bc?.['name'] === "AbortError") {
        return;
      }
      console["warn"]("[AIGenAudioNode] play failed:", _0x5b00bc);
    }) : (_0x194ec9(), this["_setPlaybackBuffering"](![]));
  }
  ["_stopAudioForExternalPlayback"]() {
    if (!this["audioEl"]) {
      return;
    }
    typeof this['_cancelDeferredWaveform'] === "function" && (this["_cancelDeferredWaveform"](), this["_cancelDeferredWaveform"] = null);
    const _0x5b37cb = !!this["_getAudioElementCurrentSource"]();
    const _0x3938c4 = !!this["_audioLoadInFlightSource"];
    if (_0x5b37cb && this["_currentSrc"]) {
      const _0x5a05ae = Number(this["audioEl"]["currentTime"] || 0x0);
      const _0x2a9c59 = Number["isFinite"](_0x5a05ae) ? Math["max"](0x0, _0x5a05ae) : 0x0;
      this["_playbackResumeSource"] = this["_currentSrc"];
      this["_playbackResumeTime"] = _0x2a9c59;
      this["_syncKnownAudioDurationUi"]({
        'currentTime': _0x2a9c59,
        'showLine': _0x2a9c59 > 0x0
      });
    }
    (_0x5b37cb || _0x3938c4) && (this['_clearAudioElementSource'](), _0x5b37cb && this["_syncKnownAudioDurationUi"]({
      'currentTime': this["_playbackResumeTime"],
      'showLine': this["_playbackResumeTime"] > 0x0
    }));
    this['_setPlaybackBuffering'](![]);
    this["_setPlayIcon"](!![]);
  }
  ["getRendererMediaState"]() {
    return {
      'deferred': this["_rendererMediaDeferred"] === !![],
      'interactionActive': this["_isSeeking"] === !![]
    };
  }
  ["suspendRendererMedia"]() {
    this['setRendererAudioSurfaceVisible'](![]);
    if (!this["audioEl"] || this['audioEl']["paused"] === ![]) {
      return ![];
    }
    this["_stopAudioForExternalPlayback"]();
    return !![];
  }
  ["_syncPromptBoxSizeFromData"](_0x17b6f9 = this["_data"]) {
    if (!this["promptEl"] || this["_isPromptBoxResizing"]) {
      return;
    }
    const _0x1d6987 = getPromptBoxHeightBounds(this["_promptPanel"]);
    const _0x4d58b6 = normalizePromptBoxHeight(_0x17b6f9?.["promptBoxHeight"], _0x1d6987);
    applyPromptBoxHeight(this['promptEl'], _0x4d58b6);
  }
  ['_setupPromptBoxResize']() {
    if (!this["_promptPanel"] || this["_promptResizeHandle"]) {
      return;
    }
    this["_promptResizeHandle"] = !![];
    const _0x193a90 = 0x14;
    const _0x28b3de = 0xa;
    const _0x2e1821 = () => getStoreSnapshot()['ui']?.['promptBoxResizeEnabled'] !== ![] && !this['_promptPanel']["classList"]['contains']('is-prompt-expanded');
    const _0x163847 = _0x18beae => !!_0x18beae?.["closest"](".floating-menu, .img-model-menu");
    const _0x41da7f = _0x32608b => {
      const _0x31e59b = this["_promptPanel"]["getBoundingClientRect"]();
      return _0x32608b >= _0x31e59b["bottom"] - _0x193a90 && _0x32608b <= _0x31e59b["bottom"] + _0x28b3de;
    };
    const _0x1f67b0 = _0x34ea42 => {
      if (!this["_promptPanel"]) {
        return;
      }
      if (!_0x2e1821()) {
        this["_promptPanel"]["classList"]['remove']("is-resize-hover");
        return;
      }
      if (this["_isPromptBoxResizing"]) {
        this["_promptPanel"]['classList']["add"]("is-resize-hover");
        return;
      }
      const _0x942914 = !_0x163847(_0x34ea42?.['target']) && _0x41da7f(_0x34ea42["clientY"]);
      this["_promptPanel"]["classList"]['toggle']('is-resize-hover', _0x942914);
    };
    this['_promptPanel']["addEventListener"]("pointermove", _0x1f67b0);
    this["_promptPanel"]["addEventListener"]('pointerleave', () => {
      !this['_isPromptBoxResizing'] && this["_promptPanel"]?.['classList']["remove"]("is-resize-hover");
    });
    const _0x2c4823 = _0x4b2863 => {
      if (!this["_promptInputWrap"] || !this["promptEl"]) {
        return;
      }
      if (!_0x2e1821()) {
        return;
      }
      if (_0x4b2863["button"] !== 0x0) {
        return;
      }
      if (!_0x41da7f(_0x4b2863['clientY'])) {
        return;
      }
      if (_0x4b2863["target"]?.["closest"](".prompt-submit") || _0x163847(_0x4b2863["target"])) {
        return;
      }
      _0x4b2863['stopPropagation']();
      _0x4b2863["preventDefault"]();
      const _0x1f6ebc = getPromptBoxHeightBounds(this["_promptPanel"]);
      const _0x1bb66d = _0x4b2863['clientY'];
      const _0x278802 = this["promptEl"]['getBoundingClientRect']()["height"];
      this["_isPromptBoxResizing"] = !![];
      this['_promptInputWrap']["classList"]["add"]('is-resizing');
      this["_promptPanel"]["classList"]["add"]("is-resize-hover");
      const _0x5657b3 = _0x492202 => {
        _0x492202['preventDefault']();
        const _0x4dde7f = normalizePromptBoxHeight(_0x278802 + (_0x492202["clientY"] - _0x1bb66d), _0x1f6ebc);
        applyPromptBoxHeight(this["promptEl"], _0x4dde7f);
      };
      const _0x300cf3 = _0x119860 => {
        _0x119860["preventDefault"]();
        window["removeEventListener"]("pointermove", _0x5657b3);
        window['removeEventListener']("pointerup", _0x300cf3);
        window["removeEventListener"]("pointercancel", _0x300cf3);
        const _0x2c0ad5 = normalizePromptBoxHeight(this["promptEl"]?.['getBoundingClientRect']()["height"], _0x1f6ebc);
        applyPromptBoxHeight(this["promptEl"], _0x2c0ad5);
        this["_promptInputWrap"]["classList"]["remove"]("is-resizing");
        this['_isPromptBoxResizing'] = ![];
        this["_promptPanel"]['classList']["remove"]('is-resize-hover');
        _0x1f67b0(_0x119860);
        a311_0xe0f4bd["updateNodeData"](this['nodeId'], {
          'promptBoxHeight': _0x2c0ad5
        });
      };
      window["addEventListener"]("pointermove", _0x5657b3);
      window["addEventListener"]("pointerup", _0x300cf3);
      window["addEventListener"]("pointercancel", _0x300cf3);
      this["_promptResizeCleanup"] = () => {
        this['_promptPanel']?.["removeEventListener"]("pointerdown", _0x2c4823);
        this["_promptPanel"]?.["removeEventListener"]("pointermove", _0x1f67b0);
        window["removeEventListener"]("pointermove", _0x5657b3);
        window["removeEventListener"]("pointerup", _0x300cf3);
        window['removeEventListener']("pointercancel", _0x300cf3);
      };
    };
    this["_promptPanel"]["addEventListener"]("pointerdown", _0x2c4823);
    this['_promptResizeCleanup'] = () => {
      this["_promptPanel"]?.["removeEventListener"]("pointerdown", _0x2c4823);
      this['_promptPanel']?.['removeEventListener']("pointermove", _0x1f67b0);
      this["_promptPanel"]?.['classList']["remove"]("is-resize-hover");
    };
  }
  ['update'](_0xf185b5) {
    this['_data'] = _0xf185b5;
    this['_syncPromptBoxSizeFromData'](_0xf185b5);
    this["_syncWorkflowDefaults"]();
    const _0x469432 = this["_getCurrentWorkflow"]()["key"];
    this["_enforceWorkflowAudioInputLimit"]();
    const _0x3bed1a = this["_resolveNodeAudioUrl"](_0xf185b5);
    if (this["_rendererMediaDeferred"] && _0x3bed1a) {
      _0x3bed1a !== this["_currentSrc"] ? this["_prepareDeferredAudio"](_0x3bed1a) : (this["_syncKnownAudioDurationUi"]({
        'currentTime': this["audioEl"]?.['currentTime'] || 0x0,
        'showLine': Number(this["audioEl"]?.["currentTime"] || 0x0) > 0x0
      }), this["_setAudioPreviewResultState"](!![]), this['_syncStatusOverlay'](_0xf185b5, !![]));
    } else {
      if (_0x3bed1a && _0x3bed1a !== this["_currentSrc"] && this['audioEl']) {
        this['_prepareAudio'](_0x3bed1a);
        this["_applyResultWideLayout"](_0xf185b5, ![]);
        this["_syncStatusOverlay"](_0xf185b5, !![]);
      } else {
        if (!_0x3bed1a && this['audioEl']) {
          typeof this["_cancelDeferredWaveform"] === "function" && (this["_cancelDeferredWaveform"](), this["_cancelDeferredWaveform"] = null);
          this["_cancelWaveformRequest"]();
          this["_clearAudioElementSource"]();
          this["_currentSrc"] = null;
          this["_clearPlaybackResume"]();
          this["_progressController"]?.["reset"]();
          this["_audioDurationProbeToken"] += 0x1;
          this["_setAudioPreviewResultState"](![]);
          this['_syncStatusOverlay'](_0xf185b5, ![]);
        } else {
          _0x3bed1a ? (this["_syncKnownAudioDurationUi"]({
            'currentTime': this["audioEl"]?.["currentTime"] || 0x0,
            'showLine': Number(this["audioEl"]?.["currentTime"] || 0x0) > 0x0
          }), this["_applyResultWideLayout"](_0xf185b5, ![]), this["_setAudioPreviewResultState"](!![]), this["_syncStatusOverlay"](_0xf185b5, !![])) : this['_syncStatusOverlay'](_0xf185b5, ![]);
        }
      }
    }
    _0x3bed1a && String(_0xf185b5?.['waveformLocalPath'] || '')["trim"]() !== this["_waveformLocalPath"] && void this["_ensureWaveform"](_0x3bed1a);
    if (!this['_rendererMediaDeferred']) {
      this["_syncAudioMultiResultStack"](_0xf185b5);
    }
    shouldShowGenerationBusyUi(_0xf185b5) && (this["_isGenerating"] = !![], startLoading(this['previewEl']));
    if (this['_rendererDetailsDeferred'] === !![]) {
      this['_maybeResumeRunningHubTask']();
      return;
    }
    if (doesAudioWorkflowAcceptTextInput(_0x469432) && document["activeElement"] !== this["promptEl"] && _0xf185b5["prompt"] !== undefined) {
      if (!isVirtualizedPromptEditorCurrent(this, _0xf185b5["prompt"])) {
        const _0x1def43 = sanitizePromptHtml(_0xf185b5["prompt"] || '');
        this["promptEl"]?.['innerHTML'] !== _0x1def43 && (clearVirtualizedPromptCommit(this), this["promptEl"]["innerHTML"] = _0x1def43, _rehydratePromptPills(this));
      }
    }
    this["_refreshWorkflowUi"]();
    const _0x531447 = a311_0xe0f4bd["getIncomingEdges"](this['nodeId']);
    const _0x31b04e = [..._0x531447];
    const _0x31a395 = _0x31b04e["map"](_0x5340ae => [String(_0x5340ae?.['id'] || ''), String(_0x5340ae?.["sourceId"] || ''), String(_0x5340ae?.["refSlot"] || ''), String(_0x5340ae?.["sourceMediaKey"] || '')]['join'](':'))["join"]('|');
    const _0x4a79a3 = _0x31b04e['map'](_0x156e35 => {
      const _0x4e2042 = a311_0xe0f4bd["getState"]()["nodes"]?.[_0x156e35["sourceId"]] || {};
      const _0x23603a = Number(_0x4e2042["_bizRev"] || 0x0);
      const _0x5d517a = Number["isFinite"](Number(_0x4e2042["mainVideoIndex"])) ? Math["max"](0x0, Math['trunc'](Number(_0x4e2042["mainVideoIndex"]))) : 0x0;
      const _0x178788 = Array['isArray'](_0x4e2042["videos"]) ? _0x4e2042['videos'][_0x5d517a] || _0x4e2042["videos"][0x0] : null;
      const _0x348394 = [String(_0x4e2042["thumbId"] || ''), String(_0x4e2042["thumbUrl"] || ''), String(_0x178788?.["thumbId"] || ''), String(_0x178788?.["thumbUrl"] || ''), String(_0x178788?.["localPath"] || ''), String(_0x178788?.["videoUrl"] || ''), String(_0x4e2042['localPath'] || ''), String(_0x4e2042["src"] || ''), String(_0x4e2042["imageUrl"] || ''), String(_0x4e2042["videoUrl"] || ''), String(_0x4e2042["audioUrl"] || '')]["join"]('|');
      return _0x156e35['id'] + ':' + _0x156e35["sourceId"] + ':' + String(_0x156e35?.["refSlot"] || '') + ':' + String(_0x156e35?.['sourceMediaKey'] || '') + ':' + _0x23603a + ':' + _0x348394;
    })["join"]('||');
    (_0x31a395 !== this["_lastEdgeSig"] || _0x4a79a3 !== this["_lastRefMediaSig"] || _0x469432 !== this["_lastWorkflowKey"]) && (this["_lastEdgeSig"] = _0x31a395, this["_lastRefMediaSig"] = _0x4a79a3, this['_lastWorkflowKey'] = _0x469432, this["_renderRefBar"]());
    this["_syncPickConnectVisualState"]();
    this["_maybeResumeRunningHubTask"]();
    this["_updateSubmitButtonState"]();
  }
  async ["_buildPayload"](_0x2e68d2 = null) {
    this["_uiSchemaCleanup"]?.["flushPendingTextCommits"]?.();
    this["_enforceWorkflowAudioInputLimit"]();
    const {
      payload: _0x446925,
      validation: _0xe4993a
    } = this['_buildPayloadSnapshot'](_0x2e68d2);
    if (!_0xe4993a['ok']) {
      window["showToast"]?.(_0xe4993a["message"], "warn");
      return null;
    }
    if (!(await this['_validateAdvancedVoiceCloneDurations'](_0x446925['audioRefs']))) {
      return null;
    }
    return _0x446925;
  }
  ['_getPreviewGenerateButtonLoadingOptions']() {
    return createPreviewGenerateButtonCallbacks(this, aigenAudioText('buttons.generate'));
  }
  async ["_handleAudioTaskFailure"](_0x378f15, {
    payload: _0x30360d,
    recovering = ![]
  } = {}) {
    if (recovering) {
      return;
    }
    if (String(_0x378f15?.['code'] || '') === 'SUBSCRIPTION_REQUIRED') {
      const _0x256bff = String(_0x378f15?.['requiredModelId'] || '')["trim"]() || this["_getCurrentGateModelId"]() || this["_data"]?.['model'] || '';
      if (typeof window["handleSubscriptionRequired"] === 'function') {
        await window["handleSubscriptionRequired"]({
          'modelId': _0x256bff,
          'provider': 'runninghubwf',
          'error': _0x378f15
        });
      } else {
        typeof window["openSubscriptionDialog"] === 'function' ? window["openSubscriptionDialog"]({
          'modelId': _0x256bff,
          'provider': "runninghubwf"
        }) : window["showToast"]?.(_0x378f15?.["message"] || aigenAudioText("vip.needSubscription"), 'warn');
      }
      return;
    }
    console["error"]("[AIGenAudioNode] 生成失败:", _0x378f15);
    const _0x46a4fa = showProviderApiKeyMissingToastForError(_0x378f15, {
      'providerId': _0x30360d?.['provider'],
      'model': _0x30360d?.['audioWorkflowKey'],
      'adapterType': _0x30360d?.["adapterType"]
    });
    !_0x46a4fa && window["showToast"]?.(aigenAudioText("generation.failedWithError", {
      'error': _0x378f15?.["message"] || _0x378f15
    }), 'error');
  }
  async ["_onGenerate"](_0x3fd86c = null, _0x1c76cf = {}) {
    if (this["_audioRefUploadPending"]) {
      return;
    }
    if (this['_isGenerating']) {
      return;
    }
    if (_0x1c76cf?.['insertPrompt'] === !![]) {
      insertPresetPromptIntoEditor({
        'storeApi': a311_0xe0f4bd,
        'nodeId': this["nodeId"],
        'promptEl': this["promptEl"],
        'template': _0x3fd86c,
        'inEdges': a311_0xe0f4bd["getIncomingEdges"](this["nodeId"]),
        'nodes': a311_0xe0f4bd['getState']()["nodes"] || {},
        'allowedAssetTypes': ["text", "audio"]
      });
      this['_updateSubmitButtonState']();
      return;
    }
    if (shouldUsePromptPreviewForPreset(_0x3fd86c)) {
      const _0x2f0c79 = await this['_buildPayload'](_0x3fd86c);
      if (!_0x2f0c79) {
        this['_updateSubmitButtonState']();
        return;
      }
      previewPresetPromptInEditor({
        'storeApi': a311_0xe0f4bd,
        'nodeId': this["nodeId"],
        'promptEl': this["promptEl"],
        'promptText': _0x2f0c79["prompt"]
      });
      this['_updateSubmitButtonState']();
      return;
    }
    if (isPreviewModeEnabled()) {
      !isPreviewNodeLoading(this['nodeId']) && startPreviewNodeLoading(this["nodeId"], this["previewEl"], this["_getPreviewGenerateButtonLoadingOptions"]());
      return;
    }
    if (!(await this["_ensureVipAccessForCurrentWorkflow"]())) {
      this['_updateSubmitButtonState']();
      return;
    }
    const _0x364492 = this["_getCurrentWorkflow"]();
    const _0x5d46fe = guardModelGenerationCredentials({
      'modelId': _0x364492["key"],
      'provider': _0x364492["provider"],
      'providerProfileId': this["_data"]?.["providerProfileId"] || this["_data"]?.["rhProviderProfileId"],
      'adapterType': _0x364492["adapterType"]
    });
    if (!_0x5d46fe["ready"]) {
      this["_updateSubmitButtonState"]();
      return;
    }
    const _0x31898a = await this["_buildPayload"](_0x3fd86c);
    if (!_0x31898a) {
      this["_updateSubmitButtonState"]();
      return;
    }
    const _0x260e85 = String(_0x31898a?.['provider'] || '')['trim']()['toLowerCase']() === "runninghub" && String(_0x31898a?.["adapterType"] || '')["trim"]() === "modelApi";
    if (_0x260e85) {
      await ensureConfig();
      const _0x1b875f = getProviderConfig("runninghub") || {};
      const _0x561a61 = String(_0x1b875f?.["modelApiKey"] || _0x31898a?.["apiKey"] || '')["trim"]();
      if (!_0x561a61) {
        showProviderApiKeyMissingToast("请先填写 RunningHub 模型 API Key", {
          'providerId': "runninghub",
          'keyType': "modelApi",
          'model': _0x31898a?.["audioWorkflowKey"],
          'adapterType': _0x31898a?.["adapterType"]
        });
        this["_updateSubmitButtonState"]();
        return;
      }
      _0x31898a['apiKey'] = _0x561a61;
    }
    return this["_audioTaskOrchestration"]["runGeneration"]({
      'payload': _0x31898a,
      'startedAt': Date["now"]()
    });
  }
  ["_renderRefBar"]() {
    if (!this['refBarEl']) {
      return;
    }
    const _0xe6c5bb = this["_getCurrentWorkflow"]()["key"];
    this["_refBarWorkflowKey"] !== _0xe6c5bb && (this['_refBarWorkflowKey'] = _0xe6c5bb, this["refBarEl"]["innerHTML"] = '', this["refBarEl"]["classList"]["remove"]('active', "rh-v5-refbar"));
    const _0x18fd4b = getAudioWorkflowSlots(_0xe6c5bb, {
      'includeImages': !![]
    });
    const _0x454a64 = _0x18fd4b['length'] > 0x0;
    const _0x49906c = createPromptAttachmentButtonHTML();
    const _0x316ae8 = a311_0xe0f4bd["getIncomingEdges"](this['nodeId']);
    const _0x14fccf = a311_0xe0f4bd["getState"]()["nodes"] || {};
    const _0x3e1a77 = {};
    const _0x42165a = {
      'text': 0x0,
      'image': 0x0,
      'video': 0x0,
      'audio': 0x0
    };
    const _0x362853 = {
      'text': aigenAudioText('assetTypes.text'),
      'image': aigenAudioText("assetTypes.image"),
      'video': aigenAudioText("assetTypes.video"),
      'audio': aigenAudioText("assetTypes.audio")
    };
    if (!_0x454a64) {
      if (_0x316ae8["length"] === 0x0) {
        const _0x196b6c = _0x49906c;
        this["_lastRefHTML"] !== _0x196b6c && (this['_lastRefHTML'] = _0x196b6c, this["refBarEl"]["classList"]["remove"]("active", "rh-v5-refbar"), this["refBarEl"]["innerHTML"] = _0x196b6c);
        this["_attachBtnIcon"] = this["refBarEl"]?.['querySelector'](".prompt-attachment-btn .btn-icon") || null;
        this['_syncPickConnectVisualState']();
        _syncPillLabels(this, _0x3e1a77);
        return;
      }
      this["refBarEl"]['classList']["add"]('active');
      this["refBarEl"]['classList']['remove']("rh-v5-refbar");
      const _0x36b1a5 = [];
      for (const _0x212b92 of _0x316ae8) {
        const _0x4b66a3 = _0x14fccf[_0x212b92['sourceId']];
        if (!_0x4b66a3) {
          continue;
        }
        const _0x511bdc = String(_0x4b66a3["type"] || '');
        let _0x2c29a8 = "image";
        if (_0x511bdc["includes"]("text")) {
          _0x2c29a8 = 'text';
        } else {
          if (_0x511bdc['includes']('video')) {
            _0x2c29a8 = "video";
          } else {
            if (_0x511bdc['includes']("audio")) {
              _0x2c29a8 = 'audio';
            }
          }
        }
        _0x42165a[_0x2c29a8]++;
        _0x3e1a77[_0x212b92["sourceId"]] = '@' + _0x362853[_0x2c29a8] + _0x42165a[_0x2c29a8];
        const _0x2f363f = [String(_0x4b66a3?.['thumbUrl'] || '')["trim"](), String(_0x4b66a3?.["imageUrl"] || '')["trim"](), String(_0x4b66a3?.["src"] || '')['trim'](), toLocalAssetUrl(_0x4b66a3?.["localPath"]), String(_0x4b66a3?.["audioUrl"] || '')['trim']()]["filter"](Boolean);
        const _0x10e4b3 = (_0x2c29a8 === "video" ? resolveReferenceVideoThumbnail(_0x4b66a3, _0x212b92)["thumbUrl"] : '') || _0x2f363f["find"](_0x5cffa2 => isLikelyImageUrl(_0x5cffa2)) || '';
        if (_0x10e4b3) {
          ensureThumbDecoded(_0x10e4b3);
        }
        const _0x2fa9e9 = _0x212b92['id'] + '|' + _0x212b92['sourceId'] + '|' + (_0x10e4b3 || _0x2c29a8 + "-fallback");
        _0x36b1a5["push"]({
          'edgeId': _0x212b92['id'],
          'sourceId': _0x212b92["sourceId"],
          'sig': _0x2fa9e9,
          'html': createReferenceInputThumbnailHtml({
            'kind': _0x2c29a8,
            'thumbnailUrl': _0x10e4b3
          })
        });
      }
      const _0x31ebbf = _0x49906c + "<div class=\"ref-thumb-container\">" + _0x36b1a5["map"](_0x484600 => "<div class=\"ref-thumb-wrap\" data-edge-id=\"" + _0x484600['edgeId'] + "\" data-source-id=\"" + _0x484600["sourceId"] + "\" data-sig=\"" + _0x484600["sig"] + "\" draggable=\"true\">" + _0x484600["html"] + "<button type=\"button\" class=\"ref-thumb-delete\" title=\"" + aigenAudioText('refs.remove') + "\">&times;</button></div>")["join"]('') + "</div>";
      this['_lastRefHTML'] !== _0x31ebbf && (this["_lastRefHTML"] = _0x31ebbf, this["refBarEl"]["innerHTML"] = _0x31ebbf);
      this['_attachBtnIcon'] = this["refBarEl"]?.["querySelector"](".prompt-attachment-btn .btn-icon") || null;
      this["_syncPickConnectVisualState"]();
      _syncPillLabels(this, _0x3e1a77);
      return;
    }
    const _0x477bfc = [];
    for (const _0x15f30d of _0x316ae8) {
      const _0x2c91cc = _0x14fccf[_0x15f30d["sourceId"]];
      if (!_0x2c91cc) {
        continue;
      }
      const _0x34b380 = String(_0x2c91cc["type"] || '');
      let _0x229c35 = 'image';
      if (_0x34b380["includes"]("text")) {
        _0x229c35 = 'text';
      } else {
        if (_0x34b380["includes"]('video')) {
          _0x229c35 = 'video';
        } else {
          if (_0x34b380["includes"]("audio")) {
            _0x229c35 = "audio";
          }
        }
      }
      _0x42165a[_0x229c35]++;
      _0x3e1a77[_0x15f30d["sourceId"]] = '@' + _0x362853[_0x229c35] + _0x42165a[_0x229c35];
      _0x229c35 === "audio" && _0x477bfc["push"]({
        'edgeId': _0x15f30d['id'],
        'sourceId': _0x15f30d['sourceId'],
        'sourceType': _0x34b380,
        'refSlot': String(_0x15f30d?.["refSlot"] || ''),
        'url': this["_resolveAudioRefUrl"](_0x2c91cc),
        'edge': _0x15f30d,
        'sourceNode': _0x2c91cc
      });
    }
    const _0x3b8c20 = _0x14fccf?.[this["nodeId"]] || this["_data"] || {};
    const _0xa2039a = buildAudioWorkflowInputPlan({
      'workflowKey': _0xe6c5bb,
      'audioRefs': _0x477bfc,
      'assetInputRefs': getAssetInputRefsFromPromptAndNode(this["promptEl"], {
        'nodeData': _0x3b8c20,
        'allowedTypes': ["audio"]
      })
    });
    const _0xac348a = {};
    _0x18fd4b['forEach'](_0x36fcb7 => _0xac348a[_0x36fcb7["slot"]] = null);
    const _0x441cd0 = (_0x3c294f, _0x1ff0fb) => {
      const _0x28337a = _0x1ff0fb?.["edge"] || {
        'id': _0x1ff0fb?.['edgeId'],
        'sourceId': _0x1ff0fb?.['sourceId']
      };
      const _0x9d3ce2 = _0x1ff0fb?.["sourceNode"] || _0x14fccf[_0x1ff0fb?.["sourceId"]];
      if (!_0x9d3ce2) {
        return null;
      }
      const _0x371e1d = [String(_0x9d3ce2?.["thumbUrl"] || '')["trim"](), String(_0x9d3ce2?.["imageUrl"] || '')["trim"](), String(_0x9d3ce2?.["src"] || '')["trim"](), toLocalAssetUrl(_0x9d3ce2?.["localPath"]), String(_0x9d3ce2?.["audioUrl"] || '')["trim"]()]["filter"](Boolean);
      const _0x1d88f9 = _0x371e1d["find"](_0x43a1b1 => isLikelyImageUrl(_0x43a1b1)) || '';
      if (_0x1d88f9) {
        ensureThumbDecoded(_0x1d88f9);
      }
      const _0x430fbe = _0x3c294f + '|' + _0x28337a['id'] + '|' + _0x28337a["sourceId"] + '|' + (_0x1d88f9 || "audio-fallback");
      return {
        'edgeId': _0x28337a['id'],
        'sourceId': _0x28337a["sourceId"],
        'sig': _0x430fbe,
        'html': createReferenceInputThumbnailHtml({
          'kind': _0x1ff0fb['kind'] || "audio",
          'thumbnailUrl': _0x1d88f9
        })
      };
    };
    const _0x2d833d = (_0x25c8ab, _0x1435a3) => {
      const _0x12dc74 = _0x1435a3?.["assetInputRef"] || _0x1435a3 || {};
      const _0x5a97ae = [String(_0x12dc74?.['thumbUrl'] || '')["trim"](), String(_0x12dc74?.["nodeData"]?.["thumbUrl"] || '')["trim"](), String(_0x12dc74?.['nodeData']?.["imageUrl"] || '')['trim'](), String(_0x12dc74?.['nodeData']?.["src"] || '')["trim"](), toLocalAssetUrl(_0x12dc74?.['nodeData']?.["localPath"])]['filter'](Boolean);
      const _0xb69db = _0x5a97ae["find"](_0xc7bfab => isLikelyImageUrl(_0xc7bfab)) || '';
      if (_0xb69db) {
        ensureThumbDecoded(_0xb69db);
      }
      const _0x1a38fe = String(_0x12dc74["assetId"] || '');
      const _0x5ff3d1 = String(_0x12dc74["itemIndex"] ?? '');
      const _0x146d59 = String(_0x12dc74["assetMentionOccurrence"] ?? '');
      const _0x1d53ac = String(_0x12dc74["assetRefSource"] || 'prompt');
      const _0x4b4b17 = _0x25c8ab + "|asset:" + _0x1a38fe + ':' + _0x5ff3d1 + ':' + _0x146d59 + '|' + (_0xb69db || "audio-fallback");
      return {
        'edgeId': '',
        'sourceId': 'asset:' + _0x1a38fe + ':' + _0x5ff3d1,
        'sig': _0x4b4b17,
        'html': createReferenceInputThumbnailHtml({
          'kind': "audio",
          'thumbnailUrl': _0xb69db
        }),
        'virtual': !![],
        'assetId': _0x1a38fe,
        'assetIndex': _0x5ff3d1,
        'assetOccurrence': _0x146d59,
        'assetRefSource': _0x1d53ac,
        'refType': "audio"
      };
    };
    Object["entries"](_0xa2039a["slotItems"])["forEach"](([_0x4a8d8e, _0x33493f]) => {
      if (!_0x33493f) {
        return;
      }
      _0xac348a[_0x4a8d8e] = _0x33493f['origin'] === "asset" ? _0x2d833d(_0x4a8d8e, _0x33493f) : _0x441cd0(_0x4a8d8e, _0x33493f);
    });
    for (const _0x5ae861 of buildAudioWorkflowImageSlotItems(_0xe6c5bb, _0x316ae8, _0x14fccf)) {
      _0xac348a[_0x5ae861["refSlot"]] = _0x441cd0(_0x5ae861["refSlot"], _0x5ae861);
    }
    this["refBarEl"]["classList"]["add"]('active', "rh-v5-refbar");
    let _0x16eb05 = this['refBarEl']["querySelector"](".rh-v5-ref-container");
    const _0x5b1749 = !_0x16eb05 || !this['refBarEl']["querySelector"]('.prompt-attachment-btn') || _0x16eb05["querySelectorAll"]("[data-slot]")["length"] !== _0x18fd4b["length"];
    _0x5b1749 && (this["refBarEl"]["innerHTML"] = _0x49906c + " <div class=\"ref-thumb-container rh-v5-ref-container\" aria-label=\"" + aigenAudioText("refs.inputAria") + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + _0x18fd4b["map"](_0xbbac20 => "<button type=\"button\" class=\"ref-thumb-wrap ref-upload-slot rh-v5-ref-box\" data-slot=\"" + _0xbbac20["slot"] + '\x22\x20title=\x22' + escapeInputSlotLabelHtml(_0xbbac20["label"]) + "\"><span class=\"ref-upload-label\">" + formatInputSlotLabelHtml(_0xbbac20["label"]) + "</span></button>")["join"]('') + "\n      </div>", _0x16eb05 = this["refBarEl"]["querySelector"](".rh-v5-ref-container"));
    const _0x1b2e49 = (_0x3719f6, _0x305683, _0x5b5f91) => {
      if (!_0x16eb05) {
        return;
      }
      const _0x3dc264 = _0x16eb05["querySelector"]("[data-slot=\"" + _0x3719f6 + '\x22]');
      if (!_0x305683) {
        if (_0x3dc264 && _0x3dc264['tagName'] === 'BUTTON' && _0x3dc264["classList"]['contains']("ref-upload-slot")) {
          return;
        }
        const _0x5f55c7 = document["createElement"]("button");
        _0x5f55c7["type"] = 'button';
        _0x5f55c7["className"] = "ref-thumb-wrap ref-upload-slot rh-v5-ref-box";
        _0x5f55c7['dataset']["slot"] = _0x3719f6;
        _0x5f55c7["title"] = _0x5b5f91;
        const _0x1ad129 = document['createElement']("span");
        _0x1ad129['className'] = 'ref-upload-label';
        _0x1ad129["innerHTML"] = formatInputSlotLabelHtml(_0x5b5f91);
        _0x5f55c7['appendChild'](_0x1ad129);
        if (_0x3dc264) {
          _0x3dc264['replaceWith'](_0x5f55c7);
        } else {
          _0x16eb05["appendChild"](_0x5f55c7);
        }
        return;
      }
      const _0x5d574d = document["createElement"]('div');
      _0x5d574d['className'] = "ref-thumb-wrap rh-v5-ref-box" + (_0x305683["virtual"] ? " ref-thumb-wrap--asset" : '');
      _0x5d574d['setAttribute']("draggable", _0x305683["virtual"] ? "false" : "true");
      _0x5d574d["dataset"]["slot"] = _0x3719f6;
      _0x5d574d["dataset"]["edgeId"] = _0x305683["edgeId"];
      _0x5d574d["dataset"]['sourceId'] = _0x305683["sourceId"];
      _0x5d574d["dataset"]["sig"] = _0x305683["sig"];
      _0x5d574d["dataset"]["refOrigin"] = _0x305683["virtual"] ? "asset" : "node";
      _0x305683['virtual'] && (_0x5d574d["dataset"]["assetId"] = _0x305683["assetId"] || '', _0x5d574d["dataset"]['assetIndex'] = _0x305683['assetIndex'] || '', _0x5d574d["dataset"]["assetOccurrence"] = _0x305683["assetOccurrence"] || '', _0x5d574d["dataset"]["assetRefSource"] = _0x305683["assetRefSource"] || "prompt", _0x5d574d["dataset"]["refType"] = _0x305683['refType'] || 'audio');
      _0x5d574d['innerHTML'] = _0x305683['html'] + "<button type=\"button\" class=\"ref-thumb-delete\" title=\"" + aigenAudioText("refs.remove") + "\">&times;</button>";
      revealRefThumbMedia(_0x5d574d, _0x305683["sig"]);
      if (_0x3dc264) {
        _0x3dc264["replaceWith"](_0x5d574d);
      } else {
        _0x16eb05["appendChild"](_0x5d574d);
      }
    };
    _0x18fd4b["forEach"](_0x59c030 => _0x1b2e49(_0x59c030['slot'], _0xac348a[_0x59c030['slot']], _0x59c030["label"]));
    bindRefThumbFixedSlotDrag({
      'owner': this,
      'container': _0x16eb05,
      'store': a311_0xe0f4bd,
      'nodeId': this["nodeId"],
      'acceptMap': Object["fromEntries"](_0x18fd4b['map'](_0x3cca6b => [_0x3cca6b["slot"], _0x3cca6b['kind'] || "audio"]))
    });
    this["_attachBtnIcon"] = this["refBarEl"]?.['querySelector']('.prompt-attachment-btn\x20.btn-icon') || null;
    this["_syncPickConnectVisualState"]();
    _syncPillLabels(this, _0x3e1a77);
  }
  ["_clearToolbarActionBindings"]() {
    if (!Array["isArray"](this['_toolbarActionCleanups'])) {
      this["_toolbarActionCleanups"] = [];
      return;
    }
    for (const _0xee62f2 of this["_toolbarActionCleanups"]["splice"](0x0)) {
      _0xee62f2();
    }
  }
  ["unmount"]() {
    this["_rendererWaveformVisible"] = ![];
    this['_releaseRendererPlaybackPin']?.();
    this["_releaseRendererPlaybackPin"] = null;
    this["_clearToolbarActionBindings"]();
    this['_unsubscribeLocale']?.();
    this['_unsubscribeLocale'] = null;
    this["_unregisterAudioPlaybackClient"]?.();
    this["_unregisterAudioPlaybackClient"] = null;
    this["_flushPromptHtmlCommit"]?.();
    this["_assetMentionRegistryUnsubscribe"]?.();
    this['_assetMentionRegistryUnsubscribe'] = null;
    this["_assetMentionRegistryRefreshPending"] = ![];
    this["_audioTaskOrchestration"]["dispose"]({
      'preserveTask': shouldPreserveGenerationTaskOnUnmount(this["nodeId"])
    });
    this['_clearStatusOverlay']();
    this["_clearAudioMultiResultStack"]();
    this["_closeModelMenu"]();
    this['_docClickHandler'] && (document["removeEventListener"]("click", this['_docClickHandler']), this["_docClickHandler"] = null);
    this['_unbindRefThumbHoverPreview'] && (this["_unbindRefThumbHoverPreview"](), this["_unbindRefThumbHoverPreview"] = null);
    this["_progressController"]?.["destroy"]();
    this["_progressController"] = null;
    typeof this['_cancelDeferredWaveform'] === "function" && (this["_cancelDeferredWaveform"](), this["_cancelDeferredWaveform"] = null);
    this["_cancelWaveformRequest"]();
    this["_clearAudioElementSource"]();
    this["_promptResizeCleanup"] && (this["_promptResizeCleanup"](), this["_promptResizeCleanup"] = null);
    this["_uiSchemaCleanup"]?.();
    this["_uiSchemaCleanup"] = null;
    this["_footerControllerCleanup"]?.();
    this["_footerControllerCleanup"] = null;
    this["_generationNodeHelpTip"]?.["remove"]();
    this["_generationNodeHelpTip"] = null;
    this["_promptPresetTrigger"]?.["remove"]();
    this["_promptPresetTrigger"] = null;
    this["_promptExpansion"]?.["remove"]();
    this['_promptExpansion'] = null;
    this["_modelProviderProfileControl"]?.["remove"]();
    this["_modelProviderProfileControl"] = null;
    this["_promptPanel"]?.["classList"]["remove"]('is-resize-hover');
    this['_promptInputWrap']?.['classList']["remove"]('is-resizing');
    this['_isPromptBoxResizing'] = ![];
  }
}