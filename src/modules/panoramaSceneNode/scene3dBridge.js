import * as a1172_0x3227df from './threeRuntime.js';
import { createCharacterClayMaterial } from './articulatedCharacterModel.js';
import { PANORAMA_SCENE_CAMERA_CONSTRAINTS, SCENE_DEFAULT_FOCAL_LENGTH_MM, SCENE_FOCAL_LENGTH_MAX_MM, SCENE_FOCAL_LENGTH_MIN_MM, computeAxisScaleFactor, computeAxisScaleFactorFromScreenDelta, focalLengthToFov, fovToFocalLength, computeConstrainedMoveDelta, computeSignedRotationDelta, computeStableGridSnap, dampAngle, dampScalar, forwardVectorFromYawPitch, computeUniformScaleFactor, cameraPoseToSceneViewFromReference, normalizeAngle, resolvePanoramaViewPose, resolveSceneCameraPose } from '../../core/panoramaSceneMath.js';
import { PANORAMA_SCENE_COLOR_TOKENS } from './sceneNode.js';
import { applyPanoramaCharacterBonePose, capturePanoramaCharacterBoneBase, createPanoramaCharacterModelInstance, resolvePanoramaCharacterGender } from './characterModelRegistry.js';
import { applyCharacterBodyProfile, captureCharacterModelBodyProfileBase } from './characterBodyProfile.js';
import { resolveSceneAsset } from './sceneAssetCatalog.js';
import { estimateSceneContentBounds, estimateSceneContentExtent, readSceneObjectFrame, readSceneSelectionFrame, resolvePointerDollyAnchor } from './scene3dCameraNavigation.js';
import { applySceneAssetColors, createSceneAssetVisual } from './scene3dProceduralAssetVisual.js';
import { loadPanoramaTextureSource } from './scene3dPanoramaTexture.js';
import { abortPanoramaTextureLoad, cancelPanoramaFullLoad, loadPanoramaBridgeTexture, schedulePanoramaFullLoad } from './scene3dPanoramaBridgeTexture.js';
import { applySelectionEmphasis, clamp01, createSelectionRing, normalizePanoramaTextureUrl, resolveThemeColor, resolveThemeColorValue } from './scene3dTheme.js';
import { resolveAxisScreenDragMetric } from './scene3dScreenProjection.js';
import { GIZMO_BASE_AXIS_LENGTH, GIZMO_BASE_PLANE_OFFSET, GIZMO_BASE_PLANE_SIZE, GIZMO_BASE_ROTATE_RADIUS, GIZMO_BASE_SCALE_LENGTH, GIZMO_MOVE_HEAD_LENGTH, GIZMO_MOVE_PICK_LENGTH, GIZMO_MOVE_SHAFT_LENGTH, GIZMO_SCALE_HEAD_SIZE, GIZMO_SCALE_PICK_LENGTH, GIZMO_SCALE_SHAFT_LENGTH, createScene3DGizmoVisual } from './scene3dGizmoVisual.js';
import * as a1172_0x23fa98 from './scene3dViewProjection.js';
import { t } from '../../i18n/index.js';
function panoramaSceneText(_0x55de5d, _0x5791b0 = {}) {
  return t("panoramaSceneNode." + _0x55de5d, _0x5791b0);
}
const GRID_MINOR_STEP = 0x1;
const GRID_MAJOR_STEP = 0xa;
const GRID_BASE_SPAN = 0xdc;
const GRID_SNAP_HYSTERESIS = 0.12;
const VIEW_DAMPING_TIME_CONSTANT_MS = 0x78;
const VIEW_DAMPING_WINDOW_MS = 0xdc;
const VIEW_DAMPING_MAX_DT_MS = 0x40;
const POSE_SETTLE_EPSILON = 0.0005;
const GIZMO_MARGIN_WORLD_MIN = 0.12;
const GIZMO_MARGIN_WORLD_RATIO = 0.12;
const DEFAULT_BG_FALLBACK = {
  'day': "--white-90",
  'night': "--bg"
};
function createLineGeometry(_0x449351, _0x1fde28) {
  return new a1172_0x3227df["BufferGeometry"]()['setFromPoints']([_0x449351, _0x1fde28]);
}
function setLineGeometryPoints(_0x2856b4, _0x202837, _0x365e5b) {
  if (!_0x2856b4?.['geometry']) {
    return;
  }
  const _0x2d1aa7 = _0x202837?.["isVector3"] ? _0x202837 : toVector3Like(_0x202837);
  const _0x5acee3 = _0x365e5b?.["isVector3"] ? _0x365e5b : toVector3Like(_0x365e5b);
  const _0x57871b = _0x2856b4["geometry"]["getAttribute"]("position");
  if (!_0x57871b || _0x57871b["count"] < 0x2) {
    _0x2856b4["geometry"]["dispose"]?.();
    _0x2856b4["geometry"] = createLineGeometry(_0x2d1aa7, _0x5acee3);
    return;
  }
  _0x57871b["setXYZ"](0x0, _0x2d1aa7['x'], _0x2d1aa7['y'], _0x2d1aa7['z']);
  _0x57871b["setXYZ"](0x1, _0x5acee3['x'], _0x5acee3['y'], _0x5acee3['z']);
  _0x57871b["needsUpdate"] = !![];
  _0x2856b4["geometry"]["computeBoundingSphere"]?.();
  _0x2856b4["geometry"]["computeBoundingBox"]?.();
}
function configureGizmoMaterial(_0x130fa7, {
  transparent = ![],
  opacity = 0x1
} = {}) {
  if (!_0x130fa7) {
    return _0x130fa7;
  }
  _0x130fa7["transparent"] = transparent;
  if ('opacity' in _0x130fa7) {
    _0x130fa7["opacity"] = opacity;
  }
  _0x130fa7["depthWrite"] = ![];
  _0x130fa7["depthTest"] = ![];
  _0x130fa7['toneMapped'] = ![];
  _0x130fa7["fog"] = ![];
  return _0x130fa7;
}
function configureGizmoObject(_0x1bc156) {
  if (!_0x1bc156) {
    return _0x1bc156;
  }
  _0x1bc156["frustumCulled"] = ![];
  _0x1bc156["renderOrder"] = 0x64;
  return _0x1bc156;
}
function orientAxisHead(_0xf2f5ef, _0x378b0a) {
  if (!_0xf2f5ef) {
    return;
  }
  _0xf2f5ef["rotation"]['set'](0x0, 0x0, 0x0);
  if (_0x378b0a === 'x') {
    _0xf2f5ef["rotation"]['z'] = -Math['PI'] / 0x2;
  }
  if (_0x378b0a === 'z') {
    _0xf2f5ef["rotation"]['x'] = Math['PI'] / 0x2;
  }
}
function setAxisLineEnd(_0x34fe76, _0x4b0dae, _0x9d1839) {
  if (!_0x34fe76?.["geometry"]) {
    return;
  }
  const _0x5a520d = vectorFromAxisName(_0x4b0dae);
  const _0x215cde = Math["max"](0x0, Number(_0x9d1839) || 0x0);
  const _0x372a14 = _0x34fe76["geometry"]["getAttribute"]("position");
  if (!_0x372a14 || _0x372a14['count'] < 0x2) {
    return;
  }
  _0x372a14["setXYZ"](0x0, 0x0, 0x0, 0x0);
  _0x372a14['setXYZ'](0x1, _0x5a520d['x'] * _0x215cde, _0x5a520d['y'] * _0x215cde, _0x5a520d['z'] * _0x215cde);
  _0x372a14["needsUpdate"] = !![];
  _0x34fe76["geometry"]['computeBoundingSphere']?.();
  _0x34fe76["geometry"]["computeBoundingBox"]?.();
}
function setAxisHandleLayout(_0x408b9e, _0x13a93f, _0x29225f = 0x0) {
  if (!_0x408b9e) {
    return;
  }
  const _0x35d09b = _0x408b9e["userData"]?.["axisName"] || _0x408b9e['axisName'];
  if (!_0x35d09b) {
    return;
  }
  const _0x5ac7ba = vectorFromAxisName(_0x35d09b);
  const _0x27afd1 = Math["max"](0x0, Number(_0x13a93f) || 0x0);
  const _0x3dfb60 = Number(_0x29225f) || 0x0;
  _0x408b9e['position']["copy"](_0x5ac7ba["multiplyScalar"](_0x27afd1 + _0x3dfb60));
}
function createMoveAxis(_0x11617d, _0xf6dc56) {
  const _0x1044e4 = _0x11617d['isColor'] ? _0x11617d["clone"]() : new a1172_0x3227df["Color"](_0x11617d);
  const _0x2dc479 = vectorFromAxisName(_0xf6dc56);
  const _0x36142b = new a1172_0x3227df["Group"]();
  configureGizmoObject(_0x36142b);
  const _0x52f903 = configureGizmoMaterial(new a1172_0x3227df["LineBasicMaterial"]({
    'color': _0x1044e4["clone"](),
    'transparent': !![],
    'opacity': 0.96
  }), {
    'transparent': !![],
    'opacity': 0.96
  });
  const _0x4665a3 = new a1172_0x3227df["Line"](createLineGeometry(new a1172_0x3227df["Vector3"](0x0, 0x0, 0x0), _0x2dc479["clone"]()['multiplyScalar'](GIZMO_MOVE_SHAFT_LENGTH)), _0x52f903);
  configureGizmoObject(_0x4665a3);
  _0x36142b["add"](_0x4665a3);
  const _0x229482 = configureGizmoMaterial(new a1172_0x3227df["MeshBasicMaterial"]({
    'color': _0x1044e4["clone"](),
    'transparent': !![],
    'opacity': 0.98
  }), {
    'transparent': !![],
    'opacity': 0.98
  });
  const _0x404c41 = new a1172_0x3227df["Mesh"](new a1172_0x3227df['ConeGeometry'](0.06, GIZMO_MOVE_HEAD_LENGTH, 0xe), _0x229482);
  _0x404c41["userData"]["axisName"] = _0xf6dc56;
  setAxisHandleLayout(_0x404c41, GIZMO_BASE_AXIS_LENGTH - GIZMO_MOVE_HEAD_LENGTH * 0.5, GIZMO_MOVE_HEAD_LENGTH * 0.5);
  orientAxisHead(_0x404c41, _0xf6dc56);
  configureGizmoObject(_0x404c41);
  _0x36142b["add"](_0x404c41);
  const _0x32e73f = new a1172_0x3227df["Mesh"](new a1172_0x3227df['CylinderGeometry'](0.14, 0.14, GIZMO_MOVE_PICK_LENGTH, 0xa), configureGizmoMaterial(new a1172_0x3227df['MeshBasicMaterial']({
    'color': 0xffffff,
    'transparent': !![],
    'opacity': 0x0,
    'depthWrite': ![]
  }), {
    'transparent': !![],
    'opacity': 0x0
  }));
  _0x32e73f["userData"]["axisName"] = _0xf6dc56;
  setAxisHandleLayout(_0x32e73f, GIZMO_MOVE_PICK_LENGTH * 0.5);
  orientAxisHead(_0x32e73f, _0xf6dc56);
  configureGizmoObject(_0x32e73f);
  _0x36142b["add"](_0x32e73f);
  return {
    'axisName': _0xf6dc56,
    'axis': _0x2dc479["clone"](),
    'group': _0x36142b,
    'shaftLine': _0x4665a3,
    'headMesh': _0x404c41,
    'visuals': [{
      'material': _0x52f903,
      'color': _0x1044e4['clone'](),
      'opacity': 0x1
    }, {
      'material': _0x229482,
      'color': _0x1044e4["clone"](),
      'opacity': 0x1
    }],
    'pickMesh': _0x32e73f
  };
}
function createScaleAxis(_0x29e754, _0x3d929c) {
  const _0x4695fc = _0x29e754["isColor"] ? _0x29e754["clone"]() : new a1172_0x3227df["Color"](_0x29e754);
  const _0x54ff2c = vectorFromAxisName(_0x3d929c);
  const _0x5434a1 = new a1172_0x3227df["Group"]();
  configureGizmoObject(_0x5434a1);
  const _0x5419cf = configureGizmoMaterial(new a1172_0x3227df["LineBasicMaterial"]({
    'color': _0x4695fc["clone"](),
    'transparent': !![],
    'opacity': 0.96
  }), {
    'transparent': !![],
    'opacity': 0.96
  });
  const _0x44c6a1 = new a1172_0x3227df["Line"](createLineGeometry(new a1172_0x3227df["Vector3"](0x0, 0x0, 0x0), _0x54ff2c['clone']()["multiplyScalar"](GIZMO_SCALE_SHAFT_LENGTH)), _0x5419cf);
  configureGizmoObject(_0x44c6a1);
  _0x5434a1['add'](_0x44c6a1);
  const _0x3ad700 = configureGizmoMaterial(new a1172_0x3227df["MeshBasicMaterial"]({
    'color': _0x4695fc["clone"](),
    'transparent': !![],
    'opacity': 0.98
  }), {
    'transparent': !![],
    'opacity': 0.98
  });
  const _0xbb1a56 = new a1172_0x3227df["Mesh"](new a1172_0x3227df["BoxGeometry"](GIZMO_SCALE_HEAD_SIZE, GIZMO_SCALE_HEAD_SIZE, GIZMO_SCALE_HEAD_SIZE), _0x3ad700);
  _0xbb1a56['userData']["axisName"] = _0x3d929c;
  setAxisHandleLayout(_0xbb1a56, GIZMO_BASE_SCALE_LENGTH - GIZMO_SCALE_HEAD_SIZE * 0.5, GIZMO_SCALE_HEAD_SIZE * 0.5);
  orientAxisHead(_0xbb1a56, _0x3d929c);
  configureGizmoObject(_0xbb1a56);
  _0x5434a1['add'](_0xbb1a56);
  const _0x5b3f9e = new a1172_0x3227df["Mesh"](new a1172_0x3227df["CylinderGeometry"](0.14, 0.14, GIZMO_SCALE_PICK_LENGTH, 0xa), configureGizmoMaterial(new a1172_0x3227df["MeshBasicMaterial"]({
    'color': 0xffffff,
    'transparent': !![],
    'opacity': 0x0,
    'depthWrite': ![]
  }), {
    'transparent': !![],
    'opacity': 0x0
  }));
  _0x5b3f9e["userData"]["axisName"] = _0x3d929c;
  setAxisHandleLayout(_0x5b3f9e, GIZMO_SCALE_PICK_LENGTH * 0.5);
  orientAxisHead(_0x5b3f9e, _0x3d929c);
  configureGizmoObject(_0x5b3f9e);
  _0x5434a1["add"](_0x5b3f9e);
  return {
    'axisName': _0x3d929c,
    'axis': _0x54ff2c['clone'](),
    'group': _0x5434a1,
    'shaftLine': _0x44c6a1,
    'headMesh': _0xbb1a56,
    'visuals': [{
      'material': _0x5419cf,
      'color': _0x4695fc["clone"](),
      'opacity': 0x1
    }, {
      'material': _0x3ad700,
      'color': _0x4695fc["clone"](),
      'opacity': 0x1
    }],
    'pickMesh': _0x5b3f9e
  };
}
function createRotateRing(_0x3ebd25, _0x526dc0) {
  const _0x1b6a3d = _0x3ebd25["isColor"] ? _0x3ebd25["clone"]() : new a1172_0x3227df["Color"](_0x3ebd25);
  const _0x1e0857 = new a1172_0x3227df["Group"]();
  configureGizmoObject(_0x1e0857);
  const _0x22d09f = configureGizmoMaterial(new a1172_0x3227df['MeshBasicMaterial']({
    'color': _0x1b6a3d["clone"](),
    'transparent': !![],
    'opacity': 0.86,
    'depthWrite': ![]
  }), {
    'transparent': !![],
    'opacity': 0.86
  });
  const _0x2c75e3 = new a1172_0x3227df["Mesh"](new a1172_0x3227df["TorusGeometry"](GIZMO_BASE_ROTATE_RADIUS, 0.016, 0x8, 0x40), _0x22d09f);
  if (_0x526dc0 === 'x') {
    _0x2c75e3["rotation"]['y'] = Math['PI'] / 0x2;
  } else {
    _0x526dc0 === 'y' && (_0x2c75e3["rotation"]['x'] = Math['PI'] / 0x2);
  }
  configureGizmoObject(_0x2c75e3);
  _0x1e0857["add"](_0x2c75e3);
  const _0x66fd98 = new a1172_0x3227df['Mesh'](new a1172_0x3227df['TorusGeometry'](GIZMO_BASE_ROTATE_RADIUS, 0.11, 0x8, 0x40), configureGizmoMaterial(new a1172_0x3227df['MeshBasicMaterial']({
    'color': 0xffffff,
    'transparent': !![],
    'opacity': 0x0,
    'depthWrite': ![]
  }), {
    'transparent': !![],
    'opacity': 0x0
  }));
  _0x66fd98["rotation"]['copy'](_0x2c75e3["rotation"]);
  configureGizmoObject(_0x66fd98);
  _0x1e0857["add"](_0x66fd98);
  return {
    'axisName': _0x526dc0,
    'group': _0x1e0857,
    'visuals': [{
      'material': _0x22d09f,
      'color': _0x1b6a3d["clone"](),
      'opacity': 0.9
    }],
    'pickMesh': _0x66fd98
  };
}
function getPlaneCornerMetrics(_0x35d73e = GIZMO_BASE_PLANE_SIZE, _0x3f6f7b = 0x0) {
  const _0x41355c = _0x35d73e * 0.56;
  const _0x118674 = Math["max"](_0x35d73e * 0.065, 0.012);
  const _0x30a3ee = _0x35d73e * 0.06;
  const _0x5a6126 = _0x35d73e * 0.5 - _0x30a3ee;
  const _0x485d20 = _0x5a6126 - _0x41355c;
  const _0x3db02e = (_0x5a6126 + _0x485d20) * 0.5;
  const _0x2c238f = _0x118674 * 0.5 + _0x3f6f7b;
  const _0x5d2dda = _0x41355c * 0.46 - _0x3f6f7b * 0.35;
  return {
    'armLength': _0x41355c,
    'armThickness': _0x118674,
    'cornerInset': _0x30a3ee,
    'outer': _0x5a6126,
    'inner': _0x485d20,
    'armCenter': _0x3db02e,
    'halfThickness': _0x2c238f,
    'diagonalStart': Math['max'](_0x485d20, _0x485d20 + _0x5d2dda),
    'diagonalEnd': Math['max'](_0x485d20, _0x485d20 + _0x5d2dda)
  };
}
function createPlaneCornerPickGeometry(_0x6ff9f0 = GIZMO_BASE_PLANE_SIZE) {
  const _0x2c2dfe = Math["max"](_0x6ff9f0 * 0.018, 0.006);
  const _0x513cbd = getPlaneCornerMetrics(_0x6ff9f0, _0x2c2dfe);
  const _0xfe7c14 = new a1172_0x3227df['Shape']();
  _0xfe7c14["moveTo"](_0x513cbd['inner'] - _0x2c2dfe, _0x513cbd["outer"] + _0x513cbd["halfThickness"]);
  _0xfe7c14['lineTo'](_0x513cbd["outer"] + _0x513cbd["halfThickness"], _0x513cbd["outer"] + _0x513cbd['halfThickness']);
  _0xfe7c14["lineTo"](_0x513cbd["outer"] + _0x513cbd["halfThickness"], _0x513cbd["inner"] - _0x2c2dfe);
  _0xfe7c14["lineTo"](_0x513cbd["outer"] - _0x513cbd["halfThickness"], _0x513cbd["inner"] - _0x2c2dfe);
  _0xfe7c14["lineTo"](_0x513cbd["outer"] - _0x513cbd['halfThickness'], _0x513cbd["diagonalEnd"] - _0x2c2dfe);
  _0xfe7c14["lineTo"](_0x513cbd["diagonalStart"] - _0x2c2dfe, _0x513cbd["outer"] - _0x513cbd["halfThickness"]);
  _0xfe7c14["lineTo"](_0x513cbd["inner"] - _0x2c2dfe, _0x513cbd["outer"] - _0x513cbd["halfThickness"]);
  _0xfe7c14['closePath']();
  return new a1172_0x3227df['ShapeGeometry'](_0xfe7c14);
}
function createPlaneCornerVisual({
  horizontalColor: _0x366ac9,
  verticalColor: _0x33dcec
} = {}, _0x5756e7 = GIZMO_BASE_PLANE_SIZE) {
  const _0x1a9053 = _0x366ac9?.["isColor"] ? _0x366ac9["clone"]() : _0x366ac9 ? new a1172_0x3227df["Color"](_0x366ac9) : resolveThemeColor("--white", "--white");
  const _0x2acd90 = _0x33dcec?.["isColor"] ? _0x33dcec["clone"]() : _0x33dcec ? new a1172_0x3227df["Color"](_0x33dcec) : resolveThemeColor('--white', "--white");
  const _0x4c9313 = new a1172_0x3227df["Group"]();
  configureGizmoObject(_0x4c9313);
  const _0x5ca8ee = getPlaneCornerMetrics(_0x5756e7);
  const _0x3eccd6 = [];
  const _0x47cfb5 = _0x1a9053["clone"]()["lerp"](_0x2acd90, 0.5);
  const _0x1e2928 = (_0x5987bc, _0x50d09d, _0x1545ae, _0x222e2a, _0x44b104) => {
    const _0x4ede36 = configureGizmoMaterial(new a1172_0x3227df["MeshBasicMaterial"]({
      'color': _0x44b104['clone'](),
      'transparent': !![],
      'opacity': 0.98,
      'side': a1172_0x3227df['DoubleSide'],
      'depthWrite': ![]
    }), {
      'transparent': !![],
      'opacity': 0.98
    });
    const _0x1a3229 = new a1172_0x3227df["Mesh"](new a1172_0x3227df["PlaneGeometry"](_0x5987bc, _0x50d09d), _0x4ede36);
    _0x1a3229["position"]["set"](_0x1545ae, _0x222e2a, 0x0);
    configureGizmoObject(_0x1a3229);
    _0x4c9313['add'](_0x1a3229);
    _0x3eccd6["push"]({
      'material': _0x4ede36,
      'color': _0x44b104["clone"](),
      'opacity': 0.98
    });
  };
  _0x1e2928(_0x5ca8ee["armLength"], _0x5ca8ee["armThickness"], _0x5ca8ee['armCenter'], _0x5ca8ee["outer"], _0x1a9053);
  _0x1e2928(_0x5ca8ee["armThickness"], _0x5ca8ee['armLength'], _0x5ca8ee["outer"], _0x5ca8ee["armCenter"], _0x2acd90);
  {
    const _0x5b39e5 = configureGizmoMaterial(new a1172_0x3227df["MeshBasicMaterial"]({
      'color': _0x47cfb5['clone'](),
      'transparent': !![],
      'opacity': 0.98,
      'side': a1172_0x3227df["DoubleSide"],
      'depthWrite': ![]
    }), {
      'transparent': !![],
      'opacity': 0.98
    });
    const _0x3753d9 = new a1172_0x3227df['Mesh'](new a1172_0x3227df["PlaneGeometry"](_0x5ca8ee["armThickness"], _0x5ca8ee["armThickness"]), _0x5b39e5);
    _0x3753d9['position']["set"](_0x5ca8ee['outer'], _0x5ca8ee["outer"], 0x0);
    configureGizmoObject(_0x3753d9);
    _0x4c9313["add"](_0x3753d9);
    _0x3eccd6["push"]({
      'material': _0x5b39e5,
      'color': _0x47cfb5["clone"](),
      'opacity': 0.98
    });
  }
  {
    const _0x3197ed = configureGizmoMaterial(new a1172_0x3227df['MeshBasicMaterial']({
      'color': _0x47cfb5,
      'transparent': !![],
      'opacity': 0.38,
      'side': a1172_0x3227df["DoubleSide"],
      'depthWrite': ![]
    }), {
      'transparent': !![],
      'opacity': 0.38
    });
    const _0x39ec80 = new a1172_0x3227df["BufferGeometry"]();
    const _0x4252bf = _0x5ca8ee["armThickness"] * 0.5;
    _0x39ec80["setAttribute"]("position", new a1172_0x3227df['Float32BufferAttribute']([_0x5ca8ee['diagonalStart'], _0x5ca8ee['outer'] - _0x4252bf, 0x0, _0x5ca8ee['outer'] - _0x4252bf, _0x5ca8ee['outer'] - _0x4252bf, 0x0, _0x5ca8ee["outer"] - _0x4252bf, _0x5ca8ee["diagonalEnd"], 0x0], 0x3));
    _0x39ec80['setIndex']([0x0, 0x1, 0x2]);
    _0x39ec80["computeVertexNormals"]();
    const _0x331d33 = new a1172_0x3227df["Mesh"](_0x39ec80, _0x3197ed);
    configureGizmoObject(_0x331d33);
    _0x4c9313["add"](_0x331d33);
    _0x3eccd6["push"]({
      'material': _0x3197ed,
      'color': _0x47cfb5['clone'](),
      'opacity': 0.38
    });
  }
  return {
    'group': _0x4c9313,
    'visuals': _0x3eccd6
  };
}
function eachMaterial(_0x58f200, _0x364755) {
  if (!_0x58f200) {
    return;
  }
  if (Array['isArray'](_0x58f200)) {
    _0x58f200["forEach"](_0x19431e => _0x364755(_0x19431e));
    return;
  }
  _0x364755(_0x58f200);
}
function createMannequinVisual(_0x52787b) {
  const _0x4b4b07 = new a1172_0x3227df["Group"]();
  const _0x469d56 = new a1172_0x3227df["Group"]();
  _0x4b4b07["add"](_0x469d56);
  const _0x40ff6d = [];
  const _0x25654f = new a1172_0x3227df["MeshStandardMaterial"]({
    'color': _0x52787b,
    'roughness': 0.62,
    'metalness': 0.08
  });
  const _0x3ea0e5 = _0x25654f["clone"]();
  _0x3ea0e5["color"] = _0x25654f["color"]["clone"]()["offsetHSL"](0x0, 0x0, 0.08);
  const _0x6474fb = new a1172_0x3227df["Mesh"](new a1172_0x3227df['SphereGeometry'](0.155, 0x12, 0x10), _0x3ea0e5);
  _0x6474fb["position"]['y'] = 1.7;
  _0x6474fb["scale"]["set"](0.96, 1.08, 0.94);
  _0x469d56["add"](_0x6474fb);
  _0x40ff6d["push"](_0x6474fb);
  const _0x446f62 = new a1172_0x3227df["Mesh"](new a1172_0x3227df["CylinderGeometry"](0.052, 0.064, 0.12, 0xc), _0x25654f);
  _0x446f62["position"]['y'] = 1.51;
  _0x469d56["add"](_0x446f62);
  _0x40ff6d["push"](_0x446f62);
  const _0x34e46d = new a1172_0x3227df["Mesh"](new a1172_0x3227df["CapsuleGeometry"](0.17, 0.42, 0x6, 0xc), _0x25654f);
  _0x34e46d["position"]['y'] = 1.26;
  _0x34e46d["scale"]["set"](1.38, 1.02, 0.92);
  _0x469d56['add'](_0x34e46d);
  _0x40ff6d["push"](_0x34e46d);
  const _0x19c138 = new a1172_0x3227df['Mesh'](new a1172_0x3227df['CapsuleGeometry'](0.105, 0.18, 0x5, 0xa), _0x25654f);
  _0x19c138["position"]['y'] = 0.98;
  _0x19c138["scale"]["set"](1.02, 0.94, 0.86);
  _0x469d56["add"](_0x19c138);
  _0x40ff6d["push"](_0x19c138);
  const _0x42cd36 = new a1172_0x3227df["Mesh"](new a1172_0x3227df['CapsuleGeometry'](0.14, 0.2, 0x5, 0xc), _0x25654f);
  _0x42cd36['position']['y'] = 0.77;
  _0x42cd36["scale"]["set"](1.28, 0.96, 0.98);
  _0x469d56['add'](_0x42cd36);
  _0x40ff6d['push'](_0x42cd36);
  const _0x5c72c4 = new a1172_0x3227df["Mesh"](new a1172_0x3227df["SphereGeometry"](0.07, 0xc, 0xc), _0x25654f);
  _0x5c72c4["position"]["set"](-0.31, 1.43, 0x0);
  _0x469d56['add'](_0x5c72c4);
  _0x40ff6d['push'](_0x5c72c4);
  const _0x430de4 = _0x5c72c4["clone"]();
  _0x430de4['position']['x'] = 0.31;
  _0x469d56["add"](_0x430de4);
  _0x40ff6d["push"](_0x430de4);
  const _0x363fc8 = new a1172_0x3227df['Mesh'](new a1172_0x3227df["CapsuleGeometry"](0.048, 0.28, 0x4, 0xa), _0x25654f);
  _0x363fc8["position"]['set'](-0.39, 1.17, 0x0);
  _0x363fc8["rotation"]['z'] = 0.16;
  _0x363fc8["rotation"]['x'] = 0.03;
  _0x469d56['add'](_0x363fc8);
  _0x40ff6d["push"](_0x363fc8);
  const _0x5634c5 = _0x363fc8['clone']();
  _0x5634c5["position"]['x'] = 0.39;
  _0x5634c5['rotation']['z'] = -0.16;
  _0x5634c5["rotation"]['x'] = -0.03;
  _0x469d56["add"](_0x5634c5);
  _0x40ff6d["push"](_0x5634c5);
  const _0x1079c2 = new a1172_0x3227df["Mesh"](new a1172_0x3227df["CapsuleGeometry"](0.038, 0.26, 0x4, 0xa), _0x25654f);
  _0x1079c2["position"]["set"](-0.42, 0.86, 0.01);
  _0x1079c2["rotation"]['z'] = 0.03;
  _0x1079c2["rotation"]['x'] = 0.04;
  _0x469d56["add"](_0x1079c2);
  _0x40ff6d["push"](_0x1079c2);
  const _0x41f0ad = _0x1079c2["clone"]();
  _0x41f0ad['position']['x'] = 0.42;
  _0x41f0ad["rotation"]['z'] = -0.03;
  _0x41f0ad["rotation"]['x'] = -0.04;
  _0x469d56["add"](_0x41f0ad);
  _0x40ff6d["push"](_0x41f0ad);
  const _0x23fd2c = new a1172_0x3227df["Mesh"](new a1172_0x3227df["SphereGeometry"](0.048, 0xa, 0xa), _0x25654f);
  _0x23fd2c['position']["set"](-0.425, 0.62, 0.01);
  _0x23fd2c["scale"]['set'](0.9, 0x1, 0.72);
  _0x469d56["add"](_0x23fd2c);
  _0x40ff6d["push"](_0x23fd2c);
  const _0x200f89 = _0x23fd2c["clone"]();
  _0x200f89['position']['x'] = 0.425;
  _0x469d56["add"](_0x200f89);
  _0x40ff6d["push"](_0x200f89);
  const _0x2a1baa = new a1172_0x3227df["Mesh"](new a1172_0x3227df["CapsuleGeometry"](0.072, 0.34, 0x5, 0xc), _0x25654f);
  _0x2a1baa["position"]["set"](-0.12, 0.47, 0x0);
  _0x2a1baa["rotation"]['z'] = 0.03;
  _0x469d56["add"](_0x2a1baa);
  _0x40ff6d["push"](_0x2a1baa);
  const _0x1880fa = _0x2a1baa["clone"]();
  _0x1880fa["position"]['x'] = 0.12;
  _0x1880fa["rotation"]['z'] = -0.03;
  _0x469d56['add'](_0x1880fa);
  _0x40ff6d['push'](_0x1880fa);
  const _0x4baaeb = new a1172_0x3227df["Mesh"](new a1172_0x3227df["CapsuleGeometry"](0.055, 0.34, 0x5, 0xc), _0x25654f);
  _0x4baaeb["position"]['set'](-0.12, 0.03, 0.01);
  _0x469d56["add"](_0x4baaeb);
  _0x40ff6d["push"](_0x4baaeb);
  const _0x44d9b4 = _0x4baaeb["clone"]();
  _0x44d9b4["position"]['x'] = 0.12;
  _0x469d56['add'](_0x44d9b4);
  _0x40ff6d["push"](_0x44d9b4);
  const _0x34a350 = new a1172_0x3227df['Mesh'](new a1172_0x3227df["BoxGeometry"](0.115, 0.075, 0.27), _0x25654f);
  _0x34a350["position"]["set"](-0.12, -0.19, 0.07);
  _0x34a350["rotation"]['x'] = -0.08;
  _0x469d56["add"](_0x34a350);
  _0x40ff6d["push"](_0x34a350);
  const _0x905c40 = _0x34a350["clone"]();
  _0x905c40['position']['x'] = 0.12;
  _0x469d56["add"](_0x905c40);
  _0x40ff6d["push"](_0x905c40);
  const _0x2777df = createSelectionRing(0x7db4ff);
  _0x4b4b07["add"](_0x2777df);
  return {
    'group': _0x4b4b07,
    'material': _0x25654f,
    'headMaterial': _0x3ea0e5,
    'selectionRing': _0x2777df,
    'proxyRoot': _0x469d56,
    'fallbackObjects': _0x40ff6d,
    'modelGender': null,
    'modelLoadToken': 0x0,
    'modelRoot': null,
    'modelBodyProfileBase': null,
    'baseBonePose': null,
    'appliedBonePoseSignature': '',
    'parts': {
      'head': _0x6474fb,
      'neck': _0x446f62,
      'chest': _0x34e46d,
      'waist': _0x19c138,
      'pelvis': _0x42cd36,
      'shoulders': [_0x5c72c4, _0x430de4],
      'upperArms': [_0x363fc8, _0x5634c5],
      'lowerArms': [_0x1079c2, _0x41f0ad],
      'hands': [_0x23fd2c, _0x200f89],
      'upperLegs': [_0x2a1baa, _0x1880fa],
      'lowerLegs': [_0x4baaeb, _0x44d9b4],
      'feet': [_0x34a350, _0x905c40]
    }
  };
}
function setMannequinProxyMode(_0x4a0d99) {
  (_0x4a0d99?.["fallbackObjects"] || [])["forEach"](_0x24891c => {
    _0x24891c['visible'] = !![];
  });
  [_0x4a0d99?.["material"], _0x4a0d99?.["headMaterial"]]['forEach'](_0x33cea0 => {
    if (!_0x33cea0) {
      return;
    }
    _0x33cea0['transparent'] = !![];
    _0x33cea0["opacity"] = 0.001;
    _0x33cea0['depthWrite'] = ![];
    _0x33cea0["colorWrite"] = ![];
  });
}
function applyCharacterClayMaterial(_0x5d1281, _0x4cebf0) {
  if (!_0x5d1281?.["modelRoot"]) {
    return;
  }
  !_0x5d1281["modelMaterial"] && (_0x5d1281["modelMaterial"] = createCharacterClayMaterial(_0x4cebf0), _0x5d1281["modelRoot"]["traverse"](_0x1f4d11 => {
    if (!_0x1f4d11["isMesh"]) {
      return;
    }
    disposeMaterial(_0x1f4d11["material"]);
    _0x1f4d11["material"] = _0x5d1281['modelMaterial'];
  }));
  _0x5d1281["modelMaterial"]["color"]["copy"](_0x4cebf0?.["isColor"] ? _0x4cebf0 : new a1172_0x3227df["Color"](_0x4cebf0 || 0xffffff));
}
function applyObjectSelectionEmphasis(_0x12e59c, _0x1f1001, _0x1edd89 = 0.12) {
  if (!_0x12e59c) {
    return;
  }
  _0x12e59c["traverse"](_0x58840f => {
    eachMaterial(_0x58840f['material'], _0x714fea => {
      applySelectionEmphasis(_0x714fea, _0x1f1001, _0x1edd89);
    });
  });
}
function createCameraVisual() {
  const _0x331cd8 = new a1172_0x3227df["Group"]();
  const _0x4518b2 = new a1172_0x3227df["Group"]();
  _0x331cd8["add"](_0x4518b2);
  const _0x2599fe = new a1172_0x3227df["LineBasicMaterial"]({
    'color': resolveThemeColor("--white", "--white"),
    'transparent': !![],
    'opacity': 0.8
  });
  const _0x1b8c9a = new a1172_0x3227df["LineBasicMaterial"]({
    'color': resolveThemeColor("--blue", "--blue"),
    'transparent': !![],
    'opacity': 0.8
  });
  const _0x2fd107 = (_0x388ca0, _0x19a34f, _0x174a84, _0xe8a51b) => new a1172_0x3227df["LineSegments"](new a1172_0x3227df["EdgesGeometry"](new a1172_0x3227df["BoxGeometry"](_0x388ca0, _0x19a34f, _0x174a84)), _0xe8a51b);
  const _0x52d6af = _0x2fd107(0.26, 0.16, 0.14, _0x2599fe);
  _0x52d6af['position']['set'](0x0, 0x0, 0.075);
  _0x4518b2["add"](_0x52d6af);
  const _0x2fa889 = _0x2fd107(0.1, 0.045, 0.06, _0x2599fe);
  _0x2fa889["position"]['set'](0x0, 0.102, 0.08);
  _0x4518b2["add"](_0x2fa889);
  const _0x446f22 = _0x2fd107(0.06, 0.045, 0.08, _0x2599fe);
  _0x446f22["position"]["set"](-0.105, 0.05, 0.155);
  _0x4518b2["add"](_0x446f22);
  const _0x5a4461 = _0x2fd107(0.12, 0.09, 0.02, _0x2599fe);
  _0x5a4461["position"]["set"](0x0, 0x0, -0.01);
  _0x4518b2["add"](_0x5a4461);
  const _0x41fed2 = new a1172_0x3227df["Mesh"](new a1172_0x3227df["BoxGeometry"](0.42, 0.3, 0.72), new a1172_0x3227df['MeshBasicMaterial']({
    'transparent': !![],
    'opacity': 0x0,
    'depthWrite': ![],
    'colorWrite': ![]
  }));
  _0x41fed2["position"]['set'](0x0, 0x0, -0.16);
  _0x4518b2["add"](_0x41fed2);
  const _0x44ea35 = new a1172_0x3227df["BufferGeometry"]()["setFromPoints"]([new a1172_0x3227df['Vector3'](-0.025, 0x0, 0x0), new a1172_0x3227df['Vector3'](0.025, 0x0, 0x0), new a1172_0x3227df['Vector3'](0x0, -0.025, 0x0), new a1172_0x3227df["Vector3"](0x0, 0.025, 0x0)]);
  _0x4518b2["add"](new a1172_0x3227df["LineSegments"](_0x44ea35, _0x2599fe));
  const _0xcfaadd = new a1172_0x3227df["Vector3"](0x0, 0x0, -0.02);
  const _0x2aadf1 = 0.55;
  const _0x50035c = 0.18;
  const _0x21d96d = 0.1;
  const _0x4e8466 = _0xcfaadd;
  const _0x36e4c7 = new a1172_0x3227df["Vector3"](_0xcfaadd['x'] - _0x50035c, _0xcfaadd['y'] + _0x21d96d, _0xcfaadd['z'] - _0x2aadf1);
  const _0x3fa39c = new a1172_0x3227df["Vector3"](_0xcfaadd['x'] + _0x50035c, _0xcfaadd['y'] + _0x21d96d, _0xcfaadd['z'] - _0x2aadf1);
  const _0xd13a58 = new a1172_0x3227df["Vector3"](_0xcfaadd['x'] - _0x50035c, _0xcfaadd['y'] - _0x21d96d, _0xcfaadd['z'] - _0x2aadf1);
  const _0x506257 = new a1172_0x3227df["Vector3"](_0xcfaadd['x'] + _0x50035c, _0xcfaadd['y'] - _0x21d96d, _0xcfaadd['z'] - _0x2aadf1);
  const _0xd0642e = new a1172_0x3227df["BufferGeometry"]()["setFromPoints"]([_0x4e8466, _0x36e4c7, _0x4e8466, _0x3fa39c, _0x4e8466, _0xd13a58, _0x4e8466, _0x506257, _0x36e4c7, _0x3fa39c, _0x3fa39c, _0x506257, _0x506257, _0xd13a58, _0xd13a58, _0x36e4c7]);
  const _0x1bd842 = new a1172_0x3227df['LineSegments'](_0xd0642e, _0x1b8c9a);
  _0x4518b2["add"](_0x1bd842);
  return {
    'group': _0x331cd8,
    'marker': _0x4518b2,
    'hitProxy': _0x41fed2,
    'bodyMaterial': _0x2599fe,
    'helperLineMaterial': _0x1b8c9a
  };
}
function applyGenderShape(_0x248dc3, _0x4d0fa3) {
  const _0x5bc2d0 = _0x248dc3?.["parts"];
  if (!_0x5bc2d0) {
    return;
  }
  const [_0x57e4a9, _0x2a0a14] = _0x5bc2d0["shoulders"] || [];
  const [_0x105ffe, _0x582bca] = _0x5bc2d0["upperArms"] || [];
  const [_0x3fa84c, _0x3c59ba] = _0x5bc2d0['lowerArms'] || [];
  const [_0x1041cd, _0x489fe3] = _0x5bc2d0["hands"] || [];
  const [_0x5bc271, _0x21addc] = _0x5bc2d0["upperLegs"] || [];
  const [_0x517ed7, _0x480c35] = _0x5bc2d0["lowerLegs"] || [];
  const [_0x9ce097, _0x59705c] = _0x5bc2d0["feet"] || [];
  if (_0x4d0fa3 === 'female') {
    _0x5bc2d0["head"]?.["scale"]["set"](0.94, 1.08, 0.92);
    _0x5bc2d0["neck"]?.["scale"]["set"](0.92, 0x1, 0.92);
    _0x5bc2d0["chest"]?.['scale']["set"](1.2, 0.98, 0.82);
    _0x5bc2d0["waist"]?.['scale']["set"](0.84, 0.92, 0.72);
    _0x5bc2d0['pelvis']?.["scale"]["set"](1.38, 0.98, 1.08);
    if (_0x57e4a9) {
      _0x57e4a9["position"]["set"](-0.27, 1.42, 0x0);
    }
    if (_0x2a0a14) {
      _0x2a0a14["position"]["set"](0.27, 1.42, 0x0);
    }
    if (_0x105ffe) {
      _0x105ffe['position']["set"](-0.34, 1.14, 0x0);
    }
    if (_0x582bca) {
      _0x582bca["position"]["set"](0.34, 1.14, 0x0);
    }
    if (_0x3fa84c) {
      _0x3fa84c["position"]['set'](-0.37, 0.84, 0.01);
    }
    if (_0x3c59ba) {
      _0x3c59ba["position"]["set"](0.37, 0.84, 0.01);
    }
    if (_0x1041cd) {
      _0x1041cd["position"]['set'](-0.375, 0.59, 0.01);
    }
    if (_0x489fe3) {
      _0x489fe3["position"]["set"](0.375, 0.59, 0.01);
    }
    _0x5bc271 && (_0x5bc271["position"]['set'](-0.115, 0.45, 0x0), _0x5bc271['scale']["set"](0.94, 0x1, 0.94));
    _0x21addc && (_0x21addc["position"]["set"](0.115, 0.45, 0x0), _0x21addc['scale']["set"](0.94, 0x1, 0.94));
    _0x517ed7 && (_0x517ed7['position']["set"](-0.115, 0.01, 0.01), _0x517ed7["scale"]["set"](0.92, 1.02, 0.9));
    _0x480c35 && (_0x480c35["position"]['set'](0.115, 0.01, 0.01), _0x480c35["scale"]["set"](0.92, 1.02, 0.9));
    if (_0x9ce097) {
      _0x9ce097["scale"]['set'](0.88, 0.96, 0.95);
    }
    if (_0x59705c) {
      _0x59705c["scale"]["set"](0.88, 0.96, 0.95);
    }
  } else {
    _0x5bc2d0["head"]?.["scale"]["set"](0.98, 1.08, 0.95);
    _0x5bc2d0["neck"]?.["scale"]["set"](1.02, 0x1, 1.02);
    _0x5bc2d0['chest']?.["scale"]["set"](1.48, 1.04, 0.98);
    _0x5bc2d0['waist']?.["scale"]["set"](1.02, 0.96, 0.84);
    _0x5bc2d0["pelvis"]?.["scale"]["set"](1.2, 0.94, 0.96);
    if (_0x57e4a9) {
      _0x57e4a9['position']["set"](-0.33, 1.44, 0x0);
    }
    if (_0x2a0a14) {
      _0x2a0a14["position"]['set'](0.33, 1.44, 0x0);
    }
    if (_0x105ffe) {
      _0x105ffe['position']["set"](-0.42, 1.18, 0x0);
    }
    if (_0x582bca) {
      _0x582bca["position"]["set"](0.42, 1.18, 0x0);
    }
    if (_0x3fa84c) {
      _0x3fa84c["position"]["set"](-0.45, 0.87, 0.01);
    }
    if (_0x3c59ba) {
      _0x3c59ba["position"]['set'](0.45, 0.87, 0.01);
    }
    if (_0x1041cd) {
      _0x1041cd["position"]["set"](-0.455, 0.63, 0.01);
    }
    if (_0x489fe3) {
      _0x489fe3['position']["set"](0.455, 0.63, 0.01);
    }
    _0x5bc271 && (_0x5bc271["position"]["set"](-0.125, 0.47, 0x0), _0x5bc271["scale"]["set"](1.06, 0x1, 1.02));
    _0x21addc && (_0x21addc['position']["set"](0.125, 0.47, 0x0), _0x21addc["scale"]["set"](1.06, 0x1, 1.02));
    _0x517ed7 && (_0x517ed7["position"]['set'](-0.125, 0.03, 0.01), _0x517ed7["scale"]["set"](0x1, 0x1, 0x1));
    _0x480c35 && (_0x480c35["position"]["set"](0.125, 0.03, 0.01), _0x480c35["scale"]["set"](0x1, 0x1, 0x1));
    if (_0x9ce097) {
      _0x9ce097["scale"]["set"](0x1, 0x1, 0x1);
    }
    if (_0x59705c) {
      _0x59705c["scale"]["set"](0x1, 0x1, 0x1);
    }
  }
}
function disposeMaterial(_0x4b5db9) {
  if (!_0x4b5db9) {
    return;
  }
  if (Array["isArray"](_0x4b5db9)) {
    _0x4b5db9["forEach"](disposeMaterial);
    return;
  }
  _0x4b5db9["map"] && (_0x4b5db9["map"]["dispose"](), _0x4b5db9["map"] = null);
  _0x4b5db9["dispose"]?.();
}
function disposeObject3D(_0xdf3aa1) {
  _0xdf3aa1["traverse"](_0x4f1cfa => {
    _0x4f1cfa["geometry"]?.["dispose"]?.();
    disposeMaterial(_0x4f1cfa['material']);
  });
}
function vectorFromAxisName(_0x1efd01) {
  if (_0x1efd01 === 'x') {
    return new a1172_0x3227df["Vector3"](0x1, 0x0, 0x0);
  }
  if (_0x1efd01 === 'y') {
    return new a1172_0x3227df["Vector3"](0x0, 0x1, 0x0);
  }
  return new a1172_0x3227df["Vector3"](0x0, 0x0, 0x1);
}
function toVector3Like(_0x4fefba, _0x5aa56b = {
  'x': 0x0,
  'y': 0x0,
  'z': 0x0
}) {
  return new a1172_0x3227df["Vector3"](Number["isFinite"](Number(_0x4fefba?.['x'])) ? Number(_0x4fefba['x']) : Number(_0x5aa56b?.['x']) || 0x0, Number["isFinite"](Number(_0x4fefba?.['y'])) ? Number(_0x4fefba['y']) : Number(_0x5aa56b?.['y']) || 0x0, Number["isFinite"](Number(_0x4fefba?.['z'])) ? Number(_0x4fefba['z']) : Number(_0x5aa56b?.['z']) || 0x0);
}
function toEulerLike(_0x3f45cf, _0x44233c = {
  'x': 0x0,
  'y': 0x0,
  'z': 0x0
}, _0x5b2623 = "XYZ") {
  return new a1172_0x3227df["Euler"](Number["isFinite"](Number(_0x3f45cf?.['x'])) ? Number(_0x3f45cf['x']) : Number(_0x44233c?.['x']) || 0x0, Number["isFinite"](Number(_0x3f45cf?.['y'])) ? Number(_0x3f45cf['y']) : Number(_0x44233c?.['y']) || 0x0, Number["isFinite"](Number(_0x3f45cf?.['z'])) ? Number(_0x3f45cf['z']) : Number(_0x44233c?.['z']) || 0x0, _0x5b2623);
}
function toScaleVector(_0x263395) {
  if (Number["isFinite"](_0x263395)) {
    const _0x3188c9 = Math["max"](0.01, Number(_0x263395) || 0x1);
    return {
      'x': _0x3188c9,
      'y': _0x3188c9,
      'z': _0x3188c9
    };
  }
  if (_0x263395 && Number["isFinite"](_0x263395['x']) && Number['isFinite'](_0x263395['y']) && Number["isFinite"](_0x263395['z'])) {
    return {
      'x': Math['max'](0.01, Number(_0x263395['x']) || 0x1),
      'y': Math["max"](0.01, Number(_0x263395['y']) || 0x1),
      'z': Math['max'](0.01, Number(_0x263395['z']) || 0x1)
    };
  }
  return {
    'x': 0x1,
    'y': 0x1,
    'z': 0x1
  };
}
function applyGroupScale(_0x1f0045, _0x15b92b) {
  const _0x525218 = toScaleVector(_0x15b92b);
  _0x1f0045["scale"]["set"](_0x525218['x'], _0x525218['y'], _0x525218['z']);
}
function applyGroupTransform(_0x200949, _0x1f54e5) {
  _0x200949["position"]["set"](Number(_0x1f54e5?.["position"]?.['x']) || 0x0, Number(_0x1f54e5?.["position"]?.['y']) || 0x0, Number(_0x1f54e5?.['position']?.['z']) || 0x0);
  if (hasFiniteQuaternion(_0x1f54e5?.["quaternion"])) {
    const _0x25e380 = normalizeQuaternionData(_0x1f54e5["quaternion"], {
      'x': 0x0,
      'y': 0x0,
      'z': 0x0,
      'w': 0x1
    });
    _0x200949["quaternion"]['set'](_0x25e380['x'], _0x25e380['y'], _0x25e380['z'], _0x25e380['w']);
    return;
  }
  _0x200949["rotation"]["set"](Number(_0x1f54e5?.["rotation"]?.['x']) || 0x0, Number(_0x1f54e5?.["rotation"]?.['y']) || 0x0, Number(_0x1f54e5?.["rotation"]?.['z']) || 0x0);
}
function hasFiniteQuaternion(_0x368421) {
  return Number["isFinite"](Number(_0x368421?.['x'])) && Number['isFinite'](Number(_0x368421?.['y'])) && Number['isFinite'](Number(_0x368421?.['z'])) && Number["isFinite"](Number(_0x368421?.['w']));
}
function normalizeQuaternionData(_0x14232c, _0x218c61 = {
  'x': 0x0,
  'y': 0x0,
  'z': 0x0,
  'w': 0x1
}) {
  const _0x338138 = Number(_0x14232c?.['x']);
  const _0x4fa7af = Number(_0x14232c?.['y']);
  const _0x267fba = Number(_0x14232c?.['z']);
  const _0x3c4680 = Number(_0x14232c?.['w']);
  if (!Number["isFinite"](_0x338138) || !Number["isFinite"](_0x4fa7af) || !Number["isFinite"](_0x267fba) || !Number['isFinite'](_0x3c4680)) {
    return {
      ..._0x218c61
    };
  }
  const _0x5ea522 = Math["hypot"](_0x338138, _0x4fa7af, _0x267fba, _0x3c4680);
  if (_0x5ea522 < 0.000001) {
    return {
      ..._0x218c61
    };
  }
  return {
    'x': _0x338138 / _0x5ea522,
    'y': _0x4fa7af / _0x5ea522,
    'z': _0x267fba / _0x5ea522,
    'w': _0x3c4680 / _0x5ea522
  };
}
function toQuaternionFromPose(_0x4082fc, _0x587a9f = {
  'x': 0x0,
  'y': 0x0,
  'z': 0x0,
  'w': 0x1
}, _0x5958d3 = "XYZ") {
  if (hasFiniteQuaternion(_0x4082fc?.["quaternion"])) {
    const _0x56f3e0 = normalizeQuaternionData(_0x4082fc["quaternion"], _0x587a9f);
    return new a1172_0x3227df['Quaternion'](_0x56f3e0['x'], _0x56f3e0['y'], _0x56f3e0['z'], _0x56f3e0['w']);
  }
  const _0x255d74 = toEulerLike(_0x4082fc?.['rotation'], {
    'x': 0x0,
    'y': 0x0,
    'z': 0x0
  }, _0x5958d3);
  return new a1172_0x3227df["Quaternion"]()['setFromEuler'](_0x255d74);
}
function composeMatrixFromPose(_0x22fb33 = {}, _0x526b66 = 'XYZ') {
  const _0x470158 = toVector3Like(_0x22fb33?.["position"], {
    'x': 0x0,
    'y': 0x0,
    'z': 0x0
  });
  const _0x143138 = toQuaternionFromPose(_0x22fb33, {
    'x': 0x0,
    'y': 0x0,
    'z': 0x0,
    'w': 0x1
  }, _0x526b66);
  const _0x8a034f = toVector3Like(toScaleVector(_0x22fb33?.["scale"]), {
    'x': 0x1,
    'y': 0x1,
    'z': 0x1
  });
  return new a1172_0x3227df['Matrix4']()["compose"](_0x470158, _0x143138, _0x8a034f);
}
function quaternionFromRotationYXZ(_0x167908) {
  const _0x2644de = new a1172_0x3227df["Quaternion"]()['setFromEuler'](new a1172_0x3227df["Euler"](Number(_0x167908?.['x']) || 0x0, Number(_0x167908?.['y']) || 0x0, Number(_0x167908?.['z']) || 0x0, "YXZ"));
  return normalizeQuaternionData(_0x2644de);
}
function resolveObjectPivot(_0x211876, _0x29a9ee) {
  if (Number["isFinite"](Number(_0x211876?.["pivot"]?.['x'])) && Number['isFinite'](Number(_0x211876?.["pivot"]?.['y'])) && Number["isFinite"](Number(_0x211876?.["pivot"]?.['z']))) {
    return toVector3Like(_0x211876["pivot"]);
  }
  if (_0x211876) {
    const _0x126606 = composeMatrixFromPose(_0x211876);
    const _0x26f0a1 = new a1172_0x3227df["Vector3"]();
    _0x26f0a1["setFromMatrixPosition"](_0x126606);
    return _0x26f0a1;
  }
  if (_0x29a9ee?.['group']) {
    const _0x51aa39 = new a1172_0x3227df["Vector3"]();
    _0x29a9ee["group"]["getWorldPosition"](_0x51aa39);
    return _0x51aa39;
  }
  return new a1172_0x3227df["Vector3"]();
}
function resolveActiveTransformTool(_0x401f14) {
  const _0xb651ff = String(_0x401f14?.['ui']?.["transformTool"] || '')["trim"]();
  if (_0xb651ff === "move" || _0xb651ff === "rotate" || _0xb651ff === "scale") {
    return _0xb651ff;
  }
  const _0x417205 = String(_0x401f14?.['ui']?.["activeTool"] || '')["trim"]();
  if (_0x417205 === "move" || _0x417205 === "rotate" || _0x417205 === "scale") {
    return _0x417205;
  }
  return 'move';
}
function resolveObjectOrientationQuaternion(_0xa157c2, _0x707f05) {
  if (_0x707f05?.["group"]) {
    const _0x41f2e1 = new a1172_0x3227df["Quaternion"]();
    _0x707f05["group"]["getWorldQuaternion"](_0x41f2e1);
    return _0x41f2e1;
  }
  return toQuaternionFromPose(_0xa157c2, {
    'x': 0x0,
    'y': 0x0,
    'z': 0x0,
    'w': 0x1
  });
}
function areOrientationQuaternionsAligned(_0x27f366, _0x454919, _0x5a5315 = 0.00001) {
  if (!_0x27f366 || !_0x454919) {
    return ![];
  }
  const _0x38c906 = Math["abs"]((Number(_0x27f366['x']) || 0x0) * (Number(_0x454919['x']) || 0x0) + (Number(_0x27f366['y']) || 0x0) * (Number(_0x454919['y']) || 0x0) + (Number(_0x27f366['z']) || 0x0) * (Number(_0x454919['z']) || 0x0) + (Number(_0x27f366['w']) || 0x0) * (Number(_0x454919['w']) || 0x0));
  return Math["abs"](0x1 - _0x38c906) <= _0x5a5315;
}
function resolveSelectionGizmoOrientation(_0x150128, _0x2720e7, _0x3f4a98) {
  const _0x2efd13 = _0x2720e7?.["orientationQuaternion"]?.["clone"]?.() || new a1172_0x3227df["Quaternion"]();
  if (!_0x3f4a98) {
    return {
      'orientationQuaternion': _0x2efd13,
      'usesLocalOrientation': !![]
    };
  }
  const _0x49dfdb = _0x150128["length"] > 0x0 && _0x150128["every"](_0x1ea4a7 => areOrientationQuaternionsAligned(_0x2efd13, _0x1ea4a7["orientationQuaternion"]));
  return {
    'orientationQuaternion': _0x49dfdb ? _0x2efd13 : new a1172_0x3227df["Quaternion"](),
    'usesLocalOrientation': _0x49dfdb
  };
}
function rotationFromQuaternionYXZ(_0x44ce33) {
  const _0x528b83 = normalizeQuaternionData(_0x44ce33);
  const _0x183171 = new a1172_0x3227df['Euler']()["setFromQuaternion"](new a1172_0x3227df["Quaternion"](_0x528b83['x'], _0x528b83['y'], _0x528b83['z'], _0x528b83['w']), 'YXZ');
  return {
    'x': _0x183171['x'],
    'y': _0x183171['y'],
    'z': _0x183171['z']
  };
}
function normalizeCameraPoseData(_0x5516c1 = {}) {
  const _0x35ae46 = {
    'x': Number(_0x5516c1?.['position']?.['x']) || 0x0,
    'y': Number(_0x5516c1?.["position"]?.['y']) || 0x0,
    'z': Number(_0x5516c1?.["position"]?.['z']) || 0x0
  };
  const _0x416020 = hasFiniteQuaternion(_0x5516c1?.["quaternion"]);
  const _0x6a8a5e = _0x416020 ? normalizeQuaternionData(_0x5516c1["quaternion"], quaternionFromRotationYXZ(_0x5516c1?.["rotation"])) : quaternionFromRotationYXZ(_0x5516c1?.["rotation"]);
  const _0x1b140c = _0x416020 ? rotationFromQuaternionYXZ(_0x6a8a5e) : {
    'x': Number(_0x5516c1?.['rotation']?.['x']) || 0x0,
    'y': Number(_0x5516c1?.['rotation']?.['y']) || 0x0,
    'z': Number(_0x5516c1?.["rotation"]?.['z']) || 0x0
  };
  return {
    'position': _0x35ae46,
    'quaternion': _0x6a8a5e,
    'rotation': _0x1b140c,
    'fov': Number["isFinite"](Number(_0x5516c1?.["fov"])) ? Number(_0x5516c1["fov"]) : focalLengthToFov(Object["prototype"]["hasOwnProperty"]["call"](_0x5516c1 || {}, "focalLength") ? _0x5516c1['focalLength'] : SCENE_DEFAULT_FOCAL_LENGTH_MM),
    'focalLength': Object["prototype"]["hasOwnProperty"]["call"](_0x5516c1 || {}, "focalLength") ? Number(_0x5516c1["focalLength"]) || SCENE_DEFAULT_FOCAL_LENGTH_MM : Number['isFinite'](Number(_0x5516c1?.["fov"])) ? fovToFocalLength(_0x5516c1['fov']) : SCENE_DEFAULT_FOCAL_LENGTH_MM
  };
}
function collectSelectedObjects(_0xaa734e) {
  const _0x2340f4 = Array['isArray'](_0xaa734e?.['cubes']) ? _0xaa734e["cubes"] : [];
  const _0x170bed = Array["isArray"](_0xaa734e?.["mannequins"]) ? _0xaa734e["mannequins"] : [];
  const _0x5d6544 = Array['isArray'](_0xaa734e?.["cameras"]) ? _0xaa734e["cameras"] : [];
  const _0x488fe3 = new Set(_0x2340f4["map"](_0x91d763 => _0x91d763['id']));
  const _0x3fd2c8 = new Set(_0x170bed["map"](_0x1de077 => _0x1de077['id']));
  const _0x36e916 = new Set(_0x5d6544["map"](_0x30c710 => _0x30c710['id']));
  const _0x3d2687 = new Set();
  const _0xe935e1 = [];
  const _0x5df490 = (_0x31b224, _0x203847) => {
    if (_0x31b224 !== "cube" && _0x31b224 !== 'mannequin' && _0x31b224 !== "camera") {
      return;
    }
    const _0x3df148 = String(_0x203847 || '')["trim"]();
    if (!_0x3df148) {
      return;
    }
    const _0x58cce2 = _0x31b224 === "camera" ? _0x36e916["has"](_0x3df148) : _0x31b224 === "cube" ? _0x488fe3['has'](_0x3df148) : _0x3fd2c8["has"](_0x3df148);
    if (!_0x58cce2) {
      return;
    }
    const _0x239f0b = _0x31b224 + ':' + _0x3df148;
    if (_0x3d2687["has"](_0x239f0b)) {
      return;
    }
    _0x3d2687['add'](_0x239f0b);
    _0xe935e1['push']({
      'objectType': _0x31b224,
      'objectId': _0x3df148
    });
  };
  const _0x54dc2c = Array["isArray"](_0xaa734e?.["selection"]?.["selectedObjects"]) ? _0xaa734e["selection"]["selectedObjects"] : [];
  _0x54dc2c['forEach'](_0x227e3a => {
    _0x5df490(_0x227e3a?.["objectType"], _0x227e3a?.["objectId"]);
  });
  if (_0xe935e1['length'] > 0x0) {
    return _0xe935e1;
  }
  const _0x14dbe1 = _0xaa734e?.["selection"]?.['selectedGroupId'] || null;
  if (_0x14dbe1) {
    const _0x4b7272 = (_0xaa734e?.["groups"] || [])['find'](_0x38e2ff => _0x38e2ff['id'] === _0x14dbe1);
    const _0x8499dd = Array['isArray'](_0x4b7272?.["memberIds"]) ? _0x4b7272["memberIds"] : [];
    _0x8499dd["forEach"](_0x3958a4 => {
      _0x5df490("mannequin", _0x3958a4);
    });
    if (_0xe935e1["length"] > 0x0) {
      return _0xe935e1;
    }
  }
  const _0x34c222 = _0xaa734e?.["selection"]?.["selectedObjectType"] === "cube" || _0xaa734e?.["selection"]?.["selectedObjectType"] === "mannequin" || _0xaa734e?.['selection']?.["selectedObjectType"] === "camera" ? _0xaa734e["selection"]["selectedObjectType"] : null;
  if (!_0x34c222) {
    return _0xe935e1;
  }
  const _0x3d3b03 = Array['isArray'](_0xaa734e?.["selection"]?.["selectedObjectIds"]) ? _0xaa734e["selection"]["selectedObjectIds"] : [];
  if (_0x3d3b03["length"] > 0x0) {
    _0x3d3b03['forEach'](_0x1ae26e => {
      _0x5df490(_0x34c222, _0x1ae26e);
    });
    if (_0xe935e1["length"] > 0x0) {
      return _0xe935e1;
    }
  }
  _0x5df490(_0x34c222, _0xaa734e?.['selection']?.['selectedObjectId'] || null);
  return _0xe935e1;
}
function collectSelectedObjectIds(_0x4cb3ea, _0x25482b) {
  return collectSelectedObjects(_0x4cb3ea)["filter"](_0x1551f6 => _0x1551f6["objectType"] === _0x25482b)["map"](_0x2ab8f1 => _0x2ab8f1['objectId']);
}
function buildTransformSelectionSignature(_0x4a613f) {
  const _0x5f08ca = collectSelectedObjects(_0x4a613f);
  if (_0x5f08ca['length'] === 0x0) {
    return '';
  }
  return _0x5f08ca["map"](_0x3f7545 => _0x3f7545['objectType'] + ':' + _0x3f7545["objectId"])["sort"]()["join"]('|');
}
function cloneGizmoDisplayContext(_0x5325d4) {
  if (!_0x5325d4) {
    return null;
  }
  return {
    'isMultiSelection': _0x5325d4["isMultiSelection"] === !![],
    'usesLocalOrientation': _0x5325d4["usesLocalOrientation"] === !![],
    'position': _0x5325d4["position"]?.['clone']?.() || new a1172_0x3227df['Vector3'](),
    'orientationQuaternion': _0x5325d4['orientationQuaternion']?.["clone"]?.() || new a1172_0x3227df['Quaternion'](),
    'bounds': {
      'box': _0x5325d4["bounds"]?.['box']?.["clone"]?.() || createFallbackBounds()["box"],
      'size': _0x5325d4['bounds']?.["size"]?.["clone"]?.() || new a1172_0x3227df["Vector3"](0x1, 0x1, 0x1),
      'sphere': _0x5325d4['bounds']?.["sphere"] ? new a1172_0x3227df["Sphere"](_0x5325d4["bounds"]["sphere"]['center']?.['clone']?.() || new a1172_0x3227df['Vector3'](), Number(_0x5325d4["bounds"]["sphere"]['radius']) || 0x0) : new a1172_0x3227df["Sphere"](new a1172_0x3227df["Vector3"](0x0, 0.5, 0x0), Math["sqrt"](0.75)),
      'extents': {
        'x': Number(_0x5325d4["bounds"]?.['extents']?.['x']) || 0x0,
        'y': Number(_0x5325d4["bounds"]?.["extents"]?.['y']) || 0x0,
        'z': Number(_0x5325d4["bounds"]?.["extents"]?.['z']) || 0x0
      }
    },
    'gizmoWorldMetrics': {
      'extents': {
        'x': Number(_0x5325d4["gizmoWorldMetrics"]?.["extents"]?.['x']) || 0x0,
        'y': Number(_0x5325d4["gizmoWorldMetrics"]?.["extents"]?.['y']) || 0x0,
        'z': Number(_0x5325d4["gizmoWorldMetrics"]?.["extents"]?.['z']) || 0x0
      },
      'maxExtent': Number(_0x5325d4["gizmoWorldMetrics"]?.["maxExtent"]) || 0.01,
      'sphereRadius': Number(_0x5325d4['gizmoWorldMetrics']?.["sphereRadius"]) || 0.01,
      'margin': Number(_0x5325d4["gizmoWorldMetrics"]?.["margin"]) || GIZMO_MARGIN_WORLD_MIN
    }
  };
}
function measureVisualBounds(_0x446cf1) {
  if (_0x446cf1?.['boundsBox']?.['isBox3'] && !_0x446cf1["boundsBox"]['isEmpty']()) {
    const _0x16478d = _0x446cf1["boundsBox"]["clone"]();
    const _0x35a1f2 = new a1172_0x3227df["Vector3"]();
    const _0xe0f8b2 = new a1172_0x3227df["Sphere"]();
    _0x16478d["getSize"](_0x35a1f2);
    _0x16478d['getBoundingSphere'](_0xe0f8b2);
    return {
      'box': _0x16478d,
      'size': _0x35a1f2,
      'sphere': _0xe0f8b2,
      'extents': {
        'x': Math["max"](0x0, _0x35a1f2['x'] * 0.5),
        'y': Math['max'](0x0, _0x35a1f2['y'] * 0.5),
        'z': Math["max"](0x0, _0x35a1f2['z'] * 0.5)
      }
    };
  }
  const _0xbf1a56 = _0x446cf1?.['proxyRoot'] || _0x446cf1?.["group"];
  if (!_0xbf1a56) {
    return null;
  }
  const _0x16d29f = new a1172_0x3227df["Box3"]()["setFromObject"](_0xbf1a56);
  if (_0x16d29f["isEmpty"]()) {
    return null;
  }
  const _0x50f3e0 = new a1172_0x3227df["Vector3"]();
  const _0x133c3b = new a1172_0x3227df["Sphere"]();
  _0x16d29f["getSize"](_0x50f3e0);
  _0x16d29f["getBoundingSphere"](_0x133c3b);
  return {
    'box': _0x16d29f,
    'size': _0x50f3e0,
    'sphere': _0x133c3b,
    'extents': {
      'x': Math['max'](0x0, _0x50f3e0['x'] * 0.5),
      'y': Math["max"](0x0, _0x50f3e0['y'] * 0.5),
      'z': Math["max"](0x0, _0x50f3e0['z'] * 0.5)
    }
  };
}
function resolveObjectToolPivot(_0x1f411b, _0xc142c0) {
  return resolveObjectPivot(_0x1f411b, _0xc142c0);
}
function measureVisualBoundsForSelection(_0x3f419f = []) {
  const _0x2c5739 = new a1172_0x3227df["Box3"]();
  let _0x126a62 = ![];
  _0x3f419f["forEach"](_0x40fd58 => {
    if (_0x40fd58?.["visual"]?.['boundsBox']?.['isBox3'] && !_0x40fd58["visual"]['boundsBox']["isEmpty"]()) {
      const _0x34c4e5 = _0x40fd58["visual"]["boundsBox"];
      if (!_0x126a62) {
        _0x2c5739["copy"](_0x34c4e5);
        _0x126a62 = !![];
        return;
      }
      _0x2c5739["union"](_0x34c4e5);
      return;
    }
    const _0x5c0a70 = _0x40fd58?.['visual']?.["proxyRoot"] || _0x40fd58?.['visual']?.['group'];
    if (!_0x5c0a70) {
      return;
    }
    const _0x5dcd5e = new a1172_0x3227df["Box3"]()["setFromObject"](_0x5c0a70);
    if (_0x5dcd5e["isEmpty"]()) {
      return;
    }
    if (!_0x126a62) {
      _0x2c5739["copy"](_0x5dcd5e);
      _0x126a62 = !![];
      return;
    }
    _0x2c5739["union"](_0x5dcd5e);
  });
  if (!_0x126a62) {
    return null;
  }
  const _0xe4b081 = new a1172_0x3227df["Vector3"]();
  const _0x232ddd = new a1172_0x3227df["Sphere"]();
  _0x2c5739["getSize"](_0xe4b081);
  _0x2c5739["getBoundingSphere"](_0x232ddd);
  return {
    'box': _0x2c5739,
    'size': _0xe4b081,
    'sphere': _0x232ddd,
    'extents': {
      'x': Math["max"](0x0, _0xe4b081['x'] * 0.5),
      'y': Math['max'](0x0, _0xe4b081['y'] * 0.5),
      'z': Math['max'](0x0, _0xe4b081['z'] * 0.5)
    }
  };
}
function createFallbackBounds() {
  return {
    'box': new a1172_0x3227df["Box3"](new a1172_0x3227df["Vector3"](-0.5, 0x0, -0.5), new a1172_0x3227df["Vector3"](0.5, 0x1, 0.5)),
    'size': new a1172_0x3227df["Vector3"](0x1, 0x1, 0x1),
    'sphere': new a1172_0x3227df['Sphere'](new a1172_0x3227df["Vector3"](0x0, 0.5, 0x0), Math["sqrt"](0.75)),
    'extents': {
      'x': 0.5,
      'y': 0.5,
      'z': 0.5
    }
  };
}
function computeGizmoWorldMetrics(_0x92dbc2, _0x3db5eb) {
  const _0x3a9d98 = _0x92dbc2?.['extents'] || {
    'x': 0.5,
    'y': 0.5,
    'z': 0.5
  };
  const _0x16321f = _0x92dbc2?.["box"];
  const _0x54fa02 = _0x16321f && !_0x16321f["isEmpty"]?.() && _0x3db5eb;
  const _0x8957ac = _0x54fa02 ? {
    'x': Math["max"](Math["abs"](_0x16321f["min"]['x'] - _0x3db5eb['x']), Math['abs'](_0x16321f["max"]['x'] - _0x3db5eb['x'])),
    'y': Math["max"](Math["abs"](_0x16321f["min"]['y'] - _0x3db5eb['y']), Math["abs"](_0x16321f["max"]['y'] - _0x3db5eb['y'])),
    'z': Math['max'](Math['abs'](_0x16321f['min']['z'] - _0x3db5eb['z']), Math["abs"](_0x16321f["max"]['z'] - _0x3db5eb['z']))
  } : _0x3a9d98;
  const _0x30e0c7 = Math["max"](0.01, Number(_0x8957ac['x']) || 0x0, Number(_0x8957ac['y']) || 0x0, Number(_0x8957ac['z']) || 0x0);
  const _0x50badb = Math['max'](0.01, Number(_0x92dbc2?.["sphere"]?.["radius"]) || 0.01);
  const _0x598aed = Math["max"](GIZMO_MARGIN_WORLD_MIN, _0x50badb * GIZMO_MARGIN_WORLD_RATIO, _0x30e0c7 * 0.18);
  return {
    'extents': _0x8957ac,
    'maxExtent': _0x30e0c7,
    'sphereRadius': _0x50badb,
    'margin': _0x598aed
  };
}
function cloneRenderPose(_0x1c91d1) {
  if (!_0x1c91d1) {
    return null;
  }
  if (_0x1c91d1['kind'] === "camera") {
    const _0x49c5ab = normalizeCameraPoseData(_0x1c91d1);
    return {
      'kind': "camera",
      'position': {
        ..._0x49c5ab['position']
      },
      'quaternion': {
        ..._0x49c5ab["quaternion"]
      },
      'rotation': {
        ..._0x49c5ab["rotation"]
      },
      'fov': _0x49c5ab["fov"]
    };
  }
  if (_0x1c91d1["kind"] === "panorama-default") {
    return {
      'kind': "panorama-default",
      'position': {
        ..._0x1c91d1['position']
      },
      'yaw': Number(_0x1c91d1['yaw']) || 0x0,
      'pitch': Number(_0x1c91d1["pitch"]) || 0x0,
      'fov': Number(_0x1c91d1["fov"]) || 0x48
    };
  }
  return {
    'kind': "scene-default",
    'position': {
      ..._0x1c91d1["position"]
    },
    'target': {
      ..._0x1c91d1['target']
    },
    'yaw': Number(_0x1c91d1["yaw"]) || 0x0,
    'pitch': Number(_0x1c91d1["pitch"]) || 0x0,
    'distance': Number(_0x1c91d1["distance"]) || 0x0,
    'fov': Number(_0x1c91d1["fov"]) || 0x3a
  };
}
function measurePoseDistance(_0x2ca9cd, _0x611f9a) {
  if (!_0x2ca9cd || !_0x611f9a || _0x2ca9cd["kind"] !== _0x611f9a["kind"]) {
    return Number["POSITIVE_INFINITY"];
  }
  if (_0x611f9a['kind'] === "camera") {
    const _0x5f2a44 = normalizeCameraPoseData(_0x2ca9cd);
    const _0x1d7c61 = normalizeCameraPoseData(_0x611f9a);
    const _0xf4f582 = Math["abs"](_0x1d7c61['position']['x'] - _0x5f2a44['position']['x']) + Math['abs'](_0x1d7c61["position"]['y'] - _0x5f2a44["position"]['y']) + Math["abs"](_0x1d7c61["position"]['z'] - _0x5f2a44['position']['z']);
    const _0x23ee4f = Math["abs"](_0x1d7c61['quaternion']['x'] * _0x5f2a44["quaternion"]['x'] + _0x1d7c61["quaternion"]['y'] * _0x5f2a44['quaternion']['y'] + _0x1d7c61["quaternion"]['z'] * _0x5f2a44["quaternion"]['z'] + _0x1d7c61["quaternion"]['w'] * _0x5f2a44['quaternion']['w']);
    const _0x13dd6d = 0x1 - Math["min"](0x1, Math['max'](0x0, _0x23ee4f));
    return _0xf4f582 + _0x13dd6d + Math["abs"](_0x1d7c61['fov'] - _0x5f2a44['fov']);
  }
  if (_0x611f9a["kind"] === 'panorama-default') {
    const _0x2aed96 = Math['abs']((_0x611f9a["position"]?.['x'] || 0x0) - (_0x2ca9cd["position"]?.['x'] || 0x0)) + Math["abs"]((_0x611f9a["position"]?.['y'] || 0x0) - (_0x2ca9cd['position']?.['y'] || 0x0)) + Math["abs"]((_0x611f9a["position"]?.['z'] || 0x0) - (_0x2ca9cd["position"]?.['z'] || 0x0));
    const _0x365f22 = Math["abs"]((_0x611f9a["yaw"] || 0x0) - (_0x2ca9cd['yaw'] || 0x0)) + Math["abs"]((_0x611f9a["pitch"] || 0x0) - (_0x2ca9cd["pitch"] || 0x0));
    return _0x2aed96 + _0x365f22 + Math["abs"]((_0x611f9a["fov"] || 0x0) - (_0x2ca9cd["fov"] || 0x0));
  }
  const _0x2cb558 = Math["abs"]((_0x611f9a["position"]?.['x'] || 0x0) - (_0x2ca9cd["position"]?.['x'] || 0x0)) + Math["abs"]((_0x611f9a['position']?.['y'] || 0x0) - (_0x2ca9cd['position']?.['y'] || 0x0)) + Math["abs"]((_0x611f9a["position"]?.['z'] || 0x0) - (_0x2ca9cd['position']?.['z'] || 0x0));
  const _0x5a651a = Math['abs']((_0x611f9a["target"]?.['x'] || 0x0) - (_0x2ca9cd["target"]?.['x'] || 0x0)) + Math["abs"]((_0x611f9a['target']?.['y'] || 0x0) - (_0x2ca9cd["target"]?.['y'] || 0x0)) + Math["abs"]((_0x611f9a["target"]?.['z'] || 0x0) - (_0x2ca9cd["target"]?.['z'] || 0x0));
  return _0x2cb558 + _0x5a651a + Math['abs']((_0x611f9a["fov"] || 0x0) - (_0x2ca9cd["fov"] || 0x0));
}
function areSceneViewsEquivalent(_0x10862e, _0x3e757e, _0x51f3a9 = 0.00001) {
  if (!_0x10862e || !_0x3e757e) {
    return ![];
  }
  const _0x2e97f5 = _0x10862e["target"] || {};
  const _0x570d96 = _0x3e757e["target"] || {};
  return Math["abs"]((Number(_0x2e97f5['x']) || 0x0) - (Number(_0x570d96['x']) || 0x0)) <= _0x51f3a9 && Math["abs"]((Number(_0x2e97f5['y']) || 0x0) - (Number(_0x570d96['y']) || 0x0)) <= _0x51f3a9 && Math["abs"]((Number(_0x2e97f5['z']) || 0x0) - (Number(_0x570d96['z']) || 0x0)) <= _0x51f3a9 && Math["abs"](normalizeAngle((Number(_0x10862e["orbitYaw"]) || 0x0) - (Number(_0x3e757e["orbitYaw"]) || 0x0))) <= _0x51f3a9 && Math["abs"]((Number(_0x10862e["orbitPitch"]) || 0x0) - (Number(_0x3e757e['orbitPitch']) || 0x0)) <= _0x51f3a9 && Math["abs"]((Number(_0x10862e["orbitDistance"]) || 0x0) - (Number(_0x3e757e['orbitDistance']) || 0x0)) <= _0x51f3a9;
}
export class PanoramaScene3DBridge {
  constructor({
    container: _0x47692e,
    onPanoramaStatusChange: _0xae27d1
  } = {}) {
    this["container"] = _0x47692e;
    this["onPanoramaStatusChange"] = _0xae27d1;
    this["scene"] = new a1172_0x3227df["Scene"]();
    this["camera"] = new a1172_0x3227df["PerspectiveCamera"](0x37, 0x1, 0.1, 0xfa);
    this["camera"]["rotation"]["order"] = "YXZ";
    this['renderer'] = new a1172_0x3227df['WebGLRenderer']({
      'antialias': !![],
      'alpha': !![],
      'preserveDrawingBuffer': !![]
    });
    this["renderer"]["sortObjects"] = !![];
    this["renderer"]['outputColorSpace'] = a1172_0x3227df["SRGBColorSpace"];
    this["renderer"]['setPixelRatio'](Math["min"](window["devicePixelRatio"] || 0x1, 0x2));
    this['renderer']['setClearAlpha'](0x0);
    this["renderer"]["domElement"]["className"] = "panorama-scene-webgl";
    this["renderer"]["domElement"]['draggable'] = ![];
    this["container"]?.["appendChild"](this['renderer']['domElement']);
    this["_ambientLight"] = new a1172_0x3227df["AmbientLight"](0xffffff, 0.88);
    this["_keyLight"] = new a1172_0x3227df["DirectionalLight"](0xffffff, 1.05);
    this["_keyLight"]["position"]["set"](0x6, 0xa, 0x4);
    this["_rimLight"] = new a1172_0x3227df["DirectionalLight"](0x88b6ff, 0.38);
    this["_rimLight"]['position']["set"](-0x6, 0x8, -0xa);
    this['scene']["add"](this["_ambientLight"], this["_keyLight"], this["_rimLight"]);
    const _0x2bb696 = resolveThemeColorValue("--panorama-scene-grid-night", '--indigo-35');
    this["_gridMinor"] = new a1172_0x3227df['GridHelper'](GRID_BASE_SPAN, Math["round"](GRID_BASE_SPAN / GRID_MINOR_STEP), _0x2bb696, _0x2bb696);
    eachMaterial(this["_gridMinor"]["material"], _0x2f5556 => {
      _0x2f5556["transparent"] = !![];
      _0x2f5556["opacity"] = 0.2;
      _0x2f5556['depthWrite'] = ![];
      _0x2f5556["depthTest"] = !![];
    });
    this["_gridMinor"]["renderOrder"] = 0x1;
    this["scene"]["add"](this["_gridMinor"]);
    this['_gridMajor'] = new a1172_0x3227df['GridHelper'](GRID_BASE_SPAN, Math["round"](GRID_BASE_SPAN / GRID_MAJOR_STEP), _0x2bb696, _0x2bb696);
    eachMaterial(this["_gridMajor"]["material"], _0x36d02f => {
      _0x36d02f['transparent'] = !![];
      _0x36d02f["opacity"] = 0.34;
      _0x36d02f['depthWrite'] = ![];
      _0x36d02f['depthTest'] = !![];
    });
    this['_gridMajor']["renderOrder"] = 0x2;
    this["scene"]['add'](this["_gridMajor"]);
    this["_ground"] = new a1172_0x3227df["Mesh"](new a1172_0x3227df["PlaneGeometry"](0x1, 0x1), new a1172_0x3227df['MeshBasicMaterial']({
      'color': resolveThemeColor("--panorama-scene-ground-night", "--indigo-12"),
      'transparent': !![],
      'opacity': 0.1,
      'side': a1172_0x3227df["DoubleSide"],
      'depthWrite': ![],
      'depthTest': !![],
      'polygonOffset': !![],
      'polygonOffsetFactor': 0x1,
      'polygonOffsetUnits': 0x1
    }));
    this["_ground"]["rotation"]['x'] = -Math['PI'] / 0x2;
    this["_ground"]["position"]['y'] = -0.001;
    this['_ground']['renderOrder'] = 0x0;
    this["scene"]["add"](this['_ground']);
    this["_panoramaSphere"] = new a1172_0x3227df['Mesh'](new a1172_0x3227df["SphereGeometry"](0x3c, 0x30, 0x20), new a1172_0x3227df["MeshBasicMaterial"]({
      'color': 0xffffff,
      'side': a1172_0x3227df['BackSide']
    }));
    this["_panoramaSphere"]["visible"] = ![];
    this['scene']["add"](this["_panoramaSphere"]);
    this["_textureLoader"] = new a1172_0x3227df["TextureLoader"]();
    this['_panoramaTextureSourceLoader'] = (_0x3c4a69, _0x220441 = {}) => loadPanoramaTextureSource(_0x3c4a69, {
      ..._0x220441,
      'textureLoader': this["_textureLoader"]
    });
    this["_mannequinMap"] = new Map();
    this["_mannequinStateById"] = new Map();
    this['_cubeMap'] = new Map();
    this["_cubeStateById"] = new Map();
    this['_cameraMap'] = new Map();
    this["_cameraStateById"] = new Map();
    this['_visualOverrides'] = new Map();
    this["_pickMap"] = new Map();
    this['_pickRoots'] = [];
    this["_sceneState"] = null;
    this["_sceneContentExtent"] = 0x10;
    this['_sceneContentBounds'] = {
      'center': {
        'x': 0x0,
        'y': 0x0,
        'z': 0x0
      },
      'radius': 0x10
    };
    this['_draftView'] = null;
    this["_draftObjects"] = new Map();
    this['_draftMannequinBonePoses'] = new Map();
    this["_rafId"] = null;
    this["_loadedPanoramaUrl"] = '';
    this["_pendingPanoramaUrl"] = '';
    this["_panoramaSourceKey"] = '';
    this['_panoramaLoadToken'] = 0x0;
    this["_panoramaTexture"] = null;
    this["_panoramaTextureAbortController"] = null;
    this["_panoramaFullLoadFrame"] = null;
    this["_renderPose"] = null;
    this["_defaultSceneFocalLength"] = SCENE_DEFAULT_FOCAL_LENGTH_MM;
    this["_smoothedPose"] = null;
    this["_lastRenderTime"] = 0x0;
    this["_viewSmoothingUntil"] = 0x0;
    this["_gridSnapState"] = {
      'minorX': null,
      'minorZ': null,
      'majorX': null,
      'majorZ': null
    };
    this['_lastStableGizmoSelectionSignature'] = '';
    this["_lastStableGizmoContext"] = null;
    this["_gizmo"] = createScene3DGizmoVisual({
      'configureGizmoMaterial': configureGizmoMaterial,
      'configureGizmoObject': configureGizmoObject,
      'createMoveAxis': createMoveAxis,
      'createPlaneCornerPickGeometry': createPlaneCornerPickGeometry,
      'createPlaneCornerVisual': createPlaneCornerVisual,
      'createRotateRing': createRotateRing,
      'createScaleAxis': createScaleAxis
    });
    this["scene"]['add'](this['_gizmo']['root']);
    this["_gizmoMoveGuideLine"] = new a1172_0x3227df["Line"](createLineGeometry(new a1172_0x3227df["Vector3"](0x0, 0x0, 0x0), new a1172_0x3227df["Vector3"](0x0, 0x0, 0x0)), configureGizmoMaterial(new a1172_0x3227df["LineBasicMaterial"]({
      'color': resolveThemeColor("--white", '--white'),
      'transparent': !![],
      'opacity': 0.76,
      'depthWrite': ![]
    }), {
      'transparent': !![],
      'opacity': 0.76
    }));
    configureGizmoObject(this["_gizmoMoveGuideLine"]);
    this["_gizmoMoveGuideLine"]["visible"] = ![];
    this["_gizmoMoveGuideLine"]["renderOrder"] = 0x3;
    this['scene']["add"](this["_gizmoMoveGuideLine"]);
    this["resize"](0x280, 0x168);
    this["requestRender"]();
  }
  ["resize"](_0x5d4844, _0x118aba) {
    const _0x28e425 = Math["max"](0x1, Math["floor"](_0x5d4844 || this['container']?.["clientWidth"] || 0x1));
    const _0x3ca509 = Math['max'](0x1, Math["floor"](_0x118aba || this["container"]?.["clientHeight"] || 0x1));
    this["renderer"]["setPixelRatio"](Math['min'](window["devicePixelRatio"] || 0x1, 0x2));
    a1172_0x23fa98["resizeBridgeViewProjection"](this, _0x28e425, _0x3ca509);
    this['renderer']["setSize"](_0x28e425, _0x3ca509, ![]);
    this["requestRender"]();
  }
  ['setViewProjection'](_0x12f931 = "perspective", _0x1d1bfa = {}) {
    const _0x526029 = a1172_0x23fa98["switchBridgeViewProjection"](this, _0x12f931, _0x1d1bfa);
    this["requestRender"]();
    return _0x526029;
  }
  ["readViewProjection"]() {
    return a1172_0x23fa98['readBridgeViewProjection'](this);
  }
  ["setGridVisible"](_0x2545cf) {
    this["_gridVisible"] = _0x2545cf !== ![];
    this["_syncPanoramaModeVisibility"](this["_isPanorama360Mode"]());
    this["requestRender"]();
  }
  ["setGroundFillVisible"](_0x520d74) {
    this['_groundFillVisible'] = _0x520d74 !== ![];
    this["_syncPanoramaModeVisibility"](this['_isPanorama360Mode']());
    this["requestRender"]();
  }
  ["_isPanorama360Mode"](_0xa464dc = this['_sceneState']) {
    return _0xa464dc?.["type"] === "panorama-360";
  }
  ['setDraftView'](_0x12fce0) {
    this["_draftView"] = _0x12fce0 || null;
    this["requestRender"]();
  }
  ["setDefaultSceneFocalLength"](_0x558620) {
    const _0x1fcf6d = PANORAMA_SCENE_CAMERA_CONSTRAINTS["scene"]["focalLength"];
    this["_defaultSceneFocalLength"] = Math["max"](_0x1fcf6d["min"], Math["min"](_0x1fcf6d["max"], Number(_0x558620) || _0x1fcf6d["default"]));
    this['requestRender']();
  }
  ["getDefaultSceneFocalLength"]() {
    return this["_defaultSceneFocalLength"];
  }
  ["clearDraftView"]() {
    this['_draftView'] = null;
    this['requestRender']();
  }
  ['setDraftObjectTransform'](_0x593d75, _0x59b497, _0x315ea8) {
    const _0x4e8238 = _0x593d75 + ':' + _0x59b497;
    const _0x30d567 = hasFiniteQuaternion(_0x315ea8?.["quaternion"]) ? normalizeQuaternionData(_0x315ea8["quaternion"], {
      'x': 0x0,
      'y': 0x0,
      'z': 0x0,
      'w': 0x1
    }) : _0x593d75 === "camera" ? normalizeCameraPoseData(_0x315ea8)["quaternion"] : undefined;
    this["_draftObjects"]["set"](_0x4e8238, {
      'position': {
        ..._0x315ea8["position"]
      },
      'rotation': {
        ..._0x315ea8['rotation']
      },
      'quaternion': _0x30d567,
      'scale': Number["isFinite"](_0x315ea8?.["scale"]) || _0x315ea8?.["scale"] && Number['isFinite'](_0x315ea8['scale']['x']) && Number["isFinite"](_0x315ea8['scale']['y']) && Number["isFinite"](_0x315ea8['scale']['z']) ? _0x315ea8['scale'] : undefined
    });
    this["requestRender"]();
  }
  ["setObjectVisualOverride"](_0x691ccf, _0x3773e3, _0x5a3e59) {
    const _0x238fff = String(_0x691ccf || '')["trim"]();
    const _0x5ddab8 = String(_0x3773e3 || '')["trim"]();
    if (!_0x238fff || !_0x5ddab8 || !_0x5a3e59?.["group"]) {
      return ![];
    }
    this['_visualOverrides']["set"](_0x238fff + ':' + _0x5ddab8, _0x5a3e59);
    this['requestRender']();
    return !![];
  }
  ['clearObjectVisualOverride'](_0x12b3dc, _0x210dc3) {
    const _0x1ee79d = String(_0x12b3dc || '')['trim']() + ':' + String(_0x210dc3 || '')["trim"]();
    const _0x5ac239 = this["_visualOverrides"]['delete'](_0x1ee79d);
    if (_0x5ac239) {
      this["requestRender"]();
    }
    return _0x5ac239;
  }
  ["clearDraftObjectTransform"](_0x1ed635, _0x3f040e) {
    this["_draftObjects"]["delete"](_0x1ed635 + ':' + _0x3f040e);
    this["requestRender"]();
  }
  ["setDraftMannequinBonePose"](_0x5efa74, _0x159d4c) {
    const _0x2f4d37 = String(_0x5efa74 || '')["trim"]();
    if (!_0x2f4d37) {
      return;
    }
    this["_draftMannequinBonePoses"]['set'](_0x2f4d37, _0x159d4c || {});
    const _0x4466f5 = this["_mannequinMap"]["get"](_0x2f4d37);
    _0x4466f5?.["modelRoot"] && _0x4466f5['baseBonePose'] && (applyPanoramaCharacterBonePose(_0x4466f5["modelRoot"], _0x159d4c, _0x4466f5['baseBonePose']), _0x4466f5['appliedBonePoseSignature'] = "draft:" + JSON["stringify"](_0x159d4c || {}));
    this["requestRender"]();
  }
  ["clearDraftMannequinBonePose"](_0x528743) {
    const _0xd30006 = String(_0x528743 || '')['trim']();
    this["_draftMannequinBonePoses"]["delete"](_0xd30006);
    const _0x1091a1 = this["_mannequinStateById"]["get"](_0xd30006);
    const _0x27ea30 = this["_mannequinMap"]["get"](_0xd30006);
    _0x1091a1 && _0x27ea30?.["modelRoot"] && _0x27ea30["baseBonePose"] && (applyPanoramaCharacterBonePose(_0x27ea30["modelRoot"], _0x1091a1["bonePose"], _0x27ea30["baseBonePose"]), _0x27ea30["appliedBonePoseSignature"] = JSON["stringify"](_0x1091a1['bonePose'] || {}));
    this["requestRender"]();
  }
  ["clearAllDrafts"]() {
    this["_draftView"] = null;
    this['_draftObjects']["clear"]();
    this["_draftMannequinBonePoses"]?.["clear"]?.();
    this['clearGizmoMoveGuideLine']();
    this["requestRender"]();
  }
  ["markViewSmoothingWindow"](_0x53df0 = VIEW_DAMPING_WINDOW_MS) {
    const _0x3fe740 = Math["max"](0x0, Number(_0x53df0) || VIEW_DAMPING_WINDOW_MS);
    const _0x1f892c = performance["now"]();
    this["_viewSmoothingUntil"] = Math["max"](this["_viewSmoothingUntil"] || 0x0, _0x1f892c + _0x3fe740);
  }
  ['readCurrentViewPose']() {
    const _0x449d76 = new a1172_0x3227df["Vector3"](0x0, 0x0, -0x1)["applyQuaternion"](this['camera']["quaternion"]);
    const _0x5ace66 = a1172_0x23fa98["readBridgePerspectiveFov"](this);
    return {
      'position': {
        'x': this["camera"]["position"]['x'],
        'y': this["camera"]["position"]['y'],
        'z': this["camera"]["position"]['z']
      },
      'rotation': {
        'x': this["camera"]['rotation']['x'],
        'y': this["camera"]["rotation"]['y'],
        'z': this['camera']["rotation"]['z']
      },
      'quaternion': {
        'x': this["camera"]['quaternion']['x'],
        'y': this["camera"]["quaternion"]['y'],
        'z': this["camera"]["quaternion"]['z'],
        'w': this['camera']['quaternion']['w']
      },
      'forward': {
        'x': _0x449d76['x'],
        'y': _0x449d76['y'],
        'z': _0x449d76['z']
      },
      'yaw': Math["atan2"](_0x449d76['x'], _0x449d76['z']),
      'pitch': Math["asin"](Math["max"](-0x1, Math["min"](0x1, _0x449d76['y']))),
      'fov': _0x5ace66,
      'focalLength': fovToFocalLength(_0x5ace66),
      'projection': this["readViewProjection"]()
    };
  }
  ["readObjectFrame"](_0x3cad81, _0x2261d4) {
    return readSceneObjectFrame({
      'objectType': _0x3cad81,
      'objectId': _0x2261d4,
      'cubeMap': this["_cubeMap"],
      'mannequinMap': this["_mannequinMap"],
      'cameraMap': this['_cameraMap'],
      'camera': this['camera']
    });
  }
  ["readSelectionFrame"]() {
    return readSceneSelectionFrame({
      'selectionObjects': collectSelectedObjects(this['_sceneState']),
      'cubeMap': this['_cubeMap'],
      'mannequinMap': this["_mannequinMap"],
      'cameraMap': this['_cameraMap'],
      'camera': this["camera"]
    });
  }
  ["_resolvePointerRay"](_0x47e95c, _0x492bbd) {
    const _0xd6d4b0 = this["renderer"]["domElement"]["getBoundingClientRect"]();
    const _0x1e9734 = new a1172_0x3227df['Vector2']((_0x47e95c - _0xd6d4b0["left"]) / _0xd6d4b0["width"] * 0x2 - 0x1, -((_0x492bbd - _0xd6d4b0['top']) / _0xd6d4b0["height"] * 0x2 - 0x1));
    const _0x2969fb = new a1172_0x3227df["Raycaster"]();
    _0x2969fb["setFromCamera"](_0x1e9734, this["camera"]);
    return _0x2969fb;
  }
  ["setGizmoHoverHandle"](_0x3343cf) {
    const _0x366fe0 = _0x3343cf || null;
    if ((this["_gizmo"]?.["hoverHandle"] || null) === _0x366fe0) {
      return;
    }
    this['_gizmo']["hoverHandle"] = _0x366fe0;
    this["_applyGizmoHighlight"]();
    this["requestRender"]();
  }
  ["setGizmoActiveHandle"](_0x3d2563) {
    const _0xfe0df6 = _0x3d2563 || null;
    const _0x29ef5c = _0xfe0df6 === null && this["_gizmo"]?.["dragLock"];
    if ((this["_gizmo"]?.["activeHandle"] || null) === _0xfe0df6 && !_0x29ef5c) {
      return;
    }
    this["_gizmo"]['activeHandle'] = _0xfe0df6;
    _0xfe0df6 === null && (this["_gizmo"]['dragLock'] = null);
    this["_applyGizmoHighlight"]();
    this["requestRender"]();
  }
  ["clearGizmoHandleState"]() {
    if (!this["_gizmo"]) {
      return;
    }
    const _0x1d9542 = this["_gizmo"]["hoverHandle"] || this["_gizmo"]['activeHandle'] || this["_gizmo"]['dragLock'];
    this['_gizmo']["hoverHandle"] = null;
    this["_gizmo"]['activeHandle'] = null;
    this['_gizmo']["dragLock"] = null;
    _0x1d9542 && (this["_applyGizmoHighlight"](), this["requestRender"]());
  }
  ['setGizmoMoveGuideLine']({
    from: _0x19540a,
    to: _0xa649d0
  } = {}) {
    const _0x174fd0 = this["_gizmoMoveGuideLine"];
    if (!_0x174fd0) {
      return;
    }
    const _0x217796 = toVector3Like(_0x19540a, {
      'x': 0x0,
      'y': 0x0,
      'z': 0x0
    });
    const _0x469ade = toVector3Like(_0xa649d0, _0x217796);
    setLineGeometryPoints(_0x174fd0, _0x217796, _0x469ade);
    _0x174fd0["visible"] = !![];
    this['requestRender']();
  }
  ["clearGizmoMoveGuideLine"]() {
    const _0x3369c2 = this["_gizmoMoveGuideLine"];
    if (!_0x3369c2?.["visible"]) {
      return;
    }
    _0x3369c2["visible"] = ![];
    this["requestRender"]();
  }
  ["_clearStableGizmoContext"]() {
    this["_lastStableGizmoSelectionSignature"] = '';
    this["_lastStableGizmoContext"] = null;
  }
  ["_cacheStableGizmoContext"](_0x401c94, _0x347e58) {
    const _0x3a3efd = buildTransformSelectionSignature(_0x401c94);
    if (!_0x3a3efd || !_0x347e58) {
      return;
    }
    this["_lastStableGizmoSelectionSignature"] = _0x3a3efd;
    this["_lastStableGizmoContext"] = cloneGizmoDisplayContext(_0x347e58);
  }
  ["_resolveStableGizmoContext"](_0x17bfb5) {
    const _0x240e40 = buildTransformSelectionSignature(_0x17bfb5);
    if (!_0x240e40) {
      return null;
    }
    if (_0x240e40 !== this["_lastStableGizmoSelectionSignature"]) {
      return null;
    }
    return this["_lastStableGizmoContext"] || null;
  }
  ["pickGizmoHandle"](_0x13b39c, _0x1a1934) {
    if (this["_isPanorama360Mode"]()) {
      return null;
    }
    if (!this['_gizmo']?.["root"]?.["visible"]) {
      return null;
    }
    const _0x211779 = this['_gizmo']?.["moveGroup"]?.["visible"] || this["_gizmo"]?.["rotateGroup"]?.["visible"] || this["_gizmo"]?.["scaleGroup"]?.["visible"];
    if (!_0x211779) {
      return null;
    }
    const _0x5c5a93 = Array["isArray"](this["_gizmo"]["pickMeshes"]) ? this["_gizmo"]["pickMeshes"] : [];
    if (_0x5c5a93['length'] === 0x0) {
      return null;
    }
    const _0x599d36 = this["_resolvePointerRay"](_0x13b39c, _0x1a1934);
    const _0xc11d00 = _0x599d36["intersectObjects"](_0x5c5a93, !![]);
    for (const _0x4eae3c of _0xc11d00) {
      let _0x12dbc8 = _0x4eae3c["object"];
      while (_0x12dbc8) {
        const _0x2e0ddb = _0x12dbc8['userData']?.['gizmoHandleKey'];
        if (_0x2e0ddb) {
          const _0x18b60e = this["_gizmo"]["handles"]?.['get']?.(_0x2e0ddb) || null;
          if (!_0x18b60e) {
            return null;
          }
          const _0x2651ab = this["_gizmo"]?.["currentTool"] || "move";
          const _0x368674 = _0x18b60e["mode"] === "scale-axis" || _0x18b60e["mode"] === "scale-plane" || _0x18b60e["mode"] === 'scale-uniform';
          const _0x223a03 = _0x2651ab === "move" && (_0x18b60e["mode"] === "axis" || _0x18b60e["mode"] === 'plane') || _0x2651ab === "rotate" && _0x18b60e["mode"] === 'rotate' || _0x2651ab === "scale" && _0x368674;
          if (!_0x223a03) {
            _0x12dbc8 = _0x12dbc8["parent"];
            continue;
          }
          return {
            'kind': 'gizmo-handle',
            'handleKey': _0x2e0ddb,
            'mode': _0x18b60e['mode'],
            'axis': _0x18b60e['axis'] || null,
            'normalAxis': _0x18b60e["normalAxis"] || null,
            'linkedAxes': Array["isArray"](_0x18b60e['linkedAxes']) ? [..._0x18b60e["linkedAxes"]] : [],
            'point': {
              'x': _0x4eae3c["point"]['x'],
              'y': _0x4eae3c["point"]['y'],
              'z': _0x4eae3c["point"]['z']
            }
          };
        }
        _0x12dbc8 = _0x12dbc8["parent"];
      }
    }
    return null;
  }
  ["beginMoveGizmoDrag"]({
    handleKey: _0x429a5c,
    clientX: _0x418575,
    clientY: _0x7ea9f9
  } = {}) {
    if (!_0x429a5c) {
      return null;
    }
    const _0x382c49 = this["_gizmo"]?.["handles"]?.["get"]?.(_0x429a5c);
    if (!_0x382c49) {
      return null;
    }
    const _0x4bf14a = this['_gizmo']['root']['position']["clone"]();
    const _0xf3763a = this["_gizmo"]["root"]["quaternion"]["clone"]();
    const _0x4c3148 = _0x382c49["mode"] === "axis" ? _0x382c49['axis'] : _0x382c49["normalAxis"];
    if (!_0x4c3148) {
      return null;
    }
    const _0x5ddb44 = vectorFromAxisName(_0x4c3148)["applyQuaternion"](_0xf3763a)["normalize"]();
    let _0x312e9b = _0x5ddb44["clone"]();
    if (_0x382c49['mode'] === "axis") {
      const _0x2e22e1 = this["camera"]["getWorldDirection"](new a1172_0x3227df['Vector3']())["normalize"]();
      const _0xbdbda6 = new a1172_0x3227df["Vector3"]()["crossVectors"](_0x2e22e1, _0x5ddb44);
      _0xbdbda6["lengthSq"]() < 0.00001 && (_0xbdbda6['copy'](new a1172_0x3227df["Vector3"](0x0, 0x1, 0x0)["cross"](_0x5ddb44)), _0xbdbda6["lengthSq"]() < 0.00001 && _0xbdbda6["copy"](new a1172_0x3227df["Vector3"](0x1, 0x0, 0x0)["cross"](_0x5ddb44)));
      _0x312e9b = new a1172_0x3227df["Vector3"]()["crossVectors"](_0x5ddb44, _0xbdbda6)["normalize"]();
    }
    _0x312e9b['lengthSq']() < 0.000001 && (_0x312e9b = new a1172_0x3227df["Vector3"](0x0, 0x1, 0x0));
    const _0x4dd58c = new a1172_0x3227df["Plane"]()["setFromNormalAndCoplanarPoint"](_0x312e9b, _0x4bf14a);
    const _0x208878 = this["_resolvePointerRay"](_0x418575, _0x7ea9f9);
    const _0x563593 = new a1172_0x3227df["Vector3"]();
    const _0x32cf90 = _0x208878["ray"]['intersectPlane'](_0x4dd58c, _0x563593);
    const _0x1135fd = _0x32cf90 ? _0x563593['clone']() : _0x4bf14a['clone']();
    return {
      'handleKey': _0x429a5c,
      'mode': _0x382c49["mode"],
      'constraint': _0x382c49["mode"] === 'axis' ? _0x382c49['axis'] : (_0x382c49['linkedAxes'] || [])["join"](''),
      'axisName': _0x382c49["mode"] === "axis" ? _0x382c49['axis'] : null,
      'axisWorld': _0x382c49["mode"] === "axis" ? _0x5ddb44["clone"]() : null,
      'axis': _0x382c49["mode"] === "axis" ? _0x5ddb44["clone"]() : null,
      'planeNormalWorld': _0x312e9b["clone"](),
      'planeNormal': _0x312e9b["clone"](),
      'pivot': _0x4bf14a["clone"](),
      'gizmoQuaternion': _0xf3763a["clone"](),
      'startPoint': _0x1135fd["clone"](),
      'dragPlane': _0x4dd58c
    };
  }
  ["beginRotateGizmoDrag"]({
    handleKey: _0x239b34,
    clientX: _0x2d7aa4,
    clientY: _0x3f0b33
  } = {}) {
    if (!_0x239b34) {
      return null;
    }
    const _0x68bdd0 = this["_gizmo"]?.['handles']?.['get']?.(_0x239b34);
    if (!_0x68bdd0 || _0x68bdd0["mode"] !== "rotate") {
      return null;
    }
    const _0x3a3873 = this["_resolveGizmoContext"](this['_sceneState']);
    if (!_0x3a3873) {
      return null;
    }
    const _0x27b642 = this["_gizmo"]["root"]["position"]["clone"]();
    const _0x5322e8 = this["_gizmo"]["root"]['quaternion']["clone"]();
    const _0x44f16a = vectorFromAxisName(_0x68bdd0["axis"])["applyQuaternion"](_0x5322e8)["normalize"]();
    const _0x1e8946 = new a1172_0x3227df["Plane"]()['setFromNormalAndCoplanarPoint'](_0x44f16a, _0x27b642);
    const _0x39a66f = this['_resolvePointerRay'](_0x2d7aa4, _0x3f0b33);
    const _0x2b0108 = new a1172_0x3227df['Vector3']();
    const _0x56d979 = _0x39a66f["ray"]["intersectPlane"](_0x1e8946, _0x2b0108);
    if (!_0x56d979) {
      return null;
    }
    this['_captureGizmoDragLock'](_0x3a3873);
    return {
      'handleKey': _0x239b34,
      'mode': "rotate",
      'constraint': _0x68bdd0["axis"],
      'axisName': _0x68bdd0["axis"],
      'axisWorld': _0x44f16a['clone'](),
      'axis': _0x44f16a['clone'](),
      'pivot': _0x27b642["clone"](),
      'gizmoQuaternion': _0x5322e8["clone"](),
      'dragPlane': _0x1e8946,
      'startPoint': _0x2b0108["clone"]()
    };
  }
  ["computeRotateGizmoAngle"](_0x26cd4d, _0x4f93ae) {
    if (!_0x26cd4d?.["startPoint"] || !_0x4f93ae) {
      return 0x0;
    }
    return computeSignedRotationDelta({
      'startPoint': {
        'x': _0x26cd4d["startPoint"]['x'],
        'y': _0x26cd4d["startPoint"]['y'],
        'z': _0x26cd4d["startPoint"]['z']
      },
      'currentPoint': _0x4f93ae,
      'pivot': {
        'x': _0x26cd4d["pivot"]['x'],
        'y': _0x26cd4d["pivot"]['y'],
        'z': _0x26cd4d['pivot']['z']
      },
      'axis': {
        'x': _0x26cd4d["axisWorld"]?.['x'] ?? _0x26cd4d["axis"]?.['x'],
        'y': _0x26cd4d["axisWorld"]?.['y'] ?? _0x26cd4d['axis']?.['y'],
        'z': _0x26cd4d["axisWorld"]?.['z'] ?? _0x26cd4d["axis"]?.['z']
      }
    });
  }
  ["beginScaleGizmoDrag"]({
    handleKey: _0x38d35c,
    clientX: _0x3d05d7,
    clientY: _0x1feb95
  } = {}) {
    if (!_0x38d35c) {
      return null;
    }
    const _0x22b41d = this['_gizmo']?.["handles"]?.["get"]?.(_0x38d35c);
    if (!_0x22b41d || _0x22b41d["mode"] !== "scale-axis" && _0x22b41d["mode"] !== "scale-plane" && _0x22b41d['mode'] !== "scale-uniform") {
      return null;
    }
    const _0x5e8356 = this["_resolveGizmoContext"](this["_sceneState"]);
    if (!_0x5e8356) {
      return null;
    }
    const _0x4443e1 = this["_gizmo"]["root"]["position"]['clone']();
    const _0x474ff2 = this['_gizmo']["root"]["quaternion"]["clone"]();
    const _0x5ce0f8 = this['_resolvePointerRay'](_0x3d05d7, _0x1feb95);
    if (_0x22b41d["mode"] === 'scale-plane' || _0x22b41d["mode"] === "scale-uniform") {
      const _0x7414f2 = this['camera']["getWorldDirection"](new a1172_0x3227df["Vector3"]())["normalize"]();
      const _0x36b6ca = new a1172_0x3227df["Plane"]()['setFromNormalAndCoplanarPoint'](_0x7414f2, _0x4443e1);
      const _0x506d3b = new a1172_0x3227df['Vector3']();
      const _0x15c431 = _0x5ce0f8["ray"]['intersectPlane'](_0x36b6ca, _0x506d3b);
      if (!_0x15c431) {
        return null;
      }
      this["_captureGizmoDragLock"](_0x5e8356);
      return {
        'handleKey': _0x38d35c,
        'mode': _0x22b41d["mode"],
        'constraint': _0x22b41d["mode"] === "scale-uniform" ? "xyz" : (_0x22b41d["linkedAxes"] || [])["join"](''),
        'linkedAxes': Array['isArray'](_0x22b41d["linkedAxes"]) ? [..._0x22b41d["linkedAxes"]] : [],
        'pivot': _0x4443e1["clone"](),
        'axisWorld': null,
        'gizmoQuaternion': _0x474ff2["clone"](),
        'dragPlane': _0x36b6ca,
        'startPoint': _0x506d3b["clone"](),
        'startClientX': Number(_0x3d05d7) || 0x0,
        'startClientY': Number(_0x1feb95) || 0x0,
        'referenceDistance': Math["max"](0.25, _0x506d3b["distanceTo"](_0x4443e1))
      };
    }
    const _0x329edd = vectorFromAxisName(_0x22b41d["axis"])["applyQuaternion"](_0x474ff2)['normalize']();
    const _0xcf4797 = this["camera"]["getWorldDirection"](new a1172_0x3227df["Vector3"]())["normalize"]();
    let _0x5aab14 = new a1172_0x3227df["Vector3"]()['crossVectors'](_0xcf4797, _0x329edd);
    _0x5aab14["lengthSq"]() < 0.00001 && (_0x5aab14 = new a1172_0x3227df["Vector3"](0x0, 0x1, 0x0)["cross"](_0x329edd), _0x5aab14["lengthSq"]() < 0.00001 && (_0x5aab14 = new a1172_0x3227df['Vector3'](0x1, 0x0, 0x0)["cross"](_0x329edd)));
    const _0x20f164 = new a1172_0x3227df["Vector3"]()['crossVectors'](_0x329edd, _0x5aab14)['normalize']();
    const _0x87efcd = new a1172_0x3227df["Plane"]()['setFromNormalAndCoplanarPoint'](_0x20f164, _0x4443e1);
    const _0x1724cf = new a1172_0x3227df["Vector3"]();
    const _0x41e925 = _0x5ce0f8["ray"]["intersectPlane"](_0x87efcd, _0x1724cf);
    if (!_0x41e925) {
      return null;
    }
    this["_captureGizmoDragLock"](_0x5e8356);
    const _0x3785c2 = Math["max"](0.35, Math["abs"](_0x1724cf['clone']()["sub"](_0x4443e1)["dot"](_0x329edd)), (Number(this["_gizmo"]?.["root"]?.["scale"]?.['x']) || 0x1) * 0.9);
    const _0x5ad4ff = resolveAxisScreenDragMetric({
      'pivot': _0x4443e1,
      'axisWorld': _0x329edd,
      'camera': this['camera'],
      'domElement': this["renderer"]?.["domElement"],
      'worldDistance': _0x3785c2
    });
    return {
      'handleKey': _0x38d35c,
      'mode': 'scale-axis',
      'constraint': _0x22b41d["axis"],
      'axisName': _0x22b41d['axis'],
      'axisWorld': _0x329edd["clone"](),
      'dragDirectionWorld': _0x329edd["clone"](),
      'axis': _0x329edd["clone"](),
      'pivot': _0x4443e1['clone'](),
      'planeNormalWorld': _0x20f164["clone"](),
      'gizmoQuaternion': _0x474ff2["clone"](),
      'dragPlane': _0x87efcd,
      'startPoint': _0x1724cf["clone"](),
      'startClientX': Number(_0x3d05d7) || 0x0,
      'startClientY': Number(_0x1feb95) || 0x0,
      'axisScreenDirection': _0x5ad4ff?.["axisScreenDirection"] || null,
      'screenReferencePixels': _0x5ad4ff?.["screenReferencePixels"] || null,
      'referenceDistance': _0x3785c2
    };
  }
  ["computeScaleGizmoFactor"](_0x451ece, _0x834995) {
    if (!_0x451ece?.["startPoint"] || !_0x834995) {
      return 0x1;
    }
    if (_0x451ece["mode"] === "scale-axis") {
      if (_0x451ece["axisScreenDirection"] && Number['isFinite'](Number(_0x834995['clientX'])) && Number['isFinite'](Number(_0x834995['clientY']))) {
        return computeAxisScaleFactorFromScreenDelta({
          'startX': _0x451ece['startClientX'],
          'startY': _0x451ece['startClientY'],
          'currentX': _0x834995["clientX"],
          'currentY': _0x834995["clientY"],
          'axisDirection': _0x451ece['axisScreenDirection'],
          'referencePixels': _0x451ece["screenReferencePixels"]
        });
      }
      return computeAxisScaleFactor({
        'startPoint': {
          'x': _0x451ece["startPoint"]['x'],
          'y': _0x451ece["startPoint"]['y'],
          'z': _0x451ece["startPoint"]['z']
        },
        'currentPoint': _0x834995,
        'pivot': {
          'x': _0x451ece["pivot"]['x'],
          'y': _0x451ece["pivot"]['y'],
          'z': _0x451ece['pivot']['z']
        },
        'axis': {
          'x': _0x451ece["axisWorld"]?.['x'] ?? _0x451ece['axis']?.['x'],
          'y': _0x451ece["axisWorld"]?.['y'] ?? _0x451ece['axis']?.['y'],
          'z': _0x451ece['axisWorld']?.['z'] ?? _0x451ece["axis"]?.['z']
        },
        'dragDirection': {
          'x': _0x451ece["dragDirectionWorld"]?.['x'] ?? _0x451ece["axisWorld"]?.['x'] ?? _0x451ece["axis"]?.['x'],
          'y': _0x451ece["dragDirectionWorld"]?.['y'] ?? _0x451ece['axisWorld']?.['y'] ?? _0x451ece["axis"]?.['y'],
          'z': _0x451ece["dragDirectionWorld"]?.['z'] ?? _0x451ece["axisWorld"]?.['z'] ?? _0x451ece["axis"]?.['z']
        },
        'referenceDistance': _0x451ece["referenceDistance"]
      });
    }
    if (_0x451ece["mode"] === "scale-uniform" && Number['isFinite'](Number(_0x834995['clientX'])) && Number["isFinite"](Number(_0x834995["clientY"]))) {
      const _0xf6337c = Number(_0x834995['clientX']) - Number(_0x451ece["startClientX"] || 0x0);
      const _0x5995b7 = Number(_0x451ece["startClientY"] || 0x0) - Number(_0x834995["clientY"]);
      return Math["max"](0.001, Math["exp"]((_0x5995b7 + _0xf6337c * 0.35) / 0xb4));
    }
    return computeUniformScaleFactor({
      'startPoint': {
        'x': _0x451ece["startPoint"]['x'],
        'y': _0x451ece["startPoint"]['y'],
        'z': _0x451ece['startPoint']['z']
      },
      'currentPoint': _0x834995,
      'pivot': {
        'x': _0x451ece["pivot"]['x'],
        'y': _0x451ece['pivot']['y'],
        'z': _0x451ece['pivot']['z']
      },
      'minDistance': _0x451ece['referenceDistance']
    });
  }
  ["sampleMoveGizmoDragPoint"](_0x5ce6d7, _0x29b525, _0x2801c0) {
    if (!_0x5ce6d7?.["dragPlane"]) {
      return null;
    }
    const _0xb89154 = this["_resolvePointerRay"](_0x29b525, _0x2801c0);
    const _0x2cce7b = new a1172_0x3227df["Vector3"]();
    const _0x40dbaf = _0xb89154["ray"]['intersectPlane'](_0x5ce6d7["dragPlane"], _0x2cce7b);
    if (!_0x40dbaf) {
      return null;
    }
    return {
      'x': _0x2cce7b['x'],
      'y': _0x2cce7b['y'],
      'z': _0x2cce7b['z'],
      'clientX': _0x29b525,
      'clientY': _0x2801c0
    };
  }
  ['computeMoveGizmoDelta'](_0x5c6448, _0x57aacc) {
    if (!_0x5c6448?.['startPoint'] || !_0x57aacc) {
      return null;
    }
    const _0x40a54f = computeConstrainedMoveDelta({
      'startPoint': {
        'x': _0x5c6448["startPoint"]['x'],
        'y': _0x5c6448["startPoint"]['y'],
        'z': _0x5c6448["startPoint"]['z']
      },
      'currentPoint': _0x57aacc,
      'axis': _0x5c6448?.["axisWorld"] ? {
        'x': _0x5c6448["axisWorld"]['x'],
        'y': _0x5c6448["axisWorld"]['y'],
        'z': _0x5c6448['axisWorld']['z']
      } : _0x5c6448?.["axis"] ? {
        'x': _0x5c6448["axis"]['x'],
        'y': _0x5c6448["axis"]['y'],
        'z': _0x5c6448['axis']['z']
      } : null,
      'planeNormal': {
        'x': _0x5c6448?.["planeNormalWorld"]?.['x'] ?? _0x5c6448?.["planeNormal"]?.['x'],
        'y': _0x5c6448?.['planeNormalWorld']?.['y'] ?? _0x5c6448?.["planeNormal"]?.['y'],
        'z': _0x5c6448?.["planeNormalWorld"]?.['z'] ?? _0x5c6448?.["planeNormal"]?.['z']
      },
      'mode': _0x5c6448['mode']
    });
    return _0x40a54f;
  }
  ["pick"](_0x5dc39a, _0x1be2ff) {
    if (this['_isPanorama360Mode']()) {
      return null;
    }
    if (!this["_pickRoots"]["length"]) {
      return null;
    }
    const _0x489718 = this["_resolvePointerRay"](_0x5dc39a, _0x1be2ff);
    const _0x37a363 = _0x489718['intersectObjects'](this['_pickRoots'], ![]);
    for (const _0x3bcc11 of _0x37a363) {
      let _0x4beb4c = _0x3bcc11['object'];
      while (_0x4beb4c) {
        const _0x5c50cf = this["_pickMap"]["get"](_0x4beb4c['id']);
        if (_0x5c50cf) {
          return {
            ..._0x5c50cf,
            'point': {
              'x': _0x3bcc11['point']['x'],
              'y': _0x3bcc11["point"]['y'],
              'z': _0x3bcc11["point"]['z']
            }
          };
        }
        _0x4beb4c = _0x4beb4c["parent"];
      }
    }
    return null;
  }
  ['pickObjectsInRect'](_0x200661) {
    if (this["_isPanorama360Mode"]()) {
      return [];
    }
    const _0x4b1d26 = this["renderer"]["domElement"]['getBoundingClientRect']();
    const _0x4c5c96 = [];
    const _0x305da3 = (_0x20764a, _0x3007f8) => {
      _0x20764a["forEach"]((_0x3c4a61, _0x208c89) => {
        const _0x28a89b = new a1172_0x3227df["Vector3"]();
        _0x3c4a61["group"]["getWorldPosition"](_0x28a89b);
        const _0x47c46f = _0x28a89b["clone"]()['project'](this['camera']);
        if (_0x47c46f['x'] < -0x1 || _0x47c46f['x'] > 0x1 || _0x47c46f['y'] < -0x1 || _0x47c46f['y'] > 0x1 || _0x47c46f['z'] < -0x1 || _0x47c46f['z'] > 0x1) {
          return;
        }
        const _0x26856a = _0x4b1d26["left"] + (_0x47c46f['x'] + 0x1) * 0.5 * _0x4b1d26["width"];
        const _0x6b6e06 = _0x4b1d26["top"] + (0x1 - _0x47c46f['y']) * 0.5 * _0x4b1d26["height"];
        _0x26856a >= _0x200661["left"] && _0x26856a <= _0x200661["right"] && _0x6b6e06 >= _0x200661["top"] && _0x6b6e06 <= _0x200661['bottom'] && _0x4c5c96['push']({
          'objectType': _0x3007f8,
          'objectId': _0x208c89,
          'depth': _0x47c46f['z']
        });
      });
    };
    _0x305da3(this["_mannequinMap"], "mannequin");
    _0x305da3(this["_cubeMap"], "cube");
    _0x305da3(this["_cameraMap"], 'camera');
    _0x4c5c96['sort']((_0x14aed5, _0x3548ae) => _0x14aed5["depth"] - _0x3548ae['depth']);
    return _0x4c5c96;
  }
  ["resolveDollyAnchor"](_0x2e3edb, _0x5bc074) {
    if (this['_isPanorama360Mode']()) {
      return null;
    }
    const _0x3420a2 = this["_draftView"]?.['kind'] === 'scene-default' ? this["_draftView"]["sceneView"] : this["_sceneState"]?.['viewport']?.["sceneView"];
    return resolvePointerDollyAnchor({
      'raycaster': this["_resolvePointerRay"](_0x2e3edb, _0x5bc074),
      'pickRoots': this["_pickRoots"],
      'sceneView': _0x3420a2,
      'camera': this['camera']
    });
  }
  ["intersectGround"](_0x4ea959, _0xe6b7ce, _0x3a3760 = 0x0) {
    if (this["_isPanorama360Mode"]()) {
      return null;
    }
    const _0x2971ad = this["_resolvePointerRay"](_0x4ea959, _0xe6b7ce);
    const _0x32c00d = new a1172_0x3227df["Plane"](new a1172_0x3227df["Vector3"](0x0, 0x1, 0x0), -_0x3a3760);
    const _0x2e9788 = new a1172_0x3227df["Vector3"]();
    const _0x5dd9d3 = _0x2971ad["ray"]["intersectPlane"](_0x32c00d, _0x2e9788);
    if (!_0x5dd9d3) {
      return null;
    }
    return {
      'x': _0x2e9788['x'],
      'y': _0x2e9788['y'],
      'z': _0x2e9788['z']
    };
  }
  async ['_withCleanCaptureFrame'](_0x6be9b8) {
    const _0x51df7d = [this['_gizmo']?.["root"], this["_gizmoMoveGuideLine"], ...Array["from"](this['_cameraMap']["values"]())['map'](_0x239ecb => _0x239ecb?.['group'])]['filter'](Boolean);
    const _0x31d71f = _0x51df7d["map"](_0x56c8d0 => ({
      'object3d': _0x56c8d0,
      'visible': _0x56c8d0['visible']
    }));
    const _0x56ee80 = [];
    const _0x2b7f00 = _0x48edcd => {
      if (!_0x48edcd || _0x56ee80["some"](_0x56e525 => _0x56e525["material"] === _0x48edcd)) {
        return;
      }
      _0x56ee80["push"]({
        'material': _0x48edcd,
        'emissive': _0x48edcd["emissive"]?.['isColor'] ? _0x48edcd["emissive"]["clone"]() : undefined,
        'emissiveIntensity': typeof _0x48edcd["emissiveIntensity"] === "number" ? _0x48edcd['emissiveIntensity'] : undefined,
        'opacity': typeof _0x48edcd["opacity"] === "number" ? _0x48edcd["opacity"] : undefined
      });
    };
    this["_mannequinMap"]['forEach'](_0x39eb9d => {
      _0x39eb9d?.['group']?.['traverse']?.(_0x4f8400 => eachMaterial(_0x4f8400["material"], _0x2b7f00));
    });
    this["_cubeMap"]["forEach"](_0x13281c => {
      _0x13281c?.["group"]?.["traverse"]?.(_0x10d829 => eachMaterial(_0x10d829["material"], _0x2b7f00));
    });
    _0x31d71f["forEach"](({
      object3d: _0x47eeda
    }) => {
      _0x47eeda["visible"] = ![];
    });
    this['_mannequinMap']["forEach"](_0x2c25b1 => applyObjectSelectionEmphasis(_0x2c25b1?.["group"], ![]));
    this["_cubeMap"]["forEach"](_0x58cf42 => applyObjectSelectionEmphasis(_0x58cf42?.["group"], ![]));
    try {
      return await _0x6be9b8();
    } finally {
      _0x31d71f["forEach"](({
        object3d: _0x1094ad,
        visible: _0x348f78
      }) => {
        _0x1094ad['visible'] = _0x348f78;
      });
      _0x56ee80['forEach'](({
        material: _0x5118c8,
        emissive: _0x276c65,
        emissiveIntensity: _0x1f53ca,
        opacity: _0x5c9347
      }) => {
        _0x276c65?.["isColor"] && _0x5118c8["emissive"]?.["isColor"] && _0x5118c8["emissive"]["copy"](_0x276c65);
        typeof _0x1f53ca === "number" && (_0x5118c8["emissiveIntensity"] = _0x1f53ca);
        typeof _0x5c9347 === "number" && (_0x5118c8['opacity'] = _0x5c9347);
        _0x5118c8["needsUpdate"] = !![];
      });
      this["requestRender"]();
    }
  }
  ['captureBlob']({
    includeEditorOverlays = !![]
  } = {}) {
    const _0x3ea060 = () => new Promise((_0x6e526b, _0x480733) => {
      this['renderNow']();
      const _0x5e1aa2 = this["renderer"]["domElement"];
      if (typeof _0x5e1aa2["toBlob"] === 'function') {
        _0x5e1aa2["toBlob"](_0x241d6f => {
          if (!_0x241d6f) {
            _0x480733(new Error(panoramaSceneText('errors.captureExportFailed')));
            return;
          }
          _0x6e526b(_0x241d6f);
        }, "image/png");
        return;
      }
      try {
        const _0x4edddf = _0x5e1aa2["toDataURL"]("image/png");
        const [, _0x368d18] = _0x4edddf["split"](',');
        const _0x1eb5c9 = _0x4edddf["slice"](_0x4edddf["indexOf"](':') + 0x1, _0x4edddf["indexOf"](';'));
        const _0x3c9adc = atob(_0x368d18 || '');
        const _0x5af5e5 = new Uint8Array(_0x3c9adc["length"]);
        for (let _0x25bb91 = 0x0; _0x25bb91 < _0x3c9adc["length"]; _0x25bb91 += 0x1) {
          _0x5af5e5[_0x25bb91] = _0x3c9adc["charCodeAt"](_0x25bb91);
        }
        _0x6e526b(new Blob([_0x5af5e5], {
          'type': _0x1eb5c9 || "image/png"
        }));
      } catch (_0x41247a) {
        _0x480733(_0x41247a);
      }
    });
    if (includeEditorOverlays === ![]) {
      return this["_withCleanCaptureFrame"](_0x3ea060);
    }
    return _0x3ea060();
  }
  ['sync'](_0x717b23) {
    this["_sceneState"] = _0x717b23;
    this["_sceneContentExtent"] = estimateSceneContentExtent(_0x717b23);
    this["_sceneContentBounds"] = estimateSceneContentBounds(_0x717b23);
    const _0x57697b = this["_isPanorama360Mode"](_0x717b23);
    this["_syncEnvironment"](_0x717b23?.["environmentMode"]);
    this["_syncPanorama"](_0x717b23?.["panorama"]);
    this["_syncMannequins"](_0x717b23, _0x57697b);
    this["_syncCubes"](_0x717b23, _0x57697b);
    this['_syncCameras'](_0x717b23, _0x57697b);
    this["_syncGizmo"](_0x717b23, _0x57697b);
    this["_syncPanoramaModeVisibility"](_0x57697b);
    this["_syncPanoramaCanvasVisibility"](_0x57697b);
    this['requestRender']();
  }
  ['requestRender']() {
    if (this["_rafId"] !== null) {
      return;
    }
    this["_rafId"] = requestAnimationFrame(() => {
      this["_rafId"] = null;
      this['renderNow']();
    });
  }
  ["renderNow"]() {
    if (!this['_sceneState']) {
      this["renderer"]['render'](this["scene"], this["camera"]);
      return;
    }
    const _0x47d703 = this["_isPanorama360Mode"](this["_sceneState"]);
    const _0x1ea58d = this["_applyRenderView"]();
    !_0x47d703 && this['_syncInfiniteGrid']();
    this["_applyDraftObjects"]();
    !_0x47d703 && this["_applyGizmoPosition"]();
    this['renderer']["render"](this["scene"], this["camera"]);
    _0x1ea58d?.["keepAnimating"] && this["requestRender"]();
  }
  ["dispose"]() {
    this["_rafId"] !== null && (cancelAnimationFrame(this["_rafId"]), this["_rafId"] = null);
    this["_panoramaLoadToken"] += 0x1;
    this["_abortPanoramaTextureLoad"]();
    this["_cancelPanoramaFullLoad"]();
    this["_smoothedPose"] = null;
    this["_lastRenderTime"] = 0x0;
    this["_viewSmoothingUntil"] = 0x0;
    this['_mannequinMap']["forEach"](_0x22b420 => {
      this['scene']["remove"](_0x22b420["group"]);
      disposeObject3D(_0x22b420["group"]);
    });
    this['_cubeMap']["forEach"](_0xd6e15f => {
      this["scene"]['remove'](_0xd6e15f["group"]);
      disposeObject3D(_0xd6e15f['group']);
    });
    this['_cameraMap']["forEach"](_0x4e5ffb => {
      this['scene']["remove"](_0x4e5ffb['group']);
      disposeObject3D(_0x4e5ffb['group']);
    });
    this["_mannequinMap"]["clear"]();
    this['_mannequinStateById']["clear"]();
    this["_draftMannequinBonePoses"]['clear']();
    this["_cubeMap"]["clear"]();
    this["_cubeStateById"]["clear"]();
    this["_cameraMap"]['clear']();
    this["_cameraStateById"]["clear"]();
    this["_visualOverrides"]["clear"]();
    this['_pickMap']["clear"]();
    this["_pickRoots"] = [];
    this["_clearStableGizmoContext"]();
    this['scene']["remove"](this["_gizmo"]["root"]);
    disposeObject3D(this["_gizmo"]["root"]);
    this['_panoramaTexture'] && (this["_panoramaTexture"]["dispose"](), this["_panoramaTexture"] = null);
    disposeObject3D(this["_panoramaSphere"]);
    disposeObject3D(this['_ground']);
    disposeObject3D(this["_gridMinor"]);
    disposeObject3D(this['_gridMajor']);
    this["scene"]["clear"]();
    this["renderer"]["dispose"]();
    this["renderer"]["forceContextLoss"]?.();
    this["renderer"]['domElement']['remove']();
  }
  ["_syncEnvironment"](_0x25b394) {
    const _0x3a07cf = _0x25b394 === "night";
    const _0x403ab0 = resolveThemeColor(_0x3a07cf ? "--panorama-scene-fog-night" : "--panorama-scene-fog-day", _0x3a07cf ? "--panorama-scene-fog-night" : '--panorama-scene-fog-day');
    this["scene"]["background"] = null;
    this['renderer']["setClearColor"](0x0, 0x0);
    this["scene"]["fog"] = this["_isPanorama360Mode"](this['_sceneState']) ? null : new a1172_0x3227df["Fog"](_0x403ab0, _0x3a07cf ? 0x2e : 0x3a, _0x3a07cf ? 0x8a : 0xaa);
    this["_ambientLight"]["intensity"] = _0x3a07cf ? 0.56 : 0.94;
    this["_keyLight"]['intensity'] = _0x3a07cf ? 0.72 : 1.12;
    this["_rimLight"]["intensity"] = _0x3a07cf ? 0.2 : 0.16;
    eachMaterial(this["_gridMinor"]["material"], _0x5498df => {
      _0x5498df["opacity"] = _0x3a07cf ? 0.28 : 0.24;
      _0x5498df['color']["copy"](resolveThemeColor(_0x3a07cf ? '--panorama-scene-grid-night' : "--panorama-scene-grid-day", _0x3a07cf ? "--indigo-35" : '--black-20'));
      _0x5498df["needsUpdate"] = !![];
    });
    eachMaterial(this["_gridMajor"]["material"], _0x353f46 => {
      _0x353f46['opacity'] = _0x3a07cf ? 0.52 : 0.42;
      _0x353f46['color']['copy'](resolveThemeColor(_0x3a07cf ? "--panorama-scene-grid-night-major" : "--panorama-scene-grid-day-major", _0x3a07cf ? "--indigo-35" : "--black-20"));
      _0x353f46["needsUpdate"] = !![];
    });
    this["_ground"]['material']["opacity"] = _0x3a07cf ? 0.96 : 0.92;
    this["_ground"]["material"]["color"] = resolveThemeColor(_0x3a07cf ? "--panorama-scene-ground-night" : "--panorama-scene-ground-day", _0x3a07cf ? "--indigo-12" : "--black-10");
    this["_ground"]["material"]['needsUpdate'] = !![];
  }
  ["_syncPanoramaModeVisibility"](_0x4c4d9e) {
    this['_gridMinor']["visible"] = this['_gridVisible'] !== ![] && !_0x4c4d9e;
    this['_gridMajor']["visible"] = this['_gridVisible'] !== ![] && !_0x4c4d9e;
    this["_ground"]["visible"] = this["_groundFillVisible"] !== ![] && !_0x4c4d9e;
    if (!_0x4c4d9e) {
      return;
    }
    this["_gizmo"]["root"]["visible"] = ![];
    this["clearGizmoHandleState"]();
    this['_mannequinMap']['forEach'](_0x5d6d91 => {
      _0x5d6d91['group']["visible"] = ![];
      _0x5d6d91['selectionRing']["visible"] = ![];
    });
    this["_cubeMap"]["forEach"](_0x589ae => {
      _0x589ae['group']["visible"] = ![];
      _0x589ae["selectionRing"]["visible"] = ![];
    });
    this["_cameraMap"]["forEach"](_0x59e3a4 => {
      _0x59e3a4["group"]["visible"] = ![];
    });
    this["_panoramaSphere"]['visible'] = Boolean(this["_panoramaSphere"]['material']?.["map"]);
  }
  ["_syncPanoramaCanvasVisibility"](_0x59caef = this['_isPanorama360Mode'](this["_sceneState"])) {
    const _0x7ce326 = this["renderer"]?.["domElement"];
    if (!_0x7ce326) {
      return;
    }
    const _0x49cb3c = Boolean(this['_panoramaSphere']?.['material']?.["map"]);
    const _0x1d0bdd = _0x59caef && !_0x49cb3c;
    _0x7ce326["style"]['opacity'] = _0x1d0bdd ? '0' : '1';
    _0x7ce326["style"]["background"] = "transparent";
    _0x7ce326["dataset"]["panoramaEmpty"] = _0x1d0bdd ? '1' : '0';
  }
  ["_syncInfiniteGrid"]() {
    const _0x3c378b = Number(this["camera"]?.["position"]?.['x']) || 0x0;
    const _0x27c9b3 = Number(this["camera"]?.['position']?.['z']) || 0x0;
    const _0xe0ecf4 = computeStableGridSnap(_0x3c378b, GRID_MINOR_STEP, this["_gridSnapState"]["minorX"], GRID_SNAP_HYSTERESIS);
    const _0x32ef10 = computeStableGridSnap(_0x27c9b3, GRID_MINOR_STEP, this['_gridSnapState']['minorZ'], GRID_SNAP_HYSTERESIS);
    const _0x2cc5d0 = computeStableGridSnap(_0x3c378b, GRID_MAJOR_STEP, this["_gridSnapState"]["majorX"], GRID_SNAP_HYSTERESIS);
    const _0x222b86 = computeStableGridSnap(_0x27c9b3, GRID_MAJOR_STEP, this["_gridSnapState"]["majorZ"], GRID_SNAP_HYSTERESIS);
    this["_gridSnapState"]["minorX"] = _0xe0ecf4;
    this["_gridSnapState"]["minorZ"] = _0x32ef10;
    this["_gridSnapState"]["majorX"] = _0x2cc5d0;
    this["_gridSnapState"]["majorZ"] = _0x222b86;
    this["_gridMinor"]["position"]["set"](_0xe0ecf4, 0x0, _0x32ef10);
    this["_gridMajor"]['position']["set"](_0x2cc5d0, 0.0002, _0x222b86);
    const _0x24141a = Number(this["_renderPose"]?.["distance"]) || 0x0;
    const _0x5853e5 = Math['max'](GRID_BASE_SPAN, Math["abs"](Number(this["camera"]?.["position"]?.['y']) || 0x0) * 0x1a, _0x24141a * 0x1c);
    this['_ground']['position']['set'](_0x2cc5d0, -0.001, _0x222b86);
    this['_ground']["scale"]['set'](_0x5853e5, _0x5853e5, 0x1);
    const _0x155361 = this["_sceneState"]?.["environmentMode"] === "night";
    const _0x5c67df = _0x155361 ? 0.28 : 0.24;
    const _0x1f4c1d = _0x155361 ? 0.52 : 0.42;
    const _0x5f3914 = Math["abs"](Number['isFinite'](this["_renderPose"]?.['pitch']) ? this["_renderPose"]["pitch"] : Number(this["camera"]?.["rotation"]?.['x']) || 0x0);
    const _0xb5ff47 = clamp01((_0x5f3914 - 0.08) / 0.32);
    const _0x27a473 = 0.18 + 0.82 * _0xb5ff47;
    const _0x238e35 = clamp01((_0x24141a - 0x8) / 0x1a);
    const _0x2ae453 = 0x1 - 0.52 * _0x238e35;
    const _0x3119e4 = _0x27a473 * _0x2ae453;
    const _0x19b2aa = _0x5c67df * _0x3119e4;
    const _0xfc9f4f = _0x1f4c1d * (0.32 + 0.68 * _0x3119e4);
    eachMaterial(this["_gridMinor"]['material'], _0x2ebb2c => {
      _0x2ebb2c['opacity'] = _0x19b2aa;
    });
    eachMaterial(this["_gridMajor"]["material"], _0xa4df04 => {
      _0xa4df04["opacity"] = _0xfc9f4f;
    });
  }
  ['_syncPanorama'](_0x3d73b2) {
    const _0x2fe144 = normalizePanoramaTextureUrl(_0x3d73b2?.['imageUrl'], _0x3d73b2?.["localPath"]);
    const _0x57d947 = normalizePanoramaTextureUrl(_0x3d73b2?.['previewImageUrl'], null);
    const _0x281c93 = _0x2fe144 || _0x57d947;
    if (!_0x281c93) {
      this['_panoramaLoadToken'] += 0x1;
      this["_abortPanoramaTextureLoad"]();
      this['_cancelPanoramaFullLoad']();
      this['_panoramaSourceKey'] = '';
      this["_loadedPanoramaUrl"] = '';
      this["_pendingPanoramaUrl"] = '';
      this['_panoramaTexture'] && (this["_panoramaTexture"]["dispose"](), this["_panoramaTexture"] = null);
      this["_panoramaSphere"]["material"]["map"] = null;
      this["_panoramaSphere"]["material"]["needsUpdate"] = !![];
      this["_panoramaSphere"]["visible"] = ![];
      this["_syncPanoramaCanvasVisibility"]();
      return;
    }
    const _0x432f77 = _0x57d947 + '\x0a' + _0x2fe144;
    _0x432f77 !== this["_panoramaSourceKey"] && (this['_panoramaSourceKey'] = _0x432f77, this["_panoramaLoadToken"] += 0x1, this['_abortPanoramaTextureLoad'](), this['_pendingPanoramaUrl'] = '', this["_cancelPanoramaFullLoad"]());
    const _0x18d646 = this["_panoramaLoadToken"];
    const _0x10368f = Boolean(_0x57d947 && _0x57d947 !== _0x2fe144);
    if (_0x2fe144 && _0x2fe144 === this["_loadedPanoramaUrl"]) {
      return;
    }
    if (_0x10368f) {
      if (_0x57d947 === this["_loadedPanoramaUrl"]) {
        this['_schedulePanoramaFullLoad'](_0x2fe144, _0x18d646);
        return;
      }
      if (_0x57d947 === this['_pendingPanoramaUrl'] || _0x2fe144 === this["_pendingPanoramaUrl"]) {
        return;
      }
      this["_loadPanoramaTexture"](_0x57d947, {
        'token': _0x18d646,
        'isPreview': !![],
        'fullUrl': _0x2fe144
      });
      return;
    }
    if (_0x281c93 === this["_loadedPanoramaUrl"] || _0x281c93 === this["_pendingPanoramaUrl"]) {
      return;
    }
    this["_loadPanoramaTexture"](_0x281c93, {
      'token': _0x18d646,
      'isPreview': Boolean(_0x57d947),
      'fullUrl': ''
    });
  }
  ['_loadPanoramaTexture'](_0x2b86e4, {
    token: _0x38e13c,
    isPreview = ![],
    fullUrl = ''
  } = {}) {
    return loadPanoramaBridgeTexture(this, _0x2b86e4, {
      'token': _0x38e13c,
      'isPreview': isPreview,
      'fullUrl': fullUrl
    });
  }
  ["_abortPanoramaTextureLoad"]() {
    abortPanoramaTextureLoad(this);
  }
  ["_schedulePanoramaFullLoad"](_0x3114fc, _0x2ea216) {
    schedulePanoramaFullLoad(this, _0x3114fc, _0x2ea216);
  }
  ["_cancelPanoramaFullLoad"]() {
    cancelPanoramaFullLoad(this);
  }
  ['_resolveMannequinColor'](_0x16c580) {
    const _0x222f54 = PANORAMA_SCENE_COLOR_TOKENS[_0x16c580] || PANORAMA_SCENE_COLOR_TOKENS["blue"];
    return /^#[0-9a-f]{6}$/i["test"](String(_0x16c580 || '')["trim"]()) ? new a1172_0x3227df["Color"](_0x16c580) : resolveThemeColor(_0x222f54, '--blue');
  }
  ["_registerPickable"](_0xf31399, _0x1caa67) {
    const _0x3bff95 = (_0x50ccee, _0x163259 = !![]) => {
      if (!_0x50ccee) {
        return;
      }
      const _0x5cfc00 = _0x163259 && _0x50ccee['visible'] !== ![];
      if (!_0x5cfc00) {
        return;
      }
      _0x50ccee["isMesh"] === !![] && (this["_pickMap"]['set'](_0x50ccee['id'], _0x1caa67), this["_pickRoots"]["push"](_0x50ccee));
      for (const _0x407c1c of _0x50ccee["children"] || []) {
        _0x3bff95(_0x407c1c, _0x5cfc00);
      }
    };
    _0x3bff95(_0xf31399);
  }
  ["_rebuildPickRoots"]() {
    this["_pickMap"]["clear"]();
    this['_pickRoots'] = [];
    this["_mannequinMap"]["forEach"]((_0x52668a, _0x3dbfb5) => {
      this["_registerPickable"](_0x52668a['proxyRoot'] || _0x52668a['group'], {
        'objectType': 'mannequin',
        'objectId': _0x3dbfb5
      });
    });
    this["_cubeMap"]["forEach"]((_0x1c2c3f, _0xa58816) => {
      this["_registerPickable"](_0x1c2c3f["group"], {
        'objectType': "cube",
        'objectId': _0xa58816
      });
    });
    this["_cameraMap"]?.["forEach"]((_0x2c495f, _0x16099d) => {
      this["_registerPickable"](_0x2c495f["group"], {
        'objectType': "camera",
        'objectId': _0x16099d
      });
    });
  }
  ["_loadCharacterModelForVisual"](_0x3413e3, _0x2cb683, _0x22531a) {
    if (!_0x3413e3) {
      return;
    }
    const _0x60a04 = resolvePanoramaCharacterGender(_0x22531a);
    const _0x104463 = (_0x3413e3["modelLoadToken"] || 0x0) + 0x1;
    _0x3413e3["modelLoadToken"] = _0x104463;
    _0x3413e3["modelGender"] = _0x60a04;
    _0x3413e3["modelLoadError"] = null;
    setMannequinProxyMode(_0x3413e3);
    _0x3413e3["modelStyle"] = this["_mannequinStateById"]["get"](_0x2cb683)?.['characterStyle'] || "anatomical";
    createPanoramaCharacterModelInstance(_0x60a04, {
      'style': _0x3413e3['modelStyle']
    })['then'](_0x42fa25 => {
      if (this["_mannequinMap"]["get"](_0x2cb683) !== _0x3413e3 || _0x3413e3["modelLoadToken"] !== _0x104463) {
        disposeObject3D(_0x42fa25);
        return;
      }
      _0x3413e3['modelRoot'] && (_0x3413e3["group"]["remove"](_0x3413e3["modelRoot"]), disposeObject3D(_0x3413e3["modelRoot"]));
      _0x3413e3['modelMaterial'] = null;
      _0x3413e3["modelRoot"] = _0x42fa25;
      _0x3413e3["modelBodyProfileBase"] = captureCharacterModelBodyProfileBase(_0x42fa25);
      _0x3413e3["group"]['add'](_0x42fa25);
      const _0x555ab3 = this["_mannequinStateById"]["get"](_0x2cb683) || {};
      _0x3413e3["baseBonePose"] = capturePanoramaCharacterBoneBase(_0x42fa25);
      _0x3413e3["appliedBonePoseSignature"] = JSON['stringify'](_0x555ab3['bonePose'] || {});
      applyPanoramaCharacterBonePose(_0x42fa25, this["_draftMannequinBonePoses"]?.["get"](_0x2cb683) || _0x555ab3["bonePose"], _0x3413e3['baseBonePose']);
      const _0x369a0a = _0x555ab3["colorKey"];
      applyCharacterClayMaterial(_0x3413e3, this["_resolveMannequinColor"](_0x369a0a));
      applyCharacterBodyProfile(_0x3413e3, _0x555ab3["bodyProfile"]);
      setMannequinProxyMode(_0x3413e3);
      this["_rebuildPickRoots"]();
      if (typeof requestAnimationFrame === "function") {
        this["requestRender"]();
      }
    })["catch"](_0x4f378d => {
      if (this['_mannequinMap']['get'](_0x2cb683) !== _0x3413e3 || _0x3413e3['modelLoadToken'] !== _0x104463) {
        return;
      }
      _0x3413e3['modelLoadError'] = _0x4f378d || new Error("Quaternius character model failed to load");
      _0x3413e3["modelRoot"] && (_0x3413e3["group"]["remove"](_0x3413e3["modelRoot"]), disposeObject3D(_0x3413e3["modelRoot"]), _0x3413e3['modelRoot'] = null);
      _0x3413e3["modelMaterial"] = null;
      _0x3413e3['modelBodyProfileBase'] = null;
      setMannequinProxyMode(_0x3413e3);
      if (typeof requestAnimationFrame === "function") {
        this['requestRender']();
      }
    });
  }
  ["_syncMannequins"](_0x28bca4, _0x4738bb = ![]) {
    const _0x3924a6 = _0x28bca4?.['mannequins'] || [];
    const _0x412672 = new Set(collectSelectedObjectIds(_0x28bca4, 'mannequin'));
    const _0x48b2b4 = !_0x4738bb;
    const _0x33b886 = new Set();
    _0x3924a6["forEach"](_0x2bc375 => {
      _0x33b886["add"](_0x2bc375['id']);
      this["_mannequinStateById"]['set'](_0x2bc375['id'], _0x2bc375);
      let _0x28aafb = this['_mannequinMap']["get"](_0x2bc375['id']);
      if (!_0x28aafb) {
        _0x28aafb = createMannequinVisual(this["_resolveMannequinColor"](_0x2bc375["colorKey"]));
        this["_mannequinMap"]["set"](_0x2bc375['id'], _0x28aafb);
        this['scene']["add"](_0x28aafb["group"]);
        this['_loadCharacterModelForVisual'](_0x28aafb, _0x2bc375['id'], _0x2bc375['gender']);
      } else {
        (_0x28aafb["modelGender"] !== resolvePanoramaCharacterGender(_0x2bc375["gender"]) || _0x28aafb["modelStyle"] !== (_0x2bc375["characterStyle"] || 'anatomical')) && (_0x28aafb['modelRoot'] && (_0x28aafb["group"]["remove"](_0x28aafb['modelRoot']), disposeObject3D(_0x28aafb["modelRoot"]), _0x28aafb["modelRoot"] = null), _0x28aafb["modelBodyProfileBase"] = null, this["_loadCharacterModelForVisual"](_0x28aafb, _0x2bc375['id'], _0x2bc375["gender"]));
      }
      const _0x37218c = this['_resolveMannequinColor'](_0x2bc375["colorKey"]);
      _0x28aafb["material"]["color"]["copy"](_0x37218c);
      _0x28aafb["headMaterial"]["color"]["copy"](_0x37218c["clone"]()["offsetHSL"](0x0, 0x0, 0.08));
      applyGenderShape(_0x28aafb, _0x2bc375["gender"]);
      applyCharacterBodyProfile(_0x28aafb, _0x2bc375["bodyProfile"]);
      const _0x374cc5 = this["_draftMannequinBonePoses"]?.["get"]?.(_0x2bc375['id']);
      const _0x4a1f0f = _0x374cc5 || _0x2bc375["bonePose"] || {};
      const _0x2b397d = _0x374cc5 ? "draft:" + JSON["stringify"](_0x4a1f0f) : JSON["stringify"](_0x4a1f0f);
      _0x28aafb["modelRoot"] && _0x28aafb["baseBonePose"] && _0x28aafb['appliedBonePoseSignature'] !== _0x2b397d && (applyPanoramaCharacterBonePose(_0x28aafb["modelRoot"], _0x4a1f0f, _0x28aafb['baseBonePose']), _0x28aafb["appliedBonePoseSignature"] = _0x2b397d);
      const _0x251acb = this["_draftObjects"]['get']('mannequin:' + _0x2bc375['id']);
      applyGroupTransform(_0x28aafb["group"], _0x251acb || _0x2bc375);
      _0x28aafb["group"]["position"]['y'] = _0x251acb?.["position"]?.['y'] ?? _0x2bc375["position"]['y'] ?? 0x0;
      applyGroupScale(_0x28aafb['group'], _0x251acb?.['scale'] ?? _0x2bc375['scale'] ?? 0x1);
      const _0x12d5c7 = _0x48b2b4 && _0x28bca4?.['ui']?.["isEditing"] === !![] && _0x28bca4?.['ui']?.["showOutline"] !== ![] && _0x412672["has"](_0x2bc375['id']);
      _0x28aafb["group"]["visible"] = _0x48b2b4;
      _0x28aafb["selectionRing"]['visible'] = ![];
      setMannequinProxyMode(_0x28aafb);
      applyCharacterClayMaterial(_0x28aafb, _0x37218c);
      applySelectionEmphasis(_0x28aafb['material'], _0x12d5c7, 0.18);
      applySelectionEmphasis(_0x28aafb["headMaterial"], _0x12d5c7, 0.26);
      applyObjectSelectionEmphasis(_0x28aafb["modelRoot"], _0x12d5c7, 0.12);
    });
    for (const [_0x2ee23c, _0x2a054b] of this['_mannequinMap']["entries"]()) {
      if (_0x33b886['has'](_0x2ee23c)) {
        continue;
      }
      this["scene"]["remove"](_0x2a054b["group"]);
      disposeObject3D(_0x2a054b['group']);
      this['_mannequinMap']["delete"](_0x2ee23c);
      this['_mannequinStateById']["delete"](_0x2ee23c);
      this["_draftMannequinBonePoses"]?.["delete"]?.(_0x2ee23c);
    }
    if (this["_pickMap"]) {
      this["_rebuildPickRoots"]();
    }
  }
  ['_syncCubes'](_0x4b87f1, _0x36206e = ![]) {
    const _0x5f4fa6 = _0x4b87f1?.['cubes'] || [];
    const _0x44c11e = new Set(collectSelectedObjectIds(_0x4b87f1, 'cube'));
    const _0x57aee9 = !_0x36206e;
    const _0x331767 = new Set();
    _0x5f4fa6["forEach"](_0x6c452c => {
      _0x331767["add"](_0x6c452c['id']);
      this['_cubeStateById']["set"](_0x6c452c['id'], _0x6c452c);
      let _0x1e7338 = this["_cubeMap"]["get"](_0x6c452c['id']);
      const _0x498087 = resolveSceneAsset(_0x6c452c["assetId"]);
      const _0x38a500 = this['_resolveMannequinColor'](_0x6c452c["colorKey"] || _0x498087?.["colorKey"]);
      const _0x54968a = _0x10e00a => /^#[0-9a-f]{6}$/i["test"](String(_0x6c452c["colorKey"] || '')['trim']()) ? _0x38a500 : this['_resolveMannequinColor'](_0x10e00a);
      (!_0x1e7338 || _0x1e7338['assetId'] !== _0x498087?.['id']) && (_0x1e7338 && (this["scene"]['remove'](_0x1e7338["group"]), disposeObject3D(_0x1e7338["group"])), _0x1e7338 = createSceneAssetVisual(_0x498087, _0x38a500, _0x54968a), this['_cubeMap']["set"](_0x6c452c['id'], _0x1e7338), this["scene"]['add'](_0x1e7338['group']));
      applySceneAssetColors(_0x1e7338, _0x38a500, _0x54968a);
      const _0x7881ba = this["_draftObjects"]["get"]('cube:' + _0x6c452c['id']);
      const _0x1d69f9 = _0x7881ba || _0x6c452c;
      applyGroupTransform(_0x1e7338['group'], _0x1d69f9);
      _0x1e7338["group"]["position"]['y'] = Number(_0x1d69f9?.["position"]?.['y']) || 0x0;
      applyGroupScale(_0x1e7338["group"], _0x1d69f9?.["scale"] ?? _0x6c452c?.["scale"] ?? 0x1);
      const _0x23a9a8 = _0x57aee9 && _0x4b87f1?.['ui']?.["isEditing"] === !![] && _0x4b87f1?.['ui']?.['showOutline'] !== ![] && _0x44c11e["has"](_0x6c452c['id']);
      _0x1e7338["group"]["visible"] = _0x57aee9;
      _0x1e7338["selectionRing"]['visible'] = ![];
      _0x1e7338['materialsByColorKey']["forEach"](_0x55cf30 => {
        applySelectionEmphasis(_0x55cf30, _0x23a9a8, 0.22);
      });
      _0x1e7338['edgeMaterialsByColorKey']['forEach'](_0x1dad0d => {
        _0x1dad0d["opacity"] = _0x23a9a8 ? 0x1 : 0.78;
      });
    });
    for (const [_0x388641, _0x26e5c9] of this["_cubeMap"]["entries"]()) {
      if (_0x331767['has'](_0x388641)) {
        continue;
      }
      this["scene"]["remove"](_0x26e5c9["group"]);
      disposeObject3D(_0x26e5c9["group"]);
      this["_cubeMap"]["delete"](_0x388641);
      this["_cubeStateById"]['delete'](_0x388641);
    }
    this["_rebuildPickRoots"]();
  }
  ["_syncCameras"](_0x4753df, _0x1e4dae = ![]) {
    const _0x1e8e82 = Array['isArray'](_0x4753df?.["cameras"]) ? _0x4753df["cameras"] : [];
    const _0x399014 = _0x4753df?.['viewport']?.["activeView"] === "camera" && _0x4753df?.["viewport"]?.["activeCameraId"] ? String(_0x4753df["viewport"]['activeCameraId']) : null;
    const _0x2886a2 = this["_draftView"]?.["kind"] === 'camera' && this['_draftView']?.["cameraId"] ? String(this["_draftView"]['cameraId']) : null;
    const _0xb875ea = new Set(collectSelectedObjectIds(_0x4753df, 'camera'));
    const _0x548702 = !_0x1e4dae && _0x1e8e82["some"](_0x40bc30 => {
      if (!_0x40bc30?.['id']) {
        return ![];
      }
      const _0x88f13d = normalizeCameraPoseData(_0x40bc30);
      const _0x41ff1e = cameraPoseToSceneViewFromReference(_0x88f13d, _0x4753df?.["viewport"]?.['sceneView']);
      return areSceneViewsEquivalent(_0x4753df?.["viewport"]?.['sceneView'], _0x41ff1e);
    });
    const _0x46f944 = Boolean(_0x399014 || _0x2886a2 || _0x548702);
    const _0x709ca2 = new Set();
    _0x1e8e82['forEach'](_0x44a953 => {
      if (!_0x44a953?.['id']) {
        return;
      }
      const _0x24587e = String(_0x44a953['id']);
      _0x709ca2["add"](_0x24587e);
      this["_cameraStateById"]['set'](_0x24587e, _0x44a953);
      let _0x5d337c = this["_cameraMap"]["get"](_0x24587e);
      !_0x5d337c && (_0x5d337c = createCameraVisual(), this["_cameraMap"]["set"](_0x24587e, _0x5d337c), this["scene"]['add'](_0x5d337c['group']));
      const _0x592f93 = this["_draftObjects"]?.["get"]?.("camera:" + _0x24587e);
      const _0x3e4254 = normalizeCameraPoseData(_0x592f93 || _0x44a953);
      _0x5d337c["group"]["position"]["set"](_0x3e4254["position"]['x'], _0x3e4254["position"]['y'], _0x3e4254['position']['z']);
      _0x5d337c["group"]["quaternion"]['set'](_0x3e4254["quaternion"]['x'], _0x3e4254["quaternion"]['y'], _0x3e4254["quaternion"]['z'], _0x3e4254['quaternion']['w']);
      const _0x487e65 = _0xb875ea["has"](_0x24587e);
      _0x5d337c["group"]["visible"] = !_0x1e4dae && (!_0x46f944 || _0x487e65);
      _0x5d337c["bodyMaterial"]["opacity"] = _0x487e65 ? 0x1 : 0.8;
      _0x5d337c["helperLineMaterial"]['opacity'] = _0x487e65 ? 0x1 : 0.8;
    });
    for (const [_0xe36ad3, _0x5b617f] of this["_cameraMap"]['entries']()) {
      if (_0x709ca2["has"](_0xe36ad3)) {
        continue;
      }
      this["scene"]["remove"](_0x5b617f["group"]);
      disposeObject3D(_0x5b617f["group"]);
      this["_cameraMap"]["delete"](_0xe36ad3);
      this["_cameraStateById"]["delete"](_0xe36ad3);
    }
    if (this["_pickMap"]) {
      this["_rebuildPickRoots"]();
    }
  }
  ["_resolveGizmoContext"](_0xf92493) {
    const _0x26b4e9 = collectSelectedObjects(_0xf92493);
    if (_0x26b4e9["length"] === 0x0) {
      return null;
    }
    const _0x4a0e2e = resolveActiveTransformTool(_0xf92493);
    const _0x281710 = _0x26b4e9['map'](_0x10e434 => ({
      'objectType': _0x10e434["objectType"],
      'id': _0x10e434["objectId"],
      'item': this["_draftObjects"]['get'](_0x10e434["objectType"] + ':' + _0x10e434["objectId"]) || this['_getObjectStateByObjectType'](_0x10e434["objectType"], _0x10e434["objectId"]),
      'visual': this["_getVisualByObjectType"](_0x10e434["objectType"], _0x10e434['objectId'])
    }))["filter"](_0x788963 => !!_0x788963["visual"] && !!_0x788963["item"]);
    if (_0x281710["length"] === 0x0) {
      return null;
    }
    _0x281710["forEach"](_0x556243 => {
      _0x556243["pivotWorld"] = resolveObjectToolPivot(_0x556243["item"], _0x556243["visual"], _0x4a0e2e, _0x556243["objectType"]);
      _0x556243["orientationQuaternion"] = resolveObjectOrientationQuaternion(_0x556243["item"], _0x556243['visual']);
    });
    const _0x31fa1b = _0xf92493?.["selection"]?.["selectedObjectType"] === "cube" || _0xf92493?.['selection']?.["selectedObjectType"] === "mannequin" || _0xf92493?.["selection"]?.['selectedObjectType'] === "camera" ? _0xf92493["selection"]['selectedObjectType'] : null;
    const _0x3e51c1 = _0xf92493?.["selection"]?.["selectedObjectId"] || null;
    const _0x5afe9b = _0x3e51c1 && _0x31fa1b ? _0x281710['find'](_0x41ad35 => _0x41ad35["objectType"] === _0x31fa1b && _0x41ad35['id'] === _0x3e51c1) || null : null;
    const _0x3de741 = _0x5afe9b || _0x281710[0x0];
    const _0x2e8170 = new a1172_0x3227df['Vector3']();
    const _0x2927a2 = _0x281710["length"] > 0x1;
    if (_0x2927a2) {
      _0x281710['forEach'](_0x29e4fb => {
        _0x2e8170["add"](_0x29e4fb["pivotWorld"]);
      });
      _0x2e8170["multiplyScalar"](0x1 / _0x281710['length']);
    } else {
      _0x3de741?.["pivotWorld"] && _0x2e8170["copy"](_0x3de741["pivotWorld"]);
    }
    const _0x2aa22a = _0x2927a2 ? measureVisualBoundsForSelection(_0x281710) || createFallbackBounds() : measureVisualBounds(_0x3de741['visual']) || createFallbackBounds();
    const _0x22ab50 = computeGizmoWorldMetrics(_0x2aa22a, _0x2e8170);
    const {
      orientationQuaternion: _0x50ced3,
      usesLocalOrientation: _0x161c26
    } = resolveSelectionGizmoOrientation(_0x281710, _0x3de741, _0x2927a2);
    const _0x4da268 = _0x3de741?.["objectType"] || null;
    const _0x419efd = _0x281710["filter"](_0x19745b => _0x19745b["objectType"] === _0x4da268)["map"](_0x3ac63e => _0x3ac63e['id']);
    return {
      'selectedObjectType': _0x4da268,
      'selectedIds': _0x419efd,
      'selectedObjects': _0x281710['map'](_0x58fb77 => ({
        'objectType': _0x58fb77['objectType'],
        'objectId': _0x58fb77['id']
      })),
      'selectedVisuals': _0x281710,
      'activeEntry': _0x3de741,
      'isMultiSelection': _0x2927a2,
      'pivot': _0x2e8170["clone"](),
      'position': _0x2e8170["clone"](),
      'orientationQuaternion': _0x50ced3,
      'usesLocalOrientation': _0x161c26,
      'bounds': _0x2aa22a,
      'gizmoWorldMetrics': _0x22ab50
    };
  }
  ["_computeWorldUnitsPerPixelAt"](_0x38ee82) {
    if (!_0x38ee82 || !this["camera"]?.["position"]) {
      return 0x0;
    }
    const _0xe3366a = Math["max"](0x1, Number(this["renderer"]?.['domElement']?.["clientHeight"]) || Number(this["renderer"]?.["domElement"]?.['height']) || 0x1);
    return a1172_0x23fa98["computeScene3DWorldUnitsPerPixel"](this["camera"], _0xe3366a, _0x38ee82);
  }
  ["_computeScreenConstantGizmoScale"](_0xaa4113, _0x3e613b = 0x68) {
    const _0xb8acd5 = this["_computeWorldUnitsPerPixelAt"](_0xaa4113);
    if (!(_0xb8acd5 > 0x0)) {
      return 0x1;
    }
    return Math["max"](0.35, Math["min"](0x6, _0xb8acd5 * _0x3e613b));
  }
  ["_captureGizmoDragLock"](_0x6426b6) {
    if (!this['_gizmo'] || !_0x6426b6) {
      return null;
    }
    const _0x3bae6c = this["_gizmo"]['root']['position']['clone']();
    const _0x186c03 = this["_gizmo"]["root"]["quaternion"]["clone"]();
    const _0x7b690d = {
      'box': _0x6426b6["bounds"]?.["box"]?.["clone"]?.() || createFallbackBounds()["box"],
      'size': _0x6426b6["bounds"]?.['size']?.['clone']?.() || new a1172_0x3227df["Vector3"](0x1, 0x1, 0x1),
      'sphere': _0x6426b6["bounds"]?.["sphere"] ? new a1172_0x3227df['Sphere'](_0x6426b6["bounds"]["sphere"]["center"]?.["clone"]?.() || new a1172_0x3227df['Vector3'](), Number(_0x6426b6['bounds']["sphere"]["radius"]) || 0x0) : new a1172_0x3227df["Sphere"](new a1172_0x3227df['Vector3'](0x0, 0.5, 0x0), Math["sqrt"](0.75)),
      'extents': {
        'x': Number(_0x6426b6["bounds"]?.["extents"]?.['x']) || 0x0,
        'y': Number(_0x6426b6["bounds"]?.["extents"]?.['y']) || 0x0,
        'z': Number(_0x6426b6['bounds']?.['extents']?.['z']) || 0x0
      }
    };
    const _0x95fac8 = {
      'extents': {
        'x': Number(_0x6426b6["gizmoWorldMetrics"]?.["extents"]?.['x']) || 0x0,
        'y': Number(_0x6426b6["gizmoWorldMetrics"]?.['extents']?.['y']) || 0x0,
        'z': Number(_0x6426b6["gizmoWorldMetrics"]?.['extents']?.['z']) || 0x0
      },
      'maxExtent': Number(_0x6426b6["gizmoWorldMetrics"]?.['maxExtent']) || 0.01,
      'sphereRadius': Number(_0x6426b6["gizmoWorldMetrics"]?.['sphereRadius']) || 0.01,
      'margin': Number(_0x6426b6['gizmoWorldMetrics']?.["margin"]) || GIZMO_MARGIN_WORLD_MIN
    };
    const _0x498e74 = {
      ..._0x6426b6,
      'position': _0x3bae6c,
      'pivot': _0x6426b6["pivot"]?.["clone"]?.() || _0x3bae6c["clone"](),
      'orientationQuaternion': _0x186c03,
      'bounds': _0x7b690d,
      'gizmoWorldMetrics': _0x95fac8
    };
    const _0x153ec1 = this["_computeScreenConstantGizmoScale"](_0x3bae6c);
    this["_gizmo"]["dragLock"] = {
      'context': _0x498e74,
      'position': _0x3bae6c['clone'](),
      'orientationQuaternion': _0x186c03["clone"](),
      'bounds': _0x7b690d,
      'gizmoWorldMetrics': _0x95fac8,
      'scale': _0x153ec1
    };
    return this["_gizmo"]["dragLock"];
  }
  ["_applyGizmoLayoutFromContext"](_0x24f808, _0x355bbe) {
    const _0x580bac = this["_gizmo"]?.["baseLayout"];
    const _0x7a801a = _0x24f808?.["gizmoWorldMetrics"];
    if (!_0x580bac || !_0x7a801a) {
      return;
    }
    const _0x4eb7b0 = _0x7a801a["extents"];
    const _0x318175 = _0x7a801a["margin"];
    const _0x1912c7 = Math["max"](0.01, Number(_0x7a801a["maxExtent"]) || 0.01);
    const _0x4b319c = Math["max"](0.001, Number(_0x355bbe) || 0x1);
    const _0x5812f7 = GIZMO_MOVE_HEAD_LENGTH * 0.5;
    const _0xe6ef00 = GIZMO_SCALE_HEAD_SIZE * 0.5;
    const _0x3c607b = GIZMO_MOVE_PICK_LENGTH - GIZMO_BASE_AXIS_LENGTH;
    const _0x109697 = GIZMO_SCALE_PICK_LENGTH - GIZMO_BASE_SCALE_LENGTH;
    const _0x5ef8bc = {
      'x': _0x4eb7b0['x'] + _0x318175,
      'y': _0x4eb7b0['y'] + _0x318175,
      'z': _0x4eb7b0['z'] + _0x318175
    };
    ['x', 'y', 'z']["forEach"](_0x3551f8 => {
      const _0x5f3c36 = this['_gizmo']?.["moveAxes"]?.[_0x3551f8];
      const _0x4cd0d0 = this["_gizmo"]?.["scaleAxes"]?.[_0x3551f8];
      const _0x30dd6b = Math['max'](_0x580bac["axisLength"], _0x5ef8bc[_0x3551f8] / _0x4b319c);
      const _0x16720f = Math["max"](GIZMO_MOVE_SHAFT_LENGTH, _0x30dd6b - _0x5812f7);
      const _0x451e85 = Math["max"](GIZMO_MOVE_PICK_LENGTH, _0x30dd6b + _0x3c607b);
      _0x5f3c36?.['shaftLine'] && setAxisLineEnd(_0x5f3c36["shaftLine"], _0x3551f8, _0x16720f);
      _0x5f3c36?.['headMesh'] && setAxisHandleLayout(_0x5f3c36["headMesh"], _0x30dd6b - _0x5812f7, _0x5812f7);
      _0x5f3c36?.["pickMesh"] && (setAxisHandleLayout(_0x5f3c36["pickMesh"], _0x451e85 * 0.5), _0x5f3c36["pickMesh"]["scale"]["set"](0x1, _0x451e85 / GIZMO_MOVE_PICK_LENGTH, 0x1));
      const _0x4c3b60 = _0x580bac["scaleLength"];
      const _0x4ea5cb = Math["max"](GIZMO_SCALE_SHAFT_LENGTH, _0x4c3b60 - _0xe6ef00);
      const _0x322015 = Math["max"](GIZMO_SCALE_PICK_LENGTH, _0x4c3b60 + _0x109697);
      _0x4cd0d0?.["shaftLine"] && setAxisLineEnd(_0x4cd0d0["shaftLine"], _0x3551f8, _0x4ea5cb);
      _0x4cd0d0?.['headMesh'] && setAxisHandleLayout(_0x4cd0d0["headMesh"], _0x4c3b60 - _0xe6ef00, _0xe6ef00);
      _0x4cd0d0?.["pickMesh"] && (setAxisHandleLayout(_0x4cd0d0["pickMesh"], _0x322015 * 0.5), _0x4cd0d0['pickMesh']["scale"]["set"](0x1, _0x322015 / GIZMO_SCALE_PICK_LENGTH, 0x1));
    });
    ['x', 'y', 'z']["forEach"](_0xee11e6 => {
      const _0x44fd09 = this['_gizmo']?.["rotateRings"]?.[_0xee11e6];
      if (_0x44fd09?.["group"]) {
        _0x44fd09["group"]['scale']["setScalar"](0x1);
      }
    });
    const _0x911e69 = Math["max"](_0x580bac["planeOffset"] * 0.5, _0x318175 * 0.42);
    const _0x34089e = Math['max'](_0x580bac["planeOffset"], (_0x4eb7b0['x'] + _0x911e69) / _0x4b319c);
    const _0x4b1496 = Math["max"](_0x580bac["planeOffset"], (_0x4eb7b0['y'] + _0x911e69) / _0x4b319c);
    const _0x42a7ab = Math["max"](_0x580bac['planeOffset'], (_0x4eb7b0['z'] + _0x911e69) / _0x4b319c);
    const _0x35cda0 = _0x580bac["planeSize"] * 0.86;
    const _0x5419d2 = Math["max"](_0x580bac["planeSize"] * 1.2, _0x1912c7 / _0x4b319c * 0.32);
    const _0x5f5d18 = (_0x10cc72, _0x147729) => Math["max"](_0x35cda0, Math["min"](_0x5419d2, Math["min"](_0x10cc72, _0x147729) * 0.34));
    const _0x262107 = _0x5f5d18(_0x34089e, _0x4b1496);
    const _0x3bd6a3 = _0x5f5d18(_0x34089e, _0x42a7ab);
    const _0x22b431 = _0x5f5d18(_0x4b1496, _0x42a7ab);
    const _0x370c7d = Math["max"](_0x580bac["planeSize"] * 0.18, _0x318175 * 0.28) / _0x4b319c;
    const _0x5a7334 = (_0x2f0635, _0x278005, _0x1bd5d8, _0xa30ffa, _0x406b22, _0x5675ba = 0x1, _0x2b94b0 = 0x1) => {
      if (!_0x2f0635) {
        return;
      }
      const _0x303636 = _0x406b22 / Math["max"](0.001, _0x580bac["planeSize"]);
      _0x2f0635["visualGroup"] && (_0x2f0635["visualGroup"]["position"]["set"](_0x278005, _0x1bd5d8, _0xa30ffa), _0x2f0635["visualGroup"]["scale"]["set"](_0x5675ba * _0x303636, _0x2b94b0 * _0x303636, _0x303636));
      _0x2f0635['pickMesh'] && (_0x2f0635['pickMesh']['position']['set'](_0x278005, _0x1bd5d8, _0xa30ffa), _0x2f0635['pickMesh']["scale"]["setScalar"](_0x303636));
    };
    const _0x3348ab = (_0x55c48a, _0xc83470) => {
      const _0x1be299 = _0x55c48a?.[_0xc83470 + 'xy'];
      _0x1be299 && _0x5a7334(_0x1be299, _0x34089e, _0x4b1496, _0x370c7d, _0x262107, 0x1, 0x1);
      const _0x2523ba = _0x55c48a?.[_0xc83470 + 'xz'];
      _0x2523ba && _0x5a7334(_0x2523ba, _0x34089e, _0x370c7d, _0x42a7ab, _0x3bd6a3, 0x1, 0x1);
      const _0x18d3bf = _0x55c48a?.[_0xc83470 + 'yz'];
      _0x18d3bf && _0x5a7334(_0x18d3bf, _0x370c7d, _0x4b1496, _0x42a7ab, _0x22b431, 0x1, 0x1);
    };
    _0x3348ab(this["_gizmo"]?.["planeHandles"], "plane-");
    _0x3348ab(this["_gizmo"]?.["scalePlaneHandles"], "scale-plane-");
  }
  ['_applyGizmoOrientationFromContext'](_0xa6888c, _0x2d97c = "local") {
    if (!this["_gizmo"]?.["root"]?.["quaternion"]) {
      return;
    }
    if (!_0xa6888c) {
      this["_gizmo"]["root"]["quaternion"]["identity"]();
      return;
    }
    const _0x8d6fb3 = this['_gizmo']?.["currentTool"] === "scale" || _0x2d97c === "local";
    if (!_0x8d6fb3) {
      this["_gizmo"]['root']["quaternion"]["identity"]();
      return;
    }
    if (_0xa6888c["isMultiSelection"] && _0xa6888c["usesLocalOrientation"] !== !![]) {
      this["_gizmo"]["root"]['quaternion']["identity"]();
      return;
    }
    if (_0xa6888c['orientationQuaternion']) {
      this['_gizmo']['root']["quaternion"]["copy"](_0xa6888c["orientationQuaternion"]);
      return;
    }
    this['_gizmo']["root"]['quaternion']["identity"]();
  }
  ["_syncGizmo"](_0x2d2cee, _0x2ccb21 = ![]) {
    if (_0x2ccb21 || _0x2d2cee?.['mode'] !== "scene") {
      this['_gizmo']['root']["visible"] = ![];
      this["_clearStableGizmoContext"]();
      this["clearGizmoHandleState"]();
      return;
    }
    if (!_0x2d2cee?.['ui']?.['isEditing']) {
      this["_gizmo"]['root']['visible'] = ![];
      this['_clearStableGizmoContext']();
      this["clearGizmoHandleState"]();
      return;
    }
    const _0x25ee2c = resolveActiveTransformTool(_0x2d2cee);
    this["_gizmo"]["currentTool"] = _0x25ee2c;
    this["_gizmo"]["root"]["visible"] = _0x25ee2c === 'move' || _0x25ee2c === "rotate" || _0x25ee2c === "scale";
    if (!this["_gizmo"]['root']["visible"]) {
      this["_clearStableGizmoContext"]();
      this['clearGizmoHandleState']();
      return;
    }
    const _0xa33e77 = buildTransformSelectionSignature(_0x2d2cee);
    if (!_0xa33e77) {
      this['_gizmo']['root']["visible"] = ![];
      this["_clearStableGizmoContext"]();
      this['clearGizmoHandleState']();
      return;
    }
    const _0xde2bd1 = this["_resolveGizmoContext"](_0x2d2cee);
    const _0x1b111b = _0xde2bd1 || this["_resolveStableGizmoContext"](_0x2d2cee);
    if (!_0x1b111b) {
      this["_gizmo"]["root"]['visible'] = ![];
      this["clearGizmoHandleState"]();
      return;
    }
    _0xde2bd1 && this['_cacheStableGizmoContext'](_0x2d2cee, _0xde2bd1);
    this["_gizmo"]["moveGroup"]['visible'] = _0x25ee2c === "move";
    this["_gizmo"]["rotateGroup"]['visible'] = _0x25ee2c === "rotate";
    this["_gizmo"]['scaleGroup']["visible"] = _0x25ee2c === "scale";
    this['_gizmo']['root']["position"]['copy'](_0x1b111b['position']);
    this["_applyGizmoOrientationFromContext"](_0x1b111b, _0x2d2cee?.['ui']?.["transformSpace"]);
    this['_applyGizmoHighlight']();
  }
  ["_applyGizmoPosition"]() {
    if (!this["_sceneState"]?.['ui']?.["isEditing"]) {
      return;
    }
    if (!this["_gizmo"]["root"]["visible"]) {
      return;
    }
    const _0x44d927 = this["_gizmo"]['dragLock'];
    if (_0x44d927) {
      this["_gizmo"]["root"]["position"]['copy'](_0x44d927["position"]);
      this["_gizmo"]["root"]["quaternion"]["copy"](_0x44d927['orientationQuaternion']);
      this["_gizmo"]["root"]["scale"]['setScalar'](_0x44d927["scale"]);
      this['_applyGizmoLayoutFromContext'](_0x44d927["context"], _0x44d927["scale"]);
      return;
    }
    const _0x454440 = this["_resolveGizmoContext"](this["_sceneState"]);
    const _0x1eb840 = _0x454440 || this['_resolveStableGizmoContext'](this["_sceneState"]);
    if (!_0x1eb840) {
      return;
    }
    _0x454440 && this["_cacheStableGizmoContext"](this["_sceneState"], _0x454440);
    this['_gizmo']["root"]["position"]["copy"](_0x1eb840["position"]);
    this['_applyGizmoOrientationFromContext'](_0x1eb840, this["_sceneState"]?.['ui']?.["transformSpace"]);
    const _0x43483b = this["_computeScreenConstantGizmoScale"](_0x1eb840["position"]);
    this["_gizmo"]["root"]['scale']['setScalar'](_0x43483b);
    this["_applyGizmoLayoutFromContext"](_0x1eb840, _0x43483b);
  }
  ["_applyGizmoHighlight"]() {
    const _0x3323f1 = this["_gizmo"]?.['hoverHandle'] || null;
    const _0x44fd93 = this["_gizmo"]?.['activeHandle'] || null;
    const _0x223357 = _0x3366a7 => {
      const _0x2414d0 = new Set();
      if (!_0x3366a7) {
        return _0x2414d0;
      }
      _0x2414d0["add"](_0x3366a7);
      const _0x4cebff = this["_gizmo"]?.["handles"]?.["get"]?.(_0x3366a7) || null;
      _0x4cebff?.["mode"] === "plane" && (_0x4cebff['linkedAxes'] || [])["forEach"](_0x2cb81c => {
        if (_0x2cb81c) {
          _0x2414d0['add']("axis-" + _0x2cb81c);
        }
      });
      return _0x2414d0;
    };
    const _0x10c8cc = _0x223357(_0x44fd93);
    const _0xb18d9e = _0x223357(_0x3323f1);
    this["_gizmo"]?.["handles"]?.["forEach"]((_0x584dea, _0x30e419) => {
      const _0x465cd5 = _0x10c8cc['has'](_0x30e419);
      const _0x33f956 = !_0x465cd5 && _0xb18d9e['has'](_0x30e419);
      const _0x29c1ac = _0x465cd5 ? 0.52 : _0x33f956 ? 0.3 : 0x0;
      const _0x11530e = _0x465cd5 ? 0x1 : _0x33f956 ? 0.92 : 0.8;
      (_0x584dea['visuals'] || [])["forEach"](_0x552d13 => {
        const _0xd1e9e2 = _0x552d13?.['material'];
        const _0x2ee430 = _0x552d13?.["color"];
        if (!_0xd1e9e2?.["color"] || !_0x2ee430) {
          return;
        }
        _0xd1e9e2["color"]["copy"](_0x2ee430)["lerp"](new a1172_0x3227df["Color"](0xffffff), _0x29c1ac);
        typeof _0x552d13['opacity'] === "number" && 'opacity' in _0xd1e9e2 && (_0xd1e9e2['opacity'] = _0x552d13["opacity"] * _0x11530e);
        _0xd1e9e2['needsUpdate'] = !![];
      });
    });
  }
  ["_applyRenderView"]() {
    const _0x5bb97d = this['_resolveTargetRenderPose']();
    const _0x3d6aed = performance['now']();
    const _0x2f14cb = this['_shouldSmoothTargetPose'](_0x5bb97d, _0x3d6aed);
    const _0x4618f6 = _0x2f14cb ? this["_applyPoseSmoothing"](_0x5bb97d, _0x3d6aed) : cloneRenderPose(_0x5bb97d);
    const _0x3018d9 = _0x2f14cb && measurePoseDistance(_0x4618f6, _0x5bb97d) > POSE_SETTLE_EPSILON;
    (!_0x2f14cb || !_0x3018d9) && (this['_smoothedPose'] = cloneRenderPose(_0x5bb97d), this["_lastRenderTime"] = _0x3d6aed);
    this['_renderPose'] = _0x4618f6;
    this["_commitCameraFromPose"](_0x4618f6);
    return {
      'keepAnimating': _0x3018d9
    };
  }
  ["_resolveTargetRenderPose"]() {
    const _0x4a4c76 = this["_sceneState"];
    const _0x5ebda7 = this["_draftView"];
    const _0x557234 = this['_isPanorama360Mode'](_0x4a4c76);
    let _0x3581b4;
    if (_0x557234) {
      const _0x3c067b = _0x5ebda7?.["kind"] === "panorama-default" ? _0x5ebda7["panoramaView"] || _0x4a4c76?.['viewport']?.["panoramaView"] : _0x4a4c76?.["viewport"]?.['panoramaView'];
      _0x3581b4 = resolvePanoramaViewPose(_0x3c067b, {
        'x': 0x0,
        'y': 0x0,
        'z': 0x0
      });
    } else {
      if (_0x5ebda7?.["kind"] === "camera") {
        const _0x2a36d1 = normalizeCameraPoseData(_0x5ebda7);
        _0x3581b4 = {
          'kind': "camera",
          'position': _0x2a36d1['position'],
          'quaternion': _0x2a36d1["quaternion"],
          'rotation': _0x2a36d1["rotation"],
          'fov': _0x2a36d1["fov"]
        };
      } else {
        if (_0x5ebda7?.["kind"] === "scene-default") {
          _0x3581b4 = resolveSceneCameraPose(_0x5ebda7["sceneView"] || _0x4a4c76['viewport']["sceneView"], Number["isFinite"](Number(_0x5ebda7["fov"])) ? Number(_0x5ebda7["fov"]) : focalLengthToFov(this["_defaultSceneFocalLength"]));
        } else {
          if (_0x5ebda7?.["kind"] === 'panorama-default') {
            _0x3581b4 = resolvePanoramaViewPose(_0x5ebda7["panoramaView"] || _0x4a4c76["viewport"]["panoramaView"]);
          } else {
            if (_0x4a4c76["mode"] === "panorama") {
              _0x3581b4 = resolvePanoramaViewPose(_0x4a4c76['viewport']["panoramaView"]);
            } else {
              _0x4a4c76?.["viewport"]?.["activeView"] === "camera" && _0x4a4c76?.["viewport"]?.["activeCameraId"] ? _0x3581b4 = resolveSceneCameraPose(_0x4a4c76['viewport']["sceneView"], focalLengthToFov(this["_defaultSceneFocalLength"])) : _0x3581b4 = resolveSceneCameraPose(_0x4a4c76["viewport"]['sceneView'], focalLengthToFov(this["_defaultSceneFocalLength"]));
            }
          }
        }
      }
    }
    return _0x3581b4;
  }
  ["_shouldSmoothTargetPose"](_0x3c8903, _0x3708c3 = performance["now"]()) {
    if (this["_draftView"]?.["disableSmoothing"] === !![]) {
      return ![];
    }
    if (!_0x3c8903 || _0x3c8903['kind'] === 'camera') {
      return ![];
    }
    if (_0x3708c3 <= (this['_viewSmoothingUntil'] || 0x0)) {
      return !![];
    }
    if (!this['_smoothedPose'] || this['_smoothedPose']["kind"] !== _0x3c8903["kind"]) {
      return ![];
    }
    return measurePoseDistance(this["_smoothedPose"], _0x3c8903) > POSE_SETTLE_EPSILON;
  }
  ['_applyPoseSmoothing'](_0x39d56e, _0x15fdff = performance['now']()) {
    if (!this["_smoothedPose"] || this["_smoothedPose"]["kind"] !== _0x39d56e["kind"]) {
      this["_smoothedPose"] = cloneRenderPose(_0x39d56e);
      this['_lastRenderTime'] = _0x15fdff;
      return cloneRenderPose(_0x39d56e);
    }
    const _0x2e2ccc = Math['min'](VIEW_DAMPING_MAX_DT_MS, Math["max"](0x0, _0x15fdff - (this["_lastRenderTime"] || _0x15fdff)));
    this['_lastRenderTime'] = _0x15fdff;
    const _0x2da1fc = this['_smoothedPose'];
    if (_0x39d56e["kind"] === "panorama-default") {
      _0x2da1fc["position"]['x'] = dampScalar(_0x2da1fc["position"]['x'], _0x39d56e["position"]['x'], _0x2e2ccc, VIEW_DAMPING_TIME_CONSTANT_MS);
      _0x2da1fc['position']['y'] = dampScalar(_0x2da1fc["position"]['y'], _0x39d56e['position']['y'], _0x2e2ccc, VIEW_DAMPING_TIME_CONSTANT_MS);
      _0x2da1fc["position"]['z'] = dampScalar(_0x2da1fc['position']['z'], _0x39d56e['position']['z'], _0x2e2ccc, VIEW_DAMPING_TIME_CONSTANT_MS);
      _0x2da1fc["yaw"] = dampAngle(_0x2da1fc["yaw"], _0x39d56e["yaw"], _0x2e2ccc, VIEW_DAMPING_TIME_CONSTANT_MS);
      _0x2da1fc["pitch"] = dampScalar(_0x2da1fc["pitch"], _0x39d56e["pitch"], _0x2e2ccc, VIEW_DAMPING_TIME_CONSTANT_MS);
      _0x2da1fc["fov"] = dampScalar(_0x2da1fc["fov"], _0x39d56e["fov"], _0x2e2ccc, VIEW_DAMPING_TIME_CONSTANT_MS);
      return cloneRenderPose(_0x2da1fc);
    }
    _0x2da1fc["position"]['x'] = dampScalar(_0x2da1fc["position"]['x'], _0x39d56e["position"]['x'], _0x2e2ccc, VIEW_DAMPING_TIME_CONSTANT_MS);
    _0x2da1fc['position']['y'] = dampScalar(_0x2da1fc['position']['y'], _0x39d56e['position']['y'], _0x2e2ccc, VIEW_DAMPING_TIME_CONSTANT_MS);
    _0x2da1fc["position"]['z'] = dampScalar(_0x2da1fc["position"]['z'], _0x39d56e["position"]['z'], _0x2e2ccc, VIEW_DAMPING_TIME_CONSTANT_MS);
    _0x2da1fc['target']['x'] = dampScalar(_0x2da1fc["target"]['x'], _0x39d56e["target"]['x'], _0x2e2ccc, VIEW_DAMPING_TIME_CONSTANT_MS);
    _0x2da1fc['target']['y'] = dampScalar(_0x2da1fc["target"]['y'], _0x39d56e["target"]['y'], _0x2e2ccc, VIEW_DAMPING_TIME_CONSTANT_MS);
    _0x2da1fc['target']['z'] = dampScalar(_0x2da1fc["target"]['z'], _0x39d56e["target"]['z'], _0x2e2ccc, VIEW_DAMPING_TIME_CONSTANT_MS);
    _0x2da1fc["fov"] = dampScalar(_0x2da1fc['fov'], _0x39d56e["fov"], _0x2e2ccc, VIEW_DAMPING_TIME_CONSTANT_MS);
    _0x2da1fc["yaw"] = _0x39d56e["yaw"];
    _0x2da1fc['pitch'] = _0x39d56e["pitch"];
    _0x2da1fc["distance"] = _0x39d56e["distance"];
    return cloneRenderPose(_0x2da1fc);
  }
  ['_commitCameraFromPose'](_0x4fe7c6) {
    if (!_0x4fe7c6) {
      return;
    }
    const _0x113948 = _0x4fe7c6?.["kind"] === "panorama-default" ? 0x37 : 0x3a;
    if (a1172_0x23fa98["applyBridgeCameraProjection"](this, _0x4fe7c6, _0x113948)) {
      return;
    }
    if (_0x4fe7c6["kind"] === 'camera') {
      const _0x437eb7 = normalizeCameraPoseData(_0x4fe7c6);
      this['camera']["position"]["set"](_0x437eb7["position"]['x'], _0x437eb7['position']['y'], _0x437eb7["position"]['z']);
      this["camera"]['quaternion']['set'](_0x437eb7['quaternion']['x'], _0x437eb7["quaternion"]['y'], _0x437eb7["quaternion"]['z'], _0x437eb7["quaternion"]['w']);
      return;
    }
    if (_0x4fe7c6["kind"] === "panorama-default") {
      const _0x246a2e = forwardVectorFromYawPitch(_0x4fe7c6['yaw'], _0x4fe7c6["pitch"]);
      this['camera']["position"]["set"](0x0, 0x0, 0x0);
      this['camera']["lookAt"](_0x246a2e['x'], _0x246a2e['y'], _0x246a2e['z']);
      return;
    }
    this['camera']['position']["set"](_0x4fe7c6["position"]['x'], _0x4fe7c6["position"]['y'], _0x4fe7c6["position"]['z']);
    this["camera"]["lookAt"](_0x4fe7c6["target"]['x'], _0x4fe7c6["target"]['y'], _0x4fe7c6['target']['z']);
  }
  ["_applyDraftObjects"]() {
    if (!this['_sceneState']) {
      return;
    }
    this["_mannequinMap"]["forEach"]((_0x3d468e, _0x384528) => {
      const _0x5efd16 = this["_mannequinStateById"]["get"](_0x384528);
      if (!_0x5efd16) {
        return;
      }
      const _0x245bbe = this['_draftObjects']['get']("mannequin:" + _0x384528);
      const _0x33a5d3 = _0x245bbe || _0x5efd16;
      applyGroupTransform(_0x3d468e["group"], _0x33a5d3);
      _0x3d468e["group"]["position"]['y'] = Number(_0x33a5d3?.["position"]?.['y']) || 0x0;
      applyGroupScale(_0x3d468e["group"], _0x33a5d3?.["scale"] ?? _0x5efd16?.['scale'] ?? 0x1);
    });
    this["_cubeMap"]['forEach']((_0x1b497c, _0x51c024) => {
      const _0x3c294e = this["_cubeStateById"]["get"](_0x51c024);
      if (!_0x3c294e) {
        return;
      }
      const _0x342eda = this["_draftObjects"]['get']("cube:" + _0x51c024);
      const _0x46566c = _0x342eda || _0x3c294e;
      applyGroupTransform(_0x1b497c['group'], _0x46566c);
      _0x1b497c["group"]["position"]['y'] = Number(_0x46566c?.["position"]?.['y']) || 0x0;
      applyGroupScale(_0x1b497c["group"], _0x46566c?.["scale"] ?? _0x3c294e?.["scale"] ?? 0x1);
    });
    this["_cameraMap"]["forEach"]((_0x573e8b, _0x13c082) => {
      const _0x4c1cf1 = this["_cameraStateById"]["get"](_0x13c082);
      if (!_0x4c1cf1) {
        return;
      }
      const _0x273c6b = this['_draftObjects']["get"]("camera:" + _0x13c082);
      applyGroupTransform(_0x573e8b["group"], _0x273c6b || _0x4c1cf1);
    });
  }
  ['_getObjectStateByObjectType'](_0x566496, _0x59054a) {
    if (_0x566496 === 'cube') {
      return this['_cubeStateById']["get"](_0x59054a) || null;
    }
    if (_0x566496 === "mannequin") {
      return this["_mannequinStateById"]["get"](_0x59054a) || null;
    }
    if (_0x566496 === "camera") {
      return this['_cameraStateById']["get"](_0x59054a) || null;
    }
    return null;
  }
  ['_getVisualByObjectType'](_0x463714, _0x335b5d) {
    const _0x2f877d = this["_visualOverrides"]?.["get"]?.(_0x463714 + ':' + _0x335b5d);
    if (_0x2f877d) {
      return _0x2f877d;
    }
    if (_0x463714 === "cube") {
      return this["_cubeMap"]["get"](_0x335b5d);
    }
    if (_0x463714 === "mannequin") {
      return this['_mannequinMap']["get"](_0x335b5d);
    }
    if (_0x463714 === 'camera') {
      return this["_cameraMap"]["get"](_0x335b5d);
    }
    return null;
  }
}