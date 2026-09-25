const MAX_CLIPBOARD_IMAGE_BYTES = 0x40 * 0x400 * 0x400;
export function createClipboardCapabilityOperations({
  clipboardApi: _0x12f24f,
  fileReferencesFormat: _0x2b6e53,
  createClipboardNativeImage: _0x50585e,
  normalizeClipboardFileReferences: _0x28fb91,
  parseClipboardFileReferencesFromText: _0x1e5c32
} = {}) {
  function _0x309f85() {
    try {
      const _0x1516d9 = _0x12f24f["readBuffer"](_0x2b6e53);
      if (!_0x1516d9 || _0x1516d9['length'] === 0x0) {
        return [];
      }
      const _0x384628 = JSON["parse"](_0x1516d9["toString"]("utf8"));
      return _0x28fb91(_0x384628?.['files'] || []);
    } catch {
      return [];
    }
  }
  return {
    'writeImage'(_0x3fc20e = {}) {
      try {
        const _0x57485a = _0x50585e(_0x3fc20e || {});
        if (!_0x57485a || _0x57485a['isEmpty']()) {
          return {
            'ok': ![],
            'reason': "no-image"
          };
        }
        const _0x14290 = String(_0x3fc20e?.["text"] || _0x3fc20e?.['absolutePath'] || _0x3fc20e?.["localPath"] || '')["trim"]();
        if (_0x14290) {
          _0x12f24f["write"]({
            'image': _0x57485a,
            'text': _0x14290
          });
        } else {
          _0x12f24f['writeImage'](_0x57485a);
        }
        return {
          'ok': !![],
          'mimeType': "image/png"
        };
      } catch (_0x58f42b) {
        return {
          'ok': ![],
          'reason': "write-failed",
          'error': String(_0x58f42b?.['message'] || _0x58f42b)
        };
      }
    },
    'readImage'() {
      try {
        const _0x2d218b = _0x12f24f["readImage"]();
        if (!_0x2d218b || _0x2d218b["isEmpty"]()) {
          return {
            'ok': ![],
            'reason': "no-image"
          };
        }
        const _0x238001 = _0x2d218b["toPNG"]();
        if (_0x238001["length"] > MAX_CLIPBOARD_IMAGE_BYTES) {
          return {
            'ok': ![],
            'reason': "image-too-large"
          };
        }
        return {
          'ok': !![],
          'mimeType': "image/png",
          'dataBase64': _0x238001["toString"]('base64')
        };
      } catch (_0x361021) {
        return {
          'ok': ![],
          'reason': "read-failed",
          'error': String(_0x361021?.['message'] || _0x361021)
        };
      }
    },
    'writeFileReferences'(_0x4885e6 = {}) {
      try {
        const _0x3e76f1 = _0x28fb91(_0x4885e6?.['paths'] || _0x4885e6?.["files"] || []);
        if (_0x3e76f1["length"] === 0x0) {
          return {
            'ok': ![],
            'reason': 'no-files',
            'files': []
          };
        }
        const _0x45325c = _0x3e76f1['map'](_0x49548b => _0x49548b["path"]);
        try {
          _0x12f24f['writeBuffer'](_0x2b6e53, Buffer["from"](JSON['stringify']({
            'version': 0x1,
            'files': _0x45325c
          }), "utf8"));
        } catch {}
        _0x12f24f["writeText"](_0x45325c["join"]('\x0a'));
        return {
          'ok': !![],
          'files': _0x3e76f1
        };
      } catch (_0x12ca45) {
        return {
          'ok': ![],
          'reason': "write-failed",
          'error': String(_0x12ca45?.["message"] || _0x12ca45),
          'files': []
        };
      }
    },
    'readFileReferences'() {
      try {
        let _0x3ee80c = _0x309f85();
        _0x3ee80c["length"] === 0x0 && (_0x3ee80c = _0x1e5c32(_0x12f24f["readText"]()));
        return {
          'ok': _0x3ee80c["length"] > 0x0,
          'files': _0x3ee80c
        };
      } catch (_0x1e5095) {
        return {
          'ok': ![],
          'reason': 'read-failed',
          'error': String(_0x1e5095?.["message"] || _0x1e5095),
          'files': []
        };
      }
    },
    'writeText'(_0x46233d = {}) {
      try {
        _0x12f24f["writeText"](String(_0x46233d?.['text'] || ''));
        return {
          'ok': !![]
        };
      } catch (_0x5c2817) {
        return {
          'ok': ![],
          'reason': "write-failed",
          'error': String(_0x5c2817?.['message'] || _0x5c2817)
        };
      }
    },
    'readText'() {
      try {
        return {
          'ok': !![],
          'text': _0x12f24f["readText"]()
        };
      } catch (_0x2dc0b8) {
        return {
          'ok': ![],
          'reason': 'read-failed',
          'error': String(_0x2dc0b8?.['message'] || _0x2dc0b8),
          'text': ''
        };
      }
    }
  };
}