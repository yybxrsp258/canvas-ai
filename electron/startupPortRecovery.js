import { assertStartupPortCanBeReclaimed } from './startupPortPolicy.js';
function normalizeListenerPids(_0x540968 = []) {
  return [...new Set((Array['isArray'](_0x540968) ? _0x540968 : [])["map"](_0x4497bf => Number(_0x4497bf))['filter'](_0x2132d9 => Number["isInteger"](_0x2132d9) && _0x2132d9 > 0x0))];
}
function samePidSet(_0x19d8ad, _0xb16a05) {
  return _0x19d8ad['length'] === _0xb16a05["length"] && _0x19d8ad["every"](_0x3f1ef4 => _0xb16a05['includes'](_0x3f1ef4));
}
function createPortRecoveryError(_0x2bf5b8, _0x2e8eae, _0x286514) {
  const _0x4f3ca5 = new Error(_0x2bf5b8);
  _0x4f3ca5['code'] = _0x2e8eae;
  _0x4f3ca5["details"] = _0x286514;
  return _0x4f3ca5;
}
export async function reclaimStartupPort({
  port: _0x3f30b9,
  env = process['env'],
  collectListeningPortPids: _0x465312,
  probePortAvailable: _0x5078af,
  confirmRuntimeIdentity: _0x3adf4a,
  terminateProcess: _0x43ca07,
  delayFn: _0x4cba29,
  settleDelayMs = 0x320,
  onReclaim = null,
  onEnumerationUnavailable = null
} = {}) {
  if (typeof _0x465312 !== "function") {
    throw new TypeError("Startup port listener collector is required");
  }
  if (typeof _0x43ca07 !== "function") {
    throw new TypeError("Startup port process terminator is required");
  }
  let _0x530ef7;
  try {
    _0x530ef7 = normalizeListenerPids(await _0x465312(_0x3f30b9));
  } catch (_0x4e5a0f) {
    if (_0x4e5a0f?.["code"] !== "AIC_STARTUP_PORT_ENUMERATION_FAILED") {
      throw _0x4e5a0f;
    }
    if (typeof _0x5078af !== 'function') {
      throw _0x4e5a0f;
    }
    let _0x4efa76;
    try {
      _0x4efa76 = await _0x5078af({
        'port': _0x3f30b9
      });
    } catch (_0x1b6b18) {
      _0x4e5a0f["details"] = {
        ...(_0x4e5a0f?.["details"] && typeof _0x4e5a0f["details"] === 'object' ? _0x4e5a0f['details'] : {}),
        'portAvailability': "probe-failed",
        'portProbeFailure': {
          'code': String(_0x1b6b18?.["code"] || ''),
          'message': String(_0x1b6b18?.['message'] || _0x1b6b18 || '')
        }
      };
      throw _0x4e5a0f;
    }
    _0x4e5a0f['details'] = {
      ...(_0x4e5a0f?.["details"] && typeof _0x4e5a0f["details"] === "object" ? _0x4e5a0f["details"] : {}),
      'portAvailability': _0x4efa76 === !![] ? "free" : "busy-or-unavailable"
    };
    if (_0x4efa76 !== !![]) {
      throw _0x4e5a0f;
    }
    onEnumerationUnavailable?.({
      'port': _0x3f30b9,
      'error': _0x4e5a0f
    });
    return {
      'reclaimed': ![],
      'pids': [],
      'skippedReason': 'enumeration-unavailable-port-free'
    };
  }
  if (_0x530ef7["length"] === 0x0) {
    return {
      'reclaimed': ![],
      'pids': []
    };
  }
  const _0x515c0e = async _0x13979a => normalizeListenerPids(typeof _0x3adf4a === "function" ? await _0x3adf4a({
    'port': _0x3f30b9,
    'pids': _0x13979a
  }) : []);
  const _0x11262d = await _0x515c0e(_0x530ef7);
  try {
    assertStartupPortCanBeReclaimed({
      'port': _0x3f30b9,
      'pids': _0x530ef7,
      'verifiedPids': _0x11262d,
      'env': env
    });
  } catch (_0x49102c) {
    if (_0x49102c?.['code'] !== "AIC_STARTUP_PORT_OWNERSHIP_UNVERIFIED" || typeof _0x4cba29 !== "function") {
      throw _0x49102c;
    }
    const _0x4fad24 = Date["now"]() + 0x7d0;
    for (let _0x5aac90 = 0x0; _0x5aac90 < 0xa && Date["now"]() < _0x4fad24; _0x5aac90 += 0x1) {
      await _0x4cba29(0xc8);
      const _0x23d994 = normalizeListenerPids(await _0x465312(_0x3f30b9));
      if (_0x23d994["length"] === 0x0) {
        return {
          'reclaimed': ![],
          'pids': [],
          'skippedReason': "listener-exited"
        };
      }
      if (!samePidSet(_0x530ef7, _0x23d994)) {
        break;
      }
    }
    throw _0x49102c;
  }
  const _0xf2007f = normalizeListenerPids(await _0x465312(_0x3f30b9));
  if (_0xf2007f["length"] === 0x0) {
    return {
      'reclaimed': !![],
      'pids': []
    };
  }
  if (!samePidSet(_0x530ef7, _0xf2007f)) {
    throw createPortRecoveryError("Port " + _0x3f30b9 + " listener ownership changed before termination", "AIC_STARTUP_PORT_OWNERSHIP_CHANGED", {
      'port': _0x3f30b9,
      'expectedPids': _0x530ef7,
      'currentPids': _0xf2007f
    });
  }
  assertStartupPortCanBeReclaimed({
    'port': _0x3f30b9,
    'pids': _0xf2007f,
    'verifiedPids': await _0x515c0e(_0xf2007f),
    'env': env
  });
  onReclaim?.({
    'port': _0x3f30b9,
    'pids': _0x530ef7
  });
  const _0x5396ed = [];
  for (const _0x5f553b of _0x530ef7) {
    try {
      await _0x43ca07(_0x5f553b);
    } catch (_0x4e092c) {
      _0x5396ed["push"]({
        'pid': _0x5f553b,
        'error': String(_0x4e092c?.["message"] || _0x4e092c)
      });
    }
  }
  if (_0x5396ed["length"] > 0x0) {
    throw createPortRecoveryError("Failed to stop the verified stale runtime on port " + _0x3f30b9, 'AIC_STARTUP_PORT_RECLAIM_FAILED', {
      'port': _0x3f30b9,
      'pids': _0x5396ed['map'](_0x39d213 => _0x39d213["pid"]),
      'failures': _0x5396ed
    });
  }
  await _0x4cba29?.(Math['max'](0x0, Number(settleDelayMs) || 0x0));
  const _0x245018 = normalizeListenerPids(await _0x465312(_0x3f30b9));
  if (_0x245018["length"] > 0x0) {
    throw createPortRecoveryError("Port " + _0x3f30b9 + " is still busy after stopping the verified stale runtime", "AIC_STARTUP_PORT_STILL_BUSY", {
      'port': _0x3f30b9,
      'pids': _0x245018
    });
  }
  return {
    'reclaimed': !![],
    'pids': _0x530ef7
  };
}