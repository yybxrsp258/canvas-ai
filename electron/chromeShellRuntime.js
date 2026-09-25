import { controlChromeShellLaunchWindow, launchChromeShellWithLifecycle, normalizeChromeShellSpawnError, prepareChromeShellTaskbarIdentity } from './chromeShellLauncher.js';
import { launchChromeBrowserWorker } from './chromeBrowserWorker.js';
import { createChromeCdpPipeClient } from './chromeCdpPipeClient.js';
import { createChromeShellWebPreviewManager } from './chromeShellWebPreviewManager.js';
const BROWSER_NODE_MODE_ENV = "AIC_CHROME_BROWSER_NODE_MODE";
const BROWSER_NODE_MODES = new Set(["eager", "lazy", "off"]);
function resolveBrowserNodeMode(_0x4f51fc = process['env']) {
  const _0x17616e = String(_0x4f51fc?.[BROWSER_NODE_MODE_ENV] || '')["trim"]()["toLowerCase"]();
  return BROWSER_NODE_MODES["has"](_0x17616e) ? _0x17616e : "lazy";
}
function shouldKeepWebPreviewView(_0x143cd4 = {}) {
  return _0x143cd4?.["visible"] === !![] || _0x143cd4?.["selected"] === !![] || _0x143cd4?.["fullscreen"] === !![] || _0x143cd4?.['pendingPopup'] === !![];
}
function createDeferredWebPreviewRuntime({
  browserPath: _0x1f74c5,
  mainProfileDir: _0xd45bd8,
  env: _0x5e9eb1,
  logEvent: _0x3ba848,
  launchBrowserWorker: _0x467c93,
  createCdpClient: _0x380692,
  createWebPreviewManager: _0xf3651b,
  mode: _0x1fb43c
} = {}) {
  let _0x47f6a5 = null;
  let _0x4c474d = null;
  let _0x29ccc8 = null;
  let _0x179ffc = ![];
  const _0x49c418 = () => ({
    'ok': !![],
    'count': 0x0,
    'visibleCount': 0x0
  });
  const _0x26424d = () => ({
    'ok': ![],
    'error': 'browser-node-disabled'
  });
  async function _0x5d4f67() {
    if (_0x179ffc) {
      return null;
    }
    if (_0x4c474d) {
      return _0x4c474d;
    }
    if (_0x1fb43c === "off") {
      return null;
    }
    if (_0x29ccc8) {
      return _0x29ccc8;
    }
    _0x29ccc8 = Promise["resolve"]()["then"](() => {
      if (_0x179ffc) {
        return null;
      }
      const _0x55eda7 = _0x467c93({
        'browserPath': _0x1f74c5,
        'mainProfileDir': _0xd45bd8,
        'env': _0x5e9eb1,
        'onError': _0xe07613 => _0x3ba848?.({
          'type': 'chrome_web_preview.worker_error',
          'level': "error",
          'source': "main",
          'message': "Chrome browser node worker failed",
          'error': _0xe07613
        })
      });
      _0x47f6a5 = _0x55eda7;
      if (!_0x55eda7?.['devToolsPipe']) {
        _0x3ba848?.({
          'type': "chrome_web_preview.pipe_unavailable",
          'level': "error",
          'source': "main",
          'message': "Chrome browser node pipe is unavailable"
        });
        return null;
      }
      const _0x426a5b = _0x380692({
        ..._0x55eda7["devToolsPipe"],
        'logEvent': _0x3ba848
      });
      _0x4c474d = _0xf3651b({
        'client': _0x426a5b,
        'logEvent': _0x3ba848
      });
      return _0x4c474d;
    })["finally"](() => {
      _0x29ccc8 = null;
    });
    return _0x29ccc8;
  }
  const _0xea0abc = {
    async 'syncViews'(_0x280e11 = {}) {
      const _0xd96e5a = Array["isArray"](_0x280e11?.["views"]) ? _0x280e11['views'] : [];
      const _0x688bef = _0xd96e5a["filter"](shouldKeepWebPreviewView);
      const _0x58b6b5 = {
        ..._0x280e11,
        'views': _0x688bef
      };
      if (_0x4c474d) {
        return _0x4c474d['syncViews'](_0x58b6b5);
      }
      if (_0x688bef["length"] === 0x0) {
        return _0x49c418();
      }
      const _0x19a5aa = await _0x5d4f67();
      if (!_0x19a5aa) {
        return _0x1fb43c === "off" ? _0x26424d() : {
          'ok': ![],
          'error': "browser-node-unavailable"
        };
      }
      return _0x19a5aa["syncViews"](_0x58b6b5);
    },
    async 'disposeViews'(_0x38888c = {}) {
      if (!_0x4c474d) {
        return {
          'ok': !![],
          'disposed': 0x0
        };
      }
      return _0x4c474d["disposeViews"](_0x38888c);
    },
    async 'controlView'(_0x4c3d53 = {}) {
      const _0x24283f = await _0x5d4f67();
      if (!_0x24283f) {
        return _0x1fb43c === 'off' ? _0x26424d() : {
          'ok': ![],
          'error': "browser-node-unavailable"
        };
      }
      return _0x24283f["controlView"](_0x4c3d53);
    },
    'consumeEvents'() {
      return _0x4c474d?.['consumeEvents']?.() || [];
    },
    'waitForEvents'(_0x121107 = {}) {
      if (_0x4c474d) {
        return _0x4c474d["waitForEvents"]?.(_0x121107) || _0x4c474d['consumeEvents']?.() || [];
      }
      if (_0x179ffc) {
        return Promise["resolve"]([]);
      }
      const _0x250bdc = Number(_0x121107?.["waitMs"]);
      const _0x2ec69e = Number["isFinite"](_0x250bdc) ? Math['max'](0x32, Math['min'](0x9c4, _0x250bdc)) : 0x3e8;
      return new Promise(_0x37d3a1 => setTimeout(_0x37d3a1, _0x2ec69e, []));
    },
    async 'dispose'() {
      if (_0x179ffc) {
        return;
      }
      _0x179ffc = !![];
      try {
        await _0x29ccc8;
      } catch {}
      await _0x4c474d?.['dispose']?.();
      _0x4c474d = null;
      _0x47f6a5?.["dispose"]?.();
      _0x47f6a5 = null;
    },
    '_getEntry'(_0x20fb3c, _0x427d25) {
      return _0x4c474d?.["_getEntry"]?.(_0x20fb3c, _0x427d25) || null;
    }
  };
  return {
    'facade': _0xea0abc,
    'ensureRuntime': _0x5d4f67,
    'getBrowserWorker': () => _0x47f6a5
  };
}
export async function startChromeShellRuntime({
  app: _0x28e47a,
  appUrl: _0x1a4bf6,
  env = process["env"],
  platform = process['platform'],
  windowsTaskbarIdentity = null,
  displayWorkAreas = null,
  desktopHttpBridge = null,
  startHttpBridge: _0x58650f,
  token: _0x1f185c,
  handlers: _0x42e09f,
  prepare = null,
  logEvent = null,
  onClosed = null,
  launchShell = launchChromeShellWithLifecycle,
  launchBrowserWorker = launchChromeBrowserWorker,
  createCdpClient = createChromeCdpPipeClient,
  createWebPreviewManager = createChromeShellWebPreviewManager,
  waitForRendererReady = null,
  controlShellWindow = controlChromeShellLaunchWindow,
  closeShellLaunch = null
} = {}) {
  const _0x2800d7 = launchShell === launchChromeShellWithLifecycle && windowsTaskbarIdentity ? prepareChromeShellTaskbarIdentity({
    'app': _0x28e47a,
    'env': env,
    'platform': platform,
    'windowsTaskbarIdentity': windowsTaskbarIdentity,
    'logEvent': logEvent
  }) : null;
  let _0x1d31cd = desktopHttpBridge;
  let _0x1309fa = ![];
  if (!_0x1d31cd) {
    if (typeof _0x58650f !== 'function') {
      throw new TypeError("Chrome shell desktop bridge factory is required");
    }
    _0x1d31cd = await _0x58650f({
      'token': _0x1f185c,
      'handlers': _0x42e09f,
      'logEvent': logEvent
    });
    _0x1309fa = !![];
    env["AIC_DESKTOP_BRIDGE_URL"] = _0x1d31cd["url"];
    env['AIC_DESKTOP_BRIDGE_TOKEN'] = _0x1d31cd["token"];
  }
  let _0xf11477 = null;
  let _0x3893c8 = null;
  let _0x4c1476 = null;
  let _0x5b75d3 = typeof waitForRendererReady !== 'function';
  let _0x412aa9 = ![];
  let _0x369734 = null;
  const _0x220ef4 = _0x5b75d3 ? null : new Promise((_0xfd25c5, _0x2279de) => {
    _0x369734 = _0x2279de;
  });
  void _0x220ef4?.['catch'](() => {});
  let _0x1b8865 = "prepare";
  try {
    const _0x504615 = await prepare?.();
    const _0x786009 = typeof _0x504615?.["appUrl"] === "string" && _0x504615["appUrl"]["trim"]() ? _0x504615["appUrl"] : _0x1a4bf6;
    _0x1b8865 = "launch";
    _0x4c1476 = await launchShell({
      'app': _0x28e47a,
      'appUrl': _0x786009,
      'env': env,
      'platform': platform,
      'windowsTaskbarIdentity': windowsTaskbarIdentity,
      'windowsTaskbarIdentityPreparation': _0x2800d7,
      'displayWorkAreas': displayWorkAreas,
      'logEvent': logEvent,
      'onClosed': _0x3c55f2 => {
        if (_0x3c55f2?.["detached"] === !![]) {
          _0x412aa9 = !![];
          if (_0x4c1476) {
            _0x4c1476["detached"] = !![];
          }
          return ![];
        }
        void _0xf11477?.['dispose']?.();
        _0xf11477 = null;
        if (!_0x5b75d3) {
          const _0x4ffede = new Error("Chrome shell exited before the renderer completed startup");
          _0x4ffede["code"] = _0x3c55f2?.["code"] === 0x0 && !_0x3c55f2?.["signal"] ? "CHROME_SHELL_STARTUP_CANCELLED" : "CHROME_SHELL_EXITED_BEFORE_READY";
          _0x4ffede["details"] = _0x3c55f2;
          logEvent?.({
            'type': "chrome_shell.exited_before_renderer_ready",
            'level': _0x4ffede['code'] === 'CHROME_SHELL_STARTUP_CANCELLED' ? 'info' : "error",
            'source': "main",
            'message': _0x4ffede["message"],
            'error': _0x4ffede,
            'context': _0x3c55f2
          });
          _0x369734?.(_0x4ffede);
          return ![];
        }
        return onClosed?.(_0x3c55f2);
      },
      'onLaunchError': _0x451618 => {
        const _0x4c4227 = normalizeChromeShellSpawnError(_0x451618);
        if (_0x4c1476) {
          _0x4c1476["spawnError"] = _0x4c4227;
        }
        if (!_0x5b75d3) {
          _0x369734?.(_0x4c4227);
        }
        return ![];
      }
    });
    if (_0x412aa9) {
      _0x4c1476["detached"] = !![];
    }
    if (_0x4c1476?.["spawnError"]) {
      throw normalizeChromeShellSpawnError(_0x4c1476["spawnError"]);
    }
    if (typeof waitForRendererReady === "function") {
      _0x1b8865 = "renderer-ready";
      const _0x418560 = await Promise["race"]([waitForRendererReady({
        'launch': _0x4c1476
      }), _0x220ef4]);
      _0x5b75d3 = !![];
      logEvent?.({
        'type': 'chrome_shell.renderer_ready',
        'level': 'info',
        'source': "main",
        'message': "Chrome shell renderer completed startup",
        'context': {
          'browserPath': _0x4c1476["browserPath"],
          'profileDir': _0x4c1476['profileDir'],
          'elapsedMs': Number(_0x418560?.['elapsedMs'] || 0x0)
        }
      });
    }
    _0x4c1476?.["startupDiagnostics"]?.["stop"]?.();
    _0x1b8865 = 'browser-node';
    const _0x290939 = resolveBrowserNodeMode(env);
    _0x3893c8 = createDeferredWebPreviewRuntime({
      'browserPath': _0x4c1476["browserPath"],
      'mainProfileDir': _0x4c1476['profileDir'],
      'env': env,
      'logEvent': logEvent,
      'launchBrowserWorker': launchBrowserWorker,
      'createCdpClient': createCdpClient,
      'createWebPreviewManager': createWebPreviewManager,
      'mode': _0x290939
    });
    _0xf11477 = _0x3893c8["facade"];
    _0x290939 === "eager" && (await _0x3893c8["ensureRuntime"]());
    return {
      'chromeShellLaunch': _0x4c1476,
      'browserWorker': _0x3893c8["getBrowserWorker"](),
      'desktopHttpBridge': _0x1d31cd,
      'webPreviewManager': _0xf11477
    };
  } catch (_0x9c750b) {
    const _0x3df022 = _0x9c750b?.["code"] === "AIC_DESKTOP_STARTUP_CANCELLED";
    logEvent?.({
      'type': _0x3df022 ? "chrome_shell.startup_cancelled" : "chrome_shell.startup_failed",
      'level': _0x3df022 ? 'info' : "error",
      'source': "main",
      'message': _0x3df022 ? "Chrome shell startup cancelled during shutdown" : "Chrome shell startup failed before cleanup",
      'error': _0x9c750b,
      'context': {
        'stage': _0x1b8865,
        'pid': _0x4c1476?.["process"]?.["pid"] ?? null,
        'exitCode': _0x4c1476?.["process"]?.["exitCode"] ?? null,
        'signalCode': _0x4c1476?.["process"]?.["signalCode"] ?? null,
        'detached': _0x4c1476?.["detached"] === !![],
        'browserPath': _0x4c1476?.["browserPath"] || '',
        'profileDir': _0x4c1476?.['profileDir'] || '',
        ..._0x4c1476?.["startupDiagnostics"]?.["snapshot"]?.()
      }
    });
    _0x4c1476?.["startupDiagnostics"]?.['stop']?.();
    (await _0x2800d7)?.["cancel"]?.();
    await _0xf11477?.['dispose']?.();
    let _0x42a059 = ![];
    if (_0x4c1476 && typeof closeShellLaunch === 'function') {
      try {
        _0x42a059 = await closeShellLaunch({
          'launch': _0x4c1476,
          'env': env,
          'platform': platform
        });
      } catch {}
      logEvent?.({
        'type': "chrome_shell.launch_close_after_startup_failure",
        'level': _0x42a059 ? "info" : "warn",
        'source': "main",
        'message': _0x42a059 ? "Chrome shell close completed; profile release is not confirmed" : 'Chrome\x20shell\x20process\x20tree\x20could\x20not\x20be\x20confirmed\x20closed\x20after\x20startup\x20failure',
        'context': {
          'closed': _0x42a059
        }
      });
    }
    if (!_0x42a059 && _0x4c1476?.['detached'] === !![]) {
      let _0x4b9e54 = ![];
      try {
        _0x4b9e54 = await controlShellWindow({
          'launch': _0x4c1476,
          'action': 'close',
          'env': env,
          'platform': platform
        });
      } catch {}
      logEvent?.({
        'type': "chrome_shell.detached_window_close_after_startup_failure",
        'level': _0x4b9e54 ? "info" : "warn",
        'source': "main",
        'message': _0x4b9e54 ? 'Detached\x20Chrome\x20shell\x20window\x20closed\x20after\x20startup\x20failure' : "Detached Chrome shell window could not be closed after startup failure",
        'context': {
          'closed': _0x4b9e54
        }
      });
    } else {
      !_0x42a059 && _0x4c1476?.["process"]?.["kill"]?.();
    }
    if (_0x1309fa) {
      try {
        await _0x1d31cd?.["close"]?.();
      } catch {}
    }
    throw _0x9c750b;
  }
}
export const __chromeShellRuntimeForTest = {
  'BROWSER_NODE_MODE_ENV': BROWSER_NODE_MODE_ENV,
  'resolveBrowserNodeMode': resolveBrowserNodeMode,
  'shouldKeepWebPreviewView': shouldKeepWebPreviewView
};