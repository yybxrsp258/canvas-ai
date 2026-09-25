import { isNodeType } from '../modules/registry.js';
export const NODE_DETAIL_DEFERRED_CLASS = 'v2-node-detail-deferred';
const NODE_DETAIL_LOW_ZOOM_THRESHOLD = 0.45;
const NODE_DETAIL_DEFERRED_STAGE = "deferred";
const NODE_DETAIL_HYDRATED_STAGE = "hydrated";
const NODE_DETAIL_HYDRATION_BATCH_SIZE = 0x2;
const NODE_DETAIL_DEFER_VISIBLE_COUNT = 0x20;
const NODE_DETAIL_DEFER_GENERATION_MEDIA_NODE_COUNT = 0x78;
const NODE_DETAIL_HYDRATION_BUSY_RETRY_MS = 0x78;
const NODE_DETAIL_HYDRATION_FALLBACK_MS = 0x30;
const NODE_DETAIL_HYDRATION_IDLE_TIMEOUT_MS = 0xb4;
export function createNodeDetailHydrationController({
  getWrapper: _0x3cf9dc,
  getParkedWrapper: _0x338ccc,
  getWrappers: _0x316ac3,
  getParkedWrappers: _0x182c9d,
  isMounted: _0x565eed,
  isInteractionBusy: _0xaaf70e,
  onHydrateNodeDetails: _0x5437b6,
  isVideoNodeDetails: _0x1e1133,
  canHydrateVideoDetails: _0x45d9d4
} = {}) {
  let _0x424c4e = [];
  let _0x34dbfb = new Set();
  let _0x3cdec4 = null;
  let _0x4e0bea = '';
  let _0x6a6180 = ![];
  function _0x35a678() {
    if (_0x3cdec4 === null) {
      return;
    }
    if (_0x4e0bea === "idle" && typeof cancelIdleCallback === 'function') {
      cancelIdleCallback(_0x3cdec4);
    } else {
      _0x4e0bea === "timeout" && clearTimeout(_0x3cdec4);
    }
    _0x3cdec4 = null;
    _0x4e0bea = '';
  }
  function _0x3c0339(_0x3a7ebf, _0x29f7e5 = _0x3cf9dc?.(_0x3a7ebf)) {
    if (!_0x3a7ebf || !_0x29f7e5 || _0x6a6180) {
      return;
    }
    const _0x25de3f = _0x29f7e5["classList"]["contains"](NODE_DETAIL_DEFERRED_CLASS) || _0x29f7e5["dataset"]?.['detailStage'] === NODE_DETAIL_DEFERRED_STAGE;
    if (!_0x25de3f && _0x29f7e5["dataset"]?.["detailStage"] === NODE_DETAIL_HYDRATED_STAGE) {
      return;
    }
    _0x34dbfb['delete'](_0x3a7ebf);
    _0x29f7e5["classList"]['remove'](NODE_DETAIL_DEFERRED_CLASS);
    if (_0x29f7e5['dataset']) {
      _0x29f7e5["dataset"]["detailStage"] = NODE_DETAIL_HYDRATED_STAGE;
    }
    _0x5437b6?.(_0x3a7ebf, _0x29f7e5);
  }
  function _0x5b2bf0(_0x97bd51) {
    return _0x97bd51?.['classList']?.["contains"]?.(NODE_DETAIL_DEFERRED_CLASS) || _0x97bd51?.["dataset"]?.["detailStage"] === NODE_DETAIL_DEFERRED_STAGE;
  }
  function _0x4b7d04() {
    if (_0x6a6180 || _0x3cdec4 !== null) {
      return;
    }
    if (_0xaaf70e?.()) {
      _0x4e0bea = "timeout";
      _0x3cdec4 = setTimeout(() => _0x2c1f39(), NODE_DETAIL_HYDRATION_BUSY_RETRY_MS);
      return;
    }
    if (_0x424c4e['length'] >= NODE_DETAIL_HYDRATION_BATCH_SIZE * 0x3) {
      _0x4e0bea = "timeout";
      _0x3cdec4 = setTimeout(() => _0x2c1f39(), NODE_DETAIL_HYDRATION_FALLBACK_MS);
      return;
    }
    if (typeof requestIdleCallback === "function") {
      _0x4e0bea = "idle";
      _0x3cdec4 = requestIdleCallback(_0x2c1f39, {
        'timeout': NODE_DETAIL_HYDRATION_IDLE_TIMEOUT_MS
      });
      return;
    }
    _0x4e0bea = 'timeout';
    _0x3cdec4 = setTimeout(() => _0x2c1f39(), NODE_DETAIL_HYDRATION_FALLBACK_MS);
  }
  function _0x2c1f39(_0x39316e = null) {
    _0x3cdec4 = null;
    _0x4e0bea = '';
    if (_0x6a6180) {
      return;
    }
    if (_0xaaf70e?.()) {
      _0x4b7d04();
      return;
    }
    let _0x37077e = 0x0;
    const _0x21611b = () => {
      if (!_0x39316e || _0x39316e['didTimeout']) {
        return !![];
      }
      if (typeof _0x39316e["timeRemaining"] !== 'function') {
        return !![];
      }
      return _0x39316e["timeRemaining"]() > 0x2;
    };
    while (_0x424c4e["length"] > 0x0 && _0x37077e < NODE_DETAIL_HYDRATION_BATCH_SIZE && _0x21611b()) {
      const _0x3aa55a = _0x424c4e["findIndex"](_0x204f84 => {
        if (!_0x34dbfb["has"](_0x204f84)) {
          return !![];
        }
        if (typeof _0x1e1133 !== "function" || !_0x1e1133(_0x204f84)) {
          return !![];
        }
        return typeof _0x45d9d4 !== "function" || _0x45d9d4(_0x204f84) === !![];
      });
      if (_0x3aa55a < 0x0) {
        break;
      }
      const [_0x4cc110] = _0x424c4e["splice"](_0x3aa55a, 0x1);
      if (!_0x34dbfb["delete"](_0x4cc110)) {
        continue;
      }
      const _0x557ab6 = _0x3cf9dc?.(_0x4cc110);
      if (!_0x557ab6 || !_0x565eed?.(_0x4cc110) || !_0x557ab6["isConnected"]) {
        continue;
      }
      const _0x50489d = _0x1e1133?.(_0x4cc110) === !![];
      _0x3c0339(_0x4cc110, _0x557ab6);
      _0x37077e += 0x1;
      if (_0x50489d) {
        break;
      }
    }
    if (_0x424c4e["length"] > 0x0) {
      _0x4b7d04();
    }
  }
  function _0x4449cd(_0x176b3c) {
    if (!_0x176b3c || _0x34dbfb["has"](_0x176b3c)) {
      return;
    }
    _0x34dbfb["add"](_0x176b3c);
    _0x424c4e["push"](_0x176b3c);
    _0x4b7d04();
  }
  function _0x2b7369() {
    _0x6a6180 = ![];
    if (_0x424c4e["length"] === 0x0) {
      return;
    }
    _0x4b7d04();
  }
  function _0x80105e(_0x552373, _0x55c832, {
    autoHydrate = !![]
  } = {}) {
    if (!_0x552373 || !_0x55c832) {
      return;
    }
    _0x552373["classList"]['add'](NODE_DETAIL_DEFERRED_CLASS);
    if (_0x552373["dataset"]) {
      _0x552373["dataset"]["detailStage"] = NODE_DETAIL_DEFERRED_STAGE;
    }
    if (autoHydrate) {
      _0x4449cd(_0x55c832);
    } else {
      _0x34dbfb["delete"](_0x55c832);
    }
  }
  function _0x5388f8(_0x2b98c0, {
    removeClass = !![]
  } = {}) {
    if (!_0x2b98c0) {
      return;
    }
    _0x34dbfb['delete'](_0x2b98c0);
    const _0x2c42a0 = _0x3cf9dc?.(_0x2b98c0) || _0x338ccc?.(_0x2b98c0);
    removeClass && _0x2c42a0 && (_0x2c42a0["classList"]["remove"](NODE_DETAIL_DEFERRED_CLASS), _0x2c42a0["dataset"] && _0x2c42a0["dataset"]['detailStage'] && delete _0x2c42a0["dataset"]["detailStage"]);
  }
  function _0x575a26() {
    _0x35a678();
    _0x424c4e = [];
    _0x34dbfb = new Set();
    for (const _0x4e0f0c of _0x316ac3?.() || []) {
      _0x4e0f0c?.['classList']?.["remove"]?.(NODE_DETAIL_DEFERRED_CLASS);
      _0x4e0f0c?.['dataset'] && _0x4e0f0c["dataset"]['detailStage'] && delete _0x4e0f0c["dataset"]["detailStage"];
    }
    for (const _0x521ae0 of _0x182c9d?.() || []) {
      _0x521ae0?.['classList']?.["remove"]?.(NODE_DETAIL_DEFERRED_CLASS);
      _0x521ae0?.["dataset"] && _0x521ae0["dataset"]["detailStage"] && delete _0x521ae0["dataset"]["detailStage"];
    }
  }
  function _0x2a3b0c({
    node: _0x1b91c1,
    nodeId: _0x5a331a,
    isSelected: _0x3cd142,
    connOverlay: _0x52e5f2,
    pickMode: _0x1491e1,
    relatedNodeIds: _0x3b6031
  } = {}) {
    if (_0x3cd142) {
      return !![];
    }
    if (_0x3b6031?.["has"]?.(_0x5a331a)) {
      return !![];
    }
    if (_0x52e5f2?.["srcId"] === _0x5a331a || _0x52e5f2?.["hoverId"] === _0x5a331a) {
      return !![];
    }
    if (_0x1491e1?.["sourceNodeId"] === _0x5a331a || _0x1491e1?.["hoverNodeId"] === _0x5a331a) {
      return !![];
    }
    return !!(_0x1b91c1?.["isImagesExpanded"] || _0x1b91c1?.["isVideosExpanded"]);
  }
  function _0x1e6e58({
    node: _0x3c6422,
    nodeId: _0x9bdf05,
    isSelected: _0x580a1a,
    connOverlay: _0x2e1b98,
    pickMode: _0x1b0b77,
    relatedNodeIds: _0x4f853e,
    viewport: _0x482e9f,
    mountCandidateCount: _0x57c8fb,
    nodeCount = 0x0,
    forceDeferActiveNodeDetails = ![]
  } = {}) {
    if (!_0x3c6422?.['id']) {
      return ![];
    }
    if (isNodeType(_0x3c6422, ['group', "comment-note", "web-preview"])) {
      return ![];
    }
    if (forceDeferActiveNodeDetails) {
      return !![];
    }
    if (_0x2a3b0c({
      'node': _0x3c6422,
      'nodeId': _0x9bdf05,
      'isSelected': _0x580a1a,
      'connOverlay': _0x2e1b98,
      'pickMode': _0x1b0b77,
      'relatedNodeIds': _0x4f853e
    })) {
      return ![];
    }
    const _0x3ab8f4 = Number["isFinite"](_0x482e9f?.["zoom"]) ? _0x482e9f["zoom"] : 0x1;
    return Number(nodeCount || 0x0) >= NODE_DETAIL_DEFER_GENERATION_MEDIA_NODE_COUNT && isNodeType(_0x3c6422, ["ai-video", "ai-audio"]) || _0x3ab8f4 <= NODE_DETAIL_LOW_ZOOM_THRESHOLD || Number(_0x57c8fb || 0x0) >= NODE_DETAIL_DEFER_VISIBLE_COUNT;
  }
  function _0x265072({
    wrapperEl: _0x1b2e7d,
    node: _0x48e9cc,
    nodeId: _0x2a886c,
    isSelected: _0x583f2c,
    connOverlay: _0x3ba5df,
    pickMode: _0x12def7,
    relatedNodeIds: _0x621881,
    viewport: _0x3969b6,
    mountCandidateCount: _0x3093d4,
    nodeCount = 0x0,
    autoHydrate = !![],
    deferHydrate = ![],
    forceDeferActiveNodeDetails = ![]
  } = {}) {
    if (!_0x1b2e7d || !_0x2a886c) {
      return;
    }
    const _0x261d88 = _0x1e6e58({
      'node': _0x48e9cc,
      'nodeId': _0x2a886c,
      'isSelected': _0x583f2c,
      'connOverlay': _0x3ba5df,
      'pickMode': _0x12def7,
      'relatedNodeIds': _0x621881,
      'viewport': _0x3969b6,
      'mountCandidateCount': _0x3093d4,
      'nodeCount': nodeCount,
      'forceDeferActiveNodeDetails': forceDeferActiveNodeDetails
    });
    const _0x5ad995 = _0x2a3b0c({
      'node': _0x48e9cc,
      'nodeId': _0x2a886c,
      'isSelected': _0x583f2c,
      'connOverlay': _0x3ba5df,
      'pickMode': _0x12def7,
      'relatedNodeIds': _0x621881
    });
    if (_0x261d88) {
      _0x80105e(_0x1b2e7d, _0x2a886c, {
        'autoHydrate': autoHydrate
      });
    } else {
      if (_0x5ad995) {
        _0x3c0339(_0x2a886c, _0x1b2e7d);
      } else {
        deferHydrate && _0x5b2bf0(_0x1b2e7d) ? _0x4449cd(_0x2a886c) : _0x3c0339(_0x2a886c, _0x1b2e7d);
      }
    }
  }
  return {
    'pause': () => {
      _0x6a6180 = !![];
      _0x35a678();
    },
    'clearNodeDetailHydrationState': _0x575a26,
    'enqueueNodeDetailHydration': _0x4449cd,
    'forgetNodeDetailHydration': _0x5388f8,
    'hydrateNodeDetails': _0x3c0339,
    'isNodeDetailActive': _0x2a3b0c,
    'resumeNodeDetailHydration': _0x2b7369,
    'shouldDeferNodeDetails': _0x1e6e58,
    'syncNodeDetailMountStage': _0x265072
  };
}