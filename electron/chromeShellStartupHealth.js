import { CHROME_SHELL_STARTUP_READY_EVENT, CHROME_SHELL_STARTUP_FAILED_EVENT, isChromeShellStartupAttemptId, readChromeShellStartupMetadata } from '../src/services/chromeShellStartupReadiness.js';
const DEFAULT_READY_TIMEOUT_MS = 0x7530;
const MIN_READY_TIMEOUT_MS = 0x3e8;
const MAX_READY_TIMEOUT_MS = 0x1d4c0;
function createStartupHealthError(_0x32b506, _0x56b5bd) {
  const _0x4e40aa = new Error(_0x32b506);
  _0x4e40aa['code'] = _0x56b5bd;
  return _0x4e40aa;
}
export function resolveChromeShellStartupReadyTimeoutMs(_0x4fbc37 = process["env"]) {
  const _0x25f7ed = Number(_0x4fbc37?.["AIC_CHROME_SHELL_READY_TIMEOUT_MS"]);
  if (!Number["isFinite"](_0x25f7ed) || _0x25f7ed <= 0x0) {
    return DEFAULT_READY_TIMEOUT_MS;
  }
  return Math["max"](MIN_READY_TIMEOUT_MS, Math['min'](MAX_READY_TIMEOUT_MS, Math['round'](_0x25f7ed)));
}
export function createChromeShellStartupHealthController({
  setTimeoutFn = setTimeout,
  clearTimeoutFn = clearTimeout,
  now = () => Date["now"]()
} = {}) {
  let _0x157976 = null;
  let _0x5a4d48 = null;
  function _0x3e6103(_0x3b8dd1) {
    if (!_0x5a4d48) {
      return ![];
    }
    const _0x569a29 = _0x5a4d48;
    _0x5a4d48 = null;
    clearTimeoutFn(_0x569a29['timer']);
    _0x569a29["reject"](_0x3b8dd1);
    return !![];
  }
  function _0x5ab538({
    timeoutMs = DEFAULT_READY_TIMEOUT_MS,
    startupAttemptId: _0x3c6807
  } = {}) {
    if (!isChromeShellStartupAttemptId(_0x3c6807)) {
      return Promise["reject"](createStartupHealthError("Chrome shell startup attempt ID is invalid", "CHROME_SHELL_STARTUP_ATTEMPT_INVALID"));
    }
    _0x157976 = null;
    _0x3e6103(createStartupHealthError("Chrome shell renderer readiness wait was replaced", "CHROME_SHELL_RENDERER_READY_REPLACED"));
    const _0x2fa156 = now();
    const _0x9327b4 = Math["max"](MIN_READY_TIMEOUT_MS, Math["min"](MAX_READY_TIMEOUT_MS, Math["round"](Number(timeoutMs) || 0x0)));
    return new Promise((_0x351b44, _0x5e8087) => {
      const _0x2bb6a9 = setTimeoutFn(() => {
        if (!_0x5a4d48 || _0x5a4d48['reject'] !== _0x5e8087) {
          return;
        }
        _0x5a4d48 = null;
        _0x5e8087(createStartupHealthError("Chrome shell renderer did not become ready within " + _0x9327b4 + 'ms', "CHROME_SHELL_RENDERER_READY_TIMEOUT"));
      }, _0x9327b4);
      _0x5a4d48 = {
        'reject': _0x5e8087,
        'resolve': _0x351b44,
        'readyTimeoutMs': _0x9327b4,
        'startedAt': _0x2fa156,
        'startupAttemptId': _0x3c6807,
        'timer': _0x2bb6a9
      };
    });
  }
  function _0xed0215(_0x473438 = {}) {
    const _0x1a1fcf = _0x473438?.['type'] === CHROME_SHELL_STARTUP_FAILED_EVENT;
    if (!_0x1a1fcf && _0x473438?.['type'] !== CHROME_SHELL_STARTUP_READY_EVENT) {
      return ![];
    }
    if (_0x473438?.["source"] !== "renderer") {
      return ![];
    }
    const _0x2f740f = readChromeShellStartupMetadata(_0x473438?.['context']?.["href"]);
    if (!_0x2f740f) {
      return ![];
    }
    if (_0x473438?.["context"]?.['startupAttemptId'] !== _0x2f740f['startupAttemptId']) {
      return ![];
    }
    if (_0x473438?.["context"]?.["readyTimeoutMs"] !== _0x2f740f["readyTimeoutMs"]) {
      return ![];
    }
    if (!_0x5a4d48) {
      if (_0x1a1fcf) {
        return ![];
      }
      return _0x157976?.["startupAttemptId"] === _0x2f740f["startupAttemptId"] && _0x157976?.["readyTimeoutMs"] === _0x2f740f["readyTimeoutMs"];
    }
    if (_0x2f740f['startupAttemptId'] !== _0x5a4d48["startupAttemptId"]) {
      return ![];
    }
    if (_0x2f740f["readyTimeoutMs"] !== _0x5a4d48["readyTimeoutMs"]) {
      return ![];
    }
    if (_0x1a1fcf) {
      const _0x4c094d = createStartupHealthError('Canvas\x20renderer\x20initialization\x20failed', 'CHROME_SHELL_RENDERER_STARTUP_FAILED');
      const _0x3c98ac = ["entry", 'initialization', 'storage-migration', "project-hydration"];
      _0x4c094d["details"] = {
        'stage': _0x3c98ac["includes"](_0x473438["context"]["failure"]) ? _0x473438["context"]["failure"] : "initialization"
      };
      return _0x3e6103(_0x4c094d);
    }
    const _0x15af1a = _0x5a4d48;
    _0x5a4d48 = null;
    _0x157976 = {
      'readyTimeoutMs': _0x15af1a['readyTimeoutMs'],
      'startupAttemptId': _0x15af1a['startupAttemptId']
    };
    clearTimeoutFn(_0x15af1a["timer"]);
    _0x15af1a["resolve"]({
      'ready': !![],
      'elapsedMs': Math["max"](0x0, now() - _0x15af1a["startedAt"]),
      'href': String(_0x473438?.["context"]?.['href'] || ''),
      'startupAttemptId': _0x15af1a["startupAttemptId"]
    });
    return !![];
  }
  function _0x1ab755(_0x26dfa6 = "Chrome shell renderer readiness wait was cancelled", {
    startupAttemptId: _0x5c910c
  } = {}) {
    if (_0x5c910c !== undefined && _0x5a4d48?.["startupAttemptId"] !== _0x5c910c) {
      return ![];
    }
    return _0x3e6103(createStartupHealthError(_0x26dfa6, "CHROME_SHELL_RENDERER_READY_CANCELLED"));
  }
  return {
    'cancel': _0x1ab755,
    'observeDiagnosticEvent': _0xed0215,
    'waitForReady': _0x5ab538
  };
}
export const __chromeShellStartupHealthForTest = {
  'DEFAULT_READY_TIMEOUT_MS': DEFAULT_READY_TIMEOUT_MS,
  'MAX_READY_TIMEOUT_MS': MAX_READY_TIMEOUT_MS,
  'MIN_READY_TIMEOUT_MS': MIN_READY_TIMEOUT_MS
};