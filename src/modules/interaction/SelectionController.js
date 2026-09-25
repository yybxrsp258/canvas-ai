import { addEdgeWithPolicies } from './EdgeController.js';
import { beginSelectionBoxPreview, cancelSelectionBoxPreview, updateSelectionBoxPreview } from '../../core/selectionBoxPreview.js';
import { createNodeSpatialIndex, queryNodeSpatialIndexInRect } from '../../core/math.js';
export function createSelectionController({
  store: _0xa50c2b,
  screenToWorld: _0x241753,
  isNodeType: _0x4f260f,
  isValidConnection: _0x16b04b
}) {
  const _0x4dccc9 = {
    'nodes': null,
    'persistRev': -0x1,
    'index': null
  };
  function _0xdfe6e() {
    return typeof _0xa50c2b["getStateRaw"] === "function" ? _0xa50c2b['getStateRaw']() : _0xa50c2b["getState"]();
  }
  function _0x28b1c3(_0xc12f67) {
    const _0x10f7e7 = _0xc12f67?.["nodes"];
    if (!_0x10f7e7 || typeof _0x10f7e7 !== "object") {
      return null;
    }
    const _0x11f3fa = _0xc12f67?.["_nodeGeometryRev"] ?? _0xc12f67?.['_persistRev'] ?? -0x1;
    if (_0x4dccc9["nodes"] === _0x10f7e7 && _0x4dccc9['persistRev'] === _0x11f3fa) {
      return _0x4dccc9['index'];
    }
    const _0x2247b3 = createNodeSpatialIndex(_0x10f7e7, {
      'resolveRect'(_0x32b216) {
        if (!_0x32b216 || typeof _0x32b216 !== "object") {
          return null;
        }
        return {
          'x': _0x32b216['x'],
          'y': _0x32b216['y'],
          'width': _0x32b216["width"] || 0x104,
          'height': _0x32b216["height"] || 0x64
        };
      }
    });
    _0x4dccc9["nodes"] = _0x10f7e7;
    _0x4dccc9["persistRev"] = _0x11f3fa;
    _0x4dccc9["index"] = _0x2247b3;
    return _0x2247b3;
  }
  function _0xb45d8(_0x2fec63, _0x525ca6) {
    const _0x49bb2e = _0x2fec63?.['nodes'] || {};
    const _0x5cf9f5 = _0x28b1c3(_0x2fec63);
    if (!_0x5cf9f5) {
      return Object['values'](_0x49bb2e);
    }
    const _0x46525d = queryNodeSpatialIndexInRect(_0x5cf9f5, _0x525ca6);
    return _0x46525d["map"](_0x559a8b => _0x49bb2e[_0x559a8b])['filter'](Boolean);
  }
  function _0x2e72d0(_0x39de27, _0x4c4d82, _0x229cb6) {
    _0x39de27["isBoxSelecting"] = !![];
    _0x39de27["boxStartX"] = _0x4c4d82;
    _0x39de27["boxStartY"] = _0x229cb6;
    _0x39de27["_boxSelectionActivated"] = ![];
    cancelSelectionBoxPreview();
  }
  function _0x505eda(_0x3200b6, _0x5881f2, _0x1ecaba) {
    const _0x1f5f85 = {
      'x1': Math['min'](_0x3200b6['boxStartX'], _0x5881f2),
      'y1': Math['min'](_0x3200b6["boxStartY"], _0x1ecaba),
      'x2': Math["max"](_0x3200b6["boxStartX"], _0x5881f2),
      'y2': Math["max"](_0x3200b6['boxStartY'], _0x1ecaba)
    };
    if (!_0x3200b6["_boxSelectionActivated"]) {
      const _0xb667d5 = Math['hypot'](_0x5881f2 - _0x3200b6["boxStartX"], _0x1ecaba - _0x3200b6["boxStartY"]);
      _0xb667d5 > 0x3 && (_0x3200b6["_boxSelectionActivated"] = !![], beginSelectionBoxPreview({
        'active': !![],
        ..._0x1f5f85
      }));
    }
    _0x3200b6["_boxSelectionActivated"] && updateSelectionBoxPreview({
      'active': !![],
      ..._0x1f5f85
    });
  }
  function _0x4e8d1d(_0xc77dca, _0x597aaf, _0xa704d) {
    cancelSelectionBoxPreview();
    const _0x26c3ab = _0xdfe6e();
    const _0x11c36 = _0x26c3ab['pickConnectMode'];
    const {
      viewport: _0x3f6ae6,
      nodes: _0x316f18
    } = _0x26c3ab;
    const {
      boxStartX: _0x5b7fbf,
      boxStartY: _0x57e458
    } = _0xc77dca;
    if (!Number["isFinite"](_0x5b7fbf) || !Number["isFinite"](_0x57e458) || !Number["isFinite"](_0x597aaf) || !Number['isFinite'](_0xa704d)) {
      _0xa50c2b["setSelectionBox"]({
        'active': ![]
      });
      _0xc77dca["isBoxSelecting"] = ![];
      return {
        'earlyReturn': ![],
        'didAct': ![]
      };
    }
    const _0x362c8d = Math["min"](_0x5b7fbf, _0x597aaf);
    const _0x304527 = Math["max"](_0x5b7fbf, _0x597aaf);
    const _0xfc739f = Math['min'](_0x57e458, _0xa704d);
    const _0x59b6dd = Math['max'](_0x57e458, _0xa704d);
    const {
      x: _0x1ab920,
      y: _0x3586f6
    } = _0x241753(_0x362c8d, _0xfc739f, _0x3f6ae6);
    const {
      x: _0xa8cec4,
      y: _0x2c9f15
    } = _0x241753(_0x304527, _0x59b6dd, _0x3f6ae6);
    if (!Number["isFinite"](_0x1ab920) || !Number["isFinite"](_0x3586f6) || !Number["isFinite"](_0xa8cec4) || !Number['isFinite'](_0x2c9f15)) {
      _0xa50c2b['setSelectionBox']({
        'active': ![]
      });
      _0xc77dca['isBoxSelecting'] = ![];
      return {
        'earlyReturn': ![],
        'didAct': ![]
      };
    }
    if (!_0x11c36?.["active"] && _0x26c3ab["connOverlay"]?.["srcId"]) {
      _0xa50c2b["setSelectionBox"]({
        'active': ![]
      });
      _0xc77dca["isBoxSelecting"] = ![];
      return {
        'earlyReturn': ![],
        'didAct': ![]
      };
    }
    if (_0x11c36 && _0x11c36['active']) {
      const _0x35e909 = () => {
        for (const _0x4ba485 of _0xb45d8(_0x26c3ab, {
          'x': _0x1ab920,
          'y': _0x3586f6,
          'width': _0xa8cec4 - _0x1ab920,
          'height': _0x2c9f15 - _0x3586f6
        })) {
          if (_0x4ba485['id'] === _0x11c36["sourceNodeId"] || _0x4f260f(_0x4ba485, "group")) {
            continue;
          }
          const _0x36db98 = _0x4ba485['x'] + (_0x4ba485['width'] || 0x104) / 0x2;
          const _0x14c18c = _0x4ba485['y'] + (_0x4ba485["height"] || 0x64) / 0x2;
          if (_0x36db98 >= _0x1ab920 && _0x36db98 <= _0xa8cec4 && _0x14c18c >= _0x3586f6 && _0x14c18c <= _0x2c9f15) {
            const _0x59b742 = _0x11c36["handleDirection"] === "left";
            const _0x1aa413 = _0x59b742 ? _0x4ba485['id'] : _0x11c36["sourceNodeId"];
            const _0x236ee2 = _0x59b742 ? _0x11c36["sourceNodeId"] : _0x4ba485['id'];
            if (_0x316f18[_0x1aa413] && _0x316f18[_0x1aa413]["type"] === "group") {
              continue;
            }
            if (!_0x16b04b(_0x316f18[_0x1aa413], _0x316f18[_0x236ee2])) {
              continue;
            }
            addEdgeWithPolicies({
              'sourceId': _0x1aa413,
              'targetId': _0x236ee2
            });
          }
        }
      };
      typeof _0xa50c2b['batch'] === "function" ? _0xa50c2b["batch"](_0x35e909) : _0x35e909();
      _0xa50c2b["setSelectionBox"]({
        'active': ![]
      });
      _0xc77dca["isBoxSelecting"] = ![];
      return {
        'earlyReturn': !![],
        'didAct': !![]
      };
    }
    const _0x30844e = [];
    for (const _0x1e9897 of _0xb45d8(_0x26c3ab, {
      'x': _0x1ab920,
      'y': _0x3586f6,
      'width': _0xa8cec4 - _0x1ab920,
      'height': _0x2c9f15 - _0x3586f6
    })) {
      const _0x489f16 = _0x1e9897['x'] + (_0x1e9897["width"] || 0x104);
      const _0x27addc = _0x1e9897['y'] + (_0x1e9897["height"] || 0x64);
      if (_0x4f260f(_0x1e9897, "group")) {
        const _0x533416 = _0x1e9897['x'] >= _0x1ab920 && _0x489f16 <= _0xa8cec4 && _0x1e9897['y'] >= _0x3586f6 && _0x27addc <= _0x2c9f15;
        if (_0x533416) {
          _0x30844e["push"](_0x1e9897['id']);
        }
      } else {
        const _0x411425 = !(_0x1e9897['x'] > _0xa8cec4 || _0x489f16 < _0x1ab920 || _0x1e9897['y'] > _0x2c9f15 || _0x27addc < _0x3586f6);
        if (_0x411425) {
          _0x30844e['push'](_0x1e9897['id']);
        }
      }
    }
    _0xa50c2b["setSelectionMeta"]({
      'source': "box"
    });
    _0xa50c2b["setSelectedNodes"](_0x30844e);
    _0xa50c2b["setSelectionBox"]({
      'active': ![]
    });
    _0xc77dca["isBoxSelecting"] = ![];
    return {
      'earlyReturn': ![],
      'didAct': !![]
    };
  }
  return {
    'startBoxSelecting': _0x2e72d0,
    'updateBoxSelecting': _0x505eda,
    'finishBoxSelecting': _0x4e8d1d
  };
}