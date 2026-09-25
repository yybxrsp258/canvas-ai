import a275_0x91277f from 'node:path';
import { mkdirSync, promises as a275_0xae0831 } from 'node:fs';
import * as a275_0x257ecc from '../src/services/desktopProjectFileStore.js';
import { createDiagnosticOperation } from '../src/utils/diagnosticOperationRecorder.js';
function normalizeProjectPayload(_0x3a3293) {
  return _0x3a3293 || {};
}
function normalizeOperationContext(_0xca3fe8) {
  return _0xca3fe8 || {};
}
function formatOperationError(_0x58e0ef) {
  return String(_0x58e0ef?.['message'] || _0x58e0ef);
}
function normalizePositiveTimestamp(_0x2d75c5) {
  const _0x29caaa = Number(_0x2d75c5);
  return Number["isFinite"](_0x29caaa) && _0x29caaa > 0x0 ? Math["round"](_0x29caaa) : 0x0;
}
export function buildProjectOpenResponse(_0x503e14, _0x3ef546, _0x2f9f3c, {
  stripProjectFileExtension = a275_0x257ecc['stripProjectFileExtension']
} = {}) {
  const _0x1d827e = _0x2f9f3c?.["filename"] || a275_0x91277f['basename'](_0x503e14);
  const _0xee276b = _0x2f9f3c?.['name'] || stripProjectFileExtension(_0x1d827e);
  return {
    'success': !![],
    'canceled': ![],
    'projectId': stripProjectFileExtension(_0x1d827e),
    'projectName': _0xee276b,
    'filename': _0x1d827e,
    'recentId': _0x2f9f3c?.['recentId'] || '',
    'displayPath': _0x2f9f3c?.["displayPath"] || _0x503e14,
    'lastModified': Number(_0x2f9f3c?.["lastModified"] || 0x0) || 0x0,
    'data': _0x3ef546
  };
}
export function createProjectCapabilityOperations({
  exportDesktopProjectPackage: _0x5bed62,
  importDesktopProjectPackage: _0x396b57,
  handleRendererUnsavedState: _0xe05a23,
  getRecentProjectsStorePath: _0x50d8c4,
  syncSystemRecentDocumentsBestEffort: _0x3397fc,
  pendingExternalProjectOpenRequests: _0x3e3c89,
  getCanvasProjectDir: _0x42d3fa,
  showOpenDialog: _0xab3fa6,
  showSaveDialog: _0x4ba568,
  projectFileStore = a275_0x257ecc,
  supportedProjectFileExtensions = a275_0x257ecc["SUPPORTED_PROJECT_FILE_EXTENSIONS"],
  getRecoverySnapshotPath: _0x820ff3,
  writeRecoverySnapshotFile: _0x13c46d,
  getRecoverySnapshotFileInfo: _0x598f39,
  readRecoverySnapshotFile: _0x345bf2,
  removeRecoverySnapshotFile: _0x592c97,
  statPath = _0x3c7f9c => a275_0xae0831['stat'](_0x3c7f9c),
  logDiagnosticEvent: _0x351b63
} = {}) {
  function _0x36a938() {
    return [{
      'name': 'SHUO\x20Canvas\x20Project',
      'extensions': supportedProjectFileExtensions["map"](_0x38b3df => String(_0x38b3df || '')["replace"](/^\./, ''))
    }];
  }
  function _0x325239(_0x17fefe, {
    source = 'dialog'
  } = {}) {
    const _0x94c07f = a275_0x91277f["resolve"](String(_0x17fefe || ''));
    const _0x1b7335 = projectFileStore["readProjectJson"](_0x94c07f);
    const _0x102e95 = projectFileStore['upsertRecentProject'](_0x50d8c4(), _0x94c07f, {
      'name': projectFileStore["stripProjectFileExtension"](a275_0x91277f["basename"](_0x94c07f))
    });
    _0x3397fc();
    return {
      ...buildProjectOpenResponse(_0x94c07f, _0x1b7335, _0x102e95, {
        'stripProjectFileExtension': projectFileStore['stripProjectFileExtension']
      }),
      'source': source
    };
  }
  async function _0x331dfb(_0x3b3ea2) {
    const _0x31cae5 = String(_0x3b3ea2 || '')['trim']();
    if (!_0x31cae5 || !a275_0x91277f['isAbsolute'](_0x31cae5)) {
      return 0x0;
    }
    try {
      const _0x26ec89 = await statPath(_0x31cae5);
      return _0x26ec89["isFile"]() ? Math["round"](_0x26ec89['mtimeMs']) : 0x0;
    } catch {
      return 0x0;
    }
  }
  async function _0x124523(_0xf0118b = {}, _0x1ddea8 = {}) {
    const _0x58f701 = [normalizePositiveTimestamp(_0xf0118b?.["lastKnownProjectLastModified"] ?? _0xf0118b?.["lastModified"])];
    const _0x2f7080 = String(_0xf0118b?.["recentId"] || _0x1ddea8?.["recentId"] || '')["trim"]();
    let _0x27942a = '';
    if (_0x2f7080) {
      const _0x34f834 = await projectFileStore['findRecentProject'](_0x50d8c4(), _0x2f7080);
      _0x58f701['push'](normalizePositiveTimestamp(_0x34f834?.["lastModified"]));
      _0x27942a = _0x34f834?.["path"] || '';
    }
    const _0x103517 = [...new Set([_0xf0118b?.["displayPath"], _0x1ddea8?.["displayPath"]]["filter"](_0x3145c2 => _0x3145c2 && _0x3145c2 !== _0x27942a))];
    _0x58f701["push"](...(await Promise["all"](_0x103517['map'](_0x331dfb))));
    return Math["max"](0x0, ..._0x58f701);
  }
  const _0xd27c06 = {
    async 'open'(_0x107a6a) {
      const _0x44e31a = normalizeProjectPayload(_0x107a6a);
      const _0x6c96c0 = _0x50d8c4();
      const _0x450ca3 = String(_0x44e31a?.["recentId"] || '')['trim']();
      let _0x1a92b = '';
      if (_0x450ca3) {
        const _0x50a8d5 = await projectFileStore["findRecentProject"](_0x6c96c0, _0x450ca3);
        if (!_0x50a8d5) {
          throw new Error("最近项目不存在");
        }
        if (!_0x50a8d5["exists"]) {
          throw new Error("最近项目文件不存在");
        }
        _0x1a92b = _0x50a8d5["path"];
      } else {
        mkdirSync(_0x42d3fa(), {
          'recursive': !![]
        });
        const _0x34d679 = await _0xab3fa6({
          'title': "打开项目",
          'defaultPath': _0x42d3fa(),
          'properties': ["openFile"],
          'filters': _0x36a938()
        });
        if (_0x34d679["canceled"] || !_0x34d679["filePaths"]?.[0x0]) {
          return {
            'success': ![],
            'canceled': !![]
          };
        }
        _0x1a92b = _0x34d679["filePaths"][0x0];
      }
      return _0x325239(_0x1a92b, {
        'source': _0x450ca3 ? "recent" : "dialog"
      });
    },
    async 'save'(_0x225993) {
      const _0x3093ff = normalizeProjectPayload(_0x225993);
      const _0x206d49 = _0x50d8c4();
      const _0x429f75 = String(_0x3093ff?.["mode"] || "save")["trim"]() === 'saveAs' ? "saveAs" : "save";
      const _0x2494d1 = projectFileStore["sanitizeProjectName"](_0x3093ff?.["projectName"] || _0x3093ff?.["projectId"] || "未命名画布");
      let _0x3c92b4 = '';
      if (_0x429f75 === "save") {
        const _0x1a4923 = String(_0x3093ff?.["recentId"] || '')['trim']();
        const _0x55342d = _0x1a4923 ? await projectFileStore["findRecentProject"](_0x206d49, _0x1a4923) : null;
        _0x3c92b4 = _0x55342d?.["path"] || projectFileStore["buildDefaultProjectPath"](_0x42d3fa(), _0x2494d1);
      } else {
        mkdirSync(_0x42d3fa(), {
          'recursive': !![]
        });
        const _0x2dbbd8 = await _0x4ba568({
          'title': '另存为项目',
          'defaultPath': projectFileStore["buildDefaultProjectPath"](_0x42d3fa(), _0x2494d1),
          'filters': _0x36a938()
        });
        if (_0x2dbbd8["canceled"] || !_0x2dbbd8['filePath']) {
          return {
            'success': ![],
            'canceled': !![]
          };
        }
        _0x3c92b4 = projectFileStore["withJsonProjectExtension"](_0x2dbbd8["filePath"]);
      }
      projectFileStore["writeProjectJson"](_0x3c92b4, _0x3093ff?.['multiData'] || {}, {
        'allowEmptyOverwrite': _0x3093ff?.['allowEmptyOverwrite'] === !![]
      });
      const _0x922791 = projectFileStore["upsertRecentProject"](_0x206d49, _0x3c92b4, {
        'name': _0x2494d1
      });
      _0x3397fc();
      return {
        'success': !![],
        'canceled': ![],
        'projectId': projectFileStore["stripProjectFileExtension"](_0x922791["filename"] || ''),
        'projectName': _0x922791["name"],
        'filename': _0x922791["filename"],
        'recentId': _0x922791["recentId"],
        'displayPath': _0x922791["displayPath"],
        'lastModified': _0x922791["lastModified"]
      };
    },
    'openPath'(_0x361005, _0x17d6ff) {
      return _0x325239(_0x361005, _0x17d6ff);
    },
    'exportPackage'(_0x1b5bce, _0x104513) {
      return _0x5bed62(normalizeProjectPayload(_0x1b5bce), normalizeOperationContext(_0x104513));
    },
    'importPackage'(_0x294e2d, _0x3b95b7) {
      return _0x396b57(normalizeProjectPayload(_0x294e2d), normalizeOperationContext(_0x3b95b7));
    },
    'setUnsavedState'(_0x433d28) {
      return _0xe05a23(normalizeProjectPayload(_0x433d28));
    },
    'listRecent'() {
      return projectFileStore["listRecentProjects"](_0x50d8c4());
    },
    async 'removeRecent'(_0xe905ba) {
      const _0x31d6e8 = normalizeProjectPayload(_0xe905ba)['recentId'] || '';
      const _0x80ac73 = await projectFileStore['removeRecentProject'](_0x50d8c4(), _0x31d6e8);
      _0x3397fc();
      return _0x80ac73;
    },
    'consumeExternalOpenRequests'() {
      return _0x3e3c89['splice'](0x0, _0x3e3c89['length']);
    },
    'writeRecoverySnapshot'(_0x5d2b99) {
      try {
        const _0x58226a = _0x13c46d(_0x820ff3(), normalizeProjectPayload(_0x5d2b99));
        return {
          'success': !![],
          'savedAt': _0x58226a["savedAt"],
          'projectId': _0x58226a["projectId"],
          'projectName': _0x58226a["projectName"]
        };
      } catch (_0x2e0ff8) {
        return {
          'success': ![],
          'error': formatOperationError(_0x2e0ff8)
        };
      }
    },
    async 'getRecoverySnapshotInfo'(_0xa2c5e2) {
      try {
        const _0x399b8e = _0x820ff3();
        const _0xc3960f = await _0x345bf2(_0x399b8e);
        const _0x5b77ac = _0xc3960f ? await _0x124523(normalizeProjectPayload(_0xa2c5e2), _0xc3960f || {}) : normalizePositiveTimestamp(_0xa2c5e2?.["lastKnownProjectLastModified"] ?? _0xa2c5e2?.["lastModified"]);
        return await _0x598f39(_0x399b8e, {
          'currentLastModified': _0x5b77ac,
          'snapshot': _0xc3960f
        });
      } catch (_0x15ec88) {
        return {
          'exists': ![],
          'isNewerThanProject': ![],
          'savedAt': 0x0,
          'currentLastModified': 0x0,
          'error': formatOperationError(_0x15ec88)
        };
      }
    },
    async 'readRecoverySnapshot'() {
      try {
        const _0x57af48 = await _0x345bf2(_0x820ff3());
        if (!_0x57af48) {
          return {
            'success': ![],
            'exists': ![],
            'canceled': ![]
          };
        }
        return {
          'success': !![],
          'exists': !![],
          'canceled': ![],
          'recovery': !![],
          'projectId': _0x57af48["projectId"],
          'projectName': _0x57af48['projectName'],
          'filename': _0x57af48["filename"],
          'recentId': _0x57af48["recentId"],
          'displayPath': _0x57af48["displayPath"],
          'lastModified': _0x57af48["lastKnownProjectLastModified"],
          'recoverySavedAt': _0x57af48['savedAt'],
          'data': _0x57af48["data"]
        };
      } catch (_0x44122d) {
        return {
          'success': ![],
          'exists': ![],
          'error': formatOperationError(_0x44122d)
        };
      }
    },
    'clearRecoverySnapshot'() {
      try {
        _0x592c97(_0x820ff3());
        return {
          'success': !![]
        };
      } catch (_0x1f2b31) {
        return {
          'success': ![],
          'error': formatOperationError(_0x1f2b31)
        };
      }
    }
  };
  const _0xd0952e = _0x13d535 => _0x15898f => createDiagnosticOperation({
    'type': "project.desktop_" + _0x13d535,
    'source': "main",
    'logEvent': _0x351b63,
    'context': {
      'mode': _0x15898f?.["mode"] === "saveAs" ? "saveAs" : _0x13d535,
      'canvasCount': Array["isArray"](_0x15898f?.['multiData']?.["canvases"]) ? _0x15898f["multiData"]["canvases"]["length"] : 0x0
    }
  })["run"](() => _0xd27c06[_0x13d535](_0x15898f));
  return Object["freeze"]({
    ..._0xd27c06,
    'open': _0xd0952e("open"),
    'save': _0xd0952e("save")
  });
}