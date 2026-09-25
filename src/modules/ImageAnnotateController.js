import { openDebugRequestWindow } from './debugRequestWindow.js';
import a1087_0x46f68a from '../core/stores/appStore.js';
import { getImageFunctionRequestSettings, getImageFunctionSelection } from './imageFunctionControls.js';
import { buildGenerateImageRequest } from '../../api/aiImageApi.js';
import { generateId, screenToWorld, isPointInRect, inverseImageRotationPoint, getImageRotationLayout } from '../core/math.js';
import { setStaticInnerHTML } from '../utils/dom.js';
import { getModelProvider } from '../config/modelConfig.js';
import { ANNOTATE_TOOLBAR_TEMPLATE_ID, createGenerationToolbarMarkup, getAnnotateToolbarToolsForScene } from './imageAnnotate/annotateToolbarMarkup.js';
import { resolveImageNodeUrl } from './imageNodeImageUrl.js';
import { waitForImageElementReady } from './imageOverlayReadiness.js';
import { bindImageOverlayViewportPreview } from './imageOverlayViewportPreview.js';
import { buildCopiedTextCommand, clampTextScale, createTextTransformState, findTextHit, getTextGeometry, getTextLayout, getTextScalePair, resolveAxisTextScale, rotateTextLocalPoint, TEXT_CONTROL_HIT_RADIUS, TEXT_CONTROL_MAX_SCALE, TEXT_CONTROL_MIN_SCALE, toTextLocalTransformSpace } from './imageAnnotate/textControls.js';
import { getNextNumberLabelValue } from './imageAnnotate/numberLabels.js';
import { renderCommands, renderEraseSceneCommands } from './imageAnnotate/rendering.js';
import { createEraseCheckerboardPattern } from './eraseBrushRenderer.js';
import { buildGenerationPayload } from './imageAnnotate/generationPayload.js';
import { exportAnnotateCanvasBlob } from './imageAnnotate/exportCanvas.js';
import { getEditorRotation, getKeepImageRatio, mountImageEditControls, syncImageEditControls } from './imageAnnotate/imageEditControls.js';
import { bindLocalEditControls, persistLocalEditState, submitLocalEdit } from './imageAnnotate/localEditControls.js';
import { createPendingAnnotateExportNode, markAnnotateExportNodeFailed, saveAnnotateExportResult } from './imageAnnotate/saveResultNode.js';
import { buildGenerationModelCatalog, buildSeedreamMigrationPatch, findProviderKeyByModel, getDefaultGenerationModelState, readLocalEditState } from './imageAnnotate/stateAdapters.js';
import { buildSelectionMaskCanvas } from './imageAnnotate/selectionMask.js';
import { IMAGE_BRUSH_DEFAULT_SIZE_PX, clampImageBrushSize, syncCircularBrushCursor } from './imageEditorBrushStyle.js';
import { buildFinalApiDebugPreview } from '../utils/debugRequestPreview.js';
import { getNodeDefaultSize } from '../services/fileService.js';
import { applyI18n, t } from '../i18n/index.js';
import { createCanvasEditorSurface, positionCanvasEditorSurface, positionCanvasEditorToolbar } from '../components/shared/canvasEditorSurface.js';
function imageAnnotateText(_0x3e0997, _0x38d749 = {}) {
  return t("imageAnnotate." + _0x3e0997, _0x38d749);
}
const COLOR_VAR_MAP = {
  'black': '--black',
  'red': "--annotate-red",
  'orange': "--annotate-orange",
  'yellow': "--annotate-yellow",
  'green': "--annotate-green",
  'blue': "--annotate-blue",
  'purple': "--annotate-purple",
  'white': "--canvas-white"
};
const getCssVar = _0x252171 => getComputedStyle(document["documentElement"])['getPropertyValue'](_0x252171)["trim"]();
const COLOR_NAME_BY_VAR = Object["fromEntries"](Object["entries"](COLOR_VAR_MAP)["map"](([_0x13d243, _0x6ee11]) => [_0x6ee11, _0x13d243]));
const normalizeColorName = _0x26a2e3 => {
  const _0x1e5590 = String(_0x26a2e3 || '')['trim']();
  if (!_0x1e5590) {
    return "red";
  }
  if (COLOR_VAR_MAP[_0x1e5590]) {
    return _0x1e5590;
  }
  const _0x2436cc = _0x1e5590["match"](/^var\(\s*(--[^)]+)\s*\)$/);
  if (_0x2436cc && COLOR_NAME_BY_VAR[_0x2436cc[0x1]]) {
    return COLOR_NAME_BY_VAR[_0x2436cc[0x1]];
  }
  return "red";
};
const getColorCss = _0x40ea15 => {
  const _0x34bf7d = COLOR_VAR_MAP[_0x40ea15];
  return _0x34bf7d ? 'var(' + _0x34bf7d + ')' : _0x40ea15;
};
const getColorCanvas = _0x3d4370 => {
  const _0xbc7133 = COLOR_VAR_MAP[_0x3d4370];
  if (!_0xbc7133) {
    return _0x3d4370;
  }
  return getCssVar(_0xbc7133) || _0x3d4370;
};
const isFiniteCommandPoint = _0x5de90d => Number['isFinite'](Number(_0x5de90d?.['x'])) && Number["isFinite"](Number(_0x5de90d?.['y']));
const hasDrawableStrokePoints = _0x11b841 => Array["isArray"](_0x11b841?.["points"]) && _0x11b841["points"]["some"](isFiniteCommandPoint);
const shouldDiscardStrokeCommand = _0x167417 => (_0x167417?.['type'] === "brush" || _0x167417?.['type'] === 'eraser') && !hasDrawableStrokePoints(_0x167417);
const toImageLocalRenderViewport = _0x597c33 => ({
  'x': 0x0,
  'y': 0x0,
  'zoom': _0x597c33?.["zoom"]
});
export const __textControlTestUtils = {
  'clampTextScale': clampTextScale,
  'getTextScalePair': getTextScalePair
};
export const __strokeCommandTestUtils = {
  'hasDrawableStrokePoints': hasDrawableStrokePoints,
  'shouldDiscardStrokeCommand': shouldDiscardStrokeCommand
};
const ERASE_GENERATE_PROMPT = "擦除绿色的区域 并且填充背景";
const ROTATE_CURSOR_CSS = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cg transform='rotate(35 14 14)'%3E%3Cpath d='M10.2 22.7a8.6 8.6 0 1 0 0-17.4 6.8 6.8 0 1 1 0 17.4Z' fill='%23ffffff' stroke='%23ffffff' stroke-width='1.6' stroke-linejoin='round'/%3E%3Cpath d='M5.3 22.1h4.8v-4.8' fill='none' stroke='%23ffffff' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M5.3 22.1l3.9-3.9' fill='none' stroke='%23ffffff' stroke-width='1.7' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E\") 14 14";
const ImageAnnotateController = {
  'active': ![],
  'nodeId': null,
  'nodeData': null,
  'overlayEl': null,
  'containerEl': null,
  'stageEl': null,
  'imgEl': null,
  'canvasEl': null,
  'toolbarEl': null,
  'generationToolbarEl': null,
  'sizeValueEl': null,
  'sizeRangeEl': null,
  'colorWrapEl': null,
  'colorDotEl': null,
  'colorMenuEl': null,
  'colorButtons': null,
  'toolButtons': null,
  'cursorEl': null,
  '_cursorHover': ![],
  '_cursorLast': {
    'x': 0x0,
    'y': 0x0
  },
  '_cursorRaf': 0x0,
  '_temporaryTool': null,
  '_textInputEl': null,
  '_selectedTextCommandIndex': null,
  '_unsubscribe': null,
  '_commands': [],
  '_redoStack': [],
  '_draft': null,
  '_dirty': ![],
  '_view': null,
  '_mode': null,
  'imageSize': '1K',
  'model': null,
  'provider': null,
  'promptText': '',
  '_checkerPattern': null,
  '_eraseMaskCanvasEl': null,
  '_useWhiteboardBase': ![],
  '_generationModelCatalog': null,
  '_fillRegionCache': null,
  '_unbindGenerationToolbarUpMenus': null,
  '_unbindGenerationFunctionMenus': null,
  '_unsubscribeViewportPreview': null,
  'init'(_0x483870, _0x32e261 = {}) {
    if (this["active"]) {
      return;
    }
    const _0xbf8905 = a1087_0x46f68a["getStateRaw"]();
    const _0x327647 = _0xbf8905["nodes"]?.[_0x483870];
    if (!_0x327647) {
      return;
    }
    const _0x2ea7c9 = this["_resolveNodeImageUrl"](_0x327647, {
      'preferPreview': !![]
    });
    if (!_0x2ea7c9) {
      window['showToast']?.(imageAnnotateText("toasts.noImage"), 'warn');
      return;
    }
    const _0x2ad342 = readLocalEditState(_0x327647);
    const _0x59258f = _0x32e261["scene"] === "local-edit" ? _0x2ad342?.['scene'] || "repaint" : String(_0x32e261["scene"] || "annotate");
    const _0x316458 = _0x59258f === "erase" || _0x59258f === "repaint" ? _0x2ad342 : null;
    const _0x2d7957 = _0x59258f === "erase" || _0x59258f === "repaint" ? _0x316458?.['tool'] || "brush" : _0xbf8905["annotate"]?.["tool"] === "bucket" ? 'brush' : _0xbf8905["annotate"]?.["tool"] || 'brush';
    const _0x4426d6 = normalizeColorName(_0xbf8905["annotate"]?.["color"]);
    const _0x483b1a = _0x316458 ? clampImageBrushSize(_0x316458["brushSizePx"], 0x28) : clampImageBrushSize(_0xbf8905["annotate"]?.['brushSizePx'], IMAGE_BRUSH_DEFAULT_SIZE_PX);
    this["active"] = !![];
    this["_localEditSession"] = {};
    this["_localEditSubmission"] = null;
    this["nodeId"] = _0x483870;
    this['_generationModelCatalog'] = buildGenerationModelCatalog();
    const _0x361ff1 = this['_normalizeLegacySeedreamNode'](_0x327647);
    this["nodeData"] = _0x361ff1;
    this["_commands"] = _0x316458?.['commands'] || [];
    this["_redoStack"] = [];
    this["_draft"] = null;
    this["_selectedTextCommandIndex"] = null;
    this["_dirty"] = ![];
    this["_useWhiteboardBase"] = ![];
    this["_fillRegionCache"] = new Map();
    const _0xf9bd76 = imageAnnotateText('actions.save');
    const _0x3aa86f = imageAnnotateText("actions.generate");
    const _0x1c94f9 = t("imageAnnotate.actions.generate", {}, {
      'locale': 'zh-CN'
    });
    const _0x5b8e74 = String(_0x32e261['submitLabel'] || _0xf9bd76)["trim"]();
    const _0x4b1761 = _0x5b8e74 || _0xf9bd76;
    const _0xbf91e0 = _0x4b1761 === _0x3aa86f || _0x4b1761 === _0x1c94f9;
    this["_mode"] = {
      'scene': _0x59258f,
      'submitLabel': _0x4b1761,
      'submitBusyLabel': String(_0x32e261["submitBusyLabel"] || '')["trim"]() || (_0xbf91e0 ? imageAnnotateText('actions.generating') : imageAnnotateText("actions.saving")),
      'submitNoop': Boolean(_0x32e261["submitNoop"])
    };
    const _0x23362d = this['_getGenerationModelCatalog']();
    const _0x48e40f = getDefaultGenerationModelState(_0x23362d);
    this["imageSize"] = '1K';
    const _0x32f32a = String(_0x361ff1?.['model'] || '')['trim']();
    const _0x11f64c = String(_0x361ff1?.['provider'] || '')['trim']();
    const _0x25a2b1 = findProviderKeyByModel(_0x23362d, _0x32f32a);
    _0x25a2b1 ? (this["model"] = _0x32f32a, this["provider"] = _0x25a2b1) : (this["model"] = _0x48e40f["model"] || _0x32f32a || null, this["provider"] = _0x48e40f["provider"] || _0x11f64c || getModelProvider(this['model']) || null);
    this["promptText"] = String(_0x32e261["promptText"] ?? _0x316458?.["promptText"] ?? '');
    this["_view"] = {
      'tool': _0x2d7957,
      'color': _0x4426d6,
      'brushSizePx': _0x483b1a,
      'viewport': _0xbf8905['viewport'],
      'node': _0x361ff1
    };
    a1087_0x46f68a["setAnnotateState"]({
      'active': !![],
      'nodeId': _0x483870,
      'tool': _0x2d7957,
      'color': _0x4426d6,
      'brushSizePx': _0x483b1a
    });
    this["_createUI"](_0x2ea7c9, {
      'tool': _0x2d7957,
      'color': _0x4426d6,
      'brushSizePx': _0x483b1a
    });
    this["_bindEvents"]();
    this['_unsubscribe'] = a1087_0x46f68a['subscribeSelector'](_0xce5a90 => {
      const _0x164453 = _0xce5a90["nodes"]?.[_0x483870];
      const _0x20f56f = _0xce5a90["viewport"] || {
        'x': 0x0,
        'y': 0x0,
        'zoom': 0x1
      };
      const _0x21ff44 = _0xce5a90["annotate"] || {};
      return {
        'hasNode': !!_0x164453,
        'nx': _0x164453 ? _0x164453['x'] : 0x0,
        'ny': _0x164453 ? _0x164453['y'] : 0x0,
        'nw': _0x164453 ? _0x164453["width"] : 0x0,
        'nh': _0x164453 ? _0x164453["height"] : 0x0,
        'vx': _0x20f56f['x'],
        'vy': _0x20f56f['y'],
        'vz': _0x20f56f['zoom'] || 0x1,
        'vox': _0x20f56f["_screenOriginX"] || 0x0,
        'voy': _0x20f56f['_screenOriginY'] || 0x0,
        'tool': _0x21ff44['tool'] || "brush",
        'color': normalizeColorName(_0x21ff44["color"]),
        'brushSizePx': clampImageBrushSize(_0x21ff44['brushSizePx'], IMAGE_BRUSH_DEFAULT_SIZE_PX)
      };
    }, _0x3b0045 => {
      if (!_0x3b0045?.['hasNode']) {
        return;
      }
      const _0x3eafc3 = a1087_0x46f68a["getStateRaw"]()["nodes"]?.[_0x483870];
      const _0x3d8c84 = this["_normalizeLegacySeedreamNode"](_0x3eafc3);
      this["nodeData"] = _0x3d8c84 || null;
      this['_view'] = {
        'tool': _0x3b0045["tool"],
        'color': _0x3b0045["color"],
        'brushSizePx': _0x3b0045['brushSizePx'],
        'viewport': {
          'x': _0x3b0045['vx'],
          'y': _0x3b0045['vy'],
          'zoom': _0x3b0045['vz'],
          '_screenOriginX': _0x3b0045["vox"],
          '_screenOriginY': _0x3b0045["voy"]
        },
        'node': {
          'x': Number(_0x3d8c84?.['x'] ?? _0x3b0045['nx']),
          'y': Number(_0x3d8c84?.['y'] ?? _0x3b0045['ny']),
          'width': Number(_0x3d8c84?.['width'] ?? _0x3b0045['nw']),
          'height': Number(_0x3d8c84?.['height'] ?? _0x3b0045['nh'])
        }
      };
      this["_updateView"](this["_view"]);
    });
    this["_unsubscribeViewportPreview"] = bindImageOverlayViewportPreview({
      'getView': () => this["_view"],
      'updateView': _0x283198 => {
        this["_view"] = _0x283198;
        this["_updateView"](_0x283198);
      }
    });
    this['_waitForImageAndShow']();
  },
  '_waitForImageAndShow'() {
    this["_cancelImageReadyWait"]?.();
    this["overlayEl"]?.['classList']["add"]("visible");
    this["_cancelImageReadyWait"] = waitForImageElementReady({
      'image': this["imgEl"],
      'onReady': () => {
        this['_cancelImageReadyWait'] = null;
        if (this["active"] && this["_view"]) {
          this["_updateView"](this['_view']);
        }
      },
      'onError': () => {
        this['_cancelImageReadyWait'] = null;
        if (!this["active"]) {
          return;
        }
        window["showToast"]?.(imageAnnotateText("errors.imageLoadFailed"), "error");
        this["exit"]({
          'silent': !![]
        });
      }
    });
  },
  '_getGenerationModelCatalog'() {
    !this["_generationModelCatalog"] && (this['_generationModelCatalog'] = buildGenerationModelCatalog());
    return this["_generationModelCatalog"];
  },
  '_normalizeLegacySeedreamNode'(_0x26fed6) {
    const _0x1a13cb = buildSeedreamMigrationPatch(_0x26fed6);
    if (!_0x1a13cb) {
      return _0x26fed6;
    }
    const _0x44bded = {
      ...(_0x26fed6 || {}),
      ..._0x1a13cb
    };
    const _0x49e464 = a1087_0x46f68a["getStateRaw"]()['nodes']?.[this["nodeId"]];
    _0x49e464 && a1087_0x46f68a['updateNodeData'](this['nodeId'], _0x1a13cb);
    return _0x44bded;
  },
  'exit'({
    silent = ![]
  } = {}) {
    if (!this["active"]) {
      return;
    }
    this["_cleanupEvents"]?.();
    this['_cleanupEvents'] = null;
    this["_imageEditControls"]?.['destroy']();
    this["_imageEditControls"] = null;
    this["_functionControls"]?.['destroy']();
    this["_functionControls"] = null;
    this["_cancelImageReadyWait"]?.();
    this["_cancelImageReadyWait"] = null;
    !silent && this['_dirty'] && window["showToast"]?.(imageAnnotateText("toasts.cancelled"), 'ok');
    this["active"] = ![];
    this["_localEditSession"] = null;
    this["_localEditSubmission"] = null;
    this['nodeId'] = null;
    this['nodeData'] = null;
    this['_commands'] = [];
    this["_redoStack"] = [];
    this["_draft"] = null;
    this["_removeTextInput"](![]);
    this["_dirty"] = ![];
    a1087_0x46f68a["setAnnotateState"]({
      'active': ![],
      'nodeId': null
    });
    this["_unsubscribe"] && (this["_unsubscribe"](), this["_unsubscribe"] = null);
    this['_unsubscribeViewportPreview']?.();
    this["_unsubscribeViewportPreview"] = null;
    this['_unbindGenerationToolbarUpMenus']?.();
    this["_unbindGenerationToolbarUpMenus"] = null;
    this["_unbindGenerationFunctionMenus"]?.();
    this["_unbindGenerationFunctionMenus"] = null;
    if (this["overlayEl"]) {
      this["overlayEl"]["remove"]();
    }
    if (this['toolbarEl']) {
      this["toolbarEl"]["remove"]();
    }
    if (this['generationToolbarEl']) {
      this["generationToolbarEl"]["remove"]();
    }
    this["overlayEl"] = null;
    this["containerEl"] = null;
    this["stageEl"] = null;
    this['imgEl'] = null;
    this['canvasEl'] = null;
    this['toolbarEl'] = null;
    this["generationToolbarEl"] = null;
    this['sizeValueEl'] = null;
    this["sizeRangeEl"] = null;
    this['colorWrapEl'] = null;
    this["colorDotEl"] = null;
    this["colorMenuEl"] = null;
    this["colorButtons"] = null;
    this['toolButtons'] = null;
    this["cursorEl"] = null;
    this["_cursorHover"] = ![];
    this['_cursorLast'] = {
      'x': 0x0,
      'y': 0x0
    };
    this['_cursorRaf'] = 0x0;
    this["_temporaryTool"] = null;
    this["_textInputEl"] = null;
    this["_selectedTextCommandIndex"] = null;
    this['_view'] = null;
    this['_mode'] = null;
    this["imageSize"] = '1K';
    this["model"] = null;
    this["provider"] = null;
    this["promptText"] = '';
    this['_checkerPattern'] = null;
    this["_eraseMaskCanvasEl"] = null;
    this['_useWhiteboardBase'] = ![];
    this["_generationModelCatalog"] = null;
    this["_fillRegionCache"] = null;
    this["_unbindGenerationToolbarUpMenus"] = null;
    this["_unbindGenerationFunctionMenus"] = null;
  },
  '_isGenerationScene'() {
    return this["_mode"]?.["scene"] === "repaint" || this['_mode']?.["scene"] === "erase";
  },
  '_isEraseScene'() {
    return this["_mode"]?.['scene'] === 'erase';
  },
  '_isRepaintScene'() {
    return this["_mode"]?.['scene'] === 'repaint';
  },
  '_isAnnotateScene'() {
    return this["_mode"]?.["scene"] === 'annotate';
  },
  '_getFlipState'(_0x1264d5 = this["_commands"]) {
    const _0x2beeb6 = {
      'horizontal': ![],
      'vertical': ![]
    };
    (Array["isArray"](_0x1264d5) ? _0x1264d5 : [])['forEach'](_0x96a13 => {
      if (_0x96a13?.["type"] === "flip-horizontal") {
        _0x2beeb6["horizontal"] = !_0x2beeb6["horizontal"];
      } else {
        _0x96a13?.["type"] === "flip-vertical" && (_0x2beeb6["vertical"] = !_0x2beeb6['vertical']);
      }
    });
    return _0x2beeb6;
  },
  '_getCurrentFlipState'() {
    if (!this["_isAnnotateScene"]()) {
      return {
        'horizontal': ![],
        'vertical': ![]
      };
    }
    return this["_getFlipState"](this["_commands"]);
  },
  '_applyFlipToLocalPoint'(_0x29a2b4, _0x24a657, _0x5edecb = this["_getCurrentFlipState"]()) {
    const _0x4d04f8 = {
      'x': Number(_0x29a2b4?.['x']) || 0x0,
      'y': Number(_0x29a2b4?.['y']) || 0x0
    };
    const _0x55be18 = Math["max"](0x1, Number(_0x24a657?.["width"]) || 0x1);
    const _0x8f6a53 = Math["max"](0x1, Number(_0x24a657?.["height"]) || 0x1);
    if (_0x5edecb?.['horizontal']) {
      _0x4d04f8['x'] = _0x55be18 - _0x4d04f8['x'];
    }
    if (_0x5edecb?.["vertical"]) {
      _0x4d04f8['y'] = _0x8f6a53 - _0x4d04f8['y'];
    }
    return _0x4d04f8;
  },
  '_getLocalFromClient'(_0x457956, _0xb1eb3b, _0x5107e0, _0x1a9ab4) {
    const _0x5988a4 = screenToWorld(_0x457956, _0xb1eb3b, _0x5107e0["viewport"]);
    let _0x20c9ae = {
      'x': _0x5988a4['x'] - _0x1a9ab4['x'],
      'y': _0x5988a4['y'] - _0x1a9ab4['y']
    };
    if (!this["_isAnnotateScene"]()) {
      return _0x20c9ae;
    }
    _0x20c9ae = inverseImageRotationPoint(_0x20c9ae, _0x1a9ab4["width"], _0x1a9ab4['height'], getEditorRotation(this), getKeepImageRatio(this["_commands"]));
    return this["_applyFlipToLocalPoint"](_0x20c9ae, _0x1a9ab4, this['_getCurrentFlipState']());
  },
  '_applyStageFlip'(_0x110700 = this["_getCurrentFlipState"]()) {
    if (!this["stageEl"]) {
      return;
    }
    if (!this['_isAnnotateScene']()) {
      this["stageEl"]["style"]['transform'] = 'none';
      return;
    }
    const _0x4fffe1 = _0x110700?.["horizontal"] ? -0x1 : 0x1;
    const _0x5e713c = _0x110700?.["vertical"] ? -0x1 : 0x1;
    this["stageEl"]["style"]['transformOrigin'] = "50% 50%";
    const _0x1cfa9b = getEditorRotation(this);
    const _0x5b569b = this["_view"]?.["node"] || this["nodeData"];
    const _0x1d40b3 = _0x5b569b ? getImageRotationLayout(_0x5b569b["width"], _0x5b569b["height"], _0x1cfa9b, getKeepImageRatio(this["_commands"]))["scale"] : 0x1;
    this["stageEl"]["style"]['transform'] = "rotate(" + _0x1cfa9b + "deg) scale(" + _0x4fffe1 * _0x1d40b3 + ',\x20' + _0x5e713c * _0x1d40b3 + ')';
    syncImageEditControls(this);
  },
  '_applyFlipTransformToContext'(_0x474450, _0x3947b9, _0x2fd2d6, _0x2dbf6d = this["_getCurrentFlipState"]()) {
    if (!_0x474450) {
      return;
    }
    _0x2dbf6d?.["horizontal"] && (_0x474450["translate"](_0x3947b9, 0x0), _0x474450["scale"](-0x1, 0x1));
    _0x2dbf6d?.["vertical"] && (_0x474450['translate'](0x0, _0x2fd2d6), _0x474450['scale'](0x1, -0x1));
  },
  '_closeGenerationMenus'() {
    this['_functionControls']?.["closeMenus"]();
  },
  '_createUI'(_0x4c3762, _0x1ae061 = {}) {
    const {
      overlay: _0x590a3d,
      container: _0x35e8a3,
      stage: _0x4f8d02
    } = createCanvasEditorSurface();
    const _0x35f4c9 = document["createElement"]("img");
    _0x35f4c9["className"] = "v2-annotate-img";
    _0x35f4c9['src'] = _0x4c3762;
    _0x35f4c9["draggable"] = ![];
    const _0x295ddd = document["createElement"]("canvas");
    _0x295ddd["className"] = "v2-annotate-canvas";
    _0x4f8d02["appendChild"](_0x35f4c9);
    _0x4f8d02["appendChild"](_0x295ddd);
    const _0x3d97bb = document["createElement"]("div");
    _0x3d97bb["className"] = "v2-annotate-cursor";
    _0x3d97bb["style"]["display"] = 'none';
    _0x590a3d["appendChild"](_0x3d97bb);
    _0x590a3d["appendChild"](_0x35e8a3);
    document["body"]["appendChild"](_0x590a3d);
    this["overlayEl"] = _0x590a3d;
    this["containerEl"] = _0x35e8a3;
    this['stageEl'] = _0x4f8d02;
    this["imgEl"] = _0x35f4c9;
    this["canvasEl"] = _0x295ddd;
    this["cursorEl"] = _0x3d97bb;
    this['_applyBaseSurface']();
    const _0x2658fc = document["createElement"]('div');
    _0x2658fc["className"] = 'v2-annotate-toolbar';
    setStaticInnerHTML(_0x2658fc, ANNOTATE_TOOLBAR_TEMPLATE_ID);
    applyI18n(_0x2658fc);
    document["body"]["appendChild"](_0x2658fc);
    this['toolbarEl'] = _0x2658fc;
    if (this['_isGenerationScene']()) {
      const _0x4eec8c = document["createElement"]("div");
      this["_functionSelection"] = getImageFunctionSelection(this["model"], this["nodeData"], this['imageSize']);
      _0x4eec8c["className"] = "v2-annotate-toolbar v2-annotate-generation-toolbar";
      _0x4eec8c["innerHTML"] = createGenerationToolbarMarkup({
        'selection': this["_functionSelection"],
        'scene': this["_mode"]?.["scene"] || "annotate",
        'promptText': this['promptText'],
        'imageSize': this["imageSize"],
        'model': this["model"],
        'provider': this['provider'],
        'modelCatalog': this['_getGenerationModelCatalog'](),
        'submitTooltip': this["_mode"]?.["submitLabel"] || imageAnnotateText('actions.generate')
      });
      applyI18n(_0x4eec8c);
      document["body"]["appendChild"](_0x4eec8c);
      this["generationToolbarEl"] = _0x4eec8c;
    }
    this["sizeValueEl"] = _0x2658fc["querySelector"](".v2-annotate-size-value");
    this["sizeRangeEl"] = _0x2658fc['querySelector'](".v2-annotate-size-range");
    this["colorWrapEl"] = _0x2658fc["querySelector"](".v2-annotate-colorwrap");
    this["colorDotEl"] = _0x2658fc["querySelector"](".v2-annotate-color-dot");
    this["colorMenuEl"] = _0x2658fc["querySelector"](".v2-annotate-color-menu");
    this['colorButtons'] = Array['from'](_0x2658fc["querySelectorAll"](".v2-annotate-swatch"));
    const _0x57e44f = getAnnotateToolbarToolsForScene(this["_mode"]?.["scene"] || "annotate");
    _0x2658fc["querySelectorAll"](".tool-btn")["forEach"](_0x19bf42 => {
      if (!_0x57e44f["includes"](_0x19bf42["dataset"]["tool"])) {
        _0x19bf42["remove"]();
      }
    });
    this['toolButtons'] = Array['from'](_0x2658fc["querySelectorAll"](".tool-btn"));
    this['_isGenerationScene']() && (this["colorWrapEl"]?.["remove"](), this['colorWrapEl'] = null, this["colorDotEl"] = null, this["colorMenuEl"] = null, this['colorButtons'] = []);
    !this['_isAnnotateScene']() && (_0x2658fc['querySelector'](".act-flip-horizontal")?.["remove"](), _0x2658fc['querySelector'](".act-flip-vertical")?.["remove"]());
    const _0x301268 = _0x2658fc["querySelector"](".act-save");
    const _0xc8fc4c = _0x2658fc['querySelector']('.act-new-board');
    const _0x4e4269 = _0x301268?.['querySelector']('span');
    const _0xa2479b = this["_mode"]?.["submitLabel"] || '保存';
    if (_0x4e4269) {
      _0x4e4269["textContent"] = _0xa2479b;
    }
    if (_0x301268) {
      _0x301268['setAttribute']('data-tooltip', _0xa2479b);
    }
    _0x301268 && this["_isGenerationScene"]() && (_0x301268['style']["display"] = "none");
    _0xc8fc4c && this["_isGenerationScene"]() && (_0xc8fc4c["style"]['display'] = "none");
    const _0x40d633 = clampImageBrushSize(_0x1ae061["brushSizePx"], IMAGE_BRUSH_DEFAULT_SIZE_PX);
    const _0x128e6b = _0x1ae061["tool"] || 'brush';
    const _0x254c8c = _0x57e44f["includes"](_0x128e6b) ? _0x128e6b : 'brush';
    const _0xd86125 = normalizeColorName(_0x1ae061['color']);
    this['sizeRangeEl']['value'] = String(_0x40d633);
    this["sizeValueEl"]["textContent"] = String(_0x40d633);
    this["_updateToolActive"](_0x254c8c, _0x40d633);
    this["_syncPaletteActive"](_0xd86125);
    if (this["_isAnnotateScene"]()) {
      mountImageEditControls(this);
    }
    if (this["_view"]) {
      this["_updateView"](this["_view"]);
    }
  },
  '_bindEvents'() {
    const _0x2f7d1a = _0x3c5988 => {
      const _0x55e8f6 = this["canvasEl"] && (_0x3c5988["target"] === this['canvasEl'] || this["canvasEl"]["contains"](_0x3c5988["target"]));
      if (_0x55e8f6) {
        this["_onCanvasWheel"](_0x3c5988);
        return;
      }
      _0x3c5988["preventDefault"]();
      _0x3c5988["stopPropagation"]();
    };
    this["overlayEl"]["addEventListener"]("wheel", _0x2f7d1a, {
      'passive': ![]
    });
    const _0x3f248e = () => {
      if (this["_view"]) {
        this['_updateView'](this["_view"]);
      }
    };
    window["addEventListener"]("resize", _0x3f248e);
    const _0x23c35e = _0x3025cc => {
      if (!this['active']) {
        return;
      }
      const _0x2eb7dc = _0x3025cc["target"];
      const _0x1f8c95 = _0x2eb7dc?.["tagName"]?.["toLowerCase"]?.() || '';
      const _0x4c52 = _0x1f8c95 === "input" || _0x1f8c95 === "textarea" || _0x2eb7dc?.["isContentEditable"] === !![];
      if (_0x4c52) {
        return;
      }
      if (_0x3025cc["altKey"] || _0x3025cc["ctrlKey"] || _0x3025cc["metaKey"]) {
        return;
      }
      const _0x26037e = String(_0x3025cc['key'] || '')["toLowerCase"]();
      _0x26037e === 't' && !this["_isGenerationScene"]() && (_0x3025cc["preventDefault"](), this["_setTool"]('text'));
    };
    window["addEventListener"]("keydown", _0x23c35e);
    const _0x1a9cb0 = () => {
      window["removeEventListener"]("resize", _0x3f248e);
      window['removeEventListener']("keydown", _0x23c35e);
      this["overlayEl"]?.["removeEventListener"]("wheel", _0x2f7d1a);
      document["removeEventListener"]('pointerdown', _0x5c710a, !![]);
    };
    this["_cleanupEvents"] = _0x1a9cb0;
    this["toolbarEl"]["addEventListener"]('pointerdown', _0x35e1c2 => _0x35e1c2["stopPropagation"]());
    this["toolbarEl"]["querySelector"](".act-cancel")["addEventListener"]('click', _0x105cee => {
      _0x105cee["stopPropagation"]();
      this['exit']();
    });
    this['toolButtons']['forEach'](_0x2357aa => {
      _0x2357aa["addEventListener"]("click", _0x5a84d1 => {
        _0x5a84d1["stopPropagation"]();
        const _0x3e6fb0 = _0x2357aa['dataset']["tool"];
        this['_setTool'](_0x3e6fb0);
      });
    });
    const _0x533e90 = () => {
      this["_imageEditControls"]?.["closeColorMenu"]();
      if (!this['colorWrapEl']) {
        return;
      }
      this["colorWrapEl"]['classList']["remove"]("open");
    };
    const _0x5c710a = _0x4859da => {
      this["colorWrapEl"] && this['colorWrapEl']["classList"]["contains"]("open") && !this['colorWrapEl']["contains"](_0x4859da["target"]) && _0x533e90();
      this['generationToolbarEl'] && !this["generationToolbarEl"]["contains"](_0x4859da["target"]) && !this["_functionControls"]?.["containsMenuTarget"](_0x4859da["target"]) && this["_closeGenerationMenus"]();
    };
    document['addEventListener']("pointerdown", _0x5c710a, !![]);
    this["colorWrapEl"]?.["addEventListener"]("pointerdown", _0x105083 => _0x105083["stopPropagation"]());
    if (!this['_imageEditControls']) {
      this["colorWrapEl"]?.['querySelector'](".v2-annotate-color-toggle")?.["addEventListener"]("click", _0x63bbb7 => {
        _0x63bbb7['stopPropagation']();
        if (!this["colorWrapEl"]) {
          return;
        }
        this["colorWrapEl"]["classList"]["toggle"]("open");
      });
    }
    this["colorButtons"]["forEach"](_0x2bd476 => {
      _0x2bd476["addEventListener"]("click", _0x24e2e3 => {
        _0x24e2e3["stopPropagation"]();
        const _0x3e410a = _0x2bd476["dataset"]["color"];
        a1087_0x46f68a["setAnnotateState"]({
          'color': _0x3e410a
        });
        _0x533e90();
      });
    });
    this["sizeRangeEl"]["addEventListener"]("input", _0x2943a6 => {
      const _0x47aa81 = clampImageBrushSize(_0x2943a6["target"]['value'], 0x1);
      a1087_0x46f68a["setAnnotateState"]({
        'brushSizePx': _0x47aa81
      });
      this['sizeValueEl']['textContent'] = String(_0x47aa81);
      this["_syncCursor"]();
      this["_persistLocalEditState"]();
    });
    this["toolbarEl"]["querySelector"](".act-undo")["addEventListener"]('click', _0x3a3657 => {
      _0x3a3657["stopPropagation"]();
      this["_undo"]();
    });
    this['toolbarEl']["querySelector"](".act-flip-horizontal")?.["addEventListener"]("click", _0x37d3ab => {
      _0x37d3ab["stopPropagation"]();
      this["_flipHorizontal"]();
    });
    this['toolbarEl']["querySelector"](".act-flip-vertical")?.['addEventListener']("click", _0x51a5e3 => {
      _0x51a5e3["stopPropagation"]();
      this["_flipVertical"]();
    });
    this["toolbarEl"]["querySelector"](".act-redo")["addEventListener"]("click", _0x3b2d61 => {
      _0x3b2d61["stopPropagation"]();
      this['_redo']();
    });
    this['toolbarEl']["querySelector"](".act-clear")["addEventListener"]('click', _0x166ece => {
      _0x166ece["stopPropagation"]();
      this['_clear']();
    });
    this["toolbarEl"]["querySelector"](".act-new-board")?.["addEventListener"]('click', _0x319a5c => {
      _0x319a5c["stopPropagation"]();
      this['_createNewWhiteboard']();
    });
    this["toolbarEl"]["querySelector"](".act-save")["addEventListener"]("click", async _0x3fca28 => {
      _0x3fca28["stopPropagation"]();
      if (this["_mode"]?.["submitNoop"]) {
        return;
      }
      await this["_save"]();
    });
    bindLocalEditControls(this);
    const _0x11a25c = this["canvasEl"]["getContext"]('2d');
    _0x11a25c['lineCap'] = "round";
    _0x11a25c["lineJoin"] = "round";
    this["_checkerPattern"] = createEraseCheckerboardPattern(_0x11a25c, 0x1);
    const _0x395689 = {
      'down': ![],
      'pointerId': null,
      'previousTool': null,
      'temporaryTool': null,
      'textTransform': null
    };
    const _0x175dee = (_0x1727da, _0x1de287) => {
      this["_cursorLast"] = {
        'x': _0x1727da,
        'y': _0x1de287
      };
      if (this['_cursorRaf']) {
        return;
      }
      this["_cursorRaf"] = requestAnimationFrame(() => {
        this["_cursorRaf"] = 0x0;
        this["_syncCursor"]();
      });
    };
    const _0x623653 = (_0x2c817a, _0x498c45, _0x31419c, _0x984995 = 0x0) => {
      const _0x58087f = a1087_0x46f68a["getStateRaw"]();
      const _0x410230 = _0x58087f['nodes']?.[this['nodeId']];
      if (!_0x410230) {
        return ![];
      }
      const _0x369288 = this["_getLocalFromClient"](_0x2c817a, _0x498c45, _0x58087f, _0x410230);
      if (!isPointInRect(_0x369288['x'], _0x369288['y'], 0x0, 0x0, _0x410230["width"], _0x410230["height"])) {
        return ![];
      }
      const _0x55f372 = _0x58087f["annotate"]?.['tool'] || "brush";
      const _0x3090dd = _0x984995 === 0x1 || _0x984995 === 0x2;
      const _0x38b6cc = _0x3090dd ? "eraser" : _0x55f372;
      if (_0x38b6cc !== "text") {
        this["_selectedTextCommandIndex"] = null;
      }
      const _0x42b577 = clampImageBrushSize(_0x58087f['annotate']?.["brushSizePx"], IMAGE_BRUSH_DEFAULT_SIZE_PX);
      const _0x101cc3 = this['_isAnnotateScene']() ? getImageRotationLayout(_0x410230["width"], _0x410230["height"], getEditorRotation(this), getKeepImageRatio(this['_commands']))["scale"] : 0x1;
      const _0x4604e1 = _0x42b577 / ((_0x58087f['viewport']["zoom"] || 0x1) * _0x101cc3);
      _0x3090dd ? (_0x395689["previousTool"] = _0x55f372, _0x395689['temporaryTool'] = "eraser", this["_temporaryTool"] = "eraser", this["_syncCursor"]("eraser", _0x42b577)) : (_0x395689["previousTool"] = null, _0x395689['temporaryTool'] = null, this["_temporaryTool"] = null);
      if (_0x38b6cc === 'bucket' && !this["_isEraseScene"]()) {
        this["_fillArea"](_0x369288, _0x4604e1);
        return !![];
      }
      if (_0x38b6cc === "number-label" && this["_isAnnotateScene"]()) {
        this["_addNumberLabel"](_0x369288, _0x4604e1);
        return !![];
      }
      if (_0x38b6cc === "text") {
        const _0x9c04f2 = this["_findTextHit"](_0x369288, _0x58087f["viewport"]);
        if (_0x9c04f2) {
          this["_removeTextInput"](!![]);
          this["_selectedTextCommandIndex"] = _0x9c04f2["index"];
          if (_0x9c04f2["mode"] === 'delete') {
            this["_deleteTextCommand"](_0x9c04f2["index"]);
            return !![];
          }
          if (_0x9c04f2["mode"] === "copy") {
            this["_copyTextCommand"](_0x9c04f2["index"], _0x58087f["viewport"]);
            return !![];
          }
          _0x395689["down"] = !![];
          _0x395689["pointerId"] = _0x31419c;
          _0x395689["textTransform"] = this['_createTextTransformState'](_0x9c04f2, _0x369288, _0x58087f["viewport"]);
          this["canvasEl"]["setPointerCapture"](_0x31419c);
          this["_render"]();
          return !![];
        }
        this["_selectedTextCommandIndex"] = null;
        this["_openTextInput"](_0x369288, _0x58087f, _0x4604e1, _0x2c817a, _0x498c45);
        return !![];
      }
      if (_0x38b6cc === "rect") {
        this["_draft"] = {
          'type': "rect",
          'color': getColorCanvas(_0x58087f["annotate"]?.["color"] || "red"),
          'sizeWorld': _0x4604e1,
          'x1': _0x369288['x'],
          'y1': _0x369288['y'],
          'x2': _0x369288['x'],
          'y2': _0x369288['y']
        };
      } else {
        _0x38b6cc === 'eraser' ? this["_draft"] = {
          'type': "eraser",
          'sizeWorld': _0x4604e1,
          'points': [_0x369288]
        } : this['_draft'] = {
          'type': 'brush',
          'color': getColorCanvas(_0x58087f["annotate"]?.["color"] || "red"),
          'sizeWorld': _0x4604e1,
          'points': [_0x369288]
        };
      }
      _0x395689["down"] = !![];
      _0x395689["pointerId"] = _0x31419c;
      this['canvasEl']["setPointerCapture"](_0x31419c);
      this["_render"]();
      return !![];
    };
    const _0x5175c0 = (_0x1e6c6d, _0x48ed22) => {
      const _0x170b97 = a1087_0x46f68a["getStateRaw"]();
      const _0x46ba03 = _0x170b97["nodes"]?.[this["nodeId"]];
      if (!_0x46ba03) {
        return;
      }
      const _0x4b1387 = this["_getLocalFromClient"](_0x1e6c6d, _0x48ed22, _0x170b97, _0x46ba03);
      if (_0x395689["down"] && _0x395689["textTransform"]) {
        const _0x4189d2 = _0x395689["textTransform"];
        const _0x24a77c = this['_commands'][_0x4189d2["index"]];
        if (_0x24a77c?.['type'] === 'text') {
          const _0x5a79c0 = _0x170b97["viewport"]?.["zoom"] || 0x1;
          const _0xb12936 = {
            'x': Number(_0x4b1387['x'] || 0x0) * _0x5a79c0,
            'y': Number(_0x4b1387['y'] || 0x0) * _0x5a79c0
          };
          if (_0x4189d2["mode"] === "move") {
            _0x24a77c['x'] = _0x4b1387['x'] - _0x4189d2['offsetWorldX'];
            _0x24a77c['y'] = _0x4b1387['y'] - _0x4189d2['offsetWorldY'];
          } else {
            if (_0x4189d2["mode"] === 'scale-x' || _0x4189d2["mode"] === "scale-y") {
              const _0x5916b5 = this["_resolveAxisTextScale"](_0x4189d2, _0xb12936);
              _0x24a77c["scale"] = undefined;
              _0x24a77c["scaleX"] = _0x5916b5["scaleX"];
              _0x24a77c["scaleY"] = _0x5916b5["scaleY"];
              _0x24a77c['x'] = _0x5916b5['originPx']['x'] / _0x5a79c0;
              _0x24a77c['y'] = _0x5916b5["originPx"]['y'] / _0x5a79c0;
            } else {
              if (_0x4189d2["mode"] === "scale-uniform") {
                const _0x14e4d2 = this["_toTextLocalTransformSpace"](_0xb12936, _0x4189d2['originPx'], _0x4189d2["rotation"]);
                const _0x4aee84 = _0x14e4d2['x'] / _0x4189d2['baseWidthPx'];
                const _0xd0b884 = _0x14e4d2['y'] / _0x4189d2["baseHeightPx"];
                const _0x2cc522 = Math["max"](_0x4aee84, _0xd0b884);
                const _0xf7fc86 = Number['isFinite'](_0x2cc522) && _0x2cc522 > 0x0 ? _0x2cc522 : 0x1;
                _0x24a77c["scale"] = undefined;
                _0x24a77c["scaleX"] = clampTextScale(_0x4189d2["baseScaleX"] * _0xf7fc86);
                _0x24a77c["scaleY"] = clampTextScale(_0x4189d2["baseScaleY"] * _0xf7fc86);
                _0x24a77c['x'] = _0x4189d2["originPx"]['x'] / _0x5a79c0;
                _0x24a77c['y'] = _0x4189d2["originPx"]['y'] / _0x5a79c0;
              } else {
                if (_0x4189d2["mode"] === "rotate") {
                  const _0x5da801 = Math["atan2"](_0xb12936['y'] - _0x4189d2["centerPx"]['y'], _0xb12936['x'] - _0x4189d2["centerPx"]['x']);
                  const _0x1e559d = _0x4189d2["baseRotation"] + (_0x5da801 - _0x4189d2["baseAngle"]);
                  _0x24a77c["rotation"] = _0x1e559d;
                  const {
                    scaleX: _0xc79228,
                    scaleY: _0x5c9a10
                  } = getTextScalePair(_0x24a77c);
                  const _0x14b969 = {
                    'x': _0x4189d2["layoutWidth"] * _0xc79228 / 0x2,
                    'y': _0x4189d2["layoutHeight"] * _0x5c9a10 / 0x2
                  };
                  const _0x28bb36 = Math["cos"](_0x1e559d);
                  const _0x36e0e4 = Math['sin'](_0x1e559d);
                  const _0x4eb407 = _0x14b969['x'] * _0x28bb36 - _0x14b969['y'] * _0x36e0e4;
                  const _0x2fd583 = _0x14b969['x'] * _0x36e0e4 + _0x14b969['y'] * _0x28bb36;
                  const _0x33945c = {
                    'x': _0x4189d2["centerPx"]['x'] - _0x4eb407,
                    'y': _0x4189d2["centerPx"]['y'] - _0x2fd583
                  };
                  _0x24a77c['x'] = _0x33945c['x'] / _0x5a79c0;
                  _0x24a77c['y'] = _0x33945c['y'] / _0x5a79c0;
                }
              }
            }
          }
          this['_selectedTextCommandIndex'] = _0x4189d2["index"];
          this["_render"]();
        }
        return;
      }
      if (!_0x395689['down'] || !this["_draft"]) {
        return;
      }
      this["_draft"]["type"] === "rect" ? (this["_draft"]['x2'] = _0x4b1387['x'], this["_draft"]['y2'] = _0x4b1387['y']) : this["_draft"]["points"]["push"](_0x4b1387);
      this['_render']();
    };
    const _0xa56e64 = () => {
      if (_0x395689["down"] && _0x395689["textTransform"]) {
        _0x395689["down"] = ![];
        _0x395689["pointerId"] = null;
        _0x395689["textTransform"] = null;
        _0x395689['previousTool'] = null;
        _0x395689['temporaryTool'] = null;
        this['_temporaryTool'] = null;
        this["_redoStack"] = [];
        this["_dirty"] = !![];
        this["_persistLocalEditState"]();
        this["_render"]();
        return;
      }
      if (!_0x395689["down"] || !this["_draft"]) {
        return;
      }
      const _0x26f0cc = this["_draft"];
      this['_draft'] = null;
      _0x395689["down"] = ![];
      _0x395689["pointerId"] = null;
      const _0x2f4090 = _0x395689['previousTool'];
      _0x395689["previousTool"] = null;
      _0x395689["temporaryTool"] = null;
      _0x395689['textTransform'] = null;
      this['_temporaryTool'] = null;
      if (shouldDiscardStrokeCommand(_0x26f0cc)) {
        _0x2f4090 ? this["_syncCursor"](_0x2f4090, this['_view']?.["brushSizePx"]) : this["_syncCursor"]();
        this["_render"]();
        return;
      }
      if (_0x26f0cc["type"] === "rect") {
        const _0x466007 = Math["abs"](_0x26f0cc['x2'] - _0x26f0cc['x1']);
        const _0x3e8eda = Math["abs"](_0x26f0cc['y2'] - _0x26f0cc['y1']);
        if (_0x466007 < 0.5 && _0x3e8eda < 0.5) {
          _0x2f4090 ? this["_syncCursor"](_0x2f4090, this["_view"]?.['brushSizePx']) : this["_syncCursor"]();
          this["_render"]();
          return;
        }
      }
      this['_commands']["push"](_0x26f0cc);
      this["_redoStack"] = [];
      this["_dirty"] = !![];
      this["_persistLocalEditState"]();
      _0x2f4090 && this['_syncCursor'](_0x2f4090, this["_view"]?.["brushSizePx"]);
      this['_render']();
    };
    this['canvasEl']["addEventListener"]('pointerdown', _0x585e2b => {
      _0x585e2b["preventDefault"]();
      _0x585e2b["stopPropagation"]();
      _0x175dee(_0x585e2b["clientX"], _0x585e2b['clientY']);
      _0x623653(_0x585e2b["clientX"], _0x585e2b["clientY"], _0x585e2b["pointerId"], _0x585e2b["button"]);
    });
    this["canvasEl"]['addEventListener']("contextmenu", _0x6cf7ee => {
      _0x6cf7ee["preventDefault"]();
      _0x6cf7ee["stopPropagation"]();
    });
    this["canvasEl"]["addEventListener"]('pointermove', _0x7e3458 => {
      _0x7e3458["preventDefault"]();
      _0x7e3458["stopPropagation"]();
      _0x175dee(_0x7e3458["clientX"], _0x7e3458['clientY']);
      _0x5175c0(_0x7e3458["clientX"], _0x7e3458["clientY"]);
    });
    this['canvasEl']["addEventListener"]("pointerup", _0x185823 => {
      _0x185823["preventDefault"]();
      _0x185823["stopPropagation"]();
      _0x175dee(_0x185823["clientX"], _0x185823['clientY']);
      _0xa56e64();
    });
    this["canvasEl"]["addEventListener"]("pointercancel", _0x5dffd4 => {
      _0x5dffd4['preventDefault']();
      _0x5dffd4['stopPropagation']();
      _0x175dee(_0x5dffd4["clientX"], _0x5dffd4["clientY"]);
      _0xa56e64();
    });
    this["canvasEl"]["addEventListener"]("pointerenter", _0xe20fdb => {
      this['_cursorHover'] = !![];
      _0x175dee(_0xe20fdb['clientX'], _0xe20fdb["clientY"]);
    });
    this["canvasEl"]['addEventListener']("pointerleave", () => {
      this['_cursorHover'] = ![];
      this["_syncCursor"]();
    });
  },
  '_syncPaletteActive'() {
    if (!this["colorButtons"]) {
      return;
    }
    const _0x54f98d = normalizeColorName(this["_view"]?.["color"]) || "red";
    const _0x320dac = getColorCss(_0x54f98d);
    this["colorDotEl"] && (this["colorDotEl"]["style"]["background"] = _0x320dac, this["colorDotEl"]["style"]["borderColor"] = _0x54f98d === "black" ? 'var(--white-35)' : _0x54f98d === "white" ? 'var(--white-25)' : "var(--black-20)");
    this["colorButtons"]["forEach"](_0x5b0cd0 => {
      if (_0x5b0cd0["dataset"]["color"] === _0x54f98d) {
        _0x5b0cd0["classList"]['add']('active');
      } else {
        _0x5b0cd0["classList"]["remove"]("active");
      }
    });
  },
  '_onCanvasWheel'(_0x462b60) {
    _0x462b60["preventDefault"]();
    _0x462b60["stopPropagation"]();
    if (!this['active']) {
      return;
    }
    if (!this['_cursorHover']) {
      return;
    }
    const _0x546625 = this["_view"]?.["tool"] || "brush";
    if (_0x546625 !== "brush" && _0x546625 !== "eraser" && _0x546625 !== "bucket" && _0x546625 !== "number-label" && _0x546625 !== "text") {
      return;
    }
    const _0x56ae98 = _0x462b60["deltaY"] || 0x0;
    const _0x49aa5a = _0x56ae98 < 0x0 ? 0x1 : -0x1;
    const _0x3ae731 = clampImageBrushSize(this["_view"]?.["brushSizePx"], IMAGE_BRUSH_DEFAULT_SIZE_PX);
    const _0x281027 = clampImageBrushSize(_0x3ae731 + _0x49aa5a * 0x2, IMAGE_BRUSH_DEFAULT_SIZE_PX);
    if (_0x281027 === _0x3ae731) {
      return;
    }
    a1087_0x46f68a["setAnnotateState"]({
      'brushSizePx': _0x281027
    });
    if (this['sizeRangeEl']) {
      this["sizeRangeEl"]["value"] = String(_0x281027);
    }
    if (this["sizeValueEl"]) {
      this['sizeValueEl']["textContent"] = String(_0x281027);
    }
    this['_syncCursor']();
  },
  '_syncCursor'(_0x1d238c = this["_temporaryTool"] || this['_view']?.['tool'] || "brush", _0x92a599 = this["_view"]?.["brushSizePx"] || IMAGE_BRUSH_DEFAULT_SIZE_PX) {
    if (!this['cursorEl']) {
      return;
    }
    if (_0x1d238c === "text") {
      this["cursorEl"]["style"]['display'] = "none";
      this['cursorEl']["classList"]["remove"]('is-erase-brush');
      this["_syncTextToolCursor"]();
      return;
    }
    syncCircularBrushCursor({
      'cursorEl': this["cursorEl"],
      'canvasEl': this['canvasEl'],
      'visible': this["_cursorHover"],
      'tool': _0x1d238c,
      'allowedTools': ["brush", "eraser", "bucket", "number-label"],
      'sizePx': _0x92a599,
      'cursorLast': this['_cursorLast'],
      'isEraseBrush': this["_isGenerationScene"]() || _0x1d238c === "eraser"
    });
  },
  '_getTextScaleCursor'(_0x119769) {
    const _0xe46c92 = document["querySelector"]("#v2-wrap .group-resizer.v2-resize-move") || document['querySelector']("#v2-wrap .v2-resize-move");
    if (_0xe46c92) {
      const _0x1f8db1 = getComputedStyle(_0xe46c92)["cursor"];
      if (_0x1f8db1 && _0x1f8db1 !== 'auto') {
        return _0x1f8db1;
      }
    }
    return "move";
  },
  '_getCanvasPointerCursor'() {
    return getCssVar("--pointer-cursor") || "default";
  },
  '_syncTextToolCursor'() {
    if (!this["canvasEl"]) {
      return;
    }
    const _0x127500 = this["_getCanvasPointerCursor"]();
    if (!this["_cursorHover"]) {
      this["canvasEl"]["style"]["cursor"] = _0x127500;
      return;
    }
    const _0x2b0513 = a1087_0x46f68a["getStateRaw"]();
    const _0x149ff9 = _0x2b0513["nodes"]?.[this["nodeId"]];
    if (!_0x149ff9) {
      this['canvasEl']["style"]["cursor"] = _0x127500;
      return;
    }
    const _0x40d344 = this["_getLocalFromClient"](this["_cursorLast"]['x'], this["_cursorLast"]['y'], _0x2b0513, _0x149ff9);
    const _0x5cd614 = this['_findTextHit'](_0x40d344, _0x2b0513["viewport"]);
    if (!_0x5cd614) {
      this['canvasEl']["style"]["cursor"] = _0x127500;
      return;
    }
    if (_0x5cd614["mode"] === "delete" || _0x5cd614['mode'] === "copy") {
      this['canvasEl']["style"]["cursor"] = "var(--link-cursor)";
      return;
    }
    if (_0x5cd614["mode"] === "rotate") {
      this["canvasEl"]['style']["cursor"] = ROTATE_CURSOR_CSS + ',\x20' + _0x127500;
      return;
    }
    if (_0x5cd614["mode"] === "scale-uniform") {
      this["canvasEl"]["style"]["cursor"] = this["_getTextScaleCursor"](_0x5cd614);
      return;
    }
    if (_0x5cd614["mode"] === "scale-x") {
      this["canvasEl"]['style']["cursor"] = "var(--resize-ew-cursor)";
      return;
    }
    if (_0x5cd614["mode"] === "scale-y") {
      this["canvasEl"]["style"]["cursor"] = "var(--resize-ns-cursor)";
      return;
    }
    this["canvasEl"]["style"]["cursor"] = _0x127500;
  },
  '_updateToolActive'(_0xe758c4 = this["_view"]?.["tool"] || "brush", _0x3165d2 = this['_view']?.["brushSizePx"] || IMAGE_BRUSH_DEFAULT_SIZE_PX) {
    this["toolButtons"]["forEach"](_0x57101c => {
      if (_0x57101c['dataset']["tool"] === _0xe758c4) {
        _0x57101c["classList"]["add"]("active");
      } else {
        _0x57101c["classList"]["remove"]('active');
      }
    });
    this['_syncCursor'](_0xe758c4, _0x3165d2);
  },
  '_setTool'(_0x155ed5) {
    if (_0x155ed5 !== "text") {
      this["_removeTextInput"](!![]);
    }
    if (_0x155ed5 !== "text") {
      this["_selectedTextCommandIndex"] = null;
    }
    const _0x247a84 = getAnnotateToolbarToolsForScene(this['_mode']?.["scene"] || "annotate");
    const _0x13a991 = _0x247a84["includes"](_0x155ed5) ? _0x155ed5 : 'brush';
    a1087_0x46f68a["setAnnotateState"]({
      'tool': _0x13a991
    });
    this["_persistLocalEditState"]();
  },
  '_removeTextInput'(_0x5bb8d9 = !![], _0x444ee0 = null) {
    const _0x50fc50 = _0x444ee0 || this["_textInputEl"];
    if (!_0x50fc50) {
      return;
    }
    const _0x5f3edc = this["_textInputEl"] === _0x50fc50;
    const _0x8e2568 = String(_0x50fc50["value"] || '')["trim"]();
    const _0x4ee790 = Number(_0x50fc50["dataset"]['localX']);
    const _0x3a87f4 = Number(_0x50fc50['dataset']['localY']);
    const _0x137453 = Number(_0x50fc50["dataset"]['sizeWorld']);
    const _0xac577c = String(_0x50fc50["dataset"]["color"] || '');
    _0x50fc50["parentElement"] && _0x50fc50['parentElement']["removeChild"](_0x50fc50);
    _0x5f3edc && (this["_textInputEl"] = null);
    if (!_0x5f3edc) {
      return;
    }
    if (!_0x5bb8d9 || !_0x8e2568 || !Number["isFinite"](_0x4ee790) || !Number["isFinite"](_0x3a87f4) || !Number["isFinite"](_0x137453)) {
      return;
    }
    this["_commands"]['push']({
      'type': 'text',
      'text': _0x8e2568["slice"](0x0, 0xc8),
      'color': _0xac577c || getColorCanvas("red"),
      'sizeWorld': _0x137453,
      'x': _0x4ee790,
      'y': _0x3a87f4,
      'scale': 0x1,
      'scaleX': 0x1,
      'scaleY': 0x1,
      'rotation': 0x0
    });
    this["_selectedTextCommandIndex"] = this['_commands']["length"] - 0x1;
    this['_redoStack'] = [];
    this['_dirty'] = !![];
    this["_persistLocalEditState"]();
    this["_render"]();
  },
  '_openTextInput'(_0x39392b, _0x1c348a, _0x274501, _0x33b841, _0x37b123) {
    this["_removeTextInput"](!![]);
    const _0x3b71ba = document['createElement']("input");
    _0x3b71ba['type'] = 'text';
    _0x3b71ba['maxLength'] = 0xc8;
    _0x3b71ba["className"] = "v2-annotate-text-input";
    _0x3b71ba["dataset"]['localX'] = String(_0x39392b['x']);
    _0x3b71ba["dataset"]["localY"] = String(_0x39392b['y']);
    _0x3b71ba["dataset"]["sizeWorld"] = String(_0x274501);
    _0x3b71ba['dataset']["color"] = getColorCanvas(_0x1c348a["annotate"]?.['color'] || 'red');
    _0x3b71ba["style"]['left'] = _0x33b841 + 'px';
    _0x3b71ba["style"]['top'] = _0x37b123 + 'px';
    _0x3b71ba["style"]["setProperty"]('--annotate-text-input-size', clampImageBrushSize(_0x1c348a['annotate']?.["brushSizePx"], IMAGE_BRUSH_DEFAULT_SIZE_PX) + 'px');
    _0x3b71ba['style']["setProperty"]("--annotate-text-input-color", _0x3b71ba["dataset"]['color'] || getColorCanvas('red'));
    let _0x3c1a4e = ![];
    const _0x1d2c61 = _0x3c04b9 => {
      if (_0x3c1a4e) {
        return;
      }
      _0x3c1a4e = !![];
      this["_removeTextInput"](_0x3c04b9, _0x3b71ba);
    };
    _0x3b71ba["addEventListener"]('pointerdown', _0xfc81be => _0xfc81be["stopPropagation"]());
    _0x3b71ba["addEventListener"]("keydown", _0x59504e => {
      if (_0x59504e["key"] === 'Enter' && !_0x59504e["isComposing"]) {
        _0x59504e["preventDefault"]();
        _0x1d2c61(!![]);
      } else {
        _0x59504e['key'] === 'Escape' && (_0x59504e["preventDefault"](), _0x1d2c61(![]));
      }
    });
    _0x3b71ba['addEventListener']('blur', () => _0x1d2c61(!![]));
    this["overlayEl"]?.['appendChild'](_0x3b71ba);
    this['_textInputEl'] = _0x3b71ba;
    requestAnimationFrame(() => {
      if (this["_textInputEl"] === _0x3b71ba) {
        _0x3b71ba["focus"]();
      }
    });
  },
  '_getTextLayout'(_0x111e3f, _0x325574) {
    return getTextLayout({
      'canvasEl': this["canvasEl"],
      'cmd': _0x111e3f,
      'viewport': _0x325574
    });
  },
  '_getTextGeometry'(_0x1cbae1, _0x2c7025) {
    return getTextGeometry({
      'canvasEl': this['canvasEl'],
      'cmd': _0x1cbae1,
      'viewport': _0x2c7025
    });
  },
  '_toTextLocalTransformSpace'(_0x30e199, _0x49567f, _0x255067) {
    return toTextLocalTransformSpace(_0x30e199, _0x49567f, _0x255067);
  },
  '_rotateTextLocalPoint'(_0x4ca54f, _0x1644fa) {
    return rotateTextLocalPoint(_0x4ca54f, _0x1644fa);
  },
  '_resolveAxisTextScale'(_0x231d75, _0x3e8f34) {
    return resolveAxisTextScale(_0x231d75, _0x3e8f34);
  },
  '_deleteTextCommand'(_0x187175) {
    const _0x3cbb08 = Number(_0x187175);
    if (!Number["isInteger"](_0x3cbb08) || this["_commands"][_0x3cbb08]?.['type'] !== 'text') {
      return ![];
    }
    this["_commands"]["splice"](_0x3cbb08, 0x1);
    this['_selectedTextCommandIndex'] = null;
    this["_redoStack"] = [];
    this['_dirty'] = !![];
    this['_persistLocalEditState']();
    this['_render']();
    return !![];
  },
  '_copyTextCommand'(_0x17585f, _0x344042 = this["_view"]?.["viewport"]) {
    const _0x3db5e6 = Number(_0x17585f);
    const _0x22166f = this["_commands"][_0x3db5e6];
    if (!Number["isInteger"](_0x3db5e6) || _0x22166f?.["type"] !== "text") {
      return ![];
    }
    const _0x2c635e = buildCopiedTextCommand(_0x22166f, _0x344042);
    this["_commands"]["splice"](_0x3db5e6 + 0x1, 0x0, _0x2c635e);
    this["_selectedTextCommandIndex"] = _0x3db5e6 + 0x1;
    this["_redoStack"] = [];
    this["_dirty"] = !![];
    this["_persistLocalEditState"]();
    this["_render"]();
    return !![];
  },
  'deleteSelectedTextCommand'() {
    const _0x36d8a7 = Number(this["_selectedTextCommandIndex"]);
    if (!Number["isInteger"](_0x36d8a7)) {
      return ![];
    }
    return this["_deleteTextCommand"](_0x36d8a7);
  },
  '_findTextHit'(_0xcc23cc, _0x450eb2) {
    return findTextHit({
      'commands': this["_commands"],
      'selectedTextCommandIndex': this["_selectedTextCommandIndex"],
      'local': _0xcc23cc,
      'viewport': _0x450eb2,
      'canvasEl': this["canvasEl"]
    });
  },
  '_createTextTransformState'(_0xaac212, _0x5821b7, _0x380c41) {
    return createTextTransformState({
      'commands': this["_commands"],
      'hit': _0xaac212,
      'local': _0x5821b7,
      'viewport': _0x380c41,
      'canvasEl': this["canvasEl"]
    });
  },
  '_normalizeSelectedTextCommand'() {
    const _0x1ca161 = Number(this["_selectedTextCommandIndex"]);
    if (!Number["isInteger"](_0x1ca161) || _0x1ca161 < 0x0 || _0x1ca161 >= this["_commands"]["length"]) {
      this["_selectedTextCommandIndex"] = null;
      return;
    }
    this["_commands"][_0x1ca161]?.['type'] !== "text" && (this["_selectedTextCommandIndex"] = null);
  },
  '_updateView'(_0x10737e) {
    if (!this['active']) {
      return;
    }
    const _0x1dd01e = _0x10737e?.['node'];
    const _0x354c7f = _0x10737e?.["viewport"];
    if (!_0x1dd01e) {
      return;
    }
    this['nodeData'] = _0x1dd01e;
    const _0x5de452 = clampImageBrushSize(_0x10737e?.['brushSizePx'], IMAGE_BRUSH_DEFAULT_SIZE_PX);
    if (this["sizeRangeEl"] && Number(this["sizeRangeEl"]['value']) !== _0x5de452) {
      this["sizeRangeEl"]['value'] = String(_0x5de452);
    }
    if (this["sizeValueEl"] && this["sizeValueEl"]["textContent"] !== String(_0x5de452)) {
      this['sizeValueEl']["textContent"] = String(_0x5de452);
    }
    this['_updateToolActive'](_0x10737e?.["tool"], _0x5de452);
    this["_syncPaletteActive"](_0x10737e?.["color"]);
    const _0x5a18b6 = positionCanvasEditorSurface(this["containerEl"], _0x1dd01e, _0x354c7f);
    const _0x30c9b1 = _0x5a18b6["width"];
    const _0x1232f6 = _0x5a18b6["height"];
    const _0x3697b6 = window["devicePixelRatio"] || 0x1;
    const _0x2e9f0b = Math["max"](0x1, _0x30c9b1);
    const _0x4c4fb7 = Math["max"](0x1, _0x1232f6);
    if (this['canvasEl']["width"] !== Math["round"](_0x2e9f0b * _0x3697b6) || this['canvasEl']['height'] !== Math["round"](_0x4c4fb7 * _0x3697b6)) {
      this["canvasEl"]['width'] = Math["round"](_0x2e9f0b * _0x3697b6);
      this["canvasEl"]['height'] = Math["round"](_0x4c4fb7 * _0x3697b6);
      this["canvasEl"]["style"]["width"] = _0x2e9f0b + 'px';
      this["canvasEl"]["style"]['height'] = _0x4c4fb7 + 'px';
      const _0x4279ae = this["canvasEl"]["getContext"]('2d');
      _0x4279ae["setTransform"](_0x3697b6, 0x0, 0x0, _0x3697b6, 0x0, 0x0);
      _0x4279ae['lineCap'] = "round";
      _0x4279ae["lineJoin"] = 'round';
    }
    if (!this["_isAnnotateScene"]()) {
      const _0x416259 = Math["max"](0xc, Math["round"](_0x5a18b6['y']) - 0x36);
      this['toolbarEl']["style"]["left"] = Math["round"](_0x5a18b6['x'] + _0x30c9b1 / 0x2) + 'px';
      this["toolbarEl"]["style"]["top"] = _0x416259 + 'px';
    }
    this["generationToolbarEl"] && positionCanvasEditorToolbar(this["generationToolbarEl"], {
      'center': _0x5a18b6['x'] + _0x30c9b1 / 0x2,
      'top': _0x5a18b6['y'] + _0x1232f6 + 0xe
    });
    this["_applyStageFlip"](this["_getCurrentFlipState"]());
    this["_render"](_0x354c7f);
  },
  '_render'(_0x35fec2 = this['_view']?.["viewport"]) {
    if (!this["active"] || !this["canvasEl"]) {
      return;
    }
    this['_applyStageFlip'](this['_getCurrentFlipState']());
    const _0xe7e0fc = this["canvasEl"]["getContext"]('2d');
    const _0x192f3f = Number(this["canvasEl"]['style']["width"]["replace"]('px', '')) || 0x1;
    const _0x44b0c0 = Number(this['canvasEl']['style']['height']["replace"]('px', '')) || 0x1;
    _0xe7e0fc["clearRect"](0x0, 0x0, _0x192f3f, _0x44b0c0);
    const _0x4eb290 = toImageLocalRenderViewport(_0x35fec2);
    if (this["_isGenerationScene"]()) {
      this["_renderEraseSceneCommands"](_0xe7e0fc, _0x4eb290, this['_commands'], this['_draft']);
      return;
    }
    this["_renderCommands"](_0xe7e0fc, _0x4eb290, this["_commands"]);
    if (this["_draft"]) {
      this["_renderCommands"](_0xe7e0fc, _0x4eb290, [this['_draft']], !![]);
    }
  },
  '_renderEraseSceneCommands'(_0x46b443, _0x3a3fc0, _0x4ee706 = [], _0x30fe56 = null) {
    this['_eraseMaskCanvasEl'] = renderEraseSceneCommands({
      'documentRef': document,
      'canvasEl': this['canvasEl'],
      'ctx': _0x46b443,
      'viewport': _0x3a3fc0,
      'commands': _0x4ee706,
      'draft': _0x30fe56,
      'checkerPattern': this["_checkerPattern"],
      'eraseMaskCanvasEl': this['_eraseMaskCanvasEl']
    });
  },
  '_renderCommands'(_0xc1a7f2, _0x102e04, _0x5c9389, _0x363fe9 = ![]) {
    renderCommands({
      'ctx': _0xc1a7f2,
      'viewport': _0x102e04,
      'canvasEl': this["canvasEl"],
      'commands': _0x5c9389,
      'isDraft': _0x363fe9,
      'isEraseScene': this["_isEraseScene"](),
      'checkerPattern': this["_checkerPattern"],
      'defaultTextColor': getColorCanvas("red"),
      'getTextGeometry': (_0x4613ad, _0x17e725) => this["_getTextGeometry"](_0x4613ad, _0x17e725),
      'selectedTextCommandIndex': this["_selectedTextCommandIndex"],
      'selectedCommandsRef': this["_commands"],
      'resolveCssVar': getCssVar,
      'fillRegionCache': this["_fillRegionCache"],
      'numberLabelBackgroundColor': getCssVar('--canvas-white')
    });
  },
  '_addNumberLabel'(_0xa88135, _0x26e180) {
    if (!this["active"] || !this['_isAnnotateScene']()) {
      return null;
    }
    const _0x288424 = a1087_0x46f68a["getStateRaw"]();
    const _0x35151f = Number(_0xa88135?.['x']);
    const _0x1b9ad6 = Number(_0xa88135?.['y']);
    if (!Number["isFinite"](_0x35151f) || !Number["isFinite"](_0x1b9ad6)) {
      return null;
    }
    const _0x47af15 = {
      'type': 'number-label',
      'number': getNextNumberLabelValue(this["_commands"]),
      'x': _0x35151f,
      'y': _0x1b9ad6,
      'color': getColorCanvas(_0x288424["annotate"]?.['color'] || "red"),
      'sizeWorld': _0x26e180
    };
    this["_commands"]["push"](_0x47af15);
    this['_redoStack'] = [];
    this["_dirty"] = !![];
    this["_persistLocalEditState"]();
    this['_render']();
    return _0x47af15;
  },
  '_fillArea'(_0x173d59, _0x529918) {
    const _0xdecdf7 = a1087_0x46f68a['getStateRaw']();
    const _0x3c6bcf = {
      'type': "fill",
      'x': Number(_0x173d59?.['x']) || 0x0,
      'y': Number(_0x173d59?.['y']) || 0x0,
      'color': getColorCanvas(_0xdecdf7["annotate"]?.["color"] || 'red')
    };
    this['_commands']["push"](_0x3c6bcf);
    this["_redoStack"] = [];
    this["_dirty"] = !![];
    this["_persistLocalEditState"]();
    this["_render"]();
  },
  '_pushFlipCommand'(_0x170751) {
    if (!this["active"] || !this['_isAnnotateScene']()) {
      return;
    }
    if (_0x170751 !== "flip-horizontal" && _0x170751 !== "flip-vertical") {
      return;
    }
    this['_removeTextInput'](!![]);
    this['_commands']['push']({
      'type': _0x170751
    });
    this["_redoStack"] = [];
    this['_dirty'] = !![];
    this["_normalizeSelectedTextCommand"]();
    this["_render"]();
  },
  '_flipHorizontal'() {
    this["_pushFlipCommand"]('flip-horizontal');
  },
  '_flipVertical'() {
    this["_pushFlipCommand"]("flip-vertical");
  },
  '_undo'() {
    if (this["_commands"]['length'] === 0x0) {
      return;
    }
    const _0x350b6b = this['_commands']["pop"]();
    this["_redoStack"]["push"](_0x350b6b);
    this['_dirty'] = !![];
    this['_normalizeSelectedTextCommand']();
    this["_persistLocalEditState"]();
    this["_render"]();
  },
  '_redo'() {
    if (this["_redoStack"]["length"] === 0x0) {
      return;
    }
    const _0x243b36 = this["_redoStack"]["pop"]();
    this["_commands"]["push"](_0x243b36);
    this['_dirty'] = !![];
    this['_normalizeSelectedTextCommand']();
    this['_persistLocalEditState']();
    this['_render']();
  },
  '_clear'() {
    if (this['_commands']["length"] === 0x0 && this["_redoStack"]["length"] === 0x0) {
      return;
    }
    this["_commands"] = [];
    this['_redoStack'] = [];
    this["_draft"] = null;
    this['_selectedTextCommandIndex'] = null;
    this["_dirty"] = !![];
    this["_persistLocalEditState"]();
    this["_render"]();
  },
  '_applyBaseSurface'() {
    if (!this["stageEl"] || !this["imgEl"]) {
      return;
    }
    const _0x1a6ac2 = Boolean(this["_useWhiteboardBase"]);
    this["stageEl"]["classList"]["toggle"]("is-whiteboard", _0x1a6ac2);
    this["overlayEl"]?.["classList"]["toggle"]("is-whiteboard", _0x1a6ac2);
    this["imgEl"]['setAttribute']("aria-hidden", _0x1a6ac2 ? "true" : "false");
  },
  '_createNewWhiteboard'() {
    if (!this['active'] || this["_isGenerationScene"]()) {
      return;
    }
    this['_removeTextInput'](![]);
    this["_commands"] = [];
    this['_redoStack'] = [];
    this['_draft'] = null;
    this["_selectedTextCommandIndex"] = null;
    this["_useWhiteboardBase"] = !![];
    this["_dirty"] = !![];
    a1087_0x46f68a["setAnnotateState"]({
      'color': "black"
    });
    this['_applyBaseSurface']();
    this["_render"]();
    window["showToast"]?.(imageAnnotateText("toasts.newBoard"), 'ok');
  },
  '_persistLocalEditState'() {
    persistLocalEditState(this);
  },
  '_buildSelectionMaskCanvas'(_0x3e3349, _0x5a84ab, _0x585bbb, _0x43bfa5, _0xca61f = this["_commands"]) {
    return buildSelectionMaskCanvas({
      'documentRef': document,
      'commands': _0xca61f,
      'naturalW': _0x3e3349,
      'naturalH': _0x5a84ab,
      'scaleX': _0x585bbb,
      'scaleY': _0x43bfa5
    });
  },
  async '_buildGenerationPayload'(_0x435e95, _0x3d134f) {
    const _0x599ea5 = getImageFunctionRequestSettings(this["_functionSelection"]);
    const _0xcb5936 = structuredClone(this["_commands"]);
    const _0x17c5ee = await buildGenerationPayload({
      'scene': this['_mode']?.['scene'],
      'commands': _0xcb5936,
      'promptText': this["promptText"],
      'node': _0x435e95,
      'imgUrl': _0x3d134f,
      'model': this["model"],
      'provider': this["provider"],
      'imageSize': this["imageSize"],
      'erasePrompt': ERASE_GENERATE_PROMPT,
      'loadImage': _0x1343ba => this["_loadImage"](_0x1343ba),
      'createSelectionMaskCanvas': (_0x365493, _0x1bcabc, _0x1af4ae, _0x5b996b) => this['_buildSelectionMaskCanvas'](_0x365493, _0x1bcabc, _0x1af4ae, _0x5b996b, _0xcb5936),
      'getModelProvider': getModelProvider,
      'notify': (_0x21d504, _0x381f18) => window["showToast"]?.(_0x21d504, _0x381f18),
      'documentRef': document,
      'urlApi': URL
    });
    if (_0x17c5ee?.["payload"]) {
      Object['assign'](_0x17c5ee["payload"], _0x599ea5);
    }
    return _0x17c5ee;
  },
  async '_handleDebugRequest'() {
    if (!this["active"] || !this['_isGenerationScene']()) {
      return;
    }
    const _0x2a8f8b = a1087_0x46f68a["getState"]();
    const _0x28aa83 = _0x2a8f8b["nodes"]?.[this["nodeId"]];
    if (!_0x28aa83) {
      return;
    }
    const _0x58242f = this["_resolveNodeImageUrl"](_0x28aa83);
    if (!_0x58242f) {
      return;
    }
    let _0x1b3bfc = '';
    try {
      const _0x3af105 = await this["_buildGenerationPayload"](_0x28aa83, _0x58242f);
      if (!_0x3af105?.["payload"]) {
        return;
      }
      _0x1b3bfc = _0x3af105["inputUrl"] || '';
      const _0xe90772 = await buildGenerateImageRequest(_0x3af105["payload"]);
      const _0x50f3a6 = buildFinalApiDebugPreview(_0xe90772);
      openDebugRequestWindow(_0x50f3a6);
      window["showToast"]?.(imageAnnotateText("debug.shown"), "warn");
    } catch (_0x5e2e26) {
      window["showToast"]?.(imageAnnotateText("debug.buildRequestFailed", {
        'error': _0x5e2e26["message"]
      }), 'error');
    } finally {
      if (_0x1b3bfc) {
        URL["revokeObjectURL"](_0x1b3bfc);
      }
    }
  },
  async '_save'() {
    if (!this['active']) {
      return;
    }
    this["_removeTextInput"](!![]);
    const _0x510c32 = a1087_0x46f68a["getState"]();
    const _0x1fd88e = _0x510c32['nodes'][this["nodeId"]];
    if (!_0x1fd88e) {
      return;
    }
    const _0x2f6ba5 = this["_isGenerationScene"]();
    const _0x2599f7 = this["_isAnnotateScene"]() ? getEditorRotation(this) : 0x0;
    const _0xf0c6db = this["_isAnnotateScene"]() && getKeepImageRatio(this["_commands"]);
    const _0x523147 = this['_resolveNodeImageUrl'](_0x1fd88e, {
      'preferPreview': !_0x2f6ba5 && !_0x2599f7
    });
    if (!_0x523147) {
      return;
    }
    if (_0x2f6ba5) {
      return submitLocalEdit(this, _0x1fd88e, _0x523147);
    }
    const _0x938343 = this['generationToolbarEl']?.["querySelector"](".go") || this["toolbarEl"]["querySelector"](".act-save");
    const _0x1c0def = _0x938343?.['querySelector']("span") || null;
    const _0x44d7be = _0x1c0def ? _0x1c0def["textContent"] : '';
    _0x1c0def && (_0x1c0def['textContent'] = this["_mode"]?.['submitBusyLabel'] || imageAnnotateText("actions.saving"));
    if (!_0x938343) {
      return;
    }
    _0x938343["style"]["pointerEvents"] = "none";
    let _0x399f58 = '';
    let _0x168203 = 0x0;
    try {
      const _0x1e9825 = this["_isEraseScene"]();
      const _0x109fb6 = !_0x1e9825 && this["_useWhiteboardBase"];
      const _0x4ca25e = this["_mode"]?.['scene'];
      const _0x3c92de = this["nodeId"];
      const _0x258c39 = Array['isArray'](this["_commands"]) ? this['_commands']['map'](_0x2db0af => _0x2db0af && typeof _0x2db0af === 'object' ? {
        ..._0x2db0af
      } : _0x2db0af) : [];
      const _0x17961f = this["imgEl"];
      const _0x2ac033 = this["_getCurrentFlipState"]();
      const _0x534997 = getCssVar('--canvas-white');
      const _0x478a25 = getColorCanvas("red");
      const _0x1d9b59 = Date["now"]();
      const _0x1855b2 = getImageRotationLayout(_0x1fd88e["width"], _0x1fd88e['height'], _0x2599f7, _0xf0c6db);
      const _0x52510e = createPendingAnnotateExportNode({
        'scene': _0x4ca25e,
        'sourceNodeId': _0x3c92de,
        'baseNode': _0x1fd88e,
        'startedAt': _0x1d9b59,
        'outputSize': _0x1855b2
      });
      _0x399f58 = _0x52510e['newNodeId'];
      _0x168203 = _0x1d9b59;
      this["exit"]({
        'silent': !![]
      });
      const {
        blob: _0x5dd7e4,
        exportType: _0x258b28,
        naturalWidth: _0x48c25d,
        naturalHeight: _0x49cbb5
      } = await exportAnnotateCanvasBlob({
        'documentRef': document,
        'node': _0x1fd88e,
        'imgEl': _0x17961f,
        'imgUrl': _0x523147,
        'commands': _0x258c39,
        'rotationDegrees': _0x2599f7,
        'keepRatio': _0xf0c6db,
        'useWhiteboardBase': _0x109fb6,
        'isEraseScene': _0x1e9825,
        'loadImage': _0x15a592 => this["_loadImage"](_0x15a592),
        'getCurrentFlipState': () => _0x2ac033,
        'applyFlipTransformToContext': (_0x182c7e, _0x4911f1, _0xe70281, _0x489c2a) => this["_applyFlipTransformToContext"](_0x182c7e, _0x4911f1, _0xe70281, _0x489c2a),
        'createSelectionMaskCanvas': (_0x30ac0a, _0x3d6785, _0x53d047, _0x27fec0) => buildSelectionMaskCanvas({
          'documentRef': document,
          'commands': _0x258c39,
          'naturalW': _0x30ac0a,
          'naturalH': _0x3d6785,
          'scaleX': _0x53d047,
          'scaleY': _0x27fec0
        }),
        'canvasWhiteColor': _0x534997,
        'defaultTextColor': _0x478a25,
        'fastDisplayExport': !_0x2599f7
      });
      await saveAnnotateExportResult({
        'blob': _0x5dd7e4,
        'exportType': _0x258b28,
        'scene': _0x4ca25e,
        'sourceNodeId': _0x3c92de,
        'baseNode': _0x1fd88e,
        'targetNodeId': _0x52510e["newNodeId"],
        'outputSize': _0x1855b2,
        'naturalWidth': _0x48c25d,
        'naturalHeight': _0x49cbb5,
        'startedAt': _0x1d9b59,
        'notify': (_0x323dfe, _0x274534) => window["showToast"]?.(_0x323dfe, _0x274534),
        'triggerLocalCacheSave': () => window['_triggerLocalCacheSave']?.()
      });
    } catch (_0x5b6c90) {
      console['error']("[Annotate] save failed:", _0x5b6c90);
      markAnnotateExportNodeFailed({
        'targetNodeId': _0x399f58,
        'error': _0x5b6c90,
        'startedAt': _0x168203
      });
      window["showToast"]?.(imageAnnotateText('toasts.saveFailed'), 'error');
    } finally {
      if (_0x1c0def) {
        _0x1c0def["textContent"] = _0x44d7be;
      }
      _0x938343["style"]['pointerEvents'] = 'auto';
    }
  },
  '_resolveNodeImageUrl'(_0x3fb7df, _0x4ccb39 = {}) {
    return resolveImageNodeUrl(_0x3fb7df, _0x4ccb39);
  },
  '_loadImage'(_0x21f564) {
    return new Promise((_0x4005d5, _0x4350af) => {
      const _0x1151eb = new Image();
      _0x1151eb['crossOrigin'] = "anonymous";
      _0x1151eb["onload"] = () => _0x4005d5(_0x1151eb);
      _0x1151eb['onerror'] = () => _0x4350af(new Error(imageAnnotateText("errors.imageLoadFailed")));
      _0x1151eb["src"] = _0x21f564;
    });
  }
};
export default ImageAnnotateController;