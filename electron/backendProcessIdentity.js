import { Buffer } from 'node:buffer';
import { spawnSync } from 'node:child_process';
import a191_0xa9dffb from 'node:path';
import { describeSystemCommandFailure, resolveWindowsSystemToolPath } from './windowsSystemTools.js';
const WINDOWS_PID_ENV_NAME = "AIC_BACKEND_IDENTITY_PIDS_BASE64";
const PROCESS_QUERY_TIMEOUT_MS = 0x1388;
const WINDOWS_PROCESS_QUERY_SCRIPT = ("\n$encodedPids = [Environment]::GetEnvironmentVariable(\"" + WINDOWS_PID_ENV_NAME + "\")\nif ([String]::IsNullOrWhiteSpace($encodedPids)) { exit 2 }\n$pidJson = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($encodedPids))\n$requestedPids = @(ConvertFrom-Json $pidJson)\n$rows = @()\nforeach ($requestedPid in $requestedPids) {\n  $numericPid = 0\n  if (-not [int]::TryParse([string]$requestedPid, [ref]$numericPid)) { continue }\n  try {\n    $record = Get-CimInstance Win32_Process -Filter (\"ProcessId = \" + $numericPid) -ErrorAction Stop\n  } catch {\n    continue\n  }\n  if ($null -eq $record) { continue }\n  $rows += [pscustomobject]@{\n    pid = [int]$record.ProcessId\n    executablePath = [string]$record.ExecutablePath\n    commandLine = [string]$record.CommandLine\n  }\n}\n$json = ConvertTo-Json -InputObject @($rows) -Compress\n$encodedRows = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($json))\n[Console]::Out.Write($encodedRows)\n")["trim"]();
function normalizePids(_0x5958e5 = []) {
  return [...new Set((Array['isArray'](_0x5958e5) ? _0x5958e5 : [])["map"](_0x53c58b => Number(_0x53c58b))["filter"](_0x1a98dd => Number['isInteger'](_0x1a98dd) && _0x1a98dd > 0x0))];
}
function createIdentityError(_0x2844e4, _0x510abb = null, _0x2c3573 = null) {
  const _0x43d5da = new Error(_0x2844e4);
  _0x43d5da["code"] = "AIC_STARTUP_PORT_IDENTITY_CHECK_FAILED";
  if (_0x510abb) {
    _0x43d5da['cause'] = _0x510abb;
  }
  if (_0x2c3573) {
    _0x43d5da['details'] = _0x2c3573;
  }
  return _0x43d5da;
}
function normalizeExecutablePath(_0x2958e4, _0x2ae8ee) {
  const _0x36a33e = String(_0x2958e4 || '')["trim"]()["replace"](/^"|"$/g, '');
  if (!_0x36a33e) {
    return '';
  }
  return _0x2ae8ee === "win32" ? a191_0xa9dffb["win32"]['normalize'](_0x36a33e)["toLowerCase"]() : a191_0xa9dffb["posix"]["normalize"](_0x36a33e);
}
function normalizeCommandLine(_0x45eb4f, _0x48ceaf) {
  const _0x138f69 = String(_0x45eb4f || '')["trim"]();
  return _0x48ceaf === "win32" ? _0x138f69["replace"](/\\/g, '/')["toLowerCase"]() : _0x138f69;
}
function hasBackendLaunchArguments(_0x5d1cf1, {
  host: _0xfd5b9f,
  port: _0x5f1cb4
}) {
  return _0x5d1cf1["includes"]("--host=" + String(_0xfd5b9f || '')) && _0x5d1cf1["includes"]("--port=" + Number(_0x5f1cb4));
}
export function isExpectedBackendProcess(_0x3b19fc = {}, _0x5d9224 = {}) {
  const _0xb96154 = _0x5d9224["platform"] || process['platform'];
  const _0x4bbc50 = _0xb96154 === "win32" ? a191_0xa9dffb['win32'] : a191_0xa9dffb["posix"];
  const _0x44bb7a = normalizeExecutablePath(_0x3b19fc['executablePath'], _0xb96154);
  const _0x403e7f = normalizeExecutablePath(_0x5d9224["backendCommand"], _0xb96154);
  const _0x5793c7 = normalizeCommandLine(_0x3b19fc["commandLine"], _0xb96154);
  if (!_0x403e7f || !_0x5793c7 || !hasBackendLaunchArguments(_0x5793c7, _0x5d9224)) {
    return ![];
  }
  if (_0x5d9224["appIsPackaged"]) {
    if (_0xb96154 === "win32") {
      return _0x44bb7a === _0x403e7f;
    }
    return _0x44bb7a === _0x403e7f || _0x5793c7["includes"](_0x403e7f);
  }
  if (_0x4bbc50["isAbsolute"](String(_0x5d9224["backendCommand"] || ''))) {
    if (_0x44bb7a !== _0x403e7f) {
      return ![];
    }
  } else {
    const _0x5ee505 = _0x4bbc50["basename"](_0x44bb7a || _0x5793c7)["toLowerCase"]();
    if (!/^python(?:3(?:\.\d+)?)?(?:\.exe)?$/["test"](_0x5ee505)) {
      return ![];
    }
  }
  const _0x249c3e = normalizeCommandLine(_0x4bbc50["join"](String(_0x5d9224["appRoot"] || ''), "server.py"), _0xb96154);
  return _0x5793c7["includes"](_0x249c3e) || /(?:^|[\s"'])server\.py(?:[\s"']|$)/i["test"](_0x5793c7);
}
function inspectWindowsBackendProcesses({
  pids: _0x4df1f4,
  env: _0x239882,
  spawnProcess: _0x2b4c07
}) {
  const _0x3cde8d = resolveWindowsSystemToolPath("powershell", {
    'env': _0x239882
  });
  let _0x496128;
  try {
    _0x496128 = _0x2b4c07(_0x3cde8d, ["-NoLogo", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", WINDOWS_PROCESS_QUERY_SCRIPT], {
      'encoding': "utf8",
      'env': {
        ..._0x239882,
        [WINDOWS_PID_ENV_NAME]: Buffer["from"](JSON["stringify"](_0x4df1f4), 'utf8')["toString"]("base64")
      },
      'timeout': PROCESS_QUERY_TIMEOUT_MS,
      'windowsHide': !![]
    });
  } catch (_0x3b0e1f) {
    throw createIdentityError('Failed\x20to\x20inspect\x20Windows\x20processes\x20that\x20own\x20the\x20startup\x20port', _0x3b0e1f, {
      'command': _0x3cde8d,
      'failure': describeSystemCommandFailure(_0x3b0e1f)
    });
  }
  if (_0x496128?.['status'] !== 0x0 || _0x496128?.["error"] || _0x496128?.["signal"]) {
    throw createIdentityError("Failed to inspect Windows processes that own the startup port", _0x496128?.["error"] || null, {
      'command': _0x3cde8d,
      'failure': {
        ...describeSystemCommandFailure(_0x496128),
        ...describeSystemCommandFailure(_0x496128?.["error"])
      }
    });
  }
  try {
    const _0x1edfb6 = Buffer['from'](String(_0x496128["stdout"] || '')['trim'](), "base64")["toString"]("utf8");
    const _0x12b775 = JSON["parse"](_0x1edfb6 || '[]');
    return Array["isArray"](_0x12b775) ? _0x12b775 : [];
  } catch (_0x121f04) {
    throw createIdentityError("Windows process identity output was invalid", _0x121f04);
  }
}
function inspectPosixBackendProcesses({
  pids: _0x58d4b1,
  spawnProcess: _0xf045ef
}) {
  const _0x2e98a9 = [];
  for (const _0x4853b2 of _0x58d4b1) {
    const _0x178c61 = _0xf045ef('ps', ['-p', String(_0x4853b2), '-o', "comm=", '-o', "args="], {
      'encoding': "utf8",
      'timeout': PROCESS_QUERY_TIMEOUT_MS
    });
    if (_0x178c61?.["status"] === 0x1) {
      continue;
    }
    if (_0x178c61?.["status"] !== 0x0 || _0x178c61?.["error"] || _0x178c61?.["signal"]) {
      throw createIdentityError("Failed to inspect process " + _0x4853b2 + " that owns the startup port", _0x178c61?.["error"] || null);
    }
    const _0x22af25 = String(_0x178c61["stdout"] || '')['trim']();
    if (_0x22af25) {
      _0x2e98a9["push"]({
        'pid': _0x4853b2,
        'executablePath': '',
        'commandLine': _0x22af25
      });
    }
  }
  return _0x2e98a9;
}
export function inspectBackendProcesses({
  pids: _0x9548e0,
  platform = process["platform"],
  env = process['env'],
  spawnProcess = spawnSync
} = {}) {
  const _0x31a3fe = normalizePids(_0x9548e0);
  if (_0x31a3fe["length"] === 0x0) {
    return [];
  }
  return platform === 'win32' ? inspectWindowsBackendProcesses({
    'pids': _0x31a3fe,
    'env': env,
    'spawnProcess': spawnProcess
  }) : inspectPosixBackendProcesses({
    'pids': _0x31a3fe,
    'spawnProcess': spawnProcess
  });
}
export function findVerifiedBackendProcessPids({
  pids: _0x2446c2,
  appIsPackaged: _0x3dd4f3,
  appRoot: _0x1fe0d4,
  backendCommand: _0x5f5116,
  host: _0x52797b,
  port: _0x4e67ba,
  platform = process["platform"],
  env = process["env"],
  inspectProcesses = _0x5e6727 => inspectBackendProcesses({
    'pids': _0x5e6727,
    'platform': platform,
    'env': env
  })
} = {}) {
  const _0xae025b = normalizePids(_0x2446c2);
  const _0x3ee17a = new Set(_0xae025b);
  const _0x41b8d7 = {
    'appIsPackaged': _0x3dd4f3,
    'appRoot': _0x1fe0d4,
    'backendCommand': _0x5f5116,
    'host': _0x52797b,
    'port': _0x4e67ba,
    'platform': platform
  };
  return normalizePids(inspectProcesses(_0xae025b)["filter"](_0xf30e12 => _0x3ee17a['has'](Number(_0xf30e12?.["pid"])) && isExpectedBackendProcess(_0xf30e12, _0x41b8d7))["map"](_0x2ca1ba => _0x2ca1ba['pid']));
}
export const __backendProcessIdentityForTest = {
  'WINDOWS_PROCESS_QUERY_SCRIPT': WINDOWS_PROCESS_QUERY_SCRIPT,
  'normalizeExecutablePath': normalizeExecutablePath
};