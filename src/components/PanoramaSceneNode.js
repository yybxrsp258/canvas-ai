import a479_0x4b5d07 from '../core/stores/appStore.js';
import { addPanoramaSceneCamera, addPanoramaSceneCameraKeyframe, addPanoramaSceneCube, addPanoramaSceneMannequin, addPanoramaSceneMannequinGrid, capturePanoramaSceneViewport, applyPanoramaSceneMannequinPose, clearPanoramaSceneSelection, deletePanoramaSceneCamera, deletePanoramaSceneCameraKeyframe, deleteSelectedPanoramaSceneObject, focusPanoramaSceneSelection, resetPanoramaSceneView, setPanoramaSceneCollapsed, setPanoramaSceneCaptureMode, setPanoramaSceneEditing, setPanoramaSceneEnvironmentMode, setPanoramaSceneGridPlacement, setPanoramaSceneInteractionOptions, setPanoramaSceneMode, setPanoramaSceneSelection, setPanoramaSceneSelectionBatch, setPanoramaSceneSelectionObjects, setPanoramaSceneTool, updatePanoramaSceneLoadState, updatePanoramaSceneCameraTimeline, updatePanoramaSceneObjectTransform, uploadPanoramaSceneImage, applyPanoramaSceneViewCommit, syncPanorama360FromIncomingImageEdge, upsertPanoramaSceneCameraAtSlot } from '../modules/panoramaSceneNode/sceneNodeActions.js';
import { getPanoramaSceneState } from '../modules/panoramaSceneNode/sceneNodeSelectors.js';
import { PanoramaScene3DBridge } from '../modules/panoramaSceneNode/scene3dBridge.js';
import { preloadPanoramaCharacterModels } from '../modules/panoramaSceneNode/characterModelRegistry.js';
import { PanoramaSceneInteraction } from '../modules/interaction/PanoramaSceneInteraction.js';
import { createContextMenuIcon } from '../modules/interaction/contextMenuIcons.js';
import { PANORAMA_SCENE_TOOLBAR_HTML } from './panoramaScene/PanoramaSceneToolbar.js';
import { PANORAMA_360_MODE_TOOLBAR_HTML, PANORAMA_SCENE_MODE_TOOLBAR_HTML } from './panoramaScene/PanoramaModeToolbar.js';
import { PANORAMA_SCENE_CORNER_TOOLBAR_HTML } from './panoramaScene/PanoramaSceneCornerToolbar.js';
import { PANORAMA_SCENE_BOTTOM_TOOLBAR_HTML } from './panoramaScene/PanoramaSceneBottomToolbar.js';
import { createCameraPresetList, renderCameraPresetList } from './panoramaScene/CameraPresetList.js';
import { createMannequinQuickMenu, getPanoramaMannequinColorLabel, getPanoramaMannequinGenderLabel, PANORAMA_MANNEQUIN_COLOR_OPTIONS, PANORAMA_MANNEQUIN_GENDER_OPTIONS, resolvePanoramaSceneColorToken, renderMannequinQuickMenu } from './panoramaScene/MannequinQuickMenu.js';
import { createSceneAssetBrowser, renderSceneAssetBrowser } from './panoramaScene/SceneAssetBrowser.js';
import { createMannequinPosePanel, renderMannequinPosePanel } from './panoramaScene/MannequinPosePanel.js';
import { createCameraTimelinePanel, renderCameraTimelinePanel, setCameraTimelineDisplayTime } from './panoramaScene/CameraTimelinePanel.js';
import { normalizeCameraTimeline, sampleCameraTimeline } from '../modules/panoramaSceneNode/cameraTimeline.js';
import { getShortcutLabel as a479_0x195687, getShortcutKeys, resolveShortcutActionForEvent } from '../modules/shortcuts.js';
import * as a479_0x423d6e from '../modules/panoramaSceneNode/threeRuntime.js';
import { createDefaultSceneView, PANORAMA_360_NODE_TYPE } from '../modules/panoramaSceneNode/sceneNode.js';
import { SCENE_DEFAULT_FOCAL_LENGTH_MM, SCENE_FOCAL_LENGTH_MAX_MM, SCENE_FOCAL_LENGTH_MIN_MM, cameraPoseToSceneViewFromReference, focalLengthToFov } from '../core/panoramaSceneMath.js';
import { onLocaleChange, t } from '../i18n/index.js';
const POINTER_TOOL_ICON = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"m5 3 10 8-6 1 2 7-3 1-2-7-4 3z\"/></svg>";
const BOX_SELECT_TOOL_ICON = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><rect x=\"4\" y=\"5\" width=\"16\" height=\"14\" rx=\"2\"/><path d=\"M8 9h8v6H8z\" stroke-dasharray=\"2 2\"/></svg>";
const PANORAMA_360_IMAGE_SOURCE_TYPES = new Set(['source-image', "ai-image", "image"]);
function panoramaSceneText(_0x6d0020, _0x46491d = {}) {
  return t("panoramaSceneNode." + _0x6d0020, _0x46491d);
}
function isPanorama360ImageSourceType(_0x230280) {
  return PANORAMA_360_IMAGE_SOURCE_TYPES['has'](String(_0x230280 || '')["trim"]());
}
function createElementFromHtml(_0x6d972e) {
  const _0x535807 = document["createElement"]("template");
  _0x535807['innerHTML'] = _0x6d972e["trim"]();
  return _0x535807["content"]["firstElementChild"];
}
function removeConfiguredToolbarActions(_0x394b12, _0x2c792c = []) {
  if (!_0x394b12) {
    return;
  }
  const _0x567817 = new Set((Array["isArray"](_0x2c792c) ? _0x2c792c : [])["map"](_0x32379d => String(_0x32379d || '')["trim"]())["filter"](Boolean));
  if (_0x567817["size"] < 0x1) {
    return;
  }
  _0x394b12["querySelectorAll"]('button')['forEach'](_0x4022b2 => {
    const _0xb4b594 = [..._0x567817]["some"](_0x1a773b => _0x4022b2["classList"]["contains"]('act-' + _0x1a773b));
    if (_0xb4b594) {
      _0x4022b2['remove']();
    }
  });
}
function attachUiStop(_0x16c4b2, {
  wheel = ![]
} = {}) {
  if (!_0x16c4b2) {
    return;
  }
  _0x16c4b2["dataset"]["uiStop"] = '1';
  _0x16c4b2["addEventListener"]("pointerdown", _0x1369a5 => _0x1369a5["stopPropagation"]());
  wheel && _0x16c4b2["addEventListener"]("wheel", _0x4ecc71 => {
    _0x4ecc71["stopPropagation"]();
  }, {
    'passive': ![]
  });
}
function getShortcutLabel(_0x3cc4bd) {
  const _0x3d0c5d = getShortcutKeys(_0x3cc4bd);
  return _0x3d0c5d["length"] > 0x0 ? '[' + _0x3d0c5d["join"]('+') + ']' : '';
}
function buildTooltipText(_0x4e5d0e, _0x5ca218) {
  const _0x3d75e8 = getShortcutLabel(_0x5ca218);
  return _0x3d75e8 ? _0x4e5d0e + '\x20' + _0x3d75e8 : _0x4e5d0e;
}
function cameraTimelineSampleToDraft(_0x3b6b49) {
  if (!_0x3b6b49) {
    return null;
  }
  const _0x16f8ef = new a479_0x423d6e['Vector3'](_0x3b6b49["position"]['x'], _0x3b6b49["position"]['y'], _0x3b6b49["position"]['z']);
  const _0x146493 = new a479_0x423d6e["Vector3"](_0x3b6b49["target"]['x'], _0x3b6b49["target"]['y'], _0x3b6b49["target"]['z']);
  const _0x142f7b = new a479_0x423d6e["Matrix4"]()["lookAt"](_0x16f8ef, _0x146493, new a479_0x423d6e["Vector3"](0x0, 0x1, 0x0));
  const _0x40e0c4 = new a479_0x423d6e["Quaternion"]()["setFromRotationMatrix"](_0x142f7b)['normalize']();
  const _0x19779c = new a479_0x423d6e["Euler"]()['setFromQuaternion'](_0x40e0c4, 'YXZ');
  return {
    'kind': 'camera',
    'position': {
      ..._0x3b6b49['position']
    },
    'target': {
      ..._0x3b6b49['target']
    },
    'quaternion': {
      'x': _0x40e0c4['x'],
      'y': _0x40e0c4['y'],
      'z': _0x40e0c4['z'],
      'w': _0x40e0c4['w']
    },
    'rotation': {
      'x': _0x19779c['x'],
      'y': _0x19779c['y'],
      'z': _0x19779c['z']
    },
    'fov': _0x3b6b49['fov'],
    'disableSmoothing': !![]
  };
}
function normalizeCameraSlot(_0x1ecba5) {
  const _0x167539 = Number(_0x1ecba5);
  if (!Number["isInteger"](_0x167539)) {
    return null;
  }
  if (_0x167539 < 0x1 || _0x167539 > 0xa) {
    return null;
  }
  return _0x167539;
}
function resolveCameraSlotEntries(_0x4d53f0 = []) {
  const _0x1ed5bc = Array['isArray'](_0x4d53f0) ? _0x4d53f0 : [];
  const _0x257ac4 = new Set();
  const _0x24c7fd = [];
  _0x1ed5bc["forEach"](_0x5dcd1a => {
    const _0x3520b6 = normalizeCameraSlot(_0x5dcd1a?.['slot']);
    if (!_0x3520b6 || _0x257ac4["has"](_0x3520b6)) {
      return;
    }
    _0x257ac4["add"](_0x3520b6);
    _0x24c7fd["push"]({
      'camera': _0x5dcd1a,
      'slot': _0x3520b6
    });
  });
  _0x1ed5bc["forEach"](_0x24f3d7 => {
    if (_0x24c7fd["some"](_0x1adcb2 => _0x1adcb2['camera']?.['id'] === _0x24f3d7?.['id'])) {
      return;
    }
    for (let _0x261751 = 0x1; _0x261751 <= 0xa; _0x261751 += 0x1) {
      if (_0x257ac4['has'](_0x261751)) {
        continue;
      }
      _0x257ac4['add'](_0x261751);
      _0x24c7fd["push"]({
        'camera': _0x24f3d7,
        'slot': _0x261751
      });
      break;
    }
  });
  return _0x24c7fd["sort"]((_0x4f6902, _0x45adc1) => _0x4f6902["slot"] - _0x45adc1["slot"]);
}
function lerp(_0x499ce8, _0x2a220a, _0x1cdaea) {
  return _0x499ce8 + (_0x2a220a - _0x499ce8) * _0x1cdaea;
}
function smootherstep(_0x248c1a) {
  const _0x136fe5 = Math["max"](0x0, Math["min"](0x1, Number(_0x248c1a) || 0x0));
  return _0x136fe5 * _0x136fe5 * _0x136fe5 * (_0x136fe5 * (_0x136fe5 * 0x6 - 0xf) + 0xa);
}
function interpolateVector3(_0x5cbd63, _0x2071f2, _0x33f790) {
  return {
    'x': lerp(Number(_0x5cbd63?.['x']) || 0x0, Number(_0x2071f2?.['x']) || 0x0, _0x33f790),
    'y': lerp(Number(_0x5cbd63?.['y']) || 0x0, Number(_0x2071f2?.['y']) || 0x0, _0x33f790),
    'z': lerp(Number(_0x5cbd63?.['z']) || 0x0, Number(_0x2071f2?.['z']) || 0x0, _0x33f790)
  };
}
function cloneVector3(_0x4e2961) {
  return interpolateVector3(_0x4e2961, _0x4e2961, 0x1);
}
function quaternionToRotation(_0xa3a172) {
  const _0x431912 = _0xa3a172?.['clone']?.() || new a479_0x423d6e["Quaternion"]();
  const _0x17ba1f = new a479_0x423d6e["Euler"](0x0, 0x0, 0x0, "YXZ")["setFromQuaternion"](_0x431912, "YXZ");
  return {
    'x': _0x17ba1f['x'],
    'y': _0x17ba1f['y'],
    'z': _0x17ba1f['z']
  };
}
function areSceneViewsEquivalent(_0x4b6bf2, _0x3b6875, _0x48ecac = 0.00001) {
  if (!_0x4b6bf2 || !_0x3b6875) {
    return ![];
  }
  return Math["abs"]((Number(_0x4b6bf2?.['target']?.['x']) || 0x0) - (Number(_0x3b6875?.['target']?.['x']) || 0x0)) <= _0x48ecac && Math["abs"]((Number(_0x4b6bf2?.['target']?.['y']) || 0x0) - (Number(_0x3b6875?.["target"]?.['y']) || 0x0)) <= _0x48ecac && Math["abs"]((Number(_0x4b6bf2?.["target"]?.['z']) || 0x0) - (Number(_0x3b6875?.["target"]?.['z']) || 0x0)) <= _0x48ecac && Math['abs']((Number(_0x4b6bf2?.["orbitYaw"]) || 0x0) - (Number(_0x3b6875?.['orbitYaw']) || 0x0)) <= _0x48ecac && Math["abs"]((Number(_0x4b6bf2?.["orbitPitch"]) || 0x0) - (Number(_0x3b6875?.['orbitPitch']) || 0x0)) <= _0x48ecac && Math["abs"]((Number(_0x4b6bf2?.["orbitDistance"]) || 0x0) - (Number(_0x3b6875?.['orbitDistance']) || 0x0)) <= _0x48ecac;
}
const PANORAMA_CAPTURE_MODE_OPTIONS = [{
  'key': "adaptive",
  'labelKey': "adaptive",
  'iconClass': "is-adaptive"
}, {
  'key': '9:16',
  'labelKey': "vertical",
  'ratio': 0x9 / 0x10,
  'iconClass': "is-9-16"
}, {
  'key': "2.35:1",
  'labelKey': "cinema",
  'ratio': 2.35,
  'iconClass': "is-2-35-1"
}];
function normalizeCaptureMode(_0x3ad9ea) {
  return PANORAMA_CAPTURE_MODE_OPTIONS["some"](_0x244e01 => _0x244e01['key'] === _0x3ad9ea) ? _0x3ad9ea : "adaptive";
}
function getCaptureModeMeta(_0x187ec0) {
  const _0x39fbdc = normalizeCaptureMode(_0x187ec0);
  return PANORAMA_CAPTURE_MODE_OPTIONS["find"](_0x14c690 => _0x14c690["key"] === _0x39fbdc) || PANORAMA_CAPTURE_MODE_OPTIONS[0x0];
}
function getCaptureModeLabel(_0x11049f) {
  const _0x1374fd = typeof _0x11049f === "string" ? getCaptureModeMeta(_0x11049f) : _0x11049f;
  const _0xf3f527 = String(_0x1374fd?.["labelKey"] || '')["trim"]();
  return _0xf3f527 ? panoramaSceneText('capture.modes.' + _0xf3f527) : String(_0x1374fd?.["key"] || '');
}
function computeCaptureFrameRect(_0x42da, _0x28d1b9, _0x45f7f4) {
  const _0x2974a6 = Math["max"](0x0, Number(_0x42da) || 0x0);
  const _0x5900a2 = Math["max"](0x0, Number(_0x28d1b9) || 0x0);
  if (_0x2974a6 <= 0x0 || _0x5900a2 <= 0x0) {
    return {
      'x': 0x0,
      'y': 0x0,
      'width': 0x0,
      'height': 0x0
    };
  }
  const _0x4dd5bf = normalizeCaptureMode(_0x45f7f4);
  if (_0x4dd5bf === "adaptive") {
    return {
      'x': 0x0,
      'y': 0x0,
      'width': _0x2974a6,
      'height': _0x5900a2
    };
  }
  const _0x378231 = getCaptureModeMeta(_0x4dd5bf)["ratio"];
  if (!(_0x378231 > 0x0)) {
    return {
      'x': 0x0,
      'y': 0x0,
      'width': _0x2974a6,
      'height': _0x5900a2
    };
  }
  const _0x9b9a1e = _0x2974a6 / _0x5900a2;
  if (_0x9b9a1e >= _0x378231) {
    const _0x5872ba = _0x5900a2 * _0x378231;
    return {
      'x': (_0x2974a6 - _0x5872ba) / 0x2,
      'y': 0x0,
      'width': _0x5872ba,
      'height': _0x5900a2
    };
  }
  const _0x33703d = _0x2974a6 / _0x378231;
  return {
    'x': 0x0,
    'y': (_0x5900a2 - _0x33703d) / 0x2,
    'width': _0x2974a6,
    'height': _0x33703d
  };
}
export function resolveNextPanoramaMouseTool(_0x2998e7) {
  return String(_0x2998e7 || '')["trim"]() === "box-select" ? "navigate" : 'box-select';
}
async function decodeImageBlob(_0x5cb3b1) {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(_0x5cb3b1);
  }
  const _0x1653b0 = await new Promise((_0x5b6be9, _0x300ce1) => {
    const _0x2ddc33 = URL["createObjectURL"](_0x5cb3b1);
    const _0x38eb1c = new Image();
    _0x38eb1c["onload"] = () => {
      URL["revokeObjectURL"](_0x2ddc33);
      _0x5b6be9(_0x38eb1c);
    };
    _0x38eb1c["onerror"] = _0x41c8de => {
      URL["revokeObjectURL"](_0x2ddc33);
      _0x300ce1(_0x41c8de);
    };
    _0x38eb1c["src"] = _0x2ddc33;
  });
  return _0x1653b0;
}
function closeDecodedImage(_0x16c8c0) {
  _0x16c8c0 && typeof _0x16c8c0["close"] === 'function' && _0x16c8c0["close"]();
}
async function canvasToPngBlob(_0x5186f4) {
  return new Promise((_0x3aeea2, _0x11cecb) => {
    _0x5186f4["toBlob"](_0x5f871c => {
      if (_0x5f871c) {
        _0x3aeea2(_0x5f871c);
        return;
      }
      _0x11cecb(new Error(panoramaSceneText('errors.captureCropFailed')));
    }, 'image/png');
  });
}
async function cropCaptureBlobToFrame({
  blob: _0xd23035,
  viewportWidth: _0x2ad622,
  viewportHeight: _0x10c779,
  mode: _0x2e4427
}) {
  if (!(_0xd23035 instanceof Blob)) {
    return null;
  }
  const _0x553b21 = normalizeCaptureMode(_0x2e4427);
  if (_0x553b21 === "adaptive") {
    return _0xd23035;
  }
  const _0x2e193e = computeCaptureFrameRect(_0x2ad622, _0x10c779, _0x553b21);
  if (_0x2e193e["width"] <= 0x0 || _0x2e193e['height'] <= 0x0) {
    return _0xd23035;
  }
  const _0xfd89fa = await decodeImageBlob(_0xd23035);
  try {
    const _0x223d82 = Number(_0xfd89fa["width"]) || Number(_0xfd89fa["videoWidth"]) || 0x0;
    const _0x174b0b = Number(_0xfd89fa["height"]) || Number(_0xfd89fa["videoHeight"]) || 0x0;
    if (_0x223d82 <= 0x0 || _0x174b0b <= 0x0) {
      return _0xd23035;
    }
    const _0x15540b = _0x223d82 / Math["max"](0x1, _0x2ad622);
    const _0x54c0a4 = _0x174b0b / Math["max"](0x1, _0x10c779);
    const _0x3ba82b = Math["max"](0x0, Math["round"](_0x2e193e['x'] * _0x15540b));
    const _0x5e5ead = Math['max'](0x0, Math["round"](_0x2e193e['y'] * _0x54c0a4));
    const _0x4354a8 = Math["min"](_0x223d82 - _0x3ba82b, Math["max"](0x1, Math['round'](_0x2e193e['width'] * _0x15540b)));
    const _0x12ed91 = Math["min"](_0x174b0b - _0x5e5ead, Math["max"](0x1, Math["round"](_0x2e193e["height"] * _0x54c0a4)));
    const _0x20c228 = document["createElement"]("canvas");
    _0x20c228["width"] = _0x4354a8;
    _0x20c228["height"] = _0x12ed91;
    const _0x435564 = _0x20c228["getContext"]('2d');
    if (!_0x435564) {
      throw new Error(panoramaSceneText('errors.captureCropFailed'));
    }
    _0x435564["drawImage"](_0xfd89fa, _0x3ba82b, _0x5e5ead, _0x4354a8, _0x12ed91, 0x0, 0x0, _0x4354a8, _0x12ed91);
    return canvasToPngBlob(_0x20c228);
  } finally {
    closeDecodedImage(_0xfd89fa);
  }
}
export class PanoramaSceneNode {
  constructor(_0xf11b9d) {
    this["_data"] = _0xf11b9d;
    this['id'] = _0xf11b9d['id'];
    this['_isPanorama360'] = String(_0xf11b9d?.["type"] || '')["trim"]() === PANORAMA_360_NODE_TYPE;
    this['el'] = document["createElement"]("div");
    this['el']["className"] = 'v2-node-component\x20panorama-scene-component';
    this['el']['classList']["toggle"]('is-panorama-360', this["_isPanorama360"]);
    this["_sceneState"] = getPanoramaSceneState(_0xf11b9d);
    this["_openMenuKey"] = null;
    this["_menuHideTimer"] = null;
    this["_resizeObserver"] = null;
    this['_bridge'] = null;
    this["_interaction"] = null;
    this["_unsubscribeViewport"] = null;
    this['_unsubscribeSelection'] = null;
    this["_unsubscribePanoramaIncomingSync"] = null;
    this["_isSelected"] = ![];
    this["_isNodeHovered"] = ![];
    this["_isUnmounted"] = ![];
    this["_contextMenuTarget"] = null;
    this["_cameraJumpRaf"] = 0x0;
    this["_cameraJumpToken"] = 0x0;
    this["_pendingCameraJumpCommit"] = null;
    this['_pendingCameraJumpReleaseRaf'] = 0x0;
    this["_timelinePlaybackRaf"] = 0x0;
    this["_timelinePlaybackStartedAt"] = 0x0;
    this["_timelinePlaybackStartTime"] = 0x0;
    this["_timelinePreviewTime"] = 0x0;
    this["_isTimelinePlaying"] = ![];
    this["_hasRequestedCharacterPreload"] = ![];
    this["_defaultSceneFocalLength"] = SCENE_DEFAULT_FOCAL_LENGTH_MM;
    this["_browserFullscreenOverlayEl"] = null;
    this['_browserFullscreenAnchorEl'] = null;
    this["_browserFullscreenExitBtnEl"] = null;
    this["_unsubscribeLocale"] = null;
    this["_handleToolbarClick"] = this["_handleToolbarClick"]["bind"](this);
    this["_handleFileInputChange"] = this["_handleFileInputChange"]["bind"](this);
    this["_handleViewportPointerDown"] = this['_handleViewportPointerDown']['bind'](this);
    this["_handleViewportContextMenu"] = this["_handleViewportContextMenu"]['bind'](this);
    this["_handleGlobalPointerDown"] = this["_handleGlobalPointerDown"]["bind"](this);
    this["_handleViewportDoubleClick"] = this["_handleViewportDoubleClick"]["bind"](this);
    this["_handleNodePointerEnter"] = this['_handleNodePointerEnter']['bind'](this);
    this["_handleNodePointerLeave"] = this["_handleNodePointerLeave"]["bind"](this);
    this['_handleBottomToolbarPointerEnter'] = this["_handleBottomToolbarPointerEnter"]['bind'](this);
    this["_handleBottomToolbarPointerLeave"] = this['_handleBottomToolbarPointerLeave']["bind"](this);
    this["_handleCaptureMenuClick"] = this["_handleCaptureMenuClick"]["bind"](this);
    this['_handleWindowResize'] = this["_handleWindowResize"]['bind'](this);
    this["_handleShortcutsUpdated"] = this["_handleShortcutsUpdated"]["bind"](this);
    this["_handleCameraShortcutEvent"] = this['_handleCameraShortcutEvent']['bind'](this);
    this["_handleCaptureShortcutEvent"] = this["_handleCaptureShortcutEvent"]["bind"](this);
    this["_handleWindowKeyDown"] = this['_handleWindowKeyDown']["bind"](this);
    this['_handleWindowKeyUp'] = this['_handleWindowKeyUp']["bind"](this);
    this["_handleWindowBlur"] = this["_handleWindowBlur"]["bind"](this);
  }
  ["mount"]() {
    this["_isUnmounted"] = ![];
    Object["assign"](this['el']["style"], {
      'display': "flex",
      'flexDirection': "column",
      'height': "100%",
      'overflow': "visible",
      'pointerEvents': "auto",
      'cursor': "default",
      'position': 'relative'
    });
    this['_shellEl'] = document["createElement"]("div");
    this["_shellEl"]["className"] = "panorama-scene-shell";
    this["_viewportEl"] = document["createElement"]("div");
    this["_viewportEl"]["className"] = 'panorama-scene-viewport';
    this["_viewportEl"]["dataset"]['sceneInteraction'] = "panorama";
    this["_viewportEl"]["tabIndex"] = 0x0;
    this["_viewportEl"]["addEventListener"]('pointerdown', this["_handleViewportPointerDown"]);
    this["_viewportEl"]['addEventListener']("contextmenu", this["_handleViewportContextMenu"]);
    this["_viewportEl"]["addEventListener"]("dblclick", this['_handleViewportDoubleClick']);
    this["_overlayEl"] = document["createElement"]("div");
    this['_overlayEl']["className"] = "panorama-scene-overlay";
    this["_infoDockEl"] = document["createElement"]('div');
    this["_infoDockEl"]["className"] = "panorama-scene-fixed-info-dock";
    this["_infoDockEl"]["style"]["transform"] = "none";
    this['_sceneToolbarEl'] = createElementFromHtml(PANORAMA_SCENE_TOOLBAR_HTML);
    removeConfiguredToolbarActions(this['_sceneToolbarEl'], this['_data']?.["panoramaToolbar"]?.["hiddenActions"]);
    this["_sceneToolbarEl"]["addEventListener"]("click", this["_handleToolbarClick"]);
    attachUiStop(this["_sceneToolbarEl"]);
    const _0xb1b7b4 = this['_isPanorama360'] ? PANORAMA_360_MODE_TOOLBAR_HTML : PANORAMA_SCENE_MODE_TOOLBAR_HTML;
    this["_editToolbarEl"] = createElementFromHtml(_0xb1b7b4);
    removeConfiguredToolbarActions(this['_editToolbarEl'], this['_data']?.['panoramaToolbar']?.['hiddenActions']);
    this["_editToolbarEl"]["addEventListener"]("click", this["_handleToolbarClick"]);
    attachUiStop(this["_editToolbarEl"]);
    this["_cornerToolbarEl"] = createElementFromHtml(PANORAMA_SCENE_CORNER_TOOLBAR_HTML);
    this["_cornerToolbarEl"]["addEventListener"]('click', this["_handleToolbarClick"]);
    attachUiStop(this["_cornerToolbarEl"]);
    this['_bottomToolbarEl'] = createElementFromHtml(PANORAMA_SCENE_BOTTOM_TOOLBAR_HTML);
    this["_bottomToolbarEl"]["addEventListener"]('click', this["_handleToolbarClick"]);
    this["_bottomToolbarEl"]["addEventListener"]('pointerover', this["_handleBottomToolbarPointerEnter"]);
    this["_bottomToolbarEl"]["addEventListener"]('pointerout', this["_handleBottomToolbarPointerLeave"]);
    attachUiStop(this["_bottomToolbarEl"]);
    this['_bottomToolbarAnchorEl'] = document["createElement"]("div");
    this["_bottomToolbarAnchorEl"]["className"] = 'panorama-scene-bottom-toolbar-anchor';
    this["_bottomToolbarAnchorEl"]['appendChild'](this["_bottomToolbarEl"]);
    this['_bottomToolbarPopoverLayerEl'] = document["createElement"]("div");
    this["_bottomToolbarPopoverLayerEl"]["className"] = "panorama-scene-bottom-toolbar-popovers";
    this['_bottomToolbarEl']["appendChild"](this["_bottomToolbarPopoverLayerEl"]);
    this["_cameraListEl"] = createCameraPresetList();
    attachUiStop(this["_cameraListEl"]);
    this["_cameraListEl"]['addEventListener']("mouseenter", () => this["_openMenu"]("camera"));
    this["_cameraListEl"]["addEventListener"]("mouseleave", () => this['_scheduleMenuHide']("camera"));
    this['_mannequinMenuEl'] = createMannequinQuickMenu({
      'onSelectGender': ({
        gender: _0x2d7f41
      }) => {
        setPanoramaSceneGridPlacement({
          'nodeId': this['id'],
          'patch': {
            'gender': _0x2d7f41 === "female" ? 'female' : "male"
          }
        });
      },
      'onSelectColor': ({
        colorKey: _0x286840,
        gender: _0x5cff7d
      }) => {
        const _0x5bcf81 = _0x5cff7d === "female" ? 'female' : "male";
        this["_selectNodeOnCanvas"]();
        setPanoramaSceneGridPlacement({
          'nodeId': this['id'],
          'patch': {
            'colorKey': _0x286840,
            'gender': _0x5bcf81
          }
        });
        addPanoramaSceneMannequin({
          'nodeId': this['id'],
          'gender': _0x5bcf81,
          'colorKey': _0x286840,
          'viewPose': this["_bridge"]?.['readCurrentViewPose']?.()
        });
        this["_closeMenus"]();
      }
    });
    attachUiStop(this["_mannequinMenuEl"]);
    this["_mannequinMenuEl"]["addEventListener"]("mouseenter", () => this["_openMenu"]("mannequin"));
    this["_mannequinMenuEl"]["addEventListener"]("mouseleave", () => this["_scheduleMenuHide"]("mannequin"));
    this["_assetBrowserEl"] = createSceneAssetBrowser({
      'onSelect': _0x54f130 => {
        this["_selectNodeOnCanvas"]();
        addPanoramaSceneCube({
          'nodeId': this['id'],
          'assetId': _0x54f130,
          'viewPose': this['_bridge']?.['readCurrentViewPose']?.()
        });
        this["_closeMenus"]();
      }
    });
    attachUiStop(this["_assetBrowserEl"], {
      'wheel': !![]
    });
    this['_assetBrowserEl']["addEventListener"]("mouseenter", () => this["_openMenu"]("assets"));
    this["_assetBrowserEl"]['addEventListener']('mouseleave', () => this['_scheduleMenuHide']('assets'));
    const _0x13a073 = () => this["_sceneState"]?.["selection"]?.["selectedObjectType"] === "mannequin" ? this["_sceneState"]["selection"]["selectedObjectId"] : null;
    this["_posePanelEl"] = createMannequinPosePanel({
      'onApplyPreset': _0x1f3ac5 => {
        const _0x2b337f = _0x13a073();
        if (!_0x2b337f) {
          return;
        }
        applyPanoramaSceneMannequinPose({
          'nodeId': this['id'],
          'mannequinId': _0x2b337f,
          'poseId': _0x1f3ac5
        });
        this['_bridge']?.["clearDraftMannequinBonePose"]?.(_0x2b337f);
      },
      'onPreview': _0x31cfca => {
        const _0x5b8c9b = _0x13a073();
        if (!_0x5b8c9b) {
          return;
        }
        this["_bridge"]?.['setDraftMannequinBonePose']?.(_0x5b8c9b, _0x31cfca);
      },
      'onCommit': _0x2826a7 => {
        const _0x222314 = _0x13a073();
        if (!_0x222314) {
          return;
        }
        applyPanoramaSceneMannequinPose({
          'nodeId': this['id'],
          'mannequinId': _0x222314,
          'poseId': "custom",
          'bonePose': _0x2826a7
        });
        this["_bridge"]?.["clearDraftMannequinBonePose"]?.(_0x222314);
      },
      'onSaveCustom': _0x5b0a94 => {
        const _0xfc43f2 = _0x13a073();
        if (!_0xfc43f2) {
          return;
        }
        applyPanoramaSceneMannequinPose({
          'nodeId': this['id'],
          'mannequinId': _0xfc43f2,
          'poseId': "custom",
          'customPose': {
            ..._0x5b0a94,
            'id': "custom-pose-" + Date["now"]()
          }
        });
        this["_bridge"]?.["clearDraftMannequinBonePose"]?.(_0xfc43f2);
      }
    });
    attachUiStop(this["_posePanelEl"], {
      'wheel': !![]
    });
    this["_posePanelEl"]["addEventListener"]("mouseenter", () => this["_openMenu"]("pose"));
    this['_posePanelEl']["addEventListener"]("mouseleave", () => this["_scheduleMenuHide"]("pose"));
    this["_timelinePanelEl"] = createCameraTimelinePanel({
      'onAddKeyframe': _0x448035 => {
        addPanoramaSceneCameraKeyframe({
          'nodeId': this['id'],
          'keyframe': {
            'time': _0x448035
          },
          'viewPose': this["_bridge"]?.['readCurrentViewPose']?.()
        });
      },
      'onPlayToggle': () => this["_toggleCameraTimelinePlayback"](),
      'onScrub': _0xb53954 => this["_previewCameraTimelineAt"](_0xb53954),
      'onScrubCommit': _0x145054 => {
        this["_timelinePreviewTime"] = _0x145054;
        updatePanoramaSceneCameraTimeline({
          'nodeId': this['id'],
          'patch': {
            'currentTime': _0x145054
          }
        });
      },
      'onDeleteKeyframe': _0x3c9fa4 => {
        deletePanoramaSceneCameraKeyframe({
          'nodeId': this['id'],
          'keyframeId': _0x3c9fa4
        });
      },
      'onSettingsChange': _0x12061a => {
        updatePanoramaSceneCameraTimeline({
          'nodeId': this['id'],
          'patch': _0x12061a
        });
      }
    });
    attachUiStop(this["_timelinePanelEl"], {
      'wheel': !![]
    });
    this["_gridPanelEl"] = this["_createGridPanel"]();
    attachUiStop(this["_gridPanelEl"], {
      'wheel': !![]
    });
    this["_gridPanelEl"]["addEventListener"]('mouseenter', () => this["_openMenu"]('grid'));
    this["_gridPanelEl"]["addEventListener"]("mouseleave", () => this['_scheduleMenuHide']("grid"));
    this["_captureMenuEl"] = this["_createCaptureMenu"]();
    attachUiStop(this["_captureMenuEl"]);
    this["_captureMenuEl"]["addEventListener"]("mouseenter", () => this['_openMenu']("capture"));
    this["_captureMenuEl"]['addEventListener']("mouseleave", () => this["_scheduleMenuHide"]("capture"));
    this["_captureMenuEl"]["addEventListener"]('click', this["_handleCaptureMenuClick"]);
    this["_focusMenuEl"] = this["_createFocusMenu"]();
    attachUiStop(this["_focusMenuEl"], {
      'wheel': !![]
    });
    this["_focusMenuEl"]["addEventListener"]("mouseenter", () => this["_openMenu"]('focus'));
    this["_focusMenuEl"]['addEventListener']("mouseleave", () => this["_scheduleMenuHide"]("focus"));
    this["_statusEl"] = document["createElement"]("div");
    this["_statusEl"]["className"] = 'panorama-scene-fixed-status';
    this["_statusEl"]["style"]["transform"] = "none";
    this["_statusContentEl"] = document["createElement"]("div");
    this["_statusContentEl"]["className"] = 'panorama-scene-fixed-status__content';
    this["_statusEl"]["appendChild"](this["_statusContentEl"]);
    attachUiStop(this["_statusEl"]);
    this["_errorEl"] = document["createElement"]("div");
    this["_errorEl"]["className"] = "panorama-scene-error";
    attachUiStop(this["_errorEl"]);
    this['_hintEl'] = document['createElement']("div");
    this['_hintEl']['className'] = "panorama-scene-fixed-hint";
    this['_hintEl']["style"]['transform'] = "none";
    this["_hintContentEl"] = document['createElement']("div");
    this['_hintContentEl']['className'] = "panorama-scene-fixed-hint__content";
    this["_hintEl"]["appendChild"](this['_hintContentEl']);
    attachUiStop(this["_hintEl"]);
    this['_contextMenuEl'] = document["createElement"]("div");
    this["_contextMenuEl"]["className"] = "panorama-scene-object-menu";
    this["_contextMenuEl"]["hidden"] = !![];
    const _0x5675b6 = document["createElement"]("button");
    _0x5675b6['type'] = "button";
    _0x5675b6["className"] = "panorama-scene-object-menu__item act-delete-selected";
    const _0x2c347a = document['createElement']("span");
    _0x2c347a['className'] = "panorama-scene-object-menu__icon";
    _0x2c347a['setAttribute']("aria-hidden", "true");
    const _0x565db2 = createContextMenuIcon("delete");
    if (_0x565db2) {
      _0x2c347a["appendChild"](_0x565db2);
    }
    const _0x5ad7d6 = document["createElement"]("span");
    _0x5ad7d6["className"] = "panorama-scene-object-menu__label";
    _0x5ad7d6['textContent'] = panoramaSceneText("contextMenu.deleteObject");
    const _0x1a087f = document["createElement"]("span");
    _0x1a087f["className"] = 'v2-menu-kbd\x20panorama-scene-object-menu__kbd';
    _0x1a087f['dataset']["shortcutAction"] = "delete";
    _0x5675b6['appendChild'](_0x2c347a);
    _0x5675b6["appendChild"](_0x5ad7d6);
    _0x5675b6["appendChild"](_0x1a087f);
    this["_contextMenuEl"]["appendChild"](_0x5675b6);
    attachUiStop(this["_contextMenuEl"]);
    _0x5675b6["addEventListener"]("click", () => {
      this["_contextMenuTarget"]?.["type"] === "camera" && this["_contextMenuTarget"]?.["cameraId"] ? deletePanoramaSceneCamera({
        'nodeId': this['id'],
        'cameraId': this["_contextMenuTarget"]['cameraId']
      }) : deleteSelectedPanoramaSceneObject({
        'nodeId': this['id']
      });
      this['_closeObjectContextMenu']();
    });
    this["_captureSafeFrameEl"] = document["createElement"]("div");
    this["_captureSafeFrameEl"]["className"] = "panorama-scene-capture-safe-frame";
    this["_captureSafeFrameEl"]['hidden'] = !![];
    this["_captureSafeFrameLabelEl"] = document["createElement"]("div");
    this["_captureSafeFrameLabelEl"]['className'] = "panorama-scene-capture-safe-frame__label";
    this["_captureSafeFrameEl"]["appendChild"](this["_captureSafeFrameLabelEl"]);
    this["_bottomToolbarPopoverLayerEl"]["appendChild"](this["_captureMenuEl"]);
    this["_bottomToolbarPopoverLayerEl"]['appendChild'](this['_cameraListEl']);
    this["_bottomToolbarPopoverLayerEl"]["appendChild"](this["_focusMenuEl"]);
    this["_bottomToolbarPopoverLayerEl"]["appendChild"](this["_mannequinMenuEl"]);
    this["_bottomToolbarPopoverLayerEl"]["appendChild"](this["_assetBrowserEl"]);
    this["_bottomToolbarPopoverLayerEl"]["appendChild"](this['_posePanelEl']);
    this["_bottomToolbarPopoverLayerEl"]['appendChild'](this['_gridPanelEl']);
    this["_overlayEl"]['appendChild'](this["_captureSafeFrameEl"]);
    this["_overlayEl"]['appendChild'](this["_timelinePanelEl"]);
    this["_overlayEl"]["appendChild"](this["_contextMenuEl"]);
    this["_overlayEl"]["appendChild"](this["_errorEl"]);
    this["_infoDockEl"]["appendChild"](this["_hintEl"]);
    this["_infoDockEl"]["appendChild"](this["_statusEl"]);
    this["_shellEl"]['appendChild'](this["_viewportEl"]);
    this["_shellEl"]["appendChild"](this['_overlayEl']);
    this["_shellEl"]["appendChild"](this["_cornerToolbarEl"]);
    this["_shellEl"]["appendChild"](this["_infoDockEl"]);
    this["_shellEl"]["appendChild"](this['_bottomToolbarAnchorEl']);
    this['el']['appendChild'](this['_sceneToolbarEl']);
    this['el']['appendChild'](this["_editToolbarEl"]);
    this['_browserFullscreenAnchorEl'] = document['createElement']("div");
    this['_browserFullscreenAnchorEl']["className"] = "panorama-scene-browser-fullscreen-anchor";
    this["_browserFullscreenAnchorEl"]["hidden"] = !![];
    this['el']["appendChild"](this['_browserFullscreenAnchorEl']);
    this['el']["appendChild"](this['_shellEl']);
    this['el']['addEventListener']('pointerenter', this["_handleNodePointerEnter"]);
    this['el']["addEventListener"]("pointerleave", this["_handleNodePointerLeave"]);
    this["_fileInput"] = document["createElement"]("input");
    this['_fileInput']["className"] = "panorama-scene-file-input";
    this["_fileInput"]["type"] = "file";
    this['_fileInput']["accept"] = "image/*";
    this["_fileInput"]["style"]["display"] = 'none';
    this["_fileInput"]["addEventListener"]("change", this["_handleFileInputChange"]);
    this['el']['appendChild'](this["_fileInput"]);
    this["_bridge"] = new PanoramaScene3DBridge({
      'container': this['_viewportEl'],
      'onPanoramaStatusChange': ({
        isLoaded: _0x46e3d6,
        error: _0x3b5d43
      }) => {
        updatePanoramaSceneLoadState({
          'nodeId': this['id'],
          'isLoaded': _0x46e3d6,
          'error': _0x3b5d43
        });
      }
    });
    this["_bridge"]["setDefaultSceneFocalLength"]?.(this["_defaultSceneFocalLength"]);
    this['_interaction'] = new PanoramaSceneInteraction({
      'viewportEl': this["_viewportEl"],
      'overlayEl': this['_overlayEl'],
      'bridge': this["_bridge"],
      'getSceneState': () => getPanoramaSceneState(a479_0x4b5d07["getStateRaw"]()['nodes'][this['id']]),
      'onViewCommit': _0xd70468 => {
        applyPanoramaSceneViewCommit({
          'nodeId': this['id'],
          ..._0xd70468
        });
      },
      'onObjectCommit': ({
        objectType: _0x1615ce,
        objectId: _0x447d2a,
        pose: _0x3855f7
      }) => {
        updatePanoramaSceneObjectTransform({
          'nodeId': this['id'],
          'objectType': _0x1615ce,
          'objectId': _0x447d2a,
          'pose': _0x3855f7
        });
      },
      'onSelectionChange': (_0xe58ed2, _0x1711b2) => {
        this["_selectNodeOnCanvas"]();
        setPanoramaSceneSelection({
          'nodeId': this['id'],
          'objectType': _0xe58ed2,
          'objectId': _0x1711b2
        });
      },
      'onSelectionBatchChange': (_0x1eee38, _0x38a434, _0x153b47 = null) => {
        this["_selectNodeOnCanvas"]();
        setPanoramaSceneSelectionBatch({
          'nodeId': this['id'],
          'objectType': _0x1eee38,
          'objectIds': _0x38a434,
          'groupId': _0x153b47
        });
      },
      'onSelectionObjectsChange': (_0x4f1ab1, _0x10119c = {}) => {
        this["_selectNodeOnCanvas"]();
        setPanoramaSceneSelectionObjects({
          'nodeId': this['id'],
          'objects': _0x4f1ab1,
          'activeObjectType': _0x10119c["activeObjectType"] || null,
          'activeObjectId': _0x10119c["activeObjectId"] || null,
          'groupId': _0x10119c["groupId"] || null
        });
      },
      'onSelectionClear': () => {
        clearPanoramaSceneSelection({
          'nodeId': this['id']
        });
      },
      'onObjectBatchCommit': ({
        targets: _0x294d2c
      }) => {
        updatePanoramaSceneObjectTransform({
          'nodeId': this['id'],
          'targets': _0x294d2c
        });
      }
    });
    this["_interaction"]["attach"]();
    this["_resizeObserver"] = new ResizeObserver(_0x3b9f83 => {
      const _0x2f40df = _0x3b9f83?.[0x0]?.["contentRect"];
      this["_bridge"]?.['resize'](_0x2f40df?.["width"], _0x2f40df?.["height"]);
      this["_positionMenus"]();
    });
    this['_resizeObserver']["observe"](this['_viewportEl']);
    this["_unsubscribeSelection"] = a479_0x4b5d07["subscribeSelector"](_0x5400f7 => {
      const _0x4e980a = Array["isArray"](_0x5400f7["selectedNodeIds"]) ? _0x5400f7["selectedNodeIds"] : [];
      return _0x4e980a["includes"](this['id']);
    }, _0x340f3a => {
      const _0x22e100 = this["_isSelected"] === !![];
      const _0x342b24 = _0x340f3a === !![];
      this['_isSelected'] = _0x342b24;
      _0x22e100 && !_0x342b24 && this["_sceneState"]?.['ui']?.["isEditing"] === !![] && this["_exitEditing"]();
      this["_syncAttachedUiVisibility"](this['_shouldShowBottomToolbar']());
    });
    this['_unsubscribeViewport'] = a479_0x4b5d07["subscribeSelector"](_0x3fa6bb => {
      const _0x2a0e16 = _0x3fa6bb['viewport'] || {
        'x': 0x0,
        'y': 0x0,
        'zoom': 0x1
      };
      return (_0x2a0e16['x'] || 0x0) + '|' + (_0x2a0e16['y'] || 0x0) + '|' + (_0x2a0e16['zoom'] || 0x1);
    }, () => {
      this["_positionMenus"]();
    });
    this["_isPanorama360"] && (this["_unsubscribePanoramaIncomingSync"] = a479_0x4b5d07["subscribeSelector"](_0x47c3ea => this["_buildPanorama360IncomingImageSignature"](_0x47c3ea), () => {
      syncPanorama360FromIncomingImageEdge({
        'nodeId': this['id']
      });
    }));
    window["addEventListener"]("resize", this["_handleWindowResize"]);
    window["addEventListener"]("pointerdown", this["_handleGlobalPointerDown"], !![]);
    window["addEventListener"]('keydown', this["_handleWindowKeyDown"], !![]);
    window["addEventListener"]("keyup", this["_handleWindowKeyUp"], !![]);
    window["addEventListener"]("blur", this["_handleWindowBlur"]);
    window['addEventListener']("shortcuts-updated", this["_handleShortcutsUpdated"]);
    window["addEventListener"]("panorama-scene:camera-shortcut", this["_handleCameraShortcutEvent"]);
    window['addEventListener']("panorama-scene:capture-shortcut", this["_handleCaptureShortcutEvent"]);
    this["_unsubscribeLocale"] = onLocaleChange(() => this["_syncLocaleTexts"]());
    this['update'](this["_data"]);
    this["_isPanorama360"] && syncPanorama360FromIncomingImageEdge({
      'nodeId': this['id']
    });
    return this['el'];
  }
  ["_handleShortcutsUpdated"]() {
    this["_syncToolbarState"]();
    this["_syncContextMenuShortcutLabel"]();
  }
  ["_syncContextMenuShortcutLabel"]() {
    const _0x3c6b55 = this["_contextMenuEl"]?.["querySelector"]?.('.panorama-scene-object-menu__kbd');
    if (_0x3c6b55) {
      _0x3c6b55["textContent"] = a479_0x195687("delete");
    }
  }
  ['_resolveCameraBySlot'](_0x40d2da) {
    const _0x21ae2b = normalizeCameraSlot(_0x40d2da);
    if (!_0x21ae2b) {
      return null;
    }
    const _0x3c19b2 = resolveCameraSlotEntries(this["_sceneState"]?.["cameras"] || []);
    const _0x8ad915 = _0x3c19b2['find'](_0x442a46 => _0x442a46["slot"] === _0x21ae2b);
    return _0x8ad915 ? {
      ..._0x8ad915
    } : null;
  }
  ["_cancelCameraJumpAnimation"]({
    clearDraft = !![]
  } = {}) {
    this["_cameraJumpToken"] += 0x1;
    this["_cameraJumpRaf"] && (cancelAnimationFrame(this["_cameraJumpRaf"]), this["_cameraJumpRaf"] = 0x0);
    this["_pendingCameraJumpReleaseRaf"] && (cancelAnimationFrame(this['_pendingCameraJumpReleaseRaf']), this['_pendingCameraJumpReleaseRaf'] = 0x0);
    this['_pendingCameraJumpCommit'] = null;
    clearDraft && this["_bridge"]?.["clearDraftView"]?.();
  }
  ["_setDefaultSceneFocalLength"](_0x4d3dfc) {
    const _0x15493d = Math['max'](SCENE_FOCAL_LENGTH_MIN_MM, Math["min"](SCENE_FOCAL_LENGTH_MAX_MM, Number(_0x4d3dfc) || SCENE_DEFAULT_FOCAL_LENGTH_MM));
    this["_defaultSceneFocalLength"] = _0x15493d;
    this["_bridge"]?.["setDefaultSceneFocalLength"]?.(_0x15493d);
  }
  ["_getDefaultSceneFocalLength"]() {
    return this['_bridge']?.['getDefaultSceneFocalLength']?.() || this["_defaultSceneFocalLength"] || SCENE_DEFAULT_FOCAL_LENGTH_MM;
  }
  ["_isDefaultSceneView"](_0x2eedf0) {
    const _0x2a692d = createDefaultSceneView();
    return Math["abs"]((Number(_0x2eedf0?.["target"]?.['x']) || 0x0) - _0x2a692d["target"]['x']) < 1e-9 && Math["abs"]((Number(_0x2eedf0?.['target']?.['y']) || 0x0) - _0x2a692d["target"]['y']) < 1e-9 && Math["abs"]((Number(_0x2eedf0?.['target']?.['z']) || 0x0) - _0x2a692d["target"]['z']) < 1e-9 && Math["abs"]((Number(_0x2eedf0?.["orbitYaw"]) || 0x0) - _0x2a692d["orbitYaw"]) < 1e-9 && Math["abs"]((Number(_0x2eedf0?.['orbitPitch']) || 0x0) - _0x2a692d['orbitPitch']) < 1e-9 && Math["abs"]((Number(_0x2eedf0?.["orbitDistance"]) || 0x0) - _0x2a692d["orbitDistance"]) < 1e-9;
  }
  ['_maybeReleasePendingCameraJumpDraft']() {
    const _0x3f4a7a = this["_pendingCameraJumpCommit"];
    if (!_0x3f4a7a || this['_pendingCameraJumpReleaseRaf']) {
      return;
    }
    const _0x498560 = this["_sceneState"]?.["viewport"]?.["sceneView"] || null;
    const _0x1fe274 = this["_getDefaultSceneFocalLength"]();
    if (!areSceneViewsEquivalent(_0x498560, _0x3f4a7a["targetSceneView"])) {
      return;
    }
    if (Math["abs"](_0x1fe274 - _0x3f4a7a["targetFocalLength"]) > 0.000001) {
      return;
    }
    const _0x12c6d2 = _0x3f4a7a["token"];
    this["_pendingCameraJumpReleaseRaf"] = requestAnimationFrame(() => {
      this['_pendingCameraJumpReleaseRaf'] = 0x0;
      const _0x28541b = this["_pendingCameraJumpCommit"];
      if (!_0x28541b || _0x28541b["token"] !== _0x12c6d2) {
        return;
      }
      const _0x392737 = this["_sceneState"]?.["viewport"]?.["sceneView"] || null;
      const _0xc007ff = this["_getDefaultSceneFocalLength"]();
      if (!areSceneViewsEquivalent(_0x392737, _0x28541b["targetSceneView"])) {
        return;
      }
      if (Math["abs"](_0xc007ff - _0x28541b["targetFocalLength"]) > 0.000001) {
        return;
      }
      this["_pendingCameraJumpCommit"] = null;
      this["_bridge"]?.["clearDraftView"]?.();
    });
  }
  ['_maybePreloadCharacterModels'](_0x3e6b57 = null) {
    if (this["_isPanorama360"]) {
      return;
    }
    if (this['_hasRequestedCharacterPreload']) {
      return;
    }
    const _0xa10448 = this["_sceneState"]?.['ui']?.["isEditing"] === !![];
    const _0xe94a8a = _0x3e6b57?.['ui']?.["isEditing"] === !![];
    if (!_0xa10448 || _0xe94a8a) {
      return;
    }
    this['_hasRequestedCharacterPreload'] = !![];
    void preloadPanoramaCharacterModels()["catch"](() => {});
  }
  ["_commitCameraJumpTarget"]({
    targetPose: _0x2fc656,
    referenceSceneView: _0x369795,
    targetFocalLength: _0x4dc5cd
  }) {
    const _0x4f6548 = cameraPoseToSceneViewFromReference(_0x2fc656, _0x369795);
    this['_pendingCameraJumpCommit'] = {
      'token': this["_cameraJumpToken"],
      'targetSceneView': _0x4f6548,
      'targetFocalLength': _0x4dc5cd
    };
    this["_setDefaultSceneFocalLength"](_0x4dc5cd);
    applyPanoramaSceneViewCommit({
      'nodeId': this['id'],
      'sceneView': _0x4f6548,
      'activeView': "default",
      'activeCameraId': null
    });
    return _0x4f6548;
  }
  ['_animateCameraActivation'](_0x386a0d) {
    if (!this["_supportsCameraFeatures"]()) {
      return;
    }
    const _0x20c6d5 = (this["_sceneState"]?.["cameras"] || [])["find"](_0xb6b34c => _0xb6b34c['id'] === _0x386a0d) || null;
    if (!_0x20c6d5 || this['_sceneState']?.["mode"] !== "scene") {
      return;
    }
    const _0x7dec2 = _0x5c69f1 => {
      const _0x473fd8 = _0x5c69f1?.["quaternion"];
      if (Number["isFinite"](Number(_0x473fd8?.['x'])) && Number['isFinite'](Number(_0x473fd8?.['y'])) && Number["isFinite"](Number(_0x473fd8?.['z'])) && Number["isFinite"](Number(_0x473fd8?.['w']))) {
        return new a479_0x423d6e["Quaternion"](Number(_0x473fd8['x']), Number(_0x473fd8['y']), Number(_0x473fd8['z']), Number(_0x473fd8['w']))['normalize']();
      }
      const _0x26aa0d = _0x5c69f1?.['rotation'] || {
        'x': 0x0,
        'y': 0x0,
        'z': 0x0
      };
      return new a479_0x423d6e["Quaternion"]()["setFromEuler"](new a479_0x423d6e["Euler"](Number(_0x26aa0d['x']) || 0x0, Number(_0x26aa0d['y']) || 0x0, Number(_0x26aa0d['z']) || 0x0, "YXZ"));
    };
    const _0x11f102 = _0x7dec2(_0x20c6d5);
    const _0x3f1e16 = this['_sceneState']?.["viewport"]?.["sceneView"] || createDefaultSceneView();
    const _0x38a536 = {
      'kind': 'camera',
      'position': cloneVector3(_0x20c6d5["position"]),
      'quaternion': {
        'x': _0x11f102['x'],
        'y': _0x11f102['y'],
        'z': _0x11f102['z'],
        'w': _0x11f102['w']
      },
      'rotation': _0x20c6d5["rotation"] || quaternionToRotation(_0x11f102)
    };
    const _0x43c742 = Number['isFinite'](Number(_0x20c6d5?.['focalLength'])) ? Number(_0x20c6d5['focalLength']) : SCENE_DEFAULT_FOCAL_LENGTH_MM;
    const _0x44e3d1 = focalLengthToFov(_0x43c742);
    _0x38a536["fov"] = _0x44e3d1;
    this['_cancelCameraJumpAnimation']({
      'clearDraft': ![]
    });
    const _0x377d04 = this["_bridge"]?.['readCurrentViewPose']?.();
    if (!_0x377d04?.['position']) {
      this["_commitCameraJumpTarget"]({
        'targetPose': _0x38a536,
        'referenceSceneView': _0x3f1e16,
        'targetFocalLength': _0x43c742
      });
      return;
    }
    const _0x1cbe71 = this['_cameraJumpToken'];
    const _0x348933 = _0x7dec2(_0x377d04);
    const _0x349741 = {
      'kind': "camera",
      'position': cloneVector3(_0x377d04["position"]),
      'quaternion': {
        'x': _0x348933['x'],
        'y': _0x348933['y'],
        'z': _0x348933['z'],
        'w': _0x348933['w']
      },
      'rotation': _0x377d04['rotation'] || quaternionToRotation(_0x348933),
      'fov': Number["isFinite"](Number(_0x377d04['fov'])) ? Number(_0x377d04["fov"]) : 0x3a
    };
    const _0x555000 = 0x1c2;
    const _0x495ddf = performance["now"]();
    const _0x128f80 = _0x1f7d79 => {
      const _0x3a55ad = interpolateVector3(_0x349741['position'], _0x38a536['position'], _0x1f7d79);
      const _0x9360f6 = new a479_0x423d6e["Quaternion"](_0x349741["quaternion"]['x'], _0x349741["quaternion"]['y'], _0x349741["quaternion"]['z'], _0x349741["quaternion"]['w'])['slerp'](new a479_0x423d6e["Quaternion"](_0x38a536["quaternion"]['x'], _0x38a536["quaternion"]['y'], _0x38a536['quaternion']['z'], _0x38a536["quaternion"]['w']), _0x1f7d79);
      const _0x5e424f = lerp(_0x349741["fov"], _0x38a536["fov"], _0x1f7d79);
      this["_bridge"]?.['setDraftView']?.({
        'kind': "camera",
        'position': _0x3a55ad,
        'quaternion': {
          'x': _0x9360f6['x'],
          'y': _0x9360f6['y'],
          'z': _0x9360f6['z'],
          'w': _0x9360f6['w']
        },
        'rotation': quaternionToRotation(_0x9360f6),
        'fov': _0x5e424f,
        'disableSmoothing': !![]
      });
    };
    _0x128f80(0x0);
    const _0xce6916 = _0x354853 => {
      if (_0x1cbe71 !== this["_cameraJumpToken"]) {
        return;
      }
      const _0x39665b = Math["max"](0x0, _0x354853 - _0x495ddf);
      const _0x4a0da0 = Math["min"](0x1, _0x39665b / _0x555000);
      const _0x2b6920 = smootherstep(_0x4a0da0);
      _0x128f80(_0x2b6920);
      if (_0x4a0da0 < 0x1) {
        this["_cameraJumpRaf"] = requestAnimationFrame(_0xce6916);
        return;
      }
      this["_cameraJumpRaf"] = 0x0;
      this["_commitCameraJumpTarget"]({
        'targetPose': _0x38a536,
        'referenceSceneView': _0x3f1e16,
        'targetFocalLength': _0x43c742
      });
      this["_maybeReleasePendingCameraJumpDraft"]();
    };
    this["_cameraJumpRaf"] = requestAnimationFrame(_0xce6916);
  }
  ['_saveCurrentViewToCameraSlot'](_0x28bb78) {
    if (!this["_supportsCameraFeatures"]()) {
      return;
    }
    const _0x47b137 = this["_bridge"]?.["readCurrentViewPose"]?.();
    if (!_0x47b137) {
      return;
    }
    upsertPanoramaSceneCameraAtSlot({
      'nodeId': this['id'],
      'slot': _0x28bb78,
      'viewPose': _0x47b137
    });
  }
  ["_previewCameraTimelineAt"](_0x13a9c7, {
    fromPlayback = ![]
  } = {}) {
    if (!fromPlayback) {
      this["_stopCameraTimelinePlayback"]({
        'clearDraft': ![]
      });
    }
    const _0x1aab3e = normalizeCameraTimeline(this["_sceneState"]?.['cameraTimeline']);
    const _0x4517a5 = sampleCameraTimeline(_0x1aab3e, _0x13a9c7);
    if (!_0x4517a5) {
      return;
    }
    const _0xcec7f3 = cameraTimelineSampleToDraft(_0x4517a5);
    if (!_0xcec7f3) {
      return;
    }
    this['_timelinePreviewTime'] = _0x4517a5["time"];
    this["_bridge"]?.["setDraftView"]?.(_0xcec7f3);
    setCameraTimelineDisplayTime(this["_timelinePanelEl"], _0x4517a5["time"]);
  }
  ["_stopCameraTimelinePlayback"]({
    clearDraft = ![]
  } = {}) {
    this["_timelinePlaybackRaf"] && (cancelAnimationFrame(this["_timelinePlaybackRaf"]), this['_timelinePlaybackRaf'] = 0x0);
    this['_isTimelinePlaying'] = ![];
    if (clearDraft) {
      this["_bridge"]?.['clearDraftView']?.();
    }
    renderCameraTimelinePanel(this["_timelinePanelEl"], this['_sceneState']?.["cameraTimeline"], {
      'currentTime': this["_timelinePreviewTime"],
      'isPlaying': ![]
    });
  }
  ['_toggleCameraTimelinePlayback']() {
    if (this['_isTimelinePlaying']) {
      this["_stopCameraTimelinePlayback"]({
        'clearDraft': ![]
      });
      return;
    }
    const _0x366b0a = normalizeCameraTimeline(this['_sceneState']?.["cameraTimeline"]);
    if (_0x366b0a["keyframes"]["length"] < 0x2) {
      return;
    }
    this['_isTimelinePlaying'] = !![];
    this["_timelinePlaybackStartTime"] = this["_timelinePreviewTime"] >= _0x366b0a["duration"] ? 0x0 : this['_timelinePreviewTime'] || _0x366b0a["currentTime"];
    this["_timelinePlaybackStartedAt"] = performance["now"]();
    const _0x5043e7 = _0x51d74e => {
      if (!this["_isTimelinePlaying"]) {
        return;
      }
      const _0x1d8ec0 = normalizeCameraTimeline(this["_sceneState"]?.["cameraTimeline"]);
      const _0x4d7478 = (_0x51d74e - this["_timelinePlaybackStartedAt"]) / 0x3e8;
      let _0xd5273d = this['_timelinePlaybackStartTime'] + _0x4d7478;
      if (_0x1d8ec0["loop"] && _0x1d8ec0["duration"] > 0x0) {
        _0xd5273d %= _0x1d8ec0["duration"];
      } else {
        if (_0xd5273d >= _0x1d8ec0["duration"]) {
          this["_previewCameraTimelineAt"](_0x1d8ec0["duration"], {
            'fromPlayback': !![]
          });
          this["_stopCameraTimelinePlayback"]({
            'clearDraft': ![]
          });
          return;
        }
      }
      this["_previewCameraTimelineAt"](_0xd5273d, {
        'fromPlayback': !![]
      });
      this['_timelinePlaybackRaf'] = requestAnimationFrame(_0x5043e7);
    };
    renderCameraTimelinePanel(this['_timelinePanelEl'], _0x366b0a, {
      'currentTime': this["_timelinePreviewTime"],
      'isPlaying': !![]
    });
    this["_timelinePlaybackRaf"] = requestAnimationFrame(_0x5043e7);
  }
  ["_handleCameraShortcutEvent"](_0x15ff28) {
    if (!this["_supportsCameraFeatures"]()) {
      return;
    }
    const _0x35c38c = _0x15ff28?.["detail"] || {};
    if (_0x35c38c["nodeId"] !== this['id']) {
      return;
    }
    if (!this['_isEditing']()) {
      return;
    }
    const _0x3ca0bd = normalizeCameraSlot(_0x35c38c["slot"]);
    if (!_0x3ca0bd) {
      return;
    }
    if (_0x35c38c["mode"] === "save") {
      this["_saveCurrentViewToCameraSlot"](_0x3ca0bd);
      return;
    }
    const _0x391137 = this["_resolveCameraBySlot"](_0x3ca0bd);
    if (!_0x391137?.["camera"]?.['id']) {
      return;
    }
    this['_animateCameraActivation'](_0x391137['camera']['id']);
  }
  ["_handleCaptureShortcutEvent"](_0x51f9b2) {
    const _0x2d4275 = _0x51f9b2?.["detail"] || {};
    if (_0x2d4275["nodeId"] !== this['id']) {
      return;
    }
    if (!this["_isEditing"]()) {
      return;
    }
    void this['_handleToolbarAction']('capture');
  }
  ["_createCaptureMenu"]() {
    const _0x1afae7 = document["createElement"]('div');
    _0x1afae7["className"] = "panorama-capture-menu";
    _0x1afae7["hidden"] = !![];
    _0x1afae7["innerHTML"] = "\n      <div class=\"panorama-capture-menu__grid\">\n        " + PANORAMA_CAPTURE_MODE_OPTIONS['map'](_0x22be5e => {
      const _0x1cde32 = getCaptureModeLabel(_0x22be5e);
      return "\n            <button\n              type=\"button\"\n              class=\"panorama-capture-menu__item\"\n              data-capture-mode=\"" + _0x22be5e["key"] + "\"\n              aria-label=\"" + panoramaSceneText("capture.modeAria", {
        'label': _0x1cde32
      }) + '\x22\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22panorama-capture-menu__icon\x20' + _0x22be5e["iconClass"] + "\" aria-hidden=\"true\">\n                <span class=\"panorama-capture-menu__icon-shape\"></span>\n              </span>\n              <span class=\"panorama-capture-menu__label\">" + _0x1cde32 + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20';
    })["join"]('') + "\n      </div>\n    ";
    return _0x1afae7;
  }
  ["_handleCaptureMenuClick"](_0x5e2184) {
    const _0xfb4d17 = _0x5e2184['target']?.["closest"]?.("[data-capture-mode]");
    if (!(_0xfb4d17 instanceof HTMLButtonElement)) {
      return;
    }
    const _0x5aa9b1 = _0xfb4d17["dataset"]['captureMode'] || "adaptive";
    this["_selectNodeOnCanvas"]();
    setPanoramaSceneCaptureMode({
      'nodeId': this['id'],
      'mode': _0x5aa9b1,
      'showSafeFrame': _0x5aa9b1 !== "adaptive"
    });
  }
  ["_createFocusMenu"]() {
    const _0x43784c = document["createElement"]("div");
    _0x43784c['className'] = "panorama-scene-focus-menu";
    _0x43784c["hidden"] = !![];
    const _0x38b179 = document["createElement"]("div");
    _0x38b179["className"] = "panorama-scene-focus-menu__header";
    const _0xff673c = document["createElement"]('span');
    _0xff673c["className"] = "panorama-scene-focus-menu__title";
    _0xff673c["textContent"] = panoramaSceneText("focus.title");
    _0x38b179["appendChild"](_0xff673c);
    const _0x528e4a = document["createElement"]("span");
    _0x528e4a["className"] = "panorama-scene-focus-menu__value";
    _0x38b179["appendChild"](_0x528e4a);
    const _0x56cbf9 = document["createElement"]("input");
    _0x56cbf9["className"] = "panorama-scene-focus-menu__slider";
    _0x56cbf9["type"] = 'range';
    _0x56cbf9["min"] = String(SCENE_FOCAL_LENGTH_MIN_MM);
    _0x56cbf9["max"] = String(SCENE_FOCAL_LENGTH_MAX_MM);
    _0x56cbf9["step"] = '1';
    _0x56cbf9['setAttribute']("aria-label", panoramaSceneText('focus.sliderAria'));
    const _0x2da727 = () => {
      const _0x33321a = Math['max'](SCENE_FOCAL_LENGTH_MIN_MM, Math["min"](SCENE_FOCAL_LENGTH_MAX_MM, Number(this["_getDefaultSceneFocalLength"]()) || SCENE_DEFAULT_FOCAL_LENGTH_MM));
      _0x56cbf9['value'] = String(_0x33321a);
      _0x528e4a['textContent'] = String(Math['round'](_0x33321a));
    };
    _0x56cbf9['addEventListener']("input", _0x4e1d7e => {
      const _0x3a977f = Math['max'](SCENE_FOCAL_LENGTH_MIN_MM, Math["min"](SCENE_FOCAL_LENGTH_MAX_MM, Number(_0x4e1d7e["currentTarget"]?.['value']) || SCENE_DEFAULT_FOCAL_LENGTH_MM));
      _0x528e4a['textContent'] = String(Math['round'](_0x3a977f));
      this["_setDefaultSceneFocalLength"](_0x3a977f);
    });
    _0x43784c["appendChild"](_0x38b179);
    _0x43784c['appendChild'](_0x56cbf9);
    _0x43784c["_syncValue"] = _0x2da727;
    _0x2da727();
    return _0x43784c;
  }
  ["_resolveCaptureMode"]() {
    return normalizeCaptureMode(this['_sceneState']?.["capture"]?.["mode"]);
  }
  ["_resolveCaptureFrameRect"]() {
    const _0x1ae766 = this["_viewportEl"]?.['clientWidth'] || 0x0;
    const _0x4197e5 = this["_viewportEl"]?.["clientHeight"] || 0x0;
    return computeCaptureFrameRect(_0x1ae766, _0x4197e5, this["_resolveCaptureMode"]());
  }
  ["_syncCaptureMenuState"]() {
    if (!this["_captureMenuEl"]) {
      return;
    }
    const _0x104418 = this["_resolveCaptureMode"]();
    this["_captureMenuEl"]['querySelectorAll']('[data-capture-mode]')["forEach"](_0x4b1640 => {
      const _0x20ec00 = _0x4b1640["dataset"]["captureMode"] === _0x104418;
      _0x4b1640["classList"]["toggle"]("is-active", _0x20ec00);
      _0x4b1640["setAttribute"]("aria-pressed", _0x20ec00 ? "true" : "false");
    });
  }
  ["_syncCaptureSafeFrame"]() {
    if (!this["_captureSafeFrameEl"] || !this["_captureSafeFrameLabelEl"]) {
      return;
    }
    const _0x5999c5 = this['_resolveCaptureMode']();
    const _0x189c0d = this["_isEditing"]() && this["_isNodeSelected"]() && _0x5999c5 !== "adaptive" && this['_sceneState']?.["capture"]?.["showSafeFrame"] === !![];
    this['_captureSafeFrameEl']["hidden"] = !_0x189c0d;
    this["_captureSafeFrameEl"]["classList"]["toggle"]('is-visible', _0x189c0d);
    this["_captureSafeFrameEl"]["classList"]["toggle"]("is-adaptive", _0x5999c5 === 'adaptive');
    if (!_0x189c0d) {
      return;
    }
    const _0x2e6444 = this['_resolveCaptureFrameRect']();
    this["_captureSafeFrameEl"]["style"]['left'] = _0x2e6444['x'] + 'px';
    this['_captureSafeFrameEl']['style']["top"] = _0x2e6444['y'] + 'px';
    this["_captureSafeFrameEl"]["style"]['width'] = _0x2e6444["width"] + 'px';
    this["_captureSafeFrameEl"]["style"]["height"] = _0x2e6444["height"] + 'px';
    this["_captureSafeFrameLabelEl"]["textContent"] = getCaptureModeLabel(_0x5999c5);
  }
  async ["_captureViewportByCurrentMode"]() {
    const _0x33dd6c = await this['_bridge']?.['captureBlob']?.({
      'includeEditorOverlays': ![]
    });
    if (!_0x33dd6c) {
      return null;
    }
    return cropCaptureBlobToFrame({
      'blob': _0x33dd6c,
      'viewportWidth': this["_viewportEl"]?.["clientWidth"] || 0x0,
      'viewportHeight': this['_viewportEl']?.['clientHeight'] || 0x0,
      'mode': this['_resolveCaptureMode']()
    });
  }
  ["_createGridPanel"]() {
    const _0xf7f171 = document["createElement"]("div");
    _0xf7f171['className'] = "panorama-grid-panel";
    _0xf7f171['innerHTML'] = "\n      <div class=\"panorama-grid-panel__title\">" + panoramaSceneText('grid.title') + '</div>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22panorama-grid-panel__metrics-row\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<label\x20class=\x22panorama-grid-panel__metric-item\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22panorama-grid-panel__metric-label\x22\x20data-grid-label=\x22rows\x22>' + panoramaSceneText("grid.rows") + "</span>\n          <div class=\"panorama-grid-panel__metric-control rh-stepper\">\n            <div class=\"rh-stepper-value panorama-grid-panel__metric-stepper\" data-grid-field=\"rows\" role=\"spinbutton\" aria-label=\"" + panoramaSceneText('grid.rowsAria') + "\" aria-valuenow=\"1\" tabindex=\"0\">1</div>\n          </div>\n        </label>\n        <label class=\"panorama-grid-panel__metric-item\">\n          <span class=\"panorama-grid-panel__metric-label\" data-grid-label=\"cols\">" + panoramaSceneText("grid.cols") + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22panorama-grid-panel__metric-control\x20rh-stepper\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-stepper-value\x20panorama-grid-panel__metric-stepper\x22\x20data-grid-field=\x22cols\x22\x20role=\x22spinbutton\x22\x20aria-label=\x22' + panoramaSceneText('grid.colsAria') + "\" aria-valuenow=\"1\" tabindex=\"0\">1</div>\n          </div>\n        </label>\n      </div>\n      <div class=\"panorama-grid-panel__metrics-row\">\n        <label class=\"panorama-grid-panel__metric-item\">\n          <span class=\"panorama-grid-panel__metric-label\" data-grid-label=\"spacingX\">" + panoramaSceneText("grid.spacingX") + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22panorama-grid-panel__metric-control\x20rh-stepper\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-stepper-value\x20panorama-grid-panel__metric-stepper\x22\x20data-grid-field=\x22spacingX\x22\x20role=\x22spinbutton\x22\x20aria-label=\x22' + panoramaSceneText("grid.spacingXAria") + '\x22\x20aria-valuenow=\x221.0\x22\x20tabindex=\x220\x22>1.0</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</label>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<label\x20class=\x22panorama-grid-panel__metric-item\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22panorama-grid-panel__metric-label\x22\x20data-grid-label=\x22spacingZ\x22>' + panoramaSceneText("grid.spacingZ") + "</span>\n          <div class=\"panorama-grid-panel__metric-control rh-stepper\">\n            <div class=\"rh-stepper-value panorama-grid-panel__metric-stepper\" data-grid-field=\"spacingZ\" role=\"spinbutton\" aria-label=\"" + panoramaSceneText("grid.spacingZAria") + "\" aria-valuenow=\"1.0\" tabindex=\"0\">1.0</div>\n          </div>\n        </label>\n      </div>\n      <div class=\"panorama-grid-panel__appearance-row\">\n        <div class=\"panorama-grid-panel__appearance-group panorama-grid-panel__appearance-group--gender\">\n          <span class=\"panorama-grid-panel__appearance-label\" data-grid-label=\"gender\">" + panoramaSceneText("grid.gender") + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22panorama-grid-panel__appearance-options\x20panorama-grid-panel__appearance-options--gender\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + PANORAMA_MANNEQUIN_GENDER_OPTIONS["map"](([_0x221c86,, _0x173a27]) => {
      const _0x235798 = getPanoramaMannequinGenderLabel(_0x221c86);
      return "<button type=\"button\" class=\"panorama-mannequin-menu__gender-btn\" data-grid-gender=\"" + _0x221c86 + "\" aria-label=\"" + panoramaSceneText("grid.setGenderAria", {
        'label': _0x235798
      }) + '\x22>' + _0x173a27 + "</button>";
    })["join"]('') + "\n          </div>\n        </div>\n        <div class=\"panorama-grid-panel__appearance-group panorama-grid-panel__appearance-group--color\">\n          <span class=\"panorama-grid-panel__appearance-label\" data-grid-label=\"color\">" + panoramaSceneText("grid.color") + "</span>\n          <div class=\"panorama-grid-panel__appearance-options panorama-grid-panel__appearance-options--color\">\n            " + PANORAMA_MANNEQUIN_COLOR_OPTIONS["map"](([_0xe09019]) => {
      const _0x1e871e = getPanoramaMannequinColorLabel(_0xe09019);
      return "<button type=\"button\" class=\"panorama-mannequin-menu__color-btn\" data-grid-color=\"" + _0xe09019 + "\" aria-label=\"" + panoramaSceneText("grid.setColorAria", {
        'label': _0x1e871e
      }) + "\"></button>";
    })["join"]('') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22panorama-grid-panel__apply\x22>' + panoramaSceneText("grid.apply") + '</button>\x0a\x20\x20\x20\x20';
    const _0x552221 = {
      'rows': {
        'min': 0x1,
        'max': 0xc,
        'step': 0x1,
        'precision': 0x0
      },
      'cols': {
        'min': 0x1,
        'max': 0xc,
        'step': 0x1,
        'precision': 0x0
      },
      'spacingX': {
        'min': 0.5,
        'max': 0x8,
        'step': 0.1,
        'precision': 0x1
      },
      'spacingZ': {
        'min': 0.5,
        'max': 0x8,
        'step': 0.1,
        'precision': 0x1
      }
    };
    const _0x1b421d = (_0x1da765, _0x325a4c) => {
      const _0x3e2a18 = _0x552221[_0x1da765];
      if (!_0x3e2a18) {
        return null;
      }
      const _0x3b246e = Number(_0x325a4c);
      if (!Number["isFinite"](_0x3b246e)) {
        return null;
      }
      const _0x3c72b8 = Math['min'](_0x3e2a18["max"], Math["max"](_0x3e2a18["min"], _0x3b246e));
      if (_0x3e2a18["precision"] === 0x0) {
        return Math['round'](_0x3c72b8);
      }
      return Number(_0x3c72b8["toFixed"](_0x3e2a18['precision']));
    };
    const _0x200fda = (_0x1639c9, _0x50f670) => {
      const _0x27471f = _0x552221[_0x1639c9];
      if (!_0x27471f || !Number["isFinite"](Number(_0x50f670))) {
        return '';
      }
      return _0x27471f['precision'] === 0x0 ? String(Math["round"](Number(_0x50f670))) : Number(_0x50f670)["toFixed"](_0x27471f['precision']);
    };
    const _0x3bcde9 = (_0x5634c6, _0x123712, _0x5840f4) => {
      if (!_0x5634c6) {
        return;
      }
      const _0x395e94 = _0x200fda(_0x123712, _0x5840f4);
      _0x5634c6['tagName'] === "INPUT" ? _0x5634c6["value"] = _0x395e94 : (_0x5634c6["textContent"] = _0x395e94, _0x5634c6["setAttribute"]("aria-valuenow", String(_0x5840f4)));
    };
    const _0x3d92cf = (_0x1b376d, _0x5908d9) => {
      const _0x5bdee1 = _0x1b421d(_0x1b376d, _0x5908d9);
      if (!Number["isFinite"](_0x5bdee1)) {
        return;
      }
      setPanoramaSceneGridPlacement({
        'nodeId': this['id'],
        'patch': {
          [_0x1b376d]: _0x5bdee1
        }
      });
      const _0x48c9a5 = _0xf7f171["querySelector"]("[data-grid-field=\"" + _0x1b376d + '\x22]');
      _0x3bcde9(_0x48c9a5, _0x1b376d, _0x5bdee1);
    };
    Object['keys'](_0x552221)["forEach"](_0x1fb367 => {
      const _0x354e1a = _0x552221[_0x1fb367];
      const _0x443de9 = _0xf7f171["querySelector"]("[data-grid-field=\"" + _0x1fb367 + '\x22]');
      if (!_0x443de9) {
        return;
      }
      let _0x8fc308 = null;
      let _0x5aa66b = ![];
      const _0x23b914 = () => {
        const _0x36da0b = _0x1b421d(_0x1fb367, this["_sceneState"]?.["gridPlacement"]?.[_0x1fb367]);
        if (Number['isFinite'](_0x36da0b)) {
          return _0x36da0b;
        }
        const _0xb49c16 = _0x1b421d(_0x1fb367, _0x443de9["getAttribute"]("aria-valuenow"));
        if (Number["isFinite"](_0xb49c16)) {
          return _0xb49c16;
        }
        return _0x354e1a['min'];
      };
      const _0x5a2d2c = _0x264bca => {
        if (!_0x8fc308) {
          return;
        }
        const _0x8cd0e6 = _0x264bca['clientX'] - _0x8fc308['x'];
        if (!_0x8fc308["moved"] && Math['abs'](_0x8cd0e6) >= 0x3) {
          _0x8fc308['moved'] = !![];
        }
        const _0x2b3c4f = Math["trunc"](_0x8cd0e6 / 0x6);
        const _0x7932bf = _0x8fc308['v'] + _0x2b3c4f * _0x354e1a["step"];
        if (_0x7932bf === _0x8fc308["last"]) {
          return;
        }
        _0x8fc308["last"] = _0x7932bf;
        _0x3d92cf(_0x1fb367, _0x7932bf);
      };
      const _0x221c2a = () => {
        if (!_0x8fc308) {
          return;
        }
        const _0x1f6c89 = _0x8fc308["moved"];
        _0x8fc308['el']["classList"]['remove']("is-dragging");
        document["removeEventListener"]("mousemove", _0x5a2d2c);
        document["removeEventListener"]("mouseup", _0x221c2a);
        _0x1f6c89 && (_0x5aa66b = !![], this["_suppressDocClickOnce"] = !![]);
        _0x8fc308 = null;
      };
      const _0x20bb3d = _0xa7c26d => {
        const _0x225eb5 = _0x23b914();
        const _0x360530 = document["createElement"]("input");
        _0x360530["className"] = "rh-stepper-input panorama-grid-panel__metric-stepper-input";
        _0x360530["type"] = "number";
        _0x360530["step"] = String(_0x354e1a['step']);
        _0x360530['min'] = String(_0x354e1a["min"]);
        _0x360530["max"] = String(_0x354e1a["max"]);
        _0x360530["value"] = _0x200fda(_0x1fb367, _0x225eb5);
        _0xa7c26d["replaceWith"](_0x360530);
        _0x360530['focus']();
        _0x360530["select"]();
        const _0x275d54 = _0x5e5310 => {
          const _0x2fbe61 = _0x5e5310 ? _0x360530["value"] : _0x225eb5;
          const _0x32074d = _0x1b421d(_0x1fb367, _0x2fbe61);
          const _0x1c5430 = Number['isFinite'](_0x32074d) ? _0x32074d : _0x225eb5;
          const _0x25fd30 = document["createElement"]("div");
          _0x25fd30["className"] = "rh-stepper-value panorama-grid-panel__metric-stepper";
          _0x25fd30["dataset"]["gridField"] = _0x1fb367;
          _0x25fd30["setAttribute"]("role", "spinbutton");
          _0x25fd30["setAttribute"]("tabindex", '0');
          const _0x1b6a99 = _0xa7c26d["getAttribute"]("aria-label") || _0x1fb367;
          _0x25fd30['setAttribute']("aria-label", _0x1b6a99);
          _0x25fd30["setAttribute"]("aria-valuenow", String(_0x1c5430));
          _0x25fd30['textContent'] = _0x200fda(_0x1fb367, _0x1c5430);
          _0x360530["replaceWith"](_0x25fd30);
          _0x5e5310 ? _0x3d92cf(_0x1fb367, _0x1c5430) : _0x3bcde9(_0x25fd30, _0x1fb367, _0x1c5430);
          _0x59275d(_0x25fd30);
        };
        _0x360530["onkeydown"] = _0x50f62f => {
          if (_0x50f62f['key'] === 'Enter') {
            _0x275d54(!![]);
          }
          if (_0x50f62f["key"] === "Escape") {
            _0x275d54(![]);
          }
        };
        _0x360530['onblur'] = () => _0x275d54(!![]);
      };
      const _0x59275d = _0x44d684 => {
        _0x44d684["onclick"] = _0x2e3e85 => {
          _0x2e3e85["stopPropagation"]();
          if (_0x5aa66b) {
            _0x5aa66b = ![];
            return;
          }
          _0x20bb3d(_0x44d684);
        };
        _0x44d684["onkeydown"] = _0x5035dc => {
          const _0x4100df = _0x5035dc["key"] === "ArrowRight" ? 0x1 : _0x5035dc["key"] === 'ArrowLeft' ? -0x1 : 0x0;
          if (_0x4100df) {
            _0x5035dc["preventDefault"]();
            _0x5035dc["stopPropagation"]();
            const _0x1b2ce9 = _0x23b914();
            _0x3d92cf(_0x1fb367, _0x1b2ce9 + _0x4100df * _0x354e1a["step"]);
            return;
          }
          (_0x5035dc["key"] === 'Enter' || _0x5035dc["key"] === '\x20') && (_0x5035dc["preventDefault"](), _0x5035dc["stopPropagation"](), _0x20bb3d(_0x44d684));
        };
        _0x44d684["onmousedown"] = _0x1707ec => {
          if (_0x1707ec["button"] !== 0x0) {
            return;
          }
          _0x1707ec["preventDefault"]();
          _0x5aa66b = ![];
          const _0x2cc41a = _0x23b914();
          _0x8fc308 = {
            'x': _0x1707ec["clientX"],
            'v': _0x2cc41a,
            'moved': ![],
            'last': _0x2cc41a,
            'el': _0x44d684
          };
          _0x44d684["classList"]["add"]("is-dragging");
          document["addEventListener"]("mousemove", _0x5a2d2c);
          document["addEventListener"]("mouseup", _0x221c2a);
        };
      };
      _0x59275d(_0x443de9);
    });
    _0xf7f171["querySelectorAll"]("[data-grid-gender]")["forEach"](_0x36b2ac => {
      _0x36b2ac["addEventListener"]('click', () => {
        const _0x6dbf39 = _0x36b2ac['dataset']['gridGender'] === 'female' ? "female" : "male";
        setPanoramaSceneGridPlacement({
          'nodeId': this['id'],
          'patch': {
            'gender': _0x6dbf39
          }
        });
      });
    });
    _0xf7f171["querySelectorAll"]("[data-grid-color]")["forEach"](_0xd70782 => {
      _0xd70782["addEventListener"]('click', () => {
        const _0x4bc86a = _0xd70782["dataset"]["gridColor"] || "blue";
        setPanoramaSceneGridPlacement({
          'nodeId': this['id'],
          'patch': {
            'colorKey': _0x4bc86a
          }
        });
      });
    });
    _0xf7f171["querySelector"](".panorama-grid-panel__apply")?.['addEventListener']("click", () => {
      this["_selectNodeOnCanvas"]();
      addPanoramaSceneMannequinGrid({
        'nodeId': this['id'],
        'viewPose': this["_bridge"]?.["readCurrentViewPose"]?.()
      });
      this['_openMenuKey'] = null;
      this['_syncOverlayState']();
    });
    return _0xf7f171;
  }
  ["_isNodeSelected"]() {
    return this["_isSelected"] === !![];
  }
  ['_handleWindowResize']() {
    this["_positionMenus"]();
    this["_syncCaptureSafeFrame"]();
  }
  ["_isBrowserFullscreen"]() {
    return !!this['_browserFullscreenOverlayEl'];
  }
  async ["_enterBrowserFullscreen"]() {
    if (this["_isBrowserFullscreen"]() || !this["_shellEl"]) {
      return;
    }
    const _0x4c54e2 = document['createElement']("div");
    _0x4c54e2['className'] = "panorama-scene-browser-fullscreen";
    const _0x312f91 = document["createElement"]('button');
    _0x312f91['type'] = "button";
    _0x312f91["className"] = "panorama-scene-browser-fullscreen__exit";
    _0x312f91["textContent"] = panoramaSceneText('toolbar.exitFullscreen');
    _0x312f91["setAttribute"]("aria-label", panoramaSceneText("toolbar.exitFullscreen"));
    _0x312f91['addEventListener']("click", () => {
      void this["_exitBrowserFullscreen"]();
    });
    this['_browserFullscreenExitBtnEl'] = _0x312f91;
    _0x4c54e2['appendChild'](_0x312f91);
    _0x4c54e2['appendChild'](this['_shellEl']);
    document["body"]["appendChild"](_0x4c54e2);
    this["_browserFullscreenOverlayEl"] = _0x4c54e2;
    this["_syncToolbarState"]();
    this['_syncOverlayState']();
    this["_positionMenus"]();
    this["_bridge"]?.["resize"]();
  }
  async ["_exitBrowserFullscreen"]({
    skipSync = ![]
  } = {}) {
    if (!this['_isBrowserFullscreen']()) {
      return;
    }
    const _0x1bf053 = this["_browserFullscreenOverlayEl"];
    this["_browserFullscreenOverlayEl"] = null;
    this["_browserFullscreenExitBtnEl"] = null;
    this["_shellEl"] && this['el']?.['isConnected'] && (this["_browserFullscreenAnchorEl"]?.["parentElement"] === this['el'] ? this['el']['insertBefore'](this['_shellEl'], this["_browserFullscreenAnchorEl"]["nextSibling"]) : this['el']["appendChild"](this['_shellEl']));
    _0x1bf053?.["remove"]?.();
    if (skipSync) {
      return;
    }
    this["_syncToolbarState"]();
    this["_syncOverlayState"]();
    this['_positionMenus']();
    this['_bridge']?.['resize']();
  }
  ['_handleOwnedNavigationKeyDown'](_0x20d07b, _0x241ec8) {
    if (!_0x241ec8 || _0x20d07b['ctrlKey'] || _0x20d07b["metaKey"] || _0x20d07b["altKey"]) {
      return ![];
    }
    if (!_0x20d07b["repeat"] && (_0x20d07b["key"] === 'f' || _0x20d07b["key"] === 'F')) {
      _0x20d07b['preventDefault']();
      _0x20d07b["stopPropagation"]();
      _0x20d07b["shiftKey"] ? setPanoramaSceneInteractionOptions({
        'nodeId': this['id'],
        'patch': {
          'navigationMode': this['_sceneState']?.['ui']?.["navigationMode"] === "fly" ? "orbit" : "fly"
        }
      }) : focusPanoramaSceneSelection({
        'nodeId': this['id'],
        'frame': this['_bridge']?.["readSelectionFrame"]?.()
      });
      return !![];
    }
    return this["_sceneState"]?.['ui']?.["navigationMode"] === 'fly' && this["_interaction"]?.["handleFlightKeyDown"]?.(_0x20d07b) === !![];
  }
  ["_handleWindowKeyDown"](_0x571de4) {
    if (_0x571de4["key"] === "Escape" && this["_isBrowserFullscreen"]()) {
      _0x571de4['preventDefault']();
      _0x571de4["stopPropagation"]();
      _0x571de4['stopImmediatePropagation']?.();
      void this["_exitBrowserFullscreen"]();
      return;
    }
    if (!this["_isEditing"]()) {
      return;
    }
    if (this['_contextMenuEl']?.['hidden'] === ![] && resolveShortcutActionForEvent(_0x571de4, ['delete']) === "delete") {
      _0x571de4["preventDefault"]?.();
      _0x571de4['stopPropagation']?.();
      _0x571de4["stopImmediatePropagation"]?.();
      this["_contextMenuEl"]["querySelector"]?.(".act-delete-selected")?.['click']?.();
      return;
    }
    const _0x1959a0 = _0x571de4["target"];
    const _0x2fc5ef = _0x1959a0 instanceof HTMLElement && (_0x1959a0["isContentEditable"] || _0x1959a0['tagName'] === "INPUT" || _0x1959a0["tagName"] === "TEXTAREA" || _0x1959a0["tagName"] === "SELECT");
    const _0x4cf2e2 = _0x1959a0 instanceof HTMLElement && (this['el']?.['contains']?.(_0x1959a0) || this['_browserFullscreenOverlayEl']?.["contains"]?.(_0x1959a0));
    if (!_0x2fc5ef && this["_handleOwnedNavigationKeyDown"](_0x571de4, _0x4cf2e2)) {
      _0x571de4['stopImmediatePropagation']?.();
      return;
    }
    if (_0x571de4['defaultPrevented']) {
      return;
    }
    if (_0x2fc5ef) {
      return;
    }
  }
  ["_handleWindowKeyUp"](_0x9d3483) {
    if (!this["_isEditing"]()) {
      return;
    }
    this["_interaction"]?.["handleFlightKeyUp"]?.(_0x9d3483) && _0x9d3483['stopImmediatePropagation']?.();
  }
  ["_handleWindowBlur"]() {
    this["_interaction"]?.["cancelFlightNavigation"]?.({
      'commit': !![]
    });
  }
  ["_syncAttachedUiVisibility"](_0x1f3663) {
    this["_bottomToolbarAnchorEl"] && (this['_bottomToolbarAnchorEl']["hidden"] = !_0x1f3663);
    const _0x74e5f8 = this['_isNodeSelected']() || this["_isNodeHovered"];
    this["_infoDockEl"] && (this["_infoDockEl"]["hidden"] = !_0x74e5f8);
  }
  ['_handleNodePointerEnter']() {
    this["_isNodeHovered"] = !![];
    this["_syncAttachedUiVisibility"](this["_shouldShowBottomToolbar"]());
  }
  ['_handleNodePointerLeave'](_0xc4294b) {
    const _0x27bf6f = _0xc4294b['relatedTarget'];
    if (_0x27bf6f && this['el']['contains'](_0x27bf6f)) {
      return;
    }
    this["_isNodeHovered"] = ![];
    this["_closeObjectContextMenu"]();
    this["_syncAttachedUiVisibility"](this['_shouldShowBottomToolbar']());
  }
  ['_selectNodeOnCanvas']({
    preserveExistingSelection = ![]
  } = {}) {
    const _0x49ceb2 = a479_0x4b5d07["getStateRaw"]()["selectedNodeIds"] || [];
    if (preserveExistingSelection && _0x49ceb2["includes"](this['id'])) {
      return;
    }
    if (_0x49ceb2["length"] === 0x1 && _0x49ceb2[0x0] === this['id']) {
      return;
    }
    a479_0x4b5d07["setSelectedNodes"]([this['id']]);
  }
  ["_isEditing"]() {
    return this['_sceneState']?.['ui']?.["isEditing"] === !![] && this["_data"]?.['isCollapsed'] !== !![];
  }
  ['_shouldShowBottomToolbar']() {
    const _0x4def18 = this["_isNodeSelected"]();
    return this["_isEditing"]() && _0x4def18;
  }
  ["_resolveMouseTool"]() {
    return this["_sceneState"]?.['ui']?.["mouseTool"] || (this["_sceneState"]?.['ui']?.['activeTool'] === 'box-select' ? 'box-select' : "navigate");
  }
  ["_toggleMouseTool"]() {
    const _0x3651e4 = String(this["_sceneState"]?.['ui']?.["mouseTool"] || this['_sceneState']?.['ui']?.["activeTool"] || '')["trim"]();
    const _0x58aa42 = resolveNextPanoramaMouseTool(_0x3651e4);
    setPanoramaSceneTool({
      'nodeId': this['id'],
      'tool': _0x58aa42
    });
  }
  ["_resolveTransformTool"]() {
    return this["_sceneState"]?.['ui']?.["transformTool"] || (this["_sceneState"]?.['ui']?.['activeTool'] === "move" || this["_sceneState"]?.['ui']?.["activeTool"] === "rotate" || this['_sceneState']?.['ui']?.["activeTool"] === "scale" ? this["_sceneState"]['ui']['activeTool'] : "move");
  }
  ["_supportsPanoramaUpload"]() {
    return this["_isPanorama360"] === !![];
  }
  ['_supportsCubeCreation']() {
    return this["_isPanorama360"] !== !![];
  }
  ["_supportsCameraFeatures"]() {
    return this["_isPanorama360"] !== !![];
  }
  ["_buildPanorama360IncomingImageSignature"](_0x4ed4b8) {
    if (!this["_isPanorama360"]) {
      return '';
    }
    const _0x100d29 = _0x4ed4b8?.["nodes"] || {};
    const _0x76e48f = _0x100d29[this['id']];
    if (!_0x76e48f) {
      return '';
    }
    const _0x51173c = String(_0x76e48f['parentId'] || '')["trim"]();
    const _0xdff044 = Object['values'](_0x4ed4b8?.["edges"] || {});
    const _0x346646 = [];
    _0xdff044['forEach'](_0x29ca18 => {
      if (!_0x29ca18) {
        return;
      }
      const _0x303ed6 = _0x29ca18["targetId"] === this['id'];
      const _0x1a3d16 = !!_0x51173c && _0x29ca18['targetId'] === _0x51173c;
      if (!_0x303ed6 && !_0x1a3d16) {
        return;
      }
      const _0x12a5d8 = _0x100d29[_0x29ca18["sourceId"]];
      if (!_0x12a5d8 || !isPanorama360ImageSourceType(_0x12a5d8['type'])) {
        return;
      }
      const _0x39a8d7 = typeof _0x12a5d8["_bizRev"] === "number" || typeof _0x12a5d8["_bizRev"] === 'string' ? String(_0x12a5d8["_bizRev"]) : '';
      const _0x3f2b72 = Array["isArray"](_0x12a5d8["images"]) ? _0x12a5d8['images'] : [];
      const _0x4ef5e9 = Number(_0x12a5d8["mainImageIndex"]);
      const _0x3bf06c = Number["isFinite"](_0x4ef5e9) ? Math["max"](0x0, Math["min"](_0x3f2b72["length"] - 0x1, Math['trunc'](_0x4ef5e9))) : 0x0;
      const _0xd20b8d = _0x3f2b72[_0x3bf06c] || _0x3f2b72[0x0] || null;
      const _0x5e3a6b = [String(_0x12a5d8["localPath"] || '')['trim'](), String(_0x12a5d8["originalLocalPath"] || '')["trim"](), String(_0x12a5d8["displayLocalPath"] || '')["trim"](), String(_0x12a5d8["thumbLocalPath"] || '')["trim"](), String(_0x12a5d8["imageUrl"] || '')['trim'](), String(_0x12a5d8["src"] || '')["trim"](), String(_0x12a5d8["thumbUrl"] || '')["trim"](), String(_0x12a5d8['fileName'] || '')["trim"](), String(_0x12a5d8["mainImageIndex"] || '')['trim'](), String(_0xd20b8d?.["localPath"] || '')['trim'](), String(_0xd20b8d?.['originalLocalPath'] || '')["trim"](), String(_0xd20b8d?.["displayLocalPath"] || '')["trim"](), String(_0xd20b8d?.["thumbLocalPath"] || '')['trim'](), String(_0xd20b8d?.["imageUrl"] || '')["trim"](), String(_0xd20b8d?.["thumbUrl"] || '')["trim"]()]["join"](':');
      _0x346646["push"](_0x29ca18['id'] + ':' + _0x29ca18["sourceId"] + ':' + Number(_0x29ca18['createdAt'] || 0x0) + ':' + _0x39a8d7 + ':' + _0x5e3a6b);
    });
    _0x346646["sort"]((_0x471866, _0xed4233) => _0x471866["localeCompare"](_0xed4233));
    return _0x346646['join']('|');
  }
  ['_enterEditing']() {
    this["_selectNodeOnCanvas"]();
    this["_data"]?.['isCollapsed'] && setPanoramaSceneCollapsed({
      'nodeId': this['id'],
      'isCollapsed': ![]
    });
    setPanoramaSceneEditing({
      'nodeId': this['id'],
      'isEditing': !![]
    });
    requestAnimationFrame(() => this["_viewportEl"]?.["focus"]());
  }
  ["_exitEditing"]() {
    this["_closeMenus"]();
    this["_interaction"]?.["cancelFlightNavigation"]?.({
      'commit': !![]
    });
    setPanoramaSceneEditing({
      'nodeId': this['id'],
      'isEditing': ![]
    });
  }
  async ["_handleFileInputChange"](_0x29258f) {
    if (!this['_supportsPanoramaUpload']()) {
      _0x29258f['target']['value'] = '';
      return;
    }
    const _0x501a0c = _0x29258f["target"]['files']?.[0x0];
    if (!_0x501a0c) {
      return;
    }
    this['_selectNodeOnCanvas']();
    const _0xc25ab2 = await uploadPanoramaSceneImage({
      'nodeId': this['id'],
      'file': _0x501a0c
    });
    _0xc25ab2 && this["_isPanorama360"] && this["_enterEditing"]();
    _0x29258f["target"]["value"] = '';
  }
  ['_handleViewportPointerDown'](_0x344ef4) {
    const _0x3d63d6 = this["_isEditing"]();
    this["_selectNodeOnCanvas"]({
      'preserveExistingSelection': !_0x3d63d6
    });
    this['_closeObjectContextMenu']();
    if (!_0x3d63d6) {
      return;
    }
    this["_openMenuKey"] && (this["_openMenuKey"] = null, this["_syncOverlayState"]());
    this['_viewportEl']["focus"]?.();
    _0x344ef4["stopPropagation"]();
  }
  ["_handleViewportContextMenu"](_0x499e50) {
    if (!this['_isEditing']()) {
      return;
    }
    _0x499e50["preventDefault"]();
    _0x499e50["stopPropagation"]();
    if (this['_sceneState']?.['ui']?.["navigationMode"] === "fly") {
      this['_closeObjectContextMenu']();
      return;
    }
    this["_selectNodeOnCanvas"]();
    const _0x6ba91d = this["_bridge"]?.["pick"]?.(_0x499e50['clientX'], _0x499e50["clientY"]);
    if (_0x6ba91d?.["objectType"] && _0x6ba91d?.['objectId']) {
      setPanoramaSceneSelection({
        'nodeId': this['id'],
        'objectType': _0x6ba91d["objectType"],
        'objectId': _0x6ba91d["objectId"]
      });
    } else {
      if (!this["_sceneState"]?.["selection"]?.["selectedObjectId"]) {
        this["_closeObjectContextMenu"]();
        return;
      }
    }
    this["_openObjectContextMenu"](_0x499e50['clientX'], _0x499e50["clientY"], {
      'type': "selection"
    });
  }
  ["_handleGlobalPointerDown"](_0x436a4e) {
    if (!this['_contextMenuEl'] || this["_contextMenuEl"]["hidden"]) {
      return;
    }
    if (this['_contextMenuEl']["contains"](_0x436a4e["target"])) {
      return;
    }
    this["_closeObjectContextMenu"]();
  }
  ["_openObjectContextMenu"](_0x2089a0, _0x295ea1, _0x3c163f = {
    'type': "selection"
  }) {
    if (!this["_contextMenuEl"] || !this['_overlayEl']) {
      return;
    }
    const _0x462bec = this["_overlayEl"]["getBoundingClientRect"]();
    if (!_0x462bec['width'] || !_0x462bec["height"]) {
      return;
    }
    const _0x4feb3f = this["_contextMenuEl"]["offsetWidth"] || 0x84;
    const _0x266bc5 = this["_contextMenuEl"]["offsetHeight"] || 0x2c;
    const _0x1d4ac2 = Math['max'](0x0, Math["min"](_0x2089a0 - _0x462bec["left"], _0x462bec['width'] - _0x4feb3f));
    const _0x20f1c4 = Math["max"](0x0, Math["min"](_0x295ea1 - _0x462bec['top'], _0x462bec["height"] - _0x266bc5));
    this["_contextMenuEl"]['style']['left'] = _0x1d4ac2 + 'px';
    this["_contextMenuEl"]["style"]["top"] = _0x20f1c4 + 'px';
    this["_contextMenuTarget"] = _0x3c163f;
    this["_contextMenuEl"]["hidden"] = ![];
    this["_contextMenuEl"]["classList"]["add"]("is-visible");
  }
  ["_closeObjectContextMenu"]() {
    if (!this["_contextMenuEl"]) {
      return;
    }
    this['_contextMenuTarget'] = null;
    this["_contextMenuEl"]["classList"]['remove']("is-visible");
    this["_contextMenuEl"]["hidden"] = !![];
  }
  ['_handleViewportDoubleClick'](_0x3640ab) {
    _0x3640ab['preventDefault']();
    _0x3640ab["stopPropagation"]();
    if (this["_isEditing"]() && this['_sceneState']?.["mode"] === "scene") {
      const _0x345dfa = this["_bridge"]?.["pick"]?.(_0x3640ab["clientX"], _0x3640ab['clientY']);
      if (_0x345dfa?.["objectType"] && _0x345dfa?.["objectId"]) {
        this["_selectNodeOnCanvas"]();
        setPanoramaSceneSelection({
          'nodeId': this['id'],
          'objectType': _0x345dfa["objectType"],
          'objectId': _0x345dfa['objectId']
        });
        focusPanoramaSceneSelection({
          'nodeId': this['id'],
          'frame': this["_bridge"]?.["readObjectFrame"]?.(_0x345dfa["objectType"], _0x345dfa['objectId'])
        });
        return;
      }
    }
    this["_enterEditing"]();
  }
  ["_openPanoramaFilePicker"]() {
    if (!this["_supportsPanoramaUpload"]()) {
      return;
    }
    this["_fileInput"]?.["click"]();
  }
  ["_openMenu"](_0x53580d) {
    if (!_0x53580d) {
      return;
    }
    clearTimeout(this["_menuHideTimer"]);
    this["_openMenuKey"] = _0x53580d;
    this["_positionMenus"]();
    this["_syncOverlayState"]();
  }
  ["_closeMenus"]() {
    clearTimeout(this["_menuHideTimer"]);
    this["_openMenuKey"] = null;
    this["_syncOverlayState"]();
  }
  ["_scheduleMenuHide"](_0xc5f4ee) {
    clearTimeout(this["_menuHideTimer"]);
    this["_openMenuKey"] === _0xc5f4ee && (this['_openMenuKey'] = null, this["_syncOverlayState"]());
  }
  ["_handleBottomToolbarPointerEnter"](_0x3c202f) {
    const _0x884050 = _0x3c202f['target']?.['closest']?.("button");
    if (!_0x884050) {
      return;
    }
    if (_0x884050['classList']["contains"]('act-capture')) {
      this["_openMenu"]("capture");
      return;
    }
    if (!this["_isPanorama360"] && _0x884050["classList"]["contains"]("act-focus")) {
      this["_openMenu"]("focus");
      return;
    }
    if (_0x884050["classList"]["contains"]("act-mannequin-entry")) {
      if (!this["_supportsCubeCreation"]()) {
        return;
      }
      this["_openMenu"]("mannequin");
      return;
    }
    if (_0x884050['classList']["contains"]("act-asset-library")) {
      if (!this['_supportsCubeCreation']()) {
        return;
      }
      this["_openMenu"]("assets");
      return;
    }
    if (_0x884050["classList"]['contains']("act-pose-editor")) {
      if (!this["_supportsCubeCreation"]()) {
        return;
      }
      this['_openMenu']("pose");
      return;
    }
    if (_0x884050['classList']["contains"]("act-grid")) {
      if (!this["_supportsCubeCreation"]()) {
        return;
      }
      this["_openMenu"]("grid");
      return;
    }
    if (this['_supportsCameraFeatures']() && _0x884050["classList"]["contains"]('act-camera')) {
      this["_openMenu"]("camera");
      return;
    }
  }
  ['_handleBottomToolbarPointerLeave'](_0x34f85b) {
    const _0x2aff8e = _0x34f85b["relatedTarget"];
    if (_0x2aff8e && (this["_bottomToolbarEl"]?.['contains'](_0x2aff8e) || this["_captureMenuEl"]?.["contains"](_0x2aff8e) || this["_cameraListEl"]?.["contains"](_0x2aff8e) || this["_focusMenuEl"]?.["contains"](_0x2aff8e) || this["_mannequinMenuEl"]?.['contains'](_0x2aff8e) || this["_assetBrowserEl"]?.["contains"](_0x2aff8e) || this["_posePanelEl"]?.['contains'](_0x2aff8e) || this["_gridPanelEl"]?.["contains"](_0x2aff8e))) {
      return;
    }
    const _0xf55f00 = _0x34f85b["target"]?.["closest"]?.('button');
    if (!_0xf55f00) {
      return;
    }
    if (_0xf55f00["classList"]["contains"]("act-capture")) {
      this["_scheduleMenuHide"]("capture");
      return;
    }
    if (!this["_isPanorama360"] && _0xf55f00['classList']["contains"]('act-focus')) {
      this["_scheduleMenuHide"]("focus");
      return;
    }
    if (_0xf55f00["classList"]["contains"]('act-mannequin-entry')) {
      if (!this["_supportsCubeCreation"]()) {
        return;
      }
      this['_scheduleMenuHide']('mannequin');
      return;
    }
    if (_0xf55f00['classList']["contains"]("act-asset-library")) {
      this["_scheduleMenuHide"]('assets');
      return;
    }
    if (_0xf55f00["classList"]['contains']("act-pose-editor")) {
      this["_scheduleMenuHide"]('pose');
      return;
    }
    if (_0xf55f00['classList']["contains"]("act-grid")) {
      if (!this["_supportsCubeCreation"]()) {
        return;
      }
      this["_scheduleMenuHide"]('grid');
      return;
    }
    this["_supportsCameraFeatures"]() && _0xf55f00['classList']["contains"]("act-camera") && this["_scheduleMenuHide"]('camera');
  }
  async ["_handleToolbarAction"](_0x607b4e) {
    const _0x3821d2 = this["_sceneState"];
    switch (_0x607b4e) {
      case "enter-edit":
        this['_enterEditing']();
        return;
      case 'exit-edit':
        this["_exitEditing"]();
        return;
      case "upload-panorama":
        if (!this["_supportsPanoramaUpload"]()) {
          return;
        }
        this['_openPanoramaFilePicker']();
        return;
      case "fullscreen":
        !this["_isEditing"]() && this['_enterEditing']();
        this["_isBrowserFullscreen"]() ? await this['_exitBrowserFullscreen']() : await this["_enterBrowserFullscreen"]();
        return;
      case 'navigate':
        {
          this["_toggleMouseTool"]();
        }
        return;
      case "fly-mode":
        setPanoramaSceneInteractionOptions({
          'nodeId': this['id'],
          'patch': {
            'navigationMode': _0x3821d2?.['ui']?.["navigationMode"] === "fly" ? "orbit" : "fly"
          }
        });
        requestAnimationFrame(() => this["_viewportEl"]?.["focus"]());
        return;
      case "frame-selection":
        focusPanoramaSceneSelection({
          'nodeId': this['id'],
          'frame': this["_bridge"]?.['readSelectionFrame']?.()
        });
        return;
      case "move":
      case "rotate":
      case "scale":
        this["_closeMenus"]();
        setPanoramaSceneTool({
          'nodeId': this['id'],
          'tool': _0x607b4e
        });
        return;
      case "transform-space":
        setPanoramaSceneInteractionOptions({
          'nodeId': this['id'],
          'patch': {
            'transformSpace': _0x3821d2?.['ui']?.['transformSpace'] === "local" ? "world" : "local"
          }
        });
        return;
      case 'snap-toggle':
        setPanoramaSceneInteractionOptions({
          'nodeId': this['id'],
          'patch': {
            'snapEnabled': _0x3821d2?.['ui']?.["snapEnabled"] !== !![]
          }
        });
        return;
      case "ground-lock":
        setPanoramaSceneInteractionOptions({
          'nodeId': this['id'],
          'patch': {
            'groundLock': _0x3821d2?.['ui']?.["groundLock"] !== !![]
          }
        });
        return;
      case "uniform-scale":
        setPanoramaSceneInteractionOptions({
          'nodeId': this['id'],
          'patch': {
            'uniformScale': _0x3821d2?.['ui']?.["uniformScale"] !== !![]
          }
        });
        return;
      case "environment-toggle":
        setPanoramaSceneEnvironmentMode({
          'nodeId': this['id'],
          'environmentMode': _0x3821d2["environmentMode"] === 'day' ? "night" : "day"
        });
        return;
      case 'collapse-node':
        {
          const _0x56bd5d = this["_data"]?.["isCollapsed"] === !![];
          setPanoramaSceneCollapsed({
            'nodeId': this['id'],
            'isCollapsed': !_0x56bd5d,
            'enterEditingOnExpand': _0x56bd5d
          });
          _0x56bd5d && requestAnimationFrame(() => this["_viewportEl"]?.["focus"]());
        }
        return;
      case "cube":
        if (!this['_supportsCubeCreation']()) {
          return;
        }
        addPanoramaSceneCube({
          'nodeId': this['id'],
          'viewPose': this['_bridge']?.["readCurrentViewPose"]?.()
        });
        return;
      case "asset-library":
        if (!this["_supportsCubeCreation"]()) {
          return;
        }
        this["_openMenu"]('assets');
        return;
      case "mannequin-entry":
        if (!this["_supportsCubeCreation"]()) {
          return;
        }
        this["_openMenu"]('mannequin');
        return;
      case 'pose-editor':
        if (!this["_supportsCubeCreation"]()) {
          return;
        }
        this["_openMenu"]("pose");
        return;
      case "camera":
        if (!this["_supportsCameraFeatures"]()) {
          return;
        }
        {
          addPanoramaSceneCamera({
            'nodeId': this['id'],
            'viewPose': this["_bridge"]?.["readCurrentViewPose"]?.()
          });
        }
        this["_openMenuKey"] = "camera";
        this["_syncOverlayState"]();
        return;
      case "timeline":
        if (!this["_supportsCameraFeatures"]()) {
          return;
        }
        {
          const _0x3741da = _0x3821d2?.['ui']?.['showTimeline'] !== !![];
          setPanoramaSceneInteractionOptions({
            'nodeId': this['id'],
            'patch': {
              'showTimeline': _0x3741da
            }
          });
          !_0x3741da && this['_stopCameraTimelinePlayback']({
            'clearDraft': !![]
          });
        }
        return;
      case "focus":
        if (this['_isPanorama360'] || this["_sceneState"]?.["mode"] !== "scene") {
          return;
        }
        if (this["_openMenuKey"] === "focus") {
          this["_setDefaultSceneFocalLength"](SCENE_DEFAULT_FOCAL_LENGTH_MM);
          this["_focusMenuEl"]?.["_syncValue"]?.();
          return;
        }
        this["_openMenu"]("focus");
        return;
      case "capture":
        await capturePanoramaSceneViewport({
          'nodeId': this['id'],
          'captureBlob': () => this["_captureViewportByCurrentMode"]()
        });
        return;
      case "reset-view":
        this['_setDefaultSceneFocalLength'](SCENE_DEFAULT_FOCAL_LENGTH_MM);
        resetPanoramaSceneView({
          'nodeId': this['id']
        });
        return;
      case 'grid':
        if (!this['_supportsCubeCreation']()) {
          return;
        }
        this["_openMenu"]("grid");
        return;
      case "toggle-panorama-mode":
        this["_closeMenus"]();
        setPanoramaSceneMode({
          'nodeId': this['id'],
          'mode': this["_supportsPanoramaUpload"]() ? 'panorama' : "scene"
        });
        return;
      default:
        return;
    }
  }
  ["_handleToolbarClick"](_0x56af68) {
    const _0x3fad45 = _0x56af68["target"]["closest"]('button');
    if (!_0x3fad45) {
      return;
    }
    const _0x57c755 = Array["from"](_0x3fad45["classList"])["find"](_0x202951 => _0x202951["startsWith"]('act-'));
    if (!_0x57c755) {
      return;
    }
    _0x56af68['preventDefault']();
    _0x56af68["stopPropagation"]();
    this["_selectNodeOnCanvas"]();
    const _0x4ae9a8 = _0x57c755["slice"](0x4);
    void this['_handleToolbarAction'](_0x4ae9a8);
  }
  ["_syncGridPanelValues"]() {
    if (!this["_gridPanelEl"]) {
      return;
    }
    const _0x1a7b8b = this["_sceneState"]["gridPlacement"];
    const _0x3a870f = (_0xd9504c, _0x27f927, _0xa826c3 = 0x0) => {
      const _0x2210e7 = this["_gridPanelEl"]["querySelector"]("[data-grid-field=\"" + _0xd9504c + '\x22]');
      if (!_0x2210e7) {
        return;
      }
      if (!Number["isFinite"](Number(_0x27f927))) {
        return;
      }
      const _0xd7030b = _0xa826c3 > 0x0 ? Number(_0x27f927)["toFixed"](_0xa826c3) : String(Math["round"](Number(_0x27f927)));
      _0x2210e7["tagName"] === "INPUT" ? _0x2210e7['value'] = _0xd7030b : (_0x2210e7["textContent"] = _0xd7030b, _0x2210e7['setAttribute']("aria-valuenow", String(_0x27f927)));
    };
    _0x3a870f("rows", _0x1a7b8b["rows"], 0x0);
    _0x3a870f('cols', _0x1a7b8b['cols'], 0x0);
    _0x3a870f("spacingX", _0x1a7b8b['spacingX'], 0x1);
    _0x3a870f("spacingZ", _0x1a7b8b["spacingZ"], 0x1);
    const _0x1cd624 = _0x1a7b8b["gender"] === "female" ? "female" : 'male';
    this['_gridPanelEl']["querySelectorAll"]("[data-grid-gender]")["forEach"](_0x2f2675 => {
      _0x2f2675["classList"]["toggle"]('is-active', _0x2f2675["dataset"]["gridGender"] === _0x1cd624);
    });
    const _0x5632b9 = new Set(PANORAMA_MANNEQUIN_COLOR_OPTIONS["map"](([_0x25d0f3]) => _0x25d0f3));
    const _0x1b4579 = _0x5632b9["has"](_0x1a7b8b["colorKey"]) ? _0x1a7b8b["colorKey"] : "blue";
    this['_gridPanelEl']['querySelectorAll']("[data-grid-color]")['forEach'](_0x31cf78 => {
      const _0x744e10 = _0x31cf78["dataset"]["gridColor"];
      _0x31cf78["classList"]['toggle']("is-active", _0x744e10 === _0x1b4579);
      _0x31cf78["style"]['setProperty']("--panorama-scene-swatch-token", "var(--" + resolvePanoramaSceneColorToken(_0x744e10) + ')');
    });
  }
  ['_syncLocaleTexts']() {
    const _0x48a7a8 = (_0x36df74, _0x2a1452) => {
      if (!_0x36df74) {
        return;
      }
      _0x36df74['dataset']['tooltip'] = _0x2a1452;
      _0x36df74["setAttribute"]("aria-label", _0x2a1452);
    };
    const _0x35e63e = (_0x158131, _0x33ef7d) => {
      const _0x57d428 = [this['el'], this["_browserFullscreenOverlayEl"]]["filter"](Boolean);
      _0x57d428["forEach"](_0x24f8b7 => {
        _0x24f8b7["querySelectorAll"]?.(_0x158131)?.["forEach"](_0x4e8d2f => _0x48a7a8(_0x4e8d2f, _0x33ef7d));
      });
    };
    const _0x3f4dfc = (_0x317674, _0x2671bd) => {
      const _0x2ebc49 = this['el']?.["querySelector"]?.(_0x317674) || this["_browserFullscreenOverlayEl"]?.["querySelector"]?.(_0x317674);
      if (_0x2ebc49) {
        _0x2ebc49["textContent"] = _0x2671bd;
      }
    };
    _0x35e63e(".act-enter-edit", panoramaSceneText("toolbar.edit"));
    _0x35e63e('.act-exit-edit', panoramaSceneText("toolbar.closeEdit"));
    _0x35e63e(".act-fly-mode", panoramaSceneText('toolbar.flyMode'));
    _0x35e63e('.act-frame-selection', panoramaSceneText("toolbar.frameSelection"));
    _0x35e63e(".act-upload-panorama", panoramaSceneText('toolbar.uploadPanorama'));
    _0x35e63e(".act-cube", panoramaSceneText("toolbar.createCube"));
    _0x35e63e(".act-mannequin-entry", panoramaSceneText('toolbar.mannequin'));
    _0x35e63e(".act-grid", panoramaSceneText("toolbar.grid"));
    _0x35e63e(".act-capture", panoramaSceneText("toolbar.capture"));
    _0x35e63e(".act-camera", panoramaSceneText('toolbar.createCameraBookmark'));
    _0x35e63e(".act-focus", panoramaSceneText("toolbar.focus"));
    _0x35e63e('.act-reset-view', panoramaSceneText("toolbar.resetView"));
    _0x35e63e(".act-environment-toggle", panoramaSceneText("toolbar.switchEnvironment"));
    const _0x2b5885 = this['_contextMenuEl']?.["querySelector"]?.(".panorama-scene-object-menu__label");
    _0x2b5885 && (_0x2b5885['textContent'] = panoramaSceneText("contextMenu.deleteObject"));
    this["_syncContextMenuShortcutLabel"]();
    this["_browserFullscreenExitBtnEl"]?.["setAttribute"]("aria-label", panoramaSceneText("toolbar.exitFullscreen"));
    this["_browserFullscreenExitBtnEl"] && (this["_browserFullscreenExitBtnEl"]['textContent'] = panoramaSceneText('toolbar.exitFullscreen'));
    this['_captureMenuEl']?.["querySelectorAll"]?.("[data-capture-mode]")?.["forEach"](_0xdb1650 => {
      const _0xb6d8e9 = getCaptureModeLabel(_0xdb1650["dataset"]['captureMode'] || 'adaptive');
      _0xdb1650["setAttribute"]("aria-label", panoramaSceneText('capture.modeAria', {
        'label': _0xb6d8e9
      }));
      const _0x2ed8a6 = _0xdb1650["querySelector"](".panorama-capture-menu__label");
      if (_0x2ed8a6) {
        _0x2ed8a6["textContent"] = _0xb6d8e9;
      }
    });
    _0x3f4dfc(".panorama-scene-focus-menu__title", panoramaSceneText("focus.title"));
    this['_focusMenuEl']?.['querySelector']?.('.panorama-scene-focus-menu__slider')?.["setAttribute"]('aria-label', panoramaSceneText('focus.sliderAria'));
    _0x3f4dfc(".panorama-grid-panel__title", panoramaSceneText('grid.title'));
    _0x3f4dfc('[data-grid-label=\x22rows\x22]', panoramaSceneText("grid.rows"));
    _0x3f4dfc("[data-grid-label=\"cols\"]", panoramaSceneText("grid.cols"));
    _0x3f4dfc("[data-grid-label=\"spacingX\"]", panoramaSceneText('grid.spacingX'));
    _0x3f4dfc("[data-grid-label=\"spacingZ\"]", panoramaSceneText("grid.spacingZ"));
    _0x3f4dfc('[data-grid-label=\x22gender\x22]', panoramaSceneText("grid.gender"));
    _0x3f4dfc("[data-grid-label=\"color\"]", panoramaSceneText("grid.color"));
    this["_gridPanelEl"]?.["querySelector"]?.("[data-grid-field=\"rows\"]")?.["setAttribute"]("aria-label", panoramaSceneText("grid.rowsAria"));
    this['_gridPanelEl']?.['querySelector']?.('[data-grid-field=\x22cols\x22]')?.['setAttribute']("aria-label", panoramaSceneText("grid.colsAria"));
    this["_gridPanelEl"]?.["querySelector"]?.('[data-grid-field=\x22spacingX\x22]')?.["setAttribute"]("aria-label", panoramaSceneText("grid.spacingXAria"));
    this["_gridPanelEl"]?.['querySelector']?.("[data-grid-field=\"spacingZ\"]")?.['setAttribute']('aria-label', panoramaSceneText("grid.spacingZAria"));
    this["_gridPanelEl"]?.['querySelectorAll']?.("[data-grid-gender]")?.["forEach"](_0x3eac12 => {
      const _0xd9c455 = getPanoramaMannequinGenderLabel(_0x3eac12["dataset"]["gridGender"]);
      _0x3eac12['setAttribute']("aria-label", panoramaSceneText("grid.setGenderAria", {
        'label': _0xd9c455
      }));
    });
    this['_gridPanelEl']?.["querySelectorAll"]?.("[data-grid-color]")?.["forEach"](_0x15fa85 => {
      const _0x1e152a = getPanoramaMannequinColorLabel(_0x15fa85["dataset"]["gridColor"]);
      _0x15fa85["setAttribute"]("aria-label", panoramaSceneText('grid.setColorAria', {
        'label': _0x1e152a
      }));
    });
    _0x3f4dfc(".panorama-grid-panel__apply", panoramaSceneText("grid.apply"));
    renderMannequinQuickMenu(this["_mannequinMenuEl"], this["_sceneState"]);
    renderSceneAssetBrowser(this["_assetBrowserEl"]);
    renderMannequinPosePanel(this['_posePanelEl'], this['_sceneState']);
    renderCameraTimelinePanel(this["_timelinePanelEl"], this["_sceneState"]?.['cameraTimeline'], {
      'currentTime': this["_timelinePreviewTime"],
      'isPlaying': this["_isTimelinePlaying"]
    });
    this["_renderCameraPresetList"]();
    this["_syncToolbarState"]();
    this["_syncHintAndStatus"]();
    this["_syncCaptureSafeFrame"]();
  }
  ['_renderCameraPresetList']() {
    renderCameraPresetList(this["_cameraListEl"], this["_sceneState"], {
      'onActivate': _0xf381a0 => {
        this["_animateCameraActivation"](_0xf381a0);
        this["_openMenuKey"] = null;
        this["_syncOverlayState"]();
      },
      'onDelete': _0x1d4285 => {
        deletePanoramaSceneCamera({
          'nodeId': this['id'],
          'cameraId': _0x1d4285
        });
      },
      'onContextMenu': ({
        cameraId: _0x5bfcf7,
        clientX: _0x32218e,
        clientY: _0xa561bd
      }) => {
        this['_openObjectContextMenu'](_0x32218e, _0xa561bd, {
          'type': "camera",
          'cameraId': _0x5bfcf7
        });
      }
    });
  }
  ["_syncToolbarState"]() {
    const _0x2790ea = this["_resolveMouseTool"]();
    const _0x110fe2 = this['_resolveTransformTool']();
    this['_editToolbarEl']["querySelectorAll"](".act-navigate, .act-move, .act-rotate, .act-scale")['forEach'](_0x161b53 => {
      const _0x4843a4 = Array['from'](_0x161b53["classList"])["find"](_0x4ae789 => _0x4ae789["startsWith"]("act-"));
      const _0x37fe86 = _0x4843a4?.['slice'](0x4);
      const _0x84d759 = _0x37fe86 === "navigate";
      const _0x37696b = _0x84d759 ? _0x2790ea === "navigate" || _0x2790ea === 'box-select' : _0x37fe86 === _0x110fe2;
      _0x161b53['classList']["toggle"]('active', _0x37696b);
    });
    const _0x10aaa2 = this['_editToolbarEl']["querySelector"]('.act-navigate');
    if (_0x10aaa2) {
      const _0x3cf79b = _0x2790ea === 'box-select';
      _0x10aaa2["classList"]["toggle"]('is-box-select', _0x3cf79b);
      const _0x165982 = buildTooltipText(_0x3cf79b ? panoramaSceneText("toolbar.boxSelectMouse") : panoramaSceneText("toolbar.mouseMode"), "panorama-scene-tool-toggle-mouse");
      _0x10aaa2['dataset']["tooltip"] = _0x165982;
      _0x10aaa2["setAttribute"]("aria-label", _0x165982);
      const _0x22d5a5 = _0x3cf79b ? BOX_SELECT_TOOL_ICON : POINTER_TOOL_ICON;
      _0x10aaa2["innerHTML"] !== _0x22d5a5 && (_0x10aaa2['innerHTML'] = _0x22d5a5);
    }
    const _0x22e0ce = this["_editToolbarEl"]["querySelector"](".act-fly-mode");
    if (_0x22e0ce) {
      const _0x55c566 = this['_sceneState']?.['ui']?.['navigationMode'] === "fly";
      const _0x2370c7 = panoramaSceneText("toolbar.flyMode");
      _0x22e0ce["classList"]["toggle"]("active", _0x55c566);
      _0x22e0ce["dataset"]["tooltip"] = _0x2370c7;
      _0x22e0ce["setAttribute"]("aria-label", _0x2370c7);
    }
    const _0x3bb624 = this["_editToolbarEl"]["querySelector"](".act-frame-selection");
    if (_0x3bb624) {
      const _0x176d65 = Boolean(this["_sceneState"]?.["selection"]?.["selectedObjectId"]);
      const _0x43b1d8 = panoramaSceneText("toolbar.frameSelection");
      _0x3bb624["disabled"] = !_0x176d65;
      _0x3bb624['dataset']["tooltip"] = _0x43b1d8;
      _0x3bb624["setAttribute"]('aria-label', _0x43b1d8);
    }
    const _0x1b89c6 = this["_editToolbarEl"]['querySelector'](".act-move");
    if (_0x1b89c6) {
      const _0x4953de = buildTooltipText(panoramaSceneText("toolbar.move"), "panorama-scene-tool-move");
      _0x1b89c6["dataset"]["tooltip"] = _0x4953de;
      _0x1b89c6['setAttribute']('aria-label', _0x4953de);
    }
    const _0x396c90 = this["_editToolbarEl"]["querySelector"]('.act-rotate');
    if (_0x396c90) {
      const _0x57ec8a = buildTooltipText(panoramaSceneText("toolbar.rotate"), "panorama-scene-tool-rotate");
      _0x396c90["dataset"]["tooltip"] = _0x57ec8a;
      _0x396c90['setAttribute']("aria-label", _0x57ec8a);
    }
    const _0x55de60 = this['_editToolbarEl']['querySelector'](".act-scale");
    if (_0x55de60) {
      const _0x11f005 = buildTooltipText(panoramaSceneText('toolbar.scale'), "panorama-scene-tool-scale");
      _0x55de60['dataset']['tooltip'] = _0x11f005;
      _0x55de60["setAttribute"]("aria-label", _0x11f005);
    }
    const _0x35a61b = this["_editToolbarEl"]['querySelector'](".act-transform-space");
    if (_0x35a61b) {
      const _0x535e3b = this["_sceneState"]?.['ui']?.["transformSpace"] === 'local';
      const _0x52bd9f = panoramaSceneText(_0x535e3b ? "toolbar.transformLocal" : 'toolbar.transformWorld');
      _0x35a61b["classList"]["toggle"]("active", _0x535e3b);
      _0x35a61b["dataset"]["tooltip"] = _0x52bd9f;
      _0x35a61b["setAttribute"]("aria-label", _0x52bd9f);
    }
    const _0x29bd81 = this['_editToolbarEl']["querySelector"]('.act-snap-toggle');
    _0x29bd81 && _0x29bd81["classList"]["toggle"]('active', this["_sceneState"]?.['ui']?.["snapEnabled"] === !![]);
    const _0x2937f4 = this["_editToolbarEl"]['querySelector'](".act-ground-lock");
    _0x2937f4 && (_0x2937f4["classList"]["toggle"]("active", this["_sceneState"]?.['ui']?.["groundLock"] === !![]), _0x2937f4["hidden"] = _0x110fe2 !== "move");
    const _0x3792d0 = this["_editToolbarEl"]["querySelector"](".act-uniform-scale");
    _0x3792d0 && (_0x3792d0["classList"]['toggle']("active", this['_sceneState']?.['ui']?.["uniformScale"] === !![]), _0x3792d0['hidden'] = _0x110fe2 !== 'scale');
    const _0x2d4faa = this['_cornerToolbarEl']['querySelector']('.act-environment-toggle');
    if (_0x2d4faa) {
      const _0x2a10b4 = this['_sceneState']["environmentMode"] === 'day' ? panoramaSceneText("toolbar.switchToNight") : panoramaSceneText("toolbar.switchToDay");
      _0x2d4faa["dataset"]["tooltip"] = _0x2a10b4;
      _0x2d4faa['setAttribute']("aria-label", _0x2a10b4);
      _0x2d4faa["hidden"] = ![];
      _0x2d4faa["setAttribute"]('aria-hidden', "false");
    }
    const _0x58fde5 = this['_sceneToolbarEl']["querySelector"](".act-upload-panorama");
    if (_0x58fde5) {
      const _0x1b72e5 = this["_supportsPanoramaUpload"]();
      _0x58fde5["hidden"] = !_0x1b72e5;
      _0x58fde5['setAttribute']("aria-hidden", _0x1b72e5 ? "false" : "true");
    }
    const _0x2397b6 = this["_bottomToolbarEl"]["querySelector"](".act-cube");
    if (_0x2397b6) {
      const _0x3aedb6 = this["_supportsCubeCreation"]();
      _0x2397b6["hidden"] = !_0x3aedb6;
      _0x2397b6["setAttribute"]("aria-hidden", _0x3aedb6 ? "false" : "true");
    }
    const _0x4a6375 = this["_bottomToolbarEl"]["querySelector"](".act-asset-library");
    if (_0x4a6375) {
      const _0x4157f7 = this["_supportsCubeCreation"]();
      _0x4a6375['hidden'] = !_0x4157f7;
      _0x4a6375['disabled'] = !_0x4157f7;
    }
    const _0x27fe63 = this['_bottomToolbarEl']['querySelector'](".act-mannequin-entry");
    if (_0x27fe63) {
      const _0x246c6e = this["_supportsCubeCreation"]();
      _0x27fe63["hidden"] = !_0x246c6e;
      _0x27fe63["setAttribute"]("aria-hidden", _0x246c6e ? 'false' : "true");
      _0x27fe63["disabled"] = !_0x246c6e;
      !_0x246c6e && this["_openMenuKey"] === "mannequin" && (this["_openMenuKey"] = null);
    }
    const _0x2c142e = this['_bottomToolbarEl']["querySelector"]('.act-pose-editor');
    if (_0x2c142e) {
      const _0x52b1a3 = this["_sceneState"]?.["selection"]?.["selectedObjectType"] === "mannequin" && Boolean(this["_sceneState"]?.['selection']?.["selectedObjectId"]);
      _0x2c142e["hidden"] = !this["_supportsCubeCreation"]();
      _0x2c142e["disabled"] = !_0x52b1a3;
    }
    const _0x42b5df = this['_bottomToolbarEl']["querySelector"](".act-grid");
    if (_0x42b5df) {
      const _0x94234b = this["_supportsCubeCreation"]();
      _0x42b5df['hidden'] = !_0x94234b;
      _0x42b5df["setAttribute"]("aria-hidden", _0x94234b ? "false" : "true");
      _0x42b5df['disabled'] = !_0x94234b;
      const _0x359cfe = panoramaSceneText("toolbar.grid");
      _0x42b5df["dataset"]['tooltip'] = _0x359cfe;
      _0x42b5df["setAttribute"]("aria-label", _0x359cfe);
      !_0x94234b && this['_openMenuKey'] === 'grid' && (this["_openMenuKey"] = null);
    }
    const _0x19f594 = this["_bottomToolbarEl"]["querySelector"]('.act-camera');
    if (_0x19f594) {
      const _0x5d88f5 = this['_supportsCameraFeatures']();
      const _0x27ee25 = this["_sceneState"]["cameras"]["length"] >= 0xa;
      _0x19f594["hidden"] = !_0x5d88f5;
      _0x19f594['setAttribute']("aria-hidden", _0x5d88f5 ? "false" : "true");
      _0x19f594["disabled"] = !_0x5d88f5;
      _0x19f594["classList"]["toggle"]("is-limit-reached", _0x5d88f5 && _0x27ee25);
      _0x19f594["setAttribute"]("aria-disabled", !_0x5d88f5 || _0x27ee25 ? "true" : "false");
      const _0x50802f = buildTooltipText(panoramaSceneText("toolbar.createCameraBookmark"), 'panorama-scene-camera-create');
      _0x19f594["dataset"]['tooltip'] = _0x50802f;
      _0x19f594["setAttribute"]("aria-label", _0x50802f);
      !_0x5d88f5 && this["_openMenuKey"] === "camera" && (this["_openMenuKey"] = null);
    }
    const _0x3d656d = this['_bottomToolbarEl']['querySelector']('.act-timeline');
    if (_0x3d656d) {
      const _0x539422 = this["_supportsCameraFeatures"]();
      _0x3d656d["hidden"] = !_0x539422;
      _0x3d656d["disabled"] = !_0x539422;
      _0x3d656d["classList"]["toggle"]('active', this['_sceneState']?.['ui']?.['showTimeline'] === !![]);
    }
    const _0x1735de = this["_bottomToolbarEl"]['querySelector'](".act-focus");
    if (_0x1735de) {
      const _0x215ac6 = !this["_isPanorama360"] && this["_sceneState"]?.["mode"] === "scene";
      _0x1735de["hidden"] = !_0x215ac6;
      _0x1735de["setAttribute"]("aria-hidden", _0x215ac6 ? "false" : "true");
      _0x1735de["disabled"] = !_0x215ac6;
      const _0x281f3d = panoramaSceneText("toolbar.focus");
      _0x1735de['dataset']["tooltip"] = _0x281f3d;
      _0x1735de["setAttribute"]('aria-label', _0x281f3d);
      !_0x215ac6 && this["_openMenuKey"] === 'focus' && (this["_openMenuKey"] = null);
    }
    const _0x3cbff2 = this["_bottomToolbarEl"]["querySelector"](".act-reset-view");
    if (_0x3cbff2) {
      const _0x126592 = buildTooltipText(panoramaSceneText("toolbar.resetView"), "panorama-scene-reset-view");
      _0x3cbff2['dataset']["tooltip"] = _0x126592;
      _0x3cbff2['setAttribute']("aria-label", _0x126592);
    }
    const _0x57a66b = this["_bottomToolbarEl"]["querySelector"]('.act-capture');
    if (_0x57a66b) {
      const _0x5d8328 = getCaptureModeMeta(this['_resolveCaptureMode']());
      const _0x101e01 = buildTooltipText(panoramaSceneText("toolbar.captureWithMode", {
        'mode': getCaptureModeLabel(_0x5d8328)
      }), "panorama-scene-capture");
      _0x57a66b["dataset"]['tooltip'] = _0x101e01;
      _0x57a66b['setAttribute']("aria-label", _0x101e01);
    }
    this['_syncCaptureMenuState']();
    const _0x2bd8fb = [this["_sceneToolbarEl"]?.["querySelector"](".act-collapse-node"), this["_editToolbarEl"]?.['querySelector']('.act-collapse-node')]["filter"](Boolean);
    _0x2bd8fb["forEach"](_0x213b39 => {
      const _0x2cefbb = this['_data']?.['isCollapsed'] === !![];
      const _0x483aaa = _0x2cefbb ? panoramaSceneText("toolbar.expand") : panoramaSceneText("toolbar.collapse");
      _0x213b39['dataset']["tooltip"] = _0x483aaa;
      _0x213b39["setAttribute"]("aria-label", _0x483aaa);
      _0x213b39["classList"]["toggle"]('is-collapsed', _0x2cefbb);
    });
    const _0x1f15ef = this['el']?.['querySelectorAll']?.(".act-fullscreen") || [];
    if (_0x1f15ef["length"] > 0x0) {
      const _0x12c448 = this["_isBrowserFullscreen"]();
      const _0x44e617 = _0x12c448 ? panoramaSceneText("toolbar.exitFullscreen") : panoramaSceneText('toolbar.fullscreen');
      _0x1f15ef["forEach"](_0x436cf9 => {
        _0x436cf9["dataset"]["tooltip"] = _0x44e617;
        _0x436cf9["setAttribute"]('aria-label', _0x44e617);
        _0x436cf9['classList']['toggle']("active", _0x12c448);
      });
    }
  }
  ["_syncHintAndStatus"]() {
    const _0x7afc3b = this["_isEditing"]();
    const _0x371fd0 = this["_sceneState"]['selection'];
    const _0x33fe61 = this["_resolveMouseTool"]();
    if (_0x7afc3b) {
      const _0x5b1bed = _0x371fd0['selectedObjectId'] ? _0x371fd0["selectedObjectType"] === 'camera' ? panoramaSceneText("status.cameraSelected") : panoramaSceneText("status.objectSelected") : panoramaSceneText("status.noObjectSelected");
      const _0x1730f8 = this['_supportsPanoramaUpload']() ? panoramaSceneText("status.panoramaMode") : panoramaSceneText("status.sceneMode");
      this["_statusContentEl"]["textContent"] = panoramaSceneText("status.editing", {
        'mode': _0x1730f8,
        'selection': _0x5b1bed
      });
    } else {
      this["_data"]?.["isCollapsed"] ? this["_statusContentEl"]['textContent'] = panoramaSceneText("status.collapsed") : this["_statusContentEl"]["textContent"] = panoramaSceneText('status.normalNode');
    }
    const _0x2c50d0 = this["_sceneState"]["panorama"]["error"] || this["_sceneState"]['capture']["error"] || '';
    this["_errorEl"]["textContent"] = _0x2c50d0;
    this['_errorEl']["classList"]["toggle"]('is-visible', !!_0x2c50d0);
    if (this["_data"]?.["isCollapsed"]) {
      this['_hintContentEl']["textContent"] = panoramaSceneText("hint.doubleClickEdit");
    } else {
      if (!_0x7afc3b) {
        this["_hintContentEl"]['textContent'] = this["_supportsPanoramaUpload"]() ? panoramaSceneText("hint.clickEditPanorama") : panoramaSceneText("hint.clickEditScene");
      } else {
        if (this["_supportsPanoramaUpload"]() || this["_sceneState"]["mode"] === "panorama") {
          this["_hintContentEl"]['textContent'] = panoramaSceneText("hint.panoramaControls");
        } else {
          if (_0x33fe61 === "box-select") {
            this["_hintContentEl"]["textContent"] = panoramaSceneText("hint.boxSelect");
          } else {
            this["_sceneState"]?.['ui']?.["navigationMode"] === "fly" ? this["_hintContentEl"]["textContent"] = panoramaSceneText("hint.flyControls") : this["_hintContentEl"]["textContent"] = panoramaSceneText("hint.defaultMouse");
          }
        }
      }
    }
  }
  ["_positionMenus"]() {
    if (!this["_bottomToolbarPopoverLayerEl"] || !this["_bottomToolbarEl"]) {
      return;
    }
    if (this['_bottomToolbarEl']["offsetWidth"] <= 0x0 || this["_bottomToolbarEl"]['offsetHeight'] <= 0x0) {
      return;
    }
    const _0x7941d9 = _0x53919c => {
      if (!(_0x53919c instanceof HTMLElement)) {
        return null;
      }
      const _0x263e42 = _0x53919c["offsetWidth"] || 0x0;
      const _0x5889db = _0x53919c["offsetHeight"] || 0x0;
      if (_0x263e42 <= 0x0 || _0x5889db <= 0x0) {
        return null;
      }
      return {
        'x': (_0x53919c["offsetLeft"] || 0x0) + _0x263e42 / 0x2,
        'y': _0x53919c["offsetTop"] || 0x0
      };
    };
    const _0x45ef40 = _0x7941d9(this["_bottomToolbarEl"]["querySelector"](".act-mannequin-entry"));
    _0x45ef40 && (this["_mannequinMenuEl"]["style"]["left"] = _0x45ef40['x'] + 'px', this["_mannequinMenuEl"]["style"]['top'] = _0x45ef40['y'] + 'px');
    const _0x4c595a = _0x7941d9(this["_bottomToolbarEl"]["querySelector"](".act-asset-library"));
    _0x4c595a && (this['_assetBrowserEl']['style']["left"] = _0x4c595a['x'] + 'px', this["_assetBrowserEl"]["style"]["top"] = _0x4c595a['y'] + 'px');
    const _0x2a2a83 = _0x7941d9(this["_bottomToolbarEl"]["querySelector"](".act-pose-editor"));
    _0x2a2a83 && (this['_posePanelEl']["style"]["left"] = _0x2a2a83['x'] + 'px', this["_posePanelEl"]["style"]["top"] = _0x2a2a83['y'] + 'px');
    const _0x32c4f6 = _0x7941d9(this['_bottomToolbarEl']["querySelector"](".act-grid"));
    _0x32c4f6 && (this["_gridPanelEl"]["style"]["left"] = _0x32c4f6['x'] + 'px', this["_gridPanelEl"]["style"]["top"] = _0x32c4f6['y'] + 'px');
    const _0xd2b41c = _0x7941d9(this["_bottomToolbarEl"]["querySelector"](".act-capture"));
    _0xd2b41c && (this['_captureMenuEl']["style"]["left"] = _0xd2b41c['x'] + 'px', this["_captureMenuEl"]["style"]['top'] = _0xd2b41c['y'] + 'px');
    const _0x6232d0 = _0x7941d9(this["_bottomToolbarEl"]["querySelector"](".act-focus"));
    _0x6232d0 && (this["_focusMenuEl"]["style"]["left"] = _0x6232d0['x'] + 'px', this["_focusMenuEl"]['style']["top"] = _0x6232d0['y'] + 'px');
    const _0x18b148 = _0x7941d9(this["_bottomToolbarEl"]["querySelector"](".act-camera"));
    _0x18b148 && (this['_cameraListEl']["style"]["left"] = _0x18b148['x'] + 'px', this["_cameraListEl"]["style"]["top"] = _0x18b148['y'] + 'px');
  }
  ['_syncOverlayState']() {
    const _0x29a180 = this["_isEditing"]();
    const _0x356fa4 = this["_data"]?.['isCollapsed'] === !![];
    const _0xd0046f = this["_isNodeSelected"]();
    const _0x1d1e8b = !_0x29a180;
    const _0x54f403 = _0x29a180 && !_0x356fa4 && _0xd0046f;
    const _0x474785 = _0x54f403;
    const _0xa3f25e = _0x54f403;
    this['el']["classList"]["toggle"]('is-editing', _0x29a180);
    this['el']["classList"]['toggle']("is-collapsed", _0x356fa4);
    this['el']["classList"]["toggle"]("is-panorama-mode", this["_sceneState"]['mode'] === 'panorama');
    const _0x104e7a = this["_sceneState"]?.["environmentMode"] === "day" ? "day" : "night";
    this['el']['dataset']['panoramaEnv'] = _0x104e7a;
    this['_viewportEl']["dataset"]["envMode"] = _0x104e7a;
    this["_viewportEl"]["dataset"]["sceneType"] = this["_sceneState"]?.["type"] || '';
    this["_sceneToolbarEl"]["classList"]["toggle"]("is-hidden", !_0x1d1e8b);
    this["_sceneToolbarEl"]["classList"]["remove"]("is-node-collapsed");
    this["_editToolbarEl"]['classList']["toggle"]("is-hidden", !_0x54f403);
    this['_editToolbarEl']["classList"]["remove"]("is-node-collapsed");
    this["_cornerToolbarEl"]["classList"]["toggle"]("is-hidden", !_0xa3f25e);
    this["_cornerToolbarEl"]["classList"]["toggle"]("is-collapsed-state", _0x356fa4);
    this['_bottomToolbarEl']["classList"]["toggle"]("is-hidden", !_0x474785);
    this["_statusEl"]["style"]["transform"] = "none";
    this["_hintEl"]["style"]["transform"] = 'none';
    !_0x54f403 && this["_closeObjectContextMenu"]();
    const _0x15e1d5 = _0x54f403 && this['_supportsCameraFeatures']() && this["_sceneState"]["cameras"]["length"] > 0x0 && this["_openMenuKey"] === "camera";
    const _0x4fef59 = _0x54f403 && !this['_isPanorama360'] && this["_sceneState"]?.["mode"] === "scene" && this["_openMenuKey"] === "focus";
    const _0x48088a = _0x54f403 && this["_openMenuKey"] === "capture";
    const _0x2ad162 = _0x54f403 && this["_supportsCubeCreation"]() && this['_openMenuKey'] === "grid";
    const _0x5c7d28 = _0x54f403 && this['_supportsCubeCreation']() && this["_openMenuKey"] === "mannequin";
    const _0x4bdb55 = _0x54f403 && this['_supportsCubeCreation']() && this["_openMenuKey"] === "assets";
    const _0x2e859b = _0x54f403 && this["_supportsCubeCreation"]() && this["_openMenuKey"] === 'pose' && this["_sceneState"]?.["selection"]?.["selectedObjectType"] === 'mannequin';
    const _0x1d7112 = _0x54f403 && this["_supportsCameraFeatures"]() && this["_sceneState"]?.['ui']?.['showTimeline'] === !![];
    this['el']["classList"]["toggle"]('has-camera-timeline', _0x1d7112);
    this["_captureMenuEl"]["classList"]["toggle"]("is-visible", _0x48088a);
    this["_cameraListEl"]['classList']["toggle"]('is-visible', _0x15e1d5);
    this["_focusMenuEl"]["classList"]["toggle"]("is-visible", _0x4fef59);
    this["_gridPanelEl"]['classList']["toggle"]("is-visible", _0x2ad162);
    this["_mannequinMenuEl"]['classList']["toggle"]('is-visible', _0x5c7d28);
    this["_assetBrowserEl"]['classList']["toggle"]('is-visible', _0x4bdb55);
    this['_posePanelEl']["classList"]['toggle']("is-visible", _0x2e859b);
    this['_timelinePanelEl']['classList']['toggle']("is-visible", _0x1d7112);
    this["_captureMenuEl"]["hidden"] = !_0x48088a;
    this["_cameraListEl"]["hidden"] = !_0x15e1d5;
    this["_focusMenuEl"]["hidden"] = !_0x4fef59;
    this['_gridPanelEl']['hidden'] = !_0x2ad162;
    this["_mannequinMenuEl"]['hidden'] = !_0x5c7d28;
    this["_assetBrowserEl"]["hidden"] = !_0x4bdb55;
    this["_posePanelEl"]["hidden"] = !_0x2e859b;
    this["_timelinePanelEl"]["hidden"] = !_0x1d7112;
    !_0x1d7112 && this["_isTimelinePlaying"] && this["_stopCameraTimelinePlayback"]({
      'clearDraft': !![]
    });
    _0x4fef59 && this["_focusMenuEl"]?.['_syncValue']?.();
    this['_statusEl']['classList']["toggle"]("is-visible", !![]);
    this["_hintEl"]["classList"]["toggle"]('is-visible', !![]);
    this["_syncAttachedUiVisibility"](_0x474785);
    this["_syncCaptureSafeFrame"]();
    const _0x3e8e66 = this["_bottomToolbarEl"]?.["querySelector"](".act-focus");
    if (_0x3e8e66) {
      const _0x11b2a0 = _0x4fef59 ? '' : panoramaSceneText("toolbar.focus");
      _0x11b2a0 ? _0x3e8e66["dataset"]["tooltip"] = _0x11b2a0 : _0x3e8e66["removeAttribute"]("data-tooltip");
      _0x3e8e66["setAttribute"]("aria-label", panoramaSceneText("toolbar.focus"));
    }
    this["_positionMenus"]();
  }
  ["update"](_0x4533fc) {
    const _0x3f9a9e = this["_sceneState"];
    this["_data"] = _0x4533fc;
    this["_isPanorama360"] = String(_0x4533fc?.['type'] || '')['trim']() === PANORAMA_360_NODE_TYPE;
    this['el']["classList"]["toggle"]("is-panorama-360", this["_isPanorama360"]);
    this["_sceneState"] = getPanoramaSceneState(_0x4533fc);
    !this["_sceneState"]['ui']['isEditing'] && (this['_openMenuKey'] = null);
    this['_maybePreloadCharacterModels'](_0x3f9a9e);
    !this["_isPanorama360"] && this["_sceneState"]?.["mode"] === "scene" && (!_0x3f9a9e || !this['_isDefaultSceneView'](_0x3f9a9e?.['viewport']?.["sceneView"]) && this['_isDefaultSceneView'](this["_sceneState"]?.["viewport"]?.["sceneView"])) ? this['_setDefaultSceneFocalLength'](SCENE_DEFAULT_FOCAL_LENGTH_MM) : this["_bridge"]?.["setDefaultSceneFocalLength"]?.(this["_defaultSceneFocalLength"]);
    this["_syncToolbarState"]();
    this["_syncGridPanelValues"]();
    renderMannequinQuickMenu(this["_mannequinMenuEl"], this["_sceneState"]);
    renderSceneAssetBrowser(this["_assetBrowserEl"]);
    renderMannequinPosePanel(this["_posePanelEl"], this["_sceneState"]);
    const _0x292b57 = normalizeCameraTimeline(this["_sceneState"]?.["cameraTimeline"]);
    !this["_isTimelinePlaying"] && (this['_timelinePreviewTime'] = _0x292b57["currentTime"]);
    renderCameraTimelinePanel(this["_timelinePanelEl"], _0x292b57, {
      'currentTime': this["_timelinePreviewTime"],
      'isPlaying': this['_isTimelinePlaying']
    });
    this['_renderCameraPresetList']();
    this["_syncHintAndStatus"]();
    this["_syncCaptureMenuState"]();
    this["_syncOverlayState"]();
    this["_bridge"]?.["sync"]?.(this["_sceneState"]);
    this["_maybeReleasePendingCameraJumpDraft"]();
  }
  ["unmount"]() {
    this["_isUnmounted"] = !![];
    clearTimeout(this["_menuHideTimer"]);
    this["_fileInput"]?.["removeEventListener"]("change", this['_handleFileInputChange']);
    this['_viewportEl']?.["removeEventListener"]("pointerdown", this["_handleViewportPointerDown"]);
    this['_viewportEl']?.["removeEventListener"]("contextmenu", this["_handleViewportContextMenu"]);
    this["_viewportEl"]?.["removeEventListener"]("dblclick", this["_handleViewportDoubleClick"]);
    this['el']?.["removeEventListener"]("pointerenter", this["_handleNodePointerEnter"]);
    this['el']?.['removeEventListener']("pointerleave", this["_handleNodePointerLeave"]);
    this["_sceneToolbarEl"]?.["removeEventListener"]("click", this['_handleToolbarClick']);
    this["_editToolbarEl"]?.['removeEventListener']('click', this['_handleToolbarClick']);
    this["_cornerToolbarEl"]?.['removeEventListener']('click', this["_handleToolbarClick"]);
    this["_bottomToolbarEl"]?.["removeEventListener"]("click", this["_handleToolbarClick"]);
    this['_bottomToolbarEl']?.["removeEventListener"]("pointerover", this['_handleBottomToolbarPointerEnter']);
    this["_bottomToolbarEl"]?.['removeEventListener']("pointerout", this["_handleBottomToolbarPointerLeave"]);
    this["_captureMenuEl"]?.["removeEventListener"]("click", this["_handleCaptureMenuClick"]);
    this["_unsubscribeSelection"]?.();
    this["_unsubscribeSelection"] = null;
    this["_unsubscribeViewport"]?.();
    this['_unsubscribeViewport'] = null;
    this["_unsubscribePanoramaIncomingSync"]?.();
    this["_unsubscribePanoramaIncomingSync"] = null;
    this['_unsubscribeLocale']?.();
    this["_unsubscribeLocale"] = null;
    window["removeEventListener"]("resize", this["_handleWindowResize"]);
    window["removeEventListener"]('pointerdown', this["_handleGlobalPointerDown"], !![]);
    window["removeEventListener"]("keydown", this["_handleWindowKeyDown"], !![]);
    window["removeEventListener"]("keyup", this['_handleWindowKeyUp'], !![]);
    window["removeEventListener"]("blur", this["_handleWindowBlur"]);
    window["removeEventListener"]("shortcuts-updated", this["_handleShortcutsUpdated"]);
    window["removeEventListener"]("panorama-scene:camera-shortcut", this["_handleCameraShortcutEvent"]);
    window["removeEventListener"]("panorama-scene:capture-shortcut", this["_handleCaptureShortcutEvent"]);
    void this['_exitBrowserFullscreen']({
      'skipSync': !![]
    });
    this["_cameraJumpRaf"] && (cancelAnimationFrame(this["_cameraJumpRaf"]), this["_cameraJumpRaf"] = 0x0);
    this["_pendingCameraJumpReleaseRaf"] && (cancelAnimationFrame(this["_pendingCameraJumpReleaseRaf"]), this["_pendingCameraJumpReleaseRaf"] = 0x0);
    this['_pendingCameraJumpCommit'] = null;
    this["_stopCameraTimelinePlayback"]({
      'clearDraft': !![]
    });
    this["_resizeObserver"]?.["disconnect"]();
    this["_interaction"]?.["detach"]?.();
    this["_bridge"]?.["dispose"]?.();
  }
}