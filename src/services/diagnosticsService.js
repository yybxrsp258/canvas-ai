import { getPerfProbeSnapshot, setPerfProbeEnabled } from '../modules/perf/perfProbe.js';
import { t } from '../i18n/index.js';
import { desktopBridge } from './desktopBridge.js';
import { serializeDiagnosticError } from '../utils/diagnosticError.js';
const MAX_CONTEXT_STRING_LENGTH = 0x4b0;
const MAX_CONTEXT_DEPTH = 0x5;
const RESOURCE_ERROR_DEDUP_MS = 0x7530;
const MAX_RESOURCE_ERROR_KEYS = 0x64;
function getDiagnosticsApi() {
  return desktopBridge["diagnostics"]["isAvailable"]() ? desktopBridge["diagnostics"] : null;
}
function toMessage(_0x5ed3e1, _0x1ec2d3 = "Unknown error") {
  if (typeof _0x5ed3e1 === "string") {
    return _0x5ed3e1;
  }
  if (_0x5ed3e1?.["message"]) {
    return String(_0x5ed3e1['message']);
  }
  return String(_0x5ed3e1 || _0x1ec2d3);
}
function normalizeContextValue(_0x284358, _0x19a0aa = 0x0) {
  if (_0x284358 == null) {
    return _0x284358;
  }
  if (typeof _0x284358 === 'string') {
    if (_0x284358['length'] <= MAX_CONTEXT_STRING_LENGTH) {
      return _0x284358;
    }
    return _0x284358["slice"](0x0, MAX_CONTEXT_STRING_LENGTH) + "...";
  }
  if (typeof _0x284358 === "number" || typeof _0x284358 === "boolean") {
    return _0x284358;
  }
  if (typeof _0x284358 !== "object") {
    return String(_0x284358);
  }
  if (_0x19a0aa >= MAX_CONTEXT_DEPTH) {
    return "[Object]";
  }
  if (_0x284358 instanceof Error) {
    return serializeDiagnosticError(_0x284358);
  }
  if (Array['isArray'](_0x284358)) {
    return _0x284358["slice"](0x0, 0x14)['map'](_0x48e79e => normalizeContextValue(_0x48e79e, _0x19a0aa + 0x1));
  }
  const _0x29e8ec = {};
  Object["entries"](_0x284358)["slice"](0x0, 0x32)["forEach"](([_0x4fe80a, _0x58f316]) => {
    _0x29e8ec[_0x4fe80a] = normalizeContextValue(_0x58f316, _0x19a0aa + 0x1);
  });
  return _0x29e8ec;
}
function summarizeResourceReference(_0xe9a3f2) {
  const _0x56ac81 = String(_0xe9a3f2 || '')["trim"]();
  if (!_0x56ac81) {
    return {
      'present': ![]
    };
  }
  const _0x18afab = _0x56ac81["split"](/[?#]/, 0x1)[0x0] || '';
  const _0x1b29c5 = _0x18afab["match"](/\.([a-z0-9]{1,8})$/i);
  const _0x13f893 = _0x56ac81["match"](/^([a-z][a-z0-9+.-]*):/i);
  return {
    'present': !![],
    'scheme': _0x13f893?.[0x1]?.['toLowerCase']() || "relative",
    'extension': _0x1b29c5 ? '.' + _0x1b29c5[0x1]['toLowerCase']() : '',
    'length': _0x56ac81["length"]
  };
}
function getResourceElementReference(_0x5ddee6) {
  return _0x5ddee6?.["currentSrc"] || _0x5ddee6?.["src"] || _0x5ddee6?.['href'] || _0x5ddee6?.["getAttribute"]?.("src") || _0x5ddee6?.['getAttribute']?.("href") || _0x5ddee6?.['getAttribute']?.("poster") || '';
}
export function logDiagnosticEvent(_0x56aea9 = {}) {
  const _0x4cfbcf = getDiagnosticsApi();
  if (typeof _0x4cfbcf?.['logEvent'] !== "function") {
    return Promise['resolve']({
      'ok': ![]
    });
  }
  const _0x2fdc02 = _0x56aea9['error'] instanceof Error ? serializeDiagnosticError(_0x56aea9["error"]) : null;
  const _0xf5c2be = normalizeContextValue(_0x56aea9["context"] || {});
  _0x2fdc02 && _0xf5c2be && typeof _0xf5c2be === "object" && !Array["isArray"](_0xf5c2be) && (_0xf5c2be["error"] = _0x2fdc02);
  const _0x212d1e = {
    'type': String(_0x56aea9["type"] || "renderer.event"),
    'level': String(_0x56aea9["level"] || "info"),
    'source': String(_0x56aea9["source"] || "renderer"),
    'message': String(_0x56aea9["message"] || toMessage(_0x2fdc02 || _0x56aea9['error'], "Renderer event")),
    'context': _0xf5c2be,
    'stack': String(_0x56aea9["stack"] || _0x2fdc02?.["stack"] || '')
  };
  try {
    return Promise["resolve"](_0x4cfbcf["logEvent"](_0x212d1e))["catch"](() => ({
      'ok': ![]
    }));
  } catch {
    return Promise["resolve"]({
      'ok': ![]
    });
  }
}
export function logDeveloperDiagnosticEvent(_0x4cc3fc = {}, {
  windowObject = globalThis['window'],
  logEvent = logDiagnosticEvent
} = {}) {
  if (windowObject?.["AI_CANVAS_IS_DEV_BUILD"] !== !![]) {
    return Promise["resolve"]({
      'ok': ![],
      'skipped': !![]
    });
  }
  try {
    return Promise["resolve"](logEvent(_0x4cc3fc))['catch'](() => ({
      'ok': ![]
    }));
  } catch {
    return Promise["resolve"]({
      'ok': ![]
    });
  }
}
export function logPerformanceSnapshot(_0xf41d92 = "manual") {
  const _0x41c8e6 = String(_0xf41d92 || "manual")["trim"]() || 'manual';
  return logDiagnosticEvent({
    'type': 'performance.snapshot',
    'level': "info",
    'source': "renderer",
    'message': "Canvas performance snapshot",
    'context': {
      'reason': _0x41c8e6,
      'snapshot': getPerfProbeSnapshot()
    }
  });
}
export async function createDiagnosticsPackage(_0x259c16 = {}) {
  const _0x24168c = getDiagnosticsApi();
  if (typeof _0x24168c?.["createPackage"] !== "function") {
    throw new Error(t("coreServices.diagnostics.packageUnsupported"));
  }
  return await _0x24168c["createPackage"](_0x259c16 && typeof _0x259c16 === 'object' ? _0x259c16 : {});
}
export async function openDiagnosticsLogsFolder() {
  const _0xb23c93 = getDiagnosticsApi();
  if (typeof _0xb23c93?.["openLogsFolder"] !== "function") {
    throw new Error(t("coreServices.diagnostics.logsUnsupported"));
  }
  return await _0xb23c93["openLogsFolder"]();
}
export function canUseDiagnostics() {
  const _0x39affc = getDiagnosticsApi();
  return !!(_0x39affc && typeof _0x39affc["logEvent"] === "function" && typeof _0x39affc["createPackage"] === "function" && typeof _0x39affc["openLogsFolder"] === "function");
}
export function initDiagnosticsService() {
  if (globalThis["window"]?.["__aiCanvasDiagnosticsInstalled"]) {
    return;
  }
  if (!canUseDiagnostics()) {
    return;
  }
  const _0x2f1427 = globalThis["window"];
  _0x2f1427["__aiCanvasDiagnosticsInstalled"] = !![];
  setPerfProbeEnabled(!![]);
  _0x2f1427["addEventListener"]("error", _0x67690b => {
    void logDiagnosticEvent({
      'type': "renderer.window_error",
      'level': "error",
      'source': "renderer",
      'message': _0x67690b?.['message'] || "Renderer window error",
      'error': _0x67690b?.["error"],
      'context': {
        'filename': _0x67690b?.["filename"] || '',
        'lineno': _0x67690b?.["lineno"] || 0x0,
        'colno': _0x67690b?.["colno"] || 0x0
      }
    });
  });
  _0x2f1427["addEventListener"]("unhandledrejection", _0x52a92a => {
    const _0x3461dd = _0x52a92a?.["reason"];
    void logDiagnosticEvent({
      'type': "renderer.unhandled_rejection",
      'level': "error",
      'source': "renderer",
      'message': toMessage(_0x3461dd, 'Renderer\x20unhandled\x20rejection'),
      'error': _0x3461dd instanceof Error ? _0x3461dd : null,
      'context': _0x3461dd instanceof Error ? {} : {
        'reason': toMessage(_0x3461dd)
      }
    });
  });
  const _0x5c0de1 = new Map();
  _0x2f1427["addEventListener"]('error', _0x30826c => {
    const _0x8cc38b = _0x30826c?.['target'];
    if (!_0x8cc38b || _0x8cc38b === _0x2f1427) {
      return;
    }
    const _0x571afd = String(_0x8cc38b?.["tagName"] || "resource")['toLowerCase']();
    const _0x1f09ee = getResourceElementReference(_0x8cc38b);
    const _0x27e5d5 = summarizeResourceReference(_0x1f09ee);
    const _0x367c33 = _0x8cc38b?.["closest"]?.(".v2-node");
    const _0x35af54 = String(_0x367c33?.["dataset"]?.["nodeId"] || _0x367c33?.['id'] || '');
    const _0x4cc5bf = _0x571afd + ':' + _0x35af54 + ':' + _0x1f09ee;
    const _0x245adb = Date['now']();
    const _0x58f7e1 = _0x5c0de1['get'](_0x4cc5bf) || 0x0;
    if (_0x245adb - _0x58f7e1 < RESOURCE_ERROR_DEDUP_MS) {
      return;
    }
    _0x5c0de1["set"](_0x4cc5bf, _0x245adb);
    _0x5c0de1["size"] > MAX_RESOURCE_ERROR_KEYS && _0x5c0de1["delete"](_0x5c0de1["keys"]()['next']()["value"]);
    void logDiagnosticEvent({
      'type': "renderer.resource_load_failed",
      'level': "warn",
      'source': 'renderer',
      'message': _0x571afd + " resource failed to load",
      'context': {
        'tagName': _0x571afd,
        'nodeId': _0x35af54,
        'resource': _0x27e5d5
      }
    });
  }, !![]);
  _0x2f1427['addEventListener']('securitypolicyviolation', _0x53c836 => {
    void logDiagnosticEvent({
      'type': "renderer.security_policy_violation",
      'level': "warn",
      'source': "renderer",
      'message': "Renderer security policy violation",
      'context': {
        'effectiveDirective': _0x53c836?.["effectiveDirective"] || '',
        'violatedDirective': _0x53c836?.["violatedDirective"] || '',
        'blockedResource': summarizeResourceReference(_0x53c836?.["blockedURI"] || ''),
        'lineNumber': Number(_0x53c836?.['lineNumber'] || 0x0) || 0x0,
        'columnNumber': Number(_0x53c836?.["columnNumber"] || 0x0) || 0x0
      }
    });
  });
  _0x2f1427["addEventListener"]('offline', () => {
    void logDiagnosticEvent({
      'type': 'renderer.network_offline',
      'level': 'warn',
      'source': "renderer",
      'message': 'Browser\x20network\x20state\x20changed\x20to\x20offline'
    });
  });
  _0x2f1427["addEventListener"]('online', () => {
    void logDiagnosticEvent({
      'type': 'renderer.network_online',
      'level': "info",
      'source': 'renderer',
      'message': "Browser network state changed to online"
    });
  });
  void logDiagnosticEvent({
    'type': "renderer.diagnostics_ready",
    'level': "info",
    'source': "renderer",
    'message': "Renderer diagnostics service initialized",
    'context': {
      'href': _0x2f1427["location"]?.["href"] || globalThis["location"]?.['href'] || '',
      'userAgent': _0x2f1427["navigator"]?.["userAgent"] || globalThis["navigator"]?.["userAgent"] || ''
    }
  });
}