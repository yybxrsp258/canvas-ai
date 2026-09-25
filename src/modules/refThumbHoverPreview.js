let _previewEl = null;
let _previewImgEl = null;
let _activeWrapEl = null;
let _rafId = 0x0;
let _hasGlobalHideHooks = ![];
let _hideTimerId = 0x0;
let _currentSrc = '';
let _pendingSrc = '';
let _activeOptions = {};
import { ensureThumbDecoded } from './refThumbMediaReveal.js';
function _ensurePreviewEl() {
  if (_previewEl) {
    return _previewEl;
  }
  const _0x3df43c = document["createElement"]("div");
  _0x3df43c["className"] = 'ref-hover-preview';
  const _0x397ebf = document["createElement"]('img');
  _0x397ebf["className"] = "ref-hover-preview-img";
  _0x397ebf["alt"] = '';
  _0x397ebf["addEventListener"]?.('load', _schedulePosition);
  _0x397ebf['addEventListener']?.("error", _hide);
  _0x3df43c['appendChild'](_0x397ebf);
  document["body"]['appendChild'](_0x3df43c);
  _previewEl = _0x3df43c;
  _previewImgEl = _0x397ebf;
  return _0x3df43c;
}
function _hide() {
  if (_hideTimerId) {
    clearTimeout(_hideTimerId);
  }
  _hideTimerId = 0x0;
  if (_rafId) {
    cancelAnimationFrame(_rafId);
  }
  _rafId = 0x0;
  _activeWrapEl = null;
  _pendingSrc = '';
  if (_previewEl) {
    _previewEl["classList"]['remove']("is-visible");
  }
  if (_previewImgEl) {
    _previewImgEl["classList"]["remove"]('is-pending');
  }
  _activeOptions['releaseOnHide'] && _previewImgEl && (_previewImgEl['removeAttribute']("src"), _currentSrc = '');
}
function _scheduleHide(_0x289c92 = 0x50) {
  if (_hideTimerId) {
    clearTimeout(_hideTimerId);
  }
  _hideTimerId = window["setTimeout"](() => {
    _hideTimerId = 0x0;
    _hide();
  }, _0x289c92);
}
export function hideRefThumbHoverPreview(_0x18e0f5) {
  if (_activeWrapEl && (_0x18e0f5 === _activeWrapEl || _0x18e0f5?.["contains"]?.(_activeWrapEl))) {
    _hide();
  }
}
function _schedulePosition() {
  if (_rafId) {
    return;
  }
  _rafId = requestAnimationFrame(() => {
    _rafId = 0x0;
    if (!_activeWrapEl || !_previewEl) {
      return;
    }
    const _0x21f8fe = _activeWrapEl["getBoundingClientRect"]();
    if (_activeOptions["viewportBounded"]) {
      const _0x22042e = _previewEl["getBoundingClientRect"]();
      const _0x19fc35 = _0x21f8fe['right'] + 0xa + _0x22042e["width"] <= window["innerWidth"] - 0x8 ? _0x21f8fe["right"] + 0xa : _0x21f8fe['left'] - _0x22042e["width"] - 0xa;
      _previewEl["style"]["left"] = Math["max"](0x8, Math["min"](_0x19fc35, window['innerWidth'] - _0x22042e['width'] - 0x8)) + 'px';
      _previewEl["style"]["top"] = Math["max"](0x8, Math['min'](_0x21f8fe["top"], window['innerHeight'] - _0x22042e["height"] - 0x8)) + 'px';
      return;
    }
    const _0xc732a5 = _0x21f8fe["left"] + _0x21f8fe['width'] / 0x2;
    const _0xb61479 = _0x21f8fe['top'] - 0xa;
    _previewEl["style"]["left"] = Math["round"](_0xc732a5) + 'px';
    _previewEl['style']['top'] = Math["round"](_0xb61479) + 'px';
  });
}
function _getThumbImgSrc(_0x4658c6) {
  const _0x2b74f1 = _0x4658c6["querySelector"]("img.ref-thumb-media");
  const _0x2243a8 = String(_0x2b74f1?.["getAttribute"]('src') || '')["trim"]();
  return _0x2243a8 || '';
}
export function resolveRefThumbHoverPreviewUrl(_0x57692d) {
  const _0x42d2bf = String(_0x57692d?.["dataset"]?.["previewSrc"] || '')["trim"]();
  if (_0x42d2bf) {
    return _0x42d2bf;
  }
  const _0x143aef = String(_0x57692d?.["dataset"]?.["thumbSrc"] || '')["trim"]();
  if (_0x143aef) {
    return _0x143aef;
  }
  return _getThumbImgSrc(_0x57692d);
}
function _collectPreviewWraps(_0x4b0b9d, _0x2af493 = ".ref-thumb-wrap") {
  if (!_0x4b0b9d) {
    return [];
  }
  const _0x253ec8 = [];
  if (_0x4b0b9d["matches"]?.(_0x2af493) || _0x2af493 === '.ref-thumb-wrap' && _0x4b0b9d["classList"]?.["contains"]?.("ref-thumb-wrap")) {
    _0x253ec8["push"](_0x4b0b9d);
  }
  _0x4b0b9d["querySelectorAll"]?.(_0x2af493)?.['forEach']?.(_0x5becf5 => _0x253ec8["push"](_0x5becf5));
  return _0x253ec8;
}
function _preloadRefThumbPreviewSources(_0x42aabc, _0x1aa0d7) {
  for (const _0x509e2 of _collectPreviewWraps(_0x42aabc, _0x1aa0d7)) {
    const _0x411bc8 = resolveRefThumbHoverPreviewUrl(_0x509e2);
    if (_0x411bc8) {
      ensureThumbDecoded(_0x411bc8);
    }
  }
}
export function _resetRefThumbHoverPreviewForTests() {
  _previewEl = null;
  _previewImgEl = null;
  _activeWrapEl = null;
  _rafId = 0x0;
  _hasGlobalHideHooks = ![];
  _hideTimerId = 0x0;
  _currentSrc = '';
  _pendingSrc = '';
  _activeOptions = {};
}
function _showForWrap(_0x13bb16, _0x5e551a = {}) {
  const _0x5b365e = resolveRefThumbHoverPreviewUrl(_0x13bb16);
  if (!_0x5b365e) {
    _hide();
    return;
  }
  _ensurePreviewEl();
  if (_activeOptions['releaseOnHide'] && _activeWrapEl !== _0x13bb16) {
    _hide();
  }
  _activeOptions = _0x5e551a;
  if (_0x5e551a["viewportBounded"]) {
    _previewEl['classList']["add"]('is-viewport-bounded');
  } else {
    _previewEl["classList"]["remove"]("is-viewport-bounded");
  }
  _activeWrapEl = _0x13bb16;
  if (_hideTimerId) {
    clearTimeout(_hideTimerId);
  }
  _hideTimerId = 0x0;
  if (_previewImgEl) {
    const _0x20873b = !!_previewEl?.["classList"]["contains"]("is-visible");
    if (!_0x20873b) {
      _currentSrc = _0x5b365e;
      _pendingSrc = '';
      _previewImgEl["classList"]['remove']("is-pending");
      _previewImgEl["src"] = _0x5b365e;
      if (!_0x5e551a["releaseOnHide"]) {
        ensureThumbDecoded(_0x5b365e);
      }
    } else {
      if (!_currentSrc) {
        _currentSrc = _0x5b365e;
        _pendingSrc = '';
        _previewImgEl['classList']["remove"]("is-pending");
        _previewImgEl["src"] = _0x5b365e;
      } else {
        if (_currentSrc !== _0x5b365e) {
          _currentSrc = _0x5b365e;
          _pendingSrc = _0x5b365e;
          const _0x2e58bb = _0x5b365e;
          _previewImgEl["classList"]["add"]("is-pending");
          _previewImgEl["src"] = _0x2e58bb;
          (_0x5e551a['releaseOnHide'] ? Promise['resolve']() : ensureThumbDecoded(_0x5b365e))["then"](() => {
            if (_pendingSrc !== _0x2e58bb) {
              return;
            }
            if (!_previewImgEl) {
              return;
            }
            _pendingSrc = '';
            _previewImgEl["classList"]['remove']("is-pending");
          });
        }
      }
    }
  }
  _previewEl["classList"]['add']("is-visible");
  _schedulePosition();
}
function _ensureGlobalHideHooks() {
  if (_hasGlobalHideHooks) {
    return;
  }
  _hasGlobalHideHooks = !![];
  window["addEventListener"]("scroll", _hide, !![]);
  window["addEventListener"]("blur", _hide, !![]);
  window["addEventListener"]("wheel", _hide, {
    'passive': !![],
    'capture': !![]
  });
  window['addEventListener']('resize', _hide);
}
export function bindRefThumbHoverPreview(_0x3c9e6a, _0x37fe29 = {}) {
  if (!_0x3c9e6a) {
    return () => {};
  }
  const _0x58d65f = _0x37fe29['selector'] || '.ref-thumb-wrap';
  _ensureGlobalHideHooks();
  if (_0x37fe29["preload"] !== ![]) {
    _preloadRefThumbPreviewSources(_0x3c9e6a, _0x58d65f);
  }
  let _0x4e4f2b = null;
  _0x37fe29['preload'] !== ![] && typeof MutationObserver === 'function' && (_0x4e4f2b = new MutationObserver(() => {
    _preloadRefThumbPreviewSources(_0x3c9e6a, _0x58d65f);
  }), _0x4e4f2b["observe"](_0x3c9e6a, {
    'childList': !![],
    'subtree': !![],
    'attributes': !![],
    'attributeFilter': ['src', "data-preview-src", "data-thumb-src"]
  }));
  let _0x33cf47 = ![];
  const _0x2b0ce3 = () => {
    if (_0x37fe29['pauseOnScroll']) {
      _0x33cf47 = !![];
    }
    hideRefThumbHoverPreview(_0x3c9e6a);
  };
  const _0x5a57a4 = _0xf22951 => {
    if (_0x33cf47 && _0xf22951['type'] !== "focusin") {
      return;
    }
    const _0x4644ec = _0xf22951["target"]?.['closest']?.(_0x58d65f);
    if (!_0x4644ec || !_0x3c9e6a["contains"](_0x4644ec)) {
      return;
    }
    _showForWrap(_0x4644ec, _0x37fe29);
  };
  const _0x1da137 = _0x9fa5df => {
    const _0x44fbfd = _0x9fa5df["target"]?.["closest"]?.(_0x58d65f);
    if (!_0x44fbfd || !_0x3c9e6a["contains"](_0x44fbfd)) {
      return;
    }
    const _0x1f124e = _0x9fa5df["relatedTarget"];
    if (_0x1f124e && _0x44fbfd['contains'](_0x1f124e)) {
      return;
    }
    if (_0x1f124e && _0x3c9e6a["contains"](_0x1f124e)) {
      _scheduleHide(0x50);
      return;
    }
    _hide();
  };
  const _0x1f071b = _0xcf380f => {
    _0x33cf47 && (_0x33cf47 = ![], _0x5a57a4(_0xcf380f));
    if (!_activeWrapEl) {
      return;
    }
    if (!_0x3c9e6a['contains'](_activeWrapEl)) {
      _hide();
      return;
    }
    _schedulePosition();
  };
  const _0x4b9799 = () => _hide();
  _0x3c9e6a["addEventListener"]('pointerover', _0x5a57a4);
  _0x3c9e6a['addEventListener']("pointerout", _0x1da137);
  _0x3c9e6a["addEventListener"]("pointermove", _0x1f071b);
  _0x3c9e6a['addEventListener']("pointerdown", _0x4b9799, !![]);
  _0x3c9e6a["addEventListener"]("focusin", _0x5a57a4);
  _0x3c9e6a["addEventListener"]('focusout', _0x1da137);
  _0x3c9e6a["addEventListener"]("scroll", _0x2b0ce3, !![]);
  _0x3c9e6a["addEventListener"]("wheel", _0x2b0ce3, {
    'passive': !![]
  });
  return () => {
    if (_activeWrapEl && _0x3c9e6a['contains'](_activeWrapEl)) {
      _hide();
    }
    _0x4e4f2b?.["disconnect"]?.();
    _0x3c9e6a["removeEventListener"]("pointerover", _0x5a57a4);
    _0x3c9e6a['removeEventListener']("pointerout", _0x1da137);
    _0x3c9e6a["removeEventListener"]('pointermove', _0x1f071b);
    _0x3c9e6a['removeEventListener']("pointerdown", _0x4b9799, !![]);
    _0x3c9e6a["removeEventListener"]("focusin", _0x5a57a4);
    _0x3c9e6a["removeEventListener"]("focusout", _0x1da137);
    _0x3c9e6a['removeEventListener']("scroll", _0x2b0ce3, !![]);
    _0x3c9e6a["removeEventListener"]("wheel", _0x2b0ce3);
  };
}