import { openDebugRequestWindow, closeDebugRequestWindow } from '../debugRequestWindow.js';
import { buildGenerationDebugPreview } from '../../utils/generationDebugPreview.js';
import { createWorkspacePresentationLifecycle } from '../workspacePresentationLifecycle.js';
import { createWorkspacePersistencePresentation } from '../workspacePersistencePresentation.js';
import { refreshPersonReplacementWorkspaceAssets } from './personReplacementWorkspaceSnapshot.js';
import { PERSON_REPLACEMENT_ORIENTATIONS, PERSON_REPLACEMENT_SCOPES, PERSON_REPLACEMENT_VIDEO_INPUT_MODE_CHARACTER_REFERENCE, PERSON_REPLACEMENT_VIDEO_INPUT_MODE_FIRST_FRAME, PERSON_REPLACEMENT_VIDEO_MODEL_IDS, formatPersonReplacementScopeLabel, formatPersonReplacementPersonLabel, getPersonReplacementCharacterBaseImageRef, isGeneratedPersonReplacementLabel, resolvePersonReplacementVideoParameterPolicy } from './personReplacementProject.js';
import { applyPersonReplacementShotSceneReference, assignPersonReplacementShotPersonMapping, clearPersonReplacementShotPersonMappings } from './personReplacementShotMapping.js';
import { buildPersonReplacementPromptMentionCandidates, resolvePersonReplacementPromptMentionRef } from './personReplacementPromptMentions.js';
import { applyPersonReplacementPromptControlAction, syncPersonReplacementPromptModeControl } from './personReplacementPromptControls.js';
import { localPathToUrl } from '../../utils/localMediaPath.js';
import { bindAIGenImageModelSelector } from '../../components/aigenImage/modelSelector.js';
import { bindAIGenVideoModelSelector } from '../../components/aigenVideo/modelSelector.js';
import { createAudioPlaybackSurfaceController } from '../../components/audio-node/audioPlaybackSurface.js';
import { createModelProviderProfileControl } from '../../components/shared/modelProviderProfileControl.js';
import a1289_0x27ab2f from '../VideoClipController.js';
import { MEDIA_CLIP_REVERSE_ICON_PATHS } from '../../components/media-clip/mediaClipReverseControl.js';
import { resolveModelProvider } from '../../manifests/index.js';
import { normalizeCharacterAssetImageGenerationParams } from '../characterAssets/characterAssetImageGeneration.js';
import { normalizePersonReplacementAssetPromptPresetId as a1289_0x4ead1a, resolvePersonReplacementImageGenerationUiRefreshScope, resolvePersonReplacementImageGenerationState, updatePersonReplacementImageGenerationState } from './personReplacementImageGeneration.js';
import { createPersonReplacementImagePresentation, syncPersonReplacementImageStageFrame, syncPersonReplacementImagePromptGate } from './personReplacementImagePresentation.js';
import { applyPersonReplacementVideoCrop, resolvePersonReplacementVideoSlotState } from './personReplacementVideoInputs.js';
import { isPersonReplacementAudioFile as a1289_0x42b695, isPersonReplacementImageFile as a1289_0x25bc7a, isPersonReplacementVideoFile as a1289_0x5718e2, readPersonReplacementVideoPromptEditor } from './personReplacementWorkspaceInput.js';
import { createPersonReplacementVideoCropOptions, isPersonReplacementVideoCropReverseRunning } from './personReplacementVideoCrop.js';
import { isPersonReplacementVideoGenerationActive, resolvePersonReplacementVideoGenerationState, resolvePersonReplacementVideoGenerationUiRefreshScope, updatePersonReplacementVideoGenerationState } from './personReplacementVideoGeneration.js';
import { createPersonReplacementVideoPresentation, syncPersonReplacementVideoStageFrame } from './personReplacementVideoPresentation.js';
import { createPersonReplacementShotTimelinePresentation } from './personReplacementShotTimelinePresentation.js';
import { createPersonReplacementIdentityPresentation } from './personReplacementIdentityPresentation.js';
import { syncPersonReplacementAssetSelection } from './personReplacementAssetSelectionRendering.js';
import { createPersonReplacementCompositePreviewPresentation } from './personReplacementCompositePreviewPresentation.js';
import { buildPersonReplacementCompositePreviewSnapshot } from './personReplacementCompositePreviewProjection.js';
import { createPersonReplacementShellPresentation } from './personReplacementShellPresentation.js';
import { openImagePreview, openVideoPreview } from '../imagePreview.js';
import { addPersonReplacementAppearanceToLibraryWithFly, requestPersonReplacementLibraryAssignment } from './personReplacementAssetLibraryInteraction.js';
import { applyWorkspaceAssetSplitRatioToLayout } from '../workspaceAssetSettingsShell.js';
import { normalizeWorkspaceProjectSortOrder, refreshWorkspaceProjectResultsInPlace } from '../workspaceProjectHome.js';
import { resolveWorkspaceCardMultiSelection } from '../workspaceAssetSelection.js';
import { createWorkspaceAssetLibraryDisclosure, handleWorkspaceAssetLibraryImageError } from '../workspaceAssetLibrary.js';
import { runWorkspaceVideoDownloadAction } from '../workspaceVideoDownload.js';
import { createPersonReplacementResultMediaActions } from './personReplacementResultMediaActions.js';
import { consumeWorkspaceWheelDirection, renderWorkspaceAssetLoadingOverlay, resolveWorkspaceTabTransitionDirection } from '../workspaceAssetPresentation.js';
import { readPersonReplacementAssetPromptText } from './personReplacementAssetPresentation.js';
import { getPersonReplacementSelectableAssets, renderPersonReplacementAssetSettingsPage } from './personReplacementAssetSettingsPresentation.js';
import { applyPersonReplacementVoiceLayoutToElement, getPersonReplacementVoiceCloneCharacters, renderPersonReplacementVoiceClonePage } from './personReplacementVoiceClonePresentation.js';
import { createPersonReplacementVoiceCloneInteractionController } from './personReplacementVoiceCloneInteractionController.js';
import { getPersonReplacementProjectAudioAssets, getPersonReplacementLibraryAudioRef, getPersonReplacementVoiceLibraryBoundCharacters } from './personReplacementVoiceLibrary.js';
import { beginWorkspaceHorizontalResizeSession } from '../workspaceResizeSession.js';
import { captureWorkspaceNestedScrollPositions, restoreWorkspaceNestedScrollPositions, shouldPreserveWorkspaceNestedWheel } from '../workspaceWheelNavigation.js';
import { getWorkspaceAssetAppearances, getWorkspaceAssetBaseAppearance } from '../workspaceAssetAppearance.js';
import { createPersonReplacementAssetHoverPreviewController } from './personReplacementAssetHoverPreviewController.js';
import { createPersonReplacementResultHistoryController } from './personReplacementResultHistoryController.js';
import { createWorkspaceVideoPlayback } from '../workspaceVideoPlayback.js';
import { createWorkspaceMarqueeSelectionController } from '../workspaceMarqueeSelection.js';
import { applyWorkspaceAssetNativeDragPreview, WORKSPACE_ASSET_DRAG_PREVIEW_POINTER_GAP } from '../workspaceAssetDragPreview.js';
import { bindWorkspaceEntityContextMenu } from '../workspaceEntityContextMenu.js';
import { resolvePersonReplacementContextMenuItems as a1289_0x56ff5e } from './personReplacementContextMenu.js';
import { scrollClosestElementHorizontallyWithWheel } from '../workspaceHorizontalWheel.js';
import { createWorkspaceMenuController, syncWorkspaceInlineMenuExpandedWidth } from '../workspaceMenuController.js';
import { createPersonReplacementExportSubmenuController } from './personReplacementExportSubmenuController.js';
import { handleWorkspaceStepShortcut } from '../workspaceStepShortcut.js';
import { bindPromptMentionHost, insertPresetPromptIntoEditor, sanitizePromptHtmlForCommit } from '../nodePromptShared.js';
import { shouldSkipPromptTriggerForBulkInput } from '../promptTriggerComposition.js';
import { checkSlashTrigger, handleSlashKeyboardNavigation } from '../slashMenu.js';
import { REPLACEMENT_STUDIO_NAME } from './replacementStudioTerminology.js';
import { PERSON_REPLACEMENT_CANVAS_SCOPES } from './personReplacementOutputCanvas.js';
import { resolvePersonReplacementSourceImageSize } from './personReplacementManualBox.js';
import { createPersonReplacementPersonBoxInteractionController } from './personReplacementPersonBoxInteractionController.js';
import { PERSON_REPLACEMENT_CUT_DEFAULT_FPS, getPersonReplacementShotCutFrameSec as a1289_0xa0a99e, getPersonReplacementShotCutTimelineSec, getPersonReplacementShotCutTotalDuration } from './personReplacementShotCutModel.js';
import { createPersonReplacementShotCutSession } from './personReplacementShotCutSession.js';
import { reconcilePersonReplacementImageShotSelection, reconcilePersonReplacementShotCardList, reconcileElementTree, reconcilePersonReplacementShotTimelineCard, reconcilePersonReplacementReferenceInputs, reconcilePersonReplacementVideoShotSelection } from './personReplacementShotSelectionRendering.js';
import { cancelPersonReplacementSlideTransition, startPersonReplacementSlideTransition } from './personReplacementSlideTransition.js';
import { shouldReusePersonReplacementVideoPlaybackStage } from './personReplacementVideoSyncPlayback.js';
import { createPersonReplacementVideoPlaybackController } from './personReplacementVideoPlaybackController.js';
import { createPersonReplacementCompositePreviewController } from './personReplacementCompositePreviewController.js';
import { createPersonReplacementShotCutPreviewMediaController } from './personReplacementShotCutPreviewMediaController.js';
import { createPersonReplacementShotCutPreviewController } from './personReplacementShotCutPreviewController.js';
import { createPersonReplacementShotCutEditorController } from './personReplacementShotCutEditorController.js';
import { createPersonReplacementShotCutInteractionController } from './personReplacementShotCutInteractionController.js';
import { createPersonReplacementShotCutViewportController } from './personReplacementShotCutViewportController.js';
import { createPersonReplacementResultSelectionController } from './personReplacementResultSelectionController.js';
import { createPersonReplacementBatchGenerationController } from './personReplacementBatchGenerationController.js';
import { createPersonReplacementPageTransitionController } from './personReplacementPageTransitionController.js';
import { applyPersonReplacementCompositeSidebarWidthToLayout, createPersonReplacementLayoutResizeController, renderPersonReplacementLayoutSplitter } from './personReplacementLayoutResizeController.js';
import { createPersonReplacementSmartDetectPresentation } from './personReplacementSmartDetectPresentation.js';
import { PERSON_REPLACEMENT_OUTPUT_TRANSITIONS, transitionPersonReplacementOutput } from './personReplacementOutputLineage.js';
import { PERSON_REPLACEMENT_WORKSPACE_INTENTS, createPersonReplacementWorkspaceIntentPort } from './personReplacementWorkspaceIntentPort.js';
import { isPersonReplacementSourceProcessing, normalizePersonReplacementCompositeSidebarWidth, normalizePersonReplacementPersistenceState, normalizePersonReplacementVoiceLayout, normalizePersonReplacementWorkspaceProject as a1289_0x2fb27f } from './personReplacementProjectSession.js';
import { PERSON_REPLACEMENT_STEPS, getPersonReplacementStepGate } from './personReplacementWorkflow.js';
import { PERSON_REPLACEMENT_CUSTOM_LABEL_VALUE, getPersonReplacementBoxedPeople as a1289_0x1cfc78, getPersonReplacementDuplicateRoleLabels, getPersonReplacementIdentityCorrectionDraftKey as a1289_0x29bd32, getPersonReplacementLabelOptions as a1289_0x2a6be4, getPersonReplacementReusableLabels as a1289_0x32ca2b } from './personReplacementSourceIdentity.js';
const PERSON_REPLACEMENT_VOICE_ASSET_DRAG_TYPE = "application/x-person-replacement-voice-asset";
const PERSON_REPLACEMENT_SCENE_ASSET_DRAG_TYPE = 'application/x-person-replacement-scene-asset';
const PERSON_REPLACEMENT_PERSISTENT_NESTED_SCROLL_SELECTORS = Object["freeze"]([".story-assets-list, [data-person-replacement-video-reference-list]", ".person-replacement-shot-timeline-scroll", ".person-replacement-shot-cut-scroll", '.person-replacement-shot-cut-smart-detect-panel']);
const PERSON_REPLACEMENT_MULTI_SELECTION_INTERACTIVE_SELECTOR = ["[data-story-marquee-item]", "button", "a[href]", "input", "textarea", "select", "label", 'img', "video", "audio", "canvas", "[contenteditable='true']", "[role='button']", '[role=\x27option\x27]', "[role='menuitem']", "[role='slider']", "[tabindex]"]["join"](',');
function escapeHtml(_0x2e11a9) {
  return String(_0x2e11a9 ?? '')["replaceAll"]('&', '&amp;')["replaceAll"]('<', "&lt;")["replaceAll"]('>', '&gt;')["replaceAll"]('\x22', "&quot;")["replaceAll"]('\x27', "&#039;");
}
function normalizeText(_0x4a433f, _0x3272bc = '') {
  const _0x525624 = String(_0x4a433f ?? '')["trim"]();
  return _0x525624 || _0x3272bc;
}
function cloneJson(_0x179708) {
  return _0x179708 && typeof _0x179708 === 'object' ? JSON["parse"](JSON["stringify"](_0x179708)) : _0x179708;
}
function clamp(_0x3c1f94, _0x5de23a, _0x4aefaf, _0x434611 = _0x5de23a) {
  const _0x5ce5aa = Number(_0x3c1f94);
  return Number['isFinite'](_0x5ce5aa) ? Math["min"](_0x4aefaf, Math["max"](_0x5de23a, _0x5ce5aa)) : _0x434611;
}
const PERSON_REPLACEMENT_ORIENTATION_LABELS = Object["freeze"]({
  'front': '正面',
  'back': '背面',
  'side': '侧面',
  'left_profile': "左侧面",
  'right_profile': "右侧面",
  'three_quarter_left': "左前侧",
  'three_quarter_right': '右前侧',
  'over_shoulder_left': '左过肩',
  'over_shoulder_right': "右过肩",
  'unknown': "待确认"
});
function formatPersonOrientation(_0xdf90e0) {
  return PERSON_REPLACEMENT_ORIENTATION_LABELS[normalizeText(_0xdf90e0)] || PERSON_REPLACEMENT_ORIENTATION_LABELS["unknown"];
}
function getPersonOrientationOptions() {
  const _0x16a717 = PERSON_REPLACEMENT_ORIENTATIONS["filter"](_0x5c98e5 => _0x5c98e5 !== 'unknown');
  return _0x16a717['map'](_0x49638a => ({
    'value': _0x49638a,
    'label': formatPersonOrientation(_0x49638a)
  }));
}
function getPersonReplacementScopeOptions() {
  return PERSON_REPLACEMENT_SCOPES["map"](_0x1f28e4 => ({
    'value': _0x1f28e4,
    'label': formatPersonReplacementScopeLabel(_0x1f28e4)
  }));
}
function normalizeMediaUrl(_0x2f7a81) {
  const _0x34e9cf = normalizeText(_0x2f7a81);
  if (!_0x34e9cf) {
    return '';
  }
  return localPathToUrl(_0x34e9cf) || _0x34e9cf;
}
function getCharacterAppearance(_0x401696, _0x42a7ff = '') {
  const _0x2e9f48 = getWorkspaceAssetAppearances(_0x401696);
  return _0x2e9f48['find'](_0x3e2f75 => _0x3e2f75['id'] === _0x42a7ff) || getWorkspaceAssetBaseAppearance(_0x401696) || _0x2e9f48[0x0] || null;
}
function getCharacterVoiceUrl(_0x451e13 = {}) {
  return normalizeMediaUrl(_0x451e13['voiceReference']?.["audioUrl"] || _0x451e13['voiceReference']?.['localPath'] || _0x451e13["voiceRef"]);
}
function formatClock(_0xe972d1) {
  const _0x8e8fb2 = Math["max"](0x0, Number(_0xe972d1) || 0x0);
  const _0x2d0cd1 = Math["floor"](_0x8e8fb2 / 0x3c);
  const _0x2b5536 = Math["floor"](_0x8e8fb2 % 0x3c);
  return String(_0x2d0cd1)['padStart'](0x2, '0') + ':' + String(_0x2b5536)["padStart"](0x2, '0');
}
function renderIcon(_0x1f4802) {
  const _0x488584 = {
    'upload': '<path\x20d=\x22M12\x2016V4m0\x200L7.5\x208.5M12\x204l4.5\x204.5\x22/><path\x20d=\x22M5\x2013v5a2\x202\x200\x200\x200\x202\x202h10a2\x202\x200\x200\x200\x202-2v-5\x22/>',
    'video': '<rect\x20x=\x223\x22\x20y=\x225\x22\x20width=\x2214\x22\x20height=\x2214\x22\x20rx=\x223\x22/><path\x20d=\x22m17\x2010\x204-2v8l-4-2\x22/>',
    'close': "<path d=\"m6 6 12 12M18 6 6 18\"/>",
    'person': "<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21a8 8 0 0 1 16 0\"/>",
    'undo': "<path d=\"M9 14l-4-4 4-4\"/><path d=\"M5 10h9a6 6 0 1 1 0 12h-3\"/>",
    'reset': "<path d=\"M3 12a9 9 0 1 0 3-6.7\"/><path d=\"M3 4v5h5\"/>",
    'soundOff': "<path d=\"M11 5 6 9H3v6h3l5 4z\"/><path d=\"m16 9 5 5m0-5-5 5\"/>",
    'soundOn': "<path d=\"M11 5 6 9H3v6h3l5 4z\"/><path d=\"M15.5 9.5a3.5 3.5 0 0 1 0 5\"/><path d=\"M18 7a7 7 0 0 1 0 10\"/>",
    'smartDetect': "<path d=\"m12 3 1.2 3.3L16.5 7.5l-3.3 1.2L12 12l-1.2-3.3-3.3-1.2 3.3-1.2z\"/><path d=\"m18 13 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8z\"/><path d=\"M5 14v5h5\"/>",
    'reverse': MEDIA_CLIP_REVERSE_ICON_PATHS,
    'merge': "<path d=\"M4 6h6v5H4zM14 13h6v5h-6z\"/><path d=\"M10 8.5h2a2 2 0 0 1 2 2v5\"/><path d=\"m11.5 13 2.5 2.5 2.5-2.5\"/>"
  };
  return "<svg class=\"person-replacement-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">" + (_0x488584[_0x1f4802] || '') + '</svg>';
}
const personReplacementSmartDetectPresentation = createPersonReplacementSmartDetectPresentation({
  'renderIcon': renderIcon
});
const personReplacementShotTimelinePresentation = createPersonReplacementShotTimelinePresentation({
  'renderIcon': renderIcon
});
const personReplacementIdentityPresentation = createPersonReplacementIdentityPresentation();
const personReplacementCompositePreviewPresentation = createPersonReplacementCompositePreviewPresentation();
const personReplacementShellPresentation = createPersonReplacementShellPresentation({
  'resolveVoiceReferenceCount': _0x1426d2 => getPersonReplacementVoiceCloneCharacters(_0x1426d2)["filter"](_0x2c662d => getCharacterVoiceUrl(_0x2c662d))["length"]
});
const personReplacementImagePresentation = createPersonReplacementImagePresentation({
  'buildIdentityView': (_0x22b9a1, _0x3145c6, _0x215da1) => personReplacementIdentityPresentation["buildImage"](_0x22b9a1, _0x3145c6, _0x215da1),
  'renderShotTimeline': (_0x598301, _0x1529df) => personReplacementShotTimelinePresentation['renderStage'](_0x598301, _0x1529df),
  'renderLayoutSplitter': renderPersonReplacementLayoutSplitter,
  'renderFooter': (_0x374d39, _0x32a94e) => personReplacementShellPresentation["renderStepFooter"](_0x374d39, _0x32a94e),
  'renderSmartDetectTrigger': personReplacementSmartDetectPresentation["renderTrigger"]
});
const personReplacementVideoPresentation = createPersonReplacementVideoPresentation({
  'buildIdentityView': (_0x1c2ed0, _0x380cfa) => personReplacementIdentityPresentation["buildVideo"](_0x1c2ed0, _0x380cfa),
  'renderShotTimeline': (_0x280342, _0x3f3370) => personReplacementShotTimelinePresentation['renderStage'](_0x280342, _0x3f3370),
  'renderLayoutSplitter': renderPersonReplacementLayoutSplitter,
  'renderFooter': (_0x43c53e, _0x450236) => personReplacementShellPresentation["renderStepFooter"](_0x43c53e, _0x450236)
});
function renderCompositeComposeAction(_0x11df84, _0x3bd1a3 = {}) {
  const _0x54bcd1 = _0x11df84['shots']["some"](_0x3c9d4a => normalizeText(_0x3c9d4a['resultVideoRef']));
  const _0x578ab5 = _0x3bd1a3['composeOutputPending'] === !![];
  const _0x431941 = buildPersonReplacementCompositePreviewSnapshot(_0x11df84)["fullAvailable"];
  const _0x1a382b = _0x578ab5 ? "合成中…" : _0x431941 ? "重新合成全部视频" : "合成全部视频";
  return '<button\x20type=\x22button\x22\x20class=\x22story-workbench-action-button\x20story-main-action-button\x20person-replacement-compose-output' + (_0x578ab5 ? " is-loading" : '') + '\x22\x20data-person-replacement-action=\x22compose-output\x22\x20aria-busy=\x22' + _0x578ab5 + '\x22' + (_0x578ab5 || !_0x54bcd1 ? " disabled" : '') + '>' + (_0x578ab5 ? '<span\x20class=\x22storyboard-script-loading-spinner\x20person-replacement-compose-spinner\x22\x20aria-hidden=\x22true\x22></span>' : '') + "<span>" + _0x1a382b + '</span></button>';
}
function renderAssetSettings(_0x3e7749, _0x1b3161 = {}) {
  return renderPersonReplacementAssetSettingsPage(_0x3e7749, {
    ..._0x1b3161,
    'renderDetailSplitter': _0x55afc7 => renderPersonReplacementLayoutSplitter('asset-detail', {
      'assetDetailSplitRatio': _0x55afc7
    }),
    'footerHtml': personReplacementShellPresentation['renderStepFooter'](_0x3e7749, {
      'nextLabel': '进入图像替换',
      'hidePrevious': !![]
    })
  });
}
function renderVoiceClone(_0x50d5e2) {
  return renderPersonReplacementVoiceClonePage(_0x50d5e2, {
    'footerHtml': personReplacementShellPresentation["renderStepFooter"](_0x50d5e2, {
      'nextLabel': "进入合成视频"
    })
  });
}
function renderCompositePreview(_0x5ad578, _0x5813dd = {}) {
  const _0x4b2bee = buildPersonReplacementCompositePreviewSnapshot(_0x5ad578);
  return personReplacementCompositePreviewPresentation["render"](_0x4b2bee, {
    'composeActionHtml': renderCompositeComposeAction(_0x5ad578, _0x5813dd),
    'playbackControlsHtml': personReplacementVideoPresentation['renderPlaybackControls'](_0x4b2bee["selectedShot"], {
      'context': "comparison",
      'disabled': !_0x4b2bee["canCompare"]
    }),
    'composeOutputPending': _0x5813dd['composeOutputPending'] === !![]
  });
}
function renderProject(_0x4f91a2, _0x23636e = {}) {
  const _0x4fc8fa = {
    0x1: renderAssetSettings,
    0x2: (_0x2a2ca5, _0x165af2) => personReplacementImagePresentation["render"](_0x2a2ca5, _0x165af2),
    0x3: (_0x4b0051, _0x5c8fbc) => personReplacementVideoPresentation["render"](_0x4b0051, _0x5c8fbc),
    0x4: renderVoiceClone,
    0x5: renderCompositePreview
  };
  const _0x397211 = _0x23636e["cutEditorSmartDetectOpen"] ? personReplacementSmartDetectPresentation["renderPanel"](_0x4f91a2, {
    'smartDetecting': _0x23636e["cutEditorSmartDetecting"]
  }) : '';
  const _0x364a1c = _0x23636e['canvasSyncOverlayInline'] === ![] ? '' : personReplacementShellPresentation["renderCanvasSyncLoadingOverlay"](_0x23636e);
  return personReplacementShellPresentation["renderHeader"](_0x4f91a2, _0x23636e) + '<main\x20class=\x22person-replacement-project-body\x22' + (_0x23636e['canvasSyncPending'] === !![] ? " aria-hidden=\"true\" inert" : '') + '>' + _0x4fc8fa[_0x4f91a2["workspace"]["step"]](_0x4f91a2, _0x23636e) + "</main>" + _0x397211 + _0x364a1c;
}
function renderHiddenInputs() {
  return '<div\x20class=\x22story-asset-hover-preview\x22\x20data-story-asset-hover-preview\x20role=\x22tooltip\x22\x20aria-hidden=\x22true\x22></div><input\x20type=\x22file\x22\x20accept=\x22video/*\x22\x20multiple\x20hidden\x20data-person-replacement-input=\x22source-videos\x22><input\x20type=\x22file\x22\x20accept=\x22image/*\x22\x20multiple\x20hidden\x20data-person-replacement-input=\x22new-character-images\x22><input\x20type=\x22file\x22\x20accept=\x22image/*\x22\x20multiple\x20hidden\x20data-person-replacement-input=\x22new-scene-images\x22><input\x20type=\x22file\x22\x20accept=\x22audio/*\x22\x20multiple\x20hidden\x20data-person-replacement-input=\x22new-audio-files\x22><input\x20type=\x22file\x22\x20accept=\x22image/*\x22\x20hidden\x20data-person-replacement-input=\x22appearance-image\x22><input\x20type=\x22file\x22\x20accept=\x22image/*\x22\x20hidden\x20data-person-replacement-input=\x22replacement-image\x22><input\x20type=\x22file\x22\x20accept=\x22video/*\x22\x20hidden\x20data-person-replacement-input=\x22replacement-video-result\x22><input\x20type=\x22file\x22\x20accept=\x22image/*,video/*\x22\x20hidden\x20data-person-replacement-input=\x22replacement-video-slot\x22><input\x20type=\x22file\x22\x20accept=\x22audio/*\x22\x20hidden\x20data-person-replacement-input=\x22character-voice\x22>';
}
export function renderPersonReplacementWorkspace(_0x318fad = {}, _0x3a62b3 = {}) {
  const _0x30c6c7 = a1289_0x2fb27f(_0x318fad);
  const _0x39c213 = _0x30c6c7["workspace"]["view"] === "home" ? personReplacementShellPresentation["renderHome"](_0x30c6c7) : renderProject(_0x30c6c7, _0x3a62b3);
  return "<section class=\"person-replacement-workspace\" data-person-replacement-workspace data-person-replacement-view=\"" + _0x30c6c7["workspace"]["view"] + "\" data-person-replacement-step=\"" + _0x30c6c7["workspace"]['step'] + '\x22>' + _0x39c213 + renderHiddenInputs() + "</section>";
}
function resolveMountTarget(_0x2c36e8, _0x46cfb5) {
  if (_0x46cfb5?.['nodeType'] === 0x1) {
    return _0x46cfb5;
  }
  return _0x2c36e8?.["querySelector"]?.(_0x46cfb5) || _0x2c36e8?.["body"] || null;
}
export function createReplacementStudioWorkspace({
  documentObject = globalThis["document"],
  windowObject = globalThis["window"] || globalThis,
  videoClipController = a1289_0x27ab2f,
  createVideoPlayback = createWorkspaceVideoPlayback,
  mountTarget = "#v2-wrap",
  initialProject = {},
  projectSession = null,
  workspaceIntentPort = createPersonReplacementWorkspaceIntentPort()
} = {}) {
  const _0x4b5931 = PERSON_REPLACEMENT_WORKSPACE_INTENTS;
  const _0x5ad063 = _0x47bc15 => workspaceIntentPort["supports"](_0x47bc15);
  const _0x15c74b = (_0x35e4cd, ..._0x110d07) => workspaceIntentPort["request"](_0x35e4cd, ..._0x110d07);
  const _0x1b77c5 = _0x5a217e => (..._0x2588de) => _0x15c74b(_0x5a217e, ..._0x2588de);
  let _0x2547c2 = a1289_0x2fb27f(initialProject);
  const _0x7b425c = createWorkspaceAssetLibraryDisclosure();
  let _0x313f9e = null;
  let _0x340f82 = null;
  let _0x4d9c06 = ![];
  const _0xc321d6 = createWorkspacePresentationLifecycle({
    'getRoot': () => _0x313f9e
  });
  const _0x30abb8 = createWorkspacePersistencePresentation({
    'getRoot': () => _0x313f9e
  });
  let _0x5a79ec = mountTarget;
  let _0x282314 = null;
  let _0x5e3e1e = null;
  const _0x43a678 = new Set();
  let _0x2281fc = '';
  let _0x3c5dc1 = [];
  let _0x555279 = null;
  let _0x474de2 = null;
  let _0x5e94a3 = null;
  let _0x4c2c62 = null;
  let _0x200819 = ![];
  let _0xfdff29 = '';
  let _0x28c81f = ![];
  let _0x480d58 = ![];
  let _0x5667ff = null;
  let _0x1a0af6 = null;
  const _0x5ad7c8 = new Map();
  let _0x38f85d = ![];
  let _0x15e684 = null;
  let _0x432607 = null;
  let _0x491710 = null;
  let _0x2e818c = null;
  const _0x2e4219 = createPersonReplacementVideoPlaybackController({
    'getRoot': () => _0x313f9e,
    'getProject': () => _0x2547c2,
    'getSelectedShot': _0x1ff5dd => personReplacementVideoPresentation["build"](_0x1ff5dd)['shot'],
    'createVideoPlayback': createVideoPlayback,
    'videoClipController': videoClipController
  });
  const _0x247681 = _0x519668 => _0x2e4219["bind"](_0x519668);
  const _0x4996f5 = () => _0x2e4219["bindCenterIndicators"]();
  const _0x1682cd = _0x552914 => _0x2e4219['stop'](_0x552914);
  const _0xd3e343 = createPersonReplacementCompositePreviewController({
    'getRoot': () => _0x313f9e,
    'getProject': () => _0x2547c2,
    'documentObject': documentObject,
    'windowObject': windowObject,
    'createVideoPlayback': createVideoPlayback
  });
  const _0x30afb2 = () => _0xd3e343["stop"]();
  const _0x351fd2 = _0x1bd079 => _0xd3e343['releaseOriginalWarmup'](_0x1bd079);
  const _0x583852 = _0x3620e6 => _0xd3e343["startOriginalWarmup"](_0x3620e6);
  const _0x50e3a9 = () => _0xd3e343["prepareOriginalHandoff"]();
  const _0x55111a = () => _0xd3e343["retainFullVideosForPageRefresh"]();
  const _0x4a5835 = () => _0xd3e343["bind"]();
  let _0x5c08a3 = null;
  const _0x155aa0 = createPersonReplacementShotCutSession({
    'initialProject': _0x2547c2,
    'windowObject': windowObject,
    'onBoundaryDragStopped': () => {
      documentObject?.['body']?.["classList"]?.['remove']?.("person-replacement-cut-resizing");
    },
    'onDetectionRequested': async _0x55aef8 => {
      const _0x59f6c1 = await _0x15c74b(_0x4b5931["DETECT_SHOT_CUT_RANGES"], _0x55aef8, {
        'project': cloneJson(_0x2547c2)
      });
      const _0x42bb43 = Array['isArray'](_0x59f6c1?.["ranges"]) ? _0x59f6c1["ranges"] : [];
      if (!_0x42bb43['length']) {
        throw new Error("智能检测未返回可用切口");
      }
      return _0x42bb43;
    },
    'playbackControllerOptions': {
      'windowObject': windowObject,
      'isEditorOpen': () => _0x545ea6["isOpen"],
      'getDraft': () => _0x545ea6["draft"],
      'getProject': () => _0x2547c2,
      'syncNativePlayback': _0x181d2c => _0x5c08a3?.["syncPlaybackFromVideo"](_0x181d2c),
      'syncTimelinePosition': _0x1c53dc => _0x5c08a3?.["syncTimelinePosition"](_0x1c53dc),
      'previewShotCut': (..._0x13ffa3) => _0x5c08a3?.["preview"](..._0x13ffa3)
    }
  });
  const _0x545ea6 = _0x155aa0["workspaceState"];
  const _0x41bfe9 = createPersonReplacementShotCutPreviewMediaController({
    'session': _0x155aa0,
    'getRoot': () => _0x313f9e,
    'getProject': () => _0x2547c2,
    'getSelectedShot': _0x21f39b => personReplacementImagePresentation["build"](_0x21f39b)["selectedShot"],
    'createVideoPlayback': createVideoPlayback,
    'documentObject': documentObject,
    'isDestroyed': () => _0x4d9c06
  });
  const {
    preparePreviewVideo: _0x58e350,
    preserveBufferedVideo: _0x1c3039,
    releaseBufferedVideo: _0x40a6e5,
    restoreBufferedVideo: _0x29feb3
  } = _0x41bfe9;
  const _0x4f00f6 = createPersonReplacementShotCutViewportController({
    'session': _0x155aa0,
    'getRoot': () => _0x313f9e,
    'renderIcon': renderIcon
  });
  const {
    applyTimelineZoom: _0x2f8675,
    isBusy: _0x4ac098,
    isDraftMutationBusy: _0x118f0f
  } = _0x4f00f6;
  _0x5c08a3 = createPersonReplacementShotCutPreviewController({
    'session': _0x155aa0,
    'mediaController': _0x41bfe9,
    'viewportController': _0x4f00f6,
    'getRoot': () => _0x313f9e,
    'getProject': () => _0x2547c2
  });
  const {
    armFrameWait: _0x5b4698,
    cancelFrameWait: _0x54ce2e,
    cancelHoverPreview: _0x52afe9,
    clearPreviewMetadata: _0x525fa4,
    markFrameReady: _0x59ed25,
    preview: _0x3fc0aa,
    seekTimeline: _0x5179f5,
    stepTimeline: _0x1b030c,
    stopPlayback: _0xc540cf,
    syncPlaybackFromVideo: _0xf8cb6b,
    togglePlayback: _0x8bd08b
  } = _0x5c08a3;
  const _0x197001 = createPersonReplacementShotCutEditorController({
    'session': _0x155aa0,
    'previewController': _0x5c08a3,
    'mediaController': _0x41bfe9,
    'viewportController': _0x4f00f6,
    'getRoot': () => _0x313f9e,
    'getProject': () => _0x2547c2,
    'documentObject': documentObject,
    'windowObject': windowObject,
    'isDestroyed': () => _0x4d9c06,
    'requestRender': () => _0x3567fe(),
    'onShotKeyframeSelected': _0x1b77c5(_0x4b5931["SELECT_SHOT_KEYFRAME"]),
    'onShotReverseRequested': _0x1b77c5(_0x4b5931['UPDATE_SHOT_REVERSE']),
    'hideResultHistoryMenu': () => _0x37c1e6(),
    'scrollShotCardIntoView': _0x17c1c9 => _0x2a23cd(_0x17c1c9)
  });
  const {
    close: _0x3657a3,
    requestReverseChange: _0x32fb57,
    reset: _0x1d4b46,
    splitAtPlayhead: _0x6ab34b,
    watchOpeningVideo: _0x37e59e
  } = _0x197001;
  const _0x23a353 = createPersonReplacementShotCutInteractionController({
    'session': _0x155aa0,
    'previewController': _0x5c08a3,
    'viewportController': _0x4f00f6,
    'editorController': _0x197001,
    'getRoot': () => _0x313f9e,
    'getProject': () => _0x2547c2,
    'documentObject': documentObject,
    'windowObject': windowObject,
    'isDestroyed': () => _0x4d9c06,
    'requestRender': () => _0x3567fe(),
    'onShotCutDetectionRequested': _0x1b77c5(_0x4b5931['DETECT_SHOT_CUT_RANGES']),
    'onShotCutRangesRequested': _0x1b77c5(_0x4b5931['UPDATE_SHOT_CUT_RANGES']),
    'runRequest': (_0x388148, _0x447972) => _0x28d621(_0x388148, _0x447972),
    'updateSmartClipSettings': (..._0x44d5b0) => _0x1e6410(..._0x44d5b0)
  });
  const {
    applyBoundaryTime: _0x3fcdf4,
    beginBoundaryDrag: _0x3b99c1,
    getTimelineSecFromPointer: _0x1e1311,
    hideHoverPlayhead: _0xd680c8,
    syncHoverPlayhead: _0x23dbe6,
    undoDraft: _0xc1f5e3
  } = _0x23a353;
  const _0x2dbafb = createPersonReplacementAssetHoverPreviewController({
    'getRoot': () => _0x313f9e,
    'getProject': () => _0x2547c2,
    'getSelectedAppearance': _0x2ab5db => _0xee8fcb(_0x2ab5db),
    'isTargetAssetDragActive': () => _0x38f85d,
    'documentObject': documentObject,
    'windowObject': windowObject
  });
  const {
    blockDropTarget: _0x4336ee,
    handlePointerMove: _0x4a5212,
    handlePointerOut: _0x5d6ac4,
    handlePointerOver: _0x56b3e6,
    hide: _0x457764
  } = _0x2dbafb;
  let _0x4c89d6 = ![];
  let _0x5b532b = null;
  let _0x400219 = null;
  let _0x55da73 = "none";
  let _0x33a455 = "page";
  let _0x58cabf = '';
  let _0x53d4d4 = () => ![];
  const _0x352bf7 = {
    'accumulator': 0x0,
    'lockedUntil': 0x0
  };
  const _0x38f785 = {
    'accumulator': 0x0,
    'lockedUntil': 0x0
  };
  const _0x581403 = {
    'accumulator': 0x0,
    'lockedUntil': 0x0
  };
  const _0x10bb84 = {
    'accumulator': 0x0,
    'lockedUntil': 0x0
  };
  const _0x4a5b2e = {
    'accumulator': 0x0,
    'lockedUntil': 0x0
  };
  const _0xbbbebb = new Map();
  const _0x2deda0 = new Map();
  const _0x55eaa0 = createWorkspaceMenuController({
    'root': () => _0x313f9e,
    'wrapperSelector': '[data-person-replacement-output-menu]',
    'triggerSelector': '[data-person-replacement-output-menu-trigger]',
    'menuSelector': ".story-canvas-sync-menu",
    'optionSelector': "[data-person-replacement-output-menu-item]"
  });
  const _0x594c8d = createPersonReplacementExportSubmenuController({
    'root': () => _0x313f9e
  });
  const _0x49c6e0 = (_0x515f50 = null) => {
    _0x594c8d["close"]();
    return _0x55eaa0["close"](_0x515f50);
  };
  const _0x5d03e7 = _0x47d6c9 => _0x55eaa0["toggle"](_0x47d6c9);
  const _0x4dcfca = _0x5869a4 => {
    if (_0x5ad063(_0x4b5931["SELECT_SOURCE_VIDEOS"])) {
      return _0x1aea64(_0x4b5931["SELECT_SOURCE_VIDEOS"], _0x5869a4);
    }
    if (_0x5ad063(_0x4b5931["SELECT_SOURCE_VIDEO"])) {
      return Promise["all"](_0x5869a4["map"](_0x1cb127 => _0x15c74b(_0x4b5931["SELECT_SOURCE_VIDEO"], _0x1cb127)));
    }
    return null;
  };
  const _0x10ec58 = _0x99cf11 => {
    if (_0x5ad063(_0x4b5931["SELECT_NEW_CHARACTER_IMAGES"])) {
      return _0x1aea64(_0x4b5931["SELECT_NEW_CHARACTER_IMAGES"], _0x99cf11);
    }
    if (_0x5ad063(_0x4b5931["SELECT_NEW_CHARACTER_IMAGE"])) {
      return Promise["all"](_0x99cf11["map"](_0x444846 => _0x15c74b(_0x4b5931["SELECT_NEW_CHARACTER_IMAGE"], _0x444846, {
        'project': cloneJson(_0x2547c2)
      })));
    }
    return null;
  };
  const _0x4cd68f = (_0x5254f3 = _0x2547c2) => refreshPersonReplacementWorkspaceAssets(_0x5254f3, () => _0x5ad063(_0x4b5931["LIST_LIBRARY_ASSETS"]) ? _0x15c74b(_0x4b5931["LIST_LIBRARY_ASSETS"]) : null);
  const _0x13f4f3 = (_0x184141, _0x51e3aa) => {
    const _0x151d12 = a1289_0x2fb27f(_0x184141);
    if (typeof projectSession?.['commitWorkspaceProject'] !== "function") {
      return _0x151d12;
    }
    const _0x51be86 = projectSession["commitWorkspaceProject"](cloneJson(_0x151d12), {
      'reason': _0x51e3aa
    });
    return a1289_0x2fb27f({
      ..._0x51be86,
      'libraryProjects': _0x151d12["libraryProjects"],
      'libraryAssets': _0x151d12["libraryAssets"],
      'sourcePreviewRefs': _0x151d12["sourcePreviewRefs"],
      'persistenceState': _0x151d12["persistenceState"]
    });
  };
  const _0x25dce3 = _0x253445 => {
    _0x2547c2 = _0x13f4f3(_0x2547c2, _0x253445);
    if (_0x253445 === "image-prompt") {
      syncPersonReplacementImagePromptGate(_0x313f9e, _0x2547c2, _0x2106d9());
    }
    return cloneJson(_0x2547c2);
  };
  const _0x538898 = () => isPersonReplacementSourceProcessing(_0x2547c2);
  const _0x12c268 = (_0x46c6f7, _0x40a311 = 0x0) => {
    _0x15c74b(_0x4b5931['REPORT_STEP_NAVIGATION_BLOCKED'], {
      'reason': _0x46c6f7,
      'currentStep': _0x2547c2['workspace']['step'],
      'requestedStep': _0x40a311,
      'project': cloneJson(_0x2547c2)
    });
  };
  const _0x261635 = (_0x5e5580 = _0x2547c2) => {
    const _0x5b79ed = _0x5e5580?.["workspace"] || {};
    if (_0x5b79ed['view'] !== 'project') {
      return normalizeText(_0x5b79ed['view']) || "home";
    }
    const _0x45a8f1 = Math["trunc"](Number(_0x5b79ed['step']) || 0x1);
    return _0x45a8f1 === 0x1 ? "project:" + _0x45a8f1 + ":asset:" + (["character", 'scene', 'audio', "library"]['includes'](_0x5b79ed["characterAssetTab"]) ? _0x5b79ed['characterAssetTab'] : "character") : "project:" + _0x45a8f1;
  };
  const _0x254bf7 = (_0x2647cd = _0x2547c2) => (normalizeText(_0x2647cd?.['id']) || "draft") + '\x1f' + _0x261635(_0x2647cd);
  const _0x283c55 = (_0x469018, _0x219f65, {
    assetScope = "asset-content"
  } = {}) => {
    const _0x518062 = _0x469018?.['workspace'] || {};
    const _0x15e141 = _0x219f65?.["workspace"] || {};
    if (_0x518062["view"] !== 'project' || _0x15e141["view"] !== 'project') {
      return;
    }
    const _0xecc7b = Math["trunc"](Number(_0x518062["step"]) || 0x1);
    const _0x2ab6bb = Math["trunc"](Number(_0x15e141["step"]) || 0x1);
    if (_0xecc7b !== _0x2ab6bb) {
      _0x55da73 = _0x2ab6bb > _0xecc7b ? 'forward' : "backward";
      _0x33a455 = "page";
      return;
    }
    if (_0x2ab6bb !== 0x1) {
      return;
    }
    const _0x480419 = resolveWorkspaceTabTransitionDirection(_0x518062['characterAssetTab'], _0x15e141["characterAssetTab"], ["character", "scene", "audio", 'library']);
    if (_0x480419 === 'none') {
      return;
    }
    _0x55da73 = _0x480419;
    _0x33a455 = assetScope === "asset-list" ? 'asset-list' : 'asset-content';
  };
  const _0x22e315 = (_0x4d8925, _0x5cc28d = null, {
    inPlace = ![]
  } = {}) => {
    const _0x350dcf = _0x4d8925?.["project"] || _0x4d8925;
    if (_0x350dcf && typeof _0x350dcf === "object") {
      const _0x5d30e2 = _0x5cc28d ? {
        ..._0x350dcf,
        'workspace': {
          ...(_0x350dcf["workspace"] || {}),
          ..._0x5cc28d
        }
      } : _0x350dcf;
      inPlace ? _0x55f975["syncProjectState"](_0x5d30e2, {
        'returnSnapshot': ![]
      }) : _0x55f975["setProject"](_0x5d30e2);
    }
  };
  const _0x28d621 = (_0x5542f1, _0x5c587e, _0x321a34 = {}, {
    applyCallbackResult = !![],
    applyCallbackResultInPlace = ![]
  } = {}) => {
    const _0x2b3428 = _0x2547c2["workspace"]["view"] === 'home' ? {
      'projectSearchQuery': _0x2547c2["workspace"]['projectSearchQuery'],
      'projectSortOrder': _0x2547c2["workspace"]["projectSortOrder"],
      'showArchivedProjects': _0x2547c2['workspace']["showArchivedProjects"],
      'openProjectMenuId': '',
      'pendingDeleteProjectId': ''
    } : null;
    try {
      const _0x527942 = _0x5542f1(_0x5c587e, {
        'project': cloneJson(_0x2547c2),
        ..._0x321a34
      });
      if (_0x527942?.["then"]) {
        void _0x527942['then'](_0x5a6454 => {
          applyCallbackResult && _0x22e315(_0x5a6454, _0x2b3428, {
            'inPlace': applyCallbackResultInPlace
          });
        }, () => {});
      } else {
        applyCallbackResult && _0x22e315(_0x527942, _0x2b3428, {
          'inPlace': applyCallbackResultInPlace
        });
      }
      return _0x527942;
    } catch (_0x250557) {
      globalThis["queueMicrotask"]?.(() => {
        throw _0x250557;
      });
      return null;
    }
  };
  const _0x1aea64 = (_0xb7bd1e, _0x15037b, _0xe7362b = {}, _0x1dadbd = {}) => _0x28d621(_0x1b77c5(_0xb7bd1e), _0x15037b, _0xe7362b, _0x1dadbd);
  const _0x4c8f88 = (_0x141aa6, _0x5a1433 = '') => {
    const _0x43c803 = normalizeText(_0x141aa6?.["dataset"]?.["shotId"]);
    if (!_0x43c803) {
      return '';
    }
    const _0x43a61e = readPersonReplacementVideoPromptEditor(_0x141aa6);
    _0x2547c2 = a1289_0x2fb27f({
      ..._0x2547c2,
      'shots': _0x2547c2["shots"]['map'](_0x581af4 => _0x581af4['id'] === _0x43c803 ? {
        ..._0x581af4,
        'videoPrompt': _0x43a61e
      } : _0x581af4)
    });
    if (_0x5a1433) {
      _0x25dce3(_0x5a1433);
    }
    return _0x43a61e;
  };
  const _0x3291e5 = (_0x304f14, _0x3bda03, _0x2c04b3 = {}) => {
    if (!_0x304f14) {
      return;
    }
    insertPresetPromptIntoEditor({
      'storeApi': null,
      'promptEl': _0x304f14,
      'template': _0x3bda03,
      'allowedAssetTypes': ['text', "image", 'video', "audio"]
    });
    _0x4c8f88(_0x304f14, "video-prompt-preset");
    if (_0x2c04b3?.['insertPrompt'] === !![]) {
      return;
    }
    _0x1aea64(_0x4b5931["GENERATE_REPLACEMENT_VIDEO"], {
      'projectId': _0x2547c2['id'],
      'shotId': normalizeText(_0x304f14["dataset"]?.['shotId'])
    }, {}, {
      'applyCallbackResult': ![]
    });
  };
  const _0x1877c1 = (_0x45bdd4, _0x4e7661 = _0x2547c2['id']) => normalizeText(_0x4e7661) + '\x1f' + normalizeText(_0x45bdd4);
  const _0x8391a3 = (_0x1ef538, _0x373744) => {
    const _0x4ee9a0 = _0x1877c1(_0x1ef538);
    if (_0x43a678['has'](_0x4ee9a0)) {
      return null;
    }
    _0x43a678["add"](_0x4ee9a0);
    _0x3567fe();
    let _0x16edf0 = null;
    try {
      _0x16edf0 = _0x373744();
    } catch (_0x26ba04) {
      _0x43a678["delete"](_0x4ee9a0);
      _0x3567fe();
      windowObject?.['showToast']?.(_0x26ba04?.["message"] || "素材上传失败，请稍后重试。", "error");
      return null;
    }
    const _0x15c294 = () => {
      if (!_0x43a678['delete'](_0x4ee9a0)) {
        return;
      }
      _0x3567fe();
    };
    if (!_0x16edf0?.['then']) {
      _0x15c294();
      return _0x16edf0;
    }
    void Promise["resolve"](_0x16edf0)["catch"](_0x19a937 => {
      windowObject?.["showToast"]?.(_0x19a937?.["message"] || "素材上传失败，请稍后重试。", "error");
    })["finally"](_0x15c294);
    return _0x16edf0;
  };
  const _0x39fd0d = (_0x41cb4b, _0x10486f) => {
    const _0x101eec = _0x41cb4b?.["querySelector"]?.('[data-person-replacement-action=\x22toggle-library-add-targets\x22]');
    const _0x45e81f = _0x41cb4b?.["querySelector"]?.(".story-asset-batch-menu");
    if (!_0x41cb4b || !_0x101eec || !_0x45e81f) {
      return ![];
    }
    if (_0x10486f) {
      syncWorkspaceInlineMenuExpandedWidth(_0x45e81f);
    }
    _0x41cb4b["classList"]?.["toggle"]?.("is-open", _0x10486f);
    _0x101eec['setAttribute']?.("aria-expanded", String(_0x10486f));
    _0x45e81f["setAttribute"]?.('aria-hidden', String(!_0x10486f));
    return !![];
  };
  const _0x34e3ac = (_0x4b35fe = null) => {
    _0x313f9e?.['querySelectorAll']?.(".person-replacement-library-add-menu-wrap.is-open")?.["forEach"]?.(_0x245b6b => {
      if (_0x245b6b !== _0x4b35fe) {
        _0x39fd0d(_0x245b6b, ![]);
      }
    });
  };
  const _0x1f39e3 = (_0x11feaf, _0x2b3a04) => {
    const _0x269af7 = _0x11feaf?.["querySelector"]?.("[data-story-action=\"toggle-character-voice-menu\"]");
    const _0x42369c = _0x11feaf?.['querySelector']?.('.person-replacement-add-voice-menu');
    if (!_0x11feaf || !_0x269af7 || !_0x42369c) {
      return ![];
    }
    _0x11feaf["classList"]?.["toggle"]?.("is-open", _0x2b3a04);
    _0x269af7["setAttribute"]?.('aria-expanded', String(_0x2b3a04));
    _0x42369c["setAttribute"]?.('aria-hidden', String(!_0x2b3a04));
    return !![];
  };
  const _0x2b3919 = (_0xcfc911 = null) => {
    _0x313f9e?.['querySelectorAll']?.(".person-replacement-add-voice-menu-wrap.is-open")?.["forEach"]?.(_0x554bec => {
      if (_0x554bec !== _0xcfc911) {
        _0x1f39e3(_0x554bec, ![]);
      }
    });
  };
  const _0x5ad5fa = (_0x5a553c, _0x505fe0, _0x8ec289 = {}) => {
    const _0x4fc47a = _0x2547c2;
    _0x2547c2 = _0x13f4f3(_0x5a553c, _0x505fe0);
    const _0x10b40e = normalizeText(_0x505fe0);
    const _0x4b554e = ["character-voice-library-open", "character-voice-library-cancel", 'character-voice-library-confirm']["includes"](_0x10b40e) ? 'asset-list' : "asset-content";
    _0x283c55(_0x4fc47a, _0x2547c2, {
      'assetScope': _0x4b554e
    });
    if (!_0x53d4d4(_0x505fe0, _0x8ec289)) {
      _0x3567fe();
    }
    _0x491710?.['refresh']();
    return cloneJson(_0x2547c2);
  };
  const _0x171208 = ({
    detectionBox: _0xd253e8,
    label: _0x5e923f,
    sourceCharacterId: _0x1db893,
    orientation: _0x4d8535
  } = {}) => {
    const _0x22b92f = normalizeText(_0xd253e8?.["dataset"]?.["shotId"]);
    const _0x364a97 = normalizeText(_0xd253e8?.["dataset"]?.["personId"]);
    const _0x45d69c = _0x2547c2["shots"]["find"](_0x460f69 => _0x460f69['id'] === _0x22b92f);
    const _0x33b3e8 = _0x45d69c?.["people"]?.["find"](_0x2274f1 => _0x2274f1['id'] === _0x364a97);
    if (!_0x33b3e8) {
      return ![];
    }
    const _0x2f3347 = _0x5e923f === undefined ? normalizeText(_0x33b3e8['label']) : normalizeText(_0x5e923f);
    if (!_0x2f3347) {
      return ![];
    }
    const _0x10ef56 = normalizeText(_0x1db893, normalizeText(_0x33b3e8['sourceCharacterId']));
    const _0x3f025e = _0x4d8535 === undefined ? normalizeText(_0x33b3e8['orientation']) : normalizeText(_0x4d8535);
    const _0x325687 = a1289_0x29bd32(_0x22b92f, _0x364a97);
    const _0x438fa4 = {
      ..._0x2547c2["workspace"]['identityCorrectionDrafts']
    };
    delete _0x438fa4[_0x325687];
    const _0x43b278 = _0x2547c2["workspace"]["removedCustomPersonLabels"]["filter"](_0x212a11 => _0x212a11 !== _0x2f3347);
    _0x2547c2 = a1289_0x2fb27f({
      ..._0x2547c2,
      'workspace': {
        ..._0x2547c2['workspace'],
        'identityCorrectionDrafts': _0x438fa4,
        'removedCustomPersonLabels': _0x43b278
      }
    });
    _0x1aea64(_0x4b5931["CONFIRM_SOURCE_IDENTITY"], {
      'sourceCharacterId': _0x33b3e8["sourceCharacterId"],
      'targetSourceCharacterId': _0x10ef56,
      'shotId': _0x22b92f,
      'personId': _0x364a97,
      'label': _0x2f3347,
      'orientation': _0x3f025e,
      'silent': !![]
    });
    return !![];
  };
  const _0x50e570 = _0xef46d0 => {
    const _0x522265 = _0xef46d0 === "original" ? 'original' : "replacement";
    if (_0x522265 === "replacement") {
      const _0xa5b224 = buildPersonReplacementCompositePreviewSnapshot(_0x2547c2)['media'];
      if (!_0xa5b224["replacementAudioRef"]) {
        windowObject?.["showToast"]?.("请返回「声音克隆」，先生成语音并点击「合成」，完成后再选择替换音轨。", 'warn');
        return cloneJson(_0x2547c2);
      }
    }
    if (_0x522265 === _0x2547c2['audio']["previewTrack"] && _0x522265 === _0x2547c2["audio"]["exportTrack"]) {
      _0xd3e343["setTrack"](_0x522265);
      return cloneJson(_0x2547c2);
    }
    _0x2547c2 = a1289_0x2fb27f(transitionPersonReplacementOutput({
      ..._0x2547c2,
      'audio': {
        ..._0x2547c2['audio'],
        'previewTrack': _0x522265,
        'exportTrack': _0x522265
      }
    }, {
      'type': PERSON_REPLACEMENT_OUTPUT_TRANSITIONS["FINAL_MUX_INVALIDATE"]
    }));
    _0x313f9e?.["querySelectorAll"]?.("[data-person-replacement-action=\"set-preview-track\"]")?.['forEach']?.(_0xc2f1bd => {
      const _0x3b5458 = _0xc2f1bd['dataset']?.["previewTrack"] === _0x522265;
      _0xc2f1bd["classList"]?.["toggle"]?.("is-selected", _0x3b5458);
      _0xc2f1bd["setAttribute"]?.("aria-pressed", String(_0x3b5458));
    });
    _0xd3e343['setTrack'](_0x522265);
    _0x25dce3('preview-track');
    return cloneJson(_0x2547c2);
  };
  const _0x37793c = (_0x47585f = '') => {
    const _0x1d4f54 = _0x2547c2['shots']["find"](_0x10de52 => _0x10de52['id'] === normalizeText(_0x47585f || _0x2547c2['workspace']["selectedShotId"]));
    const _0x13dadc = _0x313f9e?.['querySelector']?.('[data-person-replacement-video-stage]');
    const _0x32af63 = _0x13dadc?.["querySelector"]?.("[data-person-replacement-video-player]");
    const _0x439edf = resolvePersonReplacementVideoSlotState(_0x2547c2, _0x1d4f54)["slotEntries"]["sourceVideo"]?.['url'];
    const _0x1b15b1 = normalizeMediaUrl(_0x439edf);
    if (!_0x1d4f54 || !_0x13dadc || !_0x32af63 || !_0x1b15b1) {
      windowObject?.['showToast']?.('当前视频片段尚未准备完成。', "warn");
      return ![];
    }
    if (isPersonReplacementVideoCropReverseRunning(_0x1d4f54)) {
      windowObject?.['showToast']?.("当前视频片段正在处理倒放，请稍后再裁剪。", 'info');
      return ![];
    }
    _0x32af63['pause']?.();
    const _0x207141 = Number(_0x32af63["duration"]) > 0x0 ? Number(_0x32af63['duration']) : Math['max'](0x0, Number(_0x1d4f54["durationSec"]) || 0x0);
    const _0x3bd489 = videoClipController?.["initForSource"]?.(createPersonReplacementVideoCropOptions({
      'projectId': _0x2547c2['id'],
      'selectedShot': _0x1d4f54,
      'stage': _0x13dadc,
      'videoEl': _0x32af63,
      'durationSec': _0x207141,
      'getProject': () => _0x2547c2,
      'acceptProject': _0x1a2ed1 => {
        const _0x146f27 = a1289_0x2fb27f(_0x1a2ed1);
        normalizeText(_0x146f27['id']) === normalizeText(_0x2547c2['id']) && (_0x2547c2 = _0x146f27);
        return _0x2547c2;
      },
      'requestReverseChange': _0x32fb57,
      'onConfirm': _0x5f599c => {
        _0x2e4219['setClipActive'](![]);
        _0x5ad5fa(applyPersonReplacementVideoCrop(_0x2547c2, {
          ..._0x5f599c,
          'shotId': _0x1d4f54['id']
        }), 'video-crop');
      },
      'onExit': ({
        reason: _0x52e928
      } = {}) => {
        _0x2e4219['setClipActive'](![]);
        if (["confirm", "silent"]["includes"](_0x52e928) || _0x4d9c06) {
          return;
        }
        if (!_0xdba29c()) {
          _0x3567fe();
        }
      }
    }));
    return _0x2e4219["setClipActive"](_0x3bd489 === !![]);
  };
  const _0xe4a51f = createPersonReplacementLayoutResizeController({
    'documentObject': documentObject,
    'windowObject': windowObject,
    'getProject': () => _0x2547c2,
    'commitLayoutChange': _0x4bca88 => {
      _0x2547c2 = a1289_0x2fb27f(_0x2547c2);
      _0x25dce3(_0x4bca88 === "asset-detail" ? 'asset-detail-split-ratio' : 'replacement-layout');
    }
  });
  const {
    begin: _0x4d9f1a,
    stop: _0x38c4a3
  } = _0xe4a51f;
  const _0x40f2a3 = () => {
    if (_0x4d9c06 || !_0xc321d6["isActive"]()) {
      return;
    }
    if (_0x2547c2["workspace"]["step"] !== 0x2 || !_0x131c7a()) {
      _0x3567fe();
    }
  };
  const _0x3e96f5 = (_0x4bbd31, _0x1f2006) => {
    const _0x525a7d = _0x1aea64(_0x4bbd31, _0x1f2006, {
      'renderWorkspace': ![]
    }, {
      'applyCallbackResultInPlace': !![]
    });
    if (_0x525a7d?.["then"]) {
      void _0x525a7d['then'](_0x40f2a3, () => {});
    } else {
      _0x40f2a3();
    }
  };
  const _0x512a4e = createPersonReplacementPersonBoxInteractionController({
    'getRoot': () => _0x313f9e,
    'getProject': () => _0x2547c2,
    'requestRender': _0x40f2a3,
    'runRequest': (..._0x194540) => _0x28d621(..._0x194540),
    'updateStageA11y': (..._0x359bad) => _0x3901a0(..._0x359bad),
    'onDeletePeopleRequested': _0x4d3682 => _0x3e96f5(_0x4b5931["DELETE_PEOPLE"], _0x4d3682),
    'onManualPersonSelected': _0x293a77 => _0x3e96f5(_0x4b5931["SELECT_MANUAL_PERSON"], _0x293a77),
    'onUpdatePeopleRequested': _0x194e06 => _0x1aea64(_0x4b5931["UPDATE_PEOPLE"], _0x194e06, {
      'renderWorkspace': ![]
    }, {
      'applyCallbackResultInPlace': !![]
    }),
    'documentObject': documentObject,
    'windowObject': windowObject
  });
  const {
    beginBoxEdit: _0x2342b6,
    beginManualSelection: _0x277ec4,
    bringBoxToFront: _0x27a85c,
    cancelManualSelection: _0x53d900,
    clearBatchSelection: _0xe62c16,
    clearKeyboardSelection: _0x55ecef,
    destroy: _0xbdeb4,
    focusBatchSelectionStage: _0x45cd21,
    handleEscape: _0x432e77,
    handleSelectionKeyDown: _0xa61439,
    isManualSelectionActive: _0x43126e,
    restoreLayerState: _0x4c2266,
    selectBatch: _0x5544c6,
    selectBox: _0x38134a,
    setManualSelectionActive: _0x358d58,
    syncAfterRender: _0x111f4e
  } = _0x512a4e;
  const _0x4fa679 = () => _0x2547c2["characters"]['find'](_0x1ea038 => _0x1ea038['id'] === _0x2547c2['workspace']['selectedCharacterId']) || null;
  const _0xee8fcb = (_0x3d5851 = _0x4fa679()) => {
    const _0x11ac6c = Math["trunc"](Number(_0x2547c2['workspace']["assetAppearanceIndexes"]?.[_0x3d5851?.['id']]) || 0x0);
    return getWorkspaceAssetAppearances(_0x3d5851)[_0x11ac6c] || getWorkspaceAssetAppearances(_0x3d5851)[0x0] || null;
  };
  const _0x40f6c8 = () => {
    const _0x1f63ca = _0x2547c2["workspace"]["characterAssetTab"];
    const _0x5b5a46 = _0x1f63ca === "scene" ? _0x2547c2["scenes"]["find"](_0x17db2a => _0x17db2a['id'] === _0x2547c2["workspace"]["selectedSceneId"]) : _0x1f63ca === "library" ? _0x2547c2['libraryAssets']["find"](_0x5e7332 => _0x5e7332['id'] === _0x2547c2["workspace"]['selectedLibraryAssetId']) : _0x4fa679();
    const _0x4a1e25 = _0x1f63ca === "library" ? _0x5b5a46 : _0xee8fcb(_0x5b5a46);
    const _0x3078f0 = normalizeText(_0x4a1e25?.["sourceUrl"] || _0x4a1e25?.['imageUrl'] || _0x4a1e25?.['thumbnailUrl']);
    if (!_0x5b5a46 || !_0x3078f0) {
      return null;
    }
    const _0x83e7c8 = normalizeText(_0x5b5a46["name"]) || "生成图片";
    const _0xc090e9 = normalizeText(_0x4a1e25?.["name"]);
    return {
      'imageRef': _0x3078f0,
      'filenameBase': _0xc090e9 && _0xc090e9 !== _0x83e7c8 && _0xc090e9 !== "基础形象" ? [_0x83e7c8, _0xc090e9]["join"]('-') : _0x83e7c8,
      'title': "下载图片"
    };
  };
  const {
    getSelectedReplacementImageDownloadRequest: _0x18e9bb,
    getSelectedReplacementVideoDownloadRequest: _0x4f1014,
    requestImageDownload: _0x4f052b,
    requestVideoDownload: _0x5bc89b
  } = createPersonReplacementResultMediaActions({
    'getProject': () => _0x2547c2,
    'runIntent': _0x1aea64,
    'downloadImageIntent': _0x4b5931['DOWNLOAD_IMAGE'],
    'downloadVideoIntent': _0x4b5931['DOWNLOAD_VIDEO']
  });
  const _0x5b73d1 = (_0x34035e, _0x2ae9c8 = "未命名人物") => String(_0x34035e ?? '')["replace"](/\s+/gu, '\x20')["trim"]() || _0x2ae9c8;
  const _0x29099d = _0x395ef8 => {
    const _0x472ec7 = normalizeText(_0x395ef8?.["dataset"]?.["storyAssetNameId"]);
    const _0xfbd661 = _0x2547c2["characters"]["find"](_0x55486f => _0x55486f['id'] === _0x472ec7);
    if (!_0x395ef8 || !_0xfbd661 || _0x395ef8['getAttribute']?.("contenteditable") === "true") {
      return ![];
    }
    _0x395ef8["dataset"]["storyAssetOriginalName"] = _0xfbd661["name"];
    _0x395ef8["setAttribute"]?.("contenteditable", 'true');
    _0x395ef8["setAttribute"]?.("role", "textbox");
    _0x395ef8["setAttribute"]?.("aria-label", '修改' + _0xfbd661['name'] + "的名称");
    _0x395ef8["classList"]?.["add"]?.('is-editing');
    _0x395ef8["focus"]?.();
    const _0x2cf2dc = windowObject?.["getSelection"]?.();
    const _0x56a0e6 = documentObject?.["createRange"]?.();
    _0x2cf2dc && _0x56a0e6 && (_0x56a0e6["selectNodeContents"]?.(_0x395ef8), _0x2cf2dc['removeAllRanges']?.(), _0x2cf2dc['addRange']?.(_0x56a0e6));
    return !![];
  };
  const _0x19608f = (_0x152ec3, {
    cancel = ![]
  } = {}) => {
    const _0x30c1da = normalizeText(_0x152ec3?.["dataset"]?.["storyAssetNameId"]);
    const _0x4eca7d = _0x2547c2["characters"]["find"](_0x3d30f8 => _0x3d30f8['id'] === _0x30c1da);
    if (!_0x152ec3 || !_0x4eca7d || _0x152ec3["getAttribute"]?.("contenteditable") !== 'true') {
      return ![];
    }
    const _0x7fd5a7 = _0x5b73d1(_0x152ec3["dataset"]["storyAssetOriginalName"], _0x4eca7d["name"]);
    const _0x70c158 = cancel ? _0x7fd5a7 : _0x5b73d1(_0x152ec3["textContent"], _0x7fd5a7);
    _0x2547c2 = a1289_0x2fb27f({
      ..._0x2547c2,
      'characters': _0x2547c2["characters"]['map'](_0x5b3ef5 => _0x5b3ef5['id'] === _0x30c1da ? {
        ..._0x5b3ef5,
        'name': _0x70c158
      } : _0x5b3ef5)
    });
    _0x313f9e?.["querySelectorAll"]?.("[data-story-asset-name-id]")?.["forEach"]?.(_0x5f0da1 => {
      if (normalizeText(_0x5f0da1["dataset"]["storyAssetNameId"]) !== _0x30c1da) {
        return;
      }
      _0x5f0da1["textContent"] = _0x70c158;
      _0x5f0da1["removeAttribute"]?.("contenteditable");
      _0x5f0da1["removeAttribute"]?.('role');
      _0x5f0da1["setAttribute"]?.('aria-label', "重命名" + _0x70c158);
      _0x5f0da1["classList"]?.['remove']?.('is-editing');
      delete _0x5f0da1["dataset"]["storyAssetOriginalName"];
    });
    if (!cancel && _0x70c158 !== _0x4eca7d['name']) {
      _0x25dce3('character-name');
    }
    return !![];
  };
  const _0x4ba83b = () => {
    _0x491710 ??= createPersonReplacementResultHistoryController({
      'getRoot': () => _0x313f9e,
      'getProject': () => _0x2547c2,
      'renderHistoryMenu': _0x1b90ee => personReplacementShotTimelinePresentation['renderHistoryMenu'](_0x1b90ee),
      'selectShot': (..._0x14ef30) => _0x8d81b4(..._0x14ef30),
      'isCutEditorOpen': () => _0x545ea6['isOpen']
    });
    _0x491710["refresh"]();
  };
  const _0x37c1e6 = () => _0x491710?.["hide"]();
  const _0x216ac0 = () => _0x491710?.["capture"]();
  const _0x2492ef = _0x3609a4 => _0x491710?.['restore'](_0x3609a4);
  const _0x28eb00 = createPersonReplacementVoiceCloneInteractionController({
    'getRoot': () => _0x313f9e,
    'getProject': () => _0x2547c2,
    'isDestroyed': () => _0x4d9c06,
    'commitProject': (_0x1ca0e9, {
      reason = "voice-clone",
      render: _0x2de735 = ![]
    } = {}) => {
      if (_0x2de735) {
        return _0x5ad5fa(_0x1ca0e9, reason);
      }
      _0x2547c2 = a1289_0x2fb27f(_0x1ca0e9);
      _0x25dce3(reason);
      return cloneJson(_0x2547c2);
    },
    'mountStudio': (..._0x2333e1) => _0x15c74b(_0x4b5931["MOUNT_VOICE_STUDIO"], ..._0x2333e1),
    'resumeVoiceSeparation': _0x585fc4 => _0x1aea64(_0x4b5931["RESUME_VOICE_EXTRACTION"], _0x585fc4, {}, {
      'applyCallbackResult': ![]
    }),
    'resolveCharacterVoiceUrl': getCharacterVoiceUrl,
    'documentObject': documentObject,
    'windowObject': windowObject
  });
  const {
    bindSourcePlayback: _0x4f2491,
    canDropOnAudioParam: _0x1c006,
    clearDropTarget: _0x4f9a7f,
    destroy: _0x3c89e5,
    destroySourcePlaybackBindings: _0x449fcf,
    mount: _0x41e9d5,
    playPreview: _0x1404b4,
    refreshSourceCards: _0xd86f32,
    resetDropEligibility: _0x40d755,
    selectSource: _0x557032,
    selectVoiceAsset: _0x52da3a,
    setDropTarget: _0x5d4667,
    stopPreview: _0x3195c4,
    syncPreviewUi: _0x267c9a,
    unmount: _0x15740b
  } = _0x28eb00;
  const _0x2a3e0c = () => {
    _0x3c5dc1["forEach"](_0x2f5220 => _0x2f5220?.["destroy"]?.());
    _0x3c5dc1 = [];
    const _0x151eac = createAudioPlaybackSurfaceController(_0x313f9e?.["querySelector"]?.(".person-replacement-audio-playback[data-audio-playback-surface], .person-replacement-voice-library-playback[data-audio-playback-surface]"), {
      'onBeforePlay': _0x3195c4,
      'onError': () => windowObject?.["showToast"]?.("声音素材播放失败。", "warn")
    });
    if (_0x151eac) {
      _0x3c5dc1["push"](_0x151eac);
    }
    _0x4f2491();
    let _0x243da1 = null;
    _0x555279 = null;
    const _0x5b13d5 = _0x313f9e?.['querySelector']?.('[data-aigen-image-model-selector]');
    if (_0x5b13d5) {
      const _0x559f79 = _0x2547c2["workspace"]["step"] === 0x1;
      const _0x28e9c4 = _0x559f79 ? _0x2547c2["settings"]["characterImageModelId"] : _0x2547c2['settings']["replacementImageModelId"];
      const _0x12b1c0 = _0x559f79 ? _0x2547c2["settings"]["characterImageGenerationParams"] : _0x2547c2["settings"]['replacementImageGenerationParams'];
      const _0x1e05ee = _0x559f79 ? _0x2547c2['settings']["characterImageProvider"] : _0x2547c2["settings"]["replacementImageProvider"];
      const _0x304d3f = _0x559f79 ? _0x2547c2['settings']['characterImageProviderProfileId'] : _0x2547c2['settings']["replacementImageProviderProfileId"];
      const _0x3c529e = _0x559f79 ? _0x2547c2['settings']["characterImageProviderProfileIdByModel"] : _0x2547c2['settings']["replacementImageProviderProfileIdByModel"];
      _0x3c5dc1['push'](bindAIGenImageModelSelector(_0x5b13d5, {
        'modelId': _0x28e9c4,
        'provider': resolveModelProvider(_0x28e9c4, _0x1e05ee),
        'generationParams': _0x12b1c0,
        'generationParamsByModel': _0x559f79 ? _0x2547c2["settings"]["characterImageGenerationParamsByModel"] : _0x2547c2["settings"]["replacementImageGenerationParamsByModel"],
        'providerProfileId': _0x304d3f,
        'providerProfileIdByModel': _0x3c529e,
        'showSchemaControls': !![],
        'documentObject': documentObject,
        'windowObject': windowObject,
        'floatingMenuHost': _0x313f9e,
        'schemaPopupPlacement': "portal-auto-up",
        'onChange': ({
          modelId: _0x47a5b6,
          provider: _0x19f7d3,
          generationParams: _0x3c1acf,
          generationParamsByModel: _0x2c78e9,
          providerProfileId: _0x321811,
          providerProfileIdByModel: _0x1cc961
        }) => {
          const _0x4169ed = {
            ..._0x2547c2["settings"]
          };
          _0x559f79 ? (_0x4169ed["characterImageModelId"] = _0x47a5b6, _0x4169ed["characterImageProvider"] = resolveModelProvider(_0x47a5b6, _0x19f7d3), _0x4169ed["characterImageGenerationParams"] = normalizeCharacterAssetImageGenerationParams(_0x47a5b6, _0x3c1acf), _0x4169ed["characterImageGenerationParamsByModel"] = _0x2c78e9, _0x4169ed["characterImageProviderProfileId"] = _0x321811, _0x4169ed['characterImageProviderProfileIdByModel'] = _0x1cc961) : (_0x4169ed['replacementImageModelId'] = _0x47a5b6, _0x4169ed['replacementImageProvider'] = resolveModelProvider(_0x47a5b6, _0x19f7d3), _0x4169ed["replacementImageGenerationParams"] = _0x3c1acf, _0x4169ed["replacementImageGenerationParamsByModel"] = _0x2c78e9, _0x4169ed["replacementImageProviderProfileId"] = _0x321811, _0x4169ed["replacementImageProviderProfileIdByModel"] = _0x1cc961);
          _0x2547c2 = a1289_0x2fb27f({
            ..._0x2547c2,
            'settings': _0x4169ed
          });
          _0x25dce3('image-model');
          if (!_0x559f79) {
            _0xe6442a();
          }
          _0x243da1?.["sync"]();
        }
      }));
    }
    const _0x3db31b = _0x313f9e?.['querySelector']?.("[data-aigen-video-model-selector]");
    if (_0x3db31b) {
      const _0x345be5 = personReplacementVideoPresentation["build"](_0x2547c2);
      const _0x35314b = resolvePersonReplacementVideoParameterPolicy({
        'modelId': _0x2547c2["settings"]["replacementModelId"],
        'inputMode': _0x2547c2['settings']['replacementVideoInputMode'],
        'generationParams': _0x2547c2["settings"]["replacementVideoGenerationParams"]
      });
      _0x555279 = bindAIGenVideoModelSelector(_0x3db31b, {
        'modelId': _0x2547c2['settings']["replacementModelId"],
        'provider': resolveModelProvider(_0x2547c2["settings"]['replacementModelId']),
        'generationParams': _0x35314b["generationParams"],
        'uiSchemaFieldState': _0x35314b["uiSchemaFieldState"],
        'providerProfileId': _0x2547c2["settings"]['replacementVideoProviderProfileId'],
        'providerProfileIdByModel': _0x2547c2["settings"]["replacementVideoProviderProfileIdByModel"],
        'referenceCounts': _0x345be5["slotState"]['referenceCounts'],
        'showSchemaControls': !![],
        'allowedModelIds': PERSON_REPLACEMENT_VIDEO_MODEL_IDS,
        'documentObject': documentObject,
        'windowObject': windowObject,
        'floatingMenuHost': _0x313f9e,
        'modelSubmenuPlacement': 'viewport-auto-up',
        'schemaPopupPlacement': "viewport-auto-up",
        'onChange': ({
          modelId: _0x1614ec,
          generationParams: _0x2e4703,
          providerProfileId: _0x32a236,
          providerProfileIdByModel: _0x53f021
        }) => {
          const _0x1c5b02 = resolvePersonReplacementVideoParameterPolicy({
            'modelId': _0x1614ec,
            'inputMode': _0x2547c2['settings']["replacementVideoInputMode"],
            'generationParams': _0x2e4703,
            'resetModeDefaults': _0x1614ec !== _0x2547c2["settings"]["replacementModelId"]
          });
          _0x2547c2 = a1289_0x2fb27f({
            ..._0x2547c2,
            'settings': {
              ..._0x2547c2['settings'],
              'replacementModelId': _0x1614ec,
              'replacementVideoGenerationParams': _0x1c5b02['generationParams'],
              'replacementVideoProviderProfileId': _0x32a236,
              'replacementVideoProviderProfileIdByModel': _0x53f021
            }
          });
          const _0x362573 = _0x313f9e?.['querySelector']?.('[data-person-replacement-video-reference-inputs]');
          if (_0x362573) {
            const _0x4ab2e1 = personReplacementIdentityPresentation["buildVideo"](_0x2547c2, personReplacementVideoPresentation["build"](_0x2547c2))["referenceInputsHtml"];
            const _0x2e8454 = typeof _0x362573["cloneNode"] === "function" ? _0x362573["cloneNode"](![]) : null;
            _0x2e8454 && (_0x2e8454["innerHTML"] = _0x4ab2e1);
            (!_0x2e8454 || !reconcilePersonReplacementReferenceInputs({
              'currentInputs': _0x362573,
              'nextInputs': _0x2e8454
            })) && (_0x362573["innerHTML"] = _0x4ab2e1);
          }
          _0x25dce3('video-model');
          _0x243da1?.["sync"]();
        }
      });
      _0x3c5dc1['push'](_0x555279);
    }
    const _0x4992f4 = _0x2547c2["workspace"]["step"] === 0x1 ? {
      'panel': _0x313f9e?.["querySelector"]?.('.story-asset-detail-panel\x20.story-asset-prompt-field'),
      'modelSetting': "characterImageModelId",
      'providerSetting': "characterImageProvider",
      'profileSetting': "characterImageProviderProfileId",
      'memorySetting': "characterImageProviderProfileIdByModel"
    } : _0x2547c2["workspace"]["step"] === 0x2 ? {
      'panel': _0x313f9e?.["querySelector"]?.('.person-replacement-image-generation-panel\x20.person-replacement-prompt-input-wrapper'),
      'modelSetting': "replacementImageModelId",
      'providerSetting': "replacementImageProvider",
      'profileSetting': 'replacementImageProviderProfileId',
      'memorySetting': "replacementImageProviderProfileIdByModel"
    } : _0x2547c2["workspace"]["step"] === 0x3 ? {
      'panel': _0x313f9e?.['querySelector']?.('.person-replacement-video-generation-panel\x20.person-replacement-prompt-input-wrapper'),
      'modelSetting': "replacementModelId",
      'providerSetting': '',
      'profileSetting': "replacementVideoProviderProfileId",
      'memorySetting': "replacementVideoProviderProfileIdByModel"
    } : null;
    _0x4992f4?.["panel"] && (_0x243da1 = createModelProviderProfileControl({
      'panel': _0x4992f4["panel"],
      'getNodeData': () => ({
        'model': _0x2547c2["settings"][_0x4992f4["modelSetting"]],
        'provider': _0x4992f4["providerSetting"] ? _0x2547c2["settings"][_0x4992f4["providerSetting"]] : resolveModelProvider(_0x2547c2['settings'][_0x4992f4["modelSetting"]]),
        'providerProfileId': _0x2547c2["settings"][_0x4992f4['profileSetting']],
        'providerProfileIdByModel': _0x2547c2["settings"][_0x4992f4["memorySetting"]]
      }),
      'onChange': _0x42b10a => {
        if (_0x4992f4["profileSetting"] === "replacementVideoProviderProfileId" && _0x555279?.["applyProviderProfilePatch"]?.(_0x42b10a)) {
          return;
        }
        _0x2547c2 = a1289_0x2fb27f({
          ..._0x2547c2,
          'settings': {
            ..._0x2547c2['settings'],
            [_0x4992f4["profileSetting"]]: _0x42b10a["providerProfileId"],
            [_0x4992f4['memorySetting']]: _0x42b10a['providerProfileIdByModel']
          }
        });
        _0x25dce3('provider-profile');
        _0x243da1?.['sync']();
      }
    }), _0x3c5dc1["push"]({
      'destroy': () => _0x243da1?.['remove']()
    }));
  };
  const _0x56195f = _0x38da33 => {
    const _0x3da4ff = personReplacementImagePresentation["build"](_0x2547c2)["selectedShot"];
    if (!_0x38da33 || !_0x3da4ff) {
      return null;
    }
    const _0x130034 = normalizeText(_0x2547c2['id']);
    const _0x70971c = normalizeText(_0x3da4ff['id']);
    const _0x2c2af0 = () => normalizeText(_0x2547c2['id']) === _0x130034 ? _0x2547c2["shots"]["find"](_0x10b2a3 => normalizeText(_0x10b2a3['id']) === _0x70971c) : null;
    return {
      'nodeId': 'person-replacement-image:' + _0x70971c,
      'promptEl': _0x38da33,
      'keepAssetMentionPills': !![],
      '_data': {
        'type': "ai-image",
        'model': _0x2547c2["settings"]["replacementImageModelId"],
        'provider': resolveModelProvider(_0x2547c2["settings"]['replacementImageModelId'], _0x2547c2["settings"]["replacementImageProvider"])
      },
      'getMentionMenuPages': () => [{
        'id': "assets",
        'label': '素材',
        'icon': "assets"
      }],
      'getMentionMenuDefaultPage': () => "assets",
      'getMentionCandidates': ({
        query = ''
      } = {}) => buildPersonReplacementPromptMentionCandidates(_0x2547c2, {
        'query': query,
        'shot': _0x2c2af0()
      }),
      'getMentionVisual': ({
        mention: _0x850a75,
        pill: _0xfb239e
      } = {}) => {
        const _0x305508 = _0x850a75?.['thumbUrl'] ? _0x850a75 : resolvePersonReplacementPromptMentionRef(_0xfb239e, {
          'project': _0x2547c2,
          'shot': _0x2c2af0()
        });
        return {
          'thumbUrl': normalizeMediaUrl(_0x305508?.['thumbUrl'] || _0x305508?.["url"]),
          'iconType': "image"
        };
      },
      'commitPromptHtml': _0x141492 => {
        if (!_0x2c2af0()) {
          return;
        }
        _0x2547c2 = a1289_0x2fb27f({
          ..._0x2547c2,
          'shots': _0x2547c2['shots']['map'](_0x23c4ac => normalizeText(_0x23c4ac['id']) === _0x70971c ? {
            ..._0x23c4ac,
            'imagePrompt': sanitizePromptHtmlForCommit(_0x141492)
          } : _0x23c4ac)
        });
        _0x25dce3("image-prompt");
      },
      'getPromptHtml': () => normalizeText(_0x2c2af0()?.["imagePrompt"])
    };
  };
  const _0x31240a = () => {
    _0x474de2?.();
    _0x474de2 = null;
    if (_0x2547c2["workspace"]["view"] !== "project" || _0x2547c2["workspace"]["step"] !== 0x2) {
      return;
    }
    const _0x20e1b1 = _0x313f9e?.["querySelector"]?.("[data-person-replacement-field=\"image-prompt\"][contenteditable=\"true\"]");
    const _0x511fbe = _0x56195f(_0x20e1b1);
    if (!_0x511fbe) {
      return;
    }
    const _0x5ec6e8 = bindPromptMentionHost(_0x511fbe);
    _0x474de2 = () => _0x5ec6e8?.["destroy"]?.();
  };
  const _0x86c4ac = () => {
    _0x2e818c?.();
    _0x2e818c = null;
    if (_0x2547c2["workspace"]['view'] !== "project" || _0x2547c2['workspace']["step"] !== 0x2) {
      return;
    }
    const _0x6ccbb4 = _0x313f9e?.["querySelector"]?.(".person-replacement-middle-preview-slide:not(.person-replacement-middle-preview-slide--outgoing) [data-person-replacement-keyframe-stage] > img") || _0x313f9e?.["querySelector"]?.("[data-person-replacement-keyframe-stage] > img");
    if (!_0x6ccbb4) {
      return;
    }
    const _0x5bfdaf = () => syncPersonReplacementImageStageFrame(_0x6ccbb4);
    if (_0x6ccbb4['complete'] && Number(_0x6ccbb4["naturalWidth"]) > 0x0) {
      _0x5bfdaf();
    } else {
      _0x6ccbb4["addEventListener"]?.("load", _0x5bfdaf, {
        'once': !![]
      });
    }
    const _0x36e08f = _0x6ccbb4['closest']?.('[data-person-replacement-keyframe-stage]')?.["parentElement"];
    const _0x5c87df = windowObject?.["ResizeObserver"];
    const _0x43a921 = typeof _0x5c87df === "function" ? new _0x5c87df(_0x5bfdaf) : null;
    _0x43a921?.["observe"]?.(_0x36e08f);
    windowObject?.["addEventListener"]?.("resize", _0x5bfdaf);
    _0x2e818c = () => {
      _0x6ccbb4["removeEventListener"]?.("load", _0x5bfdaf);
      _0x43a921?.["disconnect"]?.();
      windowObject?.["removeEventListener"]?.("resize", _0x5bfdaf);
    };
  };
  const _0x5c3508 = createPersonReplacementBatchGenerationController({
    'getProject': () => _0x2547c2,
    'buildImagePresentation': _0x1473dc => personReplacementImagePresentation["build"](_0x1473dc),
    'getCharacterAppearance': getCharacterAppearance,
    'runRequest': (..._0xb367ae) => _0x28d621(..._0xb367ae),
    'requestRender': () => _0x3567fe(),
    'refreshShotSelectionControls': () => _0xe6442a(),
    'resolveCharacterImageBatchConcurrency': _0x1b77c5(_0x4b5931['RESOLVE_CHARACTER_IMAGE_BATCH_CONCURRENCY']),
    'onGenerateReplacementImageRequested': _0x1b77c5(_0x4b5931['GENERATE_REPLACEMENT_IMAGE']),
    'onCancelReplacementImageRequested': _0x1b77c5(_0x4b5931['CANCEL_REPLACEMENT_IMAGE']),
    'onGenerateReplacementVideoRequested': _0x1b77c5(_0x4b5931["GENERATE_REPLACEMENT_VIDEO"]),
    'onCancelReplacementVideoRequested': _0x1b77c5(_0x4b5931["CANCEL_REPLACEMENT_VIDEO"]),
    'onGenerateCharacterImageRequested': _0x1b77c5(_0x4b5931["GENERATE_CHARACTER_IMAGE"]),
    'onGenerationBatchCompleted': _0x1b77c5(_0x4b5931["COMPLETE_GENERATION_BATCH"]),
    'windowObject': windowObject
  });
  const {
    cancelAssetBatch: _0x51f811,
    cancelShotBatch: _0x35aaa5,
    destroy: _0x1f62fa,
    getAssetRenderState: _0x23203d,
    getShotRenderState: _0x352c22,
    isShotBatchForCurrentProject: _0xd2f99d,
    runAssetBatch: _0x3143b0,
    runShotBatch: _0x54261d
  } = _0x5c3508;
  const _0x2106d9 = () => {
    const _0x54782 = _0x352c22();
    const _0x1cc224 = _0x23203d();
    return _0x155aa0['getWorkspacePresentation']({
      'shotBatchGenerationActive': _0x54782["active"],
      'shotBatchGenerationLabel': _0x54782['label'],
      'shotBatchGeneratingShotIds': _0x54782['generatingShotIds'],
      'shotBatchCancelRequested': _0x54782["cancelRequested"],
      'assetBatchGenerationActive': _0x1cc224["active"],
      'assetBatchGenerationLabel': _0x1cc224['label'],
      'assetBatchGeneratingCharacterIds': _0x1cc224["generatingCharacterIds"],
      'assetBatchCancelRequested': _0x1cc224["cancelRequested"],
      'canvasSyncPending': _0x200819,
      'canvasSyncScope': _0xfdff29,
      'composeOutputPending': _0x28c81f,
      'exportOutputPending': _0x480d58,
      'canvasSyncOverlayInline': ![],
      'assetLibraryDisclosure': _0x7b425c,
      'assetUploadPendingKinds': ["character", "scene", "audio"]["filter"](_0x378c12 => _0x43a678["has"](_0x1877c1(_0x378c12))),
      'voiceLibraryTargetCharacterId': _0x2281fc,
      'promptEnhancementModel': _0x15c74b(_0x4b5931["GET_PROMPT_ENHANCEMENT_MODEL"]) || {}
    });
  };
  const _0x469440 = () => {
    const _0x450a1f = _0x313f9e?.["querySelector"]?.("#person-replacement-shot-cut-smart-detect-panel");
    if (!_0x450a1f?.["style"]) {
      return ![];
    }
    const _0x6b656 = Number(windowObject?.["innerWidth"] || documentObject?.["documentElement"]?.["clientWidth"]) || 0x0;
    if (_0x6b656 <= 0x2d0) {
      ["top", "right", "bottom", 'left']['forEach'](_0x3588ce => {
        _0x450a1f["style"]['removeProperty']?.(_0x3588ce);
      });
      return !![];
    }
    const _0x33ad22 = _0x313f9e?.["querySelector"]?.("[data-person-replacement-action=\"toggle-shot-cut-smart-detect\"]");
    const _0x530239 = _0x33ad22?.['getBoundingClientRect']?.();
    const _0x795860 = _0x450a1f["getBoundingClientRect"]?.();
    if (!_0x530239 || !_0x795860) {
      return ![];
    }
    const _0x2c0a41 = Number(windowObject?.["innerHeight"] || documentObject?.["documentElement"]?.["clientHeight"]) || 0x0;
    const _0x5b4142 = 0x10;
    const _0x30a283 = 0x8;
    const _0x4f8c88 = Math["max"](_0x5b4142, Math["min"](_0x6b656 - _0x795860["width"] - _0x5b4142, _0x530239["right"] - _0x795860["width"]));
    const _0x1842de = _0x530239["bottom"] + _0x30a283;
    const _0x42987f = _0x1842de + _0x795860["height"] <= _0x2c0a41 - _0x5b4142 ? _0x1842de : Math["max"](_0x5b4142, _0x530239['top'] - _0x795860['height'] - _0x30a283);
    _0x450a1f["style"]["setProperty"]?.("top", _0x42987f + 'px');
    _0x450a1f["style"]["setProperty"]?.("right", "auto");
    _0x450a1f["style"]["setProperty"]?.("bottom", 'auto');
    _0x450a1f["style"]['setProperty']?.("left", _0x4f8c88 + 'px');
    return !![];
  };
  const _0x21abb0 = () => {
    if (_0x545ea6["isSmartDetectOpen"]) {
      _0x469440();
    }
  };
  const _0x4f4afb = _0x353885 => {
    const _0x13b72c = documentObject?.['createElement']?.("div");
    if (!_0x13b72c) {
      return null;
    }
    _0x13b72c["innerHTML"] = String(_0x353885 || '')["trim"]();
    return _0x13b72c["firstElementChild"];
  };
  const _0x439074 = () => {
    const _0x440e3d = _0x313f9e?.["querySelector"]?.("[data-person-replacement-compare-card=\"replacement\"] .person-replacement-compare-media-frame");
    if (!_0x440e3d) {
      return ![];
    }
    _0x440e3d['classList']?.["toggle"]?.('img-preview-loading', _0x28c81f);
    _0x440e3d["setAttribute"]?.("aria-busy", String(_0x28c81f));
    if (_0x28c81f) {
      _0x440e3d['setAttribute']?.("inert", '');
    } else {
      _0x440e3d["removeAttribute"]?.("inert");
    }
    const _0x50d2a9 = _0x440e3d["querySelector"]?.('.story-asset-loading-overlay');
    if (_0x28c81f && !_0x50d2a9) {
      const _0x34ef77 = _0x4f4afb(renderWorkspaceAssetLoadingOverlay({
        'title': "视频合成中",
        'description': '正在合成替换片段，完成后会自动显示完整视频。'
      }));
      if (_0x34ef77) {
        _0x440e3d["appendChild"]?.(_0x34ef77);
      }
    } else {
      !_0x28c81f && _0x50d2a9?.["remove"]?.();
    }
    return !![];
  };
  const _0x3c39c1 = (_0x71e028, _0x28c1bb) => {
    if (!_0x71e028) {
      return;
    }
    try {
      _0x71e028["inert"] = _0x28c1bb;
    } catch {
      if (_0x28c1bb) {
        _0x71e028['setAttribute']?.("inert", '');
      } else {
        _0x71e028["removeAttribute"]?.("inert");
      }
    }
    if (_0x28c1bb) {
      _0x71e028["setAttribute"]?.("inert", '');
    } else {
      _0x71e028["removeAttribute"]?.("inert");
    }
  };
  const _0x19ba31 = ({
    restoreFocus = !![]
  } = {}) => {
    _0x5ad7c8['forEach']((_0x15224a, _0x2d7bcc) => {
      _0x3c39c1(_0x2d7bcc, _0x15224a);
    });
    _0x5ad7c8['clear']();
    _0x5667ff?.["remove"]?.();
    _0x5667ff = null;
    documentObject?.['body']?.["classList"]?.["remove"]?.("person-replacement-canvas-sync-active");
    _0x313f9e?.["classList"]?.["remove"]?.("is-canvas-sync-pending");
    _0x313f9e?.["setAttribute"]?.("aria-busy", 'false');
    if (restoreFocus && _0x313f9e?.["hidden"] === ![] && _0x1a0af6 && _0x1a0af6["isConnected"] !== ![] && typeof _0x1a0af6["focus"] === 'function') {
      try {
        _0x1a0af6["focus"]({
          'preventScroll': !![]
        });
      } catch {
        _0x1a0af6["focus"]();
      }
    }
    _0x1a0af6 = null;
  };
  const _0x2b4d89 = ({
    captureFocus = ![]
  } = {}) => {
    if (!_0x200819) {
      _0x19ba31();
      return;
    }
    const _0x13aa39 = documentObject?.["body"];
    if (!_0x13aa39) {
      return;
    }
    if (captureFocus) {
      const _0x5cf1cd = documentObject?.["activeElement"];
      _0x1a0af6 = _0x313f9e?.["contains"]?.(_0x5cf1cd) ? _0x5cf1cd : null;
    }
    if (!_0x5667ff) {
      _0x5667ff = _0x4f4afb(personReplacementShellPresentation["renderCanvasSyncLoadingOverlay"]({
        'canvasSyncPending': !![]
      }));
      if (_0x5667ff) {
        _0x13aa39["appendChild"]?.(_0x5667ff);
      }
    }
    Array["from"](_0x13aa39["children"] || [])["forEach"](_0x29cd3f => {
      if (_0x29cd3f === _0x5667ff) {
        return;
      }
      !_0x5ad7c8["has"](_0x29cd3f) && _0x5ad7c8["set"](_0x29cd3f, Boolean(_0x29cd3f?.["inert"] || _0x29cd3f?.["hasAttribute"]?.("inert")));
      _0x3c39c1(_0x29cd3f, !![]);
    });
    documentObject["body"]?.["classList"]?.["add"]?.('person-replacement-canvas-sync-active');
    _0x313f9e?.["classList"]?.['add']?.('is-canvas-sync-pending');
    _0x313f9e?.["setAttribute"]?.("aria-busy", 'true');
    try {
      _0x5667ff?.["focus"]?.({
        'preventScroll': !![]
      });
    } catch {
      _0x5667ff?.['focus']?.();
    }
  };
  const _0x103db8 = () => "[data-person-replacement-shot-timeline-scroll]";
  const _0x539d94 = (_0x3f67f2, _0x1872a9) => {
    const _0x127b97 = new Map(Array['from'](_0x1872a9?.["querySelectorAll"]?.("[data-person-replacement-shot-card=\"true\"]") || [])['map'](_0x1d8fcd => [normalizeText(_0x1d8fcd["dataset"]?.["shotId"]), _0x1d8fcd]));
    Array['from'](_0x3f67f2?.["querySelectorAll"]?.("[data-person-replacement-shot-card=\"true\"]") || [])["forEach"](_0x3b5fdf => {
      const _0x1c1568 = _0x127b97["get"](normalizeText(_0x3b5fdf["dataset"]?.["shotId"]));
      if (!_0x1c1568) {
        return;
      }
      _0x3b5fdf["className"] = _0x1c1568["className"];
      ["aria-current", "aria-pressed"]['forEach'](_0x2535f2 => {
        const _0x49f297 = _0x1c1568['getAttribute']?.(_0x2535f2);
        if (_0x49f297 == null) {
          _0x3b5fdf["removeAttribute"]?.(_0x2535f2);
        } else {
          _0x3b5fdf["setAttribute"]?.(_0x2535f2, _0x49f297);
        }
      });
    });
  };
  const _0x2d2a81 = _0x215ca6 => {
    const _0x339b3d = normalizeText(_0x2547c2["workspace"]['selectedShotId']);
    Array['from'](_0x215ca6?.["querySelectorAll"]?.("[data-person-replacement-shot-card=\"true\"]") || [])["forEach"](_0x1cbb90 => {
      const _0x17c52e = normalizeText(_0x1cbb90["dataset"]?.["shotId"]) === _0x339b3d;
      _0x1cbb90["classList"]?.["toggle"]?.("is-selected", _0x17c52e);
      _0x1cbb90["setAttribute"]?.('aria-current', String(_0x17c52e));
    });
  };
  const _0x4c4c18 = () => {
    _0x457764();
    _0x1682cd();
    _0x3c5dc1["forEach"](_0x10c1f0 => _0x10c1f0?.["destroy"]?.());
    _0x3c5dc1 = [];
    _0x449fcf();
    _0x474de2?.();
    _0x474de2 = null;
    _0x2e818c?.();
    _0x2e818c = null;
  };
  const _0x1f31f8 = () => {
    const _0x2c309a = _0x2547c2["workspace"]["step"] === 0x2 && !_0x545ea6["isOpen"];
    _0x111f4e({
      'manualSelectionSurfaceActive': _0x2c309a
    });
  };
  const _0x3fa3b8 = _0x2af816 => {
    const _0x201047 = Number(_0x2af816?.["scrollLeft"]) || 0x0;
    const _0x33a54a = Number(_0x2af816?.["scrollTop"]) || 0x0;
    const _0x2f5fb5 = _0x2af816?.["style"]?.["overflowAnchor"] || '';
    _0x2af816?.["style"]?.["setProperty"]?.("overflow-anchor", "none");
    const _0x3f574b = () => {
      if (!_0x2af816) {
        return;
      }
      _0x2af816["scrollLeft"] = _0x201047;
      _0x2af816['scrollTop'] = _0x33a54a;
    };
    return () => {
      _0x3f574b();
      const _0x36d70c = () => {
        _0x3f574b();
        _0x2f5fb5 ? _0x2af816?.["style"]?.["setProperty"]?.("overflow-anchor", _0x2f5fb5) : _0x2af816?.['style']?.["removeProperty"]?.("overflow-anchor");
      };
      typeof windowObject?.['requestAnimationFrame'] === "function" ? windowObject['requestAnimationFrame'](_0x36d70c) : _0x36d70c();
    };
  };
  const _0x1b5dae = (_0x414253, _0x2e676c = _0x2547c2['workspace']["selectedShotId"]) => {
    const _0x552e15 = _0x352c22();
    const _0x3f8608 = _0x4f4afb(personReplacementShotTimelinePresentation['renderTimeline'](_0x2547c2, {
      'allowCutEditing': !![],
      'mode': "image",
      'isBatchGenerating': _0x552e15['active'],
      'batchGenerationLabel': _0x552e15['label'],
      'batchGeneratingShotIds': _0x552e15["generatingShotIds"],
      'batchCancelRequested': _0x552e15['cancelRequested']
    }));
    const _0x4c2076 = _0x3f8608?.["querySelector"]?.("[data-person-replacement-shot-timeline-scroll]");
    if (!_0x414253 || !_0x4c2076) {
      return ![];
    }
    const _0x5f088a = _0x3fa3b8(_0x414253);
    const _0x2df3ba = reconcilePersonReplacementShotTimelineCard({
      'currentScroller': _0x414253,
      'nextScroller': _0x4c2076,
      'shotId': _0x2e676c
    });
    if (!_0x2df3ba) {
      _0x5f088a();
      return ![];
    }
    _0x2d2a81(_0x414253);
    _0x5f088a();
    return !![];
  };
  const _0xe6442a = () => {
    if (_0x2547c2['workspace']["view"] !== "project" || ![0x2, 0x3]['includes'](_0x2547c2["workspace"]['step']) || _0x545ea6["isOpen"]) {
      return ![];
    }
    const _0x36538b = _0x2547c2["workspace"]["step"] === 0x3;
    const _0x464ffb = _0x352c22();
    syncPersonReplacementPromptModeControl(_0x313f9e, _0x2547c2, _0x464ffb["generatingShotIds"]);
    const _0x3113ec = _0x313f9e?.['querySelector']?.(".person-replacement-shot-timeline");
    const _0x2d9c18 = _0x4f4afb(personReplacementShotTimelinePresentation["renderTimeline"](_0x2547c2, {
      'allowCutEditing': !_0x36538b,
      'mode': _0x36538b ? 'video' : "image",
      'isBatchGenerating': _0x464ffb["active"],
      'batchGenerationLabel': _0x464ffb["label"],
      'batchGeneratingShotIds': _0x464ffb["generatingShotIds"],
      'batchCancelRequested': _0x464ffb["cancelRequested"]
    }));
    const _0x36a440 = _0x3113ec?.['querySelector']?.("[data-person-replacement-shot-timeline-scroll]");
    const _0x1ba278 = _0x2d9c18?.['querySelector']?.("[data-person-replacement-shot-timeline-scroll]");
    const _0x3d87af = _0x313f9e?.["querySelector"]?.(_0x36538b ? '[data-person-replacement-action=\x22generate-replacement-video\x22]' : "[data-person-replacement-action=\"generate-replacement-image\"]");
    const _0x5268b9 = _0x2106d9();
    const _0x146c71 = _0x36538b ? personReplacementVideoPresentation["build"](_0x2547c2) : personReplacementImagePresentation["build"](_0x2547c2, _0x5268b9["shotBatchGeneratingShotIds"]);
    const _0x27e5ab = _0x4f4afb(_0x36538b ? personReplacementVideoPresentation["renderGenerateButton"](_0x2547c2, {
      'presentation': _0x146c71,
      ..._0x5268b9
    }) : personReplacementImagePresentation['renderGenerateButton'](_0x2547c2, {
      'presentation': _0x146c71,
      ..._0x5268b9
    }));
    if (!_0x3113ec || !_0x2d9c18 || !_0x36a440 || !_0x1ba278 || !_0x3d87af || !_0x27e5ab || typeof _0x3113ec["replaceWith"] !== "function" || typeof _0x3d87af["replaceWith"] !== "function") {
      return ![];
    }
    const _0xc640e0 = _0x3fa3b8(_0x36a440);
    if (!reconcilePersonReplacementShotCardList({
      'currentList': _0x36a440,
      'nextList': _0x1ba278
    })) {
      _0xc640e0();
      return ![];
    }
    reconcileElementTree(_0x3113ec, _0x2d9c18, {
      'preserveChildNodes': !![],
      'preserveSelector': "[data-person-replacement-shot-timeline-scroll]"
    });
    reconcileElementTree(_0x3d87af, _0x27e5ab, {
      'preserveChildNodes': !![]
    });
    _0xc640e0();
    _0x491710?.["refresh"]();
    return !![];
  };
  const _0x41e6ad = () => {
    if (_0x2547c2["workspace"]["view"] !== "project" || _0x2547c2["workspace"]['step'] !== 0x5 || _0x545ea6["isOpen"]) {
      return ![];
    }
    const _0x15ff28 = _0x313f9e?.["querySelector"]?.('.person-replacement-preview-shot-rail');
    const _0x2fb356 = _0x4f4afb(personReplacementCompositePreviewPresentation["renderRail"](buildPersonReplacementCompositePreviewSnapshot(_0x2547c2)));
    const _0xd062a9 = _0x313f9e?.['querySelector']?.(".person-replacement-preview-actions--toolbar");
    const _0x111750 = _0x4f4afb(personReplacementShellPresentation["renderToolbarActions"](_0x2547c2, _0x2106d9()));
    const _0x3290a9 = _0x15ff28?.["querySelector"]?.(".person-replacement-preview-shot-list");
    const _0x2dc15d = _0x2fb356?.["querySelector"]?.(".person-replacement-preview-shot-list");
    if (!_0x15ff28 || !_0x2fb356 || !_0xd062a9 || !_0x111750 || typeof _0x15ff28['replaceWith'] !== "function" || typeof _0xd062a9['replaceWith'] !== "function") {
      return ![];
    }
    const _0x1dd5de = _0x3290a9 && _0x2dc15d ? _0x3fa3b8(_0x3290a9) : null;
    if (_0x3290a9 && _0x2dc15d) {
      if (!reconcilePersonReplacementShotCardList({
        'currentList': _0x3290a9,
        'nextList': _0x2dc15d
      })) {
        _0x1dd5de?.();
        return ![];
      }
      _0x2dc15d["replaceWith"](_0x3290a9);
    }
    _0x15ff28["replaceWith"](_0x2fb356);
    _0xd062a9["replaceWith"](_0x111750);
    _0x1dd5de?.();
    return !![];
  };
  const _0x3175d8 = () => {
    if (_0x2547c2["workspace"]["view"] !== "project" || _0x2547c2["workspace"]["step"] !== 0x5 || _0x545ea6['isOpen']) {
      return ![];
    }
    const _0x5008c2 = _0x313f9e?.["querySelector"]?.('[data-person-replacement-composite-preview]');
    const _0x4772ce = _0x4f4afb(renderCompositePreview(_0x2547c2, _0x2106d9()));
    const _0x528d4f = _0x5008c2?.['querySelector']?.(".person-replacement-preview-shot-list");
    const _0x20ef81 = _0x4772ce?.["querySelector"]?.(".person-replacement-preview-shot-list");
    if (!_0x5008c2 || !_0x4772ce || !_0x528d4f || !_0x20ef81 || typeof _0x5008c2["replaceWith"] !== "function" || typeof _0x20ef81["replaceWith"] !== "function") {
      return ![];
    }
    const _0x545094 = _0x3fa3b8(_0x528d4f);
    if (!reconcilePersonReplacementShotCardList({
      'currentList': _0x528d4f,
      'nextList': _0x20ef81
    })) {
      _0x545094();
      return ![];
    }
    _0x20ef81["replaceWith"](_0x528d4f);
    _0x457764();
    _0x55111a();
    _0x30afb2();
    _0x5008c2["replaceWith"](_0x4772ce);
    _0x545094();
    _0x4a5835();
    return !![];
  };
  const _0x131c7a = ({
    refreshTimelineCard = ![],
    timelineShotId = _0x2547c2["workspace"]["selectedShotId"]
  } = {}) => {
    if (_0x2547c2["workspace"]["view"] !== "project" || ![0x2, 0x3]["includes"](_0x2547c2["workspace"]["step"]) || _0x545ea6["isOpen"]) {
      return ![];
    }
    const _0x4bde01 = _0x313f9e?.['querySelector']?.(".person-replacement-production-page");
    const _0x2e5bdd = _0x2547c2["workspace"]['step'] === 0x3;
    const _0xcfd71b = _0x2106d9();
    const _0x252b6d = _0x4f4afb(_0x2e5bdd ? personReplacementVideoPresentation["render"](_0x2547c2, _0xcfd71b) : personReplacementImagePresentation["render"](_0x2547c2, {
      ..._0xcfd71b,
      'omitShotTimeline': !![]
    }));
    const _0x101eee = _0x103db8();
    const _0x48d030 = _0x4bde01?.["querySelector"]?.(_0x101eee);
    const _0x486b0d = _0x252b6d?.["querySelector"]?.(_0x101eee);
    const _0x14566f = _0x4bde01?.['querySelector']?.('.person-replacement-middle-layout');
    const _0x1c9181 = _0x252b6d?.["querySelector"]?.('.person-replacement-middle-layout');
    const _0x5b2b1f = _0x14566f?.["querySelector"]?.("[data-person-replacement-shot-timeline-stage]");
    if (_0x2e5bdd) {
      if (!_0x4bde01 || !_0x252b6d || !_0x48d030 || !_0x486b0d) {
        return ![];
      }
      const _0x121c8c = _0x3fa3b8(_0x48d030);
      if (!reconcilePersonReplacementVideoShotSelection({
        'currentPage': _0x4bde01,
        'nextPage': _0x252b6d
      })) {
        return ![];
      }
      _0x4c4c18();
      _0x121c8c();
      _0x1f31f8();
      _0x31240a();
      _0x2a3e0c();
      _0x247681();
      return !![];
    }
    if (!_0x48d030 || !_0x14566f || !_0x1c9181 || !_0x5b2b1f) {
      return ![];
    }
    if (refreshTimelineCard && !_0x1b5dae(_0x48d030, timelineShotId)) {
      return ![];
    }
    if (!refreshTimelineCard) {
      _0x2d2a81(_0x48d030);
    }
    _0x457764();
    _0x474de2?.();
    _0x474de2 = null;
    if (!reconcilePersonReplacementImageShotSelection({
      'currentPage': _0x4bde01,
      'nextPage': _0x252b6d
    })) {
      return ![];
    }
    _0x1f31f8();
    _0x31240a();
    _0x86c4ac();
    return !![];
  };
  const _0xdba29c = () => {
    if (_0x2547c2["workspace"]["view"] !== "project" || _0x2547c2["workspace"]["step"] !== 0x3 || _0x545ea6["isOpen"] || _0x2e4219["isClipActive"]()) {
      return ![];
    }
    const _0x154959 = _0x313f9e?.["querySelector"]?.(".person-replacement-production-page");
    const _0x9e0e41 = _0x4f4afb(personReplacementVideoPresentation['render'](_0x2547c2, _0x2106d9()));
    const _0x455e74 = _0x154959?.["querySelector"]?.("[data-person-replacement-video-playback-stage=\"source\"]");
    const _0x416896 = _0x9e0e41?.["querySelector"]?.("[data-person-replacement-video-playback-stage=\"source\"]");
    const _0xa2bde1 = shouldReusePersonReplacementVideoPlaybackStage(_0x455e74, _0x416896);
    const _0x520e18 = _0x154959?.["querySelector"]?.(".person-replacement-video-reference-assets");
    const _0x522b38 = _0x9e0e41?.["querySelector"]?.(".person-replacement-video-reference-assets");
    const _0x2a2e60 = _0x154959?.["querySelector"]?.("[data-person-replacement-shot-timeline-stage]");
    const _0x1d6a8a = _0x9e0e41?.['querySelector']?.("[data-person-replacement-shot-timeline-stage]");
    const _0x4d94a6 = _0x2a2e60?.["querySelector"]?.(".person-replacement-shot-timeline-scroll");
    const _0x2cb5bc = _0x1d6a8a?.['querySelector']?.(".person-replacement-shot-timeline-scroll");
    const _0xba0c67 = _0x154959?.["querySelector"]?.(".person-replacement-video-generation-panel");
    const _0x219974 = _0x9e0e41?.['querySelector']?.(".person-replacement-video-generation-panel");
    const _0x341e44 = _0xba0c67?.['querySelector']?.("[data-person-replacement-video-reference-inputs]");
    const _0x452e04 = _0x219974?.['querySelector']?.("[data-person-replacement-video-reference-inputs]");
    const _0x461091 = _0xba0c67?.["querySelector"]?.("[data-person-replacement-field=\"video-prompt\"][contenteditable=\"true\"]");
    const _0x3b7189 = _0x219974?.["querySelector"]?.("[data-person-replacement-field=\"video-prompt\"][contenteditable=\"true\"]");
    const _0xbdf989 = _0xba0c67?.["querySelector"]?.("[data-person-replacement-video-playback-stage=\"result\"]");
    const _0x2e1f0e = _0x219974?.["querySelector"]?.("[data-person-replacement-video-playback-stage=\"result\"]");
    const _0x3820ec = shouldReusePersonReplacementVideoPlaybackStage(_0xbdf989, _0x2e1f0e) && typeof _0x2e1f0e?.["replaceWith"] === 'function';
    const _0x5e89be = _0x154959?.["querySelector"]?.(".person-replacement-step-footer");
    const _0x446cd0 = _0x9e0e41?.["querySelector"]?.(".person-replacement-step-footer");
    const _0x27b4a4 = [...(!_0xa2bde1 ? [[_0x154959?.["querySelector"]?.(".person-replacement-middle-preview-slide"), _0x9e0e41?.["querySelector"]?.(".person-replacement-middle-preview-slide")]] : []), [_0x2a2e60, _0x1d6a8a], [_0xba0c67, _0x219974], [_0x5e89be, _0x446cd0]];
    if (!_0x154959 || !_0x9e0e41 || !_0x4d94a6 || !_0x2cb5bc || !_0x520e18 || !_0x522b38 || !_0x341e44 || !_0x452e04 || !_0x461091 || !_0x3b7189 || _0x27b4a4["some"](([_0x58ab28, _0x52bb30]) => !_0x58ab28 || !_0x52bb30 || typeof _0x58ab28["replaceWith"] !== 'function')) {
      return ![];
    }
    const _0x57cd45 = _0x3fa3b8(_0x4d94a6);
    if (!reconcilePersonReplacementShotCardList({
      'currentList': _0x4d94a6,
      'nextList': _0x2cb5bc
    })) {
      _0x57cd45();
      return ![];
    }
    _0x457764();
    reconcileElementTree(_0x520e18, _0x522b38, {
      'preserveChildNodes': !![]
    });
    if (!_0x3820ec) {
      _0x2e4219["destroyRole"]("result");
    }
    if (!_0xa2bde1) {
      _0x2e4219["destroyRole"]("source");
    }
    _0x27b4a4["forEach"](([_0x2578da, _0x4208f6]) => {
      reconcileElementTree(_0x2578da, _0x4208f6, {
        'preserveChildNodes': !![],
        'preserveSelector': "[data-person-replacement-result-history-menu], .person-replacement-shot-timeline-scroll, [data-aigen-video-model-selector], .person-replacement-prompt-input-wrapper" + (_0x3820ec ? ", [data-person-replacement-video-playback-stage=\"result\"]" : '')
      });
    });
    _0x57cd45();
    _0x555279?.["syncContext"]?.({
      ...resolvePersonReplacementVideoParameterPolicy({
        'modelId': _0x2547c2["settings"]["replacementModelId"],
        'inputMode': _0x2547c2['settings']['replacementVideoInputMode'],
        'generationParams': _0x2547c2["settings"]["replacementVideoGenerationParams"]
      }),
      'referenceCounts': personReplacementVideoPresentation["build"](_0x2547c2)["slotState"]["referenceCounts"]
    });
    if (_0x3820ec) {
      _0x4996f5();
    } else {
      _0x247681({
        'roles': ["result"],
        'reset': ![]
      });
    }
    if (!_0xa2bde1) {
      _0x247681({
        'roles': ['source'],
        'reset': ![]
      });
    }
    return !![];
  };
  _0x53d4d4 = (_0x2c6a32, {
    timelineShotId = _0x2547c2["workspace"]["selectedShotId"]
  } = {}) => {
    const _0x435107 = normalizeText(_0x2c6a32);
    if (_0x2547c2["workspace"]['step'] === 0x1 && ["asset-selection-mode", "asset-selection-cancel", "asset-selection-all", "asset-selection", "scene-asset-selection"]["includes"](_0x435107)) {
      return syncPersonReplacementAssetSelection(_0x313f9e, renderAssetSettings(_0x2547c2, _0x2106d9()));
    }
    if (_0x2547c2['workspace']["step"] === 0x2 && ["replacement-target-asset-select", 'replacement-scene-asset-select', "target-appearance-preview-change"]["includes"](_0x435107)) {
      return syncPersonReplacementAssetSelection(_0x313f9e, personReplacementImagePresentation["render"](_0x2547c2, {
        ..._0x2106d9(),
        'omitShotTimeline': !![]
      }), {
        'targetRail': !![]
      });
    }
    if (_0x2547c2["workspace"]["step"] === 0x2 && ["person-mapping", "person-mapping-current-shot", "person-mapping-clear", "person-mapping-clear-reference"]["includes"](_0x435107)) {
      return _0x131c7a();
    }
    if (_0x435107 === "shot-marquee" || _0x435107["startsWith"]("shot-selection")) {
      return _0x2547c2["workspace"]["step"] === 0x5 ? _0x41e6ad() : _0xe6442a();
    }
    if (_0x435107 === 'video-input-mode' || _0x435107 === "video-reference-change" || _0x435107 === "replacement-video-result" || _0x435107 === 'replacement-video-reference' || _0x435107 === "delete-replacement-video-result" || (_0x435107 === "replacement-image-result" || _0x435107 === "delete-replacement-image-result") && _0x2547c2["workspace"]["step"] === 0x3) {
      return _0xdba29c();
    }
    if ((_0x435107 === 'replacement-image-result' || _0x435107 === "delete-replacement-image-result") && _0x2547c2["workspace"]["step"] === 0x2) {
      return _0x131c7a({
        'refreshTimelineCard': !![],
        'timelineShotId': timelineShotId
      });
    }
    if (_0x435107 === "shot-select") {
      return _0x2547c2["workspace"]["step"] === 0x5 ? _0x3175d8() : _0x131c7a();
    }
    if (_0x435107 === 'replacement-image-reference' && _0x2547c2['workspace']["step"] === 0x2) {
      return _0x131c7a({
        'refreshTimelineCard': !![]
      });
    }
    if (_0x435107 === "composite-full-video-select") {
      return _0x3175d8();
    }
    return ![];
  };
  let _0x3567fe = () => {
    if (!_0x313f9e || _0x4d9c06) {
      return;
    }
    _0x400219 = null;
    _0x50e3a9();
    _0x55111a();
    _0x1682cd();
    _0x30afb2();
    _0xc540cf();
    _0x525fa4();
    _0x54ce2e();
    _0x545ea6['pendingPreviewSeek'] = null;
    _0x545ea6['hoverPreviewActive'] = ![];
    _0x545ea6["hoverPreviewTimeSec"] = null;
    _0x52afe9();
    _0x3c5dc1['forEach'](_0xc0b71e => _0xc0b71e?.["destroy"]?.());
    _0x3c5dc1 = [];
    _0x449fcf();
    _0x474de2?.();
    _0x474de2 = null;
    _0x15740b();
    _0x545ea6["playheadElement"] = null;
    _0x545ea6["clockElement"] = null;
    _0x313f9e['dataset']["personReplacementView"] = _0x2547c2['workspace']["view"];
    _0x313f9e["dataset"]['personReplacementStep'] = String(_0x2547c2["workspace"]["step"]);
    _0x313f9e["innerHTML"] = _0x2547c2['workspace']["view"] === 'home' ? personReplacementShellPresentation["renderHome"](_0x2547c2) : renderProject(_0x2547c2, _0x2106d9());
    _0x4c2266();
    _0x31240a();
    _0x86c4ac();
    _0x2a3e0c();
    _0x247681();
    _0x4a5835();
    _0x41e9d5();
    _0x267c9a();
  };
  const _0x7544b9 = _0x4d238e => {
    const _0x1e8061 = Math['trunc'](clamp(_0x4d238e, 0x1, 0x5, _0x2547c2["workspace"]["step"]));
    if (_0x1e8061 > _0x2547c2['workspace']['step'] && _0x538898()) {
      _0x12c268('step-change', _0x1e8061);
      return cloneJson(_0x2547c2);
    }
    const _0x514b97 = getPersonReplacementStepGate(_0x2547c2, _0x1e8061);
    if (_0x1e8061 !== _0x2547c2["workspace"]["step"] && !_0x514b97["allowed"]) {
      _0x12c268(_0x514b97['reason'], _0x1e8061);
      return cloneJson(_0x2547c2);
    }
    _0x3657a3({
      'animate': ![],
      'renderWorkspace': ![]
    });
    return _0x5ad5fa({
      ..._0x2547c2,
      'workspace': {
        ..._0x2547c2["workspace"],
        'step': _0x1e8061
      }
    }, "step-change");
  };
  const _0x3fcfe3 = _0x4813b6 => handleWorkspaceStepShortcut(_0x4813b6, {
    'enabled': Boolean(_0x313f9e && !_0x313f9e["hidden"] && !_0x200819 && _0x2547c2["workspace"]["view"] === "project"),
    'stepCount': PERSON_REPLACEMENT_STEPS["length"],
    'navigate': _0x7544b9
  });
  const _0x512fe6 = (_0x72a51b, _0x6ea04d = '') => {
    const _0x3e4b5e = _0x6ea04d ? [..._0x2547c2['characters'], ..._0x2547c2["scenes"]]['find'](_0x2abd5e => _0x2abd5e['id'] === _0x6ea04d) : _0x2547c2["workspace"]['characterAssetTab'] === "scene" ? _0x2547c2["scenes"]["find"](_0x1a9c99 => _0x1a9c99['id'] === _0x2547c2["workspace"]["selectedSceneId"]) : _0x4fa679();
    const _0x311cde = getWorkspaceAssetAppearances(_0x3e4b5e);
    if (_0x311cde["length"] < 0x2) {
      return;
    }
    const _0x5a5320 = Math["trunc"](Number(_0x2547c2["workspace"]['assetAppearanceIndexes']?.[_0x3e4b5e['id']]) || 0x0);
    const _0x483d42 = (_0x5a5320 + _0x72a51b + _0x311cde["length"]) % _0x311cde['length'];
    const _0x5310b4 = _0x72a51b > 0x0 ? 'next' : "previous";
    const _0x15112d = _0x3e4b5e['id'] === (_0x2547c2["workspace"]["characterAssetTab"] === "scene" ? _0x2547c2["workspace"]["selectedSceneId"] : _0x2547c2['workspace']["selectedCharacterId"]);
    const _0x5b29a8 = _0x313f9e?.["querySelector"]?.(".story-asset-detail .story-asset-preview-slide")?.["cloneNode"]?.(!![]);
    _0x5ad5fa({
      ..._0x2547c2,
      'workspace': {
        ..._0x2547c2["workspace"],
        'assetAppearanceIndexes': {
          ..._0x2547c2["workspace"]["assetAppearanceIndexes"],
          [_0x3e4b5e['id']]: _0x483d42
        }
      }
    }, "appearance-change");
    if (!_0x15112d) {
      return;
    }
    const _0x1c2dfd = _0x313f9e?.['querySelector']?.(".story-asset-detail");
    const _0x5db5ae = _0x1c2dfd?.["querySelector"]?.(".story-asset-preview-slide");
    if (!_0x1c2dfd || !_0x5db5ae) {
      return;
    }
    _0x1c2dfd["classList"]['remove']("is-sliding-next", "is-sliding-previous");
    if (_0x5b29a8) {
      _0x5b29a8["classList"]["remove"]("img-preview-loading");
      _0x5b29a8["classList"]["add"]('story-asset-preview-slide--outgoing', "is-sliding-" + _0x5310b4);
      _0x5b29a8["removeAttribute"]?.("aria-busy");
      _0x5b29a8["setAttribute"]?.('aria-hidden', "true");
      _0x5b29a8["querySelector"]?.(".img-loading-overlay")?.["remove"]?.();
      _0x5db5ae["after"]?.(_0x5b29a8);
      const _0x37b37d = () => _0x5b29a8["remove"]?.();
      _0x5b29a8['addEventListener']?.("animationend", _0x37b37d, {
        'once': !![]
      });
      windowObject?.['setTimeout']?.(_0x37b37d, 0x1cc);
    }
    void _0x1c2dfd['offsetWidth'];
    _0x1c2dfd["classList"]["add"]("is-sliding-" + _0x5310b4);
  };
  const _0x5b6c37 = _0x4e1996 => {
    const _0x24c063 = getPersonReplacementProjectAudioAssets(_0x2547c2)["find"](_0x425d7d => _0x425d7d['id'] === _0x2547c2['workspace']["selectedAudioAssetId"]);
    const _0x57dadb = getPersonReplacementVoiceLibraryBoundCharacters(_0x2547c2, _0x24c063);
    if (_0x57dadb["length"] < 0x2) {
      return;
    }
    const _0x4386de = Math['max'](0x0, _0x57dadb['findIndex'](_0x4991b9 => _0x4991b9['id'] === _0x2547c2['workspace']['selectedCharacterId']));
    const _0x529af7 = (_0x4386de + _0x4e1996 + _0x57dadb["length"]) % _0x57dadb['length'];
    _0x5ad5fa({
      ..._0x2547c2,
      'workspace': {
        ..._0x2547c2["workspace"],
        'selectedCharacterId': _0x57dadb[_0x529af7]['id']
      }
    }, "audio-bound-character-change");
  };
  const _0x2a23cd = _0x585982 => {
    const _0x27be06 = () => {
      Array["from"](_0x313f9e?.["querySelectorAll"]?.('[data-person-replacement-shot-card=\x22true\x22]') || [])["find"](_0x4fccb8 => _0x4fccb8["dataset"]?.["shotId"] === normalizeText(_0x585982))?.['scrollIntoView']?.({
        'block': 'nearest',
        'inline': "nearest"
      });
    };
    typeof windowObject?.["requestAnimationFrame"] === "function" ? windowObject["requestAnimationFrame"](_0x27be06) : _0x27be06();
  };
  const _0x12014c = _0x51a9ab => {
    const _0x57a2d0 = _0x2547c2['shots']["findIndex"](_0x52b021 => _0x52b021['id'] === normalizeText(_0x2547c2['workspace']['selectedShotId']));
    const _0x4bb44e = _0x2547c2["shots"]["findIndex"](_0x1e0370 => _0x1e0370['id'] === normalizeText(_0x51a9ab));
    if (_0x57a2d0 < 0x0 || _0x4bb44e < 0x0 || _0x57a2d0 === _0x4bb44e) {
      return '';
    }
    return _0x4bb44e > _0x57a2d0 ? 'next' : 'previous';
  };
  const _0x157eff = () => _0x313f9e?.["querySelector"]?.(".person-replacement-image-generation-panel .person-replacement-image-preview-slide:not(.person-replacement-image-preview-slide--outgoing)")?.['cloneNode']?.(!![]) || null;
  const _0x3481ad = () => _0x313f9e?.['querySelector']?.(".person-replacement-middle-layout > .person-replacement-middle-preview-slide:not(.person-replacement-middle-preview-slide--outgoing)")?.["cloneNode"]?.(!![]) || null;
  const _0x2775da = _0x5a8f25 => {
    _0x5a8f25?.["querySelectorAll"]?.(".person-replacement-detection-empty, .person-replacement-keyframe-tools, .person-replacement-shot-navigation-arrow")?.["forEach"]?.(_0x59a63b => _0x59a63b["remove"]?.());
    _0x5a8f25?.['querySelectorAll']?.(".person-replacement-detection-box")?.["forEach"]?.(_0x59d155 => _0x59d155['replaceChildren']?.());
    return _0x5a8f25;
  };
  const _0x3b7219 = () => _0x313f9e?.["querySelector"]?.(".person-replacement-video-generation-panel .person-replacement-video-result-slide:not(.person-replacement-video-result-slide--outgoing)") || null;
  const _0x4d9e4c = (_0x4a0c03, _0x105849) => {
    const _0x30c5f2 = _0x4a0c03 === "previous" ? "previous" : "next";
    const _0x22be9c = _0x313f9e?.["querySelector"]?.(".person-replacement-middle-layout");
    const _0x243e27 = _0x22be9c?.["querySelector"]?.(".person-replacement-middle-preview-slide:not(.person-replacement-middle-preview-slide--outgoing)");
    if (!_0x22be9c || !_0x243e27 || _0x243e27 === _0x105849) {
      return ![];
    }
    _0x22be9c["querySelectorAll"]?.(".person-replacement-middle-preview-slide--outgoing")?.["forEach"]?.(_0x198cd9 => _0x198cd9["remove"]?.());
    _0x22be9c["classList"]?.['remove']?.("is-sliding-next", "is-sliding-previous");
    if (_0x105849) {
      _0x2775da(_0x105849);
      _0x105849['classList']?.["remove"]?.("img-preview-loading", 'is-sliding-next', "is-sliding-previous");
      _0x105849["classList"]?.["add"]?.("person-replacement-middle-preview-slide--outgoing");
      _0x105849["removeAttribute"]?.("aria-busy");
      _0x105849['setAttribute']?.("aria-hidden", 'true');
      try {
        _0x105849["inert"] = !![];
      } catch {}
      _0x105849['querySelector']?.(".story-asset-loading-overlay, .img-loading-overlay")?.["remove"]?.();
      _0x22be9c["append"]?.(_0x105849);
    }
    const _0x123c76 = startPersonReplacementSlideTransition({
      'windowObject': windowObject,
      'incomingSlide': _0x243e27,
      'outgoingSlide': _0x105849,
      'direction': _0x30c5f2
    });
    let _0x49b143 = ![];
    const _0x4861cb = () => {
      if (_0x49b143) {
        return;
      }
      _0x49b143 = !![];
      cancelPersonReplacementSlideTransition(_0x123c76);
      _0x105849?.['remove']?.();
    };
    _0x123c76["finished"]["then"](_0x4861cb);
    windowObject?.['setTimeout']?.(_0x4861cb, _0x123c76["duration"] + 0x50);
    return !![];
  };
  const _0x787998 = (_0x4a6ccf, _0x4783c9) => {
    const _0xb41df4 = _0x4a6ccf === "previous" ? "previous" : "next";
    const _0x3ef754 = _0x313f9e?.["querySelector"]?.(".person-replacement-image-generation-panel .person-replacement-generation-preview");
    const _0x470b37 = _0x3ef754?.["querySelector"]?.(".person-replacement-image-preview-slide:not(.person-replacement-image-preview-slide--outgoing)");
    if (!_0x3ef754 || !_0x470b37) {
      return ![];
    }
    _0x3ef754["querySelectorAll"]?.(".person-replacement-image-preview-slide--outgoing")?.["forEach"]?.(_0x1ce7d9 => _0x1ce7d9["remove"]?.());
    _0x3ef754["classList"]?.["remove"]?.("is-sliding-next", "is-sliding-previous");
    _0x4783c9 && (_0x4783c9["classList"]?.["remove"]?.("img-preview-loading"), _0x4783c9['classList']?.["add"]?.("person-replacement-image-preview-slide--outgoing"), _0x4783c9["removeAttribute"]?.("aria-busy"), _0x4783c9["setAttribute"]?.("aria-hidden", "true"), _0x4783c9['querySelector']?.(".story-asset-loading-overlay, .img-loading-overlay")?.["remove"]?.(), _0x3ef754['append']?.(_0x4783c9));
    const _0x30df03 = startPersonReplacementSlideTransition({
      'windowObject': windowObject,
      'incomingSlide': _0x470b37,
      'outgoingSlide': _0x4783c9,
      'direction': _0xb41df4
    });
    let _0x1b1529 = ![];
    const _0x1272c3 = () => {
      if (_0x1b1529) {
        return;
      }
      _0x1b1529 = !![];
      cancelPersonReplacementSlideTransition(_0x30df03);
      _0x4783c9?.["remove"]?.();
    };
    _0x30df03["finished"]['then'](_0x1272c3);
    windowObject?.['setTimeout']?.(_0x1272c3, _0x30df03["duration"] + 0x50);
    return !![];
  };
  const _0x54076d = (_0x30f599, _0x157f92) => {
    const _0x1ad91f = _0x30f599 === "previous" ? "previous" : 'next';
    const _0x50c8d4 = _0x313f9e?.["querySelector"]?.(".person-replacement-video-generation-panel .person-replacement-video-result");
    const _0x349e7e = _0x50c8d4?.['querySelector']?.(".person-replacement-video-result-slide:not(.person-replacement-video-result-slide--outgoing)");
    if (!_0x50c8d4 || !_0x349e7e || _0x349e7e === _0x157f92) {
      return ![];
    }
    _0x50c8d4["querySelectorAll"]?.('.person-replacement-video-result-slide--outgoing')?.["forEach"]?.(_0x43979d => _0x43979d["remove"]?.());
    _0x50c8d4["classList"]?.["remove"]?.("is-sliding-next", "is-sliding-previous");
    if (_0x157f92) {
      _0x157f92['classList']?.["remove"]?.('img-preview-loading', "is-sliding-next", "is-sliding-previous");
      _0x157f92["classList"]?.["add"]?.("person-replacement-video-result-slide--outgoing");
      _0x157f92["removeAttribute"]?.('aria-busy');
      _0x157f92['setAttribute']?.("aria-hidden", "true");
      try {
        _0x157f92["inert"] = !![];
      } catch {}
      _0x157f92["querySelector"]?.(".story-asset-loading-overlay, .img-loading-overlay")?.["remove"]?.();
      _0x50c8d4['append']?.(_0x157f92);
    }
    const _0x2380df = startPersonReplacementSlideTransition({
      'windowObject': windowObject,
      'incomingSlide': _0x349e7e,
      'outgoingSlide': _0x157f92,
      'direction': _0x1ad91f
    });
    let _0xeedde9 = ![];
    const _0x262591 = () => {
      if (_0xeedde9) {
        return;
      }
      _0xeedde9 = !![];
      cancelPersonReplacementSlideTransition(_0x2380df);
      _0x157f92?.["remove"]?.();
    };
    _0x2380df['finished']["then"](_0x262591);
    windowObject?.["setTimeout"]?.(_0x262591, _0x2380df["duration"] + 0x50);
    return !![];
  };
  const _0x4a18e8 = _0x2779a4 => {
    if (_0x2547c2["workspace"]["view"] !== "project" || _0x2547c2['workspace']['step'] !== 0x5) {
      return ![];
    }
    const _0x45cc9e = _0x313f9e?.["querySelector"]?.('.person-replacement-compare-grid');
    if (!_0x45cc9e) {
      return ![];
    }
    const _0x401f17 = _0x2779a4 === "previous" ? "previous" : "next";
    _0x45cc9e["classList"]?.["remove"]?.("is-sliding-next");
    _0x45cc9e["classList"]?.["remove"]?.('is-sliding-previous');
    void _0x45cc9e["offsetWidth"];
    _0x45cc9e["classList"]?.["add"]?.("is-sliding-" + _0x401f17);
    return !![];
  };
  const _0x8d81b4 = (_0x5e7764, {
    direction = '',
    ensureVisible = ![]
  } = {}) => {
    const _0x5af8d3 = normalizeText(_0x5e7764);
    const _0x3cbbdc = _0x2547c2["shots"]['find'](_0x38122d => _0x38122d['id'] === _0x5af8d3);
    const _0x4d652d = _0x2547c2['workspace']["step"] === 0x5 && buildPersonReplacementCompositePreviewSnapshot(_0x2547c2)["previewMode"] === "full";
    if (!_0x3cbbdc || _0x5af8d3 === _0x2547c2["workspace"]["selectedShotId"] && !_0x4d652d) {
      return ![];
    }
    const _0x3b6b81 = direction || _0x12014c(_0x5af8d3);
    const _0x3ba2b1 = _0x157eff();
    const _0x37b89f = _0x3481ad();
    const _0x38bddd = _0x3b7219();
    _0x5ad5fa({
      ..._0x2547c2,
      'workspace': {
        ..._0x2547c2['workspace'],
        'selectedShotId': _0x5af8d3,
        ...(_0x2547c2["workspace"]['step'] === 0x5 ? {
          'compositePreviewMode': "shot"
        } : {})
      }
    }, "shot-select");
    _0x787998(_0x3b6b81 || "next", _0x3ba2b1);
    _0x4d9e4c(_0x3b6b81 || "next", _0x37b89f);
    _0x54076d(_0x3b6b81 || "next", _0x38bddd);
    _0x4a18e8(_0x3b6b81 || "next");
    if (ensureVisible) {
      _0x2a23cd(_0x5af8d3);
    }
    return !![];
  };
  const _0x3901a0 = _0x476a4b => {
    _0x476a4b?.["setAttribute"]?.("aria-label", _0x476a4b?.["dataset"]?.['personReplacementShotWheel'] === "true" ? "拖拽新增可替换主体；按住 Ctrl 拖拽可多选人物框；按 D 或 Delete 删除选中框；滚轮或左右方向键切换片段" : '拖拽新增可替换主体；按住\x20Ctrl\x20拖拽可多选人物框，按\x20D\x20或\x20Delete\x20批量删除');
  };
  const _0x3a3c43 = _0x567906 => {
    const _0x52ff4e = Array["isArray"](_0x2547c2['shots']) ? _0x2547c2["shots"] : [];
    if (_0x52ff4e["length"] < 0x2) {
      return ![];
    }
    const _0x11595a = Math['max'](0x0, _0x52ff4e["findIndex"](_0x4e3b34 => _0x4e3b34['id'] === _0x2547c2["workspace"]["selectedShotId"]));
    const _0x266083 = (_0x11595a + Math["sign"](Number(_0x567906) || 0x0) + _0x52ff4e["length"]) % _0x52ff4e["length"];
    const _0x20fd81 = _0x52ff4e[_0x266083];
    if (!_0x20fd81 || _0x20fd81['id'] === _0x2547c2["workspace"]["selectedShotId"]) {
      return ![];
    }
    return _0x8d81b4(_0x20fd81['id'], {
      'direction': Math['sign'](Number(_0x567906) || 0x0) < 0x0 ? 'previous' : 'next',
      'ensureVisible': !![]
    });
  };
  const _0x3f40ea = createPersonReplacementResultSelectionController({
    'getProject': () => _0x2547c2,
    'updateProject': _0x5ad5fa,
    'getShotSwitchDirection': _0x12014c,
    'captureImagePreviewSlide': _0x157eff,
    'captureMiddlePreviewSlide': _0x3481ad,
    'captureVideoResultSlide': _0x3b7219,
    'playImagePreviewTransition': _0x787998,
    'playMiddlePreviewTransition': _0x4d9e4c,
    'playVideoResultTransition': _0x54076d,
    'scrollShotCardIntoView': _0x2a23cd,
    'captureResultHistoryMenu': _0x216ac0,
    'restoreResultHistoryMenu': _0x2492ef,
    'windowObject': windowObject
  });
  const {
    deleteImageResult: _0x972da9,
    deleteVideoResult: _0x432ed2,
    selectImageResult: _0x20ba50,
    selectVideoReference: _0x3086e5,
    selectVideoResult: _0x213259,
    setImageReference: _0x1e6089,
    setVideoReference: _0x1d0c47,
    switchImageResult: _0x270da9,
    switchVideoReferenceResult: _0x50eb2e,
    switchVideoResult: _0x3dc82d
  } = _0x3f40ea;
  const _0x2ea7fb = _0x1fdb49 => {
    const _0x2ea7f7 = _0x1fdb49["target"]?.["closest"]?.('[data-person-replacement-video-reference-wheel=\x22true\x22]');
    if (!_0x2ea7f7 || _0x2547c2["workspace"]["view"] !== "project" || _0x2547c2["workspace"]['step'] !== 0x3) {
      return ![];
    }
    _0x1fdb49["preventDefault"]();
    const _0x577e2b = normalizeText(_0x2ea7f7["dataset"]['personReplacementVideoReferenceSourceShotId']);
    const _0x590a7c = _0x2deda0["get"](_0x577e2b) || {
      'accumulator': 0x0,
      'lockedUntil': 0x0
    };
    _0x2deda0["set"](_0x577e2b, _0x590a7c);
    const _0x5b7d42 = consumeWorkspaceWheelDirection(_0x1fdb49, _0x590a7c, {
      'threshold': 0x4,
      'lockDuration': 0xa0
    });
    _0x5b7d42 && _0x50eb2e({
      'sourceShotId': _0x577e2b,
      'currentResultIndex': _0x2ea7f7['dataset']["personReplacementVideoReferenceResultIndex"],
      'delta': _0x5b7d42
    });
    return !![];
  };
  const _0x5bbf2e = (_0xadf481, _0x2b6157) => {
    const _0x293447 = _0x2547c2["characters"]["find"](_0x186cf1 => _0x186cf1['id'] === normalizeText(_0xadf481));
    const _0x3763f3 = getWorkspaceAssetAppearances(_0x293447);
    const _0x5e015a = _0x3763f3['filter'](_0xb7c3fd => _0xb7c3fd['imageUrl']);
    if (!_0x293447 || _0x5e015a['length'] < 0x2) {
      return ![];
    }
    const _0xe041f9 = Math['max'](0x0, Math["min"](_0x3763f3["length"] - 0x1, Math['trunc'](Number(_0x2547c2["workspace"]["assetAppearanceIndexes"]?.[_0x293447['id']]) || 0x0)));
    const _0x350fd6 = _0x3763f3[_0xe041f9]?.['id'];
    const _0x424b3b = Math["max"](0x0, _0x5e015a["findIndex"](_0x504eac => _0x504eac['id'] === _0x350fd6));
    const _0x2c51d7 = (_0x424b3b + Math['sign'](Number(_0x2b6157) || 0x0) + _0x5e015a["length"]) % _0x5e015a["length"];
    if (_0x2c51d7 === _0x424b3b) {
      return ![];
    }
    const _0x3a2dce = _0x5e015a[_0x2c51d7]?.['id'];
    const _0x5f5166 = _0x3763f3["findIndex"](_0x4ec1c7 => _0x4ec1c7['id'] === _0x3a2dce);
    const _0x445270 = {
      ..._0x2547c2,
      'workspace': {
        ..._0x2547c2['workspace'],
        'assetAppearanceIndexes': {
          ..._0x2547c2['workspace']["assetAppearanceIndexes"],
          [_0x293447['id']]: Math["max"](0x0, _0x5f5166)
        }
      }
    };
    _0x5ad5fa(_0x445270, "target-appearance-preview-change");
    return !![];
  };
  const _0x33afdc = _0x1901b6 => {
    const _0x319c74 = _0x1901b6["target"]?.['closest']?.("[data-person-replacement-target-appearance-wheel=\"true\"]");
    if (!_0x319c74 || _0x2547c2["workspace"]["view"] !== 'project' || _0x2547c2["workspace"]["step"] !== 0x2) {
      return ![];
    }
    _0x1901b6["preventDefault"]();
    const _0x79d97c = normalizeText(_0x319c74["dataset"]["personReplacementTargetCharacterId"]);
    const _0x3b5ef5 = _0xbbbebb["get"](_0x79d97c) || {
      'accumulator': 0x0,
      'lockedUntil': 0x0
    };
    _0xbbbebb["set"](_0x79d97c, _0x3b5ef5);
    const _0x16440e = consumeWorkspaceWheelDirection(_0x1901b6, _0x3b5ef5, {
      'threshold': 0x4,
      'lockDuration': 0xa0
    });
    if (_0x16440e) {
      _0x5bbf2e(_0x79d97c, _0x16440e);
    }
    return !![];
  };
  const _0xe5bd02 = _0x5bd9cf => {
    const _0x5e7467 = _0x5bd9cf['target']?.["closest"]?.('[data-story-appearance-wheel=\x22true\x22]');
    if (!_0x5e7467 || _0x2547c2['workspace']["view"] !== "project" || _0x2547c2['workspace']["step"] !== 0x1 || _0x2547c2['workspace']["characterAssetTab"] === 'library') {
      return ![];
    }
    _0x5bd9cf['preventDefault']();
    const _0x4599b4 = consumeWorkspaceWheelDirection(_0x5bd9cf, _0x352bf7);
    if (_0x4599b4) {
      _0x512fe6(_0x4599b4);
    }
    return !![];
  };
  const _0x1c5236 = _0x2beafe => {
    const _0x4da1f5 = _0x2beafe['target']?.["closest"]?.('[data-person-replacement-audio-bound-wheel=\x22true\x22]');
    if (!_0x4da1f5 || _0x2547c2["workspace"]["view"] !== "project" || _0x2547c2["workspace"]["step"] !== 0x1 || _0x2547c2["workspace"]['characterAssetTab'] !== "audio") {
      return ![];
    }
    _0x2beafe["preventDefault"]();
    const _0x3a101c = consumeWorkspaceWheelDirection(_0x2beafe, _0x38f785);
    if (_0x3a101c) {
      _0x5b6c37(_0x3a101c);
    }
    return !![];
  };
  const _0x1e9b35 = _0x5879df => {
    const _0x3461a5 = _0x5879df["target"]?.['closest']?.("[data-person-replacement-shot-wheel=\"true\"]");
    if (!_0x3461a5 || _0x2547c2['workspace']["view"] !== "project" || ![0x2, 0x3, 0x5]["includes"](_0x2547c2['workspace']["step"]) || _0x2547c2["workspace"]["step"] === 0x2 && _0x545ea6["isOpen"]) {
      return ![];
    }
    _0x5879df["preventDefault"]();
    const _0x22cf09 = consumeWorkspaceWheelDirection(_0x5879df, _0x581403);
    if (_0x22cf09) {
      _0x3a3c43(_0x22cf09);
    }
    return !![];
  };
  const _0x188711 = _0x5aaf4f => {
    const _0x1692b1 = _0x5aaf4f['target']?.["closest"]?.('[data-person-replacement-video-result-wheel=\x22true\x22]');
    if (_0x1692b1 && _0x2547c2["workspace"]["view"] === "project" && _0x2547c2["workspace"]['step'] === 0x3) {
      _0x5aaf4f["preventDefault"]();
      const _0xd752fd = consumeWorkspaceWheelDirection(_0x5aaf4f, _0x4a5b2e);
      if (_0xd752fd) {
        _0x3dc82d(_0xd752fd);
      }
      return !![];
    }
    const _0x63a038 = _0x5aaf4f["target"]?.["closest"]?.("[data-person-replacement-image-result-wheel=\"true\"]");
    if (!_0x63a038 || _0x2547c2["workspace"]["view"] !== "project" || _0x2547c2["workspace"]["step"] !== 0x2) {
      return ![];
    }
    _0x5aaf4f["preventDefault"]();
    const _0x1d4437 = consumeWorkspaceWheelDirection(_0x5aaf4f, _0x10bb84);
    if (_0x1d4437) {
      _0x270da9(_0x1d4437);
    }
    return !![];
  };
  const _0x448438 = _0x21a9f2 => {
    const _0x144db0 = _0x21a9f2['target']?.['closest']?.('[data-person-replacement-shot-timeline-scroll]');
    const _0xa825aa = _0x21a9f2["target"]?.["closest"]?.("[data-person-replacement-shot-cut-timeline]");
    if (!_0x545ea6["isOpen"] || !_0x144db0 || !_0xa825aa || !_0x313f9e?.['contains']?.(_0x144db0)) {
      return ![];
    }
    const _0x5baca6 = Number(_0x21a9f2['deltaX']) || 0x0;
    const _0x1754e4 = Number(_0x21a9f2['deltaY']) || 0x0;
    const _0x20c83d = Math['abs'](_0x5baca6) > Math["abs"](_0x1754e4) ? _0x5baca6 : _0x1754e4;
    if (!_0x20c83d) {
      return ![];
    }
    if (_0x21a9f2["ctrlKey"] || _0x21a9f2["metaKey"]) {
      _0x21a9f2["preventDefault"]?.();
      _0x21a9f2['stopPropagation']?.();
      _0x2f8675(_0x20c83d > 0x0 ? "out" : 'in', {
        'clientX': _0x21a9f2['clientX']
      });
      return !![];
    }
    const _0x2097d6 = Math["max"](0x0, Number(_0x144db0["scrollWidth"]) - Number(_0x144db0["clientWidth"]));
    if (!(_0x2097d6 > 0x0)) {
      return ![];
    }
    const _0x2f5930 = clamp(Number(_0x144db0["scrollLeft"]) + _0x20c83d, 0x0, _0x2097d6, Number(_0x144db0['scrollLeft']) || 0x0);
    if (_0x2f5930 === Number(_0x144db0["scrollLeft"])) {
      return ![];
    }
    _0x21a9f2['preventDefault']?.();
    _0x21a9f2["stopPropagation"]?.();
    _0x144db0['scrollLeft'] = _0x2f5930;
    return !![];
  };
  const _0x3d7a2d = _0x457217 => {
    return scrollClosestElementHorizontallyWithWheel(_0x457217, '[data-person-replacement-shot-timeline-scroll]', {
      'boundaryRoot': _0x313f9e,
      'preserveNestedScrollable': !![]
    });
  };
  const _0x736bed = _0x125b14 => {
    return scrollClosestElementHorizontallyWithWheel(_0x125b14, '.person-replacement-video-model-selector', {
      'boundaryRoot': _0x313f9e,
      'preserveNestedScrollable': !![],
      'stopPropagation': !![]
    });
  };
  const _0x3b341e = _0x38c8bb => {
    if (_0x491710?.["handleKeyDown"](_0x38c8bb)) {
      return;
    }
    const _0x41a6cd = _0x38c8bb['target']?.['closest']?.("[data-person-replacement-composite-project-title]");
    if (_0x41a6cd && ['Enter', "Escape"]['includes'](_0x38c8bb['key'])) {
      _0x38c8bb['preventDefault']();
      _0x38c8bb['stopPropagation']();
      _0x38c8bb["key"] === "Escape" && (_0x41a6cd['value'] = _0x2547c2["title"]);
      _0x41a6cd['blur']?.();
      return;
    }
    if (_0x38c8bb['target']?.["dataset"]?.['personReplacementField'] === "video-prompt" && handleSlashKeyboardNavigation(_0x38c8bb)) {
      return;
    }
    if (_0x594c8d['handleKeyDown'](_0x38c8bb)) {
      return;
    }
    if (_0x55eaa0["handleKeyDown"](_0x38c8bb)) {
      return;
    }
    const _0x158643 = _0x38c8bb['target']?.["closest"]?.("[data-person-replacement-composite-sidebar-splitter]");
    if (_0x158643 && ["ArrowLeft", "ArrowRight"]["includes"](_0x38c8bb["key"])) {
      _0x38c8bb['preventDefault']();
      _0x38c8bb['stopPropagation']();
      const _0x4dc65f = _0x158643["closest"]?.(".person-replacement-preview-workbench");
      const _0x4a929d = _0x38c8bb['key'] === 'ArrowLeft' ? -0x10 : 0x10;
      _0x2547c2['workspace']['compositeSidebarWidth'] = applyPersonReplacementCompositeSidebarWidthToLayout(_0x4dc65f, _0x158643, _0x2547c2["workspace"]['compositeSidebarWidth'] + _0x4a929d);
      _0x25dce3('composite-sidebar-width');
      return;
    }
    const _0x491941 = _0x38c8bb["target"]?.['closest']?.('[data-person-replacement-voice-layout-splitter]');
    if (_0x491941 && ['ArrowLeft', "ArrowRight"]["includes"](_0x38c8bb['key'])) {
      _0x38c8bb["preventDefault"]();
      _0x38c8bb["stopPropagation"]();
      const _0xde24b9 = normalizeText(_0x491941["dataset"]?.["personReplacementVoiceLayoutSplitter"]);
      if (["assets", 'sources']["includes"](_0xde24b9)) {
        const _0x47caa6 = _0x491941["closest"]?.("[data-person-replacement-voice-layout]");
        const _0x4750c8 = normalizePersonReplacementVoiceLayout(_0x2547c2["workspace"]['voiceLayout']);
        const _0x56a471 = _0x38c8bb["key"] === "ArrowLeft" ? -0x2 : 0x2;
        _0x2547c2["workspace"]["voiceLayout"] = applyPersonReplacementVoiceLayoutToElement(_0x47caa6, {
          ..._0x4750c8,
          ...(_0xde24b9 === "assets" ? {
            'assetsEnd': _0x4750c8["assetsEnd"] + _0x56a471
          } : {
            'sourcesEnd': _0x4750c8["sourcesEnd"] + _0x56a471
          })
        });
        _0x25dce3("voice-layout");
      }
      return;
    }
    if (_0x38c8bb["key"] === "Escape") {
      const _0x4986b6 = _0x313f9e?.["querySelector"]?.(".person-replacement-add-voice-menu-wrap.is-open");
      if (_0x4986b6) {
        _0x38c8bb["preventDefault"]();
        _0x38c8bb["stopPropagation"]();
        const _0x3381f6 = _0x4986b6['querySelector']?.("[data-story-action=\"toggle-character-voice-menu\"]");
        _0x1f39e3(_0x4986b6, ![]);
        _0x3381f6?.["focus"]?.();
        return;
      }
      const _0x2347de = _0x313f9e?.["querySelector"]?.(".person-replacement-library-add-menu-wrap.is-open");
      if (_0x2347de) {
        _0x38c8bb["preventDefault"]();
        _0x38c8bb["stopPropagation"]();
        const _0x1b2581 = _0x2347de["querySelector"]?.("[data-person-replacement-action=\"toggle-library-add-targets\"]");
        _0x39fd0d(_0x2347de, ![]);
        _0x1b2581?.['focus']?.();
        return;
      }
    }
    if (_0x38c8bb['key'] === "Escape" && _0x400219) {
      _0x38c8bb["preventDefault"]();
      _0x38c8bb["stopPropagation"]();
      _0x3cc019({
        'restoreFocus': !![]
      });
      return;
    }
    const _0x240c5d = _0x38c8bb["target"]?.['closest']?.('[data-person-replacement-person-custom-label]');
    if (_0x240c5d && ["Enter", 'Escape']['includes'](_0x38c8bb["key"])) {
      _0x38c8bb["preventDefault"]();
      _0x38c8bb["stopPropagation"]();
      const _0x580f26 = _0x240c5d['closest']?.("[data-person-replacement-detection-picker]");
      _0x318c43(_0x240c5d, {
        'cancelled': _0x38c8bb["key"] === 'Escape'
      });
      _0x580f26?.["querySelector"]?.("[data-person-replacement-detection-picker-trigger]")?.['focus']?.();
      return;
    }
    const _0x493a42 = _0x38c8bb["target"]?.['closest']?.("[data-person-replacement-cut-boundary-index]");
    if (_0x493a42 && _0x545ea6["isOpen"] && ["ArrowLeft", "ArrowRight"]["includes"](_0x38c8bb["key"])) {
      const _0xa0c53a = _0x38c8bb["shiftKey"] ? 0x5 : _0x38c8bb["ctrlKey"] ? 0x1 : 0x0;
      if (!_0xa0c53a) {
        return;
      }
      _0x38c8bb["preventDefault"]();
      _0x38c8bb["stopPropagation"]();
      const _0x543145 = Math["trunc"](Number(_0x493a42["dataset"]['personReplacementCutBoundaryIndex']));
      const _0x288b84 = _0x545ea6["draft"][_0x543145 - 0x1];
      const _0x517282 = _0x545ea6["draft"][_0x543145];
      const _0x3d63b5 = _0x38c8bb["key"] === "ArrowRight" ? 0x1 : -0x1;
      const _0x35aee1 = a1289_0xa0a99e(_0x288b84, _0x517282) * _0xa0c53a;
      _0x3fcdf4(_0x543145, Number(_0x517282?.["startSec"]) + _0x3d63b5 * _0x35aee1, {
        'active': _0x543145
      });
      return;
    }
    const _0x537068 = _0x38c8bb["target"]?.["closest"]?.("[data-person-replacement-cut-shot-index]");
    const _0x4c58fd = Boolean(_0x38c8bb["target"]?.["closest"]?.('input,\x20textarea,\x20select,\x20[contenteditable=\x22true\x22],\x20[role=\x22textbox\x22]'));
    if (_0x3fcfe3(_0x38c8bb)) {
      return;
    }
    if (_0xa61439(_0x38c8bb, {
      'deletionEnabled': _0x2547c2["workspace"]["view"] === "project" && _0x2547c2['workspace']["step"] === 0x2 && !_0x545ea6["isOpen"],
      'isEditableTarget': _0x4c58fd
    })) {
      return;
    }
    const _0x2f52a2 = Boolean(_0x38c8bb["target"]?.["closest"]?.('.person-replacement-shot-cut-action'));
    if (_0x545ea6["isOpen"] && !_0x4ac098() && !_0x4c58fd && (_0x38c8bb['key'] === '\x20' || _0x38c8bb['code'] === "Space")) {
      _0x38c8bb["preventDefault"]();
      _0x38c8bb['stopPropagation']();
      const _0x131efd = _0x313f9e?.["querySelector"]?.('[data-person-replacement-shot-cut-editor]');
      if (_0x131efd && _0x38c8bb["target"] !== _0x131efd) {
        try {
          _0x131efd["focus"]?.({
            'preventScroll': !![]
          });
        } catch {
          _0x131efd['focus']?.();
        }
      }
      if (!_0x38c8bb["repeat"]) {
        _0x8bd08b();
      }
      return;
    }
    if (_0x545ea6['isOpen'] && !_0x4ac098() && !_0x4c58fd && !_0x2f52a2) {
      if (!_0x38c8bb['repeat'] && (_0x38c8bb["ctrlKey"] || _0x38c8bb["metaKey"]) && !_0x38c8bb["shiftKey"] && String(_0x38c8bb["key"] || '')["toLowerCase"]() === 'z') {
        _0x38c8bb['preventDefault']();
        _0x38c8bb['stopPropagation']();
        _0xc1f5e3();
        return;
      }
      if (!_0x38c8bb['repeat'] && (_0x38c8bb["ctrlKey"] || _0x38c8bb["metaKey"]) && (String(_0x38c8bb["key"] || '') === '+' || String(_0x38c8bb['key'] || '') === '=' || _0x38c8bb["code"] === "Equal")) {
        _0x38c8bb['preventDefault']();
        _0x38c8bb["stopPropagation"]();
        _0x2f8675('in');
        return;
      }
      if (!_0x38c8bb["repeat"] && (_0x38c8bb['ctrlKey'] || _0x38c8bb['metaKey']) && (String(_0x38c8bb["key"] || '') === '-' || _0x38c8bb["code"] === "Minus")) {
        _0x38c8bb["preventDefault"]();
        _0x38c8bb["stopPropagation"]();
        _0x2f8675("out");
        return;
      }
      if (!_0x38c8bb["repeat"] && (_0x38c8bb["ctrlKey"] || _0x38c8bb['metaKey']) && (String(_0x38c8bb["key"] || '') === '0' || _0x38c8bb["code"] === "Digit0")) {
        _0x38c8bb["preventDefault"]();
        _0x38c8bb["stopPropagation"]();
        _0x2f8675("reset");
        return;
      }
      if (!_0x38c8bb['repeat'] && !_0x38c8bb["ctrlKey"] && !_0x38c8bb["metaKey"] && !_0x38c8bb["altKey"] && (String(_0x38c8bb["key"] || '')["toLowerCase"]() === 'c' || _0x38c8bb["code"] === "KeyC")) {
        _0x38c8bb["preventDefault"]();
        _0x38c8bb['stopPropagation']();
        _0x6ab34b();
        return;
      }
      if (["ArrowLeft", "ArrowRight"]['includes'](_0x38c8bb["key"])) {
        _0x38c8bb["preventDefault"]();
        _0x38c8bb["stopPropagation"]();
        _0x1b030c(_0x38c8bb["key"] === "ArrowLeft" ? -0x1 : 0x1, _0x38c8bb["shiftKey"] ? 0x5 : 0x1);
        return;
      }
      if (["Home", "End"]["includes"](_0x38c8bb["key"])) {
        _0x38c8bb['preventDefault']();
        _0x38c8bb["stopPropagation"]();
        _0x5179f5(_0x38c8bb["key"] === "Home" ? 0x0 : getPersonReplacementShotCutTotalDuration(_0x545ea6["draft"]));
        return;
      }
    }
    if (_0x537068 && _0x545ea6["isOpen"] && _0x38c8bb["key"] === "Enter") {
      _0x38c8bb['preventDefault']();
      _0x38c8bb["stopPropagation"]();
      const _0x2c9547 = _0x545ea6['draft'][Math["trunc"](Number(_0x537068["dataset"]['personReplacementCutShotIndex']))];
      if (_0x2c9547) {
        _0x3fc0aa(_0x2c9547["shotId"], _0x2c9547['startSec']);
      }
      return;
    }
    const _0x3e7415 = _0x38c8bb["target"]?.["closest"]?.('[data-story-asset-name-id][contenteditable=\x22true\x22]');
    if (_0x3e7415 && ["Enter", "Escape"]["includes"](_0x38c8bb["key"])) {
      _0x38c8bb["preventDefault"]();
      _0x38c8bb["stopPropagation"]();
      _0x19608f(_0x3e7415, {
        'cancel': _0x38c8bb["key"] === 'Escape'
      });
      _0x3e7415['blur']?.();
      return;
    }
    if (_0x38c8bb["key"] === "Escape") {
      if (_0x2e5978()) {
        _0x38c8bb["preventDefault"]();
        _0x38c8bb["stopPropagation"]();
        return;
      }
      if (_0x432e77(_0x38c8bb)) {
        return;
      }
      if (_0x545ea6["isSmartDetectOpen"] && !_0x545ea6["isSmartDetecting"]) {
        _0x38c8bb["preventDefault"]();
        _0x38c8bb['stopPropagation']();
        _0x545ea6["isSmartDetectOpen"] = ![];
        _0x3567fe();
        return;
      }
      if (_0x545ea6['isOpen'] && !_0x118f0f()) {
        _0x38c8bb["preventDefault"]();
        _0x3657a3({
          'animate': !![],
          'renderWorkspace': !![]
        });
        return;
      }
      _0x49bdfd?.["cancel"]?.();
      _0x50d3b1();
    }
    const _0x5482ff = _0x38c8bb["target"]?.["closest"]?.("[data-person-replacement-target-appearance-wheel=\"true\"]");
    if (_0x5482ff && _0x2547c2["workspace"]["step"] === 0x2 && ['ArrowLeft', "ArrowRight"]['includes'](_0x38c8bb["key"])) {
      _0x38c8bb["preventDefault"]();
      _0x38c8bb["stopPropagation"]();
      _0x5bbf2e(_0x5482ff["dataset"]["personReplacementTargetCharacterId"], _0x38c8bb['key'] === "ArrowRight" ? 0x1 : -0x1);
      return;
    }
    const _0x5caea3 = _0x38c8bb["target"]?.["closest"]?.('[data-person-replacement-shot-wheel=\x22true\x22]');
    if (_0x5caea3 && _0x2547c2["workspace"]['step'] === 0x2 && ["ArrowLeft", "ArrowRight"]['includes'](_0x38c8bb["key"])) {
      _0x38c8bb['preventDefault']();
      _0x38c8bb["stopPropagation"]();
      _0x3a3c43(_0x38c8bb["key"] === 'ArrowRight' ? 0x1 : -0x1);
      return;
    }
    const _0x384b34 = _0x38c8bb['target']?.['closest']?.("[data-person-replacement-audio-bound-wheel=\"true\"]");
    if (_0x384b34 && _0x2547c2["workspace"]["step"] === 0x1 && _0x2547c2['workspace']["characterAssetTab"] === 'audio' && ["ArrowLeft", "ArrowRight"]["includes"](_0x38c8bb["key"])) {
      _0x38c8bb["preventDefault"]();
      _0x38c8bb["stopPropagation"]();
      _0x5b6c37(_0x38c8bb["key"] === "ArrowRight" ? 0x1 : -0x1);
      return;
    }
    const _0x1649bc = _0x38c8bb["target"]?.["closest"]?.('[data-story-appearance-wheel=\x22true\x22]');
    if (!_0x1649bc || !['ArrowLeft', "ArrowRight"]["includes"](_0x38c8bb['key'])) {
      return;
    }
    _0x38c8bb["preventDefault"]();
    _0x38c8bb['stopPropagation']();
    _0x512fe6(_0x38c8bb["key"] === "ArrowRight" ? 0x1 : -0x1);
  };
  const _0x197b85 = _0x1c4a7d => {
    _0x1c4a7d['stopPropagation']();
    const _0x59ca3c = _0x1c4a7d['target']?.['closest']?.(".person-replacement-image-preview-slide:not(.person-replacement-image-preview-slide--outgoing) > img");
    if (_0x59ca3c && _0x313f9e?.["contains"]?.(_0x59ca3c)) {
      const _0x4922cf = normalizeMediaUrl(_0x59ca3c['currentSrc'] || _0x59ca3c["getAttribute"]?.("src"));
      if (!_0x4922cf) {
        return;
      }
      _0x1c4a7d["preventDefault"]();
      openImagePreview(_0x4922cf, {
        'alt': _0x59ca3c["alt"] || "替换图片生成结果预览"
      });
      return;
    }
    const _0x14b3f0 = _0x1c4a7d['target']?.["closest"]?.('video[data-person-replacement-video-player=\x22result\x22]');
    if (_0x14b3f0 && _0x313f9e?.["contains"]?.(_0x14b3f0)) {
      const _0x50e970 = normalizeMediaUrl(_0x14b3f0['dataset']?.["personReplacementVideoUrl"] || _0x14b3f0["getAttribute"]?.("src") || _0x14b3f0['currentSrc']);
      if (!_0x50e970) {
        return;
      }
      const _0x557136 = normalizeMediaUrl(_0x14b3f0['currentSrc'] || _0x14b3f0["getAttribute"]?.("src"));
      _0x1c4a7d["preventDefault"]();
      openVideoPreview(_0x50e970, {
        'playbackUrl': _0x557136
      });
      return;
    }
    const _0x248805 = _0x1c4a7d['target']?.["closest"]?.("img.story-asset-preview");
    if (!_0x248805 || !_0x313f9e?.["contains"]?.(_0x248805)) {
      return;
    }
    const _0x480ff5 = normalizeMediaUrl(_0x248805["currentSrc"] || _0x248805['getAttribute']?.("src"));
    if (!_0x480ff5) {
      return;
    }
    _0x1c4a7d["preventDefault"]();
    openImagePreview(_0x480ff5, {
      'alt': _0x248805["alt"] || '人物形象图片预览'
    });
  };
  const _0x180e24 = (_0x4347b3 = {}) => {
    _0x2547c2 = a1289_0x2fb27f({
      ..._0x2547c2,
      'workspace': {
        ..._0x2547c2['workspace'],
        ..._0x4347b3
      }
    });
    _0x3567fe();
    return cloneJson(_0x2547c2);
  };
  const _0x1f9bb0 = () => {
    if (_0x2547c2["workspace"]["view"] !== 'home') {
      return ![];
    }
    const _0x27b21d = _0x313f9e?.["querySelector"]?.('[data-person-replacement-smart-clip-settings]');
    const _0x2fed65 = _0x27b21d?.['querySelector']?.("[data-person-replacement-action=\"toggle-smart-clip-settings\"]");
    if (!_0x27b21d || !_0x2fed65) {
      return ![];
    }
    const _0x2f3ac0 = _0x2547c2['workspace']["smartClipSettingsOpen"] === !![];
    const _0x1bd539 = _0x27b21d['querySelector']?.('.person-replacement-smart-clip-settings-panel');
    if (_0x2f3ac0 && !_0x1bd539 && typeof _0x27b21d['insertAdjacentHTML'] !== "function") {
      return ![];
    }
    _0x2fed65['classList']?.['toggle']?.("is-active", _0x2f3ac0);
    _0x2fed65["setAttribute"]?.("aria-expanded", String(_0x2f3ac0));
    if (_0x2f3ac0 && !_0x1bd539) {
      _0x27b21d["insertAdjacentHTML"]("beforeend", personReplacementShellPresentation["renderSmartClipSettingsPanel"](_0x2547c2));
    } else {
      !_0x2f3ac0 && _0x1bd539?.['remove']?.();
    }
    _0x27b21d['querySelectorAll']?.('[data-smart-clip-mode]')?.['forEach']?.(_0x43d4ea => {
      const _0x550471 = _0x43d4ea["dataset"]?.["smartClipMode"] === _0x2547c2["settings"]["smartClipMode"];
      _0x43d4ea["classList"]?.["toggle"]?.("is-active", _0x550471);
      _0x43d4ea["setAttribute"]?.("aria-pressed", String(_0x550471));
    });
    _0x27b21d['querySelectorAll']?.("[data-smart-clip-fps]")?.["forEach"]?.(_0x244423 => {
      const _0x323d5b = Number(_0x244423["dataset"]?.["smartClipFps"]) === _0x2547c2["settings"]["smartClipFps"];
      _0x244423['classList']?.["toggle"]?.("is-active", _0x323d5b);
      _0x244423["setAttribute"]?.("aria-pressed", String(_0x323d5b));
    });
    return !![];
  };
  const _0x1e6410 = ({
    workspace = {},
    settings = {}
  } = {}, {
    notify = ![]
  } = {}) => {
    _0x2547c2 = a1289_0x2fb27f({
      ..._0x2547c2,
      'settings': {
        ..._0x2547c2["settings"],
        ...settings
      },
      'workspace': {
        ..._0x2547c2['workspace'],
        ...workspace
      }
    });
    if (!_0x1f9bb0()) {
      _0x3567fe();
    }
    if (notify) {
      _0x25dce3("smart-clip-settings");
    }
    return cloneJson(_0x2547c2);
  };
  const _0xf15a3d = _0x3f4562 => {
    const _0x1bd8b3 = _0x313f9e?.['querySelector']?.('[data-story-project-sort-wrap]');
    const _0x126eca = _0x1bd8b3?.['querySelector']?.("[data-story-action='toggle-project-sort-menu']");
    const _0x474c1c = _0x1bd8b3?.["querySelector"]?.('[data-story-project-sort-menu]');
    _0x1bd8b3?.["classList"]?.["toggle"]?.("is-open", _0x3f4562);
    _0x126eca?.['setAttribute']?.("aria-expanded", String(_0x3f4562));
    _0x474c1c?.["setAttribute"]?.("aria-hidden", String(!_0x3f4562));
  };
  const _0x50d3b1 = (_0xbf7fb0 = null) => {
    _0x313f9e?.['querySelectorAll']?.(".story-home-param-picker.is-open")?.["forEach"]?.(_0x30f092 => {
      if (_0x30f092 === _0xbf7fb0) {
        return;
      }
      _0x30f092["classList"]?.["remove"]?.("is-open");
      _0x30f092["querySelector"]?.("[data-story-home-param-trigger]")?.["setAttribute"]?.("aria-expanded", "false");
    });
  };
  const _0x900722 = _0x28b080 => {
    const _0x26a275 = _0x28b080?.["querySelector"]?.('[data-person-replacement-detection-picker-menu]');
    const _0x1e459f = _0x28b080?.['querySelector']?.('[data-person-replacement-detection-picker-trigger]');
    if (!_0x26a275 || !_0x1e459f) {
      return ![];
    }
    if (_0x26a275["dataset"]?.["personReplacementPickerOptionsReady"] === "true") {
      return !![];
    }
    const _0xbd1d92 = normalizeText(_0x28b080["dataset"]?.["personReplacementDetectionPicker"]);
    let _0x232165 = [];
    if (_0xbd1d92 === 'orientation') {
      _0x232165 = getPersonOrientationOptions();
    } else {
      if (_0xbd1d92 === "scope") {
        _0x232165 = getPersonReplacementScopeOptions();
      } else {
        if (_0xbd1d92 === "label") {
          const _0x49331f = _0x28b080["closest"]?.(".person-replacement-detection-box");
          const _0x3ed08a = normalizeText(_0x49331f?.["dataset"]?.["shotId"] || _0x2547c2["workspace"]['selectedShotId']);
          const _0x23c426 = _0x2547c2["shots"]["find"](_0x308578 => _0x308578['id'] === _0x3ed08a);
          const _0xa7c5c9 = a1289_0x1cfc78(_0x23c426);
          const _0x3a598b = normalizeText(_0x1e459f["querySelector"]?.("[data-person-replacement-detection-picker-value]")?.['textContent'], _0x1e459f["value"]);
          _0x232165 = a1289_0x2a6be4({
            'labels': [..._0xa7c5c9['map']((_0x289b84, _0x112cb8) => formatPersonReplacementPersonLabel(_0x112cb8)), ...a1289_0x32ca2b(_0x2547c2)],
            'selectedLabel': _0x3a598b,
            'removedLabels': _0x2547c2["workspace"]["removedCustomPersonLabels"],
            'project': _0x2547c2
          });
        }
      }
    }
    _0x26a275["innerHTML"] = personReplacementIdentityPresentation["renderOverlay"]("picker-options", {
      'options': _0x232165,
      'selectedValue': _0x1e459f["value"]
    });
    _0x26a275['dataset'] && (_0x26a275['dataset']["personReplacementPickerOptionsReady"] = "true");
    return !![];
  };
  const _0x6e2fc3 = (_0x4ea155, _0x16b57e) => {
    const _0x3c3e79 = _0x4ea155?.["querySelector"]?.("[data-person-replacement-detection-picker-trigger]");
    const _0x3f4a47 = _0x4ea155?.["querySelector"]?.("[data-person-replacement-detection-picker-menu]");
    if (_0x16b57e && !_0x900722(_0x4ea155)) {
      return ![];
    }
    _0x4ea155?.["classList"]?.['toggle']?.("is-open", _0x16b57e);
    _0x4ea155?.["closest"]?.(".person-replacement-detection-box")?.["classList"]?.["toggle"]?.("is-picker-open", _0x16b57e);
    _0x3c3e79?.["setAttribute"]?.("aria-expanded", String(_0x16b57e));
    _0x3f4a47?.["setAttribute"]?.("aria-hidden", String(!_0x16b57e));
    !_0x16b57e && _0x3f4a47?.["dataset"]?.["personReplacementPickerOptionsLazy"] === "true" && (_0x3f4a47["innerHTML"] = '', _0x3f4a47['dataset'] && delete _0x3f4a47["dataset"]["personReplacementPickerOptionsReady"]);
    return !![];
  };
  const _0x2e5978 = (_0xed5c3b = null) => {
    let _0x4236f7 = ![];
    _0x313f9e?.["querySelectorAll"]?.("[data-person-replacement-detection-picker].is-open")?.["forEach"]?.(_0x42c419 => {
      if (_0x42c419 === _0xed5c3b) {
        return;
      }
      _0x6e2fc3(_0x42c419, ![]);
      _0x4236f7 = !![];
    });
    return _0x4236f7;
  };
  const _0x318c43 = (_0x3f8b10, {
    cancelled = ![]
  } = {}) => {
    if (!_0x3f8b10 || _0x3f8b10['hidden']) {
      return ![];
    }
    const _0x534479 = _0x3f8b10["closest"]?.('[data-person-replacement-detection-picker]');
    const _0x3f5336 = _0x3f8b10['closest']?.(".person-replacement-detection-box");
    const _0xc27fb4 = _0x534479?.["querySelector"]?.("[data-person-replacement-detection-picker-trigger]");
    const _0x1fcdf2 = _0xc27fb4?.["querySelector"]?.("[data-person-replacement-detection-picker-value]");
    if (!_0x534479 || !_0xc27fb4 || !_0x1fcdf2) {
      return ![];
    }
    const _0xefcd5b = normalizeText(_0x534479["dataset"]['personReplacementPreviousValue']);
    const _0x56e77a = normalizeText(_0x534479["dataset"]["personReplacementPreviousLabel"], _0xefcd5b);
    const _0x120553 = normalizeText(_0x534479['dataset']["personReplacementPreviousSourceCharacterId"]);
    const _0x4148d6 = normalizeText(_0x3f8b10["value"]);
    const _0x233d42 = cancelled || !_0x4148d6;
    const _0x583bc5 = _0x233d42 ? _0xefcd5b : PERSON_REPLACEMENT_CUSTOM_LABEL_VALUE;
    const _0x52e6df = _0x233d42 ? _0x56e77a : _0x4148d6;
    _0xc27fb4["value"] = _0x583bc5;
    _0xc27fb4["dataset"]['personReplacementSelectedSourceCharacterId'] = _0x233d42 ? _0x120553 : normalizeText(_0x2547c2["shots"]["find"](_0x985002 => _0x985002['id'] === normalizeText(_0x3f5336?.['dataset']?.["shotId"]))?.['people']?.['find'](_0x1ae59d => _0x1ae59d['id'] === normalizeText(_0x3f5336?.['dataset']?.["personId"]))?.["sourceCharacterId"]);
    _0xc27fb4["hidden"] = ![];
    _0xc27fb4['setAttribute']("aria-label", "人物名称：" + _0x52e6df);
    _0x1fcdf2["textContent"] = _0x52e6df;
    _0x3f8b10['value'] = _0x52e6df;
    _0x3f8b10["hidden"] = !![];
    _0x534479["querySelectorAll"]?.("[data-person-replacement-detection-picker-option]")?.['forEach']?.(_0x3c8de3 => {
      const _0x40a7f9 = normalizeText(_0x3c8de3["dataset"]["personReplacementDetectionPickerOption"]) === _0x583bc5;
      _0x3c8de3["classList"]?.["toggle"]?.('is-selected', _0x40a7f9);
      _0x3c8de3["setAttribute"]?.("aria-selected", String(_0x40a7f9));
    });
    delete _0x534479["dataset"]["personReplacementPreviousValue"];
    delete _0x534479["dataset"]["personReplacementPreviousLabel"];
    delete _0x534479["dataset"]["personReplacementPreviousSourceCharacterId"];
    !_0x233d42 && _0x171208({
      'detectionBox': _0x3f5336,
      'label': _0x52e6df,
      'sourceCharacterId': _0xc27fb4["dataset"]["personReplacementSelectedSourceCharacterId"]
    });
    return !_0x233d42;
  };
  const _0x14651f = _0x58a5a5 => {
    const _0x5080a2 = _0x58a5a5?.["target"];
    const _0x25c446 = _0x5080a2?.["closest"]?.('[data-story-marquee-surface=\x22shots\x22]');
    const _0x11f0ac = _0x2547c2["workspace"]["step"] === 0x1 && _0x2547c2["workspace"]["assetSelectionMode"] && _0x5080a2?.["closest"]?.('.person-replacement-assets-page');
    const _0x4c4588 = [0x2, 0x3, 0x5]["includes"](_0x2547c2["workspace"]["step"]) && _0x2547c2["workspace"]["shotSelectionMode"] && _0x25c446;
    const _0x32369b = _0x5080a2?.["closest"]?.(PERSON_REPLACEMENT_MULTI_SELECTION_INTERACTIVE_SELECTOR);
    const _0x9f6cc3 = _0x4c4588 && _0x32369b === _0x25c446;
    if (_0x2547c2["workspace"]["view"] !== 'project' || !_0x11f0ac && !_0x4c4588 || _0x32369b && !_0x9f6cc3) {
      return ![];
    }
    _0x49bdfd?.["cancel"]?.();
    _0x5ad5fa({
      ..._0x2547c2,
      'workspace': {
        ..._0x2547c2["workspace"],
        ...(_0x4c4588 ? {
          'shotSelectionMode': ![],
          'selectedShotIds': []
        } : {
          'assetSelectionMode': ![],
          'selectedAssetIds': []
        })
      }
    }, _0x4c4588 ? 'shot-selection-cancel' : "asset-selection-cancel");
    return !![];
  };
  const _0x5bed2d = _0x573f44 => {
    const _0x47ddcd = () => {
      const _0x4aacf0 = Array["from"](_0x313f9e?.["querySelectorAll"]?.("[data-story-project-title]") || [])["find"](_0x270067 => normalizeText(_0x270067['dataset']["storyProjectTitle"]) === normalizeText(_0x573f44));
      _0x4aacf0?.['focus']?.();
      _0x4aacf0?.["select"]?.();
    };
    typeof windowObject?.["requestAnimationFrame"] === "function" ? windowObject['requestAnimationFrame'](_0x47ddcd) : globalThis["queueMicrotask"]?.(_0x47ddcd);
  };
  const _0x1fc5b8 = (_0x8528f9, _0x4c50a1) => {
    if (_0x2547c2['workspace']['view'] === 'home' && _0x4c50a1 === "toggle-project-sort-menu") {
      const _0x253516 = _0x8528f9["closest"]?.("[data-story-project-sort-wrap]");
      _0xf15a3d(!_0x253516?.["classList"]?.["contains"]?.("is-open"));
    } else {
      if (_0x2547c2['workspace']["view"] === 'home' && _0x4c50a1 === "select-project-sort") {
        _0x180e24({
          'projectSortOrder': normalizeWorkspaceProjectSortOrder(_0x8528f9["dataset"]["storyProjectSortOption"])
        });
      } else {
        if (_0x2547c2['workspace']["view"] === "home" && _0x4c50a1 === "toggle-archived-projects") {
          _0x180e24({
            'showArchivedProjects': !_0x2547c2["workspace"]["showArchivedProjects"],
            'openProjectMenuId': '',
            'pendingDeleteProjectId': ''
          });
        } else {
          if (_0x2547c2["workspace"]['view'] === 'home' && _0x4c50a1 === 'toggle-project-menu') {
            const _0x2acb07 = normalizeText(_0x8528f9["dataset"]["storyProjectId"]);
            _0x180e24({
              'openProjectMenuId': _0x2547c2["workspace"]["openProjectMenuId"] === _0x2acb07 ? '' : _0x2acb07,
              'pendingDeleteProjectId': ''
            });
          } else {
            if (_0x2547c2["workspace"]["view"] === 'home' && _0x4c50a1 === "rename-project") {
              const _0x35ec35 = normalizeText(_0x8528f9["dataset"]["storyProjectId"]);
              _0x180e24({
                'openProjectMenuId': '',
                'pendingDeleteProjectId': ''
              });
              _0x5bed2d(_0x35ec35);
            } else {
              if (_0x2547c2["workspace"]['view'] === "home" && _0x4c50a1 === "duplicate-project") {
                _0x1aea64(_0x4b5931['DUPLICATE_PROJECT'], {
                  'projectId': _0x8528f9["dataset"]["storyProjectId"]
                });
              } else {
                if (_0x2547c2['workspace']["view"] === "home" && _0x4c50a1 === 'collect-project') {
                  _0x1aea64(_0x4b5931["COLLECT_PROJECT"], {
                    'projectId': _0x8528f9["dataset"]['storyProjectId']
                  });
                } else {
                  if (_0x2547c2["workspace"]["view"] === "home" && _0x4c50a1 === "import-project") {
                    _0x1aea64(_0x4b5931["IMPORT_PROJECT"]);
                  } else {
                    if (_0x2547c2["workspace"]["view"] === 'home' && (_0x4c50a1 === "archive-project" || _0x4c50a1 === "unarchive-project")) {
                      _0x1aea64(_0x4b5931['ARCHIVE_PROJECT'], {
                        'projectId': _0x8528f9["dataset"]["storyProjectId"],
                        'archived': _0x4c50a1 === "archive-project"
                      });
                    } else {
                      if (_0x2547c2["workspace"]['view'] === "home" && _0x4c50a1 === "request-delete-project") {
                        _0x180e24({
                          'openProjectMenuId': '',
                          'pendingDeleteProjectId': normalizeText(_0x8528f9["dataset"]["storyProjectId"])
                        });
                      } else {
                        if (_0x2547c2["workspace"]["view"] === "home" && _0x4c50a1 === "cancel-delete-project") {
                          _0x180e24({
                            'pendingDeleteProjectId': ''
                          });
                        } else {
                          if (_0x2547c2["workspace"]['view'] === 'home' && _0x4c50a1 === "confirm-delete-project") {
                            _0x1aea64(_0x4b5931["DELETE_PROJECT"], {
                              'projectId': _0x8528f9['dataset']["storyProjectId"]
                            });
                          } else {
                            if (_0x4c50a1 === "target-previous-appearance" || _0x4c50a1 === "target-next-appearance") {
                              const _0x181dec = _0x8528f9["closest"]?.("[data-person-replacement-target-controls]");
                              _0x5bbf2e(_0x181dec?.['dataset']?.["personReplacementTargetControls"], _0x4c50a1 === "target-next-appearance" ? 0x1 : -0x1);
                            } else {
                              if (_0x4c50a1 === "video-reference-previous-result" || _0x4c50a1 === "video-reference-next-result") {
                                const _0x176ffa = _0x8528f9["closest"]?.('[data-person-replacement-video-reference-controls]');
                                _0x50eb2e({
                                  'sourceShotId': _0x176ffa?.['dataset']?.["personReplacementVideoReferenceControls"],
                                  'currentResultIndex': _0x176ffa?.["dataset"]?.['personReplacementVideoReferenceResultIndex'],
                                  'delta': _0x4c50a1 === "video-reference-next-result" ? 0x1 : -0x1
                                });
                              } else {
                                if (_0x4c50a1 === "toggle-asset-selection") {
                                  _0x5ad5fa({
                                    ..._0x2547c2,
                                    'workspace': {
                                      ..._0x2547c2['workspace'],
                                      'assetSelectionMode': !![]
                                    }
                                  }, "asset-selection-mode");
                                } else {
                                  if (_0x4c50a1 === "toggle-shot-selection") {
                                    _0x5ad5fa({
                                      ..._0x2547c2,
                                      'workspace': {
                                        ..._0x2547c2["workspace"],
                                        'shotSelectionMode': !![]
                                      }
                                    }, "shot-selection-mode");
                                  } else {
                                    if (_0x4c50a1 === "cancel-asset-selection") {
                                      _0x5ad5fa({
                                        ..._0x2547c2,
                                        'workspace': {
                                          ..._0x2547c2['workspace'],
                                          'assetSelectionMode': ![],
                                          'selectedAssetIds': []
                                        }
                                      }, "asset-selection-cancel");
                                    } else {
                                      if (_0x4c50a1 === "cancel-shot-selection") {
                                        _0x5ad5fa({
                                          ..._0x2547c2,
                                          'workspace': {
                                            ..._0x2547c2["workspace"],
                                            'shotSelectionMode': ![],
                                            'selectedShotIds': []
                                          }
                                        }, "shot-selection-cancel");
                                      } else {
                                        if (_0x4c50a1 === "cancel-shot-batch-generation") {
                                          _0x35aaa5();
                                        } else {
                                          if (_0x4c50a1 === "cancel-asset-batch-generation") {
                                            _0x51f811();
                                          } else {
                                            if (_0x4c50a1 === "toggle-all-assets") {
                                              const _0x1202a1 = getPersonReplacementSelectableAssets(_0x2547c2, _0x2547c2["workspace"]["characterAssetTab"]);
                                              const _0x2a3368 = _0x1202a1["length"] > 0x0 && _0x1202a1["every"](_0x3aa46a => _0x2547c2['workspace']['selectedAssetIds']["includes"](_0x3aa46a['id']));
                                              _0x5ad5fa({
                                                ..._0x2547c2,
                                                'workspace': {
                                                  ..._0x2547c2["workspace"],
                                                  'selectedAssetIds': _0x2a3368 ? [] : _0x1202a1['map'](_0x142108 => _0x142108['id']),
                                                  'assetSelectionMode': !_0x2a3368 && _0x1202a1['length'] > 0x0
                                                }
                                              }, "asset-selection-all");
                                            } else {
                                              if (_0x4c50a1 === "toggle-all-shots") {
                                                const _0x122ab2 = _0x2547c2["shots"]["every"](_0x4b2948 => _0x2547c2["workspace"]["selectedShotIds"]["includes"](_0x4b2948['id']));
                                                _0x5ad5fa({
                                                  ..._0x2547c2,
                                                  'workspace': {
                                                    ..._0x2547c2["workspace"],
                                                    'selectedShotIds': _0x122ab2 ? [] : _0x2547c2['shots']["map"](_0x674261 => _0x674261['id'])
                                                  }
                                                }, 'shot-selection-all');
                                              } else {
                                                if (_0x4c50a1 === "previous-appearance") {
                                                  _0x512fe6(-0x1, _0x8528f9['dataset']["storyCardAppearanceId"]);
                                                } else {
                                                  if (_0x4c50a1 === "next-appearance") {
                                                    _0x512fe6(0x1, _0x8528f9["dataset"]["storyCardAppearanceId"]);
                                                  } else {
                                                    if (_0x4c50a1 === 'previous-audio-bound-character') {
                                                      _0x5b6c37(-0x1);
                                                    } else {
                                                      if (_0x4c50a1 === "next-audio-bound-character") {
                                                        _0x5b6c37(0x1);
                                                      } else {
                                                        if (_0x4c50a1 === "previous-shot") {
                                                          _0x3a3c43(-0x1);
                                                        } else {
                                                          if (_0x4c50a1 === "next-shot") {
                                                            _0x3a3c43(0x1);
                                                          } else {
                                                            if (_0x4c50a1 === "previous-replacement-image-result") {
                                                              _0x270da9(-0x1);
                                                            } else {
                                                              if (_0x4c50a1 === 'next-replacement-image-result') {
                                                                _0x270da9(0x1);
                                                              } else {
                                                                if (_0x4c50a1 === "previous-replacement-video-result") {
                                                                  _0x3dc82d(-0x1);
                                                                } else {
                                                                  if (_0x4c50a1 === "next-replacement-video-result") {
                                                                    _0x3dc82d(0x1);
                                                                  } else {
                                                                    if (_0x4c50a1 === 'select-video-shot-reference') {
                                                                      _0x3086e5(_0x8528f9["dataset"]["shotId"] || _0x2547c2["workspace"]['selectedShotId'], _0x8528f9['dataset']["personReplacementVideoReferenceIndex"], {
                                                                        'sourceShotId': _0x8528f9["dataset"]["personReplacementVideoReferenceSourceShotId"],
                                                                        'resultIndex': _0x8528f9["dataset"]["personReplacementVideoReferenceResultIndex"],
                                                                        'referencePersonId': _0x8528f9["dataset"]['personReplacementVideoCharacterReference'],
                                                                        'referenceKind': _0x8528f9["dataset"]['personReplacementVideoReferenceKind']
                                                                      });
                                                                    } else {
                                                                      if (_0x4c50a1 === 'select-replacement-image-result') {
                                                                        _0x20ba50(_0x8528f9['dataset']['shotId'], _0x8528f9["dataset"]['replacementImageResultIndex']);
                                                                        _0x491710?.["refresh"]();
                                                                      } else {
                                                                        if (_0x4c50a1 === "set-replacement-image-reference") {
                                                                          _0x1e6089(_0x8528f9['dataset']["shotId"], _0x8528f9["dataset"]["replacementImageResultIndex"]);
                                                                        } else {
                                                                          if (_0x4c50a1 === "delete-replacement-image-result") {
                                                                            _0x972da9(_0x8528f9["dataset"]['shotId'], _0x8528f9["dataset"]["replacementImageResultIndex"]);
                                                                          } else {
                                                                            if (_0x4c50a1 === 'select-replacement-video-result') {
                                                                              _0x213259(_0x8528f9['dataset']['shotId'], _0x8528f9['dataset']["replacementVideoResultIndex"]);
                                                                              _0x491710?.["refresh"]();
                                                                            } else {
                                                                              if (_0x4c50a1 === "set-replacement-video-reference") {
                                                                                _0x1d0c47(_0x8528f9["dataset"]['shotId'], _0x8528f9["dataset"]["replacementVideoResultIndex"]);
                                                                              } else {
                                                                                if (_0x4c50a1 === "delete-replacement-video-result") {
                                                                                  _0x432ed2(_0x8528f9["dataset"]["shotId"], _0x8528f9["dataset"]['replacementVideoResultIndex']);
                                                                                } else {
                                                                                  if (_0x4c50a1 === "download-asset-image") {
                                                                                    _0x4f052b(_0x8528f9, _0x40f6c8());
                                                                                  } else {
                                                                                    if (_0x4c50a1 === 'add-asset-appearance-to-library') {
                                                                                      void addPersonReplacementAppearanceToLibraryWithFly(_0x313f9e, _0x4fa679(), _0xee8fcb(), _0x1b77c5(_0x4b5931['ADD_ASSET_APPEARANCE_TO_LIBRARY']), _0x28d621, documentObject, windowObject);
                                                                                    } else {
                                                                                      if (_0x4c50a1 === "download-replacement-image") {
                                                                                        _0x4f052b(_0x8528f9, _0x18e9bb());
                                                                                      } else {
                                                                                        if (_0x4c50a1 === "upload-replacement-image") {
                                                                                          _0x282314 = {
                                                                                            'kind': "replacement-image",
                                                                                            'shotId': _0x2547c2["workspace"]["selectedShotId"]
                                                                                          };
                                                                                          _0x313f9e["querySelector"]("[data-person-replacement-input='replacement-image']")?.["click"]?.();
                                                                                        } else {
                                                                                          if (_0x4c50a1 === "download-replacement-video") {
                                                                                            _0x5bc89b(_0x8528f9, _0x4f1014());
                                                                                          } else {
                                                                                            if (_0x4c50a1 === "upload-replacement-video") {
                                                                                              _0x5e3e1e = _0x8528f9;
                                                                                              _0x282314 = {
                                                                                                'kind': "replacement-video",
                                                                                                'shotId': _0x2547c2['workspace']["selectedShotId"]
                                                                                              };
                                                                                              _0x313f9e['querySelector']('[data-person-replacement-input=\x27replacement-video-result\x27]')?.["click"]?.();
                                                                                            } else {
                                                                                              if (_0x4c50a1 === "upload-asset") {
                                                                                                const _0x5ece93 = _0x4fa679();
                                                                                                const _0x3e4c0c = _0xee8fcb(_0x5ece93);
                                                                                                _0x282314 = {
                                                                                                  'kind': "appearance",
                                                                                                  'characterId': _0x5ece93?.['id'],
                                                                                                  'appearanceId': _0x3e4c0c?.['id']
                                                                                                };
                                                                                                _0x313f9e["querySelector"]("[data-person-replacement-input='appearance-image']")?.["click"]?.();
                                                                                              } else {
                                                                                                if (_0x4c50a1 === 'toggle-character-voice-menu') {
                                                                                                  const _0x384fc4 = _0x8528f9['closest']?.(".person-replacement-add-voice-menu-wrap");
                                                                                                  const _0x4b529b = !_0x384fc4?.["classList"]?.['contains']?.("is-open");
                                                                                                  _0x2b3919(_0x384fc4);
                                                                                                  _0x1f39e3(_0x384fc4, _0x4b529b);
                                                                                                } else {
                                                                                                  if (_0x4c50a1 === 'upload-character-voice') {
                                                                                                    _0x2b3919();
                                                                                                    _0x282314 = {
                                                                                                      'kind': 'voice',
                                                                                                      'characterId': _0x4fa679()?.['id']
                                                                                                    };
                                                                                                    _0x313f9e['querySelector']('[data-person-replacement-input=\x27character-voice\x27]')?.["click"]?.();
                                                                                                  } else {
                                                                                                    if (_0x4c50a1 === 'choose-character-voice-from-library') {
                                                                                                      _0x2b3919();
                                                                                                      const _0x2b1185 = _0x4fa679();
                                                                                                      if (!_0x2b1185) {
                                                                                                        windowObject?.['showToast']?.("请先选择要添加声音的人设。", "warn");
                                                                                                        return;
                                                                                                      }
                                                                                                      const _0x349b8c = _0x2547c2;
                                                                                                      const _0x19e15d = getPersonReplacementProjectAudioAssets(_0x349b8c);
                                                                                                      const _0x580332 = _0x19e15d["find"](_0x449077 => getPersonReplacementVoiceLibraryBoundCharacters(_0x349b8c, _0x449077)['some'](_0x5772fa => _0x5772fa['id'] === _0x2b1185['id']));
                                                                                                      _0x2281fc = _0x2b1185['id'];
                                                                                                      _0x5ad5fa({
                                                                                                        ..._0x349b8c,
                                                                                                        'workspace': {
                                                                                                          ..._0x349b8c["workspace"],
                                                                                                          'characterAssetTab': "audio",
                                                                                                          'selectedAudioAssetId': _0x580332?.['id'] || _0x19e15d[0x0]?.['id'] || '',
                                                                                                          'assetSelectionMode': ![],
                                                                                                          'selectedAssetIds': []
                                                                                                        }
                                                                                                      }, 'character-voice-library-open');
                                                                                                    } else {
                                                                                                      if (_0x4c50a1 === 'set-base-appearance') {
                                                                                                        const _0x5c2349 = _0x4fa679();
                                                                                                        const _0x401eaa = _0xee8fcb(_0x5c2349);
                                                                                                        const _0x597a50 = _0x2547c2['characters']["map"](_0x3fd4a0 => _0x3fd4a0['id'] === _0x5c2349?.['id'] ? {
                                                                                                          ..._0x3fd4a0,
                                                                                                          'baseAppearanceId': _0x401eaa?.['id']
                                                                                                        } : _0x3fd4a0);
                                                                                                        _0x5ad5fa({
                                                                                                          ..._0x2547c2,
                                                                                                          'characters': _0x597a50
                                                                                                        }, "set-base-appearance");
                                                                                                      } else {
                                                                                                        if (_0x4c50a1 === "delete-appearance") {
                                                                                                          const _0x4cc329 = _0x4fa679();
                                                                                                          const _0x41b8fc = _0xee8fcb(_0x4cc329);
                                                                                                          if (!_0x4cc329 || !_0x41b8fc || _0x41b8fc['id'] === _0x4cc329["baseAppearanceId"]) {
                                                                                                            return;
                                                                                                          }
                                                                                                          const _0x42ce2d = _0x2547c2['characters']["map"](_0x466545 => _0x466545['id'] === _0x4cc329['id'] ? {
                                                                                                            ..._0x466545,
                                                                                                            'appearances': _0x466545["appearances"]["filter"](_0x38f521 => _0x38f521['id'] !== _0x41b8fc['id'])
                                                                                                          } : _0x466545);
                                                                                                          _0x5ad5fa({
                                                                                                            ..._0x2547c2,
                                                                                                            'characters': _0x42ce2d,
                                                                                                            'workspace': {
                                                                                                              ..._0x2547c2["workspace"],
                                                                                                              'assetAppearanceIndexes': {
                                                                                                                ..._0x2547c2["workspace"]['assetAppearanceIndexes'],
                                                                                                                [_0x4cc329['id']]: 0x0
                                                                                                              }
                                                                                                            }
                                                                                                          }, "delete-appearance");
                                                                                                        } else {
                                                                                                          if (_0x4c50a1 === "delete-asset-card") {
                                                                                                            _0x457764();
                                                                                                            const _0x185a95 = normalizeText(_0x8528f9["dataset"]["storyAssetDeleteId"]);
                                                                                                            if (_0x2547c2['workspace']["characterAssetTab"] === "scene" && _0x2547c2["scenes"]["some"](_0x2a81a4 => _0x2a81a4['id'] === _0x185a95)) {
                                                                                                              _0x1aea64(_0x4b5931['DELETE_SCENE'], {
                                                                                                                'sceneId': _0x185a95
                                                                                                              });
                                                                                                            } else {
                                                                                                              _0x2547c2['workspace']['characterAssetTab'] === "audio" && _0x2547c2["audioAssets"]["some"](_0x4c68a6 => _0x4c68a6['id'] === _0x185a95) ? _0x1aea64(_0x4b5931["DELETE_AUDIO_ASSET"], {
                                                                                                                'audioAssetId': _0x185a95
                                                                                                              }) : _0x1aea64(_0x4b5931['DELETE_CHARACTER'], {
                                                                                                                'characterId': _0x185a95
                                                                                                              });
                                                                                                            }
                                                                                                          } else {
                                                                                                            if (_0x4c50a1["startsWith"]("debug-generation-")) {
                                                                                                              if (windowObject?.["DEV_MODE"] !== !![]) {
                                                                                                                return;
                                                                                                              }
                                                                                                              const _0x3e20df = _0x4c50a1["slice"]("debug-generation-"["length"]);
                                                                                                              const _0x10796b = _0x4fa679();
                                                                                                              const _0x142f4c = _0xee8fcb(_0x10796b);
                                                                                                              openDebugRequestWindow({
                                                                                                                'documentObject': documentObject,
                                                                                                                'windowObject': windowObject,
                                                                                                                'title': "替换工作室请求调试",
                                                                                                                'prepare': async () => buildGenerationDebugPreview({
                                                                                                                  ...(await _0x1aea64(_0x4b5931["PREVIEW_GENERATION"], {
                                                                                                                    'kind': _0x3e20df,
                                                                                                                    'projectId': _0x2547c2['id'],
                                                                                                                    'shotId': _0x2547c2['workspace']["selectedShotId"],
                                                                                                                    'sourceImageSize': resolvePersonReplacementSourceImageSize(_0x313f9e?.["querySelector"]("[data-person-replacement-keyframe-stage] > img"), _0x2547c2["shots"]["find"](_0x251d0f => _0x251d0f['id'] === _0x2547c2["workspace"]["selectedShotId"])),
                                                                                                                    'characterId': _0x10796b?.['id'],
                                                                                                                    'appearanceId': _0x142f4c?.['id'],
                                                                                                                    'prompt': _0x142f4c?.["prompt"] || _0x10796b?.['description'],
                                                                                                                    'promptPresetId': _0x2547c2["workspace"]["assetPromptPresetId"]
                                                                                                                  }, {}, {
                                                                                                                    'applyCallbackResult': ![]
                                                                                                                  })),
                                                                                                                  'notes': _0x2547c2["settings"]?.["replacementPromptEnhancementEnabled"] ? "已开启 AI 提示词增强；此处显示增强前输入。增强结果需要调用模型后才能确定，调试不会发起该调用。" : ''
                                                                                                                })
                                                                                                              });
                                                                                                              return;
                                                                                                            } else {
                                                                                                              if (_0x4c50a1 === "generate-asset") {
                                                                                                                const _0x404268 = _0x4fa679();
                                                                                                                const _0x5f4aba = _0xee8fcb(_0x404268);
                                                                                                                _0x1aea64(_0x4b5931['GENERATE_CHARACTER_IMAGE'], {
                                                                                                                  'characterId': _0x404268?.['id'],
                                                                                                                  'appearanceId': _0x5f4aba?.['id'],
                                                                                                                  'prompt': _0x5f4aba?.["prompt"] || _0x404268?.['description'],
                                                                                                                  'promptPresetId': _0x2547c2["workspace"]["assetPromptPresetId"],
                                                                                                                  'modelId': _0x2547c2["settings"]["characterImageModelId"],
                                                                                                                  'provider': _0x2547c2["settings"]['characterImageProvider'],
                                                                                                                  'providerProfileId': _0x2547c2["settings"]["characterImageProviderProfileId"],
                                                                                                                  'generationParams': _0x2547c2["settings"]["characterImageGenerationParams"]
                                                                                                                });
                                                                                                              } else {
                                                                                                                if (_0x4c50a1 === "batch-generate-assets" && [0x2, 0x3]['includes'](_0x2547c2["workspace"]["step"])) {
                                                                                                                  _0x54261d(_0x2547c2["workspace"]["step"] === 0x3 ? "video" : 'image');
                                                                                                                } else {
                                                                                                                  if (_0x4c50a1 === "batch-generate-assets") {
                                                                                                                    _0x3143b0();
                                                                                                                  } else {
                                                                                                                    _0x4c50a1 === "play-character-voice" && void _0x1404b4(_0x8528f9['dataset']["storyVoiceAssetId"]);
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
              }
            }
          }
        }
      }
    }
  };
  const _0x222a31 = _0x53aa83 => {
    if (!_0x53aa83?.["project"]) {
      return ![];
    }
    _0x457764();
    _0x5ad5fa(_0x53aa83["project"], _0x53aa83["reason"]);
    return !![];
  };
  const _0x4a9557 = (_0x2df04a, _0x36815d = "scene-reference-change") => _0x222a31(applyPersonReplacementShotSceneReference(_0x2547c2, _0x2df04a, {
    'reason': _0x36815d
  }));
  const _0x177a0e = (_0x4c7a04, _0x5d2273 = "person-mapping-clear") => _0x222a31(clearPersonReplacementShotPersonMappings(_0x2547c2, _0x4c7a04, {
    'reason': _0x5d2273
  }));
  const _0x4fbb9c = _0x27a8fc => _0x222a31(assignPersonReplacementShotPersonMapping(_0x2547c2, _0x27a8fc));
  const _0x3cc019 = ({
    restoreFocus = ![]
  } = {}) => {
    const _0x12a27b = _0x400219?.["focusTarget"];
    _0x400219 = null;
    _0x313f9e?.['querySelector']?.("[data-person-replacement-mapping-scope-menu]")?.['remove']?.();
    if (restoreFocus) {
      _0x12a27b?.["focus"]?.();
    }
  };
  const _0x24001d = ({
    personBox: _0x5b5727,
    mapping: _0x548500,
    personLabel = '',
    targetName = '',
    appearanceName = '',
    clientX: _0x452d10,
    clientY: _0x227f68
  } = {}) => {
    if (!_0x313f9e || !_0x5b5727 || !_0x548500) {
      return ![];
    }
    _0x3cc019();
    _0x400219 = {
      'mapping': _0x548500,
      'focusTarget': _0x5b5727
    };
    _0x313f9e["insertAdjacentHTML"]?.('beforeend', personReplacementIdentityPresentation["renderOverlay"]("mapping-scope", {
      'personLabel': personLabel,
      'targetName': targetName,
      'appearanceName': appearanceName
    }));
    const _0x69d61b = _0x313f9e['querySelector']?.('[data-person-replacement-mapping-scope-menu]');
    if (!_0x69d61b) {
      _0x400219 = null;
      return ![];
    }
    const _0x44b2c1 = _0x313f9e['getBoundingClientRect']?.();
    const _0x5b7a35 = _0x5b5727["getBoundingClientRect"]?.();
    const _0x5079fd = _0x69d61b['getBoundingClientRect']?.();
    if (_0x44b2c1 && _0x5b7a35 && _0x5079fd) {
      const _0x310a23 = _0x5079fd["width"] || 0x104;
      const _0x1f8afb = _0x5079fd["height"] || 0xaa;
      const _0x49109f = Number["isFinite"](Number(_0x452d10)) ? Number(_0x452d10) : _0x5b7a35['right'];
      const _0x56559f = Number['isFinite'](Number(_0x227f68)) ? Number(_0x227f68) : _0x5b7a35["top"];
      const _0x48636d = clamp(_0x49109f - _0x44b2c1["left"] - _0x310a23 / 0x2, 0xc, _0x44b2c1["width"] - _0x310a23 - 0xc, 0xc);
      const _0x2e1468 = _0x56559f - _0x44b2c1["top"] + 0xa;
      const _0x5c800f = _0x2e1468 + _0x1f8afb <= _0x44b2c1["height"] - 0xc ? _0x2e1468 : clamp(_0x56559f - _0x44b2c1["top"] - _0x1f8afb - 0xa, 0xc, _0x44b2c1['height'] - _0x1f8afb - 0xc, 0xc);
      _0x69d61b["style"]?.["setProperty"]?.("--person-replacement-mapping-scope-left", _0x48636d + 'px');
      _0x69d61b["style"]?.["setProperty"]?.("--person-replacement-mapping-scope-top", _0x5c800f + 'px');
    }
    _0x69d61b["querySelector"]?.("[data-person-replacement-mapping-scope='current']")?.["focus"]?.();
    return !![];
  };
  const _0x5e3e48 = (_0x1bc3bc, _0x1b0ee8) => requestPersonReplacementLibraryAssignment({
    'project': _0x2547c2,
    'selectedAssetIds': _0x1bc3bc,
    'targetKind': _0x1b0ee8,
    'root': _0x313f9e,
    'documentObject': documentObject,
    'windowObject': windowObject,
    'hasWorkspaceIntent': _0x5ad063,
    'runIntent': _0x1aea64
  });
  const _0x216894 = _0xa960d7 => {
    if (_0x491710?.["handleClick"](_0xa960d7)) {
      return;
    }
    const _0x30ae8c = _0x432607;
    _0x432607 = null;
    if (_0x30ae8c && (_0xa960d7["target"] === _0x30ae8c || _0x30ae8c["contains"]?.(_0xa960d7["target"]))) {
      _0xa960d7["preventDefault"]?.();
      _0xa960d7["stopPropagation"]?.();
      return;
    }
    if (_0x594c8d["handleClick"](_0xa960d7)) {
      return;
    }
    !_0xa960d7['target']?.["closest"]?.('[data-person-replacement-output-menu]') && _0x49c6e0();
    !_0xa960d7['target']?.["closest"]?.('.person-replacement-library-add-menu-wrap') && _0x34e3ac();
    !_0xa960d7["target"]?.["closest"]?.('.person-replacement-add-voice-menu-wrap') && _0x2b3919();
    if (_0x7b425c["toggleFromTarget"](_0xa960d7["target"])) {
      return;
    }
    if (_0x49bdfd?.['consumeClick']?.(_0xa960d7)) {
      return;
    }
    if (!_0xa960d7["target"]?.["closest"]?.(".story-home-param-picker")) {
      _0x50d3b1();
    }
    !_0xa960d7['target']?.["closest"]?.("[data-person-replacement-detection-picker]") && _0x2e5978();
    if (_0x14651f(_0xa960d7)) {
      return;
    }
    const _0x2de663 = _0xa960d7["target"]?.["closest"]?.("[data-person-replacement-shot-cut-timeline]");
    if (_0x545ea6["isOpen"] && _0x2de663 && Number(_0xa960d7["detail"]) > 0x0 && !_0xa960d7["target"]?.["closest"]?.('[data-person-replacement-cut-boundary-index]')) {
      _0xa960d7["preventDefault"]?.();
      _0x5179f5(_0x1e1311(_0xa960d7, _0x2de663));
      return;
    }
    const _0x1f325d = _0xa960d7["target"]?.["closest"]?.('[data-story-asset-name-id]');
    if (_0x1f325d && _0x313f9e["contains"](_0x1f325d)) {
      _0xa960d7["preventDefault"]?.();
      _0xa960d7["stopPropagation"]?.();
      _0x457764();
      _0x29099d(_0x1f325d);
      return;
    }
    const _0x196267 = _0xa960d7["target"]?.["closest"]?.('[data-story-home-param-trigger=\x22asset-preset\x22]');
    if (_0x196267 && _0x313f9e['contains'](_0x196267)) {
      const _0x4ba099 = _0x196267["closest"]?.(".story-home-param-picker");
      const _0x2fcf4f = !_0x4ba099?.["classList"]?.["contains"]?.("is-open");
      _0x50d3b1(_0x4ba099);
      _0x4ba099?.["classList"]?.["toggle"]?.("is-open", _0x2fcf4f);
      _0x196267['setAttribute']?.('aria-expanded', String(_0x2fcf4f));
      return;
    }
    const _0x159b25 = _0xa960d7["target"]?.["closest"]?.("[data-story-asset-preset-option]");
    if (_0x159b25 && _0x313f9e["contains"](_0x159b25)) {
      _0x5ad5fa({
        ..._0x2547c2,
        'workspace': {
          ..._0x2547c2['workspace'],
          'assetPromptPresetId': a1289_0x4ead1a(_0x159b25["dataset"]["storyAssetPresetOption"])
        }
      }, "asset-prompt-preset");
      return;
    }
    const _0xccd4a2 = _0xa960d7["target"]?.['closest']?.('[data-ref-remove-action]');
    if (_0xccd4a2 && _0x313f9e['contains'](_0xccd4a2)) {
      const _0x279307 = normalizeText(_0xccd4a2["dataset"]["refRemoveAction"]);
      if (["clear-person-replacement-target", "clear-person-replacement-scene-reference"]["includes"](_0x279307)) {
        _0xa960d7["preventDefault"]?.();
        let _0x4694b3 = null;
        try {
          _0x4694b3 = JSON["parse"](_0xccd4a2["dataset"]["refRemoveValue"] || '{}');
        } catch {
          _0x4694b3 = null;
        }
        if (_0x4694b3 && _0x279307 === "clear-person-replacement-target") {
          _0x177a0e(_0x4694b3, "person-mapping-clear-reference");
        } else {
          _0x4694b3 && _0x279307 === "clear-person-replacement-scene-reference" && _0x4a9557({
            'shotId': _0x4694b3["shotId"]
          }, "scene-reference-clear");
        }
        return;
      }
    }
    const _0x4158e6 = _0xa960d7["target"]?.["closest"]?.("[data-person-replacement-video-reference-inputs] .ref-thumb-delete");
    if (_0x4158e6 && _0x313f9e["contains"](_0x4158e6)) {
      const _0x4d6a17 = _0x4158e6["closest"]?.("[data-slot]");
      _0x4d6a17 && (_0xa960d7["preventDefault"]?.(), _0x1aea64(_0x4b5931["REMOVE_REPLACEMENT_VIDEO_INPUT"], {
        'shotId': _0x2547c2["workspace"]['selectedShotId'],
        'slotId': _0x4d6a17["dataset"]["slot"],
        'kind': _0x4d6a17["dataset"]["kind"],
        'modelId': _0x2547c2["settings"]["replacementModelId"]
      }, {}, {
        'applyCallbackResult': ![]
      }));
      return;
    }
    const _0x59e9ff = _0xa960d7["target"]?.['closest']?.('[data-person-replacement-video-reference-inputs]\x20.ref-upload-slot[data-slot]');
    if (_0x59e9ff && _0x313f9e["contains"](_0x59e9ff)) {
      const _0x137c64 = normalizeText(_0x59e9ff["dataset"]["kind"]);
      _0x282314 = {
        'kind': _0x137c64,
        'shotId': _0x2547c2['workspace']["selectedShotId"],
        'slotId': _0x59e9ff["dataset"]["slot"],
        'modelId': _0x2547c2["settings"]["replacementModelId"]
      };
      const _0x45e061 = _0x313f9e['querySelector']?.("[data-person-replacement-input='replacement-video-slot']");
      _0x45e061 && (_0x45e061["accept"] = _0x137c64 === "image" ? "image/*" : 'video/*', _0x45e061['click']?.());
      return;
    }
    const _0xc8af22 = _0xa960d7["target"]?.["closest"]?.("[data-story-asset-id]");
    if (_0xc8af22 && _0x313f9e["contains"](_0xc8af22)) {
      const _0x357388 = normalizeText(_0xc8af22["dataset"]["storyAssetId"]);
      if (_0xc8af22["dataset"]["personReplacementShotCard"] === "true") {
        const _0x5a41e0 = resolveWorkspaceCardMultiSelection({
          'selectedIds': _0x2547c2["workspace"]["selectedShotIds"],
          'itemId': _0x357388,
          'activeItemId': _0x2547c2["workspace"]["selectedShotId"],
          'selectionMode': _0x2547c2["workspace"]["shotSelectionMode"],
          'shiftKey': _0xa960d7["shiftKey"] === !![]
        });
        _0x5a41e0["handled"] ? _0x5ad5fa({
          ..._0x2547c2,
          'workspace': {
            ..._0x2547c2["workspace"],
            'shotSelectionMode': !![],
            'selectedShotIds': _0x5a41e0["selectedIds"]
          }
        }, "shot-selection") : _0x8d81b4(_0x357388);
      } else {
        if (_0x2547c2["workspace"]['step'] === 0x2 && _0xc8af22["dataset"]['personReplacementReplacementAssetKind'] === 'scene') {
          if (_0x2547c2["workspace"]["selectedSceneId"] === _0x357388) {
            return;
          }
          _0x5ad5fa({
            ..._0x2547c2,
            'workspace': {
              ..._0x2547c2["workspace"],
              'selectedSceneId': _0x357388
            }
          }, "replacement-scene-asset-select");
        } else {
          if (_0x2547c2['workspace']["step"] === 0x2 && _0xc8af22["dataset"]['personReplacementTargetCharacterId']) {
            if (_0x2547c2["workspace"]["selectedCharacterId"] === _0x357388) {
              return;
            }
            _0x5ad5fa({
              ..._0x2547c2,
              'workspace': {
                ..._0x2547c2['workspace'],
                'selectedCharacterId': _0x357388
              }
            }, "replacement-target-asset-select");
          } else {
            if (_0x2547c2["workspace"]["characterAssetTab"] === "audio") {
              _0x5ad5fa({
                ..._0x2547c2,
                'workspace': {
                  ..._0x2547c2['workspace'],
                  'selectedAudioAssetId': _0x357388,
                  'assetSelectionMode': ![],
                  'selectedAssetIds': []
                }
              }, 'audio-library-asset-select');
            } else {
              if (_0x2547c2["workspace"]['characterAssetTab'] === "scene") {
                const _0x186102 = resolveWorkspaceCardMultiSelection({
                  'selectedIds': _0x2547c2["workspace"]["selectedAssetIds"],
                  'itemId': _0x357388,
                  'activeItemId': _0x2547c2["workspace"]["selectedSceneId"],
                  'selectionMode': _0x2547c2["workspace"]['assetSelectionMode'],
                  'shiftKey': _0xa960d7["shiftKey"] === !![]
                });
                _0x5ad5fa({
                  ..._0x2547c2,
                  'workspace': {
                    ..._0x2547c2["workspace"],
                    ...(_0x186102["handled"] ? {
                      'assetSelectionMode': _0x186102["selectionMode"],
                      'selectedAssetIds': _0x186102['selectedIds']
                    } : {
                      'selectedSceneId': _0x357388
                    })
                  }
                }, _0x186102["handled"] ? "scene-asset-selection" : 'scene-asset-select');
              } else {
                if (_0x2547c2["workspace"]["characterAssetTab"] === 'library') {
                  const _0x518472 = _0x2547c2["libraryAssets"]["find"](_0x5c2510 => _0x5c2510['id'] === _0x357388);
                  const _0x18cdb8 = resolveWorkspaceCardMultiSelection({
                    'selectedIds': _0x2547c2["workspace"]["selectedAssetIds"],
                    'itemId': _0x357388,
                    'activeItemId': _0x2547c2["workspace"]["selectedLibraryAssetId"],
                    'selectionMode': _0x2547c2['workspace']['assetSelectionMode'],
                    'shiftKey': _0xa960d7["shiftKey"] === !![],
                    'enabled': Boolean(normalizeText(_0x518472?.["mediaKind"])["toLowerCase"]() === "image" && normalizeText(_0x518472?.["sourceUrl"] || _0x518472?.["imageUrl"]) || normalizeText(_0x518472?.['mediaKind'])['toLowerCase']() === "audio" && getPersonReplacementLibraryAudioRef(_0x518472))
                  });
                  _0x5ad5fa({
                    ..._0x2547c2,
                    'workspace': {
                      ..._0x2547c2["workspace"],
                      'selectedLibraryAssetId': _0x357388,
                      ...(_0x18cdb8["handled"] ? {
                        'assetSelectionMode': !![],
                        'selectedAssetIds': _0x18cdb8['selectedIds']
                      } : {})
                    }
                  }, "library-asset-select");
                } else {
                  const _0xc7702f = resolveWorkspaceCardMultiSelection({
                    'selectedIds': _0x2547c2["workspace"]['selectedAssetIds'],
                    'itemId': _0x357388,
                    'activeItemId': _0x2547c2['workspace']['selectedCharacterId'],
                    'selectionMode': _0x2547c2['workspace']["assetSelectionMode"],
                    'shiftKey': _0xa960d7["shiftKey"] === !![]
                  });
                  _0x5ad5fa({
                    ..._0x2547c2,
                    'workspace': {
                      ..._0x2547c2['workspace'],
                      ...(_0xc7702f["handled"] ? {
                        'assetSelectionMode': _0xc7702f["selectionMode"],
                        'selectedAssetIds': _0xc7702f["selectedIds"]
                      } : {
                        'selectedCharacterId': _0x357388
                      })
                    }
                  }, _0xc7702f["handled"] ? "asset-selection" : "asset-select");
                }
              }
            }
          }
        }
      }
      return;
    }
    const _0x2eecc5 = _0xa960d7["target"]?.["closest"]?.('[data-story-action]');
    if (_0x2eecc5 && _0x313f9e['contains'](_0x2eecc5)) {
      _0x1fc5b8(_0x2eecc5, normalizeText(_0x2eecc5['dataset']["storyAction"]));
      return;
    }
    const _0x33276f = _0xa960d7["target"]?.['closest']?.("[data-story-open-project]");
    if (_0x33276f && _0x313f9e["contains"](_0x33276f) && !_0xa960d7["target"]?.["closest"]?.("[data-story-project-title]")) {
      _0x1aea64(_0x4b5931["OPEN_PROJECT"], _0x33276f["dataset"]["storyOpenProject"]);
      return;
    }
    _0x2547c2["workspace"]["view"] === "home" && !_0xa960d7["target"]?.['closest']?.("[data-story-project-sort-wrap]") && _0xf15a3d(![]);
    _0x2547c2['workspace']["view"] === "home" && _0x2547c2["workspace"]["openProjectMenuId"] && !_0xa960d7['target']?.["closest"]?.("[data-story-project-menu-wrap]") && (_0x2547c2 = a1289_0x2fb27f({
      ..._0x2547c2,
      'workspace': {
        ..._0x2547c2["workspace"],
        'openProjectMenuId': ''
      }
    }), _0x313f9e?.["querySelectorAll"]?.(".story-project-card.is-menu-open")?.['forEach']?.(_0x5957ae => {
      _0x5957ae["classList"]?.["remove"]?.('is-menu-open');
      const _0x395337 = _0x5957ae["querySelector"]?.("[data-story-action='toggle-project-menu']");
      const _0x429886 = _0x5957ae["querySelector"]?.("[data-story-project-menu]");
      _0x395337?.["setAttribute"]?.("aria-expanded", "false");
      _0x429886?.['setAttribute']?.("aria-hidden", 'true');
      if (_0x429886) {
        _0x429886["hidden"] = !![];
      }
    }));
    if (_0xa960d7["target"]?.["closest"]?.("[data-person-replacement-cut-boundary-index]")) {
      return;
    }
    const _0x2479e0 = _0xa960d7['target']?.['closest']?.("[data-person-replacement-action]");
    if (!_0x2479e0 || !_0x313f9e['contains'](_0x2479e0)) {
      return;
    }
    const _0x528fd1 = _0x2479e0["dataset"]['personReplacementAction'];
    if (_0x528fd1 === "confirm-person-mapping-scope") {
      const _0x307624 = _0x400219?.["mapping"];
      const _0xc6ea8a = normalizeText(_0x2479e0["dataset"]["personReplacementMappingScope"])["toLowerCase"]() === "current" ? "current" : 'all';
      _0x3cc019();
      _0x307624 && _0x4fbb9c({
        ..._0x307624,
        'scope': _0xc6ea8a
      });
    } else {
      if (_0x528fd1 === 'close') {
        _0x55f975["close"]();
      } else {
        if (_0x528fd1 === "back-home") {
          _0x1aea64(_0x4b5931["BACK_HOME"], cloneJson(_0x2547c2));
        } else {
          if (_0x528fd1 === "open-project") {
            _0x1aea64(_0x4b5931["OPEN_PROJECT"], _0x2479e0["dataset"]["projectId"]);
          } else {
            if (_0x528fd1 === 'select-step') {
              _0x7544b9(_0x2479e0["dataset"]['personReplacementStep']);
            } else {
              if (_0x528fd1 === "previous-step") {
                _0x7544b9(_0x2547c2['workspace']["step"] - 0x1);
              } else {
                if (_0x528fd1 === "next-step") {
                  _0x7544b9(_0x2547c2["workspace"]["step"] + 0x1);
                } else {
                  if (_0x528fd1 === "set-video-input-mode") {
                    const _0x1b6d88 = _0x2479e0["dataset"]["personReplacementVideoInputMode"] === PERSON_REPLACEMENT_VIDEO_INPUT_MODE_CHARACTER_REFERENCE ? PERSON_REPLACEMENT_VIDEO_INPUT_MODE_CHARACTER_REFERENCE : PERSON_REPLACEMENT_VIDEO_INPUT_MODE_FIRST_FRAME;
                    if (_0x1b6d88 === _0x2547c2['settings']['replacementVideoInputMode']) {
                      return;
                    }
                    const _0x174503 = documentObject?.["activeElement"] === _0x2479e0;
                    const _0x3e2f2c = resolvePersonReplacementVideoParameterPolicy({
                      'modelId': _0x2547c2["settings"]['replacementModelId'],
                      'inputMode': _0x1b6d88,
                      'generationParams': _0x2547c2["settings"]['replacementVideoGenerationParams'],
                      'resetModeDefaults': !![]
                    });
                    _0x5ad5fa({
                      ..._0x2547c2,
                      'settings': {
                        ..._0x2547c2["settings"],
                        'replacementVideoInputMode': _0x1b6d88,
                        'replacementVideoGenerationParams': _0x3e2f2c["generationParams"]
                      }
                    }, "video-input-mode");
                    if (_0x174503) {
                      _0x313f9e["querySelector"]('[data-person-replacement-action=\x22set-video-input-mode\x22]')?.["focus"]?.({
                        'preventScroll': !![]
                      });
                    }
                  } else {
                    if (_0x528fd1 === 'select-voice-source') {
                      _0x557032(_0x2479e0["dataset"]["sourceId"]);
                    } else {
                      if (_0x528fd1 === "extract-clean-voice") {
                        _0x1aea64(_0x4b5931["EXTRACT_VOICE"], _0x2479e0["dataset"]["sourceId"], {}, {
                          'applyCallbackResult': ![]
                        });
                      } else {
                        if (_0x528fd1 === "cancel-voice-separation") {
                          _0x1aea64(_0x4b5931['CANCEL_VOICE_EXTRACTION'], _0x2479e0["dataset"]["sourceId"], {}, {
                            'applyCallbackResult': ![]
                          });
                        } else {
                          if (_0x528fd1 === "select-voice-asset") {
                            _0x52da3a(_0x2479e0["dataset"]["characterId"]);
                          } else {
                            if (_0x528fd1 === 'choose-source-videos') {
                              _0x313f9e["querySelector"]("[data-person-replacement-input='source-videos']")?.['click']?.();
                            } else {
                              if (_0x528fd1 === "remove-source") {
                                _0x1aea64(_0x4b5931["REMOVE_SOURCE"], {
                                  'sourceId': _0x2479e0['dataset']['sourceId']
                                });
                              } else {
                                if (_0x528fd1 === "choose-new-character-images") {
                                  _0x313f9e["querySelector"]("[data-person-replacement-input='new-character-images']")?.["click"]?.();
                                } else {
                                  if (_0x528fd1 === "choose-new-scene-images") {
                                    _0x313f9e['querySelector']("[data-person-replacement-input='new-scene-images']")?.["click"]?.();
                                  } else {
                                    if (_0x528fd1 === 'choose-new-audio-files') {
                                      _0x313f9e['querySelector']("[data-person-replacement-input='new-audio-files']")?.["click"]?.();
                                    } else {
                                      if (_0x528fd1 === "cancel-character-voice-library") {
                                        const _0x24f98a = _0x2281fc;
                                        _0x2281fc = '';
                                        _0x5ad5fa({
                                          ..._0x2547c2,
                                          'workspace': {
                                            ..._0x2547c2["workspace"],
                                            'characterAssetTab': 'character',
                                            'selectedCharacterId': _0x24f98a || _0x2547c2["workspace"]["selectedCharacterId"],
                                            'assetSelectionMode': ![],
                                            'selectedAssetIds': []
                                          }
                                        }, "character-voice-library-cancel");
                                      } else {
                                        if (_0x528fd1 === 'confirm-character-voice-library') {
                                          const _0x3187b7 = _0x2281fc;
                                          const _0x4f0257 = normalizeText(_0x2479e0["dataset"]["personReplacementAudioAssetId"]);
                                          const _0x27dbc6 = _0x2547c2['audioAssets']["find"](_0x249a5a => _0x249a5a['id'] === (_0x4f0257 || _0x2547c2['workspace']["selectedAudioAssetId"]) && normalizeText(_0x249a5a?.['mediaKind'])['toLowerCase']() === 'audio');
                                          if (!_0x3187b7 || !getPersonReplacementLibraryAudioRef(_0x27dbc6)) {
                                            windowObject?.['showToast']?.('请选择要添加的人设声音。', 'warn');
                                            return;
                                          }
                                          const _0x56e83c = _0x1502ee => {
                                            if (!_0x1502ee) {
                                              return;
                                            }
                                            _0x2281fc = '';
                                            _0x5ad5fa({
                                              ..._0x2547c2,
                                              'workspace': {
                                                ..._0x2547c2["workspace"],
                                                'characterAssetTab': "character",
                                                'selectedCharacterId': _0x3187b7,
                                                'assetSelectionMode': ![],
                                                'selectedAssetIds': []
                                              }
                                            }, "character-voice-library-confirm");
                                          };
                                          const _0x5c2120 = _0x1aea64(_0x4b5931["SELECT_CHARACTER_VOICE_LIBRARY"], {
                                            'characterId': _0x3187b7,
                                            'asset': cloneJson(_0x27dbc6)
                                          });
                                          if (_0x5c2120?.["then"]) {
                                            void _0x5c2120["then"](_0x56e83c);
                                          } else {
                                            _0x56e83c(_0x5c2120);
                                          }
                                        } else {
                                          if (_0x528fd1 === "toggle-library-add-targets") {
                                            const _0x202950 = _0x2479e0["closest"]?.(".person-replacement-library-add-menu-wrap");
                                            const _0x300933 = !_0x202950?.['classList']?.['contains']?.("is-open");
                                            _0x34e3ac(_0x202950);
                                            _0x39fd0d(_0x202950, _0x300933);
                                          } else {
                                            if (_0x528fd1 === "add-library-assets-to-project" || _0x528fd1 === "add-library-assets-to-characters") {
                                              const _0xa0ec39 = normalizeText(_0x2479e0["dataset"]["personReplacementLibraryTargetKind"]);
                                              const _0x2cad5c = _0x528fd1 === 'add-library-assets-to-characters' ? "character" : ["character", "scene", 'audio']["includes"](_0xa0ec39) ? _0xa0ec39 : 'character';
                                              _0x39fd0d(_0x2479e0['closest']?.('.person-replacement-library-add-menu-wrap'), ![]);
                                              const _0x4b534c = _0x2547c2['workspace']['assetSelectionMode'] ? _0x2547c2["workspace"]["selectedAssetIds"] : [_0x2547c2["workspace"]["selectedLibraryAssetId"]];
                                              _0x5e3e48(_0x4b534c, _0x2cad5c);
                                            } else {
                                              if (_0x528fd1 === "select-character-asset-tab") {
                                                const _0x2cb40e = normalizeText(_0x2479e0["dataset"]["assetTab"]);
                                                const _0xe8cf = ["character", "scene", "audio", 'library']["includes"](_0x2cb40e) ? _0x2cb40e : "character";
                                                const _0x5c043e = _0xe8cf === "library" ? _0x4cd68f(_0x2547c2) : _0x2547c2;
                                                const _0x449980 = _0xe8cf === "audio" ? getPersonReplacementProjectAudioAssets(_0x5c043e) : [];
                                                const _0x1d8189 = _0xe8cf === "audio" ? _0x449980["some"](_0xe22e4e => _0xe22e4e['id'] === _0x5c043e['workspace']["selectedAudioAssetId"]) ? _0x5c043e["workspace"]["selectedAudioAssetId"] : _0x449980[0x0]?.['id'] || '' : _0x5c043e['workspace']["selectedAudioAssetId"];
                                                if (_0xe8cf !== "audio") {
                                                  _0x2281fc = '';
                                                }
                                                _0x5ad5fa({
                                                  ..._0x5c043e,
                                                  'workspace': {
                                                    ..._0x5c043e["workspace"],
                                                    'characterAssetTab': _0xe8cf,
                                                    'selectedAudioAssetId': _0x1d8189,
                                                    'assetSelectionMode': ![],
                                                    'selectedAssetIds': []
                                                  }
                                                }, "character-asset-tab");
                                              } else {
                                                if (_0x528fd1 === "toggle-smart-clip-settings") {
                                                  _0x1e6410({
                                                    'workspace': {
                                                      'smartClipSettingsOpen': !_0x2547c2["workspace"]['smartClipSettingsOpen']
                                                    }
                                                  });
                                                } else {
                                                  if (_0x528fd1 === "set-smart-clip-mode") {
                                                    _0x1e6410({
                                                      'settings': {
                                                        'smartClipMode': _0x2479e0["dataset"]["smartClipMode"]
                                                      }
                                                    }, {
                                                      'notify': !![]
                                                    });
                                                  } else {
                                                    if (_0x528fd1 === "set-smart-clip-fps") {
                                                      _0x1e6410({
                                                        'settings': {
                                                          'smartClipFps': Number(_0x2479e0['dataset']["smartClipFps"])
                                                        }
                                                      }, {
                                                        'notify': !![]
                                                      });
                                                    } else {
                                                      if (_0x528fd1 === "process-sources") {
                                                        _0x1aea64(_0x4b5931['PROCESS_SOURCES'], {
                                                          'mode': _0x2479e0['dataset']["processingMode"]
                                                        });
                                                      } else {
                                                        if (_0x155aa0["handleAction"](_0x528fd1, {
                                                          'target': _0x2479e0,
                                                          'event': _0xa960d7
                                                        })) {} else {
                                                          if (_0x528fd1 === "select-shot") {
                                                            _0x3657a3({
                                                              'animate': ![],
                                                              'renderWorkspace': ![]
                                                            });
                                                            _0x8d81b4(_0x2479e0["dataset"]["shotId"]);
                                                          } else {
                                                            if (_0x528fd1 === "select-composite-full-video") {
                                                              buildPersonReplacementCompositePreviewSnapshot(_0x2547c2)["fullAvailable"] && _0x5ad5fa({
                                                                ..._0x2547c2,
                                                                'workspace': {
                                                                  ..._0x2547c2["workspace"],
                                                                  'compositePreviewMode': "full"
                                                                }
                                                              }, 'composite-full-video-select');
                                                            } else {
                                                              if (_0x528fd1 === 'toggle-source-identity-selection') {
                                                                const _0x2d912d = normalizeText(_0x2479e0['dataset']["sourceCharacterId"]);
                                                                const _0x59586b = new Set(_0x2547c2["workspace"]['selectedIdentityIds']);
                                                                if (_0x59586b["has"](_0x2d912d)) {
                                                                  _0x59586b['delete'](_0x2d912d);
                                                                } else {
                                                                  _0x59586b["add"](_0x2d912d);
                                                                }
                                                                _0x5ad5fa({
                                                                  ..._0x2547c2,
                                                                  'workspace': {
                                                                    ..._0x2547c2['workspace'],
                                                                    'selectedIdentityIds': [..._0x59586b]
                                                                  }
                                                                }, "identity-selection");
                                                              } else {
                                                                if (_0x528fd1 === 'merge-source-identities') {
                                                                  _0x1aea64(_0x4b5931["MERGE_SOURCE_IDENTITIES"], {
                                                                    'sourceCharacterIds': _0x2547c2["workspace"]["selectedIdentityIds"]
                                                                  });
                                                                } else {
                                                                  if (_0x528fd1 === "toggle-detection-picker") {
                                                                    const _0x264b42 = _0x2479e0['closest']?.("[data-person-replacement-detection-picker]");
                                                                    const _0x42b903 = !_0x264b42?.['classList']?.['contains']?.("is-open");
                                                                    _0x2e5978(_0x264b42);
                                                                    _0x6e2fc3(_0x264b42, _0x42b903);
                                                                  } else {
                                                                    if (_0x528fd1 === "select-detection-picker-option") {
                                                                      const _0x4fa890 = _0x2479e0['closest']?.("[data-person-replacement-detection-picker]");
                                                                      const _0x40db57 = normalizeText(_0x4fa890?.["dataset"]?.["personReplacementDetectionPicker"]);
                                                                      const _0x4be08b = normalizeText(_0x2479e0["dataset"]['personReplacementDetectionPickerOption']);
                                                                      const _0x3454c1 = normalizeText(_0x2479e0["querySelector"]?.("span")?.["textContent"], _0x4be08b);
                                                                      const _0x2361fd = normalizeText(_0x2479e0["dataset"]["personReplacementSourceCharacterId"]);
                                                                      const _0x689f9d = _0x4fa890?.["querySelector"]?.("[data-person-replacement-detection-picker-trigger]");
                                                                      const _0x5965d2 = _0x689f9d?.["querySelector"]?.("[data-person-replacement-detection-picker-value]");
                                                                      const _0x10dfbd = _0x40db57 === 'label' && _0x4be08b === PERSON_REPLACEMENT_CUSTOM_LABEL_VALUE;
                                                                      _0x10dfbd && _0x689f9d && (_0x4fa890['dataset']["personReplacementPreviousValue"] = normalizeText(_0x689f9d["value"]), _0x4fa890["dataset"]["personReplacementPreviousLabel"] = normalizeText(_0x5965d2?.["textContent"]), _0x4fa890["dataset"]['personReplacementPreviousSourceCharacterId'] = normalizeText(_0x689f9d['dataset']?.['personReplacementSelectedSourceCharacterId']));
                                                                      _0x689f9d && (_0x689f9d['value'] = _0x4be08b, _0x40db57 === "label" && !_0x10dfbd && (_0x689f9d["dataset"]["personReplacementSelectedSourceCharacterId"] = _0x2361fd), _0x689f9d["setAttribute"]('aria-label', (_0x40db57 === "label" ? "人物名称" : _0x40db57 === 'scope' ? "替换范围" : "人物朝向") + '：' + _0x3454c1));
                                                                      if (_0x5965d2) {
                                                                        _0x5965d2["textContent"] = _0x3454c1;
                                                                      }
                                                                      _0x4fa890?.["querySelectorAll"]?.('[data-person-replacement-detection-picker-option]')?.["forEach"]?.(_0x5d82ac => {
                                                                        const _0x14622e = _0x5d82ac === _0x2479e0;
                                                                        _0x5d82ac["classList"]?.['toggle']?.("is-selected", _0x14622e);
                                                                        _0x5d82ac["setAttribute"]?.("aria-selected", String(_0x14622e));
                                                                      });
                                                                      if (_0x40db57 === "label") {
                                                                        const _0x57be05 = _0x4fa890?.["querySelector"]?.("[data-person-replacement-person-custom-label]");
                                                                        const _0xb652a4 = _0x4be08b === PERSON_REPLACEMENT_CUSTOM_LABEL_VALUE;
                                                                        if (_0x689f9d) {
                                                                          _0x689f9d["hidden"] = _0xb652a4;
                                                                        }
                                                                        _0x57be05 && (_0x57be05["hidden"] = !_0xb652a4, _0xb652a4 && (_0x57be05['value'] = '', _0x57be05["focus"]?.()));
                                                                      }
                                                                      _0x6e2fc3(_0x4fa890, ![]);
                                                                      const _0x52f0dc = _0x4fa890?.["closest"]?.(".person-replacement-detection-box");
                                                                      if (_0x40db57 === "orientation") {
                                                                        const _0xa1c6ea = _0x52f0dc?.["querySelector"]?.("[data-person-replacement-person-label]");
                                                                        _0x171208({
                                                                          'detectionBox': _0x52f0dc,
                                                                          'label': _0xa1c6ea?.['querySelector']?.("[data-person-replacement-detection-picker-value]")?.["textContent"],
                                                                          'sourceCharacterId': _0xa1c6ea?.["dataset"]?.["personReplacementSelectedSourceCharacterId"],
                                                                          'orientation': _0x4be08b
                                                                        });
                                                                      } else {
                                                                        if (_0x40db57 === "scope") {
                                                                          _0x1aea64(_0x4b5931['UPDATE_PEOPLE'], {
                                                                            'shotId': normalizeText(_0x52f0dc?.["dataset"]?.['shotId'] || _0x2547c2["workspace"]["selectedShotId"]),
                                                                            'updates': [{
                                                                              'personId': normalizeText(_0x52f0dc?.['dataset']?.["personId"]),
                                                                              'replacementScope': _0x4be08b
                                                                            }]
                                                                          });
                                                                        } else {
                                                                          _0x4be08b !== PERSON_REPLACEMENT_CUSTOM_LABEL_VALUE && _0x171208({
                                                                            'detectionBox': _0x52f0dc,
                                                                            'label': _0x3454c1,
                                                                            'sourceCharacterId': _0x2361fd
                                                                          });
                                                                        }
                                                                      }
                                                                    } else {
                                                                      if (_0x528fd1 === 'delete-detection-custom-label') {
                                                                        const _0x4a7b1c = normalizeText(_0x2479e0["dataset"]["personReplacementCustomLabel"]);
                                                                        if (!_0x4a7b1c || isGeneratedPersonReplacementLabel(_0x4a7b1c)) {
                                                                          return;
                                                                        }
                                                                        const _0xdace7e = new Set(_0x2547c2["workspace"]["removedCustomPersonLabels"]);
                                                                        _0xdace7e["add"](_0x4a7b1c);
                                                                        _0x5ad5fa({
                                                                          ..._0x2547c2,
                                                                          'workspace': {
                                                                            ..._0x2547c2["workspace"],
                                                                            'removedCustomPersonLabels': [..._0xdace7e]
                                                                          }
                                                                        }, "person-custom-label-delete");
                                                                      } else {
                                                                        if (_0x528fd1 === "clear-person-mapping") {
                                                                          _0x177a0e({
                                                                            'shotId': _0x2479e0['dataset']['shotId'],
                                                                            'personId': _0x2479e0["dataset"]['personId']
                                                                          });
                                                                        } else {
                                                                          if (_0x528fd1 === 'delete-person') {
                                                                            _0x55ecef();
                                                                            _0x3e96f5(_0x4b5931['DELETE_PEOPLE'], {
                                                                              'shotId': _0x2479e0['dataset']["shotId"],
                                                                              'personIds': [_0x2479e0["dataset"]["personId"]]
                                                                            });
                                                                          } else {
                                                                            if (_0x528fd1 === 'clear-shot-people') {
                                                                              const _0x1ab166 = normalizeText(_0x2479e0['dataset']["shotId"] || _0x2547c2["workspace"]["selectedShotId"]);
                                                                              const _0x3cb434 = _0x2547c2["shots"]["find"](_0x21e88f => _0x21e88f['id'] === _0x1ab166);
                                                                              const _0x2b5a9e = a1289_0x1cfc78(_0x3cb434)["map"](_0xce9f1d => normalizeText(_0xce9f1d['id']))['filter'](Boolean);
                                                                              if (!_0x2b5a9e["length"]) {
                                                                                return;
                                                                              }
                                                                              _0x55ecef();
                                                                              _0xe62c16();
                                                                              _0x3e96f5(_0x4b5931["DELETE_PEOPLE"], {
                                                                                'shotId': _0x1ab166,
                                                                                'personIds': _0x2b5a9e
                                                                              });
                                                                            } else {
                                                                              if (_0x528fd1 === "toggle-prompt-enhancement" || _0x528fd1 === "toggle-prompt-mode") {
                                                                                const _0x2240b7 = applyPersonReplacementPromptControlAction(_0x2547c2, _0x528fd1, _0x2479e0, _0x352c22()["generatingShotIds"]);
                                                                                if (!_0x2240b7) {
                                                                                  return;
                                                                                }
                                                                                _0x2547c2 = a1289_0x2fb27f({
                                                                                  ..._0x2547c2,
                                                                                  ..._0x2240b7["patch"]
                                                                                });
                                                                                syncPersonReplacementPromptModeControl(_0x313f9e, _0x2547c2, _0x352c22()["generatingShotIds"]);
                                                                                _0x25dce3(_0x2240b7["reason"]);
                                                                                if (_0x528fd1 === "toggle-prompt-mode") {
                                                                                  syncPersonReplacementImagePromptGate(_0x313f9e, _0x2547c2, _0x2106d9());
                                                                                }
                                                                              } else {
                                                                                if (_0x528fd1 === "generate-replacement-image") {
                                                                                  if (_0x2547c2["workspace"]['shotSelectionMode']) {
                                                                                    if (_0xd2f99d()) {
                                                                                      _0x35aaa5();
                                                                                      return;
                                                                                    }
                                                                                    _0x54261d("image");
                                                                                    return;
                                                                                  }
                                                                                  const _0x1327d8 = personReplacementImagePresentation["build"](_0x2547c2);
                                                                                  const _0x2b7669 = _0x1327d8["selectedShot"];
                                                                                  const _0x272ff5 = _0x1327d8["gate"]["duplicateRoleLabels"];
                                                                                  if (!_0x1327d8["gate"]["sceneOnly"] && _0x272ff5['length']) {
                                                                                    windowObject?.["showToast"]?.("同一镜头内角色不能重复：" + _0x272ff5["join"]('、') + "。请修改红色框中的角色名。", "warn");
                                                                                    return;
                                                                                  }
                                                                                  if (!_0x1327d8["gate"]["sceneOnly"] && _0x1327d8['gate']["unresolvedOrientationPersonIds"]["length"]) {
                                                                                    windowObject?.['showToast']?.("还有 " + _0x1327d8["gate"]["unresolvedOrientationPersonIds"]["length"] + " 个人物未确认朝向，请先选择朝向。", "warn");
                                                                                    return;
                                                                                  }
                                                                                  const _0x4ffb2c = _0x313f9e?.["querySelector"]?.("[data-person-replacement-keyframe-stage] > img");
                                                                                  _0x1aea64(_0x4b5931["GENERATE_REPLACEMENT_IMAGE"], {
                                                                                    'projectId': _0x2547c2['id'],
                                                                                    'shotId': _0x2547c2["workspace"]["selectedShotId"],
                                                                                    'sourceImageSize': resolvePersonReplacementSourceImageSize(_0x4ffb2c, _0x2b7669)
                                                                                  }, {}, {
                                                                                    'applyCallbackResult': ![]
                                                                                  });
                                                                                } else {
                                                                                  if (_0x528fd1 === "generate-replacement-video") {
                                                                                    if (_0x2547c2['workspace']["shotSelectionMode"]) {
                                                                                      if (_0xd2f99d()) {
                                                                                        _0x35aaa5();
                                                                                        return;
                                                                                      }
                                                                                      _0x54261d("video");
                                                                                      return;
                                                                                    }
                                                                                    const _0xbbb15b = _0x2547c2["workspace"]["selectedShotId"];
                                                                                    const _0x3eb90d = resolvePersonReplacementVideoGenerationState(_0x2547c2['workspace'], _0xbbb15b);
                                                                                    if (isPersonReplacementVideoGenerationActive(_0x3eb90d)) {
                                                                                      _0x1aea64(_0x4b5931["CANCEL_REPLACEMENT_VIDEO"], {
                                                                                        'projectId': _0x2547c2['id'],
                                                                                        'shotId': _0xbbb15b
                                                                                      }, {}, {
                                                                                        'applyCallbackResult': ![]
                                                                                      });
                                                                                      return;
                                                                                    }
                                                                                    _0x1aea64(_0x4b5931['GENERATE_REPLACEMENT_VIDEO'], {
                                                                                      'projectId': _0x2547c2['id'],
                                                                                      'shotId': _0xbbb15b
                                                                                    }, {}, {
                                                                                      'applyCallbackResult': ![]
                                                                                    });
                                                                                  } else {
                                                                                    if (_0x528fd1 === "trim-current-video") {
                                                                                      _0x37793c(_0x2479e0["dataset"]["shotId"]);
                                                                                    } else {
                                                                                      if (_0x528fd1 === "toggle-video-replacement-sync-playback") {
                                                                                        void _0x2e4219["toggleSyncEnabled"]();
                                                                                      } else {
                                                                                        if (_0x528fd1 === "toggle-comparison-playback") {
                                                                                          _0xd3e343["togglePlayback"]();
                                                                                        } else {
                                                                                          if (_0x528fd1 === "set-preview-track") {
                                                                                            _0x50e570(_0x2479e0["dataset"]["previewTrack"]);
                                                                                          } else {
                                                                                            if (_0x528fd1 === "compose-output") {
                                                                                              _0x1aea64(_0x4b5931['COMPOSE_OUTPUT'], cloneJson(_0x2547c2), {}, {
                                                                                                'applyCallbackResult': ![]
                                                                                              });
                                                                                            } else {
                                                                                              if (_0x528fd1 === 'toggle-output-menu') {
                                                                                                _0x5d03e7(_0x2479e0);
                                                                                              } else {
                                                                                                if (_0x528fd1 === 'sync-all-clips-to-canvas') {
                                                                                                  _0x49c6e0();
                                                                                                  _0x1aea64(_0x4b5931["ADD_OUTPUT_TO_CANVAS"], {
                                                                                                    'scope': PERSON_REPLACEMENT_CANVAS_SCOPES["CLIPS"],
                                                                                                    'project': cloneJson(_0x2547c2)
                                                                                                  }, {}, {
                                                                                                    'applyCallbackResult': ![]
                                                                                                  });
                                                                                                } else {
                                                                                                  if (_0x528fd1 === "sync-project-to-canvas") {
                                                                                                    _0x49c6e0();
                                                                                                    _0x1aea64(_0x4b5931['ADD_OUTPUT_TO_CANVAS'], {
                                                                                                      'scope': PERSON_REPLACEMENT_CANVAS_SCOPES["PROJECT"],
                                                                                                      'project': cloneJson(_0x2547c2)
                                                                                                    }, {}, {
                                                                                                      'applyCallbackResult': ![]
                                                                                                    });
                                                                                                  } else {
                                                                                                    Object['hasOwn']({
                                                                                                      'export-final-video': 0x1,
                                                                                                      'export-all-clips-and-images': 0x1,
                                                                                                      'export-premiere-xml': 0x1,
                                                                                                      'export-jianying-draft': 0x1
                                                                                                    }, _0x528fd1) && (_0x49c6e0(), _0x1aea64(_0x4b5931["EXPORT_OUTPUT"], {
                                                                                                      'mode': _0x528fd1["slice"]("export-"["length"]),
                                                                                                      'project': cloneJson(_0x2547c2)
                                                                                                    }, {}, {
                                                                                                      'applyCallbackResult': ![]
                                                                                                    }));
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
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  const _0x237087 = _0x559258 => {
    if (_0x559258["target"]?.["matches"]?.("[data-story-project-search]")) {
      const _0x2e6c39 = Number(_0x559258['target']["selectionStart"]);
      _0x2547c2 = a1289_0x2fb27f({
        ..._0x2547c2,
        'workspace': {
          ..._0x2547c2["workspace"],
          'projectSearchQuery': _0x559258["target"]["value"],
          'openProjectMenuId': '',
          'pendingDeleteProjectId': ''
        }
      });
      _0x559258["target"]["value"] = _0x2547c2["workspace"]["projectSearchQuery"];
      const _0x69831d = refreshWorkspaceProjectResultsInPlace({
        'root': _0x559258["target"]["closest"]?.(".story-home-page") || _0x313f9e,
        'documentObject': documentObject,
        'renderResults': () => personReplacementShellPresentation["renderHomeProjectResults"](_0x2547c2)
      });
      if (!_0x69831d) {
        _0x3567fe();
      }
      const _0x5455e0 = _0x69831d ? _0x559258["target"] : _0x313f9e?.["querySelector"]?.("[data-story-project-search]");
      _0x5455e0?.["focus"]?.();
      Number["isFinite"](_0x2e6c39) && _0x5455e0?.['setSelectionRange']?.(_0x2e6c39, _0x2e6c39);
      return;
    }
    if (_0x559258["target"]?.["matches"]?.('[data-story-project-title]')) {
      const _0x182375 = normalizeText(_0x559258["target"]["dataset"]["storyProjectTitle"]);
      _0x2547c2 = a1289_0x2fb27f({
        ..._0x2547c2,
        'libraryProjects': _0x2547c2['libraryProjects']['map'](_0x2e8264 => normalizeText(_0x2e8264?.['id']) === _0x182375 ? {
          ..._0x2e8264,
          'title': _0x559258['target']["value"]
        } : _0x2e8264)
      });
      return;
    }
    if (_0x559258["target"]?.["matches"]?.("[data-story-asset-prompt]")) {
      const _0x442e13 = _0x4fa679();
      const _0x462eaf = _0xee8fcb(_0x442e13);
      if (!_0x442e13 || !_0x462eaf) {
        return;
      }
      _0x2547c2 = a1289_0x2fb27f({
        ..._0x2547c2,
        'characters': _0x2547c2["characters"]["map"](_0x371849 => _0x371849['id'] === _0x442e13['id'] ? {
          ..._0x371849,
          'appearances': _0x371849["appearances"]["map"](_0x5a157a => _0x5a157a['id'] === _0x462eaf['id'] ? {
            ..._0x5a157a,
            'prompt': readPersonReplacementAssetPromptText(_0x559258["target"])
          } : _0x5a157a)
        } : _0x371849)
      });
      _0x25dce3("appearance-prompt");
      return;
    }
    if (_0x559258["target"]?.["dataset"]?.["personReplacementField"] === "image-prompt") {
      if (shouldSkipPromptTriggerForBulkInput(_0x559258)) {
        return;
      }
      const _0x3f26dc = _0x559258["target"]["dataset"]['shotId'];
      const _0xc96707 = _0x559258["target"]["matches"]?.("[contenteditable=\"true\"]") ? sanitizePromptHtmlForCommit(_0x559258["target"]['innerHTML']) : _0x559258['target']['value'];
      _0x2547c2 = a1289_0x2fb27f({
        ..._0x2547c2,
        'shots': _0x2547c2['shots']["map"](_0x2b2b1f => _0x2b2b1f['id'] === _0x3f26dc ? {
          ..._0x2b2b1f,
          'imagePrompt': _0xc96707
        } : _0x2b2b1f)
      });
      _0x25dce3("image-prompt");
      return;
    }
    _0x559258["target"]?.["dataset"]?.["personReplacementField"] === "video-prompt" && (_0x559258["type"] === "input" && checkSlashTrigger(_0x559258, {
      'promptEl': _0x559258['target'],
      'nodeType': "ai-video",
      'nodeId': '',
      'onPromptCommit': () => _0x4c8f88(_0x559258["target"], "video-prompt"),
      'onGenerate': (_0x47afe7, _0x951b79) => _0x3291e5(_0x559258["target"], _0x47afe7, _0x951b79)
    }), _0x4c8f88(_0x559258["target"]));
  };
  const _0x55384e = _0x5d22bf => {
    const _0x471108 = _0x5d22bf["target"]?.["dataset"]?.["personReplacementInput"];
    if (_0x471108) {
      const _0x501ef6 = Array["from"](_0x5d22bf["target"]["files"] || []);
      if (_0x471108 === "source-videos") {
        _0x4dcfca(_0x501ef6["filter"](a1289_0x5718e2));
      } else {
        if (_0x471108 === "new-character-images") {
          const _0x229068 = _0x501ef6['filter'](a1289_0x25bc7a);
          _0x229068["length"] && _0x8391a3('character', () => _0x10ec58(_0x229068));
        } else {
          if (_0x471108 === "new-scene-images") {
            const _0x25912a = _0x501ef6["filter"](a1289_0x25bc7a);
            _0x25912a['length'] && _0x8391a3("scene", () => _0x1aea64(_0x4b5931["SELECT_NEW_SCENE_IMAGES"], _0x25912a));
          } else {
            if (_0x471108 === "new-audio-files") {
              const _0x8fa224 = _0x501ef6["filter"](a1289_0x42b695);
              _0x8fa224["length"] && _0x8391a3('audio', () => _0x1aea64(_0x4b5931["SELECT_NEW_AUDIO_FILES"], _0x8fa224));
            } else {
              if (_0x471108 === "appearance-image" && _0x501ef6[0x0]) {
                _0x1aea64(_0x4b5931["SELECT_CHARACTER_REFERENCE"], _0x501ef6[0x0], _0x282314 || {});
              } else {
                if (_0x471108 === "replacement-image" && _0x501ef6[0x0]) {
                  _0x1aea64(_0x4b5931["SELECT_REPLACEMENT_IMAGE"], _0x501ef6[0x0], _0x282314 || {}, {
                    'applyCallbackResult': ![]
                  });
                } else {
                  if (_0x471108 === "replacement-video-result" && _0x501ef6[0x0]) {
                    const _0x7c7bf3 = _0x5e3e1e;
                    const _0x5b8a75 = _0x282314 || {};
                    void runWorkspaceVideoDownloadAction(_0x7c7bf3, () => Promise["resolve"](_0x1aea64(_0x4b5931["SELECT_REPLACEMENT_VIDEO_RESULT"], _0x501ef6[0x0], _0x5b8a75, {
                      'applyCallbackResult': ![]
                    })))["catch"](() => {});
                  } else {
                    if (_0x471108 === "replacement-video-slot" && _0x501ef6[0x0]) {
                      _0x1aea64(_0x4b5931["SELECT_REPLACEMENT_VIDEO_INPUT"], _0x501ef6[0x0], _0x282314 || {}, {
                        'applyCallbackResult': ![]
                      });
                    } else {
                      if (_0x471108 === 'character-voice' && _0x501ef6[0x0]) {
                        _0x1aea64(_0x4b5931["SELECT_CHARACTER_VOICE"], _0x501ef6[0x0], _0x282314 || {});
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      _0x5d22bf["target"]['value'] = '';
      _0x282314 = null;
      _0x5e3e1e = null;
      return;
    }
    if (_0x5d22bf["target"]?.["matches"]?.("[data-story-project-title]")) {
      const _0x5791e1 = normalizeText(_0x5d22bf["target"]["dataset"]['storyProjectTitle']);
      const _0x5d1b8b = normalizeText(_0x5d22bf["target"]["value"], "未命名人物替换项目");
      _0x5d22bf["target"]["value"] = _0x5d1b8b;
      _0x1aea64(_0x4b5931["RENAME_PROJECT"], {
        'projectId': _0x5791e1,
        'title': _0x5d1b8b
      });
    } else {
      if (_0x5d22bf["target"]?.['matches']?.("[data-person-replacement-composite-project-title]")) {
        const _0x439d64 = normalizeText(_0x5d22bf["target"]["value"]) || "未命名人物替换项目";
        _0x5d22bf["target"]["value"] = _0x439d64;
        _0x439d64 !== _0x2547c2['title'] && _0x1aea64(_0x4b5931['RENAME_PROJECT'], {
          'projectId': _0x2547c2['id'],
          'title': _0x439d64
        });
      } else {
        if (_0x5d22bf['target']?.["matches"]?.("[data-story-asset-prompt]")) {
          _0x237087(_0x5d22bf);
        } else {
          if (_0x5d22bf["target"]?.["dataset"]?.["personReplacementField"] === "image-prompt" || _0x5d22bf['target']?.['dataset']?.["personReplacementField"] === "video-prompt") {
            _0x237087(_0x5d22bf);
            _0x5d22bf["target"]["dataset"]["personReplacementField"] === "video-prompt" && _0x25dce3("video-prompt");
          } else {
            _0x5d22bf['target']?.['dataset']?.["personReplacementField"] === "voice-source" && _0x5ad5fa({
              ..._0x2547c2,
              'workspace': {
                ..._0x2547c2["workspace"],
                'selectedVoiceSourceId': _0x5d22bf["target"]["value"]
              }
            }, "voice-source");
          }
        }
      }
    }
  };
  const _0x1bce06 = _0x499da6 => {
    _0x594c8d['handleFocusOut'](_0x499da6);
    const _0x10513c = _0x499da6['target']?.["closest"]?.('[data-person-replacement-person-custom-label]');
    if (_0x10513c) {
      _0x318c43(_0x10513c);
    }
    const _0x36f893 = _0x499da6["target"]?.["closest"]?.("[data-person-replacement-detection-picker]");
    _0x36f893 && !_0x36f893["contains"]?.(_0x499da6["relatedTarget"]) && _0x6e2fc3(_0x36f893, ![]);
    const _0x4420b9 = _0x499da6["target"]?.["closest"]?.("[data-story-asset-name-id][contenteditable=\"true\"]");
    if (_0x4420b9) {
      _0x19608f(_0x4420b9);
    }
  };
  const _0x4d08ed = _0x14c4b6 => {
    _0x457764();
    const _0x49e574 = _0x14c4b6["target"]?.["closest"]?.("[data-person-replacement-voice-asset-id]");
    if (_0x49e574) {
      const _0x1ac621 = normalizeText(_0x49e574['dataset']?.['personReplacementVoiceAssetId']);
      if (!_0x14c4b6['dataTransfer'] || !_0x1ac621 || _0x49e574["disabled"]) {
        _0x14c4b6["preventDefault"]?.();
        return;
      }
      _0x14c4b6["dataTransfer"]["effectAllowed"] = "copy";
      _0x14c4b6['dataTransfer']["setData"](PERSON_REPLACEMENT_VOICE_ASSET_DRAG_TYPE, JSON['stringify']({
        'characterId': _0x1ac621
      }));
      applyWorkspaceAssetNativeDragPreview(_0x14c4b6["dataTransfer"], _0x49e574["querySelector"]?.(".person-replacement-voice-asset-image img") || _0x49e574);
      _0x49e574["classList"]?.["add"]?.('is-voice-asset-dragging');
      _0x313f9e?.["classList"]?.["add"]?.("is-voice-asset-dragging");
      return;
    }
    const _0x518fb7 = _0x14c4b6["target"]?.["closest"]?.("[data-person-replacement-target-character-id], [data-person-replacement-target-scene-id]");
    if (!_0x518fb7 || !_0x14c4b6["dataTransfer"]) {
      _0x14c4b6["preventDefault"]?.();
      return;
    }
    if (_0x14c4b6["target"]?.['closest']?.(".at-mention-variant-arrow")) {
      _0x14c4b6["preventDefault"]?.();
      return;
    }
    const _0x35e01f = normalizeText(_0x518fb7["dataset"]['personReplacementTargetSceneId']);
    const _0x4ffa25 = normalizeText(_0x518fb7["dataset"]["personReplacementTargetCharacterId"]);
    const _0x4820c1 = normalizeText(_0x35e01f ? _0x518fb7["dataset"]["personReplacementTargetSceneAppearanceId"] : _0x518fb7["dataset"]["personReplacementTargetAppearanceId"]);
    if (!_0x35e01f && !_0x4ffa25 || !_0x4820c1) {
      _0x14c4b6["preventDefault"]?.();
      return;
    }
    _0x38f85d = !![];
    _0x14c4b6["dataTransfer"]["effectAllowed"] = "copy";
    _0x35e01f ? _0x14c4b6["dataTransfer"]["setData"](PERSON_REPLACEMENT_SCENE_ASSET_DRAG_TYPE, JSON["stringify"]({
      'sceneId': _0x35e01f,
      'appearanceId': _0x4820c1
    })) : _0x14c4b6["dataTransfer"]["setData"]("application/x-person-replacement-target", JSON["stringify"]({
      'characterId': _0x4ffa25,
      'appearanceId': _0x4820c1
    }));
    applyWorkspaceAssetNativeDragPreview(_0x14c4b6["dataTransfer"], _0x518fb7["querySelector"]?.(".story-asset-card-image") || _0x518fb7);
    _0x518fb7["classList"]?.['add']?.("is-story-asset-dragging");
  };
  const _0x1182fe = _0x14e127 => {
    const _0x5a1a2d = _0x14e127?.["querySelector"]?.(".story-asset-card-image");
    const _0x2a3cc9 = normalizeText(_0x5a1a2d?.['currentSrc'] || _0x5a1a2d?.["src"] || _0x5a1a2d?.['getAttribute']?.("src"));
    if (!_0x5a1a2d || !_0x2a3cc9 || !documentObject?.['createElement']) {
      return null;
    }
    const _0x71b75f = _0x5a1a2d["getBoundingClientRect"]?.() || _0x14e127['getBoundingClientRect']?.() || {};
    const _0x494406 = Math["max"](0x1, Number(_0x71b75f["width"]) || 0x80);
    const _0x271049 = Math["max"](0x1, Number(_0x71b75f["height"]) || _0x494406);
    const _0x2865eb = Math["min"](0xa0, Math["max"](0x60, _0x494406));
    const _0x50fef3 = Math["max"](0x36, Math["round"](_0x2865eb * _0x271049 / _0x494406));
    const _0x536d2f = documentObject['createElement']('div');
    const _0x5ed922 = documentObject['createElement']("img");
    _0x536d2f["className"] = "story-asset-drag-preview person-replacement-target-asset-drag-preview";
    _0x536d2f["setAttribute"]("aria-hidden", 'true');
    _0x536d2f["style"]["width"] = Math['round'](_0x2865eb) + 'px';
    _0x536d2f['style']["height"] = Math["round"](_0x50fef3) + 'px';
    _0x5ed922["src"] = _0x2a3cc9;
    _0x5ed922["alt"] = '';
    _0x5ed922['draggable'] = ![];
    _0x536d2f["appendChild"](_0x5ed922);
    documentObject['body']?.["appendChild"]?.(_0x536d2f);
    return _0x536d2f;
  };
  const _0x3ab610 = (_0x4c68a3, _0xd87b2c) => {
    if (!_0x4c68a3) {
      return;
    }
    const _0x48bc9f = Number(_0xd87b2c?.["clientX"]) || 0x0;
    const _0xc0fd87 = Number(_0xd87b2c?.['clientY']) || 0x0;
    const _0x4e9251 = _0x4c68a3["getBoundingClientRect"]?.() || {};
    const _0x503f8a = Math["max"](0x1, Number(_0x4e9251["width"]) || Number["parseFloat"](_0x4c68a3["style"]["width"]) || 0x1);
    const _0x395271 = Math['max'](0x1, Number(_0x4e9251["height"]) || Number['parseFloat'](_0x4c68a3["style"]["height"]) || 0x1);
    const _0x3c4f20 = Number(windowObject?.['innerWidth']) || Number["POSITIVE_INFINITY"];
    const _0xec36f0 = Number(windowObject?.["innerHeight"]) || Number["POSITIVE_INFINITY"];
    const _0x315abf = 0x8;
    let _0x19a780 = _0x48bc9f + WORKSPACE_ASSET_DRAG_PREVIEW_POINTER_GAP;
    let _0x70ee18 = _0xc0fd87 + WORKSPACE_ASSET_DRAG_PREVIEW_POINTER_GAP;
    _0x19a780 + _0x503f8a > _0x3c4f20 - _0x315abf && (_0x19a780 = _0x48bc9f - _0x503f8a - WORKSPACE_ASSET_DRAG_PREVIEW_POINTER_GAP);
    _0x70ee18 + _0x395271 > _0xec36f0 - _0x315abf && (_0x70ee18 = _0xc0fd87 - _0x395271 - WORKSPACE_ASSET_DRAG_PREVIEW_POINTER_GAP);
    _0x4c68a3['style']["transform"] = "translate3d(" + Math["max"](_0x315abf, _0x19a780) + "px, " + Math["max"](_0x315abf, _0x70ee18) + 'px,\x200)';
  };
  const _0x1321ea = _0x5bd536 => {
    const _0x5148df = documentObject?.["elementFromPoint"]?.(Number(_0x5bd536?.['clientX']) || 0x0, Number(_0x5bd536?.['clientY']) || 0x0);
    const _0x5ae274 = _0x5148df?.["closest"]?.("[data-person-replacement-person-drop]");
    return _0x5ae274 && _0x313f9e?.['contains']?.(_0x5ae274) ? _0x5ae274 : null;
  };
  const _0x2c9cf5 = _0x5a636d => {
    const _0x5e7d09 = documentObject?.["elementFromPoint"]?.(Number(_0x5a636d?.['clientX']) || 0x0, Number(_0x5a636d?.["clientY"]) || 0x0);
    const _0x2fca50 = _0x5e7d09?.["closest"]?.("[data-person-replacement-keyframe-stage]");
    return _0x2fca50 && _0x313f9e?.["contains"]?.(_0x2fca50) ? _0x2fca50 : null;
  };
  const _0x2ca763 = _0x62dc9d => {
    if (_0x4c2c62 === _0x62dc9d) {
      return;
    }
    _0x4c2c62?.["classList"]?.["remove"]?.("is-scene-reference-drop-target");
    _0x4c2c62 = _0x62dc9d || null;
    _0x4c2c62?.['classList']?.["add"]?.("is-scene-reference-drop-target");
  };
  const _0x323e64 = ({
    personBox: _0x1ef3b5,
    target: _0x54be0a,
    clientX = 0x0,
    clientY = 0x0
  } = {}) => {
    if (!_0x1ef3b5 || !normalizeText(_0x54be0a?.['characterId']) || !normalizeText(_0x54be0a?.["appearanceId"])) {
      return ![];
    }
    const _0x41ccd7 = {
      'shotId': _0x1ef3b5["dataset"]["shotId"],
      'personId': _0x1ef3b5["dataset"]["personId"],
      'targetCharacterId': _0x54be0a["characterId"],
      'targetAppearanceId': _0x54be0a["appearanceId"]
    };
    const _0x4ad52d = _0x2547c2["shots"]["find"](_0x21edc1 => _0x21edc1['id'] === normalizeText(_0x41ccd7["shotId"]));
    const _0x4b7079 = _0x4ad52d?.["people"]?.["find"](_0x1e4962 => _0x1e4962['id'] === normalizeText(_0x41ccd7["personId"]));
    if (!_0x4b7079) {
      return ![];
    }
    const _0x5bfa7a = normalizeText(_0x4b7079["sourceCharacterId"]);
    const _0x17a989 = _0x2547c2["mappings"]["find"](_0x9095f9 => normalizeText(_0x9095f9["sourceCharacterId"]) === _0x5bfa7a)?.["targetCharacterId"];
    const _0x1cd26b = Boolean(normalizeText(_0x4b7079["targetCharacterId"]) || normalizeText(_0x17a989));
    if (_0x1cd26b) {
      const _0x48d3af = _0x2547c2["characters"]['find'](_0x1b4138 => _0x1b4138['id'] === normalizeText(_0x54be0a["characterId"]));
      const _0x1856f8 = getCharacterAppearance(_0x48d3af, normalizeText(_0x54be0a['appearanceId']));
      _0x24001d({
        'personBox': _0x1ef3b5,
        'mapping': _0x41ccd7,
        'personLabel': normalizeText(_0x4b7079["label"], _0x5bfa7a || "当前人物"),
        'targetName': normalizeText(_0x48d3af?.["name"], '目标人物'),
        'appearanceName': normalizeText(_0x1856f8?.['name'], "当前形象"),
        'clientX': clientX,
        'clientY': clientY
      });
    } else {
      _0x4fbb9c(_0x41ccd7);
    }
    _0x4336ee({
      'assetId': normalizeText(_0x54be0a["characterId"]),
      'shotId': normalizeText(_0x41ccd7["shotId"]),
      'personId': normalizeText(_0x41ccd7['personId'])
    });
    _0x457764();
    return !![];
  };
  const _0x591353 = () => {
    const _0x24db1e = _0x15e684;
    _0x15e684 = null;
    _0x24db1e?.["preview"]?.["remove"]?.();
    documentObject['body']?.["classList"]?.["remove"]?.("person-replacement-target-asset-dragging");
    if (!_0x24db1e?.['element']) {
      return;
    }
    _0x24db1e["originalDraggable"] == null ? _0x24db1e["element"]["removeAttribute"]?.("draggable") : _0x24db1e["element"]["setAttribute"]?.("draggable", _0x24db1e['originalDraggable']);
    _0x24db1e["element"]['hasPointerCapture']?.(_0x24db1e["pointerId"]) && _0x24db1e["element"]['releasePointerCapture']?.(_0x24db1e['pointerId']);
  };
  const _0x418595 = _0xf18fc2 => {
    const _0x143bb1 = _0xf18fc2["target"]?.['closest']?.('[data-person-replacement-target-character-id],\x20[data-person-replacement-target-scene-id]');
    if (!_0x143bb1 || !_0x313f9e?.["contains"]?.(_0x143bb1) || _0xf18fc2["button"] !== 0x0 || _0xf18fc2['target']?.["closest"]?.(".story-appearance-arrow, .at-mention-variant-arrow")) {
      return ![];
    }
    const _0x484716 = normalizeText(_0x143bb1["dataset"]?.["personReplacementTargetSceneId"]);
    const _0x22a07d = normalizeText(_0x143bb1["dataset"]?.["personReplacementTargetCharacterId"]);
    const _0x416714 = normalizeText(_0x484716 ? _0x143bb1["dataset"]?.["personReplacementTargetSceneAppearanceId"] : _0x143bb1["dataset"]?.['personReplacementTargetAppearanceId']);
    if (!_0x484716 && !_0x22a07d || !_0x416714) {
      return ![];
    }
    _0x15e684 = {
      'kind': _0x484716 ? "scene" : "character",
      'sceneId': _0x484716,
      'characterId': _0x22a07d,
      'appearanceId': _0x416714,
      'element': _0x143bb1,
      'pointerId': _0xf18fc2['pointerId'],
      'startX': Number(_0xf18fc2["clientX"]) || 0x0,
      'startY': Number(_0xf18fc2["clientY"]) || 0x0,
      'originalDraggable': _0x143bb1["getAttribute"]?.("draggable"),
      'active': ![],
      'preview': null
    };
    _0x143bb1["setAttribute"]?.("draggable", "false");
    _0x143bb1["setPointerCapture"]?.(_0xf18fc2['pointerId']);
    return !![];
  };
  const _0x2f2e39 = _0x58f24b => {
    const _0x3f264b = _0x15e684;
    if (!_0x3f264b || _0x3f264b["pointerId"] !== _0x58f24b['pointerId']) {
      return ![];
    }
    if (!_0x3f264b["active"]) {
      const _0x1c7a2e = (Number(_0x58f24b["clientX"]) || 0x0) - _0x3f264b["startX"];
      const _0x5b4397 = (Number(_0x58f24b["clientY"]) || 0x0) - _0x3f264b["startY"];
      if (Math["hypot"](_0x1c7a2e, _0x5b4397) < 0x8) {
        return ![];
      }
      _0x3f264b["active"] = !![];
      _0x38f85d = !![];
      _0x3f264b["element"]["classList"]?.["add"]?.("is-story-asset-dragging");
      documentObject['body']?.["classList"]?.['add']?.("person-replacement-target-asset-dragging");
      _0x457764();
      _0x3f264b['preview'] = _0x1182fe(_0x3f264b['element']);
    }
    _0x3ab610(_0x3f264b["preview"], _0x58f24b);
    _0x3f264b["kind"] === "scene" && _0x2ca763(_0x2c9cf5(_0x58f24b));
    _0x58f24b['preventDefault']?.();
    return !![];
  };
  const _0x5202c9 = (_0x4077bc, {
    cancelled = ![]
  } = {}) => {
    const _0x1dd6e1 = _0x15e684;
    if (!_0x1dd6e1 || _0x1dd6e1["pointerId"] !== _0x4077bc['pointerId']) {
      return ![];
    }
    const _0x29a4c3 = _0x1dd6e1["kind"] === "scene" && !cancelled && _0x1dd6e1['active'] ? _0x2c9cf5(_0x4077bc) : null;
    const _0x147473 = _0x1dd6e1["kind"] === "character" && !cancelled && _0x1dd6e1["active"] ? _0x1321ea(_0x4077bc) : null;
    const _0x36c1e2 = _0x1dd6e1["active"];
    const _0x5c8867 = {
      'characterId': _0x1dd6e1["characterId"],
      'appearanceId': _0x1dd6e1['appearanceId']
    };
    _0x591353();
    _0x2ca763(null);
    _0x38f85d = ![];
    _0x1dd6e1["element"]["classList"]?.["remove"]?.('is-story-asset-dragging');
    if (!_0x36c1e2) {
      return ![];
    }
    _0x432607 = _0x1dd6e1["element"];
    _0x4077bc["preventDefault"]?.();
    _0x4077bc['stopPropagation']?.();
    if (_0x29a4c3) {
      _0x4a9557({
        'shotId': _0x29a4c3["dataset"]["shotId"],
        'sceneId': _0x1dd6e1['sceneId'],
        'appearanceId': _0x1dd6e1["appearanceId"]
      });
    } else {
      _0x147473 && _0x323e64({
        'personBox': _0x147473,
        'target': _0x5c8867,
        'clientX': _0x4077bc['clientX'],
        'clientY': _0x4077bc["clientY"]
      });
    }
    return !![];
  };
  const _0x496968 = () => {
    _0x5e94a3?.["classList"]?.["remove"]?.('is-dragover');
    _0x5e94a3 = null;
    _0x313f9e?.["classList"]?.["remove"]?.('is-dragging-file');
  };
  const _0x548401 = _0x2a80eb => {
    if (_0x15c74b(_0x4b5931["HAS_PROJECT_PACKAGE_DRAG"], _0x2a80eb["dataTransfer"]) === !![]) {
      _0x2a80eb["preventDefault"]?.();
      _0x2a80eb["stopPropagation"]?.();
      if (_0x2a80eb['dataTransfer']) {
        _0x2a80eb['dataTransfer']["dropEffect"] = 'copy';
      }
      return;
    }
    const _0x108a86 = _0x2a80eb["target"]?.["closest"]?.('[data-audio-voice-action=\x22audio-param\x22]');
    const _0x2832ad = Array["from"](_0x2a80eb["dataTransfer"]?.["types"] || []);
    const _0x32cda4 = _0x313f9e?.["classList"]?.['contains']?.('is-voice-asset-dragging') || _0x2832ad['includes'](PERSON_REPLACEMENT_VOICE_ASSET_DRAG_TYPE);
    if (_0x108a86 && _0x32cda4) {
      if (!_0x1c006(_0x108a86)) {
        _0x4f9a7f();
        if (_0x2a80eb["dataTransfer"]) {
          _0x2a80eb["dataTransfer"]["dropEffect"] = "none";
        }
        return;
      }
      _0x2a80eb["preventDefault"]?.();
      if (_0x2a80eb['dataTransfer']) {
        _0x2a80eb["dataTransfer"]["dropEffect"] = "copy";
      }
      _0x5d4667(_0x108a86);
      return;
    }
    _0x32cda4 && (_0x4f9a7f(), _0x40d755());
    const _0x34ae86 = _0x2a80eb["target"]?.["closest"]?.("[data-person-replacement-keyframe-stage]");
    const _0x47e783 = _0x2832ad["includes"](PERSON_REPLACEMENT_SCENE_ASSET_DRAG_TYPE);
    if (_0x34ae86 && _0x47e783) {
      _0x2a80eb['preventDefault']?.();
      if (_0x2a80eb["dataTransfer"]) {
        _0x2a80eb['dataTransfer']['dropEffect'] = 'copy';
      }
      _0x2ca763(_0x34ae86);
      _0x496968();
      return;
    }
    if (_0x47e783) {
      _0x2ca763(null);
    }
    const _0x542030 = _0x2a80eb["target"]?.['closest']?.('[data-person-replacement-video-drop]');
    const _0x20751f = Boolean(_0x2a80eb["target"]?.["closest"]?.("[data-person-replacement-person-drop]"));
    const _0x593552 = _0x2832ad["includes"]("Files");
    if (!_0x20751f && !_0x593552) {
      return;
    }
    _0x2a80eb["preventDefault"]();
    _0x313f9e["classList"]["add"]("is-dragging-file");
    if (_0x542030 && _0x593552 && _0x2547c2["workspace"]["view"] === 'home') {
      if (_0x2a80eb['dataTransfer']) {
        _0x2a80eb["dataTransfer"]['dropEffect'] = "copy";
      }
      _0x5e94a3 !== _0x542030 && (_0x496968(), _0x5e94a3 = _0x542030, _0x5e94a3["classList"]?.["add"]?.('is-dragover'), _0x313f9e["classList"]["add"]('is-dragging-file'));
    } else {
      _0x496968();
      if (_0x593552) {
        _0x313f9e['classList']["add"]("is-dragging-file");
      }
    }
  };
  const _0x373b19 = () => {
    _0x38f85d = ![];
    _0x591353();
    _0x2ca763(null);
    _0x313f9e?.["querySelectorAll"]?.(".person-replacement-target-asset.is-story-asset-dragging")?.["forEach"]?.(_0x25827c => _0x25827c["classList"]?.["remove"]?.("is-story-asset-dragging"));
  };
  const _0x26ca02 = () => {
    _0x313f9e?.["classList"]?.["remove"]?.("is-voice-asset-dragging");
    _0x313f9e?.["querySelectorAll"]?.(".person-replacement-voice-asset-card.is-voice-asset-dragging")?.["forEach"]?.(_0x52a405 => _0x52a405["classList"]?.["remove"]?.('is-voice-asset-dragging'));
    _0x4f9a7f();
    _0x40d755();
  };
  const _0x4c117e = () => {
    _0x457764();
    _0x373b19();
    _0x26ca02();
    _0x496968();
  };
  const _0x2f07f4 = _0x46d9bb => {
    const _0x1cda65 = _0x46d9bb["target"]?.["closest"]?.("[data-person-replacement-video-drop]");
    _0x1cda65 && !_0x1cda65["contains"]?.(_0x46d9bb['relatedTarget']) && _0x496968();
    const _0x2a4a66 = _0x46d9bb["relatedTarget"];
    if (_0x2a4a66 && _0x313f9e?.["contains"]?.(_0x2a4a66)) {
      return;
    }
    _0x4f9a7f();
    _0x40d755();
    _0x496968();
    _0x2ca763(null);
  };
  const _0x30af45 = _0x132e5f => {
    if (_0x15c74b(_0x4b5931['DROP_PROJECT_PACKAGE'], _0x132e5f) === !![]) {
      return;
    }
    const _0x1a6458 = _0x132e5f["target"]?.['closest']?.("[data-audio-voice-action=\"audio-param\"]");
    const _0x5e6223 = _0x132e5f['dataTransfer']?.["getData"]?.(PERSON_REPLACEMENT_VOICE_ASSET_DRAG_TYPE);
    const _0x106e33 = _0x132e5f["dataTransfer"]?.["getData"]?.(PERSON_REPLACEMENT_SCENE_ASSET_DRAG_TYPE);
    const _0x33c36b = _0x132e5f['target']?.["closest"]?.('[data-person-replacement-keyframe-stage]');
    _0x4c117e();
    if (_0x1a6458 && _0x5e6223) {
      _0x132e5f["stopPropagation"]?.();
      if (!_0x1c006(_0x1a6458)) {
        return;
      }
      _0x132e5f["preventDefault"]?.();
      let _0x4ad1b3;
      try {
        _0x4ad1b3 = JSON["parse"](_0x5e6223);
      } catch {
        return;
      }
      const _0x1e99c7 = normalizeText(_0x4ad1b3?.['characterId']);
      const _0x47886d = normalizeText(_0x1a6458["dataset"]?.["segmentId"]);
      if (!_0x1e99c7 || !_0x47886d) {
        return;
      }
      _0x52da3a(_0x1e99c7, {
        'segmentId': _0x47886d
      });
      return;
    }
    if (_0x33c36b && _0x106e33) {
      _0x132e5f["stopPropagation"]?.();
      _0x132e5f["preventDefault"]?.();
      let _0x3f743f;
      try {
        _0x3f743f = JSON["parse"](_0x106e33);
      } catch {
        return;
      }
      _0x4a9557({
        'shotId': _0x33c36b["dataset"]["shotId"],
        'sceneId': _0x3f743f?.['sceneId'],
        'appearanceId': _0x3f743f?.['appearanceId']
      });
      return;
    }
    const _0x13f690 = _0x132e5f["target"]?.['closest']?.("[data-person-replacement-person-drop]");
    if (_0x13f690) {
      const _0x57a65e = _0x132e5f['dataTransfer']?.["getData"]?.("application/x-person-replacement-target");
      if (!_0x57a65e) {
        return;
      }
      _0x132e5f["stopPropagation"]?.();
      _0x132e5f["preventDefault"]();
      let _0x20e995;
      try {
        _0x20e995 = JSON['parse'](_0x57a65e);
      } catch {
        return;
      }
      _0x323e64({
        'personBox': _0x13f690,
        'target': _0x20e995,
        'clientX': _0x132e5f['clientX'],
        'clientY': _0x132e5f["clientY"]
      });
      return;
    }
    const _0x526dc5 = Array["from"](_0x132e5f["dataTransfer"]?.["files"] || []);
    if (!_0x526dc5["length"]) {
      return;
    }
    _0x132e5f['stopPropagation']?.();
    _0x132e5f["preventDefault"]();
    if (_0x2547c2["workspace"]["view"] === "home") {
      _0x4dcfca(_0x526dc5["filter"](a1289_0x5718e2));
    } else {
      if (_0x2547c2['workspace']['step'] === 0x1) {
        _0x10ec58(_0x526dc5["filter"](a1289_0x25bc7a));
      }
    }
  };
  let _0x49bdfd = null;
  const _0x10ab1b = _0x5c575b => _0x5c575b?.['ctrlKey'] === !![] || _0x5c575b?.['getModifierState']?.("Control") === !![] || _0x4c89d6;
  const _0x4f5aaa = _0x287dc8 => {
    _0x432607 = null;
    _0x287dc8["stopPropagation"]();
    _0x457764();
    !_0x287dc8["target"]?.["closest"]?.("[data-person-replacement-mapping-scope-menu]") && _0x3cc019();
    const _0x2c3ae6 = _0x287dc8['target']?.["closest"]?.("[data-person-replacement-person-drop]");
    _0x2c3ae6 && _0x313f9e["contains"](_0x2c3ae6) && _0x27a85c(_0x2c3ae6);
    if (_0x287dc8["target"]?.['closest']?.("[data-person-replacement-result-history-toggle], [data-person-replacement-result-history-close]")) {
      return;
    }
    if (_0x418595(_0x287dc8)) {
      return;
    }
    const _0x4cd6ec = _0x287dc8["target"]?.['closest']?.("[data-story-marquee-surface=\"people\"]");
    const _0x5b81ff = _0x287dc8["target"]?.['closest']?.(".person-replacement-detection-label, .person-replacement-mapping-badge, [data-person-replacement-action], [data-person-replacement-manual-resize]");
    if (_0x10ab1b(_0x287dc8) && _0x4cd6ec && _0x313f9e["contains"](_0x4cd6ec) && !_0x5b81ff && _0x49bdfd?.["begin"]?.(_0x287dc8)) {
      return;
    }
    const _0x58d0f1 = Boolean(_0x2c3ae6?.['classList']?.['contains']?.('is-batch-selected'));
    if (_0x58d0f1 && !_0x5b81ff && _0x2342b6(_0x287dc8, _0x2c3ae6, {
      'batch': !![]
    })) {
      return;
    }
    !_0x10ab1b(_0x287dc8) && (!_0x2c3ae6 || !_0x58d0f1) && _0xe62c16();
    const _0x1dfa39 = _0x2c3ae6?.['matches']?.(".person-replacement-detection-box[data-person-id]") ? _0x2c3ae6 : null;
    _0x1dfa39 && _0x313f9e["contains"](_0x1dfa39) ? _0x38134a(_0x1dfa39, {
      'focus': !_0x287dc8["target"]?.["closest"]?.('.person-replacement-detection-label,\x20.person-replacement-mapping-badge,\x20[data-person-replacement-action]')
    }) : _0x55ecef();
    if (_0x1dfa39 && _0x313f9e["contains"](_0x1dfa39) && !_0x287dc8["target"]?.["closest"]?.(".person-replacement-detection-label, .person-replacement-mapping-badge, [data-person-replacement-action]") && _0x2342b6(_0x287dc8, _0x1dfa39)) {
      return;
    }
    if (_0x43126e()) {
      const _0x2b3be8 = _0x287dc8["target"]?.["closest"]?.("[data-person-replacement-keyframe-stage]");
      if (_0x2b3be8 && _0x313f9e['contains'](_0x2b3be8) && !_0x10ab1b(_0x287dc8) && !_0x287dc8["target"]?.['closest']?.("[data-person-replacement-person-drop]") && !_0x287dc8["target"]?.["closest"]?.('[data-person-replacement-action],\x20[data-story-action]')) {
        if (_0x277ec4(_0x287dc8, _0x2b3be8)) {
          return;
        }
      }
    }
    const _0x4e8023 = _0x287dc8['target']?.["closest"]?.("[data-person-replacement-layout-splitter]");
    if (_0x4e8023 && _0x4d9f1a(_0x287dc8, _0x4e8023)) {
      return;
    }
    const _0x45f141 = _0x287dc8["target"]?.["closest"]?.("[data-person-replacement-composite-sidebar-splitter]");
    if (_0x45f141) {
      const _0x21594c = _0x45f141['closest']?.('.person-replacement-preview-workbench');
      _0x45f141["classList"]?.["add"]?.("is-active");
      const _0x28c942 = beginWorkspaceHorizontalResizeSession({
        'event': _0x287dc8,
        'splitter': _0x45f141,
        'layout': _0x21594c,
        'windowObject': windowObject,
        'body': documentObject['body'],
        'resizingClass': 'person-replacement-composite-sidebar-resizing',
        'onRatio': _0x12b9c6 => {
          const _0x4cf2e3 = Number(_0x21594c?.['getBoundingClientRect']?.()?.["width"]);
          const _0x5726fb = Number["isFinite"](_0x4cf2e3) ? _0x4cf2e3 * _0x12b9c6 / 0x64 : _0x2547c2["workspace"]['compositeSidebarWidth'];
          _0x2547c2["workspace"]["compositeSidebarWidth"] = applyPersonReplacementCompositeSidebarWidthToLayout(_0x21594c, _0x45f141, _0x5726fb);
        },
        'onFinish': () => {
          _0x45f141["classList"]?.["remove"]?.('is-active');
          _0x25dce3("composite-sidebar-width");
        }
      });
      if (!_0x28c942) {
        _0x45f141["classList"]?.["remove"]?.("is-active");
      }
      if (_0x28c942) {
        return;
      }
    }
    const _0x39bc2b = _0x287dc8['target']?.["closest"]?.("[data-person-replacement-voice-layout-splitter]");
    if (_0x39bc2b) {
      const _0x11645c = _0x39bc2b["closest"]?.("[data-person-replacement-voice-layout]");
      const _0x2e141e = normalizeText(_0x39bc2b["dataset"]?.["personReplacementVoiceLayoutSplitter"]);
      const _0x4cf886 = ['assets', "sources"]['includes'](_0x2e141e);
      if (_0x4cf886) {
        _0x39bc2b["classList"]?.["add"]?.("is-active");
      }
      const _0xe36a15 = _0x4cf886 && beginWorkspaceHorizontalResizeSession({
        'event': _0x287dc8,
        'splitter': _0x39bc2b,
        'layout': _0x11645c,
        'windowObject': windowObject,
        'body': documentObject["body"],
        'resizingClass': "person-replacement-voice-layout-resizing",
        'onRatio': _0x5000e4 => {
          const _0x267bcb = normalizePersonReplacementVoiceLayout(_0x2547c2["workspace"]["voiceLayout"]);
          const _0xb0ac8e = normalizePersonReplacementVoiceLayout({
            ..._0x267bcb,
            ...(_0x2e141e === "assets" ? {
              'assetsEnd': clamp(_0x5000e4, 0x10, _0x267bcb["sourcesEnd"] - 0x10, _0x267bcb["assetsEnd"])
            } : {
              'sourcesEnd': clamp(_0x5000e4, _0x267bcb['assetsEnd'] + 0x10, 0x3c, _0x267bcb["sourcesEnd"])
            })
          });
          _0x2547c2["workspace"]["voiceLayout"] = applyPersonReplacementVoiceLayoutToElement(_0x11645c, _0xb0ac8e);
        },
        'onFinish': () => {
          _0x39bc2b["classList"]?.["remove"]?.("is-active");
          _0x25dce3("voice-layout");
        }
      });
      if (!_0xe36a15) {
        _0x39bc2b["classList"]?.["remove"]?.("is-active");
      }
      if (_0xe36a15) {
        return;
      }
    }
    const _0x114c1c = _0x287dc8["target"]?.['closest']?.("[data-person-replacement-cut-boundary-index]");
    if (_0x114c1c && _0x3b99c1(_0x287dc8, _0x114c1c)) {
      return;
    }
    const _0x1834f3 = _0x287dc8["target"]?.["closest"]?.("[data-story-assets-splitter]");
    if (_0x1834f3) {
      const _0x128bf4 = _0x1834f3['closest']?.('.story-assets-layout');
      beginWorkspaceHorizontalResizeSession({
        'event': _0x287dc8,
        'splitter': _0x1834f3,
        'layout': _0x128bf4,
        'windowObject': windowObject,
        'body': documentObject["body"],
        'resizingClass': "story-assets-resizing",
        'onRatio': _0x119615 => {
          _0x2547c2['workspace']["assetSplitRatio"] = applyWorkspaceAssetSplitRatioToLayout(_0x128bf4, _0x1834f3, _0x119615);
        },
        'onFinish': () => _0x25dce3("asset-split-ratio")
      });
      return;
    }
    if (_0x287dc8["target"]) {
      _0x49bdfd?.['begin']?.(_0x287dc8);
    }
  };
  const _0x4fb61f = _0x387245 => {
    if (_0x2f2e39(_0x387245)) {
      return;
    }
    _0x23dbe6(_0x387245);
    _0x4a5212(_0x387245);
  };
  const _0x3c6458 = _0x1d93c3 => {
    _0x594c8d["handlePointerOver"](_0x1d93c3);
    _0x56b3e6(_0x1d93c3);
  };
  const _0xa7c10b = _0x30e009 => {
    _0x5202c9(_0x30e009);
  };
  const _0x1d4c6d = _0x343267 => {
    _0x5202c9(_0x343267, {
      'cancelled': !![]
    });
  };
  const _0x180652 = _0x43fd8c => {
    _0x594c8d["handlePointerOut"](_0x43fd8c);
    _0xd680c8(_0x43fd8c);
    _0x5d6ac4(_0x43fd8c);
  };
  const _0x426b08 = () => {
    _0x29feb3();
    const _0x2c576c = _0x313f9e?.["querySelector"]?.('[data-person-replacement-shot-cut-video]');
    if (!_0x2c576c || !_0x545ea6["isOpen"]) {
      return;
    }
    _0x2c576c['preload'] = "auto";
    _0x2c576c["muted"] = !_0x545ea6["soundEnabled"];
    if (_0x545ea6["boundPreviewVideos"]["has"](_0x2c576c)) {
      if (_0x2c576c["paused"] === ![]) {
        cutEditorPlaybackController["startNative"](_0x2c576c);
      }
      return;
    }
    _0x545ea6["boundPreviewVideos"]['add'](_0x2c576c);
    _0x2c576c["addEventListener"]?.("playing", () => cutEditorPlaybackController["startNative"](_0x2c576c));
    _0x2c576c["addEventListener"]?.("pause", () => {
      _0xc540cf();
      _0xf8cb6b(_0x2c576c);
    });
    _0x2c576c["addEventListener"]?.("seeked", () => {
      const _0x24c3de = _0x545ea6["pendingPreviewSeek"];
      if (!_0x24c3de) {
        _0xf8cb6b(_0x2c576c);
        return;
      }
      const _0x4d6acb = Number(_0x24c3de["token"]);
      _0x24c3de["seeked"] = !![];
      if (typeof _0x2c576c["requestVideoFrameCallback"] !== "function") {
        _0x24c3de["presentedSourceSec"] = Number(_0x2c576c["currentTime"]);
      } else {
        !Number["isFinite"](Number(_0x24c3de["presentedSourceSec"])) && _0x545ea6["previewFrameCallbackId"] == null && _0x5b4698(_0x2c576c, _0x24c3de, _0x4d6acb);
      }
      _0x59ed25(_0x2c576c, _0x24c3de, _0x4d6acb);
      _0xf8cb6b(_0x2c576c);
    });
    _0x2c576c["addEventListener"]?.("timeupdate", () => {
      if (!_0x2c576c['paused']) {
        cutEditorPlaybackController['startNative'](_0x2c576c);
      } else {
        _0xf8cb6b(_0x2c576c);
      }
    });
    _0x2c576c["addEventListener"]?.("ended", () => {
      _0xc540cf();
      _0xf8cb6b(_0x2c576c);
    });
    _0x2c576c["addEventListener"]?.("error", () => {
      _0x54ce2e();
      _0x545ea6['pendingPreviewSeek'] = null;
      windowObject?.["showToast"]?.('裁剪预览视频加载失败，请稍后重试。', "warn");
    });
    if (_0x2c576c["paused"] === ![]) {
      cutEditorPlaybackController["startNative"](_0x2c576c);
    }
  };
  const _0x9e176b = _0x546e24 => {
    const _0x2f45f7 = _0x2547c2['id'];
    const _0x3a1f33 = (_0x11be52, _0x123ecb) => _0x1fc5b8({
      'dataset': {
        'storyProjectId': _0x11be52
      }
    }, _0x123ecb);
    return a1289_0x56ff5e({
      'event': _0x546e24,
      'root': _0x313f9e,
      'projects': _0x2547c2['libraryProjects'],
      'project': _0x2547c2,
      'commands': {
        'addLibraryAssets': (_0xb309ea, _0x35c552) => {
          if (_0x2547c2['id'] !== _0x2f45f7 || _0x2547c2["workspace"]["characterAssetTab"] !== 'library') {
            return;
          }
          _0x5e3e48(_0xb309ea, _0x35c552);
        },
        'openProject': _0x43a6d4 => _0x1aea64(_0x4b5931['OPEN_PROJECT'], _0x43a6d4),
        'renameProject': _0x46ae81 => _0x3a1f33(_0x46ae81, "rename-project"),
        'duplicateProject': _0x176a35 => _0x3a1f33(_0x176a35, "duplicate-project"),
        'collectProject': _0x37f598 => _0x3a1f33(_0x37f598, "collect-project"),
        'setProjectArchived': (_0x35b4a4, _0x3a3b9c) => _0x3a1f33(_0x35b4a4, _0x3a3b9c ? "archive-project" : "unarchive-project"),
        'requestDeleteProject': _0x26bfd7 => _0x3a1f33(_0x26bfd7, "request-delete-project")
      }
    });
  };
  const _0x4be87b = _0x4aff69 => {
    _0x313f9e = documentObject['createElement']("section");
    _0x313f9e["className"] = "person-replacement-workspace replacement-studio-workspace";
    _0x313f9e["dataset"]["personReplacementWorkspace"] = '';
    _0x313f9e["dataset"]["replacementStudioWorkspace"] = '';
    _0x313f9e["dataset"]["uiStop"] = '1';
    _0x313f9e["setAttribute"]("aria-label", REPLACEMENT_STUDIO_NAME);
    _0x313f9e["innerHTML"] = renderHiddenInputs();
    _0x4aff69["appendChild"](_0x313f9e);
    _0x313f9e['addEventListener']("click", _0x216894);
    _0x313f9e["addEventListener"]('input', _0x237087);
    _0x313f9e["addEventListener"]("change", _0x55384e);
    _0x313f9e["addEventListener"]("focusin", _0x594c8d["handleFocusIn"]);
    _0x313f9e["addEventListener"]("focusout", _0x1bce06);
    _0x313f9e["addEventListener"]('dragstart', _0x4d08ed);
    _0x313f9e["addEventListener"]("dragend", _0x4c117e);
    _0x313f9e["addEventListener"]("dragover", _0x548401);
    _0x313f9e["addEventListener"]("dragleave", _0x2f07f4);
    _0x313f9e["addEventListener"]("drop", _0x30af45);
    _0x340f82?.();
    _0x340f82 = bindWorkspaceEntityContextMenu(_0x313f9e, {
      'resolveItems': _0x9e176b,
      'beforeOpen'() {
        if (!_0x2547c2["workspace"]["openProjectMenuId"]) {
          return;
        }
        _0x180e24({
          'openProjectMenuId': ''
        });
      }
    });
    _0x313f9e["addEventListener"]("error", handleWorkspaceAssetLibraryImageError, !![]);
    _0x313f9e["addEventListener"]("pointerdown", _0x4f5aaa);
    _0x313f9e["addEventListener"]("pointerup", _0xa7c10b);
    _0x313f9e["addEventListener"]("pointercancel", _0x1d4c6d);
    _0x313f9e['addEventListener']('pointerover', _0x3c6458);
    _0x313f9e['addEventListener']("pointermove", _0x4fb61f);
    _0x313f9e["addEventListener"]("pointerout", _0x180652);
    _0x313f9e["addEventListener"]("dblclick", _0x197b85);
    const _0x38c9fb = _0x3d8d0c => {
      const _0x4358de = _0x3d8d0c["target"]?.["closest"]?.(".person-replacement-production-page");
      if (!_0x4358de || !_0x313f9e["contains"](_0x4358de)) {
        return ![];
      }
      const _0x4656b0 = _0x4358de["ownerDocument"]?.['defaultView']?.["getComputedStyle"]?.(_0x4358de)?.["overflowY"];
      if (!["auto", "scroll", "overlay"]["includes"](_0x4656b0)) {
        return ![];
      }
      const _0x4b74b9 = Number(_0x3d8d0c["deltaY"]) || 0x0;
      const _0x12afa7 = Math["max"](0x0, _0x4358de["scrollHeight"] - _0x4358de["clientHeight"]);
      if (_0x4b74b9 < 0x0) {
        return _0x4358de["scrollTop"] > 0x0;
      }
      if (_0x4b74b9 > 0x0) {
        return _0x4358de["scrollTop"] < _0x12afa7;
      }
      return ![];
    };
    _0x313f9e["addEventListener"]("wheel", _0x1695ce => {
      if (_0x38c9fb(_0x1695ce)) {
        _0x1695ce["stopPropagation"]();
        return;
      }
      if (_0x448438(_0x1695ce)) {
        _0x1695ce["stopPropagation"]();
        return;
      }
      if (_0x188711(_0x1695ce)) {
        _0x1695ce['stopPropagation']();
        return;
      }
      if (_0x736bed(_0x1695ce)) {
        return;
      }
      if (_0x3d7a2d(_0x1695ce)) {
        _0x1695ce["stopPropagation"]();
        return;
      }
      if (_0x2ea7fb(_0x1695ce)) {
        _0x1695ce["stopPropagation"]();
        return;
      }
      if (shouldPreserveWorkspaceNestedWheel(_0x1695ce["target"], {
        'nestedSelector': "textarea, [contenteditable=\"true\"], .node-model-submenu, .story-style-grid, .story-assets-list, .story-episode-assets, .story-clip-strip",
        'boundaryRoot': _0x313f9e
      })) {
        _0x1695ce['stopPropagation']();
        return;
      }
      _0x1695ce["stopPropagation"]();
      if (!_0x1e9b35(_0x1695ce) && !_0x33afdc(_0x1695ce) && !_0x1c5236(_0x1695ce)) {
        _0xe5bd02(_0x1695ce);
      }
    }, {
      'passive': ![]
    });
    _0x313f9e["addEventListener"]("keydown", _0x3b341e, !![]);
    windowObject?.['addEventListener']?.("keydown", _0x3fcfe3, !![]);
    windowObject?.['addEventListener']?.("resize", _0x21abb0);
    const _0x3406a6 = _0x3d3ace => {
      (_0x3d3ace?.["key"] === "Control" || _0x3d3ace?.["code"] === 'ControlLeft' || _0x3d3ace?.['code'] === "ControlRight") && (_0x4c89d6 = _0x3d3ace["type"] === "keydown");
    };
    const _0x177b3e = () => {
      _0x4c89d6 = ![];
      _0x373b19();
    };
    windowObject?.["addEventListener"]?.('keydown', _0x3406a6, !![]);
    windowObject?.['addEventListener']?.("keyup", _0x3406a6, !![]);
    windowObject?.["addEventListener"]?.('blur', _0x177b3e, !![]);
    _0x5b532b = () => {
      windowObject?.["removeEventListener"]?.("keydown", _0x3406a6, !![]);
      windowObject?.["removeEventListener"]?.("keyup", _0x3406a6, !![]);
      windowObject?.['removeEventListener']?.("blur", _0x177b3e, !![]);
      _0x177b3e();
    };
    _0x49bdfd = createWorkspaceMarqueeSelectionController({
      'root': _0x313f9e,
      'documentObject': documentObject,
      'windowObject': windowObject,
      'surfaceSelector': "[data-story-marquee-surface]",
      'blockedControlSelector': "[data-story-action], [data-person-replacement-action], input, textarea, select, a, [contenteditable='true']",
      'overlayClassName': "story-marquee-selection",
      'itemSelector': "[data-story-marquee-item]",
      'getItemId': _0x413cde => _0x413cde["dataset"]?.['storyMarqueeId'],
      'getConfig': _0x5adc32 => {
        if (_0x5adc32?.["dataset"]?.["storyMarqueeSurface"] === "shot-cuts" && _0x2547c2['workspace']['view'] === "project" && _0x2547c2["workspace"]["step"] === 0x2 && _0x545ea6["isOpen"]) {
          return {
            'enabled': !_0x118f0f(),
            'selectedIds': _0x545ea6["selectedShotIds"],
            'itemSelector': "[data-person-replacement-shot-cut-selectable]",
            'getItemId': _0xc03757 => _0xc03757["dataset"]?.["shotId"],
            'hitClassName': "is-marquee-hit",
            'rootClassName': "is-shot-cut-marquee-selecting",
            'commit': _0x3a4d4e => {
              _0x155aa0["setSelectedShotIds"](_0x3a4d4e);
              _0x3567fe();
            }
          };
        }
        if (_0x5adc32?.["dataset"]?.["storyMarqueeSurface"] === "people" && _0x2547c2["workspace"]["view"] === 'project' && _0x2547c2["workspace"]['step'] === 0x2 && !_0x545ea6["isOpen"]) {
          return {
            'enabled': !![],
            'canBegin': _0x1183c4 => _0x10ab1b(_0x1183c4),
            'additive': ![],
            'selectedIds': [],
            'itemSelector': "[data-person-replacement-person-drop]",
            'hitClassName': "is-batch-selection-hit",
            'overlayClassName': 'is-person-box-selection',
            'rootClassName': "is-person-box-marquee-selecting",
            'getItemId': _0x518485 => _0x518485["dataset"]?.["personId"],
            'commit': _0xcce1bc => {
              _0x5544c6(_0x5adc32["dataset"]?.["shotId"], _0xcce1bc);
              _0x45cd21();
            }
          };
        }
        if (_0x5adc32?.["dataset"]?.["storyMarqueeSurface"] === "shots" && _0x2547c2["workspace"]["view"] === "project" && [0x2, 0x3, 0x5]["includes"](_0x2547c2["workspace"]["step"]) && !_0x545ea6["isOpen"]) {
          return {
            'enabled': !![],
            'selectedIds': _0x2547c2["workspace"]["selectedShotIds"],
            'commit': _0x53a344 => {
              _0x5ad5fa({
                ..._0x2547c2,
                'workspace': {
                  ..._0x2547c2["workspace"],
                  'shotSelectionMode': !![],
                  'selectedShotIds': _0x53a344
                }
              }, "shot-marquee");
            }
          };
        }
        return {
          'enabled': _0x5adc32?.['dataset']?.["storyMarqueeSurface"] === 'assets' && _0x2547c2['workspace']["view"] === "project" && _0x2547c2["workspace"]["step"] === 0x1 && ['character', 'scene', 'library']["includes"](_0x2547c2["workspace"]["characterAssetTab"]),
          'selectedIds': _0x2547c2["workspace"]['selectedAssetIds'],
          'commit': _0x3edf69 => {
            const _0x5060ea = new Set(getPersonReplacementSelectableAssets(_0x2547c2, _0x2547c2["workspace"]["characterAssetTab"])['map'](_0x52ddf0 => _0x52ddf0['id']));
            const _0x18149f = _0x3edf69["filter"](_0xa468ad => _0x5060ea["has"](_0xa468ad));
            _0x5ad5fa({
              ..._0x2547c2,
              'workspace': {
                ..._0x2547c2['workspace'],
                'assetSelectionMode': _0x18149f["length"] > 0x0,
                'selectedAssetIds': _0x18149f
              }
            }, "asset-marquee");
          }
        };
      }
    });
    return _0x313f9e;
  };
  const _0x4bbfba = createPersonReplacementPageTransitionController({
    'getRoot': () => _0x313f9e,
    'getTransitionKey': () => _0x261635(_0x2547c2),
    'isCutEditorOpen': () => _0x545ea6["isOpen"],
    'isDestroyed': () => _0x4d9c06,
    'requestRender': () => _0x3567fe(),
    'documentObject': documentObject,
    'windowObject': windowObject
  });
  const {
    captureFocus: _0x5208f3,
    deferRenderIfSettling: _0x24d908,
    destroy: _0x80548d,
    restoreFocus: _0xcee14b,
    start: _0x170a7e,
    stop: _0x5f1048,
    syncProjectToolbarInPlace: _0x2e8312
  } = _0x4bbfba;
  const _0x1801b3 = _0x3567fe;
  _0x3567fe = () => {
    if (!_0x313f9e || _0x4d9c06 || !_0xc321d6["isActive"]()) {
      return;
    }
    const _0x3aec79 = _0x55da73;
    const _0xf48664 = _0x33a455;
    const _0x201c0e = _0x254bf7(_0x2547c2);
    const _0x303b5c = _0x3aec79 === 'none' && _0x58cabf === _0x201c0e ? captureWorkspaceNestedScrollPositions(_0x313f9e, PERSON_REPLACEMENT_PERSISTENT_NESTED_SCROLL_SELECTORS) : null;
    _0x55da73 = "none";
    _0x33a455 = "page";
    if (_0x24d908(_0x3aec79)) {
      return;
    }
    const _0x5dbbe6 = _0x5208f3();
    _0x1c3039();
    _0x5f1048({
      'renderPending': ![]
    });
    const _0xb791de = _0x313f9e["querySelector"]?.('.person-replacement-project-body');
    const _0x474847 = ["forward", 'backward']["includes"](_0x3aec79) ? _0xb791de?.["firstElementChild"] || null : null;
    const _0x6cb1cc = _0x474847 ? _0x313f9e["querySelector"]?.(".story-workspace-toolbar") : null;
    _0x474847?.["remove"]?.();
    _0x6cb1cc?.["remove"]?.();
    const _0x319dab = _0x2547c2["workspace"]["view"] === "project" && _0x2547c2["workspace"]['step'] === 0x2 && !_0x545ea6['isOpen'];
    _0x358d58(_0x319dab);
    _0x1801b3();
    _0x30abb8["update"](_0x2547c2['persistenceState']);
    restoreWorkspaceNestedScrollPositions(_0x313f9e, _0x303b5c);
    _0x58cabf = _0x201c0e;
    _0x469440();
    const _0x5afbcd = _0x313f9e["querySelector"]?.(".person-replacement-project-body");
    const _0x5cc4e9 = _0x5afbcd?.['firstElementChild'] || null;
    const _0x30218d = _0x6cb1cc ? _0x313f9e['querySelector']?.('.story-workspace-toolbar') : null;
    if (_0x6cb1cc && _0x30218d) {
      _0x30218d["replaceWith"]?.(_0x6cb1cc);
    }
    const _0x2e77a1 = _0x170a7e(_0x474847, _0x5cc4e9, _0x3aec79, _0xf48664, {
      'currentToolbar': _0x6cb1cc,
      'nextToolbar': _0x30218d,
      'focusKey': _0x5dbbe6
    });
    !_0x2e77a1 && _0x2e8312(_0x6cb1cc, _0x30218d);
    _0xcee14b(_0x5dbbe6, {
      'currentToolbar': _0x6cb1cc,
      'incomingPage': _0x5cc4e9
    });
    _0x111f4e();
    typeof _0x313f9e["insertAdjacentHTML"] === 'function' ? _0x313f9e["insertAdjacentHTML"]("beforeend", renderHiddenInputs()) : _0x313f9e['innerHTML'] += renderHiddenInputs();
    _0x4ba83b();
    _0x426b08();
    _0x58e350();
    _0x37e59e();
  };
  const _0x55f975 = Object["freeze"]({
    'open'(_0x465a7a = {}) {
      if (_0x4d9c06) {
        return null;
      }
      _0x465a7a["project"] && (_0x1d4b46(), _0x2547c2 = a1289_0x2fb27f(_0x465a7a["project"]), _0x155aa0['syncProject'](_0x2547c2), _0xd3e343["switchProject"](_0x2547c2['id']));
      _0x2547c2 = _0x4cd68f(_0x2547c2);
      _0x5a79ec = _0x465a7a['mountTarget'] || _0x5a79ec;
      const _0x31d8b0 = resolveMountTarget(documentObject, _0x5a79ec);
      if (!_0x31d8b0) {
        return null;
      }
      if (!_0x313f9e) {
        _0x4be87b(_0x31d8b0);
      } else {
        if (_0x313f9e['parentElement'] !== _0x31d8b0) {
          _0x31d8b0["appendChild"](_0x313f9e);
        }
      }
      _0xc321d6["activate"]();
      _0x3567fe();
      return _0x313f9e;
    },
    'close'() {
      if (!_0x313f9e || _0x4d9c06) {
        return ![];
      }
      _0x38c4a3();
      _0x53d900();
      _0x49bdfd?.['cancel']?.();
      _0xe62c16();
      let _0x2c6010 = !![];
      try {
        _0x2c6010 = _0x15c74b(_0x4b5931["CAN_CLOSE"], cloneJson(_0x2547c2)) !== ![];
      } catch {
        _0x2c6010 = !![];
      }
      if (!_0x2c6010) {
        _0x12c268("close");
        return ![];
      }
      closeDebugRequestWindow(documentObject);
      _0x1d4b46();
      _0x40a6e5();
      _0x1682cd();
      _0x50e3a9();
      _0x55111a();
      _0x30afb2();
      _0x37c1e6();
      _0xc321d6["deactivate"]();
      _0x3195c4();
      _0x2281fc = '';
      _0x15740b();
      _0x15c74b(_0x4b5931["CLOSE"], {
        'project': cloneJson(_0x2547c2)
      });
      return !![];
    },
    'setProject'(_0x44fa23) {
      if (_0x4d9c06) {
        return null;
      }
      const _0xff8bb0 = _0x2547c2;
      const _0x29faa6 = _0x4cd68f(a1289_0x2fb27f(_0x44fa23));
      const _0x5a7d8d = normalizeText(_0x29faa6['id']);
      _0x5a7d8d !== normalizeText(_0xff8bb0['id']) && (closeDebugRequestWindow(documentObject), _0x30afb2(), _0xd3e343["switchProject"](_0x5a7d8d));
      _0x2547c2 = _0x29faa6;
      _0x2281fc && !_0x2547c2["characters"]['some'](_0x4146a7 => _0x4146a7['id'] === _0x2281fc) && (_0x2281fc = '');
      const _0x5152d2 = _0x155aa0["syncProject"](_0x2547c2);
      _0x283c55(_0xff8bb0, _0x2547c2);
      const _0x3a19b1 = new Set(_0x2547c2["shots"]["map"](_0x2ba1f3 => _0x2ba1f3['id']));
      (_0x5152d2 || (_0x545ea6["isOpen"] || _0x545ea6['isOpening']) && (_0x2547c2["workspace"]['view'] !== "project" || _0x2547c2['workspace']['step'] !== 0x2 || _0x545ea6["draft"]['some'](_0x570222 => !_0x3a19b1['has'](_0x570222["shotId"])))) && _0x1d4b46();
      _0x3567fe();
      return cloneJson(_0x2547c2);
    },
    'syncProjectState'(_0x509de9, {
      returnSnapshot = !![]
    } = {}) {
      if (_0x4d9c06) {
        return null;
      }
      const _0x1f24f8 = _0x2547c2;
      const _0xdd0b46 = a1289_0x2fb27f(_0x509de9);
      if (!Object["hasOwn"](_0x509de9, "libraryProjects") && _0xdd0b46['id'] === _0x1f24f8['id']) {
        _0xdd0b46['libraryProjects'] = _0x1f24f8["libraryProjects"];
      }
      const _0x24ee71 = Boolean(_0x313f9e && normalizeText(_0xdd0b46['id']) === normalizeText(_0x2547c2['id']) && _0xdd0b46["workspace"]?.["view"] === "project" && _0xdd0b46['workspace']?.["step"] === 0x3 && _0x2547c2["workspace"]?.["view"] === "project" && _0x2547c2["workspace"]?.["step"] === 0x3);
      const _0xd12d83 = _0x24ee71 ? resolvePersonReplacementVideoGenerationUiRefreshScope(_0x1f24f8, _0xdd0b46) : '';
      const _0x29402f = Boolean(_0x313f9e && normalizeText(_0xdd0b46['id']) === normalizeText(_0x2547c2['id']) && _0xdd0b46["workspace"]?.["view"] === "project" && _0xdd0b46["workspace"]?.["step"] === 0x2 && _0x2547c2["workspace"]?.["view"] === "project" && _0x2547c2["workspace"]?.['step'] === 0x2);
      const _0x1c3473 = _0x29402f ? resolvePersonReplacementImageGenerationUiRefreshScope(_0x1f24f8, _0xdd0b46) : '';
      normalizeText(_0xdd0b46['id']) !== normalizeText(_0x2547c2['id']) && (_0x30afb2(), _0xd3e343['switchProject'](_0xdd0b46['id']));
      _0x2547c2 = _0xdd0b46;
      if (_0x155aa0["syncProject"](_0x2547c2)) {
        _0x1d4b46();
      }
      if (!_0xc321d6["isActive"]()) {
        return returnSnapshot ? cloneJson(_0x2547c2) : null;
      }
      if (_0x1c3473 === 'selected-shot') {
        _0x131c7a({
          'refreshTimelineCard': !![]
        });
      } else {
        if (_0x1c3473 === "timeline") {
          _0xe6442a();
        } else {
          if (_0xd12d83 === "selected-shot") {
            if (!_0xdba29c() && !_0x2e4219["isClipActive"]()) {
              _0x3567fe();
            }
          } else {
            _0xd12d83 === 'timeline' && _0xe6442a();
          }
        }
      }
      syncPersonReplacementPromptModeControl(_0x313f9e, _0x2547c2, _0x352c22()["generatingShotIds"]);
      personReplacementShellPresentation["syncStatus"](_0x313f9e, _0x2547c2);
      _0x58e350();
      _0x37e59e();
      _0x491710?.['refresh']();
      return returnSnapshot ? cloneJson(_0x2547c2) : null;
    },
    'setPersistenceState'(_0x1465dd) {
      if (_0x4d9c06) {
        return null;
      }
      _0x2547c2 = {
        ..._0x2547c2,
        'persistenceState': normalizePersonReplacementPersistenceState(_0x1465dd)
      };
      _0x30abb8["update"](_0x2547c2["persistenceState"]);
      return cloneJson(_0x2547c2["persistenceState"]);
    },
    'setOutputCanvasSyncState'(_0xc878c0 = {}) {
      if (_0x4d9c06) {
        return null;
      }
      const _0x3a3313 = _0x200819;
      _0x200819 = _0xc878c0?.['pending'] === !![];
      _0xfdff29 = _0x200819 ? normalizeText(_0xc878c0?.["scope"]) : '';
      _0x49c6e0();
      const _0x12ffa3 = _0x313f9e?.["querySelector"]?.(".person-replacement-toolbar-actions");
      const _0x35ff92 = _0x4f4afb(personReplacementShellPresentation['renderToolbarActions'](_0x2547c2, _0x2106d9()));
      _0x12ffa3 && _0x35ff92 && typeof _0x12ffa3['replaceWith'] === "function" && _0x12ffa3["replaceWith"](_0x35ff92);
      _0x2b4d89({
        'captureFocus': _0x200819 && !_0x3a3313
      });
      return {
        'pending': _0x200819,
        'scope': _0xfdff29
      };
    },
    'setComposeOutputState'(_0x292fbc = {}) {
      if (_0x4d9c06) {
        return null;
      }
      const _0x393c62 = _0x28c81f;
      _0x28c81f = _0x292fbc?.['pending'] === !![];
      const _0x38cc7e = _0x313f9e?.["querySelector"]?.('[data-person-replacement-action=\x22compose-output\x22]');
      const _0x2e89c3 = _0x4f4afb(renderCompositeComposeAction(_0x2547c2, _0x2106d9()));
      _0x38cc7e && _0x2e89c3 && typeof _0x38cc7e["replaceWith"] === "function" && _0x38cc7e["replaceWith"](_0x2e89c3);
      _0x439074();
      _0x393c62 && !_0x28c81f && _0x351fd2({
        'composeOnly': !![]
      });
      return {
        'pending': _0x28c81f
      };
    },
    'setExportOutputState'(_0x56d142 = {}) {
      if (_0x4d9c06) {
        return null;
      }
      _0x480d58 = _0x56d142?.["pending"] === !![];
      _0x49c6e0();
      const _0x39a4fd = _0x313f9e?.['querySelector']?.(".person-replacement-toolbar-actions");
      const _0x6b598e = _0x4f4afb(personReplacementShellPresentation["renderToolbarActions"](_0x2547c2, _0x2106d9()));
      _0x39a4fd && _0x6b598e && typeof _0x39a4fd["replaceWith"] === "function" && _0x39a4fd['replaceWith'](_0x6b598e);
      return {
        'pending': _0x480d58
      };
    },
    'prewarmCompositeOriginalVideo'(_0xb6909a = '') {
      if (_0x4d9c06) {
        return ![];
      }
      return _0x583852(_0xb6909a);
    },
    'getProject'() {
      return cloneJson(_0x2547c2);
    },
    'refreshVoiceSources'(_0x39d0ae = {}) {
      return _0xd86f32(_0x39d0ae);
    },
    'destroy'() {
      if (_0x4d9c06) {
        return;
      }
      _0x1f62fa();
      _0x38c4a3();
      _0xbdeb4();
      _0x1d4b46();
      _0x155aa0['dispose']();
      _0x40a6e5();
      _0x1682cd();
      _0x30afb2();
      _0xd3e343["dispose"]();
      _0x80548d();
      _0x3cc019();
      _0x4c117e();
      _0x3c89e5();
      _0x19ba31({
        'restoreFocus': ![]
      });
      _0xc321d6['dispose']();
      _0x30abb8["destroy"]();
      _0x4d9c06 = !![];
      _0x3c5dc1["forEach"](_0x46721f => _0x46721f?.["destroy"]?.());
      _0x491710?.['destroy']?.();
      _0x491710 = null;
      _0x474de2?.();
      _0x474de2 = null;
      _0x2e818c?.();
      _0x2e818c = null;
      typeof _0x313f9e?.["removeEventListener"] === "function" && _0x313f9e["removeEventListener"]("error", handleWorkspaceAssetLibraryImageError, !![]);
      _0x340f82?.();
      _0x340f82 = null;
      _0x5b532b?.();
      _0x5b532b = null;
      windowObject?.['removeEventListener']?.("keydown", _0x3fcfe3, !![]);
      windowObject?.['removeEventListener']?.("resize", _0x21abb0);
      _0x49bdfd?.["destroy"]?.();
      _0x2dbafb["destroy"]();
      _0x313f9e?.["remove"]?.();
      _0x313f9e = null;
    }
  });
  return _0x55f975;
}