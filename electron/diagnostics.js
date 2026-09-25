import a213_0x43fdff from 'yazl';
import { randomUUID } from 'node:crypto';
import { appendFileSync, closeSync, createWriteStream, existsSync, mkdirSync, openSync, readFileSync, readSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import a213_0x112746 from 'node:os';
import a213_0x11b845 from 'node:path';
import { mergeDiagnosticEvidence, summarizeBackendLog } from './diagnosticsEvidence.js';
import { serializeDiagnosticError } from '../src/utils/diagnosticError.js';
const DESKTOP_LOG_NAME = "desktop.log.jsonl";
const ROTATED_DESKTOP_LOG_NAME = DESKTOP_LOG_NAME + '.1';
const INCIDENT_LOG_NAME = 'incidents.log.jsonl';
const INCIDENT_LOG_BYTES = 0x2 * 0x400 * 0x400;
const DIAGNOSTIC_README_NAME = "README.txt";
const DIAGNOSTIC_METADATA_NAME = "metadata.json";
const AI_DIAGNOSTICS_REPORT_NAME = "ai-diagnostics-report.json";
const DIAGNOSTIC_PACKAGE_MANIFEST_NAME = "package-manifest.json";
const DIAGNOSTIC_ERROR_SUMMARY_NAME = "error-summary.json";
const DEFAULT_MAX_LOG_BYTES = 0x5 * 0x400 * 0x400;
const DEFAULT_SERVER_TAIL_BYTES = 0x400 * 0x400;
const DEFAULT_DESKTOP_TAIL_BYTES = 0x2 * 0x400 * 0x400;
const DEFAULT_ROTATED_DESKTOP_TAIL_BYTES = 0x2 * 0x400 * 0x400;
const MAX_RECENT_PROBLEMS = 0x1e;
const MAX_STRING_LENGTH = 0x7d0;
const MAX_STACK_LENGTH = 0x2710;
const MAX_ARRAY_ITEMS = 0x1e;
const MAX_OBJECT_KEYS = 0x50;
const MAX_DEPTH = 0x5;
const REDACTED = "[REDACTED]";
const SENSITIVE_KEY_RE = /(?:api[-_ ]?key|token|authorization|password|passwd|pwd|cdkey|secret|cookie|session|bearer|access[-_ ]?key|refresh[-_ ]?key)/i;
const PRIVATE_CONTENT_KEY_RE = /^(?:prompt|negativePrompt|inputText|sourceText|projectJson|canvasJson|requestBody|responseBody|rawRequest|rawResponse)$/i;
const SAFE_DIAGNOSTIC_KEYS = new Set(["dragFpsSessions", "panFpsSessions", 'zoomFpsSessions', 'resizeFpsSessions', 'launchSessionId', "launchSessionIds"]);
const SENSITIVE_TEXT_NAME = String["raw"]`(?:api[-_ ]?key|token|authorization|password|passwd|pwd|cdkey|secret|cookie|bearer|access[-_ ]?key|refresh[-_ ]?key|prompt|negativePrompt|inputText|sourceText|projectJson|canvasJson|requestBody|responseBody|rawRequest|rawResponse)`;
const PRIVATE_CONTENT_TEXT_NAME = String["raw"]`(?:prompt|negativePrompt|inputText|sourceText|projectJson|canvasJson|requestBody|responseBody|rawRequest|rawResponse)`;
const PRIVATE_CONTENT_ASSIGNMENT_RE = new RegExp(String['raw']`((?:["']?${PRIVATE_CONTENT_TEXT_NAME}["']?)\s*[:=]\s*)(?:"[^"\r\n]*"|'[^'\r\n]*'|[^\r\n]*)`, 'gi');
const SENSITIVE_ASSIGNMENT_RE = new RegExp(String['raw']`((?:["']?${SENSITIVE_TEXT_NAME}["']?)\s*[:=]\s*)(?:"[^"\r\n]*"|'[^'\r\n]*'|[^\s,;\]}]+)`, 'gi');
const SENSITIVE_QUERY_RE = new RegExp(String["raw"]`([?&]${SENSITIVE_TEXT_NAME}=)[^&#\s]*`, 'gi');
const BEARER_VALUE_RE = /\bBearer\s+[A-Za-z0-9._~+/=-]{8,}/gi;
const COMMON_SECRET_VALUE_RE = /\b(?:sk|rk|pk)-[A-Za-z0-9_-]{8,}\b/gi;
function normalizeOneLine(_0x58acd9, _0xfd78d5 = '') {
  return String(_0x58acd9 ?? _0xfd78d5)['replace'](/\s+/g, '\x20')["trim"]();
}
function truncateString(_0x31ab80, _0x406b83 = MAX_STRING_LENGTH) {
  const _0x42996d = String(_0x31ab80 ?? '');
  if (_0x42996d["length"] <= _0x406b83) {
    return _0x42996d;
  }
  return _0x42996d["slice"](0x0, _0x406b83) + "... [truncated " + (_0x42996d["length"] - _0x406b83) + " chars]";
}
function escapeRegExp(_0x4f2380) {
  return String(_0x4f2380 || '')["replace"](/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function redactSensitiveText(_0x364b34) {
  let _0x531d00 = String(_0x364b34 ?? '');
  _0x531d00 = _0x531d00["replace"](PRIVATE_CONTENT_ASSIGNMENT_RE, '$1' + REDACTED)["replace"](BEARER_VALUE_RE, "Bearer " + REDACTED)["replace"](SENSITIVE_QUERY_RE, '$1' + REDACTED)["replace"](SENSITIVE_ASSIGNMENT_RE, '$1' + REDACTED)["replace"](COMMON_SECRET_VALUE_RE, REDACTED);
  const _0x52bff7 = String(a213_0x112746["homedir"]?.() || '')["trim"]();
  if (_0x52bff7) {
    const _0x14e854 = new Set([_0x52bff7, _0x52bff7["replace"](/\\/g, '/')]);
    for (const _0x458bb1 of _0x14e854) {
      if (!_0x458bb1) {
        continue;
      }
      _0x531d00 = _0x531d00['replace'](new RegExp(escapeRegExp(_0x458bb1), 'gi'), "%USERPROFILE%");
    }
  }
  return _0x531d00;
}
function sanitizeDiagnosticText(_0x4464ce, _0x3dc5a1 = MAX_STRING_LENGTH) {
  return truncateString(redactSensitiveText(_0x4464ce), _0x3dc5a1);
}
function isSensitiveDiagnosticKey(_0xb1e3ef) {
  const _0x510ebf = String(_0xb1e3ef || '');
  if (SAFE_DIAGNOSTIC_KEYS["has"](_0x510ebf)) {
    return ![];
  }
  return SENSITIVE_KEY_RE["test"](_0x510ebf) || PRIVATE_CONTENT_KEY_RE["test"](_0x510ebf);
}
export function sanitizeDiagnosticValue(_0x121c19, _0x189286 = {}) {
  const _0x322ccf = Number(_0x189286['depth'] || 0x0) || 0x0;
  const _0xf21bdb = Math["min"](0xc, Math["max"](MAX_DEPTH, Number(_0x189286['maxDepth']) || MAX_DEPTH));
  const _0x270180 = String(_0x189286['key'] || '');
  if (isSensitiveDiagnosticKey(_0x270180)) {
    return REDACTED;
  }
  if (_0x121c19 == null) {
    return _0x121c19;
  }
  const _0x32fb11 = typeof _0x121c19;
  if (_0x32fb11 === 'string') {
    return sanitizeDiagnosticText(_0x121c19, _0x270180 === "stack" ? MAX_STACK_LENGTH : MAX_STRING_LENGTH);
  }
  if (_0x32fb11 === "number" || _0x32fb11 === "boolean") {
    return _0x121c19;
  }
  if (_0x32fb11 === "bigint") {
    return String(_0x121c19);
  }
  if (_0x32fb11 === "function") {
    return "[Function]";
  }
  if (_0x32fb11 !== "object") {
    return sanitizeDiagnosticText(String(_0x121c19));
  }
  if (_0x322ccf >= _0xf21bdb) {
    return '[MaxDepth]';
  }
  if (_0x121c19 instanceof Error) {
    return sanitizeDiagnosticValue(serializeDiagnosticError(_0x121c19), {
      'depth': _0x322ccf,
      'maxDepth': _0xf21bdb
    });
  }
  if (Array['isArray'](_0x121c19)) {
    const _0x3ce16c = _0x121c19["slice"](0x0, MAX_ARRAY_ITEMS)["map"](_0x40e266 => sanitizeDiagnosticValue(_0x40e266, {
      'depth': _0x322ccf + 0x1,
      'maxDepth': _0xf21bdb
    }));
    _0x121c19["length"] > MAX_ARRAY_ITEMS && _0x3ce16c["push"]('[truncated\x20' + (_0x121c19["length"] - MAX_ARRAY_ITEMS) + '\x20items]');
    return _0x3ce16c;
  }
  const _0x3fb4e4 = {};
  const _0x4e2fff = Object['entries'](_0x121c19)['slice'](0x0, MAX_OBJECT_KEYS);
  for (const [_0x29c404, _0x2bc5e4] of _0x4e2fff) {
    _0x3fb4e4[_0x29c404] = sanitizeDiagnosticValue(_0x2bc5e4, {
      'key': _0x29c404,
      'depth': _0x322ccf + 0x1,
      'maxDepth': _0xf21bdb
    });
  }
  const _0x94881c = Object["keys"](_0x121c19)['length'] - _0x4e2fff["length"];
  if (_0x94881c > 0x0) {
    _0x3fb4e4["__truncatedKeys"] = _0x94881c;
  }
  return _0x3fb4e4;
}
export function buildDiagnosticLogEntry(_0x5a05f5 = {}, _0x400605 = new Date(), _0x3a48ef = {}) {
  const _0x28c9a1 = normalizeOneLine(_0x5a05f5["source"], "unknown") || "unknown";
  const _0x362a5b = normalizeOneLine(_0x5a05f5["type"], "event") || 'event';
  const _0x24f643 = normalizeOneLine(_0x5a05f5["level"], "info")["toLowerCase"]();
  const _0x473d03 = ["debug", 'info', "warn", "error"]["includes"](_0x24f643) ? _0x24f643 : 'info';
  const _0x49470e = _0x5a05f5["error"] instanceof Error ? _0x5a05f5['error'] : null;
  const _0x10937e = _0x5a05f5["context"] || {};
  const _0x5acf52 = _0x49470e && typeof _0x10937e === 'object' && !Array["isArray"](_0x10937e) ? {
    ..._0x10937e,
    'error': _0x49470e
  } : _0x10937e;
  const _0x48e68a = normalizeOneLine(_0x3a48ef["launchSessionId"] || _0x5a05f5["launchSessionId"]);
  const _0xd11d8e = Number(_0x3a48ef["eventSeq"] || _0x5a05f5["eventSeq"] || 0x0) || 0x0;
  return {
    'ts': _0x400605["toISOString"](),
    ...(_0x48e68a ? {
      'launchSessionId': truncateString(_0x48e68a, 0x78)
    } : {}),
    ...(_0xd11d8e > 0x0 ? {
      'eventSeq': _0xd11d8e
    } : {}),
    'type': truncateString(_0x362a5b, 0x78),
    'level': _0x473d03,
    'source': truncateString(_0x28c9a1, 0x78),
    'message': sanitizeDiagnosticText(_0x5a05f5["message"] || _0x49470e?.["message"] || _0x5a05f5['error'] || _0x362a5b, MAX_STRING_LENGTH),
    'context': sanitizeDiagnosticValue(_0x5acf52),
    'stack': sanitizeDiagnosticText(_0x5a05f5["stack"] || _0x49470e?.["stack"] || '', MAX_STACK_LENGTH)
  };
}
function ensureDir(_0x4ac328) {
  mkdirSync(_0x4ac328, {
    'recursive': !![]
  });
  return _0x4ac328;
}
function safeUnlink(_0x58cf27) {
  try {
    if (existsSync(_0x58cf27)) {
      unlinkSync(_0x58cf27);
    }
  } catch {}
}
function rotateLogIfNeeded(_0x4c41c8, _0x51b593) {
  try {
    if (!existsSync(_0x4c41c8)) {
      return;
    }
    const _0x5d4768 = statSync(_0x4c41c8)["size"];
    if (_0x5d4768 < _0x51b593) {
      return;
    }
    const _0x2b6a78 = _0x4c41c8 + '.1';
    safeUnlink(_0x2b6a78);
    renameSync(_0x4c41c8, _0x2b6a78);
  } catch {}
}
function readTailSnapshot(_0x214769, _0xcd5fcb) {
  try {
    if (!_0x214769 || !existsSync(_0x214769)) {
      return {
        'buffer': Buffer["alloc"](0x0),
        'exists': ![],
        'sourceBytes': 0x0,
        'includedBytes': 0x0,
        'truncated': ![]
      };
    }
    const _0x505308 = statSync(_0x214769);
    if (!_0x505308["isFile"]() || _0x505308["size"] <= 0x0) {
      return {
        'buffer': Buffer["alloc"](0x0),
        'exists': _0x505308['isFile'](),
        'sourceBytes': Math["max"](0x0, Number(_0x505308["size"] || 0x0)),
        'includedBytes': 0x0,
        'truncated': ![]
      };
    }
    const _0x21a1d6 = Math["min"](_0x505308['size'], _0xcd5fcb);
    const _0x3d55ec = Math["max"](0x0, _0x505308['size'] - _0x21a1d6);
    const _0x45478e = Buffer['alloc'](_0x21a1d6);
    const _0x11b9fc = openSync(_0x214769, 'r');
    try {
      readSync(_0x11b9fc, _0x45478e, 0x0, _0x21a1d6, _0x3d55ec);
    } finally {
      closeSync(_0x11b9fc);
    }
    return {
      'buffer': _0x45478e,
      'exists': !![],
      'sourceBytes': _0x505308["size"],
      'includedBytes': _0x45478e["length"],
      'truncated': _0x505308["size"] > _0x45478e['length']
    };
  } catch {
    return {
      'buffer': Buffer["alloc"](0x0),
      'exists': ![],
      'sourceBytes': 0x0,
      'includedBytes': 0x0,
      'truncated': ![],
      'readFailed': !![]
    };
  }
}
function parseJsonlEntries(_0x4e5baf = []) {
  const _0x821da = [];
  for (const _0x21e106 of _0x4e5baf) {
    const _0x3fd18b = Buffer["isBuffer"](_0x21e106) ? _0x21e106['toString']("utf8")["split"](/\r?\n/) : [];
    for (const _0x40026c of _0x3fd18b) {
      if (!_0x40026c["trim"]()) {
        continue;
      }
      try {
        const _0x46797d = JSON['parse'](_0x40026c);
        if (_0x46797d && typeof _0x46797d === "object") {
          _0x821da["push"](_0x46797d);
        }
      } catch {}
    }
  }
  return _0x821da["sort"]((_0x23580c, _0x3a0fab) => String(_0x23580c?.['ts'] || '')["localeCompare"](String(_0x3a0fab?.['ts'] || '')));
}
function sanitizeStructuredLogBuffer(_0x21de57) {
  if (!Buffer['isBuffer'](_0x21de57) || _0x21de57["length"] === 0x0) {
    return Buffer['alloc'](0x0);
  }
  const _0x146f60 = [];
  for (const _0x4348f0 of _0x21de57["toString"]("utf8")["split"](/\r?\n/)) {
    if (!_0x4348f0["trim"]()) {
      continue;
    }
    try {
      const _0x2c4c68 = JSON['parse'](_0x4348f0);
      _0x146f60["push"](JSON["stringify"](sanitizeDiagnosticValue(_0x2c4c68, {
        'maxDepth': 0xc
      })));
    } catch {}
  }
  return Buffer["from"](_0x146f60["length"] ? _0x146f60['join']('\x0a') + '\x0a' : '', "utf8");
}
function incrementCounter(_0x5cef77, _0x5d4fe6) {
  const _0x500f91 = normalizeOneLine(_0x5d4fe6, "unknown") || 'unknown';
  _0x5cef77[_0x500f91] = (_0x5cef77[_0x500f91] || 0x0) + 0x1;
}
function sortCounter(_0x1ceb66, _0x244733 = 0x32) {
  return Object["fromEntries"](Object["entries"](_0x1ceb66)["sort"]((_0x53c4af, _0x32f231) => _0x32f231[0x1] - _0x53c4af[0x1] || _0x53c4af[0x0]['localeCompare'](_0x32f231[0x0]))["slice"](0x0, _0x244733));
}
function buildErrorSummary(_0x31e05c = [], _0x42c57f = {}) {
  const _0x2de045 = {};
  const _0x4442bc = {};
  const _0x122d09 = {};
  const _0x2a469d = new Set();
  const _0x5af2fe = new Map();
  const _0x67fae1 = [];
  for (const _0x46ee3e of _0x31e05c) {
    incrementCounter(_0x2de045, _0x46ee3e?.["level"] || "info");
    incrementCounter(_0x4442bc, _0x46ee3e?.["source"] || "unknown");
    if (_0x46ee3e?.['launchSessionId']) {
      const _0x42ac71 = String(_0x46ee3e["launchSessionId"]);
      _0x2a469d["add"](_0x42ac71);
      const _0x1e5fc1 = _0x5af2fe["get"](_0x42ac71) || {
        'launchSessionId': _0x42ac71,
        'firstEventAt': _0x46ee3e?.['ts'] || '',
        'lastEventAt': _0x46ee3e?.['ts'] || '',
        'eventCount': 0x0,
        'problemCount': 0x0,
        'startedAt': '',
        'endedAt': ''
      };
      _0x1e5fc1['lastEventAt'] = _0x46ee3e?.['ts'] || _0x1e5fc1["lastEventAt"];
      _0x1e5fc1["eventCount"] += 0x1;
      if (_0x46ee3e?.["level"] === "error" || _0x46ee3e?.["level"] === "warn") {
        _0x1e5fc1["problemCount"] += 0x1;
      }
      if (_0x46ee3e?.["type"] === 'app.session_started') {
        _0x1e5fc1["startedAt"] = _0x46ee3e?.['ts'] || '';
      }
      if (_0x46ee3e?.['type'] === "app.session_ended") {
        _0x1e5fc1['endedAt'] = _0x46ee3e?.['ts'] || '';
      }
      _0x5af2fe['set'](_0x42ac71, _0x1e5fc1);
    }
    if (_0x46ee3e?.['level'] !== 'error' && _0x46ee3e?.['level'] !== 'warn') {
      continue;
    }
    incrementCounter(_0x122d09, _0x46ee3e?.['type'] || "unknown");
    _0x67fae1["push"]({
      'ts': _0x46ee3e?.['ts'] || '',
      'launchSessionId': _0x46ee3e?.["launchSessionId"] || '',
      'eventSeq': Number(_0x46ee3e?.["eventSeq"] || 0x0) || 0x0,
      'type': _0x46ee3e?.["type"] || "unknown",
      'level': _0x46ee3e?.["level"] || "warn",
      'source': _0x46ee3e?.["source"] || "unknown",
      'message': _0x46ee3e?.["message"] || '',
      'context': _0x46ee3e?.['context'] || {},
      'stack': sanitizeDiagnosticText(_0x46ee3e?.['stack'] || '', 0xfa0)
    });
  }
  return sanitizeDiagnosticValue({
    'schemaVersion': 0x2,
    'generatedAt': _0x42c57f["generatedAt"] || new Date()['toISOString'](),
    'launchSessionId': _0x42c57f["launchSessionId"] || '',
    'eventCount': _0x31e05c['length'],
    'problemCount': _0x67fae1["length"],
    'timeRange': {
      'first': _0x31e05c[0x0]?.['ts'] || '',
      'last': _0x31e05c['at'](-0x1)?.['ts'] || ''
    },
    'launchSessionIds': Array["from"](_0x2a469d)["slice"](-0x14),
    'launches': Array["from"](_0x5af2fe['values']())["slice"](-0x14)["map"](_0xedff2b => ({
      ..._0xedff2b,
      'normalEndRecorded': Boolean(_0xedff2b["endedAt"])
    })),
    'levelCounts': sortCounter(_0x2de045),
    'sourceCounts': sortCounter(_0x4442bc),
    'problemTypeCounts': sortCounter(_0x122d09),
    'recentProblems': _0x67fae1["slice"](-MAX_RECENT_PROBLEMS),
    'backend': summarizeBackendLog(_0x42c57f["backendLog"] || ''),
    'notes': ["Structured counts include retained incident evidence, deduplicated by launchSessionId and eventSeq.", "Backend text matches are listed separately and are not included in structured problemCount.", "Use launchSessionId, eventSeq, taskId and nodeId to correlate related events when available.", "A missing normal end is not proof of a crash: the launch may still be running or logs may be truncated."]
  }, {
    'maxDepth': 0xc
  });
}
function sanitizeServerLogBuffer(_0x39e12b) {
  if (!Buffer["isBuffer"](_0x39e12b) || _0x39e12b["length"] === 0x0) {
    return Buffer["alloc"](0x0);
  }
  return Buffer["from"](redactSensitiveText(_0x39e12b["toString"]("utf8")), "utf8");
}
function describePackageFile(_0x5e0d1b, _0x21471c, _0x11530e = {}) {
  return {
    'name': _0x5e0d1b,
    'kind': _0x11530e["kind"] || "log",
    'included': _0x11530e["included"] !== ![],
    'sourceBytes': Number(_0x21471c?.["sourceBytes"] || 0x0),
    'includedBytes': Number(_0x11530e["includedBytes"] ?? _0x21471c?.['includedBytes'] ?? 0x0),
    'truncated': _0x21471c?.["truncated"] === !![],
    'readFailed': _0x21471c?.['readFailed'] === !![],
    'redacted': _0x11530e["redacted"] === !![]
  };
}
function writeZip(_0x1c0777, _0x3b1e4c) {
  return new Promise((_0x5a7e49, _0x3882e5) => {
    const _0x517b6a = createWriteStream(_0x3b1e4c);
    _0x517b6a["once"]('close', _0x5a7e49);
    _0x517b6a["once"]("error", _0x3882e5);
    _0x1c0777["outputStream"]['once']("error", _0x3882e5);
    _0x1c0777["outputStream"]["pipe"](_0x517b6a);
    _0x1c0777["end"]();
  });
}
function resolveDownloadsDir(_0x115240, _0x2ccd58) {
  try {
    const _0x373e13 = _0x115240?.["getPath"]?.("downloads");
    if (_0x373e13) {
      return ensureDir(_0x373e13);
    }
  } catch {}
  return ensureDir(_0x2ccd58);
}
function timestampForFilename(_0x50534a = new Date()) {
  const _0x15f30a = _0x2473e5 => String(_0x2473e5)["padStart"](0x2, '0');
  return [_0x50534a["getFullYear"](), _0x15f30a(_0x50534a["getMonth"]() + 0x1), _0x15f30a(_0x50534a["getDate"]()), '-', _0x15f30a(_0x50534a["getHours"]()), _0x15f30a(_0x50534a["getMinutes"]()), _0x15f30a(_0x50534a["getSeconds"]())]['join']('');
}
function buildReadme() {
  return ["SHUO Canvas 诊断包", '', "请将整个 ZIP 文件发送给开发者用于排查问题。", "本诊断包包含运行日志、错误摘要、环境摘要和生成瞬间的脱敏状态快照。", "不包含项目文件、画布正文、素材、提示词、API Key 或授权码。", "package-manifest.json 会说明日志时间范围、截断和脱敏状态。", '']["join"]('\x0a');
}
export function createDiagnosticsManager(_0x426dcb = {}) {
  const _0x5ee065 = ensureDir(_0x426dcb["logDir"]);
  const _0x379dfe = ensureDir(_0x426dcb["diagnosticsDir"] || a213_0x11b845["join"](_0x5ee065, "diagnostics"));
  const _0x5adc51 = _0x426dcb["desktopLogPath"] || a213_0x11b845['join'](_0x5ee065, DESKTOP_LOG_NAME);
  const _0x4ce790 = a213_0x11b845["join"](_0x5ee065, INCIDENT_LOG_NAME);
  const _0x3d7149 = _0x426dcb["serverLogPath"] || '';
  const _0x281a5b = Number(_0x426dcb["maxLogBytes"] || DEFAULT_MAX_LOG_BYTES) || DEFAULT_MAX_LOG_BYTES;
  const _0x235bbd = normalizeOneLine(_0x426dcb["launchSessionId"] || randomUUID());
  const _0xdbef9f = _0x426dcb["app"] || null;
  const _0xc0cc79 = typeof _0x426dcb["getMetadata"] === "function" ? _0x426dcb["getMetadata"] : () => ({});
  let _0x186020 = 0x0;
  let _0x3dd24f = ![];
  let _0x4f05b1 = ![];
  const _0x5ac05d = [];
  function _0x5e17bc(_0x10e37b = {}) {
    try {
      ensureDir(_0x5ee065);
      rotateLogIfNeeded(_0x5adc51, _0x281a5b);
      _0x186020 += 0x1;
      const _0x1098cf = buildDiagnosticLogEntry(_0x10e37b, new Date(), {
        'launchSessionId': _0x235bbd,
        'eventSeq': _0x186020
      });
      appendFileSync(_0x5adc51, JSON["stringify"](_0x1098cf) + '\x0a', "utf8");
      if (_0x1098cf['level'] === "warn" || _0x1098cf["level"] === "error") {
        try {
          rotateLogIfNeeded(_0x4ce790, INCIDENT_LOG_BYTES);
          appendFileSync(_0x4ce790, JSON['stringify']({
            'event': _0x1098cf,
            'precedingEvents': _0x5ac05d
          }) + '\x0a', 'utf8');
        } catch {}
      }
      _0x5ac05d['push'](_0x1098cf);
      if (_0x5ac05d['length'] > 0x8) {
        _0x5ac05d["shift"]();
      }
      return {
        'ok': !![]
      };
    } catch (_0x428dc3) {
      return {
        'ok': ![],
        'error': String(_0x428dc3?.["message"] || _0x428dc3)
      };
    }
  }
  function _0x3d8445(_0x207deb = new Date()) {
    const _0x44d33c = "AI-CanvasPro-Diagnostics-" + timestampForFilename(_0x207deb) + '.zip';
    return a213_0x11b845["join"](resolveDownloadsDir(_0xdbef9f, _0x379dfe), _0x44d33c);
  }
  async function _0x46130d(_0xb3028a = {}) {
    const _0x28425b = new Date();
    _0x5e17bc({
      'type': "diagnostics.package_collecting",
      'level': 'info',
      'source': "main",
      'message': 'Diagnostics\x20package\x20collection\x20started'
    });
    const _0x5904da = String(_0xb3028a?.["outputPath"] || '')['trim']();
    if (_0x5904da && !a213_0x11b845["isAbsolute"](_0x5904da)) {
      throw new Error("Diagnostics output path must be absolute");
    }
    const _0x14a8d7 = _0x5904da ? a213_0x11b845['resolve'](_0x5904da) : _0x3d8445(_0x28425b);
    ensureDir(a213_0x11b845["dirname"](_0x14a8d7));
    const _0x43c528 = a213_0x11b845['basename'](_0x14a8d7);
    const _0xfd58a3 = await Promise["resolve"](_0xc0cc79());
    const _0x4bb5a5 = sanitizeDiagnosticValue({
      'generatedAt': _0x28425b["toISOString"](),
      'host': {
        'platform': process["platform"],
        'arch': process["arch"],
        'osRelease': a213_0x112746["release"]()
      },
      'diagnostics': {
        'schemaVersion': 0x2,
        'launchSessionId': _0x235bbd
      },
      ...(_0xfd58a3 || {})
    });
    const _0x50c187 = _0x5adc51 + '.1';
    const _0x383163 = readTailSnapshot(_0x50c187, DEFAULT_ROTATED_DESKTOP_TAIL_BYTES);
    const _0x15aaa3 = readTailSnapshot(_0x5adc51, DEFAULT_DESKTOP_TAIL_BYTES);
    const _0x42a6d0 = readTailSnapshot(_0x3d7149, DEFAULT_SERVER_TAIL_BYTES);
    const _0x3e0236 = sanitizeStructuredLogBuffer(_0x383163["buffer"]);
    const _0x1e55d2 = sanitizeStructuredLogBuffer(_0x15aaa3["buffer"]);
    const _0x47af3f = sanitizeServerLogBuffer(_0x42a6d0["buffer"]);
    const _0x486f6e = [INCIDENT_LOG_NAME, INCIDENT_LOG_NAME + '.1']["map"](_0x4f2d70 => {
      const _0x48314a = readTailSnapshot(a213_0x11b845["join"](_0x5ee065, _0x4f2d70), INCIDENT_LOG_BYTES);
      return {
        'name': _0x4f2d70,
        'snapshot': _0x48314a,
        'buffer': sanitizeStructuredLogBuffer(_0x48314a["buffer"])
      };
    });
    const _0x4beb5f = mergeDiagnosticEvidence(parseJsonlEntries([_0x3e0236, _0x1e55d2]), parseJsonlEntries(_0x486f6e['map'](_0x24d5fd => _0x24d5fd["buffer"])));
    const _0x2c4ffb = buildErrorSummary(_0x4beb5f, {
      'generatedAt': _0x28425b["toISOString"](),
      'launchSessionId': _0x235bbd,
      'backendLog': _0x47af3f['toString']("utf8")
    });
    const _0x3799ab = _0xb3028a?.["aiAnalysisReport"] && typeof _0xb3028a["aiAnalysisReport"] === "object" ? sanitizeDiagnosticValue(_0xb3028a["aiAnalysisReport"], {
      'maxDepth': 0xc
    }) : null;
    const _0x384151 = Buffer["from"](JSON["stringify"](_0x4bb5a5, null, 0x2) + '\x0a', 'utf8');
    const _0x18c2c9 = Buffer["from"](JSON['stringify'](_0x2c4ffb, null, 0x2) + '\x0a', "utf8");
    const _0x5db786 = _0x3799ab ? Buffer["from"](JSON["stringify"](_0x3799ab, null, 0x2) + '\x0a', "utf8") : null;
    const _0x14317b = Buffer["from"](buildReadme(), "utf8");
    const _0x5073cc = [describePackageFile(DIAGNOSTIC_METADATA_NAME, null, {
      'kind': "environment",
      'includedBytes': _0x384151["length"]
    }), describePackageFile(DIAGNOSTIC_ERROR_SUMMARY_NAME, null, {
      'kind': "summary",
      'includedBytes': _0x18c2c9["length"]
    }), describePackageFile(DESKTOP_LOG_NAME, _0x15aaa3, {
      'kind': "structured-log",
      'includedBytes': _0x1e55d2["length"],
      'redacted': !![]
    }), describePackageFile(ROTATED_DESKTOP_LOG_NAME, _0x383163, {
      'kind': "structured-log-archive",
      'included': _0x383163["exists"],
      'includedBytes': _0x3e0236["length"],
      'redacted': !![]
    }), describePackageFile("server.log", _0x42a6d0, {
      'kind': "backend-log",
      'includedBytes': _0x47af3f["length"],
      'redacted': !![]
    }), describePackageFile(DIAGNOSTIC_README_NAME, null, {
      'kind': "instructions",
      'includedBytes': _0x14317b['length']
    })];
    for (const _0x58788d of _0x486f6e) {
      _0x5073cc['push'](describePackageFile(_0x58788d["name"], _0x58788d["snapshot"], {
        'kind': "incident-evidence",
        'included': _0x58788d["snapshot"]["exists"],
        'includedBytes': _0x58788d['buffer']["length"],
        'redacted': !![]
      }));
    }
    _0x5db786 && _0x5073cc["splice"](0x1, 0x0, describePackageFile(AI_DIAGNOSTICS_REPORT_NAME, null, {
      'kind': 'runtime-snapshot',
      'includedBytes': _0x5db786["length"]
    }));
    const _0x4ff8d7 = sanitizeDiagnosticValue({
      'schemaVersion': 0x1,
      'generatedAt': _0x28425b["toISOString"](),
      'launchSessionId': _0x235bbd,
      'limits': {
        'desktopTailBytes': DEFAULT_DESKTOP_TAIL_BYTES,
        'rotatedDesktopTailBytes': DEFAULT_ROTATED_DESKTOP_TAIL_BYTES,
        'serverTailBytes': DEFAULT_SERVER_TAIL_BYTES,
        'recentProblems': MAX_RECENT_PROBLEMS,
        'incidentTailBytesPerFile': INCIDENT_LOG_BYTES,
        'precedingEventsPerIncident': 0x8
      },
      'structuredLogRange': _0x2c4ffb["timeRange"],
      'files': _0x5073cc,
      'privacy': {
        'structuredLogsRedacted': !![],
        'backendLogRedactedDuringPackaging': !![],
        'projectFilesIncluded': ![],
        'assetFilesIncluded': ![],
        'promptsIncluded': ![]
      }
    });
    const _0x268ac9 = new a213_0x43fdff['ZipFile']();
    _0x268ac9["addBuffer"](_0x384151, DIAGNOSTIC_METADATA_NAME);
    _0x268ac9['addBuffer'](Buffer['from'](JSON["stringify"](_0x4ff8d7, null, 0x2) + '\x0a', "utf8"), DIAGNOSTIC_PACKAGE_MANIFEST_NAME);
    _0x268ac9["addBuffer"](_0x18c2c9, DIAGNOSTIC_ERROR_SUMMARY_NAME);
    if (_0x5db786) {
      _0x268ac9["addBuffer"](_0x5db786, AI_DIAGNOSTICS_REPORT_NAME);
    }
    _0x268ac9["addBuffer"](_0x1e55d2, DESKTOP_LOG_NAME);
    _0x383163["exists"] && _0x268ac9['addBuffer'](_0x3e0236, ROTATED_DESKTOP_LOG_NAME);
    _0x268ac9["addBuffer"](_0x47af3f, "server.log");
    for (const _0xbcf6c0 of _0x486f6e) {
      if (_0xbcf6c0["snapshot"]["exists"]) {
        _0x268ac9['addBuffer'](_0xbcf6c0["buffer"], _0xbcf6c0["name"]);
      }
    }
    _0x268ac9["addBuffer"](_0x14317b, DIAGNOSTIC_README_NAME);
    try {
      await writeZip(_0x268ac9, _0x14a8d7);
      _0x5e17bc({
        'type': "diagnostics.package_created",
        'level': 'info',
        'source': "main",
        'message': "Diagnostics package created",
        'context': {
          'filename': _0x43c528,
          'outputDirectory': _0x5904da ? "user-selected" : "downloads"
        }
      });
      return {
        'ok': !![],
        'path': _0x14a8d7,
        'filename': _0x43c528
      };
    } catch (_0x3eb550) {
      _0x5e17bc({
        'type': 'diagnostics.package_failed',
        'level': "error",
        'source': "main",
        'message': "Diagnostics package failed",
        'error': _0x3eb550
      });
      throw _0x3eb550;
    }
  }
  function _0x5d9d1d() {
    ensureDir(_0x5ee065);
    !existsSync(_0x5adc51) && writeFileSync(_0x5adc51, '', "utf8");
    !_0x3dd24f && (_0x3dd24f = !![], _0x5e17bc({
      'type': "app.session_started",
      'level': "info",
      'source': "main",
      'message': "Desktop application session started",
      'context': {
        'pid': process['pid'],
        'packaged': _0xdbef9f?.['isPackaged'] === !![]
      }
    }), typeof _0xdbef9f?.["once"] === 'function' && _0xdbef9f["once"]("before-quit", () => {
      if (_0x4f05b1) {
        return;
      }
      _0x4f05b1 = !![];
      _0x5e17bc({
        'type': "app.session_ended",
        'level': "info",
        'source': "main",
        'message': 'Desktop\x20application\x20session\x20ended'
      });
    }));
  }
  return {
    'launchSessionId': _0x235bbd,
    'logDir': _0x5ee065,
    'diagnosticsDir': _0x379dfe,
    'desktopLogPath': _0x5adc51,
    'serverLogPath': _0x3d7149,
    'ensureInitialFiles': _0x5d9d1d,
    'logEvent': _0x5e17bc,
    'getSuggestedPackagePath': _0x3d8445,
    'createPackage': _0x46130d
  };
}