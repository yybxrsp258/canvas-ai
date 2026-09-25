import { execFileSync } from 'node:child_process';
import { createServer } from 'node:net';
import { describeSystemCommandFailure, resolveWindowsSystemToolPath } from './windowsSystemTools.js';
function createEnumerationError({
  port: _0x1502d2,
  command: _0x314019,
  cause: _0x285e00
}) {
  const _0x578809 = new Error('Failed\x20to\x20inspect\x20listeners\x20on\x20port\x20' + _0x1502d2);
  _0x578809["code"] = "AIC_STARTUP_PORT_ENUMERATION_FAILED";
  _0x578809["details"] = {
    'port': _0x1502d2,
    'command': _0x314019,
    'failure': describeSystemCommandFailure(_0x285e00)
  };
  _0x578809["cause"] = _0x285e00;
  return _0x578809;
}
function parseWindowsNetstatPids(_0x859b1, _0x1f48e4, _0x22ac39) {
  return [...new Set(String(_0x859b1 || '')["split"](/\r?\n/)["map"](_0x264e96 => _0x264e96['trim']())['filter'](_0x2791b1 => /\bLISTENING\b/i['test'](_0x2791b1))["map"](_0x27df22 => _0x27df22["split"](/\s+/))["filter"](_0x514228 => _0x514228["length"] >= 0x5 && _0x514228[0x1]?.["endsWith"](':' + _0x1f48e4))['map'](_0x9de78d => Number["parseInt"](_0x9de78d[0x4], 0xa))["filter"](_0x1317fe => Number["isInteger"](_0x1317fe) && _0x1317fe > 0x0 && _0x1317fe !== _0x22ac39))];
}
export function collectListeningPortPids(_0x4edd4c, {
  platform = process["platform"],
  env = process["env"],
  processId = process["pid"],
  execFileSyncFn = execFileSync
} = {}) {
  let _0x3c67fa = "lsof";
  try {
    if (platform === "win32") {
      _0x3c67fa = resolveWindowsSystemToolPath("netstat", {
        'env': env
      });
      const _0x251890 = execFileSyncFn(_0x3c67fa, ['-ano', '-p', "tcp"], {
        'encoding': "utf8",
        'windowsHide': !![]
      });
      return parseWindowsNetstatPids(_0x251890, _0x4edd4c, processId);
    }
    const _0x2b7b56 = execFileSyncFn(_0x3c67fa, ['-nP', "-iTCP:" + _0x4edd4c, "-sTCP:LISTEN", '-t'], {
      'encoding': 'utf8',
      'windowsHide': !![]
    });
    return String(_0x2b7b56 || '')["split"](/\r?\n/)['map'](_0x2910f6 => Number["parseInt"](_0x2910f6["trim"](), 0xa))["filter"](_0x15f30c => Number["isInteger"](_0x15f30c) && _0x15f30c > 0x0 && _0x15f30c !== processId);
  } catch (_0x1d467a) {
    if (platform !== "win32" && Number(_0x1d467a?.["status"]) === 0x1) {
      return [];
    }
    throw createEnumerationError({
      'port': _0x4edd4c,
      'command': _0x3c67fa,
      'cause': _0x1d467a
    });
  }
}
export function probeTcpPortAvailable({
  host = '127.0.0.1',
  port: _0x5abd5c,
  createServerFn = createServer
} = {}) {
  return new Promise((_0x58588f, _0x17ccdf) => {
    const _0x470ef0 = createServerFn();
    let _0x1e18e2 = ![];
    const _0x4272b3 = (_0x7aebec, _0x38af70) => {
      if (_0x1e18e2) {
        return;
      }
      _0x1e18e2 = !![];
      _0x7aebec(_0x38af70);
    };
    _0x470ef0["once"]("error", _0x309f23 => {
      if (_0x309f23?.["code"] === "EADDRINUSE") {
        _0x4272b3(_0x58588f, ![]);
        return;
      }
      _0x4272b3(_0x17ccdf, _0x309f23);
    });
    try {
      _0x470ef0["listen"]({
        'host': host,
        'port': _0x5abd5c,
        'exclusive': !![]
      }, () => {
        _0x470ef0["close"](_0x162ef1 => {
          if (_0x162ef1) {
            _0x4272b3(_0x17ccdf, _0x162ef1);
            return;
          }
          _0x4272b3(_0x58588f, !![]);
        });
      });
      _0x470ef0['unref']?.();
    } catch (_0x425a29) {
      _0x4272b3(_0x17ccdf, _0x425a29);
    }
  });
}
export const __startupPortInspectorForTest = {
  'parseWindowsNetstatPids': parseWindowsNetstatPids
};