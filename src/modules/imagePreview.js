import { getImage } from './storage.js';
import { firstNonEmpty } from '../utils/validators.js';
import { createImageLoadDiagnostics, getImageLoadTiming } from '../services/imageLoadDiagnostics.js';
import { resolveCanvasImageDisplayUrl, resolveCanvasImagePreviewUrl, resolveCanvasImageSourceUrl, resolveCanvasImageThumbUrl } from '../services/canvasMediaLocalService.js';
import { attachMediaElementPlaybackSource, clearDesktopMediaPlaybackSourceMetadata } from '../services/desktopMediaBlobSource.js';
import { acquireLocalVideoPlaybackObjectUrl, releaseLocalVideoPlaybackObjectUrlOwner } from '../services/localVideoPlaybackObjectUrlService.js';
import { claimVideoPlaybackOwnership, detachVideoPlaybackRecovery } from '../components/video-node/mediaPlaybackRecovery.js';
export async function resolveNodeImageOriginalSource(_0x21481f) {
  if (!_0x21481f) {
    return null;
  }
  const _0xeb974b = Array["isArray"](_0x21481f["images"]) ? _0x21481f["images"] : [];
  const _0x256cb0 = _0x21481f["mainImageIndex"] || 0x0;
  const _0x56b447 = _0xeb974b[_0x256cb0] || null;
  const _0xa05e56 = firstNonEmpty(_0x56b447?.["sourceId"], _0x21481f["sourceId"]);
  if (_0xa05e56) {
    try {
      const _0x59de22 = await getImage(_0xa05e56);
      if (_0x59de22) {
        return {
          'url': URL['createObjectURL'](_0x59de22),
          'revokeUrlOnClose': !![]
        };
      }
    } catch (_0x1aa003) {}
  }
  const _0x4b974b = firstNonEmpty(resolveCanvasImageSourceUrl(_0x56b447), resolveCanvasImageSourceUrl(_0x21481f));
  if (_0x4b974b) {
    return {
      'url': _0x4b974b,
      'revokeUrlOnClose': ![]
    };
  }
  return null;
}
export async function resolveNodeImagePreviewSource(_0x2728fd) {
  const _0x2e6a1c = await resolveNodeImageOriginalSource(_0x2728fd);
  if (_0x2e6a1c?.["url"]) {
    return _0x2e6a1c;
  }
  const _0x535f71 = Array["isArray"](_0x2728fd?.["images"]) ? _0x2728fd['images'] : [];
  const _0x3bb2e4 = _0x2728fd?.['mainImageIndex'] || 0x0;
  const _0x3d5fdc = _0x535f71[_0x3bb2e4] || null;
  const _0x4ba704 = firstNonEmpty(resolveCanvasImagePreviewUrl(_0x3d5fdc), resolveCanvasImagePreviewUrl(_0x2728fd));
  if (_0x4ba704) {
    return {
      'url': _0x4ba704,
      'revokeUrlOnClose': ![]
    };
  }
  const _0x22c131 = firstNonEmpty(resolveCanvasImageThumbUrl(_0x3d5fdc), resolveCanvasImageThumbUrl(_0x2728fd));
  if (_0x22c131) {
    return {
      'url': _0x22c131,
      'revokeUrlOnClose': ![]
    };
  }
  return null;
}
function markSidebarSubmenuOwner(_0x53c41e, _0xe97573) {
  const _0x51528c = String(_0xe97573 || '')["trim"]();
  if (_0x51528c) {
    _0x53c41e['dataset']["sidebarSubmenuOwner"] = _0x51528c;
  }
}
function collectUniquePreviewUrls(_0x4a5544 = []) {
  const _0xc98c05 = [];
  const _0x589497 = new Set();
  for (const _0x5d39c4 of _0x4a5544) {
    const _0x40ac91 = String(_0x5d39c4 || '')["trim"]();
    if (!_0x40ac91 || _0x589497['has'](_0x40ac91)) {
      continue;
    }
    _0x589497["add"](_0x40ac91);
    _0xc98c05['push'](_0x40ac91);
  }
  return _0xc98c05;
}
function resolveImmediateNodeImagePreviewUrls(_0x1efe50, _0x2b3596 = '') {
  const _0xd98cba = Array["isArray"](_0x1efe50?.["images"]) ? _0x1efe50['images'] : [];
  const _0x23cfa2 = Math["max"](0x0, Number(_0x1efe50?.["mainImageIndex"]) || 0x0);
  const _0x17487b = _0xd98cba[_0x23cfa2] || _0xd98cba[0x0] || null;
  return collectUniquePreviewUrls([_0x2b3596, resolveCanvasImageDisplayUrl(_0x17487b), resolveCanvasImageDisplayUrl(_0x1efe50), resolveCanvasImagePreviewUrl(_0x17487b), resolveCanvasImagePreviewUrl(_0x1efe50), resolveCanvasImageThumbUrl(_0x17487b), resolveCanvasImageThumbUrl(_0x1efe50)]);
}
const IMAGE_PREVIEW_MIN_SCALE = 0.25;
const IMAGE_PREVIEW_MAX_SCALE = 0x6;
const IMAGE_PREVIEW_WHEEL_INTENSITY = 0.0015;
let activeImagePreviewClose = null;
let activeVideoPreviewClose = null;
let videoPreviewOwnerSequence = 0x0;
export function closeActiveImagePreview() {
  if (typeof activeImagePreviewClose !== "function") {
    return ![];
  }
  const _0x33aa0c = activeImagePreviewClose;
  _0x33aa0c();
  return !![];
}
export function closeActiveVideoPreview() {
  if (typeof activeVideoPreviewClose !== "function") {
    return ![];
  }
  const _0x186d44 = activeVideoPreviewClose;
  _0x186d44();
  return !![];
}
function clampNumber(_0x2d5ab4, _0x5759f8, _0x355b9f) {
  const _0x259c1f = Number(_0x2d5ab4);
  if (!Number["isFinite"](_0x259c1f)) {
    return _0x5759f8;
  }
  return Math['min'](_0x355b9f, Math['max'](_0x5759f8, _0x259c1f));
}
function stopPreviewEvent(_0x1f9b93) {
  _0x1f9b93?.['preventDefault']?.();
  _0x1f9b93?.["stopPropagation"]?.();
}
function getOverlayCenterPoint(_0xb3dc88) {
  const _0x5ae974 = _0xb3dc88["getBoundingClientRect"]?.();
  if (!_0x5ae974) {
    return {
      'x': (globalThis['window']?.["innerWidth"] || 0x0) / 0x2,
      'y': (globalThis["window"]?.['innerHeight'] || 0x0) / 0x2
    };
  }
  return {
    'x': _0x5ae974["left"] + _0x5ae974["width"] / 0x2,
    'y': _0x5ae974["top"] + _0x5ae974["height"] / 0x2
  };
}
function isPointerInsideElementBounds(_0x1c2ac6, _0x29cfbd) {
  if (!_0x1c2ac6 || !_0x29cfbd) {
    return ![];
  }
  const _0x440079 = Number(_0x29cfbd["clientX"]);
  const _0xf5816a = Number(_0x29cfbd['clientY']);
  if (!Number["isFinite"](_0x440079) || !Number["isFinite"](_0xf5816a)) {
    return _0x29cfbd["target"] === _0x1c2ac6;
  }
  const _0x2844fd = _0x1c2ac6["getBoundingClientRect"]?.();
  if (!_0x2844fd) {
    return _0x29cfbd["target"] === _0x1c2ac6;
  }
  const _0x4b74bc = Number(_0x2844fd['left']);
  const _0x3c16b9 = Number(_0x2844fd["top"]);
  const _0x2f2eb4 = Number["isFinite"](Number(_0x2844fd['right'])) ? Number(_0x2844fd["right"]) : _0x4b74bc + Number(_0x2844fd["width"] || 0x0);
  const _0x312871 = Number["isFinite"](Number(_0x2844fd['bottom'])) ? Number(_0x2844fd['bottom']) : _0x3c16b9 + Number(_0x2844fd['height'] || 0x0);
  if (!Number["isFinite"](_0x4b74bc) || !Number["isFinite"](_0x3c16b9) || !Number["isFinite"](_0x2f2eb4) || !Number["isFinite"](_0x312871) || _0x2f2eb4 <= _0x4b74bc || _0x312871 <= _0x3c16b9) {
    return _0x29cfbd["target"] === _0x1c2ac6;
  }
  return _0x440079 >= _0x4b74bc && _0x440079 <= _0x2f2eb4 && _0xf5816a >= _0x3c16b9 && _0xf5816a <= _0x312871;
}
function applyImagePreviewTransform(_0x2f6281, _0x8dc2d5, _0x485854) {
  _0x2f6281['style']["setProperty"]("--image-preview-offset-x", Math["round"](_0x485854["offsetX"] * 0x64) / 0x64 + 'px');
  _0x2f6281["style"]['setProperty']("--image-preview-offset-y", Math["round"](_0x485854["offsetY"] * 0x64) / 0x64 + 'px');
  _0x8dc2d5["style"]["setProperty"]('--image-preview-scale', String(Math["round"](_0x485854["scale"] * 0x3e8) / 0x3e8));
}
export function openImagePreview(_0xeebe85, _0x6c379b = {}) {
  const _0x534dd7 = _0x6c379b["deferredSource"] === !![];
  if (!_0xeebe85 && !_0x534dd7) {
    return () => {};
  }
  closeActiveVideoPreview();
  closeActiveImagePreview();
  let _0x5d1756 = collectUniquePreviewUrls([_0xeebe85, ...(Array["isArray"](_0x6c379b['fallbackUrls']) ? _0x6c379b["fallbackUrls"] : [])]);
  const _0x34dcd5 = new Set();
  if (_0x6c379b['revokeUrlOnClose'] && _0xeebe85) {
    _0x34dcd5['add'](_0xeebe85);
  }
  const _0x43f1e2 = {
    'scale': 0x1,
    'offsetX': 0x0,
    'offsetY': 0x0
  };
  let _0x38f2ce = null;
  let _0x5e3511 = ![];
  const _0xac59bb = document["createElement"]("div");
  _0xac59bb["className"] = 'v2-image-preview-overlay';
  _0xac59bb["style"]['zIndex'] = '99999';
  markSidebarSubmenuOwner(_0xac59bb, _0x6c379b["sidebarSubmenuOwner"]);
  const _0x5a0923 = document["createElement"]('div');
  _0x5a0923['className'] = "v2-image-preview-stage";
  const _0x22b0f4 = document["createElement"]("img");
  _0x22b0f4['className'] = "v2-image-preview-media";
  _0x22b0f4['alt'] = _0x6c379b["alt"] || "Image preview";
  _0x22b0f4["draggable"] = ![];
  let _0x107060 = 0x0;
  const _0xf7996a = _0x7c9de3 => {
    if (!_0x5d1756[_0x7c9de3]) {
      return ![];
    }
    _0x107060 = _0x7c9de3;
    _0xac59bb['classList']["add"]("is-loading");
    _0xac59bb["classList"]["remove"]('is-error');
    _0x6c379b["loadDiagnostics"]?.["mark"]("source-assigned");
    _0x22b0f4["src"] = _0x5d1756[_0x107060];
    return !![];
  };
  const _0x1f623b = () => {
    _0x6c379b['loadDiagnostics']?.['mark']('image-loaded', getImageLoadTiming(_0x22b0f4));
    _0xac59bb['classList']["remove"]('is-loading', "is-error");
    globalThis["window"]?.["requestAnimationFrame"]?.(() => globalThis["window"]["requestAnimationFrame"](() => {
      if (!_0x5e3511) {
        _0x6c379b["loadDiagnostics"]?.['mark']("paint-opportunity");
      }
    }));
  };
  const _0x27197e = () => {
    _0x6c379b["loadDiagnostics"]?.["mark"]('error');
    const _0x53b4fc = _0x107060 + 0x1;
    if (_0x53b4fc < _0x5d1756["length"]) {
      _0xf7996a(_0x53b4fc);
      return;
    }
    _0xac59bb["classList"]['remove']('is-loading');
    _0xac59bb["classList"]["add"]('is-error');
  };
  _0x22b0f4["addEventListener"]("load", _0x1f623b);
  _0x22b0f4["addEventListener"]('error', _0x27197e);
  if (!_0xf7996a(0x0)) {
    _0xac59bb["classList"]["add"]("is-loading");
  }
  applyImagePreviewTransform(_0x5a0923, _0x22b0f4, _0x43f1e2);
  const _0x1ab974 = () => {
    globalThis["window"]?.["removeEventListener"]?.("pointermove", _0x454744, !![]);
    globalThis["window"]?.["removeEventListener"]?.('pointerup', _0x33304c, !![]);
    globalThis['window']?.["removeEventListener"]?.("pointercancel", _0x33304c, !![]);
  };
  const _0x45a69a = () => {
    _0x1ab974();
    _0xac59bb["classList"]["remove"]("is-panning");
    _0x38f2ce = null;
  };
  const _0x4bff35 = () => {
    if (_0x5e3511) {
      return;
    }
    _0x5e3511 = !![];
    _0x6c379b['loadDiagnostics']?.["finish"]();
    document["removeEventListener"]("keydown", _0x5eba15, !![]);
    _0x45a69a();
    _0x22b0f4["removeEventListener"]("load", _0x1f623b);
    _0x22b0f4["removeEventListener"]("error", _0x27197e);
    _0xac59bb["remove"]();
    for (const _0x5900dd of _0x34dcd5) {
      try {
        URL["revokeObjectURL"](_0x5900dd);
      } catch (_0x402028) {}
    }
    if (activeImagePreviewClose === _0x4bff35) {
      activeImagePreviewClose = null;
    }
  };
  const _0x5eba15 = _0x471e3f => {
    _0x471e3f["key"] === "Escape" && (_0x471e3f['preventDefault']?.(), _0x471e3f["stopPropagation"]?.(), _0x4bff35());
  };
  const _0x46c367 = _0x532756 => {
    stopPreviewEvent(_0x532756);
    const _0x5f5b92 = _0x43f1e2["scale"];
    const _0x396612 = Math["exp"](-Number(_0x532756["deltaY"] || 0x0) * IMAGE_PREVIEW_WHEEL_INTENSITY);
    const _0x5f4e27 = clampNumber(_0x5f5b92 * _0x396612, IMAGE_PREVIEW_MIN_SCALE, IMAGE_PREVIEW_MAX_SCALE);
    if (_0x5f4e27 === _0x5f5b92) {
      return;
    }
    const _0x3e1ae8 = getOverlayCenterPoint(_0xac59bb);
    const _0x5b7786 = Number(_0x532756["clientX"] || 0x0) - _0x3e1ae8['x'];
    const _0x4cda74 = Number(_0x532756["clientY"] || 0x0) - _0x3e1ae8['y'];
    const _0x14123a = _0x5f4e27 / _0x5f5b92;
    _0x43f1e2["offsetX"] = _0x5b7786 - (_0x5b7786 - _0x43f1e2["offsetX"]) * _0x14123a;
    _0x43f1e2["offsetY"] = _0x4cda74 - (_0x4cda74 - _0x43f1e2["offsetY"]) * _0x14123a;
    _0x43f1e2["scale"] = _0x5f4e27;
    applyImagePreviewTransform(_0x5a0923, _0x22b0f4, _0x43f1e2);
  };
  const _0x44b98d = _0x2df2d2 => {
    const _0x29b8e6 = Number(_0x2df2d2?.["button"] ?? 0x0);
    const _0xbe8f57 = _0x29b8e6 === 0x1;
    if (!_0xbe8f57 && _0x29b8e6 !== 0x0) {
      return;
    }
    if (!_0xbe8f57 && !isPointerInsideElementBounds(_0x22b0f4, _0x2df2d2)) {
      return;
    }
    stopPreviewEvent(_0x2df2d2);
    _0x45a69a();
    _0x38f2ce = {
      'pointerId': _0x2df2d2["pointerId"],
      'startX': Number(_0x2df2d2["clientX"] || 0x0),
      'startY': Number(_0x2df2d2["clientY"] || 0x0),
      'offsetX': _0x43f1e2["offsetX"],
      'offsetY': _0x43f1e2["offsetY"]
    };
    _0xac59bb["classList"]["add"]("is-panning");
    _0x5a0923["setPointerCapture"]?.(_0x2df2d2['pointerId']);
    globalThis["window"]?.["addEventListener"]?.("pointermove", _0x454744, !![]);
    globalThis["window"]?.['addEventListener']?.("pointerup", _0x33304c, !![]);
    globalThis["window"]?.["addEventListener"]?.("pointercancel", _0x33304c, !![]);
  };
  function _0x454744(_0xfdcbb4) {
    if (!_0x38f2ce) {
      return;
    }
    if (_0x38f2ce["pointerId"] != null && _0xfdcbb4["pointerId"] != null && _0xfdcbb4["pointerId"] !== _0x38f2ce['pointerId']) {
      return;
    }
    stopPreviewEvent(_0xfdcbb4);
    _0x43f1e2["offsetX"] = _0x38f2ce["offsetX"] + Number(_0xfdcbb4['clientX'] || 0x0) - _0x38f2ce["startX"];
    _0x43f1e2['offsetY'] = _0x38f2ce["offsetY"] + Number(_0xfdcbb4['clientY'] || 0x0) - _0x38f2ce['startY'];
    applyImagePreviewTransform(_0x5a0923, _0x22b0f4, _0x43f1e2);
  }
  function _0x33304c(_0x330c89) {
    if (!_0x38f2ce) {
      return;
    }
    if (_0x38f2ce["pointerId"] != null && _0x330c89?.['pointerId'] != null && _0x330c89['pointerId'] !== _0x38f2ce["pointerId"]) {
      return;
    }
    stopPreviewEvent(_0x330c89);
    try {
      _0x5a0923["releasePointerCapture"]?.(_0x38f2ce["pointerId"]);
    } catch (_0x3f92ac) {}
    _0x45a69a();
  }
  _0xac59bb["addEventListener"]("click", _0x5f06ba => {
    if (isPointerInsideElementBounds(_0x22b0f4, _0x5f06ba)) {
      _0x5f06ba["stopPropagation"]();
      return;
    }
    _0x4bff35();
  });
  _0xac59bb["addEventListener"]("wheel", _0x46c367, {
    'passive': ![]
  });
  _0xac59bb['addEventListener']('pointerdown', _0x44b98d);
  _0xac59bb['addEventListener']('auxclick', _0x438a2e => {
    if (_0x438a2e["button"] === 0x1) {
      stopPreviewEvent(_0x438a2e);
    }
  });
  _0x22b0f4["addEventListener"]("dragstart", stopPreviewEvent);
  _0x5a0923['appendChild'](_0x22b0f4);
  _0xac59bb['appendChild'](_0x5a0923);
  document["addEventListener"]("keydown", _0x5eba15, !![]);
  document["body"]["appendChild"](_0xac59bb);
  activeImagePreviewClose = _0x4bff35;
  _0x4bff35["setSources"] = (_0x3b8d86, _0x537023 = {}) => {
    if (_0x5e3511) {
      return ![];
    }
    const _0x26d139 = collectUniquePreviewUrls(_0x3b8d86);
    if (_0x26d139["length"] === 0x0) {
      _0xac59bb["classList"]['remove']("is-loading");
      _0xac59bb['classList']["add"]('is-error');
      return ![];
    }
    _0x5d1756 = _0x26d139;
    _0x537023["revokeUrlOnClose"] && _0x26d139["forEach"](_0x242007 => _0x34dcd5["add"](_0x242007));
    return _0xf7996a(0x0);
  };
  _0x4bff35["setError"] = () => {
    if (_0x5e3511) {
      return ![];
    }
    _0xac59bb["classList"]["remove"]("is-loading");
    _0xac59bb['classList']["add"]('is-error');
    return !![];
  };
  return _0x4bff35;
}
export function openVideoPreview(_0x5e76a3, _0x4efaa8 = {}) {
  const _0x2241da = String(_0x5e76a3 || '')["trim"]();
  if (!_0x2241da) {
    return () => {};
  }
  closeActiveImagePreview();
  closeActiveVideoPreview();
  const _0x17c23b = typeof _0x4efaa8["acquirePlaybackUrl"] === "function" ? _0x4efaa8["acquirePlaybackUrl"] : acquireLocalVideoPlaybackObjectUrl;
  const _0x4b39fb = typeof _0x4efaa8['releasePlaybackUrlOwner'] === 'function' ? _0x4efaa8["releasePlaybackUrlOwner"] : releaseLocalVideoPlaybackObjectUrlOwner;
  const _0x294af5 = typeof _0x4efaa8['attachSource'] === "function" ? _0x4efaa8["attachSource"] : attachMediaElementPlaybackSource;
  const _0x2e92c5 = "video-preview:" + ++videoPreviewOwnerSequence;
  const _0x419665 = String(_0x4efaa8['playbackUrl'] || '')['trim']();
  let _0x4e9de3 = ![];
  let _0x2c1c85 = ![];
  let _0x13fd86 = ![];
  let _0x240bac = 0x0;
  let _0x2bb4c9 = '';
  const _0x5dd9d6 = document["createElement"]("div");
  _0x5dd9d6["className"] = "v2-image-preview-overlay v2-video-preview-overlay is-loading";
  if (_0x4efaa8["overlayDataset"] && typeof _0x4efaa8["overlayDataset"] === "object") {
    for (const [_0x43c6d0, _0x204b1d] of Object["entries"](_0x4efaa8["overlayDataset"])) {
      if (!_0x43c6d0 || _0x204b1d == null) {
        continue;
      }
      _0x5dd9d6["dataset"][_0x43c6d0] = String(_0x204b1d);
    }
  }
  markSidebarSubmenuOwner(_0x5dd9d6, _0x4efaa8['sidebarSubmenuOwner']);
  _0x5dd9d6["setAttribute"]?.('role', 'dialog');
  _0x5dd9d6["setAttribute"]?.("aria-modal", "true");
  _0x5dd9d6['setAttribute']?.("aria-label", _0x4efaa8["ariaLabel"] || 'Video\x20preview');
  const _0x2c98ea = document["createElement"]("video");
  _0x2c98ea["className"] = 'v2-video-preview-media';
  _0x2c98ea["controls"] = !![];
  _0x2c98ea["autoplay"] = _0x4efaa8["autoplay"] !== ![];
  _0x2c98ea["loop"] = _0x4efaa8["loop"] === !![];
  _0x2c98ea["muted"] = !!_0x4efaa8["muted"];
  _0x2c98ea['playsInline'] = !![];
  _0x2c98ea["preload"] = 'auto';
  const _0x41c0f8 = () => String(_0x2c98ea["getAttribute"]?.("src") || _0x2c98ea["src"] || _0x2c98ea["currentSrc"] || '')["trim"]();
  const _0x46d6a1 = () => {
    clearDesktopMediaPlaybackSourceMetadata(_0x2c98ea);
    _0x2c98ea["removeAttribute"]?.("src");
    try {
      _0x2c98ea["load"]?.();
    } catch {}
    _0x2bb4c9 = '';
  };
  const _0x2d4435 = () => {
    if (_0x4e9de3) {
      return;
    }
    _0x5dd9d6['classList']["add"]('is-loading');
    _0x5dd9d6["classList"]["remove"]("is-error");
  };
  const _0x348125 = () => {
    if (_0x4e9de3) {
      return;
    }
    _0x5dd9d6["classList"]['remove']("is-loading", "is-error");
  };
  const _0xd6cf34 = () => {
    if (_0x4e9de3) {
      return;
    }
    _0x5dd9d6["classList"]["remove"]("is-loading");
    _0x5dd9d6["classList"]["add"]("is-error");
  };
  const _0x8736de = () => {
    if (_0x4e9de3 || _0x4efaa8["autoplay"] === ![]) {
      return ![];
    }
    const _0x1901a6 = _0x41c0f8();
    if (!_0x1901a6 || _0x2bb4c9 === _0x1901a6) {
      return ![];
    }
    _0x2bb4c9 = _0x1901a6;
    if (!claimVideoPlaybackOwnership(_0x2c98ea, {
      'label': _0x2e92c5,
      'minBufferAhead': 0.5,
      'readyTimeoutMs': 0x15e,
      'recoveryDebounceMs': 0x96,
      'recoveryCooldownMs': 0x1f4,
      'shouldRecover': () => !_0x4e9de3 && _0x2c98ea["isConnected"] !== ![] && !_0x2c98ea['paused']
    })) {
      return ![];
    }
    try {
      const _0x1d3540 = _0x2c98ea["play"]?.();
      _0x1d3540?.['catch']?.(() => {});
    } catch {}
    return !![];
  };
  let _0x3ab8d7;
  try {
    _0x3ab8d7 = Promise["resolve"](_0x17c23b(_0x2241da, _0x2e92c5))["then"](_0x5952f0 => String(_0x5952f0 || '')["trim"](), () => '');
  } catch {
    _0x3ab8d7 = Promise["resolve"]('');
  }
  const _0x316f81 = async _0x145662 => {
    if (_0x4e9de3) {
      return ![];
    }
    const _0x3ec329 = String(_0x145662 || _0x2241da)["trim"]();
    if (!_0x3ec329) {
      return ![];
    }
    const _0x5f1b69 = ++_0x240bac;
    try {
      const _0x1b1411 = _0x294af5(_0x2c98ea, _0x2241da, {
        'playbackUrl': _0x3ec329,
        'preload': "auto",
        'load': !![],
        'shouldAssign': () => !_0x4e9de3 && _0x5f1b69 === _0x240bac
      });
      _0x8736de();
      const _0xc35fc8 = await _0x1b1411;
      if (_0x4e9de3 || _0x5f1b69 !== _0x240bac) {
        return ![];
      }
      if (!String(_0xc35fc8 || '')["trim"]() && !_0x41c0f8()) {
        return ![];
      }
      _0x8736de();
      return !![];
    } catch {
      return ![];
    }
  };
  const _0x4aa49f = async (_0x1d77ef = '') => {
    if (_0x4e9de3) {
      return ![];
    }
    if (_0x13fd86) {
      _0xd6cf34();
      return ![];
    }
    _0x13fd86 = !![];
    _0x2d4435();
    const _0x47ca7e = await _0x3ab8d7;
    if (_0x4e9de3) {
      return ![];
    }
    const _0x259abc = String(_0x1d77ef || '')["trim"]();
    const _0x4c3b51 = _0x41c0f8();
    const _0x32a33d = collectUniquePreviewUrls([_0x47ca7e, _0x2241da])['filter'](_0x528aed => _0x528aed !== _0x259abc && _0x528aed !== _0x4c3b51);
    for (const _0xb4586f of _0x32a33d) {
      if (_0x41c0f8()) {
        _0x46d6a1();
      }
      if (await _0x316f81(_0xb4586f)) {
        return !![];
      }
    }
    _0xd6cf34();
    return ![];
  };
  const _0x3cd3b0 = () => _0x348125();
  const _0x3f1515 = () => {
    void _0x4aa49f(_0x41c0f8());
  };
  _0x2c98ea["addEventListener"]('loadeddata', _0x3cd3b0);
  _0x2c98ea["addEventListener"]("canplay", _0x3cd3b0);
  _0x2c98ea["addEventListener"]("playing", _0x3cd3b0);
  _0x2c98ea['addEventListener']("error", _0x3f1515);
  const _0x3bcc7a = () => {
    if (_0x2c1c85) {
      return;
    }
    _0x2c1c85 = !![];
    try {
      _0x4b39fb(_0x2e92c5);
    } catch {}
  };
  const _0x266c23 = () => {
    if (_0x4e9de3) {
      return;
    }
    _0x4e9de3 = !![];
    _0x240bac += 0x1;
    document["removeEventListener"]("keydown", _0x2962a4, !![]);
    _0x2c98ea['removeEventListener']?.("loadeddata", _0x3cd3b0);
    _0x2c98ea["removeEventListener"]?.("canplay", _0x3cd3b0);
    _0x2c98ea["removeEventListener"]?.("playing", _0x3cd3b0);
    _0x2c98ea["removeEventListener"]?.("error", _0x3f1515);
    try {
      _0x2c98ea["pause"]();
    } catch (_0x4aeedd) {}
    detachVideoPlaybackRecovery(_0x2c98ea);
    _0x46d6a1();
    _0x3bcc7a();
    _0x5dd9d6['remove']();
    if (activeVideoPreviewClose === _0x266c23) {
      activeVideoPreviewClose = null;
    }
  };
  const _0x2962a4 = _0x431736 => {
    _0x431736['key'] === "Escape" && (_0x431736["preventDefault"]?.(), _0x431736["stopPropagation"]?.(), _0x266c23());
  };
  _0x5dd9d6["addEventListener"]("click", _0x1a4073 => {
    if (_0x1a4073["target"] === _0x5dd9d6) {
      _0x266c23();
    }
  });
  _0x5dd9d6["appendChild"](_0x2c98ea);
  document['addEventListener']("keydown", _0x2962a4, !![]);
  document["body"]["appendChild"](_0x5dd9d6);
  activeVideoPreviewClose = _0x266c23;
  _0x419665 ? void _0x316f81(_0x419665)["then"](_0x4e7448 => {
    if (!_0x4e7448) {
      void _0x4aa49f(_0x419665);
    }
  }) : void _0x3ab8d7["then"](_0x34f159 => {
    if (_0x4e9de3) {
      return ![];
    }
    return _0x316f81(_0x34f159 || _0x2241da);
  })["then"](_0x443a0f => {
    if (!_0x4e9de3 && _0x443a0f === ![]) {
      void _0x4aa49f(_0x41c0f8());
    }
  });
  return _0x266c23;
}
export async function openNodeImagePreview(_0x230615, _0x36fd37 = {}) {
  const _0x4cceb1 = createImageLoadDiagnostics("node-image-preview");
  const _0x5ae7ba = resolveImmediateNodeImagePreviewUrls(_0x230615, _0x36fd37["currentSrc"]);
  const _0x5dde5f = _0x5ae7ba["length"] > 0x0;
  const _0x3a0ec9 = _0x5dde5f ? openImagePreview(_0x5ae7ba[0x0], {
    ..._0x36fd37,
    'loadDiagnostics': _0x4cceb1,
    'fallbackUrls': _0x5ae7ba["slice"](0x1),
    'revokeUrlOnClose': ![]
  }) : openImagePreview('', {
    ..._0x36fd37,
    'loadDiagnostics': _0x4cceb1,
    'deferredSource': !![],
    'revokeUrlOnClose': ![]
  });
  const _0x175d39 = typeof _0x36fd37["sourceResolver"] === 'function' ? _0x36fd37["sourceResolver"] : resolveNodeImagePreviewSource;
  void Promise['resolve']()["then"](() => {
    _0x4cceb1['mark']("resolve-start");
    return _0x175d39(_0x230615);
  })["then"](_0x2f17a8 => {
    _0x4cceb1["mark"]("resolve-end", {
      'hasSource': !!_0x2f17a8?.["url"]
    });
    if (!_0x2f17a8?.['url']) {
      if (!_0x5dde5f) {
        _0x3a0ec9["setError"]?.();
      }
      return;
    }
    const _0x5bfca1 = _0x3a0ec9["setSources"]?.(collectUniquePreviewUrls([_0x2f17a8['url'], ..._0x5ae7ba]), {
      'revokeUrlOnClose': _0x2f17a8["revokeUrlOnClose"]
    });
    if (!_0x5bfca1 && _0x2f17a8["revokeUrlOnClose"]) {
      try {
        URL['revokeObjectURL'](_0x2f17a8["url"]);
      } catch (_0x48b5e4) {}
    }
  })["catch"](() => {
    if (!_0x5dde5f) {
      _0x3a0ec9["setError"]?.();
    }
  });
  return _0x3a0ec9;
}