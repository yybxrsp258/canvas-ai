const GRAPH_STATE_KEYS = Object["freeze"](["viewport", 'nodes', "_nodeCount", "_nodesRev", '_nodeGeometryRev', "_sourceVideoRev", '_renderRequestRev', '_persistRev', "_contentPersistRev", "_edgesRev", "_parentToChildren", 'edges', 'selectionBox', "selectionMeta", "selectedNodeIds", "connOverlay"]);
const UI_STATE_KEYS = Object["freeze"](["isServerConnected", "picker", "contextMenu", "pickConnectMode", "annotate", "matting", "videoKeying", "videoClip", "theme", 'ui']);
const WORKSPACE_STATE_KEYS = Object['freeze'](['subscription', "modelCatalog", "assets", "storyboard3dProjects", "workflows", "workflowUi"]);
function pickStateKeys(_0x465739, _0x557af5) {
  if (!_0x465739 || typeof _0x465739 !== "object") {
    return {};
  }
  const _0x35edf3 = {};
  for (const _0x305e6b of _0x557af5) {
    Object["prototype"]["hasOwnProperty"]["call"](_0x465739, _0x305e6b) && (_0x35edf3[_0x305e6b] = _0x465739[_0x305e6b]);
  }
  return _0x35edf3;
}
function selectGraphState(_0x4447f1) {
  return pickStateKeys(_0x4447f1, GRAPH_STATE_KEYS);
}
function selectUiState(_0xc26ecb) {
  return pickStateKeys(_0xc26ecb, UI_STATE_KEYS);
}
function selectWorkspaceState(_0x4a4dd8) {
  return pickStateKeys(_0x4a4dd8, WORKSPACE_STATE_KEYS);
}
export { GRAPH_STATE_KEYS, UI_STATE_KEYS, WORKSPACE_STATE_KEYS, selectGraphState, selectUiState, selectWorkspaceState };