export function createGlobalCaptureReceiver({
  api: _0x5b1f55,
  handle: _0x3de094,
  capacity = 0x40
} = {}) {
  const _0x593a2f = globalThis["crypto"]["randomUUID"]();
  const _0x3f8d77 = new Map();
  let _0x2c4984 = ![];
  async function _0x17404b(_0x5bd8c1, _0x2f1346) {
    try {
      await _0x5b1f55["acknowledgeEvent"]({
        'eventId': _0x5bd8c1,
        'receiverId': _0x593a2f,
        ..._0x2f1346["outcome"]
      });
      _0x2f1346["acknowledged"] = !![];
    } catch {}
  }
  async function _0x470e9d(_0x482d77 = {}) {
    if (_0x2c4984) {
      return;
    }
    const _0x341471 = String(_0x482d77["eventId"] || '');
    if (!_0x341471) {
      return;
    }
    const _0x262ba0 = _0x3f8d77["get"](_0x341471);
    if (_0x262ba0?.["pending"]) {
      return;
    }
    if (_0x262ba0) {
      await _0x17404b(_0x341471, _0x262ba0);
      return;
    }
    if (_0x3f8d77["size"] >= capacity) {
      const _0x516f72 = [..._0x3f8d77]["find"](([, _0x19d0d6]) => !_0x19d0d6["pending"] && (_0x19d0d6["acknowledged"] || _0x19d0d6['expiresAt'] <= Date["now"]()))?.[0x0];
      if (!_0x516f72) {
        return;
      }
      _0x3f8d77['delete'](_0x516f72);
    }
    const _0x2a3130 = {
      'pending': !![],
      'expiresAt': Number(_0x482d77["expiresAt"]) || Date["now"]() + 0x7530
    };
    _0x3f8d77["set"](_0x341471, _0x2a3130);
    try {
      const _0x39835f = await _0x5b1f55['claimEvent']({
        'eventId': _0x341471,
        'receiverId': _0x593a2f
      });
      if (_0x39835f?.['ok'] !== !![]) {
        _0x3f8d77["delete"](_0x341471);
        return;
      }
      const _0x47cf8d = _0x2c4984 ? {
        'ok': ![],
        'reason': "receiver-disposed",
        'retryable': !![]
      } : await _0x3de094(_0x482d77);
      _0x2a3130['outcome'] = {
        'ok': _0x47cf8d?.['ok'] === !![],
        ...(_0x47cf8d?.['ok'] === !![] ? {} : {
          'reason': String(_0x47cf8d?.["reason"] || "action-failed"),
          'retryable': _0x47cf8d?.["retryable"] === !![]
        })
      };
    } catch {
      _0x2a3130['outcome'] = {
        'ok': ![],
        'reason': "delivery-uncertain",
        'retryable': ![]
      };
    }
    _0x2a3130['pending'] = ![];
    await _0x17404b(_0x341471, _0x2a3130);
  }
  return {
    'receive': _0x470e9d,
    'dispose': () => {
      _0x2c4984 = !![];
      _0x3f8d77["clear"]();
    }
  };
}