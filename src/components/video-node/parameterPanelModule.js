import { openDebugRequestWindow } from '../../modules/debugRequestWindow.js';
import { APIMART_DREAMINA_VIDEO_DEFAULT_MODEL, buildDreaminaStyleVideoNodeNormalizationPatch, ensureDreaminaStyleVideoModelForTask, getDreaminaStyleVideoDurationRange, getDreaminaStyleVideoResolutionOptions, getDreaminaVideoTaskParamVisibility, isApimartDreaminaVideoModel, isDreaminaStyleVideoModel, isDreaminaVideoRouteModeEnabled, normalizeDreaminaVideoAspectRatio, normalizeDreaminaStyleVideoDuration, getDreaminaStyleVideoDefaultModel, normalizeDreaminaStyleVideoModel, normalizeDreaminaStyleVideoResolution, normalizeDreaminaVideoRouteMode, resolveDreaminaStyleVideoProvider, resolveDreaminaVideoTaskType, validateDreaminaVideoRouteSelection } from '../../modules/dreaminaVideoModelHelper.js';
import { normalizeProviderId, resolveModelExecution, resolveModelProvider } from '../../manifests/index.js';
import { buildFixedInputAssetSlotMap, getFixedInputSlotConfigFromManifest, resolveFixedInputSlotForRef } from '../../modules/fixedInputAssetRefs.js';
import { flushPromptHtmlCommit, resolvePromptTextWithTextRefs } from '../../modules/nodePromptShared.js';
import { resolveEffectiveInputKind } from '../../modules/modelInputPolicy.js';
import { getGenerationRatioSizeWithDom } from '../../modules/generationRatioSource.js';
import { DEBUG_WRENCH_ICON_HTML, buildFinalApiDebugPreview } from '../../utils/debugRequestPreview.js';
import { getNodeDefaultSize } from '../../services/fileService.js';
import { releasePayloadObjectUrlLease } from '../../services/payloadObjectUrlLease.js';
import { resolveGenerationButtonMode } from '../../core/generationTaskUiState.js';
import { showRunningHubMediaUploadGuideForError } from '../../modules/runningHubMediaUploadGuide.js';
import { applyModelCredentialButtonState, bindModelCredentialMenu, resetModelCredentialButtonState, syncModelCredentialMenu } from '../../modules/modelCredentialUi.js';
import { resetGenerateButtonIdleUi, setGenerateButtonCancellableUi, setGenerateButtonLoadingUi } from '../../modules/previewGenerateButtonUi.js';
import { evaluateGenerationPromptBoundary } from '../../modules/generationPromptPolicy.js';
import { getSegmentRetakeValidation } from '../../modules/videoRetake/segmentRetakeSession.js';
import { decorateSegmentRetakeParameterNodeData, decorateSegmentRetakeParameterSchemaFields, getSegmentRetakeAllowedModelIdsForNode, isSegmentRetakeEditing } from '../../modules/videoRetake/segmentRetakeModelPolicy.js';
import { rememberSegmentRetakeModelSelection } from '../../modules/videoRetake/segmentRetakeModelPreference.js';
import { buildUiSchemaParamPatch, bindUiSchemaFieldControls, bindModelUiSchemaControls, hasVisibleModelUiSchema, renderModelUiSchemaControls, renderUiSchemaFields, syncModelUiSchemaControls } from '../aigenImage/uiSchemaRenderer.js';
import { applyImageSchemaRatioResizeAnimation, animateImageSchemaRatioResizeFlip, armImageSchemaRatioResizeAnimation, buildGenerationModelSelectionPayload, buildImageSchemaAspectRatioDisplayPatch, GENERATION_MANUAL_DISPLAY_SIZE_FIELD, GENERATION_RATIO_RESIZE_ANIMATION_MS as a558_0x851fc } from '../shared/generationDisplayPolicy.js';
import { VIDEO_DISPLAY_RATIO_RESULT_FIELDS, buildVideoSchemaAspectRatioDisplayPatch } from './videoSchemaAspectRatioDisplayPatch.js';
import { restoreLegacyVideoRatioPopupAfterSync, syncLegacyVideoRatioFooter } from './legacyVideoRatioPopup.js';
import { isRunningHubVideoWorkflowModel, resolveVideoAdvancedSchemaTarget } from './videoAdvancedSchemaTarget.js';
import { renderNodeModelTrigger } from '../shared/nodeModelMenu.js';
import { bindLazyVideoModelMenu, buildVideoModelMenuHTML, renderVideoModelTriggerIconHTML } from './modelSelectorShared.js';
import { bindNodeFooterController, closeNodeFooterMenus, syncNodeFooterAdvancedButtonState } from '../shared/nodeFooterControls.js';
import { ADVANCED_SETTINGS_TUNE_ICON_MARKUP } from '../sharedIconMarkup.js';
import { bindGenerationNodeCredentialLifecycle } from '../shared/generationNodeCredentialLifecycle.js';
import { RH_AI_APP_PERSISTENT_ADVANCED_CLASS, isCustomAiAppManifest, isRunningHubAiAppManifest, shouldAllowEmptyCustomAiAppInputs } from '../shared/rhAiAppNodeBehavior.js';
import { buildVideoWorkflowDisplayParamsPatch, buildVideoWorkflowGenerationParamsPatch, buildVideoWorkflowModelSelectionPatch, getRunningHubVideoWorkflowFpsOptions, getRunningHubVideoParameterPanelPolicy, getPlainGenerationParams, hasRunningHubVideoWorkflowUiPlacement, isRunningHubVideoWorkflowManifest } from './runningHubVideoUiSchema.js';
import { arePlainObjectsEqual, buildAgnesVideoLogoHTML, buildAgnesVideoMenuItemsHtml, buildApimartVideoMenuItemsHtml, buildApimartVideoLogoHTML, buildCustomProviderVideoLogoHTML, buildCustomProviderVideoMenuGroups, getComfyUiVideoWorkflowIconHtml, buildComfyUiVideoWorkflowMenuGroups, buildDreaminaVideoLogoHTML, buildDreaminaOfficialVideoMenuItems, buildDreaminaTaskModelMenuHtml, buildRunningHubVideoModelApiMenuItems, buildRunningHubVideoWorkflowMenuItems, buildRhAiAppVideoMenuItems, buildVolcengineOfficialVideoMenuItems, buildVolcengineVideoLogoHTML, getDefaultRunningHubVideoWorkflowModelId, getDreaminaTaskModelMenuItems, getDreaminaTaskModelMenuMeta, getRhV54FpsOptions, normalizeRhStandardFps, normalizeRhV54Fps } from './parameterPanelModelHelpers.js';
import { buildDreaminaParamPatch, buildDreaminaModelSelectionParamPatch, buildDreaminaParamSchemaFields, buildDreaminaRouteModeUpdate, buildDreaminaStorePatchFromNormalization, getDreaminaEffectiveNodeData, resolveDreaminaRememberedRouteModel } from './dreaminaParameterSchema.js';
import { renderVideoFooterShell } from './footerShell.js';
import { buildRhWorkflowFieldPatch, buildVideoModelApiModelSelectionPatch, getManifestInputPolicyEdgeIdsToRemove, getPanelModelManifest, isHappyHorsePanelModel, isRhAiAppPanelModel } from './parameterPanelModelSelectionPolicy.js';
import { DEFAULT_VIDEO_MODEL_API_FOOTER_PLACEMENT_ORDER, VIDEO_MODE_ALL_REFERENCE_VALUE, VIDEO_MODE_FIRST_LAST_VALUE, formatVideoRatioResolutionLabel, getDreaminaProviderLabel, getVideoCancelTooltip, getVideoGenerateTitle, getVideoModeLabel, manifestFixedSlotVisibilityReferencesField, manifestHelpVariantsReferenceField, manifestPromptVariantsReferenceField, resolveVideoAdaptiveRatioSource, resolveVideoModelApiFooterPlacementOrder, resolveVideoPromptPlaceholder, shouldShowVideoPromptInput, videoPanelText, wrapUiSchemaPlacementControls } from './parameterPanelPresentationPolicy.js';
function bindVideoPanelEvent(_0x3fa72b, _0x1b94b0, _0x4d43b6, _0x490799) {
  if (!_0x3fa72b || typeof _0x490799 !== "function") {
    return;
  }
  const _0x1f705c = "__videoPanel_" + _0x1b94b0 + '_' + _0x4d43b6;
  const _0x3f558d = _0x3fa72b[_0x1f705c];
  if (_0x3f558d) {
    _0x3fa72b['removeEventListener'](_0x1b94b0, _0x3f558d);
  }
  _0x3fa72b[_0x1f705c] = _0x490799;
  _0x3fa72b['addEventListener'](_0x1b94b0, _0x490799);
}
function bindVideoPanelClick(_0x319499, _0x1ae1e4, _0x4edd90) {
  bindVideoPanelEvent(_0x319499, "click", _0x1ae1e4, _0x4edd90);
}
function bindVideoPanelInput(_0x41397f, _0x51b96a, _0x288f71) {
  bindVideoPanelEvent(_0x41397f, 'input', _0x51b96a, _0x288f71);
}
function getDefaultVideoModelId() {
  return getDefaultRunningHubVideoWorkflowModelId();
}
function normalizeRhVideoFpsByPolicy(_0x42ef1d, _0x37b40f) {
  return _0x42ef1d?.["sourceFrameCountFps"] === "v54" ? normalizeRhV54Fps(_0x37b40f) : normalizeRhStandardFps(_0x37b40f);
}
function findPreferredVideoEdge(_0x23a309, _0x485457) {
  return _0x23a309["find"](_0x1fc980 => {
    const _0x617e5d = _0x485457?.["nodes"]?.[_0x1fc980?.["sourceId"]];
    const _0x25fb8c = String(_0x617e5d?.['type'] || '');
    return _0x25fb8c === 'source-video' || _0x25fb8c === 'video' || _0x25fb8c === "ai-video";
  });
}
export function createVideoNodeParameterPanelModule(_0x48639e) {
  const {
    store: _0x10ce4b,
    api: _0x49503f,
    getDisplayModelName: _0x3fbd8f,
    PROVIDERS_META: _0xb0a30f,
    getAIGenerationNodeSize: _0x4670c9,
    getDisplayedMediaSizeFromNode: _0x551182,
    activateMenuKeyboard: _0x3e7ad9,
    isVideoVipModel: _0x3814a2,
    readStoreState = () => _0x10ce4b['getStateRaw']?.() || _0x10ce4b['getState']?.() || {}
  } = _0x48639e;
  class _0x1bdde9 {
    ['_getRhVideoAdvancedSchemaNodeData'](_0x23b13a = {}) {
      const _0x564946 = String(_0x23b13a?.["model"] || '')["trim"]();
      const _0x4f0269 = getRunningHubVideoParameterPanelPolicy(_0x564946);
      let _0x261627 = _0x23b13a;
      if (_0x4f0269['sourceFrameCountFps']) {
        const _0x4f4fa3 = normalizeRhVideoFpsByPolicy(_0x4f0269, _0x23b13a?.["rhVideoFps"]);
        _0x261627 = {
          ..._0x261627,
          'rhVideoSourceFrameCount': this["_getRhV5SourceVideoFrameCount"]?.(_0x4f4fa3) || 0x0
        };
      }
      if (_0x4f0269["maskVideoDisablesSubtractSubject"] !== !![]) {
        return _0x261627;
      }
      const _0x356c04 = (_0x10ce4b['getIncomingEdges'](this["nodeId"]) || [])["some"](_0x25fa08 => {
        const _0x377a8a = String(_0x25fa08?.["refSlot"] || '')["trim"]();
        return _0x377a8a === "videoMask" || _0x377a8a === "maskVideo";
      });
      if (!_0x356c04) {
        return _0x261627;
      }
      return {
        ..._0x261627,
        'rhV54HasMaskVideo': !![],
        'rhSubtractSubject': ![],
        'generationParams': {
          ...getPlainGenerationParams(_0x261627?.["generationParams"]),
          'rhSubtractSubject': ![]
        }
      };
    }
    ['_buildVideoModelMenuHtml'](_0x4ad627 = '') {
      const _0x6328b4 = getSegmentRetakeAllowedModelIdsForNode(this["_data"]);
      return buildVideoModelMenuHTML({
        'activeModel': _0x4ad627 || this["_data"]?.["model"],
        'provider': this['_data']?.["provider"],
        'subscriptionState': (typeof _0x10ce4b["getStateRaw"] === "function" ? _0x10ce4b['getStateRaw']() : _0x10ce4b["getState"]())?.['subscription'] || {},
        'allowedModelIds': _0x6328b4,
        'customRelayQuickAdd': !![]
      });
    }
    ["_getVideoAdvancedSchemaTarget"](_0x214acb = this["_data"]) {
      return resolveVideoAdvancedSchemaTarget(_0x214acb, {
        'fallbackNodeData': this["_data"],
        'buildRunningHubNodeData': _0x2f28b0 => this["_getRhVideoAdvancedSchemaNodeData"](_0x2f28b0)
      });
    }
    ["_renderVideoAdvancedControlsHtml"](_0x13323f = this["_data"]) {
      const _0x12c8dc = this['_getVideoAdvancedSchemaTarget'](_0x13323f);
      return _0x12c8dc ? renderModelUiSchemaControls(_0x12c8dc["modelId"], _0x12c8dc["nodeData"], {
        'placement': _0x12c8dc["placement"]
      }) : '';
    }
    ["_hasVisibleVideoAdvancedControls"](_0x131ecc = this['_data']) {
      const _0x56c643 = this["_getVideoAdvancedSchemaTarget"](_0x131ecc);
      return !!_0x56c643 && hasVisibleModelUiSchema(_0x56c643['modelId'], _0x56c643["nodeData"], {
        'placement': _0x56c643["placement"]
      });
    }
    ["_renderFooterShell"](_0x170879) {
      renderVideoFooterShell(this, _0x170879, {
        'DEBUG_WRENCH_ICON_HTML': DEBUG_WRENCH_ICON_HTML,
        'getDefaultVideoModelId': getDefaultVideoModelId,
        'getDisplayModelName': _0x3fbd8f,
        'getVideoCancelTooltip': getVideoCancelTooltip,
        'getVideoGenerateTitle': getVideoGenerateTitle,
        'renderNodeModelTrigger': renderNodeModelTrigger,
        'videoPanelText': videoPanelText
      });
    }
    ["_renderFooterImpl"](_0x2e20ea) {
      if (_0x2e20ea?.["dataset"]) {
        delete _0x2e20ea["dataset"]['deferredDetailsShell'];
      }
      let _0xe9bf93 = ![];
      const _0x215184 = _0x2e20ea["querySelector"](".rh-vram-adv-panel");
      _0x215184 && (_0xe9bf93 = _0x215184['classList']["contains"]("show"));
      const _0x103340 = decorateSegmentRetakeParameterNodeData(this["_data"]);
      const _0x360dc4 = this['_isDreaminaVideoNode'](_0x103340) ? this['_syncDreaminaTaskState'](_0x103340, {
        'syncStore': !_0x103340?.['segmentRetake']
      }) : null;
      if (_0x360dc4?.["nodeData"]) {
        this["_data"] = decorateSegmentRetakeParameterNodeData(_0x360dc4["nodeData"]);
      }
      const _0x32cb49 = decorateSegmentRetakeParameterNodeData(this["_data"]);
      const _0x1f6ce3 = Boolean(_0x360dc4);
      const _0x1f5be5 = String(this["_data"]['model'] || '')["trim"]() || getDefaultVideoModelId();
      const _0x1063f6 = getPanelModelManifest({
        ...this["_data"],
        'model': _0x1f5be5
      });
      const _0x3416e7 = isRunningHubAiAppManifest(_0x1063f6);
      const _0x209146 = isCustomAiAppManifest(_0x1063f6);
      const _0x4448ae = !_0x1f6ce3 && _0x3416e7;
      if (isRunningHubVideoWorkflowManifest(_0x1f5be5)) {
        const _0x1bc3c8 = buildVideoWorkflowGenerationParamsPatch(this["_data"], _0x1f5be5);
        const _0x58cf0a = buildVideoWorkflowDisplayParamsPatch(_0x1f5be5, _0x1bc3c8['generationParams'], {
          'v54FpsOptions': getRhV54FpsOptions()
        });
        const _0x158eef = Object["entries"](_0x58cf0a)["some"](([_0x4207cf, _0x212d12]) => this['_data']?.[_0x4207cf] !== _0x212d12);
        if (_0x1bc3c8["generationParams"] && (!arePlainObjectsEqual(_0x1bc3c8['generationParams'], getPlainGenerationParams(this['_data']["generationParams"])) || !arePlainObjectsEqual(_0x1bc3c8["generationParamsByModel"], getPlainGenerationParams(this["_data"]["generationParamsByModel"])) || _0x158eef)) {
          const _0x5e1a9c = {
            ..._0x1bc3c8,
            ..._0x58cf0a
          };
          _0x10ce4b["updateNodeData"](this["nodeId"], _0x5e1a9c);
          this["_data"] = {
            ...this['_data'],
            ..._0x5e1a9c
          };
        }
      }
      const _0x557f4c = _0x1f5be5["includes"]("seedance");
      const _0x5651e5 = _0x360dc4?.["nodeData"]?.["resolution"] || this["_data"]['resolution'] || (_0x557f4c ? "720p" : "1080p");
      const _0x57bcc0 = this["_getModelParamVisibility"](_0x1f5be5, this["_data"]["provider"]);
      const _0x395748 = this["_isRunninghubWorkflowModel"](_0x1f5be5, this['_data']['provider']);
      const _0x553425 = this["_resolveModelExecution"](_0x1f5be5, this["_data"]["provider"]);
      const _0x354043 = !_0x1f6ce3 && _0x1063f6?.['kind'] !== "video";
      const _0x559ab3 = !_0x1f6ce3 && !_0x395748 && _0x553425?.["modelManifest"]?.["adapterType"] === "modelApi" && _0x553425?.["modelManifest"]?.["kind"] === "video";
      const _0x51c6cd = !_0x1f6ce3 && !_0x395748 && !_0x3416e7 && !_0x559ab3 && !_0x354043;
      const _0x17cde8 = _0x559ab3 ? String(_0x553425?.['canonicalModelId'] || _0x553425?.["modelManifest"]?.["modelId"] || _0x1f5be5)["trim"]() : _0x1f5be5;
      const _0x542a37 = _0x395748;
      const _0x35e911 = _0x542a37 ? renderModelUiSchemaControls(_0x1f5be5, this["_data"], {
        'placement': 'instance',
        'variant': "instanceToggle"
      }) : '';
      const _0x5ec260 = hasRunningHubVideoWorkflowUiPlacement(_0x1f5be5, "videoParams");
      const _0x2df747 = hasRunningHubVideoWorkflowUiPlacement(_0x1f5be5, "resolution");
      const _0x1447ba = _0x5ec260 ? this['_getRhVideoAdvancedSchemaNodeData'](this["_data"]) : this["_data"];
      const _0x5bd3d2 = _0x5ec260 ? renderModelUiSchemaControls(_0x1f5be5, _0x1447ba, {
        'placement': "videoParams",
        'unwrap': !![],
        'rhVideoFpsOptions': getRunningHubVideoWorkflowFpsOptions(_0x1f5be5, {
          'v54FpsOptions': getRhV54FpsOptions()
        })
      }) : '';
      const _0x13ee4d = _0x2df747 ? renderModelUiSchemaControls(_0x1f5be5, _0x1447ba, {
        'placement': "resolution"
      }) : '';
      const _0xe2730e = _0x559ab3 ? renderModelUiSchemaControls(_0x17cde8, _0x32cb49, {
        'placement': "mode"
      }) : '';
      const _0x5953c6 = _0x559ab3 ? renderModelUiSchemaControls(_0x17cde8, _0x32cb49, {
        'placement': 'resolution'
      }) : '';
      const _0x3925e9 = _0x395748 || _0x3416e7 ? renderModelUiSchemaControls(_0x1f5be5, this["_data"], {
        'placement': 'mode'
      }) : '';
      const _0x30caa8 = this["_hasVisibleVideoAdvancedControls"](this["_data"]);
      const _0x289f40 = _0x30caa8 ? this["_renderVideoAdvancedControlsHtml"](this["_data"]) : '';
      const _0xa5c28d = this["_getModelIconHTML"](_0x1f5be5, this["_data"]["provider"]);
      const _0x332049 = this['_getRatioIconHTML'](this['_data']["aspectRatio"] || '自适应');
      const _0x39ea24 = formatVideoRatioResolutionLabel(this["_data"]["aspectRatio"], _0x5651e5);
      const _0x48d6e5 = "\n                <div class=\"img-rp-quality-area\">\n                  <div class=\"img-rp-section-label\">" + videoPanelText("resolution") + "</div>\n                  <div class=\"img-rp-quality-segmented\">\n                    <button type=\"button\" class=\"img-rp-quality-item " + (_0x5651e5 === "480p" ? "active" : '') + '\x20' + (_0x557f4c ? "is-disabled" : '') + "\" data-value=\"480p\" " + (_0x557f4c ? "disabled title=\"" + videoPanelText('resolutionUnavailable') + '\x22' : '') + '>480p</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22img-rp-quality-item\x20' + (_0x5651e5 === "720p" ? "active" : '') + "\" data-value=\"720p\">720p</button>\n                    <button type=\"button\" class=\"img-rp-quality-item " + (_0x5651e5 === "1080p" ? "active" : '') + '\x20' + (_0x557f4c ? "is-disabled" : '') + '\x22\x20data-value=\x221080p\x22\x20' + (_0x557f4c ? "disabled title=\"" + videoPanelText("resolutionUnavailable") + '\x22' : '') + '>1080p</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22img-rp-ratio-area\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22img-rp-section-label\x22>' + videoPanelText("aspectRatio") + "</div>\n                  <div class=\"img-rp-ratio-split\">\n                    <div class=\"img-rp-ratio-left\">\n                      <button type=\"button\" class=\"img-rp-large-adaptive active\" data-label=\"自适应\" data-w=\"1\" data-h=\"1\">\n                        <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 9h18\"/><path d=\"M9 21V9\"/></svg>\n                        <span>" + videoPanelText("adaptive") + "</span>\n                      </button>\n                    </div>\n                    <div class=\"img-rp-ratio-right\">\n                      <button type=\"button\" class=\"img-rp-ratio-item\" data-label=\"1:1\" data-w=\"1\" data-h=\"1\"><span class=\"img-rp-icon img-rp-sq\"></span><span>1:1</span></button>\n                      <button type=\"button\" class=\"img-rp-ratio-item\" data-label=\"9:16\" data-w=\"9\" data-h=\"16\"><span class=\"img-rp-icon img-rp-tall\"></span><span>9:16</span></button>\n                      <button type=\"button\" class=\"img-rp-ratio-item\" data-label=\"16:9\" data-w=\"16\" data-h=\"9\"><span class=\"img-rp-icon img-rp-wide\"></span><span>16:9</span></button>\n                      <button type=\"button\" class=\"img-rp-ratio-item\" data-label=\"3:4\" data-w=\"3\" data-h=\"4\"><span class=\"img-rp-icon img-rp-p34\"></span><span>3:4</span></button>\n                      <button type=\"button\" class=\"img-rp-ratio-item\" data-label=\"4:3\" data-w=\"4\" data-h=\"3\"><span class=\"img-rp-icon img-rp-l43\"></span><span>4:3</span></button>\n                      <button type=\"button\" class=\"img-rp-ratio-item is-disabled\" data-label=\"3:2\" data-w=\"3\" data-h=\"2\" disabled><span class=\"img-rp-icon img-rp-l32\"></span><span>3:2</span></button>\n                      <button type=\"button\" class=\"img-rp-ratio-item is-disabled\" data-label=\"2:3\" data-w=\"2\" data-h=\"3\" disabled><span class=\"img-rp-icon img-rp-p23\"></span><span>2:3</span></button>\n                      <button type=\"button\" class=\"img-rp-ratio-item is-disabled\" data-label=\"5:4\" data-w=\"5\" data-h=\"4\" disabled><span class=\"img-rp-icon img-rp-l54\"></span><span>5:4</span></button>\n                      <button type=\"button\" class=\"img-rp-ratio-item is-disabled\" data-label=\"4:5\" data-w=\"4\" data-h=\"5\" disabled><span class=\"img-rp-icon img-rp-p45\"></span><span>4:5</span></button>\n                      <button type=\"button\" class=\"img-rp-ratio-item\" data-label=\"21:9\" data-w=\"21\" data-h=\"9\"><span class=\"img-rp-icon img-rp-ultra\"></span><span>21:9</span></button>\n                    </div>\n                  </div>\n                </div>\n      ";
      const _0x3fa1e8 = _0x559ab3 ? resolveVideoModelApiFooterPlacementOrder(_0x553425?.["modelManifest"]) : DEFAULT_VIDEO_MODEL_API_FOOTER_PLACEMENT_ORDER;
      const _0x5aec2d = _0x3fa1e8["indexOf"]("mode");
      const _0x487b66 = _0x3fa1e8["indexOf"]("resolution");
      const _0x5ddeea = _0x559ab3 && _0xe2730e && _0x5aec2d >= 0x0 && _0x487b66 >= 0x0 && _0x5aec2d < _0x487b66;
      const _0x528c49 = wrapUiSchemaPlacementControls(_0xe2730e);
      const _0x1559ff = wrapUiSchemaPlacementControls(_0x5953c6);
      const _0x1bcd33 = wrapUiSchemaPlacementControls(_0x3925e9);
      _0x2e20ea['innerHTML'] = "\n          <div class=\"img-model-pills\">\n            <div class=\"img-model-wrap\">\n              " + renderNodeModelTrigger({
        'iconHtml': _0xa5c28d,
        'label': _0x3fbd8f(_0x1f5be5)
      }) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22floating-menu\x20img-model-menu\x20node-model-menu\x22\x20data-node-menu-kind=\x22video\x22\x20data-lazy-model-menu=\x22video\x22></div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x354043 ? "<button type=\"button\" class=\"img-pill-btn\" data-video-model-unavailable=\"true\" disabled aria-disabled=\"true\" title=\"" + videoPanelText('modelUnavailable') + '\x22>' + videoPanelText("modelUnavailable") + "</button>" : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x1f6ce3 ? '' : _0x1bcd33) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x1f6ce3 || _0x4448ae ? '' : _0x5ddeea ? _0x528c49 : '') + "\n            " + (_0x1f6ce3 || _0x4448ae ? '' : _0x5ec260 && _0x5bd3d2 ? _0x5bd3d2 : '') + "\n            " + (_0x1f6ce3 || _0x4448ae ? '' : _0x13ee4d ? wrapUiSchemaPlacementControls(_0x13ee4d) : !_0x5ec260 && _0x5953c6 ? _0x1559ff : _0x51c6cd ? "<div class=\"img-ratio-wrap\"" + (_0x57bcc0["ratio"] ? '' : " hidden") + ">\n              <button type=\"button\" class=\"img-pill-btn img-ratio-btn\">\n                <span class=\"img-ratio-icon-slot\">" + _0x332049 + "</span>\n                <span class=\"img-ratio-label\">" + _0x39ea24 + "</span>\n              </button>\n              <div class=\"img-ratio-popup\">\n                " + _0x48d6e5 + "\n              </div>\n            </div>" : '') + "\n            " + (_0x1f6ce3 || _0x4448ae || _0x354043 ? '' : _0x559ab3 ? _0x5ddeea ? '' : _0xe2730e ? _0x528c49 : '' : _0x51c6cd ? "<div class=\"vid-mode-wrap\"" + (_0x57bcc0["mode"] ? '' : " hidden") + ">\n              <button type=\"button\" class=\"img-pill-btn vid-mode-btn\">\n                <span class=\"vid-mode-label\">" + getVideoModeLabel(this["_data"]["mode"]) + "</span>\n              </button>\n              <div class=\"floating-menu vid-mode-menu\">\n                <div class=\"floating-menu-item video-mode-item " + (!this["_data"]["mode"] || this["_data"]["mode"] === VIDEO_MODE_ALL_REFERENCE_VALUE ? "active" : '') + '\x22\x20data-value=\x22' + VIDEO_MODE_ALL_REFERENCE_VALUE + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<svg\x20class=\x22video-mode-icon\x22\x20width=\x2214\x22\x20height=\x2214\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22><path\x20d=\x22M12\x2022s8-4\x208-10V5l-8-3-8\x203v7c0\x206\x208\x2010\x208\x2010z\x22/></svg>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22floating-menu-label\x22>' + videoPanelText("mode.allReference") + "</span>\n                </div>\n                <div class=\"floating-menu-item video-mode-item " + (this["_data"]['mode'] === VIDEO_MODE_FIRST_LAST_VALUE ? 'active' : '') + "\" data-value=\"" + VIDEO_MODE_FIRST_LAST_VALUE + "\">\n                  <svg class=\"video-mode-icon\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M7 7h10M7 17h10\"/></svg>\n                  <span class=\"floating-menu-label\">" + videoPanelText("mode.firstLastFrame") + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>' : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x51c6cd ? "<div class=\"vid-duration-wrap\"" + (_0x57bcc0["duration"] ? '' : " hidden") + ">\n              <button type=\"button\" class=\"img-pill-btn vid-duration-btn\">\n                <span class=\"vid-duration-label\">" + (this["_data"]['duration'] || '5') + 'S</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22floating-menu\x20vid-duration-pop\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22vid-duration-title\x22>' + videoPanelText('duration') + '</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<input\x20type=\x22range\x22\x20class=\x22vid-duration-slider\x22\x20min=\x224\x22\x20max=\x2215\x22\x20step=\x221\x22\x20value=\x22' + (this["_data"]["duration"] || 0x5) + "\">\n                <div class=\"vid-duration-bounds\">\n                  <span class=\"vid-duration-min\">4S</span>\n                  <span class=\"vid-duration-max\">15S</span>\n                </div>\n              </div>\n            </div>" : '') + "\n          </div>\n          <div class=\"prompt-actions\">\n            <button type=\"button\" class=\"img-pill-btn rh-adv2-btn advanced-settings-icon-button\" data-tooltip=\"" + videoPanelText("advancedSettings") + "\" aria-label=\"" + videoPanelText("advancedSettings") + "\" aria-expanded=\"false\"" + (_0x30caa8 && !_0x3416e7 ? '' : '\x20hidden') + '>' + ADVANCED_SETTINGS_TUNE_ICON_MARKUP + "</button>\n            <div class=\"ui-schema-placement ui-schema-instance-slot\"" + (_0x542a37 && _0x35e911 ? '' : " hidden") + '>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + _0x35e911 + "\n            </div>\n            <button type=\"button\" class=\"prompt-submit debug-wrench-btn\" title=\"" + videoPanelText("debugApiParams") + "\">\n              " + DEBUG_WRENCH_ICON_HTML + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22prompt-submit\x20img-gen-btn\x22\x20' + (_0x354043 ? "disabled aria-disabled=\"true\" title=\"" + videoPanelText("modelUnavailable") + '\x22' : _0x395748 ? "data-tooltip=\"" + getVideoCancelTooltip() + '\x22' : "title=\"" + getVideoGenerateTitle() + '\x22') + ">\n                    <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"5\"/><polyline points=\"5 12 12 5 19 12\"/></svg>\n                  </button>\n          </div>";
      const _0x3fc802 = _0x289f40 ? "\n          <div class=\"rh-vram-adv-panel" + (_0x209146 ? " show " + RH_AI_APP_PERSISTENT_ADVANCED_CLASS : '') + "\">\n            " + _0x289f40 + "\n          </div>\n        " : '';
      _0x360dc4 && this["_decorateDreaminaFooter"](_0x2e20ea, _0x360dc4);
      if (_0x3fc802) {
        _0x2e20ea['insertAdjacentHTML']("beforeend", _0x3fc802);
      }
      this["rhVramAdvPanelEl"] = _0x2e20ea["querySelector"](".rh-vram-adv-panel");
      this["_uiSchemaCleanup"]?.();
      this["_uiSchemaCleanup"] = _0x360dc4 ? bindUiSchemaFieldControls(_0x2e20ea, {
        'getNodeData': () => decorateSegmentRetakeParameterNodeData(this["_getDreaminaEffectiveNodeData"](_0x10ce4b["getState"]?.()["nodes"]?.[this["nodeId"]] || this["_data"] || {})),
        'commitFieldValue': (_0x28c55c, _0x5aba37, _0xb1b6ec) => this["_commitDreaminaSchemaField"](_0x28c55c, _0x5aba37, _0xb1b6ec)
      }) : bindModelUiSchemaControls(_0x2e20ea, {
        'nodeId': this["nodeId"],
        'nodeData': this['_data'],
        'store': _0x10ce4b,
        'decorateNodeData': _0x30169c => decorateSegmentRetakeParameterNodeData(this['_getRhVideoAdvancedSchemaNodeData'](_0x30169c)),
        'buildPatch': (_0x332d5e, _0x458ecc, _0x3ff4f7, _0x4e3bab) => {
          const _0x2f3a0a = String(_0x458ecc || '')["trim"]();
          const _0x493e6a = _0x10ce4b["getState"]?.() || {};
          const _0x3e92c = getManifestInputPolicyEdgeIdsToRemove({
            'latest': _0x332d5e,
            'fieldId': _0x2f3a0a,
            'value': _0x3ff4f7,
            'inEdges': _0x10ce4b["getIncomingEdges"]?.(this['nodeId']) || [],
            'nodes': _0x493e6a["nodes"] || {}
          });
          const _0x309e36 = Array['isArray'](_0x3e92c) ? _0x3e92c : [];
          if (_0x309e36['length'] > 0x0) {
            const _0x6ae6aa = () => {
              _0x309e36['forEach'](_0x417d6f => _0x10ce4b["removeEdge"]?.(_0x417d6f));
            };
            if (typeof _0x10ce4b["batch"] === "function") {
              _0x10ce4b["batch"](_0x6ae6aa);
            } else {
              _0x6ae6aa();
            }
          }
          return {
            ...buildRhWorkflowFieldPatch(_0x332d5e, _0x458ecc, _0x3ff4f7, _0x4e3bab),
            ...this["_buildModelApiAspectRatioDisplayPatch"](_0x332d5e, _0x458ecc, _0x3ff4f7, _0x4e3bab),
            ...this["_buildRunningHubWorkflowAspectRatioDisplayPatch"](_0x332d5e, _0x458ecc, _0x3ff4f7, _0x4e3bab)
          };
        },
        'afterCommit': (_0x4a6676, _0x11f951, _0x42599b) => {
          const _0x452a68 = String(_0x4a6676 || '')["trim"]();
          const _0x2d1a6d = getPanelModelManifest(_0x42599b);
          const _0x2e91d3 = manifestHelpVariantsReferenceField(_0x2d1a6d, _0x452a68);
          const _0x4c4ae8 = manifestPromptVariantsReferenceField(_0x2d1a6d, _0x452a68);
          const _0x3f7158 = manifestFixedSlotVisibilityReferencesField(_0x2d1a6d, _0x452a68);
          (_0x2e91d3 || _0x4c4ae8 || _0x3f7158) && (this['_data'] = {
            ...(this["_data"] || {}),
            ...(_0x42599b || {})
          }, _0x2e91d3 && this['_syncGenerationNodeHelpTip']?.(), _0x4c4ae8 && this["_syncDreaminaPromptPlaceholder"]?.(this['_data']), _0x3f7158 && this["_renderRefBar"]?.(), this["_updateSubmitButtonState"]?.());
        }
      });
      (_0xe9bf93 && !_0x3416e7 || _0x209146) && this["rhVramAdvPanelEl"] && this["rhVramAdvPanelEl"]['classList']['add']('show');
      syncNodeFooterAdvancedButtonState(_0x2e20ea);
      this["btnEl"] = _0x2e20ea["querySelector"]('.img-gen-btn');
      this["_bindFooterEvents"](_0x2e20ea);
    }
    ["_ensureVideoAdvancedPanel"](_0x2a11cf) {
      if (!_0x2a11cf) {
        return null;
      }
      const _0x5c2f36 = (this["rhVramAdvPanelEl"] && (typeof _0x2a11cf['contains'] !== 'function' || _0x2a11cf["contains"](this["rhVramAdvPanelEl"])) ? this["rhVramAdvPanelEl"] : null) || _0x2a11cf["querySelector"]?.('.rh-vram-adv-panel');
      const _0x3bbc9e = _0x10ce4b["getState"]?.()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      const _0x2e0808 = isRhAiAppPanelModel(_0x3bbc9e);
      const _0x5d7cb = isCustomAiAppManifest(getPanelModelManifest(_0x3bbc9e));
      if (!this["_hasVisibleVideoAdvancedControls"](_0x3bbc9e)) {
        _0x5c2f36?.["classList"]?.['remove']("show", RH_AI_APP_PERSISTENT_ADVANCED_CLASS);
        syncNodeFooterAdvancedButtonState(_0x2a11cf);
        return null;
      }
      if (_0x5c2f36) {
        this['rhVramAdvPanelEl'] = _0x5c2f36;
        _0x5c2f36["classList"]["toggle"](RH_AI_APP_PERSISTENT_ADVANCED_CLASS, _0x5d7cb);
        if (_0x5d7cb) {
          _0x5c2f36["classList"]['add']("show");
        }
        if (_0x2e0808 && !_0x5d7cb) {
          _0x5c2f36["classList"]["remove"]("show");
        }
        return _0x5c2f36;
      }
      const _0x1d3ba7 = this["_renderVideoAdvancedControlsHtml"](_0x3bbc9e);
      _0x2a11cf["insertAdjacentHTML"]?.('beforeend', "\n          <div class=\"rh-vram-adv-panel" + (_0x5d7cb ? " show " + RH_AI_APP_PERSISTENT_ADVANCED_CLASS : '') + "\">\n            " + _0x1d3ba7 + "\n          </div>\n        ");
      this["rhVramAdvPanelEl"] = _0x2a11cf["querySelector"]?.(".rh-vram-adv-panel") || null;
      return this["rhVramAdvPanelEl"];
    }
    ["_runVipRetryOnce"](_0x4d58ae) {
      let _0x1be053 = ![];
      return () => {
        if (_0x1be053) {
          return;
        }
        _0x1be053 = !![];
        this["_vipSelectionRetryInProgress"] = !![];
        try {
          _0x4d58ae();
        } finally {
          this["_vipSelectionRetryInProgress"] = ![];
        }
      };
    }
    ["_guardVipSelection"](_0x3fdd01, _0x51f474 = null, _0x55af3f = null) {
      const _0xa75edd = String(_0x3fdd01 || '');
      let _0x520a80 = '';
      let _0x4615a5 = _0x55af3f;
      typeof _0x51f474 === "function" ? _0x4615a5 = _0x51f474 : _0x520a80 = String(_0x51f474 || '')["trim"]();
      if (!_0x3814a2(_0xa75edd, _0x520a80)) {
        return !![];
      }
      const _0x3522d1 = window["isModelAllowedBySubscription"];
      const _0x28b21b = typeof _0x3522d1 === 'function' ? _0x3522d1(_0xa75edd, _0x520a80) : !![];
      if (_0x28b21b) {
        return !![];
      }
      if (this['_vipSelectionRetryInProgress']) {
        return ![];
      }
      typeof window["openSubscriptionDialog"] === 'function' ? window['openSubscriptionDialog']({
        'modelId': _0xa75edd,
        'provider': _0x520a80,
        'onSuccess': _0x4615a5
      }) : window["showToast"]?.(videoPanelText("vipRequired"), "warn");
      return ![];
    }
    ['_bindFooterEvents'](_0x1db7d2) {
      this["_footerControllerCleanup"]?.();
      const _0x18838f = _0x1db7d2["querySelector"](".img-model-btn-trigger");
      const _0x3e5794 = _0x1db7d2["querySelector"](".img-model-menu");
      const _0xc99963 = {
        'listenConfigChanges': ![],
        'getProviderProfileId': () => {
          const _0x104126 = _0x10ce4b["getState"]?.()?.["nodes"]?.[this["nodeId"]] || this["_data"] || {};
          return _0x104126["providerProfileId"] || _0x104126['rhProviderProfileId'] || '';
        }
      };
      this["_modelCredentialMenuCleanup"]?.();
      this["_modelCredentialMenuCleanup"] = bindModelCredentialMenu(_0x3e5794, _0xc99963);
      const _0x10ef3c = _0x1db7d2["querySelector"](".dreamina-task-model-btn");
      const _0x5bcf4f = _0x1db7d2["querySelector"](".dreamina-task-model-menu");
      const _0x32ac96 = _0x1db7d2["querySelector"]('.img-ratio-btn:not([data-ui-schema-menu-trigger])');
      const _0x4bf4d2 = _0x1db7d2['querySelector']('.img-ratio-popup');
      const _0x12bded = _0x1db7d2['querySelector'](".img-ratio-label");
      const _0xc431e2 = _0x1db7d2["querySelector"](".img-ratio-icon-slot");
      const _0x5f33c3 = _0x1db7d2["querySelector"](".vid-mode-btn");
      const _0x26f8aa = _0x1db7d2["querySelector"](".vid-mode-menu");
      const _0x3d9993 = _0x1db7d2["querySelector"]('.vid-mode-label');
      const _0x467abc = _0x1db7d2["querySelector"](".vid-duration-btn");
      const _0x15f9f1 = _0x1db7d2['querySelector'](".vid-duration-pop");
      const _0x127bf6 = _0x1db7d2['querySelector'](".vid-duration-slider");
      const _0x5731ca = _0x1db7d2["querySelector"](".vid-duration-label");
      const _0x271e21 = _0x1db7d2["querySelector"](".rh-adv2-btn");
      const _0x225d7a = () => this["_ensureVideoAdvancedPanel"](_0x1db7d2);
      const _0x2c7a2b = () => {
        _0x4bf4d2?.["classList"]['remove']("show");
      };
      const _0x39d9e0 = () => {
        _0x15f9f1?.["classList"]['remove']("show");
      };
      const _0x2c9245 = this["_isDreaminaVideoNode"](this['_data']);
      const _0x4da863 = decorateSegmentRetakeParameterNodeData(_0x2c9245 ? this['_getDreaminaEffectiveNodeData'](this['_data']) : this["_getRhVideoAdvancedSchemaNodeData"](this['_data']));
      syncModelUiSchemaControls(_0x1db7d2, _0x4da863);
      const _0xdbeeaa = _0x4f2768 => {
        const _0x57b04f = _0x10ce4b["getState"]()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
        const {
          payload: _0x5bab9b,
          displayPatch = {}
        } = buildGenerationModelSelectionPayload({
          'payload': _0x4f2768,
          'store': _0x10ce4b,
          'nodeId': this['nodeId'],
          'nodeData': _0x57b04f,
          'fallbackNodeData': this["_data"],
          'minSide': _0x4670c9()["width"],
          'inputKinds': ["image", "video"],
          'resultMediaElement': this["videoEl"],
          'resultFields': VIDEO_DISPLAY_RATIO_RESULT_FIELDS
        });
        Object["keys"](displayPatch)["length"] > 0x0 && applyImageSchemaRatioResizeAnimation(this, {
          'nodeId': this["nodeId"],
          'previewEl': this['previewEl'],
          'nodeData': _0x57b04f,
          'patch': displayPatch
        });
        const _0x181b3d = {
          ...(_0x10ce4b["getState"]()['nodes']?.[this["nodeId"]] || this["_data"] || {}),
          ..._0x5bab9b
        };
        _0x10ce4b["updateNodeData"](this["nodeId"], _0x5bab9b);
        this["_data"] = _0x181b3d;
        rememberSegmentRetakeModelSelection(_0x57b04f, _0x181b3d["model"]);
        this["_lastFooterSig"] = '';
        this['_renderFooter'](_0x1db7d2);
        return _0x181b3d;
      };
      const _0x542ba9 = () => _0x10ce4b['getState']()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      const _0x2e29b5 = ({
        model: _0x37fcbb,
        provider: _0x50325c,
        useRememberedRouteModel = ![]
      } = {}) => {
        const _0x1ddbc9 = String(_0x37fcbb || '')["trim"]();
        if (!_0x1ddbc9) {
          return null;
        }
        const _0x257c3a = _0x542ba9();
        const _0x2e193d = this["_getDreaminaEffectiveNodeData"](_0x257c3a);
        const _0x134002 = this["_syncDreaminaTaskState"](_0x257c3a, {
          'syncStore': ![]
        });
        const _0x643272 = _0x134002?.["nodeData"] || _0x2e193d || _0x257c3a;
        const _0x74ab7e = resolveDreaminaStyleVideoProvider(_0x1ddbc9, _0x50325c || _0x643272?.["provider"] || "dreamina");
        const _0x5cb210 = _0x134002?.["resolvedTaskType"] || this["_getResolvedDreaminaTaskType"](_0x643272, _0x134002?.['summary']);
        const _0x4ce024 = _0x134002?.["routeMode"] || normalizeDreaminaVideoRouteMode(_0x643272?.["dreaminaRouteMode"], _0x643272?.["mode"]);
        const _0x13f2a9 = _0x257c3a?.["segmentRetake"] ? getDreaminaTaskModelMenuItems(_0x5cb210, _0x74ab7e, {
          'allowedModelIds': getSegmentRetakeAllowedModelIdsForNode(_0x257c3a)
        }) : [];
        const _0x1914ce = _0x13f2a9["some"](_0x5e0074 => _0x5e0074['model'] === _0x1ddbc9) ? _0x1ddbc9 : _0x13f2a9[0x0]?.["model"] || _0x1ddbc9;
        const _0x112699 = ensureDreaminaStyleVideoModelForTask(_0x5cb210, _0x1914ce, _0x74ab7e) || _0x1914ce;
        const _0x4a1ecc = _0x13f2a9["length"] ? _0x1914ce : useRememberedRouteModel ? resolveDreaminaRememberedRouteModel(_0x643272, {
          'provider': _0x74ab7e,
          'routeMode': _0x4ce024,
          'taskType': _0x5cb210,
          'fallbackModel': _0x112699
        }) || _0x112699 : _0x112699;
        const _0x3f9add = normalizeDreaminaStyleVideoResolution(_0x5cb210, _0x4a1ecc, _0x643272?.["resolution"] || _0x643272?.["videoSize"], _0x74ab7e);
        const _0x31e5ad = normalizeDreaminaStyleVideoDuration(_0x5cb210, _0x4a1ecc, _0x643272?.["duration"], _0x74ab7e);
        const _0x3fe2ee = {
          'provider': _0x74ab7e,
          'model': _0x4a1ecc
        };
        return _0xdbeeaa({
          ..._0x3fe2ee,
          ...this["_buildDreaminaModelSelectionParamPatch"](_0x643272, {
            'model': _0x4a1ecc,
            'provider': _0x74ab7e,
            'taskType': _0x5cb210,
            'fallbackValues': {
              'dreaminaRouteMode': _0x4ce024,
              'aspectRatio': _0x643272?.["aspectRatio"],
              ...(_0x3f9add ? {
                'resolution': _0x3f9add
              } : {}),
              'duration': _0x31e5ad
            }
          })
        });
      };
      const _0x1562bb = bindLazyVideoModelMenu({
        'trigger': _0x18838f,
        'menu': _0x3e5794,
        'getActiveModel': () => String(_0x542ba9()?.['model'] || this['_data']?.["model"] || '')["trim"]() || getDefaultVideoModelId(),
        'renderMenuHtml': _0x40ce1c => this["_buildVideoModelMenuHtml"](_0x40ce1c),
        'onPrepared': _0x10957b => {
          void syncModelCredentialMenu(_0x10957b, _0xc99963);
        }
      });
      _0x18838f && _0x3e5794 && _0x18838f["addEventListener"]('click', _0x489dea => {
        _0x489dea["stopPropagation"]();
        const _0x48e88d = _0x1562bb["prepareNow"]();
        if (!_0x48e88d) {
          return;
        }
        const _0x1acdeb = !_0x48e88d["classList"]["contains"]("show");
        closeNodeFooterMenus(_0x1db7d2, _0x3e5794);
        _0x5bcf4f?.["classList"]["remove"]("show");
        _0x48e88d['classList']["toggle"]("show", _0x1acdeb);
        if (_0x1acdeb) {
          _0x3e7ad9(_0x48e88d);
        }
      });
      _0x32ac96 && _0x4bf4d2 && bindVideoPanelClick(_0x32ac96, "ratio-trigger", _0x57c374 => {
        _0x57c374["stopPropagation"]();
        if (_0x32ac96['disabled'] || !String(_0x4bf4d2['innerHTML'] || '')["trim"]()) {
          return;
        }
        _0x4bf4d2['classList']['toggle']("show");
        _0x3e5794["classList"]["remove"]("show");
        _0x5bcf4f?.["classList"]["remove"]("show");
        if (_0x26f8aa) {
          _0x26f8aa['classList']["remove"]("show");
        }
        _0x39d9e0();
        _0x225d7a()?.["classList"]["remove"]("show");
      });
      _0x10ef3c && _0x5bcf4f && bindVideoPanelClick(_0x10ef3c, "dreamina-task-model-trigger", _0x3c929b => {
        _0x3c929b["stopPropagation"]();
        if (_0x10ef3c["disabled"]) {
          return;
        }
        _0x5bcf4f['classList']["toggle"]('show');
        _0x3e5794["classList"]["remove"]('show');
        _0x2c7a2b();
        if (_0x26f8aa) {
          _0x26f8aa['classList']["remove"]('show');
        }
        _0x39d9e0();
        _0x225d7a()?.["classList"]["remove"]('show');
        _0x5bcf4f['classList']["contains"]("show") && _0x3e7ad9(_0x5bcf4f);
      });
      _0x5f33c3 && _0x26f8aa && bindVideoPanelClick(_0x5f33c3, "mode-trigger", _0x431985 => {
        _0x431985["stopPropagation"]();
        _0x26f8aa["classList"]["toggle"]("show");
        _0x3e5794['classList']["remove"]("show");
        _0x5bcf4f?.["classList"]["remove"]('show');
        _0x2c7a2b();
        _0x39d9e0();
        _0x225d7a()?.["classList"]["remove"]("show");
        _0x26f8aa["classList"]['contains']("show") && _0x3e7ad9(_0x26f8aa);
      });
      _0x467abc && _0x15f9f1 && bindVideoPanelClick(_0x467abc, "duration-trigger", _0x297603 => {
        _0x297603["stopPropagation"]();
        _0x15f9f1["classList"]["toggle"]("show");
        _0x3e5794["classList"]['remove']("show");
        _0x5bcf4f?.["classList"]['remove']('show');
        _0x2c7a2b();
        if (_0x26f8aa) {
          _0x26f8aa['classList']["remove"]('show');
        }
        _0x225d7a()?.["classList"]["remove"]("show");
      });
      const _0x5ce415 = () => {
        closeNodeFooterMenus(_0x1db7d2);
      };
      _0x3e5794?.["addEventListener"]("click", _0x5a1ba3 => {
        _0x5a1ba3["stopPropagation"]();
        const _0x1e290a = _0x5a1ba3["target"]?.["closest"]?.('.floating-menu-item');
        if (!_0x1e290a || !_0x3e5794["contains"](_0x1e290a)) {
          return;
        }
        if (_0x1e290a["hasAttribute"]("data-node-menu-submenu")) {
          return;
        }
        if (_0x1e290a["closest"](".apimart-video-submenu")) {
          const _0x12a686 = _0x1e290a["dataset"]["value"] || APIMART_DREAMINA_VIDEO_DEFAULT_MODEL;
          if (isApimartDreaminaVideoModel(_0x12a686, 'apimart')) {
            _0x2e29b5({
              'model': _0x12a686,
              'provider': "apimart",
              'useRememberedRouteModel': !![]
            });
            return;
          }
        }
        if (_0x1e290a["closest"](".runninghub-submenu")) {
          if (_0x1e290a["dataset"]["disabled"] === "true") {
            window['showToast']?.(videoPanelText("videoGenerationUnavailable"), "warn");
            _0x5ce415();
            return;
          }
          const _0x40977 = _0x1e290a['dataset']["value"];
          if (!_0x40977) {
            return;
          }
          const _0x4a6850 = this["_runVipRetryOnce"](() => _0x1e290a["click"]());
          if (!this['_guardVipSelection'](_0x40977, _0x4a6850)) {
            _0x5ce415();
            return;
          }
          const _0x2b765b = _0x1e290a["dataset"]["provider"] || null;
          const _0x39150f = _0x10ce4b["getState"]()["nodes"]?.[this["nodeId"]] || {};
          const _0x10f22b = {
            'model': _0x40977,
            'provider': _0x2b765b,
            'providerProfileId': _0x1e290a["dataset"]["credentialResolvedProviderProfileId"] || undefined
          };
          if (this["_isRunninghubWorkflowModel"](_0x40977, _0x2b765b)) {
            Object["assign"](_0x10f22b, buildVideoWorkflowModelSelectionPatch(_0x39150f, _0x40977, {
              'preserveMaskTouchedState': !![],
              'v54FpsOptions': getRhV54FpsOptions()
            }));
          } else {
            const _0xdec56 = resolveModelExecution(_0x40977, {
              'providerHint': _0x2b765b
            });
            _0xdec56?.["modelManifest"]?.["kind"] === "video" && _0xdec56?.['modelManifest']?.['adapterType'] === "modelApi" && Object['assign'](_0x10f22b, buildVideoModelApiModelSelectionPatch(_0x39150f, _0xdec56["canonicalModelId"] || _0x40977, _0x2b765b || _0xdec56?.['modelManifest']?.["provider"] || null, _0x10f22b));
          }
          _0xdbeeaa(_0x10f22b);
          return;
        }
        if (_0x1e290a["dataset"]["disabled"] === "true") {
          window["showToast"]?.(videoPanelText("videoGenerationUnavailable"), "warn");
          _0x5ce415();
          return;
        }
        const _0xa679bf = _0x1e290a['dataset']["value"];
        if (!_0xa679bf) {
          return;
        }
        const _0xa1075c = _0x1e290a['dataset']["provider"] || "dreamina";
        if (isDreaminaStyleVideoModel(_0xa679bf, _0xa1075c)) {
          const _0x8840a2 = resolveDreaminaStyleVideoProvider(_0xa679bf, _0xa1075c);
          const _0xbcdc6c = this["_runVipRetryOnce"](() => _0x1e290a['click']());
          if (!this["_guardVipSelection"](_0xa679bf, _0x8840a2, _0xbcdc6c)) {
            _0x5ce415();
            return;
          }
          _0x2e29b5({
            'model': _0xa679bf,
            'provider': _0x8840a2,
            'useRememberedRouteModel': !![]
          });
          return;
        }
        const _0x281fda = this["_runVipRetryOnce"](() => _0x1e290a["click"]());
        if (!this['_guardVipSelection'](_0xa679bf, _0x281fda)) {
          _0x5ce415();
          return;
        }
        const _0x5c9820 = {
          'model': _0xa679bf
        };
        _0x5c9820["provider"] = _0x1e290a["dataset"]['provider'] || null;
        const _0x5298fa = _0x10ce4b["getState"]()['nodes']?.[this['nodeId']] || {};
        if (this["_isRunninghubWorkflowModel"](_0xa679bf, _0x5c9820["provider"])) {
          Object['assign'](_0x5c9820, buildVideoWorkflowModelSelectionPatch(_0x5298fa, _0xa679bf, {
            'v54FpsOptions': getRhV54FpsOptions()
          }));
        } else {
          const _0x401f4c = resolveModelExecution(_0xa679bf, {
            'providerHint': _0x5c9820["provider"]
          });
          _0x401f4c?.["modelManifest"]?.["kind"] === "video" && _0x401f4c?.["modelManifest"]?.['adapterType'] === "modelApi" && Object["assign"](_0x5c9820, buildVideoModelApiModelSelectionPatch(_0x5298fa, _0x401f4c["canonicalModelId"] || _0xa679bf, _0x5c9820["provider"] || _0x401f4c?.["modelManifest"]?.['provider'] || null, _0x5c9820));
        }
        _0xa679bf["includes"]('seedance') && (!this["_data"]["resolution"] || this["_data"]["resolution"] !== "720p") && (_0x5c9820["resolution"] = '720p');
        _0xdbeeaa(_0x5c9820);
      });
      _0x5bcf4f?.['querySelectorAll'](".floating-menu-item")["forEach"](_0x183897 => bindVideoPanelClick(_0x183897, "dreamina-task-model-item", () => {
        if (_0x183897['dataset']["disabled"] === 'true') {
          window["showToast"]?.(videoPanelText("smartMultiframeUnavailable"), "warn");
          _0x5bcf4f["classList"]["remove"]("show");
          return;
        }
        const _0xb1fff0 = String(_0x183897["dataset"]['value'] || '')["trim"]();
        if (!_0xb1fff0) {
          return;
        }
        const _0x38d096 = resolveDreaminaStyleVideoProvider(_0xb1fff0, _0x183897["dataset"]["provider"] || this["_data"]?.["provider"] || "dreamina");
        const _0x4488ff = this["_runVipRetryOnce"](() => _0x183897["click"]());
        if (!this["_guardVipSelection"](_0xb1fff0, _0x38d096, _0x4488ff)) {
          _0x5bcf4f["classList"]["remove"]("show");
          return;
        }
        _0x2e29b5({
          'model': _0xb1fff0,
          'provider': _0x38d096,
          'useRememberedRouteModel': ![]
        });
      }));
      if (_0x271e21) {
        bindVideoPanelClick(_0x271e21, 'rh-advanced-trigger', _0x5182ef => {
          _0x5182ef["stopPropagation"]();
          const _0x5e969e = _0x225d7a();
          if (!_0x5e969e) {
            return;
          }
          const _0x37f6a4 = !_0x5e969e["classList"]["contains"]("show");
          _0x5e969e["classList"]["toggle"]("show", _0x37f6a4);
          _0x271e21['setAttribute']?.('aria-expanded', String(_0x37f6a4));
          _0x3e5794['classList']["remove"]('show');
          _0x2c7a2b();
          if (_0x26f8aa) {
            _0x26f8aa["classList"]["remove"]("show");
          }
          _0x39d9e0();
        });
        const _0x3b68e3 = _0x225d7a();
        _0x3b68e3 && bindVideoPanelClick(_0x3b68e3, "rh-advanced-panel-stop", _0x1e67bd => _0x1e67bd["stopPropagation"]());
      }
      _0x26f8aa && _0x3d9993 && _0x26f8aa["querySelectorAll"](".floating-menu-item")["forEach"](_0x3189a8 => bindVideoPanelClick(_0x3189a8, "mode-item", () => {
        if (_0x2c9245) {
          const _0x5acccc = normalizeDreaminaVideoRouteMode(_0x3189a8["dataset"]["routeMode"] || _0x3189a8["dataset"]["value"]);
          if (!_0x5acccc) {
            return;
          }
          this["_commitDreaminaRouteMode"](_0x5acccc, this["_data"]);
          _0x26f8aa["classList"]['remove']("show");
          return;
        }
        const _0xa6a989 = _0x3189a8["dataset"]["value"];
        _0x10ce4b['updateNodeData'](this['nodeId'], {
          'mode': _0xa6a989
        });
        _0x3d9993['textContent'] = getVideoModeLabel(_0xa6a989);
        _0x26f8aa["classList"]["remove"]("show");
        _0x26f8aa["querySelectorAll"](".floating-menu-item")["forEach"](_0x4f95c9 => _0x4f95c9['classList']["toggle"]("active", _0x4f95c9 === _0x3189a8));
      }));
      if (_0x2c9245 && _0x26f8aa) {
        const _0x4115b0 = () => {
          const _0x1d58d6 = [];
          _0x26f8aa['querySelectorAll'](".dreamina-transition-prompt")['forEach'](_0x2aea91 => {
            const _0x373366 = Number(_0x2aea91["dataset"]["index"]);
            Number["isFinite"](_0x373366) && (_0x1d58d6[_0x373366] = _0x2aea91["value"]);
          });
          const _0xa06a46 = [];
          _0x26f8aa["querySelectorAll"](".dreamina-transition-duration")["forEach"](_0x599146 => {
            const _0x5de5ee = Number(_0x599146["dataset"]["index"]);
            Number["isFinite"](_0x5de5ee) && (_0xa06a46[_0x5de5ee] = _0x599146['value']);
          });
          _0x10ce4b["updateNodeData"](this["nodeId"], {
            'dreaminaTransitionPrompts': _0x1d58d6,
            'dreaminaTransitionDurations': _0xa06a46
          });
        };
        _0x26f8aa["querySelectorAll"]('.dreamina-transition-prompt')["forEach"](_0x46bcba => {
          _0x46bcba["addEventListener"]("input", _0x4115b0);
          _0x46bcba["addEventListener"]("click", _0x4d64ee => _0x4d64ee["stopPropagation"]());
        });
        _0x26f8aa["querySelectorAll"](".dreamina-transition-duration")["forEach"](_0x364cc2 => {
          _0x364cc2["addEventListener"]("input", _0x4115b0);
          _0x364cc2["addEventListener"]("change", _0x4115b0);
          _0x364cc2["addEventListener"]('click', _0x21b952 => _0x21b952["stopPropagation"]());
        });
      }
      _0x127bf6 && _0x5731ca && bindVideoPanelInput(_0x127bf6, "duration-slider", () => {
        if (_0x2c9245) {
          const _0x44e33b = this['_syncDreaminaTaskState'](this["_data"], {
            'syncStore': ![]
          });
          const _0x1aadc1 = _0x44e33b?.["resolvedTaskType"] || this["_getResolvedDreaminaTaskType"]();
          const _0x5f241b = resolveDreaminaStyleVideoProvider(this['_data']?.["model"], this['_data']?.['provider']);
          const _0x3e9d83 = ensureDreaminaStyleVideoModelForTask(_0x1aadc1, this["_data"]?.["model"], _0x5f241b);
          const _0x69a8b2 = normalizeDreaminaStyleVideoDuration(_0x1aadc1, _0x3e9d83, _0x127bf6['value'], _0x5f241b);
          _0x5731ca["textContent"] = _0x69a8b2 + 'S';
          this["_commitDreaminaParamValues"]({
            'duration': _0x69a8b2
          }, this['_data']);
          return;
        }
        const _0x488682 = _0x127bf6["value"];
        _0x5731ca["textContent"] = _0x488682 + 'S';
        _0x10ce4b["updateNodeData"](this['nodeId'], {
          'duration': parseInt(_0x488682, 0xa)
        });
      });
      _0x12bded && _0x4bf4d2?.["querySelectorAll"]('.img-rp-quality-item')["forEach"](_0x321fd1 => bindVideoPanelClick(_0x321fd1, "ratio-quality-item", () => {
        if (_0x321fd1["hasAttribute"]("disabled")) {
          return;
        }
        if (_0x321fd1["closest"]("[data-ui-schema-field]")) {
          return;
        }
        if (_0x2c9245 && _0x321fd1['dataset']["dreaminaKind"] === "resolution") {
          const _0x33a48d = String(_0x321fd1["dataset"]['value'] || '')['trim']();
          if (!_0x33a48d) {
            return;
          }
          this["_commitDreaminaParamValues"]({
            'resolution': _0x33a48d
          }, this["_data"]);
          const _0x2d67d0 = {
            ...this["_getDreaminaEffectiveNodeData"](_0x10ce4b['getState']()['nodes']?.[this["nodeId"]] || this["_data"] || {})
          };
          const _0x597a8b = this["_getDreaminaRatioDisplayState"](_0x2d67d0);
          _0x12bded["textContent"] = _0x597a8b?.["ratioLabelText"] || formatVideoRatioResolutionLabel(_0x2d67d0['aspectRatio'] || "1:1", _0x33a48d);
          _0xc431e2 && (_0xc431e2["innerHTML"] = this['_getRatioIconHTML'](_0x597a8b?.['ratioIconLabel'] || _0x2d67d0['aspectRatio'] || "1:1"));
          const _0x5e839e = _0x321fd1['parentElement'];
          _0x5e839e?.["querySelectorAll"](".img-rp-quality-item")['forEach'](_0x503e8f => _0x503e8f["classList"]["remove"]("active"));
          _0x321fd1["classList"]["add"]('active');
          return;
        }
        _0x10ce4b["updateNodeData"](this["nodeId"], {
          'resolution': _0x321fd1["dataset"]['value']
        });
        _0x12bded["textContent"] = formatVideoRatioResolutionLabel(this["_data"]['aspectRatio'], _0x321fd1["dataset"]["value"]);
        const _0x109e60 = _0x321fd1["parentElement"];
        _0x109e60?.["querySelectorAll"](".img-rp-quality-item")["forEach"](_0x4b9535 => _0x4b9535["classList"]['remove']('active'));
        _0x321fd1["classList"]["add"]('active');
      }));
      const _0x2595ad = _0x25d72c => {
        const _0x7a3a33 = String(_0x25d72c || '')["trim"]();
        if (!_0x7a3a33 || _0x7a3a33 === "自适应") {
          return {
            'w': 0x1,
            'h': 0x1,
            'label': "自适应"
          };
        }
        const _0x4a618d = _0x7a3a33["match"](/^(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)$/);
        if (!_0x4a618d) {
          return null;
        }
        return {
          'w': parseFloat(_0x4a618d[0x1]),
          'h': parseFloat(_0x4a618d[0x2]),
          'label': _0x4a618d[0x1] + ':' + _0x4a618d[0x2]
        };
      };
      const _0x3e9509 = (_0x3df20a = '', _0x4f09c8 = ![]) => {
        const _0x231a8b = String(_0x3df20a || '')["trim"]();
        const _0x213bce = !!_0x4f09c8 || _0x231a8b === "自适应";
        _0x1db7d2['querySelectorAll']('.img-rp-ratio-item:not([data-ui-schema-value]),.img-rp-large-adaptive:not([data-ui-schema-value])')["forEach"](_0xb967e => _0xb967e["classList"]["remove"]("active"));
        if (_0x213bce) {
          _0x1db7d2["querySelector"](".img-rp-large-adaptive:not([data-ui-schema-value])")?.["classList"]["add"]('active');
          return;
        }
        _0x1db7d2['querySelectorAll'](".img-rp-ratio-item:not([data-ui-schema-value])")["forEach"](_0x500614 => _0x500614["classList"]['toggle']("active", String(_0x500614["dataset"]["label"] || '')["trim"]() === _0x231a8b));
      };
      const _0x18f469 = (_0x1b5425, _0x270675, _0x12ddf1, _0x255dac = {}) => {
        const _0x363fbc = _0x255dac?.['persistAspectRatio'] !== ![];
        const _0xde52ca = _0x255dac?.['forceManualDisplaySize'] === !![];
        const _0x2e308e = _0x10ce4b["getState"]()['nodes']?.[this['nodeId']] || this["_data"] || {};
        if (!_0xde52ca && _0x2e308e?.[GENERATION_MANUAL_DISPLAY_SIZE_FIELD] === !![]) {
          return;
        }
        const _0x59ed49 = _0x2e308e["width"] || this["_data"]['width'] || 0x12c;
        const _0x102657 = _0x2e308e['height'] || this["_data"]['height'] || 0x12c;
        const _0x1794ff = _0x4670c9(_0x1b5425, _0x270675);
        const _0x32798a = _0x1794ff["width"];
        const _0x8de059 = _0x1794ff["height"];
        const _0x2bc19f = _0x32798a - _0x59ed49;
        const _0x41848d = _0x8de059 - _0x102657;
        (_0x2bc19f !== 0x0 || _0x41848d !== 0x0) && armImageSchemaRatioResizeAnimation(this, this['nodeId'], a558_0x851fc);
        const _0x25ccd5 = {
          'width': _0x32798a,
          'height': _0x8de059,
          'x': Math["round"]((_0x2e308e['x'] ?? this["_data"]['x'] ?? 0x0) - _0x2bc19f / 0x2),
          'y': Math['round']((_0x2e308e['y'] ?? this['_data']['y'] ?? 0x0) - _0x41848d)
        };
        _0xde52ca && (_0x25ccd5[GENERATION_MANUAL_DISPLAY_SIZE_FIELD] = ![]);
        _0x363fbc && (this["_isDreaminaVideoNode"](this["_data"]) ? Object['assign'](_0x25ccd5, this["_buildDreaminaParamPatch"](this['_data'], {
          'aspectRatio': _0x12ddf1
        })) : _0x25ccd5['aspectRatio'] = _0x12ddf1);
        _0x10ce4b["updateNodeData"](this["nodeId"], _0x25ccd5);
        const _0x4250d5 = _0x10ce4b["getState"]()["nodes"]?.[this["nodeId"]] || {
          ..._0x2e308e,
          ..._0x25ccd5
        };
        this["_data"] = _0x4250d5;
        const _0x5ac1f8 = this["_getDreaminaRatioDisplayState"](_0x4250d5);
        const _0x2d9c3b = this['footerEl'] || _0x1db7d2;
        const _0x117415 = _0x5ac1f8?.["ratioLabelText"] || formatVideoRatioResolutionLabel(_0x12ddf1, _0x4250d5['resolution'] || "1080p");
        const _0xc1c452 = this['_getRatioIconHTML'](_0x5ac1f8?.["ratioIconLabel"] || _0x12ddf1);
        syncLegacyVideoRatioFooter({
          'footer': _0x2d9c3b,
          'fallbackLabel': _0x12bded,
          'fallbackIconSlot': _0xc431e2,
          'labelText': _0x117415,
          'iconHtml': _0xc1c452
        });
        restoreLegacyVideoRatioPopupAfterSync({
          'footer': _0x2d9c3b,
          'fallbackPopup': _0x4bf4d2
        });
        animateImageSchemaRatioResizeFlip(this, {
          'nodeId': this['nodeId'],
          'previewEl': this["previewEl"],
          'nodeData': {
            'width': _0x59ed49,
            'height': _0x102657
          },
          'patch': {
            'width': _0x32798a,
            'height': _0x8de059
          },
          'ms': a558_0x851fc,
          'deferStart': ![]
        });
      };
      const _0x4e1348 = (_0x541f18, _0x1788cc = {}) => {
        const _0x1ae714 = _0x2595ad(_0x541f18);
        if (!_0x1ae714) {
          return;
        }
        _0x18f469(_0x1ae714['w'], _0x1ae714['h'], _0x1ae714["label"], _0x1788cc);
        _0x3e9509(_0x1ae714["label"], ![]);
      };
      !_0x2c9245 && _0x1db7d2["querySelectorAll"](".img-rp-ratio-item:not([data-ui-schema-value])")["forEach"](_0x58087d => bindVideoPanelClick(_0x58087d, "ratio-item", () => {
        if (_0x58087d["hasAttribute"]("disabled") || _0x58087d['classList']["contains"]("disabled") || _0x58087d["getAttribute"]('aria-disabled') === "true") {
          return;
        }
        _0x4e1348(_0x58087d["dataset"]["label"], {
          'forceManualDisplaySize': !![]
        });
      }));
      const _0x13a449 = (_0x225547 = {}) => {
        const _0xf3704c = _0x10ce4b["getState"]();
        const _0x260b04 = _0xf3704c["nodes"]?.[this["nodeId"]];
        const _0x55ad40 = String(_0x260b04?.["model"] || '');
        const _0x44ce80 = getRunningHubVideoParameterPanelPolicy(_0x55ad40)['adaptiveRatio'] || {};
        let _0x5f4992 = _0x10ce4b['getIncomingEdges'](this["nodeId"]);
        _0x44ce80['scopeTargetEdges'] === !![] && (_0x5f4992 = _0x5f4992["filter"](_0x3ec679 => _0x3ec679?.["targetId"] === this["nodeId"]));
        _0x5f4992 = _0x5f4992["filter"](_0x265c73 => {
          const _0x5644e1 = String(_0x265c73?.['refSlot'] || '')['toLowerCase']();
          if (_0x5644e1['includes']("mask")) {
            return ![];
          }
          const _0x56e37a = resolveEffectiveInputKind(_0xf3704c["nodes"]?.[_0x265c73?.["sourceId"]], _0x265c73);
          return _0x56e37a === "image" || _0x56e37a === "video";
        });
        const _0x3993a1 = (_0x43819a, _0x139973) => {
          const _0xde205a = Number(_0x43819a);
          const _0x2017ce = Number(_0x139973);
          if (!(Number["isFinite"](_0xde205a) && _0xde205a > 0x0)) {
            return ![];
          }
          if (!(Number["isFinite"](_0x2017ce) && _0x2017ce > 0x0)) {
            return ![];
          }
          _0x18f469(_0xde205a, _0x2017ce, "自适应", _0x225547);
          return !![];
        };
        if (_0x5f4992['length'] > 0x0) {
          const _0x4a1ca0 = resolveVideoAdaptiveRatioSource({
            'inEdges': _0x5f4992,
            'nodes': _0xf3704c["nodes"],
            'nodeData': _0x260b04,
            'adaptivePolicy': _0x44ce80
          });
          if (_0x4a1ca0["fallbackSquare"]) {
            _0x18f469(0x1, 0x1, '自适应', _0x225547);
            return;
          }
          const _0x575abe = _0x4a1ca0['edge'];
          if (!_0x575abe) {
            return;
          }
          const _0x28c40c = _0x575abe['sourceId'];
          const _0x23c351 = _0xf3704c['nodes'][_0x28c40c];
          const _0x2d0e76 = getGenerationRatioSizeWithDom({
            'nodeId': _0x28c40c,
            'nodeData': _0x23c351,
            'edge': _0x575abe,
            'includeNodeFrame': !![]
          });
          if (_0x3993a1(_0x2d0e76?.["width"], _0x2d0e76?.["height"])) {
            return;
          }
          const _0x36f46e = String(_0x23c351?.["type"] || '');
          const _0x28375c = _0x36f46e === "ai-video" || _0x36f46e === "source-video" || _0x36f46e === "video";
          if (_0x28375c) {
            const _0x3d70fb = _0x551182(_0x28c40c, "video");
            const _0x46b94a = Number(_0x3d70fb?.['w'] || 0x0);
            const _0x5351a2 = Number(_0x3d70fb?.['h'] || 0x0);
            if (_0x3993a1(_0x46b94a, _0x5351a2)) {
              return;
            }
            const _0x3fe561 = Number(_0x575abe?.["sourceMediaW"] || 0x0);
            const _0x238e93 = Number(_0x575abe?.["sourceMediaH"] || 0x0);
            if (_0x3993a1(_0x3fe561, _0x238e93)) {
              return;
            }
            const _0x148635 = Number(_0x23c351?.["mainVideoIndex"]);
            const _0x5563ab = Number["isFinite"](_0x148635) ? Math["max"](0x0, Math["trunc"](_0x148635)) : 0x0;
            const _0x181d24 = Array["isArray"](_0x23c351?.['videos']) ? _0x23c351["videos"] : [];
            let _0x58e029 = _0x5563ab;
            const _0x36c4d0 = String(_0x575abe?.["sourceMediaKey"] || '')["trim"]();
            if (_0x36c4d0 && _0x181d24['length']) {
              const _0x94ab84 = _0x181d24["findIndex"](_0x2cc848 => {
                const _0x5f5c04 = String(_0x2cc848?.['localPath'] || '')["trim"]() || String(_0x2cc848?.['videoUrl'] || '')["trim"]();
                return _0x5f5c04 === _0x36c4d0;
              });
              if (_0x94ab84 >= 0x0) {
                _0x58e029 = _0x94ab84;
              }
            }
            const _0x4851e5 = _0x181d24[_0x58e029];
            const _0xeffe15 = Number(_0x4851e5?.["videoWidth"] || 0x0);
            const _0x5b539d = Number(_0x4851e5?.["videoHeight"] || 0x0);
            if (_0x3993a1(_0xeffe15, _0x5b539d)) {
              return;
            }
            const _0x4b35f3 = Number(_0x23c351?.["selectedVideoWidth"] || 0x0);
            const _0x1b0797 = Number(_0x23c351?.['selectedVideoHeight'] || 0x0);
            if (_0x3993a1(_0x4b35f3, _0x1b0797)) {
              return;
            }
            const _0x55e4ef = ++this["_adaptiveSrcRetryToken"];
            setTimeout(() => {
              if (_0x55e4ef !== this['_adaptiveSrcRetryToken']) {
                return;
              }
              const _0x1c23bc = _0x10ce4b["getState"]()["nodes"]?.[this['nodeId']];
              if (!_0x1c23bc) {
                return;
              }
              const _0x4d4f86 = this['_getDreaminaEffectiveNodeData'](_0x1c23bc);
              if (String(_0x4d4f86["aspectRatio"] || '自适应') !== "自适应") {
                return;
              }
              const _0x49a39f = _0x10ce4b["getState"]()["nodes"]?.[_0x28c40c];
              if (_0x49a39f) {
                const _0x29f0f8 = Number(_0x575abe?.["sourceMediaW"] || 0x0);
                const _0x328582 = Number(_0x575abe?.["sourceMediaH"] || 0x0);
                if (_0x3993a1(_0x29f0f8, _0x328582)) {
                  return;
                }
                const _0xfc0480 = Number(_0x49a39f['mainVideoIndex']);
                const _0x33474e = Number['isFinite'](_0xfc0480) ? Math["max"](0x0, Math['trunc'](_0xfc0480)) : 0x0;
                const _0x45c9a8 = Array['isArray'](_0x49a39f["videos"]) ? _0x49a39f['videos'] : [];
                let _0x534a2b = _0x33474e;
                const _0x3cb891 = String(_0x575abe?.["sourceMediaKey"] || '')["trim"]();
                if (_0x3cb891 && _0x45c9a8["length"]) {
                  const _0x330897 = _0x45c9a8["findIndex"](_0x47fb37 => {
                    const _0xe47aec = String(_0x47fb37?.["localPath"] || '')['trim']() || String(_0x47fb37?.["videoUrl"] || '')["trim"]();
                    return _0xe47aec === _0x3cb891;
                  });
                  if (_0x330897 >= 0x0) {
                    _0x534a2b = _0x330897;
                  }
                }
                const _0x29ce6c = _0x45c9a8[_0x534a2b];
                const _0x4af68f = Number(_0x29ce6c?.['videoWidth'] || 0x0);
                const _0x723a36 = Number(_0x29ce6c?.['videoHeight'] || 0x0);
                if (_0x3993a1(_0x4af68f, _0x723a36)) {
                  return;
                }
                const _0x47721d = Number(_0x49a39f['selectedVideoWidth'] || 0x0);
                const _0x394c1e = Number(_0x49a39f["selectedVideoHeight"] || 0x0);
                if (_0x3993a1(_0x47721d, _0x394c1e)) {
                  return;
                }
              }
              const _0xe82f7e = _0x551182(_0x28c40c, 'video');
              const _0x263a9a = Number(_0xe82f7e?.['w'] || 0x0);
              const _0x1be06e = Number(_0xe82f7e?.['h'] || 0x0);
              if (_0x263a9a > 0x0 && _0x1be06e > 0x0) {
                _0x18f469(_0x263a9a, _0x1be06e, "自适应", _0x225547);
              }
            }, 0xa0);
            _0x18f469(0x1, 0x1, '自适应', _0x225547);
            return;
          }
          const _0x5db867 = _0x551182(_0x28c40c, "image");
          const _0x470190 = Number(_0x5db867?.['w'] || 0x0);
          const _0x31e0e3 = Number(_0x5db867?.['h'] || 0x0);
          if (_0x3993a1(_0x470190, _0x31e0e3)) {
            return;
          }
          if (_0x23c351) {
            const _0xf1dbab = Number(_0x23c351['width'] || 0x0);
            const _0x1aeedb = Number(_0x23c351["height"] || 0x0);
            if (_0x3993a1(_0xf1dbab, _0x1aeedb)) {
              return;
            }
          }
          _0x18f469(0x1, 0x1, "自适应", _0x225547);
          return;
        }
        const _0x4cd675 = Boolean(_0x260b04?.["videos"] && _0x260b04['videos']["length"] || _0x260b04?.['localPath'] || _0x260b04?.["thumbUrl"] || _0x260b04?.["videoUrl"] || _0x260b04?.["src"]);
        if (_0x4cd675) {
          const _0xfa35b3 = this["videoEl"]?.['videoWidth'] || 0x0;
          const _0x464018 = this["videoEl"]?.["videoHeight"] || 0x0;
          if (_0x3993a1(_0xfa35b3, _0x464018)) {
            return;
          }
          return;
        }
        _0x18f469(0x1, 0x1, "自适应", _0x225547);
      };
      this['_runAdaptiveRatio'] = (_0x60f7c3 = {}) => {
        const _0xcec286 = _0x10ce4b['getState']()['nodes']?.[this['nodeId']] || this["_data"] || {};
        const _0x19af7c = _0x1db7d2['querySelector'](".img-rp-large-adaptive:not([data-ui-schema-value])");
        if (this["_isDreaminaVideoNode"](_0xcec286)) {
          this["_commitDreaminaSchemaAspectRatio"]("自适应", _0xcec286, _0x60f7c3);
          _0x3e9509('自适应', !![]);
          _0x19af7c?.["classList"]["add"]("active");
          return;
        }
        _0x13a449(_0x60f7c3);
        _0x3e9509("自适应", !![]);
        _0x19af7c?.['classList']["add"]("active");
      };
      this["_applyStoredAspectRatio"] = () => {
        const _0x59ff81 = _0x10ce4b['getState']()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
        const _0x190b60 = this['_getDreaminaRatioDisplayState'](_0x59ff81);
        const _0x3efe4c = String(_0x190b60?.["currentRatio"] || '')["trim"]() || "自适应";
        if (_0x3efe4c === "自适应") {
          this["_runAdaptiveRatio"]?.();
          return;
        }
        _0x4e1348(_0x3efe4c, {
          'persistAspectRatio': !![]
        });
      };
      this['_applyDreaminaSchemaAspectRatio'] = _0xbb22b7 => {
        const _0x494b57 = _0x10ce4b["getState"]()["nodes"]?.[this['nodeId']] || this["_data"] || {};
        this["_commitDreaminaSchemaAspectRatio"](_0xbb22b7, _0x494b57, {
          'forceManualDisplaySize': !![]
        });
      };
      const _0x1ebd85 = _0x1db7d2["querySelector"](".img-rp-large-adaptive:not([data-ui-schema-value])");
      _0x1ebd85 && !_0x2c9245 && bindVideoPanelClick(_0x1ebd85, 'adaptive-ratio', () => this["_runAdaptiveRatio"]({
        'forceManualDisplaySize': !![]
      }));
      bindVideoPanelClick(this["btnEl"], "submit", () => {
        flushPromptHtmlCommit(this);
        this["_handleGenerateOrCancel"]();
      });
      const _0x1bf0c9 = _0x1db7d2["querySelector"]('.debug-wrench-btn');
      _0x1bf0c9?.["addEventListener"]("click", _0x2c75a9 => {
        _0x2c75a9["stopPropagation"]();
        if (globalThis['window']?.["DEV_MODE"] !== !![]) {
          return;
        }
        flushPromptHtmlCommit(this);
        openDebugRequestWindow({
          'prepare': async () => {
            const _0x5b0a21 = await this["_buildPayload"]();
            if (!_0x5b0a21) {
              throw new Error("请先填写提示词或连接参考素材。");
            }
            try {
              return buildFinalApiDebugPreview(await _0x49503f['buildGenerateVideoRequest'](_0x5b0a21));
            } finally {
              releasePayloadObjectUrlLease(_0x5b0a21);
            }
          }
        });
      });
      const _0x2234ea = bindNodeFooterController(_0x1db7d2, {
        'onDocumentClick': (_0x57b447, {
          isInsideRoot: _0x61cbb4
        }) => {
          const _0x15e192 = this['footerEl'];
          if (!_0x15e192) {
            return;
          }
          if (_0x61cbb4) {
            closeNodeFooterMenus(_0x15e192);
          }
          _0x15e192["querySelector"](".img-model-menu")?.['classList']["remove"]('show');
          _0x15e192["querySelector"](".dreamina-task-model-menu")?.['classList']["remove"]("show");
          const _0x4df560 = _0x15e192['querySelector']('.img-ratio-popup');
          _0x4df560?.["classList"]["remove"]("show");
          _0x15e192["querySelector"](".vid-mode-menu")?.["classList"]["remove"]("show");
          const _0x3b1958 = _0x15e192["querySelector"](".vid-duration-pop");
          _0x3b1958?.["classList"]['remove']('show');
          const _0x20fbe4 = _0x15e192["querySelector"]('.rh-vram-adv-panel');
          !_0x20fbe4?.['classList']?.["contains"]?.(RH_AI_APP_PERSISTENT_ADVANCED_CLASS) && _0x20fbe4?.['classList']["remove"]("show");
          syncNodeFooterAdvancedButtonState(_0x15e192);
        }
      });
      const _0x416a25 = () => {
        _0x1562bb['destroy']();
        _0x2234ea();
      };
      this["_footerControllerCleanup"] = bindGenerationNodeCredentialLifecycle(this, _0x416a25);
      if (_0x4bf4d2) {
        bindVideoPanelClick(_0x4bf4d2, "ratio-popup-stop", _0x22c122 => _0x22c122["stopPropagation"]());
      }
      if (_0x15f9f1) {
        bindVideoPanelClick(_0x15f9f1, 'duration-popup-stop', _0x1c36fd => _0x1c36fd["stopPropagation"]());
      }
      if (_0x26f8aa) {
        bindVideoPanelClick(_0x26f8aa, "mode-menu-stop", _0x19488e => _0x19488e["stopPropagation"]());
      }
      if (_0x5bcf4f) {
        bindVideoPanelClick(_0x5bcf4f, "dreamina-task-model-menu-stop", _0x395e77 => _0x395e77["stopPropagation"]());
      }
    }
    ["_isDreaminaVideoNode"](_0x468eb6 = this["_data"]) {
      return isDreaminaStyleVideoModel(_0x468eb6?.['model'], _0x468eb6?.['provider']);
    }
    ['_getDreaminaEffectiveNodeData'](_0x4d319d = this['_data']) {
      return getDreaminaEffectiveNodeData(_0x4d319d);
    }
    ["_buildDreaminaParamPatch"](_0xd12c3c = this["_data"], _0x3d67cc = {}) {
      return buildDreaminaParamPatch(_0xd12c3c, _0x3d67cc);
    }
    ["_buildDreaminaModelSelectionParamPatch"](_0x5e5534 = this["_data"], _0x4e3dfc = {}) {
      return buildDreaminaModelSelectionParamPatch(_0x5e5534, _0x4e3dfc);
    }
    ["_commitDreaminaParamValues"](_0x452fa1 = {}, _0x19efa9 = this["_data"], _0x31df87 = {}) {
      const _0x5c36fb = this["_getDreaminaEffectiveNodeData"](_0x19efa9) || this["_getDreaminaEffectiveNodeData"](_0x10ce4b["getState"]()["nodes"]?.[this["nodeId"]] || this["_data"] || {});
      const _0x3a0047 = {
        ..._0x5c36fb,
        ..._0x31df87
      };
      const _0xe676e5 = this["_buildDreaminaParamPatch"](_0x3a0047, _0x452fa1);
      const _0x160ce1 = {
        ...(_0x31df87 && typeof _0x31df87 === 'object' ? _0x31df87 : {}),
        ..._0xe676e5
      };
      _0x10ce4b["updateNodeData"](this["nodeId"], _0x160ce1);
      this["_data"] = this['_getDreaminaEffectiveNodeData']({
        ..._0x5c36fb,
        ..._0x160ce1
      });
      return this["_data"];
    }
    ["_commitDreaminaRouteMode"](_0x38beb3, _0x4a02b0 = this['_data']) {
      const _0x81ed0f = _0x10ce4b["getState"]();
      const _0x36329a = buildDreaminaRouteModeUpdate({
        'nextRouteMode': _0x38beb3,
        'baseNodeData': _0x4a02b0,
        'incoming': _0x10ce4b["getIncomingEdges"](this["nodeId"]) || [],
        'nodes': _0x81ed0f["nodes"] || {}
      });
      if (_0x36329a['disabled']) {
        window["showToast"]?.(videoPanelText("smartMultiframeUnavailable"), "warn");
        this["_data"] = _0x36329a["nodeData"];
        return this['_data'];
      }
      const _0x581a8f = Array["isArray"](_0x36329a["edgeIdsToRemove"]) ? _0x36329a['edgeIdsToRemove'] : [];
      const _0x115532 = _0x36329a["patch"] || {};
      (_0x581a8f["length"] > 0x0 || Object["keys"](_0x115532)["length"] > 0x0) && _0x10ce4b["batch"](() => {
        _0x581a8f["forEach"](_0x376ff1 => _0x10ce4b["removeEdge"](_0x376ff1));
        Object['keys'](_0x115532)["length"] > 0x0 && _0x10ce4b["updateNodeData"](this['nodeId'], _0x115532);
      });
      this["_data"] = _0x36329a["nodeData"] || this["_getDreaminaEffectiveNodeData"]({
        ..._0x4a02b0,
        ..._0x115532
      });
      return this["_data"];
    }
    ["_commitDreaminaSchemaField"](_0x5d3e92, _0x5c917b, _0x3efe51 = this['_data']) {
      const _0x57627c = String(_0x5d3e92 || '')["trim"]();
      const _0xb72508 = this['_getDreaminaEffectiveNodeData'](_0x3efe51);
      if (_0x57627c === 'dreaminaRouteMode') {
        return this["_commitDreaminaRouteMode"](_0x5c917b, _0xb72508);
      }
      const _0xaf5c65 = this["_getResolvedDreaminaTaskType"](_0xb72508);
      const _0x32cf64 = resolveDreaminaStyleVideoProvider(_0xb72508?.["model"], _0xb72508?.["provider"]);
      const _0x1f1fe4 = ensureDreaminaStyleVideoModelForTask(_0xaf5c65, _0xb72508?.['model'], _0x32cf64);
      if (_0x57627c === "resolution") {
        const _0x51042e = normalizeDreaminaStyleVideoResolution(_0xaf5c65, _0x1f1fe4, _0x5c917b, _0x32cf64);
        return this["_commitDreaminaParamValues"]({
          'resolution': _0x51042e
        }, _0xb72508);
      }
      if (_0x57627c === 'duration') {
        const _0x1bb621 = normalizeDreaminaStyleVideoDuration(_0xaf5c65, _0x1f1fe4, _0x5c917b, _0x32cf64);
        return this["_commitDreaminaParamValues"]({
          'duration': _0x1bb621
        }, _0xb72508);
      }
      if (_0x57627c === 'aspectRatio') {
        return this["_commitDreaminaSchemaAspectRatio"](_0x5c917b, _0xb72508, {
          'forceManualDisplaySize': !![]
        });
      }
      const _0x37078a = buildUiSchemaParamPatch(_0xb72508, _0x57627c, _0x5c917b);
      _0x10ce4b['updateNodeData'](this["nodeId"], _0x37078a);
      this["_data"] = this['_getDreaminaEffectiveNodeData']({
        ..._0xb72508,
        ..._0x37078a
      });
      return this['_data'];
    }
    ["_normalizeDreaminaNodeData"](_0x493db4, _0x480a7f = {}) {
      const _0x4028a2 = _0x480a7f?.["syncStore"] !== ![];
      const _0x3683f4 = this["_getDreaminaEffectiveNodeData"](_0x493db4);
      const _0x10b134 = buildDreaminaStyleVideoNodeNormalizationPatch(_0x3683f4);
      if (!_0x10b134) {
        return _0x3683f4;
      }
      const _0x36f441 = buildDreaminaStorePatchFromNormalization(_0x3683f4, _0x10b134);
      const _0x3b4028 = this["_getDreaminaEffectiveNodeData"]({
        ..._0x3683f4,
        ..._0x36f441
      });
      const _0x27f4d4 = readStoreState()['nodes']?.[this["nodeId"]];
      _0x4028a2 && _0x27f4d4 && Object["keys"](_0x36f441)["length"] > 0x0 && _0x10ce4b["updateNodeData"](this["nodeId"], _0x36f441);
      return _0x3b4028;
    }
    ["_getDreaminaReferenceSummary"](_0x39486c = this['_data']) {
      const _0x321271 = _0x10ce4b["getIncomingEdges"](this['nodeId']) || [];
      const _0x57333a = readStoreState()["nodes"] || {};
      const _0x4eb5e2 = [];
      for (const _0x39e95b of _0x321271) {
        const _0x2cf59c = _0x57333a?.[_0x39e95b['sourceId']];
        if (!_0x2cf59c) {
          continue;
        }
        const _0xbbb00e = String(_0x2cf59c["type"] || '');
        let _0x53b1b9 = '';
        if (_0xbbb00e["includes"]("video")) {
          _0x53b1b9 = "video";
        } else {
          if (_0xbbb00e['includes']("audio")) {
            _0x53b1b9 = "audio";
          } else {
            if (_0xbbb00e["includes"]('image')) {
              _0x53b1b9 = 'image';
            } else {
              if (_0xbbb00e["includes"]("text")) {
                _0x53b1b9 = "text";
              }
            }
          }
        }
        if (!_0x53b1b9) {
          continue;
        }
        if (_0x53b1b9 === 'image') {
          const _0x95bcf2 = !!_0x2cf59c["thumbId"] || !!_0x2cf59c["thumbUrl"] || !!_0x2cf59c['imageUrl'] || !!_0x2cf59c["src"] || !!_0x2cf59c['localPath'];
          if (!_0x95bcf2) {
            continue;
          }
        } else {
          if (_0x53b1b9 === "video") {
            const _0x149ccc = Array["isArray"](_0x2cf59c["videos"]) && _0x2cf59c['videos']["length"] > 0x0 || !!_0x2cf59c['thumbId'] || !!_0x2cf59c["thumbUrl"] || !!_0x2cf59c["videoUrl"] || !!_0x2cf59c["src"] || !!_0x2cf59c['localPath'];
            if (!_0x149ccc) {
              continue;
            }
          } else {
            if (_0x53b1b9 === 'audio') {
              const _0x318f4 = !!_0x2cf59c['audioUrl'] || !!_0x2cf59c['src'] || !!_0x2cf59c["localPath"];
              if (!_0x318f4) {
                continue;
              }
            } else {
              if (_0x53b1b9 === "text") {
                const _0x41daee = !!String(_0x2cf59c['outputText'] || _0x2cf59c["text"] || _0x2cf59c['content'] || '')["trim"]();
                if (!_0x41daee) {
                  continue;
                }
              }
            }
          }
        }
        _0x4eb5e2["push"]({
          'edgeId': String(_0x39e95b['id'] || ''),
          'sourceId': String(_0x39e95b["sourceId"] || ''),
          'kind': _0x53b1b9,
          'refSlot': String(_0x39e95b["refSlot"] || '')
        });
      }
      const _0x595f7f = _0x4eb5e2["filter"](_0x2f5155 => _0x2f5155["kind"] === 'image');
      const _0xed31db = _0x4eb5e2["filter"](_0x1ee99f => _0x1ee99f["kind"] === "video");
      const _0x2c0f92 = _0x4eb5e2["filter"](_0x2aad01 => _0x2aad01["kind"] === 'audio');
      const _0x26de6a = _0x4eb5e2['filter'](_0x262773 => _0x262773["kind"] === 'text');
      return {
        'items': _0x4eb5e2,
        'images': _0x595f7f,
        'videos': _0xed31db,
        'audios': _0x2c0f92,
        'texts': _0x26de6a,
        'imageCount': _0x595f7f["length"],
        'videoCount': _0xed31db["length"],
        'audioCount': _0x2c0f92["length"],
        'textCount': _0x26de6a['length'],
        'signature': _0x4eb5e2["map"]((_0x3d0dc2, _0x45b67d) => _0x45b67d + ':' + _0x3d0dc2['edgeId'] + ':' + _0x3d0dc2["sourceId"] + ':' + _0x3d0dc2["kind"] + ':' + _0x3d0dc2["refSlot"])["join"]('|')
      };
    }
    ['_getResolvedDreaminaTaskType'](_0x310d29 = this["_data"], _0x59ab30 = null) {
      if (!this["_isDreaminaVideoNode"](_0x310d29)) {
        return '';
      }
      const _0x3137e4 = this["_getDreaminaEffectiveNodeData"](_0x310d29);
      const _0x5a8807 = _0x59ab30 || this["_getDreaminaReferenceSummary"](_0x3137e4);
      return resolveDreaminaVideoTaskType({
        'routeMode': normalizeDreaminaVideoRouteMode(_0x3137e4?.["dreaminaRouteMode"], _0x3137e4?.["mode"]),
        'imageCount': _0x5a8807["imageCount"],
        'videoCount': _0x5a8807["videoCount"],
        'audioCount': _0x5a8807['audioCount']
      });
    }
    ["_commitDreaminaSchemaAspectRatio"](_0x493a2a, _0x5b7203 = this['_data'], _0x279903 = {}) {
      const _0x3c3141 = this["_getDreaminaEffectiveNodeData"](_0x5b7203);
      const _0x5864b3 = _0x279903?.['forceManualDisplaySize'] === !![];
      const _0x186d29 = normalizeDreaminaVideoAspectRatio(_0x493a2a, {
        'preserveAdaptive': !![]
      });
      if (!_0x5864b3 && _0x3c3141?.[GENERATION_MANUAL_DISPLAY_SIZE_FIELD] === !![]) {
        const _0x2a7003 = this["_buildDreaminaParamPatch"](_0x3c3141, {
          'aspectRatio': _0x186d29
        });
        _0x10ce4b["updateNodeData"](this["nodeId"], _0x2a7003);
        this['_data'] = this['_getDreaminaEffectiveNodeData']({
          ..._0x3c3141,
          ..._0x2a7003
        });
        return this["_data"];
      }
      const _0x30dd25 = buildImageSchemaAspectRatioDisplayPatch({
        'store': _0x10ce4b,
        'nodeId': this["nodeId"],
        'nodeData': _0x3c3141,
        'fallbackNodeData': this['_data'],
        'ratioValue': _0x186d29,
        'minSide': _0x4670c9()['width'],
        'inputKinds': ["image", 'video'],
        'resultMediaElement': this["videoEl"],
        'resultFields': VIDEO_DISPLAY_RATIO_RESULT_FIELDS
      });
      const _0x26a03d = this["_buildDreaminaParamPatch"](_0x3c3141, {
        'aspectRatio': _0x186d29
      });
      const _0x56a249 = {
        ...(_0x5864b3 ? {
          [GENERATION_MANUAL_DISPLAY_SIZE_FIELD]: ![]
        } : {}),
        ..._0x30dd25,
        ..._0x26a03d
      };
      applyImageSchemaRatioResizeAnimation(this, {
        'nodeId': this['nodeId'],
        'previewEl': this['previewEl'],
        'nodeData': _0x3c3141,
        'patch': _0x30dd25
      });
      _0x10ce4b["updateNodeData"](this["nodeId"], _0x56a249);
      this["_data"] = this["_getDreaminaEffectiveNodeData"]({
        ..._0x3c3141,
        ..._0x56a249
      });
      return this["_data"];
    }
    ["_buildModelApiAspectRatioDisplayPatch"](_0x1e0457, _0x49fbd7, _0x2c2c48, _0x176888 = {}) {
      const _0x5d8b47 = this["_resolveModelExecution"](_0x1e0457?.["model"], _0x1e0457?.["provider"]);
      return buildVideoSchemaAspectRatioDisplayPatch({
        'owner': this,
        'store': _0x10ce4b,
        'nodeId': this["nodeId"],
        'latestNodeData': _0x1e0457,
        'fallbackNodeData': this["_data"],
        'resolved': _0x5d8b47,
        'fieldId': _0x49fbd7,
        'value': _0x2c2c48,
        'schemaPatch': _0x176888,
        'adapterType': "modelApi",
        'minSide': _0x4670c9()["width"],
        'previewEl': this["previewEl"],
        'resultMediaElement': this["videoEl"]
      });
    }
    ["_buildRunningHubWorkflowAspectRatioDisplayPatch"](_0x1af2a4, _0x4d5b39, _0x2eb67a, _0x1e2c3d = {}) {
      const _0xc741c0 = this['_resolveModelExecution'](_0x1af2a4?.["model"], _0x1af2a4?.["provider"]);
      return buildVideoSchemaAspectRatioDisplayPatch({
        'owner': this,
        'store': _0x10ce4b,
        'nodeId': this['nodeId'],
        'latestNodeData': _0x1af2a4,
        'fallbackNodeData': this['_data'],
        'resolved': _0xc741c0,
        'fieldId': _0x4d5b39,
        'value': _0x2eb67a,
        'schemaPatch': _0x1e2c3d,
        'adapterType': "workflow",
        'minSide': _0x4670c9()["width"],
        'previewEl': this["previewEl"],
        'resultMediaElement': this["videoEl"]
      });
    }
    ['_getDreaminaRatioDisplayState'](_0x20fc6d = this["_data"], _0x193ae9 = null) {
      if (!this['_isDreaminaVideoNode'](_0x20fc6d)) {
        return null;
      }
      const _0x465840 = _0x193ae9 || this["_syncDreaminaTaskState"](_0x20fc6d, {
        'syncStore': ![]
      });
      const _0x2e9b85 = _0x465840?.["nodeData"] || _0x20fc6d;
      const _0x281b06 = _0x465840?.["summary"] || this["_getDreaminaReferenceSummary"](_0x2e9b85);
      const _0x4a4150 = _0x465840?.['resolvedTaskType'] || this["_getResolvedDreaminaTaskType"](_0x2e9b85, _0x281b06);
      const _0x50164b = ensureDreaminaStyleVideoModelForTask(_0x4a4150, _0x2e9b85?.["model"], _0x2e9b85?.["provider"]) || normalizeDreaminaStyleVideoModel(_0x2e9b85?.['model'], _0x2e9b85?.["provider"]);
      const _0x4aeed8 = normalizeDreaminaStyleVideoResolution(_0x4a4150, _0x50164b, _0x2e9b85?.['resolution'] || _0x2e9b85?.["videoSize"], _0x2e9b85?.["provider"]);
      const _0x4efbc9 = String(_0x2e9b85?.["aspectRatio"] || '')["trim"]();
      const _0xdda32d = _0x4efbc9 === "自适应" || _0x4efbc9 === '自适应' || _0x4efbc9 === "auto" ? "自适应" : _0x4efbc9 === "5:4" ? '4:3' : _0x4efbc9 === "4:5" ? "3:4" : _0x4efbc9 ? normalizeDreaminaVideoAspectRatio(_0x4efbc9) : "自适应";
      const _0x56b730 = getDreaminaStyleVideoResolutionOptions(_0x4a4150, _0x50164b, _0x2e9b85?.['provider']);
      const _0x1360e6 = Number(_0x281b06?.["imageCount"] || 0x0) > 0x0;
      return {
        'nodeData': _0x2e9b85,
        'summary': _0x281b06,
        'resolvedTaskType': _0x4a4150,
        'currentModel': _0x50164b,
        'currentResolution': _0x4aeed8,
        'currentRatio': _0xdda32d,
        'resolutionOptions': _0x56b730,
        'hasImageRefs': _0x1360e6,
        'ratioLabelText': formatVideoRatioResolutionLabel(_0xdda32d, _0x4aeed8 || "720p"),
        'ratioIconLabel': _0xdda32d
      };
    }
    ["_syncDreaminaTaskState"](_0x486915 = this["_data"], _0xf7ab74 = {}) {
      if (!this['_isDreaminaVideoNode'](_0x486915)) {
        return {
          'nodeData': _0x486915,
          'summary': this['_getDreaminaReferenceSummary'](_0x486915),
          'resolvedTaskType': '',
          'routeMode': ''
        };
      }
      const _0x253da8 = _0xf7ab74?.["syncStore"] !== ![];
      let _0xb1d5b9 = this["_normalizeDreaminaNodeData"](_0x486915, {
        'syncStore': _0x253da8
      });
      const _0x28a701 = this["_getDreaminaReferenceSummary"](_0xb1d5b9);
      const _0x2c9703 = normalizeDreaminaVideoRouteMode(_0xb1d5b9?.["dreaminaRouteMode"], _0xb1d5b9?.["mode"]);
      const _0xe56a9f = resolveDreaminaVideoTaskType({
        'routeMode': _0x2c9703,
        'imageCount': _0x28a701["imageCount"],
        'videoCount': _0x28a701['videoCount'],
        'audioCount': _0x28a701["audioCount"]
      });
      const _0x3c9415 = {};
      if (_0xe56a9f !== "multiframe2video") {
        const _0x5225eb = resolveDreaminaStyleVideoProvider(_0xb1d5b9?.['model'], _0xb1d5b9?.["provider"]);
        const _0x465054 = ensureDreaminaStyleVideoModelForTask(_0xe56a9f, _0xb1d5b9?.['model'], _0x5225eb);
        _0x465054 && _0x465054 !== String(_0xb1d5b9?.['model'] || '')['trim']() && (_0x3c9415["model"] = _0x465054);
        const _0x5ad739 = normalizeDreaminaStyleVideoResolution(_0xe56a9f, _0x465054 || _0xb1d5b9?.["model"], _0xb1d5b9?.['resolution'] || _0xb1d5b9?.["videoSize"], _0x5225eb);
        _0x5ad739 && _0x5ad739 !== String(_0xb1d5b9?.["resolution"] || '')["trim"]() && (_0x3c9415["resolution"] = _0x5ad739);
        const _0x335ada = normalizeDreaminaStyleVideoDuration(_0xe56a9f, _0x465054 || _0xb1d5b9?.["model"], _0xb1d5b9?.["duration"], _0x5225eb);
        Number(_0x335ada) !== Number(_0xb1d5b9?.['duration']) && (_0x3c9415["duration"] = _0x335ada);
      }
      if (_0x28a701["imageCount"] <= 0x0) {
        const _0x5a3928 = normalizeDreaminaVideoAspectRatio(_0xb1d5b9?.["aspectRatio"], {
          'preserveAdaptive': !![]
        });
        _0x5a3928 !== String(_0xb1d5b9?.["aspectRatio"] || '')["trim"]() && String(_0xb1d5b9?.["aspectRatio"] || '')["trim"]() && (_0x3c9415["aspectRatio"] = _0x5a3928);
      }
      _0x2c9703 !== String(_0xb1d5b9?.["dreaminaRouteMode"] || '')["trim"]() && (_0x3c9415["dreaminaRouteMode"] = _0x2c9703);
      const _0x17ea84 = resolveDreaminaStyleVideoProvider(_0xb1d5b9?.["model"], _0xb1d5b9?.["provider"]);
      String(_0xb1d5b9?.["provider"] || '')["trim"]()["toLowerCase"]() !== _0x17ea84 && (_0x3c9415["provider"] = _0x17ea84);
      if (Object["keys"](_0x3c9415)['length'] > 0x0) {
        const _0x2c195d = buildDreaminaStorePatchFromNormalization(_0xb1d5b9, _0x3c9415);
        _0xb1d5b9 = this['_getDreaminaEffectiveNodeData']({
          ..._0xb1d5b9,
          ..._0x2c195d
        });
        const _0x533cab = _0x10ce4b["getState"]()["nodes"]?.[this["nodeId"]];
        _0x253da8 && _0x533cab && _0x10ce4b["updateNodeData"](this["nodeId"], _0x2c195d);
      }
      return {
        'nodeData': _0xb1d5b9,
        'summary': _0x28a701,
        'resolvedTaskType': _0xe56a9f,
        'routeMode': _0x2c9703
      };
    }
    ["_syncDreaminaPromptPlaceholder"](_0x3b9f75 = this["_data"]) {
      if (!this["promptEl"]) {
        return;
      }
      const _0x18886c = this["promptEl"]['dataset'] || (this['promptEl']['dataset'] = {});
      if (!this["_isDreaminaVideoNode"](_0x3b9f75)) {
        const _0xe69ff = this["_resolveModelExecution"](_0x3b9f75?.["model"], _0x3b9f75?.["provider"]);
        _0x18886c["placeholder"] = resolveVideoPromptPlaceholder(_0xe69ff?.["modelManifest"], _0x3b9f75);
        return;
      }
      const _0x4d4ca7 = this["_getDreaminaEffectiveNodeData"](_0x3b9f75);
      const _0x5cce89 = normalizeDreaminaVideoRouteMode(_0x4d4ca7?.["dreaminaRouteMode"], _0x4d4ca7?.["mode"]);
      _0x18886c["placeholder"] = _0x5cce89 === 'frames2video' ? videoPanelText("dreaminaPrompt.frames2video") : videoPanelText('dreaminaPrompt.reference');
    }
    ['_decorateDreaminaFooter'](_0x5bdcb7, _0x103996) {
      const _0x404d1f = _0x103996 || this["_syncDreaminaTaskState"](decorateSegmentRetakeParameterNodeData(this["_data"]), {
        'syncStore': ![]
      });
      const _0x1bc865 = decorateSegmentRetakeParameterNodeData(_0x404d1f?.["nodeData"] || this["_data"]);
      const _0x3caeb3 = this["_getDreaminaRatioDisplayState"](_0x1bc865, _0x404d1f);
      const _0x47c9b9 = _0x3caeb3?.["resolvedTaskType"] || _0x404d1f?.['resolvedTaskType'] || "text2video";
      const _0x5cd50f = _0x1bc865?.["dreaminaRouteMode"] || _0x404d1f?.["routeMode"] || "auto";
      const _0x1f0218 = _0x3caeb3?.['summary'] || _0x404d1f?.["summary"] || this["_getDreaminaReferenceSummary"](_0x1bc865);
      const _0x390b60 = getDreaminaVideoTaskParamVisibility(_0x47c9b9);
      const _0x4cd872 = resolveDreaminaStyleVideoProvider(_0x1bc865?.["model"], _0x1bc865?.['provider']);
      const _0x4e3400 = _0x3caeb3?.["currentModel"] || ensureDreaminaStyleVideoModelForTask(_0x47c9b9, _0x1bc865?.["model"], _0x4cd872) || normalizeDreaminaStyleVideoModel(_0x1bc865?.["model"], _0x4cd872);
      const _0x33a5b0 = isSegmentRetakeEditing(_0x1bc865) ? _0x1bc865?.['resolution'] : _0x3caeb3?.["currentResolution"] || normalizeDreaminaStyleVideoResolution(_0x47c9b9, _0x4e3400, _0x1bc865?.['resolution'] || _0x1bc865?.["videoSize"], _0x4cd872);
      const _0x3d576c = _0x3caeb3?.['currentRatio'] || normalizeDreaminaVideoAspectRatio(_0x1bc865?.['aspectRatio']);
      const _0x4d2125 = isSegmentRetakeEditing(_0x1bc865) ? _0x1bc865?.["duration"] : normalizeDreaminaStyleVideoDuration(_0x47c9b9, _0x4e3400, _0x1bc865?.["duration"], _0x4cd872);
      const _0x4b5999 = getDreaminaStyleVideoDurationRange(_0x47c9b9, _0x4e3400, _0x4cd872);
      const _0x5b4cc2 = _0x5bdcb7["querySelector"]('.img-model-pills');
      const _0x122ae9 = _0x5bdcb7["querySelector"](".img-model-wrap");
      const _0x3b06b2 = _0x5bdcb7['querySelector'](".img-model-btn-trigger");
      const _0x4966e2 = _0x5bdcb7["querySelector"](".img-model-label");
      const _0x22efff = _0x5bdcb7["querySelector"](".img-model-menu");
      if (_0x122ae9) {
        _0x122ae9["hidden"] = ![];
      }
      _0x4966e2 && (_0x4966e2['textContent'] = getDreaminaProviderLabel(_0x4cd872));
      if (_0x3b06b2) {
        const _0x4c3848 = this['_getModelIconHTML'](_0x4e3400, _0x4cd872);
        const _0x47ce07 = _0x3b06b2['firstElementChild'];
        if (_0x47ce07) {
          _0x47ce07["outerHTML"] = _0x4c3848;
        } else {
          _0x3b06b2['insertAdjacentHTML']("afterbegin", _0x4c3848);
        }
      }
      _0x22efff?.['querySelectorAll'](".floating-menu-item")['forEach'](_0x274488 => {
        const _0x2f103e = String(_0x274488['dataset']["value"] || '')["trim"]();
        const _0x47bf91 = String(_0x274488['dataset']["provider"] || '')['trim']()["toLowerCase"]();
        const _0x526597 = _0x4cd872 === "dreamina" ? _0x47bf91 === "dreamina" || _0x2f103e === "dreamina/text2video" : _0x4cd872 === "apimart" ? _0x47bf91 === 'apimart' && isApimartDreaminaVideoModel(_0x2f103e, _0x47bf91) : _0x47bf91 === _0x4cd872 && isDreaminaStyleVideoModel(_0x2f103e, _0x47bf91);
        _0x274488["classList"]["toggle"]("active", _0x526597);
      });
      let _0x47e427 = _0x5bdcb7["querySelector"](".dreamina-task-model-wrap");
      !_0x47e427 && (_0x47e427 = document['createElement']("div"), _0x47e427["className"] = "dreamina-task-model-wrap", _0x47e427["innerHTML"] = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22img-pill-btn\x20dreamina-task-model-btn\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22dreamina-task-model-label\x22></span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22floating-menu\x20dreamina-task-model-menu\x22></div>\x0a\x20\x20\x20\x20\x20\x20', _0x122ae9?.["insertAdjacentElement"]("afterend", _0x47e427));
      const _0x488c88 = _0x47e427["querySelector"](".dreamina-task-model-btn");
      const _0x280e07 = _0x47e427["querySelector"]('.dreamina-task-model-label');
      const _0x3826f0 = _0x47e427["querySelector"]('.dreamina-task-model-menu');
      const _0x1571f9 = getSegmentRetakeAllowedModelIdsForNode(_0x1bc865);
      const _0x12443c = getDreaminaTaskModelMenuMeta(_0x4e3400, _0x4cd872);
      _0x280e07 && (_0x280e07["textContent"] = _0x12443c?.["title"] || _0x3fbd8f(_0x4e3400 || getDreaminaStyleVideoDefaultModel(_0x47c9b9, _0x4cd872)));
      _0x3826f0 && (_0x3826f0["innerHTML"] = buildDreaminaTaskModelMenuHtml(_0x4e3400, _0x47c9b9, _0x4cd872, {
        'allowedModelIds': _0x1571f9
      }));
      const _0x586a89 = !isDreaminaVideoRouteModeEnabled(_0x5cd50f) || getDreaminaTaskModelMenuItems(_0x47c9b9, _0x4cd872, {
        'allowedModelIds': _0x1571f9
      })['length'] <= 0x0;
      _0x488c88 && (_0x488c88['disabled'] = _0x586a89);
      _0x5bdcb7["querySelector"](".img-ratio-wrap")?.["remove"]();
      _0x5bdcb7["querySelector"](".vid-mode-wrap")?.["remove"]();
      _0x5bdcb7["querySelector"](".vid-duration-wrap")?.['remove']();
      _0x5bdcb7["querySelectorAll"]("[data-dreamina-video-param-schema]")["forEach"](_0x6432ea => _0x6432ea['remove']());
      const _0x406cda = decorateSegmentRetakeParameterNodeData(this["_getDreaminaEffectiveNodeData"]({
        ..._0x1bc865,
        'provider': _0x4cd872,
        'model': _0x4e3400,
        'generationParams': {
          ...getPlainGenerationParams(_0x1bc865?.["generationParams"]),
          'dreaminaRouteMode': _0x5cd50f,
          'aspectRatio': _0x3d576c,
          'duration': _0x4d2125,
          ...(_0x33a5b0 ? {
            'resolution': _0x33a5b0
          } : {})
        }
      }));
      const _0x41e890 = buildDreaminaParamSchemaFields({
        'routeMode': _0x5cd50f,
        'currentRatio': _0x3d576c,
        'currentResolution': _0x33a5b0,
        'currentDuration': _0x4d2125,
        'durationRange': _0x4b5999,
        'resolutionOptions': _0x3caeb3?.["resolutionOptions"] || []
      });
      const _0x33b4d4 = decorateSegmentRetakeParameterSchemaFields(_0x1bc865, _0x41e890);
      const _0x5d27d = (_0x108bc3, _0x45404c, _0xf63276 = {}) => {
        if (!_0x45404c["length"]) {
          return null;
        }
        const _0x5cca8c = renderUiSchemaFields(_0x45404c, _0x406cda, {
          'sourceId': 'dreamina-video-normal-params',
          ..._0xf63276
        });
        if (!_0x5cca8c) {
          return null;
        }
        const _0x42322c = document["createElement"]('div');
        _0x42322c["className"] = "ui-schema-placement " + _0x108bc3;
        _0x42322c["dataset"]['dreaminaVideoParamSchema'] = '1';
        _0x42322c["innerHTML"] = _0x5cca8c;
        return _0x42322c;
      };
      const _0x48eb62 = _0x390b60['mode'] ? _0x5d27d("dreamina-video-mode-schema", [_0x33b4d4["mode"]]) : null;
      const _0x2afd75 = _0x390b60["ratio"] ? _0x5d27d("dreamina-video-ratio-schema", [_0x33b4d4['resolution'], _0x33b4d4['aspectRatio']], {
        'placement': "resolution"
      }) : null;
      const _0x387c33 = _0x390b60["duration"] ? _0x5d27d("dreamina-video-duration-schema", [_0x33b4d4["duration"]]) : null;
      if (_0x5b4cc2) {
        const _0x45d8de = [_0x122ae9, _0x47e427, _0x48eb62, _0x2afd75, _0x387c33]["filter"](Boolean);
        _0x45d8de['forEach'](_0x4c516f => _0x5b4cc2['appendChild'](_0x4c516f));
      }
      this['_syncDreaminaPromptPlaceholder'](_0x406cda);
    }
    ['_resolveModelExecution'](_0x502b12, _0x4300e4) {
      return resolveModelExecution(_0x502b12, {
        'providerHint': _0x4300e4
      }) || resolveModelExecution(_0x502b12) || null;
    }
    ["_getModelProviderId"](_0x4546ea, _0x39ca79) {
      const _0xa9d7f9 = this["_resolveModelExecution"](_0x4546ea, _0x39ca79);
      const _0x2e65c9 = normalizeProviderId(_0xa9d7f9?.["modelManifest"]?.["provider"]);
      if (_0x2e65c9) {
        return _0x2e65c9;
      }
      return resolveModelProvider(_0x4546ea, _0x39ca79, {
        'allowPrefixInference': ![]
      }) || null;
    }
    ["_isRunninghubWorkflowModel"](_0x68fe8c, _0x56dbdf) {
      return isRunningHubVideoWorkflowModel(_0x68fe8c, _0x56dbdf);
    }
    ["_getModelIconHTML"](_0x2def8d, _0x268f50) {
      return renderVideoModelTriggerIconHTML({
        'model': _0x2def8d,
        'provider': _0x268f50,
        'providersMeta': _0xb0a30f,
        'resolveExecution': (_0x2fcb09, _0x4484d3) => this['_resolveModelExecution'](_0x2fcb09, _0x4484d3),
        'resolveProviderId': (_0x51872b, _0x29f0b3) => this["_getModelProviderId"](_0x51872b, _0x29f0b3)
      });
    }
    ["_getModelParamVisibility"](_0x563b47, _0x55c718) {
      if (isDreaminaStyleVideoModel(_0x563b47, _0x55c718)) {
        const _0x3a15ec = this["_getResolvedDreaminaTaskType"]();
        return getDreaminaVideoTaskParamVisibility(_0x3a15ec);
      }
      const _0x3cbd70 = this["_getModelProviderId"](_0x563b47, _0x55c718);
      if (_0x3cbd70 === "runninghub" || _0x3cbd70 === 'runninghubwf') {
        return {
          'ratio': !![],
          'mode': ![],
          'duration': ![]
        };
      }
      return {
        'ratio': !![],
        'mode': !![],
        'duration': !![]
      };
    }
    ["_getRatioIconHTML"](_0x49c17c) {
      if (_0x49c17c === '自适应') {
        return "<svg class=\"video-ratio-auto-icon\" width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 9h18\"/><path d=\"M9 21V9\"/></svg>";
      }
      const _0x3ca6bb = {
        '1:1': "img-rp-sq",
        '9:16': "img-rp-tall",
        '16:9': "img-rp-wide",
        '3:4': "img-rp-p34",
        '4:3': "img-rp-l43",
        '3:2': 'img-rp-l32',
        '2:3': 'img-rp-p23',
        '5:4': "img-rp-l54",
        '4:5': "img-rp-p45",
        '21:9': "img-rp-ultra"
      };
      const _0x3ed951 = _0x3ca6bb[_0x49c17c] || "img-rp-sq";
      return '<span\x20class=\x22img-rp-icon\x20video-ratio-icon\x20' + _0x3ed951 + "\"></span>";
    }
    ["_updateSubmitButtonState"]() {
      if (!this["btnEl"]) {
        return;
      }
      if (this["_segmentRetakePreparing"] === !![]) {
        const _0x15a1d7 = getVideoGenerateTitle();
        setGenerateButtonLoadingUi(this["btnEl"], {
          'title': _0x15a1d7,
          'disabled': !![],
          'ariaLabel': _0x15a1d7
        });
        this["btnEl"]['setAttribute']?.('aria-busy', "true");
        return;
      }
      const _0x52ff8c = typeof _0x10ce4b["getStateRaw"] === "function" ? _0x10ce4b["getStateRaw"]() : typeof _0x10ce4b["getState"] === 'function' ? _0x10ce4b["getState"]() : {};
      const _0x8ace32 = _0x52ff8c?.["nodes"] || {};
      const _0x36b07e = typeof _0x10ce4b["getIncomingEdges"] === "function" ? _0x10ce4b["getIncomingEdges"](this["nodeId"]) : [];
      const _0x46a4d3 = decorateSegmentRetakeParameterNodeData(_0x8ace32?.[this["nodeId"]] || this["_data"] || {});
      const _0x5d0342 = this["_isRunninghubWorkflowModel"](_0x46a4d3?.['model'], _0x46a4d3?.["provider"]);
      const _0x150c21 = resolveGenerationButtonMode(_0x46a4d3, {
        'cancellable': _0x5d0342,
        'cancelInFlight': this["_rhCancelInFlight"] === !![]
      });
      if (_0x150c21["busy"]) {
        if (_0x5d0342) {
          const _0x2368a2 = getVideoCancelTooltip();
          setGenerateButtonCancellableUi(this["btnEl"], {
            'title': _0x2368a2,
            'tooltip': _0x2368a2,
            'ariaLabel': videoPanelText("cancelGenerateAria"),
            'color': "var(--red)",
            'busy': !![]
          });
        } else {
          const _0x30c4f0 = getVideoGenerateTitle();
          setGenerateButtonLoadingUi(this["btnEl"], {
            'title': _0x30c4f0,
            'disabled': !![],
            'ariaLabel': _0x30c4f0
          });
        }
        this['btnEl']["disabled"] = _0x150c21["disabled"];
        return;
      }
      resetGenerateButtonIdleUi(this['btnEl'], getVideoGenerateTitle());
      resetModelCredentialButtonState(this["btnEl"]);
      const _0x3d6039 = () => applyModelCredentialButtonState(this["btnEl"], {
        'modelId': _0x46a4d3?.["model"],
        'provider': _0x46a4d3?.["provider"],
        'providerProfileId': _0x46a4d3?.['providerProfileId'] || _0x46a4d3?.["rhProviderProfileId"]
      });
      if (!this['_isDreaminaVideoNode'](_0x46a4d3) && getPanelModelManifest(_0x46a4d3)?.["kind"] !== "video") {
        const _0x30e3af = videoPanelText("modelUnavailable");
        this['btnEl']["disabled"] = !![];
        this["btnEl"]['title'] = _0x30e3af;
        this["btnEl"]["setAttribute"]?.("aria-label", _0x30e3af);
        return;
      }
      const _0x6d3147 = resolvePromptTextWithTextRefs({
        'promptEl': this["promptEl"],
        'inEdges': _0x36b07e,
        'nodes': _0x8ace32
      });
      if (_0x46a4d3["segmentRetake"] && !getSegmentRetakeValidation(_0x46a4d3["segmentRetake"])['ok']) {
        this["btnEl"]["disabled"] = !![];
        return;
      }
      if (this["_isDreaminaVideoNode"](_0x46a4d3)) {
        const _0x4dfd1a = this["_syncDreaminaTaskState"](_0x46a4d3, {
          'syncStore': !_0x46a4d3?.['segmentRetake']
        });
        this["_data"] = decorateSegmentRetakeParameterNodeData(_0x4dfd1a["nodeData"] || this['_data']);
        const _0x381a97 = _0x4dfd1a['summary'] || this['_getDreaminaReferenceSummary']();
        const _0xd0f381 = _0x4dfd1a['resolvedTaskType'] || this['_getResolvedDreaminaTaskType']();
        const _0x2c2d5e = _0x4dfd1a["routeMode"] || 'multimodal2video';
        if (!isDreaminaVideoRouteModeEnabled(_0x2c2d5e)) {
          this['btnEl']["disabled"] = !![];
          return;
        }
        const _0x233d3c = validateDreaminaVideoRouteSelection({
          'routeMode': _0x2c2d5e,
          'taskType': _0xd0f381,
          'model': _0x46a4d3?.['model'],
          'provider': _0x46a4d3?.["provider"],
          'imageCount': _0x381a97["imageCount"],
          'videoCount': _0x381a97["videoCount"],
          'audioCount': _0x381a97["audioCount"]
        });
        let _0x471aba = !_0x233d3c;
        if (_0x471aba) {
          if (_0xd0f381 === "text2video") {
            _0x471aba = !!_0x6d3147;
          } else {
            if (_0xd0f381 === "image2video") {
              _0x471aba = !!_0x6d3147 && _0x381a97['imageCount'] === 0x1;
            } else {
              if (_0xd0f381 === "frames2video") {
                _0x471aba = !!_0x6d3147 && _0x381a97["imageCount"] === 0x2;
              } else {
                if (_0xd0f381 === "multiframe2video") {
                  _0x471aba = ![];
                } else {
                  _0xd0f381 === 'multimodal2video' && (_0x471aba = !!_0x6d3147 && (_0x381a97["imageCount"] > 0x0 || _0x381a97["videoCount"] > 0x0 || _0x381a97["audioCount"] > 0x0));
                }
              }
            }
          }
        }
        this["btnEl"]['disabled'] = !_0x471aba;
        if (_0x471aba) {
          _0x3d6039();
        }
        return;
      }
      const _0x4eef14 = () => evaluateGenerationPromptBoundary({
        'model': _0x46a4d3?.["model"],
        'provider': _0x46a4d3?.['provider'],
        'promptText': _0x6d3147,
        'hasInput': ![]
      })['ok'];
      if (isHappyHorsePanelModel(_0x46a4d3)) {
        this["btnEl"]["disabled"] = !_0x6d3147;
        if (_0x6d3147) {
          _0x3d6039();
        }
        return;
      }
      const _0x40281a = shouldAllowEmptyCustomAiAppInputs(getPanelModelManifest(_0x46a4d3));
      const _0x124100 = getFixedInputSlotConfigFromManifest(this["_data"] || {});
      const _0x22f516 = (_0x124100?.['fixedSlots'] || [])["filter"](_0x17cfe8 => _0x17cfe8?.["required"] === !![]);
      const _0x91f27f = (_0x124100?.['exclusiveGroups'] || [])['filter'](_0x506c2c => _0x506c2c?.['required'] === !![] || Number(_0x506c2c?.['min'] || 0x0) > 0x0);
      if (!_0x40281a && (_0x22f516["length"] > 0x0 || _0x91f27f["length"] > 0x0)) {
        const _0x45eccf = _0x8ace32?.[this["nodeId"]] || this["_data"] || {};
        const _0x2bd554 = new Set();
        const _0x1cc168 = new Set(_0x124100['visibleSlots'] || []);
        for (const _0x1aca3a of _0x36b07e) {
          const _0x374320 = _0x8ace32[_0x1aca3a['sourceId']];
          if (!_0x374320) {
            continue;
          }
          const _0x4bdfa2 = resolveEffectiveInputKind(_0x374320, _0x1aca3a);
          const {
            slot: _0x46aaa8
          } = resolveFixedInputSlotForRef({
            'fixedInputConfig': _0x124100,
            'refSlot': _0x1aca3a?.["refSlot"],
            'kind': _0x4bdfa2,
            'occupiedSlots': _0x2bd554,
            'sourceNode': _0x374320
          });
          if (_0x46aaa8 && _0x1cc168['has'](_0x46aaa8)) {
            _0x2bd554['add'](_0x46aaa8);
          }
        }
        const _0x1975db = buildFixedInputAssetSlotMap(this["promptEl"], {
          'slotOrderByType': _0x124100["slotOrderByType"],
          'visibleSlots': _0x124100["visibleSlots"],
          'exclusiveGroups': _0x124100["exclusiveGroups"],
          'slotById': _0x124100["slotById"],
          'occupiedSlots': _0x2bd554,
          'nodeData': _0x45eccf
        });
        const _0x4b9f5b = _0x22f516["every"](_0x2eae58 => {
          const _0x272faa = String(_0x2eae58?.['id'] || '')["trim"]();
          return !!_0x272faa && (_0x2bd554["has"](_0x272faa) || !!_0x1975db[_0x272faa]);
        });
        const _0x11ab47 = _0x91f27f["every"](_0x4137d6 => {
          const _0x4a5d2f = Array["isArray"](_0x4137d6?.["slots"]) ? _0x4137d6["slots"] : [];
          return _0x4a5d2f['some'](_0x2d3e8d => _0x2bd554["has"](_0x2d3e8d) || !!_0x1975db[_0x2d3e8d]);
        });
        const _0x574eaf = _0x4b9f5b && _0x11ab47;
        this["btnEl"]["disabled"] = !(_0x574eaf && _0x4eef14());
        if (!this["btnEl"]["disabled"]) {
          _0x3d6039();
        }
        return;
      }
      this['btnEl']["disabled"] = !_0x4eef14();
      if (!this["btnEl"]["disabled"]) {
        _0x3d6039();
      }
    }
  }
  return _0x1bdde9["prototype"];
}