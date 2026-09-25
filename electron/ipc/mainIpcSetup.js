import { createProjectCapabilityOperations } from '../projectCapabilityOperations.js';
import { createSecureSettingsCapabilityOperations } from '../secureSettingsCapabilityOperations.js';
import { createClipboardCapabilityOperations } from '../clipboardCapabilityOperations.js';
import { createDiagnosticsCapabilityOperations } from '../diagnosticsCapabilityOperations.js';
import { createAgentInformationCapabilityOperations } from '../agentInformationCapabilityOperations.js';
import { createAgentSkillCapabilityOperations } from '../agentSkillCapabilityOperations.js';
import { openShellFolder } from '../shellItemRevealer.js';
import a239_0x32e38f from 'electron';
const {
  shell = {},
  clipboard = {}
} = typeof a239_0x32e38f === "object" && a239_0x32e38f ? a239_0x32e38f : {};
export function buildMainIpcHandlerDeps(_0x156af2 = {}) {
  const {
    app: _0x28191a,
    readAppVersionFromIndexHtml: _0x558ff6,
    getStableDeviceId: _0xfb6e1,
    getUpdaterController: _0x3e0af4,
    getBackgroundCompletionNotifier: _0x2d4fda,
    getDataDir: _0x3c5e65,
    getSecureSettingsStore: _0x48c8a3,
    normalizeSecureSettingsKeys: _0x462edf,
    fileReferencesFormat: _0x327d1d,
    clipboardApi = clipboard,
    createClipboardNativeImage: _0x594f47,
    screenshotOverlayController: _0x437a6b,
    globalCaptureWindowController: _0x331d63,
    globalTextPresetShortcutController: _0x4cd9d8,
    normalizeClipboardFileReferences: _0xca2bbd,
    parseClipboardFileReferencesFromText: _0x54c612,
    exportDesktopProjectPackage: _0x5d29f5,
    importDesktopProjectPackage: _0x369dd7,
    exportSelectedNodesPackage: _0x5cd604,
    saveMediaFile: _0x35b7e0,
    saveTextFile: _0x16786d,
    saveMediaFiles: _0x230818,
    saveTimeline: _0x497542,
    openJianying: _0x32f7b1,
    handleRendererUnsavedState: _0x5492dd,
    getRecentProjectsStorePath: _0x498ca1,
    syncSystemRecentDocumentsBestEffort: _0x570d2a,
    pendingExternalProjectOpenRequests: _0x15666a,
    getCanvasProjectDir: _0x56630a,
    showOpenDialog: _0x40742c,
    showSaveDialog: _0x37a93a,
    projectFileStore: _0xf958d2,
    supportedProjectFileExtensions: _0x46690b,
    getRecoverySnapshotPath: _0x28691e,
    writeRecoverySnapshotFile: _0x40e768,
    getRecoverySnapshotFileInfo: _0x5dc050,
    readRecoverySnapshotFile: _0x1dd50c,
    removeRecoverySnapshotFile: _0x52bb55,
    importAssetToLibrary: _0x4e3ab6,
    importRemoteAssetToLibrary: _0x88b848,
    createLocalPreviewUrl: _0x40467b,
    resolveLocalVirtualPath: _0x197911,
    resolveKnownFolder: _0x2c0add,
    openExternalUrl: _0x3861af,
    getWebPreviewViewManager: _0x115d89,
    selectDirectory: _0x49b6e4,
    listNotificationSoundMp3Files: _0x13fb31,
    listSystemNotificationSoundFiles: _0x5a65c8,
    openSystemNotificationSoundFolder: _0x2a341f,
    playNotificationSound: _0x526065,
    getMediaTaskQueue: _0x117b1d,
    getLocalAssetCleanupManager: _0x9a9a91,
    consumeAssetUpdateEvents: _0x4a65b6,
    readLegacyRendererStorageMigration: _0x27bbed,
    completeLegacyRendererStorageMigration: _0xf0f504,
    diagnostics: _0x26118c,
    logDir: _0xe93704,
    logDiagnosticEvent: _0x5ed36f,
    openFolder: _0x1f46e2,
    getUserDataRoot: _0x4c04f6
  } = _0x156af2;
  const _0x4b65b6 = createProjectCapabilityOperations({
    'exportDesktopProjectPackage': _0x5d29f5,
    'importDesktopProjectPackage': _0x369dd7,
    'handleRendererUnsavedState': _0x5492dd,
    'getRecentProjectsStorePath': _0x498ca1,
    'syncSystemRecentDocumentsBestEffort': _0x570d2a,
    'pendingExternalProjectOpenRequests': _0x15666a,
    'getCanvasProjectDir': _0x56630a,
    'showOpenDialog': _0x40742c,
    'showSaveDialog': _0x37a93a,
    'projectFileStore': _0xf958d2,
    'supportedProjectFileExtensions': _0x46690b,
    'getRecoverySnapshotPath': _0x28691e,
    'writeRecoverySnapshotFile': _0x40e768,
    'getRecoverySnapshotFileInfo': _0x5dc050,
    'readRecoverySnapshotFile': _0x1dd50c,
    'removeRecoverySnapshotFile': _0x52bb55,
    'logDiagnosticEvent': _0x5ed36f
  });
  const _0x45fd00 = createSecureSettingsCapabilityOperations({
    'getSecureSettingsStore': _0x48c8a3,
    'normalizeSecureSettingsKeys': _0x462edf
  });
  const _0x88ea28 = createClipboardCapabilityOperations({
    'clipboardApi': clipboardApi,
    'fileReferencesFormat': _0x327d1d,
    'createClipboardNativeImage': _0x594f47,
    'normalizeClipboardFileReferences': _0xca2bbd,
    'parseClipboardFileReferencesFromText': _0x54c612
  });
  const _0x1448d2 = typeof _0x1f46e2 === "function" ? _0x1f46e2 : _0x5214c4 => openShellFolder(_0x5214c4, {
    'shellApi': shell,
    'logEvent': _0x5ed36f
  });
  const _0x51f2e5 = createDiagnosticsCapabilityOperations({
    'diagnostics': _0x26118c,
    'logDir': _0xe93704,
    'showSaveDialog': _0x37a93a,
    'openFolder': _0x1448d2
  });
  const _0xccbef7 = createAgentSkillCapabilityOperations({
    'getUserDataRoot': typeof _0x4c04f6 === 'function' ? _0x4c04f6 : () => _0x28191a?.["getPath"]?.('userData') || '',
    'showOpenDialog': _0x40742c,
    'openFolder': _0x1448d2
  });
  const _0x5188cf = createAgentInformationCapabilityOperations();
  return {
    'getAppVersion': () => _0x558ff6() || _0x28191a["getVersion"](),
    'getStableDeviceId': _0xfb6e1,
    'getUpdaterController': _0x3e0af4,
    'getBackgroundCompletionNotifier': _0x2d4fda,
    'getDataDir': _0x3c5e65,
    'secureSettingsOperations': _0x45fd00,
    'clipboardOperations': _0x88ea28,
    'captureDesktopDisplay': _0x437a6b['captureDesktopDisplay'],
    'configureGlobalScreenshotShortcut': _0x437a6b["configureGlobalScreenshotShortcut"],
    'consumeGlobalScreenshotCaptureEvents': _0x437a6b["consumeGlobalScreenshotCaptureEvents"],
    'getGlobalScreenshotShortcutStatus': _0x437a6b["getGlobalScreenshotShortcutStatus"],
    'configureGlobalTextPresetShortcut': _0x4cd9d8?.["configureGlobalShortcut"],
    'chooseGlobalCaptureWindowAction': _0x331d63?.["chooseAction"],
    'cancelGlobalCaptureWindow': _0x331d63?.["cancel"],
    'setGlobalCaptureWindowExpanded': _0x331d63?.['setExpanded'],
    'acknowledgeGlobalCaptureWindowPresentation': _0x331d63?.['didPresent'],
    'consumeGlobalTextPresetEvents': _0x4cd9d8?.["consumeEvents"],
    'claimGlobalTextPresetEvent': _0x4cd9d8?.['claimEvent'],
    'acknowledgeGlobalTextPresetEvent': _0x4cd9d8?.["acknowledgeEvent"],
    'getGlobalTextPresetShortcutStatus': _0x4cd9d8?.["getShortcutStatus"],
    'handleScreenshotOverlayConfirm': _0x437a6b['handleScreenshotOverlayConfirm'],
    'handleScreenshotOverlayCancel': _0x437a6b["handleScreenshotOverlayCancel"],
    'projectOperations': _0x4b65b6,
    'exportSelectedNodesPackage': _0x5cd604,
    'saveMediaFile': _0x35b7e0,
    'saveTextFile': _0x16786d,
    'saveMediaFiles': _0x230818,
    'saveTimeline': _0x497542,
    'openJianying': _0x32f7b1,
    'importAssetToLibrary': _0x4e3ab6,
    'importRemoteAssetToLibrary': _0x88b848,
    'createLocalPreviewUrl': _0x40467b,
    'resolveLocalVirtualPath': _0x197911,
    'resolveKnownFolder': _0x2c0add,
    'openExternalUrl': _0x3861af,
    'getWebPreviewViewManager': _0x115d89,
    'selectDirectory': _0x49b6e4,
    'listNotificationSoundMp3Files': _0x13fb31,
    'listSystemNotificationSoundFiles': _0x5a65c8,
    'openSystemNotificationSoundFolder': _0x2a341f,
    'playNotificationSound': _0x526065,
    'getMediaTaskQueue': _0x117b1d,
    'getLocalAssetCleanupManager': _0x9a9a91,
    'consumeAssetUpdateEvents': _0x4a65b6,
    'readLegacyRendererStorageMigration': _0x27bbed,
    'completeLegacyRendererStorageMigration': _0xf0f504,
    'diagnostics': _0x26118c,
    'diagnosticsOperations': _0x51f2e5,
    'agentInformationOperations': _0x5188cf,
    'agentSkillOperations': _0xccbef7,
    'logDir': _0xe93704,
    'logDiagnosticEvent': _0x5ed36f,
    'openFolder': _0x1f46e2
  };
}
export function createMainIpcHandlerInstaller({
  registerIpcHandlers: _0x3ae17b,
  context: _0x5a6038
} = {}) {
  if (typeof _0x3ae17b !== "function") {
    throw new TypeError("registerIpcHandlers must be a function");
  }
  let _0x3a9014 = ![];
  return function _0x26bd9c() {
    if (_0x3a9014) {
      return ![];
    }
    _0x3a9014 = !![];
    _0x3ae17b(buildMainIpcHandlerDeps(_0x5a6038));
    return !![];
  };
}