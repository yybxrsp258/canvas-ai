import { calcWorldBounds, getViewportScreenBounds } from '../core/math.js';
import { readViewportInteractionState } from '../core/viewportInteractionState.js';
import { recordMinimapUpdateSample } from './perf/perfProbe.js';
import { isNodeType } from './registry.js';
const PAN_PREVIEW_MIN_INTERVAL_MS = 0x60;
const PAN_NODE_UPDATE_DELAY_MS = 0xb4;
function getMinimapNodeLayoutRevision(_0x5ab308) {
  const _0x202781 = Number(_0x5ab308?.["_nodeGeometryRev"]);
  if (Number["isFinite"](_0x202781)) {
    return _0x202781;
  }
  const _0x14094e = Number(_0x5ab308?.["_persistRev"]);
  return Number["isFinite"](_0x14094e) ? _0x14094e : -0x1;
}
export function initMinimap(_0x17bd60, _0x5b42d7) {
  const _0x49b271 = document["getElementById"]("minimapViewport");
  const _0x3e090e = document["getElementById"]('minimapWrapper');
  if (!_0x17bd60 || !_0x49b271 || !_0x3e090e) {
    return;
  }
  const _0x3ad1c0 = new Map();
  let _0x3dd796 = null;
  let _0x8b8d5a = 0x1;
  let _0x76566e = 0x0;
  let _0xc19bba = 0x0;
  let _0x22beca = 0x0;
  let _0x27479e = 0x0;
  let _0x4e4363 = -0x1;
  let _0x262c16 = ![];
  let _0x379a90 = 0x0;
  let _0x55b133 = 0x0;
  let _0x45bf7f = 0x1;
  let _0x4b563a = '';
  const _0x19973f = new Map();
  let _0x392f3c = Number(_0x17bd60['clientWidth']) || 0xc8;
  let _0x1c9f2b = Number(_0x17bd60["clientHeight"]) || 0x8c;
  let _0x5d945f = null;
  let _0x5b71d7 = null;
  let _0x34609a = null;
  let _0x10e536 = null;
  let _0x1561b2 = null;
  let _0x566ba3 = null;
  let _0x322b77 = null;
  let _0x43b98b = 0x0;
  let _0x1df037 = 0x0;
  let _0x591fd0 = ![];
  function _0x5db7ab() {
    return typeof performance !== 'undefined' && performance && typeof performance['now'] === "function" ? performance["now"]() : Date["now"]();
  }
  function _0x3afe58(_0x14c806) {
    const _0x28c858 = Number(_0x14c806?.["_nodeCount"]);
    if (Number['isFinite'](_0x28c858)) {
      return _0x28c858;
    }
    return Object['keys'](_0x14c806?.['nodes'] || {})["length"];
  }
  function _0x47d21a() {
    return readViewportInteractionState()['isPanning'];
  }
  function _0x2c5819(_0x198abd) {
    if (typeof requestAnimationFrame === "function") {
      return requestAnimationFrame(_0x198abd);
    }
    return setTimeout(_0x198abd, 0x10);
  }
  function _0x3e98c0(_0x25e286) {
    if (!_0x25e286) {
      return;
    }
    if (typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(_0x25e286);
      return;
    }
    clearTimeout(_0x25e286);
  }
  function _0x23f42e() {
    return {
      'mapW': _0x392f3c,
      'mapH': _0x1c9f2b
    };
  }
  function _0x2d820e(_0x3abe70) {
    const _0x2aee75 = Array["isArray"](_0x3abe70?.["contentBoxSize"]) ? _0x3abe70["contentBoxSize"][0x0] : _0x3abe70?.['contentBoxSize'];
    return {
      'width': Number(_0x2aee75?.["inlineSize"]) || Number(_0x3abe70?.["contentRect"]?.["width"]),
      'height': Number(_0x2aee75?.["blockSize"]) || Number(_0x3abe70?.["contentRect"]?.["height"])
    };
  }
  function _0x57577b(_0x1200b8, _0x10e7a7) {
    const _0x58cd50 = Number(_0x1200b8);
    const _0x2af586 = Number(_0x10e7a7);
    if (!(_0x58cd50 > 0x0 && _0x2af586 > 0x0)) {
      return;
    }
    if (_0x58cd50 === _0x392f3c && _0x2af586 === _0x1c9f2b) {
      return;
    }
    _0x392f3c = _0x58cd50;
    _0x1c9f2b = _0x2af586;
    _0x3dd796 = null;
    _0x45cc59("both");
  }
  function _0x17e97b(_0x117aaa) {
    if (_0x117aaa && _0x117aaa["width"] !== 0x0) {
      return _0x117aaa;
    }
    return {
      'minX': -0x3e8,
      'minY': -0x3e8,
      'maxX': 0x3e8,
      'maxY': 0x3e8,
      'width': 0x7d0,
      'height': 0x7d0
    };
  }
  function _0x3139ce(_0x31601b) {
    const _0x248207 = Number(_0x31601b?.["_nodeCount"]);
    if (Number["isFinite"](_0x248207)) {
      return _0x248207 <= 0x0;
    }
    return !_0x31601b?.['nodes'] || Object["keys"](_0x31601b["nodes"])['length'] === 0x0;
  }
  function _0x31fae8(_0x56cf6b) {
    return {
      'x': Number['isFinite'](Number(_0x56cf6b?.['x'])) ? Number(_0x56cf6b['x']) : 0x0,
      'y': Number["isFinite"](Number(_0x56cf6b?.['y'])) ? Number(_0x56cf6b['y']) : 0x0,
      'zoom': Number["isFinite"](Number(_0x56cf6b?.["zoom"])) ? Number(_0x56cf6b["zoom"]) : 0x1
    };
  }
  function _0x538d0f(_0x512ea0) {
    const _0x5afd0c = Number(_0x512ea0);
    return Number['isFinite'](_0x5afd0c) ? Math['round'](_0x5afd0c * 0x64) / 0x64 : 0x0;
  }
  function _0x1d7db9(_0x56ee9e) {
    return [_0x56ee9e['id'] || '', _0x56ee9e["type"] || '', _0x538d0f(_0x56ee9e['x']), _0x538d0f(_0x56ee9e['y']), _0x538d0f(_0x56ee9e['width'] || 0xc8), _0x538d0f(_0x56ee9e["height"] || 0x64)]["join"](':');
  }
  function _0x19adfd(_0x300c36 = {}) {
    let _0x4b2409 = '';
    for (const _0x66244d of Object["values"](_0x300c36 || {})) {
      if (!_0x66244d || isNodeType(_0x66244d, 'group')) {
        continue;
      }
      _0x4b2409 += _0x1d7db9(_0x66244d) + '|';
    }
    return _0x4b2409;
  }
  function _0x586a1b(_0x38de31, _0x163441) {
    if (!_0x38de31 || !_0x163441?.["bounds"]) {
      return !![];
    }
    return _0x38de31['minX'] !== _0x163441['bounds']["minX"] || _0x38de31['minY'] !== _0x163441['bounds']["minY"] || _0x38de31["maxX"] !== _0x163441["bounds"]["maxX"] || _0x38de31["maxY"] !== _0x163441["bounds"]["maxY"] || _0x38de31["scale"] !== _0x163441["scale"] || _0x38de31["offsetX"] !== _0x163441["offsetX"] || _0x38de31["offsetY"] !== _0x163441["offsetY"];
  }
  function _0x6b23d3(_0x1d4f16, _0x175ec6, _0x4df205 = {}) {
    const _0xd5635b = _0x17e97b(_0x1d4f16);
    const {
      mapW: _0x1974ba,
      mapH: _0x1f25c0
    } = _0x23f42e();
    const _0x17b0a9 = Math["max"](_0xd5635b["width"], 0x3e8);
    const _0x29686e = Math["max"](_0xd5635b['height'], 0x3e8);
    const _0x33c007 = Math["min"](_0x1974ba / _0x17b0a9, _0x1f25c0 / _0x29686e);
    const _0x32ce99 = (_0x1974ba - _0x17b0a9 * _0x33c007) / 0x2;
    const _0x32c8a0 = (_0x1f25c0 - _0x29686e * _0x33c007) / 0x2;
    _0x3dd796 = _0xd5635b;
    _0x8b8d5a = _0x33c007;
    _0x76566e = _0x32ce99;
    _0xc19bba = _0x32c8a0;
    _0x22beca = _0x1974ba;
    _0x27479e = _0x1f25c0;
    _0x4e4363 = Number["isFinite"](_0x175ec6) ? _0x175ec6 : -0x1;
    _0x262c16 = _0x4df205["trackViewport"] === !![];
    const _0x4efaf5 = _0x31fae8(_0x4df205['viewport']);
    _0x379a90 = _0x4efaf5['x'];
    _0x55b133 = _0x4efaf5['y'];
    _0x45bf7f = _0x4efaf5['zoom'];
    window["_v2MinimapScale"] = _0x33c007;
    return {
      'bounds': _0xd5635b,
      'scale': _0x33c007,
      'offsetX': _0x32ce99,
      'offsetY': _0x32c8a0,
      'mapW': _0x1974ba,
      'mapH': _0x1f25c0
    };
  }
  function _0x3e59a8(_0x1e71aa) {
    const _0x69f5b2 = _0x3139ce(_0x1e71aa);
    const _0x5cd4e5 = calcWorldBounds(_0x1e71aa?.["nodes"] || {}, _0x1e71aa?.["viewport"]);
    return _0x6b23d3(_0x5cd4e5, getMinimapNodeLayoutRevision(_0x1e71aa), {
      'trackViewport': _0x69f5b2,
      'viewport': _0x69f5b2 ? _0x1e71aa?.['viewport'] : null
    });
  }
  function _0xb42970(_0x2bd607, {
    allowCached = !![]
  } = {}) {
    const _0x515b3b = getMinimapNodeLayoutRevision(_0x2bd607);
    const _0x1dc5a9 = _0x3139ce(_0x2bd607);
    const _0x43e63f = _0x31fae8(_0x2bd607?.['viewport']);
    const {
      mapW: _0x3e6e45,
      mapH: _0x30dccf
    } = _0x23f42e();
    const _0x2de0d7 = !!_0x3dd796;
    const _0x4e13e8 = _0x2de0d7 && _0x4e4363 === _0x515b3b;
    const _0x655368 = _0x2de0d7 && _0x22beca === _0x3e6e45 && _0x27479e === _0x30dccf;
    const _0x42f4ec = _0x2de0d7 && _0x262c16 === !![] && _0x1dc5a9 === !![] && _0x379a90 === _0x43e63f['x'] && _0x55b133 === _0x43e63f['y'] && _0x45bf7f === _0x43e63f['zoom'];
    if (allowCached && _0x4e13e8 && (!_0x1dc5a9 && !_0x262c16 || _0x42f4ec)) {
      if (_0x655368) {
        window["_v2MinimapScale"] = _0x8b8d5a;
        return {
          'bounds': _0x3dd796,
          'scale': _0x8b8d5a,
          'offsetX': _0x76566e,
          'offsetY': _0xc19bba,
          'mapW': _0x3e6e45,
          'mapH': _0x30dccf
        };
      }
      return _0x6b23d3(_0x3dd796, _0x515b3b, {
        'trackViewport': _0x1dc5a9,
        'viewport': _0x1dc5a9 ? _0x43e63f : null
      });
    }
    return _0x3e59a8(_0x2bd607);
  }
  function _0x41da9e(_0x1a53d7) {
    const _0x96f6a5 = getMinimapNodeLayoutRevision(_0x1a53d7);
    const _0x398ea1 = _0x3139ce(_0x1a53d7);
    if (_0x3dd796 && _0x4e4363 === _0x96f6a5 && !_0x398ea1 && !_0x262c16) {
      window["_v2MinimapScale"] = _0x8b8d5a;
      return {
        'bounds': _0x3dd796,
        'scale': _0x8b8d5a,
        'offsetX': _0x76566e,
        'offsetY': _0xc19bba,
        'mapW': _0x22beca,
        'mapH': _0x27479e
      };
    }
    return _0xb42970(_0x1a53d7, {
      'allowCached': !![]
    });
  }
  function _0x3fa5ac() {
    _0x10e536 = null;
    if (_0x47d21a()) {
      _0x10e536 = setTimeout(_0x3fa5ac, PAN_NODE_UPDATE_DELAY_MS);
      return;
    }
    !_0x5b71d7 && (_0x5b71d7 = _0x2c5819(_0x901b53));
  }
  function _0x45cc59(_0x35279d) {
    if (!_0x34609a) {
      _0x34609a = _0x35279d;
    } else {
      if (_0x34609a === "both" || _0x35279d === "both") {
        _0x34609a = "both";
      } else {
        _0x34609a !== _0x35279d ? _0x34609a = 'both' : _0x34609a = _0x35279d;
      }
    }
    if (_0x47d21a() && (_0x34609a === 'nodes' || _0x34609a === 'both')) {
      !_0x10e536 && (_0x10e536 = setTimeout(_0x3fa5ac, PAN_NODE_UPDATE_DELAY_MS));
      return;
    }
    !_0x5b71d7 && (_0x5b71d7 = _0x2c5819(_0x901b53));
  }
  function _0x901b53() {
    _0x5b71d7 = null;
    const _0xac70a8 = _0x34609a;
    _0x34609a = null;
    if (!_0xac70a8) {
      return;
    }
    const _0x2d6dd7 = _0x5b42d7["getStateRaw"]();
    _0xac70a8 === "nodes" || _0xac70a8 === "both" ? _0x2950e2(_0x2d6dd7) : _0x3d07ad(_0x2d6dd7);
  }
  function _0x2950e2(_0x1202ab) {
    const _0x1c2605 = _0x5db7ab();
    const _0x34fb67 = _0x1202ab?.["nodes"] || {};
    const _0x48540e = _0x1202ab?.["viewport"] || {
      'x': 0x0,
      'y': 0x0,
      'zoom': 0x1
    };
    const _0x5334d9 = _0x19adfd(_0x34fb67);
    const _0x58d680 = getMinimapNodeLayoutRevision(_0x1202ab);
    if (_0x3dd796 && _0x4b563a === _0x5334d9 && !_0x3139ce(_0x1202ab)) {
      _0x4e4363 = _0x58d680;
      _0x3ad1c0['forEach'](_0x18e832 => {
        if (_0x18e832?.['style']?.["transform"]) {
          _0x18e832["style"]["transform"] = '';
        }
      });
      _0x1c5538(_0x48540e, _0x3dd796, _0x8b8d5a, _0x76566e, _0xc19bba);
      recordMinimapUpdateSample("viewport", _0x5db7ab() - _0x1c2605, {
        'nodeCount': _0x3afe58(_0x1202ab),
        'dotCount': _0x3ad1c0["size"],
        'viewportOnly': !![]
      });
      return;
    }
    const _0x24d66c = _0x3dd796 ? {
      'minX': _0x3dd796["minX"],
      'minY': _0x3dd796["minY"],
      'maxX': _0x3dd796["maxX"],
      'maxY': _0x3dd796["maxY"],
      'scale': _0x8b8d5a,
      'offsetX': _0x76566e,
      'offsetY': _0xc19bba
    } : null;
    const _0x4883e5 = _0x3e59a8(_0x1202ab);
    const {
      bounds: _0x394d5a,
      scale: _0x27fc5d,
      offsetX: _0x1b2f2c,
      offsetY: _0x143726
    } = _0x4883e5;
    const _0x10bd30 = _0x586a1b(_0x24d66c, _0x4883e5);
    const _0x58deea = new Set();
    let _0x31f261 = 0x0;
    let _0xf7c2f7 = 0x0;
    let _0x5169c0 = 0x0;
    window['_v2MinimapDotMap'] = _0x3ad1c0;
    Object['values'](_0x34fb67)["forEach"](_0x3b146f => {
      if (isNodeType(_0x3b146f, "group")) {
        return;
      }
      _0x58deea["add"](_0x3b146f['id']);
      let _0x5e66b0 = _0x3ad1c0['get'](_0x3b146f['id']);
      const _0x533d03 = _0x1d7db9(_0x3b146f);
      const _0x38371f = _0x19973f["get"](_0x3b146f['id']) !== _0x533d03;
      _0x19973f["set"](_0x3b146f['id'], _0x533d03);
      if (!_0x5e66b0) {
        _0x5e66b0 = document["createElement"]("div");
        _0x5e66b0['id'] = "minimap-node-" + _0x3b146f['id'];
        _0x3ad1c0["set"](_0x3b146f['id'], _0x5e66b0);
        _0x17bd60["appendChild"](_0x5e66b0);
        _0x31f261 += 0x1;
      } else {
        if (_0x10bd30 || _0x38371f) {
          _0xf7c2f7 += 0x1;
        } else {
          if (_0x5e66b0["style"]["transform"]) {
            _0x5e66b0["style"]["transform"] = '';
          }
          return;
        }
      }
      const _0x4b1b99 = _0x1b2f2c + (_0x3b146f['x'] - _0x394d5a["minX"]) * _0x27fc5d;
      const _0x4b50a7 = _0x143726 + (_0x3b146f['y'] - _0x394d5a["minY"]) * _0x27fc5d;
      const _0x46d553 = Math["max"]((_0x3b146f['width'] || 0xc8) * _0x27fc5d, 0x2);
      const _0x4f510b = Math["max"]((_0x3b146f["height"] || 0x64) * _0x27fc5d, 0x2);
      let _0x36d50c = "default";
      const _0x454c0d = _0x3b146f["type"] || '';
      if (_0x454c0d["includes"]("text")) {
        _0x36d50c = 'text';
      } else {
        if (_0x454c0d["includes"]('image')) {
          _0x36d50c = "image";
        } else {
          if (_0x454c0d['includes']('video')) {
            _0x36d50c = 'video';
          } else {
            if (_0x454c0d["includes"]("audio")) {
              _0x36d50c = "audio";
            }
          }
        }
      }
      _0x5e66b0['className'] !== "minimap-node " + _0x36d50c && (_0x5e66b0["className"] = "minimap-node " + _0x36d50c);
      if (_0x5e66b0["style"]["left"] !== _0x4b1b99 + 'px') {
        _0x5e66b0["style"]["left"] = _0x4b1b99 + 'px';
      }
      if (_0x5e66b0["style"]["top"] !== _0x4b50a7 + 'px') {
        _0x5e66b0['style']['top'] = _0x4b50a7 + 'px';
      }
      if (_0x5e66b0['style']["width"] !== _0x46d553 + 'px') {
        _0x5e66b0["style"]["width"] = _0x46d553 + 'px';
      }
      if (_0x5e66b0["style"]["height"] !== _0x4f510b + 'px') {
        _0x5e66b0["style"]["height"] = _0x4f510b + 'px';
      }
      if (_0x5e66b0["style"]["transform"]) {
        _0x5e66b0["style"]['transform'] = '';
      }
    });
    _0x3ad1c0["forEach"]((_0x3b7d0e, _0x12496e) => {
      !_0x58deea["has"](_0x12496e) && (_0x3b7d0e["remove"](), _0x3ad1c0['delete'](_0x12496e), _0x19973f["delete"](_0x12496e), _0x5169c0 += 0x1);
    });
    _0x1c5538(_0x48540e, _0x394d5a, _0x27fc5d, _0x1b2f2c, _0x143726);
    recordMinimapUpdateSample("nodes", _0x5db7ab() - _0x1c2605, {
      'nodeCount': _0x3afe58(_0x1202ab),
      'dotCount': _0x3ad1c0["size"],
      'createdCount': _0x31f261,
      'updatedCount': _0xf7c2f7,
      'removedCount': _0x5169c0,
      'viewportOnly': ![]
    });
    _0x4b563a = _0x5334d9;
  }
  function _0x3d07ad(_0x37997a) {
    const _0x3d7f9f = _0x5db7ab();
    const _0x2815af = _0x37997a?.['viewport'] || {
      'x': 0x0,
      'y': 0x0,
      'zoom': 0x1
    };
    if (!_0x3dd796) {
      _0x2950e2(_0x5b42d7["getStateRaw"]());
      return;
    }
    const _0x14d226 = getMinimapNodeLayoutRevision(_0x37997a);
    if (_0x4e4363 !== _0x14d226) {
      _0x2950e2(_0x5b42d7["getStateRaw"]());
      return;
    }
    const {
      bounds: _0x27d50d,
      scale: _0x128c83,
      offsetX: _0x5558bb,
      offsetY: _0x24ed7b
    } = _0x41da9e(_0x37997a);
    _0x1c5538(_0x2815af, _0x27d50d, _0x128c83, _0x5558bb, _0x24ed7b);
    recordMinimapUpdateSample("viewport", _0x5db7ab() - _0x3d7f9f, {
      'nodeCount': _0x3afe58(_0x37997a),
      'dotCount': _0x3ad1c0['size'],
      'viewportOnly': !![]
    });
  }
  function _0x1c5538(_0x4ae9ad, _0x5ea26e, _0x502b4d, _0xae1cb4, _0x560d4d) {
    const _0x10dff5 = getViewportScreenBounds(_0x4ae9ad, window["innerWidth"], window["innerHeight"]);
    const _0x1967a7 = _0x10dff5['width'] / _0x4ae9ad['zoom'];
    const _0x23da0d = _0x10dff5["height"] / _0x4ae9ad["zoom"];
    const _0x429357 = -_0x4ae9ad['x'] / _0x4ae9ad["zoom"];
    const _0x883729 = -_0x4ae9ad['y'] / _0x4ae9ad['zoom'];
    const _0x48b6bf = _0xae1cb4 + (_0x429357 - _0x5ea26e["minX"]) * _0x502b4d;
    const _0x1fee55 = _0x560d4d + (_0x883729 - _0x5ea26e["minY"]) * _0x502b4d;
    const _0xcae104 = _0x1967a7 * _0x502b4d;
    const _0x119cc8 = _0x23da0d * _0x502b4d;
    _0x49b271["style"]["left"] !== _0x48b6bf + 'px' && (_0x49b271["style"]["left"] = _0x48b6bf + 'px');
    _0x49b271["style"]["top"] !== _0x1fee55 + 'px' && (_0x49b271['style']['top'] = _0x1fee55 + 'px');
    _0x49b271["style"]["width"] !== _0xcae104 + 'px' && (_0x49b271['style']['width'] = _0xcae104 + 'px');
    _0x49b271["style"]['height'] !== _0x119cc8 + 'px' && (_0x49b271["style"]["height"] = _0x119cc8 + 'px');
  }
  function _0x74e64e() {
    if (_0x1561b2) {
      return;
    }
    _0x1561b2 = _0x2c5819(_0x1bea79);
  }
  function _0x1bea79() {
    _0x1561b2 = null;
    if (!_0x322b77) {
      return;
    }
    const _0x2b6eed = _0x322b77;
    _0x322b77 = null;
    const _0x2b9118 = _0x5b42d7["getStateRaw"]();
    const _0x3308d2 = {
      ..._0x2b9118,
      'viewport': _0x2b6eed
    };
    const _0x2e8755 = _0x5db7ab();
    const {
      bounds: _0x387393,
      scale: _0x56727e,
      offsetX: _0x3f7a06,
      offsetY: _0x37e044
    } = _0xb42970(_0x3308d2, {
      'allowCached': !![]
    });
    _0x1c5538(_0x2b6eed, _0x387393, _0x56727e, _0x3f7a06, _0x37e044);
    _0x43b98b = _0x5db7ab();
    _0x1df037 += 0x1;
    recordMinimapUpdateSample("pan-preview", _0x43b98b - _0x2e8755, {
      'nodeCount': _0x3afe58(_0x2b9118),
      'dotCount': _0x3ad1c0['size'],
      'viewportOnly': !![],
      'delayed': _0x591fd0
    });
    _0x591fd0 = ![];
  }
  function _0x32d905(_0x382188, _0x19dcb8 = {}) {
    _0x322b77 = _0x31fae8(_0x382188);
    const _0xce20c0 = _0x19dcb8["force"] === !![];
    const _0x9b06bf = _0x5db7ab() - _0x43b98b;
    const _0x5dfcf4 = _0xce20c0 ? 0x0 : Math["max"](0x0, PAN_PREVIEW_MIN_INTERVAL_MS - _0x9b06bf);
    if (_0x5dfcf4 <= 0x0) {
      _0x566ba3 && (clearTimeout(_0x566ba3), _0x566ba3 = null);
      _0x591fd0 = ![];
      _0x74e64e();
      return;
    }
    !_0x566ba3 && (_0x591fd0 = !![], _0x566ba3 = setTimeout(() => {
      _0x566ba3 = null;
      _0x74e64e();
    }, _0x5dfcf4));
  }
  function _0x206288(_0x52a46e = null) {
    if (_0x52a46e) {
      _0x322b77 = _0x31fae8(_0x52a46e);
    }
    _0x566ba3 && (clearTimeout(_0x566ba3), _0x566ba3 = null);
    _0x1561b2 && (_0x3e98c0(_0x1561b2), _0x1561b2 = null);
    _0x1bea79();
    return _0x1df037;
  }
  const _0x3fe86c = (_0x220832, _0x579d8b = {}) => _0x32d905(_0x220832, _0x579d8b);
  const _0xfc91fd = (_0x52608e = null) => _0x206288(_0x52608e);
  const _0x529280 = () => _0x1df037;
  const _0x4cf8d3 = () => _0x45cc59("nodes");
  window['_v2ScheduleMinimapViewportPreview'] = _0x3fe86c;
  window["_v2FlushMinimapViewportPreview"] = _0xfc91fd;
  window["_v2GetMinimapPreviewFlushCount"] = _0x529280;
  window["_v2ScheduleMinimapNodeRefresh"] = _0x4cf8d3;
  const _0x11636c = _0x5b42d7["subscribeSelector"](getMinimapNodeLayoutRevision, () => _0x45cc59("nodes"));
  const _0xf588c9 = _0x5b42d7["subscribeSelector"](_0x45da83 => _0x45da83["viewport"], () => _0x45cc59('viewport'));
  const _0x58e1ed = window["ResizeObserver"];
  typeof _0x58e1ed === "function" && (_0x5d945f = new _0x58e1ed(_0x1be874 => {
    const _0x4a2572 = _0x1be874?.["find"]?.(_0x33e053 => _0x33e053?.["target"] === _0x17bd60) || _0x1be874?.[0x0];
    if (!_0x4a2572) {
      return;
    }
    const {
      width: _0x4a2ffd,
      height: _0x168cde
    } = _0x2d820e(_0x4a2572);
    _0x57577b(_0x4a2ffd, _0x168cde);
  }), _0x5d945f["observe"](_0x17bd60));
  _0x45cc59("both");
  const _0x18cc4d = document["getElementById"]("v2-wrap");
  _0x18cc4d && (_0x18cc4d["style"]["removeProperty"]("--bg-x"), _0x18cc4d['style']["removeProperty"]('--bg-y'), _0x18cc4d["style"]["removeProperty"]('--bg-zoom'));
  let _0x3cdeaf = null;
  const _0x306385 = _0x49aef9 => {
    if (_0x3cdeaf === null) {
      return;
    }
    if (_0x49aef9?.['pointerId'] !== undefined && _0x49aef9["pointerId"] !== _0x3cdeaf) {
      return;
    }
    const _0x5eeeb8 = _0x3cdeaf;
    _0x3cdeaf = null;
    _0x3e090e["hasPointerCapture"]?.(_0x5eeeb8) && _0x3e090e["releasePointerCapture"](_0x5eeeb8);
  };
  const _0x33dfea = _0x134338 => {
    const _0x22d783 = _0x5b42d7['getStateRaw']();
    const {
      viewport: _0x1b13f1
    } = _0x22d783;
    const {
      bounds: _0x3281c8,
      scale: _0x54084c,
      offsetX: _0x4deea5,
      offsetY: _0x398eeb
    } = _0xb42970(_0x22d783, {
      'allowCached': !![]
    });
    const _0x1d6442 = _0x17bd60['getBoundingClientRect']();
    const _0x8d26fd = _0x134338['clientX'] - _0x1d6442["left"] - _0x4deea5;
    const _0x1d6c40 = _0x134338["clientY"] - _0x1d6442['top'] - _0x398eeb;
    const _0x47224b = _0x3281c8["minX"] + _0x8d26fd / _0x54084c;
    const _0x5a49a3 = _0x3281c8["minY"] + _0x1d6c40 / _0x54084c;
    const _0x22634c = getViewportScreenBounds(_0x1b13f1, window["innerWidth"], window["innerHeight"]);
    const _0x434fb2 = _0x22634c["width"] / 0x2 - _0x47224b * _0x1b13f1['zoom'];
    const _0xbb3cba = _0x22634c["height"] / 0x2 - _0x5a49a3 * _0x1b13f1["zoom"];
    _0x5b42d7["updateViewport"](_0x434fb2, _0xbb3cba, _0x1b13f1["zoom"]);
  };
  const _0x36bbcc = _0x1504ea => {
    _0x1504ea["stopPropagation"]();
    if ((_0x1504ea['button'] ?? 0x0) !== 0x0 || _0x1504ea['isPrimary'] === ![] || _0x3cdeaf !== null) {
      return;
    }
    _0x3cdeaf = _0x1504ea['pointerId'];
    try {
      _0x3e090e["setPointerCapture"](_0x1504ea["pointerId"]);
    } catch {
      _0x306385();
      return;
    }
    _0x33dfea(_0x1504ea);
  };
  const _0x346ab7 = _0x4aad09 => {
    if (_0x3cdeaf === null || _0x4aad09["pointerId"] !== _0x3cdeaf) {
      return;
    }
    if (_0x4aad09["buttons"] === 0x0) {
      _0x306385(_0x4aad09);
      return;
    }
    _0x33dfea(_0x4aad09);
  };
  _0x3e090e['addEventListener']("pointerdown", _0x36bbcc);
  _0x3e090e["addEventListener"]("pointermove", _0x346ab7);
  _0x3e090e["addEventListener"]("pointerup", _0x306385);
  _0x3e090e["addEventListener"]("pointercancel", _0x306385);
  _0x3e090e["addEventListener"]("lostpointercapture", _0x306385);
  window['addEventListener']?.("blur", _0x306385);
  return function _0x44920a() {
    _0x306385();
    _0x3e090e["removeEventListener"]("pointerdown", _0x36bbcc);
    _0x3e090e["removeEventListener"]("pointermove", _0x346ab7);
    _0x3e090e['removeEventListener']("pointerup", _0x306385);
    _0x3e090e["removeEventListener"]('pointercancel', _0x306385);
    _0x3e090e['removeEventListener']("lostpointercapture", _0x306385);
    window["removeEventListener"]?.('blur', _0x306385);
    _0x11636c();
    _0xf588c9();
    _0x5b71d7 && (_0x3e98c0(_0x5b71d7), _0x5b71d7 = null);
    _0x10e536 && (clearTimeout(_0x10e536), _0x10e536 = null);
    _0x1561b2 && (_0x3e98c0(_0x1561b2), _0x1561b2 = null);
    _0x566ba3 && (clearTimeout(_0x566ba3), _0x566ba3 = null);
    _0x5d945f?.["disconnect"]?.();
    _0x5d945f = null;
    window['_v2ScheduleMinimapViewportPreview'] === _0x3fe86c && delete window["_v2ScheduleMinimapViewportPreview"];
    window["_v2FlushMinimapViewportPreview"] === _0xfc91fd && delete window["_v2FlushMinimapViewportPreview"];
    window["_v2GetMinimapPreviewFlushCount"] === _0x529280 && delete window["_v2GetMinimapPreviewFlushCount"];
    window["_v2ScheduleMinimapNodeRefresh"] === _0x4cf8d3 && delete window["_v2ScheduleMinimapNodeRefresh"];
    _0x3ad1c0["forEach"](_0x5300fa => _0x5300fa["remove"]());
    _0x3ad1c0['clear']();
  };
}