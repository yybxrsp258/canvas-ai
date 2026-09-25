import { createHash } from 'node:crypto';
import { closeSync, copyFileSync, existsSync, fsyncSync, mkdirSync, openSync, promises as a1694_0x1abdce, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import a1694_0x59520b from 'node:path';
import { t } from '../i18n/index.js';
export const PROJECT_RECENTS_VERSION = 0x1;
export const PROJECT_RECENTS_LIMIT = 0x14;
export const RECOVERY_SNAPSHOT_VERSION = 0x1;
export const DEFAULT_PROJECT_FILE_EXTENSION = ".aicanvas";
export const PROJECT_BACKUP_LIMIT = 0x5;
export const SUPPORTED_PROJECT_FILE_EXTENSIONS = Object["freeze"]([".aicanvas", ".aicproj", ".json"]);
export const ASSOCIATED_PROJECT_FILE_EXTENSIONS = Object['freeze'](["aicanvas", "aicproj"]);
function isPlainObject(_0x279f4a) {
  return !!_0x279f4a && typeof _0x279f4a === "object" && !Array['isArray'](_0x279f4a);
}
function normalizeComparablePath(_0x4adac2) {
  const _0x1e0473 = a1694_0x59520b["resolve"](String(_0x4adac2 || ''));
  return process["platform"] === "win32" || process["platform"] === "darwin" ? _0x1e0473['toLowerCase']() : _0x1e0473;
}
function stripUtf8Bom(_0x380f3b) {
  return String(_0x380f3b || '')['replace'](/^\uFEFF/, '');
}
function readProjectJsonFile(_0x1ee381) {
  const _0x36d0a5 = JSON["parse"](stripUtf8Bom(readFileSync(_0x1ee381, 'utf8')));
  if (!isPlainObject(_0x36d0a5)) {
    throw new Error("Project JSON must be an object");
  }
  if ('canvases' in _0x36d0a5 && !Array["isArray"](_0x36d0a5["canvases"])) {
    throw new Error("Project canvases must be an array");
  }
  return _0x36d0a5;
}
function projectBackupPath(_0x5056c9, _0x4184e8 = 0x0) {
  return _0x4184e8 === 0x0 ? _0x5056c9 + ".bak" : _0x5056c9 + '.bak.' + _0x4184e8;
}
function readValidProjectBackup(_0x30e181) {
  for (let _0x153293 = 0x0; _0x153293 < PROJECT_BACKUP_LIMIT; _0x153293 += 0x1) {
    const _0x3ef18d = projectBackupPath(_0x30e181, _0x153293);
    if (!existsSync(_0x3ef18d)) {
      continue;
    }
    try {
      return readProjectJsonFile(_0x3ef18d);
    } catch {}
  }
  return null;
}
function projectHasMeaningfulContent(_0x25c492) {
  if (!isPlainObject(_0x25c492)) {
    return ![];
  }
  if (Array["isArray"](_0x25c492["canvases"])) {
    return _0x25c492['canvases']["some"](_0x34c9f2 => {
      if (!isPlainObject(_0x34c9f2)) {
        return ![];
      }
      return ["nodes", 'edges', "assets", "storyboard3dProjects"]["some"](_0x19ef62 => {
        const _0x4d621d = _0x34c9f2[_0x19ef62];
        return (Array['isArray'](_0x4d621d) || isPlainObject(_0x4d621d)) && Object["keys"](_0x4d621d)["length"] > 0x0;
      });
    });
  }
  return ["nodes", "edges", 'assets', 'storyboard3dProjects']["some"](_0x315936 => {
    const _0x5e4a34 = _0x25c492[_0x315936];
    return (Array['isArray'](_0x5e4a34) || isPlainObject(_0x5e4a34)) && Object["keys"](_0x5e4a34)['length'] > 0x0;
  });
}
function writeTextAtomically(_0x2f9b83, _0x5108b3) {
  mkdirSync(a1694_0x59520b["dirname"](_0x2f9b83), {
    'recursive': !![]
  });
  const _0x142f58 = _0x2f9b83 + ".tmp-" + process["pid"] + '-' + Date["now"]() + '-' + Math["random"]()['toString'](0x10)["slice"](0x2);
  let _0x192bcb = null;
  try {
    writeFileSync(_0x142f58, _0x5108b3, 'utf8');
    _0x192bcb = openSync(_0x142f58, 'r+');
    fsyncSync(_0x192bcb);
    closeSync(_0x192bcb);
    _0x192bcb = null;
    renameSync(_0x142f58, _0x2f9b83);
  } finally {
    if (_0x192bcb !== null) {
      try {
        closeSync(_0x192bcb);
      } catch {}
    }
    if (existsSync(_0x142f58)) {
      try {
        unlinkSync(_0x142f58);
      } catch {}
    }
  }
}
function rotateProjectBackups(_0x2d8419, _0x10dc5d) {
  for (let _0x3abf08 = PROJECT_BACKUP_LIMIT - 0x1; _0x3abf08 > 0x0; _0x3abf08 -= 0x1) {
    const _0x41b3cd = projectBackupPath(_0x2d8419, _0x3abf08 - 0x1);
    if (!existsSync(_0x41b3cd)) {
      continue;
    }
    copyFileSync(_0x41b3cd, projectBackupPath(_0x2d8419, _0x3abf08));
  }
  writeTextAtomically(projectBackupPath(_0x2d8419), JSON['stringify'](_0x10dc5d, null, 0x2) + '\x0a');
}
function preserveCorruptProjectFile(_0x3fc6e0) {
  let _0x1f390c = 0x0;
  let _0x479d4d = '';
  do {
    const _0x3274b1 = _0x1f390c > 0x0 ? '-' + _0x1f390c : '';
    _0x479d4d = _0x3fc6e0 + ".corrupt-" + Date['now']() + _0x3274b1;
    _0x1f390c += 0x1;
  } while (existsSync(_0x479d4d));
  copyFileSync(_0x3fc6e0, _0x479d4d);
  return _0x479d4d;
}
function normalizeTimestamp(_0x179664, _0x422056 = 0x0) {
  const _0x4c2223 = Number(_0x179664);
  return Number["isFinite"](_0x4c2223) && _0x4c2223 > 0x0 ? Math["round"](_0x4c2223) : _0x422056;
}
export function isSupportedProjectFileExtension(_0x2d2ddc) {
  const _0x4e5cf9 = a1694_0x59520b["extname"](String(_0x2d2ddc || ''))["toLowerCase"]();
  return SUPPORTED_PROJECT_FILE_EXTENSIONS['includes'](_0x4e5cf9);
}
export function stripProjectFileExtension(_0x538e8b) {
  const _0x4b1089 = String(_0x538e8b || '');
  const _0x395984 = a1694_0x59520b["extname"](_0x4b1089)["toLowerCase"]();
  return SUPPORTED_PROJECT_FILE_EXTENSIONS["includes"](_0x395984) ? _0x4b1089["slice"](0x0, -_0x395984["length"]) : _0x4b1089;
}
export function sanitizeProjectName(_0x1bc0d7) {
  const _0x5a608f = t("coreServices.projectFile.unnamedCanvas");
  const _0x4b53bc = String(_0x1bc0d7 || '')["trim"]() || _0x5a608f;
  return _0x4b53bc["replace"](/[\\/:*?"<>|]/g, '_')['replace'](/\s+/g, '\x20')["trim"]() || _0x5a608f;
}
export function sanitizeProjectFilename(_0x37b339) {
  const _0x36d7b6 = sanitizeProjectName(stripProjectFileExtension(_0x37b339));
  return '' + _0x36d7b6 + DEFAULT_PROJECT_FILE_EXTENSION;
}
export function withJsonProjectExtension(_0x3b0e30) {
  const _0x42526e = String(_0x3b0e30 || '')["trim"]();
  if (!_0x42526e) {
    return _0x42526e;
  }
  return a1694_0x59520b["extname"](_0x42526e) ? _0x42526e : '' + _0x42526e + DEFAULT_PROJECT_FILE_EXTENSION;
}
export function assertJsonProjectPath(_0x3c3ce3, {
  mustExist = ![]
} = {}) {
  const _0x232b2f = String(_0x3c3ce3 || '')["trim"]();
  if (!_0x232b2f) {
    throw new Error("Project path is required");
  }
  if (!a1694_0x59520b['isAbsolute'](_0x232b2f)) {
    throw new Error("Project path must be absolute");
  }
  if (!isSupportedProjectFileExtension(_0x232b2f)) {
    throw new Error('Only\x20.aicanvas,\x20.aicproj,\x20or\x20.json\x20project\x20files\x20are\x20supported');
  }
  if (mustExist) {
    const _0x199907 = statSync(_0x232b2f);
    if (!_0x199907['isFile']()) {
      throw new Error("Project path is not a file");
    }
  }
  return a1694_0x59520b["resolve"](_0x232b2f);
}
export function findFirstSupportedProjectPathFromArgs(_0x316835, {
  mustExist = !![]
} = {}) {
  const _0x5132c3 = Array["isArray"](_0x316835) ? _0x316835 : [];
  for (const _0x3909f7 of _0x5132c3) {
    const _0x3ea7b2 = String(_0x3909f7 || '')["trim"]()["replace"](/^"|"$/g, '');
    if (!_0x3ea7b2 || !a1694_0x59520b["isAbsolute"](_0x3ea7b2)) {
      continue;
    }
    if (!isSupportedProjectFileExtension(_0x3ea7b2)) {
      continue;
    }
    try {
      return assertJsonProjectPath(_0x3ea7b2, {
        'mustExist': mustExist
      });
    } catch {}
  }
  return '';
}
export function readProjectJson(_0x4f82eb) {
  const _0x2ae487 = assertJsonProjectPath(_0x4f82eb);
  try {
    return readProjectJsonFile(_0x2ae487);
  } catch (_0x2e7416) {
    const _0x1ef6e6 = readValidProjectBackup(_0x2ae487);
    if (_0x1ef6e6) {
      return _0x1ef6e6;
    }
    throw _0x2e7416;
  }
}
export function buildProjectFilePayload(_0x384d0b) {
  if (!isPlainObject(_0x384d0b)) {
    throw new Error("Project data must be an object");
  }
  if (Array["isArray"](_0x384d0b["canvases"])) {
    return {
      'canvases': _0x384d0b["canvases"],
      'activeCanvasId': String(_0x384d0b["activeCanvasId"] || _0x384d0b["canvases"][0x0]?.['id'] || "canvas_1")
    };
  }
  return {
    'nodes': isPlainObject(_0x384d0b['nodes']) || Array["isArray"](_0x384d0b["nodes"]) ? _0x384d0b["nodes"] : [],
    'edges': isPlainObject(_0x384d0b["edges"]) || Array["isArray"](_0x384d0b["edges"]) ? _0x384d0b['edges'] : [],
    'viewport': isPlainObject(_0x384d0b["viewport"]) ? _0x384d0b["viewport"] : {}
  };
}
export function writeProjectJson(_0x4bae7e, _0x2667e5, {
  allowEmptyOverwrite = ![]
} = {}) {
  const _0x4209de = assertJsonProjectPath(_0x4bae7e);
  const _0x3dad3f = buildProjectFilePayload(_0x2667e5);
  mkdirSync(a1694_0x59520b['dirname'](_0x4209de), {
    'recursive': !![]
  });
  if (existsSync(_0x4209de)) {
    let _0x2790be = null;
    let _0xc437c0 = ![];
    try {
      _0x2790be = readProjectJsonFile(_0x4209de);
    } catch (_0x357a82) {
      _0x2790be = readValidProjectBackup(_0x4209de);
      if (!_0x2790be) {
        throw new Error('Project\x20data\x20is\x20corrupted\x20and\x20has\x20no\x20valid\x20backup:\x20' + (_0x357a82?.['message'] || _0x357a82));
      }
      _0xc437c0 = !![];
    }
    if (allowEmptyOverwrite !== !![] && projectHasMeaningfulContent(_0x2790be) && !projectHasMeaningfulContent(_0x3dad3f)) {
      throw new Error('Refusing\x20to\x20replace\x20a\x20non-empty\x20project\x20with\x20an\x20empty\x20snapshot');
    }
    _0xc437c0 ? preserveCorruptProjectFile(_0x4209de) : rotateProjectBackups(_0x4209de, _0x2790be);
  }
  writeTextAtomically(_0x4209de, JSON["stringify"](_0x3dad3f, null, 0x2) + '\x0a');
  return _0x3dad3f;
}
export function buildRecoverySnapshotPayload(_0x407ab2 = {}, {
  now = Date["now"]()
} = {}) {
  const _0x2a02cc = isPlainObject(_0x407ab2?.["data"]) ? _0x407ab2['data'] : _0x407ab2?.["multiData"];
  const _0xd6131d = buildProjectFilePayload(_0x2a02cc || {});
  const _0x2f7dd5 = normalizeTimestamp(_0x407ab2?.['savedAt'], normalizeTimestamp(now, Date["now"]()));
  const _0x248e2b = String(_0x407ab2?.["filename"] || '')["trim"]();
  return {
    'version': RECOVERY_SNAPSHOT_VERSION,
    'savedAt': _0x2f7dd5,
    'reason': String(_0x407ab2?.['reason'] || 'auto')["trim"]() || "auto",
    'projectId': String(_0x407ab2?.['projectId'] || '')['trim']() || 'default_v2_project',
    'projectName': sanitizeProjectName(_0x407ab2?.["projectName"] || _0x407ab2?.["projectId"] || t("coreServices.projectFile.unnamedCanvas")),
    'filename': _0x248e2b ? a1694_0x59520b['basename'](_0x248e2b) : '',
    'recentId': String(_0x407ab2?.['recentId'] || '')["trim"](),
    'displayPath': String(_0x407ab2?.['displayPath'] || '')["trim"](),
    'lastKnownProjectLastModified': normalizeTimestamp(_0x407ab2?.["lastKnownProjectLastModified"] ?? _0x407ab2?.["lastModified"], 0x0),
    'data': _0xd6131d
  };
}
export function writeRecoverySnapshot(_0x2a6d60, _0x127240, _0x4f2700 = {}) {
  const _0x3f2559 = String(_0x2a6d60 || '')["trim"]();
  if (!_0x3f2559) {
    throw new Error("Recovery path is required");
  }
  const _0x21d975 = a1694_0x59520b["resolve"](_0x3f2559);
  const _0x51996 = buildRecoverySnapshotPayload(_0x127240, _0x4f2700);
  writeTextAtomically(_0x21d975, JSON["stringify"](_0x51996, null, 0x2) + '\x0a');
  return _0x51996;
}
export async function readRecoverySnapshot(_0x39f609) {
  try {
    const _0x3917fc = String(_0x39f609 || '')["trim"]();
    if (!_0x3917fc) {
      return null;
    }
    const _0xdb3d6c = a1694_0x59520b["resolve"](_0x3917fc);
    const _0x56326f = JSON["parse"](stripUtf8Bom(await a1694_0x1abdce["readFile"](_0xdb3d6c, "utf8")));
    if (!isPlainObject(_0x56326f)) {
      return null;
    }
    if (Number(_0x56326f["version"]) !== RECOVERY_SNAPSHOT_VERSION) {
      return null;
    }
    if (!isPlainObject(_0x56326f["data"])) {
      return null;
    }
    const _0x130928 = normalizeTimestamp(_0x56326f["savedAt"], 0x0);
    if (!_0x130928) {
      return null;
    }
    return {
      ..._0x56326f,
      'savedAt': _0x130928,
      'projectId': String(_0x56326f["projectId"] || '')["trim"]() || "default_v2_project",
      'projectName': sanitizeProjectName(_0x56326f['projectName'] || _0x56326f["projectId"] || t("coreServices.projectFile.unnamedCanvas")),
      'filename': String(_0x56326f["filename"] || '')["trim"](),
      'recentId': String(_0x56326f["recentId"] || '')["trim"](),
      'displayPath': String(_0x56326f["displayPath"] || '')["trim"](),
      'lastKnownProjectLastModified': normalizeTimestamp(_0x56326f['lastKnownProjectLastModified'], 0x0)
    };
  } catch {
    return null;
  }
}
export function removeRecoverySnapshot(_0x327f6f) {
  try {
    const _0x299c49 = String(_0x327f6f || '')["trim"]();
    if (!_0x299c49) {
      return;
    }
    unlinkSync(a1694_0x59520b['resolve'](_0x299c49));
  } catch (_0x124613) {
    if (_0x124613?.["code"] !== "ENOENT") {
      throw _0x124613;
    }
  }
}
export async function getRecoverySnapshotInfo(_0x4afff7, {
  currentLastModified = 0x0,
  snapshot: _0xbf5f20
} = {}) {
  if (_0xbf5f20 === undefined) {
    _0xbf5f20 = await readRecoverySnapshot(_0x4afff7);
  }
  if (!_0xbf5f20) {
    return {
      'exists': ![],
      'isNewerThanProject': ![],
      'savedAt': 0x0,
      'currentLastModified': normalizeTimestamp(currentLastModified, 0x0)
    };
  }
  const _0x4e0f75 = normalizeTimestamp(currentLastModified, _0xbf5f20["lastKnownProjectLastModified"]);
  return {
    'exists': !![],
    'isNewerThanProject': _0xbf5f20['savedAt'] > _0x4e0f75,
    'savedAt': _0xbf5f20["savedAt"],
    'currentLastModified': _0x4e0f75,
    'projectId': _0xbf5f20["projectId"],
    'projectName': _0xbf5f20["projectName"],
    'filename': _0xbf5f20["filename"],
    'recentId': _0xbf5f20['recentId'],
    'displayPath': _0xbf5f20["displayPath"],
    'lastKnownProjectLastModified': _0xbf5f20["lastKnownProjectLastModified"]
  };
}
export function buildDefaultProjectPath(_0x28e053, _0x3fca08) {
  const _0x1259dd = a1694_0x59520b["resolve"](String(_0x28e053 || ''));
  return a1694_0x59520b["join"](_0x1259dd, sanitizeProjectFilename(_0x3fca08));
}
export function getProjectRecentId(_0x1df418) {
  const _0x2f444b = normalizeComparablePath(_0x1df418);
  return createHash("sha256")["update"](_0x2f444b)["digest"]("hex")["slice"](0x0, 0x18);
}
export function readRecentProjects(_0xda3bf8) {
  try {
    const _0x5134ad = readFileSync(_0xda3bf8, "utf8");
    const _0x27190d = JSON["parse"](stripUtf8Bom(_0x5134ad));
    return Array["isArray"](_0x27190d?.["items"]) ? _0x27190d["items"] : [];
  } catch {
    return [];
  }
}
export function writeRecentProjects(_0x52de0a, _0x372d53) {
  const _0x26b6dd = {
    'version': PROJECT_RECENTS_VERSION,
    'updatedAt': Date["now"](),
    'items': Array["isArray"](_0x372d53) ? _0x372d53["slice"](0x0, PROJECT_RECENTS_LIMIT) : []
  };
  writeTextAtomically(_0x52de0a, JSON["stringify"](_0x26b6dd, null, 0x2) + '\x0a');
  return _0x26b6dd["items"];
}
export function buildRecentProjectItem(_0x39ec69, {
  name = '',
  now = Date['now']()
} = {}) {
  const _0x14b736 = assertJsonProjectPath(_0x39ec69);
  const _0x2e146f = existsSync(_0x14b736);
  const _0x265968 = _0x2e146f ? statSync(_0x14b736) : null;
  return buildRecentProjectMetadata(_0x14b736, _0x265968, {
    'name': name,
    'now': now
  });
}
function buildRecentProjectMetadata(_0x5d1552, _0x227b47, {
  name = '',
  now = Date["now"]()
} = {}) {
  const _0x36bdff = a1694_0x59520b["basename"](_0x5d1552);
  return {
    'recentId': getProjectRecentId(_0x5d1552),
    'name': sanitizeProjectName(name || stripProjectFileExtension(_0x36bdff)),
    'filename': _0x36bdff,
    'path': _0x5d1552,
    'displayPath': _0x5d1552,
    'lastModified': _0x227b47 ? Math["round"](_0x227b47["mtimeMs"]) : 0x0,
    'updatedAt': now,
    'exists': _0x227b47 !== null
  };
}
async function readRecentProjectItems(_0x489520) {
  try {
    const _0x44aa99 = await a1694_0x1abdce["readFile"](_0x489520, "utf8");
    const _0x456724 = JSON["parse"](stripUtf8Bom(_0x44aa99));
    return Array["isArray"](_0x456724?.['items']) ? _0x456724['items'] : [];
  } catch {
    return [];
  }
}
async function refreshRecentProjectItem(_0x2bfa45) {
  const _0x269338 = assertJsonProjectPath(_0x2bfa45["path"]);
  const _0x4680cc = await a1694_0x1abdce['stat'](_0x269338)["catch"](() => null);
  return {
    ...buildRecentProjectMetadata(_0x269338, _0x4680cc, {
      'name': _0x2bfa45["name"] || _0x2bfa45["filename"],
      'now': Number(_0x2bfa45["updatedAt"] || 0x0) || Date["now"]()
    }),
    'updatedAt': Number(_0x2bfa45["updatedAt"] || 0x0) || 0x0
  };
}
export async function listRecentProjects(_0x20fdc9) {
  const _0x1777ed = await Promise["all"]((await readRecentProjectItems(_0x20fdc9))["filter"](_0x2e5fbe => _0x2e5fbe && _0x2e5fbe["path"])['map'](async _0x5e0c74 => {
    try {
      return await refreshRecentProjectItem(_0x5e0c74);
    } catch {
      return null;
    }
  }));
  const _0x2a6e09 = _0x1777ed["filter"](Boolean);
  _0x2a6e09["sort"]((_0x2aeaaa, _0x4e16fd) => Number(_0x4e16fd["updatedAt"] || _0x4e16fd['lastModified'] || 0x0) - Number(_0x2aeaaa['updatedAt'] || _0x2aeaaa['lastModified'] || 0x0));
  return _0x2a6e09;
}
export function upsertRecentProject(_0x13b966, _0x51eac4, {
  name = ''
} = {}) {
  const _0x1b2eff = buildRecentProjectItem(_0x51eac4, {
    'name': name,
    'now': Date["now"]()
  });
  const _0xf741a0 = readRecentProjects(_0x13b966)['filter'](_0x5e41b1 => _0x5e41b1?.["recentId"] !== _0x1b2eff["recentId"]);
  _0xf741a0['unshift'](_0x1b2eff);
  writeRecentProjects(_0x13b966, _0xf741a0);
  return _0x1b2eff;
}
export function removeRecentProject(_0x490039, _0xd76e63) {
  const _0x53f995 = String(_0xd76e63 || '')["trim"]();
  if (!_0x53f995) {
    return listRecentProjects(_0x490039);
  }
  const _0x3babd3 = readRecentProjects(_0x490039)["filter"](_0x18c880 => String(_0x18c880?.["recentId"] || '') !== _0x53f995);
  writeRecentProjects(_0x490039, _0x3babd3);
  return listRecentProjects(_0x490039);
}
export async function findRecentProject(_0x3b9b14, _0x2c9a82) {
  const _0x32b78f = String(_0x2c9a82 || '')["trim"]();
  if (!_0x32b78f) {
    return null;
  }
  const _0x5d8bd1 = await readRecentProjectItems(_0x3b9b14);
  _0x5d8bd1["sort"]((_0x2dc1d4, _0x169615) => Number(_0x169615?.["updatedAt"] || _0x169615?.['lastModified'] || 0x0) - Number(_0x2dc1d4?.["updatedAt"] || _0x2dc1d4?.['lastModified'] || 0x0));
  for (const _0x17b329 of _0x5d8bd1) {
    try {
      if (!_0x17b329?.["path"] || getProjectRecentId(assertJsonProjectPath(_0x17b329["path"])) !== _0x32b78f) {
        continue;
      }
      return await refreshRecentProjectItem(_0x17b329);
    } catch {}
  }
  return null;
}