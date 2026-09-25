let operationSequence = 0x0;
export function createDiagnosticOperation({
  type: _0x41df9f,
  context = {},
  source = "renderer",
  logEvent: _0x238be6
}) {
  const _0x1cb83a = Date["now"]();
  const _0x6fe79e = {
    ...context,
    'operationId': _0x1cb83a["toString"](0x24) + '-' + ++operationSequence,
    'startedAt': _0x1cb83a
  };
  const _0x2c8662 = (_0x20780a, _0x4f85a8) => {
    try {
      Promise["resolve"](_0x238be6?.({
        'type': _0x41df9f + '.' + _0x20780a,
        'level': _0x20780a === "failed" ? "error" : "info",
        'source': source,
        'message': _0x41df9f + '\x20' + _0x20780a,
        'error': _0x4f85a8,
        'context': {
          ..._0x6fe79e,
          'elapsedMs': Math["max"](0x0, Date["now"]() - _0x1cb83a),
          ...(_0x4f85a8 ? {
            'failure': {
              'name': String(_0x4f85a8["name"] || 'Error'),
              'message': String(_0x4f85a8['message'] || _0x4f85a8),
              'code': typeof _0x4f85a8["code"] === "string" || typeof _0x4f85a8["code"] === "number" ? _0x4f85a8["code"] : ''
            }
          } : {})
        }
      }))["catch"](() => {});
    } catch {}
  };
  return {
    'metadata': _0x6fe79e,
    async 'run'(_0x4f23ac) {
      _0x2c8662("started");
      try {
        const _0x21b358 = await _0x4f23ac();
        if (_0x21b358?.['canceled'] === !![] || _0x21b358?.["cancelled"] === !![]) {
          _0x2c8662('canceled');
        } else {
          if (_0x21b358?.["success"] === ![] || _0x21b358?.['ok'] === ![] || _0x21b358?.["error"]) {
            _0x2c8662("failed", new Error(String(_0x21b358['error'] || _0x21b358['message'] || "Operation failed")));
          } else {
            _0x2c8662("succeeded");
          }
        }
        return _0x21b358;
      } catch (_0x4e4548) {
        _0x2c8662("failed", _0x4e4548);
        throw _0x4e4548;
      }
    }
  };
}