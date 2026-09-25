import a312_0x1f58c0 from '../core/stores/appStore.js';
import { getDisplayModelName } from '../modules/providers.js';
import { _handlePillHover, _handlePillOut, _syncEdgesOrderFromPills, _syncPillLabels, _checkAtTrigger, _populateMentionMenu, _insertMentionPill, _handlePillKeyboard, _rehydratePromptPills, _handleMentionMenuKeyboard } from '../modules/nodePromptShared.js';
import { TEXT_TOOLBAR_HTML, bindTextToolbarEvents, IMAGE_TOOLBAR_HTML, bindImageToolbarEvents, showDevToast } from './NodeToolbarConfig.js';
import { getImage } from '../modules/storage.js';
import { openNodeImagePreview } from '../modules/imagePreview.js';
import { getPromptPresets, openCustomPresetsManager } from '../modules/promptPresets.js';
import { startLoading, stopLoading } from '../modules/loadingOverlay.js';
import { bindRefThumbHoverPreview } from '../modules/refThumbHoverPreview.js';
import { ensureThumbDecoded, revealRefThumbMedia } from '../modules/refThumbMediaReveal.js';
import { getRefKindByNodeType } from '../modules/nodeMeta.js';
import { uploadFile } from '../modules/project.js';
import { ensureConfig, getProviderConfig } from '../../api/configApi.js';
import { buildGenerateImageRequest, cancelRunningHubImageTask, generateImage, resumeAsyncImageTask, resumeDreaminaImageTask, resumeRunningHubImageTask } from '../../api/aiImageApi.js';
import { fetchDreaminaCliStatusFromServer, getCachedDreaminaCliStatus } from '../../api/dreaminaCliApi.js';
import { generateId } from '../core/math.js';
import { checkSlashTrigger, handleSlashKeyboardNavigation, closeSlashMenu } from '../modules/slashMenu.js';
import { activateMenuKeyboard } from '../modules/floatingMenuKeyboard.js';
import a312_0x16b043 from '../modules/ImageFreeAngleController.js';
import { createAIGenerateNodeUiModule } from './aigenImage/uiModule.js';
import { hasAIGenMaskPreviewBaseImage } from './aigenImage/maskPreviewPolicy.js';
import { createAIGenerateNodeStateSyncModule } from './aigenImage/stateSyncModule.js';
import { createAIGenerateNodeSelectionStateModule } from './aigenImage/selectionStateModule.js';
import { createAIGenerateNodeTaskOrchestrationModule } from './aigenImage/taskOrchestrationModule.js';
import { shouldDeferRendererMediaOnMount } from '../core/rendererDeferredMedia.js';
import { createImageGenerationPresentationModule } from './aigenImage/imageGenerationPresentation.js';
const api = {
  'buildGenerateImageRequest': buildGenerateImageRequest,
  'cancelRunningHubWorkflowTask': cancelRunningHubImageTask,
  'fetchDreaminaCliStatusFromServer': fetchDreaminaCliStatusFromServer,
  'getCachedDreaminaCliStatus': getCachedDreaminaCliStatus,
  'generateImage': generateImage,
  'resumeAsyncImageTask': resumeAsyncImageTask,
  'resumeDreaminaImageTask': resumeDreaminaImageTask,
  'resumeRunningHubImageTask': resumeRunningHubImageTask
};
const AI_GENERATE_NODE_MODULE_DEPS = {
  'store': a312_0x1f58c0,
  'api': api,
  'getDisplayModelName': getDisplayModelName,
  '_handlePillHover': _handlePillHover,
  '_handlePillOut': _handlePillOut,
  '_syncEdgesOrderFromPills': _syncEdgesOrderFromPills,
  '_syncPillLabels': _syncPillLabels,
  '_checkAtTrigger': _checkAtTrigger,
  '_populateMentionMenu': _populateMentionMenu,
  '_insertMentionPill': _insertMentionPill,
  '_handlePillKeyboard': _handlePillKeyboard,
  '_rehydratePromptPills': _rehydratePromptPills,
  '_handleMentionMenuKeyboard': _handleMentionMenuKeyboard,
  'TEXT_TOOLBAR_HTML': TEXT_TOOLBAR_HTML,
  'bindTextToolbarEvents': bindTextToolbarEvents,
  'IMAGE_TOOLBAR_HTML': IMAGE_TOOLBAR_HTML,
  'bindImageToolbarEvents': bindImageToolbarEvents,
  'showDevToast': showDevToast,
  'getImage': getImage,
  'openNodeImagePreview': openNodeImagePreview,
  'getPromptPresets': getPromptPresets,
  'openCustomPresetsManager': openCustomPresetsManager,
  'startLoading': startLoading,
  'stopLoading': stopLoading,
  'bindRefThumbHoverPreview': bindRefThumbHoverPreview,
  'ensureThumbDecoded': ensureThumbDecoded,
  'revealRefThumbMedia': revealRefThumbMedia,
  'getRefKindByNodeType': getRefKindByNodeType,
  'uploadFile': uploadFile,
  'ensureConfig': ensureConfig,
  'getProviderConfig': getProviderConfig,
  'generateId': generateId,
  'checkSlashTrigger': checkSlashTrigger,
  'handleSlashKeyboardNavigation': handleSlashKeyboardNavigation,
  'closeSlashMenu': closeSlashMenu,
  'activateMenuKeyboard': activateMenuKeyboard,
  'ImageFreeAngleController': a312_0x16b043
};
export class AIGenerateNode {
  constructor(_0x5cccb6) {
    this["_data"] = _0x5cccb6;
    this["nodeId"] = _0x5cccb6['id'];
    this["previewEl"] = null;
    this["imgEl"] = null;
    this["refBarEl"] = null;
    this["promptEl"] = null;
    this["btnEl"] = null;
    this["_dragSrcIdx"] = null;
    this["_dragBounds"] = [];
    this['_cachedThumbUrl'] = null;
    this["_currentThumbId"] = null;
    this["_cachedSourceUrl"] = null;
    this['_currentSourceId'] = null;
    this['_currentLocalPath'] = null;
    this["_thumbObjectUrls"] = new Map();
    this['_refThumbObjectUrls'] = new Map();
    this["_activeRefThumbIds"] = new Set();
    this["_imageObjectUrlLifecycleEpoch"] = 0x0;
    this["_imageObjectUrlsDisposed"] = ![];
    this["_currentMaskPreview"] = null;
    this["_suppressedEmptyMaskPreview"] = null;
    this["_resolvedUrlsKey"] = null;
    this["_resolvedMainUrls"] = null;
    this["_resolvedAuxUrls"] = null;
    this["_lastImagesKeyStr"] = null;
    this["_imageDisplayLoadToken"] = 0x0;
    this["_lastMainIdx"] = null;
    this["_lastIsExpanded"] = null;
    this['_multiStackWrap'] = null;
    this['_multiLayerEls'] = [];
    this['_multiErrorEls'] = [];
    this["_multiToggleBtn"] = null;
    this["_maskOverlay"] = null;
    this['_qualityBtns'] = [];
    this['_attachBtnIcon'] = null;
    this["_lastEdgeSig"] = null;
    this["_renderRefBarLock"] = null;
    this['_ratioAnimTimer'] = null;
    this["_ratioAnimWrapperEl"] = null;
    this['_ratioFlipAnim'] = null;
    this["_ratioFlipPreviewEl"] = null;
    this["_ratioFlipStartCancel"] = null;
    this["_ratioFlipGeneration"] = 0x0;
    this["_rendererMediaDeferred"] = shouldDeferRendererMediaOnMount(_0x5cccb6);
    this["_statusOverlayEl"] = null;
    this["_assetMentionRegistryUnsubscribe"] = null;
    this["_assetMentionRegistryRefreshPending"] = ![];
    this["_generationNodeHelpTip"] = null;
    this["_modelProviderProfileControl"] = null;
    this["_footerControllerCleanup"] = null;
    this["_uiSchemaCleanup"] = null;
    this["_lowZoomHoverRefreshTimer"] = null;
  }
  ["_hideMaskPreview"]() {
    if (!this["_maskOverlay"]) {
      return;
    }
    this['_maskOverlay']["src"] = '';
    this["_maskOverlay"]["style"]["display"] = "none";
    this['_currentMaskPreview'] = null;
  }
  ["_applyMaskPreview"](_0x368ca) {
    if (!this["_maskOverlay"]) {
      return;
    }
    const _0x5a5929 = String(_0x368ca || '')["trim"]();
    if (!_0x5a5929) {
      this["_suppressedEmptyMaskPreview"] = null;
      this['_hideMaskPreview']();
      return;
    }
    if (!hasAIGenMaskPreviewBaseImage(this["_data"])) {
      this["_suppressedEmptyMaskPreview"] = _0x5a5929;
      this["_hideMaskPreview"]();
      return;
    }
    if (this["_suppressedEmptyMaskPreview"] === _0x5a5929) {
      this["_hideMaskPreview"]();
      return;
    }
    this["_suppressedEmptyMaskPreview"] = null;
    if (this["_currentMaskPreview"] === _0x5a5929) {
      return;
    }
    const _0x5da61b = _0x5a5929["startsWith"]("blob:") || _0x5a5929["startsWith"]("data:") || _0x5a5929["startsWith"]('/') ? _0x5a5929 : '/' + _0x5a5929["replace"](/^\//, '');
    this["_maskOverlay"]["src"] = encodeURI(_0x5da61b);
    this['_maskOverlay']['style']["display"] = "block";
    this["_currentMaskPreview"] = _0x5a5929;
  }
  ["_checkAtTrigger"](_0x159065) {
    return _checkAtTrigger(this, _0x159065);
  }
  ['_populateMentionMenu'](_0x1aa072, _0x4a7b31, _0x18c449, _0x1b5ea4 = null, _0x79c834 = '', _0x54b41d = -0x1) {
    return _populateMentionMenu(this, {
      'x': _0x1aa072,
      'y': _0x4a7b31,
      'triggerRange': _0x18c449,
      'pillToEdit': _0x1b5ea4,
      'query': _0x79c834,
      'atIndex': _0x54b41d
    });
  }
  ["_insertMentionPill"](_0x4c7f3b, _0x4179f2, _0x5dbe80, _0x40162e = -0x1) {
    return _insertMentionPill(this, {
      'label': _0x4c7f3b,
      'nodeId': _0x4179f2,
      'triggerRange': _0x5dbe80,
      'atIndex': _0x40162e
    });
  }
  ["_handlePillKeyboard"](_0x3acd4e) {
    return _handlePillKeyboard(this, _0x3acd4e);
  }
  ["_buildFloatingMenu"](_0xfcba6f, _0x37926c, _0x1f8684, _0x27ca16, _0x5ccbab) {
    const _0xe3bac2 = document["createElement"]("div");
    _0xe3bac2["style"]['position'] = "relative";
    const _0x5e0511 = document["createElement"]('button');
    _0x5e0511["type"] = "button";
    _0x5e0511["className"] = "img-pill-btn";
    _0x5e0511['id'] = _0xfcba6f;
    const _0x934144 = document["createElement"]('span');
    _0x934144['className'] = _0x37926c;
    _0x934144['textContent'] = _0x1f8684;
    _0x5e0511['appendChild'](_0x934144);
    const _0x40b4a0 = document["createElement"]("svg");
    _0x40b4a0['setAttribute']('width', '10');
    _0x40b4a0["setAttribute"]('height', '10');
    _0x40b4a0["setAttribute"]("viewBox", "0 0 24 24");
    _0x40b4a0['setAttribute']("fill", 'none');
    _0x40b4a0["setAttribute"]('stroke', "currentColor");
    _0x40b4a0["setAttribute"]('stroke-width', '2');
    _0x40b4a0['style']["opacity"] = "0.5";
    _0x40b4a0["innerHTML"] = "<polyline points=\"6 9 12 15 18 9\"/>";
    _0x5e0511["appendChild"](_0x40b4a0);
    const _0x5b8d96 = document["createElement"]("div");
    _0x5b8d96['className'] = "floating-menu";
    _0x27ca16["forEach"](_0x1095b0 => {
      const _0x1fb1ac = document["createElement"]("div");
      _0x1fb1ac["className"] = 'floating-menu-item' + (_0x1095b0['v'] === _0x1f8684 || _0x1095b0['l'] === _0x1f8684 ? " active" : '');
      _0x1fb1ac["dataset"]["value"] = _0x1095b0['v'];
      _0x1fb1ac["textContent"] = _0x1095b0['l'];
      _0x1fb1ac['addEventListener']("mousedown", _0x5a0c68 => {
        _0x5a0c68["preventDefault"]();
        _0x934144["textContent"] = _0x1095b0['l'];
        _0x5b8d96["querySelectorAll"](".floating-menu-item")["forEach"](_0x19f19c => _0x19f19c['classList']["remove"]("active"));
        _0x1fb1ac['classList']['add']("active");
        _0x5b8d96['classList']["remove"]("open");
        _0x5ccbab(_0x1095b0['v']);
      });
      _0x5b8d96["appendChild"](_0x1fb1ac);
    });
    _0x5e0511['addEventListener']('mousedown', _0x1d95f2 => {
      _0x1d95f2["preventDefault"]();
      _0x1d95f2["stopPropagation"]();
      const _0x53f444 = _0x5b8d96["classList"]["contains"]("open");
      document['querySelectorAll'](".floating-menu.open")['forEach'](_0x8c7306 => _0x8c7306['classList']["remove"]('open'));
      if (!_0x53f444) {
        _0x5b8d96["classList"]['add']("open");
      }
    });
    document["addEventListener"]('mousedown', _0x4327a0 => {
      if (!_0xe3bac2["contains"](_0x4327a0['target'])) {
        _0x5b8d96["classList"]['remove']("open");
      }
    }, !![]);
    _0xe3bac2["appendChild"](_0x5e0511);
    _0xe3bac2["appendChild"](_0x5b8d96);
    return {
      'modelWrap': _0xe3bac2,
      'trig': _0x5e0511,
      'menu': _0x5b8d96
    };
  }
}
const aiGenerateNodeUiModule = createAIGenerateNodeUiModule(AI_GENERATE_NODE_MODULE_DEPS);
const aiGenerateNodeStateSyncModule = createAIGenerateNodeStateSyncModule(AI_GENERATE_NODE_MODULE_DEPS);
const aiGenerateNodeSelectionStateModule = createAIGenerateNodeSelectionStateModule(AI_GENERATE_NODE_MODULE_DEPS);
const aiGenerateNodeTaskOrchestrationModule = createAIGenerateNodeTaskOrchestrationModule(AI_GENERATE_NODE_MODULE_DEPS);
function applyClassPrototypeMethods(_0x308ee8, _0x17f805) {
  if (!_0x17f805) {
    return;
  }
  const _0x4d5360 = Object["getOwnPropertyDescriptors"](_0x17f805);
  delete _0x4d5360['constructor'];
  Object["defineProperties"](_0x308ee8, _0x4d5360);
}
applyClassPrototypeMethods(AIGenerateNode["prototype"], aiGenerateNodeUiModule);
applyClassPrototypeMethods(AIGenerateNode['prototype'], aiGenerateNodeStateSyncModule);
applyClassPrototypeMethods(AIGenerateNode["prototype"], aiGenerateNodeSelectionStateModule);
applyClassPrototypeMethods(AIGenerateNode['prototype'], createImageGenerationPresentationModule(AI_GENERATE_NODE_MODULE_DEPS, aiGenerateNodeTaskOrchestrationModule));