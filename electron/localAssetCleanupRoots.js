import { buildLocalAssetCleanupRoots } from './localAssetCleanup.js';
export async function readFileSavePathsForLocalCleanup({
  requestLocalJson: _0x354902,
  logDiagnosticEvent: _0x1cb42c
}) {
  try {
    const _0x1e2aff = await _0x354902("/api/v2/user/settings.json");
    if (!_0x1e2aff || typeof _0x1e2aff !== "object" || Array['isArray'](_0x1e2aff) || _0x1e2aff["fileSavePaths"] != null && (typeof _0x1e2aff["fileSavePaths"] !== "object" || Array["isArray"](_0x1e2aff['fileSavePaths']))) {
      throw new Error("保存路径设置格式无效");
    }
    return _0x1e2aff?.["fileSavePaths"] && typeof _0x1e2aff['fileSavePaths'] === "object" ? _0x1e2aff["fileSavePaths"] : {};
  } catch (_0x2f97c5) {
    _0x1cb42c?.({
      'type': "local_asset_cleanup.settings_read_failed",
      'level': "warn",
      'source': "main",
      'message': "Failed to read current file save paths for local asset cleanup",
      'error': _0x2f97c5
    });
    throw new Error("读取保存路径失败，无法安全扫描，请重试", {
      'cause': _0x2f97c5
    });
  }
}
export function createLocalAssetCleanupRootsResolver({
  getCurrentDefaults: _0x40ca44,
  readCurrentFileSavePaths: _0x727c6b
}) {
  return async function _0xbc8252() {
    const _0x50799d = _0x40ca44?.() || {};
    return buildLocalAssetCleanupRoots({
      'fileSavePaths': await _0x727c6b?.(),
      'defaults': _0x50799d
    });
  };
}