import a373_0x4fa370 from '../core/stores/appStore.js';
import { shouldPreserveGenerationTaskOnUnmount } from '../core/generationTaskRuntime.js';
import { fetchVideoFirstFrameThumbFromServer } from '../../api/videoThumbApi.js';
import { fetchVideoMetaFromServer } from '../../api/videoMetaApi.js';
import { buildGenerateVideoRequest, cancelRunningHubVideoTask, generateVideo, probeDreaminaVideoTask, resumeAsyncVideoTask, resumeDreaminaVideoTask, resumeRunningHubVideoTask } from '../../api/aiVideoApi.js';
import { getDisplayModelName, PROVIDERS_META } from '../modules/providers.js';
import { _handlePillHover, _handlePillOut, _syncEdgesOrderFromPills, _syncPillLabels, _checkAtTrigger, _populateMentionMenu, _insertMentionPill, _rehydratePromptPills, _handlePillKeyboard, _handleMentionMenuKeyboard, _getMentionMenu, _closeMentionMenu, flushPromptHtmlCommit, handlePromptPaste, handlePromptSelectAll, handleRefThumbDeleteClick, schedulePromptHtmlCommit, shouldSubmitPromptByKeyboard } from '../modules/nodePromptShared.js';
import { VIDEO_TOOLBAR_HTML, bindVideoToolbarEvents, showDevToast } from './NodeToolbarConfig.js';
import { getImage } from '../modules/storage.js';
import { startLoading, stopLoading } from '../modules/loadingOverlay.js';
import { bindRefThumbHoverPreview } from '../modules/refThumbHoverPreview.js';
import { buildCanvasLocalImageFields } from '../services/canvasMediaLocalService.js';
import { ensureThumbDecoded, revealRefThumbMedia } from '../modules/refThumbMediaReveal.js';
import { getAIGenerationNodeSize, getAutoMediaSizeByShortSide, buildSourceMediaNodePayload } from '../services/fileService.js';
import { buildApiUrl } from '../../api/apiBase.js';
import { ensureConfig, getProviderConfig } from '../../api/configApi.js';
import { commit } from '../modules/history.js';
import { startNodeResizePreview } from '../modules/interaction/nodeResizePreview.js';
import { checkLocalMediaExists, saveOutputBlob, uploadFile } from '../modules/project.js';
import { getNodeSpawnPrefs, calcSafeSpawnPosNearNode } from '../modules/nodeSpawn.js';
import { VIDEO_VIP_MODEL_IDS, isVipModel as a373_0x92b9ef, getVipModelDisplayName, resolveVipGateModelId } from '../modules/subscriptionAccess.js';
import a373_0x41c3da from '../modules/VideoKeyingController.js';
import { generateId, findAvailablePosition } from '../core/math.js';
import { getDisplayedMediaSizeFromNode, sanitizePromptHtml } from '../utils/dom.js';
import { checkSlashTrigger, handleSlashKeyboardNavigation, closeSlashMenu } from '../modules/slashMenu.js';
import { shouldSkipPromptTriggerForBulkInput } from '../modules/promptTriggerComposition.js';
import { clearVirtualizedPromptCommit } from '../modules/promptPasteVirtualization.js';
import { activateMenuKeyboard } from '../modules/floatingMenuKeyboard.js';
import { stopPreviewNodeLoading, syncPreviewNodeLoading } from '../modules/previewMode.js';
import { isTaskTerminal, shouldShowGenerationBusyUi } from '../core/generationTaskUiState.js';
import { hasDisplayableVideoResult } from '../core/rendererNodeResultState.js';
import { videoUiRenderMixin } from './aigenVideo/uiRenderMixin.js';
import { videoStateSyncMixin } from './aigenVideo/stateSyncMixin.js';
import { videoTaskOrchestrationMixin } from './aigenVideo/taskOrchestrationMixin.js';
import { createVideoNodeReferenceInputModule } from './video-node/referenceInputModule.js';
import { subscribeAssetMentionRegistry } from '../modules/assetMentionRegistry.js';
import { removeCoveredAssetInputRefForConnection } from '../modules/promptAssetInputOverride.js';
import { localPathToUrl, pickResultLocalPath, urlToLocalPath } from '../utils/localMediaPath.js';
import { createGenerationNodeHelpTipController, getGenerationNodeHelpTooltip } from './generationNodeHelpTip.js';
import { createPromptPresetTriggerController } from './promptPresetTrigger.js';
import { attachNodePromptExpansion } from './nodePromptExpansion.js';
import { createModelProviderProfileControl } from './shared/modelProviderProfileControl.js';
import { syncModelUiSchemaControls } from './aigenImage/uiSchemaRenderer.js';
import { buildUiSchemaVisibilitySignature } from './aigenImage/uiSchemaVisibility.js';
import { disposeImageSchemaRatioResizeAnimation, GENERATION_MANUAL_DISPLAY_SIZE_FIELD } from './shared/generationDisplayPolicy.js';
import { createVideoNodeParameterPanelModule } from './video-node/parameterPanelModule.js';
import { shouldShowVideoPromptInput } from './video-node/parameterPanelPresentationPolicy.js';
import { hasRunningHubVideoWorkflowUiField, hasRunningHubVideoWorkflowUiPlacement } from './video-node/runningHubVideoUiSchema.js';
import { isCustomAiAppManifest, resolveCustomAiAppNodeManifest } from './shared/rhAiAppNodeBehavior.js';
import { createVideoNodeTaskOrchestrationModule } from './video-node/taskOrchestrationModule.js';
import { createVideoNodeResultRenderModule } from './video-node/resultRenderModule.js';
import { createVideoNodePreviewControlsModule } from './video-node/previewControlsModule.js';
import { hydrateDeferredVideoNodeToolbar, hydrateVideoNodeDeferredDetails, initializeVideoNodePromptDetailsOnMount, renderInitialVideoNodeFooter, disposeVideoNodePromptDetails } from './video-node/deferredDetailsHydration.js';
import { createVideoNodeUpdatePerf } from './video-node/videoNodeUpdatePerf.js';
import { buildVideoNodeFooterControlSig, buildVideoNodePromptBoxSizeSig, buildVideoNodePromptUiSig, buildVideoNodeSubmitButtonSig, buildVideoNodeVideoViewSig } from './video-node/videoNodeUpdateSignatures.js';
import { initializeVideoNodeMediaRuntimeState } from './video-node/mediaRuntimeState.js';
import { setupPromptBoxResize, syncPromptBoxSizeFromData } from './promptBoxResizeUi.js';
import { createVideoPromptEditorElements } from './video-node/promptInputSurface.js';
import { mountSegmentRetakeController } from './video-node/segmentRetakeController.js';
import { decorateSegmentRetakeParameterNodeData, isSegmentRetakeEditing } from '../modules/videoRetake/segmentRetakeModelPolicy.js';
import { syncNodeFooterAdvancedButtonState } from './shared/nodeFooterControls.js';
import { onLocaleChange, t } from '../i18n/index.js';
import { createPromptAttachmentButtonHTML } from './refAttachmentButton.js';
import { getFixedInputSlotConfigFromManifest } from '../modules/fixedInputAssetRefs.js';
import { getFixedInputAcceptForKind, getFixedInputSlotKind, getFixedInputSlotsToReplace } from './video-node/fixedInputSlotHelpers.js';
import { syncVideoNodeFixedInputSummary } from './video-node/fixedInputSummarySync.js';
import { getGenerationRatioMediaSize } from '../modules/generationRatioSource.js';
const VIDEO_VIP_MODEL_ID_SET = new Set(VIDEO_VIP_MODEL_IDS);
const VIDEO_VIP_MODEL_NAME_MAP = VIDEO_VIP_MODEL_IDS["reduce"]((_0x376b1a, _0x42e2ab) => {
  _0x376b1a[_0x42e2ab] = getVipModelDisplayName(_0x42e2ab);
  return _0x376b1a;
}, {});
let _vipSessionRecheckDone = ![];
const AI_VIDEO_MIN_SIZE = 0x96;
const api = {
  'buildGenerateVideoRequest': buildGenerateVideoRequest,
  'cancelRunningHubWorkflowTask': cancelRunningHubVideoTask,
  'fetchVideoFirstFrameThumbFromServer': fetchVideoFirstFrameThumbFromServer,
  'fetchVideoMetaFromServer': fetchVideoMetaFromServer,
  'generateVideo': generateVideo,
  'probeDreaminaVideoTask': probeDreaminaVideoTask,
  'resumeAsyncVideoTask': resumeAsyncVideoTask,
  'resumeDreaminaVideoTask': resumeDreaminaVideoTask,
  'resumeRunningHubVideoTask': resumeRunningHubVideoTask
};
function aigenVideoNodeText(_0x16516b, _0x3def19 = {}) {
  return t("aigenVideoNode." + _0x16516b, _0x3def19);
}
function getVideoAdaptiveRatioLabel() {
  return aigenVideoNodeText("ratio.adaptive");
}
function formatVideoNodeRatioResolutionLabel(_0x434e21 = {}) {
  const _0x3b5165 = String(_0x434e21?.["aspectRatio"] || '')["trim"]();
  const _0x4bdcb9 = !_0x3b5165 || _0x3b5165 === "自适应" || _0x3b5165 === "auto" || _0x3b5165 === 'adaptive' ? getVideoAdaptiveRatioLabel() : _0x3b5165;
  return _0x4bdcb9 + " · " + (_0x434e21?.["resolution"] || "1080p");
}
function readStoreState() {
  return typeof a373_0x4fa370['getStateRaw'] === 'function' ? a373_0x4fa370["getStateRaw"]() : a373_0x4fa370["getState"]();
}
function isTerminalGenerationUiState(_0xc16ecd) {
  return isTaskTerminal(_0xc16ecd);
}
function isVideoVipModel(_0x55f132, _0x8e1f99 = '') {
  return a373_0x92b9ef(_0x55f132, _0x8e1f99);
}
function getVideoVipModelName(_0xafb06b, _0x3fc03e = '') {
  const _0x28def3 = resolveVipGateModelId(_0xafb06b, _0x3fc03e);
  return VIDEO_VIP_MODEL_NAME_MAP[_0x28def3] || _0x28def3 || aigenVideoNodeText('vip.modelFallback');
}
async function ensureVipSessionRecheck(_0x106ee8, _0x3c8605 = '') {
  if (!isVideoVipModel(_0x106ee8, _0x3c8605)) {
    return;
  }
  if (_vipSessionRecheckDone) {
    return;
  }
  _vipSessionRecheckDone = !![];
  if (typeof window["refreshSubscriptionState"] === "function") {
    try {
      await window["refreshSubscriptionState"]();
    } catch {}
  }
}
const VIDEO_NODE_MODULE_DEPS = {
  'store': a373_0x4fa370,
  'api': api,
  'getDisplayModelName': getDisplayModelName,
  'PROVIDERS_META': PROVIDERS_META,
  '_handlePillHover': _handlePillHover,
  '_handlePillOut': _handlePillOut,
  '_syncEdgesOrderFromPills': _syncEdgesOrderFromPills,
  '_syncPillLabels': _syncPillLabels,
  '_getMentionMenu': _getMentionMenu,
  '_closeMentionMenu': _closeMentionMenu,
  'VIDEO_TOOLBAR_HTML': VIDEO_TOOLBAR_HTML,
  'bindVideoToolbarEvents': bindVideoToolbarEvents,
  'showDevToast': showDevToast,
  'getImage': getImage,
  'startLoading': startLoading,
  'stopLoading': stopLoading,
  'bindRefThumbHoverPreview': bindRefThumbHoverPreview,
  'ensureThumbDecoded': ensureThumbDecoded,
  'revealRefThumbMedia': revealRefThumbMedia,
  'buildApiUrl': buildApiUrl,
  'ensureConfig': ensureConfig,
  'getProviderConfig': getProviderConfig,
  'saveOutputBlob': saveOutputBlob,
  'uploadFile': uploadFile,
  'checkLocalMediaExists': checkLocalMediaExists,
  'getNodeSpawnPrefs': getNodeSpawnPrefs,
  'getAIGenerationNodeSize': getAIGenerationNodeSize,
  'getAutoMediaSizeByShortSide': getAutoMediaSizeByShortSide,
  'buildSourceMediaNodePayload': buildSourceMediaNodePayload,
  'calcSafeSpawnPosNearNode': calcSafeSpawnPosNearNode,
  'VideoKeyingController': a373_0x41c3da,
  'generateId': generateId,
  'findAvailablePosition': findAvailablePosition,
  'getDisplayedMediaSizeFromNode': getDisplayedMediaSizeFromNode,
  'checkSlashTrigger': checkSlashTrigger,
  'handleSlashKeyboardNavigation': handleSlashKeyboardNavigation,
  'closeSlashMenu': closeSlashMenu,
  'activateMenuKeyboard': activateMenuKeyboard,
  'isVideoVipModel': isVideoVipModel,
  'getVideoVipModelName': getVideoVipModelName,
  'ensureVipSessionRecheck': ensureVipSessionRecheck,
  'VIDEO_VIP_MODEL_IDS': VIDEO_VIP_MODEL_IDS,
  'VIDEO_VIP_MODEL_ID_SET': VIDEO_VIP_MODEL_ID_SET,
  'VIDEO_VIP_MODEL_NAME_MAP': VIDEO_VIP_MODEL_NAME_MAP,
  'readStoreState': readStoreState
};
export class AIGenVideoNode {
  constructor(_0x9b5fc8) {
    this["_data"] = _0x9b5fc8;
    this["nodeId"] = _0x9b5fc8['id'];
    this["previewEl"] = null;
    this["videoEl"] = null;
    this['refBarEl'] = null;
    this["promptEl"] = null;
    this['btnEl'] = null;
    this["footerEl"] = null;
    this["_promptPanel"] = null;
    this["_promptInputWrap"] = null;
    this["_promptResizeHandle"] = null;
    this['_isPromptBoxResizing'] = ![];
    this["_promptResizeCleanup"] = null;
    this["_qualityBtns"] = [];
    this["_attachBtnIcon"] = null;
    this["_lastImgKey"] = null;
    this['_lastFooterSig'] = null;
    this['_lastFooterControlSig'] = null;
    this['_lastPromptContentSig'] = null;
    this["_lastPromptUiSig"] = null;
    this["_lastPromptBoxSizeSig"] = null;
    this["_lastSubmitButtonSig"] = null;
    this["_lastEdgeSig"] = null;
    this["_lastRefModeSig"] = '';
    this['_v5RefUploadInput'] = null;
    this["_v5RefUploadSlot"] = '';
    this["_v5RefUploadAnchorNodeId"] = '';
    this["_fixedSlotRefThumbObjectUrls"] = new Map();
    this["_ltxRefUploadInput"] = null;
    this["_ltxRefUploadSlot"] = '';
    this["_ltxRefUploadAnchorNodeId"] = '';
    this["_adaptiveSrcRetryToken"] = 0x0;
    this["_refThumbObjectUrls"] = new Map();
    this["_lastSpecialModeSig"] = '';
    this["_lastSubtractSubjectSig"] = '';
    this['_renderRefBarLock'] = null;
    this["_renderRefBarPending"] = ![];
    this["_ratioAnimTimer"] = null;
    this["_ratioFlipAnim"] = null;
    this["_rhAbortController"] = null;
    this["_rhTaskId"] = null;
    this["_rhApiKey"] = null;
    this["_rhCancelRequested"] = ![];
    this["_rhResumeAbortController"] = null;
    this["_rhResumeTaskId"] = '';
    this["_rhResumePromise"] = null;
    this["_asyncResumeAbortController"] = null;
    this['_asyncResumeTaskId'] = '';
    this['_asyncResumePromise'] = null;
    this["_statusOverlayEl"] = null;
    this["_lastAdaptiveEdgeSig"] = null;
    this["_lastVideoViewSig"] = null;
    this["_lastHasInputConnections"] = null;
    initializeVideoNodeMediaRuntimeState(this, _0x9b5fc8, a373_0x4fa370);
    this["_vipSelectionRetryInProgress"] = ![];
    this["_assetMentionRegistryUnsubscribe"] = null;
    this["_assetMentionRegistryRefreshPending"] = ![];
    this["_generationNodeHelpTip"] = null;
    this["_modelProviderProfileControl"] = null;
    this["_uiSchemaCleanup"] = null;
    this['_footerControllerCleanup'] = null;
    this['_videoSubmitInFlight'] = ![];
    this['_unsubscribeLocale'] = null;
    this['_videoToolbarCleanup'] = null;
  }
  get ['isNoResult']() {
    return !hasDisplayableVideoResult(this["_data"]);
  }
  ["_syncNoResultClass"]() {
    if (!this["_root"]?.['classList']) {
      return;
    }
    this['isNoResult'] ? this['_root']["classList"]["add"]("no-result") : this["_root"]["classList"]["remove"]("no-result");
  }
  ["_syncLocaleTexts"]() {
    this["promptEl"] && (this["promptEl"]['dataset']["placeholder"] = aigenVideoNodeText('prompt.placeholder'));
    this["_promptPanel"]?.['querySelector'](".generation-node-help-tip")?.['setAttribute']('aria-label', aigenVideoNodeText('help.ariaLabel'));
    this["_syncPreviewControlLocaleTexts"]?.();
  }
  ["_deferVideoMediaRefresh"]() {
    this["_deferredVideoViewRefreshPending"] = !![];
    const _0x485952 = this["_showDeferredVideoPosterPreview"]?.() === !![];
    !_0x485952 && this["_placeholderEl"] && (this["_placeholderEl"]["style"]["display"] = "flex");
    this["_setVideoOverlaysVisible"]?.(![]);
  }
  ["_loadVideoWhenMediaReady"]() {
    const _0x4ba341 = this["_rendererMediaDeferred"] === !![] && !this["_mustRenderTerminalVideoState"]?.(this["_data"]);
    if (_0x4ba341) {
      return this["_deferVideoMediaRefresh"]();
    }
    this["_loadAndDisplayVideo"]();
  }
  ["_schedulePreviewVideoOverlays"]() {
    const _0x566fd7 = () => {
      this["_rendererMediaDeferred"] !== !![] && this['previewEl']?.["isConnected"] !== ![] && this["_ensurePreviewVideoOverlays"]();
    };
    typeof globalThis["requestIdleCallback"] === 'function' ? globalThis["requestIdleCallback"](_0x566fd7, {
      'timeout': 0x4b0
    }) : (globalThis["requestAnimationFrame"] || globalThis["setTimeout"])(_0x566fd7);
  }
  ['_renderRefBarWhenMediaReady']() {
    if (this["_rendererMediaDeferred"] === !![] || this['_rendererDetailsDeferred'] === !![]) {
      this["_renderRefBarPendingWhenVisible"] = !![];
    } else {
      this['_renderRefBar']();
    }
  }
  ["mount"]() {
    this['_videoToolbarCleanup']?.();
    this["_videoToolbarCleanup"] = null;
    typeof this["_normalizeDreaminaNodeData"] === "function" && (this['_data'] = this["_normalizeDreaminaNodeData"](this["_data"], {
      'syncStore': !![]
    }) || this["_data"]);
    const _0x27d271 = document['createElement']('div');
    if (this["isNoResult"]) {
      _0x27d271['classList']["add"]("no-result");
    }
    this["_root"] = _0x27d271;
    _0x27d271['classList']["add"]("aigen-node-root", "aigen-video-root");
    this["_rendererThinVideoHydration"] === !![] ? this["_deferredToolbarMarkupPending"] = !![] : _0x27d271["innerHTML"] = VIDEO_TOOLBAR_HTML;
    this['previewEl'] = document["createElement"]("div");
    this["previewEl"]['className'] = "img-node-preview aigen-node-preview-fill aigen-video-preview";
    const _0x4f8c37 = document["createElement"]("div");
    _0x4f8c37["className"] = 'img-node-placeholder';
    Object["assign"](_0x4f8c37['style'], {
      'display': "flex",
      'flexDirection': "column",
      'alignItems': "center",
      'gap': "8px",
      'color': "var(--text-muted)",
      'pointerEvents': "none",
      'userSelect': "none"
    });
    _0x4f8c37["innerHTML"] = "\n            <svg class=\"placeholder-icon-svg\" width=\"40\" height=\"40\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\" style=\"transition:all 0.2s;\">\n                <path d=\"M23 7l-7 5 7 5V7z\"/><rect x=\"1\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\" ry=\"2\"/>\n            </svg>";
    this["previewEl"]["appendChild"](_0x4f8c37);
    this["_placeholderEl"] = _0x4f8c37;
    syncPreviewNodeLoading(this['nodeId'], this["previewEl"], this["_getPreviewGenerateButtonLoadingOptions"]?.());
    if (this["_rendererMediaDeferred"] !== !![]) {
      if (this["_rendererThinVideoHydration"] !== !![]) {
        this['_ensurePreviewVideoOverlays']();
      }
    }
    _0x27d271["appendChild"](this["previewEl"]);
    const _0x1b0487 = document['createElement']("div");
    _0x1b0487["className"] = 'node-resizer';
    _0x27d271["appendChild"](_0x1b0487);
    !isSegmentRetakeEditing(this["_data"]) && this['_loadVideoWhenMediaReady']();
    typeof this["_maybeResumeDreaminaTaskImpl"] === "function" && queueMicrotask(() => {
      readStoreState()['nodes']?.[this["nodeId"]] && this["_maybeResumeDreaminaTaskImpl"]();
    });
    typeof this["_maybeResumeRunningHubTaskImpl"] === "function" && queueMicrotask(() => {
      readStoreState()["nodes"]?.[this['nodeId']] && this["_maybeResumeRunningHubTaskImpl"]();
    });
    typeof this["_maybeResumeAsyncTaskImpl"] === "function" && queueMicrotask(() => {
      readStoreState()["nodes"]?.[this["nodeId"]] && this['_maybeResumeAsyncTaskImpl']();
    });
    this["previewEl"]['addEventListener']("mouseenter", () => {
      this['activatePreviewHoverPlayback']();
    });
    this["previewEl"]['addEventListener']("mouseleave", () => {
      const _0x169915 = readStoreState();
      const _0x3f9500 = _0x169915["videoClip"];
      if (_0x3f9500 && _0x3f9500['active'] && _0x3f9500['nodeId'] === this["nodeId"]) {
        return;
      }
      const _0x1e1f7a = _0x169915["nodes"][this['nodeId']] || this["_data"] || {};
      if (_0x1e1f7a["isVideosExpanded"]) {
        return;
      }
      this["_deactivatePreviewHoverPlayback"]();
    });
    const _0x52ed4d = document['createElement']("div");
    _0x52ed4d["className"] = "text-prompt-panel";
    this['_promptPanel'] = _0x52ed4d;
    _0x52ed4d["addEventListener"]('pointerdown', _0x31b78e => {
      _0x31b78e["stopPropagation"]();
    });
    this["refBarEl"] = document["createElement"]('div');
    this['refBarEl']['className'] = "node-ref-bar";
    this["refBarEl"]['innerHTML'] = createPromptAttachmentButtonHTML({
      'stroke': 'var(--white-90)'
    });
    _0x52ed4d["appendChild"](this["refBarEl"]);
    this["refBarEl"]["addEventListener"]("pointerdown", _0x5db3c4 => {
      if (_0x5db3c4["target"]["closest"](".prompt-attachment-btn, .ref-thumb-wrap, .ref-thumb-delete")) {
        _0x5db3c4['stopPropagation']();
      }
    });
    this["refBarEl"]["addEventListener"]("click", _0x2c919d => {
      if (handleRefThumbDeleteClick(this, _0x2c919d)) {
        return;
      }
      const _0x431d38 = _0x2c919d['target']["closest"](".prompt-attachment-btn");
      if (!_0x431d38) {
        return;
      }
      _0x2c919d["stopPropagation"]();
      _0x2c919d["preventDefault"]();
      const _0x3dcaed = a373_0x4fa370["getState"]()["pickConnectMode"];
      _0x3dcaed?.['active'] && _0x3dcaed["sourceNodeId"] === this["nodeId"] ? a373_0x4fa370["setPickConnectMode"]({
        'active': ![]
      }) : a373_0x4fa370["setPickConnectMode"]({
        'active': !![],
        'sourceNodeId': this['nodeId'],
        'handleDirection': 'left'
      });
    });
    this["_unbindRefThumbHoverPreview"] = bindRefThumbHoverPreview(this["refBarEl"]);
    this["_v5RefUploadInput"] = document['createElement']("input");
    this["_v5RefUploadInput"]["type"] = "file";
    this["_v5RefUploadInput"]["accept"] = "*/*";
    this["_v5RefUploadInput"]["style"]["display"] = 'none';
    _0x52ed4d['appendChild'](this['_v5RefUploadInput']);
    this["_v5RefUploadInput"]["addEventListener"]("change", async _0x31dc0f => {
      const _0x20f4c3 = _0x31dc0f['target']["files"]?.[0x0];
      const _0x18c62d = this["_v5RefUploadSlot"];
      const _0x7e5aa6 = this["_v5RefUploadAnchorNodeId"];
      if (!_0x20f4c3 || !_0x18c62d || !_0x7e5aa6) {
        this["_v5RefUploadInput"]["value"] = '';
        return;
      }
      try {
        const _0x2840b8 = window["currentProjectId"] || "default_v2_project";
        const _0x565c5b = await uploadFile(_0x20f4c3, _0x2840b8);
        const _0x238c1f = _0x565c5b?.["url"] || '';
        if (!_0x238c1f) {
          throw new Error(aigenVideoNodeText('upload.noFileUrl'));
        }
        const _0x5dbfb0 = a373_0x4fa370["getState"]();
        const _0x14580c = _0x5dbfb0['nodes']?.[_0x7e5aa6];
        if (!_0x14580c) {
          throw new Error(aigenVideoNodeText("upload.anchorMissing"));
        }
        const _0x11df47 = pickResultLocalPath(_0x565c5b) || urlToLocalPath(_0x238c1f);
        const _0x3a67e9 = getFixedInputSlotKind(_0x14580c, _0x18c62d);
        const _0xde7689 = _0x3a67e9 === 'video';
        const _0x151db2 = _0x3a67e9 === "image";
        if (_0xde7689 && !_0x20f4c3['type']['startsWith']("video/")) {
          throw new Error(aigenVideoNodeText("upload.videoOnly"));
        }
        if (_0x151db2 && !_0x20f4c3["type"]["startsWith"]('image/')) {
          throw new Error(aigenVideoNodeText('upload.imageOnly'));
        }
        if (!_0xde7689 && !_0x151db2) {
          throw new Error(aigenVideoNodeText('upload.unsupportedAsset'));
        }
        const _0x3553e3 = _0xde7689 ? 'source-video' : "source-image";
        let _0x4b77bb = 0x12c;
        let _0x2e3df9 = 0x12c;
        if (_0xde7689) {
          const _0x252725 = document["createElement"]("video");
          _0x252725["src"] = URL["createObjectURL"](_0x20f4c3);
          await new Promise(_0x91f8e4 => {
            _0x252725["onloadedmetadata"] = () => {
              const _0x3d378d = _0x252725['videoWidth'] || 0x1a4;
              const _0x3aa4be = _0x252725["videoHeight"] || 0x104;
              const _0xe4239f = Math["min"](_0x3d378d, _0x3aa4be);
              const _0x4a146a = 0x12c / (_0xe4239f || 0x1);
              _0x4b77bb = Math["round"](_0x3d378d * _0x4a146a);
              _0x2e3df9 = Math["round"](_0x3aa4be * _0x4a146a);
              URL["revokeObjectURL"](_0x252725["src"]);
              _0x91f8e4();
            };
            _0x252725["onerror"] = () => {
              URL["revokeObjectURL"](_0x252725["src"]);
              _0x91f8e4();
            };
          });
        } else {
          if (_0x151db2) {
            const _0x124d8c = new Image();
            await new Promise(_0xb3ae8 => {
              _0x124d8c['onload'] = () => {
                const _0x198dfb = _0x124d8c['naturalWidth'] || 0x104;
                const _0x22b128 = _0x124d8c["naturalHeight"] || 0x104;
                const _0x1464eb = Math['min'](_0x198dfb, _0x22b128);
                const _0x3e86fa = 0x12c / (_0x1464eb || 0x1);
                _0x4b77bb = Math["round"](_0x198dfb * _0x3e86fa);
                _0x2e3df9 = Math["round"](_0x22b128 * _0x3e86fa);
                _0xb3ae8();
              };
              _0x124d8c['onerror'] = () => {
                _0xb3ae8();
              };
              _0x124d8c['src'] = _0x238c1f;
            });
          }
        }
        const {
          spacing: _0x5b0e19,
          direction: _0x42f317,
          avoidOverlap: _0x467fa3
        } = getNodeSpawnPrefs();
        const _0x5eb612 = _0x42f317 === "down" ? 'down' : 'left';
        const _0x157b03 = Number(_0x14580c['x']) || 0x0;
        const _0x1d0225 = Number(_0x14580c['y']) || 0x0;
        const _0x52f575 = Number(_0x14580c['width']) || 0x168;
        const _0x2e2cd7 = Number(_0x14580c["height"]) || 0x168;
        const _0x45bebf = _0x157b03 - _0x5b0e19 - _0x4b77bb;
        const _0x2de10b = _0x5eb612 === "down" ? _0x1d0225 + _0x2e2cd7 + _0x5b0e19 : _0x1d0225 + Math['round']((_0x2e2cd7 - _0x2e3df9) / 0x2);
        const _0x566ce5 = _0x467fa3 ? findAvailablePosition(_0x5dbfb0["nodes"] || {}, _0x45bebf, _0x2de10b, _0x4b77bb, _0x2e3df9, _0x5b0e19, _0x5eb612) : {
          'x': _0x45bebf,
          'y': _0x2de10b
        };
        const _0x237db1 = getFixedInputSlotsToReplace(_0x14580c, _0x18c62d);
        a373_0x4fa370["batch"](() => {
          const _0x26d9c3 = a373_0x4fa370["getIncomingEdges"](this["nodeId"]);
          for (const _0x3268e2 of _0x26d9c3) {
            if (_0x237db1["has"](String(_0x3268e2?.["refSlot"] || ''))) {
              a373_0x4fa370["removeEdge"](_0x3268e2['id']);
            }
          }
          const _0x3a57ad = generateId("node");
          const _0x33ad6e = {
            'id': _0x3a57ad,
            'type': _0x3553e3,
            'x': _0x566ce5['x'],
            'y': _0x566ce5['y'],
            'width': _0x4b77bb,
            'height': _0x2e3df9,
            'src': _0x238c1f,
            'localPath': _0x11df47,
            'assetId': _0x565c5b["assetId"] || '',
            'originalLocalPath': _0x565c5b["originalLocalPath"] || _0x565c5b["localPath"] || '',
            'posterLocalPath': _0x565c5b["posterLocalPath"] || '',
            'waveformLocalPath': _0x565c5b['waveformLocalPath'] || '',
            'derivativeStatus': _0x565c5b["derivativeStatus"] || _0x565c5b["status"] || '',
            'mediaTaskId': _0x565c5b["mediaTaskId"] || '',
            'mediaTaskKind': _0x565c5b['mediaTaskKind'] || '',
            'mediaTaskStatus': _0x565c5b["mediaTaskStatus"] || '',
            'mediaTaskProgress': Number(_0x565c5b["mediaTaskProgress"] || 0x0) || 0x0,
            'mediaTaskError': _0x565c5b['mediaTaskError'] || '',
            'fileName': _0x565c5b["filename"] || _0x20f4c3["name"] || '',
            'thumbUrl': _0x565c5b['posterUrl'] || _0x565c5b["thumbUrl"] || null,
            ...(!_0xde7689 ? buildCanvasLocalImageFields(_0x565c5b, {
              'includeSrc': !![]
            }) : {})
          };
          if (_0xde7689) {
            _0x33ad6e['name'] = _0x20f4c3["name"] || (_0x18c62d === "videoMask" ? aigenVideoNodeText("inputNames.maskVideo") : aigenVideoNodeText('inputNames.sourceVideo'));
          }
          removeCoveredAssetInputRefForConnection({
            'targetId': this["nodeId"],
            'sourceKind': _0xde7689 ? 'video' : "image",
            'refSlot': _0x18c62d
          });
          a373_0x4fa370["addNode"](_0x33ad6e);
          a373_0x4fa370['addEdge']({
            'id': generateId("edge"),
            'sourceId': _0x3a57ad,
            'targetId': this["nodeId"],
            'refSlot': _0x18c62d
          });
          a373_0x4fa370["setSelectedNodes"]([this["nodeId"]]);
        });
        this["_updateSubmitButtonState"]();
        if (_0xde7689) {
          try {
            const _0x124acb = localPathToUrl(_0x11df47);
            const _0x32e1a7 = await fetchVideoFirstFrameThumbFromServer(_0x124acb);
            const _0x5e2739 = String(_0x32e1a7?.["url"] || '')["trim"]();
            if (_0x5e2739) {
              const _0x4e0916 = a373_0x4fa370['getState']()['nodes']?.[newNodeId];
              if (_0x4e0916) {
                a373_0x4fa370["updateNodeData"](newNodeId, {
                  'thumbUrl': _0x5e2739,
                  'videoThumbSrc': _0x124acb
                });
              }
            }
          } catch {}
        }
        if (!_0xde7689) {}
      } catch (_0x2e5952) {
        window["showToast"]?.(_0x2e5952?.['message'] || aigenVideoNodeText("upload.failedRetry"), "error");
      } finally {
        this["_v5RefUploadInput"]["value"] = '';
        this['_v5RefUploadSlot'] = '';
        this["_v5RefUploadAnchorNodeId"] = '';
      }
    });
    this["_ltxRefUploadInput"] = document['createElement']("input");
    this["_ltxRefUploadInput"]["type"] = 'file';
    this["_ltxRefUploadInput"]["accept"] = "*/*";
    this["_ltxRefUploadInput"]["style"]['display'] = 'none';
    _0x52ed4d["appendChild"](this["_ltxRefUploadInput"]);
    this["_ltxRefUploadInput"]["addEventListener"]("change", async _0x42720d => {
      const _0x33cd33 = _0x42720d['target']['files']?.[0x0];
      const _0x3d7c72 = this["_ltxRefUploadSlot"];
      const _0x259778 = this["_ltxRefUploadAnchorNodeId"];
      if (!_0x33cd33 || !_0x3d7c72 || !_0x259778) {
        this["_ltxRefUploadInput"]["value"] = '';
        return;
      }
      try {
        const _0x14609a = window['currentProjectId'] || 'default_v2_project';
        const _0x404d14 = await uploadFile(_0x33cd33, _0x14609a);
        const _0x425187 = _0x404d14?.["url"] || '';
        if (!_0x425187) {
          throw new Error(aigenVideoNodeText("upload.noFileUrl"));
        }
        const _0x131b22 = a373_0x4fa370["getState"]();
        const _0x1495e1 = _0x131b22['nodes']?.[_0x259778];
        if (!_0x1495e1) {
          throw new Error(aigenVideoNodeText('upload.anchorMissing'));
        }
        const _0x243a9f = pickResultLocalPath(_0x404d14) || urlToLocalPath(_0x425187);
        const _0x336bbe = getFixedInputSlotKind(_0x1495e1, _0x3d7c72);
        const _0x286237 = _0x336bbe === "image";
        const _0x277eff = _0x336bbe === "video";
        const _0x1fb2f7 = _0x336bbe === 'audio';
        if (_0x286237 && !_0x33cd33["type"]["startsWith"]("image/")) {
          throw new Error(aigenVideoNodeText('upload.imageOnly'));
        }
        if (_0x277eff && !_0x33cd33["type"]["startsWith"]("video/")) {
          throw new Error(aigenVideoNodeText("upload.videoOnly"));
        }
        if (_0x1fb2f7 && !_0x33cd33["type"]["startsWith"]('audio/')) {
          throw new Error(aigenVideoNodeText("upload.audioOnly"));
        }
        if (!_0x286237 && !_0x277eff && !_0x1fb2f7) {
          throw new Error(aigenVideoNodeText("upload.unsupportedAsset"));
        }
        const _0x4c3a21 = _0x1fb2f7 ? "source-audio" : _0x277eff ? "source-video" : "source-image";
        let _0x29b593 = _0x1fb2f7 ? 0x140 : _0x277eff ? 0x168 : 0x12c;
        let _0x3cc819 = _0x1fb2f7 ? 0x8c : _0x277eff ? 0xdc : 0x12c;
        if (_0x286237) {
          const _0x23714a = new Image();
          await new Promise(_0x1ba876 => {
            _0x23714a["onload"] = () => {
              const _0x4570c3 = _0x23714a['naturalWidth'] || 0x104;
              const _0x583fca = _0x23714a["naturalHeight"] || 0x104;
              const _0x2d8cd1 = Math['min'](_0x4570c3, _0x583fca);
              const _0xe5c5 = 0x12c / (_0x2d8cd1 || 0x1);
              _0x29b593 = Math["round"](_0x4570c3 * _0xe5c5);
              _0x3cc819 = Math["round"](_0x583fca * _0xe5c5);
              _0x1ba876();
            };
            _0x23714a["onerror"] = () => _0x1ba876();
            _0x23714a["src"] = _0x425187;
          });
        }
        const {
          spacing: _0x13e41d,
          direction: _0x43c0a3,
          avoidOverlap: _0x42ca93
        } = getNodeSpawnPrefs();
        const _0x5a699a = _0x43c0a3 === "down" ? 'down' : "left";
        const _0x47fbac = Number(_0x1495e1['x']) || 0x0;
        const _0x12e3b2 = Number(_0x1495e1['y']) || 0x0;
        const _0x42ead4 = Number(_0x1495e1["width"]) || 0x168;
        const _0x18000e = Number(_0x1495e1["height"]) || 0x168;
        const _0x580fe0 = _0x47fbac - _0x13e41d - _0x29b593;
        const _0x26fb5e = _0x5a699a === "down" ? _0x12e3b2 + _0x18000e + _0x13e41d : _0x12e3b2 + Math["round"]((_0x18000e - _0x3cc819) / 0x2);
        const _0x70429d = _0x42ca93 ? findAvailablePosition(_0x131b22["nodes"] || {}, _0x580fe0, _0x26fb5e, _0x29b593, _0x3cc819, _0x13e41d, _0x5a699a) : {
          'x': _0x580fe0,
          'y': _0x26fb5e
        };
        const _0x1240ce = getFixedInputSlotsToReplace(_0x1495e1, _0x3d7c72);
        a373_0x4fa370['batch'](() => {
          const _0x12e67b = a373_0x4fa370["getIncomingEdges"](this["nodeId"]);
          for (const _0x1c8c1a of _0x12e67b) {
            if (_0x1240ce['has'](String(_0x1c8c1a?.["refSlot"] || ''))) {
              a373_0x4fa370["removeEdge"](_0x1c8c1a['id']);
            }
          }
          const _0x2c15c2 = generateId('node');
          const _0x5cea4e = {
            'id': _0x2c15c2,
            'type': _0x4c3a21,
            'x': _0x70429d['x'],
            'y': _0x70429d['y'],
            'width': _0x29b593,
            'height': _0x3cc819,
            'src': _0x425187,
            'localPath': _0x243a9f,
            'assetId': _0x404d14["assetId"] || '',
            'originalLocalPath': _0x404d14["originalLocalPath"] || _0x404d14['localPath'] || '',
            'posterLocalPath': _0x404d14['posterLocalPath'] || '',
            'waveformLocalPath': _0x404d14["waveformLocalPath"] || '',
            'derivativeStatus': _0x404d14["derivativeStatus"] || _0x404d14["status"] || '',
            'mediaTaskId': _0x404d14['mediaTaskId'] || '',
            'mediaTaskKind': _0x404d14["mediaTaskKind"] || '',
            'mediaTaskStatus': _0x404d14['mediaTaskStatus'] || '',
            'mediaTaskProgress': Number(_0x404d14["mediaTaskProgress"] || 0x0) || 0x0,
            'mediaTaskError': _0x404d14["mediaTaskError"] || '',
            'fileName': _0x404d14["filename"] || _0x33cd33["name"] || ''
          };
          if (!_0x1fb2f7 && !_0x277eff) {
            Object["assign"](_0x5cea4e, buildCanvasLocalImageFields(_0x404d14, {
              'includeSrc': !![]
            }));
          }
          _0x1fb2f7 && (_0x5cea4e["name"] = _0x33cd33["name"] || aigenVideoNodeText("inputNames.sourceAudio"));
          _0x277eff && (_0x5cea4e["name"] = _0x33cd33["name"] || aigenVideoNodeText("inputNames.sourceVideo"));
          removeCoveredAssetInputRefForConnection({
            'targetId': this["nodeId"],
            'sourceKind': _0x1fb2f7 ? "audio" : _0x277eff ? "video" : "image",
            'refSlot': _0x3d7c72
          });
          a373_0x4fa370["addNode"](_0x5cea4e);
          a373_0x4fa370["addEdge"]({
            'id': generateId("edge"),
            'sourceId': _0x2c15c2,
            'targetId': this["nodeId"],
            'refSlot': _0x3d7c72
          });
          a373_0x4fa370['setSelectedNodes']([this['nodeId']]);
        });
        this["_updateSubmitButtonState"]();
      } catch (_0x4fcde8) {
        window["showToast"]?.(_0x4fcde8?.["message"] || aigenVideoNodeText("upload.failedRetry"), "error");
      } finally {
        this['_ltxRefUploadInput']["value"] = '';
        this['_ltxRefUploadSlot'] = '';
        this["_ltxRefUploadAnchorNodeId"] = '';
      }
    });
    this["refBarEl"]["addEventListener"]('click', _0x38d0c3 => {
      const _0xbc3c55 = _0x38d0c3['target']["closest"](".rh-v5-ref-box");
      if (!_0xbc3c55) {
        return;
      }
      const _0x16553e = a373_0x4fa370["getState"]()["nodes"]?.[this['nodeId']];
      const _0x9c0c42 = getFixedInputSlotConfigFromManifest(_0x16553e || {});
      if (!_0x9c0c42) {
        return;
      }
      const _0x365e8b = _0x38d0c3['target']["closest"](".ref-thumb-delete");
      if (_0x365e8b) {
        _0x38d0c3["stopPropagation"]();
        _0x38d0c3["preventDefault"]();
        const _0x50d382 = _0xbc3c55['dataset']["edgeId"] || '';
        _0x50d382 && (a373_0x4fa370['removeEdge'](_0x50d382), this["_updateSubmitButtonState"]());
        return;
      }
      _0x38d0c3["stopPropagation"]();
      _0x38d0c3["preventDefault"]();
      const _0x504d84 = _0xbc3c55["dataset"]["slot"] || '';
      if (!_0x504d84) {
        return;
      }
      const _0x213749 = _0x9c0c42["slotKindById"]?.[_0x504d84] || '';
      if (!_0x213749 || !_0x9c0c42["visibleSlots"]["includes"](_0x504d84)) {
        return;
      }
      const _0x19fad0 = getFixedInputAcceptForKind(_0x213749);
      if (_0x213749 === "audio") {
        this["_ltxRefUploadSlot"] = _0x504d84;
        this["_ltxRefUploadAnchorNodeId"] = this["nodeId"];
        this["_ltxRefUploadInput"]['accept'] = _0x19fad0;
        this["_ltxRefUploadInput"]["click"]();
        return;
      }
      this['_v5RefUploadSlot'] = _0x504d84;
      this["_v5RefUploadAnchorNodeId"] = this["nodeId"];
      this['_v5RefUploadInput']["accept"] = _0x19fad0;
      this["_v5RefUploadInput"]["click"]();
    });
    const {
      inputWrap: _0x19c009,
      promptEl: _0x809d96
    } = createVideoPromptEditorElements({
      'documentObject': document,
      'placeholder': aigenVideoNodeText('prompt.placeholder')
    });
    this["_promptInputWrap"] = _0x19c009;
    this["promptEl"] = _0x809d96;
    this["_flushPromptHtmlCommit"] = () => flushPromptHtmlCommit(this);
    this["promptEl"]["addEventListener"]("input", _0x1e4faa => {
      schedulePromptHtmlCommit(this);
      this['_checkAtTrigger'](_0x1e4faa);
      checkSlashTrigger(_0x1e4faa, {
        'promptEl': this["promptEl"],
        'nodeType': this['_data']["type"],
        'nodeId': this['nodeId'],
        'onGenerate': (_0x1c6c44, _0x1f2767) => this["_onGenerate"](_0x1c6c44, _0x1f2767)
      });
      if (shouldSkipPromptTriggerForBulkInput(_0x1e4faa)) {
        return;
      }
      _syncEdgesOrderFromPills(this);
      this["_updateSubmitButtonState"]();
    });
    this['promptEl']["addEventListener"]("blur", () => {
      flushPromptHtmlCommit(this);
    });
    this["promptEl"]['addEventListener']('mouseover', _0x39b862 => {
      _handlePillHover(_0x39b862, this);
    });
    this["promptEl"]["addEventListener"]("mouseout", _0xd2b613 => {
      _handlePillOut(_0xd2b613, this);
    });
    this['promptEl']["addEventListener"]("keydown", _0x4a246b => {
      if (handlePromptSelectAll(this, _0x4a246b)) {
        return;
      }
      if (_handleMentionMenuKeyboard(_0x4a246b)) {
        return;
      }
      if (handleSlashKeyboardNavigation(_0x4a246b)) {
        return;
      }
      if (shouldSubmitPromptByKeyboard(_0x4a246b)) {
        _0x4a246b['preventDefault']();
        flushPromptHtmlCommit(this);
        this['btnEl']?.['click']();
        return;
      }
      _handlePillKeyboard(this, _0x4a246b);
    });
    this["promptEl"]['addEventListener']('paste', _0x2ebee4 => {
      handlePromptPaste(this, _0x2ebee4);
    });
    _0x52ed4d["appendChild"](_0x19c009);
    this["_promptPresetTrigger"] = createPromptPresetTriggerController({
      'panel': _0x52ed4d,
      'getPromptEl': () => this["promptEl"],
      'getNodeType': () => this["_data"]?.["type"],
      'getNodeId': () => this["nodeId"],
      'onGenerate': (_0x49f125, _0x37d251) => this["_onGenerate"](_0x49f125, _0x37d251)
    });
    this["_unsubscribeLocale"]?.();
    this["_unsubscribeLocale"] = onLocaleChange(() => this["_syncLocaleTexts"]());
    initializeVideoNodePromptDetailsOnMount(this, {
      'sanitizePromptHtml': sanitizePromptHtml
    });
    this["_data"] = syncVideoNodeFixedInputSummary({
      'nodeId': this["nodeId"],
      'nodeData': this["_data"],
      'promptEl': this["promptEl"],
      'syncStore': ![]
    })["nodeData"] || this["_data"];
    const _0x5efbd8 = document["createElement"]("div");
    _0x5efbd8['className'] = "prompt-panel-footer";
    this["footerEl"] = _0x5efbd8;
    renderInitialVideoNodeFooter(this, _0x5efbd8);
    _0x52ed4d["appendChild"](_0x5efbd8);
    _0x27d271["appendChild"](_0x52ed4d);
    attachNodePromptExpansion(this, {
      'panel': _0x52ed4d
    });
    isSegmentRetakeEditing(this['_data']) && mountSegmentRetakeController(this, {
      'root': _0x27d271,
      'promptPanel': _0x52ed4d
    });
    this["_renderRefBarWhenMediaReady"]();
    !this["_rendererDetailsDeferred"] && this["_syncInitialUpdateSignatures"](this["_data"]);
    this["_assetMentionRegistryUnsubscribe"]?.();
    this["_assetMentionRegistryUnsubscribe"] = subscribeAssetMentionRegistry(() => {
      if (this['_assetMentionRegistryRefreshPending']) {
        return;
      }
      this['_assetMentionRegistryRefreshPending'] = !![];
      queueMicrotask(() => {
        this["_assetMentionRegistryRefreshPending"] = ![];
        if (!a373_0x4fa370['getState']()["nodes"]?.[this['nodeId']]) {
          return;
        }
        if (this["_rendererDetailsDeferred"]) {
          return;
        }
        _rehydratePromptPills(this);
        this["_renderRefBar"]();
        this["_updateSubmitButtonState"]();
      });
    });
    const _0x54b917 = _0x27d271['querySelector'](".node-floating-toolbar");
    if (this["_rendererDetailsDeferred"]) {
      this["_deferredToolbarEl"] = _0x54b917;
    } else {
      this["_videoToolbarCleanup"] = bindVideoToolbarEvents(_0x54b917, this["_data"]);
    }
    _0x1b0487 && _0x1b0487["addEventListener"]("pointerdown", _0x144d82 => {
      const _0x2f0879 = a373_0x4fa370['getStateRaw']()['ui']?.["imageVideoNodeResizeEnabled"] === !![];
      const _0x1fb2c9 = document["getElementById"]('v2-wrap')?.["classList"]["contains"]("v2-media-node-resize-enabled");
      if (!(_0x2f0879 && _0x1fb2c9)) {
        return;
      }
      if (_0x144d82['button'] !== 0x0) {
        return;
      }
      startNodeResizePreview({
        'event': _0x144d82,
        'nodeId': this['nodeId'],
        'getNode': () => a373_0x4fa370['getStateRaw']()["nodes"]?.[this['nodeId']] || this["_data"],
        'getViewport': () => a373_0x4fa370["getStateRaw"]()['viewport'],
        'resolveSize': ({
          startWidth: _0x56f08e,
          startHeight: _0x2afae2,
          dx: _0xe3c2c0,
          dy: _0x137d17
        }) => {
          const _0x4f0934 = _0x56f08e / _0x2afae2;
          const _0x50eb95 = Math['max'](_0xe3c2c0 / _0x56f08e, _0x137d17 / _0x2afae2);
          const _0x4a5329 = Math["max"](AI_VIDEO_MIN_SIZE / _0x56f08e, AI_VIDEO_MIN_SIZE / _0x2afae2);
          const _0x18fbee = Math["max"](_0x4a5329, 0x1 + _0x50eb95);
          const _0x55ab00 = Math["max"](AI_VIDEO_MIN_SIZE, Math['round'](_0x56f08e * _0x18fbee));
          const _0x36d71a = Math["max"](AI_VIDEO_MIN_SIZE, Math['round'](_0x55ab00 / _0x4f0934));
          return {
            'width': _0x55ab00,
            'height': _0x36d71a
          };
        },
        'buildFinalPatch': ({
          startNode: _0x280393,
          startSize: _0x394fe8,
          finalSize: _0x22719f
        }) => {
          const _0x2b6225 = Math["round"](Number(_0x394fe8?.["width"]) || 0x0) !== Math['round'](Number(_0x22719f?.['width']) || 0x0) || Math["round"](Number(_0x394fe8?.['height']) || 0x0) !== Math["round"](Number(_0x22719f?.['height']) || 0x0);
          return {
            ...(_0x280393?.["needsAutoResize"] ? {
              'needsAutoResize': ![]
            } : {}),
            ...(_0x2b6225 ? {
              [GENERATION_MANUAL_DISPLAY_SIZE_FIELD]: !![]
            } : {})
          };
        },
        'applyPatch': _0x51876a => a373_0x4fa370["updateNodeData"](this["nodeId"], _0x51876a),
        'commit': commit
      });
    });
    this["_attachBtnIcon"] = this["refBarEl"]['querySelector']('.btn-icon');
    if (!this["_rendererDetailsDeferred"]) {
      this["_updateSubmitButtonState"]();
    }
    return _0x27d271;
  }
  ['_initPromptPills']() {
    _rehydratePromptPills(this);
  }
  ["_syncPromptBoxSizeFromData"](_0x23e99f = this['_data']) {
    syncPromptBoxSizeFromData(this, _0x23e99f);
  }
  ['_setupPromptBoxResize']() {
    setupPromptBoxResize(this, {
      'store': a373_0x4fa370,
      'getStateSnapshot': () => typeof a373_0x4fa370['getStateRaw'] === 'function' ? a373_0x4fa370["getStateRaw"]() : a373_0x4fa370['getState']()
    });
  }
  ["_syncPromptInputVisibility"](_0x10849f = this["_data"]) {
    if (!this["_promptInputWrap"]) {
      return !![];
    }
    const _0x5875ce = typeof this["_resolveModelExecution"] === "function" ? this["_resolveModelExecution"](_0x10849f?.["model"], _0x10849f?.["provider"]) : null;
    const _0x5d0f9a = shouldShowVideoPromptInput(_0x5875ce?.["modelManifest"]);
    this["_promptInputWrap"]["hidden"] !== !_0x5d0f9a && (this["_promptInputWrap"]["hidden"] = !_0x5d0f9a);
    this["_promptInputWrap"]["classList"]?.["contains"]?.("is-hidden-by-model") !== !_0x5d0f9a && this["_promptInputWrap"]["classList"]?.["toggle"]("is-hidden-by-model", !_0x5d0f9a);
    if (this['promptEl']) {
      const _0x41aa28 = _0x5d0f9a ? "true" : "false";
      const _0x3ea560 = _0x5d0f9a ? "false" : "true";
      this["promptEl"]["contentEditable"] !== _0x41aa28 && (this["promptEl"]["contentEditable"] = _0x41aa28);
      this["promptEl"]['getAttribute']?.("aria-hidden") !== _0x3ea560 && this["promptEl"]["setAttribute"]?.("aria-hidden", _0x3ea560);
      !_0x5d0f9a && document["activeElement"] === this['promptEl'] && this["promptEl"]['blur']?.();
    }
    return _0x5d0f9a;
  }
  ["_buildFooterSig"](_0x3da08e = this["_data"]) {
    const _0x4a633d = typeof this["_isDreaminaVideoNode"] === "function" && this["_isDreaminaVideoNode"](_0x3da08e) ? (_0x3da08e["dreaminaRouteMode"] || '') + '|' + (this["_getDreaminaReferenceSummary"]?.(_0x3da08e)?.["signature"] || '') : '';
    return (_0x3da08e["model"] || '') + '|' + (_0x3da08e["provider"] || '') + '|' + (_0x3da08e["rhSpecialMode"] || '') + '|' + (_0x3da08e["rhBerniniInputMode"] || '') + '|' + _0x4a633d + '|' + (_0x3da08e?.["segmentRetake"]?.["phase"] || '') + '|' + buildUiSchemaVisibilitySignature(_0x3da08e['model'], _0x3da08e);
  }
  ["refreshModelRegistryUi"]() {
    if (this["_rendererDetailsDeferred"] === !![] || !this['footerEl']) {
      return ![];
    }
    this["_renderFooter"](this["footerEl"]);
    this["_lastFooterSig"] = this["_buildFooterSig"](this['_data']);
    this["_updateSubmitButtonState"]();
    return !![];
  }
  ["_buildRefBarSignatures"](_0x40f865 = this['_data'], _0x15d34a = null) {
    let _0x4d6ec8 = a373_0x4fa370["getIncomingEdges"](this["nodeId"]);
    _0x15d34a && (_0x4d6ec8 = _0x4d6ec8["filter"](_0x116d06 => _0x116d06?.['targetId'] === this["nodeId"]));
    const _0x58b4de = readStoreState()['nodes'] || {};
    const _0x235c3f = _0x4d6ec8["map"](_0x1620f7 => {
      const _0x570d03 = _0x58b4de?.[_0x1620f7["sourceId"]] || null;
      const _0x1a06e7 = typeof this['_getRefSourceStateKey'] === "function" ? this["_getRefSourceStateKey"](_0x570d03, _0x1620f7) : '';
      return _0x1620f7['id'] + ':' + _0x1620f7["sourceId"] + ':' + (_0x1620f7["refSlot"] || '') + ':' + (_0x1620f7["sourceMediaKey"] || '') + ':' + _0x1a06e7;
    })["join"]('|');
    const _0x31765f = _0x15d34a ? String(_0x15d34a["visibilityLayoutKey"] || _0x15d34a["visibleSlots"]?.['join']('|') || '') : '';
    return {
      'inEdges': _0x4d6ec8,
      'sig': _0x235c3f,
      'refModeSig': (_0x40f865?.["model"] || '') + '|' + (_0x40f865?.["provider"] || '') + '|' + _0x31765f,
      'specialModeSig': String(_0x40f865?.["rhSpecialMode"] || ''),
      'subtractSubjectSig': String(_0x40f865?.["rhSubtractSubject"] || '')
    };
  }
  ['_syncInitialUpdateSignatures'](_0x3249fe = this['_data']) {
    const _0x37190c = syncVideoNodeFixedInputSummary({
      'nodeId': this["nodeId"],
      'nodeData': _0x3249fe || {},
      'promptEl': this["promptEl"],
      'syncStore': ![]
    });
    const _0x5542a9 = _0x37190c['nodeData'] || _0x3249fe || {};
    const _0x256fce = _0x37190c["fixedInputConfig"];
    const _0x3f5619 = this['_buildRefBarSignatures'](_0x5542a9, _0x256fce);
    const _0x56c997 = this["_buildFooterSig"](_0x5542a9);
    const _0x39b651 = typeof this["_getRhVideoAdvancedSchemaNodeData"] === 'function' ? this['_getRhVideoAdvancedSchemaNodeData'](_0x5542a9) : _0x5542a9;
    this["_data"] = _0x5542a9;
    this["_lastVideoViewSig"] = buildVideoNodeVideoViewSig(_0x5542a9);
    this['_lastHasInputConnections'] = _0x3f5619["inEdges"]["length"] > 0x0;
    this['_lastFooterSig'] = _0x56c997;
    this["_lastEdgeSig"] = _0x3f5619["sig"];
    this["_lastRefModeSig"] = _0x3f5619["refModeSig"];
    this["_lastSpecialModeSig"] = _0x3f5619["specialModeSig"];
    this['_lastSubtractSubjectSig'] = _0x3f5619["subtractSubjectSig"];
    this["_lastPromptUiSig"] = buildVideoNodePromptUiSig(_0x5542a9);
    this['_lastPromptBoxSizeSig'] = buildVideoNodePromptBoxSizeSig(_0x5542a9);
    if (_0x5542a9["prompt"] !== undefined) {
      this['_lastPromptContentSig'] = String(_0x5542a9["prompt"] || '');
    }
    this['_lastSubmitButtonSig'] = buildVideoNodeSubmitButtonSig(_0x5542a9, _0x3f5619["sig"], {
      'rhCancelInFlight': this["_rhCancelInFlight"]
    });
    this["_lastFooterControlSig"] = buildVideoNodeFooterControlSig(_0x39b651, _0x56c997);
  }
  ["update"](_0x42a3b9) {
    const _0x5f0127 = () => readStoreState()?.["nodes"]?.[this["nodeId"]] || _0x42a3b9;
    _0x42a3b9 = _0x5f0127() || _0x42a3b9;
    typeof this["_normalizeDreaminaNodeData"] === "function" ? this["_data"] = this["_normalizeDreaminaNodeData"](_0x42a3b9, {
      'syncStore': !![]
    }) || _0x42a3b9 : this["_data"] = _0x42a3b9;
    _0x42a3b9 = _0x5f0127() || this["_data"];
    this["_data"] = _0x42a3b9;
    _0x42a3b9 = this["_data"];
    const _0x23860b = createVideoNodeUpdatePerf();
    typeof this["_syncMutedStateFromNodeData"] === "function" && this["_syncMutedStateFromNodeData"](_0x42a3b9);
    this['_syncNoResultClass']();
    if (shouldShowGenerationBusyUi(_0x42a3b9)) {
      this["_isGenerating"] = !![];
      if (this["previewEl"]) {
        startLoading(this["previewEl"]);
      }
    } else {
      if (isTerminalGenerationUiState(_0x42a3b9)) {
        this["_isGenerating"] = ![];
        stopPreviewNodeLoading(this["nodeId"]);
        if (this["previewEl"]) {
          stopLoading(this['previewEl']);
        }
      }
    }
    _0x23860b?.["mark"]("state");
    const _0x462185 = syncVideoNodeFixedInputSummary({
      'nodeId': this['nodeId'],
      'nodeData': _0x42a3b9,
      'promptEl': this['promptEl'],
      'syncStore': !![]
    });
    _0x42a3b9 = _0x462185["nodeData"] || _0x42a3b9;
    this["_data"] = _0x42a3b9;
    const _0xa126df = _0x462185["fixedInputConfig"];
    const _0x271522 = (_0xa126df?.['slotOrderByType']?.["video"] || [])["includes"]('sourceVideo') && (_0xa126df?.["slotOrderByType"]?.["image"] || [])["includes"]("refImage");
    let _0x1055b3 = _0x462185["inEdges"] || a373_0x4fa370['getIncomingEdges'](this['nodeId']);
    const _0x3bfccc = _0x1055b3["length"] > 0x0;
    const _0x392498 = buildVideoNodeVideoViewSig(_0x42a3b9);
    const _0x432133 = _0x392498 !== this["_lastVideoViewSig"];
    this['_lastVideoViewSig'] = _0x392498;
    const _0x1a0c72 = _0x3bfccc !== this['_lastHasInputConnections'];
    this["_lastHasInputConnections"] = _0x3bfccc;
    !isSegmentRetakeEditing(_0x42a3b9) && (_0x432133 || _0x1a0c72) && this["_loadVideoWhenMediaReady"]();
    typeof this['_maybeResumeDreaminaTaskImpl'] === "function" && this["_maybeResumeDreaminaTaskImpl"]();
    typeof this["_maybeResumeRunningHubTaskImpl"] === 'function' && this['_maybeResumeRunningHubTaskImpl']();
    typeof this["_maybeResumeAsyncTaskImpl"] === "function" && this["_maybeResumeAsyncTaskImpl"]();
    _0x23860b?.['mark']("media-task");
    const _0x121835 = readStoreState()["nodes"] || {};
    const _0x247a21 = _0x1055b3["map"](_0x45ceb3 => {
      const _0x86762c = _0x121835?.[_0x45ceb3?.["sourceId"]] || null;
      const _0x5b5d03 = getGenerationRatioMediaSize(_0x86762c, _0x45ceb3, {
        'includeNodeFrame': !![]
      });
      return [_0x45ceb3?.['id'], _0x45ceb3?.["sourceId"], _0x45ceb3?.['refSlot'], _0x45ceb3?.["sourceMediaKey"], _0x86762c?.["_bizRev"], _0x86762c?.["thumbId"], _0x86762c?.["mainImageIndex"], _0x86762c?.["mainVideoIndex"], _0x5b5d03?.["width"], _0x5b5d03?.["height"], _0x86762c?.["localPath"], _0x86762c?.["imageUrl"], _0x86762c?.["videoUrl"]]["map"](_0x10703a => _0x10703a ?? '')['join'](':');
    })['join']('|');
    const _0x34e2a1 = _0x16f652 => {
      const _0x2d3424 = String(_0x16f652 || '')["trim"]()["toLowerCase"]();
      return !_0x2d3424 || _0x2d3424 === "自适应" || _0x2d3424 === "auto" || _0x2d3424 === "adaptive";
    };
    const _0xaf8a39 = _0x5915f2 => {
      const _0x3b5e9b = typeof this["_getDreaminaEffectiveNodeData"] === "function" ? this["_getDreaminaEffectiveNodeData"](_0x5915f2 || {}) : _0x5915f2 || {};
      const _0x3ca3f7 = _0x3b5e9b?.["generationParams"];
      return _0x3ca3f7 && typeof _0x3ca3f7 === 'object' && !Array['isArray'](_0x3ca3f7) && Object["prototype"]["hasOwnProperty"]['call'](_0x3ca3f7, 'aspectRatio') ? _0x3ca3f7['aspectRatio'] : _0x3b5e9b?.["aspectRatio"];
    };
    if (this['_lastAdaptiveEdgeSig'] !== null && _0x247a21 !== this["_lastAdaptiveEdgeSig"]) {
      const _0x2d23cc = _0xaf8a39(this["_data"]);
      _0x34e2a1(_0x2d23cc) && typeof this["_runAdaptiveRatio"] === "function" && setTimeout(() => {
        if (readStoreState()["nodes"][this["nodeId"]]) {
          this["_runAdaptiveRatio"]();
        }
      }, 0x32);
    }
    this["_lastAdaptiveEdgeSig"] = _0x247a21;
    _0x42a3b9 = _0x5f0127() || this["_data"] || _0x42a3b9;
    this["_data"] = _0x42a3b9;
    const _0xd46d75 = this["_buildFooterSig"](_0x42a3b9);
    const _0x541c02 = this["_lastFooterSig"];
    let _0x414a57 = ![];
    this["_rendererDetailsDeferred"] !== !![] && this["footerEl"] && _0xd46d75 !== _0x541c02 && (_0x23860b?.["detail"]("footerSigFrom", _0x541c02), _0x23860b?.["detail"]("footerSigTo", _0xd46d75), this["_lastFooterSig"] = _0xd46d75, this["_renderFooter"](this["footerEl"]), _0x42a3b9 = _0x5f0127() || this['_data'] || _0x42a3b9, this["_data"] = _0x42a3b9, _0x414a57 = !![]);
    if (_0x414a57) {
      const _0x97cce0 = readStoreState()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      _0x34e2a1(_0xaf8a39(_0x97cce0)) && typeof this["_runAdaptiveRatio"] === "function" && setTimeout(() => {
        if (readStoreState()['nodes'][this["nodeId"]]) {
          this["_runAdaptiveRatio"]();
        }
      }, 0x32);
    }
    _0x23860b?.['mark']("footer-render");
    const _0x279c47 = readStoreState()['pickConnectMode'];
    if (this["_placeholderEl"]) {
      const _0x29b351 = this["_placeholderEl"]["querySelector"](".placeholder-icon-svg");
      if (_0x29b351) {
        if (_0x279c47?.['active'] && _0x279c47["sourceNodeId"] === this["nodeId"]) {
          _0x29b351["classList"]['add']("is-pick-connecting");
        } else {
          _0x29b351["classList"]["remove"]('is-pick-connecting');
        }
      }
    }
    if (this["_rendererDetailsDeferred"] !== !![] && document["activeElement"] !== this['promptEl'] && _0x42a3b9["prompt"] !== undefined && String(_0x42a3b9['prompt'] || '') !== this["_lastPromptContentSig"]) {
      const _0x63c792 = sanitizePromptHtml(_0x42a3b9['prompt'] || '');
      this["promptEl"]["innerHTML"] !== _0x63c792 && (clearVirtualizedPromptCommit(this), this["promptEl"]['innerHTML'] = _0x63c792, this["_initPromptPills"]());
      this['_lastPromptContentSig'] = String(_0x42a3b9['prompt'] || '');
    }
    const _0x3af56e = buildVideoNodePromptUiSig(_0x42a3b9);
    _0x3af56e !== this["_lastPromptUiSig"] && (_0x23860b?.['detail']("promptUiSigFrom", this["_lastPromptUiSig"]), _0x23860b?.["detail"]("promptUiSigTo", _0x3af56e), this["_lastPromptUiSig"] = _0x3af56e, this["_rendererDetailsDeferred"] !== !![] && (typeof this["_syncDreaminaPromptPlaceholder"] === "function" && this["_syncDreaminaPromptPlaceholder"](_0x42a3b9), this["_syncPromptInputVisibility"](_0x42a3b9), this["_syncGenerationNodeHelpTip"]()));
    this["_rendererDetailsDeferred"] !== !![] && this["_syncModelProviderProfileControl"]();
    const _0x495e72 = buildVideoNodePromptBoxSizeSig(_0x42a3b9);
    _0x495e72 !== this['_lastPromptBoxSizeSig'] && (_0x23860b?.["detail"]("promptBoxSizeSigFrom", this["_lastPromptBoxSizeSig"]), _0x23860b?.["detail"]("promptBoxSizeSigTo", _0x495e72), this["_lastPromptBoxSizeSig"] = _0x495e72, this["_rendererDetailsDeferred"] !== !![] && this["_syncPromptBoxSizeFromData"](_0x42a3b9));
    _0x23860b?.['mark']("prompt-ui");
    const _0xabd716 = this["_buildRefBarSignatures"](_0x42a3b9, _0xa126df);
    _0x1055b3 = _0xabd716['inEdges'];
    const {
      sig: _0x8a8718,
      refModeSig: _0x20b57a,
      specialModeSig: _0x4557d3,
      subtractSubjectSig: _0x29b556
    } = _0xabd716;
    if (_0x8a8718 !== this["_lastEdgeSig"] || _0x20b57a !== this["_lastRefModeSig"] || _0x4557d3 !== this["_lastSpecialModeSig"] || _0x29b556 !== this["_lastSubtractSubjectSig"]) {
      this["_lastEdgeSig"] = _0x8a8718;
      this["_lastRefModeSig"] = _0x20b57a;
      this["_lastSpecialModeSig"] = _0x4557d3;
      this["_lastSubtractSubjectSig"] = _0x29b556;
      this["_renderRefBarWhenMediaReady"]();
      if (_0x3bfccc && this["_placeholderEl"]) {
        const _0xf90d90 = hasDisplayableVideoResult(_0x42a3b9);
        const _0x4bbc29 = this['_mustRenderTerminalVideoState'](_0x42a3b9);
        const _0x12a54b = !isSegmentRetakeEditing(_0x42a3b9) && !_0xf90d90 && !_0x4bbc29;
        this['_placeholderEl']["style"]["display"] = _0x12a54b ? "flex" : "none";
        this["_setVideoOverlaysVisible"](_0xf90d90 && !_0x4bbc29);
      }
      _0x271522 && this["_loadVideoWhenMediaReady"]();
    } else {
      this["_syncBtnIconState"]();
    }
    _0x23860b?.['mark']("refbar");
    const _0x31a915 = buildVideoNodeSubmitButtonSig(_0x42a3b9, _0x8a8718, {
      'rhCancelInFlight': this["_rhCancelInFlight"]
    });
    (_0x31a915 !== this['_lastSubmitButtonSig'] || _0x414a57) && (this['_lastSubmitButtonSig'] = _0x31a915, this["_updateSubmitButtonState"]());
    const _0x263aa8 = !!this["footerEl"] && this["_rendererDetailsDeferred"] !== !![];
    const _0x1bcaaf = decorateSegmentRetakeParameterNodeData(_0x263aa8 && typeof this["_getRhVideoAdvancedSchemaNodeData"] === "function" ? this['_getRhVideoAdvancedSchemaNodeData'](_0x42a3b9) : _0x42a3b9);
    const _0x182792 = _0x263aa8 ? buildVideoNodeFooterControlSig(_0x1bcaaf, _0xd46d75) : this["_lastFooterControlSig"];
    if (_0x263aa8 && (_0x414a57 || _0x182792 !== this['_lastFooterControlSig'])) {
      this["_lastFooterControlSig"] = _0x182792;
      _0x42a3b9 = _0x5f0127() || this['_data'] || _0x42a3b9;
      this["_data"] = _0x42a3b9;
      const _0x417b63 = String(_0x42a3b9?.["model"] || '')["trim"]();
      const _0x22c840 = this["_isRunninghubWorkflowModel"](_0x417b63, _0x42a3b9?.["provider"]);
      const _0x5d6f57 = hasRunningHubVideoWorkflowUiPlacement(_0x417b63, "videoParams");
      const _0x4467a0 = hasRunningHubVideoWorkflowUiPlacement(_0x417b63, "resolution");
      const _0x48815f = _0x22c840;
      const _0x273daa = typeof this["_hasVisibleVideoAdvancedControls"] === "function" ? this["_hasVisibleVideoAdvancedControls"](_0x42a3b9) : ![];
      const _0x4be458 = isCustomAiAppManifest(resolveCustomAiAppNodeManifest(_0x42a3b9));
      if (hasRunningHubVideoWorkflowUiField(_0x417b63, "rhMaskExpand")) {
        const _0x24b36c = _0x42a3b9?.["rhMaskExpandTouched"] === !![];
        const _0x31a0e5 = Number(_0x42a3b9?.["rhMaskExpand"]);
        Number["isFinite"](_0x31a0e5) && _0x31a0e5 === 0x0 && !_0x24b36c && a373_0x4fa370["updateNodeData"](this["nodeId"], {
          'rhMaskExpand': 0x19
        });
      }
      const _0x1ab1e9 = this['footerEl']["querySelector"](".rh-adv2-btn");
      _0x1ab1e9 && (_0x1ab1e9['hidden'] = !_0x273daa || _0x4be458, _0x1ab1e9["style"]["display"] = '');
      const _0x5e643b = this['footerEl']["querySelector"]('.ui-schema-instance-slot');
      if (_0x5e643b) {
        _0x5e643b['style']["display"] = _0x48815f ? '' : "none";
      }
      syncModelUiSchemaControls(this["footerEl"], _0x1bcaaf);
      const _0xd44321 = this["footerEl"]["querySelector"](".img-ratio-label");
      if (_0xd44321 && !_0x5d6f57 && !_0x4467a0) {
        if (typeof this["_isDreaminaVideoNode"] === "function" && this["_isDreaminaVideoNode"](_0x42a3b9) && typeof this["_getDreaminaRatioDisplayState"] === "function") {
          const _0x2c10a8 = this["_getDreaminaRatioDisplayState"](_0x42a3b9);
          _0xd44321["textContent"] = _0x2c10a8?.["ratioLabelText"] || formatVideoNodeRatioResolutionLabel(_0x42a3b9);
          const _0x44754f = this["footerEl"]['querySelector'](".img-ratio-icon-slot");
          _0x44754f && typeof this["_getRatioIconHTML"] === "function" && (_0x44754f["innerHTML"] = this["_getRatioIconHTML"](_0x2c10a8?.["ratioIconLabel"] || _0x42a3b9?.['aspectRatio'] || "自适应"));
        } else {
          _0xd44321["textContent"] = formatVideoNodeRatioResolutionLabel(_0x42a3b9);
        }
      }
      const _0x5d5a5d = this["footerEl"]["querySelector"](".rh-vram-adv-panel");
      if (_0x5d5a5d && !_0x273daa) {
        _0x5d5a5d["classList"]["remove"]("show");
      }
      syncNodeFooterAdvancedButtonState(this['footerEl']);
    }
    _0x23860b?.['mark']("controls");
    this["_segmentRetakeController"]?.["update"]?.(_0x42a3b9);
    this["_lastUpdatePerfBreakdown"] = _0x23860b?.["finish"]() || null;
  }
  ["_syncBtnIconStateImpl"]() {
    const _0x61b9a6 = readStoreState()["pickConnectMode"];
    const _0x283379 = this['refBarEl']?.["querySelector"](".btn-icon");
    if (!_0x283379) {
      return;
    }
    _0x61b9a6?.["active"] && _0x61b9a6['sourceNodeId'] === this["nodeId"] ? (_0x283379["style"]["opacity"] = '0', _0x283379['style']["transform"] = "scale(0.4)") : (_0x283379["style"]["opacity"] = '1', _0x283379["style"]['transform'] = 'scale(1)');
  }
  ["_checkAtTrigger"](_0x2d4f70) {
    return _checkAtTrigger(this, _0x2d4f70);
  }
  ["_populateMentionMenu"](_0x5285d7, _0x567769, _0xd4d671, _0x4ce8eb = null, _0x72a9a7 = '', _0x824ddc = -0x1) {
    return _populateMentionMenu(this, {
      'x': _0x5285d7,
      'y': _0x567769,
      'triggerRange': _0xd4d671,
      'pillToEdit': _0x4ce8eb,
      'query': _0x72a9a7,
      'atIndex': _0x824ddc
    });
  }
  ["_insertMentionPill"](_0x56bea2, _0x2f8a88, _0xf0debc, _0x3f1216 = -0x1) {
    return _insertMentionPill(this, {
      'label': _0x56bea2,
      'nodeId': _0x2f8a88,
      'triggerRange': _0xf0debc,
      'atIndex': _0x3f1216
    });
  }
  ["_handlePillKeyboard"](_0x1aa336) {
    return _handlePillKeyboard(this, _0x1aa336);
  }
  ["_getGenerationNodeHelpText"]() {
    const _0x4ae1ff = String(this["_data"]?.["model"] || '')["trim"]();
    return getGenerationNodeHelpTooltip({
      'kind': "video",
      'key': _0x4ae1ff,
      'model': _0x4ae1ff,
      'label': getDisplayModelName(_0x4ae1ff),
      'nodeData': this['_data'] || {}
    });
  }
  ['_ensureGenerationNodeHelpTip']() {
    if (this["_generationNodeHelpTip"] || !this["_promptPanel"]) {
      return this["_generationNodeHelpTip"];
    }
    this["_generationNodeHelpTip"] = createGenerationNodeHelpTipController({
      'panel': this["_promptPanel"],
      'getHelpText': () => this['_getGenerationNodeHelpText'](),
      'ariaLabel': aigenVideoNodeText("help.ariaLabel")
    });
    return this["_generationNodeHelpTip"];
  }
  ["_syncGenerationNodeHelpTip"]() {
    this["_ensureGenerationNodeHelpTip"]()?.["sync"]();
  }
  ['_ensureModelProviderProfileControl']() {
    if (this["_modelProviderProfileControl"] || !this['_promptPanel']) {
      return this["_modelProviderProfileControl"];
    }
    this["_modelProviderProfileControl"] = createModelProviderProfileControl({
      'panel': this['_promptPanel'],
      'getNodeData': () => readStoreState()["nodes"]?.[this["nodeId"]] || this["_data"] || {},
      'onChange': _0x1adcc8 => a373_0x4fa370["updateNodeData"](this["nodeId"], _0x1adcc8)
    });
    return this['_modelProviderProfileControl'];
  }
  ['_syncModelProviderProfileControl']() {
    this["_ensureModelProviderProfileControl"]()?.["sync"]();
  }
  ['prepareRendererVisibleVideoPreview']() {
    this["_rendererEagerVideoPreview"] = ![];
    return ![];
  }
  ["getRendererMediaState"]() {
    return {
      'deferred': this['_rendererMediaDeferred'] === !![],
      'interactionActive': !!(this["_isHovered"] || this["_isManualControl"] || this['_isManualLoopPlayback'] || this["_isSeeking"])
    };
  }
  ['hydrateDeferredMedia']() {
    if (this["_rendererMediaDeferred"] !== !![]) {
      return;
    }
    this["_rendererMediaDeferred"] = ![];
    this['_rendererEagerVideoPreview'] = ![];
    this["_data"] = readStoreState()?.["nodes"]?.[this["nodeId"]] || this["_data"];
    this["_deferredVideoViewRefreshPending"] = ![];
    this["_loadAndDisplayVideo"]();
    this["_schedulePreviewVideoOverlays"]();
    this['_renderRefBarPendingWhenVisible'] && this["_rendererDetailsDeferred"] !== !![] && (this["_renderRefBarPendingWhenVisible"] = ![], this["_renderRefBar"]());
    this["_updateSubmitButtonState"]();
  }
  ['_hydrateDeferredToolbarEvents']() {
    !this["_deferredToolbarEl"] && this['_deferredToolbarMarkupPending'] === !![] && this["_root"]?.["insertAdjacentHTML"] && (this["_root"]["insertAdjacentHTML"]('afterbegin', VIDEO_TOOLBAR_HTML), this["_deferredToolbarEl"] = this["_root"]['querySelector']?.('.node-floating-toolbar'), this["_deferredToolbarMarkupPending"] = ![]);
    return hydrateDeferredVideoNodeToolbar(this, bindVideoToolbarEvents);
  }
  ["hydrateDeferredDetails"]() {
    hydrateVideoNodeDeferredDetails(this, {
      'readStoreState': readStoreState,
      'sanitizePromptHtml': sanitizePromptHtml
    });
  }
  ['unmount']() {
    this["_segmentRetakeController"]?.['dispose']?.();
    this["_segmentRetakeController"] = null;
    this["_videoRenderEpoch"] += 0x1;
    this["_videoSourceAttachToken"] += 0x1;
    this["_autoPlayToken"] += 0x1;
    this['_fullscreenOpenEpoch'] = Number(this["_fullscreenOpenEpoch"] || 0x0) + 0x1;
    this["_pendingFullscreenResultIdentity"] = '';
    this['_isHovered'] = ![];
    this["_previewHoverActivationPending"] = ![];
    this["_cancelPreviewHoverRetryTimers"]?.();
    this["_hoverPlaybackLifecycle"]?.["dispose"]?.();
    this["_hoverPlaybackResumeState"] = null;
    this["_disposeVideoProgressInteraction"]?.();
    this['_videoToolbarCleanup']?.();
    this["_videoToolbarCleanup"] = null;
    this["_deferredToolbarEl"] = null;
    this['_deferredToolbarMarkupPending'] = ![];
    try {
      this['_activeFullscreenCleanup']?.();
    } catch {}
    this["_activeFullscreenCleanup"] = null;
    this["_activeFullscreenVideoEl"] = null;
    this['_activeFullscreenResultIdentity'] = '';
    this["_releaseLocalVideoPlaybackObjectUrl"]?.();
    const _0x19a0c9 = shouldPreserveGenerationTaskOnUnmount(this["nodeId"]);
    disposeImageSchemaRatioResizeAnimation(this, {
      'nodeId': this["nodeId"],
      'previewEl': this["previewEl"]
    });
    this["_flushPromptHtmlCommit"]?.();
    this['_unsubscribeLocale']?.();
    this["_unsubscribeLocale"] = null;
    this["_assetMentionRegistryUnsubscribe"]?.();
    this["_assetMentionRegistryUnsubscribe"] = null;
    this["_assetMentionRegistryRefreshPending"] = ![];
    !_0x19a0c9 && typeof this["_stopDreaminaRecovery"] === "function" && this['_stopDreaminaRecovery'](![]);
    !_0x19a0c9 && typeof this["_stopRunningHubRecovery"] === 'function' && this['_stopRunningHubRecovery'](![]);
    !_0x19a0c9 && typeof this["_stopAsyncRecovery"] === 'function' && this["_stopAsyncRecovery"](![]);
    typeof this["_promptResizeCleanup"] === "function" && (this["_promptResizeCleanup"](), this["_promptResizeCleanup"] = null);
    disposeVideoNodePromptDetails(this);
    this["_uiSchemaCleanup"]?.();
    this["_uiSchemaCleanup"] = null;
    this["_footerControllerCleanup"]?.();
    this["_footerControllerCleanup"] = null;
    this["_isPromptBoxResizing"] = ![];
    this["_videoClickTimer"] && (clearTimeout(this["_videoClickTimer"]), this["_videoClickTimer"] = null);
    this['_centerIndicatorTimer'] && (clearTimeout(this["_centerIndicatorTimer"]), this["_centerIndicatorTimer"] = null);
    this["_cancelVideoProgressLoop"]?.();
    this["_setManualLoopPlayback"]?.(![], this["_getActivePreviewVideoEl"]?.());
    try {
      this['previewEl']?.["querySelectorAll"]("video")["forEach"](_0x1cb53b => {
        this['_detachPreviewVideoRecovery']?.(_0x1cb53b);
        try {
          _0x1cb53b["pause"]();
        } catch {}
        _0x1cb53b["removeAttribute"]('src');
        _0x1cb53b["load"]?.();
      });
    } catch {}
    this["_disposeCachedVideoObjectUrls"]?.();
    const _0xb80b19 = [this["_fixedSlotRefThumbObjectUrls"], this["_refThumbObjectUrls"]];
    for (const _0x3c51b1 of _0xb80b19) {
      if (!(_0x3c51b1 && typeof _0x3c51b1["entries"] === "function")) {
        continue;
      }
      for (const _0xf086db of _0x3c51b1['values']()) {
        if (_0xf086db && String(_0xf086db)["startsWith"]("blob:")) {
          try {
            URL["revokeObjectURL"](_0xf086db);
          } catch {}
        }
      }
      try {
        _0x3c51b1["clear"]();
      } catch {}
    }
    this["_videoThumbPending"]["clear"]();
  }
}
const videoNodeReferenceInputModule = createVideoNodeReferenceInputModule(VIDEO_NODE_MODULE_DEPS);
const videoNodeParameterPanelModule = createVideoNodeParameterPanelModule(VIDEO_NODE_MODULE_DEPS);
const videoNodeTaskOrchestrationModule = createVideoNodeTaskOrchestrationModule(VIDEO_NODE_MODULE_DEPS);
const videoNodeResultRenderModule = createVideoNodeResultRenderModule(VIDEO_NODE_MODULE_DEPS);
const videoNodePreviewControlsModule = createVideoNodePreviewControlsModule(VIDEO_NODE_MODULE_DEPS);
function applyClassPrototypeMethods(_0x3aa44a, _0x47651d) {
  if (!_0x47651d) {
    return;
  }
  const _0x3ba1d4 = Object["getOwnPropertyDescriptors"](_0x47651d);
  delete _0x3ba1d4["constructor"];
  Object["defineProperties"](_0x3aa44a, _0x3ba1d4);
}
applyClassPrototypeMethods(AIGenVideoNode["prototype"], videoNodeReferenceInputModule);
applyClassPrototypeMethods(AIGenVideoNode['prototype'], videoNodeParameterPanelModule);
applyClassPrototypeMethods(AIGenVideoNode["prototype"], videoNodeTaskOrchestrationModule);
applyClassPrototypeMethods(AIGenVideoNode['prototype'], videoNodeResultRenderModule);
applyClassPrototypeMethods(AIGenVideoNode["prototype"], videoNodePreviewControlsModule);
Object["assign"](AIGenVideoNode["prototype"], videoUiRenderMixin, videoStateSyncMixin, videoTaskOrchestrationMixin);