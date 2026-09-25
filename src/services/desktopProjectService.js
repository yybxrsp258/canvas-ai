import { loadProject, resolveCanvasData, saveProject } from './projectService.js';
import { desktopBridge } from './desktopBridge.js';
import { assertCanvasProjectSaveAllowed } from './canvasProjectAccess.js';
import { sanitizeMultiCanvasDataForPersistence } from '../utils/thumbnailPersistence.js';
import { discardStagedProjectPackage, stageProjectPackageFile } from '../../api/projectPackageApi.js';
function getDesktopProjectApi() {
  if (!desktopBridge['project']["api"] && !desktopBridge["isChromeShell"]) {
    return null;
  }
  return desktopBridge["project"];
}
async function clearRecoverySnapshotAfterSave(_0x512a20) {
  if (!_0x512a20 || typeof _0x512a20['clearRecoverySnapshot'] !== "function") {
    return;
  }
  try {
    await _0x512a20["clearRecoverySnapshot"]();
  } catch (_0x5701dc) {
    console['warn']("[desktopProjectService] 清理恢复快照失败:", _0x5701dc);
  }
}
function isAutoDefaultRecentProject(_0x3bf018) {
  const _0xf90ce9 = String(_0x3bf018?.["filename"] || '')["trim"]()["toLowerCase"]();
  const _0x3119e6 = String(_0x3bf018?.["name"] || '')["trim"]();
  const _0x3f6cec = String(_0x3bf018?.["displayPath"] || _0x3bf018?.["path"] || '');
  return /\.(?:aicanvas|aicproj|json)$/i["test"](_0xf90ce9) && _0xf90ce9["replace"](/\.(?:aicanvas|aicproj|json)$/i, '') === "默认画布" && _0x3119e6 === "默认画布" && /(^|[\\/])user[\\/]Canvas Project[\\/]/i['test'](_0x3f6cec);
}
export function canUseDesktopProjectApi() {
  const _0x4a935f = getDesktopProjectApi();
  return !!(_0x4a935f && typeof _0x4a935f["open"] === 'function' && typeof _0x4a935f["save"] === "function" && typeof _0x4a935f["listRecent"] === "function" && typeof _0x4a935f["removeRecent"] === "function");
}
export function normalizeDesktopProjectOpenResult(_0x109e43) {
  if (!_0x109e43 || _0x109e43["canceled"]) {
    return _0x109e43 || {
      'canceled': !![]
    };
  }
  return {
    ..._0x109e43,
    'multiData': resolveCanvasData(_0x109e43["data"] || {})
  };
}
export async function openDesktopProject(_0x5bae31 = {}) {
  const _0x9dabd3 = getDesktopProjectApi();
  if (!_0x9dabd3 || typeof _0x9dabd3['open'] !== "function") {
    throw new Error("Electron project API is unavailable");
  }
  const _0x371036 = await _0x9dabd3["open"]({
    'recentId': _0x5bae31["recentId"] || ''
  });
  return normalizeDesktopProjectOpenResult(_0x371036);
}
export async function saveDesktopProject(_0x4cc71f, _0x2dc00c, _0x137e13 = {}) {
  assertCanvasProjectSaveAllowed(_0x2dc00c);
  const _0x20b950 = sanitizeMultiCanvasDataForPersistence(_0x2dc00c || {});
  const _0x539267 = getDesktopProjectApi();
  if (_0x539267 && typeof _0x539267["save"] === 'function') {
    const _0x543b63 = await _0x539267["save"]({
      'projectName': _0x4cc71f,
      'projectId': _0x137e13["projectId"] || globalThis["window"]?.["currentProjectId"] || '',
      'recentId': _0x137e13["recentId"] || globalThis["window"]?.["_v2CurrentRecentProjectId"] || '',
      'mode': _0x137e13["mode"] || "save",
      'multiData': _0x20b950
    });
    _0x543b63?.["success"] && (await clearRecoverySnapshotAfterSave(_0x539267));
    return _0x543b63;
  }
  return await saveProject(_0x4cc71f, _0x20b950);
}
export async function exportDesktopProjectPackage(_0x151f6c, _0x13e1d2, _0x247247 = {}) {
  assertCanvasProjectSaveAllowed(_0x13e1d2);
  const _0x4c1248 = sanitizeMultiCanvasDataForPersistence(_0x13e1d2 || {});
  const _0x2dda3f = getDesktopProjectApi();
  if (!_0x2dda3f || typeof _0x2dda3f["exportPackage"] !== "function") {
    throw new Error("Electron project package export API is unavailable");
  }
  return await _0x2dda3f['exportPackage']({
    'projectName': _0x151f6c,
    'projectId': _0x247247["projectId"] || globalThis['window']?.['currentProjectId'] || '',
    'recentId': _0x247247["recentId"] || globalThis["window"]?.["_v2CurrentRecentProjectId"] || '',
    'displayPath': _0x247247["displayPath"] || globalThis['window']?.["_v2CurrentProjectDisplayPath"] || '',
    'operationId': _0x247247["operationId"] || '',
    'multiData': _0x4c1248
  });
}
export async function exportDesktopWorkspaceProjectPackage({
  projectType: _0x1ea9c8,
  projectId = '',
  projectName = '',
  projectData: _0xc59d78,
  operationId = ''
} = {}) {
  const _0x24d844 = getDesktopProjectApi();
  if (!_0x24d844 || typeof _0x24d844["exportPackage"] !== "function") {
    throw new Error("Electron project package export API is unavailable");
  }
  return await _0x24d844["exportPackage"]({
    'projectType': _0x1ea9c8,
    'projectId': projectId,
    'projectName': projectName,
    'projectData': _0xc59d78,
    'operationId': operationId
  });
}
export async function importDesktopWorkspaceProjectPackage(_0x1be661 = {}) {
  const _0x41e391 = getDesktopProjectApi();
  if (!_0x41e391 || typeof _0x41e391["importPackage"] !== "function") {
    throw new Error("Electron project package import API is unavailable");
  }
  let _0x40470d = null;
  try {
    let _0x5cafe1 = String(_0x1be661["path"] || '')['trim']();
    !_0x5cafe1 && _0x1be661['file'] && (_0x40470d = await stageProjectPackageFile(_0x1be661['file'], {
      'signal': _0x1be661['signal']
    }), _0x5cafe1 = _0x40470d['path']);
    const _0x45f061 = await _0x41e391["importPackage"]({
      'path': _0x5cafe1,
      'operationId': _0x1be661['operationId'] || ''
    });
    return _0x45f061;
  } finally {
    if (_0x40470d?.['stageId']) {
      try {
        await discardStagedProjectPackage(_0x40470d["stageId"]);
      } catch (_0x5bc729) {
        console['warn']("[desktopProjectService] 清理暂存项目包失败:", _0x5bc729);
      }
    }
  }
}
export async function importDesktopProjectPackage(_0x27dd7b = {}) {
  const _0x5b1d9e = await importDesktopWorkspaceProjectPackage(_0x27dd7b);
  if (_0x5b1d9e?.["projectType"] && _0x5b1d9e['projectType'] !== "canvas") {
    return _0x5b1d9e;
  }
  return normalizeDesktopProjectOpenResult(_0x5b1d9e);
}
export async function listDesktopRecentProjects() {
  const _0x3ccda8 = getDesktopProjectApi();
  if (!_0x3ccda8 || typeof _0x3ccda8["listRecent"] !== 'function') {
    return [];
  }
  const _0x1f0727 = await _0x3ccda8["listRecent"]();
  return Array["isArray"](_0x1f0727) ? _0x1f0727["filter"](_0x34f332 => !isAutoDefaultRecentProject(_0x34f332)) : [];
}
export async function removeDesktopRecentProject(_0x21bbd6) {
  const _0x44928f = getDesktopProjectApi();
  if (!_0x44928f || typeof _0x44928f["removeRecent"] !== 'function') {
    return [];
  }
  const _0x40b5c6 = await _0x44928f["removeRecent"]({
    'recentId': _0x21bbd6
  });
  return Array["isArray"](_0x40b5c6) ? _0x40b5c6 : [];
}
export async function loadProjectWithFallback(_0x128abf) {
  return await loadProject(_0x128abf);
}