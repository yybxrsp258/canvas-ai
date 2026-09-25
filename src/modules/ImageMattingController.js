import a1099_0x4c6068 from '../core/stores/appStore.js';
import { bindImageOverlayViewportPreview } from './imageOverlayViewportPreview.js';
import { onLocaleChange, t } from '../i18n/index.js';
import { saveOutputBlob } from './project.js';
import { generateId, screenToWorld, worldToScreen, isPointInRect } from '../core/math.js';
import { commit } from './history.js';
import { buildBinaryBoundaryMask, floodFillRegion, getCachedSealedFillRegion, paintFilledRegion, sealRegionToBoundary } from './bucketFill.js';
import { IMAGE_BRUSH_MAX_SIZE_PX, clampImageBrushSize, drawRoundBrushStroke, getEraserClearLineWidth, getBrushLineWidth, mapBrushPoints, syncCircularBrushCursor } from './imageEditorBrushStyle.js';
import { getPixelToolPalette } from './pixelToolPalette.js';
import { localPathToUrl, normalizeLocalPath, pickResultLocalPath } from '../utils/localMediaPath.js';
import { waitForImageElementReady } from './imageOverlayReadiness.js';
const getCssVar = _0x53fae7 => getComputedStyle(document["documentElement"])["getPropertyValue"](_0x53fae7)['trim']();
const DEFAULT_MATTING_BRUSH_SIZE_PX = 0x28;
const MAX_MATTING_BRUSH_SIZE_PX = IMAGE_BRUSH_MAX_SIZE_PX;
const OPAQUE_MASK_PREVIEW_CLEAR = 'black';
function imageMattingText(_0x4995b4, _0x73f61f = {}) {
  return t("imageMatting." + _0x4995b4, _0x73f61f);
}
function clampMattingBrushSize(_0x491ae5, _0x372bbb = DEFAULT_MATTING_BRUSH_SIZE_PX) {
  return clampImageBrushSize(_0x491ae5, _0x372bbb);
}
const isFiniteCommandPoint = _0x447f21 => Number["isFinite"](Number(_0x447f21?.['x'])) && Number["isFinite"](Number(_0x447f21?.['y']));
const hasDrawableStrokePoints = _0x2e0fc9 => Array["isArray"](_0x2e0fc9?.['points']) && _0x2e0fc9["points"]['some'](isFiniteCommandPoint);
const shouldDiscardStrokeCommand = _0x297dac => (_0x297dac?.['type'] === 'brush' || _0x297dac?.["type"] === "eraser") && !hasDrawableStrokePoints(_0x297dac);
const MATTING_TOOLBAR_HTML = "\n      <button class=\"v2-matting-btn icon-only act-cancel\" data-matting-tooltip=\"cancel\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"18\" height=\"18\"><path d=\"M18 6L6 18M6 6l12 12\"/></svg></button>\n      <div class=\"v2-matting-divider\"></div>\n      <button class=\"v2-matting-btn icon-only tool-btn active\" data-tool=\"brush\" data-brush-mode=\"normal\" data-matting-tooltip=\"brush\">\n        <svg class=\"brush-icon-normal\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"18\" height=\"18\"><path d=\"M12 20h9\"/><path d=\"M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z\"/></svg>\n        <svg class=\"brush-icon-alpha\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"18\" height=\"18\" style=\"display:none\"><path d=\"M12 20h9\"/><path d=\"M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z\"/><path d=\"M3 3h6v6H3z\" fill=\"currentColor\" fill-opacity=\"0.3\"/></svg>\n      </button>\n      <button class=\"v2-matting-btn icon-only tool-btn\" data-tool=\"eraser\" data-matting-tooltip=\"eraser\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"18\" height=\"18\"><path d=\"M20 20H7l-5-5a2 2 0 0 1 0-2.83l9.17-9.17a2 2 0 0 1 2.83 0L22 10a2 2 0 0 1 0 2.83L14.83 20\"/></svg></button>\n      <button class=\"v2-matting-btn icon-only tool-btn\" data-tool=\"bucket\" data-matting-tooltip=\"bucket\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"18\" height=\"18\"><path d=\"M19 11l-8-8-8.5 8.5a2.12 2.12 0 0 0 0 3l4 4a2.12 2.12 0 0 0 3 0L19 11z\"/><path d=\"M16 14l-3.5 3.5\"/><path d=\"M12 18l-2 2\"/><path d=\"M20 20l-2-2\"/></svg></button>\n      <div class=\"v2-matting-divider\"></div>\n      <div class=\"v2-matting-size\"><span class=\"v2-matting-size-value\"></span><input class=\"v2-matting-size-range\" type=\"range\" min=\"1\" max=\"" + MAX_MATTING_BRUSH_SIZE_PX + "\" step=\"1\"></div>\n      <div class=\"v2-matting-divider\"></div>\n      <button class=\"v2-matting-btn icon-only act-undo\" data-matting-tooltip=\"undo\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"18\" height=\"18\"><path d=\"M9 14l-4-4 4-4\"/><path d=\"M5 10h9a6 6 0 1 1 0 12h-3\"/></svg></button>\n      <button class=\"v2-matting-btn icon-only act-redo\" data-matting-tooltip=\"redo\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"18\" height=\"18\"><path d=\"M15 14l4-4-4-4\"/><path d=\"M19 10H10a6 6 0 1 0 0 12h3\"/></svg></button>\n      <button class=\"v2-matting-btn icon-only act-clear\" data-matting-tooltip=\"clear\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"18\" height=\"18\"><path d=\"M3 6h18\"/><path d=\"M8 6V4h8v2\"/><path d=\"M6 6l1 16h10l1-16\"/></svg></button>\n      <button class=\"v2-matting-btn v2-matting-save act-save\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"18\" height=\"18\"><path d=\"M19 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2Z\"/><path d=\"M17 21v-8H7v8\"/><path d=\"M7 3v4h8\"/></svg><span class=\"v2-matting-save-label\"></span></button>\n    ";
const ImageMattingController = {
  'active': ![],
  'nodeId': null,
  'nodeData': null,
  'overlayEl': null,
  'containerEl': null,
  'imgEl': null,
  'canvasEl': null,
  'toolbarEl': null,
  'sizeValueEl': null,
  'sizeRangeEl': null,
  'toolButtons': null,
  'cursorEl': null,
  '_cursorHover': ![],
  '_cursorLast': {
    'x': 0x0,
    'y': 0x0
  },
  '_cursorRaf': 0x0,
  '_unsubscribe': null,
  '_commands': [],
  '_redoStack': [],
  '_draft': null,
  '_dirty': ![],
  '_baseMaskCleared': ![],
  '_view': null,
  '_normalMaskCanvas': null,
  '_normalOverlayCanvas': null,
  '_alphaMaskCanvas': null,
  '_alphaOverlayCanvas': null,
  '_fillRegionCache': null,
  '_unsubscribeLocale': null,
  '_isSaving': ![],
  'init'(_0x57fd25) {
    if (this["active"]) {
      return;
    }
    const _0x59901c = a1099_0x4c6068["getStateRaw"]();
    const _0x5ded1d = _0x59901c["nodes"]?.[_0x57fd25];
    if (!_0x5ded1d) {
      return;
    }
    const _0x1f2131 = this["_resolveNodeImageUrl"](_0x5ded1d);
    if (!_0x1f2131) {
      window["showToast"]?.(imageMattingText("toasts.noImage"), 'warn');
      return;
    }
    const _0x208f9b = new Set(["brush", 'eraser', 'bucket']);
    const _0x269897 = _0x208f9b["has"](_0x59901c["matting"]?.["tool"]) ? _0x59901c["matting"]["tool"] : "brush";
    const _0x4efff4 = clampMattingBrushSize(_0x59901c["matting"]?.["brushSizePx"]);
    const _0x20f685 = _0x59901c["matting"]?.["brushMode"] || "normal";
    this["active"] = !![];
    this["nodeId"] = _0x57fd25;
    this['nodeData'] = _0x5ded1d;
    this["_commands"] = [];
    this["_redoStack"] = [];
    this['_draft'] = null;
    this['_dirty'] = ![];
    this["_baseMaskCleared"] = ![];
    this["_fillRegionCache"] = new Map();
    this["_isSaving"] = ![];
    this['_view'] = {
      'tool': _0x269897,
      'brushSizePx': _0x4efff4,
      'brushMode': _0x20f685,
      'viewport': _0x59901c['viewport'],
      'node': _0x5ded1d
    };
    a1099_0x4c6068["setMattingState"]({
      'active': !![],
      'nodeId': _0x57fd25,
      'tool': _0x269897,
      'brushSizePx': _0x4efff4,
      'brushMode': _0x20f685
    });
    this['_createUI'](_0x1f2131, {
      'tool': _0x269897,
      'brushSizePx': _0x4efff4,
      'brushMode': _0x20f685
    });
    this["_loadExistingMask"]();
    this['_bindEvents']();
    this['_unsubscribe'] = a1099_0x4c6068["subscribeSelector"](_0x47bdc7 => {
      const _0x485e65 = _0x47bdc7['nodes']?.[_0x57fd25];
      const _0x50f469 = _0x47bdc7["viewport"] || {
        'x': 0x0,
        'y': 0x0,
        'zoom': 0x1
      };
      const _0x440b71 = _0x47bdc7['matting'] || {};
      return {
        'hasNode': !!_0x485e65,
        'nx': _0x485e65 ? _0x485e65['x'] : 0x0,
        'ny': _0x485e65 ? _0x485e65['y'] : 0x0,
        'nw': _0x485e65 ? _0x485e65["width"] : 0x0,
        'nh': _0x485e65 ? _0x485e65['height'] : 0x0,
        'vx': _0x50f469['x'],
        'vy': _0x50f469['y'],
        'vz': _0x50f469['zoom'] || 0x1,
        'vox': _0x50f469["_screenOriginX"] || 0x0,
        'voy': _0x50f469['_screenOriginY'] || 0x0,
        'tool': _0x440b71['tool'] || "brush",
        'brushSizePx': clampMattingBrushSize(_0x440b71['brushSizePx']),
        'brushMode': _0x440b71['brushMode'] || "normal"
      };
    }, _0x4ac2fa => {
      if (!_0x4ac2fa?.["hasNode"]) {
        return;
      }
      this['_view'] = {
        'tool': _0x4ac2fa['tool'],
        'brushSizePx': _0x4ac2fa['brushSizePx'],
        'brushMode': _0x4ac2fa['brushMode'],
        'viewport': {
          'x': _0x4ac2fa['vx'],
          'y': _0x4ac2fa['vy'],
          'zoom': _0x4ac2fa['vz'],
          '_screenOriginX': _0x4ac2fa["vox"],
          '_screenOriginY': _0x4ac2fa["voy"]
        },
        'node': {
          'x': _0x4ac2fa['nx'],
          'y': _0x4ac2fa['ny'],
          'width': _0x4ac2fa['nw'],
          'height': _0x4ac2fa['nh']
        }
      };
      this["_updateView"](this["_view"]);
    });
    this['_unsubscribeViewportPreview'] = bindImageOverlayViewportPreview({
      'getView': () => this["_view"],
      'updateView': _0x2de321 => {
        this["_view"] = _0x2de321;
        this["_updateView"](_0x2de321);
      }
    });
    this["_waitForImageAndShow"]();
  },
  '_waitForImageAndShow'() {
    this["_cancelImageReadyWait"]?.();
    this['overlayEl']?.["classList"]["add"]("visible");
    this["_cancelImageReadyWait"] = waitForImageElementReady({
      'image': this["imgEl"],
      'onReady': () => {
        this["_cancelImageReadyWait"] = null;
        if (this['active'] && this["_view"]) {
          this["_updateView"](this["_view"]);
        }
      },
      'onError': () => {
        this["_cancelImageReadyWait"] = null;
        if (!this['active']) {
          return;
        }
        window["showToast"]?.(imageMattingText("errors.imageLoadFailed"), 'error');
        this["exit"]({
          'silent': !![]
        });
      }
    });
  },
  'exit'({
    silent = ![]
  } = {}) {
    if (!this['active']) {
      return;
    }
    this['_unsubscribeViewportPreview']?.();
    this["_unsubscribeViewportPreview"] = null;
    this["_cancelImageReadyWait"]?.();
    this["_cancelImageReadyWait"] = null;
    !silent && this['_dirty'] && window["showToast"]?.(imageMattingText("toasts.cancelled"), 'ok');
    this['active'] = ![];
    this["nodeId"] = null;
    this["nodeData"] = null;
    this["_commands"] = [];
    this["_redoStack"] = [];
    this['_draft'] = null;
    this["_dirty"] = ![];
    this["_normalMaskCanvas"] = null;
    this["_normalOverlayCanvas"] = null;
    this["_alphaMaskCanvas"] = null;
    this['_alphaOverlayCanvas'] = null;
    this["_unsubscribeLocale"]?.();
    this['_unsubscribeLocale'] = null;
    this["_isSaving"] = ![];
    this["_fillRegionCache"] = null;
    a1099_0x4c6068["setMattingState"]({
      'active': ![],
      'nodeId': null
    });
    this['_unsubscribe'] && (this["_unsubscribe"](), this["_unsubscribe"] = null);
    if (this['overlayEl']) {
      this['overlayEl']["remove"]();
    }
    if (this["toolbarEl"]) {
      this["toolbarEl"]["remove"]();
    }
    this["overlayEl"] = null;
    this["containerEl"] = null;
    this["imgEl"] = null;
    this["canvasEl"] = null;
    this["toolbarEl"] = null;
    this["sizeValueEl"] = null;
    this['sizeRangeEl'] = null;
    this["toolButtons"] = null;
    this['cursorEl'] = null;
    this["_cursorHover"] = ![];
    this["_cursorLast"] = {
      'x': 0x0,
      'y': 0x0
    };
    this["_cursorRaf"] = 0x0;
    this['_view'] = null;
  },
  '_createUI'(_0x3d0a06, _0x41e336 = {}) {
    const _0xdebe4b = document['createElement']('div');
    _0xdebe4b["className"] = "v2-matting-overlay";
    const _0x3a895d = document["createElement"]("div");
    _0x3a895d["className"] = "v2-matting-container";
    const _0x72a55a = document["createElement"]("img");
    _0x72a55a["className"] = "v2-matting-img";
    _0x72a55a['src'] = _0x3d0a06;
    _0x72a55a['draggable'] = ![];
    const _0x1129be = document["createElement"]("canvas");
    _0x1129be["className"] = "v2-matting-canvas";
    const _0x3d9ffb = document["createElement"]("div");
    _0x3d9ffb["className"] = "v2-matting-cursor";
    _0x3d9ffb["style"]["display"] = 'none';
    _0x3a895d["appendChild"](_0x72a55a);
    _0x3a895d["appendChild"](_0x1129be);
    _0xdebe4b["appendChild"](_0x3d9ffb);
    _0xdebe4b["appendChild"](_0x3a895d);
    document['body']["appendChild"](_0xdebe4b);
    this["overlayEl"] = _0xdebe4b;
    this["containerEl"] = _0x3a895d;
    this["imgEl"] = _0x72a55a;
    this['canvasEl'] = _0x1129be;
    this["cursorEl"] = _0x3d9ffb;
    const _0x37adcf = document["createElement"]("div");
    _0x37adcf['className'] = "v2-matting-toolbar";
    _0x37adcf['innerHTML'] = MATTING_TOOLBAR_HTML;
    document['body']['appendChild'](_0x37adcf);
    this['toolbarEl'] = _0x37adcf;
    this["sizeValueEl"] = _0x37adcf['querySelector'](".v2-matting-size-value");
    this["sizeRangeEl"] = _0x37adcf["querySelector"](".v2-matting-size-range");
    this["toolButtons"] = Array["from"](_0x37adcf["querySelectorAll"]('.tool-btn'));
    this["_subscribeLocaleChanges"]();
    this["_syncLocaleTexts"]();
    const _0x4ca4ae = clampMattingBrushSize(_0x41e336["brushSizePx"]);
    const _0x2df3da = _0x41e336['tool'] || "brush";
    this["sizeRangeEl"]["value"] = String(_0x4ca4ae);
    this["sizeValueEl"]["textContent"] = String(_0x4ca4ae);
    this["_updateToolActive"](_0x2df3da, _0x4ca4ae);
    if (this["_view"]) {
      this["_updateView"](this["_view"]);
    }
  },
  '_bindEvents'() {
    const _0x1b5aa4 = _0xc572c => {
      const _0x52fd22 = this['canvasEl'] && (_0xc572c["target"] === this["canvasEl"] || this["canvasEl"]["contains"](_0xc572c['target']));
      if (_0x52fd22) {
        this['_onCanvasWheel'](_0xc572c);
        return;
      }
      _0xc572c["preventDefault"]();
      _0xc572c['stopPropagation']();
    };
    this["overlayEl"]['addEventListener']("wheel", _0x1b5aa4, {
      'passive': ![]
    });
    const _0x4ab675 = () => {
      if (this['_view']) {
        this["_updateView"](this["_view"]);
      }
    };
    window["addEventListener"]("resize", _0x4ab675);
    const _0x2bdd4e = () => {
      window['removeEventListener']("resize", _0x4ab675);
      this['overlayEl']?.["removeEventListener"]("wheel", _0x1b5aa4);
    };
    const _0x174d30 = this["exit"]["bind"](this);
    this["exit"] = (_0x13665d = {}) => {
      _0x2bdd4e();
      _0x174d30(_0x13665d);
    };
    this["toolbarEl"]['addEventListener']("pointerdown", _0x562b99 => _0x562b99["stopPropagation"]());
    this["toolbarEl"]["querySelector"](".act-cancel")["addEventListener"]('click', _0x4921d0 => {
      _0x4921d0["stopPropagation"]();
      this["exit"]();
    });
    this['toolButtons']["forEach"](_0x5a8010 => {
      _0x5a8010["addEventListener"]("click", _0x71123d => {
        _0x71123d["stopPropagation"]();
        const _0x4f5bbb = _0x5a8010["dataset"]["tool"];
        this["_switchTool"](_0x4f5bbb);
      });
    });
    this['sizeRangeEl']["addEventListener"]("input", _0x42feb4 => {
      const _0x37c9a9 = clampMattingBrushSize(_0x42feb4["target"]["value"], 0x1);
      a1099_0x4c6068["setMattingState"]({
        'brushSizePx': _0x37c9a9
      });
      this['sizeValueEl']["textContent"] = String(_0x37c9a9);
      this["_syncCursor"]();
    });
    this["toolbarEl"]["querySelector"](".act-undo")["addEventListener"]("click", _0x421fa5 => {
      _0x421fa5["stopPropagation"]();
      this["_undo"]();
    });
    this["toolbarEl"]["querySelector"](".act-redo")["addEventListener"]("click", _0x18465e => {
      _0x18465e["stopPropagation"]();
      this['_redo']();
    });
    this["toolbarEl"]["querySelector"](".act-clear")["addEventListener"]("click", _0x424299 => {
      _0x424299["stopPropagation"]();
      this["_clear"]();
    });
    this["toolbarEl"]["querySelector"](".act-save")["addEventListener"]("click", async _0x1183bb => {
      _0x1183bb['stopPropagation']();
      await this["_save"]();
    });
    const _0x493b63 = this['canvasEl']["getContext"]('2d');
    _0x493b63["lineCap"] = "round";
    _0x493b63["lineJoin"] = "round";
    const _0x535d63 = {
      'down': ![],
      'pointerId': null
    };
    const _0x2b731a = (_0x5da198, _0x266bbe) => {
      this["_cursorLast"] = {
        'x': _0x5da198,
        'y': _0x266bbe
      };
      if (this['_cursorRaf']) {
        return;
      }
      this['_cursorRaf'] = requestAnimationFrame(() => {
        this["_cursorRaf"] = 0x0;
        this["_syncCursor"]();
      });
    };
    const _0x5da752 = (_0xac88a1, _0x184fc8, _0x4f6972, _0x4433e0 = 0x0) => {
      const _0x10a47b = a1099_0x4c6068["getStateRaw"]();
      const _0x28de3f = _0x10a47b["nodes"]?.[this["nodeId"]];
      if (!_0x28de3f) {
        return ![];
      }
      const _0x66f1a6 = screenToWorld(_0xac88a1, _0x184fc8, _0x10a47b["viewport"]);
      if (!isPointInRect(_0x66f1a6['x'], _0x66f1a6['y'], _0x28de3f['x'], _0x28de3f['y'], _0x28de3f['width'], _0x28de3f["height"])) {
        return ![];
      }
      const _0x5b78e2 = {
        'x': _0x66f1a6['x'] - _0x28de3f['x'],
        'y': _0x66f1a6['y'] - _0x28de3f['y']
      };
      const _0x4979a2 = _0x10a47b["matting"]?.["tool"] || "brush";
      if (_0x4979a2 === "bucket") {
        const _0x5408ab = clampMattingBrushSize(_0x10a47b["matting"]?.['brushSizePx']);
        const _0x12ad48 = _0x5408ab / (_0x10a47b['viewport']["zoom"] || 0x1);
        this["_fillArea"](_0x5b78e2, _0x12ad48);
        return !![];
      }
      const _0x4e8120 = clampMattingBrushSize(_0x10a47b["matting"]?.["brushSizePx"]);
      const _0x33bcc8 = _0x4e8120 / (_0x10a47b["viewport"]["zoom"] || 0x1);
      const _0x2a9eec = _0x10a47b['matting']?.["brushMode"] || "normal";
      _0x4979a2 === 'eraser' ? this["_draft"] = {
        'type': "eraser",
        'sizeWorld': _0x33bcc8,
        'points': [_0x5b78e2]
      } : this["_draft"] = {
        'type': 'brush',
        'sizeWorld': _0x33bcc8,
        'points': [_0x5b78e2],
        'mode': _0x2a9eec
      };
      _0x535d63["down"] = !![];
      _0x535d63['pointerId'] = _0x4f6972;
      this['canvasEl']["setPointerCapture"](_0x4f6972);
      this["_render"]();
      return !![];
    };
    const _0x380e01 = (_0x1b40e3, _0x3132f6) => {
      if (!_0x535d63['down'] || !this["_draft"]) {
        return;
      }
      const _0x1cc93a = a1099_0x4c6068['getStateRaw']();
      const _0x52a9c0 = _0x1cc93a["nodes"]?.[this["nodeId"]];
      if (!_0x52a9c0) {
        return;
      }
      const _0x5cd102 = screenToWorld(_0x1b40e3, _0x3132f6, _0x1cc93a["viewport"]);
      const _0x11615c = {
        'x': _0x5cd102['x'] - _0x52a9c0['x'],
        'y': _0x5cd102['y'] - _0x52a9c0['y']
      };
      this["_draft"]['points']["push"](_0x11615c);
      this["_render"]();
    };
    const _0x14d2ef = () => {
      if (!_0x535d63["down"] || !this['_draft']) {
        return;
      }
      const _0x38fbf7 = this['_draft'];
      this["_draft"] = null;
      _0x535d63['down'] = ![];
      _0x535d63["pointerId"] = null;
      if (shouldDiscardStrokeCommand(_0x38fbf7)) {
        this["_render"]();
        return;
      }
      this["_commands"]["push"](_0x38fbf7);
      this["_redoStack"] = [];
      this['_dirty'] = !![];
      this["_render"]();
    };
    this["canvasEl"]["addEventListener"]("pointerdown", _0x2a90b4 => {
      _0x2a90b4['preventDefault']();
      _0x2a90b4["stopPropagation"]();
      _0x2b731a(_0x2a90b4['clientX'], _0x2a90b4["clientY"]);
      _0x5da752(_0x2a90b4["clientX"], _0x2a90b4["clientY"], _0x2a90b4['pointerId'], _0x2a90b4['button']);
    });
    this["canvasEl"]['addEventListener']("pointermove", _0x25f73c => {
      _0x25f73c['preventDefault']();
      _0x25f73c["stopPropagation"]();
      _0x2b731a(_0x25f73c["clientX"], _0x25f73c["clientY"]);
      _0x380e01(_0x25f73c['clientX'], _0x25f73c["clientY"]);
    });
    this["canvasEl"]['addEventListener']("pointerup", _0x1a2e98 => {
      _0x1a2e98["preventDefault"]();
      _0x1a2e98["stopPropagation"]();
      _0x2b731a(_0x1a2e98["clientX"], _0x1a2e98['clientY']);
      _0x14d2ef();
    });
    this["canvasEl"]['addEventListener']("pointercancel", _0x15a01c => {
      _0x15a01c['preventDefault']();
      _0x15a01c["stopPropagation"]();
      _0x2b731a(_0x15a01c["clientX"], _0x15a01c["clientY"]);
      _0x14d2ef();
    });
    this["canvasEl"]["addEventListener"]("pointerenter", _0x2d1a05 => {
      this["_cursorHover"] = !![];
      _0x2b731a(_0x2d1a05["clientX"], _0x2d1a05["clientY"]);
    });
    this["canvasEl"]["addEventListener"]('pointerleave', () => {
      this["_cursorHover"] = ![];
      this['_syncCursor']();
    });
  },
  '_onCanvasWheel'(_0x28ea38) {
    _0x28ea38["preventDefault"]();
    _0x28ea38['stopPropagation']();
    if (!this["active"]) {
      return;
    }
    if (!this["_cursorHover"]) {
      return;
    }
    const _0x40ebd5 = this['_view']?.["tool"] || 'brush';
    if (_0x40ebd5 !== "brush" && _0x40ebd5 !== "eraser" && _0x40ebd5 !== 'bucket') {
      return;
    }
    const _0x17bc26 = _0x28ea38['deltaY'] || 0x0;
    const _0x49e7fe = _0x17bc26 < 0x0 ? 0x1 : -0x1;
    const _0x5d3a39 = clampMattingBrushSize(this["_view"]?.["brushSizePx"]);
    const _0x1e20a5 = clampMattingBrushSize(_0x5d3a39 + _0x49e7fe * 0x2);
    if (_0x1e20a5 === _0x5d3a39) {
      return;
    }
    a1099_0x4c6068['setMattingState']({
      'brushSizePx': _0x1e20a5
    });
    if (this['sizeRangeEl']) {
      this["sizeRangeEl"]["value"] = String(_0x1e20a5);
    }
    if (this['sizeValueEl']) {
      this["sizeValueEl"]["textContent"] = String(_0x1e20a5);
    }
    this["_syncCursor"]();
  },
  '_syncCursor'(_0x1fbfcd = this['_view']?.["tool"] || "brush", _0x40897f = this['_view']?.["brushSizePx"] || DEFAULT_MATTING_BRUSH_SIZE_PX) {
    if (!this['cursorEl']) {
      return;
    }
    syncCircularBrushCursor({
      'cursorEl': this["cursorEl"],
      'canvasEl': this['canvasEl'],
      'visible': this["_cursorHover"],
      'tool': _0x1fbfcd,
      'allowedTools': ["brush", "eraser", "bucket"],
      'sizePx': _0x40897f,
      'cursorLast': this["_cursorLast"]
    });
  },
  '_subscribeLocaleChanges'() {
    if (this["_unsubscribeLocale"]) {
      return;
    }
    this['_unsubscribeLocale'] = onLocaleChange(() => this["_syncLocaleTexts"]());
  },
  '_syncLocaleTexts'() {
    if (!this["toolbarEl"]) {
      return;
    }
    this['toolbarEl']['querySelectorAll']("[data-matting-tooltip]")["forEach"](_0x3915aa => {
      const _0x5b24e0 = _0x3915aa["dataset"]["mattingTooltip"];
      if (!_0x5b24e0) {
        return;
      }
      let _0x54270e = imageMattingText("tooltips." + _0x5b24e0);
      _0x5b24e0 === "brush" && (_0x54270e = _0x3915aa['dataset']['brushMode'] === "alpha" ? imageMattingText("tooltips.brushAlphaToggle") : imageMattingText('tooltips.brushNormal'));
      _0x3915aa["dataset"]["tooltip"] = _0x54270e;
    });
    const _0x27ec27 = this["toolbarEl"]['querySelector']('.v2-matting-save-label');
    _0x27ec27 && !this["_isSaving"] && (_0x27ec27['textContent'] = imageMattingText('actions.save'));
  },
  '_switchTool'(_0x55fef8) {
    const _0x5c67b5 = this["toolButtons"]['find'](_0x1a4442 => _0x1a4442["dataset"]["tool"] === _0x55fef8);
    if (!_0x5c67b5) {
      return;
    }
    if (_0x5c67b5['disabled']) {
      return;
    }
    const _0x2ff6ac = a1099_0x4c6068["getState"]();
    const _0x580e9c = _0x2ff6ac["matting"]?.['tool'];
    if (_0x55fef8 === "brush") {
      if (_0x580e9c === 'brush') {
        const _0x11ad79 = _0x5c67b5['dataset']["brushMode"] || "normal";
        const _0x41d424 = _0x11ad79 === 'normal' ? "alpha" : 'normal';
        _0x5c67b5["dataset"]["brushMode"] = _0x41d424;
        a1099_0x4c6068["setMattingState"]({
          'tool': _0x55fef8,
          'brushMode': _0x41d424
        });
        _0x5c67b5["dataset"]["tooltip"] = _0x41d424 === 'normal' ? imageMattingText("tooltips.brushNormalToggle") : imageMattingText('tooltips.brushAlphaToggle');
        const _0x4dda48 = _0x5c67b5['querySelector']('.brush-icon-normal');
        const _0x23e9a1 = _0x5c67b5["querySelector"](".brush-icon-alpha");
        _0x4dda48 && _0x23e9a1 && (_0x4dda48['style']["display"] = _0x41d424 === "normal" ? "block" : 'none', _0x23e9a1["style"]["display"] = _0x41d424 === "alpha" ? 'block' : "none");
      } else {
        a1099_0x4c6068["setMattingState"]({
          'tool': _0x55fef8
        });
      }
    } else {
      a1099_0x4c6068["setMattingState"]({
        'tool': _0x55fef8
      });
    }
    this["_updateToolActive"]();
  },
  '_changeBrushSize'(_0x4cf33b) {
    const _0x18fbac = clampMattingBrushSize(this["_view"]?.["brushSizePx"]);
    const _0x43782a = clampMattingBrushSize(_0x18fbac + _0x4cf33b);
    if (_0x43782a !== _0x18fbac) {
      a1099_0x4c6068["setMattingState"]({
        'brushSizePx': _0x43782a
      });
      if (this["sizeRangeEl"]) {
        this['sizeRangeEl']["value"] = String(_0x43782a);
      }
      if (this['sizeValueEl']) {
        this["sizeValueEl"]["textContent"] = String(_0x43782a);
      }
      this["_syncCursor"]();
    }
  },
  '_updateToolActive'(_0x219bd3 = this["_view"]?.["tool"] || "brush", _0x3d2cde = this["_view"]?.["brushSizePx"] || DEFAULT_MATTING_BRUSH_SIZE_PX) {
    this["toolButtons"]['forEach'](_0x5da60b => {
      if (_0x5da60b['dataset']['tool'] === _0x219bd3) {
        _0x5da60b["classList"]["add"]("active");
      } else {
        _0x5da60b['classList']['remove']("active");
      }
    });
    this["_syncCursor"](_0x219bd3, _0x3d2cde);
  },
  '_updateView'(_0x7a5447) {
    if (!this['active']) {
      return;
    }
    const _0x495eb6 = _0x7a5447?.["node"];
    const _0x2db0b3 = _0x7a5447?.["viewport"];
    if (!_0x495eb6) {
      return;
    }
    this["nodeData"] = _0x495eb6;
    const _0x3fafed = clampMattingBrushSize(_0x7a5447?.['brushSizePx']);
    if (this["sizeRangeEl"] && Number(this["sizeRangeEl"]["value"]) !== _0x3fafed) {
      this["sizeRangeEl"]["value"] = String(_0x3fafed);
    }
    if (this["sizeValueEl"] && this['sizeValueEl']["textContent"] !== String(_0x3fafed)) {
      this['sizeValueEl']["textContent"] = String(_0x3fafed);
    }
    this["_updateToolActive"](_0x7a5447?.["tool"], _0x3fafed);
    const _0x509c14 = worldToScreen(_0x495eb6['x'], _0x495eb6['y'], _0x2db0b3);
    const _0x8755ba = Math["round"](_0x495eb6["width"] * _0x2db0b3["zoom"]);
    const _0x3f4320 = Math["round"](_0x495eb6["height"] * _0x2db0b3["zoom"]);
    this["containerEl"]["style"]["left"] = Math['round'](_0x509c14['x']) + 'px';
    this["containerEl"]["style"]['top'] = Math["round"](_0x509c14['y']) + 'px';
    this['containerEl']['style']['width'] = _0x8755ba + 'px';
    this["containerEl"]["style"]["height"] = _0x3f4320 + 'px';
    const _0x122261 = window["devicePixelRatio"] || 0x1;
    const _0x51903c = Math["max"](0x1, _0x8755ba);
    const _0x38cf10 = Math["max"](0x1, _0x3f4320);
    if (this["canvasEl"]["width"] !== Math['round'](_0x51903c * _0x122261) || this["canvasEl"]["height"] !== Math["round"](_0x38cf10 * _0x122261)) {
      this["canvasEl"]["width"] = Math['round'](_0x51903c * _0x122261);
      this["canvasEl"]["height"] = Math['round'](_0x38cf10 * _0x122261);
      this["canvasEl"]["style"]['width'] = _0x51903c + 'px';
      this['canvasEl']["style"]["height"] = _0x38cf10 + 'px';
      const _0x4b059a = this["canvasEl"]["getContext"]('2d');
      _0x4b059a["setTransform"](_0x122261, 0x0, 0x0, _0x122261, 0x0, 0x0);
      _0x4b059a["lineCap"] = "round";
      _0x4b059a["lineJoin"] = "round";
    }
    const _0x54a9c9 = Math["max"](0xc, Math["round"](_0x509c14['y']) - 0x36);
    this['toolbarEl']['style']["left"] = Math["round"](_0x509c14['x'] + _0x8755ba / 0x2) + 'px';
    this["toolbarEl"]["style"]["top"] = _0x54a9c9 + 'px';
    this["_render"](_0x2db0b3);
  },
  '_render'(_0x22ebd5 = this["_view"]?.["viewport"]) {
    if (!this["active"] || !this['canvasEl']) {
      return;
    }
    const _0x5ceb3b = this["canvasEl"]["getContext"]('2d');
    const _0x392ddc = Number(this["canvasEl"]["style"]["width"]['replace']('px', '')) || 0x1;
    const _0x463c09 = Number(this["canvasEl"]["style"]["height"]["replace"]('px', '')) || 0x1;
    _0x5ceb3b["clearRect"](0x0, 0x0, _0x392ddc, _0x463c09);
    const _0x156420 = this['_commands'];
    const _0x170b3c = this["_prepareNormalMaskCanvas"](_0x392ddc, _0x463c09);
    const _0x30ba20 = this["_prepareAlphaMaskCanvas"](_0x392ddc, _0x463c09);
    this['_renderCommands'](_0x5ceb3b, _0x22ebd5, _0x156420, ![], {
      'normalMaskCtx': _0x170b3c,
      'alphaMaskCtx': _0x30ba20,
      'boundarySource': _0x156420
    });
    if (this["_draft"]) {
      const _0x25a48c = _0x156420["concat"]([this["_draft"]]);
      this['_renderCommands'](_0x5ceb3b, _0x22ebd5, [this['_draft']], !![], {
        'normalMaskCtx': _0x170b3c,
        'alphaMaskCtx': _0x30ba20,
        'boundarySource': _0x25a48c
      });
    }
    this["_compositeNormalMask"](_0x5ceb3b, _0x392ddc, _0x463c09);
    this['_compositeAlphaMask'](_0x5ceb3b, _0x22ebd5, _0x392ddc, _0x463c09);
  },
  '_prepareNormalMaskCanvas'(_0x59082c, _0x4c2bf3) {
    const _0x3f81b0 = Math["max"](0x1, Math["round"](_0x59082c || 0x1));
    const _0x416be9 = Math["max"](0x1, Math["round"](_0x4c2bf3 || 0x1));
    if (!this["_normalMaskCanvas"] || this["_normalMaskCanvas"]["width"] !== _0x3f81b0 || this["_normalMaskCanvas"]["height"] !== _0x416be9) {
      const _0x290cb8 = document['createElement']("canvas");
      _0x290cb8["width"] = _0x3f81b0;
      _0x290cb8['height'] = _0x416be9;
      this["_normalMaskCanvas"] = _0x290cb8;
    }
    if (!this["_normalOverlayCanvas"] || this["_normalOverlayCanvas"]['width'] !== _0x3f81b0 || this["_normalOverlayCanvas"]['height'] !== _0x416be9) {
      const _0x5aea03 = document["createElement"]("canvas");
      _0x5aea03["width"] = _0x3f81b0;
      _0x5aea03["height"] = _0x416be9;
      this["_normalOverlayCanvas"] = _0x5aea03;
    }
    const _0x2eb4ce = this["_normalMaskCanvas"]["getContext"]('2d');
    if (!_0x2eb4ce) {
      return null;
    }
    _0x2eb4ce['clearRect'](0x0, 0x0, _0x3f81b0, _0x416be9);
    _0x2eb4ce["lineCap"] = "round";
    _0x2eb4ce['lineJoin'] = 'round';
    return _0x2eb4ce;
  },
  '_prepareAlphaMaskCanvas'(_0x4353bf, _0x3c220e) {
    const _0x3f85ce = Math['max'](0x1, Math["round"](_0x4353bf || 0x1));
    const _0x410f08 = Math["max"](0x1, Math["round"](_0x3c220e || 0x1));
    if (!this['_alphaMaskCanvas'] || this["_alphaMaskCanvas"]["width"] !== _0x3f85ce || this["_alphaMaskCanvas"]["height"] !== _0x410f08) {
      const _0x21c7fb = document["createElement"]("canvas");
      _0x21c7fb["width"] = _0x3f85ce;
      _0x21c7fb['height'] = _0x410f08;
      this["_alphaMaskCanvas"] = _0x21c7fb;
    }
    if (!this["_alphaOverlayCanvas"] || this['_alphaOverlayCanvas']['width'] !== _0x3f85ce || this["_alphaOverlayCanvas"]['height'] !== _0x410f08) {
      const _0x2d7ad5 = document["createElement"]('canvas');
      _0x2d7ad5["width"] = _0x3f85ce;
      _0x2d7ad5['height'] = _0x410f08;
      this["_alphaOverlayCanvas"] = _0x2d7ad5;
    }
    const _0x5a02bb = this['_alphaMaskCanvas']["getContext"]('2d');
    if (!_0x5a02bb) {
      return null;
    }
    _0x5a02bb["clearRect"](0x0, 0x0, _0x3f85ce, _0x410f08);
    _0x5a02bb["lineCap"] = 'round';
    _0x5a02bb["lineJoin"] = 'round';
    return _0x5a02bb;
  },
  '_compositeNormalMask'(_0x415074, _0xf2bdc8, _0x2a401b) {
    if (!_0x415074 || !this["_normalMaskCanvas"] || !this['_normalOverlayCanvas']) {
      return;
    }
    const _0x5c3605 = Math["max"](0x1, Number(_0xf2bdc8) || 0x1);
    const _0x31d7ff = Math['max'](0x1, Number(_0x2a401b) || 0x1);
    const _0x5b5189 = this['_normalOverlayCanvas']["getContext"]('2d');
    if (!_0x5b5189) {
      return;
    }
    const _0x1e1be6 = getPixelToolPalette();
    _0x5b5189['clearRect'](0x0, 0x0, _0x5c3605, _0x31d7ff);
    _0x5b5189["save"]();
    _0x5b5189['globalCompositeOperation'] = "source-over";
    _0x5b5189["globalAlpha"] = 0x1;
    _0x5b5189["fillStyle"] = _0x1e1be6["maskPreviewFill"];
    _0x5b5189["fillRect"](0x0, 0x0, _0x5c3605, _0x31d7ff);
    _0x5b5189["globalCompositeOperation"] = "destination-in";
    _0x5b5189["drawImage"](this["_normalMaskCanvas"], 0x0, 0x0, _0x5c3605, _0x31d7ff);
    _0x5b5189["restore"]();
    _0x415074["save"]();
    _0x415074["globalCompositeOperation"] = "source-over";
    _0x415074["globalAlpha"] = 0x1;
    _0x415074["drawImage"](this["_normalOverlayCanvas"], 0x0, 0x0, _0x5c3605, _0x31d7ff);
    _0x415074['restore']();
  },
  '_compositeAlphaMask'(_0x578036, _0x1b7ab6, _0x5ad3ff, _0x1e0ba7) {
    if (!_0x578036 || !this["_alphaMaskCanvas"] || !this["_alphaOverlayCanvas"]) {
      return;
    }
    const _0x42584f = Math["max"](0x1, Number(_0x5ad3ff) || 0x1);
    const _0xd4d46f = Math["max"](0x1, Number(_0x1e0ba7) || 0x1);
    const _0x2f67c1 = this["_alphaOverlayCanvas"]["getContext"]('2d');
    if (!_0x2f67c1) {
      return;
    }
    _0x2f67c1["clearRect"](0x0, 0x0, _0x42584f, _0xd4d46f);
    const _0x40fc41 = _0x1b7ab6?.['zoom'] || 0x1;
    const _0x1ed82f = this["_createCheckerboardPattern"](_0x2f67c1, _0x40fc41);
    _0x2f67c1["save"]();
    _0x2f67c1["globalCompositeOperation"] = "source-over";
    _0x2f67c1['globalAlpha'] = 0.8;
    _0x2f67c1["fillStyle"] = _0x1ed82f;
    _0x2f67c1["fillRect"](0x0, 0x0, _0x42584f, _0xd4d46f);
    _0x2f67c1["globalCompositeOperation"] = "destination-in";
    _0x2f67c1["globalAlpha"] = 0x1;
    _0x2f67c1["drawImage"](this["_alphaMaskCanvas"], 0x0, 0x0, _0x42584f, _0xd4d46f);
    _0x2f67c1["restore"]();
    _0x578036["save"]();
    _0x578036['globalCompositeOperation'] = "source-over";
    _0x578036['globalAlpha'] = 0x1;
    _0x578036['drawImage'](this['_alphaOverlayCanvas'], 0x0, 0x0, _0x42584f, _0xd4d46f);
    _0x578036["restore"]();
  },
  '_renderCommands'(_0x38ddd6, _0x355014, _0x258df0, _0xf5e1d4 = ![], _0x36e144 = {}) {
    const _0x2d58e1 = _0x355014['zoom'] || 0x1;
    const _0x3d6ade = Number(this['canvasEl']?.["style"]?.["width"]?.["replace"]('px', '')) || 0x1;
    const _0x5a855a = Number(this["canvasEl"]?.['style']?.["height"]?.['replace']('px', '')) || 0x1;
    const _0x150152 = getPixelToolPalette();
    const _0x3e68a3 = _0x36e144["normalMaskCtx"] || null;
    const _0x282d27 = _0x36e144['alphaMaskCtx'] || null;
    const _0x1b13b4 = Array["isArray"](_0x36e144['boundarySource']) ? _0x36e144["boundarySource"] : _0x258df0;
    _0x258df0["forEach"]((_0x21f52b, _0x2263e4) => {
      if (_0x21f52b['type'] === "mask-preview") {
        if (!_0x21f52b["img"]) {
          return;
        }
        const _0x3dabef = Number(this["canvasEl"]?.["style"]?.["width"]?.["replace"]('px', '')) || 0x1;
        const _0x5e6513 = Number(this['canvasEl']?.["style"]?.["height"]?.["replace"]('px', '')) || 0x1;
        _0x38ddd6["save"]();
        _0x38ddd6["globalCompositeOperation"] = "source-over";
        _0x38ddd6["drawImage"](_0x21f52b["img"], 0x0, 0x0, _0x3dabef, _0x5e6513);
        _0x38ddd6["restore"]();
        return;
      }
      if (_0x21f52b["type"] === "mask-base") {
        if (!_0x21f52b["canvas"] || !_0x3e68a3) {
          return;
        }
        const _0x2a9c54 = Number(this["canvasEl"]?.["style"]?.['width']?.['replace']('px', '')) || 0x1;
        const _0x3d67e0 = Number(this['canvasEl']?.["style"]?.["height"]?.["replace"]('px', '')) || 0x1;
        _0x3e68a3["save"]();
        _0x3e68a3["globalCompositeOperation"] = "source-over";
        _0x3e68a3['drawImage'](_0x21f52b['canvas'], 0x0, 0x0, _0x2a9c54, _0x3d67e0);
        _0x3e68a3["restore"]();
        return;
      }
      if (_0x21f52b["type"] === "brush") {
        _0x38ddd6["save"]();
        const _0x96d64a = _0x21f52b['mode'] === "alpha";
        const _0x21a034 = mapBrushPoints(_0x21f52b["points"], _0x2d58e1, _0x2d58e1);
        const _0x5f21fc = getBrushLineWidth(_0x21f52b["sizeWorld"], _0x2d58e1, 'brush');
        if (_0x96d64a) {
          if (_0x282d27) {
            _0x282d27['save']();
            drawRoundBrushStroke(_0x282d27, {
              'points': _0x21a034,
              'lineWidth': _0x5f21fc,
              'strokeStyle': "#fff",
              'fillStyle': "#fff",
              'globalCompositeOperation': "source-over"
            });
            _0x282d27["restore"]();
          } else {
            const _0x3f9610 = this["_createCheckerboardPattern"](_0x38ddd6, _0x2d58e1);
            drawRoundBrushStroke(_0x38ddd6, {
              'points': _0x21a034,
              'lineWidth': _0x5f21fc,
              'strokeStyle': _0x3f9610,
              'fillStyle': _0x3f9610,
              'globalCompositeOperation': "source-over",
              'globalAlpha': 0.8
            });
          }
        } else {
          _0x3e68a3 ? (_0x3e68a3['save'](), drawRoundBrushStroke(_0x3e68a3, {
            'points': _0x21a034,
            'lineWidth': _0x5f21fc,
            'strokeStyle': "#fff",
            'fillStyle': "#fff",
            'globalCompositeOperation': "source-over"
          }), _0x3e68a3["restore"]()) : (drawRoundBrushStroke(_0x38ddd6, {
            'points': _0x21a034,
            'lineWidth': getEraserClearLineWidth(_0x5f21fc),
            'strokeStyle': OPAQUE_MASK_PREVIEW_CLEAR,
            'fillStyle': OPAQUE_MASK_PREVIEW_CLEAR,
            'globalCompositeOperation': "destination-out"
          }), drawRoundBrushStroke(_0x38ddd6, {
            'points': _0x21a034,
            'lineWidth': _0x5f21fc,
            'strokeStyle': _0x150152["maskPreviewFill"],
            'fillStyle': _0x150152["maskPreviewFill"],
            'globalCompositeOperation': "source-over",
            'globalAlpha': 0x1
          }));
        }
        _0x38ddd6['restore']();
        return;
      }
      if (_0x21f52b["type"] === 'eraser') {
        const _0xef7831 = mapBrushPoints(_0x21f52b['points'], _0x2d58e1, _0x2d58e1);
        const _0x2bae9f = getEraserClearLineWidth(getBrushLineWidth(_0x21f52b["sizeWorld"], _0x2d58e1, "eraser"));
        _0x38ddd6["save"]();
        drawRoundBrushStroke(_0x38ddd6, {
          'points': _0xef7831,
          'lineWidth': _0x2bae9f,
          'strokeStyle': "#000",
          'fillStyle': "#000",
          'globalCompositeOperation': "destination-out"
        });
        _0x38ddd6["restore"]();
        _0x3e68a3 && (_0x3e68a3["save"](), drawRoundBrushStroke(_0x3e68a3, {
          'points': _0xef7831,
          'lineWidth': _0x2bae9f,
          'strokeStyle': '#000',
          'fillStyle': "#000",
          'globalCompositeOperation': 'destination-out'
        }), _0x3e68a3["restore"]());
        _0x282d27 && (_0x282d27["save"](), drawRoundBrushStroke(_0x282d27, {
          'points': _0xef7831,
          'lineWidth': _0x2bae9f,
          'strokeStyle': "#000",
          'fillStyle': "#000",
          'globalCompositeOperation': "destination-out"
        }), _0x282d27['restore']());
        return;
      }
      if (_0x21f52b["type"] === "fill") {
        const _0x55c700 = _0x21f52b['mode'] === "alpha";
        const _0x40909a = Number(_0x21f52b['x'] ?? _0x21f52b["startPoint"]?.['x']) || 0x0;
        const _0x5611ab = Number(_0x21f52b['y'] ?? _0x21f52b["startPoint"]?.['y']) || 0x0;
        const _0x1cb6d1 = _0x1b13b4["indexOf"](_0x21f52b);
        const _0x32b5cb = _0x1cb6d1 >= 0x0 ? _0x1b13b4["slice"](0x0, _0x1cb6d1) : _0x258df0["slice"](0x0, _0x2263e4);
        const _0x22cd9c = _0x32b5cb["filter"](_0x196433 => _0x196433?.["type"] === 'brush' || _0x196433?.["type"] === 'eraser');
        const _0x5cd990 = Math["floor"](_0x40909a * _0x2d58e1);
        const _0x576a65 = Math["floor"](_0x5611ab * _0x2d58e1);
        const _0x13124d = getCachedSealedFillRegion({
          'cache': _0x36e144["fillRegionCache"] || this["_fillRegionCache"],
          'width': _0x3d6ade,
          'height': _0x5a855a,
          'zoom': _0x2d58e1,
          'fillCommand': _0x21f52b,
          'boundaryCommands': _0x22cd9c,
          'seedX': _0x5cd990,
          'seedY': _0x576a65,
          'extraKey': 'mode:' + (_0x21f52b['mode'] || ''),
          'pointToPixel': _0x2f1161 => ({
            'x': Number(_0x2f1161?.['x'] || 0x0) * _0x2d58e1,
            'y': Number(_0x2f1161?.['y'] || 0x0) * _0x2d58e1
          }),
          'getStrokeWidth': _0x17e342 => getBrushLineWidth(_0x17e342?.["sizeWorld"], _0x2d58e1, _0x17e342?.["type"])
        });
        if (_0x55c700) {
          if (_0x282d27) {
            paintFilledRegion(_0x282d27, _0x13124d, _0x3d6ade, _0x5a855a, {
              'fillStyle': "#fff",
              'globalCompositeOperation': "source-over",
              'globalAlpha': 0x1
            });
          } else {
            const _0x3f427d = this["_createCheckerboardPattern"](_0x38ddd6, _0x2d58e1);
            paintFilledRegion(_0x38ddd6, _0x13124d, _0x3d6ade, _0x5a855a, {
              'fillStyle': _0x3f427d,
              'globalCompositeOperation': 'source-over',
              'globalAlpha': 0.8
            });
          }
        } else {
          _0x3e68a3 ? paintFilledRegion(_0x3e68a3, _0x13124d, _0x3d6ade, _0x5a855a, {
            'fillStyle': '#fff',
            'globalCompositeOperation': "source-over"
          }) : (paintFilledRegion(_0x38ddd6, _0x13124d, _0x3d6ade, _0x5a855a, {
            'fillStyle': OPAQUE_MASK_PREVIEW_CLEAR,
            'globalCompositeOperation': "destination-out"
          }), paintFilledRegion(_0x38ddd6, _0x13124d, _0x3d6ade, _0x5a855a, {
            'fillStyle': _0x150152["selectionOverlay"],
            'globalCompositeOperation': "source-over"
          }));
        }
        return;
      }
    });
  },
  '_createCheckerboardPattern'(_0x4a9019, _0x4336c7) {
    const _0x57c948 = 0x8 * _0x4336c7;
    const _0x550957 = document["createElement"]("canvas");
    _0x550957["width"] = _0x57c948 * 0x2;
    _0x550957["height"] = _0x57c948 * 0x2;
    const _0x507ef5 = _0x550957["getContext"]('2d');
    const _0x4c7607 = getPixelToolPalette();
    _0x507ef5["fillStyle"] = _0x4c7607["checkerLight"];
    _0x507ef5['fillRect'](0x0, 0x0, _0x57c948 * 0x2, _0x57c948 * 0x2);
    _0x507ef5['fillStyle'] = _0x4c7607['checkerDark'];
    _0x507ef5['fillRect'](0x0, 0x0, _0x57c948, _0x57c948);
    _0x507ef5['fillRect'](_0x57c948, _0x57c948, _0x57c948, _0x57c948);
    return _0x4a9019["createPattern"](_0x550957, 'repeat');
  },
  '_fillArea'(_0x53e883, _0x28ca12) {
    const _0x76b099 = a1099_0x4c6068["getState"]();
    const _0x17a135 = _0x76b099["matting"]?.["brushMode"] || 'normal';
    const _0x2d043d = {
      'type': 'fill',
      'x': Number(_0x53e883?.['x']) || 0x0,
      'y': Number(_0x53e883?.['y']) || 0x0,
      'mode': _0x17a135
    };
    this["_commands"]['push'](_0x2d043d);
    this["_redoStack"] = [];
    this['_dirty'] = !![];
    this["_render"]();
  },
  '_undo'() {
    if (this["_commands"]["length"] === 0x0) {
      return;
    }
    const _0x37c48b = this["_commands"]["pop"]();
    this["_redoStack"]["push"](_0x37c48b);
    this["_dirty"] = !![];
    this["_render"]();
  },
  '_redo'() {
    if (this["_redoStack"]["length"] === 0x0) {
      return;
    }
    const _0x52811d = this["_redoStack"]["pop"]();
    this["_commands"]["push"](_0x52811d);
    this['_dirty'] = !![];
    this["_render"]();
  },
  '_clear'() {
    if (this["_commands"]["length"] === 0x0 && this["_redoStack"]["length"] === 0x0) {
      return;
    }
    this["_commands"] = [];
    this["_redoStack"] = [];
    this["_draft"] = null;
    this['_dirty'] = !![];
    this['_baseMaskCleared'] = !![];
    this["_render"]();
  },
  async '_save'() {
    if (!this["active"]) {
      return;
    }
    const _0x44e3a7 = a1099_0x4c6068["getState"]();
    const _0x3124cd = _0x44e3a7["nodes"][this["nodeId"]];
    if (!_0x3124cd) {
      return;
    }
    const _0x2af375 = this["_resolveNodeImageUrl"](_0x3124cd);
    if (!_0x2af375) {
      return;
    }
    const _0x449650 = this["toolbarEl"]['querySelector'](".act-save");
    const _0x40fe93 = _0x449650['querySelector']('span');
    const _0x1988ba = _0x40fe93 ? _0x40fe93["textContent"] : '';
    this['_isSaving'] = !![];
    if (_0x40fe93) {
      _0x40fe93['textContent'] = imageMattingText("actions.saving");
    }
    _0x449650["style"]["pointerEvents"] = "none";
    try {
      const _0x95d954 = this["nodeId"];
      const _0x394600 = Math['max'](0x1, Number(_0x3124cd["width"]) || 0x1);
      const _0x33ad6f = Math["max"](0x1, Number(_0x3124cd["height"]) || 0x1);
      const _0x3f0dbb = generateId("mask_save");
      const _0x27be69 = this["_commands"]["filter"](_0x4378c6 => _0x4378c6 && (_0x4378c6["type"] === "brush" || _0x4378c6["type"] === 'eraser' || _0x4378c6["type"] === "fill"))["map"](_0xcf60b1 => {
        if (_0xcf60b1['type'] === "fill") {
          return {
            'type': "fill",
            'x': Number(_0xcf60b1['x'] ?? _0xcf60b1["startPoint"]?.['x']) || 0x0,
            'y': Number(_0xcf60b1['y'] ?? _0xcf60b1["startPoint"]?.['y']) || 0x0,
            'mode': _0xcf60b1["mode"]
          };
        }
        return {
          'type': _0xcf60b1["type"],
          'sizeWorld': Number(_0xcf60b1["sizeWorld"]) || 0x0,
          'mode': _0xcf60b1['mode'],
          'points': Array["isArray"](_0xcf60b1["points"]) ? _0xcf60b1["points"]['map'](_0x588cbe => ({
            'x': Number(_0x588cbe['x']),
            'y': Number(_0x588cbe['y'])
          })) : []
        };
      });
      if (this["_baseMaskCleared"] && _0x27be69["length"] === 0x0) {
        a1099_0x4c6068['updateNodeData'](_0x95d954, {
          'mask': '',
          'maskPreview': '',
          'maskPolarity': '',
          'maskPreviewUrl': null,
          'maskSaveToken': null
        });
        window["_triggerLocalCacheSave"]?.();
        this["exit"]({
          'silent': !![]
        });
        return;
      }
      const _0x13d0ad = this['_baseMaskCleared'] ? '' : normalizeLocalPath(_0x3124cd?.['mask']);
      const _0x51da42 = await new Promise(_0x1c3f73 => this['canvasEl']["toBlob"](_0x1c3f73, "image/png"));
      if (!_0x51da42) {
        throw new Error(imageMattingText("errors.canvasExportFailed"));
      }
      const _0x5f0e06 = URL['createObjectURL'](_0x51da42);
      a1099_0x4c6068['updateNodeData'](_0x95d954, {
        'maskPreviewUrl': _0x5f0e06,
        'maskSaveToken': _0x3f0dbb
      });
      window["_triggerLocalCacheSave"]?.();
      this["exit"]({
        'silent': !![]
      });
      (async () => {
        const _0x514a87 = await this["_loadImage"](_0x2af375);
        const _0x2bcf08 = _0x514a87["naturalWidth"] || _0x514a87["width"];
        const _0x2c67aa = _0x514a87["naturalHeight"] || _0x514a87["height"];
        const _0x44dce9 = Math["max"](_0x394600 / _0x2bcf08, _0x33ad6f / _0x2c67aa) || 0x1;
        const _0x33a438 = _0x2bcf08 * _0x44dce9;
        const _0x98f181 = _0x2c67aa * _0x44dce9;
        const _0x47cdb3 = (_0x394600 - _0x33a438) / 0x2;
        const _0x460c79 = (_0x33ad6f - _0x98f181) / 0x2;
        const _0x4208dc = _0x111d70 => {
          const _0x5bcf91 = (Number(_0x111d70?.['x']) - _0x47cdb3) / _0x44dce9;
          const _0x10181d = (Number(_0x111d70?.['y']) - _0x460c79) / _0x44dce9;
          return {
            'x': Math["max"](0x0, Math['min'](_0x2bcf08 - 0x1, _0x5bcf91)),
            'y': Math["max"](0x0, Math["min"](_0x2c67aa - 0x1, _0x10181d))
          };
        };
        const _0x27669f = document["createElement"]("canvas");
        _0x27669f["width"] = _0x2bcf08;
        _0x27669f["height"] = _0x2c67aa;
        const _0x4d72ed = _0x27669f["getContext"]('2d');
        _0x4d72ed['imageSmoothingEnabled'] = ![];
        const _0x11b789 = getCssVar("--canvas-white");
        const _0x4ac711 = getCssVar("--canvas-black");
        _0x4d72ed["fillStyle"] = _0x4ac711;
        _0x4d72ed["fillRect"](0x0, 0x0, _0x2bcf08, _0x2c67aa);
        if (_0x13d0ad) {
          try {
            const _0x3650ca = await this["_loadImage"](localPathToUrl(_0x13d0ad));
            _0x4d72ed["drawImage"](_0x3650ca, 0x0, 0x0, _0x2bcf08, _0x2c67aa);
            const _0x46fbc9 = a1099_0x4c6068['getState']()["nodes"]?.[_0x95d954];
            const _0x1f7705 = String(_0x46fbc9?.["maskPolarity"] || '')["trim"]();
            _0x1f7705 !== "paint-white" && this["_invertCanvasBinary"](_0x4d72ed);
          } catch (_0x6d39b5) {}
        }
        const _0x502a05 = (_0x43a84f, _0x32aff7, _0x105096 = 0x1) => {
          const _0x138183 = (Array["isArray"](_0x43a84f['points']) ? _0x43a84f["points"] : [])["map"](_0x973329 => _0x4208dc(_0x973329));
          if (!_0x138183['length']) {
            return;
          }
          _0x4d72ed["save"]();
          const _0x183212 = _0x105096 >= 0x6 ? "eraser" : "brush";
          const _0x584377 = getBrushLineWidth(_0x43a84f['sizeWorld'], 0x1 / _0x44dce9, _0x183212);
          drawRoundBrushStroke(_0x4d72ed, {
            'points': _0x138183,
            'lineWidth': _0x183212 === 'eraser' ? getEraserClearLineWidth(_0x584377) : _0x584377,
            'strokeStyle': _0x32aff7,
            'fillStyle': _0x32aff7,
            'globalCompositeOperation': "source-over"
          });
          _0x4d72ed["restore"]();
        };
        _0x27be69["forEach"]((_0x4415f6, _0x50f896) => {
          if (!_0x4415f6) {
            return;
          }
          if (_0x4415f6["type"] === "brush") {
            _0x502a05(_0x4415f6, _0x11b789, 0x1);
            return;
          }
          if (_0x4415f6["type"] === 'eraser') {
            _0x502a05(_0x4415f6, _0x4ac711, 0x6);
            return;
          }
          if (_0x4415f6["type"] === "fill") {
            const _0x2724e6 = _0x27be69["slice"](0x0, _0x50f896)["filter"](_0x6475b3 => _0x6475b3?.["type"] === 'brush' || _0x6475b3?.["type"] === "eraser");
            const _0x4cb737 = buildBinaryBoundaryMask({
              'width': _0x2bcf08,
              'height': _0x2c67aa,
              'commands': _0x2724e6,
              'pointToPixel': _0x265f77 => {
                const _0x3d0e2a = _0x4208dc(_0x265f77 || {});
                return {
                  'x': _0x3d0e2a['x'],
                  'y': _0x3d0e2a['y']
                };
              },
              'getStrokeWidth': _0x5bcf11 => getBrushLineWidth(_0x5bcf11?.["sizeWorld"], 0x1 / _0x44dce9, _0x5bcf11?.["type"])
            });
            const _0x5733ae = _0x4208dc({
              'x': _0x4415f6['x'],
              'y': _0x4415f6['y']
            });
            const _0x4e0bb6 = floodFillRegion(_0x4cb737['mask'], _0x4cb737["width"], _0x4cb737["height"], Math["floor"](_0x5733ae['x']), Math["floor"](_0x5733ae['y']));
            const _0x1a8305 = sealRegionToBoundary(_0x4e0bb6, _0x4cb737['mask'], _0x4cb737["width"], _0x4cb737["height"]);
            paintFilledRegion(_0x4d72ed, _0x1a8305, _0x2bcf08, _0x2c67aa, {
              'fillStyle': _0x11b789,
              'globalCompositeOperation': 'source-over'
            });
            return;
          }
        });
        const _0xa6f5e0 = _0x4d72ed['getImageData'](0x0, 0x0, _0x2bcf08, _0x2c67aa)["data"];
        const _0x3ece07 = Math["max"](0x1, Math["floor"](Math["max"](_0x2bcf08, _0x2c67aa) / 0x100));
        let _0x17cfbb = ![];
        for (let _0x4683a0 = 0x0; _0x4683a0 < _0x2c67aa && !_0x17cfbb; _0x4683a0 += _0x3ece07) {
          for (let _0x5cf13e = 0x0; _0x5cf13e < _0x2bcf08; _0x5cf13e += _0x3ece07) {
            const _0x808702 = (_0x4683a0 * _0x2bcf08 + _0x5cf13e) * 0x4;
            const _0x288987 = _0xa6f5e0[_0x808702];
            const _0x26c36b = _0xa6f5e0[_0x808702 + 0x1];
            const _0x3175aa = _0xa6f5e0[_0x808702 + 0x2];
            if (_0x288987 > 0x5 || _0x26c36b > 0x5 || _0x3175aa > 0x5) {
              _0x17cfbb = !![];
              break;
            }
          }
        }
        if (!_0x17cfbb) {
          const _0xcc6afd = a1099_0x4c6068["getState"]()['nodes']?.[_0x95d954];
          if (!_0xcc6afd || _0xcc6afd['maskSaveToken'] !== _0x3f0dbb) {
            URL["revokeObjectURL"](_0x5f0e06);
            return;
          }
          a1099_0x4c6068['updateNodeData'](_0x95d954, {
            'mask': '',
            'maskPreview': '',
            'maskPolarity': '',
            'maskPreviewUrl': null,
            'maskSaveToken': null
          });
          a1099_0x4c6068["setSelectedNodes"]([_0x95d954]);
          commit();
          URL["revokeObjectURL"](_0x5f0e06);
          window["_triggerLocalCacheSave"]?.();
          return;
        }
        const _0x47f8ce = await new Promise(_0x2bd0ea => _0x27669f["toBlob"](_0x2bd0ea, "image/png"));
        if (!_0x47f8ce) {
          throw new Error(imageMattingText("errors.canvasExportFailed"));
        }
        const _0xfb7f60 = await saveOutputBlob(_0x47f8ce, {
          'ext': 'png',
          'subDir': "mask",
          'kind': 'mask'
        });
        const _0x292c20 = pickResultLocalPath(_0xfb7f60);
        const _0x5a5c27 = await saveOutputBlob(_0x51da42, {
          'ext': "png",
          'subDir': 'mask_preview'
        });
        const _0x29f18a = pickResultLocalPath(_0x5a5c27);
        const _0x342a80 = a1099_0x4c6068["getState"]()['nodes']?.[_0x95d954];
        if (!_0x342a80 || _0x342a80['maskSaveToken'] !== _0x3f0dbb) {
          URL["revokeObjectURL"](_0x5f0e06);
          return;
        }
        a1099_0x4c6068['updateNodeData'](_0x95d954, {
          'mask': _0x292c20,
          'maskPreview': _0x29f18a,
          'maskPolarity': 'paint-white',
          'maskPreviewUrl': null,
          'maskSaveToken': null
        });
        a1099_0x4c6068["setSelectedNodes"]([_0x95d954]);
        commit();
        URL['revokeObjectURL'](_0x5f0e06);
        window["_triggerLocalCacheSave"]?.();
      })()['catch'](() => {
        const _0x159d84 = a1099_0x4c6068["getState"]()["nodes"]?.[_0x95d954];
        if (!_0x159d84 || _0x159d84['maskSaveToken'] !== _0x3f0dbb) {
          try {
            URL['revokeObjectURL'](_0x5f0e06);
          } catch (_0x90d637) {}
          return;
        }
        a1099_0x4c6068['updateNodeData'](_0x95d954, {
          'maskSaveToken': null
        });
        window["showToast"]?.(imageMattingText("toasts.saveFailed"), "error");
      });
    } catch (_0x3274c9) {
      console["error"]("[Matting] 保存失败:", _0x3274c9);
      window["showToast"]?.(imageMattingText('toasts.saveFailed'), "error");
    } finally {
      if (_0x40fe93) {
        _0x40fe93['textContent'] = _0x1988ba;
      }
      _0x449650["style"]["pointerEvents"] = "auto";
      this["_isSaving"] = ![];
      this["_syncLocaleTexts"]();
    }
  },
  '_resolveNodeImageUrl'(_0x1dedb8) {
    const _0x45b34a = _0x1dedb8["mainImageIndex"] || 0x0;
    const _0x2a3431 = _0x1dedb8['images'] && _0x1dedb8["images"][_0x45b34a];
    const _0x435e44 = _0x1dedb8["localPath"] || _0x2a3431?.["localPath"];
    const _0x20d3a4 = localPathToUrl(_0x435e44);
    if (_0x20d3a4) {
      return _0x20d3a4;
    }
    return _0x1dedb8['src'] || _0x1dedb8["sourceUrl"] || _0x1dedb8["imageUrl"] || _0x1dedb8["thumbUrl"] || _0x2a3431?.["imageUrl"] || _0x2a3431?.["thumbUrl"] || '';
  },
  '_invertCanvasBinary'(_0x29efa8) {
    const _0x489c09 = _0x29efa8?.["canvas"];
    const _0x542fd9 = _0x489c09?.["width"] || 0x0;
    const _0x2acc8a = _0x489c09?.["height"] || 0x0;
    if (!_0x542fd9 || !_0x2acc8a) {
      return;
    }
    const _0x21d532 = _0x29efa8["getImageData"](0x0, 0x0, _0x542fd9, _0x2acc8a);
    const _0x45029c = _0x21d532["data"];
    for (let _0x2daacf = 0x0; _0x2daacf < _0x45029c["length"]; _0x2daacf += 0x4) {
      _0x45029c[_0x2daacf] = 0xff - _0x45029c[_0x2daacf];
      _0x45029c[_0x2daacf + 0x1] = 0xff - _0x45029c[_0x2daacf + 0x1];
      _0x45029c[_0x2daacf + 0x2] = 0xff - _0x45029c[_0x2daacf + 0x2];
    }
    _0x29efa8["putImageData"](_0x21d532, 0x0, 0x0);
  },
  '_createMaskBaseCanvas'(_0x8f1a04, _0x2fcba2 = "paint-white") {
    const _0x148b78 = Math['max'](0x1, Number(_0x8f1a04?.['naturalWidth'] || _0x8f1a04?.["width"]) || 0x1);
    const _0x163f6f = Math["max"](0x1, Number(_0x8f1a04?.['naturalHeight'] || _0x8f1a04?.["height"]) || 0x1);
    const _0x2ac339 = document["createElement"]('canvas');
    _0x2ac339["width"] = _0x148b78;
    _0x2ac339["height"] = _0x163f6f;
    const _0x4ba0ba = _0x2ac339["getContext"]('2d', {
      'willReadFrequently': !![]
    });
    if (!_0x4ba0ba) {
      return null;
    }
    _0x4ba0ba["drawImage"](_0x8f1a04, 0x0, 0x0, _0x148b78, _0x163f6f);
    const _0x47a677 = _0x4ba0ba["getImageData"](0x0, 0x0, _0x148b78, _0x163f6f);
    const {
      data: _0x1099c5
    } = _0x47a677;
    const _0x2b84bd = String(_0x2fcba2 || '')["trim"]() === "paint-white";
    for (let _0x110f20 = 0x0; _0x110f20 < _0x1099c5["length"]; _0x110f20 += 0x4) {
      const _0x21c49c = Math["max"](_0x1099c5[_0x110f20], _0x1099c5[_0x110f20 + 0x1], _0x1099c5[_0x110f20 + 0x2]);
      const _0x6fea2d = _0x2b84bd ? _0x21c49c : 0xff - _0x21c49c;
      const _0x473523 = _0x6fea2d > 0x5 ? _0x6fea2d : 0x0;
      _0x1099c5[_0x110f20] = 0xff;
      _0x1099c5[_0x110f20 + 0x1] = 0xff;
      _0x1099c5[_0x110f20 + 0x2] = 0xff;
      _0x1099c5[_0x110f20 + 0x3] = _0x473523;
    }
    _0x4ba0ba["putImageData"](_0x47a677, 0x0, 0x0);
    return _0x2ac339;
  },
  '_loadExistingMask'() {
    if (!this["active"]) {
      return;
    }
    const _0x1d1d83 = a1099_0x4c6068["getStateRaw"]();
    const _0x84e73b = _0x1d1d83["nodes"]?.[this["nodeId"]];
    const _0x11b3e1 = String(_0x84e73b?.["mask"] || '')["trim"]();
    const _0x3a2453 = String(_0x84e73b?.["maskPreviewUrl"] || _0x84e73b?.['maskPreview'] || '')["trim"]();
    const _0x33b200 = !!_0x11b3e1;
    const _0x552391 = _0x33b200 ? _0x11b3e1 : _0x3a2453;
    if (!_0x552391) {
      return;
    }
    const _0x319658 = _0x552391["startsWith"]('blob:') || _0x552391['startsWith']("data:") ? _0x552391 : localPathToUrl(_0x552391);
    if (!_0x319658) {
      return;
    }
    (async () => {
      const _0xf70c56 = await this["_loadImage"](_0x319658);
      if (!this['active']) {
        return;
      }
      this["_commands"] = this["_commands"]["filter"](_0x8c56b4 => _0x8c56b4?.["type"] !== "mask-preview" && _0x8c56b4?.["type"] !== 'mask-base');
      if (_0x33b200) {
        const _0x5e295a = this['_createMaskBaseCanvas'](_0xf70c56, _0x84e73b?.["maskPolarity"]);
        if (_0x5e295a) {
          this["_commands"]["unshift"]({
            'type': "mask-base",
            'canvas': _0x5e295a
          });
        }
      } else {
        this["_commands"]["unshift"]({
          'type': "mask-preview",
          'img': _0xf70c56
        });
      }
      this['_redoStack'] = [];
      this["_render"]();
    })()["catch"](() => {});
  },
  '_loadImage'(_0x3cc2c1) {
    return new Promise((_0x40f1b2, _0x415fc2) => {
      const _0x80ff1e = new Image();
      _0x80ff1e["crossOrigin"] = "anonymous";
      _0x80ff1e['onload'] = () => _0x40f1b2(_0x80ff1e);
      _0x80ff1e["onerror"] = () => _0x415fc2(new Error(imageMattingText("errors.imageLoadFailed")));
      _0x80ff1e["src"] = _0x3cc2c1;
    });
  }
};
export default ImageMattingController;