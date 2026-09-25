import { selectGraphState } from './domainSlices.js';
const GRAPH_ACTION_NAMES = Object["freeze"](['getGraphMutationPolicy', 'batch', 'subscribeNodeField', "requestRender", "invalidateUi", "addNode", "updateNodePosition", "moveNodes", "moveNodesByOffsets", "deleteNodes", "updateNodeData", "updateNodesData", "swapStoryboardCells", "addEdge", 'removeEdge', "updateEdgesBatch", "updateViewport", "setViewportScreenOrigin", "setViewportPersistPolicy", "markViewportPersist", "loadState", "loadHistorySnapshot", "getHistorySnapshot", "getSourcesForNode", "setSelectionBox", "setSelectionMeta", "setSelectedNodes", "groupNodes", "getIncomingEdges", "renameNode", "clearSelection", "setConnOverlay", "clearConnOverlay", 'serialize', 'serializeNode', "hydrate", "hydrateTrustedSnapshot"]);
function bindCoreAction(_0x53a6e6, _0x3921d3) {
  const _0x540af3 = _0x53a6e6?.[_0x3921d3];
  if (typeof _0x540af3 !== 'function') {
    return undefined;
  }
  return (..._0x2732c8) => _0x540af3(..._0x2732c8);
}
function createGraphStore(_0xe6da6d) {
  if (!_0xe6da6d || typeof _0xe6da6d !== "object") {
    throw new TypeError("[graphStore] createGraphStore() 需要传入有效的 coreStore");
  }
  const _0xf002d9 = {
    'subscribe'(_0x5a3920) {
      if (typeof _0x5a3920 !== "function") {
        throw new TypeError("[graphStore] subscribe() 的参数必须是函数");
      }
      return _0xe6da6d["subscribe"](_0x50ca03 => _0x5a3920(selectGraphState(_0x50ca03)));
    },
    'subscribeRaw'(_0x2c63ed) {
      if (typeof _0x2c63ed !== "function") {
        throw new TypeError('[graphStore]\x20subscribeRaw()\x20的参数必须是函数');
      }
      return _0xe6da6d["subscribeRaw"](_0x22120c => _0x2c63ed(selectGraphState(_0x22120c)));
    },
    'subscribeSelector'(_0x5424b0, _0x1f951f, _0x5b15dc = {}) {
      if (typeof _0x5424b0 !== 'function') {
        throw new TypeError('[graphStore]\x20subscribeSelector()\x20的\x20selector\x20必须是函数');
      }
      if (typeof _0x1f951f !== "function") {
        throw new TypeError('[graphStore]\x20subscribeSelector()\x20的\x20callback\x20必须是函数');
      }
      return _0xe6da6d["subscribeSelector"](_0x1c7400 => _0x5424b0(selectGraphState(_0x1c7400)), _0x1f951f, _0x5b15dc);
    },
    'getState'() {
      return selectGraphState(_0xe6da6d['getState']());
    },
    'getStateRaw'() {
      return selectGraphState(_0xe6da6d["getStateRaw"]());
    }
  };
  for (const _0x1652fc of GRAPH_ACTION_NAMES) {
    const _0x58769d = bindCoreAction(_0xe6da6d, _0x1652fc);
    if (_0x58769d) {
      _0xf002d9[_0x1652fc] = _0x58769d;
    }
  }
  return _0xf002d9;
}
export { GRAPH_ACTION_NAMES, createGraphStore };