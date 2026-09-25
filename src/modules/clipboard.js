import { desktopBridge } from '../services/desktopBridge.js';
import { buildClipboardMediaSignature, clipboardImageBlobFromBase64 } from './clipboardMediaSignature.js';
const CLIPBOARD_GRAPH_SCHEMA_VERSION = 0x1;
let clipData = null;
let clipMeta = {
  'copiedAt': 0x0,
  'systemSignatureAtCopy': '',
  'systemCopiedAt': 0x0,
  'systemSignature': ''
};
function buildClipboardSignatureFromReadResult({
  files = [],
  mediaType = '',
  mediaSize = 0x0,
  text = ''
} = {}) {
  if (Array["isArray"](files) && files["length"] > 0x0) {
    const _0x28ea4d = files["map"](_0x4df2d8 => String(_0x4df2d8?.["path"] || _0x4df2d8?.["name"] || ''))['filter'](Boolean)["slice"](0x0, 0x8)["join"]('|');
    return "files:" + _0x28ea4d + "|len:" + files['length'];
  }
  if (mediaType) {
    return "media:" + String(mediaType)['toLowerCase']() + '|' + (Number(mediaSize) || 0x0);
  }
  const _0x28f794 = String(text || '');
  if (!_0x28f794["trim"]()) {
    return '';
  }
  const _0x3577b1 = _0x28f794['slice'](0x0, 0x100);
  return 'text:' + _0x3577b1 + "|len:" + _0x28f794["length"];
}
function cloneJson(_0x1f0af1) {
  return JSON["parse"](JSON["stringify"](_0x1f0af1));
}
function normalizeNodeClipboardPayload(_0x5ebe4f, {
  edges = []
} = {}) {
  if (!Array["isArray"](_0x5ebe4f) || _0x5ebe4f["length"] === 0x0) {
    return null;
  }
  return {
    'schemaVersion': CLIPBOARD_GRAPH_SCHEMA_VERSION,
    'nodes': cloneJson(_0x5ebe4f),
    'edges': Array["isArray"](edges) ? cloneJson(edges) : []
  };
}
async function captureElectronClipboardSignatureBestEffort() {
  const _0x4bdbaa = desktopBridge['clipboard'];
  if (!_0x4bdbaa["canUseFiles"]() && !_0x4bdbaa["canUseImages"]() && !_0x4bdbaa["canUseText"]()) {
    return '';
  }
  try {
    if (typeof _0x4bdbaa["readFileReferences"] === "function") {
      const _0x5ed3a8 = await _0x4bdbaa["readFileReferences"]();
      if (_0x5ed3a8?.['ok'] && Array["isArray"](_0x5ed3a8["files"]) && _0x5ed3a8["files"]["length"] > 0x0) {
        const _0x8e7c4d = buildClipboardSignatureFromReadResult({
          'files': _0x5ed3a8["files"]
        });
        if (_0x8e7c4d) {
          return _0x8e7c4d;
        }
      }
    }
    if (typeof _0x4bdbaa["readImage"] === "function") {
      const _0x3f73b1 = await _0x4bdbaa["readImage"]();
      if (_0x3f73b1?.['ok'] && _0x3f73b1['dataBase64']) {
        return await buildClipboardMediaSignature(clipboardImageBlobFromBase64(_0x3f73b1["dataBase64"], _0x3f73b1["mimeType"] || "image/png"));
      }
    }
    if (typeof _0x4bdbaa["readText"] === "function") {
      const _0x5912a8 = await _0x4bdbaa["readText"]();
      if (_0x5912a8?.['ok'] && typeof _0x5912a8["text"] === "string") {
        const _0x3be729 = buildClipboardSignatureFromReadResult({
          'text': _0x5912a8["text"]
        });
        if (_0x3be729) {
          return _0x3be729;
        }
      }
    }
  } catch (_0x119942) {}
  return '';
}
async function captureSystemClipboardSignatureBestEffort() {
  const _0x3f7aa3 = await captureElectronClipboardSignatureBestEffort();
  if (_0x3f7aa3) {
    return _0x3f7aa3;
  }
  try {
    const _0x405047 = globalThis?.['navigator']?.["clipboard"];
    const _0x345a85 = typeof _0x405047?.["read"] === 'function';
    const _0x39cc14 = typeof _0x405047?.['readText'] === "function";
    if (_0x345a85) {
      const _0x123f09 = await _0x405047["read"]();
      for (const _0x25a670 of _0x123f09) {
        const _0x3609fb = _0x25a670["types"]["find"](_0x323f41 => _0x323f41["startsWith"]('image/') || _0x323f41['startsWith']("video/") || _0x323f41["startsWith"]("audio/"));
        if (_0x3609fb) {
          const _0x5d5852 = await _0x25a670['getType'](_0x3609fb);
          return await buildClipboardMediaSignature(_0x5d5852, _0x3609fb);
        }
        if (_0x25a670["types"]["includes"]("text/plain")) {
          const _0x66a7b = await _0x25a670["getType"]("text/plain");
          const _0x28bee5 = await _0x66a7b["text"]();
          const _0x2b9bce = buildClipboardSignatureFromReadResult({
            'text': _0x28bee5
          });
          if (_0x2b9bce) {
            return _0x2b9bce;
          }
        }
      }
    }
    if (_0x39cc14) {
      const _0x2af1c6 = await _0x405047["readText"]();
      return buildClipboardSignatureFromReadResult({
        'text': _0x2af1c6
      });
    }
  } catch (_0x5c9e57) {}
  return '';
}
export function markSystemClipboardWrite({
  signature = '',
  mediaType = '',
  mediaSize = 0x0,
  text = ''
} = {}) {
  const _0x4bd57a = String(signature || '')['trim']() || buildClipboardSignatureFromReadResult({
    'mediaType': mediaType,
    'mediaSize': mediaSize,
    'text': text
  });
  clipMeta = {
    ...clipMeta,
    'systemCopiedAt': Date["now"](),
    'systemSignature': _0x4bd57a || clipMeta['systemSignature'] || ''
  };
}
export function observeSystemClipboardSignature(_0x1ccb4b) {
  const _0x36b271 = String(_0x1ccb4b || '')["trim"]();
  if (!_0x36b271) {
    return;
  }
  clipMeta = {
    ...clipMeta,
    'systemSignature': _0x36b271
  };
}
export function setClipboard(_0x1ced38, _0x5a0b50 = {}) {
  const _0x4037fe = normalizeNodeClipboardPayload(_0x1ced38, _0x5a0b50);
  if (!_0x4037fe) {
    clipData = null;
    clipMeta = {
      ...clipMeta,
      'copiedAt': 0x0,
      'systemSignatureAtCopy': ''
    };
    return;
  }
  clipData = _0x4037fe;
  const _0x4142cc = Date['now']();
  clipMeta = {
    ...clipMeta,
    'copiedAt': _0x4142cc,
    'systemSignatureAtCopy': clipMeta['systemSignature'] || ''
  };
  Promise["resolve"]()['then'](async () => {
    const _0x5d0458 = await captureSystemClipboardSignatureBestEffort();
    if (!clipData) {
      return;
    }
    if (clipMeta["copiedAt"] !== _0x4142cc) {
      return;
    }
    clipMeta = {
      ...clipMeta,
      'systemSignatureAtCopy': _0x5d0458 || clipMeta['systemSignatureAtCopy'] || ''
    };
  })['catch'](() => {});
}
export function getClipboard() {
  if (!clipData) {
    return null;
  }
  if (Array["isArray"](clipData)) {
    return cloneJson(clipData);
  }
  return cloneJson(Array['isArray'](clipData["nodes"]) ? clipData["nodes"] : []);
}
export function getClipboardGraph() {
  if (!clipData) {
    return null;
  }
  if (Array['isArray'](clipData)) {
    return {
      'schemaVersion': CLIPBOARD_GRAPH_SCHEMA_VERSION,
      'nodes': cloneJson(clipData),
      'edges': []
    };
  }
  return {
    'schemaVersion': CLIPBOARD_GRAPH_SCHEMA_VERSION,
    'nodes': cloneJson(Array["isArray"](clipData["nodes"]) ? clipData["nodes"] : []),
    'edges': cloneJson(Array["isArray"](clipData["edges"]) ? clipData["edges"] : [])
  };
}
export function getClipboardMeta() {
  return {
    ...clipMeta
  };
}