const DEFAULT_CELL_SIZE = 0x400;
const DEFAULT_NODE_WIDTH = 0xa0;
const DEFAULT_NODE_HEIGHT = 0x78;
let cachedSpatialIndexSignature = '';
let cachedSpatialIndex = null;
function finiteNumber(_0x1418b0, _0x20f180 = 0x0) {
  const _0x205b74 = Number(_0x1418b0);
  return Number['isFinite'](_0x205b74) ? _0x205b74 : _0x20f180;
}
function normalizeNodeBounds(_0x31b39b) {
  const _0x61c64d = finiteNumber(_0x31b39b?.['x'], 0x0);
  const _0x410574 = finiteNumber(_0x31b39b?.['y'], 0x0);
  const _0x1f53b1 = Math["max"](0x1, finiteNumber(_0x31b39b?.["width"], DEFAULT_NODE_WIDTH));
  const _0x58053e = Math["max"](0x1, finiteNumber(_0x31b39b?.["height"], DEFAULT_NODE_HEIGHT));
  return {
    'minX': _0x61c64d,
    'minY': _0x410574,
    'maxX': _0x61c64d + _0x1f53b1,
    'maxY': _0x410574 + _0x58053e
  };
}
function cellRangeForBounds(_0x3c414a, _0x4ebdd3) {
  return {
    'minCellX': Math['floor'](_0x3c414a["minX"] / _0x4ebdd3),
    'maxCellX': Math["floor"](_0x3c414a["maxX"] / _0x4ebdd3),
    'minCellY': Math['floor'](_0x3c414a["minY"] / _0x4ebdd3),
    'maxCellY': Math["floor"](_0x3c414a["maxY"] / _0x4ebdd3)
  };
}
function cellKey(_0xf2bfd5, _0x41c84f) {
  return _0xf2bfd5 + ':' + _0x41c84f;
}
function intersectsBounds(_0x3570f5, _0x286394) {
  return _0x3570f5['maxX'] > _0x286394['minX'] && _0x3570f5["minX"] < _0x286394['maxX'] && _0x3570f5["maxY"] > _0x286394['minY'] && _0x3570f5["minY"] < _0x286394["maxY"];
}
function getViewportWorldCenter(_0x385f71, _0x202b3e, _0x23aea9) {
  const _0x3dc268 = screenViewportToWorldBounds({
    'viewport': _0x385f71,
    'containerWidth': _0x202b3e,
    'containerHeight': _0x23aea9,
    'padding': 0x0
  });
  return {
    'x': (_0x3dc268["minX"] + _0x3dc268['maxX']) / 0x2,
    'y': (_0x3dc268['minY'] + _0x3dc268["maxY"]) / 0x2
  };
}
function getNodeDistanceSqToCenter(_0x3025b0, _0x15d8f7) {
  if (!_0x3025b0 || !_0x15d8f7) {
    return 0x0;
  }
  const _0x4e2e63 = normalizeNodeBounds(_0x3025b0);
  const _0x53c01b = (_0x4e2e63['minX'] + _0x4e2e63['maxX']) / 0x2;
  const _0x462938 = (_0x4e2e63["minY"] + _0x4e2e63["maxY"]) / 0x2;
  const _0x2c0c53 = _0x53c01b - _0x15d8f7['x'];
  const _0x258cad = _0x462938 - _0x15d8f7['y'];
  return _0x2c0c53 * _0x2c0c53 + _0x258cad * _0x258cad;
}
export function screenViewportToWorldBounds({
  viewport: _0x13c9fa,
  containerWidth: _0x2a25bf,
  containerHeight: _0x456375,
  padding = 0x0
} = {}) {
  const _0x4c2a0b = Math["max"](0.0001, finiteNumber(_0x13c9fa?.['zoom'], 0x1));
  const _0x3ebb49 = finiteNumber(_0x13c9fa?.['x'], 0x0);
  const _0x16a1cb = finiteNumber(_0x13c9fa?.['y'], 0x0);
  const _0x28a6ac = Math["max"](0x1, finiteNumber(_0x2a25bf, 0x1));
  const _0x56a1f7 = Math['max'](0x1, finiteNumber(_0x456375, 0x1));
  const _0x353b84 = Math['max'](0x0, finiteNumber(padding, 0x0));
  return {
    'minX': (-_0x353b84 - _0x3ebb49) / _0x4c2a0b,
    'minY': (-_0x353b84 - _0x16a1cb) / _0x4c2a0b,
    'maxX': (_0x28a6ac + _0x353b84 - _0x3ebb49) / _0x4c2a0b,
    'maxY': (_0x56a1f7 + _0x353b84 - _0x16a1cb) / _0x4c2a0b
  };
}
export function createRendererSpatialIndex(_0x3dbe29, {
  cellSize = DEFAULT_CELL_SIZE
} = {}) {
  const _0x1bcb0f = _0x3dbe29 || {};
  const _0x154775 = Object['values'](_0x1bcb0f);
  const _0x403419 = new Map();
  const _0x41ce77 = new Map();
  const _0x4866de = new Set();
  const _0xd9a9ca = new Set();
  const _0x12ce54 = Math["max"](0x80, finiteNumber(cellSize, DEFAULT_CELL_SIZE));
  let _0x1bb3ee = 0x0;
  for (const _0x153840 of _0x154775) {
    const _0xbae3c4 = String(_0x153840?.['id'] || '')['trim']();
    if (!_0xbae3c4) {
      continue;
    }
    const _0x3b8038 = normalizeNodeBounds(_0x153840);
    const _0x206c61 = cellRangeForBounds(_0x3b8038, _0x12ce54);
    _0x41ce77['set'](_0xbae3c4, {
      'node': _0x153840,
      'bounds': _0x3b8038,
      'order': _0x1bb3ee
    });
    _0x1bb3ee += 0x1;
    _0x4866de["add"](_0xbae3c4);
    if ((_0x206c61["maxCellX"] - _0x206c61["minCellX"] + 0x1) * (_0x206c61["maxCellY"] - _0x206c61["minCellY"] + 0x1) > 0x40) {
      _0xd9a9ca['add'](_0xbae3c4);
      continue;
    }
    for (let _0x49463b = _0x206c61["minCellX"]; _0x49463b <= _0x206c61["maxCellX"]; _0x49463b += 0x1) {
      for (let _0x514e3a = _0x206c61["minCellY"]; _0x514e3a <= _0x206c61["maxCellY"]; _0x514e3a += 0x1) {
        const _0x1f7a69 = cellKey(_0x49463b, _0x514e3a);
        let _0x108173 = _0x403419["get"](_0x1f7a69);
        !_0x108173 && (_0x108173 = new Set(), _0x403419['set'](_0x1f7a69, _0x108173));
        _0x108173["add"](_0xbae3c4);
      }
    }
  }
  return {
    'nodeSource': _0x1bcb0f,
    'cellSize': _0x12ce54,
    'cells': _0x403419,
    'nodesById': _0x41ce77,
    'nodeIds': _0x4866de,
    'spanningIds': _0xd9a9ca,
    'nodeCount': _0x4866de["size"]
  };
}
export function getRendererSpatialIndexNode(_0x454912, _0x309e6c) {
  const _0x1960f9 = _0x454912?.['nodeSource'];
  if (_0x1960f9 instanceof Map) {
    return _0x1960f9['get'](_0x309e6c);
  }
  if (_0x1960f9 && typeof _0x1960f9 === "object" && !Array["isArray"](_0x1960f9)) {
    return _0x1960f9[_0x309e6c];
  }
  return _0x454912?.["nodesById"]?.['get']?.(_0x309e6c)?.["node"];
}
export function queryRendererSpatialIndex(_0x46d92e, _0x5da26b, {
  preserveOrder = !![]
} = {}) {
  if (!_0x46d92e || !_0x5da26b) {
    return [];
  }
  const _0x3ce2ec = cellRangeForBounds(_0x5da26b, _0x46d92e["cellSize"] || DEFAULT_CELL_SIZE);
  const _0x3d50ad = new Set();
  const _0x53180a = [];
  const _0xbbe721 = (_0x3ce2ec["maxCellX"] - _0x3ce2ec["minCellX"] + 0x1) * (_0x3ce2ec["maxCellY"] - _0x3ce2ec["minCellY"] + 0x1);
  const _0x43f337 = _0x361a17 => {
    if (_0x3d50ad["has"](_0x361a17)) {
      return;
    }
    _0x3d50ad["add"](_0x361a17);
    const _0x40da42 = _0x46d92e["nodesById"]?.["get"]?.(_0x361a17);
    if (!_0x40da42 || !intersectsBounds(_0x40da42["bounds"], _0x5da26b)) {
      return;
    }
    const _0xef9313 = getRendererSpatialIndexNode(_0x46d92e, _0x361a17);
    if (_0xef9313) {
      _0x53180a["push"](_0xef9313);
    }
  };
  const _0x29579e = _0xbbe721 > Math["max"](0x40, _0x46d92e["nodeCount"]);
  if (_0x29579e) {
    for (const _0x709d66 of _0x46d92e["nodeIds"]) {
      _0x43f337(_0x709d66);
    }
  } else {
    for (let _0x20a97f = _0x3ce2ec["minCellX"]; _0x20a97f <= _0x3ce2ec['maxCellX']; _0x20a97f += 0x1) {
      for (let _0x16325b = _0x3ce2ec["minCellY"]; _0x16325b <= _0x3ce2ec["maxCellY"]; _0x16325b += 0x1) {
        const _0x328718 = _0x46d92e["cells"]?.['get']?.(cellKey(_0x20a97f, _0x16325b));
        if (!_0x328718) {
          continue;
        }
        for (const _0x3bde8f of _0x328718) {
          _0x43f337(_0x3bde8f);
        }
      }
    }
    for (const _0x56b78e of _0x46d92e["spanningIds"] || []) {
      _0x43f337(_0x56b78e);
    }
  }
  if (preserveOrder && (_0x29579e || _0x46d92e["spanningIds"]?.["size"])) {
    _0x53180a["sort"]((_0x474ce5, _0x4e3d69) => {
      const _0x3fa0e5 = _0x46d92e['nodesById']["get"](_0x474ce5['id']);
      const _0x3bd79a = _0x46d92e['nodesById']['get'](_0x4e3d69['id']);
      const _0x29ecec = cellRangeForBounds(_0x3fa0e5['bounds'], _0x46d92e["cellSize"]);
      const _0x215162 = cellRangeForBounds(_0x3bd79a["bounds"], _0x46d92e['cellSize']);
      return Math["max"](_0x3ce2ec["minCellX"], _0x29ecec['minCellX']) - Math["max"](_0x3ce2ec["minCellX"], _0x215162["minCellX"]) || Math["max"](_0x3ce2ec['minCellY'], _0x29ecec["minCellY"]) - Math["max"](_0x3ce2ec['minCellY'], _0x215162['minCellY']) || _0x3fa0e5["order"] - _0x3bd79a["order"];
    });
  }
  return _0x53180a;
}
export function queryRendererSpatialIndexIds(_0x3a3822, _0x9284f9) {
  const _0x30747e = _0x3a3822?.["frameQueryCache"];
  if (!_0x30747e || !_0x9284f9) {
    return new Set(queryRendererSpatialIndex(_0x3a3822, _0x9284f9, {
      'preserveOrder': ![]
    })["map"](_0x26c8b7 => _0x26c8b7['id']));
  }
  const _0x7ebec1 = _0x9284f9["minX"] + '|' + _0x9284f9["minY"] + '|' + _0x9284f9["maxX"] + '|' + _0x9284f9["maxY"];
  if (!_0x30747e["has"](_0x7ebec1)) {
    _0x30747e["set"](_0x7ebec1, queryRendererSpatialIndex(_0x3a3822, _0x9284f9, {
      'preserveOrder': ![]
    })["map"](_0x475741 => _0x475741['id']));
  }
  return new Set(_0x30747e["get"](_0x7ebec1));
}
export function clearRendererSpatialIndexCache() {
  cachedSpatialIndexSignature = '';
  cachedSpatialIndex = null;
}
export function getCachedRendererSpatialIndex(_0x1a9be8, {
  geometryRev: _0xc7e7ae,
  nodeCount: _0x205b55,
  denseNodeCount = 0x50
} = {}) {
  const _0x7ecff3 = Number["isFinite"](_0x205b55) ? _0x205b55 : Object["keys"](_0x1a9be8 || {})["length"];
  if (_0x7ecff3 < denseNodeCount) {
    clearRendererSpatialIndexCache();
    return null;
  }
  const _0x101c4f = (Number["isFinite"](_0xc7e7ae) ? _0xc7e7ae : 0x0) + '|' + _0x7ecff3;
  if (cachedSpatialIndex && cachedSpatialIndexSignature === _0x101c4f) {
    cachedSpatialIndex["nodeSource"] = _0x1a9be8 || {};
    return cachedSpatialIndex;
  }
  cachedSpatialIndex = createRendererSpatialIndex(_0x1a9be8);
  cachedSpatialIndexSignature = _0x101c4f;
  return cachedSpatialIndex;
}
export function collectVirtualizedRenderNodes({
  nodes: _0x52e0bc,
  virtualizationResult: _0x132135,
  spatialIndex: _0x4c4cf6,
  mountedNodeIds: _0x1e6e29,
  viewport: _0x2a269e,
  containerWidth: _0x4d8f5b,
  containerHeight: _0x54d5d5
} = {}) {
  if (!_0x4c4cf6) {
    return Object["values"](_0x52e0bc || {});
  }
  const _0x1e8eee = new Set();
  for (const _0x4325c7 of _0x132135?.['mountCandidateIds'] || []) {
    _0x1e8eee["add"](_0x4325c7);
  }
  const _0x7bfce8 = _0x1e6e29 instanceof Set ? _0x1e6e29 : Array['isArray'](_0x1e6e29) ? _0x1e6e29 : [];
  for (const _0x5934c5 of _0x7bfce8) {
    _0x1e8eee["add"](_0x5934c5);
  }
  const _0x4db8cb = [];
  for (const _0x3d7cb8 of _0x1e8eee) {
    const _0x4c5d85 = _0x52e0bc?.[_0x3d7cb8];
    if (_0x4c5d85?.['id']) {
      _0x4db8cb["push"](_0x4c5d85);
    }
  }
  const _0x51537c = _0x2a269e && Number["isFinite"](Number(_0x4d8f5b)) && Number["isFinite"](Number(_0x54d5d5));
  if (!_0x51537c || _0x4db8cb["length"] < 0x2) {
    return _0x4db8cb;
  }
  const _0x32804a = getViewportWorldCenter(_0x2a269e, _0x4d8f5b, _0x54d5d5);
  const _0x29e82d = _0x132135?.["mountCandidateIds"] || new Set();
  const _0x1b2bce = _0x132135?.["keepAliveNodeIds"] || new Set();
  return _0x4db8cb['sort']((_0x363570, _0x579d7e) => {
    const _0x3dfed0 = String(_0x363570?.['id'] || '');
    const _0xd0c392 = String(_0x579d7e?.['id'] || '');
    const _0x39d2d5 = _0x29e82d['has'](_0x3dfed0);
    const _0x53d6e3 = _0x29e82d['has'](_0xd0c392);
    if (_0x39d2d5 !== _0x53d6e3) {
      return _0x39d2d5 ? -0x1 : 0x1;
    }
    const _0x5768e0 = _0x1b2bce['has'](_0x3dfed0);
    const _0x2e29b7 = _0x1b2bce['has'](_0xd0c392);
    if (_0x5768e0 !== _0x2e29b7) {
      return _0x5768e0 ? -0x1 : 0x1;
    }
    const _0x2baff2 = getNodeDistanceSqToCenter(_0x363570, _0x32804a) - getNodeDistanceSqToCenter(_0x579d7e, _0x32804a);
    if (_0x2baff2 !== 0x0) {
      return _0x2baff2;
    }
    return (_0x4c4cf6['nodesById']?.["get"]?.(_0x3dfed0)?.["order"] ?? 0x0) - (_0x4c4cf6["nodesById"]?.["get"]?.(_0xd0c392)?.["order"] ?? 0x0);
  });
}