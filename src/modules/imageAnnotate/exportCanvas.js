import { getTextScalePair } from './textControls.js';
import { drawRoundBrushStroke, getEraserClearLineWidth, getBrushLineWidth, mapBrushPoints } from '../imageEditorBrushStyle.js';
import { drawNumberLabelCommand } from './numberLabels.js';
import { getImageRotationLayout, normalizeRotationDegrees } from '../../core/math.js';
const canvasToBlob = (_0x56567f, _0xd81757, _0x3657e3) => new Promise(_0x342ce9 => _0x56567f["toBlob"](_0x342ce9, _0xd81757, _0x3657e3));
const FAST_DISPLAY_EXPORT_MAX_EDGE = 0x500;
const toPositiveCanvasSize = _0x571d39 => {
  const _0x442c8d = Number(_0x571d39);
  return Number["isFinite"](_0x442c8d) && _0x442c8d > 0x0 ? Math["max"](0x1, Math["round"](_0x442c8d)) : 0x0;
};
const getImageElementSize = _0xdbaec1 => ({
  'width': toPositiveCanvasSize(_0xdbaec1?.["naturalWidth"] || _0xdbaec1?.["width"]),
  'height': toPositiveCanvasSize(_0xdbaec1?.["naturalHeight"] || _0xdbaec1?.["height"])
});
const canDrawExistingImageElement = _0x1f2002 => {
  const _0x2e04f8 = getImageElementSize(_0x1f2002);
  return _0x1f2002 && _0x1f2002["complete"] !== ![] && _0x2e04f8["width"] > 0x0 && _0x2e04f8["height"] > 0x0;
};
const clampExportSizeToMaxEdge = (_0x380536, _0x385b9b = FAST_DISPLAY_EXPORT_MAX_EDGE) => {
  const _0x9f3c34 = toPositiveCanvasSize(_0x380536?.["width"]);
  const _0xf49ec8 = toPositiveCanvasSize(_0x380536?.["height"]);
  const _0x3499f = toPositiveCanvasSize(_0x385b9b);
  if (!_0x9f3c34 || !_0xf49ec8 || !_0x3499f) {
    return {
      'width': _0x9f3c34,
      'height': _0xf49ec8
    };
  }
  const _0x26df39 = Math["max"](_0x9f3c34, _0xf49ec8);
  if (_0x26df39 <= _0x3499f) {
    return {
      'width': _0x9f3c34,
      'height': _0xf49ec8
    };
  }
  const _0x27587d = _0x3499f / _0x26df39;
  return {
    'width': Math['max'](0x1, Math['round'](_0x9f3c34 * _0x27587d)),
    'height': Math['max'](0x1, Math['round'](_0xf49ec8 * _0x27587d))
  };
};
const getFastDisplayExportSize = ({
  node: _0x20159b,
  imgEl: _0x6b1333
} = {}) => {
  const _0x3ea2d3 = getImageElementSize(_0x6b1333);
  if (_0x3ea2d3["width"] && _0x3ea2d3["height"]) {
    return clampExportSizeToMaxEdge(_0x3ea2d3);
  }
  const _0x13657e = toPositiveCanvasSize(_0x20159b?.["width"]);
  const _0x15148e = toPositiveCanvasSize(_0x20159b?.['height']);
  if (_0x13657e && _0x15148e) {
    return {
      'width': _0x13657e,
      'height': _0x15148e
    };
  }
  return getImageElementSize(_0x6b1333);
};
const renderCommandToNaturalCanvas = ({
  ctx: _0x3e5609,
  cmd: _0x25730e,
  scaleX: _0x517979,
  scaleY: _0x4e7ec3,
  isEraseScene: _0x2d5a57,
  defaultTextColor: _0x300112,
  numberLabelBackgroundColor = ''
} = {}) => {
  if (_0x2d5a57) {
    return;
  }
  if (_0x25730e['type'] === "brush") {
    _0x3e5609["save"]();
    drawRoundBrushStroke(_0x3e5609, {
      'points': mapBrushPoints(_0x25730e["points"], _0x517979, _0x4e7ec3),
      'lineWidth': getBrushLineWidth(_0x25730e['sizeWorld'], _0x517979, 'brush'),
      'strokeStyle': _0x25730e["color"],
      'fillStyle': _0x25730e["color"],
      'globalCompositeOperation': "source-over"
    });
    _0x3e5609["restore"]();
    return;
  }
  if (_0x25730e["type"] === 'eraser') {
    _0x3e5609["save"]();
    drawRoundBrushStroke(_0x3e5609, {
      'points': mapBrushPoints(_0x25730e["points"], _0x517979, _0x4e7ec3),
      'lineWidth': getEraserClearLineWidth(getBrushLineWidth(_0x25730e["sizeWorld"], _0x517979, "eraser")),
      'strokeStyle': "#000",
      'fillStyle': '#000',
      'globalCompositeOperation': "destination-out"
    });
    _0x3e5609['restore']();
    return;
  }
  if (_0x25730e["type"] === "rect") {
    const _0x5a4e05 = _0x25730e['x1'] * _0x517979;
    const _0x2c1628 = _0x25730e['y1'] * _0x4e7ec3;
    const _0x44207b = _0x25730e['x2'] * _0x517979;
    const _0x2a6a44 = _0x25730e['y2'] * _0x4e7ec3;
    const _0x217fab = Math["min"](_0x5a4e05, _0x44207b);
    const _0x36490f = Math["min"](_0x2c1628, _0x2a6a44);
    const _0x7c8d16 = Math["abs"](_0x44207b - _0x5a4e05);
    const _0x2eae4e = Math['abs'](_0x2a6a44 - _0x2c1628);
    _0x3e5609["save"]();
    _0x3e5609["globalCompositeOperation"] = "source-over";
    _0x3e5609["strokeStyle"] = _0x25730e['color'];
    _0x3e5609["lineWidth"] = getBrushLineWidth(_0x25730e["sizeWorld"], _0x517979, "brush");
    _0x3e5609["strokeRect"](_0x217fab, _0x36490f, _0x7c8d16, _0x2eae4e);
    _0x3e5609["restore"]();
    return;
  }
  if (_0x25730e["type"] === "text") {
    const _0x2997eb = _0x25730e['x'] * _0x517979;
    const _0x5cd5ed = _0x25730e['y'] * _0x4e7ec3;
    const _0x7f00a5 = Math["max"](0x1, _0x25730e["sizeWorld"] * _0x517979);
    const _0x102d6e = getTextScalePair(_0x25730e);
    const _0x40e85d = Number(_0x25730e["rotation"]) || 0x0;
    _0x3e5609['save']();
    _0x3e5609["globalCompositeOperation"] = "source-over";
    _0x3e5609["fillStyle"] = _0x25730e['color'] || _0x300112;
    _0x3e5609["font"] = _0x7f00a5 + 'px\x20sans-serif';
    _0x3e5609['textBaseline'] = "top";
    _0x3e5609["translate"](_0x2997eb, _0x5cd5ed);
    _0x3e5609["rotate"](_0x40e85d);
    _0x3e5609["scale"](_0x102d6e["scaleX"], _0x102d6e["scaleY"]);
    _0x3e5609["fillText"](String(_0x25730e["text"] || ''), 0x0, 0x0);
    _0x3e5609['restore']();
    return;
  }
  _0x25730e["type"] === "number-label" && drawNumberLabelCommand({
    'ctx': _0x3e5609,
    'cmd': _0x25730e,
    'scaleX': _0x517979,
    'scaleY': _0x4e7ec3,
    'defaultColor': _0x300112,
    'backgroundColor': numberLabelBackgroundColor
  });
};
export const exportAnnotateCanvasBlob = async ({
  documentRef = null,
  node: _0x366733,
  imgEl: _0x3b078d,
  imgUrl: _0x84024c,
  commands: _0xe921d9,
  useWhiteboardBase: _0x2f1652,
  isEraseScene: _0x137321,
  loadImage: _0x1795dc,
  getCurrentFlipState: _0x512d33,
  applyFlipTransformToContext: _0x36fa3c,
  createSelectionMaskCanvas: _0x18a0c1,
  canvasWhiteColor: _0x37419e,
  defaultTextColor: _0x24db5e,
  fastDisplayExport = ![],
  rotationDegrees = 0x0,
  keepRatio = ![]
} = {}) => {
  const _0xed782d = documentRef || globalThis["document"];
  let _0x6acd3b = null;
  let _0x4907d6 = 0x0;
  let _0x192901 = 0x0;
  const _0x503791 = Boolean(fastDisplayExport) && !_0x137321;
  if (_0x503791) {
    const _0x5e71f9 = getFastDisplayExportSize({
      'node': _0x366733,
      'imgEl': _0x3b078d
    });
    _0x4907d6 = _0x5e71f9["width"];
    _0x192901 = _0x5e71f9["height"];
    !_0x2f1652 && canDrawExistingImageElement(_0x3b078d) && (_0x6acd3b = _0x3b078d);
  }
  if ((!_0x4907d6 || !_0x192901) && _0x2f1652) {
    try {
      _0x6acd3b = await _0x1795dc(_0x84024c);
      _0x4907d6 = _0x6acd3b["naturalWidth"] || _0x6acd3b['width'];
      _0x192901 = _0x6acd3b["naturalHeight"] || _0x6acd3b["height"];
    } catch {
      _0x4907d6 = Number(_0x3b078d?.['naturalWidth'] || _0x3b078d?.["width"] || 0x0);
      _0x192901 = Number(_0x3b078d?.["naturalHeight"] || _0x3b078d?.["height"] || 0x0);
    }
  }
  if (!_0x4907d6 || !_0x192901 || !_0x2f1652 && !_0x6acd3b) {
    const _0x4e1581 = await _0x1795dc(_0x84024c);
    _0x6acd3b = _0x4e1581;
    (!_0x4907d6 || !_0x192901) && (_0x4907d6 = _0x4e1581["naturalWidth"] || _0x4e1581["width"], _0x192901 = _0x4e1581["naturalHeight"] || _0x4e1581["height"]);
  }
  const _0x2ea193 = _0xed782d["createElement"]("canvas");
  const _0x2b361c = _0x137321 ? 0x0 : normalizeRotationDegrees(rotationDegrees);
  const _0x23d424 = getImageRotationLayout(_0x4907d6, _0x192901, _0x2b361c, keepRatio && !_0x137321);
  _0x2ea193["width"] = _0x23d424["width"];
  _0x2ea193["height"] = _0x23d424["height"];
  const _0x5cb4c2 = _0x2ea193['getContext']('2d');
  const _0x39ebf3 = _0x512d33();
  !_0x137321 && (_0x5cb4c2["save"](), _0x2b361c && (_0x5cb4c2["translate"](_0x2ea193["width"] / 0x2, _0x2ea193['height'] / 0x2), _0x5cb4c2['rotate'](_0x2b361c * Math['PI'] / 0xb4), _0x5cb4c2['scale'](_0x23d424["scale"], _0x23d424["scale"]), _0x5cb4c2['translate'](-_0x4907d6 / 0x2, -_0x192901 / 0x2)), (!_0x2b361c || _0x2f1652) && (_0x5cb4c2["fillStyle"] = _0x37419e, _0x5cb4c2["fillRect"](0x0, 0x0, _0x4907d6, _0x192901)), _0x36fa3c(_0x5cb4c2, _0x4907d6, _0x192901, _0x39ebf3));
  !_0x2f1652 && _0x5cb4c2["drawImage"](_0x6acd3b, 0x0, 0x0, _0x4907d6, _0x192901);
  const _0x46f82d = _0x4907d6 / (_0x366733?.['width'] || 0x1);
  const _0x29e7d3 = _0x192901 / (_0x366733?.["height"] || 0x1);
  if (_0x137321) {
    const _0x3c2d13 = _0x18a0c1(_0x4907d6, _0x192901, _0x46f82d, _0x29e7d3);
    _0x5cb4c2["save"]();
    _0x5cb4c2["globalCompositeOperation"] = 'destination-out';
    _0x5cb4c2["drawImage"](_0x3c2d13, 0x0, 0x0);
    _0x5cb4c2["restore"]();
  }
  (Array["isArray"](_0xe921d9) ? _0xe921d9 : [])["forEach"](_0x6b1a3 => renderCommandToNaturalCanvas({
    'ctx': _0x5cb4c2,
    'cmd': _0x6b1a3,
    'scaleX': _0x46f82d,
    'scaleY': _0x29e7d3,
    'isEraseScene': _0x137321,
    'defaultTextColor': _0x24db5e,
    'numberLabelBackgroundColor': _0x37419e
  }));
  !_0x137321 && _0x5cb4c2['restore']();
  const _0x5aa7ef = _0x137321 || _0x2b361c ? "image/png" : 'image/jpeg';
  const _0x3c47cf = _0x5aa7ef === "image/png" ? undefined : 0.9;
  const _0x3beb93 = await canvasToBlob(_0x2ea193, _0x5aa7ef, _0x3c47cf);
  if (!_0x3beb93) {
    throw new Error("Canvas 导出失败");
  }
  return {
    'blob': _0x3beb93,
    'exportType': _0x5aa7ef,
    'naturalWidth': _0x2ea193["width"],
    'naturalHeight': _0x2ea193["height"]
  };
};