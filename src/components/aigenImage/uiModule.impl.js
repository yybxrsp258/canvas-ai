import { openDebugRequestWindow } from '../../modules/debugRequestWindow.js';
import { buildSourceMediaNodePayload, getAIGenerationNodeSize, getAutoMediaSizeByShortSide, getNodeDefaultSize } from '../../services/fileService.js';
import { revokeTrackedMediaObjectUrl } from '../../services/mediaObjectUrlRegistry.js';
import { releasePayloadObjectUrlLease } from '../../services/payloadObjectUrlLease.js';
import { disposeImageObjectUrls, hydrateStoredImageThumbsInBackground } from './imageObjectUrlLifecycle.js';
import { buildImageNodeStorageFields, pickCanvasImageLocalPath, pickCanvasThumbLocalPath, toLocalPathUrl } from '../../services/imageDerivativeService.js';
import { buildCanvasImageResultIdentityKey, isCanvasLowZoomActive, pickImageLodUrl, setNodeMediaLodHoverPromoted, shouldUseLowZoomImageThumbnail, versionCanvasImageDisplayUrl } from '../../modules/canvasImageLod.js';
import { preloadCanvasImage } from '../../modules/canvasMediaScheduler.js';
import { assignCanvasImageDisplaySource, clearCanvasImageDisplayHandoff, deferCanvasImageDisplayFallbackRelease } from '../../modules/canvasImageDisplayHandoff.js';
import { commit } from '../../modules/history.js';
import { startNodeResizePreview } from '../../modules/interaction/nodeResizePreview.js';
import { applyPromptBoxHeight, getPromptBoxHeightBounds, normalizePromptBoxHeight } from '../promptBoxResize.js';
import { buildDreaminaImageNodeNormalizationPatch, normalizeDreaminaImageModel } from './dreaminaModelMenuHelper.js';
import { getNanoBananaModeLabel, getNanoBananaModeOptions, getNanoBananaSelectionFromModel, getNanoBananaAllowedRatioLabels, isNanoBananaFamily, normalizeNanoBananaRatioForFamily } from '../../modules/nanoBananaModeRules.js';
import { buildMainImageRatioLabel, isImageSizeOptionDisabledForProviderModel, isRunningHubGptImage2OfficialModel, normalizeImageSizeForProviderModel, shouldDisableImageSizeControl } from '../../modules/imageModelCapabilities.js';
import { syncPreviewNodeLoading } from '../../modules/previewMode.js';
import { subscribeAssetMentionRegistry } from '../../modules/assetMentionRegistry.js';
import { removeCoveredAssetInputRefForConnection } from '../../modules/promptAssetInputOverride.js';
import { getExclusiveSlotsForFixedSlot, getFixedInputSlotConfigFromManifest } from '../../modules/fixedInputAssetRefs.js';
import { flushPromptHtmlCommit, getPromptAssetInputRefsFromNode, handlePromptPaste, handlePromptSelectAll, handleRefThumbDeleteClick, resolvePromptTextWithTextRefs, schedulePromptHtmlCommit, shouldSubmitPromptByKeyboard } from '../../modules/nodePromptShared.js';
import { shouldSkipPromptTriggerForBulkInput } from '../../modules/promptTriggerComposition.js';
import { getTargetInputPolicy, isInputKindAllowed, isRhPersonReplaceV3Model, isRhPersonReplaceWorkflowModel, isRhQwenImageEditModel, resolveEffectiveInputKind, RH_QWEN_IMAGE_EDIT_MODEL } from '../../modules/modelInputPolicy.js';
import { isImageFreeAngleOnlyModel } from '../../modules/imageFunctionModelMenu.js';
import { sanitizePromptHtml } from '../../utils/dom.js';
import { DEBUG_WRENCH_ICON_HTML, buildFinalApiDebugPreview } from '../../utils/debugRequestPreview.js';
import { createPromptAttachmentButtonHTML } from '../refAttachmentButton.js';
import { attachGenerationNodePromptTools } from '../generationNodeHelpTip.js';
import { attachNodePromptExpansion } from '../nodePromptExpansion.js';
import { createModelProviderProfileControl } from '../shared/modelProviderProfileControl.js';
import { buildModelProviderProfileSelectionPatch } from '../../modules/modelProviderProfileSelection.js';
import { applyModelCredentialButtonState, bindModelCredentialMenu, resetModelCredentialButtonState, syncModelCredentialMenu } from '../../modules/modelCredentialUi.js';
import { isVipModel as a343_0x1c2c2c } from '../../modules/subscriptionAccess.js';
import { buildImageModelMenuHTML, buildNanoBananaModeMenuHTML, buildRunningHubGptImage2OfficialPatch, escapeHtmlAttr, getImagePromptPlaceholderForModel, getImageSizeCapabilityProvider, isApimartGptImage2Selection, isGrsaiGptImage2Selection, isRunningHubGptImage2Selection, renderImageModelTriggerIconHTML, shouldShowNanoBananaModeSelector } from './uiModuleModelHelpers.js';
import { bindImageModelMenuGroups } from './imageModelMenuBinding.js';
import { AI_IMAGE_MIN_SIZE, GENERATION_MANUAL_DISPLAY_SIZE_FIELD, applyImageSchemaRatioResizeAnimation, buildGenerationModelSelectionDisplayPatch, buildImageSchemaAspectRatioDisplayPatch } from '../shared/generationDisplayPolicy.js';
import { buildImageInputGateClearPatch, getImageInputGateUploadedUrl, getImageNodeInputGate, getImageNodeRootClass, shouldUseImageWorkflowBusyButton } from './imageNodeManifestPolicies.js';
import { bindModelUiSchemaControls, buildModelUiSchemaDefaultParams, renderModelUiSchemaControls, sanitizeModelUiSchemaParams, syncModelUiSchemaControls } from './uiSchemaRenderer.js';
import { buildUiSchemaVisibilitySignature } from './uiSchemaVisibility.js';
import { bindNodeFooterController, bindNodeModelMenuPrewarm, closeNodeFooterMenus } from '../shared/nodeFooterControls.js';
import { ADVANCED_SETTINGS_TUNE_ICON_MARKUP } from '../sharedIconMarkup.js';
import { bindGenerationNodeCredentialLifecycle } from '../shared/generationNodeCredentialLifecycle.js';
import { RH_AI_APP_PERSISTENT_ADVANCED_CLASS, buildRhAiAppResultDisplayPatch, isCustomAiAppManifest, isRunningHubAiAppManifest, resolveCustomAiAppNodeManifest, shouldAllowEmptyCustomAiAppInputs } from '../shared/rhAiAppNodeBehavior.js';
import { bindCustomRelayQuickAdd } from '../shared/customRelayModelQuickAdd.js';
import { bindResultImageDragOutGesture } from './resultImageDragOut.js';
import { buildFixedSlotOccupancy, countManifestInputRecords, getMissingManifestInputRequirement } from './manifestInputRequirements.js';
import { MULTI_RESULT_BACKPLATE_CLASS, MULTI_RESULT_STACK_WRAP_CLASS, buildMultiResultCollapsedFrame, buildMultiResultExpandedSlotMap, buildMultiResultBackplateItems, clearMultiResultStackClasses, createMultiResultBackplates, getMultiResultBackplateCount, getMultiResultBackplateDomIdentityKey, getMultiResultBackplateIdentityKey, getMultiResultBackplateKey, resolveMultiResultMainSwap, shouldRefreshMultiResultStackDom, shouldEnableMultiResultLayerDragOut, syncMultiResultStackClasses } from './multiResultStackBackplates.js';
import { getModelManifest, isWorkflowModel } from '../../manifests/index.js';
import { resetGenerateButtonIdleUi, setGenerateButtonCancellableUi, setGenerateButtonLoadingUi } from '../../modules/previewGenerateButtonUi.js';
import { evaluateGenerationPromptBoundary } from '../../modules/generationPromptPolicy.js';
import { onLocaleChange, t } from '../../i18n/index.js';
import { getTaskMessage, resolveGenerationButtonMode } from '../../core/generationTaskUiState.js';
import { DEFAULT_IMAGE_NODE_MODEL, DEFAULT_IMAGE_NODE_PROVIDER } from './defaults.js';
const AIGEN_IMAGE_HIDDEN_SOURCE_CLEAR_DELAY_MS = 0x4b0;
const AIGEN_IMAGE_LOD_HOVER_REFRESH_DELAY_MS = 0xa0;
const AIGEN_IMAGE_MULTI_STACK_MOTION_DURATION_MS = 0x1f4;
const AIGEN_IMAGE_BACKPLATE_MEDIA_HIDE_CLEAR_DELAY_MS = 0xb4;
function getPlainUiSchemaParams(_0x10a1ff) {
  return _0x10a1ff && typeof _0x10a1ff === "object" && !Array["isArray"](_0x10a1ff) ? _0x10a1ff : {};
}
export function shouldShowImagePromptInput(_0x42503a) {
  if (!_0x42503a || typeof _0x42503a !== "object") {
    return !![];
  }
  if (_0x42503a?.["prompt"]?.["visible"] === ![]) {
    return ![];
  }
  if (_0x42503a?.['prompt']?.["hidden"] === !![]) {
    return ![];
  }
  return !![];
}
function getRhAiAppImageResultMediaKey(_0x17338e = {}) {
  const _0x38b0fc = Array['isArray'](_0x17338e?.["images"]) ? _0x17338e['images'] : [];
  const _0x1b8599 = Number(_0x17338e?.["mainImageIndex"]);
  const _0x411635 = Number['isFinite'](_0x1b8599) ? Math["max"](0x0, Math['trunc'](_0x1b8599)) : 0x0;
  const _0x33104b = _0x38b0fc[Math["min"](_0x411635, Math["max"](0x0, _0x38b0fc["length"] - 0x1))] || {};
  return [_0x33104b['displayLocalPath'], _0x33104b["localPath"], _0x33104b["originalLocalPath"], _0x33104b["imageUrl"], _0x33104b['sourceUrl'], _0x33104b["thumbUrl"], _0x33104b['thumbId'], _0x17338e?.["imageUrl"], _0x17338e?.["sourceUrl"], _0x17338e?.["thumbUrl"]]['map'](_0x4f56bb => String(_0x4f56bb || '')["trim"]())["find"](Boolean) || '';
}
export function resolveUploadedImageReferenceUrl(_0xabb965 = {}) {
  const _0x4a2540 = buildImageNodeStorageFields(_0xabb965);
  return String(_0xabb965?.["displayUrl"] || '')["trim"]() || String(_0xabb965?.['originalUrl'] || '')["trim"]() || String(_0xabb965?.["url"] || '')["trim"]() || toLocalPathUrl(_0x4a2540["displayLocalPath"] || _0x4a2540['originalLocalPath'] || _0x4a2540["localPath"]);
}
function flushAIGenImageReferenceUploadNodes(_0x226c24 = []) {
  const _0x38eb7d = Array["from"](new Set(_0x226c24['map'](_0x5c1cff => String(_0x5c1cff || '')["trim"]())["filter"](Boolean)));
  if (_0x38eb7d["length"] === 0x0) {
    return ![];
  }
  const _0x26ee0c = globalThis["window"]?.["v2Renderer"];
  if (typeof _0x26ee0c?.["flushNodes"] === "function") {
    try {
      if (_0x26ee0c["flushNodes"](_0x38eb7d) === !![]) {
        return !![];
      }
    } catch {}
  }
  if (typeof _0x26ee0c?.['flushNode'] !== 'function') {
    return ![];
  }
  let _0x36ba6e = ![];
  for (const _0x376f5d of _0x38eb7d) {
    try {
      _0x36ba6e = _0x26ee0c['flushNode'](_0x376f5d) === !![] || _0x36ba6e;
    } catch {}
  }
  return _0x36ba6e;
}
export function hasImageInputForUiSchemaNodeData({
  nodeId = '',
  nodeData = {},
  state = {},
  incomingEdges = null
} = {}) {
  if (!nodeData || typeof nodeData !== "object") {
    return ![];
  }
  if (nodeData["hasInputImages"] === !![]) {
    return !![];
  }
  const _0x521f85 = [nodeData["inputUrls"], nodeData["image_urls"], nodeData["inputImageUrls"], nodeData["referenceImageUrls"]];
  if (_0x521f85["some"](_0x444695 => Array['isArray'](_0x444695) ? _0x444695["some"](_0x49c6fa => String(_0x49c6fa || '')["trim"]()) : String(_0x444695 || '')["trim"]())) {
    return !![];
  }
  if (getPromptAssetInputRefsFromNode(nodeData, {
    'allowedTypes': ['image']
  })["some"](_0x472a48 => String(_0x472a48?.["url"] || '')['trim']())) {
    return !![];
  }
  const _0xba2291 = state?.["nodes"] || {};
  const _0x139940 = getTargetInputPolicy({
    ...nodeData,
    'type': nodeData["type"] || "ai-image"
  });
  const _0x548471 = Array["isArray"](incomingEdges) ? incomingEdges : Object['values'](state?.["edges"] || {});
  return _0x548471["some"](_0x1770d8 => {
    if (!_0x1770d8 || String(_0x1770d8["targetId"] || '') !== String(nodeId || '')) {
      return ![];
    }
    const _0x2dd158 = _0xba2291[_0x1770d8["sourceId"]];
    if (!_0x2dd158) {
      return ![];
    }
    const _0x541225 = resolveEffectiveInputKind(_0x2dd158, _0x1770d8);
    return _0x541225 === 'image' && isInputKindAllowed(_0x139940, _0x541225);
  });
}
function collectSubmitButtonInputRecords({
  latestNode = {},
  nodes = {},
  inEdges = [],
  imageInputGate = {}
} = {}) {
  const _0x5303cb = getTargetInputPolicy({
    ...latestNode,
    'type': latestNode?.["type"] || "ai-image"
  });
  const _0x2842a5 = String(imageInputGate?.['kind'] || '')['trim']();
  const _0x22a391 = [];
  _0x2842a5 === "image" && getImageInputGateUploadedUrl(latestNode, imageInputGate) && _0x22a391["push"]({
    'kind': "image",
    'refSlot': ''
  });
  (Array["isArray"](inEdges) ? inEdges : [])["forEach"](_0xd576dc => {
    const _0x521e91 = nodes?.[_0xd576dc?.["sourceId"]];
    if (!_0x521e91) {
      return;
    }
    const _0x5a65ed = resolveEffectiveInputKind(_0x521e91, _0xd576dc);
    if (!_0x5a65ed || !isInputKindAllowed(_0x5303cb, _0x5a65ed)) {
      return;
    }
    if (_0x2842a5 && _0x5a65ed !== _0x2842a5) {
      return;
    }
    if (_0x5a65ed === 'text') {
      const _0x499b43 = String(_0x521e91["outputText"] || _0x521e91['text'] || _0x521e91["content"] || _0x521e91["prompt"] || _0x521e91["label"] || '')['trim']();
      if (!_0x499b43) {
        return;
      }
    }
    _0x22a391['push']({
      'kind': _0x5a65ed,
      'refSlot': _0xd576dc?.["refSlot"] || ''
    });
  });
  return _0x22a391;
}
export function createAIGenerateNodeUiModule(_0xdf108b) {
  const {
    store: _0x3c49fd,
    api: _0x54e9b7,
    getDisplayModelName: _0x5a63f6,
    _handlePillHover: _0x122b31,
    _handlePillOut: _0x399533,
    _syncEdgesOrderFromPills: _0x34edc6,
    _syncPillLabels: _0x1f20c7,
    _checkAtTrigger: _0x2f2310,
    _populateMentionMenu: _0x726663,
    _insertMentionPill: _0x5937cf,
    _handlePillKeyboard: _0x5b5222,
    _rehydratePromptPills: _0x3503ec,
    _handleMentionMenuKeyboard: _0x4ad1f4,
    TEXT_TOOLBAR_HTML: _0x1b87b3,
    bindTextToolbarEvents: _0x499458,
    IMAGE_TOOLBAR_HTML: _0x12e409,
    bindImageToolbarEvents: _0x2c5555,
    showDevToast: _0x2849e9,
    getImage: _0x8e25c3,
    openNodeImagePreview: _0x541837,
    getPromptPresets: _0x5bb1a3,
    openCustomPresetsManager: _0x16dabe,
    startLoading: _0x284a22,
    stopLoading: _0x94a231,
    bindRefThumbHoverPreview: _0x7ecab3,
    ensureThumbDecoded: _0x8fb7b4,
    revealRefThumbMedia: _0xd2bac1,
    getRefKindByNodeType: _0xfccb38,
    uploadFile: _0x7c500a,
    ensureConfig: _0x364577,
    getProviderConfig: _0x4cd04a,
    generateId: _0x43f2be,
    checkSlashTrigger: _0x212e4b,
    handleSlashKeyboardNavigation: _0x172fe0,
    closeSlashMenu: _0x129652,
    activateMenuKeyboard: _0x276159,
    ImageFreeAngleController: _0x3d0809
  } = _0xdf108b;
  const _0x416d2a = () => typeof _0x3c49fd["getStateRaw"] === "function" ? _0x3c49fd["getStateRaw"]() : _0x3c49fd["getState"]();
  class _0x58f975 {
    ["refreshModelRegistryUi"]() {
      return this["_refreshModelRegistryUi"]?.() === !![];
    }
    ['_getUiSchemaRenderNodeData'](_0x51409a = this["_data"]) {
      return {
        ...(_0x51409a || {}),
        'hasInputImages': hasImageInputForUiSchemaNodeData({
          'nodeId': this['nodeId'],
          'nodeData': _0x51409a || {},
          'state': _0x416d2a() || {}
        })
      };
    }
    ["_shouldUseLowZoomThumbnail"]() {
      return shouldUseLowZoomImageThumbnail({
        'nodeId': this['nodeId'],
        'rootEl': this["_root"],
        'store': _0x3c49fd
      });
    }
    ["_pickImageDisplayUrl"](_0x320d20 = '', _0x4b6425 = '', _0x36e62a = {}) {
      const _0x32a336 = _0x36e62a && Object["prototype"]['hasOwnProperty']["call"](_0x36e62a, "lowZoomThumbnail");
      return pickImageLodUrl({
        'mainUrl': _0x320d20,
        'thumbUrl': _0x4b6425,
        'lowZoomThumbnail': _0x32a336 ? !!_0x36e62a["lowZoomThumbnail"] : this["_shouldUseLowZoomThumbnail"]()
      });
    }
    ['_applyImageElementLod'](_0xafc3aa, _0x11831d = "full") {
      if (!_0xafc3aa) {
        return;
      }
      _0xafc3aa['dataset']["lodSrc"] = _0x11831d === "thumb" ? "thumb" : "full";
    }
    ["_getImageDisplayElements"]() {
      const _0x464ea2 = [];
      if (this['imgEl']) {
        _0x464ea2["push"](this["imgEl"]);
      }
      for (const _0xf0e11a of this["_multiImagesContainer"]?.["querySelectorAll"]?.("img") || []) {
        if (_0xf0e11a && !_0x464ea2['includes'](_0xf0e11a)) {
          _0x464ea2['push'](_0xf0e11a);
        }
      }
      return _0x464ea2;
    }
    ["_isImageObjectUrlReferenced"](_0x377b6e, _0x509159) {
      if (!_0x377b6e || !_0x509159) {
        return ![];
      }
      return [_0x377b6e["getAttribute"]?.("src"), _0x377b6e["currentSrc"], _0x377b6e['src'], _0x377b6e["dataset"]?.['lazySrc'], _0x377b6e["dataset"]?.["lazyPreviewSrc"]]["some"](_0x1b703e => String(_0x1b703e || '')["trim"]() === _0x509159);
    }
    ["_queueImageObjectUrlRelease"](_0x574cce) {
      const _0x1dae4d = String(_0x574cce || '')['trim']();
      if (!_0x1dae4d["startsWith"]("blob:")) {
        return ![];
      }
      !this['_pendingImageObjectUrlReleases'] && (this["_pendingImageObjectUrlReleases"] = new Set());
      !this["_imageObjectUrlReleaseCallbacks"] && (this["_imageObjectUrlReleaseCallbacks"] = new Map());
      this['_pendingImageObjectUrlReleases']["add"](_0x1dae4d);
      !this["_imageObjectUrlReleaseCallbacks"]["has"](_0x1dae4d) && this["_imageObjectUrlReleaseCallbacks"]["set"](_0x1dae4d, () => {
        this["_flushPendingImageObjectUrlReleases"]();
      });
      this['_flushPendingImageObjectUrlReleases']();
      return !![];
    }
    ["_flushPendingImageObjectUrlReleases"]() {
      const _0xd77f2d = this["_pendingImageObjectUrlReleases"];
      if (!_0xd77f2d?.['size']) {
        return 0x0;
      }
      const _0x338361 = this["_getImageDisplayElements"]();
      let _0x4fc8a5 = 0x0;
      for (const _0x5011aa of [..._0xd77f2d]) {
        const _0xfc91fd = this['_imageObjectUrlReleaseCallbacks']?.['get'](_0x5011aa);
        const _0x532fa0 = _0x338361["some"](_0x17d663 => deferCanvasImageDisplayFallbackRelease(_0x17d663, _0x5011aa, _0xfc91fd));
        const _0x2e8dcd = _0x338361['some'](_0xff7e9 => this["_isImageObjectUrlReferenced"](_0xff7e9, _0x5011aa));
        if (_0x532fa0 || _0x2e8dcd) {
          continue;
        }
        revokeTrackedMediaObjectUrl(_0x5011aa);
        _0xd77f2d["delete"](_0x5011aa);
        this["_imageObjectUrlReleaseCallbacks"]?.["delete"](_0x5011aa);
        _0x4fc8a5 += 0x1;
      }
      return _0x4fc8a5;
    }
    ["_disposeImageObjectUrls"]() {
      disposeImageObjectUrls(this);
    }
    ['_syncReferenceUploadUi'](_0x4ff56b = '') {
      typeof this["_renderRefBar"] === 'function' && Promise['resolve'](this["_renderRefBar"]())['catch'](() => {});
      typeof this["_updateSubmitButtonState"] === "function" && this["_updateSubmitButtonState"]();
      flushAIGenImageReferenceUploadNodes([this["nodeId"], _0x4ff56b]);
    }
    async ['_handleReferenceUploadFile'](_0x94f153) {
      const _0xa9bef7 = window["currentProjectId"] || "default_v2_project";
      const _0x42fd31 = await _0x7c500a(_0x94f153, _0xa9bef7);
      const _0x57fd3f = resolveUploadedImageReferenceUrl(_0x42fd31);
      if (!_0x57fd3f) {
        throw new Error(t("aigenImage.upload.missingUrl"));
      }
      const _0x16a9d9 = _0x3c49fd["getState"]()["nodes"]?.[this["nodeId"]];
      const _0x5e4cc5 = getImageNodeInputGate(_0x16a9d9?.["model"]);
      const _0x35063a = String(_0x5e4cc5['kind'] || '') === 'image';
      const _0x4e2031 = isRhPersonReplaceWorkflowModel(_0x16a9d9?.["model"]);
      const _0x2c0fea = isRhQwenImageEditModel(_0x16a9d9?.["model"]);
      const _0xb1e7b8 = getFixedInputSlotConfigFromManifest(_0x16a9d9 || {});
      const _0x374329 = Number(_0x16a9d9?.['x']) || 0x0;
      const _0x2384db = Number(_0x16a9d9?.['y']) || 0x0;
      const _0x1fa451 = Number(_0x16a9d9?.["width"]) || 0x168;
      const _0x57646c = Number(_0x16a9d9?.["height"]) || 0x168;
      const _0x1641b9 = buildImageNodeStorageFields(_0x42fd31);
      const _0x266a78 = _0x42fd31["localPath"] || _0x1641b9["localPath"] || _0x1641b9["originalLocalPath"] || String(_0x57fd3f || '')["replace"](/^\//, '');
      const _0x40ef23 = _0x43f2be("source-image");
      const _0xe7dc5 = 0x104;
      const _0x3de309 = 0x104;
      const _0x17a2fd = 0x18;
      const _0x4d5694 = _0x374329 - _0x17a2fd - _0xe7dc5;
      const _0x4ce324 = _0x2384db + Math['round']((_0x57646c - _0x3de309) / 0x2);
      let _0x523bad = _0x4ce324;
      const _0x575c94 = String(this["_pendingRefSlot"] || '')["trim"]();
      let _0x2ed9e3 = _0x575c94;
      const _0x4cb314 = (_0xb1e7b8?.["visibleSlots"] || [])['filter'](_0x2a14bf => _0xb1e7b8?.["slotKindById"]?.[_0x2a14bf] === 'image');
      const _0x35370c = !!_0x575c94 && _0x4cb314["includes"](_0x575c94);
      if (_0x4e2031) {
        const _0x3c9569 = _0x575c94 === "replacedImage" ? 0x1 : 0x0;
        const _0x4e6aeb = _0x3c9569 === 0x0 ? -Math["round"](_0x3de309 / 0x2) - 0xc : Math['round'](_0x3de309 / 0x2) + 0xc;
        _0x523bad = _0x4ce324 + _0x4e6aeb;
      } else {
        if (_0x35370c) {
          const _0x387beb = Math['max'](0x0, _0x4cb314["indexOf"](_0x575c94));
          const _0xa1f66c = (_0x4cb314["length"] - 0x1) / 0x2;
          _0x523bad = _0x4ce324 + Math["round"]((_0x387beb - _0xa1f66c) * (_0x3de309 + 0x18));
        }
      }
      _0x3c49fd["batch"](() => {
        const _0x32571f = _0x3c49fd['getIncomingEdges'](this["nodeId"]);
        if (_0x35063a) {
          for (const _0x4c94d2 of _0x32571f) {
            _0x3c49fd['removeEdge'](_0x4c94d2['id']);
          }
        } else {
          if (_0x4e2031) {
            const _0x277a87 = ["replaceTarget", "replacedImage"];
            let _0x133ee8 = _0x277a87["includes"](_0x575c94) ? _0x575c94 : '';
            if (!_0x133ee8) {
              const _0x8113c2 = new Set(_0x32571f['map'](_0x5e6ec0 => String(_0x5e6ec0["refSlot"] || ''))['filter'](_0x238e67 => _0x277a87["includes"](_0x238e67)));
              _0x133ee8 = _0x277a87["find"](_0x13118d => !_0x8113c2["has"](_0x13118d)) || '';
              if (!_0x133ee8) {
                let _0x474ab8 = null;
                for (const _0xc8e2b2 of _0x32571f) {
                  const _0x473387 = String(_0xc8e2b2["refSlot"] || '');
                  if (!_0x277a87["includes"](_0x473387)) {
                    continue;
                  }
                  const _0x1f9ad6 = Number(_0xc8e2b2["createdAt"]) || 0x0;
                  (!_0x474ab8 || _0x1f9ad6 < (Number(_0x474ab8["createdAt"]) || 0x0)) && (_0x474ab8 = _0xc8e2b2);
                }
                if (!_0x474ab8 && _0x32571f["length"] > 0x0) {
                  _0x474ab8 = _0x32571f[0x0];
                }
                _0x474ab8 ? (_0x133ee8 = String(_0x474ab8["refSlot"] || '') || _0x277a87[0x0], _0x3c49fd['removeEdge'](_0x474ab8['id'])) : _0x133ee8 = _0x277a87[0x0];
              }
            } else {
              for (const _0x4aa21d of _0x32571f) {
                if (String(_0x4aa21d['refSlot'] || '') === _0x133ee8) {
                  _0x3c49fd["removeEdge"](_0x4aa21d['id']);
                }
              }
            }
            _0x2ed9e3 = _0x133ee8;
          } else {
            if (_0x35370c) {
              const _0x53e5a8 = getExclusiveSlotsForFixedSlot(_0xb1e7b8?.["exclusiveGroups"], _0x2ed9e3);
              const _0x3877ec = new Set(_0x53e5a8["length"] ? _0x53e5a8 : [_0x2ed9e3]);
              for (const _0x2228b8 of _0x32571f) {
                if (_0x3877ec["has"](String(_0x2228b8["refSlot"] || ''))) {
                  _0x3c49fd["removeEdge"](_0x2228b8['id']);
                }
              }
            } else {
              if (_0x2c0fea) {
                const _0x341af9 = _0x32571f['filter'](_0x2b6ab0 => {
                  const _0x1cd704 = _0x3c49fd['getState']()["nodes"]?.[_0x2b6ab0['sourceId']];
                  return _0xfccb38(_0x1cd704?.['type'] || '') === "image";
                });
                if (_0x341af9["length"] >= 0x3) {
                  const _0x928699 = _0x341af9['reduce']((_0x4a5b1b, _0x1c900c) => (Number(_0x1c900c["createdAt"]) || 0x0) < (Number(_0x4a5b1b['createdAt']) || 0x0) ? _0x1c900c : _0x4a5b1b);
                  if (_0x928699?.['id']) {
                    _0x3c49fd["removeEdge"](_0x928699['id']);
                  }
                }
              } else {
                for (const _0x1106fa of _0x32571f) {
                  _0x3c49fd['removeEdge'](_0x1106fa['id']);
                }
              }
            }
          }
        }
        _0x35063a && _0x3c49fd["updateNodeData"](this["nodeId"], buildImageInputGateClearPatch(_0x5e4cc5));
        removeCoveredAssetInputRefForConnection({
          'targetId': this["nodeId"],
          'sourceKind': "image",
          'refSlot': _0x4e2031 || _0x35370c ? _0x2ed9e3 : ''
        });
        _0x3c49fd["addNode"](buildSourceMediaNodePayload({
          'id': _0x40ef23,
          'type': "source-image",
          'x': _0x4d5694,
          'y': _0x523bad,
          'width': _0xe7dc5,
          'height': _0x3de309,
          'src': _0x57fd3f,
          'localPath': _0x266a78,
          'assetId': _0x42fd31["assetId"] || '',
          'derivativeStatus': _0x42fd31["derivativeStatus"] || _0x42fd31["status"] || '',
          ..._0x1641b9,
          'fileName': _0x42fd31['filename'] || _0x94f153["name"] || '',
          'thumbUrl': null,
          'needsAutoResize': !![]
        }));
        _0x3c49fd["addEdge"]({
          'id': _0x43f2be('edge'),
          'sourceId': _0x40ef23,
          'targetId': this["nodeId"],
          ...((_0x4e2031 || _0x35370c) && _0x2ed9e3 ? {
            'refSlot': _0x2ed9e3,
            'createdAt': Date['now']()
          } : {
            'createdAt': Date["now"]()
          })
        });
        _0x3c49fd["setSelectedNodes"]([this["nodeId"]]);
      });
      this["_syncReferenceUploadUi"](_0x40ef23);
      await new Promise(_0x43c334 => {
        const _0xe98efd = new Image();
        _0xe98efd['onload'] = () => {
          const _0x79fead = _0xe98efd["naturalWidth"] || 0x3e8;
          const _0x2f1a53 = _0xe98efd["naturalHeight"] || 0x3e8;
          const {
            width: _0x57259c,
            height: _0x3cddf9
          } = getAutoMediaSizeByShortSide(_0x79fead, _0x2f1a53);
          _0x3c49fd["getState"]()["nodes"]?.[_0x40ef23] && (_0x3c49fd["updateNodeData"](_0x40ef23, {
            'width': _0x57259c,
            'height': _0x3cddf9,
            'needsAutoResize': ![],
            'x': _0x374329 - _0x17a2fd - _0x57259c,
            'y': (_0x4e2031 || _0x35370c) && _0x2ed9e3 ? _0x523bad + Math["round"]((_0x3de309 - _0x3cddf9) / 0x2) : _0x2384db + Math["round"]((_0x57646c - _0x3cddf9) / 0x2)
          }), this['_syncReferenceUploadUi'](_0x40ef23));
          _0x43c334();
        };
        _0xe98efd["onerror"] = () => _0x43c334();
        _0xe98efd['src'] = _0x57fd3f;
      });
      return _0x40ef23;
    }
    ['_ensureImageDisplayDecoded'](_0x21f770 = '') {
      const _0x271ca6 = String(_0x21f770 || '')["trim"]();
      if (!_0x271ca6 || typeof Image !== 'function') {
        return Promise["resolve"](!![]);
      }
      return preloadCanvasImage(_0x271ca6, {
        'decode': !![],
        'priority': 0x1e,
        'fetchPriority': "auto"
      })["then"](() => !![]);
    }
    ["_setImageElementDisplaySource"](_0x24cc68, _0x1d6534 = {}, _0x2127f7 = {}) {
      if (!_0x24cc68?.["dataset"]) {
        return;
      }
      const _0x1f0f74 = String(_0x1d6534?.['url'] || '')["trim"]();
      const _0x471cef = versionCanvasImageDisplayUrl(_0x1f0f74, _0x2127f7?.['versionKey']);
      const _0x5eb0f9 = _0x1d6534?.["lod"] === "thumb" ? 'thumb' : "full";
      const _0x3d1052 = String(_0x2127f7?.["previewLod"]?.["url"] || '')["trim"]();
      const _0x2d4019 = versionCanvasImageDisplayUrl(_0x3d1052, _0x2127f7?.["versionKey"]);
      const _0x21a114 = _0x2127f7?.["previewLod"]?.['lod'] === "full" ? "full" : 'thumb';
      const _0x3ad8be = _0x2127f7?.['display'] !== ![];
      if (!_0x471cef) {
        this["_clearLazyImageDisplaySource"](_0x24cc68);
        if (_0x3ad8be) {
          _0x24cc68["style"]["display"] = 'none';
        }
        return;
      }
      const _0x4a6e3a = String(_0x24cc68['getAttribute']?.('src') || '')['trim']();
      const _0x1d47dd = !!_0x4a6e3a && _0x4a6e3a !== _0x471cef && _0x24cc68["style"]["display"] !== "none";
      const _0x5f0209 = (Number(_0x24cc68["_imageDisplayDecodeToken"]) || 0x0) + 0x1;
      _0x24cc68["_imageDisplayDecodeToken"] = _0x5f0209;
      if (_0x1d47dd && _0x2d4019 && _0x2d4019 !== _0x471cef && _0x4a6e3a !== _0x2d4019) {
        this["_cancelLazyImageDisplayClear"](_0x24cc68);
        assignCanvasImageDisplaySource(_0x24cc68, _0x2d4019);
        this['_applyImageElementLod'](_0x24cc68, _0x21a114);
        if (_0x3ad8be) {
          _0x24cc68['style']["display"] = "block";
        }
      }
      let _0x205e38 = ![];
      const _0x354f60 = () => {
        if (_0x205e38) {
          return;
        }
        if (_0x24cc68["_imageDisplayDecodeToken"] !== _0x5f0209) {
          return;
        }
        _0x205e38 = !![];
        this["_cancelLazyImageDisplayClear"](_0x24cc68);
        _0x24cc68["getAttribute"]?.("src") !== _0x471cef && assignCanvasImageDisplaySource(_0x24cc68, _0x471cef);
        this["_flushPendingImageObjectUrlReleases"]();
        this["_applyImageElementLod"](_0x24cc68, _0x5eb0f9);
        if (_0x3ad8be) {
          _0x24cc68["style"]["display"] = 'block';
        }
      };
      if (_0x4a6e3a === _0x471cef || !_0x1d47dd) {
        _0x354f60();
        return;
      }
      this["_ensureImageDisplayDecoded"](_0x471cef)['then'](_0x354f60)["catch"](_0x354f60);
    }
    ["_setLazyImageDisplaySource"](_0x11fb58, _0x5c674f = {}, _0x15316a = {}) {
      if (!_0x11fb58?.["dataset"]) {
        return;
      }
      const _0x2cece2 = String(_0x5c674f?.['url'] || '')["trim"]();
      const _0x3c9d62 = _0x5c674f?.['lod'] === "thumb" ? 'thumb' : "full";
      if (_0x2cece2) {
        _0x11fb58["dataset"]["lazySrc"] = _0x2cece2;
      } else {
        delete _0x11fb58["dataset"]["lazySrc"];
      }
      const _0x14a6b6 = String(_0x15316a?.['previewLod']?.['url'] || '')["trim"]();
      if (_0x14a6b6) {
        _0x11fb58['dataset']['lazyPreviewSrc'] = _0x14a6b6;
      } else {
        delete _0x11fb58['dataset']["lazyPreviewSrc"];
      }
      _0x11fb58["dataset"]["lazyPreviewLodSrc"] = _0x15316a?.['previewLod']?.["lod"] === "full" ? 'full' : "thumb";
      const _0x1c91df = String(_0x15316a?.["versionKey"] || '')["trim"]();
      if (_0x1c91df) {
        _0x11fb58["dataset"]['lazyVersionKey'] = _0x1c91df;
      } else {
        delete _0x11fb58["dataset"]["lazyVersionKey"];
      }
      _0x11fb58["dataset"]['lazyLodSrc'] = _0x3c9d62;
      this["_applyImageElementLod"](_0x11fb58, _0x3c9d62);
    }
    ["_cancelLazyImageDisplayClear"](_0x4cfddd) {
      if (!_0x4cfddd?.['_lazyImageDisplayClearTimer']) {
        return;
      }
      clearTimeout(_0x4cfddd["_lazyImageDisplayClearTimer"]);
      _0x4cfddd["_lazyImageDisplayClearTimer"] = null;
    }
    ["_loadLazyImageDisplaySource"](_0x8e70c6) {
      if (!_0x8e70c6?.["dataset"]) {
        return;
      }
      const _0x409075 = String(_0x8e70c6["dataset"]["lazySrc"] || '')["trim"]();
      if (!_0x409075) {
        this["_clearLazyImageDisplaySource"](_0x8e70c6);
        return;
      }
      this["_cancelLazyImageDisplayClear"](_0x8e70c6);
      this["_setImageElementDisplaySource"](_0x8e70c6, {
        'url': _0x409075,
        'lod': _0x8e70c6["dataset"]['lazyLodSrc'] || "full"
      }, {
        'versionKey': _0x8e70c6["dataset"]["lazyVersionKey"] || '',
        'previewLod': {
          'url': _0x8e70c6["dataset"]["lazyPreviewSrc"] || '',
          'lod': _0x8e70c6['dataset']["lazyPreviewLodSrc"] || "thumb"
        }
      });
    }
    ["_clearLazyImageDisplaySource"](_0xe2404e) {
      if (!_0xe2404e) {
        return;
      }
      this["_cancelLazyImageDisplayClear"](_0xe2404e);
      _0xe2404e['_imageDisplayDecodeToken'] = (Number(_0xe2404e["_imageDisplayDecodeToken"]) || 0x0) + 0x1;
      clearCanvasImageDisplayHandoff(_0xe2404e);
      typeof _0xe2404e["removeAttribute"] === "function" && _0xe2404e["removeAttribute"]("src");
      this["_flushPendingImageObjectUrlReleases"]();
    }
    ["_scheduleClearLazyImageDisplaySource"](_0x33eb4d, _0x8e551c = 0x0) {
      if (!_0x33eb4d) {
        return;
      }
      this["_cancelLazyImageDisplayClear"](_0x33eb4d);
      const _0x4244a5 = Math["max"](0x0, Number(_0x8e551c) || 0x0);
      _0x33eb4d['_lazyImageDisplayClearTimer'] = setTimeout(() => {
        _0x33eb4d["_lazyImageDisplayClearTimer"] = null;
        this["_clearLazyImageDisplaySource"](_0x33eb4d);
      }, _0x4244a5);
    }
    ["_getResultImageDragOutNodeData"]() {
      const _0x3826cc = typeof _0x3c49fd["getStateRaw"] === "function" ? _0x3c49fd['getStateRaw']() : typeof _0x3c49fd["getState"] === "function" ? _0x3c49fd["getState"]() : {};
      return _0x3826cc?.['nodes']?.[this['nodeId']] || this["_data"] || {};
    }
    ["_removeCurrentNodeFromSelection"]() {
      const _0x47729d = typeof _0x3c49fd['getStateRaw'] === 'function' ? _0x3c49fd["getStateRaw"]() : typeof _0x3c49fd["getState"] === "function" ? _0x3c49fd["getState"]() : {};
      const _0x40c96c = Array["isArray"](_0x47729d?.["selectedNodeIds"]) ? _0x47729d["selectedNodeIds"] : [];
      if (!_0x40c96c['includes'](this["nodeId"])) {
        return;
      }
      _0x3c49fd["setSelectedNodes"]?.(_0x40c96c["filter"](_0x35ed4c => _0x35ed4c !== this["nodeId"]));
    }
    ["_bindResultImageDragOut"](_0x4930cf, _0x55779e = {}) {
      if (!_0x4930cf) {
        return () => ![];
      }
      let _0x18507a = ![];
      const _0x3737e2 = () => {
        _0x18507a = !![];
        setTimeout(() => {
          _0x18507a = ![];
        }, 0x1c2);
      };
      const _0x38d662 = () => {
        const _0x44fdad = this["_getResultImageDragOutNodeData"]();
        const _0x126cad = Array["isArray"](_0x44fdad?.['images']) ? _0x44fdad["images"] : [];
        const _0xa106c7 = typeof _0x55779e['getImageIndex'] === "function" ? _0x55779e["getImageIndex"]() : _0x55779e["imageIndex"];
        const _0xb647f7 = Number["isFinite"](Number(_0xa106c7)) ? Math['floor'](Number(_0xa106c7)) : -0x1;
        return _0x126cad[_0xb647f7] || null;
      };
      const _0xc43bad = () => {
        const _0x3c97f2 = typeof _0x55779e["getFallbackSize"] === "function" ? _0x55779e["getFallbackSize"]() : null;
        return {
          'width': Number(_0x3c97f2?.["width"]) || Number(this["previewEl"]?.["offsetWidth"]) || Number(this["_data"]?.['width']) || 0x140,
          'height': Number(_0x3c97f2?.['height']) || Number(this["previewEl"]?.["offsetHeight"]) || Number(this['_data']?.['height']) || 0x140
        };
      };
      bindResultImageDragOutGesture(_0x4930cf, {
        'image': _0x38d662,
        'isEnabled': () => {
          const _0xe33c1f = this["_getResultImageDragOutNodeData"]();
          const _0xafbc35 = !!_0xe33c1f?.['isImagesExpanded'] && Array["isArray"](_0xe33c1f["images"]) && _0xe33c1f["images"]["length"] > 0x1;
          if (!_0xafbc35) {
            return ![];
          }
          return typeof _0x55779e['isEnabled'] === "function" ? _0x55779e['isEnabled'](_0xe33c1f) !== ![] : !![];
        },
        'getViewport': () => {
          const _0x3cd592 = typeof _0x3c49fd["getStateRaw"] === "function" ? _0x3c49fd["getStateRaw"]() : typeof _0x3c49fd["getState"] === "function" ? _0x3c49fd['getState']() : {};
          return _0x3cd592?.["viewport"] || {
            'x': 0x0,
            'y': 0x0,
            'zoom': 0x1
          };
        },
        'getGhostSourceElement': _0x55779e["getGhostSourceElement"],
        'getFallbackSrc': _0x55779e["getFallbackSrc"],
        'getGhostSize': () => {
          const _0x323462 = _0x55779e["getGhostSourceElement"]?.() || _0x4930cf;
          if (_0x323462 && typeof _0x323462["getBoundingClientRect"] === 'function') {
            const _0x574f33 = _0x323462["getBoundingClientRect"]();
            if (_0x574f33["width"] > 0x0 && _0x574f33["height"] > 0x0) {
              return {
                'width': _0x574f33["width"],
                'height': _0x574f33["height"]
              };
            }
          }
          return _0xc43bad();
        },
        'getNodeFallbackSize': _0xc43bad,
        'createId': () => _0x43f2be("source-image"),
        'addNode': _0x46e272 => _0x3c49fd['addNode']?.(_0x46e272),
        'setSelectedNodes': _0x3def84 => _0x3c49fd["setSelectedNodes"]?.(_0x3def84),
        'commit': commit,
        'showToast': (_0x3d794d, _0x587113) => {
          if (typeof globalThis["window"]?.["showToast"] === "function") {
            globalThis["window"]["showToast"](_0x3d794d, _0x587113);
          } else {
            typeof _0x2849e9 === "function" && _0x2849e9(_0x3d794d);
          }
        },
        'markClickSuppressed': _0x3737e2,
        'onDragStart': () => {
          _0x4930cf['classList']?.['add']('is-result-drag-source');
        },
        'onDragEnd': () => {
          _0x4930cf['classList']?.["remove"]("is-result-drag-source");
        }
      });
      return () => _0x18507a;
    }
    ['_runVipRetryOnce'](_0x5197dc) {
      let _0x2c0a95 = ![];
      return () => {
        if (_0x2c0a95) {
          return;
        }
        _0x2c0a95 = !![];
        this["_vipSelectionRetryInProgress"] = !![];
        try {
          _0x5197dc();
        } finally {
          this["_vipSelectionRetryInProgress"] = ![];
        }
      };
    }
    ['_guardVipSelection'](_0x560c7a, _0x1118d6 = '', _0x19a643 = null) {
      const _0x1d8518 = String(_0x560c7a || '')['trim']();
      const _0x530775 = String(_0x1118d6 || '')["trim"]();
      if (!a343_0x1c2c2c(_0x1d8518, _0x530775)) {
        return !![];
      }
      const _0x25cb14 = window["isModelAllowedBySubscription"];
      const _0x49c796 = typeof _0x25cb14 === "function" ? _0x25cb14(_0x1d8518, _0x530775) : !![];
      if (_0x49c796) {
        return !![];
      }
      if (this['_vipSelectionRetryInProgress']) {
        return ![];
      }
      typeof window['openSubscriptionDialog'] === "function" ? window['openSubscriptionDialog']({
        'modelId': _0x1d8518,
        'provider': _0x530775,
        'onSuccess': _0x19a643
      }) : window["showToast"]?.(t('aigenImage.access.vipRequired'), "warn");
      return ![];
    }
    ["mount"]() {
      this['_data'] = this['_normalizeLegacySeedreamModel'](this['_data']);
      this["_data"] = this["_normalizeDreaminaNodeData"](this['_data'], {
        'syncStore': ![]
      });
      const _0x420632 = document['createElement']("div");
      _0x420632['className'] = 'aigen-node-root\x20aigen-image-node-root';
      if (this['isNoResult']) {
        _0x420632['classList']["add"]("no-result");
      }
      this["_root"] = _0x420632;
      _0x420632["innerHTML"] = _0x12e409;
      this["previewEl"] = document['createElement']("div");
      this['previewEl']["className"] = "img-node-preview aigen-node-preview-fill aigen-image-preview";
      this["imgEl"] = document["createElement"]("img");
      this["imgEl"]["draggable"] = ![];
      this["imgEl"]["className"] = "v2-media-preview aigen-image-media";
      const _0x527394 = document["createElement"]('div');
      _0x527394["className"] = "img-node-placeholder aigen-media-placeholder";
      _0x527394["innerHTML"] = "\n            <svg class=\"placeholder-icon-svg\" width=\"40\" height=\"40\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\" style=\"transition:all 0.2s;\">\n                <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/>\n                <circle cx=\"8.5\" cy=\"8.5\" r=\"1.5\"/>\n                <polyline points=\"21 15 16 10 5 21\"/>\n            </svg>";
      this['_maskOverlay'] = document["createElement"]("img");
      this["_maskOverlay"]["className"] = 'node-img-mask-overlay\x20aigen-image-mask-overlay';
      this["previewEl"]["appendChild"](this['imgEl']);
      this["previewEl"]["appendChild"](this["_maskOverlay"]);
      this["previewEl"]["appendChild"](_0x527394);
      this["_placeholderEl"] = _0x527394;
      syncPreviewNodeLoading(this['nodeId'], this["previewEl"], this["_getPreviewGenerateButtonLoadingOptions"]?.());
      _0x420632["appendChild"](this["previewEl"]);
      const _0x1122c8 = document['createElement']("div");
      _0x1122c8["className"] = 'node-resizer';
      _0x420632["appendChild"](_0x1122c8);
      this['_applyMaskPreview'](this["_data"]?.["maskPreviewUrl"] || this["_data"]?.["maskPreview"]);
      this['imgEl']["addEventListener"]("load", () => {
        if (this['imgEl']?.["dataset"]?.["lodSrc"] === "thumb") {
          return;
        }
        const _0xd9f1c0 = Number(this["imgEl"]?.["naturalWidth"] || 0x0);
        const _0x3e2bd4 = Number(this["imgEl"]?.["naturalHeight"] || 0x0);
        if (!(_0xd9f1c0 > 0x0 && _0x3e2bd4 > 0x0)) {
          return;
        }
        const _0x3cf9d4 = _0x3c49fd["getState"]()["nodes"]?.[this["nodeId"]];
        if (!_0x3cf9d4) {
          return;
        }
        const _0x4519ff = {};
        if (Number(_0x3cf9d4["imageWidth"] || 0x0) !== _0xd9f1c0) {
          _0x4519ff["imageWidth"] = _0xd9f1c0;
        }
        if (Number(_0x3cf9d4["imageHeight"] || 0x0) !== _0x3e2bd4) {
          _0x4519ff["imageHeight"] = _0x3e2bd4;
        }
        isRunningHubAiAppManifest(getModelManifest(_0x3cf9d4?.["model"])) && Object["assign"](_0x4519ff, buildRhAiAppResultDisplayPatch({
          'nodeData': _0x3cf9d4,
          'mediaWidth': _0xd9f1c0,
          'mediaHeight': _0x3e2bd4,
          'mediaKey': getRhAiAppImageResultMediaKey(_0x3cf9d4),
          'shortSide': getAIGenerationNodeSize()["width"]
        }));
        Object["keys"](_0x4519ff)['length'] > 0x0 && _0x3c49fd["updateNodeData"](this["nodeId"], _0x4519ff);
      });
      this["_rendererMediaDeferred"] !== !![] && this["_loadAndDisplayImage"]();
      const _0x4f8b = () => {
        if (this["_rendererMediaDeferred"] === !![]) {
          return;
        }
        const _0x3f34bc = Array['isArray'](this['_data']?.["images"]) ? this["_data"]["images"] : [];
        _0x3f34bc["length"] > 0x1 && void this['_loadAndDisplayImage']({
          'force': !![]
        });
      };
      typeof requestAnimationFrame === "function" ? requestAnimationFrame(_0x4f8b) : setTimeout(_0x4f8b, 0x0);
      const _0x4a1b13 = () => Array["isArray"](this["_data"]?.["images"]) && this['_data']["images"]['length'] > 0x1;
      const _0x414e9c = () => !_0x4a1b13() && (isCanvasLowZoomActive() || this["imgEl"]?.["dataset"]?.["lodSrc"] === "thumb");
      const _0x1d1b2e = () => {
        if (!_0x414e9c()) {
          return;
        }
        void this['_loadAndDisplayImage']({
          'force': !![]
        });
      };
      const _0x5d2fc5 = (_0x43564d = 0x0) => {
        this["_lowZoomHoverRefreshTimer"] && (clearTimeout(this["_lowZoomHoverRefreshTimer"]), this['_lowZoomHoverRefreshTimer'] = null);
        if (_0x43564d > 0x0) {
          this['_lowZoomHoverRefreshTimer'] = setTimeout(() => {
            this['_lowZoomHoverRefreshTimer'] = null;
            _0x414e9c() && setNodeMediaLodHoverPromoted(this["_root"], !![]);
            _0x1d1b2e();
          }, _0x43564d);
          return;
        }
        setNodeMediaLodHoverPromoted(this["_root"], ![]);
        _0x1d1b2e();
      };
      _0x420632["addEventListener"]("pointerenter", () => _0x5d2fc5(AIGEN_IMAGE_LOD_HOVER_REFRESH_DELAY_MS));
      _0x420632["addEventListener"]('pointerleave', () => _0x5d2fc5(0x0));
      this["imgEl"]["addEventListener"]("dblclick", async _0x56e619 => {
        _0x56e619["stopPropagation"]();
        await _0x541837(this["_data"], {
          'currentSrc': this["imgEl"]["currentSrc"] || this['imgEl']["src"] || ''
        });
      });
      const _0x556e72 = document["createElement"]("div");
      _0x556e72['className'] = 'text-prompt-panel';
      _0x556e72['addEventListener']("pointerdown", _0x5e6fee => {
        _0x5e6fee["stopPropagation"]();
      });
      this["_promptPanel"] = _0x556e72;
      _0x420632['addEventListener']('v2-node:free-angle', _0x479190 => {
        _0x479190["stopPropagation"]();
        this["_switchToFreeAngle"]();
      });
      _0x556e72["addEventListener"]("dblclick", _0x45644d => {
        !_0x45644d['target']["closest"](".prompt-textarea") && (_0x45644d["preventDefault"](), _0x45644d['stopPropagation']());
      });
      this['refBarEl'] = document["createElement"]("div");
      this["refBarEl"]['className'] = "node-ref-bar";
      this['refBarEl']["innerHTML"] = createPromptAttachmentButtonHTML({
        'stroke': "var(--white-90)"
      });
      _0x556e72['appendChild'](this["refBarEl"]);
      this["refBarEl"]["addEventListener"]("click", _0x1e6ea9 => {
        const _0x3d5027 = _0x1e6ea9["target"]["closest"](".prompt-attachment-btn");
        if (!_0x3d5027) {
          return;
        }
        if (_0x1e6ea9["_pickConnectHandled"]) {
          return;
        }
        _0x1e6ea9["stopPropagation"]();
        _0x1e6ea9["preventDefault"]();
        const _0x409d2 = _0x3c49fd["getState"]()["pickConnectMode"];
        _0x409d2 && _0x409d2['active'] && _0x409d2['sourceNodeId'] === this["nodeId"] ? _0x3c49fd["setPickConnectMode"]({
          'active': ![]
        }) : _0x3c49fd["setPickConnectMode"]({
          'active': !![],
          'sourceNodeId': this['nodeId'],
          'handleDirection': 'left'
        });
      });
      this["refBarEl"]["addEventListener"]('pointerdown', _0x477042 => {
        const _0x5a64f = _0x477042["target"]['closest'](".prompt-attachment-btn");
        _0x5a64f && _0x477042["stopPropagation"]();
      });
      this['_unbindRefThumbHoverPreview'] = _0x7ecab3(this["refBarEl"]);
      this["_refUploadInput"] = document["createElement"]("input");
      this["_refUploadInput"]['type'] = "file";
      this["_refUploadInput"]["accept"] = "image/*";
      this["_refUploadInput"]['style']["display"] = "none";
      _0x556e72['appendChild'](this["_refUploadInput"]);
      this["_refUploadInput"]["addEventListener"]("change", async _0x1e20d7 => {
        const _0x2e5b2c = _0x1e20d7['target']["files"]?.[0x0];
        if (!_0x2e5b2c) {
          return;
        }
        try {
          await this["_handleReferenceUploadFile"](_0x2e5b2c);
        } catch (_0x226dba) {
          window['showToast']?.(_0x226dba?.["message"] || t("aigenImage.upload.failedRetry"), "error");
        } finally {
          this["_pendingRefSlot"] = '';
          this["_refUploadInput"]["value"] = '';
        }
      });
      this['refBarEl']["addEventListener"]('click', _0x76540e => {
        if (handleRefThumbDeleteClick(this, _0x76540e)) {
          return;
        }
        const _0x39cb91 = _0x76540e["target"]["closest"]('.ref-upload-delete');
        if (_0x39cb91) {
          _0x76540e["stopPropagation"]();
          _0x76540e['preventDefault']();
          _0x3c49fd["updateNodeData"](this['nodeId'], buildImageInputGateClearPatch(getImageNodeInputGate(this["_data"]?.["model"])));
          return;
        }
        const _0x1f296a = _0x76540e["target"]["closest"](".ref-upload-slot");
        if (_0x1f296a) {
          _0x76540e["stopPropagation"]();
          _0x76540e["preventDefault"]();
          const _0x5108a9 = _0x3c49fd["getState"]()["nodes"]?.[this["nodeId"]];
          const _0x515ad0 = String(getImageNodeInputGate(_0x5108a9?.["model"])["kind"] || '') === "image";
          const _0x449ba0 = isRhPersonReplaceWorkflowModel(_0x5108a9?.["model"]);
          const _0x553b70 = getFixedInputSlotConfigFromManifest(_0x5108a9 || {});
          const _0x20c1a9 = String(_0x1f296a['dataset']["refSlot"] || _0x1f296a["dataset"]["slot"] || '')['trim']();
          const _0x516f2b = !!_0x20c1a9 && _0x553b70?.['visibleSlots']?.["includes"](_0x20c1a9) && _0x553b70?.["slotKindById"]?.[_0x20c1a9] === 'image';
          (_0x515ad0 || _0x449ba0 || _0x516f2b) && (this["_pendingRefSlot"] = _0x20c1a9, this['_refUploadInput']?.["click"]());
        }
      });
      this["refBarEl"]['addEventListener']("pointerdown", _0x2eb431 => {
        _0x2eb431["target"]["closest"]('.ref-thumb-wrap,\x20.ref-upload-slot,\x20.ref-upload-delete,\x20.ref-thumb-delete') && _0x2eb431['stopPropagation']();
      });
      const _0x40e96c = document["createElement"]("div");
      _0x40e96c['className'] = 'prompt-input-wrapper';
      _0x40e96c['classList']["add"]("is-resizable");
      this["_promptInputWrap"] = _0x40e96c;
      this["promptEl"] = document['createElement']("div");
      this["promptEl"]["className"] = "prompt-textarea custom-textarea";
      this["promptEl"]["contentEditable"] = "true";
      this["promptEl"]['spellcheck'] = ![];
      this['_syncPromptPlaceholder'](this["_data"]);
      document["documentElement"]["classList"]["add"]("node-prompt-styles-ready");
      this["_flushPromptHtmlCommit"] = () => flushPromptHtmlCommit(this);
      this["promptEl"]["addEventListener"]("input", _0x4775fd => {
        schedulePromptHtmlCommit(this);
        this["_checkAtTrigger"](_0x4775fd);
        _0x212e4b(_0x4775fd, {
          'promptEl': this["promptEl"],
          'nodeType': this['_data']["type"],
          'nodeId': this['nodeId'],
          'onGenerate': (_0x2ea092, _0x1a7cef) => this["_onGenerate"](_0x2ea092, _0x1a7cef)
        });
        if (shouldSkipPromptTriggerForBulkInput(_0x4775fd)) {
          return;
        }
        _0x34edc6(this);
        this["_updateSubmitButtonState"]();
      });
      this["promptEl"]['addEventListener']("blur", () => {
        flushPromptHtmlCommit(this);
      });
      this["promptEl"]["addEventListener"]("mouseover", _0x31d89f => {
        _0x122b31(_0x31d89f, this);
      });
      this["promptEl"]['addEventListener']('mouseout', _0x4e378e => {
        _0x399533(_0x4e378e, this);
      });
      this["promptEl"]['addEventListener']("keydown", _0x6a834b => {
        if (handlePromptSelectAll(this, _0x6a834b)) {
          return;
        }
        if (_0x4ad1f4(_0x6a834b)) {
          return;
        }
        if (_0x172fe0(_0x6a834b)) {
          return;
        }
        if (shouldSubmitPromptByKeyboard(_0x6a834b)) {
          _0x6a834b["preventDefault"]();
          flushPromptHtmlCommit(this);
          this['btnEl']?.["click"]();
          return;
        }
        _0x5b5222(this, _0x6a834b);
      });
      this["promptEl"]["addEventListener"]("paste", _0x58236d => {
        handlePromptPaste(this, _0x58236d);
      });
      _0x40e96c["appendChild"](this["promptEl"]);
      this["_syncPromptBoxSizeFromData"](this['_data']);
      this['_setupPromptBoxResize']();
      this["_data"]["prompt"] && (this['promptEl']["innerHTML"] = sanitizePromptHtml(this['_data']["prompt"]), _0x3503ec(this));
      this["_syncPromptInputVisibility"](this['_data']);
      _0x556e72["appendChild"](_0x40e96c);
      if (isImageFreeAngleOnlyModel(this["_data"]?.['model'])) {
        const _0x5c710c = {
          'model': DEFAULT_IMAGE_NODE_MODEL,
          'provider': DEFAULT_IMAGE_NODE_PROVIDER
        };
        this["_data"] = {
          ...this["_data"],
          ..._0x5c710c
        };
        _0x3c49fd["updateNodeData"](this["nodeId"], _0x5c710c);
      }
      attachGenerationNodePromptTools(this, {
        'panel': _0x556e72,
        'kind': 'image',
        'getKey': () => this["_data"]?.["model"],
        'getLabel': () => _0x5a63f6(this['_data']?.["model"])
      });
      attachNodePromptExpansion(this, {
        'panel': _0x556e72
      });
      this["_modelProviderProfileControl"]?.["remove"]?.();
      this['_modelProviderProfileControl'] = createModelProviderProfileControl({
        'panel': _0x556e72,
        'getNodeData': () => _0x416d2a()["nodes"]?.[this["nodeId"]] || this["_data"] || {},
        'onChange': _0x4f4d21 => _0x3c49fd["updateNodeData"](this["nodeId"], _0x4f4d21)
      });
      const _0x2b6382 = document["createElement"]("div");
      _0x2b6382["className"] = 'prompt-panel-footer';
      this['footerEl'] = _0x2b6382;
      const _0x106333 = normalizeDreaminaImageModel(this['_data']["model"] || DEFAULT_IMAGE_NODE_MODEL, this["_data"]?.['provider']);
      const _0x410358 = resolveCustomAiAppNodeManifest({
        ...this['_data'],
        'model': _0x106333
      });
      const _0x58e007 = isCustomAiAppManifest(_0x410358);
      const _0x37fee0 = _0x58e007;
      const _0x45f953 = isRhQwenImageEditModel(_0x106333);
      const _0x2ede84 = this['_data']?.["generationParams"] && typeof this["_data"]["generationParams"] === "object" && !Array["isArray"](this["_data"]["generationParams"]) ? this["_data"]["generationParams"] : {};
      const _0x299825 = _0x2ede84["imageSize"];
      const _0x4c8c34 = getNanoBananaSelectionFromModel(_0x106333, _0x299825 || '2K', this["_data"]?.["provider"]) || null;
      const _0xec96da = this["_getUiSchemaRenderNodeData"](this["_data"]);
      const _0x2295a8 = renderModelUiSchemaControls(_0x106333, _0xec96da, {
        'placement': "mode",
        'variant': 'pillMenu'
      });
      const _0x5c6166 = renderModelUiSchemaControls(_0x106333, _0xec96da, {
        'placement': "resolution",
        'variant': 'resolutionPill'
      });
      const _0x143a9f = renderModelUiSchemaControls(_0x106333, _0xec96da, {
        'placement': "advanced",
        'variant': "advancedRow"
      });
      const _0x1eeb03 = renderModelUiSchemaControls(_0x106333, _0xec96da, {
        'placement': 'instance',
        'variant': "instanceToggle"
      });
      const _0x34a830 = renderModelUiSchemaControls(_0x106333, _0xec96da, {
        'placement': "batch",
        'variant': "pillMenu"
      });
      const _0x5b7da8 = Boolean(_0x143a9f["trim"]());
      _0x2b6382["innerHTML"] = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22img-model-pills\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22img-model-wrap\x22\x20style=\x22position:relative;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22img-pill-btn\x20img-model-btn-trigger\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + renderImageModelTriggerIconHTML({
        'model': _0x106333,
        'provider': this['_data']?.['provider']
      }) + "\n                <span class=\"img-model-label\">" + _0x5a63f6(_0x106333) + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22img-model-menu-lazy-anchor\x22\x20data-lazy-model-menu=\x22image\x22></span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22ui-schema-placement\x20ui-schema-mode-slot\x22\x20style=\x22' + (_0x2295a8 ? '' : "display:none;") + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + _0x2295a8 + "\n            </div>\n            <div class=\"ui-schema-placement ui-schema-resolution-slot\" style=\"" + (_0x5c6166 ? '' : "display:none;") + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + _0x5c6166 + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22prompt-actions\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-adv-wrap\x22\x20style=\x22position:relative;' + (_0x5b7da8 && !_0x58e007 ? '' : "display:none;") + "\">\n              <button type=\"button\" class=\"img-pill-btn rh-adv-btn advanced-settings-icon-button\" data-tooltip=\"" + escapeHtmlAttr(t("aigenImage.controls.advancedSettings")) + '\x22\x20aria-label=\x22' + escapeHtmlAttr(t("aigenImage.controls.advancedSettings")) + "\" aria-expanded=\"false\">" + ADVANCED_SETTINGS_TUNE_ICON_MARKUP + "</button>\n            </div>\n            <div class=\"ui-schema-placement ui-schema-batch-slot\" style=\"" + (_0x34a830 ? '' : "display:none;") + "\">\n              " + _0x34a830 + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22ui-schema-placement\x20ui-schema-instance-slot\x22\x20style=\x22' + (_0x1eeb03 ? '' : 'display:none;') + "\">\n              " + _0x1eeb03 + "\n            </div>\n            <button type=\"button\" class=\"prompt-submit debug-wrench-btn\" title=\"" + t("aigenImage.controls.debugApiParams") + "\">\n              " + DEBUG_WRENCH_ICON_HTML + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22prompt-submit\x20img-gen-btn\x22\x20title=\x22' + t("aigenImage.controls.generate") + "\">\n              <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"5\"/><polyline points=\"5 12 12 5 19 12\"/></svg>\n            </button>\n          </div>";
      _0x2b6382["insertAdjacentHTML"]("beforeend", '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-adv-panel' + (_0x37fee0 && _0x5b7da8 ? " show " + RH_AI_APP_PERSISTENT_ADVANCED_CLASS : '') + "\">\n              " + _0x143a9f + "\n            </div>\n      ");
      const _0x4a8d80 = _0x2b6382["querySelector"](".rh-adv-panel");
      this['rhAdvPanelEl'] = _0x4a8d80;
      this["modelWrap"] = _0x2b6382["querySelector"](".img-model-wrap");
      this["rhAdvWrap"] = _0x2b6382["querySelector"]('.rh-adv-wrap');
      this["uiSchemaModeSlot"] = _0x2b6382['querySelector'](".ui-schema-mode-slot");
      this["uiSchemaResolutionSlot"] = _0x2b6382["querySelector"](".ui-schema-resolution-slot");
      this["uiSchemaInstanceSlot"] = _0x2b6382["querySelector"](".ui-schema-instance-slot");
      this['uiSchemaBatchSlot'] = _0x2b6382["querySelector"](".ui-schema-batch-slot");
      this["btnEl"] = _0x2b6382["querySelector"](".img-gen-btn");
      const _0x26e396 = _0x2b6382["querySelector"](".debug-wrench-btn");
      this["_syncImageLocale"] = () => {
        const _0x5859ae = t("aigenImage.controls.advancedSettings");
        const _0x5e08a4 = _0x2b6382['querySelector'](".rh-adv-btn");
        _0x5e08a4?.["setAttribute"]("data-tooltip", _0x5859ae);
        _0x5e08a4?.["setAttribute"]("aria-label", _0x5859ae);
        _0x26e396?.["setAttribute"]("title", t("aigenImage.controls.debugApiParams"));
        this["btnEl"]?.["setAttribute"]("title", t("aigenImage.controls.generate"));
        this['_syncPromptPlaceholder']?.(this["_data"]);
        this["_lastRefHTML"] = '';
        this["_renderRefBar"]?.();
        this['_updateSubmitButtonState']?.();
      };
      this["_unbindImageLocaleChange"]?.();
      this['_unbindImageLocaleChange'] = onLocaleChange(() => this["_syncImageLocale"]?.());
      this["_syncImageLocale"]();
      this['_uiSchemaCleanup']?.();
      this['_uiSchemaCleanup'] = bindModelUiSchemaControls(_0x2b6382, {
        'nodeId': this["nodeId"],
        'nodeData': this["_data"],
        'store': _0x3c49fd,
        'buildPatch': (_0x4b0f95, _0x2e8c30, _0x14fc3c) => {
          if (_0x2e8c30 !== "aspectRatio") {
            return {};
          }
          return this["_buildSchemaAspectRatioDisplayPatch"](_0x4b0f95, _0x14fc3c, {
            'forceManualDisplaySize': !![]
          });
        },
        'afterCommit': (_0x1eddbf, _0x743b53, _0x47833e, _0x200e6a = {}) => {
          _0x1eddbf === "aspectRatio" && this["_applySchemaAspectRatioResizeAnimation"](_0x200e6a['latest'], _0x200e6a['patch']);
        },
        'decorateNodeData': _0x35f268 => this["_getUiSchemaRenderNodeData"](_0x35f268)
      });
      this["_uiSchemaModel"] = _0x106333;
      this["_applyModelParamVisibility"]();
      _0x26e396?.["addEventListener"]("click", _0x2d10c6 => {
        _0x2d10c6['stopPropagation']();
        if (globalThis['window']?.["DEV_MODE"] !== !![]) {
          return;
        }
        flushPromptHtmlCommit(this);
        openDebugRequestWindow({
          'prepare': async () => {
            const _0xf797c = await this['_buildPayload']();
            if (!_0xf797c) {
              throw new Error("请先填写提示词或连接参考素材。");
            }
            try {
              return buildFinalApiDebugPreview(await _0x54e9b7["buildGenerateImageRequest"](_0xf797c));
            } finally {
              releasePayloadObjectUrlLease(_0xf797c);
            }
          }
        });
      });
      const _0x5770c8 = _0x2b6382["querySelector"](".img-model-btn-trigger");
      let _0x260dab = null;
      const _0x239d96 = _0x2b6382['querySelector']('.img-model-label');
      const _0x35cc64 = _0x2b6382["querySelector"](".rh-res-popup");
      const _0x3767a7 = _0x2b6382["querySelector"](".rh-adv-btn");
      const _0x23adb4 = () => {
        _0x2b6382["querySelectorAll"]('.ui-schema-floating-menu')["forEach"](_0x2b4886 => _0x2b4886["classList"]["remove"]("show"));
        _0x2b6382["querySelectorAll"](".ui-schema-popup")["forEach"](_0x1855d0 => {
          _0x1855d0["style"]["display"] = "none";
        });
      };
      const _0x377663 = () => _0x260dab && _0x260dab["isConnected"] ? _0x260dab : null;
      const _0x2da6dd = ({
        keepModelMenu = ![]
      } = {}) => {
        if (!keepModelMenu) {
          _0x377663()?.["classList"]["remove"]("show");
        }
        if (_0x35cc64) {
          _0x35cc64["style"]["display"] = "none";
        }
        _0x4a8d80 && !_0x4a8d80["classList"]["contains"](RH_AI_APP_PERSISTENT_ADVANCED_CLASS) && (_0x4a8d80['classList']["remove"]("show"), _0x3767a7?.["setAttribute"]('aria-expanded', "false"));
      };
      const _0x438d2e = _0x4a2494 => _0x4a2494 && typeof _0x4a2494 === 'object' && !Array['isArray'](_0x4a2494) ? {
        ..._0x4a2494
      } : {};
      const _0x3c6061 = (_0x7b44e2, _0x1c1383, _0x4fa7dd, _0x247725 = {}) => {
        const _0xac8f0f = String(_0x7b44e2?.["model"] || '')["trim"]();
        const _0x1d986f = String(_0x1c1383 || '')["trim"]();
        const _0x2966fd = _0x438d2e(_0x7b44e2?.["generationParamsByModel"]);
        _0xac8f0f && (_0x2966fd[_0xac8f0f] = _0x438d2e(_0x7b44e2?.['generationParams']));
        const _0x3ae0b1 = Object["prototype"]["hasOwnProperty"]["call"](_0x247725, "generationParams");
        const _0x29d338 = _0x3ae0b1 ? _0x438d2e(_0x247725["generationParams"]) : {};
        const _0x5dfd0b = _0x1d986f ? _0x2966fd[_0x1d986f] : undefined;
        const _0xf10e95 = buildModelUiSchemaDefaultParams(_0x1d986f);
        const _0x46b6a1 = getModelManifest(_0x1d986f);
        const _0x349b3b = new Set((_0x46b6a1?.['uiSchema']?.["fields"] || [])["map"](_0x50aecd => String(_0x50aecd?.['id'] || '')["trim"]()));
        const _0x32a38e = {};
        ["imageSize", 'aspectRatio', "mode", "batchSize"]["forEach"](_0x5ad31b => {
          _0x349b3b["has"](_0x5ad31b) && Object["prototype"]["hasOwnProperty"]['call'](_0x247725, _0x5ad31b) && (_0x32a38e[_0x5ad31b] = _0x247725[_0x5ad31b]);
        });
        const _0x5d22db = {
          ..._0xf10e95,
          ..._0x438d2e(_0x5dfd0b),
          ...(_0x3ae0b1 ? _0x29d338 : {}),
          ..._0x32a38e
        };
        const _0x42ec5d = sanitizeModelUiSchemaParams(_0x1d986f, Object["fromEntries"](Object['entries'](_0x5d22db)["filter"](([_0x1c4465]) => _0x349b3b["has"](_0x1c4465))));
        const {
          generationParams: _0x42e184,
          ..._0x5deb68
        } = _0x247725;
        const _0x34c50e = {
          ..._0x5deb68
        };
        _0x349b3b["forEach"](_0x1e9588 => {
          delete _0x34c50e[_0x1e9588];
        });
        const _0x294b87 = buildModelProviderProfileSelectionPatch(_0x7b44e2, _0x1d986f, _0x247725?.["providerProfileId"]);
        const _0x412824 = buildGenerationModelSelectionDisplayPatch({
          'store': _0x3c49fd,
          'nodeId': this['nodeId'],
          'nodeData': _0x7b44e2,
          'fallbackNodeData': this["_data"],
          'modelId': _0x1d986f,
          'generationParams': _0x42ec5d,
          'minSide': getAIGenerationNodeSize()['width'],
          'getRefKindByNodeType': _0xfccb38,
          'resultMediaElement': this["imgEl"]
        });
        return {
          ..._0x34c50e,
          ..._0x294b87,
          'model': _0x1d986f,
          'provider': _0x4fa7dd,
          'generationParams': _0x42ec5d,
          'generationParamsByModel': _0x2966fd,
          ..._0x412824
        };
      };
      const _0x300bb3 = {
        'listenConfigChanges': ![],
        'getProviderProfileId': () => {
          const _0x1a7a86 = _0x416d2a()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
          return _0x1a7a86['providerProfileId'] || _0x1a7a86['rhProviderProfileId'] || '';
        }
      };
      const _0x232a22 = _0x265121 => {
        this["_modelCredentialMenuCleanup"]?.();
        this["_modelCredentialMenuCleanup"] = bindModelCredentialMenu(_0x265121, _0x300bb3);
        bindImageModelMenuGroups({
          'modelMenu': _0x265121,
          'modelTrigger': _0x5770c8,
          'modelLabel': _0x239d96,
          'nodeId': this['nodeId'],
          'store': _0x3c49fd,
          'fallbackNodeData': this["_data"],
          'buildModelPatch': _0x3c6061,
          'workflowSelectionPolicy': {
            'onDisabled': () => window["showToast"]?.(t("aigenImage.modelMenu.unavailable", {
              'model': t("aigenImage.modelMenu.personReplaceV3.title")
            }), "warn"),
            'beforeSelect': ({
              item: _0x2aba4f,
              model: _0x3f5559,
              provider: _0x2f71eb
            }) => {
              const _0x2ed797 = this["_runVipRetryOnce"](() => _0x2aba4f["click"]());
              return this['_guardVipSelection'](_0x3f5559, _0x2f71eb, _0x2ed797);
            }
          },
          'afterSelect': ({
            latestNode: _0x12deb0,
            patch: _0x2b2e50
          }) => this["_applySchemaAspectRatioResizeAnimation"](_0x12deb0, _0x2b2e50)
        });
        bindCustomRelayQuickAdd(_0x265121, { 'kind': "image" });
      };
      const _0x51f9df = () => {
        const _0x21e1bf = _0x377663();
        if (_0x21e1bf) {
          return _0x21e1bf;
        }
        if (!this["modelWrap"]) {
          return null;
        }
        const _0x38e768 = _0x416d2a()["nodes"]?.[this['nodeId']] || this["_data"] || {};
        const _0x47cb2a = normalizeDreaminaImageModel(_0x38e768["model"] || DEFAULT_IMAGE_NODE_MODEL, _0x38e768["provider"]);
        const _0x2f86c2 = _0x38e768?.["generationParams"] && typeof _0x38e768['generationParams'] === "object" && !Array["isArray"](_0x38e768['generationParams']) ? _0x38e768["generationParams"] : {};
        const _0x4481bb = getNanoBananaSelectionFromModel(_0x47cb2a, _0x2f86c2["imageSize"] || '2K', _0x38e768?.['provider']) || null;
        const _0x36fce3 = document['createElement']('template');
        _0x36fce3["innerHTML"] = buildImageModelMenuHTML({
          'activeModel': _0x47cb2a,
          'nanoSelection': _0x4481bb,
          'customRelayQuickAdd': !![]
        })["trim"]();
        const _0xd47e04 = _0x36fce3["content"]["firstElementChild"];
        if (!_0xd47e04) {
          return null;
        }
        const _0x5df5fc = this["modelWrap"]['querySelector']('[data-lazy-model-menu=\x27image\x27]');
        _0x5df5fc ? _0x5df5fc['replaceWith'](_0xd47e04) : this["modelWrap"]["appendChild"](_0xd47e04);
        _0x260dab = _0xd47e04;
        _0x232a22(_0xd47e04);
        return _0xd47e04;
      };
      const _0x52b466 = () => {
        const _0x443c5e = _0x51f9df();
        _0x443c5e && void syncModelCredentialMenu(_0x443c5e, _0x300bb3);
        return _0x443c5e;
      };
      const _0x3a2b53 = bindNodeModelMenuPrewarm({
        'trigger': _0x5770c8,
        'prepare': _0x52b466
      });
      this['_refreshModelRegistryUi'] = () => {
        this['_modelCredentialMenuCleanup']?.();
        this["_modelCredentialMenuCleanup"] = null;
        _0x377663()?.["remove"]();
        _0x260dab = null;
        const _0x28de0d = _0x416d2a()["nodes"]?.[this['nodeId']] || this['_data'] || {};
        const _0x412676 = document["createElement"]("template");
        _0x412676['innerHTML'] = renderImageModelTriggerIconHTML({
          'model': _0x28de0d["model"] || DEFAULT_IMAGE_NODE_MODEL,
          'provider': _0x28de0d["provider"]
        })["trim"]();
        const _0x14f895 = _0x412676["content"]["firstElementChild"];
        const _0xaf50fd = _0x5770c8?.["firstElementChild"];
        if (_0x14f895 && _0xaf50fd) {
          _0xaf50fd['replaceWith'](_0x14f895);
        }
        if (this['modelWrap'] && !this["modelWrap"]["querySelector"]("[data-lazy-model-menu='image']")) {
          const _0x511ccf = document["createElement"]("span");
          _0x511ccf["className"] = "img-model-menu-lazy-anchor";
          _0x511ccf["dataset"]["lazyModelMenu"] = "image";
          this["modelWrap"]["appendChild"](_0x511ccf);
        }
        this["_updateSubmitButtonState"]?.();
        return !![];
      };
      _0x5770c8?.['addEventListener']("click", _0x5723e2 => {
        _0x5723e2["stopPropagation"]();
        const _0x47e815 = _0x3a2b53["prepareNow"]();
        if (!_0x47e815) {
          return;
        }
        const _0x37fcad = !_0x47e815['classList']["contains"]("show");
        closeNodeFooterMenus(_0x2b6382, _0x47e815);
        _0x2da6dd({
          'keepModelMenu': !![]
        });
        _0x23adb4();
        _0x47e815['classList']["toggle"]("show", _0x37fcad);
        _0x37fcad && typeof _0x276159 === "function" && _0x276159(_0x47e815);
      });
      _0x3767a7 && _0x4a8d80 && (_0x3767a7["addEventListener"]("click", _0xf132e2 => {
        _0xf132e2['stopPropagation']();
        const _0xde00f9 = _0x4a8d80['classList']["toggle"]("show");
        _0x3767a7["setAttribute"]("aria-expanded", String(_0xde00f9));
        _0x377663()?.['classList']["remove"]('show');
        if (_0x35cc64) {
          _0x35cc64["style"]['display'] = "none";
        }
        _0x23adb4();
      }), _0x4a8d80["addEventListener"]("click", _0x633748 => _0x633748['stopPropagation']()));
      this["btnEl"]['addEventListener']("click", () => {
        flushPromptHtmlCommit(this);
        this["_handleGenerateOrCancel"]();
      });
      this['_footerControllerCleanup']?.();
      const _0x58beb7 = bindNodeFooterController(_0x2b6382, {
        'onDocumentClick': () => {
          _0x377663()?.['classList']["remove"]('show');
          if (_0x35cc64) {
            _0x35cc64["style"]["display"] = "none";
          }
          _0x23adb4();
        }
      });
      const _0x223d3b = () => {
        _0x3a2b53['destroy']();
        _0x58beb7();
      };
      this["_footerControllerCleanup"] = bindGenerationNodeCredentialLifecycle(this, _0x223d3b);
      _0x2b6382["appendChild"](document["createTextNode"](''));
      _0x556e72['appendChild'](_0x2b6382);
      _0x420632["appendChild"](_0x556e72);
      this["_rendererMediaDeferred"] === !![] ? this["_renderRefBarPendingWhenVisible"] = !![] : this["_renderRefBar"]();
      this['_assetMentionRegistryUnsubscribe']?.();
      this["_assetMentionRegistryUnsubscribe"] = subscribeAssetMentionRegistry(() => {
        if (this["_assetMentionRegistryRefreshPending"]) {
          return;
        }
        this["_assetMentionRegistryRefreshPending"] = !![];
        queueMicrotask(() => {
          this["_assetMentionRegistryRefreshPending"] = ![];
          if (!_0x416d2a()["nodes"]?.[this["nodeId"]]) {
            return;
          }
          _0x3503ec(this);
          if (this["_rendererMediaDeferred"] === !![]) {
            this["_renderRefBarPendingWhenVisible"] = !![];
            return;
          }
          this["_renderRefBar"]();
          this['_updateSubmitButtonState']();
        });
      });
      const _0x1cb9b3 = getImageNodeRootClass(this["_data"]?.["model"]);
      if (_0x1cb9b3) {
        _0x420632['classList']["add"](_0x1cb9b3);
      }
      isRhPersonReplaceWorkflowModel(this["_data"]?.['model']) && _0x420632["classList"]["add"]("rh-person-replace-v3-node");
      const _0x54d609 = _0x420632['querySelector'](".node-floating-toolbar");
      _0x2c5555(_0x54d609, this["nodeId"]);
      this["_qualityBtns"] = _0x420632 ? Array['from'](_0x420632['querySelectorAll'](".img-rp-quality-item")) : [];
      const _0x3286df = this["refBarEl"]?.["querySelector"](".prompt-attachment-btn");
      this['_attachBtnIcon'] = _0x3286df ? _0x3286df["querySelector"]('.btn-icon') : null;
      _0x1122c8 && _0x1122c8["addEventListener"]("pointerdown", _0x67e404 => {
        const _0xca0afa = _0x3c49fd["getStateRaw"]()['ui']?.["imageVideoNodeResizeEnabled"] === !![];
        const _0x50c3f8 = document['getElementById']('v2-wrap')?.["classList"]["contains"]("v2-media-node-resize-enabled");
        if (!(_0xca0afa && _0x50c3f8)) {
          return;
        }
        if (_0x67e404['button'] !== 0x0) {
          return;
        }
        _0x67e404['preventDefault']();
        _0x67e404["stopPropagation"]();
        startNodeResizePreview({
          'event': _0x67e404,
          'nodeId': this["nodeId"],
          'getNode': () => _0x3c49fd["getStateRaw"]()['nodes']?.[this["nodeId"]] || this["_data"],
          'getViewport': () => _0x3c49fd["getStateRaw"]()["viewport"],
          'resolveSize': ({
            startWidth: _0x425053,
            startHeight: _0x431e14,
            dx: _0x1d7e40,
            dy: _0x244dcb
          }) => {
            const _0x3ed1b7 = _0x425053 / _0x431e14;
            const _0x58a27b = Math["max"](_0x1d7e40 / _0x425053, _0x244dcb / _0x431e14);
            const _0x38222a = Math["max"](AI_IMAGE_MIN_SIZE / _0x425053, AI_IMAGE_MIN_SIZE / _0x431e14);
            const _0x407400 = Math['max'](_0x38222a, 0x1 + _0x58a27b);
            const _0x30bcbb = Math["max"](AI_IMAGE_MIN_SIZE, Math['round'](_0x425053 * _0x407400));
            const _0xdaaa99 = Math["max"](AI_IMAGE_MIN_SIZE, Math["round"](_0x30bcbb / _0x3ed1b7));
            return {
              'width': _0x30bcbb,
              'height': _0xdaaa99
            };
          },
          'buildFinalPatch': ({
            startNode: _0x30e32c,
            startSize: _0x585d57,
            finalSize: _0x424c02
          }) => {
            const _0x3f9ff2 = {};
            if (_0x30e32c?.["needsAutoResize"]) {
              _0x3f9ff2['needsAutoResize'] = ![];
            }
            const _0x395e58 = Math["round"](Number(_0x585d57?.['width']) || 0x0) !== Math["round"](Number(_0x424c02?.["width"]) || 0x0) || Math["round"](Number(_0x585d57?.["height"]) || 0x0) !== Math['round'](Number(_0x424c02?.["height"]) || 0x0);
            _0x395e58 && (_0x3f9ff2[GENERATION_MANUAL_DISPLAY_SIZE_FIELD] = !![]);
            return _0x3f9ff2;
          },
          'applyPatch': _0x140a46 => _0x3c49fd['updateNodeData'](this["nodeId"], _0x140a46),
          'commit': commit
        });
      });
      this['_updateSubmitButtonState']();
      queueMicrotask(() => {
        if (_0x416d2a()["nodes"]?.[this["nodeId"]]) {
          this["resumeGeneration"]?.();
        }
      });
      return _0x420632;
    }
    ['hydrateDeferredMedia']() {
      if (this["_rendererMediaDeferred"] !== !![]) {
        return;
      }
      this["_rendererMediaDeferred"] = ![];
      void this['_loadAndDisplayImage']({
        'force': !![]
      });
      this["_applyMaskPreview"](this["_data"]?.['maskPreviewUrl'] || this["_data"]?.["maskPreview"]);
      this["_renderRefBarPendingWhenVisible"] = ![];
      this["_renderRefBar"]?.();
    }
    async ['_switchToFreeAngle']() {
      if (!this['_promptPanel']) {
        return;
      }
      if (_0x3d0809["active"] && _0x3d0809["nodeId"] === this["nodeId"]) {
        _0x3d0809["_exit"]();
        return;
      }
      if (window["v2FocusOnNodeAtZoomPercent"]) {
        window["v2FocusOnNodeAtZoomPercent"](this["nodeId"], 0x3c);
      }
      const _0xdd1911 = this['_root']['querySelector'](".act-multiangle");
      await _0x3d0809["render"](this["nodeId"], this["_promptPanel"], () => this["_switchToPrompt"](), () => this["_onGenerate"](), _0xdd1911);
    }
    ['_switchToPrompt']() {
      if (!this["_promptPanel"]) {
        return;
      }
      this["_promptPanel"]["innerHTML"] = '';
      const _0x176bf8 = this["modelWrap"]?.["closest"]('.prompt-panel-footer');
      const _0x5a3b54 = this["promptEl"]?.["closest"]('.prompt-input-wrapper');
      if (this["refBarEl"]) {
        this["_promptPanel"]["appendChild"](this["refBarEl"]);
      }
      if (_0x5a3b54) {
        this["_promptPanel"]["appendChild"](_0x5a3b54);
      }
      if (_0x176bf8) {
        this["_promptPanel"]['appendChild'](_0x176bf8);
      }
      this["_renderRefBar"]();
      this["_generationNodeHelpTip"]?.["sync"]();
      this["_modelProviderProfileControl"]?.["sync"]();
    }
    ['_updateSubmitButtonState']() {
      if (!this["btnEl"]) {
        return;
      }
      if (this["_generationSubmitInFlight"] === !![]) {
        setGenerateButtonLoadingUi(this["btnEl"], {
          'title': t("aigenImage.task.submitting"),
          'disabled': !![],
          'ariaLabel': t('aigenImage.task.submitting')
        });
        return;
      }
      const _0xfcf703 = _0x416d2a() || {};
      const _0xb3cf64 = _0xfcf703?.["nodes"] || {};
      const _0x42cb6f = _0xb3cf64?.[this["nodeId"]] || this["_data"] || {};
      const _0x188052 = typeof _0x3c49fd["getIncomingEdges"] === "function" ? _0x3c49fd['getIncomingEdges'](this["nodeId"]) : [];
      const _0x3c3994 = resolvePromptTextWithTextRefs({
        'promptEl': this['promptEl'],
        'inEdges': _0x188052,
        'nodes': _0xb3cf64
      });
      const _0x100d5a = this['_isRunninghubWorkflowModel'](_0x42cb6f?.["model"], _0x42cb6f?.["provider"]);
      const _0x76c3bb = getImageNodeInputGate(_0x42cb6f?.["model"]);
      const _0x280d22 = String(_0x76c3bb["kind"] || '') === "image";
      const _0x5c8548 = resolveCustomAiAppNodeManifest(_0x42cb6f);
      const _0x4c6613 = _0x5c8548 || getModelManifest(_0x42cb6f?.['model']);
      const _0x3b4043 = shouldAllowEmptyCustomAiAppInputs(_0x4c6613);
      const _0x25c125 = getFixedInputSlotConfigFromManifest(_0x42cb6f, {
        'manifest': _0x4c6613
      });
      const _0x2bc708 = collectSubmitButtonInputRecords({
        'latestNode': _0x42cb6f,
        'nodes': _0xb3cf64,
        'inEdges': _0x188052,
        'imageInputGate': _0x76c3bb
      });
      const _0x6a9544 = countManifestInputRecords(_0x2bc708);
      const _0x2a3c30 = buildFixedSlotOccupancy({
        'fixedInputConfig': _0x25c125,
        'inputRecords': _0x2bc708
      });
      const _0x6b8354 = _0x3b4043 ? null : getMissingManifestInputRequirement({
        'inputSlots': _0x4c6613?.['inputSlots'],
        'fixedInputConfig': _0x25c125,
        'inputCounts': _0x6a9544,
        'occupiedFixedSlots': _0x2a3c30
      });
      const _0x4ffce9 = Object["values"](_0x6a9544)["some"](_0x1791d4 => Number(_0x1791d4) > 0x0);
      const _0x5bb606 = shouldUseImageWorkflowBusyButton(_0x42cb6f?.["model"]);
      const _0x230a42 = resolveGenerationButtonMode(_0x42cb6f, {
        'cancellable': _0x100d5a,
        'cancelInFlight': this["_rhCancelInFlight"] === !![]
      });
      if (_0x230a42["busy"]) {
        _0x100d5a ? setGenerateButtonCancellableUi(this["btnEl"], {
          'title': t("aigenImage.controls.cancelTaskTooltip"),
          'tooltip': t('aigenImage.controls.cancelTaskTooltip'),
          'ariaLabel': t("aigenImage.controls.cancelGenerate"),
          'busy': _0x5bb606
        }) : setGenerateButtonLoadingUi(this["btnEl"], {
          'title': t("aigenImage.controls.generate"),
          'disabled': !![],
          'ariaLabel': t("aigenImage.controls.generate")
        });
        this["btnEl"]["disabled"] = _0x230a42['disabled'];
        this["btnEl"]["style"]["cursor"] = _0x230a42["cursor"];
        return;
      }
      resetGenerateButtonIdleUi(this['btnEl'], t('aigenImage.controls.generate'));
      resetModelCredentialButtonState(this['btnEl']);
      const _0x3c3758 = () => applyModelCredentialButtonState(this["btnEl"], {
        'modelId': _0x42cb6f?.["model"],
        'provider': _0x42cb6f?.["provider"],
        'providerProfileId': _0x42cb6f?.["providerProfileId"] || _0x42cb6f?.["rhProviderProfileId"]
      });
      if (_0x100d5a) {
        if (_0x6b8354) {
          this["btnEl"]["disabled"] = !![];
          this["btnEl"]["style"]["cursor"] = 'var(--unavailable-cursor)';
          return;
        }
        if (_0x280d22) {
          const _0x214e90 = !!getImageInputGateUploadedUrl(_0x42cb6f, _0x76c3bb);
          const _0x13b79c = _0x188052["some"](_0x547c47 => _0xfccb38(_0xb3cf64[_0x547c47["sourceId"]]?.['type'] || '') === "image");
          const _0x3a9dd2 = _0x214e90 || _0x13b79c;
          this["btnEl"]['disabled'] = !_0x3a9dd2;
          this["btnEl"]["style"]["cursor"] = _0x3a9dd2 ? '' : "var(--unavailable-cursor)";
          if (_0x3a9dd2) {
            _0x3c3758();
          }
          return;
        }
        this["btnEl"]["disabled"] = ![];
        this["btnEl"]["style"]["cursor"] = '';
        _0x3c3758();
        return;
      }
      const _0x412306 = evaluateGenerationPromptBoundary({
        'model': _0x42cb6f?.["model"],
        'provider': _0x42cb6f?.['provider'],
        'promptText': _0x3c3994,
        'hasInput': _0x4ffce9
      });
      this["btnEl"]["disabled"] = !_0x412306['ok'];
      this["btnEl"]["style"]["cursor"] = _0x412306['ok'] ? '' : "var(--unavailable-cursor)";
      if (_0x412306['ok']) {
        _0x3c3758();
      }
    }
    ['_hydrateStoredThumbsInBackground'](_0x468e58, _0x57b2b3) {
      return hydrateStoredImageThumbsInBackground(this, _0x468e58, _0x57b2b3, _0x8e25c3);
    }
    async ["_loadAndDisplayImage"](_0x316b44 = {}) {
      if (this["_rendererMediaDeferred"] === !![] && _0x316b44?.["force"] !== !![]) {
        return;
      }
      const _0x539e4c = (Number(this["_imageDisplayLoadToken"]) || 0x0) + 0x1;
      this["_imageDisplayLoadToken"] = _0x539e4c;
      const _0x2845fe = () => this["_imageDisplayLoadToken"] !== _0x539e4c;
      const _0x43cce6 = _0x316b44?.['force'] === !![];
      const _0x376b05 = this["_data"]["images"] || [];
      _0x376b05['length'] === 0x0 && (this["_data"]['imageUrl'] || this["_data"]["localPath"] || this["_data"]["thumbUrl"] || this["_data"]["thumbId"]) && _0x376b05["push"]({
        'imageUrl': this['_data']["imageUrl"],
        'sourceUrl': this["_data"]['sourceUrl'],
        'thumbUrl': this["_data"]["thumbUrl"],
        'sourceId': this['_data']['sourceId'],
        'thumbId': this["_data"]["thumbId"],
        'localPath': this["_data"]["localPath"],
        'originalLocalPath': this["_data"]["originalLocalPath"],
        'displayLocalPath': this["_data"]["displayLocalPath"],
        'thumbLocalPath': this['_data']['thumbLocalPath']
      });
      const _0x25b55f = String(this['_data']["rhStatusMessage"] || '')['trim']() || (String(this["_data"]["jobStatus"] || '')['toLowerCase']() === "error" ? getTaskMessage(this['_data']) : '');
      const _0x3d6412 = this["_data"]['rhStatusCode'];
      if (_0x25b55f && _0x376b05["length"] === 0x0) {
        this["imgEl"]["style"]["display"] = "none";
        delete this["imgEl"]['dataset']["lodSrc"];
        clearCanvasImageDisplayHandoff(this["imgEl"]);
        this["imgEl"]["src"] = '';
        if (this["_placeholderEl"]) {
          this['_placeholderEl']['style']['display'] = "none";
        }
        this['_multiImagesContainer'] && (this['_multiImagesContainer']["querySelectorAll"]?.("img")["forEach"](_0x3367c5 => clearCanvasImageDisplayHandoff(_0x3367c5)), this['_multiImagesContainer']["remove"](), this["_multiImagesContainer"] = null);
        this["_flushPendingImageObjectUrlReleases"]();
        clearMultiResultStackClasses({
          'previewEl': this['previewEl'],
          'stackWrap': this['_multiStackWrap']
        });
        this["_multiStackWrap"] = null;
        this['_multiBackdropWrap'] = null;
        this["_multiBackplateKeyStr"] = '';
        !this['_statusOverlayEl'] && (this["_statusOverlayEl"] = document["createElement"]('div'), Object["assign"](this["_statusOverlayEl"]['style'], {
          'position': "absolute",
          'inset': '0',
          'display': "flex",
          'alignItems': "center",
          'justifyContent': 'center',
          'pointerEvents': "none"
        }), this["previewEl"]['appendChild'](this["_statusOverlayEl"]));
        this["_statusOverlayEl"]["innerHTML"] = '';
        this["_statusOverlayEl"]["appendChild"](this["_createStatusCard"](_0x25b55f, _0x3d6412));
        return;
      }
      this["_statusOverlayEl"] && (this['_statusOverlayEl']['remove'](), this["_statusOverlayEl"] = null);
      const _0x42bd93 = this["_data"]["isImagesExpanded"] || ![];
      let _0x579006 = this["_data"]['mainImageIndex'] || 0x0;
      if (_0x579006 >= _0x376b05['length']) {
        _0x579006 = 0x0;
      }
      const _0x340df8 = buildMultiResultBackplateItems({
        'imageCount': _0x376b05["length"],
        'mainIndex': _0x579006
      });
      const _0x47d50c = _0x376b05["map"]((_0x39e3bf, _0x1789d5) => buildCanvasImageResultIdentityKey(_0x39e3bf, this["_data"], _0x1789d5))['join'](',');
      const _0x3ff57b = _0x376b05["map"]((_0x569d2e, _0x585fb6) => buildCanvasImageResultIdentityKey(_0x569d2e, this["_data"], _0x585fb6));
      const _0x89761d = _0x47d50c !== this["_lastImagesKeyStr"];
      const _0x378430 = _0x579006 !== this["_lastMainIdx"];
      const _0x577532 = _0x42bd93 !== this["_lastIsExpanded"];
      const _0x2ff2a0 = this["_shouldUseLowZoomThumbnail"]() ? 'thumb' : 'full';
      const _0x37cfff = _0x2ff2a0 !== this['_lastImageLodMode'];
      const _0x5e32b9 = shouldRefreshMultiResultStackDom({
        'imageCount': _0x376b05["length"],
        'previewEl': this["previewEl"],
        'containerEl': this['_multiImagesContainer'],
        'stackWrap': this["_multiStackWrap"],
        'backdropWrap': this["_multiBackdropWrap"],
        'backplateItems': _0x340df8
      });
      if (!_0x43cce6 && !_0x89761d && !_0x378430 && !_0x577532 && !_0x37cfff && !_0x5e32b9) {
        return;
      }
      this["_lastImagesKeyStr"] = _0x47d50c;
      this["_lastMainIdx"] = _0x579006;
      this["_lastIsExpanded"] = _0x42bd93;
      this["_lastImageLodMode"] = _0x2ff2a0;
      (this["_currentSourceId"] !== this["_data"]["sourceId"] || this["_currentLocalPath"] !== pickCanvasImageLocalPath(this["_data"])) && (this["_cachedSourceUrl"] && this["_cachedSourceUrl"]["startsWith"]("blob:") && this['_queueImageObjectUrlRelease'](this["_cachedSourceUrl"]), this["_cachedSourceUrl"] = null, this['_currentSourceId'] = this['_data']["sourceId"], this["_currentLocalPath"] = pickCanvasImageLocalPath(this["_data"]));
      if (_0x376b05['length'] === 0x0) {
        this["imgEl"]['style']["display"] = 'none';
        delete this["imgEl"]['dataset']["lodSrc"];
        clearCanvasImageDisplayHandoff(this["imgEl"]);
        this["imgEl"]["src"] = '';
        if (this["_placeholderEl"]) {
          this["_placeholderEl"]['style']["display"] = "flex";
        }
        this["_multiImagesContainer"] && (this["_multiImagesContainer"]["querySelectorAll"]?.("img")["forEach"](_0x44ecb7 => clearCanvasImageDisplayHandoff(_0x44ecb7)), this["_multiImagesContainer"]["remove"](), this["_multiImagesContainer"] = null);
        this["_flushPendingImageObjectUrlReleases"]();
        clearMultiResultStackClasses({
          'previewEl': this["previewEl"],
          'stackWrap': this["_multiStackWrap"]
        });
        this["_multiStackWrap"] = null;
        this['_multiBackdropWrap'] = null;
        this["_multiBackplateKeyStr"] = '';
        return;
      }
      if (_0x47d50c !== this['_resolvedUrlsKey'] || !this['_resolvedMainUrls'] || !this["_resolvedAuxUrls"]) {
        const _0x2e6be9 = new Set(_0x376b05["map"](_0x1c852f => _0x1c852f["thumbId"])["filter"](Boolean));
        for (const [_0xf26ebc, _0x340134] of this["_thumbObjectUrls"]["entries"]()) {
          !_0x2e6be9["has"](_0xf26ebc) && (_0x340134 && String(_0x340134)['startsWith']("blob:") && this["_queueImageObjectUrlRelease"](_0x340134), this["_thumbObjectUrls"]["delete"](_0xf26ebc));
        }
        const _0x5b652f = [];
        const _0x4f634d = [];
        const _0x5633d6 = [];
        for (const _0x583516 of _0x376b05) {
          const _0x18e3b4 = toLocalPathUrl(pickCanvasImageLocalPath(_0x583516));
          const _0x44ddfa = toLocalPathUrl(pickCanvasThumbLocalPath(_0x583516));
          const _0x2d4819 = [_0x583516["imageUrl"], _0x583516["sourceUrl"], _0x583516["thumbUrl"]]["map"](_0x59a77e => toLocalPathUrl(_0x59a77e))["find"](Boolean) || '';
          const _0x5ab6ce = _0x583516['thumbId'] ? this["_thumbObjectUrls"]['get'](_0x583516["thumbId"]) || '' : '';
          const _0xc29f45 = _0x18e3b4 || _0x2d4819 || _0x5ab6ce;
          const _0x5cf255 = _0x44ddfa || _0xc29f45 || _0x2d4819 || _0x5ab6ce;
          _0x583516['thumbId'] && !_0x5ab6ce && _0x5633d6["push"](_0x583516["thumbId"]);
          _0x5b652f["push"](_0xc29f45);
          _0x4f634d["push"](_0x5cf255);
        }
        if (_0x2845fe()) {
          return;
        }
        this["_resolvedUrlsKey"] = _0x47d50c;
        this['_resolvedMainUrls'] = _0x5b652f;
        this["_resolvedAuxUrls"] = _0x4f634d;
        this["_hydrateStoredThumbsInBackground"](_0x5633d6, _0x47d50c);
      }
      const _0x1d9a1e = this["_resolvedMainUrls"] || [];
      const _0x330144 = this["_resolvedAuxUrls"] || _0x1d9a1e;
      if (this["_placeholderEl"]) {
        const _0x54fc8d = [..._0x1d9a1e, ..._0x330144]["some"](Boolean);
        const _0x1dadf6 = _0x376b05['some'](_0x12550c => Boolean(_0x12550c?.["error"]));
        this['_placeholderEl']['style']["display"] = _0x54fc8d || _0x1dadf6 ? "none" : 'flex';
      }
      if (_0x376b05["length"] === 0x1) {
        this["_multiImagesContainer"] && (this["_multiImagesContainer"]["querySelectorAll"]?.("img")["forEach"](_0x1ebdcc => clearCanvasImageDisplayHandoff(_0x1ebdcc)), this["_multiImagesContainer"]["remove"](), this["_multiImagesContainer"] = null, this["_flushPendingImageObjectUrlReleases"]());
        clearMultiResultStackClasses({
          'previewEl': this['previewEl'],
          'stackWrap': this["_multiStackWrap"]
        });
        this["_multiStackWrap"] = null;
        this['_multiBackdropWrap'] = null;
        this["_multiBackplateKeyStr"] = '';
        const _0x3d26d9 = _0x376b05[0x0];
        if (_0x3d26d9["error"]) {
          this["imgEl"]["style"]["display"] = 'none';
          delete this["imgEl"]["dataset"]["lodSrc"];
          clearCanvasImageDisplayHandoff(this["imgEl"]);
          this["imgEl"]["src"] = '';
          this["_flushPendingImageObjectUrlReleases"]();
          this["_multiImagesContainer"] = document['createElement']("div");
          Object["assign"](this['_multiImagesContainer']["style"], {
            'position': "absolute",
            'inset': '0',
            'display': 'flex',
            'alignItems': "center",
            'justifyContent': "center"
          });
          this["_multiImagesContainer"]['appendChild'](this['_createErrorCard'](_0x3d26d9["error"]));
          this['previewEl']["appendChild"](this['_multiImagesContainer']);
        } else {
          const _0x12b73e = this["_pickImageDisplayUrl"](_0x1d9a1e[0x0], _0x330144[0x0], {
            'lowZoomThumbnail': !![]
          });
          const _0x495ef6 = this["_pickImageDisplayUrl"](_0x1d9a1e[0x0], _0x330144[0x0]);
          this['_setImageElementDisplaySource'](this["imgEl"], _0x495ef6, {
            'versionKey': _0x3ff57b[0x0],
            'previewLod': _0x12b73e
          });
        }
        return;
      }
      this["imgEl"]["style"]["display"] = "none";
      this["_root"]?.["style"]["setProperty"]("overflow", "visible");
      const _0x280eb7 = this['_pickImageDisplayUrl'](_0x1d9a1e[_0x579006], _0x330144[_0x579006]);
      this["_setImageElementDisplaySource"](this["imgEl"], _0x280eb7, {
        'display': ![],
        'versionKey': _0x3ff57b[_0x579006]
      });
      !this['_multiImagesContainer'] && (this["_multiImagesContainer"] = document["createElement"]("div"), this["_multiImagesContainer"]["className"] = "multi-images-container", this['_multiImagesContainer']["style"]['width'] = "100%", this['_multiImagesContainer']["style"]["height"] = "100%", this["_multiImagesContainer"]['style']["position"] = "absolute", this["_multiImagesContainer"]['style']['top'] = '0', this["_multiImagesContainer"]['style']["left"] = '0', this["previewEl"]['appendChild'](this['_multiImagesContainer']));
      this["_multiImagesContainer"]["style"]["width"] = "100%";
      this['_multiImagesContainer']["style"]["height"] = '100%';
      this['_multiImagesContainer']["style"]["display"] = 'block';
      const _0x1631db = _0x376b05["length"];
      const _0x5eeb9e = AIGEN_IMAGE_MULTI_STACK_MOTION_DURATION_MS;
      let _0x5e236a = () => {};
      const _0x2e183e = getMultiResultBackplateKey(_0x340df8);
      const _0x2f0019 = getMultiResultBackplateIdentityKey(_0x340df8);
      const _0x3732bd = this['_data']["width"] || this['_root']['clientWidth'] || 0x140;
      const _0x3724be = this["_data"]["height"] || this["_root"]["clientHeight"] || Math["round"](_0x3732bd * 0x9 / 0x10);
      const _0x115e48 = (_0x887566, _0xfa2a51 = {}) => {
        const _0x308b9e = _0xfa2a51?.["immediateDisplayLod"];
        for (let _0x4d8803 = 0x0; _0x4d8803 < _0x1631db; _0x4d8803 += 0x1) {
          const _0x35d435 = _0x4d8803 === _0x887566;
          const _0x2c5af4 = this["_multiLayerEls"][_0x4d8803];
          const _0x28a4de = this["_multiErrorEls"][_0x4d8803];
          _0x2c5af4 && (_0x35d435 ? (_0x308b9e?.["url"] && this["_setImageElementDisplaySource"](_0x2c5af4, _0x308b9e, {
            'display': !![],
            'versionKey': _0x3ff57b[_0x4d8803]
          }), this['_loadLazyImageDisplaySource'](_0x2c5af4)) : this["_scheduleClearLazyImageDisplaySource"](_0x2c5af4, AIGEN_IMAGE_HIDDEN_SOURCE_CLEAR_DELAY_MS), _0x2c5af4["style"]["display"] = _0x35d435 ? "block" : "none", _0x2c5af4['style']['pointerEvents'] = _0x35d435 ? '' : "none", _0x35d435 && (_0x2c5af4["style"]['transform'] = "rotate(0deg) scale(1)", _0x2c5af4["style"]["opacity"] = '1', _0x2c5af4["style"]["zIndex"] = _0x1631db + 0x1, _0x2c5af4["style"]["boxShadow"] = "0 4px 12px var(--black-40)"));
          _0x28a4de && (_0x28a4de["style"]["display"] = _0x35d435 ? "flex" : "none", _0x28a4de["style"]["zIndex"] = _0x35d435 ? _0x1631db + 0x1 : _0x4d8803);
        }
        this["_lastMainIdx"] = _0x887566;
      };
      const _0xa8721c = _0x15d7f3 => {
        if (!_0x15d7f3?.['_multiBackplateMediaHideTimer']) {
          return;
        }
        clearTimeout(_0x15d7f3['_multiBackplateMediaHideTimer']);
        _0x15d7f3["_multiBackplateMediaHideTimer"] = null;
      };
      const _0x333c4d = (_0x18911b, _0x36edb0 = {}) => {
        if (!_0x18911b) {
          return ![];
        }
        const _0x191c2b = Number(_0x18911b["consumedImageIndex"]);
        const _0x55df44 = Number(_0x18911b["replacementImageIndex"]);
        if (!Number['isFinite'](_0x191c2b) || !Number['isFinite'](_0x55df44)) {
          return ![];
        }
        const _0x3cfc04 = this["_multiBackplateEls"]?.[_0x191c2b];
        if (!_0x3cfc04) {
          return ![];
        }
        _0x3cfc04["_multiBackplateRetargetMediaTimer"] && (clearTimeout(_0x3cfc04["_multiBackplateRetargetMediaTimer"]), _0x3cfc04["_multiBackplateRetargetMediaTimer"] = null);
        this['_multiBackplateEls'][_0x191c2b] = null;
        this["_multiBackplateEls"][_0x55df44] = _0x3cfc04;
        _0x3cfc04['dataset']['imageIndex'] = String(_0x55df44);
        const _0x5c6656 = () => {
          const _0x7a2b31 = _0x376b05[_0x55df44];
          const _0x588db5 = _0x3cfc04['querySelector'](".multi-stack-backplate-media");
          if (_0x7a2b31?.["error"]) {
            _0x588db5 && (_0xa8721c(_0x588db5), this["_clearLazyImageDisplaySource"](_0x588db5), _0x588db5["remove"]?.());
            return;
          }
          const _0x12c841 = this["_pickImageDisplayUrl"](_0x1d9a1e[_0x55df44], _0x330144[_0x55df44], {
            'lowZoomThumbnail': ![]
          });
          const _0x353378 = _0x588db5 || (() => {
            const _0xe3d6e4 = document['createElement']("img");
            _0xe3d6e4['className'] = "multi-stack-backplate-media";
            _0xe3d6e4["decoding"] = 'async';
            _0xe3d6e4["draggable"] = ![];
            _0xe3d6e4["addEventListener"]('dragstart', _0x3786e0 => _0x3786e0["preventDefault"]());
            _0x3cfc04["appendChild"](_0xe3d6e4);
            return _0xe3d6e4;
          })();
          _0xa8721c(_0x353378);
          this["_setLazyImageDisplaySource"](_0x353378, _0x12c841, {
            'versionKey': _0x3ff57b[_0x55df44]
          });
          this["_clearLazyImageDisplaySource"](_0x353378);
          _0x353378["style"]["opacity"] = '0';
          _0x353378["style"]['transform'] = "scale(1.02)";
        };
        const _0x1129f7 = Math["max"](0x0, Number(_0x36edb0?.["deferMediaSwitchMs"]) || 0x0);
        if (_0x1129f7 > 0x0 && _0x3cfc04["classList"]?.['contains']("is-expanded-card")) {
          _0x3cfc04["_multiBackplateRetargetMediaTimer"] = setTimeout(() => {
            _0x3cfc04['_multiBackplateRetargetMediaTimer'] = null;
            _0x5c6656();
          }, _0x1129f7);
          return !![];
        }
        _0x5c6656();
        return !![];
      };
      const _0xec8173 = _0x23b68d => {
        const _0xaf79d1 = _0x3c49fd["getState"]()["nodes"][this["nodeId"]];
        const _0x24cadc = _0xaf79d1["images"] || [];
        if (_0x24cadc["length"] === 0x0) {
          return;
        }
        const _0x2d2010 = _0x24cadc[_0x23b68d] ? _0x23b68d : 0x0;
        const _0x237a1e = _0x24cadc[_0x2d2010] || _0x24cadc[0x0];
        const _0x4c9df4 = this['_multiBackplateEls']?.[_0x2d2010];
        const _0xd06d3b = _0x4c9df4?.["querySelector"](".multi-stack-backplate-media");
        const _0x5872e4 = _0xd06d3b ? {
          'url': _0xd06d3b["currentSrc"] || _0xd06d3b["src"] || _0xd06d3b['dataset']?.['lazySrc'] || '',
          'lod': _0xd06d3b["dataset"]?.["lazyLodSrc"] || "full"
        } : null;
        const _0x9a4753 = resolveMultiResultMainSwap({
          'imageCount': _0x24cadc["length"],
          'previousMainIndex': _0x579006,
          'nextMainIndex': _0x2d2010
        });
        _0x115e48(_0x2d2010, {
          'immediateDisplayLod': _0x5872e4
        });
        if (_0x333c4d(_0x9a4753, {
          'deferMediaSwitchMs': _0x5eeb9e + AIGEN_IMAGE_BACKPLATE_MEDIA_HIDE_CLEAR_DELAY_MS + 0x28
        })) {
          const _0x2e8f4e = buildMultiResultBackplateItems({
            'imageCount': _0x24cadc["length"],
            'mainIndex': _0x2d2010
          });
          this["_multiBackplateKeyStr"] = getMultiResultBackplateKey(_0x2e8f4e);
        }
        syncMultiResultStackClasses({
          'previewEl': this["previewEl"],
          'stackWrap': this['_multiStackWrap'],
          'isActive': _0x1631db > 0x1,
          'isExpanded': ![]
        });
        _0x345af8(this["_multiToggleBtn"], ![]);
        _0x5e236a(![]);
        setTimeout(() => {
          _0x3c49fd['updateNodeData'](this["nodeId"], {
            'mainImageIndex': _0x2d2010,
            'isImagesExpanded': ![],
            'imageUrl': _0x237a1e["imageUrl"],
            'sourceUrl': _0x237a1e["sourceUrl"],
            'thumbUrl': _0x237a1e["thumbUrl"],
            'sourceId': _0x237a1e["sourceId"],
            'thumbId': _0x237a1e['thumbId'],
            ...buildImageNodeStorageFields(_0x237a1e)
          });
        }, _0x5eeb9e);
      };
      const _0x345af8 = (_0xda7e18, _0x1b4ec3) => {
        if (!_0xda7e18) {
          return;
        }
        const _0x2bfb86 = {
          'bg': "var(--black-45)",
          'color': 'var(--white-90)',
          'border': "1px solid var(--white-15)"
        };
        const _0xec908e = {
          'bg': "var(--black-70)",
          'color': "var(--white-80)",
          'border': "1px solid transparent"
        };
        const _0x44e90d = _0x1b4ec3 ? _0xec908e : _0x2bfb86;
        _0xda7e18["innerHTML"] = _0x1b4ec3 ? '<span>' + t("aigenImage.result.imageCount", {
          'count': _0x1631db
        }) + "</span><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"9 18 15 12 9 6\"></polyline></svg>" : "<span>" + t("aigenImage.result.imageCount", {
          'count': _0x1631db
        }) + "</span><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>";
        _0xda7e18["style"]['background'] = _0x44e90d['bg'];
        _0xda7e18["style"]["color"] = _0x44e90d["color"];
        _0xda7e18["style"]["border"] = _0x44e90d["border"];
      };
      const _0xa2e71d = getMultiResultBackplateCount(_0x1631db);
      const _0x401984 = this["_multiStackWrap"]?.["parentNode"] === this["_multiImagesContainer"];
      const _0x4486f8 = Number(this["_multiBackdropWrap"]?.["children"]?.["length"]) || 0x0;
      const _0x1e52f9 = getMultiResultBackplateDomIdentityKey(this["_multiBackdropWrap"]);
      const _0x5945a8 = _0x89761d || _0x378430 || !_0x401984 || _0x4486f8 !== _0xa2e71d || _0x1e52f9 !== _0x2f0019 || this["_multiBackplateKeyStr"] !== _0x2e183e;
      if (_0x5945a8) {
        this['_multiImagesContainer']['querySelectorAll']?.("img")["forEach"](_0x3a2ed1 => clearCanvasImageDisplayHandoff(_0x3a2ed1));
        this["_multiImagesContainer"]["innerHTML"] = '';
        this['_flushPendingImageObjectUrlReleases']();
        this["_multiLayerEls"] = [];
        this["_multiErrorEls"] = [];
        this['_multiBackplateEls'] = [];
        this["_multiToggleBtn"] = null;
        this['_multiBackdropWrap'] = null;
        this['_multiStackCardsLaidOut'] = ![];
        this["_multiStackWrap"] = document["createElement"]('div');
        this["_multiStackWrap"]["className"] = MULTI_RESULT_STACK_WRAP_CLASS;
        Object['assign'](this['_multiStackWrap']["style"], {
          'position': "relative",
          'width': '100%',
          'height': "100%"
        });
        this["_multiBackdropWrap"] = createMultiResultBackplates(document, _0x1631db, {
          'items': _0x340df8
        });
        this["_multiBackdropWrap"] && (this["_multiStackWrap"]["appendChild"](this['_multiBackdropWrap']), this["_multiBackdropWrap"]["querySelectorAll"]('.' + MULTI_RESULT_BACKPLATE_CLASS)["forEach"](_0x4ec966 => {
          const _0x4ba860 = Number(_0x4ec966["dataset"]?.["imageIndex"]);
          if (!Number["isFinite"](_0x4ba860)) {
            return;
          }
          this["_multiBackplateEls"][_0x4ba860] = _0x4ec966;
          const _0x4e3761 = this["_pickImageDisplayUrl"](_0x1d9a1e[_0x4ba860], _0x330144[_0x4ba860], {
            'lowZoomThumbnail': ![]
          });
          const _0x54338f = _0x376b05[_0x4ba860];
          if (!_0x54338f?.["error"]) {
            const _0x3e0a2d = document['createElement']("img");
            _0x3e0a2d["className"] = 'multi-stack-backplate-media';
            this["_setLazyImageDisplaySource"](_0x3e0a2d, _0x4e3761, {
              'versionKey': _0x3ff57b[_0x4ba860]
            });
            _0x3e0a2d['decoding'] = "async";
            _0x3e0a2d["draggable"] = ![];
            _0x3e0a2d['addEventListener']('dragstart', _0x5e7b6a => _0x5e7b6a["preventDefault"]());
            _0x4ec966["appendChild"](_0x3e0a2d);
          }
          const _0x34a8e8 = this['_bindResultImageDragOut'](_0x4ec966, {
            'imageIndex': _0x4ba860,
            'getImageIndex': () => Number(_0x4ec966["dataset"]?.["imageIndex"]),
            'getGhostSourceElement': () => _0x4ec966["querySelector"]("img") || _0x4ec966,
            'getFallbackSrc': () => {
              const _0x396fbf = Number(_0x4ec966["dataset"]?.["imageIndex"]);
              const _0x482e3b = this["_pickImageDisplayUrl"](_0x1d9a1e[_0x396fbf], _0x330144[_0x396fbf], {
                'lowZoomThumbnail': ![]
              });
              return _0x4ec966["querySelector"]("img")?.["currentSrc"] || _0x4ec966["querySelector"]("img")?.["src"] || _0x482e3b["url"] || '';
            },
            'getFallbackSize': () => ({
              'width': this["previewEl"]?.["offsetWidth"] || this["_data"]?.["width"] || 0x140,
              'height': this["previewEl"]?.["offsetHeight"] || this["_data"]?.["height"] || 0x140
            })
          });
          _0x4ec966["addEventListener"]("pointerdown", _0x724559 => {
            const _0x183a25 = _0x3c49fd['getState']()["nodes"][this["nodeId"]];
            _0x183a25?.["isImagesExpanded"] && _0x724559["stopPropagation"]();
          });
          _0x4ec966["addEventListener"]("click", _0x18ea00 => {
            if (_0x34a8e8()) {
              _0x18ea00['preventDefault']();
              _0x18ea00["stopPropagation"]();
              return;
            }
            const _0x1e1dfd = _0x3c49fd["getState"]()['nodes'][this["nodeId"]];
            if (!_0x1e1dfd?.["isImagesExpanded"]) {
              return;
            }
            _0x18ea00["stopPropagation"]();
            const _0xd2299a = Number(_0x4ec966["dataset"]?.["imageIndex"]);
            _0xec8173(_0xd2299a);
          });
        }));
        this["_multiBackplateKeyStr"] = _0x2e183e;
        for (let _0x5f40e5 = _0x1631db - 0x1; _0x5f40e5 >= 0x0; _0x5f40e5--) {
          const _0x2746af = document["createElement"]("img");
          const _0x2cae9f = this["_pickImageDisplayUrl"](_0x1d9a1e[_0x5f40e5], _0x330144[_0x5f40e5]);
          this['_setLazyImageDisplaySource'](_0x2746af, _0x2cae9f, {
            'versionKey': _0x3ff57b[_0x5f40e5],
            'previewLod': this["_pickImageDisplayUrl"](_0x1d9a1e[_0x5f40e5], _0x330144[_0x5f40e5], {
              'lowZoomThumbnail': !![]
            })
          });
          this["_applyImageElementLod"](_0x2746af, _0x2cae9f["lod"]);
          _0x2746af["decoding"] = 'async';
          _0x2746af["draggable"] = ![];
          _0x2746af['addEventListener']('dragstart', _0x2b1aee => _0x2b1aee["preventDefault"]());
          _0x2746af["style"]["position"] = "absolute";
          _0x2746af["style"]["top"] = '0';
          _0x2746af['style']['left'] = '0';
          _0x2746af['style']['width'] = "100%";
          _0x2746af["style"]["height"] = '100%';
          _0x2746af['style']['objectFit'] = 'contain';
          _0x2746af['style']["borderRadius"] = "18px";
          _0x2746af["style"]['transition'] = "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)";
          _0x2746af["style"]["transformOrigin"] = 'top\x20left';
          _0x2746af["classList"]["add"]("v2-media-preview");
          const _0x5559af = this["_bindResultImageDragOut"](_0x2746af, {
            'imageIndex': _0x5f40e5,
            'isEnabled': _0x22ea9e => shouldEnableMultiResultLayerDragOut({
              'isImagesExpanded': _0x22ea9e?.["isImagesExpanded"],
              'imageCount': _0x22ea9e?.['images']?.['length'],
              'imageIndex': _0x5f40e5,
              'mainImageIndex': _0x22ea9e?.['mainImageIndex']
            }),
            'getGhostSourceElement': () => _0x2746af,
            'getFallbackSrc': () => _0x2746af['currentSrc'] || _0x2746af["src"] || '',
            'getFallbackSize': () => ({
              'width': this['previewEl']?.["offsetWidth"] || this['_data']?.["width"] || 0x140,
              'height': this["previewEl"]?.['offsetHeight'] || this["_data"]?.["height"] || 0x140
            })
          });
          _0x2746af["addEventListener"]("click", _0x24ed01 => {
            if (_0x5559af()) {
              _0x24ed01['preventDefault']();
              _0x24ed01["stopPropagation"]();
              return;
            }
            const _0x420934 = _0x3c49fd['getState']()["nodes"][this["nodeId"]];
            _0x420934["isImagesExpanded"] && (_0x24ed01["stopPropagation"](), _0xec8173(this["_lastMainIdx"] || 0x0));
          });
          _0x2746af["addEventListener"]("dblclick", async _0x274749 => {
            _0x274749['stopPropagation']();
            const _0x16f3d1 = this['_lastMainIdx'] || 0x0;
            const _0x34fed4 = _0x3c49fd["getState"]()["nodes"][this["nodeId"]];
            const _0xb6d31f = _0x34fed4['images'] || [];
            const _0x59e652 = _0xb6d31f[_0x16f3d1] || _0xb6d31f[0x0];
            await _0x541837(_0x59e652, {
              'currentSrc': _0x2746af['currentSrc'] || _0x2746af["src"] || ''
            });
          });
          if (_0x376b05[_0x5f40e5]["error"]) {
            const _0x335595 = this["_createErrorCard"](_0x376b05[_0x5f40e5]["error"]);
            _0x335595["style"]['position'] = 'absolute';
            _0x335595["style"]["inset"] = '0';
            this['_multiErrorEls'][_0x5f40e5] = _0x335595;
            this['_multiStackWrap']["appendChild"](_0x335595);
          } else {
            this["_multiLayerEls"][_0x5f40e5] = _0x2746af;
            this["_multiStackWrap"]["appendChild"](_0x2746af);
          }
        }
        this['_multiToggleBtn'] = document['createElement']('div');
        this["_multiToggleBtn"]["className"] = 'multi-toggle-btn';
        Object["assign"](this['_multiToggleBtn']["style"], {
          'position': "absolute",
          'top': "8px",
          'right': "8px",
          'zIndex': 0x3ed,
          'padding': '6px\x2012px',
          'borderRadius': "6px",
          'display': "flex",
          'alignItems': 'center',
          'gap': '6px',
          'cursor': "pointer",
          'userSelect': "none",
          'fontSize': "15px",
          'fontWeight': "500",
          'backdropFilter': "blur(4px)",
          'transition': "all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)"
        });
        this["_multiToggleBtn"]['addEventListener']("pointerdown", _0x1363bf => {
          if (_0x1363bf["button"] !== 0x0) {
            return;
          }
          _0x1363bf["preventDefault"]();
          _0x1363bf["stopPropagation"]();
          const _0x1aa59e = _0x3c49fd["getState"]()["nodes"][this["nodeId"]];
          const _0x477cc9 = !!_0x1aa59e["isImagesExpanded"];
          _0x477cc9 ? _0xec8173(_0x1aa59e["mainImageIndex"] ?? this["_lastMainIdx"] ?? 0x0) : (this["_removeCurrentNodeFromSelection"](), _0x3c49fd["updateNodeData"](this["nodeId"], {
            'isImagesExpanded': !![]
          }));
        });
        this["_multiToggleBtn"]['addEventListener']('mouseenter', () => _0x345af8(this["_multiToggleBtn"], !![]));
        this["_multiToggleBtn"]["addEventListener"]("mouseleave", () => {
          const _0x3971ea = _0x3c49fd["getState"]()["nodes"][this['nodeId']];
          _0x345af8(this["_multiToggleBtn"], !!_0x3971ea["isImagesExpanded"]);
        });
        this["_multiToggleBtn"]["addEventListener"]("click", _0x230e13 => {
          _0x230e13['preventDefault']();
          _0x230e13["stopPropagation"]();
        });
        this["_multiStackWrap"]['appendChild'](this["_multiToggleBtn"]);
        this["_multiImagesContainer"]['appendChild'](this["_multiStackWrap"]);
      }
      syncMultiResultStackClasses({
        'previewEl': this["previewEl"],
        'stackWrap': this["_multiStackWrap"],
        'isActive': _0x1631db > 0x1,
        'isExpanded': _0x42bd93
      });
      _0x345af8(this["_multiToggleBtn"], _0x42bd93);
      for (let _0x184e6d = 0x0; _0x184e6d < _0x1631db; _0x184e6d++) {
        const _0x5aa777 = _0x184e6d === _0x579006;
        const _0x37b094 = this["_multiLayerEls"][_0x184e6d];
        const _0x243b28 = this["_multiErrorEls"][_0x184e6d];
        if (_0x37b094) {
          const _0x233681 = this["_pickImageDisplayUrl"](_0x1d9a1e[_0x184e6d], _0x330144[_0x184e6d]);
          this['_setLazyImageDisplaySource'](_0x37b094, _0x233681, {
            'versionKey': _0x3ff57b[_0x184e6d],
            'previewLod': this['_pickImageDisplayUrl'](_0x1d9a1e[_0x184e6d], _0x330144[_0x184e6d], {
              'lowZoomThumbnail': !![]
            })
          });
          this["_applyImageElementLod"](_0x37b094, _0x233681['lod']);
          if (_0x5aa777) {
            this["_loadLazyImageDisplaySource"](_0x37b094);
          } else {
            this["_scheduleClearLazyImageDisplaySource"](_0x37b094, AIGEN_IMAGE_HIDDEN_SOURCE_CLEAR_DELAY_MS);
          }
          _0x37b094["style"]["display"] = _0x5aa777 ? "block" : 'none';
          _0x37b094["style"]["pointerEvents"] = _0x5aa777 ? '' : "none";
          _0x5aa777 && (_0x37b094['style']["transform"] = "rotate(0deg) scale(1)", _0x37b094["style"]["opacity"] = '1', _0x37b094['style']['zIndex'] = _0x1631db + 0x1, _0x37b094["style"]["boxShadow"] = "0 4px 12px var(--black-40)");
        }
        _0x243b28 && (_0x243b28["style"]["display"] = _0x5aa777 ? 'flex' : "none", _0x243b28['style']["zIndex"] = _0x5aa777 ? _0x1631db + 0x1 : _0x184e6d);
      }
      const _0x1d659e = this["previewEl"]['offsetWidth'] || _0x3732bd;
      const _0x13e3c4 = this["previewEl"]["offsetHeight"] || _0x3724be;
      const _0xe45732 = 0xc;
      const _0x453d2 = 0x26;
      const _0x2e2f29 = 0x12;
      const _0x198f7a = Math["max"](0x1, _0x1d659e - _0x453d2 - 0x4);
      const _0x24e702 = Math['max'](0x1, _0x13e3c4 - _0x2e2f29 * 0x2);
      const _0x2db073 = (_0x154b36, _0x31737e) => {
        const _0x1635a3 = Number["parseFloat"](_0x154b36);
        return Number['isFinite'](_0x1635a3) ? _0x1635a3 : _0x31737e;
      };
      const _0x252ed5 = _0x45580f => "translate(" + _0x45580f['x'] + "px, " + _0x45580f['y'] + 'px)\x20rotate(' + _0x45580f["rotate"] + "deg) scale(" + _0x45580f["scale"] + ')';
      const _0x1a3d6c = 'all\x200.46s\x20cubic-bezier(0.175,\x200.885,\x200.32,\x201.27),\x20filter\x200.4s\x20ease-out';
      const _0x50babe = (_0x3082f3, _0x17b958) => {
        Object["assign"](_0x3082f3["style"], {
          'top': _0x17b958['top'] + 'px',
          'left': _0x17b958['left'] + 'px',
          'width': _0x17b958['width'] + 'px',
          'height': _0x17b958['height'] + 'px',
          'opacity': String(_0x17b958["opacity"]),
          'pointerEvents': _0x17b958['pointerEvents'],
          'zIndex': String(_0x17b958['zIndex']),
          'borderRadius': _0x17b958["borderRadius"],
          'transform': _0x17b958["transform"],
          'filter': _0x17b958["filter"],
          'transformOrigin': _0x17b958["transformOrigin"]
        });
      };
      const _0x17f173 = ({
        plate: _0x4642eb,
        fromFrame: _0x3be10b,
        toFrame: _0x51e8d9
      }) => {
        if (!_0x4642eb) {
          return;
        }
        _0x4642eb["style"]['transition'] = "none";
        _0x50babe(_0x4642eb, _0x3be10b);
        _0x4642eb["getBoundingClientRect"]?.();
        requestAnimationFrame(() => {
          _0x4642eb["style"]['transition'] = _0x1a3d6c;
          _0x50babe(_0x4642eb, _0x51e8d9);
        });
      };
      const _0x4287de = () => {
        return buildMultiResultExpandedSlotMap({
          'imageCount': _0x1631db,
          'mainIndex': _0x579006,
          'previewWidth': _0x1d659e,
          'previewHeight': _0x13e3c4,
          'gap': _0xe45732
        });
      };
      _0x5e236a = _0x285333 => {
        const _0x1a3929 = _0x4287de();
        const _0x330008 = this['_multiBackdropWrap']?.["querySelectorAll"]?.('.' + MULTI_RESULT_BACKPLATE_CLASS);
        _0x330008?.['forEach'](_0x2d73cb => {
          const _0x1bab53 = Number(_0x2d73cb["dataset"]?.["imageIndex"]);
          const _0x2f45e9 = Math['max'](0x1, Number(_0x2d73cb["dataset"]?.["stackIndex"]) || 0x1);
          const _0x2017da = buildMultiResultCollapsedFrame(_0x2f45e9);
          const _0x3ab917 = _0x1a3929['get'](_0x1bab53);
          const _0x165729 = !!_0x285333 && !!_0x3ab917;
          const _0x4c317d = _0x2d73cb["querySelector"](".multi-stack-backplate-media");
          const _0x4320f0 = _0x2d73cb["classList"]["contains"]("is-expanded-card");
          const _0x314780 = !_0x165729 && _0x4320f0 && this["_multiStackCardsLaidOut"];
          const _0x500ee6 = {
            'top': _0x2db073(_0x2d73cb['style']["top"], _0x2e2f29),
            'left': _0x2db073(_0x2d73cb["style"]['left'], _0x453d2),
            'width': _0x2db073(_0x2d73cb["style"]["width"], _0x198f7a),
            'height': _0x2db073(_0x2d73cb["style"]["height"], _0x24e702)
          };
          const _0x2aa419 = _0x252ed5(_0x2017da);
          const _0xe68f89 = {
            'top': _0x2e2f29,
            'left': _0x453d2,
            'width': _0x198f7a,
            'height': _0x24e702,
            'opacity': _0x2017da["opacity"],
            'pointerEvents': "none",
            'zIndex': _0x2f45e9,
            'borderRadius': "0 var(--radius-16) var(--radius-16) 0",
            'transform': _0x2aa419,
            'filter': 'brightness(0.86)\x20saturate(0.92)',
            'transformOrigin': "center right"
          };
          const _0x35b41d = {
            'top': _0x165729 ? _0x3ab917['top'] : _0x500ee6['top'],
            'left': _0x165729 ? _0x3ab917["left"] : _0x500ee6["left"],
            'width': _0x1d659e,
            'height': _0x13e3c4,
            'opacity': 0x1,
            'pointerEvents': 'auto',
            'zIndex': _0x165729 ? 0x2 + _0x3ab917["order"] : _0x2f45e9,
            'borderRadius': "18px",
            'transform': "translate(0px, 0px) rotate(0deg) scale(1)",
            'filter': "brightness(1) saturate(1)",
            'transformOrigin': "bottom left"
          };
          const _0x2e42d4 = _0x4320f0 ? _0x35b41d : _0xe68f89;
          const _0x3e92a9 = _0x165729 ? _0x35b41d : _0xe68f89;
          const _0x2b05d4 = !!this["_multiStackCardsLaidOut"] && _0x4320f0 !== _0x165729;
          _0x2d73cb['classList']['toggle']("is-expanded-card", _0x165729);
          _0x2d73cb["style"]['display'] = 'block';
          if (_0x4c317d) {
            if (_0x165729) {
              _0xa8721c(_0x4c317d);
              this["_loadLazyImageDisplaySource"](_0x4c317d);
            } else {
              _0x314780 ? (this["_cancelLazyImageDisplayClear"](_0x4c317d), _0xa8721c(_0x4c317d), _0x4c317d["_multiBackplateMediaHideTimer"] = setTimeout(() => {
                _0x4c317d["_multiBackplateMediaHideTimer"] = null;
                if (_0x2d73cb['classList']["contains"]('is-expanded-card')) {
                  return;
                }
                _0x4c317d['style']["opacity"] = '0';
                _0x4c317d["style"]["transform"] = 'scale(1.02)';
                this["_scheduleClearLazyImageDisplaySource"](_0x4c317d, AIGEN_IMAGE_BACKPLATE_MEDIA_HIDE_CLEAR_DELAY_MS);
              }, _0x5eeb9e)) : (_0xa8721c(_0x4c317d), this['_clearLazyImageDisplaySource'](_0x4c317d));
            }
            _0x4c317d["style"]['opacity'] = _0x165729 || _0x314780 ? '1' : '0';
            _0x4c317d["style"]["transform"] = _0x165729 || _0x314780 ? 'scale(1)' : "scale(1.02)";
          }
          _0x2b05d4 ? _0x17f173({
            'plate': _0x2d73cb,
            'fromFrame': _0x2e42d4,
            'toFrame': _0x3e92a9
          }) : (_0x2d73cb['style']["transition"] = _0x1a3d6c, _0x50babe(_0x2d73cb, _0x3e92a9));
        });
        this["_multiStackCardsLaidOut"] = !![];
      };
      this['_expandPanel'] && this["_expandPanel"]['parentNode'] && this["_expandPanel"]["parentNode"]["removeChild"](this["_expandPanel"]);
      this["_expandPanel"] = null;
      _0x42bd93 && (this['_root']["style"]["position"] = 'relative', this["_root"]["style"]['setProperty']("overflow", 'visible'));
      _0x5e236a(_0x42bd93);
    }
    ["_createErrorCard"](_0x20f41c) {
      const _0x556b7c = document["createElement"]("div");
      _0x556b7c['className'] = "gen-error-card";
      Object['assign'](_0x556b7c["style"], {
        'display': 'flex',
        'flexDirection': "column",
        'alignItems': "center",
        'justifyContent': "center",
        'width': "100%",
        'height': "100%",
        'gap': "8px",
        'padding': "16px",
        'boxSizing': "border-box",
        'background': "var(--bg-panel-card)",
        'textAlign': "center"
      });
      _0x556b7c['innerHTML'] = "\n            <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"var(--red)\" stroke-width=\"2\">\n                <circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"/>\n            </svg>\n            <span style=\"color:var(--red);font-size:12px;font-weight:600;line-height:1.4;\">" + t("aigenImage.result.restrictedOrFailed") + "</span>\n        ";
      const _0x202d43 = document["createElement"]("span");
      Object['assign'](_0x202d43["style"], {
        'color': "var(--white-50)",
        'fontSize': "11px",
        'lineHeight': "1.5",
        'wordBreak': 'break-all'
      });
      _0x202d43["textContent"] = String(_0x20f41c || '');
      _0x556b7c['appendChild'](_0x202d43);
      return _0x556b7c;
    }
    ["_createStatusCard"](_0x47b103, _0x58be38) {
      const _0x2da057 = document["createElement"]('div');
      _0x2da057["className"] = "gen-status-card";
      Object["assign"](_0x2da057["style"], {
        'display': "flex",
        'flexDirection': "column",
        'alignItems': "center",
        'justifyContent': 'center',
        'width': "100%",
        'height': "100%",
        'gap': "8px",
        'padding': '16px',
        'boxSizing': "border-box",
        'background': "var(--bg-panel-card)",
        'textAlign': 'center'
      });
      const _0x2a0f32 = Number(_0x58be38) === 0x0;
      const _0x48c712 = _0x2a0f32 ? 'var(--green)' : 'var(--white-80)';
      const _0x1e1e07 = _0x47b103;
      _0x2da057['innerHTML'] = "\n            <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"" + _0x48c712 + '\x22\x20stroke-width=\x222\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<circle\x20cx=\x2212\x22\x20cy=\x2212\x22\x20r=\x2210\x22/><path\x20d=\x22' + (_0x2a0f32 ? 'M8\x2012l2.5\x202.5L16\x209' : "M12 8v5") + "\" />" + (_0x2a0f32 ? '' : "<line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\" />") + "\n            </svg>\n            <span style=\"color:" + _0x48c712 + ";font-size:12px;font-weight:600;line-height:1.4;\">" + _0x1e1e07 + "</span>\n        ";
      return _0x2da057;
    }
    ["_syncPromptPlaceholder"](_0x2680ec = this['_data']) {
      if (!this['promptEl']) {
        return;
      }
      this["promptEl"]['dataset']['placeholder'] = getImagePromptPlaceholderForModel(_0x2680ec?.["model"]);
    }
    ["_syncPromptBoxSizeFromData"](_0x1fb7e8 = this['_data']) {
      if (!this["promptEl"] || this['_isPromptBoxResizing']) {
        return;
      }
      const _0x9badce = getPromptBoxHeightBounds(this['_promptPanel']);
      const _0x822bb6 = normalizePromptBoxHeight(_0x1fb7e8?.['promptBoxHeight'], _0x9badce);
      applyPromptBoxHeight(this["promptEl"], _0x822bb6);
    }
    ['_syncPromptInputVisibility'](_0x2f5fc7 = this["_data"]) {
      if (!this['_promptInputWrap']) {
        return !![];
      }
      const _0x1874a3 = shouldShowImagePromptInput(getModelManifest(_0x2f5fc7?.["model"]));
      this["_promptInputWrap"]["hidden"] = !_0x1874a3;
      this["_promptInputWrap"]["classList"]?.["toggle"]("is-hidden-by-model", !_0x1874a3);
      this["promptEl"] && (this["promptEl"]["contentEditable"] = _0x1874a3 ? 'true' : "false", this["promptEl"]["setAttribute"]?.('aria-hidden', _0x1874a3 ? 'false' : "true"), !_0x1874a3 && typeof document !== "undefined" && document["activeElement"] === this['promptEl'] && this["promptEl"]['blur']?.());
      !_0x1874a3 && this["_promptPanel"]?.["classList"]?.["remove"]("is-resize-hover");
      return _0x1874a3;
    }
    ['_setupPromptBoxResize']() {
      if (!this["_promptPanel"] || this['_promptResizeHandle']) {
        return;
      }
      this['_promptResizeHandle'] = !![];
      const _0x1c67c5 = 0x14;
      const _0x354e30 = 0xa;
      const _0x4da5f4 = () => _0x3c49fd["getStateRaw"]()['ui']?.["promptBoxResizeEnabled"] !== ![] && !this["_promptPanel"]['classList']['contains']("is-prompt-expanded");
      const _0xa5c1a5 = () => this["_promptInputWrap"]?.["hidden"] === !![] || this["_promptInputWrap"]?.["classList"]?.["contains"]("is-hidden-by-model");
      const _0x518aa6 = _0x2184c1 => !!_0x2184c1?.["closest"](".floating-menu, .img-model-menu");
      const _0x2aa195 = _0x429e65 => {
        const _0xc5dd45 = this["_promptPanel"]['getBoundingClientRect']();
        return _0x429e65 >= _0xc5dd45["bottom"] - _0x1c67c5 && _0x429e65 <= _0xc5dd45["bottom"] + _0x354e30;
      };
      const _0x103c31 = _0x39aa3e => {
        if (!this["_promptPanel"]) {
          return;
        }
        if (!_0x4da5f4()) {
          this['_promptPanel']["classList"]["remove"]("is-resize-hover");
          return;
        }
        if (_0xa5c1a5()) {
          this["_promptPanel"]["classList"]["remove"]("is-resize-hover");
          return;
        }
        if (this["_isPromptBoxResizing"]) {
          this['_promptPanel']["classList"]["add"]("is-resize-hover");
          return;
        }
        const _0x4ba402 = !_0x518aa6(_0x39aa3e?.["target"]) && _0x2aa195(_0x39aa3e["clientY"]);
        this["_promptPanel"]["classList"]["toggle"]("is-resize-hover", _0x4ba402);
      };
      this['_promptPanel']["addEventListener"]("pointermove", _0x103c31);
      this["_promptPanel"]["addEventListener"]('pointerleave', () => {
        !this["_isPromptBoxResizing"] && this['_promptPanel']?.["classList"]["remove"]("is-resize-hover");
      });
      const _0x2fdacb = _0x2d6248 => {
        if (!this["_promptInputWrap"] || !this["promptEl"]) {
          return;
        }
        if (!_0x4da5f4()) {
          return;
        }
        if (_0xa5c1a5()) {
          return;
        }
        if (_0x2d6248["button"] !== 0x0) {
          return;
        }
        if (!_0x2aa195(_0x2d6248["clientY"])) {
          return;
        }
        if (_0x2d6248["target"]?.['closest'](".prompt-submit") || _0x518aa6(_0x2d6248["target"])) {
          return;
        }
        _0x2d6248["stopPropagation"]();
        _0x2d6248["preventDefault"]();
        const _0x1418e1 = getPromptBoxHeightBounds(this["_promptPanel"]);
        const _0x5ecfdf = _0x2d6248["clientY"];
        const _0x580467 = this["promptEl"]['getBoundingClientRect']()["height"];
        this['_isPromptBoxResizing'] = !![];
        this["_promptInputWrap"]["classList"]['add']('is-resizing');
        this["_promptPanel"]["classList"]["add"]('is-resize-hover');
        const _0x5d736e = _0x1e7a1c => {
          _0x1e7a1c["preventDefault"]();
          const _0xb8118a = normalizePromptBoxHeight(_0x580467 + (_0x1e7a1c["clientY"] - _0x5ecfdf), _0x1418e1);
          applyPromptBoxHeight(this['promptEl'], _0xb8118a);
        };
        const _0x2b7cb3 = _0x4c54e8 => {
          _0x4c54e8["preventDefault"]();
          window["removeEventListener"]("pointermove", _0x5d736e);
          window["removeEventListener"]("pointerup", _0x2b7cb3);
          window["removeEventListener"]('pointercancel', _0x2b7cb3);
          const _0x27f20a = normalizePromptBoxHeight(this['promptEl']?.["getBoundingClientRect"]()["height"], _0x1418e1);
          applyPromptBoxHeight(this["promptEl"], _0x27f20a);
          this["_promptInputWrap"]["classList"]['remove']('is-resizing');
          this["_isPromptBoxResizing"] = ![];
          this['_promptPanel']["classList"]["remove"]("is-resize-hover");
          _0x103c31(_0x4c54e8);
          _0x3c49fd["updateNodeData"](this["nodeId"], {
            'promptBoxHeight': _0x27f20a
          });
        };
        window['addEventListener']('pointermove', _0x5d736e);
        window['addEventListener']("pointerup", _0x2b7cb3);
        window['addEventListener']("pointercancel", _0x2b7cb3);
      };
      this["_promptPanel"]["addEventListener"]("pointerdown", _0x2fdacb);
    }
    ["_isRunninghubWorkflowModel"](_0x281236, _0x20c13d) {
      return isWorkflowModel(_0x281236, _0x20c13d || "runninghubwf");
    }
    ["_normalizeLegacySeedreamModel"](_0x18e1d6, _0x3cc0d7 = {}) {
      const _0x9943c0 = _0x3cc0d7?.["syncStore"] !== ![];
      const _0x5bf73e = _0x18e1d6 || {};
      const _0x415937 = String(_0x5bf73e["model"] || '')["trim"]();
      const _0x4ec0d3 = _0x415937['toLowerCase']();
      let _0x21f93e = '';
      let _0x7118e5 = '';
      if (_0x4ec0d3["startsWith"]('apimart/seedream-')) {
        return _0x18e1d6;
      } else {
        if (_0x4ec0d3["startsWith"]('ppio/seedream-')) {
          _0x21f93e = 'nano-banana-2';
          _0x7118e5 = "grsai";
        } else {
          return _0x18e1d6;
        }
      }
      const _0x21e67c = {};
      _0x415937 !== _0x21f93e && (_0x21e67c['model'] = _0x21f93e);
      String(_0x5bf73e['provider'] || '')["trim"]() !== _0x7118e5 && (_0x21e67c["provider"] = _0x7118e5);
      String(_0x5bf73e['imageSize'] || '')['trim']()["toUpperCase"]() === '3K' && (_0x21e67c["imageSize"] = '2K');
      if (Object["keys"](_0x21e67c)["length"] === 0x0) {
        return _0x5bf73e;
      }
      const _0x1a9ca2 = {
        ..._0x5bf73e,
        ..._0x21e67c
      };
      const _0x6e6e38 = _0x3c49fd["getState"]()["nodes"]?.[this["nodeId"]];
      _0x9943c0 && _0x6e6e38 && _0x3c49fd['updateNodeData'](this["nodeId"], _0x21e67c);
      return _0x1a9ca2;
    }
    ["_normalizeDreaminaNodeData"](_0x239172, _0x5aea88 = {}) {
      const _0x2b193b = _0x5aea88?.['syncStore'] !== ![];
      const _0x56f053 = this["_normalizeLegacySeedreamModel"](_0x239172, {
        'syncStore': _0x2b193b
      });
      const _0x191542 = buildDreaminaImageNodeNormalizationPatch(_0x56f053);
      if (!_0x191542) {
        return _0x56f053;
      }
      const _0x19a8d2 = {
        ...(_0x56f053 || {}),
        ..._0x191542
      };
      const _0x1047af = _0x3c49fd["getState"]()['nodes']?.[this["nodeId"]];
      _0x2b193b && _0x1047af && _0x3c49fd["updateNodeData"](this["nodeId"], _0x191542);
      return _0x19a8d2;
    }
    ["_buildSchemaAspectRatioDisplayPatch"](_0x3da8b7, _0x29b324, _0x1b4781 = {}) {
      const _0x5e6950 = _0x3da8b7 || (_0x3c49fd["getState"]?.() || {})['nodes']?.[this["nodeId"]] || this["_data"] || {};
      const _0x20dc31 = _0x1b4781?.['forceManualDisplaySize'] === !![];
      if (!_0x20dc31 && _0x5e6950?.[GENERATION_MANUAL_DISPLAY_SIZE_FIELD] === !![]) {
        return {};
      }
      const _0x3d46a9 = buildImageSchemaAspectRatioDisplayPatch({
        'store': _0x3c49fd,
        'nodeId': this["nodeId"],
        'nodeData': _0x5e6950,
        'ratioValue': _0x29b324,
        'minSide': getAIGenerationNodeSize()["width"],
        'getRefKindByNodeType': _0xfccb38,
        'resultMediaElement': this["imgEl"]
      });
      return _0x20dc31 ? {
        [GENERATION_MANUAL_DISPLAY_SIZE_FIELD]: ![],
        ..._0x3d46a9
      } : _0x3d46a9;
    }
    ["_applySchemaAspectRatioResizeAnimation"](_0x3a5dc1, _0x5156be) {
      if (!_0x5156be || _0x5156be["width"] === undefined || _0x5156be['height'] === undefined) {
        return;
      }
      applyImageSchemaRatioResizeAnimation(this, {
        'nodeId': this["nodeId"],
        'previewEl': this["previewEl"],
        'nodeData': _0x3a5dc1,
        'patch': _0x5156be
      });
    }
    ["runAdaptiveRatio"]() {
      const _0x291c58 = (_0x3c49fd["getState"]?.() || {})["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      const _0x39a07d = this['_buildSchemaAspectRatioDisplayPatch'](_0x291c58, "自适应");
      Object['keys'](_0x39a07d)["length"] > 0x0 && (_0x3c49fd["updateNodeData"](this['nodeId'], _0x39a07d), this["_applySchemaAspectRatioResizeAnimation"](_0x291c58, _0x39a07d));
    }
    ['_applyModelParamVisibility'](_0x437697 = this["_data"]) {
      if (!_0x437697) {
        return;
      }
      const _0x2103d1 = this["_getUiSchemaRenderNodeData"](_0x437697);
      const _0x1ac46a = buildUiSchemaVisibilitySignature(_0x437697["model"], _0x2103d1);
      const _0x3898b9 = resolveCustomAiAppNodeManifest(_0x437697);
      const _0x55827b = isCustomAiAppManifest(_0x3898b9);
      const _0x159af2 = _0x55827b;
      const _0x1ce7fa = (_0x11e938, _0x4be902) => {
        if (!_0x11e938) {
          return;
        }
        const _0x2fec96 = renderModelUiSchemaControls(_0x437697["model"], _0x2103d1, {
          'placement': _0x4be902,
          'variant': _0x4be902 === "mode" ? "pillMenu" : _0x4be902 === 'resolution' ? "resolutionPill" : _0x4be902 === 'advanced' ? "advancedRow" : _0x4be902 === "instance" ? "instanceToggle" : _0x4be902 === "batch" ? "pillMenu" : undefined
        });
        _0x11e938['innerHTML'] = _0x2fec96;
        _0x11e938["style"]["display"] = _0x2fec96 ? '' : 'none';
      };
      (this["_uiSchemaModel"] !== _0x437697["model"] || this["_uiSchemaVisibilitySignature"] !== _0x1ac46a) && (_0x1ce7fa(this['uiSchemaModeSlot'], "mode"), _0x1ce7fa(this['uiSchemaResolutionSlot'], 'resolution'), _0x1ce7fa(this['rhAdvPanelEl'], "advanced"), _0x1ce7fa(this['uiSchemaInstanceSlot'], 'instance'), _0x1ce7fa(this["uiSchemaBatchSlot"], "batch"), this["_uiSchemaModel"] = _0x437697["model"], this["_uiSchemaVisibilitySignature"] = _0x1ac46a, this["_qwenFirstImageModeBtns"] = []);
      syncModelUiSchemaControls(this["modelWrap"]?.["closest"](".prompt-panel-footer"), _0x2103d1);
      const _0x12062f = renderModelUiSchemaControls(_0x437697["model"], _0x2103d1, {
        'placement': 'advanced',
        'variant': "advancedRow"
      });
      const _0x2820e0 = Boolean(_0x12062f["trim"]());
      if (this["rhAdvWrap"]) {
        this['rhAdvWrap']["style"]["display"] = _0x2820e0 && !_0x55827b ? '' : "none";
      }
      const _0x438add = this['rhAdvPanelEl']?.["classList"]?.["contains"](RH_AI_APP_PERSISTENT_ADVANCED_CLASS);
      this["rhAdvPanelEl"] && this['rhAdvPanelEl']["classList"]['toggle'](RH_AI_APP_PERSISTENT_ADVANCED_CLASS, _0x159af2 && _0x2820e0);
      if (this["rhAdvPanelEl"] && _0x159af2 && _0x2820e0) {
        this['rhAdvPanelEl']["classList"]['add']("show");
      }
      if (this["rhAdvPanelEl"] && !_0x159af2 && _0x438add) {
        this['rhAdvPanelEl']["classList"]['remove']("show");
      }
      if (this["rhAdvPanelEl"] && !_0x2820e0) {
        this['rhAdvPanelEl']['classList']["remove"]("show");
      }
      this["rhAdvWrap"]?.["querySelector"]?.(".rh-adv-btn")?.["setAttribute"]("aria-expanded", String(this["rhAdvPanelEl"]?.['classList']?.["contains"]?.('show') === !![]));
    }
  }
  return _0x58f975["prototype"];
}