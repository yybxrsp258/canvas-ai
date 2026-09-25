import { app, autoUpdater as a255_0x2a6dbb, BrowserWindow, dialog, Menu, nativeImage, Notification, powerSaveBlocker, protocol, safeStorage, screen, session, shell, WebContentsView } from 'electron';
import a255_0x23a439 from 'electron-updater';
import { execFileSync, spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { createWriteStream, existsSync, mkdirSync, readFileSync, realpathSync, readdirSync, renameSync, statSync, writeFileSync } from 'node:fs';
import a255_0x2f1592 from 'node:http';
import a255_0x3f9775 from 'node:path';
import { fileURLToPath } from 'node:url';
import { installAppMenu } from './appMenu.js';
import { resolveApplicationResourceRoot } from './applicationResourceRoot.js';
import { APP_WINDOW_MIN_HEIGHT, APP_WINDOW_MIN_WIDTH } from './appWindowSizePolicy.js';
import { createAssetCapabilityOperations } from './assetCapabilityOperations.js';
import { createImageDerivativeWorker } from './imageDerivativeWorker.js';
import { createLocalPreviewProtocolRuntime } from './localPreviewProtocolRuntime.js';
import { resolveExistingPathWithinRoot } from './localPathContainment.js';
import { createMediaTaskRuntime } from './mediaTaskRuntime.js';
import { createDeviceIdentityManager } from './deviceIdentity.js';
import { createDiagnosticsManager } from './diagnostics.js';
import { createForegroundDialogPresenter } from './dialogPresenter.js';
import { createDoubaoAsrConfigResolver } from './doubaoAsrConfig.js';
import { createBailianAsrConfigResolver } from './bailianAsrConfig.js';
import { formatExternalUrlForLog, normalizeExternalUrl } from './externalLinks.js';
import { createLocalAssetCleanupManager } from './localAssetCleanup.js';
import { createLocalAssetCleanupRootsResolver, readFileSavePathsForLocalCleanup } from './localAssetCleanupRoots.js';
import { syncRecentProjectsToSystemRecentDocuments } from './recentDocuments.js';
import { installRecoverySnapshotBeforeClose, requestRendererRecoverySnapshot } from './recoverySnapshot.js';
import { createSecureSettingsStore } from './secureSettingsStore.js';
import { createScreenshotOverlayController } from './screenshotOverlayController.js';
import { createGlobalCaptureControllers } from './globalCaptureControllers.js';
import { buildLegacyFileSavePathEnv, createStorageRoots } from './storageRoots.js';
import { readUserSettingsFromFilesSync } from './fileSaveSettingsReader.js';
import { resolveFunasrModelRootDir } from './funasrModelRoot.js';
import { createUpdaterController } from './updaterController.js';
import { extractPreviewVideoUrlFromNotes, normalizeUpdaterInfoPayload } from './updaterInfoNormalizer.js';
import { createUpdateInstallPreparation } from './updateInstallPreparation.js';
import { resolveAsrRuntimePythonCommand, resolvePreferredRuntimePythonCommand } from './pythonRuntimeResolver.js';
import { createNodeExportController } from './nodeExportController.js';
import { createProjectPackageController } from './projectPackageController.js';
import { buildProjectOpenResponse } from './projectCapabilityOperations.js';
import { createSystemNotificationSoundFileService, listNotificationSoundMp3Files } from './notificationSoundFiles.js';
import { createBackgroundCompletionNotifier } from './backgroundCompletionNotification.js';
import { resolveBackendLaunchSpec } from './backendLaunchResolver.js';
import { findVerifiedBackendProcessPids } from './backendProcessIdentity.js';
import { activateMainWindow } from './mainWindowActivation.js';
import { buildMainIpcHandlerDeps, createMainIpcHandlerInstaller } from './ipc/mainIpcSetup.js';
import { createLocalRuntimeKeepAliveController } from './localRuntimeKeepAlive.js';
import { configureRendererResponsiveness } from './rendererResponsiveness.js';
import { createRemoteAssetImporter } from './remoteAssetImport.js';
import { buildRuntimePythonCertificateEnv, buildRuntimeToolEnv, resolveRuntimeRoot, resolveRuntimeToolPath } from './runtimeAssetResolver.js';
import { installWindowsTaskbarIdentity } from './windowsTaskbarIdentity.js';
import { createWebPreviewViewManager } from './webPreviewViewManager.js';
import { createNativeContextMenuIconFactory } from './nativeContextMenuIcons.js';
import { createStartupHelpers } from './mainStartupHelpers.js';
import { findFirstSupportedProjectPathFromArgs, getRecoverySnapshotInfo as a255_0x1dc5df, readRecoverySnapshot as a255_0x337e43, removeRecoverySnapshot as a255_0x4687fd, SUPPORTED_PROJECT_FILE_EXTENSIONS, upsertRecentProject, writeRecoverySnapshot as a255_0x88f4cd } from '../src/services/desktopProjectFileStore.js';
import { buildChromeShellStartupMetadataUrl, CHROME_SHELL_STARTUP_READY_EVENT } from '../src/services/chromeShellStartupReadiness.js';
import { registerIpcHandlers } from './ipc/registerIpcHandlers.js';
import { checkChromeShellBrowserVersionBeforeLaunch } from './chromeShellBrowserVersion.js';
import { activateChromeShellWindowSoon, closeChromeShellLaunchForUpdate, focusChromeShellLaunchWindow, isChromeShellLaunchActive, resolveChromeShellBrowserExecutable, resolveChromeShellProfileDir, shouldQuitWhenAllElectronWindowsClosed } from './chromeShellLauncher.js';
import { createCanvasRuntimeModeController } from './canvasRuntimeMode.js';
import { promptForChromeShellStartupFailure, promptForMissingChromeShellBrowser } from './chromeShellStartupFallback.js';
import { createChromeShellProfileRecovery, runChromeShellStartupWithProfileRecovery } from './chromeShellProfileRecovery.js';
import { startChromeShellRuntime } from './chromeShellRuntime.js';
import { createDesktopStartupLifecycle } from './desktopStartupLifecycle.js';
import { launchMonitoredBackendProcess } from './backendStartupMonitor.js';
import { createChromeShellStartupHealthController, resolveChromeShellStartupReadyTimeoutMs } from './chromeShellStartupHealth.js';
import { installDevReloadShortcuts } from './devReloadShortcuts.js';
import { startDesktopHttpBridge } from './desktopHttpBridge.js';
import { buildLegacyRendererStorageMigrationAppUrl, createLegacyRendererStorageMigration } from './legacyRendererStorageMigration.js';
import { reclaimStartupPort } from './startupPortRecovery.js';
import { collectListeningPortPids, probeTcpPortAvailable } from './startupPortInspector.js';
import { resolveWindowsSystemToolPath } from './windowsSystemTools.js';
const APP_DISPLAY_NAME = 'Canvas AI';
const APP_USER_MODEL_ID = app['isPackaged'] ? 'com.canvasai.app' : "com.canvasai.app.dev";
const APP_USER_DATA_DIRNAME = 'Canvas AI';
const APP_USER_DATA_ROOT = process["env"]["AICANVAS_TEST_USER_DATA_DIR"] ? a255_0x3f9775['resolve'](process["env"]["AICANVAS_TEST_USER_DATA_DIR"]) : a255_0x3f9775["join"](app["getPath"]("appData"), APP_USER_DATA_DIRNAME);
const APP_TEST_SESSION_DATA_ROOT = process["env"]["AICANVAS_TEST_SESSION_DATA_DIR"] ? a255_0x3f9775["resolve"](process["env"]['AICANVAS_TEST_SESSION_DATA_DIR']) : process['env']['AICANVAS_TEST_USER_DATA_DIR'] ? a255_0x3f9775["join"](APP_USER_DATA_ROOT, "session") : '';
const __filename = fileURLToPath(import.meta["url"]);
const __dirname = a255_0x3f9775["dirname"](__filename);
const APP_ROOT = resolveApplicationResourceRoot(app["isPackaged"] ? app["getAppPath"]() : a255_0x3f9775['resolve'](__dirname, '..'));
const APP_WINDOW_ICON_PATH = process['platform'] === "win32" ? a255_0x3f9775["join"](APP_ROOT, "build", "app-icon.ico") : undefined;
const APP_WINDOW_SIZE_GUARD_DLL_PATH = a255_0x3f9775["join"](APP_ROOT, 'native', "window-size-guard", "bin", "window-size-guard-x64.dll");
const RUNTIME_ROOT = resolveRuntimeRoot({
  'appIsPackaged': app["isPackaged"],
  'appRoot': APP_ROOT,
  'resourcesPath': process["resourcesPath"]
});
const STORAGE_ROOTS = createStorageRoots({
  'appIsPackaged': app["isPackaged"],
  'appRoot': APP_ROOT,
  'processExecPath': process["execPath"],
  'userDataRoot': APP_USER_DATA_ROOT,
  'localAppData': process["env"]["LOCALAPPDATA"]
});
const PACKAGED_INSTALL_ROOT = STORAGE_ROOTS["installRoot"];
const PACKAGED_INSTALL_DATA_ROOT = STORAGE_ROOTS["installDataRoot"];
const PACKAGED_FILES_ROOT = STORAGE_ROOTS["storageRoot"];
const LEGACY_PACKAGED_FILES_ROOTS = STORAGE_ROOTS['legacyFilesRoots'];
const HOST = "127.0.0.1";
const PORT = Number["parseInt"](process['env']["AICANVAS_PORT"] || "8777", 0xa) || 0x2249;
const APP_ORIGIN = "http://" + HOST + ':' + PORT;
const APP_URL = APP_ORIGIN + '/';
const SERVER_READY_TIMEOUT_MS = /^(?:[1-9]\d*)$/["test"](process["env"]["AICANVAS_SERVER_READY_TIMEOUT_MS"] || '') ? Number['parseInt'](process["env"]["AICANVAS_SERVER_READY_TIMEOUT_MS"], 0xa) : 0x1d4c0;
const SERVER_READY_INTERVAL_MS = 0x190;
const LOCAL_ACCESS_TOKEN = randomBytes(0x20)["toString"]("hex");
const SERVER_ID_HEADER = "x-aicanvas-server";
const SERVER_ID_VALUE = "Canvas AI";
const LOCAL_PREVIEW_SCHEME = 'aic-local-preview';
const LOCAL_PREVIEW_TTL_MS = 0xc * 0x3c * 0x3c * 0x3e8;
const CLIPBOARD_FILE_REFERENCES_FORMAT = "application/x-ai-canvas-file-references";
const RECOVERY_SNAPSHOT_FILENAME = 'recovery-snapshot.json';
const GLOBAL_SCREENSHOT_ACCELERATOR = "Alt+Q";
const GLOBAL_CAPTURE_LAUNCHER_ACCELERATOR = "Alt+C";
let mainWindow = null;
let spawnedServer = null;
let updaterHandlersInstalled = ![];
let updateCheckStarted = ![];
let autoUpdaterInstance = null;
let updaterFeedConfigApplied = ![];
let updaterController = null;
let localApiTokenHeaderInstalled = ![];
let latestUpdaterEvent = null;
let latestUpdaterInfo = null;
let backendRestartInProgress = ![];
let localAssetCleanupManager = null;
let secureSettingsStore = null;
let updateInstallPreparation = null;
let chromeShellLaunch = null;
let chromeShellBrowserWorker = null;
let chromeShellWebPreviewManager = null;
let desktopHttpBridge = null;
let chromeShellStartupInProgress = ![];
let chromeShellStartupSettledPromise = Promise["resolve"]();
function isAssetImportLoggingEnabled() {
  return /^(1|true|yes|on)$/i["test"](String(process["env"]["AIC_ASSET_IMPORT_LOG"] || '')["trim"]());
}
let rendererProjectState = {
  'hasUnsavedChanges': ![],
  'projectName': ''
};
let isQuittingForUpdate = ![];
const pendingExternalProjectOpenRequests = [];
const taskbarProgressSources = new Map();
const powerSaveBlockerReasons = new Map();
const chromeShellStartupHealth = createChromeShellStartupHealthController();
const canvasRuntimeMode = createCanvasRuntimeModeController({
  'env': process['env'],
  'appIsPackaged': app['isPackaged'],
  'platform': process['platform']
});
const desktopStartupLifecycle = createDesktopStartupLifecycle({
  'app': app,
  'getSpawnedServer': () => spawnedServer,
  'probeServer': probeServer,
  'clearPortBeforeStart': clearPortBeforeStart,
  'ensureServerRunning': ensureServerRunning
});
configureRendererResponsiveness(app);
protocol["registerSchemesAsPrivileged"]([{
  'scheme': LOCAL_PREVIEW_SCHEME,
  'privileges': {
    'standard': !![],
    'secure': !![],
    'supportFetchAPI': !![],
    'corsEnabled': !![],
    'stream': !![]
  }
}]);
app["setName"](APP_DISPLAY_NAME);
if (process["platform"] === "win32") {
  app["setAppUserModelId"](APP_USER_MODEL_ID);
}
mkdirSync(APP_USER_DATA_ROOT, {
  'recursive': !![]
});
app["setPath"]("userData", APP_USER_DATA_ROOT);
APP_TEST_SESSION_DATA_ROOT && (mkdirSync(APP_TEST_SESSION_DATA_ROOT, {
  'recursive': !![]
}), app['setPath']("sessionData", APP_TEST_SESSION_DATA_ROOT));
const GOT_SINGLE_INSTANCE_LOCK = app['requestSingleInstanceLock']();
!GOT_SINGLE_INSTANCE_LOCK && (console['warn']('[electron]\x20' + APP_DISPLAY_NAME + '\x20launcher\x20is\x20already\x20running;\x20forwarding\x20to\x20the\x20existing\x20instance.'), app["exit"](0x0), process['exit'](0x0));
const USER_DATA_DIR = APP_USER_DATA_ROOT;
const LOG_DIR = a255_0x3f9775["join"](USER_DATA_DIR, "logs");
const SERVER_LOG_PATH = a255_0x3f9775["join"](LOG_DIR, "server.log");
const WINDOW_STATE_PATH = a255_0x3f9775["join"](USER_DATA_DIR, "window-state.json");
const LEGACY_CHROME_SHELL_BROWSER_CHOICE_PATH = a255_0x3f9775["join"](USER_DATA_DIR, "chrome-shell-browser-choice.json");
mkdirSync(LOG_DIR, {
  'recursive': !![]
});
const legacyRendererStorageMigration = createLegacyRendererStorageMigration({
  'userDataDir': USER_DATA_DIR,
  'appUrl': APP_URL,
  'createWindow': () => new BrowserWindow({
    'show': ![],
    'webPreferences': {
      'nodeIntegration': ![],
      'contextIsolation': !![],
      'sandbox': !![],
      'backgroundThrottling': ![]
    }
  })
});
const DEFAULT_WINDOW_STATE = {
  'width': 0x5a0,
  'height': 0x3c0,
  'isMaximized': ![]
};
const diagnostics = createDiagnosticsManager({
  'app': app,
  'logDir': LOG_DIR,
  'diagnosticsDir': a255_0x3f9775["join"](LOG_DIR, "diagnostics"),
  'serverLogPath': SERVER_LOG_PATH,
  'getMetadata': async () => {
    const _0x3dc949 = await requestLocalJson('/api/v2/runtime/info')["catch"](() => null);
    return {
      'app': {
        'name': APP_DISPLAY_NAME,
        'version': readAppVersionFromIndexHtml() || app["getVersion"](),
        'packaged': app["isPackaged"],
        'appPathType': app['isPackaged'] ? 'packaged' : "development"
      },
      'runtime': {
        'electron': process["versions"]["electron"] || '',
        'chrome': process['versions']["chrome"] || '',
        'node': process["versions"]["node"] || '',
        'v8': process["versions"]['v8'] || ''
      },
      'backend': {
        'url': APP_URL,
        'spawned': Boolean(spawnedServer),
        'pid': spawnedServer?.["pid"] || null,
        'ready': Boolean(_0x3dc949?.['success']),
        'outboundTls': _0x3dc949?.["outboundTls"] || null
      },
      'updater': {
        ...(updaterController?.["getState"]?.() || {}),
        'latestEvent': latestUpdaterEvent || null,
        'latestInfo': latestUpdaterInfo || null
      },
      'paths': {
        'logs': 'userData/logs',
        'diagnostics': 'userData/logs/diagnostics\x20or\x20Downloads'
      }
    };
  }
});
const foregroundDialogs = createForegroundDialogPresenter({
  'app': app,
  'dialog': dialog,
  'getMainWindow': () => mainWindow,
  'shouldUseOwnerWindow': () => canvasRuntimeMode['shouldUseChromeShellRuntime']()
});
const showOpenDialog = foregroundDialogs["showOpenDialog"];
const showSaveDialog = foregroundDialogs["showSaveDialog"];
const getDialogParentWindow = foregroundDialogs["getDialogParentWindow"];
const screenshotOverlayController = createScreenshotOverlayController({
  'appRoot': APP_ROOT,
  'dirname': __dirname,
  'accelerator': GLOBAL_SCREENSHOT_ACCELERATOR,
  'getMainWindow': () => mainWindow,
  'focusCanvas': () => focusMainWindow(),
  'logDiagnosticEvent': logDiagnosticEvent
});
const {
  globalCaptureWindowController,
  globalTextPresetShortcutController
} = createGlobalCaptureControllers({
  'dirname': __dirname,
  'accelerator': GLOBAL_CAPTURE_LAUNCHER_ACCELERATOR,
  'focusCanvas': () => focusMainWindow(),
  'getMainWindow': () => mainWindow,
  'logDiagnosticEvent': logDiagnosticEvent
});
diagnostics['ensureInitialFiles']();
function logDiagnosticEvent(_0x18b00a = {}) {
  const _0xa4145d = chromeShellStartupHealth['observeDiagnosticEvent'](_0x18b00a);
  const _0x304358 = diagnostics["logEvent"](_0x18b00a);
  return _0x18b00a?.["type"] === CHROME_SHELL_STARTUP_READY_EVENT ? {
    ..._0x304358,
    'startupReadyAccepted': _0xa4145d
  } : _0x304358;
}
const localRuntimeKeepAlive = createLocalRuntimeKeepAliveController({
  'getWindow': () => mainWindow,
  'requestLocalJson': requestLocalJson,
  'setPowerSaveBlocker': setPowerSaveBlocker,
  'logDiagnosticEvent': logDiagnosticEvent
});
const {
  delay,
  loadStartupStatus,
  isLocalAppUrl,
  openExternalUrl
} = createStartupHelpers({
  'appDisplayName': APP_DISPLAY_NAME,
  'appOrigin': APP_ORIGIN,
  'getMainWindow': () => mainWindow,
  'logDiagnosticEvent': logDiagnosticEvent,
  'shellApi': shell,
  'normalizeExternalUrl': normalizeExternalUrl,
  'formatExternalUrlForLog': formatExternalUrlForLog
});
function normalizeTaskbarProgress(_0x163295) {
  const _0x53a514 = Number(_0x163295);
  if (!Number["isFinite"](_0x53a514) || _0x53a514 < 0x0) {
    return null;
  }
  return Math['max'](0x0, Math["min"](0x1, _0x53a514));
}
function refreshTaskbarProgress() {
  if (!mainWindow || mainWindow['isDestroyed']()) {
    return;
  }
  const _0x58abb1 = taskbarProgressSources["get"]("updater") ?? taskbarProgressSources["get"]('media') ?? null;
  mainWindow['setProgressBar'](_0x58abb1 == null ? -0x1 : _0x58abb1);
}
function setTaskbarProgressSource(_0x43f00, _0x30c6b4) {
  const _0x402bc8 = String(_0x43f00 || '')["trim"]();
  if (!_0x402bc8) {
    return;
  }
  const _0x3cfd6d = normalizeTaskbarProgress(_0x30c6b4);
  _0x3cfd6d == null ? taskbarProgressSources['delete'](_0x402bc8) : taskbarProgressSources["set"](_0x402bc8, _0x3cfd6d);
  refreshTaskbarProgress();
}
function setPowerSaveBlocker(_0x590999, _0x1cabb3, _0x427888 = "prevent-display-sleep") {
  const _0x34136c = String(_0x590999 || '')["trim"]();
  if (!_0x34136c) {
    return;
  }
  const _0x2b334a = _0x427888 === 'prevent-app-suspension' ? "prevent-app-suspension" : "prevent-display-sleep";
  if (_0x1cabb3) {
    if (powerSaveBlockerReasons["has"](_0x34136c)) {
      return;
    }
    const _0x4544a1 = powerSaveBlocker["start"](_0x2b334a);
    powerSaveBlockerReasons["set"](_0x34136c, _0x4544a1);
    logDiagnosticEvent({
      'type': "power_save_blocker.started",
      'level': "info",
      'source': "main",
      'message': "Power save blocker started",
      'context': {
        'reason': _0x34136c,
        'blockerId': _0x4544a1,
        'type': _0x2b334a
      }
    });
    return;
  }
  const _0x44edd1 = powerSaveBlockerReasons["get"](_0x34136c);
  if (_0x44edd1 == null) {
    return;
  }
  powerSaveBlockerReasons["delete"](_0x34136c);
  try {
    powerSaveBlocker["isStarted"](_0x44edd1) && powerSaveBlocker["stop"](_0x44edd1);
  } catch (_0x43a5ac) {
    console["warn"]('[electron]\x20failed\x20to\x20stop\x20power\x20save\x20blocker:', _0x43a5ac);
  }
  logDiagnosticEvent({
    'type': "power_save_blocker.stopped",
    'level': "info",
    'source': "main",
    'message': "Power save blocker stopped",
    'context': {
      'reason': _0x34136c,
      'blockerId': _0x44edd1
    }
  });
}
function stopAllPowerSaveBlockers() {
  for (const _0x43bbb9 of [...powerSaveBlockerReasons["keys"]()]) {
    setPowerSaveBlocker(_0x43bbb9, ![]);
  }
}
function normalizeWindowState(_0x2f251d) {
  const _0x1778b8 = _0x2f251d && typeof _0x2f251d === 'object' ? _0x2f251d : {};
  const _0x69abcb = _0x1778b8["bounds"] && typeof _0x1778b8["bounds"] === "object" ? _0x1778b8['bounds'] : _0x1778b8;
  const _0x1a2cc8 = Number['parseInt'](_0x69abcb['width'], 0xa);
  const _0x4312f8 = Number["parseInt"](_0x69abcb["height"], 0xa);
  const _0x230e69 = Number['parseInt'](_0x69abcb['x'], 0xa);
  const _0x49fad9 = Number["parseInt"](_0x69abcb['y'], 0xa);
  const _0x17fdc1 = {
    'width': Number['isFinite'](_0x1a2cc8) && _0x1a2cc8 >= 0x400 ? _0x1a2cc8 : DEFAULT_WINDOW_STATE["width"],
    'height': Number["isFinite"](_0x4312f8) && _0x4312f8 >= 0x2d0 ? _0x4312f8 : DEFAULT_WINDOW_STATE['height'],
    'isMaximized': _0x1778b8["isMaximized"] === !![]
  };
  Number["isFinite"](_0x230e69) && Number["isFinite"](_0x49fad9) && (_0x17fdc1['x'] = _0x230e69, _0x17fdc1['y'] = _0x49fad9);
  return _0x17fdc1;
}
function isWindowStateOnDisplay(_0x19c0d3) {
  if (!Number["isFinite"](_0x19c0d3?.['x']) || !Number['isFinite'](_0x19c0d3?.['y'])) {
    return !![];
  }
  const _0x54e569 = {
    'x': _0x19c0d3['x'],
    'y': _0x19c0d3['y'],
    'width': _0x19c0d3['width'],
    'height': _0x19c0d3["height"]
  };
  return screen["getAllDisplays"]()["some"](({
    workArea: _0x4cb02f
  }) => {
    return _0x54e569['x'] < _0x4cb02f['x'] + _0x4cb02f["width"] && _0x54e569['x'] + _0x54e569["width"] > _0x4cb02f['x'] && _0x54e569['y'] < _0x4cb02f['y'] + _0x4cb02f["height"] && _0x54e569['y'] + _0x54e569["height"] > _0x4cb02f['y'];
  });
}
function readWindowState() {
  try {
    const _0x5a7f96 = normalizeWindowState(JSON['parse'](readFileSync(WINDOW_STATE_PATH, "utf8")));
    !isWindowStateOnDisplay(_0x5a7f96) && (delete _0x5a7f96['x'], delete _0x5a7f96['y']);
    return _0x5a7f96;
  } catch {
    return {
      ...DEFAULT_WINDOW_STATE
    };
  }
}
function writeWindowState(_0x526d9f) {
  if (!_0x526d9f || _0x526d9f["isDestroyed"]()) {
    return;
  }
  const _0x398d58 = _0x526d9f["getBounds"]();
  const _0x2faad2 = normalizeWindowState({
    ..._0x398d58,
    'isMaximized': _0x526d9f["isMaximized"]()
  });
  const _0x180fcc = WINDOW_STATE_PATH + '.' + process["pid"] + '.' + Date["now"]() + ".tmp";
  try {
    mkdirSync(a255_0x3f9775["dirname"](WINDOW_STATE_PATH), {
      'recursive': !![]
    });
    writeFileSync(_0x180fcc, JSON["stringify"](_0x2faad2, null, 0x2) + '\x0a', "utf8");
    renameSync(_0x180fcc, WINDOW_STATE_PATH);
  } catch (_0x28d735) {
    console["warn"]("[electron] failed to save window state:", _0x28d735);
  }
}
function installWindowStatePersistence(_0x209a0f) {
  let _0x766772 = null;
  const _0x47c672 = () => {
    if (_0x766772) {
      clearTimeout(_0x766772);
    }
    _0x766772 = setTimeout(() => {
      _0x766772 = null;
      writeWindowState(_0x209a0f);
    }, 0x190);
  };
  _0x209a0f['on']("move", _0x47c672);
  _0x209a0f['on']("resize", _0x47c672);
  _0x209a0f['on']("maximize", _0x47c672);
  _0x209a0f['on']("unmaximize", _0x47c672);
  _0x209a0f['on']("close", () => {
    _0x766772 && (clearTimeout(_0x766772), _0x766772 = null);
    writeWindowState(_0x209a0f);
  });
}
function probeServer(_0x495865 = 0x4b0) {
  return new Promise(_0x54b1b6 => {
    const _0x239cb6 = a255_0x2f1592['get'](APP_ORIGIN + "/api/v2/runtime/info", {
      'timeout': _0x495865
    }, _0x40e565 => {
      const _0x42bdf3 = String(_0x40e565["headers"][SERVER_ID_HEADER] || '');
      _0x40e565["resume"]();
      _0x54b1b6(_0x40e565['statusCode'] === 0xc8 && _0x42bdf3 === SERVER_ID_VALUE);
    });
    _0x239cb6['on']("timeout", () => {
      _0x239cb6['destroy']();
      _0x54b1b6(![]);
    });
    _0x239cb6['on']("error", () => {
      _0x54b1b6(![]);
    });
  });
}
function requestLocalJson(_0x509c7d, _0x3b2b18 = 0x640) {
  return new Promise((_0x25f663, _0x55e06b) => {
    const _0x3e4a9f = a255_0x2f1592['request']({
      'hostname': HOST,
      'port': PORT,
      'path': _0x509c7d,
      'method': "GET",
      'timeout': _0x3b2b18,
      'headers': {
        'X-AIC-Local-Token': LOCAL_ACCESS_TOKEN
      }
    }, _0x42e3e2 => {
      const _0x18e324 = [];
      _0x42e3e2['on']("data", _0x5d559a => _0x18e324["push"](Buffer["from"](_0x5d559a)));
      _0x42e3e2['on']("end", () => {
        const _0x3a17f7 = Buffer["concat"](_0x18e324)["toString"]("utf8");
        if (_0x42e3e2['statusCode'] < 0xc8 || _0x42e3e2['statusCode'] >= 0x12c) {
          _0x55e06b(new Error(_0x3a17f7 || "HTTP " + _0x42e3e2["statusCode"]));
          return;
        }
        try {
          _0x25f663(_0x3a17f7 ? JSON['parse'](_0x3a17f7) : {});
        } catch (_0x5efafe) {
          _0x55e06b(_0x5efafe);
        }
      });
    });
    _0x3e4a9f['on']("timeout", () => {
      _0x3e4a9f["destroy"](new Error("Local service request timed out"));
    });
    _0x3e4a9f['on']("error", _0x55e06b);
    _0x3e4a9f["end"]();
  });
}
async function clearPortBeforeStart(_0x4e6bfb = null) {
  const _0x314be3 = resolveBackendLaunch();
  return reclaimStartupPort({
    'port': PORT,
    'env': process["env"],
    'collectListeningPortPids': collectListeningPortPids,
    'probePortAvailable': () => probeTcpPortAvailable({
      'host': HOST,
      'port': PORT
    }),
    'confirmRuntimeIdentity': async ({
      pids: _0x3e647d
    }) => {
      if (!(await probeServer())) {
        return [];
      }
      return findVerifiedBackendProcessPids({
        'pids': _0x3e647d,
        'appIsPackaged': app["isPackaged"],
        'appRoot': APP_ROOT,
        'backendCommand': _0x314be3["command"],
        'host': HOST,
        'port': PORT,
        'platform': process["platform"],
        'env': process['env']
      });
    },
    'terminateProcess': _0x50e556 => {
      if (process["platform"] === "win32") {
        const _0x134bce = resolveWindowsSystemToolPath("taskkill", {
          'env': process["env"]
        });
        execFileSync(_0x134bce, ["/PID", String(_0x50e556), '/F', '/T'], {
          'stdio': "ignore",
          'windowsHide': !![]
        });
      } else {
        process["kill"](_0x50e556, "SIGTERM");
      }
    },
    'delayFn': delay,
    'onReclaim': () => _0x4e6bfb?.({
      'kind': "loading",
      'title': APP_DISPLAY_NAME + " 正在启动",
      'detail': '正在恢复上次未关闭的运行环境。',
      'hint': '启动完成后会自动进入画布。'
    }),
    'onEnumerationUnavailable': ({
      error: _0x40cbfe
    }) => {
      logDiagnosticEvent({
        'type': "startup_port.enumeration_unavailable",
        'level': "warn",
        'source': 'main',
        'message': "Startup port listener enumeration failed; the port is free, continuing startup",
        'context': {
          'port': PORT,
          'resolution': "port-free-continue",
          ...(_0x40cbfe?.["details"] || {})
        }
      });
    }
  });
}
function resolvePythonCommand() {
  if (app["isPackaged"]) {
    const _0x4d458a = process['platform'] === "win32" ? [a255_0x3f9775["join"](RUNTIME_ROOT, "python", "python.exe"), a255_0x3f9775["join"](RUNTIME_ROOT, "python", "Scripts", 'python.exe')] : [a255_0x3f9775["join"](RUNTIME_ROOT, "python", "bin", 'python3'), a255_0x3f9775['join'](RUNTIME_ROOT, "python", "bin", "python")];
    return _0x4d458a["find"](_0x3788e1 => existsSync(_0x3788e1)) || _0x4d458a[0x0];
  }
  const _0x250af1 = process["platform"] === "win32" ? [a255_0x3f9775['join'](APP_ROOT, "venv", 'python.exe'), a255_0x3f9775["join"](APP_ROOT, 'venv', "Scripts", "python.exe"), 'python'] : [a255_0x3f9775["join"](APP_ROOT, 'venv', "bin", "python3"), a255_0x3f9775["join"](APP_ROOT, "venv", "bin", "python"), "python3", "python"];
  return _0x250af1["find"](_0x27aa12 => {
    return a255_0x3f9775["isAbsolute"](_0x27aa12) ? existsSync(_0x27aa12) : !![];
  });
}
function resolveBackendLaunch() {
  return resolveBackendLaunchSpec({
    'appIsPackaged': app["isPackaged"],
    'appRoot': APP_ROOT,
    'runtimeRoot': RUNTIME_ROOT,
    'platform': process["platform"],
    'existsSync': existsSync,
    'pythonCommand': resolvePythonCommand()
  });
}
function resolveRuntimeTool(_0xd6cda3) {
  return resolveRuntimeToolPath({
    'name': _0xd6cda3,
    'runtimeRoot': RUNTIME_ROOT,
    'appIsPackaged': app["isPackaged"],
    'appRoot': APP_ROOT,
    'platform': process['platform'],
    'existsSync': existsSync
  });
}
function buildPackagedServerEnv() {
  const _0x2c3d82 = app["getPath"]('userData');
  const _0x55c5ac = getStorageRoot();
  return {
    'AIC_USER_DIR': a255_0x3f9775["join"](_0x2c3d82, "user"),
    'AIC_CANVAS_DIR': a255_0x3f9775["join"](_0x55c5ac, "projects"),
    'AIC_DATA_DIR': a255_0x3f9775["join"](_0x55c5ac, 'data'),
    'AIC_OUTPUT_DIR': a255_0x3f9775["join"](_0x55c5ac, 'output'),
    'AIC_UPLOADS_DIR': a255_0x3f9775["join"](_0x55c5ac, "data", "uploads"),
    'AIC_ASSETS_DIR': a255_0x3f9775["join"](_0x55c5ac, "data", "assets"),
    'AIC_WORKFLOWS_DIR': a255_0x3f9775["join"](_0x55c5ac, "data", "workflows"),
    ...buildLegacyFileSavePathEnv(LEGACY_PACKAGED_FILES_ROOTS),
    ...buildRuntimeToolEnv({
      'runtimeRoot': RUNTIME_ROOT,
      'appIsPackaged': app["isPackaged"],
      'appRoot': APP_ROOT,
      'platform': process['platform'],
      'existsSync': existsSync
    }),
    ...buildRuntimePythonCertificateEnv({
      'runtimeRoot': RUNTIME_ROOT,
      'existsSync': existsSync,
      'readdirSync': readdirSync,
      'env': process["env"]
    })
  };
}
function getStorageRoot() {
  return PACKAGED_FILES_ROOT;
}
function getUserRoot() {
  return a255_0x3f9775["join"](app["getPath"]("userData"), 'user');
}
const {
  getStableDeviceId
} = createDeviceIdentityManager({
  'app': app,
  'appRoot': APP_ROOT,
  'getUserRoot': getUserRoot,
  'logEvent': logDiagnosticEvent
});
const createWebPreviewContextMenuIcon = createNativeContextMenuIconFactory(nativeImage);
const webPreviewViewManager = createWebPreviewViewManager({
  'WebContentsView': WebContentsView,
  'BrowserWindow': BrowserWindow,
  'getMainWindow': () => mainWindow,
  'openExternalUrl': openExternalUrl,
  'createContextMenu': _0x2646dc => Menu["buildFromTemplate"](_0x2646dc),
  'createContextMenuIcon': createWebPreviewContextMenuIcon,
  'logDiagnosticEvent': logDiagnosticEvent
});
const importRemoteAssetToLibrary = createRemoteAssetImporter({
  'importAssetToLibrary': importAssetToLibrary,
  'getWebPreviewEntry': (_0x5cea90, _0x3331aa) => webPreviewViewManager["_getEntry"](_0x5cea90, _0x3331aa),
  'tempRoot': app["getPath"]("temp")
});
const projectPackageController = createProjectPackageController({
  'app': app,
  'dialog': dialog,
  'getMainWindow': () => getDialogParentWindow(),
  'getCanvasProjectDir': getCanvasProjectDir,
  'getOutputDir': getOutputDir,
  'getUploadsDir': getUploadsDir,
  'getAssetsDir': getAssetsDir,
  'getWorkflowsDir': getWorkflowsDir,
  'readAppVersion': () => readAppVersionFromIndexHtml() || app["getVersion"](),
  'upsertRecentProject': upsertRecentProject,
  'getRecentProjectsStorePath': getRecentProjectsStorePath,
  'syncSystemRecentDocumentsBestEffort': syncSystemRecentDocumentsBestEffort,
  'buildProjectOpenResponse': buildProjectOpenResponse,
  'showSaveDialog': showSaveDialog,
  'showOpenDialog': showOpenDialog
});
const nodeExportController = createNodeExportController({
  'app': app,
  'dialog': dialog,
  'getMainWindow': () => getDialogParentWindow(),
  'resolveLocalVirtualPath': resolveLocalVirtualPath,
  'getRuntimeToolOrFallback': getRuntimeToolOrFallback,
  'showSaveDialog': showSaveDialog,
  'showOpenDialog': showOpenDialog,
  'openPath': _0x5c019b => shell["openPath"](_0x5c019b)
});
const systemNotificationSoundFiles = createSystemNotificationSoundFileService({
  'appRoot': APP_ROOT,
  'openPath': _0x5ae95e => shell["openPath"](_0x5ae95e),
  'spawnProcess': spawn,
  'platform': process['platform'],
  'logEvent': logDiagnosticEvent
});
const backgroundCompletionNotifier = createBackgroundCompletionNotifier({
  'Notification': Notification,
  'getMainWindow': () => mainWindow,
  'focusMainWindow': focusMainWindow,
  'onClick': _0x2aa263 => mainWindow && !mainWindow["isDestroyed"]?.() && mainWindow['webContents']?.['send']?.("notification:generationCompleteClicked", _0x2aa263),
  'logEvent': logDiagnosticEvent,
  'resolveNotificationIconPath': resolveLocalVirtualPath,
  'appName': APP_DISPLAY_NAME
});
const mainCapabilityContext = {
  'app': app,
  'readAppVersionFromIndexHtml': readAppVersionFromIndexHtml,
  'getStableDeviceId': getStableDeviceId,
  'getUpdaterController': getUpdaterController,
  'getBackgroundCompletionNotifier': () => backgroundCompletionNotifier,
  'getSecureSettingsStore': getSecureSettingsStore,
  'normalizeSecureSettingsKeys': normalizeSecureSettingsKeys,
  'fileReferencesFormat': CLIPBOARD_FILE_REFERENCES_FORMAT,
  'createClipboardNativeImage': createClipboardNativeImage,
  'screenshotOverlayController': screenshotOverlayController,
  'globalCaptureWindowController': globalCaptureWindowController,
  'globalTextPresetShortcutController': globalTextPresetShortcutController,
  'normalizeClipboardFileReferences': normalizeClipboardFileReferences,
  'parseClipboardFileReferencesFromText': parseClipboardFileReferencesFromText,
  ...projectPackageController,
  ...nodeExportController,
  'handleRendererUnsavedState': handleRendererUnsavedState,
  'getRecentProjectsStorePath': getRecentProjectsStorePath,
  'syncSystemRecentDocumentsBestEffort': syncSystemRecentDocumentsBestEffort,
  'pendingExternalProjectOpenRequests': pendingExternalProjectOpenRequests,
  'getCanvasProjectDir': getCanvasProjectDir,
  'showOpenDialog': showOpenDialog,
  'showSaveDialog': showSaveDialog,
  'supportedProjectFileExtensions': SUPPORTED_PROJECT_FILE_EXTENSIONS,
  'getRecoverySnapshotPath': getRecoverySnapshotPath,
  'writeRecoverySnapshotFile': a255_0x88f4cd,
  'getRecoverySnapshotFileInfo': a255_0x1dc5df,
  'readRecoverySnapshotFile': a255_0x337e43,
  'removeRecoverySnapshotFile': a255_0x4687fd,
  'importAssetToLibrary': importAssetToLibrary,
  'importRemoteAssetToLibrary': importRemoteAssetToLibrary,
  'createLocalPreviewUrl': createLocalPreviewUrl,
  'resolveLocalVirtualPath': resolveLocalVirtualPath,
  'resolveKnownFolder': resolveKnownFolder,
  'openExternalUrl': openExternalUrl,
  'getWebPreviewViewManager': () => canvasRuntimeMode["shouldUseChromeShellRuntime"]() ? chromeShellWebPreviewManager : webPreviewViewManager,
  'selectDirectory': selectDirectory,
  'listNotificationSoundMp3Files': listNotificationSoundMp3Files,
  'getDataDir': getDataDir,
  ...systemNotificationSoundFiles,
  'getMediaTaskQueue': getMediaTaskQueue,
  'getLocalAssetCleanupManager': getLocalAssetCleanupManager,
  'consumeAssetUpdateEvents': consumeAssetUpdateEvents,
  'readLegacyRendererStorageMigration': () => legacyRendererStorageMigration['read'](),
  'completeLegacyRendererStorageMigration': _0x28d830 => legacyRendererStorageMigration["complete"](_0x28d830),
  'diagnostics': diagnostics,
  'logDir': LOG_DIR,
  'logDiagnosticEvent': logDiagnosticEvent
};
const mainCapabilityHandlers = buildMainIpcHandlerDeps(mainCapabilityContext);
const installIpcHandlers = createMainIpcHandlerInstaller({
  'registerIpcHandlers': registerIpcHandlers,
  'context': mainCapabilityContext
});
function readConfiguredUserSettingsSync() {
  const _0x50097e = process["env"]["LOCALAPPDATA"] || app["getPath"]("userData");
  return readUserSettingsFromFilesSync([a255_0x3f9775['join'](getUserRoot(), "settings.json"), a255_0x3f9775["join"](APP_ROOT, 'user', "settings.json"), a255_0x3f9775['join'](_0x50097e, "AI-CanvasPro", "settings.json")]);
}
function readConfiguredFileSavePathsSync() {
  const _0x579c46 = readConfiguredUserSettingsSync()?.['fileSavePaths'];
  return _0x579c46 && typeof _0x579c46 === "object" ? _0x579c46 : {};
}
function getConfiguredPath(_0x3712a1, _0x43814f) {
  const _0x35aad8 = String(readConfiguredFileSavePathsSync()?.[_0x3712a1] || '')["trim"]();
  return _0x35aad8 ? a255_0x3f9775['resolve'](_0x35aad8) : _0x43814f;
}
function getDataDir() {
  const _0x59cda4 = readConfiguredFileSavePathsSync();
  const _0x3dc557 = String(_0x59cda4?.['dataDir'] || '')['trim']();
  if (_0x3dc557) {
    return a255_0x3f9775["resolve"](_0x3dc557);
  }
  const _0x27084d = String(_0x59cda4?.["tempDir"] || '')['trim']();
  if (_0x27084d) {
    const _0x48d6cc = a255_0x3f9775["resolve"](_0x27084d);
    return a255_0x3f9775["basename"](_0x48d6cc)["toLowerCase"]() === "uploads" ? a255_0x3f9775["dirname"](_0x48d6cc) : _0x48d6cc;
  }
  return a255_0x3f9775["join"](getStorageRoot(), "data");
}
function getCanvasProjectDir() {
  return getConfiguredPath("canvasDir", a255_0x3f9775["join"](getStorageRoot(), "projects"));
}
function getRecentProjectsStorePath() {
  return a255_0x3f9775["join"](app["getPath"]("userData"), 'recent-projects.json');
}
function getSecureSettingsStorePath() {
  return a255_0x3f9775["join"](app["getPath"]("userData"), "secure-settings.json");
}
function getRecoverySnapshotPath() {
  return a255_0x3f9775["join"](app["getPath"]('userData'), RECOVERY_SNAPSHOT_FILENAME);
}
function getUploadsDir() {
  const _0x3e23f2 = readConfiguredFileSavePathsSync();
  if (!String(_0x3e23f2?.["dataDir"] || '')["trim"]() && String(_0x3e23f2?.["tempDir"] || '')['trim']()) {
    return a255_0x3f9775["resolve"](_0x3e23f2["tempDir"]);
  }
  return a255_0x3f9775["join"](getDataDir(), 'uploads');
}
function getOutputDir() {
  return getConfiguredPath("outputDir", a255_0x3f9775["join"](getStorageRoot(), "output"));
}
function getAssetsDir() {
  return a255_0x3f9775["join"](getDataDir(), 'assets');
}
function getWorkflowsDir() {
  return a255_0x3f9775["join"](getDataDir(), "workflows");
}
function getFunasrModelRootDir() {
  return resolveFunasrModelRootDir(readConfiguredUserSettingsSync(), {
    'fallbackDataDir': getDataDir()
  });
}
const localPreviewProtocolRuntime = createLocalPreviewProtocolRuntime({
  'protocol': protocol,
  'scheme': LOCAL_PREVIEW_SCHEME,
  'appOrigin': APP_ORIGIN,
  'ttlMs': LOCAL_PREVIEW_TTL_MS,
  'resolveLocalVirtualPath': resolveLocalVirtualPath
});
function createLocalPreviewUrl(_0x4fc4a1 = {}) {
  return localPreviewProtocolRuntime["createUrl"](_0x4fc4a1);
}
function installLocalPreviewProtocol() {
  localPreviewProtocolRuntime["install"]();
}
let mediaTaskRuntime = null;
function getRuntimeToolOrFallback(_0x31842f) {
  return resolveRuntimeTool(_0x31842f) || _0x31842f;
}
function getMediaTaskRuntime() {
  if (mediaTaskRuntime) {
    return mediaTaskRuntime;
  }
  mediaTaskRuntime = createMediaTaskRuntime({
    'appRoot': APP_ROOT,
    'platform': process['platform'],
    'env': process["env"],
    'getRuntimeToolOrFallback': getRuntimeToolOrFallback,
    'getAssetsDir': getAssetsDir,
    'getOutputDir': getOutputDir,
    'resolveLocalVirtualPath': resolveLocalVirtualPath,
    'updateAssetRecord': updateAssetRecord,
    'sendAssetUpdated': sendAssetUpdated,
    'setTaskbarProgressSource': setTaskbarProgressSource,
    'setPowerSaveBlocker': setPowerSaveBlocker,
    'NotificationCtor': Notification,
    'focusMainWindow': focusMainWindow,
    'publishTaskUpdate': _0xf5a61 => {
      mainWindow?.["webContents"]?.['send']("mediaTask:update", _0xf5a61);
    },
    'getDoubaoAsrConfig': resolveDoubaoAsrConfig,
    'getBailianAsrConfig': resolveBailianAsrConfig,
    'getPythonCertificateEnv': () => buildRuntimePythonCertificateEnv({
      'runtimeRoot': RUNTIME_ROOT,
      'existsSync': existsSync,
      'readdirSync': readdirSync,
      'env': process['env']
    }),
    'getFunasrModelRootDir': getFunasrModelRootDir,
    'getUserDataRoot': () => app["getPath"]("userData"),
    'resolveFallbackPythonCommand': () => resolvePreferredRuntimePythonCommand({
      'existsSync': existsSync,
      'fallbackCommand': resolvePythonCommand(),
      'platform': process['platform'],
      'runtimeRoot': RUNTIME_ROOT
    }),
    'resolvePythonCommand': () => resolveAsrRuntimePythonCommand({
      'userDataRoot': app["getPath"]('userData'),
      'existsSync': existsSync,
      'readFileSync': readFileSync,
      'fallbackCommand': resolvePreferredRuntimePythonCommand({
        'existsSync': existsSync,
        'fallbackCommand': resolvePythonCommand(),
        'platform': process['platform'],
        'runtimeRoot': RUNTIME_ROOT
      }),
      'platform': process['platform']
    })
  });
  return mediaTaskRuntime;
}
function getMediaTaskQueue() {
  return getMediaTaskRuntime()["getQueue"]();
}
function ffprobeVideoPlaybackInfoForImport(_0x2264d5) {
  return getMediaTaskRuntime()["probeVideoPlaybackInfoForImport"](_0x2264d5);
}
let assetCapabilityOperations = null;
function getAssetCapabilityOperations() {
  if (assetCapabilityOperations) {
    return assetCapabilityOperations;
  }
  assetCapabilityOperations = createAssetCapabilityOperations({
    'getAssetsDir': getAssetsDir,
    'getMediaTaskQueue': getMediaTaskQueue,
    'createImageFromPath': _0x28d3ce => nativeImage["createFromPath"](_0x28d3ce),
    'createImageDerivatives': createImageDerivativeWorker({
      'BrowserWindow': BrowserWindow
    }),
    'probeVideoPlaybackInfo': ffprobeVideoPlaybackInfoForImport,
    'publishAssetUpdate': _0x456596 => {
      mainWindow?.["webContents"]?.['send']("asset:updated", _0x456596);
    },
    'shouldBufferAssetUpdates': () => canvasRuntimeMode["shouldUseChromeShellRuntime"](),
    'isImportLoggingEnabled': isAssetImportLoggingEnabled
  });
  return assetCapabilityOperations;
}
function importAssetToLibrary(_0x475551 = {}) {
  return getAssetCapabilityOperations()['importAssetToLibrary'](_0x475551);
}
function updateAssetRecord(_0x3652fb, _0xe6b14f, _0x32445a = {}) {
  return getAssetCapabilityOperations()["updateAssetRecord"](_0x3652fb, _0xe6b14f, _0x32445a);
}
function sendAssetUpdated(_0x1e1401) {
  return getAssetCapabilityOperations()["sendAssetUpdated"](_0x1e1401);
}
function consumeAssetUpdateEvents() {
  return getAssetCapabilityOperations()['consumeAssetUpdateEvents']();
}
function toAssetLocalPath(..._0x42994e) {
  return getAssetCapabilityOperations()['toAssetLocalPath'](..._0x42994e);
}
function installLocalApiTokenHeader() {
  if (localApiTokenHeaderInstalled) {
    return;
  }
  localApiTokenHeaderInstalled = !![];
  session['defaultSession']["webRequest"]["onBeforeSendHeaders"]({
    'urls': [APP_ORIGIN + "/api/*", 'http://localhost:' + PORT + "/api/*"]
  }, (_0x53e1ca, _0x39b9e6) => {
    _0x39b9e6({
      'requestHeaders': {
        ..._0x53e1ca['requestHeaders'],
        'X-AIC-Local-Token': LOCAL_ACCESS_TOKEN
      }
    });
  });
}
async function waitForServerReady(_0x1b5124 = null, _0x4ec722 = null) {
  const _0x2dae93 = Date["now"]();
  while (Date["now"]() - _0x2dae93 < SERVER_READY_TIMEOUT_MS) {
    const _0x691b04 = _0x4ec722 ? await Promise['race']([probeServer(), _0x4ec722]) : await probeServer();
    if (_0x691b04) {
      return !![];
    }
    const _0x29e1b5 = Date["now"]() - _0x2dae93;
    _0x1b5124?.({
      'kind': "loading",
      'title': APP_DISPLAY_NAME + " 正在启动",
      'detail': "正在准备画布环境。",
      'hint': "已等待 " + Math["ceil"](_0x29e1b5 / 0x3e8) + '\x20秒，预计最多需要\x20' + Math['ceil'](SERVER_READY_TIMEOUT_MS / 0x3e8) + " 秒。"
    });
    _0x4ec722 ? await Promise["race"]([delay(SERVER_READY_INTERVAL_MS), _0x4ec722]) : await delay(SERVER_READY_INTERVAL_MS);
  }
  return ![];
}
async function ensureServerRunning(_0x211ca9 = null) {
  _0x211ca9?.({
    'kind': "loading",
    'title': APP_DISPLAY_NAME + " 正在启动",
    'detail': "正在准备画布环境。",
    'hint': "启动完成后会自动进入画布。"
  });
  const _0x469165 = await probeServer();
  desktopStartupLifecycle["assertStarting"]();
  if (_0x469165) {
    _0x211ca9?.({
      'kind': "loading",
      'title': APP_DISPLAY_NAME + " 正在启动",
      'detail': "正在打开画布。",
      'hint': ''
    });
    return "reused";
  }
  const _0x2df352 = resolveBackendLaunch();
  _0x211ca9?.({
    'kind': 'loading',
    'title': APP_DISPLAY_NAME + " 正在启动",
    'detail': "正在加载本地工作环境。",
    'hint': "启动完成后会自动进入画布。"
  });
  const _0x5cd20b = createWriteStream(SERVER_LOG_PATH, {
    'flags': 'a'
  });
  _0x5cd20b['write']('\x0a[' + new Date()["toISOString"]() + "] starting " + _0x2df352["kind"] + '\x20' + (_0x2df352["command"] + " --host=" + HOST + " --port=" + PORT + '\x20') + ("timeoutMs=" + SERVER_READY_TIMEOUT_MS + '\x0a'));
  const _0x3ab42a = _0x26d809 => {
    _0x5cd20b["write"]('[' + new Date()["toISOString"]() + "] spawn error: " + (_0x26d809?.["stack"] || _0x26d809?.["message"] || _0x26d809) + '\x0a');
    logDiagnosticEvent({
      'type': "backend.spawn_error",
      'level': 'error',
      'source': "main",
      'message': 'Failed\x20to\x20spawn\x20local\x20Python\x20service',
      'error': _0x26d809,
      'context': {
        'command': _0x2df352["command"],
        'port': PORT
      }
    });
    _0x211ca9?.({
      'kind': "error",
      'title': APP_DISPLAY_NAME + " 启动失败",
      'detail': '启动本地工作环境失败。',
      'hint': '请重启应用，若仍失败请导出诊断日志。'
    });
  };
  let _0x2db7ca;
  const _0x513611 = launchMonitoredBackendProcess({
    'spawnProcess': spawn,
    'command': _0x2df352["command"],
    'args': [..._0x2df352["args"], "--host=" + HOST, "--port=" + PORT],
    'options': {
      'cwd': _0x2df352['cwd'],
      'env': {
        ...process["env"],
        'AIC_APP_ROOT': APP_ROOT,
        'AICANVAS_PORT': String(PORT),
        'AIC_LOCAL_TOKEN': LOCAL_ACCESS_TOKEN,
        'PYTHONIOENCODING': 'utf-8',
        'PYTHONUNBUFFERED': '1',
        'PYTHONUTF8': '1',
        ...buildPackagedServerEnv()
      },
      'stdio': ["ignore", 'pipe', "pipe"],
      'windowsHide': !![]
    },
    'logStream': _0x5cd20b,
    'onSpawnError': _0x3ab42a,
    'onExit': (_0x574538, _0x3d015c) => {
      _0x5cd20b["write"]('[' + new Date()["toISOString"]() + "] exited code=" + (_0x574538 ?? '') + " signal=" + (_0x3d015c ?? '') + '\x0a');
      (_0x574538 !== 0x0 || _0x3d015c) && logDiagnosticEvent({
        'type': 'backend.exited',
        'level': "warn",
        'source': "main",
        'message': "Local Python service exited",
        'context': {
          'code': _0x574538,
          'signal': _0x3d015c,
          'port': PORT
        }
      });
      if (spawnedServer === _0x2db7ca) {
        spawnedServer = null;
      }
    }
  });
  _0x2db7ca = _0x513611["child"];
  spawnedServer = _0x2db7ca;
  let _0x316393 = ![];
  try {
    _0x316393 = await waitForServerReady(_0x211ca9, _0x513611["failure"]);
  } catch (_0x407ed7) {
    stopSpawnedServer();
    throw _0x407ed7;
  }
  if (!_0x316393) {
    _0x513611["markReady"]();
    stopSpawnedServer();
    logDiagnosticEvent({
      'type': "backend.ready_timeout",
      'level': "error",
      'source': "main",
      'message': "Local Python service did not become ready",
      'context': {
        'appUrl': APP_URL,
        'timeoutMs': SERVER_READY_TIMEOUT_MS
      }
    });
    throw new Error(APP_DISPLAY_NAME + '\x20server\x20did\x20not\x20become\x20ready\x20at\x20' + APP_URL);
  }
  _0x513611["markReady"]();
  _0x211ca9?.({
    'kind': "loading",
    'title': APP_DISPLAY_NAME + " 正在启动",
    'detail': "正在打开画布。",
    'hint': ''
  });
  return "started";
}
function stopSpawnedServer() {
  const _0x3c9a0f = spawnedServer;
  if (!_0x3c9a0f || _0x3c9a0f["killed"]) {
    return;
  }
  try {
    if (process["platform"] === "win32" && _0x3c9a0f["pid"]) {
      execFileSync(resolveWindowsSystemToolPath("taskkill", {
        'env': process["env"]
      }), ['/PID', String(_0x3c9a0f['pid']), '/F', '/T'], {
        'stdio': "ignore",
        'windowsHide': !![]
      });
    } else {
      _0x3c9a0f["kill"]();
    }
  } catch {} finally {
    spawnedServer = null;
  }
}
async function closeChromeShellForUpdate() {
  const _0x4c8668 = chromeShellLaunch;
  const _0x132731 = await closeChromeShellLaunchForUpdate({
    'launch': _0x4c8668,
    'env': process["env"],
    'platform': process["platform"]
  });
  if (!_0x132731) {
    const _0x52fe02 = new Error("Chrome shell window could not be closed before update");
    _0x52fe02["code"] = "CHROME_SHELL_WINDOW_CLOSE_FAILED";
    throw _0x52fe02;
  }
  if (chromeShellLaunch === _0x4c8668) {
    chromeShellLaunch = null;
  }
}
async function focusMainWindow() {
  if (activateMainWindow({
    'app': app,
    'window': mainWindow
  })) {
    return !![];
  }
  if (process['platform'] === "win32") {
    return focusChromeShellLaunchWindow({
      'launch': chromeShellLaunch,
      'env': process["env"],
      'platform': process["platform"]
    });
  }
  return Boolean(activateChromeShellWindowSoon({
    'child': chromeShellLaunch?.['process']
  }));
}
async function reopenMainWindowFromSecondInstance() {
  try {
    if (await focusMainWindow()) {
      return;
    }
    if (desktopStartupLifecycle["isQuitting"]() || mainWindow && !mainWindow["isDestroyed"]()) {
      return;
    }
    createMainWindow();
    await desktopStartupLifecycle["prepareBackend"]();
    void localRuntimeKeepAlive["start"]("window-reopen");
    loadCanvasWindow();
  } catch (_0x4f2ae7) {
    void handleStartupFailure(_0x4f2ae7);
  }
}
function normalizeVirtualLocalPath(_0x1778e4) {
  const _0x244e19 = String(_0x1778e4 || '')['trim']();
  if (!_0x244e19) {
    return '';
  }
  if (/^(?:file|javascript|data|blob):/i["test"](_0x244e19)) {
    return '';
  }
  if (/^https?:/i["test"](_0x244e19)) {
    try {
      const _0x2e9f2b = new URL(_0x244e19);
      const _0x6baf1c = String(_0x2e9f2b["hostname"] || '')["toLowerCase"]();
      if (_0x6baf1c !== "localhost" && _0x6baf1c !== "127.0.0.1" && _0x6baf1c !== "::1" && _0x6baf1c !== '[::1]') {
        return '';
      }
      return normalizeVirtualLocalPath(_0x2e9f2b["pathname"]);
    } catch {
      return '';
    }
  }
  const _0x3f6a2d = _0x244e19["replace"](/\\/g, '/');
  if (/^[a-z][a-z0-9+.-]*:/i["test"](_0x3f6a2d)) {
    return '';
  }
  if (/^[a-zA-Z]:\//["test"](_0x3f6a2d) || _0x3f6a2d["startsWith"]('//')) {
    return '';
  }
  let _0x4a367f = _0x3f6a2d["split"](/[?#]/, 0x1)[0x0];
  try {
    _0x4a367f = decodeURIComponent(_0x4a367f);
  } catch {}
  const _0x5bd0b9 = a255_0x3f9775["posix"]['normalize'](_0x4a367f["replace"](/^\/+/, ''));
  if (!_0x5bd0b9 || _0x5bd0b9 === '.' || _0x5bd0b9 === '..' || _0x5bd0b9["startsWith"]("../")) {
    return '';
  }
  if (!_0x5bd0b9["startsWith"]('data/assets/') && !_0x5bd0b9['startsWith']("data/uploads/") && !_0x5bd0b9["startsWith"]("output/")) {
    return '';
  }
  return _0x5bd0b9;
}
function resolveLocalVirtualPath(_0x16196f) {
  const _0x52a5a0 = normalizeVirtualLocalPath(_0x16196f);
  if (!_0x52a5a0) {
    return '';
  }
  const _0x4253c8 = [["data/assets/", getAssetsDir()], ["data/uploads/", getUploadsDir()], ['output/', getOutputDir()]];
  for (const [_0x2a2af1, _0x530f8e] of _0x4253c8) {
    if (!_0x52a5a0["startsWith"](_0x2a2af1)) {
      continue;
    }
    const _0x587ad3 = _0x52a5a0["slice"](_0x2a2af1["length"]);
    return resolveExistingPathWithinRoot(_0x530f8e, _0x587ad3);
  }
  return '';
}
function getSecureSettingsStore() {
  !secureSettingsStore && (secureSettingsStore = createSecureSettingsStore({
    'filePath': getSecureSettingsStorePath(),
    'safeStorage': safeStorage
  }));
  return secureSettingsStore;
}
const resolveDoubaoAsrConfig = createDoubaoAsrConfigResolver({
  'appRoot': APP_ROOT,
  'getSecureSettingsStore': getSecureSettingsStore,
  'getUserRoot': getUserRoot,
  'processEnv': process["env"]
});
const resolveBailianAsrConfig = createBailianAsrConfigResolver({
  'getSecureSettingsStore': getSecureSettingsStore,
  'getUserRoot': getUserRoot
});
function normalizeSecureSettingsKeys(_0x3f8197 = {}) {
  const _0x44218f = Array["isArray"](_0x3f8197?.["keys"]) ? _0x3f8197["keys"] : [_0x3f8197?.["key"]];
  return _0x44218f["map"](_0x496358 => String(_0x496358 || '')["trim"]())["filter"](Boolean);
}
async function syncSystemRecentDocumentsBestEffort() {
  try {
    return await syncRecentProjectsToSystemRecentDocuments({
      'app': app,
      'recentStorePath': getRecentProjectsStorePath()
    });
  } catch (_0x109398) {
    console['warn']('[electron]\x20sync\x20recent\x20documents\x20failed:', _0x109398);
    return {
      'ok': ![],
      'error': String(_0x109398?.['message'] || _0x109398),
      'count': 0x0,
      'paths': []
    };
  }
}
function resolveClipboardAbsoluteFilePath(_0x3dae94) {
  let _0x2ea123 = String(_0x3dae94 || '')['trim']();
  if (!_0x2ea123) {
    return '';
  }
  _0x2ea123 = _0x2ea123['replace'](/^"|"$/g, '');
  if (/^file:\/\//i["test"](_0x2ea123)) {
    try {
      _0x2ea123 = fileURLToPath(_0x2ea123);
    } catch {
      return '';
    }
  }
  if (!a255_0x3f9775["isAbsolute"](_0x2ea123)) {
    return '';
  }
  try {
    const _0x63705c = realpathSync(_0x2ea123);
    const _0x3b1a3b = statSync(_0x63705c);
    return _0x3b1a3b["isFile"]() ? _0x63705c : '';
  } catch {
    return '';
  }
}
function resolveClipboardImagePath(_0x2a5c25 = {}) {
  const _0x450c0f = resolveClipboardAbsoluteFilePath(_0x2a5c25?.["absolutePath"]);
  if (_0x450c0f) {
    return _0x450c0f;
  }
  const _0x2000fc = String(_0x2a5c25?.["localPath"] || '')["trim"]();
  if (!_0x2000fc) {
    return '';
  }
  const _0x446edc = resolveLocalVirtualPath(_0x2000fc);
  if (!_0x446edc) {
    return '';
  }
  try {
    const _0x1f5f57 = statSync(_0x446edc);
    return _0x1f5f57["isFile"]() ? _0x446edc : '';
  } catch {
    return '';
  }
}
function createClipboardNativeImage(_0x3c5947 = {}) {
  const _0x250704 = String(_0x3c5947?.["pngBase64"] || '')["trim"]();
  if (_0x250704) {
    return nativeImage["createFromBuffer"](Buffer["from"](_0x250704, 'base64'));
  }
  const _0x435e17 = resolveClipboardImagePath(_0x3c5947);
  if (!_0x435e17) {
    return nativeImage["createEmpty"]();
  }
  return nativeImage["createFromPath"](_0x435e17);
}
function getMimeTypeForClipboardFile(_0x263148) {
  const _0x4f42e4 = a255_0x3f9775["extname"](String(_0x263148 || ''))["toLowerCase"]();
  const _0x270fc4 = {
    '.png': "image/png",
    '.jpg': "image/jpeg",
    '.jpeg': "image/jpeg",
    '.webp': 'image/webp',
    '.gif': "image/gif",
    '.bmp': "image/bmp",
    '.avif': "image/avif",
    '.mp4': 'video/mp4',
    '.m4v': "video/mp4",
    '.webm': "video/webm",
    '.mov': 'video/quicktime',
    '.mp3': "audio/mpeg",
    '.wav': 'audio/wav',
    '.m4a': 'audio/mp4',
    '.aac': "audio/aac",
    '.ogg': "audio/ogg",
    '.flac': "audio/flac",
    '.txt': "text/plain"
  };
  return _0x270fc4[_0x4f42e4] || "application/octet-stream";
}
function buildClipboardFileMeta(_0xb667f0) {
  const _0x2ba3c7 = statSync(_0xb667f0);
  return {
    'path': _0xb667f0,
    'name': a255_0x3f9775["basename"](_0xb667f0),
    'type': getMimeTypeForClipboardFile(_0xb667f0),
    'size': Number(_0x2ba3c7["size"] || 0x0) || 0x0
  };
}
function normalizeClipboardFileReferences(_0x403374 = []) {
  const _0x24fafd = new Set();
  const _0x260ff9 = [];
  (Array["isArray"](_0x403374) ? _0x403374 : [_0x403374])["forEach"](_0x54c03a => {
    const _0x3227db = _0x54c03a && typeof _0x54c03a === "object" ? _0x54c03a["path"] : _0x54c03a;
    const _0x33580e = resolveClipboardAbsoluteFilePath(_0x3227db);
    if (!_0x33580e) {
      return;
    }
    const _0x4cdd84 = process["platform"] === "win32" || process['platform'] === "darwin" ? _0x33580e["toLowerCase"]() : _0x33580e;
    if (_0x24fafd['has'](_0x4cdd84)) {
      return;
    }
    _0x24fafd["add"](_0x4cdd84);
    _0x260ff9['push'](buildClipboardFileMeta(_0x33580e));
  });
  return _0x260ff9;
}
function parseClipboardFileReferencesFromText(_0x3e0e42) {
  const _0x2651db = String(_0x3e0e42 || '')['split'](/\r?\n/)["map"](_0x583e06 => _0x583e06["trim"]())["filter"](Boolean);
  return normalizeClipboardFileReferences(_0x2651db);
}
function resolveKnownFolder(_0x174d99) {
  const _0x1990ef = String(_0x174d99 || '')['trim']();
  if (_0x1990ef === 'assets') {
    return getAssetsDir();
  }
  if (_0x1990ef === "output") {
    return getOutputDir();
  }
  if (_0x1990ef === "project") {
    return getCanvasProjectDir();
  }
  return '';
}
function getLocalAssetCleanupManager() {
  if (localAssetCleanupManager) {
    return localAssetCleanupManager;
  }
  localAssetCleanupManager = createLocalAssetCleanupManager({
    'trashItem': _0xceef21 => shell['trashItem'](_0xceef21),
    'getRoots': createLocalAssetCleanupRootsResolver({
      'readCurrentFileSavePaths': () => readFileSavePathsForLocalCleanup({
        'requestLocalJson': requestLocalJson,
        'logDiagnosticEvent': logDiagnosticEvent
      }),
      'getCurrentDefaults': () => ({
        'canvasDir': getCanvasProjectDir(),
        'outputDir': getOutputDir(),
        'dataDir': getDataDir(),
        'uploadsDir': getUploadsDir(),
        'assetsDir': getAssetsDir(),
        'workflowsDir': getWorkflowsDir(),
        'workflowThumbsDir': a255_0x3f9775["join"](getWorkflowsDir(), "thumbs"),
        'recentProjectsStorePath': getRecentProjectsStorePath(),
        'recoverySnapshotPath': getRecoverySnapshotPath(),
        'canvasShortcutsPath': a255_0x3f9775["join"](getUserRoot(), 'canvas-shortcuts.json')
      })
    })
  });
  return localAssetCleanupManager;
}
function normalizeWindowProjectName(_0xe6cacc) {
  return String(_0xe6cacc || '')["replace"](/\s+/g, '\x20')["trim"]();
}
function updateMainWindowUnsavedState(_0x2aae59 = mainWindow) {
  if (!_0x2aae59 || _0x2aae59['isDestroyed']()) {
    return;
  }
  const _0x376ba9 = rendererProjectState["hasUnsavedChanges"] === !![];
  _0x2aae59["setTitle"]('' + APP_DISPLAY_NAME + (_0x376ba9 ? '\x20*' : ''));
  try {
    _0x2aae59["setDocumentEdited"](_0x376ba9);
  } catch {}
}
function handleRendererUnsavedState(_0x4a4749 = {}) {
  rendererProjectState = {
    'hasUnsavedChanges': _0x4a4749?.["hasUnsavedChanges"] === !![] || _0x4a4749?.['dirty'] === !![],
    'projectName': normalizeWindowProjectName(_0x4a4749?.['projectName'])
  };
  updateMainWindowUnsavedState();
}
function enqueueExternalProjectOpenRequest(_0x3a18dd) {
  if (!_0x3a18dd || typeof _0x3a18dd !== "object") {
    return;
  }
  pendingExternalProjectOpenRequests['push']({
    ..._0x3a18dd,
    'queuedAt': Date['now']()
  });
  mainWindow?.['webContents']?.["send"]('project:externalOpenAvailable');
}
function findFirstSupportedProjectPackagePathFromArgs(_0x47c87c) {
  const _0x43a7d9 = Array["isArray"](_0x47c87c) ? _0x47c87c : [];
  for (const _0x29e197 of _0x43a7d9) {
    const _0x205965 = String(_0x29e197 || '')["trim"]()["replace"](/^"|"$/g, '');
    if (!_0x205965 || !a255_0x3f9775["isAbsolute"](_0x205965) || a255_0x3f9775["extname"](_0x205965)['toLowerCase']() !== '.aicpkg') {
      continue;
    }
    try {
      if (statSync(_0x205965)["isFile"]()) {
        return a255_0x3f9775["resolve"](_0x205965);
      }
    } catch {}
  }
  return '';
}
function queueExternalProjectOpenPath(_0x1e2bf7, _0x5a2d39) {
  const _0x548226 = findFirstSupportedProjectPackagePathFromArgs([_0x1e2bf7]);
  const _0x4643a0 = _0x548226 || findFirstSupportedProjectPathFromArgs([_0x1e2bf7], {
    'mustExist': !![]
  });
  if (!_0x4643a0) {
    return ![];
  }
  try {
    enqueueExternalProjectOpenRequest(_0x548226 ? {
      'success': !![],
      'canceled': ![],
      'kind': "projectPackage",
      'path': _0x4643a0,
      'filePath': _0x4643a0,
      'filename': a255_0x3f9775['basename'](_0x4643a0),
      'source': _0x5a2d39
    } : mainCapabilityHandlers["projectOperations"]["openPath"](_0x4643a0, {
      'source': _0x5a2d39
    }));
    logDiagnosticEvent({
      'type': "project.external_open_queued",
      'level': 'info',
      'source': 'main',
      'message': 'External\x20project\x20open\x20queued',
      'context': {
        'source': _0x5a2d39,
        'filePath': _0x4643a0
      }
    });
  } catch (_0x207a80) {
    logDiagnosticEvent({
      'type': 'project.external_open_failed',
      'level': 'error',
      'source': "main",
      'message': "External project open failed",
      'error': _0x207a80,
      'context': {
        'source': _0x5a2d39,
        'filePath': _0x4643a0
      }
    });
    enqueueExternalProjectOpenRequest({
      'success': ![],
      'canceled': ![],
      'source': _0x5a2d39,
      'filePath': _0x4643a0,
      'filename': a255_0x3f9775['basename'](_0x4643a0),
      'error': String(_0x207a80?.["message"] || _0x207a80)
    });
  }
  return !![];
}
function queueExternalProjectOpenFromArgs(_0x20d2fc, _0x2078c3) {
  const _0x2fc3a0 = findFirstSupportedProjectPackagePathFromArgs(_0x20d2fc) || findFirstSupportedProjectPathFromArgs(_0x20d2fc, {
    'mustExist': !![]
  });
  return _0x2fc3a0 ? queueExternalProjectOpenPath(_0x2fc3a0, _0x2078c3) : ![];
}
function normalizeDialogOptionText(_0x1ba5b3, _0x51aab7 = '', _0x571212 = 0xb4) {
  const _0x37ba15 = String(_0x1ba5b3 || '')['replace'](/\0/g, '')["trim"]();
  if (!_0x37ba15) {
    return _0x51aab7;
  }
  return _0x37ba15['slice'](0x0, _0x571212);
}
async function selectDirectory(_0x18788c = {}) {
  const _0x32e5f0 = normalizeDialogOptionText(_0x18788c?.["title"], "选择保存目录", 0x50);
  const _0x1f7773 = normalizeDialogOptionText(_0x18788c?.['defaultPath'], '', 0x400);
  const _0x3e6fac = {
    'title': _0x32e5f0,
    'properties': ["openDirectory", 'createDirectory']
  };
  if (_0x1f7773) {
    _0x3e6fac["defaultPath"] = _0x1f7773;
  }
  const _0x1e5e27 = await showOpenDialog(_0x3e6fac);
  if (_0x1e5e27["canceled"] || !_0x1e5e27['filePaths']?.[0x0]) {
    return {
      'success': ![],
      'canceled': !![]
    };
  }
  return {
    'success': !![],
    'canceled': ![],
    'path': _0x1e5e27["filePaths"][0x0]
  };
}
function readAppVersionFromIndexHtml() {
  try {
    const _0x15be55 = readFileSync(a255_0x3f9775['join'](APP_ROOT, "index.html"), "utf8");
    const _0x5a9996 = _0x15be55["match"](/<meta\s+name=["']app-version["']\s+content=["']([^"']+)["']/i);
    return String(_0x5a9996?.[0x1] || '')['trim']();
  } catch {
    return '';
  }
}
function getAutoUpdater() {
  !autoUpdaterInstance && (autoUpdaterInstance = a255_0x23a439['autoUpdater']);
  applySingleRangeFeedConfig(autoUpdaterInstance);
  return autoUpdaterInstance;
}
// 对象存储（阿里云 OSS 等）收到 "Range: bytes=a-b,c-d" 只回第一段，electron-updater 因为响应不是
// multipart/byteranges 而判定差分失败，静默退回整包下载。关掉 multi-range 后差分才真正生效。
function applySingleRangeFeedConfig(_0x3b7f9c) {
  if (!app["isPackaged"] || !_0x3b7f9c || updaterFeedConfigApplied) {
    return;
  }
  updaterFeedConfigApplied = true;
  try {
    const _0x2c8b57 = a255_0x3f9775['join'](process['resourcesPath'] || '', 'app-update.yml');
    if (!existsSync(_0x2c8b57)) {
      return;
    }
    const _0x41cdaf = readFileSync(_0x2c8b57, 'utf8');
    if (!/^\s*provider:\s*generic\s*$/m.test(_0x41cdaf)) {
      return;
    }
    const _0x48d3f5 = String(_0x41cdaf['match'](/^\s*url:\s*(\S+)\s*$/m)?.[0x1] || '')["trim"]();
    if (!_0x48d3f5) {
      return;
    }
    const _0x1bf0c2 = String(_0x41cdaf['match'](/^\s*channel:\s*(\S+)\s*$/m)?.[0x1] || '') || null;
    _0x3b7f9c["setFeedURL"]({
      'provider': "generic",
      'url': _0x48d3f5,
      'channel': _0x1bf0c2,
      'useMultipleRangeRequest': false
    });
  } catch (_0x46e961) {
    console["warn"]("[electron][updater] single-range feed config failed:", _0x46e961);
  }
}
function handleUpdaterEvent(_0x1e9458 = {}) {
  const _0x243f24 = String(_0x1e9458["type"] || '');
  if (_0x243f24 === 'download-started' || _0x243f24 === 'download-retry') {
    setTaskbarProgressSource("updater", 0x0);
    setPowerSaveBlocker("updater", !![]);
    return;
  }
  if (_0x243f24 === "download-progress") {
    setPowerSaveBlocker("updater", !![]);
    return;
  }
  (_0x243f24 === "downloaded" || _0x243f24 === "download-cancelled" || _0x243f24 === "download-failed" || _0x243f24 === "error" || _0x243f24 === "not-available") && (setTaskbarProgressSource("updater", -0x1), setPowerSaveBlocker("updater", ![]));
}
function markQuittingForUpdate() {
  isQuittingForUpdate = !![];
}
function getUpdateInstallPreparation() {
  !updateInstallPreparation && (updateInstallPreparation = createUpdateInstallPreparation({
    'getSpawnedServer': () => spawnedServer,
    'clearSpawnedServer': _0xc9ccfe => {
      if (spawnedServer === _0xc9ccfe) {
        spawnedServer = null;
      }
    },
    'markQuittingForUpdate': markQuittingForUpdate,
    'resetQuittingForUpdate': () => {
      isQuittingForUpdate = ![];
    },
    'waitForChromeShellStartup': () => chromeShellStartupSettledPromise,
    'getMainWindow': () => mainWindow,
    'getRendererProjectState': () => rendererProjectState,
    'requestRendererRecoverySnapshot': requestRendererRecoverySnapshot,
    'destroyScreenshotOverlayWindow': () => screenshotOverlayController["destroyScreenshotOverlayWindow"](),
    'stopAllPowerSaveBlockers': stopAllPowerSaveBlockers,
    'closeChromeShell': closeChromeShellForUpdate,
    'logEvent': logDiagnosticEvent
  }));
  return updateInstallPreparation;
}
function getUpdaterController() {
  !updaterController && (updaterController = createUpdaterController({
    'autoUpdater': getAutoUpdater(),
    'createCancellationToken': () => new a255_0x23a439["CancellationToken"](),
    'isPackaged': () => app["isPackaged"],
    'normalizeInfo': normalizeUpdaterInfo,
    'logEvent': logDiagnosticEvent,
    'prepareBeforeInstall': () => getUpdateInstallPreparation()['prepareForUpdateInstall'](),
    'quitApplication': () => app["quit"](),
    'setProgressBar': _0x48d719 => {
      setTaskbarProgressSource("updater", _0x48d719);
    },
    'sendEvent': _0x34dbf6 => {
      latestUpdaterEvent = _0x34dbf6;
      if (_0x34dbf6?.["info"]) {
        latestUpdaterInfo = _0x34dbf6["info"];
      }
      handleUpdaterEvent(_0x34dbf6);
      if (!mainWindow || mainWindow["isDestroyed"]()) {
        return;
      }
      mainWindow['webContents']["send"]("appUpdater:event", _0x34dbf6);
    }
  }));
  return updaterController;
}
function readLocalPreviewVideoUrl() {
  try {
    const _0x4fd278 = readFileSync(a255_0x3f9775['join'](APP_ROOT, "release_notes.txt"), "utf8");
    const _0x3aa97f = extractPreviewVideoUrlFromNotes(_0x4fd278);
    if (_0x3aa97f) {
      return _0x3aa97f;
    }
  } catch {}
  try {
    const _0x558361 = readFileSync(a255_0x3f9775["join"](APP_ROOT, "release_video_url.txt"), "utf8");
    return _0x558361["split"](/\r?\n/)["map"](_0x4a0c41 => _0x4a0c41['trim']())['find'](_0x379783 => _0x379783 && !_0x379783["startsWith"]('#')) || '';
  } catch {
    return '';
  }
}
function normalizeUpdaterInfo(_0x925f72) {
  return normalizeUpdaterInfoPayload(_0x925f72, {
    'readLocalPreviewVideoUrl': readLocalPreviewVideoUrl
  });
}
function installUpdaterHandlers() {
  if (updaterHandlersInstalled) {
    return;
  }
  updaterHandlersInstalled = !![];
  getUpdaterController()["installHandlers"]();
}
function scheduleUpdateCheck() {
  if (!app["isPackaged"] || updateCheckStarted) {
    return;
  }
  // publish: null 时 electron-builder 不生成 app-update.yml，跳过检查避免 ENOENT 告警
  const updateConfigPath = a255_0x3f9775['join'](process['resourcesPath'] || '', 'app-update.yml');
  if (!existsSync(updateConfigPath)) {
    return;
  }
  updateCheckStarted = !![];
  installUpdaterHandlers();
  getUpdaterController()["checkForUpdates"]()["catch"](_0xed763c => {
    console["warn"]("[electron][updater] check failed:", _0xed763c);
  });
}
function loadCanvasWindow(_0xc527ea = mainWindow) {
  if (!_0xc527ea || _0xc527ea["isDestroyed"]()) {
    return;
  }
  void _0xc527ea["loadURL"](APP_URL);
}
async function restartBackendAndReload() {
  if (app["isPackaged"] || backendRestartInProgress) {
    return;
  }
  backendRestartInProgress = !![];
  try {
    loadStartupStatus({
      'kind': 'loading',
      'title': APP_DISPLAY_NAME + " 正在重新启动",
      'detail': "正在重新加载画布环境。",
      'hint': "完成后会自动回到画布。"
    });
    localRuntimeKeepAlive["stop"]();
    stopSpawnedServer();
    await clearPortBeforeStart(loadStartupStatus);
    await ensureServerRunning(loadStartupStatus);
    void localRuntimeKeepAlive["start"]("backend-restart");
    loadCanvasWindow();
  } catch (_0x1eeda0) {
    console['error']("[electron] backend restart failed:", _0x1eeda0);
    logDiagnosticEvent({
      'type': "backend.restart_failed",
      'level': "error",
      'source': "main",
      'message': 'Backend\x20restart\x20failed',
      'error': _0x1eeda0
    });
    loadStartupStatus({
      'kind': "error",
      'title': APP_DISPLAY_NAME + " 重新启动失败",
      'detail': '画布环境重新加载失败。',
      'hint': "请重启应用，若仍失败请导出诊断日志。"
    });
  } finally {
    backendRestartInProgress = ![];
  }
}
function createMainWindow() {
  installAppMenu({
    'app': app,
    'Menu': Menu,
    'shell': shell,
    'getMainWindow': () => mainWindow,
    'logDir': LOG_DIR,
    'restartBackendAndReload': restartBackendAndReload,
    'stopSpawnedServer': stopSpawnedServer
  });
  installLocalApiTokenHeader();
  const {
    isMaximized: _0x4a143a,
    ..._0x53f8f0
  } = readWindowState();
  rendererProjectState = {
    'hasUnsavedChanges': ![],
    'projectName': ''
  };
  mainWindow = new BrowserWindow({
    ..._0x53f8f0,
    'minWidth': APP_WINDOW_MIN_WIDTH,
    'minHeight': APP_WINDOW_MIN_HEIGHT,
    'title': APP_DISPLAY_NAME,
    'icon': APP_WINDOW_ICON_PATH,
    'show': ![],
    'autoHideMenuBar': !![],
    'webPreferences': {
      'preload': a255_0x3f9775['join'](__dirname, "preload.cjs"),
      'contextIsolation': !![],
      'nodeIntegration': ![],
      'sandbox': !![],
      'backgroundThrottling': ![],
      'devTools': !app["isPackaged"]
    }
  });
  installWindowsTaskbarIdentity({
    'window': mainWindow,
    'appId': APP_USER_MODEL_ID,
    'iconPath': APP_WINDOW_ICON_PATH,
    'executablePath': process['execPath'],
    'displayName': APP_DISPLAY_NAME
  });
  installDevReloadShortcuts({
    'app': app,
    'window': mainWindow
  });
  installWindowStatePersistence(mainWindow);
  installRecoverySnapshotBeforeClose(mainWindow, {
    'getRendererProjectState': () => rendererProjectState,
    'shouldBypassClose': () => isQuittingForUpdate,
    'logEvent': logDiagnosticEvent
  });
  refreshTaskbarProgress();
  mainWindow['on']('page-title-updated', _0x2bfd50 => {
    _0x2bfd50["preventDefault"]();
    updateMainWindowUnsavedState(mainWindow);
  });
  mainWindow["once"]("ready-to-show", () => {
    _0x4a143a && mainWindow?.['maximize']();
    mainWindow?.["show"]();
    void localRuntimeKeepAlive["start"]("ready-to-show");
  });
  mainWindow['webContents']['on']("did-finish-load", () => {
    latestUpdaterEvent && mainWindow?.['webContents']["send"]("appUpdater:event", latestUpdaterEvent);
    pendingExternalProjectOpenRequests["length"] > 0x0 && mainWindow?.['webContents']["send"]('project:externalOpenAvailable');
    screenshotOverlayController["sendGlobalScreenshotShortcutStatus"]();
    globalTextPresetShortcutController["sendShortcutStatus"]();
    void localRuntimeKeepAlive["start"]("did-finish-load");
  });
  mainWindow["webContents"]['on']("did-fail-load", (_0x2503a5, _0xfd1051, _0x25de96, _0x469d33) => {
    logDiagnosticEvent({
      'type': "renderer.load_failed",
      'level': "error",
      'source': 'main',
      'message': "Renderer failed to load",
      'context': {
        'errorCode': _0xfd1051,
        'errorDescription': _0x25de96,
        'url': _0x469d33
      }
    });
  });
  mainWindow["webContents"]['on']("render-process-gone", (_0x54ba54, _0x221733 = {}) => {
    logDiagnosticEvent({
      'type': "renderer.process_gone",
      'level': 'error',
      'source': "main",
      'message': "Renderer process exited unexpectedly",
      'context': _0x221733
    });
  });
  mainWindow["webContents"]["setWindowOpenHandler"](({
    url: _0x287a2d
  }) => {
    openExternalUrl(_0x287a2d);
    return {
      'action': 'deny'
    };
  });
  mainWindow["webContents"]['on']("will-navigate", (_0x932d21, _0x3c07b9) => {
    if (isLocalAppUrl(_0x3c07b9)) {
      return;
    }
    _0x932d21['preventDefault']();
    openExternalUrl(_0x3c07b9);
  });
  mainWindow['on']("focus", () => void localRuntimeKeepAlive["start"]('focus'));
  mainWindow['on']("show", () => void localRuntimeKeepAlive["start"]("show"));
  mainWindow['on']("restore", () => void localRuntimeKeepAlive['start']('restore'));
  mainWindow['on']("hide", () => void localRuntimeKeepAlive["refresh"]('hide'));
  mainWindow['on']("minimize", () => void localRuntimeKeepAlive["refresh"]("minimize"));
  mainWindow['on']("closed", () => {
    webPreviewViewManager["disposeViews"]();
    localRuntimeKeepAlive['stop']();
    mainWindow = null;
    if (shouldQuitWhenAllElectronWindowsClosed({
      'platform': process["platform"],
      'useChromeShellRuntime': canvasRuntimeMode['shouldUseChromeShellRuntime']()
    })) {
      app["quit"]();
    }
  });
  mainWindow['on']("unresponsive", () => {
    logDiagnosticEvent({
      'type': "renderer.unresponsive",
      'level': 'warn',
      'source': 'main',
      'message': "Renderer became unresponsive"
    });
  });
}
async function startApp(_0x50e76b) {
  if (isQuittingForUpdate) {
    return;
  }
  if (!desktopStartupLifecycle["requestStart"](_0x50e76b)) {
    return;
  }
  installLocalPreviewProtocol();
  scheduleUpdateCheck();
  installIpcHandlers();
  void globalCaptureWindowController["prewarm"]();
  if (canvasRuntimeMode["shouldUseChromeShellRuntime"]()) {
    if (chromeShellStartupInProgress) {
      return chromeShellStartupSettledPromise;
    }
    chromeShellStartupInProgress = !![];
    let _0x1f3b64;
    chromeShellStartupSettledPromise = new Promise(_0x170520 => {
      _0x1f3b64 = _0x170520;
    });
    try {
      if (isChromeShellLaunchActive(chromeShellLaunch) && (await focusMainWindow())) {
        return;
      }
      if (chromeShellLaunch?.["detached"] === !![] && (await focusChromeShellLaunchWindow({
        'launch': chromeShellLaunch,
        'env': process["env"],
        'platform': process["platform"]
      }))) {
        return;
      }
      chromeShellLaunch = null;
      const _0xa30049 = resolveChromeShellBrowserExecutable({
        'env': process["env"],
        'platform': process["platform"]
      });
      const _0x1fb4fd = resolveChromeShellBrowserExecutable({
        'env': process['env'],
        'platform': process["platform"],
        'preferredBrowser': 'edge'
      });
      if (!_0xa30049 && !_0x1fb4fd) {
        const _0x51e401 = await promptForMissingChromeShellBrowser({
          'dialogApi': dialog,
          'shellApi': shell,
          'appName': APP_DISPLAY_NAME
        });
        if (_0x51e401 === 'electron') {
          canvasRuntimeMode["useElectronForCurrentLaunch"]();
          return startApp();
        }
        app["quit"]();
        return;
      }
      const _0x104a7d = await checkChromeShellBrowserVersionBeforeLaunch({
        'browserPath': _0xa30049,
        'edgeBrowserPath': _0x1fb4fd,
        'preferencePath': LEGACY_CHROME_SHELL_BROWSER_CHOICE_PATH,
        'env': process["env"],
        'platform': process['platform'],
        'logEvent': logDiagnosticEvent
      });
      if (!_0x104a7d["continueLaunch"]) {
        if (_0x104a7d['action'] === 'electron-fallback') {
          const _0x2b5beb = _0x104a7d["inspection"]?.['reason'] === "version-unavailable";
          const _0x29047e = await promptForChromeShellStartupFailure({
            'dialogApi': dialog,
            'shellApi': shell,
            'appName': APP_DISPLAY_NAME,
            'error': new Error(_0x2b5beb ? "无法读取 Chrome / Edge 版本，不能启动浏览器窗口" : "当前 Chrome / Edge 版本过低，不能启动浏览器窗口")
          });
          if (_0x29047e === "electron") {
            canvasRuntimeMode["useElectronForCurrentLaunch"]();
            return startApp();
          }
        }
        app["quit"]();
        return;
      }
      _0x104a7d['browserPath'] && _0x104a7d["browserPath"] !== _0xa30049 && (process["env"]["AIC_CHROME_SHELL_BROWSER"] = _0x104a7d['browserPath']);
      const _0x4b86d2 = resolveChromeShellStartupReadyTimeoutMs(process["env"]);
      const _0x2842fc = _0x104a7d['browserPath'] || _0xa30049;
      const _0x398926 = resolveChromeShellProfileDir({
        'app': app,
        'env': process["env"],
        'browserPath': _0x2842fc
      });
      let _0x37176e = null;
      const _0x170a78 = () => {
        if (_0x37176e) {
          return _0x37176e;
        }
        _0x37176e = (async () => {
          screenshotOverlayController["installGlobalScreenshotShortcut"]();
          globalTextPresetShortcutController['installGlobalShortcut']();
          queueExternalProjectOpenFromArgs(process['argv'], "startup");
          await desktopStartupLifecycle["prepareBackend"]();
          let _0x16edbc = {
            'available': ![]
          };
          try {
            _0x16edbc = await legacyRendererStorageMigration["prepare"]();
          } catch (_0x403e84) {
            logDiagnosticEvent({
              'type': "storage.legacy_renderer_migration_prepare_failed",
              'level': "warn",
              'source': "main",
              'message': "Legacy Electron renderer storage migration could not be prepared",
              'error': _0x403e84
            });
          }
          desktopStartupLifecycle["assertStarting"]();
          return buildLegacyRendererStorageMigrationAppUrl(APP_URL, _0x16edbc);
        })();
        return _0x37176e;
      };
      const {
        runtime: _0x131871
      } = await runChromeShellStartupWithProfileRecovery({
        'logEvent': logDiagnosticEvent,
        'rotateProfile': () => createChromeShellProfileRecovery({
          'sessionDataRoot': app["getPath"]('sessionData'),
          'profileDir': _0x398926
        })["rotateWhenReleased"](),
        'startAttempt': async () => {
          const _0x38a54b = randomBytes(0x10)["toString"]("hex");
          return startChromeShellRuntime({
            'app': app,
            'appUrl': APP_URL,
            'env': process['env'],
            'windowsTaskbarIdentity': {
              'appId': APP_USER_MODEL_ID,
              'iconPath': APP_WINDOW_ICON_PATH,
              'executablePath': process['execPath'],
              'displayName': APP_DISPLAY_NAME,
              'sizeGuardDllPath': APP_WINDOW_SIZE_GUARD_DLL_PATH
            },
            'displayWorkAreas': screen["getAllDisplays"]()["map"](({
              workArea: _0x3b9f03
            }) => ({
              ..._0x3b9f03
            })),
            'desktopHttpBridge': desktopHttpBridge,
            'startHttpBridge': startDesktopHttpBridge,
            'token': LOCAL_ACCESS_TOKEN,
            'handlers': mainCapabilityHandlers,
            'logEvent': logDiagnosticEvent,
            'closeShellLaunch': closeChromeShellLaunchForUpdate,
            'waitForRendererReady': () => chromeShellStartupHealth["waitForReady"]({
              'startupAttemptId': _0x38a54b,
              'timeoutMs': _0x4b86d2
            }),
            'prepare': async () => ({
              'appUrl': buildChromeShellStartupMetadataUrl(await _0x170a78(), {
                'startupAttemptId': _0x38a54b,
                'readyTimeoutMs': _0x4b86d2
              })
            }),
            'onClosed': () => {
              chromeShellBrowserWorker = null;
              chromeShellWebPreviewManager = null;
              chromeShellLaunch = null;
              return desktopStartupLifecycle["onShellClosed"]({
                'isQuittingForUpdate': isQuittingForUpdate,
                'hasUnsavedChanges': rendererProjectState["hasUnsavedChanges"] === !![]
              });
            }
          });
        }
      });
      chromeShellLaunch = _0x131871['chromeShellLaunch']?.["detached"] === !![] || isChromeShellLaunchActive(_0x131871["chromeShellLaunch"]) ? _0x131871["chromeShellLaunch"] : null;
      chromeShellBrowserWorker = _0x131871["browserWorker"];
      desktopHttpBridge = _0x131871['desktopHttpBridge'];
      chromeShellWebPreviewManager = _0x131871["webPreviewManager"];
      return;
    } finally {
      chromeShellStartupInProgress = ![];
      _0x1f3b64();
    }
  }
  createMainWindow();
  screenshotOverlayController["installGlobalScreenshotShortcut"]();
  globalTextPresetShortcutController['installGlobalShortcut']();
  queueExternalProjectOpenFromArgs(process["argv"], "startup");
  await desktopStartupLifecycle['prepareBackend']();
  void localRuntimeKeepAlive["start"]('server-ready');
  loadCanvasWindow();
}
async function retryStartupAfterFailure() {
  loadStartupStatus({
    'kind': "loading",
    'title': APP_DISPLAY_NAME + " 正在启动",
    'detail': "正在重新启动本地服务。",
    'hint': "若端口仍被占用，请先结束占用该端口的程序。"
  });
  await desktopStartupLifecycle['prepareBackend']();
  void localRuntimeKeepAlive["start"]("startup-retry");
  loadCanvasWindow();
}
const STARTUP_PORT_OWNERSHIP_CODE = "AIC_STARTUP_PORT_OWNERSHIP_UNVERIFIED";
function describeStartupFailure(error) {
  if (String(error?.['code'] || '') !== STARTUP_PORT_OWNERSHIP_CODE) {
    return {
      'title': APP_DISPLAY_NAME + " 启动失败",
      'detail': "应用启动时遇到问题。",
      'hint': "请重启应用，若仍失败请导出诊断日志。"
    };
  }
  const port = Number(error?.["details"]?.['port']) || PORT;
  const listenerPids = (Array["isArray"](error?.["details"]?.['pids']) ? error["details"]['pids'] : []).join(', ');
  return {
    'title': APP_DISPLAY_NAME + " 启动失败",
    'detail': "本地服务端口 " + port + " 已被其他程序占用，且无法确认它是本应用的旧进程；为避免误关闭其它程序，已停止启动。",
    'hint': "占用端口的进程 PID：" + (listenerPids || "未知") + "。结束该进程后可点击“重试”，或退出后重新启动。"
  };
}
function showStartupFailureWindow() {
  if (!mainWindow || mainWindow["isDestroyed"]()) {
    createMainWindow();
    return;
  }
  mainWindow["show"]();
  mainWindow["focus"]();
  mainWindow["moveTop"]();
}
async function promptForStartupFailure({ dialogApi, appName, failure }) {
  if (typeof dialogApi?.["showMessageBox"] !== "function") {
    return "quit";
  }
  for (;;) {
    let result;
    try {
      result = await dialogApi["showMessageBox"]({
        'type': "error",
        'title': appName + " 启动失败",
        'message': failure["title"],
        'detail': [failure["detail"], failure["hint"]]["join"]('\x0a'),
        'buttons': ["重试", "打开日志目录", "退出"],
        'defaultId': 0x0,
        'cancelId': 0x2,
        'noLink': !![]
      });
    } catch {
      return "quit";
    }
    const response = Number(result?.["response"]);
    if (response === 0x0) {
      return "retry";
    }
    if (response === 0x1) {
      try {
        await shell["openPath"](LOG_DIR);
      } catch {}
      continue;
    }
    return "quit";
  }
}
async function handleStartupFailure(_0x3fd03a) {
  if (desktopStartupLifecycle['isQuitting']() || _0x3fd03a?.["code"] === 'AIC_DESKTOP_STARTUP_CANCELLED') {
    return;
  }
  if (_0x3fd03a?.["code"] === "CHROME_SHELL_STARTUP_CANCELLED") {
    chromeShellStartupHealth["cancel"]("Chrome shell closed during startup");
    app['quit']();
    return;
  }
  console["error"]("[electron] startup failed:", _0x3fd03a);
  logDiagnosticEvent({
    'type': "app.startup_failed",
    'level': "error",
    'source': "main",
    'message': "Application startup failed",
    'error': _0x3fd03a,
    'context': {
      'code': String(_0x3fd03a?.['code'] || ''),
      ...(_0x3fd03a?.["details"] ? {
        'details': _0x3fd03a["details"]
      } : {})
    }
  });
  if (canvasRuntimeMode["shouldUseChromeShellRuntime"]()) {
    chromeShellStartupHealth['cancel']('Chrome\x20shell\x20startup\x20failed\x20before\x20renderer\x20readiness');
    const _0x473ac1 = await promptForChromeShellStartupFailure({
      'dialogApi': dialog,
      'shellApi': shell,
      'appName': APP_DISPLAY_NAME,
      'error': _0x3fd03a
    });
    if (_0x473ac1 === 'electron') {
      const _0x510e30 = _0x3fd03a?.["code"] === "CHROME_SHELL_RENDERER_READY_TIMEOUT";
      logDiagnosticEvent({
        'type': _0x510e30 ? "chrome_shell.renderer_ready_timeout_fallback" : "chrome_shell.early_exit_fallback",
        'level': "error",
        'source': "main",
        'message': _0x510e30 ? 'Chrome\x20shell\x20renderer\x20readiness\x20timed\x20out;\x20user\x20selected\x20Electron\x20compatibility\x20mode' : "Chrome shell startup failed; user selected Electron compatibility mode",
        'error': _0x3fd03a
      });
      canvasRuntimeMode["useElectronForCurrentLaunch"]();
      try {
        await startApp();
        return;
      } catch (_0x14c854) {
        console["error"]("[electron] Electron compatibility fallback failed:", _0x14c854);
      }
    } else {
      app["quit"]();
      return;
    }
  }
  const _0x1a7ce4 = describeStartupFailure(_0x3fd03a);
  loadStartupStatus({
    'kind': "error",
    ..._0x1a7ce4
  });
  showStartupFailureWindow();
  if (await promptForStartupFailure({
    'dialogApi': dialog,
    'appName': APP_DISPLAY_NAME,
    'failure': _0x1a7ce4
  }) === "retry") {
    try {
      await retryStartupAfterFailure();
      return;
    } catch (_0x2b8f4a) {
      console["error"]("[electron] startup retry failed:", _0x2b8f4a);
      return handleStartupFailure(_0x2b8f4a);
    }
  }
  app["quit"]();
}
function installAppLifecycleHandlers() {
  a255_0x2a6dbb['on']("before-quit-for-update", markQuittingForUpdate);
  app['on']("open-file", (_0x4986bd, _0x22e588) => {
    _0x4986bd["preventDefault"]();
    queueExternalProjectOpenPath(_0x22e588, 'open-file');
    if (canvasRuntimeMode["shouldUseChromeShellRuntime"]()) {
      void startApp([...process["argv"]["slice"](0x1), _0x22e588])['catch'](handleStartupFailure);
      return;
    }
    void focusMainWindow();
  });
  app["whenReady"]()["then"](() => {
    void startApp()["catch"](handleStartupFailure);
  });
  app['on']('second-instance', (_0x1cb3a2, _0x270d72) => {
    queueExternalProjectOpenFromArgs(_0x270d72, 'second-instance');
    if (canvasRuntimeMode['shouldUseChromeShellRuntime']()) {
      void startApp(_0x270d72["slice"](0x1))['catch'](handleStartupFailure);
      return;
    }
    void reopenMainWindowFromSecondInstance();
  });
  app['on']('activate', () => {
    const _0x2287df = async () => {
      if (canvasRuntimeMode["shouldUseChromeShellRuntime"]()) {
        await startApp();
        return;
      }
      if (await focusMainWindow()) {
        return;
      }
      if (BrowserWindow["getAllWindows"]()["length"] === 0x0) {
        await startApp();
      }
    };
    void _0x2287df()['catch'](_0x491037 => {
      console['error']('[electron]\x20activate\x20failed:', _0x491037);
      logDiagnosticEvent({
        'type': "app.activate_failed",
        'level': "error",
        'source': "main",
        'message': "Application activate failed",
        'error': _0x491037
      });
    });
  });
  app['on']("window-all-closed", () => {
    shouldQuitWhenAllElectronWindowsClosed({
      'platform': process["platform"],
      'useChromeShellRuntime': canvasRuntimeMode['shouldUseChromeShellRuntime']()
    }) && app["quit"]();
  });
  app['on']("before-quit", () => {
    desktopStartupLifecycle["beginQuit"]();
    try {
      const _0x640e77 = chromeShellLaunch?.['process'];
      _0x640e77 && _0x640e77["exitCode"] === null && !_0x640e77["killed"] && _0x640e77["kill"]?.();
    } catch {}
    screenshotOverlayController["destroyScreenshotOverlayWindow"]();
    globalCaptureWindowController['destroy']();
    foregroundDialogs["destroyOwnerWindow"]();
    localRuntimeKeepAlive['stop']();
    void chromeShellWebPreviewManager?.["dispose"]?.();
    chromeShellWebPreviewManager = null;
    chromeShellBrowserWorker?.["dispose"]?.();
    chromeShellBrowserWorker = null;
    void desktopHttpBridge?.["close"]?.();
    desktopHttpBridge = null;
    stopSpawnedServer();
    stopAllPowerSaveBlockers();
  });
  app['on']("will-quit", () => {
    screenshotOverlayController['uninstallGlobalScreenshotShortcut']();
    globalTextPresetShortcutController['uninstallGlobalShortcut']();
  });
}
GOT_SINGLE_INSTANCE_LOCK && installAppLifecycleHandlers();
process['on']("uncaughtException", _0x334d58 => {
  logDiagnosticEvent({
    'type': 'main.uncaught_exception',
    'level': "error",
    'source': "main",
    'message': "Uncaught exception in Electron main process",
    'error': _0x334d58
  });
  console["error"]('[electron]\x20uncaught\x20exception:', _0x334d58);
});
process['on']("unhandledRejection", _0x5afd82 => {
  logDiagnosticEvent({
    'type': "main.unhandled_rejection",
    'level': 'error',
    'source': "main",
    'message': 'Unhandled\x20rejection\x20in\x20Electron\x20main\x20process',
    'error': _0x5afd82 instanceof Error ? _0x5afd82 : null,
    'context': _0x5afd82 instanceof Error ? {} : {
      'reason': String(_0x5afd82)
    }
  });
  console["error"]("[electron] unhandled rejection:", _0x5afd82);
});