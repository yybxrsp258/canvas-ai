import { createNodeGeometryOverlay } from './nodeGeometryOverlay.js';
import { previewNodeGeometry } from './rendererGeometryPreview.js';
function toFiniteNumber(_0x4b7af8) {
  const _0x5034ff = Number(_0x4b7af8);
  return Number["isFinite"](_0x5034ff) ? _0x5034ff : null;
}
function normalizeEdgeIds(_0x59eb97) {
  if (_0x59eb97 instanceof Set) {
    return new Set(_0x59eb97);
  }
  if (Array['isArray'](_0x59eb97)) {
    return new Set(_0x59eb97);
  }
  return new Set();
}
export function previewNodeResizeGeometry({
  nodeId: _0x154001,
  width: _0x5b7ec8,
  height: _0x1c0267
} = {}, {
  snapshot: _0x3a9e4d,
  ensureEdgeIndex: _0x55cef6,
  nodeToEdgeIds: _0x20706e,
  renderEdgesByIds: _0x2f56a1
} = {}) {
  if (!_0x154001 || !_0x3a9e4d?.['nodes']?.[_0x154001]) {
    return ![];
  }
  const _0x28cfb1 = toFiniteNumber(_0x5b7ec8);
  const _0xf108ac = toFiniteNumber(_0x1c0267);
  if (_0x28cfb1 === null || _0xf108ac === null) {
    return ![];
  }
  const _0x207b8a = _0x3a9e4d["edges"] || {};
  const _0x6986d1 = Number['isFinite'](_0x3a9e4d["_edgesRev"]) ? _0x3a9e4d['_edgesRev'] : 0x0;
  _0x55cef6?.(_0x207b8a, _0x6986d1);
  const _0x5bbc02 = normalizeEdgeIds(_0x20706e?.["get"]?.(_0x154001));
  if (_0x5bbc02["size"] === 0x0) {
    return !![];
  }
  _0x2f56a1?.(_0x5bbc02, createNodeGeometryOverlay(_0x3a9e4d['nodes'], {
    [_0x154001]: {
      'width': _0x28cfb1,
      'height': _0xf108ac
    }
  }), _0x3a9e4d);
  return !![];
}
export function installNodeResizeGeometryPreviewer(_0x48f065, _0x3e1eec, _0x5e2781, _0x184647, _0x48e9a2) {
  if (!_0x48f065) {
    return ![];
  }
  _0x48f065["v2Renderer"] = _0x48f065['v2Renderer'] || {};
  const _0x2de600 = new Map();
  _0x48f065['v2Renderer']["previewNodeGeometry"] = _0x1c0abc => previewNodeGeometry(_0x1c0abc, {
    'snapshot': _0x3e1eec?.(),
    'bridge': _0x48f065["v2Renderer"],
    'ensureEdgeIndex': _0x5e2781,
    'nodeToEdgeIds': _0x184647,
    'renderEdgesByIds': _0x48e9a2,
    'cache': _0x2de600
  });
  _0x48f065["v2Renderer"]["previewNodeResizeGeometry"] = _0x9f2f75 => previewNodeResizeGeometry(_0x9f2f75, {
    'snapshot': typeof _0x3e1eec === "function" ? _0x3e1eec() : null,
    'ensureEdgeIndex': _0x5e2781,
    'nodeToEdgeIds': _0x184647,
    'renderEdgesByIds': _0x48e9a2
  });
  return !![];
}