import { createHash } from 'node:crypto';
import { copyFileSync, createReadStream, createWriteStream, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import a277_0x3f71fc from 'node:os';
import a277_0x4f6e2b from 'node:path';
import a277_0x403902 from 'extract-zip';
import a277_0x4846df from 'yazl';
import { buildProjectFilePayload, sanitizeProjectName, writeProjectJson } from '../src/services/desktopProjectFileStore.js';
import { collectReferencedLocalPaths, collectVirtualLocalPathsFromString, isPathInside, normalizeVirtualLocalPath, resolveVirtualPathToAbsolute } from './localAssetCleanup.js';
import { getVideoPlaybackProxyFilename } from './videoPlaybackProxy.js';
export const PROJECT_PACKAGE_SCHEMA_VERSION = 0x1;
export const WORKSPACE_PROJECT_PACKAGE_SCHEMA_VERSION = 0x2;
export const PROJECT_PACKAGE_KIND = "aiCanvas.projectPackage";
export const PROJECT_PACKAGE_FILE_EXTENSION = ".aicpkg";
export const PROJECT_PACKAGE_MANIFEST_NAME = "manifest.json";
export const PROJECT_PACKAGE_PROJECT_FILE = 'project/project.aicanvas';
export const WORKSPACE_PROJECT_PACKAGE_PROJECT_FILE = "project/project.json";
export const PROJECT_PACKAGE_TYPE_CANVAS = "canvas";
export const PROJECT_PACKAGE_TYPE_STORY = "story";
export const PROJECT_PACKAGE_TYPE_PERSON_REPLACEMENT = "person-replacement";
const SUPPORTED_PROJECT_PACKAGE_TYPES = new Set([PROJECT_PACKAGE_TYPE_CANVAS, PROJECT_PACKAGE_TYPE_STORY, PROJECT_PACKAGE_TYPE_PERSON_REPLACEMENT]);
const IMPORT_DIR_ROOT = 'ProjectImports';
const DEFAULT_MAX_IMPORT_PACKAGE_BYTES = 0xa * 0x400 * 0x400 * 0x400;
const DEFAULT_MAX_IMPORT_ASSET_BYTES = 0x5 * 0x400 * 0x400 * 0x400;
const ROOT_DEFINITIONS = Object["freeze"]([{
  'rootKey': "workflowThumbsRoot",
  'virtualPrefix': 'data/workflows/thumbs/'
}, {
  'rootKey': "uploadsRoot",
  'virtualPrefix': "data/uploads/"
}, {
  'rootKey': "assetsRoot",
  'virtualPrefix': 'data/assets/'
}, {
  'rootKey': "outputRoot",
  'virtualPrefix': 'output/'
}]);
const LOCAL_PATH_KEYS = new Set(["localPath", "originalLocalPath", 'displayLocalPath', "thumbLocalPath", "posterLocalPath", "coverLocalPath", "waveformLocalPath", 'sourceLocalPath', 'localUrl', "path"]);
const URL_KEYS = new Set(["url", 'src', "imageUrl", "videoUrl", "audioUrl", "thumbUrl", 'posterUrl', 'coverUrl', "sourceUrl", "originalUrl", "displayUrl", 'resultUrl', "imageRef", 'videoRef', 'audioRef', 'voiceRef', "keyframeRef", "playbackVideoRef", "replacementImageRef", "resultVideoRef", "originalMasterRef", "visualMasterRef", "finalVideoRef", 'activeReplacementVideoPosterRef', "appearanceRef", "assetRef", "backgroundAudioRef", "backgroundAudioUrl", "dataUrl", 'fallbackImageUrl', 'imageIterationOriginalKeyframeRef', "imageIterationReferenceRef", 'imageSourceRef', 'keyframeUrl', "mediaRef", "mediaUrl", 'originalAudioRef', "originalRef", "posterRef", "previewUrl", "referenceImageRef", "referenceImageUrl", "remoteFallbackUrl", "replacementAudioRef", "replacementVideoReferenceImageRef", "resultPosterRef", "resultRef", 'runtimePreviewRef', "selectedImageRef", "sourceClipRef", 'sourceImageRef', 'sourceInputRef', 'sourceRef', 'sourceVideoRef', "thumbnailRef", "thumbnailUrl", "vocalsAudioRef", "vocalsAudioUrl", "waveformUrl"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", '.mov', ".m4v", ".avi", ".mkv"]);
const RECOVERABLE_DERIVED_VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov", ".m4v"]);
function isPlainObject(_0xd953dc) {
  return !!_0xd953dc && typeof _0xd953dc === "object" && !Array["isArray"](_0xd953dc);
}
function trimText(_0x210212) {
  return String(_0x210212 || '')['trim']();
}
function normalizeProjectPackageType(_0x5bf3d6) {
  const _0x293d6f = trimText(_0x5bf3d6) || PROJECT_PACKAGE_TYPE_CANVAS;
  if (!SUPPORTED_PROJECT_PACKAGE_TYPES['has'](_0x293d6f)) {
    throw new Error("Unsupported project package type: " + _0x293d6f);
  }
  return _0x293d6f;
}
function normalizePackagePath(_0x5d10f4) {
  const _0x159b22 = trimText(_0x5d10f4);
  if (!_0x159b22) {
    throw new Error("Project package path is required");
  }
  if (!a277_0x4f6e2b["isAbsolute"](_0x159b22)) {
    throw new Error("Project package path must be absolute");
  }
  if (a277_0x4f6e2b["extname"](_0x159b22)["toLowerCase"]() !== PROJECT_PACKAGE_FILE_EXTENSION) {
    throw new Error('Only\x20.aicpkg\x20project\x20packages\x20are\x20supported');
  }
  return a277_0x4f6e2b['resolve'](_0x159b22);
}
export function withProjectPackageExtension(_0x30862c) {
  const _0x1b54a8 = trimText(_0x30862c);
  if (!_0x1b54a8) {
    return _0x1b54a8;
  }
  return a277_0x4f6e2b["extname"](_0x1b54a8) ? _0x1b54a8 : '' + _0x1b54a8 + PROJECT_PACKAGE_FILE_EXTENSION;
}
function stripUtf8Bom(_0x1bb80f) {
  return String(_0x1bb80f || '')["replace"](/^\uFEFF/, '');
}
function readJsonFile(_0x28cf92, _0x218e00) {
  let _0xf98b97 = null;
  try {
    _0xf98b97 = JSON["parse"](stripUtf8Bom(readFileSync(_0x28cf92, 'utf8')));
  } catch (_0x51ce2c) {
    throw new Error('Invalid\x20' + (_0x218e00 || 'JSON') + ':\x20' + String(_0x51ce2c?.["message"] || _0x51ce2c));
  }
  if (!isPlainObject(_0xf98b97)) {
    throw new Error((_0x218e00 || 'JSON') + '\x20must\x20be\x20an\x20object');
  }
  return _0xf98b97;
}
function timestampForFilename(_0x14ceed = new Date()) {
  const _0x48b5df = _0x50e35e => String(_0x50e35e)["padStart"](0x2, '0');
  return [_0x14ceed["getFullYear"](), _0x48b5df(_0x14ceed["getMonth"]() + 0x1), _0x48b5df(_0x14ceed["getDate"]()), '-', _0x48b5df(_0x14ceed["getHours"]()), _0x48b5df(_0x14ceed["getMinutes"]()), _0x48b5df(_0x14ceed['getSeconds']())]["join"]('');
}
function safePathSegment(_0x136d89, _0x51b18e = "project") {
  const _0x35ddac = sanitizeProjectName(_0x136d89 || _0x51b18e)['replace'](/[.]+$/g, '')['replace'](/\s+/g, '\x20')["trim"]();
  return _0x35ddac || _0x51b18e;
}
function normalizeArchivePath(_0x205e73) {
  const _0x15dda3 = trimText(_0x205e73)["replace"](/\\/g, '/')["replace"](/^\/+/, '');
  if (!_0x15dda3 || _0x15dda3["includes"]('\x00')) {
    return '';
  }
  if (/^[a-z][a-z0-9+.-]*:/i["test"](_0x15dda3) || /^[a-zA-Z]:\//["test"](_0x15dda3) || _0x15dda3["startsWith"]('//')) {
    return '';
  }
  const _0x45a2a6 = [];
  for (const _0x5dc2aa of _0x15dda3['split']('/')) {
    const _0x1148a4 = _0x5dc2aa["trim"]();
    if (!_0x1148a4 || _0x1148a4 === '.') {
      continue;
    }
    if (_0x1148a4 === '..') {
      return '';
    }
    _0x45a2a6["push"](_0x1148a4);
  }
  return _0x45a2a6["length"] > 0x0 ? _0x45a2a6["join"]('/') : '';
}
function buildAssetArchivePath(_0x3aebf8) {
  const _0x81f23d = normalizeVirtualLocalPath(_0x3aebf8);
  if (!_0x81f23d) {
    return '';
  }
  return "assets/" + _0x81f23d;
}
function findRootDefinition(_0x5bc3d6, _0x2ea218) {
  const _0x31ec05 = normalizeVirtualLocalPath(_0x5bc3d6);
  if (!_0x31ec05) {
    return null;
  }
  for (const _0x3eaf70 of ROOT_DEFINITIONS) {
    if (!_0x31ec05["startsWith"](_0x3eaf70["virtualPrefix"])) {
      continue;
    }
    const _0x3b58ee = trimText(_0x2ea218?.[_0x3eaf70['rootKey']]);
    if (!_0x3b58ee) {
      return null;
    }
    return {
      ..._0x3eaf70,
      'absRoot': a277_0x4f6e2b["resolve"](_0x3b58ee),
      'localPath': _0x31ec05,
      'relPath': _0x31ec05["slice"](_0x3eaf70['virtualPrefix']["length"])
    };
  }
  return null;
}
function clampProgress(_0x2bebfa) {
  const _0x94c034 = Number(_0x2bebfa);
  if (!Number['isFinite'](_0x94c034)) {
    return null;
  }
  return Math["max"](0x0, Math["min"](0x1, _0x94c034));
}
function emitProgress(_0x54ecff, _0x20bd39 = {}) {
  if (typeof _0x54ecff !== "function") {
    return;
  }
  const _0xd0b24 = clampProgress(_0x20bd39["progress"]);
  _0x54ecff({
    'phase': trimText(_0x20bd39["phase"]) || "working",
    'message': trimText(_0x20bd39["message"]),
    'progress': _0xd0b24,
    'current': Number["isFinite"](Number(_0x20bd39["current"])) ? Number(_0x20bd39["current"]) : null,
    'total': Number["isFinite"](Number(_0x20bd39["total"])) ? Number(_0x20bd39["total"]) : null
  });
}
function writeZip(_0x63b93a, _0x2931a9, _0x4df356 = {}) {
  return new Promise((_0x5b831b, _0x51dd24) => {
    const _0x55d4f3 = createWriteStream(_0x2931a9);
    const _0x34a366 = Math['max'](0x1, Number(_0x4df356['estimatedBytes'] || 0x0) || 0x1);
    let _0x2df2fe = 0x0;
    _0x55d4f3["once"]("close", _0x5b831b);
    _0x55d4f3["once"]("error", _0x51dd24);
    _0x63b93a["outputStream"]["once"]('error', _0x51dd24);
    _0x63b93a["outputStream"]['on']('data', _0x3109b5 => {
      _0x2df2fe += Number(_0x3109b5?.["length"] || 0x0) || 0x0;
      const _0x244d81 = Math["min"](0x1, _0x2df2fe / _0x34a366);
      emitProgress(_0x4df356["onProgress"], {
        'phase': "zipping",
        'message': '正在写入项目包...',
        'progress': 0.85 + _0x244d81 * 0.13,
        'current': _0x2df2fe,
        'total': _0x34a366
      });
    });
    _0x63b93a["outputStream"]["pipe"](_0x55d4f3);
    _0x63b93a['end']();
  });
}
function hashFileSha256(_0x4e7214, _0x76b914 = {}) {
  return new Promise((_0x43b992, _0x10b9d4) => {
    const _0x395fa2 = createHash('sha256');
    const _0x43b6b5 = createReadStream(_0x4e7214);
    _0x43b6b5["once"]("error", _0x10b9d4);
    _0x43b6b5['on']("data", _0x506ba6 => {
      _0x395fa2["update"](_0x506ba6);
      typeof _0x76b914["onChunk"] === "function" && _0x76b914["onChunk"](Number(_0x506ba6?.["length"] || 0x0) || 0x0);
    });
    _0x43b6b5["once"]("end", () => _0x43b992(_0x395fa2["digest"]("hex")));
  });
}
function findExistingAssetPath(_0x39dae7, _0x48bf80) {
  const _0x314523 = normalizeVirtualLocalPath(_0x39dae7);
  if (!_0x314523) {
    return null;
  }
  const _0x35df24 = resolveVirtualPathToAbsolute(_0x314523, _0x48bf80);
  if (!_0x35df24 || !existsSync(_0x35df24)) {
    return null;
  }
  const _0x2b9357 = statSync(_0x35df24);
  if (!_0x2b9357["isFile"]()) {
    return null;
  }
  return {
    'localPath': _0x314523,
    'absPath': _0x35df24,
    'size': Number(_0x2b9357["size"] || 0x0)
  };
}
function getRecoverableOriginalVideoFallback(_0x3aeb19, _0x1bf5d5) {
  const _0x574c77 = normalizeVirtualLocalPath(_0x3aeb19);
  const _0x169b61 = "data/assets/original/";
  if (!_0x574c77["startsWith"](_0x169b61)) {
    return null;
  }
  const _0x1bb249 = a277_0x4f6e2b['posix']['parse'](_0x574c77['slice'](_0x169b61["length"]));
  const _0x2fe1ff = _0x1bb249['name'];
  if (!_0x2fe1ff || !VIDEO_EXTENSIONS["has"](_0x1bb249["ext"]["toLowerCase"]())) {
    return null;
  }
  const _0x1d6778 = 'data/assets/derived/video';
  const _0x52a0a3 = [_0x1d6778 + '/' + getVideoPlaybackProxyFilename(_0x2fe1ff), _0x1d6778 + '/' + _0x2fe1ff + ".proxy.mp4", _0x1d6778 + '/' + _0x2fe1ff + ".mp4", _0x1d6778 + '/' + _0x2fe1ff + '.webm', _0x1d6778 + '/' + _0x2fe1ff + '.mov', _0x1d6778 + '/' + _0x2fe1ff + ".m4v", _0x1d6778 + '/' + _0x2fe1ff + ".poster.jpg"];
  for (const _0x465796 of _0x52a0a3) {
    const _0x2765d5 = findExistingAssetPath(_0x465796, _0x1bf5d5);
    if (!_0x2765d5) {
      continue;
    }
    const _0x2b7f7c = a277_0x4f6e2b["extname"](_0x2765d5['localPath'])['toLowerCase']();
    return {
      ..._0x2765d5,
      'canReplaceOriginal': RECOVERABLE_DERIVED_VIDEO_EXTENSIONS["has"](_0x2b7f7c)
    };
  }
  return null;
}
function collectRemoteMediaReferences(_0x5a8b5d, _0x3571bc = [], _0x293267 = new Set()) {
  if (_0x5a8b5d == null || typeof _0x5a8b5d !== 'object') {
    return _0x3571bc;
  }
  if (_0x293267['has'](_0x5a8b5d)) {
    return _0x3571bc;
  }
  _0x293267["add"](_0x5a8b5d);
  if (Array["isArray"](_0x5a8b5d)) {
    for (const _0x3cf38b of _0x5a8b5d) {
      collectRemoteMediaReferences(_0x3cf38b, _0x3571bc, _0x293267);
    }
    return _0x3571bc;
  }
  const _0x3820cd = Object["entries"](_0x5a8b5d);
  const _0x1035f1 = _0x3820cd["some"](([_0x4bb244, _0x25bc89]) => {
    if (!LOCAL_PATH_KEYS["has"](_0x4bb244)) {
      return ![];
    }
    return collectVirtualLocalPathsFromString(_0x25bc89)['length'] > 0x0;
  });
  for (const [_0x306002, _0x469a11] of _0x3820cd) {
    if (URL_KEYS['has'](_0x306002) && typeof _0x469a11 === "string" && /^https?:\/\//i["test"](_0x469a11) && collectVirtualLocalPathsFromString(_0x469a11)['length'] === 0x0 && !_0x1035f1) {
      _0x3571bc["push"]({
        'key': _0x306002,
        'url': _0x469a11
      });
      continue;
    }
    collectRemoteMediaReferences(_0x469a11, _0x3571bc, _0x293267);
  }
  return _0x3571bc;
}
async function buildExportAssets(_0x3f5f46, _0x14f7c4, _0x3c9ea7 = {}) {
  const _0x136f29 = [...collectReferencedLocalPaths(_0x3f5f46)]["sort"]();
  const _0x49dd78 = [];
  const _0xb296dc = [];
  const _0x14606c = [];
  const _0xa39165 = [];
  const _0x3ec78c = new Set(_0x136f29);
  let _0x354383 = 0x0;
  emitProgress(_0x3c9ea7['onProgress'], {
    'phase': "collecting",
    'message': _0x136f29["length"] ? '正在收集本地素材\x200/' + _0x136f29["length"] : "正在检查项目素材...",
    'progress': 0.05,
    'current': 0x0,
    'total': _0x136f29["length"]
  });
  for (let _0x37bd07 = 0x0; _0x37bd07 < _0x136f29['length']; _0x37bd07 += 0x1) {
    const _0x5e6c53 = _0x136f29[_0x37bd07];
    const _0x3c77b6 = buildAssetArchivePath(_0x5e6c53);
    const _0x39f028 = resolveVirtualPathToAbsolute(_0x5e6c53, _0x14f7c4);
    if (!_0x3c77b6 || !_0x39f028 || !existsSync(_0x39f028)) {
      const _0x1a8cff = getRecoverableOriginalVideoFallback(_0x5e6c53, _0x14f7c4);
      if (_0x1a8cff) {
        _0xa39165['push']({
          'type': "missing-original-video-fallback",
          'localPath': _0x5e6c53,
          'fallbackLocalPath': _0x1a8cff['localPath'],
          'canReplaceOriginal': _0x1a8cff["canReplaceOriginal"]
        });
        !_0x3ec78c["has"](_0x1a8cff["localPath"]) && (_0x3ec78c["add"](_0x1a8cff["localPath"]), _0x136f29["push"](_0x1a8cff["localPath"]));
        continue;
      }
      _0x14606c['push'](_0x5e6c53);
      continue;
    }
    const _0x2086ce = statSync(_0x39f028);
    if (!_0x2086ce["isFile"]()) {
      _0x14606c['push'](_0x5e6c53);
      continue;
    }
    _0x49dd78["push"]({
      'localPath': _0x5e6c53,
      'archivePath': _0x3c77b6,
      'absPath': _0x39f028,
      'size': Number(_0x2086ce["size"] || 0x0)
    });
    emitProgress(_0x3c9ea7["onProgress"], {
      'phase': "collecting",
      'message': "正在收集本地素材 " + (_0x37bd07 + 0x1) + '/' + _0x136f29['length'],
      'progress': 0.05 + (_0x37bd07 + 0x1) / Math["max"](0x1, _0x136f29['length']) * 0.2,
      'current': _0x37bd07 + 0x1,
      'total': _0x136f29['length']
    });
  }
  const _0xd7bd9a = _0x49dd78["reduce"]((_0x167158, _0x2a237e) => _0x167158 + Number(_0x2a237e["size"] || 0x0), 0x0);
  for (let _0x146ec7 = 0x0; _0x146ec7 < _0x49dd78['length']; _0x146ec7 += 0x1) {
    const _0x2c1862 = _0x49dd78[_0x146ec7];
    _0xb296dc['push']({
      ..._0x2c1862,
      'sha256': await hashFileSha256(_0x2c1862["absPath"], {
        'onChunk': _0x446174 => {
          _0x354383 += _0x446174;
          emitProgress(_0x3c9ea7["onProgress"], {
            'phase': "hashing",
            'message': "正在校验素材 " + (_0x146ec7 + 0x1) + '/' + _0x49dd78["length"],
            'progress': 0.25 + _0x354383 / Math['max'](0x1, _0xd7bd9a) * 0.5,
            'current': _0x354383,
            'total': _0xd7bd9a
          });
        }
      })
    });
  }
  return {
    'assets': _0xb296dc,
    'missing': _0x14606c,
    'warnings': _0xa39165
  };
}
export async function exportProjectPackageToPath({
  outputPath: _0x37c833,
  multiData: _0x49de32,
  projectData: _0x179c87,
  projectType = PROJECT_PACKAGE_TYPE_CANVAS,
  projectId = '',
  projectName = '',
  appVersion = '',
  roots: _0x28e868,
  now = new Date(),
  onProgress: _0x5b0413
} = {}) {
  const _0x2f38d2 = a277_0x4f6e2b["resolve"](withProjectPackageExtension(_0x37c833));
  if (a277_0x4f6e2b["extname"](_0x2f38d2)['toLowerCase']() !== PROJECT_PACKAGE_FILE_EXTENSION) {
    throw new Error("Project package output path must end with .aicpkg");
  }
  emitProgress(_0x5b0413, {
    'phase': "preparing",
    'message': '正在准备项目包...',
    'progress': 0.02
  });
  const _0x464fa4 = normalizeProjectPackageType(projectType);
  const _0x2421a0 = _0x464fa4 === PROJECT_PACKAGE_TYPE_CANVAS;
  const _0x5ebc97 = _0x2421a0 ? buildProjectFilePayload(_0x49de32 || {}) : _0x179c87;
  if (!isPlainObject(_0x5ebc97)) {
    throw new Error("Workspace project package data must be an object");
  }
  const _0x4d4360 = collectRemoteMediaReferences(_0x5ebc97);
  if (_0x4d4360["length"] > 0x0) {
    const _0x4ff631 = new Error("Project package export blocked: remote media must be saved locally first");
    _0x4ff631["code"] = 'REMOTE_MEDIA_NOT_LOCALIZED';
    _0x4ff631['remoteMedia'] = _0x4d4360["slice"](0x0, 0x14);
    throw _0x4ff631;
  }
  const {
    assets: _0x20c647,
    missing: _0x53db9a,
    warnings: _0x420fac
  } = await buildExportAssets(_0x5ebc97, _0x28e868 || {}, {
    'onProgress': _0x5b0413
  });
  if (_0x53db9a["length"] > 0x0) {
    const _0x5c205a = new Error("Project package export blocked: missing local assets");
    _0x5c205a["code"] = 'MISSING_LOCAL_ASSETS';
    _0x5c205a["missing"] = _0x53db9a;
    throw _0x5c205a;
  }
  const _0x567f1d = _0x20c647['map'](({
    absPath: _0x17fe46,
    ..._0x4e8193
  }) => _0x4e8193);
  const _0x5ec97a = _0x2421a0 ? PROJECT_PACKAGE_PROJECT_FILE : WORKSPACE_PROJECT_PACKAGE_PROJECT_FILE;
  const _0x2092dd = {
    'schemaVersion': _0x2421a0 ? PROJECT_PACKAGE_SCHEMA_VERSION : WORKSPACE_PROJECT_PACKAGE_SCHEMA_VERSION,
    'packageKind': PROJECT_PACKAGE_KIND,
    'exportedAt': now["toISOString"](),
    'appVersion': trimText(appVersion),
    'project': {
      ...(_0x2421a0 ? {} : {
        'type': _0x464fa4
      }),
      'projectId': trimText(projectId),
      'projectName': safePathSegment(projectName || projectId || (_0x2421a0 ? "未命名画布" : "未命名项目"), _0x2421a0 ? '未命名画布' : "未命名项目")
    },
    'projectFile': _0x5ec97a,
    'assets': _0x567f1d,
    'warnings': _0x420fac
  };
  mkdirSync(a277_0x4f6e2b['dirname'](_0x2f38d2), {
    'recursive': !![]
  });
  const _0x2caaa6 = new a277_0x4846df["ZipFile"]();
  const _0x3e3809 = Buffer["from"](JSON["stringify"](_0x2092dd, null, 0x2) + '\x0a', 'utf8');
  const _0x4f4212 = Buffer["from"](JSON["stringify"](_0x5ebc97, null, 0x2) + '\x0a', 'utf8');
  _0x2caaa6["addBuffer"](_0x3e3809, PROJECT_PACKAGE_MANIFEST_NAME);
  _0x2caaa6['addBuffer'](_0x4f4212, _0x5ec97a);
  for (const _0x2e1465 of _0x20c647) {
    _0x2caaa6["addFile"](_0x2e1465["absPath"], _0x2e1465["archivePath"]);
  }
  emitProgress(_0x5b0413, {
    'phase': "zipping",
    'message': '正在写入项目包...',
    'progress': 0.85,
    'current': 0x0,
    'total': _0x20c647["length"]
  });
  await writeZip(_0x2caaa6, _0x2f38d2, {
    'onProgress': _0x5b0413,
    'estimatedBytes': _0x3e3809["length"] + _0x4f4212["length"] + _0x20c647["reduce"]((_0x350ad5, _0x513bf0) => _0x350ad5 + Number(_0x513bf0["size"] || 0x0), 0x0)
  });
  emitProgress(_0x5b0413, {
    'phase': "done",
    'message': "项目包收集完成",
    'progress': 0x1,
    'current': _0x20c647['length'],
    'total': _0x20c647["length"]
  });
  return {
    'success': !![],
    'canceled': ![],
    'path': _0x2f38d2,
    'filename': a277_0x4f6e2b['basename'](_0x2f38d2),
    'assetsCount': _0x20c647["length"],
    'projectType': _0x464fa4,
    'warnings': _0x2092dd["warnings"]
  };
}
function assertImportPackageSize(_0x2f6a76, _0x3ee1e4) {
  const _0x18d4c8 = statSync(_0x2f6a76);
  if (!_0x18d4c8["isFile"]()) {
    throw new Error("Project package path is not a file");
  }
  const _0x4835fa = Number(_0x3ee1e4 || DEFAULT_MAX_IMPORT_PACKAGE_BYTES);
  if (Number(_0x18d4c8["size"] || 0x0) > _0x4835fa) {
    throw new Error("Project package is too large");
  }
}
function assertPackageManifest(_0x3a5e26) {
  if (!isPlainObject(_0x3a5e26)) {
    throw new Error('Invalid\x20project\x20package\x20manifest');
  }
  const _0x48f137 = Number(_0x3a5e26["schemaVersion"]);
  if (_0x48f137 !== PROJECT_PACKAGE_SCHEMA_VERSION && _0x48f137 !== WORKSPACE_PROJECT_PACKAGE_SCHEMA_VERSION) {
    throw new Error('Unsupported\x20project\x20package\x20schemaVersion');
  }
  if (_0x3a5e26["packageKind"] !== PROJECT_PACKAGE_KIND) {
    throw new Error('Invalid\x20project\x20package\x20kind');
  }
  const _0x1c5ec6 = _0x48f137 === PROJECT_PACKAGE_SCHEMA_VERSION ? PROJECT_PACKAGE_TYPE_CANVAS : normalizeProjectPackageType(_0x3a5e26["project"]?.["type"]);
  const _0x2d5fd9 = normalizeArchivePath(_0x3a5e26["projectFile"]);
  const _0x3c2615 = _0x1c5ec6 === PROJECT_PACKAGE_TYPE_CANVAS ? PROJECT_PACKAGE_PROJECT_FILE : WORKSPACE_PROJECT_PACKAGE_PROJECT_FILE;
  if (_0x2d5fd9 !== _0x3c2615) {
    throw new Error("Invalid project package projectFile");
  }
  if (!Array["isArray"](_0x3a5e26["assets"])) {
    throw new Error('Invalid\x20project\x20package\x20assets');
  }
  return {
    'projectFile': _0x2d5fd9,
    'projectType': _0x1c5ec6,
    'schemaVersion': _0x48f137
  };
}
function assertArchivePathInsideTemp(_0x5a3fdc, _0x3c7ea1) {
  const _0x30e9af = normalizeArchivePath(_0x3c7ea1);
  if (!_0x30e9af) {
    return '';
  }
  const _0x3674f5 = a277_0x4f6e2b["resolve"](_0x5a3fdc, ..._0x30e9af["split"]('/'));
  return isPathInside(_0x3674f5, _0x5a3fdc) ? _0x3674f5 : '';
}
function allocateUniqueFilePath(_0x5013b1) {
  if (!existsSync(_0x5013b1)) {
    return _0x5013b1;
  }
  const _0x2c755c = a277_0x4f6e2b["dirname"](_0x5013b1);
  const _0x4af4bc = a277_0x4f6e2b["parse"](_0x5013b1);
  for (let _0x5b8153 = 0x2; _0x5b8153 < 0x3e8; _0x5b8153 += 0x1) {
    const _0x82d9ab = a277_0x4f6e2b["join"](_0x2c755c, _0x4af4bc['name'] + '\x20(' + _0x5b8153 + ')' + _0x4af4bc["ext"]);
    if (!existsSync(_0x82d9ab)) {
      return _0x82d9ab;
    }
  }
  throw new Error("Unable to allocate unique import file path");
}
function allocateImportedAssetTarget(_0x14fb3d, _0x3e4847, _0x42ab15) {
  const _0x15404b = findRootDefinition(_0x14fb3d, _0x3e4847);
  if (!_0x15404b) {
    throw new Error('Unsupported\x20local\x20asset\x20path:\x20' + _0x14fb3d);
  }
  const _0x51c95a = _0x15404b["relPath"]['split']('/')["filter"](Boolean);
  const _0x37bbd4 = [IMPORT_DIR_ROOT, _0x42ab15, ..._0x51c95a]["join"]('/');
  const _0x26a472 = allocateUniqueFilePath(a277_0x4f6e2b["resolve"](_0x15404b["absRoot"], ..._0x37bbd4['split']('/')));
  if (!isPathInside(_0x26a472, _0x15404b["absRoot"])) {
    throw new Error('Invalid\x20imported\x20asset\x20target:\x20' + _0x14fb3d);
  }
  const _0x278226 = a277_0x4f6e2b['relative'](_0x15404b["absRoot"], _0x26a472)["replace"](/\\/g, '/');
  return {
    'absPath': _0x26a472,
    'localPath': '' + _0x15404b["virtualPrefix"] + _0x278226
  };
}
function isUrlLikeKey(_0x225270) {
  return URL_KEYS["has"](String(_0x225270 || ''));
}
function rewriteStringLocalReferences(_0x3eb9b9, _0xc89eab, _0x363c8b = '') {
  const _0x134167 = String(_0x3eb9b9 || '')["split"]('|');
  const _0x2b9802 = _0x134167["map"](_0x457b5d => {
    const _0x160d77 = normalizeVirtualLocalPath(_0x457b5d);
    const _0x450208 = _0x160d77 ? _0xc89eab["get"](_0x160d77) : '';
    if (!_0x450208) {
      return _0x457b5d;
    }
    const _0x219bf4 = _0x457b5d["trim"]();
    if (LOCAL_PATH_KEYS["has"](_0x363c8b)) {
      return _0x450208;
    }
    if (isUrlLikeKey(_0x363c8b) || /^https?:\/\//i['test'](_0x219bf4) || _0x219bf4["startsWith"]('/')) {
      return '/' + _0x450208;
    }
    return _0x450208;
  });
  return _0x2b9802["join"]('|');
}
function rewriteProjectLocalReferences(_0xecd0eb, _0x4c4ee3, _0x33b1fe = '') {
  if (typeof _0xecd0eb === "string") {
    const _0x26401f = collectVirtualLocalPathsFromString(_0xecd0eb);
    if (!_0x26401f["some"](_0x252066 => _0x4c4ee3["has"](_0x252066))) {
      return _0xecd0eb;
    }
    return rewriteStringLocalReferences(_0xecd0eb, _0x4c4ee3, _0x33b1fe);
  }
  if (Array["isArray"](_0xecd0eb)) {
    return _0xecd0eb['map'](_0x130e1d => rewriteProjectLocalReferences(_0x130e1d, _0x4c4ee3, _0x33b1fe));
  }
  if (!isPlainObject(_0xecd0eb)) {
    return _0xecd0eb;
  }
  const _0x4a9b42 = {};
  for (const [_0xc3a304, _0x440f85] of Object['entries'](_0xecd0eb)) {
    _0x4a9b42[_0xc3a304] = rewriteProjectLocalReferences(_0x440f85, _0x4c4ee3, _0xc3a304);
  }
  return _0x4a9b42;
}
function allocateUniqueProjectPath(_0x431519, _0x4c786) {
  const _0x27e0d3 = a277_0x4f6e2b["resolve"](trimText(_0x431519));
  mkdirSync(_0x27e0d3, {
    'recursive': !![]
  });
  const _0x353996 = safePathSegment((_0x4c786 || "未命名画布") + '\x20-\x20导入', "imported-project");
  const _0x2bfa59 = a277_0x4f6e2b["join"](_0x27e0d3, _0x353996 + '.aicanvas');
  if (!existsSync(_0x2bfa59)) {
    return _0x2bfa59;
  }
  for (let _0x4a389f = 0x2; _0x4a389f < 0x3e8; _0x4a389f += 0x1) {
    const _0x1045de = a277_0x4f6e2b["join"](_0x27e0d3, _0x353996 + '\x20(' + _0x4a389f + ").aicanvas");
    if (!existsSync(_0x1045de)) {
      return _0x1045de;
    }
  }
  throw new Error("Unable to allocate imported project file path");
}
function importDirNameForProject(_0x38b288, _0x4adc64 = new Date()) {
  return safePathSegment((_0x38b288 || "Project") + '-' + timestampForFilename(_0x4adc64), 'Project');
}
function validateImportAssets(_0x3c62f6, _0xf2948c, _0x3f6952, _0x2c9465 = {}) {
  const _0x298f6f = Number(_0x2c9465['maxAssetBytes'] || DEFAULT_MAX_IMPORT_ASSET_BYTES);
  const _0x5332d6 = [];
  const _0x552e7d = new Set();
  for (const _0x3c1828 of _0x3c62f6['assets']) {
    if (!isPlainObject(_0x3c1828)) {
      throw new Error("Invalid project package asset");
    }
    const _0x4b79e8 = normalizeVirtualLocalPath(_0x3c1828["localPath"]);
    const _0x816ef7 = normalizeArchivePath(_0x3c1828["archivePath"]);
    if (!_0x4b79e8 || String(_0x3c1828['localPath'] || '')["replace"](/\\/g, '/')["replace"](/^\/+/, '') !== _0x4b79e8) {
      throw new Error('Invalid\x20project\x20package\x20asset\x20localPath');
    }
    if (!_0x816ef7 || !_0x816ef7['startsWith']("assets/")) {
      throw new Error('Invalid\x20project\x20package\x20asset\x20path');
    }
    if (_0x552e7d["has"](_0x4b79e8)) {
      continue;
    }
    _0x552e7d['add'](_0x4b79e8);
    const _0xee3f59 = assertArchivePathInsideTemp(_0xf2948c, _0x816ef7);
    if (!_0xee3f59 || !existsSync(_0xee3f59)) {
      throw new Error("Project package asset is missing: " + _0x4b79e8);
    }
    const _0x51b35c = statSync(_0xee3f59);
    if (!_0x51b35c["isFile"]()) {
      throw new Error("Project package asset is not a file: " + _0x4b79e8);
    }
    const _0x84de63 = Number(_0x51b35c["size"] || 0x0);
    if (_0x84de63 > _0x298f6f) {
      throw new Error("Project package asset is too large");
    }
    const _0x33813b = Number(_0x3c1828["size"] || 0x0) || 0x0;
    if (_0x33813b > 0x0 && _0x33813b !== _0x84de63) {
      throw new Error("Project package asset size mismatch: " + _0x4b79e8);
    }
    if (!findRootDefinition(_0x4b79e8, _0x3f6952)) {
      throw new Error("Unsupported project package asset localPath: " + _0x4b79e8);
    }
    const _0x3e8b29 = trimText(_0x3c1828['sha256'])["toLowerCase"]();
    if (_0x3e8b29 && !/^[a-f0-9]{64}$/["test"](_0x3e8b29)) {
      throw new Error("Invalid project package asset sha256: " + _0x4b79e8);
    }
    _0x5332d6["push"]({
      'localPath': _0x4b79e8,
      'archivePath': _0x816ef7,
      'absPath': _0xee3f59,
      'size': _0x84de63,
      'sha256': _0x3e8b29
    });
  }
  return _0x5332d6;
}
export async function importProjectPackageFromPath({
  packagePath: _0xd861d1,
  roots: _0x4ba7f8,
  projectRoot: _0x1db46b,
  tempRoot = a277_0x3f71fc["tmpdir"](),
  now = new Date(),
  maxPackageBytes = DEFAULT_MAX_IMPORT_PACKAGE_BYTES,
  maxAssetBytes = DEFAULT_MAX_IMPORT_ASSET_BYTES,
  onProgress: _0x2379a0
} = {}) {
  const _0x45ab76 = normalizePackagePath(_0xd861d1);
  assertImportPackageSize(_0x45ab76, maxPackageBytes);
  const _0x321318 = a277_0x4f6e2b["resolve"](tempRoot || a277_0x3f71fc["tmpdir"]());
  mkdirSync(_0x321318, {
    'recursive': !![]
  });
  const _0x26d86d = mkdtempSync(a277_0x4f6e2b['join'](_0x321318, "aicpkg-"));
  try {
    await a277_0x403902(_0x45ab76, {
      'dir': _0x26d86d
    });
    const _0x47bfae = a277_0x4f6e2b['join'](_0x26d86d, PROJECT_PACKAGE_MANIFEST_NAME);
    if (!existsSync(_0x47bfae)) {
      throw new Error('Project\x20package\x20manifest\x20is\x20missing');
    }
    const _0xc72550 = readJsonFile(_0x47bfae, 'project\x20package\x20manifest');
    const _0x499e9a = assertPackageManifest(_0xc72550);
    const _0x223b6f = assertArchivePathInsideTemp(_0x26d86d, _0x499e9a["projectFile"]);
    if (!_0x223b6f || !existsSync(_0x223b6f)) {
      throw new Error("Project package project file is missing");
    }
    const _0x3d0a11 = readJsonFile(_0x223b6f, "project package project file");
    const _0x37fe81 = safePathSegment(_0xc72550['project']?.["projectName"] || _0xc72550["project"]?.["projectId"] || a277_0x4f6e2b["basename"](_0x45ab76, PROJECT_PACKAGE_FILE_EXTENSION), "Imported Project");
    const _0x346816 = importDirNameForProject(_0x37fe81, now);
    const _0x58101e = validateImportAssets(_0xc72550, _0x26d86d, _0x4ba7f8 || {}, {
      'maxAssetBytes': maxAssetBytes
    });
    for (let _0x3b4095 = 0x0; _0x3b4095 < _0x58101e["length"]; _0x3b4095 += 0x1) {
      const _0x17e0e0 = _0x58101e[_0x3b4095];
      if (_0x17e0e0["sha256"]) {
        const _0x13764e = await hashFileSha256(_0x17e0e0['absPath']);
        if (_0x13764e !== _0x17e0e0["sha256"]) {
          throw new Error("Project package asset checksum mismatch: " + _0x17e0e0["localPath"]);
        }
      }
      emitProgress(_0x2379a0, {
        'phase': "verifying",
        'message': "正在校验素材 " + (_0x3b4095 + 0x1) + '/' + _0x58101e["length"],
        'progress': 0.1 + (_0x3b4095 + 0x1) / Math["max"](0x1, _0x58101e["length"]) * 0.35,
        'current': _0x3b4095 + 0x1,
        'total': _0x58101e['length']
      });
    }
    const _0x20ec56 = new Map();
    const _0x3879c0 = _0x58101e["map"](_0x3fe8f8 => {
      const _0x11f7e3 = allocateImportedAssetTarget(_0x3fe8f8['localPath'], _0x4ba7f8 || {}, _0x346816);
      _0x20ec56["set"](_0x3fe8f8["localPath"], _0x11f7e3['localPath']);
      return {
        'from': _0x3fe8f8["absPath"],
        'to': _0x11f7e3['absPath']
      };
    });
    for (const _0x37dec7 of _0x3879c0) {
      mkdirSync(a277_0x4f6e2b['dirname'](_0x37dec7['to']), {
        'recursive': !![]
      });
      copyFileSync(_0x37dec7["from"], _0x37dec7['to']);
    }
    const _0x275e7b = rewriteProjectLocalReferences(_0x3d0a11, _0x20ec56);
    if (_0x499e9a['projectType'] !== PROJECT_PACKAGE_TYPE_CANVAS) {
      emitProgress(_0x2379a0, {
        'phase': "done",
        'message': '项目包导入完成',
        'progress': 0x1,
        'current': _0x58101e['length'],
        'total': _0x58101e["length"]
      });
      return {
        'success': !![],
        'canceled': ![],
        'projectType': _0x499e9a["projectType"],
        'projectId': trimText(_0xc72550["project"]?.["projectId"]),
        'projectName': _0x37fe81,
        'projectData': _0x275e7b,
        'data': _0x275e7b,
        'assetsCount': _0x58101e["length"],
        'sourcePackagePath': _0x45ab76
      };
    }
    const _0x506c86 = allocateUniqueProjectPath(_0x1db46b, _0x37fe81);
    writeProjectJson(_0x506c86, _0x275e7b);
    emitProgress(_0x2379a0, {
      'phase': "done",
      'message': "项目包导入完成",
      'progress': 0x1,
      'current': _0x58101e['length'],
      'total': _0x58101e["length"]
    });
    return {
      'success': !![],
      'canceled': ![],
      'projectPath': _0x506c86,
      'projectName': _0x37fe81 + " - 导入",
      'filename': a277_0x4f6e2b["basename"](_0x506c86),
      'projectType': PROJECT_PACKAGE_TYPE_CANVAS,
      'data': _0x275e7b,
      'assetsCount': _0x58101e["length"],
      'sourcePackagePath': _0x45ab76
    };
  } finally {
    rmSync(_0x26d86d, {
      'recursive': !![],
      'force': !![]
    });
  }
}
export const projectPackageInternals = {
  'collectRemoteMediaReferences': collectRemoteMediaReferences,
  'rewriteProjectLocalReferences': rewriteProjectLocalReferences,
  'normalizeArchivePath': normalizeArchivePath,
  'allocateImportedAssetTarget': allocateImportedAssetTarget,
  'normalizeProjectPackageType': normalizeProjectPackageType
};