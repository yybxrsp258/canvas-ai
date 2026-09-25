import a209_0x16d26d from 'node:http';
import { mkdirSync } from 'node:fs';
import a209_0x3b99cb from 'electron';
import { createCustomAiAppStorage } from './customAiAppStorage.js';
import { openShellFolder, revealShellItemInFolder } from './shellItemRevealer.js';
const MAX_BODY_BYTES = 0x40 * 0x400 * 0x400;
const DEFAULT_CLOSE_GRACE_MS = 0x2ee;
const MAX_CLOSE_GRACE_MS = 0x1388;
const {
  shell = {}
} = typeof a209_0x3b99cb === "object" && a209_0x3b99cb ? a209_0x3b99cb : {};
function normalizeCloseGraceMs(_0x397fa3) {
  const _0x21b342 = Number(_0x397fa3);
  if (!Number["isFinite"](_0x21b342) || _0x21b342 < 0x0) {
    return DEFAULT_CLOSE_GRACE_MS;
  }
  return Math["min"](Math["trunc"](_0x21b342), MAX_CLOSE_GRACE_MS);
}
function createDesktopHttpBridgeCloseError(_0x3272a2) {
  const _0x515b75 = String(_0x3272a2?.["message"] || _0x3272a2 || 'Unknown\x20close\x20failure');
  const _0x29d618 = new Error('Desktop\x20HTTP\x20bridge\x20close\x20failed:\x20' + _0x515b75);
  _0x29d618['code'] = "DESKTOP_HTTP_BRIDGE_CLOSE_FAILED";
  if (_0x3272a2) {
    _0x29d618["cause"] = _0x3272a2;
  }
  return _0x29d618;
}
function jsonResponse(_0x1f756c, _0x403be5, _0x52c242) {
  const _0x3552b7 = Buffer["from"](JSON["stringify"](_0x52c242 || {}) + '\x0a', "utf8");
  _0x1f756c["writeHead"](_0x403be5, {
    'Content-Type': 'application/json;\x20charset=utf-8',
    'Content-Length': String(_0x3552b7["length"]),
    'Cache-Control': "no-store"
  });
  _0x1f756c['end'](_0x3552b7);
}
function normalizePathname(_0x1749dd) {
  try {
    return new URL(_0x1749dd || '/', "http://127.0.0.1")["pathname"]["replace"](/\/+$/, '');
  } catch {
    return '';
  }
}
function readJsonBody(_0xc8f64f) {
  return new Promise((_0x5b69ef, _0x5bf2de) => {
    const _0x455d0a = [];
    let _0x29919a = 0x0;
    _0xc8f64f['on']('data', _0x16acd3 => {
      _0x29919a += _0x16acd3["length"];
      if (_0x29919a > MAX_BODY_BYTES) {
        _0x5bf2de(new Error("REQUEST_BODY_TOO_LARGE"));
        _0xc8f64f['destroy']();
        return;
      }
      _0x455d0a["push"](Buffer['from'](_0x16acd3));
    });
    _0xc8f64f['on']("error", _0x5bf2de);
    _0xc8f64f['on']("end", () => {
      const _0x42a066 = Buffer['concat'](_0x455d0a)["toString"]('utf8')['trim']();
      if (!_0x42a066) {
        _0x5b69ef({});
        return;
      }
      try {
        const _0x1f2de9 = JSON["parse"](_0x42a066);
        _0x5b69ef(_0x1f2de9 && typeof _0x1f2de9 === "object" ? _0x1f2de9 : {});
      } catch {
        _0x5bf2de(new Error("Invalid JSON"));
      }
    });
  });
}
function requireToken(_0x53c4ef, _0x46b58a) {
  const _0x31a6be = String(_0x46b58a || '')["trim"]();
  if (!_0x31a6be) {
    return ![];
  }
  const _0x2fb4a8 = String(_0x53c4ef["headers"]["x-aic-desktop-bridge-token"] || '')['trim']();
  return _0x2fb4a8 === _0x31a6be;
}
function safeCall(_0x16dab1, _0x461b08) {
  return Promise["resolve"]()['then'](() => _0x16dab1(_0x461b08 || {}));
}
export function createDesktopHttpBridgeHandlers(_0x1f6f5a = {}) {
  const _0x1a79f5 = () => _0x1f6f5a["getUpdaterController"]?.();
  const _0xa806a8 = () => _0x1f6f5a["getBackgroundCompletionNotifier"]?.();
  const _0x508f49 = typeof _0x1f6f5a['revealItemInFolder'] === "function" ? _0x1f6f5a["revealItemInFolder"] : _0x514ab7 => revealShellItemInFolder(_0x514ab7, {
    'shellApi': shell,
    'logEvent': _0x1f6f5a["logDiagnosticEvent"]
  });
  const _0x414a19 = typeof _0x1f6f5a["openFolder"] === "function" ? _0x1f6f5a["openFolder"] : _0x1316d4 => openShellFolder(_0x1316d4, {
    'shellApi': shell,
    'logEvent': _0x1f6f5a["logDiagnosticEvent"]
  });
  const _0x20c7e9 = () => {
    const _0x83dfbd = _0x1f6f5a['secureSettingsOperations'];
    if (!_0x83dfbd) {
      throw new Error("Secure settings capability operations are unavailable");
    }
    return _0x83dfbd;
  };
  const _0x378d12 = () => {
    const _0x3850e7 = _0x1f6f5a["clipboardOperations"];
    if (!_0x3850e7) {
      throw new Error("Clipboard capability operations are unavailable");
    }
    return _0x3850e7;
  };
  const _0xc5d499 = () => {
    const _0x285f84 = _0x1f6f5a["projectOperations"];
    if (!_0x285f84) {
      throw new Error('Project\x20capability\x20operations\x20are\x20unavailable');
    }
    return _0x285f84;
  };
  const _0x49de2c = () => {
    const _0x1c3d21 = _0x1f6f5a["agentSkillOperations"];
    if (!_0x1c3d21) {
      throw new Error('Agent\x20Skill\x20capability\x20operations\x20are\x20unavailable');
    }
    return _0x1c3d21;
  };
  const _0x467d7c = () => {
    const _0x38fa60 = _0x1f6f5a["agentInformationOperations"];
    if (!_0x38fa60) {
      throw new Error("Agent information capability operations are unavailable");
    }
    return _0x38fa60;
  };
  const _0x5d43ef = [];
  let _0x2cea84 = null;
  const _0x51ce3d = () => {
    !_0x2cea84 && (_0x2cea84 = createCustomAiAppStorage({
      'getDataDir': _0x1f6f5a["getDataDir"]
    }));
    return _0x2cea84;
  };
  function _0x29e298(_0x13aa57 = {}) {
    _0x5d43ef['push']({
      ...(_0x13aa57 || {}),
      'createdAt': Date["now"]()
    });
    while (_0x5d43ef["length"] > 0x50) {
      _0x5d43ef["shift"]();
    }
  }
  function _0x3e1a32() {
    return _0x5d43ef["splice"](0x0, _0x5d43ef["length"]);
  }
  function _0x1ed787() {
    return {
      'onProgress': _0x29e298
    };
  }
  function _0x3b3328() {
    const _0x532817 = _0x1f6f5a['getWebPreviewViewManager']?.();
    if (!_0x532817) {
      throw new Error("Browser node runtime is unavailable");
    }
    return _0x532817;
  }
  function _0x572a97(_0x1f567c = {}) {
    const _0x3b1c79 = _0x1f567c && typeof _0x1f567c === 'object' ? _0x1f567c : {};
    const _0x11bd72 = String(_0x3b1c79["localPath"] || '')["trim"]();
    if (!_0x11bd72) {
      throw new Error("Staged localPath is required");
    }
    if (Object['prototype']['hasOwnProperty']["call"](_0x3b1c79, "path") || Object["prototype"]["hasOwnProperty"]["call"](_0x3b1c79, "bytes")) {
      throw new Error("Raw paths and bytes are not allowed over the desktop HTTP bridge");
    }
    const _0x5cefb6 = _0x1f6f5a["resolveLocalVirtualPath"]?.(_0x11bd72) || '';
    if (!_0x5cefb6) {
      throw new Error('Path\x20is\x20not\x20allowed');
    }
    const {
      localPath: _0x4c63cb,
      ..._0x82cca6
    } = _0x3b1c79;
    return _0x1f6f5a["importAssetToLibrary"]?.({
      ..._0x82cca6,
      'path': _0x5cefb6
    });
  }
  return new Map([['/api/v2/desktop/app/get-version', () => _0x1f6f5a["getAppVersion"]?.() || ''], ["/api/v2/desktop/app/get-device-id", _0x3695a5 => _0x1f6f5a["getStableDeviceId"]?.(_0x3695a5) || ''], ["/api/v2/desktop/app/update-state", () => _0x1a79f5()?.["getState"]?.() || null], ["/api/v2/desktop/app/check-for-updates", () => _0x1a79f5()?.["checkForUpdates"]?.({
    'manual': !![]
  }) || null], ["/api/v2/desktop/app/download-update", () => _0x1a79f5()?.["downloadUpdate"]?.() || null], ["/api/v2/desktop/app/cancel-update-download", () => _0x1a79f5()?.['cancelDownload']?.() || null], ["/api/v2/desktop/app/install-downloaded-update", () => _0x1a79f5()?.['installDownloadedUpdate']?.() || null], ['/api/v2/desktop/notification/show-generation-complete', _0x5a3b7f => {
    const _0x3f5a1e = _0xa806a8();
    if (!_0x3f5a1e?.["showGenerationComplete"]) {
      return {
        'success': !![],
        'shown': ![],
        'reason': "unavailable"
      };
    }
    return _0x3f5a1e["showGenerationComplete"](_0x5a3b7f || {});
  }], ["/api/v2/desktop/notification/consume-generation-complete-clicks", () => {
    const _0x29e81d = _0xa806a8();
    return _0x29e81d?.["consumeClickEvents"]?.() || [];
  }], ['/api/v2/desktop/secure-settings/get', _0x348b62 => _0x20c7e9()["get"](_0x348b62)], ["/api/v2/desktop/secure-settings/set", _0x3ec762 => _0x20c7e9()["set"](_0x3ec762)], ["/api/v2/desktop/secure-settings/delete", _0x56483d => _0x20c7e9()['delete'](_0x56483d)], ["/api/v2/desktop/custom-ai-apps/read", () => _0x51ce3d()['read']()], ["/api/v2/desktop/custom-ai-apps/write", _0x1d7df9 => _0x51ce3d()['write'](_0x1d7df9 || {})], ["/api/v2/desktop/agent-skills/list", () => _0x49de2c()["list"]()], ["/api/v2/desktop/agent-skills/open-root", () => _0x49de2c()["openRoot"]()], ["/api/v2/desktop/agent-skills/install-folder", () => _0x49de2c()["installFromFolder"]()], ["/api/v2/desktop/agent-skills/save-managed", _0x380779 => _0x49de2c()['saveManagedDefinition'](_0x380779)], ["/api/v2/desktop/agent-skills/delete-installed", _0x4901c2 => _0x49de2c()['deleteInstalled'](_0x4901c2)], ["/api/v2/desktop/agent-information/read-url", _0x7dc92d => _0x467d7c()["readUrl"](_0x7dc92d)], ["/api/v2/desktop/storage-migration/read", () => _0x1f6f5a["readLegacyRendererStorageMigration"]?.() || {
    'available': ![]
  }], ["/api/v2/desktop/storage-migration/complete", _0x1668e7 => _0x1f6f5a["completeLegacyRendererStorageMigration"]?.(_0x1668e7) || {
    'success': ![]
  }], ["/api/v2/desktop/project/open", _0x468f1f => _0xc5d499()["open"](_0x468f1f)], ['/api/v2/desktop/project/save', _0x2f2aa4 => _0xc5d499()['save'](_0x2f2aa4)], ['/api/v2/desktop/project/export-package', _0x5eaeef => _0xc5d499()['exportPackage'](_0x5eaeef, _0x1ed787())], ["/api/v2/desktop/project/import-package", _0x30a9ca => _0xc5d499()['importPackage'](_0x30a9ca, _0x1ed787())], ["/api/v2/desktop/project/consume-package-progress-events", () => _0x3e1a32()], ["/api/v2/desktop/project/list-recent", () => _0xc5d499()['listRecent']()], ['/api/v2/desktop/project/remove-recent', _0xeb3754 => _0xc5d499()["removeRecent"](_0xeb3754)], ["/api/v2/desktop/project/set-unsaved-state", _0x2477a5 => _0xc5d499()["setUnsavedState"](_0x2477a5)], ["/api/v2/desktop/project/consume-external-open-requests", () => _0xc5d499()["consumeExternalOpenRequests"]()], ['/api/v2/desktop/project/write-recovery-snapshot', _0x461c0c => _0xc5d499()['writeRecoverySnapshot'](_0x461c0c)], ["/api/v2/desktop/project/get-recovery-snapshot-info", _0x59bcd5 => _0xc5d499()["getRecoverySnapshotInfo"](_0x59bcd5)], ["/api/v2/desktop/project/read-recovery-snapshot", () => _0xc5d499()["readRecoverySnapshot"]()], ["/api/v2/desktop/project/clear-recovery-snapshot", () => _0xc5d499()["clearRecoverySnapshot"]()], ['/api/v2/desktop/asset/import', _0x576a31 => _0x572a97(_0x576a31)], ["/api/v2/desktop/asset/import-remote", _0x207174 => _0x1f6f5a["importRemoteAssetToLibrary"]?.(_0x207174)], ["/api/v2/desktop/asset/consume-updates", () => _0x1f6f5a["consumeAssetUpdateEvents"]?.() || []], ["/api/v2/desktop/file/import-local", _0x292018 => _0x572a97(_0x292018)], ['/api/v2/desktop/dialog/select-directory', _0x2f1f4b => _0x1f6f5a["selectDirectory"]?.(_0x2f1f4b)], ["/api/v2/desktop/shell/show-item-in-folder", _0x34230a => {
    const _0x57993f = _0x1f6f5a["resolveLocalVirtualPath"]?.(_0x34230a?.["localPath"] || '');
    if (!_0x57993f) {
      throw new Error('Path\x20is\x20not\x20allowed');
    }
    _0x508f49(_0x57993f);
    return {
      'ok': !![]
    };
  }], ['/api/v2/desktop/shell/open-known-folder', _0x74ef5c => {
    const _0x54f9ac = _0x1f6f5a["resolveKnownFolder"]?.(_0x74ef5c?.["kind"] || '');
    if (!_0x54f9ac) {
      throw new Error("Folder is not allowed");
    }
    mkdirSync(_0x54f9ac, {
      'recursive': !![]
    });
    _0x414a19(_0x54f9ac);
    return {
      'ok': !![]
    };
  }], ['/api/v2/desktop/shell/open-external', _0x15bf8e => _0x1f6f5a['openExternalUrl']?.(_0x15bf8e?.['url'] || _0x15bf8e)], ["/api/v2/desktop/web-preview/sync-views", _0x4b04b => _0x3b3328()["syncViews"](_0x4b04b || {})], ["/api/v2/desktop/web-preview/dispose-views", _0x5025ad => _0x3b3328()["disposeViews"](_0x5025ad || {})], ["/api/v2/desktop/web-preview/control-view", _0x4960b6 => _0x3b3328()["controlView"](_0x4960b6 || {})], ["/api/v2/desktop/web-preview/consume-events", () => _0x3b3328()["consumeEvents"]?.() || []], ['/api/v2/desktop/web-preview/wait-events', _0xc638c6 => {
    const _0x26e2fb = _0x3b3328();
    return _0x26e2fb["waitForEvents"]?.(_0xc638c6 || {}) || _0x26e2fb["consumeEvents"]?.() || [];
  }], ['/api/v2/desktop/notification-sound/list-mp3-files', _0x3412ea => _0x1f6f5a["listNotificationSoundMp3Files"]?.(_0x3412ea)], ['/api/v2/desktop/notification-sound/list-system-sounds', () => _0x1f6f5a["listSystemNotificationSoundFiles"]?.()], ['/api/v2/desktop/notification-sound/open-system-sound-folder', () => _0x1f6f5a["openSystemNotificationSoundFolder"]?.()], ["/api/v2/desktop/notification-sound/play", _0x4a4a75 => _0x1f6f5a["playNotificationSound"]?.(_0x4a4a75)], ["/api/v2/desktop/media-task/enqueue", _0xaab612 => _0x1f6f5a["getMediaTaskQueue"]?.()["enqueue"](_0xaab612 || {})], ["/api/v2/desktop/media-task/cancel", _0x74a5ff => {
    const _0xe6eb8e = _0x1f6f5a["getMediaTaskQueue"]?.();
    const _0x5b092e = _0x74a5ff?.["taskId"] || '';
    if (_0x74a5ff?.["onlyIfWaiting"] === !![]) {
      return _0xe6eb8e?.["cancel"](_0x5b092e, {
        'onlyIfWaiting': !![]
      });
    }
    return _0xe6eb8e?.["cancel"](_0x5b092e);
  }], ['/api/v2/desktop/media-task/list', _0x542271 => _0x1f6f5a["getMediaTaskQueue"]?.()["list"]({
    'limit': _0x542271?.["limit"] || 0x64
  })], ["/api/v2/desktop/local-asset-cleanup/scan", _0x3aa22d => _0x1f6f5a["getLocalAssetCleanupManager"]?.()["scan"](_0x3aa22d || {})], ["/api/v2/desktop/local-asset-cleanup/trash", _0x433340 => _0x1f6f5a['getLocalAssetCleanupManager']?.()["trash"](_0x433340 || {})], ["/api/v2/desktop/diagnostics/log-event", _0x250fe7 => _0x1f6f5a["logDiagnosticEvent"]?.({
    ...(_0x250fe7 || {}),
    'source': _0x250fe7?.['source'] || "renderer"
  })], ["/api/v2/desktop/diagnostics/create-package", _0x18d081 => _0x1f6f5a["diagnosticsOperations"]?.["createPackage"](_0x18d081 || {})], ["/api/v2/desktop/diagnostics/open-logs-folder", () => _0x1f6f5a["diagnosticsOperations"]?.["openLogsFolder"]()], ["/api/v2/desktop/node-export/export-selected", _0x58c4fa => _0x1f6f5a["exportSelectedNodesPackage"]?.(_0x58c4fa || {})], ["/api/v2/desktop/node-export/save-media", _0x17f8cc => _0x1f6f5a["saveMediaFile"]?.(_0x17f8cc || {})], ["/api/v2/desktop/node-export/save-text", _0x44a91a => _0x1f6f5a["saveTextFile"]?.(_0x44a91a || {})], ['/api/v2/desktop/node-export/save-media-files', _0x3e818a => _0x1f6f5a["saveMediaFiles"]?.(_0x3e818a || {})], ["/api/v2/desktop/node-export/save-timeline", _0x5e0e18 => _0x1f6f5a['saveTimeline']?.(_0x5e0e18 || {})], ['/api/v2/desktop/node-export/open-jianying', () => _0x1f6f5a["openJianying"]?.()], ["/api/v2/desktop/screenshot/capture-display", () => _0x1f6f5a["captureDesktopDisplay"]?.()], ["/api/v2/desktop/screenshot/update-global-shortcut", _0x53a92b => _0x1f6f5a["configureGlobalScreenshotShortcut"]?.(_0x53a92b)], ["/api/v2/desktop/screenshot/consume-global-capture-events", () => _0x1f6f5a["consumeGlobalScreenshotCaptureEvents"]?.() || []], ["/api/v2/desktop/screenshot/get-global-shortcut-status", () => _0x1f6f5a['getGlobalScreenshotShortcutStatus']?.() || null], ["/api/v2/desktop/text-preset/update-global-shortcut", _0x3cb9cd => _0x1f6f5a['configureGlobalTextPresetShortcut']?.(_0x3cb9cd)], ['/api/v2/desktop/text-preset/consume-events', () => _0x1f6f5a["consumeGlobalTextPresetEvents"]?.() || []], ['/api/v2/desktop/text-preset/claim-event', _0x43daa1 => _0x1f6f5a["claimGlobalTextPresetEvent"]?.(_0x43daa1) || {
    'ok': ![]
  }], ["/api/v2/desktop/text-preset/acknowledge-event", _0x2e8d99 => _0x1f6f5a["acknowledgeGlobalTextPresetEvent"]?.(_0x2e8d99) || {
    'ok': ![]
  }], ["/api/v2/desktop/text-preset/get-global-shortcut-status", () => _0x1f6f5a["getGlobalTextPresetShortcutStatus"]?.() || null], ['/api/v2/desktop/clipboard/write-text', _0x3394ff => _0x378d12()["writeText"](_0x3394ff)], ["/api/v2/desktop/clipboard/read-text", () => _0x378d12()['readText']()], ["/api/v2/desktop/clipboard/read-image", () => _0x378d12()["readImage"]()], ["/api/v2/desktop/clipboard/write-file-references", _0x5b0494 => _0x378d12()["writeFileReferences"](_0x5b0494)], ['/api/v2/desktop/clipboard/read-file-references', () => _0x378d12()['readFileReferences']()]]);
}
export function startDesktopHttpBridge({
  token: _0x319542,
  handlers: _0x2c187d,
  logEvent = null,
  closeGraceMs = DEFAULT_CLOSE_GRACE_MS
} = {}) {
  const _0xb84ffc = _0x2c187d instanceof Map ? _0x2c187d : createDesktopHttpBridgeHandlers(_0x2c187d);
  const _0x567fdf = new Set();
  const _0x1bf394 = a209_0x16d26d["createServer"](async (_0x27caa6, _0xad70f4) => {
    if (_0x27caa6['method'] !== 'POST') {
      jsonResponse(_0xad70f4, 0x195, {
        'success': ![],
        'error': "Method not allowed"
      });
      return;
    }
    if (!requireToken(_0x27caa6, _0x319542)) {
      jsonResponse(_0xad70f4, 0x193, {
        'success': ![],
        'error': "Forbidden"
      });
      return;
    }
    const _0x28363b = normalizePathname(_0x27caa6['url']);
    const _0x40674b = _0xb84ffc["get"](_0x28363b);
    if (typeof _0x40674b !== "function") {
      jsonResponse(_0xad70f4, 0x194, {
        'success': ![],
        'error': "Desktop bridge route not found"
      });
      return;
    }
    try {
      const _0x320e8c = await readJsonBody(_0x27caa6);
      const _0x470d91 = await safeCall(_0x40674b, _0x320e8c);
      jsonResponse(_0xad70f4, 0xc8, {
        'success': !![],
        'data': _0x470d91
      });
    } catch (_0x2eef4a) {
      const _0x270719 = _0x2eef4a?.["message"] === "REQUEST_BODY_TOO_LARGE" ? "Request body too large" : String(_0x2eef4a?.['message'] || _0x2eef4a);
      logEvent?.({
        'type': 'desktop_http_bridge.request_failed',
        'level': 'warn',
        'source': 'main',
        'message': _0x270719,
        'error': _0x2eef4a,
        'context': {
          'path': _0x28363b
        }
      });
      jsonResponse(_0xad70f4, _0x270719 === "Request body too large" ? 0x19d : 0x1f4, {
        'success': ![],
        'error': _0x270719
      });
    }
  });
  _0x1bf394['on']("connection", _0x148433 => {
    _0x567fdf['add'](_0x148433);
    _0x148433["once"]("close", () => _0x567fdf["delete"](_0x148433));
  });
  const _0x34d3ac = normalizeCloseGraceMs(closeGraceMs);
  let _0x3e1055 = null;
  const _0x103ca2 = () => {
    if (_0x3e1055) {
      return _0x3e1055;
    }
    _0x3e1055 = new Promise((_0x30540c, _0x1c7118) => {
      let _0x298bf2 = ![];
      let _0x59adad = null;
      const _0x164150 = (_0x323e0b = null) => {
        if (_0x298bf2) {
          return;
        }
        _0x298bf2 = !![];
        if (_0x59adad) {
          clearTimeout(_0x59adad);
        }
        if (_0x323e0b) {
          _0x1c7118(createDesktopHttpBridgeCloseError(_0x323e0b));
          return;
        }
        _0x30540c();
      };
      const _0x3ffa66 = (_0x158c0e = null) => {
        let _0x467fdb = _0x158c0e;
        try {
          _0x1bf394["closeAllConnections"]?.();
        } catch (_0x90e6ea) {
          _0x467fdb = _0x90e6ea;
        }
        for (const _0x5be513 of _0x567fdf) {
          try {
            _0x5be513["destroy"]();
          } catch (_0x7f19fd) {
            _0x467fdb ||= _0x7f19fd;
          }
        }
        _0x164150(_0x467fdb);
      };
      try {
        _0x1bf394["close"](_0xde1059 => _0x164150(_0xde1059 || null));
        _0x1bf394['closeIdleConnections']?.();
        !_0x298bf2 && (_0x59adad = setTimeout(_0x3ffa66, _0x34d3ac), _0x59adad["unref"]?.());
      } catch (_0x163364) {
        _0x3ffa66(_0x163364);
      }
    });
    void _0x3e1055["catch"](_0x5db593 => {
      try {
        logEvent?.({
          'type': "desktop_http_bridge.close_failed",
          'level': 'error',
          'source': 'main',
          'message': _0x5db593["message"],
          'error': _0x5db593,
          'context': {
            'closeGraceMs': _0x34d3ac
          }
        });
      } catch {}
    });
    return _0x3e1055;
  };
  return new Promise((_0x47a4d6, _0x2e864a) => {
    _0x1bf394['once']("error", _0x2e864a);
    _0x1bf394["listen"](0x0, '127.0.0.1', () => {
      _0x1bf394['off']("error", _0x2e864a);
      const _0x56fe51 = _0x1bf394["address"]();
      const _0x2eb01a = typeof _0x56fe51 === "object" && _0x56fe51 ? _0x56fe51["port"] : 0x0;
      _0x47a4d6({
        'url': "http://127.0.0.1:" + _0x2eb01a,
        'token': String(_0x319542 || ''),
        'close': _0x103ca2
      });
    });
  });
}