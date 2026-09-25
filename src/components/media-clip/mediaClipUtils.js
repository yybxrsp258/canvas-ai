export function normalizeText(_0x32bf19) {
  return String(_0x32bf19 || '')["trim"]();
}
export function firstNonEmpty(..._0x80ea5) {
  for (const _0x3c1d4d of _0x80ea5) {
    const _0x16364f = normalizeText(_0x3c1d4d);
    if (_0x16364f) {
      return _0x16364f;
    }
  }
  return '';
}
export function toNumber(_0x19c37a, _0x5c6dc7 = 0x0) {
  const _0x434bba = Number(_0x19c37a);
  return Number["isFinite"](_0x434bba) ? _0x434bba : _0x5c6dc7;
}
export function parsePercentValue(_0x476e79, _0x382962 = NaN) {
  const _0x5c3dce = String(_0x476e79 ?? '')['trim']();
  if (!_0x5c3dce) {
    return _0x382962;
  }
  const _0x13cdd4 = _0x5c3dce["endsWith"]('%') ? _0x5c3dce["slice"](0x0, -0x1) : _0x5c3dce;
  const _0x187bda = Number(_0x13cdd4);
  return Number["isFinite"](_0x187bda) ? _0x187bda : _0x382962;
}
export function readLayoutWidthPx(_0xbce61e, _0x407ad0 = 0x0) {
  const _0x541531 = toNumber(_0xbce61e?.['offsetWidth'], 0x0);
  if (_0x541531 > 0x0) {
    return _0x541531;
  }
  const _0x331313 = toNumber(_0xbce61e?.["clientWidth"], 0x0);
  if (_0x331313 > 0x0) {
    return _0x331313;
  }
  const _0x3fca92 = Number["parseFloat"](String(_0xbce61e?.["style"]?.["width"] || ''));
  if (Number["isFinite"](_0x3fca92) && _0x3fca92 > 0x0) {
    return _0x3fca92;
  }
  return toNumber(_0xbce61e?.['getBoundingClientRect']?.()['width'], _0x407ad0);
}
export function formatTime(_0x141c61) {
  const _0x1881d2 = Math["max"](0x0, toNumber(_0x141c61, 0x0));
  const _0x5e2f5b = Math['floor'](_0x1881d2 / 0x3c);
  const _0x30b244 = Math["floor"](_0x1881d2 % 0x3c);
  return String(_0x5e2f5b)['padStart'](0x2, '0') + ':' + String(_0x30b244)["padStart"](0x2, '0');
}
export function formatDurationLabel(_0x84155b) {
  const _0x1e8649 = Math['max'](0x0, toNumber(_0x84155b, 0x0));
  return _0x1e8649["toFixed"](0x2) + 's';
}
export function isSameMediaClipState(_0x3b03ae, _0x58f315) {
  return JSON["stringify"](_0x3b03ae || null) === JSON["stringify"](_0x58f315 || null);
}
export function getTrackDuration(_0x2950f1) {
  return Math["max"](0.1, toNumber(_0x2950f1?.["durationSec"] || _0x2950f1?.["endSec"], 0.1));
}
export function stopPointer(_0x1c3eb5) {
  if (!_0x1c3eb5) {
    return;
  }
  _0x1c3eb5["preventDefault"]?.();
  _0x1c3eb5["stopPropagation"]?.();
}