import { reportRendererStartupFailure } from '../../api/rendererStartupApi.js';
import { rendererStartupState } from './rendererStartupState.js';
import { CHROME_SHELL_STARTUP_FAILED_EVENT, readChromeShellStartupMetadata } from './chromeShellStartupReadiness.js';
export function installRendererStartupDiagnostics({
  windowObject = globalThis['window'],
  startup = rendererStartupState,
  report = reportRendererStartupFailure
} = {}) {
  if (!windowObject?.["addEventListener"]) {
    return () => {};
  }
  if (startup["snapshot"]()["ready"]) {
    return () => {};
  }
  const _0x238b6a = _0x4289b6 => {
    if (_0x4289b6?.["target"] && _0x4289b6["target"] !== windowObject && _0x4289b6['target']["tagName"] !== "SCRIPT") {
      return;
    }
    startup["fail"]("entry");
  };
  let _0x54f5f6 = ![];
  let _0x1fb20a = ![];
  let _0xa2977 = () => {};
  _0xa2977 = startup["subscribe"](_0x8f8aa8 => {
    if (_0x8f8aa8["ready"]) {
      _0x757c05();
      return;
    }
    if (!_0x8f8aa8["failure"] || _0x1fb20a) {
      return;
    }
    _0x1fb20a = !![];
    const _0x24cf21 = String(windowObject["location"]?.['href'] || '');
    const _0x5f75cd = readChromeShellStartupMetadata(_0x24cf21);
    if (!_0x5f75cd) {
      return;
    }
    void (async () => {
      for (let _0x3cf1e8 = 0x0; _0x3cf1e8 < 0x3 && !_0x54f5f6; _0x3cf1e8 += 0x1) {
        try {
          const _0x2653e7 = await report({
            'type': CHROME_SHELL_STARTUP_FAILED_EVENT,
            'source': "renderer",
            'level': "error",
            'message': "Renderer startup failed",
            'context': {
              'href': _0x24cf21,
              ..._0x5f75cd,
              'stage': _0x8f8aa8["phase"],
              'failure': _0x8f8aa8["failure"]
            }
          });
          if (_0x2653e7?.["success"]) {
            break;
          }
        } catch {}
      }
    })();
  });
  function _0x757c05() {
    _0x54f5f6 = !![];
    _0xa2977();
    windowObject['removeEventListener']("error", _0x238b6a, !![]);
    windowObject["removeEventListener"]('pagehide', _0x757c05);
  }
  windowObject["addEventListener"]("error", _0x238b6a, !![]);
  windowObject["addEventListener"]('pagehide', _0x757c05, {
    'once': !![]
  });
  return _0x757c05;
}