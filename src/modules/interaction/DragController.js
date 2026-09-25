import { buildSourceMediaNodePayload, getAutoMediaSizeByShortSide } from '../../services/fileService.js';
import { createDropTargetSpatialQuery } from './dropTargetSpatialQuery.js';
import { computeSingleNodeSnapGuides, computeMultiNodeSnapGuides, createNodeSpatialIndex, snapToCanvasGrid, worldToScreen } from '../../core/math.js';
import { markRendererNodeDragCommitHint } from '../../core/rendererCommitHints.js';
import { setNodeGeometryPreview, clearNodeGeometryPreview } from '../../core/nodeGeometryPreview.js';
import { beginNodeEditInteraction, deferNodeEditCompletion } from '../../core/nodeEditInteraction.js';
import { buildConnectionPathGeometry, resolveConnectionEndpoints } from '../../core/edgePathGeometry.js';
import { getStoryboardCellPixelBounds, getStoryboardCellIndexAtWorldPoint, getStoryboardCellMetrics, getStoryboardNearestCellIndexAtWorldPoint, isStoryboardCellEmpty, resolveStoryboardCellSourceIndex } from '../../core/storyboardCellUtils.js';
import { isPerfProbeEnabled, recordEdgeRedrawSample } from '../perf/perfProbe.js';
import { collectGroupContainmentReparentOps } from '../groupMembership.js';
import { saveOutputBlob } from '../project.js';
import { localPathToUrl, normalizeLocalPath, pickResultLocalPath } from '../../utils/localMediaPath.js';
import { getCollageItemIndexAtWorldPoint, resolveCollageItemFrames } from '../collage/collageFactory.js';
import { buildEmptyStoryboardCellForSlot as a1115_0x2293ff, buildFrozenStoryboardCellFromSnapshot, buildStoryboardSourceCropExtract as a1115_0x3506e4, buildStoryboardSourceCropExtractFromImage as a1115_0xf9fee6, dataImageUrlToBlob as a1115_0x4e6c9c, getDataImageExtension as a1115_0x2fe975, getImageElementDisplaySrc as a1115_0x693399, getStoryboardCellDisplaySrc as a1115_0x4ae7d0, getStoryboardNodeSourceContext as a1115_0x387564, getStoryboardNodeSourceImageUrl as a1115_0x38c55c, getStoryboardPieceSourceImageUrl as a1115_0x59f1b5, isDataImageRef as a1115_0x303ce8, loadStoryboardSourceImage as a1115_0x175c58, normalizeStoryboardImageUrl as a1115_0x5987e4, resolveCollagePayloadDisplaySnapshot as a1115_0x3d2dab, resolveStoryboardCellDisplaySnapshot, resolveStoryboardPayloadDisplaySnapshot as a1115_0x20bb84, swapStoryboardCellsWithDisplaySnapshots as a1115_0x22b0b1, trimStoryboardImageRef as a1115_0x52729e } from '../storyboard/storyboardDisplaySnapshot.js';
const MINIMAP_LIVE_DRAG_DOT_LIMIT = 0x10;
function _looksLikeImageRef(_0x2a9c1d) {
  if (!_0x2a9c1d) {
    return ![];
  }
  const _0x22e007 = String(_0x2a9c1d);
  if (_0x22e007["startsWith"]("data:image/")) {
    return !![];
  }
  const _0x2650bd = _0x22e007["split"]('#')[0x0]["split"]('?')[0x0];
  const _0x4b0cb6 = _0x2650bd['toLowerCase']();
  if (_0x4b0cb6['endsWith'](".mp4") || _0x4b0cb6["endsWith"](".webm") || _0x4b0cb6["endsWith"]('.mov') || _0x4b0cb6["endsWith"](".mkv") || _0x4b0cb6["endsWith"](".mp3") || _0x4b0cb6['endsWith'](".wav") || _0x4b0cb6["endsWith"](".m4a") || _0x4b0cb6["endsWith"](".aac") || _0x4b0cb6['endsWith']('.ogg')) {
    return ![];
  }
  if (_0x4b0cb6["endsWith"](".png") || _0x4b0cb6["endsWith"](".jpg") || _0x4b0cb6["endsWith"]('.jpeg') || _0x4b0cb6["endsWith"](".webp") || _0x4b0cb6["endsWith"](".gif") || _0x4b0cb6["endsWith"](".bmp") || _0x4b0cb6['endsWith'](".svg")) {
    return !![];
  }
  return _0x22e007["startsWith"]("http://") || _0x22e007["startsWith"]("https://") || _0x22e007['startsWith']('/') || _0x22e007['startsWith']('aic-local-preview:') || _0x22e007["startsWith"]("blob:");
}
function _toPositiveNumber(_0x4a77a5, _0x3d5df9 = null) {
  const _0x434441 = Number(_0x4a77a5);
  return Number["isFinite"](_0x434441) && _0x434441 > 0x0 ? _0x434441 : _0x3d5df9;
}
function _getImagePayloadFromNode(_0x55aa83, _0x2b83e2) {
  if (!_0x2b83e2) {
    return null;
  }
  let _0x128d4e = '';
  let _0x3131d6 = null;
  let _0x3f8fc2 = null;
  let _0x3415e2 = null;
  let _0x591831 = null;
  let _0xcc95d = '';
  let _0x139fc5 = null;
  let _0x3e5765 = null;
  let _0x57a3f4 = null;
  let _0x4fcf13 = '';
  let _0x39c26e = null;
  let _0x17193e = null;
  let _0xe179c6 = null;
  let _0x48c6ba = null;
  let _0x45e109 = ![];
  let _0x421f62 = ![];
  let _0x30efe8 = '';
  let _0x3b1cf2 = null;
  let _0x1a261a = '';
  let _0xbf050e = null;
  let _0x4642d5 = '';
  if (Array["isArray"](_0x2b83e2['images']) && _0x2b83e2["images"]["length"] > 0x0) {
    let _0x40b60f = typeof _0x2b83e2['mainImageIndex'] === "number" ? _0x2b83e2['mainImageIndex'] : 0x0;
    if (_0x40b60f < 0x0 || _0x40b60f >= _0x2b83e2["images"]["length"]) {
      _0x40b60f = 0x0;
    }
    const _0x169fb4 = _0x2b83e2["images"][_0x40b60f] || {};
    _0x45e109 = _0x169fb4["storyboardSourceCrop"] === !![] || !!_0x169fb4["sourceLocalPath"] || !!_0x169fb4["sourceUrl"];
    _0x421f62 = _0x169fb4["storyboardExtractedCell"] === !![] || _0x2b83e2["storyboardExtractedCell"] === !![];
    const _0x3893f1 = _0x169fb4["storyboardSourceIndex"] ?? _0x2b83e2["storyboardSourceIndex"];
    const _0x5752da = Number(_0x3893f1);
    Number["isInteger"](_0x5752da) && _0x5752da >= 0x0 && (_0x3b1cf2 = _0x5752da);
    _0x1a261a = String(_0x169fb4['storyboardSourceNodeId'] || _0x2b83e2["storyboardSourceNodeId"] || '')["trim"]();
    _0xbf050e = _0x169fb4["storyboardSourceLocalPath"] || _0x2b83e2["storyboardSourceLocalPath"] || null;
    _0x4642d5 = _0x169fb4["storyboardSourceUrl"] || _0x2b83e2["storyboardSourceUrl"] || '';
    _0x30efe8 = _0x169fb4["capturePreviewUrl"] || _0x2b83e2["capturePreviewUrl"] || '';
    _0x128d4e = _0x169fb4['imageUrl'] || _0x169fb4["url"] || _0x30efe8 || '';
    _0x3131d6 = _0x169fb4["localPath"] || _0x2b83e2['localPath'] || null;
    _0x3f8fc2 = _0x169fb4["originalLocalPath"] || _0x2b83e2['originalLocalPath'] || null;
    _0x3415e2 = _0x169fb4["displayLocalPath"] || _0x2b83e2['displayLocalPath'] || null;
    _0x591831 = _0x169fb4["thumbLocalPath"] || null;
    _0xcc95d = _0x169fb4['thumbUrl'] || '';
    _0x139fc5 = _0x169fb4["thumbId"] || null;
    _0x3e5765 = _0x169fb4["sourceId"] || null;
    _0xe179c6 = _0x169fb4["imageWidth"] || _0x169fb4["width"] || _0x2b83e2["imageWidth"] || null;
    _0x48c6ba = _0x169fb4["imageHeight"] || _0x169fb4['height'] || _0x2b83e2["imageHeight"] || null;
    _0x45e109 && (_0x57a3f4 = _0x169fb4["sourceLocalPath"] || null, _0x4fcf13 = _0x169fb4["sourceUrl"] || '', _0x39c26e = _0x169fb4['sourceWidth'] || null, _0x17193e = _0x169fb4['sourceHeight'] || null);
  } else {
    _0x45e109 = _0x2b83e2["storyboardSourceCrop"] === !![] || !!_0x2b83e2["sourceLocalPath"] || !!_0x2b83e2["sourceUrl"];
    _0x421f62 = _0x2b83e2['storyboardExtractedCell'] === !![];
    const _0x7f6ede = Number(_0x2b83e2["storyboardSourceIndex"]);
    Number['isInteger'](_0x7f6ede) && _0x7f6ede >= 0x0 && (_0x3b1cf2 = _0x7f6ede);
    _0x1a261a = String(_0x2b83e2['storyboardSourceNodeId'] || '')['trim']();
    _0xbf050e = _0x2b83e2["storyboardSourceLocalPath"] || null;
    _0x4642d5 = _0x2b83e2['storyboardSourceUrl'] || '';
    _0x30efe8 = _0x2b83e2['capturePreviewUrl'] || (String(_0x2b83e2["src"] || '')["startsWith"]("data:image/") ? _0x2b83e2["src"] : '');
    _0x128d4e = _0x2b83e2["imageUrl"] || _0x2b83e2["src"] || _0x30efe8 || '';
    _0x3131d6 = _0x2b83e2["localPath"] || null;
    _0x3f8fc2 = _0x2b83e2['originalLocalPath'] || null;
    _0x3415e2 = _0x2b83e2["displayLocalPath"] || null;
    _0x591831 = _0x2b83e2["thumbLocalPath"] || null;
    _0xcc95d = _0x2b83e2["thumbUrl"] || '';
    _0x139fc5 = _0x2b83e2["thumbId"] || null;
    _0x3e5765 = _0x2b83e2["sourceId"] || null;
    _0xe179c6 = _0x2b83e2["imageWidth"] || null;
    _0x48c6ba = _0x2b83e2["imageHeight"] || null;
    _0x45e109 && (_0x57a3f4 = _0x2b83e2["sourceLocalPath"] || null, _0x4fcf13 = _0x2b83e2["sourceUrl"] || '', _0x39c26e = _0x2b83e2["sourceWidth"] || null, _0x17193e = _0x2b83e2["sourceHeight"] || null);
  }
  if (!_0x128d4e && !_0x3131d6 && !_0x591831 && !_0xcc95d && !_0x139fc5 && !_0x3e5765 && !_0x30efe8 && !_0x57a3f4 && !_0x4fcf13) {
    return null;
  }
  if (_0x55aa83(_0x2b83e2, 'source-image')) {
    if (_0x139fc5 || _0x3e5765) {
      return {
        'url': _0x128d4e,
        'localPath': _0x3131d6,
        'originalLocalPath': _0x3f8fc2,
        'displayLocalPath': _0x3415e2,
        'thumbLocalPath': _0x591831,
        'thumbUrl': _0xcc95d,
        'thumbId': _0x139fc5,
        'sourceId': _0x3e5765,
        'sourceLocalPath': _0x57a3f4,
        'sourceUrl': _0x4fcf13,
        'sourceWidth': _0x39c26e,
        'sourceHeight': _0x17193e,
        'imageWidth': _0xe179c6,
        'imageHeight': _0x48c6ba,
        'storyboardSourceCrop': _0x45e109,
        'storyboardExtractedCell': _0x421f62,
        'capturePreviewUrl': _0x30efe8,
        'storyboardSourceIndex': _0x3b1cf2,
        'storyboardSourceNodeId': _0x1a261a,
        'storyboardSourceLocalPath': _0xbf050e,
        'storyboardSourceUrl': _0x4642d5
      };
    }
  }
  if (!_looksLikeImageRef(_0xcc95d) && !_looksLikeImageRef(_0x591831) && !_looksLikeImageRef(_0x3131d6) && !_looksLikeImageRef(_0x128d4e) && !_looksLikeImageRef(_0x30efe8) && !_looksLikeImageRef(_0x57a3f4) && !_looksLikeImageRef(_0x4fcf13)) {
    return null;
  }
  return {
    'url': _0x128d4e,
    'localPath': _0x3131d6,
    'originalLocalPath': _0x3f8fc2,
    'displayLocalPath': _0x3415e2,
    'thumbLocalPath': _0x591831,
    'thumbUrl': _0xcc95d,
    'thumbId': _0x139fc5,
    'sourceId': _0x3e5765,
    'sourceLocalPath': _0x57a3f4,
    'sourceUrl': _0x4fcf13,
    'sourceWidth': _0x39c26e,
    'sourceHeight': _0x17193e,
    'imageWidth': _0xe179c6,
    'imageHeight': _0x48c6ba,
    'storyboardSourceCrop': _0x45e109,
    'storyboardExtractedCell': _0x421f62,
    'capturePreviewUrl': _0x30efe8,
    'storyboardSourceIndex': _0x3b1cf2,
    'storyboardSourceNodeId': _0x1a261a,
    'storyboardSourceLocalPath': _0xbf050e,
    'storyboardSourceUrl': _0x4642d5
  };
}
function _isCellEmpty(_0x215c8f) {
  return isStoryboardCellEmpty(_0x215c8f);
}
function _resolveStoryboardReplayDropContext(_0x503a29, _0x43b852) {
  if (!_0x503a29 || !_0x43b852) {
    return {
      'isReplay': ![]
    };
  }
  const _0x58bda7 = Number(_0x503a29['storyboardSourceIndex']);
  if (!Number["isInteger"](_0x58bda7) || _0x58bda7 < 0x0) {
    return {
      'isReplay': ![]
    };
  }
  const _0xf2d17d = String(_0x503a29["storyboardSourceNodeId"] || '')["trim"]();
  const _0x1e4da0 = a1115_0x5987e4(_0x503a29['storyboardSourceLocalPath']) || a1115_0x5987e4(_0x503a29["storyboardSourceUrl"]);
  const _0x3a23c2 = a1115_0x38c55c(_0x43b852);
  const _0x1406c9 = !!(_0xf2d17d && _0xf2d17d === String(_0x43b852['id']));
  const _0x5e9fa8 = !!(_0x1e4da0 && _0x3a23c2 && _0x1e4da0 === _0x3a23c2);
  if (!_0x1406c9 && !_0x5e9fa8) {
    return {
      'isReplay': ![]
    };
  }
  const _0x5f009f = a1115_0x387564(_0x43b852);
  return {
    'isReplay': !![],
    'sourceIndex': _0x58bda7,
    'sourceLocalPath': _0x5f009f['sourceLocalPath'],
    'sourceUrl': _0x5f009f["sourceUrl"],
    'sourceWidth': Number(_0x43b852["storyboardSourceWidth"] || _0x43b852["sourceWidth"]) || null,
    'sourceHeight': Number(_0x43b852['storyboardSourceHeight'] || _0x43b852["sourceHeight"]) || null
  };
}
function findStoryboardCellInfoAt(_0x6cdee, _0x1a868c, _0x2c76a5, _0x134411 = {}) {
  for (const _0x189909 of _0x2c76a5) {
    if (_0x189909["type"] !== "storyboard") {
      continue;
    }
    let _0x350b98 = getStoryboardCellIndexAtWorldPoint(_0x189909, _0x6cdee, _0x1a868c);
    _0x350b98 < 0x0 && _0x134411["nearestInGap"] === !![] && (_0x350b98 = getStoryboardNearestCellIndexAtWorldPoint(_0x189909, _0x6cdee, _0x1a868c));
    if (_0x350b98 >= 0x0) {
      return {
        'nodeId': _0x189909['id'],
        'cellIndex': _0x350b98
      };
    }
  }
  return null;
}
function _getLastHoveredStoryboardCellInfo(_0x16bd4d, _0x3c9529, _0x40420d, _0xb00157) {
  const _0x133b9a = _0x16bd4d?.["lastHoverNodeId"] || null;
  const _0x43bb7b = Number(_0x16bd4d?.['lastHoverCellIndex']);
  if (!_0x133b9a || !Number["isInteger"](_0x43bb7b) || _0x43bb7b < 0x0) {
    return null;
  }
  if (_0x16bd4d?.["lastHoverKind"] && _0x16bd4d["lastHoverKind"] !== "storyboard") {
    return null;
  }
  const _0x5dfb21 = _0xb00157?.[_0x133b9a];
  if (!_0x5dfb21 || _0x5dfb21["type"] !== "storyboard") {
    return null;
  }
  const _0x16ab73 = getStoryboardCellMetrics(_0x5dfb21);
  const _0x414e1a = _0x16ab73["cols"] * _0x16ab73['rows'];
  if (_0x43bb7b >= _0x414e1a) {
    return null;
  }
  const _0x39e933 = Number(_0x5dfb21['x']) || 0x0;
  const _0x114844 = Number(_0x5dfb21['y']) || 0x0;
  const _0x246e06 = Math["max"](0x8, Math['min'](0x28, (Number(_0x5dfb21["gridGap"]) || 0x0) / 0x2 + 0x8));
  if (_0x3c9529 < _0x39e933 - _0x246e06 || _0x3c9529 > _0x39e933 + _0x16ab73['width'] + _0x246e06 || _0x40420d < _0x114844 - _0x246e06 || _0x40420d > _0x114844 + _0x16ab73["height"] + _0x246e06) {
    return null;
  }
  return {
    'nodeId': _0x133b9a,
    'cellIndex': _0x43bb7b
  };
}
function findCollageSlotInfoAt(_0x354279, _0x1f8db7, _0x47dca8) {
  for (const _0x5202f4 of _0x47dca8) {
    if (_0x5202f4["type"] !== 'collage') {
      continue;
    }
    const _0x324bb6 = getCollageItemIndexAtWorldPoint(_0x5202f4, _0x354279, _0x1f8db7);
    if (_0x324bb6 >= 0x0) {
      return {
        'nodeId': _0x5202f4['id'],
        'itemIndex': _0x324bb6
      };
    }
  }
  return null;
}
function _getCollageItemFrameInfo(_0x52b423, _0x1aceb5) {
  return resolveCollageItemFrames(_0x52b423)["find"](_0x4ecd69 => _0x4ecd69["index"] === _0x1aceb5) || null;
}
function _getCollageItemCenterWorldPoint(_0x559d79, _0x251fa8) {
  const _0x4b2429 = _getCollageItemFrameInfo(_0x559d79, _0x251fa8);
  const _0x59d280 = _0x4b2429?.["frame"];
  if (!_0x59d280) {
    return {
      'x': (Number(_0x559d79?.['x']) || 0x0) + (Number(_0x559d79?.["width"]) || 0x1) / 0x2,
      'y': (Number(_0x559d79?.['y']) || 0x0) + (Number(_0x559d79?.['height']) || 0x1) / 0x2
    };
  }
  return {
    'x': (Number(_0x559d79?.['x']) || 0x0) + _0x59d280['x'] + _0x59d280["width"] / 0x2,
    'y': (Number(_0x559d79?.['y']) || 0x0) + _0x59d280['y'] + _0x59d280["height"] / 0x2
  };
}
function _clearStoryboardHighlight(_0x554032) {
  if (!_0x554032) {
    return;
  }
  window['v2Renderer']?.["highlightDropSlot"]?.(_0x554032, {
    'kind': 'storyboard',
    'index': -0x1
  });
}
function _clearDropSlotHighlight(_0x40db68) {
  if (!_0x40db68) {
    return;
  }
  window['v2Renderer']?.["clearDropSlotHighlight"]?.(_0x40db68);
}
function _highlightDropSlot(_0x5aa4ac, _0x2b781f, _0x30bf68) {
  if (!_0x5aa4ac) {
    return;
  }
  window['v2Renderer']?.["highlightDropSlot"]?.(_0x5aa4ac, {
    'kind': _0x2b781f,
    'index': _0x30bf68
  });
}
function _getStoryboardCellCenterWorldPoint(_0x4d233a, _0x42b72f) {
  const _0x4b808a = getStoryboardCellMetrics(_0x4d233a);
  const _0x455634 = getStoryboardCellPixelBounds(_0x4d233a, _0x42b72f);
  if (_0x455634) {
    return {
      'x': (Number(_0x4d233a?.['x']) || 0x0) + _0x455634['x0'] + _0x455634['width'] / 0x2,
      'y': (Number(_0x4d233a?.['y']) || 0x0) + _0x455634['y0'] + _0x455634["height"] / 0x2
    };
  }
  const _0x581f17 = _0x42b72f % _0x4b808a["cols"];
  const _0x1e1527 = Math["floor"](_0x42b72f / _0x4b808a["cols"]);
  return {
    'x': (Number(_0x4d233a?.['x']) || 0x0) + _0x4b808a["inset"] + _0x581f17 * (_0x4b808a["cellWidth"] + _0x4b808a["gap"]) + _0x4b808a['cellWidth'] / 0x2,
    'y': (Number(_0x4d233a?.['y']) || 0x0) + _0x4b808a["inset"] + _0x1e1527 * (_0x4b808a['cellHeight'] + _0x4b808a["gap"]) + _0x4b808a["cellHeight"] / 0x2
  };
}
function _canvasToJpegBlob(_0x4720b8) {
  if (!_0x4720b8 || typeof _0x4720b8["toBlob"] !== "function") {
    return Promise['resolve'](null);
  }
  return new Promise(_0xa37d61 => _0x4720b8['toBlob'](_0xa37d61, "image/jpeg", 0.9));
}
function _buildExtractNodeCropPatch(_0xc77e03) {
  if (!_0xc77e03?.["dataUrl"]) {
    return null;
  }
  return {
    'src': '',
    'capturePreviewUrl': _0xc77e03["dataUrl"],
    'localPath': '',
    'fileName': _0xc77e03['fileName'],
    'originalWidth': _0xc77e03['width'],
    'originalHeight': _0xc77e03['height'],
    'imageWidth': _0xc77e03['width'],
    'imageHeight': _0xc77e03["height"],
    'needsAutoResize': ![],
    'sourceLocalPath': null,
    'sourceUrl': '',
    'sourceWidth': null,
    'sourceHeight': null,
    'storyboardSourceCrop': ![],
    'storyboardExtractedCell': !![]
  };
}
async function _saveStoryboardDataImageSnapshot(_0x447b4a, _0x46c2dc, _0x133456) {
  const _0x5e3a5b = a1115_0x52729e(_0x447b4a?.['capturePreviewUrl']);
  if (!a1115_0x303ce8(_0x5e3a5b)) {
    return null;
  }
  const _0x592ecb = a1115_0x4e6c9c(_0x5e3a5b);
  if (!_0x592ecb) {
    return null;
  }
  const _0x4319f6 = a1115_0x2fe975(_0x5e3a5b);
  const _0x217b91 = _0x46c2dc || _0x447b4a?.['fileName'] || 'storyboard_extract.' + _0x4319f6;
  const _0x2ae2f1 = typeof File === "function" ? new File([_0x592ecb], _0x217b91, {
    'type': _0x592ecb["type"] || "image/" + (_0x4319f6 === 'jpg' ? 'jpeg' : _0x4319f6)
  }) : _0x592ecb;
  const _0x338fcb = await _0x133456(_0x2ae2f1, {
    'ext': _0x4319f6
  });
  const _0x1b66fe = pickResultLocalPath(_0x338fcb);
  const _0x3cf3ef = String(_0x338fcb?.["url"] || '')["trim"]() || localPathToUrl(_0x1b66fe);
  if (!_0x3cf3ef || !_0x1b66fe) {
    return null;
  }
  return {
    'saved': _0x338fcb,
    'localPath': _0x1b66fe,
    'src': _0x3cf3ef
  };
}
function _buildPersistedStoryboardImagePatch(_0x21edb6, _0x5aea85) {
  const _0x538213 = _0x5aea85?.["saved"] || {};
  const _0x2e1b8d = _0x5aea85?.["localPath"] || '';
  const _0xe15897 = _0x5aea85?.["src"] || localPathToUrl(_0x2e1b8d);
  const _0x3850ef = _toPositiveNumber(_0x538213["originalWidth"]) || _toPositiveNumber(_0x21edb6?.["width"]) || null;
  const _0x3aa907 = _toPositiveNumber(_0x538213["originalHeight"]) || _toPositiveNumber(_0x21edb6?.["height"]) || null;
  return {
    'src': _0xe15897,
    'url': '',
    'localPath': _0x2e1b8d,
    'originalLocalPath': normalizeLocalPath(_0x538213["originalLocalPath"] || _0x2e1b8d),
    'displayLocalPath': normalizeLocalPath(_0x538213["displayLocalPath"]),
    'thumbLocalPath': normalizeLocalPath(_0x538213["thumbLocalPath"]),
    'capturePreviewUrl': '',
    'fileName': _0x538213["filename"] || _0x21edb6?.["fileName"] || '',
    'originalWidth': _0x3850ef,
    'originalHeight': _0x3aa907,
    'imageWidth': _0x3850ef,
    'imageHeight': _0x3aa907
  };
}
async function _persistStoryboardSnapshotPreviewToNode(_0x95bc1b, _0x126c68, _0x1f09ce, _0x230460, _0x1281bc = saveOutputBlob) {
  if (!a1115_0x303ce8(_0x1f09ce?.['capturePreviewUrl'])) {
    return;
  }
  try {
    const _0x3d904a = await _saveStoryboardDataImageSnapshot(_0x1f09ce, _0x230460, _0x1281bc);
    if (!_0x3d904a) {
      return;
    }
    if (!_0x95bc1b['getStateRaw']()["nodes"]?.[_0x126c68]) {
      return;
    }
    _0x95bc1b["updateNodeData"](_0x126c68, _buildPersistedStoryboardImagePatch(_0x1f09ce, _0x3d904a));
  } catch (_0x4bf6a9) {
    console["warn"]("[DragController] 分镜临时预览落盘失败:", _0x4bf6a9);
  }
}
async function _persistStoryboardSnapshotPreviewToCell(_0x29bd82, _0x55d415, _0x28d5f5, _0x22b8bc, _0x154767, _0x48e7b8, _0x54da89 = saveOutputBlob) {
  const _0x1462b5 = a1115_0x52729e(_0x154767?.["capturePreviewUrl"]);
  if (!a1115_0x303ce8(_0x1462b5)) {
    return;
  }
  try {
    const _0x15f356 = await _saveStoryboardDataImageSnapshot(_0x154767, _0x48e7b8, _0x54da89);
    if (!_0x15f356) {
      return;
    }
    const _0x6a5700 = _0x29bd82["getStateRaw"]()['nodes']?.[_0x55d415];
    const _0x23f501 = Array["isArray"](_0x6a5700?.["cells"]) ? _0x6a5700["cells"] : [];
    const _0xa8d8f = _0x23f501[_0x28d5f5];
    if (!_0xa8d8f || _isCellEmpty(_0xa8d8f)) {
      return;
    }
    if (_0x22b8bc && String(_0xa8d8f['id'] || '') !== String(_0x22b8bc)) {
      return;
    }
    if (a1115_0x52729e(_0xa8d8f["capturePreviewUrl"]) !== _0x1462b5) {
      return;
    }
    const _0x2d6804 = [..._0x23f501];
    _0x2d6804[_0x28d5f5] = {
      ..._0xa8d8f,
      ..._buildPersistedStoryboardImagePatch(_0x154767, _0x15f356),
      'sourceLocalPath': null,
      'sourceUrl': '',
      'sourceWidth': null,
      'sourceHeight': null,
      'storyboardSourceCrop': ![],
      'storyboardPiece': ![],
      'isEmpty': ![]
    };
    _0x29bd82["updateNodeData"](_0x55d415, {
      'cells': _0x2d6804
    });
  } catch (_0x5171d6) {
    console["warn"]('[DragController]\x20分镜宫格临时预览落盘失败:', _0x5171d6);
  }
}
async function _persistStoryboardSourceCropExtract(_0x18050a, _0x39d572, _0x42b643, _0x4c204f = saveOutputBlob) {
  if (typeof window === 'undefined') {
    return;
  }
  if (!_0x42b643?.["canvas"] || !_0x42b643["dataUrl"] || !_0x39d572) {
    return;
  }
  try {
    const _0x1c5171 = await _canvasToJpegBlob(_0x42b643["canvas"]);
    if (!_0x1c5171) {
      return;
    }
    const _0x4f677d = typeof File === "function" ? new File([_0x1c5171], _0x42b643["fileName"], {
      'type': "image/jpeg"
    }) : _0x1c5171;
    const _0x253f3e = await _0x4c204f(_0x4f677d, {
      'ext': 'jpg'
    });
    const _0x191c74 = pickResultLocalPath(_0x253f3e);
    const _0x2cec51 = String(_0x253f3e?.["url"] || '')["trim"]() || localPathToUrl(_0x191c74);
    if (!_0x2cec51 || !_0x191c74) {
      return;
    }
    if (!_0x18050a["getStateRaw"]()["nodes"]?.[_0x39d572]) {
      return;
    }
    _0x18050a['updateNodeData'](_0x39d572, {
      'src': _0x2cec51,
      'localPath': _0x191c74,
      'originalLocalPath': normalizeLocalPath(_0x253f3e?.['originalLocalPath'] || _0x191c74),
      'displayLocalPath': normalizeLocalPath(_0x253f3e?.["displayLocalPath"]),
      'thumbLocalPath': normalizeLocalPath(_0x253f3e?.['thumbLocalPath']),
      'fileName': _0x253f3e?.['filename'] || _0x42b643["fileName"],
      'originalWidth': Number(_0x253f3e?.["originalWidth"] || _0x42b643["width"]) || _0x42b643['width'],
      'originalHeight': Number(_0x253f3e?.["originalHeight"] || _0x42b643['height']) || _0x42b643["height"],
      'imageWidth': _0x42b643["width"],
      'imageHeight': _0x42b643["height"],
      'needsAutoResize': ![]
    });
  } catch (_0x112adb) {
    console["warn"]("[DragController] 保存自定义分镜提取结果失败:", _0x112adb);
  }
}
function _refreshStoryboardSourceCropExtractInBackground(_0x224d9e, _0x300af0, _0x6f1966, _0x29125e, _0x5c5625, _0x11de40) {
  const _0x494610 = a1115_0x59f1b5(_0x5c5625, _0x6f1966);
  if (!_0x494610 || !_0x300af0) {
    return;
  }
  const _0x4206c7 = {
    'cols': _0x6f1966?.["cols"],
    'rows': _0x6f1966?.["rows"],
    'width': _0x6f1966?.["width"],
    'height': _0x6f1966?.['height'],
    'gridGap': _0x6f1966?.['gridGap'],
    'gridLayout': _0x6f1966?.["gridLayout"]
  };
  a1115_0x175c58(_0x494610)['then'](_0x31c112 => {
    if (!_0x31c112 || !_0x224d9e["getStateRaw"]()["nodes"]?.[_0x300af0]) {
      return;
    }
    const _0x22d609 = resolveStoryboardCellSourceIndex(_0x5c5625, _0x29125e, _0x6f1966);
    const _0x32d756 = a1115_0xf9fee6(_0x4206c7, _0x29125e, _0x31c112, _0x11de40, _0x22d609);
    const _0x18cca7 = _buildExtractNodeCropPatch(_0x32d756);
    if (!_0x18cca7 || !_0x224d9e["getStateRaw"]()["nodes"]?.[_0x300af0]) {
      return;
    }
    _0x224d9e["updateNodeData"](_0x300af0, _0x18cca7);
    _persistStoryboardSourceCropExtract(_0x224d9e, _0x300af0, _0x32d756);
  })["catch"](_0xff7373 => {
    console["warn"]("[DragController] 异步刷新自定义分镜提取预览失败:", _0xff7373);
  });
}
let _cachedMultiSelectBoxEl = null;
const TITLE_DRAG_ACTIVATE_THRESHOLD_PX = 0x5;
const DRAG_SNAP_GUIDE_NODE_LIMIT = 0xa0;
const _dragSnapSpatialIndexCache = {
  'nodes': null,
  'persistRev': -0x1,
  'index': null
};
const _dragHitSpatialIndexCache = {
  'nodes': null,
  'persistRev': -0x1,
  'index': null
};
function _resolveDragSnapNodeRect(_0x590930) {
  if (!_0x590930 || typeof _0x590930 !== "object") {
    return null;
  }
  return {
    'x': _0x590930['x'],
    'y': _0x590930['y'],
    'width': _0x590930["width"] || 0xc8,
    'height': _0x590930["height"] || 0xc8
  };
}
function _getDragSnapSpatialIndex(_0x465f87) {
  const _0x31773e = _0x465f87?.["nodes"];
  if (!_0x31773e || typeof _0x31773e !== "object") {
    return null;
  }
  const _0x474c1e = _0x465f87?.["_nodeGeometryRev"] ?? _0x465f87?.['_persistRev'] ?? -0x1;
  if (_dragSnapSpatialIndexCache['nodes'] === _0x31773e && _dragSnapSpatialIndexCache["persistRev"] === _0x474c1e) {
    return _dragSnapSpatialIndexCache["index"];
  }
  const _0x407f4c = createNodeSpatialIndex(_0x31773e, {
    'resolveRect': _resolveDragSnapNodeRect
  });
  _dragSnapSpatialIndexCache['nodes'] = _0x31773e;
  _dragSnapSpatialIndexCache["persistRev"] = _0x474c1e;
  _dragSnapSpatialIndexCache["index"] = _0x407f4c;
  return _0x407f4c;
}
function _getDragHitSpatialIndex(_0x513188) {
  const _0x1439fd = _0x513188?.['nodes'];
  if (!_0x1439fd || typeof _0x1439fd !== "object") {
    return null;
  }
  const _0x57c915 = _0x513188?.['_nodeGeometryRev'] ?? _0x513188?.["_persistRev"] ?? -0x1;
  if (_dragHitSpatialIndexCache["nodes"] === _0x1439fd && _dragHitSpatialIndexCache['persistRev'] === _0x57c915) {
    return _dragHitSpatialIndexCache['index'];
  }
  const _0x24a016 = createNodeSpatialIndex(_0x1439fd);
  _dragHitSpatialIndexCache['nodes'] = _0x1439fd;
  _dragHitSpatialIndexCache["persistRev"] = _0x57c915;
  _dragHitSpatialIndexCache['index'] = _0x24a016;
  return _0x24a016;
}
function _shouldUseDragSnapGuides(_0x51d61d, _0x169d4d) {
  if (_0x51d61d?.['ui']?.["snapGuidesEnabled"] === ![] || _0x169d4d) {
    return ![];
  }
  const _0x19b6f3 = Number["isFinite"](_0x51d61d?.["_nodeCount"]) ? _0x51d61d["_nodeCount"] : Object["keys"](_0x51d61d?.["nodes"] || {})["length"];
  return _0x19b6f3 <= DRAG_SNAP_GUIDE_NODE_LIMIT;
}
function _collectAffectedEdgesForTargets(_0xdd9a1b, _0x19d884) {
  const _0x2f2fb9 = window["v2Renderer"];
  if (_0x2f2fb9 && typeof _0x2f2fb9["getEdgeIdsForNode"] === "function") {
    const _0x401336 = new Set();
    for (const _0x1d8239 of _0xdd9a1b || []) {
      const _0x1bfe85 = _0x2f2fb9["getEdgeIdsForNode"](_0x1d8239);
      if (!Array["isArray"](_0x1bfe85) || _0x1bfe85["length"] === 0x0) {
        continue;
      }
      for (const _0x46d0a4 of _0x1bfe85) {
        _0x401336['add'](_0x46d0a4);
      }
    }
    return Array['from'](_0x401336)["map"](_0xf562c5 => _0x19d884?.[_0xf562c5])["filter"](Boolean);
  }
  const _0x56164f = _0xdd9a1b instanceof Set ? _0xdd9a1b : new Set(_0xdd9a1b || []);
  return Object["values"](_0x19d884 || {})["filter"](_0x5044fb => _0x56164f['has'](_0x5044fb?.["sourceId"]) || _0x56164f["has"](_0x5044fb?.["targetId"]));
}
function _flushStoryboardNodesNow(..._0xa3c15a) {
  const _0x123359 = typeof window !== "undefined" ? window["v2Renderer"] : null;
  if (!_0x123359 || typeof _0x123359["flushNodes"] !== "function") {
    return ![];
  }
  return _0x123359["flushNodes"](Array["from"](new Set(_0xa3c15a["filter"](Boolean))));
}
function _flushMovedGroupPositionsNow(_0x4fdffe, _0x2f74b4, _0x130cdb) {
  if (typeof _0x130cdb !== "function") {
    return ![];
  }
  const _0x29c8fb = Array["from"](new Set(_0x2f74b4 || []))["filter"](_0x493c79 => _0x130cdb(_0x4fdffe?.[_0x493c79], "group"));
  if (_0x29c8fb["length"] === 0x0) {
    return ![];
  }
  const _0x5e5806 = typeof window !== "undefined" ? window["v2Renderer"] : null;
  if (!_0x5e5806 || typeof _0x5e5806['flushNodes'] !== "function") {
    return ![];
  }
  return _0x5e5806["flushNodes"](_0x29c8fb);
}
function _flushSelectionFeedbackNow(_0x4af259) {
  const _0x2f4161 = typeof window !== "undefined" ? window['v2Renderer'] : null;
  if (!_0x2f4161 || typeof _0x2f4161["flushSelection"] !== 'function') {
    return ![];
  }
  return _0x2f4161["flushSelection"](Array["from"](new Set((_0x4af259 || [])["filter"](Boolean))));
}
function _applyImmediateCellSwapPreview(_0x41d992, _0x318a2d, _0x1d0e4c) {
  const _0x3f9430 = typeof window !== 'undefined' ? window["v2Renderer"] : null;
  if (!_0x3f9430 || typeof _0x3f9430['applyImmediateCellSwapPreview'] !== "function") {
    return {
      'ok': ![],
      'revert'() {}
    };
  }
  return _0x3f9430["applyImmediateCellSwapPreview"](_0x41d992, {
    'sourceIndex': _0x318a2d,
    'targetIndex': _0x1d0e4c
  });
}
function _getDragEdgePreviewState(_0x5c34c7) {
  !_0x5c34c7["_dragEdgePreviewState"] && (_0x5c34c7["_dragEdgePreviewState"] = {
    'transformedEdgeIds': new Set()
  });
  return _0x5c34c7['_dragEdgePreviewState'];
}
function _formatEdgeTranslate(_0x58c8dc, _0x2f20f0) {
  return "translate(" + (Number(_0x58c8dc) || 0x0) + '\x20' + (Number(_0x2f20f0) || 0x0) + ')';
}
function _collectDraggedEdgeUpdates(_0x49b38d) {
  const {
    affectedEdges: _0x23d90c,
    edgeDomCache: _0x2bfb5f,
    nodes: _0xca40aa,
    targetSet: _0x156c8a,
    pendingDx: _0x11d0be,
    pendingDy: _0x666ee7,
    connectionLineStyle: _0x22b87a,
    useEdgeGroupTransform = ![]
  } = _0x49b38d;
  const _0x3ec350 = [];
  const _0x20da02 = [];
  _0x23d90c['forEach'](_0x515917 => {
    const _0xb0d1d5 = _0x2bfb5f["get"](_0x515917['id']);
    if (!_0xb0d1d5) {
      return;
    }
    const _0x5f3d35 = _0x515917['sourceId'];
    const _0x1b3063 = _0x515917["targetId"];
    const _0xc1270a = _0xca40aa[_0x5f3d35];
    const _0x1a4072 = _0xca40aa[_0x1b3063];
    if (!_0xc1270a || !_0x1a4072) {
      return;
    }
    const _0x1bf241 = _0x156c8a["has"](_0x5f3d35);
    const _0x2d62bb = _0x156c8a['has'](_0x1b3063);
    const _0x2d7603 = _0x1bf241 ? _0xc1270a['x'] + _0x11d0be : _0xc1270a['x'];
    const _0x4b8df0 = _0x1bf241 ? _0xc1270a['y'] + _0x666ee7 : _0xc1270a['y'];
    const _0x76be53 = _0x2d62bb ? _0x1a4072['x'] + _0x11d0be : _0x1a4072['x'];
    const _0x33834d = _0x2d62bb ? _0x1a4072['y'] + _0x666ee7 : _0x1a4072['y'];
    const _0x286435 = resolveConnectionEndpoints({
      'sourceX': _0x2d7603,
      'sourceY': _0x4b8df0,
      'sourceWidth': _0xc1270a["width"] || 0x104,
      'sourceHeight': _0xc1270a["height"] || 0x64,
      'targetX': _0x76be53,
      'targetY': _0x33834d,
      'targetWidth': _0x1a4072["width"] || 0x104,
      'targetHeight': _0x1a4072["height"] || 0x64
    });
    const {
      startX: _0x1d953e,
      startY: _0x4b0b63,
      endX: _0x339fad,
      endY: _0x490ec1
    } = _0x286435;
    if (useEdgeGroupTransform && _0x1bf241 && _0x2d62bb) {
      _0x20da02["push"]({
        'edgeId': _0x515917['id'],
        'domCache': _0xb0d1d5,
        'transform': _formatEdgeTranslate(_0x11d0be, _0x666ee7)
      });
      return;
    }
    const {
      d: _0x28a79b
    } = buildConnectionPathGeometry({
      ..._0x286435,
      'style': _0x22b87a
    });
    _0x3ec350["push"]({
      'domCache': _0xb0d1d5,
      'd': _0x28a79b
    });
  });
  return {
    'pathsToUpdate': _0x3ec350,
    'transformsToUpdate': _0x20da02
  };
}
function _applyDraggedEdgePathUpdates(_0x40c30a) {
  for (const _0x181d69 of _0x40c30a) {
    _0x181d69["domCache"]["hoverPath"]?.["setAttribute"]?.('d', _0x181d69['d']);
    _0x181d69['domCache']['pathEl']?.["setAttribute"]?.('d', _0x181d69['d']);
  }
}
function _applyDraggedEdgeTransformUpdates(_0x141fd5, _0x4fb408 = null) {
  for (const _0x4b77a9 of _0x141fd5) {
    if (!_0x4b77a9?.["domCache"]?.["groupEl"]) {
      continue;
    }
    _0x4b77a9["transform"] ? (_0x4b77a9["domCache"]["groupEl"]['setAttribute']?.("transform", _0x4b77a9['transform']), _0x4fb408?.["transformedEdgeIds"]?.['add']?.(_0x4b77a9["edgeId"])) : (_0x4b77a9["domCache"]["groupEl"]['removeAttribute']?.('transform'), _0x4fb408?.["transformedEdgeIds"]?.['delete']?.(_0x4b77a9['edgeId']));
  }
}
function _clearDragEdgeTransformPreview(_0x31cd92) {
  const _0x40d24b = _0x31cd92?.["_dragEdgePreviewState"];
  if (!_0x40d24b?.["transformedEdgeIds"]?.['size']) {
    return;
  }
  const _0x4e4126 = typeof window !== 'undefined' ? window['_edgeDomCache'] : null;
  if (!_0x4e4126 || typeof _0x4e4126["get"] !== "function") {
    _0x40d24b["transformedEdgeIds"]["clear"]();
    return;
  }
  for (const _0xb4d8b9 of _0x40d24b["transformedEdgeIds"]) {
    _0x4e4126['get'](_0xb4d8b9)?.["groupEl"]?.["removeAttribute"]?.("transform");
  }
  _0x40d24b["transformedEdgeIds"]["clear"]();
}
function _trackMinimapDragDot(_0x2c02f5, _0x48e156) {
  if (!_0x2c02f5 || !_0x48e156) {
    return;
  }
  if (!_0x2c02f5['_minimapDragDots']) {
    _0x2c02f5["_minimapDragDots"] = new Set();
  }
  _0x2c02f5["_minimapDragDots"]["add"](_0x48e156);
}
function _deferMinimapDragDotRefresh(_0x2876c4) {
  if (_0x2876c4) {
    _0x2876c4["_minimapDragDotsDeferred"] = !![];
  }
}
function _finishMinimapDragPreview(_0x2489ce) {
  if (!_0x2489ce) {
    return;
  }
  const _0x57a439 = _0x2489ce["_minimapDragDots"] instanceof Set ? _0x2489ce['_minimapDragDots'] : null;
  _0x57a439 && (_0x57a439["forEach"](_0x2a5bd5 => {
    if (_0x2a5bd5?.['style']) {
      _0x2a5bd5["style"]["transform"] = '';
    }
  }), _0x57a439['clear']());
  const _0x132531 = Boolean(_0x2489ce["_minimapDragDotsDeferred"] || _0x57a439);
  _0x2489ce["_minimapDragDotsDeferred"] = ![];
  _0x132531 && typeof window !== "undefined" && typeof window["_v2ScheduleMinimapNodeRefresh"] === "function" && window['_v2ScheduleMinimapNodeRefresh']();
}
function _paintDraggedEdges(_0x2ebbfc, _0x34b90a) {
  const _0x4a0b91 = isPerfProbeEnabled();
  const _0x239b44 = _0x4a0b91 && typeof performance !== 'undefined' && typeof performance["now"] === "function" ? performance["now"]() : 0x0;
  const {
    pathsToUpdate: _0x542acd,
    transformsToUpdate: _0x30828c
  } = _collectDraggedEdgeUpdates(_0x2ebbfc);
  _applyDraggedEdgeTransformUpdates(_0x30828c, _0x34b90a);
  _applyDraggedEdgePathUpdates(_0x542acd);
  if (_0x4a0b91) {
    const _0x3bf6dd = typeof performance !== "undefined" && typeof performance['now'] === "function" ? performance['now']() : Date['now']();
    const _0x57f283 = Array["isArray"](_0x2ebbfc?.['affectedEdges']) ? _0x2ebbfc["affectedEdges"]["length"] : 0x0;
    const _0x539a66 = _0x542acd["length"] + _0x30828c['length'];
    recordEdgeRedrawSample("partial", _0x3bf6dd - _0x239b44, {
      'reason': 'drag-controller',
      'edgeCount': _0x57f283,
      'visibleEdgeCount': _0x539a66,
      'updatedCount': _0x539a66,
      'createdCount': 0x0,
      'removedCount': 0x0,
      'reusedCount': _0x539a66,
      'skippedInvisibleCount': Math["max"](0x0, _0x57f283 - _0x539a66),
      'cacheSize': Number['isFinite'](_0x2ebbfc?.['edgeDomCache']?.['size']) ? _0x2ebbfc["edgeDomCache"]["size"] : 0x0
    });
  }
  return !![];
}
function _updateDraggedEdges(_0x23b777, _0x4715d9) {
  _paintDraggedEdges(_0x4715d9, _getDragEdgePreviewState(_0x23b777));
}
function _getMountedNodeWrapperEl(_0x19f104) {
  if (!_0x19f104) {
    return null;
  }
  if (typeof window === "undefined") {
    return null;
  }
  return window["v2Renderer"]?.["getMountedWrapper"]?.(_0x19f104) || null;
}
function _getNodeWrapperEl(_0x75826) {
  if (!_0x75826) {
    return null;
  }
  if (typeof window === "undefined") {
    return null;
  }
  const _0x355a66 = window["v2Renderer"];
  if (typeof _0x355a66?.["getDragSurfaceWrapper"] === 'function') {
    return _0x355a66["getDragSurfaceWrapper"](_0x75826);
  }
  return _getMountedNodeWrapperEl(_0x75826);
}
function _syncNodeDragPreview(_0x46db41, _0x1e48f6) {
  if (!_0x46db41) {
    return;
  }
  window["v2Renderer"]?.["syncNodeDragPreview"]?.(_0x46db41, _0x1e48f6);
}
function _trackNodeDragPreviewProxy(_0x4c1c3f, _0x16e6f1) {
  if (!_0x4c1c3f || !_0x16e6f1) {
    return;
  }
  if (!_0x4c1c3f["_nodeDragPreviewProxyIds"]) {
    _0x4c1c3f["_nodeDragPreviewProxyIds"] = new Set();
  }
  _0x4c1c3f["_nodeDragPreviewProxyIds"]["add"](String(_0x16e6f1));
}
function _clearNodeDragPreviewProxies(_0x7ea326, {
  settle = ![],
  dx = 0x0,
  dy = 0x0
} = {}) {
  const _0xdb3ba6 = _0x7ea326?.["_nodeDragPreviewProxyIds"] instanceof Set ? Array['from'](_0x7ea326['_nodeDragPreviewProxyIds']) : [];
  const _0x50428b = Number(dx);
  const _0x441af5 = Number(dy);
  const _0x8e561f = settle === !![] && Number["isFinite"](_0x50428b) && Number["isFinite"](_0x441af5);
  _0xdb3ba6["forEach"](_0x42e5b3 => {
    _syncNodeDragPreview(_0x42e5b3, _0x8e561f ? {
      'dx': _0x50428b,
      'dy': _0x441af5,
      'active': ![],
      'settle': !![]
    } : {
      'dx': 0x0,
      'dy': 0x0,
      'active': ![]
    });
  });
  _0x7ea326?.["_nodeDragPreviewProxyIds"]?.["clear"]?.();
}
function _settleNodeDragPreviewProxiesOnCommit(_0x48eb31, _0x42ffc9, _0x11f2d6) {
  if (!_0x48eb31?.["_nodeDragPreviewProxyIds"]?.["size"]) {
    return;
  }
  _0x48eb31['_nodeDragPreviewProxySettle'] = {
    'dx': _0x42ffc9,
    'dy': _0x11f2d6
  };
}
function _getMultiSelectBoxEl() {
  if (_cachedMultiSelectBoxEl && _cachedMultiSelectBoxEl["isConnected"]) {
    return _cachedMultiSelectBoxEl;
  }
  _cachedMultiSelectBoxEl = document["getElementById"]("v2-multi-select-box");
  return _cachedMultiSelectBoxEl;
}
function _collectDragTargetIds(_0x427049, _0x66ae08) {
  const _0x4d3f71 = new Set(_0x66ae08 || []);
  const _0x4a3bf2 = _0x427049["_parentToChildren"] || {};
  const _0x4cbbfb = Array['from'](_0x4d3f71);
  while (_0x4cbbfb["length"] > 0x0) {
    const _0x3d5615 = _0x4cbbfb["pop"]();
    const _0x13d79f = _0x4a3bf2[_0x3d5615];
    if (_0x13d79f && typeof _0x13d79f[Symbol['iterator']] === "function") {
      for (const _0x11f4e6 of _0x13d79f) {
        !_0x4d3f71['has'](_0x11f4e6) && (_0x4d3f71["add"](_0x11f4e6), _0x4cbbfb["push"](_0x11f4e6));
      }
      continue;
    }
    for (const _0x15a2e0 of Object["values"](_0x427049["nodes"] || {})) {
      _0x15a2e0?.['parentId'] === _0x3d5615 && !_0x4d3f71['has'](_0x15a2e0['id']) && (_0x4d3f71["add"](_0x15a2e0['id']), _0x4cbbfb["push"](_0x15a2e0['id']));
    }
  }
  return _0x4d3f71;
}
function _getNodeDragSessionCache(_0x58ae6e, _0x56eaf7, _0x2b5902, _0x2bd13b, _0x4cc0ed) {
  const _0x3e7720 = Array["isArray"](_0x2b5902) ? _0x2b5902["join"]('\x1f') : '';
  const _0x50c32f = _0x56eaf7?.["nodes"] || {};
  const _0x4f9a29 = _0x56eaf7?.["edges"] || {};
  const _0x5a4cf4 = _0x56eaf7?.["_parentToChildren"] || null;
  const _0x50f3e7 = _0x58ae6e?.["_nodeDragSessionCache"];
  if (_0x50f3e7 && _0x50f3e7["targetNodeId"] === _0x58ae6e["targetNodeId"] && _0x50f3e7["selectionKey"] === _0x3e7720 && _0x50f3e7["nodes"] === _0x50c32f && _0x50f3e7['edges'] === _0x4f9a29 && _0x50f3e7["parentToChildren"] === _0x5a4cf4 && _0x50f3e7['isGroupDrag'] === _0x2bd13b) {
    return _0x50f3e7;
  }
  const _0xf4740e = new Set(_0x2b5902 || []);
  const _0xa648b = _collectDragTargetIds(_0x56eaf7, _0x2b5902 || []);
  const _0x525baa = Array["from"](_0xa648b);
  const _0x41ee8a = _0x525baa["map"](_0x1aef35 => ({
    'id': _0x1aef35,
    'origNode': _0x50c32f[_0x1aef35],
    'minimapDot': !_0x2bd13b || _0xf4740e["has"](_0x1aef35) ? window['_v2MinimapDotMap']?.["get"](_0x1aef35) || document["getElementById"]("minimap-node-" + _0x1aef35) : null
  }))["filter"](_0xa74774 => _0xa74774['origNode']);
  const _0x1616ad = {
    'targetNodeId': _0x58ae6e["targetNodeId"],
    'selectionKey': _0x3e7720,
    'nodes': _0x50c32f,
    'edges': _0x4f9a29,
    'parentToChildren': _0x5a4cf4,
    'isGroupDrag': _0x2bd13b,
    'directTargetSet': _0xf4740e,
    'targetSet': _0xa648b,
    'targets': _0x525baa,
    'targetEntries': _0x41ee8a,
    'affectedEdges': _collectAffectedEdgesForTargets(_0xa648b, _0x4f9a29),
    'dragPayload': Array["isArray"](_0x2b5902) && _0x2b5902['length'] === 0x1 && typeof _0x4cc0ed === "function" ? _getImagePayloadFromNode(_0x4cc0ed, _0x50c32f[_0x58ae6e['targetNodeId']]) : null
  };
  _0x58ae6e["_nodeDragSessionCache"] = _0x1616ad;
  return _0x1616ad;
}
function _markNodeDraggingUiHidden(_0x2d1035, _0x5a937c, _0x38e296) {
  if (!_0x2d1035 || !_0x5a937c || !_0x38e296) {
    return;
  }
  !_0x2d1035["_draggingClassAppliedElements"] && (_0x2d1035["_draggingClassAppliedElements"] = new Map());
  if (_0x2d1035["_draggingClassAppliedElements"]["get"](_0x38e296) === _0x5a937c) {
    return;
  }
  _0x5a937c["classList"]['add']("is-ui-hidden");
  _0x5a937c['classList']['add']("is-dragging");
  _0x2d1035['_draggingClassAppliedElements']["set"](_0x38e296, _0x5a937c);
}
function _waitForCollageItemImage(_0x15ded5, _0x8c44a4, _0x1ced42, _0x674b2f) {
  if (typeof document === 'undefined') {
    _0x674b2f();
    return;
  }
  const _0x292427 = window["v2Renderer"]?.["queryMountedNodeElement"];
  if (typeof _0x292427 !== "function") {
    _0x674b2f();
    return;
  }
  const _0x30b229 = performance['now']();
  const _0x42f6d8 = 0x708;
  const _0xb01ed6 = () => {
    const _0x6122c1 = _0x292427(_0x15ded5, '.collage-item[data-collage-slot-index=\x22' + _0x8c44a4 + '\x22]');
    const _0x5c2680 = _0x6122c1 ? _0x6122c1['querySelector']("img") : null;
    if (_0x5c2680 && _0x5c2680["complete"] && _0x5c2680['naturalWidth'] > 0x0) {
      const _0x59db43 = _0x5c2680['getAttribute']('src') || '';
      if (!_0x1ced42 || _0x59db43 === _0x1ced42) {
        _0x674b2f();
        return;
      }
    }
    if (performance["now"]() - _0x30b229 >= _0x42f6d8) {
      _0x674b2f();
      return;
    }
    requestAnimationFrame(_0xb01ed6);
  };
  requestAnimationFrame(_0xb01ed6);
}
function _fadeOutGhost(_0x27e7ce, _0x103d0f = 0xa0) {
  if (!_0x27e7ce) {
    return;
  }
  const _0x92a510 = "opacity " + _0x103d0f / 0x3e8 + "s cubic-bezier(0.4, 0, 0.2, 1)";
  const _0x39d1b5 = String(_0x27e7ce["style"]["transition"] || '')['trim']();
  _0x27e7ce["style"]['transition'] = _0x39d1b5 && _0x39d1b5 !== 'none' ? _0x39d1b5 + ',\x20' + _0x92a510 : _0x92a510;
  _0x27e7ce['style']["opacity"] = '0';
  setTimeout(() => _0x27e7ce["remove"](), _0x103d0f);
}
function _drawImageCover(_0x2cb94a, _0xff353f, _0x3dfe89, _0x22ec78) {
  const _0xa953e0 = Math['max'](0x1, Number(_0xff353f?.['naturalWidth'] || _0xff353f?.['width']) || 0x1);
  const _0x3fa41d = Math["max"](0x1, Number(_0xff353f?.["naturalHeight"] || _0xff353f?.["height"]) || 0x1);
  const _0x372bae = Math["max"](0x1, Number(_0x3dfe89) || 0x1);
  const _0x437736 = Math['max'](0x1, Number(_0x22ec78) || 0x1);
  const _0x59445f = _0xa953e0 / _0x3fa41d;
  const _0x1c33c1 = _0x372bae / _0x437736;
  let _0x306fcd = 0x0;
  let _0x14643f = 0x0;
  let _0x16e7bc = _0xa953e0;
  let _0x255180 = _0x3fa41d;
  if (_0x59445f > _0x1c33c1) {
    _0x16e7bc = Math['max'](0x1, _0x3fa41d * _0x1c33c1);
    _0x306fcd = (_0xa953e0 - _0x16e7bc) / 0x2;
  } else {
    _0x59445f < _0x1c33c1 && (_0x255180 = Math["max"](0x1, _0xa953e0 / _0x1c33c1), _0x14643f = (_0x3fa41d - _0x255180) / 0x2);
  }
  _0x2cb94a["drawImage"](_0xff353f, _0x306fcd, _0x14643f, _0x16e7bc, _0x255180, 0x0, 0x0, _0x372bae, _0x437736);
}
function _createGhostFromImage(_0x4cfa17, _0x4438b3, _0xeac778, _0xaef0a4) {
  const _0x3fc1a3 = document["createElement"]("div");
  _0x3fc1a3["className"] = "v2-ghost-image";
  Object['assign'](_0x3fc1a3["style"], {
    'position': "fixed",
    'left': '0',
    'top': '0',
    'width': _0x4438b3 + 'px',
    'height': _0xeac778 + 'px',
    'opacity': '0.92',
    'pointerEvents': 'none',
    'zIndex': "10000",
    'borderRadius': "8px",
    'border': 'none',
    'boxShadow': "0 0 0 2px var(--white-80), 0 0 30px 0 var(--white-40), 0 12px 40px var(--black-60)",
    'overflow': "hidden",
    'willChange': "transform, opacity",
    'transition': "none",
    'background': "var(--bg-node)"
  });
  if (_0x4cfa17 && _0x4cfa17['complete'] && _0x4cfa17["naturalWidth"] > 0x0 && _0x4cfa17["naturalHeight"] > 0x0) {
    const _0x4991f6 = document["createElement"]("canvas");
    _0x4991f6["width"] = Math["max"](0x1, Math['round'](_0x4438b3));
    _0x4991f6["height"] = Math["max"](0x1, Math["round"](_0xeac778));
    Object["assign"](_0x4991f6["style"], {
      'width': '100%',
      'height': "100%",
      'display': "block"
    });
    const _0x480bc9 = _0x4991f6["getContext"]('2d', {
      'alpha': ![]
    });
    if (_0x480bc9) {
      try {
        _0x480bc9["imageSmoothingEnabled"] = !![];
        _0x480bc9["imageSmoothingQuality"] = "high";
        _drawImageCover(_0x480bc9, _0x4cfa17, _0x4991f6["width"], _0x4991f6["height"]);
        _0x3fc1a3["appendChild"](_0x4991f6);
        return _0x3fc1a3;
      } catch {}
    }
  }
  const _0x45044e = document["createElement"]('img');
  const _0x28d576 = _0x4cfa17 && (_0x4cfa17['currentSrc'] || _0x4cfa17["src"]) || _0xaef0a4 || '';
  if (_0x28d576) {
    _0x45044e["setAttribute"]("src", _0x28d576);
  }
  Object["assign"](_0x45044e["style"], {
    'width': '100%',
    'height': '100%',
    'objectFit': "cover",
    'display': "block",
    'transition': 'none'
  });
  _0x3fc1a3["appendChild"](_0x45044e);
  return _0x3fc1a3;
}
export function createDragController({
  store: _0x5e0ecf,
  isNodeType: _0x2701ea,
  getShortcuts: _0x71c1a7,
  hitTestNode: _0x54c291,
  screenToWorld: _0xb59064,
  generateId: _0xd44278,
  cloneNodesWithEdges: _0xe31c28,
  commit: _0x3fabe6,
  saveOutputBlobImpl = saveOutputBlob
}) {
  const _0x4df511 = createDropTargetSpatialQuery();
  const _0x3dd2be = (_0x5ea64e, _0x424ebb, _0x76c137) => _0x4df511({
    ..._0x5e0ecf["getStateRaw"](),
    'nodes': _0x76c137
  }, _0x5ea64e, _0x424ebb);
  const _0x27d7c3 = (_0x28b924, _0x169bdf, _0x4cfd84, _0x2cdbf3) => findStoryboardCellInfoAt(_0x28b924, _0x169bdf, _0x3dd2be(_0x28b924, _0x169bdf, _0x4cfd84), _0x2cdbf3);
  const _0x360803 = (_0x40af9f, _0x564936, _0x1d45eb) => findCollageSlotInfoAt(_0x40af9f, _0x564936, _0x3dd2be(_0x40af9f, _0x564936, _0x1d45eb));
  function _0x57ac2f(_0xced7ae, _0x53db00 = null) {
    const _0x530c63 = _0x5e0ecf["getStateRaw"]?.() || {};
    const _0x2f20c0 = Array['isArray'](_0x530c63["selectedNodeIds"]) ? [..._0x530c63["selectedNodeIds"]] : [];
    const _0x432cc4 = () => {
      _0x53db00 && typeof _0x5e0ecf["setSelectionMeta"] === "function" && _0x5e0ecf['setSelectionMeta'](_0x53db00);
      _0x5e0ecf["setSelectedNodes"](_0xced7ae);
    };
    typeof _0x5e0ecf['batch'] === "function" ? _0x5e0ecf["batch"](_0x432cc4) : _0x432cc4();
    _flushSelectionFeedbackNow([..._0x2f20c0, ...(Array["isArray"](_0xced7ae) ? _0xced7ae : [])]);
  }
  function _0x1d0346(_0x21c4e0, _0x18626a, _0x5e39b4, _0xcee3ab) {
    if (!_0x18626a || !_0x18626a["target"]) {
      return ![];
    }
    const _0x26a75d = _0x18626a["target"]['closest']('.node-label');
    if (!_0x26a75d || _0x26a75d["contentEditable"] === 'true') {
      return ![];
    }
    const _0x1f13cd = _0x26a75d["dataset"]["nodeId"] || _0x26a75d['parentElement'] && _0x26a75d["parentElement"]['id'];
    if (!_0x1f13cd) {
      return ![];
    }
    const _0x54d56c = _0x5e0ecf["getStateRaw"]()["selectedNodeIds"] || [];
    const _0x21ae0c = _0x54d56c["includes"](_0x1f13cd);
    _0x21c4e0["isDragging"] = !![];
    _0x21c4e0["dragSource"] = "title";
    _0x21c4e0["targetNodeId"] = _0x1f13cd;
    _0x21c4e0["lastWorldX"] = _0x5e39b4;
    _0x21c4e0["lastWorldY"] = _0xcee3ab;
    _0x21c4e0["pendingDx"] = 0x0;
    _0x21c4e0["pendingDy"] = 0x0;
    _0x21c4e0["hasMoved"] = ![];
    _0x21c4e0["wasSelectedOnDown"] = _0x21ae0c;
    _0x21c4e0["titleDragStartScreenX"] = Number["isFinite"](_0x18626a["clientX"]) ? _0x18626a["clientX"] : 0x0;
    _0x21c4e0["titleDragStartScreenY"] = Number["isFinite"](_0x18626a['clientY']) ? _0x18626a['clientY'] : 0x0;
    _0x21c4e0["titleDragActivated"] = ![];
    _0x21c4e0["titleDragPendingSelectNodeId"] = _0x21ae0c ? null : _0x1f13cd;
    return !![];
  }
  function _0x3de61a(_0x115a36, _0x12dc7b, _0x3f3a56, _0x7e0eca, _0x56c13e, _0x270211, _0x51741b) {
    const _0x48e177 = _0x5e0ecf["getStateRaw"]();
    const {
      viewport: _0x2097ec,
      nodes: _0x5672e6
    } = _0x48e177;
    const _0x5c580f = _0x5672e6[_0x51741b?.['target']?.["closest"]?.('.v2-node')?.['id']];
    const _0x1d5641 = _0x5c580f && !_0x2701ea(_0x5c580f, "group") ? _0x5c580f['id'] : _0x54c291(_0x12dc7b, _0x3f3a56, _0x5672e6, _0x2097ec, null, ![], {
      'spatialIndex': _getDragHitSpatialIndex(_0x48e177)
    });
    const _0x2b154a = _0x1d5641 ? _0x5672e6[_0x1d5641] : null;
    if (!_0x2b154a) {
      return ![];
    }
    const _0x214d57 = _0x2b154a;
    if (_0x2701ea(_0x214d57, "group")) {
      const _0x138000 = typeof _0x51741b?.["target"]?.['closest'] === "function" ? _0x51741b["target"]["closest"]("[data-group-drag-handle-for]") : null;
      if (String(_0x138000?.["dataset"]?.["groupDragHandleFor"] || '') !== String(_0x214d57['id'])) {
        return ![];
      }
    }
    if (_0x270211) {
      const _0x37f097 = _0x5e0ecf["getStateRaw"]()["selectedNodeIds"];
      const _0x1ad6e7 = _0x37f097['includes'](_0x214d57['id']) ? [..._0x37f097] : [_0x214d57['id']];
      const _0x41178b = _0xe31c28(_0x1ad6e7, 0x0, 0x0);
      const _0x562649 = Object["values"](_0x41178b);
      _0x5e0ecf["setSelectedNodes"](_0x562649);
      const _0x5aa01a = _0x41178b[_0x214d57['id']] || _0x562649[0x0];
      _0x115a36["isDragging"] = !![];
      _0x115a36['dragSource'] = "node";
      _0x115a36["targetNodeId"] = _0x5aa01a;
      _0x115a36["lastWorldX"] = _0x7e0eca;
      _0x115a36["lastWorldY"] = _0x56c13e;
      _0x115a36["titleDragPendingSelectNodeId"] = null;
      _0x115a36['titleDragActivated'] = ![];
      _0x115a36['titleDragStartScreenX'] = 0x0;
      _0x115a36["titleDragStartScreenY"] = 0x0;
      document["body"]["classList"]["add"]('is-dragging');
      return !![];
    }
    if (_0x2701ea(_0x214d57, "storyboard") && _0x214d57["isEditing"]) {
      const _0x3156df = getStoryboardCellMetrics(_0x214d57);
      const _0x8b32de = getStoryboardCellIndexAtWorldPoint(_0x214d57, _0x7e0eca, _0x56c13e);
      const _0x2bb613 = _0x214d57["cells"] && _0x214d57['cells'][_0x8b32de];
      if (_0x8b32de >= 0x0 && _0x2bb613 && !_isCellEmpty(_0x2bb613)) {
        const _0x58e5ad = getStoryboardCellPixelBounds(_0x214d57, _0x8b32de);
        const _0x37e98c = (_0x58e5ad?.["width"] || _0x3156df['cellWidth']) * _0x2097ec["zoom"];
        const _0x468e81 = (_0x58e5ad?.["height"] || _0x3156df['cellHeight']) * _0x2097ec["zoom"];
        const _0x1a5a81 = _0x12dc7b - _0x37e98c / 0x2;
        const _0x6fbb5e = _0x3f3a56 - _0x468e81 / 0x2;
        const _0x1847e2 = document["createElement"]("div");
        _0x1847e2['className'] = "v2-ghost-image";
        Object["assign"](_0x1847e2["style"], {
          'position': "fixed",
          'left': '0',
          'top': '0',
          'width': _0x37e98c + 'px',
          'height': _0x468e81 + 'px',
          'transform': "translate(" + _0x1a5a81 + "px, " + _0x6fbb5e + "px)",
          'opacity': "0.85",
          'pointerEvents': 'none',
          'zIndex': '10000',
          'borderRadius': "8px",
          'border': 'none',
          'boxShadow': '0\x200\x200\x202px\x20var(--white-80),\x200\x200\x2030px\x200\x20var(--white-40),\x200\x2012px\x2040px\x20var(--black-60)',
          'overflow': 'hidden',
          'willChange': "transform",
          'transition': "none"
        });
        const _0x27c510 = document["getElementById"]("cell-" + _0x214d57['id'] + '-' + _0x8b32de);
        const _0x249056 = _0x27c510?.["querySelector"]("img.storyboard-cell-img--source-crop") || null;
        const _0x5dfe34 = _0x27c510?.["querySelector"]('.storyboard-cell-img') || null;
        const _0x4dbd4a = a1115_0x4ae7d0(_0x2bb613);
        const _0x247c72 = _0x249056 ? a1115_0x3506e4(_0x214d57, _0x8b32de, _0x2bb613, 'storyboard_drag_' + _0x214d57['id'] + '_' + _0x8b32de + ".jpg") : null;
        if (_0x247c72?.["dataUrl"]) {
          const _0x24d43e = getAutoMediaSizeByShortSide(_0x247c72["width"], _0x247c72["height"]);
          const _0x5b85c7 = _0x24d43e["width"] * _0x2097ec["zoom"];
          const _0x81b50e = _0x24d43e['height'] * _0x2097ec["zoom"];
          Object['assign'](_0x1847e2['style'], {
            'width': _0x5b85c7 + 'px',
            'height': _0x81b50e + 'px',
            'transform': "translate(" + _0x12dc7b + 'px,\x20' + _0x3f3a56 + "px) translate(-50%, -50%)"
          });
          const _0x202c0c = document["createElement"]('img');
          _0x202c0c['setAttribute']("src", _0x247c72['dataUrl']);
          Object['assign'](_0x202c0c["style"], {
            'width': '100%',
            'height': '100%',
            'objectFit': "contain",
            'display': "block",
            'pointerEvents': "none",
            'transition': "none"
          });
          _0x1847e2["appendChild"](_0x202c0c);
        } else {
          if (_0x5dfe34) {
            const _0x3d1ac3 = Math["max"](0x1, Math["round"](_0x37e98c));
            const _0x3eb8b6 = Math["max"](0x1, Math["round"](_0x468e81));
            const _0x744a32 = document["createElement"]("canvas");
            _0x744a32['width'] = _0x3d1ac3;
            _0x744a32['height'] = _0x3eb8b6;
            Object["assign"](_0x744a32['style'], {
              'width': "100%",
              'height': "100%",
              'display': "block"
            });
            const _0xc447db = _0x744a32['getContext']('2d', {
              'alpha': ![]
            });
            if (_0xc447db && _0x5dfe34["complete"] && _0x5dfe34['naturalWidth'] > 0x0) {
              try {
                _0xc447db["imageSmoothingEnabled"] = !![];
                _0xc447db["imageSmoothingQuality"] = 'high';
                _0xc447db['drawImage'](_0x5dfe34, 0x0, 0x0, _0x3d1ac3, _0x3eb8b6);
                _0x1847e2["appendChild"](_0x744a32);
              } catch {
                const _0x898807 = document["createElement"]("img");
                const _0x53df00 = _0x5dfe34["currentSrc"] || _0x5dfe34['src'] || _0x4dbd4a;
                if (_0x53df00) {
                  _0x898807["setAttribute"]('src', _0x53df00);
                }
                Object["assign"](_0x898807['style'], {
                  'width': "100%",
                  'height': "100%",
                  'objectFit': "cover",
                  'display': "block",
                  'transition': "none"
                });
                _0x1847e2['appendChild'](_0x898807);
              }
            } else {
              const _0x220962 = document["createElement"]("img");
              const _0x49ea86 = _0x5dfe34["currentSrc"] || _0x5dfe34["src"] || _0x4dbd4a;
              if (_0x49ea86) {
                _0x220962["setAttribute"]("src", _0x49ea86);
              }
              Object["assign"](_0x220962["style"], {
                'width': '100%',
                'height': "100%",
                'objectFit': 'cover',
                'display': "block",
                'transition': "none"
              });
              _0x1847e2['appendChild'](_0x220962);
            }
          } else {
            const _0x12ec35 = document["createElement"]('img');
            if (_0x4dbd4a) {
              _0x12ec35["setAttribute"]("src", _0x4dbd4a);
            }
            Object["assign"](_0x12ec35["style"], {
              'width': '100%',
              'height': "100%",
              'objectFit': 'cover',
              'display': "block",
              'transition': "none"
            });
            _0x1847e2["appendChild"](_0x12ec35);
          }
        }
        document['body']["appendChild"](_0x1847e2);
        const _0x2ab0d6 = _0x51741b?.["target"]?.["closest"](".sb-cell") || null;
        if (_0x2ab0d6) {
          _0x2ab0d6["classList"]["add"]("is-drag-source");
        }
        _0x115a36['isDraggingCell'] = !![];
        _0x115a36["dragSource"] = "cell";
        _0x115a36['targetNodeId'] = _0x214d57['id'];
        _0x115a36["sourceCellIndex"] = _0x8b32de;
        _0x115a36['draggedCellData'] = {
          ..._0x2bb613
        };
        _0x115a36["ghostEl"] = _0x1847e2;
        _0x115a36['sourceCellEl'] = _0x2ab0d6;
        _0x115a36["lastWorldX"] = _0x7e0eca;
        _0x115a36['lastWorldY'] = _0x56c13e;
        _0x115a36["titleDragPendingSelectNodeId"] = null;
        _0x115a36["titleDragActivated"] = ![];
        _0x115a36["titleDragStartScreenX"] = 0x0;
        _0x115a36["titleDragStartScreenY"] = 0x0;
        document['body']['classList']["add"]("is-dragging");
        return !![];
      }
    }
    const _0x463482 = _0x5e0ecf['getStateRaw']()["selectedNodeIds"];
    const _0x354ed9 = _0x463482["includes"](_0x214d57['id']);
    _0x115a36["isDragging"] = !![];
    _0x115a36["dragSource"] = 'node';
    _0x115a36["targetNodeId"] = _0x214d57['id'];
    _0x115a36["lastWorldX"] = _0x7e0eca;
    _0x115a36["lastWorldY"] = _0x56c13e;
    _0x115a36["titleDragPendingSelectNodeId"] = null;
    _0x115a36["titleDragActivated"] = ![];
    _0x115a36["titleDragStartScreenX"] = 0x0;
    _0x115a36['titleDragStartScreenY'] = 0x0;
    _0x115a36["wasSelectedOnDown"] = _0x354ed9;
    document["body"]["classList"]['add']('is-dragging');
    const _0x1b3d96 = _0x71c1a7();
    const _0x3c9630 = _0x1b3d96['multi-select'] ? _0x1b3d96["multi-select"]["keys"][0x0] : "Shift";
    let _0x38df7c = ![];
    if (_0x3c9630 === "Ctrl") {
      _0x38df7c = _0x51741b?.['ctrlKey'] || _0x51741b?.["metaKey"];
    } else {
      if (_0x3c9630 === 'Shift') {
        _0x38df7c = _0x51741b?.["shiftKey"];
      } else {
        if (_0x3c9630 === "Alt") {
          _0x38df7c = _0x51741b?.["altKey"];
        }
      }
    }
    _0x38df7c ? _0x463482['includes'](_0x214d57['id']) ? (_0x57ac2f(_0x463482["filter"](_0x3d68df => _0x3d68df !== _0x214d57['id']), {
      'source': "shift"
    }), _0x115a36["isDragging"] = ![], _0x115a36["dragSource"] = null, _0x115a36["targetNodeId"] = null) : _0x57ac2f([..._0x463482, _0x214d57['id']], {
      'source': "shift"
    }) : !_0x463482["includes"](_0x214d57['id']) && _0x57ac2f([_0x214d57['id']], {
      'source': "click"
    });
    return !![];
  }
  function _0x42be9e(_0x1cbd05, _0x16e889, _0x726026, _0x26c9bd, _0x1da403, _0x755cc3) {
    _0x1cbd05['ghostEl'] && (_0x1cbd05['ghostEl']['style']["transform"] = "translate(" + _0x16e889 + 'px,\x20' + _0x726026 + "px) translate(-50%, -50%)");
    const _0x52d68b = _0x27d7c3(_0x26c9bd, _0x1da403, _0x755cc3, {
      'nearestInGap': !![]
    });
    const _0x4205a0 = _0x52d68b ? _0x52d68b["nodeId"] : null;
    const _0x1d194f = _0x1cbd05["lastHoverNodeId"] || null;
    (_0x4205a0 !== _0x1d194f || _0x52d68b && _0x52d68b["cellIndex"] !== _0x1cbd05['lastHoverCellIndex']) && (_0x1d194f && window["v2Renderer"]?.['highlightDropSlot']?.(_0x1d194f, {
      'kind': "storyboard",
      'index': -0x1
    }), _0x4205a0 && window["v2Renderer"]?.["highlightDropSlot"]?.(_0x4205a0, {
      'kind': "storyboard",
      'index': _0x52d68b["cellIndex"]
    }), _0x1cbd05["lastHoverNodeId"] = _0x4205a0, _0x1cbd05["lastHoverCellIndex"] = _0x52d68b ? _0x52d68b['cellIndex'] : -0x1);
    _0x1cbd05['lastWorldX'] = _0x26c9bd;
    _0x1cbd05['lastWorldY'] = _0x1da403;
  }
  function _0x5a6de5(_0x9c00c0, _0x7a7cd, _0xcb6ee7, _0x4cbf80, _0x5e6aa7, _0x44b16e, _0x52fd9c, _0x2d2609) {
    if (_0x9c00c0["editRejected"]) {
      return;
    }
    const {
      viewport: _0x2afe83,
      nodes: _0x39224b,
      selectedNodeIds: _0xb6ffc9,
      edges: _0x880468
    } = _0x2d2609;
    const _0x483665 = _0xb6ffc9["includes"](_0x9c00c0['targetNodeId']) ? _0xb6ffc9 : [_0x9c00c0["targetNodeId"]];
    const _0x2895cb = _0x39224b[_0x9c00c0["targetNodeId"]];
    const _0x557f7b = _0x483665['length'] === 0x1 && _0x2701ea(_0x2895cb, "group");
    const {
      targetSet: _0x2df0f8,
      targets: _0x18a394,
      targetEntries: _0xb6c71f,
      affectedEdges: _0x1d3b5b,
      dragPayload: _0x5dc1ff
    } = _getNodeDragSessionCache(_0x9c00c0, _0x2d2609, _0x483665, _0x557f7b, _0x2701ea);
    if (_0x9c00c0["dragSource"] === "title" && _0x9c00c0["titleDragActivated"] !== !![]) {
      const _0x482258 = Number["isFinite"](_0x9c00c0["titleDragStartScreenX"]) ? _0x9c00c0['titleDragStartScreenX'] : _0x7a7cd;
      const _0x224943 = Number["isFinite"](_0x9c00c0["titleDragStartScreenY"]) ? _0x9c00c0["titleDragStartScreenY"] : _0xcb6ee7;
      const _0x4a626c = Math["hypot"](_0x7a7cd - _0x482258, _0xcb6ee7 - _0x224943);
      if (_0x4a626c <= TITLE_DRAG_ACTIVATE_THRESHOLD_PX) {
        return;
      }
      _0x9c00c0["titleDragActivated"] = !![];
      document["body"]['classList']["add"]("is-dragging");
      const _0x94487b = _0x9c00c0["titleDragPendingSelectNodeId"];
      _0x94487b && !_0xb6ffc9["includes"](_0x94487b) && _0x57ac2f([_0x94487b], {
        'source': "click"
      });
      _0x9c00c0["titleDragPendingSelectNodeId"] = null;
    }
    _0x9c00c0['editPointer'] = [_0x7a7cd, _0xcb6ee7, _0x4cbf80, _0x5e6aa7, _0x44b16e, _0x52fd9c];
    if (!_0x9c00c0["editInteraction"]) {
      if (_0x4cbf80 === _0x9c00c0["lastWorldX"] && _0x5e6aa7 === _0x9c00c0["lastWorldY"]) {
        return;
      }
      const _0x25a47e = _0x18a394["map"](_0x20014b => [_0x20014b, _0x39224b[_0x20014b]?.['x'], _0x39224b[_0x20014b]?.['y'], _0x39224b[_0x20014b]?.["width"], _0x39224b[_0x20014b]?.['height']]);
      const _0x562b7c = _0x9c00c0["editInteraction"] = beginNodeEditInteraction(_0x5e0ecf, _0x18a394);
      if (!_0x562b7c["ready"]) {
        void _0x562b7c['wait']["then"](_0x16410b => {
          if (_0x9c00c0["editInteraction"] !== _0x562b7c || !_0x9c00c0['isDragging']) {
            return;
          }
          const _0x575478 = _0x5e0ecf['getStateRaw']()["nodes"];
          _0x16410b = _0x16410b && _0x25a47e['every'](([_0x52734b, _0x12cc16, _0x583302, _0x5a6443, _0x12616c]) => _0x575478[_0x52734b]?.['x'] === _0x12cc16 && _0x575478[_0x52734b]?.['y'] === _0x583302 && _0x575478[_0x52734b]?.["width"] === _0x5a6443 && _0x575478[_0x52734b]?.["height"] === _0x12616c);
          if (!_0x16410b) {
            _0x9c00c0["editRejected"] = !![];
            _0x48379e(_0x9c00c0, _0x9c00c0["editPointer"][0x0], _0x9c00c0["editPointer"][0x1], !![]);
            return;
          }
          _0x5a6de5(_0x9c00c0, ..._0x9c00c0["editPointer"], _0x5e0ecf['getStateRaw']());
        });
      }
    }
    if (!(_0x9c00c0['editInteraction']['canPreview']?.() ?? _0x9c00c0["editInteraction"]["allowed"]())) {
      _0x9c00c0["nodeGeometryPreviewIds"]?.["length"] && (_0x9c00c0["editRejected"] = !![], _0x48379e(_0x9c00c0, _0x7a7cd, _0xcb6ee7, !![]));
      return;
    }
    if (_0x483665['length'] === 0x1) {
      const _0x3b57df = _0x5dc1ff;
      if (_0x3b57df) {
        const _0x54c357 = _0x27d7c3(_0x44b16e, _0x52fd9c, _0x39224b);
        const _0x1887e1 = _0x54c357 ? _0x39224b[_0x54c357["nodeId"]] : null;
        const _0x4370a0 = !!_0x3b57df && !!_0x1887e1 && _0x1887e1["isEditing"] === !![];
        let _0x254967 = _0x4370a0 ? _0x54c357["nodeId"] : null;
        let _0x2698f6 = _0x4370a0 ? _0x54c357['cellIndex'] : -0x1;
        let _0x1988e1 = _0x4370a0 ? "storyboard" : '';
        if (!_0x4370a0) {
          const _0x4149c6 = _0x360803(_0x44b16e, _0x52fd9c, _0x39224b);
          const _0x2e7be0 = _0x4149c6 ? _0x39224b[_0x4149c6['nodeId']] : null;
          const _0x46f4b4 = !!_0x3b57df && !!_0x2e7be0 && _0x2e7be0['isEditing'] === !![];
          _0x254967 = _0x46f4b4 ? _0x4149c6["nodeId"] : null;
          _0x2698f6 = _0x46f4b4 ? _0x4149c6['itemIndex'] : -0x1;
          _0x1988e1 = _0x46f4b4 ? "collage" : '';
        }
        const _0x5d1949 = _0x9c00c0["lastHoverNodeId"] || null;
        if (_0x254967 !== _0x5d1949 || _0x2698f6 !== (_0x9c00c0["lastHoverCellIndex"] ?? -0x1) || _0x1988e1 !== (_0x9c00c0["lastHoverKind"] || '')) {
          if (_0x5d1949) {
            _clearDropSlotHighlight(_0x5d1949);
          }
          if (_0x254967) {
            _highlightDropSlot(_0x254967, _0x1988e1, _0x2698f6);
          }
          _0x9c00c0['lastHoverNodeId'] = _0x254967;
          _0x9c00c0["lastHoverCellIndex"] = _0x2698f6;
          _0x9c00c0["lastHoverKind"] = _0x1988e1;
        }
      } else {
        _0x9c00c0["lastHoverNodeId"] && (_clearDropSlotHighlight(_0x9c00c0["lastHoverNodeId"]), _0x9c00c0["lastHoverNodeId"] = null, _0x9c00c0["lastHoverCellIndex"] = -0x1, _0x9c00c0["lastHoverKind"] = '');
      }
    }
    let _0x46058b = _0x4cbf80;
    let _0x158c3f = _0x5e6aa7;
    if (window["v2SnapToGrid"]) {
      const _0x41665e = _0x9c00c0["pendingDx"] || 0x0;
      const _0x2811d0 = _0x9c00c0['pendingDy'] || 0x0;
      const _0x1e0039 = _0x46058b - _0x9c00c0['lastWorldX'];
      const _0x4692f8 = _0x158c3f - _0x9c00c0["lastWorldY"];
      if (_0x483665["length"] === 0x1) {
        const _0xe97be3 = _0x39224b[_0x9c00c0["targetNodeId"]];
        if (_0xe97be3) {
          const _0x267165 = _0xe97be3['x'] + _0x41665e + _0x1e0039;
          const _0x26aca8 = _0xe97be3['y'] + _0x2811d0 + _0x4692f8;
          _0x46058b += snapToCanvasGrid(_0x267165) - _0x267165;
          _0x158c3f += snapToCanvasGrid(_0x26aca8) - _0x26aca8;
        }
      } else {
        let _0x119300 = Infinity;
        let _0xd4497f = Infinity;
        _0x18a394["forEach"](_0x394110 => {
          const _0x5a8258 = _0x39224b[_0x394110];
          if (!_0x5a8258) {
            return;
          }
          _0x119300 = Math["min"](_0x119300, (_0x5a8258['x'] || 0x0) + _0x41665e);
          _0xd4497f = Math["min"](_0xd4497f, (_0x5a8258['y'] || 0x0) + _0x2811d0);
        });
        if (Number['isFinite'](_0x119300) && Number['isFinite'](_0xd4497f)) {
          const _0x9b9b07 = _0x119300 + _0x1e0039;
          const _0x30ec8a = _0xd4497f + _0x4692f8;
          _0x46058b += snapToCanvasGrid(_0x9b9b07) - _0x9b9b07;
          _0x158c3f += snapToCanvasGrid(_0x30ec8a) - _0x30ec8a;
        }
      }
    }
    const _0x1e51e8 = _shouldUseDragSnapGuides(_0x2d2609, _0x557f7b);
    const _0x40427e = _0x1e51e8 ? _getDragSnapSpatialIndex(_0x2d2609) : null;
    if (_0x1e51e8 && _0x483665["length"] === 0x1) {
      const _0x3b5de3 = _0x2895cb;
      if (_0x3b5de3) {
        const _0x581fa8 = _0x9c00c0["pendingDx"] || 0x0;
        const _0x21dddd = _0x9c00c0["pendingDy"] || 0x0;
        const _0x2f4600 = _0x3b5de3['x'] + _0x581fa8 + (_0x46058b - _0x9c00c0["lastWorldX"]);
        const _0x75176c = _0x3b5de3['y'] + _0x21dddd + (_0x158c3f - _0x9c00c0['lastWorldY']);
        const _0x3c3d7d = computeSingleNodeSnapGuides({
          'nodesById': _0x2d2609['nodes'],
          'dragNodeId': _0x9c00c0["targetNodeId"],
          'proposedX': _0x2f4600,
          'proposedY': _0x75176c,
          'width': _0x3b5de3['width'] || 0xc8,
          'height': _0x3b5de3["height"] || 0xc8,
          'viewport': _0x2afe83,
          'thresholdPx': 0x8,
          'spatialIndex': _0x40427e
        });
        Number["isFinite"](_0x3c3d7d["snappedX"]) && (_0x46058b += _0x3c3d7d['snappedX'] - _0x2f4600);
        Number["isFinite"](_0x3c3d7d['snappedY']) && (_0x158c3f += _0x3c3d7d["snappedY"] - _0x75176c);
        Array["isArray"](_0x3c3d7d["guideLines"]) && _0x3c3d7d["guideLines"]["length"] > 0x0 ? window['_showSnapGuideLines']?.(_0x3c3d7d["guideLines"]) : window["_clearSnapGuideLines"]?.();
      } else {
        window['_clearSnapGuideLines']?.();
      }
    } else {
      if (_0x1e51e8 && _0x483665["length"] >= 0x2) {
        const _0x41bd11 = _0x9c00c0["pendingDx"] || 0x0;
        const _0x2639d7 = _0x9c00c0["pendingDy"] || 0x0;
        const _0x8ca21c = _0x46058b - _0x9c00c0["lastWorldX"];
        const _0x5ac071 = _0x158c3f - _0x9c00c0['lastWorldY'];
        let _0x122ddb = Infinity;
        let _0x4d78b4 = Infinity;
        let _0x510ae3 = -Infinity;
        let _0x4e52ae = -Infinity;
        let _0x49b630 = 0x0;
        _0x18a394['forEach'](_0x2c7abc => {
          const _0x283c5d = _0x39224b[_0x2c7abc];
          if (!_0x283c5d) {
            return;
          }
          _0x49b630 += 0x1;
          const _0x2e61f2 = (_0x283c5d['x'] || 0x0) + _0x41bd11;
          const _0x38e02e = (_0x283c5d['y'] || 0x0) + _0x2639d7;
          const _0x26380c = _0x283c5d["width"] || 0xc8;
          const _0x20e379 = _0x283c5d["height"] || 0xc8;
          _0x122ddb = Math["min"](_0x122ddb, _0x2e61f2);
          _0x4d78b4 = Math["min"](_0x4d78b4, _0x38e02e);
          _0x510ae3 = Math["max"](_0x510ae3, _0x2e61f2 + _0x26380c);
          _0x4e52ae = Math["max"](_0x4e52ae, _0x38e02e + _0x20e379);
        });
        if (_0x49b630 > 0x0 && Number["isFinite"](_0x122ddb) && Number["isFinite"](_0x4d78b4)) {
          const _0x511006 = _0x122ddb + _0x8ca21c;
          const _0x17ce2a = _0x4d78b4 + _0x5ac071;
          const _0x52efc2 = computeMultiNodeSnapGuides({
            'nodesById': _0x2d2609["nodes"],
            'movingNodeIds': _0x18a394,
            'proposedBounds': {
              'minX': _0x511006,
              'minY': _0x17ce2a,
              'width': _0x510ae3 - _0x122ddb,
              'height': _0x4e52ae - _0x4d78b4
            },
            'viewport': _0x2afe83,
            'thresholdPx': 0x8,
            'spatialIndex': _0x40427e
          });
          Number["isFinite"](_0x52efc2["snappedX"]) && (_0x46058b += _0x52efc2["snappedX"] - _0x511006);
          Number["isFinite"](_0x52efc2["snappedY"]) && (_0x158c3f += _0x52efc2["snappedY"] - _0x17ce2a);
          Array["isArray"](_0x52efc2["guideLines"]) && _0x52efc2["guideLines"]['length'] > 0x0 ? window["_showSnapGuideLines"]?.(_0x52efc2["guideLines"]) : window["_clearSnapGuideLines"]?.();
        } else {
          window["_clearSnapGuideLines"]?.();
        }
      } else {
        window["_clearSnapGuideLines"]?.();
      }
    }
    const _0x9f7d0d = _0x46058b - _0x9c00c0["lastWorldX"];
    const _0x2d318b = _0x158c3f - _0x9c00c0['lastWorldY'];
    if (_0x9f7d0d !== 0x0 || _0x2d318b !== 0x0) {
      _0x9c00c0["pendingDx"] = (_0x9c00c0["pendingDx"] || 0x0) + _0x9f7d0d;
      _0x9c00c0['pendingDy'] = (_0x9c00c0["pendingDy"] || 0x0) + _0x2d318b;
      !_0x9c00c0["hasMoved"] && Math["hypot"](_0x9c00c0['pendingDx'], _0x9c00c0["pendingDy"]) > 0x3 && (_0x9c00c0["hasMoved"] = !![]);
      const _0x44b437 = [];
      const _0x348c3e = [];
      const _0x378ac2 = [];
      _0xb6c71f['forEach'](({
        id: _0xcdbc20,
        origNode: _0x371326,
        minimapDot: _0x3e9f8d
      }) => {
        const _0x3b34d9 = _getNodeWrapperEl(_0xcdbc20);
        const _0x148af1 = _0x3b34d9 ? null : _getMountedNodeWrapperEl(_0xcdbc20);
        _0x9c00c0["hasMoved"] && (_0x3b34d9 ? _0x2701ea(_0x371326, "group") ? (_trackNodeDragPreviewProxy(_0x9c00c0, _0xcdbc20), _syncNodeDragPreview(_0xcdbc20, {
          'remove': !![],
          'dx': _0x9c00c0['pendingDx'],
          'dy': _0x9c00c0["pendingDy"],
          'active': !![]
        })) : _syncNodeDragPreview(_0xcdbc20, {
          'remove': !![]
        }) : _0x348c3e["push"]({
          'id': _0xcdbc20,
          'pendingDx': _0x9c00c0["pendingDx"],
          'pendingDy': _0x9c00c0["pendingDy"]
        }));
        const _0x4634ce = _0x3b34d9 || _0x148af1;
        _0x4634ce && _0x44b437["push"]({
          'id': _0xcdbc20,
          'el': _0x4634ce,
          'origNode': _0x371326,
          'pendingDx': _0x9c00c0['pendingDx'],
          'pendingDy': _0x9c00c0["pendingDy"],
          'hasMoved': _0x9c00c0["hasMoved"]
        });
        if (_0x3e9f8d && window["_v2MinimapScale"]) {
          if (_0x378ac2["length"] >= MINIMAP_LIVE_DRAG_DOT_LIMIT) {
            _deferMinimapDragDotRefresh(_0x9c00c0);
            return;
          }
          _0x378ac2['push']({
            'minimapDot': _0x3e9f8d,
            'pendingDx': _0x9c00c0["pendingDx"],
            'pendingDy': _0x9c00c0['pendingDy'],
            'scale': window['_v2MinimapScale']
          });
        }
      });
      _0x9c00c0["nodeGeometryPreviewIds"] = _0xb6c71f['map'](({
        id: _0x5ed962
      }) => _0x5ed962);
      setNodeGeometryPreview(_0xb6c71f["map"](({
        id: _0x1db08b,
        origNode: _0x1605af
      }) => [_0x1db08b, {
        'x': _0x1605af['x'] + _0x9c00c0["pendingDx"],
        'y': _0x1605af['y'] + _0x9c00c0["pendingDy"]
      }]));
      _0x44b437["forEach"](({
        id: _0x4eeddd,
        el: _0x513732,
        origNode: _0x15be74,
        pendingDx: _0x5268da,
        pendingDy: _0x353e7b,
        hasMoved: _0x41474b
      }) => {
        const _0x54602b = _0x15be74['x'] + _0x5268da;
        const _0x6a6501 = _0x15be74['y'] + _0x353e7b;
        _0x513732["style"]['transform'] = "translate(" + _0x54602b + "px, " + _0x6a6501 + "px)";
        _0x41474b && _markNodeDraggingUiHidden(_0x9c00c0, _0x513732, _0x4eeddd);
      });
      _0x348c3e["forEach"](({
        id: _0x36a32c,
        pendingDx: _0x3c0214,
        pendingDy: _0x1276d3
      }) => {
        _trackNodeDragPreviewProxy(_0x9c00c0, _0x36a32c);
        _syncNodeDragPreview(_0x36a32c, {
          'dx': _0x3c0214,
          'dy': _0x1276d3,
          'active': !![]
        });
      });
      _0x378ac2["forEach"](({
        minimapDot: _0x37ce55,
        pendingDx: _0x522f4e,
        pendingDy: _0x3ed9a4,
        scale: _0x38da37
      }) => {
        _0x37ce55["style"]["transform"] = "translate(" + _0x522f4e * _0x38da37 + "px, " + _0x3ed9a4 * _0x38da37 + "px)";
        _trackMinimapDragDot(_0x9c00c0, _0x37ce55);
      });
      window["v2Renderer"]?.["prepareDynamicEdges"]?.(_0x1d3b5b['map'](_0x1d6515 => _0x1d6515?.['id'])["filter"](Boolean));
      const _0x2a6b1b = window["_edgeDomCache"];
      _0x2a6b1b && _0x2a6b1b['size'] > 0x0 && _updateDraggedEdges(_0x9c00c0, {
        'affectedEdges': _0x1d3b5b,
        'edgeDomCache': _0x2a6b1b,
        'nodes': _0x2d2609["nodes"],
        'targetSet': _0x2df0f8,
        'pendingDx': _0x9c00c0["pendingDx"],
        'pendingDy': _0x9c00c0["pendingDy"],
        'connectionLineStyle': _0x2d2609['ui']?.["connectionLineStyle"],
        'useEdgeGroupTransform': _0x557f7b
      });
      _0x9c00c0["lastWorldX"] = _0x46058b;
      _0x9c00c0['lastWorldY'] = _0x158c3f;
      const _0x4b6087 = _getMultiSelectBoxEl();
      if (_0x483665["length"] >= 0x2 && _0x4b6087 && _0x4b6087["style"]["display"] !== "none") {
        const _0x1e1112 = _0xb6ffc9['length'] > 0x0 ? _0xb6ffc9 : [_0x9c00c0["targetNodeId"]];
        let _0x380581 = Infinity;
        let _0x6c5b81 = Infinity;
        let _0x828d50 = -Infinity;
        let _0x4ab1eb = -Infinity;
        let _0x41d506 = 0x0;
        _0x1e1112["forEach"](_0x1fbcb6 => {
          const _0x3cdae3 = _0x2d2609["nodes"][_0x1fbcb6];
          if (!_0x3cdae3) {
            return;
          }
          _0x41d506++;
          const _0x2ca098 = _0x3cdae3['x'] + (_0x2df0f8["has"](_0x1fbcb6) ? _0x9c00c0["pendingDx"] : 0x0);
          const _0x190601 = _0x3cdae3['y'] + (_0x2df0f8["has"](_0x1fbcb6) ? _0x9c00c0['pendingDy'] : 0x0);
          const _0x287153 = _0x3cdae3["width"] || 0x104;
          const _0x1f5582 = _0x3cdae3["height"] || 0x64;
          const _0x210191 = _0x3cdae3['type'] !== 'group' ? _0x190601 - 0x1e : _0x190601;
          _0x380581 = Math["min"](_0x380581, _0x2ca098);
          _0x6c5b81 = Math['min'](_0x6c5b81, _0x210191);
          _0x828d50 = Math["max"](_0x828d50, _0x2ca098 + _0x287153);
          _0x4ab1eb = Math["max"](_0x4ab1eb, _0x190601 + _0x1f5582);
        });
        if (_0x41d506 >= 0x2) {
          const _0x27857f = 0x12;
          _0x4b6087["style"]['left'] = _0x380581 - _0x27857f + 'px';
          _0x4b6087["style"]['top'] = _0x6c5b81 - _0x27857f + 'px';
          _0x4b6087["style"]["width"] = _0x828d50 - _0x380581 + _0x27857f * 0x2 + 'px';
          _0x4b6087['style']["height"] = _0x4ab1eb - _0x6c5b81 + _0x27857f * 0x2 + 'px';
        }
      }
    }
  }
  function _0x2af955(_0x51120b, _0x140ce8, _0x461e67) {
    const _0x5633b9 = _0x5e0ecf["getStateRaw"]();
    const {
      viewport: _0x2218ff,
      nodes: _0x54dc9c
    } = _0x5633b9;
    const {
      x: _0x214c00,
      y: _0x41b16b
    } = _0xb59064(_0x140ce8, _0x461e67, _0x2218ff);
    const _0x52ba7c = _0x51120b["ghostEl"];
    _0x51120b["sourceCellEl"] && (_0x51120b["sourceCellEl"]['classList']['remove']('is-drag-source'), _0x51120b["sourceCellEl"] = null);
    const _0x1ee5f1 = _0x54dc9c[_0x51120b["targetNodeId"]];
    const _0x20a54a = _0x51120b["sourceCellIndex"];
    const _0xa02ce3 = _0x51120b['draggedCellData'];
    if (!_0x1ee5f1) {
      if (_0x52ba7c) {
        _0x52ba7c["remove"]();
      }
      _0x51120b["ghostEl"] = null;
      return {
        'didAct': ![],
        'committed': ![]
      };
    }
    const _0x57c16d = _0x27d7c3(_0x214c00, _0x41b16b, _0x54dc9c, {
      'nearestInGap': !![]
    }) || _getLastHoveredStoryboardCellInfo(_0x51120b, _0x214c00, _0x41b16b, _0x54dc9c);
    let _0x3c138e = ![];
    if (_0x57c16d) {
      const _0x3a6ec1 = _0x54dc9c[_0x57c16d['nodeId']];
      const _0x1029f0 = _0x57c16d["cellIndex"];
      if (_0x3a6ec1['id'] === _0x1ee5f1['id'] && _0x1029f0 === _0x20a54a) {
        if (_0x52ba7c) {
          _0x52ba7c["remove"]();
        }
        _0x3c138e = ![];
      } else {
        const _0x1bbe3d = _0x1ee5f1["cells"]?.[_0x20a54a] || _0xa02ce3;
        const _0x32a404 = _0x3a6ec1["cells"]?.[_0x1029f0];
        const _0x553ca6 = resolveStoryboardCellDisplaySnapshot(_0x1ee5f1, _0x1bbe3d, _0x20a54a);
        const _0x41bce8 = _0x32a404 && !_isCellEmpty(_0x32a404) ? resolveStoryboardCellDisplaySnapshot(_0x3a6ec1, _0x32a404, _0x1029f0) : null;
        if (!_0x553ca6 || _0x32a404 && !_isCellEmpty(_0x32a404) && !_0x41bce8) {
          if (_0x52ba7c) {
            _0x52ba7c['remove']();
          }
          _0x3c138e = ![];
        } else {
          const _0x15ef19 = _0x3a6ec1['id'] === _0x1ee5f1['id'] ? _applyImmediateCellSwapPreview(_0x1ee5f1['id'], _0x20a54a, _0x1029f0) : {
            'ok': ![],
            'revert'() {}
          };
          if (_0x15ef19['ok'] && _0x52ba7c) {
            _0x52ba7c["remove"]();
          }
          _0x3c138e = a1115_0x22b0b1({
            'store': _0x5e0ecf,
            'sourceNode': _0x1ee5f1,
            'sourceCellIndex': _0x20a54a,
            'targetNode': _0x3a6ec1,
            'targetCellIndex': _0x1029f0,
            'sourceSnapshot': _0x553ca6,
            'targetSnapshot': _0x41bce8
          });
          !_0x3c138e && _0x15ef19['ok'] && _0x15ef19["revert"]();
          if (_0x3c138e) {
            _flushStoryboardNodesNow(_0x1ee5f1['id'], _0x3a6ec1['id']);
            if (!_0x15ef19['ok'] && _0x52ba7c) {
              _0x52ba7c["remove"]();
            }
          } else {
            _0x52ba7c && _0x52ba7c["remove"]();
          }
        }
      }
    } else {
      const _0x338544 = getStoryboardCellMetrics(_0x1ee5f1);
      const _0x5c9cee = _0x1ee5f1?.["cells"]?.[_0x20a54a];
      const _0x1635e4 = _0x5c9cee && !_isCellEmpty(_0x5c9cee) ? _0x5c9cee : _0xa02ce3;
      const _0x212d90 = _0x1635e4 || {};
      const _0x5184e4 = _0xd44278('source-image');
      const _0x142d38 = resolveStoryboardCellDisplaySnapshot(_0x1ee5f1, _0x212d90, _0x20a54a, {
        'fileName': 'storyboard_extract_' + _0x5184e4 + ".jpg"
      });
      if (!_0x142d38?.["src"]) {
        if (_0x52ba7c) {
          _0x52ba7c["remove"]();
        }
        _0x3c138e = ![];
      } else {
        const _0x148b7c = Number(_0x142d38["storyboardSourceIndex"]);
        const _0x2f937a = Number["isInteger"](_0x148b7c) && _0x148b7c >= 0x0 ? _0x148b7c : resolveStoryboardCellSourceIndex(_0x212d90, _0x20a54a, _0x1ee5f1);
        const _0x58edf8 = getStoryboardCellPixelBounds(_0x1ee5f1, _0x2f937a);
        const _0x5de6c1 = a1115_0x387564(_0x1ee5f1);
        _0x5e0ecf["batch"](() => {
          const _0x32f391 = _0x20a54a % _0x1ee5f1["cols"] + 0x1;
          const _0x119bbb = Math["floor"](_0x20a54a / _0x1ee5f1['cols']) + 0x1;
          const _0x290c4c = _0x142d38["width"] || _0x58edf8?.["width"] || _0x338544["cellWidth"];
          const _0x243b47 = _0x142d38["height"] || _0x58edf8?.['height'] || _0x338544['cellHeight'];
          const _0xcf116d = getAutoMediaSizeByShortSide(_0x290c4c, _0x243b47);
          _0x5e0ecf["addNode"](buildSourceMediaNodePayload({
            'id': _0x5184e4,
            'type': "source-image",
            'src': _0x142d38["capturePreviewUrl"] ? '' : _0x142d38["src"],
            'capturePreviewUrl': _0x142d38["capturePreviewUrl"] || '',
            'localPath': _0x142d38["capturePreviewUrl"] ? null : _0x142d38["localPath"],
            'thumbUrl': null,
            'fileName': _0x142d38["fileName"] || _0x212d90["fileName"] || '',
            'originalWidth': _0x142d38["width"] || _0x212d90["originalWidth"],
            'originalHeight': _0x142d38['height'] || _0x212d90["originalHeight"],
            'imageWidth': _0x142d38['width'] || _0x212d90["imageWidth"],
            'imageHeight': _0x142d38["height"] || _0x212d90["imageHeight"],
            'sourceLocalPath': null,
            'sourceUrl': '',
            'sourceWidth': null,
            'sourceHeight': null,
            'storyboardSourceCrop': ![],
            'storyboardExtractedCell': !![],
            'storyboardSourceIndex': _0x2f937a,
            'storyboardSourceNodeId': _0x1ee5f1['id'],
            'storyboardSourceLocalPath': _0x5de6c1["sourceLocalPath"],
            'storyboardSourceUrl': _0x5de6c1["sourceUrl"],
            'naturalWidth': _0x142d38["width"],
            'naturalHeight': _0x142d38["height"],
            'x': _0x214c00 - _0xcf116d["width"] / 0x2,
            'y': _0x41b16b - _0xcf116d["height"] / 0x2,
            'width': _0xcf116d['width'],
            'height': _0xcf116d["height"],
            'name': "提取分镜" + _0x119bbb + '-' + _0x32f391,
            'fixedSize': !![],
            'needsAutoResize': ![]
          }));
          _0x5e0ecf["setSelectedNodes"]([_0x5184e4]);
          const _0x54558c = [..._0x1ee5f1['cells']];
          _0x54558c[_0x20a54a] = a1115_0x2293ff(_0x54558c[_0x20a54a], _0x1ee5f1, _0x20a54a);
          _0x5e0ecf["updateNodeData"](_0x1ee5f1['id'], {
            'cells': _0x54558c
          });
        });
        _0x142d38['crop'] ? _persistStoryboardSourceCropExtract(_0x5e0ecf, _0x5184e4, _0x142d38["crop"], saveOutputBlobImpl) : _persistStoryboardSnapshotPreviewToNode(_0x5e0ecf, _0x5184e4, _0x142d38, _0x142d38["fileName"] || 'storyboard_extract_' + _0x5184e4 + ".jpg", saveOutputBlobImpl);
        if (_0x52ba7c && _0x5184e4) {
          const _0x2015b8 = performance["now"]();
          const _0x65487a = 0x640;
          const _0x528905 = () => {
            const _0x8fd845 = _getNodeWrapperEl(_0x5184e4);
            const _0x4bfb66 = _0x8fd845 ? _0x8fd845["querySelector"]('img') : null;
            if (_0x4bfb66 && _0x4bfb66["complete"] && _0x4bfb66["naturalWidth"] > 0x0) {
              _0x52ba7c['style']['transition'] = "opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1)";
              _0x52ba7c["style"]['opacity'] = '0';
              setTimeout(() => _0x52ba7c["remove"](), 0xb4);
              return;
            }
            if (performance["now"]() - _0x2015b8 >= _0x65487a) {
              _0x52ba7c["remove"]();
              return;
            }
            requestAnimationFrame(_0x528905);
          };
          requestAnimationFrame(_0x528905);
        } else {
          _0x52ba7c && _0x52ba7c['remove']();
        }
        _0x3c138e = !![];
      }
    }
    _0x51120b["ghostEl"] = null;
    _0x51120b['lastHoverNodeId'] && window["v2Renderer"]?.["highlightDropSlot"]?.(_0x51120b["lastHoverNodeId"], {
      'kind': "storyboard",
      'index': -0x1
    });
    return {
      'didAct': _0x3c138e,
      'committed': _0x3c138e
    };
  }
  function _0x48379e(_0x3d68db, _0x2e5ef5, _0x12cac8, _0x361585 = ![]) {
    _0x361585 = _0x361585 || _0x3d68db['editRejected'] === !![];
    if (!_0x361585 && _0x3d68db['editInteraction'] && !_0x3d68db["editInteraction"]["ready"] && _0x3d68db["editPointer"]) {
      const _0x581848 = {
        ..._0x3d68db
      };
      const _0x481974 = _0x5e0ecf["getStateRaw"]();
      const _0x23cae5 = JSON["stringify"](_0x481974['selectedNodeIds']);
      const _0x555820 = JSON["stringify"]((_0x481974["selectedNodeIds"] || [])["map"](_0x455639 => [_0x455639, _0x481974["nodes"][_0x455639]?.['x'], _0x481974["nodes"][_0x455639]?.['y']]));
      if (deferNodeEditCompletion(_0x581848["editInteraction"], _0x3ac9cc => {
        try {
          if (_0x3ac9cc) {
            _0x5a6de5(_0x581848, ..._0x581848["editPointer"], _0x5e0ecf["getStateRaw"]());
          }
        } catch {
          _0x3ac9cc = ![];
        }
        const _0x52eb9f = _0x48379e(_0x581848, _0x2e5ef5, _0x12cac8, !_0x3ac9cc);
        if (_0x52eb9f["didAct"] && !_0x52eb9f["earlyCommit"]) {
          _0x3fabe6();
        }
      }, () => {
        const _0x126c53 = _0x5e0ecf["getStateRaw"]();
        return !!_0x126c53["nodes"][_0x581848['targetNodeId']] && JSON["stringify"](_0x126c53['selectedNodeIds']) === _0x23cae5 && JSON["stringify"]((_0x126c53["selectedNodeIds"] || [])['map'](_0x591410 => [_0x591410, _0x126c53["nodes"][_0x591410]?.['x'], _0x126c53["nodes"][_0x591410]?.['y']])) === _0x555820;
      })) {
        delete _0x3d68db["editInteraction"];
        delete _0x3d68db['editPointer'];
        return {
          'earlyCommit': ![],
          'didAct': ![]
        };
      }
    }
    const _0x469e6d = () => {
      const _0x39cd74 = _0x3d68db['nodeGeometryPreviewIds'] || [];
      const _0x8c9406 = _0x5e0ecf["getStateRaw"]()["nodes"];
      for (const _0x56ae07 of _0x39cd74) {
        const _0x387270 = _0x8c9406[_0x56ae07];
        const _0x43fb35 = _getNodeWrapperEl(_0x56ae07);
        _0x387270 && _0x43fb35 && (_0x43fb35["style"]["transform"] = 'translate(' + _0x387270['x'] + "px, " + _0x387270['y'] + "px)", _0x43fb35["classList"]?.["remove"]("is-ui-hidden", "is-dragging"), delete _0x43fb35["_posKey"]);
      }
      _0x3d68db['pendingDx'] = 0x0;
      _0x3d68db['pendingDy'] = 0x0;
      _clearDragEdgeTransformPreview(_0x3d68db);
      globalThis["window"]?.["v2Renderer"]?.["flushNodes"]?.(_0x39cd74);
    };
    try {
      if (_0x361585 || _0x3d68db["editInteraction"] && !_0x3d68db["editInteraction"]["allowed"]()) {
        _0x469e6d();
        return {
          'earlyCommit': ![],
          'didAct': ![]
        };
      }
      return _0x548fff(_0x3d68db, _0x2e5ef5, _0x12cac8);
    } catch (_0x2c2440) {
      _0x469e6d();
      globalThis["window"]?.["showToast"]?.(_0x2c2440["message"] || "节点暂时无法编辑", "warning");
      return {
        'earlyCommit': ![],
        'didAct': ![]
      };
    } finally {
      _0x3d68db["editInteraction"]?.["finish"]();
      delete _0x3d68db['editInteraction'];
      delete _0x3d68db["editPointer"];
      _0x3d68db['isCommittingDrag'] = ![];
      globalThis["window"]?.['_clearSnapGuideLines']?.();
      const _0x37c151 = _0x3d68db?.['_nodeDragPreviewProxySettle'];
      clearNodeGeometryPreview(_0x3d68db["nodeGeometryPreviewIds"] || []);
      delete _0x3d68db["nodeGeometryPreviewIds"];
      _clearNodeDragPreviewProxies(_0x3d68db, _0x37c151 ? {
        'settle': !![],
        'dx': _0x37c151['dx'],
        'dy': _0x37c151['dy']
      } : undefined);
      delete _0x3d68db["_nodeDragPreviewProxySettle"];
      _finishMinimapDragPreview(_0x3d68db);
    }
  }
  function _0x548fff(_0x4663e8, _0x4da926, _0x4ed388) {
    if (_0x4663e8['dragSource'] === "title" && _0x4663e8["titleDragActivated"] !== !![]) {
      const _0x1b7a27 = _0x4663e8["titleDragPendingSelectNodeId"];
      if (_0x1b7a27) {
        const _0x77bacd = _0x5e0ecf["getStateRaw"]()["selectedNodeIds"] || [];
        !_0x77bacd['includes'](_0x1b7a27) && _0x57ac2f([_0x1b7a27], {
          'source': "click"
        });
      }
      _0x4663e8["titleDragPendingSelectNodeId"] = null;
      _0x4663e8["titleDragActivated"] = ![];
      _0x4663e8["titleDragStartScreenX"] = 0x0;
      _0x4663e8["titleDragStartScreenY"] = 0x0;
      return {
        'earlyCommit': ![],
        'didAct': ![]
      };
    }
    const _0x8a4c21 = _0x5e0ecf["getStateRaw"]();
    const {
      viewport: _0x41bc32,
      nodes: _0x2541b5
    } = _0x8a4c21;
    const {
      x: _0x3f727d,
      y: _0x52656c
    } = _0xb59064(_0x4da926, _0x4ed388, _0x41bc32);
    const {
      selectedNodeIds: _0x4f2b15
    } = _0x8a4c21;
    const _0x2e37b0 = _0x4f2b15['includes'](_0x4663e8['targetNodeId']) ? Array['from'](_0x4f2b15) : [_0x4663e8["targetNodeId"]];
    if (_0x2e37b0["length"] === 0x1) {
      const _0x201dc9 = _0x2541b5[_0x2e37b0[0x0]];
      const _0x4bb7d3 = _getImagePayloadFromNode(_0x2701ea, _0x201dc9);
      if (_0x4bb7d3) {
        const _0x4c7c11 = _0x27d7c3(_0x3f727d, _0x52656c, _0x2541b5);
        if (_0x4c7c11) {
          const _0x9fc657 = _0x2541b5[_0x4c7c11["nodeId"]];
          const _0x1662bd = (_0x9fc657?.["cells"] || [])[_0x4c7c11["cellIndex"]];
          const _0x34171b = !!_0x4bb7d3 && !!_0x9fc657 && _0x9fc657['isEditing'] === !![];
          if (_0x34171b) {
            const _0x3df099 = _getNodeWrapperEl(_0x201dc9['id']);
            const _0x3a88b6 = _0x3df099 ? _0x3df099["querySelector"]("img") : null;
            const _0x5e9ca2 = a1115_0x20bb84(_0x4bb7d3, {
              'visibleSrc': a1115_0x693399(_0x3a88b6)
            });
            if (!_0x5e9ca2?.["src"]) {
              return {
                'earlyCommit': ![],
                'didAct': ![]
              };
            }
            const _0x180e48 = [...(_0x9fc657['cells'] || [])];
            const _0xff5703 = _0x4bb7d3["storyboardExtractedCell"] === !![];
            const _0x44e628 = _0xff5703 && _isCellEmpty(_0x1662bd);
            const _0x280c94 = _0x44e628 ? {
              ...(_0x1662bd?.["residualImageLocalPath"] ? {
                'residualImageLocalPath': _0x1662bd["residualImageLocalPath"]
              } : {}),
              ...(_0x1662bd?.["residualImageUrl"] ? {
                'residualImageUrl': _0x1662bd['residualImageUrl']
              } : {}),
              ...(_0x1662bd?.["residualImageWidth"] ? {
                'residualImageWidth': _0x1662bd["residualImageWidth"]
              } : {}),
              ...(_0x1662bd?.["residualImageHeight"] ? {
                'residualImageHeight': _0x1662bd["residualImageHeight"]
              } : {}),
              ...(_0x1662bd?.["residualImageMode"] ? {
                'residualImageMode': _0x1662bd["residualImageMode"]
              } : {})
            } : {};
            const _0x5c4f67 = getStoryboardCellMetrics(_0x9fc657);
            const _0x30a55a = getStoryboardCellPixelBounds(_0x9fc657, _0x4c7c11["cellIndex"]);
            const _0x172d5a = Math["max"](0x1, Math['round']((_0x30a55a?.["width"] || _0x5c4f67["cellWidth"]) * _0x41bc32['zoom']));
            const _0x1a2392 = Math['max'](0x1, Math['round']((_0x30a55a?.["height"] || _0x5c4f67["cellHeight"]) * _0x41bc32["zoom"]));
            const _0x2170bb = _getStoryboardCellCenterWorldPoint(_0x9fc657, _0x4c7c11["cellIndex"]);
            const _0x42b6f7 = worldToScreen(_0x2170bb['x'], _0x2170bb['y'], _0x41bc32);
            const _0x211bca = _createGhostFromImage(_0x3a88b6, _0x172d5a, _0x1a2392, _0x5e9ca2["src"] || _0x4bb7d3['thumbUrl'] || _0x4bb7d3['url'] || '');
            _0x211bca["style"]['transform'] = 'translate(' + _0x4da926 + "px, " + _0x4ed388 + "px) translate(-50%, -50%)";
            document["body"]['appendChild'](_0x211bca);
            requestAnimationFrame(() => {
              _0x211bca["style"]["transition"] = "transform 0.18s cubic-bezier(0.4, 0, 0.2, 1)";
              _0x211bca["style"]["transform"] = "translate(" + _0x42b6f7['x'] + 'px,\x20' + _0x42b6f7['y'] + 'px)\x20translate(-50%,\x20-50%)';
            });
            const _0x3cb729 = buildFrozenStoryboardCellFromSnapshot(_0x5e9ca2, _0x9fc657, _0x4c7c11['cellIndex'], {
              'id': _0xd44278("cell")
            });
            _0x180e48[_0x4c7c11['cellIndex']] = {
              ..._0x3cb729,
              ..._0x280c94
            };
            _0x5e0ecf["updateNodeData"](_0x9fc657['id'], {
              'cells': _0x180e48
            });
            _flushStoryboardNodesNow(_0x9fc657['id']);
            _persistStoryboardSnapshotPreviewToCell(_0x5e0ecf, _0x9fc657['id'], _0x4c7c11["cellIndex"], _0x3cb729?.['id'], _0x5e9ca2, _0x5e9ca2['fileName'] || "storyboard_cell_" + _0x9fc657['id'] + '_' + _0x4c7c11['cellIndex'] + ".jpg", saveOutputBlobImpl);
            const _0x4ab290 = () => {
              _0x5e0ecf["setSelectedNodes"]([]);
              _0x5e0ecf['deleteNodes']([_0x201dc9['id']]);
            };
            typeof _0x5e0ecf['batch'] === "function" ? _0x5e0ecf['batch'](_0x4ab290) : _0x4ab290();
            requestAnimationFrame(() => {
              setTimeout(() => _0x3fabe6(), 0x0);
            });
            _fadeOutGhost(_0x211bca, 0x0);
            return {
              'earlyCommit': !![],
              'didAct': !![]
            };
          }
        }
        const _0xcda097 = _0x360803(_0x3f727d, _0x52656c, _0x2541b5);
        if (_0xcda097) {
          const _0x8861b7 = _0x2541b5[_0xcda097["nodeId"]];
          const _0x3b74f5 = (_0x8861b7?.['items'] || [])[_0xcda097["itemIndex"]];
          if (_0x8861b7 && _0x8861b7["isEditing"] === !![]) {
            const _0x470c26 = _getNodeWrapperEl(_0x201dc9['id']);
            const _0xa8a34a = _0x470c26 ? _0x470c26["querySelector"]("img") : null;
            const _0x367c58 = a1115_0x3d2dab(_0x4bb7d3, {
              'visibleSrc': a1115_0x693399(_0xa8a34a)
            });
            if (!_0x367c58?.['src']) {
              return {
                'earlyCommit': ![],
                'didAct': ![]
              };
            }
            const _0x3424f0 = _0x367c58["localPath"] || '';
            const _0x43a018 = _0x367c58['src'];
            if (_0x43a018) {
              let _0x5f02a8 = null;
              const _0x2ed7db = _getCollageItemFrameInfo(_0x8861b7, _0xcda097["itemIndex"]);
              if (typeof document !== "undefined" && document["body"] && _0x2ed7db?.["frame"]) {
                const _0x335308 = Math["max"](0x1, Math["round"](_0x2ed7db["frame"]['width'] * _0x41bc32["zoom"]));
                const _0x3ccc29 = Math["max"](0x1, Math['round'](_0x2ed7db["frame"]['height'] * _0x41bc32['zoom']));
                const _0x1b7da3 = _getCollageItemCenterWorldPoint(_0x8861b7, _0xcda097["itemIndex"]);
                const _0x42a98d = worldToScreen(_0x1b7da3['x'], _0x1b7da3['y'], _0x41bc32);
                _0x5f02a8 = _createGhostFromImage(_0xa8a34a, _0x335308, _0x3ccc29, _0x43a018);
                _0x5f02a8['style']["transform"] = "translate(" + _0x4da926 + "px, " + _0x4ed388 + "px) translate(-50%, -50%)";
                document['body']["appendChild"](_0x5f02a8);
                requestAnimationFrame(() => {
                  _0x5f02a8['style']['transition'] = "transform 0.18s cubic-bezier(0.4, 0, 0.2, 1)";
                  _0x5f02a8["style"]["transform"] = "translate(" + _0x42a98d['x'] + "px, " + _0x42a98d['y'] + 'px)\x20translate(-50%,\x20-50%)';
                });
              }
              const _0x10ccbd = [...(_0x8861b7["items"] || [])];
              _0x10ccbd[_0xcda097['itemIndex']] = {
                ...(_0x3b74f5 || {}),
                'id': _0xd44278('collage-item'),
                'sourceNodeId': _0x201dc9['id'],
                'url': _0x43a018,
                'localPath': normalizeLocalPath(_0x3424f0),
                'thumbLocalPath': normalizeLocalPath(_0x367c58['thumbLocalPath']),
                'sourceLocalPath': '',
                'sourceUrl': '',
                'sourceWidth': null,
                'sourceHeight': null,
                'imageWidth': _0x367c58["width"] || null,
                'imageHeight': _0x367c58['height'] || null,
                'sourceDisplayWidth': _toPositiveNumber(_0x201dc9["width"]),
                'sourceDisplayHeight': _toPositiveNumber(_0x201dc9['height']),
                'label': _0x201dc9["name"] || _0x201dc9["fileName"] || "拼图图片",
                'fit': "cover",
                'focusX': 0.5,
                'focusY': 0.5,
                'isEmpty': ![]
              };
              window["v2Renderer"]?.["previewCollageItems"]?.(_0x8861b7['id'], _0x10ccbd);
              const _0x516fd7 = () => {
                _0x5e0ecf["updateNodeData"](_0x8861b7['id'], {
                  'items': _0x10ccbd
                });
                _0x5e0ecf["setSelectedNodes"]([_0x8861b7['id']]);
                _0x5e0ecf["deleteNodes"]([_0x201dc9['id']]);
              };
              if (typeof _0x5e0ecf['batch'] === "function") {
                _0x5e0ecf['batch'](_0x516fd7);
              } else {
                _0x516fd7();
              }
              requestAnimationFrame(() => {
                _0x3fabe6();
              });
              _0x5f02a8 && _waitForCollageItemImage(_0x8861b7['id'], _0xcda097["itemIndex"], _0x43a018, () => _fadeOutGhost(_0x5f02a8));
              window['v2Renderer']?.["clearDropSlotHighlight"]?.(_0x8861b7['id']);
              return {
                'earlyCommit': !![],
                'didAct': !![]
              };
            }
          }
        }
      }
    }
    let _0x52a904 = ![];
    if (_0x4663e8['pendingDx'] || _0x4663e8["pendingDy"]) {
      _0x4663e8["isCommittingDrag"] = !![];
      markRendererNodeDragCommitHint();
      const _0x516adb = new Map();
      _0x2e37b0["forEach"](_0x4c2b29 => {
        const _0x2b37d8 = _0x2541b5[_0x4c2b29];
        const _0x5527ff = Number(_0x2b37d8?.['x']);
        const _0x4d2c8d = Number(_0x2b37d8?.['y']);
        if (!Number["isFinite"](_0x5527ff) || !Number['isFinite'](_0x4d2c8d)) {
          return;
        }
        _0x516adb["set"](_0x4c2b29, "translate(" + (_0x5527ff + _0x4663e8['pendingDx']) + "px, " + (_0x4d2c8d + _0x4663e8["pendingDy"]) + "px)");
      });
      _0x4f2b15['includes'](_0x4663e8["targetNodeId"]) ? _0x5e0ecf['moveNodes'](_0x4f2b15, _0x4663e8["pendingDx"], _0x4663e8['pendingDy']) : _0x5e0ecf['updateNodePosition'](_0x4663e8["targetNodeId"], _0x4663e8["pendingDx"], _0x4663e8['pendingDy']);
      _flushMovedGroupPositionsNow(_0x2541b5, _0x2e37b0, _0x2701ea);
      _0x2e37b0['forEach'](_0x378e71 => {
        const _0x5ceca2 = _getNodeWrapperEl(_0x378e71) || _getMountedNodeWrapperEl(_0x378e71);
        if (_0x5ceca2) {
          _0x5ceca2["classList"]['remove']('is-ui-hidden');
          _0x5ceca2["classList"]["remove"]("is-dragging");
          const _0x8c27b5 = _0x516adb["get"](_0x378e71);
          if (_0x8c27b5) {
            const _0x192007 = () => {
              if (_0x5ceca2["isConnected"] !== ![]) {
                _0x5ceca2['style']["transform"] = _0x8c27b5;
              }
            };
            _0x192007();
            if (typeof queueMicrotask === "function") {
              queueMicrotask(_0x192007);
            } else {
              Promise["resolve"]()["then"](_0x192007);
            }
          }
          delete _0x5ceca2['_posKey'];
        }
      });
      _settleNodeDragPreviewProxiesOnCommit(_0x4663e8, _0x4663e8["pendingDx"], _0x4663e8['pendingDy']);
      _0x4663e8["pendingDx"] = 0x0;
      _0x4663e8["pendingDy"] = 0x0;
      _clearDragEdgeTransformPreview(_0x4663e8);
      _0x52a904 = !![];
    }
    const _0x2330b1 = _0x5e0ecf["getStateRaw"]();
    const _0x17b0f4 = collectGroupContainmentReparentOps(_0x2330b1["nodes"], _0x2e37b0);
    _0x17b0f4["length"] > 0x0 && (_0x5e0ecf["batch"](() => {
      _0x17b0f4["forEach"](({
        nodeId: _0x35c17a,
        parentId: _0xf972c5
      }) => {
        _0x5e0ecf["groupNodes"]([_0x35c17a], _0xf972c5);
      });
    }), _0x52a904 = !![]);
    return {
      'earlyCommit': ![],
      'didAct': _0x52a904
    };
  }
  return {
    'tryStartTitleDrag': _0x1d0346,
    'tryStartNodeDrag': _0x3de61a,
    'updateDraggingCell': _0x42be9e,
    'updateDraggingNodes': _0x5a6de5,
    'finishDraggingCell': _0x2af955,
    'finishDraggingNodes': _0x48379e
  };
}