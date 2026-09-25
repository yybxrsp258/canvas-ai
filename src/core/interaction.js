import a609_0x4a5dfa, { graphStore as a609_0x2dbbe5, uiStore as a609_0x3caf2e, workspaceStore as a609_0x39e62a } from './stores/appStore.js';
import { isNodeType } from '../modules/registry.js';
import { getShortcuts } from '../modules/shortcuts.js';
import { screenToWorld, isPointInRect, isRectIntersect, checkLineIntersection, checkBBoxIntersection, hitTestNode, findAvailablePosition, generateId, getViewportScreenCenter, getViewportScreenBounds } from './math.js';
import { commit } from '../modules/history.js';
import { setClipboard, getClipboard, getClipboardGraph } from '../modules/clipboard.js';
import { captureEditableSelection, getEditableTextTarget, isEditableTextTargetInGroupedNode, showTextInputContextMenu, TEXT_CONTEXT_MENU_TARGET_SELECTOR } from '../modules/textInputContextMenu.js';
import { rafSampleLatest } from '../utils/dom.js';
import { createDragController } from '../modules/interaction/DragController.js';
import { createEdgeCuttingController } from '../modules/interaction/edgeCuttingController.js';
import { beginDragFpsSession, beginPanFpsSession, endDragFpsSession, endPanFpsSession, recordCanvasPanSample } from '../modules/perf/perfProbe.js';
import { createEdgeController, initConnectionHandles as a609_0x31a7f7, initPickConnect as a609_0x1f5cae, isValidConnection as a609_0x5dab6e, addEdgeWithPolicies, setDragContextGetter } from '../modules/interaction/EdgeController.js';
import { createSelectionController } from '../modules/interaction/SelectionController.js';
import { createZoomController } from '../modules/interaction/ZoomController.js';
import { createWheelPanController } from '../modules/interaction/WheelPanController.js';
import { resolveAutoPanVelocity } from '../modules/interaction/viewportAutoPan.js';
import { createViewportPreviewCoordinator } from '../modules/interaction/viewportPreviewCoordinator.js';
import { createInteractionCommandAdapter } from '../modules/interaction/interactionCommandAdapter.js';
import { createCanvasContextMenuController } from '../modules/interaction/canvasContextMenuController.js';
import { removeContextMenus } from '../modules/interaction/contextMenuPresenter.js';
import { NODE_CREATION_UPLOAD_ITEM, PICKER_NODE_CREATION_SECTION_IDS, getNodeCreationMenuSections } from '../modules/nodeCreationMenuCatalog.js';
import { createNodeCreationMenuIcon } from '../modules/nodeCreationMenuIcons.js';
import { beginViewportPanPreview, cancelViewportPanPreview, flushViewportPanPreview, getViewportPanPreview, isViewportPanPreviewActive, updateViewportPanPreview } from './viewportPanPreview.js';
import { syncRendererViewportMediaPreloadPause } from './rendererViewportMediaPreloadPause.js';
import { PANORAMA_SCENE_DEFAULT_SIZE } from '../modules/panoramaSceneNode/sceneNode.js';
import { STORYBOARD_SCRIPT_DEFAULT_SIZE } from './storyboardScriptFactory.js';
import { getAIGenerationDefaultSizeByType, getAIGenerationNodeSize, getNodeDefaultSize, handleFileDrop } from '../services/fileService.js';
import { buildAppCanvasNodeData } from '../modules/app/canvasNodeDataFactory.js';
import { openAppCanvasFilePicker } from '../modules/app/appCanvasDropImport.js';
import { t } from '../i18n/index.js';
const graphStore = a609_0x4a5dfa?.["graphStore"] || a609_0x2dbbe5 || a609_0x4a5dfa;
const uiStore = a609_0x4a5dfa?.["uiStore"] || a609_0x3caf2e || a609_0x4a5dfa;
const workspaceStore = a609_0x4a5dfa?.["workspaceStore"] || a609_0x39e62a || a609_0x4a5dfa;
const interactionCommandAdapter = createInteractionCommandAdapter({
  'store': a609_0x4a5dfa,
  'graphStore': graphStore,
  'uiStore': uiStore,
  'commit': commit,
  'buildNodeData': buildAppCanvasNodeData,
  'getNodeDefaultSize': getNodeDefaultSize,
  'getAIGenerationDefaultSizeByType': getAIGenerationDefaultSizeByType,
  'getAIGenerationNodeSize': getAIGenerationNodeSize,
  'connectNodes': addEdgeWithPolicies,
  'clipboard': {
    'getClipboard': getClipboard,
    'getClipboardGraph': getClipboardGraph,
    'setClipboard': setClipboard
  },
  'focusNodes': _0x4faaf2 => window['v2FocusOnNodes']?.(_0x4faaf2),
  'translate': t,
  'showToast': (..._0x18ec7c) => window["showToast"]?.(..._0x18ec7c),
  'scheduleFrame': _0x4da98c => requestAnimationFrame(_0x4da98c),
  'windowObject': typeof window !== "undefined" ? window : null
});
const canvasContextMenuController = createCanvasContextMenuController({
  'store': a609_0x4a5dfa,
  'graphStore': graphStore,
  'commandAdapter': interactionCommandAdapter,
  'getShortcuts': getShortcuts,
  'onUploadFile': ({
    screenX: _0x2138c3,
    screenY: _0xca39b4
  }) => {
    openCanvasUploadAt(_0x2138c3, _0xca39b4);
  },
  'windowObject': typeof window !== "undefined" ? window : null,
  'documentObject': typeof document !== "undefined" ? document : null
});
const EDGE_INTERACTION_LITE_CLASS = "is-edge-interaction-lite";
const EDGE_INTERACTION_LITE_MIN_ZOOM = 0.24;
const EDGE_INTERACTION_LITE_MAX_ZOOM = 0.48;
const EDGE_INTERACTION_LITE_MIN_EDGES = 0x3;
const PAN_ACTIVATION_DISTANCE_PX = 0x3;
function isDevModeOn() {
  return window['DEV_MODE'] === !![] || document['body']?.["classList"]?.['contains']('dev-mode');
}
function openCanvasUploadAt(_0x319b2e, _0x42af7c) {
  return openAppCanvasFilePicker({
    'documentObject': document,
    'projectId': window['currentProjectId'] || 'default_v2_project',
    'handleFileDrop': handleFileDrop,
    'commit': commit,
    'clientX': _0x319b2e,
    'clientY': _0x42af7c,
    'onUnsupported': () => {
      window["showToast"]?.(t('canvasInteraction.toasts.unsupportedUpload'), "warning");
    },
    'onError': _0x3baa30 => {
      console["error"]("[Canvas] resource import failed:", _0x3baa30);
      window["showToast"]?.(t('previewUpload.uploadFailed'), "warning");
    }
  });
}
function _shouldUseEdgeInteractionLite(_0x4f9820) {
  const _0x329fe9 = Number(_0x4f9820?.["viewport"]?.["zoom"]) || 0x1;
  const _0x5db11c = Object["keys"](_0x4f9820?.["edges"] || {})["length"];
  const _0x416398 = typeof window !== "undefined" ? window["_edgeDomCache"] : null;
  return _0x329fe9 >= EDGE_INTERACTION_LITE_MIN_ZOOM && _0x329fe9 <= EDGE_INTERACTION_LITE_MAX_ZOOM && _0x5db11c >= EDGE_INTERACTION_LITE_MIN_EDGES && _0x416398 && _0x416398["size"] > 0x0;
}
function _setEdgeInteractionLite(_0x414d48) {
  if (typeof document === "undefined" || !document?.["body"]?.["classList"]) {
    return;
  }
  document['body']['classList']["toggle"](EDGE_INTERACTION_LITE_CLASS, !!_0x414d48);
}
function getStateRaw() {
  return {
    ...graphStore["getStateRaw"](),
    ...uiStore["getStateRaw"](),
    ...workspaceStore["getStateRaw"]()
  };
}
function getState() {
  return {
    ...graphStore["getState"](),
    ...uiStore['getState'](),
    ...workspaceStore["getState"]()
  };
}
function nowMs() {
  return typeof performance !== 'undefined' && performance && typeof performance["now"] === "function" ? performance["now"]() : Date["now"]();
}
function getMountedNodeCountForPerf() {
  const _0x44a11a = typeof window !== "undefined" && typeof window["v2Renderer"]?.["getMountedNodeCount"] === 'function' ? window["v2Renderer"]["getMountedNodeCount"]() : 0x0;
  return Number['isFinite'](_0x44a11a) ? _0x44a11a : 0x0;
}
function markViewportInteractionBusyForRenderer() {
  try {
    window["v2Renderer"]?.["markViewportInteractionBusy"]?.();
  } catch {}
}
function releaseViewportInteractionBusyForRenderer() {
  try {
    window['v2Renderer']?.["releaseViewportInteractionBusy"]?.();
  } catch {}
}
const VIEWPORT_MEDIA_PRELOAD_HOLD_MS = 0x384;
const VIEWPORT_MEDIA_PRELOAD_RESUME_AFTER_PAN_MS = 0xdc;
let viewportMediaPreloadPauseHeld = ![];
function holdViewportMediaPreloadsForPan() {
  viewportMediaPreloadPauseHeld = !![];
  syncRendererViewportMediaPreloadPause(!![], {
    'autoResumeMs': VIEWPORT_MEDIA_PRELOAD_HOLD_MS
  });
}
function releaseViewportMediaPreloadsAfterPan() {
  if (!viewportMediaPreloadPauseHeld) {
    return;
  }
  viewportMediaPreloadPauseHeld = ![];
  syncRendererViewportMediaPreloadPause(!![], {
    'autoResumeMs': VIEWPORT_MEDIA_PRELOAD_RESUME_AFTER_PAN_MS
  });
}
const edgeCuttingController = createEdgeCuttingController({
  'graphStore': graphStore,
  'getStateRaw': getStateRaw,
  'commit': commit,
  'checkBBoxIntersection': checkBBoxIntersection,
  'checkLineIntersection': checkLineIntersection,
  'getCutEdgeKeys': () => getShortcuts?.()?.['cut-edge']?.['keys']
});
edgeCuttingController["install"](typeof window !== "undefined" ? window : null);
function _createIdleDragContext() {
  return {
    'isDragging': ![],
    'targetNodeId': null,
    'lastWorldX': 0x0,
    'lastWorldY': 0x0,
    'pendingDx': 0x0,
    'pendingDy': 0x0,
    'hasMoved': ![],
    'wasSelectedOnDown': ![],
    'dragSource': null,
    'titleDragPendingSelectNodeId': null,
    'titleDragActivated': ![],
    'titleDragStartScreenX': 0x0,
    'titleDragStartScreenY': 0x0,
    'isPanning': ![],
    'panActivated': ![],
    'panStartX': 0x0,
    'panStartY': 0x0,
    'panStartViewportX': 0x0,
    'panStartViewportY': 0x0,
    'panStartZoom': 0x1,
    'panStartPerf': 0x0,
    'panMoveCount': 0x0,
    'panMinimapPreviewCount': 0x0,
    'assistPanActive': ![],
    'assistPanViewport': null,
    'isConnecting': ![],
    'connectSourceId': null,
    'isBoxSelecting': ![],
    'boxStartX': 0x0,
    'boxStartY': 0x0,
    'isDraggingCell': ![],
    'sourceCellIndex': -0x1,
    'draggedCellData': null,
    'ghostEl': null,
    'sourceCellEl': null,
    'lastHoverNodeId': null,
    'lastHoverCellIndex': -0x1
  };
}
let dragContext = _createIdleDragContext();
function _clearStoryboardHighlight(_0x21a8c7) {
  if (!_0x21a8c7) {
    return;
  }
  window['v2Renderer']?.["highlightDropSlot"]?.(_0x21a8c7, {
    'kind': "storyboard",
    'index': -0x1
  });
}
function _resetDragContext() {
  dragContext?.["isDragging"] && endDragFpsSession("node-drag");
  dragContext?.["isPanning"] && dragContext?.["panActivated"] && endPanFpsSession("canvas-pan");
  const _0x331df5 = dragContext?.["lastHoverNodeId"] || null;
  if (_0x331df5) {
    _clearStoryboardHighlight(_0x331df5);
  }
  dragContext = _createIdleDragContext();
  document["body"]["classList"]["remove"]("is-panning", 'is-dragging', "is-edge-interaction-lite", "is-dragging-heavy-edges");
  document['querySelectorAll']('.is-ui-hidden')["forEach"](_0x4bf8a4 => _0x4bf8a4["classList"]["remove"]('is-ui-hidden'));
  document["querySelectorAll"](".v2-node.is-dragging")["forEach"](_0x305420 => _0x305420["classList"]["remove"]('is-dragging'));
  stopAutoPan();
  _sampledPointerMove?.['cancel']?.();
  cancelPendingViewportUpdate();
  cancelViewportPanPreview();
  releaseViewportMediaPreloadsAfterPan();
}
function _resetCellDragContext() {
  const _0x21ec7e = dragContext?.["lastHoverNodeId"] || null;
  if (_0x21ec7e) {
    _clearStoryboardHighlight(_0x21ec7e);
  }
  dragContext?.['sourceCellEl'] && dragContext["sourceCellEl"]["classList"]['remove']("is-drag-source");
  dragContext?.["ghostEl"]?.['remove']?.();
  dragContext = _createIdleDragContext();
  document["body"]['classList']['remove']("is-panning", "is-dragging", 'is-edge-interaction-lite', "is-dragging-heavy-edges");
  stopAutoPan();
  _sampledPointerMove?.['cancel']?.();
  cancelPendingViewportUpdate();
  cancelViewportPanPreview();
  releaseViewportMediaPreloadsAfterPan();
}
function _deferCommit() {
  requestAnimationFrame(() => {
    setTimeout(() => commit(), 0x0);
  });
}
const dragController = createDragController({
  'store': a609_0x4a5dfa,
  'isNodeType': isNodeType,
  'getShortcuts': getShortcuts,
  'hitTestNode': hitTestNode,
  'screenToWorld': screenToWorld,
  'generateId': generateId,
  'cloneNodesWithEdges': cloneNodesWithEdges,
  'commit': commit
});
const edgeController = createEdgeController();
const selectionController = createSelectionController({
  'store': a609_0x4a5dfa,
  'screenToWorld': screenToWorld,
  'isNodeType': isNodeType,
  'isValidConnection': a609_0x5dab6e
});
const wheelViewportPreview = createViewportPreviewCoordinator({
  'beginPreview': beginViewportPanPreview,
  'updatePreview'(_0xecdd99) {
    updateViewportPanPreview(_0xecdd99['x'], _0xecdd99['y'], _0xecdd99["zoom"]);
  },
  'flushPreview': flushViewportPanPreview,
  'getPreview': getViewportPanPreview,
  'isPreviewActive': isViewportPanPreviewActive
});
const zoomController = createZoomController({
  'store': a609_0x4a5dfa,
  'viewportPreview': wheelViewportPreview
});
const wheelPanController = createWheelPanController({
  'store': a609_0x4a5dfa,
  'viewportPreview': wheelViewportPreview
});
setDragContextGetter(() => dragContext);
let viewportRafId = null;
let pendingViewportUpdate = null;
let assistPanMirrorTimer = 0x0;
let pendingAssistPanMirrorViewport = null;
function syncSidePlusToLastPointer(_0x1983aa = {}) {
  const _0xa58d2c = typeof window !== "undefined" && typeof window["_v2UpdateSidePlusNow"] === 'function' ? window["_v2UpdateSidePlusNow"] : typeof window !== 'undefined' ? window["_v2UpdateSidePlus"] : null;
  typeof _0xa58d2c === "function" && _0xa58d2c(lastMouseScreenX, lastMouseScreenY, _0x1983aa);
}
let sidePlusPostPanSyncToken = 0x0;
function scheduleSidePlusSyncAfterPanPaint() {
  const _0x29d5fe = ++sidePlusPostPanSyncToken;
  requestAnimationFrame(() => {
    setTimeout(() => {
      if (_0x29d5fe !== sidePlusPostPanSyncToken) {
        return;
      }
      if (dragContext["isDragging"] || dragContext["isPanning"] || dragContext["isConnecting"] || dragContext["isBoxSelecting"] || dragContext["isDraggingCell"]) {
        return;
      }
      syncSidePlusToLastPointer();
    }, 0x0);
  });
}
function updateViewportBatched(_0xeed23c, _0x46ff93, _0x38fc05) {
  pendingViewportUpdate = {
    'x': _0xeed23c,
    'y': _0x46ff93,
    'zoom': _0x38fc05
  };
  !viewportRafId && (viewportRafId = requestAnimationFrame(flushViewportUpdate));
}
function flushViewportUpdate() {
  viewportRafId = null;
  if (pendingViewportUpdate) {
    const {
      x: _0x119871,
      y: _0x8be600,
      zoom: _0x2e1522
    } = pendingViewportUpdate;
    pendingViewportUpdate = null;
    graphStore["updateViewport"](_0x119871, _0x8be600, _0x2e1522);
    syncSidePlusToLastPointer();
  }
}
function cancelPendingViewportUpdate() {
  viewportRafId && (cancelAnimationFrame(viewportRafId), viewportRafId = null);
  pendingViewportUpdate = null;
}
function flushAssistPanStoreMirror() {
  assistPanMirrorTimer = 0x0;
  const _0x521b3a = pendingAssistPanMirrorViewport;
  pendingAssistPanMirrorViewport = null;
  if (!_0x521b3a || !dragContext?.['assistPanActive']) {
    return;
  }
  graphStore["updateViewport"](_0x521b3a['x'], _0x521b3a['y'], _0x521b3a["zoom"]);
  syncSidePlusToLastPointer();
}
function scheduleAssistPanStoreMirror(_0x2b3ef7) {
  pendingAssistPanMirrorViewport = _0x2b3ef7 ? {
    ..._0x2b3ef7
  } : null;
  if (assistPanMirrorTimer) {
    return;
  }
  assistPanMirrorTimer = window["setTimeout"](flushAssistPanStoreMirror, 0x20);
}
function cancelAssistPanStoreMirror() {
  assistPanMirrorTimer && (window['clearTimeout'](assistPanMirrorTimer), assistPanMirrorTimer = 0x0);
  pendingAssistPanMirrorViewport = null;
}
function _commitAssistPanPreview() {
  if (!dragContext?.["assistPanActive"]) {
    return null;
  }
  releaseViewportMediaPreloadsAfterPan();
  const _0x8f4548 = flushViewportPanPreview();
  cancelAssistPanStoreMirror();
  dragContext['assistPanActive'] = ![];
  dragContext["assistPanViewport"] = null;
  cancelPendingViewportUpdate();
  window["_v2FlushMinimapViewportPreview"]?.(_0x8f4548);
  if (!_0x8f4548) {
    syncSidePlusToLastPointer();
    return null;
  }
  const _0x598e82 = () => {
    graphStore["updateViewport"](_0x8f4548['x'], _0x8f4548['y'], _0x8f4548["zoom"]);
    graphStore['markViewportPersist']?.();
  };
  typeof graphStore["batch"] === "function" ? graphStore["batch"](_0x598e82) : _0x598e82();
  syncSidePlusToLastPointer();
  return _0x8f4548;
}
let autoPanReqId = null;
let autoPanState = {
  'dx': 0x0,
  'dy': 0x0
};
let lastMouseScreenX = 0x0;
let lastMouseScreenY = 0x0;
let _autoPanPendingDx = null;
let _autoPanPendingDy = null;
export function stopAutoPan() {
  autoPanReqId && (cancelAnimationFrame(autoPanReqId), autoPanReqId = null);
}
function autoPanLoop() {
  if (!autoPanReqId) {
    return;
  }
  const {
    viewport: _0x4d0bfc
  } = getStateRaw();
  const {
    dx: _0x32d909,
    dy: _0x1e217b
  } = resolveAutoPanVelocity({
    'dx': _autoPanPendingDx,
    'dy': _autoPanPendingDy
  }, autoPanState);
  (_0x32d909 !== autoPanState['dx'] || _0x1e217b !== autoPanState['dy']) && (autoPanState['dx'] = _0x32d909, autoPanState['dy'] = _0x1e217b);
  _autoPanPendingDx = null;
  _autoPanPendingDy = null;
  const _0x12567c = _0x4d0bfc['x'] - autoPanState['dx'];
  const _0x203c71 = _0x4d0bfc['y'] - autoPanState['dy'];
  updateViewportBatched(_0x12567c, _0x203c71, _0x4d0bfc["zoom"]);
  if (dragContext["isDragging"]) {
    const _0x571e4b = getStateRaw();
    const {
      nodes: _0x48ce5c
    } = _0x571e4b;
    const {
      x: _0x1862f3,
      y: _0x43c5b8
    } = screenToWorld(lastMouseScreenX, lastMouseScreenY, {
      ..._0x4d0bfc,
      'x': _0x12567c,
      'y': _0x203c71
    });
    dragController["updateDraggingNodes"](dragContext, lastMouseScreenX, lastMouseScreenY, _0x1862f3, _0x43c5b8, _0x1862f3, _0x43c5b8, _0x571e4b);
  }
  autoPanReqId = requestAnimationFrame(autoPanLoop);
}
function checkAutoPan(_0x1f1677, _0x468bda) {
  lastMouseScreenX = _0x1f1677;
  lastMouseScreenY = _0x468bda;
  if (!dragContext['isDragging'] && !dragContext["isBoxSelecting"] && !dragContext["isConnecting"]) {
    stopAutoPan();
    return;
  }
  const _0x52be5c = 0x3c;
  const _0x4cf3c2 = 0xf;
  let _0x3e1197 = 0x0;
  let _0x3a922d = 0x0;
  const _0x386218 = getStateRaw()["viewport"] || {};
  const _0x2b6b49 = getViewportScreenBounds(_0x386218, window["innerWidth"], window["innerHeight"]);
  if (_0x1f1677 < _0x2b6b49["left"] + _0x52be5c) {
    _0x3e1197 = -_0x4cf3c2;
  } else {
    if (_0x1f1677 > _0x2b6b49["right"] - _0x52be5c) {
      _0x3e1197 = _0x4cf3c2;
    }
  }
  if (_0x468bda < _0x2b6b49["top"] + _0x52be5c) {
    _0x3a922d = -_0x4cf3c2;
  } else {
    if (_0x468bda > _0x2b6b49["bottom"] - _0x52be5c) {
      _0x3a922d = _0x4cf3c2;
    }
  }
  _0x3e1197 !== 0x0 || _0x3a922d !== 0x0 ? (_autoPanPendingDx = _0x3e1197, _autoPanPendingDy = _0x3a922d, !autoPanReqId && (autoPanReqId = requestAnimationFrame(autoPanLoop))) : stopAutoPan();
}
export function handlePointerDown(_0x17aedc, _0x51646d, _0x55e70c = ![], _0x320507 = ![], _0x2ddc4e = null) {
  zoomController["settleWheelZoom"]();
  lastMouseScreenX = _0x17aedc;
  lastMouseScreenY = _0x51646d;
  const _0xa608fa = getStateRaw();
  const {
    viewport: _0x410f30
  } = _0xa608fa;
  const {
    x: _0xb77214,
    y: _0x32f507
  } = screenToWorld(_0x17aedc, _0x51646d, _0x410f30);
  const _0x33cae4 = _0xa608fa["pickConnectMode"];
  if (_0x33cae4 && _0x33cae4["active"]) {
    if (_0x2ddc4e?.["button"] === 0x2) {
      _0x2ddc4e["stopPropagation"]?.();
      _0x2ddc4e["stopImmediatePropagation"]?.();
      return;
    }
    const _0x26e3e9 = _0x2ddc4e && _0x2ddc4e["target"] && _0x2ddc4e["target"]["closest"]('.v2-node');
    if (_0x26e3e9) {
      return;
    }
  }
  if (!_0x55e70c && dragController["tryStartTitleDrag"](dragContext, _0x2ddc4e, _0xb77214, _0x32f507)) {
    beginDragFpsSession("node-drag");
    return;
  }
  if (!_0x55e70c && edgeController["tryStartHandleConnect"](dragContext, _0x2ddc4e, _0xb77214, _0x32f507, _0x410f30)) {
    return;
  }
  if (_0x55e70c) {
    dragContext["isPanning"] = !![];
    dragContext["panActivated"] = ![];
    dragContext["panStartX"] = _0x17aedc;
    dragContext["panStartY"] = _0x51646d;
    dragContext["panStartViewportX"] = _0x410f30['x'];
    dragContext["panStartViewportY"] = _0x410f30['y'];
    dragContext["panStartZoom"] = _0x410f30["zoom"];
    dragContext['panStartPerf'] = 0x0;
    dragContext["panMoveCount"] = 0x0;
    dragContext["panMinimapPreviewCount"] = 0x0;
    return;
  }
  if (dragController["tryStartNodeDrag"](dragContext, _0x17aedc, _0x51646d, _0xb77214, _0x32f507, _0x320507, _0x2ddc4e)) {
    dragContext["isDragging"] && beginDragFpsSession("node-drag");
    return;
  }
  if (!_0x55e70c && !_0x2ddc4e?.["ctrlKey"]) {
    selectionController["startBoxSelecting"](dragContext, _0x17aedc, _0x51646d);
    return;
  }
}
function _activateCanvasPanIfNeeded(_0x3b15bd, _0x43fbfc) {
  if (!dragContext["isPanning"]) {
    return ![];
  }
  if (dragContext["panActivated"]) {
    return !![];
  }
  const _0x12be48 = _0x3b15bd - dragContext["panStartX"];
  const _0x3833e6 = _0x43fbfc - dragContext["panStartY"];
  if (Math["hypot"](_0x12be48, _0x3833e6) < PAN_ACTIVATION_DISTANCE_PX) {
    return ![];
  }
  const _0x5869e5 = {
    'x': dragContext["panStartViewportX"],
    'y': dragContext["panStartViewportY"],
    'zoom': dragContext["panStartZoom"]
  };
  dragContext["panActivated"] = !![];
  dragContext["panStartPerf"] = nowMs();
  dragContext["panMinimapPreviewCount"] = Number(window["_v2GetMinimapPreviewFlushCount"]?.()) || 0x0;
  markViewportInteractionBusyForRenderer();
  holdViewportMediaPreloadsForPan();
  beginPanFpsSession("canvas-pan");
  beginViewportPanPreview(_0x5869e5);
  window['_v2ScheduleMinimapViewportPreview']?.(_0x5869e5, {
    'force': !![]
  });
  document["body"]["classList"]["add"]('is-panning');
  _setEdgeInteractionLite(_shouldUseEdgeInteractionLite(getStateRaw()));
  return !![];
}
function _handlePointerMoveImpl(_0x57d341, _0x18d124, _0x34abde = ![], _0x5bccef = null) {
  const _0x911f5d = lastMouseScreenX;
  const _0x147fcc = lastMouseScreenY;
  lastMouseScreenX = _0x57d341;
  lastMouseScreenY = _0x18d124;
  if (dragContext["isPanning"]) {
    if (!_activateCanvasPanIfNeeded(_0x57d341, _0x18d124)) {
      return;
    }
    const _0x31698b = _0x57d341 - dragContext["panStartX"];
    const _0x1b8347 = _0x18d124 - dragContext["panStartY"];
    const _0x1a964f = {
      'x': dragContext["panStartViewportX"] + _0x31698b,
      'y': dragContext["panStartViewportY"] + _0x1b8347,
      'zoom': dragContext["panStartZoom"]
    };
    dragContext["panMoveCount"] = (dragContext['panMoveCount'] || 0x0) + 0x1;
    updateViewportPanPreview(_0x1a964f['x'], _0x1a964f['y'], _0x1a964f["zoom"]);
    window["_v2ScheduleMinimapViewportPreview"]?.(_0x1a964f);
    return;
  }
  dragContext["assistPanActive"] && !_0x34abde && _commitAssistPanPreview();
  let _0x25624d = getStateRaw();
  let {
    viewport: _0x1d1b5a,
    nodes: _0x2cae92
  } = _0x25624d;
  if ((dragContext["isDragging"] || dragContext["isConnecting"]) && _0x34abde) {
    stopAutoPan();
    if (!dragContext['assistPanActive']) {
      flushViewportUpdate();
      _0x25624d = getStateRaw();
      ({
        viewport: _0x1d1b5a,
        nodes: _0x2cae92
      } = _0x25624d);
      const _0x50e6c3 = {
        ..._0x1d1b5a
      };
      dragContext['assistPanActive'] = !![];
      dragContext['assistPanViewport'] = _0x50e6c3;
      holdViewportMediaPreloadsForPan();
      beginViewportPanPreview(_0x50e6c3);
      window['_v2ScheduleMinimapViewportPreview']?.(_0x50e6c3, {
        'force': !![]
      });
    }
    const _0x34a533 = _0x57d341 - _0x911f5d;
    const _0x406441 = _0x18d124 - _0x147fcc;
    const _0x4f3ad9 = dragContext['assistPanViewport'] || _0x1d1b5a;
    const _0x1730de = {
      ..._0x4f3ad9,
      'x': _0x4f3ad9['x'] + _0x34a533,
      'y': _0x4f3ad9['y'] + _0x406441,
      'zoom': _0x4f3ad9["zoom"]
    };
    dragContext["assistPanViewport"] = _0x1730de;
    updateViewportPanPreview(_0x1730de['x'], _0x1730de['y'], _0x1730de["zoom"]);
    scheduleAssistPanStoreMirror(_0x1730de);
    window['_v2ScheduleMinimapViewportPreview']?.(_0x1730de);
    const {
      x: _0x58cd76,
      y: _0x135898
    } = screenToWorld(_0x57d341, _0x18d124, _0x1730de);
    if (dragContext["isConnecting"]) {
      edgeController["updateHandleConnect"](dragContext, _0x57d341, _0x18d124, _0x58cd76, _0x135898, _0x1730de, _0x2cae92, _0x25624d["connOverlay"]);
      return;
    }
    const _0x1d0684 = {
      ..._0x25624d,
      'viewport': _0x1730de
    };
    dragController["updateDraggingNodes"](dragContext, _0x57d341, _0x18d124, _0x58cd76, _0x135898, _0x58cd76, _0x135898, _0x1d0684);
    return;
  }
  let {
    x: _0x2be4f7,
    y: _0x20f16
  } = screenToWorld(_0x57d341, _0x18d124, _0x1d1b5a);
  const _0x243147 = _0x2be4f7;
  const _0x3fb546 = _0x20f16;
  if (edgeCuttingController['handlePointerMove']({
    'e': _0x5bccef,
    'worldX': _0x2be4f7,
    'worldY': _0x20f16
  })) {
    return;
  }
  if (dragContext["isConnecting"]) {
    edgeController["updateHandleConnect"](dragContext, _0x57d341, _0x18d124, _0x2be4f7, _0x20f16, _0x1d1b5a, _0x2cae92, _0x25624d["connOverlay"]);
    return;
  }
  if (dragContext["isBoxSelecting"]) {
    selectionController["updateBoxSelecting"](dragContext, _0x57d341, _0x18d124);
    return;
  }
  if (dragContext["isDraggingCell"]) {
    dragController["updateDraggingCell"](dragContext, _0x57d341, _0x18d124, _0x2be4f7, _0x20f16, _0x2cae92);
    return;
  }
  if (!dragContext["isDragging"]) {
    return;
  }
  dragController["updateDraggingNodes"](dragContext, _0x57d341, _0x18d124, _0x2be4f7, _0x20f16, _0x243147, _0x3fb546, _0x25624d);
  checkAutoPan(_0x57d341, _0x18d124);
}
const _sampledPointerMove = rafSampleLatest(_handlePointerMoveImpl);
export function handlePointerMove(_0x34bf7b, _0x2286e5, _0x5b3dc6 = null) {
  const _0x1d747e = _0x5b3dc6?.["__aiCanvasLeftDragHeld"] === !![];
  if (_0x5b3dc6 && _0x5b3dc6['buttons'] === 0x0 && !_0x1d747e) {
    if (dragContext["isDragging"] || dragContext['isPanning'] || dragContext["isConnecting"] || dragContext['isBoxSelecting'] || dragContext["isDraggingCell"]) {
      handlePointerUp(_0x34bf7b, _0x2286e5);
      return;
    }
  }
  if (_0x1d747e && dragContext["assistPanActive"]) {
    _sampledPointerMove["cancel"]?.();
    _handlePointerMoveImpl(_0x34bf7b, _0x2286e5, ![], _0x5b3dc6);
    return;
  }
  const _0x3bc7a4 = !!(_0x5b3dc6 && (_0x5b3dc6["buttons"] & 0x4) !== 0x0);
  const _0x1f0d4f = (dragContext["isDragging"] || dragContext['isConnecting']) && (_0x3bc7a4 || window["_spaceHeld"] === !![]);
  _sampledPointerMove(_0x34bf7b, _0x2286e5, _0x1f0d4f, _0x5b3dc6);
}
export function handlePointerUp(_0x39ec3d = 0x0, _0x2ea9ec = 0x0, _0x49dc25 = ![]) {
  if (!dragContext["isDragging"] && !dragContext["isPanning"] && !dragContext["isConnecting"] && !dragContext['isBoxSelecting'] && !dragContext['isDraggingCell']) {
    edgeCuttingController["hasActiveSession"]() && edgeCuttingController['finishSession']();
    return;
  }
  let _0x23fe65 = ![];
  const _0x5862be = !!dragContext['isPanning'];
  const _0x117bd1 = !!dragContext["isDragging"];
  const _0x3d0582 = _0x5862be && dragContext["panActivated"] === !![];
  const _0x5e43f6 = dragContext["panStartPerf"] || nowMs();
  const _0x29713f = dragContext['panMoveCount'] || 0x0;
  const _0x448fa0 = dragContext['panMinimapPreviewCount'] || 0x0;
  stopAutoPan();
  if (_0x3d0582) {
    markViewportInteractionBusyForRenderer();
    const _0x201114 = flushViewportPanPreview();
    const _0x794029 = Number(window["_v2FlushMinimapViewportPreview"]?.(_0x201114)) || Number(window["_v2GetMinimapPreviewFlushCount"]?.()) || _0x448fa0;
    endPanFpsSession("canvas-pan");
    cancelPendingViewportUpdate();
    const _0x31a05d = () => {
      _0x201114 && graphStore["updateViewport"](_0x201114['x'], _0x201114['y'], _0x201114['zoom']);
      graphStore['markViewportPersist']();
    };
    typeof graphStore["batch"] === "function" ? graphStore["batch"](_0x31a05d) : _0x31a05d();
    const _0x2b9865 = typeof graphStore["getStateRaw"] === "function" && graphStore["getStateRaw"]() || getStateRaw();
    const _0x476c47 = _0x201114 || _0x2b9865?.["viewport"] || {};
    recordCanvasPanSample({
      'durationMs': nowMs() - _0x5e43f6,
      'moveCount': _0x29713f,
      'committed': !!_0x201114,
      'nodeCount': Number['isFinite'](_0x2b9865?.['_nodeCount']) ? _0x2b9865["_nodeCount"] : Object["keys"](_0x2b9865?.['nodes'] || {})["length"],
      'edgeCount': Object["keys"](_0x2b9865?.["edges"] || {})['length'],
      'mountedNodeCount': getMountedNodeCountForPerf(),
      'minimapPreviewCount': Math["max"](0x0, _0x794029 - _0x448fa0),
      'finalX': _0x476c47['x'],
      'finalY': _0x476c47['y'],
      'finalZoom': _0x476c47['zoom']
    });
  } else {
    dragContext["assistPanActive"] ? _commitAssistPanPreview() : flushViewportUpdate();
  }
  if (dragContext["isDraggingCell"]) {
    const _0x5e8feb = dragController["finishDraggingCell"](dragContext, _0x39ec3d, _0x2ea9ec);
    _resetCellDragContext();
    if (_0x5e8feb["didAct"]) {
      _deferCommit();
    }
    return;
  }
  if (dragContext['isConnecting']) {
    _0x23fe65 = edgeController["finishHandleConnect"](dragContext, _0x39ec3d, _0x2ea9ec) || _0x23fe65;
  } else {
    if (dragContext["isBoxSelecting"]) {
      const _0x4d1899 = selectionController["finishBoxSelecting"](dragContext, _0x39ec3d, _0x2ea9ec);
      _0x23fe65 = _0x4d1899["didAct"] || _0x23fe65;
    } else {
      if (dragContext['isDragging']) {
        const _0x2add16 = dragController['finishDraggingNodes'](dragContext, _0x39ec3d, _0x2ea9ec, _0x49dc25);
        if (_0x2add16["earlyCommit"]) {
          window["_clearSnapGuideLines"]?.();
          _resetDragContext();
          releaseViewportMediaPreloadsAfterPan();
          return;
        }
        _0x23fe65 = _0x2add16['didAct'] || _0x23fe65;
      }
    }
  }
  window["_clearSnapGuideLines"]?.();
  _resetDragContext();
  if (_0x117bd1) {
    const _0x4f7b77 = getStateRaw()?.["selectedNodeIds"] || [];
    window['v2Renderer']?.["flushSelection"]?.(_0x4f7b77, {
      'settleInteraction': !![]
    });
  }
  _0x3d0582 && (releaseViewportInteractionBusyForRenderer(), releaseViewportMediaPreloadsAfterPan(), scheduleSidePlusSyncAfterPanPaint());
  if (_0x23fe65) {
    commit();
  }
}
export function handleWheel(_0x1a23c4, _0x4a081d, _0x12994, _0x188d2b) {
  zoomController["handleWheel"](_0x1a23c4, _0x4a081d, _0x12994, _0x188d2b);
}
export function handleWheelPan(_0x340ba0, _0x4847ca, _0x29e9eb) {
  return wheelPanController['handleWheelPan'](_0x340ba0, _0x4847ca, _0x29e9eb);
}
export function settleWheelZoom() {
  return zoomController["settleWheelZoom"]();
}
export function settleWheelPan() {
  return wheelPanController["settleWheelPan"]();
}
export function getDragContext() {
  return {
    ...dragContext
  };
}
export function getInteractionRenderState() {
  return {
    'isDragging': !!dragContext["isDragging"],
    'isDraggingCell': !!dragContext["isDraggingCell"],
    'isCommittingDrag': dragContext['isCommittingDrag'] === !![],
    'isPanning': !!dragContext['isPanning'] && dragContext["panActivated"] === !![],
    'assistPanActive': !!dragContext['assistPanActive'],
    'targetNodeId': dragContext["targetNodeId"] || null,
    'pendingDx': Number['isFinite'](dragContext["pendingDx"]) ? dragContext["pendingDx"] : 0x0,
    'pendingDy': Number["isFinite"](dragContext["pendingDy"]) ? dragContext["pendingDy"] : 0x0,
    'hasMoved': !!dragContext["hasMoved"],
    'wasSelectedOnDown': !!dragContext["wasSelectedOnDown"]
  };
}
export function handleDoubleClick(_0x21ded2, _0x5796ff) {
  const {
    viewport: _0x1c4950,
    nodes: _0x483666
  } = getStateRaw();
  const {
    x: _0x524508,
    y: _0x80d908
  } = screenToWorld(_0x21ded2, _0x5796ff, _0x1c4950);
  for (const _0x461ec7 of Object["values"](_0x483666)) {
    const _0x48ca6d = isPointInRect(_0x524508, _0x80d908, _0x461ec7['x'], _0x461ec7['y'], _0x461ec7['width'], _0x461ec7["height"]);
    if (_0x48ca6d) {
      return;
    }
  }
  uiStore["showPicker"](_0x21ded2, _0x5796ff, _0x524508, _0x80d908);
}
export function handleContextMenu(_0x46d994, _0x1e997f) {
  return canvasContextMenuController["handleNodeContextMenu"](_0x46d994, _0x1e997f);
}
export function cloneNodesWithEdges(_0x2a984b, _0x23bd40 = 0x10, _0x55152 = 0x10) {
  const _0x2ed207 = interactionCommandAdapter["executeCanvasCommand"]('node.duplicate', {
    'ids': _0x2a984b,
    'dx': _0x23bd40,
    'dy': _0x55152,
    'edgePolicy': "all-touching"
  });
  return _0x2ed207['ok'] ? _0x2ed207['result']?.["idMap"] || {} : {};
}
export function executeCanvasCommand(_0x119242, _0x2e6b49 = {}) {
  return interactionCommandAdapter["executeCanvasCommand"](_0x119242, _0x2e6b49);
}
export function executeCommand(_0x16e869, _0x2b6218 = {}) {
  if (interactionCommandAdapter["execute"](_0x16e869, _0x2b6218)) {
    return;
  }
  console["warn"]("Unknown command: ", _0x16e869);
}
export function isValidConnection(_0x49e8b0, _0x52c37b) {
  return a609_0x5dab6e(_0x49e8b0, _0x52c37b);
}
export function initConnectionHandles(_0x1b56e1) {
  return a609_0x31a7f7(_0x1b56e1);
}
export function initPickConnect(_0x31ae29) {
  return a609_0x1f5cae(_0x31ae29);
}
export function initCanvasContextMenu(_0x44af15) {
  if (!_0x44af15) {
    return;
  }
  _0x44af15["addEventListener"]("contextmenu", _0x1117c1 => {
    if (!isEditableTextTargetInGroupedNode(_0x1117c1["target"], getStateRaw()["nodes"])) {
      return;
    }
    _0x1117c1["__aiCanvasGroupedEditableContextMenu"] = !![];
  }, {
    'capture': !![]
  });
  function _0x1e4d99(_0x2e9922) {
    if (_0x2e9922 === "ai-text" || _0x2e9922 === "ai-image" || _0x2e9922 === "ai-video" || _0x2e9922 === "ai-audio") {
      return getAIGenerationDefaultSizeByType(_0x2e9922);
    }
    if (_0x2e9922 === "panorama-scene" || _0x2e9922 === 'panorama-360') {
      return PANORAMA_SCENE_DEFAULT_SIZE;
    }
    if (_0x2e9922 === 'storyboard-script') {
      return STORYBOARD_SCRIPT_DEFAULT_SIZE;
    }
    return getNodeDefaultSize(_0x2e9922);
  }
  function _0x476de1(_0x3c426c, _0x6540d3, _0x2312fb) {
    const _0x24e95c = _0x1e4d99(_0x3c426c["type"]);
    const _0x16e52d = _0x3c426c['type'] === "source-image" || _0x3c426c["type"] === "source-video" ? {
      'needsAutoResize': !![]
    } : {};
    executeCommand("create_node", {
      'type': _0x3c426c["type"],
      'x': _0x6540d3 - _0x24e95c["width"] / 0x2,
      'y': _0x2312fb - _0x24e95c["height"] / 0x2,
      'width': _0x24e95c["width"],
      'height': _0x24e95c["height"],
      'name': _0x3c426c["defaultName"] || _0x3c426c['label'],
      'extra': _0x16e52d
    });
  }
  function _0x49bce4(_0x49c629, _0x2468b0, _0x2d1b86 = ![]) {
    document["querySelector"]("#v2PickerOverlay")?.["remove"]();
    removeContextMenus();
    const {
      viewport: _0x2a8ab6
    } = getStateRaw();
    let _0x5ac708;
    let _0x128411;
    if (_0x2d1b86) {
      const _0xd0fc7a = getViewportScreenCenter(_0x2a8ab6, window["innerWidth"], window["innerHeight"]);
      const _0x4a54ee = screenToWorld(_0xd0fc7a['x'], _0xd0fc7a['y'], _0x2a8ab6);
      _0x5ac708 = _0x4a54ee['x'];
      _0x128411 = _0x4a54ee['y'];
    } else {
      const _0x5e8226 = screenToWorld(_0x49c629, _0x2468b0, _0x2a8ab6);
      _0x5ac708 = _0x5e8226['x'];
      _0x128411 = _0x5e8226['y'];
    }
    const _0x424255 = document["createElement"]('div');
    _0x424255['id'] = 'v2PickerOverlay';
    const _0x1de267 = getViewportScreenBounds(_0x2a8ab6, window["innerWidth"], window["innerHeight"]);
    const _0x1fe502 = Math["min"](0x1b8, Math["max"](0xdc, _0x1de267["right"] - _0x1de267["left"] - 0x18));
    const _0x1609c9 = Math['max'](_0x1de267['left'] + 0xc, Math["min"](_0x49c629, _0x1de267["right"] - _0x1fe502 - 0xc));
    const _0x491e5f = _0x1de267["top"] + 0xc;
    const _0x5b4f99 = Math['max'](_0x491e5f, Math["min"](_0x2468b0, _0x1de267['bottom'] - 0x1f4));
    const _0x53816f = document["createElement"]('div');
    _0x53816f['className'] = "v2-node-picker v2-node-menu-compact";
    _0x53816f['style']["left"] = _0x1609c9 + 'px';
    _0x53816f['style']['top'] = _0x5b4f99 + 'px';
    _0x53816f["style"]['width'] = _0x1fe502 + 'px';
    const _0x391f78 = _0x21fad6 => {
      const _0x99d2e5 = document["createElement"]('div');
      _0x99d2e5["className"] = 'v2-menu-section';
      const _0x5138a2 = document['createElement']('div');
      _0x5138a2["className"] = "v2-menu-rule";
      const _0x4a0062 = document["createElement"]("span");
      _0x4a0062['className'] = 'v2-menu-title';
      _0x4a0062["textContent"] = _0x21fad6;
      _0x99d2e5["appendChild"](_0x4a0062);
      _0x99d2e5['appendChild'](_0x5138a2);
      return _0x99d2e5;
    };
    const _0x53efed = (_0x2d7d99, _0x50936f) => {
      const _0x195be7 = document['createElement']("button");
      _0x195be7["className"] = 'v2-menu-row' + (_0x2d7d99["desc"] ? " has-desc" : '');
      const _0x121683 = document["createElement"]("div");
      _0x121683['className'] = "v2-menu-ico";
      _0x121683["replaceChildren"]();
      if (_0x2d7d99['iconEl']) {
        _0x121683["appendChild"](_0x2d7d99["iconEl"]["cloneNode"](!![]));
      }
      _0x195be7["appendChild"](_0x121683);
      const _0x2a9648 = document["createElement"]("div");
      _0x2a9648['className'] = "v2-menu-txt-wrap";
      const _0xcfdfa8 = document["createElement"]("span");
      _0xcfdfa8["className"] = "v2-menu-lbl";
      _0xcfdfa8["textContent"] = _0x2d7d99['label'];
      if (_0x2d7d99["badge"]) {
        const _0x2bc7c0 = document["createElement"]("span");
        _0x2bc7c0["textContent"] = _0x2d7d99['badge'];
        _0x2bc7c0["className"] = "v2-badge-beta";
        _0xcfdfa8["appendChild"](_0x2bc7c0);
      }
      _0x2a9648["appendChild"](_0xcfdfa8);
      if (_0x2d7d99["desc"]) {
        const _0x50d3af = document['createElement']("span");
        _0x50d3af["className"] = 'v2-menu-sub';
        _0x50d3af["textContent"] = _0x2d7d99['desc'];
        _0x2a9648["appendChild"](_0x50d3af);
      }
      _0x195be7["appendChild"](_0x2a9648);
      _0x195be7["addEventListener"]("click", _0x7cf219 => {
        _0x7cf219["stopPropagation"]();
        _0x50936f(_0x7cf219);
      });
      return _0x195be7;
    };
    const _0x6a2dee = 'var(--white-50)';
    const _0x30deab = "http://www.w3.org/2000/svg";
    const _0x52c20c = (_0x308b92, _0x249e4a) => {
      const _0x5b6c05 = document['createElementNS'](_0x30deab, "svg");
      _0x5b6c05["setAttribute"]("width", '18');
      _0x5b6c05['setAttribute']("height", '18');
      _0x5b6c05['setAttribute']('viewBox', "0 0 24 24");
      _0x5b6c05["setAttribute"]("fill", "none");
      _0x5b6c05["setAttribute"]("stroke", _0x308b92);
      _0x5b6c05["setAttribute"]('stroke-width', String(_0x249e4a));
      return _0x5b6c05;
    };
    const _0x22305f = _0x292993 => {
      const _0x1dd4ee = _0x52c20c(_0x292993, 1.8);
      const _0x1ff0c9 = document['createElementNS'](_0x30deab, "rect");
      _0x1ff0c9['setAttribute']('x', '4');
      _0x1ff0c9["setAttribute"]('y', '4');
      _0x1ff0c9["setAttribute"]("width", '16');
      _0x1ff0c9["setAttribute"]("height", '16');
      _0x1ff0c9["setAttribute"]('rx', '2');
      const _0x1e02b2 = document['createElementNS'](_0x30deab, 'path');
      _0x1e02b2["setAttribute"]('d', "M8 9h8");
      const _0xa2032f = document['createElementNS'](_0x30deab, 'path');
      _0xa2032f["setAttribute"]('d', "M8 13h6");
      const _0x2abdeb = document['createElementNS'](_0x30deab, "path");
      _0x2abdeb["setAttribute"]('d', "M15 20v-4h5");
      _0x1dd4ee["appendChild"](_0x1ff0c9);
      _0x1dd4ee['appendChild'](_0x1e02b2);
      _0x1dd4ee["appendChild"](_0xa2032f);
      _0x1dd4ee["appendChild"](_0x2abdeb);
      return _0x1dd4ee;
    };
    const _0xcecbbe = _0x4eb25c => {
      const _0x2ed191 = _0x52c20c(_0x4eb25c, 1.8);
      const _0x419325 = document["createElementNS"](_0x30deab, "circle");
      _0x419325['setAttribute']('cx', '12');
      _0x419325["setAttribute"]('cy', '12');
      _0x419325["setAttribute"]('r', "8.5");
      const _0x20d07a = document["createElementNS"](_0x30deab, 'path');
      _0x20d07a['setAttribute']('d', "M3.5 12h17");
      const _0x348baa = document["createElementNS"](_0x30deab, "path");
      _0x348baa["setAttribute"]('d', "M12 3.5c2.4 2.6 3.5 5.4 3.5 8.5S14.4 17.9 12 20.5");
      const _0x44ee06 = document["createElementNS"](_0x30deab, "path");
      _0x44ee06['setAttribute']('d', "M12 3.5C9.6 6.1 8.5 8.9 8.5 12s1.1 5.9 3.5 8.5");
      const _0x16fdc2 = document["createElementNS"](_0x30deab, "path");
      _0x16fdc2["setAttribute"]('d', "M6.1 6.1c3.4 1.8 8.4 1.8 11.8 0");
      const _0x4ed7b2 = document["createElementNS"](_0x30deab, 'path');
      _0x4ed7b2["setAttribute"]('d', "M6.1 17.9c3.4-1.8 8.4-1.8 11.8 0");
      _0x2ed191["appendChild"](_0x419325);
      _0x2ed191['appendChild'](_0x20d07a);
      _0x2ed191["appendChild"](_0x348baa);
      _0x2ed191['appendChild'](_0x44ee06);
      _0x2ed191["appendChild"](_0x16fdc2);
      _0x2ed191["appendChild"](_0x4ed7b2);
      return _0x2ed191;
    };
    const _0x497d1f = _0x72167b => {
      const _0x37cb01 = _0x52c20c(_0x72167b, 1.8);
      const _0x285138 = document['createElementNS'](_0x30deab, 'rect');
      _0x285138["setAttribute"]('x', '3');
      _0x285138["setAttribute"]('y', '4');
      _0x285138['setAttribute']('width', '18');
      _0x285138['setAttribute']("height", '16');
      _0x285138['setAttribute']('rx', '2');
      _0x37cb01['appendChild'](_0x285138);
      ['9', '14']["forEach"](_0x1703c1 => {
        const _0x43df95 = document["createElementNS"](_0x30deab, "line");
        _0x43df95['setAttribute']('x1', '3');
        _0x43df95["setAttribute"]('y1', _0x1703c1);
        _0x43df95["setAttribute"]('x2', '21');
        _0x43df95["setAttribute"]('y2', _0x1703c1);
        _0x37cb01["appendChild"](_0x43df95);
      });
      const _0x5d8795 = document["createElementNS"](_0x30deab, "line");
      _0x5d8795['setAttribute']('x1', '8');
      _0x5d8795['setAttribute']('y1', '4');
      _0x5d8795["setAttribute"]('x2', '8');
      _0x5d8795['setAttribute']('y2', '20');
      _0x37cb01['appendChild'](_0x5d8795);
      return _0x37cb01;
    };
    const _0x2df71b = _0x7b1c1e => {
      const _0x58dd72 = _0x52c20c(_0x7b1c1e, 1.8);
      const _0x25862b = document["createElementNS"](_0x30deab, 'rect');
      _0x25862b["setAttribute"]('x', '3');
      _0x25862b["setAttribute"]('y', '3');
      _0x25862b['setAttribute']("width", '18');
      _0x25862b["setAttribute"]("height", '18');
      _0x25862b["setAttribute"]('rx', '2');
      _0x58dd72['appendChild'](_0x25862b);
      ['9', '15']["forEach"](_0x2d420f => {
        const _0x1d261c = document['createElementNS'](_0x30deab, "line");
        _0x1d261c["setAttribute"]('x1', '3');
        _0x1d261c['setAttribute']('y1', _0x2d420f);
        _0x1d261c["setAttribute"]('x2', '21');
        _0x1d261c["setAttribute"]('y2', _0x2d420f);
        _0x58dd72['appendChild'](_0x1d261c);
        const _0x1b2762 = document['createElementNS'](_0x30deab, "line");
        _0x1b2762["setAttribute"]('x1', _0x2d420f);
        _0x1b2762["setAttribute"]('y1', '3');
        _0x1b2762['setAttribute']('x2', _0x2d420f);
        _0x1b2762["setAttribute"]('y2', '21');
        _0x58dd72["appendChild"](_0x1b2762);
      });
      return _0x58dd72;
    };
    const _0x4a20f1 = () => {
      const _0x4a0bf5 = _0x52c20c("var(--gold)", 1.8);
      const _0x2fbe7c = document["createElementNS"](_0x30deab, "path");
      _0x2fbe7c['setAttribute']('d', 'M14.7\x206.3a1\x201\x200\x200\x200\x200\x201.4l1.6\x201.6a1\x201\x200\x200\x200\x201.4\x200l3.77-3.77a6\x206\x200\x200\x201-7.94\x207.94l-6.91\x206.91a2.12\x202.12\x200\x200\x201-3-3l6.91-6.91a6\x206\x200\x200\x201\x207.94-7.94l-3.76\x203.76z');
      _0x4a0bf5["appendChild"](_0x2fbe7c);
      return _0x4a0bf5;
    };
    const _0x4ad6de = () => {
      const _0x4b3046 = _0x52c20c("var(--white-50)", 1.8);
      const _0x3081a1 = document["createElementNS"](_0x30deab, 'path');
      _0x3081a1['setAttribute']('d', 'M21\x2015v4a2\x202\x200\x200\x201-2\x202H5a2\x202\x200\x200\x201-2-2v-4');
      const _0x2724dc = document['createElementNS'](_0x30deab, "polyline");
      _0x2724dc['setAttribute']("points", "17 8 12 3 7 8");
      const _0x5d7d04 = document["createElementNS"](_0x30deab, "line");
      _0x5d7d04['setAttribute']('x1', '12');
      _0x5d7d04["setAttribute"]('y1', '3');
      _0x5d7d04['setAttribute']('x2', '12');
      _0x5d7d04['setAttribute']('y2', '15');
      _0x4b3046["appendChild"](_0x3081a1);
      _0x4b3046["appendChild"](_0x2724dc);
      _0x4b3046["appendChild"](_0x5d7d04);
      return _0x4b3046;
    };
    const _0x367f1f = _0x47fa97 => {
      const _0x2d372b = _0x52c20c(_0x47fa97, 1.8);
      const _0x5504ca = document["createElementNS"](_0x30deab, 'path');
      _0x5504ca['setAttribute']('d', 'M6\x203v12a3\x203\x200\x200\x200\x203\x203h12');
      const _0x3577bc = document["createElementNS"](_0x30deab, "path");
      _0x3577bc["setAttribute"]('d', 'M3\x206h12a3\x203\x200\x200\x201\x203\x203v12');
      const _0x401b57 = document["createElementNS"](_0x30deab, "path");
      _0x401b57["setAttribute"]('d', "M3 3l18 18");
      _0x2d372b["appendChild"](_0x5504ca);
      _0x2d372b["appendChild"](_0x3577bc);
      _0x2d372b["appendChild"](_0x401b57);
      return _0x2d372b;
    };
    const _0x45ad83 = _0x630633 => {
      const _0x38fd60 = _0x52c20c(_0x630633, 1.8);
      const _0x18c625 = document["createElementNS"](_0x30deab, "rect");
      _0x18c625["setAttribute"]('x', '3');
      _0x18c625['setAttribute']('y', '4');
      _0x18c625["setAttribute"]("width", '18');
      _0x18c625["setAttribute"]("height", '16');
      _0x18c625['setAttribute']('rx', '2');
      const _0xcfd244 = document["createElementNS"](_0x30deab, "path");
      _0xcfd244["setAttribute"]('d', "M3 10h18");
      const _0x5eb922 = document['createElementNS'](_0x30deab, "path");
      _0x5eb922["setAttribute"]('d', "M12 10v10");
      _0x38fd60["appendChild"](_0x18c625);
      _0x38fd60['appendChild'](_0xcfd244);
      _0x38fd60['appendChild'](_0x5eb922);
      return _0x38fd60;
    };
    const _0x2a8a27 = _0xbc3161 => {
      const _0x387d7c = _0x52c20c(_0xbc3161, 1.8);
      const _0x5d3b1a = document["createElementNS"](_0x30deab, 'rect');
      _0x5d3b1a["setAttribute"]('x', '3');
      _0x5d3b1a["setAttribute"]('y', '4');
      _0x5d3b1a['setAttribute']("width", '18');
      _0x5d3b1a['setAttribute']("height", '16');
      _0x5d3b1a['setAttribute']('rx', '2');
      const _0x23c53e = document["createElementNS"](_0x30deab, "path");
      _0x23c53e["setAttribute"]('d', "M7 8h10");
      const _0x5dcb6c = document['createElementNS'](_0x30deab, "path");
      _0x5dcb6c['setAttribute']('d', "M7 15c2.2-3 4.6-3 6.8 0 1.1 1.5 2.2 1.5 3.2 0");
      const _0x2c4c3e = document['createElementNS'](_0x30deab, "path");
      _0x2c4c3e["setAttribute"]('d', 'M14.5\x2011.5l2.5-2.5\x202\x202-2.5\x202.5-2.7.7.7-2.7z');
      _0x387d7c['appendChild'](_0x5d3b1a);
      _0x387d7c["appendChild"](_0x23c53e);
      _0x387d7c["appendChild"](_0x5dcb6c);
      _0x387d7c["appendChild"](_0x2c4c3e);
      return _0x387d7c;
    };
    const _0x4edb8c = _0xc8dc06 => {
      const _0x37914e = _0x52c20c(_0xc8dc06, 1.8);
      const _0x443209 = document["createElementNS"](_0x30deab, "circle");
      _0x443209["setAttribute"]('cx', '12');
      _0x443209["setAttribute"]('cy', '12');
      _0x443209["setAttribute"]('r', '9');
      const _0x478e95 = document["createElementNS"](_0x30deab, "path");
      _0x478e95['setAttribute']('d', "M3 12h18");
      const _0x52f987 = document["createElementNS"](_0x30deab, "path");
      _0x52f987["setAttribute"]('d', "M12 3c2.3 2.5 3.5 5.5 3.5 9S14.3 18.5 12 21");
      const _0x618c45 = document["createElementNS"](_0x30deab, "path");
      _0x618c45["setAttribute"]('d', "M12 3C9.7 5.5 8.5 8.5 8.5 12S9.7 18.5 12 21");
      _0x37914e["appendChild"](_0x443209);
      _0x37914e["appendChild"](_0x478e95);
      _0x37914e["appendChild"](_0x52f987);
      _0x37914e["appendChild"](_0x618c45);
      return _0x37914e;
    };
    const _0x16c8b0 = {
      'ai-text': () => createNodeCreationMenuIcon("ai-text", {
        'documentObject': document,
        'stroke': _0x6a2dee
      }),
      'ai-image': () => createNodeCreationMenuIcon("ai-image", {
        'documentObject': document,
        'stroke': _0x6a2dee
      }),
      'ai-video': () => createNodeCreationMenuIcon("ai-video", {
        'documentObject': document,
        'stroke': _0x6a2dee
      }),
      'ai-audio': () => createNodeCreationMenuIcon("ai-audio", {
        'documentObject': document,
        'stroke': _0x6a2dee
      }),
      'comment-note': () => _0x22305f(_0x6a2dee),
      'panorama-scene': () => _0xcecbbe(_0x6a2dee),
      'panorama-360': () => _0xcecbbe(_0x6a2dee),
      'storyboard': () => _0x2df71b(_0x6a2dee),
      'storyboard-script': () => _0x497d1f(_0x6a2dee),
      'collage': () => _0x45ad83(_0x6a2dee),
      'whiteboard': () => _0x2a8a27(_0x6a2dee),
      'web-preview': () => _0x4edb8c(_0x6a2dee),
      'media-clip': () => _0x367f1f(_0x6a2dee),
      'debug': () => _0x4a20f1()
    };
    const _0x500946 = getNodeCreationMenuSections(PICKER_NODE_CREATION_SECTION_IDS, {
      'includeDevOnly': isDevModeOn()
    });
    const _0x39d77c = document["createElement"]("div");
    _0x39d77c["className"] = 'v2-node-picker-layout';
    const _0x4c9217 = document['createElement']("div");
    _0x4c9217["className"] = "v2-node-picker-column v2-node-picker-column-primary";
    _0x4c9217["dataset"]["nodePickerColumn"] = "primary";
    const _0x5ddf59 = document["createElement"]("div");
    _0x5ddf59["className"] = "v2-node-picker-column v2-node-picker-column-function";
    _0x5ddf59["dataset"]["nodePickerColumn"] = "function";
    _0x39d77c["appendChild"](_0x4c9217);
    _0x39d77c['appendChild'](_0x5ddf59);
    _0x53816f["appendChild"](_0x39d77c);
    _0x500946["forEach"](_0x3098d4 => {
      const _0x36bf4b = document["createElement"]("section");
      _0x36bf4b["className"] = "v2-node-picker-section v2-node-menu-section";
      _0x36bf4b["dataset"]["nodePickerSection"] = _0x3098d4['id'];
      _0x36bf4b["appendChild"](_0x391f78(_0x3098d4["label"]));
      _0x3098d4["items"]["forEach"](_0x368429 => {
        const _0x328c24 = _0x1e4d99(_0x368429["type"]);
        _0x36bf4b["appendChild"](_0x53efed({
          'key': _0x368429["type"],
          'label': _0x368429["label"],
          'w': _0x328c24["width"],
          'h': _0x328c24["height"],
          'badge': _0x368429["badge"],
          'desc': _0x368429["subtitle"],
          'iconEl': _0x16c8b0[_0x368429["type"]]?.()
        }, () => {
          _0x424255["remove"]();
          _0x476de1(_0x368429, _0x5ac708, _0x128411);
        }));
      });
      const _0x5a7073 = _0x3098d4['id'] === "function" ? _0x5ddf59 : _0x4c9217;
      _0x5a7073['appendChild'](_0x36bf4b);
    });
    const _0x47151b = document['createElement']("section");
    _0x47151b['className'] = "v2-node-picker-section v2-node-menu-section";
    _0x47151b['dataset']["nodePickerSection"] = "resource";
    _0x47151b["appendChild"](_0x391f78(t('canvasInteraction.contextMenu.addResource')));
    _0x47151b['appendChild'](_0x53efed({
      'label': NODE_CREATION_UPLOAD_ITEM["label"],
      'desc': NODE_CREATION_UPLOAD_ITEM["subtitle"],
      'iconBg': "var(--white-05)",
      'iconEl': _0x4ad6de()
    }, () => {
      _0x424255["remove"]();
      openCanvasUploadAt(_0x49c629, _0x2468b0);
    }));
    _0x4c9217["appendChild"](_0x47151b);
    _0x424255["appendChild"](_0x53816f);
    document['body']["appendChild"](_0x424255);
    const _0x479cd7 = _0x53816f['getBoundingClientRect']();
    const _0x114d31 = Math["max"](_0x491e5f, _0x1de267['bottom'] - _0x479cd7["height"] - 0xc);
    const _0x378947 = Number["parseFloat"](_0x53816f["style"]["top"]) || _0x2468b0;
    _0x53816f["style"]["top"] = Math["min"](Math['max'](_0x491e5f, _0x378947), _0x114d31) + 'px';
    _0x424255["addEventListener"]("click", () => _0x424255["remove"]());
  }
  _0x44af15["addEventListener"]("dblclick", _0x265235 => {
    if (_0x265235["target"]["closest"](".v2-node")) {
      return;
    }
    _0x265235["preventDefault"]();
    _0x265235['stopPropagation']();
    _0x49bce4(_0x265235['clientX'], _0x265235["clientY"]);
  });
  _0x44af15["addEventListener"]("contextmenu", _0x301a54 => {
    if (_0x301a54["defaultPrevented"]) {
      return;
    }
    const _0x24bc43 = _0x301a54['target']["closest"](".v2-node");
    const _0x5afc7a = _0x301a54["target"]["closest"]('.v2-canvas-stage');
    if (!_0x24bc43 && !_0x5afc7a) {
      return;
    }
    const _0x185d32 = getEditableTextTarget(_0x301a54["target"]);
    if (!_0x185d32 && _0x301a54["target"]["closest"](TEXT_CONTEXT_MENU_TARGET_SELECTOR)) {
      return;
    }
    _0x301a54["preventDefault"]();
    _0x301a54["stopPropagation"]();
    const _0x41c26e = window['getSelection']();
    if (!_0x24bc43 && _0x41c26e && !_0x41c26e["isCollapsed"]) {
      try {
        _0x41c26e["removeAllRanges"]();
      } catch {}
    }
    const _0x2d2cfa = _0x41c26e ? _0x41c26e["toString"]()["trim"]() : '';
    let _0x53f1c2 = ![];
    if (_0x41c26e && _0x2d2cfa && _0x41c26e["rangeCount"] > 0x0 && !_0x41c26e["isCollapsed"]) {
      const _0x21628f = _0x301a54["target"];
      for (let _0x51d924 = 0x0; _0x51d924 < _0x41c26e['rangeCount']; _0x51d924++) {
        const _0x70e067 = _0x41c26e['getRangeAt'](_0x51d924);
        try {
          if (_0x70e067["intersectsNode"](_0x21628f)) {
            _0x53f1c2 = !![];
            break;
          }
        } catch {}
      }
    }
    if (_0x2d2cfa && _0x53f1c2) {
      canvasContextMenuController["handleTextContextMenu"](_0x301a54["clientX"], _0x301a54["clientY"], _0x2d2cfa, {
        'anchorNodeId': _0x24bc43?.["dataset"]?.["nodeId"] || _0x24bc43?.['id'] || null,
        'pasteTarget': _0x185d32,
        'pasteSelection': _0x185d32 ? captureEditableSelection(_0x185d32) : null
      });
      return;
    }
    if (_0x185d32) {
      showTextInputContextMenu({
        'target': _0x185d32,
        'screenX': _0x301a54["clientX"],
        'screenY': _0x301a54["clientY"],
        'snapshot': captureEditableSelection(_0x185d32)
      });
      return;
    }
    if (_0x24bc43) {
      handleContextMenu(_0x301a54['clientX'], _0x301a54['clientY']);
      return;
    }
    canvasContextMenuController["showCanvasContextMenu"](_0x301a54['clientX'], _0x301a54['clientY']);
  });
  initCanvasContextMenu["_showPicker"] = _0x49bce4;
}
export function handleTextContextMenu(_0xdc3c33, _0x2127e1, _0x30047d, _0x367e6d = {}) {
  return canvasContextMenuController["handleTextContextMenu"](_0xdc3c33, _0x2127e1, _0x30047d, _0x367e6d);
}