import { ipcMain } from 'electron';
import { registerAppIpcHandlers } from './appIpc.js';
import { registerAgentInformationIpcHandlers } from './agentInformationIpc.js';
import { registerAgentSkillsIpcHandlers } from './agentSkillsIpc.js';
import { registerCanvasVisualSnapshotIpcHandlers } from './canvasVisualSnapshotIpc.js';
import { registerClipboardIpcHandlers } from './clipboardIpc.js';
import { registerCustomAiAppIpcHandlers } from './customAiAppIpc.js';
import { registerDiagnosticsIpcHandlers } from './diagnosticsIpc.js';
import { registerFileIpcHandlers } from './fileIpc.js';
import { registerLocalAssetCleanupIpcHandlers } from './localAssetCleanupIpc.js';
import { registerMediaTaskIpcHandlers } from './mediaTaskIpc.js';
import { registerNodeExportIpcHandlers } from './nodeExportIpc.js';
import { registerProjectIpcHandlers } from './projectIpc.js';
import { registerScreenshotIpcHandlers } from './screenshotIpc.js';
import { registerSecureSettingsIpcHandlers } from './secureSettingsIpc.js';
import { registerTextPresetIpcHandlers } from './textPresetIpc.js';
import { registerWebPreviewIpcHandlers } from './webPreviewIpc.js';
export function registerIpcHandlers(_0x37492b) {
  const _0xba7aae = {
    'ipcMain': ipcMain,
    ..._0x37492b
  };
  registerAppIpcHandlers(_0xba7aae);
  registerAgentInformationIpcHandlers(_0xba7aae);
  registerAgentSkillsIpcHandlers(_0xba7aae);
  registerCanvasVisualSnapshotIpcHandlers(_0xba7aae);
  registerCustomAiAppIpcHandlers(_0xba7aae);
  registerSecureSettingsIpcHandlers(_0xba7aae);
  registerClipboardIpcHandlers(_0xba7aae);
  registerScreenshotIpcHandlers(_0xba7aae);
  registerTextPresetIpcHandlers(_0xba7aae);
  registerProjectIpcHandlers(_0xba7aae);
  registerFileIpcHandlers(_0xba7aae);
  registerNodeExportIpcHandlers(_0xba7aae);
  registerMediaTaskIpcHandlers(_0xba7aae);
  registerLocalAssetCleanupIpcHandlers(_0xba7aae);
  registerDiagnosticsIpcHandlers(_0xba7aae);
  registerWebPreviewIpcHandlers(_0xba7aae);
}