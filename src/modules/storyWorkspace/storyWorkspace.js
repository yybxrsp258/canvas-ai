import { openDebugRequestWindow, renderRequestDebugButton } from '../debugRequestWindow.js';
import { createStoryAssetImageUploadController, bindStoryAssetImageDrop } from './storyAssetImageUploadController.js';
import { hasWorkspaceScrollableOverflow } from '../workspaceWheelNavigation.js';
import { buildGenerationDebugPreview } from '../../utils/generationDebugPreview.js';
import { buildCanvasLocalImageFields } from '../../services/canvasMediaLocalService.js';
import { createWorkspacePresentationLifecycle } from '../workspacePresentationLifecycle.js';
import { createWorkspacePersistencePresentation } from '../workspacePersistencePresentation.js';
import { syncStoryClipAdjustmentMenu, canGenerateStoryClipAdjustment } from './storyClipAdjustmentMenu.js';
import { normalizeStoryPromptLanguage } from '../../domain/storyGeneration/promptLanguage.js';
import { getAssetMentionCandidates, resolveAssetMentionRef, subscribeAssetMentionRegistry } from '../assetMentionRegistry.js';
import { createWorkspacePageTransitionController } from '../workspacePageTransition.js';
import { refreshWorkspaceProjectResultsInPlace } from '../workspaceProjectHome.js';
import { createWorkspaceMenuController, syncWorkspaceInlineMenuExpandedWidth } from '../workspaceMenuController.js';
import { bindAIGenTextModelSelector, renderAIGenTextModelSelectorMarkup } from '../../components/aigenText/modelSelector.js';
import { bindAIGenImageModelSelector, renderAIGenImageModelSelectorMarkup } from '../../components/aigenImage/modelSelector.js';
import { bindAIGenVideoModelSelector } from '../../components/aigenVideo/modelSelector.js';
import { buildAudioWorkflowFooterHtml } from '../../components/audio-node/audioFooterSchemaSlots.js';
import { bindAudioWorkflowSchemaSlotControls } from '../../components/audio-node/audioWorkflowSchemaSlotSync.js';
import { bindNodeFooterController, closeNodeFooterMenus, createFloatingModelMenuPortal } from '../../components/shared/nodeFooterControls.js';
import { createModelProviderProfileControl } from '../../components/shared/modelProviderProfileControl.js';
import { resolveModelExecution, resolveModelProvider } from '../../manifests/index.js';
import { hasPendingRuntimeManifestLoad, waitForRuntimeManifestLoad } from '../../manifests/runtimeManifestReadiness.js';
import { openImagePreview, openVideoPreview } from '../imagePreview.js';
import { showProviderApiKeyMissingToastForError } from '../providerApiKeyMissingToast.js';
import { resolveModelProviderProfileId } from '../modelProviderProfileSelection.js';
import { getDisplayModelName } from '../providers.js';
import { saveOutputFromUrl, uploadFile } from '../../services/projectService.js';
import { saveMediaDownload } from '../../services/downloadSaveService.js';
import { playCompletionSound } from '../../services/completionSoundService.js';
import { showGenerationCompleteNotification, subscribeGenerationCompleteNotificationClicks } from '../../services/completionNotificationService.js';
import { DEBUG_WRENCH_ICON_HTML } from '../../utils/debugRequestPreview.js';
import { createDemoStoryWorkspaceData } from './storyWorkspaceData.js';
import { renderWorkspaceAssetSelectionActions, resolveWorkspaceCardMultiSelection, toggleWorkspaceAssetSelectAll, toggleWorkspaceAssetSelection } from '../workspaceAssetSelection.js';
import { buildWorkspaceAssetLibraryItems, createWorkspaceAssetLibraryDisclosure, getWorkspaceAssetLibraryMediaLabel, handleWorkspaceAssetLibraryImageError } from '../workspaceAssetLibrary.js';
import { renderWorkspaceImageDownloadButton, runWorkspaceImageDownloadAction, saveWorkspaceImageDownload } from '../workspaceImageDownload.js';
import { buildWorkspaceAssetHoverPreviewContent, consumeWorkspaceWheelDirection, isWorkspaceAssetHoverLandscape, renderWorkspaceAssetLoadingOverlay, renderWorkspaceAssetTabIcon, resolveWorkspaceTabTransitionDirection } from '../workspaceAssetPresentation.js';
import { renderStoryAddToLibraryIcon, renderStoryDeleteIcon, renderStoryUploadIcon } from './storyWorkspaceIcons.js';
import { createStoryMediaHistoryMenuController } from './storyMediaHistory.js';
import { captureStoryRequestPayload, buildStoryRequestDebugPreviewModel, closeStoryRequestDebugPreview, openStoryRequestDebugPreview } from './storyRequestDebugPreview.js';
import { canEditStoryAssetStyleReference, clearStoryAssetAppearanceReferenceImage, ensureStoryAssetBaseAppearance, getStoryAssetAppearance, getStoryAssetAppearances, getStoryAssetBaseAppearance, isStoryAssetBaseAppearance, normalizeStoryAsset, normalizeStoryWorkspaceAssetData, resolveStoryAssetAppearanceOriginalUrl, setStoryAssetAppearanceReferenceImage, setStoryAssetBaseAppearance, shouldGenerateStoryAssetBaseAppearanceFirst } from './storyAssetAppearances.js';
import { buildMissingStoryAssetImageWarning, createStoryAssetSettingsWorkspacePresentation, getMissingStoryAssetImages, removeStoryAddedAssetAppearance } from './storyAssetSettingsWorkspacePresentation.js';
import { createStoryAssetBatchGenerationController } from './storyAssetBatchGenerationController.js';
import { createStoryAssetGenerationController } from './storyAssetGenerationController.js';
import { createStoryAssetExtractionWorkspaceController, getStoryAssetBreakdownEpisodes, isStoryAssetExperimentalExtractionAvailable, shouldUseStoryAssetBatchedExtraction, shouldUseStoryAssetParallelExtraction } from './storyAssetExtractionWorkspaceController.js';
import { buildStoryAssetStyleReferenceMentionCandidate, readStoryAssetPromptText, renderStoryAssetPromptMentions, STORY_ASSET_STYLE_REFERENCE_PILL_KIND } from './storyAssetPromptMentions.js';
import { getStoryCharacterAssetPromptPreset, getStorySceneAssetPromptPreset, STORY_CHARACTER_ASSET_PROMPT_PRESET_NONE_ID, STORY_SCENE_ASSET_PROMPT_PRESET_NONE_ID } from './storyAssetPromptPresets.js';
import { STORY_WORKSPACE_RUNNINGHUB_WORKFLOW_MODEL_IDS, getStoryWorkspaceModelChoice, getStoryWorkspaceModelOptions, resolveStoryWorkspaceModelId, resolveStoryVideoInputTextModelId } from './storyWorkspaceModelCatalog.js';
import { createStoryWorkspaceSnapshot, hasStoryWorkspaceSnapshotChanged, mergeStoryWorkspaceHydratedProjects, parseStoryWorkspaceSnapshotPayload } from './storyWorkspacePersistence.js';
import { buildStoryBackgroundTaskId, getStoryBackgroundTasks, isStoryBackgroundTaskActive } from './storyBackgroundTasks.js';
import { createStoryProjectTaskWorkspaceController } from './storyProjectTaskWorkspaceController.js';
import { createStoryProjectPersistenceWorkspaceController } from './storyProjectPersistenceWorkspaceController.js';
import { createStoryProjectDataOwner } from './storyProjectDataOwner.js';
import { createStoryCollaboration } from './storyCollaboration.js';
import { isStoryCollaborationProject } from './storyCollaborationPolicy.js';
import { renderStoryConceptionPage } from './storyCollaborationPresentation.js';
import { openStoryProjectPage } from './storyProjectNavigation.js';
import { runStoryEpisodeScriptBatchQueue } from './storyEpisodeScriptBatchQueue.js';
import { createStoryEpisodeScriptWorkspaceController } from './storyEpisodeScriptApplication.js';
import { createStoryEpisodeOutlineWorkspaceController } from './storyEpisodeOutlineApplication.js';
import { createStoryEpisodeSplitWorkspaceController, isStoryEpisodeExperimentalSplitAvailable, resolveStoryEpisodeExperimentalErrorMessage, shouldUseStoryEpisodeExperimentalSplit } from './storyEpisodeSplitWorkspaceController.js';
import { createStorySummaryGenerationWorkspaceController } from './storySummaryGenerationWorkspaceController.js';
import { createStoryTaskBatchCancellationRegistry } from './storyTaskBatchCancellation.js';
import { getStoryAssetExperimentalDraftDisplay, isStoryAssetLocalQualityRevalidationDraft } from './storyAssetExtractionDraft.js';
import { STORY_STYLE_CUSTOM_ID, resolveStoryStyleSelection } from './storyStyleCatalog.js';
import { renderStoryHome, renderStoryHomeModelBar, renderStoryHomeParamChevron, renderStoryHomeProjectResults, renderStoryProjectCard, renderStoryProjectSortControl, renderStoryScriptModeControl } from './storyHomePresentation.js';
import { clearStoryHomeReferenceScript, handleStoryHomeDocumentDragLeave, handleStoryHomeDocumentDragOver, handleStoryHomeDocumentDrop } from './storyHomeRewrite.js';
import { canGenerateStoryEpisodeScript, compileStoryEpisodeScripts, deriveStoryEpisodeAssetSummary, deriveStoryEpisodeStatus, getNextStoryEpisodeScriptIndex, getStoryEpisodeScriptBatchTargets, invalidateStoryEpisodeScriptsFrom, insertStoryEpisodeClip, removeStoryEpisodeClip, mergeStoryEpisodePlans, syncStoryPlanningVisualStyle } from './storyPlanningData.js';
import { buildStoryClipInputSlotViewModel, updateStoryClipInput } from './storyClipInputSlots.js';
import { createStoryClipVideoTaskWorkspaceController } from './storyClipVideoTaskWorkspaceController.js';
import { createStoryClipInputWorkspaceController } from './storyClipInputWorkspaceController.js';
import { createStoryClipProductionWorkspaceController } from './storyClipProductionWorkspaceController.js';
import { createStoryClipResultSelectionController } from './storyClipResultSelectionController.js';
import { storyClipProduction } from './storyClipProduction.js';
import { createStoryClipProductionPresentation } from './storyClipProductionPresentation.js';
import { createStoryScriptPlanningPresentation } from './storyScriptPlanningPresentation.js';
import { createStoryAssetSettingsPresentation } from './storyAssetSettingsPresentation.js';
import { createStoryAssetSettingsProjection, formatStoryAssetOccurrences, getStoryAssetBatchDirectMode, shouldRenderStoryAssetRoleTag } from './storyAssetSettingsProjection.js';
import { addStoryLibraryAssetsToProject } from './storyLibraryProjectAssignment.js';
import { createStoryLibraryAssignmentMenuPortal } from './storyLibraryAppearanceMenuPortal.js';
import { createStoryWorkspaceChromePresentation } from './storyWorkspaceChromePresentation.js';
import { renderStoryGenerationSpinner, syncStoryAsyncButton } from './storyAsyncButtonPresentation.js';
import { createStoryWorkspaceChromeProjection, getStoryEpisodeToolbarOptions, getStoryProjectCanvasEpisodes } from './storyWorkspaceChromeProjection.js';
import { backfillStoryVideoThumbnails } from './storyVideoThumbnailBackfill.js';
import { bindStoryVideoPreviewPlayer as a1579_0x562e67 } from './storyVideoPlayback.js';
import { createStoryClipFrameProductionController } from './storyClipFrameProductionController.js';
import { playAssetCreateFly } from '../assetCreateFly.js';
import { buildStoryClipFrameMentionCandidates, buildStoryClipFrameMentionId, createStoryClipFrameHoverAsset, getStoryClipFrameMediaType, normalizeStoryClipFrames, removeStoryClipFrame, resolveStoryClipFrameImageUrl, resolveStoryClipFrameMediaUrl, resolveStoryClipFrameMentionRef, STORY_CLIP_MEDIA_TYPE_VIDEO, upsertStoryClipFrame } from './storyClipFrames.js';
import { canEnterStoryWorkspaceStep, canReuseStoryStepNavigation, createStoryWorkspaceNavigationTransaction, getStoryEpisodeGenerationControlState, getStoryVideoEpisodes, getStoryWorkspacePageTransitionDirection, getStoryWorkspaceTransitionDirection, normalizeStoryWorkspaceStep } from './storyWorkspaceNavigationTransaction.js';
import { exportStoryClipVideos } from './storyClipExport.js';
import { applyStoryAssetNativeDragPreview, hasStoryAssetDragData, readStoryAssetDragData, readStoryAssetDragItemIndex, writeStoryAssetDragData } from './storyAssetDrag.js';
import { createStoryAssetPromptDragController } from './storyAssetPromptDragController.js';
import { createStoryAssetHoverPreviewController } from './storyAssetHoverPreviewController.js';
import { bindWorkspaceEntityContextMenu } from '../workspaceEntityContextMenu.js';
import { resolveStoryWorkspaceContextMenuItems as a1579_0x2dbdc6 } from './storyWorkspaceContextMenu.js';
import { handleWorkspaceStepShortcut } from '../workspaceStepShortcut.js';
import { t } from '../../i18n/index.js';
import { _insertMentionPill, appendMentionPillToPrompt, bindPromptMentionHost, sanitizePromptHtmlForCommit } from '../nodePromptShared.js';
import { shouldSkipPromptTriggerForBulkInput } from '../promptTriggerComposition.js';
import { localPathToUrl } from '../../utils/localMediaPath.js';
import { STORY_REPLICATION_VIDEO_ACCEPT, findStoryReplicationEpisode, getStoryReplicationLocale, getStoryVideoReplicationFooterState, mergeStoryReplicationSourceFiles, reorderStoryVideoReplicationEpisodes, resolveStoryVideoReplicationClipVoiceAssetIds, resolveStoryVideoReplicationHomeTab, syncStoryVideoReplicationProject, validateStoryReplicationVideoFile } from './storyVideoReplication.js';
import { renderStoryVideoReplicationEpisodeRail, renderStoryVideoReplicationPage, syncStoryVideoReplicationCardElement } from './storyVideoReplicationPresentation.js';
import { bindStoryReplicationReview } from './storyReplicationReviewController.js';
import { bindStoryReplicationReplacements } from './storyReplicationReplacementController.js';
import { updateStoryReplicationReplacement } from './storyReplicationReplacement.js';
import { selectStoryWorkspaceSurface, getStoryProjectWorkspaceMode } from './storyWorkspaceSurface.js';
import { bindStoryReplicationIntake, syncStoryReplicationHomeSources } from './storyReplicationIntakeController.js';
import { createStoryVideoReplicationWorkspaceController } from './storyVideoReplicationWorkspaceController.js';
import { createStoryHomeWorkspaceController } from './storyHomeWorkspaceController.js';
import { createAudioPlaybackSurfaceController } from '../../components/audio-node/audioPlaybackSurface.js';
import { clearDeletedStoryCanvasBindings } from './storyEpisodeCanvas.js';
import { reconcileStoryCanvasMediaNodes } from './storyCanvasMediaSync.js';
import { createStoryCanvasSyncWorkspaceController } from './storyCanvasSyncWorkspaceController.js';
import { beginStoryClipTimePillEdit, buildStoryClipMentionCandidates, createStoryClipTimeMentionIcon, getStoryAssetIdFromMentionNodeId, getStoryEpisodeCharacterVoiceEnabled, getStoryClipMentionVoiceState, renderStoryClipPromptMentions, resolveStoryClipAssetMentionRef, setStoryEpisodeCharacterVoiceEnabled, setStoryClipMentionVoiceEnabled, syncStoryClipPromptPillHoverTarget, syncStoryClipPromptPillPresentation } from './storyClipMentions.js';
import { clearStoryClipAdjustmentUndo } from './storyClipAdjustment.js';
import { createStoryClipAdjustmentController } from './storyClipAdjustmentController.js';
import { getStoryPromptModeLabel, normalizeStoryPromptMode, resolveStoryPromptModeDefaultVideoModelId } from './storyPromptModes.js';
import { STORY_CHARACTER_VOICE_SAMPLE_MAX_CHARACTERS, clearStoryCharacterVoiceReference, hasStoryCharacterVoiceReference, normalizeStoryCharacterVoiceReference, replaceStoryCharacterVoiceReference, selectStoryCharacterVoiceWorkflow } from './storyCharacterVoice.js';
import { createStoryCharacterVoiceWorkspaceController } from './storyCharacterVoiceWorkspaceController.js';
import { bindStoryOutlineNavigation, jumpToStoryOutlineSection } from './storyOutlineNavigation.js';
import { createStoryMarqueeSelectionController } from './storyMarqueeSelection.js';
import { STORY_ASSET_HOVER_CARD_SELECTOR, applyStoryEpisodePanelRatiosToLayout, beginStoryHorizontalResizeSession, captureStoryAssetListScrollPosition, captureStoryWorkspaceNestedScrollPositions, findStoryAssetForHover, getStoryAssetHoverCard, getStoryAssetHoverCardAppearanceId, getStoryAssetHoverCardId, isStoryGenerateShortcut, normalizeStoryAssetDetailSplitRatio, normalizeStoryAssetSplitRatio, normalizeStoryEpisodePanelRatios, restoreStoryAssetListScrollPosition, restoreStoryWorkspaceNestedScrollPositions, scrollStoryClipPromptHistoryWithWheel, scrollStoryClipStripWithWheel, shouldPreserveStoryWorkspaceNestedWheel } from './storyWorkspaceInteractions.js';
import { createStoryAssetLayoutResizeController } from './storyAssetLayoutResizeController.js';
import { STORY_CUSTOM_STYLE_MAX_CHARACTERS, STORY_EPISODE_COUNT_MAX, STORY_EPISODE_COUNT_OPTIONS, STORY_HOME_GENERATION_PROMPTS, STORY_IDEA_MAX_CHARACTERS, STORY_SCRIPT_MAX_CHARACTERS, getNextStoryScriptMode, markStorySummaryDownstreamStale, normalizeGeneratedStoryContract, normalizeGeneratedStoryContinuityFacts, normalizeStoryAspectRatio, normalizeStoryEpisodeCount, normalizeStoryProjectPlanning, normalizeStorySceneMaxSeconds, normalizeStoryScriptMode, resolveGeneratedProjectTitle, resolveStoryTextProviderProfileId } from './storyProjectPlanning.js';
import { deriveStoryProjectTaskState, reconcilePersistedStoryProjectTasks } from './storyProjectTaskState.js';
import { buildStoryAssetBatchGenerationPlan, buildStoryAssetGenerationPayload, getStoryAssetGenerationControlState, isStoryAssetAppearanceLoading, isStoryAssetBatchLoading, isStoryAssetCardLoading, isStoryAssetVoiceLoading, normalizeStoryImageGenerationParams, runStoryAssetBatchGenerationPhases, setStoryAssetAppearanceGenerating, setStoryAssetVoiceGenerating, settleStoryAssetBatchLoading } from './storyAssetGenerationState.js';
import { STORY_ASSET_TAB_LABELS, applyStoryLibraryAdditionUiState, applyStoryProjectUiState, createStoryProjectUiState, duplicateStoryProjectEntry, getStoryProjectHomeEntries, normalizeStoryEpisodeAssetRailTab, normalizeStoryProjectSortOrder, normalizeStoryProjectVoiceEditor, removeStoryProjectEntry } from './storyProjectSession.js';
import { applyStoryEpisodeVideoModelDefault, applyStoryPromptModeVideoModelDefault, applyStoryAspectRatioToVideoGenerationParams, applyStoryVideoInitialModeDefault, formatStoryClipVideoGenerationDuration, getStoryVideoFixedInputVisibilityKey, normalizeStoryVideoGenerationParams, reconcileStoryClipVideoGenerationDurationChange, recoverUnavailableStoryVideoModelState, resolveStoryClipVideoGenerationParams, resolveStoryClipVideoGenerationSettings, resolveStoryVideoClipDurationConstraints, resolveStoryVideoProvider, seedStoryAspectRatioInVideoGenerationParams, syncStoryPromptModeForVideoModel } from './storyVideoGenerationSettings.js';
import { getStoryEpisodeBatchControlState, getStoryEpisodeBatchTargets, getStoryEpisodeCardAction, isStoryAssetExtractionOperation, runStoryEpisodeSplitBatchTasks, setStoryEpisodeSplitRunning } from './storyPlanningTaskState.js';
export { addStoryLibraryAssetsToProject, applyStoryAspectRatioToVideoGenerationParams, applyStoryProjectUiState, buildStoryAssetBatchGenerationPlan, buildStoryAssetGenerationPayload, createStoryProjectUiState, duplicateStoryProjectEntry, getStoryAssetBreakdownEpisodes, getStoryAssetGenerationControlState, getStoryEpisodeBatchControlState, getStoryEpisodeBatchTargets, getStoryEpisodeCardAction, getStoryProjectHomeEntries, isStoryAssetAppearanceLoading, isStoryAssetBatchLoading, isStoryAssetCardLoading, isStoryAssetExperimentalExtractionAvailable, isStoryEpisodeExperimentalSplitAvailable, isStoryAssetVoiceLoading, isStoryAssetExtractionOperation, normalizeStoryEpisodeAssetRailTab, normalizeStoryImageGenerationParams, normalizeStoryProjectSortOrder, normalizeStoryVideoGenerationParams, recoverUnavailableStoryVideoModelState, removeStoryProjectEntry, renderStoryProjectCard, renderStoryProjectSortControl, renderStoryScriptModeControl, resolveStoryEpisodeCardMedia, resolveStoryClipVideoGenerationSettings, resolveStoryVideoClipDurationConstraints, runStoryAssetBatchGenerationPhases, runStoryEpisodeSplitBatchTasks, seedStoryAspectRatioInVideoGenerationParams, setStoryAssetAppearanceGenerating, setStoryAssetVoiceGenerating, setStoryEpisodeSplitRunning, settleStoryAssetBatchLoading, shouldUseStoryEpisodeExperimentalSplit, shouldUseStoryAssetBatchedExtraction, shouldUseStoryAssetParallelExtraction, resolveStoryEpisodeExperimentalErrorMessage };
export { syncStoryCharacterVoicePlayerPreviewUi } from './storyCharacterVoiceWorkspaceController.js';
const STORY_STEPS = Object["freeze"]([{
  'id': 0x1,
  'label': '剧情大纲'
}, {
  'id': 0x2,
  'label': "素材设定"
}, {
  'id': 0x3,
  'label': "分集视频"
}]);
const STORY_ASSET_TAB_ORDER = Object["freeze"](["character", "scene", "prop", "library"]);
function escapeHtml(_0x44e744) {
  return String(_0x44e744 ?? '')["replace"](/&/g, '&amp;')['replace'](/</g, "&lt;")["replace"](/>/g, '&gt;')["replace"](/"/g, '&quot;')['replace'](/'/g, "&#39;");
}
function normalizeText(_0x5e7942) {
  return String(_0x5e7942 || '')['trim']();
}
export function syncStoryClipFrameCardSaveError(_0x1206e2, _0x41ec7e = '') {
  if (!_0x1206e2) {
    return ![];
  }
  const _0x14b0a3 = normalizeText(_0x41ec7e);
  _0x1206e2["classList"]?.["toggle"]?.("is-save-error", Boolean(_0x14b0a3));
  if (_0x14b0a3) {
    _0x1206e2['setAttribute']?.("data-tooltip", _0x14b0a3);
  } else {
    _0x1206e2["removeAttribute"]?.('data-tooltip');
  }
  _0x1206e2["removeAttribute"]?.("data-native-title");
  _0x1206e2["removeAttribute"]?.('data-tooltip-source');
  _0x1206e2['removeAttribute']?.('title');
  return !![];
}
export function toggleStoryAssetSelectAll(_0xc7f63b = [], _0x533058 = []) {
  return toggleWorkspaceAssetSelectAll(_0xc7f63b, _0x533058);
}
export function toggleStoryAssetSelection(_0x4d8b95 = [], _0x248c5c = '', _0x5747c5 = ![]) {
  return toggleWorkspaceAssetSelection(_0x4d8b95, _0x248c5c, _0x5747c5);
}
export function updateStoryAssetBatchButtonLabel(_0x53b1c6, _0x5b4cee = '') {
  const _0x417bfa = _0x53b1c6?.["querySelector"]?.('.story-asset-batch-trigger-label');
  if (!_0x417bfa) {
    return ![];
  }
  _0x417bfa["textContent"] = String(_0x5b4cee ?? '');
  return !![];
}
export function toggleStoryEpisodeSelectAll(_0x3ce6f8 = [], _0x2d2ef3 = []) {
  return toggleStoryAssetSelectAll(_0x3ce6f8, _0x2d2ef3);
}
function toModelSearchText(_0x17dca5 = {}) {
  return [_0x17dca5['label'], _0x17dca5['providerLabel'], _0x17dca5["description"], _0x17dca5["modelId"]]["filter"](Boolean)["join"]('\x20')["toLowerCase"]();
}
function isUsableImageUrl(_0x6eb67f) {
  return /^(?:https?:|blob:|data:|\/|images\/|assets\/)/i["test"](normalizeText(_0x6eb67f));
}
const storyClipProductionPresentation = createStoryClipProductionPresentation({
  'localPathToUrl': localPathToUrl,
  'isUsableImageUrl': isUsableImageUrl,
  'renderImageOrEmpty': renderImageOrEmpty,
  'renderDeleteIcon': renderStoryDeleteIcon,
  'renderEpisodeCardActionIcon': renderStoryEpisodeCardActionIcon
});
const {
  resolveEpisodeCardMedia: resolveStoryEpisodeCardMedia
} = storyClipProductionPresentation;
const storyScriptPlanningPresentation = createStoryScriptPlanningPresentation();
const storyAssetSettingsProjection = createStoryAssetSettingsProjection({
  'resolveLibraryReference': resolveAssetMentionRef
});
const storyAssetSettingsPresentation = createStoryAssetSettingsPresentation({
  'renderAddToLibraryIcon': renderStoryAddToLibraryIcon,
  'renderDeleteIcon': renderStoryDeleteIcon,
  'renderDownloadButton': renderWorkspaceImageDownloadButton,
  'renderHomeParamChevron': renderStoryHomeParamChevron,
  'renderImage': renderImageOrEmpty,
  'renderImageModelSelector': renderAIGenImageModelSelectorMarkup,
  'renderLoadingOverlay': renderStoryAssetLoadingOverlay,
  'renderPromptMentions': renderStoryAssetPromptMentions,
  'renderSelectionActions': renderWorkspaceAssetSelectionActions,
  'renderTabIcon': renderStoryAssetTabIcon,
  'renderUploadIcon': renderStoryUploadIcon,
  'renderVoiceFooter': buildAudioWorkflowFooterHtml
});
const storyAssetSettingsWorkspacePresentation = createStoryAssetSettingsWorkspacePresentation({
  'projection': storyAssetSettingsProjection,
  'presentation': storyAssetSettingsPresentation,
  'getTabLabel': getStoryAssetTabLabel,
  'renderTabIcon': renderStoryAssetTabIcon,
  'renderPageFooter': renderPageFooter
});
const {
  getAppearanceActionKey: getStoryAssetAppearanceActionKey,
  getLibraryActionAssetIds: getStoryLibraryActionAssetIds,
  getSelectedAppearance: getSelectedAssetAppearance,
  getSelectedAppearanceIndex: getSelectedAssetAppearanceIndex,
  getSelectedAsset: getSelectedStoryAsset,
  getVisibleAssets: getVisibleStoryAssets,
  isAddedAppearance: isStoryAddedAssetAppearance,
  isSupportedCharacterVoiceFile: isSupportedStoryCharacterVoiceFile,
  renderAppearanceArrow: renderStoryAppearanceArrow,
  renderAssetBatchGenerationControl: renderStoryAssetBatchGenerationControl,
  renderAssetCard: renderStoryAssetCard,
  renderAssetDetail: renderStoryAssetDetail,
  renderAssetPreviewActions: renderStoryAssetPreviewActions,
  renderAssetPromptGenerationControl: renderStoryAssetPromptGenerationControl,
  renderAssetReferenceInput: renderStoryAssetReferenceInput,
  renderAssetsPage,
  renderClipNavigationArrow: renderStoryClipNavigationArrow,
  renderLibraryAddToProjectControl: renderStoryLibraryAddToProjectControl,
  renderLibrarySelectionActions: renderStoryLibrarySelectionActions,
  renderPreviewArrow: renderStoryPreviewArrow,
  renderVoiceIcon: renderStoryVoiceIcon,
  syncCharacterVoiceCapsuleState: syncStoryCharacterVoiceCapsuleState,
  syncCharacterVoicePlayerState: syncStoryCharacterVoicePlayerState
} = storyAssetSettingsWorkspacePresentation;
export { buildMissingStoryAssetImageWarning, formatStoryAssetOccurrences, getStoryAssetBatchDirectMode, getMissingStoryAssetImages, removeStoryAddedAssetAppearance, renderStoryAssetBatchGenerationControl, renderStoryAssetCard, renderStoryAssetDetail, renderStoryAssetPromptGenerationControl, renderStoryAssetReferenceInput, renderStoryLibraryAddToProjectControl, renderStoryLibrarySelectionActions, renderStoryPreviewArrow, shouldRenderStoryAssetRoleTag, syncStoryCharacterVoiceCapsuleState, syncStoryCharacterVoicePlayerState };
const storyWorkspaceChromeProjection = createStoryWorkspaceChromeProjection({
  'steps': STORY_STEPS
});
const storyWorkspaceChromePresentation = createStoryWorkspaceChromePresentation();
export function getStoryAssetHoverGridColumns(_0x1ddee8) {
  const _0x247466 = Math["max"](0x1, Math["floor"](Number(_0x1ddee8) || 0x1));
  return Math['ceil'](Math["sqrt"](_0x247466));
}
export function isStoryAssetHoverLandscape(_0x22889f, _0x10f0e7) {
  return isWorkspaceAssetHoverLandscape(_0x22889f, _0x10f0e7);
}
export function getGeneratedStoryAssetHoverAppearances(_0xa38d8b = [], _0x18811e = '') {
  const _0xd0339 = normalizeText(_0x18811e);
  return (Array["isArray"](_0xa38d8b) ? _0xa38d8b : [])["filter"](_0x3bbc84 => Boolean(normalizeText(_0x3bbc84?.['imageUrl'])) && (!_0xd0339 || normalizeText(_0x3bbc84?.['id']) === _0xd0339));
}
export function buildStoryAssetHoverPreviewContent(_0x34d720, {
  appearanceId = '',
  selectedAssetId = '',
  selectedAppearanceId = '',
  mediaOnly = ![]
} = {}) {
  return buildWorkspaceAssetHoverPreviewContent(_0x34d720, {
    'appearanceId': appearanceId,
    'selectedAssetId': selectedAssetId,
    'selectedAppearanceId': selectedAppearanceId,
    'mediaOnly': mediaOnly,
    'getAppearances': getStoryAssetAppearances,
    'hasVoiceReference': hasStoryCharacterVoiceReference
  });
}
export function resolveStoryAppearanceWheelDelta(_0xafc94e) {
  const _0x2bd98c = Number(_0xafc94e?.['deltaX'] || 0x0);
  const _0x4c042f = Number(_0xafc94e?.["deltaY"] || 0x0);
  const _0x3b93fd = Math["abs"](_0x4c042f) >= Math['abs'](_0x2bd98c) ? _0x4c042f : _0x2bd98c;
  const _0x371466 = Number(_0xafc94e?.["deltaMode"] || 0x0);
  const _0x24e095 = _0x371466 === 0x1 ? 0x10 : _0x371466 === 0x2 ? 0x320 : 0x1;
  return _0x3b93fd * _0x24e095;
}
export function consumeStoryWheelDirection(_0x379098, _0xafae45, {
  threshold = 0x18,
  lockDuration = 0xdc,
  now = Date["now"]()
} = {}) {
  return consumeWorkspaceWheelDirection(_0x379098, _0xafae45, {
    'threshold': threshold,
    'lockDuration': lockDuration,
    'now': now
  });
}
export function getStoryAssetTabLabel(_0x42ca7f) {
  return STORY_ASSET_TAB_LABELS[_0x42ca7f] || STORY_ASSET_TAB_LABELS["character"];
}
export function getStoryAssetTabTransitionDirection(_0x40d8e5, _0x46e8e4) {
  return resolveWorkspaceTabTransitionDirection(_0x40d8e5, _0x46e8e4, STORY_ASSET_TAB_ORDER);
}
export function renderStoryAssetTabIcon(_0x5afc1c) {
  return renderWorkspaceAssetTabIcon(_0x5afc1c);
}
const STORY_ASSET_PACKAGE_CATEGORY = "剧本资产";
export function buildStoryAssetPackageItemRequest({
  project = {},
  asset = {},
  appearance = {},
  image = null
} = {}) {
  const _0x20e37a = normalizeText(project?.['id']);
  const _0x23825f = normalizeText(asset?.['id']);
  const _0x1c3eec = normalizeText(appearance?.['id']);
  const _0x42cd2c = normalizeText(project?.["title"]) || "未命名剧本";
  const _0x58c478 = ["scene", "prop"]["includes"](normalizeText(asset?.["kind"])) ? normalizeText(asset["kind"]) : "character";
  const _0x46df21 = getStoryAssetTabLabel(_0x58c478);
  const _0x1f470c = normalizeText(asset?.["name"]) || '未命名' + _0x46df21;
  const _0x37703f = normalizeText(appearance?.["name"]) || "基础形象";
  const _0x3f9c9c = image && typeof image === "object" ? image : {
    ...(appearance?.["generatedImage"] && typeof appearance["generatedImage"] === "object" ? appearance["generatedImage"] : {}),
    'imageUrl': normalizeText(appearance?.["imageUrl"])
  };
  return {
    'packageKey': 'story-project:' + _0x20e37a,
    'packageName': _0x42cd2c,
    'category': STORY_ASSET_PACKAGE_CATEGORY,
    'itemKey': 'story-appearance:' + _0x23825f + ':' + _0x1c3eec,
    'itemName': _0x46df21 + '｜' + _0x1f470c + '｜' + _0x37703f,
    'image': {
      ..._0x3f9c9c,
      'imageUrl': normalizeText(_0x3f9c9c['imageUrl'] || _0x3f9c9c["displayUrl"] || _0x3f9c9c["url"] || appearance?.['imageUrl'])
    },
    'metadata': {
      'sourceKind': "story-workspace",
      'sourceProjectId': _0x20e37a
    },
    'itemMetadata': {
      'sourceKind': "story-workspace",
      'sourceProjectId': _0x20e37a,
      'sourceStoryAssetId': _0x23825f,
      'sourceStoryAppearanceId': _0x1c3eec,
      'sourceStoryAssetKind': _0x58c478
    }
  };
}
function renderImageOrEmpty({
  imageUrl = '',
  fallbackImageUrl = '',
  workspaceAssetLibraryImage = ![],
  alt = '',
  className = ''
} = {}) {
  if (isUsableImageUrl(imageUrl)) {
    const _0xdc59a3 = normalizeText(imageUrl);
    const _0x4ad919 = normalizeText(fallbackImageUrl);
    const _0x2b60ca = workspaceAssetLibraryImage ? " data-workspace-asset-library-image" + (isUsableImageUrl(_0x4ad919) && _0x4ad919 !== _0xdc59a3 ? " data-workspace-asset-library-fallback-src=\"" + escapeHtml(_0x4ad919) + '\x22' : '') : '';
    return '<img\x20class=\x22' + escapeHtml(className) + "\" src=\"" + escapeHtml(_0xdc59a3) + "\" alt=\"" + escapeHtml(alt) + "\" loading=\"lazy\" decoding=\"async\"" + _0x2b60ca + '>';
  }
  return "<div class=\"" + escapeHtml(className) + '\x20story-media-empty\x22\x20role=\x22img\x22\x20aria-label=\x22' + escapeHtml(alt + "待生成") + "\">\n    <span>待生成</span>\n  </div>";
}
export { renderStoryGenerationSpinner };
export function renderStoryAssetLoadingOverlay({
  compact = ![],
  title = "图片生成中",
  description = ''
} = {}) {
  return renderWorkspaceAssetLoadingOverlay({
    'compact': compact,
    'title': title,
    'description': description
  });
}
function renderModelIcon(_0x51aed5, _0xed84a3 = "story-model-icon") {
  if (!_0x51aed5?.["icon"] || !isUsableImageUrl(_0x51aed5['icon'])) {
    return '';
  }
  return "<img class=\"" + escapeHtml(_0xed84a3) + '\x22\x20src=\x22' + escapeHtml(_0x51aed5["icon"]) + "\" alt=\"\" loading=\"eager\" decoding=\"async\">";
}
function renderModelPicker(_0x1b2db8, _0x4587b7, _0x1d4dcb) {
  const _0x409373 = _0x1b2db8["models"][_0x4587b7];
  const _0x206e68 = getStoryWorkspaceModelChoice(_0x4587b7, _0x409373);
  const _0x2a126b = getStoryWorkspaceModelOptions(_0x4587b7);
  const _0x52258d = new Map();
  _0x2a126b["forEach"](_0x13b65e => {
    if (!_0x52258d["has"](_0x13b65e["providerLabel"])) {
      _0x52258d["set"](_0x13b65e["providerLabel"], []);
    }
    _0x52258d['get'](_0x13b65e["providerLabel"])["push"](_0x13b65e);
  });
  const _0xf10d38 = [..._0x52258d["entries"]()]["map"](([_0x42cbac, _0x17c572]) => "<section class=\"story-model-group\">\n        <h4>" + escapeHtml(_0x42cbac) + "</h4>\n        " + _0x17c572["map"](_0x6f28fb => "<button type=\"button\" class=\"story-model-option " + (_0x6f28fb["modelId"] === _0x206e68?.["modelId"] ? "is-selected" : '') + "\" data-story-model-option=\"" + escapeHtml(_0x6f28fb["modelId"]) + "\" data-story-model-kind=\"" + escapeHtml(_0x4587b7) + "\" data-story-model-search=\"" + escapeHtml(toModelSearchText(_0x6f28fb)) + "\" role=\"option\" aria-selected=\"" + (_0x6f28fb["modelId"] === _0x206e68?.['modelId']) + "\">\n              " + renderModelIcon(_0x6f28fb) + "\n              <span class=\"story-model-option-copy\">\n                <strong>" + escapeHtml(_0x6f28fb['label']) + "</strong>\n                <small>" + escapeHtml(_0x6f28fb["description"] || _0x6f28fb["providerLabel"]) + "</small>\n              </span>\n              " + (_0x6f28fb["vip"] ? "<span class=\"story-model-vip\">VIP</span>" : '') + "\n            </button>")["join"]('') + "\n      </section>")['join']('');
  return "<div class=\"story-model-picker\" data-story-model-picker=\"" + escapeHtml(_0x1d4dcb) + "\">\n    <button type=\"button\" class=\"story-model-trigger\" data-story-model-trigger aria-haspopup=\"listbox\" aria-expanded=\"false\">\n      " + renderModelIcon(_0x206e68) + "\n      <span class=\"story-model-trigger-copy\">\n        <small>" + (_0x4587b7 === "text" ? "文本模型" : _0x4587b7 === "image" ? "图像模型" : '视频模型') + '</small>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<strong>' + escapeHtml(_0x206e68?.["label"] || "选择模型") + "</strong>\n      </span>\n    </button>\n    <div class=\"story-model-popover\" data-story-model-popover role=\"listbox\">\n      <label class=\"story-model-search-wrap\">\n        <span>搜索模型</span>\n        <input type=\"search\" class=\"story-model-search\" data-story-model-search-input placeholder=\"输入模型或厂商名称\" autocomplete=\"off\">\n      </label>\n      <div class=\"story-model-options\">" + _0xf10d38 + '</div>\x0a\x20\x20\x20\x20</div>\x0a\x20\x20</div>';
}
export { getStoryEpisodeToolbarOptions, getStoryProjectCanvasEpisodes };
export function renderProjectToolbar(_0x24cd26) {
  return storyWorkspaceChromePresentation["renderToolbar"](storyWorkspaceChromeProjection["projectToolbar"](_0x24cd26));
}
export function getStoryScriptWorkflowStage(_0x589d5c = {}) {
  const _0x5a6a83 = _0x589d5c?.["project"] || {};
  const _0x4c0699 = Array["isArray"](_0x589d5c?.["episodes"]) ? _0x589d5c["episodes"] : [];
  if (_0x5a6a83["sourceMode"] === 'upload-original') {
    return compileStoryEpisodeScripts(_0x4c0699)["complete"] ? "scripts-complete" : "scripts-pending";
  }
  if (_0x5a6a83["summaryStatus"] === "generating") {
    return "summary-generating";
  }
  if (!normalizeText(_0x5a6a83['summary'])) {
    return 'summary-pending';
  }
  if (_0x5a6a83["outlineStatus"] === "generating") {
    return "outline-generating";
  }
  if (_0x5a6a83['outlineStatus'] === "stale") {
    return "outline-stale";
  }
  if (!_0x4c0699["length"]) {
    return "summary-ready";
  }
  return compileStoryEpisodeScripts(_0x4c0699)["complete"] ? "scripts-complete" : "scripts-pending";
}
export function updateStorySummaryCharacterField(_0x54e216 = [], _0x2d6e47 = -0x1, _0x3d1b3e = '', _0x37cea5 = '') {
  const _0x269a2a = Array["isArray"](_0x54e216) ? _0x54e216[_0x2d6e47] : null;
  const _0x45135a = new Set(["name", "roleType", "fixedTraits", "visualAppearance", "voiceDescription", "coreTags", "profile", "motivation", 'personality', "relationships", "arc"]);
  if (!_0x269a2a || !_0x45135a["has"](_0x3d1b3e)) {
    return ![];
  }
  _0x3d1b3e === "coreTags" ? _0x269a2a["coreTags"] = String(_0x37cea5 || '')['split'](/[、,，\n]+/)["map"](_0x15eaf6 => normalizeText(_0x15eaf6))["filter"](Boolean) : _0x269a2a[_0x3d1b3e] = String(_0x37cea5 || '');
  return !![];
}
export function updateStoryEpisodeOutlineField(_0xb57c1 = {}, _0x548532 = '', _0x3cf9a0 = '', _0x5de148 = '') {
  if (!['synopsis', "hook"]["includes"](_0x3cf9a0) || !Array["isArray"](_0xb57c1?.["episodes"])) {
    return ![];
  }
  const _0x4839a5 = _0xb57c1['episodes']["findIndex"](_0x3c0a8f => String(_0x3c0a8f?.['id'] || '') === String(_0x548532 || ''));
  if (_0x4839a5 < 0x0) {
    return ![];
  }
  _0xb57c1["episodes"][_0x4839a5]?.["script"]?.['fullText'] && (_0xb57c1["episodes"] = invalidateStoryEpisodeScriptsFrom(_0xb57c1['episodes'], _0x4839a5));
  _0xb57c1["episodes"][_0x4839a5][_0x3cf9a0] = String(_0x5de148 ?? '');
  return !![];
}
export function isStoryOutlineSectionOpen(_0x31fd43 = {}, _0x20d6fe = '', _0xbb1418 = ![]) {
  const _0x5c123a = _0x31fd43?.["outlineSectionOpenState"];
  if (_0x5c123a && Object['prototype']['hasOwnProperty']['call'](_0x5c123a, _0x20d6fe)) {
    return _0x5c123a[_0x20d6fe] === !![];
  }
  return Boolean(_0xbb1418);
}
function createStoryScriptPlanningEpisodeView(_0x5a000f, _0x33ea11, _0x2e954e) {
  const _0x100247 = Array["isArray"](_0x5a000f['data']?.["episodes"]) ? _0x5a000f["data"]['episodes'] : [];
  const _0x11a51d = _0x5a000f["data"]?.['project'] || {};
  const _0x4ab354 = Math["max"](0x0, Math['trunc'](Number(_0x2e954e) || 0x0));
  const _0x5b863c = Math["max"](0x1, Math["trunc"](Number(_0x33ea11?.["number"]) || _0x4ab354 + 0x1));
  const _0x28b976 = _0x33ea11?.['id'];
  const _0x20f88f = normalizeText(_0x28b976);
  const _0x5b4add = Boolean(_0x33ea11?.["script"]?.["fullText"]);
  const _0x38c6b3 = _0x5a000f["generatingEpisodeScriptId"] === _0x28b976;
  const _0x140f17 = Array["isArray"](_0x5a000f['selectedScriptEpisodeIds']) ? _0x5a000f['selectedScriptEpisodeIds'] : [];
  const _0xbbfa0f = normalizeText(_0x5a000f["generatingEpisodeScriptId"]);
  return {
    'id': _0x20f88f,
    'index': _0x4ab354,
    'number': _0x5b863c,
    'title': _0x33ea11?.["title"] || '',
    'synopsis': _0x33ea11?.["synopsis"] || '',
    'hook': _0x33ea11?.["hook"] || '',
    'scriptFullText': _0x33ea11?.['script']?.['fullText'] || '',
    'isComplete': _0x5b4add,
    'isGenerating': _0x38c6b3,
    'isSelected': _0x140f17["includes"](_0x28b976),
    'isOpen': _0xbbfa0f ? _0x38c6b3 : isStoryOutlineSectionOpen(_0x5a000f, "episode-" + _0x20f88f, _0x4ab354 < 0x2),
    'canSelect': !_0x5b4add && _0x4ab354 >= getNextStoryEpisodeScriptIndex(_0x100247),
    'canGenerate': _0x11a51d["sourceMode"] !== "upload-original" && _0x11a51d["outlineStatus"] !== 'stale' && canGenerateStoryEpisodeScript(_0x100247, _0x4ab354),
    'selectionMode': _0x5a000f["scriptSelectionMode"] === !![],
    'disabled': Boolean(_0x5a000f["storyPlanningOperation"]),
    'generationMessage': _0x5a000f["episodeScriptGenerationStatus"] || "正在生成第 " + _0x5b863c + " 集完整剧本",
    'allowRegeneration': _0x11a51d["sourceMode"] !== 'upload-original' && _0x11a51d["outlineStatus"] !== 'stale',
    'regeneration': {
      'isConfirming': normalizeText(_0x5a000f['pendingRegenerationTarget']) === "episode-script:" + _0x20f88f,
      'disabled': Boolean(_0x5a000f["storyPlanningOperation"] || _0x5a000f["isGeneratingStory"])
    }
  };
}
function createStoryScriptPlanningEpisodeSectionView(_0x1dad0f) {
  const _0x44e267 = _0x1dad0f['data']?.["project"] || {};
  const _0x2dac08 = Array['isArray'](_0x1dad0f["data"]?.["episodes"]) ? _0x1dad0f["data"]['episodes'] : [];
  const _0x171f02 = compileStoryEpisodeScripts(_0x2dac08);
  const _0x5d9db3 = Array["isArray"](_0x1dad0f["selectedScriptEpisodeIds"]) ? _0x1dad0f["selectedScriptEpisodeIds"] : [];
  const _0x340297 = _0x5d9db3["length"] ? getStoryEpisodeScriptBatchTargets(_0x2dac08, _0x5d9db3) : [];
  const _0x38b00d = _0x1dad0f["scriptSelectionMode"] === !![];
  return {
    'episodes': _0x2dac08["map"]((_0x20d702, _0x11b7b2) => createStoryScriptPlanningEpisodeView(_0x1dad0f, _0x20d702, _0x11b7b2)),
    'isUploadedOriginal': _0x44e267["sourceMode"] === "upload-original",
    'isOutlineGenerating': _0x1dad0f["storyPlanningOperation"] === "planning-episode-outlines",
    'loadingMessage': _0x1dad0f["storyPlanningStatus"] || "正在生成所有分集大纲...",
    'complete': _0x171f02["complete"],
    'selectionMode': _0x38b00d,
    'batchCount': _0x38b00d ? _0x340297["length"] : Math["max"](0x0, _0x171f02['totalCount'] - _0x171f02['completedCount']),
    'isStale': _0x44e267["outlineStatus"] === "stale",
    'busy': Boolean(_0x1dad0f['storyPlanningOperation']),
    'batchGenerating': _0x1dad0f["storyPlanningOperation"] === "writing-episode-scripts",
    'batchCancelRequested': _0x1dad0f["episodeScriptBatchCancelRequested"] === !![]
  };
}
export function renderStoryEpisodeOutlineItem(_0x85b252, _0x47eb0c, _0x9169ec) {
  return storyScriptPlanningPresentation["renderPlanning"]({
    'kind': 'episode-item',
    'item': createStoryScriptPlanningEpisodeView(_0x85b252, _0x47eb0c, _0x9169ec)
  });
}
function renderStoryAssetContinuationIcon() {
  return "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M8 5.5 18 12 8 18.5Z\"/></svg>";
}
export function renderStoryEpisodeOutlineSection(_0x1cabbb) {
  return storyScriptPlanningPresentation["renderPlanning"]({
    'kind': "episode-section",
    'section': createStoryScriptPlanningEpisodeSectionView(_0x1cabbb)
  });
}
export function renderStoryTextRequestDebugAction({
  isDeveloperMode = ![],
  action = '',
  title = "只预览下一次请求，不发送 API",
  disabled = ![]
} = {}) {
  if (!isDeveloperMode || !normalizeText(action)) {
    return '';
  }
  return renderRequestDebugButton("data-story-action=\"" + escapeHtml(action) + "\" title=\"" + escapeHtml(title) + '\x22\x20' + (disabled ? "disabled" : ''));
}
export function renderStoryScriptGenerationFooter(_0x196bdf) {
  const _0x3f9450 = compileStoryEpisodeScripts(_0x196bdf["data"]['episodes']);
  const _0x58ca2f = Math["max"](0x0, _0x3f9450['totalCount'] - _0x3f9450["completedCount"]);
  const _0x394852 = getNextStoryEpisodeScriptIndex(_0x196bdf["data"]['episodes']);
  const _0x21861d = _0x196bdf["data"]["episodes"][_0x394852] || null;
  const _0x4b0158 = _0x21861d ? Math["max"](0x1, Math["trunc"](Number(_0x21861d["number"]) || _0x394852 + 0x1)) : 0x0;
  const _0x2aa7ab = Boolean(_0x196bdf["storyPlanningOperation"]);
  const _0x4cc4fa = _0x196bdf["storyPlanningOperation"] === 'writing-episode-scripts';
  const _0x2bf247 = _0x196bdf["storyPlanningOperation"] === 'writing-episode-script';
  const _0x4f1aba = _0x196bdf["episodeScriptBatchCancelRequested"] === !![];
  const _0x4f7ccc = _0x196bdf["scriptSelectionMode"] ? getStoryEpisodeScriptBatchTargets(_0x196bdf["data"]["episodes"], _0x196bdf["selectedScriptEpisodeIds"]) : [];
  const _0x5a3314 = _0x4f7ccc["length"];
  const _0x4f1073 = _0x196bdf["scriptSelectionMode"] ? "data-story-action=\"generate-episode-scripts-batch\" data-story-script-batch-scope=\"selected\"" : 'data-story-action=\x22generate-next-episode-script\x22';
  const _0x32e228 = _0x196bdf['scriptSelectionMode'] ? '生成\x20' + _0x5a3314 + '\x20集' : _0x21861d ? "生成第 " + _0x4b0158 + '\x20集' : "已全部生成";
  const _0x190e9c = _0x2aa7ab || (_0x196bdf['scriptSelectionMode'] ? !_0x5a3314 : !_0x21861d);
  const _0x2c95a7 = renderStoryTextRequestDebugAction({
    'isDeveloperMode': Boolean(_0x196bdf["experimentalSplitAvailable"]),
    'action': "debug-episode-script-request",
    'title': '只预览下一集正文的实际请求，不发送\x20API',
    'disabled': _0x2aa7ab || !_0x21861d
  });
  const _0x12aca6 = _0x4cc4fa ? "<button type=\"button\" class=\"story-primary-button\" data-story-action=\"cancel-episode-scripts-batch\" aria-label=\"取消尚未开始的分集\" " + (_0x4f1aba ? "disabled" : '') + '>' + (_0x4f1aba ? "已取消排队" : '取消') + "</button>" : "<button type=\"button\" class=\"story-secondary-button\" data-story-action=\"generate-episode-scripts-batch\" data-story-script-batch-scope=\"all\" " + (_0x2aa7ab || !_0x58ca2f ? 'disabled' : '') + '>生成全集</button>\x0a\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22story-primary-button\x22\x20' + _0x4f1073 + '\x20' + (_0x190e9c ? "disabled" : '') + " aria-busy=\"" + _0x2bf247 + '\x22>' + (_0x2bf247 ? renderStoryGenerationSpinner({
    'button': !![]
  }) : '') + escapeHtml(_0x2bf247 ? _0x196bdf['storyPlanningStatus'] || '正在生成分集正文' : _0x32e228) + "</button>";
  return renderPageFooter(_0x196bdf, {
    'title': '分集大纲生成完成后，将按顺序生成剧本正文',
    'hint': _0x196bdf['episodeScriptGenerationStatus'] || "已完成 " + _0x3f9450["completedCount"] + '/' + _0x3f9450["totalCount"] + '\x20集',
    'actionsMarkup': '\x0a\x20\x20\x20\x20\x20\x20' + _0x2c95a7 + "\n      " + _0x12aca6 + "\n      <button type=\"button\" class=\"story-secondary-button story-script-continue-button\" data-story-action=\"continue-to-assets\" aria-label=\"进入下一步：人设与素材拆解\" " + (_0x2aa7ab ? "disabled" : '') + '>' + renderStoryAssetContinuationIcon() + '</button>'
  });
}
export { getStoryAssetExperimentalDraftDisplay, isStoryAssetLocalQualityRevalidationDraft };
export function renderStoryAssetExtractionFooter(_0x6c4522 = {}) {
  const _0x44ae13 = Boolean(_0x6c4522["storyPlanningOperation"]);
  const _0xd72577 = _0x6c4522["storyPlanningOperation"] === "extracting-assets-experimental";
  const _0x14a369 = _0x6c4522['storyPlanningStatus'] || '正在提取角色、场景与道具';
  const _0x1c9a7d = getStoryAssetExperimentalDraftDisplay(_0x6c4522["data"]?.["assetExtractionDraft"]);
  const _0x2fe5b1 = getStoryAssetExperimentalDraftDisplay(_0x6c4522['data']?.["experimentalAssetExtractionDraft"]);
  const _0x15f9df = _0x6c4522['storyPlanningOperation'] === 'extracting-assets-experimental' ? '混合提取中' : _0x2fe5b1["hasProgress"] ? _0x2fe5b1['actionLabel'] : "开发测试";
  const _0x539a78 = _0x2fe5b1["hasProgress"] ? _0x2fe5b1["summary"] : "开发测试 V1：先由本地 PP-UIE 建立候选清单；中短剧本仍把完整原文交给角色、场景、道具三条专用 API，超长剧本只提交受预算约束的剧情证据。每类最多一次且不自动重试；失败不会写入本地兜底提示词，也不会覆盖现有素材";
  const _0x190dfc = _0x2fe5b1["hasProgress"] ? '' : " title=\"" + escapeHtml(_0x539a78) + '\x22';
  const _0x2b04bb = _0x44ae13 ? _0x14a369 : _0x1c9a7d["hasProgress"] ? _0x1c9a7d['actionLabel'] : "下一步：提取角色、场景与道具";
  const _0x5b9d3a = !_0x44ae13 && _0x1c9a7d["needsModelChange"] ? "<div class=\"story-asset-recovery-model-picker\">\n        <span>切换文本模型</span>\n        " + renderAIGenTextModelSelectorMarkup({
    'modelId': _0x6c4522["models"]?.["text"],
    'provider': _0x6c4522["textProvider"],
    'providerProfileId': _0x6c4522['textProviderProfileId'],
    'includeRunningHubInternational': !![],
    'getDisplayModelName': getDisplayModelName,
    'className': "story-asset-recovery-text-model-selector"
  }) + "\n      </div>" : '';
  const _0x36fce9 = _0x6c4522["experimentalAssetExtractionAvailable"] ? "<button type=\"button\" class=\"story-secondary-button story-experimental-asset-extraction\" data-story-action=\"extract-assets-experimental\"" + _0x190dfc + '\x20' + (_0x44ae13 ? "disabled" : '') + " aria-busy=\"" + _0xd72577 + '\x22>' + (_0xd72577 ? renderStoryGenerationSpinner({
    'button': !![]
  }) : '') + escapeHtml(_0x15f9df) + "</button>" : '';
  const _0x41b9f7 = renderStoryTextRequestDebugAction({
    'isDeveloperMode': Boolean(_0x6c4522['experimentalAssetExtractionAvailable']),
    'action': "debug-asset-extraction-experimental-request",
    'title': "只预览首批本地素材抽取输入，不运行模型",
    'disabled': _0x44ae13
  });
  return renderPageFooter(_0x6c4522, {
    'nextLabel': "下一步：提取角色、场景与道具",
    'nextAction': 'extract-assets',
    'title': _0x1c9a7d["hasProgress"] ? "素材提取进度" : '',
    'hint': _0x1c9a7d["summary"] || _0x2fe5b1['summary'],
    'actionsMarkup': "\n      " + _0x41b9f7 + '\x0a\x20\x20\x20\x20\x20\x20' + _0x36fce9 + "\n      " + _0x5b9d3a + "\n      " + renderRequestDebugButton("data-story-action=\"debug-asset-extraction-request\"") + "\n      <button type=\"button\" class=\"story-next-button\" data-story-action=\"extract-assets\" " + (_0x44ae13 ? 'disabled' : '') + " aria-busy=\"" + _0x44ae13 + '\x22>' + (_0x44ae13 ? renderStoryGenerationSpinner({
      'button': !![]
    }) : '') + "<span>" + escapeHtml(_0x2b04bb) + '</span>' + (_0x44ae13 ? '' : "<span class=\"story-next-arrow\" aria-hidden=\"true\">→</span>") + '</button>'
  });
}
export function renderStoryEpisodeOutlinePlanningFooter(_0x4ef772 = {}, {
  stale = ![]
} = {}) {
  const _0x461d2b = Boolean(_0x4ef772["storyPlanningOperation"]);
  const _0x51ce90 = stale ? "重新运行" : "生成分集大纲";
  const _0x483486 = renderStoryTextRequestDebugAction({
    'isDeveloperMode': Boolean(_0x4ef772["experimentalSplitAvailable"]),
    'action': "debug-episode-outline-request",
    'title': "只预览生成分集大纲的实际请求，不发送 API",
    'disabled': _0x461d2b
  });
  const _0x278789 = _0x461d2b ? _0x4ef772["storyPlanningStatus"] || "正在生成分集大纲" : _0x51ce90;
  return renderPageFooter(_0x4ef772, {
    'nextLabel': _0x51ce90,
    'nextAction': "plan-episode-outlines",
    'title': stale ? '故事蓝图已修改' : '',
    'hint': stale ? "现有分集内容仍然保留；重新运行后将按当前蓝图更新" : '',
    'actionsMarkup': "\n      " + _0x483486 + '\x0a\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22story-next-button\x22\x20data-story-action=\x22plan-episode-outlines\x22\x20' + (_0x461d2b ? "disabled" : '') + " aria-busy=\"" + _0x461d2b + '\x22>' + (_0x461d2b ? renderStoryGenerationSpinner({
      'button': !![]
    }) : '') + "<span>" + escapeHtml(_0x278789) + '</span>' + (_0x461d2b ? '' : "<span class=\"story-next-arrow\" aria-hidden=\"true\">→</span>") + "</button>"
  });
}
function createStoryScriptPlanningPageView(_0x3fa9e2, _0x29b368 = '') {
  const _0x3fba32 = _0x3fa9e2['data']?.["project"] || {};
  const _0x3835c0 = Array["isArray"](_0x3fa9e2["data"]?.["episodes"]) ? _0x3fa9e2["data"]['episodes'] : [];
  const _0x2d7118 = _0x3fba32["sourceMode"] === "upload-original";
  const _0x42e7c9 = _0x3fba32["sourceMode"] === "upload-rewrite";
  const _0x5f133b = _0x3fa9e2["storyPlanningOperation"] === "planning-episode-outlines";
  const _0x415db6 = Boolean(_0x5f133b || _0x3fa9e2["scriptGenerationFocusMode"] && _0x3835c0['length']);
  const _0x59de21 = !_0x415db6 && isStoryOutlineSectionOpen(_0x3fa9e2, "original", !![]);
  const _0x44dadf = !_0x415db6 && isStoryOutlineSectionOpen(_0x3fa9e2, "summary", !![]);
  const _0x5a3216 = _0x415db6 || isStoryOutlineSectionOpen(_0x3fa9e2, "episodes", !![]);
  const _0x510a05 = Boolean(_0x3fa9e2["storyPlanningOperation"] || _0x3fa9e2["isGeneratingStory"]);
  return {
    'isUploadedOriginal': _0x2d7118,
    'isUploadedRewrite': _0x42e7c9,
    'originalCreative': _0x3fba32["originalCreative"] || _0x3fba32['sourceDocument']?.["text"] || '',
    'rewriteInstruction': _0x3fba32["rewriteInstruction"] || '',
    'originalOpen': _0x59de21,
    'summaryOpen': _0x44dadf,
    'episodesOpen': _0x5a3216,
    'summary': {
      'status': _0x3fba32['summaryStatus'],
      'loadingMessage': _0x3fa9e2['generationStatus'] || '正在根据原始创意生成剧本摘要...',
      'isStale': _0x3fba32['outlineStatus'] === "stale",
      'episodeCount': normalizeStoryEpisodeCount(_0x3fba32['planning']?.["episodeCount"]),
      'storyType': _0x3fba32["storyType"],
      'targetAudience': _0x3fba32['targetAudience'],
      'logline': _0x3fba32['logline'],
      'coreHook': _0x3fba32["coreHook"],
      'synopsis': _0x3fba32["summary"],
      'background': _0x3fba32["background"],
      'setting': _0x3fba32["setting"],
      'contract': _0x3fba32["storyContract"],
      'plotBeats': _0x3fba32["plotBeats"],
      'continuityFacts': _0x3fba32["continuityFacts"],
      'characters': _0x3fba32["characters"] || []
    },
    'summaryRegeneration': {
      'isConfirming': normalizeText(_0x3fa9e2["pendingRegenerationTarget"]) === 'summary',
      'disabled': _0x510a05
    },
    'outlineRegeneration': {
      'isConfirming': normalizeText(_0x3fa9e2['pendingRegenerationTarget']) === "episode-outlines",
      'disabled': _0x510a05
    },
    'outlineStatus': _0x3fba32["outlineStatus"],
    'episodeSection': createStoryScriptPlanningEpisodeSectionView(_0x3fa9e2),
    'footerMarkup': _0x29b368
  };
}
export function renderOutlinePage(_0x5cc5e1) {
  const _0x31a4f5 = _0x5cc5e1["data"]?.["project"] || {};
  const _0xe9d411 = getStoryScriptWorkflowStage(_0x5cc5e1["data"]);
  const _0x3cbd4f = _0x31a4f5['sourceMode'] === "upload-original";
  const _0x4db4ef = _0x5cc5e1["storyPlanningOperation"] === 'planning-episode-outlines';
  const _0x3790fe = _0x4db4ef ? renderStoryEpisodeOutlinePlanningFooter(_0x5cc5e1, {
    'stale': _0x31a4f5["outlineStatus"] === 'stale'
  }) : _0xe9d411 === "scripts-pending" ? _0x3cbd4f ? renderStoryAssetExtractionFooter(_0x5cc5e1) : renderStoryScriptGenerationFooter(_0x5cc5e1) : _0xe9d411 === "summary-ready" ? renderStoryEpisodeOutlinePlanningFooter(_0x5cc5e1) : _0xe9d411 === "outline-stale" ? renderStoryEpisodeOutlinePlanningFooter(_0x5cc5e1, {
    'stale': !![]
  }) : _0xe9d411 === "scripts-complete" ? renderStoryAssetExtractionFooter(_0x5cc5e1) : '';
  return storyScriptPlanningPresentation["renderPlanning"]({
    'kind': "page",
    'page': createStoryScriptPlanningPageView(_0x5cc5e1, _0x3790fe)
  });
}
export function renderStoryAssetBreakdownPage(_0x168a8f = {}) {
  const _0x541c2e = getStoryAssetBreakdownEpisodes(_0x168a8f);
  const _0x497dff = Math["trunc"](Number(_0x168a8f["assetBreakdownVisibleCount"]) || 0x0);
  const _0x5cfa6f = Math["min"](_0x541c2e["length"], Math["max"](_0x541c2e["length"] ? 0x1 : 0x0, _0x497dff));
  const _0x2d32df = _0x541c2e['slice'](0x0, _0x5cfa6f);
  return storyScriptPlanningPresentation['renderAssetBreakdown']({
    'episodes': _0x2d32df
  });
}
function renderStoryChapter(_0x568e62, _0x308431) {
  return "<article class=\"story-chapter-card\" data-story-chapter-index=\"" + _0x308431 + "\">\n    <label class=\"story-chapter-title\"><span>第 " + (_0x308431 + 0x1) + '\x20章</span><input\x20type=\x22text\x22\x20value=\x22' + escapeHtml(_0x568e62["title"] || '') + "\" data-story-chapter-title=\"" + _0x308431 + "\"></label>\n    <label class=\"story-chapter-content\"><span>章节正文</span><textarea data-story-chapter-content=\"" + _0x308431 + '\x22>' + escapeHtml(_0x568e62["content"] || '') + "</textarea></label>\n  </article>";
}
export function renderStoryEpisodeCardActionIcon(_0x4120e9 = 'generate') {
  if (_0x4120e9 === "edit") {
    return "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M5 19h4l10-10-4-4L5 15v4Z\"/><path d=\"m13.5 6.5 4 4M5 19l4-1\"/></svg>";
  }
  if (_0x4120e9 === "regenerate") {
    return '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20aria-hidden=\x22true\x22><path\x20d=\x22M20\x2011a8\x208\x200\x201\x200-2.34\x205.66\x22/><path\x20d=\x22M20\x204v7h-7\x22/></svg>';
  }
  return "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><rect x=\"4\" y=\"5\" width=\"12\" height=\"14\" rx=\"2\"/><path d=\"M4 10h12M8 5v14M18.5 4v5M16 6.5h5\"/></svg>";
}
export function renderStoryEpisodeExperimentalSplitAction(_0x2fc103 = {}, {
  isDeveloperMode = ![],
  disabled = ![],
  busy = ![]
} = {}) {
  if (!isDeveloperMode) {
    return '';
  }
  const _0x2f0699 = Math["max"](0x1, Math["trunc"](Number(_0x2fc103?.["number"]) || 0x1));
  const _0xefa692 = getStoryEpisodeCardAction(_0x2fc103);
  return "<button type=\"button\" class=\"story-episode-experimental-split story-episode-experimental-split--after-" + _0xefa692["kind"] + '\x22\x20data-story-action=\x22experimental-split-episode\x22\x20data-story-episode-id=\x22' + escapeHtml(_0x2fc103?.['id']) + '\x22\x20aria-label=\x22使用开发测试生成第\x20' + _0x2f0699 + " 集\" title=\"仅开发者模式可用：使用实验性分批生成流程，先规划整集蓝图，再分批生成 3–5 个片段\" " + (disabled ? "disabled" : '') + " aria-busy=\"" + busy + '\x22>' + (busy ? renderStoryGenerationSpinner({
    'button': !![]
  }) : renderStoryEpisodeCardActionIcon('generate')) + '<span>' + (busy ? "生成中" : "开发测试") + "</span></button>";
}
export function renderStoryEpisodeExperimentalModeToggle(_0x2635d0 = ![], {
  disabled = ![]
} = {}) {
  const _0xf03e25 = _0x2635d0 === !![];
  const _0x474593 = _0xf03e25 ? "实验模式已开启：生成、重新生成和批量拆分将使用实验性分批生成流程；任务会逐批执行，耗时可能增加，结果仍在持续优化" : "开启后，生成、重新生成和批量拆分将使用实验性分批生成流程；任务会逐批执行，耗时可能增加，结果仍在持续优化";
  return "<button type=\"button\" class=\"story-experimental-mode-toggle " + (_0xf03e25 ? "is-active" : '') + '\x22\x20data-story-action=\x22toggle-experimental-split-mode\x22\x20aria-pressed=\x22' + _0xf03e25 + "\" aria-label=\"" + (_0xf03e25 ? '关闭' : '开启') + "实验模式\" title=\"" + _0x474593 + '\x22\x20' + (disabled ? "disabled" : '') + "><span class=\"story-experimental-mode-track\" aria-hidden=\"true\"><span class=\"story-experimental-mode-thumb\"></span></span><span class=\"story-experimental-mode-label\">实验模式</span></button>";
}
export function renderStoryEpisodeRequestDebugAction(_0x1d4105 = {}, {
  isDeveloperMode = ![],
  disabled = ![]
} = {}) {
  if (!isDeveloperMode) {
    return '';
  }
  const _0x29fc35 = Math["max"](0x1, Math["trunc"](Number(_0x1d4105?.["number"]) || 0x1));
  const _0x386f41 = getStoryEpisodeCardAction(_0x1d4105);
  return renderRequestDebugButton("data-story-action=\"debug-experimental-split-request\" data-story-episode-id=\"" + escapeHtml(_0x1d4105?.['id']) + '\x22\x20title=\x22调试第\x20' + _0x29fc35 + " 集实验分批请求\" " + (disabled ? 'disabled' : ''));
}
export function renderStoryEpisodeSplitDraftStatus(_0x7eb65c = {}, {
  disabled = ![]
} = {}) {
  const _0x266195 = _0x7eb65c?.["splitDraft"];
  const _0xb9a597 = Array["isArray"](_0x266195?.["items"]) ? _0x266195['items'] : [];
  const _0x1e8949 = _0xb9a597["reduce"]((_0x39bbb1, _0x46a6ec) => _0x39bbb1 + (_0x46a6ec?.["status"] === 'valid' && Array["isArray"](_0x46a6ec?.["clips"]) ? _0x46a6ec["clips"]["length"] : 0x0), 0x0);
  const _0x242719 = _0xb9a597["filter"](_0x484538 => _0x484538?.['status'] !== 'valid');
  const _0x3b6034 = _0x242719["length"];
  if (!_0x3b6034) {
    return '';
  }
  const _0x5ae9b0 = normalizeText((Array['isArray'](_0x266195?.["rejectedClips"]) ? _0x266195["rejectedClips"] : [])["find"](_0x455cf1 => normalizeText(_0x455cf1?.['message']))?.["message"] || _0x242719["find"](_0xfa9972 => normalizeText(_0xfa9972?.['error']?.["message"]))?.["error"]?.["message"]);
  const _0x582a3a = _0x242719['some'](_0x3d8e2d => Array["isArray"](_0x3d8e2d?.["rawClips"]) && _0x3d8e2d['rawClips']["length"] > 0x0);
  const _0x181d67 = _0x1e8949 > 0x0 || _0x582a3a;
  const _0x2f7e73 = _0x1e8949 > 0x0 ? "应用 " + _0x1e8949 + " 个合格片段" : "重新校验已保存结果";
  const _0x582abf = _0x1e8949 > 0x0 ? "只应用已通过校验的片段，不调用模型" : "使用当前规则重新校验已保存的片段，不调用模型";
  const _0x182c47 = _0x181d67 ? '<button\x20type=\x22button\x22\x20class=\x22story-secondary-button\x20story-episode-split-draft-repair\x22\x20data-story-action=\x22repair-episode-split-draft\x22\x20data-story-episode-id=\x22' + escapeHtml(_0x7eb65c?.['id']) + "\" title=\"" + _0x582abf + '\x22\x20' + (disabled ? 'disabled' : '') + '>' + _0x2f7e73 + '</button>' : "<span class=\"story-episode-split-draft-guidance\">请点击右上角重新生成</span>";
  return "<div class=\"story-episode-split-draft\" role=\"status\" aria-live=\"polite\">\n    <span class=\"story-episode-split-draft-copy\">本次返回未完全通过：已保留 " + _0x1e8949 + '\x20个合格片段和\x20' + _0x3b6034 + " 项原始错误；当前旧版本未被覆盖。" + (_0x5ae9b0 ? '\x20失败原因：' + escapeHtml(_0x5ae9b0) : '') + "</span>\n    " + _0x182c47 + "\n  </div>";
}
function createStoryEpisodeCardPresentation(_0x349201, _0x296286) {
  const _0x419264 = _0x349201["selectedEpisodeIds"]["includes"](_0x296286['id']);
  const _0x5983f0 = Array["isArray"](_0x349201?.["data"]?.["assets"]);
  const _0x8af96d = _0x5983f0 ? deriveStoryEpisodeAssetSummary(_0x296286, _0x349201["data"]["assets"]) : {
    'characterCount': Number(_0x296286?.["characterCount"]) || 0x0,
    'sceneCount': Number(_0x296286?.["sceneCount"]) || 0x0,
    'propCount': Number(_0x296286?.["propCount"]) || 0x0
  };
  const _0x507535 = getStoryEpisodeGenerationControlState(_0x349201, _0x296286['id']);
  const _0xc48039 = _0x507535["isGenerating"];
  const _0xccee08 = deriveStoryEpisodeStatus(_0x296286["clips"]);
  const _0x3bf0e3 = getStoryEpisodeCardAction(_0x296286);
  const _0x1b757f = _0x349201["episodeSelectionMode"] === !![];
  return {
    'id': _0x296286['id'],
    'number': _0x296286["number"],
    'sequenceLabel': _0x349201["data"]?.["project"]?.["sourceMode"] === "video-replication" ? "视频 " + _0x296286["number"] : '第\x20' + _0x296286["number"] + '\x20集',
    'title': _0x296286['title'],
    'status': _0xccee08,
    'characterCount': _0x8af96d["characterCount"],
    'sceneCount': _0x8af96d["sceneCount"],
    'propCount': _0x8af96d["propCount"],
    'clipCount': _0x296286["clipCount"],
    'isChecked': _0x419264,
    'isSelectionMode': _0x1b757f,
    'isSplitting': _0xc48039,
    'disabled': _0x507535["disabled"],
    'actionKind': _0x3bf0e3["kind"],
    'actionLabel': _0x3bf0e3["label"],
    'media': resolveStoryEpisodeCardMedia(_0x296286),
    'experimentalActionMarkup': renderStoryEpisodeExperimentalSplitAction(_0x296286, {
      'isDeveloperMode': Boolean(_0x349201['experimentalSplitAvailable']),
      'disabled': _0x507535["disabled"],
      'busy': _0xc48039
    }),
    'requestDebugMarkup': renderStoryEpisodeRequestDebugAction(_0x296286, {
      'isDeveloperMode': Boolean(_0x349201['experimentalSplitAvailable']),
      'disabled': _0x507535["disabled"]
    }),
    'splitDraftMarkup': renderStoryEpisodeSplitDraftStatus(_0x296286, {
      'disabled': _0x507535["disabled"]
    })
  };
}
export function renderEpisodeCard(_0x2da809, _0x351954) {
  return storyClipProductionPresentation["renderOverview"]({
    'kind': "card",
    'card': createStoryEpisodeCardPresentation(_0x2da809, _0x351954)
  });
}
function renderStoryEpisodeSplitTextModelSelectorMarkup(_0x15aa3e) {
  const _0x4eda2f = _0x15aa3e["splitTextModel"];
  const _0x26b7bc = _0x4eda2f && _0x4eda2f["modelId"] ? _0x4eda2f : {
    'modelId': _0x15aa3e["models"]?.["text"],
    'provider': _0x15aa3e["textProvider"],
    'providerProfileId': _0x15aa3e["textProviderProfileId"]
  };
  return "<div class=\"story-episode-split-model-picker\">\x0a\x20\x20\x20\x20\x20\x20<span>分镜模型</span>\x0a\x20\x20\x20\x20\x20\x20" + renderAIGenTextModelSelectorMarkup({
    'modelId': _0x26b7bc["modelId"],
    'provider': _0x26b7bc["provider"],
    'providerProfileId': _0x26b7bc["providerProfileId"],
    'getDisplayModelName': getDisplayModelName,
    'className': "story-episode-split-text-model-selector"
  }) + "\x0a\x20\x20\x20\x20</div>";
}
export function renderEpisodesPage(_0x15aa3e) {
  const _0x3ff2ea = getStoryEpisodeBatchControlState(_0x15aa3e);
  const _0x98d263 = getStoryVideoEpisodes(_0x15aa3e['data']["episodes"]);
  const _0x2c4b13 = shouldUseStoryEpisodeExperimentalSplit(_0x15aa3e);
  const _0x3074d1 = _0x3ff2ea["disabled"] || Array["isArray"](_0x15aa3e["splittingEpisodeIds"]) && _0x15aa3e['splittingEpisodeIds']['length'] > 0x0;
  const _0x506e1c = _0x98d263["length"] > 0x0 && _0x98d263["every"](_0x3ff628 => _0x15aa3e['selectedEpisodeIds']["includes"](_0x3ff628['id']));
  return storyClipProductionPresentation["renderOverview"]({
    'kind': "page",
    'title': _0x15aa3e["workspaceSurface"] === 'replication' ? "视频列表" : "分集视频",
    'eyebrow': _0x15aa3e["workspaceSurface"] === 'replication' ? '分段提示词与视频制作' : "剧本拆分结果",
    'description': _0x15aa3e["workspaceSurface"] === "replication" ? "选择视频生成分段提示词，完成后进入视频制作。" : "每一集会形成一套片段脚本；确认后可创建为新的画布页面。",
    'experimentalMode': _0x2c4b13,
    'experimentalModeToggleMarkup': renderStoryEpisodeExperimentalModeToggle(_0x2c4b13, {
      'disabled': _0x3074d1
    }),
    'splitTextModelSelectorMarkup': renderStoryEpisodeSplitTextModelSelectorMarkup(_0x15aa3e),
    'selectionMode': _0x15aa3e["episodeSelectionMode"] === !![],
    'allEpisodesSelected': _0x506e1c,
    'selectedCount': _0x15aa3e["selectedEpisodeIds"]["length"],
    'batchControl': _0x3ff2ea,
    'cards': _0x98d263["map"](_0x22bc20 => createStoryEpisodeCardPresentation(_0x15aa3e, _0x22bc20)),
    'footerMarkup': renderPageFooter(_0x15aa3e, {
      'nextLabel': "保存并返回项目列表",
      'isLast': !![]
    })
  });
}
function renderPageFooter(_0x467f62, _0x213dfb = {}) {
  return storyWorkspaceChromePresentation["renderFooter"](storyWorkspaceChromeProjection["projectFooter"](_0x467f62, _0x213dfb));
}
function getSelectedEpisode(_0x4df084) {
  return _0x4df084["data"]['episodes']["find"](_0x34eb90 => _0x34eb90['id'] === _0x4df084["selectedEpisodeId"]) || _0x4df084["data"]["episodes"][0x0];
}
function getSelectedClip(_0x48fe64, _0x46d8d8) {
  return _0x46d8d8?.["clips"]?.["find"](_0x4668be => _0x4668be['id'] === _0x48fe64["selectedClipId"]) || _0x46d8d8?.["clips"]?.[0x0] || null;
}
function getStoryEpisodeAssetRailHelp(_0x2131c1) {
  if (_0x2131c1 === "frames") {
    return '视频提取画面与裁剪片段，可拖入提示词或删除';
  }
  if (_0x2131c1 === 'library') {
    return "连接画布素材库，可拖入提示词";
  }
  return "拖入提示词";
}
export function renderEpisodeAssetRail(_0x701095) {
  const _0x9ff42c = getSelectedEpisode(_0x701095);
  const _0x5f3cbf = deriveStoryEpisodeAssetSummary(_0x9ff42c, _0x701095["data"]["assets"])['assets'];
  const _0x2b248b = normalizeText(_0x9ff42c?.['id']);
  const _0x2d05c2 = Array['isArray'](_0x9ff42c?.["clips"]) ? _0x9ff42c["clips"] : [];
  const _0xa50fce = new Set(_0x2d05c2["map"](_0x5ae986 => normalizeText(_0x5ae986?.['id']))["filter"](Boolean));
  const _0x6b9aab = normalizeStoryClipFrames(_0x701095["data"]["clipFrames"])["filter"](_0x3fa25c => {
    const _0x5f0000 = normalizeText(_0x3fa25c["episodeId"]);
    if (_0x5f0000) {
      return _0x5f0000 === _0x2b248b;
    }
    return _0xa50fce["has"](normalizeText(_0x3fa25c['clipId']));
  });
  const _0x5c3fd9 = normalizeStoryEpisodeAssetRailTab(_0x701095["episodeAssetRailTab"]);
  const _0x53273c = buildWorkspaceAssetLibraryItems({
    'allowedTypes': null
  })["map"](_0x183327 => {
    const _0x337f08 = normalizeText(_0x183327['mediaKind']);
    return {
      ..._0x183327,
      'mediaKind': _0x337f08,
      'imageUrl': _0x337f08 === "image" ? normalizeText(_0x183327["thumbnailUrl"] || _0x183327['sourceUrl']) : normalizeText(_0x183327["thumbnailUrl"]),
      'typeLabel': getWorkspaceAssetLibraryMediaLabel(_0x337f08)
    };
  });
  return storyClipProductionPresentation["renderAssetRail"]({
    'activeTab': _0x5c3fd9,
    'helpText': getStoryEpisodeAssetRailHelp(_0x5c3fd9),
    'assetKindLabels': Object["fromEntries"](["character", "scene", "prop"]['map'](_0x7f84a0 => [_0x7f84a0, getStoryAssetTabLabel(_0x7f84a0)])),
    'assets': _0x5f3cbf["map"](_0x351b47 => ({
      'id': _0x351b47['id'],
      'name': _0x351b47["name"],
      'kind': _0x351b47["kind"],
      'imageUrl': getStoryAssetBaseAppearance(_0x351b47)?.["imageUrl"] || getStoryAssetAppearances(_0x351b47)["find"](_0x43c92c => normalizeText(_0x43c92c["imageUrl"]))?.["imageUrl"] || ''
    })),
    'clips': _0x2d05c2["map"](_0x41d616 => ({
      'id': _0x41d616?.['id'],
      'title': _0x41d616?.["title"]
    })),
    'frames': _0x6b9aab["map"](_0x5ae60e => ({
      'id': _0x5ae60e['id'],
      'name': _0x5ae60e["name"],
      'clipId': _0x5ae60e["clipId"],
      'clipTitle': _0x5ae60e['clipTitle'],
      'captureSavePending': _0x5ae60e['captureSavePending'] === !![],
      'mentionId': buildStoryClipFrameMentionId(_0x5ae60e['id']),
      'mediaType': getStoryClipFrameMediaType(_0x5ae60e),
      'imageUrl': resolveStoryClipFrameImageUrl(_0x5ae60e),
      'mediaUrl': resolveStoryClipFrameMediaUrl(_0x5ae60e)
    })),
    'libraryAssets': _0x53273c
  });
}
function renderEpisodeDetail(_0x3524a1) {
  const _0x4869b4 = getSelectedEpisode(_0x3524a1);
  const _0x185729 = getSelectedClip(_0x3524a1, _0x4869b4);
  const _0x2ce301 = _0x3524a1["data"]?.['project'] || {};
  const _0x1c9577 = resolveStoryStyleSelection({
    'styleId': _0x2ce301["videoStyleId"],
    'stylePrompt': _0x2ce301["videoStylePrompt"],
    'videoStyle': _0x2ce301["videoStyle"]
  });
  const _0x2cb0ab = [_0x1c9577["label"], normalizeStoryAspectRatio(_0x2ce301["aspectRatio"])]['filter'](Boolean);
  const _0x544711 = (_0x4869b4?.["clips"] || [])["length"] > 0x1;
  if (_0x4869b4 && _0x3524a1["selectedEpisodeId"] !== _0x4869b4['id']) {
    _0x3524a1["selectedEpisodeId"] = _0x4869b4['id'];
  }
  if (_0x185729 && _0x3524a1["selectedClipId"] !== _0x185729['id']) {
    _0x3524a1["selectedClipId"] = _0x185729['id'];
  }
  const _0x3ea716 = normalizeStoryEpisodePanelRatios(_0x3524a1["episodeAssetPanelRatio"], _0x3524a1["episodeEditorPanelRatio"]);
  const _0x270d03 = storyClipProduction["renderEpisode"](_0x3524a1, _0x4869b4, _0x185729);
  return storyClipProductionPresentation["renderDetail"]({
    'title': _0x185729?.["title"] || "片段脚本",
    'clipMeta': _0x2cb0ab,
    'ratios': _0x3ea716,
    'hasMultipleClips': _0x544711,
    'assetRailMarkup': renderEpisodeAssetRail(_0x3524a1),
    'episodeRailMarkup': _0x2ce301["sourceMode"] === "video-replication" ? renderStoryVideoReplicationEpisodeRail(getStoryEpisodeToolbarOptions(_0x3524a1['data']["episodes"]), _0x3524a1["selectedEpisodeId"]) : '',
    'referenceSummary': _0x270d03["referenceSummary"],
    'promptSurface': _0x270d03["promptSurface"],
    'navigationMarkup': _0x544711 ? '' + renderStoryClipNavigationArrow("previous") + renderStoryClipNavigationArrow("next") : '',
    'videoPreview': _0x270d03["videoPreview"],
    'timeline': _0x270d03['timeline']
  });
}
function renderProjectPage(_0x15166c) {
  if (_0x15166c["step"] === 0x0 && _0x15166c['view'] === "project" && isStoryCollaborationProject(_0x15166c["data"])) {
    return renderStoryConceptionPage(_0x15166c);
  }
  if (_0x15166c["view"] === "episode") {
    return renderEpisodeDetail(_0x15166c);
  }
  if (_0x15166c["step"] === 0x1 && _0x15166c["data"]?.["project"]?.["sourceMode"] === 'video-replication') {
    const _0xf8c592 = getStoryReplicationLocale(_0x15166c["data"]["project"]?.["replication"]?.["targetLocale"]);
    const _0x242812 = resolveStoryStyleSelection({
      'styleId': _0x15166c["data"]["project"]?.["videoStyleId"],
      'stylePrompt': _0x15166c["data"]["project"]?.["videoStylePrompt"],
      'videoStyle': _0x15166c["data"]['project']?.["videoStyle"]
    });
    return renderStoryVideoReplicationPage({
      'episodes': _0x15166c["data"]["episodes"],
      'targetLabel': _0xf8c592["label"],
      'styleLabel': _0x242812['label'],
      'selectionMode': _0x15166c["replicationSelectionMode"] === !![],
      'footerMarkup': renderStoryVideoReplicationFooter(_0x15166c)
    });
  }
  if (_0x15166c["step"] === 0x1 && isStoryAssetExtractionOperation(_0x15166c['storyPlanningOperation'])) {
    return renderStoryAssetBreakdownPage(_0x15166c);
  }
  if (_0x15166c["step"] === 0x2) {
    return renderAssetsPage(_0x15166c);
  }
  if (_0x15166c['step'] === 0x3) {
    return renderEpisodesPage(_0x15166c);
  }
  return renderOutlinePage(_0x15166c);
}
function renderStoryVideoReplicationFooter(_0x37abd1) {
  const _0x36c631 = getStoryVideoReplicationFooterState(_0x37abd1["data"], {
    'localizing': isStoryAssetExtractionOperation(_0x37abd1["storyPlanningOperation"]),
    'planningStatus': _0x37abd1["storyPlanningStatus"]
  });
  return renderPageFooter(_0x37abd1, {
    'title': _0x36c631['title'],
    'hint': _0x36c631["hint"],
    'actionsMarkup': "<button type=\"button\" class=\"story-next-button story-replication-next-button" + (_0x36c631['actionAttention'] ? " is-attention" : '') + "\" data-story-action=\"" + _0x36c631["action"] + '\x22\x20' + (_0x36c631["actionDisabled"] ? "disabled" : '') + '\x20aria-busy=\x22' + _0x36c631["busy"] + '\x22>' + (_0x36c631["busy"] ? renderStoryGenerationSpinner({
      'button': !![]
    }) : '') + "<span>" + escapeHtml(_0x36c631['actionLabel']) + "</span>" + (_0x36c631["busy"] ? '' : '<span\x20class=\x22story-next-arrow\x22\x20aria-hidden=\x22true\x22>→</span>') + "</button>"
  });
}
function findStoryAsset(_0x4c2840, _0x596473) {
  return _0x4c2840['data']['assets']["find"](_0x514db8 => _0x514db8['id'] === _0x596473) || null;
}
function getStoryAssetPromptEditorContext(_0x28e5e1 = {}, _0xec64ce = null) {
  const _0x13dfc8 = normalizeText(_0xec64ce?.["dataset"]?.["storyAssetPromptAssetId"]);
  const _0x3517d4 = normalizeText(_0xec64ce?.["dataset"]?.["storyAssetPromptAppearanceId"]);
  if (!_0x13dfc8 || !_0x3517d4) {
    return {
      'asset': null,
      'appearance': null
    };
  }
  const _0x39c07b = (Array["isArray"](_0x28e5e1?.["data"]?.["assets"]) ? _0x28e5e1["data"]["assets"] : [])["find"](_0x3a8001 => normalizeText(_0x3a8001?.['id']) === _0x13dfc8) || null;
  const _0x849f43 = _0x39c07b ? getStoryAssetAppearances(_0x39c07b)["find"](_0x190382 => normalizeText(_0x190382?.['id']) === _0x3517d4) || null : null;
  return {
    'asset': _0x39c07b,
    'appearance': _0x849f43
  };
}
export function updateStoryAssetPromptFromEditor(_0x53c1de = {}, _0x411af3 = null) {
  const {
    asset: _0x373a98,
    appearance: _0x170d33
  } = getStoryAssetPromptEditorContext(_0x53c1de, _0x411af3);
  if (!_0x373a98 || !_0x170d33 || _0x373a98["isLibraryAsset"]) {
    return ![];
  }
  _0x170d33["prompt"] = readStoryAssetPromptText(_0x411af3);
  normalizeText(getStoryAssetAppearances(_0x373a98)[0x0]?.['id']) === normalizeText(_0x170d33['id']) && (_0x373a98['prompt'] = _0x170d33["prompt"]);
  return !![];
}
function updateSelectedClipPrompt(_0x105df3, _0x26cfb3) {
  const _0x367aaa = getSelectedEpisode(_0x105df3);
  const _0x193667 = getSelectedClip(_0x105df3, _0x367aaa);
  if (_0x193667) {
    _0x193667['prompt'] = sanitizePromptHtmlForCommit(String(_0x26cfb3 || ''));
  }
}
function syncProjectChapterContent(_0x2473d7) {
  normalizeText(_0x2473d7?.['outlineStatus']) !== "completed" && !_0x2473d7?.["compiledScript"] && (_0x2473d7['sourceChapters'] = (_0x2473d7["chapters"] || [])["map"](_0x312d32 => ({
    'id': normalizeText(_0x312d32?.['id']),
    'title': normalizeText(_0x312d32?.["title"]),
    'content': normalizeText(_0x312d32?.['content'])
  })));
  const _0x330175 = (_0x2473d7['chapters'] || [])["map"](_0x55e981 => (normalizeText(_0x55e981["title"]) + '\x0a' + normalizeText(_0x55e981["content"]))["trim"]())["filter"](Boolean)["join"]('\x0a\x0a');
  _0x2473d7["plotScript"] = _0x330175;
  _0x2473d7["narrationScript"] = _0x330175;
}
export function reportStoryWorkspaceApiError(_0x280ed1, _0xc011be, _0x82d09 = {}) {
  const _0x1dd9d2 = normalizeText(_0x280ed1) || "unknown-operation";
  const _0x59fbdc = Number(_0xc011be?.["status"]);
  const _0x45257d = {
    'operation': _0x1dd9d2,
    'message': normalizeText(_0xc011be?.["message"] || _0xc011be) || "未知错误",
    'model': normalizeText(_0x82d09?.["model"]),
    'provider': normalizeText(_0xc011be?.['provider'] || _0x82d09?.["provider"]),
    'status': Number['isFinite'](_0x59fbdc) ? _0x59fbdc : null,
    'code': _0xc011be?.["code"] ?? null,
    'type': normalizeText(_0xc011be?.["type"] || _0xc011be?.["name"]) || "Error",
    'retryable': typeof _0xc011be?.["retryable"] === "boolean" ? _0xc011be["retryable"] : null,
    'raw': _0xc011be?.['raw'] ?? null
  };
  globalThis['console']?.['error']?.("[storyWorkspace][" + _0x1dd9d2 + "] API 请求失败", _0x45257d, _0xc011be);
  return _0x45257d;
}
export function resolveStoryTaskResultDestination(_0x36eb08 = {}, _0x2171ab = {}) {
  const _0x480299 = Array["isArray"](_0x36eb08?.['episodes']) ? _0x36eb08["episodes"] : [];
  const _0x247295 = Array["isArray"](_0x36eb08?.["assets"]) ? _0x36eb08['assets'] : [];
  const _0x347fe4 = normalizeText(_0x2171ab?.['episodeId']);
  const _0xbaca96 = _0x480299["find"](_0x4e7fc6 => normalizeText(_0x4e7fc6?.['id']) === _0x347fe4);
  if (_0xbaca96 && Array["isArray"](_0xbaca96["clips"]) && _0xbaca96["clips"]["length"]) {
    const _0x20e044 = normalizeText(_0x2171ab?.["clipId"]);
    const _0x4b478b = _0xbaca96["clips"]['find'](_0x43f5b8 => normalizeText(_0x43f5b8?.['id']) === _0x20e044) || _0xbaca96['clips'][0x0];
    return {
      'view': "episode",
      'step': 0x3,
      'episodeId': normalizeText(_0xbaca96['id']),
      'clipId': normalizeText(_0x4b478b?.['id'])
    };
  }
  const _0x3aaa65 = normalizeText(_0x2171ab?.["assetId"]);
  const _0x316a12 = _0x247295["find"](_0x2ae844 => normalizeText(_0x2ae844?.['id']) === _0x3aaa65);
  if (_0x316a12) {
    return {
      'view': "project",
      'step': 0x2,
      'assetId': normalizeText(_0x316a12['id']),
      'assetFilter': normalizeText(_0x316a12["kind"]) || 'character'
    };
  }
  const _0xd62175 = normalizeStoryWorkspaceStep(_0x2171ab?.["step"]);
  return {
    'view': 'project',
    'step': _0xd62175,
    'outlineSectionId': _0xd62175 === 0x1 ? normalizeText(_0x2171ab?.["outlineSectionId"]) : ''
  };
}
export function notifyStoryTaskResult(_0xff7ee1, _0x3b3f99, _0x4ea1e2 = 'info', {
  details: _0xeb0ae4,
  duration: _0x59f311,
  toastOptions: _0x4b230d,
  consoleObject = globalThis["console"]
} = {}) {
  const _0x372b6c = _0x4ea1e2 === "warning" ? "warn" : String(_0x4ea1e2 || "info");
  const _0x394b9a = String(_0x3b3f99 || '')["trim"]() || "任务状态已更新。";
  const _0x3526a3 = consoleObject?.["error"] || consoleObject?.["log"];
  if (_0x372b6c === "error" && typeof _0x3526a3 === 'function') {
    const _0x509a52 = {
      'tone': _0x372b6c,
      'message': _0x394b9a,
      'timestamp': new Date()['toISOString']()
    };
    _0xeb0ae4 === undefined ? _0x3526a3["call"](consoleObject, '[storyWorkspace][task-result]', _0x509a52) : _0x3526a3['call'](consoleObject, "[storyWorkspace][task-result]", _0x509a52, _0xeb0ae4);
  }
  if (typeof _0xff7ee1 !== "function") {
    return ![];
  }
  _0x59f311 === undefined && _0x4b230d === undefined ? _0xff7ee1(_0x394b9a, _0x372b6c) : _0xff7ee1(_0x394b9a, _0x372b6c, _0x59f311, _0x4b230d);
  return !![];
}
export function notifyStoryTextGenerationComplete(_0x5abfe3, {
  playSound = playCompletionSound,
  showNotification = showGenerationCompleteNotification,
  navigationTarget = null
} = {}) {
  const _0x35c70e = String(_0x5abfe3 || '')["trim"]() || "剧本工作室文本生成完成。";
  return Promise["allSettled"]([Promise["resolve"]()["then"](() => playSound('generation-success')), Promise["resolve"]()['then'](() => showNotification({
    'body': _0x35c70e,
    ...(navigationTarget ? {
      'navigation': navigationTarget
    } : {})
  }))]);
}
export function initStoryWorkspace({
  documentObject = globalThis["document"],
  windowObject = globalThis["window"],
  adjustClipPrompt = null,
  generateStory = null,
  generateEpisodeScript = null,
  extractAssets = null,
  extractAssetsParallel = null,
  extractAssetsExperimental = null,
  planEpisodes = null,
  recoverEpisodeSplitDraft = null,
  splitEpisode = null,
  splitEpisodesBatch = null,
  splitEpisodeExperimental = null,
  reviewEpisodeSplit = null,
  extractDocumentText = null,
  analyzeSourceVideo = null,
  createEpisodeCanvas = null,
  createProjectCanvas = null,
  subscribeCanvasNodeDeletions = null,
  subscribeCanvasMediaNodeChanges = null,
  getCanvasMediaSnapshot = null,
  syncClipFrameToCanvas = null,
  deleteCanvasNodes = null,
  generateAssetImage = null,
  saveAssetPackageItem = null,
  saveMedia = saveMediaDownload,
  loadWorkspace = null,
  saveWorkspace = null,
  projectPackages = null,
  requestWorkspaceMode = () => ![]
} = {}) {
  if (!documentObject?.['body']) {
    return null;
  }
  const _0x474bdb = documentObject["getElementById"]('storyWorkspaceRoot');
  if (_0x474bdb?.["_storyWorkspaceApi"]) {
    return _0x474bdb["_storyWorkspaceApi"];
  }
  const _0x39a295 = documentObject['getElementById']("v2-wrap");
  if (!_0x39a295) {
    return null;
  }
  const _0x5cc07f = normalizeStoryWorkspaceAssetData(createDemoStoryWorkspaceData());
  _0x5cc07f['project']["planning"] = normalizeStoryProjectPlanning(_0x5cc07f["project"], {
    'allowDeveloperPromptModes': windowObject?.['DEV_MODE'] === !![]
  });
  const _0x21f993 = resolveStoryWorkspaceModelId("text");
  const _0x2fe36a = resolveStoryWorkspaceModelId("image");
  const _0x52df87 = resolveStoryWorkspaceModelId("video");
  const _0x46a1ea = {
    'storyProjectSessionId': 0x1,
    'storyProjectSessionById': {
      [normalizeText(_0x5cc07f['project']?.['id'])]: 0x1
    },
    'experimentalSplitAvailable': isStoryEpisodeExperimentalSplitAvailable(windowObject),
    'experimentalAssetExtractionAvailable': isStoryAssetExperimentalExtractionAvailable(windowObject),
    'developerModeAvailable': windowObject?.["DEV_MODE"] === !![],
    'view': 'home',
    'step': 0x1,
    'homeTab': "generate",
    'uploadInputMode': "file",
    'replicationSourceFiles': [],
    'replicationSourcePreviewUrls': [],
    'replicationTargetLocale': "zh-CN",
    'idea': '',
    'scriptFileName': '',
    'scriptText': '',
    'scriptCharacterCount': null,
    'isGeneratingStory': ![],
    'isParsingDocument': ![],
    'canvasSyncPending': ![],
    'canvasSyncScope': '',
    'hasCreatedProject': ![],
    'projectTitleEdited': ![],
    'projects': [],
    'projectSearchQuery': '',
    'projectSortOrder': 'updated-desc',
    'showArchivedProjects': ![],
    'openProjectMenuId': '',
    'pendingDeleteProjectId': '',
    'pendingDeleteAssetAppearanceKey': '',
    'generationStatus': '',
    'storyPlanningOperation': '',
    'storyPlanningStatus': '',
    'assetBreakdownEpisodes': [],
    'assetBreakdownVisibleCount': 0x0,
    'scriptSelectionMode': ![],
    'selectedScriptEpisodeIds': [],
    'generatingEpisodeScriptId': '',
    'isBatchGeneratingScripts': ![],
    'episodeScriptBatchId': '',
    'episodeScriptBatchCancelRequested': ![],
    'scriptGenerationFocusMode': ![],
    'outlineSectionOpenState': {},
    'pageScrollPositions': {},
    'episodeScriptGenerationStatus': '',
    'pendingRegenerationTarget': '',
    'pendingClipInput': null,
    'generatingClipId': '',
    'generatingClipIds': [],
    'pendingDeleteClipId': '',
    'clipAdjustmentOpen': ![],
    'clipAdjustmentInstruction': '',
    'clipAdjustmentPromptMode': '',
    'clipAdjustmentPromptModeOpen': ![],
    'clipAdjustmentLanguage': '',
    'clipAdjustmentLanguageOpen': ![],
    'clipPromptHistoryOpen': ![],
    'clipAdjustmentGeneratingIds': [],
    'clipSelectionMode': ![],
    'selectedClipGenerationIds': [],
    'clipBatchGenerationByEpisode': {},
    'textProvider': getStoryWorkspaceModelChoice('text', _0x21f993)?.["provider"] || '',
    'textProviderProfileId': '',
    'splitTextModel': null,
    'imageProvider': resolveModelProvider(_0x2fe36a),
    'imageGenerationParams': normalizeStoryImageGenerationParams(_0x2fe36a),
    'imageGenerationParamsByModel': {},
    'assetPromptPresetId': STORY_CHARACTER_ASSET_PROMPT_PRESET_NONE_ID,
    'sceneAssetPromptPresetId': STORY_SCENE_ASSET_PROMPT_PRESET_NONE_ID,
    'videoProvider': resolveStoryVideoProvider(_0x52df87),
    'videoProviderProfileId': '',
    'videoProviderProfileIdByModel': {},
    'videoGenerationParams': applyStoryAspectRatioToVideoGenerationParams(_0x52df87, {}, _0x5cc07f["project"]?.["aspectRatio"]),
    'videoGenerationParamsByModel': {},
    'scriptMode': 'plot',
    'assetFilter': 'character',
    'assetLibraryDisclosure': createWorkspaceAssetLibraryDisclosure(),
    'assetSplitRatio': 0x32,
    'assetDetailSplitRatio': 0x32,
    'episodeAssetPanelRatio': 0x16,
    'episodeEditorPanelRatio': 0x22,
    'episodeAssetRailTab': 'assets',
    'assetSelectionMode': ![],
    'selectedAssetIds': [],
    'exportingAssetAppearanceKey': '',
    'experimentalSplitMode': ![],
    'episodeSelectionMode': ![],
    'selectedEpisodeIds': [],
    'splittingEpisodeIds': [],
    'episodeBatchSplitOperation': '',
    'episodeBatchSplitStatus': '',
    'episodeBatchSplitId': '',
    'episodeBatchSplitCancelRequested': ![],
    'assetAppearanceIndexes': {},
    'assetAppearanceMotion': '',
    'selectedAssetId': _0x5cc07f['assets']["find"](_0x1618cb => _0x1618cb["kind"] === "character")?.['id'] || '',
    'selectedEpisodeId': _0x5cc07f['episodes'][0x0]?.['id'] || '',
    'selectedClipId': _0x5cc07f["episodes"][0x0]?.['clips']?.[0x0]?.['id'] || '',
    'pendingAssetUploadId': '',
    'pendingAssetAppearanceId': '',
    'pendingCharacterVoiceAssetId': '',
    'characterVoiceEditor': null,
    'characterVoicePanelMotion': '',
    'generatingAppearanceKeys': [],
    'generatingVoiceAssetIds': [],
    'isBatchGenerating': ![],
    'batchGeneratingAssetIds': [],
    'batchGeneratingAppearanceKeys': [],
    'batchGeneratingVoiceAssetIds': [],
    'assetBatchId': '',
    'assetBatchCancelRequested': ![],
    'batchGenerationLabel': '',
    'data': _0x5cc07f,
    'models': {
      'text': _0x21f993,
      'image': _0x2fe36a,
      'video': _0x52df87
    }
  };
  const _0x329e8d = documentObject["createElement"]('section');
  _0x329e8d['id'] = "storyWorkspaceRoot";
  _0x329e8d["className"] = 'story-workspace-root';
  _0x329e8d["dataset"]['uiStop'] = '1';
  _0x329e8d["hidden"] = !![];
  _0x329e8d["setAttribute"]("aria-hidden", 'true');
  _0x329e8d["innerHTML"] = "<div class=\"story-workspace-shell\" data-story-workspace-shell>\n    <div class=\"story-workspace-toolbar\" data-story-toolbar></div>\n    <div class=\"story-page-stage\" data-story-page-stage>\n      <main class=\"story-page-viewport\" data-story-page-viewport></main>\n      <div class=\"story-workspace-generation-loading storyboard-script-loading-overlay\" data-story-planning-loading role=\"status\" aria-live=\"polite\" hidden>\n        <div class=\"storyboard-script-loading-spinner\"></div>\n        <div class=\"storyboard-script-loading-label\" data-story-planning-loading-label>正在提取角色、场景与道具</div>\n        <div class=\"storyboard-script-loading-bar\"><div class=\"storyboard-script-loading-bar-fill\"></div></div>\n      </div>\n    </div>\n  </div>\n  <div class=\"story-canvas-sync-loading storyboard-script-loading-overlay\" data-story-canvas-sync-loading role=\"status\" aria-live=\"polite\" aria-label=\"正在加入画布\" aria-hidden=\"true\" tabindex=\"-1\" hidden>\n    <div class=\"storyboard-script-loading-spinner\"></div>\n    <strong class=\"storyboard-script-loading-label\">正在加入画布</strong>\n    <small>同步完成后将自动跳转到画布</small>\n  </div>\n  <div class=\"story-asset-hover-preview\" data-story-asset-hover-preview role=\"tooltip\" aria-hidden=\"true\"></div>\n  <div class=\"story-clip-video-history-menu\" data-story-clip-video-history-menu aria-hidden=\"true\"></div>\n  <input class=\"story-hidden-input\" type=\"file\" data-story-script-file accept=\".txt,.md,.markdown,.docx,.pdf\">\n  <input class=\"story-hidden-input\" type=\"file\" data-story-replication-video-file accept=\"" + STORY_REPLICATION_VIDEO_ACCEPT + "\" multiple>\n  <input class=\"story-hidden-input\" type=\"file\" data-story-asset-file accept=\"image/*\">\n  <input class=\"story-hidden-input\" type=\"file\" data-story-asset-reference-file accept=\"image/*\">\n  <input class=\"story-hidden-input\" type=\"file\" data-story-character-voice-file accept=\".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/x-m4a\">\n  <input class=\"story-hidden-input\" type=\"file\" data-story-clip-input-file>";
  _0x39a295["appendChild"](_0x329e8d);
  const _0xd04674 = createStoryLibraryAssignmentMenuPortal({
    'storyRoot': _0x329e8d,
    'windowObject': windowObject
  });
  const _0x2b640f = (_0x172f69 = _0x329e8d) => _0xd04674["closeAppearance"](_0x172f69);
  const _0x58a467 = _0x2b2445 => _0xd04674["openAppearance"](_0x2b2445);
  const _0x5ee54e = (_0x185d7b = _0x329e8d) => _0xd04674['closeTarget'](_0x185d7b);
  const _0x52458f = _0x51f59b => _0xd04674["toggleTarget"](_0x51f59b);
  const _0x1363a3 = _0x329e8d['querySelector']("[data-story-toolbar]");
  const _0x2fa296 = _0x329e8d['querySelector']("[data-story-workspace-shell]");
  const _0x2437fb = _0x329e8d["querySelector"]("[data-story-page-stage]");
  const _0x1f811e = _0x329e8d["querySelector"]("[data-story-page-viewport]");
  const _0x5e4bff = _0x329e8d["querySelector"]('[data-story-planning-loading]');
  const _0x24eba6 = _0x329e8d["querySelector"]('[data-story-planning-loading-label]');
  const _0x1b4991 = _0x329e8d["querySelector"]('[data-story-canvas-sync-loading]');
  const _0xdc6c4a = _0x329e8d["querySelector"]("[data-story-asset-hover-preview]");
  const _0x4b8bb0 = _0x329e8d["querySelector"]("[data-story-clip-video-history-menu]");
  const _0x222ec0 = _0x329e8d["querySelector"]('[data-story-script-file]');
  const _0x49803d = _0x329e8d["querySelector"]('[data-story-replication-video-file]');
  const _0x5f4c78 = _0x329e8d['querySelector']("[data-story-asset-file]");
  const _0x3e617c = _0x329e8d["querySelector"]('[data-story-asset-reference-file]');
  const _0x21ef4b = _0x329e8d["querySelector"]('[data-story-character-voice-file]');
  const _0x3368b0 = _0x329e8d["querySelector"]("[data-story-clip-input-file]");
  let _0x145d9d = '';
  let _0x1d089a = null;
  let _0x2e3181 = null;
  let _0x49e1b2 = null;
  let _0x519284 = null;
  let _0x4c908e = null;
  let _0x111ca1 = '';
  let _0x485aec = '';
  let _0x278b76 = [];
  let _0xf91527 = '';
  const _0x562990 = new Map();
  const _0x4bf94c = new Map();
  let _0x111978 = 0x0;
  const _0xa486b2 = createStoryAssetHoverPreviewController({
    'previewElement': _0xdc6c4a,
    'getState': () => _0x46a1ea,
    'getSelectedAppearance': getSelectedAssetAppearance,
    'buildContent': buildStoryAssetHoverPreviewContent,
    'isStoryAssetHoverLandscape': isStoryAssetHoverLandscape,
    'documentObject': documentObject,
    'windowObject': windowObject
  });
  const _0x327677 = (..._0x10f601) => _0xa486b2['show'](..._0x10f601);
  let _0x574db0 = null;
  const _0xa6b14f = {
    'accumulator': 0x0,
    'lockedUntil': 0x0
  };
  const _0x58ddbc = new WeakMap();
  const _0x280f63 = createWorkspacePageTransitionController({
    'windowObject': windowObject,
    'disposePage': _0x397b4a
  });
  const _0x291db1 = new Map();
  const _0x8d1542 = new Set();
  const _0x36bd8a = new Set();
  const _0x3f6927 = createStoryTaskBatchCancellationRegistry();
  const _0x3fa036 = createStoryTaskBatchCancellationRegistry();
  const _0x2113e3 = createStoryProjectDataOwner({
    'state': _0x46a1ea
  });
  let _0x4f49a2 = ![];
  let _0x2988c5 = ![];
  let _0x3e6e62 = null;
  const _0x3e8f6e = createWorkspacePresentationLifecycle({
    'getRoot': () => _0x329e8d,
    'getContentKey': () => _0x3654ac['getRevision']()
  });
  const _0x434f23 = () => {
    const _0x3b8cf2 = isStoryEpisodeExperimentalSplitAvailable(windowObject);
    const _0x2ecda6 = isStoryAssetExperimentalExtractionAvailable(windowObject);
    const _0x395300 = windowObject?.["DEV_MODE"] === !![];
    if (_0x46a1ea['experimentalSplitAvailable'] === _0x3b8cf2 && _0x46a1ea["experimentalAssetExtractionAvailable"] === _0x2ecda6 && _0x46a1ea["developerModeAvailable"] === _0x395300) {
      return;
    }
    _0x46a1ea["experimentalSplitAvailable"] = _0x3b8cf2;
    _0x46a1ea['experimentalAssetExtractionAvailable'] = _0x2ecda6;
    _0x46a1ea["developerModeAvailable"] = _0x395300;
    _0x46a1ea["homeTab"] = resolveStoryVideoReplicationHomeTab(_0x46a1ea, _0x46a1ea['homeTab']);
    _0x46a1ea["data"]?.["project"] && (_0x46a1ea['data']["project"]["planning"] = normalizeStoryProjectPlanning(_0x46a1ea["data"]["project"], {
      'allowDeveloperPromptModes': _0x395300
    }), _0x18eeff({
      'immediate': !![]
    }));
    if (_0x4f49a2) {
      return;
    }
    if (_0x2988c5) {
      _0x325d8d();
    }
  };
  windowObject?.['addEventListener']?.("aicanvas:runtime-info", _0x434f23);
  windowObject?.["addEventListener"]?.('dev-mode-changed', _0x434f23);
  const _0x49e2b8 = (_0x408eff, _0x186488 = "info", _0x10cc93, _0x528d91) => {
    typeof windowObject?.["showToast"] === "function" && (_0x10cc93 === undefined && _0x528d91 === undefined ? windowObject["showToast"](_0x408eff, _0x186488) : windowObject["showToast"](_0x408eff, _0x186488, _0x10cc93, _0x528d91));
  };
  const _0x2678ed = (_0x687899, _0x530902 = {}) => ({
    'source': 'story-workspace',
    'projectId': normalizeText(_0x687899?.["projectId"]),
    ..._0x530902
  });
  const _0x1a8749 = (_0x21b702, _0x120544 = {}) => {
    const _0x1d31cc = _0x21b702?.["credentialPromptShown"] === !![] || showProviderApiKeyMissingToastForError(_0x21b702, {
      ..._0x120544
    });
    _0x1d31cc && notifyStoryTaskResult(null, _0x21b702?.["getUserMessage"]?.() || _0x21b702?.["message"] || "生成任务缺少可用的 API Key。", "error", {
      'details': _0x21b702
    });
    return _0x1d31cc;
  };
  const _0x255bec = (_0x556051, _0x1612b1 = "info", _0x52ef7c, _0x2337d2) => {
    if (_0x1612b1 === "error" && _0x52ef7c && _0x1a8749(_0x52ef7c)) {
      return !![];
    }
    const _0x1b2f7e = Boolean(_0x2337d2?.["projectId"]);
    return notifyStoryTaskResult(windowObject?.["showToast"], _0x556051, _0x1612b1, {
      'details': _0x52ef7c,
      ...(_0x1b2f7e ? {
        'duration': 0x2710,
        'toastOptions': {
          'ariaLabel': String(_0x556051 || "任务完成")["trim"]() + "，点击查看结果",
          'onClick': () => {
            void _0x4eae3e(_0x2337d2);
          }
        }
      } : {})
    });
  };
  const _0x95f5c4 = (_0x3c39cf, _0x174666, _0x57a66d, {
    notificationMessage = _0x3c39cf,
    tone = "success",
    details: _0x35b180,
    showResultToast = !![]
  } = {}) => {
    const _0x1728b6 = _0x2678ed(_0x174666, _0x57a66d);
    const _0x2c2cd8 = showResultToast ? _0x255bec(_0x3c39cf, tone, _0x35b180, _0x1728b6) : ![];
    void notifyStoryTextGenerationComplete(notificationMessage, {
      'navigationTarget': _0x1728b6
    });
    return _0x2c2cd8;
  };
  const _0x351b79 = (_0xcd301d, _0x4bf327, _0x4da01e, _0x4220c3, _0x10f4bb) => _0x95f5c4(_0xcd301d, _0x4da01e, _0x4220c3, {
    'tone': _0x4bf327,
    'details': _0x10f4bb
  });
  const _0x165554 = (_0x4202bc, _0x5e1129, _0x4e5cdc, {
    notificationMessage = _0x4202bc,
    tone = "success",
    details: _0x5b5abf
  } = {}) => _0x95f5c4(_0x4202bc, _0x5e1129, _0x4e5cdc, {
    'notificationMessage': notificationMessage,
    'tone': tone,
    'details': _0x5b5abf
  });
  const _0x24fcb6 = subscribeGenerationCompleteNotificationClicks(_0x324a1b => {
    if (_0x324a1b?.["source"] !== "story-workspace") {
      return;
    }
    void _0x4eae3e(_0x324a1b);
  });
  function _0x222ace(_0x42ea3a) {
    return JSON['parse'](JSON["stringify"](_0x42ea3a));
  }
  const _0x58d434 = createWorkspacePersistencePresentation({
    'getRoot': () => _0x329e8d
  });
  const _0x5e557b = createStoryProjectPersistenceWorkspaceController({
    'state': _0x46a1ea,
    'projectData': _0x2113e3,
    'windowObject': windowObject,
    'saveWorkspace': saveWorkspace,
    'onPersistenceState': _0x67edeb => _0x58d434["update"](_0x67edeb),
    'projectPackages': projectPackages,
    'advanceProjectSession': _0x4dd851 => _0x459e11(_0x46a1ea, _0x4dd851),
    'openStoredProject': (..._0x42008a) => _0x3eea2e(..._0x42008a),
    'render': (..._0x4c7a6d) => _0x325d8d(..._0x4c7a6d),
    'showToast': _0x49e2b8
  });
  const {
    collectStoredProject: _0x45afa5,
    coordinator: _0x3654ac,
    importProjectPackage: _0x4ee682,
    importProjectPackageResult: _0x2b5881,
    persistNow: _0x1c9431,
    schedule: _0x18eeff,
    syncCurrentProjectEntry: _0x2a094b
  } = _0x5e557b;
  const _0x1de4e8 = createStoryAssetLayoutResizeController({
    'state': _0x46a1ea,
    'viewportElement': _0x1f811e,
    'documentObject': documentObject,
    'windowObject': windowObject,
    'schedulePersistence': _0x18eeff
  });
  const {
    beginAssetDetailSplitResize: _0x2dc958,
    beginAssetSplitResize: _0x3aca88
  } = _0x1de4e8;
  function _0xcf5535(_0x5107a2 = {}) {
    const {
      changed: _0x1275e2
    } = _0x2113e3["applyChanges"]((_0x45d0f0, {
      isCurrent: _0x3b40e3
    }) => {
      const _0xd49dc7 = _0x3b40e3 ? new Set(normalizeStoryClipFrames(_0x45d0f0["clipFrames"])["map"](_0x80aee8 => _0x80aee8['id'])) : null;
      const _0x5395fb = clearDeletedStoryCanvasBindings(_0x45d0f0, _0x5107a2);
      if (_0x5395fb && _0xd49dc7) {
        const _0x2b2fb7 = new Set(normalizeStoryClipFrames(_0x45d0f0["clipFrames"])["map"](_0x309208 => _0x309208['id']));
        _0xd49dc7['forEach'](_0x4d8028 => {
          if (!_0x2b2fb7['has'](_0x4d8028)) {
            _0x4c04b3(_0x4d8028);
          }
        });
      }
      return _0x5395fb;
    });
    if (_0x1275e2) {
      if (_0x2988c5 && _0x46a1ea["view"] === "episode") {
        if (!_0x1d3480({
          'refreshContent': !![]
        })) {
          _0x325d8d();
        }
      }
      _0x18eeff({
        'immediate': !![]
      });
    }
    return _0x1275e2;
  }
  function _0x46f1f5(_0x5a15d0 = {}) {
    const {
      changed: _0x2d4176,
      currentProjectChanged: _0x3229f6
    } = _0x2113e3["applyChanges"]((_0x4d743a, {
      isCurrent: _0x5d6207
    }) => {
      const _0x371fc1 = _0x5d6207 ? getSelectedEpisode(_0x46a1ea) : _0x4d743a["episodes"]?.[0x0] || null;
      const _0x2dc6b4 = _0x5d6207 ? getSelectedClip(_0x46a1ea, _0x371fc1) : _0x371fc1?.['clips']?.[0x0] || null;
      return reconcileStoryCanvasMediaNodes(_0x4d743a, {
        ..._0x5a15d0,
        'episodeId': _0x371fc1?.['id'],
        'clipId': _0x2dc6b4?.['id']
      });
    });
    if (!_0x2d4176) {
      return ![];
    }
    if (_0x3229f6) {
      if (_0x2988c5 && _0x46a1ea["view"] === "episode") {
        if (!_0x1d3480({
          'refreshContent': !![]
        })) {
          _0x325d8d();
        }
      }
    }
    _0x18eeff({
      'immediate': !![]
    });
    return !![];
  }
  const _0x3a6583 = createStoryProjectTaskWorkspaceController({
    'state': _0x46a1ea,
    'activeClipGenerationControllers': _0x291db1,
    'activeBackgroundExecutions': _0x36bd8a,
    'activeBackgroundRecoveries': _0x8d1542,
    'replicationAnalysisPromises': _0x562990,
    'replicationSourceFileByEpisodeKey': _0x4bf94c,
    'projectData': _0x2113e3,
    'getWorkspaceDestroyed': () => _0x4f49a2,
    'stopAssetBreakdownProgress': (..._0x11c013) => _0x3ec610(..._0x11c013),
    'schedulePersistence': (..._0x23413d) => _0x18eeff(..._0x23413d),
    'render': (..._0x21809d) => _0x325d8d(..._0x21809d)
  });
  const {
    advanceProjectSession: _0x459e11,
    beginSession: _0x208486,
    createProjectToken: _0x3e5ebf,
    createTaskBatch: _0x59cf66,
    createTokenForData: _0x3072e5,
    finishBackgroundTask: _0x2b6b77,
    getBackgroundExecutionKey: _0xd44596,
    invalidateRuntime: _0x1bb68c,
    isCurrent: _0x30dd2e,
    isLive: _0x4d0c22,
    persistChange: _0x516ada,
    registerProjectData: _0x492bef,
    resetTaskState: _0x389fbf,
    restoreTaskState: _0x48257d,
    startBackgroundTask: _0x236a2a,
    syncProjectEntry: _0x3dc37b,
    syncTaskBatch: _0x378c9d,
    updateBackgroundTask: _0x274058,
    updateBackgroundTaskBatch: _0x3519c9
  } = _0x3a6583;
  const _0x4bcc9b = createStoryCanvasSyncWorkspaceController({
    'state': _0x46a1ea,
    'root': _0x329e8d,
    'workspaceShell': _0x2fa296,
    'loadingElement': _0x1b4991,
    'documentObject': documentObject,
    'operations': {
      'createEpisodeCanvas': createEpisodeCanvas,
      'createProjectCanvas': createProjectCanvas,
      'syncClipFrame': syncClipFrameToCanvas
    },
    'projectTasks': {
      'createToken': () => _0x3e5ebf(_0x46a1ea),
      'isCurrent': _0x30dd2e,
      'isLive': _0x4d0c22,
      'syncEntry': _0x3dc37b
    },
    'persistence': {
      'schedule': _0x18eeff
    },
    'presentation': {
      'closeMenu': (..._0x3bd36f) => _0x285a4f(..._0x3bd36f),
      'handleMediaNodeChanges': (..._0x25878a) => _0x46f1f5(..._0x25878a),
      'refreshEpisodeRail': (..._0x1878cf) => _0x1d3480(..._0x1878cf),
      'refreshToolbar': (..._0xd7ef13) => _0x3450fa(..._0xd7ef13),
      'requestWorkspaceMode': requestWorkspaceMode,
      'showToast': _0x49e2b8
    },
    'getSelectedEpisode': _0x1f2cab => getSelectedEpisode({
      ..._0x46a1ea,
      'data': _0x1f2cab
    }),
    'getProjectCanvasEpisodes': (..._0x2d341e) => getStoryProjectCanvasEpisodes(..._0x2d341e),
    'resolveClipGenerationSettings': (_0x51366b, _0x5de290) => resolveStoryClipVideoGenerationSettings(_0x51366b, _0x5de290, {
      'fallbackModelId': _0x46a1ea["models"]["video"],
      'fallbackProvider': _0x46a1ea['videoProvider']
    })
  });
  const {
    addProject: _0x5e96c3,
    addSelectedEpisode: _0x2e2337,
    destroy: _0x37467e,
    syncFrame: _0x1fab89
  } = _0x4bcc9b;
  const _0x3145bb = createStoryClipVideoTaskWorkspaceController({
    'state': _0x46a1ea,
    'activeControllers': _0x291db1,
    'createProjectToken': _0x3e5ebf,
    'createProjectTokenForData': _0x3072e5,
    'isProjectTaskLive': _0x4d0c22,
    'isProjectTaskCurrent': _0x30dd2e,
    'registerProjectData': _0x492bef,
    'startBackgroundTask': _0x236a2a,
    'updateBackgroundTask': _0x274058,
    'finishBackgroundTask': _0x2b6b77,
    'syncProjectEntry': _0x3dc37b,
    'restoreProjectTaskState': _0x48257d,
    'schedulePersistence': (..._0x2507ef) => _0x18eeff(..._0x2507ef),
    'refreshEpisodeCard': (..._0xe72a56) => _0xac701d(..._0xe72a56),
    'refreshClipGeneration': (..._0x25061c) => _0x2bc6c6(..._0x25061c),
    'render': (..._0x18083d) => _0x325d8d(..._0x18083d),
    'showTaskResultToast': _0x255bec,
    'showNavigableTaskResultToast': _0x351b79,
    'getWorkspaceDestroyed': () => _0x4f49a2,
    'windowObject': windowObject
  });
  const {
    createGenerationController: _0x199b54,
    getGenerationKey: _0x4a44af,
    replaceClip: _0x2e6181,
    resumeTask: _0x370a70,
    resumeTasks: _0x16d303,
    syncBackgroundTask: _0x385da2,
    waitForRecoveryManifest: _0xa93a6c
  } = _0x3145bb;
  const _0x56d88f = createStoryClipInputWorkspaceController({
    'state': _0x46a1ea,
    'root': _0x329e8d,
    'getSelectedEpisode': getSelectedEpisode,
    'getSelectedClip': getSelectedClip,
    'replaceClip': _0x2e6181,
    'takePendingInputContext': () => {
      const _0x5942d3 = _0x4c908e || _0x46a1ea['pendingClipInput'];
      _0x4c908e = null;
      _0x46a1ea['pendingClipInput'] = null;
      return _0x5942d3;
    },
    'createProjectToken': _0x3e5ebf,
    'isProjectTaskCurrent': _0x30dd2e,
    'isProjectTaskLive': _0x4d0c22,
    'syncProjectEntry': _0x3dc37b,
    'schedulePersistence': (..._0x566655) => _0x18eeff(..._0x566655),
    'render': (..._0x422107) => _0x325d8d(..._0x422107),
    'showToast': _0x49e2b8
  });
  const {
    applyVideoSettings: _0x180373,
    prepareVideoSettings: _0x42ff41,
    reconcileSelectedInputsForModel: _0x4f1ece,
    syncVideoDurationInPlace: _0x402d05,
    updateSelectedInput: _0x43413a,
    uploadSelectedInput: _0x977891
  } = _0x56d88f;
  const _0x14b900 = createStoryCharacterVoiceWorkspaceController({
    'state': _0x46a1ea,
    'root': _0x329e8d,
    'documentObject': documentObject,
    'windowObject': windowObject,
    'projectTasks': {
      'createToken': () => _0x3e5ebf(_0x46a1ea),
      'isCurrent': _0x30dd2e,
      'isLive': _0x4d0c22,
      'start': _0x236a2a,
      'update': _0x274058,
      'finish': _0x2b6b77
    },
    'findAsset': _0x2ca6c4 => findStoryAsset(_0x46a1ea, _0x2ca6c4),
    'render': _0x325d8d,
    'schedulePersistence': _0x18eeff,
    'showToast': _0x49e2b8,
    'showTaskApiKeyError': _0x1a8749,
    'showTaskResultToast': _0x255bec,
    'showNavigableTaskResultToast': _0x351b79,
    'isEditorSurfaceActive': () => _0x2988c5 && _0x46a1ea["view"] === "project" && _0x46a1ea["step"] === 0x2
  });
  const {
    closeEditor: _0x425497,
    generateSelected: _0x1dce2a,
    openEditor: _0x1747e6,
    playHistory: _0x1df707,
    playPreview: _0xc97927,
    requestGeneration: _0x4eddf3,
    restoreHistory: _0x1b849a,
    stopPreview: _0x22f2d9,
    syncPlayerUi: _0xd116a9
  } = _0x14b900;
  const _0x441762 = createStoryAssetGenerationController({
    'state': _0x46a1ea,
    'activeRecoveries': _0x8d1542,
    'activeExecutions': _0x36bd8a,
    'isWorkspaceDestroyed': () => _0x4f49a2,
    'hasImageGenerator': () => typeof generateAssetImage === 'function',
    'generateImage': (..._0x3562fa) => generateAssetImage(..._0x3562fa),
    'createProjectToken': () => _0x3e5ebf(_0x46a1ea),
    'createProjectTokenForData': _0x3072e5,
    'isProjectTaskLive': _0x4d0c22,
    'isProjectTaskCurrent': _0x30dd2e,
    'registerProjectData': _0x492bef,
    'waitForRecoveryManifest': _0xa93a6c,
    'startBackgroundTask': _0x236a2a,
    'updateBackgroundTask': _0x274058,
    'finishBackgroundTask': _0x2b6b77,
    'schedulePersistence': _0x18eeff,
    'render': _0x325d8d,
    'findAsset': _0xefd19b => findStoryAsset(_0x46a1ea, _0xefd19b),
    'getSelectedAppearance': getSelectedAssetAppearance,
    'showToast': _0x49e2b8,
    'showTaskApiKeyError': _0x1a8749,
    'showTaskResultToast': _0x255bec,
    'notifyTaskResult': notifyStoryTaskResult,
    'showNavigableTaskResultToast': _0x351b79
  });
  const {
    generateSelected: _0x4c9482,
    requestAppearanceImage: _0x38be8e,
    resumePersistedTasks: _0x1c2bde,
    showGenerationError: _0x488748
  } = _0x441762;
  const _0x19ee99 = createStoryAssetBatchGenerationController({
    'state': _0x46a1ea,
    'windowObject': windowObject,
    'cancellationRegistry': _0x3fa036,
    'hasImageGenerator': () => typeof generateAssetImage === "function",
    'createProjectToken': () => _0x3e5ebf(_0x46a1ea),
    'isProjectTaskLive': _0x4d0c22,
    'isProjectTaskCurrent': _0x30dd2e,
    'createTaskBatch': _0x59cf66,
    'syncTaskBatch': _0x378c9d,
    'updateBackgroundTaskBatch': _0x3519c9,
    'requestAppearanceImage': _0x38be8e,
    'requestVoiceGeneration': _0x4eddf3,
    'stopVoicePreview': _0x22f2d9,
    'render': _0x325d8d,
    'refreshBatchLabel': _0xee9559,
    'refreshAssetCard': _0x44d78e,
    'refreshSelectedAsset': _0x3c03fa,
    'schedulePersistence': _0x18eeff,
    'showToast': _0x49e2b8,
    'showAssetGenerationError': _0x488748,
    'showTaskApiKeyError': _0x1a8749,
    'notifyTaskResult': notifyStoryTaskResult,
    'showNavigableTaskResultToast': _0x351b79,
    'notifyNavigableGenerationComplete': _0x95f5c4
  });
  const {
    cancel: _0x171881,
    generate: _0x46f291
  } = _0x19ee99;
  function _0xd49ffb(_0x9bbbdd) {
    return findStoryAssetForHover(_0x46a1ea, _0x9bbbdd, getVisibleStoryAssets(_0x46a1ea));
  }
  function _0xb2038d(_0x46ab52, _0x305336) {
    if (_0x2f67dd["isActive"]() || _0x111ca1) {
      _0x1149d8();
      return;
    }
    if (_0x46ab52?.["dataset"]?.["storyReferenceSource"] === 'library') {
      const _0x4bcbcf = resolveAssetMentionRef({
        'assetId': _0x46ab52["dataset"]["storyReferenceAsset"],
        'itemIndex': Math["max"](0x0, Math['trunc'](Number(_0x46ab52["dataset"]['storyReferenceAssetIndex']) || 0x0))
      });
      const _0x1f0c86 = _0x4bcbcf?.["type"] === "image" ? normalizeText(_0x4bcbcf['thumbUrl'] || _0x4bcbcf["url"]) : normalizeText(_0x4bcbcf?.['thumbUrl']);
      if (!_0x4bcbcf || !_0x1f0c86) {
        _0x1149d8();
        return;
      }
      return _0x327677(_0x46ab52, _0x305336, {
        'id': normalizeText(_0x4bcbcf["assetId"]),
        'kind': "library",
        'name': normalizeText(_0x4bcbcf['name']) || "总素材",
        'hoverTitle': normalizeText(_0x4bcbcf['assetName']) || "总素材",
        'imageUrl': _0x1f0c86,
        'isLibraryAsset': !![]
      });
    }
    const _0xca40fa = normalizeText(_0x46ab52?.["dataset"]?.["storyReferenceFrame"]);
    if (_0xca40fa) {
      const _0x1700f1 = normalizeStoryClipFrames(_0x46a1ea["data"]["clipFrames"])['find'](_0x4f6355 => _0x4f6355['id'] === _0xca40fa);
      return _0x327677(_0x46ab52, _0x305336, createStoryClipFrameHoverAsset(_0x1700f1, getStoryAssetHoverCardId(_0x46ab52)));
    }
    return _0x327677(_0x46ab52, _0x305336, _0xd49ffb(getStoryAssetHoverCardId(_0x46ab52)), getStoryAssetHoverCardAppearanceId(_0x46ab52));
  }
  function _0x1149d8() {
    _0xa486b2['hide']();
  }
  _0x574db0 = createStoryMediaHistoryMenuController({
    'menuElement': _0x4b8bb0,
    'windowObject': windowObject,
    'getMarkup': _0x1c86e7 => {
      if (_0x46a1ea["clipSelectionMode"]) {
        return '';
      }
      const _0x503b02 = getSelectedEpisode(_0x46a1ea);
      const _0x2cbb3b = normalizeText(_0x1c86e7?.["dataset"]?.["storyClipId"]);
      const _0x57e4c9 = (Array["isArray"](_0x503b02?.["clips"]) ? _0x503b02["clips"] : [])["find"](_0x15d7d6 => normalizeText(_0x15d7d6?.['id']) === _0x2cbb3b);
      _0x4b8bb0 && (_0x4b8bb0["dataset"]["storyClipId"] = _0x2cbb3b);
      return storyClipProduction['renderEpisode'](_0x46a1ea, _0x503b02, _0x57e4c9)["videoHistoryMenu"];
    }
  });
  function _0x38f6a7() {
    _0x574db0?.["clearHideTimer"]();
  }
  function _0x2f87a6(_0x4c2af9 = {}) {
    _0x574db0?.["hide"](_0x4c2af9);
  }
  function _0x10b704(_0x2cb141, _0x3a54d1) {
    _0x574db0?.["show"](_0x2cb141, {
      'event': _0x3a54d1
    });
  }
  function _0x566f3f(_0x80b0d2, _0x3d9380, {
    persist = ![],
    layout = null
  } = {}) {
    const _0x59f33a = layout || _0x1f811e["querySelector"](".story-page.is-current .story-episode-detail-page") || _0x1f811e['querySelector'](".story-episode-detail-page");
    const _0xd1d63f = applyStoryEpisodePanelRatiosToLayout(_0x59f33a, {
      'assetSplitter': _0x59f33a?.["querySelector"]?.('[data-story-episode-splitter=\x22assets\x22]'),
      'previewSplitter': _0x59f33a?.["querySelector"]?.("[data-story-episode-splitter=\"preview\"]")
    }, _0x80b0d2, _0x3d9380);
    _0x46a1ea["episodeAssetPanelRatio"] = _0xd1d63f["left"];
    _0x46a1ea['episodeEditorPanelRatio'] = _0xd1d63f["center"];
    if (persist) {
      _0x18eeff({
        'uiOnly': !![]
      });
    }
  }
  function _0xd83589(_0x5a4b1f) {
    const _0x6b5c5d = _0x5a4b1f["target"]["closest"]?.("[data-story-episode-splitter]");
    if (!_0x6b5c5d) {
      return ![];
    }
    const _0x44368d = _0x6b5c5d["closest"]('.story-episode-detail-page');
    const _0xc192eb = _0x6b5c5d['dataset']['storyEpisodeSplitter'];
    return beginStoryHorizontalResizeSession({
      'event': _0x5a4b1f,
      'splitter': _0x6b5c5d,
      'layout': _0x44368d,
      'windowObject': windowObject,
      'body': documentObject['body'],
      'resizingClass': "story-episode-resizing",
      'onRatio': _0x5e90da => {
        _0xc192eb === "assets" ? _0x566f3f(_0x5e90da, _0x46a1ea["episodeEditorPanelRatio"], {
          'layout': _0x44368d
        }) : _0x566f3f(_0x46a1ea["episodeAssetPanelRatio"], _0x5e90da - _0x46a1ea['episodeAssetPanelRatio'], {
          'layout': _0x44368d
        });
      },
      'onFinish': () => _0x18eeff({
        'uiOnly': !![]
      })
    });
  }
  function _0x3450fa() {
    _0x1363a3["innerHTML"] = _0x46a1ea["view"] === "home" ? '' : renderProjectToolbar(_0x46a1ea);
  }
  function _0x697799(_0x2b0950, _0x55a0ba, _0x96259a) {
    if (!_0x2b0950 || _0x2b0950["dataset"]?.["promptPillKind"] === "time") {
      return;
    }
    syncStoryClipPromptPillHoverTarget(_0x2b0950);
    _0x2b0950["querySelectorAll"]?.("[data-story-voice-separator], [data-story-voice-toggle]")?.["forEach"](_0x7d0562 => _0x7d0562["remove"]());
    _0x2b0950["classList"]?.["remove"]("has-story-voice-reference", "is-story-voice-enabled");
    const _0x1dc26d = getSelectedEpisode(_0x46a1ea);
    const _0x44fb4e = getStoryAssetIdFromMentionNodeId(_0x2b0950["dataset"]?.["assetId"]);
    const _0x492cdb = resolveStoryVideoReplicationClipVoiceAssetIds(_0x46a1ea["data"], _0x96259a);
    if (_0x492cdb && !_0x492cdb['includes'](_0x44fb4e)) {
      setStoryClipMentionVoiceEnabled(_0x2b0950, _0x46a1ea['data']['assets'], ![]);
      return;
    }
    const _0x176020 = getStoryEpisodeCharacterVoiceEnabled(_0x1dc26d, _0x44fb4e);
    typeof _0x176020 === "boolean" && setStoryClipMentionVoiceEnabled(_0x2b0950, _0x46a1ea["data"]["assets"], _0x176020);
    const _0x4d23ef = getStoryClipMentionVoiceState(_0x2b0950, _0x46a1ea["data"]['assets'], {
      'voiceEnabled': _0x176020
    });
    if (!_0x4d23ef["available"]) {
      setStoryClipMentionVoiceEnabled(_0x2b0950, _0x46a1ea["data"]["assets"], ![]);
      return;
    }
    _0x2b0950['classList']?.["add"]('has-story-voice-reference');
    _0x2b0950["classList"]?.["toggle"]('is-story-voice-enabled', _0x4d23ef["enabled"]);
    const _0x189c78 = documentObject["createElement"]('span');
    _0x189c78["className"] = "story-voice-pill-separator";
    _0x189c78["dataset"]["storyVoiceSeparator"] = 'true';
    _0x189c78['setAttribute']("aria-hidden", "true");
    _0x189c78['setAttribute']("contenteditable", "false");
    _0x189c78["textContent"] = '·';
    const _0x5ad629 = documentObject['createElement']("button");
    _0x5ad629["type"] = "button";
    _0x5ad629["className"] = "story-voice-pill-toggle" + (_0x4d23ef['enabled'] ? '\x20is-active' : '');
    _0x5ad629["dataset"]["storyVoiceToggle"] = "true";
    _0x5ad629["setAttribute"]("contenteditable", "false");
    _0x5ad629["setAttribute"]("aria-pressed", String(_0x4d23ef["enabled"]));
    _0x5ad629["setAttribute"]('aria-label', _0x4d23ef['enabled'] ? '关闭角色声音参考' : "启用角色声音参考");
    _0x5ad629["innerHTML"] = renderStoryVoiceIcon(![]);
    _0x5ad629["addEventListener"]("mousedown", _0x335457 => {
      _0x335457["preventDefault"]();
      _0x335457["stopPropagation"]();
    });
    _0x5ad629["addEventListener"]("click", _0x4b6c61 => {
      _0x4b6c61['preventDefault']();
      _0x4b6c61["stopPropagation"]();
      const _0x69e8b5 = getStoryEpisodeCharacterVoiceEnabled(_0x1dc26d, _0x44fb4e);
      const _0xdce5ab = getStoryClipMentionVoiceState(_0x2b0950, _0x46a1ea["data"]["assets"], {
        'voiceEnabled': _0x69e8b5
      });
      const _0x2c7f78 = !_0xdce5ab["enabled"];
      setStoryEpisodeCharacterVoiceEnabled(_0x1dc26d, _0x44fb4e, _0x2c7f78);
      _0x55a0ba["querySelectorAll"]?.(".ref-pill")?.["forEach"](_0x53a82e => {
        if (getStoryAssetIdFromMentionNodeId(_0x53a82e["dataset"]?.['assetId']) !== _0x44fb4e) {
          return;
        }
        setStoryClipMentionVoiceEnabled(_0x53a82e, _0x46a1ea['data']['assets'], _0x2c7f78);
        _0x697799(_0x53a82e, _0x55a0ba, _0x96259a);
      });
      _0x96259a["prompt"] = sanitizePromptHtmlForCommit(_0x55a0ba["innerHTML"]);
      _0x10a1d2();
      _0x18eeff();
    });
    _0x2b0950["appendChild"](_0x189c78);
    _0x2b0950["appendChild"](_0x5ad629);
  }
  function _0x43fb36() {
    const _0x49698b = findStoryAsset(_0x46a1ea, _0x46a1ea["selectedAssetId"]);
    const _0x7c44c2 = _0x49698b ? getSelectedAssetAppearance(_0x46a1ea, _0x49698b) : null;
    return {
      'asset': _0x49698b,
      'appearance': _0x7c44c2
    };
  }
  function _0x5e5e17(_0x21a960) {
    const _0x4e82ef = getStoryAssetPromptEditorContext(_0x46a1ea, _0x21a960);
    if (!_0x21a960 || !_0x4e82ef['asset'] || !_0x4e82ef['appearance'] || _0x4e82ef["asset"]["isLibraryAsset"]) {
      return null;
    }
    return {
      'nodeId': 'story-asset-prompt:' + _0x4e82ef['asset']['id'],
      'promptEl': _0x21a960,
      '_data': {
        'type': "ai-image",
        'model': _0x46a1ea["models"]["image"],
        'provider': _0x46a1ea["imageProvider"]
      },
      'getMentionCandidates': ({
        query = ''
      } = {}) => {
        const {
          asset: _0x330536,
          appearance: _0x3a6f8b
        } = getStoryAssetPromptEditorContext(_0x46a1ea, _0x21a960);
        if (!_0x330536 || !_0x3a6f8b || !canEditStoryAssetStyleReference(_0x330536, _0x3a6f8b)) {
          return [];
        }
        const _0x35e9b5 = buildStoryAssetStyleReferenceMentionCandidate(_0x3a6f8b, {
          'query': query
        });
        return _0x35e9b5 ? [_0x35e9b5] : [];
      },
      'getMentionVisual': ({
        mention: _0x344d7f
      } = {}) => ({
        'thumbUrl': normalizeText(_0x344d7f?.["thumbUrl"]),
        'iconType': "image"
      }),
      'decorateMentionPill': ({
        pill: _0x11e2f9
      } = {}) => {
        _0x11e2f9?.["classList"]?.['add']("story-asset-style-reference-pill");
        _0x11e2f9?.["dataset"] && (_0x11e2f9["dataset"]["promptPillKind"] = STORY_ASSET_STYLE_REFERENCE_PILL_KIND);
      },
      'commitPromptHtml': () => {
        updateStoryAssetPromptFromEditor(_0x46a1ea, _0x21a960) && _0x18eeff();
      },
      'getPromptHtml': () => {
        const {
          appearance: _0x2882e5
        } = getStoryAssetPromptEditorContext(_0x46a1ea, _0x21a960);
        return _0x2882e5?.["prompt"] || '';
      }
    };
  }
  function _0x53df87(_0x5111da) {
    const _0x42294a = getSelectedEpisode(_0x46a1ea);
    const _0xcdce5d = getSelectedClip(_0x46a1ea, _0x42294a);
    if (!_0x5111da || !_0x42294a || !_0xcdce5d) {
      return null;
    }
    return {
      'nodeId': "story-clip:" + _0xcdce5d['id'],
      'promptEl': _0x5111da,
      'keepAssetMentionPills': !![],
      '_data': {
        'type': "ai-video",
        'model': _0x46a1ea["models"]["video"],
        'provider': _0x46a1ea["videoProvider"],
        'generationParams': _0x46a1ea["videoGenerationParams"]
      },
      'getMentionMenuPages': () => [{
        'id': 'assets',
        'label': '素材',
        'icon': "assets"
      }, {
        'id': "tools",
        'label': '工具',
        'icon': "tools"
      }],
      'getMentionMenuDefaultPage': () => 'assets',
      'getMentionCandidates': ({
        query = ''
      } = {}) => buildStoryClipMentionCandidates({
        'assets': _0x46a1ea["data"]["assets"],
        'episode': _0x42294a,
        'libraryCandidates': getAssetMentionCandidates(),
        'clipFrames': _0x46a1ea['data']["clipFrames"],
        'query': query,
        'includeTime': !![],
        'includeClipFrames': !![],
        'defaultDuration': _0xcdce5d["duration"]
      })["map"](_0x329392 => _0x329392['pillKind'] === "time" ? {
        ..._0x329392,
        'thumbNode': createStoryClipTimeMentionIcon(documentObject)
      } : _0x329392),
      'onMentionCandidateHover': ({
        candidate: _0x4ec0a5,
        item: _0x4e7b93,
        event: _0x2b12a1
      } = {}) => {
        const _0x1c1d47 = normalizeText(_0x4ec0a5?.["storyClipFrameId"]);
        if (_0x1c1d47 && _0x4e7b93) {
          const _0x21af42 = normalizeStoryClipFrames(_0x46a1ea["data"]["clipFrames"])["find"](_0x4ab062 => _0x4ab062['id'] === _0x1c1d47);
          const _0x46a08c = resolveStoryClipFrameImageUrl(_0x21af42);
          if (!_0x21af42 || !_0x46a08c) {
            _0x1149d8();
            return;
          }
          _0x327677(_0x4e7b93, _0x2b12a1, {
            'id': 'story-clip-frame-preview:' + _0x21af42['id'],
            'kind': "clip-frame",
            'name': normalizeText(_0x4ec0a5['subtitle'] || _0x21af42["name"]) || "视频提取帧",
            'hoverTitle': normalizeText(_0x4ec0a5['label']) || '片段帧',
            'imageUrl': _0x46a08c,
            'isLibraryAsset': !![]
          });
          return;
        }
        const _0x26aea7 = normalizeText(_0x4ec0a5?.["storyAssetId"]);
        const _0x59dcd6 = normalizeText(_0x4ec0a5?.["storyAppearanceId"]);
        if (!_0x26aea7 || !_0x4e7b93) {
          _0x1149d8();
          return;
        }
        _0x4e7b93['dataset']["storyAssetHoverId"] = _0x26aea7;
        _0x59dcd6 ? _0x4e7b93["dataset"]["storyAssetHoverAppearanceId"] = _0x59dcd6 : delete _0x4e7b93['dataset']['storyAssetHoverAppearanceId'];
        _0xb2038d(_0x4e7b93, _0x2b12a1);
      },
      'onMentionCandidateHoverEnd': () => _0x1149d8(),
      'getMentionVisual': ({
        mention: _0x2a83d8,
        pill: _0x1485c4
      } = {}) => {
        const _0x19f6a7 = normalizeText(_0x2a83d8?.['pillKind'] || _0x1485c4?.["dataset"]?.["promptPillKind"]);
        if (_0x19f6a7 === "time") {
          return {
            'thumbNode': createStoryClipTimeMentionIcon(documentObject)
          };
        }
        if (_0x2a83d8?.['storyAssetId']) {
          return {
            'thumbUrl': normalizeText(_0x2a83d8["thumbUrl"]),
            'iconType': "image"
          };
        }
        const _0xb53628 = resolveStoryClipFrameMentionRef({
          'dataset': {
            'assetId': _0x2a83d8?.['assetId'] || _0x1485c4?.['dataset']?.['assetId']
          }
        }, _0x46a1ea["data"]["clipFrames"]);
        if (_0xb53628) {
          return {
            'thumbUrl': normalizeText(_0xb53628["thumbUrl"] || _0xb53628["url"]),
            'iconType': "image"
          };
        }
        const _0x55dceb = resolveStoryClipAssetMentionRef(_0x1485c4, _0x46a1ea["data"]["assets"]);
        if (!_0x55dceb) {
          return null;
        }
        return {
          'thumbUrl': normalizeText(_0x55dceb['thumbUrl'] || _0x55dceb["url"]),
          'iconType': "image"
        };
      },
      'decorateMentionPill': ({
        pill: _0x4b6b1d
      } = {}) => {
        _0x697799(_0x4b6b1d, _0x5111da, _0xcdce5d);
        _0x4b6b1d?.["dataset"]?.['refUnresolved'] === 'true' && (_0x4b6b1d['setAttribute']?.('data-tooltip', '缺少图片素材'), _0x4b6b1d['removeAttribute']?.("data-native-title"), _0x4b6b1d['removeAttribute']?.('data-tooltip-source'), _0x4b6b1d["removeAttribute"]?.("title"));
      },
      'commitPromptHtml': _0x3fd6ba => {
        _0xcdce5d["prompt"] = _0x3fd6ba;
        _0x10a1d2();
        _0x18eeff();
      },
      'getPromptHtml': () => _0xcdce5d["prompt"],
      'onPromptPillActivate': ({
        pill: _0x4fbcd5
      } = {}) => {
        if (_0x4fbcd5?.["dataset"]?.["promptPillKind"] !== "time") {
          return ![];
        }
        beginStoryClipTimePillEdit({
          'pill': _0x4fbcd5,
          'documentObject': documentObject,
          'onCommit': () => {
            _0xcdce5d['prompt'] = sanitizePromptHtmlForCommit(_0x5111da["innerHTML"]);
            _0x18eeff();
          }
        });
        return !![];
      }
    };
  }
  function _0x11dd8c(_0x937a4c, {
    assetIndex = 0x0,
    triggerRange = null
  } = {}) {
    const _0x5262c0 = findStoryAsset(_0x46a1ea, _0x937a4c);
    const _0x135950 = getSelectedEpisode(_0x46a1ea);
    const _0x21510a = getSelectedClip(_0x46a1ea, _0x135950);
    if (!_0x21510a) {
      return ![];
    }
    const _0x159493 = _0x329e8d["querySelector"]('[data-story-clip-prompt]');
    const _0x471e3a = _0x53df87(_0x159493);
    let _0x544481 = _0x5262c0 ? buildStoryClipMentionCandidates({
      'assets': [_0x5262c0],
      'episode': {
        'assetIds': [_0x5262c0['id']]
      }
    })[0x0] : null;
    !_0x544481 && (_0x544481 = buildStoryClipFrameMentionCandidates(_0x46a1ea["data"]['clipFrames'], {
      'clips': _0x135950?.["clips"],
      'episodeId': _0x135950?.['id']
    })['flatMap'](_0x432cbc => _0x432cbc['mentionVariants'] || [_0x432cbc])["find"](_0x211f35 => _0x211f35["assetId"] === normalizeText(_0x937a4c) && !_0x211f35['limitReason']));
    if (!_0x544481) {
      const _0x3b3496 = resolveAssetMentionRef({
        'assetId': _0x937a4c,
        'itemIndex': Math["max"](0x0, Math['trunc'](Number(assetIndex) || 0x0))
      });
      _0x544481 = _0x3b3496 ? buildStoryClipMentionCandidates({
        'libraryCandidates': [_0x3b3496]
      })[0x0] : null;
    }
    if (!_0x471e3a || !_0x544481) {
      return ![];
    }
    const _0xbc5a06 = triggerRange ? _insertMentionPill(_0x471e3a, {
      'candidate': _0x544481,
      'triggerRange': triggerRange,
      'atIndex': triggerRange["startOffset"]
    }) : Boolean(appendMentionPillToPrompt(_0x471e3a, _0x544481));
    if (!_0xbc5a06) {
      return ![];
    }
    _0x159493?.["focus"]?.();
    return !![];
  }
  const _0x2f67dd = createStoryAssetPromptDragController({
    'root': _0x329e8d,
    'documentObject': documentObject,
    'windowObject': windowObject,
    'insertMention': _0x11dd8c,
    'hideHoverPreview': _0x1149d8
  });
  const {
    begin: _0x55f344,
    finish: _0x16619f,
    handleWindowPointerCancel: _0x349bac,
    handleWindowPointerMove: _0x33c641,
    handleWindowPointerUp: _0x221232,
    hideCaret: _0x34984d,
    showCaret: _0x2ae216
  } = _0x2f67dd;
  function _0x1db49e() {
    _0x111ca1 = '';
    _0x111978 = 0x0;
    _0x2f67dd["clear"]();
  }
  const _0x27e4a9 = createStoryClipAdjustmentController({
    'state': _0x46a1ea,
    'root': _0x329e8d,
    'documentObject': documentObject,
    'adjustClipPrompt': adjustClipPrompt,
    'getSelection': () => {
      const _0x1dea93 = getSelectedEpisode(_0x46a1ea);
      return {
        'episode': _0x1dea93,
        'clip': getSelectedClip(_0x46a1ea, _0x1dea93)
      };
    },
    'projectTasks': {
      'createToken': () => _0x3e5ebf(_0x46a1ea),
      'isLive': _0x4d0c22,
      'isCurrent': _0x30dd2e,
      'syncEntry': _0x3dc37b
    },
    'applyClipVideoSettings': _0x180373,
    'schedulePersistence': _0x18eeff,
    'render': _0x325d8d,
    'refreshPromptRestore': _0x5f2983,
    'refreshReferenceSummary': _0x10a1d2,
    'refreshTimeline': _0x85636a,
    'notifyTextTaskComplete': _0x165554,
    'showToast': _0x49e2b8,
    'showTaskApiKeyError': _0x1a8749,
    'showTaskResultToast': _0x255bec
  });
  const {
    applySelected: _0x1a0bdc,
    discardSelected: _0x20dc4b,
    generateCandidate: _0xbe8d9f,
    regenerateSelected: _0x50320f,
    resetUi: _0x49275d,
    restorePromptHistory: _0x5a3919
  } = _0x27e4a9;
  function _0x317855(_0x5bc2d5) {
    const _0xe052da = _0x5bc2d5?.["querySelector"]?.("[data-story-clip-prompt]");
    const _0x269aa7 = _0x53df87(_0xe052da);
    if (!_0x269aa7) {
      return null;
    }
    const _0x34d1e8 = bindPromptMentionHost(_0x269aa7);
    syncStoryClipPromptPillPresentation(_0xe052da, _0x46a1ea['data']['assets'], _0x46a1ea['data']["clipFrames"]);
    return _0x34d1e8;
  }
  function _0x1cc9d2(_0x334210) {
    const _0x292182 = _0x334210?.["querySelector"]?.("[data-story-asset-prompt][contenteditable=\"true\"]");
    const _0xa4ed2a = _0x5e5e17(_0x292182);
    if (!_0xa4ed2a) {
      return null;
    }
    return bindPromptMentionHost(_0xa4ed2a, {
      'commitHydratedPrompt': ![]
    });
  }
  function _0x3a9bd7(_0x3e49c1) {
    const _0x485504 = getSelectedEpisode(_0x46a1ea);
    const _0x3e3029 = getSelectedClip(_0x46a1ea, _0x485504);
    return a1579_0x562e67(_0x3e49c1, {
      'projectId': _0x46a1ea["data"]?.["project"]?.['id'],
      'episodeId': _0x485504?.['id'],
      'clipId': _0x3e3029?.['id']
    });
  }
  const _0x2130bf = createStoryClipFrameProductionController({
    'state': _0x46a1ea,
    'viewportEl': _0x1f811e,
    'documentObject': documentObject,
    'windowObject': windowObject,
    'getSelection': () => {
      const _0x3922fa = getSelectedEpisode(_0x46a1ea);
      return {
        'episode': _0x3922fa,
        'clip': getSelectedClip(_0x46a1ea, _0x3922fa)
      };
    },
    'projectTasks': {
      'createToken': () => _0x3e5ebf(_0x46a1ea),
      'isLive': _0x4d0c22,
      'isCurrent': _0x30dd2e,
      'syncEntry': _0x3dc37b
    },
    'schedulePersistence': _0x18eeff,
    'syncFrameToCanvas': _0x1fab89,
    'syncFrameRail': _0x1d3480,
    'settleFrameCard': _0x141810,
    'render': _0x325d8d,
    'showToast': _0x49e2b8
  });
  const {
    captureSelected: _0x418bc5,
    trimSelected: _0x53a76e
  } = _0x2130bf;
  function _0x64e712(_0x12d036) {
    const _0x4d45a1 = documentObject["createElement"]("article");
    _0x4d45a1["className"] = "story-page";
    _0x4d45a1["innerHTML"] = _0x12d036;
    const _0x306abb = _0x4d45a1["querySelector"]('[data-story-marquee-page-surface]');
    _0x306abb?.["dataset"]["storyMarqueePageSurface"] && (_0x4d45a1["dataset"]["storyMarqueeSurface"] = _0x306abb["dataset"]["storyMarqueePageSurface"]);
    _0x4d45a1["querySelector"](".story-outline-page") && _0x4d45a1['classList']["add"]("story-page--outline");
    _0x4d45a1["querySelector"](".story-assets-layout")?.['style']["setProperty"]('--story-assets-left', normalizeStoryAssetSplitRatio(_0x46a1ea["assetSplitRatio"]) + '%');
    _0x4d45a1["querySelector"](".story-assets-page")?.["style"]["setProperty"]("--story-assets-left", normalizeStoryAssetSplitRatio(_0x46a1ea["assetSplitRatio"]) + '%');
    const _0x1f9cfa = normalizeStoryEpisodePanelRatios(_0x46a1ea["episodeAssetPanelRatio"], _0x46a1ea["episodeEditorPanelRatio"]);
    const _0x23e5c5 = _0x4d45a1["querySelector"](".story-episode-detail-page");
    _0x23e5c5?.["style"]["setProperty"]('--story-episode-assets-width', _0x1f9cfa['left'] + '%');
    _0x23e5c5?.["style"]['setProperty']("--story-episode-editor-width", _0x1f9cfa["center"] + '%');
    _0x562f18(_0x4d45a1);
    windowObject["requestAnimationFrame"]?.(() => _0x4d45a1["querySelector"]("[data-workspace-episode-rail-item][aria-current=\"page\"]")?.["scrollIntoView"]?.({
      'block': "nearest",
      'inline': "nearest"
    }));
    return _0x4d45a1;
  }
  function _0x562f18(_0x462195) {
    const _0xa5578c = [];
    _0xa5578c["push"](bindStoryReplicationIntake(_0x462195, {
      'state': _0x46a1ea,
      'analyze': _0x476ab9 => _0x41fe0f['analyzeSelected'](_0x476ab9),
      'sync': _0x2a094b,
      'persist': () => _0x18eeff({
        'immediate': !![]
      })
    }));
    _0xa5578c['push'](bindStoryReplicationReplacements(_0x462195, {
      'state': _0x46a1ea,
      'createProjectToken': () => _0x3e5ebf(_0x46a1ea),
      'isProjectTaskLive': _0x4d0c22,
      'syncProjectEntry': _0x3dc37b,
      'schedulePersistence': _0x18eeff
    }));
    _0xa5578c["push"](bindStoryReplicationReview(_0x462195, {
      'state': _0x46a1ea,
      'createProjectToken': () => _0x3e5ebf(_0x46a1ea),
      'isProjectTaskLive': _0x4d0c22,
      'syncProjectEntry': _0x3dc37b,
      'schedulePersistence': _0x18eeff,
      'refreshFooter': () => _0x44d2f9(),
      'reanalyze': _0x21f5c2 => _0x41fe0f["reanalyzeEpisode"](_0x21f5c2),
      'showToast': _0x49e2b8
    }));
    let _0x1cfc32 = ![];
    const _0xee0d67 = () => {
      if (_0x1cfc32) {
        return;
      }
      _0x1cfc32 = !![];
      for (const _0xc0e846 of _0xa5578c["reverse"]()) {
        try {
          _0xc0e846?.["destroy"]?.();
        } catch (_0x396f1c) {
          globalThis["console"]?.['warn']?.("[storyWorkspace] 页面控制器清理失败", _0x396f1c);
        }
      }
      _0xa5578c["length"] = 0x0;
    };
    try {
      const _0x31c4cd = (_0x2049d9, _0x1e49ae) => {
        if (!_0x2049d9) {
          return;
        }
        const _0x20637d = _0x2fad51 => {
          _0x1e49ae(_0x2fad51);
        };
        _0x2049d9['addEventListener']("pointerdown", _0x20637d);
        _0xa5578c["push"]({
          'destroy': () => _0x2049d9["removeEventListener"]('pointerdown', _0x20637d)
        });
      };
      _0x31c4cd(_0x462195["querySelector"]("[data-story-assets-splitter]"), _0x3aca88);
      _0x31c4cd(_0x462195["querySelector"]("[data-story-asset-detail-splitter]"), _0x2dc958);
      _0x462195["querySelectorAll"]("[data-story-episode-splitter]")['forEach'](_0x5331ce => {
        _0x31c4cd(_0x5331ce, _0xd83589);
      });
      const _0x359a97 = _0x1cc9d2(_0x462195);
      _0x359a97 && _0xa5578c["push"](_0x359a97);
      const _0x108a8d = _0x317855(_0x462195);
      if (_0x108a8d) {
        _0xa5578c["push"](_0x108a8d);
      }
      let _0x4993fb = _0x3a9bd7(_0x462195);
      _0xa5578c["push"]({
        'destroy'() {
          _0x4993fb?.["destroy"]?.();
          _0x4993fb = null;
        }
      });
      const _0x5bdc42 = bindStoryOutlineNavigation(_0x462195, {
        'windowObject': windowObject
      });
      if (_0x5bdc42) {
        _0xa5578c["push"](_0x5bdc42);
      }
      let _0x17677b = null;
      const _0x28f492 = () => {
        _0x17677b?.['destroy']?.();
        _0x17677b = null;
        const _0x299c6d = _0x462195['querySelector']('[data-aigen-text-model-selector]');
        if (!_0x299c6d) {
          return;
        }
        const _0x552691 = Boolean(_0x299c6d["classList"]?.["contains"]("story-home-text-model-selector") && _0x46a1ea["view"] === "home" && _0x46a1ea["homeTab"] === "replication");
        const _0x3ff1ab = Boolean(_0x299c6d["classList"]?.["contains"]("story-episode-split-text-model-selector"));
        const _0x1713ef = _0x3ff1ab && _0x46a1ea["splitTextModel"] ? _0x46a1ea["splitTextModel"] : null;
        _0x17677b = bindAIGenTextModelSelector(_0x299c6d, {
          'modelId': _0x1713ef ? _0x1713ef["modelId"] : _0x46a1ea["models"]["text"],
          'provider': _0x1713ef ? _0x1713ef["provider"] : _0x46a1ea["textProvider"],
          'providerProfileId': _0x1713ef ? _0x1713ef["providerProfileId"] : _0x46a1ea['textProviderProfileId'],
          'getDisplayModelName': getDisplayModelName,
          'documentObject': documentObject,
          'menuPortalHost': _0x3ff1ab ? _0x329e8d : null,
          'menuPortalClass': "aigen-text-model-menu-portal",
          'onChange': ({
            modelId: _0x514ff9,
            provider: _0x2618a8,
            providerProfileId: _0x2c55b1
          }) => {
            if (_0x552691 && resolveStoryVideoInputTextModelId(_0x514ff9) !== _0x514ff9) {
              return;
            }
            if (_0x3ff1ab) {
              _0x46a1ea["splitTextModel"] = {
                'modelId': _0x514ff9,
                'provider': _0x2618a8,
                'providerProfileId': _0x2c55b1
              };
              _0x18eeff();
              return;
            }
            _0x46a1ea["models"]["text"] = _0x514ff9;
            _0x46a1ea['textProvider'] = _0x2618a8;
            _0x46a1ea["textProviderProfileId"] = _0x2c55b1;
            _0x18eeff();
          }
        });
      };
      _0x28f492();
      _0xa5578c["push"]({
        'destroy'() {
          _0x17677b?.["destroy"]?.();
          _0x17677b = null;
        }
      });
      const _0x7b1916 = _0x462195['querySelector']("[data-aigen-image-model-selector]");
      if (_0x7b1916) {
        const _0x142e35 = bindAIGenImageModelSelector(_0x7b1916, {
          'modelId': _0x46a1ea["models"]["image"],
          'provider': _0x46a1ea["imageProvider"],
          'generationParams': _0x46a1ea["imageGenerationParams"],
          'generationParamsByModel': _0x46a1ea['imageGenerationParamsByModel'],
          'showSchemaControls': !![],
          'onChange': ({
            modelId: _0x11cc2a,
            provider: _0x23a5aa,
            generationParams: _0x92b68f,
            generationParamsByModel: _0x17c188
          }) => {
            _0x46a1ea["models"]['image'] = _0x11cc2a;
            _0x46a1ea["imageProvider"] = resolveModelProvider(_0x11cc2a, _0x23a5aa);
            _0x46a1ea['imageGenerationParams'] = normalizeStoryImageGenerationParams(_0x11cc2a, _0x92b68f);
            _0x46a1ea["imageGenerationParamsByModel"] = _0x17c188;
            _0x18eeff();
          },
          'documentObject': documentObject,
          'windowObject': windowObject,
          'floatingMenuHost': _0x329e8d,
          'schemaPopupPlacement': "portal-auto-up"
        });
        _0xa5578c["push"](_0x142e35);
      }
      let _0x23fa8d = null;
      let _0x4c19c6 = null;
      const _0x251da2 = _0x462195['querySelector']("[data-aigen-video-model-selector]");
      if (_0x251da2) {
        const _0x3359a6 = getSelectedClip(_0x46a1ea, getSelectedEpisode(_0x46a1ea));
        const _0x3bc58f = resolveStoryClipVideoGenerationParams(_0x3359a6, _0x46a1ea["models"]['video'], _0x46a1ea["videoGenerationParams"]);
        _0x23fa8d = bindAIGenVideoModelSelector(_0x251da2, {
          'modelId': _0x46a1ea["models"]['video'],
          'provider': _0x46a1ea['videoProvider'],
          'generationParams': _0x3bc58f,
          'generationParamsByModel': {
            ..._0x46a1ea["videoGenerationParamsByModel"],
            [_0x46a1ea['models']["video"]]: {
              ..._0x3bc58f
            }
          },
          'providerProfileId': _0x46a1ea["videoProviderProfileId"],
          'providerProfileIdByModel': _0x46a1ea["videoProviderProfileIdByModel"],
          'referenceCounts': storyClipProduction['getInputReferenceCounts'](getSelectedClip(_0x46a1ea, getSelectedEpisode(_0x46a1ea))),
          'showSchemaControls': !![],
          'runningHubWorkflowAllowedModelIds': STORY_WORKSPACE_RUNNINGHUB_WORKFLOW_MODEL_IDS,
          'modelSubmenuPlacement': "viewport-auto",
          'onChange': ({
            modelId: _0x9194ec,
            provider: _0x5cc25e,
            generationParams: _0x1e0ab0,
            generationParamsByModel: _0x5eb94e,
            providerProfileId: _0x54109,
            providerProfileIdByModel: _0x5e69ba,
            patch: _0x5332b9
          }) => {
            const _0x1d90e = _0x46a1ea["models"]["video"];
            const _0x3de2f0 = getSelectedClip(_0x46a1ea, getSelectedEpisode(_0x46a1ea));
            const _0x5ca463 = normalizeStoryVideoGenerationParams(_0x1d90e, _0x46a1ea["videoGenerationParams"]);
            const _0x177f21 = getStoryVideoFixedInputVisibilityKey(_0x1d90e, _0x46a1ea["videoProvider"], _0x5ca463);
            const _0x58bd31 = Boolean(_0x46a1ea['videoGenerationParamsByModel']?.[_0x9194ec]);
            const _0x12c539 = Boolean(_0x5332b9?.['model']) && !_0x58bd31;
            const _0x344bf9 = Boolean(_0x5332b9?.['model']) && _0x9194ec !== _0x1d90e;
            _0x46a1ea['models']['video'] = _0x9194ec;
            if (_0x344bf9) {
              syncStoryPromptModeForVideoModel(_0x46a1ea, _0x9194ec, getSelectedEpisode(_0x46a1ea));
            }
            _0x46a1ea["videoProvider"] = resolveStoryVideoProvider(_0x9194ec, _0x5cc25e);
            _0x46a1ea['videoProviderProfileId'] = _0x54109;
            _0x46a1ea["videoProviderProfileIdByModel"] = _0x5e69ba;
            const _0x50145b = normalizeStoryVideoGenerationParams(_0x9194ec, _0x12c539 ? applyStoryVideoInitialModeDefault(_0x9194ec, _0x1e0ab0) : _0x1e0ab0);
            let _0x9f160b = _0x12c539 ? applyStoryAspectRatioToVideoGenerationParams(_0x9194ec, _0x50145b, _0x46a1ea["data"]["project"]?.['aspectRatio']) : _0x50145b;
            const _0x13ea8f = reconcileStoryClipVideoGenerationDurationChange({
              'clip': _0x3de2f0,
              'previousModelId': _0x1d90e,
              'modelId': _0x9194ec,
              'previousGenerationParams': _0x5ca463,
              'nextGenerationParams': _0x9f160b,
              'generationParamsChanged': Boolean(_0x5332b9?.["generationParams"]),
              'modelChanged': _0x344bf9
            });
            _0x9f160b = _0x13ea8f['generationParams'];
            _0x13ea8f['durationChanged'] && _0x402d05(_0x3de2f0);
            _0x46a1ea["videoGenerationParams"] = _0x9f160b;
            _0x46a1ea["videoGenerationParamsByModel"] = {
              ..._0x5eb94e,
              [_0x1d90e]: {
                ..._0x5ca463
              },
              [_0x9194ec]: {
                ..._0x46a1ea["videoGenerationParams"]
              }
            };
            _0x4f1ece();
            _0x18eeff();
            _0x4c19c6?.['sync']();
            const _0x146067 = _0x177f21 !== getStoryVideoFixedInputVisibilityKey(_0x46a1ea["models"]['video'], _0x46a1ea["videoProvider"], _0x46a1ea['videoGenerationParams']);
            _0x46a1ea['view'] === 'episode' && (_0x5332b9?.["model"] || _0x146067) && _0x325d8d();
          },
          'documentObject': documentObject,
          'windowObject': windowObject,
          'floatingMenuHost': _0x329e8d,
          'schemaPopupPlacement': "portal-auto-up"
        });
        _0xa5578c['push'](_0x23fa8d);
      }
      const _0x1ac022 = _0x462195["querySelector"]("[data-story-video-provider-profile]");
      _0x251da2 && _0x1ac022 && _0x251da2['appendChild'](_0x1ac022);
      _0x1ac022 && (_0x4c19c6 = createModelProviderProfileControl({
        'panel': _0x1ac022,
        'getNodeData': () => ({
          'model': _0x46a1ea['models']['video'],
          'provider': _0x46a1ea["videoProvider"],
          'providerProfileId': _0x46a1ea['videoProviderProfileId'],
          'providerProfileIdByModel': _0x46a1ea["videoProviderProfileIdByModel"]
        }),
        'onChange': _0x2ce285 => {
          if (_0x23fa8d?.["applyProviderProfilePatch"]?.(_0x2ce285)) {
            return;
          }
          _0x46a1ea["videoProviderProfileId"] = _0x2ce285["providerProfileId"];
          _0x46a1ea['videoProviderProfileIdByModel'] = _0x2ce285["providerProfileIdByModel"];
          _0x18eeff();
          _0x4c19c6?.["sync"]();
        }
      }), _0xa5578c["push"]({
        'destroy': () => _0x4c19c6?.['remove']()
      }));
      const _0x429c13 = _0x462195["querySelector"]('[data-story-character-voice-panel]');
      if (_0x429c13 && _0x46a1ea['characterVoiceEditor']) {
        const _0x1801cc = _0x429c13["querySelector"]("[data-story-character-voice-model-footer]");
        const _0x3d9c5d = "story-character-voice-draft-" + _0x46a1ea["characterVoiceEditor"]["assetId"];
        const _0x3475b4 = {
          'getState': () => ({
            'nodes': {
              [_0x3d9c5d]: _0x46a1ea["characterVoiceEditor"]?.['nodeData'] || {}
            }
          }),
          'updateNodeData': (_0x2e1556, _0x2e69ea = {}) => {
            if (!_0x46a1ea["characterVoiceEditor"]) {
              return;
            }
            _0x46a1ea['characterVoiceEditor']['nodeData'] = {
              ...(_0x46a1ea['characterVoiceEditor']['nodeData'] || {}),
              ..._0x2e69ea
            };
          }
        };
        if (_0x1801cc) {
          const _0x39f05a = _0x1801cc['querySelector']('.img-model-btn-trigger');
          const _0x254fbb = _0x1801cc["querySelector"]('.node-model-menu');
          const _0x2d6913 = createFloatingModelMenuPortal({
            'menu': _0x254fbb,
            'trigger': _0x39f05a,
            'host': _0x329e8d,
            'documentObject': documentObject,
            'windowObject': windowObject,
            'portalClass': "aigen-audio-model-menu-portal",
            'submenuPlacement': "viewport-auto-up"
          });
          _0xa5578c["push"]({
            'destroy': bindAudioWorkflowSchemaSlotControls({
              'footer': _0x1801cc,
              'nodeId': _0x3d9c5d,
              'nodeData': _0x46a1ea["characterVoiceEditor"]["nodeData"],
              'store': _0x3475b4
            })
          });
          _0xa5578c["push"]({
            'destroy': bindNodeFooterController(_0x1801cc, {
              'onOutsideClose': () => _0x2d6913["close"]()
            })
          });
          const _0xccd687 = _0x4c7ae4 => {
            _0x4c7ae4["stopPropagation"]();
            const _0x329bce = !_0x2d6913['isOpen']();
            closeNodeFooterMenus(_0x1801cc);
            if (_0x329bce) {
              _0x2d6913['open']();
            } else {
              _0x2d6913['close']();
            }
          };
          const _0x18a25f = _0x3f645a => _0x3f645a["stopPropagation"]();
          const _0x300910 = () => _0x2d6913["close"]();
          _0x39f05a?.["addEventListener"]("click", _0xccd687);
          _0x254fbb?.["addEventListener"]("click", _0x18a25f);
          _0x1801cc['addEventListener']("ui-schema-menu-before-open", _0x300910);
          _0xa5578c['push']({
            'destroy': () => {
              _0x39f05a?.["removeEventListener"]("click", _0xccd687);
              _0x254fbb?.["removeEventListener"]('click', _0x18a25f);
              _0x1801cc["removeEventListener"]("ui-schema-menu-before-open", _0x300910);
              _0x2d6913['destroy']();
            }
          });
          const _0x5f193b = _0x4b4c51 => {
            const _0x28ca7b = _0x4b4c51["target"]["closest"](".node-menu-item[data-value]");
            if (!_0x28ca7b || !_0x254fbb?.["contains"](_0x28ca7b) || _0x28ca7b["dataset"]["disabled"] === "true") {
              return;
            }
            _0x4b4c51["stopPropagation"]();
            _0x46a1ea['characterVoiceEditor'] = selectStoryCharacterVoiceWorkflow(_0x46a1ea['characterVoiceEditor'], _0x28ca7b['dataset']['value']);
            _0x325d8d();
          };
          _0x254fbb?.["addEventListener"]('click', _0x5f193b);
          _0xa5578c["push"]({
            'destroy': () => _0x254fbb?.["removeEventListener"]("click", _0x5f193b)
          });
          const _0x62721c = _0x1801cc["querySelector"](".rh-adv-btn");
          const _0x152355 = _0x1801cc["querySelector"](".rh-adv-panel");
          const _0x6e3eb8 = _0x53e7f4 => {
            _0x53e7f4['stopPropagation']();
            const _0x29d1c2 = !_0x152355?.['classList']["contains"]('show');
            _0x2d6913["close"]();
            closeNodeFooterMenus(_0x1801cc, _0x29d1c2 ? _0x152355 : null);
            _0x152355?.["classList"]["toggle"]("show", _0x29d1c2);
            _0x62721c?.['classList']['toggle']("active", _0x29d1c2);
            _0x62721c?.["setAttribute"]("aria-expanded", String(_0x29d1c2));
          };
          _0x62721c?.['addEventListener']("click", _0x6e3eb8);
          _0xa5578c['push']({
            'destroy': () => _0x62721c?.["removeEventListener"]("click", _0x6e3eb8)
          });
        }
        const _0x3ae5c8 = _0x429c13["querySelector"]("[data-audio-playback-surface]");
        const _0x559782 = createAudioPlaybackSurfaceController(_0x3ae5c8, {
          'onBeforePlay': _0x22f2d9,
          'onError': () => _0x49e2b8('声音参考播放失败。', "warn")
        });
        if (_0x559782) {
          _0xa5578c["push"](_0x559782);
        }
      }
      _0x58ddbc["set"](_0x462195, {
        'destroy': _0xee0d67,
        'refreshTextModelSelector': _0x28f492,
        'refreshVideoPreview'() {
          _0x4993fb?.['destroy']?.();
          _0x4993fb = _0x3a9bd7(_0x462195);
        }
      });
      return _0x462195;
    } catch (_0x1cb106) {
      _0xee0d67();
      throw _0x1cb106;
    }
  }
  function _0x397b4a(_0xed683a) {
    _0x58ddbc["get"](_0xed683a)?.["destroy"]?.();
    _0x58ddbc['delete'](_0xed683a);
    _0xed683a?.['remove']?.();
  }
  function _0x14b1b7() {
    _0x280f63["cancel"]();
  }
  function _0x2fd8d9(_0x2c119d, _0x1e175a = 'none', _0x170b7d = null, {
    transitionScope = 'page'
  } = {}) {
    _0x5ee54e();
    _0x14b1b7();
    const _0x5939f7 = _0x1f811e["querySelector"]('.story-page.is-current');
    const _0x4b3c52 = _0x64e712(_0x2c119d);
    if (!_0x5939f7 || _0x1e175a === 'none') {
      _0x1f811e["querySelectorAll"](":scope > .story-page")['forEach'](_0x504c0c => {
        if (_0x504c0c !== _0x4b3c52) {
          _0x397b4a(_0x504c0c);
        }
      });
      _0x1f811e["replaceChildren"](_0x4b3c52);
      _0x4b3c52["classList"]['add']('is-current');
      _0x170b7d?.();
      return {
        'page': _0x4b3c52,
        'committed': Promise["resolve"](!![]),
        'committedImmediately': !![]
      };
    }
    const _0x3c2f6a = _0x5939f7['querySelector']("[data-story-assets-switch-region]");
    const _0x2690b4 = _0x4b3c52["querySelector"]("[data-story-assets-switch-region]");
    const _0x3989aa = transitionScope === "asset-content" && _0x3c2f6a && _0x2690b4;
    const _0x54a13b = _0x280f63['start']({
      'current': _0x5939f7,
      'next': _0x4b3c52,
      'parent': _0x1f811e,
      'direction': _0x1e175a,
      'transitionElement': _0x3989aa ? _0x2690b4 : _0x4b3c52,
      'classNames': {
        'current': "is-current",
        'scopeCurrent': _0x3989aa ? 'story-page--asset-content-transition' : '',
        'scopeNext': _0x3989aa ? 'story-page--asset-content-transition' : '',
        'scopeTarget': _0x3989aa ? "story-page--asset-content-transition-target" : ''
      },
      'mount': () => _0x1f811e["appendChild"](_0x4b3c52),
      'onTransitionComplete': _0x170b7d
    });
    return {
      'page': _0x4b3c52,
      'committed': _0x54a13b?.['committed'] || Promise["resolve"](![]),
      'committedImmediately': ![]
    };
  }
  function _0x1a3fa3() {
    if (_0x46a1ea["view"] === "home") {
      return "home";
    }
    const _0xd2ebf5 = normalizeText(_0x46a1ea['data']?.["project"]?.['id']) || "draft";
    if (_0x46a1ea['view'] === 'episode') {
      return "project:" + _0xd2ebf5 + ":episode:" + (normalizeText(_0x46a1ea["selectedEpisodeId"]) || "selected");
    }
    if (_0x46a1ea["step"] === 0x1 && _0x46a1ea["data"]?.["project"]?.["sourceMode"] !== "video-replication" && isStoryAssetExtractionOperation(_0x46a1ea['storyPlanningOperation'])) {
      return 'project:' + _0xd2ebf5 + ":asset-breakdown";
    }
    return "project:" + _0xd2ebf5 + ":step:" + normalizeStoryWorkspaceStep(_0x46a1ea["step"]);
  }
  function _0x2b902c() {
    const _0x3efc28 = _0x1f811e["querySelector"](".story-page.is-current");
    if (!_0x3efc28) {
      return;
    }
    const _0x4441cd = {
      ...(_0x46a1ea['outlineSectionOpenState'] || {})
    };
    _0x3efc28["querySelectorAll"]("details[data-story-outline-section]")["forEach"](_0xefcb31 => {
      _0x4441cd[_0xefcb31["dataset"]['storyOutlineSection']] = _0xefcb31['open'];
    });
    _0x46a1ea["outlineSectionOpenState"] = _0x4441cd;
    const _0x213049 = _0x145d9d || _0x1a3fa3();
    _0x46a1ea["pageScrollPositions"] = {
      ...(_0x46a1ea["pageScrollPositions"] || {}),
      [_0x213049]: {
        'top': Math["max"](0x0, Number(_0x3efc28["scrollTop"]) || 0x0),
        'left': Math["max"](0x0, Number(_0x3efc28['scrollLeft']) || 0x0)
      }
    };
  }
  function _0x4fda69() {
    const _0x349361 = _0x46a1ea["view"] === "project" && _0x46a1ea["step"] === 0x2 && _0x46a1ea["storyPlanningOperation"] === "planning-episodes";
    _0x2437fb["classList"]["toggle"]("is-planning", _0x349361);
    _0x2437fb["setAttribute"]("aria-busy", String(_0x349361));
    _0x5e4bff['hidden'] = !_0x349361;
    _0x349361 && (_0x24eba6["textContent"] = _0x46a1ea["storyPlanningStatus"] || "正在生成分镜视频");
  }
  function _0x5677de() {
    if (_0x46a1ea['view'] !== "project" || _0x46a1ea["step"] !== 0x1) {
      return ![];
    }
    if (_0x46a1ea["data"]?.["project"]?.["sourceMode"] === "video-replication") {
      return _0x44d2f9();
    }
    const _0x1829d3 = _0x1f811e['querySelector'](".story-page.is-current .story-page-footer");
    if (!_0x1829d3) {
      return ![];
    }
    const _0x5ee488 = documentObject["createElement"]("template");
    _0x5ee488["innerHTML"] = renderStoryAssetExtractionFooter(_0x46a1ea)["trim"]();
    const _0xf31d81 = _0x5ee488["content"]['firstElementChild'];
    if (!_0xf31d81) {
      return ![];
    }
    _0x1829d3['replaceWith'](_0xf31d81);
    return !![];
  }
  function _0x325d8d({
    direction = "none",
    updateToolbar = !![],
    capturePageState = !![],
    onTransitionComplete = null,
    transitionScope = "page"
  } = {}) {
    _0x3e6e62?.["sync"]();
    if (!_0x2988c5) {
      _0x3e8f6e["invalidate"]();
      return Promise["resolve"](![]);
    }
    _0x2f87a6();
    const _0x5d4f6f = _0x1f811e["querySelector"](".story-page.is-current");
    const _0x54268f = _0x145d9d || _0x1a3fa3();
    const _0x2323f5 = _0x1a3fa3();
    const _0x4f63ff = direction === "none" && _0x54268f === _0x2323f5 ? captureStoryWorkspaceNestedScrollPositions(_0x5d4f6f) : null;
    if (capturePageState) {
      _0x2b902c();
    }
    const _0x13fb8e = _0x46a1ea['pageScrollPositions']?.[_0x2323f5] || {};
    if (updateToolbar) {
      _0x3450fa();
    }
    const _0x1c4e5f = _0x2fd8d9(_0x46a1ea["view"] === "home" ? renderStoryHome(_0x46a1ea) : renderProjectPage(_0x46a1ea), direction, onTransitionComplete, {
      'transitionScope': transitionScope
    });
    const _0x3572f7 = _0x1c4e5f["page"];
    _0x3572f7 && (_0x3572f7['scrollTop'] = Math["max"](0x0, Number(_0x13fb8e["top"]) || 0x0), _0x3572f7["scrollLeft"] = Math['max'](0x0, Number(_0x13fb8e["left"]) || 0x0), restoreStoryWorkspaceNestedScrollPositions(_0x3572f7, _0x4f63ff));
    _0x1c4e5f["committedImmediately"] ? _0x145d9d = _0x2323f5 : void _0x1c4e5f['committed']["then"](_0x5b77bd => {
      _0x5b77bd && _0x3572f7["isConnected"] && _0x3572f7['classList']["contains"]('is-current') && (_0x145d9d = _0x2323f5);
    }, () => {});
    _0x4fda69();
    _0xd116a9();
    return _0x1c4e5f["committed"]["then"](_0x17356c => {
      if (_0x17356c) {
        _0x3e6e62?.['sync']();
      }
      return _0x17356c;
    });
  }
  function _0x136276() {
    if (_0x46a1ea['view'] !== "project" || _0x46a1ea["step"] !== 0x2) {
      return null;
    }
    return _0x1f811e['querySelector'](".story-page.is-current");
  }
  function _0x1d3480({
    refreshContent = ![]
  } = {}) {
    if (_0x46a1ea['view'] !== "episode") {
      return ![];
    }
    const _0x562c81 = _0x1f811e['querySelector'](".story-page.is-current");
    const _0xb1ad0f = _0x562c81?.["querySelector"]("[data-story-episode-asset-rail]");
    if (!_0x562c81 || !_0xb1ad0f) {
      return ![];
    }
    if (refreshContent) {
      const _0x3c598b = documentObject['createElement']("div");
      _0x3c598b["innerHTML"] = renderEpisodeAssetRail(_0x46a1ea);
      const _0x26dde8 = _0x3c598b["firstElementChild"];
      ["assets", "frames", 'library']['forEach'](_0x5cfff8 => {
        const _0x1503b4 = _0xb1ad0f["querySelector"]("[data-story-episode-asset-panel=\"" + _0x5cfff8 + '\x22]');
        const _0x1b4545 = _0x26dde8?.["querySelector"]("[data-story-episode-asset-panel=\"" + _0x5cfff8 + '\x22]');
        if (_0x1503b4 && _0x1b4545) {
          _0x1503b4['innerHTML'] = _0x1b4545['innerHTML'];
        }
        const _0x1f671a = _0xb1ad0f['querySelector']("[data-story-episode-asset-count=\"" + _0x5cfff8 + '\x22]');
        const _0x13794b = _0x26dde8?.["querySelector"]("[data-story-episode-asset-count=\"" + _0x5cfff8 + '\x22]');
        if (_0x1f671a && _0x13794b) {
          _0x1f671a["textContent"] = _0x13794b['textContent'];
        }
      });
    }
    const _0x196641 = normalizeStoryEpisodeAssetRailTab(_0x46a1ea["episodeAssetRailTab"]);
    _0xb1ad0f["dataset"]["activeTab"] = _0x196641;
    _0xb1ad0f["querySelectorAll"]("[data-story-episode-asset-tab]")["forEach"](_0x5efca6 => {
      const _0x36fba7 = _0x5efca6["dataset"]["storyEpisodeAssetTab"] === _0x196641;
      _0x5efca6["classList"]['toggle']("is-active", _0x36fba7);
      _0x5efca6['setAttribute']("aria-selected", String(_0x36fba7));
      _0x5efca6["tabIndex"] = _0x36fba7 ? 0x0 : -0x1;
    });
    _0xb1ad0f["querySelectorAll"]("[data-story-episode-asset-panel]")["forEach"](_0x18a6c7 => {
      const _0x24adc0 = _0x18a6c7["dataset"]["storyEpisodeAssetPanel"] === _0x196641;
      _0x18a6c7["classList"]["toggle"]("is-active", _0x24adc0);
      _0x18a6c7["setAttribute"]("aria-hidden", String(!_0x24adc0));
      _0x18a6c7["inert"] = !_0x24adc0;
    });
    const _0x1fc215 = _0xb1ad0f['querySelector']("[data-story-episode-asset-help]");
    _0x1fc215 && (_0x1fc215["textContent"] = getStoryEpisodeAssetRailHelp(_0x196641));
    return !![];
  }
  function _0x141810(_0x49405f, {
    errorMessage = ''
  } = {}) {
    if (_0x46a1ea["view"] !== "episode") {
      return ![];
    }
    const _0x4eb1c1 = normalizeText(_0x49405f);
    const _0x13de24 = [..._0x1f811e["querySelectorAll"]("[data-story-reference-frame]")]["find"](_0x147014 => _0x147014["dataset"]["storyReferenceFrame"] === _0x4eb1c1);
    if (!_0x13de24) {
      return ![];
    }
    _0x13de24["setAttribute"]("aria-busy", "false");
    const _0x3e844c = _0x13de24['closest'](".story-episode-frame-card")?.["querySelector"]('[data-story-action=\x22delete-clip-frame\x22]');
    if (_0x3e844c) {
      _0x3e844c["disabled"] = ![];
    }
    syncStoryClipFrameCardSaveError(_0x13de24, errorMessage);
    return !![];
  }
  function _0xac701d(_0x163c36) {
    if (_0x46a1ea["view"] !== "project" || _0x46a1ea["step"] !== 0x3) {
      return ![];
    }
    const _0x22f033 = _0x1f811e["querySelector"](".story-page.is-current");
    const _0x40a0f0 = _0x46a1ea["data"]["episodes"]['find'](_0x508c6f => _0x508c6f['id'] === _0x163c36);
    const _0x50175b = [...(_0x22f033?.["querySelectorAll"](".story-episode-card[data-story-marquee-id]") || [])]["find"](_0x17e429 => _0x17e429["dataset"]["storyMarqueeId"] === _0x163c36);
    if (!_0x22f033 || !_0x40a0f0 || !_0x50175b) {
      return ![];
    }
    const _0x53f787 = documentObject['createElement']("div");
    _0x53f787['innerHTML'] = renderEpisodeCard(_0x46a1ea, _0x40a0f0);
    const _0x43b48b = _0x53f787["firstElementChild"];
    if (!_0x43b48b) {
      return ![];
    }
    _0x50175b["replaceWith"](_0x43b48b);
    return !![];
  }
  function _0x44d78e(_0x36e30c) {
    const _0x270b71 = _0x136276();
    const _0x4bde26 = findStoryAsset(_0x46a1ea, _0x36e30c);
    const _0x47809f = [...(_0x270b71?.['querySelectorAll']("[data-story-asset-id]") || [])]["find"](_0x358960 => _0x358960['dataset']['storyAssetId'] === _0x36e30c);
    if (!_0x270b71 || !_0x4bde26 || !_0x47809f) {
      return ![];
    }
    const _0x72726e = documentObject["createElement"]('div');
    _0x72726e["innerHTML"] = renderStoryAssetCard(_0x46a1ea, _0x4bde26);
    const _0x59d593 = _0x72726e['firstElementChild'];
    if (!_0x59d593) {
      return ![];
    }
    (_0x47809f["closest"](".story-asset-card-shell") || _0x47809f)["replaceWith"](_0x59d593);
    return !![];
  }
  function _0x3c03fa() {
    const _0x5f9c17 = _0x136276();
    const _0x504716 = getVisibleStoryAssets(_0x46a1ea);
    const _0x1a83c8 = getSelectedStoryAsset(_0x46a1ea, _0x504716);
    const _0x2cb85c = _0x5f9c17?.["querySelector"](".story-asset-detail");
    if (!_0x5f9c17 || !_0x1a83c8 || _0x1a83c8["isLibraryAsset"] || !_0x2cb85c) {
      return ![];
    }
    _0x5f9c17["querySelectorAll"]("[data-story-asset-id]")["forEach"](_0x27dd4e => {
      _0x27dd4e['classList']["toggle"]('is-selected', _0x27dd4e["dataset"]["storyAssetId"] === _0x1a83c8['id']);
    });
    const _0x327221 = getStoryAssetAppearances(_0x1a83c8);
    const _0x1dee92 = getSelectedAssetAppearanceIndex(_0x46a1ea, _0x1a83c8);
    const _0x469787 = getSelectedAssetAppearance(_0x46a1ea, _0x1a83c8) || _0x1a83c8;
    const _0x4c669b = _0x327221["length"] > 0x1;
    const _0x317a27 = getStoryAssetGenerationControlState(_0x46a1ea, _0x1a83c8['id'], _0x469787['id']);
    const _0xf39ca9 = _0x317a27['isGenerating'];
    const _0x2fbf9f = _0x2cb85c["querySelector"]('.story-asset-preview-slide');
    const _0x9b931f = _0x2cb85c["querySelector"](".story-asset-preview-wrap");
    _0x9b931f?.["querySelectorAll"]('.story-asset-preview-slide--outgoing')["forEach"](_0x2ac034 => _0x2ac034["remove"]());
    if (_0x2fbf9f && _0x9b931f && _0x46a1ea["assetAppearanceMotion"]) {
      const _0x541d7d = _0x2fbf9f["cloneNode"](!![]);
      _0x541d7d["classList"]["remove"]("img-preview-loading");
      _0x541d7d["classList"]['add']("story-asset-preview-slide--outgoing", 'is-sliding-' + _0x46a1ea["assetAppearanceMotion"]);
      _0x541d7d['removeAttribute']("aria-busy");
      _0x541d7d['setAttribute']('aria-hidden', "true");
      _0x541d7d['querySelector'](".img-loading-overlay")?.['remove']();
      _0x2fbf9f["after"](_0x541d7d);
      const _0x33849e = () => _0x541d7d['remove']();
      _0x541d7d["addEventListener"]("animationend", _0x33849e, {
        'once': !![]
      });
      windowObject["setTimeout"](_0x33849e, 0x1cc);
    }
    _0x2cb85c["classList"]["remove"]('is-sliding-next', "is-sliding-previous");
    _0x46a1ea["assetAppearanceMotion"] && (void _0x2cb85c['offsetWidth'], _0x2cb85c["classList"]["add"]("is-sliding-" + _0x46a1ea["assetAppearanceMotion"]));
    _0x2fbf9f && (_0x2fbf9f['classList']["toggle"]('img-preview-loading', _0xf39ca9), _0x2fbf9f["setAttribute"]("aria-busy", String(_0xf39ca9)), _0x2fbf9f["innerHTML"] = '' + renderImageOrEmpty({
      'imageUrl': _0x469787["imageUrl"],
      'alt': _0x1a83c8['name'] + " · " + (_0x469787["name"] || '形象'),
      'className': "story-asset-preview"
    }) + (_0xf39ca9 ? renderStoryAssetLoadingOverlay() : ''));
    if (_0x9b931f) {
      const _0x2941c7 = documentObject["createElement"]("div");
      _0x2941c7['innerHTML'] = renderStoryAssetPreviewActions({
        'state': _0x46a1ea,
        'asset': _0x1a83c8,
        'appearance': _0x469787,
        'generationControl': _0x317a27
      });
      const _0x44a6e1 = _0x9b931f["querySelector"](".story-asset-preview-actions");
      const _0x18e452 = _0x2941c7['firstElementChild'];
      if (_0x44a6e1 && _0x18e452) {
        _0x44a6e1['replaceWith'](_0x18e452);
      }
      _0x9b931f['dataset']['storyAppearanceWheel'] = String(_0x4c669b);
      _0x4c669b ? (_0x9b931f["tabIndex"] = 0x0, _0x9b931f['setAttribute']("aria-label", "滚动鼠标滚轮或按左右方向键切换形象")) : (_0x9b931f['removeAttribute']("tabindex"), _0x9b931f["removeAttribute"]('aria-label'), _0x9b931f['removeAttribute']('title'));
      _0x9b931f["querySelectorAll"]('.story-appearance-arrow')["forEach"](_0x4c1bef => {
        _0x4c1bef['remove']();
      });
    }
    const _0x1dd574 = _0x2cb85c["querySelector"](".story-asset-preview-caption");
    syncStoryCharacterVoiceCapsuleState(_0x1dd574?.['querySelector']("[data-story-character-voice-capsule]"), _0x1a83c8);
    syncStoryCharacterVoicePlayerState(_0x1dd574, _0x1a83c8);
    _0x4c669b && _0x9b931f && _0x9b931f["insertAdjacentHTML"]('beforeend', '' + renderStoryAppearanceArrow("previous") + renderStoryAppearanceArrow("next"));
    const _0x313f31 = _0x1dd574?.["querySelector"]("strong");
    const _0x3785a7 = _0x1dd574?.["querySelector"]('[data-story-asset-caption-meta]');
    if (_0x313f31) {
      _0x313f31["textContent"] = _0x1a83c8["name"];
    }
    _0x3785a7 && (_0x3785a7["textContent"] = (_0x469787["name"] || _0x1a83c8["role"] || '素材') + '\x20·\x20' + formatStoryAssetOccurrences(_0x469787['occurrences'] || _0x1a83c8["occurrences"] || "当前项目") + (_0x4c669b ? " · " + (_0x1dee92 + 0x1) + '/' + _0x327221["length"] : ''));
    const _0x14879a = _0x1dd574?.["querySelector"](".story-base-appearance-button");
    if (_0x14879a) {
      const _0x57204e = isStoryAssetBaseAppearance(_0x1a83c8, _0x469787);
      const _0x32d550 = Boolean(isStoryAssetCardLoading(_0x46a1ea, _0x1a83c8['id']));
      _0x14879a["classList"]['toggle']("is-active", _0x57204e);
      _0x14879a['classList']['toggle']("is-disabled", _0x32d550);
      _0x14879a["setAttribute"]("aria-pressed", String(_0x57204e));
      _0x14879a['setAttribute']("aria-disabled", String(_0x32d550));
      _0x14879a['textContent'] = _0x57204e ? "基础形象" : "设为基础形象";
    }
    const _0x42286d = _0x2cb85c["querySelector"](".story-asset-prompt-field");
    const _0x17b08d = _0x42286d?.["querySelector"]('[data-story-asset-prompt]');
    const _0xf926ec = canEditStoryAssetStyleReference(_0x1a83c8, _0x469787);
    const _0x24e186 = _0x1dd574?.['querySelector']('.story-asset-caption-tags');
    const _0xf368ec = _0x24e186?.['querySelector'](':scope\x20>\x20.story-asset-style-reference-control');
    if (_0x46a1ea["allowAssetStyleReference"] !== ![] && _0xf926ec && _0x24e186) {
      const _0x4a5345 = documentObject['createElement']("div");
      _0x4a5345['innerHTML'] = renderStoryAssetReferenceInput(_0x469787, {
        'disabled': _0x317a27["disabled"]
      });
      const _0x1b6cc4 = _0x4a5345['firstElementChild'];
      if (_0x1b6cc4 && _0xf368ec) {
        _0xf368ec["replaceWith"](_0x1b6cc4);
      } else {
        _0x1b6cc4 && _0x24e186['insertBefore'](_0x1b6cc4, _0x24e186['querySelector']('[data-story-character-voice-capsule]'));
      }
    } else {
      _0xf368ec?.["remove"]();
    }
    _0x17b08d && (_0x17b08d['dataset']["storyAssetPromptAssetId"] = _0x1a83c8['id'], _0x17b08d["dataset"]["storyAssetPromptAppearanceId"] = _0x469787['id'], _0x17b08d["innerHTML"] = renderStoryAssetPromptMentions(_0x469787["prompt"] || '', _0x469787));
    const _0x4b05fe = _0x2cb85c["querySelector"]("[data-story-home-param-trigger=\"asset-preset\"]");
    if (_0x4b05fe) {
      _0x4b05fe["disabled"] = _0x317a27["disabled"];
    }
    const _0x193b33 = _0x2cb85c["querySelector"]("[data-story-action=\"generate-asset\"]");
    if (_0x193b33) {
      _0x193b33["disabled"] = _0x317a27["disabled"];
      syncStoryAsyncButton(_0x193b33, _0x317a27['isGenerating']);
      const _0x44d93f = _0x193b33['querySelector']("[data-story-asset-generate-label]");
      if (_0x44d93f) {
        _0x44d93f["textContent"] = _0x317a27["label"];
      }
    }
    return !![];
  }
  function _0x348dde(_0x3c3aa1) {
    if (_0x46a1ea["view"] !== "episode") {
      return ![];
    }
    const _0x150177 = _0x1f811e["querySelector"](".story-page.is-current");
    const _0x242d97 = _0x150177?.["querySelector"](".story-clip-editor");
    const _0x863a17 = _0x150177?.["querySelector"](".story-video-preview");
    const _0x29eb1e = _0x150177?.['querySelector'](".story-clip-timeline");
    if (!_0x150177 || !_0x242d97 || !_0x863a17 || !_0x29eb1e) {
      return ![];
    }
    const _0x49da21 = documentObject["createElement"]("div");
    _0x49da21["innerHTML"] = renderEpisodeDetail(_0x46a1ea);
    const _0x4e9fe1 = _0x49da21['firstElementChild'];
    const _0xbb144a = _0x4e9fe1?.['querySelector'](".story-clip-editor");
    const _0x38b0c0 = _0x4e9fe1?.['querySelector'](".story-video-preview");
    const _0x2e921f = _0x38b0c0?.['querySelector']("[data-story-clip-preview-slide]");
    if (!_0xbb144a || !_0x38b0c0 || !_0x2e921f) {
      return ![];
    }
    const _0x55ef3a = _0x3c3aa1 === "previous" ? "previous" : 'next';
    const _0x5ed96c = _0x863a17["querySelector"]("[data-story-clip-preview-slide]:not(.story-clip-preview-slide--outgoing)");
    _0x58ddbc["get"](_0x150177)?.['destroy']?.();
    _0x58ddbc["delete"](_0x150177);
    _0x242d97["replaceWith"](_0xbb144a);
    _0x38b0c0["classList"]['add']("is-sliding-" + _0x55ef3a);
    _0x5ed96c && (_0x5ed96c["classList"]["add"]("story-clip-preview-slide--outgoing", "is-sliding-" + _0x55ef3a), _0x5ed96c['setAttribute']("aria-hidden", "true"), _0x38b0c0["appendChild"](_0x5ed96c));
    _0x863a17["replaceWith"](_0x38b0c0);
    _0x29eb1e["querySelectorAll"]('[data-story-clip-id]')['forEach'](_0x11bb5b => {
      const _0x2e30ce = _0x11bb5b["dataset"]['storyClipId'] === _0x46a1ea["selectedClipId"];
      _0x11bb5b['classList']["toggle"]("is-selected", _0x2e30ce);
      _0x11bb5b["setAttribute"]('aria-current', _0x2e30ce ? "true" : "false");
    });
    _0x562f18(_0x150177);
    const _0x4547be = () => {
      _0x5ed96c?.["querySelector"]("video")?.["pause"]?.();
      _0x5ed96c?.['remove']();
      _0x38b0c0["classList"]["remove"]("is-sliding-next", "is-sliding-previous");
    };
    _0x5ed96c?.["addEventListener"]('animationend', _0x4547be, {
      'once': !![]
    });
    windowObject["setTimeout"](_0x4547be, 0x1cc);
    windowObject["requestAnimationFrame"](() => {
      _0x29eb1e["querySelector"]("[data-story-clip-id].is-selected")?.['scrollIntoView']?.({
        'block': 'nearest',
        'inline': "nearest"
      });
    });
    return !![];
  }
  function _0xda21ad(_0x23482b) {
    if (_0x46a1ea["view"] !== "episode") {
      return ![];
    }
    const _0x3f58c8 = _0x1f811e["querySelector"](".story-page.is-current");
    const _0x9742d4 = _0x3f58c8?.["querySelector"](".story-video-preview");
    const _0x3d02bb = _0x9742d4?.["querySelector"]("[data-story-clip-preview-slide]:not(.story-clip-preview-slide--outgoing)");
    if (!_0x3f58c8 || !_0x9742d4 || !_0x3d02bb) {
      return ![];
    }
    const _0x145da9 = documentObject["createElement"]("div");
    _0x145da9["innerHTML"] = renderEpisodeDetail(_0x46a1ea);
    const _0x2cc50c = _0x145da9["firstElementChild"];
    const _0x4541fd = _0x2cc50c?.['querySelector'](".story-video-preview");
    const _0x190b03 = _0x4541fd?.["querySelector"]("[data-story-clip-preview-slide]");
    if (!_0x4541fd || !_0x190b03) {
      return ![];
    }
    const _0x4778c9 = _0x23482b === "previous" ? 'previous' : "next";
    _0x58ddbc["get"](_0x3f58c8)?.["destroy"]?.();
    _0x58ddbc["delete"](_0x3f58c8);
    _0x4541fd['classList']['add']('is-result-sliding-' + _0x4778c9);
    _0x3d02bb["classList"]["add"]("story-clip-preview-slide--outgoing", "is-result-sliding-" + _0x4778c9);
    _0x3d02bb["setAttribute"]('aria-hidden', 'true');
    _0x4541fd["appendChild"](_0x3d02bb);
    _0x9742d4["replaceWith"](_0x4541fd);
    const _0x52c1f2 = [..._0x3f58c8["querySelectorAll"](".story-clip-card-shell[data-story-clip-id]")]["find"](_0x4f3fa6 => _0x4f3fa6["dataset"]['storyClipId'] === _0x46a1ea["selectedClipId"]);
    const _0x2ae88d = [...(_0x2cc50c?.["querySelectorAll"](".story-clip-card-shell[data-story-clip-id]") || [])]["find"](_0x5ea38b => _0x5ea38b["dataset"]['storyClipId'] === _0x46a1ea["selectedClipId"]);
    if (_0x52c1f2 && _0x2ae88d) {
      _0x52c1f2["replaceWith"](_0x2ae88d);
    }
    _0x562f18(_0x3f58c8);
    const _0xeb7d5d = () => {
      _0x3d02bb["querySelector"]("video")?.["pause"]?.();
      _0x3d02bb["remove"]();
      _0x4541fd["classList"]['remove']('is-result-sliding-next', "is-result-sliding-previous");
    };
    _0x3d02bb['addEventListener']("animationend", _0xeb7d5d, {
      'once': !![]
    });
    windowObject["setTimeout"](_0xeb7d5d, 0x1cc);
    return !![];
  }
  function _0x85636a() {
    if (_0x46a1ea["view"] !== 'episode') {
      return ![];
    }
    const _0x140aee = _0x1f811e["querySelector"](".story-page.is-current");
    const _0x104926 = _0x140aee?.["querySelector"](".story-clip-timeline");
    if (!_0x140aee || !_0x104926) {
      return ![];
    }
    const _0x2b1137 = _0x104926["querySelector"](".story-clip-strip");
    const _0x11a11d = documentObject["createElement"]("div");
    _0x11a11d['innerHTML'] = renderEpisodeDetail(_0x46a1ea);
    const _0x477370 = _0x11a11d['firstElementChild']?.["querySelector"](".story-clip-timeline");
    if (!_0x477370) {
      return ![];
    }
    const _0x2fdfdb = Math["max"](0x0, Number(_0x2b1137?.['scrollLeft']) || 0x0);
    _0x104926["replaceWith"](_0x477370);
    const _0x545483 = _0x477370['querySelector'](".story-clip-strip");
    if (_0x545483) {
      _0x545483['scrollLeft'] = _0x2fdfdb;
    }
    return !![];
  }
  function _0x10a1d2() {
    if (_0x46a1ea['view'] !== "episode") {
      return ![];
    }
    const _0x318b0d = _0x1f811e['querySelector'](".story-page.is-current [data-story-clip-reference-summary]");
    const _0x47f1a5 = getSelectedEpisode(_0x46a1ea);
    const _0x2b00ca = getSelectedClip(_0x46a1ea, _0x47f1a5);
    if (!_0x318b0d || !_0x47f1a5 || !_0x2b00ca) {
      return ![];
    }
    const _0xc4b2c1 = storyClipProduction['renderEpisode'](_0x46a1ea, _0x47f1a5, _0x2b00ca);
    const _0x2c4486 = _0xc4b2c1["referenceCounts"];
    ['image', 'audio', "video"]['forEach'](_0x5f0a7e => {
      const _0x39df41 = _0x318b0d["querySelector"]("[data-story-reference-count=\"" + _0x5f0a7e + '\x22]');
      if (_0x39df41) {
        _0x39df41["textContent"] = String(_0x2c4486[_0x5f0a7e + "Count"]);
      }
    });
    _0x318b0d["setAttribute"]("aria-label", "参考素材，图片 " + _0x2c4486['imageCount'] + '，音频\x20' + _0x2c4486["audioCount"] + '，视频\x20' + _0x2c4486["videoCount"]);
    const _0x5223ae = _0x1f811e["querySelector"](".story-page.is-current [data-story-clip-prompt-surface] .story-clip-prompt-toolbar > .node-ref-bar");
    if (_0x5223ae) {
      const _0x5ad7d9 = documentObject["createElement"]('div');
      _0x5ad7d9["innerHTML"] = _0xc4b2c1["referenceBar"];
      const _0x218cc7 = _0x5ad7d9["firstElementChild"];
      const _0x5269b3 = _0x5223ae['querySelector'](".ref-thumb-container--readonly");
      const _0x10f5b0 = _0x218cc7?.["querySelector"]('.ref-thumb-container--readonly');
      const _0x1439c0 = _0x65cfea => Array["from"](_0x65cfea?.['querySelectorAll']?.("[data-ref-readonly-key]") || [])['map'](_0x274a59 => _0x274a59["dataset"]["refReadonlyKey"] || '')["join"]('|');
      if (_0x1439c0(_0x5269b3) !== _0x1439c0(_0x10f5b0)) {
        if (_0x5269b3 && _0x10f5b0) {
          _0x5269b3["replaceWith"](_0x10f5b0);
        } else {
          if (_0x5269b3) {
            _0x5269b3["remove"]();
          } else {
            if (_0x10f5b0) {
              _0x5223ae["appendChild"](_0x10f5b0);
            }
          }
        }
        if (_0x218cc7) {
          _0x5223ae['className'] = _0x218cc7['className'];
        }
      }
    }
    return !![];
  }
  function _0x5f2983() {
    if (_0x46a1ea['view'] !== "episode") {
      return ![];
    }
    const _0x2353d3 = _0x1f811e['querySelector'](".story-page.is-current");
    const _0x5cd04d = _0x2353d3?.["querySelector"]('[data-story-clip-prompt]');
    const _0x5bc4c2 = _0x2353d3?.["querySelector"](".story-clip-adjustment-control");
    const _0x5986c7 = getSelectedEpisode(_0x46a1ea);
    const _0x134490 = getSelectedClip(_0x46a1ea, _0x5986c7);
    if (!_0x2353d3 || !_0x5cd04d || !_0x5bc4c2 || !_0x5986c7 || !_0x134490) {
      return ![];
    }
    _0x5cd04d['innerHTML'] = renderStoryClipPromptMentions(_0x134490["prompt"] || '', {
      'assets': _0x46a1ea["data"]["assets"],
      'episode': _0x5986c7,
      'clipFrames': _0x46a1ea["data"]["clipFrames"]
    });
    syncStoryClipPromptPillPresentation(_0x5cd04d, _0x46a1ea["data"]["assets"], _0x46a1ea["data"]["clipFrames"]);
    _0x5cd04d["querySelectorAll"](".ref-pill")["forEach"](_0x63d64a => {
      _0x697799(_0x63d64a, _0x5cd04d, _0x134490);
    });
    const _0x11b10c = documentObject["createElement"]('div');
    _0x11b10c["innerHTML"] = storyClipProduction["renderEpisode"](_0x46a1ea, _0x5986c7, _0x134490)["adjustmentControl"];
    const _0x335f5f = _0x11b10c["firstElementChild"];
    if (!_0x335f5f) {
      return ![];
    }
    _0x5bc4c2["replaceWith"](_0x335f5f);
    return !![];
  }
  function _0x3b0a58() {
    if (_0x46a1ea["view"] !== "episode") {
      return ![];
    }
    const _0x16f2db = _0x1f811e['querySelector'](".story-page.is-current");
    const _0x22f8d7 = _0x16f2db?.['querySelector'](".story-clip-adjustment-control");
    const _0x2cf772 = _0x22f8d7?.['querySelector']("[data-story-action=\"toggle-clip-adjustment\"]");
    const _0x41913f = getSelectedEpisode(_0x46a1ea);
    const _0x8ea0e8 = getSelectedClip(_0x46a1ea, _0x41913f);
    if (!_0x16f2db || !_0x22f8d7 || !_0x2cf772 || !_0x41913f || !_0x8ea0e8) {
      return ![];
    }
    const _0x1906df = _0x22f8d7["querySelector"]("[data-story-clip-adjustment-bar]");
    const _0x338d7e = storyClipProduction["renderEpisode"](_0x46a1ea, _0x41913f, _0x8ea0e8)["adjustmentBar"];
    _0x2cf772['setAttribute']("aria-expanded", String(_0x46a1ea['clipAdjustmentOpen'] === !![]));
    if (!_0x338d7e) {
      _0x1906df?.["remove"]();
      return !![];
    }
    const _0x53a3ee = documentObject["createElement"]("div");
    _0x53a3ee["innerHTML"] = _0x338d7e;
    const _0x1a6675 = _0x53a3ee["firstElementChild"];
    if (!_0x1a6675) {
      return ![];
    }
    if (_0x1906df) {
      _0x1906df['replaceWith'](_0x1a6675);
    } else {
      _0x22f8d7["appendChild"](_0x1a6675);
    }
    return !![];
  }
  function _0x562e1e({
    focus = ''
  } = {}) {
    const _0x166626 = _0x1f811e['querySelector'](".story-page.is-current [data-story-clip-prompt-history]");
    const _0xd1f6a2 = _0x166626?.["querySelector"]('[data-story-action=\x22toggle-clip-prompt-history\x22]');
    const _0x143005 = _0x166626?.["querySelector"]("[data-story-clip-prompt-history-panel]");
    if (!_0x166626 || !_0xd1f6a2 || !_0x143005) {
      return ![];
    }
    const _0x466c60 = _0x46a1ea['clipPromptHistoryOpen'] === !![];
    _0xd1f6a2["setAttribute"]("aria-expanded", String(_0x466c60));
    _0x143005["hidden"] = !_0x466c60;
    if (focus === 'trigger') {
      _0xd1f6a2['focus']();
    }
    focus === 'first' && _0x143005["querySelector"]("[data-story-action=\"restore-clip-prompt-history\"]")?.["focus"]();
    return !![];
  }
  function _0x18e104(_0x1f1a73 = {}) {
    const _0x50b703 = getSelectedEpisode(_0x46a1ea);
    return syncStoryClipAdjustmentMenu({
      'state': _0x46a1ea,
      'root': _0x1f811e,
      'episode': _0x50b703,
      'clip': getSelectedClip(_0x46a1ea, _0x50b703),
      ..._0x1f1a73
    });
  }
  function _0x2bc6c6() {
    if (_0x46a1ea["view"] !== "episode") {
      return ![];
    }
    const _0x46270b = _0x1f811e["querySelector"](".story-page.is-current");
    const _0x149d86 = _0x46270b?.["querySelector"](".story-clip-selection-controls");
    const _0x4fbecc = _0x46270b?.["querySelector"]("[data-story-clip-preview-slide]");
    const _0x55bd3d = _0x46270b?.["querySelector"](".story-clip-timeline");
    if (!_0x46270b || !_0x149d86 || !_0x4fbecc || !_0x55bd3d) {
      return ![];
    }
    const _0x451357 = documentObject["createElement"]("div");
    _0x451357["innerHTML"] = renderEpisodeDetail(_0x46a1ea);
    const _0x597b2e = _0x451357["firstElementChild"];
    const _0x54f06d = _0x597b2e?.['querySelector'](".story-clip-selection-controls");
    const _0x478cc6 = _0x597b2e?.["querySelector"]("[data-story-clip-preview-slide]");
    const _0x3999a0 = _0x597b2e?.["querySelector"](".story-clip-timeline");
    const _0xa2b7ab = Array["from"](_0x55bd3d["querySelectorAll"](".story-clip-card-shell[data-story-clip-id]"));
    const _0x2a9940 = Array["from"](_0x3999a0?.["querySelectorAll"]?.(".story-clip-card-shell[data-story-clip-id]") || []);
    if (!_0x54f06d || !_0x478cc6 || !_0x3999a0 || _0xa2b7ab["length"] !== _0x2a9940['length']) {
      return ![];
    }
    const _0x54536a = new Map(_0xa2b7ab["map"](_0x5991d0 => [normalizeText(_0x5991d0["dataset"]['storyClipId']), _0x5991d0]));
    if (_0x2a9940["some"](_0x2ddf33 => !_0x54536a['has'](normalizeText(_0x2ddf33["dataset"]["storyClipId"])))) {
      return ![];
    }
    _0x149d86["outerHTML"] !== _0x54f06d["outerHTML"] && _0x149d86['replaceWith'](_0x54f06d);
    _0x4fbecc["innerHTML"] !== _0x478cc6["innerHTML"] && (_0x4fbecc["innerHTML"] = _0x478cc6['innerHTML'], _0x58ddbc["get"](_0x46270b)?.["refreshVideoPreview"]?.());
    _0x2a9940["forEach"](_0x5af3c2 => {
      const _0x3c59ce = _0x54536a['get'](normalizeText(_0x5af3c2["dataset"]["storyClipId"]));
      _0x3c59ce?.['outerHTML'] !== _0x5af3c2['outerHTML'] && _0x3c59ce['replaceWith'](_0x5af3c2);
    });
    return !![];
  }
  function _0x36221b() {
    if (_0x46a1ea['view'] !== 'episode') {
      return ![];
    }
    const _0x3f3cff = _0x1f811e["querySelector"](".story-page.is-current");
    const _0x4efde7 = _0x3f3cff?.["querySelector"](".story-clip-timeline");
    if (!_0x3f3cff || !_0x4efde7) {
      return ![];
    }
    const _0xb0f53e = _0x3f3cff["querySelector"](".story-clip-selection-controls");
    const _0x408f3b = documentObject["createElement"]("div");
    _0x408f3b["innerHTML"] = storyClipProduction["renderEpisode"](_0x46a1ea, getSelectedEpisode(_0x46a1ea))['selectionControls'];
    const _0x129025 = _0x408f3b['firstElementChild'];
    if (_0xb0f53e && _0x129025) {
      _0xb0f53e["replaceWith"](_0x129025);
    }
    const _0x513a16 = new Set((Array["isArray"](_0x46a1ea["selectedClipGenerationIds"]) ? _0x46a1ea["selectedClipGenerationIds"] : [])['map'](_0x8c6fb2 => normalizeText(_0x8c6fb2))["filter"](Boolean));
    _0x4efde7["classList"]["toggle"]('is-selection-mode', _0x46a1ea["clipSelectionMode"]);
    const _0x1c4851 = _0x4efde7["querySelector"](".story-clip-timeline-header small");
    _0x1c4851 && (_0x1c4851["textContent"] = _0x46a1ea["clipSelectionMode"] ? "点击片段选择需要生成的视频" : "点击片段切换提示词和视频结果");
    _0x4efde7['querySelectorAll']("[data-story-clip-id]")["forEach"](_0x394fc6 => {
      const _0x5cb944 = _0x513a16["has"](normalizeText(_0x394fc6["dataset"]['storyClipId']));
      _0x394fc6["classList"]["toggle"]("is-selection-mode", _0x46a1ea["clipSelectionMode"]);
      _0x394fc6["classList"]["toggle"]('is-checked', _0x46a1ea["clipSelectionMode"] && _0x5cb944);
      if (!_0x46a1ea["clipSelectionMode"]) {
        _0x394fc6["classList"]['remove']("is-marquee-hit");
      }
      _0x394fc6["setAttribute"]('aria-pressed', _0x46a1ea['clipSelectionMode'] ? String(_0x5cb944) : "false");
      const _0xbafd09 = _0x394fc6["closest"](".story-clip-card-shell");
      const _0x8ce14b = !_0x46a1ea['clipSelectionMode'] && normalizeText(_0x46a1ea["pendingDeleteClipId"]) === normalizeText(_0x394fc6["dataset"]["storyClipId"]);
      _0xbafd09?.['classList']["toggle"]("is-delete-confirming", _0x8ce14b);
      const _0x1db203 = _0xbafd09?.["querySelector"]('.story-clip-delete-trigger');
      const _0x28df11 = _0xbafd09?.["querySelector"](".story-clip-delete-confirm");
      if (_0x1db203) {
        _0x1db203["hidden"] = _0x46a1ea["clipSelectionMode"] || _0x8ce14b;
      }
      if (_0x28df11) {
        _0x28df11["hidden"] = _0x46a1ea["clipSelectionMode"] || !_0x8ce14b;
      }
      let _0x379566 = _0x394fc6["querySelector"](".story-clip-select-indicator");
      if (!_0x46a1ea["clipSelectionMode"]) {
        _0x379566?.["remove"]();
        return;
      }
      !_0x379566 && (_0x379566 = documentObject['createElement']("span"), _0x379566["className"] = 'story-asset-select-indicator\x20story-clip-select-indicator', _0x379566["setAttribute"]("aria-hidden", "true"), _0x394fc6['prepend'](_0x379566));
      _0x379566["textContent"] = _0x5cb944 ? '✓' : '';
    });
    return !![];
  }
  function _0xee9559() {
    const _0x402e26 = _0x136276()?.["querySelectorAll"]("[data-story-asset-batch-control]") || [];
    const _0x2c75ca = storyAssetSettingsProjection['projectAssetControl']("batch-generation", {
      'state': _0x46a1ea
    });
    let _0x215e76 = ![];
    _0x402e26['forEach'](_0x59e424 => {
      _0x215e76 = updateStoryAssetBatchButtonLabel(_0x59e424, _0x2c75ca["label"]) || _0x215e76;
    });
    return _0x215e76;
  }
  function _0x2131c3({
    previousMode = '',
    surface = 'story'
  } = {}) {
    if (_0x4f49a2) {
      return null;
    }
    if (_0x46a1ea["workspaceSurface"] !== surface) {
      _0x2a094b();
    }
    const _0x36ad56 = selectStoryWorkspaceSurface(_0x46a1ea, surface);
    if (_0x36ad56) {
      _0x3e8f6e["invalidate"]();
    }
    _0x2988c5 = !![];
    if (_0x3e8f6e['activate']()) {
      _0x325d8d({
        'capturePageState': previousMode === "story"
      });
    }
    _0x3e6e62?.["sync"]();
    return _0x329e8d;
  }
  function _0x124c22({
    nextMode = ''
  } = {}) {
    if (["story", "replication"]["includes"](nextMode)) {
      return !![];
    }
    if (_0x4f49a2) {
      return ![];
    }
    closeStoryRequestDebugPreview(documentObject);
    _0x2988c5 && (_0x2b902c(), _0x18eeff({
      'immediate': !![]
    }));
    _0x2988c5 = ![];
    _0x3e6e62?.["sync"]();
    _0x1149d8();
    _0x2f87a6();
    _0x22f2d9();
    _0x1b3da4();
    _0x1c1572();
    _0x2c03e7();
    _0x285a4f();
    _0x36cc45();
    _0x3e8f6e["deactivate"]();
    return !![];
  }
  function _0x1b3da4(_0x2c3073 = null) {
    _0x329e8d["querySelectorAll"](".story-model-picker.is-open")["forEach"](_0x351f1d => {
      if (_0x351f1d === _0x2c3073) {
        return;
      }
      _0x351f1d['classList']["remove"]("is-open");
      _0x351f1d["querySelector"]("[data-story-model-trigger]")?.['setAttribute']("aria-expanded", 'false');
    });
  }
  function _0x1c1572(_0x2920ee = null) {
    _0x329e8d["querySelectorAll"](".story-home-param-picker.is-open")['forEach'](_0x168ccd => {
      if (_0x168ccd === _0x2920ee) {
        return;
      }
      _0x168ccd["classList"]['remove']("is-open");
      _0x168ccd["querySelector"]("[data-story-home-param-trigger]")?.["setAttribute"]("aria-expanded", "false");
    });
  }
  function _0x358f94(_0x31c366 = '') {
    const _0x5c5b17 = normalizeText(_0x31c366);
    _0x46a1ea["openProjectMenuId"] = _0x5c5b17;
    _0x329e8d["querySelectorAll"]("[data-story-open-project]")['forEach'](_0x2229ba => {
      const _0x4858aa = normalizeText(_0x2229ba["dataset"]["storyOpenProject"]) === _0x5c5b17;
      _0x2229ba["classList"]["toggle"]("is-menu-open", _0x4858aa);
      const _0x108717 = _0x2229ba["querySelector"]("[data-story-action=\"toggle-project-menu\"]");
      const _0x101863 = _0x2229ba["querySelector"]("[data-story-project-menu]");
      _0x108717?.["setAttribute"]("aria-expanded", String(_0x4858aa));
      _0x101863 && (_0x101863["hidden"] = !_0x4858aa, _0x101863["setAttribute"]("aria-hidden", String(!_0x4858aa)));
    });
  }
  function _0x2ed527() {
    _0x329e8d["querySelectorAll"]("[data-story-project-sort-wrap].is-open")['forEach'](_0xbc8bf5 => {
      _0xbc8bf5["classList"]['remove']('is-open');
      _0xbc8bf5["querySelector"]("[data-story-action=\"toggle-project-sort-menu\"]")?.["setAttribute"]('aria-expanded', "false");
      _0xbc8bf5['querySelector']("[data-story-project-sort-menu]")?.["setAttribute"]("aria-hidden", "true");
    });
  }
  function _0x2b965c(_0x3c0dd7, _0x4c5d14) {
    const _0x153e29 = _0x3c0dd7?.["querySelector"]("[data-story-project-sort-menu]");
    if (!_0x3c0dd7 || !_0x4c5d14 || !_0x153e29) {
      return;
    }
    _0x2ed527();
    _0x3c0dd7["classList"]["add"]("is-open");
    _0x4c5d14["setAttribute"]('aria-expanded', 'true');
    _0x153e29["setAttribute"]("aria-hidden", "false");
  }
  function _0x2c03e7(_0x5959ee = null) {
    _0x329e8d["querySelectorAll"]('.story-asset-batch-menu-wrap.is-open')["forEach"](_0x1491ad => {
      if (_0x1491ad === _0x5959ee) {
        return;
      }
      _0x5ee54e(_0x1491ad);
      _0x1491ad["classList"]["remove"]("is-open");
      _0x1491ad["querySelector"]('.story-asset-batch-trigger')?.['setAttribute']("aria-expanded", "false");
    });
  }
  function _0x54519a(_0xeddcd, _0x253562) {
    const _0x139b8a = _0xeddcd?.["querySelector"](".story-asset-batch-menu");
    if (!_0xeddcd || !_0x253562 || !_0x139b8a) {
      return;
    }
    _0x2c03e7(_0xeddcd);
    _0x5ee54e(_0xeddcd);
    syncWorkspaceInlineMenuExpandedWidth(_0x139b8a);
    _0xeddcd["classList"]["add"]('is-open');
    _0x253562['setAttribute']("aria-expanded", "true");
  }
  const _0x8b0131 = createWorkspaceMenuController({
    'root': _0x329e8d,
    'wrapperSelector': ".story-canvas-sync-menu-wrap",
    'triggerSelector': '[data-story-action=\x22toggle-canvas-sync-menu\x22]',
    'menuSelector': '.story-canvas-sync-menu',
    'optionSelector': ".story-canvas-sync-option"
  });
  function _0x285a4f(_0x50dcc7 = null) {
    _0x8b0131['close'](_0x50dcc7);
  }
  function _0xcf8eeb(_0x44b77f, _0xd2d898) {
    return _0x8b0131["open"](_0x44b77f, _0xd2d898);
  }
  function _0x21ef38(_0xa8e284) {
    return _0x8b0131['handleKeyDown'](_0xa8e284);
  }
  function _0x36cc45(_0x4c44ab = null) {
    _0x329e8d["querySelectorAll"](".story-character-voice-history-wrap.is-open")["forEach"](_0x57fe2b => {
      if (_0x57fe2b === _0x4c44ab) {
        return;
      }
      _0x57fe2b["classList"]["remove"]('is-open');
      _0x57fe2b["querySelector"]("[data-story-action=\"toggle-character-voice-history\"]")?.["setAttribute"]("aria-expanded", "false");
      _0x57fe2b["querySelector"]('.story-character-voice-history-panel')?.["setAttribute"]("aria-hidden", 'true');
    });
  }
  function _0x38e6d9(_0x16cd9f, _0x24ddfe) {
    const _0x36b72c = _0x16cd9f?.['querySelector']('[data-story-style-library]');
    const _0x2a6097 = _0x16cd9f?.["querySelector"]("[data-story-style-custom-editor]");
    if (!_0x36b72c || !_0x2a6097) {
      return;
    }
    _0x36b72c["hidden"] = _0x24ddfe;
    _0x2a6097["hidden"] = !_0x24ddfe;
    _0x16cd9f["classList"]["toggle"]("is-custom-editing", _0x24ddfe);
    _0x24ddfe && windowObject["requestAnimationFrame"](() => {
      const _0x273e69 = _0x2a6097['querySelector']("[data-story-style-custom-input]");
      _0x273e69?.["focus"]();
      _0x273e69?.["setSelectionRange"]?.(_0x273e69['value']['length'], _0x273e69["value"]["length"]);
    });
  }
  function _0x1b7596(_0x292fda) {
    const _0x5a5a5e = _0x292fda?.["querySelector"]("[data-story-style-category].is-active")?.["dataset"]["storyStyleCategory"] || "all";
    const _0x22aa89 = normalizeText(_0x292fda?.["querySelector"]("[data-story-style-search-input]")?.['value'])["toLowerCase"]();
    let _0x5ee1cf = 0x0;
    _0x292fda?.["querySelectorAll"]("[data-story-style-card-category]")["forEach"](_0xf8cbc5 => {
      const _0x2e99c3 = _0xf8cbc5["dataset"]["storyStyleCardCategory"];
      const _0x595708 = _0x5a5a5e === "all" || _0x2e99c3 === _0x5a5a5e;
      const _0xa09f6d = !_0x22aa89 || String(_0xf8cbc5["dataset"]["storyStyleSearch"] || '')["includes"](_0x22aa89);
      _0xf8cbc5["hidden"] = !(_0x595708 && _0xa09f6d);
      if (!_0xf8cbc5["hidden"]) {
        _0x5ee1cf += 0x1;
      }
    });
    const _0x9ccae4 = _0x292fda?.["querySelector"]("[data-story-style-empty]");
    if (_0x9ccae4) {
      _0x9ccae4["hidden"] = _0x5ee1cf > 0x0;
    }
  }
  function _0x285965(_0x3cc250) {
    const _0x1f302c = normalizeStoryAspectRatio(_0x3cc250);
    _0x46a1ea["data"]['project']["aspectRatio"] = _0x1f302c;
    _0x46a1ea['videoGenerationParams'] = applyStoryAspectRatioToVideoGenerationParams(_0x46a1ea["models"]["video"], _0x46a1ea['videoGenerationParams'], _0x1f302c);
    _0x46a1ea["videoGenerationParamsByModel"] = {
      ..._0x46a1ea["videoGenerationParamsByModel"],
      [_0x46a1ea["models"]["video"]]: {
        ..._0x46a1ea["videoGenerationParams"]
      }
    };
    _0x18eeff();
    _0x325d8d();
  }
  function _0x4f7f0e(_0x437320, _0x514229, {
    renderWorkspace = !![]
  } = {}) {
    const _0x4a747f = normalizeStoryProjectPlanning(_0x46a1ea["data"]["project"], {
      'allowDeveloperPromptModes': _0x46a1ea["developerModeAvailable"]
    });
    if (_0x437320 === "targetLocale") {
      _0x46a1ea["replicationTargetLocale"] = getStoryReplicationLocale(_0x514229)["value"];
      if (_0x46a1ea["hasCreatedProject"] && updateStoryReplicationReplacement(_0x46a1ea["data"], {
        'field': _0x437320,
        'value': _0x46a1ea["replicationTargetLocale"]
      })) {
        _0x2a094b();
      }
      _0x18eeff();
      _0x325d8d();
      return;
    }
    const _0xd9d0f0 = _0x437320 === "episodeCount" ? normalizeStoryEpisodeCount(_0x514229) : _0x437320 === "promptMode" ? normalizeStoryPromptMode(_0x514229, {
      'allowDeveloperModes': _0x46a1ea["developerModeAvailable"]
    }) : normalizeStorySceneMaxSeconds(_0x514229);
    _0x46a1ea["data"]["project"]['planning'] = {
      ..._0x4a747f,
      [_0x437320]: _0xd9d0f0
    };
    _0x437320 === "promptMode" && applyStoryPromptModeVideoModelDefault(_0x46a1ea, _0xd9d0f0) && _0x4f1ece();
    _0x18eeff();
    if (renderWorkspace) {
      _0x325d8d();
    }
    return _0xd9d0f0;
  }
  function _0x503bb7(_0x8a3b04) {
    const _0x8c2e6f = Number(_0x8a3b04?.["value"]);
    if (!Number["isInteger"](_0x8c2e6f) || _0x8c2e6f < 0x1 || _0x8c2e6f > STORY_EPISODE_COUNT_MAX) {
      _0x8a3b04?.['setAttribute']('aria-invalid', "true");
      _0x49e2b8("请输入 1-" + STORY_EPISODE_COUNT_MAX + " 的整数集数。", 'warn');
      _0x8a3b04?.['focus']();
      return ![];
    }
    _0x8a3b04?.["setAttribute"]("aria-invalid", "false");
    const _0x4b749b = _0x4f7f0e("episodeCount", _0x8c2e6f, {
      'renderWorkspace': ![]
    });
    _0x245a75(_0x8a3b04, _0x4b749b);
    return !![];
  }
  function _0x245a75(_0x3e0c03, _0x3c596b) {
    const _0x343491 = _0x3e0c03?.["closest"](".story-episode-count-custom-editor");
    const _0x15544b = _0x343491?.['closest'](".story-planning-picker");
    if (!_0x343491 || !_0x15544b) {
      return ![];
    }
    const _0x58ff14 = !STORY_EPISODE_COUNT_OPTIONS['includes'](_0x3c596b);
    _0x343491["classList"]["toggle"]("is-selected", _0x58ff14);
    _0x343491['setAttribute']("aria-selected", String(_0x58ff14));
    _0x3e0c03["value"] = _0x58ff14 ? String(_0x3c596b) : '';
    _0x15544b["querySelectorAll"]("[data-story-planning-field=\"episodeCount\"]")["forEach"](_0x333e56 => {
      const _0x256eab = Number(_0x333e56["dataset"]['storyPlanningOption']) === _0x3c596b;
      _0x333e56["classList"]["toggle"]("is-selected", _0x256eab);
      _0x333e56["setAttribute"]("aria-selected", String(_0x256eab));
    });
    const _0x4fb68a = _0x15544b["querySelector"]("[data-story-planning-trigger-label]");
    if (_0x4fb68a) {
      _0x4fb68a["textContent"] = _0x3c596b + '集';
    }
    return !![];
  }
  function _0x517088(_0x290c70) {
    windowObject['setTimeout'](() => {
      if (!_0x290c70?.["isConnected"]) {
        return;
      }
      normalizeText(_0x290c70["value"]) ? _0x503bb7(_0x290c70) : _0x245a75(_0x290c70, normalizeStoryEpisodeCount(_0x46a1ea["data"]["project"]?.['planning']?.["episodeCount"]));
    }, 0x0);
  }
  function _0x318be6(_0x5dd2b3) {
    const _0x2fea99 = resolveStoryStyleSelection({
      'styleId': _0x5dd2b3
    });
    if (_0x2fea99["isCustom"]) {
      return;
    }
    const _0x5b5b26 = resolveStoryStyleSelection({
      'styleId': _0x46a1ea["data"]["project"]['videoStyleId'],
      'stylePrompt': _0x46a1ea["data"]["project"]['videoStylePrompt'],
      'videoStyle': _0x46a1ea["data"]['project']["videoStyle"]
    })["stylePrompt"];
    _0x46a1ea["data"]["project"]["videoStyleId"] = _0x2fea99["styleId"];
    _0x46a1ea['data']['project']["videoStylePrompt"] = _0x2fea99["stylePrompt"];
    _0x46a1ea["data"]["project"]["videoStyle"] = _0x2fea99['label'];
    _0x2113e3["replaceCurrent"](syncStoryPlanningVisualStyle(_0x46a1ea["data"], {
      'previousStyle': _0x5b5b26,
      'visualStyle': _0x2fea99['stylePrompt']
    }));
    _0x18eeff();
    _0x325d8d();
  }
  function _0x5c142d(_0x509880) {
    const _0x4d9bdf = normalizeText(_0x509880?.["value"])["slice"](0x0, STORY_CUSTOM_STYLE_MAX_CHARACTERS);
    if (!_0x4d9bdf) {
      _0x49e2b8("请输入自定义风格提示词。", "warn");
      _0x509880?.["focus"]();
      return;
    }
    const _0x12b232 = resolveStoryStyleSelection({
      'styleId': _0x46a1ea['data']["project"]["videoStyleId"],
      'stylePrompt': _0x46a1ea['data']["project"]["videoStylePrompt"],
      'videoStyle': _0x46a1ea['data']['project']['videoStyle']
    })["stylePrompt"];
    _0x46a1ea["data"]['project']["videoStyleId"] = STORY_STYLE_CUSTOM_ID;
    _0x46a1ea['data']['project']["videoStylePrompt"] = _0x4d9bdf;
    _0x46a1ea['data']["project"]['customVideoStylePrompt'] = _0x4d9bdf;
    _0x46a1ea["data"]['project']["videoStyle"] = _0x4d9bdf;
    _0x2113e3["replaceCurrent"](syncStoryPlanningVisualStyle(_0x46a1ea["data"], {
      'previousStyle': _0x12b232,
      'visualStyle': _0x4d9bdf
    }));
    _0x18eeff();
    _0x325d8d();
  }
  const _0x95f061 = _0x4e571e => openStoryProjectPage({
    'state': _0x46a1ea,
    'canEnterStep': canEnterStoryWorkspaceStep,
    'render': _0x325d8d
  }, _0x4e571e);
  function _0x3eea2e(_0x269844) {
    const _0x5d2fd1 = normalizeText(_0x269844);
    const _0x1cc3f3 = normalizeText(_0x46a1ea["data"]?.["project"]?.['id']);
    const _0x3a3a28 = _0x2113e3['getEntry'](_0x5d2fd1);
    _0x46a1ea["pendingDeleteAssetAppearanceKey"] = '';
    if (_0x5d2fd1 && _0x5d2fd1 === _0x1cc3f3 && _0x46a1ea['hasCreatedProject']) {
      applyStoryProjectUiState(_0x46a1ea, _0x3a3a28?.['ui'], _0x46a1ea["data"]);
      _0x48257d(_0x46a1ea["data"]);
      const _0x1e7ee8 = getSelectedEpisode(_0x46a1ea);
      _0x42ff41(getSelectedClip(_0x46a1ea, _0x1e7ee8), {
        'episode': _0x1e7ee8,
        'enteringEpisode': _0x46a1ea["view"] === "episode"
      });
      _0x95f061({
        'restoreView': !![]
      });
      _0x39d2af();
      _0x18eeff({
        'immediate': !![]
      });
      _0x16d303();
      _0x1c2bde();
      return;
    }
    if (!_0x3a3a28?.['data']) {
      return;
    }
    const _0x2268ce = _0x2113e3['activate'](_0x5d2fd1, {
      'beforeActivate': () => {
        _0x3ec610({
          'clearState': !![]
        });
        _0x389fbf();
      }
    });
    if (!_0x2268ce) {
      return;
    }
    _0x46a1ea["scriptMode"] = normalizeStoryScriptMode(_0x46a1ea["data"]['project']?.["scriptMode"]);
    _0x46a1ea["data"]["project"]["planning"] = normalizeStoryProjectPlanning(_0x46a1ea["data"]["project"], {
      'allowDeveloperPromptModes': _0x46a1ea["developerModeAvailable"]
    });
    const _0x594b6b = _0x46a1ea["data"]['project']?.["sourceDocument"];
    _0x594b6b && typeof _0x594b6b === "object" && (_0x46a1ea["scriptFileName"] = String(_0x594b6b["fileName"] || ''), _0x46a1ea["scriptText"] = String(_0x594b6b['text'] || '')["slice"](0x0, STORY_SCRIPT_MAX_CHARACTERS), _0x46a1ea["scriptCharacterCount"] = Number["isFinite"](_0x594b6b["characterCount"]) ? _0x594b6b['characterCount'] : _0x46a1ea["scriptText"]["length"]);
    _0x46a1ea['assetSelectionMode'] = ![];
    _0x46a1ea['selectedAssetIds'] = [];
    _0x46a1ea['scriptSelectionMode'] = ![];
    _0x46a1ea["selectedScriptEpisodeIds"] = [];
    _0x46a1ea["characterVoiceEditor"] = null;
    _0x46a1ea["characterVoicePanelMotion"] = '';
    _0x46a1ea['pendingCharacterVoiceAssetId'] = '';
    _0x46a1ea['pendingDeleteClipId'] = '';
    _0x46a1ea["pendingDeleteAssetAppearanceKey"] = '';
    _0x46a1ea["clipSelectionMode"] = ![];
    _0x46a1ea['selectedClipGenerationIds'] = [];
    applyStoryProjectUiState(_0x46a1ea, _0x2268ce['ui'], _0x46a1ea['data']);
    _0x48257d(_0x46a1ea["data"]);
    _0x46a1ea["projectTitleEdited"] = _0x2268ce["projectTitleEdited"] === !![];
    _0x46a1ea["hasCreatedProject"] = !![];
    const _0x568ba7 = getSelectedEpisode(_0x46a1ea);
    _0x42ff41(getSelectedClip(_0x46a1ea, _0x568ba7), {
      'episode': _0x568ba7,
      'enteringEpisode': _0x46a1ea["view"] === "episode"
    });
    _0x95f061({
      'restoreView': !![]
    });
    _0x39d2af();
    _0x18eeff({
      'immediate': !![]
    });
    _0x16d303();
    _0x1c2bde();
  }
  function _0x28433b(_0x136d3a) {
    const _0x542cfd = _0x1f811e["querySelector"](".story-page.is-current");
    if (!_0x542cfd) {
      return ![];
    }
    if (_0x136d3a["outlineSectionId"]) {
      return jumpToStoryOutlineSection(_0x542cfd, _0x136d3a["outlineSectionId"], {
        'windowObject': windowObject
      });
    }
    const _0x14c745 = _0x136d3a["assetId"] ? "storyAssetId" : _0x136d3a["clipId"] ? "storyClipId" : '';
    const _0x33fae9 = _0x136d3a["assetId"] || _0x136d3a["clipId"];
    if (!_0x14c745 || !_0x33fae9) {
      return ![];
    }
    const _0x95ea86 = _0x136d3a['assetId'] ? "[data-story-asset-id]" : '[data-story-clip-id]';
    const _0x55e53d = [..._0x542cfd['querySelectorAll'](_0x95ea86)]["find"](_0x1f6607 => normalizeText(_0x1f6607?.['dataset']?.[_0x14c745]) === _0x33fae9);
    if (!_0x55e53d) {
      return ![];
    }
    const _0x3d0942 = () => _0x55e53d['scrollIntoView']?.({
      'behavior': "smooth",
      'block': 'nearest',
      'inline': "nearest"
    });
    typeof windowObject?.["requestAnimationFrame"] === "function" ? windowObject["requestAnimationFrame"](_0x3d0942) : _0x3d0942();
    return !![];
  }
  async function _0x4eae3e(_0x218bdd = {}) {
    const _0x95bdf2 = normalizeText(_0x218bdd["projectId"]);
    if (!_0x95bdf2) {
      return ![];
    }
    if (normalizeText(_0x46a1ea["data"]?.["project"]?.['id']) !== _0x95bdf2) {
      const _0x23e047 = _0x46a1ea["projects"]["some"](_0x3dfa14 => normalizeText(_0x3dfa14?.['id'] || _0x3dfa14?.['data']?.["project"]?.['id']) === _0x95bdf2);
      if (!_0x23e047) {
        _0x49e2b8("对应的剧本项目已不存在。", "warn");
        return ![];
      }
      _0x3eea2e(_0x95bdf2);
    }
    if (normalizeText(_0x46a1ea["data"]?.["project"]?.['id']) !== _0x95bdf2) {
      _0x49e2b8('无法打开任务对应的剧本项目。', "warn");
      return ![];
    }
    requestWorkspaceMode(getStoryProjectWorkspaceMode(_0x46a1ea["data"]?.['project']));
    const _0x172f26 = resolveStoryTaskResultDestination(_0x46a1ea["data"], _0x218bdd);
    if (_0x172f26['view'] === "episode") {
      const _0x38f002 = await _0x3a3838(_0x172f26["episodeId"], _0x172f26["clipId"]);
      if (!_0x38f002) {
        return ![];
      }
      _0x28433b(_0x172f26);
      return !![];
    }
    if (!(await _0x2b8231(_0x172f26["step"], {
      'assetId': _0x172f26["assetId"],
      'assetFilter': _0x172f26["assetFilter"],
      'outlineSectionId': _0x172f26["outlineSectionId"]
    }))) {
      return ![];
    }
    _0x28433b(_0x172f26);
    return !![];
  }
  function _0x27e3d7(_0x29579e) {
    const _0xb55f7e = normalizeText(_0x29579e);
    const _0x440138 = getSelectedEpisode(_0x46a1ea);
    const _0x3b8486 = _0x46a1ea["data"]["episodes"]["findIndex"](_0x1b3ad8 => _0x1b3ad8['id'] === _0x440138?.['id']);
    const _0x563e25 = removeStoryEpisodeClip(_0x440138, _0xb55f7e);
    if (!_0xb55f7e || !_0x563e25 || _0x3b8486 < 0x0) {
      _0x46a1ea["pendingDeleteClipId"] = '';
      _0x325d8d();
      _0x49e2b8("删除片段失败，请刷新后重试。", "error");
      return ![];
    }
    _0x46a1ea["data"]["episodes"][_0x3b8486] = _0x563e25["episode"];
    _0x46a1ea["pendingDeleteClipId"] = '';
    _0x46a1ea["selectedClipGenerationIds"] = _0x46a1ea["selectedClipGenerationIds"]["filter"](_0x24e147 => normalizeText(_0x24e147) !== _0xb55f7e);
    const _0x55f78a = _0x563e25["episode"]['clips']['find'](_0x24309b => normalizeText(_0x24309b?.['id']) === normalizeText(_0x46a1ea["selectedClipId"]));
    const _0x35e0ac = _0x55f78a || _0x563e25["nextClip"] || null;
    _0x46a1ea["selectedClipId"] = _0x35e0ac?.['id'] || '';
    _0x180373(_0x35e0ac);
    _0x18eeff({
      'immediate': !![]
    });
    _0x325d8d();
    _0x49e2b8('片段已删除。', "success");
    return !![];
  }
  function _0x4c04b3(_0x338430) {
    const _0x4940b5 = buildStoryClipFrameMentionId(_0x338430);
    if (!_0x4940b5) {
      return 0x0;
    }
    const _0x183cc0 = _0x4a8821 => {
      let _0x342a22 = 0x0;
      _0x4a8821?.["querySelectorAll"]?.(".ref-pill")?.["forEach"](_0x5cffc3 => {
        if (normalizeText(_0x5cffc3["dataset"]?.["assetId"]) !== _0x4940b5) {
          return;
        }
        _0x5cffc3["remove"]?.();
        _0x342a22 += 0x1;
      });
      return _0x342a22;
    };
    let _0x8635c8 = 0x0;
    const _0x3b1b8c = getSelectedClip(_0x46a1ea, getSelectedEpisode(_0x46a1ea));
    const _0x41d6ca = _0x329e8d["querySelector"]('[data-story-clip-prompt]');
    if (_0x41d6ca && _0x3b1b8c) {
      const _0x40f7ce = _0x183cc0(_0x41d6ca);
      _0x40f7ce && (_0x3b1b8c["prompt"] = sanitizePromptHtmlForCommit(_0x41d6ca["innerHTML"]), _0x8635c8 += _0x40f7ce);
    }
    _0x46a1ea["data"]['episodes']["forEach"](_0x559fb3 => {
      (_0x559fb3?.["clips"] || [])['forEach'](_0x28f08d => {
        if (!normalizeText(_0x28f08d?.["prompt"])["includes"](_0x4940b5)) {
          return;
        }
        const _0x5d1563 = documentObject['createElement']("div");
        _0x5d1563["innerHTML"] = _0x28f08d['prompt'];
        const _0x242af9 = _0x183cc0(_0x5d1563);
        if (!_0x242af9) {
          return;
        }
        _0x28f08d["prompt"] = sanitizePromptHtmlForCommit(_0x5d1563["innerHTML"]);
        _0x8635c8 += _0x242af9;
      });
    });
    return _0x8635c8;
  }
  async function _0x3e4f00(_0x4baedf) {
    const _0x1f78f3 = normalizeText(_0x4baedf);
    const _0x274d8c = normalizeStoryClipFrames(_0x46a1ea["data"]["clipFrames"]);
    const _0x5d7bac = _0x274d8c['find'](_0x33cc6e => _0x33cc6e['id'] === _0x1f78f3);
    if (!_0x5d7bac) {
      _0x49e2b8("删除失败，当前内容已不存在。", "error");
      return ![];
    }
    if (_0x5d7bac["captureSavePending"] === !![]) {
      _0x49e2b8("请等待当前片段帧保存完成。", "info");
      return ![];
    }
    if (typeof deleteCanvasNodes === "function" && normalizeText(_0x5d7bac["canvasId"]) && normalizeText(_0x5d7bac["canvasNodeId"])) {
      try {
        await deleteCanvasNodes({
          'canvasId': _0x5d7bac["canvasId"],
          'nodeIds': [_0x5d7bac["canvasNodeId"]]
        });
      } catch (_0x5c097c) {
        _0x49e2b8(_0x5c097c?.["message"] || "关联画布节点删除失败。", 'error');
        return ![];
      }
    }
    const _0x4a3d7c = _0x4c04b3(_0x1f78f3);
    _0x46a1ea['data']['clipFrames'] = removeStoryClipFrame(_0x274d8c, _0x1f78f3);
    _0x1149d8();
    _0x10a1d2();
    if (!_0x1d3480({
      'refreshContent': !![]
    })) {
      _0x325d8d();
    }
    _0x18eeff({
      'immediate': !![]
    });
    const _0xbfe2ab = getStoryClipFrameMediaType(_0x5d7bac) === STORY_CLIP_MEDIA_TYPE_VIDEO ? '视频片段' : '片段帧';
    _0x49e2b8(_0x4a3d7c > 0x0 ? _0xbfe2ab + "已删除，相关提示词引用已移除。" : _0xbfe2ab + "已删除。", "success");
    return !![];
  }
  const _0x41fe0f = createStoryVideoReplicationWorkspaceController({
    'state': _0x46a1ea,
    'viewport': _0x1f811e,
    'documentObject': documentObject,
    'windowObject': windowObject,
    'analyzeSourceVideo': analyzeSourceVideo,
    'analysisPromises': _0x562990,
    'sourceFileByEpisodeKey': _0x4bf94c,
    'createProjectToken': () => _0x3e5ebf(_0x46a1ea),
    'beginProjectSession': () => _0x208486(),
    'isProjectTaskLive': _0x4d0c22,
    'isProjectTaskCurrent': _0x30dd2e,
    'startBackgroundTask': _0x236a2a,
    'updateBackgroundTask': _0x274058,
    'finishBackgroundTask': _0x2b6b77,
    'syncProjectEntry': _0x3dc37b,
    'syncCurrentProjectEntry': _0x2a094b,
    'schedulePersistence': _0x18eeff,
    'openProject': _0x95f061,
    'renderFooter': renderStoryVideoReplicationFooter,
    'showToast': _0x49e2b8,
    'showNavigableTaskResultToast': _0x351b79,
    'notifyTextTaskComplete': _0x165554
  });
  const {
    createSourcePreviewUrl: _0x2a96f1,
    refreshFooter: _0x44d2f9,
    releaseSourcePreviewUrls: _0x11ccc2,
    retryFailedAnalysis: _0xbbfa48,
    revokeSourcePreviewUrl: _0x41160e,
    runAnalysis: _0x4e2f56,
    startFromHome: _0x344fdc
  } = _0x41fe0f;
  const _0x24d772 = createStoryHomeWorkspaceController({
    'state': _0x46a1ea,
    'root': _0x329e8d,
    'viewport': _0x1f811e,
    'documentObject': documentObject,
    'windowObject': windowObject,
    'projectData': _0x2113e3,
    'extractDocumentText': extractDocumentText,
    'syncCurrentProjectEntry': _0x2a094b,
    'beginProjectSession': () => _0x208486(),
    'advanceProjectSession': _0x459e11,
    'invalidateProjectRuntime': _0x1bb68c,
    'releaseReplicationSourcePreviewUrls': _0x11ccc2,
    'schedulePersistence': _0x18eeff,
    'render': _0x325d8d,
    'showToast': _0x49e2b8,
    'showTaskResultToast': _0x255bec,
    'refreshTextModelSelector': _0x47f54f => _0x58ddbc["get"](_0x47f54f)?.['refreshTextModelSelector']?.()
  });
  const {
    deleteProject: _0x15d598,
    duplicateProject: _0x431340,
    focusProjectTitle: _0x4316a5,
    resetCreationState: _0x5f3b24,
    selectScriptFile: _0x205ae3,
    selectScriptMode: _0x5d9ca2,
    setProjectArchived: _0x21b3de,
    switchTab: _0x534617,
    syncGenerateState: _0x3ac8ee
  } = _0x24d772;
  function _0xd9145d({
    overlayId = 'story-planning-confirm-overlay',
    title: _0x3f8a11,
    message: _0x3a3434,
    choices = [],
    fallbackValue = null
  } = {}) {
    if (!documentObject?.["body"]) {
      return Promise["resolve"](fallbackValue);
    }
    documentObject['getElementById'](overlayId)?.["remove"]();
    return new Promise(_0x63948b => {
      const _0x20e1d4 = documentObject["createElement"]("div");
      _0x20e1d4['id'] = overlayId;
      _0x20e1d4["className"] = "custom-confirm-overlay";
      const _0x4fc4b5 = documentObject["createElement"]("div");
      _0x4fc4b5['className'] = 'custom-confirm-box';
      const _0x1e6ba8 = documentObject["createElement"]("div");
      _0x1e6ba8['className'] = "confirm-title";
      _0x1e6ba8['textContent'] = _0x3f8a11 || "重新生成";
      const _0x3f8665 = documentObject["createElement"]('div');
      _0x3f8665["className"] = "confirm-msg";
      _0x3f8665["textContent"] = _0x3a3434 || "请选择如何处理已有生成结果。";
      const _0x2c6d81 = documentObject["createElement"]("div");
      _0x2c6d81["className"] = "confirm-btns";
      _0x4fc4b5["append"](_0x1e6ba8, _0x3f8665, _0x2c6d81);
      _0x20e1d4["appendChild"](_0x4fc4b5);
      documentObject["body"]["appendChild"](_0x20e1d4);
      let _0x4ce6b9 = ![];
      let _0x2996a0 = null;
      const _0x2dbd6d = _0x55a25b => {
        if (_0x4ce6b9) {
          return;
        }
        _0x4ce6b9 = !![];
        documentObject["removeEventListener"]("keydown", _0x4f0a5c, !![]);
        _0x20e1d4["remove"]();
        _0x63948b(_0x55a25b);
      };
      const _0x4f0a5c = _0xdc9b1f => {
        if (_0xdc9b1f["key"] !== 'Escape') {
          return;
        }
        _0xdc9b1f["preventDefault"]();
        _0x2dbd6d(null);
      };
      _0x20e1d4["addEventListener"]("click", _0x5dc6cf => {
        if (_0x5dc6cf["target"] === _0x20e1d4) {
          _0x2dbd6d(null);
        }
      });
      choices["forEach"](_0x4deea5 => {
        const _0x2140ba = documentObject["createElement"]("button");
        _0x2140ba["type"] = "button";
        _0x2140ba["className"] = 'confirm-btn\x20' + (_0x4deea5['primary'] ? "confirm-ok" : "confirm-cancel");
        _0x2140ba["textContent"] = _0x4deea5["label"];
        _0x2140ba["addEventListener"]('click', () => _0x2dbd6d(_0x4deea5['value']));
        _0x2c6d81['appendChild'](_0x2140ba);
        if (_0x4deea5["autofocus"]) {
          _0x2996a0 = _0x2140ba;
        }
      });
      documentObject["addEventListener"]('keydown', _0x4f0a5c, !![]);
      _0x2996a0?.["focus"]?.();
    });
  }
  const _0x3dd612 = createStoryAssetExtractionWorkspaceController({
    'state': _0x46a1ea,
    'windowObject': windowObject,
    'extractAssets': extractAssets,
    'extractAssetsParallel': extractAssetsParallel,
    'extractAssetsExperimental': extractAssetsExperimental,
    'host': {
      'createStoryProjectTaskToken': _0x3e5ebf,
      'finishStoryProjectBackgroundTask': _0x2b6b77,
      'goToStep': (..._0x4e2a07) => _0x2b8231(..._0x4e2a07),
      'isProjectTaskCurrent': _0x30dd2e,
      'isProjectTaskLive': _0x4d0c22,
      'notifyNavigableTextTaskComplete': _0x165554,
      'persistWorkspaceNow': _0x1c9431,
      'refreshStoryAssetExtractionFooterInPlace': _0x5677de,
      'refreshStoryReplicationFooterInPlace': _0x44d2f9,
      'registerStoryProjectData': _0x492bef,
      'render': (..._0x38f2f7) => _0x325d8d(..._0x38f2f7),
      'reportStoryWorkspaceApiError': reportStoryWorkspaceApiError,
      'requestStoryWorkspaceChoice': _0xd9145d,
      'resetStoryDownstreamUiState': (..._0x464643) => _0x59c3fd(..._0x464643),
      'scheduleWorkspacePersistence': _0x18eeff,
      'showTaskResultToast': _0x255bec,
      'showToast': _0x49e2b8,
      'startStoryProjectBackgroundTask': _0x236a2a,
      'syncCompiledEpisodeScripts': (..._0x68ba56) => _0x91d0fb(..._0x68ba56),
      'syncStoryPlanningLoading': _0x4fda69,
      'syncStoryProjectTaskEntry': _0x3dc37b,
      'updateStoryProjectBackgroundTask': _0x274058
    }
  });
  const {
    continueToProjectAssets: _0x490a7b,
    extractProjectAssets: _0xecce1e,
    getStoryPlanningAgentContext: _0x4b2df7,
    openEpisodeStage: _0x2d69e6,
    requestPlanningRegenerationMode: _0x2c086f,
    restoreStoryAssetBreakdownProgress: _0x39d2af,
    setStoryPlanningOperation: _0x1b714e,
    stopStoryAssetBreakdownProgress: _0x3ec610
  } = _0x3dd612;
  const _0x488f8d = createStoryEpisodeOutlineWorkspaceController({
    'state': _0x46a1ea,
    'planEpisodes': planEpisodes,
    'host': {
      'showToast': _0x49e2b8,
      'showTaskResultToast': _0x255bec,
      'requestChoice': _0xd9145d,
      'requestRegenerationMode': _0x2c086f,
      'createProjectTaskToken': () => _0x3e5ebf(_0x46a1ea),
      'getPlanningContext': _0x4b2df7,
      'isProjectTaskLive': _0x4d0c22,
      'isProjectTaskCurrent': _0x30dd2e,
      'startBackgroundTask': _0x236a2a,
      'updateBackgroundTask': _0x274058,
      'finishBackgroundTask': _0x2b6b77,
      'persistNow': _0x1c9431,
      'persistenceRequired': () => typeof saveWorkspace === 'function' && _0x3654ac["isReady"](),
      'setPlanningOperation': _0x1b714e,
      'syncPlanningLoading': _0x4fda69,
      'registerProjectData': _0x492bef,
      'resetDownstreamUi': _0x59c3fd,
      'schedulePersistence': _0x18eeff,
      'notifyComplete': _0x165554,
      'render': _0x325d8d
    }
  });
  function _0x2eae7b(_0x19b80b = {}) {
    return _0x488f8d["execute"](_0x19b80b);
  }
  function _0x91d0fb(_0x13e1b2 = _0x46a1ea["data"]) {
    const _0x35d263 = compileStoryEpisodeScripts(_0x13e1b2['episodes']);
    const _0x37e8c5 = _0x13e1b2["project"] || {};
    _0x37e8c5['chapters'] = _0x35d263["chapters"];
    _0x37e8c5["plotScript"] = _0x35d263["fullText"];
    _0x37e8c5["narrationScript"] = _0x35d263['fullText'];
    _0x37e8c5["compiledScript"] = _0x35d263["complete"] ? {
      'revision': Number(_0x37e8c5['compiledScript']?.["revision"] || 0x0) + 0x1,
      'episodeIds': _0x13e1b2["episodes"]["map"](_0xec9e50 => _0xec9e50['id']),
      'fullText': _0x35d263["fullText"],
      'confirmedAt': Date["now"]()
    } : null;
    return _0x35d263;
  }
  function _0x59c3fd({
    selectedEpisodeId = ''
  } = {}) {
    _0x46a1ea["assetSelectionMode"] = _0x46a1ea["replicationSelectionMode"] = ![];
    _0x46a1ea["selectedAssetIds"] = [];
    _0x46a1ea["selectedAssetId"] = '';
    _0x46a1ea["assetAppearanceIndexes"] = {};
    _0x46a1ea['characterVoiceEditor'] = null;
    _0x46a1ea['episodeSelectionMode'] = ![];
    _0x46a1ea['selectedEpisodeIds'] = [];
    _0x46a1ea['selectedEpisodeId'] = selectedEpisodeId;
    _0x46a1ea["selectedClipId"] = '';
    _0x46a1ea['pendingDeleteClipId'] = '';
    _0x46a1ea["clipSelectionMode"] = ![];
    _0x46a1ea["selectedClipGenerationIds"] = [];
    _0x46a1ea['scriptSelectionMode'] = ![];
    _0x46a1ea["selectedScriptEpisodeIds"] = [];
  }
  const _0x2036f6 = createStorySummaryGenerationWorkspaceController({
    'state': _0x46a1ea,
    'windowObject': windowObject,
    'generateStory': generateStory,
    'startReplicationFromHome': (..._0x4924ca) => _0x344fdc(..._0x4924ca),
    'createProjectToken': () => _0x3e5ebf(_0x46a1ea),
    'beginProjectSession': () => _0x208486(),
    'isProjectTaskLive': _0x4d0c22,
    'isProjectTaskCurrent': _0x30dd2e,
    'registerProjectData': _0x492bef,
    'startBackgroundTask': _0x236a2a,
    'updateBackgroundTask': _0x274058,
    'finishBackgroundTask': _0x2b6b77,
    'syncProjectEntry': _0x3dc37b,
    'syncCurrentProjectEntry': _0x2a094b,
    'persistNow': _0x1c9431,
    'schedulePersistence': _0x18eeff,
    'requiresDurableRunPersistence': () => typeof saveWorkspace === "function" && _0x3654ac["isReady"](),
    'openProject': _0x95f061,
    'render': _0x325d8d,
    'showToast': _0x49e2b8,
    'showTaskResultToast': _0x255bec,
    'notifyTextTaskComplete': _0x165554,
    'requestChoice': _0xd9145d,
    'extractProjectAssets': _0xecce1e,
    'resetDownstreamUi': _0x59c3fd,
    'reportApiError': reportStoryWorkspaceApiError
  });
  const {
    generateFromHome: _0x3763f3,
    regenerateSummary: _0x100c5c
  } = _0x2036f6;
  const _0x532c4c = createStoryEpisodeScriptWorkspaceController({
    'state': _0x46a1ea,
    'generateEpisodeScript': generateEpisodeScript,
    'host': {
      'createProjectTaskToken': () => _0x3e5ebf(_0x46a1ea),
      'isProjectTaskLive': _0x4d0c22,
      'isProjectTaskCurrent': _0x30dd2e,
      'getPlanningContext': _0x4b2df7,
      'requestChoice': _0xd9145d,
      'startBackgroundTask': _0x236a2a,
      'updateBackgroundTask': _0x274058,
      'finishBackgroundTask': _0x2b6b77,
      'persistNow': _0x1c9431,
      'persistenceRequired': () => typeof saveWorkspace === "function" && _0x3654ac["isReady"](),
      'renderPlanningProgress': () => {
        if (_0x46a1ea["view"] === "project" && _0x46a1ea["step"] === 0x1) {
          _0x325d8d();
        }
      },
      'registerProjectData': _0x492bef,
      'resetDownstreamUi': _0x59c3fd,
      'syncCompiledScripts': _0x91d0fb,
      'schedulePersistence': _0x18eeff
    }
  });
  async function _0x5eac7c(_0x2f9551, _0x4eac61 = _0x3e5ebf(_0x46a1ea), {
    batch = null,
    regeneration = ![]
  } = {}) {
    return await _0x532c4c["request"](_0x2f9551, _0x4eac61, {
      'batch': batch,
      'regeneration': regeneration
    });
  }
  async function _0x32896f(_0x15bf45, {
    regeneration = ![]
  } = {}) {
    if (_0x46a1ea["storyPlanningOperation"]) {
      return ![];
    }
    const _0x42854f = _0x46a1ea["data"]["episodes"]["findIndex"](_0x112525 => _0x112525['id'] === _0x15bf45);
    if (_0x42854f < 0x0) {
      return ![];
    }
    if (!regeneration && !canGenerateStoryEpisodeScript(_0x46a1ea['data']["episodes"], _0x42854f)) {
      _0x49e2b8("请先完成第 " + (getNextStoryEpisodeScriptIndex(_0x46a1ea['data']["episodes"]) + 0x1) + " 集剧本。", 'warn');
      return ![];
    }
    const _0xba7819 = _0x46a1ea["data"]['episodes'][_0x42854f];
    _0x46a1ea["scriptGenerationFocusMode"] = !![];
    _0x46a1ea["generatingEpisodeScriptId"] = _0xba7819['id'];
    _0x46a1ea["episodeScriptGenerationStatus"] = "正在生成第 " + (_0x42854f + 0x1) + " 集完整剧本";
    _0x1b714e("writing-episode-script", _0x46a1ea["episodeScriptGenerationStatus"]);
    const _0x234ed4 = _0x3e5ebf(_0x46a1ea);
    try {
      const _0x29086c = await _0x5eac7c(_0xba7819, _0x234ed4, {
        'regeneration': regeneration
      });
      if (!_0x4d0c22(_0x234ed4)) {
        return ![];
      }
      _0x165554('第\x20' + (_0x42854f + 0x1) + '\x20集完整剧本生成完成。', _0x234ed4, {
        'step': 0x1,
        'outlineSectionId': "episode-" + _0x15bf45
      });
      return Boolean(_0x29086c);
    } catch (_0x24c9c6) {
      if (!_0x4d0c22(_0x234ed4)) {
        return ![];
      }
      reportStoryWorkspaceApiError("write-episode-script", _0x24c9c6, {
        'model': _0x46a1ea['models']["text"],
        'provider': _0x46a1ea["textProvider"],
        'episodeId': _0x15bf45
      });
      _0x255bec(_0x24c9c6?.["message"] || '第\x20' + (_0x42854f + 0x1) + '\x20集剧本生成失败。', 'error', _0x24c9c6);
      return ![];
    } finally {
      _0x30dd2e(_0x234ed4) && (_0x46a1ea['generatingEpisodeScriptId'] = '', _0x46a1ea["episodeScriptGenerationStatus"] = '', _0x46a1ea["storyPlanningOperation"] = '', _0x46a1ea["storyPlanningStatus"] = '', _0x325d8d());
    }
  }
  function _0x3f794e() {
    if (_0x46a1ea['storyPlanningOperation'] !== "writing-episode-scripts") {
      return ![];
    }
    const _0x4da409 = normalizeText(_0x46a1ea["episodeScriptBatchId"]);
    if (!_0x4da409) {
      return ![];
    }
    const _0x38bc3a = getStoryBackgroundTasks(_0x46a1ea['data'])['find'](_0x10c914 => isStoryBackgroundTaskActive(_0x10c914) && _0x10c914["batch"]?.['id'] === _0x4da409);
    if (!_0x38bc3a) {
      return ![];
    }
    const _0x3649ad = normalizeText(_0x46a1ea["generatingEpisodeScriptId"]);
    const _0x377669 = (Array["isArray"](_0x38bc3a['batch']?.["pendingEpisodeIds"]) ? _0x38bc3a["batch"]["pendingEpisodeIds"] : [])['map'](_0x2f5377 => normalizeText(_0x2f5377))["filter"](_0x3170f9 => _0x3170f9 && _0x3170f9 !== _0x3649ad);
    if (!_0x377669["length"]) {
      _0x49e2b8("当前集正在生成，暂无可取消的排队分集。", "info");
      return ![];
    }
    if (!_0x3f6927["request"](_0x4da409)) {
      return ![];
    }
    const _0x983f93 = _0x46a1ea["data"]["episodes"]["findIndex"](_0x36ba90 => normalizeText(_0x36ba90?.['id']) === _0x3649ad);
    const _0x2ac439 = _0x983f93 >= 0x0 ? "已取消后续 " + _0x377669['length'] + '\x20集排队，正在完成第\x20' + (_0x983f93 + 0x1) + '\x20集' : "已取消后续 " + _0x377669["length"] + '\x20集排队，正在完成当前集';
    const _0x1b7518 = _0x3e5ebf(_0x46a1ea);
    _0x3519c9(_0x1b7518, _0x4da409, {
      'cancelRequested': !![],
      'cancelledEpisodeIds': _0x377669,
      'pendingEpisodeIds': _0x3649ad ? [_0x3649ad] : [],
      'label': _0x2ac439
    });
    _0x46a1ea["episodeScriptBatchCancelRequested"] = !![];
    _0x46a1ea["episodeScriptGenerationStatus"] = _0x2ac439;
    _0x46a1ea["storyPlanningStatus"] = _0x2ac439;
    _0x325d8d();
    _0x49e2b8("已取消后续 " + _0x377669['length'] + '\x20集排队；当前集会继续生成。', "info");
    return !![];
  }
  async function _0x2338f9({
    selectedOnly = ![]
  } = {}) {
    if (_0x46a1ea["storyPlanningOperation"]) {
      return ![];
    }
    if (selectedOnly && !_0x46a1ea["selectedScriptEpisodeIds"]['length']) {
      _0x49e2b8('请先选择从下一集开始的连续分集。', "info");
      return ![];
    }
    const _0x2bc08f = getStoryEpisodeScriptBatchTargets(_0x46a1ea["data"]["episodes"], selectedOnly ? _0x46a1ea["selectedScriptEpisodeIds"] : []);
    if (!_0x2bc08f['length']) {
      _0x49e2b8(selectedOnly ? '请选择从下一集开始的连续分集。' : "没有待生成的分集剧本。", "info");
      return ![];
    }
    _0x46a1ea["isBatchGeneratingScripts"] = !![];
    _0x46a1ea["scriptGenerationFocusMode"] = !![];
    const _0x3b225d = _0x3e5ebf(_0x46a1ea);
    const _0x477ff3 = _0x3b225d["data"];
    const _0x322a4a = _0x59cf66("episode-scripts", {
      'total': _0x2bc08f["length"],
      'completed': 0x0,
      'targetEpisodeIds': _0x2bc08f["map"](_0x36e966 => _0x36e966['id']),
      'pendingEpisodeIds': _0x2bc08f["map"](_0xd8fd01 => _0xd8fd01['id']),
      'label': '批量生成\x200/' + _0x2bc08f["length"]
    });
    _0x46a1ea["episodeScriptBatchId"] = _0x322a4a['id'];
    _0x46a1ea["episodeScriptBatchCancelRequested"] = ![];
    _0x1b714e("writing-episode-scripts", "准备按顺序生成 " + _0x2bc08f["length"] + '\x20集');
    let _0x5c1cf5 = 0x0;
    try {
      const _0x155727 = await runStoryEpisodeScriptBatchQueue({
        'targets': _0x2bc08f,
        'batchId': _0x322a4a['id'],
        'isLive': () => _0x4d0c22(_0x3b225d),
        'isCancellationRequested': _0x1c9c34 => _0x3f6927['isRequested'](_0x1c9c34),
        'beforeTarget': ({
          target: _0x541640,
          completed: _0x26c211,
          total: _0x1c9cb7,
          pendingTargets: _0x3dfe93
        }) => {
          const _0x304f69 = _0x477ff3["episodes"]["findIndex"](_0x53e3a8 => _0x53e3a8['id'] === _0x541640['id']);
          const _0x2ae114 = "正在生成第 " + (_0x304f69 + 0x1) + '\x20集\x20·\x20' + (_0x26c211 + 0x1) + '/' + _0x1c9cb7;
          _0x378c9d(_0x3b225d, _0x322a4a, {
            'completed': _0x26c211,
            'pendingEpisodeIds': _0x3dfe93['map'](_0x21f401 => _0x21f401['id']),
            'label': _0x2ae114
          });
          _0x30dd2e(_0x3b225d) && (_0x46a1ea["generatingEpisodeScriptId"] = _0x541640['id'], _0x46a1ea["episodeScriptGenerationStatus"] = _0x2ae114, _0x325d8d());
        },
        'runTarget': async _0x4ec52e => {
          const _0x1bd93f = _0x477ff3["episodes"]["findIndex"](_0x105eef => _0x105eef['id'] === _0x4ec52e['id']);
          return _0x5eac7c(_0x477ff3['episodes'][_0x1bd93f], _0x3b225d, {
            'batch': _0x322a4a
          });
        },
        'afterTarget': ({
          completed: _0x52d574,
          total: _0x4ff28c,
          pendingTargets: _0x4ffcee,
          cancelRequested: _0x557868
        }) => {
          _0x5c1cf5 = _0x52d574;
          _0x378c9d(_0x3b225d, _0x322a4a, {
            'completed': _0x5c1cf5,
            'cancelRequested': _0x557868,
            'pendingEpisodeIds': _0x4ffcee['map'](_0x34f58d => _0x34f58d['id']),
            'label': _0x557868 ? "批量生成已停止 · 完成 " + _0x5c1cf5 + '/' + _0x4ff28c : "批量生成 " + _0x5c1cf5 + '/' + _0x4ff28c
          });
        }
      });
      if (_0x155727['status'] === 'interrupted') {
        return ![];
      }
      if (_0x155727["status"] === 'cancelled') {
        _0x165554(_0x155727['cancelled'] ? "当前集已完成，已取消剩余 " + _0x155727["cancelled"] + " 集排队。" : "当前集已完成，批量生成已停止。", _0x3b225d, {
          'step': 0x1,
          'outlineSectionId': "episodes"
        });
        _0x30dd2e(_0x3b225d) && (_0x46a1ea["scriptSelectionMode"] = ![], _0x46a1ea["selectedScriptEpisodeIds"] = []);
        return !![];
      }
      _0x165554("已按顺序完成 " + _0x5c1cf5 + '\x20集完整剧本。', _0x3b225d, {
        'step': 0x1,
        'outlineSectionId': "episodes"
      });
      _0x30dd2e(_0x3b225d) && (_0x46a1ea["scriptSelectionMode"] = ![], _0x46a1ea['selectedScriptEpisodeIds'] = []);
      return !![];
    } catch (_0x3d57a8) {
      if (!_0x4d0c22(_0x3b225d)) {
        return ![];
      }
      reportStoryWorkspaceApiError("write-episode-scripts-batch", _0x3d57a8, {
        'model': _0x46a1ea["models"]["text"],
        'provider': _0x46a1ea["textProvider"],
        'completed': _0x5c1cf5
      });
      _0x255bec("已完成 " + _0x5c1cf5 + " 集；" + (_0x3d57a8?.["message"] || '后续分集生成失败。'), "error", _0x3d57a8);
      return ![];
    } finally {
      _0x3f6927["clear"](_0x322a4a['id']);
      _0x30dd2e(_0x3b225d) && (_0x46a1ea["isBatchGeneratingScripts"] = ![], _0x46a1ea['generatingEpisodeScriptId'] = '', _0x46a1ea["episodeScriptBatchId"] = '', _0x46a1ea["episodeScriptBatchCancelRequested"] = ![], _0x46a1ea['episodeScriptGenerationStatus'] = '', _0x46a1ea["storyPlanningOperation"] = '', _0x46a1ea["storyPlanningStatus"] = '', _0x325d8d());
    }
  }
  async function _0x43f9b8(_0x2f654b) {
    if (_0x46a1ea["storyPlanningOperation"]) {
      return ![];
    }
    if (_0x46a1ea['data']["project"]?.["sourceMode"] === "upload-original") {
      _0x49e2b8("上传剧本保持原稿，不支持 AI 扩写分集正文。", "info");
      return ![];
    }
    const _0xb9f8d3 = _0x46a1ea["data"]["episodes"]["findIndex"](_0x4ccd8a => _0x4ccd8a['id'] === _0x2f654b);
    if (_0xb9f8d3 < 0x0 || !normalizeText(_0x46a1ea['data']['episodes'][_0xb9f8d3]?.["script"]?.["fullText"])) {
      _0x49e2b8("当前分集正文尚未生成。", "info");
      return ![];
    }
    return _0x32896f(_0x2f654b, {
      'regeneration': !![]
    });
  }
  function _0x2b8472(_0x366594) {
    const _0xff2c0e = getNextStoryEpisodeScriptIndex(_0x46a1ea["data"]['episodes']);
    const _0x143486 = _0x46a1ea['data']["episodes"]['findIndex'](_0x4d4d92 => _0x4d4d92['id'] === _0x366594);
    if (_0x143486 < _0xff2c0e || _0x143486 < 0x0) {
      return ![];
    }
    const _0xe05917 = _0x46a1ea["selectedScriptEpisodeIds"]["includes"](_0x366594);
    const _0x3de2a9 = _0xe05917 ? _0x143486 : _0x143486 + 0x1;
    _0x46a1ea["selectedScriptEpisodeIds"] = _0x46a1ea['data']['episodes']["slice"](_0xff2c0e, _0x3de2a9)['map'](_0x5b2c56 => _0x5b2c56['id']);
    _0x325d8d();
    return !![];
  }
  const _0x23e2f3 = createStoryEpisodeSplitWorkspaceController({
    'state': _0x46a1ea,
    'windowObject': windowObject,
    'operations': {
      'recoverDraft': recoverEpisodeSplitDraft,
      'review': reviewEpisodeSplit,
      'splitExperimental': splitEpisodeExperimental,
      'splitStandard': splitEpisode
    },
    'projectTasks': _0x3a6583,
    'persistence': {
      'isDurableRequired': () => typeof saveWorkspace === "function" && _0x3654ac['isReady'](),
      'persistNow': _0x1c9431,
      'schedule': _0x18eeff
    },
    'presentation': {
      'getGenerationControl': _0x5e98b2 => getStoryEpisodeGenerationControlState(_0x46a1ea, _0x5e98b2),
      'notifyComplete': _0x165554,
      'notifyGenerationResult': _0x95f5c4,
      'openEpisode': (..._0x1c3399) => _0x3a3838(..._0x1c3399),
      'render': (..._0x1a3f20) => _0x325d8d(..._0x1a3f20),
      'requestChoice': _0xd9145d,
      'showTaskResult': _0x255bec,
      'showToast': _0x49e2b8
    },
    'getPlanningContext': _0x4b2df7
  });
  const {
    cancelBatch: _0x7d037e,
    recoverDraft: _0x48dc3b,
    splitBatch: _0x379a49,
    splitEpisode: _0x6bbe9a,
    splitEpisodeExperimental: _0x16b2e7
  } = _0x23e2f3;
  async function _0x4c50e1() {
    if (!isStoryEpisodeExperimentalSplitAvailable(windowObject)) {
      return ![];
    }
    if (_0x46a1ea["storyPlanningOperation"]) {
      return ![];
    }
    if (typeof planEpisodes !== "function") {
      _0x49e2b8("分集规划 Agent 尚未初始化。", "error");
      return ![];
    }
    const _0x54c864 = normalizeStoryWorkspaceAssetData(_0x222ace(_0x46a1ea['data']));
    const _0x2359ab = _0x4b2df7(_0x54c864);
    try {
      const _0x38ccd2 = () => captureStoryRequestPayload(_0x5d5097 => planEpisodes({
        'project': _0x2359ab["project"],
        'constraints': _0x2359ab["project"]["planning"],
        'model': _0x2359ab['model'],
        'provider': _0x2359ab["provider"],
        'providerProfileId': _0x2359ab["providerProfileId"],
        'request': _0x5d5097
      }));
      openStoryRequestDebugPreview({
        'documentObject': documentObject,
        'windowObject': windowObject,
        'preparePayload': _0x38ccd2,
        'title': '分集大纲请求调试',
        'subtitle': '以下是点击“生成分集大纲”后构造的实际请求；本次仅预览，不会发送到\x20API。'
      });
      return !![];
    } catch (_0x60770e) {
      reportStoryWorkspaceApiError("debug-episode-outline-request", _0x60770e);
      _0x49e2b8(_0x60770e?.["message"] || "分集大纲调试请求构建失败。", "error");
      return ![];
    }
  }
  async function _0x193fa2() {
    if (!isStoryEpisodeExperimentalSplitAvailable(windowObject)) {
      return ![];
    }
    if (_0x46a1ea["storyPlanningOperation"]) {
      return ![];
    }
    if (typeof generateEpisodeScript !== 'function') {
      _0x49e2b8("完整分集剧本 Agent 尚未初始化。", "error");
      return ![];
    }
    const _0x2209fe = normalizeStoryWorkspaceAssetData(_0x222ace(_0x46a1ea["data"]));
    const _0x4a53e6 = getNextStoryEpisodeScriptIndex(_0x2209fe['episodes']);
    const _0x5105e0 = _0x2209fe["episodes"][_0x4a53e6];
    if (!_0x5105e0) {
      _0x49e2b8('没有待生成的分集正文。', "info");
      return ![];
    }
    const _0x40094e = _0x4b2df7(_0x2209fe);
    try {
      const _0x365e1f = () => captureStoryRequestPayload(_0x21bade => generateEpisodeScript({
        'project': _0x40094e["project"],
        'episode': _0x5105e0,
        'previousEpisode': _0x4a53e6 > 0x0 ? _0x2209fe["episodes"][_0x4a53e6 - 0x1] : null,
        'nextEpisode': _0x2209fe["episodes"][_0x4a53e6 + 0x1] || null,
        'model': _0x40094e["model"],
        'provider': _0x40094e["provider"],
        'providerProfileId': _0x40094e["providerProfileId"],
        'request': _0x21bade
      }));
      openStoryRequestDebugPreview({
        'documentObject': documentObject,
        'windowObject': windowObject,
        'preparePayload': _0x365e1f,
        'title': '第\x20' + (_0x5105e0['number'] || _0x4a53e6 + 0x1) + " 集正文请求调试",
        'subtitle': "以下是下一集正文生成时构造的实际请求；本次仅预览，不会发送到 API。"
      });
      return !![];
    } catch (_0x62c712) {
      reportStoryWorkspaceApiError('debug-episode-script-request', _0x62c712, {
        'episodeId': _0x5105e0['id']
      });
      _0x49e2b8(_0x62c712?.['message'] || "分集正文调试请求构建失败。", 'error');
      return ![];
    }
  }
  async function _0x48ed5a() {
    if (!isStoryAssetExperimentalExtractionAvailable(windowObject)) {
      return ![];
    }
    if (_0x46a1ea['storyPlanningOperation']) {
      return ![];
    }
    if (typeof extractAssetsExperimental !== "function") {
      _0x49e2b8("混合素材开发测试尚未初始化。", "error");
      return ![];
    }
    const _0x2c594f = normalizeStoryWorkspaceAssetData(_0x222ace(_0x46a1ea['data']));
    const _0x384db7 = _0x4b2df7(_0x2c594f);
    try {
      const _0x3881fd = () => captureStoryRequestPayload(_0x1d6431 => extractAssetsExperimental({
        ..._0x384db7,
        'episodes': _0x2c594f["episodes"],
        'resumeDraft': _0x2c594f["experimentalAssetExtractionDraft"],
        'preferLocal': ![],
        'request': _0x1d6431
      }));
      openStoryRequestDebugPreview({
        'documentObject': documentObject,
        'windowObject': windowObject,
        'preparePayload': _0x3881fd,
        'title': '混合素材抽取\x20API\x20请求调试',
        'subtitle': "以下是开发链路构造的首个 API 请求；中短剧本预览角色专用请求，超长剧本因本次不运行本地模型而预览备用分批请求。仅供调试，不会发送到 API。"
      });
      return !![];
    } catch (_0x4e1db2) {
      reportStoryWorkspaceApiError("debug-asset-extraction-experimental-request", _0x4e1db2);
      _0x49e2b8(_0x4e1db2?.["message"] || "混合素材抽取调试请求构建失败。", 'error');
      return ![];
    }
  }
  async function _0x23c461(_0xba3925, _0x1bdf00 = !![]) {
    if (!isStoryEpisodeExperimentalSplitAvailable(windowObject)) {
      return ![];
    }
    const _0x302dba = getStoryEpisodeGenerationControlState(_0x46a1ea, _0xba3925);
    if (_0x302dba["disabled"]) {
      return ![];
    }
    const _0x409ca3 = _0x1bdf00 ? splitEpisodeExperimental : splitEpisode;
    if (typeof _0x409ca3 !== "function") {
      _0x49e2b8("实验分批拆分 Agent 尚未初始化。", 'error');
      return ![];
    }
    const _0x502cab = normalizeStoryWorkspaceAssetData(_0x222ace(_0x46a1ea["data"]));
    const _0x24fe1d = _0x502cab['episodes']["find"](_0x2abd7f => _0x2abd7f['id'] === _0xba3925);
    if (!_0x24fe1d) {
      return ![];
    }
    const _0x369780 = _0x4b2df7(_0x502cab);
    const _0xdd2fdd = _0x502cab["episodes"]["findIndex"](_0x452e43 => _0x452e43['id'] === _0x24fe1d['id']);
    const _0x40a9aa = _0xdd2fdd > 0x0 ? _0x502cab["episodes"][_0xdd2fdd - 0x1] : null;
    const _0x30a3b5 = _0xdd2fdd >= 0x0 ? _0x502cab['episodes'][_0xdd2fdd + 0x1] || null : null;
    const _0x50f957 = _0x24fe1d?.["experimentalSplitDraft"]?.["status"] === "completed" ? null : _0x24fe1d?.["experimentalSplitDraft"] || null;
    try {
      const _0x29716a = () => captureStoryRequestPayload(_0x3b14a7 => _0x409ca3({
        'project': _0x369780['project'],
        'episode': _0x24fe1d,
        'previousEpisode': _0x40a9aa,
        'nextEpisode': _0x30a3b5,
        'assets': _0x502cab["assets"],
        'constraints': _0x369780['project']["planning"],
        'model': _0x369780['model'],
        'provider': _0x369780["provider"],
        'providerProfileId': _0x369780["providerProfileId"],
        'promptExperiment': _0x1bdf00,
        'resumeDraft': _0x50f957,
        'request': _0x3b14a7
      }));
      openStoryRequestDebugPreview({
        'documentObject': documentObject,
        'windowObject': windowObject,
        'preparePayload': _0x29716a,
        'title': '第\x20' + (_0x24fe1d["number"] || '') + " 集请求调试",
        'subtitle': "下一次分镜生成构造的请求；本次仅预览，不会发送到 API。"
      });
      return !![];
    } catch (_0xa6da64) {
      reportStoryWorkspaceApiError("debug-experimental-split-request", _0xa6da64, {
        'episodeId': _0x24fe1d['id']
      });
      _0x49e2b8(_0xa6da64?.["message"] || "调试请求构建失败。", "error");
      return ![];
    }
  }
  const _0x2f57a8 = createStoryClipProductionWorkspaceController({
    'state': _0x46a1ea,
    'root': _0x329e8d,
    'documentObject': documentObject,
    'windowObject': windowObject,
    'activeControllers': _0x291db1,
    'projectTasks': {
      'createToken': () => _0x3e5ebf(_0x46a1ea),
      'isLive': _0x4d0c22,
      'isCurrent': _0x30dd2e,
      'register': _0x492bef,
      'createBatch': _0x59cf66,
      'syncBatch': _0x378c9d
    },
    'createGenerationController': _0x199b54,
    'render': _0x325d8d,
    'refreshGeneration': _0x2bc6c6,
    'persistWorkspaceNow': _0x1c9431,
    'schedulePersistence': _0x18eeff,
    'showToast': _0x49e2b8,
    'showTaskApiKeyError': _0x1a8749,
    'showTaskResultToast': _0x255bec,
    'showNavigableTaskResultToast': _0x351b79,
    'notifyNavigableGenerationComplete': _0x95f5c4
  });
  const {
    generateSelection: _0x3f0eb3,
    runtime: _0x4b9463
  } = _0x2f57a8;
  async function _0x3e0a11(_0x27c0ca, _0x4af836 = null) {
    const _0x3f4f6f = getSelectedEpisode(_0x46a1ea);
    const _0x32dcdb = getSelectedClip(_0x46a1ea, _0x3f4f6f);
    if (!_0x3f4f6f || _0x27c0ca === 'current' && !_0x32dcdb) {
      _0x49e2b8('请先选择要导出的片段。', "warn");
      return ![];
    }
    const _0x250012 = _0x4af836?.['disabled'] === !![];
    if (_0x4af836 && "disabled" in _0x4af836) {
      _0x4af836["disabled"] = !![];
    }
    syncStoryAsyncButton(_0x4af836, !![]);
    try {
      const _0x51f8f3 = await exportStoryClipVideos({
        'project': _0x46a1ea['data']["project"],
        'episode': _0x3f4f6f,
        'clip': _0x32dcdb,
        'mode': _0x27c0ca
      });
      if (_0x51f8f3?.["canceled"]) {
        return ![];
      }
      if (!_0x51f8f3?.["success"]) {
        throw new Error(_0x51f8f3?.['error'] || _0x51f8f3?.["message"] || "视频片段导出失败。");
      }
      const _0x3d8569 = Math["max"](0x0, Number(_0x51f8f3["exportedCount"]) || 0x0);
      const _0x2f294c = Math["max"](0x0, Number(_0x51f8f3['skippedCount']) || 0x0);
      _0x49e2b8(_0x2f294c ? "已导出 " + _0x3d8569 + " 个片段，跳过 " + _0x2f294c + " 个无可用视频的片段。" : _0x27c0ca === "current" ? "当前片段已导出。" : '已导出本集\x20' + _0x3d8569 + " 个片段。", "success");
      return !![];
    } catch (_0xf8ee10) {
      _0x49e2b8(_0xf8ee10?.["message"] || "视频片段导出失败。", "error");
      return ![];
    } finally {
      syncStoryAsyncButton(_0x4af836, ![]);
      if (_0x4af836 && "disabled" in _0x4af836) {
        _0x4af836["disabled"] = _0x250012;
      }
    }
  }
  async function _0xd62ad3(_0x273333) {
    const _0x8ba042 = getSelectedStoryAsset(_0x46a1ea, getVisibleStoryAssets(_0x46a1ea));
    const _0x484014 = _0x8ba042 ? getSelectedAssetAppearance(_0x46a1ea, _0x8ba042) : null;
    const _0x3a359a = normalizeText(_0x484014?.["imageUrl"]);
    if (!_0x8ba042 || !_0x484014 || !_0x3a359a) {
      _0x49e2b8("当前没有可下载的图片。", "warn");
      return ![];
    }
    const _0x58a58b = normalizeText(_0x484014["name"]);
    const _0x1b7808 = normalizeText(_0x8ba042["name"]) || "生成图片";
    const _0x5e9779 = _0x58a58b && _0x58a58b !== _0x1b7808 && _0x58a58b !== "基础形象" ? [_0x1b7808, _0x58a58b]['join']('-') : _0x1b7808;
    try {
      syncStoryAsyncButton(_0x273333, !![], {
        'spinnerOnly': !![]
      });
      const _0x540e77 = await runWorkspaceImageDownloadAction(_0x273333, () => saveWorkspaceImageDownload({
        'imageRef': _0x3a359a,
        'filenameBase': _0x5e9779,
        'saveMedia': saveMedia
      }));
      if (!_0x540e77 || _0x540e77["canceled"]) {
        return ![];
      }
      if (_0x540e77['success'] === ![]) {
        throw new Error(_0x540e77["error"] || "图片下载失败，请稍后重试。");
      }
      _0x49e2b8("图片已保存。", "success");
      return !![];
    } catch (_0x114272) {
      _0x49e2b8(_0x114272?.["message"] || "图片下载失败，请稍后重试。", "error");
      return ![];
    } finally {
      syncStoryAsyncButton(_0x273333, ![]);
    }
  }
  async function _0x16077c() {
    const _0x43569e = findStoryAsset(_0x46a1ea, _0x46a1ea['selectedAssetId']);
    const _0x489868 = _0x43569e ? getSelectedAssetAppearance(_0x46a1ea, _0x43569e) : null;
    if (!_0x43569e || !_0x489868 || _0x43569e['isLibraryAsset']) {
      _0x49e2b8('当前形象不可加入总素材。', "warn");
      return ![];
    }
    if (!normalizeText(_0x489868["imageUrl"])) {
      _0x49e2b8('请先生成或上传当前形象。', "warn");
      return ![];
    }
    if (typeof saveAssetPackageItem !== 'function') {
      _0x49e2b8('总素材服务尚未初始化。', 'error');
      return ![];
    }
    const _0x40d6df = _0x43569e['id'] + ':' + _0x489868['id'];
    if (normalizeText(_0x46a1ea["exportingAssetAppearanceKey"]) === _0x40d6df) {
      return ![];
    }
    const _0x2e80f5 = _0x3e5ebf(_0x46a1ea);
    const _0x3cec21 = _0x329e8d["querySelector"](".story-page.is-current .story-asset-detail .story-asset-preview");
    const _0x40e220 = _0x3cec21?.["getBoundingClientRect"]?.() || null;
    let _0x5a4704 = ![];
    _0x46a1ea["exportingAssetAppearanceKey"] = _0x40d6df;
    _0x325d8d();
    try {
      let _0x49df4a = buildStoryAssetPackageItemRequest({
        'project': _0x2e80f5["data"]["project"],
        'asset': _0x43569e,
        'appearance': _0x489868
      });
      const _0x3e744a = normalizeText(_0x49df4a["image"]?.["imageUrl"] || _0x489868["imageUrl"]);
      const _0x3fe0bf = Boolean(normalizeText(_0x49df4a["image"]?.['localPath'] || _0x49df4a['image']?.["originalLocalPath"] || _0x49df4a["image"]?.["displayLocalPath"]));
      if (!_0x3fe0bf && /^(?:https?:|blob:|data:)/i["test"](_0x3e744a)) {
        const _0x1066b4 = await saveOutputFromUrl(_0x3e744a, {
          'kind': 'image',
          'ext': "png",
          'dedupeKey': ["story-asset-package", normalizeText(_0x2e80f5['projectId']), normalizeText(_0x43569e['id']), normalizeText(_0x489868['id']), _0x3e744a]["join"](':')
        });
        if (_0x1066b4?.['error']) {
          throw new Error(_0x1066b4["error"]);
        }
        const _0x7efc7d = normalizeText(_0x1066b4?.['displayUrl'] || _0x1066b4?.["url"] || _0x1066b4?.['originalUrl'] || _0x1066b4?.["thumbUrl"]);
        if (!_0x7efc7d) {
          throw new Error("保存当前形象失败：缺少稳定图片地址。");
        }
        _0x49df4a = buildStoryAssetPackageItemRequest({
          'project': _0x2e80f5["data"]["project"],
          'asset': _0x43569e,
          'appearance': _0x489868,
          'image': {
            ..._0x49df4a["image"],
            ...(_0x1066b4 && typeof _0x1066b4 === "object" ? _0x1066b4 : {}),
            'imageUrl': _0x7efc7d
          }
        });
      }
      const _0xf92be2 = await saveAssetPackageItem(_0x49df4a);
      if (!_0x4d0c22(_0x2e80f5)) {
        return ![];
      }
      const _0x6ceea4 = normalizeText(_0xf92be2?.["imageUrl"] || _0x49df4a["image"]?.['imageUrl']);
      _0x6ceea4 && (_0x489868["imageUrl"] = _0x6ceea4);
      _0x489868["totalAssetRef"] = {
        'assetId': normalizeText(_0xf92be2?.["assetId"]),
        'itemIndex': Math["max"](0x0, Math["trunc"](Number(_0xf92be2?.["itemIndex"]) || 0x0)),
        'itemKey': _0x49df4a["itemKey"],
        'imageUrl': _0x6ceea4,
        'updatedAt': Date['now']()
      };
      _0x18eeff({
        'immediate': !![]
      });
      _0x49e2b8(_0xf92be2?.['itemCreated'] === ![] ? '已更新总素材中的当前形象。' : "当前形象已加入总素材。", "success");
      _0x5a4704 = !![];
      return !![];
    } catch (_0x37f51d) {
      _0x4d0c22(_0x2e80f5) && _0x49e2b8(_0x37f51d?.['message'] || "加入总素材失败，请稍后重试。", 'error');
      return ![];
    } finally {
      _0x30dd2e(_0x2e80f5) && (_0x46a1ea["exportingAssetAppearanceKey"] = '', _0x325d8d(), _0x5a4704 && _0x3cec21 && _0x40e220 && playAssetCreateFly({
        'fromRect': _0x40e220,
        'contentElement': _0x3cec21,
        'toElement': _0x329e8d["querySelector"]("[data-story-asset-filter=\"library\"]"),
        'documentObject': documentObject,
        'windowObject': windowObject
      }));
    }
  }
  function _0x3ae2fd(_0x119390 = '', _0x4ac01d = '', _0x4c69ef = ![], _0x238705 = null) {
    const _0x95ad5f = findStoryAsset(_0x46a1ea, _0x119390);
    if (!_0x95ad5f) {
      _0x49e2b8("请选择本剧已有的角色、场景或道具。", 'warn');
      return ![];
    }
    const _0x522d69 = getVisibleStoryAssets(_0x46a1ea);
    const _0x3a4264 = _0x238705 || getStoryLibraryActionAssetIds(_0x46a1ea, _0x522d69);
    if (normalizeText(_0x4ac01d) && _0x3a4264["length"] !== 0x1) {
      _0x49e2b8("替换已有形象时只能选择一张总素材图片。", "warn");
      return ![];
    }
    const _0x47ef66 = addStoryLibraryAssetsToProject(_0x46a1ea["data"]["assets"], _0x522d69, _0x3a4264, _0x95ad5f['id'], {
      'targetAppearanceId': _0x4ac01d,
      'createAppearance': _0x4c69ef
    });
    const _0x521094 = [..._0x47ef66["updatedAppearanceIds"], ..._0x47ef66["existingAssetIds"], ..._0x47ef66["addedAssetIds"]];
    if (!_0x521094["length"]) {
      _0x49e2b8("请选择总素材中的图片后再加入项目。", "warn");
      return ![];
    }
    _0x2c03e7();
    _0x46a1ea["data"]['assets'] = _0x47ef66['assets'];
    const _0x20b83f = findStoryAsset(_0x46a1ea, _0x95ad5f['id']);
    const _0x38f22a = _0x521094['at'](-0x1) || '';
    const _0x39fed4 = getStoryAssetAppearances(_0x20b83f)["findIndex"](_0x1ff33f => normalizeText(_0x1ff33f?.['id']) === _0x38f22a);
    applyStoryLibraryAdditionUiState(_0x46a1ea, {
      'targetAssetId': _0x95ad5f['id'],
      'selectedAppearanceIndex': _0x39fed4
    });
    _0x325d8d();
    _0x18eeff({
      'immediate': !![]
    });
    if (_0x47ef66["updatedAppearanceIds"]["length"]) {
      _0x49e2b8('已更新' + _0x95ad5f["name"] + "的所选形象。", "success");
    } else {
      _0x47ef66["addedAssetIds"]["length"] ? _0x49e2b8('已为' + _0x95ad5f["name"] + "新增 " + _0x47ef66["addedAssetIds"]["length"] + " 个形象。", "success") : _0x49e2b8('所选图片已在' + _0x95ad5f['name'] + "的形象中。", "info");
    }
    return !![];
  }
  function _0x3841b3(_0x3aa5b1, _0x299845 = _0x46a1ea["selectedAssetId"]) {
    const _0x4aa5cb = findStoryAsset(_0x46a1ea, _0x299845);
    const _0x2ced55 = _0x4aa5cb ? getStoryAssetAppearances(_0x4aa5cb) : [];
    if (_0x2ced55['length'] < 0x2) {
      return;
    }
    const _0x44b178 = getSelectedAssetAppearanceIndex(_0x46a1ea, _0x4aa5cb);
    const _0x2a7157 = (_0x44b178 + _0x3aa5b1 + _0x2ced55["length"]) % _0x2ced55['length'];
    _0x46a1ea["assetAppearanceIndexes"] = {
      ..._0x46a1ea["assetAppearanceIndexes"],
      [_0x4aa5cb['id']]: _0x2a7157
    };
    _0x46a1ea['pendingDeleteAssetAppearanceKey'] = '';
    _0x46a1ea["assetAppearanceMotion"] = _0x3aa5b1 > 0x0 ? "next" : 'previous';
    const _0x5b27dc = [..._0x329e8d['querySelectorAll']('.story-asset-card[data-story-asset-id]')]["find"](_0x4727ce => _0x4727ce["dataset"]["storyAssetId"] === _0x299845);
    if (_0x5b27dc) {
      const _0x3f56e6 = documentObject['createElement']('div');
      _0x3f56e6["innerHTML"] = renderStoryAssetCard(_0x46a1ea, _0x4aa5cb);
      const _0x58d9a9 = _0x5b27dc["querySelector"](".story-replacement-comparison") ? ".story-replacement-comparison > span:last-child" : '.story-asset-card-media';
      _0x5b27dc["querySelector"](_0x58d9a9)["innerHTML"] = _0x3f56e6["querySelector"](_0x58d9a9)["innerHTML"];
      _0x5b27dc["querySelector"](".story-asset-card-copy")['innerHTML'] = _0x3f56e6["querySelector"](".story-asset-card-copy")['innerHTML'];
      const _0xec8816 = _0x5b27dc["parentElement"]["querySelector"]("[data-story-action=\"request-delete-asset-appearance\"]");
      if (_0xec8816) {
        _0xec8816["disabled"] = _0x3f56e6['querySelector']("[data-story-action=\"request-delete-asset-appearance\"]")["disabled"];
      }
    }
    if (_0x299845 === _0x46a1ea['selectedAssetId'] && !_0x3c03fa()) {
      _0x325d8d();
    }
    _0x46a1ea["assetAppearanceMotion"] = '';
    _0x18eeff({
      'uiOnly': !![]
    });
  }
  function _0x44ce09(_0x460975) {
    const _0x227fb9 = _0x460975["target"]["closest"]?.("[data-story-appearance-wheel=\"true\"], [data-story-card-appearance-wheel]");
    if (!_0x227fb9 || _0x46a1ea["view"] !== "project" || _0x46a1ea["step"] !== 0x2) {
      return ![];
    }
    for (let _0x1fc0b4 = _0x460975["target"]; _0x1fc0b4 && _0x1fc0b4 !== _0x227fb9; _0x1fc0b4 = _0x1fc0b4["parentElement"]) {
      if (hasWorkspaceScrollableOverflow(_0x1fc0b4, windowObject["getComputedStyle"](_0x1fc0b4))) {
        return ![];
      }
    }
    _0x460975["preventDefault"]();
    const _0x2c82b3 = consumeStoryWheelDirection(_0x460975, _0xa6b14f);
    if (_0x2c82b3) {
      _0x3841b3(_0x2c82b3, _0x227fb9["dataset"]["storyCardAppearanceWheel"] || _0x46a1ea['selectedAssetId']);
    }
    return !![];
  }
  const _0x5d875f = createStoryClipResultSelectionController({
    'state': _0x46a1ea,
    'viewport': _0x1f811e,
    'documentObject': documentObject,
    'getSelectedEpisode': getSelectedEpisode,
    'getSelectedClip': getSelectedClip,
    'resetAdjustmentUi': _0x49275d,
    'applyVideoSettings': _0x180373,
    'refreshSelectedClip': _0x348dde,
    'refreshSelectedVideoResult': _0xda21ad,
    'refreshHistory': _0x34cce9 => _0x574db0?.['refresh']?.(_0x34cce9),
    'hideHistory': _0x2f87a6,
    'render': _0x325d8d,
    'schedulePersistence': _0x18eeff
  });
  const {
    deleteVideoResult: _0x1e3076,
    handleNavigationWheel: _0x1ea306,
    selectVideoResult: _0x34de48,
    switchSelectedClip: _0x3590ea,
    switchSelectedVideoResult: _0x14206a
  } = _0x5d875f;
  function _0x19eb45(_0x379279) {
    if (!_0x379279?.['closest']?.('.story-page')?.["classList"]["contains"]('is-current')) {
      return null;
    }
    const _0x6681b5 = normalizeText(_0x379279?.["dataset"]?.['storyMarqueeSurface']);
    if (_0x6681b5 === "assets") {
      return {
        'enabled': _0x46a1ea["view"] === "project" && _0x46a1ea['step'] === 0x2 && !_0x46a1ea["isBatchGenerating"],
        'selectedIds': _0x46a1ea['selectedAssetIds'],
        'commit'(_0x4a8513) {
          _0x46a1ea['selectedAssetIds'] = _0x46a1ea["assetFilter"] === "library" ? _0x4a8513["filter"](_0x17a8cc => {
            const _0x5dea22 = getVisibleStoryAssets(_0x46a1ea)["find"](_0x2a5455 => normalizeText(_0x2a5455?.['id']) === normalizeText(_0x17a8cc));
            return normalizeText(_0x5dea22?.["mediaKind"])["toLowerCase"]() === 'image' && normalizeText(_0x5dea22?.["sourceUrl"] || _0x5dea22?.["imageUrl"]);
          }) : _0x4a8513;
          _0x46a1ea['assetSelectionMode'] = _0x46a1ea["selectedAssetIds"]["length"] > 0x0;
          _0x325d8d();
        }
      };
    }
    if (_0x6681b5 === "episodes") {
      return {
        'enabled': _0x46a1ea["view"] === "project" && _0x46a1ea["step"] === 0x3 && !getStoryEpisodeBatchControlState(_0x46a1ea)["disabled"],
        'selectedIds': _0x46a1ea["selectedEpisodeIds"],
        'commit'(_0x641ed0) {
          _0x46a1ea["episodeSelectionMode"] = !![];
          _0x46a1ea["selectedEpisodeIds"] = _0x641ed0;
          _0x325d8d();
        }
      };
    }
    if (_0x6681b5 === "clips") {
      const _0x311f16 = storyClipProduction["getGenerationState"](_0x46a1ea, getSelectedEpisode(_0x46a1ea));
      return {
        'enabled': _0x46a1ea["view"] === "episode" && !_0x311f16["isBatchGenerating"],
        'selectedIds': _0x46a1ea["selectedClipGenerationIds"],
        'commit'(_0x24d9a6) {
          const _0x4b6a82 = new Set(_0x311f16['generatingClipIds']);
          _0x46a1ea["pendingDeleteClipId"] = '';
          _0x46a1ea["clipSelectionMode"] = !![];
          _0x46a1ea["selectedClipGenerationIds"] = _0x24d9a6["filter"](_0x49c1cd => !_0x4b6a82["has"](normalizeText(_0x49c1cd)));
          _0x285a4f();
          _0x36221b();
        }
      };
    }
    return null;
  }
  const _0x4f29a0 = createStoryMarqueeSelectionController({
    'root': _0x329e8d,
    'documentObject': documentObject,
    'windowObject': windowObject,
    'getConfig': _0x19eb45,
    'onActivate': _0x1149d8
  });
  const _0x23b2fd = ["[data-story-marquee-item]", 'button', "a[href]", 'input', "textarea", "select", "label", 'img', "video", "audio", "canvas", "[contenteditable='true']", "[role='button']", "[role='option']", "[role='menuitem']", '[role=\x27slider\x27]', "[tabindex]"]["join"](',');
  function _0x4d9c6e(_0x357570) {
    const _0x199a6c = _0x1f811e['querySelector']('.story-page.is-current');
    const _0x30deea = _0x357570?.['target'];
    if (!_0x199a6c?.["contains"](_0x30deea) || !_0x30deea?.["closest"]) {
      return ![];
    }
    if (_0x30deea['closest'](_0x23b2fd)) {
      return ![];
    }
    if (_0x46a1ea["view"] === "project" && _0x46a1ea['step'] === 0x2 && _0x46a1ea["assetSelectionMode"] && !_0x46a1ea["isBatchGenerating"]) {
      _0x46a1ea["assetSelectionMode"] = ![];
      _0x46a1ea["selectedAssetIds"] = [];
      _0x325d8d();
    } else {
      if (_0x46a1ea["view"] === "project" && _0x46a1ea['step'] === 0x3 && _0x46a1ea["episodeSelectionMode"]) {
        _0x46a1ea["episodeSelectionMode"] = ![];
        _0x46a1ea["selectedEpisodeIds"] = [];
        _0x325d8d();
      } else {
        if (_0x46a1ea["view"] === "episode" && _0x46a1ea["clipSelectionMode"]) {
          _0x46a1ea["clipSelectionMode"] = ![];
          _0x46a1ea['selectedClipGenerationIds'] = [];
          _0x36221b();
        } else {
          return ![];
        }
      }
    }
    _0x4f29a0['cancel']();
    return !![];
  }
  const _0x2b5186 = createStoryWorkspaceNavigationTransaction({
    'state': _0x46a1ea,
    'toolbarEl': _0x1363a3,
    'windowObject': windowObject,
    'renderAdapter': {
      'render': _0x325d8d,
      'renderToolbar': _0x3450fa,
      'capturePageState': _0x2b902c
    },
    'onClipSelected': _0x42ff41,
    'onCommit': () => _0x18eeff({
      'uiOnly': !![]
    }),
    'notify': _0x49e2b8
  });
  async function _0x2b8231(_0x368d7e, _0x346969 = {}) {
    return _0x2b5186["navigate"]({
      ..._0x346969,
      'view': "project",
      'step': _0x368d7e
    });
  }
  function _0x528815(_0x1275dc) {
    const _0x3a25ad = normalizeStoryWorkspaceStep(_0x1275dc);
    if (_0x46a1ea['data']?.["project"]?.["outlineStatus"] === "stale" && _0x3a25ad > 0x1) {
      _0x49e2b8('故事蓝图已修改，请先重新运行分集规划。', "warn");
      return;
    }
    if (_0x46a1ea['step'] === 0x2 && _0x3a25ad === 0x3) {
      void _0x2d69e6();
    } else {
      void _0x2b8231(_0x3a25ad);
    }
  }
  function _0x3afecb(_0x1c0ef6) {
    return handleWorkspaceStepShortcut(_0x1c0ef6, {
      'enabled': _0x2988c5 && !_0x46a1ea["canvasSyncPending"] && ["project", "episode"]["includes"](_0x46a1ea['view']),
      'stepCount': STORY_STEPS["length"] + (isStoryCollaborationProject(_0x46a1ea["data"]) ? 0x1 : 0x0),
      'navigate': _0x256675 => _0x528815(_0x256675 - (isStoryCollaborationProject(_0x46a1ea['data']) ? 0x1 : 0x0))
    });
  }
  async function _0x3a3838(_0x46e29a, _0x3a506b = '', _0x1a6082 = null) {
    const _0x5277dd = _0x1a6082?.["disabled"] === !![];
    _0x1a6082?.["classList"]?.["add"]("is-opening");
    syncStoryAsyncButton(_0x1a6082, !![]);
    if (_0x1a6082 && "disabled" in _0x1a6082) {
      _0x1a6082['disabled'] = !![];
    }
    try {
      hasPendingRuntimeManifestLoad() && (await waitForRuntimeManifestLoad({
        'timeoutMs': 0x1f4
      }));
      return _0x2b5186["navigate"]({
        'view': "episode",
        'episodeId': _0x46e29a,
        'clipId': _0x3a506b
      });
    } finally {
      _0x1a6082?.["classList"]?.["remove"]('is-opening');
      syncStoryAsyncButton(_0x1a6082, ![]);
      if (_0x1a6082 && "disabled" in _0x1a6082) {
        _0x1a6082["disabled"] = _0x5277dd;
      }
    }
  }
  function _0x35babf(_0x579e96) {
    const _0x168755 = _0x579e96['dataset']["storyModelKind"];
    const _0x332a47 = _0x579e96["dataset"]["storyModelOption"];
    if (!_0x168755 || !_0x332a47) {
      return;
    }
    _0x46a1ea["models"][_0x168755] = resolveStoryWorkspaceModelId(_0x168755, _0x332a47);
    _0x18eeff();
    _0x325d8d();
  }
  function _0x3c63e9(_0x526bea) {
    return a1579_0x2dbdc6({
      'event': _0x526bea,
      'root': _0x329e8d,
      'projects': _0x46a1ea["projects"],
      'state': _0x46a1ea,
      'libraryAssets': getVisibleStoryAssets(_0x46a1ea),
      'getTabLabel': getStoryAssetTabLabel,
      'commands': {
        'addLibraryAssets': (_0x3fc99c, _0x1f3c59, _0x11f4d6, _0x5e9098) => _0x3ae2fd(_0x1f3c59, _0x11f4d6, _0x5e9098, _0x3fc99c),
        'openProject': _0x3eea2e,
        'renameProject'(_0x5af5f1) {
          _0x46a1ea["openProjectMenuId"] = '';
          _0x325d8d();
          _0x4316a5(_0x5af5f1);
        },
        'duplicateProject': _0x431340,
        'collectProject': _0x72bfeb => void _0x45afa5(_0x72bfeb),
        'setProjectArchived': _0x21b3de,
        'requestDeleteProject'(_0x31466d) {
          _0x46a1ea["openProjectMenuId"] = '';
          _0x46a1ea["pendingDeleteProjectId"] = _0x31466d;
          _0x325d8d();
        }
      }
    });
  }
  windowObject?.["addEventListener"]?.("keydown", _0x3afecb, !![]);
  const _0x337499 = bindWorkspaceEntityContextMenu(_0x329e8d, {
    'resolveItems': _0x3c63e9,
    'beforeOpen'() {
      if (!_0x46a1ea['openProjectMenuId']) {
        return;
      }
      _0x46a1ea['openProjectMenuId'] = '';
      _0x325d8d();
    }
  });
  windowObject?.['addEventListener']?.("pointermove", _0x33c641, !![]);
  windowObject?.["addEventListener"]?.("pointerup", _0x221232, !![]);
  windowObject?.['addEventListener']?.("pointercancel", _0x349bac, !![]);
  _0x329e8d['addEventListener']("pointerdown", _0x1f3a3c => {
    _0x1f3a3c["stopPropagation"]();
    _0x1149d8();
    !_0x1f3a3c["target"]["closest"]?.("[data-story-clip-video-history-menu]") && _0x2f87a6();
    if (_0x55f344(_0x1f3a3c)) {
      return;
    }
    _0x4f29a0['begin'](_0x1f3a3c);
  });
  _0x329e8d["addEventListener"]("pointerover", _0x373ecc => {
    const _0x3b716a = _0x373ecc['target']["closest"]?.('[data-story-library-appearance-target]');
    _0x3b716a && !(_0x373ecc["relatedTarget"] && _0x3b716a["contains"](_0x373ecc["relatedTarget"])) && _0x58a467(_0x3b716a);
    const _0x3b03b9 = _0x373ecc["target"]['closest']?.(".story-clip-card-shell[data-story-video-history=\"true\"]");
    _0x3b03b9 && _0x329e8d["contains"](_0x3b03b9) && !(_0x373ecc["relatedTarget"] && _0x3b03b9["contains"](_0x373ecc['relatedTarget'])) && _0x10b704(_0x3b03b9, _0x373ecc);
    const _0x1f6d97 = getStoryAssetHoverCard(_0x373ecc["target"]);
    if (!_0x1f6d97 || !_0x329e8d["contains"](_0x1f6d97)) {
      return;
    }
    if (_0x373ecc["relatedTarget"] && _0x1f6d97['contains'](_0x373ecc["relatedTarget"])) {
      return;
    }
    _0xb2038d(_0x1f6d97, _0x373ecc);
  });
  _0x329e8d["addEventListener"]("focusin", _0x4cea28 => {
    const _0xbeacd = _0x4cea28['target']["closest"]?.("[data-story-library-appearance-target]");
    if (_0xbeacd) {
      _0x58a467(_0xbeacd);
    }
  });
  _0x329e8d["addEventListener"]("pointermove", _0x496a69 => {
    if (_0x4f29a0["update"](_0x496a69)) {
      return;
    }
    const _0x13d090 = getStoryAssetHoverCard(_0x496a69["target"]);
    if (!_0x13d090) {
      _0xa486b2["getHoveredAssetId"]() && _0x1149d8();
      return;
    }
    _0xb2038d(_0x13d090, _0x496a69);
  });
  _0x329e8d["addEventListener"]('pointerup', _0x4ca197 => {
    _0x4f29a0["finish"](_0x4ca197);
  });
  _0x329e8d['addEventListener']('pointercancel', _0x25632e => {
    _0x4f29a0["finish"](_0x25632e, {
      'cancelled': !![]
    });
  });
  _0x329e8d['addEventListener']("lostpointercapture", _0x36c275 => {
    if (_0x16619f(_0x36c275, {
      'cancelled': !![]
    })) {
      return;
    }
    _0x2f67dd["cancelSession"]();
    _0x4f29a0["finish"](_0x36c275, {
      'cancelled': !![]
    });
  });
  _0x329e8d["addEventListener"]("dragstart", _0x3bb639 => {
    const _0xbe2210 = _0x3bb639['target']["closest"]?.('article[data-story-replication-episode-id]');
    if (_0xbe2210) {
      if (!_0x3bb639['target']['closest']?.("[data-story-replication-drag-handle]")) {
        _0x3bb639['preventDefault']();
        return;
      }
      _0x485aec = normalizeText(_0xbe2210["dataset"]['storyReplicationEpisodeId']);
      if (!_0x485aec) {
        _0x3bb639["preventDefault"]();
        return;
      }
      _0x278b76 = [...(_0xbe2210["closest"]('[data-story-replication-grid]')?.["querySelectorAll"]("article[data-story-replication-episode-id]") || [])]["map"](_0xb89ebb => normalizeText(_0xb89ebb["dataset"]["storyReplicationEpisodeId"]));
      _0x3bb639["dataTransfer"]?.["setData"]?.("application/x-story-replication-episode", _0x485aec);
      if (_0x3bb639["dataTransfer"]) {
        _0x3bb639['dataTransfer']['effectAllowed'] = 'move';
      }
      _0xbe2210["classList"]["add"]('is-reordering');
      _0xbe2210['closest']("[data-story-replication-grid]")?.["classList"]["add"]("is-reordering");
      return;
    }
    const _0x238165 = _0x3bb639["target"]["closest"]?.('[data-story-reference-asset]');
    if (_0x238165) {
      if (_0x2f67dd['hasSession']()) {
        _0x3bb639["preventDefault"]();
        return;
      }
      const _0x4df7ac = normalizeText(_0x238165['dataset']["storyReferenceAsset"]);
      const _0x176cc = Math['max'](0x0, Math["trunc"](Number(_0x238165['dataset']["storyReferenceAssetIndex"]) || 0x0));
      if (!writeStoryAssetDragData(_0x3bb639["dataTransfer"], _0x4df7ac, _0x176cc)) {
        return;
      }
      applyStoryAssetNativeDragPreview(_0x3bb639["dataTransfer"], _0x238165);
      _0x111ca1 = _0x4df7ac;
      _0x111978 = _0x176cc;
      _0x238165["classList"]["add"]("is-story-asset-dragging");
      _0x1149d8();
      return;
    }
    if (_0x3bb639['target']["closest"]?.("[data-story-marquee-item]")) {
      _0x3bb639["preventDefault"]();
    }
  });
  _0x329e8d["addEventListener"]("dragend", () => {
    if (_0x485aec) {
      const _0x3c0fa8 = _0x329e8d['querySelector']("[data-story-replication-grid]");
      if (_0x3c0fa8 && _0x278b76["length"]) {
        const _0x530f48 = new Map([..._0x3c0fa8['querySelectorAll']("article[data-story-replication-episode-id]")]["map"](_0x1c261b => [normalizeText(_0x1c261b['dataset']['storyReplicationEpisodeId']), _0x1c261b]));
        _0x278b76["forEach"](_0x11c7f2 => {
          const _0x210ea3 = _0x530f48['get'](_0x11c7f2);
          if (_0x210ea3) {
            _0x3c0fa8["appendChild"](_0x210ea3);
          }
        });
      }
      _0x329e8d["querySelectorAll"](".story-replication-card.is-reordering")['forEach'](_0x5eef29 => _0x5eef29["classList"]["remove"]("is-reordering"));
      _0x329e8d["querySelector"]("[data-story-replication-grid]")?.["classList"]["remove"]("is-reordering");
      _0x485aec = '';
      _0x278b76 = [];
    }
    _0x1db49e();
  });
  _0x329e8d["addEventListener"]("keydown", _0x2bd5f8 => {
    const _0x40d17c = _0x2bd5f8["target"]["closest"]?.('[data-story-replication-drag-handle]');
    if (!_0x40d17c || !['ArrowUp', "ArrowDown", "ArrowLeft", "ArrowRight"]["includes"](_0x2bd5f8["key"])) {
      return;
    }
    const _0x54cc34 = _0x40d17c["closest"]("article[data-story-replication-episode-id]");
    const _0xea6333 = normalizeText(_0x54cc34?.["dataset"]["storyReplicationEpisodeId"]);
    const _0x1fdca6 = _0x46a1ea['data']["episodes"]["findIndex"](_0x36bb45 => normalizeText(_0x36bb45?.['id']) === _0xea6333);
    const _0x247e3b = ['ArrowUp', "ArrowLeft"]['includes'](_0x2bd5f8["key"]) ? -0x1 : 0x1;
    const _0x2a0fae = _0x1fdca6 + _0x247e3b;
    if (_0x1fdca6 < 0x0 || _0x2a0fae < 0x0 || _0x2a0fae >= _0x46a1ea["data"]["episodes"]['length']) {
      return;
    }
    _0x2bd5f8["preventDefault"]();
    _0x2bd5f8["stopPropagation"]();
    const _0x3ba063 = _0x46a1ea["data"]["episodes"]["map"](_0x118619 => _0x118619['id']);
    [_0x3ba063[_0x1fdca6], _0x3ba063[_0x2a0fae]] = [_0x3ba063[_0x2a0fae], _0x3ba063[_0x1fdca6]];
    _0x46a1ea['data']["episodes"] = reorderStoryVideoReplicationEpisodes(_0x46a1ea["data"]["episodes"], _0x3ba063);
    syncStoryVideoReplicationProject(_0x46a1ea["data"]);
    const _0x5108c3 = _0x54cc34["closest"]("[data-story-replication-grid]");
    const _0x5d1be4 = [...(_0x5108c3?.['querySelectorAll']("article[data-story-replication-episode-id]") || [])]["find"](_0x3b60aa => normalizeText(_0x3b60aa['dataset']["storyReplicationEpisodeId"]) === _0x3ba063[_0x1fdca6]);
    _0x5108c3 && _0x5d1be4 && (_0x5108c3['insertBefore'](_0x54cc34, _0x247e3b < 0x0 ? _0x5d1be4 : _0x5d1be4["nextSibling"]), _0x46a1ea["data"]["episodes"]['forEach']((_0x1db4ce, _0x33a737) => {
      const _0x151412 = [..._0x5108c3["querySelectorAll"]("article[data-story-replication-episode-id]")]["find"](_0x4d0879 => normalizeText(_0x4d0879['dataset']['storyReplicationEpisodeId']) === _0x1db4ce['id']);
      syncStoryVideoReplicationCardElement(_0x151412, _0x1db4ce, _0x33a737);
    }), _0x54cc34["querySelector"]("[data-story-replication-drag-handle]")?.["focus"]());
    _0x18eeff({
      'immediate': !![]
    });
  });
  _0x329e8d["addEventListener"]('pointerout', _0x4d5a25 => {
    const _0x58ad9f = _0x4d5a25["target"]['closest']?.(".story-clip-card-shell[data-story-video-history=\"true\"]");
    _0x58ad9f && !(_0x4d5a25["relatedTarget"] && _0x58ad9f['contains'](_0x4d5a25["relatedTarget"])) && !_0x4b8bb0?.["contains"](_0x4d5a25["relatedTarget"]) && _0x2f87a6({
      'delayed': !![]
    });
    const _0x4757fd = getStoryAssetHoverCard(_0x4d5a25['target']);
    if (!_0x4757fd || getStoryAssetHoverCardId(_0x4757fd) !== _0xa486b2["getHoveredAssetId"]()) {
      return;
    }
    if (_0x4d5a25["relatedTarget"] && _0x4757fd["contains"](_0x4d5a25["relatedTarget"])) {
      return;
    }
    _0x1149d8();
  });
  _0x329e8d["addEventListener"]("dblclick", _0x5e18a9 => {
    _0x5e18a9["stopPropagation"]();
    const _0x190a9f = _0x5e18a9["target"]["closest"]?.('img.story-asset-preview');
    if (!_0x190a9f || !_0x329e8d["contains"](_0x190a9f)) {
      return;
    }
    const _0x3650f9 = _0x190a9f["closest"]("[data-story-asset-detail-layout]") ? findStoryAsset(_0x46a1ea, _0x46a1ea["selectedAssetId"]) : null;
    const _0x1a3d64 = _0x3650f9 ? getSelectedAssetAppearance(_0x46a1ea, _0x3650f9) : null;
    const _0x31646a = _0x1a3d64 && resolveStoryAssetAppearanceOriginalUrl(_0x1a3d64) || normalizeText(_0x190a9f["currentSrc"] || _0x190a9f['getAttribute']('src'));
    if (!isUsableImageUrl(_0x31646a)) {
      return;
    }
    _0x5e18a9["preventDefault"]();
    openImagePreview(_0x31646a, {
      'alt': _0x190a9f['alt'] || '素材图片预览'
    });
  });
  _0x329e8d["addEventListener"]('wheel', _0x11f95f => {
    _0x11f95f["stopPropagation"]();
    if (_0x44ce09(_0x11f95f)) {
      return;
    }
    if (_0x1ea306(_0x11f95f)) {
      return;
    }
    if (scrollStoryClipPromptHistoryWithWheel(_0x11f95f)) {
      return;
    }
    if (scrollStoryClipStripWithWheel(_0x11f95f)) {
      return;
    }
    if (shouldPreserveStoryWorkspaceNestedWheel(_0x11f95f["target"])) {
      return;
    }
    const _0x411dfa = _0x1f811e['querySelector'](".story-page.is-current");
    if (!_0x411dfa) {
      return;
    }
    _0x11f95f['preventDefault']();
    _0x411dfa['scrollTop'] += Number(_0x11f95f["deltaY"] || 0x0);
    _0x411dfa["scrollLeft"] += Number(_0x11f95f["deltaX"] || 0x0);
  }, {
    'passive': ![]
  });
  _0x1f811e['addEventListener']("scroll", _0x191495 => {
    const _0x40473f = _0x191495["target"];
    if (!_0x2988c5 || !_0x40473f?.["matches"]?.(".story-page.is-current")) {
      return;
    }
    const _0x36ca2c = _0x145d9d || _0x1a3fa3();
    _0x46a1ea["pageScrollPositions"] = {
      ...(_0x46a1ea["pageScrollPositions"] || {}),
      [_0x36ca2c]: {
        'top': Math["max"](0x0, Number(_0x40473f["scrollTop"]) || 0x0),
        'left': Math["max"](0x0, Number(_0x40473f["scrollLeft"]) || 0x0)
      }
    };
    _0x18eeff({
      'uiOnly': !![]
    });
  }, !![]);
  _0x329e8d["addEventListener"]("keydown", _0xfba69b => {
    const _0x5cb2b2 = _0xfba69b["target"]["closest"]?.("[data-story-custom-episode-count-input]");
    if (_0x5cb2b2) {
      if (_0xfba69b["key"] === "Enter") {
        _0xfba69b['preventDefault']();
        _0xfba69b["stopPropagation"]();
        _0x503bb7(_0x5cb2b2);
      } else {
        _0xfba69b["key"] === "Escape" && (_0xfba69b["preventDefault"](), _0xfba69b["stopPropagation"](), _0x245a75(_0x5cb2b2, normalizeStoryEpisodeCount(_0x46a1ea["data"]["project"]?.['planning']?.["episodeCount"])));
      }
      return;
    }
    const _0x5b2fc3 = _0xfba69b["target"]['closest']?.("[data-story-action=\"toggle-clip-adjustment-mode\"]");
    if (_0x5b2fc3 && ["ArrowDown", "ArrowUp"]["includes"](_0xfba69b["key"])) {
      _0xfba69b["preventDefault"]();
      _0xfba69b["stopPropagation"]();
      const _0x287b71 = _0x5b2fc3["closest"]("[data-story-adjustment-kind]")?.['dataset']["storyAdjustmentKind"] || "mode";
      _0x46a1ea[_0x287b71 === "language" ? "clipAdjustmentLanguageOpen" : 'clipAdjustmentPromptModeOpen'] = !![];
      _0x46a1ea[_0x287b71 === 'language' ? "clipAdjustmentPromptModeOpen" : "clipAdjustmentLanguageOpen"] = ![];
      _0x18e104({
        'kind': _0x287b71 === "language" ? "mode" : "language"
      });
      _0x18e104({
        'kind': _0x287b71,
        'focus': "selected"
      });
      return;
    }
    const _0x4cfca0 = _0xfba69b['target']["closest"]?.("[data-story-clip-adjustment-mode-option]");
    if (_0x4cfca0 && ['ArrowDown', "ArrowUp", "Home", 'End']["includes"](_0xfba69b["key"])) {
      const _0x2c1074 = _0x4cfca0["closest"]("[role=listbox]");
      const _0x56396a = [...(_0x2c1074?.["querySelectorAll"]('[data-story-clip-adjustment-mode-option]') || [])];
      const _0x2e2f97 = Math["max"](0x0, _0x56396a["indexOf"](_0x4cfca0));
      const _0x53169d = _0xfba69b["key"] === "Home" ? 0x0 : _0xfba69b["key"] === "End" ? _0x56396a['length'] - 0x1 : (_0x2e2f97 + (_0xfba69b['key'] === "ArrowDown" ? 0x1 : -0x1) + _0x56396a["length"]) % _0x56396a["length"];
      _0xfba69b["preventDefault"]();
      _0xfba69b["stopPropagation"]();
      _0x56396a[_0x53169d]?.["focus"]();
      return;
    }
    if (_0xfba69b["key"] === 'Enter' && _0xfba69b['target']["matches"]?.('[data-story-clip-adjustment-instruction]')) {
      _0xfba69b["preventDefault"]();
      _0xfba69b["stopPropagation"]();
      void _0xbe8d9f();
      return;
    }
    if (_0x21ef38(_0xfba69b)) {
      return;
    }
    if (_0x3afecb(_0xfba69b)) {
      return;
    }
    if (_0xfba69b['key'] === 'Escape') {
      if (_0x46a1ea["clipPromptHistoryOpen"]) {
        _0xfba69b["preventDefault"]();
        _0xfba69b['stopPropagation']();
        _0x46a1ea['clipPromptHistoryOpen'] = ![];
        _0x562e1e({
          'focus': "trigger"
        });
        return;
      }
      if (_0x46a1ea['clipAdjustmentPromptModeOpen'] || _0x46a1ea["clipAdjustmentLanguageOpen"]) {
        _0xfba69b["preventDefault"]();
        _0xfba69b['stopPropagation']();
        const _0x25aa87 = _0x46a1ea["clipAdjustmentLanguageOpen"] ? "language" : 'mode';
        _0x46a1ea['clipAdjustmentPromptModeOpen'] = _0x46a1ea["clipAdjustmentLanguageOpen"] = ![];
        _0x18e104({
          'kind': _0x25aa87,
          'focus': "trigger"
        });
        return;
      }
      _0x4f29a0['cancel']();
      _0x1b3da4();
      _0x1c1572();
      _0x2c03e7();
      _0x285a4f();
    }
    const _0x1c2eee = _0xfba69b["target"]["closest"]?.("[data-story-appearance-wheel=\"true\"], [data-story-card-appearance-wheel]");
    if (_0x1c2eee && ["ArrowLeft", "ArrowRight"]['includes'](_0xfba69b["key"])) {
      _0xfba69b["preventDefault"]();
      _0xfba69b["stopPropagation"]();
      _0x3841b3(_0xfba69b["key"] === "ArrowRight" ? 0x1 : -0x1, _0x1c2eee["dataset"]["storyCardAppearanceWheel"] || _0x46a1ea['selectedAssetId']);
      return;
    }
    const _0x128033 = _0xfba69b['target']['closest']?.("[data-story-clip-navigation=\"true\"]");
    if (_0x128033 && ['ArrowLeft', "ArrowRight"]["includes"](_0xfba69b["key"])) {
      _0xfba69b["preventDefault"]();
      _0xfba69b["stopPropagation"]();
      _0x3590ea(_0xfba69b["key"] === "ArrowRight" ? 0x1 : -0x1);
      return;
    }
    if (_0x1de4e8['handleKeyDown'](_0xfba69b)) {
      return;
    }
    const _0x1118bb = _0xfba69b['target']["closest"]?.("[data-story-episode-splitter]");
    if (_0x1118bb && ["ArrowLeft", 'ArrowRight']["includes"](_0xfba69b['key'])) {
      _0xfba69b["preventDefault"]();
      _0xfba69b["stopPropagation"]();
      const _0x3e62f9 = _0xfba69b['key'] === "ArrowLeft" ? -0x2 : 0x2;
      _0x1118bb['dataset']['storyEpisodeSplitter'] === "assets" ? _0x566f3f(_0x46a1ea['episodeAssetPanelRatio'] + _0x3e62f9, _0x46a1ea["episodeEditorPanelRatio"], {
        'persist': !![]
      }) : _0x566f3f(_0x46a1ea['episodeAssetPanelRatio'], _0x46a1ea['episodeEditorPanelRatio'] + _0x3e62f9, {
        'persist': !![]
      });
      return;
    }
    if (!_0x2988c5 || _0x46a1ea['view'] !== 'home') {
      return;
    }
    if (!isStoryGenerateShortcut(_0xfba69b)) {
      return;
    }
    _0xfba69b["preventDefault"]();
    _0xfba69b["stopPropagation"]();
    if (_0x46a1ea["homeTab"] === "collaborate") {
      _0x3e6e62["start"]();
    } else {
      void _0x3763f3();
    }
  });
  _0x329e8d["addEventListener"]('toggle', _0x2d1f39 => {
    const _0x50b469 = _0x2d1f39["target"];
    if (!_0x50b469?.["matches"]?.("details[data-story-outline-section]")) {
      return;
    }
    const _0x13711b = _0x50b469["dataset"]['storyOutlineSection'];
    _0x46a1ea["outlineSectionOpenState"] = {
      ...(_0x46a1ea["outlineSectionOpenState"] || {}),
      [_0x13711b]: _0x50b469["open"]
    };
    _0x18eeff({
      'uiOnly': !![]
    });
    if (!_0x50b469["open"]) {
      return;
    }
    if (!_0x46a1ea["scriptGenerationFocusMode"] || !["original", "summary"]["includes"](_0x13711b)) {
      return;
    }
    if (['writing-episode-script', "writing-episode-scripts"]["includes"](_0x46a1ea["storyPlanningOperation"])) {
      return;
    }
    _0x46a1ea["scriptGenerationFocusMode"] = ![];
  }, !![]);
  _0x329e8d['addEventListener']('error', handleWorkspaceAssetLibraryImageError, !![]);
  _0x329e8d['addEventListener']("click", _0x1d7ac1 => {
    if (_0x4f29a0["consumeClick"](_0x1d7ac1)) {
      return;
    }
    if (_0x4d9c6e(_0x1d7ac1)) {
      return;
    }
    const _0x332eda = _0x329e8d['querySelector']("[data-story-custom-episode-count-input]");
    const _0x5e28c2 = normalizeText(_0x332eda?.["value"]) || _0x332eda?.['closest']('.story-episode-count-custom-editor')?.['classList']["contains"]("is-selected");
    if (_0x332eda && _0x5e28c2 && _0x1d7ac1['target']["closest"]("[data-story-action=\"generate-story\"]") && !_0x503bb7(_0x332eda)) {
      _0x1d7ac1["preventDefault"]();
      return;
    }
    _0x46a1ea['openProjectMenuId'] && !_0x1d7ac1["target"]['closest']("[data-story-project-menu-wrap]") && _0x358f94('');
    if (!_0x1d7ac1['target']['closest']("[data-story-project-sort-wrap]")) {
      _0x2ed527();
    }
    if (!_0x1d7ac1["target"]["closest"]('.story-home-param-picker')) {
      _0x1c1572();
    }
    !_0x1d7ac1["target"]['closest'](".story-asset-batch-menu-wrap, [data-story-library-target-menu], [data-story-library-appearance-menu]") && _0x2c03e7();
    if (!_0x1d7ac1["target"]["closest"](".story-canvas-sync-menu-wrap")) {
      _0x285a4f();
    }
    !_0x1d7ac1["target"]["closest"]('.story-character-voice-history-wrap') && _0x36cc45();
    const _0x227d09 = _0x1d7ac1["target"]["closest"]('[data-story-select-script-episode]');
    if (_0x227d09 && (_0x46a1ea["scriptSelectionMode"] || _0x1d7ac1["shiftKey"] === !![]) && !_0x1d7ac1["target"]["closest"]('[data-story-action]')) {
      _0x1d7ac1["preventDefault"]();
      _0x46a1ea['scriptSelectionMode'] = !![];
      _0x2b8472(_0x227d09['dataset']["storySelectScriptEpisode"]);
      return;
    }
    const _0xce73e3 = _0x1d7ac1['target']["closest"]("[data-story-home-param-trigger]");
    if (_0xce73e3) {
      const _0xe82a49 = _0xce73e3["closest"](".story-home-param-picker");
      const _0x325dc0 = !_0xe82a49["classList"]["contains"]("is-open");
      _0x1b3da4();
      _0x1c1572(_0xe82a49);
      _0xe82a49["classList"]["toggle"]('is-open', _0x325dc0);
      _0xce73e3["setAttribute"]('aria-expanded', String(_0x325dc0));
      return;
    }
    const _0x135ae3 = _0x1d7ac1["target"]["closest"]('[data-story-asset-preset-option]');
    if (_0x135ae3) {
      _0x135ae3['dataset']["storyAssetPresetKind"] === 'scene' ? _0x46a1ea["sceneAssetPromptPresetId"] = getStorySceneAssetPromptPreset(_0x135ae3["dataset"]["storyAssetPresetOption"])['id'] : _0x46a1ea["assetPromptPresetId"] = getStoryCharacterAssetPromptPreset(_0x135ae3["dataset"]["storyAssetPresetOption"])['id'];
      _0x1c1572();
      _0x325d8d();
      return;
    }
    const _0x2e12f5 = _0x1d7ac1["target"]["closest"]("[data-story-aspect-ratio-option]");
    if (_0x2e12f5) {
      _0x285965(_0x2e12f5["dataset"]["storyAspectRatioOption"]);
      return;
    }
    const _0x1e65f1 = _0x1d7ac1['target']["closest"]("[data-story-planning-option]");
    if (_0x1e65f1) {
      _0x4f7f0e(_0x1e65f1["dataset"]['storyPlanningField'], _0x1e65f1["dataset"]["storyPlanningOption"]);
      return;
    }
    const _0x5de9c4 = _0x1d7ac1['target']["closest"]("[data-story-style-option]");
    if (_0x5de9c4) {
      _0x318be6(_0x5de9c4["dataset"]["storyStyleOption"]);
      return;
    }
    const _0x34cef0 = _0x1d7ac1["target"]["closest"]("[data-story-style-category]");
    if (_0x34cef0) {
      const _0x5d7322 = _0x34cef0["closest"](".story-style-picker");
      _0x5d7322?.["querySelectorAll"]("[data-story-style-category]")["forEach"](_0x3cead9 => {
        const _0x53db53 = _0x3cead9 === _0x34cef0;
        _0x3cead9["classList"]['toggle']("is-active", _0x53db53);
        _0x3cead9['setAttribute']('aria-selected', String(_0x53db53));
      });
      _0x1b7596(_0x5d7322);
      return;
    }
    const _0x4653a0 = _0x1d7ac1["target"]["closest"]("[data-story-style-custom]");
    if (_0x4653a0) {
      _0x38e6d9(_0x4653a0["closest"](".story-style-picker"), !![]);
      return;
    }
    const _0x660bee = _0x1d7ac1["target"]["closest"]("[data-story-style-custom-back]");
    if (_0x660bee) {
      _0x38e6d9(_0x660bee["closest"]('.story-style-picker'), ![]);
      return;
    }
    const _0x3ee75a = _0x1d7ac1['target']['closest']('[data-story-style-custom-confirm]');
    if (_0x3ee75a) {
      _0x5c142d(_0x3ee75a["closest"]('.story-style-picker')?.["querySelector"]("[data-story-style-custom-input]"));
      return;
    }
    const _0x1724c7 = _0x1d7ac1["target"]["closest"]('[data-story-model-option]');
    if (_0x1724c7) {
      _0x35babf(_0x1724c7);
      return;
    }
    const _0x4b96d0 = _0x1d7ac1['target']["closest"]("[data-story-model-trigger]");
    if (_0x4b96d0) {
      const _0x2fc949 = _0x4b96d0["closest"](".story-model-picker");
      const _0x12f14d = !_0x2fc949['classList']["contains"]('is-open');
      _0x1c1572();
      _0x1b3da4(_0x2fc949);
      _0x2fc949['classList']["toggle"]("is-open", _0x12f14d);
      _0x4b96d0["setAttribute"]("aria-expanded", String(_0x12f14d));
      if (_0x12f14d) {
        _0x2fc949["querySelector"]("[data-story-model-search-input]")?.["focus"]();
      }
      return;
    }
    const _0x3a4018 = _0x1d7ac1['target']["closest"]('[data-story-home-tab]');
    if (_0x3a4018) {
      _0x534617(_0x3a4018["dataset"]["storyHomeTab"]);
      return;
    }
    const _0x515b34 = _0x1d7ac1["target"]["closest"]("[data-story-step]");
    if (_0x515b34) {
      _0x528815(_0x515b34["dataset"]['storyStep']);
      return;
    }
    if (_0x46a1ea["assetLibraryDisclosure"]?.["toggleFromTarget"](_0x1d7ac1['target'])) {
      return;
    }
    const _0x3b2a94 = _0x1d7ac1["target"]["closest"]("[data-story-asset-filter]");
    if (_0x3b2a94) {
      const _0x3dcc76 = normalizeText(_0x3b2a94["dataset"]["storyAssetFilter"]);
      const _0x434123 = getStoryAssetTabTransitionDirection(_0x46a1ea["assetFilter"], _0x3dcc76);
      if (_0x434123 === "none") {
        return;
      }
      _0x46a1ea['characterVoiceEditor'] = null;
      _0x46a1ea['characterVoicePanelMotion'] = '';
      _0x46a1ea["pendingCharacterVoiceAssetId"] = '';
      _0x46a1ea["assetFilter"] = _0x3dcc76;
      _0x46a1ea["selectedAssetId"] = '';
      _0x46a1ea["pendingDeleteAssetAppearanceKey"] = '';
      _0x46a1ea["assetSelectionMode"] = ![];
      _0x46a1ea['selectedAssetIds'] = [];
      const _0x42a7dc = _0x136276()?.["querySelector"]('.story-asset-tabs');
      _0x42a7dc && (_0x42a7dc["dataset"]['activeTab'] = _0x3dcc76, _0x42a7dc['querySelectorAll']("[data-story-asset-filter]")["forEach"](_0x240bca => {
        const _0x34a72e = _0x240bca["dataset"]["storyAssetFilter"] === _0x3dcc76;
        _0x240bca["classList"]["toggle"]('is-active', _0x34a72e);
        _0x240bca["setAttribute"]('aria-selected', String(_0x34a72e));
        _0x240bca["tabIndex"] = _0x34a72e ? 0x0 : -0x1;
      }));
      _0x325d8d({
        'direction': _0x434123,
        'updateToolbar': ![],
        'transitionScope': 'asset-content'
      });
      _0x18eeff({
        'uiOnly': !![]
      });
      return;
    }
    const _0xec277d = _0x1d7ac1["target"]['closest']("[data-story-episode-asset-tab]");
    if (_0xec277d) {
      _0x46a1ea["episodeAssetRailTab"] = normalizeStoryEpisodeAssetRailTab(_0xec277d["dataset"]["storyEpisodeAssetTab"]);
      if (!_0x1d3480()) {
        _0x325d8d();
      }
      _0x18eeff({
        'uiOnly': !![]
      });
      return;
    }
    const _0x415aa7 = _0x1d7ac1["target"]["closest"]("[data-story-asset-id]");
    if (_0x415aa7) {
      const _0x1f6395 = _0x415aa7["dataset"]['storyAssetId'];
      const _0x37485f = _0x46a1ea["selectedAssetId"];
      const _0x705076 = _0x46a1ea["selectedAssetId"] !== _0x1f6395;
      const _0x55574c = Boolean(_0x46a1ea["characterVoiceEditor"]);
      _0x705076 && (updateStoryAssetPromptFromEditor(_0x46a1ea, _0x136276()?.["querySelector"]?.("[data-story-asset-prompt][contenteditable=\"true\"]")), _0x22f2d9(), _0x46a1ea["characterVoiceEditor"] = null, _0x46a1ea["characterVoicePanelMotion"] = '', _0x46a1ea["pendingCharacterVoiceAssetId"] = '', _0x46a1ea['pendingDeleteAssetAppearanceKey'] = '');
      _0x46a1ea["selectedAssetId"] = _0x1f6395;
      if (!_0x46a1ea["isBatchGenerating"]) {
        const _0xf63a98 = _0x46a1ea["assetFilter"] === 'library' ? getVisibleStoryAssets(_0x46a1ea)["find"](_0x2bad94 => _0x2bad94['id'] === _0x1f6395) : null;
        const _0x14c8a8 = _0x46a1ea["assetFilter"] !== "library" || Boolean(normalizeText(_0xf63a98?.["mediaKind"])["toLowerCase"]() === "image" && normalizeText(_0xf63a98?.["sourceUrl"] || _0xf63a98?.['imageUrl']));
        const _0x414d36 = resolveWorkspaceCardMultiSelection({
          'selectedIds': _0x46a1ea["selectedAssetIds"],
          'itemId': _0x1f6395,
          'activeItemId': _0x37485f,
          'selectionMode': _0x46a1ea["assetSelectionMode"],
          'shiftKey': _0x1d7ac1['shiftKey'] === !![],
          'enabled': _0x14c8a8
        });
        _0x414d36["handled"] && (_0x46a1ea["assetSelectionMode"] = _0x414d36["selectionMode"], _0x46a1ea["selectedAssetIds"] = _0x414d36["selectedIds"]);
      }
      (!_0x46a1ea["isBatchGenerating"] || _0x55574c || _0x705076 && !_0x3c03fa()) && _0x325d8d();
      _0x18eeff({
        'uiOnly': !![]
      });
      return;
    }
    const _0x523035 = _0x1d7ac1['target']['closest']('[data-story-select-episode]');
    if (_0x523035 && (_0x46a1ea["episodeSelectionMode"] || _0x1d7ac1["shiftKey"] === !![])) {
      const _0x5e3416 = _0x523035['dataset']["storySelectEpisode"];
      if (getStoryEpisodeGenerationControlState(_0x46a1ea, _0x5e3416)['disabled']) {
        return;
      }
      const _0x363978 = resolveWorkspaceCardMultiSelection({
        'selectedIds': _0x46a1ea["selectedEpisodeIds"],
        'itemId': _0x5e3416,
        'activeItemId': _0x46a1ea["selectedEpisodeId"],
        'selectionMode': _0x46a1ea['episodeSelectionMode'],
        'shiftKey': _0x1d7ac1["shiftKey"] === !![]
      });
      _0x363978['handled'] && (_0x46a1ea["episodeSelectionMode"] = _0x363978["selectionMode"], _0x46a1ea["selectedEpisodeIds"] = _0x363978["selectedIds"], _0x325d8d());
      return;
    }
    const _0x239a42 = _0x1d7ac1["target"]["closest"]('[data-story-open-episode]');
    if (_0x239a42) {
      const _0x1369dc = _0x239a42['dataset']['storyOpenEpisode'];
      if (getStoryEpisodeGenerationControlState(_0x46a1ea, _0x1369dc)["disabled"]) {
        return;
      }
      void _0x3a3838(_0x1369dc, '', _0x239a42);
      return;
    }
    const _0x20c08f = _0x1d7ac1['target']["closest"]("[data-story-insert-after-clip-id]");
    if (_0x20c08f) {
      if (_0x46a1ea['clipSelectionMode']) {
        return;
      }
      const _0x803fee = getSelectedEpisode(_0x46a1ea);
      const _0x27b27b = insertStoryEpisodeClip(_0x803fee, _0x20c08f['dataset']['storyInsertAfterClipId'], {
        'promptMode': _0x803fee?.['promptMode'] || _0x46a1ea["data"]["project"]?.["planning"]?.["promptMode"]
      });
      const _0x2e2282 = _0x46a1ea["data"]["episodes"]["findIndex"](_0x1e2b74 => _0x1e2b74['id'] === _0x803fee?.['id']);
      if (!_0x27b27b || _0x2e2282 < 0x0) {
        _0x49e2b8("新增片段失败，请刷新后重试。", "error");
        return;
      }
      _0x46a1ea['data']['episodes'][_0x2e2282] = _0x27b27b["episode"];
      _0x49275d({
        'close': !![]
      });
      _0x46a1ea["selectedClipId"] = _0x27b27b["clip"]['id'];
      _0x46a1ea["pendingDeleteClipId"] = '';
      _0x46a1ea["selectedClipGenerationIds"] = [];
      _0x180373(_0x27b27b["clip"]);
      _0x18eeff({
        'immediate': !![]
      });
      _0x325d8d();
      _0x49e2b8("已新增片段。", 'success');
      return;
    }
    const _0x97dec = _0x1d7ac1["target"]['closest']('.story-clip-card[data-story-clip-id]');
    if (_0x97dec) {
      const _0x27e699 = _0x97dec["dataset"]["storyClipId"];
      const _0x29ff40 = resolveWorkspaceCardMultiSelection({
        'selectedIds': _0x46a1ea["selectedClipGenerationIds"],
        'itemId': _0x27e699,
        'activeItemId': _0x46a1ea['selectedClipId'],
        'selectionMode': _0x46a1ea["clipSelectionMode"],
        'shiftKey': _0x1d7ac1["shiftKey"] === !![]
      });
      if (_0x29ff40['handled']) {
        const _0x266729 = storyClipProduction["getGenerationState"](_0x46a1ea, getSelectedEpisode(_0x46a1ea));
        if (_0x266729["isBatchGenerating"] || _0x266729["generatingClipIds"]['includes'](normalizeText(_0x27e699))) {
          return;
        }
        _0x46a1ea["pendingDeleteClipId"] = '';
        _0x46a1ea["clipSelectionMode"] = _0x29ff40["selectionMode"];
        _0x46a1ea['selectedClipGenerationIds'] = _0x29ff40["selectedIds"];
        _0x285a4f();
        _0x36221b();
      } else {
        const _0xaf35aa = getSelectedEpisode(_0x46a1ea);
        const _0x4cddc2 = Array["isArray"](_0xaf35aa?.["clips"]) ? _0xaf35aa["clips"] : [];
        const _0x5e3265 = _0x4cddc2["findIndex"](_0x3e283c => _0x3e283c['id'] === _0x46a1ea["selectedClipId"]);
        const _0x35e737 = _0x4cddc2["findIndex"](_0x36716f => _0x36716f['id'] === _0x27e699);
        const _0x45fbac = _0x46a1ea["selectedClipId"] !== _0x27e699;
        const _0x1afdbe = _0x35e737 >= 0x0 && _0x35e737 < _0x5e3265 ? "previous" : 'next';
        _0x46a1ea["pendingDeleteClipId"] = '';
        if (_0x45fbac) {
          _0x49275d({
            'close': !![]
          });
        }
        _0x46a1ea["selectedClipId"] = _0x27e699;
        _0x180373(getSelectedClip(_0x46a1ea, _0xaf35aa));
        if (_0x45fbac) {
          if (!_0x348dde(_0x1afdbe)) {
            _0x325d8d();
          }
        } else {
          _0x36221b();
        }
        _0x18eeff({
          'uiOnly': !![]
        });
      }
      return;
    }
    const _0x4e0f56 = _0x1d7ac1['target']["closest"]('[data-story-clip-prompt-surface]\x20.ref-thumb-delete');
    if (_0x4e0f56) {
      const _0x4d5064 = _0x4e0f56["closest"]("[data-slot]");
      if (!_0x4d5064) {
        return;
      }
      _0x43413a({
        'kind': _0x4d5064['dataset']['kind'],
        'slotId': _0x4d5064["dataset"]["slot"],
        'value': null
      });
      return;
    }
    const _0x5dff99 = _0x1d7ac1["target"]["closest"]('[data-story-clip-prompt-surface]\x20.ref-upload-slot[data-slot]');
    if (_0x5dff99) {
      const _0x64d827 = _0x5dff99["dataset"]["kind"];
      const _0x29d980 = _0x3e5ebf(_0x46a1ea);
      const _0x493db9 = getSelectedEpisode(_0x46a1ea);
      const _0x2f1b13 = getSelectedClip(_0x46a1ea, _0x493db9);
      _0x46a1ea["pendingClipInput"] = {
        'kind': _0x64d827,
        'slotId': _0x5dff99["dataset"]["slot"]
      };
      _0x4c908e = {
        ..._0x46a1ea['pendingClipInput'],
        'projectToken': _0x29d980,
        'episodeId': _0x493db9?.['id'],
        'clipId': _0x2f1b13?.['id']
      };
      _0x3368b0["accept"] = _0x64d827 === "image" ? "image/*" : _0x64d827 === "audio" ? "audio/*" : 'video/*';
      _0x3368b0["click"]();
      return;
    }
    const _0x10a85e = _0x1d7ac1["target"]["closest"]("[data-story-clip-prompt-surface] .prompt-attachment-btn");
    if (_0x10a85e) {
      const _0xa36d9f = getSelectedEpisode(_0x46a1ea);
      const _0x2ba52d = getSelectedClip(_0x46a1ea, _0xa36d9f);
      const _0x507758 = buildStoryClipInputSlotViewModel({
        'modelId': _0x46a1ea["models"]["video"],
        'provider': _0x46a1ea['videoProvider'],
        'inputs': _0x2ba52d?.["inputs"]
      });
      const _0x2eebe4 = _0x507758["groups"]["filter"](_0x5ab3ed => _0x5ab3ed['slots']["some"](_0x84babc => !_0x84babc["input"]?.["url"]))["map"](_0x341779 => _0x341779["kind"]);
      if (!_0x2eebe4["length"]) {
        _0x49e2b8("当前视频模型的入参槽已满。", 'warn');
        return;
      }
      const _0x1dcc65 = _0x3e5ebf(_0x46a1ea);
      _0x46a1ea["pendingClipInput"] = {
        'kind': '',
        'slotId': ''
      };
      _0x4c908e = {
        ..._0x46a1ea["pendingClipInput"],
        'projectToken': _0x1dcc65,
        'episodeId': _0xa36d9f?.['id'],
        'clipId': _0x2ba52d?.['id']
      };
      _0x3368b0["accept"] = _0x2eebe4["map"](_0x7e4978 => _0x7e4978 + '/*')["join"](',');
      _0x3368b0['click']();
      return;
    }
    const _0x4a9925 = _0x1d7ac1["target"]['closest']("[data-story-script-mode]");
    if (_0x4a9925) {
      _0x5d9ca2(getNextStoryScriptMode(_0x46a1ea['scriptMode']));
      return;
    }
    const _0x4724dc = _0x1d7ac1["target"]["closest"]("[data-story-asset-batch-mode]");
    if (_0x4724dc) {
      _0x2c03e7();
      void _0x46f291(_0x4724dc['dataset']['storyAssetBatchMode']);
      return;
    }
    const _0xe82f45 = _0x1d7ac1["target"]["closest"]("[data-story-library-target-asset-id]");
    if (_0xe82f45) {
      _0x3ae2fd(_0xe82f45["dataset"]["storyLibraryTargetAssetId"], _0xe82f45["dataset"]["storyLibraryTargetAppearanceId"], _0xe82f45["dataset"]['storyLibraryTargetCreateAppearance'] === 'true');
      return;
    }
    const _0x5400c2 = _0x1d7ac1['target']["closest"]("[data-story-library-appearance-target]");
    if (_0x5400c2) {
      _0x58a467(_0x5400c2);
      return;
    }
    const _0x24fc39 = _0x1d7ac1["target"]['closest']("[data-story-library-target-kind]");
    if (_0x24fc39) {
      _0x52458f(_0x24fc39);
      return;
    }
    const _0x563bf4 = _0x1d7ac1["target"]['closest']("[data-story-character-voice-history-play]");
    if (_0x563bf4) {
      void _0x1df707(_0x46a1ea["characterVoiceEditor"]?.["assetId"], _0x563bf4['dataset']["storyCharacterVoiceHistoryPlay"]);
      return;
    }
    const _0x1d816e = _0x1d7ac1["target"]["closest"]("[data-story-character-voice-history-restore]");
    if (_0x1d816e) {
      _0x1b849a(_0x46a1ea["characterVoiceEditor"]?.["assetId"], _0x1d816e['dataset']["storyCharacterVoiceHistoryRestore"]);
      return;
    }
    const _0x108bed = _0x1d7ac1["target"]["closest"]("[data-story-open-project]");
    if (_0x108bed && !_0x1d7ac1["target"]["closest"]("[data-story-action]")) {
      if (_0x1d7ac1['target']['closest']("[data-story-project-title]")) {
        return;
      }
      _0x3eea2e(_0x108bed["dataset"]["storyOpenProject"]);
      return;
    }
    const _0x923d8 = _0x1d7ac1["target"]["closest"]('[data-story-action]');
    const _0x322a71 = _0x923d8?.["dataset"]["storyAction"];
    if (!_0x322a71) {
      return;
    }
    const _0x4358fe = _0x3654ac["getRevision"]();
    ["request-inline-regeneration", 'confirm-inline-regeneration', "cancel-inline-regeneration", "request-delete-asset-appearance", 'confirm-delete-asset-appearance', "cancel-delete-asset-appearance"]["includes"](_0x322a71) && (_0x1d7ac1['preventDefault'](), _0x1d7ac1["stopPropagation"]());
    if (_0x322a71 === "toggle-clip-adjustment") {
      _0x46a1ea['clipAdjustmentOpen'] = !_0x46a1ea["clipAdjustmentOpen"];
      _0x46a1ea['clipAdjustmentPromptModeOpen'] = ![];
      _0x46a1ea["clipAdjustmentLanguageOpen"] = ![];
      _0x46a1ea['clipAdjustmentLanguage'] = '';
      _0x46a1ea['clipPromptHistoryOpen'] = ![];
      _0x562e1e();
      if (_0x46a1ea["clipAdjustmentOpen"]) {
        const _0x3fd86e = getSelectedEpisode(_0x46a1ea);
        const _0x27ada1 = getSelectedClip(_0x46a1ea, _0x3fd86e);
        _0x46a1ea["clipAdjustmentPromptMode"] = '';
      }
      _0x3b0a58();
      _0x46a1ea["clipAdjustmentOpen"] && _0x329e8d["querySelector"]('[data-story-clip-adjustment-instruction]')?.['focus']();
    } else {
      if (_0x322a71 === "toggle-clip-prompt-history") {
        _0x46a1ea['clipPromptHistoryOpen'] = !_0x46a1ea["clipPromptHistoryOpen"];
        const _0x503d4f = _0x46a1ea['clipAdjustmentOpen'] === !![];
        _0x46a1ea["clipAdjustmentOpen"] = ![];
        _0x46a1ea["clipAdjustmentPromptModeOpen"] = ![];
        if (_0x503d4f) {
          _0x3b0a58();
        }
        _0x562e1e({
          'focus': _0x46a1ea["clipPromptHistoryOpen"] ? 'first' : "trigger"
        });
      } else {
        if (_0x322a71 === 'restore-clip-prompt-history') {
          _0x5a3919(_0x923d8["dataset"]["storyClipPromptHistoryId"]);
        } else {
          if (_0x322a71 === "toggle-clip-adjustment-mode") {
            const _0x70d294 = _0x923d8['closest']('[data-story-adjustment-kind]')?.['dataset']["storyAdjustmentKind"] || "mode";
            const _0xf868de = _0x70d294 === "language" ? "clipAdjustmentLanguageOpen" : "clipAdjustmentPromptModeOpen";
            _0x46a1ea[_0xf868de] = !_0x46a1ea[_0xf868de];
            _0x46a1ea[_0x70d294 === "language" ? "clipAdjustmentPromptModeOpen" : "clipAdjustmentLanguageOpen"] = ![];
            _0x18e104({
              'kind': _0x70d294 === 'language' ? "mode" : "language"
            });
            _0x18e104({
              'kind': _0x70d294,
              'focus': _0x46a1ea[_0xf868de] ? "selected" : "trigger"
            });
          } else {
            if (_0x322a71 === "select-clip-adjustment-mode") {
              const _0x4d4e54 = _0x923d8["closest"]("[data-story-adjustment-kind]")?.["dataset"]["storyAdjustmentKind"] || 'mode';
              _0x46a1ea[_0x4d4e54 === 'language' ? 'clipAdjustmentLanguage' : "clipAdjustmentPromptMode"] = _0x4d4e54 === "language" ? normalizeStoryPromptLanguage(_0x923d8["dataset"]["storyClipAdjustmentModeOption"]) : normalizeStoryPromptMode(_0x923d8["dataset"]["storyClipAdjustmentModeOption"], {
                'allowDeveloperModes': !![]
              });
              _0x46a1ea["clipAdjustmentPromptModeOpen"] = ![];
              _0x46a1ea["clipAdjustmentLanguageOpen"] = ![];
              _0x18e104({
                'kind': _0x4d4e54,
                'focus': "instruction",
                'updateSelection': !![]
              });
            } else {
              if (_0x322a71 === "generate-clip-adjustment") {
                void _0xbe8d9f();
              } else {
                if (_0x322a71 === "regenerate-clip-adjustment") {
                  _0x50320f();
                } else {
                  if (_0x322a71 === "use-ai-clip-prompt") {
                    _0x1a0bdc();
                  } else {
                    if (_0x322a71 === "keep-current-clip-prompt") {
                      _0x20dc4b();
                    } else {
                      if (_0x322a71 === "choose-script" || _0x322a71 === "choose-rewrite-script") {
                        _0x222ec0?.['click']();
                      } else {
                        if (_0x322a71 === "remove-rewrite-script") {
                          clearStoryHomeReferenceScript(_0x46a1ea);
                          _0x18eeff({
                            'immediate': !![]
                          });
                          _0x325d8d();
                          _0x329e8d["querySelector"]("[data-story-idea-input]")?.["focus"]();
                        } else {
                          if (_0x322a71 === "choose-replication-videos") {
                            _0xf91527 = '';
                            _0x49803d?.["click"]();
                          } else {
                            if (_0x322a71 === "reupload-replication-video") {
                              const _0x4f1498 = normalizeText(_0x923d8['dataset']["storyReplicationEpisodeId"]);
                              const _0x16b121 = findStoryReplicationEpisode(_0x46a1ea["data"], _0x4f1498);
                              const _0x5a987f = normalizeText(_0x46a1ea['data']?.["project"]?.['id']);
                              _0x16b121 && _0x46a1ea["data"]?.["project"]?.["sourceMode"] === 'video-replication' && _0x16b121["replication"]?.["status"] === "failed" && !normalizeText(_0x16b121['sourceVideo']?.["videoRef"]) && (_0x562990["has"](_0x5a987f) ? _0x49e2b8("请等待当前视频解析完成后再重新上传。", "info") : (_0xf91527 = _0x4f1498, _0x49803d?.['click']()));
                            } else {
                              if (_0x322a71 === "remove-replication-video") {
                                const _0x46bece = Math['trunc'](Number(_0x923d8["dataset"]["storyReplicationFileIndex"]));
                                if (_0x46bece >= 0x0 && _0x46bece < _0x46a1ea["replicationSourceFiles"]["length"]) {
                                  _0x41160e(_0x46a1ea["replicationSourcePreviewUrls"][_0x46bece]);
                                  _0x46a1ea["replicationSourceFiles"] = _0x46a1ea["replicationSourceFiles"]["filter"]((_0x1efd04, _0x572687) => _0x572687 !== _0x46bece);
                                  _0x46a1ea['replicationSourcePreviewUrls'] = _0x46a1ea["replicationSourcePreviewUrls"]['filter']((_0x2dbbba, _0x4bec78) => _0x4bec78 !== _0x46bece);
                                  const _0x3981fd = _0x1f811e['querySelector']('.story-page.is-current\x20.story-home-composer-body');
                                  if (_0x3981fd) {
                                    syncStoryReplicationHomeSources(_0x3981fd, _0x46a1ea);
                                  }
                                  _0x3ac8ee();
                                }
                              } else {
                                if (_0x322a71 === "paste-script") {
                                  _0x46a1ea["uploadInputMode"] = "paste";
                                  _0x46a1ea["scriptFileName"] = normalizeText(_0x46a1ea['scriptText']) ? "粘贴文本" : '';
                                  _0x325d8d();
                                  _0x329e8d["querySelector"]("[data-story-paste-input]")?.['focus']();
                                } else {
                                  if (_0x322a71 === "debug-story-summary" || _0x322a71 === "debug-story-home") {
                                    if (windowObject?.["DEV_MODE"] !== !![]) {
                                      return;
                                    }
                                    openDebugRequestWindow({
                                      'documentObject': documentObject,
                                      'windowObject': windowObject,
                                      'title': "剧本摘要请求调试",
                                      'prepare': async () => {
                                        const _0x2e47ab = await captureStoryRequestPayload(_0x46cf3e => _0x2036f6["preview"]({
                                          'home': _0x322a71 === "debug-story-home",
                                          'captureRequest': _0x46cf3e
                                        }));
                                        return {
                                          'tabs': buildStoryRequestDebugPreviewModel(_0x2e47ab)['tabs']
                                        };
                                      }
                                    });
                                    return;
                                  } else {
                                    if (_0x322a71 === "generate-story") {
                                      _0x3763f3();
                                    } else {
                                      if (_0x322a71 === "preview-replication-video") {
                                        const _0x3ec0cf = findStoryReplicationEpisode(_0x46a1ea["data"], _0x923d8["dataset"]["storyReplicationEpisodeId"]);
                                        const _0x11d278 = normalizeText(_0x3ec0cf?.["sourceVideo"]?.["videoRef"]);
                                        _0x11d278 && openVideoPreview(_0x11d278, {
                                          'ariaLabel': (normalizeText(_0x3ec0cf?.["title"]) || '原视频') + '预览',
                                          'loop': ![]
                                        });
                                      } else {
                                        if (_0x322a71 === 'retry-replication-analysis') {
                                          void _0xbbfa48();
                                        } else {
                                          if (_0x322a71 === "localize-replication-assets") {
                                            void _0xecce1e({
                                              'advance': !![]
                                            });
                                          } else {
                                            if (_0x322a71 === "request-inline-regeneration") {
                                              if (_0x46a1ea["storyPlanningOperation"] || _0x46a1ea["isGeneratingStory"]) {
                                                return;
                                              }
                                              const _0x3c0c75 = normalizeText(_0x923d8["dataset"]['storyRegenerationTarget']);
                                              if (_0x46a1ea["data"]?.["project"]?.["outlineStatus"] === 'stale' && _0x3c0c75['startsWith']('episode-script:')) {
                                                _0x49e2b8("故事蓝图已修改，请先重新运行分集规划。", "warn");
                                                return;
                                              }
                                              _0x46a1ea["pendingRegenerationTarget"] = _0x3c0c75;
                                              _0x325d8d();
                                            } else {
                                              if (_0x322a71 === "cancel-inline-regeneration") {
                                                _0x46a1ea['pendingRegenerationTarget'] = '';
                                                _0x325d8d();
                                              } else {
                                                if (_0x322a71 === "confirm-inline-regeneration") {
                                                  const _0x29b003 = normalizeText(_0x923d8["dataset"]['storyRegenerationTarget']);
                                                  if (!_0x29b003 || _0x29b003 !== _0x46a1ea["pendingRegenerationTarget"]) {
                                                    return;
                                                  }
                                                  _0x46a1ea["pendingRegenerationTarget"] = '';
                                                  if (_0x29b003 === "summary") {
                                                    void _0x100c5c();
                                                  } else {
                                                    if (_0x29b003 === 'episode-outlines') {
                                                      void _0x2eae7b({
                                                        'advance': ![],
                                                        'confirmRegeneration': ![]
                                                      });
                                                    } else {
                                                      _0x29b003['startsWith']("episode-script:") && void _0x43f9b8(_0x923d8["dataset"]["storyEpisodeId"]);
                                                    }
                                                  }
                                                } else {
                                                  if (_0x322a71 === "debug-episode-outline-request") {
                                                    if (!isStoryEpisodeExperimentalSplitAvailable(windowObject)) {
                                                      return;
                                                    }
                                                    void _0x4c50e1();
                                                  } else {
                                                    if (_0x322a71 === "debug-episode-script-request") {
                                                      if (!isStoryEpisodeExperimentalSplitAvailable(windowObject)) {
                                                        return;
                                                      }
                                                      void _0x193fa2();
                                                    } else {
                                                      if (_0x322a71 === 'debug-asset-extraction-request') {
                                                        if (windowObject?.["DEV_MODE"] !== !![]) {
                                                          return;
                                                        }
                                                        openStoryRequestDebugPreview({
                                                          'documentObject': documentObject,
                                                          'windowObject': windowObject,
                                                          'title': "素材提取请求调试",
                                                          'preparePayload': () => captureStoryRequestPayload(_0x579549 => _0x3dd612["preview"](_0x579549)),
                                                          'subtitle': '预览当前提取链路的首个请求，不运行本地模型或发送\x20API。'
                                                        });
                                                        return;
                                                      } else {
                                                        if (_0x322a71 === "debug-asset-extraction-experimental-request") {
                                                          if (!isStoryAssetExperimentalExtractionAvailable(windowObject)) {
                                                            return;
                                                          }
                                                          void _0x48ed5a();
                                                        } else {
                                                          if (_0x322a71 === "plan-episode-outlines") {
                                                            void _0x2eae7b({
                                                              'advance': ![],
                                                              'confirmRegeneration': !![]
                                                            });
                                                          } else {
                                                            if (_0x322a71 === 'generate-episode-script') {
                                                              void _0x32896f(_0x923d8["dataset"]["storyEpisodeId"]);
                                                            } else {
                                                              if (_0x322a71 === 'generate-next-episode-script') {
                                                                const _0x364e60 = getNextStoryEpisodeScriptIndex(_0x46a1ea["data"]["episodes"]);
                                                                const _0x1ebfe4 = _0x46a1ea['data']["episodes"][_0x364e60];
                                                                if (_0x1ebfe4) {
                                                                  void _0x32896f(_0x1ebfe4['id']);
                                                                }
                                                              } else {
                                                                if (_0x322a71 === "continue-to-assets") {
                                                                  void _0x490a7b();
                                                                } else {
                                                                  if (_0x322a71 === "generate-episode-scripts-batch") {
                                                                    void _0x2338f9({
                                                                      'selectedOnly': _0x923d8["dataset"]["storyScriptBatchScope"] === 'selected'
                                                                    });
                                                                  } else {
                                                                    if (_0x322a71 === "cancel-episode-scripts-batch") {
                                                                      _0x3f794e();
                                                                    } else {
                                                                      if (_0x322a71 === 'toggle-script-selection') {
                                                                        _0x46a1ea["scriptSelectionMode"] = !![];
                                                                        _0x46a1ea["selectedScriptEpisodeIds"] = [];
                                                                        _0x325d8d();
                                                                      } else {
                                                                        if (_0x322a71 === "cancel-script-selection") {
                                                                          _0x46a1ea['scriptSelectionMode'] = ![];
                                                                          _0x46a1ea["selectedScriptEpisodeIds"] = [];
                                                                          _0x325d8d();
                                                                        } else {
                                                                          if (_0x322a71 === "select-all-script-episodes") {
                                                                            _0x46a1ea["selectedScriptEpisodeIds"] = getStoryEpisodeScriptBatchTargets(_0x46a1ea['data']['episodes'], [])["map"](_0x44c1dd => _0x44c1dd['id']);
                                                                            _0x325d8d();
                                                                          } else {
                                                                            if (_0x322a71 === "select-script-episode") {
                                                                              _0x1d7ac1["preventDefault"]();
                                                                              _0x2b8472(_0x923d8["dataset"]['storyEpisodeId']);
                                                                            } else {
                                                                              if (_0x322a71 === "toggle-project-sort-menu") {
                                                                                _0x1d7ac1["preventDefault"]();
                                                                                _0x1d7ac1["stopPropagation"]();
                                                                                const _0x26a330 = _0x923d8['closest']("[data-story-project-sort-wrap]");
                                                                                const _0x444511 = !_0x26a330?.["classList"]["contains"]("is-open");
                                                                                _0x358f94('');
                                                                                _0x1c1572();
                                                                                if (_0x444511) {
                                                                                  _0x2b965c(_0x26a330, _0x923d8);
                                                                                } else {
                                                                                  _0x2ed527();
                                                                                }
                                                                              } else {
                                                                                if (_0x322a71 === "select-project-sort") {
                                                                                  _0x1d7ac1["preventDefault"]();
                                                                                  _0x1d7ac1["stopPropagation"]();
                                                                                  _0x46a1ea["projectSortOrder"] = normalizeStoryProjectSortOrder(_0x923d8["dataset"]["storyProjectSortOption"]);
                                                                                  _0x358f94('');
                                                                                  _0x2ed527();
                                                                                  _0x325d8d({
                                                                                    'capturePageState': ![]
                                                                                  });
                                                                                } else {
                                                                                  if (_0x322a71 === "toggle-project-menu") {
                                                                                    _0x1d7ac1["preventDefault"]();
                                                                                    _0x1d7ac1['stopPropagation']();
                                                                                    const _0x505f63 = normalizeText(_0x923d8['dataset']['storyProjectId']);
                                                                                    _0x46a1ea['pendingDeleteProjectId'] = '';
                                                                                    const _0x4e6c18 = _0x46a1ea["openProjectMenuId"] !== _0x505f63;
                                                                                    _0x2ed527();
                                                                                    _0x358f94(_0x4e6c18 ? _0x505f63 : '');
                                                                                  } else {
                                                                                    if (_0x322a71 === "rename-project") {
                                                                                      const _0x124bf2 = normalizeText(_0x923d8["dataset"]["storyProjectId"]);
                                                                                      _0x46a1ea['openProjectMenuId'] = '';
                                                                                      _0x325d8d();
                                                                                      _0x4316a5(_0x124bf2);
                                                                                    } else {
                                                                                      if (_0x322a71 === "duplicate-project") {
                                                                                        _0x431340(_0x923d8["dataset"]["storyProjectId"]);
                                                                                      } else {
                                                                                        if (_0x322a71 === "collect-project") {
                                                                                          void _0x45afa5(_0x923d8["dataset"]["storyProjectId"]);
                                                                                        } else {
                                                                                          if (_0x322a71 === "import-project") {
                                                                                            void _0x4ee682();
                                                                                          } else {
                                                                                            if (_0x322a71 === 'archive-project') {
                                                                                              _0x21b3de(_0x923d8["dataset"]["storyProjectId"], !![]);
                                                                                            } else {
                                                                                              if (_0x322a71 === "unarchive-project") {
                                                                                                _0x21b3de(_0x923d8['dataset']["storyProjectId"], ![]);
                                                                                              } else {
                                                                                                if (_0x322a71 === "toggle-archived-projects") {
                                                                                                  _0x46a1ea["showArchivedProjects"] = !_0x46a1ea["showArchivedProjects"];
                                                                                                  _0x46a1ea["openProjectMenuId"] = '';
                                                                                                  _0x46a1ea["pendingDeleteProjectId"] = '';
                                                                                                  _0x325d8d();
                                                                                                } else {
                                                                                                  if (_0x322a71 === "request-delete-project") {
                                                                                                    _0x46a1ea["openProjectMenuId"] = '';
                                                                                                    _0x46a1ea["pendingDeleteProjectId"] = normalizeText(_0x923d8["dataset"]["storyProjectId"]);
                                                                                                    _0x325d8d();
                                                                                                  } else {
                                                                                                    if (_0x322a71 === "cancel-delete-project") {
                                                                                                      _0x46a1ea["pendingDeleteProjectId"] = '';
                                                                                                      _0x325d8d();
                                                                                                    } else {
                                                                                                      if (_0x322a71 === 'confirm-delete-project') {
                                                                                                        _0x15d598(_0x923d8["dataset"]['storyProjectId']);
                                                                                                      } else {
                                                                                                        if (_0x322a71 === "delete-clip-frame") {
                                                                                                          _0x1d7ac1["preventDefault"]();
                                                                                                          _0x1d7ac1["stopPropagation"]();
                                                                                                          void _0x3e4f00(_0x923d8["dataset"]["storyClipFrameId"]);
                                                                                                        } else {
                                                                                                          if (_0x322a71 === "request-delete-clip") {
                                                                                                            if (_0x46a1ea['clipSelectionMode']) {
                                                                                                              return;
                                                                                                            }
                                                                                                            if (storyClipProduction["getGenerationState"](_0x46a1ea, getSelectedEpisode(_0x46a1ea))["busy"]) {
                                                                                                              _0x49e2b8('请等待当前视频生成任务完成。', "info");
                                                                                                              return;
                                                                                                            }
                                                                                                            _0x46a1ea['pendingDeleteClipId'] = normalizeText(_0x923d8["dataset"]["storyClipDeleteId"]);
                                                                                                            _0x325d8d();
                                                                                                          } else {
                                                                                                            if (_0x322a71 === 'cancel-delete-clip') {
                                                                                                              _0x46a1ea["pendingDeleteClipId"] = '';
                                                                                                              _0x325d8d();
                                                                                                            } else {
                                                                                                              if (_0x322a71 === "confirm-delete-clip") {
                                                                                                                if (storyClipProduction["getGenerationState"](_0x46a1ea, getSelectedEpisode(_0x46a1ea))["busy"]) {
                                                                                                                  _0x46a1ea["pendingDeleteClipId"] = '';
                                                                                                                  _0x325d8d();
                                                                                                                  _0x49e2b8("请等待当前视频生成任务完成。", "info");
                                                                                                                  return;
                                                                                                                }
                                                                                                                _0x27e3d7(_0x923d8["dataset"]["storyClipDeleteId"]);
                                                                                                              } else {
                                                                                                                if (_0x322a71 === "extract-assets") {
                                                                                                                  void _0xecce1e({
                                                                                                                    'advance': !![]
                                                                                                                  });
                                                                                                                } else {
                                                                                                                  if (_0x322a71 === 'extract-assets-experimental') {
                                                                                                                    if (!isStoryAssetExperimentalExtractionAvailable(windowObject)) {
                                                                                                                      return;
                                                                                                                    }
                                                                                                                    void _0xecce1e({
                                                                                                                      'advance': !![],
                                                                                                                      'experimental': !![]
                                                                                                                    });
                                                                                                                  } else {
                                                                                                                    if (_0x322a71 === "plan-episodes") {
                                                                                                                      void _0x2eae7b({
                                                                                                                        'advance': !![]
                                                                                                                      });
                                                                                                                    } else {
                                                                                                                      if (_0x322a71 === "open-episode-stage") {
                                                                                                                        void _0x2d69e6({
                                                                                                                          'confirmMissingImages': !![]
                                                                                                                        });
                                                                                                                      } else {
                                                                                                                        if (_0x322a71 === "toggle-experimental-split-mode") {
                                                                                                                          const _0x4b34a8 = getStoryEpisodeBatchControlState(_0x46a1ea);
                                                                                                                          if (_0x4b34a8["disabled"] || Array['isArray'](_0x46a1ea["splittingEpisodeIds"]) && _0x46a1ea["splittingEpisodeIds"]["length"] > 0x0) {
                                                                                                                            return;
                                                                                                                          }
                                                                                                                          _0x46a1ea["experimentalSplitMode"] = !shouldUseStoryEpisodeExperimentalSplit(_0x46a1ea);
                                                                                                                          _0x18eeff();
                                                                                                                          _0x325d8d();
                                                                                                                        } else {
                                                                                                                          if (_0x322a71 === "toggle-episode-selection") {
                                                                                                                            _0x46a1ea['episodeSelectionMode'] = !![];
                                                                                                                            _0x46a1ea["selectedEpisodeIds"] = [];
                                                                                                                            _0x325d8d();
                                                                                                                          } else {
                                                                                                                            if (_0x322a71 === "cancel-episode-selection") {
                                                                                                                              _0x4f29a0["cancel"]();
                                                                                                                              _0x46a1ea["episodeSelectionMode"] = ![];
                                                                                                                              _0x46a1ea['selectedEpisodeIds'] = [];
                                                                                                                              _0x325d8d();
                                                                                                                            } else {
                                                                                                                              if (_0x322a71 === "toggle-all-episodes") {
                                                                                                                                _0x46a1ea['selectedEpisodeIds'] = toggleStoryEpisodeSelectAll(getStoryVideoEpisodes(_0x46a1ea['data']["episodes"]), _0x46a1ea['selectedEpisodeIds']);
                                                                                                                                _0x325d8d();
                                                                                                                              } else {
                                                                                                                                if (_0x322a71 === "split-selected-episodes") {
                                                                                                                                  void _0x379a49({
                                                                                                                                    'selectionMode': !![]
                                                                                                                                  });
                                                                                                                                } else {
                                                                                                                                  if (_0x322a71 === "split-all-episodes") {
                                                                                                                                    void _0x379a49({
                                                                                                                                      'selectionMode': ![]
                                                                                                                                    });
                                                                                                                                  } else {
                                                                                                                                    if (_0x322a71 === "cancel-episode-split-batch") {
                                                                                                                                      _0x7d037e();
                                                                                                                                    } else {
                                                                                                                                      if (_0x322a71 === "split-episode") {
                                                                                                                                        void _0x6bbe9a(_0x923d8["dataset"]["storyEpisodeId"], {
                                                                                                                                          'openAfter': ![]
                                                                                                                                        });
                                                                                                                                      } else {
                                                                                                                                        if (_0x322a71 === "experimental-split-episode") {
                                                                                                                                          if (!isStoryEpisodeExperimentalSplitAvailable(windowObject)) {
                                                                                                                                            return;
                                                                                                                                          }
                                                                                                                                          void _0x16b2e7(_0x923d8["dataset"]["storyEpisodeId"]);
                                                                                                                                        } else {
                                                                                                                                          if (_0x322a71 === "debug-episode-split-request") {
                                                                                                                                            void _0x23c461(_0x923d8["dataset"]["storyEpisodeId"], shouldUseStoryEpisodeExperimentalSplit(_0x46a1ea));
                                                                                                                                            return;
                                                                                                                                          } else {
                                                                                                                                            if (_0x322a71 === 'debug-experimental-split-request') {
                                                                                                                                              if (!isStoryEpisodeExperimentalSplitAvailable(windowObject)) {
                                                                                                                                                return;
                                                                                                                                              }
                                                                                                                                              void _0x23c461(_0x923d8["dataset"]["storyEpisodeId"]);
                                                                                                                                            } else {
                                                                                                                                              if (_0x322a71 === "regenerate-episode") {
                                                                                                                                                void _0x6bbe9a(_0x923d8["dataset"]["storyEpisodeId"], {
                                                                                                                                                  'openAfter': ![]
                                                                                                                                                });
                                                                                                                                              } else {
                                                                                                                                                if (_0x322a71 === 'repair-episode-split-draft') {
                                                                                                                                                  _0x48dc3b(_0x923d8['dataset']["storyEpisodeId"]);
                                                                                                                                                } else {
                                                                                                                                                  if (_0x322a71 === "new-story") {
                                                                                                                                                    _0x5f3b24();
                                                                                                                                                    _0x325d8d();
                                                                                                                                                    _0x329e8d["querySelector"]("[data-story-idea-input]")?.["focus"]();
                                                                                                                                                  } else {
                                                                                                                                                    if (_0x322a71 === "back-home") {
                                                                                                                                                      _0x18eeff({
                                                                                                                                                        'immediate': !![]
                                                                                                                                                      });
                                                                                                                                                      _0x46a1ea['view'] = 'home';
                                                                                                                                                      _0x325d8d({
                                                                                                                                                        'direction': "backward"
                                                                                                                                                      });
                                                                                                                                                    } else {
                                                                                                                                                      if (_0x322a71 === 'previous-step') {
                                                                                                                                                        _0x2b8231(_0x46a1ea['step'] - 0x1);
                                                                                                                                                      } else {
                                                                                                                                                        if (_0x322a71 === 'finish-story-workbench') {
                                                                                                                                                          _0x46a1ea["view"] = "home";
                                                                                                                                                          _0x18eeff({
                                                                                                                                                            'immediate': !![]
                                                                                                                                                          });
                                                                                                                                                          _0x325d8d({
                                                                                                                                                            'direction': 'backward'
                                                                                                                                                          });
                                                                                                                                                          _0x49e2b8("剧本工作室已保存。", "success");
                                                                                                                                                        } else {
                                                                                                                                                          if (_0x322a71 === "request-delete-asset-appearance") {
                                                                                                                                                            if (_0x923d8["dataset"]["storyCardAppearanceId"]) {
                                                                                                                                                              _0x46a1ea["selectedAssetId"] = _0x923d8["dataset"]["storyCardAppearanceId"];
                                                                                                                                                            }
                                                                                                                                                            const _0x1bcf1b = findStoryAsset(_0x46a1ea, _0x46a1ea["selectedAssetId"]);
                                                                                                                                                            const _0x563bfc = _0x1bcf1b ? getSelectedAssetAppearance(_0x46a1ea, _0x1bcf1b) : null;
                                                                                                                                                            const _0xf4dfca = getStoryAssetAppearanceActionKey(_0x1bcf1b, _0x563bfc);
                                                                                                                                                            if (!_0x1bcf1b || !_0x563bfc || !_0xf4dfca) {
                                                                                                                                                              return;
                                                                                                                                                            }
                                                                                                                                                            if (!isStoryAddedAssetAppearance(_0x563bfc) || getStoryAssetAppearances(_0x1bcf1b)["length"] <= 0x1) {
                                                                                                                                                              _0x49e2b8("剧本识别出的原始形象不能删除。", 'warn');
                                                                                                                                                              return;
                                                                                                                                                            }
                                                                                                                                                            if (isStoryAssetAppearanceLoading(_0x46a1ea, _0x1bcf1b['id'], _0x563bfc['id']) || normalizeText(_0x46a1ea['exportingAssetAppearanceKey']) === _0xf4dfca) {
                                                                                                                                                              _0x49e2b8("请等待当前形象任务完成。", "info");
                                                                                                                                                              return;
                                                                                                                                                            }
                                                                                                                                                            _0x46a1ea["pendingDeleteAssetAppearanceKey"] = _0xf4dfca;
                                                                                                                                                            _0x325d8d();
                                                                                                                                                          } else {
                                                                                                                                                            if (_0x322a71 === "cancel-delete-asset-appearance") {
                                                                                                                                                              _0x46a1ea["pendingDeleteAssetAppearanceKey"] = '';
                                                                                                                                                              _0x325d8d();
                                                                                                                                                            } else {
                                                                                                                                                              if (_0x322a71 === 'confirm-delete-asset-appearance') {
                                                                                                                                                                const _0x2b157a = findStoryAsset(_0x46a1ea, _0x46a1ea["selectedAssetId"]);
                                                                                                                                                                const _0x4d3fcf = _0x2b157a ? getSelectedAssetAppearance(_0x46a1ea, _0x2b157a) : null;
                                                                                                                                                                const _0x16902f = getStoryAssetAppearanceActionKey(_0x2b157a, _0x4d3fcf);
                                                                                                                                                                if (!_0x2b157a || !_0x4d3fcf || !_0x16902f || _0x16902f !== normalizeText(_0x46a1ea["pendingDeleteAssetAppearanceKey"])) {
                                                                                                                                                                  return;
                                                                                                                                                                }
                                                                                                                                                                if (isStoryAssetAppearanceLoading(_0x46a1ea, _0x2b157a['id'], _0x4d3fcf['id']) || normalizeText(_0x46a1ea['exportingAssetAppearanceKey']) === _0x16902f) {
                                                                                                                                                                  _0x46a1ea["pendingDeleteAssetAppearanceKey"] = '';
                                                                                                                                                                  _0x325d8d();
                                                                                                                                                                  _0x49e2b8("请等待当前形象任务完成。", "info");
                                                                                                                                                                  return;
                                                                                                                                                                }
                                                                                                                                                                const _0x14117f = removeStoryAddedAssetAppearance(_0x2b157a, _0x4d3fcf['id']);
                                                                                                                                                                _0x46a1ea["pendingDeleteAssetAppearanceKey"] = '';
                                                                                                                                                                if (!_0x14117f["removed"]) {
                                                                                                                                                                  _0x325d8d();
                                                                                                                                                                  _0x49e2b8("剧本识别出的原始形象不能删除。", "warn");
                                                                                                                                                                  return;
                                                                                                                                                                }
                                                                                                                                                                _0x46a1ea["assetAppearanceIndexes"] = {
                                                                                                                                                                  ..._0x46a1ea['assetAppearanceIndexes'],
                                                                                                                                                                  [_0x2b157a['id']]: _0x14117f["nextIndex"]
                                                                                                                                                                };
                                                                                                                                                                _0x18eeff({
                                                                                                                                                                  'immediate': !![]
                                                                                                                                                                });
                                                                                                                                                                _0x325d8d();
                                                                                                                                                                _0x49e2b8("追加形象已删除，原始形象仍保留。", 'success');
                                                                                                                                                              } else {
                                                                                                                                                                if (_0x322a71 === 'upload-asset') {
                                                                                                                                                                  _0x46a1ea["pendingAssetUploadId"] = _0x46a1ea["selectedAssetId"];
                                                                                                                                                                  const _0x32ad3e = findStoryAsset(_0x46a1ea, _0x46a1ea['selectedAssetId']);
                                                                                                                                                                  _0x46a1ea["pendingAssetAppearanceId"] = getSelectedAssetAppearance(_0x46a1ea, _0x32ad3e)?.['id'] || '';
                                                                                                                                                                  _0x1d089a = {
                                                                                                                                                                    'projectToken': _0x3e5ebf(_0x46a1ea),
                                                                                                                                                                    'assetId': _0x46a1ea['pendingAssetUploadId'],
                                                                                                                                                                    'appearanceId': _0x46a1ea["pendingAssetAppearanceId"]
                                                                                                                                                                  };
                                                                                                                                                                  _0x5f4c78?.['click']();
                                                                                                                                                                } else {
                                                                                                                                                                  if (_0x322a71 === "upload-asset-reference") {
                                                                                                                                                                    const _0x15e7f5 = findStoryAsset(_0x46a1ea, _0x46a1ea["selectedAssetId"]);
                                                                                                                                                                    const _0x551327 = _0x15e7f5 ? getSelectedAssetAppearance(_0x46a1ea, _0x15e7f5) : null;
                                                                                                                                                                    if (!_0x15e7f5 || !_0x551327 || !canEditStoryAssetStyleReference(_0x15e7f5, _0x551327)) {
                                                                                                                                                                      _0x49e2b8("当前素材暂不支持上传风格参考。", "warn");
                                                                                                                                                                    } else {
                                                                                                                                                                      isStoryAssetAppearanceLoading(_0x46a1ea, _0x15e7f5['id'], _0x551327['id']) ? _0x49e2b8("请等待当前生成或上传任务完成。", 'info') : (_0x2e3181 = {
                                                                                                                                                                        'projectToken': _0x3e5ebf(_0x46a1ea),
                                                                                                                                                                        'assetId': _0x15e7f5['id'],
                                                                                                                                                                        'appearanceId': _0x551327['id']
                                                                                                                                                                      }, _0x3e617c?.["click"]());
                                                                                                                                                                    }
                                                                                                                                                                  } else {
                                                                                                                                                                    if (_0x322a71 === "remove-asset-reference") {
                                                                                                                                                                      const _0xff8bcf = findStoryAsset(_0x46a1ea, _0x46a1ea['selectedAssetId']);
                                                                                                                                                                      const _0x3c76b2 = _0xff8bcf ? getSelectedAssetAppearance(_0x46a1ea, _0xff8bcf) : null;
                                                                                                                                                                      _0xff8bcf && _0x3c76b2 && !isStoryAssetAppearanceLoading(_0x46a1ea, _0xff8bcf['id'], _0x3c76b2['id']) && clearStoryAssetAppearanceReferenceImage(_0x3c76b2) && (_0x44d78e(_0xff8bcf['id']), _0x3c03fa(), _0x18eeff({
                                                                                                                                                                        'immediate': !![]
                                                                                                                                                                      }), _0x49e2b8("风格参考已删除。", "success"));
                                                                                                                                                                    } else {
                                                                                                                                                                      if (_0x322a71 === "play-character-voice") {
                                                                                                                                                                        void _0xc97927(_0x923d8["dataset"]["storyVoiceAssetId"] || _0x46a1ea["selectedAssetId"]);
                                                                                                                                                                      } else {
                                                                                                                                                                        if (_0x322a71 === "open-character-voice") {
                                                                                                                                                                          _0x1747e6(_0x46a1ea["selectedAssetId"]);
                                                                                                                                                                        } else {
                                                                                                                                                                          if (_0x322a71 === 'close-character-voice') {
                                                                                                                                                                            _0x425497();
                                                                                                                                                                          } else {
                                                                                                                                                                            if (_0x322a71 === "upload-character-voice") {
                                                                                                                                                                              _0x46a1ea["pendingCharacterVoiceAssetId"] = _0x46a1ea['characterVoiceEditor']?.['assetId'] || '';
                                                                                                                                                                              _0x49e1b2 = {
                                                                                                                                                                                'projectToken': _0x3e5ebf(_0x46a1ea),
                                                                                                                                                                                'assetId': _0x46a1ea["pendingCharacterVoiceAssetId"],
                                                                                                                                                                                'editor': _0x46a1ea["characterVoiceEditor"]
                                                                                                                                                                              };
                                                                                                                                                                              _0x21ef4b?.["click"]();
                                                                                                                                                                            } else {
                                                                                                                                                                              if (_0x322a71 === "remove-character-voice") {
                                                                                                                                                                                const _0x49d996 = findStoryAsset(_0x46a1ea, _0x46a1ea["characterVoiceEditor"]?.["assetId"]);
                                                                                                                                                                                _0x49d996 && (_0x22f2d9(), clearStoryCharacterVoiceReference(_0x49d996), _0x18eeff({
                                                                                                                                                                                  'immediate': !![]
                                                                                                                                                                                }), _0x325d8d(), _0x49e2b8("已移除角色声音参考。", "success"));
                                                                                                                                                                              } else {
                                                                                                                                                                                if (_0x322a71 === 'toggle-character-voice-history') {
                                                                                                                                                                                  const _0x4501b2 = _0x923d8["closest"](".story-character-voice-history-wrap");
                                                                                                                                                                                  const _0x3437c6 = _0x4501b2?.["querySelector"]('.story-character-voice-history-panel');
                                                                                                                                                                                  const _0x34e60c = !_0x4501b2?.['classList']['contains']("is-open");
                                                                                                                                                                                  _0x36cc45(_0x4501b2);
                                                                                                                                                                                  _0x4501b2?.['classList']['toggle']("is-open", _0x34e60c);
                                                                                                                                                                                  _0x923d8['setAttribute']("aria-expanded", String(_0x34e60c));
                                                                                                                                                                                  _0x3437c6?.['setAttribute']("aria-hidden", String(!_0x34e60c));
                                                                                                                                                                                } else {
                                                                                                                                                                                  if (_0x322a71 === "generate-character-voice") {
                                                                                                                                                                                    void _0x1dce2a();
                                                                                                                                                                                  } else {
                                                                                                                                                                                    if (_0x322a71 === 'download-asset-image') {
                                                                                                                                                                                      void _0xd62ad3(_0x923d8);
                                                                                                                                                                                    } else {
                                                                                                                                                                                      if (_0x322a71 === "add-asset-appearance-to-library") {
                                                                                                                                                                                        void _0x16077c();
                                                                                                                                                                                      } else {
                                                                                                                                                                                        if (_0x322a71 === 'previous-appearance') {
                                                                                                                                                                                          _0x3841b3(-0x1, _0x923d8['dataset']["storyCardAppearanceId"] || _0x46a1ea["selectedAssetId"]);
                                                                                                                                                                                        } else {
                                                                                                                                                                                          if (_0x322a71 === "next-appearance") {
                                                                                                                                                                                            _0x3841b3(0x1, _0x923d8['dataset']['storyCardAppearanceId'] || _0x46a1ea["selectedAssetId"]);
                                                                                                                                                                                          } else {
                                                                                                                                                                                            if (_0x322a71 === "previous-clip") {
                                                                                                                                                                                              _0x3590ea(-0x1);
                                                                                                                                                                                            } else {
                                                                                                                                                                                              if (_0x322a71 === "next-clip") {
                                                                                                                                                                                                _0x3590ea(0x1);
                                                                                                                                                                                              } else {
                                                                                                                                                                                                if (_0x322a71 === 'previous-video-result') {
                                                                                                                                                                                                  _0x14206a(-0x1);
                                                                                                                                                                                                } else {
                                                                                                                                                                                                  if (_0x322a71 === "next-video-result") {
                                                                                                                                                                                                    _0x14206a(0x1);
                                                                                                                                                                                                  } else {
                                                                                                                                                                                                    if (_0x322a71 === 'select-video-result') {
                                                                                                                                                                                                      _0x34de48(_0x923d8["dataset"]['storyClipId'], _0x923d8["dataset"]["storyVideoResultIndex"]);
                                                                                                                                                                                                    } else {
                                                                                                                                                                                                      if (_0x322a71 === 'delete-video-result') {
                                                                                                                                                                                                        _0x1e3076(_0x923d8["dataset"]["storyClipId"], _0x923d8["dataset"]["storyVideoResultIndex"]);
                                                                                                                                                                                                      } else {
                                                                                                                                                                                                        if (_0x322a71 === "capture-video-frame") {
                                                                                                                                                                                                          void _0x418bc5(_0x923d8);
                                                                                                                                                                                                        } else {
                                                                                                                                                                                                          if (_0x322a71 === 'trim-video') {
                                                                                                                                                                                                            _0x53a76e(_0x923d8);
                                                                                                                                                                                                          } else {
                                                                                                                                                                                                            if (_0x322a71 === "set-base-appearance") {
                                                                                                                                                                                                              const _0x251d8e = findStoryAsset(_0x46a1ea, _0x46a1ea['selectedAssetId']);
                                                                                                                                                                                                              const _0xbf1519 = _0x251d8e ? getSelectedAssetAppearance(_0x46a1ea, _0x251d8e) : null;
                                                                                                                                                                                                              if (_0x251d8e && isStoryAssetCardLoading(_0x46a1ea, _0x251d8e['id'])) {
                                                                                                                                                                                                                _0x49e2b8("请等待当前生成任务完成。", "info");
                                                                                                                                                                                                              } else {
                                                                                                                                                                                                                if (!_0x251d8e || !_0xbf1519) {
                                                                                                                                                                                                                  _0x49e2b8("当前形象不可用。", 'warn');
                                                                                                                                                                                                                } else {
                                                                                                                                                                                                                  setStoryAssetBaseAppearance(_0x251d8e, _0xbf1519['id']) && (_0x44d78e(_0x251d8e['id']), _0x3c03fa(), _0x18eeff({
                                                                                                                                                                                                                    'immediate': !![]
                                                                                                                                                                                                                  }), _0x49e2b8("已设为基础形象；生成后会作为其他形象的参考。", "success"));
                                                                                                                                                                                                                }
                                                                                                                                                                                                              }
                                                                                                                                                                                                            } else {
                                                                                                                                                                                                              if (_0x322a71 === "toggle-asset-selection") {
                                                                                                                                                                                                                _0x46a1ea["assetSelectionMode"] = !![];
                                                                                                                                                                                                                _0x46a1ea["selectedAssetIds"] = [];
                                                                                                                                                                                                                _0x325d8d();
                                                                                                                                                                                                              } else {
                                                                                                                                                                                                                if (_0x322a71 === "cancel-asset-selection") {
                                                                                                                                                                                                                  _0x4f29a0['cancel']();
                                                                                                                                                                                                                  _0x46a1ea["assetSelectionMode"] = ![];
                                                                                                                                                                                                                  _0x46a1ea["selectedAssetIds"] = [];
                                                                                                                                                                                                                  _0x325d8d();
                                                                                                                                                                                                                } else {
                                                                                                                                                                                                                  if (_0x322a71 === "toggle-all-assets") {
                                                                                                                                                                                                                    const _0x5d803c = getVisibleStoryAssets(_0x46a1ea);
                                                                                                                                                                                                                    _0x46a1ea["selectedAssetIds"] = toggleStoryAssetSelectAll(_0x46a1ea["assetFilter"] === "library" ? _0x5d803c["filter"](_0x2dbda4 => normalizeText(_0x2dbda4?.["mediaKind"])["toLowerCase"]() === "image" && normalizeText(_0x2dbda4?.["sourceUrl"] || _0x2dbda4?.["imageUrl"])) : _0x5d803c, _0x46a1ea["selectedAssetIds"]);
                                                                                                                                                                                                                    _0x325d8d();
                                                                                                                                                                                                                  } else {
                                                                                                                                                                                                                    if (_0x322a71 === "add-library-assets-to-project") {
                                                                                                                                                                                                                      const _0x4478d5 = _0x923d8["closest"]('.story-asset-batch-menu-wrap');
                                                                                                                                                                                                                      const _0xa8fb9d = !_0x4478d5?.['classList']['contains']("is-open");
                                                                                                                                                                                                                      if (_0xa8fb9d) {
                                                                                                                                                                                                                        _0x54519a(_0x4478d5, _0x923d8);
                                                                                                                                                                                                                      } else {
                                                                                                                                                                                                                        _0x2c03e7();
                                                                                                                                                                                                                      }
                                                                                                                                                                                                                    } else {
                                                                                                                                                                                                                      if (_0x322a71 === "cancel-asset-batch-generation") {
                                                                                                                                                                                                                        _0x171881();
                                                                                                                                                                                                                      } else {
                                                                                                                                                                                                                        if (_0x322a71 === "batch-generate-assets") {
                                                                                                                                                                                                                          _0x1b3da4();
                                                                                                                                                                                                                          _0x1c1572();
                                                                                                                                                                                                                          const _0x5360c2 = _0x923d8["dataset"]["storyAssetBatchDirectMode"];
                                                                                                                                                                                                                          if (_0x5360c2) {
                                                                                                                                                                                                                            _0x2c03e7();
                                                                                                                                                                                                                            void _0x46f291(_0x5360c2);
                                                                                                                                                                                                                            return;
                                                                                                                                                                                                                          }
                                                                                                                                                                                                                          const _0x1bc21 = _0x923d8['closest'](".story-asset-batch-menu-wrap");
                                                                                                                                                                                                                          const _0x401d96 = !_0x1bc21?.["classList"]["contains"]('is-open');
                                                                                                                                                                                                                          if (_0x401d96) {
                                                                                                                                                                                                                            _0x54519a(_0x1bc21, _0x923d8);
                                                                                                                                                                                                                          } else {
                                                                                                                                                                                                                            _0x2c03e7();
                                                                                                                                                                                                                          }
                                                                                                                                                                                                                        } else {
                                                                                                                                                                                                                          if (_0x322a71 === "toggle-clip-selection") {
                                                                                                                                                                                                                            _0x46a1ea["pendingDeleteClipId"] = '';
                                                                                                                                                                                                                            _0x46a1ea['clipSelectionMode'] = !![];
                                                                                                                                                                                                                            _0x46a1ea['selectedClipGenerationIds'] = [];
                                                                                                                                                                                                                            _0x285a4f();
                                                                                                                                                                                                                            _0x36221b();
                                                                                                                                                                                                                          } else {
                                                                                                                                                                                                                            if (_0x322a71 === "select-all-clips") {
                                                                                                                                                                                                                              const _0x2c327a = getSelectedEpisode(_0x46a1ea);
                                                                                                                                                                                                                              const _0x2e78ff = new Set(storyClipProduction['getGenerationState'](_0x46a1ea, _0x2c327a)["generatingClipIds"]);
                                                                                                                                                                                                                              _0x46a1ea["selectedClipGenerationIds"] = (_0x2c327a?.["clips"] || [])['filter'](_0xae2bb7 => !_0x2e78ff["has"](normalizeText(_0xae2bb7?.['id'])))["map"](_0x163912 => normalizeText(_0x163912?.['id']))['filter'](Boolean);
                                                                                                                                                                                                                              _0x36221b();
                                                                                                                                                                                                                            } else {
                                                                                                                                                                                                                              if (_0x322a71 === 'cancel-clip-selection') {
                                                                                                                                                                                                                                _0x4f29a0["cancel"]();
                                                                                                                                                                                                                                _0x46a1ea["clipSelectionMode"] = ![];
                                                                                                                                                                                                                                _0x46a1ea['selectedClipGenerationIds'] = [];
                                                                                                                                                                                                                                _0x36221b();
                                                                                                                                                                                                                              } else {
                                                                                                                                                                                                                                if (_0x322a71 === 'episode-back') {
                                                                                                                                                                                                                                  _0x4f29a0['cancel']();
                                                                                                                                                                                                                                  _0x46a1ea["clipSelectionMode"] = ![];
                                                                                                                                                                                                                                  _0x46a1ea["selectedClipGenerationIds"] = [];
                                                                                                                                                                                                                                  void _0x2b8231(canEnterStoryWorkspaceStep(_0x46a1ea["data"], 0x3) ? 0x3 : 0x1);
                                                                                                                                                                                                                                } else {
                                                                                                                                                                                                                                  if (_0x322a71 === "toggle-canvas-sync-menu") {
                                                                                                                                                                                                                                    const _0x3b5040 = _0x923d8['closest']('.story-canvas-sync-menu-wrap');
                                                                                                                                                                                                                                    const _0x88e807 = !_0x3b5040?.["classList"]["contains"]("is-open");
                                                                                                                                                                                                                                    _0x2c03e7();
                                                                                                                                                                                                                                    if (_0x88e807) {
                                                                                                                                                                                                                                      _0xcf8eeb(_0x3b5040, _0x923d8);
                                                                                                                                                                                                                                    } else {
                                                                                                                                                                                                                                      _0x285a4f();
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                  } else {
                                                                                                                                                                                                                                    if (_0x322a71 === "sync-episode-to-canvas") {
                                                                                                                                                                                                                                      _0x285a4f();
                                                                                                                                                                                                                                      void _0x2e2337();
                                                                                                                                                                                                                                    } else {
                                                                                                                                                                                                                                      if (_0x322a71 === "sync-project-to-canvas") {
                                                                                                                                                                                                                                        _0x285a4f();
                                                                                                                                                                                                                                        void _0x5e96c3();
                                                                                                                                                                                                                                      } else {
                                                                                                                                                                                                                                        if (_0x322a71 === "export-current-clip") {
                                                                                                                                                                                                                                          const _0x49b5a2 = _0x923d8["closest"](".story-clip-export-menu-wrap")?.['querySelector'](".story-menu-trigger");
                                                                                                                                                                                                                                          _0x285a4f();
                                                                                                                                                                                                                                          void _0x3e0a11("current", _0x49b5a2);
                                                                                                                                                                                                                                        } else {
                                                                                                                                                                                                                                          if (_0x322a71 === "export-episode-clips") {
                                                                                                                                                                                                                                            const _0x2d6971 = _0x923d8["closest"](".story-clip-export-menu-wrap")?.["querySelector"](".story-menu-trigger");
                                                                                                                                                                                                                                            _0x285a4f();
                                                                                                                                                                                                                                            void _0x3e0a11("episode", _0x2d6971);
                                                                                                                                                                                                                                          } else {
                                                                                                                                                                                                                                            if (_0x322a71 === "cancel-clip-batch-generation") {
                                                                                                                                                                                                                                              void _0x4b9463["cancelBatch"]();
                                                                                                                                                                                                                                            } else {
                                                                                                                                                                                                                                              if (["debug-asset-image", 'debug-clip-video', "debug-character-voice"]['includes'](_0x322a71)) {
                                                                                                                                                                                                                                                if (windowObject?.["DEV_MODE"] !== !![]) {
                                                                                                                                                                                                                                                  return;
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                openDebugRequestWindow({
                                                                                                                                                                                                                                                  'documentObject': documentObject,
                                                                                                                                                                                                                                                  'windowObject': windowObject,
                                                                                                                                                                                                                                                  'title': "剧本工作室请求调试",
                                                                                                                                                                                                                                                  'prepare': async () => buildGenerationDebugPreview(_0x322a71 === "debug-asset-image" ? _0x441762["previewSelected"]() : _0x322a71 === 'debug-character-voice' ? _0x14b900["previewSelected"]() : _0x4b9463["previewSelection"]())
                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                return;
                                                                                                                                                                                                                                              } else {
                                                                                                                                                                                                                                                if (_0x322a71 === "generate-clip-video") {
                                                                                                                                                                                                                                                  void _0x3f0eb3();
                                                                                                                                                                                                                                                } else {
                                                                                                                                                                                                                                                  _0x322a71 === "generate-asset" && void _0x4c9482();
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
                }
              }
            }
          }
        }
      }
    }
    if (_0x3654ac["getRevision"]() === _0x4358fe) {
      _0x18eeff({
        'action': _0x322a71
      });
    }
  });
  _0x329e8d["addEventListener"]("input", _0x46c48f => {
    if (_0x46c48f["target"]["matches"]('[data-story-custom-episode-count-input]')) {
      const _0x4f7b64 = String(_0x46c48f["target"]["value"] || '')['replace'](/\D+/gu, '')["slice"](0x0, 0x3);
      _0x46c48f["target"]['value'] = _0x4f7b64 && Number(_0x4f7b64) > STORY_EPISODE_COUNT_MAX ? String(STORY_EPISODE_COUNT_MAX) : _0x4f7b64;
      return;
    }
    if (_0x46c48f['target']["matches"]("[data-story-clip-adjustment-instruction]")) {
      _0x46a1ea["clipAdjustmentInstruction"] = String(_0x46c48f["target"]["value"] || '')["slice"](0x0, 0x258);
      const _0x2fff1c = getSelectedEpisode(_0x46a1ea);
      const _0x4090ce = getSelectedClip(_0x46a1ea, _0x2fff1c);
      const _0x1350c4 = normalizeStoryPromptMode(_0x4090ce?.['promptMode'] || _0x2fff1c?.['promptMode'] || _0x46a1ea["data"]["project"]?.["planning"]?.['promptMode'], {
        'allowDeveloperModes': !![]
      });
      const _0x1a336f = normalizeStoryPromptMode(_0x46a1ea['clipAdjustmentPromptMode'] || _0x1350c4, {
        'allowDeveloperModes': !![]
      });
      const _0x33d17e = _0x46c48f['target']["closest"]("[data-story-clip-adjustment-bar]")?.['querySelector']('[data-story-action=\x22generate-clip-adjustment\x22]');
      _0x33d17e && (_0x33d17e["disabled"] = !canGenerateStoryClipAdjustment(_0x46a1ea, _0x2fff1c, _0x4090ce));
      return;
    }
    if (_0x46c48f["target"]["matches"]("[data-story-project-search]")) {
      const _0x3438d2 = String(_0x46c48f['target']["value"] || '')['slice'](0x0, 0x78);
      _0x46a1ea["projectSearchQuery"] = _0x3438d2;
      _0x46a1ea["openProjectMenuId"] = '';
      _0x46c48f["target"]["value"] = _0x3438d2;
      const _0x1145cc = refreshWorkspaceProjectResultsInPlace({
        'root': _0x46c48f["target"]["closest"]?.('.story-home-page') || _0x329e8d,
        'documentObject': documentObject,
        'renderResults': () => renderStoryHomeProjectResults(_0x46a1ea)
      });
      if (!_0x1145cc) {
        _0x325d8d({
          'capturePageState': ![]
        });
      }
      const _0x502d2f = _0x1145cc ? _0x46c48f["target"] : _0x329e8d["querySelector"]("[data-story-project-search]");
      _0x502d2f?.["focus"]();
      _0x502d2f?.["setSelectionRange"]?.(_0x3438d2["length"], _0x3438d2["length"]);
      return;
    }
    if (_0x46c48f["target"]['matches']("[data-story-character-voice-sample]")) {
      _0x46a1ea['characterVoiceEditor'] && (_0x46a1ea["characterVoiceEditor"]["sampleText"] = String(_0x46c48f["target"]['value'] || '')['slice'](0x0, STORY_CHARACTER_VOICE_SAMPLE_MAX_CHARACTERS));
      return;
    }
    if (_0x46c48f["target"]['matches']("[data-story-character-voice-description]")) {
      _0x46a1ea["characterVoiceEditor"] && (_0x46a1ea["characterVoiceEditor"]['voiceDescription'] = String(_0x46c48f['target']["value"] || '')["slice"](0x0, 0x258));
      return;
    }
    if (_0x46c48f["target"]["matches"]("[data-story-style-search-input]")) {
      _0x1b7596(_0x46c48f["target"]["closest"]('.story-style-picker'));
      return;
    }
    if (_0x46c48f['target']['matches']('[data-story-style-custom-input]')) {
      const _0x541333 = String(_0x46c48f["target"]['value'] || '')["slice"](0x0, STORY_CUSTOM_STYLE_MAX_CHARACTERS);
      if (_0x46c48f['target']["value"] !== _0x541333) {
        _0x46c48f['target']["value"] = _0x541333;
      }
      const _0x1e0257 = _0x46c48f['target']["closest"](".story-style-custom-editor")?.['querySelector']('[data-story-style-custom-count]');
      if (_0x1e0257) {
        _0x1e0257["textContent"] = _0x541333["length"] + " / " + STORY_CUSTOM_STYLE_MAX_CHARACTERS;
      }
      return;
    }
    if (_0x46c48f["target"]['matches']("[data-story-idea-input]")) {
      _0x46a1ea['idea'] = _0x46c48f['target']["value"]["slice"](0x0, STORY_IDEA_MAX_CHARACTERS);
      _0x3ac8ee();
    } else {
      if (_0x46c48f['target']["matches"]('[data-story-paste-input]')) {
        _0x46a1ea['scriptText'] = _0x46c48f['target']["value"]["slice"](0x0, STORY_SCRIPT_MAX_CHARACTERS);
        _0x46a1ea['scriptCharacterCount'] = _0x46a1ea["scriptText"]["length"];
        _0x46a1ea['scriptFileName'] = normalizeText(_0x46a1ea["scriptText"]) ? '粘贴文本' : '';
        if (!_0x46a1ea["hasCreatedProject"]) {
          _0x46a1ea["data"]["project"]["sourceDocument"] = normalizeText(_0x46a1ea['scriptText']) ? {
            'fileName': "粘贴文本",
            'text': _0x46a1ea["scriptText"],
            'characterCount': _0x46a1ea["scriptText"]["length"]
          } : null;
        }
        _0x3ac8ee();
      } else {
        if (_0x46c48f["target"]["matches"]("[data-story-outline-field]")) {
          const _0x385373 = {
            'story-type': "storyType",
            'story-target-audience': "targetAudience",
            'story-logline': "logline",
            'story-summary': "summary",
            'story-background': "background",
            'story-setting': "setting",
            'story-core-hook': "coreHook"
          };
          const _0x26576e = _0x385373[_0x46c48f['target']['dataset']["storyOutlineField"]];
          _0x26576e && (_0x46a1ea["data"]["project"][_0x26576e] = _0x46c48f["target"]['value'], markStorySummaryDownstreamStale(_0x46a1ea["data"]));
        } else {
          if (_0x46c48f["target"]['matches']("[data-story-contract-field]")) {
            const _0x3ab766 = normalizeText(_0x46c48f["target"]["dataset"]["storyContractField"]);
            Object["hasOwn"](STORY_CONTRACT_FIELD_LABELS, _0x3ab766) && (_0x46a1ea["data"]["project"]["storyContract"] ||= normalizeGeneratedStoryContract(), _0x46a1ea["data"]["project"]["storyContract"][_0x3ab766] = _0x46c48f['target']['value'], markStorySummaryDownstreamStale(_0x46a1ea['data']));
          } else {
            if (_0x46c48f["target"]["matches"]("[data-story-plot-beat-index][data-story-plot-beat-field]")) {
              const _0x5c02a3 = Number(_0x46c48f['target']["dataset"]["storyPlotBeatIndex"]);
              const _0x592f2f = normalizeText(_0x46c48f["target"]["dataset"]["storyPlotBeatField"]);
              const _0x136171 = _0x46a1ea["data"]["project"]?.["plotBeats"]?.[_0x5c02a3];
              _0x136171 && ['stage', "event", "consequence"]['includes'](_0x592f2f) && (_0x136171[_0x592f2f] = _0x46c48f["target"]["value"], markStorySummaryDownstreamStale(_0x46a1ea["data"]));
            } else {
              if (_0x46c48f['target']['matches']("[data-story-continuity-facts]")) {
                _0x46a1ea['data']['project']["continuityFacts"] = normalizeGeneratedStoryContinuityFacts(String(_0x46c48f["target"]["value"] || '')['split'](/\r?\n/u));
                markStorySummaryDownstreamStale(_0x46a1ea["data"]);
              } else {
                if (_0x46c48f["target"]['matches']("[data-story-summary-character-field]")) {
                  updateStorySummaryCharacterField(_0x46a1ea["data"]["project"]?.['characters'], Number(_0x46c48f['target']["dataset"]['storySummaryCharacterIndex']), _0x46c48f["target"]['dataset']["storySummaryCharacterField"], _0x46c48f["target"]["value"]) && markStorySummaryDownstreamStale(_0x46a1ea["data"]);
                } else {
                  if (_0x46c48f["target"]["matches"]("[data-story-episode-synopsis], [data-story-episode-hook]")) {
                    const _0x47add3 = _0x46c48f["target"]["matches"]("[data-story-episode-hook]") ? "hook" : "synopsis";
                    const _0x1d5b16 = _0x47add3 === "hook" ? _0x46c48f["target"]["dataset"]["storyEpisodeHook"] : _0x46c48f["target"]["dataset"]['storyEpisodeSynopsis'];
                    updateStoryEpisodeOutlineField(_0x46a1ea["data"], _0x1d5b16, _0x47add3, _0x46c48f['target']["value"]) && _0x91d0fb();
                  } else {
                    if (_0x46c48f["target"]["matches"]("[data-story-episode-script]")) {
                      const _0x5da5a3 = _0x46a1ea["data"]["episodes"]["find"](_0x429ce6 => _0x429ce6['id'] === _0x46c48f["target"]['dataset']["storyEpisodeScript"]);
                      _0x5da5a3?.["script"] && (_0x5da5a3["script"]['fullText'] = _0x46c48f["target"]["value"], _0x5da5a3['script']["generatedAt"] = Date["now"](), _0x91d0fb());
                    } else {
                      if (_0x46c48f["target"]["matches"]("[data-story-chapter-title]")) {
                        const _0x272da8 = _0x46a1ea["data"]["project"]["chapters"]?.[Number(_0x46c48f["target"]["dataset"]['storyChapterTitle'])];
                        _0x272da8 && (_0x272da8['title'] = _0x46c48f["target"]["value"], syncProjectChapterContent(_0x46a1ea["data"]["project"]));
                      } else {
                        if (_0x46c48f["target"]["matches"]("[data-story-chapter-content]")) {
                          const _0x3ce468 = _0x46a1ea["data"]["project"]["chapters"]?.[Number(_0x46c48f["target"]["dataset"]["storyChapterContent"])];
                          _0x3ce468 && (_0x3ce468["content"] = _0x46c48f["target"]["value"], syncProjectChapterContent(_0x46a1ea["data"]['project']));
                        } else {
                          if (_0x46c48f["target"]["matches"]("[data-story-clip-prompt]")) {
                            clearStoryClipAdjustmentUndo(getSelectedClip(_0x46a1ea, getSelectedEpisode(_0x46a1ea)));
                            if (shouldSkipPromptTriggerForBulkInput(_0x46c48f)) {
                              return;
                            }
                            updateSelectedClipPrompt(_0x46a1ea, _0x46c48f["target"]['innerHTML']);
                            _0x10a1d2();
                          } else {
                            if (_0x46c48f["target"]['matches']("[data-story-asset-prompt]")) {
                              if (shouldSkipPromptTriggerForBulkInput(_0x46c48f)) {
                                return;
                              }
                              updateStoryAssetPromptFromEditor(_0x46a1ea, _0x46c48f['target']);
                            } else {
                              if (_0x46c48f['target']["matches"]("[data-story-model-search-input]")) {
                                const _0x24cbb2 = normalizeText(_0x46c48f["target"]["value"])["toLowerCase"]();
                                const _0xdc9c05 = _0x46c48f["target"]["closest"](".story-model-picker");
                                _0xdc9c05?.["querySelectorAll"]("[data-story-model-option]")["forEach"](_0x3d52b6 => {
                                  _0x3d52b6["hidden"] = Boolean(_0x24cbb2) && !String(_0x3d52b6["dataset"]["storyModelSearch"] || '')['includes'](_0x24cbb2);
                                });
                                return;
                              } else {
                                if (_0x46c48f["target"]["matches"]("[data-story-project-title]")) {
                                  const _0x2941cd = String(_0x46c48f["target"]["value"] || '')["slice"](0x0, 0x78);
                                  const _0x67c834 = _0x46c48f['target']["dataset"]["storyProjectTitle"];
                                  const _0x18767b = _0x46a1ea['projects']["find"](_0x1cad03 => String(_0x1cad03?.['id']) === String(_0x67c834));
                                  _0x18767b?.["data"]?.['project'] && (_0x18767b["data"]['project']["title"] = _0x2941cd, _0x18767b["title"] = _0x2941cd, _0x18767b["projectTitleEdited"] = !![], _0x18767b["updatedAt"] = Date["now"]());
                                  String(_0x46a1ea["data"]["project"]?.['id']) === String(_0x67c834) && (_0x46a1ea["data"]["project"]["title"] = _0x2941cd, _0x46a1ea["projectTitleEdited"] = !![]);
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
    _0x18eeff();
  });
  _0x329e8d["addEventListener"]("change", _0x41147b => {
    if (_0x41147b["target"]["matches"]("[data-story-custom-episode-count-input]")) {
      _0x517088(_0x41147b['target']);
      return;
    }
    if (!_0x41147b['target']["matches"]("[data-story-project-title]")) {
      return;
    }
    const _0x1df564 = normalizeText(_0x41147b["target"]["value"]) || "未命名故事";
    const _0x54b48f = _0x41147b["target"]["dataset"]["storyProjectTitle"];
    const _0x1bc302 = _0x46a1ea["projects"]['find'](_0x3ab393 => String(_0x3ab393?.['id']) === String(_0x54b48f));
    _0x1bc302?.["data"]?.['project'] && (_0x1bc302["data"]["project"]["title"] = _0x1df564, _0x1bc302["title"] = _0x1df564, _0x1bc302["projectTitleEdited"] = !![], _0x1bc302["updatedAt"] = Date["now"]());
    String(_0x46a1ea["data"]["project"]?.['id']) === String(_0x54b48f) && (_0x46a1ea['data']["project"]["title"] = _0x1df564, _0x46a1ea['projectTitleEdited'] = !![]);
    _0x41147b["target"]['value'] = _0x1df564;
    _0x18eeff({
      'immediate': !![]
    });
  });
  _0x222ec0?.['addEventListener']("change", async () => {
    const _0x1be4f2 = _0x222ec0["files"]?.[0x0];
    if (!_0x1be4f2) {
      return;
    }
    await _0x205ae3(_0x1be4f2);
    _0x222ec0["value"] = '';
  });
  function _0x5387e9(_0x30fe3a = []) {
    const _0x7efffe = Array["from"](_0x30fe3a || []);
    const _0x5f001a = [];
    _0x7efffe["forEach"](_0x7b3079 => {
      const _0x2cbd2f = validateStoryReplicationVideoFile(_0x7b3079);
      if (_0x2cbd2f['ok']) {
        _0x5f001a["push"](_0x7b3079);
      } else {
        _0x49e2b8(_0x2cbd2f["error"], "warn");
      }
    });
    if (!_0x5f001a["length"]) {
      return ![];
    }
    const _0x340833 = _0x46a1ea["replicationSourceFiles"];
    const _0x504f92 = _0x46a1ea["replicationSourcePreviewUrls"];
    _0x46a1ea["replicationSourceFiles"] = mergeStoryReplicationSourceFiles(_0x340833, _0x5f001a);
    const _0x11ed91 = new Map(_0x340833["map"]((_0x37d9a9, _0x451e49) => [_0x37d9a9, _0x504f92[_0x451e49] || '']));
    _0x46a1ea['replicationSourcePreviewUrls'] = _0x46a1ea["replicationSourceFiles"]['map'](_0x12fe76 => _0x11ed91["get"](_0x12fe76) || _0x2a96f1(_0x12fe76));
    const _0x3ad1ba = _0x1f811e["querySelector"]('.story-page.is-current\x20.story-home-composer-body');
    _0x3ad1ba && _0x46a1ea["view"] === "home" && _0x46a1ea['homeTab'] === "replication" ? (syncStoryReplicationHomeSources(_0x3ad1ba, _0x46a1ea), _0x3ac8ee()) : _0x325d8d({
      'capturePageState': ![]
    });
    return !![];
  }
  _0x49803d?.["addEventListener"]("change", () => {
    const _0x2d14b4 = _0xf91527;
    _0xf91527 = '';
    if (_0x2d14b4 && _0x46a1ea["data"]?.["project"]?.["sourceMode"] === "video-replication") {
      const _0x2d14ec = _0x49803d["files"]?.[0x0];
      const _0x328ab0 = validateStoryReplicationVideoFile(_0x2d14ec);
      if (!_0x328ab0['ok']) {
        _0x49e2b8(_0x328ab0["error"], "warn");
      } else {
        const _0xb5fa76 = _0x3e5ebf(_0x46a1ea);
        const _0x3bb38f = normalizeText(_0xb5fa76['projectId']);
        _0x4bf94c["set"](_0x3bb38f + ':' + _0x2d14b4, _0x2d14ec);
        void _0x4e2f56(_0xb5fa76, [{
          'episodeId': _0x2d14b4,
          'file': _0x2d14ec
        }]);
      }
      _0x49803d['value'] = '';
      return;
    }
    _0x5387e9(_0x49803d["files"]);
    _0x49803d["value"] = '';
  });
  const _0x3c8032 = createStoryAssetImageUploadController({
    'state': _0x46a1ea,
    'createProjectToken': () => _0x3e5ebf(_0x46a1ea),
    'isProjectTaskLive': _0x4d0c22,
    'isProjectTaskCurrent': _0x30dd2e,
    'getSelectedAppearance': getSelectedAssetAppearance,
    'isLoading': isStoryAssetAppearanceLoading,
    'setGenerating': setStoryAssetAppearanceGenerating,
    'startTask': _0x236a2a,
    'finishTask': _0x2b6b77,
    'applyImageResult': _0x441762["applyImageResult"],
    'showToast': _0x49e2b8,
    'refresh': _0x3289a9 => {
      _0x44d78e(_0x3289a9);
      if (_0x46a1ea["selectedAssetId"] === _0x3289a9) {
        _0x3c03fa();
      }
    }
  });
  const _0x56114e = bindStoryAssetImageDrop(_0x329e8d, {
    'state': _0x46a1ea,
    ..._0x3c8032
  });
  _0x5f4c78?.["addEventListener"]('change', async () => {
    const _0x50a072 = _0x5f4c78['files']?.[0x0];
    const _0x27175c = _0x1d089a;
    _0x1d089a = null;
    _0x46a1ea["pendingAssetUploadId"] = '';
    _0x46a1ea["pendingAssetAppearanceId"] = '';
    _0x5f4c78["value"] = '';
    await _0x3c8032["upload"](_0x50a072, _0x27175c);
  });
  _0x3e617c?.['addEventListener']('change', async () => {
    const _0x1dafce = _0x3e617c["files"]?.[0x0];
    const _0x3441d7 = _0x2e3181;
    _0x2e3181 = null;
    const _0x5aa84f = _0x3441d7?.['projectToken'];
    const _0x153a63 = _0x5aa84f?.['data']?.['assets']?.["find"](_0x490ed2 => normalizeText(_0x490ed2?.['id']) === normalizeText(_0x3441d7["assetId"]));
    const _0x1e0218 = getStoryAssetAppearances(_0x153a63)["find"](_0x15022e => normalizeText(_0x15022e?.['id']) === normalizeText(_0x3441d7?.["appearanceId"]));
    const _0x5a2d5e = normalizeText(_0x1dafce?.["name"])["toLowerCase"]();
    const _0x3db489 = String(_0x1dafce?.["type"] || '')["toLowerCase"]()["startsWith"]('image/') || /\.(?:avif|bmp|gif|jpe?g|png|webp)$/u["test"](_0x5a2d5e);
    if (!_0x1dafce || !_0x5aa84f || !_0x153a63 || !_0x1e0218 || !_0x4d0c22(_0x5aa84f)) {
      _0x3e617c["value"] = '';
      return;
    }
    if (!_0x3db489) {
      _0x30dd2e(_0x5aa84f) && _0x49e2b8("风格参考只支持图片文件。", "warn");
      _0x3e617c["value"] = '';
      return;
    }
    if (!canEditStoryAssetStyleReference(_0x153a63, _0x1e0218)) {
      _0x30dd2e(_0x5aa84f) && _0x49e2b8("当前素材暂不支持上传风格参考，风格参考未上传。", 'warn');
      _0x3e617c["value"] = '';
      return;
    }
    const _0x49b4ce = buildStoryBackgroundTaskId("asset-reference-image-upload", {
      'assetId': _0x153a63['id'],
      'appearanceId': _0x1e0218['id']
    });
    _0x30dd2e(_0x5aa84f) && (setStoryAssetAppearanceGenerating(_0x46a1ea, _0x153a63['id'], _0x1e0218['id'], !![]), _0x325d8d());
    _0x236a2a(_0x5aa84f, {
      'id': _0x49b4ce,
      'type': "asset-image-upload",
      'scope': {
        'assetId': _0x153a63['id'],
        'appearanceId': _0x1e0218['id']
      },
      'label': '上传' + (normalizeText(_0x153a63["name"]) || "基础形象") + "风格参考",
      'message': "正在保存风格参考"
    });
    try {
      const _0x4fdcf8 = await uploadFile(_0x1dafce, _0x5aa84f["projectId"]);
      if (!_0x4d0c22(_0x5aa84f)) {
        return;
      }
      if (!buildCanvasLocalImageFields(_0x4fdcf8)["imageUrl"]) {
        throw new Error("风格参考保存结果缺少可用地址");
      }
      setStoryAssetAppearanceReferenceImage(_0x1e0218, _0x4fdcf8);
      _0x2b6b77(_0x5aa84f, _0x49b4ce, {
        'status': "succeeded",
        'message': "风格参考已保存"
      });
      _0x30dd2e(_0x5aa84f) && (_0x325d8d(), _0x49e2b8("风格参考已上传，并已补充提示词。", 'success'));
    } catch (_0x8f3db9) {
      if (!_0x4d0c22(_0x5aa84f)) {
        return;
      }
      _0x2b6b77(_0x5aa84f, _0x49b4ce, {
        'status': "failed",
        'message': '风格参考保存失败',
        'error': _0x8f3db9?.["message"] || '风格参考上传失败，请稍后重试。'
      });
      _0x30dd2e(_0x5aa84f) && _0x49e2b8(_0x8f3db9?.["message"] || '风格参考上传失败，请稍后重试。', "error");
    } finally {
      _0x30dd2e(_0x5aa84f) && (setStoryAssetAppearanceGenerating(_0x46a1ea, _0x153a63['id'], _0x1e0218['id'], ![]), _0x325d8d());
      _0x3e617c["value"] = '';
    }
  });
  async function _0x5d3162(_0x4fae05, _0x140274) {
    const _0x8f1d86 = _0x519284 || {};
    _0x519284 = null;
    const _0x45c67e = _0x8f1d86["projectToken"] || _0x3e5ebf(_0x46a1ea);
    const _0x5590ee = _0x45c67e["data"]?.['assets']?.["find"](_0x4d0333 => normalizeText(_0x4d0333?.['id']) === normalizeText(_0x140274));
    if (!_0x4fae05 || !_0x5590ee || _0x5590ee["kind"] !== 'character') {
      return;
    }
    const _0x2a7996 = _0x30dd2e(_0x45c67e) ? _0x46a1ea : deriveStoryProjectTaskState(_0x45c67e["data"]);
    if (isStoryAssetVoiceLoading(_0x2a7996, _0x5590ee['id'])) {
      _0x30dd2e(_0x45c67e) && _0x49e2b8("请等待当前生成任务完成。", 'info');
      return;
    }
    const _0xc09fe3 = _0x8f1d86["editor"]?.["assetId"] === _0x5590ee['id'] ? _0x8f1d86["editor"] : _0x46a1ea["characterVoiceEditor"]?.["assetId"] === _0x5590ee['id'] ? _0x46a1ea["characterVoiceEditor"] : null;
    if (!isSupportedStoryCharacterVoiceFile(_0x4fae05)) {
      _0xc09fe3 && (_0xc09fe3["error"] = "仅支持 MP3、WAV 或 M4A 音频文件。");
      if (_0x30dd2e(_0x45c67e)) {
        _0x325d8d();
      }
      return;
    }
    const _0x4e8796 = buildStoryBackgroundTaskId('asset-voice-upload', {
      'assetId': _0x5590ee['id']
    });
    _0x30dd2e(_0x45c67e) && (setStoryAssetVoiceGenerating(_0x46a1ea, _0x5590ee['id'], !![]), _0x46a1ea['characterVoiceEditor']?.['assetId'] === _0x5590ee['id'] && (_0x46a1ea["characterVoiceEditor"]['isGenerating'] = !![]), _0x325d8d());
    _0x236a2a(_0x45c67e, {
      'id': _0x4e8796,
      'type': 'asset-voice-upload',
      'scope': {
        'assetId': _0x5590ee['id']
      },
      'label': '上传' + (normalizeText(_0x5590ee["name"]) || '角色') + '声音',
      'message': "正在保存本地音频"
    });
    try {
      const _0x4eb8bd = await uploadFile(_0x4fae05, _0x45c67e["projectId"]);
      if (!_0x4d0c22(_0x45c67e)) {
        return ![];
      }
      const _0x28261f = normalizeStoryCharacterVoiceReference({
        'source': "upload",
        'audioUrl': _0x4eb8bd?.["displayUrl"] || _0x4eb8bd?.["url"] || _0x4eb8bd?.['originalUrl'] || _0x4eb8bd?.["localUrl"],
        'localPath': _0x4eb8bd?.["localPath"] || _0x4eb8bd?.["originalLocalPath"] || _0x4eb8bd?.['path'],
        'fileName': _0x4fae05['name'],
        'sampleText': _0xc09fe3?.["sampleText"],
        'voiceDescription': _0xc09fe3?.["voiceDescription"],
        'updatedAt': Date["now"]()
      });
      if (!_0x28261f) {
        throw new Error("音频保存结果缺少可用地址");
      }
      if (_0x30dd2e(_0x45c67e)) {
        _0x22f2d9();
      }
      replaceStoryCharacterVoiceReference(_0x5590ee, _0x28261f);
      _0x2b6b77(_0x45c67e, _0x4e8796, {
        'status': "succeeded",
        'message': "本地音频已保存"
      });
      _0x30dd2e(_0x45c67e) && (_0x46a1ea["characterVoiceEditor"]?.["assetId"] === _0x5590ee['id'] && (_0x46a1ea['characterVoiceEditor']['error'] = ''), _0x325d8d(), _0x49e2b8("角色声音参考已上传。", "success"));
      return !![];
    } catch (_0x5ba2b7) {
      if (!_0x4d0c22(_0x45c67e)) {
        return ![];
      }
      _0xc09fe3 && (_0xc09fe3['error'] = _0x5ba2b7?.["message"] || "声音参考上传失败。");
      _0x2b6b77(_0x45c67e, _0x4e8796, {
        'status': "failed",
        'message': '本地音频保存失败',
        'error': _0x5ba2b7?.["message"] || "声音参考上传失败。"
      });
      _0x30dd2e(_0x45c67e) && (_0x46a1ea['characterVoiceEditor']?.["assetId"] === _0x5590ee['id'] && (_0x46a1ea["characterVoiceEditor"]["error"] = _0x5ba2b7?.["message"] || '声音参考上传失败。'), _0x325d8d());
      return ![];
    } finally {
      _0x30dd2e(_0x45c67e) && (setStoryAssetVoiceGenerating(_0x46a1ea, _0x5590ee['id'], ![]), _0x46a1ea['characterVoiceEditor']?.['assetId'] === _0x5590ee['id'] && (_0x46a1ea['characterVoiceEditor']["isGenerating"] = ![]), _0x325d8d());
    }
  }
  _0x21ef4b?.['addEventListener']("change", async () => {
    const _0x2b854b = _0x21ef4b["files"]?.[0x0];
    const _0x33e426 = _0x49e1b2 || {
      'projectToken': _0x3e5ebf(_0x46a1ea),
      'assetId': _0x46a1ea["pendingCharacterVoiceAssetId"],
      'editor': _0x46a1ea["characterVoiceEditor"]
    };
    _0x49e1b2 = null;
    _0x46a1ea["pendingCharacterVoiceAssetId"] = '';
    _0x519284 = _0x33e426;
    await _0x5d3162(_0x2b854b, _0x33e426["assetId"]);
    _0x21ef4b["value"] = '';
  });
  _0x3368b0?.["addEventListener"]("change", async () => {
    const _0x5c6238 = _0x3368b0["files"]?.[0x0];
    await _0x977891(_0x5c6238);
    _0x3368b0["value"] = '';
  });
  _0x329e8d["addEventListener"]('dragover', _0x56875e => {
    if (projectPackages?.["hasProjectPackageDrag"]?.(_0x56875e["dataTransfer"])) {
      _0x56875e["preventDefault"]();
      _0x56875e['stopPropagation']();
      if (_0x56875e["dataTransfer"]) {
        _0x56875e["dataTransfer"]["dropEffect"] = "copy";
      }
      return;
    }
    const _0x155b41 = _0x56875e["target"]["closest"]('[data-story-replication-grid]');
    if (_0x155b41 && _0x485aec) {
      _0x56875e["preventDefault"]();
      _0x56875e["stopPropagation"]();
      if (_0x56875e["dataTransfer"]) {
        _0x56875e["dataTransfer"]["dropEffect"] = "move";
      }
      const _0xc8e084 = [..._0x155b41["querySelectorAll"]("article[data-story-replication-episode-id]")]["find"](_0x45c44c => normalizeText(_0x45c44c['dataset']["storyReplicationEpisodeId"]) === _0x485aec);
      const _0x541b9d = _0x56875e["target"]["closest"]("article[data-story-replication-episode-id]");
      if (_0xc8e084 && _0x541b9d && _0x541b9d !== _0xc8e084) {
        const _0x440ced = _0x541b9d["getBoundingClientRect"]();
        const _0x38e052 = _0xc8e084["getBoundingClientRect"]();
        const _0x11d101 = Math["abs"](_0x38e052['top'] - _0x440ced["top"]) < Math["max"](0x8, _0x440ced["height"] * 0.35);
        const _0x1e995b = _0x11d101 ? Number(_0x56875e["clientX"]) > _0x440ced["left"] + _0x440ced["width"] / 0x2 : Number(_0x56875e["clientY"]) > _0x440ced["top"] + _0x440ced["height"] / 0x2;
        _0x155b41['insertBefore'](_0xc8e084, _0x1e995b ? _0x541b9d["nextSibling"] : _0x541b9d);
      }
      return;
    }
    const _0x5c456c = _0x56875e["target"]["closest"]('[data-story-clip-prompt-surface]');
    if (_0x5c456c && (_0x111ca1 || hasStoryAssetDragData(_0x56875e["dataTransfer"]))) {
      _0x56875e["preventDefault"]();
      _0x56875e["stopPropagation"]();
      if (_0x56875e["dataTransfer"]) {
        _0x56875e["dataTransfer"]["dropEffect"] = 'copy';
      }
      _0x5c456c["classList"]["add"]("is-story-asset-drop-target");
      _0x2ae216(_0x5c456c["querySelector"]?.("[data-story-clip-prompt]"), _0x56875e);
      return;
    }
    const _0x47299f = _0x56875e["target"]["closest"]("[data-story-character-voice-drop]");
    if (_0x47299f) {
      _0x56875e["preventDefault"]();
      _0x56875e['stopPropagation']();
      if (_0x56875e["dataTransfer"]) {
        _0x56875e["dataTransfer"]["dropEffect"] = 'copy';
      }
      _0x47299f['classList']['add']("is-dragover");
      return;
    }
    const _0x1a8e21 = _0x56875e['target']['closest']("[data-story-replication-drop]");
    if (_0x1a8e21) {
      _0x56875e['preventDefault']();
      _0x56875e["stopPropagation"]();
      if (_0x56875e["dataTransfer"]) {
        _0x56875e["dataTransfer"]["dropEffect"] = 'copy';
      }
      _0x1a8e21['classList']["add"]("is-dragover");
      return;
    }
    handleStoryHomeDocumentDragOver(_0x56875e);
  });
  _0x329e8d['addEventListener']("dragleave", _0x4df31e => {
    const _0x652bf1 = _0x4df31e["target"]["closest"]('[data-story-clip-prompt-surface]');
    _0x652bf1 && !_0x652bf1['contains'](_0x4df31e["relatedTarget"]) && (_0x652bf1['classList']['remove']("is-story-asset-drop-target"), _0x34984d());
    const _0x391d30 = _0x4df31e['target']['closest']('[data-story-character-voice-drop]');
    _0x391d30 && !_0x391d30["contains"](_0x4df31e["relatedTarget"]) && _0x391d30['classList']['remove']("is-dragover");
    handleStoryHomeDocumentDragLeave(_0x4df31e);
    const _0x388011 = _0x4df31e["target"]["closest"]("[data-story-replication-drop]");
    _0x388011 && !_0x388011['contains'](_0x4df31e["relatedTarget"]) && _0x388011["classList"]['remove']("is-dragover");
  });
  _0x329e8d["addEventListener"]('drop', async _0x4a60bc => {
    if (projectPackages?.['importProjectFromDrop']?.(_0x4a60bc)) {
      return;
    }
    const _0x4bae25 = _0x4a60bc["target"]["closest"]('[data-story-replication-grid]');
    if (_0x4bae25 && _0x485aec) {
      _0x4a60bc["preventDefault"]();
      _0x4a60bc["stopPropagation"]();
      const _0x1ee9ed = [..._0x4bae25['querySelectorAll']('article[data-story-replication-episode-id]')]["map"](_0x32da59 => normalizeText(_0x32da59["dataset"]["storyReplicationEpisodeId"]));
      _0x46a1ea['data']['episodes'] = reorderStoryVideoReplicationEpisodes(_0x46a1ea["data"]['episodes'], _0x1ee9ed);
      syncStoryVideoReplicationProject(_0x46a1ea["data"]);
      _0x46a1ea['data']['episodes']['forEach']((_0x53f937, _0x2ae800) => {
        const _0x571047 = [..._0x4bae25['querySelectorAll']("article[data-story-replication-episode-id]")]['find'](_0x31876a => normalizeText(_0x31876a["dataset"]["storyReplicationEpisodeId"]) === _0x53f937['id']);
        syncStoryVideoReplicationCardElement(_0x571047, _0x53f937, _0x2ae800);
      });
      _0x4bae25["querySelectorAll"](".story-replication-card.is-reordering")["forEach"](_0x4bcd76 => _0x4bcd76['classList']['remove']("is-reordering"));
      _0x485aec = '';
      _0x278b76 = [];
      _0x4bae25["classList"]["remove"]("is-reordering");
      _0x18eeff({
        'immediate': !![]
      });
      return;
    }
    const _0x472e9c = _0x4a60bc['target']['closest']('[data-story-clip-prompt-surface]');
    const _0x5a2eec = readStoryAssetDragData(_0x4a60bc["dataTransfer"]) || _0x111ca1;
    const _0x1164ca = readStoryAssetDragItemIndex(_0x4a60bc["dataTransfer"]) || _0x111978;
    if (_0x472e9c && _0x5a2eec) {
      _0x4a60bc["preventDefault"]();
      _0x4a60bc["stopPropagation"]();
      const _0x4ed411 = _0x472e9c["querySelector"]?.("[data-story-clip-prompt]");
      const _0x22daf5 = _0x2ae216(_0x4ed411, _0x4a60bc);
      _0x1db49e();
      !_0x11dd8c(_0x5a2eec, {
        'assetIndex': _0x1164ca,
        'triggerRange': _0x22daf5
      }) && _0x49e2b8("素材引用添加失败，请重试。", 'error');
      return;
    }
    const _0x3b5d92 = _0x4a60bc["target"]["closest"]("[data-story-character-voice-drop]");
    if (_0x3b5d92) {
      _0x4a60bc['preventDefault']();
      _0x4a60bc["stopPropagation"]();
      _0x3b5d92["classList"]["remove"]("is-dragover");
      const _0x4bfa91 = _0x4a60bc["dataTransfer"]?.["files"]?.[0x0];
      await _0x5d3162(_0x4bfa91, _0x46a1ea['characterVoiceEditor']?.["assetId"]);
      return;
    }
    const _0x1087e5 = _0x4a60bc["target"]["closest"]("[data-story-replication-drop]");
    if (_0x1087e5) {
      _0x4a60bc["preventDefault"]();
      _0x4a60bc["stopPropagation"]();
      _0x1087e5["classList"]["remove"]("is-dragover");
      _0x5387e9(_0x4a60bc["dataTransfer"]?.["files"]);
      return;
    }
    await handleStoryHomeDocumentDrop(_0x4a60bc, _0x205ae3);
  });
  documentObject["addEventListener"]('click', _0x8b8711 => {
    if (storyClipProduction['shouldCloseAdjustmentOnOutsideClick'](_0x46a1ea, _0x8b8711["target"])) {
      _0x46a1ea["clipAdjustmentOpen"] = ![];
      _0x46a1ea["clipAdjustmentPromptModeOpen"] = ![];
      _0x46a1ea['clipAdjustmentLanguageOpen'] = ![];
      _0x3b0a58();
    } else {
      (_0x46a1ea["clipAdjustmentPromptModeOpen"] || _0x46a1ea["clipAdjustmentLanguageOpen"]) && !_0x8b8711["target"]["closest"]?.('[data-story-clip-adjustment-mode]') && (_0x46a1ea["clipAdjustmentPromptModeOpen"] = ![], _0x46a1ea["clipAdjustmentLanguageOpen"] = ![], _0x18e104(), _0x18e104({
        'kind': "language"
      }));
    }
    storyClipProduction["shouldClosePromptHistoryOnOutsideClick"](_0x46a1ea, _0x8b8711["target"]) && (_0x46a1ea['clipPromptHistoryOpen'] = ![], _0x562e1e());
    !_0x329e8d["contains"](_0x8b8711["target"]) && (_0x358f94(''), _0x2ed527(), _0x1b3da4(), _0x1c1572(), _0x2c03e7(), _0x285a4f(), _0x36cc45());
  });
  const _0x212ece = subscribeAssetMentionRegistry(() => {
    if (_0x2988c5 && _0x46a1ea["view"] === "project" && _0x46a1ea["step"] === 0x2 && _0x46a1ea["assetFilter"] === "library") {
      _0x325d8d();
      return;
    }
    if (_0x2988c5 && _0x46a1ea["view"] === 'episode') {
      if (!_0x1d3480({
        'refreshContent': !![]
      })) {
        _0x325d8d();
      }
    }
  });
  const _0x38486f = typeof subscribeCanvasNodeDeletions === "function" ? subscribeCanvasNodeDeletions(_0xcf5535) : null;
  const _0x562088 = typeof subscribeCanvasMediaNodeChanges === "function" ? subscribeCanvasMediaNodeChanges(_0x46f1f5) : null;
  async function _0x1fa6f3() {
    if (typeof loadWorkspace !== "function") {
      _0x3654ac['setReady'](!![]);
      return;
    }
    const _0x1175d3 = _0x3654ac["getRevision"]();
    const _0x2f1749 = createStoryWorkspaceSnapshot(_0x46a1ea);
    let _0xaef52e = ![];
    let _0x35594a = ![];
    try {
      const _0x5b6604 = await loadWorkspace();
      await waitForRuntimeManifestLoad({
        'timeoutMs': 0x1f4
      });
      const _0x2c12dc = parseStoryWorkspaceSnapshotPayload(_0x5b6604);
      if (_0x2c12dc) {
        const _0x5b03a3 = _0x2c12dc["projects"]['map'](_0x296119 => {
          const _0x52a81e = _0x296119?.["data"] ? normalizeStoryWorkspaceAssetData(_0x296119["data"]) : _0x296119?.["data"];
          reconcilePersistedStoryProjectTasks(_0x52a81e);
          return {
            ..._0x296119,
            'data': _0x52a81e
          };
        });
        const _0x20661e = _0x3654ac["getRevision"]() !== _0x1175d3 || hasStoryWorkspaceSnapshotChanged(_0x2f1749, createStoryWorkspaceSnapshot(_0x46a1ea));
        if (_0x20661e) {
          _0x2113e3["restoreEntries"](mergeStoryWorkspaceHydratedProjects(_0x46a1ea["projects"], _0x5b03a3), {
            'preserveLive': !![]
          });
          _0xaef52e = _0x5b03a3["length"] > 0x0;
          _0x3654ac['schedule']();
        } else {
          _0x2113e3["restoreEntries"](_0x5b03a3);
          _0x459e11(_0x46a1ea);
          _0x2113e3['replaceCurrent'](normalizeStoryWorkspaceAssetData(_0x2c12dc["currentData"]));
          reconcilePersistedStoryProjectTasks(_0x46a1ea["data"]);
          _0x46a1ea['data']["project"]["planning"] = normalizeStoryProjectPlanning(_0x46a1ea["data"]['project'], {
            'allowDeveloperPromptModes': _0x46a1ea["developerModeAvailable"]
          });
          _0x46a1ea['hasCreatedProject'] = _0x2c12dc["hasCreatedProject"] === !![];
          _0x46a1ea["projectTitleEdited"] = _0x2c12dc["projectTitleEdited"] === !![];
          _0x46a1ea["models"] = {
            ..._0x46a1ea["models"],
            ..._0x2c12dc["models"]
          };
          _0x46a1ea["textProvider"] = _0x2c12dc["modelProviders"]?.["text"] || getStoryWorkspaceModelChoice('text', _0x46a1ea['models']["text"])?.["provider"] || _0x46a1ea["textProvider"];
          _0x46a1ea["textProviderProfileId"] = resolveStoryTextProviderProfileId(_0x46a1ea['textProvider'], _0x2c12dc["modelProviderProfiles"]?.['text'] || _0x46a1ea["textProviderProfileId"]);
          _0x46a1ea["splitTextModel"] = _0x2c12dc["splitTextModel"]?.["modelId"] ? {
            'modelId': String(_0x2c12dc["splitTextModel"]["modelId"] || ''),
            'provider': String(_0x2c12dc["splitTextModel"]['provider'] || ''),
            'providerProfileId': String(_0x2c12dc["splitTextModel"]["providerProfileId"] || '')
          } : null;
          _0x46a1ea["imageProvider"] = resolveModelProvider(_0x46a1ea['models']["image"], _0x2c12dc["modelProviders"]?.["image"] || _0x46a1ea["imageProvider"]);
          _0x46a1ea["imageGenerationParams"] = normalizeStoryImageGenerationParams(_0x46a1ea["models"]['image'], _0x2c12dc["modelParams"]?.["image"]);
          _0x46a1ea["imageGenerationParamsByModel"] = _0x2c12dc["modelParams"]?.["imageByModel"] && typeof _0x2c12dc["modelParams"]["imageByModel"] === 'object' ? {
            ..._0x2c12dc['modelParams']['imageByModel']
          } : {};
          _0x46a1ea["videoProvider"] = resolveStoryVideoProvider(_0x46a1ea['models']["video"], _0x2c12dc["modelProviders"]?.["video"] || _0x46a1ea["videoProvider"]);
          _0x46a1ea["videoProviderProfileIdByModel"] = _0x2c12dc["modelProviderProfiles"]?.["videoByModel"] && typeof _0x2c12dc["modelProviderProfiles"]["videoByModel"] === "object" ? {
            ..._0x2c12dc["modelProviderProfiles"]['videoByModel']
          } : {};
          _0x46a1ea["videoProviderProfileId"] = resolveModelProviderProfileId({
            'model': _0x46a1ea['models']["video"],
            'providerProfileId': _0x2c12dc["modelProviderProfiles"]?.['video'] || _0x46a1ea["videoProviderProfileId"],
            'providerProfileIdByModel': _0x46a1ea["videoProviderProfileIdByModel"]
          });
          _0x46a1ea["videoGenerationParams"] = normalizeStoryVideoGenerationParams(_0x46a1ea["models"]["video"], _0x2c12dc["modelParams"]?.['video']);
          _0x46a1ea['videoGenerationParamsByModel'] = _0x2c12dc["modelParams"]?.['videoByModel'] && typeof _0x2c12dc["modelParams"]['videoByModel'] === 'object' ? {
            ..._0x2c12dc["modelParams"]["videoByModel"]
          } : {};
          _0x46a1ea["view"] = ["home", 'project', "episode"]["includes"](_0x2c12dc['ui']['view']) ? _0x2c12dc['ui']["view"] : "home";
          const _0x2a8f3c = normalizeStoryWorkspaceStep(_0x2c12dc['ui']["step"]);
          _0x46a1ea["step"] = canEnterStoryWorkspaceStep(_0x46a1ea['data'], _0x2a8f3c) ? _0x2a8f3c : _0x46a1ea["data"]["project"]["collaboration"]?.["stage"] === "writing" ? 0x0 : 0x1;
          _0x46a1ea["view"] === "episode" && !canEnterStoryWorkspaceStep(_0x46a1ea["data"], 0x3) && (_0x46a1ea["view"] = 'project');
          _0x46a1ea['homeTab'] = resolveStoryVideoReplicationHomeTab(_0x46a1ea, _0x2c12dc['ui']["homeTab"]);
          _0x46a1ea["replicationTargetLocale"] = getStoryReplicationLocale(_0x2c12dc['ui']["replicationTargetLocale"] || 'zh-CN')["value"];
          _0x46a1ea["scriptMode"] = normalizeStoryScriptMode(_0x2c12dc['ui']["scriptMode"] || _0x46a1ea["data"]["project"]?.["scriptMode"]);
          _0x46a1ea["uploadInputMode"] = _0x2c12dc['ui']["uploadInputMode"] === 'paste' ? "paste" : "file";
          _0x46a1ea['idea'] = String(_0x2c12dc['ui']["idea"] || '')["slice"](0x0, STORY_IDEA_MAX_CHARACTERS);
          _0x46a1ea["scriptFileName"] = String(_0x2c12dc['ui']["scriptFileName"] || '');
          _0x46a1ea["scriptText"] = String(_0x2c12dc['ui']["scriptText"] || '')["slice"](0x0, STORY_SCRIPT_MAX_CHARACTERS);
          _0x46a1ea["scriptCharacterCount"] = Number["isFinite"](_0x2c12dc['ui']["scriptCharacterCount"]) ? _0x2c12dc['ui']["scriptCharacterCount"] : null;
          const _0x11a3c4 = _0x46a1ea["data"]["project"]?.["sourceDocument"];
          _0x11a3c4 && typeof _0x11a3c4 === "object" && (_0x46a1ea["scriptFileName"] = String(_0x11a3c4["fileName"] || _0x46a1ea["scriptFileName"]), _0x46a1ea['scriptText'] = String(_0x11a3c4["text"] || _0x46a1ea["scriptText"])["slice"](0x0, STORY_SCRIPT_MAX_CHARACTERS), _0x46a1ea["scriptCharacterCount"] = Number['isFinite'](_0x11a3c4["characterCount"]) ? _0x11a3c4["characterCount"] : _0x46a1ea["scriptText"]["length"]);
          _0x46a1ea['assetFilter'] = _0x2c12dc['ui']["assetFilter"] || _0x46a1ea["assetFilter"];
          _0x46a1ea["assetSplitRatio"] = normalizeStoryAssetSplitRatio(_0x2c12dc['ui']["assetSplitRatio"]);
          _0x46a1ea["assetDetailSplitRatio"] = normalizeStoryAssetDetailSplitRatio(_0x2c12dc['ui']["assetDetailSplitRatio"]);
          const _0x54b9be = normalizeStoryEpisodePanelRatios(_0x2c12dc['ui']["episodeAssetPanelRatio"], _0x2c12dc['ui']["episodeEditorPanelRatio"]);
          _0x46a1ea["episodeAssetPanelRatio"] = _0x54b9be["left"];
          _0x46a1ea['episodeEditorPanelRatio'] = _0x54b9be['center'];
          _0x46a1ea["episodeAssetRailTab"] = normalizeStoryEpisodeAssetRailTab(_0x2c12dc['ui']["episodeAssetRailTab"]);
          _0x46a1ea['assetAppearanceIndexes'] = _0x2c12dc['ui']["assetAppearanceIndexes"] && typeof _0x2c12dc['ui']["assetAppearanceIndexes"] === "object" ? {
            ..._0x2c12dc['ui']["assetAppearanceIndexes"]
          } : {};
          _0x46a1ea['outlineSectionOpenState'] = _0x2c12dc['ui']["outlineSectionOpenState"] && typeof _0x2c12dc['ui']["outlineSectionOpenState"] === 'object' ? {
            ..._0x2c12dc['ui']["outlineSectionOpenState"]
          } : {};
          _0x46a1ea["pageScrollPositions"] = _0x2c12dc['ui']["pageScrollPositions"] && typeof _0x2c12dc['ui']["pageScrollPositions"] === "object" ? {
            ..._0x2c12dc['ui']['pageScrollPositions']
          } : {};
          _0x46a1ea["experimentalSplitMode"] = _0x2c12dc['ui']['experimentalSplitMode'] === !![];
          _0x46a1ea["selectedAssetId"] = _0x2c12dc['ui']["selectedAssetId"] || '';
          _0x46a1ea["selectedEpisodeId"] = _0x2c12dc['ui']["selectedEpisodeId"] || '';
          _0x46a1ea["selectedClipId"] = _0x2c12dc['ui']["selectedClipId"] || '';
          _0x46a1ea["characterVoiceEditor"] = normalizeStoryProjectVoiceEditor(_0x2c12dc['ui']["characterVoiceEditor"], _0x46a1ea['data']);
          _0x48257d(_0x46a1ea["data"]);
          const _0x3b7b35 = getSelectedEpisode(_0x46a1ea);
          _0x35594a = _0x42ff41(getSelectedClip(_0x46a1ea, _0x3b7b35), {
            'episode': _0x3b7b35,
            'enteringEpisode': _0x46a1ea['view'] === "episode"
          });
          _0xaef52e = !![];
          if (_0x46a1ea["workspaceSurface"]) {
            selectStoryWorkspaceSurface(_0x46a1ea, _0x46a1ea['workspaceSurface']);
          }
          if (_0x2988c5) {
            _0x325d8d({
              'capturePageState': ![]
            });
          }
        }
      }
    } catch (_0x1cca5c) {
      console["warn"]("[storyWorkspace] 用户数据加载失败", _0x1cca5c);
      _0x3654ac["setHydrationError"](_0x1cca5c);
      _0x49e2b8("历史剧本项目加载失败，已暂停自动保存以防覆盖数据。", 'error', 0x2710);
      return;
    }
    _0x3654ac['setReady'](!![]);
    typeof getCanvasMediaSnapshot === "function" && _0x46f1f5(getCanvasMediaSnapshot() || {});
    _0x35594a && _0x18eeff({
      'immediate': !![]
    });
    if (_0xaef52e && !_0x4f49a2) {
      for (const _0x2526f9 of _0x2113e3["getAllData"]()) {
        _0x16d303(_0x2526f9);
        _0x1c2bde(_0x2526f9);
      }
    }
    _0xaef52e && !_0x4f49a2 && void backfillStoryVideoThumbnails(_0x2113e3["getAllData"](), {
      'concurrency': 0x1
    })["then"](_0x366f19 => {
      if (_0x4f49a2 || !_0x366f19["updatedCount"]) {
        return;
      }
      _0x18eeff({
        'immediate': !![]
      });
      if (!_0x2988c5) {
        return;
      }
      if (_0x46a1ea["view"] === "project" && _0x46a1ea["step"] === 0x3) {
        _0x366f19["changedEpisodeIds"]["forEach"](_0x24b6c9 => {
          _0xac701d(_0x24b6c9);
        });
      } else {
        _0x46a1ea["view"] === "episode" && _0x366f19["changedEpisodeIds"]["includes"](normalizeText(_0x46a1ea["selectedEpisodeId"])) && (_0x2f87a6(), _0x85636a());
      }
    })["catch"](_0x2fe38f => {
      console["warn"]("[storyWorkspace] 历史视频缩略图补全失败", _0x2fe38f);
    });
  }
  _0x3e6e62 = createStoryCollaboration({
    'state': _0x46a1ea,
    'root': _0x329e8d,
    'projectData': _0x2113e3,
    'save': _0x18eeff,
    'render': _0x325d8d,
    'beginProjectSession': _0x208486,
    'isActive': () => _0x2988c5,
    'showToast': _0x49e2b8,
    'resetCreationState': _0x5f3b24
  });
  const _0x1a903c = {
    'collaboration': _0x3e6e62,
    'activate': _0x2131c3,
    'deactivate': _0x124c22,
    'isActive': () => _0x2988c5,
    'getProjectWorkspaceMode': () => getStoryProjectWorkspaceMode(_0x46a1ea["data"]?.['project']),
    'openHome'() {
      _0x46a1ea["view"] = "home";
      if (_0x2988c5) {
        _0x325d8d();
      } else {
        requestWorkspaceMode(_0x46a1ea["workspaceSurface"] || "story");
      }
    },
    'openProject'() {
      requestWorkspaceMode(getStoryProjectWorkspaceMode(_0x46a1ea['data']?.['project']));
      _0x95f061();
    },
    'importProjectPackageResult': _0x2b5881,
    'destroy'() {
      _0x56114e['destroy']();
      _0x124c22();
      _0x3e6e62["destroy"]();
      _0x4f49a2 = !![];
      _0x3e8f6e['dispose']();
      _0x11ccc2();
      closeStoryRequestDebugPreview(documentObject);
      _0x2b5186["destroy"]();
      _0x280f63["destroy"]();
      _0x4f29a0["destroy"]();
      _0x291db1["forEach"](_0x2f29b4 => _0x2f29b4['pause']());
      _0x291db1["clear"]();
      _0x562990["clear"]();
      _0x4bf94c["clear"]();
      _0x37467e();
      _0x3ec610({
        'clearState': !![]
      });
      _0xa486b2['destroy']();
      _0x574db0?.['destroy']();
      _0x574db0 = null;
      _0x1db49e();
      _0x14b900["destroy"]();
      void _0x3654ac["destroy"]({
        'flush': !![],
        'force': !![]
      })['catch'](() => {});
      _0x58d434['destroy']();
      _0x24fcb6?.();
      _0x212ece?.();
      _0x38486f?.();
      _0x562088?.();
      _0x1f811e['querySelectorAll'](":scope > .story-page")["forEach"](_0x397b4a);
      _0x337499();
      _0x329e8d["removeEventListener"]("error", handleWorkspaceAssetLibraryImageError, !![]);
      windowObject?.["removeEventListener"]?.("pointermove", _0x33c641, !![]);
      windowObject?.["removeEventListener"]?.("pointerup", _0x221232, !![]);
      windowObject?.['removeEventListener']?.("pointercancel", _0x349bac, !![]);
      _0xd04674['destroy']();
      windowObject?.["removeEventListener"]?.('keydown', _0x3afecb, !![]);
      windowObject?.["removeEventListener"]?.("aicanvas:runtime-info", _0x434f23);
      windowObject?.["removeEventListener"]?.("dev-mode-changed", _0x434f23);
      _0x329e8d['remove']();
    }
  };
  _0x329e8d["_storyWorkspaceApi"] = _0x1a903c;
  void _0x1fa6f3();
  return _0x1a903c;
}