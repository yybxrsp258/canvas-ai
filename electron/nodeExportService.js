import { createReadStream, createWriteStream, existsSync, mkdirSync, mkdtempSync, renameSync, rmSync, statSync } from 'node:fs';
import a273_0x60e127 from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import a273_0x53c82b from 'yazl';
export const NODE_EXPORT_FILE_EXTENSION = '.zip';
export const NODE_EXPORT_MANIFEST_NAME = "manifest.json";
export const NODE_EXPORT_PACKAGE_KIND = "aiCanvas.nodeExport";
export const NODE_EXPORT_SCHEMA_VERSION = 0x1;
const KIND_DIR = Object["freeze"]({
  'text': "Text",
  'image': "image",
  'video': "video",
  'audio': "audio"
});
const KIND_DEFAULT_EXT = Object["freeze"]({
  'text': 'txt',
  'image': "png",
  'video': "mp4",
  'audio': "mp3"
});
const MEDIA_KINDS = new Set(["image", 'video', "audio"]);
const RESERVED_WINDOWS_NAMES = new Set(["CON", "PRN", 'AUX', "NUL", "COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", 'COM9', "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", 'LPT7', 'LPT8', "LPT9"]);
function trimText(_0x4d7696) {
  return String(_0x4d7696 || '')["trim"]();
}
function pad2(_0x505397) {
  return String(_0x505397)["padStart"](0x2, '0');
}
export function defaultNodeExportZipName(_0x45fffc = new Date()) {
  const _0x49aeb3 = _0x45fffc instanceof Date ? _0x45fffc : new Date(_0x45fffc);
  const _0x136e79 = [_0x49aeb3["getFullYear"](), pad2(_0x49aeb3["getMonth"]() + 0x1), pad2(_0x49aeb3["getDate"]()), '-', pad2(_0x49aeb3["getHours"]()), pad2(_0x49aeb3['getMinutes']()), pad2(_0x49aeb3['getSeconds']())]["join"]('');
  return 'AI-CanvasPro-Export-' + _0x136e79 + NODE_EXPORT_FILE_EXTENSION;
}
export function withNodeExportZipExtension(_0x774788) {
  const _0x155f50 = trimText(_0x774788);
  if (!_0x155f50) {
    return _0x155f50;
  }
  return a273_0x60e127["extname"](_0x155f50)["toLowerCase"]() === NODE_EXPORT_FILE_EXTENSION ? _0x155f50 : '' + _0x155f50 + NODE_EXPORT_FILE_EXTENSION;
}
function sanitizeArchiveBaseName(_0x3ceb9a, _0xeaee56) {
  let _0x407fc6 = trimText(_0x3ceb9a)["replace"](/[\\/:*?"<>|\x00-\x1F]/g, '_')['replace'](/\s+/g, '\x20')["replace"](/[. ]+$/g, '')["slice"](0x0, 0x78)["trim"]();
  if (!_0x407fc6) {
    _0x407fc6 = _0xeaee56;
  }
  if (RESERVED_WINDOWS_NAMES["has"](_0x407fc6["toUpperCase"]())) {
    _0x407fc6 = _0x407fc6 + '_';
  }
  return _0x407fc6 || "file";
}
function safeDecode(_0x889414) {
  try {
    return decodeURIComponent(_0x889414);
  } catch {
    return _0x889414;
  }
}
function basenameFromUrl(_0xc4bea6) {
  const _0x567300 = trimText(_0xc4bea6);
  if (!_0x567300) {
    return '';
  }
  try {
    const _0x222a65 = new URL(_0x567300);
    return safeDecode(_0x222a65["pathname"]["split"]('/')["filter"](Boolean)["pop"]() || '');
  } catch {
    return safeDecode(_0x567300['split'](/[?#]/, 0x1)[0x0]["replace"](/\\/g, '/')["split"]('/')["pop"]() || '');
  }
}
function extensionFromValue(_0x428a20) {
  const _0x1fc6ee = basenameFromUrl(_0x428a20);
  const _0xf8fc4f = _0x1fc6ee["match"](/\.([a-z0-9]{1,8})$/i);
  return String(_0xf8fc4f?.[0x1] || '')["toLowerCase"]();
}
function getItemExtension(_0x1d3b08) {
  const _0x58a4e9 = normalizeKind(_0x1d3b08?.["kind"]);
  if (_0x58a4e9 === "text") {
    return "txt";
  }
  return extensionFromValue(_0x1d3b08?.["localPath"]) || extensionFromValue(_0x1d3b08?.['url']) || extensionFromValue(_0x1d3b08?.["filenameHint"]) || KIND_DEFAULT_EXT[_0x58a4e9] || 'bin';
}
function normalizeKind(_0x5769db) {
  const _0x3b371a = trimText(_0x5769db)["toLowerCase"]();
  return Object["prototype"]["hasOwnProperty"]['call'](KIND_DIR, _0x3b371a) ? _0x3b371a : '';
}
function allocateArchivePath(_0x388ffc, _0x379a11) {
  const _0x43d462 = normalizeKind(_0x388ffc?.["kind"]);
  const _0x18f10d = KIND_DIR[_0x43d462];
  const _0x46a658 = _0x43d462 || "file";
  const _0x55e5a9 = sanitizeArchiveBaseName(_0x388ffc?.['filenameBase'] || _0x388ffc?.["nodeName"], _0x46a658);
  const _0x302ed3 = getItemExtension(_0x388ffc);
  for (let _0xfab122 = 0x1; _0xfab122 < 0x3e8; _0xfab122 += 0x1) {
    const _0x27392b = _0xfab122 === 0x1 ? '' : '\x20(' + _0xfab122 + ')';
    const _0x20215a = _0x18f10d + '/' + _0x55e5a9 + _0x27392b + '.' + _0x302ed3;
    const _0x17787b = _0x20215a["toLowerCase"]();
    if (_0x379a11['has'](_0x17787b)) {
      continue;
    }
    _0x379a11["add"](_0x17787b);
    return _0x20215a;
  }
  throw new Error("Unable to allocate unique export file name");
}
function normalizeRemoteUrl(_0x393dcd) {
  const _0x19ff84 = trimText(_0x393dcd);
  if (!_0x19ff84) {
    return '';
  }
  try {
    const _0x174f07 = new URL(_0x19ff84);
    if (_0x174f07["protocol"] !== "http:" && _0x174f07["protocol"] !== "https:") {
      return '';
    }
    return _0x174f07['href'];
  } catch {
    return '';
  }
}
function writeZip(_0x59b638, _0x3af732) {
  return new Promise((_0x113c79, _0x1d5a18) => {
    const _0xe591e7 = createWriteStream(_0x3af732);
    _0xe591e7["once"]("close", _0x113c79);
    _0xe591e7["once"]("error", _0x1d5a18);
    _0x59b638["outputStream"]["once"]("error", _0x1d5a18);
    _0x59b638["outputStream"]["pipe"](_0xe591e7);
    _0x59b638['end']();
  });
}
async function downloadRemoteToTemp({
  url: _0x314d5e,
  tempDir: _0x537f9c,
  fetchImpl: _0x3f9905,
  ext: _0x33b758
}) {
  if (typeof _0x3f9905 !== "function") {
    throw new Error("fetch is not available in the main process");
  }
  const _0x2f754b = await _0x3f9905(_0x314d5e);
  if (!_0x2f754b?.['ok']) {
    throw new Error("HTTP " + (_0x2f754b?.["status"] || 0x0));
  }
  const _0x1bdf1f = a273_0x60e127["join"](_0x537f9c, "remote-" + Date["now"]() + '-' + Math["random"]()["toString"](0x24)["slice"](0x2) + '.' + (_0x33b758 || "bin"));
  if (_0x2f754b["body"] && typeof Readable['fromWeb'] === 'function') {
    await pipeline(Readable['fromWeb'](_0x2f754b['body']), createWriteStream(_0x1bdf1f));
  } else {
    const _0x53f39d = Buffer["from"](await _0x2f754b["arrayBuffer"]());
    await pipeline(Readable["from"](_0x53f39d), createWriteStream(_0x1bdf1f));
  }
  const _0xa47628 = statSync(_0x1bdf1f);
  if (!_0xa47628["isFile"]()) {
    throw new Error("Remote download did not produce a file");
  }
  return _0x1bdf1f;
}
export async function saveNodeMediaToFile({
  outputPath: _0x4c14ff,
  item: _0x2fedc6,
  resolveLocalVirtualPath: _0x400e30,
  fetchImpl = globalThis["fetch"]
} = {}) {
  const _0x51712a = normalizeKind(_0x2fedc6?.["kind"]);
  if (!MEDIA_KINDS["has"](_0x51712a)) {
    throw new Error("Only media items can be saved");
  }
  const _0x5b4f93 = trimText(_0x4c14ff);
  if (!_0x5b4f93) {
    throw new Error('Save\x20path\x20is\x20required');
  }
  if (!a273_0x60e127['isAbsolute'](_0x5b4f93)) {
    throw new Error("Save path must be absolute");
  }
  const _0x342bd6 = a273_0x60e127["resolve"](_0x5b4f93);
  const _0x10f578 = trimText(_0x2fedc6?.["localPath"]);
  let _0x22ca96 = '';
  let _0x1960f8 = '';
  if (_0x10f578) {
    if (typeof _0x400e30 !== "function") {
      throw new Error('resolveLocalVirtualPath\x20is\x20required');
    }
    _0x22ca96 = _0x400e30(_0x10f578);
    if (!_0x22ca96) {
      throw new Error("Local media path is not allowed");
    }
    _0x22ca96 = a273_0x60e127['resolve'](_0x22ca96);
    const _0x5d61b9 = statSync(_0x22ca96);
    if (!_0x5d61b9["isFile"]()) {
      throw new Error("Local media path is not a file");
    }
    if (_0x22ca96 === _0x342bd6) {
      return {
        'success': !![],
        'canceled': ![],
        'path': _0x342bd6,
        'filename': a273_0x60e127["basename"](_0x342bd6),
        'kind': _0x51712a
      };
    }
  } else {
    _0x1960f8 = normalizeRemoteUrl(_0x2fedc6?.["url"]);
    if (!_0x1960f8) {
      throw new Error("Media source is required");
    }
    if (typeof fetchImpl !== 'function') {
      throw new Error('fetch\x20is\x20not\x20available\x20in\x20the\x20main\x20process');
    }
  }
  mkdirSync(a273_0x60e127["dirname"](_0x342bd6), {
    'recursive': !![]
  });
  const _0x2e85b8 = a273_0x60e127["join"](a273_0x60e127['dirname'](_0x342bd6), '.' + a273_0x60e127["basename"](_0x342bd6) + '.' + process["pid"] + '-' + Date["now"]() + '-' + Math["random"]()['toString'](0x24)["slice"](0x2) + ".part");
  try {
    if (_0x22ca96) {
      await pipeline(createReadStream(_0x22ca96), createWriteStream(_0x2e85b8, {
        'flags': 'wx'
      }));
    } else {
      const _0x29552f = await fetchImpl(_0x1960f8);
      if (!_0x29552f?.['ok']) {
        throw new Error('HTTP\x20' + (_0x29552f?.["status"] || 0x0));
      }
      if (_0x29552f['body'] && typeof Readable['fromWeb'] === "function") {
        await pipeline(Readable["fromWeb"](_0x29552f["body"]), createWriteStream(_0x2e85b8, {
          'flags': 'wx'
        }));
      } else {
        const _0x42460b = Buffer["from"](await _0x29552f['arrayBuffer']());
        await pipeline(Readable["from"](_0x42460b), createWriteStream(_0x2e85b8, {
          'flags': 'wx'
        }));
      }
    }
    if (existsSync(_0x342bd6)) {
      rmSync(_0x342bd6, {
        'force': !![]
      });
    }
    renameSync(_0x2e85b8, _0x342bd6);
    return {
      'success': !![],
      'canceled': ![],
      'path': _0x342bd6,
      'filename': a273_0x60e127["basename"](_0x342bd6),
      'kind': _0x51712a
    };
  } finally {
    if (existsSync(_0x2e85b8)) {
      rmSync(_0x2e85b8, {
        'force': !![]
      });
    }
  }
}
function createSkipped(_0x222635, _0xd0b0fa, _0x482588 = '') {
  return {
    'nodeId': trimText(_0x222635?.["nodeId"]),
    'nodeName': trimText(_0x222635?.["nodeName"]),
    'nodeType': trimText(_0x222635?.['nodeType']),
    'kind': normalizeKind(_0x222635?.["kind"]) || trimText(_0x222635?.["kind"]),
    'reason': _0xd0b0fa,
    'detail': trimText(_0x482588)
  };
}
function normalizeItems(_0x1c207b) {
  return Array["isArray"](_0x1c207b) ? _0x1c207b['filter'](_0x358e40 => _0x358e40 && typeof _0x358e40 === "object" && !Array["isArray"](_0x358e40)) : [];
}
export async function exportNodeItemsToZip({
  outputPath: _0x2393a2,
  items: _0x7ca51,
  resolveLocalVirtualPath: _0x1dd1f1,
  tempRoot: _0x5a92f1,
  fetchImpl = globalThis['fetch'],
  now = new Date()
} = {}) {
  const _0x1287e4 = withNodeExportZipExtension(_0x2393a2);
  if (!_0x1287e4) {
    throw new Error("Export path is required");
  }
  if (!a273_0x60e127["isAbsolute"](_0x1287e4)) {
    throw new Error('Export\x20path\x20must\x20be\x20absolute');
  }
  const _0x1c1aa4 = a273_0x60e127["resolve"](_0x1287e4);
  if (typeof _0x1dd1f1 !== "function") {
    throw new Error("resolveLocalVirtualPath is required");
  }
  const _0x11ac1f = normalizeItems(_0x7ca51);
  const _0xbf3a4e = new Set();
  const _0x5613cf = [];
  const _0x2ee923 = [];
  let _0x5b8424 = '';
  try {
    for (const _0xd77d6a of _0x11ac1f) {
      const _0x421e02 = normalizeKind(_0xd77d6a?.["kind"]);
      if (!_0x421e02) {
        _0x2ee923["push"](createSkipped(_0xd77d6a, "UNSUPPORTED_KIND"));
        continue;
      }
      if (_0x421e02 === 'text') {
        const _0x167b35 = String(_0xd77d6a?.['text'] ?? '');
        if (!_0x167b35["trim"]()) {
          _0x2ee923['push'](createSkipped(_0xd77d6a, "EMPTY_TEXT"));
          continue;
        }
        const _0x56c647 = allocateArchivePath({
          ..._0xd77d6a,
          'kind': _0x421e02
        }, _0xbf3a4e);
        _0x5613cf["push"]({
          'item': _0xd77d6a,
          'kind': _0x421e02,
          'archivePath': _0x56c647,
          'buffer': Buffer["from"](_0x167b35, 'utf8'),
          'compress': !![]
        });
        continue;
      }
      const _0x59e395 = trimText(_0xd77d6a?.["localPath"]);
      if (_0x59e395) {
        const _0x1df7c5 = _0x1dd1f1(_0x59e395);
        if (!_0x1df7c5) {
          _0x2ee923["push"](createSkipped(_0xd77d6a, "INVALID_LOCAL_PATH", _0x59e395));
          continue;
        }
        try {
          const _0x4c41ed = statSync(_0x1df7c5);
          if (!_0x4c41ed["isFile"]()) {
            _0x2ee923["push"](createSkipped(_0xd77d6a, "LOCAL_PATH_NOT_FILE", _0x59e395));
            continue;
          }
          const _0x5ebd8a = allocateArchivePath({
            ..._0xd77d6a,
            'kind': _0x421e02
          }, _0xbf3a4e);
          _0x5613cf["push"]({
            'item': _0xd77d6a,
            'kind': _0x421e02,
            'archivePath': _0x5ebd8a,
            'sourcePath': _0x1df7c5,
            'compress': ![]
          });
        } catch (_0x4a9efc) {
          _0x2ee923['push'](createSkipped(_0xd77d6a, 'LOCAL_FILE_MISSING', _0x4a9efc?.['message'] || _0x59e395));
        }
        continue;
      }
      const _0x2eac9a = normalizeRemoteUrl(_0xd77d6a?.["url"]);
      if (!_0x2eac9a) {
        _0x2ee923["push"](createSkipped(_0xd77d6a, "NO_MEDIA_SOURCE"));
        continue;
      }
      try {
        if (!_0x5b8424) {
          const _0x25e1d2 = _0x5a92f1 || a273_0x60e127["dirname"](_0x1c1aa4);
          mkdirSync(_0x25e1d2, {
            'recursive': !![]
          });
          _0x5b8424 = mkdtempSync(a273_0x60e127['join'](_0x25e1d2, 'aic-node-export-'));
        }
        const _0xf322c3 = await downloadRemoteToTemp({
          'url': _0x2eac9a,
          'tempDir': _0x5b8424,
          'fetchImpl': fetchImpl,
          'ext': getItemExtension(_0xd77d6a)
        });
        const _0x20a7f1 = allocateArchivePath({
          ..._0xd77d6a,
          'kind': _0x421e02
        }, _0xbf3a4e);
        _0x5613cf["push"]({
          'item': _0xd77d6a,
          'kind': _0x421e02,
          'archivePath': _0x20a7f1,
          'sourcePath': _0xf322c3,
          'compress': ![]
        });
      } catch (_0x8e3ec2) {
        _0x2ee923["push"](createSkipped(_0xd77d6a, "REMOTE_DOWNLOAD_FAILED", _0x8e3ec2?.["message"] || _0x2eac9a));
      }
    }
    if (_0x5613cf["length"] <= 0x0) {
      return {
        'success': ![],
        'canceled': ![],
        'code': "NO_EXPORTABLE_ITEMS",
        'exportedCount': 0x0,
        'skipped': _0x2ee923,
        'counts': {}
      };
    }
    const _0x114f0c = {
      'text': 0x0,
      'image': 0x0,
      'video': 0x0,
      'audio': 0x0
    };
    for (const _0xd31945 of _0x5613cf) {
      _0x114f0c[_0xd31945["kind"]] += 0x1;
    }
    const _0x1f0da2 = {
      'schemaVersion': NODE_EXPORT_SCHEMA_VERSION,
      'packageKind': NODE_EXPORT_PACKAGE_KIND,
      'exportedAt': (now instanceof Date ? now : new Date(now))["toISOString"](),
      'exportedCount': _0x5613cf["length"],
      'counts': _0x114f0c,
      'items': _0x5613cf["map"](_0x25c26b => ({
        'nodeId': trimText(_0x25c26b['item']?.["nodeId"]),
        'nodeName': trimText(_0x25c26b["item"]?.["nodeName"]),
        'nodeType': trimText(_0x25c26b["item"]?.["nodeType"]),
        'kind': _0x25c26b["kind"],
        'archivePath': _0x25c26b["archivePath"]
      })),
      'skipped': _0x2ee923
    };
    mkdirSync(a273_0x60e127["dirname"](_0x1c1aa4), {
      'recursive': !![]
    });
    const _0x5c82a0 = new a273_0x53c82b["ZipFile"]();
    for (const _0x129e62 of _0x5613cf) {
      _0x129e62['buffer'] ? _0x5c82a0["addBuffer"](_0x129e62['buffer'], _0x129e62['archivePath']) : _0x5c82a0['addFile'](_0x129e62["sourcePath"], _0x129e62["archivePath"], {
        'compress': _0x129e62["compress"] !== ![]
      });
    }
    _0x5c82a0["addBuffer"](Buffer["from"](JSON["stringify"](_0x1f0da2, null, 0x2) + '\x0a', "utf8"), NODE_EXPORT_MANIFEST_NAME);
    await writeZip(_0x5c82a0, _0x1c1aa4);
    return {
      'success': !![],
      'canceled': ![],
      'path': _0x1c1aa4,
      'filename': a273_0x60e127["basename"](_0x1c1aa4),
      'exportedCount': _0x5613cf["length"],
      'skipped': _0x2ee923,
      'counts': _0x114f0c
    };
  } finally {
    _0x5b8424 && existsSync(_0x5b8424) && rmSync(_0x5b8424, {
      'recursive': !![],
      'force': !![]
    });
  }
}