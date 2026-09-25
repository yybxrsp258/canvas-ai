import a276_0x1cb082 from 'node:path';
import { PROJECT_PACKAGE_FILE_EXTENSION, PROJECT_PACKAGE_TYPE_CANVAS, exportProjectPackageToPath, importProjectPackageFromPath, withProjectPackageExtension } from './projectPackageService.js';
import { sanitizeProjectName } from '../src/services/desktopProjectFileStore.js';
function trimText(_0x57aa09) {
  return String(_0x57aa09 || '')["trim"]();
}
function getProjectPackageDialogFilters() {
  return [{
    'name': "SHUO Canvas Project Package",
    'extensions': [PROJECT_PACKAGE_FILE_EXTENSION["replace"](/^\./, '')]
  }];
}
function resolveProjectPackageImportPath(_0x4fbbce = {}) {
  const _0x1aed5f = trimText(_0x4fbbce?.["path"]);
  if (!_0x1aed5f) {
    return '';
  }
  if (!a276_0x1cb082["isAbsolute"](_0x1aed5f)) {
    throw new Error("项目包路径必须是绝对路径");
  }
  if (a276_0x1cb082["extname"](_0x1aed5f)['toLowerCase']() !== PROJECT_PACKAGE_FILE_EXTENSION) {
    throw new Error("只支持 .aicpkg 项目包");
  }
  return a276_0x1cb082['resolve'](_0x1aed5f);
}
function toProjectPackageBlockedResult(_0x29410b) {
  const _0x46583e = String(_0x29410b?.["code"] || '');
  if (_0x46583e === "MISSING_LOCAL_ASSETS") {
    const _0x49c6f4 = Array["isArray"](_0x29410b?.["missing"]) ? _0x29410b['missing']["filter"](Boolean) : [];
    return {
      'success': ![],
      'canceled': ![],
      'blocked': !![],
      'code': _0x46583e,
      'message': "收集失败：当前项目引用的本地素材文件不存在",
      'missing': _0x49c6f4
    };
  }
  if (_0x46583e === "REMOTE_MEDIA_NOT_LOCALIZED") {
    const _0x52774f = Array["isArray"](_0x29410b?.["remoteMedia"]) ? _0x29410b["remoteMedia"]["filter"](Boolean) : [];
    return {
      'success': ![],
      'canceled': ![],
      'blocked': !![],
      'code': _0x46583e,
      'message': "收集失败：当前项目还有未本地化的远程素材",
      'remoteMedia': _0x52774f
    };
  }
  return null;
}
function normalizeProgressPayload(_0x4e68ab = {}) {
  const _0x3e87b1 = Number(_0x4e68ab?.["progress"]);
  const _0x55c11f = Number(_0x4e68ab?.["current"]);
  const _0x4725ac = Number(_0x4e68ab?.["total"]);
  return {
    'phase': trimText(_0x4e68ab?.["phase"]) || "working",
    'message': trimText(_0x4e68ab?.["message"]),
    'progress': Number["isFinite"](_0x3e87b1) ? Math["max"](0x0, Math["min"](0x1, _0x3e87b1)) : null,
    'current': Number["isFinite"](_0x55c11f) ? _0x55c11f : null,
    'total': Number["isFinite"](_0x4725ac) ? _0x4725ac : null
  };
}
function emitPackageProgress(_0x1c21ab, _0x261d22, _0x2ed79d = {}, _0x5ef5c9 = null) {
  const _0x52f830 = trimText(_0x261d22);
  if (!_0x52f830) {
    return;
  }
  const _0x498554 = {
    'operationId': _0x52f830,
    ...normalizeProgressPayload(_0x2ed79d)
  };
  _0x1c21ab && typeof _0x1c21ab["send"] === "function" && _0x1c21ab["send"]("project:packageProgress", _0x498554);
  if (typeof _0x5ef5c9 === "function") {
    _0x5ef5c9(_0x498554);
  }
}
function showSaveDialog(_0x10751a, _0xda464a, _0x26b899) {
  return _0xda464a ? _0x10751a["showSaveDialog"](_0xda464a, _0x26b899) : _0x10751a["showSaveDialog"](_0x26b899);
}
function showOpenDialog(_0xe3ed23, _0x5f58c1, _0x2c3198) {
  return _0x5f58c1 ? _0xe3ed23["showOpenDialog"](_0x5f58c1, _0x2c3198) : _0xe3ed23["showOpenDialog"](_0x2c3198);
}
export function createProjectPackageController({
  app: _0x44eb7a,
  dialog: _0x3e0d9e,
  getMainWindow = () => null,
  getCanvasProjectDir: _0x547723,
  getOutputDir: _0x59a1e1,
  getUploadsDir: _0x4c4998,
  getAssetsDir: _0x40abdd,
  getWorkflowsDir: _0x3fb579,
  readAppVersion: _0x4eed59,
  upsertRecentProject: _0x2fa0cf,
  getRecentProjectsStorePath: _0x2cc8d4,
  syncSystemRecentDocumentsBestEffort: _0x41b9f0,
  buildProjectOpenResponse: _0x54aa6b,
  showSaveDialog: _0x54e13b,
  showOpenDialog: _0x22f402
} = {}) {
  const _0x579e9f = () => ({
    'canvasRoot': _0x547723(),
    'outputRoot': _0x59a1e1(),
    'uploadsRoot': _0x4c4998(),
    'assetsRoot': _0x40abdd(),
    'workflowsRoot': _0x3fb579(),
    'workflowThumbsRoot': a276_0x1cb082["join"](_0x3fb579(), "thumbs")
  });
  const _0x18c53e = _0x3d6a6c => {
    const _0x3c032f = sanitizeProjectName(_0x3d6a6c || "未命名画布");
    let _0x389dc3 = '';
    try {
      _0x389dc3 = _0x44eb7a["getPath"]("downloads");
    } catch {}
    return a276_0x1cb082["join"](_0x389dc3 || _0x547723(), '' + _0x3c032f + PROJECT_PACKAGE_FILE_EXTENSION);
  };
  const _0x4e14d1 = async (_0xd81b50 = {}, _0x5a6c92 = {}) => {
    const _0x479e3a = sanitizeProjectName(_0xd81b50?.["projectName"] || _0xd81b50?.['projectId'] || "未命名画布");
    const _0x2e192d = trimText(_0xd81b50?.["operationId"]);
    const _0x5ab899 = _0x5a6c92?.["sender"] || null;
    const _0x4d9ccd = typeof _0x54e13b === "function" ? _0x54e13b : _0x1c5e53 => showSaveDialog(_0x3e0d9e, getMainWindow(), _0x1c5e53);
    const _0x6c83c = await _0x4d9ccd({
      'title': "收集当前项目",
      'defaultPath': _0x18c53e(_0x479e3a),
      'filters': getProjectPackageDialogFilters()
    });
    if (_0x6c83c["canceled"] || !_0x6c83c["filePath"]) {
      return {
        'success': ![],
        'canceled': !![]
      };
    }
    try {
      return await exportProjectPackageToPath({
        'outputPath': withProjectPackageExtension(_0x6c83c["filePath"]),
        'multiData': _0xd81b50?.["multiData"] || {},
        'projectData': _0xd81b50?.['projectData'],
        'projectType': _0xd81b50?.["projectType"] || PROJECT_PACKAGE_TYPE_CANVAS,
        'projectId': _0xd81b50?.['projectId'] || '',
        'projectName': _0x479e3a,
        'appVersion': _0x4eed59(),
        'roots': _0x579e9f(),
        'onProgress': _0xd0509c => emitPackageProgress(_0x5ab899, _0x2e192d, _0xd0509c, _0x5a6c92?.["onProgress"])
      });
    } catch (_0x337924) {
      const _0x17fd19 = toProjectPackageBlockedResult(_0x337924);
      if (_0x17fd19) {
        return _0x17fd19;
      }
      throw _0x337924;
    }
  };
  const _0x5e8df3 = async (_0x4928bf = {}, _0x11a5ee = {}) => {
    const _0xaf47c4 = trimText(_0x4928bf?.["operationId"]);
    const _0x24eb5f = _0x11a5ee?.["sender"] || null;
    let _0x5256b4 = resolveProjectPackageImportPath(_0x4928bf);
    if (!_0x5256b4) {
      const _0x52b750 = typeof _0x22f402 === "function" ? _0x22f402 : _0x3f0ac0 => showOpenDialog(_0x3e0d9e, getMainWindow(), _0x3f0ac0);
      const _0x16f534 = await _0x52b750({
        'title': '加载项目包',
        'defaultPath': _0x547723(),
        'properties': ["openFile"],
        'filters': getProjectPackageDialogFilters()
      });
      if (_0x16f534["canceled"] || !_0x16f534['filePaths']?.[0x0]) {
        return {
          'success': ![],
          'canceled': !![]
        };
      }
      _0x5256b4 = _0x16f534['filePaths'][0x0];
    }
    emitPackageProgress(_0x24eb5f, _0xaf47c4, {
      'phase': "importing",
      'message': "正在读取项目包..."
    }, _0x11a5ee?.["onProgress"]);
    const _0x2cf630 = await importProjectPackageFromPath({
      'packagePath': _0x5256b4,
      'roots': _0x579e9f(),
      'projectRoot': _0x547723(),
      'tempRoot': _0x44eb7a['getPath']("temp"),
      'onProgress': _0x1bd5c5 => emitPackageProgress(_0x24eb5f, _0xaf47c4, _0x1bd5c5, _0x11a5ee?.["onProgress"])
    });
    if (_0x2cf630["projectType"] !== PROJECT_PACKAGE_TYPE_CANVAS) {
      return {
        ..._0x2cf630,
        'source': _0x4928bf?.['path'] ? "package-drop" : "package-dialog",
        'imported': !![],
        'packagePath': _0x5256b4
      };
    }
    const _0x85060c = _0x2fa0cf(_0x2cc8d4(), _0x2cf630["projectPath"], {
      'name': _0x2cf630["projectName"]
    });
    _0x41b9f0();
    return {
      ..._0x54aa6b(_0x2cf630['projectPath'], _0x2cf630["data"], _0x85060c),
      'source': _0x4928bf?.['path'] ? 'package-drop' : 'package-dialog',
      'imported': !![],
      'packagePath': _0x5256b4,
      'assetsCount': _0x2cf630["assetsCount"]
    };
  };
  return {
    'exportDesktopProjectPackage': _0x4e14d1,
    'importDesktopProjectPackage': _0x5e8df3
  };
}