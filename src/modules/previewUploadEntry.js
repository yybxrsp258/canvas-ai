import a1300_0x51aea4 from '../core/stores/appStore.js';
import { t } from '../i18n/index.js';
import { uploadFile } from './project.js';
import { readFileNaturalSize } from '../services/fileService.js';
import { applyUploadedPreviewAudioResult, applyUploadedPreviewImageResult, applyUploadedPreviewVideoResult } from './previewUploadResult.js';
const PREVIEW_UPLOAD_TYPES = {
  'image': {
    'accept': "image/*",
    'mimePrefix': "image/",
    'labelKey': "previewUpload.types.image",
    'successMessageKey': "previewUpload.success.image",
    'applyResult': applyUploadedPreviewImageResult,
    'nodeTypes': new Set(["source-image", "image", "ai-image"])
  },
  'video': {
    'accept': "video/*",
    'mimePrefix': "video/",
    'labelKey': "previewUpload.types.video",
    'successMessageKey': "previewUpload.success.video",
    'applyResult': applyUploadedPreviewVideoResult,
    'nodeTypes': new Set(["source-video", "video", "ai-video"])
  },
  'audio': {
    'accept': 'audio/*',
    'mimePrefix': "audio/",
    'labelKey': 'previewUpload.types.audio',
    'successMessageKey': "previewUpload.success.audio",
    'applyResult': applyUploadedPreviewAudioResult,
    'nodeTypes': new Set(["source-audio", "audio", "ai-audio"])
  }
};
const OPTIMISTIC_IMAGE_PREVIEW_SELECTOR = ".preview-upload-optimistic-media";
const DEFAULT_OPTIMISTIC_PREVIEW_FINALIZE_DELAY_MS = 0x15e;
const DEFAULT_OPTIMISTIC_PREVIEW_COMMIT_TIMEOUT_MS = 0x7530;
function shouldReadPreviewUploadNaturalSize(_0x4cf582 = {}) {
  return _0x4cf582["kind"] === 'image';
}
function previewUploadText(_0x524c7d, _0x2b000d = {}) {
  return t('previewUpload.' + _0x524c7d, _0x2b000d);
}
function getPreviewUploadTypeLabel(_0x2ffa1e) {
  return t(_0x2ffa1e["labelKey"]);
}
function getPreviewUploadSuccessMessage(_0x4324bf) {
  return t(_0x4324bf["successMessageKey"]);
}
function getState(_0x4efdd9) {
  return _0x4efdd9?.['getState']?.() || {};
}
function getToast(_0x10c1ce) {
  return typeof _0x10c1ce === "function" ? _0x10c1ce : globalThis["window"]?.["showToast"];
}
function setButtonBusy(_0x45c5e3, _0x1eee28) {
  if (!_0x45c5e3) {
    return;
  }
  if (_0x1eee28) {
    !_0x45c5e3['dataset']["previewUploadLabel"] && (_0x45c5e3["dataset"]["previewUploadLabel"] = _0x45c5e3['textContent'] || previewUploadText("upload"));
    _0x45c5e3["disabled"] = !![];
    _0x45c5e3['textContent'] = previewUploadText("uploading");
    return;
  }
  _0x45c5e3["disabled"] = ![];
  _0x45c5e3["textContent"] = _0x45c5e3["dataset"]["previewUploadLabel"] || previewUploadText('upload');
}
function setToolbarUploadButtonBusy(_0x428e01, _0x931827) {
  if (!_0x428e01) {
    return;
  }
  _0x428e01["disabled"] = _0x931827 === !![];
  _0x428e01["classList"]?.['toggle']?.("is-uploading", _0x931827 === !![]);
  _0x428e01["classList"]?.['toggle']?.("is-task-running", _0x931827 === !![]);
  _0x931827 === !![] ? _0x428e01["setAttribute"]?.("aria-busy", "true") : _0x428e01["removeAttribute"]?.('aria-busy');
}
function createToolbarUploadInput(_0xd9b49f) {
  const _0x5c3948 = _0xd9b49f?.["ownerDocument"] || globalThis["document"] || null;
  if (!_0x5c3948?.["createElement"]) {
    return null;
  }
  const _0x31b20b = _0x5c3948["createElement"]("input");
  _0x31b20b["type"] = 'file';
  _0x31b20b['hidden'] = !![];
  _0x31b20b['className'] = 'node-toolbar-upload-input';
  const _0x323419 = _0xd9b49f?.['closest']?.(".node-floating-toolbar") || _0xd9b49f?.["parentNode"] || _0x5c3948["body"] || null;
  _0x323419?.["appendChild"]?.(_0x31b20b);
  return _0x31b20b;
}
function getUrlApi() {
  return globalThis['URL'] || globalThis["webkitURL"] || null;
}
function safelyCreateObjectUrl(_0x9f2e23) {
  const _0x58ad11 = getUrlApi();
  if (!_0x9f2e23 || typeof _0x58ad11?.["createObjectURL"] !== "function") {
    return '';
  }
  try {
    return String(_0x58ad11['createObjectURL'](_0x9f2e23) || '')['trim']();
  } catch {
    return '';
  }
}
function safelyRevokeObjectUrl(_0x5d3aec) {
  if (!_0x5d3aec || !String(_0x5d3aec)['startsWith']("blob:")) {
    return;
  }
  const _0x75b201 = getUrlApi();
  try {
    _0x75b201?.["revokeObjectURL"]?.(_0x5d3aec);
  } catch {}
}
function getMountedPreviewElement(_0x24e3a3) {
  const _0x1966e7 = String(_0x24e3a3 || '')["trim"]();
  if (!_0x1966e7) {
    return null;
  }
  const _0x213fd8 = globalThis["window"]?.["v2Renderer"];
  try {
    _0x213fd8?.['hydrateDeferredNodeForImmediateMedia']?.(_0x1966e7);
  } catch {}
  try {
    const _0x285d53 = _0x213fd8?.["queryMountedNodeElement"]?.(_0x1966e7, '.img-node-preview');
    if (_0x285d53) {
      return _0x285d53;
    }
  } catch {}
  const _0x231ee9 = globalThis['document'];
  const _0x4d1928 = typeof _0x213fd8?.['getMountedWrapper'] === 'function' ? _0x213fd8["getMountedWrapper"](_0x1966e7) : null;
  if (_0x4d1928?.["querySelector"]) {
    return _0x4d1928['querySelector'](".img-node-preview");
  }
  const _0x2b8c5a = typeof _0x231ee9?.["getElementById"] === "function" ? _0x231ee9["getElementById"](_0x1966e7) : null;
  return _0x2b8c5a?.["querySelector"]?.(".img-node-preview") || null;
}
function clearExistingOptimisticImagePreview(_0x2f495e) {
  if (!_0x2f495e) {
    return;
  }
  if (typeof _0x2f495e["_previewUploadOptimisticCleanup"] === "function") {
    _0x2f495e["_previewUploadOptimisticCleanup"]({
      'delayMs': 0x0,
      'force': !![]
    });
    return;
  }
  _0x2f495e["querySelectorAll"]?.(OPTIMISTIC_IMAGE_PREVIEW_SELECTOR)?.["forEach"](_0x48dad4 => _0x48dad4["remove"]?.());
}
function hasClassName(_0x292d6f, _0xb1dc6c) {
  return _0x292d6f?.['classList']?.["contains"]?.(_0xb1dc6c) || String(_0x292d6f?.["className"] || '')["split"](/\s+/)['includes'](_0xb1dc6c);
}
function getPreviewImageElements(_0x344317) {
  const _0x5f40a4 = Array["from"](_0x344317?.["querySelectorAll"]?.("img") || []);
  return _0x5f40a4['filter'](_0x3473c6 => !hasClassName(_0x3473c6, "preview-upload-optimistic-media"));
}
function getImageElementSrc(_0x2b4f78) {
  return String(_0x2b4f78?.["currentSrc"] || _0x2b4f78?.["src"] || _0x2b4f78?.["getAttribute"]?.("src") || '')["trim"]();
}
function getImageElementAttributeSrc(_0x39a500) {
  return String(_0x39a500?.['src'] || _0x39a500?.['getAttribute']?.('src') || '')["trim"]();
}
function normalizeUrlPathForCompare(_0x427fab = '') {
  const _0x2d97cb = String(_0x427fab || '')['trim']();
  if (!_0x2d97cb) {
    return '';
  }
  try {
    return new URL(_0x2d97cb, "http://aic.local")["pathname"]["replace"](/\/+/g, '/');
  } catch {
    return _0x2d97cb['split']('?')[0x0]["split"]('#')[0x0]['replace'](/\\/g, '/');
  }
}
function imageSrcMatchesExpected(_0x373c64 = '', _0x2baa3f = []) {
  const _0x4b415e = normalizeUrlPathForCompare(_0x373c64);
  if (!_0x4b415e) {
    return ![];
  }
  const _0x5b4eec = _0x2baa3f["map"](_0x4f2e51 => normalizeUrlPathForCompare(_0x4f2e51))["filter"](Boolean);
  if (_0x5b4eec["length"] === 0x0) {
    return !![];
  }
  return _0x5b4eec['some'](_0x53628e => _0x4b415e === _0x53628e || _0x4b415e["endsWith"](_0x53628e));
}
function toUploadedPreviewLocalUrl(_0x50941f = '') {
  const _0x4630bb = String(_0x50941f || '')["trim"]()['replace'](/\\/g, '/');
  if (!_0x4630bb) {
    return '';
  }
  if (/^(?:https?:|blob:|data:|aic-local-preview:)/i["test"](_0x4630bb)) {
    return _0x4630bb;
  }
  return _0x4630bb['startsWith']('/') ? _0x4630bb : '/' + _0x4630bb;
}
function resolveUploadedPreviewImageExpectedUrls(_0x1d2efa = {}) {
  return Array["from"](new Set([_0x1d2efa?.["displayUrl"], _0x1d2efa?.["originalUrl"], _0x1d2efa?.["url"], toUploadedPreviewLocalUrl(_0x1d2efa?.["displayLocalPath"]), toUploadedPreviewLocalUrl(_0x1d2efa?.['originalLocalPath']), toUploadedPreviewLocalUrl(_0x1d2efa?.["localPath"])]["map"](_0x118dd1 => String(_0x118dd1 || '')["trim"]())["filter"](Boolean)));
}
function getMountedPreviewImageSrc(_0x2e860d) {
  const _0x862de8 = getPreviewImageElements(_0x2e860d);
  for (const _0x243031 of _0x862de8) {
    const _0x48e982 = getImageElementSrc(_0x243031);
    if (_0x48e982) {
      return _0x48e982;
    }
  }
  return '';
}
function waitForUploadedPreviewImageCommit({
  nodeId: _0x4114f5,
  previousSrc = '',
  expectedUrls = [],
  timeoutMs = DEFAULT_OPTIMISTIC_PREVIEW_COMMIT_TIMEOUT_MS,
  onPoll = null
} = {}) {
  const _0x3c22f6 = String(_0x4114f5 || '')["trim"]();
  if (!_0x3c22f6) {
    return Promise["resolve"](![]);
  }
  return new Promise(_0x5dfc93 => {
    let _0x995784 = ![];
    let _0x2b3717 = null;
    let _0x4c82ca = null;
    const _0x58ab69 = new Set();
    const _0x341c07 = [];
    const _0x23076b = _0x2a2b2d => {
      if (_0x995784) {
        return;
      }
      _0x995784 = !![];
      if (_0x2b3717 !== null) {
        clearTimeout(_0x2b3717);
      }
      if (_0x4c82ca !== null) {
        clearTimeout(_0x4c82ca);
      }
      for (const _0x5d2841 of _0x341c07['splice'](0x0)) {
        _0x5d2841();
      }
      _0x5dfc93(_0x2a2b2d);
    };
    const _0x2938fa = _0x90e080 => {
      if (!_0x90e080?.["addEventListener"] || _0x58ab69['has'](_0x90e080)) {
        return;
      }
      _0x58ab69["add"](_0x90e080);
      const _0x4d14fc = String(_0x90e080["currentSrc"] || '')["trim"]() || getImageElementAttributeSrc(_0x90e080) || getImageElementSrc(_0x90e080);
      if (_0x90e080["complete"] && _0x4d14fc !== previousSrc && imageSrcMatchesExpected(_0x4d14fc, expectedUrls)) {
        _0x23076b(!![]);
        return;
      }
      const _0x3bdb64 = () => {
        const _0x186bf2 = String(_0x90e080["currentSrc"] || '')["trim"]() || getImageElementSrc(_0x90e080);
        _0x186bf2 !== previousSrc && imageSrcMatchesExpected(_0x186bf2, expectedUrls) && _0x23076b(!![]);
      };
      const _0x531899 = () => {
        const _0x5f0397 = getImageElementAttributeSrc(_0x90e080) || getImageElementSrc(_0x90e080);
        _0x5f0397 !== previousSrc && imageSrcMatchesExpected(_0x5f0397, expectedUrls) && _0x23076b(!![]);
      };
      _0x90e080['addEventListener']("load", _0x3bdb64, {
        'once': !![]
      });
      _0x90e080['addEventListener']("error", _0x531899, {
        'once': !![]
      });
      _0x341c07['push'](() => {
        _0x90e080["removeEventListener"]?.("load", _0x3bdb64);
        _0x90e080["removeEventListener"]?.("error", _0x531899);
      });
    };
    const _0x31f620 = () => {
      if (typeof onPoll === "function") {
        onPoll();
      }
      const _0x4e6412 = getMountedPreviewElement(_0x3c22f6);
      const _0x2309fd = getPreviewImageElements(_0x4e6412);
      for (const _0x1b0ee5 of _0x2309fd) {
        const _0x406062 = getImageElementAttributeSrc(_0x1b0ee5) || getImageElementSrc(_0x1b0ee5);
        if (!_0x406062 || _0x406062 === previousSrc) {
          continue;
        }
        if (!imageSrcMatchesExpected(_0x406062, expectedUrls)) {
          continue;
        }
        _0x2938fa(_0x1b0ee5);
        return ![];
      }
      return ![];
    };
    const _0x342007 = () => {
      if (_0x995784 || _0x31f620()) {
        return;
      }
      _0x2b3717 = setTimeout(_0x342007, 0x50);
    };
    _0x4c82ca = setTimeout(() => _0x23076b(![]), Math["max"](0x0, Number(timeoutMs) || 0x0));
    _0x342007();
  });
}
function applyOptimisticImageUploadPreview({
  nodeId: _0x1b436d,
  file: _0x5d99f3
} = {}) {
  if (!String(_0x5d99f3?.["type"] || '')["startsWith"]("image/")) {
    return null;
  }
  const _0x1c498d = getMountedPreviewElement(_0x1b436d);
  const _0x2041c3 = _0x1c498d?.["ownerDocument"] || globalThis["document"];
  if (!_0x1c498d?.["appendChild"] || !_0x2041c3?.['createElement']) {
    return null;
  }
  const _0x33c9c6 = safelyCreateObjectUrl(_0x5d99f3);
  if (!_0x33c9c6) {
    return null;
  }
  clearExistingOptimisticImagePreview(_0x1c498d);
  const _0xd7bb27 = getMountedPreviewImageSrc(_0x1c498d);
  const _0x3bb9b0 = _0x2041c3['createElement']("img");
  _0x3bb9b0['className'] = 'preview-upload-optimistic-media';
  _0x3bb9b0["draggable"] = ![];
  _0x3bb9b0["alt"] = '';
  _0x3bb9b0['dataset']['previewUploadOptimistic'] = 'true';
  _0x3bb9b0["src"] = _0x33c9c6;
  let _0x15b898 = ![];
  let _0xd56d93 = null;
  let _0x2e8b3a = null;
  const _0x325c9d = (_0x390d4c = getMountedPreviewElement(_0x1b436d)) => {
    if (_0x15b898 || !_0x390d4c?.["appendChild"]) {
      return ![];
    }
    _0x2e8b3a && _0x2e8b3a !== _0x390d4c && _0x2e8b3a["_previewUploadOptimisticCleanup"] === _0x8bfa5f && delete _0x2e8b3a["_previewUploadOptimisticCleanup"];
    _0x3bb9b0["parentNode"] !== _0x390d4c && _0x390d4c['appendChild'](_0x3bb9b0);
    _0x390d4c["_previewUploadOptimisticCleanup"] = _0x8bfa5f;
    _0x2e8b3a = _0x390d4c;
    return !![];
  };
  const _0x3f2619 = () => {
    if (_0x15b898) {
      return;
    }
    _0x15b898 = !![];
    _0xd56d93 = null;
    _0x3bb9b0["remove"]?.();
    safelyRevokeObjectUrl(_0x33c9c6);
    _0x2e8b3a?.["_previewUploadOptimisticCleanup"] === _0x8bfa5f && delete _0x2e8b3a["_previewUploadOptimisticCleanup"];
  };
  function _0x8bfa5f({
    delayMs = 0x0,
    force = ![]
  } = {}) {
    if (_0x15b898) {
      return;
    }
    _0xd56d93 !== null && (clearTimeout(_0xd56d93), _0xd56d93 = null);
    const _0x41d203 = () => {
      _0x3f2619();
    };
    const _0x16ec5f = Math["max"](0x0, Number(delayMs) || 0x0);
    !force && _0x16ec5f > 0x0 && typeof setTimeout === "function" ? _0xd56d93 = setTimeout(_0x41d203, _0x16ec5f) : _0x41d203();
  }
  _0x325c9d(_0x1c498d);
  return {
    'cleanup': _0x8bfa5f,
    'ensureMounted': _0x325c9d,
    'objectUrl': _0x33c9c6,
    'previousMediaSrc': _0xd7bb27
  };
}
function flushUploadedPreviewNode(_0x5e4f3e) {
  const _0x167f66 = String(_0x5e4f3e || '')["trim"]();
  if (!_0x167f66) {
    return ![];
  }
  try {
    return globalThis["window"]?.["v2Renderer"]?.['flushNode']?.(_0x167f66) === !![];
  } catch {
    return ![];
  }
}
export function resolvePreviewUploadTarget(_0x44cdf6 = {}) {
  const _0x4f78f7 = Array['isArray'](_0x44cdf6['selectedNodeIds']) ? _0x44cdf6["selectedNodeIds"]["filter"](Boolean) : [];
  if (_0x4f78f7["length"] !== 0x1) {
    return {
      'ok': ![],
      'message': previewUploadText("selectSingleNode")
    };
  }
  const _0x51391b = _0x4f78f7[0x0];
  const _0x203a1a = _0x44cdf6["nodes"]?.[_0x51391b];
  if (!_0x203a1a) {
    return {
      'ok': ![],
      'message': previewUploadText('selectedNodeMissing')
    };
  }
  const _0x112ccc = String(_0x203a1a['type'] || '')["trim"]();
  for (const [_0x19c042, _0x4af583] of Object["entries"](PREVIEW_UPLOAD_TYPES)) {
    if (!_0x4af583["nodeTypes"]["has"](_0x112ccc)) {
      continue;
    }
    return {
      'ok': !![],
      'kind': _0x19c042,
      'nodeId': _0x51391b,
      'node': _0x203a1a,
      'accept': _0x4af583["accept"],
      'mimePrefix': _0x4af583["mimePrefix"],
      'label': getPreviewUploadTypeLabel(_0x4af583),
      'successMessage': getPreviewUploadSuccessMessage(_0x4af583),
      'applyResult': _0x4af583["applyResult"]
    };
  }
  return {
    'ok': ![],
    'message': previewUploadText("unsupportedNode")
  };
}
export async function handlePreviewUploadFile({
  file: _0x5923f2,
  button = null,
  storeApi = a1300_0x51aea4,
  uploadFileImpl = uploadFile,
  showToast = null,
  getProjectId = () => globalThis["window"]?.['currentProjectId'] || 'default_v2_project',
  applyResults = {},
  optimisticPreviewFinalizeDelayMs = DEFAULT_OPTIMISTIC_PREVIEW_FINALIZE_DELAY_MS
} = {}) {
  const _0x36ad61 = getToast(showToast);
  const _0x32efc9 = resolvePreviewUploadTarget(getState(storeApi));
  if (!_0x32efc9['ok']) {
    _0x36ad61?.(_0x32efc9["message"], "warn");
    return ![];
  }
  if (!_0x5923f2) {
    return ![];
  }
  if (!String(_0x5923f2["type"] || '')["startsWith"](_0x32efc9["mimePrefix"])) {
    _0x36ad61?.(previewUploadText("invalidFileType", {
      'label': _0x32efc9['label']
    }), "error");
    return ![];
  }
  setButtonBusy(button, !![]);
  const _0x11593d = _0x32efc9["kind"] === "image" ? applyOptimisticImageUploadPreview({
    'nodeId': _0x32efc9["nodeId"],
    'file': _0x5923f2
  }) : null;
  const _0x110af9 = shouldReadPreviewUploadNaturalSize(_0x32efc9) ? readFileNaturalSize(_0x5923f2, "source-image")["catch"](() => null) : Promise['resolve'](null);
  try {
    const _0xb3e285 = await uploadFileImpl(_0x5923f2, getProjectId());
    const _0x764371 = await _0x110af9;
    const _0x71eef0 = applyResults[_0x32efc9["kind"]] || _0x32efc9["applyResult"];
    _0x71eef0({
      'nodeId': _0x32efc9["nodeId"],
      'uploadRes': _0xb3e285,
      'fileName': _0x5923f2["name"],
      'mediaNaturalSize': _0x764371
    });
    flushUploadedPreviewNode(_0x32efc9["nodeId"]);
    _0x11593d && (_0x11593d["ensureMounted"]?.(), waitForUploadedPreviewImageCommit({
      'nodeId': _0x32efc9["nodeId"],
      'previousSrc': _0x11593d["previousMediaSrc"],
      'expectedUrls': resolveUploadedPreviewImageExpectedUrls(_0xb3e285),
      'onPoll': () => _0x11593d["ensureMounted"]?.()
    })['catch'](() => ![])["then"](() => {
      _0x11593d["cleanup"]({
        'delayMs': optimisticPreviewFinalizeDelayMs
      });
    }));
    _0x36ad61?.(_0x32efc9["successMessage"], "success");
    return !![];
  } catch (_0x2e430b) {
    _0x11593d?.["cleanup"]({
      'delayMs': 0x0
    });
    _0x36ad61?.(_0x2e430b?.["message"] || previewUploadText("uploadFailed"), "error");
    return ![];
  } finally {
    setButtonBusy(button, ![]);
  }
}
export function bindPreviewUploadEntry({
  button: _0x65cd2e,
  input: _0x20096d,
  storeApi = a1300_0x51aea4,
  uploadFileImpl = uploadFile,
  showToast = null,
  getProjectId: _0xb072f3,
  applyResults: _0x3e2492
} = {}) {
  if (!_0x65cd2e || !_0x20096d) {
    return null;
  }
  const _0x19eede = getToast(showToast);
  const _0x2d07d4 = () => {
    const _0x27abe3 = resolvePreviewUploadTarget(getState(storeApi));
    if (!_0x27abe3['ok']) {
      _0x19eede?.(_0x27abe3["message"], 'warn');
      return;
    }
    _0x20096d["accept"] = _0x27abe3["accept"];
    _0x20096d['value'] = '';
    _0x20096d["click"]?.();
  };
  const _0x156980 = async () => {
    const _0x1d411c = _0x20096d["files"]?.[0x0];
    if (!_0x1d411c) {
      return;
    }
    try {
      await handlePreviewUploadFile({
        'file': _0x1d411c,
        'button': _0x65cd2e,
        'storeApi': storeApi,
        'uploadFileImpl': uploadFileImpl,
        'showToast': showToast,
        'getProjectId': _0xb072f3,
        'applyResults': _0x3e2492
      });
    } finally {
      _0x20096d["value"] = '';
    }
  };
  _0x65cd2e["addEventListener"]("click", _0x2d07d4);
  _0x20096d["addEventListener"]("change", _0x156980);
  return () => {
    _0x65cd2e["removeEventListener"]?.("click", _0x2d07d4);
    _0x20096d["removeEventListener"]?.("change", _0x156980);
  };
}
export function bindPreviewUploadToolbarAction({
  button: _0x4c15cf,
  input = null,
  storeApi = a1300_0x51aea4,
  uploadFileImpl = uploadFile,
  showToast = null,
  getProjectId: _0x228652,
  applyResults: _0x29836f
} = {}) {
  if (!_0x4c15cf) {
    return () => {};
  }
  const _0x3240b9 = input || createToolbarUploadInput(_0x4c15cf);
  if (!_0x3240b9) {
    return () => {};
  }
  const _0x48233a = getToast(showToast);
  const _0x28c6a2 = _0x30dc62 => {
    _0x30dc62?.["preventDefault"]?.();
    _0x30dc62?.["stopPropagation"]?.();
    const _0x5f2abe = resolvePreviewUploadTarget(getState(storeApi));
    if (!_0x5f2abe['ok']) {
      _0x48233a?.(_0x5f2abe["message"], "warn");
      return;
    }
    _0x3240b9["accept"] = _0x5f2abe["accept"];
    _0x3240b9["value"] = '';
    _0x3240b9['click']?.();
  };
  const _0x2184d5 = async () => {
    const _0x58682f = _0x3240b9["files"]?.[0x0];
    if (!_0x58682f) {
      return;
    }
    setToolbarUploadButtonBusy(_0x4c15cf, !![]);
    try {
      await handlePreviewUploadFile({
        'file': _0x58682f,
        'button': null,
        'storeApi': storeApi,
        'uploadFileImpl': uploadFileImpl,
        'showToast': showToast,
        'getProjectId': _0x228652,
        'applyResults': _0x29836f
      });
    } finally {
      setToolbarUploadButtonBusy(_0x4c15cf, ![]);
      _0x3240b9["value"] = '';
    }
  };
  _0x4c15cf['addEventListener']("click", _0x28c6a2);
  _0x3240b9["addEventListener"]('change', _0x2184d5);
  return () => {
    _0x4c15cf['removeEventListener']?.("click", _0x28c6a2);
    _0x3240b9["removeEventListener"]?.('change', _0x2184d5);
  };
}