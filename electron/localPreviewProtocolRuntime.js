import { randomBytes } from 'node:crypto';
import { createReadStream, realpathSync, statSync } from 'node:fs';
import a253_0x365591 from 'node:path';
import { Readable } from 'node:stream';
const PREVIEWABLE_MEDIA_PATTERN = /\.(?:png|jpe?g|webp|gif|bmp|avif|mp4|webm|mov|m4v|mp3|wav|m4a|aac|ogg|flac)$/i;
const MIME_BY_EXTENSION = Object["freeze"]({
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': "image/jpeg",
  '.webp': 'image/webp',
  '.gif': "image/gif",
  '.bmp': "image/bmp",
  '.avif': "image/avif",
  '.mp4': 'video/mp4',
  '.m4v': 'video/mp4',
  '.webm': "video/webm",
  '.mov': "video/quicktime",
  '.mp3': "audio/mpeg",
  '.wav': 'audio/wav',
  '.m4a': "audio/mp4",
  '.aac': 'audio/aac',
  '.ogg': "audio/ogg",
  '.flac': 'audio/flac'
});
function requireFunction(_0x2b44ae, _0x380dd0) {
  if (typeof _0x2b44ae !== "function") {
    throw new TypeError(_0x380dd0 + " must be a function");
  }
  return _0x2b44ae;
}
export function parseLocalPreviewRange(_0xde1cda, _0x5c3eed) {
  const _0x46a4a1 = Number(_0x5c3eed);
  const _0x938b3d = String(_0xde1cda || '')['match'](/^bytes=(\d*)-(\d*)$/);
  if (!_0x938b3d || !Number["isSafeInteger"](_0x46a4a1) || _0x46a4a1 <= 0x0) {
    return null;
  }
  const _0x13dbc7 = _0x938b3d[0x1];
  const _0x1a63fd = _0x938b3d[0x2];
  let _0x2e904b = _0x13dbc7 ? Number["parseInt"](_0x13dbc7, 0xa) : 0x0;
  let _0x4531f3 = _0x1a63fd ? Number['parseInt'](_0x1a63fd, 0xa) : _0x46a4a1 - 0x1;
  if (!_0x13dbc7 && _0x1a63fd) {
    const _0x56f44f = Number["parseInt"](_0x1a63fd, 0xa);
    if (!Number["isInteger"](_0x56f44f) || _0x56f44f <= 0x0) {
      return null;
    }
    _0x2e904b = Math["max"](0x0, _0x46a4a1 - _0x56f44f);
    _0x4531f3 = _0x46a4a1 - 0x1;
  }
  if (!Number["isInteger"](_0x2e904b) || !Number['isInteger'](_0x4531f3)) {
    return null;
  }
  if (_0x2e904b < 0x0 || _0x4531f3 < _0x2e904b || _0x2e904b >= _0x46a4a1) {
    return null;
  }
  return {
    'start': _0x2e904b,
    'end': Math["min"](_0x4531f3, _0x46a4a1 - 0x1)
  };
}
export function isPreviewableLocalMedia(_0x34fbb6 = {}, _0x326bc4 = '') {
  const _0x16524b = String(_0x34fbb6?.["type"] || '')["toLowerCase"]();
  if (_0x16524b['startsWith']('image/') || _0x16524b["startsWith"]("video/") || _0x16524b["startsWith"]('audio/')) {
    return !![];
  }
  return PREVIEWABLE_MEDIA_PATTERN['test'](String(_0x326bc4 || ''));
}
export function getLocalPreviewMimeType(_0x47d60c, _0x1ff681 = '') {
  const _0x3db590 = String(_0x1ff681 || '')['toLowerCase']();
  if (_0x3db590["startsWith"]("image/") || _0x3db590['startsWith']("video/") || _0x3db590["startsWith"]("audio/")) {
    return _0x3db590;
  }
  return MIME_BY_EXTENSION[a253_0x365591["extname"](String(_0x47d60c || ''))["toLowerCase"]()] || "application/octet-stream";
}
export function createLocalPreviewProtocolRuntime({
  protocol: _0x4d2650,
  scheme: _0xd07b78,
  appOrigin: _0x5ec68f,
  ttlMs: _0x197789,
  resolveLocalVirtualPath: _0x7cd8a3,
  now = Date["now"],
  createToken = () => randomBytes(0x18)['toString']("hex"),
  resolveRealPath = realpathSync,
  statFile = statSync,
  createFileReadStream = createReadStream,
  toWebStream = _0x5badee => Readable["toWeb"](_0x5badee),
  ResponseCtor = globalThis['Response'],
  URLCtor = globalThis['URL'],
  logWarning = (..._0xac0a1a) => console['warn'](..._0xac0a1a)
} = {}) {
  if (!_0x4d2650?.["handle"]) {
    throw new TypeError("protocol.handle must be a function");
  }
  const _0x5dce16 = requireFunction(_0x7cd8a3, "resolveLocalVirtualPath");
  const _0x4c48fb = requireFunction(now, "now");
  const _0x525129 = requireFunction(createToken, "createToken");
  const _0x47cf44 = Math["max"](0x1, Number(_0x197789) || 0x1);
  const _0x5d636e = new Map();
  let _0xf83425 = ![];
  function _0x1dc90b(_0x541328 = {}) {
    const _0x36538a = String(_0x541328?.["path"] || '')['trim']();
    return _0x36538a || _0x5dce16(_0x541328?.["localPath"] || _0x541328?.["url"] || _0x541328?.["src"] || '');
  }
  function _0x51ad4b() {
    const _0x1e9f20 = _0x4c48fb();
    for (const [_0x1d9422, _0x1059af] of _0x5d636e["entries"]()) {
      (!_0x1059af || Number(_0x1059af["expiresAt"] || 0x0) <= _0x1e9f20) && _0x5d636e['delete'](_0x1d9422);
    }
  }
  function _0x5e31f0(_0x2d5147 = {}) {
    const _0x1d2b9d = _0x1dc90b(_0x2d5147);
    if (!_0x1d2b9d) {
      throw new Error("缺少文件路径");
    }
    if (!a253_0x365591["isAbsolute"](_0x1d2b9d)) {
      throw new Error("文件路径必须是绝对路径");
    }
    const _0x289cee = resolveRealPath(_0x1d2b9d);
    const _0x2d2fbd = statFile(_0x289cee);
    if (!_0x2d2fbd['isFile']()) {
      throw new Error("只支持预览文件");
    }
    if (!isPreviewableLocalMedia(_0x2d5147, _0x289cee)) {
      throw new Error("只支持图片或视频快速预览");
    }
    _0x51ad4b();
    const _0x466e97 = String(_0x525129() || '')["trim"]();
    if (!_0x466e97) {
      throw new Error("无法创建预览令牌");
    }
    const _0x49c6b3 = getLocalPreviewMimeType(_0x289cee, _0x2d5147?.["type"] || '');
    _0x5d636e["set"](_0x466e97, {
      'path': _0x289cee,
      'mimeType': _0x49c6b3,
      'size': _0x2d2fbd['size'],
      'expiresAt': _0x4c48fb() + _0x47cf44
    });
    const _0x25c386 = encodeURIComponent(a253_0x365591['basename'](_0x289cee));
    return _0xd07b78 + "://preview/" + _0x466e97 + '/' + _0x25c386;
  }
  function _0x5a61f8() {
    if (_0xf83425) {
      return ![];
    }
    _0xf83425 = !![];
    _0x4d2650["handle"](_0xd07b78, _0x3e8185 => {
      try {
        _0x51ad4b();
        const _0x5a0272 = new URLCtor(_0x3e8185["url"]);
        const _0x423edb = decodeURIComponent(_0x5a0272["pathname"]['split']('/')["filter"](Boolean)[0x0] || '');
        const _0x243cd2 = _0x5d636e["get"](_0x423edb);
        if (!_0x243cd2) {
          return new ResponseCtor("Preview not found", {
            'status': 0x194
          });
        }
        const _0x21317f = statFile(_0x243cd2["path"]);
        if (!_0x21317f['isFile']()) {
          _0x5d636e['delete'](_0x423edb);
          return new ResponseCtor("Preview not found", {
            'status': 0x194
          });
        }
        const _0x5b2268 = _0x21317f["size"];
        const _0x25f6ed = parseLocalPreviewRange(_0x3e8185["headers"]["get"]('range'), _0x5b2268);
        const _0x362590 = {
          'Content-Type': _0x243cd2["mimeType"],
          'Accept-Ranges': "bytes",
          'Access-Control-Allow-Origin': _0x5ec68f,
          'Cache-Control': "private, max-age=" + Math['floor'](_0x47cf44 / 0x3e8) + ", immutable"
        };
        if (_0x25f6ed) {
          _0x362590['Content-Range'] = "bytes " + _0x25f6ed["start"] + '-' + _0x25f6ed["end"] + '/' + _0x5b2268;
          _0x362590["Content-Length"] = String(_0x25f6ed["end"] - _0x25f6ed['start'] + 0x1);
          return new ResponseCtor(toWebStream(createFileReadStream(_0x243cd2["path"], {
            'start': _0x25f6ed["start"],
            'end': _0x25f6ed["end"]
          })), {
            'status': 0xce,
            'headers': _0x362590
          });
        }
        _0x362590['Content-Length'] = String(_0x5b2268);
        return new ResponseCtor(toWebStream(createFileReadStream(_0x243cd2["path"])), {
          'status': 0xc8,
          'headers': _0x362590
        });
      } catch (_0x56bd8e) {
        logWarning("[electron] local preview failed:", _0x56bd8e);
        return new ResponseCtor("Preview failed", {
          'status': 0x1f4
        });
      }
    });
    return !![];
  }
  return {
    'clearExpired': _0x51ad4b,
    'createUrl': _0x5e31f0,
    'install': _0x5a61f8
  };
}