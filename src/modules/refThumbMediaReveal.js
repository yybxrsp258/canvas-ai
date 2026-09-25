import { preloadCanvasImage, resetCanvasMediaSchedulerForTests } from './canvasMediaScheduler.js';
import { readViewportInteractionState } from '../core/viewportInteractionState.js';
let _decodePromiseMap = new Map();
let _revealTokenMap = new WeakMap();
const REVEAL_RETRY_DELAYS_MS = [0x78, 0x140, 0x2d0];
const ATTACH_RETRY_DELAYS_MS = [0x0, 0x10, 0x32, 0x78];
const VIEWPORT_BUSY_RETRY_MS = 0x50;
const VIEWPORT_BUSY_MAX_WAIT_MS = 0x1388;
function nextRevealToken(_0x54bf46) {
  const _0x3b001c = (_revealTokenMap["get"](_0x54bf46) || 0x0) + 0x1;
  _revealTokenMap['set'](_0x54bf46, _0x3b001c);
  return _0x3b001c;
}
function isRevealCurrent(_0x5eeef1, _0x46dc0b, _0x347fb8, _0x5323e3, _0x296542 = ![]) {
  if (!_0x5eeef1) {
    return ![];
  }
  if (!_0x296542 && _0x5eeef1["isConnected"] === ![]) {
    return ![];
  }
  if (_0x347fb8 && _0x46dc0b?.['dataset']?.["sig"] !== _0x347fb8) {
    return ![];
  }
  return _revealTokenMap["get"](_0x5eeef1) === _0x5323e3;
}
function afterFrame(_0x1f7fa3) {
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(_0x1f7fa3);
    return;
  }
  setTimeout(_0x1f7fa3, 0x0);
}
function isViewportBusy() {
  return readViewportInteractionState()["isViewportBusy"];
}
function setThumbErrorState(_0x557563, _0x14e772, _0x509a52) {
  if (_0x557563?.["dataset"]) {
    if (_0x509a52) {
      _0x557563["dataset"]["thumbError"] = '1';
    } else {
      delete _0x557563['dataset']["thumbError"];
    }
  }
  if (_0x14e772?.['dataset']) {
    if (_0x509a52) {
      _0x14e772["dataset"]["thumbError"] = '1';
    } else {
      delete _0x14e772["dataset"]['thumbError'];
    }
  }
}
function refreshImageElement(_0x251537, _0xf4ab9f) {
  if (!_0x251537 || !_0xf4ab9f) {
    return;
  }
  try {
    const _0xb35520 = String(_0x251537['getAttribute']?.('src') || _0x251537['src'] || '')['trim']();
    _0xb35520 === _0xf4ab9f && (_0x251537["src"] = '');
    _0x251537["src"] = _0xf4ab9f;
  } catch {}
}
export function ensureThumbDecoded(_0x312545) {
  const _0x616509 = String(_0x312545 || '')["trim"]();
  if (!_0x616509) {
    return Promise["resolve"](![]);
  }
  const _0x4c4811 = _decodePromiseMap["get"](_0x616509);
  if (_0x4c4811) {
    return _0x4c4811;
  }
  if (typeof Image !== 'function') {
    return Promise["resolve"](![]);
  }
  let _0x56e5c6 = null;
  const _0x449461 = preloadCanvasImage(_0x616509, {
    'priority': 0x55,
    'fetchPriority': "high",
    'revalidate': !![],
    'deferWhenPaused': !![],
    'decode': !![]
  })['then'](() => !![], () => ![]);
  _0x56e5c6 = _0x449461["then"](_0x402766 => {
    !_0x402766 && _decodePromiseMap["get"](_0x616509) === _0x56e5c6 && _decodePromiseMap["delete"](_0x616509);
    return _0x402766;
  }, () => {
    _decodePromiseMap['get'](_0x616509) === _0x56e5c6 && _decodePromiseMap["delete"](_0x616509);
    return ![];
  });
  _decodePromiseMap["set"](_0x616509, _0x56e5c6);
  return _0x56e5c6;
}
function revealSingleRefThumb(_0x8a3ee2, _0x84c3a2, _0x4ba435, _0x43e4be, _0x44922c = 0x0, _0x450dd0 = 0x0, _0x28a0bb = _0x8a3ee2?.["isConnected"] !== ![], _0x3e922c = 0x0) {
  if (!isRevealCurrent(_0x8a3ee2, _0x84c3a2, _0x4ba435, _0x43e4be, !![])) {
    return;
  }
  if (_0x8a3ee2["isConnected"] === ![]) {
    if (_0x28a0bb) {
      return;
    }
    const _0x826908 = ATTACH_RETRY_DELAYS_MS[_0x450dd0];
    if (_0x826908 == null) {
      return;
    }
    setTimeout(() => {
      revealSingleRefThumb(_0x8a3ee2, _0x84c3a2, _0x4ba435, _0x43e4be, _0x44922c, _0x450dd0 + 0x1, ![]);
    }, _0x826908);
    return;
  }
  _0x8a3ee2["decoding"] = "async";
  if (isViewportBusy()) {
    const _0x40a797 = typeof performance !== "undefined" && typeof performance["now"] === "function" ? performance["now"]() : Date["now"]();
    const _0x32680b = _0x3e922c || _0x40a797;
    if (_0x40a797 - _0x32680b < VIEWPORT_BUSY_MAX_WAIT_MS) {
      setTimeout(() => {
        revealSingleRefThumb(_0x8a3ee2, _0x84c3a2, _0x4ba435, _0x43e4be, _0x44922c, _0x450dd0, _0x28a0bb, _0x32680b);
      }, VIEWPORT_BUSY_RETRY_MS);
      return;
    }
  }
  const _0x35ea82 = !![];
  const _0x24ef12 = () => {
    if (!isRevealCurrent(_0x8a3ee2, _0x84c3a2, _0x4ba435, _0x43e4be)) {
      return;
    }
    setThumbErrorState(_0x8a3ee2, _0x84c3a2, ![]);
    _0x8a3ee2["classList"]['remove']("is-pending");
    _0x8a3ee2["classList"]['add']("is-ready");
  };
  const _0x5d6896 = () => {
    if (!isRevealCurrent(_0x8a3ee2, _0x84c3a2, _0x4ba435, _0x43e4be)) {
      return;
    }
    setThumbErrorState(_0x8a3ee2, _0x84c3a2, !![]);
  };
  if (_0x8a3ee2["complete"] && _0x8a3ee2["naturalWidth"] > 0x0) {
    afterFrame(_0x24ef12);
    return;
  }
  const _0x42a0ae = String(_0x8a3ee2["getAttribute"]("src") || '')['trim']();
  if (!_0x42a0ae) {
    _0x5d6896();
    return;
  }
  setThumbErrorState(_0x8a3ee2, _0x84c3a2, ![]);
  ensureThumbDecoded(_0x42a0ae)["then"](_0x11bd62 => {
    if (!isRevealCurrent(_0x8a3ee2, _0x84c3a2, _0x4ba435, _0x43e4be)) {
      return;
    }
    if (_0x11bd62) {
      refreshImageElement(_0x8a3ee2, _0x42a0ae);
      afterFrame(_0x24ef12);
      return;
    }
    const _0x278a29 = REVEAL_RETRY_DELAYS_MS[_0x44922c];
    if (_0x278a29 == null) {
      afterFrame(_0x5d6896);
      return;
    }
    setTimeout(() => {
      revealSingleRefThumb(_0x8a3ee2, _0x84c3a2, _0x4ba435, _0x43e4be, _0x44922c + 0x1, _0x450dd0, _0x35ea82);
    }, _0x278a29);
  })["catch"](() => {
    if (!isRevealCurrent(_0x8a3ee2, _0x84c3a2, _0x4ba435, _0x43e4be)) {
      return;
    }
    const _0x354ddc = REVEAL_RETRY_DELAYS_MS[_0x44922c];
    if (_0x354ddc == null) {
      afterFrame(_0x5d6896);
      return;
    }
    setTimeout(() => {
      revealSingleRefThumb(_0x8a3ee2, _0x84c3a2, _0x4ba435, _0x43e4be, _0x44922c + 0x1, _0x450dd0, _0x35ea82);
    }, _0x354ddc);
  });
}
export function revealRefThumbMedia(_0x2b1b96, _0x1749f9 = '') {
  if (!_0x2b1b96) {
    return;
  }
  const _0x2d18d5 = String(_0x1749f9 || '');
  const _0x366d0e = Array["from"](_0x2b1b96['querySelectorAll']("img.ref-thumb-media.is-pending"));
  for (const _0x539c60 of _0x366d0e) {
    revealSingleRefThumb(_0x539c60, _0x2b1b96, _0x2d18d5, nextRevealToken(_0x539c60));
  }
}
export function _resetRefThumbMediaRevealForTests() {
  _decodePromiseMap = new Map();
  _revealTokenMap = new WeakMap();
  resetCanvasMediaSchedulerForTests();
}