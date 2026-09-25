import { post } from '../../api/apiBase.js';
import { deferredMediaPreview, withDeferredMediaFiles } from '../../api/deferredMediaApi.js';
import { CHROME_SHELL_STARTUP_READY_EVENT } from './chromeShellStartupReadiness.js';
const LOOPBACK_HOSTS = new Set(['localhost', "127.0.0.1", "::1", "[::1]"]);
const LONG_DESKTOP_REQUEST_TIMEOUT_MS = 0x1e * 0x3c * 0x3e8;
const CHROME_SHELL_STARTUP_READY_REQUEST_TIMEOUT_MS = 0x5dc;
const CHROME_SHELL_STARTUP_READY_PATH = "/api/v2/desktop/diagnostics/log-event";
const LONG_DESKTOP_REQUEST_PATHS = new Set(['/api/v2/desktop/project/export-package', "/api/v2/desktop/project/import-package", "/api/v2/desktop/node-export/save-media", '/api/v2/desktop/node-export/save-media-files', "/api/v2/desktop/node-export/save-timeline", "/api/v2/desktop/asset/import", "/api/v2/desktop/agent-skills/install-folder"]);
function getWindowObject() {
  return globalThis['window'] || null;
}
function getElectronApi() {
  const _0x5d735f = getWindowObject()?.["electronAPI"] || null;
  return _0x5d735f?.["__aicDesktopHttpShim"] === !![] ? null : _0x5d735f;
}
function getDesktopApi() {
  const _0x149818 = getWindowObject()?.["aiCanvasDesktop"] || null;
  return _0x149818?.['__aicDesktopHttpShim'] === !![] ? null : _0x149818;
}
function isFunction(_0x3125d3) {
  return typeof _0x3125d3 === "function";
}
function isLoopbackAppOrigin() {
  try {
    const _0x46637d = globalThis['location'];
    if (!_0x46637d || !/^https?:$/i["test"](String(_0x46637d["protocol"] || ''))) {
      return ![];
    }
    return LOOPBACK_HOSTS["has"](String(_0x46637d["hostname"] || '')['toLowerCase']());
  } catch {
    return ![];
  }
}
function hasChromeShellRuntimeHint() {
  const _0x2c492c = getWindowObject();
  if (_0x2c492c?.['__AIC_CHROME_SHELL__'] || _0x2c492c?.["__AIC_DESKTOP_HTTP_BRIDGE__"]) {
    return !![];
  }
  try {
    const _0x5ca43a = new URLSearchParams(globalThis["location"]?.["search"] || '');
    return String(_0x5ca43a["get"]("aicRuntime") || '')["toLowerCase"]() === "chrome-shell";
  } catch {
    return ![];
  }
}
function normalizeHttpBridgeResult(_0x172020) {
  if (!_0x172020?.["success"]) {
    throw new Error(_0x172020?.["error"] || 'Desktop\x20bridge\x20request\x20failed');
  }
  const _0x1cd177 = _0x172020["data"];
  if (!_0x1cd177 || typeof _0x1cd177 !== "object" || !Object["prototype"]["hasOwnProperty"]["call"](_0x1cd177, 'success')) {
    return _0x1cd177;
  }
  if (_0x1cd177["success"] === ![] && _0x1cd177["canceled"] === !![]) {
    return _0x1cd177;
  }
  if (_0x1cd177["success"] === ![]) {
    throw new Error(_0x1cd177['error'] || _0x1cd177['message'] || 'Desktop\x20bridge\x20request\x20failed');
  }
  if (Object["prototype"]["hasOwnProperty"]["call"](_0x1cd177, 'data')) {
    return _0x1cd177['data'];
  }
  return _0x1cd177;
}
function resolveDesktopBridgeRequestTimeout(_0x28c91d, _0xe8bfc = {}) {
  if (String(_0x28c91d || '') === CHROME_SHELL_STARTUP_READY_PATH && _0xe8bfc?.["type"] === CHROME_SHELL_STARTUP_READY_EVENT) {
    return CHROME_SHELL_STARTUP_READY_REQUEST_TIMEOUT_MS;
  }
  return LONG_DESKTOP_REQUEST_PATHS["has"](String(_0x28c91d || '')) ? LONG_DESKTOP_REQUEST_TIMEOUT_MS : undefined;
}
async function postDesktopBridge(_0x595108, _0x41201f = {}) {
  return normalizeHttpBridgeResult(await post(_0x595108, _0x41201f, resolveDesktopBridgeRequestTimeout(_0x595108, _0x41201f)));
}
async function normalizeDesktopHttpPayload(_0x35ba91) {
  if (_0x35ba91 instanceof ArrayBuffer) {
    return Array["from"](new Uint8Array(_0x35ba91));
  }
  if (ArrayBuffer["isView"](_0x35ba91)) {
    return Array['from'](new Uint8Array(_0x35ba91["buffer"], _0x35ba91['byteOffset'], _0x35ba91['byteLength']));
  }
  if (typeof Blob !== "undefined" && _0x35ba91 instanceof Blob) {
    return Array["from"](new Uint8Array(await _0x35ba91["arrayBuffer"]()));
  }
  if (Array["isArray"](_0x35ba91)) {
    return Promise["all"](_0x35ba91["map"](_0x519d21 => normalizeDesktopHttpPayload(_0x519d21)));
  }
  if (!_0x35ba91 || typeof _0x35ba91 !== 'object') {
    return _0x35ba91;
  }
  const _0x52967c = await Promise['all'](Object['entries'](_0x35ba91)["map"](async ([_0x545c1f, _0x409bbf]) => [_0x545c1f, await normalizeDesktopHttpPayload(_0x409bbf)]));
  return Object["fromEntries"](_0x52967c);
}
function chromeShellPost(_0x23f011, _0x453835 = {}) {
  if (!desktopBridge['isChromeShell']) {
    return undefined;
  }
  return normalizeDesktopHttpPayload(_0x453835)["then"](_0x136008 => postDesktopBridge(_0x23f011, _0x136008));
}
function chromeShellPostOperationResult(_0x2552d5, _0x4f4a26 = {}) {
  if (!desktopBridge['isChromeShell']) {
    return undefined;
  }
  return normalizeDesktopHttpPayload(_0x4f4a26)["then"](async _0x2bbc3d => {
    const _0x5644a0 = await post(_0x2552d5, _0x2bbc3d, resolveDesktopBridgeRequestTimeout(_0x2552d5, _0x2bbc3d));
    if (!_0x5644a0?.["success"]) {
      throw new Error(_0x5644a0?.["error"] || 'Desktop\x20bridge\x20request\x20failed');
    }
    const _0x1357dd = _0x5644a0["data"];
    if (_0x1357dd?.["success"] === ![]) {
      throw new Error(_0x1357dd?.["error"] || "Desktop bridge request failed");
    }
    return _0x1357dd && Object["prototype"]["hasOwnProperty"]['call'](_0x1357dd, "data") ? _0x1357dd['data'] : _0x1357dd;
  });
}
async function writeChromeShellRecoverySnapshotBeforeInstall() {
  if (!desktopBridge["isChromeShell"]) {
    return null;
  }
  const _0x1ac2f2 = getWindowObject()?.["__aiCanvasWriteRecoverySnapshotForClose"];
  if (typeof _0x1ac2f2 !== 'function') {
    return null;
  }
  return _0x1ac2f2("update-install");
}
function createLatestOnlyChromeShellPoster(_0x23efe4) {
  let _0x1a82b4 = null;
  let _0x4e1b47 = null;
  const _0x2a3a52 = async () => {
    try {
      while (_0x1a82b4) {
        const _0x5cb6a5 = _0x1a82b4;
        _0x1a82b4 = null;
        await chromeShellPost(_0x23efe4, _0x5cb6a5);
      }
      return {
        'ok': !![]
      };
    } finally {
      _0x4e1b47 = null;
    }
  };
  return (_0x3ebe7c = {}) => {
    _0x1a82b4 = _0x3ebe7c;
    if (!_0x4e1b47) {
      _0x4e1b47 = _0x2a3a52();
    }
    return _0x4e1b47;
  };
}
let chromeShellUnsavedStatePoster = null;
function postChromeShellUnsavedState(_0x436428) {
  if (!desktopBridge["isChromeShell"]) {
    return undefined;
  }
  !chromeShellUnsavedStatePoster && (chromeShellUnsavedStatePoster = createLatestOnlyChromeShellPoster("/api/v2/desktop/project/set-unsaved-state"));
  return chromeShellUnsavedStatePoster(_0x436428);
}
function subscribeByPolling(_0x57c220, _0x2db7fc, {
  intervalMs = 0x3e8,
  extractItems = _0x504ea2 => _0x504ea2,
  getKey = _0x4d087c => JSON["stringify"](_0x4d087c)
} = {}) {
  if (!desktopBridge["isChromeShell"] || typeof _0x2db7fc !== "function") {
    return () => {};
  }
  let _0x323a08 = ![];
  const _0x398c96 = new Map();
  const _0x3965f0 = async () => {
    if (_0x323a08) {
      return;
    }
    try {
      const _0x4fe2a3 = await _0x57c220();
      if (_0x323a08) {
        return;
      }
      const _0x333cf5 = extractItems(_0x4fe2a3);
      if (Array["isArray"](_0x333cf5)) {
        for (const _0x353488 of _0x333cf5) {
          if (_0x323a08) {
            break;
          }
          const _0x29532e = getKey(_0x353488);
          const _0x33b01c = JSON["stringify"](_0x353488 || {});
          if (_0x398c96['get'](_0x29532e) === _0x33b01c) {
            continue;
          }
          _0x398c96['set'](_0x29532e, _0x33b01c);
          _0x2db7fc(_0x353488);
        }
      } else {
        if (_0x333cf5 && typeof _0x333cf5 === "object") {
          const _0x1a3096 = getKey(_0x333cf5);
          const _0xa7305 = JSON["stringify"](_0x333cf5 || {});
          _0x398c96["get"](_0x1a3096) !== _0xa7305 && (_0x398c96["set"](_0x1a3096, _0xa7305), _0x2db7fc(_0x333cf5));
        }
      }
    } catch {}
    if (!_0x323a08) {
      setTimeout(_0x3965f0, intervalMs);
    }
  };
  setTimeout(_0x3965f0, 0x0);
  return () => {
    _0x323a08 = !![];
  };
}
function subscribeToConsumedBatch(_0x438de3, _0x3cbf80, {
  intervalMs = 0x1f4
} = {}) {
  if (!desktopBridge["isChromeShell"] || typeof _0x3cbf80 !== "function") {
    return () => {};
  }
  let _0x22bac9 = ![];
  const _0x8e9852 = async () => {
    if (_0x22bac9) {
      return;
    }
    try {
      const _0x2be759 = await _0x438de3();
      if (_0x22bac9) {
        return;
      }
      if (Array["isArray"](_0x2be759) && _0x2be759["length"] > 0x0) {
        _0x3cbf80(_0x2be759);
      }
    } catch {}
    if (!_0x22bac9) {
      setTimeout(_0x8e9852, intervalMs);
    }
  };
  setTimeout(_0x8e9852, 0x0);
  return () => {
    _0x22bac9 = !![];
  };
}
function updaterEventFromStateSnapshot(_0x21820f = {}) {
  if (!_0x21820f || typeof _0x21820f !== "object") {
    return null;
  }
  if (typeof _0x21820f["type"] === 'string' && _0x21820f["type"]) {
    return _0x21820f;
  }
  if (_0x21820f['latestEvent'] && typeof _0x21820f['latestEvent']["type"] === "string") {
    return _0x21820f['latestEvent'];
  }
  const _0x22d79d = String(_0x21820f["state"] || '');
  if (!_0x22d79d || _0x22d79d === 'idle') {
    return null;
  }
  const _0x2a20a2 = {
    'checking': "checking",
    'available': 'available',
    'downloading': 'download-started',
    'downloaded': "downloaded",
    'error': "download-failed",
    'installing': 'installing'
  };
  const _0x553a60 = _0x2a20a2[_0x22d79d];
  if (!_0x553a60) {
    return null;
  }
  return {
    'type': _0x553a60,
    'state': _0x22d79d,
    'info': _0x21820f["latestInfo"] || null,
    'retryCount': Number(_0x21820f["retryCount"] || 0x0),
    'maxRetries': Number(_0x21820f["maxRetries"] || 0x0)
  };
}
function subscribeToUpdaterState(_0x2b6385, _0x56d75d, _0x5b74c3 = subscribeByPolling) {
  if (typeof _0x56d75d !== "function") {
    return () => {};
  }
  return _0x5b74c3(_0x2b6385, _0x1efd51 => {
    const _0x1dbf51 = updaterEventFromStateSnapshot(_0x1efd51);
    if (_0x1dbf51) {
      _0x56d75d(_0x1dbf51);
    }
  }, {
    'intervalMs': 0xbb8,
    'getKey': () => "updater-state"
  });
}
function subscribeByLongPolling(_0x9f0c77, _0x46a91b) {
  if (!desktopBridge["isChromeShell"] || typeof _0x46a91b !== 'function') {
    return () => {};
  }
  let _0x1119ec = ![];
  const _0x17a3f0 = _0x65f0e4 => new Promise(_0x460eb6 => setTimeout(_0x460eb6, _0x65f0e4));
  const _0x3c9ca3 = async () => {
    while (!_0x1119ec) {
      let _0x3db1f9 = 0x0;
      try {
        const _0x1f0661 = await _0x9f0c77();
        if (_0x1119ec) {
          break;
        }
        const _0x525226 = Array['isArray'](_0x1f0661) ? _0x1f0661 : [];
        _0x3db1f9 = _0x525226["length"];
        _0x525226["forEach"](_0x269371 => _0x46a91b(_0x269371));
      } catch {
        if (!_0x1119ec) {
          await _0x17a3f0(0xfa);
        }
        continue;
      }
      if (!_0x1119ec && _0x3db1f9 === 0x0) {
        await _0x17a3f0(0x18);
      }
    }
  };
  void _0x3c9ca3();
  return () => {
    _0x1119ec = !![];
  };
}
function getGroup(_0x4cd57e, _0x1f7003) {
  const _0x38fc35 = _0x4cd57e?.[_0x1f7003];
  return _0x38fc35 && typeof _0x38fc35 === 'object' ? _0x38fc35 : null;
}
function unavailable(_0x29fc95) {
  return () => {
    throw new Error(_0x29fc95 + " unavailable");
  };
}
const syncChromeShellWebPreviewViews = createLatestOnlyChromeShellPoster('/api/v2/desktop/web-preview/sync-views');
export const desktopBridge = {
  get 'usesHttpCompat'() {
    const _0x5bcfc6 = getWindowObject();
    return _0x5bcfc6?.["electronAPI"]?.["__aicDesktopHttpShim"] === !![] || _0x5bcfc6?.["aiCanvasDesktop"]?.["__aicDesktopHttpShim"] === !![] || desktopBridge["isChromeShell"];
  },
  get 'isElectron'() {
    return !!getDesktopApi()?.['isElectron'] || !!getElectronApi();
  },
  get 'isChromeShell'() {
    return !getElectronApi() && isLoopbackAppOrigin() && hasChromeShellRuntimeHint();
  },
  'app': {
    'isAvailable'() {
      return !!getDesktopApi() || desktopBridge["isChromeShell"];
    },
    'getAppVersion': (..._0x584a65) => getDesktopApi()?.["getAppVersion"]?.(..._0x584a65) ?? chromeShellPost("/api/v2/desktop/app/get-version", _0x584a65[0x0]) ?? Promise["resolve"](''),
    'getDeviceId': (..._0x4d4887) => getDesktopApi()?.["getDeviceId"]?.(..._0x4d4887) ?? chromeShellPost("/api/v2/desktop/app/get-device-id", _0x4d4887[0x0]) ?? Promise["resolve"](''),
    'checkForUpdates': (..._0x510804) => getDesktopApi()?.['checkForUpdates']?.(..._0x510804) ?? chromeShellPost('/api/v2/desktop/app/check-for-updates', _0x510804[0x0]) ?? Promise['resolve'](null),
    'getUpdateState': (..._0x348d03) => getDesktopApi()?.['getUpdateState']?.(..._0x348d03) ?? chromeShellPost("/api/v2/desktop/app/update-state", _0x348d03[0x0]) ?? Promise['resolve'](null),
    'downloadUpdate': (..._0x21e688) => getDesktopApi()?.["downloadUpdate"]?.(..._0x21e688) ?? chromeShellPost('/api/v2/desktop/app/download-update', _0x21e688[0x0]) ?? Promise["resolve"](null),
    'cancelUpdateDownload': (..._0x4eacb9) => getDesktopApi()?.["cancelUpdateDownload"]?.(..._0x4eacb9) ?? chromeShellPost('/api/v2/desktop/app/cancel-update-download', _0x4eacb9[0x0]) ?? Promise["resolve"](null),
    'installDownloadedUpdate': async (..._0x35de9a) => {
      await writeChromeShellRecoverySnapshotBeforeInstall();
      return getDesktopApi()?.["installDownloadedUpdate"]?.(..._0x35de9a) ?? chromeShellPost('/api/v2/desktop/app/install-downloaded-update', _0x35de9a[0x0]) ?? null;
    },
    'onUpdaterEvent': _0x175973 => getDesktopApi()?.["onUpdaterEvent"]?.(_0x175973) || subscribeToUpdaterState(() => desktopBridge["app"]["getUpdateState"](), _0x175973)
  },
  'project': {
    get 'api'() {
      return getGroup(getElectronApi(), 'project');
    },
    'isAvailable'() {
      return !!desktopBridge["project"]["api"] || desktopBridge["isChromeShell"];
    },
    'open': (..._0x381990) => desktopBridge["project"]["api"]?.["open"]?.(..._0x381990) ?? chromeShellPost('/api/v2/desktop/project/open', _0x381990[0x0]),
    'save': (..._0x2573e5) => desktopBridge["project"]["api"]?.["save"]?.(..._0x2573e5) ?? chromeShellPost("/api/v2/desktop/project/save", _0x2573e5[0x0]),
    'exportPackage': (..._0x2427b4) => withDeferredMediaFiles(_0x2427b4, () => desktopBridge['project']['api']?.["exportPackage"]?.(..._0x2427b4) ?? chromeShellPost("/api/v2/desktop/project/export-package", _0x2427b4[0x0])),
    'importPackage': (..._0x2a5712) => desktopBridge['project']['api']?.['importPackage']?.(..._0x2a5712) ?? chromeShellPost("/api/v2/desktop/project/import-package", _0x2a5712[0x0]),
    'listRecent': (..._0x2f75ed) => desktopBridge["project"]["api"]?.["listRecent"]?.(..._0x2f75ed) ?? chromeShellPost('/api/v2/desktop/project/list-recent', _0x2f75ed[0x0]),
    'removeRecent': (..._0x381318) => desktopBridge["project"]["api"]?.["removeRecent"]?.(..._0x381318) ?? chromeShellPost("/api/v2/desktop/project/remove-recent", _0x381318[0x0]),
    'clearRecoverySnapshot': (..._0x53c055) => desktopBridge["project"]['api']?.["clearRecoverySnapshot"]?.(..._0x53c055) ?? chromeShellPost("/api/v2/desktop/project/clear-recovery-snapshot", _0x53c055[0x0]),
    'writeRecoverySnapshot': (..._0x2d22e9) => desktopBridge['project']['api']?.['writeRecoverySnapshot']?.(..._0x2d22e9) ?? chromeShellPost("/api/v2/desktop/project/write-recovery-snapshot", _0x2d22e9[0x0]),
    'getRecoverySnapshotInfo': (..._0x15c77e) => desktopBridge['project']["api"]?.['getRecoverySnapshotInfo']?.(..._0x15c77e) ?? chromeShellPost("/api/v2/desktop/project/get-recovery-snapshot-info", _0x15c77e[0x0]),
    'readRecoverySnapshot': (..._0x1757a2) => desktopBridge['project']['api']?.["readRecoverySnapshot"]?.(..._0x1757a2) ?? chromeShellPost("/api/v2/desktop/project/read-recovery-snapshot", _0x1757a2[0x0]),
    'setUnsavedState': (..._0x2a4b84) => desktopBridge["project"]["api"]?.["setUnsavedState"]?.(..._0x2a4b84) ?? postChromeShellUnsavedState(_0x2a4b84[0x0]),
    'consumeExternalOpenRequests': (..._0xb796d5) => desktopBridge['project']["api"]?.["consumeExternalOpenRequests"]?.(..._0xb796d5) ?? chromeShellPost("/api/v2/desktop/project/consume-external-open-requests", _0xb796d5[0x0]),
    'onExternalOpen': _0x576399 => desktopBridge['project']["api"]?.["onExternalOpen"]?.(_0x576399) || subscribeToConsumedBatch(() => chromeShellPost("/api/v2/desktop/project/consume-external-open-requests", {}), _0x576399, {
      'intervalMs': 0x1f4
    }),
    'onPackageProgress': _0x443e41 => desktopBridge["project"]["api"]?.["onPackageProgress"]?.(_0x443e41) || subscribeByPolling(() => chromeShellPost("/api/v2/desktop/project/consume-package-progress-events", {}), _0x443e41, {
      'intervalMs': 0xfa,
      'extractItems': _0x2b3b97 => Array["isArray"](_0x2b3b97) ? _0x2b3b97 : [],
      'getKey': _0x42f912 => String(_0x42f912?.['createdAt'] || _0x42f912?.['operationId'] || JSON["stringify"](_0x42f912 || {}))
    })
  },
  'shell': {
    'isAvailable'() {
      const _0x1a03b1 = getElectronApi();
      return isFunction(_0x1a03b1?.["shell"]?.["openExternal"]) || isFunction(_0x1a03b1?.['openExternal']) || desktopBridge["isChromeShell"];
    },
    'canShowItemInFolder'() {
      return isFunction(getElectronApi()?.["showItemInFolder"]) || desktopBridge["isChromeShell"];
    },
    'canOpenKnownFolder'() {
      return isFunction(getElectronApi()?.['openKnownFolder']) || desktopBridge["isChromeShell"];
    },
    'showItemInFolder': _0x40ada1 => getElectronApi()?.["showItemInFolder"]?.(_0x40ada1) ?? chromeShellPost('/api/v2/desktop/shell/show-item-in-folder', _0x40ada1) ?? unavailable("showItemInFolder")(),
    'openKnownFolder': _0x68c1d3 => getElectronApi()?.["openKnownFolder"]?.(_0x68c1d3) ?? chromeShellPost("/api/v2/desktop/shell/open-known-folder", _0x68c1d3) ?? unavailable('openKnownFolder')(),
    'openExternal'(_0x351d6d) {
      const _0x3979cc = getElectronApi()?.['shell']?.['openExternal'] || getElectronApi()?.["openExternal"];
      if (isFunction(_0x3979cc)) {
        return _0x3979cc(_0x351d6d);
      }
      const _0x42949a = chromeShellPost("/api/v2/desktop/shell/open-external", {
        'url': _0x351d6d
      });
      if (_0x42949a) {
        return _0x42949a;
      }
      if (typeof globalThis["open"] === "function") {
        globalThis["open"](String(_0x351d6d || ''), "_blank", 'noopener,noreferrer');
        return Promise['resolve']({
          'ok': !![],
          'fallback': 'browser'
        });
      }
      return Promise["resolve"]({
        'ok': ![],
        'error': 'openExternal\x20unavailable'
      });
    }
  },
  'mediaPreview': {
    'isAvailable'() {
      return isFunction(getElectronApi()?.["getLocalPreviewUrl"]) || desktopBridge['isChromeShell'];
    },
    async 'getLocalPreviewUrl'(_0x1e9067 = {}) {
      const _0x40f44a = deferredMediaPreview(_0x1e9067);
      if (_0x40f44a) {
        return _0x40f44a;
      }
      const _0x4c0787 = getElectronApi()?.["getLocalPreviewUrl"];
      if (isFunction(_0x4c0787)) {
        return _0x4c0787(_0x1e9067);
      }
      if (!desktopBridge["isChromeShell"]) {
        throw new Error("Local preview bridge unavailable");
      }
      return postDesktopBridge('/api/v2/desktop/local-preview', _0x1e9067);
    }
  },
  'assetImport': {
    'isAvailable'() {
      return !!getElectronApi() || desktopBridge['isChromeShell'];
    },
    'canImportAsset'() {
      return isFunction(getElectronApi()?.["importAsset"]) || desktopBridge["isChromeShell"];
    },
    'canImportRemoteAsset'() {
      return isFunction(getElectronApi()?.["importRemoteAsset"]) || desktopBridge["isChromeShell"];
    },
    'canImportLocalFile'() {
      return isFunction(getElectronApi()?.["importLocalFile"]) || desktopBridge["isChromeShell"];
    },
    'canResolveFilePath'() {
      return !!getElectronApi() || desktopBridge["isChromeShell"];
    },
    'canSubscribeUpdates'() {
      return isFunction(getElectronApi()?.["onAssetUpdated"]) || desktopBridge["isChromeShell"];
    },
    'importAsset': (..._0x337362) => withDeferredMediaFiles(_0x337362, () => getElectronApi()?.["importAsset"]?.(..._0x337362) ?? chromeShellPost("/api/v2/desktop/asset/import", _0x337362[0x0])),
    'importRemoteAsset': (..._0x962ff2) => withDeferredMediaFiles(_0x962ff2, () => getElectronApi()?.["importRemoteAsset"]?.(..._0x962ff2) ?? chromeShellPost("/api/v2/desktop/asset/import-remote", _0x962ff2[0x0])),
    'importLocalFile': (..._0x3d0592) => withDeferredMediaFiles(_0x3d0592, () => getElectronApi()?.["importLocalFile"]?.(..._0x3d0592) ?? chromeShellPost("/api/v2/desktop/file/import-local", _0x3d0592[0x0])),
    'getPathForFile': (..._0x43c710) => getElectronApi()?.["getPathForFile"]?.(..._0x43c710) || '',
    'onAssetUpdated': _0xe0173f => getElectronApi()?.['onAssetUpdated']?.(_0xe0173f) || subscribeByPolling(() => chromeShellPost("/api/v2/desktop/asset/consume-updates", {}), _0xe0173f, {
      'intervalMs': 0x1f4,
      'extractItems': _0x20fa84 => Array["isArray"](_0x20fa84) ? _0x20fa84 : [],
      'getKey': _0x34b977 => String(_0x34b977?.["assetId"] || JSON["stringify"](_0x34b977 || {}))
    })
  },
  'dialog': {
    'isAvailable'() {
      return isFunction(getElectronApi()?.["selectDirectory"]) || desktopBridge["isChromeShell"];
    },
    'selectDirectory': (..._0x5749ba) => getElectronApi()?.['selectDirectory']?.(..._0x5749ba) ?? chromeShellPost("/api/v2/desktop/dialog/select-directory", _0x5749ba[0x0])
  },
  'webPreview': {
    get 'api'() {
      return getGroup(getElectronApi(), "webPreview");
    },
    get 'surfaceMode'() {
      return desktopBridge["webPreview"]["api"]?.["surfaceMode"] || (desktopBridge["isChromeShell"] ? "remote-snapshot" : '');
    },
    'isAvailable'() {
      return isFunction(desktopBridge["webPreview"]['api']?.["syncViews"]) || desktopBridge["isChromeShell"];
    },
    'syncViews': (..._0x436efd) => desktopBridge["webPreview"]['api']?.["syncViews"]?.(..._0x436efd) ?? chromeShellPost("/api/v2/desktop/web-preview/sync-views", _0x436efd[0x0]),
    'syncViewsFast': (..._0x13714e) => desktopBridge['webPreview']["api"]?.["syncViewsFast"]?.(..._0x13714e) ?? desktopBridge["webPreview"]["api"]?.["syncViews"]?.(..._0x13714e) ?? syncChromeShellWebPreviewViews(_0x13714e[0x0]),
    'disposeViews': (..._0x3e8626) => desktopBridge["webPreview"]["api"]?.["disposeViews"]?.(..._0x3e8626) ?? chromeShellPost("/api/v2/desktop/web-preview/dispose-views", _0x3e8626[0x0]),
    'controlView': (..._0x143699) => desktopBridge['webPreview']['api']?.['controlView']?.(..._0x143699) ?? chromeShellPost('/api/v2/desktop/web-preview/control-view', _0x143699[0x0]),
    'onEvent': _0x2073de => desktopBridge["webPreview"]["api"]?.["onEvent"]?.(_0x2073de) || subscribeByLongPolling(() => chromeShellPost('/api/v2/desktop/web-preview/wait-events', {
      'waitMs': 0x3e8
    }), _0x2073de)
  },
  'customAiApps': {
    get 'api'() {
      return getGroup(getElectronApi(), "customAiApps");
    },
    'isAvailable'() {
      return !!desktopBridge["customAiApps"]["api"] || desktopBridge["isChromeShell"];
    },
    'read': (..._0x352862) => desktopBridge["customAiApps"]["api"]?.["read"]?.(..._0x352862) ?? chromeShellPost("/api/v2/desktop/custom-ai-apps/read", _0x352862[0x0]),
    'write': (..._0x32a3bb) => desktopBridge["customAiApps"]["api"]?.["write"]?.(..._0x32a3bb) ?? chromeShellPost("/api/v2/desktop/custom-ai-apps/write", _0x32a3bb[0x0])
  },
  'agentSkills': {
    get 'api'() {
      return getGroup(getElectronApi(), "agentSkills");
    },
    'isAvailable'() {
      return !!desktopBridge["agentSkills"]['api'] || desktopBridge["isChromeShell"];
    },
    'list': (..._0xfe19ad) => desktopBridge["agentSkills"]["api"]?.['list']?.(..._0xfe19ad) ?? chromeShellPostOperationResult("/api/v2/desktop/agent-skills/list", _0xfe19ad[0x0]),
    'openRoot': (..._0x4bc43b) => desktopBridge['agentSkills']['api']?.["openRoot"]?.(..._0x4bc43b) ?? chromeShellPostOperationResult("/api/v2/desktop/agent-skills/open-root", _0x4bc43b[0x0]),
    'installFromFolder': (..._0x48da9f) => desktopBridge['agentSkills']["api"]?.["installFromFolder"]?.(..._0x48da9f) ?? chromeShellPostOperationResult('/api/v2/desktop/agent-skills/install-folder', _0x48da9f[0x0]),
    'saveManaged': (..._0xf4b2ba) => desktopBridge['agentSkills']["api"]?.["saveManaged"]?.(..._0xf4b2ba) ?? chromeShellPostOperationResult("/api/v2/desktop/agent-skills/save-managed", _0xf4b2ba[0x0]),
    'deleteInstalled': (..._0x51be45) => desktopBridge["agentSkills"]["api"]?.["deleteInstalled"]?.(..._0x51be45) ?? chromeShellPostOperationResult("/api/v2/desktop/agent-skills/delete-installed", _0x51be45[0x0])
  },
  'agentInformation': {
    get 'api'() {
      return getGroup(getElectronApi(), 'agentInformation');
    },
    'isAvailable'() {
      return !!desktopBridge["agentInformation"]["api"] || desktopBridge["isChromeShell"];
    },
    'readUrl': (..._0x317279) => desktopBridge['agentInformation']["api"]?.["readUrl"]?.(..._0x317279) ?? chromeShellPostOperationResult("/api/v2/desktop/agent-information/read-url", _0x317279[0x0])
  },
  'storageMigration': {
    'isAvailable'() {
      return desktopBridge['isChromeShell'];
    },
    'read': () => chromeShellPost("/api/v2/desktop/storage-migration/read", {}),
    'complete': _0x4b81af => chromeShellPost('/api/v2/desktop/storage-migration/complete', _0x4b81af)
  },
  'secureSettings': {
    get 'api'() {
      return getGroup(getElectronApi(), "secureSettings");
    },
    'get': (..._0x33e6cc) => desktopBridge["secureSettings"]["api"]?.["get"]?.(..._0x33e6cc) ?? chromeShellPost("/api/v2/desktop/secure-settings/get", _0x33e6cc[0x0]),
    'set': (..._0x5238c8) => desktopBridge['secureSettings']["api"]?.["set"]?.(..._0x5238c8) ?? chromeShellPost("/api/v2/desktop/secure-settings/set", _0x5238c8[0x0]),
    'delete': (..._0x47c7dc) => desktopBridge["secureSettings"]["api"]?.["delete"]?.(..._0x47c7dc) ?? chromeShellPost("/api/v2/desktop/secure-settings/delete", _0x47c7dc[0x0])
  },
  'mediaTask': {
    get 'api'() {
      return getGroup(getElectronApi(), 'mediaTask');
    },
    'isAvailable'() {
      return !!desktopBridge["mediaTask"]["api"] || desktopBridge["isChromeShell"];
    },
    'enqueue': (..._0x40fa10) => withDeferredMediaFiles(_0x40fa10, () => desktopBridge["mediaTask"]["api"]?.["enqueue"]?.(..._0x40fa10) ?? chromeShellPost("/api/v2/desktop/media-task/enqueue", _0x40fa10[0x0])),
    'cancel': (..._0x49152a) => desktopBridge["mediaTask"]['api']?.["cancel"]?.(..._0x49152a) ?? chromeShellPost("/api/v2/desktop/media-task/cancel", _0x49152a[0x0]),
    'list': (..._0x54cf8c) => desktopBridge['mediaTask']["api"]?.["list"]?.(..._0x54cf8c) ?? chromeShellPost("/api/v2/desktop/media-task/list", _0x54cf8c[0x0]),
    'onUpdate': _0x4fcd35 => desktopBridge["mediaTask"]['api']?.['onUpdate']?.(_0x4fcd35) || subscribeByPolling(() => desktopBridge["mediaTask"]["list"]({
      'limit': 0x78
    }), _0x4fcd35, {
      'intervalMs': 0x3e8,
      'extractItems': _0x3b8043 => Array['isArray'](_0x3b8043?.['tasks']) ? _0x3b8043["tasks"] : Array["isArray"](_0x3b8043) ? _0x3b8043 : [],
      'getKey': _0x455ceb => String(_0x455ceb?.["taskId"] || JSON["stringify"](_0x455ceb || {}))
    })
  },
  'diagnostics': {
    get 'api'() {
      return getGroup(getElectronApi(), "diagnostics");
    },
    'isAvailable'() {
      return !!desktopBridge["diagnostics"]["api"] || desktopBridge["isChromeShell"];
    },
    'logEvent': (..._0x42ce91) => desktopBridge['diagnostics']["api"]?.["logEvent"]?.(..._0x42ce91) ?? chromeShellPost("/api/v2/desktop/diagnostics/log-event", _0x42ce91[0x0]),
    'createPackage': (..._0x1559fd) => desktopBridge["diagnostics"]["api"]?.['createPackage']?.(..._0x1559fd) ?? chromeShellPost("/api/v2/desktop/diagnostics/create-package", _0x1559fd[0x0]),
    'openLogsFolder': (..._0x35be8d) => desktopBridge["diagnostics"]["api"]?.["openLogsFolder"]?.(..._0x35be8d) ?? chromeShellPost("/api/v2/desktop/diagnostics/open-logs-folder", _0x35be8d[0x0])
  },
  'nodeExport': {
    'openJianying': () => desktopBridge["nodeExport"]['api']?.["openJianying"]?.() ?? chromeShellPost("/api/v2/desktop/node-export/open-jianying", {}) ?? unavailable("nodeExport.openJianying")(),
    'saveTimeline': (..._0x5aba3d) => withDeferredMediaFiles(_0x5aba3d, () => desktopBridge["nodeExport"]["api"]?.["saveTimeline"]?.(..._0x5aba3d) ?? chromeShellPost('/api/v2/desktop/node-export/save-timeline', _0x5aba3d[0x0]) ?? unavailable("nodeExport.saveTimeline")()),
    get 'api'() {
      return getGroup(getElectronApi(), "nodeExport");
    },
    'isAvailable'() {
      return isFunction(desktopBridge["nodeExport"]["api"]?.["exportSelected"]) || isFunction(desktopBridge["nodeExport"]["api"]?.['saveMedia']) || isFunction(desktopBridge["nodeExport"]["api"]?.["saveText"]) || isFunction(desktopBridge["nodeExport"]['api']?.["saveMediaFiles"]) || isFunction(desktopBridge["nodeExport"]["api"]?.["saveTimeline"]) || desktopBridge["isChromeShell"];
    },
    'canSaveMedia'() {
      return isFunction(desktopBridge['nodeExport']["api"]?.["saveMedia"]) || desktopBridge['isChromeShell'];
    },
    'canSaveText'() {
      return isFunction(desktopBridge["nodeExport"]["api"]?.["saveText"]) || desktopBridge['isChromeShell'];
    },
    'canSaveMediaFiles'() {
      return isFunction(desktopBridge["nodeExport"]["api"]?.["saveMediaFiles"]) || desktopBridge["isChromeShell"];
    },
    'exportSelected': (..._0xf3771) => withDeferredMediaFiles(_0xf3771, () => desktopBridge["nodeExport"]["api"]?.["exportSelected"]?.(..._0xf3771) ?? chromeShellPost("/api/v2/desktop/node-export/export-selected", _0xf3771[0x0]) ?? unavailable("nodeExport.exportSelected")()),
    'saveMedia': (..._0x20403c) => withDeferredMediaFiles(_0x20403c, () => desktopBridge["nodeExport"]['api']?.['saveMedia']?.(..._0x20403c) ?? chromeShellPost("/api/v2/desktop/node-export/save-media", _0x20403c[0x0]) ?? unavailable("nodeExport.saveMedia")()),
    'saveText': (..._0x1106b5) => desktopBridge["nodeExport"]["api"]?.["saveText"]?.(..._0x1106b5) ?? chromeShellPost("/api/v2/desktop/node-export/save-text", _0x1106b5[0x0]) ?? unavailable('nodeExport.saveText')(),
    'saveMediaFiles': (..._0x3fcbf8) => withDeferredMediaFiles(_0x3fcbf8, () => desktopBridge["nodeExport"]["api"]?.["saveMediaFiles"]?.(..._0x3fcbf8) ?? chromeShellPost('/api/v2/desktop/node-export/save-media-files', _0x3fcbf8[0x0]) ?? unavailable('nodeExport.saveMediaFiles')())
  },
  'notification': {
    get 'api'() {
      return getGroup(getElectronApi(), "notification");
    },
    'isAvailable'() {
      return isFunction(desktopBridge["notification"]["api"]?.["showGenerationComplete"]) || desktopBridge["isChromeShell"];
    },
    'showGenerationComplete': (..._0x197dca) => desktopBridge["notification"]["api"]?.['showGenerationComplete']?.(..._0x197dca) ?? chromeShellPost("/api/v2/desktop/notification/show-generation-complete", _0x197dca[0x0]) ?? Promise['resolve']({
      'success': !![],
      'shown': ![],
      'reason': 'unavailable'
    }),
    'onGenerationCompleteClick': _0x38b184 => desktopBridge["notification"]["api"]?.["onGenerationCompleteClick"]?.(_0x38b184) || subscribeByPolling(() => chromeShellPost("/api/v2/desktop/notification/consume-generation-complete-clicks", {}), _0x38b184, {
      'intervalMs': 0x190,
      'extractItems': _0x508a23 => Array['isArray'](_0x508a23) ? _0x508a23 : [],
      'getKey': _0x40cf2e => String(_0x40cf2e?.["eventId"] || _0x40cf2e?.["createdAt"] || JSON["stringify"](_0x40cf2e || {}))
    })
  },
  'screenshot': {
    get 'api'() {
      return getGroup(getElectronApi(), 'screenshot');
    },
    'isAvailable'() {
      return !!desktopBridge["screenshot"]['api'] || desktopBridge["isChromeShell"];
    },
    'captureDisplay': (..._0xda5dff) => desktopBridge["screenshot"]["api"]?.["captureDisplay"]?.(..._0xda5dff) ?? chromeShellPost("/api/v2/desktop/screenshot/capture-display", _0xda5dff[0x0]),
    'updateGlobalShortcut': (..._0x2c7547) => desktopBridge["screenshot"]['api']?.["updateGlobalShortcut"]?.(..._0x2c7547) ?? chromeShellPost("/api/v2/desktop/screenshot/update-global-shortcut", _0x2c7547[0x0]),
    'onGlobalCapture': _0x3a2c39 => desktopBridge['screenshot']['api']?.['onGlobalCapture']?.(_0x3a2c39) || subscribeByPolling(() => chromeShellPost('/api/v2/desktop/screenshot/consume-global-capture-events', {}), _0x3a2c39, {
      'intervalMs': 0x96,
      'extractItems': _0x59b8f7 => Array["isArray"](_0x59b8f7) ? _0x59b8f7 : [],
      'getKey': _0x4623c6 => String(_0x4623c6?.["createdAt"] || _0x4623c6?.["source"] || JSON["stringify"](_0x4623c6 || {}))
    }),
    'onGlobalShortcutStatus': _0x5a23b1 => desktopBridge["screenshot"]["api"]?.["onGlobalShortcutStatus"]?.(_0x5a23b1) || subscribeByPolling(() => chromeShellPost("/api/v2/desktop/screenshot/get-global-shortcut-status", {}), _0x5a23b1, {
      'intervalMs': 0x3e8,
      'getKey': () => "global-shortcut-status"
    })
  },
  'textPreset': {
    get 'api'() {
      return getGroup(getElectronApi(), "textPreset");
    },
    'isAvailable'() {
      return !!desktopBridge["textPreset"]["api"] || desktopBridge['isChromeShell'];
    },
    'updateGlobalShortcut': (..._0x3b9b0e) => desktopBridge["textPreset"]["api"]?.["updateGlobalShortcut"]?.(..._0x3b9b0e) ?? chromeShellPost("/api/v2/desktop/text-preset/update-global-shortcut", _0x3b9b0e[0x0]),
    'claimEvent': _0x3f7939 => desktopBridge["textPreset"]["api"]?.["claimEvent"]?.(_0x3f7939) ?? chromeShellPost("/api/v2/desktop/text-preset/claim-event", _0x3f7939),
    'acknowledgeEvent': _0x10aff7 => desktopBridge['textPreset']["api"]?.['acknowledgeEvent']?.(_0x10aff7) ?? chromeShellPost("/api/v2/desktop/text-preset/acknowledge-event", _0x10aff7),
    'onSelectedText': _0x287a7a => desktopBridge["textPreset"]["api"]?.['onSelectedText']?.(_0x287a7a) || subscribeToConsumedBatch(() => chromeShellPost("/api/v2/desktop/text-preset/consume-events", {}), _0x4291e0 => _0x4291e0["forEach"](_0x3808e5 => _0x287a7a(_0x3808e5)), {
      'intervalMs': 0x96
    }),
    'onGlobalShortcutStatus': _0x37bef8 => desktopBridge["textPreset"]['api']?.["onGlobalShortcutStatus"]?.(_0x37bef8) || subscribeByPolling(() => chromeShellPost('/api/v2/desktop/text-preset/get-global-shortcut-status', {}), _0x37bef8, {
      'intervalMs': 0x3e8,
      'getKey': () => "global-text-preset-shortcut-status"
    })
  },
  'notificationSound': {
    get 'api'() {
      return getGroup(getElectronApi() || getWindowObject()?.["electronAPI"], "notificationSound");
    },
    'isAvailable'() {
      return !!desktopBridge["notificationSound"]["api"] || desktopBridge["isChromeShell"];
    },
    'listMp3Files': (..._0x348aab) => desktopBridge['notificationSound']["api"]?.['listMp3Files']?.(..._0x348aab) ?? chromeShellPost("/api/v2/desktop/notification-sound/list-mp3-files", _0x348aab[0x0]),
    'listSystemSounds': (..._0x4e837a) => desktopBridge["notificationSound"]["api"]?.["listSystemSounds"]?.(..._0x4e837a) ?? chromeShellPost("/api/v2/desktop/notification-sound/list-system-sounds", _0x4e837a[0x0]),
    'openSystemSoundFolder': (..._0x36c2c0) => desktopBridge["notificationSound"]["api"]?.["openSystemSoundFolder"]?.(..._0x36c2c0) ?? chromeShellPost("/api/v2/desktop/notification-sound/open-system-sound-folder", _0x36c2c0[0x0]),
    'play': (..._0x408319) => desktopBridge["notificationSound"]["api"]?.["play"]?.(..._0x408319) ?? chromeShellPost('/api/v2/desktop/notification-sound/play', _0x408319[0x0])
  },
  'localAssetCleanup': {
    get 'api'() {
      return getGroup(getElectronApi(), "localAssetCleanup");
    },
    'isAvailable'() {
      return !!desktopBridge["localAssetCleanup"]["api"] || desktopBridge["isChromeShell"];
    },
    'scan': (..._0x14cde6) => desktopBridge["localAssetCleanup"]["api"]?.["scan"]?.(..._0x14cde6) ?? chromeShellPost("/api/v2/desktop/local-asset-cleanup/scan", _0x14cde6[0x0]),
    'trash': (..._0x1c99ef) => desktopBridge["localAssetCleanup"]["api"]?.["trash"]?.(..._0x1c99ef) ?? chromeShellPost("/api/v2/desktop/local-asset-cleanup/trash", _0x1c99ef[0x0])
  },
  'clipboard': {
    get 'api'() {
      return getGroup(getElectronApi(), "clipboard");
    },
    'canUseImages'() {
      return isFunction(desktopBridge["clipboard"]['api']?.["writeImage"]) || isFunction(desktopBridge["clipboard"]["api"]?.["readImage"]) || desktopBridge["isChromeShell"];
    },
    'canUseFiles'() {
      return !!desktopBridge["clipboard"]["api"] || desktopBridge['isChromeShell'];
    },
    'canUseText'() {
      return !!desktopBridge["clipboard"]["api"] || desktopBridge["isChromeShell"];
    },
    'writeImage': (..._0x26c0b0) => desktopBridge['clipboard']["api"]?.["writeImage"]?.(..._0x26c0b0),
    'readImage': (..._0x390ab2) => desktopBridge["clipboard"]["api"]?.["readImage"]?.(..._0x390ab2) ?? chromeShellPost("/api/v2/desktop/clipboard/read-image"),
    'writeFileReferences': (..._0x155a10) => desktopBridge["clipboard"]["api"]?.["writeFileReferences"]?.(..._0x155a10) ?? chromeShellPost('/api/v2/desktop/clipboard/write-file-references', _0x155a10[0x0]),
    'readFileReferences': (..._0x204ddf) => desktopBridge["clipboard"]["api"]?.["readFileReferences"]?.(..._0x204ddf) ?? chromeShellPost('/api/v2/desktop/clipboard/read-file-references', _0x204ddf[0x0]),
    'writeText': (..._0x25ab0f) => desktopBridge['clipboard']["api"]?.["writeText"]?.(..._0x25ab0f) ?? chromeShellPost("/api/v2/desktop/clipboard/write-text", _0x25ab0f[0x0]),
    'readText': (..._0x54a146) => desktopBridge["clipboard"]["api"]?.["readText"]?.(..._0x54a146) ?? chromeShellPost('/api/v2/desktop/clipboard/read-text', _0x54a146[0x0])
  },
  'canvasVisualSnapshot': {
    get 'api'() {
      return getGroup(getElectronApi(), "canvasVisualSnapshot");
    },
    'isAvailable'() {
      return isFunction(desktopBridge["canvasVisualSnapshot"]['api']?.['capturePage']);
    },
    'capturePage': (..._0x5aa57f) => desktopBridge['canvasVisualSnapshot']["api"]?.['capturePage']?.(..._0x5aa57f)
  }
};
export function installDesktopBridgeCompat() {
  const _0x380803 = getWindowObject();
  if (!_0x380803 || !desktopBridge["isChromeShell"] || _0x380803["electronAPI"] || _0x380803["aiCanvasDesktop"]) {
    return ![];
  }
  _0x380803["__AIC_CHROME_SHELL__"] = !![];
  _0x380803["aiCanvasDesktop"] = {
    '__aicDesktopHttpShim': !![],
    'isElectron': ![],
    'getAppVersion': _0x29fd3d => chromeShellPost("/api/v2/desktop/app/get-version", _0x29fd3d),
    'getDeviceId': _0x35187e => chromeShellPost("/api/v2/desktop/app/get-device-id", _0x35187e),
    'checkForUpdates': _0x17dc79 => chromeShellPost('/api/v2/desktop/app/check-for-updates', _0x17dc79),
    'getUpdateState': _0x248647 => chromeShellPost("/api/v2/desktop/app/update-state", _0x248647),
    'downloadUpdate': _0x583d0d => chromeShellPost("/api/v2/desktop/app/download-update", _0x583d0d),
    'cancelUpdateDownload': _0x1521be => chromeShellPost("/api/v2/desktop/app/cancel-update-download", _0x1521be),
    'installDownloadedUpdate': async _0x5ecb96 => {
      await writeChromeShellRecoverySnapshotBeforeInstall();
      return chromeShellPost("/api/v2/desktop/app/install-downloaded-update", _0x5ecb96);
    },
    'onUpdaterEvent': _0xc8472d => subscribeToUpdaterState(() => chromeShellPost("/api/v2/desktop/app/update-state", {}), _0xc8472d)
  };
  _0x380803['electronAPI'] = {
    '__aicDesktopHttpShim': !![],
    'project': {
      'open': _0x349c81 => chromeShellPost('/api/v2/desktop/project/open', _0x349c81),
      'save': _0x13fa19 => chromeShellPost('/api/v2/desktop/project/save', _0x13fa19),
      'exportPackage': _0x95a553 => chromeShellPost("/api/v2/desktop/project/export-package", _0x95a553),
      'importPackage': _0x3c7cf0 => chromeShellPost("/api/v2/desktop/project/import-package", _0x3c7cf0),
      'listRecent': _0x54be14 => chromeShellPost("/api/v2/desktop/project/list-recent", _0x54be14),
      'removeRecent': _0x27c9c9 => chromeShellPost("/api/v2/desktop/project/remove-recent", _0x27c9c9),
      'setUnsavedState': _0x10d437 => postChromeShellUnsavedState(_0x10d437),
      'writeRecoverySnapshot': _0x67a246 => chromeShellPost("/api/v2/desktop/project/write-recovery-snapshot", _0x67a246),
      'getRecoverySnapshotInfo': _0x491de5 => chromeShellPost("/api/v2/desktop/project/get-recovery-snapshot-info", _0x491de5),
      'readRecoverySnapshot': _0x51ac07 => chromeShellPost("/api/v2/desktop/project/read-recovery-snapshot", _0x51ac07),
      'clearRecoverySnapshot': _0x229305 => chromeShellPost("/api/v2/desktop/project/clear-recovery-snapshot", _0x229305),
      'consumeExternalOpenRequests': _0x501e42 => chromeShellPost("/api/v2/desktop/project/consume-external-open-requests", _0x501e42),
      'onExternalOpen': _0x30fb6d => subscribeToConsumedBatch(() => chromeShellPost("/api/v2/desktop/project/consume-external-open-requests", {}), _0x30fb6d, {
        'intervalMs': 0x1f4
      }),
      'onPackageProgress': _0x2d01ef => subscribeByPolling(() => chromeShellPost("/api/v2/desktop/project/consume-package-progress-events", {}), _0x2d01ef, {
        'intervalMs': 0xfa,
        'extractItems': _0x52c166 => Array["isArray"](_0x52c166) ? _0x52c166 : [],
        'getKey': _0x574462 => String(_0x574462?.["createdAt"] || _0x574462?.["operationId"] || JSON['stringify'](_0x574462 || {}))
      })
    },
    'importAsset': _0xf69125 => chromeShellPost('/api/v2/desktop/asset/import', _0xf69125),
    'importRemoteAsset': _0xa8394d => chromeShellPost("/api/v2/desktop/asset/import-remote", _0xa8394d),
    'importLocalFile': _0x52905a => chromeShellPost("/api/v2/desktop/file/import-local", _0x52905a),
    'getPathForFile': _0x267906 => String(_0x267906?.["path"] || ''),
    'getLocalPreviewUrl': _0x49c094 => postDesktopBridge("/api/v2/desktop/local-preview", _0x49c094),
    'selectDirectory': _0x2ef9e4 => chromeShellPost('/api/v2/desktop/dialog/select-directory', _0x2ef9e4),
    'showItemInFolder': _0x5de379 => chromeShellPost('/api/v2/desktop/shell/show-item-in-folder', _0x5de379),
    'openKnownFolder': _0x541467 => chromeShellPost("/api/v2/desktop/shell/open-known-folder", _0x541467),
    'openExternal': _0x16854d => chromeShellPost("/api/v2/desktop/shell/open-external", {
      'url': _0x16854d
    }),
    'shell': {
      'openExternal': _0x145890 => chromeShellPost("/api/v2/desktop/shell/open-external", {
        'url': _0x145890
      })
    },
    'webPreview': {
      'surfaceMode': "remote-snapshot",
      'syncViews': _0x2834d6 => chromeShellPost("/api/v2/desktop/web-preview/sync-views", _0x2834d6),
      'syncViewsFast': _0x239464 => syncChromeShellWebPreviewViews(_0x239464),
      'disposeViews': _0x513a1a => chromeShellPost("/api/v2/desktop/web-preview/dispose-views", _0x513a1a),
      'controlView': _0x51df0b => chromeShellPost("/api/v2/desktop/web-preview/control-view", _0x51df0b),
      'onEvent': _0xb61a7d => subscribeByLongPolling(() => chromeShellPost("/api/v2/desktop/web-preview/wait-events", {
        'waitMs': 0x3e8
      }), _0xb61a7d)
    },
    'secureSettings': {
      'get': _0x22e19b => chromeShellPost("/api/v2/desktop/secure-settings/get", _0x22e19b),
      'set': _0x552ba9 => chromeShellPost("/api/v2/desktop/secure-settings/set", _0x552ba9),
      'delete': _0xe7c945 => chromeShellPost('/api/v2/desktop/secure-settings/delete', _0xe7c945)
    },
    'customAiApps': {
      'read': _0x39749a => chromeShellPost('/api/v2/desktop/custom-ai-apps/read', _0x39749a),
      'write': _0x2215b6 => chromeShellPost("/api/v2/desktop/custom-ai-apps/write", _0x2215b6)
    },
    'agentInformation': {
      'readUrl': _0x3399f7 => chromeShellPost("/api/v2/desktop/agent-information/read-url", _0x3399f7)
    },
    'mediaTask': {
      'enqueue': _0x3a68c9 => chromeShellPost("/api/v2/desktop/media-task/enqueue", _0x3a68c9),
      'cancel': _0x4888bb => chromeShellPost("/api/v2/desktop/media-task/cancel", _0x4888bb),
      'list': _0x17d64a => chromeShellPost('/api/v2/desktop/media-task/list', _0x17d64a),
      'onUpdate': _0x4fef2b => subscribeByPolling(() => chromeShellPost("/api/v2/desktop/media-task/list", {
        'limit': 0x78
      }), _0x4fef2b, {
        'intervalMs': 0x3e8,
        'extractItems': _0x48ec2e => Array["isArray"](_0x48ec2e?.["tasks"]) ? _0x48ec2e['tasks'] : Array['isArray'](_0x48ec2e) ? _0x48ec2e : [],
        'getKey': _0x32595d => String(_0x32595d?.["taskId"] || JSON["stringify"](_0x32595d || {}))
      })
    },
    'diagnostics': {
      'logEvent': _0x3d086d => desktopBridge['diagnostics']["logEvent"](_0x3d086d),
      'createPackage': _0x9d8d5c => desktopBridge["diagnostics"]["createPackage"](_0x9d8d5c),
      'openLogsFolder': _0x21a5f3 => desktopBridge["diagnostics"]["openLogsFolder"](_0x21a5f3)
    },
    'notification': {
      'showGenerationComplete': _0x538032 => desktopBridge["notification"]["showGenerationComplete"](_0x538032),
      'onGenerationCompleteClick': _0x4ee58d => desktopBridge["notification"]["onGenerationCompleteClick"](_0x4ee58d)
    },
    'notificationSound': {
      'listMp3Files': _0x1bccc6 => chromeShellPost('/api/v2/desktop/notification-sound/list-mp3-files', _0x1bccc6),
      'listSystemSounds': _0x45655a => chromeShellPost("/api/v2/desktop/notification-sound/list-system-sounds", _0x45655a),
      'openSystemSoundFolder': _0x10e860 => chromeShellPost("/api/v2/desktop/notification-sound/open-system-sound-folder", _0x10e860),
      'play': _0x2cd7ee => chromeShellPost("/api/v2/desktop/notification-sound/play", _0x2cd7ee)
    },
    'localAssetCleanup': {
      'scan': _0x182c73 => chromeShellPost("/api/v2/desktop/local-asset-cleanup/scan", _0x182c73),
      'trash': _0x120a2a => chromeShellPost("/api/v2/desktop/local-asset-cleanup/trash", _0x120a2a)
    },
    'nodeExport': {
      'exportSelected': _0x205df4 => chromeShellPost("/api/v2/desktop/node-export/export-selected", _0x205df4),
      'saveMedia': _0x305071 => chromeShellPost("/api/v2/desktop/node-export/save-media", _0x305071),
      'saveText': _0x389218 => chromeShellPost("/api/v2/desktop/node-export/save-text", _0x389218),
      'saveMediaFiles': _0x2b3263 => chromeShellPost("/api/v2/desktop/node-export/save-media-files", _0x2b3263),
      'saveTimeline': _0x20ed79 => chromeShellPost("/api/v2/desktop/node-export/save-timeline", _0x20ed79),
      'openJianying': () => chromeShellPost("/api/v2/desktop/node-export/open-jianying", {})
    },
    'screenshot': {
      'captureDisplay': _0x28af60 => chromeShellPost("/api/v2/desktop/screenshot/capture-display", _0x28af60),
      'updateGlobalShortcut': _0x5c1b27 => chromeShellPost("/api/v2/desktop/screenshot/update-global-shortcut", _0x5c1b27),
      'onGlobalCapture': _0x3408b1 => subscribeByPolling(() => chromeShellPost("/api/v2/desktop/screenshot/consume-global-capture-events", {}), _0x3408b1, {
        'intervalMs': 0x96,
        'extractItems': _0x571048 => Array["isArray"](_0x571048) ? _0x571048 : [],
        'getKey': _0x1fa98e => String(_0x1fa98e?.['createdAt'] || _0x1fa98e?.["source"] || JSON["stringify"](_0x1fa98e || {}))
      }),
      'onGlobalShortcutStatus': _0x364fa1 => subscribeByPolling(() => chromeShellPost("/api/v2/desktop/screenshot/get-global-shortcut-status", {}), _0x364fa1, {
        'intervalMs': 0x3e8,
        'getKey': () => "global-shortcut-status"
      })
    },
    'textPreset': {
      'claimEvent': _0x2dd122 => chromeShellPost('/api/v2/desktop/text-preset/claim-event', _0x2dd122),
      'acknowledgeEvent': _0x257280 => chromeShellPost('/api/v2/desktop/text-preset/acknowledge-event', _0x257280),
      'updateGlobalShortcut': _0x51adc0 => chromeShellPost("/api/v2/desktop/text-preset/update-global-shortcut", _0x51adc0),
      'onSelectedText': _0x57caf5 => subscribeToConsumedBatch(() => chromeShellPost("/api/v2/desktop/text-preset/consume-events", {}), _0x193f45 => _0x193f45["forEach"](_0x2f4586 => _0x57caf5(_0x2f4586)), {
        'intervalMs': 0x96
      }),
      'onGlobalShortcutStatus': _0x1c8cad => subscribeByPolling(() => chromeShellPost('/api/v2/desktop/text-preset/get-global-shortcut-status', {}), _0x1c8cad, {
        'intervalMs': 0x3e8,
        'getKey': () => "global-text-preset-shortcut-status"
      })
    },
    'clipboard': {
      'writeText': _0x3138dc => chromeShellPost("/api/v2/desktop/clipboard/write-text", _0x3138dc),
      'readText': _0x1e4c64 => chromeShellPost('/api/v2/desktop/clipboard/read-text', _0x1e4c64),
      'writeFileReferences': _0x230478 => chromeShellPost("/api/v2/desktop/clipboard/write-file-references", _0x230478),
      'readFileReferences': _0x5736f0 => chromeShellPost("/api/v2/desktop/clipboard/read-file-references", _0x5736f0)
    },
    'onAssetUpdated': _0x405687 => subscribeByPolling(() => chromeShellPost("/api/v2/desktop/asset/consume-updates", {}), _0x405687, {
      'intervalMs': 0x1f4,
      'extractItems': _0x218843 => Array["isArray"](_0x218843) ? _0x218843 : [],
      'getKey': _0x34abd8 => String(_0x34abd8?.["assetId"] || JSON["stringify"](_0x34abd8 || {}))
    }),
    'logDragImport': (_0x221502, _0x3179f9) => desktopBridge["diagnostics"]['logEvent']({
      'type': "import.drag_profile",
      'level': 'debug',
      'source': 'renderer',
      'message': "Drag import profile",
      'context': {
        'label': _0x221502,
        ...(_0x3179f9 || {})
      }
    })
  };
  return !![];
}
export function getDesktopBridge() {
  return desktopBridge;
}
export const __desktopBridgeForTest = {
  'hasChromeShellRuntimeHint': hasChromeShellRuntimeHint,
  'isLoopbackAppOrigin': isLoopbackAppOrigin,
  'normalizeDesktopHttpPayload': normalizeDesktopHttpPayload,
  'resolveDesktopBridgeRequestTimeout': resolveDesktopBridgeRequestTimeout,
  'subscribeToConsumedBatch': subscribeToConsumedBatch,
  'subscribeToUpdaterState': subscribeToUpdaterState,
  'writeChromeShellRecoverySnapshotBeforeInstall': writeChromeShellRecoverySnapshotBeforeInstall
};