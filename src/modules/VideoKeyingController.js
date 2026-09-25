import { openDebugRequestWindow } from './debugRequestWindow.js';
import { RUNNINGHUB_INSTANCE_OPTIONS } from './runningHubInstanceTypes.js';
import a1609_0x11cf93 from '../core/stores/appStore.js';
import { generateId } from '../core/math.js';
import { calcSafeSpawnPosNearNode } from './nodeSpawn.js';
import { commit } from './history.js';
import { showProviderApiKeyMissingToast } from './providerApiKeyMissingToast.js';
import { buildGenerateVideoRequest } from '../../api/aiVideoApi.js';
import { getShortcuts, handleShortcutKeydown } from './shortcuts.js';
import { compositeCheckerMask, createEraseCheckerboardPattern, drawEraseMaskCommand, getEraseCanvasPalette } from './eraseBrushRenderer.js';
import { clampImageBrushSize, drawRoundBrushStroke, getBrushLineWidth, syncCircularBrushCursor } from './imageEditorBrushStyle.js';
import { buildSourceMediaNodePayload, getAutoMediaSizeByShortSide, getNodeDefaultSize } from '../services/fileService.js';
import { releaseCanvasPanShortcut } from '../services/canvasPanShortcutState.js';
import { applyDebugWrenchIcon, buildFinalApiDebugPreview } from '../utils/debugRequestPreview.js';
import { localPathToUrl } from '../utils/localMediaPath.js';
import { attachVideoKeyingPlaybackSource, setVideoKeyingMediaKeepAlive } from './videoKeyingMediaHelpers.js';
import { renderVideoTimelineThumbnails } from './videoTimelineThumbnails.js';
import { resolveNodeVideoElement } from './nodeVideoElement.js';
import { resolveCanvasVideoPosterUrl } from '../services/canvasMediaLocalService.js';
import { buildGenerationStartPatch } from '../core/generationTaskLifecycle.js';
import { getVideoKeyingModelId } from './videoKeyingManifestResolver.js';
import { RH_DEFAULT_INSTANCE_TYPE, RH_DEFAULT_KEYING_FPS, RH_DEFAULT_KEYING_MASK_MODE, RH_DEFAULT_KEYING_RESOLUTION, getRhKeyingFpsOptions, getRunningHubWorkflowAccess, hasUsableKeyingSettingValue, normalizeRhInstanceType, normalizeRhKeyingFps, normalizeRhKeyingResolution, resolveSourceVideoKeyingSetting } from './videoKeyingSettings.js';
import { onLocaleChange } from '../i18n/index.js';
import { buildVideoKeyingOutputText, videoKeyingText } from './videoKeyingTextHelpers.js';
import { videoKeyingLifecycleMethods } from './videoKeyingLifecycleMethods.js';
import { measureVideoKeyingProjection } from './videoKeyingProjection.js';
import { getVideoKeyingMaxSourceVideoMB, isVideoKeyingSourceVideoTooLarge } from './videoKeyingSourceVideoLimit.js';
import { cancelVideoKeyingTaskForNode, getRunningVideoKeyingTaskForNode, runVideoKeyingTask } from './videoKeyingTaskRuntime.js';
const REMOVE_POS_POINT_LIMIT = 0xbb8;
const REMOVE_MASK_MAX_SIDE = 0x200;
const VideoKeyingController = {
  'active': ![],
  'nodeId': null,
  'wrapperEl': null,
  'barEl': null,
  'trackEl': null,
  'playheadEl': null,
  'cancelBtnEl': null,
  'confirmBtnEl': null,
  'thumbEls': null,
  'videoEl': null,
  'durationSec': 0x0,
  '_thumbToken': 0x0,
  '_sourceToken': 0x0,
  '_playheadRaf': 0x0,
  '_retryRaf': 0x0,
  '_retryCount': 0x0,
  '_onLoadedMeta': null,
  '_onDurationChange': null,
  '_onPointerMove': null,
  '_onPointerUp': null,
  '_onPointerCancel': null,
  '_onKeyDown': null,
  '_onDocClick': null,
  '_hiddenEls': null,
  'markLayerEl': null,
  'markCanvasEl': null,
  'removeMaskCanvasEl': null,
  'removeCursorEl': null,
  '_marks': null,
  '_marksRedo': null,
  '_removeDraft': null,
  '_removeDrawPointerId': null,
  '_removeCursorHover': ![],
  '_removeCursorLast': {
    'x': 0x0,
    'y': 0x0
  },
  '_removeCursorRaf': 0x0,
  '_removeWheelCleanup': null,
  '_onMarkPointerDown': null,
  '_onMarkPointerMove': null,
  '_onMarkPointerUp': null,
  '_onMarkPointerCancel': null,
  '_onMarkPointerEnter': null,
  '_onMarkPointerLeave': null,
  '_onMarkWheel': null,
  '_onVideoPlay': null,
  '_renderMarksFn': null,
  '_onResize': null,
  '_onShortcutsUpdated': null,
  '_onKeyingSettingsDocDown': null,
  '_lastFrameIndex': null,
  '_lastFrameIndexFps': null,
  'helperRightEl': null,
  'hintEl': null,
  'removeToolbarEl': null,
  'removeSizeValueEl': null,
  'removeSizeRangeEl': null,
  'uiMode': "keying",
  '_removePointTool': 'foreground',
  '_removeBrushSizePx': 0x28,
  '_lastHelperRightText': null,
  '_lastConfirmEnabled': null,
  '_unsubscribeLocale': null,
  'isActiveFor'(_0x5f15ee) {
    return !!_0x5f15ee && this["active"] === !![] && this["nodeId"] === _0x5f15ee;
  },
  '_isRemoveUiMode'() {
    return this["uiMode"] === 'remove';
  },
  '_setRemovePointTool'(_0x700a54) {
    const _0x1eeae0 = _0x700a54 === "background" ? "background" : 'foreground';
    this['_removePointTool'] = _0x1eeae0;
    if (this["removeToolbarEl"]) {
      const _0x14d352 = _0x1eeae0 === "background" ? "eraser" : 'brush';
      this["removeToolbarEl"]["querySelectorAll"](".tool-btn")["forEach"](_0xa20b51 => {
        _0xa20b51["classList"]["toggle"]("active", _0xa20b51["dataset"]['tool'] === _0x14d352);
      });
    }
    this["_syncRemoveCursor"]();
  },
  '_clampRemoveBrushSize'(_0x1bb0bf) {
    return clampImageBrushSize(_0x1bb0bf, 0x28);
  },
  '_getRemoveToolType'() {
    return this['_removePointTool'] === "background" ? 'eraser' : 'brush';
  },
  '_getShortcutText'(_0x50bfb0, _0x480171 = '') {
    const _0x570103 = getShortcuts?.();
    const _0x1fc34e = _0x570103?.[_0x50bfb0]?.['keys'];
    if (!Array["isArray"](_0x1fc34e) || _0x1fc34e['length'] === 0x0) {
      return _0x480171;
    }
    return _0x1fc34e['join']('+');
  },
  '_buildShortcutTooltip'(_0x557222, _0x1abb32, _0x251d03 = '') {
    const _0x238908 = this["_getShortcutText"](_0x1abb32, _0x251d03);
    return _0x238908 ? _0x557222 + '\x20' + _0x238908 : _0x557222;
  },
  '_syncRemoveBrushControls'() {
    const _0x353a42 = this['_clampRemoveBrushSize'](this['_removeBrushSizePx']);
    this["removeSizeRangeEl"] && Number(this["removeSizeRangeEl"]["value"]) !== _0x353a42 && (this["removeSizeRangeEl"]['value'] = String(_0x353a42));
    this["removeSizeValueEl"] && (this["removeSizeValueEl"]["textContent"] = String(_0x353a42));
  },
  '_refreshRemoveShortcutUi'() {
    if (!this["_isRemoveUiMode"]()) {
      return;
    }
    if (this["removeToolbarEl"]) {
      const _0x58b610 = [['.act-cancel', videoKeyingText("tools.cancel")], ["[data-tool=\"brush\"]", this["_buildShortcutTooltip"](videoKeyingText('tools.brush'), "editor-tool-brush", 'B')], ['[data-tool=\x22eraser\x22]', this["_buildShortcutTooltip"](videoKeyingText("tools.eraser"), 'editor-tool-eraser', 'E')], [".act-undo", this["_buildShortcutTooltip"](videoKeyingText("tools.undo"), "undo", 'Ctrl+Z')], [".act-redo", this["_buildShortcutTooltip"](videoKeyingText("tools.redo"), "redo", "Ctrl+Shift+Z")], ['.act-clear', this["_buildShortcutTooltip"](videoKeyingText("tools.clear"), "editor-clear", 'R')]];
      _0x58b610["forEach"](([_0x388b8b, _0x32b092]) => {
        const _0x505a29 = this["removeToolbarEl"]?.["querySelector"](_0x388b8b);
        if (!_0x505a29) {
          return;
        }
        _0x505a29["setAttribute"]("data-tooltip", _0x32b092);
        _0x505a29['title'] = _0x32b092;
      });
    }
    if (this["hintEl"]) {
      const _0x302d37 = [videoKeyingText("hint.removeTitle"), videoKeyingText("hint.shortcutPrefix"), this['_getShortcutText']("editor-tool-brush", 'B'), videoKeyingText('tools.brush'), '\x20\x20', this['_getShortcutText']("editor-tool-eraser", 'E'), videoKeyingText("tools.eraser"), '\x20\x20', this["_getShortcutText"]('editor-clear', 'R'), videoKeyingText("tools.clear"), '\x20\x20', this['_getShortcutText']('undo', "Ctrl+Z"), videoKeyingText('tools.undo'), '\x20\x20', this["_getShortcutText"]("redo", "Ctrl+Shift+Z"), videoKeyingText("tools.redo"), videoKeyingText("hint.wheelBrushSize")];
      const _0x3772ba = Array["from"](this['hintEl']['children']);
      _0x302d37["forEach"]((_0x2001d6, _0x4a72e9) => {
        if (_0x3772ba[_0x4a72e9]) {
          _0x3772ba[_0x4a72e9]['textContent'] = _0x2001d6;
        }
      });
    }
  },
  '_refreshKeyingHintUi'() {
    if (!this["hintEl"] || this['_isRemoveUiMode']()) {
      return;
    }
    const _0x521e42 = [videoKeyingText("hint.leftClick"), videoKeyingText("hint.selectTarget"), '\x20\x20', videoKeyingText('hint.rightClick'), videoKeyingText("hint.excludeTarget"), videoKeyingText('hint.shortcutPrefix'), this['_getShortcutText']("editor-clear", 'R'), videoKeyingText('hint.clearAllPoints'), '\x20\x20', this["_getShortcutText"]("undo", "Ctrl+Z"), videoKeyingText("tools.undo"), '\x20\x20', this['_getShortcutText']("redo", "Ctrl+Shift+Z"), videoKeyingText("tools.redo")];
    const _0x2986c9 = Array["from"](this["hintEl"]['children']);
    _0x521e42["forEach"]((_0x385563, _0x5dd3aa) => {
      if (_0x2986c9[_0x5dd3aa]) {
        _0x2986c9[_0x5dd3aa]["textContent"] = _0x385563;
      }
    });
  },
  '_onRemoveCanvasWheel'(_0x3635ef) {
    _0x3635ef["preventDefault"]();
    _0x3635ef["stopPropagation"]();
    if (!this["active"] || !this['_isRemoveUiMode']() || !this['_removeCursorHover']) {
      return;
    }
    const _0x26d07f = _0x3635ef["deltaY"] || 0x0;
    const _0x4cbdfc = _0x26d07f < 0x0 ? 0x1 : -0x1;
    const _0x248649 = this["_clampRemoveBrushSize"](this["_removeBrushSizePx"]);
    const _0x49dcc4 = this['_clampRemoveBrushSize'](_0x248649 + _0x4cbdfc * 0x2);
    if (_0x49dcc4 === _0x248649) {
      return;
    }
    this['_removeBrushSizePx'] = _0x49dcc4;
    this['_syncRemoveBrushControls']();
    this['_syncRemoveCursor']();
  },
  '_measureProjection'({
    videoEl = this["videoEl"] || this["_getVideoEl"](),
    layerEl = null
  } = {}) {
    return measureVideoKeyingProjection({
      'videoElement': videoEl,
      'layerElement': layerEl
    });
  },
  '_scheduleRemoveCursor'(_0x1661d3, _0x375af8) {
    this['_removeCursorLast'] = {
      'x': Number(_0x1661d3) || 0x0,
      'y': Number(_0x375af8) || 0x0
    };
    if (this["_removeCursorRaf"]) {
      return;
    }
    this['_removeCursorRaf'] = requestAnimationFrame(() => {
      this["_removeCursorRaf"] = 0x0;
      this["_syncRemoveCursor"]();
    });
  },
  '_syncRemoveCursor'() {
    const _0x501205 = this["markLayerEl"];
    const _0x4ac6a5 = this["removeCursorEl"];
    if (!this["_isRemoveUiMode"]() || !_0x501205 || !_0x4ac6a5) {
      return;
    }
    const _0xfb1b2f = () => syncCircularBrushCursor({
      'cursorEl': _0x4ac6a5,
      'canvasEl': _0x501205,
      'visible': ![]
    });
    if (!this["_removeCursorHover"]) {
      _0xfb1b2f();
      return;
    }
    const _0x30b706 = this['_measureProjection']({
      'layerEl': _0x501205
    });
    const _0x5dea00 = _0x30b706?.["video"];
    const _0x5448f0 = _0x30b706?.["layer"];
    const _0x119c41 = _0x30b706?.["pickClientPoint"](this["_removeCursorLast"]['x'], this["_removeCursorLast"]['y']);
    const _0x249044 = _0x119c41 ? _0x30b706["normalizedToLayerPoint"](_0x119c41['nx'], _0x119c41['ny']) : null;
    if (!_0x5dea00 || !_0x5448f0 || !_0x119c41 || !_0x249044) {
      _0xfb1b2f();
      return;
    }
    const _0x1601e2 = Number(_0x249044?.['x']);
    const _0x836e4f = Number(_0x249044?.['y']);
    if (!Number['isFinite'](_0x1601e2) || !Number["isFinite"](_0x836e4f) || _0x1601e2 < 0x0 || _0x836e4f < 0x0 || _0x1601e2 > _0x5448f0['lw'] || _0x836e4f > _0x5448f0['lh']) {
      _0xfb1b2f();
      return;
    }
    const _0x58a28f = this["_clampRemoveBrushSize"](this["_removeBrushSizePx"]);
    syncCircularBrushCursor({
      'cursorEl': _0x4ac6a5,
      'canvasEl': _0x501205,
      'visible': !![],
      'tool': this['_getRemoveToolType'](),
      'allowedTools': ['brush', "eraser"],
      'sizePx': _0x58a28f,
      'cursorLast': {
        'x': _0x1601e2,
        'y': _0x836e4f
      },
      'isEraseBrush': !![]
    });
  },
  '_attachMarkLayerListeners'() {
    const _0x3ed7b1 = this["markLayerEl"];
    if (!_0x3ed7b1) {
      return;
    }
    if (this["_onMarkPointerDown"]) {
      _0x3ed7b1["addEventListener"]('pointerdown', this["_onMarkPointerDown"]);
    }
    if (this['_onMarkPointerMove']) {
      _0x3ed7b1["addEventListener"]("pointermove", this["_onMarkPointerMove"]);
    }
    if (this['_onMarkPointerUp']) {
      _0x3ed7b1["addEventListener"]("pointerup", this["_onMarkPointerUp"]);
    }
    if (this["_onMarkPointerCancel"]) {
      _0x3ed7b1["addEventListener"]('pointercancel', this["_onMarkPointerCancel"]);
    }
    if (this["_onMarkPointerCancel"]) {
      _0x3ed7b1["addEventListener"]('lostpointercapture', this['_onMarkPointerCancel']);
    }
    if (this["_onMarkPointerEnter"]) {
      _0x3ed7b1["addEventListener"]("pointerenter", this["_onMarkPointerEnter"]);
    }
    if (this["_onMarkPointerLeave"]) {
      _0x3ed7b1['addEventListener']("pointerleave", this["_onMarkPointerLeave"]);
    }
  },
  '_detachMarkLayerListeners'(_0x1d0115 = this["markLayerEl"]) {
    if (!_0x1d0115) {
      return;
    }
    if (this["_onMarkPointerDown"]) {
      _0x1d0115["removeEventListener"]('pointerdown', this["_onMarkPointerDown"]);
    }
    if (this["_onMarkPointerMove"]) {
      _0x1d0115['removeEventListener']('pointermove', this["_onMarkPointerMove"]);
    }
    if (this["_onMarkPointerUp"]) {
      _0x1d0115["removeEventListener"]('pointerup', this["_onMarkPointerUp"]);
    }
    if (this['_onMarkPointerCancel']) {
      _0x1d0115['removeEventListener']('pointercancel', this["_onMarkPointerCancel"]);
    }
    if (this["_onMarkPointerCancel"]) {
      _0x1d0115['removeEventListener']("lostpointercapture", this["_onMarkPointerCancel"]);
    }
    if (this["_onMarkPointerEnter"]) {
      _0x1d0115["removeEventListener"]("pointerenter", this["_onMarkPointerEnter"]);
    }
    if (this["_onMarkPointerLeave"]) {
      _0x1d0115["removeEventListener"]("pointerleave", this["_onMarkPointerLeave"]);
    }
  },
  '_collectRemovePosPoints'(_0x53562e = REMOVE_POS_POINT_LIMIT) {
    const _0x3cc506 = Array["isArray"](this["_marks"]) ? this["_marks"] : [];
    const _0x41a0cf = _0x3cc506["filter"](_0x1a0368 => _0x1a0368 && (_0x1a0368["type"] === "brush" || _0x1a0368["type"] === "eraser"));
    const _0x3be81e = _0x41a0cf["some"](_0x2df072 => _0x2df072["type"] === "brush");
    if (!_0x3be81e) {
      return [];
    }
    const _0x38c6cf = Math["max"](0x1, Math["trunc"](Number(_0x53562e) || REMOVE_POS_POINT_LIMIT));
    const _0x2d0fda = this["videoEl"] || this["_getVideoEl"]();
    const _0xc49774 = Math["max"](0x1, Number(_0x2d0fda?.['videoWidth']) || Number(_0x2d0fda?.['offsetWidth']) || REMOVE_MASK_MAX_SIDE);
    const _0x2ee8b4 = Math["max"](0x1, Number(_0x2d0fda?.["videoHeight"]) || Number(_0x2d0fda?.["offsetHeight"]) || REMOVE_MASK_MAX_SIDE);
    const _0x2fac6e = Math["min"](0x1, REMOVE_MASK_MAX_SIDE / Math["max"](_0xc49774, _0x2ee8b4));
    const _0x249459 = Math["max"](0x1, Math["round"](_0xc49774 * _0x2fac6e));
    const _0x45bbf6 = Math["max"](0x1, Math['round'](_0x2ee8b4 * _0x2fac6e));
    const _0x4b7f7b = document['createElement']("canvas");
    _0x4b7f7b['width'] = _0x249459;
    _0x4b7f7b["height"] = _0x45bbf6;
    const _0x537399 = _0x4b7f7b["getContext"]('2d', {
      'willReadFrequently': !![]
    });
    if (!_0x537399) {
      return [];
    }
    const _0x1c586a = getEraseCanvasPalette();
    const _0x533e94 = _0x249459 / Math["max"](0x1, Number(_0x2d0fda?.["offsetWidth"]) || _0x249459);
    _0x41a0cf["forEach"](_0x345c2a => {
      const _0x31b786 = Array["isArray"](_0x345c2a['points']) ? _0x345c2a['points'] : [];
      if (!_0x31b786["length"]) {
        return;
      }
      const _0xea4ad8 = _0x345c2a["type"] === "eraser" ? 'eraser' : "brush";
      const _0x162b09 = getBrushLineWidth(this['_clampRemoveBrushSize'](_0x345c2a["brushSizePx"]), _0x533e94, _0xea4ad8);
      const _0x2ff328 = _0x31b786['map'](_0x3ca0de => ({
        'x': Math["max"](0x0, Math["min"](0x1, Number(_0x3ca0de?.['nx']) || 0x0)) * (_0x249459 - 0x1),
        'y': Math["max"](0x0, Math["min"](0x1, Number(_0x3ca0de?.['ny']) || 0x0)) * (_0x45bbf6 - 0x1)
      }));
      _0x537399["save"]();
      const _0x38b36a = _0xea4ad8 === "eraser" ? _0x1c586a["eraseDark"] : _0x1c586a["brushLight"];
      drawRoundBrushStroke(_0x537399, {
        'points': _0x2ff328,
        'lineWidth': _0x162b09,
        'strokeStyle': _0x38b36a,
        'fillStyle': _0x38b36a,
        'globalCompositeOperation': _0xea4ad8 === "eraser" ? 'destination-out' : "source-over"
      });
      _0x537399['restore']();
    });
    const _0x8e3549 = _0x537399["getImageData"](0x0, 0x0, _0x249459, _0x45bbf6)["data"];
    const _0x177944 = [];
    const _0x1f43ad = new Set();
    const _0x4c0c61 = (_0x134f3f, _0x584ca8) => {
      const _0x4a6500 = _0x249459 > 0x1 ? _0x134f3f / (_0x249459 - 0x1) : 0x0;
      const _0x5a818a = _0x45bbf6 > 0x1 ? _0x584ca8 / (_0x45bbf6 - 0x1) : 0x0;
      const _0x32e201 = Math["round"](_0x4a6500 * 0xfa0) + ':' + Math["round"](_0x5a818a * 0xfa0);
      if (_0x1f43ad["has"](_0x32e201)) {
        return;
      }
      _0x1f43ad["add"](_0x32e201);
      _0x177944["push"]({
        'x': _0x4a6500,
        'y': _0x5a818a
      });
    };
    const _0x3870a6 = _0xa0b1a5 => {
      for (let _0x3c5b64 = 0x0; _0x3c5b64 < _0x45bbf6; _0x3c5b64 += _0xa0b1a5) {
        for (let _0x324021 = 0x0; _0x324021 < _0x249459; _0x324021 += _0xa0b1a5) {
          const _0x1fab43 = (_0x3c5b64 * _0x249459 + _0x324021) * 0x4;
          if (_0x8e3549[_0x1fab43 + 0x3] < 0x8) {
            continue;
          }
          _0x4c0c61(_0x324021, _0x3c5b64);
          if (_0x177944["length"] >= _0x38c6cf) {
            return !![];
          }
        }
      }
      return ![];
    };
    const _0x4881ac = Math['max'](0x1, Math['floor'](Math["max"](_0x249459, _0x45bbf6) / 0xdc));
    const _0x13ab46 = _0x3870a6(_0x4881ac);
    !_0x13ab46 && _0x177944["length"] < Math["min"](_0x38c6cf, 0x50) && _0x4881ac > 0x1 && _0x3870a6(0x1);
    if (_0x177944["length"] > _0x38c6cf) {
      _0x177944["length"] = _0x38c6cf;
    }
    return _0x177944;
  },
  '_getKeyingMeta'() {
    const _0x446c5a = a1609_0x11cf93["getState"]()['nodes']?.[this['nodeId']] || {};
    const {
      fps: _0x4314ad,
      resolution: _0x39a3c6
    } = this["_getRhVideoSettings"](_0x446c5a);
    const _0x55b10c = Math["max"](0x1, Math["round"]((Number(this["durationSec"]) || 0x0) * _0x4314ad) || 0x1);
    const _0x57bc4d = this["videoEl"] || this["_getVideoEl"]();
    const _0x140701 = Math['max'](0x0, Math["min"](Number(this["durationSec"]) || 0x0, Number(_0x57bc4d?.["currentTime"]) || 0x0));
    const _0x2ba43c = Math["min"](_0x55b10c, Math["max"](0x0, Math['round'](_0x140701 * _0x4314ad)));
    return {
      'fps': _0x4314ad,
      'res': _0x39a3c6,
      'totalFrames': _0x55b10c,
      'frameIndex': _0x2ba43c
    };
  },
  '_calcKeyingFrameSize'(_0x20c1f2, _0x32bb1e, _0x29acbf) {
    const _0x4d3432 = Math["max"](0x0, Math["trunc"](Number(_0x20c1f2) || 0x0));
    const _0xd9e7c5 = Math["max"](0x0, Math["trunc"](Number(_0x32bb1e) || 0x0));
    const _0x150d92 = Math["max"](0x0, Math["trunc"](Number(_0x29acbf) || 0x0));
    if (!_0x4d3432 || !_0xd9e7c5 || !_0x150d92) {
      return {
        'w': _0x4d3432,
        'h': _0xd9e7c5
      };
    }
    const _0x40a0f2 = Math['max'](_0x4d3432, _0xd9e7c5);
    const _0x537391 = _0x150d92 / _0x40a0f2;
    const _0x3802ce = Math["max"](0x1, Math["round"](_0x4d3432 * _0x537391));
    const _0x5937d2 = Math["max"](0x1, Math["round"](_0xd9e7c5 * _0x537391));
    return {
      'w': _0x3802ce,
      'h': _0x5937d2
    };
  },
  '_updateHelperRight'() {
    if (!this["helperRightEl"] || !this["active"]) {
      return;
    }
    const {
      fps: _0x5bfa0c,
      res: _0x2b7d2a,
      frameIndex: _0x48e4b8
    } = this['_getKeyingMeta']();
    const _0x9cd575 = videoKeyingText('helper.meta', {
      'fps': _0x5bfa0c,
      'resolution': _0x2b7d2a,
      'frameIndex': _0x48e4b8
    });
    if (this["_lastHelperRightText"] === _0x9cd575) {
      return;
    }
    this['_lastHelperRightText'] = _0x9cd575;
    this["helperRightEl"]["textContent"] = _0x9cd575;
  },
  '_resolveSourceVideoValue'(_0xc1a46b = a1609_0x11cf93["getState"]()["nodes"]?.[this["nodeId"]] || {}) {
    return _0xc1a46b["src"] || _0xc1a46b["videoUrl"] || _0xc1a46b['localPath'] || _0xc1a46b['resultLocalPath'] || '';
  },
  '_normalizeRhMaskMode'(_0x55e9b2) {
    const _0x150e5e = String(_0x55e9b2 || '')["trim"]();
    if (!_0x150e5e || _0x150e5e === '0') {
      return "Sec";
    }
    if (_0x150e5e === '1') {
      return "Sam3";
    }
    if (_0x150e5e === '2') {
      return 'MA2';
    }
    const _0x24255b = _0x150e5e["toLowerCase"]();
    if (_0x24255b === "sam3") {
      return "Sam3";
    }
    if (_0x24255b === "ma2" || _0x24255b === "matanyone2") {
      return 'MA2';
    }
    return 'Sec';
  },
  '_getRhVideoSettings'(_0x197438 = a1609_0x11cf93["getState"]()["nodes"]?.[this["nodeId"]] || {}) {
    const _0x5700b7 = normalizeRhKeyingFps(resolveSourceVideoKeyingSetting(_0x197438, "rhVideoFps", RH_DEFAULT_KEYING_FPS));
    const _0x3203db = normalizeRhKeyingResolution(resolveSourceVideoKeyingSetting(_0x197438, "rhVideoResolution", RH_DEFAULT_KEYING_RESOLUTION));
    const _0x1e25d9 = normalizeRhInstanceType(resolveSourceVideoKeyingSetting(_0x197438, "rhInstanceType", RH_DEFAULT_INSTANCE_TYPE));
    return {
      'fps': _0x5700b7,
      'resolution': _0x3203db,
      'instanceType': _0x1e25d9
    };
  },
  '_getRhMaskMode'(_0x7d87f7 = a1609_0x11cf93['getState']()["nodes"]?.[this['nodeId']] || {}) {
    return this['_normalizeRhMaskMode'](resolveSourceVideoKeyingSetting(_0x7d87f7, "rhMaskMode", RH_DEFAULT_KEYING_MASK_MODE));
  },
  '_getSourceFrameCount'(_0x5a1c4a, _0x1c0cfe) {
    const _0x2af1bf = Number["isFinite"](Number(_0x1c0cfe)) && Number(_0x1c0cfe) > 0x0 ? Number(_0x1c0cfe) : 0x18;
    const _0x259787 = Number(_0x5a1c4a?.["videoFrameCount"]);
    const _0x38adf9 = Number(_0x5a1c4a?.["videoFps"]);
    const _0x4cf9f5 = [Number(_0x5a1c4a?.["videoDuration"]), Number(this["durationSec"]), Number(this['videoEl']?.["duration"])];
    let _0x2fdbc9 = _0x4cf9f5["find"](_0x279ccf => Number['isFinite'](_0x279ccf) && _0x279ccf > 0x0);
    !Number['isFinite'](_0x2fdbc9) && Number["isFinite"](_0x259787) && _0x259787 > 0x0 && Number["isFinite"](_0x38adf9) && _0x38adf9 > 0x0 && (_0x2fdbc9 = _0x259787 / _0x38adf9);
    if (Number["isFinite"](_0x2fdbc9)) {
      return Math['max'](0x1, Math["round"](_0x2fdbc9 * _0x2af1bf));
    }
    if (Number["isFinite"](_0x259787) && _0x259787 > 0x0) {
      return Math["max"](0x1, Math["trunc"](_0x259787));
    }
    return Math["max"](0x1, Math['trunc'](Number(_0x5a1c4a?.['rhVideoFrames']) || _0x2af1bf || 0x18));
  },
  '_getRemoveMaskExportSize'(_0x344800) {
    const _0x1d0199 = this['videoEl'] || this["_getVideoEl"]();
    const _0x16c12f = Math["max"](0x1, Number(_0x1d0199?.["videoWidth"]) || Number(_0x1d0199?.['offsetWidth']) || Number(_0x344800) || 0x400);
    const _0x52f604 = Math["max"](0x1, Number(_0x1d0199?.['videoHeight']) || Number(_0x1d0199?.['offsetHeight']) || Number(_0x344800) || 0x400);
    const {
      w: _0x3d8d44,
      h: _0x31d064
    } = this["_calcKeyingFrameSize"](_0x16c12f, _0x52f604, _0x344800);
    return {
      'videoEl': _0x1d0199,
      'sourceW': _0x16c12f,
      'sourceH': _0x52f604,
      'width': Math["max"](0x1, _0x3d8d44 || 0x1),
      'height': Math["max"](0x1, _0x31d064 || 0x1)
    };
  },
  '_exportRemoveMaskDataUrl'(_0x1705fd) {
    this["_renderMarksFn"]?.();
    const {
      videoEl: _0xf7988c,
      width: _0x2f2f92,
      height: _0x1fe312
    } = this["_getRemoveMaskExportSize"](_0x1705fd);
    if (!_0x2f2f92 || !_0x1fe312) {
      throw new Error(videoKeyingText("errors.maskSizeInvalid"));
    }
    const _0x5d4e79 = (Array['isArray'](this["_marks"]) ? this["_marks"] : [])["filter"](_0x14a5ad => _0x14a5ad && (_0x14a5ad["type"] === "brush" || _0x14a5ad["type"] === 'eraser'));
    const _0x394f9c = _0x5d4e79["some"](_0x5b06bd => _0x5b06bd["type"] === 'brush');
    if (!_0x394f9c) {
      throw new Error(videoKeyingText("errors.noBrush"));
    }
    const _0x381759 = document["createElement"]('canvas');
    _0x381759['width'] = _0x2f2f92;
    _0x381759["height"] = _0x1fe312;
    const _0x62727c = _0x381759["getContext"]('2d');
    if (!_0x62727c) {
      throw new Error(videoKeyingText("errors.maskCanvasUnavailable"));
    }
    const _0xb40755 = getEraseCanvasPalette();
    _0x62727c['fillStyle'] = _0xb40755["eraseDark"];
    _0x62727c['fillRect'](0x0, 0x0, _0x2f2f92, _0x1fe312);
    const _0xb09627 = this['removeMaskCanvasEl'];
    const _0x23036f = this['_measureProjection']({
      'videoEl': _0xf7988c,
      'layerEl': this['markLayerEl']
    });
    const _0x508dd1 = _0x23036f?.['getVideoRectInLayer']();
    if (_0xb09627 && _0x508dd1 && _0xb09627['width'] > 0x0 && _0xb09627["height"] > 0x0) {
      const _0x4fd591 = Math["max"](0x0, Math["min"](_0xb09627["width"] - 0x1, _0x508dd1['x']));
      const _0x55dbcc = Math["max"](0x0, Math["min"](_0xb09627["height"] - 0x1, _0x508dd1['y']));
      const _0x6c1ec4 = Math['max'](0x1, Math["min"](_0xb09627['width'] - _0x4fd591, _0x508dd1["width"]));
      const _0x2a56ec = Math['max'](0x1, Math["min"](_0xb09627["height"] - _0x55dbcc, _0x508dd1['height']));
      _0x62727c['drawImage'](_0xb09627, _0x4fd591, _0x55dbcc, _0x6c1ec4, _0x2a56ec, 0x0, 0x0, _0x2f2f92, _0x1fe312);
      return _0x381759['toDataURL']('image/png');
    }
    _0x5d4e79["forEach"](_0x5c5955 => {
      const _0x5148ef = Array['isArray'](_0x5c5955["points"]) ? _0x5c5955['points'] : [];
      if (!_0x5148ef["length"]) {
        return;
      }
      const _0x124cd6 = _0x5c5955["type"] === "eraser" ? 'eraser' : "brush";
      const _0x12e79e = _0x124cd6 === "eraser" ? _0xb40755["eraseDark"] : _0xb40755["brushLight"];
      const _0x25c612 = getBrushLineWidth(this["_clampRemoveBrushSize"](_0x5c5955["brushSizePx"]) * (_0x2f2f92 / Math['max'](0x1, Number(_0xf7988c?.['offsetWidth']) || _0x2f2f92)), 0x1, _0x124cd6);
      const _0x407642 = _0x5148ef["map"](_0x707902 => ({
        'x': Math["max"](0x0, Math['min'](0x1, Number(_0x707902?.['nx']) || 0x0)) * (_0x2f2f92 - 0x1),
        'y': Math['max'](0x0, Math["min"](0x1, Number(_0x707902?.['ny']) || 0x0)) * (_0x1fe312 - 0x1)
      }));
      _0x62727c["save"]();
      drawRoundBrushStroke(_0x62727c, {
        'points': _0x407642,
        'lineWidth': _0x25c612,
        'strokeStyle': _0x12e79e,
        'fillStyle': _0x12e79e
      });
      _0x62727c["restore"]();
    });
    return _0x381759["toDataURL"]('image/png');
  },
  '_updateConfirmEnabled'() {
    if (!this["confirmBtnEl"] || !this["active"]) {
      return;
    }
    const _0x2446ba = this["nodeId"];
    const _0x59c9b3 = _0x2446ba ? getRunningVideoKeyingTaskForNode(_0x2446ba) : null;
    if (_0x59c9b3) {
      if (this["confirmBtnEl"]['disabled']) {
        this["confirmBtnEl"]["disabled"] = ![];
      }
      return;
    }
    const {
      pos_points: _0x24d52d,
      neg_points: _0x598f04
    } = this["getPosNegPoints"]();
    const _0x47f9c0 = Array["isArray"](_0x24d52d) ? _0x24d52d['length'] : 0x0;
    const _0x481c6e = Array["isArray"](_0x598f04) ? _0x598f04['length'] : 0x0;
    const _0x164d0c = this["_isRemoveUiMode"]() ? _0x47f9c0 > 0x0 : _0x47f9c0 > 0x0 && _0x481c6e < _0x47f9c0;
    if (this['_lastConfirmEnabled'] === _0x164d0c) {
      return;
    }
    this["_lastConfirmEnabled"] = _0x164d0c;
    this["confirmBtnEl"]["disabled"] = !_0x164d0c;
  },
  '_cancelRhTaskForSourceNode'(_0x6a9318, _0x2ec2ef = {}) {
    return cancelVideoKeyingTaskForNode(_0x6a9318, _0x2ec2ef);
  },
  'getPosNegPoints'() {
    if (this["_isRemoveUiMode"]()) {
      const _0xd32840 = this["_collectRemovePosPoints"](REMOVE_POS_POINT_LIMIT);
      return {
        'pos_points': _0xd32840,
        'neg_points': []
      };
    }
    const _0x28f610 = Array["isArray"](this['_marks']) ? this['_marks'] : [];
    const _0x249114 = [];
    const _0x4674b2 = [];
    for (const _0x1a57df of _0x28f610) {
      if (!_0x1a57df) {
        continue;
      }
      const _0x15b549 = Number(_0x1a57df['nx']);
      const _0x424fc7 = Number(_0x1a57df['ny']);
      if (!Number["isFinite"](_0x15b549) || !Number["isFinite"](_0x424fc7)) {
        continue;
      }
      const _0x21290b = {
        'x': _0x15b549,
        'y': _0x424fc7
      };
      if (_0x1a57df["pointType"] === "background") {
        _0x4674b2['push'](_0x21290b);
      } else {
        _0x249114["push"](_0x21290b);
      }
    }
    return {
      'pos_points': _0x249114,
      'neg_points': _0x4674b2
    };
  },
  '_syncPointsToStore'() {
    const {
      pos_points: _0x294c80,
      neg_points: _0x505856
    } = this["getPosNegPoints"]();
    a1609_0x11cf93["setVideoKeyingState"]({
      'pos_points': _0x294c80,
      'neg_points': _0x505856
    });
    this["_updateConfirmEnabled"]();
  },
  '_undoMark'() {
    const _0x5a0afd = Array["isArray"](this["_marks"]) ? this["_marks"] : [];
    if (!_0x5a0afd["length"]) {
      return;
    }
    const _0x36a4ec = Array["isArray"](this["_marksRedo"]) ? this["_marksRedo"] : [];
    const _0x35ea00 = _0x5a0afd["pop"]();
    _0x36a4ec["push"](_0x35ea00);
    this["_marks"] = _0x5a0afd;
    this["_marksRedo"] = _0x36a4ec;
    this['_renderMarksFn']?.();
    this["_syncPointsToStore"]();
  },
  '_redoMark'() {
    const _0x246435 = Array["isArray"](this['_marksRedo']) ? this["_marksRedo"] : [];
    if (!_0x246435["length"]) {
      return;
    }
    const _0xda5794 = Array["isArray"](this["_marks"]) ? this["_marks"] : [];
    const _0x11c6be = _0x246435["pop"]();
    _0xda5794['push'](_0x11c6be);
    this["_marks"] = _0xda5794;
    this["_marksRedo"] = _0x246435;
    this["_renderMarksFn"]?.();
    this["_syncPointsToStore"]();
  },
  '_clearAllMarks'() {
    this["_marks"] = [];
    this['_marksRedo'] = [];
    this["_removeDraft"] = null;
    this["_removeDrawPointerId"] = null;
    this["_renderMarksFn"]?.();
    a1609_0x11cf93["setVideoKeyingState"]({
      'pos_points': [],
      'neg_points': []
    });
    this["_updateConfirmEnabled"]();
  },
  'init'(_0x3b2f32, _0x8e71c0 = {}) {
    if (!_0x3b2f32) {
      return;
    }
    if (this["active"]) {
      this['exit']({
        'silent': !![]
      });
    }
    const _0x578c1b = a1609_0x11cf93['getState']()['nodes'][_0x3b2f32];
    if (!_0x578c1b) {
      return;
    }
    this["uiMode"] = _0x8e71c0?.["uiMode"] === 'remove' ? 'remove' : "keying";
    this["_removePointTool"] = "foreground";
    this["_removeBrushSizePx"] = 0x28;
    this["_removeDraft"] = null;
    this["_removeDrawPointerId"] = null;
    this["_removeCursorHover"] = ![];
    this["_removeCursorLast"] = {
      'x': 0x0,
      'y': 0x0
    };
    if (this["_removeCursorRaf"]) {
      cancelAnimationFrame(this["_removeCursorRaf"]);
    }
    this["_removeCursorRaf"] = 0x0;
    this["active"] = !![];
    this["nodeId"] = _0x3b2f32;
    this["_marks"] = [];
    this["_marksRedo"] = [];
    a1609_0x11cf93["setVideoKeyingState"]({
      'active': !![],
      'nodeId': _0x3b2f32,
      'pos_points': [],
      'neg_points': []
    });
    this["_unsubscribeLocale"] = onLocaleChange(() => this["_syncLocaleTexts"]());
    this["_retryCount"] = 0x0;
    this["_mountWhenReady"]();
  },
  '_mountWhenReady'() {
    const _0x1e0896 = this["nodeId"];
    const _0x1ac722 = () => {
      if (!this["active"] || this["nodeId"] !== _0x1e0896) {
        return;
      }
      const _0x3381c5 = document['getElementById'](_0x1e0896);
      if (!_0x3381c5) {
        this["_retryCount"]++;
        if (this["_retryCount"] > 0xa) {
          this["exit"]({
            'silent': !![]
          });
          return;
        }
        this["_retryRaf"] = requestAnimationFrame(_0x1ac722);
        return;
      }
      this["wrapperEl"] = _0x3381c5;
      this["_applyFrozenUI"](!![]);
      this["_applyDimMode"](!![]);
      releaseCanvasPanShortcut();
      this["_createUI"]();
      this['_syncDurationAndDefaults']();
      this["_bindEvents"]();
      this["_renderPlayhead"]();
    };
    this['_retryRaf'] = requestAnimationFrame(_0x1ac722);
  },
  '_applyDimMode'(_0x407fe0) {
    const _0x12c668 = document['getElementById']("v2-wrap");
    if (_0x12c668) {
      if (_0x407fe0) {
        _0x12c668["classList"]["add"]('is-video-keying-mode');
      } else {
        _0x12c668["classList"]["remove"]('is-video-keying-mode');
      }
    }
    if (this["wrapperEl"]) {
      if (_0x407fe0) {
        this["wrapperEl"]["classList"]["add"]("is-video-keying-target");
      } else {
        this['wrapperEl']["classList"]["remove"]("is-video-keying-target");
      }
    }
  },
  '_applyFrozenUI'(_0x44d6fe) {
    if (!this["wrapperEl"]) {
      return;
    }
    const _0x2a53e7 = "is-video-keying";
    if (_0x44d6fe) {
      this["wrapperEl"]['classList']['add'](_0x2a53e7);
    } else {
      this['wrapperEl']["classList"]["remove"](_0x2a53e7);
    }
    this["_applyFrozenOverlaysHidden"](_0x44d6fe);
  },
  '_applyFrozenOverlaysHidden'(_0x2f7b81) {
    if (!this["wrapperEl"]) {
      return;
    }
    if (_0x2f7b81) {
      if (Array['isArray'](this["_hiddenEls"]) && this["_hiddenEls"]["length"]) {
        return;
      }
      const _0x28178d = [".video-controls", ".video-mute-btn", ".node-upload-hint", ".video-center-indicator", ".gen-video-center-indicator", ".multi-toggle-btn"];
      const _0x42ad73 = [];
      _0x28178d['forEach'](_0x116a0f => {
        this["wrapperEl"]["querySelectorAll"](_0x116a0f)["forEach"](_0x4811d0 => {
          _0x42ad73["push"]({
            'el': _0x4811d0,
            'prevDisplay': _0x4811d0["style"]["display"]
          });
          _0x4811d0["style"]["display"] = "none";
        });
      });
      this["_hiddenEls"] = _0x42ad73;
      return;
    }
    const _0x33cfe3 = Array["isArray"](this["_hiddenEls"]) ? this['_hiddenEls'] : [];
    this["_hiddenEls"] = null;
    _0x33cfe3['forEach'](({
      el: _0x20b541,
      prevDisplay: _0x5a9502
    }) => {
      if (!_0x20b541 || !_0x20b541["isConnected"]) {
        return;
      }
      _0x20b541["style"]["display"] = _0x5a9502 || '';
    });
  },
  '_pauseAllWrapperVideos'() {
    this['wrapperEl'] && this['wrapperEl']["querySelectorAll"]("video")["forEach"](_0x27176a => {
      try {
        if (!_0x27176a['paused']) {
          _0x27176a['pause']();
        }
      } catch {}
    });
    if (this["videoEl"]) {
      try {
        if (!this['videoEl']["paused"]) {
          this["videoEl"]["pause"]();
        }
      } catch {}
    }
  },
  '_createRemoveToolbar'() {
    const _0x330e3e = document['createElement']("div");
    _0x330e3e["className"] = "v2-video-keying-erasebar v2-annotate-toolbar";
    const _0x17ad30 = this["_buildShortcutTooltip"](videoKeyingText('tools.brush'), "editor-tool-brush", 'B');
    const _0x39a602 = this["_buildShortcutTooltip"](videoKeyingText('tools.eraser'), "editor-tool-eraser", 'E');
    const _0x5daf9c = this["_buildShortcutTooltip"](videoKeyingText('tools.undo'), "undo", "Ctrl+Z");
    const _0x20935c = this['_buildShortcutTooltip'](videoKeyingText('tools.redo'), "redo", "Ctrl+Shift+Z");
    const _0x4c52c3 = this["_buildShortcutTooltip"](videoKeyingText("tools.clear"), 'editor-clear', 'R');
    _0x330e3e["innerHTML"] = "\n      <button class=\"v2-annotate-btn icon-only act-cancel\" data-tooltip=\"" + videoKeyingText("tools.cancel") + "\" type=\"button\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"18\" height=\"18\"><path d=\"M18 6L6 18M6 6l12 12\"/></svg></button>\n      <div class=\"v2-annotate-divider\"></div>\n      <button class=\"v2-annotate-btn icon-only tool-btn active\" data-tool=\"brush\" data-tooltip=\"" + _0x17ad30 + "\" type=\"button\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"18\" height=\"18\"><path d=\"M12 20h9\"/><path d=\"M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z\"/></svg></button>\n      <button class=\"v2-annotate-btn icon-only tool-btn\" data-tool=\"eraser\" data-tooltip=\"" + _0x39a602 + "\" type=\"button\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"18\" height=\"18\"><path d=\"M20 20H7l-5-5a2 2 0 0 1 0-2.83l9.17-9.17a2 2 0 0 1 2.83 0L22 10a2 2 0 0 1 0 2.83L14.83 20\"/></svg></button>\n      <div class=\"v2-annotate-size\"><span class=\"v2-annotate-size-value\"></span><input class=\"v2-annotate-size-range\" type=\"range\" min=\"1\" max=\"120\" step=\"1\"></div>\n      <div class=\"v2-annotate-divider\"></div>\n      <button class=\"v2-annotate-btn icon-only act-undo\" data-tooltip=\"" + _0x5daf9c + "\" type=\"button\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"18\" height=\"18\"><path d=\"M9 14l-4-4 4-4\"/><path d=\"M5 10h9a6 6 0 1 1 0 12h-3\"/></svg></button>\n      <button class=\"v2-annotate-btn icon-only act-redo\" data-tooltip=\"" + _0x20935c + "\" type=\"button\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"18\" height=\"18\"><path d=\"M15 14l4-4-4-4\"/><path d=\"M19 10H10a6 6 0 1 0 0 12h3\"/></svg></button>\n      <button class=\"v2-annotate-btn icon-only act-clear\" data-tooltip=\"" + _0x4c52c3 + "\" type=\"button\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"18\" height=\"18\"><path d=\"M3 6h18\"/><path d=\"M8 6V4h8v2\"/><path d=\"M6 6l1 16h10l1-16\"/></svg></button>\n    ";
    this['removeSizeValueEl'] = _0x330e3e["querySelector"](".v2-annotate-size-value");
    this["removeSizeRangeEl"] = _0x330e3e['querySelector']('.v2-annotate-size-range');
    this["removeSizeRangeEl"] && this["removeSizeValueEl"] && (this["_syncRemoveBrushControls"](), this["removeSizeRangeEl"]["addEventListener"]("input", _0x37cd0a => {
      const _0x2502c4 = this['_clampRemoveBrushSize'](_0x37cd0a["target"]['value']);
      this["_removeBrushSizePx"] = _0x2502c4;
      this['_syncRemoveBrushControls']();
      this["_syncRemoveCursor"]();
    }));
    _0x330e3e['addEventListener']("pointerdown", _0x1d3b29 => _0x1d3b29["stopPropagation"]());
    _0x330e3e["querySelector"]('.act-cancel')?.["addEventListener"]('click', _0x14577d => {
      _0x14577d["stopPropagation"]();
      this["exit"]();
    });
    _0x330e3e["querySelector"]("[data-tool=\"brush\"]")?.["addEventListener"]('click', _0x30861d => {
      _0x30861d["stopPropagation"]();
      this['_setRemovePointTool']('foreground');
    });
    _0x330e3e["querySelector"]("[data-tool=\"eraser\"]")?.["addEventListener"]("click", _0x2f0766 => {
      _0x2f0766["stopPropagation"]();
      this['_setRemovePointTool']("background");
    });
    _0x330e3e["querySelector"](".act-undo")?.["addEventListener"]("click", _0x14e36a => {
      _0x14e36a["stopPropagation"]();
      this["_undoMark"]();
    });
    _0x330e3e["querySelector"](".act-redo")?.['addEventListener']("click", _0x48156f => {
      _0x48156f["stopPropagation"]();
      this['_redoMark']();
    });
    _0x330e3e["querySelector"]('.act-clear')?.['addEventListener']('click', _0x268156 => {
      _0x268156["stopPropagation"]();
      this["_clearAllMarks"]();
      window['showToast']?.(videoKeyingText("toasts.clearedPoints"), "info");
    });
    return _0x330e3e;
  },
  '_createUI'() {
    if (!this['wrapperEl']) {
      return;
    }
    this["wrapperEl"]["querySelectorAll"](".v2-video-keyingbar,.v2-video-keyinghint,.v2-video-keying-erasebar")["forEach"](_0x16eef6 => _0x16eef6["remove"]());
    const _0x171f37 = document["createElement"]('div');
    _0x171f37["className"] = "v2-video-keyingbar";
    const _0x9107de = document["createElement"]('button');
    _0x9107de["type"] = "button";
    _0x9107de["className"] = "v2-video-clipbtn cancel";
    _0x9107de["title"] = videoKeyingText('tools.cancel');
    {
      const _0x507472 = "http://www.w3.org/2000/svg";
      const _0x5aab58 = document["createElementNS"](_0x507472, 'svg');
      _0x5aab58["setAttribute"]("width", '20');
      _0x5aab58["setAttribute"]("height", '20');
      _0x5aab58["setAttribute"]("viewBox", '0\x200\x2024\x2024');
      _0x5aab58["setAttribute"]("fill", 'none');
      _0x5aab58["setAttribute"]("stroke", "currentColor");
      _0x5aab58["setAttribute"]("stroke-width", '2');
      const _0x2202b6 = document["createElementNS"](_0x507472, 'path');
      _0x2202b6["setAttribute"]('d', 'M18\x206L6\x2018');
      const _0xe506ff = document['createElementNS'](_0x507472, "path");
      _0xe506ff["setAttribute"]('d', "M6 6l12 12");
      _0x5aab58["appendChild"](_0x2202b6);
      _0x5aab58["appendChild"](_0xe506ff);
      _0x9107de["appendChild"](_0x5aab58);
    }
    const _0x36c3cf = document["createElement"]("button");
    _0x36c3cf["type"] = 'button';
    _0x36c3cf["className"] = "prompt-submit img-gen-btn";
    _0x36c3cf["title"] = this["_isRemoveUiMode"]() ? videoKeyingText("tools.remove") : videoKeyingText("tools.keying");
    {
      const _0x47d01a = "http://www.w3.org/2000/svg";
      const _0x57f6d0 = document["createElementNS"](_0x47d01a, 'svg');
      _0x57f6d0["setAttribute"]('width', '14');
      _0x57f6d0["setAttribute"]('height', '14');
      _0x57f6d0["setAttribute"]("viewBox", "0 0 24 24");
      _0x57f6d0['setAttribute']('fill', "none");
      _0x57f6d0["setAttribute"]("stroke", "currentColor");
      _0x57f6d0["setAttribute"]("stroke-width", '2');
      const _0x14c6f3 = document['createElementNS'](_0x47d01a, "line");
      _0x14c6f3["setAttribute"]('x1', '12');
      _0x14c6f3["setAttribute"]('y1', '19');
      _0x14c6f3["setAttribute"]('x2', '12');
      _0x14c6f3["setAttribute"]('y2', '5');
      const _0x120ab2 = document["createElementNS"](_0x47d01a, "polyline");
      _0x120ab2["setAttribute"]("points", "5 12 12 5 19 12");
      _0x57f6d0["appendChild"](_0x14c6f3);
      _0x57f6d0["appendChild"](_0x120ab2);
      _0x36c3cf["appendChild"](_0x57f6d0);
    }
    const _0x41673a = a1609_0x11cf93["getState"]()["nodes"]?.[this["nodeId"]] || {};
    const {
      fps: _0x58b389,
      resolution: _0x19cf3b,
      instanceType: _0x36f938
    } = this['_getRhVideoSettings'](_0x41673a);
    const _0x55c467 = this['_getRhMaskMode'](_0x41673a);
    const _0x9b4f82 = {};
    !hasUsableKeyingSettingValue(_0x41673a['rhVideoFps']) && (_0x9b4f82["rhVideoFps"] = _0x58b389);
    !hasUsableKeyingSettingValue(_0x41673a['rhVideoResolution']) && (_0x9b4f82["rhVideoResolution"] = _0x19cf3b);
    !hasUsableKeyingSettingValue(_0x41673a["rhMaskMode"]) && (_0x9b4f82['rhMaskMode'] = _0x55c467);
    !hasUsableKeyingSettingValue(_0x41673a['rhInstanceType']) && (_0x9b4f82["rhInstanceType"] = _0x36f938);
    if (Object["keys"](_0x9b4f82)['length']) {
      try {
        a1609_0x11cf93["updateNodeData"](this['nodeId'], _0x9b4f82);
      } catch {}
    }
    let _0x14701c = document["createElement"]("div");
    _0x14701c["className"] = "rh-keying-settings-wrap";
    const _0x4ab54b = document["createElement"]("button");
    _0x4ab54b['type'] = 'button';
    _0x4ab54b["className"] = "v2-video-clipbtn cancel rh-keying-settings-btn";
    _0x4ab54b["title"] = videoKeyingText("tools.settings");
    {
      const _0x1ae140 = "http://www.w3.org/2000/svg";
      const _0x6417e = document['createElementNS'](_0x1ae140, 'svg');
      _0x6417e["setAttribute"]("width", '20');
      _0x6417e["setAttribute"]("height", '20');
      _0x6417e['setAttribute']("viewBox", '0\x200\x2024\x2024');
      _0x6417e["setAttribute"]("fill", "none");
      _0x6417e["setAttribute"]("stroke", "currentColor");
      _0x6417e["setAttribute"]("stroke-width", '2');
      const _0x2022e4 = document['createElementNS'](_0x1ae140, "path");
      _0x2022e4["setAttribute"]('d', "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z");
      const _0x237b15 = document["createElementNS"](_0x1ae140, "path");
      _0x237b15["setAttribute"]('d', "M19.4 15a1.7 1.7 0 0 0 .33 1.87l.06.06a2 2 0 0 1-1.42 3.42h-.2a2 2 0 0 1-1.41-.59l-.06-.06a1.7 1.7 0 0 0-1.87-.33 1.7 1.7 0 0 0-1.03 1.54V21a2 2 0 0 1-4 0v-.09a1.7 1.7 0 0 0-1.03-1.54 1.7 1.7 0 0 0-1.87.33l-.06.06a2 2 0 0 1-1.41.59h-.2a2 2 0 0 1-1.42-3.42l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.54-1.03H3a2 2 0 0 1 0-4h.06A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.33-1.87l-.06-.06A2 2 0 0 1 5.63 3.65h.2a2 2 0 0 1 1.41.59l.06.06A1.7 1.7 0 0 0 9.17 4.6a1.7 1.7 0 0 0 1.03-1.54V3a2 2 0 0 1 4 0v.06a1.7 1.7 0 0 0 1.03 1.54 1.7 1.7 0 0 0 1.87-.33l.06-.06a2 2 0 0 1 1.41-.59h.2A2 2 0 0 1 20.79 7.07l-.06.06A1.7 1.7 0 0 0 20.4 9c.32.55.86.92 1.54 1.03H22a2 2 0 0 1 0 4h-.06A1.7 1.7 0 0 0 19.4 15z");
      _0x6417e["appendChild"](_0x237b15);
      _0x6417e['appendChild'](_0x2022e4);
      _0x4ab54b['appendChild'](_0x6417e);
    }
    const _0x4058aa = document["createElement"]("div");
    _0x4058aa['className'] = "rh-keying-settings-menu";
    _0x4058aa["setAttribute"]("role", "menu");
    {
      const _0x2cc961 = document["createElement"]("div");
      _0x2cc961["className"] = "rh-keying-settings-head";
      const _0x239eb8 = document["createElement"]('span');
      _0x239eb8["className"] = "rh-keying-settings-title";
      _0x239eb8["textContent"] = videoKeyingText("settings.title");
      _0x2cc961["appendChild"](_0x239eb8);
      _0x4058aa["appendChild"](_0x2cc961);
    }
    {
      const _0x39115f = document['createElement']("div");
      _0x39115f["className"] = "img-rp-quality-area";
      const _0x371a5c = document["createElement"]("div");
      _0x371a5c["className"] = 'img-rp-section-label';
      const _0x32b344 = document["createElement"]("span");
      _0x32b344["className"] = "rh-keying-label-resolution";
      _0x32b344["textContent"] = videoKeyingText("settings.resolution");
      const _0x59685d = document["createElement"]("span");
      _0x59685d["className"] = "rh-tip rh-keying-tip-resolution";
      _0x59685d["setAttribute"]('data-tooltip', videoKeyingText("settings.resolutionTip"));
      _0x59685d["textContent"] = '!';
      _0x371a5c["appendChild"](_0x32b344);
      _0x371a5c['appendChild'](_0x59685d);
      const _0x3e8164 = document['createElement']('div');
      _0x3e8164['className'] = "img-rp-quality-segmented";
      [0x340, 0x400, 0x500, 0x5a0, 0x640, 0x6e0, 0x780]["forEach"](_0x51ead5 => {
        const _0x231bb5 = document['createElement']("button");
        _0x231bb5["type"] = "button";
        const _0x563e97 = Number(_0x51ead5) > 0x5a0;
        _0x231bb5['className'] = ("img-rp-quality-item " + (_0x563e97 ? "dev-mode-only" : '') + '\x20rh-keying-res-btn\x20' + (Number(_0x19cf3b) === Number(_0x51ead5) ? "active" : ''))["trim"]();
        _0x231bb5["dataset"]["value"] = String(_0x51ead5);
        _0x231bb5["textContent"] = String(_0x51ead5);
        _0x3e8164["appendChild"](_0x231bb5);
      });
      _0x39115f['appendChild'](_0x371a5c);
      _0x39115f["appendChild"](_0x3e8164);
      _0x4058aa["appendChild"](_0x39115f);
    }
    {
      const _0x337159 = document['createElement']("div");
      _0x337159['className'] = "rh-vram-adv-row";
      const _0x17f773 = document["createElement"]('div');
      _0x17f773["className"] = "rh-vram-adv-label";
      const _0x26e2df = document['createElement']("span");
      _0x26e2df["className"] = "rh-keying-label-fps";
      _0x26e2df["textContent"] = videoKeyingText("settings.fps");
      const _0x480659 = document['createElement']("span");
      _0x480659['className'] = "rh-tip rh-keying-tip-fps";
      _0x480659["setAttribute"]("data-tooltip", videoKeyingText('settings.fpsTip'));
      _0x480659["textContent"] = '!';
      _0x17f773['appendChild'](_0x26e2df);
      _0x17f773['appendChild'](_0x480659);
      const _0x22b5e2 = document["createElement"]('div');
      _0x22b5e2["className"] = "img-rp-quality-segmented rh-adv-seg rh-v5-fps-seg";
      getRhKeyingFpsOptions()['forEach'](_0x3d7f03 => {
        const _0x48f9fe = document["createElement"]("button");
        _0x48f9fe["type"] = "button";
        _0x48f9fe['className'] = ('img-rp-quality-item\x20rh-keying-fps-btn\x20' + (Number(_0x58b389) === Number(_0x3d7f03) ? "active" : ''))['trim']();
        _0x48f9fe["dataset"]["value"] = String(_0x3d7f03);
        _0x48f9fe['textContent'] = videoKeyingText("settings.fpsValue", {
          'fps': _0x3d7f03
        });
        _0x22b5e2["appendChild"](_0x48f9fe);
      });
      _0x337159["appendChild"](_0x17f773);
      _0x337159['appendChild'](_0x22b5e2);
      _0x4058aa["appendChild"](_0x337159);
    }
    if (!this["_isRemoveUiMode"]()) {
      const _0x1ce6d4 = document['createElement']('div');
      _0x1ce6d4["className"] = "rh-vram-adv-row";
      const _0x14f4c6 = document["createElement"]("div");
      _0x14f4c6["className"] = "rh-vram-adv-label";
      const _0x17d8e6 = document["createElement"]('span');
      _0x17d8e6['className'] = "rh-keying-label-mask-mode";
      _0x17d8e6["textContent"] = videoKeyingText("settings.maskMode");
      const _0x386227 = document['createElement']("span");
      _0x386227['className'] = "rh-tip rh-keying-tip-mask-mode";
      _0x386227['setAttribute']('data-tooltip', videoKeyingText("settings.maskModeTip"));
      _0x386227['textContent'] = '!';
      _0x14f4c6["appendChild"](_0x17d8e6);
      _0x14f4c6['appendChild'](_0x386227);
      const _0x157ca0 = document['createElement']("div");
      _0x157ca0["className"] = 'img-rp-quality-segmented\x20rh-adv-seg\x20rh-keying-maskmode-seg';
      [["Sec", "Sec"], ["Sam3", "Sam3"], ["MA2", "MA2"]]["forEach"](([_0x558ed3, _0x374226]) => {
        const _0x1f00cd = document['createElement']("button");
        _0x1f00cd["type"] = "button";
        _0x1f00cd["className"] = ("img-rp-quality-item rh-keying-maskmode-btn " + (_0x55c467 === _0x558ed3 ? "active" : ''))['trim']();
        _0x1f00cd['dataset']["value"] = _0x558ed3;
        _0x1f00cd["textContent"] = _0x374226;
        _0x157ca0['appendChild'](_0x1f00cd);
      });
      _0x1ce6d4["appendChild"](_0x14f4c6);
      _0x1ce6d4["appendChild"](_0x157ca0);
      _0x4058aa["appendChild"](_0x1ce6d4);
    }
    {
      const _0x33d960 = document['createElement']("div");
      _0x33d960["className"] = 'rh-vram-adv-row';
      const _0x468f0d = document["createElement"]("div");
      _0x468f0d["className"] = 'rh-vram-adv-label';
      const _0x1c4424 = document["createElement"]("span");
      _0x1c4424['className'] = 'rh-keying-label-vram';
      _0x1c4424["textContent"] = videoKeyingText("settings.vram");
      const _0x41684b = document["createElement"]('span');
      _0x41684b["className"] = "rh-tip rh-keying-tip-vram";
      _0x41684b['setAttribute']("data-tooltip", videoKeyingText("settings.vramTip"));
      _0x41684b["textContent"] = '!';
      _0x468f0d["appendChild"](_0x1c4424);
      _0x468f0d["appendChild"](_0x41684b);
      const _0x5ad705 = document["createElement"]('div');
      _0x5ad705["className"] = "img-rp-quality-segmented rh-adv-seg rh-keying-vram-seg";
      RUNNINGHUB_INSTANCE_OPTIONS['forEach'](({
        value: _0x3ad464,
        label: _0x378c0a
      }) => {
        const _0x4ad6e1 = document['createElement']('button');
        _0x4ad6e1["type"] = "button";
        _0x4ad6e1["className"] = ("img-rp-quality-item rh-keying-vram-btn " + (_0x36f938 === _0x3ad464 ? "active" : ''))["trim"]();
        _0x4ad6e1["dataset"]["value"] = _0x3ad464;
        _0x4ad6e1["textContent"] = _0x378c0a;
        _0x5ad705["appendChild"](_0x4ad6e1);
      });
      _0x33d960['appendChild'](_0x468f0d);
      _0x33d960['appendChild'](_0x5ad705);
      _0x4058aa["appendChild"](_0x33d960);
    }
    _0x14701c["appendChild"](_0x4ab54b);
    _0x14701c["appendChild"](_0x4058aa);
    const _0x2b19a1 = document["createElement"]('button');
    _0x2b19a1['type'] = "button";
    _0x2b19a1["className"] = "v2-video-clipbtn cancel debug-wrench-btn rh-keying-debug-btn";
    _0x2b19a1['title'] = videoKeyingText("settings.debugParams");
    applyDebugWrenchIcon(_0x2b19a1);
    const _0x3b9790 = document["createElement"]('div');
    _0x3b9790["className"] = 'v2-video-keyingrow';
    const _0x31323f = document["createElement"]("div");
    _0x31323f["className"] = "v2-video-keyingtrack";
    const _0x19887b = document["createElement"]("div");
    _0x19887b['className'] = "v2-video-keyingticks";
    const _0x4429a2 = document["createElement"]('div');
    _0x4429a2["className"] = "v2-video-keyingthumbs";
    const _0x52d62d = [];
    for (let _0x8b0ee6 = 0x0; _0x8b0ee6 < 0xa; _0x8b0ee6++) {
      const _0x46984e = document["createElement"]("div");
      _0x46984e["className"] = 'v2-video-keyingthumb';
      _0x4429a2["appendChild"](_0x46984e);
      _0x52d62d["push"](_0x46984e);
    }
    const _0xd33c6d = document['createElement']("div");
    _0xd33c6d["className"] = "v2-video-keyingplayhead";
    _0x31323f["appendChild"](_0x4429a2);
    _0x31323f["appendChild"](_0xd33c6d);
    _0x31323f["appendChild"](_0x19887b);
    const _0x261532 = this["_isRemoveUiMode"]();
    _0x3b9790["appendChild"](_0x9107de);
    _0x3b9790["appendChild"](_0x31323f);
    if (_0x14701c) {
      _0x3b9790["appendChild"](_0x14701c);
    }
    if (_0x2b19a1) {
      _0x3b9790['appendChild'](_0x2b19a1);
    }
    _0x3b9790["appendChild"](_0x36c3cf);
    const _0x41e40e = document["createElement"]("div");
    _0x41e40e["className"] = "v2-video-keyinghelper-row";
    const _0x3e9a77 = document['createElement']("div");
    _0x3e9a77['className'] = "v2-video-keyinghelper-right";
    _0x41e40e["appendChild"](_0x3e9a77);
    let _0x4ae5de = null;
    let _0x4c3ca4 = null;
    if (_0x261532) {
      _0x4c3ca4 = this['_createRemoveToolbar']();
    } else {
      _0x4ae5de = document["createElement"]('div');
      _0x4ae5de["className"] = "v2-video-keyinghint";
      const _0x2df68d = (_0x48f7aa, _0x5bd47f) => {
        const _0x380f02 = document['createElement']('span');
        if (_0x5bd47f) {
          _0x380f02["className"] = _0x5bd47f;
        }
        _0x380f02['textContent'] = _0x48f7aa;
        return _0x380f02;
      };
      _0x4ae5de["appendChild"](_0x2df68d(videoKeyingText("hint.leftClick")));
      _0x4ae5de['appendChild'](_0x2df68d(videoKeyingText('hint.selectTarget'), 'v2-video-keyinghint--pos'));
      _0x4ae5de["appendChild"](_0x2df68d('\x20\x20'));
      _0x4ae5de["appendChild"](_0x2df68d(videoKeyingText("hint.rightClick")));
      _0x4ae5de["appendChild"](_0x2df68d(videoKeyingText("hint.excludeTarget"), "v2-video-keyinghint--neg"));
      _0x4ae5de['appendChild'](_0x2df68d(videoKeyingText('hint.shortcutPrefix')));
      _0x4ae5de['appendChild'](_0x2df68d(this["_getShortcutText"]("editor-clear", 'R'), "v2-video-keyinghint-kbd"));
      _0x4ae5de['appendChild'](_0x2df68d(videoKeyingText('hint.clearAllPoints')));
      _0x4ae5de['appendChild'](_0x2df68d('\x20\x20'));
      _0x4ae5de["appendChild"](_0x2df68d(this['_getShortcutText']("undo", "Ctrl+Z"), 'v2-video-keyinghint-kbd'));
      _0x4ae5de["appendChild"](_0x2df68d(videoKeyingText("tools.undo")));
      _0x4ae5de["appendChild"](_0x2df68d('\x20\x20'));
      _0x4ae5de["appendChild"](_0x2df68d(this['_getShortcutText']('redo', "Ctrl+Shift+Z"), "v2-video-keyinghint-kbd"));
      _0x4ae5de['appendChild'](_0x2df68d(videoKeyingText('tools.redo')));
    }
    _0x171f37["appendChild"](_0x3b9790);
    _0x171f37["appendChild"](_0x41e40e);
    _0x4c3ca4 && this["wrapperEl"]["appendChild"](_0x4c3ca4);
    this["wrapperEl"]["appendChild"](_0x171f37);
    _0x4ae5de && this["wrapperEl"]["appendChild"](_0x4ae5de);
    this["barEl"] = _0x171f37;
    this["hintEl"] = _0x4ae5de;
    this["removeToolbarEl"] = _0x4c3ca4;
    this["_setRemovePointTool"](this["_removePointTool"]);
    this["cancelBtnEl"] = _0x9107de;
    this['confirmBtnEl'] = _0x36c3cf;
    this["trackEl"] = _0x31323f;
    this["playheadEl"] = _0xd33c6d;
    this["thumbEls"] = _0x52d62d;
    this["helperRightEl"] = _0x3e9a77;
    this["_syncLocaleTexts"]();
    this['_updateHelperRight']();
    this["_updateConfirmEnabled"]();
  },
  '_syncLocaleTexts'() {
    if (this["cancelBtnEl"]) {
      this["cancelBtnEl"]['title'] = videoKeyingText("tools.cancel");
    }
    this["confirmBtnEl"] && (this["confirmBtnEl"]["title"] = this["_isRemoveUiMode"]() ? videoKeyingText("tools.remove") : videoKeyingText("tools.keying"));
    this["barEl"]?.['querySelectorAll']('.rh-keying-settings-btn')["forEach"](_0x1715a8 => {
      _0x1715a8["title"] = videoKeyingText('tools.settings');
    });
    this["barEl"]?.["querySelectorAll"](".rh-keying-debug-btn")["forEach"](_0x234397 => {
      _0x234397["title"] = videoKeyingText("settings.debugParams");
    });
    const _0x2f1c7e = (_0x267868, _0x4a2b31) => {
      this['barEl']?.["querySelectorAll"](_0x267868)["forEach"](_0x4b1f16 => {
        _0x4b1f16['textContent'] = _0x4a2b31;
      });
    };
    const _0x46cec0 = (_0x3b3668, _0x49e7ab) => {
      this["barEl"]?.["querySelectorAll"](_0x3b3668)["forEach"](_0x5d4f0b => {
        _0x5d4f0b["setAttribute"]("data-tooltip", _0x49e7ab);
        _0x5d4f0b["title"] = _0x49e7ab;
      });
    };
    _0x2f1c7e(".rh-keying-settings-title", videoKeyingText("settings.title"));
    _0x2f1c7e(".rh-keying-label-resolution", videoKeyingText("settings.resolution"));
    _0x46cec0(".rh-keying-tip-resolution", videoKeyingText('settings.resolutionTip'));
    _0x2f1c7e(".rh-keying-label-fps", videoKeyingText('settings.fps'));
    _0x46cec0(".rh-keying-tip-fps", videoKeyingText("settings.fpsTip"));
    _0x2f1c7e('.rh-keying-label-mask-mode', videoKeyingText("settings.maskMode"));
    _0x46cec0(".rh-keying-tip-mask-mode", videoKeyingText("settings.maskModeTip"));
    _0x2f1c7e(".rh-keying-label-vram", videoKeyingText("settings.vram"));
    _0x46cec0(".rh-keying-tip-vram", videoKeyingText("settings.vramTip"));
    this["barEl"]?.["querySelectorAll"]('.rh-keying-fps-btn')['forEach'](_0x3cd142 => {
      _0x3cd142['textContent'] = videoKeyingText("settings.fpsValue", {
        'fps': _0x3cd142["dataset"]["value"]
      });
    });
    this["_refreshRemoveShortcutUi"]();
    this["_refreshKeyingHintUi"]();
    this["_lastHelperRightText"] = null;
    this["_updateHelperRight"]();
  },
  '_ensureMarkLayer'() {
    if (!this['wrapperEl']) {
      return;
    }
    const _0x1d8008 = this["videoEl"] || this["_getVideoEl"]();
    if (!_0x1d8008) {
      return;
    }
    const _0x41b063 = _0x1d8008['closest']('.node-card') || _0x1d8008["parentElement"] || null;
    if (!_0x41b063) {
      return;
    }
    this["_detachMarkLayerListeners"](this["markLayerEl"]);
    if (this["markLayerEl"] && this['markLayerEl']['isConnected']) {
      this['markLayerEl']['remove']();
    }
    this["wrapperEl"]['querySelectorAll'](".v2-video-keying-marklayer")["forEach"](_0x1c1234 => _0x1c1234["remove"]());
    const _0x22a380 = document["createElement"]("div");
    _0x22a380["className"] = "v2-video-keying-marklayer";
    if (this["_isRemoveUiMode"]()) {
      _0x22a380["classList"]["add"]('is-remove-mode');
    }
    _0x22a380['addEventListener']("pointerdown", _0x2c8e9b => {
      _0x2c8e9b['preventDefault']();
      _0x2c8e9b["stopPropagation"]();
    });
    _0x22a380["addEventListener"]('click', _0x1dfdda => {
      _0x1dfdda["preventDefault"]();
      _0x1dfdda["stopPropagation"]();
    });
    _0x22a380["addEventListener"]('dblclick', _0x4bd79f => {
      _0x4bd79f["preventDefault"]();
      _0x4bd79f["stopPropagation"]();
    });
    _0x22a380["addEventListener"]("contextmenu", _0x563d1b => {
      _0x563d1b['preventDefault']();
      _0x563d1b["stopPropagation"]();
    });
    if (this["_isRemoveUiMode"]()) {
      const _0x2507d5 = document["createElement"]('canvas');
      _0x2507d5["className"] = "v2-video-keying-paintcanvas";
      _0x22a380["appendChild"](_0x2507d5);
      this['markCanvasEl'] = _0x2507d5;
      this["removeMaskCanvasEl"] = document["createElement"]("canvas");
      const _0x586080 = document['createElement']("div");
      _0x586080["className"] = "v2-annotate-cursor v2-video-keying-cursor";
      _0x586080["style"]["display"] = "none";
      _0x22a380['appendChild'](_0x586080);
      this['removeCursorEl'] = _0x586080;
      this["_removeCursorHover"] = ![];
    } else {
      this["markCanvasEl"] = null;
      this['removeMaskCanvasEl'] = null;
      this["removeCursorEl"] = null;
      this['_removeCursorHover'] = ![];
    }
    _0x41b063["appendChild"](_0x22a380);
    this["markLayerEl"] = _0x22a380;
    this["_attachMarkLayerListeners"]();
    this["_isRemoveUiMode"]() ? (this["_onMarkWheel"] = _0x64424e => this["_onRemoveCanvasWheel"](_0x64424e), _0x22a380['addEventListener']("wheel", this["_onMarkWheel"], {
      'passive': ![]
    }), this["_removeWheelCleanup"] = () => {
      this["_onMarkWheel"] && _0x22a380["removeEventListener"]("wheel", this["_onMarkWheel"]);
    }) : (this["_removeWheelCleanup"] = null, this["_onMarkWheel"] = null);
    this['_syncRemoveCursor']();
    if (!Array["isArray"](this["_marks"])) {
      this["_marks"] = [];
    }
  },
  '_bindEvents'() {
    if (!this["barEl"]) {
      return;
    }
    this['cancelBtnEl']?.["addEventListener"]("click", _0x208dac => {
      _0x208dac["stopPropagation"]();
      this["exit"]();
    });
    this["confirmBtnEl"]?.["addEventListener"]("click", async _0x2d07da => {
      _0x2d07da['preventDefault']();
      _0x2d07da["stopPropagation"]();
      if (!this["active"] || !this['nodeId']) {
        return;
      }
      const _0x23288e = this["nodeId"];
      if (getRunningVideoKeyingTaskForNode(_0x23288e)) {
        await this['_cancelRhTaskForSourceNode'](_0x23288e, {
          'notify': !![]
        });
        return;
      }
      const _0x2f2cbf = a1609_0x11cf93["getState"]()["nodes"]?.[this["nodeId"]] || {};
      const _0x34df12 = this["videoEl"] || this["_getVideoEl"]();
      const _0x3f6534 = Number(_0x34df12?.['videoWidth']) || 0x0;
      const _0x510b02 = Number(_0x34df12?.['videoHeight']) || 0x0;
      const _0x151e7e = Number(_0x34df12?.['currentTime']) || 0x0;
      const {
        fps: _0x58a449,
        resolution: _0x297602,
        instanceType: _0x7f0f7b
      } = this['_getRhVideoSettings'](_0x2f2cbf);
      const _0x1db687 = this['_getRhMaskMode'](_0x2f2cbf);
      const _0x2c7f9f = this["_getSourceFrameCount"](_0x2f2cbf, _0x58a449);
      const {
        pos_points: _0x20978e,
        neg_points: _0x918b56
      } = this["getPosNegPoints"]();
      const {
        w: _0x5898de,
        h: _0x47d9c7
      } = this["_calcKeyingFrameSize"](_0x3f6534, _0x510b02, _0x297602);
      const _0x225dd4 = (_0xb30874, _0x94c4f4, _0x142090) => Math["max"](_0x94c4f4, Math['min'](_0x142090, _0xb30874));
      const _0x5b0b69 = _0x523e96 => ({
        'x': Math["round"](_0x225dd4(_0x523e96['x'] * _0x5898de, 0x0, Math['max'](0x0, _0x5898de - 0x1))),
        'y': Math["round"](_0x225dd4(_0x523e96['y'] * _0x47d9c7, 0x0, Math["max"](0x0, _0x47d9c7 - 0x1)))
      });
      const _0x3f0ba2 = _0x5898de > 0x0 && _0x47d9c7 > 0x0 ? _0x20978e["map"](_0x5b0b69) : [];
      const _0x488f09 = _0x5898de > 0x0 && _0x47d9c7 > 0x0 ? _0x918b56["map"](_0x5b0b69) : [];
      const _0x313aa1 = _0x3f0ba2["length"] ? JSON['stringify'](_0x3f0ba2) : '';
      const _0x372ea7 = _0x488f09['length'] ? JSON["stringify"](_0x488f09) : '';
      const _0x33954a = _0x313aa1;
      const _0x4cbf78 = _0x372ea7;
      const _0x19e15c = Math["max"](0x0, Math["round"](_0x151e7e * _0x58a449));
      try {
        const _0x3bf353 = {
          'frame_index': _0x19e15c,
          'rhVideoFps': _0x58a449,
          'rhVideoFrames': _0x2c7f9f,
          'rhVideoResolution': _0x297602,
          'rhInstanceType': _0x7f0f7b
        };
        !this["_isRemoveUiMode"]() && (_0x3bf353["positive"] = _0x313aa1, _0x3bf353["negative"] = _0x372ea7, _0x3bf353["pos_points"] = _0x33954a, _0x3bf353["neg_points"] = _0x4cbf78);
        a1609_0x11cf93['updateNodeData'](this["nodeId"], _0x3bf353);
      } catch {}
      const _0x40247f = this['_resolveSourceVideoValue'](_0x2f2cbf);
      if (!_0x40247f) {
        window['showToast']?.(videoKeyingText("toasts.connectSourceVideoFirst"), "warn");
        return;
      }
      if (isVideoKeyingSourceVideoTooLarge(_0x2f2cbf)) {
        window["showToast"]?.(videoKeyingText('toasts.sourceVideoTooLarge', {
          'maxMB': getVideoKeyingMaxSourceVideoMB()
        }), "warn");
        return;
      }
      let _0x46b7fb = null;
      try {
        _0x46b7fb = await getRunningHubWorkflowAccess();
      } catch (_0x45db10) {
        window["showToast"]?.(videoKeyingText('toasts.configReadFailed'), 'error');
        return;
      }
      const _0x272553 = String(_0x46b7fb?.["apiKey"] || '')["trim"]();
      const _0x49eb4c = String(_0x46b7fb?.["providerProfileId"] || '')["trim"]();
      const _0x2f4297 = String(_0x46b7fb?.['apiUrl'] || '')['trim']();
      if (!_0x272553) {
        showProviderApiKeyMissingToast(videoKeyingText("toasts.apiKeyMissing"), {
          'providerId': _0x49eb4c || "runninghubwf",
          'type': "warn"
        });
        return;
      }
      if (this["_isRemoveUiMode"]()) {
        let _0x3e4c7e = '';
        try {
          _0x3e4c7e = this["_exportRemoveMaskDataUrl"](_0x297602);
        } catch (_0x36950e) {
          window["showToast"]?.(_0x36950e?.['message'] || videoKeyingText('errors.removeMaskFailed'), "error");
          return;
        }
        const _0x39c339 = _0x2f2cbf;
        const {
          width: _0x5cac2b,
          height: _0x1887ab
        } = getAutoMediaSizeByShortSide(_0x39c339["width"] || 0x200, _0x39c339["height"] || 0x120);
        const _0x2f069c = calcSafeSpawnPosNearNode(a1609_0x11cf93["getState"]()["nodes"], _0x39c339, _0x5cac2b, _0x1887ab);
        const _0x33fdc2 = generateId('source-video-erase');
        const _0x25c735 = Date['now']();
        a1609_0x11cf93["addNode"](buildSourceMediaNodePayload({
          'id': _0x33fdc2,
          'type': "source-video",
          'x': _0x2f069c['x'],
          'y': _0x2f069c['y'],
          'width': _0x5cac2b,
          'height': _0x1887ab,
          'name': videoKeyingText("output.removeGeneratingName"),
          'src': '',
          'localPath': '',
          ...buildGenerationStartPatch({
            'startedAt': _0x25c735
          }),
          'provider': "runninghubwf",
          'model': getVideoKeyingModelId(),
          'rhTaskId': '',
          'rhTaskStatus': "pending",
          'rhTaskStartedAt': _0x25c735,
          'rhTaskRecovering': ![],
          'rhTaskUseOpenapiQuery': ![],
          'rhSourceNodeId': _0x23288e,
          'rhToolbarTaskType': 'video-remove',
          'fixedSize': !![],
          'outputText': buildVideoKeyingOutputText("remove", 'processing')
        }));
        a1609_0x11cf93["setSelectedNodes"]([_0x33fdc2]);
        const _0x4de0e9 = runVideoKeyingTask({
          'sourceNodeId': _0x23288e,
          'outId': _0x33fdc2,
          'mode': 'remove',
          'startedAt': _0x25c735,
          'payload': {
            'provider': "runninghubwf",
            'model': getVideoKeyingModelId(),
            'apiKey': _0x272553,
            'providerProfileId': _0x49eb4c,
            'rhProviderProfileId': _0x49eb4c,
            'runningHubApiUrl': _0x2f4297,
            'videoUrl': _0x40247f,
            'maskImageDataUrl': _0x3e4c7e,
            'sourceFrameCount': _0x2c7f9f,
            'rhVideoFps': _0x58a449,
            'rhVideoResolution': _0x297602,
            'rhInstanceType': _0x7f0f7b
          }
        });
        this["exit"]({
          'silent': !![],
          'preserveRh': !![]
        });
        await _0x4de0e9;
        return;
      }
      const _0x4b079b = _0x2f2cbf;
      const {
        width: _0x39b63f,
        height: _0x1b54c0
      } = getAutoMediaSizeByShortSide(_0x4b079b["width"] || 0x200, _0x4b079b['height'] || 0x120);
      const _0x541967 = calcSafeSpawnPosNearNode(a1609_0x11cf93["getState"]()['nodes'], _0x4b079b, _0x39b63f, _0x1b54c0);
      const _0x3c839f = generateId("source-video-matting");
      const _0x32cd34 = Date["now"]();
      a1609_0x11cf93['addNode'](buildSourceMediaNodePayload({
        'id': _0x3c839f,
        'type': "source-video",
        'x': _0x541967['x'],
        'y': _0x541967['y'],
        'width': _0x39b63f,
        'height': _0x1b54c0,
        'name': videoKeyingText("output.keyingResultName", {
          'name': _0x4b079b['name'] || videoKeyingText("output.videoFallback")
        }),
        'src': '',
        'localPath': '',
        ...buildGenerationStartPatch({
          'startedAt': _0x32cd34
        }),
        'provider': "runninghubwf",
        'model': getVideoKeyingModelId(),
        'rhTaskId': '',
        'rhTaskStatus': "pending",
        'rhTaskStartedAt': _0x32cd34,
        'rhTaskRecovering': ![],
        'rhTaskUseOpenapiQuery': ![],
        'rhSourceNodeId': _0x23288e,
        'rhToolbarTaskType': "video-keying",
        'fixedSize': !![],
        'outputText': buildVideoKeyingOutputText("keying", "processing")
      }));
      a1609_0x11cf93["setSelectedNodes"]([_0x3c839f]);
      commit();
      const _0x343495 = runVideoKeyingTask({
        'sourceNodeId': _0x23288e,
        'outId': _0x3c839f,
        'mode': "keying",
        'startedAt': _0x32cd34,
        'payload': {
          'provider': 'runninghubwf',
          'model': getVideoKeyingModelId(),
          'apiKey': _0x272553,
          'providerProfileId': _0x49eb4c,
          'rhProviderProfileId': _0x49eb4c,
          'runningHubApiUrl': _0x2f4297,
          'videoUrl': _0x40247f,
          'pos_points': _0x33954a,
          'neg_points': _0x4cbf78,
          'frame_index': _0x19e15c,
          'timeSec': _0x151e7e,
          'frameRate': _0x58a449,
          'frameCount': _0x2c7f9f,
          'rhVideoFps': _0x58a449,
          'rhVideoFrames': _0x2c7f9f,
          'rhVideoResolution': _0x297602,
          'rhInstanceType': _0x7f0f7b,
          'rhMaskMode': _0x1db687
        }
      });
      this['exit']({
        'silent': !![],
        'preserveRh': !![]
      });
      await _0x343495;
    });
    const _0x2a73b2 = this['barEl']["querySelector"](".rh-keying-settings-wrap");
    const _0x444eff = this["barEl"]["querySelector"]('.rh-keying-settings-btn');
    const _0x1602be = this["barEl"]['querySelector'](".rh-keying-settings-menu");
    if (_0x2a73b2 && _0x444eff && _0x1602be) {
      const _0x4be68f = () => {
        const _0x1122d1 = a1609_0x11cf93["getState"]()["nodes"]?.[this['nodeId']] || {};
        const {
          fps: _0x51de6e,
          resolution: _0x4835eb,
          instanceType: _0x34e908
        } = this['_getRhVideoSettings'](_0x1122d1);
        const _0x38945d = this['_getRhMaskMode'](_0x1122d1);
        _0x1602be['querySelectorAll'](".rh-keying-res-btn")['forEach'](_0x394117 => _0x394117["classList"]["toggle"]("active", Number(_0x394117["dataset"]["value"]) === _0x4835eb));
        _0x1602be["querySelectorAll"](".rh-keying-fps-btn")["forEach"](_0x1fbaa8 => _0x1fbaa8['classList']["toggle"]('active', Number(_0x1fbaa8["dataset"]["value"]) === _0x51de6e));
        _0x1602be["querySelectorAll"](".rh-keying-maskmode-btn")['forEach'](_0x2c6a05 => _0x2c6a05["classList"]["toggle"]("active", _0x2c6a05["dataset"]["value"] === _0x38945d));
        _0x1602be['querySelectorAll']('.rh-keying-vram-btn')["forEach"](_0x161637 => _0x161637["classList"]["toggle"]("active", _0x161637["dataset"]["value"] === _0x34e908));
      };
      _0x2a73b2["addEventListener"]('click', _0x708d86 => _0x708d86["stopPropagation"]());
      _0x1602be["addEventListener"]("click", _0x3adf59 => _0x3adf59['stopPropagation']());
      _0x444eff["addEventListener"]("click", _0x1f9422 => {
        _0x1f9422["preventDefault"]();
        _0x1f9422['stopPropagation']();
        const _0x2c2e8c = () => {
          _0x2a73b2["classList"]['remove']("show");
          this["_onKeyingSettingsDocDown"] && (document["removeEventListener"]("pointerdown", this['_onKeyingSettingsDocDown'], !![]), this["_onKeyingSettingsDocDown"] = null);
        };
        const _0x4f994f = !_0x2a73b2["classList"]['contains']("show");
        if (!_0x4f994f) {
          _0x2c2e8c();
          return;
        }
        _0x2a73b2["classList"]['add']('show');
        _0x4be68f();
        !this['_onKeyingSettingsDocDown'] && (this["_onKeyingSettingsDocDown"] = _0x4bbd10 => {
          if (_0x2a73b2["contains"](_0x4bbd10['target'])) {
            return;
          }
          _0x2c2e8c();
        }, document["addEventListener"]("pointerdown", this["_onKeyingSettingsDocDown"], !![]));
      });
      _0x1602be["querySelectorAll"](".rh-keying-fps-btn")['forEach'](_0x57e10f => {
        _0x57e10f["addEventListener"]("click", _0x4b3c9c => {
          _0x4b3c9c["preventDefault"]();
          _0x4b3c9c["stopPropagation"]();
          const _0x527048 = Number(_0x57e10f["dataset"]["value"]);
          const _0x180faa = normalizeRhKeyingFps(_0x527048);
          try {
            const _0x5a8d2b = Math["max"](0x1, Math["round"]((Number(this["durationSec"]) || 0x0) * _0x180faa) || 0x1);
            const _0x11c905 = this["videoEl"] || this["_getVideoEl"]();
            const _0x1ae365 = Math["max"](0x0, Math["min"](Number(this['durationSec']) || 0x0, Number(_0x11c905?.["currentTime"]) || 0x0));
            const _0x242997 = Math["max"](0x0, Math["round"](_0x1ae365 * _0x180faa));
            a1609_0x11cf93["updateNodeData"](this['nodeId'], {
              'rhVideoFps': _0x180faa,
              'rhVideoFrames': _0x5a8d2b,
              'frame_index': _0x242997
            });
          } catch {}
          _0x4be68f();
          this["_updateHelperRight"]();
        });
      });
      _0x1602be["querySelectorAll"](".rh-keying-maskmode-btn")['forEach'](_0x5bbd54 => {
        _0x5bbd54["addEventListener"]("click", _0x3f3aa6 => {
          _0x3f3aa6["preventDefault"]();
          _0x3f3aa6["stopPropagation"]();
          const _0x118cc1 = this['_normalizeRhMaskMode'](_0x5bbd54["dataset"]["value"]);
          try {
            a1609_0x11cf93["updateNodeData"](this["nodeId"], {
              'rhMaskMode': _0x118cc1
            });
          } catch {}
          _0x4be68f();
        });
      });
      _0x1602be["querySelectorAll"](".rh-keying-res-btn")["forEach"](_0x3584b7 => {
        _0x3584b7["addEventListener"]("click", _0x3804ac => {
          _0x3804ac["preventDefault"]();
          _0x3804ac["stopPropagation"]();
          const _0x2b6c56 = Math['trunc'](Number(_0x3584b7["dataset"]['value']));
          const _0x34dd98 = [0x340, 0x400, 0x500, 0x5a0, 0x640, 0x6e0, 0x780]["includes"](_0x2b6c56) ? _0x2b6c56 : 0x400;
          try {
            a1609_0x11cf93["updateNodeData"](this['nodeId'], {
              'rhVideoResolution': _0x34dd98
            });
          } catch {}
          _0x4be68f();
          this["_updateHelperRight"]();
        });
      });
      _0x1602be['querySelectorAll'](".rh-keying-vram-btn")['forEach'](_0x21a4f6 => {
        _0x21a4f6["addEventListener"]("click", _0x8536ab => {
          _0x8536ab["preventDefault"]();
          _0x8536ab["stopPropagation"]();
          const _0x44924f = normalizeRhInstanceType(_0x21a4f6["dataset"]["value"]);
          try {
            a1609_0x11cf93["updateNodeData"](this["nodeId"], {
              'rhInstanceType': _0x44924f
            });
          } catch {}
          _0x4be68f();
        });
      });
    }
    const _0x10887f = this["barEl"]["querySelector"](".rh-keying-debug-btn");
    _0x10887f && _0x10887f['addEventListener']("click", async _0x4ea8d0 => {
      _0x4ea8d0["preventDefault"]();
      _0x4ea8d0["stopPropagation"]();
      const _0x1086e5 = a1609_0x11cf93["getState"]()["nodes"]?.[this['nodeId']] || {};
      const _0x1629f9 = this["videoEl"] || this["_getVideoEl"]();
      const _0x44c1fb = Number(_0x1629f9?.["currentTime"]) || 0x0;
      const _0x299fa1 = Number(_0x1629f9?.['videoWidth']) || 0x0;
      const _0x4657de = Number(_0x1629f9?.["videoHeight"]) || 0x0;
      const {
        fps: _0x5538de,
        resolution: _0x540b04,
        instanceType: _0x76f1fa
      } = this["_getRhVideoSettings"](_0x1086e5);
      const _0x564532 = this["_getRhMaskMode"](_0x1086e5);
      const _0x5045af = this["_getSourceFrameCount"](_0x1086e5, _0x5538de);
      const _0x5624de = this['_resolveSourceVideoValue'](_0x1086e5);
      if (isVideoKeyingSourceVideoTooLarge(_0x1086e5)) {
        window["showToast"]?.(videoKeyingText('toasts.sourceVideoTooLarge', {
          'maxMB': getVideoKeyingMaxSourceVideoMB()
        }), 'warn');
        return;
      }
      const {
        pos_points: _0x314f26,
        neg_points: _0x261907
      } = this['getPosNegPoints']();
      const {
        w: _0x258a9b,
        h: _0x1c2225
      } = this["_calcKeyingFrameSize"](_0x299fa1, _0x4657de, _0x540b04);
      const _0x5b100f = (_0x2157fa, _0x1d9faf, _0x5a8954) => Math["max"](_0x1d9faf, Math['min'](_0x5a8954, _0x2157fa));
      const _0x5bb74c = _0x536efc => ({
        'x': Math['round'](_0x5b100f(_0x536efc['x'] * _0x258a9b, 0x0, Math["max"](0x0, _0x258a9b - 0x1))),
        'y': Math["round"](_0x5b100f(_0x536efc['y'] * _0x1c2225, 0x0, Math['max'](0x0, _0x1c2225 - 0x1)))
      });
      const _0x5b986a = _0x258a9b > 0x0 && _0x1c2225 > 0x0 ? _0x314f26["map"](_0x5bb74c) : [];
      const _0x2174bf = _0x258a9b > 0x0 && _0x1c2225 > 0x0 ? _0x261907["map"](_0x5bb74c) : [];
      const _0x48510f = _0x5b986a["length"] ? JSON["stringify"](_0x5b986a) : '';
      const _0xed5014 = _0x2174bf["length"] ? JSON["stringify"](_0x2174bf) : '';
      let _0x56354b = null;
      try {
        _0x56354b = await getRunningHubWorkflowAccess();
      } catch {
        window["showToast"]?.(videoKeyingText('toasts.configReadFailed'), 'error');
        return;
      }
      const _0x40c718 = String(_0x56354b?.["apiKey"] || '')["trim"]();
      const _0x288dd8 = String(_0x56354b?.["providerProfileId"] || '')["trim"]();
      const _0x3bc44a = String(_0x56354b?.["apiUrl"] || '')["trim"]();
      let _0x340713 = null;
      if (this["_isRemoveUiMode"]()) {
        let _0x3d2158 = '';
        try {
          _0x3d2158 = this["_exportRemoveMaskDataUrl"](_0x540b04);
        } catch (_0x5a8697) {
          window["showToast"]?.(videoKeyingText("toasts.debugBuildFailed", {
            'error': _0x5a8697?.["message"] || videoKeyingText("errors.maskExportFailed")
          }), "error");
          return;
        }
        _0x340713 = {
          'provider': "runninghubwf",
          'model': getVideoKeyingModelId(),
          'apiKey': _0x40c718,
          'providerProfileId': _0x288dd8,
          'rhProviderProfileId': _0x288dd8,
          'runningHubApiUrl': _0x3bc44a,
          'videoUrl': _0x5624de,
          'maskImageDataUrl': _0x3d2158,
          'sourceFrameCount': _0x5045af,
          'rhVideoFps': _0x5538de,
          'rhVideoResolution': _0x540b04,
          'rhInstanceType': _0x76f1fa
        };
      } else {
        _0x340713 = {
          'provider': "runninghubwf",
          'model': getVideoKeyingModelId(),
          'apiKey': _0x40c718,
          'providerProfileId': _0x288dd8,
          'rhProviderProfileId': _0x288dd8,
          'runningHubApiUrl': _0x3bc44a,
          'videoUrl': _0x5624de,
          'pos_points': _0x48510f,
          'neg_points': _0xed5014,
          'timeSec': _0x44c1fb,
          'frame_index': Math['max'](0x0, Math['round'](_0x44c1fb * _0x5538de)),
          'rhVideoFps': _0x5538de,
          'rhVideoFrames': Number["isFinite"](_0x1086e5["rhVideoFrames"]) ? Math["max"](0x0, Math["trunc"](_0x1086e5["rhVideoFrames"])) : _0x5045af,
          'rhVideoResolution': _0x540b04,
          'rhInstanceType': _0x76f1fa,
          'rhMaskMode': _0x564532
        };
      }
      try {
        const _0xe8048b = await buildGenerateVideoRequest(_0x340713);
        openDebugRequestWindow(buildFinalApiDebugPreview(_0xe8048b));
        window["showToast"]?.(this["_isRemoveUiMode"]() ? videoKeyingText("toasts.debugRemoveShown") : videoKeyingText('toasts.debugKeyingShown'), 'info');
      } catch (_0x49ca61) {
        window["showToast"]?.(videoKeyingText('toasts.debugFailed', {
          'error': _0x49ca61?.["message"] || videoKeyingText('errors.unknown')
        }), "error");
      }
    });
    !this['_onShortcutsUpdated'] && (this["_onShortcutsUpdated"] = () => {
      this['_refreshRemoveShortcutUi']();
      this['_refreshKeyingHintUi']();
    }, window['addEventListener']('shortcuts-updated', this["_onShortcutsUpdated"]));
    const _0x840b8e = _0x27cbf0 => {
      const _0x9162 = this["trackEl"]?.['getBoundingClientRect']();
      const _0x43ac9f = this['durationSec'];
      if (!_0x9162 || !_0x9162["width"] || !Number["isFinite"](_0x43ac9f) || _0x43ac9f <= 0x0) {
        return;
      }
      const _0x5dd559 = Math['max'](0x0, Math["min"](0x1, (_0x27cbf0 - _0x9162['left']) / _0x9162["width"]));
      const _0x4693b1 = _0x5dd559 * _0x43ac9f;
      const _0xa0a83b = this["videoEl"] || this["_getVideoEl"]();
      if (_0xa0a83b) {
        _0xa0a83b["currentTime"] = Math["max"](0x0, Math["min"](_0x43ac9f, _0x4693b1));
      }
      this["_renderPlayhead"]();
    };
    const _0x4d5c69 = (_0x398468, _0x24d71f) => {
      if (_0x398468 && this["_onPointerMove"]) {
        _0x398468["removeEventListener"]("pointermove", this["_onPointerMove"]);
      }
      if (_0x398468 && this["_onPointerUp"]) {
        _0x398468["removeEventListener"]("pointerup", this["_onPointerUp"]);
      }
      if (_0x398468 && this["_onPointerCancel"]) {
        _0x398468["removeEventListener"]("pointercancel", this['_onPointerCancel']);
      }
      if (_0x398468 && this["_onPointerCancel"]) {
        _0x398468["removeEventListener"]('lostpointercapture', this["_onPointerCancel"]);
      }
      this["_onPointerMove"] = null;
      this["_onPointerUp"] = null;
      this["_onPointerCancel"] = null;
      try {
        if (_0x398468 && Number["isFinite"](_0x24d71f)) {
          _0x398468["releasePointerCapture"](_0x24d71f);
        }
      } catch {}
    };
    const _0x231877 = _0x51c5e7 => {
      if (!this["active"] || !this["trackEl"]) {
        return;
      }
      _0x51c5e7["preventDefault"]();
      _0x51c5e7["stopPropagation"]();
      this["_pauseAllWrapperVideos"]();
      _0x840b8e(_0x51c5e7["clientX"]);
      const _0x214844 = this["trackEl"];
      const _0x4c17d2 = _0x51c5e7['pointerId'];
      try {
        if (Number["isFinite"](_0x4c17d2)) {
          _0x214844["setPointerCapture"](_0x4c17d2);
        }
      } catch {}
      this['_onPointerMove'] = _0x4482fe => {
        if (Number["isFinite"](_0x4c17d2) && _0x4482fe["pointerId"] !== _0x4c17d2) {
          return;
        }
        _0x4482fe["preventDefault"]();
        _0x840b8e(_0x4482fe["clientX"]);
      };
      this["_onPointerUp"] = _0x58048c => {
        if (Number["isFinite"](_0x4c17d2) && _0x58048c["pointerId"] !== _0x4c17d2) {
          return;
        }
        _0x58048c["preventDefault"]();
        _0x4d5c69(_0x214844, _0x4c17d2);
        this['_pauseAllWrapperVideos']();
      };
      this["_onPointerCancel"] = _0x1ce53d => {
        if (Number['isFinite'](_0x4c17d2) && _0x1ce53d["pointerId"] !== _0x4c17d2) {
          return;
        }
        _0x4d5c69(_0x214844, _0x4c17d2);
        this["_pauseAllWrapperVideos"]();
      };
      _0x214844["addEventListener"]("pointermove", this["_onPointerMove"]);
      _0x214844["addEventListener"]("pointerup", this["_onPointerUp"]);
      _0x214844["addEventListener"]('pointercancel', this["_onPointerCancel"]);
      _0x214844["addEventListener"]("lostpointercapture", this["_onPointerCancel"]);
    };
    this['playheadEl']?.['addEventListener']('pointerdown', _0x231877);
    this['trackEl']?.["addEventListener"]("pointerdown", _0x231877);
    this["_onKeyDown"] = _0x51ec11 => {
      if (!this['active']) {
        return;
      }
      if (_0x51ec11["target"] && (_0x51ec11["target"]["tagName"] === "INPUT" || _0x51ec11["target"]["tagName"] === "TEXTAREA" || _0x51ec11["target"]['isContentEditable'])) {
        return;
      }
      if (_0x51ec11["key"] === "Escape") {
        _0x51ec11["preventDefault"]();
        _0x51ec11['stopPropagation']();
        this["exit"]();
        return;
      }
      const _0x4b0439 = handleShortcutKeydown(_0x51ec11, {
        'mattingActive': ![],
        'annotateActive': ![],
        'videoKeyingActive': !![],
        'featureModeActive': !![],
        'selectedNodeType': "source-video"
      });
      if (!_0x4b0439) {
        return;
      }
      if (this['_isRemoveUiMode']()) {
        if (_0x4b0439 === "editor-tool-brush") {
          _0x51ec11["preventDefault"]();
          _0x51ec11['stopPropagation']();
          this["_setRemovePointTool"]("foreground");
          return;
        }
        if (_0x4b0439 === 'editor-tool-eraser') {
          _0x51ec11["preventDefault"]();
          _0x51ec11["stopPropagation"]();
          this["_setRemovePointTool"]("background");
          return;
        }
        if (_0x4b0439 === "editor-clear") {
          _0x51ec11['preventDefault']();
          _0x51ec11["stopPropagation"]();
          this["_clearAllMarks"]();
          window["showToast"]?.(videoKeyingText("toasts.clearedPoints"), 'info');
          return;
        }
        if (_0x4b0439 === "undo") {
          _0x51ec11['preventDefault']();
          _0x51ec11["stopPropagation"]();
          this["_undoMark"]();
          return;
        }
        if (_0x4b0439 === "redo") {
          _0x51ec11["preventDefault"]();
          _0x51ec11["stopPropagation"]();
          this["_redoMark"]();
          return;
        }
      }
      if (_0x4b0439 === "undo") {
        _0x51ec11["preventDefault"]();
        _0x51ec11["stopPropagation"]();
        this["_undoMark"]();
        return;
      }
      if (_0x4b0439 === "redo") {
        _0x51ec11["preventDefault"]();
        _0x51ec11["stopPropagation"]();
        this["_redoMark"]();
        return;
      }
      _0x4b0439 === 'editor-clear' && (_0x51ec11["preventDefault"](), _0x51ec11["stopPropagation"](), this['_clearAllMarks'](), window["showToast"]?.(videoKeyingText('toasts.clearedPoints'), "info"));
    };
    window["addEventListener"]("keydown", this['_onKeyDown'], !![]);
    const _0x50c9d5 = () => {
      const _0xbb6c9c = this["markLayerEl"];
      const _0x2b099b = this["videoEl"] || this["_getVideoEl"]();
      const _0x3e0363 = Array['isArray'](this["_marks"]) ? this["_marks"] : [];
      if (!_0xbb6c9c || !_0x2b099b) {
        return;
      }
      const _0x174699 = this["_measureProjection"]({
        'videoEl': _0x2b099b,
        'layerEl': _0xbb6c9c
      });
      const _0x1fbd65 = _0x174699?.["layer"];
      if (!_0x174699 || !_0x1fbd65) {
        return;
      }
      if (this["_isRemoveUiMode"]()) {
        const _0x50147a = this["markCanvasEl"];
        if (!_0x50147a) {
          return;
        }
        const _0x47b20e = Math['max'](0x1, Math['round'](_0x1fbd65['lw']));
        const _0x5574cb = Math["max"](0x1, Math["round"](_0x1fbd65['lh']));
        const _0x71331d = window["devicePixelRatio"] || 0x1;
        const _0x23eabe = Math["round"](_0x47b20e * _0x71331d);
        const _0x1fe533 = Math["round"](_0x5574cb * _0x71331d);
        (_0x50147a['width'] !== _0x23eabe || _0x50147a['height'] !== _0x1fe533) && (_0x50147a["width"] = _0x23eabe, _0x50147a["height"] = _0x1fe533, _0x50147a['style']["width"] = _0x47b20e + 'px', _0x50147a["style"]['height'] = _0x5574cb + 'px');
        const _0x5572a0 = _0x50147a["getContext"]('2d');
        if (!_0x5572a0) {
          return;
        }
        _0x5572a0["setTransform"](_0x71331d, 0x0, 0x0, _0x71331d, 0x0, 0x0);
        _0x5572a0["clearRect"](0x0, 0x0, _0x47b20e, _0x5574cb);
        const _0x5098ff = this["removeMaskCanvasEl"] || document["createElement"]("canvas");
        (_0x5098ff['width'] !== Math["round"](_0x47b20e) || _0x5098ff['height'] !== Math['round'](_0x5574cb)) && (_0x5098ff["width"] = Math["max"](0x1, Math["round"](_0x47b20e)), _0x5098ff["height"] = Math["max"](0x1, Math["round"](_0x5574cb)));
        this["removeMaskCanvasEl"] = _0x5098ff;
        const _0x31eaf6 = _0x5098ff["getContext"]('2d');
        if (!_0x31eaf6) {
          return;
        }
        _0x31eaf6["clearRect"](0x0, 0x0, _0x5098ff["width"], _0x5098ff["height"]);
        _0x31eaf6["lineCap"] = "round";
        _0x31eaf6["lineJoin"] = "round";
        const _0x15dd1e = _0x3ef06b => {
          if (!_0x3ef06b || _0x3ef06b['type'] !== "brush" && _0x3ef06b['type'] !== "eraser") {
            return;
          }
          const _0x18bee1 = Array["isArray"](_0x3ef06b["points"]) ? _0x3ef06b["points"] : [];
          if (!_0x18bee1['length']) {
            return;
          }
          const _0x3a2b2f = _0x18bee1["map"](_0x245736 => _0x174699['normalizedToLayerPoint'](Number(_0x245736?.['nx']), Number(_0x245736?.['ny'])))["filter"](_0x5f3520 => Number['isFinite'](_0x5f3520['x']) && Number["isFinite"](_0x5f3520['y']));
          if (!_0x3a2b2f["length"]) {
            return;
          }
          drawEraseMaskCommand(_0x31eaf6, {
            'type': _0x3ef06b["type"] === 'eraser' ? "eraser" : "brush",
            'points': _0x3a2b2f,
            'lineWidth': getBrushLineWidth(this["_clampRemoveBrushSize"](_0x3ef06b['brushSizePx']), 0x1, _0x3ef06b["type"])
          });
        };
        _0x3e0363["forEach"](_0x15dd1e);
        if (this["_removeDraft"]) {
          _0x15dd1e(this["_removeDraft"]);
        }
        const _0x4053e7 = createEraseCheckerboardPattern(_0x5572a0, 0x1) || getEraseCanvasPalette()["checkerAccent"];
        compositeCheckerMask(_0x5572a0, {
          'maskCanvas': _0x5098ff,
          'width': _0x47b20e,
          'height': _0x5574cb,
          'checkerPattern': _0x4053e7,
          'checkerZoom': 0x1,
          'checkerAlpha': 0.8
        });
        return;
      }
      if (!_0x3e0363["length"]) {
        _0xbb6c9c["replaceChildren"]();
        return;
      }
      const _0x564795 = document['createDocumentFragment']();
      for (let _0x197a6e = 0x0; _0x197a6e < _0x3e0363['length']; _0x197a6e++) {
        const _0x4496a6 = _0x3e0363[_0x197a6e];
        const _0xe5119b = document["createElement"]("div");
        const _0x51008b = _0x4496a6 && typeof _0x4496a6["pointType"] === 'string' ? _0x4496a6["pointType"] : "foreground";
        _0xe5119b["className"] = _0x51008b === "background" ? 'v2-video-keying-mark\x20v2-video-keying-mark--background' : "v2-video-keying-mark v2-video-keying-mark--foreground";
        if (this["_isRemoveUiMode"]()) {
          const _0x354497 = this["_clampRemoveBrushSize"](_0x4496a6["brushSizePx"] || this["_removeBrushSizePx"]);
          const _0x2bbb63 = Math["max"](0x8, Math["min"](0x1e, Math["round"](_0x354497 / 0x4)));
          _0xe5119b['style']["width"] = _0x2bbb63 + 'px';
          _0xe5119b['style']['height'] = _0x2bbb63 + 'px';
        }
        const _0x13b247 = _0x174699["normalizedToLayerPoint"](Number(_0x4496a6['nx']), Number(_0x4496a6['ny']));
        if (!_0x13b247) {
          continue;
        }
        _0xe5119b['style']["left"] = _0x13b247['x'] + 'px';
        _0xe5119b["style"]["top"] = _0x13b247['y'] + 'px';
        _0x564795['appendChild'](_0xe5119b);
      }
      _0xbb6c9c["replaceChildren"](_0x564795);
    };
    this["_renderMarksFn"] = _0x50c9d5;
    const _0x356be7 = {
      'down': ![],
      'pointerId': null
    };
    const _0x274d84 = (_0x478682 = !![]) => {
      const _0x54e3e8 = this["markLayerEl"];
      const _0x586c26 = _0x356be7["pointerId"];
      if (_0x54e3e8 && Number["isFinite"](_0x586c26)) {
        try {
          _0x54e3e8["releasePointerCapture"](_0x586c26);
        } catch {}
      }
      _0x356be7["down"] = ![];
      _0x356be7["pointerId"] = null;
      this['_removeDrawPointerId'] = null;
      const _0x56acd2 = this['_removeDraft'];
      this["_removeDraft"] = null;
      if (!_0x478682 || !_0x56acd2) {
        this["_renderMarksFn"]?.();
        return;
      }
      const _0x2af601 = Array['isArray'](_0x56acd2["points"]) ? _0x56acd2["points"]["map"](_0x3bf6e3 => ({
        'nx': Math["max"](0x0, Math["min"](0x1, Number(_0x3bf6e3?.['nx']) || 0x0)),
        'ny': Math["max"](0x0, Math['min'](0x1, Number(_0x3bf6e3?.['ny']) || 0x0))
      }))["filter"](_0x5f4c6e => Number["isFinite"](_0x5f4c6e['nx']) && Number['isFinite'](_0x5f4c6e['ny'])) : [];
      if (!_0x2af601["length"]) {
        this["_renderMarksFn"]?.();
        return;
      }
      const _0x4a14f5 = Array["isArray"](this['_marks']) ? this['_marks'] : [];
      _0x4a14f5["push"]({
        'type': _0x56acd2["type"] === 'eraser' ? "eraser" : "brush",
        'brushSizePx': this["_clampRemoveBrushSize"](_0x56acd2["brushSizePx"]),
        'points': _0x2af601
      });
      this["_marks"] = _0x4a14f5;
      this['_marksRedo'] = [];
      this["_syncPointsToStore"]();
      this["_renderMarksFn"]?.();
    };
    this['_onMarkPointerDown'] = _0x28db27 => {
      if (!this["active"]) {
        return;
      }
      if (_0x28db27["detail"] && _0x28db27["detail"] > 0x1) {
        return;
      }
      if (!this["markLayerEl"] || !this["markLayerEl"]["contains"](_0x28db27["target"])) {
        return;
      }
      _0x28db27["preventDefault"]();
      _0x28db27['stopPropagation']();
      this["_pauseAllWrapperVideos"]();
      this["_scheduleRemoveCursor"](_0x28db27["clientX"], _0x28db27['clientY']);
      const _0x4c7760 = this["_measureProjection"]()?.["pickClientPoint"](_0x28db27["clientX"], _0x28db27["clientY"]);
      if (!_0x4c7760) {
        return;
      }
      if (this['_isRemoveUiMode']()) {
        if (_0x28db27["button"] !== 0x0) {
          return;
        }
        Array["isArray"](this["_marksRedo"]) && this["_marksRedo"]["length"] && (this["_marksRedo"] = []);
        const _0x1e1af9 = this['_getRemoveToolType']();
        this["_removeDraft"] = {
          'type': _0x1e1af9,
          'brushSizePx': this['_clampRemoveBrushSize'](this["_removeBrushSizePx"]),
          'points': [{
            'nx': _0x4c7760['nx'],
            'ny': _0x4c7760['ny']
          }]
        };
        _0x356be7["down"] = !![];
        _0x356be7["pointerId"] = _0x28db27["pointerId"];
        this["_removeDrawPointerId"] = _0x28db27["pointerId"];
        try {
          if (Number['isFinite'](_0x28db27["pointerId"])) {
            this["markLayerEl"]["setPointerCapture"](_0x28db27['pointerId']);
          }
        } catch {}
        this["_renderMarksFn"]?.();
        return;
      }
      const _0x282830 = Array["isArray"](this["_marks"]) ? this["_marks"] : [];
      Array["isArray"](this["_marksRedo"]) && this["_marksRedo"]["length"] && (this['_marksRedo'] = []);
      const _0x32788e = this['videoEl'];
      const _0x2cd8a9 = Number(_0x32788e?.["currentTime"]) || 0x0;
      if (_0x28db27["button"] !== 0x0 && _0x28db27["button"] !== 0x2) {
        return;
      }
      let _0x5be16c = _0x28db27["button"] === 0x2 ? "background" : "foreground";
      this['_isRemoveUiMode']() && _0x28db27["button"] === 0x0 && (_0x5be16c = this["_removePointTool"] === "background" ? "background" : "foreground");
      _0x282830["push"]({
        'nx': _0x4c7760['nx'],
        'ny': _0x4c7760['ny'],
        't': _0x2cd8a9,
        'pointType': _0x5be16c,
        'brushSizePx': this["_isRemoveUiMode"]() ? this["_clampRemoveBrushSize"](this["_removeBrushSizePx"]) : undefined
      });
      this['_marks'] = _0x282830;
      _0x50c9d5();
      this['_syncPointsToStore']();
    };
    this["_onMarkPointerMove"] = _0x1d482a => {
      if (!this['active'] || !this["_isRemoveUiMode"]()) {
        return;
      }
      this["_scheduleRemoveCursor"](_0x1d482a["clientX"], _0x1d482a['clientY']);
      if (!_0x356be7["down"] || !this["_removeDraft"]) {
        return;
      }
      if (Number["isFinite"](_0x356be7['pointerId']) && _0x1d482a["pointerId"] !== _0x356be7["pointerId"]) {
        return;
      }
      _0x1d482a['preventDefault']();
      _0x1d482a["stopPropagation"]();
      const _0x774bb0 = this["_measureProjection"]()?.["pickClientPoint"](_0x1d482a["clientX"], _0x1d482a["clientY"]);
      if (!_0x774bb0) {
        return;
      }
      const _0x5f2afd = this["_removeDraft"]['points'];
      if (!Array["isArray"](_0x5f2afd) || !_0x5f2afd["length"]) {
        this["_removeDraft"]['points'] = [{
          'nx': _0x774bb0['nx'],
          'ny': _0x774bb0['ny']
        }];
        this["_renderMarksFn"]?.();
        return;
      }
      const _0x11fb98 = _0x5f2afd[_0x5f2afd["length"] - 0x1];
      const _0x21ca4b = Math["hypot"](Number(_0x774bb0['nx']) - Number(_0x11fb98['nx']), Number(_0x774bb0['ny']) - Number(_0x11fb98['ny']));
      if (_0x21ca4b < 0.0006) {
        return;
      }
      _0x5f2afd['push']({
        'nx': _0x774bb0['nx'],
        'ny': _0x774bb0['ny']
      });
      this["_renderMarksFn"]?.();
    };
    this["_onMarkPointerUp"] = _0x17d7c4 => {
      if (!this["active"] || !this["_isRemoveUiMode"]()) {
        return;
      }
      this['_scheduleRemoveCursor'](_0x17d7c4["clientX"], _0x17d7c4['clientY']);
      if (Number["isFinite"](_0x356be7["pointerId"]) && _0x17d7c4["pointerId"] !== _0x356be7["pointerId"]) {
        return;
      }
      _0x17d7c4["preventDefault"]();
      _0x17d7c4["stopPropagation"]();
      _0x274d84(!![]);
    };
    this["_onMarkPointerCancel"] = _0x58268e => {
      if (!this["active"] || !this["_isRemoveUiMode"]()) {
        return;
      }
      if (Number['isFinite'](_0x356be7['pointerId']) && _0x58268e["pointerId"] !== _0x356be7['pointerId']) {
        return;
      }
      _0x274d84(!![]);
    };
    this["_onMarkPointerEnter"] = _0x258ce6 => {
      if (!this["_isRemoveUiMode"]()) {
        return;
      }
      this["_removeCursorHover"] = !![];
      this["_scheduleRemoveCursor"](_0x258ce6["clientX"], _0x258ce6['clientY']);
    };
    this['_onMarkPointerLeave'] = () => {
      if (!this["_isRemoveUiMode"]()) {
        return;
      }
      this["_removeCursorHover"] = ![];
      this["_syncRemoveCursor"]();
    };
    this["_detachMarkLayerListeners"]();
    this["_attachMarkLayerListeners"]();
    _0x50c9d5();
    this["_onResize"] = () => {
      if (!this['active']) {
        return;
      }
      this['_renderMarksFn']?.();
      this["_syncRemoveCursor"]();
    };
    window["addEventListener"]("resize", this["_onResize"]);
  },
  '_getVideoEl'() {
    return resolveNodeVideoElement(this["wrapperEl"], a1609_0x11cf93["getStateRaw"]()["nodes"]?.[this["nodeId"]]?.["mainVideoIndex"]);
  },
  '_readDurationSec'(_0x371b4c) {
    if (!_0x371b4c) {
      return 0x0;
    }
    const _0x495108 = Number(_0x371b4c['duration']);
    if (Number["isFinite"](_0x495108) && _0x495108 > 0x0) {
      return _0x495108;
    }
    const _0x5edf42 = _0x371b4c['seekable'];
    if (_0x5edf42 && _0x5edf42["length"]) {
      const _0x2e7f44 = Number(_0x5edf42["end"](_0x5edf42["length"] - 0x1));
      if (Number['isFinite'](_0x2e7f44) && _0x2e7f44 > 0x0) {
        return _0x2e7f44;
      }
    }
    return 0x0;
  },
  async '_syncDurationAndDefaults'() {
    this["videoEl"] = this["_getVideoEl"]();
    this['_ensureMarkLayer']();
    this["_renderThumbs"]();
    if (this["videoEl"]) {
      const _0x3b8886 = this["_resolveVideoSrcFromNode"](a1609_0x11cf93["getState"]()["nodes"]?.[this['nodeId']]);
      const _0x588873 = String(_0x3b8886 || '')["trim"]();
      const _0x4357f3 = String(this["videoEl"]["dataset"]?.['videoKeyingSourceUrl'] || '')["trim"]();
      const _0xef49d2 = ++this['_sourceToken'];
      const _0x285a95 = this["videoEl"];
      const _0x46a41e = this["nodeId"];
      const _0x3352a0 = () => this['active'] && _0xef49d2 === this['_sourceToken'] && this['videoEl'] === _0x285a95 && this["nodeId"] === _0x46a41e;
      setVideoKeyingMediaKeepAlive(this["videoEl"], !![]);
      if (_0x588873 && _0x4357f3 !== _0x588873) {
        await attachVideoKeyingPlaybackSource(_0x285a95, _0x588873, {
          'shouldAssign': _0x3352a0
        });
        if (!_0x3352a0()) {
          return;
        }
        this["videoEl"]["dataset"] && (this["videoEl"]["dataset"]["videoKeyingSourceUrl"] = _0x588873);
      }
    }
    const _0x296ce9 = this["_readDurationSec"](this["videoEl"]);
    if (_0x296ce9 > 0x0) {
      this["durationSec"] = _0x296ce9;
    }
    this["_pauseAllWrapperVideos"]();
    this['videoEl'] && (this['_onLoadedMeta'] = () => {
      if (!this["active"]) {
        return;
      }
      const _0x3188f9 = this["_readDurationSec"](this["videoEl"]);
      if (_0x3188f9 > 0x0) {
        this["durationSec"] = _0x3188f9;
      }
      this["_pauseAllWrapperVideos"]();
    }, this['_onDurationChange'] = () => {
      if (!this["active"]) {
        return;
      }
      const _0x35bfba = this["_readDurationSec"](this["videoEl"]);
      if (_0x35bfba > 0x0) {
        this['durationSec'] = _0x35bfba;
      }
    }, this["videoEl"]["addEventListener"]("loadedmetadata", this["_onLoadedMeta"], {
      'once': !![]
    }), this["videoEl"]["addEventListener"]("durationchange", this["_onDurationChange"]));
    this["_startPlayheadLoop"]();
    this['wrapperEl'] && !this['_onVideoPlay'] && (this["_onVideoPlay"] = _0x2f648c => {
      if (!this["active"]) {
        return;
      }
      if (!this["wrapperEl"]) {
        return;
      }
      const _0x5c9262 = _0x2f648c["target"];
      if (!(_0x5c9262 instanceof HTMLVideoElement)) {
        return;
      }
      try {
        _0x5c9262['pause']();
      } catch {}
    }, this["wrapperEl"]["addEventListener"]("play", this["_onVideoPlay"], !![]), this["wrapperEl"]["addEventListener"]("playing", this["_onVideoPlay"], !![]));
  },
  '_startPlayheadLoop'() {
    if (this["_playheadRaf"]) {
      cancelAnimationFrame(this["_playheadRaf"]);
    }
    const _0x3a9045 = () => {
      if (!this["active"]) {
        return;
      }
      this["_renderPlayhead"]();
      this['_playheadRaf'] = requestAnimationFrame(_0x3a9045);
    };
    this["_playheadRaf"] = requestAnimationFrame(_0x3a9045);
  },
  '_renderPlayhead'() {
    if (!this["playheadEl"] || !this["trackEl"]) {
      return;
    }
    const _0x5b9a13 = this["durationSec"];
    if (!Number["isFinite"](_0x5b9a13) || _0x5b9a13 <= 0x0) {
      this["playheadEl"]["style"]["display"] = "none";
      return;
    }
    const _0x350de4 = this["videoEl"] || this['_getVideoEl']();
    if (!_0x350de4) {
      this['playheadEl']['style']['display'] = "none";
      return;
    }
    let _0x164755 = ![];
    if (this["videoEl"] !== _0x350de4) {
      this['videoEl'] = _0x350de4;
      this["_ensureMarkLayer"]();
      this['_attachMarkLayerListeners']();
      _0x164755 = !![];
    } else {
      this['markLayerEl'] && !this["markLayerEl"]["isConnected"] && (this["_ensureMarkLayer"](), this['_attachMarkLayerListeners'](), _0x164755 = !![]);
    }
    const _0x1baf92 = Math["max"](0x0, Math['min'](_0x5b9a13, Number(_0x350de4["currentTime"]) || 0x0));
    const _0x1a8c0c = Math["max"](0x0, Math["min"](0x1, _0x1baf92 / _0x5b9a13));
    const _0x53bc31 = a1609_0x11cf93["getState"]()["nodes"]?.[this['nodeId']] || {};
    const {
      fps: _0x5c7131
    } = this["_getRhVideoSettings"](_0x53bc31);
    const _0x54396a = Math["max"](0x0, Math["round"](_0x1baf92 * _0x5c7131));
    (this["_lastFrameIndex"] !== _0x54396a || this["_lastFrameIndexFps"] !== _0x5c7131) && (this['_lastFrameIndex'] = _0x54396a, this['_lastFrameIndexFps'] = _0x5c7131, this['_updateHelperRight']());
    this['_updateHelperRight']();
    this["playheadEl"]['style']['display'] = 'block';
    this["playheadEl"]["style"]["left"] = _0x1a8c0c * 0x64 + '%';
    if (_0x164755) {
      this["_renderMarksFn"]?.();
    }
    this["_syncRemoveCursor"]();
  },
  '_resolveVideoSrcFromNode'(_0x4491c0) {
    if (!_0x4491c0) {
      return '';
    }
    const _0x1f47fb = localPathToUrl(_0x4491c0["localPath"]);
    return _0x1f47fb || _0x4491c0['src'] || _0x4491c0['videoUrl'] || _0x4491c0['resultUrl'] || '';
  },
  async '_renderThumbs'() {
    const _0x56eba4 = ++this["_thumbToken"];
    const _0x3d6088 = Array["isArray"](this['thumbEls']) ? this["thumbEls"] : [];
    if (!_0x3d6088["length"]) {
      return;
    }
    const _0x5589d6 = a1609_0x11cf93['getState']()['nodes'][this["nodeId"]];
    const _0x134f11 = this["_resolveVideoSrcFromNode"](_0x5589d6);
    const _0x26e172 = await renderVideoTimelineThumbnails({
      'src': _0x134f11,
      'posterUrl': resolveCanvasVideoPosterUrl(_0x5589d6),
      'thumbs': _0x3d6088,
      'isCurrent': () => this['active'] && this["_thumbToken"] === _0x56eba4,
      'onDuration': _0x5546ce => {
        _0x5546ce > 0x0 && (!this['durationSec'] || this["durationSec"] <= 0x0) && (this["durationSec"] = _0x5546ce);
      }
    });
    if (!this["active"] || this["_thumbToken"] !== _0x56eba4) {
      return;
    }
    if (this['trackEl']?.["dataset"]) {
      this['trackEl']["dataset"]["thumbnailState"] = _0x26e172["source"];
    }
    if (_0x26e172["source"] === "poster" || _0x26e172["source"] === "empty") {
      if (_0x26e172["errors"]["length"]) {
        console['warn']("[VideoKeyingController] timeline thumbnails unavailable:", _0x26e172['errors']);
      }
    }
  },
  ...videoKeyingLifecycleMethods
};
export default VideoKeyingController;