export const IMAGE_BRUSH_MIN_SIZE_PX = 0x1;
export const IMAGE_BRUSH_MAX_SIZE_PX = 0x78;
export const IMAGE_BRUSH_ERASER_MIN_WIDTH = 0x6;
export const IMAGE_BRUSH_ERASER_EDGE_CLEANUP_PX = 0x2;
export const IMAGE_BRUSH_DEFAULT_SIZE_PX = 0x28;
export function clampImageBrushSize(_0x3743cb, _0x4a3265 = IMAGE_BRUSH_DEFAULT_SIZE_PX) {
  const _0x189756 = Number(_0x3743cb);
  const _0x1383b3 = Number(_0x4a3265);
  const _0x28b61a = Number["isFinite"](_0x189756) ? _0x189756 : Number["isFinite"](_0x1383b3) ? _0x1383b3 : IMAGE_BRUSH_DEFAULT_SIZE_PX;
  return Math['max'](IMAGE_BRUSH_MIN_SIZE_PX, Math['min'](IMAGE_BRUSH_MAX_SIZE_PX, _0x28b61a));
}
export function getBrushLineWidth(_0x1cb252, _0x3ed0c6 = 0x1, _0x1ec8b6 = "brush") {
  const _0x138d88 = Number(_0x1cb252);
  const _0x6c5272 = Number(_0x3ed0c6);
  const _0x2ada78 = (Number["isFinite"](_0x138d88) ? _0x138d88 : 0x0) * (Number["isFinite"](_0x6c5272) ? _0x6c5272 : 0x1);
  return Math["max"](_0x1ec8b6 === "eraser" ? IMAGE_BRUSH_ERASER_MIN_WIDTH : 0x1, _0x2ada78);
}
export function getEraserClearLineWidth(_0x57a39e) {
  const _0x279958 = Math["max"](0x1, Number(_0x57a39e) || 0x1);
  return _0x279958 + IMAGE_BRUSH_ERASER_EDGE_CLEANUP_PX;
}
export function mapBrushPoints(_0x78cdfa, _0x4b6bb0 = 0x1, _0x4c3efe = _0x4b6bb0) {
  const _0x5df126 = Number["isFinite"](Number(_0x4b6bb0)) ? Number(_0x4b6bb0) : 0x1;
  const _0x5a3d54 = Number["isFinite"](Number(_0x4c3efe)) ? Number(_0x4c3efe) : _0x5df126;
  return (Array['isArray'](_0x78cdfa) ? _0x78cdfa : [])["map"](_0x4ec1b1 => ({
    'x': Number(_0x4ec1b1?.['x']) * _0x5df126,
    'y': Number(_0x4ec1b1?.['y']) * _0x5a3d54
  }))["filter"](_0x3fb453 => Number['isFinite'](_0x3fb453['x']) && Number["isFinite"](_0x3fb453['y']));
}
export function drawRoundBrushStroke(_0x2f226d, {
  points = [],
  lineWidth = 0x1,
  strokeStyle: _0x3e968b,
  fillStyle = _0x3e968b,
  globalCompositeOperation: _0xe0f00c,
  globalAlpha: _0x164293
} = {}) {
  if (!_0x2f226d || !Array["isArray"](points) || !points["length"]) {
    return ![];
  }
  const _0x1cdbf3 = Math["max"](0x1, Number(lineWidth) || 0x1);
  const _0x44f879 = mapBrushPoints(points, 0x1, 0x1);
  if (!_0x44f879["length"]) {
    return ![];
  }
  _0x2f226d['lineCap'] = "round";
  _0x2f226d["lineJoin"] = 'round';
  _0x2f226d["lineWidth"] = _0x1cdbf3;
  typeof _0xe0f00c === "string" && (_0x2f226d["globalCompositeOperation"] = _0xe0f00c);
  Number["isFinite"](Number(_0x164293)) && (_0x2f226d["globalAlpha"] = Math["max"](0x0, Math["min"](0x1, Number(_0x164293))));
  if (_0x3e968b !== undefined) {
    _0x2f226d["strokeStyle"] = _0x3e968b;
  }
  if (fillStyle !== undefined) {
    _0x2f226d['fillStyle'] = fillStyle;
  }
  if (_0x44f879["length"] === 0x1) {
    const _0x2c3fe0 = _0x44f879[0x0];
    _0x2f226d['beginPath']();
    typeof _0x2f226d["arc"] === 'function' && typeof _0x2f226d["fill"] === "function" ? (_0x2f226d["arc"](_0x2c3fe0['x'], _0x2c3fe0['y'], Math["max"](0.5, _0x1cdbf3 / 0x2), 0x0, Math['PI'] * 0x2), _0x2f226d["fill"]()) : (_0x2f226d["moveTo"](_0x2c3fe0['x'], _0x2c3fe0['y']), _0x2f226d['lineTo'](_0x2c3fe0['x'] + 0.001, _0x2c3fe0['y']), _0x2f226d["stroke"]());
    return !![];
  }
  _0x2f226d["beginPath"]();
  _0x44f879["forEach"]((_0x4d3d84, _0xa5da89) => {
    if (_0xa5da89 === 0x0) {
      _0x2f226d["moveTo"](_0x4d3d84['x'], _0x4d3d84['y']);
    } else {
      _0x2f226d["lineTo"](_0x4d3d84['x'], _0x4d3d84['y']);
    }
  });
  _0x2f226d['stroke']();
  return !![];
}
export function syncCircularBrushCursor({
  cursorEl: _0x4b7a80,
  canvasEl: _0x3b1959,
  visible = !![],
  tool = "brush",
  allowedTools = ["brush", "eraser", "bucket"],
  sizePx = IMAGE_BRUSH_DEFAULT_SIZE_PX,
  cursorLast = {
    'x': 0x0,
    'y': 0x0
  },
  isEraseBrush = ![],
  hiddenCursor = "var(--precision-cursor)",
  activeCursor = "none",
  eraseClassName = "is-erase-brush"
} = {}) {
  if (!_0x4b7a80) {
    return ![];
  }
  const _0x1d832b = new Set(allowedTools);
  if (!visible || !_0x1d832b["has"](tool)) {
    _0x4b7a80['style']["display"] = 'none';
    _0x4b7a80["classList"]?.['remove']?.(eraseClassName);
    if (_0x3b1959) {
      _0x3b1959["style"]["cursor"] = hiddenCursor;
    }
    return ![];
  }
  const _0x54c99f = clampImageBrushSize(sizePx);
  _0x4b7a80["style"]['display'] = 'block';
  _0x4b7a80["style"]["width"] = _0x54c99f + 'px';
  _0x4b7a80["style"]["height"] = _0x54c99f + 'px';
  _0x4b7a80['style']["left"] = (Number(cursorLast?.['x']) || 0x0) + 'px';
  _0x4b7a80["style"]["top"] = (Number(cursorLast?.['y']) || 0x0) + 'px';
  _0x4b7a80["classList"]?.['toggle']?.(eraseClassName, Boolean(isEraseBrush));
  if (_0x3b1959) {
    _0x3b1959["style"]["cursor"] = activeCursor;
  }
  return !![];
}