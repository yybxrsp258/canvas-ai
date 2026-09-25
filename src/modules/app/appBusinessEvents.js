import { deleteSelectedPanoramaSceneObject, focusPanoramaSceneSelection, resetPanoramaSceneView, setPanoramaSceneEditing, setPanoramaSceneTool } from '../panoramaSceneNode/sceneNodeActions.js';
import { copyNodeMediaToSystemClipboard } from '../mediaClipboard.js';
import { startCanvasScreenshot } from '../canvasScreenshot.js';
import { markSystemClipboardWrite } from '../clipboard.js';
import { applySnapGridEnabled, readSnapGridEnabled } from '../snapGridState.js';
import { readGridDotsPref, setGridDotsPref } from '../settings/appearanceSettings.js';
import { setSelectionRelatedHighlightPref } from '../settings/canvasAlignmentSettings.js';
import { readCommentNoteJumpFocusPref, setImageVideoNodeResizePref, setNodeAvoidOverlapPref, setPromptBoxResizePref, setTitleFollowsCanvasZoomPref } from '../settings/nodeBehaviorSettings.js';
import { resolveJumpZoom } from '../commentNoteJumpShortcut.js';
import { toggleSettingsPanel } from '../settings/panelSettings.js';
import { toggleSidebarSubmenu } from '../sidebarSubmenuController.js';
import { syncPlaySelectedVideos } from '../videoSyncPlayback.js';
import { computeNodesWorldBounds, computeViewportForWorldBounds, getAlignableSelectionNodes, getViewportScreenOrigin, screenToWorld } from '../../core/math.js';
import { getBrowserViewportRect } from '../../core/viewportFocus.js';
import { clampCanvasZoom } from '../../core/canvasZoom.js';
import { t } from '../../i18n/index.js';
import { SAVED_WORKFLOW_LIBRARY_ENTRY_ENABLED } from '../../config/productFeatures.js';
const COMMENT_NOTE_JUMP_WORLD_ALIGN = 0.5;
const MEDIA_CLIP_DELETE_MATERIAL_EVENT = 'media-clip-delete-material';
export function createAppBusinessEvents({
  store: _0x290ad6,
  wrap: _0x15b9f2,
  canvasViewportEl = null,
  addShortcutListener: _0x35b9dc,
  executeCommand: _0x22cf2d,
  undo: _0xecc494,
  redo: _0xb8cfe0,
  commit: _0x4a286b,
  closeShortcuts: _0x2f99cd,
  getNodeDefaultSize: _0x2fc82a,
  getAIGenerationDefaultSizeByType: _0x345756,
  createNodeAtCursor: _0x570927,
  createImageNodeFromBlob: _0x223b0a,
  openFileUpload: _0x38082a,
  animateViewport: _0x3de2c0,
  focusNodeAtZoomPercent: _0x1feee2,
  focusNodes: _0x63ede4,
  clearTrackedFocus: _0x12cc4c,
  handlePasteFromClipboard: _0x14fe31,
  initCanvasContextMenu: _0x3f91f6,
  toggleAgentPanel: _0x567c87,
  ImageAnnotateController: _0x1a064a,
  ImageMattingController: _0x42b2c4,
  AudioClipController: _0x23493d,
  syncPlaySelectedVideos: _0x411974 = syncPlaySelectedVideos
} = {}) {
  const _0x26e0ae = () => typeof _0x290ad6?.["getStateRaw"] === "function" ? _0x290ad6["getStateRaw"]() : _0x290ad6?.["getState"]?.() || {};
  const _0x58d690 = _0x8e1265 => {
    const _0x15a840 = _0x8e1265?.['viewport'];
    if (!_0x15a840) {
      return null;
    }
    const _0x1ff231 = Number(window?.["_lastMx"]);
    const _0x5e4fee = Number(window?.["_lastMy"]);
    if (!Number["isFinite"](_0x1ff231) || !Number["isFinite"](_0x5e4fee)) {
      return null;
    }
    const _0x154092 = screenToWorld(_0x1ff231, _0x5e4fee, _0x15a840);
    if (!_0x154092 || !Number["isFinite"](_0x154092['x']) || !Number["isFinite"](_0x154092['y'])) {
      return null;
    }
    return {
      'x': _0x154092['x'],
      'y': _0x154092['y']
    };
  };
  const _0x1b10b2 = {
    'panorama-scene-camera-create': {
      'selector': ".act-camera",
      'nodeTypes': ["panorama-scene"]
    },
    'image-tool-matting': {
      'selector': ".act-matting",
      'nodeTypes': ["source-image", "ai-image", "image"]
    },
    'image-tool-repaint': {
      'selector': '.act-local-edit',
      'scene': 'repaint',
      'nodeTypes': ['source-image', "ai-image", "image"]
    },
    'image-tool-erase': {
      'selector': ".act-local-edit",
      'scene': "erase",
      'nodeTypes': ['source-image', 'ai-image', "image"]
    },
    'image-tool-hd': {
      'selector': ".act-hd",
      'nodeTypes': ["source-image", "ai-image", 'image']
    },
    'image-tool-expand': {
      'selector': ".act-expand",
      'nodeTypes': ['source-image', 'ai-image', "image"]
    },
    'image-tool-auto-subject': {
      'selector': ".act-auto-subject",
      'nodeTypes': ["source-image", "ai-image", "image"]
    },
    'image-tool-multigrid': {
      'selector': ".act-multigrid",
      'nodeTypes': ['source-image', "ai-image", "image"]
    },
    'image-tool-multiangle': {
      'selector': '.act-multiangle',
      'nodeTypes': ["source-image", "ai-image", "image"]
    },
    'image-tool-annotate': {
      'selector': ".act-annotate",
      'nodeTypes': ["source-image", "ai-image", "image"]
    },
    'image-tool-crop': {
      'selector': ".act-crop",
      'nodeTypes': ["source-image", "ai-image", 'image']
    },
    'image-tool-fullscreen': {
      'selector': ".act-fullscreen",
      'nodeTypes': ["source-image", "ai-image", "image"]
    },
    'image-tool-download': {
      'selector': '.act-download',
      'nodeTypes': ['source-image', "ai-image", "image"]
    },
    'video-tool-clip': {
      'selector': ".act-clip",
      'nodeTypes': ["source-video", "ai-video", "video"]
    },
    'video-tool-separate-av': {
      'selector': ".act-separate-av",
      'nodeTypes': ["source-video", 'ai-video', 'video']
    },
    'video-tool-capture-frame': {
      'selector': ".video-snap-btn",
      'nodeTypes': ["source-video", "ai-video", "video"]
    },
    'video-tool-keying': {
      'selector': ".act-keying",
      'nodeTypes': ["source-video", "ai-video", "video"]
    },
    'video-tool-hd': {
      'selector': ".act-hd",
      'nodeTypes': ['source-video', "ai-video", 'video']
    },
    'video-tool-fullscreen': {
      'selector': ".act-fullscreen",
      'nodeTypes': ["source-video", "ai-video", 'video']
    },
    'video-tool-download': {
      'selector': '.act-download',
      'nodeTypes': ["source-video", "ai-video", "video"]
    },
    'audio-tool-clip': {
      'selector': ".clip-btn",
      'nodeTypes': ["source-audio", 'ai-audio', "audio"]
    },
    'audio-tool-speed': {
      'selector': ".speed-btn",
      'nodeTypes': ["source-audio", "ai-audio", "audio"]
    },
    'audio-tool-download': {
      'selector': ".download-btn",
      'nodeTypes': ['source-audio', 'ai-audio', "audio"]
    },
    'clip-tool-crop': {
      'selector': ".media-clip-tool-crop",
      'nodeTypes': ["media-clip"]
    },
    'text-tool-copy': {
      'selector': ".act-copy",
      'nodeTypes': ["source-text", "ai-text", "text"]
    },
    'text-tool-fullscreen': {
      'selector': '.act-fullscreen',
      'nodeTypes': ["source-text", "ai-text", 'text']
    }
  };
  function _0x5e3302() {
    const _0x145446 = document["getElementById"]('v2-wrap');
    return !!_0x145446?.["classList"]['contains']("is-audio-clip-mode");
  }
  function _0xfae612(_0x2eefe0 = _0x290ad6['getState']()) {
    return !!_0x2eefe0["matting"]?.['active'] || !!_0x2eefe0['annotate']?.["active"] || !!_0x2eefe0["videoClip"]?.["active"] || !!_0x2eefe0["videoKeying"]?.["active"] || _0x5e3302();
  }
  function _0x55049e(_0x45e2b9 = _0x290ad6["getState"]()) {
    const _0x4c1547 = Array["isArray"](_0x45e2b9?.["selectedNodeIds"]) ? _0x45e2b9["selectedNodeIds"] : [];
    if (_0x4c1547["length"] !== 0x1) {
      return ![];
    }
    const _0x254f51 = _0x4c1547[0x0];
    const _0x1674ed = _0x45e2b9?.["nodes"]?.[_0x254f51] || null;
    if (_0x1674ed?.["type"] !== "media-clip" || _0x1674ed?.["mediaClip"]?.['expanded'] !== !![]) {
      return ![];
    }
    const _0x31cc6e = typeof CustomEvent === "function" ? new CustomEvent(MEDIA_CLIP_DELETE_MATERIAL_EVENT, {
      'detail': {
        'nodeId': _0x254f51
      }
    }) : {
      'type': MEDIA_CLIP_DELETE_MATERIAL_EVENT,
      'detail': {
        'nodeId': _0x254f51
      }
    };
    window["dispatchEvent"]?.(_0x31cc6e);
    return !![];
  }
  function _0x5f078e() {
    let _0x5d5d9e = ![];
    (_0x5e3302() || _0x23493d['active']) && (_0x23493d["exit"]?.({
      'silent': !![]
    }), _0x5d5d9e = !![]);
    const _0xc908f3 = _0x290ad6["getState"]();
    _0xc908f3["annotate"]?.["active"] && (_0x1a064a['exit']?.({
      'silent': !![]
    }), _0x5d5d9e = !![]);
    _0xc908f3["matting"]?.['active'] && (_0x42b2c4['exit']?.({
      'silent': !![]
    }), _0x5d5d9e = !![]);
    return _0x5d5d9e;
  }
  function _0x1232a3(_0x534128) {
    const _0xd7b673 = _0x1b10b2[_0x534128];
    if (!_0xd7b673) {
      return ![];
    }
    const _0x3b2a33 = _0x290ad6["getState"]();
    if (_0xfae612(_0x3b2a33)) {
      return ![];
    }
    const {
      selectedNodeIds: _0x75ca0c,
      nodes: _0x12e595
    } = _0x3b2a33;
    if (!Array["isArray"](_0x75ca0c) || _0x75ca0c['length'] !== 0x1) {
      return ![];
    }
    const _0x19d8a2 = _0x75ca0c[0x0];
    const _0x232ada = _0x12e595?.[_0x19d8a2];
    if (!_0x232ada || !_0xd7b673['nodeTypes']['includes'](_0x232ada['type'])) {
      return ![];
    }
    const _0x2b9ac3 = document['getElementById'](_0x19d8a2);
    if (!_0x2b9ac3) {
      return ![];
    }
    const _0x41a079 = _0x2b9ac3['querySelector'](_0xd7b673['selector']);
    if (!_0x41a079) {
      return ![];
    }
    if (_0x534128['startsWith']("audio-tool-")) {
      try {
        const _0x55e4fd = new PointerEvent("pointerdown", {
          'bubbles': !![],
          'cancelable': !![],
          'pointerType': "mouse",
          'isPrimary': !![],
          'button': 0x0
        });
        _0x41a079["dispatchEvent"](_0x55e4fd);
        return !![];
      } catch {
        const _0x27a7a8 = new MouseEvent("mousedown", {
          'bubbles': !![],
          'cancelable': !![],
          'button': 0x0
        });
        _0x41a079["dispatchEvent"](_0x27a7a8);
        return !![];
      }
    }
    if (_0xd7b673["scene"]) {
      _0x41a079["dispatchEvent"](new CustomEvent("image-local-edit-open", {
        'detail': {
          'scene': _0xd7b673["scene"]
        }
      }));
      return !![];
    }
    if (typeof _0x41a079["click"] !== 'function') {
      return ![];
    }
    _0x41a079["click"]();
    return !![];
  }
  function _0x20d2f9() {
    const _0x1e8961 = _0x290ad6["getState"]();
    if (_0xfae612(_0x1e8961)) {
      return ![];
    }
    if (_0x1e8961?.['ui']?.["promptAttachmentButtonHidden"] === !![]) {
      return ![];
    }
    const _0x32bd4c = Array['isArray'](_0x1e8961?.["selectedNodeIds"]) ? _0x1e8961["selectedNodeIds"] : [];
    if (_0x32bd4c['length'] !== 0x1) {
      return ![];
    }
    const _0xce115 = document['getElementById'](_0x32bd4c[0x0]);
    const _0x5dcf9b = _0xce115?.["querySelector"]?.(".prompt-attachment-btn");
    if (!_0x5dcf9b || typeof _0x5dcf9b["click"] !== "function") {
      return ![];
    }
    _0x5dcf9b["click"]();
    return !![];
  }
  function _0x37c492() {
    const _0xda9d3d = _0x290ad6['getStateRaw'] ? _0x290ad6["getStateRaw"]() : _0x290ad6["getState"]();
    const _0x4f9d80 = Array["isArray"](_0xda9d3d?.['selectedNodeIds']) ? _0xda9d3d["selectedNodeIds"] : [];
    if (_0x4f9d80['length'] !== 0x1) {
      return null;
    }
    const _0x2c7f55 = _0x4f9d80[0x0];
    const _0x42523e = _0xda9d3d?.["nodes"]?.[_0x2c7f55];
    if (!_0x42523e || _0x42523e["type"] !== 'panorama-scene' && _0x42523e["type"] !== "panorama-360") {
      return null;
    }
    const _0x489995 = _0x42523e["type"] === "panorama-360" ? _0x42523e['panorama360Node'] || null : _0x42523e['sceneNode'] || null;
    return {
      'nodeId': _0x2c7f55,
      'node': _0x42523e,
      'sceneState': _0x489995,
      'supportsCamera': _0x42523e["type"] === 'panorama-scene'
    };
  }
  function _0x3488e8({
    nodeId: _0x4829a3,
    mode: _0x7db564,
    slot: _0x441a89
  }) {
    const _0x54b734 = Number(_0x441a89);
    if (!Number['isInteger'](_0x54b734) || _0x54b734 < 0x1 || _0x54b734 > 0xa) {
      return;
    }
    window['dispatchEvent'](new CustomEvent("panorama-scene:camera-shortcut", {
      'detail': {
        'nodeId': _0x4829a3,
        'mode': _0x7db564 === "save" ? "save" : "activate",
        'slot': _0x54b734
      }
    }));
  }
  function _0x329853({
    nodeId: _0x5e9b06
  }) {
    const _0x3ba0d4 = String(_0x5e9b06 || '')["trim"]();
    if (!_0x3ba0d4) {
      return;
    }
    window["dispatchEvent"](new CustomEvent("panorama-scene:capture-shortcut", {
      'detail': {
        'nodeId': _0x3ba0d4
      }
    }));
  }
  function _0x5990bb(_0x59b3db) {
    const _0xac64b = String(_0x59b3db?.["nodeId"] || '')["trim"]();
    if (!_0xac64b) {
      return;
    }
    const _0x2cd76f = _0x290ad6["getStateRaw"] ? _0x290ad6["getStateRaw"]() : _0x290ad6["getState"]();
    const _0x5f5396 = _0x2cd76f?.["nodes"]?.[_0xac64b];
    if (!_0x5f5396) {
      return;
    }
    if (_0x5f5396["type"] !== "panorama-scene" && _0x5f5396["type"] !== 'panorama-360') {
      return;
    }
    _0x290ad6["setSelectedNodes"]?.([_0xac64b]);
    setPanoramaSceneEditing({
      'nodeId': _0xac64b,
      'isEditing': !![],
      'storeInstance': _0x290ad6
    });
  }
  function _0x3abcd2() {
    const _0x42a591 = (_0x53f352, _0xf4a926 = 0x320) => {
      const _0x11e633 = _0x290ad6["getState"]();
      const _0x5d4c76 = _0x11e633?.["nodes"]?.[_0x53f352];
      if (!_0x5d4c76 || _0x5d4c76["type"] !== "comment-note") {
        return ![];
      }
      const _0x2b5460 = computeNodesWorldBounds(_0x11e633?.["nodes"] || {}, [_0x53f352]);
      const _0xc7e8a0 = getBrowserViewportRect({
        'windowObject': typeof window !== "undefined" ? window : undefined,
        'containerEl': canvasViewportEl || _0x15b9f2,
        'containerCoordinates': !!canvasViewportEl
      });
      const {
        viewportAlignX: _0x37625b,
        viewportAlignY: _0x23bc98
      } = readCommentNoteJumpFocusPref();
      const _0x19e395 = computeViewportForWorldBounds(_0x2b5460, _0xc7e8a0, {
        'fixedZoom': resolveJumpZoom(_0x5d4c76?.['jumpShortcut']?.['zoomPercent']),
        'worldAlignX': COMMENT_NOTE_JUMP_WORLD_ALIGN,
        'worldAlignY': COMMENT_NOTE_JUMP_WORLD_ALIGN,
        'viewportAlignX': _0x37625b,
        'viewportAlignY': _0x23bc98
      });
      if (!_0x19e395) {
        return ![];
      }
      _0x12cc4c?.("comment-note-jump");
      const _0x1f8621 = _0x290ad6['getStateRaw'] ? _0x290ad6["getStateRaw"]() : _0x290ad6['getState']();
      const _0x3f62bb = _0x1f8621?.['viewport'] || {
        'x': 0x0,
        'y': 0x0,
        'zoom': 0x1
      };
      if (typeof _0x3de2c0 === "function") {
        _0x3de2c0(_0x3f62bb['x'], _0x3f62bb['y'], _0x3f62bb["zoom"], _0x19e395['x'], _0x19e395['y'], _0x19e395['zoom'], _0xf4a926);
        return !![];
      }
      _0x290ad6["updateViewport"]?.(_0x19e395['x'], _0x19e395['y'], _0x19e395['zoom']);
      _0x290ad6['markViewportPersist']?.();
      return !![];
    };
    _0x35b9dc(_0x2c3b4a => {
      if (typeof _0x2c3b4a === "string" && _0x2c3b4a["startsWith"]("comment-note-jump::")) {
        const _0x1f7119 = _0x2c3b4a["slice"]("comment-note-jump::"['length']);
        _0x42a591(_0x1f7119, 0x320);
        return;
      }
      const _0x5d6210 = _0x37c492();
      switch (_0x2c3b4a) {
        case "panorama-scene-tool-toggle-mouse":
          {
            if (!_0x5d6210?.["sceneState"]?.['ui']?.["isEditing"]) {
              break;
            }
            const _0x3296ad = String(_0x5d6210["sceneState"]?.['ui']?.['activeTool'] || '')["trim"]();
            const _0x4deff4 = String(_0x5d6210["sceneState"]?.['ui']?.["mouseTool"] || _0x5d6210["sceneState"]?.['ui']?.['activeTool'] || '')["trim"]();
            const _0x5a3f15 = _0x3296ad === "move" || _0x3296ad === "rotate" || _0x3296ad === "scale";
            const _0x8aebc7 = _0x5a3f15 ? "navigate" : _0x4deff4 === "box-select" ? "navigate" : "box-select";
            setPanoramaSceneTool({
              'nodeId': _0x5d6210["nodeId"],
              'tool': _0x8aebc7
            });
            break;
          }
        case "panorama-scene-tool-move":
        case 'panorama-scene-tool-scale':
        case 'panorama-scene-tool-rotate':
          {
            if (!_0x5d6210?.['sceneState']?.['ui']?.["isEditing"]) {
              break;
            }
            const _0x1af1fc = _0x2c3b4a === "panorama-scene-tool-move" ? "move" : _0x2c3b4a === "panorama-scene-tool-scale" ? "scale" : "rotate";
            setPanoramaSceneTool({
              'nodeId': _0x5d6210["nodeId"],
              'tool': _0x1af1fc
            });
            break;
          }
        case "panorama-scene-reset-view":
          {
            if (!_0x5d6210?.["sceneState"]?.['ui']?.["isEditing"]) {
              break;
            }
            resetPanoramaSceneView({
              'nodeId': _0x5d6210['nodeId']
            });
            break;
          }
        case "panorama-scene-capture":
          {
            if (!_0x5d6210?.["sceneState"]?.['ui']?.["isEditing"]) {
              break;
            }
            _0x329853({
              'nodeId': _0x5d6210['nodeId']
            });
            break;
          }
        case "panorama-scene-camera-create":
          {
            if (!_0x5d6210?.["sceneState"]?.['ui']?.['isEditing'] || _0x5d6210?.["supportsCamera"] !== !![]) {
              break;
            }
            _0x1232a3(_0x2c3b4a);
            break;
          }
        case 'ms-sync-video-play':
        case "ms-sync-video-loop-play":
          {
            const _0x56ad14 = _0x290ad6["getState"]();
            const _0x31dd48 = Array["isArray"](_0x56ad14?.["selectedNodeIds"]) ? _0x56ad14["selectedNodeIds"] : [];
            _0x31dd48["length"] >= 0x2 && void _0x411974({
              'selectedIds': _0x31dd48,
              'state': _0x56ad14,
              'loop': _0x2c3b4a === "ms-sync-video-loop-play"
            });
            break;
          }
        case 'image-tool-matting':
        case "image-tool-repaint":
        case "image-tool-erase":
        case "image-tool-hd":
        case "image-tool-expand":
        case "image-tool-auto-subject":
        case 'image-tool-multigrid':
        case "image-tool-multiangle":
        case "image-tool-annotate":
        case "image-tool-crop":
        case 'image-tool-fullscreen':
        case 'image-tool-download':
        case 'video-tool-clip':
        case 'video-tool-separate-av':
        case "video-tool-capture-frame":
        case "video-tool-keying":
        case "video-tool-hd":
        case 'video-tool-fullscreen':
        case "video-tool-download":
        case "audio-tool-clip":
        case "audio-tool-speed":
        case 'audio-tool-download':
        case "clip-tool-crop":
        case "text-tool-copy":
        case 'text-tool-fullscreen':
          _0x1232a3(_0x2c3b4a);
          break;
        case "delete":
          {
            const _0x43a818 = _0x290ad6["getState"]();
            if (_0x43a818["annotate"]?.["active"]) {
              _0x1a064a?.["deleteSelectedTextCommand"]?.();
              break;
            }
            if (_0x43a818["matting"]?.["active"]) {
              break;
            }
            if (_0x5d6210?.["sceneState"]?.['ui']?.["isEditing"]) {
              deleteSelectedPanoramaSceneObject({
                'nodeId': _0x5d6210["nodeId"]
              });
              break;
            }
            if (_0x55049e(_0x43a818)) {
              break;
            }
            const _0x3ac92b = _0x43a818["selectedNodeIds"];
            _0x3ac92b["length"] > 0x0 && _0x22cf2d("delete_nodes", {
              'ids': [..._0x3ac92b]
            });
            break;
          }
        case "undo":
          {
            const _0x58fd51 = _0x290ad6["getState"]();
            if (_0x58fd51["annotate"]?.['active']) {
              _0x1a064a["_undo"]?.["call"](_0x1a064a);
            } else {
              _0x58fd51["matting"]?.["active"] ? _0x42b2c4["_undo"]?.["call"](_0x42b2c4) : (_0xecc494(), _0x5d6210?.["sceneState"]?.['ui']?.["isEditing"] && _0x5990bb(_0x5d6210));
            }
            break;
          }
        case "redo":
          {
            const _0x189ddd = _0x290ad6['getState']();
            if (_0x189ddd["annotate"]?.["active"]) {
              _0x1a064a["_redo"]?.["call"](_0x1a064a);
            } else {
              _0x189ddd["matting"]?.["active"] ? _0x42b2c4["_redo"]?.['call'](_0x42b2c4) : (_0xb8cfe0(), _0x5d6210?.["sceneState"]?.['ui']?.["isEditing"] && _0x5990bb(_0x5d6210));
            }
            break;
          }
        case "copy":
          _0x22cf2d("copy");
          break;
        case 'copy-media':
          {
            const _0x3e8352 = _0x290ad6["getState"]()["selectedNodeIds"];
            if (!Array["isArray"](_0x3e8352) || _0x3e8352['length'] !== 0x1) {
              window["showToast"]?.(t("appBusinessEvents.copyMedia.selectSingleImageNode"), "warn");
              break;
            }
            const _0x3b9e2e = _0x290ad6['getState']()["nodes"]?.[_0x3e8352[0x0]];
            const _0x1d5ab5 = _0x3b9e2e && (_0x3b9e2e['type'] === 'source-image' || _0x3b9e2e['type'] === "ai-image" || _0x3b9e2e["type"] === 'storyboard');
            if (!_0x1d5ab5) {
              window["showToast"]?.(t("appBusinessEvents.copyMedia.selectSingleImageNode"), 'warn');
              break;
            }
            void copyNodeMediaToSystemClipboard(_0x3b9e2e)['then'](_0x2a1f88 => {
              if (_0x2a1f88?.['ok']) {
                markSystemClipboardWrite({
                  'mediaType': String(_0x2a1f88?.["mimeType"] || "image/png")
                });
                window["showToast"]?.(t("appBusinessEvents.copyMedia.copied"), 'success');
                return;
              }
              if (_0x2a1f88?.["reason"] === "no-media") {
                window['showToast']?.(t("appBusinessEvents.copyMedia.noMedia"), 'warn');
                return;
              }
              if (_0x2a1f88?.["reason"] === "not-supported") {
                window["showToast"]?.(t("appBusinessEvents.copyMedia.clipboardUnsupported"), "warn");
                return;
              }
              window["showToast"]?.(t("appBusinessEvents.copyMedia.copyFailed"), "error");
            })["catch"](() => {
              window['showToast']?.(t("appBusinessEvents.copyMedia.copyFailed"), "error");
            });
            break;
          }
        case "canvas-screenshot":
          {
            void startCanvasScreenshot({
              'createImageNodeFromBlob': _0x223b0a,
              'showToast': (..._0x46cb2e) => window['showToast']?.(..._0x46cb2e)
            });
            break;
          }
        case "global-capture-launcher":
        case "global-text-preset":
          break;
        case "cut":
          {
            const _0x2a258d = _0x290ad6["getState"]()["selectedNodeIds"];
            if (Array["isArray"](_0x2a258d) && _0x2a258d["length"] > 0x0) {
              const _0x7712d5 = [..._0x2a258d];
              _0x22cf2d("copy", {
                'ids': _0x7712d5
              });
              _0x22cf2d("delete_nodes", {
                'ids': _0x7712d5
              });
            }
            break;
          }
        case 'paste':
          _0x14fe31();
          break;
        case 'group':
          _0x22cf2d("create_group");
          break;
        case 'align-feature':
        case "align-feature-toggle":
        case 'align-feature-hold-start':
        case "align-feature-hold-end":
          {
            const _0xb66f7e = _0x290ad6["getState"]();
            if (_0xb66f7e?.['ui']?.['alignFeatureEnabled'] === ![]) {
              break;
            }
            if (_0x2c3b4a === "align-feature-hold-end") {
              _0x290ad6["setAlignPanelVisible"](![]);
              break;
            }
            const _0x5e89a4 = Array["isArray"](_0xb66f7e?.["selectedNodeIds"]) ? _0xb66f7e["selectedNodeIds"] : [];
            if (_0x5e89a4["length"] < 0x2) {
              break;
            }
            const _0x1b6216 = getAlignableSelectionNodes(_0xb66f7e?.["nodes"] || {}, _0x5e89a4);
            if (_0x1b6216["length"] < 0x2) {
              break;
            }
            if (_0x2c3b4a === 'align-feature-hold-start') {
              const _0x182b63 = _0x58d690(_0xb66f7e);
              _0x290ad6["setAlignPanelAnchorWorld"]?.(_0x182b63);
              _0x290ad6["setAlignPanelVisible"](!![]);
              break;
            }
            if (_0x2c3b4a === "align-feature-toggle" || _0x2c3b4a === "align-feature") {
              const _0x58b9a2 = _0xb66f7e?.['ui']?.['alignPanelVisible'] === !![];
              if (_0x58b9a2) {
                _0x290ad6["setAlignPanelVisible"](![]);
              } else {
                const _0x20a817 = _0x58d690(_0xb66f7e);
                _0x290ad6["setAlignPanelAnchorWorld"]?.(_0x20a817);
                _0x290ad6["setAlignPanelVisible"](!![]);
              }
            }
            break;
          }
        case "select-all":
          {
            _0x22cf2d('select_all');
            break;
          }
        case 'fit-all':
          {
            if (_0x5d6210?.["sceneState"]?.['ui']?.['isEditing']) {
              focusPanoramaSceneSelection({
                'nodeId': _0x5d6210["nodeId"]
              });
              break;
            }
            const {
              nodes: _0x36976f,
              selectedNodeIds: _0x20d9df
            } = _0x290ad6["getState"]();
            const _0x378a43 = _0x20d9df && _0x20d9df['length'] > 0x0 ? _0x20d9df['filter'](_0x4cae29 => _0x36976f[_0x4cae29]) : Object["keys"](_0x36976f || {});
            if (_0x378a43["length"] === 0x0) {
              break;
            }
            _0x63ede4?.(_0x378a43, 0x50, 0x320);
            break;
          }
        case "minimap":
          {
            const _0x4f2b7b = document["getElementById"]("minimapWrapper");
            const _0x377ab6 = document["getElementById"]("btnMinimap");
            if (_0x4f2b7b) {
              _0x4f2b7b['classList']['toggle']("open");
              if (_0x377ab6) {
                _0x377ab6['classList']["toggle"]("active", _0x4f2b7b['classList']['contains']("open"));
              }
            }
            break;
          }
        case "zoom-in":
        case "zoom-out":
          {
            _0x12cc4c?.("shortcut-zoom");
            const {
              viewport: _0x2a7eb4
            } = _0x290ad6['getState']();
            const _0x133fa9 = _0x2c3b4a === 'zoom-in' ? 1.1 : 0.9;
            const _0x211684 = clampCanvasZoom(_0x2a7eb4['zoom'] * _0x133fa9);
            const _0x42d2d6 = getViewportScreenOrigin(_0x2a7eb4);
            const _0x3831f0 = Math['max'](0x0, window["innerWidth"] - _0x42d2d6['x']) / 0x2;
            const _0x200c90 = Math['max'](0x0, window["innerHeight"] - _0x42d2d6['y']) / 0x2;
            const _0x2815c0 = _0x3831f0 - (_0x3831f0 - _0x2a7eb4['x']) * (_0x211684 / _0x2a7eb4['zoom']);
            const _0x129e95 = _0x200c90 - (_0x200c90 - _0x2a7eb4['y']) * (_0x211684 / _0x2a7eb4["zoom"]);
            _0x290ad6["updateViewport"](_0x2815c0, _0x129e95, _0x211684);
            break;
          }
        case 'snap-guides':
          {
            const _0xe23a9f = _0x290ad6["getState"]();
            const _0x75824d = !(_0xe23a9f?.['ui']?.["snapGuidesEnabled"] !== ![]);
            _0x290ad6["setSnapGuidesEnabled"](_0x75824d);
            window['v2SnapGuides'] = _0x75824d;
            if (!_0x75824d) {
              window["_clearSnapGuideLines"]?.();
            }
            window["dispatchEvent"](new CustomEvent('v2-snap-guides-changed', {
              'detail': {
                'enabled': _0x75824d
              }
            }));
            window["showToast"]?.(_0x75824d ? t("appBusinessEvents.toggles.snapGuides.on") : t("appBusinessEvents.toggles.snapGuides.off"));
            break;
          }
        case "snap-grid":
          {
            const _0x12cf6e = applySnapGridEnabled(!readSnapGridEnabled());
            window["showToast"]?.(_0x12cf6e ? t("appBusinessEvents.toggles.snapGrid.on") : t("appBusinessEvents.toggles.snapGrid.off"));
            break;
          }
        case "grid-dots":
          {
            const _0x564f53 = setGridDotsPref(!readGridDotsPref());
            window["showToast"]?.(_0x564f53 ? t("appBusinessEvents.toggles.gridDots.on") : t("appBusinessEvents.toggles.gridDots.off"));
            break;
          }
        case "toggle-connection-lines":
          {
            const _0x16ab9b = _0x290ad6["getState"]();
            const _0x193d5b = !(_0x16ab9b?.['ui']?.["connectionLinesVisible"] !== ![]);
            _0x290ad6["setConnectionLinesVisible"](_0x193d5b);
            window["dispatchEvent"](new CustomEvent("v2-connection-lines-visibility-changed", {
              'detail': {
                'visible': _0x193d5b
              }
            }));
            window["showToast"]?.(_0x193d5b ? t("appBusinessEvents.toggles.connectionLines.on") : t('appBusinessEvents.toggles.connectionLines.off'));
            break;
          }
        case "toggle-selection-related-highlight":
          {
            const _0x208d77 = _0x290ad6["getState"]();
            const _0x232496 = !(_0x208d77?.['ui']?.["selectionRelatedHighlightEnabled"] !== ![]);
            setSelectionRelatedHighlightPref(_0x232496, _0x290ad6);
            window["showToast"]?.(_0x232496 ? t("appBusinessEvents.toggles.selectionRelatedHighlight.on") : t("appBusinessEvents.toggles.selectionRelatedHighlight.off"));
            break;
          }
        case "toggle-title-follows-zoom":
          {
            const _0x1e2162 = _0x290ad6["getState"]();
            const _0x49c904 = !(_0x1e2162?.['ui']?.["titleFollowsCanvasZoom"] === !![]);
            setTitleFollowsCanvasZoomPref(_0x49c904, _0x290ad6);
            window["showToast"]?.(_0x49c904 ? t("appBusinessEvents.toggles.titleFollowsZoom.on") : t("appBusinessEvents.toggles.titleFollowsZoom.off"));
            break;
          }
        case "toggle-media-node-resize":
          {
            const _0x5de991 = _0x290ad6['getState']();
            const _0xcb1305 = !(_0x5de991?.['ui']?.["imageVideoNodeResizeEnabled"] === !![]);
            setImageVideoNodeResizePref(_0xcb1305, _0x290ad6);
            window["showToast"]?.(_0xcb1305 ? t("appBusinessEvents.toggles.mediaNodeResize.on") : t("appBusinessEvents.toggles.mediaNodeResize.off"));
            break;
          }
        case "toggle-prompt-box-resize":
          {
            const _0x4b88ec = _0x290ad6["getState"]();
            const _0x42f6e6 = !(_0x4b88ec?.['ui']?.["promptBoxResizeEnabled"] !== ![]);
            setPromptBoxResizePref(_0x42f6e6, _0x290ad6);
            window["showToast"]?.(_0x42f6e6 ? t('appBusinessEvents.toggles.promptBoxResize.on') : t("appBusinessEvents.toggles.promptBoxResize.off"));
            break;
          }
        case 'toggle-node-avoid-overlap':
          {
            const _0xbd9863 = !(window['v2NodeAvoidOverlap'] !== ![]);
            setNodeAvoidOverlapPref(_0xbd9863);
            window["showToast"]?.(_0xbd9863 ? t('appBusinessEvents.toggles.nodeAvoidOverlap.on') : t('appBusinessEvents.toggles.nodeAvoidOverlap.off'));
            break;
          }
        case "reset-media-size":
          {
            const _0x109044 = _0x290ad6["getState"]();
            if (_0xfae612(_0x109044)) {
              break;
            }
            const _0x5cc19c = Array['isArray'](_0x109044?.["selectedNodeIds"]) ? _0x109044["selectedNodeIds"] : [];
            if (_0x5cc19c["length"] === 0x0) {
              break;
            }
            const _0x35e294 = _0x5cc19c["some"](_0x90fe4c => {
              const _0x2f05f3 = _0x109044?.["nodes"]?.[_0x90fe4c]?.["type"];
              return _0x2f05f3 === "source-image" || _0x2f05f3 === "ai-image" || _0x2f05f3 === "source-video" || _0x2f05f3 === "ai-video";
            });
            if (!_0x35e294) {
              break;
            }
            _0x22cf2d('reset_source_media_size', {
              'ids': _0x5cc19c
            });
            break;
          }
        case "add-reference":
          _0x20d2f9();
          break;
        case "create-text":
          if (_0x26e0ae()["matting"]?.["active"]) {
            break;
          }
          {
            const {
              width: _0x33d472,
              height: _0x3a3a41
            } = _0x2fc82a("source-text");
            _0x570927("source-text", _0x33d472, _0x3a3a41, t("appBusinessEvents.nodeDefaults.sourceText"));
          }
          break;
        case "create-comment-note":
          {
            if (_0x26e0ae()['matting']?.["active"]) {
              break;
            }
            const {
              width: _0x4ff9d2,
              height: _0x3d99d8
            } = _0x2fc82a("comment-note");
            _0x570927("comment-note", _0x4ff9d2, _0x3d99d8, '');
            break;
          }
        case "create-ai-text":
          if (_0x26e0ae()["matting"]?.["active"]) {
            break;
          }
          {
            const _0x47f4e3 = typeof _0x345756 === "function" ? _0x345756("ai-text") : {
              'width': 0x12c,
              'height': 0x12c
            };
            _0x570927("ai-text", _0x47f4e3["width"], _0x47f4e3["height"], t("appBusinessEvents.nodeDefaults.aiText"));
          }
          break;
        case "create-ai-image":
          if (_0x26e0ae()["matting"]?.["active"]) {
            break;
          }
          {
            const _0x553544 = typeof _0x345756 === "function" ? _0x345756("ai-image") : {
              'width': 0x120,
              'height': 0x120
            };
            _0x570927('ai-image', _0x553544["width"], _0x553544["height"], t("appBusinessEvents.nodeDefaults.aiImage"));
          }
          break;
        case "create-ai-video":
          if (_0x26e0ae()["matting"]?.["active"]) {
            break;
          }
          {
            const _0x5bd5eb = typeof _0x345756 === "function" ? _0x345756('ai-video') : {
              'width': 0x120,
              'height': 0x120
            };
            _0x570927('ai-video', _0x5bd5eb["width"], _0x5bd5eb["height"], t("appBusinessEvents.nodeDefaults.aiVideo"));
          }
          break;
        case "create-ai-audio":
          if (_0x26e0ae()["matting"]?.["active"]) {
            break;
          }
          {
            const _0x446ac0 = typeof _0x345756 === "function" ? _0x345756("ai-audio") : {
              'width': 0x120,
              'height': 0x120
            };
            _0x570927('ai-audio', _0x446ac0["width"], _0x446ac0['height'], t("appBusinessEvents.nodeDefaults.aiAudio"));
          }
          break;
        case "upload-file":
          {
            const _0x2ac9e1 = _0x290ad6["getState"]();
            if (_0xfae612(_0x2ac9e1) || _0x5d6210?.["sceneState"]?.['ui']?.["isEditing"]) {
              break;
            }
            _0x38082a?.();
            break;
          }
        case "create-scene-detection":
          if (_0x26e0ae()["matting"]?.["active"]) {
            break;
          }
          _0x570927("scene-detection", 0x190, 0x1f4, t("appBusinessEvents.nodeDefaults.sceneDetection"));
          break;
        case 'save':
          typeof window['_v2SaveProjectFromShortcut'] === 'function' ? window['_v2SaveProjectFromShortcut']() : window['_openSaveDialog']?.();
          break;
        case "open-settings":
          {
            toggleSettingsPanel();
            break;
          }
        case "toggle-agent":
          {
            _0x567c87?.();
            break;
          }
        case "open-canvas-projects":
          toggleSidebarSubmenu('canvas-project');
          break;
        case "open-assets":
          toggleSidebarSubmenu("assets");
          break;
        case "open-workflows":
          SAVED_WORKFLOW_LIBRARY_ENTRY_ENABLED && toggleSidebarSubmenu("workflows");
          break;
        case "open-node-manager":
          toggleSidebarSubmenu("node-manager");
          break;
        case 'open-files':
          toggleSidebarSubmenu("files");
          break;
        case "open-task-center":
          toggleSidebarSubmenu("tasks");
          break;
        case "open-custom-ai-app":
          window["dispatchEvent"](new CustomEvent("custom-ai-app:toggle", {
            'detail': {
              'source': 'shortcut'
            }
          }));
          break;
        case "editor-tool-brush":
        case "editor-tool-rect":
        case "editor-tool-eraser":
        case 'editor-tool-bucket':
        case 'editor-tool-text':
          {
            const _0x15e4d5 = _0x290ad6["getState"]();
            const _0x1d0d45 = _0x2c3b4a === "editor-tool-rect" ? 'rect' : _0x2c3b4a === "editor-tool-eraser" ? "eraser" : _0x2c3b4a === "editor-tool-bucket" ? "bucket" : _0x2c3b4a === "editor-tool-text" ? "text" : "brush";
            if (_0x15e4d5['annotate']?.['active']) {
              _0x1a064a['_setTool'] ? _0x1a064a["_setTool"]["call"](_0x1a064a, _0x1d0d45) : _0x290ad6["setAnnotateState"]({
                'tool': _0x1d0d45
              });
            } else {
              if (_0x15e4d5["matting"]?.['active']) {
                if (_0x1d0d45 === 'rect') {
                  break;
                }
                if (document["activeElement"]?.['tagName'] === 'INPUT') {
                  document['activeElement']["blur"]();
                }
                _0x42b2c4['_switchTool']?.["call"](_0x42b2c4, _0x1d0d45);
              }
            }
            break;
          }
        case "editor-clear":
          {
            const _0x2fb384 = _0x290ad6['getState']();
            if (_0x2fb384["annotate"]?.["active"]) {
              _0x1a064a["_clear"]?.["call"](_0x1a064a);
            } else {
              _0x2fb384["matting"]?.["active"] && _0x42b2c4["_clear"]?.["call"](_0x42b2c4);
            }
            break;
          }
        case "escape-all":
          {
            if (_0x5f078e()) {
              break;
            }
            if (_0x5d6210?.['sceneState']?.['ui']?.['isEditing']) {
              setPanoramaSceneEditing({
                'nodeId': _0x5d6210["nodeId"],
                'isEditing': ![]
              });
              break;
            }
            const {
              nodes: _0x284a88
            } = _0x290ad6["getState"]();
            let _0xb27a63 = ![];
            for (const _0x301a79 in _0x284a88) {
              _0x284a88[_0x301a79]['type'] === "storyboard" && _0x284a88[_0x301a79]['isEditing'] && (_0x290ad6["updateNodeData"](_0x301a79, {
                'isEditing': ![]
              }), _0xb27a63 = !![]);
            }
            if (_0xb27a63) {
              _0x4a286b();
            }
            const _0x5d4083 = _0x290ad6["getState"]()["pickConnectMode"];
            if (_0x5d4083 && _0x5d4083['active']) {
              _0x290ad6['setPickConnectMode']({
                'active': ![]
              });
            }
            _0x2f99cd();
            _0x1a064a["exit"]?.({
              'silent': !![]
            });
            _0x42b2c4["exit"]?.({
              'silent': !![]
            });
            document["getElementById"]("avatarMenu")?.['classList']["remove"]("open");
            document["querySelector"](".canvas-proj-dropdown")?.["classList"]['remove']("open");
            document["getElementById"]('aboutOverlay') && (document['getElementById']("aboutOverlay")["style"]["display"] = "none");
            document["getElementById"]("v2PickerOverlay")?.["remove"]();
            document["querySelector"]('.v2-canvas-ctx-menu')?.['remove']();
            document['querySelector'](".v2-node-picker")?.['remove']();
            document["querySelector"](".v2-quote-menu")?.["remove"]();
            document["getElementById"]('nodeMenu') && (document["getElementById"]("nodeMenu")['style']["display"] = "none");
            document["getElementById"]('nodeModal') && (document["getElementById"]('nodeModal')["style"]['display'] = 'none');
            document["getElementById"]("imageViewerOverlay") && (document['getElementById']('imageViewerOverlay')["style"]['display'] = "none");
            _0x290ad6["setAlignPanelVisible"](![]);
            _0x290ad6["clearSelection"]();
            break;
          }
        case "panorama-scene-camera-1":
        case "panorama-scene-camera-2":
        case "panorama-scene-camera-3":
        case "panorama-scene-camera-4":
        case 'panorama-scene-camera-5':
        case 'panorama-scene-camera-6':
        case "panorama-scene-camera-7":
        case "panorama-scene-camera-8":
        case "panorama-scene-camera-9":
        case 'panorama-scene-camera-0':
          {
            if (!_0x5d6210?.["sceneState"]?.['ui']?.["isEditing"] || _0x5d6210?.["supportsCamera"] !== !![]) {
              break;
            }
            const _0x1918fa = _0x2c3b4a['slice'](-0x1);
            const _0x11b5d6 = _0x1918fa === '0' ? 0xa : Number(_0x1918fa);
            _0x3488e8({
              'nodeId': _0x5d6210["nodeId"],
              'mode': "activate",
              'slot': _0x11b5d6
            });
            break;
          }
        case "panorama-scene-camera-save-1":
        case "panorama-scene-camera-save-2":
        case "panorama-scene-camera-save-3":
        case "panorama-scene-camera-save-4":
        case "panorama-scene-camera-save-5":
        case "panorama-scene-camera-save-6":
        case 'panorama-scene-camera-save-7':
        case "panorama-scene-camera-save-8":
        case "panorama-scene-camera-save-9":
        case "panorama-scene-camera-save-0":
          {
            if (!_0x5d6210?.["sceneState"]?.['ui']?.["isEditing"] || _0x5d6210?.["supportsCamera"] !== !![]) {
              break;
            }
            const _0x3e24fe = _0x2c3b4a['slice'](-0x1);
            const _0x1966a7 = _0x3e24fe === '0' ? 0xa : Number(_0x3e24fe);
            _0x3488e8({
              'nodeId': _0x5d6210["nodeId"],
              'mode': "save",
              'slot': _0x1966a7
            });
            break;
          }
      }
    });
  }
  function _0x277ce3() {
    window['addEventListener']('v2:canvas-paste-request', _0x253a00 => {
      _0x14fe31(_0x253a00?.["detail"] || {});
    });
  }
  function _0x51f4ac() {
    _0x277ce3();
    _0x3abcd2();
    _0x3f91f6?.(_0x15b9f2);
  }
  return {
    'bindAll': _0x51f4ac,
    'triggerSelectedNodeToolbarAction': _0x1232a3,
    'triggerSelectedNodeReferenceButton': _0x20d2f9,
    'exitActiveFeatureModes': _0x5f078e
  };
}