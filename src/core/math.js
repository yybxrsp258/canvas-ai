export { clientToViewportNdc, ndcToViewportPoint, intersectRayWithAxisPlane, adjustSpatialCamera, applyRelativeCameraPose } from './spatialProjectionMath.js';
export { projectPointToViewportEdge, spreadViewportBoundaryPoint } from './viewportBoundaryMath.js';
export { normalizeRotationDegrees, getRotatedSize, rotatePointAroundCenter, getImageRotationLayout, inverseImageRotationPoint } from './rotationMath.js';
export function generateId(_0x5acd36 = 'id') {
  return _0x5acd36 + '-' + Date["now"]() + '-' + Math['random']()["toString"](0x24)["substr"](0x2, 0x9);
}
export function screenToWorld(_0x751c29, _0x339553, _0x1e338f) {
  const {
    x: _0x266158,
    y: _0x431600,
    zoom: _0x6e618f
  } = _0x1e338f;
  const _0x32cc1b = getViewportScreenOrigin(_0x1e338f);
  return {
    'x': (_0x751c29 - _0x32cc1b['x'] - _0x266158) / _0x6e618f,
    'y': (_0x339553 - _0x32cc1b['y'] - _0x431600) / _0x6e618f
  };
}
export function worldToScreen(_0x4ff17a, _0x129790, _0x1f9ae6) {
  const {
    x: _0x30cfde,
    y: _0x535c92,
    zoom: _0x4ac29f
  } = _0x1f9ae6;
  const _0x475806 = getViewportScreenOrigin(_0x1f9ae6);
  return {
    'x': _0x4ff17a * _0x4ac29f + _0x30cfde + _0x475806['x'],
    'y': _0x129790 * _0x4ac29f + _0x535c92 + _0x475806['y']
  };
}
export function getViewportScreenOrigin(_0x20c3fd = {}) {
  return {
    'x': Number['isFinite'](Number(_0x20c3fd?.['_screenOriginX'])) ? Number(_0x20c3fd['_screenOriginX']) : 0x0,
    'y': Number["isFinite"](Number(_0x20c3fd?.["_screenOriginY"])) ? Number(_0x20c3fd["_screenOriginY"]) : 0x0
  };
}
export function screenToViewportPoint(_0x119154, _0x19ba1d, _0x1b3b93 = {}) {
  const _0x1dfea0 = getViewportScreenOrigin(_0x1b3b93);
  return {
    'x': Number(_0x119154) - _0x1dfea0['x'],
    'y': Number(_0x19ba1d) - _0x1dfea0['y']
  };
}
export function getViewportScreenBounds(_0x2b3c6e = {}, _0xc59435 = 0x0, _0x32e08e = 0x0) {
  const _0x5e064b = getViewportScreenOrigin(_0x2b3c6e);
  const _0x457158 = Number["isFinite"](Number(_0xc59435)) ? Number(_0xc59435) : 0x0;
  const _0x42a93b = Number['isFinite'](Number(_0x32e08e)) ? Number(_0x32e08e) : 0x0;
  const _0x22cc0c = Math["max"](0x0, _0x457158 - _0x5e064b['x']);
  const _0x1b15ba = Math['max'](0x0, _0x42a93b - _0x5e064b['y']);
  return {
    'left': _0x5e064b['x'],
    'top': _0x5e064b['y'],
    'right': _0x5e064b['x'] + _0x22cc0c,
    'bottom': _0x5e064b['y'] + _0x1b15ba,
    'width': _0x22cc0c,
    'height': _0x1b15ba,
    'centerX': _0x5e064b['x'] + _0x22cc0c / 0x2,
    'centerY': _0x5e064b['y'] + _0x1b15ba / 0x2
  };
}
export function getViewportScreenCenter(_0x488f8f = {}, _0x1d7c0d = 0x0, _0x1e53bc = 0x0) {
  const _0x30c9eb = getViewportScreenBounds(_0x488f8f, _0x1d7c0d, _0x1e53bc);
  return {
    'x': _0x30c9eb['centerX'],
    'y': _0x30c9eb["centerY"]
  };
}
export const CANVAS_GRID_SIZE = 0x14;
export function snapToCanvasGrid(_0x4588f3, _0x5caaea = CANVAS_GRID_SIZE) {
  const _0x256f5b = Number["isFinite"](Number(_0x5caaea)) && Number(_0x5caaea) > 0x0 ? Number(_0x5caaea) : CANVAS_GRID_SIZE;
  const _0x3c3317 = Number(_0x4588f3);
  if (!Number["isFinite"](_0x3c3317)) {
    return 0x0;
  }
  return Math["round"](_0x3c3317 / _0x256f5b) * _0x256f5b;
}
export function isPointInRect(_0x402fe5, _0x5ad688, _0x12b07f, _0x1f21e8, _0x3f2c2e, _0x855bde) {
  return _0x402fe5 >= _0x12b07f && _0x402fe5 <= _0x12b07f + _0x3f2c2e && _0x5ad688 >= _0x1f21e8 && _0x5ad688 <= _0x1f21e8 + _0x855bde;
}
export function isRectIntersect(_0x346754, _0xcda92, _0x3d3a85, _0x4c924f, _0x465dfb, _0x4d8e0f, _0x3cf4b5, _0x573717) {
  return !(_0x465dfb >= _0x346754 + _0x3d3a85 || _0x465dfb + _0x3cf4b5 <= _0x346754 || _0x4d8e0f >= _0xcda92 + _0x4c924f || _0x4d8e0f + _0x573717 <= _0xcda92);
}
export function clampRectGroupTranslation(_0x3fdd27 = [], _0x1cf6ea = 0x0, _0xd8bc88 = 0x0, _0x30ce0c = {
  'x': 0x0,
  'y': 0x0,
  'width': 0x1,
  'height': 0x1
}) {
  const _0x1adf99 = (Array['isArray'](_0x3fdd27) ? _0x3fdd27 : [])["map"](_0x2c3bf7 => ({
    'x': Number(_0x2c3bf7?.['x']),
    'y': Number(_0x2c3bf7?.['y']),
    'width': Number(_0x2c3bf7?.['width']),
    'height': Number(_0x2c3bf7?.['height'])
  }))["filter"](_0xadb5ec => Number["isFinite"](_0xadb5ec['x']) && Number["isFinite"](_0xadb5ec['y']) && Number["isFinite"](_0xadb5ec["width"]) && _0xadb5ec["width"] >= 0x0 && Number["isFinite"](_0xadb5ec["height"]) && _0xadb5ec["height"] >= 0x0);
  if (!_0x1adf99["length"]) {
    return {
      'x': 0x0,
      'y': 0x0
    };
  }
  const _0xaa8bec = Number['isFinite'](Number(_0x30ce0c?.['x'])) ? Number(_0x30ce0c['x']) : 0x0;
  const _0x5b207c = Number["isFinite"](Number(_0x30ce0c?.['y'])) ? Number(_0x30ce0c['y']) : 0x0;
  const _0x182c2b = Math["max"](0x0, Number(_0x30ce0c?.["width"]) || 0x0);
  const _0x202e87 = Math["max"](0x0, Number(_0x30ce0c?.["height"]) || 0x0);
  const _0x95927a = Math["min"](..._0x1adf99["map"](_0x349b80 => _0x349b80['x']));
  const _0x206f8a = Math["min"](..._0x1adf99["map"](_0x623056 => _0x623056['y']));
  const _0xd6543c = Math["max"](..._0x1adf99["map"](_0x1dae59 => _0x1dae59['x'] + _0x1dae59["width"]));
  const _0x35aac9 = Math["max"](..._0x1adf99["map"](_0x17ea82 => _0x17ea82['y'] + _0x17ea82['height']));
  const _0x4a7a1f = Number(_0x1cf6ea) || 0x0;
  const _0x5ee2a9 = Number(_0xd8bc88) || 0x0;
  return {
    'x': Math["max"](_0xaa8bec - _0x95927a, Math["min"](_0xaa8bec + _0x182c2b - _0xd6543c, _0x4a7a1f)),
    'y': Math["max"](_0x5b207c - _0x206f8a, Math["min"](_0x5b207c + _0x202e87 - _0x35aac9, _0x5ee2a9))
  };
}
export function findAvailablePosition(_0x2bb074, _0x5bd207, _0x5f54ba, _0x84a9fc, _0x30e6d8, _0x15c377 = 0x14, _0x54cd75 = "right") {
  let _0x2384f4 = _0x5bd207;
  let _0xe9f344 = _0x5f54ba;
  const _0x4924cf = Object["values"](_0x2bb074);
  if (_0x4924cf["length"] === 0x0) {
    return {
      'x': _0x2384f4,
      'y': _0xe9f344
    };
  }
  let _0x2cb864 = !![];
  while (_0x2cb864) {
    _0x2cb864 = ![];
    for (const _0x10c3c5 of _0x4924cf) {
      const _0x177963 = _0x10c3c5['x'];
      const _0xd50b50 = _0x10c3c5['y'];
      const _0x574c03 = _0x10c3c5["width"] || 0x64;
      const _0x27c40f = _0x10c3c5["height"] || 0x64;
      if (isRectIntersect(_0x2384f4, _0xe9f344, _0x84a9fc, _0x30e6d8, _0x177963, _0xd50b50, _0x574c03, _0x27c40f)) {
        if (_0x54cd75 === 'down') {
          _0xe9f344 = _0xd50b50 + _0x27c40f + _0x15c377;
        } else {
          _0x54cd75 === "left" ? _0x2384f4 = _0x177963 - _0x15c377 - _0x84a9fc : _0x2384f4 = _0x177963 + _0x574c03 + _0x15c377;
        }
        _0x2cb864 = !![];
        break;
      }
    }
  }
  return {
    'x': _0x2384f4,
    'y': _0xe9f344
  };
}
const ALIGN_SKIP_KEYS = ['isLocked', "locked", "isHidden", "hidden", "isTemp", "temp", "temporary", "ephemeral", "isDeleted", "deleted"];
function _toFiniteNumber(_0x139c79, _0x4ec29c = 0x0) {
  const _0x4b7644 = Number(_0x139c79);
  return Number['isFinite'](_0x4b7644) ? _0x4b7644 : _0x4ec29c;
}
function _toAlignRatio(_0x1b62d3, _0x247867 = 0.5) {
  return Math["max"](0x0, Math['min'](0x1, _toFiniteNumber(_0x1b62d3, _0x247867)));
}
function _isAlignableNode(_0x2d4857) {
  if (!_0x2d4857 || typeof _0x2d4857 !== "object") {
    return ![];
  }
  for (const _0x142ebd of ALIGN_SKIP_KEYS) {
    if (_0x2d4857[_0x142ebd]) {
      return ![];
    }
  }
  return !![];
}
export function getAlignableSelectionNodes(_0x1ac774, _0x50cde9) {
  if (!_0x1ac774 || typeof _0x1ac774 !== "object") {
    return [];
  }
  if (!Array["isArray"](_0x50cde9) || _0x50cde9["length"] === 0x0) {
    return [];
  }
  const _0x181bfd = [];
  for (const _0x166022 of _0x50cde9) {
    const _0x259845 = _0x1ac774[_0x166022];
    if (!_isAlignableNode(_0x259845)) {
      continue;
    }
    const _0x4146f9 = _toFiniteNumber(_0x259845['x'], 0x0);
    const _0x9275f1 = _toFiniteNumber(_0x259845['y'], 0x0);
    const _0x5bedf7 = Math["max"](0x0, _toFiniteNumber(_0x259845["width"], 0x0));
    const _0x4bc5a9 = Math['max'](0x0, _toFiniteNumber(_0x259845['height'], 0x0));
    const _0xc58147 = _0x4146f9;
    const _0x3ead12 = _0x4146f9 + _0x5bedf7;
    const _0x23a5a9 = _0x9275f1;
    const _0x14af17 = _0x9275f1 + _0x4bc5a9;
    _0x181bfd["push"]({
      'id': _0x166022,
      'node': _0x259845,
      'x': _0x4146f9,
      'y': _0x9275f1,
      'width': _0x5bedf7,
      'height': _0x4bc5a9,
      'left': _0xc58147,
      'right': _0x3ead12,
      'top': _0x23a5a9,
      'bottom': _0x14af17,
      'cx': _0xc58147 + _0x5bedf7 / 0x2,
      'cy': _0x23a5a9 + _0x4bc5a9 / 0x2
    });
  }
  return _0x181bfd;
}
export function computeSelectionBounds(_0x3e6b56) {
  if (!Array["isArray"](_0x3e6b56) || _0x3e6b56["length"] === 0x0) {
    return null;
  }
  let _0x383866 = Infinity;
  let _0x934566 = Infinity;
  let _0x43e8b0 = -Infinity;
  let _0x2d6665 = -Infinity;
  for (const _0x2018c4 of _0x3e6b56) {
    _0x383866 = Math["min"](_0x383866, _0x2018c4["left"]);
    _0x934566 = Math['min'](_0x934566, _0x2018c4["top"]);
    _0x43e8b0 = Math["max"](_0x43e8b0, _0x2018c4["right"]);
    _0x2d6665 = Math['max'](_0x2d6665, _0x2018c4["bottom"]);
  }
  if (!Number["isFinite"](_0x383866) || !Number["isFinite"](_0x934566)) {
    return null;
  }
  return {
    'minX': _0x383866,
    'maxX': _0x43e8b0,
    'minY': _0x934566,
    'maxY': _0x2d6665,
    'width': _0x43e8b0 - _0x383866,
    'height': _0x2d6665 - _0x934566,
    'centerX': (_0x383866 + _0x43e8b0) / 0x2,
    'centerY': (_0x934566 + _0x2d6665) / 0x2
  };
}
export function computeNodesWorldBounds(_0x32e1e5, _0x34f2a2 = null) {
  const _0x121554 = [];
  if (Array["isArray"](_0x32e1e5)) {
    _0x121554["push"](..._0x32e1e5['filter'](Boolean));
  } else {
    if (Array['isArray'](_0x34f2a2) && _0x34f2a2["length"] > 0x0) {
      for (const _0x394386 of _0x34f2a2) {
        const _0x46897e = _0x32e1e5?.[_0x394386];
        if (_0x46897e) {
          _0x121554["push"](_0x46897e);
        }
      }
    } else {
      _0x32e1e5 && typeof _0x32e1e5 === "object" && _0x121554["push"](...Object["values"](_0x32e1e5));
    }
  }
  if (_0x121554["length"] === 0x0) {
    return null;
  }
  let _0x5ef788 = Infinity;
  let _0x39c840 = Infinity;
  let _0x2193ae = -Infinity;
  let _0x12cafc = -Infinity;
  for (const _0x587c67 of _0x121554) {
    if (!_0x587c67 || typeof _0x587c67 !== "object") {
      continue;
    }
    const _0x508033 = _toFiniteNumber(_0x587c67['x'], 0x0);
    const _0x3d14d7 = _toFiniteNumber(_0x587c67['y'], 0x0);
    const _0x243355 = Math["max"](0x0, _toFiniteNumber(_0x587c67["width"], 0x0));
    const _0x1196ee = Math["max"](0x0, _toFiniteNumber(_0x587c67["height"], 0x0));
    _0x5ef788 = Math["min"](_0x5ef788, _0x508033);
    _0x39c840 = Math["min"](_0x39c840, _0x3d14d7);
    _0x2193ae = Math["max"](_0x2193ae, _0x508033 + _0x243355);
    _0x12cafc = Math["max"](_0x12cafc, _0x3d14d7 + _0x1196ee);
  }
  if (!Number["isFinite"](_0x5ef788) || !Number['isFinite'](_0x39c840) || !Number['isFinite'](_0x2193ae) || !Number['isFinite'](_0x12cafc)) {
    return null;
  }
  return {
    'minX': _0x5ef788,
    'minY': _0x39c840,
    'maxX': _0x2193ae,
    'maxY': _0x12cafc,
    'width': Math["max"](0x0, _0x2193ae - _0x5ef788),
    'height': Math['max'](0x0, _0x12cafc - _0x39c840),
    'centerX': (_0x5ef788 + _0x2193ae) / 0x2,
    'centerY': (_0x39c840 + _0x12cafc) / 0x2
  };
}
export function computeViewportForWorldBounds(_0x50627b, _0x2259c1, _0x4b648d = {}) {
  if (!_0x50627b || !_0x2259c1) {
    return null;
  }
  const _0x5e6dec = _toFiniteNumber(_0x2259c1['width'], 0x0);
  const _0x157f51 = _toFiniteNumber(_0x2259c1["height"], 0x0);
  if (!(_0x5e6dec > 0x0 && _0x157f51 > 0x0)) {
    return null;
  }
  const _0x316ac1 = Math['max'](0x1, _toFiniteNumber(_0x50627b['width'], 0x0));
  const _0x80c61b = Math['max'](0x1, _toFiniteNumber(_0x50627b['height'], 0x0));
  const _0x1a9e9a = _toFiniteNumber(_0x50627b["centerX"], 0x0);
  const _0x576449 = _toFiniteNumber(_0x50627b['centerY'], 0x0);
  const _0x8a8c20 = Math["max"](0x0, _toFiniteNumber(_0x4b648d["padding"], 0x0));
  const _0x31c00d = Math["max"](0.0001, _toFiniteNumber(_0x4b648d["minZoom"], 0.2));
  const _0x40e8e7 = Math['max'](_0x31c00d, _toFiniteNumber(_0x4b648d["maxZoom"], 0x2));
  const _0xbc2491 = Number(_0x4b648d["fixedZoom"]);
  const _0x351d19 = _toAlignRatio(_0x4b648d['alignX'], 0.5);
  const _0x5a9a94 = _toAlignRatio(_0x4b648d["alignY"], 0.5);
  const _0x3681e5 = _toAlignRatio(_0x4b648d["worldAlignX"], _0x351d19);
  const _0x2d257a = _toAlignRatio(_0x4b648d["worldAlignY"], _0x5a9a94);
  const _0x579185 = _toAlignRatio(_0x4b648d["viewportAlignX"], _0x351d19);
  const _0x5cac14 = _toAlignRatio(_0x4b648d["viewportAlignY"], _0x5a9a94);
  const _0x466b89 = Math["max"](0x1, _0x5e6dec - _0x8a8c20 * 0x2);
  const _0x173a79 = Math["max"](0x1, _0x157f51 - _0x8a8c20 * 0x2);
  const _0x5e3107 = Number["isFinite"](_0xbc2491) ? Math['max'](_0x31c00d, Math["min"](_0xbc2491, _0x40e8e7)) : Math["max"](_0x31c00d, Math["min"](_0x466b89 / _0x316ac1, _0x173a79 / _0x80c61b, _0x40e8e7));
  const _0xf12bbf = _toFiniteNumber(_0x2259c1['left'], 0x0) + _0x5e6dec * _0x579185;
  const _0x2aeef2 = _toFiniteNumber(_0x2259c1["top"], 0x0) + _0x157f51 * _0x5cac14;
  const _0x14f20b = _toFiniteNumber(_0x50627b["minX"], 0x0) + _0x316ac1 * _0x3681e5;
  const _0x186c20 = _toFiniteNumber(_0x50627b["minY"], 0x0) + _0x80c61b * _0x2d257a;
  return {
    'x': _0xf12bbf - _0x14f20b * _0x5e3107,
    'y': _0x2aeef2 - _0x186c20 * _0x5e3107,
    'zoom': _0x5e3107
  };
}
export function computeAlignTargets(_0x178a74, _0x2c0dd0, _0x14dd1c) {
  if (!Array["isArray"](_0x178a74) || _0x178a74["length"] === 0x0 || !_0x14dd1c) {
    return {};
  }
  const _0x54cc9e = {};
  for (const _0x50efb1 of _0x178a74) {
    let _0x700989 = _0x50efb1['x'];
    let _0x475d80 = _0x50efb1['y'];
    if (_0x2c0dd0 === "left") {
      _0x700989 = _0x14dd1c["minX"];
    } else {
      if (_0x2c0dd0 === "h-center") {
        _0x700989 = _0x14dd1c["centerX"] - _0x50efb1["width"] / 0x2;
      } else {
        if (_0x2c0dd0 === "right") {
          _0x700989 = _0x14dd1c['maxX'] - _0x50efb1['width'];
        } else {
          if (_0x2c0dd0 === "top") {
            _0x475d80 = _0x14dd1c["minY"];
          } else {
            if (_0x2c0dd0 === "v-center") {
              _0x475d80 = _0x14dd1c['centerY'] - _0x50efb1["height"] / 0x2;
            } else {
              if (_0x2c0dd0 === "bottom") {
                _0x475d80 = _0x14dd1c["maxY"] - _0x50efb1["height"];
              }
            }
          }
        }
      }
    }
    _0x54cc9e[_0x50efb1['id']] = {
      'x': _0x700989,
      'y': _0x475d80
    };
  }
  return _0x54cc9e;
}
export function computeDistributeTargets(_0x223204, _0x29e8cd, _0x3abe06 = undefined) {
  if (!Array["isArray"](_0x223204) || _0x223204["length"] < 0x2) {
    return {};
  }
  const _0x425da6 = _0x29e8cd === 'horizontal';
  const _0x9a4682 = [..._0x223204]["sort"]((_0x2f271d, _0x2d9700) => {
    const _0x285655 = _0x425da6 ? _0x2f271d["left"] : _0x2f271d["top"];
    const _0x54b9a6 = _0x425da6 ? _0x2d9700["left"] : _0x2d9700["top"];
    if (_0x285655 !== _0x54b9a6) {
      return _0x285655 - _0x54b9a6;
    }
    return String(_0x2f271d['id'])["localeCompare"](String(_0x2d9700['id']));
  });
  const _0x32f303 = {};
  for (const _0xb887cd of _0x9a4682) {
    _0x32f303[_0xb887cd['id']] = {
      'x': _0xb887cd['x'],
      'y': _0xb887cd['y']
    };
  }
  if (_0x9a4682["length"] <= 0x1) {
    return _0x32f303;
  }
  const _0x2e518d = Number(_0x3abe06);
  if (Number["isFinite"](_0x2e518d) && _0x2e518d >= 0x0) {
    let _0x20da7e = _0x425da6 ? _0x9a4682[0x0]["left"] : _0x9a4682[0x0]["top"];
    for (let _0x148434 = 0x0; _0x148434 < _0x9a4682["length"]; _0x148434 += 0x1) {
      const _0x3153e2 = _0x9a4682[_0x148434];
      if (_0x148434 === 0x0) {
        _0x20da7e += (_0x425da6 ? _0x3153e2["width"] : _0x3153e2["height"]) + _0x2e518d;
        continue;
      }
      _0x425da6 ? (_0x32f303[_0x3153e2['id']] = {
        'x': _0x20da7e,
        'y': _0x3153e2['y']
      }, _0x20da7e += _0x3153e2["width"] + _0x2e518d) : (_0x32f303[_0x3153e2['id']] = {
        'x': _0x3153e2['x'],
        'y': _0x20da7e
      }, _0x20da7e += _0x3153e2["height"] + _0x2e518d);
    }
    return _0x32f303;
  }
  if (_0x9a4682["length"] <= 0x2) {
    return _0x32f303;
  }
  const _0x595a65 = _0x9a4682[0x0];
  const _0x11ee94 = _0x9a4682[_0x9a4682["length"] - 0x1];
  const _0x5c6ede = _0x9a4682["reduce"]((_0x5443d1, _0x1347f5) => _0x5443d1 + (_0x425da6 ? _0x1347f5['width'] : _0x1347f5['height']), 0x0);
  const _0x197c6d = _0x425da6 ? Math["max"](0x0, _0x11ee94["right"] - _0x595a65['left']) : Math['max'](0x0, _0x11ee94["bottom"] - _0x595a65['top']);
  const _0x1332b6 = (_0x197c6d - _0x5c6ede) / (_0x9a4682["length"] - 0x1);
  let _0x123d07 = _0x425da6 ? _0x595a65["left"] : _0x595a65['top'];
  for (let _0x5ecc55 = 0x0; _0x5ecc55 < _0x9a4682['length']; _0x5ecc55 += 0x1) {
    const _0xad0149 = _0x9a4682[_0x5ecc55];
    if (_0x5ecc55 === 0x0 || _0x5ecc55 === _0x9a4682['length'] - 0x1) {
      _0x123d07 += (_0x425da6 ? _0xad0149["width"] : _0xad0149["height"]) + _0x1332b6;
      continue;
    }
    _0x425da6 ? (_0x32f303[_0xad0149['id']] = {
      'x': _0x123d07,
      'y': _0xad0149['y']
    }, _0x123d07 += _0xad0149['width'] + _0x1332b6) : (_0x32f303[_0xad0149['id']] = {
      'x': _0xad0149['x'],
      'y': _0x123d07
    }, _0x123d07 += _0xad0149["height"] + _0x1332b6);
  }
  return _0x32f303;
}
function _sortLayoutItems(_0x31ea21) {
  return [...(Array["isArray"](_0x31ea21) ? _0x31ea21 : [])]["sort"]((_0x28f005, _0x224446) => {
    const _0x3b7c79 = _toFiniteNumber(_0x28f005?.["top"] ?? _0x28f005?.['y'], 0x0);
    const _0x21fbd5 = _toFiniteNumber(_0x224446?.["top"] ?? _0x224446?.['y'], 0x0);
    if (_0x3b7c79 !== _0x21fbd5) {
      return _0x3b7c79 - _0x21fbd5;
    }
    const _0x32d286 = _toFiniteNumber(_0x28f005?.["left"] ?? _0x28f005?.['x'], 0x0);
    const _0x5f1fd0 = _toFiniteNumber(_0x224446?.["left"] ?? _0x224446?.['x'], 0x0);
    if (_0x32d286 !== _0x5f1fd0) {
      return _0x32d286 - _0x5f1fd0;
    }
    return String(_0x28f005?.['id'] || '')['localeCompare'](String(_0x224446?.['id'] || ''));
  });
}
function _medianLayoutMetric(_0xed3dd0, _0x3b1c47, _0x268356 = 0x1) {
  const _0xe08c4a = (Array["isArray"](_0xed3dd0) ? _0xed3dd0 : [])["map"](_0xe6765e => Math["max"](0x0, _toFiniteNumber(_0xe6765e?.[_0x3b1c47], 0x0)))['filter'](_0x36b80e => _0x36b80e > 0x0)["sort"]((_0x518d22, _0x387849) => _0x518d22 - _0x387849);
  if (_0xe08c4a["length"] === 0x0) {
    return _0x268356;
  }
  const _0x3c9045 = Math["floor"](_0xe08c4a["length"] / 0x2);
  if (_0xe08c4a['length'] % 0x2 === 0x1) {
    return _0xe08c4a[_0x3c9045];
  }
  return (_0xe08c4a[_0x3c9045 - 0x1] + _0xe08c4a[_0x3c9045]) / 0x2;
}
function _sortGridLayoutItems(_0x563577) {
  const _0x19bd2e = _sortLayoutItems(_0x563577);
  if (_0x19bd2e["length"] <= 0x1) {
    return _0x19bd2e;
  }
  const _0x3d6065 = Math["max"](0x8, _medianLayoutMetric(_0x19bd2e, "height", 0x28) * 0.35);
  const _0x26963c = [];
  for (const _0xd27c84 of _0x19bd2e) {
    const _0xbddbb3 = _toFiniteNumber(_0xd27c84?.['top'] ?? _0xd27c84?.['y'], 0x0);
    const _0x92331b = Math["max"](0x0, _toFiniteNumber(_0xd27c84?.["height"], 0x0));
    const _0x2e52d7 = _toFiniteNumber(_0xd27c84?.["bottom"], _0xbddbb3 + _0x92331b);
    const _0x43052e = _toFiniteNumber(_0xd27c84?.['cy'], _0xbddbb3 + _0x92331b / 0x2);
    let _0x5c9dfe = null;
    let _0x1b744e = Infinity;
    for (const _0x1edeae of _0x26963c) {
      const _0x1a3c8d = Math["min"](_0x1edeae["bottom"], _0x2e52d7) - Math["max"](_0x1edeae['top'], _0xbddbb3);
      const _0x4c3d69 = Math['max'](0x1, Math['min'](_0x1edeae["bottom"] - _0x1edeae['top'], _0x92331b || 0x1));
      const _0x5b1b57 = Math["abs"](_0x43052e - _0x1edeae['centerY']);
      const _0x1c6337 = _0x1a3c8d >= _0x4c3d69 * 0.25 || _0x5b1b57 <= _0x3d6065;
      _0x1c6337 && _0x5b1b57 < _0x1b744e && (_0x5c9dfe = _0x1edeae, _0x1b744e = _0x5b1b57);
    }
    if (!_0x5c9dfe) {
      _0x26963c["push"]({
        'top': _0xbddbb3,
        'bottom': _0x2e52d7,
        'centerY': _0x43052e,
        'centerSum': _0x43052e,
        'items': [_0xd27c84]
      });
      continue;
    }
    _0x5c9dfe['items']["push"](_0xd27c84);
    _0x5c9dfe["top"] = Math["min"](_0x5c9dfe["top"], _0xbddbb3);
    _0x5c9dfe["bottom"] = Math["max"](_0x5c9dfe['bottom'], _0x2e52d7);
    _0x5c9dfe["centerSum"] += _0x43052e;
    _0x5c9dfe['centerY'] = _0x5c9dfe['centerSum'] / _0x5c9dfe["items"]['length'];
  }
  _0x26963c["sort"]((_0x51fd40, _0x2bc768) => _0x51fd40["top"] - _0x2bc768['top']);
  return _0x26963c["flatMap"](_0x4012ce => _0x4012ce["items"]["sort"]((_0x2eadaf, _0x4236d9) => {
    const _0xafbcd7 = _toFiniteNumber(_0x2eadaf?.["left"] ?? _0x2eadaf?.['x'], 0x0);
    const _0x2cfa8d = _toFiniteNumber(_0x4236d9?.['left'] ?? _0x4236d9?.['x'], 0x0);
    if (_0xafbcd7 !== _0x2cfa8d) {
      return _0xafbcd7 - _0x2cfa8d;
    }
    return String(_0x2eadaf?.['id'] || '')["localeCompare"](String(_0x4236d9?.['id'] || ''));
  }));
}
function _resolveGridRelationLayout(_0x719039, _0x7a8ee9) {
  const _0x118eb3 = _sortGridLayoutItems(_0x719039);
  const _0x16f65e = new Set(_0x118eb3["map"](_0x319207 => String(_0x319207?.['id'] || '')['trim']())['filter'](Boolean));
  const _0x1ec530 = [];
  const _0x3599b9 = new Set();
  for (const _0x3174d0 of Array["isArray"](_0x7a8ee9) ? _0x7a8ee9 : []) {
    const _0x49d5c5 = String(_0x3174d0?.["sourceId"] || '')["trim"]();
    const _0x50ce6e = String(_0x3174d0?.['targetId'] || '')["trim"]();
    if (!_0x49d5c5 || !_0x50ce6e || _0x49d5c5 === _0x50ce6e || !_0x16f65e["has"](_0x49d5c5) || !_0x16f65e["has"](_0x50ce6e)) {
      continue;
    }
    const _0x2e5af9 = _0x49d5c5 + '\x00' + _0x50ce6e;
    if (_0x3599b9["has"](_0x2e5af9)) {
      continue;
    }
    _0x3599b9["add"](_0x2e5af9);
    _0x1ec530["push"]({
      'sourceId': _0x49d5c5,
      'targetId': _0x50ce6e
    });
  }
  if (_0x1ec530["length"] === 0x0) {
    return null;
  }
  const _0x11305f = new Map(_0x118eb3["map"]((_0x4daabe, _0x5d74c4) => [String(_0x4daabe['id']), _0x5d74c4]));
  const _0x5b4e99 = new Set();
  const _0x2183f3 = new Map();
  const _0x3a4a44 = new Map();
  const _0x1c12f1 = new Map();
  for (const {
    sourceId: _0x58add2,
    targetId: _0x57a6eb
  } of _0x1ec530) {
    _0x5b4e99["add"](_0x58add2);
    _0x5b4e99["add"](_0x57a6eb);
    if (!_0x2183f3["has"](_0x58add2)) {
      _0x2183f3["set"](_0x58add2, []);
    }
    _0x2183f3["get"](_0x58add2)['push'](_0x57a6eb);
    _0x3a4a44["set"](_0x57a6eb, (_0x3a4a44["get"](_0x57a6eb) || 0x0) + 0x1);
    if (!_0x3a4a44['has'](_0x58add2)) {
      _0x3a4a44["set"](_0x58add2, 0x0);
    }
    if (!_0x1c12f1["has"](_0x58add2)) {
      _0x1c12f1['set'](_0x58add2, 0x0);
    }
    if (!_0x1c12f1["has"](_0x57a6eb)) {
      _0x1c12f1['set'](_0x57a6eb, 0x0);
    }
  }
  const _0x13898b = (_0x56ca80, _0x4a5a59) => (_0x11305f['get'](_0x56ca80) ?? Number["MAX_SAFE_INTEGER"]) - (_0x11305f["get"](_0x4a5a59) ?? Number['MAX_SAFE_INTEGER']) || _0x56ca80['localeCompare'](_0x4a5a59);
  let _0x1805df = [..._0x5b4e99]["filter"](_0x16cf20 => (_0x3a4a44["get"](_0x16cf20) || 0x0) === 0x0)["sort"](_0x13898b);
  const _0x25c4e8 = new Set();
  while (_0x1805df["length"] > 0x0) {
    const _0x412828 = _0x1805df;
    _0x1805df = [];
    for (const _0x3acd96 of _0x412828) {
      _0x25c4e8['add'](_0x3acd96);
      const _0x32aa55 = _0x1c12f1['get'](_0x3acd96) || 0x0;
      for (const _0x52fb9c of _0x2183f3["get"](_0x3acd96) || []) {
        _0x1c12f1["set"](_0x52fb9c, Math["max"](_0x1c12f1['get'](_0x52fb9c) || 0x0, _0x32aa55 + 0x1));
        const _0xc0570c = (_0x3a4a44["get"](_0x52fb9c) || 0x0) - 0x1;
        _0x3a4a44["set"](_0x52fb9c, _0xc0570c);
        if (_0xc0570c === 0x0) {
          _0x1805df["push"](_0x52fb9c);
        }
      }
    }
    _0x1805df["sort"](_0x13898b);
  }
  const _0xddf841 = [..._0x5b4e99]['filter'](_0x31bb9d => !_0x25c4e8["has"](_0x31bb9d));
  if (_0xddf841["length"] > 0x0) {
    const _0x3f0c59 = _0xddf841["reduce"]((_0x1def06, _0xb8bd69) => Math["max"](_0x1def06, _0x1c12f1["get"](_0xb8bd69) || 0x0), 0x0);
    for (const _0x263e1d of _0xddf841) {
      _0x1c12f1["set"](_0x263e1d, _0x3f0c59);
    }
  }
  const _0x4ada4a = [..._0x5b4e99]["reduce"]((_0x313386, _0x34c048) => Math['max'](_0x313386, (_0x1c12f1["get"](_0x34c048) || 0x0) + 0x1), 0x1);
  return {
    'connectedIds': _0x5b4e99,
    'layerById': _0x1c12f1,
    'layerCount': _0x4ada4a,
    'relations': _0x1ec530
  };
}
function _buildGraphAwareGridPlacements(_0x133883, _0x378cdf, _0x44fd4a) {
  const _0x1d1b09 = Array['from']({
    'length': _0x378cdf
  }, () => []);
  const _0x21ac1b = new Map();
  _0x133883["forEach"]((_0x3519da, _0x3d9ed5) => {
    const _0x3000a0 = String(_0x3519da['id']);
    let _0x5061eb = _0x44fd4a["connectedIds"]["has"](_0x3000a0) ? Math["min"](_0x378cdf - 0x1, _0x44fd4a["layerById"]['get'](_0x3000a0) || 0x0) : _0x3d9ed5 % _0x378cdf;
    if (!_0x44fd4a["connectedIds"]['has'](_0x3000a0)) {
      const _0x527836 = Math["min"](..._0x1d1b09["map"](_0x3f645e => _0x3f645e['length']));
      for (let _0x34b0a6 = 0x0; _0x34b0a6 < _0x378cdf; _0x34b0a6 += 0x1) {
        const _0x396c4d = (_0x5061eb + _0x34b0a6) % _0x378cdf;
        if (_0x1d1b09[_0x396c4d]["length"] === _0x527836) {
          _0x5061eb = _0x396c4d;
          break;
        }
      }
    }
    _0x1d1b09[_0x5061eb]["push"](_0x3519da);
    _0x21ac1b["set"](_0x3000a0, _0x5061eb);
  });
  const _0x4e4661 = new Map(_0x133883["map"](_0x901e2b => [String(_0x901e2b['id']), _0x901e2b]));
  const _0xd0d92c = new Map(_0x133883['map']((_0x39cf73, _0x3756a3) => [String(_0x39cf73['id']), _0x3756a3]));
  const _0x43a177 = new Map();
  for (const {
    sourceId: _0x5aabde,
    targetId: _0x227184
  } of _0x44fd4a['relations']) {
    if (_0x21ac1b["get"](_0x5aabde) === _0x21ac1b["get"](_0x227184)) {
      continue;
    }
    !_0x43a177["has"](_0x5aabde) && _0x43a177["set"](_0x5aabde, []);
    !_0x43a177['has'](_0x227184) && _0x43a177["set"](_0x227184, []);
    _0x43a177["get"](_0x5aabde)['push'](_0x227184);
    _0x43a177["get"](_0x227184)['push'](_0x5aabde);
  }
  const _0x281178 = new Map();
  const _0x1331fe = _0x2b1274 => {
    _0x1d1b09[_0x2b1274]["forEach"]((_0x37fb44, _0x5b53b6) => {
      _0x281178["set"](String(_0x37fb44['id']), _0x5b53b6);
    });
  };
  _0x1d1b09['forEach']((_0x2bd394, _0x3b34a0) => _0x1331fe(_0x3b34a0));
  const _0x38a634 = (_0x58879a, _0x4b82c9, _0x2a182d) => {
    const _0x283666 = (_0x43a177["get"](_0x58879a) || [])["filter"](_0x57df5b => {
      const _0x44a4bb = _0x21ac1b["get"](_0x57df5b);
      return _0x2a182d > 0x0 ? _0x44a4bb < _0x4b82c9 : _0x44a4bb > _0x4b82c9;
    })['map'](_0x2364f7 => _0x281178['get'](_0x2364f7))["filter"](Number["isFinite"])['sort']((_0x5a49a9, _0x568d5b) => _0x5a49a9 - _0x568d5b);
    if (_0x283666["length"] === 0x0) {
      return null;
    }
    const _0x191504 = Math['floor'](_0x283666["length"] / 0x2);
    return _0x283666['length'] % 0x2 === 0x1 ? _0x283666[_0x191504] : (_0x283666[_0x191504 - 0x1] + _0x283666[_0x191504]) / 0x2;
  };
  const _0x236eef = _0xee37b6 => {
    const _0x38249f = _0xee37b6 > 0x0 ? 0x1 : _0x378cdf - 0x2;
    const _0x517722 = _0xee37b6 > 0x0 ? _0x378cdf : -0x1;
    for (let _0x212e61 = _0x38249f; _0x212e61 !== _0x517722; _0x212e61 += _0xee37b6) {
      const _0x40a00d = new Map(_0x1d1b09[_0x212e61]["map"]((_0x5a13cc, _0x5aaec5) => [String(_0x5a13cc['id']), _0x5aaec5]));
      const _0x1257bc = new Map(_0x1d1b09[_0x212e61]["map"](_0x1c70de => {
        const _0x42b22a = String(_0x1c70de['id']);
        return [_0x42b22a, _0x38a634(_0x42b22a, _0x212e61, _0xee37b6)];
      }));
      _0x1d1b09[_0x212e61]["sort"]((_0xcdc58f, _0x269e9f) => {
        const _0x4282ad = String(_0xcdc58f['id']);
        const _0x2ca6b9 = String(_0x269e9f['id']);
        const _0x3efa99 = _0x1257bc["get"](_0x4282ad);
        const _0x48a33f = _0x1257bc["get"](_0x2ca6b9);
        const _0x794882 = _0x3efa99 ?? _0x40a00d['get'](_0x4282ad) ?? 0x0;
        const _0x560a8a = _0x48a33f ?? _0x40a00d["get"](_0x2ca6b9) ?? 0x0;
        if (_0x794882 !== _0x560a8a) {
          return _0x794882 - _0x560a8a;
        }
        return (_0x40a00d['get'](_0x4282ad) ?? 0x0) - (_0x40a00d["get"](_0x2ca6b9) ?? 0x0) || (_0xd0d92c["get"](_0x4282ad) ?? Number["MAX_SAFE_INTEGER"]) - (_0xd0d92c["get"](_0x2ca6b9) ?? Number['MAX_SAFE_INTEGER']) || _0x4282ad["localeCompare"](_0x2ca6b9);
      });
      _0x1331fe(_0x212e61);
    }
  };
  for (let _0x19b215 = 0x0; _0x19b215 < 0x2; _0x19b215 += 0x1) {
    _0x236eef(0x1);
    _0x236eef(-0x1);
  }
  const _0x1200a3 = _0x44fd4a["relations"]["filter"](({
    sourceId: _0x4da14c,
    targetId: _0xd26c37
  }) => _0x21ac1b["get"](_0x4da14c) !== _0x21ac1b["get"](_0xd26c37));
  const _0x456254 = new Map();
  const _0x1d5721 = new Map();
  for (const {
    sourceId: _0x570fdc,
    targetId: _0x2b1a42
  } of _0x1200a3) {
    _0x456254["set"](_0x570fdc, (_0x456254["get"](_0x570fdc) || 0x0) + 0x1);
    _0x1d5721["set"](_0x2b1a42, (_0x1d5721["get"](_0x2b1a42) || 0x0) + 0x1);
  }
  const _0x4fcb3f = new Map(_0x133883["map"](_0x301d44 => [String(_0x301d44['id']), String(_0x301d44['id'])]));
  const _0x45126b = new Map(_0x133883["map"](_0x59a583 => {
    const _0x224b28 = String(_0x59a583['id']);
    return [_0x224b28, new Set([_0x21ac1b['get'](_0x224b28)])];
  }));
  const _0x13261f = _0x7835a2 => {
    let _0x2bca1b = _0x7835a2;
    while (_0x4fcb3f['get'](_0x2bca1b) !== _0x2bca1b) {
      _0x2bca1b = _0x4fcb3f["get"](_0x2bca1b);
    }
    let _0xa10c3e = _0x7835a2;
    while (_0x4fcb3f["get"](_0xa10c3e) !== _0x2bca1b) {
      const _0x171d5a = _0x4fcb3f["get"](_0xa10c3e);
      _0x4fcb3f["set"](_0xa10c3e, _0x2bca1b);
      _0xa10c3e = _0x171d5a;
    }
    return _0x2bca1b;
  };
  const _0x4455cb = (_0x35ce03, _0x5a7861) => {
    const _0xed8896 = _0x13261f(_0x35ce03);
    const _0x1b34c6 = _0x13261f(_0x5a7861);
    if (_0xed8896 === _0x1b34c6) {
      return !![];
    }
    const _0x136dd0 = _0x45126b["get"](_0xed8896) || new Set();
    const _0x3bd326 = _0x45126b["get"](_0x1b34c6) || new Set();
    if ([..._0x136dd0]['some'](_0x146b55 => _0x3bd326['has'](_0x146b55))) {
      return ![];
    }
    const _0x10c32c = (_0xd0d92c["get"](_0xed8896) ?? Number["MAX_SAFE_INTEGER"]) <= (_0xd0d92c["get"](_0x1b34c6) ?? Number['MAX_SAFE_INTEGER']);
    const _0x147323 = _0x10c32c ? _0xed8896 : _0x1b34c6;
    const _0x31c8a1 = _0x10c32c ? _0x1b34c6 : _0xed8896;
    _0x4fcb3f["set"](_0x31c8a1, _0x147323);
    _0x45126b['set'](_0x147323, new Set([..._0x136dd0, ..._0x3bd326]));
    _0x45126b["delete"](_0x31c8a1);
    return !![];
  };
  _0x1200a3["sort"]((_0x28845f, _0x30ee04) => {
    const _0x38dbf0 = _0x456254['get'](_0x28845f["sourceId"]) === 0x1 && _0x1d5721["get"](_0x28845f["targetId"]) === 0x1;
    const _0x174d7b = _0x456254['get'](_0x30ee04["sourceId"]) === 0x1 && _0x1d5721["get"](_0x30ee04["targetId"]) === 0x1;
    if (_0x38dbf0 !== _0x174d7b) {
      return _0x38dbf0 ? -0x1 : 0x1;
    }
    const _0x3a58d4 = _0x456254["get"](_0x28845f["sourceId"]) === 0x1 || _0x1d5721["get"](_0x28845f['targetId']) === 0x1;
    const _0x3c6914 = _0x456254["get"](_0x30ee04["sourceId"]) === 0x1 || _0x1d5721["get"](_0x30ee04["targetId"]) === 0x1;
    if (_0x3a58d4 !== _0x3c6914) {
      return _0x3a58d4 ? -0x1 : 0x1;
    }
    const _0x46c4d3 = Math["abs"](_0x21ac1b["get"](_0x28845f["sourceId"]) - _0x21ac1b["get"](_0x28845f["targetId"]));
    const _0x174ae6 = Math["abs"](_0x21ac1b['get'](_0x30ee04['sourceId']) - _0x21ac1b["get"](_0x30ee04["targetId"]));
    if (_0x46c4d3 !== _0x174ae6) {
      return _0x46c4d3 - _0x174ae6;
    }
    const _0x2ceae7 = Math["abs"]((_0x281178["get"](_0x28845f["sourceId"]) || 0x0) - (_0x281178["get"](_0x28845f["targetId"]) || 0x0));
    const _0x3760aa = Math["abs"]((_0x281178["get"](_0x30ee04['sourceId']) || 0x0) - (_0x281178['get'](_0x30ee04['targetId']) || 0x0));
    if (_0x2ceae7 !== _0x3760aa) {
      return _0x2ceae7 - _0x3760aa;
    }
    const _0x3c9725 = _0x4e4661["get"](_0x28845f["sourceId"]);
    const _0x534ca4 = _0x4e4661['get'](_0x28845f["targetId"]);
    const _0x1431b4 = _0x4e4661["get"](_0x30ee04["sourceId"]);
    const _0x475ff6 = _0x4e4661['get'](_0x30ee04["targetId"]);
    const _0xc32256 = Math["abs"]((_0x3c9725?.['cy'] || 0x0) - (_0x534ca4?.['cy'] || 0x0));
    const _0x5b4d5e = Math["abs"]((_0x1431b4?.['cy'] || 0x0) - (_0x475ff6?.['cy'] || 0x0));
    if (_0xc32256 !== _0x5b4d5e) {
      return _0xc32256 - _0x5b4d5e;
    }
    const _0x4643e7 = (_0xd0d92c["get"](_0x28845f["sourceId"]) || 0x0) - (_0xd0d92c["get"](_0x30ee04["sourceId"]) || 0x0);
    if (_0x4643e7 !== 0x0) {
      return _0x4643e7;
    }
    return (_0xd0d92c['get'](_0x28845f["targetId"]) || 0x0) - (_0xd0d92c["get"](_0x30ee04['targetId']) || 0x0);
  })["forEach"](({
    sourceId: _0x4e204f,
    targetId: _0x3e1d89
  }) => _0x4455cb(_0x4e204f, _0x3e1d89));
  const _0x10eacb = new Map();
  _0x133883["forEach"]((_0x2874a7, _0x220925) => {
    const _0x323640 = String(_0x2874a7['id']);
    const _0x151e47 = _0x13261f(_0x323640);
    !_0x10eacb["has"](_0x151e47) && _0x10eacb["set"](_0x151e47, {
      'firstIndex': _0x220925,
      'items': []
    });
    const _0x2151e5 = _0x10eacb["get"](_0x151e47);
    _0x2151e5["firstIndex"] = Math["min"](_0x2151e5["firstIndex"], _0x220925);
    _0x2151e5["items"]["push"](_0x2874a7);
  });
  const _0x1e5c1e = [..._0x10eacb["values"]()]["sort"]((_0x764e52, _0xb8eeea) => _0x764e52["firstIndex"] - _0xb8eeea["firstIndex"]);
  return {
    'placements': _0x1e5c1e["flatMap"]((_0x372cbc, _0x5ebff5) => _0x372cbc['items']["map"](_0x378179 => ({
      'item': _0x378179,
      'col': _0x21ac1b["get"](String(_0x378179['id'])),
      'row': _0x5ebff5
    }))),
    'rowCount': _0x1e5c1e["length"]
  };
}
export function resolveArrangeGridColumns(_0x523afb, _0x3fb6da = {}) {
  const _0x47d9b6 = Array['isArray'](_0x523afb) ? _0x523afb['filter'](Boolean) : [];
  if (_0x47d9b6['length'] <= 0x1) {
    return Math['max'](0x1, _0x47d9b6["length"]);
  }
  const _0x3e02c7 = Number(_0x3fb6da["columns"]);
  if (Number["isFinite"](_0x3e02c7) && _0x3e02c7 > 0x0) {
    return Math["max"](0x1, Math["trunc"](_0x3e02c7));
  }
  const _0x380f5d = computeSelectionBounds(_0x47d9b6);
  const _0xf8c289 = Math['max'](0x0, _toFiniteNumber(_0x3fb6da['gapX'] ?? _0x3fb6da['gap'], 0x28));
  const _0x54e0b4 = Math["max"](0x0, _toFiniteNumber(_0x3fb6da["gapY"] ?? _0x3fb6da['gap'], 0x28));
  const _0x4937b9 = _medianLayoutMetric(_0x47d9b6, "width", 0x1);
  const _0x186f39 = _medianLayoutMetric(_0x47d9b6, "height", 0x1);
  const _0x17f92b = Number(_0x3fb6da['targetAspect']);
  const _0x44c621 = _0x380f5d && _0x380f5d["height"] > 0x0 ? _0x380f5d["width"] / _0x380f5d["height"] : 0x1;
  const _0x5ebfde = Math["max"](0.75, Math["min"](0x10 / 0x9, Number["isFinite"](_0x17f92b) && _0x17f92b > 0x0 ? _0x17f92b : _0x44c621));
  const _0x4bf5f5 = Number(_0x3fb6da["maxColumns"]);
  const _0x574c66 = Math["min"](_0x47d9b6["length"], Number["isFinite"](_0x4bf5f5) && _0x4bf5f5 > 0x0 ? Math['max'](0x2, Math["trunc"](_0x4bf5f5)) : 0x6);
  let _0x201c24 = 0x2;
  let _0x44f1e8 = Infinity;
  for (let _0x160d0b = 0x2; _0x160d0b <= _0x574c66; _0x160d0b += 0x1) {
    const _0x4ceb64 = Math["ceil"](_0x47d9b6["length"] / _0x160d0b);
    const _0x40ea08 = _0x160d0b * _0x4937b9 + (_0x160d0b - 0x1) * _0xf8c289;
    const _0x5687ce = _0x4ceb64 * _0x186f39 + (_0x4ceb64 - 0x1) * _0x54e0b4;
    const _0x142720 = _0x40ea08 / Math["max"](0x1, _0x5687ce);
    const _0xabfc80 = Math["abs"](Math["log"](_0x142720 / _0x5ebfde));
    const _0x1af18b = (_0x160d0b * _0x4ceb64 - _0x47d9b6['length']) / _0x47d9b6["length"];
    const _0x294df3 = _0xabfc80 + _0x1af18b * 0.9;
    _0x294df3 < _0x44f1e8 - 1e-9 && (_0x44f1e8 = _0x294df3, _0x201c24 = _0x160d0b);
  }
  const _0x11516d = _resolveGridRelationLayout(_0x47d9b6, _0x3fb6da["relations"]);
  _0x11516d && (_0x201c24 = Math['max'](_0x201c24, Math['min'](_0x574c66, _0x11516d["layerCount"])));
  return _0x201c24;
}
export function computeArrangeRowTargets(_0x28d2ce, _0x3b3b43 = {}) {
  const _0x3dbc4a = _sortLayoutItems(_0x28d2ce);
  if (_0x3dbc4a["length"] === 0x0) {
    return {};
  }
  const _0x3252fa = computeSelectionBounds(_0x3dbc4a);
  if (!_0x3252fa) {
    return {};
  }
  const _0x2bf5a1 = Math['max'](0x0, _toFiniteNumber(_0x3b3b43["gap"], 0x28));
  const _0x36ba79 = String(_0x3b3b43["align"] || "top");
  let _0x47577c = _0x3252fa["minX"];
  const _0x44ae14 = {};
  for (const _0x1c2fbd of _0x3dbc4a) {
    let _0x11636e = _0x3252fa["minY"];
    if (_0x36ba79 === "center" || _0x36ba79 === 'middle') {
      _0x11636e = _0x3252fa["centerY"] - _0x1c2fbd['height'] / 0x2;
    } else {
      _0x36ba79 === "bottom" && (_0x11636e = _0x3252fa["maxY"] - _0x1c2fbd['height']);
    }
    _0x44ae14[_0x1c2fbd['id']] = {
      'x': _0x47577c,
      'y': _0x11636e
    };
    _0x47577c += _0x1c2fbd["width"] + _0x2bf5a1;
  }
  return _0x44ae14;
}
export function computeArrangeColumnTargets(_0x47500b, _0x17998a = {}) {
  const _0x3d1045 = _sortLayoutItems(_0x47500b);
  if (_0x3d1045["length"] === 0x0) {
    return {};
  }
  const _0xa2475c = computeSelectionBounds(_0x3d1045);
  if (!_0xa2475c) {
    return {};
  }
  const _0x102874 = Math['max'](0x0, _toFiniteNumber(_0x17998a["gap"], 0x28));
  const _0x109115 = String(_0x17998a['align'] || "left");
  let _0x3adbf1 = _0xa2475c["minY"];
  const _0x607d0 = {};
  for (const _0x339320 of _0x3d1045) {
    let _0x5d5898 = _0xa2475c["minX"];
    if (_0x109115 === "center" || _0x109115 === "middle") {
      _0x5d5898 = _0xa2475c['centerX'] - _0x339320['width'] / 0x2;
    } else {
      _0x109115 === "right" && (_0x5d5898 = _0xa2475c['maxX'] - _0x339320["width"]);
    }
    _0x607d0[_0x339320['id']] = {
      'x': _0x5d5898,
      'y': _0x3adbf1
    };
    _0x3adbf1 += _0x339320["height"] + _0x102874;
  }
  return _0x607d0;
}
export function computeArrangeGridTargets(_0x5b2071, _0x496176 = {}) {
  const _0x3d8444 = _sortGridLayoutItems(_0x5b2071);
  if (_0x3d8444["length"] === 0x0) {
    return {};
  }
  const _0x4cd9bd = computeSelectionBounds(_0x3d8444);
  if (!_0x4cd9bd) {
    return {};
  }
  const _0x38651f = Math["max"](0x0, _toFiniteNumber(_0x496176['gapX'] ?? _0x496176["gap"], 0x28));
  const _0x5f2053 = Math["max"](0x0, _toFiniteNumber(_0x496176['gapY'] ?? _0x496176['gap'], 0x28));
  const _0x31fbe4 = resolveArrangeGridColumns(_0x3d8444, {
    ..._0x496176,
    'gapX': _0x38651f,
    'gapY': _0x5f2053
  });
  const _0x2df16b = _resolveGridRelationLayout(_0x3d8444, _0x496176["relations"]);
  let _0x513773;
  let _0x49e350;
  if (_0x2df16b) {
    ({
      placements: _0x513773,
      rowCount: _0x49e350
    } = _buildGraphAwareGridPlacements(_0x3d8444, _0x31fbe4, _0x2df16b));
  } else {
    const _0x1f6195 = Array['from']({
      'length': _0x31fbe4
    }, () => []);
    _0x3d8444["forEach"]((_0x29783b, _0x2e096c) => {
      _0x1f6195[_0x2e096c % _0x31fbe4]["push"](_0x29783b);
    });
    _0x513773 = _0x1f6195['flatMap']((_0xac164f, _0x56c8de) => _0xac164f["map"]((_0x4f1658, _0x56805d) => ({
      'item': _0x4f1658,
      'col': _0x56c8de,
      'row': _0x56805d
    })));
    _0x49e350 = Math["max"](..._0x1f6195["map"](_0x2cf358 => _0x2cf358["length"]));
  }
  const _0x38ea23 = Array(_0x31fbe4)["fill"](0x0);
  const _0xf7a347 = Array(_0x49e350)["fill"](0x0);
  _0x513773["forEach"](({
    item: _0x2f667f,
    col: _0x325086,
    row: _0x22247e
  }) => {
    _0x38ea23[_0x325086] = Math["max"](_0x38ea23[_0x325086], _0x2f667f["width"]);
    _0xf7a347[_0x22247e] = Math["max"](_0xf7a347[_0x22247e], _0x2f667f["height"]);
  });
  const _0x1247c4 = [];
  const _0x1bbf4e = [];
  let _0xdfa8c0 = 0x0;
  let _0x2e38d1 = 0x0;
  for (const _0x5ae726 of _0x38ea23) {
    _0x1247c4["push"](_0xdfa8c0);
    _0xdfa8c0 += _0x5ae726 + _0x38651f;
  }
  for (const _0x43f64a of _0xf7a347) {
    _0x1bbf4e["push"](_0x2e38d1);
    _0x2e38d1 += _0x43f64a + _0x5f2053;
  }
  const _0x68292c = {};
  _0x513773["forEach"](({
    item: _0x55a677,
    col: _0x2c933c,
    row: _0x2621ff
  }) => {
    const _0x4637e8 = _0x2df16b ? _0x38ea23[_0x2c933c] - _0x55a677["width"] : 0x0;
    const _0x31603f = _0x2df16b ? (_0xf7a347[_0x2621ff] - _0x55a677["height"]) / 0x2 : 0x0;
    _0x68292c[_0x55a677['id']] = {
      'x': _0x4cd9bd["minX"] + _0x1247c4[_0x2c933c] + _0x4637e8,
      'y': _0x4cd9bd["minY"] + _0x1bbf4e[_0x2621ff] + _0x31603f
    };
  });
  return _0x68292c;
}
export function computeMoveNearNodeTargets(_0x4cc16b, _0x3eb7fa, _0x2421be = {}) {
  const _0x5dac57 = Array["isArray"](_0x4cc16b) ? _0x4cc16b["filter"](Boolean) : [];
  if (_0x5dac57["length"] === 0x0 || !_0x3eb7fa) {
    return {};
  }
  const _0x4a62b5 = computeSelectionBounds(_0x5dac57);
  if (!_0x4a62b5) {
    return {};
  }
  const _0x15f86e = Math["max"](0x0, _toFiniteNumber(_0x2421be["gap"], 0x28));
  const _0x197fca = String(_0x2421be["placement"] || "right");
  let _0x36f57c = _0x4a62b5["minX"];
  let _0x22c23a = _0x4a62b5["minY"];
  if (_0x197fca === "left") {
    _0x36f57c = _0x3eb7fa['left'] - _0x15f86e - _0x4a62b5["width"];
    _0x22c23a = _0x3eb7fa['cy'] - _0x4a62b5["height"] / 0x2;
  } else {
    if (_0x197fca === "top") {
      _0x36f57c = _0x3eb7fa['cx'] - _0x4a62b5["width"] / 0x2;
      _0x22c23a = _0x3eb7fa["top"] - _0x15f86e - _0x4a62b5["height"];
    } else {
      _0x197fca === "bottom" ? (_0x36f57c = _0x3eb7fa['cx'] - _0x4a62b5["width"] / 0x2, _0x22c23a = _0x3eb7fa["bottom"] + _0x15f86e) : (_0x36f57c = _0x3eb7fa["right"] + _0x15f86e, _0x22c23a = _0x3eb7fa['cy'] - _0x4a62b5["height"] / 0x2);
    }
  }
  const _0x22a162 = _0x36f57c - _0x4a62b5["minX"];
  const _0x415c2e = _0x22c23a - _0x4a62b5['minY'];
  const _0x2ae4e1 = {};
  for (const _0x49c8ca of _0x5dac57) {
    _0x2ae4e1[_0x49c8ca['id']] = {
      'x': _0x49c8ca['x'] + _0x22a162,
      'y': _0x49c8ca['y'] + _0x415c2e
    };
  }
  return _0x2ae4e1;
}
export function buildNodeOffsetPlan(_0x98f7c5, _0x564b81) {
  if (!_0x98f7c5 || typeof _0x98f7c5 !== "object") {
    return {};
  }
  if (!_0x564b81 || typeof _0x564b81 !== "object") {
    return {};
  }
  const _0x1117db = {};
  for (const [_0x18694d, _0x5cc37d] of Object["entries"](_0x564b81)) {
    const _0x5dd17b = _0x98f7c5[_0x18694d];
    if (!_0x5dd17b || !_0x5cc37d) {
      continue;
    }
    const _0x39014e = _toFiniteNumber(_0x5dd17b['x'], 0x0);
    const _0x39f72a = _toFiniteNumber(_0x5dd17b['y'], 0x0);
    const _0x374592 = _toFiniteNumber(_0x5cc37d['x'], _0x39014e);
    const _0x271718 = _toFiniteNumber(_0x5cc37d['y'], _0x39f72a);
    const _0x2a3415 = _0x374592 - _0x39014e;
    const _0x33bf19 = _0x271718 - _0x39f72a;
    if (Math["abs"](_0x2a3415) < 0.000001 && Math["abs"](_0x33bf19) < 0.000001) {
      continue;
    }
    _0x1117db[_0x18694d] = {
      'dx': _0x2a3415,
      'dy': _0x33bf19
    };
  }
  return _0x1117db;
}
export function resolveSnapThresholdInWorld(_0x235a22, _0x1b5e6b = 0x8) {
  const _0x51502b = Number['isFinite'](_0x235a22) && _0x235a22 > 0x0 ? _0x235a22 : 0x1;
  const _0x1c1cf4 = Number["isFinite"](_0x1b5e6b) ? _0x1b5e6b : 0x8;
  return _0x1c1cf4 / _0x51502b;
}
export function computeSingleNodeSnapGuides(_0xc6fd85) {
  const {
    nodesById: _0x46787a,
    dragNodeId: _0x54bc23,
    proposedX: _0x4128bc,
    proposedY: _0x312adf,
    width: _0x4c3b4b,
    height: _0x3c8c21,
    viewport: _0x2986ce,
    thresholdPx = 0x8,
    spatialIndex = null
  } = _0xc6fd85 || {};
  const _0xa04374 = _toFiniteNumber(_0x4128bc, 0x0);
  const _0x95c8dc = _toFiniteNumber(_0x312adf, 0x0);
  const _0x4bbf49 = _toFiniteNumber(_0x2986ce?.['x'], 0x0);
  const _0xcbca72 = _toFiniteNumber(_0x2986ce?.['y'], 0x0);
  const _0x2f4d5f = _toFiniteNumber(_0x2986ce?.["zoom"], 0x1) || 0x1;
  const _0x181f1b = Math["max"](0x0, _toFiniteNumber(_0x4c3b4b, 0xc8));
  const _0xb7b3f0 = Math["max"](0x0, _toFiniteNumber(_0x3c8c21, 0xc8));
  const _0x9791e5 = {
    'snappedX': _0xa04374,
    'snappedY': _0x95c8dc,
    'guideLines': []
  };
  if (!_0x46787a || typeof _0x46787a !== "object" || !_0x54bc23 || !_0x46787a[_0x54bc23]) {
    return _0x9791e5;
  }
  const _0x2ec66b = resolveSnapThresholdInWorld(_0x2f4d5f, thresholdPx);
  const _0x5c7760 = _0xa04374;
  const _0x1a4934 = _0xa04374 + _0x181f1b;
  const _0x3bf13d = _0x95c8dc;
  const _0x45d4bc = _0x95c8dc + _0xb7b3f0;
  let _0x3a86f5 = null;
  let _0x3b6e9a = null;
  let _0x5b900d = null;
  let _0x4cc763 = null;
  const _0x1b7b7e = spatialIndex ? getNodeSpatialQueryNodes(_0x46787a, collectSnapSearchCandidateIds(spatialIndex, {
    'x': _0xa04374,
    'y': _0x95c8dc,
    'width': _0x181f1b,
    'height': _0xb7b3f0
  }, _0x2ec66b)) : Object["values"](_0x46787a);
  for (const _0x4a4863 of _0x1b7b7e) {
    if (!_0x4a4863 || _0x4a4863['id'] === _0x54bc23) {
      continue;
    }
    const _0x2f65f5 = _toFiniteNumber(_0x4a4863['x'], 0x0);
    const _0x2d4db8 = _0x2f65f5 + Math['max'](0x0, _toFiniteNumber(_0x4a4863['width'], 0xc8));
    const _0x30c896 = _toFiniteNumber(_0x4a4863['y'], 0x0);
    const _0x5ae469 = _0x30c896 + Math['max'](0x0, _toFiniteNumber(_0x4a4863["height"], 0xc8));
    if (_0x3a86f5 === null) {
      if (Math['abs'](_0x5c7760 - _0x2f65f5) < _0x2ec66b) {
        _0x3a86f5 = _0x2f65f5;
        _0x5b900d = _0x2f65f5;
      } else {
        if (Math['abs'](_0x5c7760 - _0x2d4db8) < _0x2ec66b) {
          _0x3a86f5 = _0x2d4db8;
          _0x5b900d = _0x2d4db8;
        } else {
          if (Math["abs"](_0x1a4934 - _0x2f65f5) < _0x2ec66b) {
            _0x3a86f5 = _0x2f65f5 - _0x181f1b;
            _0x5b900d = _0x2f65f5;
          } else {
            Math["abs"](_0x1a4934 - _0x2d4db8) < _0x2ec66b && (_0x3a86f5 = _0x2d4db8 - _0x181f1b, _0x5b900d = _0x2d4db8);
          }
        }
      }
    }
    if (_0x3b6e9a === null) {
      if (Math["abs"](_0x3bf13d - _0x30c896) < _0x2ec66b) {
        _0x3b6e9a = _0x30c896;
        _0x4cc763 = _0x30c896;
      } else {
        if (Math['abs'](_0x3bf13d - _0x5ae469) < _0x2ec66b) {
          _0x3b6e9a = _0x5ae469;
          _0x4cc763 = _0x5ae469;
        } else {
          if (Math["abs"](_0x45d4bc - _0x30c896) < _0x2ec66b) {
            _0x3b6e9a = _0x30c896 - _0xb7b3f0;
            _0x4cc763 = _0x30c896;
          } else {
            Math["abs"](_0x45d4bc - _0x5ae469) < _0x2ec66b && (_0x3b6e9a = _0x5ae469 - _0xb7b3f0, _0x4cc763 = _0x5ae469);
          }
        }
      }
    }
    if (_0x3a86f5 !== null && _0x3b6e9a !== null) {
      break;
    }
  }
  const _0x5cf2a9 = [];
  const _0x581e9e = [];
  if (_0x3a86f5 !== null) {
    const _0x57eb64 = collectSnapMatchNodes(_0x46787a, _0x1b7b7e, spatialIndex, 'x', _0x5b900d);
    for (const _0xefba47 of _0x57eb64) {
      if (!_0xefba47 || _0xefba47['id'] === _0x54bc23) {
        continue;
      }
      const _0x151c66 = _toFiniteNumber(_0xefba47['x'], 0x0);
      const _0x52b9a9 = _0x151c66 + Math["max"](0x0, _toFiniteNumber(_0xefba47["width"], 0xc8));
      (Math["abs"](_0x151c66 - _0x5b900d) < SNAP_MATCH_EPSILON || Math["abs"](_0x52b9a9 - _0x5b900d) < SNAP_MATCH_EPSILON) && _0x5cf2a9["push"](_0xefba47);
    }
  }
  if (_0x3b6e9a !== null) {
    const _0x379c71 = collectSnapMatchNodes(_0x46787a, _0x1b7b7e, spatialIndex, 'y', _0x4cc763);
    for (const _0x2e45d2 of _0x379c71) {
      if (!_0x2e45d2 || _0x2e45d2['id'] === _0x54bc23) {
        continue;
      }
      const _0x2494ce = _toFiniteNumber(_0x2e45d2['y'], 0x0);
      const _0xd9a3bb = _0x2494ce + Math["max"](0x0, _toFiniteNumber(_0x2e45d2["height"], 0xc8));
      (Math['abs'](_0x2494ce - _0x4cc763) < SNAP_MATCH_EPSILON || Math["abs"](_0xd9a3bb - _0x4cc763) < SNAP_MATCH_EPSILON) && _0x581e9e['push'](_0x2e45d2);
    }
  }
  if (_0x3a86f5 !== null) {
    _0x9791e5["snappedX"] = _0x3a86f5;
    const _0x48348b = _0x95c8dc + (_0x3b6e9a !== null ? _0x3b6e9a - _0x95c8dc : 0x0);
    const _0x5a664a = _0x48348b + _0xb7b3f0;
    let _0x3a8d59 = _0x48348b;
    let _0x1522fc = _0x5a664a;
    _0x5cf2a9["forEach"](_0x26626e => {
      const _0xcfb7e5 = _toFiniteNumber(_0x26626e['y'], 0x0);
      const _0x254988 = Math["max"](0x0, _toFiniteNumber(_0x26626e["height"], 0xc8));
      _0x3a8d59 = Math['min'](_0x3a8d59, _0xcfb7e5);
      _0x1522fc = Math["max"](_0x1522fc, _0xcfb7e5 + _0x254988);
    });
    _0x9791e5["guideLines"]['push']({
      'type': 'v',
      'pos': _0x5b900d * _0x2f4d5f + _0x4bbf49,
      'start': _0x3a8d59 * _0x2f4d5f + _0xcbca72,
      'end': _0x1522fc * _0x2f4d5f + _0xcbca72
    });
  }
  if (_0x3b6e9a !== null) {
    _0x9791e5['snappedY'] = _0x3b6e9a;
    const _0x17b68c = _0xa04374 + (_0x3a86f5 !== null ? _0x3a86f5 - _0xa04374 : 0x0);
    const _0x492e04 = _0x17b68c + _0x181f1b;
    let _0x4f1454 = _0x17b68c;
    let _0x24e0bf = _0x492e04;
    _0x581e9e["forEach"](_0x51ca0f => {
      const _0x2b7ed4 = _toFiniteNumber(_0x51ca0f['x'], 0x0);
      const _0x1b36ac = Math['max'](0x0, _toFiniteNumber(_0x51ca0f['width'], 0xc8));
      _0x4f1454 = Math["min"](_0x4f1454, _0x2b7ed4);
      _0x24e0bf = Math["max"](_0x24e0bf, _0x2b7ed4 + _0x1b36ac);
    });
    _0x9791e5["guideLines"]["push"]({
      'type': 'h',
      'pos': _0x4cc763 * _0x2f4d5f + _0xcbca72,
      'start': _0x4f1454 * _0x2f4d5f + _0x4bbf49,
      'end': _0x24e0bf * _0x2f4d5f + _0x4bbf49
    });
  }
  return _0x9791e5;
}
export function computeMultiNodeSnapGuides(_0x76f070) {
  const {
    nodesById: _0x5d39ef,
    movingNodeIds: _0x53db76,
    proposedBounds: _0x15e9ab,
    viewport: _0x5aebcb,
    thresholdPx = 0x8,
    spatialIndex = null
  } = _0x76f070 || {};
  const _0x52cf91 = _toFiniteNumber(_0x15e9ab?.["minX"], 0x0);
  const _0x1fdb50 = _toFiniteNumber(_0x15e9ab?.['minY'], 0x0);
  const _0x217db5 = Math["max"](0x0, _toFiniteNumber(_0x15e9ab?.["width"], 0x0));
  const _0x476180 = Math['max'](0x0, _toFiniteNumber(_0x15e9ab?.["height"], 0x0));
  const _0x1e9dfc = _toFiniteNumber(_0x5aebcb?.['x'], 0x0);
  const _0x2ae988 = _toFiniteNumber(_0x5aebcb?.['y'], 0x0);
  const _0x5d7dad = _toFiniteNumber(_0x5aebcb?.["zoom"], 0x1) || 0x1;
  const _0x441c14 = {
    'snappedX': _0x52cf91,
    'snappedY': _0x1fdb50,
    'guideLines': []
  };
  if (!_0x5d39ef || typeof _0x5d39ef !== "object") {
    return _0x441c14;
  }
  const _0x40897d = new Set(Array["isArray"](_0x53db76) ? _0x53db76['filter'](Boolean) : []);
  if (_0x40897d["size"] === 0x0) {
    return _0x441c14;
  }
  const _0x38cc10 = resolveSnapThresholdInWorld(_0x5d7dad, thresholdPx);
  const _0x1b5e84 = _0x52cf91;
  const _0x203251 = _0x52cf91 + _0x217db5;
  const _0x4d3baf = _0x1fdb50;
  const _0x13713c = _0x1fdb50 + _0x476180;
  let _0x2a9e7a = null;
  let _0x53fcf3 = null;
  let _0x330eda = null;
  let _0x5d2709 = null;
  const _0x12c9dc = spatialIndex ? getNodeSpatialQueryNodes(_0x5d39ef, collectSnapSearchCandidateIds(spatialIndex, {
    'x': _0x52cf91,
    'y': _0x1fdb50,
    'width': _0x217db5,
    'height': _0x476180
  }, _0x38cc10)) : Object["values"](_0x5d39ef);
  for (const _0x3f7913 of _0x12c9dc) {
    if (!_0x3f7913 || _0x40897d["has"](_0x3f7913['id'])) {
      continue;
    }
    const _0x201900 = _toFiniteNumber(_0x3f7913['x'], 0x0);
    const _0x2bbb5b = _0x201900 + Math["max"](0x0, _toFiniteNumber(_0x3f7913["width"], 0xc8));
    const _0x5af636 = _toFiniteNumber(_0x3f7913['y'], 0x0);
    const _0x20e8f2 = _0x5af636 + Math["max"](0x0, _toFiniteNumber(_0x3f7913["height"], 0xc8));
    if (_0x2a9e7a === null) {
      if (Math["abs"](_0x1b5e84 - _0x201900) < _0x38cc10) {
        _0x2a9e7a = _0x201900;
        _0x330eda = _0x201900;
      } else {
        if (Math["abs"](_0x1b5e84 - _0x2bbb5b) < _0x38cc10) {
          _0x2a9e7a = _0x2bbb5b;
          _0x330eda = _0x2bbb5b;
        } else {
          if (Math["abs"](_0x203251 - _0x201900) < _0x38cc10) {
            _0x2a9e7a = _0x201900 - _0x217db5;
            _0x330eda = _0x201900;
          } else {
            Math["abs"](_0x203251 - _0x2bbb5b) < _0x38cc10 && (_0x2a9e7a = _0x2bbb5b - _0x217db5, _0x330eda = _0x2bbb5b);
          }
        }
      }
    }
    if (_0x53fcf3 === null) {
      if (Math["abs"](_0x4d3baf - _0x5af636) < _0x38cc10) {
        _0x53fcf3 = _0x5af636;
        _0x5d2709 = _0x5af636;
      } else {
        if (Math["abs"](_0x4d3baf - _0x20e8f2) < _0x38cc10) {
          _0x53fcf3 = _0x20e8f2;
          _0x5d2709 = _0x20e8f2;
        } else {
          if (Math['abs'](_0x13713c - _0x5af636) < _0x38cc10) {
            _0x53fcf3 = _0x5af636 - _0x476180;
            _0x5d2709 = _0x5af636;
          } else {
            Math['abs'](_0x13713c - _0x20e8f2) < _0x38cc10 && (_0x53fcf3 = _0x20e8f2 - _0x476180, _0x5d2709 = _0x20e8f2);
          }
        }
      }
    }
    if (_0x2a9e7a !== null && _0x53fcf3 !== null) {
      break;
    }
  }
  const _0x3abefb = [];
  const _0xb5faa8 = [];
  if (_0x2a9e7a !== null) {
    const _0x5d89c6 = collectSnapMatchNodes(_0x5d39ef, _0x12c9dc, spatialIndex, 'x', _0x330eda);
    for (const _0x229b11 of _0x5d89c6) {
      if (!_0x229b11 || _0x40897d["has"](_0x229b11['id'])) {
        continue;
      }
      const _0x3340d5 = _toFiniteNumber(_0x229b11['x'], 0x0);
      const _0x25ea04 = _0x3340d5 + Math['max'](0x0, _toFiniteNumber(_0x229b11["width"], 0xc8));
      (Math['abs'](_0x3340d5 - _0x330eda) < SNAP_MATCH_EPSILON || Math["abs"](_0x25ea04 - _0x330eda) < SNAP_MATCH_EPSILON) && _0x3abefb["push"](_0x229b11);
    }
  }
  if (_0x53fcf3 !== null) {
    const _0x234e99 = collectSnapMatchNodes(_0x5d39ef, _0x12c9dc, spatialIndex, 'y', _0x5d2709);
    for (const _0x925cd3 of _0x234e99) {
      if (!_0x925cd3 || _0x40897d["has"](_0x925cd3['id'])) {
        continue;
      }
      const _0x5f3a20 = _toFiniteNumber(_0x925cd3['y'], 0x0);
      const _0x4b5cbe = _0x5f3a20 + Math["max"](0x0, _toFiniteNumber(_0x925cd3["height"], 0xc8));
      (Math["abs"](_0x5f3a20 - _0x5d2709) < SNAP_MATCH_EPSILON || Math["abs"](_0x4b5cbe - _0x5d2709) < SNAP_MATCH_EPSILON) && _0xb5faa8['push'](_0x925cd3);
    }
  }
  if (_0x2a9e7a !== null) {
    _0x441c14['snappedX'] = _0x2a9e7a;
    const _0x747bbb = _0x1fdb50 + (_0x53fcf3 !== null ? _0x53fcf3 - _0x1fdb50 : 0x0);
    const _0x488a3e = _0x747bbb + _0x476180;
    let _0x41f1b4 = _0x747bbb;
    let _0xa7a313 = _0x488a3e;
    _0x3abefb["forEach"](_0x931a5e => {
      const _0x2f0046 = _toFiniteNumber(_0x931a5e['y'], 0x0);
      const _0x250a2f = Math['max'](0x0, _toFiniteNumber(_0x931a5e['height'], 0xc8));
      _0x41f1b4 = Math["min"](_0x41f1b4, _0x2f0046);
      _0xa7a313 = Math['max'](_0xa7a313, _0x2f0046 + _0x250a2f);
    });
    _0x441c14['guideLines']["push"]({
      'type': 'v',
      'pos': _0x330eda * _0x5d7dad + _0x1e9dfc,
      'start': _0x41f1b4 * _0x5d7dad + _0x2ae988,
      'end': _0xa7a313 * _0x5d7dad + _0x2ae988
    });
  }
  if (_0x53fcf3 !== null) {
    _0x441c14['snappedY'] = _0x53fcf3;
    const _0x1e5635 = _0x52cf91 + (_0x2a9e7a !== null ? _0x2a9e7a - _0x52cf91 : 0x0);
    const _0xf7d4ad = _0x1e5635 + _0x217db5;
    let _0x550e05 = _0x1e5635;
    let _0x20fcdc = _0xf7d4ad;
    _0xb5faa8["forEach"](_0x2992b2 => {
      const _0x2f28ce = _toFiniteNumber(_0x2992b2['x'], 0x0);
      const _0x73cbc9 = Math["max"](0x0, _toFiniteNumber(_0x2992b2['width'], 0xc8));
      _0x550e05 = Math["min"](_0x550e05, _0x2f28ce);
      _0x20fcdc = Math["max"](_0x20fcdc, _0x2f28ce + _0x73cbc9);
    });
    _0x441c14["guideLines"]["push"]({
      'type': 'h',
      'pos': _0x5d2709 * _0x5d7dad + _0x2ae988,
      'start': _0x550e05 * _0x5d7dad + _0x1e9dfc,
      'end': _0x20fcdc * _0x5d7dad + _0x1e9dfc
    });
  }
  return _0x441c14;
}
export function calcWorldBounds(_0x5bbb24, _0x4fa481 = null) {
  const _0x10a890 = computeNodesWorldBounds(_0x5bbb24);
  if (!_0x10a890) {
    if (_0x4fa481) {
      const _0x289bcb = 0x780;
      const _0x1c5f65 = 0x438;
      const _0x1fefaf = -_0x4fa481['x'] / _0x4fa481["zoom"];
      const _0x243df5 = -_0x4fa481['y'] / _0x4fa481['zoom'];
      const _0x50f8f2 = _0x289bcb / _0x4fa481["zoom"];
      const _0x71cc87 = _0x1c5f65 / _0x4fa481["zoom"];
      const _0x5de9d6 = 0x258;
      return {
        'minX': _0x1fefaf - _0x5de9d6,
        'minY': _0x243df5 - _0x5de9d6,
        'maxX': _0x1fefaf + _0x50f8f2 + _0x5de9d6,
        'maxY': _0x243df5 + _0x71cc87 + _0x5de9d6,
        'width': _0x50f8f2 + _0x5de9d6 * 0x2,
        'height': _0x71cc87 + _0x5de9d6 * 0x2
      };
    }
    return {
      'minX': 0x0,
      'minY': 0x0,
      'maxX': 0x7d0,
      'maxY': 0x7d0,
      'width': 0x7d0,
      'height': 0x7d0
    };
  }
  const _0x39f9c9 = 0x258;
  const _0x58b53f = _0x10a890["minX"] - _0x39f9c9;
  const _0x347683 = _0x10a890['minY'] - _0x39f9c9;
  const _0x1d396c = _0x10a890["maxX"] + _0x39f9c9;
  const _0x222385 = _0x10a890["maxY"] + _0x39f9c9;
  return {
    'minX': _0x58b53f,
    'minY': _0x347683,
    'maxX': _0x1d396c,
    'maxY': _0x222385,
    'width': _0x1d396c - _0x58b53f,
    'height': _0x222385 - _0x347683
  };
}
export function worldToMinimap(_0x2748ba, _0x32cc66, _0x177d2d, _0x5e1472) {
  const _0x512b07 = Math["max"](_0x177d2d["width"], _0x177d2d["height"], 0x1);
  const _0x5c6c2f = _0x5e1472 / _0x512b07;
  const _0x1eded5 = (_0x2748ba - _0x177d2d["minX"]) * _0x5c6c2f;
  const _0x2431e4 = (_0x32cc66 - _0x177d2d["minY"]) * _0x5c6c2f;
  return {
    'x': _0x1eded5,
    'y': _0x2431e4,
    'scale': _0x5c6c2f
  };
}
const DEFAULT_NODE_SPATIAL_INDEX_CELL_SIZE = 0xf0;
const EMPTY_NODE_SPATIAL_QUERY_RESULT = Object["freeze"]([]);
const SNAP_MATCH_EPSILON = 0.1;
function getNodeSpatialCellCoord(_0x23a868, _0x82dda1) {
  return Math["floor"](_0x23a868 / _0x82dda1);
}
function getNodeSpatialCellKey(_0x525f14, _0x34970d) {
  return _0x525f14 + ',' + _0x34970d;
}
function normalizeNodeSpatialCellBounds(_0x276fc4) {
  if (!_0x276fc4) {
    return null;
  }
  const _0x1d69ae = Number(_0x276fc4["minX"]);
  const _0x353a6f = Number(_0x276fc4["maxX"]);
  const _0x5efd8e = Number(_0x276fc4["minY"]);
  const _0x137152 = Number(_0x276fc4["maxY"]);
  if (!Number["isFinite"](_0x1d69ae) || !Number["isFinite"](_0x353a6f) || !Number["isFinite"](_0x5efd8e) || !Number['isFinite'](_0x137152)) {
    return null;
  }
  return {
    'minX': _0x1d69ae,
    'maxX': _0x353a6f,
    'minY': _0x5efd8e,
    'maxY': _0x137152
  };
}
function pushNodeIdToSpatialCell(_0x227825, _0x38e3d1, _0x57ba79, _0x116b70) {
  const _0x1a7ef8 = getNodeSpatialCellKey(_0x38e3d1, _0x57ba79);
  const _0x448e54 = _0x227825["get"](_0x1a7ef8);
  if (_0x448e54) {
    _0x448e54['push'](_0x116b70);
    return;
  }
  _0x227825['set'](_0x1a7ef8, [_0x116b70]);
}
function normalizeNodeQueryRect(_0x3deefc) {
  if (!_0x3deefc || typeof _0x3deefc !== "object") {
    return null;
  }
  const _0x39ce90 = Number(_0x3deefc['x']);
  const _0x3647c0 = Number(_0x3deefc['y']);
  const _0x3f2e3c = Math["max"](0x0, Number(_0x3deefc["width"]) || 0x0);
  const _0x575692 = Math["max"](0x0, Number(_0x3deefc["height"]) || 0x0);
  if (!Number["isFinite"](_0x39ce90) || !Number["isFinite"](_0x3647c0)) {
    return null;
  }
  return {
    'x': _0x39ce90,
    'y': _0x3647c0,
    'width': _0x3f2e3c,
    'height': _0x575692
  };
}
function finalizeNodeQueryRect(_0x29f5fb, _0x30845f = {}) {
  const _0x4a8af4 = normalizeNodeQueryRect(_0x29f5fb);
  if (!_0x4a8af4) {
    return null;
  }
  return {
    ..._0x4a8af4,
    'right': _0x4a8af4['x'] + _0x4a8af4['width'],
    'bottom': _0x4a8af4['y'] + _0x4a8af4['height'],
    'cx': _0x4a8af4['x'] + _0x4a8af4['width'] / 0x2,
    'cy': _0x4a8af4['y'] + _0x4a8af4['height'] / 0x2,
    ..._0x30845f
  };
}
function defaultNodeQueryRectResolver(_0x2a7656) {
  if (!_0x2a7656 || typeof _0x2a7656 !== "object") {
    return null;
  }
  return {
    'x': _0x2a7656['x'],
    'y': _0x2a7656['y'],
    'width': _0x2a7656["width"] || 0x0,
    'height': _0x2a7656["height"] || 0x0
  };
}
function normalizeNodeQueryOptions(_0x38df43 = ![], _0x269c9e = undefined) {
  const _0x16acbc = _0x38df43 && typeof _0x38df43 === "object" ? {
    ..._0x38df43
  } : {
    'ignoreGroup': _0x38df43 === !![]
  };
  _0x269c9e && typeof _0x269c9e === "object" && Object["assign"](_0x16acbc, _0x269c9e);
  _0x16acbc["ignoreGroup"] = _0x16acbc["ignoreGroup"] === !![];
  _0x16acbc["resolveRect"] = typeof _0x16acbc['resolveRect'] === "function" ? _0x16acbc['resolveRect'] : defaultNodeQueryRectResolver;
  _0x16acbc['candidateFilter'] = typeof _0x16acbc['candidateFilter'] === "function" ? _0x16acbc["candidateFilter"] : null;
  _0x16acbc["spatialIndex"] = _0x16acbc["spatialIndex"] || null;
  return _0x16acbc;
}
function resolveNodeQueryRect(_0x5b36c7, _0xf776e7, _0x2d3edf, _0x4592b1 = null) {
  const _0x46ace5 = String(_0x5b36c7?.['id'] || _0xf776e7 || '')["trim"]();
  if (!_0x46ace5) {
    return null;
  }
  const _0x56ed88 = _0x4592b1?.["nodeRects"] instanceof Map ? _0x4592b1['nodeRects']["get"](_0x46ace5) : null;
  if (_0x56ed88) {
    return _0x56ed88;
  }
  return finalizeNodeQueryRect(_0x2d3edf(_0x5b36c7, _0x46ace5));
}
function iterateNodeSpatialRing(_0x28b21a, _0x31159f, _0x5c5e13, _0x3b57bf) {
  if (_0x5c5e13 === 0x0) {
    _0x3b57bf(_0x28b21a, _0x31159f);
    return;
  }
  const _0x13b4dd = _0x28b21a - _0x5c5e13;
  const _0x3b72aa = _0x28b21a + _0x5c5e13;
  const _0xf3836a = _0x31159f - _0x5c5e13;
  const _0x54c0e4 = _0x31159f + _0x5c5e13;
  for (let _0x53a5e8 = _0x13b4dd; _0x53a5e8 <= _0x3b72aa; _0x53a5e8 += 0x1) {
    _0x3b57bf(_0x53a5e8, _0xf3836a);
    _0x3b57bf(_0x53a5e8, _0x54c0e4);
  }
  for (let _0x1bf4fe = _0xf3836a + 0x1; _0x1bf4fe < _0x54c0e4; _0x1bf4fe += 0x1) {
    _0x3b57bf(_0x13b4dd, _0x1bf4fe);
    _0x3b57bf(_0x3b72aa, _0x1bf4fe);
  }
}
function getPointToCellRectDistSq(_0x73b74b, _0x436047, _0x432e5a, _0x58a897, _0x212cfe) {
  const _0x1bdd98 = _0x432e5a * _0x212cfe;
  const _0x65c3dd = _0x58a897 * _0x212cfe;
  const _0x241b66 = _0x1bdd98 + _0x212cfe;
  const _0x59953b = _0x65c3dd + _0x212cfe;
  const _0x29476b = _0x73b74b < _0x1bdd98 ? _0x1bdd98 - _0x73b74b : _0x73b74b > _0x241b66 ? _0x73b74b - _0x241b66 : 0x0;
  const _0x26d13 = _0x436047 < _0x65c3dd ? _0x65c3dd - _0x436047 : _0x436047 > _0x59953b ? _0x436047 - _0x59953b : 0x0;
  return _0x29476b * _0x29476b + _0x26d13 * _0x26d13;
}
function getNodeSpatialWorldBounds(_0x16a114) {
  const _0x89de8e = normalizeNodeSpatialCellBounds(_0x16a114?.["boundsCellBounds"]);
  if (!_0x89de8e) {
    return null;
  }
  const _0x1d0dc4 = Number(_0x16a114?.["cellSize"]);
  if (!Number["isFinite"](_0x1d0dc4) || _0x1d0dc4 <= 0x0) {
    return null;
  }
  return {
    'x': _0x89de8e['minX'] * _0x1d0dc4,
    'y': _0x89de8e["minY"] * _0x1d0dc4,
    'width': (_0x89de8e["maxX"] - _0x89de8e['minX'] + 0x1) * _0x1d0dc4,
    'height': (_0x89de8e["maxY"] - _0x89de8e["minY"] + 0x1) * _0x1d0dc4
  };
}
function getNodeSpatialStripeRect(_0x2f9c78, _0x2e691f, _0x5cfbc6, _0x47bf2b, _0x16aa54 = 0x0) {
  const _0x3c3783 = getNodeSpatialWorldBounds(_0x2f9c78);
  if (!_0x3c3783) {
    return null;
  }
  const _0x1600e8 = Math["min"](_toFiniteNumber(_0x5cfbc6, 0x0), _toFiniteNumber(_0x47bf2b, 0x0));
  const _0x1e1e37 = Math["max"](_toFiniteNumber(_0x5cfbc6, 0x0), _toFiniteNumber(_0x47bf2b, 0x0));
  const _0x4ba201 = Math["max"](0x0, _toFiniteNumber(_0x16aa54, 0x0));
  if (_0x2e691f === 'x') {
    return {
      'x': _0x1600e8 - _0x4ba201,
      'y': _0x3c3783['y'],
      'width': Math["max"](0x0, _0x1e1e37 - _0x1600e8) + _0x4ba201 * 0x2,
      'height': _0x3c3783["height"]
    };
  }
  if (_0x2e691f === 'y') {
    return {
      'x': _0x3c3783['x'],
      'y': _0x1600e8 - _0x4ba201,
      'width': _0x3c3783['width'],
      'height': Math['max'](0x0, _0x1e1e37 - _0x1600e8) + _0x4ba201 * 0x2
    };
  }
  return null;
}
function getNodeSpatialQueryNodes(_0x26959a, _0x85d4fe) {
  if (!Array['isArray'](_0x85d4fe) || _0x85d4fe["length"] === 0x0) {
    return [];
  }
  const _0x319846 = [];
  for (const _0x145e9a of _0x85d4fe) {
    const _0x98fe4 = _0x26959a?.[_0x145e9a];
    if (_0x98fe4) {
      _0x319846["push"](_0x98fe4);
    }
  }
  return _0x319846;
}
function collectSnapSearchCandidateIds(_0x275a07, _0x15729c, _0xaf7f8d) {
  if (!_0x275a07 || !_0x15729c) {
    return EMPTY_NODE_SPATIAL_QUERY_RESULT;
  }
  const _0x47f4c0 = getNodeSpatialStripeRect(_0x275a07, 'x', _0x15729c['x'], _0x15729c['x'] + _0x15729c['width'], _0xaf7f8d);
  const _0x15e95b = getNodeSpatialStripeRect(_0x275a07, 'y', _0x15729c['y'], _0x15729c['y'] + _0x15729c["height"], _0xaf7f8d);
  if (!_0x47f4c0 && !_0x15e95b) {
    return EMPTY_NODE_SPATIAL_QUERY_RESULT;
  }
  const _0x38cdac = new Set();
  if (_0x47f4c0) {
    for (const _0x3d6011 of queryNodeSpatialIndexInRect(_0x275a07, _0x47f4c0)) {
      _0x38cdac["add"](_0x3d6011);
    }
  }
  if (_0x15e95b) {
    for (const _0x107a01 of queryNodeSpatialIndexInRect(_0x275a07, _0x15e95b)) {
      _0x38cdac["add"](_0x107a01);
    }
  }
  return _0x38cdac['size'] > 0x0 ? Array["from"](_0x38cdac) : EMPTY_NODE_SPATIAL_QUERY_RESULT;
}
function collectSnapMatchNodes(_0x100a53, _0x161eb1, _0x4faa27, _0x44054b, _0x1c5e98) {
  if (!Number["isFinite"](_0x1c5e98)) {
    return [];
  }
  if (!_0x4faa27) {
    return _0x161eb1;
  }
  const _0x5bb1e9 = getNodeSpatialStripeRect(_0x4faa27, _0x44054b, _0x1c5e98, _0x1c5e98, SNAP_MATCH_EPSILON);
  if (!_0x5bb1e9) {
    return _0x161eb1;
  }
  return getNodeSpatialQueryNodes(_0x100a53, queryNodeSpatialIndexInRect(_0x4faa27, _0x5bb1e9));
}
function getMinRingToCenterCellBounds(_0x43141e, _0x571dfd, _0x3f2e6b) {
  if (!_0x3f2e6b) {
    return 0x0;
  }
  const _0x28a120 = _0x43141e < _0x3f2e6b['minX'] ? _0x3f2e6b["minX"] - _0x43141e : _0x43141e > _0x3f2e6b["maxX"] ? _0x43141e - _0x3f2e6b["maxX"] : 0x0;
  const _0x129213 = _0x571dfd < _0x3f2e6b["minY"] ? _0x3f2e6b["minY"] - _0x571dfd : _0x571dfd > _0x3f2e6b['maxY'] ? _0x571dfd - _0x3f2e6b['maxY'] : 0x0;
  return Math['max'](_0x28a120, _0x129213);
}
function doesRingCoverCenterCellBounds(_0x5a4023, _0x2b0195, _0x27d4ff, _0x393ea4) {
  if (!_0x393ea4) {
    return !![];
  }
  return _0x5a4023 - _0x27d4ff <= _0x393ea4["minX"] && _0x5a4023 + _0x27d4ff >= _0x393ea4['maxX'] && _0x2b0195 - _0x27d4ff <= _0x393ea4["minY"] && _0x2b0195 + _0x27d4ff >= _0x393ea4["maxY"];
}
function getNextRingMinCenterDistSq(_0xec55cc, _0x52ee10, _0xbd74cc, _0x1ab462, _0xb23022, _0x2ce0e9) {
  if (!_0xec55cc?.["centerCellBounds"]) {
    return Infinity;
  }
  let _0x5aba00 = Infinity;
  iterateNodeSpatialRing(_0x1ab462, _0xb23022, _0x2ce0e9, (_0x2c4dae, _0x219150) => {
    if (_0x2c4dae < _0xec55cc['centerCellBounds']["minX"] || _0x2c4dae > _0xec55cc['centerCellBounds']["maxX"] || _0x219150 < _0xec55cc['centerCellBounds']["minY"] || _0x219150 > _0xec55cc["centerCellBounds"]["maxY"]) {
      return;
    }
    const _0x5772a8 = getPointToCellRectDistSq(_0x52ee10, _0xbd74cc, _0x2c4dae, _0x219150, _0xec55cc["cellSize"]);
    if (_0x5772a8 < _0x5aba00) {
      _0x5aba00 = _0x5772a8;
    }
  });
  return _0x5aba00;
}
function findNearestNodeRectInSpatialIndex(_0x316ba5, _0x1262b9, _0x307752, _0x4f365e, _0x5385e0 = {}) {
  if (!_0x316ba5 || !(_0x316ba5["centerCells"] instanceof Map) || !(_0x316ba5["nodeRects"] instanceof Map) || !_0x316ba5["centerCellBounds"]) {
    return null;
  }
  const _0x3e7c36 = getNodeSpatialCellCoord(_0x307752, _0x316ba5["cellSize"]);
  const _0x546d05 = getNodeSpatialCellCoord(_0x4f365e, _0x316ba5["cellSize"]);
  const _0x265393 = getMinRingToCenterCellBounds(_0x3e7c36, _0x546d05, _0x316ba5["centerCellBounds"]);
  const _0x3c5781 = _0x5385e0['ignoreGroup'] === !![];
  const _0x5d24b5 = typeof _0x5385e0['candidateFilter'] === "function" ? _0x5385e0['candidateFilter'] : null;
  let _0x275f56 = null;
  let _0x2cf0ba = null;
  let _0x114492 = Infinity;
  let _0x3b79fb = Infinity;
  for (let _0x101caa = _0x265393;; _0x101caa += 0x1) {
    iterateNodeSpatialRing(_0x3e7c36, _0x546d05, _0x101caa, (_0x5aec8c, _0x391827) => {
      const _0x35cc9a = _0x316ba5['centerCells']["get"](getNodeSpatialCellKey(_0x5aec8c, _0x391827));
      if (!_0x35cc9a || _0x35cc9a['length'] === 0x0) {
        return;
      }
      for (const _0x1c76b0 of _0x35cc9a) {
        const _0x146887 = _0x1262b9?.[_0x1c76b0];
        if (!_0x146887) {
          continue;
        }
        if (_0x3c5781 && _0x146887?.["type"] === 'group') {
          continue;
        }
        if (_0x5d24b5 && _0x5d24b5(_0x146887, _0x1c76b0) === ![]) {
          continue;
        }
        const _0x1f2e84 = _0x316ba5["nodeRects"]["get"](_0x1c76b0);
        if (!_0x1f2e84) {
          continue;
        }
        const _0x540428 = _0x307752 - _0x1f2e84['cx'];
        const _0x53e2a6 = _0x4f365e - _0x1f2e84['cy'];
        const _0x161119 = _0x540428 * _0x540428 + _0x53e2a6 * _0x53e2a6;
        (_0x161119 < _0x114492 || _0x161119 === _0x114492 && _0x1f2e84['order'] < _0x3b79fb) && (_0x275f56 = _0x1c76b0, _0x2cf0ba = _0x1f2e84, _0x114492 = _0x161119, _0x3b79fb = _0x1f2e84["order"]);
      }
    });
    if (doesRingCoverCenterCellBounds(_0x3e7c36, _0x546d05, _0x101caa, _0x316ba5["centerCellBounds"])) {
      break;
    }
    if (_0x2cf0ba) {
      const _0x1db922 = getNextRingMinCenterDistSq(_0x316ba5, _0x307752, _0x4f365e, _0x3e7c36, _0x546d05, _0x101caa + 0x1);
      if (_0x114492 <= _0x1db922) {
        break;
      }
    }
  }
  return _0x275f56 && _0x2cf0ba ? {
    'nodeId': _0x275f56,
    'rect': _0x2cf0ba
  } : null;
}
export function createNodeSpatialIndex(_0x5758b6, _0x26aa8c = {}) {
  const _0xe969a6 = Number(_0x26aa8c?.["cellSize"]);
  const _0x44fadd = Number["isFinite"](_0xe969a6) && _0xe969a6 > 0x0 ? _0xe969a6 : DEFAULT_NODE_SPATIAL_INDEX_CELL_SIZE;
  const _0x5f3353 = typeof _0x26aa8c?.["resolveRect"] === "function" ? _0x26aa8c["resolveRect"] : defaultNodeQueryRectResolver;
  const _0x1fcb67 = new Map();
  const _0x41d0f7 = [];
  const _0x2fb99f = new Map();
  const _0x1f4839 = new Map();
  let _0xa04996 = Infinity;
  let _0x5332d2 = -Infinity;
  let _0x17ef15 = Infinity;
  let _0x400598 = -Infinity;
  let _0x490481 = Infinity;
  let _0x23948b = -Infinity;
  let _0xa2dbf7 = Infinity;
  let _0x1f72ec = -Infinity;
  let _0x825eaf = 0x0;
  for (const [_0x131f15, _0xdba6f8] of Object["entries"](_0x5758b6 || {})) {
    const _0x34c905 = String(_0xdba6f8?.['id'] || _0x131f15 || '')["trim"]();
    if (!_0x34c905) {
      continue;
    }
    const _0x2d0e3d = finalizeNodeQueryRect(_0x5f3353(_0xdba6f8, _0x34c905), {
      'order': _0x825eaf
    });
    if (!_0x2d0e3d) {
      continue;
    }
    const _0x234fc0 = {
      'nodeId': _0x34c905,
      ..._0x2d0e3d
    };
    _0x1f4839["set"](_0x34c905, _0x234fc0);
    _0x825eaf += 0x1;
    const _0x2b8206 = getNodeSpatialCellCoord(_0x234fc0['x'], _0x44fadd);
    const _0xb4bc32 = getNodeSpatialCellCoord(_0x234fc0['right'], _0x44fadd);
    const _0x269d0a = getNodeSpatialCellCoord(_0x234fc0['y'], _0x44fadd);
    const _0x223193 = getNodeSpatialCellCoord(_0x234fc0["bottom"], _0x44fadd);
    if (_0x2b8206 < _0xa04996) {
      _0xa04996 = _0x2b8206;
    }
    if (_0xb4bc32 > _0x5332d2) {
      _0x5332d2 = _0xb4bc32;
    }
    if (_0x269d0a < _0x17ef15) {
      _0x17ef15 = _0x269d0a;
    }
    if (_0x223193 > _0x400598) {
      _0x400598 = _0x223193;
    }
    if ((_0xb4bc32 - _0x2b8206 + 0x1) * (_0x223193 - _0x269d0a + 0x1) > 0x40) {
      _0x41d0f7['push'](_0x34c905);
    } else {
      for (let _0x668994 = _0x2b8206; _0x668994 <= _0xb4bc32; _0x668994 += 0x1) {
        for (let _0x34ad89 = _0x269d0a; _0x34ad89 <= _0x223193; _0x34ad89 += 0x1) {
          pushNodeIdToSpatialCell(_0x1fcb67, _0x668994, _0x34ad89, _0x34c905);
        }
      }
    }
    const _0x3adc8c = getNodeSpatialCellCoord(_0x234fc0['cx'], _0x44fadd);
    const _0x2860ba = getNodeSpatialCellCoord(_0x234fc0['cy'], _0x44fadd);
    pushNodeIdToSpatialCell(_0x2fb99f, _0x3adc8c, _0x2860ba, _0x34c905);
    if (_0x3adc8c < _0x490481) {
      _0x490481 = _0x3adc8c;
    }
    if (_0x3adc8c > _0x23948b) {
      _0x23948b = _0x3adc8c;
    }
    if (_0x2860ba < _0xa2dbf7) {
      _0xa2dbf7 = _0x2860ba;
    }
    if (_0x2860ba > _0x1f72ec) {
      _0x1f72ec = _0x2860ba;
    }
  }
  const _0x4a9d8b = _0x490481 === Infinity ? null : {
    'minX': _0x490481,
    'maxX': _0x23948b,
    'minY': _0xa2dbf7,
    'maxY': _0x1f72ec
  };
  const _0x5e08f5 = _0xa04996 === Infinity ? null : {
    'minX': _0xa04996,
    'maxX': _0x5332d2,
    'minY': _0x17ef15,
    'maxY': _0x400598
  };
  return {
    'cellSize': _0x44fadd,
    'boundsCells': _0x1fcb67,
    'spanningIds': _0x41d0f7,
    'centerCells': _0x2fb99f,
    'nodeRects': _0x1f4839,
    'boundsCellBounds': _0x5e08f5,
    'centerCellBounds': _0x4a9d8b,
    'nodeCount': _0x1f4839["size"]
  };
}
export function queryNodeSpatialIndexAtWorldPoint(_0x1b55cc, _0x1bdf56, _0x1bddac) {
  if (!_0x1b55cc || !(_0x1b55cc["boundsCells"] instanceof Map) || !Number["isFinite"](_0x1bdf56) || !Number["isFinite"](_0x1bddac) || !Number['isFinite'](_0x1b55cc["cellSize"]) || _0x1b55cc["cellSize"] <= 0x0) {
    return EMPTY_NODE_SPATIAL_QUERY_RESULT;
  }
  const _0x5f5834 = getNodeSpatialCellCoord(_0x1bdf56, _0x1b55cc["cellSize"]);
  const _0x4d9a9e = getNodeSpatialCellCoord(_0x1bddac, _0x1b55cc['cellSize']);
  return queryNodeSpatialCells(_0x1b55cc, _0x5f5834, _0x5f5834, _0x4d9a9e, _0x4d9a9e);
}
export function queryNodeSpatialIndexInRect(_0xc39c8b, _0x36f8e5) {
  const _0x469f97 = normalizeNodeQueryRect(_0x36f8e5);
  if (!_0x469f97 || !_0xc39c8b || !(_0xc39c8b["boundsCells"] instanceof Map) || !(_0xc39c8b["nodeRects"] instanceof Map) || !Number['isFinite'](_0xc39c8b["cellSize"]) || _0xc39c8b['cellSize'] <= 0x0) {
    return EMPTY_NODE_SPATIAL_QUERY_RESULT;
  }
  const _0x2fd63a = getNodeSpatialCellCoord(_0x469f97['x'], _0xc39c8b["cellSize"]);
  const _0xa30c45 = getNodeSpatialCellCoord(_0x469f97['x'] + _0x469f97["width"], _0xc39c8b["cellSize"]);
  const _0x42985f = getNodeSpatialCellCoord(_0x469f97['y'], _0xc39c8b["cellSize"]);
  const _0x23afa7 = getNodeSpatialCellCoord(_0x469f97['y'] + _0x469f97["height"], _0xc39c8b['cellSize']);
  return queryNodeSpatialCells(_0xc39c8b, _0x2fd63a, _0xa30c45, _0x42985f, _0x23afa7);
}
function queryNodeSpatialCells(_0x15275a, _0x5e9e16, _0x526711, _0xc95c26, _0x1d60bc) {
  const _0x3e55cc = new Set();
  const _0x3967d7 = (_0x526711 - _0x5e9e16 + 0x1) * (_0x1d60bc - _0xc95c26 + 0x1) > Math['max'](0x40, _0x15275a['nodeCount']);
  const _0x491591 = _0x3967d7 ? _0x15275a["nodeRects"]["keys"]() : _0x15275a["spanningIds"] || [];
  for (const _0x1aeaf5 of _0x491591) {
    const _0xbd7fb0 = _0x15275a['nodeRects']["get"](_0x1aeaf5);
    const _0x277b4c = _0x15275a["cellSize"];
    if (Math["floor"](_0xbd7fb0['x'] / _0x277b4c) <= _0x526711 && Math["floor"](_0xbd7fb0["right"] / _0x277b4c) >= _0x5e9e16 && Math["floor"](_0xbd7fb0['y'] / _0x277b4c) <= _0x1d60bc && Math["floor"](_0xbd7fb0["bottom"] / _0x277b4c) >= _0xc95c26) {
      _0x3e55cc["add"](_0x1aeaf5);
    }
  }
  if (!_0x3967d7) {
    for (let _0x955261 = _0x5e9e16; _0x955261 <= _0x526711; _0x955261 += 0x1) {
      for (let _0x460d27 = _0xc95c26; _0x460d27 <= _0x1d60bc; _0x460d27 += 0x1) {
        const _0xc7a15a = _0x15275a["boundsCells"]['get'](getNodeSpatialCellKey(_0x955261, _0x460d27));
        if (!_0xc7a15a || _0xc7a15a['length'] === 0x0) {
          continue;
        }
        for (const _0x3dc66d of _0xc7a15a) {
          _0x3e55cc["add"](_0x3dc66d);
        }
      }
    }
  }
  if (_0x3e55cc["size"] === 0x0) {
    return EMPTY_NODE_SPATIAL_QUERY_RESULT;
  }
  return Array["from"](_0x3e55cc)["sort"]((_0x5738cf, _0xc95cc2) => {
    const _0x5e52d4 = _0x15275a["nodeRects"]["get"](_0x5738cf)?.["order"] ?? Infinity;
    const _0x2ed73f = _0x15275a["nodeRects"]["get"](_0xc95cc2)?.["order"] ?? Infinity;
    return _0x5e52d4 - _0x2ed73f;
  });
}
export function getNodeScreenRect(_0x1cf84e, _0x472e22) {
  const {
    x: _0x3ae326,
    y: _0x3d4f46,
    zoom: _0x11bb23
  } = _0x472e22;
  const _0x4a7374 = getViewportScreenOrigin(_0x472e22);
  const _0x2cbb01 = _0x1cf84e['x'] * _0x11bb23 + _0x3ae326 + _0x4a7374['x'];
  const _0x36d336 = _0x1cf84e['y'] * _0x11bb23 + _0x3d4f46 + _0x4a7374['y'];
  const _0x17e562 = (_0x1cf84e["width"] || 0x0) * _0x11bb23;
  const _0x11ff88 = (_0x1cf84e['height'] || 0x0) * _0x11bb23;
  return {
    'left': _0x2cbb01,
    'top': _0x36d336,
    'right': _0x2cbb01 + _0x17e562,
    'bottom': _0x36d336 + _0x11ff88,
    'cx': _0x2cbb01 + _0x17e562 / 0x2,
    'cy': _0x36d336 + _0x11ff88 / 0x2,
    'width': _0x17e562,
    'height': _0x11ff88
  };
}
export function findClosestNode(_0xf27334, _0x1c66c2, _0x95a668, _0x18fc29, _0x183787 = ![], _0x830bed = undefined) {
  const {
    x: _0x5069e9,
    y: _0x189de6
  } = screenToWorld(_0xf27334, _0x1c66c2, _0x18fc29);
  const _0x331959 = normalizeNodeQueryOptions(_0x183787, _0x830bed);
  const _0x54c366 = _0x331959['spatialIndex'] ? queryNodeSpatialIndexAtWorldPoint(_0x331959["spatialIndex"], _0x5069e9, _0x189de6) : null;
  if (_0x54c366) {
    for (const _0x1f3f45 of _0x54c366) {
      const _0x2eeb65 = _0x95a668?.[_0x1f3f45];
      if (!_0x2eeb65) {
        continue;
      }
      if (_0x331959['ignoreGroup'] && _0x2eeb65?.["type"] === "group") {
        continue;
      }
      if (_0x331959["candidateFilter"] && _0x331959["candidateFilter"](_0x2eeb65, _0x1f3f45) === ![]) {
        continue;
      }
      const _0x4edc46 = resolveNodeQueryRect(_0x2eeb65, _0x1f3f45, _0x331959["resolveRect"], _0x331959["spatialIndex"]);
      if (!_0x4edc46) {
        continue;
      }
      if (!isPointInRect(_0x5069e9, _0x189de6, _0x4edc46['x'], _0x4edc46['y'], _0x4edc46["width"], _0x4edc46["height"])) {
        continue;
      }
      return {
        'nodeId': _0x1f3f45,
        'screenRect': getNodeScreenRect(_0x4edc46, _0x18fc29),
        'isInside': !![]
      };
    }
    const _0x41ed72 = findNearestNodeRectInSpatialIndex(_0x331959["spatialIndex"], _0x95a668, _0x5069e9, _0x189de6, _0x331959);
    return _0x41ed72 ? {
      'nodeId': _0x41ed72["nodeId"],
      'screenRect': getNodeScreenRect(_0x41ed72["rect"], _0x18fc29),
      'isInside': ![]
    } : null;
  }
  let _0x488f7e = null;
  let _0x20ae13 = null;
  let _0x12f7fc = Infinity;
  for (const [_0x24610a, _0x7f1398] of Object['entries'](_0x95a668 || {})) {
    const _0x2d9d19 = String(_0x7f1398?.['id'] || _0x24610a || '')["trim"]();
    if (!_0x2d9d19) {
      continue;
    }
    if (_0x331959["ignoreGroup"] && _0x7f1398?.["type"] === 'group') {
      continue;
    }
    if (_0x331959["candidateFilter"] && _0x331959['candidateFilter'](_0x7f1398, _0x2d9d19) === ![]) {
      continue;
    }
    const _0x19a104 = resolveNodeQueryRect(_0x7f1398, _0x2d9d19, _0x331959["resolveRect"], _0x331959["spatialIndex"]);
    if (!_0x19a104) {
      continue;
    }
    const _0x237f75 = isPointInRect(_0x5069e9, _0x189de6, _0x19a104['x'], _0x19a104['y'], _0x19a104["width"], _0x19a104["height"]);
    if (_0x237f75) {
      return {
        'nodeId': _0x2d9d19,
        'screenRect': getNodeScreenRect(_0x19a104, _0x18fc29),
        'isInside': !![]
      };
    }
    const _0x4fd29c = _0x5069e9 - _0x19a104['cx'];
    const _0x48ed6b = _0x189de6 - _0x19a104['cy'];
    const _0x82bd9e = _0x4fd29c * _0x4fd29c + _0x48ed6b * _0x48ed6b;
    _0x82bd9e < _0x12f7fc && (_0x12f7fc = _0x82bd9e, _0x488f7e = _0x2d9d19, _0x20ae13 = _0x19a104);
  }
  return _0x488f7e ? {
    'nodeId': _0x488f7e,
    'screenRect': getNodeScreenRect(_0x20ae13, _0x18fc29),
    'isInside': ![]
  } : null;
}
export function hitTestNode(_0x2d7ba4, _0x58e62d, _0x21ec80, _0xe5b9a8, _0x18d142, _0x5f4ca2 = ![], _0x384f2b = undefined) {
  const {
    x: _0x1355b2,
    y: _0x266961
  } = screenToWorld(_0x2d7ba4, _0x58e62d, _0xe5b9a8);
  const _0x8ac6c6 = normalizeNodeQueryOptions(_0x5f4ca2, _0x384f2b);
  const _0x484ae9 = new Set();
  const _0x2266c1 = String(_0x18d142 || '')["trim"]();
  if (_0x2266c1) {
    _0x484ae9["add"](_0x2266c1);
  }
  if (_0x8ac6c6["excludeIds"] && typeof _0x8ac6c6["excludeIds"] !== "string" && typeof _0x8ac6c6["excludeIds"][Symbol["iterator"]] === "function") {
    for (const _0x45e289 of _0x8ac6c6["excludeIds"]) {
      const _0x1697f8 = String(_0x45e289 || '')["trim"]();
      if (_0x1697f8) {
        _0x484ae9["add"](_0x1697f8);
      }
    }
  }
  let _0x5852a0 = null;
  let _0x3c3696 = null;
  const _0x152f0b = _0x8ac6c6['spatialIndex'] ? queryNodeSpatialIndexAtWorldPoint(_0x8ac6c6["spatialIndex"], _0x1355b2, _0x266961) : null;
  const _0x3336a2 = (_0x49201f, _0x2a194b) => {
    if (_0x484ae9['has'](_0x49201f)) {
      return;
    }
    if (_0x8ac6c6["ignoreGroup"] && _0x2a194b?.["type"] === "group") {
      return;
    }
    if (_0x8ac6c6["candidateFilter"] && _0x8ac6c6["candidateFilter"](_0x2a194b, _0x49201f) === ![]) {
      return;
    }
    const _0x457422 = resolveNodeQueryRect(_0x2a194b, _0x49201f, _0x8ac6c6["resolveRect"], _0x8ac6c6["spatialIndex"]);
    if (!_0x457422) {
      return;
    }
    if (!isPointInRect(_0x1355b2, _0x266961, _0x457422['x'], _0x457422['y'], _0x457422["width"], _0x457422["height"])) {
      return;
    }
    _0x2a194b?.["type"] === "group" ? _0x5852a0 = _0x49201f : _0x3c3696 = _0x49201f;
  };
  if (_0x152f0b) {
    for (const _0x222c34 of _0x152f0b) {
      const _0x4611f5 = _0x21ec80?.[_0x222c34];
      if (!_0x4611f5) {
        continue;
      }
      _0x3336a2(_0x222c34, _0x4611f5);
    }
    return _0x3c3696 || _0x5852a0 || null;
  }
  for (const [_0x2d508d, _0x3156b9] of Object["entries"](_0x21ec80 || {})) {
    const _0x554b1d = String(_0x3156b9?.['id'] || _0x2d508d || '')["trim"]();
    if (!_0x554b1d) {
      continue;
    }
    _0x3336a2(_0x554b1d, _0x3156b9);
  }
  return _0x3c3696 || _0x5852a0 || null;
}
export function checkLineIntersection(_0x339f34, _0x5f4b0c, _0x47330c, _0x4b99cf, _0x46f82b, _0x138f66, _0x852681, _0x3050e2) {
  let _0x1a3036 = _0x47330c - _0x339f34;
  let _0xc87bc1 = _0x4b99cf - _0x5f4b0c;
  let _0x2c7df6 = _0x852681 - _0x46f82b;
  let _0x4f3ef5 = _0x3050e2 - _0x138f66;
  let _0x27e3c7 = -_0x2c7df6 * _0xc87bc1 + _0x1a3036 * _0x4f3ef5;
  if (_0x27e3c7 === 0x0) {
    return ![];
  }
  let _0x18c2e7 = (-_0xc87bc1 * (_0x339f34 - _0x46f82b) + _0x1a3036 * (_0x5f4b0c - _0x138f66)) / _0x27e3c7;
  let _0x5b94b0 = (_0x2c7df6 * (_0x5f4b0c - _0x138f66) - _0x4f3ef5 * (_0x339f34 - _0x46f82b)) / _0x27e3c7;
  return _0x18c2e7 >= 0x0 && _0x18c2e7 <= 0x1 && _0x5b94b0 >= 0x0 && _0x5b94b0 <= 0x1;
}
export function checkBBoxIntersection(_0x536815, _0x5869d0, _0x24d0ab, _0x5a57fe, _0x33a3b6, _0x310b75, _0x30a83e, _0x19ea10) {
  const _0x42ad27 = Math["min"](_0x536815, _0x24d0ab);
  const _0x4165cd = Math["max"](_0x536815, _0x24d0ab);
  const _0x4b3181 = Math["min"](_0x5869d0, _0x5a57fe);
  const _0x29366a = Math["max"](_0x5869d0, _0x5a57fe);
  const _0x614700 = Math["min"](_0x33a3b6, _0x30a83e);
  const _0x5a89ed = Math['max'](_0x33a3b6, _0x30a83e);
  const _0x4642a8 = Math["min"](_0x310b75, _0x19ea10);
  const _0x1f0485 = Math["max"](_0x310b75, _0x19ea10);
  return !(_0x4165cd < _0x614700 || _0x5a89ed < _0x42ad27 || _0x29366a < _0x4642a8 || _0x1f0485 < _0x4b3181);
}
export * from './panoramaSceneMath.js';
export { resolveNormalizedMediaCrop, normalizedMediaDragRect } from './mediaSelectionMath.js';