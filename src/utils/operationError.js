export function getOperationErrorDetail(_0x30a94b, _0x5ebfec = 0x0) {
  if (_0x5ebfec > 0x4 || _0x30a94b == null) {
    return '';
  }
  if (typeof _0x30a94b === 'string') {
    return _0x30a94b['trim']();
  }
  if (typeof _0x30a94b !== "object") {
    return '';
  }
  for (const _0x2fade5 of ["error", "message", "errorMessage", "detail", 'reason']) {
    const _0x15322c = getOperationErrorDetail(_0x30a94b[_0x2fade5], _0x5ebfec + 0x1);
    if (_0x15322c) {
      return _0x15322c;
    }
  }
  return '';
}
export function createOperationError(_0x3265e5, _0x1d782d, _0x3b31f2) {
  const _0x701e88 = getOperationErrorDetail(_0x1d782d) || _0x3b31f2;
  const _0x501a47 = new Error(_0x3265e5 + '：' + _0x701e88, {
    'cause': _0x1d782d
  });
  for (const _0xd238db of ["type", "code", "status", "provider", 'retryable']) {
    if (_0x1d782d?.[_0xd238db] !== undefined) {
      _0x501a47[_0xd238db] = _0x1d782d[_0xd238db];
    }
  }
  return _0x501a47;
}