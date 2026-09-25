import a526_0x14b359 from '../../core/stores/appStore.js';
import { generateId } from '../../core/math.js';
import { buildStoryboardCropRect } from '../../core/storyboardCellUtils.js';
import { commit } from '../../modules/history.js';
import { saveOutputBlob } from '../../modules/project.js';
import { buildCanvasLocalImageFields } from '../../services/canvasMediaLocalService.js';
import { drawStoryboardComposeAsset } from '../../modules/storyboard/storyboardComposeDraw.js';
import { buildSourceMediaNodePayload, getAutoMediaSizeByShortSide } from '../../services/fileService.js';
const COMPOSE_CANVAS_WIDTH = 0x800;
function getStoryboardCells(_0x507b4c) {
  return Array['isArray'](_0x507b4c?.["cells"]) ? _0x507b4c["cells"] : [];
}
function getCssValue(_0x4614ae, _0x43e4b7) {
  if (typeof getComputedStyle !== "function") {
    return _0x43e4b7;
  }
  const _0x7f5dcf = getComputedStyle(document['documentElement'])["getPropertyValue"](_0x4614ae)["trim"]();
  return _0x7f5dcf || _0x43e4b7;
}
function parseAspectRatio(_0x1182fe) {
  const _0x5cbeed = String(_0x1182fe || "1:1");
  const [_0x58f527, _0x33041e] = _0x5cbeed["split"](':')['map'](Number);
  const _0x146f54 = Number["isFinite"](_0x58f527) && _0x58f527 > 0x0 ? _0x58f527 : 0x1;
  const _0x2f7f9f = Number["isFinite"](_0x33041e) && _0x33041e > 0x0 ? _0x33041e : 0x1;
  return {
    'aspectStr': _0x5cbeed,
    'rw': _0x146f54,
    'rh': _0x2f7f9f
  };
}
function createComposeImageLoader() {
  const _0x58cb51 = new Map();
  return async _0x5d742e => {
    const _0x31fb9c = String(_0x5d742e || '')["trim"]();
    if (!_0x31fb9c) {
      return null;
    }
    if (_0x58cb51["has"](_0x31fb9c)) {
      return _0x58cb51['get'](_0x31fb9c);
    }
    const _0x44402c = new Promise(_0x26f3a8 => {
      const _0x4f50f7 = new Image();
      _0x4f50f7["crossOrigin"] = "anonymous";
      _0x4f50f7["onload"] = () => _0x26f3a8(_0x4f50f7);
      _0x4f50f7["onerror"] = () => _0x26f3a8(null);
      _0x4f50f7["src"] = _0x31fb9c;
    });
    _0x58cb51["set"](_0x31fb9c, _0x44402c);
    return _0x44402c;
  };
}
function setComposeButtonBusy(_0x3ecfe5) {
  if (!_0x3ecfe5) {
    return () => {};
  }
  const _0x205f16 = Array['from'](_0x3ecfe5["childNodes"])["map"](_0x5b478c => _0x5b478c['cloneNode'](!![]));
  const _0x1fa8dc = _0x3ecfe5["dataset"]["tooltip"];
  _0x3ecfe5['replaceChildren']();
  _0x3ecfe5['dataset']["tooltip"] = '合成中...';
  const _0x3f6dc8 = "http://www.w3.org/2000/svg";
  const _0x354f7c = document["createElementNS"](_0x3f6dc8, 'svg');
  _0x354f7c["classList"]['add']("v2-spinning");
  _0x354f7c["setAttribute"]("width", '14');
  _0x354f7c['setAttribute']('height', '14');
  _0x354f7c["setAttribute"]('viewBox', "0 0 24 24");
  _0x354f7c["setAttribute"]("fill", "none");
  _0x354f7c["setAttribute"]('stroke', "currentColor");
  _0x354f7c["setAttribute"]("stroke-width", '2');
  const _0x58c11e = document["createElementNS"](_0x3f6dc8, "path");
  _0x58c11e['setAttribute']('d', "M21 12a9 9 0 1 1-6.219-8.56");
  _0x354f7c['appendChild'](_0x58c11e);
  _0x3ecfe5["appendChild"](_0x354f7c);
  _0x3ecfe5["style"]["pointerEvents"] = "none";
  return () => {
    _0x3ecfe5["replaceChildren"](..._0x205f16["map"](_0x7608c6 => _0x7608c6["cloneNode"](!![])));
    _0x3ecfe5["dataset"]["tooltip"] = _0x1fa8dc;
    _0x3ecfe5["style"]["pointerEvents"] = "auto";
  };
}
function createComposeCanvas(_0x3cd22f) {
  const {
    aspectStr: _0x3494c6,
    rw: _0x40399b,
    rh: _0x1b29d3
  } = parseAspectRatio(_0x3cd22f?.["aspectRatio"]);
  const _0x179716 = document["createElement"]("canvas");
  _0x179716["width"] = COMPOSE_CANVAS_WIDTH;
  _0x179716['height'] = Math["round"](COMPOSE_CANVAS_WIDTH * (_0x1b29d3 / _0x40399b));
  return {
    'aspectStr': _0x3494c6,
    'canvas': _0x179716
  };
}
async function drawBackdrop(_0x1a4ed4, {
  backdropUrl: _0x5e2323,
  canvasW: _0x5ae0ae,
  canvasH: _0x3bccea,
  loadImage: _0x52dad4
}) {
  if (!_0x5e2323) {
    return;
  }
  const _0xbdd51f = await _0x52dad4(_0x5e2323);
  if (!_0xbdd51f) {
    return;
  }
  _0x1a4ed4['drawImage'](_0xbdd51f, 0x0, 0x0, _0xbdd51f["naturalWidth"], _0xbdd51f["naturalHeight"], 0x0, 0x0, _0x5ae0ae, _0x3bccea);
}
function getSourceNodePosition(_0x5c3a23) {
  return {
    'x': _0x5c3a23['x'] + _0x5c3a23["width"] + 0x28,
    'y': _0x5c3a23['y']
  };
}
async function saveComposeCanvas(_0x19161f, _0x2df78b, _0x1f7ffd) {
  const _0x139859 = await new Promise(_0x1b2097 => _0x19161f["toBlob"](_0x1b2097, "image/jpeg", 0.9));
  const _0x4803a8 = generateId("compose");
  const _0x578a31 = "storyboard_compose_" + _0x4803a8 + ".jpg";
  const _0x4cf629 = new File([_0x139859], _0x578a31, {
    'type': 'image/jpeg'
  });
  const _0x3c148b = await saveOutputBlob(_0x4cf629, {
    'ext': 'jpg'
  });
  const _0xd9b6e3 = getAutoMediaSizeByShortSide(_0x19161f["width"], _0x19161f["height"]);
  const _0xde78f2 = generateId('node');
  a526_0x14b359["addNode"](buildSourceMediaNodePayload({
    'id': _0xde78f2,
    'type': 'source-image',
    'x': _0x1f7ffd['x'],
    'y': _0x1f7ffd['y'],
    'width': _0xd9b6e3["width"],
    'height': _0xd9b6e3["height"],
    ...buildCanvasLocalImageFields(_0x3c148b, {
      'includeSrc': !![]
    }),
    'fileName': _0x3c148b["filename"] || _0x578a31,
    'name': "合成分镜_" + _0x2df78b,
    'needsAutoResize': ![]
  }));
  return _0xde78f2;
}
export function getStoryboardComposeCellImageElement(_0x291f52, _0x584ab1) {
  const _0x260ba0 = _0x291f52?.[_0x584ab1] || null;
  if (!_0x260ba0) {
    return null;
  }
  return Array["from"](_0x260ba0['querySelectorAll']?.(".storyboard-cell-img") || [])["find"](_0x2c68f1 => !_0x2c68f1['classList']?.["contains"]?.("storyboard-empty-residual-img") && !_0x2c68f1["classList"]?.["contains"]?.('storyboard-cell-source-cache')) || null;
}
export function getStoryboardComposeCellDisplayUrl({
  cellEls: _0x5b37be,
  cellIndex: _0x5af003,
  getImageElementSource: _0x105495
} = {}) {
  return _0x105495?.(getStoryboardComposeCellImageElement(_0x5b37be, _0x5af003));
}
export async function drawStoryboardComposeCell(_0x4c9df9, {
  cell: _0x55aaf1,
  cellIndex: _0x28873f,
  displayUrl: _0x4b484c,
  imageEl: _0x26fa61,
  target: _0x2602bc,
  loadImage: _0x217070,
  cellEls: _0x17dbee,
  getImageElementSource: _0x155573
}) {
  const _0x48209e = _0x26fa61 || getStoryboardComposeCellImageElement(_0x17dbee, _0x28873f);
  const _0x501019 = _0x4b484c || _0x155573?.(_0x48209e);
  return drawStoryboardComposeAsset(_0x4c9df9, {
    'cell': _0x55aaf1,
    'finalUrl': _0x501019,
    'imageEl': _0x48209e,
    'target': _0x2602bc,
    'loadImage': _0x217070
  });
}
export async function composeStoryboardNode({
  node: _0x11b0ae,
  rootEl: _0x3875ae,
  cellEls: _0x3b44ac,
  isCellEmpty: _0x19ca05,
  getImageElementSource: _0x5304ea,
  getBackdropUrl: _0x114a65,
  markComposing: _0x4c0331
} = {}) {
  const _0x28ba67 = getStoryboardCells(_0x11b0ae);
  const _0xc662a8 = _0x28ba67["some"]((_0x3c9d35, _0x38c2cd) => {
    return !_0x19ca05?.(_0x3c9d35) && getStoryboardComposeCellDisplayUrl({
      'cellEls': _0x3b44ac,
      'cellIndex': _0x38c2cd,
      'getImageElementSource': _0x5304ea
    });
  });
  if (!_0xc662a8) {
    window["showToast"]?.("分镜内没有任何内容可供合成", 'warning');
    return;
  }
  const _0x4fde9a = _0x3875ae?.["querySelector"]?.(".act-compose") || null;
  const _0x2f3622 = setComposeButtonBusy(_0x4fde9a);
  _0x4c0331?.(!![]);
  try {
    const {
      aspectStr: _0x5b3089,
      canvas: _0x41e018
    } = createComposeCanvas(_0x11b0ae);
    const _0x42f602 = _0x41e018["getContext"]('2d');
    const _0x5b6d26 = _0x41e018["width"];
    const _0x3ea131 = _0x41e018['height'];
    const _0x2d7942 = getCssValue('--surface-node', "transparent");
    const _0x11528b = getCssValue("--bg-node", _0x2d7942);
    _0x42f602['fillStyle'] = _0x2d7942;
    _0x42f602['fillRect'](0x0, 0x0, _0x5b6d26, _0x3ea131);
    const _0x1a3ddc = _0x11b0ae['cols'] || 0x2;
    const _0x5804a4 = _0x11b0ae["rows"] || 0x2;
    const _0x5e3c58 = createComposeImageLoader();
    await drawBackdrop(_0x42f602, {
      'backdropUrl': _0x114a65?.(),
      'canvasW': _0x5b6d26,
      'canvasH': _0x3ea131,
      'loadImage': _0x5e3c58
    });
    await Promise["all"](_0x28ba67['map'](async (_0x39082f, _0x161e2e) => {
      if (_0x161e2e >= _0x1a3ddc * _0x5804a4) {
        return;
      }
      const _0x257e2c = buildStoryboardCropRect(_0x11b0ae, _0x161e2e, {
        'width': _0x5b6d26,
        'height': _0x3ea131,
        'inset': 0x0
      });
      if (!_0x257e2c) {
        return;
      }
      const _0xe15896 = _0x257e2c['x0'];
      const _0x226a11 = _0x257e2c['x1'];
      const _0x2b427c = _0x257e2c['y0'];
      const _0x38dd16 = _0x257e2c['y1'];
      const _0x2d2a2d = Math["max"](0x1, _0x226a11 - _0xe15896);
      const _0x49a3d8 = Math["max"](0x1, _0x38dd16 - _0x2b427c);
      if (_0x19ca05?.(_0x39082f)) {
        _0x42f602['fillStyle'] = _0x11528b;
        _0x42f602["fillRect"](_0xe15896, _0x2b427c, _0x2d2a2d, _0x49a3d8);
        return;
      }
      const _0x5e8028 = getStoryboardComposeCellImageElement(_0x3b44ac, _0x161e2e);
      const _0x1bda8a = _0x5304ea?.(_0x5e8028);
      if (!_0x1bda8a) {
        return;
      }
      await drawStoryboardComposeCell(_0x42f602, {
        'cell': _0x39082f,
        'cellIndex': _0x161e2e,
        'displayUrl': _0x1bda8a,
        'imageEl': _0x5e8028,
        'target': {
          'x0': _0xe15896,
          'y0': _0x2b427c,
          'drawW': _0x2d2a2d,
          'drawH': _0x49a3d8
        },
        'loadImage': _0x5e3c58,
        'cellEls': _0x3b44ac,
        'getImageElementSource': _0x5304ea
      });
    }));
    const _0x2e8700 = await saveComposeCanvas(_0x41e018, _0x5b3089, getSourceNodePosition(_0x11b0ae));
    a526_0x14b359["setSelectedNodes"]([_0x2e8700]);
    commit();
    window['_triggerLocalCacheSave']?.();
    window['showToast']?.("合成成功，源图像节点已生成", "success");
  } catch (_0x4162c7) {
    console["error"]("[Storyboard] Compose failed:", _0x4162c7);
    window["showToast"]?.("合成失败", "error");
  } finally {
    _0x4c0331?.(![]);
    _0x2f3622();
  }
}