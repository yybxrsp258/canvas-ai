export function createGlobalCaptureDelivery({
  capacity = 0xc,
  timeoutMs = 0x3a98,
  setTimeoutFn = setTimeout,
  clearTimeoutFn = clearTimeout
} = {}) {
  const _0x23fdf0 = new Map();
  let _0x3a9159 = ![];
  function _0x5acc10(_0x10b96b, _0x2f200a) {
    if (_0x23fdf0["get"](_0x10b96b["event"]['eventId']) !== _0x10b96b) {
      return ![];
    }
    _0x23fdf0["delete"](_0x10b96b["event"]['eventId']);
    clearTimeoutFn(_0x10b96b["timer"]);
    _0x10b96b['signal']?.["removeEventListener"]("abort", _0x10b96b["abort"]);
    _0x10b96b["resolve"](_0x2f200a);
    return !![];
  }
  function _0x4566ae(_0x57945d, {
    signal: _0x56d9a7
  } = {}) {
    if (_0x3a9159 || _0x56d9a7?.["aborted"]) {
      return {
        'ok': ![],
        'reason': "capture-cancelled",
        'retryable': ![]
      };
    }
    if (_0x23fdf0['size'] >= capacity) {
      return {
        'ok': ![],
        'reason': "capture-queue-full",
        'retryable': !![]
      };
    }
    if (!_0x57945d?.['eventId'] || _0x23fdf0["has"](_0x57945d["eventId"])) {
      return {
        'ok': ![],
        'reason': "duplicate-event",
        'retryable': ![]
      };
    }
    _0x57945d['expiresAt'] = Date["now"]() + timeoutMs;
    const _0x56a286 = {
      'event': _0x57945d,
      'signal': _0x56d9a7,
      'receiverId': '',
      'timer': null
    };
    const _0x42b39b = new Promise(_0x5e5f95 => {
      _0x56a286["resolve"] = _0x5e5f95;
    });
    _0x23fdf0["set"](_0x57945d["eventId"], _0x56a286);
    _0x56a286["abort"] = () => _0x5acc10(_0x56a286, {
      'ok': ![],
      'reason': "capture-cancelled",
      'retryable': ![]
    });
    _0x56d9a7?.["addEventListener"]('abort', _0x56a286['abort'], {
      'once': !![]
    });
    _0x56a286["timer"] = setTimeoutFn(() => _0x5acc10(_0x56a286, {
      'ok': ![],
      'reason': "delivery-timeout",
      'retryable': !_0x56a286["receiverId"]
    }), timeoutMs);
    return {
      'ok': !![],
      'completion': _0x42b39b
    };
  }
  function _0x8c26b6(_0x3d8d72 = {}) {
    const _0xfdccd6 = _0x23fdf0["get"](String(_0x3d8d72["eventId"] || ''));
    const _0x26b124 = String(_0x3d8d72["receiverId"] || '')['trim']();
    if (!_0xfdccd6 || !_0x26b124 || _0xfdccd6["receiverId"] && _0xfdccd6["receiverId"] !== _0x26b124) {
      return {
        'ok': ![],
        'reason': 'capture-unavailable'
      };
    }
    _0xfdccd6['receiverId'] = _0x26b124;
    return {
      'ok': !![]
    };
  }
  function _0x47c712(_0x4f6ab0 = {}) {
    const _0x4b8cc4 = _0x23fdf0['get'](String(_0x4f6ab0["eventId"] || ''));
    if (!_0x4b8cc4 || !_0x4b8cc4['receiverId'] || _0x4b8cc4["receiverId"] !== _0x4f6ab0["receiverId"]) {
      return {
        'ok': ![],
        'reason': 'capture-unavailable'
      };
    }
    const _0x499ad5 = _0x4f6ab0['ok'] === !![];
    _0x5acc10(_0x4b8cc4, {
      'ok': _0x499ad5,
      ...(_0x499ad5 ? {} : {
        'reason': String(_0x4f6ab0["reason"] || "node-create-failed"),
        'retryable': _0x4f6ab0['retryable'] === !![]
      })
    });
    return {
      'ok': !![]
    };
  }
  return {
    'enqueue': _0x4566ae,
    'claim': _0x8c26b6,
    'acknowledge': _0x47c712,
    'consumeEvents': () => Array["from"](_0x23fdf0["values"](), _0x17045a => ({
      ..._0x17045a['event']
    })),
    'destroy'() {
      _0x3a9159 = !![];
      for (const _0x308da6 of _0x23fdf0["values"]()) {
        _0x5acc10(_0x308da6, {
          'ok': ![],
          'reason': "capture-controller-destroyed",
          'retryable': ![]
        });
      }
    }
  };
}