import { generateId } from '../math.js';
import { createNodeFieldSubscriptions } from './nodeFieldSubscriptions.js';
import { applyFeatureSelectionsToNodeData, captureFeatureSelectionsFromNodePatch, sanitizeFeatureSelectionsRecord } from '../../modules/featureSelectionMemory.js';
import { normalizeImageToolbarLayout, serializeImageToolbarLayout } from '../../modules/imageToolbarLayoutMemory.js';
import { normalizeVideoToolbarLayout, serializeVideoToolbarLayout } from '../../modules/videoToolbarLayoutMemory.js';
import { normalizeCommentNoteJumpShortcut } from '../../modules/commentNoteJumpShortcut.js';
import { sanitizeSerializedCanvasData, sanitizeNodeForPersistence } from '../../utils/thumbnailPersistence.js';
import { sanitizePromptHtml } from '../../utils/dom.js';
import { isGenerationTaskTerminalStatus, resolveJobStatusFromTaskStatus } from '../generationTaskLifecycle.js';
import { createDefaultStoryboardScriptState } from '../storyboardScriptFactory.js';
import { cloneStoryboardCellForSwap, cloneStoryboardCellForSwapDestination, isStoryboardCellEmpty, normalizeEmptyStoryboardCell, resolveStoryboardCellSourceIndex } from '../storyboardCellUtils.js';
import { cloneStoryboard3DProjects, createStoryboard3DProjectActions } from './storyboard3dProjectState.js';
import { createViewportScreenFrame } from './viewportScreenFrame.js';
import { createGenerationHistoryState } from './generationHistoryState.js';
import { planNodeMovement } from './graphMutationImpact.js';
import { sanitizeCanvasNodeMediaPatchForStore } from '../../services/canvasMediaLocalService.js';
import { createRendererStateRevisionTracker } from './rendererStateRevisions.js';
import { canAppendInputKindWithinLimit, canTargetReceiveInputs, getTargetInputPolicy, hasUsableInputNodeSource, isInputKindAllowed, resolveEffectiveInputKind } from '../../modules/modelInputPolicy.js';
import { collectGroupOutputIncomingEdges, isGroupNodeData } from '../../modules/groupDynamicOutput.js';
import { getFixedInputSlotConfigFromManifest } from '../../modules/fixedInputAssetRefs.js';
import { isModelApiModel, isWorkflowModel as a685_0x5041bd, RH_VIDEO_V54_MODEL_ID, resolveModelProvider } from '../../manifests/index.js';
import { createInitialState, createInitialWorkflowDraftState, createInitialWorkflowUiState } from './legacyInitialState.js';
import { emitNodeDeletions } from '../nodeDeletionEvents.js';
import { normalizeConnectionLineStyle } from '../edgePathGeometry.js';
import { normalizeCanvasToolbarPlacement } from '../../modules/canvasToolbarPlacement.js';
import { normalizeNodeManagerPlacement } from '../../modules/nodeManager/nodeManagerPlacement.js';
function deepClone(_0x3bfd72) {
  if (typeof structuredClone === "function") {
    try {
      return structuredClone(_0x3bfd72);
    } catch {}
  }
  return JSON["parse"](JSON['stringify'](_0x3bfd72));
}
function stripPersistedRichText(_0x133d33) {
  if (typeof _0x133d33 !== 'string') {
    return _0x133d33;
  }
  return _0x133d33['replace'](/<[^>]*>/g, '');
}
function sanitizePersistedPromptHtml(_0x377114) {
  if (typeof _0x377114 !== 'string') {
    return _0x377114;
  }
  return sanitizePromptHtml(_0x377114);
}
function cloneShallowObjectArray(_0x3b25f4) {
  if (!Array['isArray'](_0x3b25f4)) {
    return _0x3b25f4;
  }
  return _0x3b25f4["map"](_0x432d45 => _0x432d45 && typeof _0x432d45 === "object" ? {
    ..._0x432d45
  } : _0x432d45);
}
function cloneViewportSnapshot(_0x5a1e2e) {
  if (!_0x5a1e2e || typeof _0x5a1e2e !== "object") {
    return _0x5a1e2e;
  }
  return {
    ..._0x5a1e2e
  };
}
function cloneEdgeSnapshot(_0x1f04e1) {
  if (!_0x1f04e1 || typeof _0x1f04e1 !== "object") {
    return _0x1f04e1;
  }
  return {
    ..._0x1f04e1
  };
}
function cloneAssetSnapshot(_0x3dac64) {
  if (!_0x3dac64 || typeof _0x3dac64 !== 'object') {
    return _0x3dac64;
  }
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(_0x3dac64);
    } catch {}
  }
  try {
    return JSON['parse'](JSON["stringify"](_0x3dac64));
  } catch {}
  return {
    ..._0x3dac64
  };
}
function cloneWorkflowSnapshot(_0x491cf5) {
  if (!_0x491cf5 || typeof _0x491cf5 !== "object") {
    return _0x491cf5;
  }
  return deepClone(_0x491cf5);
}
function isBlobLikeUrl(_0x1f552a) {
  return typeof _0x1f552a === "string" && /^blob:/i['test'](_0x1f552a["trim"]());
}
function sanitizePanoramaStateForPersistence(_0x1b26cb) {
  if (!_0x1b26cb || typeof _0x1b26cb !== 'object') {
    return _0x1b26cb;
  }
  const _0x19b38f = deepClone(_0x1b26cb);
  _0x19b38f['ui'] && typeof _0x19b38f['ui'] === 'object' && delete _0x19b38f['ui']["isEditing"];
  _0x19b38f["panorama"] && typeof _0x19b38f["panorama"] === "object" && (delete _0x19b38f["panorama"]["isLoaded"], delete _0x19b38f["panorama"]["error"], isBlobLikeUrl(_0x19b38f["panorama"]["imageUrl"]) && delete _0x19b38f["panorama"]["imageUrl"], isBlobLikeUrl(_0x19b38f["panorama"]["localPath"]) && delete _0x19b38f["panorama"]["localPath"]);
  _0x19b38f["capture"] && typeof _0x19b38f["capture"] === 'object' && (delete _0x19b38f["capture"]['pending'], delete _0x19b38f["capture"]['error'], delete _0x19b38f["capture"]["lastCaptureAt"]);
  return _0x19b38f;
}
function sanitizePanoramaStateForHistory(_0x36217b) {
  const _0x4c190c = sanitizePanoramaStateForPersistence(_0x36217b);
  if (!_0x4c190c || typeof _0x4c190c !== "object") {
    return _0x4c190c;
  }
  delete _0x4c190c['viewport'];
  return _0x4c190c;
}
function cloneNodeSnapshot(_0x4e44c6, {
  stripRichText = ![],
  hydratedAt = null,
  featureSelections = null,
  stripPanoramaViewport = ![],
  preserveLiveGeneration = ![]
} = {}) {
  if (!_0x4e44c6 || typeof _0x4e44c6 !== 'object') {
    return _0x4e44c6;
  }
  const _0x24d28e = {
    ..._0x4e44c6
  };
  normalizeNodeModel(_0x24d28e);
  stripRichText && (_0x24d28e["content"] !== undefined && (_0x24d28e["content"] = stripPersistedRichText(_0x24d28e["content"])), _0x24d28e["prompt"] !== undefined && (_0x24d28e["prompt"] = sanitizePersistedPromptHtml(_0x24d28e['prompt'])));
  Array["isArray"](_0x4e44c6["cells"]) && (_0x24d28e['cells'] = cloneShallowObjectArray(_0x4e44c6["cells"]));
  Array['isArray'](_0x4e44c6["images"]) && (_0x24d28e["images"] = cloneShallowObjectArray(_0x4e44c6["images"]));
  Array['isArray'](_0x4e44c6["videos"]) && (_0x24d28e["videos"] = cloneShallowObjectArray(_0x4e44c6["videos"]));
  _0x4e44c6["sceneNode"] && typeof _0x4e44c6["sceneNode"] === 'object' && (_0x24d28e['sceneNode'] = stripPanoramaViewport ? sanitizePanoramaStateForHistory(_0x4e44c6["sceneNode"]) : sanitizePanoramaStateForPersistence(_0x4e44c6["sceneNode"]));
  _0x4e44c6['panorama360Node'] && typeof _0x4e44c6["panorama360Node"] === "object" && (_0x24d28e['panorama360Node'] = stripPanoramaViewport ? sanitizePanoramaStateForHistory(_0x4e44c6['panorama360Node']) : sanitizePanoramaStateForPersistence(_0x4e44c6["panorama360Node"]));
  _0x4e44c6['storyboard3d'] && typeof _0x4e44c6["storyboard3d"] === "object" && (_0x24d28e["storyboard3d"] = deepClone(_0x4e44c6['storyboard3d']));
  typeof hydratedAt === 'number' && Number["isFinite"](hydratedAt) && typeof _0x24d28e['generationStartTime'] === "number" && Number["isFinite"](_0x24d28e["generationStartTime"]) && _0x24d28e["generationDuration"] == null && !shouldPreserveRunningGenerationOnHydrate(_0x24d28e, {
    'preserveLiveGeneration': preserveLiveGeneration
  }) && finalizeHydratedGenerationSnapshot(_0x24d28e, Math["max"](0x1, hydratedAt - _0x24d28e['generationStartTime']));
  if (typeof _0x24d28e['_bizRev'] !== "number") {
    _0x24d28e["_bizRev"] = 0x1;
  }
  return featureSelections ? applyFeatureSelectionsToNodeData(_0x24d28e, featureSelections) : _0x24d28e;
}
function shallowEqual(_0x20d145, _0x524179) {
  if (_0x20d145 === _0x524179) {
    return !![];
  }
  if (typeof _0x20d145 !== typeof _0x524179) {
    return ![];
  }
  if (typeof _0x20d145 !== 'object' || _0x20d145 === null || _0x524179 === null) {
    return ![];
  }
  const _0x3fbcfd = Object['keys'](_0x20d145);
  const _0x72b5ba = Object["keys"](_0x524179);
  if (_0x3fbcfd['length'] !== _0x72b5ba["length"]) {
    return ![];
  }
  for (const _0x50c4a5 of _0x3fbcfd) {
    if (!Object["prototype"]["hasOwnProperty"]["call"](_0x524179, _0x50c4a5) || _0x20d145[_0x50c4a5] !== _0x524179[_0x50c4a5]) {
      return ![];
    }
  }
  return !![];
}
function isPlainObject(_0x47279b) {
  if (!_0x47279b || typeof _0x47279b !== "object" || Array['isArray'](_0x47279b)) {
    return ![];
  }
  const _0x5e4d51 = Object["getPrototypeOf"](_0x47279b);
  return _0x5e4d51 === Object["prototype"] || _0x5e4d51 === null;
}
function snapshotSelectorValue(_0x2b09c4) {
  if (_0x2b09c4 == null || typeof _0x2b09c4 !== "object") {
    return _0x2b09c4;
  }
  if (Array["isArray"](_0x2b09c4)) {
    return _0x2b09c4["slice"]();
  }
  if (isPlainObject(_0x2b09c4)) {
    return {
      ..._0x2b09c4
    };
  }
  if (typeof structuredClone === "function") {
    try {
      return structuredClone(_0x2b09c4);
    } catch {}
  }
  return _0x2b09c4;
}
function _isSameStoreValue(_0x1b7e05, _0x1b78cf) {
  return Object['is'](_0x1b7e05, _0x1b78cf);
}
function _isPatchNoop(_0x46cf00, _0x210bde) {
  if (!_0x46cf00 || !_0x210bde || typeof _0x210bde !== "object") {
    return ![];
  }
  const _0x234573 = Object["keys"](_0x210bde);
  if (_0x234573["length"] === 0x0) {
    return !![];
  }
  return _0x234573["every"](_0x11af9f => _isSameStoreValue(_0x46cf00[_0x11af9f], _0x210bde[_0x11af9f]));
}
function _trimText(_0x53bc6f) {
  return typeof _0x53bc6f === 'string' ? _0x53bc6f["trim"]() : '';
}
function _getStoryboardCellPosition(_0x5b5fa5, _0x282e05) {
  const _0x72b845 = Math['max'](0x1, Math["round"](Number(_0x5b5fa5?.['cols']) || 0x1));
  return {
    'col': _0x282e05 % _0x72b845,
    'row': Math['floor'](_0x282e05 / _0x72b845)
  };
}
function _placeStoryboardCellForSwap(_0x16f871, _0x5d1f67, _0x2844b6, _0x405df3, _0x57fd9b, _0x666a1) {
  Object["assign"](_0x16f871, _getStoryboardCellPosition(_0x57fd9b, _0x666a1));
  if (isStoryboardCellEmpty(_0x5d1f67)) {
    return normalizeEmptyStoryboardCell(_0x16f871);
  }
  _0x16f871["storyboardSourceIndex"] = resolveStoryboardCellSourceIndex(_0x5d1f67, _0x405df3, _0x2844b6);
  return _0x16f871;
}
function _isValidStoryboardCellTarget(_0x1cd2cb, _0x2b95bf) {
  return _0x1cd2cb && _0x1cd2cb['type'] === "storyboard" && Array["isArray"](_0x1cd2cb["cells"]) && Number['isInteger'](_0x2b95bf) && _0x2b95bf >= 0x0 && _0x2b95bf < _0x1cd2cb['cells']['length'];
}
const LEGACY_VIDEO_EDIT_V52_MODEL_ID = "runninghub/2037339851183366146";
function normalizeNodeModel(_0x2cd7f0) {
  if (!_0x2cd7f0 || typeof _0x2cd7f0 !== "object") {
    return;
  }
  String(_0x2cd7f0["model"] || '') === LEGACY_VIDEO_EDIT_V52_MODEL_ID && (_0x2cd7f0["model"] = RH_VIDEO_V54_MODEL_ID);
}
function normalizeNodesCollection(_0x5f3df4) {
  if (!_0x5f3df4) {
    return;
  }
  if (Array["isArray"](_0x5f3df4)) {
    _0x5f3df4["forEach"](normalizeNodeModel);
    return;
  }
  typeof _0x5f3df4 === "object" && Object["values"](_0x5f3df4)["forEach"](normalizeNodeModel);
}
function isDreaminaTaskNodeSnapshot(_0x300d3f) {
  if (!_0x300d3f || typeof _0x300d3f !== "object") {
    return ![];
  }
  const _0x4b0974 = String(_0x300d3f["type"] || '')["trim"]()["toLowerCase"]();
  if (!["ai-video", "ai-image", "source-image", "source-video"]['includes'](_0x4b0974)) {
    return ![];
  }
  const _0x2f7b8e = String(_0x300d3f['provider'] || '')['trim']()["toLowerCase"]();
  const _0x50ea37 = String(_0x300d3f["model"] || '')["trim"]();
  return _0x2f7b8e === "dreamina" || resolveModelProvider(_0x50ea37, _0x2f7b8e) === "dreamina";
}
function inferAsyncProviderByModel(_0x412655, _0x365988 = '') {
  const _0x258ddf = resolveModelProvider(_0x412655, '', {
    'allowProviderHint': ![]
  });
  if (_0x258ddf) {
    return _0x258ddf;
  }
  const _0x3952e1 = String(_0x365988 || '')["trim"]()["toLowerCase"]();
  if (_0x3952e1) {
    return _0x3952e1;
  }
  const _0x4eb9e6 = String(_0x412655 || '')['trim']();
  if (_0x4eb9e6 && !_0x4eb9e6["includes"]('/')) {
    return "grsai";
  }
  return 'grsai';
}
function isAsyncTaskNodeSnapshot(_0x1c60d7) {
  if (!_0x1c60d7 || typeof _0x1c60d7 !== "object") {
    return ![];
  }
  const _0x1ea8b2 = String(_0x1c60d7['type'] || '')["trim"]()["toLowerCase"]();
  if (!['ai-video', "ai-image", "source-video", "source-image"]["includes"](_0x1ea8b2)) {
    return ![];
  }
  const _0x39a823 = inferAsyncProviderByModel(_0x1c60d7["model"], _0x1c60d7['asyncTaskProvider'] || _0x1c60d7["provider"] || '');
  if (!_0x39a823 || _0x39a823 === "runninghubwf" || _0x39a823 === 'runninghub' || _0x39a823 === 'dreamina') {
    return ![];
  }
  return !![];
}
function isRunningHubTaskNodeSnapshot(_0x5c431f) {
  if (!_0x5c431f || typeof _0x5c431f !== "object") {
    return ![];
  }
  const _0x403add = String(_0x5c431f["type"] || '')['trim']()["toLowerCase"]();
  const _0x5924b8 = String(_0x5c431f["provider"] || '')['trim']()["toLowerCase"]();
  const _0x4df23c = String(_0x5c431f["model"] || '')["trim"]();
  const _0x339818 = resolveModelProvider(_0x4df23c, _0x5924b8, {
    'allowProviderHint': ![]
  });
  const _0xafa987 = a685_0x5041bd(_0x4df23c, _0x5924b8 || "runninghubwf");
  const _0x2db3fb = _0x339818 === 'runninghub' && isModelApiModel(_0x4df23c, 'runninghub');
  if (_0x403add === "ai-audio") {
    return _0x5924b8 === 'runninghubwf';
  }
  if (_0x403add === 'source-video') {
    return _0x5924b8 === "runninghubwf" || _0xafa987;
  }
  if (_0x403add === "source-image") {
    return _0x5924b8 === "runninghubwf" || _0x5924b8 === "runninghub" || _0xafa987 || _0x2db3fb;
  }
  if (_0x403add === "source-audio") {
    return _0x5924b8 === "runninghubwf" && _0xafa987;
  }
  if (_0x403add === 'ai-video') {
    return _0x5924b8 === "runninghubwf" && _0xafa987;
  }
  if (_0x403add === "ai-image") {
    return _0xafa987 || _0x2db3fb || _0x5924b8 === "runninghub" || _0x5924b8 === 'runninghubwf';
  }
  return ![];
}
function hasResolvedVideoResultSnapshot(_0x5ef54e) {
  if (!_0x5ef54e || typeof _0x5ef54e !== "object") {
    return ![];
  }
  const _0x73d1a7 = Array["isArray"](_0x5ef54e["videos"]) ? _0x5ef54e["videos"] : [];
  if (_0x73d1a7["length"] > 0x0) {
    return !![];
  }
  return !!String(_0x5ef54e["videoUrl"] || '')['trim']() || !!String(_0x5ef54e["localPath"] || '')["trim"]();
}
const HYDRATE_ACTIVE_STATUS_FIELDS = Object['freeze'](['jobStatus', "rhTaskStatus", "dreaminaTaskStatus", 'dreaminaTaskPhase', "asyncTaskStatus", "mediaTaskStatus"]);
const HYDRATE_RECOVERING_FIELDS = Object["freeze"](["rhTaskRecovering", "dreaminaTaskRecovering", "asyncTaskRecovering"]);
function finalizeHydratedGenerationSnapshot(_0x2210da, _0x3810ad) {
  _0x2210da["generationDuration"] = _0x3810ad;
  if (_0x2210da["isGenerating"] === !![]) {
    _0x2210da["isGenerating"] = ![];
  }
  for (const _0x254849 of HYDRATE_ACTIVE_STATUS_FIELDS) {
    const _0x1791e2 = String(_0x2210da[_0x254849] || '')["trim"]();
    if (_0x1791e2 && !isGenerationTaskTerminalStatus(_0x1791e2)) {
      _0x2210da[_0x254849] = "cancelled";
    }
  }
  for (const _0x58e8d5 of HYDRATE_RECOVERING_FIELDS) {
    if (_0x2210da[_0x58e8d5] === !![]) {
      _0x2210da[_0x58e8d5] = ![];
    }
  }
}
function shouldPreserveRunningGenerationOnHydrate(_0x217d2a, {
  preserveLiveGeneration = ![]
} = {}) {
  if (preserveLiveGeneration && _0x217d2a?.["isGenerating"] === !![]) {
    const _0x126406 = [_0x217d2a["dreaminaTaskPhase"], _0x217d2a["dreaminaTaskStatus"], _0x217d2a["asyncTaskStatus"], _0x217d2a["rhTaskStatus"], _0x217d2a["mediaTaskStatus"], _0x217d2a["jobStatus"]]["some"](_0x591f11 => {
      const _0x341d96 = String(_0x591f11 || '')['trim']()["toLowerCase"]();
      return !!_0x341d96 && _0x341d96 !== "idle" && isGenerationTaskTerminalStatus(_0x341d96);
    });
    if (!_0x126406) {
      return !![];
    }
  }
  if (isDreaminaTaskNodeSnapshot(_0x217d2a)) {
    const _0xfabf11 = String(_0x217d2a["dreaminaSubmitId"] || '')['trim']();
    if (!_0xfabf11) {
      return ![];
    }
    const _0x3e8d70 = String(_0x217d2a["dreaminaTaskPhase"] || '')['trim']()["toLowerCase"]();
    const _0x68da07 = String(_0x217d2a['dreaminaTaskStatus'] || '')['trim']()["toLowerCase"]();
    if (isGenerationTaskTerminalStatus(_0x3e8d70)) {
      return ![];
    }
    if (isGenerationTaskTerminalStatus(_0x68da07)) {
      return ![];
    }
    return !![];
  }
  if (isAsyncTaskNodeSnapshot(_0x217d2a)) {
    const _0x48f70c = String(_0x217d2a["asyncTaskId"] || '')['trim']();
    if (!_0x48f70c) {
      return ![];
    }
    const _0x275a1e = String(_0x217d2a['asyncTaskKind'] || '')["trim"]()["toLowerCase"]();
    const _0x1257c4 = String(_0x217d2a['type'] || '')["trim"]()["toLowerCase"]();
    if (_0x275a1e === "image" && !["ai-image", 'source-image']["includes"](_0x1257c4)) {
      return ![];
    }
    if (_0x275a1e === "video" && !["ai-video", "source-video"]["includes"](_0x1257c4)) {
      return ![];
    }
    const _0x27c08f = String(_0x217d2a["asyncTaskStatus"] || '')['trim']()['toLowerCase']();
    if (isGenerationTaskTerminalStatus(_0x27c08f)) {
      return ![];
    }
    return !![];
  }
  if (!isRunningHubTaskNodeSnapshot(_0x217d2a)) {
    return ![];
  }
  const _0x296462 = String(_0x217d2a["rhTaskId"] || '')["trim"]();
  if (!_0x296462) {
    return ![];
  }
  const _0x522ae5 = String(_0x217d2a["rhTaskStatus"] || '')['trim']()["toLowerCase"]();
  if (isGenerationTaskTerminalStatus(_0x522ae5)) {
    return ![];
  }
  return !![];
}
function createStore() {
  const _0x10ae00 = createGenerationHistoryState();
  let _0x41a245 = createInitialState();
  const _0x261fd4 = createRendererStateRevisionTracker(_0x41a245);
  const _0x3602fe = createNodeFieldSubscriptions(() => _0x41a245['nodes']);
  const _0x3a3866 = createViewportScreenFrame();
  const _0x2ae1ac = [];
  const _0x2ff961 = [];
  const _0x4eaccc = [];
  let _0x4cb47b = 0x0;
  let _0x2661b5 = ![];
  let _0xe60ce = () => !![];
  function _0x1671e3(_0x1586ae = !![]) {
    _0x41a245['_persistRev'] = (_0x41a245["_persistRev"] || 0x0) + 0x1;
    if (_0x1586ae) {
      _0x41a245["_contentPersistRev"] = (_0x41a245["_contentPersistRev"] || 0x0) + 0x1;
    }
  }
  function _0x5b69fc() {
    _0x41a245["_edgesRev"] = (_0x41a245["_edgesRev"] || 0x0) + 0x1;
  }
  function _0x1d7695(_0x110185) {
    _0xe60ce = typeof _0x110185 === "function" ? _0x110185 : () => !![];
  }
  function _0x40ca8e(_0x50b18b, _0x32de2f) {
    if (!_0x3a3866['set'](_0x50b18b, _0x32de2f)) {
      return;
    }
    _0x41a245["viewport"] = _0x3a3866["attach"](_0x41a245["viewport"]);
    _0x1bbaa();
  }
  function _0x2c36e9(_0x114fca, _0x4ef5e6) {
    if (!_0x4ef5e6 || typeof _0x4ef5e6 !== "object") {
      return _0x4ef5e6;
    }
    const _0x5d670d = {
      ..._0x4ef5e6
    };
    const _0x697dd4 = _0x1b57f7 => Object["prototype"]["hasOwnProperty"]["call"](_0x5d670d, _0x1b57f7);
    const _0x6e6efc = () => {
      const _0x337233 = [_0x5d670d["images"], _0x5d670d["videos"]]["filter"](Array['isArray']);
      for (const _0x4e6e3f of _0x337233) {
        let _0x3b379d = '';
        let _0x260d95 = ![];
        for (const _0x25c88b of _0x4e6e3f) {
          if (!_0x25c88b || typeof _0x25c88b !== 'object') {
            continue;
          }
          const _0x2fc12d = String(_0x25c88b["error"] || _0x25c88b['message'] || '')['trim']();
          if (_0x2fc12d && !_0x3b379d) {
            _0x3b379d = _0x2fc12d;
          }
          String(_0x25c88b["localPath"] || _0x25c88b["originalLocalPath"] || _0x25c88b["displayLocalPath"] || _0x25c88b["thumbLocalPath"] || _0x25c88b["imageUrl"] || _0x25c88b['videoUrl'] || _0x25c88b["thumbUrl"] || _0x25c88b['sourceUrl'] || '')["trim"]() && (_0x260d95 = !![]);
        }
        if (_0x3b379d && !_0x260d95) {
          return _0x3b379d;
        }
      }
      return String(_0x5d670d['jobError'] || '')["trim"]();
    };
    const _0x58f518 = _0x697dd4("isGenerating");
    const _0x2d239e = _0x6e6efc();
    const _0x340371 = _0x375e43 => String(_0x375e43 || '')["trim"]()["toLowerCase"]();
    const _0xfed360 = _0x43c628 => ["error", "failed", "fail", "cancelled", 'canceled']["includes"](_0x340371(_0x43c628));
    const _0x3fc503 = _0xb6a7c4 => {
      if (_0x697dd4(_0xb6a7c4)) {
        return String(_0x5d670d[_0xb6a7c4] || '')["trim"]();
      }
      return String(_0x114fca?.[_0xb6a7c4] || '')["trim"]();
    };
    const _0x30386b = () => !!_0x3fc503("dreaminaSubmitId");
    const _0xe7d118 = _0x47a38d => {
      if (_0xfed360(_0x47a38d)) {
        return !![];
      }
      if (_0x30386b()) {
        return !![];
      }
      if (_0x340371(_0x47a38d) === "idle") {
        return ![];
      }
      return _0x340371(_0x5d670d["dreaminaTaskStatus"]) !== "idle";
    };
    const _0x43cc17 = [{
      'status': _0x697dd4("asyncTaskStatus") ? _0x5d670d["asyncTaskStatus"] : null,
      'active': _0xfed360(_0x5d670d['asyncTaskStatus']) || !!_0x3fc503("asyncTaskId") || _0x340371(_0x5d670d["asyncTaskStatus"]) !== "idle"
    }, {
      'status': _0x697dd4('rhTaskStatus') ? _0x5d670d["rhTaskStatus"] : null,
      'active': _0xfed360(_0x5d670d["rhTaskStatus"]) || !!_0x3fc503("rhTaskId") || _0x340371(_0x5d670d['rhTaskStatus']) !== 'idle'
    }, {
      'status': _0x697dd4("dreaminaTaskStatus") ? _0x5d670d["dreaminaTaskStatus"] : null,
      'active': _0xe7d118(_0x5d670d["dreaminaTaskStatus"])
    }, {
      'status': _0x697dd4("dreaminaTaskPhase") ? _0x5d670d["dreaminaTaskPhase"] : null,
      'active': _0xe7d118(_0x5d670d["dreaminaTaskPhase"])
    }, {
      'status': _0x697dd4("mediaTaskStatus") ? _0x5d670d["mediaTaskStatus"] : null,
      'active': !![]
    }]["filter"](_0x56a978 => _0x56a978['active'] === !![] && String(_0x56a978["status"] || '')["trim"]());
    const _0x1c497c = _0x43cc17['find'](_0x537b13 => isGenerationTaskTerminalStatus(_0x537b13['status']))?.["status"];
    const _0x414384 = _0x697dd4("mediaTaskStatus") ? String(_0x5d670d["mediaTaskStatus"] || '')["trim"]()["toLowerCase"]() : '';
    !_0x58f518 && (_0x414384 === "waiting" || _0x414384 === "processing") && (_0x5d670d["isGenerating"] = !![]);
    if (_0x2d239e) {
      _0x5d670d["isGenerating"] = ![];
      _0x5d670d["jobStatus"] = 'error';
      _0x5d670d['jobError'] = _0x2d239e;
      if (_0x697dd4("dreaminaTaskStatus")) {
        _0x5d670d["dreaminaTaskStatus"] = "failed";
      }
      if (_0x697dd4('dreaminaTaskPhase')) {
        _0x5d670d['dreaminaTaskPhase'] = "failed";
      }
      if (_0x697dd4("dreaminaTaskLabel")) {
        _0x5d670d['dreaminaTaskLabel'] = _0x2d239e;
      }
      if (_0x697dd4("dreaminaTaskRecovering")) {
        _0x5d670d['dreaminaTaskRecovering'] = ![];
      }
      if (_0x697dd4('asyncTaskStatus')) {
        _0x5d670d["asyncTaskStatus"] = "failed";
      }
      if (_0x697dd4("asyncTaskRecovering")) {
        _0x5d670d["asyncTaskRecovering"] = ![];
      }
      if (_0x697dd4('rhTaskStatus')) {
        _0x5d670d["rhTaskStatus"] = "failed";
      }
      if (_0x697dd4("rhTaskRecovering")) {
        _0x5d670d['rhTaskRecovering'] = ![];
      }
    }
    if (_0x1c497c) {
      _0x5d670d["isGenerating"] = ![];
      const _0x1101f9 = resolveJobStatusFromTaskStatus(_0x1c497c, _0x5d670d["jobStatus"] ?? null);
      if (_0x1101f9 !== undefined) {
        _0x5d670d["jobStatus"] = _0x1101f9;
      }
      (_0x697dd4("dreaminaTaskStatus") || _0x697dd4('dreaminaTaskPhase')) && (_0x5d670d['dreaminaTaskRecovering'] = ![]);
      if (_0x697dd4("asyncTaskStatus")) {
        _0x5d670d["asyncTaskRecovering"] = ![];
      }
      if (_0x697dd4("rhTaskStatus")) {
        _0x5d670d["rhTaskRecovering"] = ![];
      }
    }
    if (_0x5d670d['isGenerating'] === !![]) {
      if (!_0x697dd4("jobStatus")) {
        _0x5d670d["jobStatus"] = 'running';
      }
      const _0x1d915b = Number(_0x5d670d["generationStartTime"]);
      if (!Number["isFinite"](_0x1d915b) || _0x1d915b <= 0x0) {
        const _0x15bba8 = Number(_0x114fca?.["generationStartTime"]);
        _0x5d670d["generationStartTime"] = Number['isFinite'](_0x15bba8) && _0x15bba8 > 0x0 ? _0x15bba8 : Date["now"]();
      }
      _0x5d670d["generationDuration"] = null;
      return _0x5d670d;
    }
    const _0x5f0d1a = _0x114fca?.["isGenerating"] === !![];
    const _0x1fdb90 = _0x5d670d['isGenerating'] === ![] && _0x5d670d['generationDuration'] == null && (_0x5f0d1a || !!_0x2d239e || !!_0x1c497c);
    if (_0x1fdb90) {
      const _0x845fba = _0x697dd4("generationStartTime") ? Number(_0x5d670d["generationStartTime"]) : Number(_0x114fca?.['generationStartTime']);
      _0x5d670d["generationDuration"] = Number["isFinite"](_0x845fba) && _0x845fba > 0x0 ? Math["max"](0x0, Date["now"]() - _0x845fba) : _0x5f0d1a ? 0x0 : _0x5d670d['generationDuration'];
    }
    return _0x5d670d;
  }
  function _0x1bbaa() {
    if (_0x4cb47b > 0x0) {
      _0x2661b5 = !![];
      return;
    }
    _0x3602fe["flush"]();
    for (const _0x4b6eba of _0x2ff961) {
      _0x4b6eba(_0x41a245);
    }
    if (_0x2ae1ac["length"] > 0x0) {
      const _0x5a3cae = deepClone(_0x41a245);
      for (const _0x3f6046 of _0x2ae1ac) {
        _0x3f6046(_0x5a3cae);
      }
    }
    for (const {
      selector: _0x167caa,
      callback: _0x537a3a,
      isEqual: _0x5f4486,
      lastValue: _0x41e0dc
    } of _0x4eaccc) {
      const _0xa3e21e = _0x167caa(_0x41a245);
      !_0x5f4486(_0x41e0dc["value"], _0xa3e21e) && (_0x41e0dc["value"] = snapshotSelectorValue(_0xa3e21e), _0x537a3a(_0xa3e21e));
    }
  }
  function _0x46d768(_0xe35573) {
    if (typeof _0xe35573 !== 'function') {
      throw new TypeError("[store] batch() 的参数必须是函数");
    }
    _0x4cb47b++;
    try {
      return _0xe35573();
    } finally {
      _0x4cb47b--;
      _0x4cb47b === 0x0 && _0x2661b5 && (_0x2661b5 = ![], _0x1bbaa());
    }
  }
  function _0x232931() {
    _0x261fd4['renderRequest']();
    _0x1bbaa();
  }
  function _0x17d5cd() {
    _0x261fd4['renderRequest']();
    _0x1bbaa();
  }
  function _0x2ea74a(_0x59452a) {
    if (typeof _0x59452a !== "function") {
      throw new TypeError("[store] subscribe() 的参数必须是一个函数");
    }
    _0x2ae1ac['push'](_0x59452a);
    _0x59452a(deepClone(_0x41a245));
    return function _0x434230() {
      const _0xa752fc = _0x2ae1ac["indexOf"](_0x59452a);
      _0xa752fc !== -0x1 && _0x2ae1ac['splice'](_0xa752fc, 0x1);
    };
  }
  function _0x1c2bdc(_0x4b0750) {
    if (typeof _0x4b0750 !== "function") {
      throw new TypeError('[store]\x20subscribeRaw()\x20的参数必须是一个函数');
    }
    _0x2ff961['push'](_0x4b0750);
    _0x4b0750(_0x41a245);
    return function _0x4dcdb0() {
      const _0x1b316c = _0x2ff961["indexOf"](_0x4b0750);
      _0x1b316c !== -0x1 && _0x2ff961["splice"](_0x1b316c, 0x1);
    };
  }
  function _0xc8424f(_0x54ffe5, _0x16cdd4, _0x2d2adb = {}) {
    if (typeof _0x54ffe5 !== "function") {
      throw new TypeError('[store]\x20subscribeSelector()\x20的\x20selector\x20必须是函数');
    }
    if (typeof _0x16cdd4 !== "function") {
      throw new TypeError("[store] subscribeSelector() 的 callback 必须是函数");
    }
    const _0x506f66 = _0x2d2adb['isEqual'] || shallowEqual;
    const _0x5a0d44 = _0x54ffe5(_0x41a245);
    const _0x80685b = {
      'selector': _0x54ffe5,
      'callback': _0x16cdd4,
      'isEqual': _0x506f66,
      'lastValue': {
        'value': snapshotSelectorValue(_0x5a0d44)
      }
    };
    _0x4eaccc['push'](_0x80685b);
    _0x16cdd4(_0x5a0d44);
    return function _0x187da9() {
      const _0x260f25 = _0x4eaccc["indexOf"](_0x80685b);
      _0x260f25 !== -0x1 && _0x4eaccc["splice"](_0x260f25, 0x1);
    };
  }
  function _0x2ea29b(_0x50ab0f) {
    if (!_0x50ab0f || !_0x50ab0f['id']) {
      throw new Error("[store] addNode() 需要提供含有 id 字段的节点数据");
    }
    const _0x1252b2 = applyFeatureSelectionsToNodeData(JSON["parse"](JSON["stringify"](_0x50ab0f)), _0x41a245['ui']?.["featureSelections"] || {});
    const _0x3173e9 = sanitizeCanvasNodeMediaPatchForStore(_0x1252b2);
    const _0x3717e6 = {
      'text': "文本块",
      'ai-text': "生成文本",
      'ai-image': "生成图像",
      'ai-video': "生成视频",
      'ai-audio': "生成音频",
      'source-text': "源文本",
      'comment-note': '',
      'source-image': "源图像",
      'source-video': "源视频",
      'source-audio': "源音频",
      'panorama-scene': '3D导演台',
      'panorama-360': "360全景图",
      'storyboard-script': '分镜脚本',
      'group': '组合',
      'storyboard': "宫格分镜",
      'image': '源图像',
      'audio': "源音频",
      'video': '源视频'
    };
    const _0x59fae6 = Object["prototype"]["hasOwnProperty"]["call"](_0x3717e6, _0x3173e9['type']) ? _0x3717e6[_0x3173e9["type"]] : "未命名";
    _0x3173e9["type"] === "storyboard" && (!Array['isArray'](_0x3173e9['cells']) ? _0x3173e9["cells"] = [] : _0x3173e9["cells"] = _0x3173e9['cells']["map"](_0x30e5c5 => ({
      ..._0x30e5c5,
      'id': generateId("cell")
    })));
    _0x3173e9['type'] === "storyboard-script" && (_0x3173e9["storyboardScript"] = createDefaultStoryboardScriptState(_0x3173e9['storyboardScript']));
    _0x3173e9['type'] === "comment-note" && (_0x3173e9["jumpShortcut"] = normalizeCommentNoteJumpShortcut(_0x3173e9['jumpShortcut']));
    const {
      _bizRev: _0xd8b108,
      ..._0x45fa8d
    } = _0x3173e9;
    const _0x4155bc = _0x2c36e9(null, _0x45fa8d);
    const _0x18f388 = {
      'parentId': null,
      'name': _0x59fae6,
      '_bizRev': 0x1,
      ..._0x4155bc
    };
    captureFeatureSelectionsFromNodePatch(_0x18f388, _0x18f388, _0x41a245['ui']?.["featureSelections"] || {});
    _0x261fd4["add"](_0x41a245["nodes"][_0x18f388['id']], _0x18f388);
    _0x41a245["nodes"][_0x18f388['id']] = _0x18f388;
    _0x3602fe["touch"](_0x18f388['id']);
    _0x41a245["_nodeCount"] = (_0x41a245['_nodeCount'] || 0x0) + 0x1;
    _0x1671e3();
    _0x18f388["parentId"] && _0x2ab2ae(_0x18f388['id'], _0x18f388["parentId"]);
    _0x1bbaa();
  }
  function _0x2ab2ae(_0x8d32d, _0x37a984, _0x168556 = null) {
    _0x168556 && _0x41a245["_parentToChildren"][_0x168556]?.['delete'](_0x8d32d);
    _0x37a984 && (!_0x41a245["_parentToChildren"][_0x37a984] && (_0x41a245["_parentToChildren"][_0x37a984] = new Set()), _0x41a245["_parentToChildren"][_0x37a984]["add"](_0x8d32d));
  }
  function _0x22e69b(_0x2752e7, _0x8d7092 = null) {
    if (_0x8d7092) {
      const _0xb54133 = _0x41a245["_parentToChildren"][_0x8d7092];
      _0xb54133 && (_0xb54133["delete"](_0x2752e7), _0xb54133["size"] === 0x0 && delete _0x41a245["_parentToChildren"][_0x8d7092]);
    }
    _0x41a245["_parentToChildren"][_0x2752e7] && delete _0x41a245["_parentToChildren"][_0x2752e7];
  }
  function _0x4aa671(_0x5f3501, _0x1818c8, _0x2aee97) {
    _0xe1e48f([_0x5f3501], _0x1818c8, _0x2aee97);
  }
  function _0xe1e48f(_0x194e2f, _0x4e39a4, _0x5f33ad) {
    _0x1d7948(planNodeMovement(_0x41a245, "moveNodes", [_0x194e2f, _0x4e39a4, _0x5f33ad]));
  }
  function _0x2a613b(_0x185019) {
    _0x1d7948(planNodeMovement(_0x41a245, "moveNodesByOffsets", [_0x185019]));
  }
  function _0x1d7948(_0x28f0a6) {
    let _0x22dcb4 = ![];
    for (const [_0x2287ea, _0x3c21d1] of Object['entries'](_0x28f0a6)) {
      const _0x50840c = _0x41a245['nodes'][_0x2287ea];
      if (!_0x50840c) {
        continue;
      }
      const _0x591989 = (_0x50840c['x'] || 0x0) + _0x3c21d1['dx'];
      const _0x37e3ba = (_0x50840c['y'] || 0x0) + _0x3c21d1['dy'];
      if (_0x591989 === _0x50840c['x'] && _0x37e3ba === _0x50840c['y']) {
        continue;
      }
      _0x50840c['x'] = _0x591989;
      _0x50840c['y'] = _0x37e3ba;
      _0x3602fe['touch'](_0x2287ea);
      _0x10ae00['record'](_0x2287ea, {
        'x': _0x591989,
        'y': _0x37e3ba
      });
      _0x22dcb4 = !![];
    }
    if (!_0x22dcb4) {
      return;
    }
    _0x261fd4['geometry']();
    _0x1671e3();
    _0x1bbaa();
  }
  function _0x4e5794(_0x325919, _0x131a2b) {
    if (!Array['isArray'](_0x325919) || _0x325919["length"] === 0x0) {
      return;
    }
    const _0x34849a = _0x131a2b || null;
    let _0x25a338 = ![];
    _0x325919['forEach'](_0x4c2a0c => {
      const _0x3de779 = _0x41a245["nodes"][_0x4c2a0c];
      if (_0x3de779) {
        const _0x7c0bb3 = _0x3de779["parentId"] || null;
        if (_0x7c0bb3 === _0x34849a) {
          return;
        }
        _0x3de779["parentId"] = _0x34849a;
        _0x3602fe["touch"](_0x4c2a0c);
        _0x10ae00['record'](_0x4c2a0c, {
          'parentId': _0x34849a
        });
        _0x3de779['_bizRev'] = (typeof _0x3de779["_bizRev"] === "number" ? _0x3de779["_bizRev"] : 0x0) + 0x1;
        _0x2ab2ae(_0x4c2a0c, _0x34849a, _0x7c0bb3);
        _0x25a338 = !![];
      }
    });
    if (!_0x25a338) {
      return;
    }
    _0x261fd4["content"]();
    _0x1671e3();
    _0x1bbaa();
  }
  function _0xa533f8(_0x2db832 = {}) {
    const _0x16f176 = getFixedInputSlotConfigFromManifest(_0x2db832);
    if (!_0x16f176) {
      return null;
    }
    const _0x815150 = getTargetInputPolicy(_0x2db832);
    const _0xc27ef8 = new Set(_0x16f176["visibleSlots"] || []);
    const _0x1b2c3b = new Set();
    const _0x565906 = new Set();
    const _0x4a890c = {};
    const _0x535ce8 = new Map();
    (_0x16f176["exclusiveGroups"] || [])["forEach"](_0x3fd483 => {
      (_0x3fd483["slots"] || [])["forEach"](_0x4f9658 => {
        _0x535ce8["set"](_0x4f9658, _0x3fd483['id']);
      });
    });
    const _0x43f344 = (_0x52b756, _0x41d6d1) => {
      const _0x5b5a8a = Number(_0x815150?.["maxByKind"]?.[_0x52b756]);
      const _0xa002e9 = Number(_0x4a890c[_0x52b756] || 0x0);
      if (!Number['isFinite'](_0x5b5a8a) || _0x5b5a8a <= _0x41d6d1 || _0xa002e9 >= _0x5b5a8a) {
        return ![];
      }
      _0x4a890c[_0x52b756] = _0xa002e9 + 0x1;
      return !![];
    };
    return {
      'reserveSlot'(_0x48457b, _0x3f6e70 = null) {
        const _0x692c75 = String(_0x48457b || '')["trim"]();
        if (_0x692c75 === "text") {
          return !![];
        }
        const _0x3e4d5d = String(_0x3f6e70?.["refSlot"] || '')["trim"]();
        const _0x2f9d83 = (_0x16f176["slotOrderByType"]?.[_0x692c75] || [])["filter"](_0x35e327 => _0xc27ef8["has"](_0x35e327));
        if (_0x2f9d83["length"] === 0x0) {
          return _0x43f344(_0x692c75, 0x0);
        }
        const _0x360215 = _0x3e4d5d && _0x2f9d83["includes"](_0x3e4d5d) && _0xc27ef8["has"](_0x3e4d5d) ? _0x3e4d5d : _0x2f9d83["find"](_0x11800e => !_0x1b2c3b["has"](_0x11800e));
        if (!_0x360215 || _0x1b2c3b['has'](_0x360215)) {
          return _0x43f344(_0x692c75, _0x2f9d83["length"]);
        }
        const _0x20691d = _0x535ce8["get"](_0x360215);
        if (_0x20691d && _0x565906['has'](_0x20691d)) {
          return _0x43f344(_0x692c75, _0x2f9d83["length"]);
        }
        _0x1b2c3b["add"](_0x360215);
        if (_0x20691d) {
          _0x565906["add"](_0x20691d);
        }
        _0x4a890c[_0x692c75] = Number(_0x4a890c[_0x692c75] || 0x0) + 0x1;
        return _0x360215;
      },
      'reserve'(_0x4402ea, _0x3f1611 = null) {
        return !!this["reserveSlot"](_0x4402ea, _0x3f1611);
      }
    };
  }
  function _0x19c883(_0x268cfd) {
    const _0x5c8171 = _0x41a245;
    const _0x30f5fe = _0x5c8171["nodes"][_0x268cfd];
    if (!_0x30f5fe) {
      return [];
    }
    if (!canTargetReceiveInputs(_0x30f5fe)) {
      return [];
    }
    const _0x42bdd4 = _0x30f5fe['parentId'];
    const _0x5a1a36 = getTargetInputPolicy(_0x30f5fe);
    const _0x2bea00 = _0xa533f8(_0x30f5fe);
    const _0x1fa94b = {
      'text': 0x0,
      'image': 0x0,
      'video': 0x0,
      'audio': 0x0
    };
    const _0x14ffa2 = [];
    const _0x13c5da = [];
    const _0xc8bddc = new Set();
    const _0x374a64 = (_0xd5cabd, _0x158bae = null) => {
      const _0x16e428 = resolveEffectiveInputKind(_0xd5cabd, _0x158bae);
      if (!_0x16e428) {
        return '';
      }
      if (!isInputKindAllowed(_0x5a1a36, _0x16e428)) {
        return '';
      }
      if (!hasUsableInputNodeSource(_0xd5cabd, {
        'edge': _0x158bae,
        'kind': _0x16e428
      })) {
        return '';
      }
      return _0x16e428;
    };
    Object["values"](_0x5c8171["edges"] || {})["forEach"](_0x13b05d => {
      if (!_0x13b05d || _0x13b05d['targetId'] !== _0x268cfd) {
        return;
      }
      const _0x2c4e1d = _0x5c8171['nodes'][_0x13b05d["sourceId"]];
      if (!_0x2c4e1d) {
        return;
      }
      if (isGroupNodeData(_0x2c4e1d)) {
        return;
      }
      const _0x40d93c = _0x374a64(_0x2c4e1d, _0x13b05d);
      if (!_0x40d93c) {
        return;
      }
      const _0x32e6a9 = _0x2bea00 ? _0x2bea00["reserveSlot"](_0x40d93c, _0x13b05d) : '';
      if (_0x2bea00 && !_0x32e6a9) {
        return;
      }
      _0x32e6a9 && typeof _0x32e6a9 === "string" && !_0x13b05d["refSlot"] ? _0x14ffa2["push"]({
        ..._0x13b05d,
        'refSlot': _0x32e6a9
      }) : _0x14ffa2["push"](_0x13b05d);
      _0xc8bddc["add"](_0x13b05d['sourceId']);
      _0x1fa94b[_0x40d93c] = (_0x1fa94b[_0x40d93c] || 0x0) + 0x1;
    });
    Object["values"](_0x5c8171["edges"] || {})["forEach"](_0x3885fb => {
      if (!_0x3885fb || _0x3885fb['targetId'] !== _0x268cfd) {
        return;
      }
      const _0x27ddc0 = _0x5c8171["nodes"][_0x3885fb["sourceId"]];
      if (!isGroupNodeData(_0x27ddc0)) {
        return;
      }
      _0x14ffa2['push'](...collectGroupOutputIncomingEdges({
        'edge': _0x3885fb,
        'groupNode': _0x27ddc0,
        'nodes': _0x5c8171["nodes"],
        'targetId': _0x268cfd,
        'policy': _0x5a1a36,
        'counts': _0x1fa94b,
        'directSourceIds': _0xc8bddc,
        'acceptSource': _0x374a64,
        'canAppendInputKindWithinLimit': canAppendInputKindWithinLimit,
        'reserveInputSlot': _0x2bea00 ? (_0x5e0eb6, _0x250875) => _0x2bea00["reserveSlot"](_0x5e0eb6, _0x250875) : null
      }));
    });
    _0x42bdd4 && Object["values"](_0x5c8171["edges"] || {})['forEach'](_0x4042ec => {
      if (!_0x4042ec || _0x4042ec["targetId"] !== _0x42bdd4) {
        return;
      }
      const _0x315659 = _0x5c8171["nodes"][_0x4042ec["sourceId"]];
      if (!_0x315659) {
        return;
      }
      if (isGroupNodeData(_0x315659)) {
        const _0xfecee4 = collectGroupOutputIncomingEdges({
          'edge': _0x4042ec,
          'groupNode': _0x315659,
          'nodes': _0x5c8171['nodes'],
          'targetId': _0x268cfd,
          'policy': _0x5a1a36,
          'counts': _0x1fa94b,
          'directSourceIds': _0xc8bddc,
          'acceptSource': _0x374a64,
          'canAppendInputKindWithinLimit': canAppendInputKindWithinLimit,
          'reserveInputSlot': _0x2bea00 ? (_0x30a06e, _0x681c08) => _0x2bea00["reserveSlot"](_0x30a06e, _0x681c08) : null
        });
        _0x13c5da['push'](..._0xfecee4['map'](_0x2bf478 => ({
          ..._0x2bf478,
          'isGroupShared': !![],
          'sharedGroupId': _0x42bdd4
        })));
        return;
      }
      const _0x4301bd = _0x374a64(_0x315659, _0x4042ec);
      if (!_0x4301bd) {
        return;
      }
      if (!canAppendInputKindWithinLimit(_0x5a1a36, _0x4301bd, _0x1fa94b)) {
        return;
      }
      const _0x1875d2 = _0x2bea00 ? _0x2bea00["reserveSlot"](_0x4301bd, _0x4042ec) : '';
      if (_0x2bea00 && !_0x1875d2) {
        return;
      }
      _0x13c5da["push"]({
        ..._0x4042ec,
        ...(_0x1875d2 && typeof _0x1875d2 === "string" && !_0x4042ec['refSlot'] ? {
          'refSlot': _0x1875d2
        } : null),
        'isGroupShared': !![],
        'sharedGroupId': _0x42bdd4,
        'effectiveTargetId': _0x268cfd
      });
      _0x1fa94b[_0x4301bd] = (_0x1fa94b[_0x4301bd] || 0x0) + 0x1;
    });
    return [..._0x14ffa2, ..._0x13c5da]['map'](_0xb38b6b => cloneEdgeSnapshot(_0xb38b6b));
  }
  function _0x50f041(_0x3755a8) {
    const _0x5202d8 = new Set(_0x3755a8);
    const _0x1bbe28 = [];
    _0x261fd4['remove'](_0x3755a8);
    for (const _0x5bdec0 of _0x3755a8) {
      const _0x5b2aab = _0x41a245['nodes'][_0x5bdec0];
      if (!_0x5b2aab) {
        continue;
      }
      _0x1bbe28['push']({
        'id': _0x5bdec0,
        'parentId': _0x5b2aab["parentId"] || null
      });
    }
    for (const _0x1ca431 of _0x3755a8) {
      delete _0x41a245['nodes'][_0x1ca431];
      _0x3602fe['touch'](_0x1ca431);
      _0x10ae00["delete"](_0x1ca431);
    }
    _0x41a245["_nodeCount"] = Object["keys"](_0x41a245["nodes"])["length"];
    for (const {
      id: _0x2c43f5,
      parentId: _0x561fd5
    } of _0x1bbe28) {
      _0x22e69b(_0x2c43f5, _0x561fd5);
    }
    let _0x3512e8 = ![];
    for (const _0x100352 of Object["keys"](_0x41a245["edges"])) {
      const _0x219c7d = _0x41a245["edges"][_0x100352];
      (_0x5202d8["has"](_0x219c7d["sourceId"]) || _0x5202d8["has"](_0x219c7d["targetId"])) && (delete _0x41a245["edges"][_0x100352], _0x3512e8 = !![]);
    }
    if (_0x3512e8) {
      _0x5b69fc();
    }
    _0x1671e3();
    emitNodeDeletions(_0x1bbe28);
    _0x1bbaa();
  }
  function _0x4ece32(_0x154544) {
    if (!_0x154544 || !_0x154544['id']) {
      throw new Error("[store] addEdge() 需要提供含有 id 字段的连线数据");
    }
    _0x41a245["edges"][_0x154544['id']] = {
      'isThumbnailActive': !![],
      'type': null,
      ..._0x154544
    };
    _0x5b69fc();
    _0x1671e3();
    _0x1bbaa();
  }
  function _0x53b06b(_0x44bd48, _0xef4b98) {
    _0x44bd48["forEach"](_0x43b586 => {
      if (_0x41a245["edges"][_0x43b586]) {
        delete _0x41a245["edges"][_0x43b586];
      }
    });
    _0xef4b98["forEach"](_0x1059d2 => {
      const {
        isGroupShared: _0x529009,
        sharedGroupId: _0x52067f,
        effectiveTargetId: _0x15d32f,
        ..._0x1f8326
      } = _0x1059d2 || {};
      if (!_0x1f8326['id']) {
        return;
      }
      _0x41a245["edges"][_0x1f8326['id']] = _0x1f8326;
    });
    _0x5b69fc();
    _0x1671e3();
    _0x1bbaa();
  }
  function _0x23903b(_0x15974b, _0x3af4e2, _0x40466f) {
    const _0x2060eb = _0x41a245["viewport"] || {};
    if (_0x2060eb['x'] === _0x15974b && _0x2060eb['y'] === _0x3af4e2 && _0x2060eb["zoom"] === _0x40466f) {
      return;
    }
    const _0x52f4b6 = _0x2060eb["zoom"];
    _0x41a245["viewport"] = _0x3a3866["attach"]({
      'x': _0x15974b,
      'y': _0x3af4e2,
      'zoom': _0x40466f
    });
    if (_0x52f4b6 !== _0x40466f && _0xe60ce()) {
      _0x1671e3(![]);
    }
    _0x1bbaa();
  }
  function _0x48c7ef() {
    _0x1671e3(![]);
    _0x1bbaa();
  }
  function _0x4d93ba(_0x4ed46a, _0x11e1cf, _0x14e571 = {}) {
    const _0x1a759d = _0x41a245['nodes'][_0x4ed46a];
    if (!_0x1a759d) {
      throw new Error('[store]\x20updateNodeData()\x20找不到\x20id\x20为\x20\x22' + _0x4ed46a + "\" 的节点");
    }
    const _0x41fa9d = JSON["parse"](JSON['stringify'](_0x11e1cf));
    const {
      _bizRev: _0x1fa95e,
      ..._0x4f5876
    } = _0x41fa9d;
    _0x4f5876['cells'] && Array["isArray"](_0x4f5876["cells"]) && (_0x4f5876["cells"] = _0x4f5876['cells']["map"](_0x3629f6 => ({
      ..._0x3629f6
    })));
    const _0x504782 = sanitizeCanvasNodeMediaPatchForStore(_0x4f5876, _0x1a759d);
    const _0x50c16b = _0x2c36e9(_0x1a759d, _0x504782);
    if (_0x14e571["replace"] !== !![] && _isPatchNoop(_0x1a759d, _0x50c16b)) {
      return;
    }
    _0x10ae00['record'](_0x4ed46a, _0x50c16b, _0x14e571);
    const _0x164b76 = Object["prototype"]["hasOwnProperty"]["call"](_0x50c16b, "parentId") ? _0x50c16b["parentId"] : _0x1a759d["parentId"];
    captureFeatureSelectionsFromNodePatch(_0x1a759d, _0x50c16b, _0x41a245['ui']?.["featureSelections"] || {});
    const _0x310939 = (typeof _0x1a759d['_bizRev'] === "number" ? _0x1a759d["_bizRev"] : 0x0) + 0x1;
    _0x41a245["nodes"][_0x4ed46a] = {
      ...(_0x14e571["replace"] === !![] ? {
        'id': _0x1a759d['id'],
        'type': _0x1a759d['type']
      } : _0x1a759d),
      ..._0x50c16b,
      '_bizRev': _0x310939
    };
    _0x164b76 !== _0x1a759d["parentId"] && _0x2ab2ae(_0x4ed46a, _0x164b76, _0x1a759d["parentId"]);
    _0x261fd4['patch'](_0x1a759d, _0x41a245["nodes"][_0x4ed46a]);
    _0x3602fe["touch"](_0x4ed46a);
    _0x1671e3();
    _0x1bbaa();
  }
  function _0xe1d981(_0x35b382) {
    let _0x5f4134 = ![];
    const _0x1165f3 = _0x261fd4["batch"]();
    for (const [_0x461b4d, _0x24db0a] of Object['entries'](_0x35b382)) {
      const _0x1978f2 = _0x41a245['nodes'][_0x461b4d];
      if (_0x1978f2) {
        const _0x45e0e7 = JSON['parse'](JSON["stringify"](_0x24db0a));
        const {
          _bizRev: _0x534cad,
          ..._0x2ad88f
        } = _0x45e0e7;
        _0x2ad88f["cells"] && Array["isArray"](_0x2ad88f["cells"]) && (_0x2ad88f["cells"] = _0x2ad88f["cells"]['map'](_0x61968f => ({
          ..._0x61968f
        })));
        const _0x46994d = sanitizeCanvasNodeMediaPatchForStore(_0x2ad88f, _0x1978f2);
        const _0x28f3c7 = _0x2c36e9(_0x1978f2, _0x46994d);
        _0x10ae00['record'](_0x461b4d, _0x28f3c7);
        if (_isPatchNoop(_0x1978f2, _0x28f3c7)) {
          continue;
        }
        const _0x1bf917 = Object["prototype"]['hasOwnProperty']["call"](_0x28f3c7, "parentId") ? _0x28f3c7["parentId"] : _0x1978f2["parentId"];
        captureFeatureSelectionsFromNodePatch(_0x1978f2, _0x28f3c7, _0x41a245['ui']?.["featureSelections"] || {});
        const _0x4088f4 = (typeof _0x1978f2["_bizRev"] === "number" ? _0x1978f2['_bizRev'] : 0x0) + 0x1;
        _0x41a245["nodes"][_0x461b4d] = {
          ..._0x1978f2,
          ..._0x28f3c7,
          '_bizRev': _0x4088f4
        };
        _0x1165f3["patch"](_0x1978f2, _0x41a245["nodes"][_0x461b4d]);
        _0x3602fe["touch"](_0x461b4d);
        _0x1bf917 !== _0x1978f2['parentId'] && _0x2ab2ae(_0x461b4d, _0x1bf917, _0x1978f2['parentId']);
        _0x5f4134 = !![];
      }
    }
    _0x5f4134 && (_0x1165f3["commit"](), _0x1671e3(), _0x1bbaa());
  }
  function _0x4c2dbb(_0x2504e9, _0x45c4d2, _0x1f0418, _0x480ea5) {
    const _0x549586 = _0x41a245["nodes"][_0x2504e9];
    const _0x1bde60 = _0x41a245['nodes'][_0x1f0418];
    const _0x4c0585 = Number(_0x45c4d2);
    const _0x4e8760 = Number(_0x480ea5);
    if (!_isValidStoryboardCellTarget(_0x549586, _0x4c0585) || !_isValidStoryboardCellTarget(_0x1bde60, _0x4e8760)) {
      return ![];
    }
    if (_0x2504e9 === _0x1f0418 && _0x4c0585 === _0x4e8760) {
      return ![];
    }
    const _0x5b1d80 = _0x549586["cells"]["slice"]();
    const _0x2ca132 = _0x549586["cells"][_0x4c0585];
    const _0x55b970 = _0x1bde60["cells"][_0x4e8760];
    if (_0x2504e9 === _0x1f0418) {
      _0x5b1d80[_0x4e8760] = _placeStoryboardCellForSwap(cloneStoryboardCellForSwapDestination(_0x2ca132), _0x2ca132, _0x549586, _0x4c0585, _0x549586, _0x4e8760);
      _0x5b1d80[_0x4c0585] = _placeStoryboardCellForSwap(cloneStoryboardCellForSwapDestination(_0x55b970), _0x55b970, _0x549586, _0x4e8760, _0x549586, _0x4c0585);
      _0x41a245["nodes"][_0x2504e9] = {
        ..._0x549586,
        'cells': _0x5b1d80,
        '_bizRev': (typeof _0x549586["_bizRev"] === "number" ? _0x549586["_bizRev"] : 0x0) + 0x1
      };
    } else {
      const _0x5522a0 = _0x1bde60['cells']["slice"]();
      _0x5522a0[_0x4e8760] = _placeStoryboardCellForSwap(cloneStoryboardCellForSwapDestination(_0x2ca132), _0x2ca132, _0x549586, _0x4c0585, _0x1bde60, _0x4e8760);
      _0x5b1d80[_0x4c0585] = normalizeEmptyStoryboardCell({
        ...cloneStoryboardCellForSwap(_0x2ca132),
        ..._getStoryboardCellPosition(_0x549586, _0x4c0585)
      });
      _0x41a245["nodes"][_0x2504e9] = {
        ..._0x549586,
        'cells': _0x5b1d80,
        '_bizRev': (typeof _0x549586["_bizRev"] === "number" ? _0x549586["_bizRev"] : 0x0) + 0x1
      };
      _0x41a245["nodes"][_0x1f0418] = {
        ..._0x1bde60,
        'cells': _0x5522a0,
        '_bizRev': (typeof _0x1bde60["_bizRev"] === "number" ? _0x1bde60["_bizRev"] : 0x0) + 0x1
      };
    }
    _0x261fd4["content"]();
    _0x3602fe['touch'](_0x2504e9);
    _0x3602fe["touch"](_0x1f0418);
    _0x1671e3();
    _0x1bbaa();
    return !![];
  }
  function _0x4f9b46(_0x598b7a, _0x2159f9) {
    const _0x507266 = _0x41a245['nodes'][_0x598b7a];
    if (!_0x507266) {
      return;
    }
    if (_0x507266['name'] === _0x2159f9) {
      return;
    }
    const _0x3adc23 = (typeof _0x507266["_bizRev"] === "number" ? _0x507266['_bizRev'] : 0x0) + 0x1;
    _0x41a245["nodes"][_0x598b7a] = {
      ..._0x507266,
      'name': _0x2159f9,
      '_bizRev': _0x3adc23
    };
    _0x3602fe["touch"](_0x598b7a);
    _0x261fd4["content"]();
    _0x1671e3();
    _0x1bbaa();
  }
  function _0x31ec0d(_0x36c88e) {
    _0x41a245['edges'][_0x36c88e] && (delete _0x41a245["edges"][_0x36c88e], _0x5b69fc(), _0x1671e3(), _0x1bbaa());
  }
  function _0x179702(_0x413c03, _0x51b1e3, _0x2f7e4d, _0x41208c) {
    _0x41a245["picker"] = {
      'visible': !![],
      'x': _0x2f7e4d,
      'y': _0x41208c,
      'screenX': _0x413c03,
      'screenY': _0x51b1e3
    };
    _0x1bbaa();
  }
  function _0x484822() {
    if (_0x41a245["picker"]?.['visible'] === ![]) {
      return;
    }
    _0x41a245["picker"] = {
      ..._0x41a245['picker'],
      'visible': ![]
    };
    _0x1bbaa();
  }
  function _0x3b0891() {
    return deepClone(_0x41a245);
  }
  function _0x4475f6() {
    return _0x41a245;
  }
  function _0x543cec(_0xa2cb2a, {
    preserveHistoryProjection = ![]
  } = {}) {
    if (!_0xa2cb2a) {
      return;
    }
    if (!preserveHistoryProjection) {
      _0x10ae00["clear"]();
    }
    _0x41a245["nodes"] = deepClone(_0xa2cb2a['nodes'] ?? {});
    _0x10ae00['prune'](_0x41a245["nodes"]);
    for (const [_0x1f1bcc, _0x15ccfb] of Object["entries"](_0x41a245["nodes"])) {
      _0x41a245["nodes"][_0x1f1bcc] = applyFeatureSelectionsToNodeData(_0x15ccfb, _0x41a245['ui']?.["featureSelections"] || {});
    }
    normalizeNodesCollection(_0x41a245["nodes"]);
    _0x41a245['edges'] = deepClone(_0xa2cb2a['edges'] ?? {});
    _0x41a245["viewport"] = _0x3a3866["attach"](deepClone(_0xa2cb2a['viewport'] ?? {
      'x': 0x0,
      'y': 0x0,
      'zoom': 0x1
    }));
    _0x41a245["_nodeCount"] = Object['keys'](_0x41a245["nodes"])["length"];
    for (const _0x408b3a of Object["values"](_0x41a245['nodes'])) {
      if (!_0x408b3a || typeof _0x408b3a !== 'object') {
        continue;
      }
      if (typeof _0x408b3a["_bizRev"] !== "number") {
        _0x408b3a["_bizRev"] = 0x1;
      }
    }
    _0x41a245['_parentToChildren'] = {};
    for (const [_0x3b3f37, _0x41b8e4] of Object["entries"](_0x41a245["nodes"])) {
      _0x41b8e4["parentId"] && _0x2ab2ae(_0x3b3f37, _0x41b8e4["parentId"]);
    }
    _0x5b69fc();
    _0x261fd4['reload']();
    _0x3602fe["reload"]();
    _0x1671e3();
    _0x1bbaa();
  }
  function _0x2c4822() {
    const _0x22e136 = {};
    for (const [_0x3bf316, _0x1fe4aa] of Object["entries"](_0x41a245["nodes"] || {})) {
      _0x22e136[_0x3bf316] = cloneNodeSnapshot(_0x1fe4aa, {
        'stripPanoramaViewport': !![]
      });
    }
    const _0x183fae = {};
    for (const [_0x5af605, _0x180600] of Object["entries"](_0x41a245["edges"] || {})) {
      _0x183fae[_0x5af605] = cloneEdgeSnapshot(_0x180600);
    }
    return {
      'nodes': _0x22e136,
      'edges': _0x183fae
    };
  }
  function _0x30f84b(_0x5e3d9d) {
    if (!_0x5e3d9d) {
      return;
    }
    const _0x428503 = _0x41a245["nodes"] || {};
    const _0x301644 = deepClone(_0x5e3d9d['nodes'] ?? {});
    for (const [_0x3e59b3, _0x3fcae3] of Object["entries"](_0x301644)) {
      if (!_0x3fcae3 || typeof _0x3fcae3 !== 'object') {
        continue;
      }
      const _0xaf8c06 = _0x428503[_0x3e59b3];
      if (_0x3fcae3['type'] === "panorama-scene") {
        const _0x4f51b9 = _0xaf8c06?.["sceneNode"]?.["viewport"];
        _0x4f51b9 && (_0x3fcae3["sceneNode"] = {
          ...(_0x3fcae3["sceneNode"] || {}),
          'viewport': deepClone(_0x4f51b9)
        });
      } else {
        if (_0x3fcae3["type"] === "panorama-360") {
          const _0x4f7c39 = _0xaf8c06?.["panorama360Node"]?.["viewport"];
          _0x4f7c39 && (_0x3fcae3["panorama360Node"] = {
            ...(_0x3fcae3["panorama360Node"] || {}),
            'viewport': deepClone(_0x4f7c39)
          });
        }
      }
      _0x10ae00["restore"](_0x3fcae3, _0xaf8c06);
    }
    _0x543cec({
      ..._0x5e3d9d,
      'nodes': _0x301644,
      'viewport': cloneViewportSnapshot(_0x41a245["viewport"])
    }, {
      'preserveHistoryProjection': !![]
    });
  }
  function _0x1dd149(_0x3b4c03) {
    const _0x55183e = Object["values"](_0x41a245["edges"])['filter'](_0x2004a8 => _0x2004a8["targetId"] === _0x3b4c03);
    return _0x55183e["map"](_0xb7862a => _0x41a245["nodes"][_0xb7862a['sourceId']])["filter"](_0x574f10 => !!_0x574f10);
  }
  function _0x58b796(_0x30aa8c, _0x3e9d1a) {
    if (!_0x3e9d1a || typeof _0x3e9d1a !== "object") {
      return ![];
    }
    for (const [_0x5a550b, _0x57f461] of Object["entries"](_0x3e9d1a)) {
      if (_0x30aa8c?.[_0x5a550b] !== _0x57f461) {
        return !![];
      }
    }
    return ![];
  }
  function _0x545900(_0x3a5f74, _0x34c2f1) {
    if (_0x3a5f74 === _0x34c2f1) {
      return !![];
    }
    if (!Array["isArray"](_0x3a5f74) || !Array["isArray"](_0x34c2f1)) {
      return ![];
    }
    if (_0x3a5f74["length"] !== _0x34c2f1["length"]) {
      return ![];
    }
    for (let _0x5c3e0a = 0x0; _0x5c3e0a < _0x3a5f74["length"]; _0x5c3e0a += 0x1) {
      if (!Object['is'](_0x3a5f74[_0x5c3e0a], _0x34c2f1[_0x5c3e0a])) {
        return ![];
      }
    }
    return !![];
  }
  function _0x3e8723(_0x42c30a, _0x49841a) {
    if (_0x42c30a === _0x49841a) {
      return !![];
    }
    if (!_0x42c30a || !_0x49841a || typeof _0x42c30a !== "object" || typeof _0x49841a !== 'object' || Array["isArray"](_0x42c30a) || Array["isArray"](_0x49841a)) {
      return ![];
    }
    const _0x51df8d = Object["keys"](_0x42c30a);
    const _0x13f9e2 = Object["keys"](_0x49841a);
    if (_0x51df8d["length"] !== _0x13f9e2["length"]) {
      return ![];
    }
    for (const _0x154b37 of _0x51df8d) {
      if (!Object["prototype"]["hasOwnProperty"]["call"](_0x49841a, _0x154b37)) {
        return ![];
      }
      const _0x26e219 = _0x42c30a[_0x154b37];
      const _0x6b999b = _0x49841a[_0x154b37];
      if (Array['isArray'](_0x26e219) || Array['isArray'](_0x6b999b)) {
        if (!_0x545900(_0x26e219, _0x6b999b)) {
          return ![];
        }
      } else {
        if (!Object['is'](_0x26e219, _0x6b999b)) {
          return ![];
        }
      }
    }
    return !![];
  }
  function _0x28fc85(_0x5d223e) {
    if (!_0x5d223e || typeof _0x5d223e !== "object") {
      return;
    }
    if (!_0x58b796(_0x41a245["selectionBox"], _0x5d223e)) {
      return;
    }
    _0x41a245["selectionBox"] = {
      ..._0x41a245["selectionBox"],
      ..._0x5d223e
    };
    _0x1bbaa();
  }
  function _0x1b5d8f(_0x272de0) {
    const _0x286ab8 = _0x272de0 || {};
    if (!_0x58b796(_0x41a245["selectionMeta"], _0x286ab8)) {
      return;
    }
    _0x41a245["selectionMeta"] = {
      ..._0x41a245["selectionMeta"],
      ..._0x286ab8
    };
    _0x1bbaa();
  }
  function _0x9f5daa(_0x6bf1b3) {
    const _0x3f1a94 = Array["from"](_0x6bf1b3 || []);
    if (_0x545900(_0x41a245["selectedNodeIds"], _0x3f1a94)) {
      return;
    }
    _0x41a245['selectedNodeIds'] = _0x3f1a94;
    _0x1bbaa();
  }
  function _0x355d7b() {
    const _0x50fcb7 = _0x41a245["selectionBox"]?.["active"] === !![];
    const _0x34c486 = Array['isArray'](_0x41a245["selectedNodeIds"]) ? _0x41a245['selectedNodeIds']["length"] > 0x0 : ![];
    const _0x36cb82 = _0x41a245['selectionMeta']?.['source'] != null;
    if (!_0x50fcb7 && !_0x34c486 && !_0x36cb82) {
      return;
    }
    _0x41a245["selectionBox"]["active"] = ![];
    _0x41a245["selectedNodeIds"] = [];
    _0x41a245["selectionMeta"]["source"] = null;
    _0x1bbaa();
  }
  function _0x52e249(_0x590e72, _0xd2642a, _0x548ee9) {
    _0x41a245["contextMenu"] = {
      'visible': !![],
      'x': _0x590e72,
      'y': _0xd2642a,
      'items': _0x548ee9
    };
    _0x1bbaa();
  }
  function _0x501afa() {
    if (_0x41a245["contextMenu"]?.["visible"] !== !![]) {
      return;
    }
    _0x41a245["contextMenu"] = {
      'visible': ![],
      'x': 0x0,
      'y': 0x0,
      'items': []
    };
    _0x1bbaa();
  }
  function _0x427c06({
    srcId: _0x69343d,
    invalidNodeIds: _0x427e90,
    hoverId: _0xb18367,
    side: _0x407bf3
  }) {
    const _0x4d7cfa = {
      'srcId': _0x69343d !== undefined ? _0x69343d : _0x41a245["connOverlay"]['srcId'],
      'invalidNodeIds': _0x427e90 !== undefined ? Array["isArray"](_0x427e90) ? _0x427e90 : [] : _0x41a245['connOverlay']["invalidNodeIds"],
      'hoverId': _0xb18367 !== undefined ? _0xb18367 : _0x41a245["connOverlay"]["hoverId"],
      'side': _0x407bf3 !== undefined ? _0x407bf3 : _0x41a245['connOverlay']["side"]
    };
    if (_0x3e8723(_0x41a245["connOverlay"], _0x4d7cfa)) {
      return;
    }
    _0x41a245['connOverlay'] = _0x4d7cfa;
    _0x1bbaa();
  }
  function _0x2a5257() {
    const _0x50c29a = {
      'srcId': null,
      'invalidNodeIds': [],
      'hoverId': null,
      'side': null
    };
    if (_0x3e8723(_0x41a245["connOverlay"], _0x50c29a)) {
      return;
    }
    _0x41a245["connOverlay"] = _0x50c29a;
    _0x1bbaa();
  }
  function _0x2b822f(_0x5c4e16) {
    const _0x401020 = _0x41a245["nodes"]?.[_0x5c4e16];
    return _0x401020 ? sanitizeNodeForPersistence(cloneNodeSnapshot(_0x401020, {
      'stripRichText': !![]
    })) : null;
  }
  function _0x15c39a() {
    const _0x5ab825 = Object["values"](_0x41a245["nodes"] || {})["map"](_0x579381 => cloneNodeSnapshot(_0x579381, {
      'stripRichText': !![]
    }));
    const _0x4f1e4b = Object["values"](_0x41a245["edges"] || {})["map"](_0xaf4f8a => cloneEdgeSnapshot(_0xaf4f8a));
    const _0x796e2b = {
      'nodes': _0x5ab825,
      'edges': _0x4f1e4b,
      'viewport': _0x3a3866['strip'](_0x41a245['viewport']),
      'assets': Array['isArray'](_0x41a245["assets"]) ? _0x41a245["assets"]["map"](_0x50ffcf => cloneAssetSnapshot(_0x50ffcf)) : [],
      'storyboard3dProjects': cloneStoryboard3DProjects(_0x41a245['storyboard3dProjects'], deepClone)
    };
    return sanitizeSerializedCanvasData(_0x796e2b);
  }
  function _0x55d2ba(_0x4c61f6, {
    preserveLiveGeneration = ![]
  } = {}) {
    if (!_0x4c61f6) {
      return;
    }
    _0x10ae00['clear']();
    const _0x5cdc20 = Date["now"]();
    const _0x306071 = _0x41a245['ui']?.["featureSelections"] || {};
    _0x4c61f6["viewport"] && (_0x41a245['viewport'] = _0x3a3866['attach'](cloneViewportSnapshot(_0x4c61f6['viewport'])));
    _0x41a245["nodes"] = {};
    _0x41a245["_parentToChildren"] = {};
    let _0x4e17c5 = 0x0;
    if (Array["isArray"](_0x4c61f6['nodes'])) {
      _0x4c61f6["nodes"]["forEach"](_0x77252d => {
        if (!_0x77252d || typeof _0x77252d !== "object") {
          return;
        }
        const _0x1a02cf = cloneNodeSnapshot(_0x77252d, {
          'hydratedAt': _0x5cdc20,
          'featureSelections': _0x306071,
          'preserveLiveGeneration': preserveLiveGeneration
        });
        _0x41a245["nodes"][_0x1a02cf['id']] = _0x1a02cf;
        _0x4e17c5 += 0x1;
        _0x1a02cf['parentId'] && _0x2ab2ae(_0x1a02cf['id'], _0x1a02cf['parentId']);
      });
    } else {
      if (_0x4c61f6["nodes"] && typeof _0x4c61f6['nodes'] === "object") {
        for (const [_0x6be0d2, _0x14f825] of Object['entries'](_0x4c61f6["nodes"])) {
          if (!_0x14f825 || typeof _0x14f825 !== "object") {
            continue;
          }
          const _0x2354d4 = cloneNodeSnapshot(_0x14f825['id'] ? _0x14f825 : {
            ..._0x14f825,
            'id': _0x6be0d2
          }, {
            'hydratedAt': _0x5cdc20,
            'featureSelections': _0x306071,
            'preserveLiveGeneration': preserveLiveGeneration
          });
          _0x41a245['nodes'][_0x6be0d2] = _0x2354d4;
          _0x4e17c5 += 0x1;
          _0x2354d4["parentId"] && _0x2ab2ae(_0x6be0d2, _0x2354d4["parentId"]);
        }
      }
    }
    _0x41a245["_nodeCount"] = _0x4e17c5;
    const _0x33ce31 = {};
    if (Array["isArray"](_0x4c61f6['edges'])) {
      for (const _0x2500d2 of _0x4c61f6["edges"]) {
        if (!_0x2500d2 || typeof _0x2500d2 !== "object") {
          continue;
        }
        _0x33ce31[_0x2500d2['id']] = cloneEdgeSnapshot(_0x2500d2);
      }
    } else {
      if (_0x4c61f6['edges'] && typeof _0x4c61f6["edges"] === "object") {
        for (const [_0x478be1, _0x1f079e] of Object["entries"](_0x4c61f6["edges"])) {
          if (!_0x1f079e || typeof _0x1f079e !== "object") {
            continue;
          }
          const _0x4575b2 = cloneEdgeSnapshot(_0x1f079e);
          if (_0x4575b2['id'] == null) {
            _0x4575b2['id'] = _0x478be1;
          }
          _0x33ce31[_0x4575b2['id']] = _0x4575b2;
        }
      }
    }
    _0x41a245["edges"] = _0x33ce31;
    _0x5b69fc();
    _0x41a245["assets"] = Array["isArray"](_0x4c61f6["assets"]) ? _0x4c61f6['assets']["map"](_0x2db8be => cloneAssetSnapshot(_0x2db8be)) : [];
    _0x41a245["storyboard3dProjects"] = cloneStoryboard3DProjects(_0x4c61f6['storyboard3dProjects'], deepClone);
    _0x261fd4["reload"]();
    _0x3602fe["reload"]();
    _0x1671e3();
    _0x1bbaa();
  }
  function _0x5c2629(_0x50dcac, _0x2378d2 = {}) {
    _0x55d2ba(_0x50dcac, _0x2378d2);
  }
  function _0x2574c4(_0x2518c6) {
    if (!_0x2518c6) {
      return;
    }
    const _0x352a01 = deepClone(_0x2518c6);
    _0x55d2ba(_0x352a01);
  }
  function _0x46f3e4({
    active: _0x4a9ad9,
    sourceNodeId = null,
    handleDirection = null,
    hoverNodeId = null
  }) {
    _0x41a245["pickConnectMode"] = {
      'active': _0x4a9ad9,
      'sourceNodeId': sourceNodeId,
      'handleDirection': handleDirection,
      'hoverNodeId': hoverNodeId
    };
    _0x1bbaa();
  }
  function _0x3b82b3(_0x77b478) {
    if (_0x41a245["isServerConnected"] === _0x77b478) {
      return;
    }
    _0x41a245["isServerConnected"] = _0x77b478;
    _0x1bbaa();
  }
  function _0x2c3794(_0x13cbf3) {
    if (!_0x41a245["pickConnectMode"] || !_0x41a245["pickConnectMode"]['active']) {
      return;
    }
    if (_0x41a245["pickConnectMode"]["hoverNodeId"] === _0x13cbf3) {
      return;
    }
    _0x41a245['pickConnectMode'] = {
      ..._0x41a245["pickConnectMode"],
      'hoverNodeId': _0x13cbf3
    };
    _0x1bbaa();
  }
  function _0x54f9e6(_0xf6e683) {
    const _0x3fdf8a = _0x41a245["annotate"] || {};
    const _0x3b40a4 = _0xf6e683 || {};
    if (!_0x58b796(_0x3fdf8a, _0x3b40a4)) {
      return;
    }
    const _0xb8d141 = {
      ..._0x3fdf8a,
      ..._0x3b40a4
    };
    _0x41a245['annotate'] = _0xb8d141;
    _0x1bbaa();
  }
  function _0x1f0472(_0x3fbbc3) {
    const _0x21b476 = _0x41a245['matting'] || {};
    const _0x5a2e88 = _0x3fbbc3 || {};
    if (!_0x58b796(_0x21b476, _0x5a2e88)) {
      return;
    }
    const _0x221669 = {
      ..._0x21b476,
      ..._0x5a2e88
    };
    _0x41a245['matting'] = _0x221669;
    _0x1bbaa();
  }
  function _0x561651(_0x144311) {
    const _0x200e33 = _0x41a245["videoKeying"] || {};
    const _0x5e7091 = _0x144311 || {};
    if (!_0x58b796(_0x200e33, _0x5e7091)) {
      return;
    }
    const _0x46fe65 = {
      ..._0x200e33,
      ..._0x5e7091
    };
    _0x41a245["videoKeying"] = _0x46fe65;
    _0x1bbaa();
  }
  function _0x141721(_0x2ec2f4) {
    const _0x3c90db = _0x41a245["videoClip"] || {};
    const _0x100e27 = _0x2ec2f4 || {};
    if (!_0x58b796(_0x3c90db, _0x100e27)) {
      return;
    }
    const _0x57e700 = {
      ..._0x3c90db,
      ..._0x100e27
    };
    _0x41a245["videoClip"] = _0x57e700;
    _0x1bbaa();
  }
  function _0x4d11fc(_0x34a2e8) {
    if (_0x41a245["theme"] === _0x34a2e8) {
      return;
    }
    _0x41a245["theme"] = _0x34a2e8;
    _0x1bbaa();
  }
  function _0x4cfb4b() {
    const _0x175d44 = _0x41a245['theme'] === "dark" ? "light" : "dark";
    _0x4d11fc(_0x175d44);
  }
  function _0x448c6d(_0x5d9106 = "dark") {
    const _0x278afb = _0x5d9106 === "light" ? "light" : "dark";
    _0x41a245['theme'] = _0x278afb;
  }
  function _0x44704c(_0x2a1da6 = {}) {
    if (!_0x41a245['ui']) {
      _0x41a245['ui'] = {};
    }
    _0x41a245['ui']['featureSelections'] = sanitizeFeatureSelectionsRecord(_0x2a1da6);
  }
  function _0x1ec01e(_0x30a4a2, _0x386e63, _0x2d4d4f = undefined) {
    const _0xc676c = String(_0x30a4a2 || '')["trim"]();
    const _0x2c35e7 = String(_0x386e63 || '')["trim"]();
    if (!_0xc676c || !_0x2c35e7) {
      return _0x2d4d4f;
    }
    const _0x577a65 = _0x41a245['ui']?.["featureSelections"]?.[_0xc676c]?.[_0x2c35e7];
    return _0x577a65 === undefined ? _0x2d4d4f : _0x577a65;
  }
  function _0x44304e(_0x2fe47a, _0x42c88a, _0x5431da) {
    const _0x4d304c = String(_0x2fe47a || '')["trim"]();
    const _0x3f4e58 = String(_0x42c88a || '')["trim"]();
    if (!_0x4d304c || !_0x3f4e58) {
      return;
    }
    if (!_0x41a245['ui']) {
      _0x41a245['ui'] = {};
    }
    (!_0x41a245['ui']["featureSelections"] || typeof _0x41a245['ui']["featureSelections"] !== "object") && (_0x41a245['ui']["featureSelections"] = {});
    const _0xef9cd8 = _0x41a245['ui']["featureSelections"][_0x4d304c] || {};
    if (_0xef9cd8[_0x3f4e58] === _0x5431da) {
      return;
    }
    _0x41a245['ui']["featureSelections"] = {
      ..._0x41a245['ui']["featureSelections"],
      [_0x4d304c]: {
        ..._0xef9cd8,
        [_0x3f4e58]: _0x5431da
      }
    };
    _0x1bbaa();
  }
  function _0x3622a8(_0xc42a65, _0x350811) {
    if (_0x41a245['ui'] && _0x41a245['ui'][_0xc42a65] === _0x350811) {
      return;
    }
    if (!_0x41a245['ui']) {
      _0x41a245['ui'] = {};
    }
    _0x41a245['ui'][_0xc42a65] = _0x350811;
    _0x1bbaa();
  }
  function _0x1547f8(_0x5d47ab) {
    _0x3622a8("showVideoMeta", _0x5d47ab === !![]);
  }
  function _0x326d43(_0x16d9e7) {
    _0x3622a8('showSelectionMediaProperties', _0x16d9e7 !== ![]);
  }
  function _0x5beed3(_0x33d2ae) {
    _0x3622a8("titleFollowsCanvasZoom", _0x33d2ae === !![]);
  }
  function _0xb0f00b(_0x6e3f56) {
    _0x3622a8("promptBoxResizeEnabled", _0x6e3f56 !== ![]);
  }
  function _0x5759d2(_0x1c2c40) {
    _0x3622a8("promptEnterBehavior", _0x1c2c40 === "newline" ? 'newline' : "submit");
  }
  function _0x385d75(_0x9916f) {
    _0x3622a8("promptAttachmentButtonHidden", _0x9916f === !![]);
  }
  function _0x1af6e1(_0x272cf5) {
    _0x3622a8("promptPresetButtonHidden", _0x272cf5 === !![]);
  }
  function _0x36ca5e(_0x541ad2) {
    _0x3622a8("videoAudioDefaultEnabled", _0x541ad2 === !![]);
  }
  function _0x166ace(_0x546e41) {
    _0x3622a8("canvasToolbarPlacement", normalizeCanvasToolbarPlacement(_0x546e41));
  }
  function _0x45246d(_0x5a37b) {
    _0x3622a8("nodeManagerPlacement", normalizeNodeManagerPlacement(_0x5a37b));
  }
  function _0x3cf29b(_0x15e332) {
    _0x3622a8('leftSidebarAutoHideEnabled', _0x15e332 === !![]);
  }
  function _0x120469(_0x21b9bd) {
    _0x3622a8('bottomLeftBarAutoHideEnabled', _0x21b9bd === !![]);
  }
  function _0x5c1423(_0x399fbe) {
    _0x3622a8("imageVideoNodeResizeEnabled", _0x399fbe === !![]);
  }
  function _0x1cc982(_0x23e571, _0x305b71, _0x3cd560, _0x5672eb) {
    const _0x56a4d6 = _0x3cd560(_0x305b71);
    if (!_0x41a245['ui']) {
      _0x41a245['ui'] = {};
    }
    if (_0x5672eb(_0x41a245['ui'][_0x23e571]) === _0x5672eb(_0x56a4d6)) {
      return;
    }
    _0x41a245['ui'][_0x23e571] = _0x56a4d6;
    _0x1bbaa();
  }
  function _0xf3c4ba(_0x38b749) {
    _0x1cc982("imageToolbarLayout", _0x38b749, normalizeImageToolbarLayout, serializeImageToolbarLayout);
  }
  function _0x3f3cb0(_0x5bbdeb) {
    _0x1cc982("videoToolbarLayout", _0x5bbdeb, normalizeVideoToolbarLayout, serializeVideoToolbarLayout);
  }
  function _0x5ea52e(_0x3333b6) {
    const _0x55f6b4 = _0x3333b6 !== ![];
    if (_0x41a245['ui'] && _0x41a245['ui']['alignFeatureEnabled'] === _0x55f6b4) {
      return;
    }
    if (!_0x41a245['ui']) {
      _0x41a245['ui'] = {};
    }
    _0x41a245['ui']["alignFeatureEnabled"] = _0x55f6b4;
    if (!_0x55f6b4) {
      _0x41a245['ui']["alignFeatureTriggerMode"] = "off";
      _0x41a245['ui']["alignPanelVisible"] = ![];
      _0x41a245['ui']["alignPanelAnchorWorld"] = null;
    } else {
      _0x41a245['ui']['alignFeatureTriggerMode'] === "off" && (_0x41a245['ui']["alignFeatureTriggerMode"] = "click");
    }
    _0x1bbaa();
  }
  function _0x2ffc5d(_0x330557) {
    const _0x5a0334 = _0x330557 === 'hold' || _0x330557 === "click" || _0x330557 === "off" ? _0x330557 : "click";
    if (!_0x41a245['ui']) {
      _0x41a245['ui'] = {};
    }
    if (_0x41a245['ui']["alignFeatureTriggerMode"] === _0x5a0334) {
      return;
    }
    _0x41a245['ui']["alignFeatureTriggerMode"] = _0x5a0334;
    _0x41a245['ui']["alignFeatureEnabled"] = _0x5a0334 !== "off";
    _0x5a0334 === "off" && (_0x41a245['ui']["alignPanelVisible"] = ![], _0x41a245['ui']["alignPanelAnchorWorld"] = null);
    _0x1bbaa();
  }
  function _0x5c4d7b(_0x14f2ef) {
    const _0x5b3c88 = Number(_0x14f2ef);
    const _0x260db6 = Number["isFinite"](_0x5b3c88) ? Math["max"](0x0, Math['min'](0xc8, Math["round"](_0x5b3c88))) : 0x28;
    if (_0x41a245['ui'] && _0x41a245['ui']["alignDistributeGap"] === _0x260db6) {
      return;
    }
    if (!_0x41a245['ui']) {
      _0x41a245['ui'] = {};
    }
    _0x41a245['ui']['alignDistributeGap'] = _0x260db6;
    _0x1bbaa();
  }
  function _0x5d7138(_0x5a31e5) {
    const _0x29eb13 = _0x5a31e5 === !![];
    if (!_0x41a245['ui']) {
      _0x41a245['ui'] = {};
    }
    if (!_0x29eb13) {
      const _0x38b8af = !!_0x41a245['ui']["alignPanelAnchorWorld"];
      if (_0x41a245['ui']["alignPanelVisible"] === _0x29eb13 && !_0x38b8af) {
        return;
      }
      _0x41a245['ui']["alignPanelVisible"] = ![];
      _0x41a245['ui']["alignPanelAnchorWorld"] = null;
      _0x1bbaa();
      return;
    }
    if (_0x41a245['ui']["alignPanelVisible"] === _0x29eb13) {
      return;
    }
    _0x41a245['ui']["alignPanelVisible"] = _0x29eb13;
    _0x1bbaa();
  }
  function _0x33b840(_0x297fdb) {
    if (!_0x41a245['ui']) {
      _0x41a245['ui'] = {};
    }
    let _0x5824ca = null;
    _0x297fdb && Number["isFinite"](_0x297fdb['x']) && Number["isFinite"](_0x297fdb['y']) && (_0x5824ca = {
      'x': Number(_0x297fdb['x']),
      'y': Number(_0x297fdb['y'])
    });
    const _0x55993d = _0x41a245['ui']['alignPanelAnchorWorld'];
    const _0x39f1da = !_0x55993d && !_0x5824ca || _0x55993d && _0x5824ca && Number(_0x55993d['x']) === Number(_0x5824ca['x']) && Number(_0x55993d['y']) === Number(_0x5824ca['y']);
    if (_0x39f1da) {
      return;
    }
    _0x41a245['ui']["alignPanelAnchorWorld"] = _0x5824ca;
    _0x1bbaa();
  }
  function _0x218cdf(_0x5dfd91) {
    const _0x225783 = _0x5dfd91 !== ![];
    if (_0x41a245['ui'] && _0x41a245['ui']["snapGuidesEnabled"] === _0x225783) {
      return;
    }
    if (!_0x41a245['ui']) {
      _0x41a245['ui'] = {};
    }
    _0x41a245['ui']['snapGuidesEnabled'] = _0x225783;
    _0x1bbaa();
  }
  function _0x3fbf1e(_0x10c978) {
    const _0x3bc378 = _0x10c978 !== ![];
    if (_0x41a245['ui'] && _0x41a245['ui']['selectionRelatedHighlightEnabled'] === _0x3bc378) {
      return;
    }
    if (!_0x41a245['ui']) {
      _0x41a245['ui'] = {};
    }
    _0x41a245['ui']["selectionRelatedHighlightEnabled"] = _0x3bc378;
    _0x1bbaa();
  }
  function _0xbcf337(_0x426120) {
    const _0x5062c4 = String(_0x426120 || '')["trim"]();
    return ['white', "blue", 'green', "cyan", "purple", "red", 'yellow']['includes'](_0x5062c4) ? _0x5062c4 : "white";
  }
  function _0x455567(_0x1b61b1) {
    const _0x57d400 = _0xbcf337(_0x1b61b1);
    if (_0x41a245['ui'] && _0x41a245['ui']["selectionRelatedHighlightColor"] === _0x57d400) {
      return;
    }
    if (!_0x41a245['ui']) {
      _0x41a245['ui'] = {};
    }
    _0x41a245['ui']["selectionRelatedHighlightColor"] = _0x57d400;
    _0x1bbaa();
  }
  function _0x2867a3(_0x63f913) {
    const _0x55f8fe = _0x63f913 !== ![];
    if (_0x41a245['ui'] && _0x41a245['ui']["connectionLinesVisible"] === _0x55f8fe) {
      return;
    }
    if (!_0x41a245['ui']) {
      _0x41a245['ui'] = {};
    }
    _0x41a245['ui']["connectionLinesVisible"] = _0x55f8fe;
    _0x1bbaa();
  }
  function _0x28cdcb(_0x412ec1) {
    const _0x225ad1 = normalizeConnectionLineStyle(_0x412ec1);
    if (_0x41a245['ui'] && _0x41a245['ui']["connectionLineStyle"] === _0x225ad1) {
      return;
    }
    if (!_0x41a245['ui']) {
      _0x41a245['ui'] = {};
    }
    _0x41a245['ui']["connectionLineStyle"] = _0x225ad1;
    _0x1bbaa();
  }
  function _0x57be81(_0xba362b = {}) {
    const _0x23d136 = _0xba362b?.['showSelectionMediaProperties'] !== ![];
    const _0x4633cb = _0xba362b?.["titleFollowsCanvasZoom"] === !![];
    const _0x1a366a = _0xba362b?.['promptBoxResizeEnabled'] !== ![];
    const _0x2b1dd1 = _0xba362b?.["promptAttachmentButtonHidden"] === !![];
    const _0xc7e7d9 = _0xba362b?.['imageVideoNodeResizeEnabled'] === !![];
    const _0xdaccdf = _0xba362b?.["selectionRelatedHighlightEnabled"] !== ![];
    const _0x2a8054 = _0xbcf337(_0xba362b?.["selectionRelatedHighlightColor"]);
    const _0x3ed106 = _0xba362b?.["connectionLinesVisible"] !== ![];
    const _0x353601 = normalizeConnectionLineStyle(_0xba362b?.["connectionLineStyle"]);
    const _0x42af49 = String(_0xba362b?.["alignFeatureTriggerMode"] || '')['trim']();
    const _0x38f3e1 = _0x42af49 === "hold" || _0x42af49 === "click" || _0x42af49 === "off" ? _0x42af49 : _0xba362b?.["alignFeatureEnabled"] === ![] ? 'off' : 'click';
    const _0x3d309e = _0xba362b?.["alignFeatureEnabled"] === ![] ? ![] : _0x38f3e1 !== "off";
    const _0x28bc00 = Number(_0xba362b?.["alignDistributeGap"]);
    const _0x55919b = Number["isFinite"](_0x28bc00) ? Math["max"](0x0, Math["min"](0xc8, Math["round"](_0x28bc00))) : 0x28;
    const _0x444dde = _0xba362b?.['snapGuidesEnabled'] !== ![];
    if (!_0x41a245['ui']) {
      _0x41a245['ui'] = {};
    }
    _0x41a245['ui']["showVideoMeta"] = ![];
    _0x41a245['ui']["showSelectionMediaProperties"] = _0x23d136;
    _0x41a245['ui']['titleFollowsCanvasZoom'] = _0x4633cb;
    _0x41a245['ui']["promptBoxResizeEnabled"] = _0x1a366a;
    _0x41a245['ui']["promptEnterBehavior"] = _0xba362b?.["promptEnterBehavior"] === "newline" ? 'newline' : 'submit';
    _0x41a245['ui']["promptAttachmentButtonHidden"] = _0x2b1dd1;
    _0x41a245['ui']['promptPresetButtonHidden'] = _0xba362b?.["promptPresetButtonHidden"] === !![];
    _0x41a245['ui']["videoAudioDefaultEnabled"] = _0xba362b?.['videoAudioDefaultEnabled'] === !![];
    _0x41a245['ui']["canvasToolbarPlacement"] = normalizeCanvasToolbarPlacement(_0xba362b?.['canvasToolbarPlacement']);
    _0x41a245['ui']["nodeManagerPlacement"] = normalizeNodeManagerPlacement(_0xba362b?.["nodeManagerPlacement"]);
    _0x41a245['ui']['leftSidebarAutoHideEnabled'] = _0xba362b?.["leftSidebarAutoHideEnabled"] === !![];
    _0x41a245['ui']["bottomLeftBarAutoHideEnabled"] = _0xba362b?.['bottomLeftBarAutoHideEnabled'] === !![];
    _0x41a245['ui']["imageVideoNodeResizeEnabled"] = _0xc7e7d9;
    _0x41a245['ui']['imageToolbarLayout'] = normalizeImageToolbarLayout(_0xba362b?.["imageToolbarLayout"]);
    _0x41a245['ui']["videoToolbarLayout"] = normalizeVideoToolbarLayout(_0xba362b?.['videoToolbarLayout']);
    _0x41a245['ui']["selectionRelatedHighlightEnabled"] = _0xdaccdf;
    _0x41a245['ui']["selectionRelatedHighlightColor"] = _0x2a8054;
    _0x41a245['ui']["connectionLinesVisible"] = _0x3ed106;
    _0x41a245['ui']["connectionLineStyle"] = _0x353601;
    _0x41a245['ui']["alignFeatureEnabled"] = _0x3d309e;
    _0x41a245['ui']["alignFeatureTriggerMode"] = _0x38f3e1;
    _0x41a245['ui']["alignDistributeGap"] = _0x55919b;
    _0x41a245['ui']['alignPanelVisible'] = ![];
    _0x41a245['ui']['alignPanelAnchorWorld'] = null;
    _0x41a245['ui']["snapGuidesEnabled"] = _0x444dde;
    _0x44704c(_0xba362b?.["featureSelections"] || {});
    _0x1bbaa();
  }
  function _0x479319(_0x1b72c6, _0x3d5f33) {
    const _0x29c783 = _0x41a245[_0x1b72c6] || {};
    _0x41a245[_0x1b72c6] = {
      ..._0x29c783,
      ...(_0x3d5f33 || {})
    };
    _0x1bbaa();
  }
  const _0x514ecf = _0x2810d5 => _0x479319("subscription", _0x2810d5);
  const _0x586d8c = _0x37f186 => _0x479319('modelCatalog', _0x37f186);
  const {
    upsertStoryboard3DProject: _0x4c2d9f,
    deleteStoryboard3DProject: _0x426d0a
  } = createStoryboard3DProjectActions({
    'readProjects': () => _0x41a245["storyboard3dProjects"],
    'writeProjects': _0x336bed => {
      _0x41a245["storyboard3dProjects"] = _0x336bed;
      _0x1671e3();
      _0x1bbaa();
    },
    'clone': deepClone
  });
  function _0x59545b(_0x50e41c) {
    if (!_0x50e41c || !_0x50e41c['id']) {
      throw new Error("[store] addAsset() 需要提供含有 id 字段的资产数据");
    }
    const _0x4ed176 = JSON["parse"](JSON["stringify"](_0x50e41c));
    if (!_0x41a245["assets"]) {
      _0x41a245['assets'] = [];
    }
    _0x41a245["assets"]["unshift"](_0x4ed176);
    _0x1671e3();
    _0x1bbaa();
  }
  function _0x3d3fd5(_0x250e5e) {
    if (!_0x41a245["assets"]) {
      return;
    }
    const _0xec103 = _0x41a245['assets']["length"];
    _0x41a245["assets"] = _0x41a245["assets"]["filter"](_0x297877 => _0x297877['id'] !== _0x250e5e);
    _0x41a245["assets"]['length'] !== _0xec103 && (_0x1671e3(), _0x1bbaa());
  }
  function _0x289822(_0x503dea, _0x4acc26) {
    if (!_0x41a245["assets"]) {
      return;
    }
    const _0x507b1 = _0x41a245["assets"]["findIndex"](_0x1aebef => _0x1aebef['id'] === _0x503dea);
    if (_0x507b1 !== -0x1) {
      const _0x161d96 = _0x41a245['assets'][_0x507b1];
      const _0x4e7617 = {
        ..._0x161d96,
        ..._0x4acc26
      };
      if (shallowEqual(_0x161d96, _0x4e7617)) {
        return;
      }
      _0x41a245["assets"][_0x507b1] = _0x4e7617;
      _0x1671e3();
      _0x1bbaa();
    }
  }
  function _0x139605() {
    (!_0x41a245['workflows'] || typeof _0x41a245['workflows'] !== "object") && (_0x41a245["workflows"] = {
      'items': [],
      'loading': ![],
      'error': null,
      'loadedAt': 0x0
    });
    !Array['isArray'](_0x41a245["workflows"]['items']) && (_0x41a245["workflows"]['items'] = []);
    (!_0x41a245["workflowUi"] || typeof _0x41a245["workflowUi"] !== 'object') && (_0x41a245["workflowUi"] = createInitialWorkflowUiState());
  }
  function _0x1cc7ae(_0x5c6aaa, _0x223b24 = null) {
    _0x139605();
    _0x41a245["workflows"] = {
      ..._0x41a245["workflows"],
      'loading': _0x5c6aaa === !![],
      'error': _0x223b24 == null ? null : String(_0x223b24)
    };
    _0x1bbaa();
  }
  function _0x5badaf(_0x50b290) {
    _0x139605();
    _0x41a245["workflows"] = {
      ..._0x41a245["workflows"],
      'items': Array["isArray"](_0x50b290) ? _0x50b290["map"](_0x4fced4 => cloneWorkflowSnapshot(_0x4fced4)) : [],
      'loading': ![],
      'error': null,
      'loadedAt': Date['now']()
    };
    _0x1bbaa();
  }
  function _0x9145f9(_0x435de7) {
    if (!_0x435de7 || !_0x435de7['id']) {
      return;
    }
    _0x139605();
    const _0x56cf58 = cloneWorkflowSnapshot(_0x435de7);
    const _0x4401b6 = _0x41a245["workflows"]['items']["findIndex"](_0x51fa54 => _0x51fa54?.['id'] === _0x56cf58['id']);
    _0x4401b6 >= 0x0 ? _0x41a245["workflows"]["items"][_0x4401b6] = {
      ..._0x41a245['workflows']["items"][_0x4401b6],
      ..._0x56cf58
    } : _0x41a245["workflows"]["items"]["unshift"](_0x56cf58);
    _0x1bbaa();
  }
  function _0x281782(_0x2cd437, _0x3a767b) {
    const _0x51c13b = String(_0x2cd437 || '')["trim"]();
    if (!_0x51c13b || !_0x3a767b || typeof _0x3a767b !== 'object') {
      return;
    }
    _0x139605();
    const _0x12b061 = _0x41a245["workflows"]["items"]["findIndex"](_0x23f6c9 => _0x23f6c9?.['id'] === _0x51c13b);
    if (_0x12b061 < 0x0) {
      return;
    }
    _0x41a245["workflows"]["items"][_0x12b061] = {
      ..._0x41a245['workflows']["items"][_0x12b061],
      ...cloneWorkflowSnapshot(_0x3a767b)
    };
    _0x1bbaa();
  }
  function _0x139f40(_0x3753ac, _0x47d633 = Date["now"]()) {
    _0x281782(_0x3753ac, {
      'lastUsedAt': _0x47d633
    });
  }
  function _0xfa05dc(_0x33ce9c) {
    if (!_0x33ce9c || typeof _0x33ce9c !== "object") {
      return;
    }
    _0x139605();
    const _0x3ab0d2 = {
      ..._0x41a245['workflowUi']
    };
    for (const [_0x2efcae, _0x19c176] of Object["entries"](_0x33ce9c)) {
      _0x2efcae === "draft" && _0x19c176 && typeof _0x19c176 === "object" ? _0x3ab0d2["draft"] = {
        ..._0x3ab0d2['draft'],
        ...cloneWorkflowSnapshot(_0x19c176)
      } : _0x3ab0d2[_0x2efcae] = cloneWorkflowSnapshot(_0x19c176);
    }
    _0x41a245["workflowUi"] = _0x3ab0d2;
    _0x1bbaa();
  }
  function _0x133312(_0x495c10) {
    if (!_0x495c10 || typeof _0x495c10 !== "object") {
      return;
    }
    _0x139605();
    _0x41a245["workflowUi"] = {
      ..._0x41a245["workflowUi"],
      'draft': {
        ...(_0x41a245["workflowUi"]["draft"] || createInitialWorkflowDraftState()),
        ...cloneWorkflowSnapshot(_0x495c10)
      }
    };
    _0x1bbaa();
  }
  function _0x589bc8(_0x3689e5 = {}) {
    _0x139605();
    _0x41a245["workflowUi"] = {
      ..._0x41a245["workflowUi"],
      'draft': {
        ...createInitialWorkflowDraftState(),
        ...cloneWorkflowSnapshot(_0x3689e5)
      },
      'tagDraft': '',
      'updateConfirmOpen': ![],
      'error': null
    };
    _0x1bbaa();
  }
  function _0x19b753({
    tab = "create",
    sourceGroupId = null
  } = {}) {
    _0x139605();
    _0x41a245["workflowUi"] = {
      ..._0x41a245["workflowUi"],
      'modalOpen': !![],
      'modalTab': tab === "update" ? "update" : "create",
      'sourceGroupId': sourceGroupId == null ? null : String(sourceGroupId || '')["trim"]() || null,
      'draft': createInitialWorkflowDraftState(),
      'tagDraft': '',
      'updateTargetId': null,
      'updateSearchKeyword': '',
      'updateConfirmOpen': ![],
      'saving': ![],
      'error': null
    };
    _0x1bbaa();
  }
  function _0x4f6f2b() {
    _0x139605();
    _0x41a245["workflowUi"] = {
      ..._0x41a245['workflowUi'],
      'modalOpen': ![],
      'modalTab': "create",
      'sourceGroupId': null,
      'draft': createInitialWorkflowDraftState(),
      'tagDraft': '',
      'updateTargetId': null,
      'updateSearchKeyword': '',
      'updateConfirmOpen': ![],
      'saving': ![],
      'error': null
    };
    _0x1bbaa();
  }
  function _0x5aba1f(_0x36242b) {
    _0xfa05dc({
      'saving': _0x36242b === !![]
    });
  }
  function _0x3ae36e(_0x4722bb) {
    const _0x54d843 = _0x4722bb == null ? null : String(_0x4722bb);
    _0xfa05dc({
      'applyingWorkflowId': _0x54d843 || null
    });
  }
  return {
    'subscribe': _0x2ea74a,
    'subscribeRaw': _0x1c2bdc,
    'subscribeSelector': _0xc8424f,
    'subscribeNodeField': _0x3602fe["subscribe"],
    'batch': _0x46d768,
    'requestRender': _0x232931,
    'invalidateUi': _0x17d5cd,
    'addNode': _0x2ea29b,
    'updateNodePosition': _0x4aa671,
    'moveNodes': _0xe1e48f,
    'moveNodesByOffsets': _0x2a613b,
    'deleteNodes': _0x50f041,
    'updateNodeData': _0x4d93ba,
    'updateNodesData': _0xe1d981,
    'swapStoryboardCells': _0x4c2dbb,
    'addEdge': _0x4ece32,
    'removeEdge': _0x31ec0d,
    'updateEdgesBatch': _0x53b06b,
    'updateViewport': _0x23903b,
    'setViewportScreenOrigin': _0x40ca8e,
    'setViewportPersistPolicy': _0x1d7695,
    'markViewportPersist': _0x48c7ef,
    'showPicker': _0x179702,
    'hidePicker': _0x484822,
    'loadState': _0x543cec,
    'loadHistorySnapshot': _0x30f84b,
    'getState': _0x3b0891,
    'getStateRaw': _0x4475f6,
    'getHistorySnapshot': _0x2c4822,
    'getSourcesForNode': _0x1dd149,
    'setSelectionBox': _0x28fc85,
    'setSelectionMeta': _0x1b5d8f,
    'setSelectedNodes': _0x9f5daa,
    'groupNodes': _0x4e5794,
    'getIncomingEdges': _0x19c883,
    'renameNode': _0x4f9b46,
    'clearSelection': _0x355d7b,
    'showContextMenu': _0x52e249,
    'hideContextMenu': _0x501afa,
    'setConnOverlay': _0x427c06,
    'clearConnOverlay': _0x2a5257,
    'setPickConnectMode': _0x46f3e4,
    'setPickConnectHover': _0x2c3794,
    'setServerConnection': _0x3b82b3,
    'setAnnotateState': _0x54f9e6,
    'setMattingState': _0x1f0472,
    'setVideoKeyingState': _0x561651,
    'setVideoClipState': _0x141721,
    'setTheme': _0x4d11fc,
    'toggleTheme': _0x4cfb4b,
    'initTheme': _0x448c6d,
    'setFeatureSelection': _0x44304e,
    'getFeatureSelection': _0x1ec01e,
    'initFeatureSelections': _0x44704c,
    'setShowVideoMeta': _0x1547f8,
    'setShowSelectionMediaProperties': _0x326d43,
    'setTitleFollowsCanvasZoom': _0x5beed3,
    'setPromptBoxResizeEnabled': _0xb0f00b,
    'setPromptEnterBehavior': _0x5759d2,
    'setPromptAttachmentButtonHidden': _0x385d75,
    'setPromptPresetButtonHidden': _0x1af6e1,
    'setVideoAudioDefaultEnabled': _0x36ca5e,
    'setCanvasToolbarPlacement': _0x166ace,
    'setNodeManagerPlacement': _0x45246d,
    'setLeftSidebarAutoHideEnabled': _0x3cf29b,
    'setBottomLeftBarAutoHideEnabled': _0x120469,
    'setImageVideoNodeResizeEnabled': _0x5c1423,
    'setImageToolbarLayout': _0xf3c4ba,
    'setVideoToolbarLayout': _0x3f3cb0,
    'setAlignFeatureEnabled': _0x5ea52e,
    'setAlignFeatureTriggerMode': _0x2ffc5d,
    'setAlignDistributeGap': _0x5c4d7b,
    'setAlignPanelVisible': _0x5d7138,
    'setAlignPanelAnchorWorld': _0x33b840,
    'setSnapGuidesEnabled': _0x218cdf,
    'setSelectionRelatedHighlightEnabled': _0x3fbf1e,
    'setSelectionRelatedHighlightColor': _0x455567,
    'setConnectionLinesVisible': _0x2867a3,
    'setConnectionLineStyle': _0x28cdcb,
    'setSubscriptionState': _0x514ecf,
    'setModelCatalogState': _0x586d8c,
    'initUiPrefs': _0x57be81,
    'addAsset': _0x59545b,
    'deleteAsset': _0x3d3fd5,
    'updateAsset': _0x289822,
    'upsertStoryboard3DProject': _0x4c2d9f,
    'deleteStoryboard3DProject': _0x426d0a,
    'setWorkflowsLoading': _0x1cc7ae,
    'setWorkflows': _0x5badaf,
    'upsertWorkflow': _0x9145f9,
    'updateWorkflowLocal': _0x281782,
    'markWorkflowUsed': _0x139f40,
    'setWorkflowUi': _0xfa05dc,
    'setWorkflowDraft': _0x133312,
    'resetWorkflowDraft': _0x589bc8,
    'openWorkflowModal': _0x19b753,
    'closeWorkflowModal': _0x4f6f2b,
    'setWorkflowSaving': _0x5aba1f,
    'setWorkflowApplying': _0x3ae36e,
    'serialize': _0x15c39a,
    'serializeNode': _0x2b822f,
    'hydrate': _0x2574c4,
    'hydrateTrustedSnapshot': _0x5c2629
  };
}
const legacyKernelStore = createStore();
export default legacyKernelStore;
export { createStore, createStore as createLegacyKernelStore };