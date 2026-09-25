import { createGlobalCaptureWindowController } from './globalCaptureWindowController.js';
import { createGlobalTextPresetShortcutController } from './globalTextPresetShortcutController.js';
import { createSelectedTextCaptureController } from './selectedTextCapture.js';
export function createGlobalCaptureControllers({
  dirname: _0x4f993b,
  accelerator = "Alt+C",
  focusCanvas: _0x296a5e,
  getMainWindow: _0x2e402a,
  logDiagnosticEvent: _0x43c16a,
  selectedTextCaptureController = null
} = {}) {
  let _0xa6b212 = null;
  const _0xece127 = selectedTextCaptureController || createSelectedTextCaptureController({
    'onKeyReleased': _0x1eb990 => _0xa6b212?.["releaseShortcutKey"](_0x1eb990)
  });
  const _0x35421c = createGlobalCaptureWindowController({
    'dirname': _0x4f993b,
    'onAction': (_0x24f3b9, _0x42af1b) => _0xa6b212?.['dispatchCaptureAction']?.(_0x24f3b9, _0x42af1b) || {
      'ok': ![],
      'reason': "controller-unavailable"
    },
    'logDiagnosticEvent': _0x43c16a
  });
  _0xa6b212 = createGlobalTextPresetShortcutController({
    'accelerator': accelerator,
    'copySelectedText': _0xece127["capture"],
    'hasKeyReleaseTracking': () => _0xece127["isKeyReleaseTrackingAvailable"]?.() === !![],
    'focusCanvas': _0x296a5e,
    'getMainWindow': _0x2e402a,
    'showCapturePanel': _0x35421c["show"],
    'hideCapturePanel': _0x35421c["hide"],
    'isCapturePanelVisible': _0x35421c["isVisible"],
    'logDiagnosticEvent': _0x43c16a
  });
  const _0x2a5ed6 = {
    ..._0x35421c,
    'prewarm': () => Promise["all"]([_0x35421c["prewarm"](), _0xece127["prewarm"]()]),
    'destroy': () => {
      _0xa6b212["destroy"]();
      _0xece127["destroy"]();
      _0x35421c['destroy']();
    }
  };
  return {
    'globalCaptureWindowController': _0x2a5ed6,
    'globalTextPresetShortcutController': _0xa6b212
  };
}