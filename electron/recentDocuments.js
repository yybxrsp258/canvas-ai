import a279_0x1bdc70 from 'node:path';
import { isSupportedProjectFileExtension, listRecentProjects } from '../src/services/desktopProjectFileStore.js';
export function canUseSystemRecentDocuments(_0x1569f6 = process["platform"]) {
  return _0x1569f6 === 'darwin' || _0x1569f6 === "win32";
}
export function normalizeSystemRecentDocumentItems(_0x4f7f36 = []) {
  if (!Array["isArray"](_0x4f7f36)) {
    return [];
  }
  return _0x4f7f36["filter"](_0x5d708a => _0x5d708a && _0x5d708a['exists'] !== ![])["map"](_0x4ef0c2 => String(_0x4ef0c2['path'] || '')["trim"]())["filter"](_0x110655 => a279_0x1bdc70["isAbsolute"](_0x110655))["filter"](_0x2e449e => isSupportedProjectFileExtension(_0x2e449e));
}
export function syncSystemRecentDocuments({
  app: _0x2a9d40,
  items: _0xc40ae7,
  platform = process["platform"]
} = {}) {
  if (!canUseSystemRecentDocuments(platform)) {
    return {
      'ok': !![],
      'skipped': "platform",
      'count': 0x0,
      'paths': []
    };
  }
  if (typeof _0x2a9d40?.["clearRecentDocuments"] !== "function" || typeof _0x2a9d40?.["addRecentDocument"] !== "function") {
    return {
      'ok': ![],
      'error': "Recent document API is unavailable",
      'count': 0x0,
      'paths': []
    };
  }
  const _0x40a158 = normalizeSystemRecentDocumentItems(_0xc40ae7);
  const _0x10bbdb = [..._0x40a158]["reverse"]();
  _0x2a9d40["clearRecentDocuments"]();
  _0x10bbdb["forEach"](_0xb5380f => {
    _0x2a9d40["addRecentDocument"](_0xb5380f);
  });
  return {
    'ok': !![],
    'count': _0x40a158["length"],
    'paths': _0x40a158
  };
}
export async function syncRecentProjectsToSystemRecentDocuments({
  app: _0x5e6f0d,
  recentStorePath: _0x363cf4,
  listRecentProjectsImpl = listRecentProjects,
  platform = process['platform']
} = {}) {
  const _0x28eb0f = await listRecentProjectsImpl(_0x363cf4);
  return syncSystemRecentDocuments({
    'app': _0x5e6f0d,
    'items': _0x28eb0f,
    'platform': platform
  });
}