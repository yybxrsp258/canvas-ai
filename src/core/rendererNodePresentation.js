import { isNodeType } from '../modules/registry.js';
import { getRefKindByNodeType } from '../modules/nodeMeta.js';
import { resolveModelProvider } from '../manifests/index.js';
import { t } from '../i18n/index.js';
import { shouldShowGenerationBusyUi } from './generationTaskUiState.js';
const FAST_PREVIEW_PRESENTATION_OWNER = "fast-preview";
const FAST_PREVIEW_OWNED_NODE_Z_INDEX = '10';
function normalizeRendererNodeZIndex(_0x373f6f) {
  const _0x107e94 = String(_0x373f6f ?? '')["trim"]();
  return _0x107e94 || FAST_PREVIEW_OWNED_NODE_Z_INDEX;
}
function resolveFastPreviewOwnedNodeZIndex(_0x321a7e) {
  const _0x29ec56 = Number["parseInt"](_0x321a7e, 0xa);
  const _0x35b803 = Number["parseInt"](FAST_PREVIEW_OWNED_NODE_Z_INDEX, 0xa);
  if (!Number["isFinite"](_0x29ec56)) {
    return FAST_PREVIEW_OWNED_NODE_Z_INDEX;
  }
  return String(Math["min"](_0x29ec56, _0x35b803));
}
function applyRendererNodePresentationZIndex(_0x48f18d) {
  if (!_0x48f18d?.["dataset"] || !_0x48f18d?.['style']) {
    return '';
  }
  const _0x8d975d = normalizeRendererNodeZIndex(_0x48f18d["dataset"]["rendererPresentationTargetZIndex"] || _0x48f18d['style']["zIndex"]);
  const _0x20d8b2 = _0x48f18d["dataset"]['rendererPresentationOwner'] === FAST_PREVIEW_PRESENTATION_OWNER && Number["parseInt"](_0x8d975d, 0xa) > Number(FAST_PREVIEW_OWNED_NODE_Z_INDEX) && !!_0x48f18d["querySelector"]?.(".text-prompt-panel") && !!_0x48f18d['querySelector']?.(".img-node-preview");
  _0x20d8b2 ? _0x48f18d["dataset"]['rendererPresentationUiLifted'] = 'true' : delete _0x48f18d["dataset"]["rendererPresentationUiLifted"];
  const _0x141f88 = _0x48f18d["dataset"]['rendererPresentationOwner'] === FAST_PREVIEW_PRESENTATION_OWNER && !_0x20d8b2 ? resolveFastPreviewOwnedNodeZIndex(_0x8d975d) : _0x8d975d;
  _0x48f18d["style"]["zIndex"] !== _0x141f88 && (_0x48f18d['style']["zIndex"] = _0x141f88);
  return _0x141f88;
}
export function syncRendererNodePresentationZIndex(_0xa8fd45, _0x5bf265) {
  if (!_0xa8fd45?.["dataset"] || !_0xa8fd45?.['style']) {
    return '';
  }
  const _0x4b68d2 = normalizeRendererNodeZIndex(_0x5bf265);
  _0xa8fd45["dataset"]["rendererPresentationTargetZIndex"] !== _0x4b68d2 && (_0xa8fd45['dataset']["rendererPresentationTargetZIndex"] = _0x4b68d2);
  return applyRendererNodePresentationZIndex(_0xa8fd45);
}
export function liftRendererNodePresentationZIndex(_0x1e3182, _0x31be24) {
  if (!_0x1e3182?.["dataset"] || !_0x1e3182?.["style"]) {
    return '';
  }
  const _0x187ffb = Number["parseInt"](_0x1e3182['dataset']["rendererPresentationTargetZIndex"] || _0x1e3182["style"]["zIndex"], 0xa);
  const _0x1babaf = Number['parseInt'](_0x31be24, 0xa);
  if (!Number['isFinite'](_0x187ffb) || Number["isFinite"](_0x1babaf) && _0x187ffb < _0x1babaf) {
    return syncRendererNodePresentationZIndex(_0x1e3182, _0x31be24);
  }
  return applyRendererNodePresentationZIndex(_0x1e3182);
}
export function syncRendererFastPreviewPresentationOwner(_0x2897f9, _0x4cf75e) {
  if (!_0x2897f9?.["dataset"] || !_0x2897f9?.['style']) {
    return ![];
  }
  !_0x2897f9["dataset"]["rendererPresentationTargetZIndex"] && (_0x2897f9["dataset"]["rendererPresentationTargetZIndex"] = normalizeRendererNodeZIndex(_0x2897f9["style"]["zIndex"]));
  if (_0x4cf75e === !![]) {
    _0x2897f9["dataset"]["rendererPresentationOwner"] !== FAST_PREVIEW_PRESENTATION_OWNER && (_0x2897f9['dataset']["rendererPresentationOwner"] = FAST_PREVIEW_PRESENTATION_OWNER);
  } else {
    _0x2897f9["dataset"]['rendererPresentationOwner'] === FAST_PREVIEW_PRESENTATION_OWNER && delete _0x2897f9["dataset"]['rendererPresentationOwner'];
  }
  applyRendererNodePresentationZIndex(_0x2897f9);
  return !![];
}
export function syncRendererNodeDragTransform(_0x31bd98, _0x454356, {
  active = ![],
  offsetX = 0x0,
  offsetY = 0x0,
  positionChanged = ![]
} = {}) {
  if (!_0x31bd98?.["style"] || !_0x454356) {
    return '';
  }
  const _0x28fdb0 = _0x31bd98["_dragPreviewTransformActive"] === !![];
  if (active === !![]) {
    const _0x1566d7 = Number["isFinite"](offsetX) ? offsetX : 0x0;
    const _0x55badc = Number['isFinite'](offsetY) ? offsetY : 0x0;
    const _0x21c157 = "translate(" + (_0x454356['x'] + _0x1566d7) + 'px,\x20' + (_0x454356['y'] + _0x55badc) + "px)";
    _0x31bd98['style']["transform"] !== _0x21c157 && (_0x31bd98["style"]['transform'] = _0x21c157);
    _0x31bd98["_dragPreviewTransformActive"] = !![];
    return _0x21c157;
  }
  if (positionChanged || _0x28fdb0) {
    const _0x4bd5a4 = "translate(" + _0x454356['x'] + "px, " + _0x454356['y'] + 'px)';
    _0x31bd98["style"]["transform"] !== _0x4bd5a4 && (_0x31bd98['style']["transform"] = _0x4bd5a4);
    _0x28fdb0 && delete _0x31bd98['_dragPreviewTransformActive'];
    return _0x4bd5a4;
  }
  return _0x31bd98["style"]["transform"] || '';
}
export function getRendererDefaultNodeLabel(_0x28b83e) {
  const _0x2b6475 = String(_0x28b83e?.["type"] || '');
  let _0x7dc229 = t("coreUi.renderer.defaultNodeNames.node");
  if (_0x2b6475["includes"]('image')) {
    _0x7dc229 = t('coreUi.renderer.defaultNodeNames.image');
  } else {
    if (_0x2b6475["includes"]("video")) {
      _0x7dc229 = t("coreUi.renderer.defaultNodeNames.video");
    } else {
      if (_0x2b6475["includes"]("audio")) {
        _0x7dc229 = t("coreUi.renderer.defaultNodeNames.audio");
      } else {
        if (_0x2b6475['includes']("text")) {
          _0x7dc229 = t("coreUi.renderer.defaultNodeNames.text");
        }
      }
    }
  }
  return _0x7dc229;
}
export function getRendererNodeZIndex(_0x13db2d, _0x5c0144, _0xf0728a = -0x1, _0x22488b = {}) {
  if (isNodeType(_0x13db2d, "group")) {
    return 'auto';
  }
  if (isNodeType(_0x13db2d, 'debug')) {
    return "1200";
  }
  if (isNodeType(_0x13db2d, 'media-clip') && _0x13db2d?.["mediaClip"]?.["expanded"] === !![]) {
    return "12000";
  }
  if (_0x22488b?.['isFocused'] === !![]) {
    return "180";
  }
  if (_0x13db2d?.['isImagesExpanded'] || _0x13db2d?.["isVideosExpanded"]) {
    return "140";
  }
  if (!_0x5c0144) {
    return '10';
  }
  const _0x33967a = Math["max"](0x0, Math['min'](0x27, Number(_0xf0728a) || 0x0));
  return String(0x64 + _0x33967a);
}
export function shouldSkipInitialMediaNodeUpdate(_0xb956e5, _0x57b42c) {
  return _0x57b42c && isNodeType(_0xb956e5, ["source-image", 'image', 'ai-image', "source-video", "video", 'ai-video', 'source-audio', 'audio', "ai-audio"]) && !shouldShowGenerationBusyUi(_0xb956e5);
}
export function buildSelectedNodeRankMap(_0x386e40) {
  const _0x4a66e5 = _0x386e40 instanceof Set ? _0x386e40 : _0x386e40 || [];
  return new Map(Array['from'](_0x4a66e5)['map']((_0x12bd43, _0x55636b) => [_0x12bd43, _0x55636b]));
}
export function buildRendererDragTargetSet({
  dragContext: _0x56e7e5,
  selectedNodeSet: _0x4b9690,
  parentToChildren: _0x8b4930
}) {
  if (!_0x56e7e5?.["isDragging"] || !_0x56e7e5["targetNodeId"]) {
    return null;
  }
  const _0x45eeff = _0x4b9690["has"](_0x56e7e5["targetNodeId"]) ? Array['from'](_0x4b9690) : [_0x56e7e5["targetNodeId"]];
  const _0x3b34d9 = new Set(_0x45eeff);
  const _0x328541 = [..._0x45eeff];
  while (_0x328541["length"] > 0x0) {
    const _0x3db02c = _0x328541["pop"]();
    const _0x56a5e1 = _0x8b4930?.[_0x3db02c];
    if (!_0x56a5e1) {
      continue;
    }
    for (const _0x34f86e of _0x56a5e1) {
      if (_0x3b34d9["has"](_0x34f86e)) {
        continue;
      }
      _0x3b34d9["add"](_0x34f86e);
      _0x328541["push"](_0x34f86e);
    }
  }
  return _0x3b34d9;
}
export function formatRendererNodeLabelText(_0x4a98de) {
  const _0x2fdac2 = String(_0x4a98de || '')["trim"]();
  if (!_0x2fdac2) {
    return '';
  }
  const _0x51b4d3 = /^[\x00-\x7F]*$/['test'](_0x2fdac2);
  return _0x51b4d3 && _0x2fdac2["length"] > 0x14 ? _0x2fdac2["slice"](0x0, 0x14) + "..." : _0x2fdac2;
}
export function getRendererNodeLabelKind(_0x38c4be) {
  const _0x54c1b1 = getRefKindByNodeType(_0x38c4be);
  return ["text", 'image', "video", 'audio']['includes'](_0x54c1b1) ? _0x54c1b1 : '';
}
export function clearRendererNodeLabelTooltip(_0x44eed6) {
  if (!_0x44eed6) {
    return;
  }
  const _0x551af9 = (_0xe3f4a6, _0x2811f9 = '') => {
    if (typeof _0x44eed6["removeAttribute"] === "function") {
      _0x44eed6["removeAttribute"](_0xe3f4a6);
    } else {
      _0x44eed6['attributes'] && typeof _0x44eed6["attributes"]['delete'] === "function" && _0x44eed6["attributes"]["delete"](_0xe3f4a6);
    }
    _0x2811f9 && _0x44eed6["dataset"] && _0x2811f9 in _0x44eed6["dataset"] && delete _0x44eed6["dataset"][_0x2811f9];
  };
  _0x551af9('title');
  if ("title" in _0x44eed6) {
    _0x44eed6["title"] = '';
  }
  _0x551af9('data-tooltip', "tooltip");
  _0x551af9("data-tooltip-right", "tooltipRight");
  _0x551af9("data-tooltip-source", "tooltipSource");
  _0x551af9('data-native-title', "nativeTitle");
}
export function setRendererNodeLabelContent(_0x29e1f7, {
  labelKind: _0x5dc1fe,
  displayLabelText: _0x5a0c67,
  defaultName: _0x52217c,
  isBeta: _0x28e31d,
  fullLabelText: _0x13a285
}, _0x32575d = globalThis["document"]) {
  if (!_0x29e1f7) {
    return;
  }
  clearRendererNodeLabelTooltip(_0x29e1f7);
  const _0x248b8b = [];
  if (_0x5dc1fe) {
    const _0x3591b0 = _0x32575d["createElement"]("span");
    _0x3591b0["className"] = 'node-label-icon';
    _0x3591b0["setAttribute"]("aria-hidden", "true");
    _0x3591b0["dataset"]["labelKind"] = _0x5dc1fe;
    _0x3591b0["textContent"] = _0x5dc1fe === 'text' ? 'T' : '';
    _0x248b8b["push"](_0x3591b0);
  }
  const _0x13a0b1 = _0x32575d["createElement"]("span");
  _0x13a0b1["className"] = "node-label-text";
  _0x13a0b1['textContent'] = _0x5a0c67 || _0x52217c;
  _0x248b8b['push'](_0x13a0b1);
  if (_0x28e31d) {
    const _0xd7a4fe = _0x32575d["createElement"]("span");
    _0xd7a4fe['className'] = 'v2-node-beta-pill';
    _0xd7a4fe["textContent"] = "Beta";
    _0x248b8b["push"](_0xd7a4fe);
    _0x29e1f7['dataset']["betaLabel"] = _0x13a285;
  } else {
    "betaLabel" in _0x29e1f7["dataset"] && delete _0x29e1f7["dataset"]["betaLabel"];
  }
  _0x29e1f7["replaceChildren"](..._0x248b8b);
}
function getDreaminaTimerPhaseTitle(_0x3cbc96) {
  if (!_0x3cbc96 || !isNodeType(_0x3cbc96, 'ai-video')) {
    return '';
  }
  const _0x2223f1 = resolveModelProvider(_0x3cbc96['model'], _0x3cbc96["provider"], {
    'allowPrefixInference': ![]
  }) === "dreamina";
  if (!_0x2223f1) {
    return '';
  }
  const _0x178104 = String(_0x3cbc96["dreaminaTaskPhase"] || '')["trim"]()["toLowerCase"]();
  const _0x3bb678 = String(_0x3cbc96["dreaminaTaskStatus"] || '')["trim"]()['toLowerCase']();
  if (_0x178104 === "failed" || _0x3bb678 === "failed") {
    return t('coreUi.renderer.dreaminaPhase.failed');
  }
  if (_0x178104 === "syncing") {
    return t('coreUi.renderer.dreaminaPhase.syncing');
  }
  if (_0x178104 === 'queued') {
    return t("coreUi.renderer.dreaminaPhase.queued");
  }
  if (_0x178104 === "generating") {
    return t("coreUi.renderer.dreaminaPhase.generating");
  }
  if (_0x178104 === "done") {
    return t('coreUi.renderer.dreaminaPhase.done');
  }
  return String(_0x3cbc96["dreaminaTaskLabel"] || '')["trim"]();
}
export function formatRendererNodeTimerText(_0x209bbb, _0x3c1ddc) {
  const _0x5127c0 = Math["max"](0x0, Number(_0x3c1ddc) || 0x0);
  const _0x16a2f3 = Math["floor"](_0x5127c0 / 0x3e8);
  const _0x2ce71c = Math['floor'](_0x5127c0 % 0x3e8 / 0x64);
  const _0x4301e8 = _0x16a2f3 + '.' + _0x2ce71c + 's';
  const _0x5ce3f5 = getDreaminaTimerPhaseTitle(_0x209bbb);
  return _0x5ce3f5 ? _0x5ce3f5 + " · " + _0x4301e8 : _0x4301e8;
}
export function formatVideoMetaText({
  fps: _0x758d6f,
  frames: _0x2c1ecc,
  width: _0x542d32,
  height: _0xd60ea9
} = {}) {
  const _0x3bafec = Number(_0x758d6f);
  const _0x2b6bbb = Number(_0x2c1ecc);
  if (!Number["isFinite"](_0x3bafec) || _0x3bafec <= 0x0 || !Number["isFinite"](_0x2b6bbb) || _0x2b6bbb <= 0x0) {
    return '';
  }
  const _0x4c28b8 = Math["abs"](_0x3bafec - Math["round"](_0x3bafec)) < 0.01 ? String(Math['round'](_0x3bafec)) : String(Number(_0x3bafec["toFixed"](0x2)));
  const _0xdc6335 = Number(_0x542d32);
  const _0x281984 = Number(_0xd60ea9);
  const _0x7b586a = Number["isFinite"](_0xdc6335) && _0xdc6335 > 0x0 && Number["isFinite"](_0x281984) && _0x281984 > 0x0;
  const _0x32ad25 = t('coreUi.renderer.videoMeta.framesFps', {
    'frames': Math["round"](_0x2b6bbb),
    'fps': _0x4c28b8
  });
  return _0x7b586a ? Math["round"](_0xdc6335) + '×' + Math["round"](_0x281984) + '\x20·\x20' + _0x32ad25 : _0x32ad25;
}
export function getRendererGroupColorWithOpacity(_0x295fad, _0x245630) {
  const _0x3cc62f = String(_0x295fad || '')["match"](/var\(--([^)]+)\)/);
  return _0x3cc62f ? "var(--" + _0x3cc62f[0x1] + '-' + _0x245630 + ')' : _0x295fad;
}