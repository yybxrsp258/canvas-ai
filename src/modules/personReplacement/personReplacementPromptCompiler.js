import { getPersonReplacementCharacterBaseImageRef, normalizePersonReplacementScope, normalizePersonReplacementProject, normalizePersonReplacementShot, resolvePersonReplacementImageSourceRef } from './personReplacementProject.js';
import { PERSON_REPLACEMENT_ORIENTATION_ENABLED } from './personReplacementCapabilities.js';
import { buildPersonReplacementLocationGuideSvg } from './personReplacementLocationGuideSvg.js';
import { localPathToUrl } from '../../utils/localMediaPath.js';
import { resolvePersonReplacementPromptLabel } from './personReplacementPromptIdentity.js';
import { buildPersonReplacementPositioningPrompt, getPersonReplacementPromptMarker, PERSON_REPLACEMENT_PROMPT_MODE_POSITIONING, PERSON_REPLACEMENT_PROMPT_MODE_MANUAL, PERSON_REPLACEMENT_PROMPT_MODE_TEST } from './personReplacementPromptMode.js';
function normalizeText(_0x40e508) {
  return String(_0x40e508 ?? '')["trim"]();
}
function comparePeopleByPosition(_0x178ffa, _0x14f215) {
  const _0x48a8da = {
    'left': 0x0,
    'center': 0x1,
    'right': 0x2,
    'unknown': 0x3
  };
  const _0x422835 = _0x178ffa["locator"]?.['bbox'];
  const _0x305803 = _0x14f215["locator"]?.["bbox"];
  const _0x183b3b = _0x422835 ? _0x422835['x'] + _0x422835["width"] / 0x2 : Number["POSITIVE_INFINITY"];
  const _0x226e9b = _0x305803 ? _0x305803['x'] + _0x305803['width'] / 0x2 : Number["POSITIVE_INFINITY"];
  if (_0x183b3b !== _0x226e9b) {
    return _0x183b3b - _0x226e9b;
  }
  const _0x202423 = (_0x48a8da[_0x178ffa["locator"]?.["horizontal"]] ?? 0x3) - (_0x48a8da[_0x14f215['locator']?.["horizontal"]] ?? 0x3);
  if (_0x202423) {
    return _0x202423;
  }
  return _0x178ffa['id']["localeCompare"](_0x14f215['id'], "zh-CN");
}
function normalizeCompilerInput(_0x2954c3 = {}) {
  const _0x22c629 = normalizePersonReplacementProject(_0x2954c3['project'] || {
    'characters': _0x2954c3["characters"] || _0x2954c3["targetCharacters"],
    'mappings': _0x2954c3["mappings"]
  });
  const _0x6f0835 = normalizePersonReplacementShot(_0x2954c3["shot"] || {}, 0x0);
  return {
    'project': _0x22c629,
    'shot': _0x6f0835
  };
}
function getTargetCharacterId(_0x44cfce, _0x349506) {
  const _0x3be819 = normalizeText(_0x44cfce["targetCharacterId"]);
  if (_0x3be819) {
    return _0x3be819;
  }
  if (_0x44cfce["projectMappingDisabled"] === !![]) {
    return '';
  }
  return _0x349506['get'](normalizeText(_0x44cfce["sourceCharacterId"])) || '';
}
function getTargetAppearanceImageRef(_0x1e8427, _0x10a931 = '') {
  const _0x452662 = Array["isArray"](_0x1e8427?.["appearances"]) ? _0x1e8427["appearances"] : [];
  const _0x32c7f2 = _0x452662["find"](_0x33bfa6 => normalizeText(_0x33bfa6?.['id']) === normalizeText(_0x10a931));
  return normalizeText(_0x32c7f2?.["imageUrl"]) || getPersonReplacementCharacterBaseImageRef(_0x1e8427);
}
function resolveSceneReference(_0x55219a, _0x18508b) {
  const _0x59e106 = normalizeText(_0x18508b['sceneReference']?.["sceneId"]);
  if (!_0x59e106) {
    return null;
  }
  const _0x1e7e61 = _0x55219a["scenes"]['find'](_0x3acb52 => _0x3acb52['id'] === _0x59e106);
  if (!_0x1e7e61) {
    return {
      'sceneId': _0x59e106,
      'scene': null,
      'imageRef': ''
    };
  }
  return {
    'sceneId': _0x59e106,
    'scene': _0x1e7e61,
    'appearanceId': normalizeText(_0x18508b["sceneReference"]?.["appearanceId"]),
    'imageRef': getTargetAppearanceImageRef(_0x1e7e61, _0x18508b["sceneReference"]?.["appearanceId"])
  };
}
function getPersonBoundingBox(_0x4bd3a7 = {}) {
  return _0x4bd3a7["locator"]?.['bbox'] || _0x4bd3a7['bbox'] || null;
}
export function isPersonReplacementSceneOnlyPromptPackage(_0x4b9c1a = {}) {
  return Number(_0x4b9c1a["sceneReferenceSlot"]) > 0x0 && !_0x4b9c1a['mappedPersonIds']?.["length"];
}
export function buildPersonReplacementPromptPackage(_0x7e4fea = {}) {
  const {
    project: _0x4088cb,
    shot: _0xd48882
  } = normalizeCompilerInput(_0x7e4fea);
  const _0xbcaee6 = _0xd48882['replacementPromptMode'] === PERSON_REPLACEMENT_PROMPT_MODE_MANUAL;
  const _0x19f9ba = _0xd48882["replacementPromptMode"] === PERSON_REPLACEMENT_PROMPT_MODE_TEST;
  const _0x2fa3d4 = _0x19f9ba || _0xd48882['replacementPromptMode'] === PERSON_REPLACEMENT_PROMPT_MODE_POSITIONING;
  const _0x4e212d = new Map(_0x4088cb["mappings"]["map"](_0x19180a => [_0x19180a["sourceCharacterId"], _0x19180a["targetCharacterId"]]));
  const _0xbc66c4 = new Map(_0x4088cb["characters"]["map"](_0x584366 => [_0x584366['id'], _0x584366]));
  const _0x36af00 = [..._0xd48882["people"]]["sort"]((_0x4d1479, _0x366e19) => _0x4d1479["promptMarkerIndex"] - _0x366e19["promptMarkerIndex"]);
  const _0x1b404d = _0x2fa3d4 ? _0x36af00["filter"](_0x12ca20 => getTargetCharacterId(_0x12ca20, _0x4e212d)) : _0x36af00;
  const _0x3727b3 = _0xbcaee6 ? [] : _0x1b404d['filter'](_0x252c61 => !getPersonBoundingBox(_0x252c61))["map"](_0x20a656 => _0x20a656['id']);
  const _0x4989e9 = !_0xbcaee6 && PERSON_REPLACEMENT_ORIENTATION_ENABLED ? _0x1b404d['filter'](_0x48ee74 => normalizeText(_0x48ee74['orientation']) === "unknown")["map"](_0x44f26b => _0x44f26b['id']) : [];
  const _0x16e1f0 = [];
  const _0x408044 = new Map();
  const _0x43972a = _0xb483c0 => {
    const _0x27857e = (_0x19f9ba && _0xb483c0["role"] === 'source-keyframe' ? "annotated:" : '') + (localPathToUrl(_0xb483c0["ref"]) || _0xb483c0['ref']);
    const _0x57f6d9 = _0x408044["get"](_0x27857e);
    if (_0x57f6d9) {
      return {
        ..._0xb483c0,
        'ref': _0x57f6d9["ref"],
        'slot': _0x57f6d9['slot'],
        'label': '图' + _0x57f6d9["slot"]
      };
    }
    const _0x5d8a3a = _0x16e1f0["length"] + 0x1;
    const _0x19d815 = {
      ..._0xb483c0,
      'slot': _0x5d8a3a,
      'label': _0xb483c0["label"] || '图' + _0x5d8a3a
    };
    _0x408044["set"](_0x27857e, _0x19d815);
    _0x16e1f0["push"](_0x19d815);
    return _0x19d815;
  };
  const _0x447281 = resolvePersonReplacementImageSourceRef(_0xd48882);
  if (_0x447281) {
    _0x43972a({
      'slot': 0x1,
      'label': "图像1",
      'ref': _0x447281,
      'role': "source-keyframe"
    });
  }
  const _0xb2a951 = new Map();
  const _0x74c123 = [];
  const _0x545d84 = [];
  const _0x5e368f = [];
  const _0x30e2ca = [];
  _0x36af00["forEach"](_0x2a2f2e => {
    if (!_0xbcaee6 && !getPersonBoundingBox(_0x2a2f2e)) {
      return;
    }
    const _0x2ed96e = getTargetCharacterId(_0x2a2f2e, _0x4e212d);
    if (!_0x2ed96e) {
      if (!_0xbcaee6 && !_0x2fa3d4) {
        _0x545d84["push"](_0x2a2f2e['id']);
      }
      return;
    }
    const _0x511587 = _0xbc66c4["get"](_0x2ed96e);
    const _0x2ea4de = getTargetAppearanceImageRef(_0x511587, _0x2a2f2e["targetAppearanceId"]);
    if (!_0x511587 || !_0x2ea4de) {
      !_0xbcaee6 && (_0x545d84["push"](_0x2a2f2e['id']), _0x30e2ca['push'](!_0x511587 ? "未找到目标角色：" + _0x2ed96e : "目标角色缺少参考图：" + (_0x511587["name"] || _0x2ed96e)));
      return;
    }
    const _0x1b2e7a = _0x2ed96e + ':' + normalizeText(_0x2a2f2e["targetAppearanceId"]);
    if (!_0xb2a951["has"](_0x1b2e7a)) {
      if (!_0xbcaee6 && _0xb2a951["size"] >= 0x8) {
        _0x5e368f['push'](_0x2a2f2e['id']);
        return;
      }
      const _0x5afa13 = _0x43972a({
        'ref': _0x2ea4de,
        'role': "target-character",
        'targetCharacterId': _0x2ed96e,
        'targetAppearanceId': normalizeText(_0x2a2f2e["targetAppearanceId"])
      });
      _0xb2a951["set"](_0x1b2e7a, _0x5afa13);
    }
    _0x74c123["push"]({
      'person': _0x2a2f2e,
      'sourceLabel': resolvePersonReplacementPromptLabel(_0x2a2f2e),
      'reference': _0xb2a951["get"](_0x1b2e7a),
      'scopeRequirement': {
        'scope': normalizePersonReplacementScope(_0x2a2f2e["replacementScope"])
      }
    });
  });
  if (_0x5e368f["length"]) {
    _0x30e2ca['push']("单次最多替换 8 个目标人物");
  }
  const _0x728d0c = _0x19f9ba && _0x74c123["length"] && _0x447281 ? {
    'sourceRef': _0x447281,
    'people': _0x74c123["map"](({
      person: _0x103aac,
      sourceLabel: _0x45a13b,
      reference: _0xfc9ba2
    }) => ({
      'label': _0x45a13b['replace']('人物', ''),
      'referenceSlot': _0xfc9ba2["slot"],
      'markerIndex': _0x103aac['promptMarkerIndex'],
      'bbox': getPersonBoundingBox(_0x103aac)
    }))
  } : null;
  const _0x1fa8a1 = _0x2fa3d4 && !_0x19f9ba && _0x74c123["length"] && _0x447281 ? {
    'frame': _0xd48882["frame"],
    'people': _0x74c123['map'](({
      person: _0x41a164,
      sourceLabel: _0x4dc8af
    }) => ({
      'label': _0x4dc8af['replace']('人物', ''),
      'markerIndex': _0x41a164["promptMarkerIndex"],
      'bbox': getPersonBoundingBox(_0x41a164)
    }))
  } : null;
  const _0xfd3e8 = _0x1fa8a1 ? _0x16e1f0['length'] + 0x1 : 0x0;
  if (_0x1fa8a1) {
    _0x43972a({
      'slot': _0xfd3e8,
      'label': '图' + _0xfd3e8,
      'role': 'person-location-guide',
      'ref': buildPersonReplacementLocationGuideSvg(_0x1fa8a1)["dataUrl"]
    });
  }
  const _0x30494f = resolveSceneReference(_0x4088cb, _0xd48882);
  let _0x5adf34 = 0x0;
  if (_0x30494f?.["scene"] && _0x30494f["imageRef"]) {
    _0x5adf34 = _0x43972a({
      'ref': _0x30494f["imageRef"],
      'role': 'target-scene',
      'targetSceneId': _0x30494f['sceneId'],
      'targetSceneAppearanceId': _0x30494f["appearanceId"]
    })["slot"];
  } else {
    _0x30494f?.["sceneId"] && !_0xbcaee6 && _0x30e2ca['push'](_0x30494f['scene'] ? '场景缺少参考图：' + _0x30494f["scene"]['name'] : "未找到场景：" + _0x30494f["sceneId"]);
  }
  const _0x4788e2 = _0x36af00["filter"](getPersonBoundingBox)["sort"](comparePeopleByPosition);
  const _0x155968 = new Map(_0x74c123["map"](_0x871b74 => [_0x871b74["person"]['id'], _0x871b74]));
  const _0xf342d8 = _0xbcaee6 ? [] : _0x4788e2['map']((_0x1db929, _0x160dc3) => {
    const _0x13ea59 = _0x155968["get"](_0x1db929['id']);
    const _0x321c5e = getPersonReplacementPromptMarker(_0xd48882["replacementPromptMode"], _0x2fa3d4 ? _0x1db929["promptMarkerIndex"] : _0x160dc3, _0x4788e2["length"], _0x13ea59?.['reference']["slot"]);
    _0x2fa3d4 && (_0x321c5e["label"] = resolvePersonReplacementPromptLabel(_0x1db929)["replace"]('人物', ''));
    if (_0x13ea59) {
      _0x13ea59["marker"] = _0x321c5e;
    }
    return {
      ..._0x321c5e,
      'personId': _0x1db929['id'],
      'bbox': getPersonBoundingBox(_0x1db929)
    };
  });
  const _0x4ca0a4 = _0xbcaee6 ? '' : _0x74c123["length"] ? buildPersonReplacementPositioningPrompt(_0x74c123, _0x5adf34, _0xd48882["replacementPromptMode"], _0xfd3e8) : ["图1是待修改的原图，保持人物和构图。", _0x5adf34 ? "仅将背景替换为图" + _0x5adf34 + "中的场景，不引用其中人物。" : '']["filter"](Boolean)["join"]('\x0a');
  return {
    'promptMode': _0xd48882["replacementPromptMode"],
    'locationGuide': _0x1fa8a1,
    'annotatedSource': _0x728d0c,
    'personMarkers': _0xf342d8,
    'prompt': _0x4ca0a4,
    'bindingPrompt': _0x4ca0a4,
    'guidedBindingPrompt': _0x4ca0a4,
    'bindings': _0x74c123['map'](({
      person: _0x12608e,
      sourceLabel: _0x352a26,
      reference: _0x4a2b8f,
      scopeRequirement: _0x606e09,
      marker: _0x1c5544
    }) => ({
      'bbox': getPersonBoundingBox(_0x12608e),
      'label': _0x352a26,
      'personId': _0x12608e['id'],
      'markerLabel': _0x1c5544?.["label"] || '',
      'referenceLabel': _0x4a2b8f["label"],
      'referenceSlot': _0x4a2b8f["slot"],
      'replacementScope': _0x606e09["scope"],
      'sourceCharacterId': _0x12608e["sourceCharacterId"],
      'targetAppearanceId': _0x4a2b8f["targetAppearanceId"],
      'targetCharacterId': _0x4a2b8f['targetCharacterId']
    })),
    'referenceImages': _0x16e1f0,
    'mappedPersonIds': _0x74c123['map'](({
      person: _0xc2a70c
    }) => _0xc2a70c['id']),
    'activePersonIds': _0xbcaee6 ? [] : _0x1b404d["map"](_0x27fbb6 => _0x27fbb6['id']),
    'preservedPersonIds': _0x2fa3d4 ? _0x36af00["filter"](_0x52b5e9 => !getTargetCharacterId(_0x52b5e9, _0x4e212d))["map"](_0x3b7470 => _0x3b7470['id']) : [],
    'unmappedPersonIds': _0x545d84,
    'missingLocatorPersonIds': _0x3727b3,
    'unresolvedOrientationPersonIds': _0x4989e9,
    'overflowPersonIds': _0x5e368f,
    'locationGuideSlot': _0xfd3e8,
    'sceneReferenceSlot': _0x5adf34,
    'warnings': _0x30e2ca
  };
}
export function compilePersonReplacementPrompt(_0x411ed3 = {}) {
  return buildPersonReplacementPromptPackage(_0x411ed3)["prompt"];
}