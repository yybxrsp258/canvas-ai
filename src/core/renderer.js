import { isNodeType } from '../modules/registry.js';
import { createRendererPresentationSubscription } from './rendererPresentationSubscription.js';
import { hasNodeTypeBetaBadge, normalizeNodeType } from '../modules/nodeMeta.js';
import { getInteractionRenderState } from './interaction.js';
import { getViewportPanPreview } from './viewportPanPreview.js';
import { createRendererPanPreviewReconciler } from './rendererPanPreviewReconcile.js';
import { readViewportInteractionState } from './viewportInteractionState.js';
import { isPerfProbeEnabled, recordEdgeRedrawSample, recordRenderFrameSample, recordRendererNodeLifecycleSample } from '../modules/perf/perfProbe.js';
import { buildVirtualizationCandidateSets, createRendererStructuralBudget, ensureRendererExactVisiblePreviewCandidates, getRendererStructuralReconcileDelayMs, isNodeInsideViewportPadding, RENDERER_VIRTUALIZATION_CONFIG, resolveRendererLowZoomMountLimit } from './rendererVirtualization.js';
import { createRendererFramePlan } from './rendererFramePlan.js';
import { clearRendererSpatialIndexCache, collectVirtualizedRenderNodes } from './rendererSpatialIndex.js';
import { buildFullEdgeRenderSignature, clearCachedEdgeVisibilityIndex, getCachedEdgeGeometrySignature, getCachedEdgeVisibilityIndex, MANY_EDGES_THRESHOLD } from './rendererEdgeVisibilityIndex.js';
import { createRendererEdgeLayer } from './rendererEdgeLayer.js';
import { normalizeConnectionLineStyle } from './edgePathGeometry.js';
import { installNodeResizeGeometryPreviewer } from './rendererResizePreview.js';
import { buildGroupOutputMembershipSignature } from '../modules/groupDynamicOutput.js';
import { syncRendererBridge } from './rendererBridge.js';
import { createPickConnectBannerEl as a619_0x71eddd, renderPickConnectBanner as a619_0x506dd4 } from './rendererOverlays.js';
import { createRendererSelectionOverlay } from './rendererSelectionOverlay.js';
import { createRendererMediaPresentationCoordinator } from './rendererMediaPresentationCoordinator.js';
import { createRendererInteractionGraceController } from './rendererInteractionGrace.js';
import { createRendererVisibleAudioSurfaceHydrationPass } from './rendererDeferredMedia.js';
import { cancelRendererFastPreviewMediaPreloads, createRendererFastPreviewLayer } from './rendererFastPreviewLayer.js';
import { createRendererRasterPreviewCoordinator } from './rendererRasterPreviewCoordinator.js';
import { createRendererFastPreviewContinuationController, createRendererFastPreviewLifecycleTracker, syncRendererFastPreviewAfterNodeRender } from './rendererFastPreviewContinuation.js';
import { createFastPreviewReleaseScheduler } from './rendererFastPreviewRelease.js';
import { createRendererSourceVideoSlotLifecycle } from './rendererSourceVideoSlotLifecycle.js';
import { resolveRendererVideoMediaLeaseKey } from './rendererVideoMediaResidency.js';
import { cancelCanvasVisibleMediaWarmupPreloads } from './canvasMediaWarmup.js';
import { buildRendererVirtualizationSignature } from './rendererVirtualizationSignature.js';
import { consumeRendererNodeDragCommitHint } from './rendererCommitHints.js';
import { createHeavyMediaPreviewOnlyDecider, createHeavyMediaUpdateFrameBudget, getRendererStructuralBudgetOptions, resolveViewportInteractionReconcileDelay, shouldDeferDenseStructuralEdgeRender, shouldDeferHeavyMediaForInteractionGrace, shouldDeferHeavyMediaMount, shouldDeferHeavyMediaUpdate, shouldForceDeferActiveNodeDetails, shouldForceDeferRelatedVideoDetails, shouldHydratePriorityMediaDuringViewportInteraction, shouldHydrateVideoMediaImmediately, shouldKeepHiddenHeavyMediaUpdatePending, shouldPauseViewportMediaForInteractionGrace, shouldPrepareDenseStructuralEdgeFollowup, shouldQueueNodeDetailHydration, shouldUseDenseStructuralEdgeOnlyFollowup } from './rendererInteractionRenderPolicy.js';
import { applyRendererLowZoomRealVideoCandidates, resolveRendererLowZoomRealVideoNodeIds, shouldDeferInitialVideoMediaOnMount, syncRendererPendingSourceVideoActivationIds } from './rendererPriorityMediaWork.js';
import { applyRendererFullEligibleImageCandidates, collectFullEligibleVisibleImageNodeIds, prioritizeFullEligibleVisibleImageNodes, syncNodeMediaLodMode } from './rendererNodeMediaLod.js';
import { createRendererNodeLifecycleStats, recordRendererLifecycleDuration, recordRendererLifecycleSkippedUpdate } from './rendererNodeLifecyclePerf.js';
import { buildRendererNodeSignature } from './rendererNodeSignature.js';
import { syncNodeResultClass } from './rendererNodeResultState.js';
import { syncNodeMediaMetricsDataset } from '../modules/nodeMediaMetrics.js';
import { createRendererNodeRuntimeBridge } from './rendererNodeRuntimeBridge.js';
import { disposePreparedRendererNodeRuntime, prepareRendererNodeRuntime } from './rendererNodeRuntimeFactory.js';
import { createRendererNodeTimerController } from './rendererNodeTimerController.js';
import { buildRendererDragTargetSet, buildSelectedNodeRankMap, clearRendererNodeLabelTooltip as a619_0x1f77f2, formatRendererNodeLabelText as a619_0xb0d6b2, formatVideoMetaText, getRendererDefaultNodeLabel, getRendererGroupColorWithOpacity as a619_0x581997, getRendererNodeLabelKind as a619_0x268685, getRendererNodeZIndex, setRendererNodeLabelContent as a619_0x3216d8, shouldSkipInitialMediaNodeUpdate, syncRendererFastPreviewPresentationOwner, syncRendererNodeDragTransform, syncRendererNodePresentationZIndex } from './rendererNodePresentation.js';
import { createRendererSelectionFastPath } from './rendererSelectionFastPath.js';
import { clearRendererViewportMediaPreloadPause, syncRendererViewportMediaPreloadPause } from './rendererViewportMediaPreloadPause.js';
import { renderViewport as a619_0x5d8c17 } from './rendererViewportTransform.js';
import { createRendererViewportPreviewCoverage, RENDERER_VIEWPORT_PREVIEW_COVERAGE_CONFIG, shouldPrepareRendererViewportPreviewCoverage } from './rendererViewportPreviewCoverage.js';
import { createRendererViewportJumpDetector } from './rendererViewportJumpDetector.js';
import { createRendererMediaRuntimePreparer, shouldPrebuildRendererMediaRuntime } from './rendererMediaRuntimePreparer.js';
import { installRendererRuntimeDiagnosticAccess, isRendererRuntimeDiagnosticsEnabled, recordRendererRuntimeDiagnostic } from './rendererRuntimeDiagnostics.js';
import { resolveGenerationUiState } from './generationTaskUiState.js';
import { getRendererPickerNodeTypes } from './rendererPickerCatalog.js';
import { t } from '../i18n/index.js';
import { resolveCanvasVideoDisplayUrl, resolveCanvasVideoPosterUrl } from '../services/canvasMediaLocalService.js';
export { buildRendererVirtualizationSignature };
export { formatVideoMetaText };
const _componentMap = new Map();
const _nodeRuntimeBridge = createRendererNodeRuntimeBridge({
  'getInstance': _0x5c0b58 => _componentMap['get'](_0x5c0b58)
});
const _nodeDataSnapshotMap = new Map();
const _sourceVideoSourceKeySnapshotMap = new Map();
const _pendingSourceVideoActivationIds = new Set();
let _sourceVideoActivationRev = null;
let _sourceVideoActivationNodesRef = null;
let _resetSelectionFastPath = null;
const _wrapperMap = new Map();
const _nodeTimerController = createRendererNodeTimerController({
  'getWrapper': _0x5b5e5f => _wrapperMap["get"](_0x5b5e5f)
});
const _mountedNodeIds = new Set();
const _parkedNodeIds = new Set();
const _parkedWrapperMap = new Map();
const _selectionOverlay = createRendererSelectionOverlay({
  'getWrapper': _0x55ddb1 => _wrapperMap["get"](_0x55ddb1) || _parkedWrapperMap["get"](_0x55ddb1) || null,
  'isMounted': _0x3ec61f => _mountedNodeIds["has"](_0x3ec61f)
});
const _fastPreviewLifecycle = createRendererFastPreviewLifecycleTracker();
const _pendingNodeDataMap = new Map();
const _nodeTypeSnapshotMap = new Map();
const _nodePinReasons = new Map();
const MANIFEST_MODEL_NODE_TYPES = new Set(["ai-image", 'ai-text', "ai-video", "ai-audio"]);
let _rendererRuntimeDiagnosticRenderState = {
  'previewOnly': ![],
  'viewportBusy': ![]
};
const _rendererRuntimeDiagnosticsEnabled = isRendererRuntimeDiagnosticsEnabled();
installRendererRuntimeDiagnosticAccess(_0x138ff6 => {
  const _0x4334a5 = _componentMap['get'](_0x138ff6);
  const _0x4375e8 = _wrapperMap['get'](_0x138ff6);
  return {
    'nodeId': _0x138ff6,
    'mounted': _mountedNodeIds["has"](_0x138ff6),
    'parked': _parkedNodeIds["has"](_0x138ff6),
    'rendererMediaDeferred': _0x4334a5?.["_rendererMediaDeferred"] === !![],
    'pinReasons': Array["from"](_nodePinReasons["get"](_0x138ff6) || []),
    'wrapperVideoCount': _0x4375e8?.["querySelectorAll"]?.("video")?.["length"] || 0x0,
    ..._rendererRuntimeDiagnosticRenderState
  };
});
const _rendererInteractionGrace = createRendererInteractionGraceController({
  'delayMs': RENDERER_VIRTUALIZATION_CONFIG["parkAfterInteractionDelayMs"],
  'getDragContext': getInteractionRenderState
});
let _schedulePreparedMediaRuntimeCommit = null;
const _rendererMediaRuntimePreparer = createRendererMediaRuntimePreparer({
  'isInteractionBusy': _rendererInteractionGrace["isBusy"],
  'onPrepared': ({
    nodeId: _0x45135c,
    durationMs: _0x2dd3e2
  }) => {
    _rendererRuntimeDiagnosticsEnabled && recordRendererRuntimeDiagnostic({
      'kind': "renderer-media-runtime-prepared",
      'nodeId': _0x45135c,
      'durationMs': _0x2dd3e2
    });
    _schedulePreparedMediaRuntimeCommit?.();
  },
  'onPrepareError': ({
    nodeId: _0x1b22b,
    error: _0x255832
  }) => {
    console["warn"]("[Renderer] media runtime prebuild failed:", _0x1b22b, _0x255832);
  }
});
const _sourceVideoSlotLifecycle = createRendererSourceVideoSlotLifecycle({
  'getNode': _0x2de466 => _currentSnapshot?.["nodes"]?.[_0x2de466],
  'getWrapper': _0x308bea => _wrapperMap["get"](_0x308bea),
  'releasePreview': _0x3ba9d2 => _fastPreviewLayer["releaseNode"](_0x3ba9d2),
  'forgetScheduledRelease': _0x53cf86 => _fastPreviewRelease["forget"](_0x53cf86)
});
const _fastPreviewLayer = createRendererFastPreviewLayer({
  'getWrapper': _0x1beaa5 => _wrapperMap['get'](_0x1beaa5),
  'isMounted': _0x36b516 => _mountedNodeIds['has'](_0x36b516),
  'resolveMediaPresentationReady': _sourceVideoSlotLifecycle['resolveMediaPresentationReady'],
  'onPresentationOwnerChanged': ({
    active: _0x3a9717,
    wrapper: _0x126e71
  }) => {
    syncRendererFastPreviewPresentationOwner(_0x126e71, _0x3a9717);
  },
  'onMediaPresented': () => {
    if (_rendererInteractionGrace["isBusy"]()) {
      return;
    }
    _schedulePreparedMediaRuntimeCommit?.();
  }
});
const _fastPreviewContinuation = createRendererFastPreviewContinuationController({
  'sync': (..._0x28ccde) => _fastPreviewLayer["sync"](..._0x28ccde)
});
const _fastPreviewRelease = createFastPreviewReleaseScheduler({
  'getWrapper': _0xe95bc0 => _wrapperMap['get'](_0xe95bc0),
  'hasPreview': _0x298c9b => _fastPreviewLayer["hasNodePreview"](_0x298c9b),
  'isMounted': _0x3889c3 => _mountedNodeIds["has"](_0x3889c3),
  'isInteractionBusy': _rendererInteractionGrace["isBusy"],
  'resolveMediaPresentationReady': _sourceVideoSlotLifecycle["resolveMediaPresentationReady"],
  'releasePreview': _0x25a599 => _fastPreviewLayer["releaseNode"](_0x25a599)
});
const _rasterPreviewCoordinator = createRendererRasterPreviewCoordinator({
  'isDomMediaPresented': (_0x546764, _0x2859a7) => _fastPreviewLayer["isNodePresentationReady"](_0x546764, _0x2859a7),
  'onRasterHandoffFrame': _fastPreviewLayer['stageRasterHandoffFrame'],
  'onRasterMediaClaimed': _0xdfac54 => {
    _fastPreviewContinuation["excludeNodes"](_0xdfac54);
    for (const _0x26b331 of _0xdfac54) {
      _fastPreviewLayer["removeNode"](_0x26b331, {
        'collect': ![]
      });
    }
  },
  'onMediaPresented': () => {
    if (_rendererInteractionGrace["isBusy"]()) {
      return;
    }
    _schedulePreparedMediaRuntimeCommit?.();
  }
});
function _markRasterMediaInteractionBusy() {
  _rendererInteractionGrace["markBusy"]();
  _rasterPreviewCoordinator['setMediaLoadingBusy'](!![]);
}
function _releaseRasterMediaInteractionBusy() {
  _rasterPreviewCoordinator["setMediaLoadingBusy"](![]);
  _schedulePreparedMediaRuntimeCommit?.();
}
const RENDERER_DEFERRED_MEDIA_HYDRATION_BATCH_SIZE = 0x2;
const RENDERER_VIDEO_MEDIA_RESIDENCY_PADDING = 0x78;
const RENDERER_INACTIVE_PRESENTED_MEDIA_LEASE_MS = 0x258;
const RENDERER_INACTIVE_PRESENTED_MEDIA_LEASE_LIMIT = 0x3;
const RENDERER_FULL_SURFACE_RELEASE_BATCH_SIZE = 0xc;
const RENDERER_FULL_SURFACE_RELEASE_FRAME_BUDGET_MS = 0x4;
const VISIBLE_VIDEO_STRUCTURAL_RECONCILE_DELAY_MS = 0x0;
const _mediaPresentation = createRendererMediaPresentationCoordinator({
  'getNode': _0x4ce09f => _currentSnapshot?.["nodes"]?.[_0x4ce09f],
  'getComponent': _0x2afcd6 => _componentMap["get"](_0x2afcd6),
  'getWrapper': _0x2d945a => _wrapperMap['get'](_0x2d945a),
  'getParkedWrapper': _0x79fbb2 => _parkedWrapperMap['get'](_0x79fbb2),
  'getWrappers': () => _wrapperMap["values"](),
  'getParkedWrappers': () => _parkedWrapperMap["values"](),
  'isMounted': _0x3b21d2 => _mountedNodeIds["has"](_0x3b21d2),
  'isInteractionBusy': _rendererInteractionGrace['isBusy'],
  'isPinned': _0x995bc1 => _getNodePinSet(_0x995bc1, ![])?.["size"] > 0x0,
  'isSelected': _0x2854b3 => {
    const _0x9c1d6 = _currentSnapshot?.["selectedNodeIds"];
    return Array["isArray"](_0x9c1d6) ? _0x9c1d6['includes'](_0x2854b3) : _0x9c1d6?.["has"]?.(_0x2854b3) === !![];
  },
  'preview': _fastPreviewLayer,
  'previewRelease': _fastPreviewRelease,
  'videoSlots': _sourceVideoSlotLifecycle,
  'batchSize': RENDERER_DEFERRED_MEDIA_HYDRATION_BATCH_SIZE,
  'presentedMediaLeaseMs': RENDERER_INACTIVE_PRESENTED_MEDIA_LEASE_MS,
  'maxRetainedPresentedMedia': RENDERER_INACTIVE_PRESENTED_MEDIA_LEASE_LIMIT,
  'onHydrateDiagnostic': _rendererRuntimeDiagnosticsEnabled ? _0x3596fc => recordRendererRuntimeDiagnostic({
    'kind': 'renderer-media-hydrate',
    ..._0x3596fc
  }) : null,
  'onParkSuspendDiagnostic': _rendererRuntimeDiagnosticsEnabled ? _0x173f2c => recordRendererRuntimeDiagnostic({
    'kind': "video-media-suspend",
    'reason': "park",
    'suspended': !![],
    ..._0x173f2c
  }) : null
});
const {
  media: _rendererDeferredMedia,
  details: _nodeDetailHydration,
  residency: _videoMediaResidency,
  videoBackpressure: _videoHydrationBackpressure
} = _mediaPresentation;
const _viewportJumpDetector = createRendererViewportJumpDetector();
const _edgeLayer = createRendererEdgeLayer({
  'getContainerSize': _getEdgeContainerSize,
  'nowMs': _nowMs,
  'recordRedrawSample': recordEdgeRedrawSample
});
const _edgeDomCache = _edgeLayer["getDomCache"]();
const _nodeToEdgeIds = new Map();
const _incomingEdgeIdsByTarget = new Map();
const FULL_ELIGIBLE_VISIBLE_IMAGE_RECONCILE_DELAY_MS = 0x0;
const FULL_ELIGIBLE_VISIBLE_IMAGE_SETTLED_BUDGET_DELAY_MS = 0xdc;
const HIGH_ZOOM_STALE_WARMUP_PRELOAD_CANCEL_PRIORITY_LIMIT = 0x96;
const HIGH_ZOOM_STALE_FAST_PREVIEW_PRELOAD_CANCEL_PRIORITY_LIMIT = 0x50;
const HIGH_ZOOM_STALE_PRELOAD_CANCEL_THROTTLE_MS = 0xdc;
const VIEWPORT_INTERACTION_PRELOAD_CANCEL_THROTTLE_MS = 0xb4;
const VIEWPORT_INTERACTION_WARMUP_CANCEL_PRIORITY_LIMIT = 0x96;
const VIEWPORT_INTERACTION_FAST_PREVIEW_CANCEL_PRIORITY_LIMIT = 0x50;
let _lastHighZoomStalePreloadCancelAt = 0x0;
let _lastViewportInteractionPreloadCancelAt = 0x0;
let _lastViewportJumpAt = 0x0;
const SELECTION_RELATED_HIGHLIGHT_COLORS = Object["freeze"](["white", "blue", "green", "cyan", "purple", "red", "yellow"]);
function cancelStaleLowPriorityPreloadsForHighZoom(_0x49d598) {
  if (_0x49d598 !== !![]) {
    return;
  }
  const _0xb27973 = typeof performance !== 'undefined' && performance && typeof performance['now'] === "function" ? performance['now']() : Date["now"]();
  if (_lastHighZoomStalePreloadCancelAt > 0x0 && _0xb27973 - _lastHighZoomStalePreloadCancelAt < HIGH_ZOOM_STALE_PRELOAD_CANCEL_THROTTLE_MS) {
    return;
  }
  _lastHighZoomStalePreloadCancelAt = _0xb27973;
  cancelCanvasVisibleMediaWarmupPreloads({
    'includeActive': ![],
    'belowPriority': HIGH_ZOOM_STALE_WARMUP_PRELOAD_CANCEL_PRIORITY_LIMIT,
    'reason': "high zoom viewport media priority"
  });
  cancelRendererFastPreviewMediaPreloads({
    'includeActive': ![],
    'belowPriority': HIGH_ZOOM_STALE_FAST_PREVIEW_PRELOAD_CANCEL_PRIORITY_LIMIT,
    'reason': "high zoom viewport media priority"
  });
}
function cancelQueuedViewportInteractionPreloads(_0x4ff0d5) {
  if (_0x4ff0d5 !== !![]) {
    return;
  }
  const _0x2d1e45 = typeof performance !== "undefined" && performance && typeof performance['now'] === "function" ? performance['now']() : Date["now"]();
  if (_lastViewportInteractionPreloadCancelAt > 0x0 && _0x2d1e45 - _lastViewportInteractionPreloadCancelAt < VIEWPORT_INTERACTION_PRELOAD_CANCEL_THROTTLE_MS) {
    return;
  }
  _lastViewportInteractionPreloadCancelAt = _0x2d1e45;
  cancelCanvasVisibleMediaWarmupPreloads({
    'includeActive': ![],
    'belowPriority': VIEWPORT_INTERACTION_WARMUP_CANCEL_PRIORITY_LIMIT,
    'reason': "viewport interaction"
  });
  cancelRendererFastPreviewMediaPreloads({
    'includeActive': ![],
    'belowPriority': VIEWPORT_INTERACTION_FAST_PREVIEW_CANCEL_PRIORITY_LIMIT,
    'reason': "viewport interaction"
  });
}
function isViewportPriorityImageNode({
  node: _0x36bde2,
  nodeId: _0x33e660,
  mountCandidateIds: _0x5607dd,
  viewport: _0x51e152,
  containerW: _0x2d591e,
  containerH: _0x4f2bc5,
  isSelected: _0x502105,
  isSelectionRelated: _0x119cda
} = {}) {
  if (!_0x33e660 || !isNodeType(_0x36bde2, ["source-image", "ai-image"])) {
    return ![];
  }
  if (!_0x5607dd?.["has"]?.(_0x33e660)) {
    return ![];
  }
  if (_0x502105 || _0x119cda) {
    return !![];
  }
  return _isNodeVisible(_0x36bde2, _0x51e152, _0x2d591e, _0x4f2bc5);
}
function isRendererMediaRuntimeInteractionPriority({
  nodeId: _0x2ac779,
  isSelected: _0x1304fc,
  isSelectionRelated: _0x518052,
  dragTargets: _0x20474f,
  connOverlay: _0x1d5f76,
  pickMode: _0x11ee59
} = {}) {
  if (!_0x2ac779) {
    return ![];
  }
  return !!(_0x1304fc || _0x518052 || _0x20474f?.["has"]?.(_0x2ac779) || _0x1d5f76?.['srcId'] === _0x2ac779 || _0x1d5f76?.["hoverId"] === _0x2ac779 || _0x11ee59?.["sourceNodeId"] === _0x2ac779 || _0x11ee59?.["hoverNodeId"] === _0x2ac779);
}
let _edgeIndexRev = -0x1;
let _edgeEntriesRev = -0x1;
let _edgeEntriesSource = null;
let _edgeEntriesCache = [];
let _cachedContainerWidth = null;
let _cachedContainerHeight = null;
let _lastFullEdgeRenderSignature = '';
let _edgeDomClearedSinceLastFull = ![];
let _lastVirtualCandidateSignature = '';
let _lastVirtualCandidateResult = null;
let _containerSizeSourceEl = null;
let _containerResizeObserver = null;
let _containerResizeHandler = null;
let _currentSnapshot = null;
function _getNodePinSet(_0x20b10a, _0x44299f = ![]) {
  let _0x38ab39 = _nodePinReasons['get'](_0x20b10a);
  !_0x38ab39 && _0x44299f && (_0x38ab39 = new Set(), _nodePinReasons['set'](_0x20b10a, _0x38ab39));
  return _0x38ab39 || null;
}
function _getPinnedNodeIds() {
  const _0x50bef2 = new Set();
  for (const [_0x55684f, _0x38342b] of _nodePinReasons["entries"]()) {
    _0x38342b && _0x38342b["size"] > 0x0 && _0x50bef2['add'](_0x55684f);
  }
  return _0x50bef2;
}
function _clearNodePin(_0x4c95ed) {
  _nodePinReasons['delete'](_0x4c95ed);
}
function _clearAnchoredUiForNode(_0x1ec350) {
  if (!_0x1ec350) {
    return;
  }
  const _0x5d703f = _componentMap["get"](_0x1ec350);
  _0x5d703f && typeof _0x5d703f['highlightCell'] === "function" && _0x5d703f["highlightCell"](-0x1);
}
function _resolveVideoMediaLeaseKey(_0x5ca464, _0x53070e) {
  const _0xf2fe03 = _sourceVideoSlotLifecycle['isManagedNode'](_0x5ca464) ? _sourceVideoSlotLifecycle["read"](_0x5ca464) : null;
  return resolveRendererVideoMediaLeaseKey(_0x53070e, _0xf2fe03);
}
function _parkNode(_0x29c821) {
  const _0xcdbb47 = _wrapperMap['get'](_0x29c821);
  if (!_0xcdbb47) {
    return null;
  }
  _sourceVideoSlotLifecycle["isManagedNode"](_0x29c821) && (_sourceVideoSlotLifecycle["syncVisibility"](_0x29c821, 'far'), _sourceVideoSlotLifecycle["setResidency"](_0x29c821, "parked"));
  _mediaPresentation["forgetHydration"](_0x29c821);
  _nodeTimerController["hideNode"](_0x29c821);
  _0xcdbb47["isConnected"] && _0xcdbb47["remove"]();
  const _0x8ae6f = _componentMap["get"](_0x29c821);
  let _0x19ae29 = ![];
  try {
    _0x19ae29 = _0x8ae6f?.["hasPresentedRendererMedia"]?.() === !![];
  } catch {}
  _videoMediaResidency["park"](_0x29c821, {
    'retainPresentedMedia': _0x19ae29,
    'leaseKey': _resolveVideoMediaLeaseKey(_0x29c821, _currentSnapshot?.["nodes"]?.[_0x29c821])
  });
  _mountedNodeIds['delete'](_0x29c821);
  _parkedNodeIds["add"](_0x29c821);
  _parkedWrapperMap["set"](_0x29c821, _0xcdbb47);
  _fastPreviewLifecycle["record"](_nodeTypeSnapshotMap["get"](_0x29c821));
  _clearAnchoredUiForNode(_0x29c821);
  _nodeRuntimeBridge["unregister"](_0x29c821);
  return _0xcdbb47;
}
function _mountNode(_0x81fe42, _0x2f9cf4) {
  const _0x5eb4b1 = _wrapperMap['get'](_0x81fe42);
  if (!_0x5eb4b1) {
    return null;
  }
  _videoMediaResidency["unpark"](_0x81fe42);
  !_0x5eb4b1["isConnected"] && _0x2f9cf4["appendChild"](_0x5eb4b1);
  _parkedWrapperMap["delete"](_0x81fe42);
  _parkedNodeIds['delete'](_0x81fe42);
  _mountedNodeIds["add"](_0x81fe42);
  _sourceVideoSlotLifecycle["setResidency"](_0x81fe42, "mounted");
  _fastPreviewLifecycle["record"](_nodeTypeSnapshotMap['get'](_0x81fe42));
  _nodeRuntimeBridge["register"](_0x81fe42);
  return _0x5eb4b1;
}
function _flushMountBatch(_0x5f12ca, _0x29bc70) {
  if (!_0x5f12ca || !_0x29bc70) {
    return;
  }
  if (_0x29bc70['childNodes'] && _0x29bc70["childNodes"]["length"] === 0x0) {
    return;
  }
  _0x5f12ca["appendChild"](_0x29bc70);
}
function _destroyNode(_0x4735ff) {
  _rendererMediaRuntimePreparer['forget'](_0x4735ff);
  _mediaPresentation["forget"](_0x4735ff);
  _nodeTimerController["hideNode"](_0x4735ff);
  const _0x20b802 = _componentMap["get"](_0x4735ff);
  try {
    _0x20b802 && typeof _0x20b802["unmount"] === "function" && _0x20b802["unmount"]();
  } catch {}
  const _0x34efb4 = _wrapperMap["get"](_0x4735ff) || _parkedWrapperMap["get"](_0x4735ff);
  _0x34efb4 && _0x34efb4['isConnected'] && _0x34efb4["remove"]();
  _componentMap["delete"](_0x4735ff);
  _nodeDataSnapshotMap['delete'](_0x4735ff);
  _sourceVideoSourceKeySnapshotMap["delete"](_0x4735ff);
  _pendingSourceVideoActivationIds["delete"](_0x4735ff);
  _wrapperMap["delete"](_0x4735ff);
  _mountedNodeIds['delete'](_0x4735ff);
  _parkedNodeIds['delete'](_0x4735ff);
  _parkedWrapperMap['delete'](_0x4735ff);
  _pendingNodeDataMap["delete"](_0x4735ff);
  _nodeTypeSnapshotMap["delete"](_0x4735ff);
  _nodeRuntimeBridge["unregister"](_0x4735ff);
  _sourceVideoSlotLifecycle["isManagedNode"](_0x4735ff) && _sourceVideoSlotLifecycle['forget'](_0x4735ff);
  _clearNodePin(_0x4735ff);
  _fastPreviewLayer['discardNode'](_0x4735ff);
}
function _syncRendererBridge() {
  syncRendererBridge(typeof window === "undefined" ? null : window, {
    'componentMap': _componentMap,
    'wrapperMap': _wrapperMap,
    'mountedNodeIds': _mountedNodeIds,
    'nodeToEdgeIds': _nodeToEdgeIds,
    'getEdgeLayerStats': _edgeLayer["getStats"],
    'hitTestEdgeAtScreenPoint': _edgeLayer["hitTestEdgeAtScreenPoint"],
    'prepareDynamicEdges': _edgeLayer["prepareDynamicEdges"],
    'setEdgeInteractionHighlight': _edgeLayer['setActiveEdge'],
    'setHoveredEdge': _edgeLayer["setHoveredEdge"],
    'markViewportInteractionBusy': _markRasterMediaInteractionBusy,
    'releaseViewportInteractionBusy': _releaseRasterMediaInteractionBusy,
    'captureRasterPreviewNode': _rasterPreviewCoordinator['captureNodeFrame'],
    'excludeRasterPreviewNode': _rasterPreviewCoordinator["excludeNode"],
    'syncFastPreviewDragProxy': _fastPreviewLayer["syncNodeDragPreview"],
    'releaseFastPreviewForPlayback'(_0x399529) {
      if (!_0x399529) {
        return ![];
      }
      if (_sourceVideoSlotLifecycle["isManagedNode"](_0x399529)) {
        return ![];
      }
      const _0x3ba665 = _fastPreviewLayer["releaseNode"](_0x399529) === !![];
      if (!_0x3ba665) {
        return ![];
      }
      const _0x19a0e5 = _wrapperMap["get"](_0x399529);
      _0x19a0e5?.["dataset"] && (_0x19a0e5["dataset"]["fastPreviewReleasedForPlayback"] = '1');
      _fastPreviewRelease["forget"](_0x399529);
      return !![];
    },
    'prepareMediaSlotSource'(_0x6d7867, _0x38eb06, _0x395b49 = {}) {
      return _sourceVideoSlotLifecycle["prepareSource"](_0x6d7867, _0x38eb06, _0x395b49);
    },
    'reportMediaSlotFrame': _sourceVideoSlotLifecycle["reportFrame"],
    'pinNode'(_0x4e8abd, _0x24211d = "src/ui/") {
      if (!_0x4e8abd) {
        return;
      }
      const _0x3d6706 = _getNodePinSet(_0x4e8abd, !![]);
      _0x3d6706["add"](String(_0x24211d || "src/ui/"));
      _rendererRuntimeDiagnosticsEnabled && recordRendererRuntimeDiagnostic({
        'kind': "renderer-node-pin",
        'nodeId': _0x4e8abd,
        'reason': String(_0x24211d || "src/ui/"),
        'pinReasons': Array["from"](_0x3d6706)
      });
    },
    'unpinNode'(_0x2b4bf1, _0x481b98 = "src/ui/") {
      if (!_0x2b4bf1) {
        return;
      }
      const _0x1e819c = _getNodePinSet(_0x2b4bf1, ![]);
      if (!_0x1e819c) {
        return;
      }
      _0x1e819c['delete'](String(_0x481b98 || "src/ui/"));
      _0x1e819c["size"] === 0x0 && (_nodePinReasons["delete"](_0x2b4bf1), _schedulePreparedMediaRuntimeCommit?.());
      _rendererRuntimeDiagnosticsEnabled && recordRendererRuntimeDiagnostic({
        'kind': "renderer-node-unpin",
        'nodeId': _0x2b4bf1,
        'reason': String(_0x481b98 || "src/ui/"),
        'pinReasons': Array["from"](_0x1e819c)
      });
    }
  });
}
function _rebuildEdgeIndex(_0x33a3d6) {
  _nodeToEdgeIds["clear"]();
  _incomingEdgeIdsByTarget["clear"]();
  for (const _0x5ade16 of _0x33a3d6 || []) {
    if (!_0x5ade16) {
      continue;
    }
    const _0x4949c8 = _0x5ade16["sourceId"];
    const _0x17926a = _0x5ade16["targetId"];
    if (_0x4949c8) {
      let _0x3571af = _nodeToEdgeIds["get"](_0x4949c8);
      !_0x3571af && (_0x3571af = new Set(), _nodeToEdgeIds["set"](_0x4949c8, _0x3571af));
      _0x3571af["add"](_0x5ade16['id']);
    }
    if (_0x17926a) {
      let _0x1e11fc = _nodeToEdgeIds["get"](_0x17926a);
      !_0x1e11fc && (_0x1e11fc = new Set(), _nodeToEdgeIds["set"](_0x17926a, _0x1e11fc));
      _0x1e11fc["add"](_0x5ade16['id']);
      let _0x2bfe1b = _incomingEdgeIdsByTarget["get"](_0x17926a);
      !_0x2bfe1b && (_0x2bfe1b = [], _incomingEdgeIdsByTarget["set"](_0x17926a, _0x2bfe1b));
      _0x2bfe1b["push"](_0x5ade16['id']);
    }
  }
}
function _ensureEdgeIndex(_0x3c52c7, _0x2896ce) {
  const _0x44c920 = typeof _0x2896ce === "number" ? _0x2896ce : 0x0;
  if (_0x44c920 === _edgeIndexRev) {
    return;
  }
  const _0x36abdb = _0x3c52c7 || {};
  const _0x3aaf6e = Object['values'](_0x36abdb);
  _rebuildEdgeIndex(_0x3aaf6e);
  _edgeIndexRev = _0x44c920;
  _edgeEntriesCache = _0x3aaf6e;
  _edgeEntriesRev = _0x44c920;
  _edgeEntriesSource = _0x36abdb;
}
function _getEdgeEntries(_0x5b9f2a, _0x256994) {
  const _0xb0ed55 = typeof _0x256994 === "number";
  const _0x210d5f = _0xb0ed55 ? _0x256994 : 0x0;
  const _0x5e77f7 = _0xb0ed55 ? _0x210d5f === _edgeEntriesRev : _0x210d5f === _edgeEntriesRev && _0x5b9f2a === _edgeEntriesSource;
  if (_0x5e77f7) {
    return _edgeEntriesCache;
  }
  _edgeEntriesCache = Object["values"](_0x5b9f2a || {});
  _edgeEntriesRev = _0x210d5f;
  _edgeEntriesSource = _0x5b9f2a || null;
  return _edgeEntriesCache;
}
function _buildSelectionRelatedSets(_0x4c6451, _0x4b4187) {
  const _0x359390 = _0x4c6451 instanceof Set ? _0x4c6451 : new Set(Array["isArray"](_0x4c6451) ? _0x4c6451 : []);
  const _0x75a384 = new Set();
  const _0x385fcb = new Set();
  if (_0x359390["size"] === 0x0) {
    return {
      'relatedNodeIds': _0x75a384,
      'relatedEdgeIds': _0x385fcb
    };
  }
  for (const _0x3660cf of _0x359390) {
    const _0x19c8d5 = _nodeToEdgeIds["get"](_0x3660cf);
    if (!_0x19c8d5) {
      continue;
    }
    for (const _0xd423dc of _0x19c8d5) {
      if (!_0xd423dc || _0x385fcb["has"](_0xd423dc)) {
        continue;
      }
      const _0x2ae7df = _0x4b4187?.[_0xd423dc];
      if (!_0x2ae7df?.['id']) {
        continue;
      }
      const _0x27ccd7 = _0x2ae7df["sourceId"];
      const _0x486e04 = _0x2ae7df["targetId"];
      const _0x4417a8 = _0x359390["has"](_0x27ccd7);
      const _0x785caa = _0x359390["has"](_0x486e04);
      if (!_0x4417a8 && !_0x785caa) {
        continue;
      }
      _0x385fcb["add"](_0x2ae7df['id']);
      if (_0x27ccd7 && !_0x4417a8) {
        _0x75a384["add"](_0x27ccd7);
      }
      if (_0x486e04 && !_0x785caa) {
        _0x75a384["add"](_0x486e04);
      }
    }
  }
  return {
    'relatedNodeIds': _0x75a384,
    'relatedEdgeIds': _0x385fcb
  };
}
function _normalizeSelectionRelatedHighlightColor(_0x590e90) {
  const _0x449ae6 = String(_0x590e90 || '')['trim']();
  return SELECTION_RELATED_HIGHLIGHT_COLORS["includes"](_0x449ae6) ? _0x449ae6 : "white";
}
function _syncContainerSizeCache(_0x37328f = _containerSizeSourceEl) {
  const _0x3e34ea = _0x37328f || _containerSizeSourceEl || null;
  const _0x3c44a2 = _0x3e34ea ? Number(_0x3e34ea["clientWidth"]) : Number(window['innerWidth']);
  const _0x1eef6f = _0x3e34ea ? Number(_0x3e34ea["clientHeight"]) : Number(window['innerHeight']);
  _cachedContainerWidth = Number['isFinite'](_0x3c44a2) ? _0x3c44a2 : Number(window["innerWidth"]);
  _cachedContainerHeight = Number["isFinite"](_0x1eef6f) ? _0x1eef6f : Number(window['innerHeight']);
  return {
    'width': _cachedContainerWidth,
    'height': _cachedContainerHeight
  };
}
function _nowMs() {
  return typeof performance !== "undefined" && typeof performance["now"] === 'function' ? performance["now"]() : Date["now"]();
}
function _hasCachedContainerSize() {
  return Number["isFinite"](_cachedContainerWidth) && Number['isFinite'](_cachedContainerHeight);
}
function _getCachedContainerSize(_0x185de9 = _containerSizeSourceEl, _0x3e5f50 = {}) {
  const _0xd6a284 = _0x185de9 || _containerSizeSourceEl || null;
  const _0x3e2d1a = typeof ResizeObserver === 'function' && !!_containerResizeObserver;
  const _0x105a60 = _0x3e5f50?.["refresh"] === !![] || !_hasCachedContainerSize() || !_0x3e2d1a || _0xd6a284 && _containerSizeSourceEl && _0xd6a284 !== _containerSizeSourceEl;
  if (_0x105a60) {
    return _syncContainerSizeCache(_0xd6a284);
  }
  return {
    'width': _cachedContainerWidth,
    'height': _cachedContainerHeight
  };
}
function _getEdgeContainerSize(_0x4b6093) {
  const _0xb2ebdf = _nowMs();
  const _0x8d194b = _getCachedContainerSize(_containerSizeSourceEl || _0x4b6093);
  const _0xdbe174 = _nowMs();
  return {
    'containerW': Number['isFinite'](_0x8d194b["width"]) ? _0x8d194b["width"] : 0x0,
    'containerH': Number['isFinite'](_0x8d194b["height"]) ? _0x8d194b["height"] : 0x0,
    'layoutReadMs': Math['max'](0x0, _0xdbe174 - _0xb2ebdf)
  };
}
function _invalidateFullEdgeRenderSignature({
  clearedDom = ![]
} = {}) {
  _lastFullEdgeRenderSignature = '';
  clearedDom && (_edgeDomClearedSinceLastFull = !![]);
}
function _notifyVirtualizationProbe(_0xd2d07b) {
  const _0x51106a = typeof window !== "undefined" ? window["__rendererVirtualizationProbe"] : null;
  if (!_0x51106a || typeof _0x51106a['onCandidateSignatureEvaluated'] !== "function") {
    return;
  }
  try {
    _0x51106a["onCandidateSignatureEvaluated"](_0xd2d07b);
  } catch {}
}
function _collectMovedNodeIds(_0xa55c03, _0x2d1b84) {
  const _0x29dfc6 = new Set(_0xa55c03["selectedNodeIds"] || []);
  const _0x51337a = _0x2d1b84?.["targetNodeId"] || null;
  if (_0x51337a) {
    _0x29dfc6["add"](_0x51337a);
  }
  const _0x2d81b2 = _0xa55c03["_parentToChildren"] || {};
  const _0x44abe5 = Array["from"](_0x29dfc6);
  for (let _0x5754de = 0x0; _0x5754de < _0x44abe5['length']; _0x5754de++) {
    const _0x2c3789 = _0x44abe5[_0x5754de];
    const _0x68515a = _0x2d81b2[_0x2c3789];
    if (!_0x68515a || _0x68515a["size"] === 0x0) {
      continue;
    }
    for (const _0x41b89b of _0x68515a) {
      !_0x29dfc6["has"](_0x41b89b) && (_0x29dfc6["add"](_0x41b89b), _0x44abe5['push'](_0x41b89b));
    }
  }
  return _0x29dfc6;
}
function _resolveDragRenderOffset(_0x13ce09, _0x5a7037) {
  if (!_0x5a7037?.['isDragging']) {
    return null;
  }
  const _0x4e769c = _collectMovedNodeIds(_0x13ce09, _0x5a7037);
  if (!_0x4e769c || _0x4e769c["size"] === 0x0) {
    return null;
  }
  return {
    'movedNodeIds': _0x4e769c,
    'dx': Number['isFinite'](_0x5a7037['pendingDx']) ? _0x5a7037["pendingDx"] : 0x0,
    'dy': Number['isFinite'](_0x5a7037["pendingDy"]) ? _0x5a7037["pendingDy"] : 0x0
  };
}
export function clearRendererCache() {
  _rendererMediaRuntimePreparer["clear"]();
  console["log"]("[Renderer] 执行全盘物理清盘...");
  const _0x5ac989 = new Set([..._componentMap["keys"](), ..._wrapperMap['keys'](), ..._parkedWrapperMap["keys"](), ..._mountedNodeIds, ..._parkedNodeIds]);
  for (const _0x280490 of _0x5ac989) {
    _destroyNode(_0x280490);
  }
  _clearRenderedEdgesFromDocument();
  _edgeLayer["reset"]();
  _selectionOverlay['reset']();
  _nodeToEdgeIds["clear"]();
  _incomingEdgeIdsByTarget["clear"]();
  _edgeIndexRev = -0x1;
  _edgeEntriesRev = -0x1;
  _edgeEntriesSource = null;
  _edgeEntriesCache = [];
  clearCachedEdgeVisibilityIndex();
  _cachedContainerWidth = null;
  _cachedContainerHeight = null;
  _lastFullEdgeRenderSignature = '';
  _edgeDomClearedSinceLastFull = ![];
  _lastVirtualCandidateSignature = '';
  _lastVirtualCandidateResult = null;
  _fastPreviewContinuation["reset"]();
  _fastPreviewLifecycle["reset"]();
  _sourceVideoSlotLifecycle["reset"]();
  _sourceVideoSourceKeySnapshotMap["clear"]();
  _pendingSourceVideoActivationIds['clear']();
  _sourceVideoActivationRev = null;
  _sourceVideoActivationNodesRef = null;
  clearRendererSpatialIndexCache();
  _resetSelectionFastPath?.();
  _containerSizeSourceEl = null;
  _rendererInteractionGrace['reset']();
  _viewportJumpDetector["reset"]();
  _lastViewportJumpAt = 0x0;
  clearRendererViewportMediaPreloadPause();
  _nodePinReasons["clear"]();
  _pendingNodeDataMap['clear']();
  _nodeTypeSnapshotMap['clear']();
  _mediaPresentation["clear"]();
  _fastPreviewLayer["clear"]();
  _rasterPreviewCoordinator["reset"]();
  _nodeTimerController["clear"]();
  _currentSnapshot = null;
}
export function refreshManifestModelNodeUis() {
  const _0x410294 = [];
  const _0x4637a5 = [];
  for (const [_0x3a9604, _0x47a3bc] of [..._componentMap["entries"]()]) {
    const _0x397700 = _currentSnapshot?.["nodes"]?.[_0x3a9604];
    if (!_0x397700 || !MANIFEST_MODEL_NODE_TYPES['has'](normalizeNodeType(_0x397700['type']))) {
      continue;
    }
    if (typeof _0x47a3bc?.["refreshModelRegistryUi"] === "function") {
      try {
        _0x47a3bc["refreshModelRegistryUi"]();
        _0x410294["push"](_0x3a9604);
        continue;
      } catch (_0x25873e) {
        console["warn"]("[Renderer] refresh model registry UI failed:", _0x25873e);
      }
    }
    _destroyNode(_0x3a9604);
    _0x4637a5["push"](_0x3a9604);
  }
  return {
    'refreshedNodeIds': _0x410294,
    'remountedNodeIds': _0x4637a5
  };
}
window["_edgeDomCache"] = _edgeDomCache;
_syncRendererBridge();
function _isNodeVisible(_0x39248a, _0x3e9c56, _0x4e3db3, _0x50973d, _0x22e36e = 0x0, _0x148a4c = 0x0) {
  return isNodeInsideViewportPadding(_0x39248a, _0x3e9c56, _0x4e3db3, _0x50973d, 0xc8, _0x22e36e, _0x148a4c);
}
function _renderCullingOnly(_0xd428da, _0x39d6f6, _0x223c6a, _0x3cd47b = {}) {
  const _0x338f16 = _0x3cd47b?.["hideInvisible"] !== ![];
  const {
    width: _0x51b609,
    height: _0x40d6ab
  } = _getCachedContainerSize(_0xd428da["parentElement"] || _0xd428da);
  for (const _0x141a5d of _mountedNodeIds) {
    const _0x23c892 = _0x39d6f6?.[_0x141a5d];
    if (!_0x23c892) {
      continue;
    }
    const _0x469d95 = _wrapperMap["get"](_0x141a5d);
    if (!_0x469d95 || !_0x469d95["isConnected"] || _0x469d95["classList"]?.["contains"]?.("is-dragging")) {
      continue;
    }
    const _0x5ce0f7 = _isNodeVisible(_0x23c892, _0x223c6a, _0x51b609, _0x40d6ab);
    if (!_0x5ce0f7) {
      if (!_0x338f16) {
        continue;
      }
      _nodeTimerController["hideNode"](_0x141a5d);
      if (_0x469d95["style"]["display"] !== 'none') {
        _0x469d95["style"]["display"] = 'none';
      }
    } else {
      _nodeTimerController["trackNode"](_0x141a5d, _0x23c892);
      if (_0x469d95["style"]["display"] === "none") {
        _0x469d95["style"]["display"] = '';
      }
    }
  }
}
export function initRenderer(_0x380445, _0x55c9c2, _0x35f72b) {
  _0x55c9c2['style']['transformOrigin'] = "0 0";
  _0x55c9c2["style"]['position'] = "absolute";
  _0x55c9c2["style"]["top"] = '0';
  _0x55c9c2['style']["left"] = '0';
  const _0xa94483 = _createSvgLayer();
  _0x55c9c2["prepend"](_0xa94483);
  const _0x22411a = _0xa94483["querySelector"]("svg");
  _containerSizeSourceEl = _0x55c9c2["parentElement"] || _0x380445;
  _syncContainerSizeCache(_containerSizeSourceEl);
  typeof ResizeObserver === "function" && _containerSizeSourceEl && (_containerResizeObserver = new ResizeObserver(() => {
    _syncContainerSizeCache(_containerSizeSourceEl);
  }), _containerResizeObserver["observe"](_containerSizeSourceEl));
  const _0x577aa0 = _createPickerEl();
  _0x380445["appendChild"](_0x577aa0);
  const _0x314ada = a619_0x71eddd();
  _0x380445['appendChild'](_0x314ada);
  _selectionOverlay["mount"](_0x55c9c2);
  const _0x55592e = _createSelectionRectEl();
  _0x380445["appendChild"](_0x55592e);
  _syncRendererBridge();
  const _0xdedb25 = createRendererPresentationSubscription({
    'onSnapshot': _0x243f35 => {
      _currentSnapshot = _0x243f35;
    },
    'flushSelection': _0xde095c => _0x5198a2["flushSelectionOnlySnapshot"](_0xde095c),
    'render': _0x360c31 => {
      _nodeTimerController['syncSnapshot'](_0x360c31);
      _0x7bbf0(_0x360c31);
    },
    'onSuspend': () => {
      _0x22b723();
      _0x5198a2['reset']();
      _rendererMediaRuntimePreparer["pause"]();
      _mediaPresentation["pause"]();
      _nodeTimerController["clear"]();
      cancelCanvasVisibleMediaWarmupPreloads();
    },
    'onResume': () => {
      _mediaPresentation["resume"]();
      _rendererMediaRuntimePreparer["resume"]();
    }
  });
  let _0x5ae228 = -0x1;
  let _0x2027dc = -0x1;
  let _0x361f1c = -0x1;
  const _0x4dd7f2 = (_0x323d2e, _0x755fb5) => Number["isFinite"](_0x323d2e?.['_nodeMembershipRev']) ? _0x323d2e['_nodeMembershipRev'] : _0x755fb5;
  let _0x2c7051 = 0x0;
  let _0x503d16 = null;
  let _0x7a591f = null;
  let _0x4c8dd7 = !![];
  let _0x30c085 = ![];
  let _0x11e1f8 = null;
  function _0x550e6d(_0x134187, _0x2611ca, _0xc70807, _0x509602) {
    if (!_0x134187 || !_0x2611ca) {
      return null;
    }
    const _0x5af818 = _0x134187['ui']?.["selectionRelatedHighlightEnabled"] === ![] ? {
      'relatedNodeIds': new Set()
    } : _buildSelectionRelatedSets(_0x134187["selectedNodeIds"], _0x134187["edges"]);
    return _renderNodes(_0x55c9c2, _0x134187["nodes"], _0x134187["selectedNodeIds"], _0x5af818["relatedNodeIds"], _normalizeSelectionRelatedHighlightColor(_0x134187['ui']?.["selectionRelatedHighlightColor"]), _0x134187['connOverlay'], _0x134187["pickConnectMode"], _0x2611ca, _0x134187["edges"], _0x134187['_parentToChildren'], _0x134187['ui']?.["showVideoMeta"] === !![], _0x134187, {
      'deferParking': !![],
      'mode': _0xc70807,
      'viewportPriorityMediaOnly': !![],
      'framePlan': _0x509602
    });
  }
  function _0x22b723() {
    _0x503d16 !== null && (clearTimeout(_0x503d16), _0x503d16 = null);
    _0x7a591f !== null && (cancelAnimationFrame(_0x7a591f), _0x7a591f = null);
  }
  function _0x367e32(_0x57c32e = RENDERER_VIRTUALIZATION_CONFIG['settleDelayMs'], {
    bypassInteractionGrace = ![],
    edgeOnlySnapshot = null
  } = {}) {
    _0x22b723();
    if (!_0xdedb25["isActive"]()) {
      return;
    }
    _0x4c8dd7 = edgeOnlySnapshot === null;
    _0x503d16 = setTimeout(() => {
      _0x503d16 = null;
      if (_0x7a591f !== null) {
        return;
      }
      _0x7a591f = requestAnimationFrame(() => {
        _0x7a591f = null;
        if (_0xdedb25["hasPendingFrame"]()) {
          _0x367e32(_0x57c32e, {
            'bypassInteractionGrace': bypassInteractionGrace,
            'edgeOnlySnapshot': edgeOnlySnapshot
          });
          return;
        }
        if (!_currentSnapshot) {
          return;
        }
        if (!bypassInteractionGrace && _rendererInteractionGrace["isBusy"]()) {
          _0x367e32(_0x57c32e, {
            'bypassInteractionGrace': bypassInteractionGrace,
            'edgeOnlySnapshot': edgeOnlySnapshot
          });
          return;
        }
        _0x7bbf0(_currentSnapshot, {
          'skipNodesForDenseEdgeFollowup': edgeOnlySnapshot !== null && _currentSnapshot === edgeOnlySnapshot
        });
      });
    }, Math["max"](0x0, _0x57c32e));
  }
  const _0xa572a3 = () => {
    if (_0x7a591f !== null && _0x4c8dd7) {
      return;
    }
    _0x367e32(0x0);
  };
  _schedulePreparedMediaRuntimeCommit = _0xa572a3;
  const _0x5198a2 = createRendererSelectionFastPath({
    'ensureEdgeIndex': _ensureEdgeIndex,
    'buildSelectionRelatedSets': _buildSelectionRelatedSets,
    'hasPendingRender': _0xdedb25["hasPendingFrame"],
    'cancelPendingRender': _0xdedb25["cancelPending"],
    'setCurrentSnapshot': _0x554764 => {
      _currentSnapshot = _0x554764;
      _0xdedb25["clearPendingSnapshot"]();
    },
    'consumeViewport': _0x5cb0c6 => _viewportJumpDetector["consume"](_0x5cb0c6),
    'flushSelectionUpdate': (_0x3d0b0c, _0x557854) => _0x5b06b6(_0x3d0b0c, _0x557854),
    'renderAffectedEdges': (_0x5acba9, _0x95599, _0x3d377b) => {
      if (_0x5acba9["size"] === 0x0 || _0x95599['ui']?.["connectionLinesVisible"] === ![]) {
        return;
      }
      _renderEdgesByIds(_0x22411a, _0x5acba9, _0x95599['edges'] || {}, _0x95599['nodes'] || {}, _0x95599["viewport"], _0x380445, null, _0x3d377b, {
        'pathStyle': _0x95599['ui']?.["connectionLineStyle"]
      });
    },
    'renderSelectionOverlays': _0xb8e64 => {
      _selectionOverlay['render'](_0xb8e64);
    }
  });
  const _0x176880 = () => _0x5198a2['reset']();
  _resetSelectionFastPath = _0x176880;
  const _0x2b6d75 = createRendererPanPreviewReconciler({
    'canvasEl': _0x55c9c2,
    'svgWrapper': _0xa94483,
    'getSnapshot': () => _currentSnapshot,
    'hasPendingStoreRender': _0xdedb25["hasPendingFrame"],
    'markBusy': _rendererInteractionGrace["markBusy"],
    'renderViewport': a619_0x5d8c17,
    'renderNodes': _renderNodes,
    'buildSelectionRelatedSets': _buildSelectionRelatedSets,
    'normalizeSelectionRelatedHighlightColor': _normalizeSelectionRelatedHighlightColor,
    'scheduleDeferredReconcile': _0x367e32
  });
  installNodeResizeGeometryPreviewer(typeof window === "undefined" ? null : window, () => _currentSnapshot, _ensureEdgeIndex, _nodeToEdgeIds, (_0x242f8e, _0x309a39, _0x221eeb) => _renderEdgesByIds(_0x22411a, _0x242f8e, _0x221eeb["edges"] || {}, _0x309a39, _0x221eeb["viewport"], _0x380445, null, null, {
    'pathStyle': _0x221eeb['ui']?.['connectionLineStyle']
  }));
  function _0x56266e(_0x445cc8, _0x396a68 = "steady", _0x31a491, {
    skipNodes = ![]
  } = {}) {
    const _0xe10ebe = Number['isFinite'](_0x31a491?.["nodeCount"]) ? _0x31a491["nodeCount"] : typeof _0x445cc8["_nodeCount"] === "number" ? _0x445cc8["_nodeCount"] : Object["keys"](_0x445cc8['nodes'] || {})['length'];
    const _0x141f82 = _0x4dd7f2(_0x445cc8, _0xe10ebe);
    const _0x52f076 = typeof _0x445cc8["_edgesRev"] === "number" ? _0x445cc8["_edgesRev"] : 0x0;
    const _0x4be6f7 = Number["isFinite"](_0x445cc8["_nodeGeometryRev"]) ? _0x445cc8["_nodeGeometryRev"] : Number["isFinite"](_0x445cc8["_persistRev"]) ? _0x445cc8['_persistRev'] : _0xe10ebe;
    const _0x389b9b = _0x52f076 !== _0x361f1c;
    const _0x8c04f4 = _0xe10ebe !== _0x5ae228 || _0x141f82 !== _0x2027dc;
    const _0x3a940c = skipNodes || _0x11e1f8 === _0x445cc8 && _0x396a68 === 'steady' && !_0x8c04f4 && !_0x389b9b;
    _0x11e1f8 !== null && (_0x11e1f8 = null);
    (_0x8c04f4 || _0x389b9b) && (_0x5ae228 = _0xe10ebe, _0x2027dc = _0x141f82, _0x361f1c = _0x52f076, _cleanupNodes(_0x55c9c2, _0x445cc8["nodes"]), _cleanupEdges(_0x22411a, _0x445cc8["edges"]));
    _ensureEdgeIndex(_0x445cc8["edges"], _0x52f076);
    const _0x2aa067 = _0x445cc8['ui']?.["selectionRelatedHighlightEnabled"] === ![] ? {
      'relatedNodeIds': new Set(),
      'relatedEdgeIds': new Set()
    } : _buildSelectionRelatedSets(_0x445cc8["selectedNodeIds"], _0x445cc8["edges"]);
    const _0xe6d6a4 = _normalizeSelectionRelatedHighlightColor(_0x445cc8['ui']?.["selectionRelatedHighlightColor"]);
    const _0x355839 = _rendererInteractionGrace["getRemainingMs"]();
    const _0x688167 = shouldDeferHeavyMediaForInteractionGrace({
      'remainingMs': _0x355839,
      'viewport': _0x445cc8["viewport"],
      'nodeCount': _0xe10ebe,
      'hasPriorityMediaWork': ![]
    });
    const _0x3873f5 = _0x31a491?.["hasPriorityMediaWork"]?.({
      'needed': _0x688167
    }) === !![];
    const _0x142013 = shouldDeferHeavyMediaForInteractionGrace({
      'remainingMs': _0x355839,
      'viewport': _0x445cc8['viewport'],
      'nodeCount': _0xe10ebe,
      'hasPriorityMediaWork': _0x3873f5
    });
    const _0x4a63d1 = _0x445cc8['edges'] || {};
    const _0x410940 = _getEdgeEntries(_0x4a63d1, _0x52f076);
    const _0x1db837 = _0x410940['length'];
    const _0x2b5577 = _0x445cc8['ui']?.['connectionLinesVisible'] !== ![];
    const _0x167bc2 = shouldDeferDenseStructuralEdgeRender({
      'renderMode': _0x396a68,
      'nodeStructureChanged': _0x8c04f4,
      'edgesRevChanged': _0x389b9b,
      'nodeCount': _0xe10ebe,
      'edgeCount': _0x1db837,
      'connectionLinesVisible': _0x2b5577
    });
    const _0x1635d4 = _0x167bc2 || _0x30c085;
    if (_0x167bc2) {
      _0x30c085 = !![];
    } else {
      _0x30c085 && (_0x30c085 = ![]);
    }
    const {
      hasPendingStructuralOps: _0x3aa050,
      deferredParkCount = 0x0,
      hasPendingVisibleVideoMounts = ![],
      hasPendingFullEligibleVisibleImageMounts = ![]
    } = _0x3a940c ? {
      'hasPendingStructuralOps': ![],
      'deferredParkCount': 0x0,
      'hasPendingVisibleVideoMounts': ![],
      'hasPendingFullEligibleVisibleImageMounts': ![]
    } : _renderNodes(_0x55c9c2, _0x445cc8['nodes'], _0x445cc8['selectedNodeIds'], _0x2aa067["relatedNodeIds"], _0xe6d6a4, _0x445cc8["connOverlay"], _0x445cc8['pickConnectMode'], _0x445cc8["viewport"], _0x445cc8["edges"], _0x445cc8["_parentToChildren"], _0x445cc8['ui'] && typeof _0x445cc8['ui']['showVideoMeta'] === 'boolean' ? _0x445cc8['ui']["showVideoMeta"] : ![], _0x445cc8, {
      'mode': _0x396a68,
      'deferHeavyMediaMount': _0x142013,
      'deferParking': _0x355839 > 0x0,
      'fullImageSettleReady': _lastViewportJumpAt <= 0x0 || _nowMs() - _lastViewportJumpAt >= FULL_ELIGIBLE_VISIBLE_IMAGE_SETTLED_BUDGET_DELAY_MS,
      'deferInitialRasterPlanning': _0x167bc2,
      'framePlan': _0x31a491
    });
    const _0x5210b1 = document['documentElement'];
    const _0xaf6dce = _0x1db837 >= MANY_EDGES_THRESHOLD;
    if (_0xaf6dce) {
      !_0x5210b1["classList"]["contains"]('has-many-edges') && _0x5210b1["classList"]["add"]("has-many-edges");
    } else {
      _0x5210b1['classList']["contains"]("has-many-edges") && _0x5210b1['classList']["remove"]('has-many-edges');
    }
    const _0x57825a = getInteractionRenderState();
    const _0x35239f = _resolveDragRenderOffset(_0x445cc8, _0x57825a);
    const _0x3d603d = normalizeConnectionLineStyle(_0x445cc8['ui']?.["connectionLineStyle"]);
    let _0xd7389e = null;
    let _0x10ffa1 = '';
    let _0x482a3d = null;
    function _0x441927() {
      if (!_0xaf6dce) {
        return '';
      }
      !_0x10ffa1 && (_0x10ffa1 = getCachedEdgeGeometrySignature(_0x410940, _0x445cc8['nodes'], {
        'edgesRev': _0x52f076,
        'geometryRev': _0x4be6f7
      }));
      return _0x10ffa1;
    }
    function _0x3def62() {
      if (!_0x2b5577 || !_0xaf6dce) {
        return null;
      }
      !_0x482a3d && (_0x482a3d = getCachedEdgeVisibilityIndex(_0x410940, _0x445cc8['nodes'], {
        'edgesRev': _0x52f076,
        'geometryRev': _0x4be6f7,
        'geometrySignature': _0x441927()
      }));
      return _0x482a3d;
    }
    function _0x41f70b(_0x1316c5 = ![]) {
      !_0xd7389e && (_0xd7389e = _getEdgeContainerSize(_0x380445));
      const _0x3ceea3 = buildFullEdgeRenderSignature({
        'edgeEntries': _0x410940,
        'nodes': _0x445cc8["nodes"],
        'viewport': _0x445cc8['viewport'],
        'dragOffsetCtx': _0x35239f,
        'relatedEdgeIds': _0x2aa067["relatedEdgeIds"],
        'containerW': _0xd7389e['containerW'],
        'containerH': _0xd7389e["containerH"],
        'edgesRev': _0x52f076,
        'geometryRev': _0x4be6f7,
        'geometrySignature': _0x441927(),
        'edgePathStyle': _0x3d603d
      });
      if (!_0x1316c5 && _0x3ceea3 === _lastFullEdgeRenderSignature) {
        return null;
      }
      return {
        'containerSize': _0xd7389e,
        'renderSignature': _0x3ceea3,
        'geometryRevisionKey': "edges:" + _0x52f076 + "|nodes:" + _0x4be6f7,
        'pathStyle': _0x3d603d
      };
    }
    if (_0x1635d4) {
      _invalidateFullEdgeRenderSignature();
      shouldPrepareDenseStructuralEdgeFollowup({
        'deferDenseStructuralFrame': _0x167bc2,
        'deferDenseStructuralEdgeRender': _0x1635d4,
        'connectionLinesVisible': _0x2b5577,
        'isManyEdges': _0xaf6dce
      }) && _0x3def62();
    } else {
      if (!_0x2b5577) {
        _clearRenderedEdges(_0x22411a);
      } else {
        if (_0x389b9b) {
          if (_0x389b9b) {
            _ensureEdgeIndex(_0x445cc8["edges"], _0x52f076);
          }
          const _0x10eea6 = _0x41f70b(!![]);
          _renderEdges(_0x22411a, _0x4a63d1, _0x445cc8["nodes"], _0x445cc8['viewport'], _0x380445, _0x35239f, _0x2aa067["relatedEdgeIds"], _0x410940, "edges-rev-changed", {
            ..._0x10eea6,
            'edgeVisibilityIndex': _0x3def62()
          });
        } else {
          if (_0x57825a["isDragging"]) {
            _ensureEdgeIndex(_0x445cc8["edges"], _0x52f076);
            const _0x4bb563 = _0x35239f?.["movedNodeIds"] || _collectMovedNodeIds(_0x445cc8, _0x57825a);
            const _0x101d15 = new Set();
            for (const _0x7f51d3 of _0x4bb563) {
              const _0x20d740 = _nodeToEdgeIds["get"](_0x7f51d3);
              if (!_0x20d740) {
                continue;
              }
              for (const _0x47531d of _0x20d740) {
                _0x101d15["add"](_0x47531d);
              }
            }
            if (_0x101d15["size"] > 0x0) {
              _renderEdgesByIds(_0x22411a, _0x101d15, _0x4a63d1, _0x445cc8["nodes"], _0x445cc8["viewport"], _0x380445, _0x35239f, _0x2aa067['relatedEdgeIds'], {
                'containerSize': _0xd7389e || null,
                'pathStyle': _0x3d603d
              });
            } else {
              if (!_0x4bb563 || _0x4bb563["size"] === 0x0) {
                const _0x4d73a3 = _0x41f70b(![]);
                _0x4d73a3 && _renderEdges(_0x22411a, _0x4a63d1, _0x445cc8["nodes"], _0x445cc8["viewport"], _0x380445, _0x35239f, _0x2aa067['relatedEdgeIds'], _0x410940, "drag-related-edges-unavailable", {
                  ..._0x4d73a3,
                  'edgeVisibilityIndex': _0x3def62()
                });
              }
            }
          } else {
            const _0x4c1edd = _0x41f70b(![]);
            _0x4c1edd && _renderEdges(_0x22411a, _0x4a63d1, _0x445cc8["nodes"], _0x445cc8["viewport"], _0x380445, _0x35239f, _0x2aa067["relatedEdgeIds"], _0x410940, "steady", {
              ..._0x4c1edd,
              'edgeVisibilityIndex': _0x3def62()
            });
          }
        }
      }
    }
    _renderPicker(_0x577aa0, _0x445cc8["picker"], _0x35f72b);
    _renderSelectionRect(_0x55592e, _0x445cc8["selectionBox"]);
    _selectionOverlay["render"](_0x445cc8);
    a619_0x506dd4(_0x314ada, _0x445cc8["pickConnectMode"]);
    if (_0x1635d4) {
      const _0x5a9980 = shouldUseDenseStructuralEdgeOnlyFollowup({
        'deferDenseStructuralFrame': _0x167bc2,
        'deferDenseStructuralEdgeRender': _0x1635d4,
        'hasPendingStructuralOps': _0x3aa050
      });
      _0x11e1f8 = _0x5a9980 ? _0x445cc8 : null;
      _0x367e32(0x0, {
        'bypassInteractionGrace': !![],
        'edgeOnlySnapshot': _0x5a9980 ? _0x445cc8 : null
      });
    } else {
      if (_0x3aa050) {
        const _0x136b0a = resolveRendererLowZoomMountLimit({
          'viewport': _0x445cc8["viewport"],
          'nodeCount': _0xe10ebe
        }) > 0x0;
        _0x367e32(Math["min"](getRendererStructuralReconcileDelayMs(_0xe10ebe), hasPendingVisibleVideoMounts ? VISIBLE_VIDEO_STRUCTURAL_RECONCILE_DELAY_MS : hasPendingFullEligibleVisibleImageMounts ? FULL_ELIGIBLE_VISIBLE_IMAGE_RECONCILE_DELAY_MS : _0x136b0a ? 0x168 : 0x60), {
          'bypassInteractionGrace': hasPendingFullEligibleVisibleImageMounts === !![]
        });
      } else {
        _0x355839 > 0x0 && _0x367e32(_0x355839 + 0x10);
      }
    }
    _0x5198a2["rememberRenderedSnapshot"](_0x445cc8);
  }
  function _0x7bbf0(_0x210db7, {
    skipNodesForDenseEdgeFollowup = ![]
  } = {}) {
    if (!_0x210db7 || !_0xdedb25["isActive"]()) {
      return;
    }
    const _0x1b49fc = isPerfProbeEnabled();
    const _0x57ca11 = _0x1b49fc && typeof performance !== "undefined" && typeof performance["now"] === "function" ? performance["now"]() : 0x0;
    let _0x4518c6 = "steady";
    try {
      const _0x29de60 = getInteractionRenderState();
      const _0x255647 = getViewportPanPreview();
      const _0x1240c6 = readViewportInteractionState({
        'interactionState': _0x29de60
      });
      const _0x340af5 = _0x255647 && !_0x1240c6['isViewportBusy'] ? readViewportInteractionState({
        'interactionState': _0x29de60,
        'panPreviewActive': !![]
      }) : _0x1240c6;
      const _0x3b9f77 = typeof _0x210db7['_nodeCount'] === 'number' ? _0x210db7["_nodeCount"] : Object["keys"](_0x210db7["nodes"] || {})["length"];
      const _0x2370d7 = _0x4dd7f2(_0x210db7, _0x3b9f77);
      const _0x232fa4 = typeof _0x210db7["_edgesRev"] === "number" ? _0x210db7['_edgesRev'] : 0x0;
      const _0x31f439 = (_0x29de60["isDragging"] || _0x29de60["isDraggingCell"]) && _0x29de60["isCommittingDrag"] !== !![];
      const _0x15c5d8 = _0x3b9f77 !== _0x5ae228 || _0x2370d7 !== _0x2027dc;
      const _0x3a5574 = _0x31f439 && (_0x15c5d8 || _0x232fa4 !== _0x361f1c);
      const _0x7adb69 = !_0x340af5["isViewportBusy"] && _viewportJumpDetector["consume"](_0x210db7["viewport"]);
      (_0x340af5["isViewportBusy"] || _0x31f439 || _0x7adb69) && _rendererMediaRuntimePreparer["pause"]();
      const _0x41d63f = _rendererInteractionGrace["getRemainingMs"]();
      const _0x2a0c6d = _0x340af5["isViewportBusy"] ? _0x255647 || _0x210db7["viewport"] : _0x210db7["viewport"];
      let _0x5f2094 = null;
      const _0x216015 = () => {
        _0x5f2094 ||= createRendererFramePlan({
          'snapshot': _0x210db7,
          'viewport': _0x2a0c6d,
          'containerRect': _getCachedContainerSize(_containerSizeSourceEl),
          'nodeCount': _0x3b9f77
        });
        return _0x5f2094;
      };
      const _0x4b1100 = _0x340af5["isViewportBusy"] !== !![] && _0x7adb69 !== !![] && shouldPauseViewportMediaForInteractionGrace({
        'remainingMs': _0x41d63f,
        'viewport': _0x210db7["viewport"],
        'nodeCount': _0x3b9f77,
        'hasPriorityMediaWork': ![]
      });
      const _0x498f55 = _0x4b1100 ? _0x216015()['hasPriorityMediaWork']() : ![];
      const _0x21fcf6 = _0x340af5["isViewportBusy"] || _0x7adb69 || shouldPauseViewportMediaForInteractionGrace({
        'remainingMs': _0x41d63f,
        'viewport': _0x210db7["viewport"],
        'nodeCount': _0x3b9f77,
        'hasPriorityMediaWork': _0x498f55
      });
      syncRendererViewportMediaPreloadPause(_0x21fcf6);
      cancelQueuedViewportInteractionPreloads(_0x21fcf6);
      const _0x8f35d2 = shouldHydratePriorityMediaDuringViewportInteraction({
        'interactionActive': _0x340af5["isViewportAnimating"] || _0x340af5["isPanning"] || _0x340af5["isZooming"],
        'hasPriorityMediaWork': _0x498f55
      });
      const _0x1b298f = resolveViewportInteractionReconcileDelay({
        'hasPriorityMediaWork': _0x498f55
      });
      a619_0x5d8c17(_0x55c9c2, _0x2a0c6d, _0x210db7['ui']?.["titleFollowsCanvasZoom"] === !![]);
      if (_0x340af5["isViewportAnimating"]) {
        _rendererInteractionGrace["markBusy"]();
        _0x4518c6 = _0x8f35d2 ? 'viewport-animating-priority-media' : 'viewport-animating';
        if (_0xa94483["style"]["display"] === "none") {
          _0xa94483["style"]["display"] = '';
        }
        _0x8f35d2 && _0x550e6d(_0x210db7, _0x2a0c6d, _0x4518c6, _0x216015());
        _0x367e32(_0x1b298f);
        return;
      }
      if (_0x340af5["isPanning"]) {
        _rendererInteractionGrace["markBusy"]();
        _0x4518c6 = "panning";
        const _0x3d6051 = performance["now"]();
        _0x3d6051 - _0x2c7051 > 0x50 && (_0x2c7051 = _0x3d6051, _renderCullingOnly(_0x55c9c2, _0x210db7['nodes'], _0x2a0c6d));
        if (_0xa94483["style"]["display"] === 'none') {
          _0xa94483["style"]["display"] = '';
        }
        _0x367e32(_0x1b298f);
        return;
      }
      if (_0x31f439 && !_0x3a5574) {
        _rendererInteractionGrace["markBusy"]();
        _0x4518c6 = "dragging";
        if (_0xa94483["style"]["display"] === "none") {
          _0xa94483["style"]["display"] = '';
        }
        _0x367e32();
        return;
      }
      if (_0x340af5["isZooming"]) {
        _rendererInteractionGrace["markBusy"]();
        _0x4518c6 = _0x8f35d2 ? "zooming-priority-media" : "zooming";
        if (_0xa94483["style"]['display'] === 'none') {
          _0xa94483['style']["display"] = '';
        }
        _0x8f35d2 && _0x550e6d(_0x210db7, _0x2a0c6d, _0x4518c6, _0x216015());
        _0x367e32(_0x1b298f);
        return;
      }
      if (consumeRendererNodeDragCommitHint() && !_0x15c5d8 && _0x232fa4 === _0x361f1c) {
        _0x4518c6 = "drag-commit-deferred";
        _rendererInteractionGrace["markBusy"]();
        if (_0xa94483["style"]["display"] === "none") {
          _0xa94483["style"]["display"] = '';
        }
        _0x367e32(RENDERER_VIRTUALIZATION_CONFIG['dragCommitReconcileDelayMs']);
        return;
      }
      if (_0x3a5574) {
        _rendererInteractionGrace["markBusy"]();
        _0x4518c6 = "dragging-structural";
      } else {
        _0x7adb69 ? (_rendererInteractionGrace["markBusy"](), _0x4518c6 = "viewport-jump", _lastViewportJumpAt = _nowMs(), _0x22b723()) : (_0x22b723(), _rendererInteractionGrace["markIdle"]());
      }
      if (_0xa94483["style"]["display"] === 'none') {
        _0xa94483['style']["display"] = '';
      }
      _0x56266e(_0x210db7, skipNodesForDenseEdgeFollowup ? "dense-edge-followup" : _0x4518c6, skipNodesForDenseEdgeFollowup ? null : _0x216015(), {
        'skipNodes': skipNodesForDenseEdgeFollowup
      });
      !_0x3a5574 && (_mediaPresentation["resume"](), _rendererMediaRuntimePreparer["resume"]());
    } finally {
      if (_0x1b49fc && typeof performance !== 'undefined' && typeof performance["now"] === "function") {
        const _0x5f4709 = typeof _0x210db7['_nodeCount'] === "number" ? _0x210db7['_nodeCount'] : Object["keys"](_0x210db7["nodes"] || {})["length"];
        recordRenderFrameSample({
          'mode': _0x4518c6,
          'durationMs': performance["now"]() - _0x57ca11,
          'nodeCount': _0x5f4709,
          'edgeCount': Object["keys"](_0x210db7["edges"] || {})['length'],
          'mountedNodeCount': _mountedNodeIds['size'],
          'parkedNodeCount': _parkedNodeIds["size"],
          ..._fastPreviewLayer['getStats']()
        });
      }
    }
  }
  function _0x5ca637(_0xdd1d4d) {
    if (!_0xdd1d4d || !_0xdedb25["isActive"]()) {
      return ![];
    }
    const _0x310975 = _currentSnapshot;
    const _0x4d04a0 = _0x310975?.["nodes"]?.[_0xdd1d4d];
    if (!_0x4d04a0) {
      return ![];
    }
    const _0x1c25da = _componentMap["get"](_0xdd1d4d);
    const _0x1f2bc0 = _wrapperMap['get'](_0xdd1d4d);
    if (!_0x1c25da || typeof _0x1c25da['update'] !== 'function') {
      return ![];
    }
    if (!_mountedNodeIds["has"](_0xdd1d4d) || !_0x1f2bc0?.["isConnected"]) {
      return ![];
    }
    const _0x2546d2 = new Set(_0x310975["selectedNodeIds"] || []);
    const _0x570ab7 = _0x2546d2["has"](_0xdd1d4d);
    const _0x37ae1e = _buildSelectionRelatedSets(_0x2546d2, _0x310975['edges'] || {})["relatedNodeIds"];
    const _0x31d355 = !_0x570ab7 && _0x37ae1e["has"](_0xdd1d4d);
    const _0x171e67 = _getIncomingEdgeSignature(_0xdd1d4d, _0x310975["edges"] || {}, _0x310975['nodes'] || {});
    const _0x3cfcad = syncNodeMediaLodMode(_0x1f2bc0, _0x4d04a0, _0x310975["viewport"]);
    const _0x2ce7c5 = buildRendererNodeSignature({
      'node': _0x4d04a0,
      'inEdgeSig': _0x171e67,
      'pickMode': _0x310975['pickConnectMode'],
      'isSelected': _0x570ab7,
      'isSelectionRelated': _0x31d355,
      'showVideoMeta': _0x310975['ui']?.["showVideoMeta"] === !![],
      'viewport': _0x310975["viewport"],
      'mediaLodMode': _0x3cfcad
    });
    _pendingNodeDataMap["delete"](_0xdd1d4d);
    _nodeDataSnapshotMap["set"](_0xdd1d4d, _0x2ce7c5);
    _0x1c25da['update'](_0x4d04a0);
    return !![];
  }
  function _0x514e69(_0x36a202) {
    const _0x25d061 = Array["isArray"](_0x36a202) ? _0x36a202 : [_0x36a202];
    let _0x1450de = ![];
    for (const _0x121f12 of new Set(_0x25d061["filter"](Boolean))) {
      _0x1450de = _0x5ca637(_0x121f12) || _0x1450de;
    }
    return _0x1450de;
  }
  function _0x5f5c7a(_0x32ced0, _0x52c6de = {}) {
    if (!_0xdedb25['isActive']()) {
      return ![];
    }
    if (_0x52c6de?.["settleInteraction"] === !![]) {
      const _0xd487f9 = _currentSnapshot;
      if (_0xd487f9 && _0xd487f9['ui']?.["connectionLinesVisible"] !== ![]) {
        const _0x123339 = _0xd487f9['ui']?.["selectionRelatedHighlightEnabled"] === ![] ? {
          'relatedEdgeIds': new Set()
        } : _buildSelectionRelatedSets(_0xd487f9["selectedNodeIds"] || [], _0xd487f9["edges"] || {});
        const _0x7047c8 = _edgeLayer["settleDynamicEdges"]({
          'svgEl': _0x22411a,
          'edges': _0xd487f9["edges"] || {},
          'nodes': _0xd487f9["nodes"] || {},
          'viewport': _0xd487f9["viewport"],
          'containerEl': _0x380445,
          'relatedEdgeIds': _0x123339["relatedEdgeIds"],
          'options': {
            'pathStyle': _0xd487f9['ui']?.['connectionLineStyle']
          }
        });
        if (_0x7047c8["mutated"]) {
          _invalidateFullEdgeRenderSignature();
        }
      }
      return _0x5b06b6(_0x32ced0);
    }
    if (_0x5198a2["flushSelectionOnlySnapshot"](_currentSnapshot, {
      'allowPendingRaf': !![],
      'cancelPendingRaf': !![]
    })) {
      return !![];
    }
    return _0x5b06b6(_0x32ced0);
  }
  function _0x5b06b6(_0x20e4b1, _0x29bea1 = {}) {
    if (!_0x20e4b1) {
      return ![];
    }
    const _0x509320 = _currentSnapshot;
    const _0x34ab54 = _0x509320?.["nodes"] || {};
    if (!_0x509320 || !_0x34ab54) {
      return ![];
    }
    const _0x215201 = Array["isArray"](_0x20e4b1) ? _0x20e4b1 : [_0x20e4b1];
    const _0x4fece7 = Array['isArray'](_0x509320["selectedNodeIds"]) ? _0x509320['selectedNodeIds'] : [];
    const _0x141fb7 = new Set(_0x4fece7);
    const _0x1c3d62 = buildSelectedNodeRankMap(_0x4fece7);
    const _0x1acd2b = _0x509320["edges"] || {};
    const _0x55aeb0 = typeof _0x509320['_edgesRev'] === "number" ? _0x509320["_edgesRev"] : 0x0;
    _ensureEdgeIndex(_0x1acd2b, _0x55aeb0);
    const _0x3575a6 = _0x509320['ui']?.['selectionRelatedHighlightEnabled'] === ![] ? {
      'relatedNodeIds': new Set()
    } : _buildSelectionRelatedSets(_0x141fb7, _0x1acd2b);
    const _0x3f349e = _0x3575a6["relatedNodeIds"] || new Set();
    const _0x3f0f27 = _normalizeSelectionRelatedHighlightColor(_0x509320['ui']?.["selectionRelatedHighlightColor"]);
    const _0x548a58 = _0x509320['viewport'] || {
      'x': 0x0,
      'y': 0x0,
      'zoom': 0x1
    };
    const {
      width: _0x56174f,
      height: _0x331dfb
    } = _getCachedContainerSize(_0x55c9c2["parentElement"] || _0x55c9c2);
    const _0xac69b = getInteractionRenderState();
    const _0x2f5b59 = buildRendererDragTargetSet({
      'dragContext': _0xac69b,
      'selectedNodeSet': _0x141fb7,
      'parentToChildren': _0x509320['_parentToChildren'] || {}
    });
    const _0x3f931e = _0x509320['ui'] && typeof _0x509320['ui']["showVideoMeta"] === "boolean" ? _0x509320['ui']["showVideoMeta"] : ![];
    let _0x369a66 = ![];
    for (const _0x177554 of new Set(_0x215201['filter'](Boolean))) {
      const _0x3802d1 = _0x34ab54[_0x177554];
      const _0x93e6e2 = _wrapperMap['get'](_0x177554);
      if (!_0x3802d1 || !_mountedNodeIds["has"](_0x177554) || !_0x93e6e2?.["isConnected"]) {
        continue;
      }
      const _0x3176d5 = _0x141fb7["has"](_0x177554);
      const _0x44c293 = !_0x3176d5 && _0x3f349e["has"](_0x177554);
      const _0x1f6d27 = _getIncomingEdgeSignature(_0x177554, _0x1acd2b, _0x34ab54);
      const _0x352cbd = syncNodeMediaLodMode(_0x93e6e2, _0x3802d1, _0x548a58);
      const _0x59bdb8 = buildRendererNodeSignature({
        'node': _0x3802d1,
        'inEdgeSig': _0x1f6d27,
        'pickMode': _0x509320["pickConnectMode"],
        'isSelected': _0x3176d5,
        'isSelectionRelated': _0x44c293,
        'showVideoMeta': _0x3f931e,
        'viewport': _0x548a58,
        'mediaLodMode': _0x352cbd
      });
      _syncMountedNodePresentation({
        'wrapperEl': _0x93e6e2,
        'node': _0x3802d1,
        'nodeId': _0x177554,
        'selectedNodeSet': _0x141fb7,
        'selectedNodeRankMap': _0x1c3d62,
        'connOverlay': _0x509320["connOverlay"],
        'pickMode': _0x509320["pickConnectMode"],
        'viewport': _0x548a58,
        'containerW': _0x56174f,
        'containerH': _0x331dfb,
        'dragContext': _0xac69b,
        'dragTargets': _0x2f5b59,
        'showVideoMeta': _0x3f931e,
        'relatedNodeIds': _0x3f349e,
        'relatedHighlightColor': _0x3f0f27,
        'inEdgeSig': _0x1f6d27,
        'signature': _0x59bdb8,
        'mediaLodMode': _0x352cbd,
        'skipInstanceUpdate': _0x29bea1?.["skipInstanceUpdate"] !== ![]
      });
      if (shouldHydrateVideoMediaImmediately({
        'node': _0x3802d1,
        'nodeId': _0x177554,
        'isSelected': _0x3176d5,
        'isSelectionRelated': _0x44c293,
        'dragTargets': _0x2f5b59,
        'connOverlay': _0x509320["connOverlay"],
        'pickMode': _0x509320['pickConnectMode']
      })) {
        if (_componentMap['get'](_0x177554)?.["_rendererMediaDeferred"] === !![]) {
          _videoHydrationBackpressure["markPriorityWork"]();
        }
        _rendererDeferredMedia["hydrateNow"](_0x177554);
      }
      _0x369a66 = !![];
    }
    return _0x369a66;
  }
  typeof window !== "undefined" && (window["v2Renderer"] = window["v2Renderer"] || {}, Object["assign"](window["v2Renderer"], {
    'flushNode': _0x5ca637,
    'flushNodes': _0x514e69,
    'flushSelection': _0x5f5c7a
  }));
  _0xdedb25['connect'](_0x35f72b);
  const _0x1daa46 = () => {
    _0xdedb25["dispose"]();
    _0x5198a2["reset"]();
    _resetSelectionFastPath === _0x176880 && (_resetSelectionFastPath = null);
    _0x22b723();
    _0x2b6d75["dispose"]();
    _rendererMediaRuntimePreparer["clear"]();
    _schedulePreparedMediaRuntimeCommit === _0xa572a3 && (_schedulePreparedMediaRuntimeCommit = null);
    _fastPreviewContinuation["reset"]();
    _containerResizeObserver && (_containerResizeObserver["disconnect"](), _containerResizeObserver = null);
    _containerResizeHandler = null;
    _containerSizeSourceEl = null;
    _mediaPresentation["clear"]();
    _sourceVideoSourceKeySnapshotMap["clear"]();
    _pendingSourceVideoActivationIds['clear']();
    _sourceVideoActivationRev = null;
    _sourceVideoActivationNodesRef = null;
    _nodeTimerController['clear']();
    _currentSnapshot = null;
    clearRendererViewportMediaPreloadPause();
    _0xa94483?.["remove"]?.();
    _0x577aa0?.['remove']?.();
    _0x314ada?.["remove"]?.();
    _selectionOverlay["unmount"]();
    _0x55592e?.["remove"]?.();
  };
  _0x1daa46["setPresentationActive"] = _0xdedb25["setActive"];
  return _0x1daa46;
}
function _buildGroupOutputOrderSignature(_0x3a14c0, _0x3ca65c) {
  const _0x3ad6a2 = [];
  const _0x5e985c = Array["isArray"](_0x3a14c0?.["groupOutputSourceOrder"]) ? _0x3a14c0["groupOutputSourceOrder"]["map"](_0x5d39a0 => String(_0x5d39a0 || '')["trim"]())["join"]('>') : '';
  if (_0x5e985c) {
    _0x3ad6a2['push']("global:" + _0x5e985c);
  }
  const _0x17a774 = String(_0x3ca65c || '')["trim"]();
  const _0xfee5e4 = _0x3a14c0?.['groupOutputSourceOrderByTarget'];
  const _0x144b5a = _0x17a774 && _0xfee5e4 && typeof _0xfee5e4 === 'object' && !Array['isArray'](_0xfee5e4) && Array["isArray"](_0xfee5e4[_0x17a774]) ? _0xfee5e4[_0x17a774]["map"](_0x498150 => String(_0x498150 || '')['trim']())['join']('>') : '';
  if (_0x144b5a) {
    _0x3ad6a2["push"]("target:" + _0x144b5a);
  }
  return _0x3ad6a2["join"]('|');
}
function _getIncomingEdgeSignature(_0x41fa36, _0xbf5de8, _0x182213) {
  const _0x1df0ac = [];
  const _0x395d7c = String(_0x182213?.[_0x41fa36]?.["parentId"] || '')['trim']();
  const _0x437805 = [["direct", _0x41fa36]];
  if (_0x395d7c && isNodeType(_0x182213?.[_0x395d7c], "group")) {
    _0x437805["push"](['shared:' + _0x395d7c, _0x395d7c]);
  }
  for (const [_0x50ed8d, _0xbf9c93] of _0x437805) {
    for (const _0x4208aa of _incomingEdgeIdsByTarget['get'](_0xbf9c93) || []) {
      const _0x8024c = _0xbf5de8?.[_0x4208aa];
      if (!_0x8024c || _0x8024c["targetId"] !== _0xbf9c93) {
        continue;
      }
      const _0x288951 = _0x182213?.[_0x8024c["sourceId"]];
      const _0x32c620 = typeof _0x288951?.["_bizRev"] === "number" ? _0x288951["_bizRev"] : 0x0;
      const _0x3be1ff = String(_0x8024c["refSlot"] || '');
      const _0x5f3d4c = _buildGroupOutputOrderSignature(_0x8024c, _0x41fa36);
      _0x1df0ac["push"](_0x50ed8d + ':' + _0x8024c['id'] + ':' + _0x8024c["sourceId"] + ':' + _0x3be1ff + ':' + _0x32c620 + ':' + buildGroupOutputMembershipSignature(_0x288951, _0x182213) + ':' + _0x5f3d4c);
    }
  }
  return _0x1df0ac["join"](',');
}
function _registerNodeRuntime(_0x16d9df) {
  if (!_0x16d9df?.['nodeId'] || !_0x16d9df["wrapperEl"] || !_0x16d9df["instance"]) {
    return null;
  }
  const _0x47bac9 = document["getElementById"](_0x16d9df["nodeId"]);
  _0x47bac9 && _0x47bac9 !== _0x16d9df['wrapperEl'] && !_wrapperMap["has"](_0x16d9df["nodeId"]) && _0x47bac9["remove"]();
  _componentMap["set"](_0x16d9df['nodeId'], _0x16d9df["instance"]);
  _wrapperMap["set"](_0x16d9df["nodeId"], _0x16d9df["wrapperEl"]);
  _nodeTypeSnapshotMap["set"](_0x16d9df["nodeId"], _0x16d9df["canonicalType"]);
  return _0x16d9df;
}
function _createNodeRuntime(_0x2df6f8, _0x1f18c6, _0x2e6873, _0x7cd220, _0x475774, _0x2e1038 = {}) {
  return _registerNodeRuntime(prepareRendererNodeRuntime({
    'node': _0x2df6f8,
    'selectedNodeSet': _0x1f18c6,
    'selectedNodeRankMap': _0x2e6873,
    'dragContext': _0x7cd220,
    'dragTargets': _0x475774,
    'options': _0x2e1038
  }));
}
function _ensureVideoMetaEl(_0x561464, _0x4f9e1d) {
  if (!_0x561464["__v2_video_meta_el"]) {
    const _0x5970c8 = document["createElement"]("div");
    _0x5970c8["className"] = "node-video-meta";
    _0x5970c8['dataset']["nodeId"] = _0x4f9e1d;
    _0x5970c8["dataset"]["visible"] = '0';
    _0x5970c8['textContent'] = '';
    _0x561464["appendChild"](_0x5970c8);
    _0x561464['__v2_video_meta_el'] = _0x5970c8;
  }
}
function _buildNodePresentationStableKey({
  node: _0x505258,
  nodeId: _0x45e95d,
  signature: _0x1ff8e,
  visible: _0x2613f5,
  isSelected: _0x485eb3,
  isSelectionRelated: _0x285d38,
  relatedHighlightColor: _0x1944fb,
  connOverlay: _0x192cd1,
  pickMode: _0x3f3413,
  showVideoMeta: _0x5352fc,
  focused: _0x20c364
} = {}) {
  const _0x3d91c9 = _0x192cd1?.["srcId"] === _0x45e95d ? '1' : '0';
  const _0x3f07d9 = _0x192cd1?.["hoverId"] === _0x45e95d ? '1' : '0';
  const _0x4f5548 = _0x192cd1?.['invalidNodeIds']?.["includes"]?.(_0x45e95d) ? '1' : '0';
  const _0x277e7 = _0x3f3413?.["active"] && _0x3f3413['sourceNodeId'] === _0x45e95d ? '1' : '0';
  const _0x1842a5 = _0x3f3413?.["active"] && _0x3f3413['hoverNodeId'] === _0x45e95d ? '1' : '0';
  const _0x137246 = _0x5352fc && isNodeType(_0x505258, ['source-video', "ai-video"]) ? [_0x505258?.["videoFps"] || '', _0x505258?.['videoFrameCount'] || '', _0x505258?.["videoWidth"] || '', _0x505258?.["videoHeight"] || '']["join"](',') : '';
  return [_0x1ff8e || '', _0x2613f5 ? '1' : '0', _0x485eb3 ? '1' : '0', _0x285d38 ? '1' : '0', _0x1944fb || '', _0x3d91c9, _0x3f07d9, _0x4f5548, String(_0x192cd1?.["side"] || ''), _0x277e7, _0x1842a5, String(_0x3f3413?.["handleDirection"] || ''), _0x5352fc ? '1' : '0', _0x137246, _0x505258?.["generationStartTime"] || '', _0x505258?.['generationDuration'] ?? '', resolveGenerationUiState(_0x505258), _0x20c364 ? '1' : '0']["join"]('|');
}
function _syncMountedNodePresentation({
  wrapperEl: _0x5dfd84,
  node: _0x31f349,
  nodeId: _0x30bbfe,
  selectedNodeSet: _0x44b9a1,
  selectedNodeRankMap: _0x4e12d3,
  connOverlay: _0x5af6f0,
  pickMode: _0x6e3f9,
  viewport: _0x709872,
  containerW: _0x4ad418,
  containerH: _0x3cb64f,
  dragContext: _0x4adfa7,
  dragTargets: _0x58f3a6,
  showVideoMeta: _0x308aa5,
  relatedNodeIds: _0x5a0e46,
  relatedHighlightColor: _0x4034fb,
  inEdgeSig: _0x12ae62,
  signature: _0x5a2344,
  mediaLodMode = null,
  skipInstanceUpdate = ![],
  deferInstanceUpdate = ![],
  mountedThisFrame = ![],
  lifecycleStats = null,
  allowActiveDetailHydration = !![]
}) {
  let _0x51857a = ![];
  let _0xac0b81 = ![];
  const _0x46ff04 = _0x31f349['x'] + ',' + _0x31f349['y'] + ',' + _0x31f349["width"] + ',' + _0x31f349["height"];
  const _0x118456 = _0x5dfd84["_posKey"] !== _0x46ff04;
  const _0x48c8c8 = _0x4adfa7?.["isDragging"] && _0x58f3a6 && _0x58f3a6["has"](_0x30bbfe);
  const _0x468ab1 = _0x48c8c8 ? Number["isFinite"](_0x4adfa7["pendingDx"]) ? _0x4adfa7["pendingDx"] : 0x0 : 0x0;
  const _0x57fd4a = _0x48c8c8 ? Number['isFinite'](_0x4adfa7["pendingDy"]) ? _0x4adfa7["pendingDy"] : 0x0 : 0x0;
  const _0x570e01 = _isNodeVisible(_0x31f349, _0x709872, _0x4ad418, _0x3cb64f, _0x468ab1, _0x57fd4a);
  const _0x3a3c65 = _componentMap["get"](_0x30bbfe);
  mediaLodMode === null && syncNodeMediaLodMode(_0x5dfd84, _0x31f349, _0x709872);
  _0x118456 && (_0x5dfd84["_posKey"] = _0x46ff04, _0x5dfd84['style']["width"] = _0x31f349['width'] + 'px', _0x5dfd84["style"]["height"] = _0x31f349['height'] + 'px');
  syncRendererNodeDragTransform(_0x5dfd84, _0x31f349, {
    'active': _0x48c8c8,
    'offsetX': _0x468ab1,
    'offsetY': _0x57fd4a,
    'positionChanged': _0x118456
  });
  isNodeType(_0x31f349, ["source-video", 'ai-video']) && _ensureVideoMetaEl(_0x5dfd84, _0x30bbfe);
  const _0x192cb9 = _0x4adfa7["isDragging"] === !![] && _0x58f3a6?.["has"]?.(_0x30bbfe) === !![];
  _0x192cb9 ? _0x5dfd84["classList"]['add']("is-dragging") : _0x5dfd84['classList']["remove"]("is-dragging");
  _0x192cb9 && (_0x4adfa7["hasMoved"] || !_0x4adfa7["wasSelectedOnDown"]) ? _0x5dfd84["classList"]['add']("is-ui-hidden") : _0x5dfd84['classList']["remove"]("is-ui-hidden");
  const _0x2eb2bd = _0x44b9a1["has"](_0x30bbfe);
  const _0x7c9a4b = !_0x2eb2bd && _0x5a0e46?.['has'](_0x30bbfe);
  if (!_0x570e01) {
    _0x3a3c65 && typeof _0x3a3c65["syncSelectionState"] === "function" && _0x3a3c65["syncSelectionState"]({
      'selected': ![],
      'singleSelected': ![],
      'visible': ![]
    });
    _nodeTimerController['hideNode'](_0x30bbfe);
    _0x5dfd84["style"]['display'] !== 'none' && (_0x5dfd84['style']["display"] = 'none');
    if (_0x3a3c65?.['update'] && !skipInstanceUpdate && _0x5a2344 !== _nodeDataSnapshotMap["get"](_0x30bbfe)) {
      const _0x2990b1 = shouldKeepHiddenHeavyMediaUpdatePending({
        'node': _0x31f349,
        'nodeId': _0x30bbfe,
        'isSelected': _0x2eb2bd,
        'dragTargets': _0x58f3a6
      });
      if (deferInstanceUpdate || _0x2990b1) {
        _pendingNodeDataMap["set"](_0x30bbfe, {
          'node': _0x31f349,
          'signature': _0x5a2344
        });
        recordRendererLifecycleSkippedUpdate(lifecycleStats);
      } else {
        _nodeDataSnapshotMap["set"](_0x30bbfe, _0x5a2344);
        const _0xaf634 = lifecycleStats ? _nowMs() : 0x0;
        _0x3a3c65["update"](_0x31f349);
        _0xac0b81 = !![];
        lifecycleStats && recordRendererLifecycleDuration(lifecycleStats, "update", _0x31f349, _nowMs() - _0xaf634, 'hidden');
      }
    } else {
      _0x3a3c65?.["update"] && skipInstanceUpdate && _0x5a2344 !== _nodeDataSnapshotMap['get'](_0x30bbfe) && recordRendererLifecycleSkippedUpdate(lifecycleStats);
    }
    return {
      'deferredUpdate': _0x51857a,
      'didUpdate': _0xac0b81
    };
  }
  _0x5dfd84["style"]['display'] === "none" && (_0x5dfd84["style"]["display"] = '');
  const _0x519fb5 = typeof document !== "undefined" && !!document['activeElement'] && _0x5dfd84["contains"](document["activeElement"]);
  const _0x551352 = _buildNodePresentationStableKey({
    'node': _0x31f349,
    'nodeId': _0x30bbfe,
    'signature': _0x5a2344,
    'visible': _0x570e01,
    'isSelected': _0x2eb2bd,
    'isSelectionRelated': _0x7c9a4b,
    'relatedHighlightColor': _0x4034fb,
    'connOverlay': _0x5af6f0,
    'pickMode': _0x6e3f9,
    'showVideoMeta': _0x308aa5,
    'focused': _0x519fb5
  });
  if (!mountedThisFrame && !_0x48c8c8 && _0x5dfd84["dataset"]?.["detailStage"] !== "deferred" && _nodeDataSnapshotMap["get"](_0x30bbfe) === _0x5a2344 && _0x5dfd84['_presentationStableKey'] === _0x551352) {
    return {
      'deferredUpdate': ![],
      'didUpdate': ![]
    };
  }
  _0x5dfd84['_presentationStableKey'] = _0x551352;
  syncNodeMediaMetricsDataset(_0x5dfd84, _0x31f349);
  const _0x5432ef = shouldForceDeferActiveNodeDetails({
    'nodeId': _0x30bbfe,
    'dragContext': _0x4adfa7,
    'dragTargets': _0x58f3a6
  });
  const _0x54670c = _0x5dfd84["classList"]['contains']("selected");
  _0x2eb2bd !== _0x54670c && (_0x2eb2bd ? _0x5dfd84["classList"]["add"]("selected", "v2-selected") : (_0x5dfd84["classList"]["remove"]('selected', "v2-selected"), _0x5dfd84["style"]['outline'] = ''));
  if (_0x7c9a4b) {
    _0x5dfd84["classList"]["add"]("selection-related");
    const _0x2dd984 = 'selection-related-color-' + _normalizeSelectionRelatedHighlightColor(_0x4034fb);
    for (const _0x53b8bd of SELECTION_RELATED_HIGHLIGHT_COLORS) {
      const _0x1b379a = "selection-related-color-" + _0x53b8bd;
      if (_0x1b379a !== _0x2dd984) {
        _0x5dfd84["classList"]["remove"](_0x1b379a);
      }
    }
    _0x5dfd84["classList"]["add"](_0x2dd984);
  } else {
    _0x5dfd84['classList']["remove"]("selection-related");
    for (const _0x5d1fb9 of SELECTION_RELATED_HIGHLIGHT_COLORS) {
      _0x5dfd84["classList"]["remove"]("selection-related-color-" + _0x5d1fb9);
    }
  }
  if (allowActiveDetailHydration !== ![] && !_0x5432ef && _nodeDetailHydration["isNodeDetailActive"]({
    'node': _0x31f349,
    'nodeId': _0x30bbfe,
    'isSelected': _0x2eb2bd,
    'connOverlay': _0x5af6f0,
    'pickMode': _0x6e3f9,
    'relatedNodeIds': _0x5a0e46
  })) {
    if (isNodeType(_0x31f349, ["source-video", 'ai-video', "video"]) && _0x5dfd84?.['dataset']?.["detailStage"] === "deferred") {
      _videoHydrationBackpressure["markPriorityWork"]();
    }
    _nodeDetailHydration["hydrateNodeDetails"](_0x30bbfe, _0x5dfd84);
  }
  _0x3a3c65 && typeof _0x3a3c65['syncSelectionState'] === "function" && _0x3a3c65['syncSelectionState']({
    'selected': _0x2eb2bd,
    'singleSelected': _0x44b9a1["size"] === 0x1,
    'visible': !![]
  });
  const _0x245dde = getRendererNodeZIndex(_0x31f349, _0x2eb2bd, _0x4e12d3?.["get"]?.(_0x30bbfe) ?? -0x1, {
    'isFocused': _0x519fb5
  });
  syncRendererNodePresentationZIndex(_0x5dfd84, _0x245dde);
  if (isNodeType(_0x31f349, "group")) {
    const _0x49005d = _0x31f349['color'] || "var(--indigo)";
    const _0x1cc851 = a619_0x581997(_0x49005d, '60');
    const _0x1f14e8 = a619_0x581997(_0x49005d, '05');
    _0x5dfd84["style"]["borderColor"] !== _0x1cc851 && (_0x5dfd84["style"]["borderColor"] = _0x1cc851);
    _0x5dfd84["style"]['backgroundColor'] !== _0x1f14e8 && (_0x5dfd84["style"]["backgroundColor"] = _0x1f14e8);
    _0x5dfd84['style']['getPropertyValue']('--current-group-color') !== _0x49005d && _0x5dfd84["style"]["setProperty"]('--current-group-color', _0x49005d);
  }
  const _0xced64c = _0x5dfd84["__v2_name_el"];
  const _0x46f9ed = normalizeNodeType(_0x31f349["type"]);
  const _0x241734 = _0xced64c ? a619_0x268685(_0x46f9ed) : '';
  if (_0xced64c) {
    if (_0x241734) {
      if (_0xced64c['dataset']["labelKind"] !== _0x241734) {
        _0xced64c["dataset"]["labelKind"] = _0x241734;
      }
    } else {
      "labelKind" in _0xced64c["dataset"] && delete _0xced64c['dataset']["labelKind"];
    }
  }
  if (_0xced64c && _0xced64c["contentEditable"] !== "true") {
    const _0x34e49e = getRendererDefaultNodeLabel(_0x31f349);
    const _0x32bda7 = hasNodeTypeBetaBadge(_0x46f9ed);
    const _0x3e8c21 = _0x31f349['name'] || _0x34e49e;
    const _0x448621 = a619_0xb0d6b2(_0x3e8c21);
    _0xced64c["dataset"]["fullName"] = _0x3e8c21;
    _0xced64c["dataset"]["isBeta"] = _0x32bda7 ? '1' : '0';
    a619_0x1f77f2(_0xced64c);
    const _0x25cffd = _0xced64c["querySelector"](".node-label-icon");
    const _0x3a7ef6 = _0xced64c["querySelector"](".node-label-text");
    const _0x599f0d = _0x448621 || _0x34e49e;
    const _0x13e2a6 = _0x25cffd?.["dataset"]["labelKind"] || '';
    (_0x13e2a6 !== _0x241734 || _0x3a7ef6?.["textContent"] !== _0x599f0d || (_0x32bda7 ? _0xced64c["dataset"]['betaLabel'] !== _0x3e8c21 : "betaLabel" in _0xced64c["dataset"])) && a619_0x3216d8(_0xced64c, {
      'labelKind': _0x241734,
      'displayLabelText': _0x448621,
      'defaultName': _0x34e49e,
      'isBeta': _0x32bda7,
      'fullLabelText': _0x3e8c21
    });
  }
  _nodeTimerController["renderNode"](_0x30bbfe, _0x31f349, {
    'selected': _0x2eb2bd
  });
  const _0x570aa6 = _0x5dfd84["__v2_video_meta_el"];
  if (_0x570aa6) {
    if (!_0x308aa5) {
      if (_0x570aa6["dataset"]["visible"] !== '0') {
        _0x570aa6["dataset"]["visible"] = '0';
      }
    } else {
      const _0x1eea1b = Number(_0x31f349['videoFps']);
      const _0x5d29c7 = Number(_0x31f349["videoFrameCount"]);
      const _0x21922b = Number(_0x31f349["videoWidth"]);
      const _0x4e4b43 = Number(_0x31f349["videoHeight"]);
      const _0x3fc5eb = Number["isFinite"](_0x1eea1b) && _0x1eea1b > 0x0 && Number["isFinite"](_0x5d29c7) && _0x5d29c7 > 0x0;
      const _0x3a67d7 = _0x3fc5eb ? '1' : '0';
      _0x570aa6["dataset"]["visible"] !== _0x3a67d7 && (_0x570aa6['dataset']["visible"] = _0x3a67d7);
      if (!_0x3fc5eb && typeof _0x3a3c65?.["requestVideoMetaForNodeInfo"] === "function") {
        void _0x3a3c65["requestVideoMetaForNodeInfo"](_0x31f349);
      }
      if (_0x3fc5eb) {
        const _0x3634e5 = formatVideoMetaText({
          'fps': _0x1eea1b,
          'frames': _0x5d29c7,
          'width': _0x21922b,
          'height': _0x4e4b43
        });
        _0x570aa6["textContent"] !== _0x3634e5 && (_0x570aa6["textContent"] = _0x3634e5);
      }
    }
  }
  if (_0x3a3c65?.["update"] && _0x5a2344 !== _nodeDataSnapshotMap["get"](_0x30bbfe)) {
    if (skipInstanceUpdate) {
      _nodeDataSnapshotMap['set'](_0x30bbfe, _0x5a2344);
    } else {
      deferInstanceUpdate ? (_0x51857a = !![], recordRendererLifecycleSkippedUpdate(lifecycleStats)) : _nodeDataSnapshotMap["set"](_0x30bbfe, _0x5a2344);
    }
    if (!skipInstanceUpdate && !deferInstanceUpdate) {
      const _0x3626a4 = lifecycleStats ? _nowMs() : 0x0;
      _0x3a3c65['update'](_0x31f349);
      _0xac0b81 = !![];
      if (lifecycleStats) {
        const _0x5ae6cd = _0x3a3c65?.["_lastUpdatePerfBreakdown"] || null;
        recordRendererLifecycleDuration(lifecycleStats, "update", _0x31f349, _nowMs() - _0x3626a4, "visible", {
          'breakdown': _0x5ae6cd
        });
      }
    } else {
      skipInstanceUpdate && recordRendererLifecycleSkippedUpdate(lifecycleStats);
    }
  }
  const _0x98f71 = _0x6e3f9 && _0x6e3f9["active"] && _0x30bbfe === _0x6e3f9["sourceNodeId"];
  const _0x2c8b44 = isNodeType(_0x31f349, "storyboard") && _0x31f349["isEditing"];
  if (_0x5af6f0 && _0x5af6f0["srcId"] || _0x98f71 || _0x2c8b44) {
    if (_0x30bbfe === _0x5af6f0?.["srcId"] || _0x98f71 || _0x2c8b44) {
      _0x5dfd84["classList"]["add"]("conn-src");
      _0x5dfd84["classList"]["remove"]("conn-invalid");
    } else {
      _0x5af6f0?.["invalidNodeIds"]?.['includes'](_0x30bbfe) ? (_0x5dfd84["classList"]["add"]("conn-invalid"), _0x5dfd84["classList"]['remove']("conn-src")) : _0x5dfd84['classList']["remove"]("conn-invalid", "conn-src");
    }
  } else {
    _0x5dfd84['classList']['remove']("conn-invalid", 'conn-src');
  }
  _0x5dfd84["classList"]["toggle"]("is-source-highlighted", Boolean(_0x98f71 || _0x2c8b44));
  const _0x2133c1 = _0x6e3f9 && _0x6e3f9["active"] && _0x6e3f9['hoverNodeId'] === _0x30bbfe;
  if (_0x5af6f0 && _0x5af6f0["hoverId"] === _0x30bbfe || _0x2133c1) {
    if (!_0x5dfd84['classList']["contains"]("conn-hoverTarget")) {
      _0x5dfd84["classList"]["add"]("conn-hoverTarget");
      const _0x29a610 = window["getComputedStyle"](_0x5dfd84)["borderRadius"];
      let _0x2c352b = parseFloat(_0x29a610);
      if (isNaN(_0x2c352b) || _0x2c352b <= 0x0) {
        _0x2c352b = 0x10;
      }
      _0x5dfd84["style"]["setProperty"]("--hover-br", _0x2c352b + 0x4 + 'px');
    }
    let _0x3c1273 = ![];
    if (_0x5af6f0 && _0x5af6f0["side"] === "left") {
      _0x3c1273 = !![];
    } else {
      _0x2133c1 && _0x6e3f9 && _0x6e3f9["handleDirection"] === "left" && (_0x3c1273 = !![]);
    }
    _0x3c1273 ? (_0x5dfd84["classList"]["add"]('conn-hover-output'), _0x5dfd84["classList"]["remove"]('conn-hover-input')) : (_0x5dfd84["classList"]['add']("conn-hover-input"), _0x5dfd84["classList"]['remove']("conn-hover-output"));
  } else {
    _0x5dfd84["classList"]["contains"]("conn-hoverTarget") && (_0x5dfd84["classList"]['remove']("conn-hoverTarget", "conn-hover-input", "conn-hover-output"), _0x5dfd84["style"]["removeProperty"]("--hover-br"));
  }
  syncNodeResultClass(_0x5dfd84, _0x31f349, isNodeType);
  return {
    'deferredUpdate': _0x51857a,
    'didUpdate': _0xac0b81
  };
}
function _renderNodesImpl(_0x3ac1be, _0x264a8a, _0x471ff2, _0x12ac37, _0x4ddf76, _0x355ed3, _0x48c533, _0x2182e0, _0x33bb1e, _0x455c59, _0x49191c, _0x1f624a = null, _0xa0db88 = {}) {
  const _0x4c48e4 = _0x48c533;
  const _0x13ba2e = _0x2182e0 || {
    'x': 0x0,
    'y': 0x0,
    'zoom': 0x1
  };
  const _0x5f13f9 = _0x33bb1e || {};
  const _0x15af78 = _0x455c59 || {};
  const _0x56f922 = _0x49191c !== ![];
  const _0x34bc94 = _0xa0db88?.["deferParking"] === !![];
  const _0x40ff3b = getInteractionRenderState();
  const _0xea554e = _0x471ff2 instanceof Set ? _0x471ff2 : new Set(_0x471ff2 || []);
  const _0x275508 = buildSelectedNodeRankMap(_0x471ff2);
  const _0x4f22f4 = buildRendererDragTargetSet({
    'dragContext': _0x40ff3b,
    'selectedNodeSet': _0xea554e,
    'parentToChildren': _0x15af78
  });
  const _0x2cdbf9 = _rendererRuntimeDiagnosticsEnabled ? _nowMs() : 0x0;
  const _0x9a032a = _0xa0db88?.["framePlan"] || null;
  const {
    width: _0x3e7a91,
    height: _0x429083
  } = _0x9a032a?.["containerRect"] || _getCachedContainerSize(_0x3ac1be["parentElement"] || _0x3ac1be);
  const _0x16c98a = Number["isFinite"](_0x9a032a?.["nodeCount"]) ? _0x9a032a["nodeCount"] : Number["isFinite"](_0x1f624a?.["_nodeCount"]) ? _0x1f624a["_nodeCount"] : Object["keys"](_0x264a8a || {})["length"];
  const _0x597cc2 = Number['isFinite'](_0x1f624a?.["_nodesRev"]) ? _0x1f624a["_nodesRev"] : Number["isFinite"](_0x1f624a?.["_persistRev"]) ? _0x1f624a['_persistRev'] : _0x16c98a;
  const _0x3e4145 = Number["isFinite"](_0x1f624a?.["_sourceVideoRev"]) ? _0x1f624a["_sourceVideoRev"] : Number["isFinite"](_0x1f624a?.["_persistRev"]) ? _0x1f624a["_persistRev"] : null;
  const _0x3807cb = _0xa0db88?.["deferInitialRasterPlanning"] === !![];
  const _0x232271 = _getPinnedNodeIds();
  const _0xae7d8a = _0x9a032a || createRendererFramePlan({
    'snapshot': _0x1f624a,
    'nodes': _0x264a8a,
    'viewport': _0x13ba2e,
    'containerRect': {
      'width': _0x3e7a91,
      'height': _0x429083
    },
    'nodeCount': _0x16c98a
  });
  const _0x1e87cb = _0xae7d8a["getSpatialIndex"]();
  const _0x14510e = buildRendererVirtualizationSignature({
    'snapshotRev': _0x597cc2,
    'nodeCount': _0x16c98a,
    'viewport': _0x13ba2e,
    'selectedNodeIds': _0x471ff2,
    'connOverlay': _0x355ed3,
    'pickConnectMode': _0x4c48e4,
    'dragContext': _0x40ff3b,
    'pinnedNodeIds': _0x232271,
    'containerW': _0x3e7a91,
    'containerH': _0x429083
  });
  let _0x5a3a61 = _lastVirtualCandidateResult;
  const _0x52e818 = _0x14510e === _lastVirtualCandidateSignature && !!_0x5a3a61;
  !_0x52e818 && (_0x5a3a61 = buildVirtualizationCandidateSets({
    'nodes': _0x264a8a,
    'spatialIndex': _0x1e87cb,
    'viewport': _0x13ba2e,
    'containerWidth': _0x3e7a91,
    'containerHeight': _0x429083,
    'selectedNodeIds': _0x471ff2,
    'connOverlay': _0x355ed3,
    'pickConnectMode': _0x4c48e4,
    'dragContext': _0x40ff3b,
    'parentToChildren': _0x15af78,
    'pinnedNodeIds': _0x232271,
    'mountedNodeIds': _mountedNodeIds
  }), _lastVirtualCandidateSignature = _0x14510e, _lastVirtualCandidateResult = _0x5a3a61);
  _0x5a3a61 = ensureRendererExactVisiblePreviewCandidates({
    'virtualizationResult': _0x5a3a61,
    'nodes': _0x264a8a,
    'spatialIndex': _0x1e87cb,
    'viewport': _0x13ba2e,
    'containerWidth': _0x3e7a91,
    'containerHeight': _0x429083,
    'nodeCount': _0x16c98a
  });
  const _0x38fe0b = _0x3e4145 === null || _sourceVideoActivationNodesRef !== _0x264a8a || _sourceVideoActivationRev !== _0x3e4145;
  !_0x3807cb && (syncRendererPendingSourceVideoActivationIds({
    'nodes': _0x264a8a,
    'sourceKeysByNodeId': _sourceVideoSourceKeySnapshotMap,
    'pendingNodeIds': _pendingSourceVideoActivationIds,
    'scanNodes': _0x38fe0b,
    'isPresented': (_0xaaa86c, _0x39c5fa) => {
      const _0x33f2c3 = _sourceVideoSlotLifecycle["read"](_0xaaa86c);
      return _0x33f2c3['surface'] === "media" && _0x33f2c3['sourceKey'] === _0x39c5fa;
    }
  }), _0x38fe0b && (_sourceVideoActivationRev = _0x3e4145, _sourceVideoActivationNodesRef = _0x264a8a));
  const _0x9407e7 = resolveRendererLowZoomRealVideoNodeIds({
    'nodes': _0x264a8a,
    'candidateNodeIds': _0x5a3a61["previewCandidateIds"],
    'selectedNodeIds': _0x471ff2,
    'priorityNodeIds': _pendingSourceVideoActivationIds,
    'viewport': _0x13ba2e,
    'nodeCount': _0x16c98a,
    'containerWidth': _0x3e7a91,
    'containerHeight': _0x429083
  });
  _0x5a3a61 = applyRendererLowZoomRealVideoCandidates(_0x5a3a61, _0x9407e7);
  const _0x4d1b32 = _0x3807cb ? new Set() : collectFullEligibleVisibleImageNodeIds({
    'nodes': _0x264a8a,
    'candidateNodeIds': _0x5a3a61["previewCandidateIds"],
    'viewport': _0x13ba2e,
    'isVisible': _0xa2fc25 => isNodeInsideViewportPadding(_0xa2fc25, _0x13ba2e, _0x3e7a91, _0x429083, 0x0),
    'getPreviousMode': _0x3d147e => String(_wrapperMap["get"](_0x3d147e)?.["dataset"]?.["mediaLodMode"] || '')["trim"](),
    'interactionBusy': _0xa0db88?.['viewportBusy'] === !![] || _0xa0db88?.['previewOnly'] === !![] || _rendererInteractionGrace["isBusy"]()
  });
  _0x5a3a61 = applyRendererFullEligibleImageCandidates(_0x5a3a61, _0x4d1b32);
  const _0x29e718 = _0xae7d8a["buildScenePlan"]({
    'mountCandidateIds': _0x5a3a61["mountCandidateIds"],
    'previewCandidateIds': _0x5a3a61["previewCandidateIds"],
    'parkCandidateIds': _0x5a3a61["parkCandidateIds"],
    'selectedNodeIds': _0xea554e,
    'activeNodeIds': _0x4f22f4,
    'keepAliveNodeIds': _0x5a3a61["keepAliveNodeIds"],
    'mountedNodeIds': _mountedNodeIds,
    'fullEligibleVisibleImageNodeIds': _0x4d1b32,
    'includeParkIds': ![],
    'deferInitialPlanning': _0xa0db88?.["deferInitialRasterPlanning"] === !![]
  });
  const _0x4c29c7 = _0x14510e + '|scene:' + _0x29e718["surfaceSignature"];
  const {
    plannedFullEligibleVisibleImageNodeIds: _0x5e1289
  } = _0x29e718;
  _0x5a3a61 = {
    ..._0x5a3a61,
    'mountCandidateIds': _0x29e718["fullSurfaceIds"],
    'previewCandidateIds': _0x29e718["presentationSurfaceIds"],
    'parkCandidateIds': _0x29e718["fullSurfaceReleaseIds"],
    'scenePlan': _0x29e718
  };
  _notifyVirtualizationProbe({
    'signature': _0x14510e,
    'cacheHit': _0x52e818,
    'snapshotRev': _0x597cc2,
    'containerW': _0x3e7a91,
    'containerH': _0x429083,
    'spatialIndex': !!_0x1e87cb,
    'nodeCount': _0x16c98a,
    'mountCandidateCount': _0x5a3a61['mountCandidateIds']?.['size'] || 0x0,
    'previewCandidateCount': _0x5a3a61['previewCandidateIds']?.['size'] || 0x0,
    'parkCandidateCount': _0x5a3a61['parkCandidateIds']?.["size"] || 0x0,
    'keepAliveCount': _0x5a3a61["keepAliveNodeIds"]?.['size'] || 0x0,
    'scenePressure': _0x29e718["pressure"],
    'sceneFullSurfaceBudget': _0x29e718["fullSurfaceBudget"],
    'sceneFullSurfaceCount': _0x29e718["fullSurfaceIds"]["size"],
    'sceneProxySurfaceCount': _0x29e718["proxySurfaceIds"]["size"]
  });
  _rendererRuntimeDiagnosticsEnabled && recordRendererRuntimeDiagnostic({
    'kind': 'renderer-virtualization',
    'mode': _0xa0db88?.["mode"] || "steady",
    'cacheHit': _0x52e818,
    'nodeCount': _0x16c98a,
    'mountCandidateCount': _0x5a3a61['mountCandidateIds']?.["size"] || 0x0,
    'previewCandidateCount': _0x5a3a61["previewCandidateIds"]?.['size'] || 0x0,
    'parkCandidateCount': _0x5a3a61["parkCandidateIds"]?.['size'] || 0x0,
    'fullEligibleVisibleImageCount': _0x4d1b32["size"],
    'plannedFullEligibleVisibleImageCount': _0x5e1289['size'],
    'scenePressure': _0x29e718['pressure'],
    'sceneFullSurfaceBudget': _0x29e718["fullSurfaceBudget"],
    'sceneFullSurfaceCount': _0x29e718["fullSurfaceIds"]["size"],
    'sceneProxySurfaceCount': _0x29e718["proxySurfaceIds"]["size"],
    'fullImageSettleReady': _0xa0db88?.["fullImageSettleReady"] === !![],
    'durationMs': _nowMs() - _0x2cdbf9,
    'viewport': {
      ..._0x13ba2e
    }
  });
  const {
    mountCandidateIds: _0x1d9f1b
  } = _0x5a3a61;
  let {
    parkCandidateIds: _0x39af65
  } = _0x5a3a61;
  _0xa0db88?.["viewportPriorityMediaOnly"] !== !![] && _rendererMediaRuntimePreparer["prune"](_0x1d9f1b);
  const _0x5e6f22 = _0x5a3a61["previewCandidateIds"] || _0x1d9f1b;
  const _0x2ebdd2 = _0x3807cb ? new Set() : collectFullEligibleVisibleImageNodeIds({
    'nodes': _0x264a8a,
    'candidateNodeIds': _0x5e6f22,
    'viewport': _0x13ba2e,
    'isVisible': () => !![],
    'getPreviousMode': _0x127ae6 => String(_wrapperMap['get'](_0x127ae6)?.["dataset"]?.["mediaLodMode"] || '')['trim'](),
    'interactionBusy': _0xa0db88?.["viewportBusy"] === !![] || _0xa0db88?.["previewOnly"] === !![] || _rendererInteractionGrace["isBusy"]()
  });
  const _0x39c012 = _0xa0db88?.["viewportBusy"] === !![] || _0xa0db88?.["deferParking"] === !![] || _0xa0db88?.["deferHeavyMediaMount"] === !![] || _rendererInteractionGrace["isBusy"]();
  const _0x3c2fd0 = _0x39c012 || _0xa0db88?.["previewOnly"] === !![];
  const _0x31c630 = _0x39c012 && resolveRendererLowZoomMountLimit({
    'viewport': _0x13ba2e,
    'nodeCount': _0x16c98a
  }) <= 0x0;
  const _0x38c987 = _rasterPreviewCoordinator["sync"]({
    'canvasEl': _0x3ac1be,
    'nodes': _0x264a8a,
    'scenePlan': _0x29e718,
    'selectedNodeIds': _0xea554e,
    'dragNodeIds': _0x4f22f4,
    'connOverlay': _0x355ed3,
    'pickConnectMode': _0x4c48e4,
    'viewport': _0x13ba2e,
    'viewportBusy': _0x39c012,
    'containerWidth': _0x3e7a91,
    'containerHeight': _0x429083,
    'mediaLoadingBusy': _0x3c2fd0,
    'freezeRasterSurface': _0x39c012,
    'lockRasterParticipation': _0xa0db88?.["lockRasterParticipation"] === !![],
    'deferInitialPlanning': _0xa0db88?.["deferInitialRasterPlanning"] === !![],
    'releaseFullSurface'(_0x16bce6) {
      const _0x47e2c1 = _wrapperMap['get'](_0x16bce6);
      if (!_0x47e2c1?.['style'] || _0x47e2c1['classList']?.['contains']?.('is-dragging')) {
        return;
      }
      _0x47e2c1['style']["display"] = "none";
      _nodeTimerController['hideNode'](_0x16bce6);
    }
  });
  const _0x424476 = _0xa0db88?.["suspendNewMediaSrc"] === !![] || _0x38c987["freezeActive"] === !![] && _0x3c2fd0;
  _0x39af65 = _0x38c987["releasableFullSurfaceIds"];
  const {
    domPreviewCandidateIds: _0x42f101,
    domPreviewMediaSourceOwnerIds: _0x50ef9a
  } = _0x38c987;
  const _0x13f210 = [..._0x29e718["exactVisibleGenerationBusyIds"]]["filter"](_0x162b6a => !_0x29e718['fullSurfaceIds']['has'](_0x162b6a) || !_mountedNodeIds["has"](_0x162b6a));
  const _0x20fdd9 = new Set([..._0x50ef9a, ..._0x13f210]);
  isPerfProbeEnabled() && (_0x3ac1be["__aicanvasPerfRasterCoordinatorStats"] = {
    'claimedRasterNodeIds': [..._0x38c987['rasterIds']],
    'domPreviewCandidateNodeIds': [..._0x42f101],
    'domPreviewMediaSourceOwnerNodeIds': [..._0x50ef9a],
    'freezeActive': _0x38c987["freezeActive"] === !![],
    'viewportBusyForPreview': _0x39c012,
    'viewportBusyOption': _0xa0db88?.["viewportBusy"] === !![],
    'deferParkingOption': _0xa0db88?.["deferParking"] === !![],
    'deferHeavyMediaMountOption': _0xa0db88?.["deferHeavyMediaMount"] === !![],
    'interactionGraceBusy': _rendererInteractionGrace["isBusy"](),
    'policy': {
      ...(_0x38c987["policy"]?.["stats"] || {})
    }
  });
  const _0x69b7fe = _0x4c29c7 + "|raster:" + _0x38c987["signature"];
  const _0x410573 = _0x29e718["exactVisibleGenerationBusyIds"]['size'] > 0x0 ? new Set([..._0x42f101, ..._0x29e718["exactVisibleGenerationBusyIds"]]) : _0x42f101;
  cancelStaleLowPriorityPreloadsForHighZoom(_0x31c630);
  if (_0xa0db88?.["previewOnly"] === !![]) {
    _fastPreviewContinuation["reset"]();
    const _0x52ac2e = _0x29e718["exactVisibleIds"]["size"];
    let _0x52626c = 0x0;
    if (_0x52ac2e > RENDERER_VIEWPORT_PREVIEW_COVERAGE_CONFIG["maxDirectVisibleNodeCount"] && _0x52ac2e <= RENDERER_VIEWPORT_PREVIEW_COVERAGE_CONFIG["maxRasterAssistedVisibleNodeCount"]) {
      for (const _0x4d600d of _0x29e718["exactVisibleIds"]) {
        _0x38c987["rasterIds"]["has"](_0x4d600d) && (_0x52626c += 0x1);
      }
    }
    const _0x227830 = shouldPrepareRendererViewportPreviewCoverage({
      'viewport': _0x13ba2e,
      'nodeCount': _0x16c98a,
      'visibleNodeCount': _0x52ac2e,
      'rasterVisibleNodeCount': _0x52626c
    });
    const _0x261e2f = _0x227830 && _0x52ac2e > RENDERER_VIEWPORT_PREVIEW_COVERAGE_CONFIG['maxDirectVisibleNodeCount'];
    _fastPreviewLayer['sync'](_0x3ac1be, _0x264a8a, _0x410573, _0xea554e, {
      'connOverlay': _0x355ed3,
      'pickConnectMode': _0x4c48e4,
      'nodeCount': _0x16c98a,
      'viewport': _0x13ba2e,
      'containerWidth': _0x3e7a91,
      'containerHeight': _0x429083,
      'freezeRasterSurface': _0x38c987["freezeActive"] === !![],
      'previewOnly': !![],
      'deferVisibleMediaSrc': _0xa0db88?.['deferInitialRasterPlanning'] === !![],
      'suppressNewMedia': _0x31c630,
      'mediaSourceOwnerIds': _0x50ef9a,
      'requiredImmediateMediaSourceOwnerIds': _0x20fdd9,
      'requiredImmediateCreateLimit': _0x261e2f ? RENDERER_VIEWPORT_PREVIEW_COVERAGE_CONFIG["rasterAssistedImmediateCreateLimit"] : undefined,
      'viewportBusy': _0x39c012,
      'dragContext': _0x40ff3b,
      'dragTargets': _0x4f22f4,
      'suspendNewMediaSrc': _0x424476,
      'fullEligibleVisibleImageNodeIds': _0x4d1b32,
      'fullEligiblePreviewImageNodeIds': _0x2ebdd2
    });
    let _0x12ad15 = null;
    let _0x8fb089 = ![];
    let _0x202fe0 = 0x0;
    let _0x262127 = [];
    if (_0x227830) {
      const _0x5462da = new Set();
      for (const _0x2a9c7f of _0x29e718['presentationSurfaceIds']) {
        const _0x1c9039 = _wrapperMap["get"](_0x2a9c7f);
        const _0x499c18 = _mountedNodeIds["has"](_0x2a9c7f) && _0x1c9039 && _0x1c9039["isConnected"] !== ![] && _0x1c9039["style"]?.["display"] !== "none";
        (_0x499c18 || _0x38c987['rasterIds']["has"](_0x2a9c7f) || _fastPreviewLayer["hasNodePreview"](_0x2a9c7f)) && _0x5462da["add"](_0x2a9c7f);
      }
      _0x262127 = [..._0x29e718["exactVisibleIds"]]["filter"](_0x3445d4 => !_0x5462da["has"](_0x3445d4));
      _0x8fb089 = _0x262127["length"] === 0x0;
      _0x202fe0 = _0x5462da['size'];
      _0x12ad15 = createRendererViewportPreviewCoverage({
        'viewport': _0x13ba2e,
        'containerWidth': _0x3e7a91,
        'containerHeight': _0x429083,
        'padding': _0x29e718['padding']['preview'],
        'nodeCount': _0x16c98a,
        'snapshot': _0x1f624a,
        'spatialIndex': _0x1e87cb,
        'presentedNodeIds': _0x5462da,
        'ready': _0x8fb089
      });
    }
    isPerfProbeEnabled() && (_0x3ac1be['__aicanvasPerfViewportPreviewCoverageStats'] = {
      'exactVisibleNodeCount': _0x52ac2e,
      'rasterVisibleNodeCount': _0x52626c,
      'previewCoverageEligible': _0x227830,
      'previewCoverageReady': _0x8fb089,
      'previewCoverageCreated': _0x12ad15 !== null,
      'presentedNodeCount': _0x202fe0,
      'missingExactVisibleNodeCount': _0x262127["length"],
      'missingExactVisibleNodeTypes': _0x262127["reduce"]((_0x3996b2, _0x2f75f0) => {
        const _0x32b57c = String(_0x264a8a?.[_0x2f75f0]?.["type"] || "unknown");
        _0x3996b2[_0x32b57c] = Number(_0x3996b2[_0x32b57c] || 0x0) + 0x1;
        return _0x3996b2;
      }, {})
    });
    return {
      'hasPendingStructuralOps': ![],
      'deferredParkCount': 0x0,
      'hasPendingVisibleVideoMounts': ![],
      'hasPendingFullEligibleVisibleImageMounts': ![],
      'previewCoverage': _0x12ad15
    };
  }
  const _0x5e62a1 = prioritizeFullEligibleVisibleImageNodes(collectVirtualizedRenderNodes({
    'nodes': _0x264a8a,
    'virtualizationResult': _0x5a3a61,
    'spatialIndex': _0x1e87cb,
    'mountedNodeIds': _mountedNodeIds,
    'viewport': _0x13ba2e,
    'containerWidth': _0x3e7a91,
    'containerHeight': _0x429083
  }), _0x4d1b32);
  const _0x20036b = Array['from'](_0x5e1289)["filter"](_0x38ec33 => !_mountedNodeIds['has'](_0x38ec33))['length'];
  const _0x25a6b6 = isPerfProbeEnabled() ? createRendererNodeLifecycleStats({
    'mode': _0xa0db88?.["mode"] || "steady",
    'nodeCount': _0x16c98a,
    'renderNodeCount': _0x5e62a1["length"],
    'mountCandidateCount': _0x1d9f1b["size"],
    'parkCandidateCount': _0x39af65["size"],
    'viewportBusy': _0x39c012
  }) : null;
  const _0x23ca27 = createRendererStructuralBudget(getRendererStructuralBudgetOptions({
    'viewportBusy': _0x39c012,
    'cacheHit': _0x52e818,
    'dragContext': _0x40ff3b,
    'fullEligibleVisibleImageCount': _0x5e1289["size"],
    'fullImageSettleReady': _0xa0db88?.["fullImageSettleReady"] === !![],
    'nodeCount': _0x16c98a,
    'pendingFullEligibleVisibleImageCount': _0x20036b,
    'renderMode': _0xa0db88?.["mode"] || "steady",
    'viewport': _0x13ba2e
  }));
  const _0x185028 = createRendererStructuralBudget({
    'batchSize': RENDERER_FULL_SURFACE_RELEASE_BATCH_SIZE,
    'frameBudgetMs': RENDERER_FULL_SURFACE_RELEASE_FRAME_BUDGET_MS
  });
  let _0x49d9fa = ![];
  let _0x5e8f45 = 0x0;
  let _0x555853 = null;
  const _0x52dec4 = createHeavyMediaUpdateFrameBudget({
    'nodeCount': _0x16c98a,
    'now': _nowMs
  });
  let _0x38ab3c = ![];
  let _0x1fd293 = ![];
  let _0x553cd1 = ![];
  let _0x2d22fd = ![];
  let _0x30fc17 = ![];
  const _0x12de28 = _0x16c98a >= RENDERER_VIRTUALIZATION_CONFIG['veryDenseNodeCount'];
  const _0x4d26dd = createHeavyMediaPreviewOnlyDecider({
    'viewport': _0x13ba2e,
    'nodeCount': _0x16c98a,
    'lowZoomRealVideoNodeIds': _0x9407e7,
    'fullEligibleVisibleImageNodeIds': _0x5e1289
  });
  const _0x2a5d7b = createRendererVisibleAudioSurfaceHydrationPass({
    'viewport': _0x13ba2e,
    'nodeCount': _0x16c98a,
    'deferredMedia': _rendererDeferredMedia
  });
  for (const _0x443b18 of _0x5e62a1) {
    if (!_0x443b18?.['id']) {
      continue;
    }
    const _0x507fe0 = _0x443b18['id'];
    let _0x3d55be = _wrapperMap["get"](_0x507fe0);
    let _0x482b30 = _componentMap["get"](_0x507fe0);
    let _0x27f2f2 = ![];
    const _0x9fc64a = normalizeNodeType(_0x443b18["type"]);
    const _0x2d8210 = isNodeType(_0x443b18, "source-video");
    _0x2d8210 && _sourceVideoSlotLifecycle['syncViewportVisibility'](_0x507fe0, {
      'isSelected': _0xea554e["has"](_0x507fe0),
      'isPreviewCandidate': _0x5e6f22['has'](_0x507fe0),
      'isVisible': _isNodeVisible(_0x443b18, _0x13ba2e, _0x3e7a91, _0x429083)
    });
    const _0x33cbcb = _nodeTypeSnapshotMap["get"](_0x507fe0);
    _0x3d55be && _0x482b30 && _0x33cbcb && _0x33cbcb !== _0x9fc64a && (_destroyNode(_0x507fe0), _0x3d55be = null, _0x482b30 = null);
    const _0x2d4bc5 = _mountedNodeIds["has"](_0x507fe0) && !!_0x3d55be?.['isConnected'];
    const _0x5227a7 = _sourceVideoSlotLifecycle["shouldRetainPresentedSurface"](_0x507fe0);
    const _0x307bba = _0x5227a7 || _0x1d9f1b["has"](_0x507fe0) || _0x2d4bc5 && !_0x39af65["has"](_0x507fe0);
    let _0x1d1a88 = ![];
    let _0x5410e0 = ![];
    if (!_0x307bba) {
      if (_0x3d55be && _0x482b30) {
        const _0x4e433e = _pendingNodeDataMap["get"](_0x507fe0);
        (!_0x4e433e || _0x4e433e['node'] !== _0x443b18) && _pendingNodeDataMap["set"](_0x507fe0, {
          'node': _0x443b18,
          'signature': null
        });
      }
      if (_0x2d4bc5 && _0x39af65["has"](_0x507fe0)) {
        if (_0x34bc94) {
          _0x5e8f45 += 0x1;
          continue;
        }
        if (_0x185028["hasBudget"]()) {
          const _0x5f272a = _0x25a6b6 ? _nowMs() : 0x0;
          _parkNode(_0x507fe0);
          _0x25a6b6 && recordRendererLifecycleDuration(_0x25a6b6, "park", _0x443b18, _nowMs() - _0x5f272a, 'park');
          _0x185028["consume"]();
        } else {
          _0x49d9fa = !![];
        }
      }
      continue;
    }
    const _0x4ba91d = _0xea554e["has"](_0x507fe0);
    const _0x59ecde = !_0x4ba91d && _0x12ac37?.['has']?.(_0x507fe0);
    const _0x4c7a53 = isNodeType(_0x443b18, ["source-video", 'ai-video', "video"]);
    const _0x30066d = _0x4c7a53 && _isNodeVisible(_0x443b18, _0x13ba2e, _0x3e7a91, _0x429083);
    if (_0x4c7a53) {
      const _0xe11d8a = _0x9407e7["has"](_0x507fe0) || resolveRendererLowZoomMountLimit({
        'viewport': _0x13ba2e,
        'nodeCount': _0x16c98a
      }) <= 0x0;
      _videoMediaResidency["sync"](_0x507fe0, {
        'withinResidency': _0xe11d8a && isNodeInsideViewportPadding(_0x443b18, _0x13ba2e, _0x3e7a91, _0x429083, RENDERER_VIDEO_MEDIA_RESIDENCY_PADDING),
        'leaseKey': _resolveVideoMediaLeaseKey(_0x507fe0, _0x443b18)
      });
    }
    const _0x54275a = _0x30066d && !!resolveCanvasVideoDisplayUrl(_0x443b18);
    if (_0xa0db88?.["viewportPriorityMediaOnly"] === !![] && !_0x54275a) {
      continue;
    }
    const _0x2dd5b9 = _0x9407e7["has"](_0x507fe0);
    const _0x554fc4 = shouldHydrateVideoMediaImmediately({
      'node': _0x443b18,
      'nodeId': _0x507fe0,
      'isSelected': _0x4ba91d,
      'isSelectionRelated': _0x59ecde,
      'dragTargets': _0x4f22f4,
      'connOverlay': _0x355ed3,
      'pickMode': _0x4c48e4
    });
    const _0x16a555 = shouldForceDeferRelatedVideoDetails({
      'node': _0x443b18,
      'nodeId': _0x507fe0,
      'isSelected': _0x4ba91d,
      'isSelectionRelated': _0x59ecde,
      'dragTargets': _0x4f22f4,
      'viewport': _0x13ba2e,
      'mountCandidateCount': _0x1d9f1b["size"],
      'nodeCount': _0x16c98a,
      'options': _0xa0db88
    });
    const _0x58146c = isViewportPriorityImageNode({
      'node': _0x443b18,
      'nodeId': _0x507fe0,
      'mountCandidateIds': _0x1d9f1b,
      'viewport': _0x13ba2e,
      'containerW': _0x3e7a91,
      'containerH': _0x429083,
      'isSelected': _0x4ba91d,
      'isSelectionRelated': _0x59ecde
    });
    const _0x227ec9 = _0x5e1289["has"](_0x507fe0);
    if (!_0x482b30 || !_0x3d55be) {
      if (_0x4d26dd({
        'node': _0x443b18,
        'nodeId': _0x507fe0,
        'isSelected': _0x4ba91d,
        'isSelectionRelated': _0x59ecde,
        'isVisibleVideoMediaNode': _0x30066d,
        'dragTargets': _0x4f22f4,
        'connOverlay': _0x355ed3,
        'pickMode': _0x4c48e4,
        'viewport': _0x13ba2e,
        'nodeCount': _0x16c98a
      })) {
        continue;
      }
      if (!_0x227ec9 && shouldDeferHeavyMediaMount({
        'node': _0x443b18,
        'nodeId': _0x507fe0,
        'isSelected': _0x4ba91d,
        'isSelectionRelated': _0x59ecde,
        'dragTargets': _0x4f22f4,
        'connOverlay': _0x355ed3,
        'pickMode': _0x4c48e4,
        'options': _0xa0db88
      })) {
        _0x49d9fa = !![];
        if (_0x4c7a53) {
          _0x30fc17 = !![];
        }
        if (_0x30066d) {
          _0x38ab3c = !![];
        }
        continue;
      }
      if (!_0x227ec9 && _0x52dec4["shouldDefer"]({
        'node': _0x443b18,
        'nodeId': _0x507fe0,
        'isSelected': _0x4ba91d,
        'isSelectionRelated': _0x59ecde,
        'dragTargets': _0x4f22f4,
        'connOverlay': _0x355ed3,
        'pickMode': _0x4c48e4
      })) {
        _0x49d9fa = !![];
        if (_0x4c7a53) {
          _0x30fc17 = !![];
        }
        if (_0x30066d) {
          _0x38ab3c = !![];
        }
        _0x227ec9 && (_0x1fd293 = !![]);
        continue;
      }
      if (_0x12de28 && _0x4c7a53 && _0x553cd1 && !_0x554fc4) {
        _0x49d9fa = !![];
        _0x30fc17 = !![];
        if (_0x30066d) {
          _0x38ab3c = !![];
        }
        continue;
      }
      const _0x588fbb = _0x23ca27["hasBudget"]();
      if (!_0x588fbb && !_0x554fc4) {
        _0x49d9fa = !![];
        if (_0x4c7a53) {
          _0x30fc17 = !![];
        }
        if (_0x30066d) {
          _0x38ab3c = !![];
        }
        _0x227ec9 && (_0x1fd293 = !![]);
        continue;
      }
      const _0x101651 = _nodeDetailHydration['shouldDeferNodeDetails']({
        'node': _0x443b18,
        'nodeId': _0x507fe0,
        'isSelected': _0x4ba91d,
        'connOverlay': _0x355ed3,
        'pickMode': _0x4c48e4,
        'relatedNodeIds': _0x12ac37,
        'viewport': _0x13ba2e,
        'mountCandidateCount': _0x1d9f1b['size'],
        'nodeCount': _0x16c98a,
        'forceDeferActiveNodeDetails': shouldForceDeferActiveNodeDetails({
          'nodeId': _0x507fe0,
          'dragContext': _0x40ff3b,
          'dragTargets': _0x4f22f4
        }) || _0xa0db88?.["viewportPriorityMediaOnly"] === !![] && _0x2d8210 && !_0x554fc4 || _0x16a555
      });
      const _0x2e7af5 = ![];
      const _0x44c2dc = shouldDeferInitialVideoMediaOnMount({
        'node': _0x443b18,
        'nodeId': _0x507fe0,
        'isSelected': _0x4ba91d,
        'isSelectionRelated': _0x59ecde,
        'dragTargets': _0x4f22f4,
        'nodeCount': _0x16c98a,
        'mountCandidateCount': _0x1d9f1b["size"]
      });
      _0x27f2f2 = (_0x101651 || _0x44c2dc) && !_0x2e7af5;
      _0x5410e0 = _0x27f2f2 && (!_0x101651 || _0x30066d) && (!_0x4c7a53 || !resolveCanvasVideoPosterUrl(_0x443b18));
      const _0x24dd6e = {
        'deferDetailsOnMount': _0x101651,
        'deferMediaOnMount': _0x27f2f2,
        'eagerVideoPreviewOnMount': _0x2e7af5
      };
      const _0x5e9d43 = [_0x101651 ? "details-deferred" : "details-ready", _0x27f2f2 ? "media-deferred" : "media-ready", _0x2e7af5 ? "video-eager" : "video-lazy"]["join"]('|');
      const _0x20c969 = _rendererMediaRuntimePreparer["hasPrepared"](_0x507fe0, _0x443b18, _0x5e9d43);
      const _0x5553e3 = isRendererMediaRuntimeInteractionPriority({
        'nodeId': _0x507fe0,
        'isSelected': _0x4ba91d,
        'isSelectionRelated': _0x59ecde,
        'dragTargets': _0x4f22f4,
        'connOverlay': _0x355ed3,
        'pickMode': _0x4c48e4
      });
      const _0x2562bf = shouldPrebuildRendererMediaRuntime({
        'node': _0x443b18,
        'nodeCount': _0x16c98a,
        'veryDenseNodeCount': RENDERER_VIRTUALIZATION_CONFIG["veryDenseNodeCount"],
        'hasExactVisiblePreview': _0x42f101["has"](_0x507fe0) && _0x50ef9a["has"](_0x507fe0),
        'interactionBusy': _0x39c012,
        'interactionPriority': _0x5553e3,
        'deferMediaOnMount': _0x27f2f2,
        'eagerVideoPreviewOnMount': _0x2e7af5,
        'viewportPriorityMediaOnly': _0xa0db88?.["viewportPriorityMediaOnly"] === !![],
        'idlePreparationSupported': typeof requestIdleCallback === "function"
      });
      if (!_0x20c969 && _0x2562bf) {
        _rendererMediaRuntimePreparer["enqueue"]({
          'nodeId': _0x507fe0,
          'version': _0x443b18,
          'variant': _0x5e9d43,
          'isValid': () => _currentSnapshot?.["nodes"]?.[_0x507fe0] === _0x443b18 && !_componentMap['has'](_0x507fe0),
          'prepare': () => prepareRendererNodeRuntime({
            'node': _0x443b18,
            'selectedNodeSet': _0xea554e,
            'selectedNodeRankMap': _0x275508,
            'dragContext': _0x40ff3b,
            'dragTargets': _0x4f22f4,
            'options': {
              ..._0x24dd6e,
              'prebuildOffscreen': !![]
            }
          }),
          'dispose': disposePreparedRendererNodeRuntime
        });
        _0x49d9fa = !![];
        if (_0x4c7a53) {
          _0x30fc17 = !![];
        }
        if (_0x30066d) {
          _0x38ab3c = !![];
        }
        _0x227ec9 && (_0x1fd293 = !![]);
        continue;
      }
      !_0x20c969 && !_0x2562bf && _rendererMediaRuntimePreparer['forget'](_0x507fe0);
      if (_0x30066d && !_0x554fc4 && !_videoHydrationBackpressure['tryAcquire']()) {
        _0x49d9fa = _0x30fc17 = _0x38ab3c = !![];
        continue;
      }
      const _0x579422 = _0x25a6b6 ? _nowMs() : 0x0;
      const _0x2561f7 = _0x20c969 ? _rendererMediaRuntimePreparer['take'](_0x507fe0, _0x443b18, _0x5e9d43) : null;
      ({
        wrapperEl: _0x3d55be,
        instance: _0x482b30
      } = _0x2561f7 ? _registerNodeRuntime(_0x2561f7) : _createNodeRuntime(_0x443b18, _0xea554e, _0x275508, _0x40ff3b, _0x4f22f4, _0x24dd6e));
      _0x25a6b6 && recordRendererLifecycleDuration(_0x25a6b6, "create", _0x443b18, _nowMs() - _0x579422, _0x2561f7 ? "commit-prepared-runtime" : _0x27f2f2 ? "create-deferred-media" : "create");
      !_0x555853 && (_0x555853 = document["createDocumentFragment"]());
      _mountNode(_0x507fe0, _0x555853);
      _0x1d1a88 = !![];
      _0x52dec4["consume"](_0x443b18);
      if (_0x554fc4) {
        _videoHydrationBackpressure["markPriorityWork"]();
      }
      if (_0x4c7a53) {
        _0x553cd1 = !![];
      }
      if (_0x588fbb) {
        _0x23ca27["consume"]();
      }
    } else {
      if (!_0x2d4bc5) {
        if (!_0x227ec9 && _0x52dec4["shouldDefer"]({
          'node': _0x443b18,
          'nodeId': _0x507fe0,
          'isSelected': _0x4ba91d,
          'isSelectionRelated': _0x59ecde,
          'dragTargets': _0x4f22f4,
          'connOverlay': _0x355ed3,
          'pickMode': _0x4c48e4
        })) {
          _0x49d9fa = !![];
          if (_0x4c7a53) {
            _0x30fc17 = !![];
          }
          if (_0x30066d) {
            _0x38ab3c = !![];
          }
          _0x227ec9 && (_0x1fd293 = !![]);
          continue;
        }
        if (_0x12de28 && _0x4c7a53 && _0x553cd1 && !_0x554fc4) {
          _0x49d9fa = !![];
          _0x30fc17 = !![];
          if (_0x30066d) {
            _0x38ab3c = !![];
          }
          continue;
        }
        const _0x48a344 = _0x23ca27["hasBudget"]();
        if (!_0x48a344 && !_0x554fc4) {
          _0x49d9fa = !![];
          if (_0x4c7a53) {
            _0x30fc17 = !![];
          }
          if (_0x30066d) {
            _0x38ab3c = !![];
          }
          _0x227ec9 && (_0x1fd293 = !![]);
          continue;
        }
        if (_0x30066d && !_0x554fc4 && !_videoHydrationBackpressure["tryAcquire"]()) {
          _0x49d9fa = _0x30fc17 = _0x38ab3c = !![];
          continue;
        }
        !_0x555853 && (_0x555853 = document["createDocumentFragment"]());
        const _0x5bccba = _0x25a6b6 ? _nowMs() : 0x0;
        _mountNode(_0x507fe0, _0x555853);
        _0x25a6b6 && recordRendererLifecycleDuration(_0x25a6b6, "remount", _0x443b18, _nowMs() - _0x5bccba, "remount");
        _0x1d1a88 = !![];
        _0x52dec4["consume"](_0x443b18);
        if (_0x554fc4) {
          _videoHydrationBackpressure["markPriorityWork"]();
        }
        if (_0x4c7a53) {
          _0x553cd1 = !![];
        }
        if (_0x48a344) {
          _0x23ca27["consume"]();
        }
      } else {
        _0x58146c && _0x3d55be?.['dataset']?.["detailStage"] === 'deferred' && (_nodeDetailHydration['hydrateNodeDetails'](_0x507fe0, _0x3d55be), _rendererDeferredMedia['hydrateNow'](_0x507fe0));
      }
    }
    const _0x1452c5 = shouldQueueNodeDetailHydration({
      'wrapperEl': _0x3d55be,
      'nodeId': _0x507fe0,
      'isSelected': _0x4ba91d,
      'isSelectionRelated': _0x59ecde,
      'dragTargets': _0x4f22f4,
      'connOverlay': _0x355ed3,
      'pickMode': _0x4c48e4,
      'viewportBusyForPreview': _0x39c012,
      'mountCandidateCount': _0x1d9f1b["size"],
      'nodeCount': _0x16c98a,
      'options': _0xa0db88
    });
    const _0x2a7911 = _0x16c98a >= 0x78 && isNodeType(_0x443b18, ["ai-video", "ai-audio"]) && !_0x4ba91d && (!_0x59ecde || _0x16a555) && !_0x4f22f4?.["has"]?.(_0x507fe0) && _0x355ed3?.["srcId"] !== _0x507fe0 && _0x355ed3?.['hoverId'] !== _0x507fe0 && _0x4c48e4?.["sourceNodeId"] !== _0x507fe0 && _0x4c48e4?.['hoverNodeId'] !== _0x507fe0 && _0x443b18?.["isVideosExpanded"] !== !![] && _0x443b18?.["isImagesExpanded"] !== !![];
    (_0x1d1a88 || _0x3d55be?.["dataset"]?.["detailStage"] === "deferred") && (_nodeDetailHydration["syncNodeDetailMountStage"]({
      'wrapperEl': _0x3d55be,
      'node': _0x443b18,
      'nodeId': _0x507fe0,
      'isSelected': _0x4ba91d,
      'connOverlay': _0x355ed3,
      'pickMode': _0x4c48e4,
      'relatedNodeIds': _0x12ac37,
      'viewport': _0x13ba2e,
      'mountCandidateCount': _0x1d9f1b["size"],
      'nodeCount': _0x16c98a,
      'autoHydrate': !_0x2a7911 && isNodeType(_0x443b18, ["source-video", "ai-video", 'video', "source-audio", 'ai-audio', 'audio']),
      'deferHydrate': _0x1452c5,
      'forceDeferActiveNodeDetails': shouldForceDeferActiveNodeDetails({
        'nodeId': _0x507fe0,
        'dragContext': _0x40ff3b,
        'dragTargets': _0x4f22f4
      }) || _0xa0db88?.["viewportPriorityMediaOnly"] === !![] && _0x2d8210 && !_0x554fc4 || _0x16a555
    }), _0x1d1a88 && isNodeType(_0x443b18, ["source-video", "ai-video", 'video', "source-audio", "ai-audio", "audio"]) && !_0x2a7911 && shouldQueueNodeDetailHydration({
      'wrapperEl': _0x3d55be,
      'nodeId': _0x507fe0,
      'isSelected': _0x4ba91d,
      'isSelectionRelated': _0x59ecde,
      'dragTargets': _0x4f22f4,
      'connOverlay': _0x355ed3,
      'pickMode': _0x4c48e4,
      'viewportBusyForPreview': _0x39c012,
      'mountCandidateCount': _0x1d9f1b["size"],
      'nodeCount': _0x16c98a,
      'options': _0xa0db88
    }) && _nodeDetailHydration["enqueueNodeDetailHydration"](_0x507fe0));
    const _0x41c4fc = _pendingNodeDataMap['get'](_0x507fe0);
    const _0xc90284 = _0x41c4fc?.['node'] || _0x443b18;
    const _0x1fef1d = _getIncomingEdgeSignature(_0x507fe0, _0x5f13f9, _0x264a8a);
    const _0x3fec83 = syncNodeMediaLodMode(_0x3d55be, _0xc90284, _0x13ba2e, {
      'interactionBusy': _0x39c012
    });
    const _0x2bc470 = buildRendererNodeSignature({
      'node': _0xc90284,
      'inEdgeSig': _0x1fef1d,
      'pickMode': _0x4c48e4,
      'isSelected': _0x4ba91d,
      'isSelectionRelated': _0x59ecde,
      'showVideoMeta': _0x56f922,
      'viewport': _0x13ba2e,
      'mediaLodMode': _0x3fec83
    });
    const _0x1e5dce = shouldSkipInitialMediaNodeUpdate(_0xc90284, _0x1d1a88);
    const _0x3a2ac3 = _0x4c7a53 && _isNodeVisible(_0xc90284, _0x13ba2e, _0x3e7a91, _0x429083) && (_0x2dd5b9 || _0x554fc4 || resolveRendererLowZoomMountLimit({
      'viewport': _0x13ba2e,
      'nodeCount': _0x16c98a
    }) <= 0x0) && _0x482b30?.["prepareRendererVisibleVideoPreview"]?.() === !![];
    const _0x8ff071 = _syncMountedNodePresentation({
      'wrapperEl': _0x3d55be,
      'node': _0xc90284,
      'nodeId': _0x507fe0,
      'selectedNodeSet': _0xea554e,
      'selectedNodeRankMap': _0x275508,
      'connOverlay': _0x355ed3,
      'pickMode': _0x4c48e4,
      'viewport': _0x13ba2e,
      'containerW': _0x3e7a91,
      'containerH': _0x429083,
      'dragContext': _0x40ff3b,
      'dragTargets': _0x4f22f4,
      'showVideoMeta': _0x56f922,
      'relatedNodeIds': _0x12ac37,
      'relatedHighlightColor': _0x4ddf76,
      'inEdgeSig': _0x1fef1d,
      'signature': _0x2bc470,
      'mediaLodMode': _0x3fec83,
      'skipInstanceUpdate': _0x1e5dce,
      'deferInstanceUpdate': shouldDeferHeavyMediaUpdate({
        'node': _0xc90284,
        'nodeId': _0x507fe0,
        'viewportBusyForPreview': _0x39c012,
        'nodeCount': _0x16c98a,
        'skipInstanceUpdate': _0x1e5dce
      }) || !_0x1d1a88 && _0x52dec4["shouldDefer"]({
        'node': _0xc90284,
        'nodeId': _0x507fe0,
        'isSelected': _0x4ba91d,
        'isSelectionRelated': _0x59ecde,
        'dragTargets': _0x4f22f4,
        'connOverlay': _0x355ed3,
        'pickMode': _0x4c48e4
      }),
      'mountedThisFrame': _0x1d1a88,
      'lifecycleStats': _0x25a6b6,
      'allowActiveDetailHydration': !_0x1452c5 && !_0x2a7911
    });
    if (_0x8ff071?.['deferredUpdate']) {
      _0x49d9fa = !![];
      if (_0x4c7a53) {
        _0x30fc17 = !![];
      }
      if (_0x30066d) {
        _0x38ab3c = !![];
      }
    }
    if (_0x8ff071?.['didUpdate']) {
      _0x52dec4["consume"](_0xc90284);
      if (_0x4c7a53) {
        _0x2d22fd = !![];
      }
    }
    if (_0x5410e0 || _0x3a2ac3) {
      _fastPreviewLayer["retainNode"](_0x507fe0);
      if (_0x3a2ac3) {
        if (_0x1d1a88) {
          _rendererDeferredMedia["hydrateNow"](_0x507fe0);
        } else {
          _rendererDeferredMedia["enqueue"](_0x507fe0, {
            'urgent': !![]
          });
        }
      } else {
        _rendererDeferredMedia['enqueue'](_0x507fe0);
      }
    }
    const _0x3ab8ba = _isNodeVisible(_0xc90284, _0x13ba2e, _0x3e7a91, _0x429083);
    _0x2a5d7b({
      'node': _0xc90284,
      'nodeId': _0x507fe0,
      'isVisible': _0x3ab8ba,
      'isSelected': _0x4ba91d,
      'component': _0x482b30
    });
    _0x41c4fc && _pendingNodeDataMap['delete'](_0x507fe0);
  }
  const _0x105d55 = _0x555853?.["childNodes"]?.['length'] || 0x0;
  const _0x1a470f = _0x25a6b6 && _0x105d55 > 0x0 ? _nowMs() : 0x0;
  _flushMountBatch(_0x3ac1be, _0x555853);
  if (_0x25a6b6 && _0x105d55 > 0x0) {
    const _0x419a93 = _nowMs() - _0x1a470f;
    _0x25a6b6["mountBatchCount"] += _0x105d55;
    _0x25a6b6["mountBatchFlushMs"] += _0x419a93;
    _0x25a6b6["mountBatchFlushMaxMs"] = Math['max'](_0x25a6b6['mountBatchFlushMaxMs'], _0x419a93);
  }
  syncRendererFastPreviewAfterNodeRender({
    'continuation': _fastPreviewContinuation,
    'layer': _fastPreviewLayer,
    'canvasEl': _0x3ac1be,
    'nodes': _0x264a8a,
    'previewCandidateIds': _0x410573,
    'selectedNodeSet': _0xea554e,
    'candidateSignature': _0x69b7fe,
    'hasPendingStructuralOps': _0x49d9fa,
    'connOverlay': _0x355ed3,
    'pickConnectMode': _0x4c48e4,
    'nodeCount': _0x16c98a,
    'viewport': _0x13ba2e,
    'containerWidth': _0x3e7a91,
    'containerHeight': _0x429083,
    'freezeRasterSurface': _0x38c987["freezeActive"] === !![],
    'deferVisibleMediaSrc': _0xa0db88?.["deferInitialRasterPlanning"] === !![],
    'suppressNewMedia': _0x31c630,
    'mediaSourceOwnerIds': _0x50ef9a,
    'requiredImmediateMediaSourceOwnerIds': _0x20fdd9,
    'viewportBusy': _0x39c012,
    'dragContext': _0x40ff3b,
    'dragTargets': _0x4f22f4,
    'suspendNewMediaSrc': _0x424476,
    'fullEligibleVisibleImageNodeIds': _0x4d1b32,
    'fullEligiblePreviewImageNodeIds': _0x2ebdd2,
    ..._fastPreviewLifecycle['getContinuationOptions'](),
    'mountedHeavyMediaThisFrame': _0x553cd1,
    'updatedHeavyMediaThisFrame': _0x2d22fd,
    'hasPendingStructuralVideoMounts': _0x30fc17
  });
  _0x25a6b6 && recordRendererNodeLifecycleSample(_0x25a6b6);
  return {
    'hasPendingStructuralOps': _0x49d9fa,
    'deferredParkCount': _0x5e8f45,
    'hasPendingVisibleVideoMounts': _0x38ab3c,
    'hasPendingFullEligibleVisibleImageMounts': _0x1fd293
  };
}
function _renderNodes(..._0x3ba7a3) {
  if (!_rendererRuntimeDiagnosticsEnabled) {
    return _renderNodesImpl(..._0x3ba7a3);
  }
  const _0x1f9b02 = _nowMs();
  const _0x147e7f = _0x3ba7a3[0xc] || {};
  const _0x35b5fb = _0x3ba7a3[0x1] || {};
  const _0x2a576a = _0x3ba7a3[0xb] || null;
  const _0xc6718a = Number["isFinite"](_0x147e7f?.["framePlan"]?.["nodeCount"]) ? _0x147e7f["framePlan"]['nodeCount'] : Number["isFinite"](_0x2a576a?.["_nodeCount"]) ? _0x2a576a["_nodeCount"] : Object["keys"](_0x35b5fb)["length"];
  _rendererRuntimeDiagnosticRenderState = {
    'previewOnly': _0x147e7f?.['previewOnly'] === !![],
    'viewportBusy': _0x147e7f?.["viewportBusy"] === !![] || _0x147e7f?.["deferParking"] === !![] || _0x147e7f?.['deferHeavyMediaMount'] === !![] || _rendererInteractionGrace["isBusy"]()
  };
  try {
    return _renderNodesImpl(..._0x3ba7a3);
  } finally {
    recordRendererRuntimeDiagnostic({
      'kind': "render-nodes",
      'mode': _0x147e7f?.['mode'] || "steady",
      'previewOnly': _0x147e7f?.["previewOnly"] === !![],
      'nodeCount': _0xc6718a,
      'durationMs': _nowMs() - _0x1f9b02
    });
  }
}
function _cleanupNodes(_0x6754db, _0xd1eefc) {
  let _0xeb18d4 = ![];
  const _0x178ee9 = new Set(Object["keys"](_0xd1eefc || {}));
  const _0x17b438 = new Set([..._componentMap['keys'](), ..._wrapperMap['keys'](), ..._parkedWrapperMap['keys'](), ..._mountedNodeIds, ..._parkedNodeIds]);
  for (const _0x322b81 of _0x17b438) {
    !_0x178ee9['has'](_0x322b81) && (_destroyNode(_0x322b81), _0xeb18d4 = !![]);
  }
  _0x6754db["querySelectorAll"]('.v2-node')["forEach"](_0x39a49c => {
    const _0x2f14ff = _0x39a49c['id'] || _0x39a49c['dataset']["nodeId"];
    _0x2f14ff && !_0x178ee9["has"](_0x2f14ff) && (_0x39a49c["remove"](), _0xeb18d4 = !![]);
  });
  if (_0xeb18d4) {
    const _0x29dea2 = document["getElementById"]("v2-side-plus-holder");
    _0x29dea2 && _0x29dea2["children"]["length"] > 0x0 && _0x29dea2["replaceChildren"]();
  }
}
function _createSvgLayer() {
  const _0x13eb5c = document['createElement']("div");
  _0x13eb5c['id'] = "v2-edges-wrapper";
  _0x13eb5c["style"]["position"] = "absolute";
  _0x13eb5c["style"]["top"] = '0';
  _0x13eb5c['style']["left"] = '0';
  _0x13eb5c["style"]["width"] = "100%";
  _0x13eb5c["style"]["height"] = '100%';
  _0x13eb5c["style"]["pointerEvents"] = "none";
  _0x13eb5c['style']["zIndex"] = '5';
  const _0x290799 = document["createElementNS"]("http://www.w3.org/2000/svg", "svg");
  _0x290799['id'] = "v2-edges";
  _0x290799["style"]["overflow"] = "visible";
  _0x290799["style"]["pointerEvents"] = "none";
  _0x13eb5c["appendChild"](_0x290799);
  return _0x13eb5c;
}
function _renderEdgesByIds(_0x96cdaa, _0x1bae14, _0x3e8f4e, _0x4f93f7, _0x574b8f, _0x50204c, _0x51532c = null, _0x363c43 = null, _0xddb06e = {}) {
  const _0x288236 = _edgeLayer["renderPartial"]({
    'svgEl': _0x96cdaa,
    'edgeIds': _0x1bae14,
    'edges': _0x3e8f4e,
    'nodes': _0x4f93f7,
    'viewport': _0x574b8f,
    'containerEl': _0x50204c,
    'dragOffsetCtx': _0x51532c,
    'relatedEdgeIds': _0x363c43,
    'options': _0xddb06e
  });
  if (_0x288236["mutated"]) {
    _invalidateFullEdgeRenderSignature();
  }
}
function _renderEdges(_0x2f3842, _0x3acae9, _0x5b270a, _0x32fc35, _0x14daab, _0xbf4010 = null, _0x339db7 = null, _0x1e24b3 = null, _0x5d45d1 = "steady", _0x387070 = {}) {
  _edgeLayer["renderFull"]({
    'svgEl': _0x2f3842,
    'edges': _0x3acae9,
    'nodes': _0x5b270a,
    'viewport': _0x32fc35,
    'containerEl': _0x14daab,
    'dragOffsetCtx': _0xbf4010,
    'relatedEdgeIds': _0x339db7,
    'edgeEntries': _0x1e24b3,
    'reason': _0x5d45d1,
    'options': {
      ..._0x387070,
      'clearedDom': _edgeDomClearedSinceLastFull === !![]
    }
  });
  _0x387070?.["renderSignature"] && (_lastFullEdgeRenderSignature = _0x387070["renderSignature"]);
  _edgeDomClearedSinceLastFull = ![];
}
function _clearRenderedEdges(_0x101e1b) {
  const _0x262eb1 = _edgeLayer["clearRenderedEdges"](_0x101e1b);
  _0x262eb1 > 0x0 && _invalidateFullEdgeRenderSignature({
    'clearedDom': !![]
  });
}
function _clearRenderedEdgesFromDocument() {
  if (typeof document === "undefined") {
    _edgeLayer["reset"]();
    return;
  }
  const _0x5ea98b = document["getElementById"]?.("v2-edges");
  _clearRenderedEdges(_0x5ea98b);
  document['getElementById']?.("v2-draft-edge")?.["remove"]?.();
  document["querySelectorAll"]?.(".v2-edge-thumbnail")["forEach"](_0x4b16e4 => _0x4b16e4["remove"]());
  document["querySelectorAll"]?.("[id^=\"v2-thumb-\"]")["forEach"](_0x22f8de => _0x22f8de["remove"]());
}
function _cleanupEdges(_0x24948d, _0x35f621) {
  const _0x499175 = _edgeLayer["cleanupEdges"](_0x24948d, _0x35f621);
  document["querySelectorAll"](".v2-edge-thumbnail")["forEach"](_0x5e4aa3 => _0x5e4aa3['remove']());
  document["querySelectorAll"]("[id^=\"v2-thumb-\"]")['forEach'](_0x3a69d2 => _0x3a69d2["remove"]());
  _0x499175 > 0x0 && _invalidateFullEdgeRenderSignature({
    'clearedDom': !![]
  });
}
function _createPickerEl() {
  const _0x212e8f = document["createElement"]("div");
  _0x212e8f['id'] = "v2-picker";
  _0x212e8f["dataset"]["uiStop"] = '1';
  Object["assign"](_0x212e8f["style"], {
    'position': "fixed",
    'display': 'none',
    'flexDirection': "column",
    'gap': '4px',
    'background': "var(--preset-menu-bg)",
    'border': '1px\x20solid\x20var(--preset-menu-border)',
    'borderRadius': "var(--radius-18)",
    'padding': "8px",
    'minWidth': '160px',
    'boxShadow': "var(--preset-menu-shadow)",
    'backdropFilter': 'blur(var(--preset-menu-blur))',
    'zIndex': '1000',
    'fontFamily': 'inherit'
  });
  return _0x212e8f;
}
function _renderPicker(_0x237afc, _0x43891a, _0x508ecd) {
  if (!_0x43891a["visible"]) {
    _0x237afc['style']["display"] = "none";
    _0x237afc["replaceChildren"]();
    return;
  }
  _0x237afc["style"]['display'] = "flex";
  _0x237afc['style']['left'] = _0x43891a['screenX'] + 'px';
  _0x237afc["style"]["top"] = _0x43891a["screenY"] + 'px';
  if (_0x237afc["children"]["length"] > 0x0) {
    return;
  }
  const _0x2315fe = document["createElement"]("div");
  _0x2315fe["textContent"] = t("coreUi.renderer.picker.addNode");
  Object['assign'](_0x2315fe["style"], {
    'fontSize': "11px",
    'color': "var(--text-muted)",
    'padding': "2px 4px 6px",
    'borderBottom': "1px solid var(--white-08)",
    'marginBottom': "4px",
    'userSelect': "none"
  });
  _0x237afc["appendChild"](_0x2315fe);
  const _0x3e8327 = getRendererPickerNodeTypes();
  for (const {
    type: _0x340a67,
    label: _0x525223,
    defaultLabel: _0x254652,
    width: _0x2fd894,
    height: _0xb24cef
  } of _0x3e8327) {
    const _0x383d1f = document["createElement"]('button');
    _0x383d1f['textContent'] = _0x525223;
    _0x383d1f["dataset"]['nodeType'] = _0x340a67;
    _0x383d1f['dataset']["defaultLabel"] = _0x254652;
    _0x383d1f['dataset']['width'] = String(_0x2fd894);
    _0x383d1f['dataset']["height"] = String(_0xb24cef);
    Object["assign"](_0x383d1f["style"], {
      'background': "var(--blue-10)",
      'border': "1px solid var(--blue-25)",
      'borderRadius': "6px",
      'color': "var(--blue)",
      'fontSize': "13px",
      'padding': "7px 12px",
      'cursor': "pointer",
      'textAlign': "left",
      'transition': 'background\x200.15s'
    });
    _0x237afc['appendChild'](_0x383d1f);
  }
}
function _createSelectionRectEl() {
  const _0x41fb70 = document["createElement"]("div");
  _0x41fb70['id'] = "v2-selection-rect";
  Object["assign"](_0x41fb70["style"], {
    'position': "absolute",
    'border': "1px dashed var(--white-50)",
    'backgroundColor': "var(--white-02)",
    'pointerEvents': "none",
    'display': "none",
    'zIndex': "1000"
  });
  return _0x41fb70;
}
function _renderSelectionRect(_0xd44924, _0x3b81b2) {
  if (!_0x3b81b2 || !_0x3b81b2["active"]) {
    _0xd44924["style"]['display'] = "none";
    return;
  }
  _0xd44924["style"]["display"] = "block";
  const _0xbd5b0d = Math["min"](_0x3b81b2['x1'], _0x3b81b2['x2']);
  const _0x18d11f = Math["min"](_0x3b81b2['y1'], _0x3b81b2['y2']);
  const _0x7cae60 = Math["abs"](_0x3b81b2['x2'] - _0x3b81b2['x1']);
  const _0x532975 = Math['abs'](_0x3b81b2['y2'] - _0x3b81b2['y1']);
  _0xd44924["style"]["left"] = _0xbd5b0d + 'px';
  _0xd44924['style']['top'] = _0x18d11f + 'px';
  _0xd44924['style']["width"] = _0x7cae60 + 'px';
  _0xd44924["style"]["height"] = _0x532975 + 'px';
}