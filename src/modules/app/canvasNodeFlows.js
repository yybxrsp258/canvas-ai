import { createDefaultCommentNoteStyle } from '../../components/commentNoteStyle.js';
import { findAvailablePosition, generateId, getViewportScreenCenter, screenToWorld } from '../../core/math.js';
import { t } from '../../i18n/index.js';
import { getNodeSpawnPrefs } from '../nodeSpawn.js';
import { desktopBridge } from '../../services/desktopBridge.js';
import { buildClipboardMediaSignature, clipboardImageBlobFromBase64 } from '../clipboardMediaSignature.js';
function getMimeExtension(_0x280a43, _0x5ccff8 = "bin") {
  const _0x1d4c82 = String(_0x280a43 || '')["split"](';')[0x0]["trim"]()["toLowerCase"]();
  if (!_0x1d4c82['includes']('/')) {
    return _0x5ccff8;
  }
  const _0x68314 = _0x1d4c82["split"]('/')[0x1] || _0x5ccff8;
  return _0x68314['replace'](/[^a-z0-9]/g, '') || _0x5ccff8;
}
async function buildSystemClipboardSignature({
  pastedMedia: _0x55c5a6,
  pastedText: _0x364e64,
  pastedFiles: _0x3f8f89
}) {
  if (Array['isArray'](_0x3f8f89) && _0x3f8f89["length"] > 0x0) {
    const _0x1d95bb = _0x3f8f89["map"](_0x98b5d3 => String(_0x98b5d3?.['path'] || _0x98b5d3?.['name'] || ''))['filter'](Boolean)["slice"](0x0, 0x8)["join"]('|');
    return "files:" + _0x1d95bb + '|len:' + _0x3f8f89["length"];
  }
  if (_0x55c5a6?.["mimeType"]) {
    return await buildClipboardMediaSignature(_0x55c5a6["blob"], _0x55c5a6["mimeType"]);
  }
  const _0x2dcd69 = String(_0x364e64 || '');
  if (!_0x2dcd69["trim"]()) {
    return '';
  }
  const _0x122cbd = _0x2dcd69["slice"](0x0, 0x100);
  return "text:" + _0x122cbd + "|len:" + _0x2dcd69["length"];
}
function resolvePastedMediaDescriptor(_0x1d4ed3, _0x177604 = {}) {
  const _0x5e4f4a = String(_0x177604["nodeName"] || _0x177604["name"] || '')['trim']();
  const _0x5c2e41 = String(_0x177604["typeSlug"] || '')["trim"]();
  if (_0x1d4ed3['startsWith']("image/")) {
    return {
      'nodeType': "source-image",
      'nodeName': _0x5e4f4a || t("canvasNodeFlows.paste.nodeName.image"),
      'typeSlug': _0x5c2e41 || "image"
    };
  }
  if (_0x1d4ed3['startsWith']("video/")) {
    return {
      'nodeType': 'source-video',
      'nodeName': _0x5e4f4a || t('canvasNodeFlows.paste.nodeName.video'),
      'typeSlug': _0x5c2e41 || "video"
    };
  }
  if (_0x1d4ed3['startsWith']('audio/')) {
    return {
      'nodeType': 'source-audio',
      'nodeName': _0x5e4f4a || t("canvasNodeFlows.paste.nodeName.audio"),
      'typeSlug': _0x5c2e41 || "audio"
    };
  }
  return null;
}
function centerNodeAtWorldPosition(_0x39873d, _0x26292a, _0x3495f4) {
  const _0xccb18d = Number(_0x39873d?.["width"]) || 0x0;
  const _0x3a41e2 = Number(_0x39873d?.['height']) || 0x0;
  return {
    ..._0x39873d,
    'x': _0x26292a - _0xccb18d / 0x2,
    'y': _0x3495f4 - _0x3a41e2 / 0x2
  };
}
function normalizeSpawnDirection(_0x54c8a4) {
  return _0x54c8a4 === "left" || _0x54c8a4 === 'down' ? _0x54c8a4 : "right";
}
function toFinitePositiveNumber(_0x39abfd, _0x3103e5) {
  const _0x318a48 = Number(_0x39abfd);
  return Number["isFinite"](_0x318a48) && _0x318a48 > 0x0 ? _0x318a48 : _0x3103e5;
}
function getCssPixelValue(_0x2c8868, _0x24eeae = 0x0) {
  const _0xca3f60 = globalThis["document"];
  if (!_0xca3f60) {
    return _0x24eeae;
  }
  try {
    const _0x969a84 = globalThis["getComputedStyle"]?.(_0xca3f60['body'])?.["getPropertyValue"]?.(_0x2c8868);
    const _0x535faf = Number["parseFloat"](_0x969a84);
    return Number["isFinite"](_0x535faf) ? _0x535faf : _0x24eeae;
  } catch {
    return _0x24eeae;
  }
}
function getVisibleCanvasCenterScreenPosition(_0x50453e = {}) {
  const _0xbaebe3 = globalThis["window"] || {};
  const _0x40637b = toFinitePositiveNumber(_0xbaebe3["innerWidth"], 0x0);
  const _0x4e6857 = toFinitePositiveNumber(_0xbaebe3["innerHeight"], 0x0);
  let _0x149592 = _0x40637b;
  try {
    const _0x3781e2 = globalThis['document'];
    const _0xac8a13 = _0x3781e2?.["body"];
    if (_0xac8a13?.["classList"]?.["contains"]?.('agent-sidebar-open') && !_0xac8a13["classList"]["contains"]('agent-sidebar-collapsed')) {
      const _0x4896f0 = _0x3781e2["querySelector"]?.('.agent-sidebar.is-open');
      const _0x3e9e29 = Number(_0x4896f0?.["getBoundingClientRect"]?.()?.["width"]);
      const _0x52b225 = Number["isFinite"](_0x3e9e29) && _0x3e9e29 > 0x0 ? _0x3e9e29 : getCssPixelValue("--agent-sidebar-width", 0x0);
      _0x149592 = Math["max"](0x1, _0x40637b - _0x52b225);
    }
  } catch {}
  return getViewportScreenCenter(_0x50453e, _0x149592, _0x4e6857);
}
function getSequenceNodes(_0x47a1d3, _0x37c20b) {
  if (!_0x37c20b || !_0x47a1d3 || typeof _0x47a1d3 !== "object") {
    return {};
  }
  return Object["fromEntries"](Object["entries"](_0x47a1d3)['filter'](([, _0x5d7bcc]) => String(_0x5d7bcc?.["spawnSequenceKey"] || '') === _0x37c20b));
}
async function readElectronClipboardContents() {
  const _0x471d62 = desktopBridge['clipboard'];
  if (!_0x471d62["canUseFiles"]() && !_0x471d62["canUseImages"]() && !_0x471d62["canUseText"]()) {
    return {
      'pastedFiles': [],
      'pastedMedia': null,
      'pastedText': '',
      'failed': ![]
    };
  }
  const _0x4efc0d = {
    'pastedFiles': [],
    'pastedMedia': null,
    'pastedText': '',
    'failed': ![],
    'imageReadSucceeded': ![]
  };
  try {
    if (typeof _0x471d62["readFileReferences"] === "function") {
      const _0x4ec4f4 = await _0x471d62["readFileReferences"]();
      if (_0x4ec4f4?.['reason'] === "read-failed") {
        _0x4efc0d["failed"] = !![];
      }
      _0x4ec4f4?.['ok'] && Array["isArray"](_0x4ec4f4["files"]) && (_0x4efc0d["pastedFiles"] = _0x4ec4f4['files']);
    }
    if (_0x4efc0d["pastedFiles"]["length"] === 0x0 && typeof _0x471d62["readImage"] === 'function') {
      const _0x2dea58 = await _0x471d62["readImage"]();
      _0x4efc0d['imageReadSucceeded'] = _0x2dea58?.['ok'] === !![] || _0x2dea58?.["reason"] === "no-image";
      if (_0x2dea58?.['reason'] && _0x2dea58['reason'] !== 'no-image') {
        _0x4efc0d["failed"] = !![];
      }
      if (_0x2dea58?.['ok'] && _0x2dea58["dataBase64"]) {
        const _0x432e8e = String(_0x2dea58["mimeType"] || 'image/png');
        const _0x1c20ea = clipboardImageBlobFromBase64(_0x2dea58["dataBase64"], _0x432e8e);
        _0x1c20ea && (_0x4efc0d["pastedMedia"] = {
          'mimeType': _0x432e8e,
          'blob': _0x1c20ea
        });
      }
    }
    if (typeof _0x471d62["readText"] === 'function') {
      const _0x696f16 = await _0x471d62['readText']();
      if (_0x696f16?.['reason'] === "read-failed") {
        _0x4efc0d["failed"] = !![];
      }
      _0x696f16?.['ok'] && typeof _0x696f16['text'] === 'string' && (_0x4efc0d["pastedText"] = _0x696f16["text"]);
    }
  } catch (_0x247209) {
    console["warn"]("[paste] Electron 剪贴板读取失败:", _0x247209);
    _0x4efc0d["failed"] = !![];
  }
  return _0x4efc0d;
}
async function readSystemClipboardContents() {
  let _0x4f84d6 = null;
  let _0x3200b2 = '';
  let _0x20b566 = [];
  let _0xab3600 = ![];
  const _0x587fa8 = await readElectronClipboardContents();
  _0x20b566 = _0x587fa8["pastedFiles"];
  _0x4f84d6 = _0x587fa8["pastedMedia"];
  _0x3200b2 = _0x587fa8["pastedText"];
  _0xab3600 = !!_0x587fa8["failed"];
  try {
    const _0x52df77 = globalThis?.["navigator"]?.["clipboard"];
    const _0x1dd18c = typeof _0x52df77?.["read"] === "function";
    const _0x6e70f3 = typeof _0x52df77?.['readText'] === 'function';
    if (_0x20b566["length"] === 0x0 && !_0x4f84d6 && _0x1dd18c) {
      const _0x4b0711 = await _0x52df77["read"]();
      for (const _0x14418e of _0x4b0711) {
        const _0x5e55ee = _0x14418e["types"]["find"](_0x5e22e2 => _0x5e22e2["startsWith"]("image/") || _0x5e22e2["startsWith"]("video/") || _0x5e22e2["startsWith"]("audio/"));
        if (!_0x4f84d6 && _0x5e55ee) {
          _0x4f84d6 = {
            'mimeType': _0x5e55ee,
            'blob': await _0x14418e["getType"](_0x5e55ee)
          };
          continue;
        }
        if (!_0x3200b2 && _0x14418e['types']["includes"]('text/plain')) {
          const _0x3d6822 = await _0x14418e["getType"]("text/plain");
          _0x3200b2 = await _0x3d6822["text"]();
        }
      }
    }
    !_0x3200b2 && !_0x4f84d6 && _0x20b566["length"] === 0x0 && _0x6e70f3 && (_0x3200b2 = await _0x52df77["readText"]());
  } catch (_0x461ba5) {
    console['warn']("[paste] 剪贴板读取失败:", _0x461ba5);
    _0xab3600 = !!_0x587fa8["failed"] || !_0x587fa8["imageReadSucceeded"];
  }
  return {
    'pastedFiles': _0x20b566,
    'pastedMedia': _0x4f84d6,
    'pastedText': _0x3200b2,
    'clipboardReadFailed': _0xab3600
  };
}
export function createAppCanvasNodeFlows({
  graphStore: _0x46a57c,
  commit: _0x2a14bb,
  getCursorScreenPosition: _0x388cd5,
  getNodeDefaultSize: _0x4bd4a7,
  getAIGenerationDefaultSizeByType: _0x59dd02,
  getAIGenerationNodeSize: _0x4f56d6,
  createPanoramaNodeDataByType: _0x4039ad,
  processFile: _0x142e89,
  executeCommand: _0x4b04f3,
  getCurrentProjectId: _0x50b428,
  getCanvasIdentity = () => _0x50b428?.(),
  showToast: _0x451ea6,
  loadClipboardModule = () => import("../clipboard.js")
} = {}) {
  function _0x1a3dc2(_0x4c7742 = {}) {
    const _0x32a91e = getCanvasIdentity();
    return {
      ..._0x4c7742,
      'projectId': _0x50b428?.() || 'default_v2_project',
      'isImportCurrent': () => _0x32a91e === getCanvasIdentity() && _0x4c7742['isImportCurrent']?.() !== ![]
    };
  }
  function _0x2fded8() {
    return _0x46a57c?.["getStateRaw"]?.() ?? _0x46a57c?.["getState"]?.() ?? {};
  }
  function _0x56e14e(_0x5f562c = {}) {
    if (_0x5f562c["placement"] === "viewport-center-sequence") {
      return _0x384669();
    }
    const {
      viewport: _0x1f86ef
    } = _0x2fded8();
    const _0x34feb2 = getVisibleCanvasCenterScreenPosition(_0x1f86ef);
    const _0x3b0eb1 = _0x388cd5?.() || {};
    const _0x4b1752 = typeof _0x3b0eb1['x'] === 'number' && Number["isFinite"](_0x3b0eb1['x']) ? _0x3b0eb1['x'] : _0x34feb2['x'];
    const _0x2028fe = typeof _0x3b0eb1['y'] === "number" && Number['isFinite'](_0x3b0eb1['y']) ? _0x3b0eb1['y'] : _0x34feb2['y'];
    const _0x16b03b = typeof _0x5f562c["screenX"] === 'number' && Number["isFinite"](_0x5f562c["screenX"]) ? _0x5f562c["screenX"] : _0x4b1752;
    const _0x5d9ebf = typeof _0x5f562c['screenY'] === "number" && Number["isFinite"](_0x5f562c["screenY"]) ? _0x5f562c["screenY"] : _0x2028fe;
    return screenToWorld(_0x16b03b, _0x5d9ebf, _0x1f86ef);
  }
  function _0x384669() {
    const {
      viewport: _0x1b155c
    } = _0x2fded8();
    const {
      x: _0x48eb9f,
      y: _0x3828f6
    } = getVisibleCanvasCenterScreenPosition(_0x1b155c);
    return screenToWorld(_0x48eb9f, _0x3828f6, _0x1b155c);
  }
  function _0x2ca076(_0x5eba8c, _0xc803e7, _0x567447, _0x307192, _0x534b09 = {}) {
    const {
      x: _0x3fe9cf,
      y: _0x2f5669
    } = _0x56e14e(_0x534b09);
    const _0x115ff5 = generateId(_0x5eba8c);
    const _0x1823e6 = _0x5eba8c === "ai-text" ? _0x59dd02('ai-text') : _0x5eba8c === "ai-image" || _0x5eba8c === "ai-video" ? _0x4f56d6(_0xc803e7, _0x567447) : {
      'width': _0xc803e7,
      'height': _0x567447
    };
    const _0x1e2668 = _0x1823e6['width'];
    const _0x515230 = _0x1823e6["height"];
    const _0x301e34 = _0x4039ad?.({
      'type': _0x5eba8c,
      'id': _0x115ff5,
      'x': _0x3fe9cf - _0x1e2668 / 0x2,
      'y': _0x2f5669 - _0x515230 / 0x2,
      'width': _0x1e2668,
      'height': _0x515230,
      'name': _0x307192
    }) || {
      'id': _0x115ff5,
      'type': _0x5eba8c,
      'x': _0x3fe9cf - _0x1e2668 / 0x2,
      'y': _0x2f5669 - _0x515230 / 0x2,
      'width': _0x1e2668,
      'height': _0x515230,
      'name': _0x307192
    };
    _0x5eba8c === "comment-note" && (_0x301e34["name"] = '', _0x301e34['content'] = '', _0x301e34["style"] = createDefaultCommentNoteStyle());
    if (_0x534b09["placement"] === 'viewport-center-sequence') {
      const {
        spacing: _0x3c159b,
        direction: _0x3c256d,
        avoidOverlap: _0x5e9225
      } = getNodeSpawnPrefs();
      const _0x23a1b2 = normalizeSpawnDirection(_0x3c256d);
      const _0x3d6e02 = _0x3fe9cf - _0x1e2668 / 0x2;
      const _0x2e8a02 = _0x2f5669 - _0x515230 / 0x2;
      const _0x38b731 = _0x2fded8()['nodes'] || {};
      const _0x3aee03 = String(_0x534b09['sequenceKey'] || '')["trim"]();
      const _0x141c1f = _0x5e9225 ? _0x38b731 : getSequenceNodes(_0x38b731, _0x3aee03);
      const _0x37fa61 = findAvailablePosition(_0x141c1f, _0x3d6e02, _0x2e8a02, _0x1e2668, _0x515230, _0x3c159b, _0x23a1b2);
      _0x301e34['x'] = _0x37fa61['x'];
      _0x301e34['y'] = _0x37fa61['y'];
      if (_0x3aee03) {
        _0x301e34["spawnSequenceKey"] = _0x3aee03;
      }
    }
    _0x46a57c["addNode"](_0x301e34);
    _0x46a57c["setSelectedNodes"]([_0x115ff5]);
    if (_0x534b09['skipCommit'] !== !![]) {
      _0x2a14bb();
    }
    return _0x301e34;
  }
  async function _0x46754a(_0xf373d9, _0x27eaeb, _0x49862c, _0x5fd6ca, _0x29dda0 = {}) {
    if (!_0xf373d9 || !_0x27eaeb) {
      return ![];
    }
    const _0x3446b8 = resolvePastedMediaDescriptor(String(_0x27eaeb), _0x29dda0);
    if (!_0x3446b8) {
      return ![];
    }
    const _0x1728b9 = getMimeExtension(_0x27eaeb, 'dat');
    const _0x1a52b6 = "pasted-" + _0x3446b8["typeSlug"] + '-' + Date['now']() + '.' + _0x1728b9;
    const _0x1291f5 = new File([_0xf373d9], _0x1a52b6, {
      'type': _0x27eaeb
    });
    const _0x5df243 = _0x29dda0["projectId"] || _0x50b428?.() || "default_v2_project";
    const _0x1580c8 = await _0x142e89(_0x1291f5, _0x49862c, _0x5fd6ca, _0x5df243);
    if (!_0x1580c8) {
      return ![];
    }
    if (_0x29dda0['isImportCurrent']?.() === ![]) {
      return ![];
    }
    const _0xf4437 = centerNodeAtWorldPosition(_0x1580c8, _0x49862c, _0x5fd6ca);
    if (_0x29dda0["placement"] === 'viewport-center-sequence') {
      const {
        spacing: _0x307a09,
        direction: _0x2f5e1c,
        avoidOverlap: _0x14c2ec
      } = getNodeSpawnPrefs();
      const _0x4ec320 = normalizeSpawnDirection(_0x2f5e1c);
      const _0x9c5c8c = Number(_0xf4437['width']) || 0x12c;
      const _0x361805 = Number(_0xf4437["height"]) || 0xc8;
      const _0x5e7c28 = _0x49862c - _0x9c5c8c / 0x2;
      const _0x19fdf1 = _0x5fd6ca - _0x361805 / 0x2;
      const _0x5958af = _0x2fded8()["nodes"] || {};
      const _0x1c282e = String(_0x29dda0["sequenceKey"] || '')["trim"]();
      const _0x1d634b = _0x14c2ec ? _0x5958af : getSequenceNodes(_0x5958af, _0x1c282e);
      const _0xbae950 = findAvailablePosition(_0x1d634b, _0x5e7c28, _0x19fdf1, _0x9c5c8c, _0x361805, _0x307a09, _0x4ec320);
      _0xf4437['x'] = _0xbae950['x'];
      _0xf4437['y'] = _0xbae950['y'];
      if (_0x1c282e) {
        _0xf4437["spawnSequenceKey"] = _0x1c282e;
      }
    }
    _0xf4437['name'] = _0x3446b8['nodeName'];
    _0x46a57c['addNode'](_0xf4437);
    _0x46a57c["setSelectedNodes"]([_0xf4437['id']]);
    _0x2a14bb();
    return _0x29dda0["returnNode"] === !![] ? _0xf4437 : !![];
  }
  async function _0x5672ef(_0x361ca3, _0xcd5953, _0x5790b8 = {}) {
    _0x5790b8 = _0x1a3dc2(_0x5790b8);
    const {
      x: _0x45037e,
      y: _0x182fe9
    } = _0x56e14e(_0x5790b8);
    return await _0x46754a(_0x361ca3, _0xcd5953, _0x45037e, _0x182fe9, _0x5790b8);
  }
  function _0x1197d1(_0x14ede2) {
    if (typeof File !== "function") {
      return null;
    }
    const _0xe8c1b1 = String(_0x14ede2?.['path'] || '')['trim']();
    const _0x3e5990 = String(_0x14ede2?.['name'] || _0xe8c1b1['split'](/[\\/]/)['pop']() || 'clipboard-file');
    const _0x300f69 = String(_0x14ede2?.["type"] || '')["trim"]();
    if (!_0xe8c1b1 || !_0x300f69) {
      return null;
    }
    const _0x54411f = new File([], _0x3e5990, {
      'type': _0x300f69
    });
    try {
      Object['defineProperty'](_0x54411f, "path", {
        'value': _0xe8c1b1,
        'configurable': !![]
      });
    } catch {
      _0x54411f["path"] = _0xe8c1b1;
    }
    return _0x54411f;
  }
  async function _0x443159(_0xabf922, _0x534f3c, _0xf45221, _0x44b7ba) {
    const _0x1724e8 = String(_0xabf922?.["type"] || '')["trim"]();
    const _0x585864 = resolvePastedMediaDescriptor(_0x1724e8);
    if (!_0x585864) {
      return ![];
    }
    const _0x56079f = _0x1197d1(_0xabf922);
    if (!_0x56079f) {
      return ![];
    }
    const _0x14d23f = _0x44b7ba["projectId"];
    const _0x5eec09 = await _0x142e89(_0x56079f, _0x534f3c, _0xf45221, _0x14d23f);
    if (!_0x5eec09 || !_0x44b7ba["isImportCurrent"]()) {
      return ![];
    }
    const _0x18d15a = centerNodeAtWorldPosition(_0x5eec09, _0x534f3c, _0xf45221);
    _0x18d15a['name'] = _0x585864["nodeName"];
    _0x46a57c["addNode"](_0x18d15a);
    _0x46a57c['setSelectedNodes']([_0x18d15a['id']]);
    _0x2a14bb();
    return !![];
  }
  async function _0x3b4039(_0x336d25, _0x19bbe8, _0xa7ca94, _0x4bbcc5) {
    if (!Array['isArray'](_0x336d25) || _0x336d25["length"] === 0x0) {
      return 0x0;
    }
    let _0x2d0b30 = 0x0;
    for (const _0x350daf of _0x336d25) {
      if (!_0x4bbcc5["isImportCurrent"]()) {
        break;
      }
      const _0x483a2a = _0x2d0b30 * 0x1e;
      const _0x42a70f = await _0x443159(_0x350daf, _0x19bbe8 + _0x483a2a, _0xa7ca94 + _0x483a2a, _0x4bbcc5);
      if (_0x42a70f) {
        _0x2d0b30 += 0x1;
      }
    }
    return _0x2d0b30;
  }
  function _0x31df03(_0x7a9254, _0x4fb8a9, _0x25635d) {
    const {
      width: _0x3853cc,
      height: _0x423743
    } = _0x4bd4a7('source-text');
    const _0x14895a = generateId("source-text");
    _0x46a57c["addNode"]({
      'id': _0x14895a,
      'type': "source-text",
      'x': _0x4fb8a9 - _0x3853cc / 0x2,
      'y': _0x25635d - _0x423743 / 0x2,
      'width': _0x3853cc,
      'height': _0x423743,
      'name': t("canvasNodeFlows.paste.nodeName.text"),
      'content': String(_0x7a9254 || '')
    });
    _0x46a57c['setSelectedNodes']([_0x14895a]);
    _0x2a14bb();
  }
  async function _0x2c8eff(_0x3466f0 = {}) {
    _0x3466f0 = _0x1a3dc2(_0x3466f0);
    const {
      x: _0x212f51,
      y: _0x116834
    } = _0x56e14e(_0x3466f0);
    const {
      getClipboard: _0x50cbe2,
      getClipboardMeta: _0x16870a,
      observeSystemClipboardSignature: _0x345232
    } = await loadClipboardModule();
    if (!_0x3466f0["isImportCurrent"]()) {
      return;
    }
    const _0x25b814 = _0x50cbe2();
    const _0x54f0da = _0x16870a();
    const {
      pastedFiles: _0x2b9d72,
      pastedMedia: _0x1875f3,
      pastedText: _0xe03626,
      clipboardReadFailed: _0x16252b
    } = await readSystemClipboardContents();
    if (!_0x3466f0['isImportCurrent']()) {
      return;
    }
    const _0x32bd91 = String(_0xe03626 || '')["trim"]();
    const _0x367859 = Array["isArray"](_0x2b9d72) && _0x2b9d72["length"] > 0x0 || !!_0x1875f3 || !!_0x32bd91;
    const _0x120932 = _0x367859 ? await buildSystemClipboardSignature({
      'pastedFiles': _0x2b9d72,
      'pastedMedia': _0x1875f3,
      'pastedText': _0xe03626
    }) : '';
    if (!_0x3466f0["isImportCurrent"]()) {
      return;
    }
    const _0x2cf58 = _0x25b814 && _0x25b814["length"] > 0x0;
    const _0x195b5d = Number(_0x54f0da?.["copiedAt"]) || 0x0;
    const _0x84e31a = Number(_0x54f0da?.["systemCopiedAt"]) || 0x0;
    const _0x4d74f6 = String(_0x54f0da?.["systemSignatureAtCopy"] || '');
    const _0x33c8e0 = String(_0x54f0da?.["systemSignature"] || '');
    _0x120932 && _0x345232(_0x120932);
    if (_0x2cf58) {
      const _0x260ace = _0x84e31a > _0x195b5d && _0x195b5d > 0x0;
      const _0x43b6ab = _0x195b5d > _0x84e31a && _0x84e31a > 0x0;
      const _0x2eea4c = !!_0x4d74f6 && !!_0x120932;
      const _0x1dcad0 = _0x2eea4c ? _0x4d74f6 === _0x120932 : ![];
      const _0x164124 = _0x2eea4c ? _0x4d74f6 !== _0x120932 : ![];
      const _0xda482d = !_0x4d74f6 && !!_0x33c8e0 && _0x33c8e0 === _0x120932;
      const _0x2ba3bf = !_0x367859 && !_0x16252b || _0x1dcad0 || _0x43b6ab && _0xda482d;
      if (_0x2ba3bf && !_0x260ace && !_0x164124) {
        _0x4b04f3("paste", {
          'x': _0x212f51,
          'y': _0x116834
        });
        return;
      }
    }
    if (Array["isArray"](_0x2b9d72) && _0x2b9d72["length"] > 0x0) {
      const _0x1c499f = await _0x3b4039(_0x2b9d72, _0x212f51, _0x116834, _0x3466f0);
      if (!_0x3466f0["isImportCurrent"]()) {
        return;
      }
      if (_0x1c499f > 0x0) {
        _0x451ea6?.(_0x1c499f === 0x1 ? t("canvasNodeFlows.paste.filePasted") : t("canvasNodeFlows.paste.filesPasted", {
          'count': _0x1c499f
        }), 'success');
        return;
      }
    }
    if (_0x1875f3) {
      const _0x6806a0 = await _0x46754a(_0x1875f3['blob'], _0x1875f3["mimeType"], _0x212f51, _0x116834, _0x3466f0);
      if (!_0x3466f0["isImportCurrent"]()) {
        return;
      }
      if (_0x6806a0) {
        const _0x4dc2c5 = _0x1875f3["mimeType"]["startsWith"]("image/") ? t("canvasNodeFlows.media.image") : _0x1875f3["mimeType"]["startsWith"]('video/') ? t("canvasNodeFlows.media.video") : t("canvasNodeFlows.media.audio");
        _0x451ea6?.(t('canvasNodeFlows.paste.mediaPasted', {
          'label': _0x4dc2c5
        }), "success");
        return;
      }
    }
    if (_0x32bd91) {
      _0x31df03(_0x32bd91, _0x212f51, _0x116834);
      _0x451ea6?.(t('canvasNodeFlows.paste.textPasted'), 'success');
      return;
    }
    if (_0x25b814 && _0x25b814["length"] > 0x0 && !_0x16252b) {
      _0x4b04f3("paste", {
        'x': _0x212f51,
        'y': _0x116834
      });
      return;
    }
    if (_0x16252b) {
      _0x451ea6?.(t("canvasNodeFlows.paste.clipboardReadFailed"), "error");
      return;
    }
    _0x451ea6?.(t("canvasNodeFlows.paste.clipboardEmpty"), 'warning');
  }
  return {
    'createNodeAtCursor': _0x2ca076,
    'createMediaNodeFromBlob': _0x5672ef,
    'handlePasteFromClipboard': _0x2c8eff
  };
}