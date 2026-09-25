import { beginResizeFpsSession, endResizeFpsSession } from '../perf/perfProbe.js';
import { setNodeGeometryPreview, clearNodeGeometryPreview } from '../../core/nodeGeometryPreview.js';
import a1120_0x338a56 from '../../core/stores/appStore.js';
import { beginNodeEditInteraction, deferNodeEditCompletion } from '../../core/nodeEditInteraction.js';
const RESIZE_BODY_CLASS = 'is-node-resizing';
const RESIZE_NODE_CLASS = "is-resizing";
function requestFrame(_0x5633a9) {
  if (typeof requestAnimationFrame === "function") {
    return requestAnimationFrame(_0x5633a9);
  }
  return setTimeout(_0x5633a9, 0x0);
}
function cancelFrame(_0x557a0e) {
  if (!_0x557a0e) {
    return;
  }
  if (typeof cancelAnimationFrame === "function") {
    cancelAnimationFrame(_0x557a0e);
    return;
  }
  clearTimeout(_0x557a0e);
}
function toFiniteNumber(_0x3324f4, _0x291833) {
  const _0x5d816e = Number(_0x3324f4);
  return Number["isFinite"](_0x5d816e) ? _0x5d816e : _0x291833;
}
function normalizeSize(_0x206a8d, _0x55dd8b, _0x3c0af0) {
  return {
    'width': Math["max"](0x1, toFiniteNumber(_0x206a8d?.['width'], _0x55dd8b)),
    'height': Math['max'](0x1, toFiniteNumber(_0x206a8d?.["height"], _0x3c0af0))
  };
}
function sizesEqual(_0x21fd8c, _0xfc5d94) {
  return Math["round"](toFiniteNumber(_0x21fd8c?.["width"], 0x0)) === Math["round"](toFiniteNumber(_0xfc5d94?.['width'], 0x0)) && Math['round'](toFiniteNumber(_0x21fd8c?.["height"], 0x0)) === Math["round"](toFiniteNumber(_0xfc5d94?.['height'], 0x0));
}
function applyPreviewSize(_0x1816b2, _0x47e4d6) {
  if (!_0x1816b2?.["style"]) {
    return;
  }
  _0x1816b2["style"]['width'] = _0x47e4d6["width"] + 'px';
  _0x1816b2['style']['height'] = _0x47e4d6['height'] + 'px';
}
function syncPreviewGeometry(_0x9f40d3, _0x1ae570, _0x36c15a, _0x5c7c38) {
  const _0x24d440 = typeof window !== "undefined" ? window : null;
  if (!_0x24d440 || !_0x9f40d3 || !_0x1ae570) {
    return;
  }
  _0x24d440["v2Renderer"]?.["previewNodeResizeGeometry"]?.({
    'nodeId': _0x9f40d3,
    'width': _0x1ae570["width"],
    'height': _0x1ae570['height']
  });
  const _0x5e6ab7 = typeof _0x24d440["_v2UpdateSidePlusNow"] === 'function' ? _0x24d440["_v2UpdateSidePlusNow"] : _0x24d440["_v2UpdateSidePlus"];
  if (typeof _0x5e6ab7 !== "function") {
    return;
  }
  _0x5e6ab7(Number['isFinite'](_0x24d440["_lastMx"]) ? _0x24d440['_lastMx'] : _0x36c15a, Number["isFinite"](_0x24d440["_lastMy"]) ? _0x24d440["_lastMy"] : _0x5c7c38, {
    'nodeSizeOverrides': {
      [_0x9f40d3]: {
        'width': _0x1ae570["width"],
        'height': _0x1ae570["height"]
      }
    }
  });
}
function readViewportZoom(_0x51470b) {
  const _0x47dc49 = typeof _0x51470b === "function" && _0x51470b() || {
    'zoom': 0x1
  };
  return Math['max'](0.01, toFiniteNumber(_0x47dc49["zoom"], 0x1));
}
export function startNodeResizePreview({
  store = a1120_0x338a56,
  event: _0x13fba8,
  nodeId: _0x4785c5,
  getNode: _0x1ae0c8,
  getViewport: _0x17f2a,
  resolveSize: _0x34eff8,
  applyPatch: _0x113962,
  buildFinalPatch: _0xe739dc,
  afterApply: _0x3bad03,
  onPreview: _0x486a12,
  onPreviewEnd: _0x3062e1,
  commit: _0x2702f8,
  label = "node-resize"
} = {}) {
  if (!_0x13fba8 || !_0x4785c5 || typeof _0x34eff8 !== "function") {
    return ![];
  }
  _0x13fba8["preventDefault"]?.();
  _0x13fba8["stopPropagation"]?.();
  const _0x27c796 = typeof _0x1ae0c8 === "function" && _0x1ae0c8() || {};
  const _0x372aeb = toFiniteNumber(_0x13fba8["clientX"], 0x0);
  const _0x53ce4e = toFiniteNumber(_0x13fba8["clientY"], 0x0);
  const _0x33a9d9 = Math['max'](0x1, toFiniteNumber(_0x27c796["width"], 0x104));
  const _0x3a3080 = Math['max'](0x1, toFiniteNumber(_0x27c796["height"], 0x104));
  const _0x3524ca = {
    'width': _0x33a9d9,
    'height': _0x3a3080
  };
  const _0x13659a = typeof document !== "undefined" ? document["getElementById"](_0x4785c5) : null;
  const _0x16ef3d = typeof document !== "undefined" ? document["body"] : null;
  let _0x2f9684 = null;
  let _0x48d7b6 = _0x3524ca;
  let _0xdc70e = _0x372aeb;
  let _0x5a163a = _0x53ce4e;
  let _0x49cdbe = 0x0;
  let _0x50652e = ![];
  const _0x4cd46d = beginNodeEditInteraction(store, [_0x4785c5]);
  const _0x3994cf = () => {
    _0x49cdbe = 0x0;
    if (!_0x2f9684 || !(_0x4cd46d["canPreview"]?.() ?? _0x4cd46d["allowed"]())) {
      return;
    }
    _0x48d7b6 = _0x2f9684;
    _0x2f9684 = null;
    applyPreviewSize(_0x13659a, _0x48d7b6);
    setNodeGeometryPreview([[_0x4785c5, _0x48d7b6]]);
    syncPreviewGeometry(_0x4785c5, _0x48d7b6, _0xdc70e, _0x5a163a);
    _0x486a12?.(_0x48d7b6);
  };
  const _0x413d32 = _0x435222 => {
    _0x2f9684 = _0x435222;
    if (_0x49cdbe) {
      return;
    }
    _0x49cdbe = requestFrame(_0x3994cf);
  };
  const _0x68fef6 = () => {
    _0x49cdbe && (cancelFrame(_0x49cdbe), _0x49cdbe = 0x0);
    window["removeEventListener"]('pointermove', _0x143db0);
    window["removeEventListener"]("pointerup", _0x2378be);
    window["removeEventListener"]('pointercancel', _0x2378be);
    _0x16ef3d?.["classList"]?.["remove"](RESIZE_BODY_CLASS);
    _0x13659a?.["classList"]?.['remove'](RESIZE_NODE_CLASS);
    _0x3062e1?.();
    endResizeFpsSession(label);
  };
  const _0x5a9a6c = () => {
    const _0x49a22d = _0x2f9684 || _0x48d7b6;
    if (_0x2f9684) {
      _0x3994cf();
    }
    const _0x1e8da1 = typeof _0xe739dc === "function" && _0xe739dc({
      'startNode': _0x27c796,
      'startSize': _0x3524ca,
      'finalSize': _0x49a22d
    }) || {};
    const _0xfd836e = Object["keys"](_0x1e8da1)["length"] > 0x0;
    const _0x55491c = !sizesEqual(_0x49a22d, _0x3524ca);
    let _0x17f50e = ![];
    (_0x55491c || _0xfd836e) && typeof _0x113962 === "function" && (_0x113962({
      'width': _0x49a22d['width'],
      'height': _0x49a22d["height"],
      ..._0x1e8da1
    }), _0x17f50e = !![]);
    syncPreviewGeometry(_0x4785c5, _0x49a22d, _0xdc70e, _0x5a163a);
    const _0x7fdf80 = typeof _0x3bad03 === "function" && _0x3bad03({
      'startNode': _0x27c796,
      'startSize': _0x3524ca,
      'finalSize': _0x49a22d,
      'didApply': _0x17f50e
    }) === !![];
    (_0x17f50e || _0x7fdf80) && typeof _0x2702f8 === "function" && _0x2702f8();
  };
  function _0x143db0(_0x3fcc1c) {
    if (_0x50652e) {
      return;
    }
    _0xdc70e = toFiniteNumber(_0x3fcc1c["clientX"], _0xdc70e);
    _0x5a163a = toFiniteNumber(_0x3fcc1c["clientY"], _0x5a163a);
    const _0x1a443e = readViewportZoom(_0x17f2a);
    const _0x505c0b = (_0xdc70e - _0x372aeb) / _0x1a443e;
    const _0x511363 = (_0x5a163a - _0x53ce4e) / _0x1a443e;
    const _0x156b5c = normalizeSize(_0x34eff8({
      'startNode': _0x27c796,
      'startWidth': _0x33a9d9,
      'startHeight': _0x3a3080,
      'dx': _0x505c0b,
      'dy': _0x511363,
      'event': _0x3fcc1c
    }), _0x33a9d9, _0x3a3080);
    if (_0x2f9684 && sizesEqual(_0x2f9684, _0x156b5c)) {
      return;
    }
    if (!_0x2f9684 && sizesEqual(_0x48d7b6, _0x156b5c)) {
      return;
    }
    _0x413d32(_0x156b5c);
  }
  function _0x2378be(_0x3e995f) {
    if (_0x50652e) {
      return;
    }
    _0x50652e = !![];
    _0x68fef6();
    window["removeEventListener"]('blur', _0x2378be);
    const _0x2dcf97 = _0x3e995f?.["type"] === 'pointercancel' || _0x3e995f?.["type"] === "blur";
    if (!_0x2dcf97 && deferNodeEditCompletion(_0x4cd46d, _0x2bcdfd => _0x1e2593(_0x2bcdfd), () => {
      const _0x442a92 = _0x1ae0c8?.();
      return !!_0x442a92 && _0x442a92["width"] === _0x33a9d9 && _0x442a92['height'] === _0x3a3080;
    })) {
      return;
    }
    _0x1e2593(!_0x2dcf97);
  }
  function _0x1e2593(_0xf19e31) {
    let _0x3c5526 = ![];
    try {
      _0xf19e31 && _0x4cd46d['allowed']() && (_0x5a9a6c(), _0x3c5526 = !![]);
    } catch (_0x50efa6) {
      window["showToast"]?.(_0x50efa6['message'] || "节点暂时无法编辑", 'warning');
    } finally {
      if (!_0x3c5526) {
        const _0x12e15a = normalizeSize(_0x1ae0c8?.(), _0x33a9d9, _0x3a3080);
        applyPreviewSize(_0x13659a, _0x12e15a);
        syncPreviewGeometry(_0x4785c5, _0x12e15a, _0xdc70e, _0x5a163a);
      }
      clearNodeGeometryPreview([_0x4785c5]);
      _0x4cd46d["finish"]();
      window['removeEventListener']('blur', _0x2378be);
    }
  }
  if (!_0x4cd46d['ready']) {
    void _0x4cd46d["wait"]["then"](_0x137ac3 => {
      if (_0x50652e) {
        return;
      }
      if (!_0x137ac3) {
        _0x50652e = !![];
        _0x68fef6();
        _0x1e2593(![]);
      } else {
        if (_0x2f9684) {
          _0x413d32(_0x2f9684);
        }
      }
    });
  }
  _0x16ef3d?.["classList"]?.["add"](RESIZE_BODY_CLASS);
  _0x13659a?.['classList']?.["add"](RESIZE_NODE_CLASS);
  beginResizeFpsSession(label);
  window["addEventListener"]("pointermove", _0x143db0);
  window['addEventListener']("pointerup", _0x2378be);
  window["addEventListener"]('pointercancel', _0x2378be);
  window["addEventListener"]("blur", _0x2378be);
  return !![];
}