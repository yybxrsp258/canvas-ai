import * as a1170_0x11d2e8 from './threeRuntime.js';
import { GLTFLoader } from '../../../vendor/three/examples/jsm/loaders/GLTFLoader.js';
import { clone as a1170_0x54c186 } from '../../../vendor/three/examples/jsm/utils/SkeletonUtils.js';
import { PANORAMA_CHARACTER_BONES, normalizeBonePose } from './poseCatalog.js';
const TARGET_CHARACTER_HEIGHT = 1.92;
export const PANORAMA_CHARACTER_MODEL_SOURCES = Object["freeze"]({
  'male': new URL("../../../assets/characters/quaternius/universal-base/Superhero_Male_FullBody.gltf", import.meta["url"])["href"],
  'female': new URL("../../../assets/characters/quaternius/universal-base/Superhero_Female_FullBody.gltf", import.meta["url"])["href"]
});
const loader = new GLTFLoader();
const loadCache = new Map();
const NATURAL_ARM_POSE_BY_GENDER = Object['freeze']({
  'male': Object["freeze"]({
    'upperArmDropRadians': 1.34,
    'lowerArmRelaxRadians': 0x0
  }),
  'female': Object["freeze"]({
    'upperArmDropRadians': 1.38,
    'lowerArmRelaxRadians': 0x0
  })
});
export function resolvePanoramaCharacterGender(_0x169fb0) {
  return _0x169fb0 === "female" ? "female" : "male";
}
export function resolvePanoramaCharacterModelUrl(_0x1d7d24) {
  return PANORAMA_CHARACTER_MODEL_SOURCES[resolvePanoramaCharacterGender(_0x1d7d24)];
}
function loadCharacterTemplate(_0x5a56a8) {
  const _0x2ac07d = resolvePanoramaCharacterGender(_0x5a56a8);
  if (loadCache['has'](_0x2ac07d)) {
    return loadCache['get'](_0x2ac07d);
  }
  if (typeof window === 'undefined') {
    return Promise["reject"](new Error("Quaternius character models are only loaded in browser runtime"));
  }
  const _0x25148f = new Promise((_0x173564, _0x5dc376) => {
    loader['load'](resolvePanoramaCharacterModelUrl(_0x2ac07d), _0x4e4386 => {
      if (!_0x4e4386?.["scene"]) {
        _0x5dc376(new Error("Quaternius " + _0x2ac07d + " model did not contain a scene"));
        return;
      }
      _0x173564(normalizeCharacterModel(_0x4e4386["scene"], _0x2ac07d));
    }, undefined, _0x5dc376);
  });
  loadCache['set'](_0x2ac07d, _0x25148f);
  return _0x25148f;
}
function cloneCharacterTemplate(_0x1114db) {
  return a1170_0x54c186(_0x1114db);
}
function resolvePanoramaCharacterNaturalArmPose(_0x280a5c) {
  return NATURAL_ARM_POSE_BY_GENDER[resolvePanoramaCharacterGender(_0x280a5c)];
}
function rotateBoneLocal(_0x4453ea, _0x4d2fb4, _0x4e739e, _0x3bd29e) {
  const _0x5c0d73 = _0x4453ea?.["getObjectByName"]?.(_0x4d2fb4);
  if (!_0x5c0d73) {
    return ![];
  }
  const _0x3096ce = new a1170_0x11d2e8['Quaternion']()["setFromAxisAngle"](_0x4e739e, _0x3bd29e);
  _0x5c0d73["quaternion"]["multiply"](_0x3096ce);
  return !![];
}
export function applyPanoramaCharacterNaturalArmPose(_0x3fbc13, _0x2d262e) {
  const _0x39d274 = resolvePanoramaCharacterNaturalArmPose(_0x2d262e);
  const _0x50a67c = new a1170_0x11d2e8["Vector3"](0x0, 0x0, 0x1);
  rotateBoneLocal(_0x3fbc13, "upperarm_l", _0x50a67c, -_0x39d274["upperArmDropRadians"]);
  rotateBoneLocal(_0x3fbc13, "upperarm_r", _0x50a67c, _0x39d274['upperArmDropRadians']);
  rotateBoneLocal(_0x3fbc13, "lowerarm_l", _0x50a67c, -_0x39d274["lowerArmRelaxRadians"]);
  rotateBoneLocal(_0x3fbc13, "lowerarm_r", _0x50a67c, _0x39d274["lowerArmRelaxRadians"]);
  _0x3fbc13?.['updateMatrixWorld']?.(!![]);
  return _0x3fbc13;
}
export function capturePanoramaCharacterBoneBase(_0x12857a) {
  const _0x4b11b2 = {};
  for (const _0x1e97ed of PANORAMA_CHARACTER_BONES) {
    const _0x8ce9d = _0x12857a?.['getObjectByName']?.(_0x1e97ed);
    if (!_0x8ce9d?.["quaternion"]) {
      continue;
    }
    _0x4b11b2[_0x1e97ed] = {
      'x': _0x8ce9d["quaternion"]['x'],
      'y': _0x8ce9d["quaternion"]['y'],
      'z': _0x8ce9d['quaternion']['z'],
      'w': _0x8ce9d["quaternion"]['w']
    };
  }
  return _0x4b11b2;
}
export function applyPanoramaCharacterBonePose(_0x4f5e3e, _0x43eeef, _0x23f96b = {}) {
  const _0x1f1b0d = normalizeBonePose(_0x43eeef);
  for (const _0x393845 of PANORAMA_CHARACTER_BONES) {
    const _0x52e33f = _0x4f5e3e?.["getObjectByName"]?.(_0x393845);
    if (!_0x52e33f?.["quaternion"]) {
      continue;
    }
    const _0x258c19 = _0x23f96b?.[_0x393845];
    if (_0x258c19) {
      _0x52e33f["quaternion"]['set'](_0x258c19['x'], _0x258c19['y'], _0x258c19['z'], _0x258c19['w']);
    }
    const _0x4c90af = _0x1f1b0d[_0x393845];
    if (!_0x4c90af) {
      continue;
    }
    const _0x27f85d = new a1170_0x11d2e8["Quaternion"]()["setFromEuler"](new a1170_0x11d2e8["Euler"](_0x4c90af['x'], _0x4c90af['y'], _0x4c90af['z'], "XYZ"));
    _0x52e33f['quaternion']["multiply"](_0x27f85d);
  }
  _0x4f5e3e?.["updateMatrixWorld"]?.(!![]);
  return _0x4f5e3e;
}
function normalizeCharacterModel(_0xe5465b, _0x4e5807) {
  applyPanoramaCharacterNaturalArmPose(_0xe5465b, _0x4e5807);
  _0xe5465b['updateMatrixWorld'](!![]);
  const _0x4f9fd2 = new a1170_0x11d2e8["Box3"]()['setFromObject'](_0xe5465b);
  const _0x401de8 = new a1170_0x11d2e8["Vector3"]();
  _0x4f9fd2["getSize"](_0x401de8);
  const _0x10b0b0 = Math["max"](0.001, _0x401de8['y']);
  const _0x10ff37 = TARGET_CHARACTER_HEIGHT / _0x10b0b0;
  _0xe5465b['scale']["multiplyScalar"](_0x10ff37);
  _0xe5465b['updateMatrixWorld'](!![]);
  const _0x3c1514 = new a1170_0x11d2e8["Box3"]()['setFromObject'](_0xe5465b);
  const _0x5c85b3 = new a1170_0x11d2e8['Vector3']();
  _0x3c1514['getCenter'](_0x5c85b3);
  _0xe5465b["position"]['x'] -= _0x5c85b3['x'];
  _0xe5465b["position"]['y'] -= _0x3c1514["min"]['y'];
  _0xe5465b["position"]['z'] -= _0x5c85b3['z'];
  _0xe5465b["traverse"](_0x439794 => {
    _0x439794["frustumCulled"] = ![];
    _0x439794['isMesh'] && (_0x439794["castShadow"] = ![], _0x439794["receiveShadow"] = !![]);
  });
  return _0xe5465b;
}
export function preloadPanoramaCharacterModels(_0x5daf1a = ["male", "female"]) {
  const _0x581092 = Array['isArray'](_0x5daf1a) ? _0x5daf1a : [_0x5daf1a];
  return Promise["all"](_0x581092["map"](_0x5718a5 => loadCharacterTemplate(resolvePanoramaCharacterGender(_0x5718a5))));
}
export async function createPanoramaCharacterModelInstance(_0x1488ba, {
  style: _0x48fcac
} = {}) {
  const _0x33ac1a = await loadCharacterTemplate(_0x1488ba);
  const _0x42526a = cloneCharacterTemplate(_0x33ac1a);
  if (_0x48fcac === "articulated") {
    const {
      buildArticulatedCharacterShell: _0x2a239b
    } = await import("./articulatedCharacterModel.js");
    return _0x2a239b(_0x42526a);
  }
  return _0x42526a;
}