import { openQuickCapturePromptPresetDraft } from '../promptPresets.js';
import a920_0x34cccc from '../../core/nodeRuntimeRegistry.js';
import a920_0x2136b9 from '../../core/stores/appStore.js';
import { createGlobalCaptureReceiver } from './globalCaptureReceiver.js';
const COPY_FAILURE_REASONS = new Set(["no-selection", "no-selected-text", "copy-command-failed", "copy-command-timeout", "unsupported-platform", "capture-failed"]);
const NODE_ACTION_CONFIGS = Object["freeze"]({
  'source-text': {
    'type': "source-text",
    'textField': "content",
    'nameKey': "globalCapture.nodeNames.sourceText"
  },
  'ai-text': {
    'type': "ai-text",
    'textField': 'prompt',
    'nameKey': 'globalCapture.nodeNames.aiText'
  },
  'ai-image': {
    'type': "ai-image",
    'textField': "prompt",
    'nameKey': "globalCapture.nodeNames.aiImage"
  },
  'ai-video': {
    'type': "ai-video",
    'textField': 'prompt',
    'nameKey': "globalCapture.nodeNames.aiVideo"
  }
});
const DEFAULT_MOUNT_ATTEMPTS = 0x1e;
const DEFAULT_MOUNT_DELAY_MS = 0x10;
function getCommandFailureMessage(_0xf14e8f) {
  return String(_0xf14e8f?.['message'] || _0xf14e8f?.["errorCode"] || _0xf14e8f?.['error'] || '')["trim"]();
}
function waitForNextFrame(_0x5a8821) {
  return new Promise(_0x528ead => {
    let _0xf91add = ![];
    const _0x250094 = () => {
      if (_0xf91add) {
        return;
      }
      _0xf91add = !![];
      clearTimeout(_0x2c43e0);
      _0x528ead();
    };
    const _0x2c43e0 = setTimeout(_0x250094, DEFAULT_MOUNT_DELAY_MS);
    if (typeof _0x5a8821 === "function") {
      _0x5a8821(_0x250094);
      return;
    }
    if (typeof globalThis["requestAnimationFrame"] === "function") {
      globalThis["requestAnimationFrame"](_0x250094);
      return;
    }
  });
}
export async function waitForGlobalCaptureNodeMounted({
  nodeId: _0x3a9bf2,
  isNodeMounted: _0x8be3a6,
  scheduleFrame: _0xdd97d5,
  attempts = DEFAULT_MOUNT_ATTEMPTS
} = {}) {
  const _0x3416c8 = String(_0x3a9bf2 || '')['trim']();
  if (!_0x3416c8 || typeof _0x8be3a6 !== 'function') {
    return ![];
  }
  for (let _0x161706 = 0x0; _0x161706 < attempts; _0x161706 += 0x1) {
    if (_0x8be3a6(_0x3416c8) === !![]) {
      return !![];
    }
    await waitForNextFrame(_0xdd97d5);
  }
  return ![];
}
export function installGlobalTextPresetBridge({
  textPresetApi: _0x4ae86f,
  showToast: _0x4f56d2,
  translate: _0xa44866,
  openDraft = openQuickCapturePromptPresetDraft,
  executeCanvasCommand: _0x3c58a6,
  isNodeMounted = _0x3d23f0 => globalThis["window"]?.['v2Renderer']?.['isNodeMounted']?.(_0x3d23f0) === !![],
  isNodeGenerationReady = _0x398e2e => typeof a920_0x34cccc["resolve"](_0x398e2e, {
    'store': a920_0x2136b9
  })?.["runGeneration"] === "function",
  scheduleFrame = _0x3834c2 => {
    if (typeof globalThis["window"]?.["requestAnimationFrame"] === "function") {
      globalThis["window"]['requestAnimationFrame'](_0x3834c2);
      return;
    }
    globalThis["setTimeout"]?.(_0x3834c2, DEFAULT_MOUNT_DELAY_MS);
  },
  consoleObject = console,
  getCanvasIdentity = () => ''
} = {}) {
  if (!_0x4ae86f) {
    return () => {};
  }
  let _0x2298c6 = ![];
  const _0x13f3ff = typeof _0xa44866 === 'function' ? _0xa44866 : (_0x32f8b7, _0x6ba5ac = {}) => String(_0x32f8b7 || '')["replace"](/\{(\w+)\}/g, (_0x499237, _0x1ffee9) => _0x6ba5ac[_0x1ffee9] || '');
  async function _0xf6d442(_0x287fa3) {
    const _0x3b6c8b = await openDraft(_0x287fa3);
    !_0x3b6c8b?.['hasConfiguredDefault'] && _0x4f56d2?.(_0x13f3ff("globalTextPreset.defaultMissing"), "warn");
    return {
      'ok': !![]
    };
  }
  async function _0x4da005(_0x591d11, _0x573999) {
    const _0x43127b = NODE_ACTION_CONFIGS[_0x591d11];
    if (!_0x43127b || typeof _0x3c58a6 !== "function") {
      return {
        'ok': ![],
        'reason': "canvas-command-unavailable"
      };
    }
    const _0x514f1e = await _0x3c58a6("node.create", {
      'type': _0x43127b['type'],
      'name': _0x13f3ff(_0x43127b['nameKey']),
      [_0x43127b["textField"]]: _0x573999,
      'placement': "viewport-center-sequence",
      'sequenceKey': "global-capture"
    });
    if (_0x514f1e?.['ok'] === ![]) {
      return {
        'ok': ![],
        'reason': getCommandFailureMessage(_0x514f1e) || "node-create-failed",
        'retryable': Boolean(_0x514f1e["errorCode"] && _0x514f1e["errorCode"] !== 'COMMAND_EXECUTION_FAILED')
      };
    }
    const _0x52be82 = String(_0x514f1e?.['result']?.["nodeId"] || _0x514f1e?.['result']?.["node"]?.['id'] || '')["trim"]();
    return _0x52be82 ? {
      'ok': !![],
      'nodeId': _0x52be82,
      'result': _0x514f1e
    } : {
      'ok': ![],
      'reason': "node-id-missing"
    };
  }
  async function _0x5efd44(_0xc54b5d, _0x4c857d) {
    const _0x5f52fc = await waitForGlobalCaptureNodeMounted({
      'nodeId': _0xc54b5d,
      'isNodeMounted': _0x45b624 => !_0x4c857d() || isNodeGenerationReady(_0x45b624) || isNodeMounted(_0x45b624),
      'scheduleFrame': scheduleFrame
    });
    if (!_0x4c857d()) {
      return {
        'ok': ![],
        'reason': "canvas-changed"
      };
    }
    if (!_0x5f52fc) {
      return {
        'ok': ![],
        'reason': "node-not-ready"
      };
    }
    const _0x1502f1 = await _0x3c58a6("generation.run", {
      'nodeId': _0xc54b5d
    });
    return _0x1502f1?.['ok'] === ![] ? {
      'ok': ![],
      'reason': getCommandFailureMessage(_0x1502f1) || "generation-failed"
    } : {
      'ok': !![],
      'result': _0x1502f1
    };
  }
  async function _0x11dcdc(_0x487670 = {}) {
    const _0x39ea56 = getCanvasIdentity();
    const _0x28c1d1 = () => !_0x2298c6 && _0x39ea56 === getCanvasIdentity();
    const _0x2eb6ff = String(_0x487670?.["text"] || '')["trim"]();
    if (!_0x2eb6ff) {
      _0x4f56d2?.(_0x13f3ff('globalTextPreset.noSelectedText'), 'warn');
      return {
        'ok': ![],
        'reason': "no-selected-text",
        'retryable': !![]
      };
    }
    const _0x1db9c1 = String(_0x487670?.['actionId'] || '')["trim"]();
    try {
      if (_0x1db9c1 === "preset-draft") {
        return await _0xf6d442(_0x2eb6ff);
      }
      if (!NODE_ACTION_CONFIGS[_0x1db9c1]) {
        _0x4f56d2?.(_0x13f3ff('globalCapture.unsupportedAction'), "error");
        return {
          'ok': ![],
          'reason': "unsupported-action",
          'retryable': ![]
        };
      }
      const _0x320f64 = _0x487670?.["runImmediately"] === !![] && _0x1db9c1 !== "source-text";
      _0x320f64 && _0x4f56d2?.(_0x13f3ff("globalCapture.preparingGeneration"), "info");
      const _0x56ba16 = await _0x4da005(_0x1db9c1, _0x2eb6ff);
      if (!_0x28c1d1()) {
        return {
          'ok': _0x56ba16['ok'],
          'reason': _0x56ba16['reason'],
          'retryable': ![]
        };
      }
      if (!_0x56ba16['ok']) {
        _0x4f56d2?.(_0x13f3ff("globalCapture.actionFailed", {
          'reason': _0x56ba16["reason"]
        }), "error");
        return _0x56ba16;
      }
      if (!_0x320f64) {
        _0x4f56d2?.(_0x13f3ff('globalCapture.nodeAdded'), "success");
        return {
          'ok': !![]
        };
      }
      void _0x5efd44(_0x56ba16["nodeId"], _0x28c1d1)["then"](_0x5c3567 => {
        if (!_0x28c1d1()) {
          return;
        }
        _0x4f56d2?.(_0x5c3567['ok'] ? _0x13f3ff("globalCapture.generationStarted") : _0x13f3ff('globalCapture.generationFailed', {
          'reason': _0x5c3567['reason']
        }), _0x5c3567['ok'] ? "success" : "error");
      })["catch"](_0x53ae73 => {
        if (_0x28c1d1()) {
          _0x4f56d2?.(_0x13f3ff("globalCapture.generationFailed", {
            'reason': String(_0x53ae73?.["message"] || _0x53ae73)
          }), "error");
        }
      });
      return {
        'ok': !![]
      };
    } catch (_0x1a977c) {
      consoleObject["error"]?.('[globalCapture]\x20failed\x20to\x20handle\x20selected\x20text', _0x1a977c);
      _0x4f56d2?.(_0x13f3ff('globalCapture.actionFailed', {
        'reason': String(_0x1a977c?.["message"] || _0x1a977c || '')
      }), "error");
      return {
        'ok': ![],
        'reason': String(_0x1a977c?.['message'] || _0x1a977c || ''),
        'retryable': ![]
      };
    }
  }
  const _0x28c306 = [];
  const _0x592a95 = createGlobalCaptureReceiver({
    'api': _0x4ae86f,
    'handle': _0x11dcdc
  });
  const _0xaf3d70 = _0x4ae86f['onSelectedText']?.((_0x3de293 = {}) => _0x592a95["receive"](_0x3de293));
  typeof _0xaf3d70 === 'function' && _0x28c306["push"](_0xaf3d70);
  const _0x371f30 = _0x4ae86f["onGlobalShortcutStatus"]?.((_0x4ac5ef = {}) => {
    if (_0x4ac5ef?.["registered"] === ![] && _0x4ac5ef?.["reason"] === 'registration-failed') {
      _0x4f56d2?.(_0x13f3ff("globalTextPreset.shortcutRegistrationFailed", {
        'accelerator': _0x4ac5ef?.["accelerator"] || "Alt+C"
      }), "warn");
      return;
    }
    _0x4ac5ef?.['registered'] === !![] && COPY_FAILURE_REASONS["has"](_0x4ac5ef?.["reason"]) && _0x4f56d2?.(_0x13f3ff("globalTextPreset.noSelectedText"), "warn");
  });
  typeof _0x371f30 === "function" && _0x28c306['push'](_0x371f30);
  return () => {
    _0x2298c6 = !![];
    _0x592a95['dispose']();
    _0x28c306["forEach"](_0xaa088e => _0xaa088e());
  };
}