export function reviewElement(_0x49bda7, _0x5831ca = '', _0xad5e2f = '') {
  const _0x2e6318 = document['createElement'](_0x49bda7);
  _0x2e6318['className'] = _0x5831ca;
  _0x2e6318["textContent"] = _0xad5e2f;
  if (_0x49bda7 === "button") {
    _0x2e6318["type"] = 'button';
  }
  return _0x2e6318;
}
export function reviewTime(_0x3dcf0e) {
  return new Date(_0x3dcf0e * 0x3e8)["toLocaleString"]([], {
    'month': "numeric",
    'day': "numeric",
    'hour': "2-digit",
    'minute': "2-digit"
  });
}