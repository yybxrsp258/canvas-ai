function normalizeText(_0xc15c2d) {
  return String(_0xc15c2d ?? '')["trim"]();
}
export function createStoryAssetHoverPreviewController({
  previewElement: _0x5e699e,
  getState: _0x51e54e,
  getSelectedAppearance: _0x36e942,
  buildContent: _0x5dcd26,
  isStoryAssetHoverLandscape: _0x5ca851,
  documentObject = globalThis['document'],
  windowObject = globalThis['window'] || globalThis
} = {}) {
  if (typeof _0x51e54e !== "function" || typeof _0x36e942 !== "function" || typeof _0x5dcd26 !== "function" || typeof _0x5ca851 !== "function") {
    throw new Error("story asset hover preview requires presentation adapters");
  }
  let _0x43dfdc = 0x0;
  let _0x41bb81 = 0x0;
  let _0xb5d1ab = 0x0;
  let _0x4f82b0 = null;
  let _0x963d9c = '';
  let _0x18aa74 = ![];
  const _0x8d2698 = () => {
    _0x43dfdc = 0x0;
    if (!_0x5e699e?.["classList"]["contains"]('is-visible')) {
      return;
    }
    const _0x3e41b2 = _0x5e699e['getBoundingClientRect']();
    const _0x3b4a5d = windowObject["innerWidth"] || documentObject['documentElement']?.["clientWidth"] || 0x400;
    const _0x5d0ddd = windowObject["innerHeight"] || documentObject["documentElement"]?.["clientHeight"] || 0x300;
    const _0x342f9b = 0xe;
    const _0x6c37a0 = 0xa;
    const _0x438de2 = Math["max"](_0x6c37a0, _0x3b4a5d - _0x3e41b2["width"] - _0x6c37a0);
    const _0x1a3d8b = Math['max'](_0x6c37a0, _0x5d0ddd - _0x3e41b2["height"] - _0x6c37a0);
    const _0x4ebd6d = _0x4f82b0?.['getBoundingClientRect']?.();
    let _0x56ec4a = Math['min'](Math["max"](_0x6c37a0, _0x41bb81 + _0x342f9b), _0x438de2);
    let _0x397f10 = Math["min"](Math["max"](_0x6c37a0, _0xb5d1ab + _0x342f9b), _0x1a3d8b);
    if (_0x4ebd6d) {
      const _0x195600 = _0x4ebd6d["right"] + _0x342f9b;
      const _0x5c95a8 = _0x4ebd6d['left'] - _0x3e41b2["width"] - _0x342f9b;
      if (_0x195600 <= _0x438de2) {
        _0x56ec4a = _0x195600;
      } else {
        if (_0x5c95a8 >= _0x6c37a0) {
          _0x56ec4a = _0x5c95a8;
        } else {
          const _0x4feb8c = _0x4ebd6d["bottom"] + _0x342f9b;
          const _0x5d0d5f = _0x4ebd6d['top'] - _0x3e41b2["height"] - _0x342f9b;
          _0x56ec4a = Math["min"](Math["max"](_0x6c37a0, _0x41bb81 - _0x3e41b2["width"] / 0x2), _0x438de2);
          if (_0x4feb8c <= _0x1a3d8b) {
            _0x397f10 = _0x4feb8c;
          } else {
            if (_0x5d0d5f >= _0x6c37a0) {
              _0x397f10 = _0x5d0d5f;
            }
          }
        }
      }
      (_0x56ec4a === _0x195600 || _0x56ec4a === _0x5c95a8) && (_0x397f10 = Math["min"](Math['max'](_0x6c37a0, _0xb5d1ab - 0x12), _0x1a3d8b));
    }
    _0x5e699e["style"]["left"] = Math["round"](_0x56ec4a) + 'px';
    _0x5e699e["style"]["top"] = Math['round'](_0x397f10) + 'px';
  };
  const _0xa6c364 = _0x12c81a => {
    _0x41bb81 = Number(_0x12c81a?.["clientX"] || 0x0);
    _0xb5d1ab = Number(_0x12c81a?.["clientY"] || 0x0);
    if (_0x43dfdc) {
      return;
    }
    if (typeof windowObject["requestAnimationFrame"] === "function") {
      _0x43dfdc = windowObject["requestAnimationFrame"](_0x8d2698);
      return;
    }
    _0x8d2698();
  };
  const _0x5a0901 = _0x52c4c7 => {
    if (!_0x52c4c7) {
      return;
    }
    const _0x56d9b1 = _0x5ca851(_0x52c4c7["naturalWidth"], _0x52c4c7["naturalHeight"]);
    _0x52c4c7['closest'](".story-asset-hover-preview-item")?.["classList"]["toggle"]('is-landscape', _0x56d9b1);
    _0x52c4c7["closest"](".story-asset-hover-preview-cell")?.["classList"]['toggle']("is-landscape", _0x56d9b1);
    if (_0x5e699e?.['classList']['contains']("is-visible")) {
      _0x8d2698();
    }
  };
  const _0x48bb98 = () => {
    _0x5e699e?.['querySelectorAll']('[data-story-asset-hover-image]')["forEach"](_0x3acf0d => {
      if (_0x3acf0d["complete"] && Number(_0x3acf0d["naturalWidth"]) > 0x0) {
        _0x5a0901(_0x3acf0d);
        return;
      }
      _0x3acf0d["addEventListener"]("load", () => _0x5a0901(_0x3acf0d), {
        'once': !![]
      });
    });
  };
  const _0xefb0a2 = (_0x1d591f, _0x27c09d = '') => {
    if (!_0x5e699e || !_0x1d591f) {
      return ![];
    }
    const _0x59d293 = _0x51e54e();
    const _0x2cd1e5 = _0x36e942(_0x59d293, _0x1d591f);
    const _0x33a8d0 = _0x5dcd26(_0x1d591f, {
      'appearanceId': _0x27c09d,
      'selectedAssetId': _0x59d293["selectedAssetId"],
      'selectedAppearanceId': _0x2cd1e5?.['id']
    });
    if (!_0x33a8d0) {
      _0x5e699e['innerHTML'] = '';
      _0x5e699e["dataset"]["assetId"] = '';
      _0x5e699e['dataset']['signature'] = '';
      return ![];
    }
    const _0x2c78d4 = [normalizeText(_0x27c09d) + ':' + (_0x2cd1e5?.['id'] || ''), (_0x1d591f["baseAppearanceId"] || '') + ':' + _0x33a8d0["hasVoice"], _0x33a8d0["appearances"]['map'](_0x45970e => (_0x45970e?.['id'] || '') + ':' + normalizeText(_0x45970e?.["imageUrl"]))["join"]('|')]['join'](':');
    if (_0x5e699e["dataset"]["assetId"] === String(_0x1d591f['id']) && _0x5e699e["dataset"]['signature'] === _0x2c78d4) {
      return !![];
    }
    _0x5e699e['dataset']['assetId'] = String(_0x1d591f['id']);
    _0x5e699e["dataset"]["signature"] = _0x2c78d4;
    _0x5e699e['style']["setProperty"]("--story-asset-hover-columns", String(_0x33a8d0["columns"]));
    _0x5e699e['innerHTML'] = _0x33a8d0['html'];
    _0x48bb98();
    return !![];
  };
  const _0x491890 = () => {
    _0x963d9c = '';
    _0x4f82b0 = null;
    _0x5e699e?.["classList"]["remove"]("is-visible");
    _0x5e699e?.["setAttribute"]("aria-hidden", 'true');
  };
  return Object['freeze']({
    'show'(_0x1dd4cd, _0x15d69c, _0x3ed939, _0x47161a = '') {
      if (_0x18aa74 || !_0x5e699e || _0x15d69c?.["pointerType"] === "touch") {
        return ![];
      }
      if (!_0x3ed939) {
        _0x491890();
        return ![];
      }
      _0x4f82b0 = _0x1dd4cd?.['closest']?.(".at-mention-menu") || null;
      _0x963d9c = String(_0x3ed939['id']);
      if (!_0xefb0a2(_0x3ed939, _0x47161a)) {
        _0x491890();
        return ![];
      }
      _0x5e699e["classList"]["add"]('is-visible');
      _0x5e699e['setAttribute']("aria-hidden", "false");
      _0xa6c364(_0x15d69c);
      return !![];
    },
    'hide': _0x491890,
    'getHoveredAssetId': () => _0x963d9c,
    'destroy'() {
      if (_0x18aa74) {
        return;
      }
      _0x491890();
      _0x43dfdc && typeof windowObject['cancelAnimationFrame'] === "function" && windowObject["cancelAnimationFrame"](_0x43dfdc);
      _0x43dfdc = 0x0;
      _0x18aa74 = !![];
    }
  });
}