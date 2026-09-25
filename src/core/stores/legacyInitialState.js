import { normalizeImageToolbarLayout } from '../../modules/imageToolbarLayoutMemory.js';
import { normalizeVideoToolbarLayout } from '../../modules/videoToolbarLayoutMemory.js';
import { DEFAULT_CANVAS_TOOLBAR_PLACEMENT } from '../../modules/canvasToolbarPlacement.js';
import { DEFAULT_NODE_MANAGER_PLACEMENT } from '../../modules/nodeManager/nodeManagerPlacement.js';
export function createInitialWorkflowDraftState() {
  return {
    'name': '',
    'cover': '',
    'tags': [],
    'note': '',
    'selectedCoverId': null
  };
}
export function createInitialWorkflowUiState() {
  return {
    'panelOpen': ![],
    'panelPinned': ![],
    'searchKeyword': '',
    'detailWorkflowId': null,
    'hoverWorkflowId': null,
    'modalOpen': ![],
    'modalTab': "create",
    'sourceGroupId': null,
    'draft': createInitialWorkflowDraftState(),
    'tagDraft': '',
    'updateTargetId': null,
    'updateSearchKeyword': '',
    'updateConfirmOpen': ![],
    'saving': ![],
    'applyingWorkflowId': null,
    'error': null
  };
}
export function createInitialState() {
  return {
    'viewport': {
      'x': 0x0,
      'y': 0x0,
      'zoom': 1.1
    },
    'isServerConnected': !![],
    'nodes': {},
    '_nodeCount': 0x0,
    '_nodeMembershipRev': 0x0,
    '_nodesRev': 0x0,
    '_nodeGeometryRev': 0x0,
    '_sourceVideoRev': 0x0,
    '_renderRequestRev': 0x0,
    '_persistRev': 0x0,
    '_contentPersistRev': 0x0,
    '_edgesRev': 0x0,
    '_parentToChildren': {},
    'edges': {},
    'picker': {
      'visible': ![],
      'x': 0x0,
      'y': 0x0,
      'screenX': 0x0,
      'screenY': 0x0
    },
    'selectionBox': {
      'active': ![],
      'x1': 0x0,
      'y1': 0x0,
      'x2': 0x0,
      'y2': 0x0
    },
    'selectionMeta': {
      'source': null
    },
    'selectedNodeIds': [],
    'contextMenu': {
      'visible': ![],
      'x': 0x0,
      'y': 0x0,
      'items': []
    },
    'connOverlay': {
      'srcId': null,
      'invalidNodeIds': [],
      'hoverId': null,
      'side': null
    },
    'pickConnectMode': {
      'active': ![],
      'sourceNodeId': null,
      'handleDirection': null
    },
    'annotate': {
      'active': ![],
      'nodeId': null,
      'tool': "brush",
      'color': "red",
      'brushSizePx': 0x28
    },
    'matting': {
      'active': ![],
      'nodeId': null,
      'tool': "brush",
      'color': "red",
      'brushSizePx': 0x28
    },
    'videoKeying': {
      'active': ![],
      'nodeId': null,
      'pos_points': [],
      'neg_points': []
    },
    'videoClip': {
      'active': ![],
      'nodeId': null
    },
    'theme': "dark",
    'ui': {
      'showVideoMeta': ![],
      'showSelectionMediaProperties': !![],
      'titleFollowsCanvasZoom': ![],
      'promptBoxResizeEnabled': !![],
      'promptEnterBehavior': "submit",
      'promptAttachmentButtonHidden': !![],
      'promptPresetButtonHidden': ![],
      'videoAudioDefaultEnabled': ![],
      'canvasToolbarPlacement': DEFAULT_CANVAS_TOOLBAR_PLACEMENT,
      'nodeManagerPlacement': DEFAULT_NODE_MANAGER_PLACEMENT,
      'leftSidebarAutoHideEnabled': ![],
      'bottomLeftBarAutoHideEnabled': ![],
      'imageVideoNodeResizeEnabled': ![],
      'imageToolbarLayout': normalizeImageToolbarLayout(),
      'videoToolbarLayout': normalizeVideoToolbarLayout(),
      'selectionRelatedHighlightEnabled': !![],
      'selectionRelatedHighlightColor': "white",
      'connectionLinesVisible': !![],
      'connectionLineStyle': 'curve',
      'alignFeatureEnabled': !![],
      'alignFeatureTriggerMode': "click",
      'alignDistributeGap': 0x28,
      'alignPanelVisible': ![],
      'alignPanelAnchorWorld': null,
      'snapGuidesEnabled': !![],
      'featureSelections': {}
    },
    'subscription': {
      'loading': ![],
      'status': 'none',
      'expiresAt': null,
      'entitledModelKeys': [],
      'entitledModelIds': [],
      'planCodes': [],
      'planNames': [],
      'licensedProductCodes': [],
      'authorizationTier': 'annual-vip',
      'error': null,
      'lastSyncAt': 0x0,
      'contactText': '',
      'contactUrl': '',
      'contactWechat': ''
    },
    'modelCatalog': {
      'provider': 'binghuo',
      'status': "idle",
      'source': "none",
      'sourceId': '',
      'version': null,
      'etag': '',
      'modelCount': 0x0,
      'executionCount': 0x0,
      'lastLoadedAt': 0x0,
      'lastSyncAt': 0x0,
      'error': null
    },
    'assets': [],
    'storyboard3dProjects': [],
    'workflows': {
      'items': [],
      'loading': ![],
      'error': null,
      'loadedAt': 0x0
    },
    'workflowUi': createInitialWorkflowUiState()
  };
}