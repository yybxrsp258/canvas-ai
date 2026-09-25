import { t } from '../i18n/index.js';
import { desktopBridge } from './desktopBridge.js';
function getCleanupApi() {
  return desktopBridge["localAssetCleanup"]["isAvailable"]() ? desktopBridge['localAssetCleanup'] : null;
}
function cleanupText(_0x1bfea0, _0x48df68 = {}) {
  return t("settings.fileSave.cleanupRuntime." + _0x1bfea0, _0x48df68);
}
export function canUseLocalAssetCleanup() {
  const _0x2ec82d = getCleanupApi();
  return !!(_0x2ec82d && typeof _0x2ec82d["scan"] === "function" && typeof _0x2ec82d["trash"] === "function");
}
export function getCurrentProjectSnapshotForCleanup() {
  const _0x536303 = globalThis["window"]?.["CanvasTabManager"];
  try {
    const _0x29c01c = _0x536303?.["getMultiDataSnapshot"]({
      'sanitizeForPersistence': ![],
      'captureVisualSnapshot': ![]
    });
    if (!_0x29c01c || typeof _0x29c01c !== "object") {
      throw new Error('snapshot\x20unavailable');
    }
    return _0x29c01c;
  } catch {
    throw new Error(cleanupText('snapshotUnavailable'));
  }
}
export async function scanLocalAssetCleanup(_0x39ea88 = {}) {
  const _0x238574 = getCleanupApi();
  if (!canUseLocalAssetCleanup()) {
    throw new Error(cleanupText("notSupported"));
  }
  const _0x481383 = Object["prototype"]["hasOwnProperty"]["call"](_0x39ea88, "currentProjectSnapshot") ? _0x39ea88['currentProjectSnapshot'] : getCurrentProjectSnapshotForCleanup();
  return await _0x238574["scan"]({
    'currentProjectSnapshot': _0x481383,
    ...(_0x39ea88?.["scope"] ? {
      'scope': _0x39ea88['scope']
    } : {})
  });
}
export async function trashLocalAssetCleanup(_0x3e3444, _0x284c1f, _0x2b6769 = {}) {
  const _0x493279 = getCleanupApi();
  if (!canUseLocalAssetCleanup()) {
    throw new Error(cleanupText("notSupported"));
  }
  const _0x5d1ab2 = typeof _0x3e3444 === "string" ? _0x3e3444 : String(_0x3e3444?.["scanId"] || '')["trim"]();
  const _0x25a36f = typeof _0x3e3444 === "string" ? '' : String(_0x3e3444?.["scope"] || '')['trim']();
  const _0xfae103 = Object["prototype"]['hasOwnProperty']["call"](_0x2b6769, "currentProjectSnapshot") ? _0x2b6769["currentProjectSnapshot"] : getCurrentProjectSnapshotForCleanup();
  return await _0x493279["trash"]({
    'scanId': _0x5d1ab2,
    'localPaths': Array["isArray"](_0x284c1f) ? _0x284c1f : [],
    'currentProjectSnapshot': _0xfae103,
    ...(_0x2b6769?.["scope"] || _0x25a36f ? {
      'scope': _0x2b6769?.["scope"] || _0x25a36f
    } : {})
  });
}
export function formatCleanupBytes(_0x10eff9) {
  const _0xa3c051 = Number(_0x10eff9 || 0x0);
  if (!Number["isFinite"](_0xa3c051) || _0xa3c051 <= 0x0) {
    return "0 B";
  }
  const _0x5cf69a = ['B', 'KB', 'MB', 'GB', 'TB'];
  let _0x243fb1 = _0xa3c051;
  let _0x6267a6 = 0x0;
  while (_0x243fb1 >= 0x400 && _0x6267a6 < _0x5cf69a["length"] - 0x1) {
    _0x243fb1 /= 0x400;
    _0x6267a6 += 0x1;
  }
  const _0x29f32c = _0x243fb1 >= 0x64 || _0x6267a6 === 0x0 ? 0x0 : _0x243fb1 >= 0xa ? 0x1 : 0x2;
  return _0x243fb1["toFixed"](_0x29f32c) + '\x20' + _0x5cf69a[_0x6267a6];
}
export function summarizeLocalAssetCleanupScan(_0x49387a = {}) {
  const _0x489216 = Number(_0x49387a?.["orphanCount"] || 0x0);
  const _0x36b39e = Number(_0x49387a?.["candidateCount"] || 0x0);
  const _0xe08129 = Number(_0x49387a?.["orphanBytes"] || 0x0);
  if (!_0x49387a?.['ok']) {
    return cleanupText('scanIncomplete');
  }
  if (_0x489216 <= 0x0) {
    return cleanupText("scanEmptySummary", {
      'candidateCount': _0x36b39e
    });
  }
  return cleanupText('scanFoundSummary', {
    'candidateCount': _0x36b39e,
    'orphanCount': _0x489216,
    'orphanBytes': formatCleanupBytes(_0xe08129)
  });
}