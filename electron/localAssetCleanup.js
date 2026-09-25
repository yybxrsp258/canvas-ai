import { existsSync, readdirSync, readFileSync, statSync, realpathSync } from 'node:fs';
import a250_0x5861a5 from 'node:path';
import { fileURLToPath } from 'node:url';
const PROJECT_EXTENSIONS = new Set([".aicanvas", '.aicproj', ".json"]);
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", '.bmp', ".avif", ".svg"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov", '.m4v', ".avi", ".mkv"]);
const AUDIO_EXTENSIONS = new Set(['.mp3', ".wav", ".m4a", ".aac", ".ogg", ".flac", ".opus", ".webm"]);
const MEDIA_EXTENSIONS = new Set([...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS, ...AUDIO_EXTENSIONS]);
const CLEANABLE_PREFIXES = Object['freeze'](["output/", "data/uploads/", "data/assets/", "data/workflows/thumbs/"]);
const ROOT_DEFINITIONS = Object['freeze']([{
  'key': "output",
  'rootKey': "outputRoot",
  'virtualPrefix': "output/"
}, {
  'key': "uploads",
  'rootKey': "uploadsRoot",
  'virtualPrefix': "data/uploads/"
}, {
  'key': 'assets',
  'rootKey': "assetsRoot",
  'virtualPrefix': "data/assets/"
}, {
  'key': "workflowThumbs",
  'rootKey': "workflowThumbsRoot",
  'virtualPrefix': 'data/workflows/thumbs/'
}]);
function isPlainObject(_0x5e61f6) {
  return !!_0x5e61f6 && typeof _0x5e61f6 === "object" && !Array["isArray"](_0x5e61f6);
}
function trimText(_0x3a7e38) {
  return String(_0x3a7e38 || '')['trim']();
}
function decodePathPart(_0x2b164d) {
  try {
    return decodeURIComponent(_0x2b164d);
  } catch {
    return _0x2b164d;
  }
}
function splitCompositeVirtualPathValue(_0x525fcb) {
  const _0x4d5ba4 = trimText(_0x525fcb);
  if (!_0x4d5ba4) {
    return [];
  }
  return _0x4d5ba4["split"]('|')['map'](_0x25b3d1 => _0x25b3d1["trim"]())["filter"](Boolean);
}
function normalizeComparablePath(_0xa238a1, _0x32f450 = process['platform']) {
  const _0x3c264f = a250_0x5861a5["resolve"](String(_0xa238a1 || ''));
  return _0x32f450 === "win32" || _0x32f450 === "darwin" ? _0x3c264f["toLowerCase"]() : _0x3c264f;
}
export function isPathInside(_0x1295c1, _0x240957, _0x5a8d4f = process["platform"]) {
  try {
    const _0x30d38f = normalizeComparablePath(_0x1295c1, _0x5a8d4f);
    const _0x29dc90 = normalizeComparablePath(_0x240957, _0x5a8d4f);
    return _0x30d38f === _0x29dc90 || _0x30d38f["startsWith"](_0x29dc90["endsWith"](a250_0x5861a5["sep"]) ? _0x29dc90 : '' + _0x29dc90 + a250_0x5861a5['sep']);
  } catch {
    return ![];
  }
}
export function normalizeVirtualLocalPath(_0x471cbb) {
  let _0x597ef9 = trimText(_0x471cbb);
  if (!_0x597ef9) {
    return '';
  }
  if (_0x597ef9["includes"]('|')) {
    return '';
  }
  if (/^(?:file|javascript|data|blob):/i["test"](_0x597ef9)) {
    return '';
  }
  if (/^https?:\/\//i["test"](_0x597ef9)) {
    try {
      _0x597ef9 = new URL(_0x597ef9)["pathname"] || '';
    } catch {
      return '';
    }
  } else {
    if (/^[a-z][a-z0-9+.-]*:/i["test"](_0x597ef9) && !_0x597ef9['startsWith']('/')) {
      return '';
    }
  }
  const _0x39d11a = _0x597ef9["split"](/[?#]/, 0x1)[0x0];
  const _0x9db39f = decodePathPart(_0x39d11a)["replace"](/\\/g, '/')["replace"](/^\/+/, '');
  if (_0x9db39f["includes"]('|')) {
    return '';
  }
  if (/^[a-zA-Z]:\//["test"](_0x9db39f) || _0x9db39f["startsWith"]('//')) {
    return '';
  }
  if (_0x9db39f["split"]('/')["some"](_0x36b7ca => _0x36b7ca === '..')) {
    return '';
  }
  const _0x51601e = a250_0x5861a5['posix']["normalize"](_0x9db39f);
  if (!_0x51601e || _0x51601e === '.' || _0x51601e === '..' || _0x51601e["startsWith"]("../")) {
    return '';
  }
  const _0xad0ef3 = process["platform"] === "win32" || process['platform'] === "darwin" ? _0x51601e['toLowerCase']() : _0x51601e;
  return CLEANABLE_PREFIXES["some"](_0x45bd78 => _0xad0ef3["startsWith"](_0x45bd78)) ? _0x51601e : '';
}
export function collectVirtualLocalPathsFromString(_0x42cfd4) {
  const _0x2cc15a = [];
  const _0x50e300 = new Set();
  for (const _0x504cc8 of splitCompositeVirtualPathValue(_0x42cfd4)) {
    const _0x2859fd = normalizeVirtualLocalPath(_0x504cc8);
    if (!_0x2859fd || _0x50e300["has"](_0x2859fd)) {
      continue;
    }
    _0x50e300['add'](_0x2859fd);
    _0x2cc15a["push"](_0x2859fd);
  }
  return _0x2cc15a;
}
function referenceKey(_0x4710a9) {
  try {
    return normalizeComparablePath(realpathSync(_0x4710a9));
  } catch {
    return normalizeComparablePath(_0x4710a9);
  }
}
export function collectReferencedLocalPaths(_0xeab233, _0x1944b0 = new Set(), _0x5aa5ae = new Set(), _0x268d0f) {
  if (_0xeab233 == null) {
    return _0x1944b0;
  }
  if (typeof _0xeab233 === "string") {
    for (const _0x535316 of collectVirtualLocalPathsFromString(_0xeab233)) {
      _0x1944b0["add"](_0x535316);
      if (_0x268d0f) {
        const _0x5789c9 = resolveNormalizedVirtualPath(_0x535316, _0x268d0f);
        if (_0x5789c9) {
          _0x1944b0["add"](referenceKey(_0x5789c9));
        }
      }
    }
    if (_0x268d0f) {
      for (const _0x4cd74a of splitCompositeVirtualPathValue(_0xeab233)) {
        try {
          const _0x1e858a = /^file:/i["test"](_0x4cd74a) ? fileURLToPath(_0x4cd74a) : _0x4cd74a;
          if (a250_0x5861a5["isAbsolute"](_0x1e858a)) {
            _0x1944b0["add"](referenceKey(_0x1e858a));
          }
          const _0x17bb81 = resolveNormalizedVirtualPath(_0x4cd74a["replace"](/\\/g, '/')["replace"](/^\/+/, ''), _0x268d0f);
          if (_0x17bb81) {
            _0x1944b0["add"](referenceKey(_0x17bb81));
          }
        } catch {}
      }
    }
    return _0x1944b0;
  }
  if (typeof _0xeab233 !== "object") {
    return _0x1944b0;
  }
  if (_0x5aa5ae["has"](_0xeab233)) {
    return _0x1944b0;
  }
  _0x5aa5ae["add"](_0xeab233);
  if (Array["isArray"](_0xeab233)) {
    for (const _0x12b17c of _0xeab233) {
      collectReferencedLocalPaths(_0x12b17c, _0x1944b0, _0x5aa5ae, _0x268d0f);
    }
    return _0x1944b0;
  }
  for (const _0x3dac25 of Object["values"](_0xeab233)) {
    collectReferencedLocalPaths(_0x3dac25, _0x1944b0, _0x5aa5ae, _0x268d0f);
  }
  return _0x1944b0;
}
function stripUtf8Bom(_0x1ddbca) {
  return String(_0x1ddbca || '')["replace"](/^\uFEFF/, '');
}
function readJsonIfPossible(_0x398e05, _0x531d55, _0x3c62ca) {
  try {
    const _0x300011 = JSON["parse"](stripUtf8Bom(readFileSync(_0x398e05, "utf8")));
    if (!_0x300011 || typeof _0x300011 !== "object") {
      throw new Error("引用数据格式无效");
    }
    return _0x300011;
  } catch (_0x5a1087) {
    _0x531d55?.["push"]({
      'type': 'json-read-failed',
      'source': _0x398e05,
      'category': _0x3c62ca,
      'message': String(_0x5a1087?.["message"] || _0x5a1087)
    });
    return null;
  }
}
function listFilesRecursive(_0x3353e6, _0x34061b, _0x4cf3e7 = {}) {
  const _0x4ac235 = trimText(_0x3353e6);
  if (!_0x4ac235) {
    return [];
  }
  try {
    statSync(_0x4ac235);
  } catch (_0x1509ce) {
    if (_0x1509ce["code"] !== "ENOENT") {
      _0x34061b?.["push"]({
        'type': 'directory-read-failed',
        'source': _0x4ac235,
        'message': _0x1509ce["message"]
      });
    }
    return [];
  }
  const _0x13143c = [];
  const _0x2eeee3 = [a250_0x5861a5["resolve"](_0x4ac235)];
  const _0x542e8b = a250_0x5861a5["resolve"](_0x4ac235);
  while (_0x2eeee3["length"] > 0x0) {
    const _0x5a030e = _0x2eeee3["pop"]();
    let _0x5b492e = [];
    try {
      _0x5b492e = readdirSync(_0x5a030e, {
        'withFileTypes': !![]
      });
    } catch (_0x499ef3) {
      _0x34061b?.["push"]({
        'type': 'directory-read-failed',
        'source': _0x5a030e,
        'message': String(_0x499ef3?.["message"] || _0x499ef3)
      });
      continue;
    }
    for (const _0x823ce6 of _0x5b492e) {
      const _0x19f74f = a250_0x5861a5['join'](_0x5a030e, _0x823ce6["name"]);
      if (!isPathInside(_0x19f74f, _0x542e8b)) {
        continue;
      }
      if (_0x823ce6["isSymbolicLink"]()) {
        _0x34061b?.['push']({
          'type': "symbolic-link-skipped",
          'source': _0x19f74f,
          'message': "未扫描链接，请检查目录后重试"
        });
        continue;
      }
      if (_0x823ce6['isDirectory']()) {
        _0x2eeee3["push"](_0x19f74f);
        continue;
      }
      if (!_0x823ce6['isFile']()) {
        continue;
      }
      if (typeof _0x4cf3e7["filter"] === "function" && !_0x4cf3e7["filter"](_0x19f74f)) {
        continue;
      }
      _0x13143c["push"](_0x19f74f);
    }
  }
  return _0x13143c;
}
function isSupportedProjectFile(_0x4cfd98) {
  return PROJECT_EXTENSIONS['has'](a250_0x5861a5["extname"](String(_0x4cfd98 || ''))["toLowerCase"]());
}
function readRecentProjectPaths(_0x334378, _0x4191c6) {
  if (!optionalReferenceExists(_0x334378, _0x4191c6)) {
    return [];
  }
  const _0xf0f228 = readJsonIfPossible(_0x334378, _0x4191c6, "recent-projects");
  _0xf0f228 && !Array["isArray"](_0xf0f228["items"]) && _0x4191c6["push"]({
    'type': "invalid-recent-projects",
    'source': _0x334378,
    'message': '最近项目列表格式无效'
  });
  const _0x4d4417 = Array["isArray"](_0xf0f228?.['items']) ? _0xf0f228['items'] : [];
  return _0x4d4417['map'](_0x4808d4 => trimText(_0x4808d4?.["path"] || _0x4808d4?.["displayPath"]))["filter"](_0x1b1b2f => _0x1b1b2f && a250_0x5861a5['isAbsolute'](_0x1b1b2f) && isSupportedProjectFile(_0x1b1b2f));
}
function optionalReferenceExists(_0x196d57, _0x44f220) {
  if (!_0x196d57) {
    return ![];
  }
  try {
    statSync(_0x196d57);
    return !![];
  } catch (_0x489ee8) {
    if (_0x489ee8["code"] !== "ENOENT") {
      _0x44f220['push']({
        'type': "reference-read-failed",
        'source': _0x196d57,
        'message': _0x489ee8["message"]
      });
    }
    return ![];
  }
}
function addJsonReferencesFromFiles(_0xdb376f, _0x3b7b14, _0x25ac95, _0x104b6c, _0x45be50) {
  const _0x2679f5 = new Set();
  for (const _0x15d541 of _0xdb376f) {
    const _0x2c37ff = a250_0x5861a5["resolve"](_0x15d541);
    const _0x47bc3c = normalizeComparablePath(_0x2c37ff);
    if (_0x2679f5["has"](_0x47bc3c)) {
      continue;
    }
    _0x2679f5["add"](_0x47bc3c);
    const _0x1f1d0d = readJsonIfPossible(_0x2c37ff, _0x25ac95, _0x104b6c || _0x2c37ff);
    if (_0x1f1d0d != null) {
      collectReferencedLocalPaths(_0x1f1d0d, _0x3b7b14, new Set(), _0x45be50);
    }
  }
}
function listJsonFiles(_0x295e88, _0x47e03f) {
  return listFilesRecursive(_0x295e88, _0x47e03f, {
    'filter': _0x10b8a0 => a250_0x5861a5["extname"](_0x10b8a0)["toLowerCase"]() === ".json"
  });
}
function listProjectFiles(_0x58a9cd, _0x54ed65) {
  return listFilesRecursive(_0x58a9cd, _0x54ed65, {
    'filter': isSupportedProjectFile
  });
}
function getWorkflowThumbRoot(_0x385740) {
  const _0x539b73 = trimText(_0x385740);
  return _0x539b73 ? a250_0x5861a5['join'](_0x539b73, "thumbs") : '';
}
export function buildLocalAssetCleanupRoots({
  fileSavePaths = {},
  defaults = {}
} = {}) {
  const _0x12a84c = isPlainObject(fileSavePaths) ? fileSavePaths : {};
  const _0x619397 = _0x5ac310 => {
    const _0x8eb201 = trimText(_0x5ac310);
    return _0x8eb201 ? a250_0x5861a5["resolve"](_0x8eb201) : '';
  };
  const _0x46c8a3 = _0x619397(trimText(_0x12a84c["dataDir"]) || trimText(defaults["dataDir"]));
  const _0x191a15 = _0x46c8a3 ? a250_0x5861a5['join'](_0x46c8a3, 'uploads') : _0x619397(trimText(_0x12a84c["tempDir"]) || trimText(defaults["uploadsDir"]));
  return {
    'canvasRoot': _0x619397(trimText(_0x12a84c["canvasDir"]) || trimText(defaults["canvasDir"])),
    'outputRoot': _0x619397(trimText(_0x12a84c["outputDir"]) || trimText(defaults["outputDir"])),
    'uploadsRoot': _0x191a15,
    'assetsRoot': _0x46c8a3 ? a250_0x5861a5["join"](_0x46c8a3, "assets") : _0x619397(defaults['assetsDir']),
    'workflowsRoot': _0x46c8a3 ? a250_0x5861a5["join"](_0x46c8a3, 'workflows') : _0x619397(defaults["workflowsDir"]),
    'workflowThumbsRoot': _0x619397(_0x46c8a3 ? a250_0x5861a5["join"](_0x46c8a3, 'workflows', "thumbs") : trimText(defaults["workflowThumbsDir"]) || getWorkflowThumbRoot(defaults["workflowsDir"])),
    'recentProjectsStorePath': _0x619397(defaults['recentProjectsStorePath']),
    'recoverySnapshotPath': _0x619397(defaults['recoverySnapshotPath']),
    'canvasShortcutsPath': _0x619397(defaults["canvasShortcutsPath"])
  };
}
function rootsSignature(_0x6d7806) {
  return [_0x6d7806["canvasRoot"], _0x6d7806['outputRoot'], _0x6d7806["uploadsRoot"], _0x6d7806['assetsRoot'], _0x6d7806["workflowsRoot"], _0x6d7806["workflowThumbsRoot"], _0x6d7806["recentProjectsStorePath"], _0x6d7806["recoverySnapshotPath"], _0x6d7806['canvasShortcutsPath']]['map'](_0xc1a663 => _0xc1a663 ? normalizeComparablePath(_0xc1a663) + ':' + referenceKey(_0xc1a663) : '')["join"]('|');
}
function publicRoots() {
  return {
    'output': 'output/',
    'uploads': "data/uploads/",
    'assets': 'data/assets/',
    'workflowThumbs': 'data/workflows/thumbs/'
  };
}
function buildRootConfigs(_0x568998) {
  return ROOT_DEFINITIONS['map'](_0x518521 => ({
    ..._0x518521,
    'absRoot': trimText(_0x568998?.[_0x518521["rootKey"]])
  }))["filter"](_0x51c96e => _0x51c96e['absRoot']);
}
export function resolveVirtualPathToAbsolute(_0x43322f, _0x72be92) {
  const _0xa515d8 = normalizeVirtualLocalPath(_0x43322f);
  return resolveNormalizedVirtualPath(_0xa515d8, _0x72be92);
}
function resolveNormalizedVirtualPath(_0x19917e, _0x3fd39b) {
  if (!_0x19917e) {
    return '';
  }
  const _0x311990 = process["platform"] === 'win32' || process["platform"] === "darwin" ? _0x19917e["toLowerCase"]() : _0x19917e;
  for (const _0x5c2df9 of buildRootConfigs(_0x3fd39b)) {
    if (!_0x311990["startsWith"](_0x5c2df9["virtualPrefix"])) {
      continue;
    }
    const _0x163df5 = _0x19917e["slice"](_0x5c2df9['virtualPrefix']["length"]);
    const _0x924e4a = a250_0x5861a5["resolve"](_0x5c2df9["absRoot"], ..._0x163df5["split"]('/')["filter"](Boolean));
    return isPathInside(_0x924e4a, _0x5c2df9['absRoot']) ? _0x924e4a : '';
  }
  return '';
}
function toVirtualPath(_0x59d191, _0x18c5a7) {
  const _0x3031b7 = a250_0x5861a5["relative"](_0x18c5a7["absRoot"], _0x59d191);
  if (!_0x3031b7 || _0x3031b7["startsWith"]('..') || a250_0x5861a5["isAbsolute"](_0x3031b7)) {
    return '';
  }
  return '' + _0x18c5a7['virtualPrefix'] + _0x3031b7["replace"](/\\/g, '/');
}
function isCleanableJsonCandidate(_0x300e9e) {
  return /\.waveform\.json$/i["test"](a250_0x5861a5["basename"](_0x300e9e));
}
function isCleanableCandidate(_0x48318b, _0x1c554c) {
  const _0x316351 = a250_0x5861a5["basename"](_0x48318b);
  const _0x1f1559 = a250_0x5861a5["extname"](_0x316351)["toLowerCase"]();
  if (_0x316351 === "assets.index.json") {
    return ![];
  }
  if (_0x1f1559 === ".json") {
    return isCleanableJsonCandidate(_0x48318b);
  }
  if (!MEDIA_EXTENSIONS["has"](_0x1f1559)) {
    return ![];
  }
  if (_0x1c554c === 'workflowThumbs') {
    return IMAGE_EXTENSIONS["has"](_0x1f1559);
  }
  return !![];
}
function classifyCandidateKind(_0x4e918f) {
  if (isCleanableJsonCandidate(_0x4e918f)) {
    return "waveform";
  }
  const _0x151183 = a250_0x5861a5["extname"](_0x4e918f)["toLowerCase"]();
  if (IMAGE_EXTENSIONS['has'](_0x151183)) {
    return 'image';
  }
  if (VIDEO_EXTENSIONS["has"](_0x151183)) {
    return 'video';
  }
  if (AUDIO_EXTENSIONS['has'](_0x151183)) {
    return "audio";
  }
  return "media";
}
function collectCandidateFiles(_0x510796, _0x27e8fc) {
  const _0x15fcfb = [];
  const _0xff24a4 = new Set();
  for (const _0x49e887 of buildRootConfigs(_0x510796)) {
    const _0x109279 = listFilesRecursive(_0x49e887["absRoot"], _0x27e8fc, {
      'filter': _0x26a284 => isCleanableCandidate(_0x26a284, _0x49e887["key"])
    });
    for (const _0x1cd040 of _0x109279) {
      const _0x5e822f = a250_0x5861a5["resolve"](_0x1cd040);
      const _0xd0c8b7 = normalizeComparablePath(_0x5e822f);
      if (_0xff24a4['has'](_0xd0c8b7)) {
        continue;
      }
      _0xff24a4["add"](_0xd0c8b7);
      const _0x36b44d = toVirtualPath(_0x5e822f, _0x49e887);
      if (!_0x36b44d) {
        continue;
      }
      let _0x58a819 = null;
      try {
        _0x58a819 = statSync(_0x5e822f);
      } catch (_0x505eb3) {
        _0x27e8fc?.["push"]({
          'type': "file-read-failed",
          'source': _0x5e822f,
          'message': _0x505eb3["message"]
        });
        continue;
      }
      if (!_0x58a819?.["isFile"]?.()) {
        continue;
      }
      _0x15fcfb["push"]({
        'absPath': _0x5e822f,
        'localPath': _0x36b44d,
        'size': Number(_0x58a819["size"] || 0x0),
        'kind': classifyCandidateKind(_0x5e822f),
        'modifiedAt': Number(_0x58a819['mtimeMs'] || 0x0),
        'identity': referenceKey(_0x5e822f) + '|' + _0x58a819["size"] + '|' + _0x58a819["mtimeMs"] + '|' + _0x58a819["ctimeMs"] + '|' + _0x58a819["ino"],
        'sourceRoot': _0x49e887["key"]
      });
    }
  }
  return _0x15fcfb;
}
function collectAllReferences({
  roots: _0x54937d,
  currentProjectSnapshot: _0x3f4695,
  warnings: _0x58874d,
  coverage = {}
}) {
  const _0x448a89 = new Set();
  !isPlainObject(_0x3f4695) && _0x58874d['push']({
    'type': "snapshot-unavailable",
    'source': "current-project",
    'message': "当前画布快照不可用，请重新扫描"
  });
  collectReferencedLocalPaths(_0x3f4695, _0x448a89, new Set(), _0x54937d);
  const _0x3218aa = listProjectFiles(_0x54937d['canvasRoot'], _0x58874d);
  addJsonReferencesFromFiles(_0x3218aa, _0x448a89, _0x58874d, "project", _0x54937d);
  const _0x6c0eb = readRecentProjectPaths(_0x54937d['recentProjectsStorePath'], _0x58874d);
  addJsonReferencesFromFiles(_0x6c0eb, _0x448a89, _0x58874d, "recent-project", _0x54937d);
  coverage['projectFiles'] = new Set([..._0x3218aa, ..._0x6c0eb]["map"](_0x115ce9 => normalizeComparablePath(_0x115ce9)))['size'];
  optionalReferenceExists(_0x54937d['recoverySnapshotPath'], _0x58874d) && addJsonReferencesFromFiles([_0x54937d["recoverySnapshotPath"]], _0x448a89, _0x58874d, 'recovery-snapshot', _0x54937d);
  addJsonReferencesFromFiles(listJsonFiles(_0x54937d['assetsRoot'], _0x58874d), _0x448a89, _0x58874d, 'assets', _0x54937d);
  addJsonReferencesFromFiles(listJsonFiles(_0x54937d["workflowsRoot"], _0x58874d), _0x448a89, _0x58874d, "workflows", _0x54937d);
  optionalReferenceExists(_0x54937d["canvasShortcutsPath"], _0x58874d) && addJsonReferencesFromFiles([_0x54937d["canvasShortcutsPath"]], _0x448a89, _0x58874d, 'canvas-shortcuts', _0x54937d);
  return _0x448a89;
}
function createScanId(_0x4184ba = Date["now"]()) {
  return 'asset-cleanup-' + _0x4184ba + '-' + Math["random"]()["toString"](0x24)['slice'](0x2, 0xa);
}
function runScan({
  roots: _0x12f09c,
  currentProjectSnapshot: _0x49857f,
  scanId = createScanId(),
  scannedAt = Date["now"](),
  scope = "current"
}) {
  const _0x6be6da = [];
  const _0x423739 = {
    'canvasDirectory': _0x12f09c["canvasRoot"] || '',
    'mediaDirectories': buildRootConfigs(_0x12f09c)["map"](_0x419c80 => ({
      'prefix': _0x419c80["virtualPrefix"],
      'path': _0x419c80["absRoot"]
    }))
  };
  const _0x1dad92 = collectAllReferences({
    'roots': _0x12f09c,
    'currentProjectSnapshot': _0x49857f,
    'warnings': _0x6be6da,
    'coverage': _0x423739
  });
  const _0x464e91 = collectCandidateFiles(_0x12f09c, _0x6be6da);
  const _0x53d122 = _0x464e91['filter'](_0x4bbf94 => !_0x1dad92["has"](_0x4bbf94["localPath"]) && !_0x1dad92['has'](referenceKey(_0x4bbf94['absPath'])))['map'](({
    absPath: _0x4cec81,
    identity: _0x33f940,
    ..._0x558d1c
  }) => ({
    ..._0x558d1c,
    'absolutePath': _0x4cec81
  }))['sort']((_0x53e0e0, _0x1db9dc) => Number(_0x1db9dc["size"] || 0x0) - Number(_0x53e0e0["size"] || 0x0) || _0x53e0e0["localPath"]['localeCompare'](_0x1db9dc["localPath"]));
  const _0x2382fd = _0x53d122["reduce"]((_0x22ce80, _0x525279) => _0x22ce80 + Number(_0x525279["size"] || 0x0), 0x0);
  return {
    'ok': _0x6be6da["length"] === 0x0,
    'canTrash': _0x6be6da["length"] === 0x0,
    'scanId': scanId,
    'scope': scope,
    'scannedAt': scannedAt,
    'roots': publicRoots(),
    'candidateCount': _0x464e91['length'],
    'orphanCount': _0x53d122["length"],
    'orphanBytes': _0x2382fd,
    'items': _0x53d122,
    'warnings': _0x6be6da,
    'coverage': _0x423739,
    '_private': {
      'roots': _0x12f09c,
      'rootsSignature': rootsSignature(_0x12f09c),
      'currentProjectSnapshot': _0x49857f,
      'references': _0x1dad92,
      'identities': new Map(_0x464e91["map"](_0x35b3dd => [_0x35b3dd["localPath"], _0x35b3dd["identity"]]))
    }
  };
}
function publicScanResult(_0x483c59) {
  const {
    _private: _0x5bbd5e,
    ..._0x37ebd1
  } = _0x483c59;
  return _0x37ebd1;
}
function cloneJsonLike(_0x25b4b5) {
  if (_0x25b4b5 == null) {
    return _0x25b4b5;
  }
  if (typeof structuredClone === "function") {
    try {
      return structuredClone(_0x25b4b5);
    } catch {}
  }
  try {
    return JSON['parse'](JSON["stringify"](_0x25b4b5));
  } catch {
    return null;
  }
}
export function createLocalAssetCleanupManager({
  getRoots: _0x242516,
  trashItem: _0x3cb03c,
  now = () => Date["now"]()
} = {}) {
  const _0x4253e8 = new Map();
  async function _0x39955a(_0x1e396a = {}) {
    if (_0x1e396a?.["scope"] != null && _0x1e396a['scope'] !== 'current') {
      throw new Error("不支持的素材清理范围");
    }
    if (typeof _0x242516 !== "function") {
      throw new Error("缺少清理目录配置");
    }
    const _0x33339d = await _0x242516(_0x1e396a);
    return _0x33339d && typeof _0x33339d === "object" ? _0x33339d : {};
  }
  return {
    async 'scan'(_0x25867a = {}) {
      const _0xa3b409 = await _0x39955a(_0x25867a || {});
      const _0xa4aa5e = runScan({
        'roots': _0xa3b409,
        'currentProjectSnapshot': cloneJsonLike(_0x25867a?.['currentProjectSnapshot']),
        'scanId': createScanId(now()),
        'scannedAt': now(),
        'scope': trimText(_0x25867a?.["scope"]) || "current"
      });
      _0x4253e8["set"](_0xa4aa5e["scanId"], _0xa4aa5e);
      if (_0x4253e8['size'] > 0x6) {
        const _0x7387da = _0x4253e8["keys"]()["next"]()["value"];
        if (_0x7387da) {
          _0x4253e8['delete'](_0x7387da);
        }
      }
      return publicScanResult(_0xa4aa5e);
    },
    async 'trash'(_0x420b97 = {}) {
      if (typeof _0x3cb03c !== "function") {
        throw new Error("当前环境不支持移到回收站");
      }
      const _0x5b9416 = trimText(_0x420b97?.["scanId"]);
      const _0x142b23 = _0x4253e8["get"](_0x5b9416);
      if (!_0x142b23) {
        throw new Error('扫描结果已过期，请重新扫描');
      }
      if (_0x142b23["_private"]["trashing"]) {
        throw new Error("正在清理，请勿重复操作");
      }
      const _0x1aa90e = await _0x39955a(_0x420b97 || {});
      if (rootsSignature(_0x1aa90e) !== _0x142b23["_private"]["rootsSignature"]) {
        _0x4253e8["delete"](_0x5b9416);
        throw new Error("文件保存路径已变化，请重新扫描");
      }
      const _0xde7b35 = Array["isArray"](_0x420b97?.["localPaths"]) ? _0x420b97["localPaths"]["filter"](_0x492f7a => typeof _0x492f7a === "string") : [];
      const _0x5cabf4 = new Set(_0xde7b35);
      if (_0x5cabf4["size"] === 0x0) {
        return {
          'ok': !![],
          'trashedCount': 0x0,
          'trashedBytes': 0x0,
          'skipped': [],
          'errors': []
        };
      }
      const _0x3a308a = cloneJsonLike(_0x420b97?.["currentProjectSnapshot"]);
      if (!isPlainObject(_0x3a308a)) {
        throw new Error("当前画布快照不可用，请重新扫描");
      }
      const _0x1f6b66 = runScan({
        'roots': _0x142b23["_private"]["roots"],
        'currentProjectSnapshot': _0x3a308a,
        'scanId': _0x5b9416,
        'scannedAt': now(),
        'scope': _0x142b23["scope"] || "current"
      });
      if (!_0x142b23["canTrash"] || !_0x1f6b66['canTrash']) {
        throw new Error("扫描不完整，无法清理；请修复清单中的读取问题后重新扫描");
      }
      const _0x590273 = new Set(_0x142b23["items"]['map'](_0x40a610 => _0x40a610["localPath"]));
      const _0x1a157f = new Map(_0x1f6b66["items"]["map"](_0x18e571 => [_0x18e571["localPath"], _0x18e571]));
      const _0x47c530 = [];
      const _0x261d8d = [];
      let _0x503c00 = 0x0;
      let _0x2a9d8d = 0x0;
      if (_0x142b23["_private"]["trashing"] || !_0x4253e8['has'](_0x5b9416)) {
        throw new Error("扫描结果已过期，请重新扫描");
      }
      _0x142b23["_private"]["trashing"] = !![];
      for (const _0x4a3149 of _0x5cabf4) {
        const _0x51aefe = _0x1a157f["get"](_0x4a3149);
        if (!_0x51aefe || !_0x590273['has'](_0x4a3149)) {
          _0x47c530["push"]({
            'localPath': _0x4a3149,
            'reason': "referenced-or-missing"
          });
          continue;
        }
        const _0x32ae40 = resolveNormalizedVirtualPath(_0x4a3149, _0x142b23['_private']["roots"]);
        if (!_0x32ae40 || !existsSync(_0x32ae40)) {
          _0x47c530["push"]({
            'localPath': _0x4a3149,
            'reason': "missing"
          });
          continue;
        }
        try {
          const _0x19d0f2 = statSync(_0x32ae40);
          const _0x41500f = referenceKey(_0x32ae40) + '|' + _0x19d0f2["size"] + '|' + _0x19d0f2["mtimeMs"] + '|' + _0x19d0f2["ctimeMs"] + '|' + _0x19d0f2['ino'];
          if (_0x41500f !== _0x142b23['_private']["identities"]['get'](_0x4a3149)) {
            _0x47c530['push']({
              'localPath': _0x4a3149,
              'reason': "changed-since-scan"
            });
            continue;
          }
          await _0x3cb03c(_0x32ae40);
          _0x503c00 += 0x1;
          _0x2a9d8d += Number(_0x51aefe['size'] || 0x0);
        } catch (_0x50a4b9) {
          _0x261d8d["push"]({
            'localPath': _0x4a3149,
            'message': String(_0x50a4b9?.["message"] || _0x50a4b9)
          });
        }
      }
      _0x4253e8["delete"](_0x5b9416);
      return {
        'ok': _0x261d8d["length"] === 0x0,
        'trashedCount': _0x503c00,
        'trashedBytes': _0x2a9d8d,
        'skipped': _0x47c530,
        'errors': _0x261d8d
      };
    },
    '_scanForTests'(_0x2ab16c = {}) {
      return runScan(_0x2ab16c);
    }
  };
}
export const localAssetCleanupInternals = {
  'CLEANABLE_PREFIXES': CLEANABLE_PREFIXES,
  'isCleanableCandidate': isCleanableCandidate,
  'collectCandidateFiles': collectCandidateFiles,
  'collectAllReferences': collectAllReferences,
  'rootsSignature': rootsSignature
};