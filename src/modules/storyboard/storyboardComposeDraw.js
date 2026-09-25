function parseComposeLengthRatio(_0x1b0f7c, _0x3dc62c, _0x47b0d8) {
  const _0x228bc6 = String(_0x1b0f7c || '')['trim']();
  if (!_0x228bc6) {
    return _0x47b0d8;
  }
  const _0x1f7917 = Number["parseFloat"](_0x228bc6);
  if (!Number["isFinite"](_0x1f7917)) {
    return _0x47b0d8;
  }
  if (_0x228bc6["endsWith"]('%')) {
    return _0x1f7917 / 0x64;
  }
  if (_0x228bc6['endsWith']('px')) {
    const _0x38fa50 = Math["max"](0x1, Number(_0x3dc62c) || 0x1);
    return _0x1f7917 / _0x38fa50;
  }
  return _0x1f7917;
}
export function buildStoryboardComposeRenderedCrop(_0x47969b, _0x50dd26, _0x3cfdc4) {
  if (!_0x47969b || !_0x50dd26 || !_0x3cfdc4) {
    return null;
  }
  if (!_0x47969b['classList']?.['contains']?.("storyboard-cell-img--source-crop")) {
    return null;
  }
  const _0x5a0bab = Math["max"](0x1, Math['trunc'](Number(_0x50dd26['naturalWidth'] || _0x50dd26["width"]) || 0x0));
  const _0x2215ce = Math["max"](0x1, Math["trunc"](Number(_0x50dd26["naturalHeight"] || _0x50dd26["height"]) || 0x0));
  const _0x32705b = parseComposeLengthRatio(_0x47969b['style']?.["width"], _0x3cfdc4["drawW"], 0x1);
  const _0x2307e8 = parseComposeLengthRatio(_0x47969b["style"]?.["height"], _0x3cfdc4["drawH"], 0x1);
  if (_0x32705b <= 0x0 || _0x2307e8 <= 0x0) {
    return null;
  }
  const _0x5b701e = parseComposeLengthRatio(_0x47969b["style"]?.["left"], _0x3cfdc4["drawW"], 0x0);
  const _0x1f7330 = parseComposeLengthRatio(_0x47969b["style"]?.['top'], _0x3cfdc4["drawH"], 0x0);
  const _0x108516 = Math["max"](0x0, Math["min"](_0x5a0bab - 0x1, -_0x5b701e / _0x32705b * _0x5a0bab));
  const _0x57c6fc = Math["max"](0x0, Math["min"](_0x2215ce - 0x1, -_0x1f7330 / _0x2307e8 * _0x2215ce));
  const _0x46698e = Math['max'](0x1, Math["min"](_0x5a0bab - _0x108516, _0x5a0bab / _0x32705b));
  const _0x4cb4cc = Math["max"](0x1, Math["min"](_0x2215ce - _0x57c6fc, _0x2215ce / _0x2307e8));
  return {
    'sx': _0x108516,
    'sy': _0x57c6fc,
    'sw': _0x46698e,
    'sh': _0x4cb4cc
  };
}
export async function drawStoryboardComposeAsset(_0x59083c, {
  cell: _0x373e95,
  finalUrl: _0x1fe87a,
  imageEl: _0x46ce4e,
  target: _0x3e5290,
  loadImage: _0x959005
}) {
  if (!_0x59083c || !_0x1fe87a || typeof _0x959005 !== 'function') {
    return ![];
  }
  const _0x358c63 = await _0x959005(_0x1fe87a);
  if (!_0x358c63) {
    return ![];
  }
  const _0x277698 = buildStoryboardComposeRenderedCrop(_0x46ce4e, _0x358c63, _0x3e5290);
  if (_0x277698) {
    _0x59083c["drawImage"](_0x358c63, _0x277698['sx'], _0x277698['sy'], _0x277698['sw'], _0x277698['sh'], _0x3e5290['x0'], _0x3e5290['y0'], _0x3e5290["drawW"], _0x3e5290['drawH']);
    return !![];
  }
  const _0x2d311 = String(_0x46ce4e?.['style']?.['objectFit'] || '')['trim']();
  const _0x126501 = _0x2d311 === "fill" || !_0x46ce4e && (_0x373e95?.["storyboardExtractedCell"] === !![] || _0x373e95?.["storyboardLockedCell"] === !![] || _0x373e95?.["storyboardPiece"] === !![]);
  if (_0x126501) {
    _0x59083c['drawImage'](_0x358c63, 0x0, 0x0, _0x358c63['naturalWidth'], _0x358c63['naturalHeight'], _0x3e5290['x0'], _0x3e5290['y0'], _0x3e5290['drawW'], _0x3e5290["drawH"]);
    return !![];
  }
  const _0x171b59 = _0x358c63['naturalWidth'];
  const _0x2c5dbc = _0x358c63["naturalHeight"];
  const _0x12aa89 = _0x171b59 / _0x2c5dbc;
  const _0xf805f3 = _0x3e5290["drawW"] / _0x3e5290["drawH"];
  let _0x2c6b33;
  let _0x167382;
  let _0x12bf72;
  let _0x379d72;
  _0x12aa89 > _0xf805f3 ? (_0x167382 = _0x2c5dbc, _0x2c6b33 = _0x2c5dbc * _0xf805f3, _0x12bf72 = (_0x171b59 - _0x2c6b33) / 0x2, _0x379d72 = 0x0) : (_0x2c6b33 = _0x171b59, _0x167382 = _0x171b59 / _0xf805f3, _0x12bf72 = 0x0, _0x379d72 = (_0x2c5dbc - _0x167382) / 0x2);
  _0x59083c["drawImage"](_0x358c63, _0x12bf72, _0x379d72, _0x2c6b33, _0x167382, _0x3e5290['x0'], _0x3e5290['y0'], _0x3e5290['drawW'], _0x3e5290["drawH"]);
  return !![];
}