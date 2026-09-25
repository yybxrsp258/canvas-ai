import a272_0xbc2429 from 'node:path';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { rename, rm, writeFile } from 'node:fs/promises';
import { createTimelineExportOperation } from './timelineExport/timelineExportOperation.js';
import { createOpenJianyingOperation } from './timelineExport/jianyingExportAction.js';
import { defaultNodeExportZipName, exportNodeItemsToZip, NODE_EXPORT_FILE_EXTENSION, saveNodeMediaToFile, withNodeExportZipExtension } from './nodeExportService.js';
const MEDIA_DEFAULT_EXTENSIONS = Object["freeze"]({
  'image': "png",
  'video': "mp4",
  'audio': "mp3"
});
const MEDIA_DIALOG_TITLES = Object["freeze"]({
  'image': "保存图片",
  'video': "保存视频",
  'audio': "保存音频"
});
const MAX_TEXT_FILE_BYTES = 0x10 * 0x400 * 0x400;
const MAX_MEDIA_FILES = 0x1f4;
const NODE_EXPORT_STATE_FILENAME = "node-export-state.json";
function getDialogFilters() {
  return [{
    'name': 'ZIP\x20Archive',
    'extensions': [NODE_EXPORT_FILE_EXTENSION["replace"](/^\./, '')]
  }];
}
function trimText(_0xd199b) {
  return String(_0xd199b || '')["trim"]();
}
function firstNonEmpty(..._0x1fd6ab) {
  for (const _0x36dadd of _0x1fd6ab) {
    const _0x500929 = trimText(_0x36dadd);
    if (_0x500929) {
      return _0x500929;
    }
  }
  return '';
}
function assertAbsolutePath(_0x5b75cc, _0x2cc19f) {
  const _0x53fc8f = trimText(_0x5b75cc);
  if (!_0x53fc8f) {
    return '';
  }
  if (!a272_0xbc2429['isAbsolute'](_0x53fc8f)) {
    throw new Error(_0x2cc19f + " must be an absolute path");
  }
  return a272_0xbc2429["resolve"](_0x53fc8f);
}
function assertFilename(_0x30a2d3) {
  const _0x3f1aa6 = trimText(_0x30a2d3);
  if (!_0x3f1aa6) {
    return '';
  }
  if (_0x3f1aa6["includes"]('/') || _0x3f1aa6["includes"]('\x5c') || a272_0xbc2429["basename"](_0x3f1aa6) !== _0x3f1aa6) {
    throw new Error("Export filename must not include path separators");
  }
  return withNodeExportZipExtension(_0x3f1aa6);
}
function sanitizeMediaFilename(_0x3ad130, _0x6fae14) {
  const _0x2a4d26 = (_0x6fae14 || "media") + '.' + (MEDIA_DEFAULT_EXTENSIONS[_0x6fae14] || "bin");
  const _0x254533 = trimText(_0x3ad130)["replace"](/[\\/:*?"<>|\x00-\x1F]/g, '_')["replace"](/[. ]+$/g, '')["slice"](0x0, 0xa0)["trim"]();
  const _0x2dfd22 = _0x254533 || _0x2a4d26;
  return a272_0xbc2429["extname"](_0x2dfd22) ? _0x2dfd22 : _0x2dfd22 + '.' + (MEDIA_DEFAULT_EXTENSIONS[_0x6fae14] || "bin");
}
function sanitizeTextFilename(_0x4dadb2) {
  const _0x478ff1 = trimText(_0x4dadb2)["replace"](/[\\/:*?"<>|\x00-\x1F]/g, '_')['replace'](/[. ]+$/g, '')['slice'](0x0, 0xa0)['trim']();
  return _0x478ff1 || 'export.txt';
}
function getFilenameExtension(_0x40675b, _0x49275d = 'txt') {
  return a272_0xbc2429["extname"](_0x40675b)["replace"](/^\./, '')["toLowerCase"]() || _0x49275d;
}
function getMediaDialogFilters(_0x2beb4c, _0x43a478) {
  const _0x3c86e9 = a272_0xbc2429["extname"](_0x43a478)["replace"](/^\./, '')["toLowerCase"]() || MEDIA_DEFAULT_EXTENSIONS[_0x2beb4c] || "bin";
  return [{
    'name': MEDIA_DIALOG_TITLES[_0x2beb4c] || "媒体文件",
    'extensions': [_0x3c86e9]
  }];
}
function ensureDirectory(_0x385633) {
  mkdirSync(_0x385633, {
    'recursive': !![]
  });
  const _0x391a68 = statSync(_0x385633);
  if (!_0x391a68['isDirectory']()) {
    throw new Error('Export\x20directory\x20is\x20not\x20a\x20directory');
  }
}
function showSaveDialog(_0x52580c, _0x296053, _0x349185) {
  return _0x296053 ? _0x52580c["showSaveDialog"](_0x296053, _0x349185) : _0x52580c["showSaveDialog"](_0x349185);
}
function showOpenDialog(_0x50c9c2, _0x4d4f6c, _0x1360b0) {
  return _0x4d4f6c ? _0x50c9c2['showOpenDialog'](_0x4d4f6c, _0x1360b0) : _0x50c9c2["showOpenDialog"](_0x1360b0);
}
async function writeUtf8FileAtomic(_0x121496, _0x288b9f) {
  const _0x58b884 = a272_0xbc2429["resolve"](_0x121496);
  mkdirSync(a272_0xbc2429['dirname'](_0x58b884), {
    'recursive': !![]
  });
  const _0x149bfc = a272_0xbc2429["join"](a272_0xbc2429['dirname'](_0x58b884), '.' + a272_0xbc2429["basename"](_0x58b884) + '.' + process["pid"] + '-' + Date["now"]() + '-' + Math["random"]()['toString'](0x24)['slice'](0x2) + ".part");
  try {
    await writeFile(_0x149bfc, _0x288b9f, {
      'encoding': "utf8",
      'flag': 'wx'
    });
    await rm(_0x58b884, {
      'force': !![]
    });
    await rename(_0x149bfc, _0x58b884);
  } finally {
    await rm(_0x149bfc, {
      'force': !![]
    })["catch"](() => {});
  }
  return _0x58b884;
}
function uniqueMediaOutputPath(_0x9c6c6e, _0x333a26, _0x4b275c) {
  const _0x5ddd69 = a272_0xbc2429["extname"](_0x333a26);
  const _0x109642 = _0x5ddd69 ? _0x333a26["slice"](0x0, -_0x5ddd69["length"]) : _0x333a26;
  let _0x3893cc = 0x1;
  let _0x385473 = a272_0xbc2429["join"](_0x9c6c6e, _0x333a26);
  while (existsSync(_0x385473) || _0x4b275c["has"](_0x385473["toLowerCase"]())) {
    _0x3893cc += 0x1;
    _0x385473 = a272_0xbc2429["join"](_0x9c6c6e, _0x109642 + '\x20(' + _0x3893cc + ')' + _0x5ddd69);
  }
  _0x4b275c['add'](_0x385473["toLowerCase"]());
  return _0x385473;
}
export function createNodeExportController({
  app: _0x17c5e3,
  dialog: _0x1d8f58,
  getMainWindow = () => null,
  resolveLocalVirtualPath: _0xe954e4,
  getRuntimeToolOrFallback: _0x551639,
  showSaveDialog: _0x2a51f2,
  showOpenDialog: _0xd74f74,
  openPath: _0x4fa524,
  fetchImpl = globalThis['fetch']
} = {}) {
  const _0x59f097 = _0x489bfb => typeof _0x2a51f2 === "function" ? _0x2a51f2(_0x489bfb) : showSaveDialog(_0x1d8f58, getMainWindow(), _0x489bfb);
  const _0x59edb6 = _0x471004 => typeof _0xd74f74 === "function" ? _0xd74f74(_0x471004) : showOpenDialog(_0x1d8f58, getMainWindow(), _0x471004);
  const _0x46d6cf = () => {
    let _0xe02e46 = '';
    try {
      _0xe02e46 = _0x17c5e3["getPath"]("downloads");
    } catch {}
    let _0x1c32f6 = '';
    try {
      _0x1c32f6 = _0x17c5e3["getPath"]("temp");
    } catch {}
    return _0xe02e46 || _0x1c32f6 || process["cwd"]();
  };
  const _0x12b946 = () => a272_0xbc2429["join"](_0x46d6cf(), defaultNodeExportZipName());
  let _0x28072a = '';
  let _0x3b5c1f = ![];
  const _0x41bd77 = () => {
    try {
      return a272_0xbc2429["join"](_0x17c5e3["getPath"]("userData"), NODE_EXPORT_STATE_FILENAME);
    } catch {
      return '';
    }
  };
  const _0x3835f7 = () => {
    if (!_0x3b5c1f) {
      _0x3b5c1f = !![];
      const _0x33783a = _0x41bd77();
      if (_0x33783a && existsSync(_0x33783a)) {
        try {
          const _0x470fee = JSON["parse"](readFileSync(_0x33783a, "utf8"));
          const _0xed6222 = assertAbsolutePath(_0x470fee?.["lastMediaExportDirectory"], 'Remembered\x20media\x20export\x20directory');
          _0xed6222 && statSync(_0xed6222)["isDirectory"]() && (_0x28072a = _0xed6222);
        } catch {}
      }
    }
    return _0x28072a || _0x46d6cf();
  };
  const _0x5a13ea = async _0xd84b66 => {
    const _0x484936 = assertAbsolutePath(_0xd84b66, "Media export directory");
    if (!_0x484936) {
      return;
    }
    _0x28072a = _0x484936;
    _0x3b5c1f = !![];
    const _0xe01bb7 = _0x41bd77();
    if (!_0xe01bb7) {
      return;
    }
    try {
      await writeUtf8FileAtomic(_0xe01bb7, JSON["stringify"]({
        'lastMediaExportDirectory': _0x484936
      }, null, 0x2) + '\x0a');
    } catch {}
  };
  const _0x32a9a8 = (_0x2a8e54 = {}) => {
    const _0xcd5c33 = firstNonEmpty(_0x2a8e54?.["outputPath"], _0x2a8e54?.["filePath"], _0x2a8e54?.["path"]);
    if (_0xcd5c33) {
      return withNodeExportZipExtension(assertAbsolutePath(_0xcd5c33, "Export outputPath"));
    }
    const _0x421739 = firstNonEmpty(_0x2a8e54?.["directory"], _0x2a8e54?.["downloadDir"], _0x2a8e54?.['targetDir'], _0x2a8e54?.["destinationDirectory"]);
    if (!_0x421739) {
      return '';
    }
    const _0x678c20 = assertAbsolutePath(_0x421739, 'Export\x20directory');
    ensureDirectory(_0x678c20);
    const _0x5abc8b = assertFilename(_0x2a8e54?.['filename'] || _0x2a8e54?.["fileName"]) || defaultNodeExportZipName();
    return a272_0xbc2429['join'](_0x678c20, _0x5abc8b);
  };
  const _0x2cd5c2 = async (_0x3e0f43 = {}) => {
    let _0x44c782 = _0x32a9a8(_0x3e0f43);
    if (!_0x44c782) {
      const _0x1eb7e2 = await _0x59f097({
        'title': '批量下载节点',
        'defaultPath': _0x12b946(),
        'filters': getDialogFilters()
      });
      if (_0x1eb7e2["canceled"] || !_0x1eb7e2["filePath"]) {
        return {
          'success': ![],
          'canceled': !![]
        };
      }
      _0x44c782 = withNodeExportZipExtension(_0x1eb7e2["filePath"]);
    }
    let _0x418b73 = '';
    try {
      _0x418b73 = _0x17c5e3["getPath"]("temp");
    } catch {}
    return await exportNodeItemsToZip({
      'outputPath': _0x44c782,
      'items': _0x3e0f43?.['items'] || [],
      'resolveLocalVirtualPath': _0xe954e4,
      'tempRoot': _0x418b73
    });
  };
  const _0x111668 = async (_0x3b7d69 = {}) => {
    const _0x134f64 = trimText(_0x3b7d69?.["kind"])["toLowerCase"]();
    if (!Object["prototype"]["hasOwnProperty"]["call"](MEDIA_DEFAULT_EXTENSIONS, _0x134f64)) {
      throw new Error('Unsupported\x20media\x20kind');
    }
    const _0x11b264 = sanitizeMediaFilename(_0x3b7d69?.["filename"] || _0x3b7d69?.["fileName"], _0x134f64);
    const _0x1bf17b = await _0x59f097({
      'title': MEDIA_DIALOG_TITLES[_0x134f64],
      'defaultPath': a272_0xbc2429['join'](_0x3835f7(), _0x11b264),
      'filters': getMediaDialogFilters(_0x134f64, _0x11b264)
    });
    if (_0x1bf17b["canceled"] || !_0x1bf17b["filePath"]) {
      return {
        'success': ![],
        'canceled': !![]
      };
    }
    const _0x58eee8 = a272_0xbc2429["extname"](_0x1bf17b["filePath"]) ? _0x1bf17b["filePath"] : _0x1bf17b["filePath"] + '.' + MEDIA_DEFAULT_EXTENSIONS[_0x134f64];
    const _0x139545 = await saveNodeMediaToFile({
      'outputPath': _0x58eee8,
      'item': {
        'kind': _0x134f64,
        'localPath': _0x3b7d69?.["localPath"],
        'url': _0x3b7d69?.['url']
      },
      'resolveLocalVirtualPath': _0xe954e4,
      'fetchImpl': fetchImpl
    });
    await _0x5a13ea(a272_0xbc2429["dirname"](_0x139545["path"]));
    return _0x139545;
  };
  const _0x5e0676 = async (_0x51ddaf = {}) => {
    const _0x2346da = String(_0x51ddaf?.['content'] ?? '');
    if (Buffer["byteLength"](_0x2346da, "utf8") > MAX_TEXT_FILE_BYTES) {
      throw new Error("Text export exceeds the 16 MB limit");
    }
    const _0xce29e0 = sanitizeTextFilename(_0x51ddaf?.["filename"] || _0x51ddaf?.['fileName']);
    const _0x484b99 = getFilenameExtension(_0xce29e0);
    const _0x234078 = await _0x59f097({
      'title': trimText(_0x51ddaf?.["title"]) || "保存文件",
      'defaultPath': a272_0xbc2429["join"](_0x46d6cf(), _0xce29e0),
      'filters': [{
        'name': trimText(_0x51ddaf?.["filterName"]) || "Text File",
        'extensions': [_0x484b99]
      }]
    });
    if (_0x234078['canceled'] || !_0x234078["filePath"]) {
      return {
        'success': ![],
        'canceled': !![]
      };
    }
    const _0x588c56 = a272_0xbc2429['extname'](_0x234078["filePath"]) ? _0x234078['filePath'] : _0x234078['filePath'] + '.' + _0x484b99;
    const _0x1b99d2 = await writeUtf8FileAtomic(_0x588c56, _0x2346da);
    return {
      'success': !![],
      'canceled': ![],
      'path': _0x1b99d2,
      'filename': a272_0xbc2429["basename"](_0x1b99d2)
    };
  };
  const _0x295e9a = async (_0x41794c = {}) => {
    const _0x570c6a = Array["isArray"](_0x41794c?.["files"]) ? _0x41794c["files"] : [];
    if (_0x570c6a["length"] === 0x0) {
      throw new Error("Media files are required");
    }
    if (_0x570c6a["length"] > MAX_MEDIA_FILES) {
      throw new Error("Cannot save more than " + MAX_MEDIA_FILES + '\x20media\x20files\x20at\x20once');
    }
    let _0x1b371a = trimText(_0x41794c?.["directory"]);
    if (_0x1b371a) {
      _0x1b371a = assertAbsolutePath(_0x1b371a, "Media export directory");
      ensureDirectory(_0x1b371a);
    } else {
      const _0x3bfbfd = await _0x59edb6({
        'title': trimText(_0x41794c?.["title"]) || "选择保存目录",
        'defaultPath': _0x3835f7(),
        'properties': ["openDirectory", "createDirectory"]
      });
      if (_0x3bfbfd['canceled'] || !_0x3bfbfd["filePaths"]?.[0x0]) {
        return {
          'success': ![],
          'canceled': !![],
          'count': 0x0,
          'files': []
        };
      }
      _0x1b371a = a272_0xbc2429["resolve"](_0x3bfbfd['filePaths'][0x0]);
      ensureDirectory(_0x1b371a);
    }
    const _0x429d1d = new Set();
    const _0x330b16 = [];
    for (const _0x3c8a4e of _0x570c6a) {
      const _0x957202 = trimText(_0x3c8a4e?.["kind"])['toLowerCase']();
      if (!Object['prototype']['hasOwnProperty']["call"](MEDIA_DEFAULT_EXTENSIONS, _0x957202)) {
        throw new Error("Unsupported media kind");
      }
      const _0x52c6af = sanitizeMediaFilename(_0x3c8a4e?.["filename"] || _0x3c8a4e?.["fileName"], _0x957202);
      const _0x229175 = uniqueMediaOutputPath(_0x1b371a, _0x52c6af, _0x429d1d);
      const _0x370d2c = await saveNodeMediaToFile({
        'outputPath': _0x229175,
        'item': {
          'kind': _0x957202,
          'localPath': _0x3c8a4e?.["localPath"],
          'url': _0x3c8a4e?.["url"]
        },
        'resolveLocalVirtualPath': _0xe954e4,
        'fetchImpl': fetchImpl
      });
      _0x330b16['push'](_0x370d2c);
    }
    await _0x5a13ea(_0x1b371a);
    return {
      'success': !![],
      'canceled': ![],
      'directory': _0x1b371a,
      'count': _0x330b16["length"],
      'files': _0x330b16
    };
  };
  return {
    'exportSelectedNodesPackage': _0x2cd5c2,
    'saveMediaFile': _0x111668,
    'saveTextFile': _0x5e0676,
    'saveMediaFiles': _0x295e9a,
    'openJianying': createOpenJianyingOperation({
      'openPath': _0x4fa524
    }),
    'saveTimeline': createTimelineExportOperation({
      'showOpenDialog': _0x59edb6,
      'getDefaultDirectory': _0x3835f7,
      'rememberDirectory': _0x5a13ea,
      'resolveLocalVirtualPath': _0xe954e4,
      'getRuntimeToolOrFallback': _0x551639
    })
  };
}