import a1088_0x2997cc from '../core/stores/appStore.js';
import { onLocaleChange, t } from '../i18n/index.js';
import { saveOutputBlob } from './project.js';
import { generateId, screenToWorld, worldToScreen } from '../core/math.js';
import { calcSafeSpawnPosNearNode } from './nodeSpawn.js';
import { buildSourceMediaNodePayload, getAutoMediaSizeByShortSide } from '../services/fileService.js';
import { buildCanvasLocalImageFields } from '../services/canvasMediaLocalService.js';
import { localPathToUrl, pickResultLocalPath } from '../utils/localMediaPath.js';
import { buildGenerationStartPatch } from '../core/generationTaskLifecycle.js';
import { buildImageGenerationFailurePatch, buildImageGenerationResultPatch } from '../components/aigenImage/imageGenerationResultRenderer.js';
import { addToolbarPendingResultNodes, persistToolbarResultNodes, updateToolbarResultNode } from './toolbarPendingResultNodes.js';
import { resolveImageCropSourceUrl } from './imageCropSourceUrl.js';
import { bindImageOverlayViewportPreview } from './imageOverlayViewportPreview.js';
export const IMAGE_CROP_MIN_SIZE = 0x14;
export const IMAGE_CROP_EXPORT_MAX_EDGE = 0x500;
function imageCropText(_0xbe332b, _0xddf364 = {}) {
  return t("imageCrop." + _0xbe332b, _0xddf364);
}
function toFiniteNumber(_0x55fd06, _0x22f7cb = 0x0) {
  const _0x2fbf88 = Number(_0x55fd06);
  return Number["isFinite"](_0x2fbf88) ? _0x2fbf88 : _0x22f7cb;
}
function clamp(_0x278e7a, _0x3d9343, _0x327bb5) {
  return Math["max"](_0x3d9343, Math["min"](_0x327bb5, _0x278e7a));
}
function waitForCropBackgroundFrame() {
  return new Promise(_0x77bddf => {
    const _0x15488f = globalThis["window"]?.['requestAnimationFrame'] || globalThis['requestAnimationFrame'];
    if (typeof _0x15488f === "function") {
      _0x15488f(() => _0x77bddf());
      return;
    }
    setTimeout(_0x77bddf, 0x0);
  });
}
export function buildImageCropOutputSize(_0x4bff08, _0x5ebc1b, {
  maxEdge = IMAGE_CROP_EXPORT_MAX_EDGE
} = {}) {
  const _0x4540e1 = Math["max"](0x1, Math["round"](Number(_0x4bff08) || 0x0));
  const _0x2dd2cc = Math["max"](0x1, Math["round"](Number(_0x5ebc1b) || 0x0));
  const _0x4d9471 = Math['max'](0x1, Math["round"](Number(maxEdge) || 0x0));
  const _0x8157d0 = Math["max"](_0x4540e1, _0x2dd2cc);
  if (_0x8157d0 <= _0x4d9471) {
    return {
      'width': _0x4540e1,
      'height': _0x2dd2cc
    };
  }
  const _0x55d2db = _0x4d9471 / _0x8157d0;
  return {
    'width': Math["max"](0x1, Math["round"](_0x4540e1 * _0x55d2db)),
    'height': Math["max"](0x1, Math['round'](_0x2dd2cc * _0x55d2db))
  };
}
export function isLoadedCropImageElement(_0x12cbdf) {
  if (!_0x12cbdf || String(_0x12cbdf["tagName"] || '')["toUpperCase"]() !== 'IMG') {
    return ![];
  }
  if (_0x12cbdf["complete"] === ![]) {
    return ![];
  }
  if (String(_0x12cbdf["style"]?.["display"] || '')["toLowerCase"]() === "none") {
    return ![];
  }
  const _0x37106e = String(_0x12cbdf["dataset"]?.["lodSrc"] || '')["trim"]();
  if (_0x37106e === "thumb" || _0x37106e === 'placeholder') {
    return ![];
  }
  return Math["max"](0x0, Math["round"](Number(_0x12cbdf["naturalWidth"] || _0x12cbdf["width"] || 0x0))) > 0x0 && Math["max"](0x0, Math["round"](Number(_0x12cbdf["naturalHeight"] || _0x12cbdf["height"] || 0x0))) > 0x0;
}
export function findLoadedCropImageElement(_0x330abe, _0x1fed3a = globalThis["document"]) {
  const _0x18a178 = String(_0x330abe || '')["trim"]();
  if (!_0x18a178 || !_0x1fed3a?.["getElementById"]) {
    return null;
  }
  const _0x35614f = _0x1fed3a["getElementById"](_0x18a178);
  if (!_0x35614f?.["querySelector"]) {
    return null;
  }
  for (const _0x205963 of [".node-img", "img"]) {
    const _0x3b73e5 = _0x35614f["querySelector"](_0x205963);
    if (isLoadedCropImageElement(_0x3b73e5)) {
      return _0x3b73e5;
    }
  }
  return null;
}
function normalizeCropNodeBounds(_0x23cbce) {
  if (!_0x23cbce || typeof _0x23cbce !== "object") {
    return null;
  }
  const _0x447bc7 = toFiniteNumber(_0x23cbce['x']);
  const _0x34daa1 = toFiniteNumber(_0x23cbce['y']);
  const _0x39fdd9 = Math["max"](0x0, toFiniteNumber(_0x23cbce["width"] ?? _0x23cbce['w']));
  const _0x4df54a = Math['max'](0x0, toFiniteNumber(_0x23cbce["height"] ?? _0x23cbce['h']));
  if (!(_0x39fdd9 > 0x0 && _0x4df54a > 0x0)) {
    return null;
  }
  return {
    'x': _0x447bc7,
    'y': _0x34daa1,
    'width': _0x39fdd9,
    'height': _0x4df54a,
    'right': _0x447bc7 + _0x39fdd9,
    'bottom': _0x34daa1 + _0x4df54a
  };
}
function normalizeCropAspectRatio(_0x5a9379) {
  const _0x471871 = Number(_0x5a9379);
  return Number["isFinite"](_0x471871) && _0x471871 > 0x0 ? _0x471871 : null;
}
function clampPointToNode(_0x2a985a, _0x51b3dd) {
  return {
    'x': clamp(toFiniteNumber(_0x2a985a?.['x']), _0x51b3dd['x'], _0x51b3dd['right']),
    'y': clamp(toFiniteNumber(_0x2a985a?.['y']), _0x51b3dd['y'], _0x51b3dd["bottom"])
  };
}
export function buildImageCropDragRect({
  startPoint: _0x126215,
  currentPoint: _0x177c0f,
  node: _0x33b896,
  aspectRatio = null,
  minSize = IMAGE_CROP_MIN_SIZE
} = {}) {
  const _0x5cac4 = normalizeCropNodeBounds(_0x33b896);
  if (!_0x5cac4) {
    return null;
  }
  const _0x57ae3d = clampPointToNode(_0x126215, _0x5cac4);
  const _0x4bd865 = clampPointToNode(_0x177c0f, _0x5cac4);
  const _0x506f64 = _0x4bd865['x'] - _0x57ae3d['x'];
  const _0x1a8fe0 = _0x4bd865['y'] - _0x57ae3d['y'];
  const _0x1e8bff = _0x506f64 < 0x0 ? -0x1 : 0x1;
  const _0x3cf48f = _0x1a8fe0 < 0x0 ? -0x1 : 0x1;
  let _0x5016e7 = Math["abs"](_0x506f64);
  let _0x8d1840 = Math["abs"](_0x1a8fe0);
  const _0x1f0dcd = normalizeCropAspectRatio(aspectRatio);
  if (_0x1f0dcd) {
    const _0x3db73d = _0x1e8bff < 0x0 ? _0x57ae3d['x'] - _0x5cac4['x'] : _0x5cac4["right"] - _0x57ae3d['x'];
    const _0x1c13dc = _0x3cf48f < 0x0 ? _0x57ae3d['y'] - _0x5cac4['y'] : _0x5cac4['bottom'] - _0x57ae3d['y'];
    if (_0x5016e7 > 0x0 && _0x8d1840 > 0x0) {
      _0x5016e7 / _0x8d1840 > _0x1f0dcd ? _0x5016e7 = _0x8d1840 * _0x1f0dcd : _0x8d1840 = _0x5016e7 / _0x1f0dcd;
    } else {
      if (_0x5016e7 > 0x0) {
        _0x8d1840 = _0x5016e7 / _0x1f0dcd;
      } else {
        _0x8d1840 > 0x0 && (_0x5016e7 = _0x8d1840 * _0x1f0dcd);
      }
    }
    _0x5016e7 > _0x3db73d && (_0x5016e7 = _0x3db73d, _0x8d1840 = _0x5016e7 / _0x1f0dcd);
    _0x8d1840 > _0x1c13dc && (_0x8d1840 = _0x1c13dc, _0x5016e7 = _0x8d1840 * _0x1f0dcd);
  }
  if (!(_0x5016e7 > 0x0 && _0x8d1840 > 0x0)) {
    return null;
  }
  const _0x21352c = {
    'x': _0x1e8bff < 0x0 ? _0x57ae3d['x'] - _0x5016e7 : _0x57ae3d['x'],
    'y': _0x3cf48f < 0x0 ? _0x57ae3d['y'] - _0x8d1840 : _0x57ae3d['y'],
    'w': _0x5016e7,
    'h': _0x8d1840
  };
  const _0x2f861b = Math['max'](0x0, toFiniteNumber(minSize, IMAGE_CROP_MIN_SIZE));
  return {
    'rect': _0x21352c,
    'isValid': _0x21352c['w'] >= _0x2f861b && _0x21352c['h'] >= _0x2f861b
  };
}
const ImageCropController = {
  'active': ![],
  'nodeData': null,
  'cropRect': {
    'x': 0x0,
    'y': 0x0,
    'w': 0x0,
    'h': 0x0
  },
  'aspectRatio': null,
  'overlayEl': null,
  'boxEl': null,
  'toolbarEl': null,
  'ratioMenuEl': null,
  '_unsubscribe': null,
  '_unsubscribeViewportPreview': null,
  '_unsubscribeLocale': null,
  '_view': null,
  '_redrawSelection': null,
  '_isProcessingCrop': ![],
  'init'(_0x3677c1) {
    if (this["active"]) {
      return;
    }
    const _0x328eb1 = a1088_0x2997cc["getStateRaw"]();
    const _0x15b67b = _0x328eb1["nodes"]?.[_0x3677c1];
    if (!_0x15b67b) {
      return;
    }
    this["active"] = !![];
    this["nodeData"] = _0x15b67b;
    this["_isProcessingCrop"] = ![];
    this["aspectRatio"] = null;
    this['_view'] = {
      'viewport': _0x328eb1['viewport'],
      'node': _0x15b67b
    };
    this["_redrawSelection"] = null;
    const _0x3decfd = 0.1;
    this['cropRect'] = {
      'x': _0x15b67b['x'] + _0x15b67b["width"] * _0x3decfd / 0x2,
      'y': _0x15b67b['y'] + _0x15b67b["height"] * _0x3decfd / 0x2,
      'w': _0x15b67b["width"] * (0x1 - _0x3decfd),
      'h': _0x15b67b["height"] * (0x1 - _0x3decfd)
    };
    const _0x5cf475 = () => {
      this["_createUI"]();
      this["_bindEvents"]();
      this['_unsubscribe'] = a1088_0x2997cc["subscribeSelector"](_0x3ef06b => {
        const _0x57aa2a = _0x3ef06b["nodes"]?.[_0x3677c1];
        const _0x35fdf0 = _0x3ef06b["viewport"] || {
          'x': 0x0,
          'y': 0x0,
          'zoom': 0x1
        };
        return {
          'hasNode': !!_0x57aa2a,
          'nx': _0x57aa2a ? _0x57aa2a['x'] : 0x0,
          'ny': _0x57aa2a ? _0x57aa2a['y'] : 0x0,
          'nw': _0x57aa2a ? _0x57aa2a["width"] : 0x0,
          'nh': _0x57aa2a ? _0x57aa2a["height"] : 0x0,
          'vx': _0x35fdf0['x'],
          'vy': _0x35fdf0['y'],
          'vz': _0x35fdf0["zoom"] || 0x1,
          'vox': _0x35fdf0["_screenOriginX"] || 0x0,
          'voy': _0x35fdf0["_screenOriginY"] || 0x0
        };
      }, _0x20b6cd => {
        if (!_0x20b6cd?.["hasNode"]) {
          return;
        }
        const _0x2c720c = a1088_0x2997cc["getStateRaw"]()["nodes"]?.[_0x3677c1];
        if (!_0x2c720c) {
          return;
        }
        this['_view'] = {
          'viewport': {
            'x': _0x20b6cd['vx'],
            'y': _0x20b6cd['vy'],
            'zoom': _0x20b6cd['vz'],
            '_screenOriginX': _0x20b6cd['vox'],
            '_screenOriginY': _0x20b6cd["voy"]
          },
          'node': _0x2c720c
        };
        this["_updateView"](this['_view']);
      });
      this["_unsubscribeViewportPreview"] = bindImageOverlayViewportPreview({
        'getView': () => this['_view'],
        'updateView': _0x337981 => {
          this["_view"] = _0x337981;
          this["_updateView"](_0x337981);
        }
      });
      requestAnimationFrame(() => {
        if (this["overlayEl"]) {
          this["overlayEl"]["classList"]['add']("visible");
        }
        if (this["dimMaskEl"]) {
          this["dimMaskEl"]['classList']["add"]("visible");
        }
      });
    };
    _0x5cf475();
  },
  '_createUI'() {
    const _0x50166b = document["createDocumentFragment"]();
    const _0x5dc3e6 = document['createElement']("div");
    _0x5dc3e6["className"] = "v2-crop-overlay";
    _0x5dc3e6["style"]['willChange'] = "opacity";
    const _0x2180d9 = document["createElement"]('div');
    _0x2180d9["className"] = 'v2-crop-dim-mask';
    const _0x5ba0b5 = document['createElement']('div');
    _0x5ba0b5['className'] = 'v2-crop-container';
    _0x5ba0b5["style"]["transform"] = "translateZ(0)";
    const _0x410056 = document["createElement"]("div");
    _0x410056["className"] = "v2-crop-box";
    _0x410056["style"]["willChange"] = "transform, width, height";
    _0x410056["style"]["transform"] = "translateZ(0)";
    const _0x1c38f8 = document['createElement']("div");
    _0x1c38f8["className"] = "v2-crop-grid";
    _0x1c38f8["replaceChildren"]();
    for (let _0x574b95 = 0x0; _0x574b95 < 0x9; _0x574b95++) {
      _0x1c38f8["appendChild"](document["createElement"]("div"));
    }
    _0x410056["appendChild"](_0x1c38f8);
    const _0x32703d = ['tl', 'tm', 'tr', 'rm', 'br', 'bm', 'bl', 'lm'];
    _0x32703d["forEach"](_0x788ca8 => {
      const _0x1ad3a9 = document['createElement']("div");
      _0x1ad3a9["className"] = "v2-crop-handle " + _0x788ca8;
      _0x1ad3a9["dataset"]["handle"] = _0x788ca8;
      _0x410056['appendChild'](_0x1ad3a9);
    });
    _0x5ba0b5["appendChild"](_0x410056);
    _0x5dc3e6["appendChild"](_0x5ba0b5);
    _0x50166b["appendChild"](_0x2180d9);
    _0x50166b["appendChild"](_0x5dc3e6);
    const _0x263717 = document["createElement"]("div");
    _0x263717['className'] = "v2-crop-size-label";
    _0x263717["textContent"] = "-- x --";
    _0x50166b["appendChild"](_0x263717);
    this["sizeLabelEl"] = _0x263717;
    this["dimMaskEl"] = _0x2180d9;
    const _0xf5cf43 = document['createElement']("div");
    _0xf5cf43["className"] = "v2-crop-toolbar";
    _0xf5cf43["style"]["willChange"] = "opacity, transform";
    const _0x29dddc = "http://www.w3.org/2000/svg";
    const _0xc330e2 = (_0x2029ea, _0x21071b, _0x55eb75) => {
      const _0x560eef = document['createElementNS'](_0x29dddc, "svg");
      _0x560eef["setAttribute"]('width', String(_0x2029ea));
      _0x560eef["setAttribute"]("height", String(_0x21071b));
      _0x560eef["setAttribute"]("viewBox", "0 0 24 24");
      _0x560eef['setAttribute']('fill', "none");
      _0x560eef["setAttribute"]("stroke", "currentColor");
      _0x560eef["setAttribute"]('stroke-width', String(_0x55eb75));
      return _0x560eef;
    };
    const _0x36900d = document['createElement']('button');
    _0x36900d["className"] = "v2-crop-toolbar-btn exit";
    _0x36900d["title"] = imageCropText('actions.exit');
    const _0x2a3cf4 = _0xc330e2(0x12, 0x12, 0x2);
    const _0x83ddd4 = document["createElementNS"](_0x29dddc, "path");
    _0x83ddd4["setAttribute"]('d', "M18 6L6 18");
    const _0x1f7c54 = document['createElementNS'](_0x29dddc, "path");
    _0x1f7c54["setAttribute"]('d', "M6 6l12 12");
    _0x2a3cf4["appendChild"](_0x83ddd4);
    _0x2a3cf4["appendChild"](_0x1f7c54);
    _0x36900d["appendChild"](_0x2a3cf4);
    const _0x2516ef = document['createElement']("div");
    _0x2516ef['className'] = "v2-crop-divider";
    const _0x462da9 = document["createElement"]("div");
    _0x462da9["className"] = 'v2-expand-wrap';
    const _0x3043f7 = document['createElement']("button");
    _0x3043f7['className'] = "v2-crop-toolbar-btn ratio-toggle";
    const _0x5df0ac = _0xc330e2(0x10, 0x10, 0x2);
    const _0x124795 = document["createElementNS"](_0x29dddc, 'rect');
    _0x124795["setAttribute"]('x', '3');
    _0x124795['setAttribute']('y', '3');
    _0x124795["setAttribute"]('width', '18');
    _0x124795["setAttribute"]('height', '18');
    _0x124795["setAttribute"]('rx', '2');
    const _0x2e9ceb = document['createElementNS'](_0x29dddc, "path");
    _0x2e9ceb['setAttribute']('d', 'M3\x209h18M9\x2021V9');
    _0x5df0ac["appendChild"](_0x124795);
    _0x5df0ac['appendChild'](_0x2e9ceb);
    const _0x12a295 = document["createElement"]('span');
    _0x12a295["className"] = 'ratio-text';
    _0x12a295["textContent"] = imageCropText("ratios.free");
    _0x3043f7["appendChild"](_0x5df0ac);
    _0x3043f7["appendChild"](_0x12a295);
    const _0x4162a4 = document['createElement']('div');
    _0x4162a4["className"] = "floating-menu v2-expand-menu v2-crop-ratio-menu";
    const _0x1c2bdf = [{
      'v': "free",
      'key': "free",
      'active': !![]
    }, {
      'v': "original",
      'key': "original"
    }, {
      'v': "21:9",
      't': "21:9"
    }, {
      'v': '16:9',
      't': "16:9"
    }, {
      'v': "9:16",
      't': "9:16"
    }, {
      'v': "4:3",
      't': '4:3'
    }, {
      'v': "3:4",
      't': "3:4"
    }, {
      'v': "1:1",
      't': "1:1"
    }];
    _0x1c2bdf["forEach"](_0x79e08b => {
      const _0x14b40a = document["createElement"]("div");
      _0x14b40a["className"] = "floating-menu-item v2-expand-menu-item v2-crop-ratio-item" + (_0x79e08b["active"] ? " active" : '');
      _0x14b40a["dataset"]['ratio'] = _0x79e08b['v'];
      if (_0x79e08b["key"]) {
        _0x14b40a["dataset"]['ratioLabelKey'] = _0x79e08b["key"];
      }
      const _0x2961bc = document['createElement']("span");
      _0x2961bc['className'] = "floating-menu-label";
      _0x2961bc['textContent'] = _0x79e08b["key"] ? imageCropText('ratios.' + _0x79e08b["key"]) : _0x79e08b['t'];
      _0x14b40a['appendChild'](_0x2961bc);
      _0x4162a4["appendChild"](_0x14b40a);
    });
    _0x462da9["appendChild"](_0x3043f7);
    _0x462da9["appendChild"](_0x4162a4);
    const _0x27df04 = document["createElement"]("div");
    _0x27df04["className"] = "v2-crop-divider";
    const _0x30f5fe = document["createElement"]('button');
    _0x30f5fe["className"] = "v2-crop-toolbar-btn confirm";
    const _0x2970de = _0xc330e2(0x12, 0x12, 0x2);
    const _0x564f21 = document["createElementNS"](_0x29dddc, 'polyline');
    _0x564f21["setAttribute"]('points', '20\x206\x209\x2017\x204\x2012');
    _0x2970de["appendChild"](_0x564f21);
    _0x30f5fe["appendChild"](_0x2970de);
    _0x30f5fe["appendChild"](document["createTextNode"]('\x20' + imageCropText("actions.confirm")));
    _0xf5cf43["appendChild"](_0x36900d);
    _0xf5cf43['appendChild'](_0x2516ef);
    _0xf5cf43['appendChild'](_0x462da9);
    _0xf5cf43["appendChild"](_0x27df04);
    _0xf5cf43["appendChild"](_0x30f5fe);
    document['body']['appendChild'](_0x50166b);
    document["body"]["appendChild"](_0xf5cf43);
    this["overlayEl"] = _0x5dc3e6;
    this["boxEl"] = _0x410056;
    this["toolbarEl"] = _0xf5cf43;
    this["ratioMenuEl"] = _0x4162a4;
    this['_subscribeLocaleChanges']();
    this["_syncLocaleTexts"]();
    requestAnimationFrame(() => {
      if (this["_containerEl"]) {
        this["_containerEl"]["_lastTransform"] = null;
      }
      if (this["boxEl"]) {
        this['boxEl']["_lastTransform"] = null;
      }
      this["_updateView"]();
    });
  },
  '_updateView'(_0x5a75b3 = this['_view']) {
    if (!this["active"]) {
      return;
    }
    const _0x59037f = _0x5a75b3?.['node'];
    const _0x59bc59 = _0x5a75b3?.["viewport"];
    if (!_0x59037f) {
      return;
    }
    this["nodeData"] = _0x59037f;
    const _0xbad763 = worldToScreen(this['nodeData']['x'], this["nodeData"]['y'], _0x59bc59);
    const _0x469060 = {
      'w': Math["round"](this["nodeData"]['width'] * _0x59bc59["zoom"]),
      'h': Math['round'](this["nodeData"]['height'] * _0x59bc59["zoom"])
    };
    !this["_containerEl"] && (this["_containerEl"] = this["overlayEl"]["querySelector"](".v2-crop-container"));
    const _0x4e2023 = this["_containerEl"];
    const _0x4813ed = "translate(" + Math["round"](_0xbad763['x']) + "px, " + Math['round'](_0xbad763['y']) + "px) translateZ(0)";
    _0x4e2023["_lastTransform"] !== _0x4813ed && (_0x4e2023["style"]["transform"] = _0x4813ed, _0x4e2023['_lastTransform'] = _0x4813ed);
    _0x4e2023["style"]["width"] = _0x469060['w'] + 'px';
    _0x4e2023["style"]["height"] = _0x469060['h'] + 'px';
    _0x4e2023["style"]["position"] = 'fixed';
    const _0xd6776a = {
      'x': Math["max"](0x0, Math["round"]((this['cropRect']['x'] - this['nodeData']['x']) * _0x59bc59["zoom"])),
      'y': Math["max"](0x0, Math["round"]((this['cropRect']['y'] - this['nodeData']['y']) * _0x59bc59['zoom'])),
      'w': Math["round"](this["cropRect"]['w'] * _0x59bc59["zoom"]),
      'h': Math["round"](this["cropRect"]['h'] * _0x59bc59["zoom"])
    };
    _0xd6776a['x'] + _0xd6776a['w'] > _0x469060['w'] && (_0xd6776a['w'] = _0x469060['w'] - _0xd6776a['x']);
    _0xd6776a['y'] + _0xd6776a['h'] > _0x469060['h'] && (_0xd6776a['h'] = _0x469060['h'] - _0xd6776a['y']);
    const _0x3c4ee0 = "translate(" + _0xd6776a['x'] + 'px,\x20' + _0xd6776a['y'] + "px) translateZ(0)";
    this["boxEl"]["_lastTransform"] !== _0x3c4ee0 && (this["boxEl"]["style"]["transform"] = _0x3c4ee0, this['boxEl']["_lastTransform"] = _0x3c4ee0);
    this["boxEl"]['style']["width"] = _0xd6776a['w'] + 'px';
    this['boxEl']["style"]["height"] = _0xd6776a['h'] + 'px';
    this["boxEl"]["style"]["left"] = '0';
    this['boxEl']["style"]["top"] = '0';
    if (this["sizeLabelEl"]) {
      const _0x55fe48 = Math["round"](this["cropRect"]['w']);
      const _0x5c2796 = Math["round"](this["cropRect"]['h']);
      this["sizeLabelEl"]["textContent"] = _0x55fe48 + '\x20×\x20' + _0x5c2796;
      const _0x22a72b = _0xbad763['y'] + _0xd6776a['y'] - 0x20;
      const _0x57ce2b = _0xbad763['x'] + _0xd6776a['x'] + _0xd6776a['w'] / 0x2;
      this['sizeLabelEl']['style']["top"] = _0x22a72b + 'px';
      this['sizeLabelEl']['style']["left"] = _0x57ce2b + 'px';
    }
    if (this["toolbarEl"]) {
      const _0x3edf05 = _0xbad763['y'] + _0x469060['h'] + 0xe * _0x59bc59["zoom"];
      const _0x1349ae = _0xbad763['x'] + _0x469060['w'] / 0x2;
      this["toolbarEl"]["style"]["top"] = _0x3edf05 + 'px';
      this["toolbarEl"]["style"]['left'] = _0x1349ae + 'px';
      this['toolbarEl']["style"]['transform'] = 'translateX(-50%)';
    }
    if (this['dimMaskEl']) {
      const _0x391670 = _0xbad763['x'] + _0xd6776a['x'];
      const _0xf4dbe1 = _0xbad763['y'] + _0xd6776a['y'];
      const _0x1c6eff = _0xd6776a['w'];
      const _0x309765 = _0xd6776a['h'];
      const _0x4336ce = "polygon(\n        0% 0%, 100% 0%, 100% 100%, 0% 100%,\n        0% 0%,\n        " + _0x391670 + "px " + _0xf4dbe1 + 'px,\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + _0x391670 + "px " + (_0xf4dbe1 + _0x309765) + "px,\n        " + (_0x391670 + _0x1c6eff) + "px " + (_0xf4dbe1 + _0x309765) + "px,\n        " + (_0x391670 + _0x1c6eff) + "px " + _0xf4dbe1 + "px,\n        " + _0x391670 + 'px\x20' + _0xf4dbe1 + "px\n      )";
      this['dimMaskEl']["style"]["clipPath"] = _0x4336ce;
    }
  },
  '_applyRedrawVisualState'() {
    const _0x1b7edb = this["_redrawSelection"]?.['mode'] || '';
    const _0x3fb9fd = _0x1b7edb === "armed" || _0x1b7edb === "dragging";
    const _0x43e7cb = _0x1b7edb === "dragging";
    for (const _0xa6dc of [this["overlayEl"], this["dimMaskEl"], this["sizeLabelEl"]]) {
      _0xa6dc?.["classList"]?.["toggle"]("is-redraw-armed", _0x3fb9fd);
      _0xa6dc?.["classList"]?.["toggle"]("is-redraw-dragging", _0x43e7cb);
    }
  },
  '_isPointInsideNode'(_0x129db1) {
    if (!this["nodeData"] || !_0x129db1) {
      return ![];
    }
    return _0x129db1['x'] >= this["nodeData"]['x'] && _0x129db1['x'] <= this["nodeData"]['x'] + this["nodeData"]['width'] && _0x129db1['y'] >= this['nodeData']['y'] && _0x129db1['y'] <= this["nodeData"]['y'] + this['nodeData']['height'];
  },
  '_getWorldPointFromEvent'(_0x3c7769) {
    const _0x567926 = this["_view"]?.["viewport"] || {
      'x': 0x0,
      'y': 0x0,
      'zoom': 0x1
    };
    return screenToWorld(_0x3c7769["clientX"], _0x3c7769["clientY"], _0x567926);
  },
  '_enterRedrawSelectionMode'() {
    if (!this["active"]) {
      return;
    }
    const _0x35a384 = this["_redrawSelection"]?.['mode'] || '';
    if (_0x35a384 === "dragging") {
      return;
    }
    _0x35a384 !== "armed" && (this['_redrawSelection'] = {
      'mode': "armed",
      'previousRect': {
        ...this["cropRect"]
      },
      'pointerId': null,
      'startPoint': null
    });
    this["_applyRedrawVisualState"]();
  },
  '_exitRedrawSelectionMode'({
    restore = !![]
  } = {}) {
    const _0x3d2704 = this["_redrawSelection"]?.["previousRect"];
    this["_redrawSelection"] = null;
    restore && _0x3d2704 && (this["cropRect"] = {
      ..._0x3d2704
    }, this["_updateView"](this["_view"]));
    this["_applyRedrawVisualState"]();
  },
  '_beginRedrawSelection'(_0x23e788) {
    const _0x10cce6 = this["_getWorldPointFromEvent"](_0x23e788);
    if (!this["_isPointInsideNode"](_0x10cce6)) {
      return ![];
    }
    const _0x101fab = this["_redrawSelection"]?.["previousRect"] || {
      ...this["cropRect"]
    };
    this["_redrawSelection"] = {
      'mode': "dragging",
      'previousRect': _0x101fab,
      'pointerId': _0x23e788["pointerId"],
      'startPoint': _0x10cce6,
      'lastResult': null
    };
    this["cropRect"] = {
      'x': _0x10cce6['x'],
      'y': _0x10cce6['y'],
      'w': 0x0,
      'h': 0x0
    };
    this["_applyRedrawVisualState"]();
    this["_updateView"](this["_view"]);
    this['overlayEl']?.["setPointerCapture"]?.(_0x23e788["pointerId"]);
    return !![];
  },
  '_updateRedrawSelection'(_0xc03b71) {
    const _0x13e43f = this["_redrawSelection"];
    if (_0x13e43f?.["mode"] !== 'dragging') {
      return;
    }
    const _0x5c6251 = this["_getWorldPointFromEvent"](_0xc03b71);
    const _0x2958ae = buildImageCropDragRect({
      'startPoint': _0x13e43f["startPoint"],
      'currentPoint': _0x5c6251,
      'node': this['nodeData'],
      'aspectRatio': this["aspectRatio"],
      'minSize': IMAGE_CROP_MIN_SIZE
    });
    _0x13e43f["lastResult"] = _0x2958ae;
    _0x2958ae?.['rect'] && (this["cropRect"] = {
      ..._0x2958ae["rect"]
    }, this["_updateView"](this["_view"]));
  },
  '_finishRedrawSelection'(_0x2fc191, {
    cancel = ![]
  } = {}) {
    const _0x5538a2 = this["_redrawSelection"];
    if (_0x5538a2?.['mode'] !== "dragging") {
      return;
    }
    !cancel && this["_updateRedrawSelection"](_0x2fc191);
    const _0x5542dd = _0x5538a2["lastResult"];
    const _0x549be4 = _0x5538a2['previousRect'];
    const _0x368187 = !cancel && _0x5542dd?.["isValid"] && _0x5542dd?.["rect"] ? {
      ..._0x5542dd["rect"]
    } : _0x549be4;
    this["_redrawSelection"] = null;
    _0x368187 && (this["cropRect"] = {
      ..._0x368187
    });
    try {
      this["overlayEl"]?.['releasePointerCapture']?.(_0x5538a2["pointerId"]);
    } catch {}
    this["_applyRedrawVisualState"]();
    this["_updateView"](this["_view"]);
  },
  '_bindEvents'() {
    const _0x2350af = _0x24b61d => _0x24b61d['stopPropagation']();
    this["overlayEl"]["addEventListener"]("wheel", _0x2350af, {
      'passive': ![]
    });
    const _0x5850b6 = () => this["_updateView"](this["_view"]);
    window["addEventListener"]("resize", _0x5850b6);
    let _0x39b91e = ![];
    let _0x4de7fb = {
      'x': 0x0,
      'y': 0x0
    };
    let _0x4ea26b = {
      ...this["cropRect"]
    };
    let _0x33f84d = null;
    const _0x211e4d = _0x276f0b => {
      if (_0x276f0b["key"] === 'Escape') {
        if (this["_redrawSelection"]?.["mode"] === "dragging") {
          this["_finishRedrawSelection"](_0x276f0b, {
            'cancel': !![]
          });
          return;
        }
        this["exit"]();
        return;
      }
      _0x276f0b['key'] === 'Control' && !_0x39b91e && !_0x33f84d && this["_enterRedrawSelectionMode"]();
    };
    window["addEventListener"]("keydown", _0x211e4d);
    const _0x355841 = _0x36a176 => {
      if (_0x36a176["key"] !== "Control") {
        return;
      }
      this['_redrawSelection']?.["mode"] === "armed" && this["_exitRedrawSelectionMode"]({
        'restore': !![]
      });
    };
    window["addEventListener"]("keyup", _0x355841);
    const _0x3bb335 = _0x4c4248 => {
      if (!_0x4c4248["ctrlKey"] || _0x39b91e || _0x33f84d) {
        return;
      }
      if (!this['_beginRedrawSelection'](_0x4c4248)) {
        return;
      }
      _0x4c4248['preventDefault']();
      _0x4c4248["stopPropagation"]();
    };
    const _0x3a32f9 = _0x4d6394 => {
      if (this["_redrawSelection"]?.["mode"] !== "dragging" || this['_redrawSelection']["pointerId"] !== _0x4d6394["pointerId"]) {
        return;
      }
      _0x4d6394['preventDefault']();
      _0x4d6394["stopPropagation"]();
      this["_updateRedrawSelection"](_0x4d6394);
    };
    const _0x139a53 = _0x1e4489 => {
      if (this["_redrawSelection"]?.["mode"] !== "dragging" || this["_redrawSelection"]["pointerId"] !== _0x1e4489["pointerId"]) {
        return;
      }
      _0x1e4489["preventDefault"]();
      _0x1e4489['stopPropagation']();
      this["_finishRedrawSelection"](_0x1e4489);
    };
    const _0x5d819b = _0x5cecc7 => {
      if (this["_redrawSelection"]?.["mode"] !== 'dragging' || this["_redrawSelection"]["pointerId"] !== _0x5cecc7["pointerId"]) {
        return;
      }
      _0x5cecc7["preventDefault"]();
      _0x5cecc7["stopPropagation"]();
      this["_finishRedrawSelection"](_0x5cecc7, {
        'cancel': !![]
      });
    };
    this["overlayEl"]['addEventListener']("pointerdown", _0x3bb335, !![]);
    this['overlayEl']['addEventListener']('pointermove', _0x3a32f9, !![]);
    this["overlayEl"]["addEventListener"]("pointerup", _0x139a53, !![]);
    this["overlayEl"]["addEventListener"]("pointercancel", _0x5d819b, !![]);
    this["boxEl"]["addEventListener"]('pointerdown', _0x471794 => {
      if (_0x471794["target"]['classList']['contains']("v2-crop-handle")) {
        return;
      }
      if (_0x471794["ctrlKey"]) {
        return;
      }
      _0x471794['stopPropagation']();
      _0x39b91e = !![];
      _0x4de7fb = {
        'x': _0x471794["clientX"],
        'y': _0x471794["clientY"]
      };
      _0x4ea26b = {
        ...this["cropRect"]
      };
      this['boxEl']["setPointerCapture"](_0x471794["pointerId"]);
    });
    this['boxEl']["addEventListener"]("pointermove", _0x17e333 => {
      if (!_0x39b91e) {
        return;
      }
      const _0x5b323b = this["_view"]?.["viewport"]?.['zoom'] || 0x1;
      const _0x5e5c58 = (_0x17e333["clientX"] - _0x4de7fb['x']) / _0x5b323b;
      const _0x3fbff1 = (_0x17e333["clientY"] - _0x4de7fb['y']) / _0x5b323b;
      let _0x44af30 = _0x4ea26b['x'] + _0x5e5c58;
      let _0x7377fa = _0x4ea26b['y'] + _0x3fbff1;
      const _0xb8d7de = IMAGE_CROP_MIN_SIZE;
      const _0x425dca = IMAGE_CROP_MIN_SIZE;
      _0x44af30 = Math["max"](this["nodeData"]['x'], Math["min"](_0x44af30, this["nodeData"]['x'] + this['nodeData']["width"] - this["cropRect"]['w']));
      _0x7377fa = Math["max"](this["nodeData"]['y'], Math["min"](_0x7377fa, this["nodeData"]['y'] + this["nodeData"]["height"] - this["cropRect"]['h']));
      this["cropRect"]['x'] = _0x44af30;
      this["cropRect"]['y'] = _0x7377fa;
      this["_updateView"](this['_view']);
    });
    const _0xea0d3d = () => {
      _0x39b91e = ![];
    };
    this["boxEl"]["addEventListener"]('pointerup', _0xea0d3d);
    this["boxEl"]["addEventListener"]("pointercancel", _0xea0d3d);
    this["boxEl"]["addEventListener"]("pointerdown", _0x28e418 => {
      const _0x91909 = _0x28e418['target']['closest'](".v2-crop-handle");
      if (!_0x91909) {
        return;
      }
      if (_0x28e418["ctrlKey"]) {
        return;
      }
      _0x28e418['stopPropagation']();
      _0x33f84d = _0x91909['dataset']["handle"];
      _0x4de7fb = {
        'x': _0x28e418["clientX"],
        'y': _0x28e418["clientY"]
      };
      _0x4ea26b = {
        ...this["cropRect"]
      };
      _0x91909["setPointerCapture"](_0x28e418["pointerId"]);
    });
    this["boxEl"]['addEventListener']("pointermove", _0x11b3ec => {
      if (!_0x33f84d) {
        return;
      }
      const _0x3b170d = this["_view"]?.["viewport"]?.["zoom"] || 0x1;
      const _0x283968 = (_0x11b3ec['clientX'] - _0x4de7fb['x']) / _0x3b170d;
      const _0x404105 = (_0x11b3ec['clientY'] - _0x4de7fb['y']) / _0x3b170d;
      let {
        x: _0x155264,
        y: _0x41cd0d,
        w: _0x3cadbe,
        h: _0x2bddde
      } = _0x4ea26b;
      const _0x5be722 = (_0x4ce789, _0x68458a) => {
        const _0x5e7c42 = IMAGE_CROP_MIN_SIZE;
        if (_0x68458a) {
          const _0x13d414 = _0x4ea26b['x'] + _0x4ea26b['w'] - _0x5e7c42;
          _0x155264 = Math["max"](this["nodeData"]['x'], Math['min'](_0x4ea26b['x'] + _0x283968, _0x13d414));
          _0x3cadbe = _0x4ea26b['w'] - (_0x155264 - _0x4ea26b['x']);
        } else {
          _0x3cadbe = Math["max"](_0x5e7c42, Math["min"](_0x4ce789, this["nodeData"]['x'] + this["nodeData"]["width"] - _0x155264));
        }
      };
      const _0x29c8a8 = (_0x301f33, _0x4f69ae) => {
        const _0x49e6a8 = IMAGE_CROP_MIN_SIZE;
        if (_0x4f69ae) {
          const _0x2fc5bc = _0x4ea26b['y'] + _0x4ea26b['h'] - _0x49e6a8;
          _0x41cd0d = Math["max"](this['nodeData']['y'], Math["min"](_0x4ea26b['y'] + _0x404105, _0x2fc5bc));
          _0x2bddde = _0x4ea26b['h'] - (_0x41cd0d - _0x4ea26b['y']);
        } else {
          _0x2bddde = Math['max'](_0x49e6a8, Math["min"](_0x301f33, this["nodeData"]['y'] + this["nodeData"]["height"] - _0x41cd0d));
        }
      };
      if (_0x33f84d["includes"]('r')) {
        _0x5be722(_0x4ea26b['w'] + _0x283968, ![]);
      }
      if (_0x33f84d["includes"]('l')) {
        _0x5be722(_0x4ea26b['w'] - _0x283968, !![]);
      }
      if (_0x33f84d["includes"]('b')) {
        _0x29c8a8(_0x4ea26b['h'] + _0x404105, ![]);
      }
      if (_0x33f84d['includes']('t')) {
        _0x29c8a8(_0x4ea26b['h'] - _0x404105, !![]);
      }
      if (this["aspectRatio"]) {
        if (_0x33f84d === 'tm' || _0x33f84d === 'bm' || _0x33f84d === 'lm' || _0x33f84d === 'rm') {
          _0x33f84d["includes"]('m') && (_0x33f84d === 'tm' || _0x33f84d === 'bm' ? (_0x3cadbe = _0x2bddde * this['aspectRatio'], _0x155264 = _0x4ea26b['x'] + (_0x4ea26b['w'] - _0x3cadbe) / 0x2) : (_0x2bddde = _0x3cadbe / this["aspectRatio"], _0x41cd0d = _0x4ea26b['y'] + (_0x4ea26b['h'] - _0x2bddde) / 0x2));
        } else {
          const _0x5c669e = _0x3cadbe / _0x2bddde;
          _0x5c669e > this["aspectRatio"] ? _0x2bddde = _0x3cadbe / this["aspectRatio"] : _0x3cadbe = _0x2bddde * this['aspectRatio'];
          if (_0x33f84d['includes']('t')) {
            _0x41cd0d = _0x4ea26b['y'] + _0x4ea26b['h'] - _0x2bddde;
          }
          if (_0x33f84d["includes"]('l')) {
            _0x155264 = _0x4ea26b['x'] + _0x4ea26b['w'] - _0x3cadbe;
          }
        }
        _0x155264 < this["nodeData"]['x'] && (_0x155264 = this['nodeData']['x'], _0x3cadbe = _0x2bddde * this["aspectRatio"]);
        _0x41cd0d < this["nodeData"]['y'] && (_0x41cd0d = this["nodeData"]['y'], _0x2bddde = _0x3cadbe / this["aspectRatio"]);
        _0x155264 + _0x3cadbe > this["nodeData"]['x'] + this["nodeData"]["width"] && (_0x3cadbe = this["nodeData"]['x'] + this["nodeData"]["width"] - _0x155264, _0x2bddde = _0x3cadbe / this['aspectRatio']);
        _0x41cd0d + _0x2bddde > this["nodeData"]['y'] + this["nodeData"]["height"] && (_0x2bddde = this["nodeData"]['y'] + this['nodeData']["height"] - _0x41cd0d, _0x3cadbe = _0x2bddde * this["aspectRatio"]);
      }
      this["cropRect"] = {
        'x': _0x155264,
        'y': _0x41cd0d,
        'w': _0x3cadbe,
        'h': _0x2bddde
      };
      this["_updateView"]();
    });
    const _0x137720 = () => {
      _0x33f84d = null;
    };
    this['boxEl']["addEventListener"]("pointerup", _0x137720);
    this["boxEl"]["addEventListener"]("pointercancel", _0x137720);
    this["toolbarEl"]["querySelector"](".exit")["onclick"] = () => this["exit"]();
    const _0x204fec = this["toolbarEl"]['querySelector'](".ratio-toggle");
    _0x204fec["onclick"] = _0x2bcac3 => {
      _0x2bcac3["stopPropagation"]();
      this["ratioMenuEl"]["classList"]["toggle"]("open");
    };
    this["ratioMenuEl"]["onclick"] = _0x5ebc5d => {
      const _0x192f82 = _0x5ebc5d['target']["closest"](".v2-crop-ratio-item");
      if (!_0x192f82) {
        return;
      }
      this["ratioMenuEl"]['querySelectorAll']('.v2-crop-ratio-item')["forEach"](_0x4d3914 => _0x4d3914["classList"]["remove"]("active"));
      _0x192f82["classList"]["add"]("active");
      this['ratioMenuEl']["classList"]["remove"]('open');
      const _0x572139 = _0x192f82["dataset"]["ratio"];
      const _0x146432 = _0x192f82["querySelector"](".floating-menu-label")?.["textContent"] || _0x192f82['textContent'];
      this["toolbarEl"]["querySelector"]('.ratio-text')["textContent"] = _0x146432;
      if (_0x572139 === "free") {
        this['aspectRatio'] = null;
        this['_updateView'](this["_view"]);
        return;
      }
      if (_0x572139 === "original") {
        this["aspectRatio"] = this["nodeData"]["width"] / this['nodeData']["height"];
      } else {
        const [_0x376015, _0xd83195] = _0x572139["split"](':')['map'](Number);
        if (!Number["isFinite"](_0x376015) || !Number["isFinite"](_0xd83195) || _0x376015 <= 0x0 || _0xd83195 <= 0x0) {
          this['aspectRatio'] = null;
          this["_updateView"](this["_view"]);
          return;
        }
        this['aspectRatio'] = _0x376015 / _0xd83195;
      }
      let _0x5a8a8e = this["cropRect"]['w'];
      let _0x597e45 = _0x5a8a8e / this['aspectRatio'];
      _0x597e45 > this['nodeData']['height'] && (_0x597e45 = this['nodeData']['height'], _0x5a8a8e = _0x597e45 * this['aspectRatio']);
      _0x5a8a8e > this["nodeData"]["width"] && (_0x5a8a8e = this["nodeData"]["width"], _0x597e45 = _0x5a8a8e / this["aspectRatio"]);
      this["cropRect"]['w'] = _0x5a8a8e;
      this["cropRect"]['h'] = _0x597e45;
      this["cropRect"]['x'] = this["nodeData"]['x'] + (this['nodeData']["width"] - _0x5a8a8e) / 0x2;
      this["cropRect"]['y'] = this['nodeData']['y'] + (this['nodeData']["height"] - _0x597e45) / 0x2;
      this["_updateView"](this["_view"]);
    };
    this["toolbarEl"]["querySelector"]('.confirm')["onclick"] = () => this["confirm"]();
    const _0x130e6b = _0x5d7943 => {
      !this['ratioMenuEl']["contains"](_0x5d7943['target']) && !_0x204fec["contains"](_0x5d7943["target"]) && this["ratioMenuEl"]['classList']['remove']("open");
    };
    document["addEventListener"]('pointerdown', _0x130e6b);
    this["cleanup"] = () => {
      window["removeEventListener"]("resize", _0x5850b6);
      window['removeEventListener']("keydown", _0x211e4d);
      window["removeEventListener"]("keyup", _0x355841);
      document["removeEventListener"]("pointerdown", _0x130e6b);
      this["overlayEl"]["removeEventListener"]("wheel", _0x2350af);
      this["overlayEl"]["removeEventListener"]("pointerdown", _0x3bb335, !![]);
      this["overlayEl"]["removeEventListener"]("pointermove", _0x3a32f9, !![]);
      this['overlayEl']["removeEventListener"]('pointerup', _0x139a53, !![]);
      this["overlayEl"]['removeEventListener']("pointercancel", _0x5d819b, !![]);
    };
  },
  '_subscribeLocaleChanges'() {
    if (this["_unsubscribeLocale"]) {
      return;
    }
    this["_unsubscribeLocale"] = onLocaleChange(() => this['_syncLocaleTexts']());
  },
  '_setButtonText'(_0x156f27, _0x59b762) {
    if (!_0x156f27) {
      return;
    }
    const _0x23591e = Array["from"](_0x156f27["childNodes"])["find"](_0x3062e4 => _0x3062e4['nodeType'] === 0x3);
    if (_0x23591e) {
      _0x23591e["textContent"] = '\x20' + _0x59b762;
      return;
    }
    _0x156f27["appendChild"](document['createTextNode']('\x20' + _0x59b762));
  },
  '_syncLocaleTexts'() {
    if (!this["toolbarEl"]) {
      return;
    }
    const _0x36c38a = this["toolbarEl"]['querySelector'](".exit");
    if (_0x36c38a) {
      _0x36c38a["title"] = imageCropText("actions.exit");
    }
    this["ratioMenuEl"]?.['querySelectorAll']('.v2-crop-ratio-item[data-ratio-label-key]')["forEach"](_0x3e4d21 => {
      const _0x4a227e = _0x3e4d21['dataset']["ratioLabelKey"];
      const _0x5bea0f = _0x3e4d21["querySelector"](".floating-menu-label");
      if (_0x4a227e && _0x5bea0f) {
        _0x5bea0f["textContent"] = imageCropText('ratios.' + _0x4a227e);
      }
    });
    const _0x4ae434 = this['ratioMenuEl']?.['querySelector'](".v2-crop-ratio-item.active .floating-menu-label");
    const _0x3e4778 = this["toolbarEl"]['querySelector'](".ratio-text");
    if (_0x4ae434 && _0x3e4778) {
      _0x3e4778["textContent"] = _0x4ae434['textContent'];
    }
    const _0x2797f2 = this["toolbarEl"]['querySelector'](".confirm");
    _0x2797f2 && !this['_isProcessingCrop'] && this["_setButtonText"](_0x2797f2, imageCropText("actions.confirm"));
  },
  'exit'() {
    if (!this["active"]) {
      return;
    }
    this["active"] = ![];
    this["_isProcessingCrop"] = ![];
    this["_unsubscribe"] && (this["_unsubscribe"](), this["_unsubscribe"] = null);
    this['_unsubscribeViewportPreview']?.();
    this['_unsubscribeViewportPreview'] = null;
    this["_unsubscribeLocale"] && (this['_unsubscribeLocale'](), this["_unsubscribeLocale"] = null);
    this["_containerEl"] = null;
    this["boxEl"] && (this["boxEl"]["_lastTransform"] = null);
    if (this["overlayEl"]) {
      this['overlayEl']["classList"]["remove"]('visible');
    }
    if (this["dimMaskEl"]) {
      this["dimMaskEl"]["classList"]["remove"]("visible");
    }
    setTimeout(() => {
      if (this['overlayEl']) {
        this['overlayEl']["remove"]();
      }
      if (this['toolbarEl']) {
        this["toolbarEl"]['remove']();
      }
      if (this["dimMaskEl"]) {
        this['dimMaskEl']['remove']();
      }
      if (this["sizeLabelEl"]) {
        this["sizeLabelEl"]["remove"]();
      }
      this["cleanup"]?.();
      this["overlayEl"] = null;
      this["boxEl"] = null;
      this['toolbarEl'] = null;
      this["ratioMenuEl"] = null;
      this['dimMaskEl'] = null;
      this["sizeLabelEl"] = null;
      this['_view'] = null;
      this["_redrawSelection"] = null;
    }, 0x12c);
  },
  async 'confirm'() {
    const _0x25ed9c = this['nodeData'];
    if (!_0x25ed9c) {
      return;
    }
    const _0x45a1fb = this["toolbarEl"]?.["querySelector"](".confirm");
    if (!_0x45a1fb) {
      return;
    }
    const _0x656837 = Array["from"](_0x45a1fb["childNodes"])['map'](_0x5f25c3 => _0x5f25c3['cloneNode'](!![]));
    this["_isProcessingCrop"] = !![];
    _0x45a1fb['textContent'] = imageCropText("actions.processing");
    _0x45a1fb["style"]['pointerEvents'] = "none";
    const _0x1b6a65 = Date["now"]();
    let _0x238733 = '';
    let _0x5daca5 = ![];
    let _0x3f6222 = ![];
    let _0x3a9d9f = '';
    let _0x516bec = null;
    try {
      const _0x57551e = {
        ...this["cropRect"]
      };
      const _0x15f338 = _0x25ed9c['id'];
      const _0xfe8d95 = _0x25ed9c["name"] || imageCropText("output.imageFallback");
      const _0x43838a = imageCropText('output.nodeName', {
        'name': _0xfe8d95
      });
      const _0xff6f74 = getAutoMediaSizeByShortSide(_0x57551e['w'], _0x57551e['h']);
      const _0x643497 = calcSafeSpawnPosNearNode(a1088_0x2997cc["getStateRaw"]()["nodes"], _0x25ed9c, _0xff6f74["width"], _0xff6f74['height']);
      _0x238733 = generateId("source-image-crop");
      addToolbarPendingResultNodes({
        'nodes': [buildSourceMediaNodePayload({
          'id': _0x238733,
          'type': "source-image",
          'x': _0x643497['x'],
          'y': _0x643497['y'],
          'width': _0xff6f74["width"],
          'height': _0xff6f74['height'],
          'name': _0x43838a,
          'src': '',
          'outputText': imageCropText('actions.processing'),
          ...buildGenerationStartPatch({
            'startedAt': _0x1b6a65
          }),
          'needsAutoResize': ![],
          'fixedSize': !![]
        })],
        'persist': ![]
      });
      const _0x264f64 = resolveImageCropSourceUrl(_0x25ed9c);
      const _0x4e7c73 = findLoadedCropImageElement(_0x15f338);
      this["exit"]();
      _0x5daca5 = !![];
      await waitForCropBackgroundFrame();
      if (!_0x4e7c73 && !_0x264f64) {
        throw new Error(imageCropText("errors.sourceLoadFailed"));
      }
      const _0x20df98 = _0x4e7c73 || (await this['_loadImage'](_0x264f64));
      const _0x1cf2fd = _0x20df98["naturalWidth"] / _0x25ed9c["width"];
      const _0x9fe647 = _0x20df98['naturalHeight'] / _0x25ed9c["height"];
      const _0x2f3844 = (_0x57551e['x'] - _0x25ed9c['x']) * _0x1cf2fd;
      const _0x7e934c = (_0x57551e['y'] - _0x25ed9c['y']) * _0x9fe647;
      const _0x42e45a = _0x57551e['w'] * _0x1cf2fd;
      const _0x17509e = _0x57551e['h'] * _0x9fe647;
      const _0x150424 = buildImageCropOutputSize(_0x42e45a, _0x17509e);
      const _0x5a89e1 = document['createElement']('canvas');
      _0x5a89e1["width"] = _0x150424['width'];
      _0x5a89e1["height"] = _0x150424["height"];
      const _0x51c2ad = _0x5a89e1['getContext']('2d');
      _0x51c2ad["drawImage"](_0x20df98, _0x2f3844, _0x7e934c, _0x42e45a, _0x17509e, 0x0, 0x0, _0x150424["width"], _0x150424['height']);
      const _0x24fd83 = await new Promise(_0x3854a8 => _0x5a89e1["toBlob"](_0x3854a8, "image/jpeg", 0.9));
      if (!_0x24fd83) {
        throw new Error(imageCropText("errors.sourceLoadFailed"));
      }
      const _0x310372 = new File([_0x24fd83], "crop_" + Date["now"]() + ".jpg", {
        'type': "image/jpeg"
      });
      _0x3a9d9f = URL['createObjectURL'](_0x24fd83);
      _0x516bec = Math["max"](0x0, Date["now"]() - _0x1b6a65);
      const _0x3fffee = buildImageGenerationResultPatch({
        'imageUrl': _0x3a9d9f,
        'sourceUrl': _0x3a9d9f,
        'fileName': _0x310372["name"]
      }, {
        'duration': _0x516bec
      }) || {};
      const _0x5e04e2 = {
        'outputType': "image",
        'url': _0x3a9d9f,
        'imageUrl': _0x3a9d9f,
        'sourceUrl': _0x3a9d9f,
        'thumbUrl': '',
        'localPath': '',
        'fileName': _0x310372['name']
      };
      updateToolbarResultNode(_0x238733, {
        'name': _0x43838a,
        ..._0x3fffee,
        'images': [_0x5e04e2],
        'src': _0x3a9d9f,
        'imageUrl': _0x3a9d9f,
        'sourceUrl': _0x3a9d9f,
        'thumbUrl': '',
        'capturePreviewUrl': _0x3a9d9f,
        'captureSavePending': !![],
        'captureSaveError': null,
        'localPath': '',
        'fileName': _0x310372["name"],
        'outputText': '',
        'needsAutoResize': ![],
        'fixedSize': !![]
      });
      _0x3f6222 = !![];
      await waitForCropBackgroundFrame();
      const _0x5449c2 = await saveOutputBlob(_0x310372, {
        'ext': "jpg"
      });
      const _0x34e547 = pickResultLocalPath(_0x5449c2);
      const _0x1e4067 = _0x5449c2["filename"] || _0x310372["name"];
      const _0x13191d = buildCanvasLocalImageFields({
        ..._0x5449c2,
        'localPath': _0x34e547,
        'imageUrl': _0x5449c2['displayUrl'] || _0x5449c2['thumbUrl'] || localPathToUrl(_0x34e547) || String(_0x5449c2["url"] || '')["trim"](),
        'sourceUrl': _0x5449c2["originalUrl"] || _0x5449c2["url"] || localPathToUrl(_0x34e547),
        'thumbUrl': _0x5449c2["thumbUrl"],
        'fileName': _0x1e4067
      }, {
        'includeSrc': !![]
      });
      const _0x298063 = _0x13191d["src"] || _0x13191d["imageUrl"] || localPathToUrl(_0x34e547) || String(_0x5449c2['url'] || '')["trim"]();
      updateToolbarResultNode(_0x238733, {
        'name': _0x43838a,
        ...(buildImageGenerationResultPatch({
          ..._0x5449c2,
          ..._0x13191d,
          'imageUrl': _0x13191d["imageUrl"] || _0x298063,
          'sourceUrl': _0x13191d["sourceUrl"] || _0x298063,
          'thumbUrl': _0x13191d["thumbUrl"] || _0x298063,
          'localPath': _0x13191d['localPath'] || _0x34e547,
          'fileName': _0x1e4067
        }, {
          'duration': _0x516bec
        }) || {}),
        ..._0x13191d,
        'src': _0x298063,
        'localPath': _0x13191d["localPath"] || _0x34e547,
        'capturePreviewUrl': '',
        'captureSavePending': ![],
        'captureSaveError': null,
        'fileName': _0x1e4067,
        'outputText': '',
        'needsAutoResize': ![],
        'fixedSize': !![]
      });
      persistToolbarResultNodes();
      _0x3a9d9f && (URL["revokeObjectURL"](_0x3a9d9f), _0x3a9d9f = '');
      window["showToast"]?.(imageCropText("toasts.success"), "success");
    } catch (_0x15ee6b) {
      console['error']('[Crop]\x20Failed:', _0x15ee6b);
      const _0x2943e0 = _0x15ee6b instanceof Error ? _0x15ee6b["message"] : String(_0x15ee6b || '');
      _0x238733 && (updateToolbarResultNode(_0x238733, {
        ...(buildImageGenerationFailurePatch({
          'error': _0x2943e0,
          'startedAt': _0x1b6a65,
          'clearMediaFields': !_0x3f6222
        }) || {}),
        'captureSavePending': ![],
        'captureSaveError': _0x2943e0,
        ...(_0x3f6222 ? {} : {
          'capturePreviewUrl': ''
        })
      }), persistToolbarResultNodes());
      window['showToast']?.(imageCropText('toasts.failed', {
        'error': _0x2943e0
      }), "error");
      this["_isProcessingCrop"] = ![];
      !_0x5daca5 && _0x45a1fb['isConnected'] && (_0x45a1fb["replaceChildren"](..._0x656837["map"](_0x2ea097 => _0x2ea097["cloneNode"](!![]))), _0x45a1fb['style']['pointerEvents'] = "auto");
    }
  },
  '_loadImage'(_0x3c38cb) {
    return new Promise((_0x1ca51c, _0x3904dd) => {
      const _0x4d5441 = new Image();
      _0x4d5441["crossOrigin"] = 'anonymous';
      _0x4d5441["onload"] = () => _0x1ca51c(_0x4d5441);
      _0x4d5441["onerror"] = () => _0x3904dd(new Error(imageCropText("errors.sourceLoadFailed")));
      _0x4d5441["src"] = _0x3c38cb;
    });
  }
};
export default ImageCropController;