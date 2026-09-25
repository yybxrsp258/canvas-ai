import a439_0x1e6cfd from '../../core/stores/appStore.js';
import { generateId } from '../../core/math.js';
import { submitTask } from '../../core/generationTaskRuntime.js';
import a439_0x1e337f from '../../modules/ImageCropController.js';
import a439_0x19b3bf from '../../modules/ImageAnnotateController.js';
import a439_0x487bdd from '../../modules/ImageExpandController.js';
import a439_0x3f2907, { createRunningHubTaskStateMachine } from '../../modules/ImageFreeAngleController.js';
import a439_0x4b12a1 from '../../modules/ImageMattingController.js';
import a439_0x13b02e from '../../modules/VideoClipController.js';
import a439_0x55f903 from '../../modules/VideoKeyingController.js';
import { closeActiveImagePreview, openNodeImagePreview } from '../../modules/imagePreview.js';
import { getImage } from '../../modules/storage.js';
import { showError, showWarning } from '../../services/index.js';
import { buildSourceMediaNodePayload } from '../../services/fileService.js';
import { resolveCanvasImagePreviewUrl } from '../../services/canvasMediaLocalService.js';
import { desktopBridge } from '../../services/desktopBridge.js';
import { saveMediaDownload } from '../../services/downloadSaveService.js';
import { localPathToUrl } from '../../utils/localMediaPath.js';
import { buildImageGenerationFailurePatch, buildImageGenerationResultPatch } from '../aigenImage/imageGenerationResultRenderer.js';
import { buildStoryboardNodePayload, computePreparedStoryboardSize, resolveNearestStoryboardAspect } from '../../core/storyboardFactory.js';
import { calcDisplaySizeByMedia } from '../../services/mediaRatioService.js';
import { registerStaticInnerHTML } from '../../utils/dom.js';
import { fetchRemoteBlob } from '../../../api/projectsV2Api.js';
import { resumeApimartMidjourneyUpscaleTask, resumeRunningHubImageTask, submitApimartMidjourneyUpscaleRequest, submitApimartMidjourneyVariationRequest } from '../../../api/aiImageApi.js';
import { runRunninghubAiApp, runRunninghubWorkflow, resumeRunninghubWorkflowTask } from '../../../api/runninghubWorkflowApi.js';
import { processInputVideos } from '../../../api/videoUploadApi.js';
import { buildApiUrl } from '../../../api/apiBase.js';
import { processInputImages } from '../../../api/imageUploadApi.js';
import { getProviderConfig, ensureConfig } from '../../../api/configApi.js';
import { calcSafeSpawnPosNearNode } from '../../modules/nodeSpawn.js';
import { t } from '../../i18n/index.js';
import { executeCommand } from '../../core/interaction.js';
import { commit } from '../../modules/history.js';
import { IMAGE_TOOLBAR_HTML } from './imageToolbarHtml.js';
import { showDevToast } from './toolbarShared.js';
import { bindImageToolbarLayoutUi } from './imageToolbarLayoutUi.js';
import { bindRunningHubToolbarTaskButton, cancelRunningHubRemoteTaskQuietly, cancelRunningHubResultTask, findRunningHubToolbarTaskForNode, isRunningHubToolbarTaskCancelled, notifyRunningHubToolbarTasksChanged } from './runningHubToolbarTaskButton.js';
import { IMAGE_TOOLBAR_ACTIONS, normalizeImageToolbarLayout, serializeImageToolbarLayout } from '../../modules/imageToolbarLayoutMemory.js';
import { executeGridCrop, prepareGridCells } from '../../modules/imageToolbarGridCrop.js';
import { buildToolbarImageFields, saveOutputImageResult, saveRemoteImageResultLocally } from '../../modules/imageToolbarOutputActions.js';
import { extractFirstImageUrl, parseRhCode, parseRhTaskId, resolveApiInputRatioBasis, resolveFinalResultDisplaySize } from '../../modules/imageToolbarHelpers.js';
import { bindPreviewUploadToolbarAction } from '../../modules/previewUploadEntry.js';
import { bindImageLocalEditAction } from './imageActions/localEditAction.js';
import { bindImageMattingAction } from './imageActions/mattingAction.js';
import { bindImageAutoSubjectAction } from './imageActions/autoSubjectAction.js';
import { bindImagePanorama360Action } from './imageActions/panorama360Action.js';
import { bindImageHdAction } from './imageActions/hdAction.js';
import { bindImageDepthAction } from './imageActions/depthImageAction.js';
import { bindApimartMidjourneyActions } from './imageActions/midjourneyAction.js';
import { bindImageCropAction } from './imageActions/cropAction.js';
import { bindImageExpandAction } from './imageActions/expandAction.js';
import { bindImageAnnotateAction } from './imageActions/annotateAction.js';
import { bindImageFreeAngleAction } from './imageActions/freeAngleAction.js';
import { bindImageMultigridAction } from './imageActions/multigridAction.js';
import { bindImageDownloadAction } from './imageActions/downloadAction.js';
import { bindImageFullscreenAction } from './imageActions/fullscreenAction.js';
import { bindImageResetSizeAction } from './imageActions/resetSizeAction.js';
import { bindApimartPrivateAvatarAction } from './apimartPrivateAvatarAction.js';
const getStateSnapshot = () => typeof a439_0x1e6cfd['getStateRaw'] === 'function' ? a439_0x1e6cfd["getStateRaw"]() : a439_0x1e6cfd["getState"]();
function imageToolbarText(_0x41aade, _0x3932f3 = {}) {
  return t("nodeToolbar.image." + _0x41aade, _0x3932f3);
}
function createViewportSnapshotTracker() {
  let _0x57c91a = getStateSnapshot()["viewport"] || {};
  let _0x3ea9a1 = typeof a439_0x1e6cfd['subscribeSelector'] === "function" ? a439_0x1e6cfd['subscribeSelector'](_0x41540b => _0x41540b["viewport"], _0x4496a6 => {
    _0x57c91a = _0x4496a6 || {};
  }) : null;
  return {
    'openedViewport': {
      ..._0x57c91a
    },
    'getViewport': () => _0x57c91a,
    'dispose': () => {
      _0x3ea9a1?.();
      _0x3ea9a1 = null;
    }
  };
}
const TOOLBAR_TASK_CANCELLED_MESSAGE = imageToolbarText('taskCancelled');
const IMAGE_LOCAL_SAVE_FAILURE_MESSAGE = imageToolbarText('localSaveGeneratedFailed');
function createToolbarCancelledError() {
  const _0x220c4a = new Error(TOOLBAR_TASK_CANCELLED_MESSAGE);
  _0x220c4a["name"] = 'AbortError';
  return _0x220c4a;
}
function isToolbarCancelledError(_0x4b35c7) {
  const _0x23a626 = String(_0x4b35c7?.["message"] || _0x4b35c7 || '');
  return _0x4b35c7?.['name'] === "AbortError" || _0x23a626 === TOOLBAR_TASK_CANCELLED_MESSAGE || _0x23a626 === 'CANCELLED' || _0x23a626["toLowerCase"]()["includes"]("aborted");
}
function createLocalSaveFailureError() {
  const _0x309916 = new Error(IMAGE_LOCAL_SAVE_FAILURE_MESSAGE);
  _0x309916["isLocalSaveFailure"] = !![];
  return _0x309916;
}
function isLocalSaveFailure(_0x12c1c2) {
  return _0x12c1c2?.["isLocalSaveFailure"] === !![] || String(_0x12c1c2?.["message"] || _0x12c1c2 || '') === IMAGE_LOCAL_SAVE_FAILURE_MESSAGE;
}
function throwIfToolbarTaskCancelled(_0x292c34) {
  if (isRunningHubToolbarTaskCancelled(_0x292c34)) {
    throw createToolbarCancelledError();
  }
}
function selectToolbarTaskNode(_0x520e4e) {
  a439_0x1e6cfd["setSelectedNodes"]([_0x520e4e]);
}
function notifyImageToolbarTaskChange({
  sourceNodeId: _0x5be2ed,
  targetNodeId: _0x1991c4
}) {
  notifyRunningHubToolbarTasksChanged({
    'sourceNodeId': _0x5be2ed,
    'outId': _0x1991c4
  });
  window["_triggerLocalCacheSave"]?.();
}
function buildClearedImageMediaFields() {
  return {
    'imageUrl': '',
    'sourceUrl': '',
    'thumbUrl': '',
    'src': '',
    'localPath': ''
  };
}
export { IMAGE_TOOLBAR_HTML };
registerStaticInnerHTML("toolbar:image", IMAGE_TOOLBAR_HTML);
function getToolbarActionFromButton(_0x4a323c) {
  if (!_0x4a323c?.["classList"]) {
    return '';
  }
  for (const _0x13dc4c of _0x4a323c['classList']) {
    if (!_0x13dc4c["startsWith"]("act-")) {
      continue;
    }
    const _0x4797bf = _0x13dc4c['slice'](0x4);
    if (IMAGE_TOOLBAR_ACTIONS['includes'](_0x4797bf)) {
      return _0x4797bf;
    }
  }
  return '';
}
export function bindImageToolbarEvents(_0x4ee137, _0x38eb17) {
  if (!_0x4ee137) {
    return;
  }
  const _0x249f2a = typeof _0x38eb17 === "string" ? _0x38eb17 : _0x38eb17?.['id'];
  if (!_0x249f2a) {
    return;
  }
  const _0xee9f7b = () => getStateSnapshot()["nodes"]?.[_0x249f2a] || (typeof _0x38eb17 === "object" ? _0x38eb17 : null);
  _0x4ee137["addEventListener"]("pointerdown", _0x2bbc96 => _0x2bbc96["stopPropagation"]());
  _0x4ee137["addEventListener"]("dblclick", _0x18d8b0 => {
    _0x18d8b0["preventDefault"]();
    _0x18d8b0["stopPropagation"]();
  });
  const _0x53cc07 = bindImageToolbarLayoutUi(_0x4ee137, {
    'store': a439_0x1e6cfd,
    'getStateSnapshot': getStateSnapshot,
    'imageToolbarActions': IMAGE_TOOLBAR_ACTIONS,
    'normalizeImageToolbarLayout': normalizeImageToolbarLayout,
    'serializeImageToolbarLayout': serializeImageToolbarLayout,
    'getToolbarActionFromButton': getToolbarActionFromButton
  });
  const _0x33a33e = createRunningHubTaskStateMachine();
  const _0x331dac = _0x33a33e["state"];
  const _0x556f79 = {
    'closeToolbarMoreMenu': _0x53cc07["closeMoreMenu"],
    'toolbarEl': _0x4ee137,
    'nodeId': _0x249f2a,
    'mediaKind': 'image',
    'getNodeData': _0xee9f7b,
    'getStateSnapshot': getStateSnapshot,
    '_hdTaskMachine': _0x33a33e,
    '_hdState': _0x331dac,
    'store': a439_0x1e6cfd,
    'generateId': generateId,
    'submitTask': submitTask,
    'ImageCropController': a439_0x1e337f,
    'ImageAnnotateController': a439_0x19b3bf,
    'ImageExpandController': a439_0x487bdd,
    'ImageMattingController': a439_0x4b12a1,
    'closeActiveImagePreview': closeActiveImagePreview,
    'openNodeImagePreview': openNodeImagePreview,
    'getImage': getImage,
    'buildSourceMediaNodePayload': buildSourceMediaNodePayload,
    'resolveCanvasImagePreviewUrl': resolveCanvasImagePreviewUrl,
    'localPathToUrl': localPathToUrl,
    'saveMediaFile': desktopBridge['nodeExport']['canSaveMedia']() ? saveMediaDownload : null,
    'buildImageGenerationFailurePatch': buildImageGenerationFailurePatch,
    'buildImageGenerationResultPatch': buildImageGenerationResultPatch,
    'buildStoryboardNodePayload': buildStoryboardNodePayload,
    'computePreparedStoryboardSize': computePreparedStoryboardSize,
    'resolveNearestStoryboardAspect': resolveNearestStoryboardAspect,
    'calcDisplaySizeByMedia': calcDisplaySizeByMedia,
    'fetchRemoteBlob': fetchRemoteBlob,
    'resumeRunningHubImageTask': resumeRunningHubImageTask,
    'submitApimartMidjourneyUpscaleRequest': submitApimartMidjourneyUpscaleRequest,
    'submitApimartMidjourneyVariationRequest': submitApimartMidjourneyVariationRequest,
    'resumeApimartMidjourneyUpscaleTask': resumeApimartMidjourneyUpscaleTask,
    'runRunninghubAiApp': runRunninghubAiApp,
    'runRunninghubWorkflow': runRunninghubWorkflow,
    'resumeRunninghubWorkflowTask': resumeRunninghubWorkflowTask,
    'processInputImages': processInputImages,
    'getProviderConfig': getProviderConfig,
    'ensureConfig': ensureConfig,
    'calcSafeSpawnPosNearNode': calcSafeSpawnPosNearNode,
    'executeCommand': executeCommand,
    'bindRunningHubToolbarTaskButton': bindRunningHubToolbarTaskButton,
    'cancelRunningHubRemoteTaskQuietly': cancelRunningHubRemoteTaskQuietly,
    'cancelRunningHubResultTask': cancelRunningHubResultTask,
    'findRunningHubToolbarTaskForNode': findRunningHubToolbarTaskForNode,
    'isRunningHubToolbarTaskCancelled': isRunningHubToolbarTaskCancelled,
    'executeGridCrop': executeGridCrop,
    'prepareGridCells': prepareGridCells,
    'buildToolbarImageFields': buildToolbarImageFields,
    'saveOutputImageResult': saveOutputImageResult,
    'saveRemoteImageResultLocally': saveRemoteImageResultLocally,
    'extractFirstImageUrl': extractFirstImageUrl,
    'parseRhCode': parseRhCode,
    'parseRhTaskId': parseRhTaskId,
    'resolveApiInputRatioBasis': resolveApiInputRatioBasis,
    'resolveFinalResultDisplaySize': resolveFinalResultDisplaySize,
    'createViewportSnapshotTracker': createViewportSnapshotTracker,
    'createToolbarCancelledError': createToolbarCancelledError,
    'isToolbarCancelledError': isToolbarCancelledError,
    'createLocalSaveFailureError': createLocalSaveFailureError,
    'isLocalSaveFailure': isLocalSaveFailure,
    'throwIfToolbarTaskCancelled': throwIfToolbarTaskCancelled,
    'selectToolbarTaskNode': selectToolbarTaskNode,
    'notifyImageToolbarTaskChange': notifyImageToolbarTaskChange,
    'buildClearedImageMediaFields': buildClearedImageMediaFields,
    'IMAGE_LOCAL_SAVE_FAILURE_MESSAGE': IMAGE_LOCAL_SAVE_FAILURE_MESSAGE
  };
  bindPreviewUploadToolbarAction({
    'button': _0x4ee137["querySelector"](".act-upload")
  });
  bindImageLocalEditAction(_0x556f79);
  bindImageMattingAction(_0x556f79);
  bindImageAutoSubjectAction(_0x556f79);
  bindImagePanorama360Action(_0x556f79);
  bindApimartPrivateAvatarAction(_0x556f79);
  bindImageHdAction(_0x556f79);
  bindImageDepthAction(_0x556f79);
  bindApimartMidjourneyActions(_0x556f79);
  bindImageCropAction(_0x556f79);
  bindImageExpandAction(_0x556f79);
  bindImageAnnotateAction(_0x556f79);
  bindImageFreeAngleAction(_0x556f79);
  bindImageMultigridAction(_0x556f79);
  bindImageDownloadAction(_0x556f79);
  bindImageFullscreenAction(_0x556f79);
  bindImageResetSizeAction(_0x556f79);
}