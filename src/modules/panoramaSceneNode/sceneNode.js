import { PANORAMA_SCENE_CAMERA_CONSTRAINTS, SCENE_DEFAULT_FOCAL_LENGTH_MM, SCENE_ORBIT_DISTANCE_MAX, SCENE_ORBIT_DISTANCE_MIN, clampPanoramaPitch, clampSceneFocalLength, clampSceneOrbitPitch } from '../../core/panoramaSceneMath.js';
import { t } from '../../i18n/index.js';
import { createDefaultCameraTimeline, normalizeCameraTimeline } from './cameraTimeline.js';
import { resolveSceneAsset } from './sceneAssetCatalog.js';
import { DEFAULT_MANNEQUIN_POSE_ID, normalizeBonePose, normalizeCustomMannequinPose } from './poseCatalog.js';
function panoramaSceneText(_0x3882c4, _0x359e92 = {}) {
  return t("panoramaSceneNode." + _0x3882c4, _0x359e92);
}
const PANORAMA_SCENE_NODE_TYPE = "panorama-scene";
const PANORAMA_SCENE_NODE_ALIASES = ["panorama_scene"];
const PANORAMA_360_NODE_TYPE = 'panorama-360';
const PANORAMA_360_NODE_ALIASES = ["panorama_360", 'panorama360'];
const PANORAMA_SCENE_CAMERA_LIMIT = 0xa;
const PANORAMA_SCENE_DEFAULT_SIZE = Object["freeze"]({
  'width': 0x400,
  'height': 0x240
});
const PANORAMA_SCENE_COLLAPSED_MAX_SIZE = 0x120;
const PANORAMA_SCENE_DEFAULT_NAME = "3D导演台";
const PANORAMA_360_DEFAULT_NAME = '360全景图';
function getPanoramaSceneDefaultName() {
  return panoramaSceneText("defaults.sceneNodeName");
}
function getPanorama360DefaultName() {
  return panoramaSceneText('defaults.panorama360NodeName');
}
const PANORAMA_SCENE_COLOR_TOKENS = Object["freeze"]({
  'red': '--red',
  'blue': "--blue",
  'green': '--green',
  'yellow': "--gold",
  'purple': "--purple",
  'cyan': "--cyan",
  'black': "--black",
  'white': '--white'
});
const DEFAULT_SCENE_VIEW = Object["freeze"]({
  'target': Object["freeze"]({
    'x': 0x0,
    'y': 1.2,
    'z': 0x0
  }),
  'orbitYaw': Math['PI'] / 0x4,
  'orbitPitch': Math['PI'] / 0x4,
  'orbitDistance': 0x9
});
const DEFAULT_PANORAMA_VIEW = Object["freeze"]({
  'yaw': 0x0,
  'pitch': PANORAMA_SCENE_CAMERA_CONSTRAINTS["panorama"]["pitch"]["default"],
  'fov': PANORAMA_SCENE_CAMERA_CONSTRAINTS["panorama"]["fov"]["default"]
});
const DEFAULT_GRID_PLACEMENT = Object['freeze']({
  'rows': 0x2,
  'cols': 0x3,
  'spacingX': 1.8,
  'spacingZ': 1.8,
  'gender': "male",
  'colorKey': 'blue'
});
function toFiniteNumber(_0x18224c, _0x11587c) {
  const _0x50ae43 = Number(_0x18224c);
  return Number["isFinite"](_0x50ae43) ? _0x50ae43 : _0x11587c;
}
function normalizeVector3(_0x36db19, _0x368e1b) {
  return {
    'x': toFiniteNumber(_0x36db19?.['x'], _0x368e1b['x']),
    'y': toFiniteNumber(_0x36db19?.['y'], _0x368e1b['y']),
    'z': toFiniteNumber(_0x36db19?.['z'], _0x368e1b['z'])
  };
}
function normalizeEuler(_0x1f7c47, _0x4f3df9) {
  return {
    'x': toFiniteNumber(_0x1f7c47?.['x'], _0x4f3df9['x']),
    'y': toFiniteNumber(_0x1f7c47?.['y'], _0x4f3df9['y']),
    'z': toFiniteNumber(_0x1f7c47?.['z'], _0x4f3df9['z'])
  };
}
function normalizeScaleValue(_0x167ae0, _0x383958 = 0x1) {
  if (Number["isFinite"](_0x167ae0)) {
    return Math["max"](0.01, Number(_0x167ae0) || 0x1);
  }
  if (_0x167ae0 && Number['isFinite'](_0x167ae0['x']) && Number['isFinite'](_0x167ae0['y']) && Number["isFinite"](_0x167ae0['z'])) {
    return {
      'x': Math["max"](0.01, Number(_0x167ae0['x']) || 0x1),
      'y': Math["max"](0.01, Number(_0x167ae0['y']) || 0x1),
      'z': Math["max"](0.01, Number(_0x167ae0['z']) || 0x1)
    };
  }
  if (_0x383958 && Number['isFinite'](_0x383958['x']) && Number['isFinite'](_0x383958['y']) && Number['isFinite'](_0x383958['z'])) {
    return {
      'x': Math['max'](0.01, Number(_0x383958['x']) || 0x1),
      'y': Math['max'](0.01, Number(_0x383958['y']) || 0x1),
      'z': Math['max'](0.01, Number(_0x383958['z']) || 0x1)
    };
  }
  return Math["max"](0.01, Number(_0x383958) || 0x1);
}
function clamp(_0x1032f1, _0x170efe, _0x154387) {
  return Math['min'](_0x154387, Math['max'](_0x170efe, _0x1032f1));
}
function normalizeQuaternion(_0x4cd609, _0x1c420a = {
  'x': 0x0,
  'y': 0x0,
  'z': 0x0,
  'w': 0x1
}) {
  const _0x4da2b6 = Number(_0x4cd609?.['x']);
  const _0xb3f0d7 = Number(_0x4cd609?.['y']);
  const _0x28ac95 = Number(_0x4cd609?.['z']);
  const _0x17fde8 = Number(_0x4cd609?.['w']);
  if (!Number['isFinite'](_0x4da2b6) || !Number["isFinite"](_0xb3f0d7) || !Number['isFinite'](_0x28ac95) || !Number["isFinite"](_0x17fde8)) {
    return {
      ..._0x1c420a
    };
  }
  const _0x51759b = Math["hypot"](_0x4da2b6, _0xb3f0d7, _0x28ac95, _0x17fde8);
  if (_0x51759b < 0.000001) {
    return {
      ..._0x1c420a
    };
  }
  return {
    'x': _0x4da2b6 / _0x51759b,
    'y': _0xb3f0d7 / _0x51759b,
    'z': _0x28ac95 / _0x51759b,
    'w': _0x17fde8 / _0x51759b
  };
}
function quaternionFromEulerYXZ(_0x3de662) {
  const _0xf5e6b6 = Number(_0x3de662?.['x']) || 0x0;
  const _0xca028b = Number(_0x3de662?.['y']) || 0x0;
  const _0x5bc93e = Number(_0x3de662?.['z']) || 0x0;
  const _0x11bf3a = Math["cos"](_0xf5e6b6 / 0x2);
  const _0x80193f = Math["cos"](_0xca028b / 0x2);
  const _0x370975 = Math["cos"](_0x5bc93e / 0x2);
  const _0x44945c = Math["sin"](_0xf5e6b6 / 0x2);
  const _0x278e1b = Math["sin"](_0xca028b / 0x2);
  const _0x3e7d6f = Math["sin"](_0x5bc93e / 0x2);
  return normalizeQuaternion({
    'x': _0x44945c * _0x80193f * _0x370975 + _0x11bf3a * _0x278e1b * _0x3e7d6f,
    'y': _0x11bf3a * _0x278e1b * _0x370975 - _0x44945c * _0x80193f * _0x3e7d6f,
    'z': _0x11bf3a * _0x80193f * _0x3e7d6f - _0x44945c * _0x278e1b * _0x370975,
    'w': _0x11bf3a * _0x80193f * _0x370975 + _0x44945c * _0x278e1b * _0x3e7d6f
  });
}
function eulerFromQuaternionYXZ(_0x20c98c) {
  const _0x3eb9de = normalizeQuaternion(_0x20c98c);
  const _0xc21a59 = _0x3eb9de['x'] * _0x3eb9de['x'];
  const _0x139bb6 = _0x3eb9de['y'] * _0x3eb9de['y'];
  const _0x2e2a25 = _0x3eb9de['z'] * _0x3eb9de['z'];
  const _0x39221f = _0x3eb9de['x'] * _0x3eb9de['y'];
  const _0x20c2c9 = _0x3eb9de['x'] * _0x3eb9de['z'];
  const _0x3aaa5c = _0x3eb9de['y'] * _0x3eb9de['z'];
  const _0x47364c = _0x3eb9de['x'] * _0x3eb9de['w'];
  const _0x5bf156 = _0x3eb9de['y'] * _0x3eb9de['w'];
  const _0x2fc4a5 = _0x3eb9de['z'] * _0x3eb9de['w'];
  const _0x741d3a = 0x1 - 0x2 * (_0x139bb6 + _0x2e2a25);
  const _0x40ba1f = 0x2 * (_0x20c2c9 + _0x5bf156);
  const _0x4d9ef0 = 0x2 * (_0x39221f + _0x2fc4a5);
  const _0x4e74bd = 0x1 - 0x2 * (_0xc21a59 + _0x2e2a25);
  const _0x5c43e9 = 0x2 * (_0x3aaa5c - _0x47364c);
  const _0x4da36c = 0x2 * (_0x20c2c9 - _0x5bf156);
  const _0x35c90b = 0x1 - 0x2 * (_0xc21a59 + _0x139bb6);
  const _0x395d58 = Math["asin"](-clamp(_0x5c43e9, -0x1, 0x1));
  if (Math["abs"](_0x5c43e9) < 0.9999999) {
    return {
      'x': _0x395d58,
      'y': Math["atan2"](_0x40ba1f, _0x35c90b),
      'z': Math["atan2"](_0x4d9ef0, _0x4e74bd)
    };
  }
  return {
    'x': _0x395d58,
    'y': Math['atan2'](-_0x4da36c, _0x741d3a),
    'z': 0x0
  };
}
function quaternionFromEulerXYZ(_0xdd9cad) {
  const _0x1819d8 = Number(_0xdd9cad?.['x']) || 0x0;
  const _0x4c62bf = Number(_0xdd9cad?.['y']) || 0x0;
  const _0x1d9144 = Number(_0xdd9cad?.['z']) || 0x0;
  const _0x3f77f3 = Math["cos"](_0x1819d8 / 0x2);
  const _0x12054a = Math["cos"](_0x4c62bf / 0x2);
  const _0x5bad5c = Math['cos'](_0x1d9144 / 0x2);
  const _0x538cd5 = Math["sin"](_0x1819d8 / 0x2);
  const _0x4b10fc = Math['sin'](_0x4c62bf / 0x2);
  const _0x54f69d = Math['sin'](_0x1d9144 / 0x2);
  return normalizeQuaternion({
    'x': _0x538cd5 * _0x12054a * _0x5bad5c + _0x3f77f3 * _0x4b10fc * _0x54f69d,
    'y': _0x3f77f3 * _0x4b10fc * _0x5bad5c - _0x538cd5 * _0x12054a * _0x54f69d,
    'z': _0x3f77f3 * _0x12054a * _0x54f69d + _0x538cd5 * _0x4b10fc * _0x5bad5c,
    'w': _0x3f77f3 * _0x12054a * _0x5bad5c - _0x538cd5 * _0x4b10fc * _0x54f69d
  });
}
function eulerFromQuaternionXYZ(_0x2068c6) {
  const _0x2e0aef = normalizeQuaternion(_0x2068c6);
  const _0x2bc8e9 = _0x2e0aef['x'] * _0x2e0aef['x'];
  const _0x1c3a5f = _0x2e0aef['y'] * _0x2e0aef['y'];
  const _0x3c8fa2 = _0x2e0aef['z'] * _0x2e0aef['z'];
  const _0x192d62 = _0x2e0aef['x'] * _0x2e0aef['y'];
  const _0x10d0e1 = _0x2e0aef['x'] * _0x2e0aef['z'];
  const _0x5cecf2 = _0x2e0aef['y'] * _0x2e0aef['z'];
  const _0x527853 = _0x2e0aef['x'] * _0x2e0aef['w'];
  const _0x43fbcd = _0x2e0aef['y'] * _0x2e0aef['w'];
  const _0x1af39d = _0x2e0aef['z'] * _0x2e0aef['w'];
  const _0x230ff6 = 0x1 - 0x2 * (_0x1c3a5f + _0x3c8fa2);
  const _0x408d1a = 0x2 * (_0x192d62 - _0x1af39d);
  const _0x5f1e5a = 0x2 * (_0x10d0e1 + _0x43fbcd);
  const _0x2250ea = 0x2 * (_0x5cecf2 - _0x527853);
  const _0x442bf1 = 0x1 - 0x2 * (_0x2bc8e9 + _0x1c3a5f);
  const _0x311903 = 0x2 * (_0x5cecf2 + _0x527853);
  const _0x445bf8 = 0x1 - 0x2 * (_0x2bc8e9 + _0x3c8fa2);
  const _0x8f07db = Math["asin"](clamp(_0x5f1e5a, -0x1, 0x1));
  if (Math['abs'](_0x5f1e5a) < 0.9999999) {
    return {
      'x': Math['atan2'](-_0x2250ea, _0x442bf1),
      'y': _0x8f07db,
      'z': Math["atan2"](-_0x408d1a, _0x230ff6)
    };
  }
  return {
    'x': Math["atan2"](_0x311903, _0x445bf8),
    'y': _0x8f07db,
    'z': 0x0
  };
}
function normalizeMode(_0x2c4267) {
  return _0x2c4267 === "panorama" ? "panorama" : 'scene';
}
function normalizeNodeTypeValue(_0x439363) {
  return String(_0x439363 || '')["trim"]();
}
export function isPanoramaSceneNodeType(_0x3fb2d0) {
  const _0x3a6089 = normalizeNodeTypeValue(_0x3fb2d0);
  return _0x3a6089 === PANORAMA_SCENE_NODE_TYPE || PANORAMA_SCENE_NODE_ALIASES["includes"](_0x3a6089);
}
export function isPanorama360NodeType(_0x341e3d) {
  const _0xeb76ab = normalizeNodeTypeValue(_0x341e3d);
  return _0xeb76ab === PANORAMA_360_NODE_TYPE || PANORAMA_360_NODE_ALIASES['includes'](_0xeb76ab);
}
export function isPanoramaGraphNodeType(_0x3baa10) {
  return isPanoramaSceneNodeType(_0x3baa10) || isPanorama360NodeType(_0x3baa10);
}
export function getPanoramaStateFieldByNodeType(_0xcca06d) {
  if (isPanorama360NodeType(_0xcca06d)) {
    return 'panorama360Node';
  }
  if (isPanoramaSceneNodeType(_0xcca06d)) {
    return 'sceneNode';
  }
  return '';
}
function normalizeEnvironmentMode(_0x5cf4e8) {
  return _0x5cf4e8 === 'night' ? 'night' : "day";
}
function normalizeActiveView(_0x5c2a6d) {
  return _0x5c2a6d === 'camera' ? "camera" : "default";
}
function normalizeSelectionType(_0x22f708) {
  return _0x22f708 === 'mannequin' || _0x22f708 === 'cube' || _0x22f708 === "camera" ? _0x22f708 : null;
}
function normalizeGender(_0x3dfbf8) {
  return _0x3dfbf8 === "female" ? "female" : "male";
}
function normalizeBodyProfile(_0x1b8f0b) {
  if (!_0x1b8f0b || typeof _0x1b8f0b !== "object") {
    return null;
  }
  return {
    'gender': normalizeGender(_0x1b8f0b['gender']),
    'ageGroup': String(_0x1b8f0b["ageGroup"] || "adult")['trim']() || "adult",
    'height': clamp(toFiniteNumber(_0x1b8f0b['height'], 1.92), 0.55, 2.3),
    'shoulderScale': clamp(toFiniteNumber(_0x1b8f0b['shoulderScale'], 0x1), 0.65, 1.35),
    'hipScale': clamp(toFiniteNumber(_0x1b8f0b["hipScale"], 0x1), 0.65, 1.35),
    'headScale': clamp(toFiniteNumber(_0x1b8f0b["headScale"], 0x1), 0.85, 1.45),
    'depthScale': clamp(toFiniteNumber(_0x1b8f0b["depthScale"], 0x1), 0.75, 1.25)
  };
}
function normalizeColorKey(_0x4edacb) {
  return PANORAMA_SCENE_COLOR_TOKENS[_0x4edacb] ? _0x4edacb : "blue";
}
function normalizeLegacyTool(_0x575ba1) {
  return _0x575ba1 === 'move' || _0x575ba1 === "rotate" || _0x575ba1 === "scale" || _0x575ba1 === 'box-select' ? _0x575ba1 : "navigate";
}
function normalizeMouseTool(_0x18b25d) {
  return _0x18b25d === "box-select" ? "box-select" : 'navigate';
}
function normalizeTransformTool(_0x4f6e79) {
  return _0x4f6e79 === "move" || _0x4f6e79 === "rotate" || _0x4f6e79 === "scale" ? _0x4f6e79 : 'move';
}
function normalizeTransformSpace(_0x5e029b) {
  return _0x5e029b === "local" ? "local" : 'world';
}
function normalizePivotMode(_0x5dc8f6) {
  return _0x5dc8f6 === 'center' ? 'center' : "active";
}
function normalizeNavigationPreset(_0xa3f71f) {
  return _0xa3f71f === "dcc" ? "dcc" : 'dcc';
}
function normalizeNavigationMode(_0x15b490) {
  return _0x15b490 === "fly" ? "fly" : "orbit";
}
function normalizeCaptureMode(_0x504b0a) {
  const _0x343603 = String(_0x504b0a || '')["trim"]();
  if (_0x343603 === '9:16' || _0x343603 === "2.35:1") {
    return _0x343603;
  }
  return "adaptive";
}
export function createDefaultSceneView() {
  return {
    'target': {
      ...DEFAULT_SCENE_VIEW["target"]
    },
    'orbitYaw': DEFAULT_SCENE_VIEW["orbitYaw"],
    'orbitPitch': DEFAULT_SCENE_VIEW["orbitPitch"],
    'orbitDistance': DEFAULT_SCENE_VIEW["orbitDistance"]
  };
}
export function createDefaultPanoramaView() {
  return {
    ...DEFAULT_PANORAMA_VIEW
  };
}
export function createDefaultGridPlacement() {
  return {
    ...DEFAULT_GRID_PLACEMENT
  };
}
export function createDefaultPanoramaSceneState() {
  return {
    'version': 0x2,
    'mode': "scene",
    'environmentMode': 'night',
    'viewport': {
      'activeView': "default",
      'activeCameraId': null,
      'sceneView': createDefaultSceneView(),
      'panoramaView': createDefaultPanoramaView()
    },
    'panorama': {
      'localPath': null,
      'imageUrl': null,
      'previewImageUrl': null,
      'fileName': null,
      'sourceSignature': null,
      'isLoaded': ![],
      'error': null
    },
    'mannequins': [],
    'cubes': [],
    'cameras': [],
    'customPoses': [],
    'cameraTimeline': createDefaultCameraTimeline(),
    'selection': {
      'selectedObjectType': null,
      'selectedObjectId': null,
      'selectedObjectIds': [],
      'selectedObjects': [],
      'selectedGroupId': null
    },
    'groups': [],
    'gridPlacement': createDefaultGridPlacement(),
    'capture': {
      'pending': ![],
      'lastCaptureAt': null,
      'error': null,
      'mode': "adaptive",
      'showSafeFrame': ![]
    },
    'ui': {
      'mouseTool': "navigate",
      'transformTool': "move",
      'activeTool': "navigate",
      'transformSpace': "world",
      'pivotMode': 'active',
      'navigationPreset': "dcc",
      'navigationMode': "orbit",
      'flySpeed': 0x4,
      'snapEnabled': ![],
      'translationSnap': 0.25,
      'rotationSnap': Math['PI'] / 0xc,
      'scaleSnap': 0.1,
      'groundLock': !![],
      'uniformScale': !![],
      'showCameraList': ![],
      'showTimeline': ![],
      'showOutline': !![],
      'isEditing': ![]
    }
  };
}
export function createDefaultPanorama360State() {
  const _0x4708a1 = createDefaultPanoramaSceneState();
  _0x4708a1["mode"] = "panorama";
  _0x4708a1["viewport"]["activeView"] = "default";
  _0x4708a1["viewport"]["activeCameraId"] = null;
  _0x4708a1['cubes'] = [];
  _0x4708a1["cameras"] = [];
  _0x4708a1['ui']['showCameraList'] = ![];
  return _0x4708a1;
}
export function normalizePanoramaSceneState(_0x19e466) {
  const _0x157de2 = createDefaultPanoramaSceneState();
  const _0xcc9334 = {
    ..._0x157de2["viewport"]["sceneView"],
    ...(_0x19e466?.["viewport"]?.["sceneView"] || {})
  };
  delete _0xcc9334["fov"];
  _0xcc9334['target'] = normalizeVector3(_0x19e466?.['viewport']?.["sceneView"]?.["target"], _0x157de2["viewport"]["sceneView"]["target"]);
  _0xcc9334["orbitYaw"] = toFiniteNumber(_0x19e466?.["viewport"]?.['sceneView']?.["orbitYaw"], _0x157de2["viewport"]["sceneView"]["orbitYaw"]);
  _0xcc9334["orbitPitch"] = clampSceneOrbitPitch(toFiniteNumber(_0x19e466?.["viewport"]?.["sceneView"]?.['orbitPitch'], _0x157de2['viewport']["sceneView"]["orbitPitch"]));
  _0xcc9334['orbitDistance'] = clamp(toFiniteNumber(_0x19e466?.["viewport"]?.["sceneView"]?.["orbitDistance"], _0x157de2["viewport"]["sceneView"]["orbitDistance"]), SCENE_ORBIT_DISTANCE_MIN, SCENE_ORBIT_DISTANCE_MAX);
  const _0x4756c2 = {
    ..._0x157de2["viewport"]["panoramaView"],
    ...(_0x19e466?.["viewport"]?.["panoramaView"] || {})
  };
  _0x4756c2["yaw"] = toFiniteNumber(_0x19e466?.["viewport"]?.["panoramaView"]?.["yaw"], _0x157de2["viewport"]["panoramaView"]["yaw"]);
  _0x4756c2["pitch"] = clampPanoramaPitch(toFiniteNumber(_0x19e466?.["viewport"]?.["panoramaView"]?.['pitch'], _0x157de2['viewport']["panoramaView"]["pitch"]));
  _0x4756c2["fov"] = Math['max'](PANORAMA_SCENE_CAMERA_CONSTRAINTS['panorama']["fov"]["min"], Math['min'](PANORAMA_SCENE_CAMERA_CONSTRAINTS["panorama"]["fov"]["max"], toFiniteNumber(_0x19e466?.["viewport"]?.['panoramaView']?.['fov'], _0x157de2["viewport"]['panoramaView']["fov"])));
  const _0x211092 = Array["isArray"](_0x19e466?.["mannequins"]) ? _0x19e466['mannequins']["filter"](_0x2011df => _0x2011df && _0x2011df['id'])["map"](_0x26474c => {
    const _0x35000f = normalizeEuler(_0x26474c["rotation"], {
      'x': 0x0,
      'y': 0x0,
      'z': 0x0
    });
    const _0x21d787 = Number["isFinite"](Number(_0x26474c?.['quaternion']?.['x'])) && Number["isFinite"](Number(_0x26474c?.["quaternion"]?.['y'])) && Number["isFinite"](Number(_0x26474c?.['quaternion']?.['z'])) && Number["isFinite"](Number(_0x26474c?.["quaternion"]?.['w']));
    const _0x3d5f75 = _0x21d787 ? normalizeQuaternion(_0x26474c["quaternion"], quaternionFromEulerXYZ(_0x35000f)) : quaternionFromEulerXYZ(_0x35000f);
    const _0x536d0c = _0x21d787 ? eulerFromQuaternionXYZ(_0x3d5f75) : _0x35000f;
    return {
      'id': _0x26474c['id'],
      'gender': normalizeGender(_0x26474c["gender"]),
      'bodyPresetId': String(_0x26474c["bodyPresetId"] || '')["trim"]() || null,
      'characterStyle': _0x26474c['characterStyle'] === 'articulated' ? 'articulated' : 'anatomical',
      'bodyProfile': normalizeBodyProfile(_0x26474c["bodyProfile"]),
      'colorKey': normalizeColorKey(_0x26474c["colorKey"] || _0x26474c['color']),
      'poseId': String(_0x26474c["poseId"] || DEFAULT_MANNEQUIN_POSE_ID)["trim"]() || DEFAULT_MANNEQUIN_POSE_ID,
      'customPoseId': _0x26474c["customPoseId"] ? String(_0x26474c["customPoseId"])["trim"]() : null,
      'bonePose': normalizeBonePose(_0x26474c["bonePose"]),
      'position': normalizeVector3(_0x26474c["position"], {
        'x': 0x0,
        'y': 0x0,
        'z': 0x0
      }),
      'rotation': _0x536d0c,
      'quaternion': _0x3d5f75,
      'scale': normalizeScaleValue(_0x26474c['scale'], 0x1)
    };
  }) : [];
  const _0x55bcec = Array["isArray"](_0x19e466?.["cubes"]) ? _0x19e466["cubes"]["filter"](_0x5a7a9b => _0x5a7a9b && _0x5a7a9b['id'])["map"](_0x413a59 => {
    const _0x347c8a = normalizeEuler(_0x413a59["rotation"], {
      'x': 0x0,
      'y': 0x0,
      'z': 0x0
    });
    const _0x445ee1 = Number["isFinite"](Number(_0x413a59?.["quaternion"]?.['x'])) && Number["isFinite"](Number(_0x413a59?.["quaternion"]?.['y'])) && Number["isFinite"](Number(_0x413a59?.['quaternion']?.['z'])) && Number["isFinite"](Number(_0x413a59?.["quaternion"]?.['w']));
    const _0x50a225 = _0x445ee1 ? normalizeQuaternion(_0x413a59["quaternion"], quaternionFromEulerXYZ(_0x347c8a)) : quaternionFromEulerXYZ(_0x347c8a);
    const _0x44d176 = _0x445ee1 ? eulerFromQuaternionXYZ(_0x50a225) : _0x347c8a;
    return {
      'id': _0x413a59['id'],
      'assetId': resolveSceneAsset(_0x413a59["assetId"])?.['id'] || null,
      'colorKey': normalizeColorKey(_0x413a59["colorKey"] || _0x413a59["color"]),
      'position': normalizeVector3(_0x413a59["position"], {
        'x': 0x0,
        'y': 0x0,
        'z': 0x0
      }),
      'rotation': _0x44d176,
      'quaternion': _0x50a225,
      'scale': normalizeScaleValue(_0x413a59["scale"], 0x1)
    };
  }) : [];
  const _0x3d7fa2 = Array["isArray"](_0x19e466?.["cameras"]) ? _0x19e466['cameras']['filter'](_0x58629d => _0x58629d && _0x58629d['id'])["slice"](0x0, PANORAMA_SCENE_CAMERA_LIMIT)["map"]((_0x1c90ab, _0x3c918e) => {
    const _0x4447ed = normalizeEuler(_0x1c90ab["rotation"], {
      'x': 0x0,
      'y': 0x0,
      'z': 0x0
    });
    const _0x5bf563 = Number["isFinite"](Number(_0x1c90ab?.["quaternion"]?.['x'])) && Number["isFinite"](Number(_0x1c90ab?.['quaternion']?.['y'])) && Number["isFinite"](Number(_0x1c90ab?.["quaternion"]?.['z'])) && Number["isFinite"](Number(_0x1c90ab?.["quaternion"]?.['w']));
    const _0xa56c3e = _0x5bf563 ? normalizeQuaternion(_0x1c90ab["quaternion"], quaternionFromEulerYXZ(_0x4447ed)) : quaternionFromEulerYXZ(_0x4447ed);
    const _0x4ecc1d = _0x5bf563 ? eulerFromQuaternionYXZ(_0xa56c3e) : _0x4447ed;
    return {
      'id': _0x1c90ab['id'],
      'slot': Number["isInteger"](Number(_0x1c90ab["slot"])) ? Math["max"](0x1, Math["min"](PANORAMA_SCENE_CAMERA_LIMIT, Number(_0x1c90ab["slot"]))) : null,
      'name': String(_0x1c90ab["name"] || panoramaSceneText("camera.defaultName", {
        'slot': _0x3c918e + 0x1
      }))['trim']() || panoramaSceneText('camera.defaultName', {
        'slot': _0x3c918e + 0x1
      }),
      'position': normalizeVector3(_0x1c90ab["position"], {
        'x': 0x0,
        'y': 1.6,
        'z': 0x4
      }),
      'quaternion': _0xa56c3e,
      'rotation': _0x4ecc1d,
      'focalLength': clampSceneFocalLength(Object['prototype']["hasOwnProperty"]["call"](_0x1c90ab || {}, 'focalLength') ? toFiniteNumber(_0x1c90ab["focalLength"], SCENE_DEFAULT_FOCAL_LENGTH_MM) : SCENE_DEFAULT_FOCAL_LENGTH_MM)
    };
  }) : [];
  const _0x369ab1 = new Map();
  Array["isArray"](_0x19e466?.["customPoses"]) && _0x19e466["customPoses"]['forEach'](_0x1030b1 => {
    const _0x46be68 = normalizeCustomMannequinPose(_0x1030b1);
    if (!_0x46be68['id'] || _0x46be68['id'] === "custom") {
      return;
    }
    _0x369ab1['set'](_0x46be68['id'], _0x46be68);
  });
  const _0x375ec8 = [..._0x369ab1["values"]()];
  const _0x59698f = normalizeCameraTimeline(_0x19e466?.["cameraTimeline"] || _0x157de2["cameraTimeline"]);
  const _0x232e91 = new Set(_0x211092["map"](_0x47f0ec => _0x47f0ec['id']));
  const _0x581f71 = new Set(_0x55bcec["map"](_0x5bbb14 => _0x5bbb14['id']));
  const _0x52bf42 = Array["isArray"](_0x19e466?.["groups"]) ? _0x19e466["groups"]["filter"](_0x170ab0 => _0x170ab0 && _0x170ab0['id'])["map"](_0x20d490 => {
    const _0x417222 = Array["isArray"](_0x20d490['memberIds']) ? [...new Set(_0x20d490["memberIds"]["map"](_0x5d1f2e => String(_0x5d1f2e || '')["trim"]())["filter"](Boolean))] : [];
    const _0x39f43e = _0x417222['filter'](_0x36e6ed => _0x232e91['has'](_0x36e6ed));
    return {
      'id': String(_0x20d490['id']),
      'type': _0x20d490["type"] === "mannequin-grid" ? "mannequin-grid" : 'mannequin-grid',
      'memberObjectType': _0x20d490['memberObjectType'] === "mannequin" ? 'mannequin' : 'mannequin',
      'memberIds': _0x39f43e
    };
  })["filter"](_0x476f8a => _0x476f8a["memberIds"]["length"] > 0x0) : [];
  const _0x9a2d13 = String(_0x19e466?.["viewport"]?.["activeCameraId"] || '')["trim"]() || null;
  const _0x5c32f2 = _0x9a2d13 ? _0x3d7fa2["some"](_0x4da429 => _0x4da429['id'] === _0x9a2d13) : ![];
  const _0x201fa6 = normalizeSelectionType(_0x19e466?.["selection"]?.['selectedObjectType']);
  const _0x396664 = _0x19e466?.["selection"]?.['selectedObjectId'] ? String(_0x19e466["selection"]["selectedObjectId"]) : null;
  const _0x6bceb6 = Array["isArray"](_0x19e466?.["selection"]?.["selectedObjectIds"]) ? [...new Set(_0x19e466["selection"]["selectedObjectIds"]["map"](_0x421c76 => String(_0x421c76 || '')['trim']())["filter"](Boolean))] : _0x396664 ? [_0x396664] : [];
  const _0x4dd440 = _0x19e466?.["selection"]?.["selectedGroupId"] ? String(_0x19e466["selection"]["selectedGroupId"])["trim"]() : null;
  const _0x3c7048 = _0x4dd440 ? _0x52bf42["find"](_0x5c11bb => _0x5c11bb['id'] === _0x4dd440) || null : null;
  const _0x427a45 = new Set(_0x3d7fa2["map"](_0x48c5e9 => _0x48c5e9['id']));
  const _0x487990 = Array["isArray"](_0x19e466?.['selection']?.['selectedObjects']) ? _0x19e466["selection"]["selectedObjects"] : [];
  const _0x2bb6ec = [];
  const _0x3d9dbb = new Set();
  _0x487990["forEach"](_0x585e39 => {
    const _0x529df4 = normalizeSelectionType(_0x585e39?.["objectType"]);
    const _0x53f648 = String(_0x585e39?.["objectId"] || '')["trim"]();
    if (!_0x529df4 || !_0x53f648) {
      return;
    }
    const _0x47042f = _0x529df4 === "camera" ? _0x427a45['has'](_0x53f648) : _0x529df4 === "cube" ? _0x581f71['has'](_0x53f648) : _0x232e91["has"](_0x53f648);
    if (!_0x47042f) {
      return;
    }
    const _0x47416d = _0x529df4 + ':' + _0x53f648;
    if (_0x3d9dbb['has'](_0x47416d)) {
      return;
    }
    _0x3d9dbb["add"](_0x47416d);
    _0x2bb6ec["push"]({
      'objectType': _0x529df4,
      'objectId': _0x53f648
    });
  });
  const _0x2b9077 = _0x201fa6;
  const _0x159f8b = _0x2b9077 === "camera" ? _0x396664 && _0x427a45["has"](_0x396664) ? _0x396664 : null : _0x2b9077 === 'cube' ? _0x396664 && _0x581f71["has"](_0x396664) ? _0x396664 : null : _0x396664 && _0x232e91['has'](_0x396664) ? _0x396664 : null;
  let _0x1bda95 = _0x6bceb6["filter"](_0x493652 => _0x2b9077 === "camera" ? _0x427a45["has"](_0x493652) : _0x2b9077 === 'cube' ? _0x581f71["has"](_0x493652) : _0x232e91['has'](_0x493652));
  let _0x54e81f = _0x2b9077;
  let _0x3b408b = _0x159f8b;
  let _0x4c98a5 = _0x3c7048 ? _0x3c7048['id'] : null;
  if (!_0x54e81f && _0x1bda95["length"] > 0x0) {
    const _0x456a39 = _0x1bda95[0x0];
    if (_0x581f71["has"](_0x456a39)) {
      _0x54e81f = "cube";
      _0x1bda95 = _0x1bda95["filter"](_0x410885 => _0x581f71["has"](_0x410885));
    } else {
      _0x427a45["has"](_0x456a39) ? (_0x54e81f = "camera", _0x1bda95 = _0x1bda95["filter"](_0x36fd99 => _0x427a45["has"](_0x36fd99))) : (_0x54e81f = 'mannequin', _0x1bda95 = _0x1bda95["filter"](_0x31e228 => _0x232e91["has"](_0x31e228)));
    }
  }
  if (_0x3c7048) {
    _0x54e81f = "mannequin";
    _0x1bda95 = [..._0x3c7048["memberIds"]];
    _0x3b408b = _0x3c7048["memberIds"][0x0] || null;
  } else {
    if (_0x1bda95["length"] > 0x0) {
      _0x3b408b = _0x1bda95['includes'](_0x3b408b) && _0x3b408b ? _0x3b408b : _0x1bda95[0x0];
      _0x54e81f !== "mannequin" && (_0x4c98a5 = null);
    } else {
      _0x3b408b ? _0x1bda95 = [_0x3b408b] : (_0x3b408b = null, _0x54e81f = null, _0x4c98a5 = null);
    }
  }
  let _0x411c61 = _0x2bb6ec;
  if (_0x411c61["length"] === 0x0) {
    if (_0x3c7048) {
      _0x411c61 = _0x3c7048['memberIds']["map"](_0xe06866 => ({
        'objectType': "mannequin",
        'objectId': _0xe06866
      }));
    } else {
      if (_0x54e81f === "cube" || _0x54e81f === 'mannequin') {
        const _0x4365d9 = _0x1bda95["length"] > 0x0 ? _0x1bda95 : _0x3b408b ? [_0x3b408b] : [];
        _0x411c61 = _0x4365d9["map"](_0x5c4408 => ({
          'objectType': _0x54e81f,
          'objectId': _0x5c4408
        }));
      }
    }
  }
  let _0x4ca7e8 = null;
  let _0x4d9f50 = null;
  let _0x49281f = [];
  if (_0x411c61["length"] > 0x0) {
    const _0x1d4e67 = _0x54e81f === "cube" || _0x54e81f === 'mannequin' ? _0x54e81f : null;
    const _0x29437a = _0x1d4e67 ? _0x411c61["some"](_0x541f78 => _0x541f78["objectType"] === _0x1d4e67) : ![];
    _0x4ca7e8 = _0x29437a ? _0x1d4e67 : _0x411c61[0x0]["objectType"];
    _0x49281f = _0x411c61['filter'](_0x23adbf => _0x23adbf["objectType"] === _0x4ca7e8)["map"](_0x440460 => _0x440460["objectId"]);
    const _0x3de6c4 = _0x3b408b && _0x411c61["some"](_0x27bcdf => _0x27bcdf['objectType'] === _0x4ca7e8 && _0x27bcdf['objectId'] === _0x3b408b);
    _0x4d9f50 = _0x3de6c4 ? _0x3b408b : _0x49281f[0x0] || null;
  } else {
    _0x4c98a5 = null;
  }
  if (_0x4c98a5) {
    const _0x46709c = _0x52bf42["find"](_0x2fad48 => _0x2fad48['id'] === _0x4c98a5) || null;
    if (!_0x46709c) {
      _0x4c98a5 = null;
    } else {
      const _0x2bef32 = new Set(_0x411c61["filter"](_0x585288 => _0x585288["objectType"] === "mannequin")["map"](_0xe4de90 => _0xe4de90['objectId']));
      const _0x2db708 = _0x411c61["every"](_0x4465a8 => _0x4465a8['objectType'] === "mannequin") && _0x46709c["memberIds"]["length"] > 0x0 && _0x46709c['memberIds']["every"](_0x576ed1 => _0x2bef32["has"](_0x576ed1)) && _0x46709c["memberIds"]['length'] === _0x411c61["length"];
      !_0x2db708 ? _0x4c98a5 = null : (_0x4ca7e8 = "mannequin", _0x49281f = [..._0x46709c['memberIds']], _0x4d9f50 = _0x46709c["memberIds"][0x0] || null, _0x411c61 = _0x46709c['memberIds']["map"](_0x58ca3c => ({
        'objectType': 'mannequin',
        'objectId': _0x58ca3c
      })));
    }
  }
  const _0x1a2f0b = normalizeLegacyTool(_0x19e466?.['ui']?.["activeTool"]);
  const _0x137d1a = normalizeMouseTool(_0x19e466?.['ui']?.["mouseTool"] != null ? _0x19e466['ui']['mouseTool'] : _0x1a2f0b === "box-select" ? 'box-select' : "navigate");
  const _0x5a0a9e = normalizeTransformTool(_0x19e466?.['ui']?.['transformTool'] != null ? _0x19e466['ui']["transformTool"] : _0x1a2f0b === "move" || _0x1a2f0b === "rotate" || _0x1a2f0b === "scale" ? _0x1a2f0b : "move");
  return {
    'version': 0x2,
    'mode': normalizeMode(_0x19e466?.["mode"]),
    'environmentMode': normalizeEnvironmentMode(_0x19e466?.["environmentMode"]),
    'viewport': {
      'activeView': normalizeActiveView(_0x19e466?.["viewport"]?.["activeView"]) === 'camera' && _0x5c32f2 ? "camera" : "default",
      'activeCameraId': _0x5c32f2 ? _0x9a2d13 : null,
      'sceneView': _0xcc9334,
      'panoramaView': _0x4756c2
    },
    'panorama': {
      'localPath': _0x19e466?.["panorama"]?.["localPath"] ? String(_0x19e466["panorama"]['localPath'])["trim"]() : null,
      'imageUrl': _0x19e466?.["panorama"]?.['imageUrl'] ? String(_0x19e466["panorama"]['imageUrl'])["trim"]() : null,
      'previewImageUrl': _0x19e466?.["panorama"]?.["previewImageUrl"] ? String(_0x19e466["panorama"]['previewImageUrl'])["trim"]() : null,
      'fileName': _0x19e466?.["panorama"]?.["fileName"] ? String(_0x19e466["panorama"]["fileName"])["trim"]() : null,
      'sourceSignature': _0x19e466?.["panorama"]?.["sourceSignature"] ? String(_0x19e466["panorama"]["sourceSignature"])["trim"]() : null,
      'isLoaded': _0x19e466?.["panorama"]?.["isLoaded"] === !![],
      'error': _0x19e466?.["panorama"]?.["error"] ? String(_0x19e466["panorama"]["error"]) : null
    },
    'mannequins': _0x211092,
    'cubes': _0x55bcec,
    'cameras': _0x3d7fa2,
    'customPoses': _0x375ec8,
    'cameraTimeline': _0x59698f,
    'selection': {
      'selectedObjectType': _0x4ca7e8,
      'selectedObjectId': _0x4d9f50,
      'selectedObjectIds': _0x49281f,
      'selectedObjects': _0x411c61,
      'selectedGroupId': _0x4c98a5
    },
    'groups': _0x52bf42,
    'gridPlacement': {
      'rows': Math["max"](0x1, Math["min"](0xc, Math["round"](toFiniteNumber(_0x19e466?.["gridPlacement"]?.["rows"], _0x157de2["gridPlacement"]["rows"])))),
      'cols': Math["max"](0x1, Math['min'](0xc, Math["round"](toFiniteNumber(_0x19e466?.["gridPlacement"]?.['cols'], _0x157de2["gridPlacement"]["cols"])))),
      'spacingX': Math["max"](0.5, Math["min"](0x8, toFiniteNumber(_0x19e466?.["gridPlacement"]?.['spacingX'], _0x157de2["gridPlacement"]["spacingX"]))),
      'spacingZ': Math["max"](0.5, Math["min"](0x8, toFiniteNumber(_0x19e466?.["gridPlacement"]?.["spacingZ"], _0x157de2["gridPlacement"]["spacingZ"]))),
      'gender': normalizeGender(_0x19e466?.['gridPlacement']?.["gender"]),
      'colorKey': normalizeColorKey(_0x19e466?.["gridPlacement"]?.["colorKey"] || _0x19e466?.["gridPlacement"]?.["color"])
    },
    'capture': {
      'pending': _0x19e466?.["capture"]?.["pending"] === !![],
      'lastCaptureAt': _0x19e466?.["capture"]?.["lastCaptureAt"] == null ? null : toFiniteNumber(_0x19e466["capture"]["lastCaptureAt"], null),
      'error': _0x19e466?.['capture']?.["error"] ? String(_0x19e466["capture"]["error"]) : null,
      'mode': normalizeCaptureMode(_0x19e466?.["capture"]?.["mode"]),
      'showSafeFrame': _0x19e466?.["capture"]?.['showSafeFrame'] === !![]
    },
    'ui': {
      'mouseTool': _0x137d1a,
      'transformTool': _0x5a0a9e,
      'activeTool': _0x1a2f0b,
      'transformSpace': normalizeTransformSpace(_0x19e466?.['ui']?.["transformSpace"]),
      'pivotMode': normalizePivotMode(_0x19e466?.['ui']?.['pivotMode']),
      'navigationPreset': normalizeNavigationPreset(_0x19e466?.['ui']?.["navigationPreset"]),
      'navigationMode': normalizeNavigationMode(_0x19e466?.['ui']?.["navigationMode"]),
      'flySpeed': Math['max'](0.25, Math["min"](0x28, toFiniteNumber(_0x19e466?.['ui']?.["flySpeed"], _0x157de2['ui']["flySpeed"]))),
      'snapEnabled': _0x19e466?.['ui']?.["snapEnabled"] === !![],
      'translationSnap': Math["max"](0.01, Math["min"](0xa, toFiniteNumber(_0x19e466?.['ui']?.["translationSnap"], _0x157de2['ui']["translationSnap"]))),
      'rotationSnap': Math['max'](0.001, Math["min"](Math['PI'], toFiniteNumber(_0x19e466?.['ui']?.['rotationSnap'], _0x157de2['ui']["rotationSnap"]))),
      'scaleSnap': Math["max"](0.01, Math["min"](0xa, toFiniteNumber(_0x19e466?.['ui']?.["scaleSnap"], _0x157de2['ui']['scaleSnap']))),
      'groundLock': _0x19e466?.['ui']?.["groundLock"] !== ![],
      'uniformScale': _0x19e466?.['ui']?.['uniformScale'] !== ![],
      'showCameraList': _0x19e466?.['ui']?.["showCameraList"] === !![],
      'showTimeline': _0x19e466?.['ui']?.["showTimeline"] === !![],
      'showOutline': _0x19e466?.['ui']?.["showOutline"] !== ![],
      'isEditing': _0x19e466?.['ui']?.["isEditing"] === !![]
    }
  };
}
export function normalizeSceneOnlyPanoramaSceneState(_0x4f2bba) {
  const _0x5932f4 = normalizePanoramaSceneState(_0x4f2bba);
  const _0x4e4c4f = String(_0x5932f4?.["viewport"]?.["activeCameraId"] || '')["trim"]() || null;
  const _0x4ef474 = _0x4e4c4f ? Array["isArray"](_0x5932f4["cameras"]) && _0x5932f4['cameras']["some"](_0x362b86 => _0x362b86['id'] === _0x4e4c4f) : ![];
  return {
    ..._0x5932f4,
    'mode': 'scene',
    'viewport': {
      ..._0x5932f4["viewport"],
      'activeView': _0x5932f4["viewport"]?.["activeView"] === "camera" && _0x4ef474 ? "camera" : "default",
      'activeCameraId': _0x4ef474 ? _0x4e4c4f : null
    }
  };
}
export function normalizePanorama360State(_0x36bd06) {
  const _0x443eb2 = normalizePanoramaSceneState(_0x36bd06);
  const _0x4a3cee = new Set((Array["isArray"](_0x443eb2["mannequins"]) ? _0x443eb2["mannequins"] : [])["map"](_0x139e18 => String(_0x139e18?.['id'] || '')["trim"]())['filter'](Boolean));
  const _0xb3b09b = Array["isArray"](_0x443eb2["groups"]) ? _0x443eb2["groups"] : [];
  let _0x16364f = (Array["isArray"](_0x443eb2["selection"]?.["selectedObjects"]) ? _0x443eb2["selection"]["selectedObjects"] : [])["map"](_0x25fc2c => ({
    'objectType': String(_0x25fc2c?.["objectType"] || '')["trim"](),
    'objectId': String(_0x25fc2c?.["objectId"] || '')['trim']()
  }))["filter"](_0x38675a => _0x38675a['objectType'] === 'mannequin' && _0x4a3cee["has"](_0x38675a["objectId"]));
  const _0x3f78ea = String(_0x443eb2["selection"]?.["selectedGroupId"] || '')["trim"]();
  const _0x5e84f9 = _0x3f78ea && _0xb3b09b['length'] > 0x0 ? _0xb3b09b["find"](_0x527b16 => String(_0x527b16?.['id'] || '')['trim']() === _0x3f78ea) || null : null;
  let _0x193a21 = null;
  _0x5e84f9 && (_0x193a21 = _0x5e84f9['id'], _0x16364f = _0x5e84f9['memberIds']["map"](_0x30a2f7 => String(_0x30a2f7 || '')["trim"]())['filter'](_0xb7327e => _0x4a3cee["has"](_0xb7327e))['map'](_0x5911ad => ({
    'objectType': "mannequin",
    'objectId': _0x5911ad
  })));
  if (_0x16364f['length'] === 0x0) {
    const _0x155a5a = String(_0x443eb2["selection"]?.["selectedObjectId"] || '')["trim"]();
    String(_0x443eb2['selection']?.["selectedObjectType"] || '')["trim"]() === "mannequin" && _0x155a5a && _0x4a3cee["has"](_0x155a5a) && (_0x16364f = [{
      'objectType': 'mannequin',
      'objectId': _0x155a5a
    }]);
  }
  const _0x4ee86d = new Set();
  _0x16364f = _0x16364f["filter"](_0x5edf57 => {
    const _0x2df443 = _0x5edf57["objectType"] + ':' + _0x5edf57["objectId"];
    if (_0x4ee86d["has"](_0x2df443)) {
      return ![];
    }
    _0x4ee86d["add"](_0x2df443);
    return !![];
  });
  const _0x2f0f5e = _0x16364f["map"](_0x3d2f1a => _0x3d2f1a["objectId"]);
  const _0x5be160 = String(_0x443eb2["selection"]?.["selectedObjectId"] || '')["trim"]();
  const _0x53126b = _0x5be160 && _0x2f0f5e["includes"](_0x5be160) ? _0x5be160 : _0x2f0f5e[0x0] || null;
  return {
    ..._0x443eb2,
    'mode': "panorama",
    'cubes': [],
    'cameras': [],
    'viewport': {
      ..._0x443eb2["viewport"],
      'activeView': "default",
      'activeCameraId': null
    },
    'selection': {
      'selectedObjectType': _0x53126b ? 'mannequin' : null,
      'selectedObjectId': _0x53126b,
      'selectedObjectIds': _0x2f0f5e,
      'selectedObjects': _0x16364f,
      'selectedGroupId': _0x193a21 && _0x16364f["length"] > 0x0 ? _0x193a21 : null
    },
    'ui': {
      ..._0x443eb2['ui'],
      'showCameraList': ![]
    }
  };
}
export function createPanoramaSceneNodeData({
  id: _0x3d1b8b,
  x = 0x0,
  y = 0x0,
  width = PANORAMA_SCENE_DEFAULT_SIZE['width'],
  height = PANORAMA_SCENE_DEFAULT_SIZE['height'],
  name = getPanoramaSceneDefaultName()
} = {}) {
  return {
    'id': _0x3d1b8b,
    'type': PANORAMA_SCENE_NODE_TYPE,
    'x': x,
    'y': y,
    'width': width,
    'height': height,
    'name': name,
    'sceneNode': createDefaultPanoramaSceneState()
  };
}
export function createPanorama360NodeData({
  id: _0x435d67,
  x = 0x0,
  y = 0x0,
  width = PANORAMA_SCENE_DEFAULT_SIZE["width"],
  height = PANORAMA_SCENE_DEFAULT_SIZE["height"],
  name = getPanorama360DefaultName()
} = {}) {
  return {
    'id': _0x435d67,
    'type': PANORAMA_360_NODE_TYPE,
    'x': x,
    'y': y,
    'width': width,
    'height': height,
    'name': name,
    'panorama360Node': createDefaultPanorama360State()
  };
}
export { PANORAMA_SCENE_NODE_TYPE, PANORAMA_SCENE_NODE_ALIASES, PANORAMA_360_NODE_TYPE, PANORAMA_360_NODE_ALIASES, PANORAMA_SCENE_CAMERA_LIMIT, PANORAMA_SCENE_DEFAULT_SIZE, PANORAMA_SCENE_COLLAPSED_MAX_SIZE, PANORAMA_SCENE_DEFAULT_NAME, PANORAMA_360_DEFAULT_NAME, getPanoramaSceneDefaultName, getPanorama360DefaultName, PANORAMA_SCENE_COLOR_TOKENS };