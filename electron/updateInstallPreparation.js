import { execFileSync } from 'node:child_process';
import { resolveWindowsSystemToolPath } from './windowsSystemTools.js';
const DEFAULT_UPDATE_INSTALL_CLEANUP_TIMEOUT_MS = 0xfa0;
function delay(_0x243c25) {
  return new Promise(_0x5c61af => {
    setTimeout(_0x5c61af, _0x243c25);
  });
}
function isPidRunning(_0xc676a7) {
  if (!Number["isInteger"](_0xc676a7) || _0xc676a7 <= 0x0) {
    return ![];
  }
  try {
    process["kill"](_0xc676a7, 0x0);
    return !![];
  } catch (_0x1b6bf7) {
    return _0x1b6bf7?.["code"] === "EPERM";
  }
}
async function waitForPidExit(_0x4efb24, _0xdc4757) {
  if (!Number["isInteger"](_0x4efb24) || _0x4efb24 <= 0x0) {
    return !![];
  }
  const _0x5cf1ad = Date['now']();
  while (Date['now']() - _0x5cf1ad < _0xdc4757) {
    if (!isPidRunning(_0x4efb24)) {
      return !![];
    }
    await delay(0x78);
  }
  return !isPidRunning(_0x4efb24);
}
function terminateProcessTree(_0xf9a574, {
  force = ![],
  platform = process['platform'],
  env = process["env"],
  execFileSyncFn = execFileSync
} = {}) {
  if (!Number["isInteger"](_0xf9a574) || _0xf9a574 <= 0x0) {
    return;
  }
  if (platform === 'win32') {
    const _0x2a633a = ["/PID", String(_0xf9a574), '/T'];
    if (force) {
      _0x2a633a["push"]('/F');
    }
    execFileSyncFn(resolveWindowsSystemToolPath("taskkill", {
      'env': env
    }), _0x2a633a, {
      'stdio': "ignore",
      'windowsHide': !![]
    });
    return;
  }
  process['kill'](_0xf9a574, force ? "SIGKILL" : "SIGTERM");
}
export function createUpdateInstallPreparation(_0x1ec62e = {}) {
  const _0x30ea00 = Number(_0x1ec62e["timeoutMs"]) > 0x0 ? Number(_0x1ec62e['timeoutMs']) : DEFAULT_UPDATE_INSTALL_CLEANUP_TIMEOUT_MS;
  const _0x5256eb = typeof _0x1ec62e["getSpawnedServer"] === "function" ? _0x1ec62e["getSpawnedServer"] : () => null;
  const _0x9c3bfb = typeof _0x1ec62e["clearSpawnedServer"] === "function" ? _0x1ec62e["clearSpawnedServer"] : () => {};
  const _0x23b9d5 = typeof _0x1ec62e["markQuittingForUpdate"] === "function" ? _0x1ec62e["markQuittingForUpdate"] : () => {};
  const _0x32af0f = typeof _0x1ec62e["resetQuittingForUpdate"] === "function" ? _0x1ec62e["resetQuittingForUpdate"] : () => {};
  const _0x4664c6 = typeof _0x1ec62e["getMainWindow"] === 'function' ? _0x1ec62e["getMainWindow"] : () => null;
  const _0x4b2552 = typeof _0x1ec62e["getRendererProjectState"] === "function" ? _0x1ec62e["getRendererProjectState"] : () => ({});
  const _0xf9a2d4 = typeof _0x1ec62e["requestRendererRecoverySnapshot"] === "function" ? _0x1ec62e["requestRendererRecoverySnapshot"] : null;
  const _0x934a25 = typeof _0x1ec62e['destroyScreenshotOverlayWindow'] === "function" ? _0x1ec62e["destroyScreenshotOverlayWindow"] : () => {};
  const _0xb8af1e = typeof _0x1ec62e["stopAllPowerSaveBlockers"] === 'function' ? _0x1ec62e["stopAllPowerSaveBlockers"] : () => {};
  const _0x152abe = typeof _0x1ec62e["closeChromeShell"] === "function" ? _0x1ec62e["closeChromeShell"] : async () => {};
  const _0x427a7e = typeof _0x1ec62e["waitForChromeShellStartup"] === "function" ? _0x1ec62e["waitForChromeShellStartup"] : async () => {};
  const _0x5031da = typeof _0x1ec62e["stopSpawnedServerForUpdate"] === "function" ? _0x1ec62e["stopSpawnedServerForUpdate"] : _0x11a88c;
  const _0x4591b3 = typeof _0x1ec62e["logEvent"] === "function" ? _0x1ec62e["logEvent"] : () => {};
  async function _0x11a88c() {
    const _0x5d5d8a = _0x5256eb();
    if (!_0x5d5d8a) {
      return !![];
    }
    const _0xe5c13 = Number(_0x5d5d8a["pid"] || 0x0);
    if (!Number["isInteger"](_0xe5c13) || _0xe5c13 <= 0x0) {
      _0x9c3bfb(_0x5d5d8a);
      return !![];
    }
    try {
      terminateProcessTree(_0xe5c13, {
        'force': ![]
      });
    } catch (_0x5a7657) {
      console["warn"]('[electron]\x20failed\x20to\x20stop\x20backend\x20before\x20update\x20install:', _0x5a7657);
    }
    let _0x401f8a = await waitForPidExit(_0xe5c13, _0x30ea00);
    if (!_0x401f8a) {
      try {
        terminateProcessTree(_0xe5c13, {
          'force': !![]
        });
      } catch (_0x4c7a5b) {
        console["warn"]('[electron]\x20failed\x20to\x20force\x20stop\x20backend\x20before\x20update\x20install:', _0x4c7a5b);
      }
      _0x401f8a = await waitForPidExit(_0xe5c13, 0x3e8);
    }
    if (_0x401f8a) {
      _0x9c3bfb(_0x5d5d8a);
    }
    return _0x401f8a;
  }
  async function _0x79bab7() {
    const _0x5b52ea = _0x4b2552();
    const _0x274087 = _0x4664c6();
    if (_0x5b52ea?.["hasUnsavedChanges"] !== !![] || !_0x274087 || _0x274087['isDestroyed']() || !_0xf9a2d4) {
      return;
    }
    try {
      const _0x1f6e6f = await _0xf9a2d4(_0x274087, "update-install");
      _0x1f6e6f?.['success'] === ![] && _0x4591b3({
        'type': "updater.recovery_snapshot_before_install_failed",
        'level': 'warn',
        'source': 'main',
        'message': "Recovery snapshot before update install failed",
        'context': {
          'reason': _0x1f6e6f["reason"] || '',
          'error': _0x1f6e6f["error"] || ''
        }
      });
    } catch (_0x253bb5) {
      _0x4591b3({
        'type': "updater.recovery_snapshot_before_install_failed",
        'level': "warn",
        'source': "main",
        'message': "Recovery snapshot before update install failed",
        'error': _0x253bb5
      });
    }
  }
  async function _0x83ab33() {
    let _0x2c3370 = null;
    try {
      await Promise['race']([Promise["resolve"]()["then"](() => _0x427a7e()), new Promise((_0x155dde, _0x4a5045) => {
        _0x2c3370 = setTimeout(() => {
          const _0x4ed18e = new Error("Chrome shell startup did not settle before update install");
          _0x4ed18e["code"] = "UPDATE_CHROME_SHELL_STARTUP_SETTLE_TIMEOUT";
          _0x4a5045(_0x4ed18e);
        }, _0x30ea00);
      })]);
    } finally {
      if (_0x2c3370 !== null) {
        clearTimeout(_0x2c3370);
      }
    }
  }
  async function _0x4b5997() {
    _0x23b9d5();
    try {
      _0x4591b3({
        'type': "updater.prepare_install",
        'level': "info",
        'source': "main",
        'message': "Preparing application for update install"
      });
      await _0x83ab33();
      await _0x79bab7();
      try {
        _0x934a25();
      } catch (_0x3a79c7) {
        console["warn"]("[electron] failed to destroy screenshot overlay before update:", _0x3a79c7);
      }
      try {
        _0xb8af1e();
      } catch (_0x2c9b79) {
        console["warn"]('[electron]\x20failed\x20to\x20stop\x20power\x20save\x20blockers\x20before\x20update:', _0x2c9b79);
      }
      await _0x152abe();
      const _0x2b9a93 = await _0x5031da();
      if (!_0x2b9a93) {
        _0x4591b3({
          'type': "updater.backend_stop_timeout",
          'level': "warn",
          'source': "main",
          'message': "Backend process did not exit before update install"
        });
        const _0xe15784 = new Error("Backend process did not exit before update install");
        _0xe15784["code"] = "UPDATE_BACKEND_STOP_TIMEOUT";
        throw _0xe15784;
      }
    } catch (_0x5d58bc) {
      try {
        _0x32af0f();
      } catch (_0x179aab) {
        console["warn"]("[electron] failed to reset update quit state:", _0x179aab);
      }
      throw _0x5d58bc;
    }
  }
  return {
    'prepareForUpdateInstall': _0x4b5997,
    'stopSpawnedServerForUpdate': _0x11a88c
  };
}
export const __updateInstallPreparationForTest = {
  'terminateProcessTree': terminateProcessTree
};