export function registerTextPresetIpcHandlers({
  ipcMain: _0x4da7ae,
  configureGlobalTextPresetShortcut: _0x399ada,
  chooseGlobalCaptureWindowAction: _0x4a3738,
  cancelGlobalCaptureWindow: _0x24125f,
  setGlobalCaptureWindowExpanded: _0x443833,
  acknowledgeGlobalCaptureWindowPresentation: _0xae56b5,
  claimGlobalTextPresetEvent: _0x5a200b,
  acknowledgeGlobalTextPresetEvent: _0x41b120,
  consumeGlobalTextPresetEvents: _0x869bf4
} = {}) {
  _0x4da7ae['handle']('textPreset:consumeEvents', () => _0x869bf4?.() || []);
  _0x4da7ae["handle"]('textPreset:claimEvent', (_0x237118, _0x299a2d) => _0x5a200b?.(_0x299a2d) || {
    'ok': ![]
  });
  _0x4da7ae["handle"]("textPreset:acknowledgeEvent", (_0x2707b7, _0x13e1be) => _0x41b120?.(_0x13e1be) || {
    'ok': ![]
  });
  _0x4da7ae["handle"]('textPreset:updateGlobalShortcut', async (_0x53daff, _0x38ba94) => {
    if (typeof _0x399ada !== "function") {
      return {
        'ok': ![],
        'reason': "not-supported"
      };
    }
    return _0x399ada(_0x38ba94);
  });
  _0x4da7ae["handle"]("globalCaptureWindow:chooseAction", async (_0x193f49, _0x197ae7) => {
    if (typeof _0x4a3738 !== "function") {
      return {
        'ok': ![],
        'reason': "not-supported"
      };
    }
    return _0x4a3738(_0x197ae7, _0x193f49?.["sender"]);
  });
  _0x4da7ae["handle"]('globalCaptureWindow:cancel', async (_0x12e1f8, _0x23cb9f) => {
    if (typeof _0x24125f !== "function") {
      return {
        'ok': ![],
        'reason': "not-supported"
      };
    }
    return _0x24125f(_0x23cb9f, _0x12e1f8?.["sender"]);
  });
  _0x4da7ae["handle"]("globalCaptureWindow:setExpanded", async (_0x42f698, _0x1f43e1) => {
    if (typeof _0x443833 !== "function") {
      return {
        'ok': ![],
        'reason': "not-supported"
      };
    }
    return _0x443833(_0x1f43e1, _0x42f698?.["sender"]);
  });
  _0x4da7ae["handle"]("globalCaptureWindow:didPresent", async (_0x7b2e1d, _0x35f9fd) => {
    if (typeof _0xae56b5 !== "function") {
      return {
        'ok': ![],
        'reason': 'not-supported'
      };
    }
    return _0xae56b5(_0x35f9fd, _0x7b2e1d?.["sender"]);
  });
}