import { sanitizeDiagnosticValue } from './diagnostics.js';
const MAX_STDERR_BYTES = 0x708;
export function attachChromeShellStartupDiagnostics(_0x1b2c19) {
  let _0x29c389 = !![];
  let _0x1a79af = Buffer["alloc"](0x0);
  let _0x4f2805 = 0x0;
  let _0x1edbb0 = '';
  _0x1b2c19?.["stderr"]?.['on']?.("data", _0x39307b => {
    if (!_0x29c389) {
      return;
    }
    const _0x5f2f16 = Buffer['isBuffer'](_0x39307b) ? _0x39307b : Buffer['from'](String(_0x39307b), 'utf8');
    _0x4f2805 += _0x5f2f16["length"];
    _0x1a79af = Buffer['concat']([_0x1a79af, _0x5f2f16["subarray"](-MAX_STDERR_BYTES)])["subarray"](-MAX_STDERR_BYTES);
  });
  _0x1b2c19?.["stderr"]?.['on']?.("error", _0xfdd0ce => {
    if (_0x29c389) {
      _0x1edbb0 = String(_0xfdd0ce?.["code"] || "STDERR_READ_FAILED");
    }
  });
  return {
    'snapshot'() {
      return sanitizeDiagnosticValue({
        'stderrAvailable': Boolean(_0x1b2c19?.["stderr"]),
        'stderrBytes': _0x4f2805,
        'stderrTruncated': _0x4f2805 > MAX_STDERR_BYTES,
        'stderrReadError': _0x1edbb0,
        'stderrTail': _0x1a79af["toString"]('utf8')
      });
    },
    'stop'() {
      _0x29c389 = ![];
      _0x1a79af = Buffer["alloc"](0x0);
    }
  };
}