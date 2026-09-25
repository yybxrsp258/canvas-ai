import { isAdaptiveRatioLabel, pickClosestRatioForProviderModel, resolveAdaptiveSourceSize } from '../../../api/imageRatioPolicy.js';
import { resolveModelProvider } from '../../manifests/index.js';
import { normalizeCharacterAssetImageGenerationParams } from '../characterAssets/characterAssetImageGeneration.js';
import { applyWorkspaceCharacterAssetPromptPreset, WORKSPACE_CHARACTER_ASSET_PROMPT_PRESET_NONE_ID, WORKSPACE_CHARACTER_ASSET_PROMPT_PRESETS } from '../workspaceAssetPromptPresets.js';
import { getPersonReplacementImageResults, resolvePersonReplacementImageSourceRef, resolvePersonReplacementImageResultRef } from './personReplacementProject.js';
import { buildPersonReplacementPromptPackage } from './personReplacementPromptCompiler.js';
import { composePersonReplacementImagePrompt, PERSON_REPLACEMENT_PROMPT_MODE_TEST } from './personReplacementPromptMode.js';
import { localPathToUrl } from '../../utils/localMediaPath.js';
import { getPersonReplacementPromptReferenceReviewMessage } from './personReplacementPromptReferenceReview.js';
import { resolvePersonReplacementPromptMentionRef } from './personReplacementPromptMentions.js';
import { resolvePromptTextWithTextRefs, sanitizePromptHtmlForCommit } from '../nodePromptShared.js';
import { getRecoverablePersonReplacementGenerationTask, isPersonReplacementGenerationTaskActive, normalizePersonReplacementGenerationTaskIdentity } from './personReplacementGenerationTaskIdentity.js';
export const PERSON_REPLACEMENT_CHARACTER_ASSET_PROMPT_PRESETS = Object["freeze"](WORKSPACE_CHARACTER_ASSET_PROMPT_PRESETS["filter"](_0xec067e => [WORKSPACE_CHARACTER_ASSET_PROMPT_PRESET_NONE_ID, 'character-three-view', "character-three-view-face"]["includes"](_0xec067e['id'])));
const PERSON_REPLACEMENT_DEFAULT_ASSET_PROMPT_PRESET_ID = PERSON_REPLACEMENT_CHARACTER_ASSET_PROMPT_PRESETS['find'](_0x304629 => _0x304629['id'] === 'character-three-view')?.['id'] || PERSON_REPLACEMENT_CHARACTER_ASSET_PROMPT_PRESETS[0x0]?.['id'] || "character-three-view";
const PERSON_REPLACEMENT_IMAGE_GENERATION_STATUSES = new Set(["idle", "queued", 'submitting', "running", 'succeeded', "failed"]);
function normalizeText(_0x2e8f12) {
  return String(_0x2e8f12 ?? '')["trim"]();
}
function normalizePromptEnhancementSnapshot(_0x522cfa = {}) {
  const _0xb6be3c = _0x522cfa && typeof _0x522cfa === "object" && !Array["isArray"](_0x522cfa) ? _0x522cfa : {};
  const _0x2fed38 = normalizeText(_0xb6be3c["prompt"]);
  if (!_0x2fed38) {
    return null;
  }
  return {
    'prompt': _0x2fed38,
    'modelId': normalizeText(_0xb6be3c['modelId']),
    'provider': normalizeText(_0xb6be3c['provider']),
    'providerProfileId': normalizeText(_0xb6be3c['providerProfileId']),
    'createdAt': normalizeText(_0xb6be3c['createdAt']),
    'analysis': _0xb6be3c["analysis"] && typeof _0xb6be3c["analysis"] === "object" && !Array["isArray"](_0xb6be3c["analysis"]) ? _0xb6be3c['analysis'] : {}
  };
}
function getPositiveSize(_0x26ebdf = {}) {
  const _0x1e42ef = Number(_0x26ebdf?.["width"]);
  const _0x11a805 = Number(_0x26ebdf?.["height"]);
  return Number["isFinite"](_0x1e42ef) && _0x1e42ef > 0x0 && Number["isFinite"](_0x11a805) && _0x11a805 > 0x0 ? {
    'width': _0x1e42ef,
    'height': _0x11a805
  } : null;
}
function stableSerialize(_0xc4c459) {
  if (_0xc4c459 === null || typeof _0xc4c459 !== "object") {
    return JSON["stringify"](_0xc4c459);
  }
  if (Array["isArray"](_0xc4c459)) {
    return '[' + _0xc4c459["map"](_0x5ea956 => stableSerialize(_0x5ea956))["join"](',') + ']';
  }
  return '{' + Object['keys'](_0xc4c459)['filter'](_0x235cd7 => _0xc4c459[_0x235cd7] !== undefined)["sort"]()["map"](_0x235747 => JSON['stringify'](_0x235747) + ':' + stableSerialize(_0xc4c459[_0x235747]))['join'](',') + '}';
}
export function createPersonReplacementImagePromptRequestResolver({
  documentObject = null
} = {}) {
  return ({
    project = {},
    shot = {},
    promptPackage = {}
  } = {}) => {
    const _0x48ebb6 = getPersonReplacementPromptReferenceReviewMessage(shot, promptPackage);
    if (_0x48ebb6) {
      throw new Error(_0x48ebb6);
    }
    const _0x412447 = normalizeText(shot['imagePrompt']);
    const _0x6e17b8 = _0x412447 ? (documentObject || globalThis['document'])?.["createElement"]?.("div") : null;
    const _0x151d35 = [];
    let _0x93f1fc = _0x412447;
    _0x6e17b8 && (_0x6e17b8["innerHTML"] = sanitizePromptHtmlForCommit(_0x412447), _0x6e17b8["querySelectorAll"]?.(".ref-pill")['forEach'](_0x59a957 => {
      const _0x123fdb = resolvePersonReplacementPromptMentionRef(_0x59a957, {
        'project': project,
        'promptPackage': promptPackage,
        'shot': shot
      });
      const _0x401c4c = _0x149e80 => (localPathToUrl(_0x149e80["ref"]) || _0x149e80["ref"]) === _0x123fdb?.["url"];
      const _0x4e33ff = promptPackage["referenceImages"]?.["find"](_0x40e74c => _0x40e74c["slot"] === _0x123fdb?.["referenceSlot"]) || promptPackage['referenceImages']?.['find'](_0x4c876e => _0x401c4c(_0x4c876e) && (_0x4c876e['targetCharacterId'] || _0x4c876e["targetSceneId"]) === _0x123fdb?.["assetId"]) || promptPackage["referenceImages"]?.["find"](_0x401c4c);
      if (_0x4e33ff) {
        _0x59a957["replaceWith"](_0x6e17b8["ownerDocument"]['createTextNode']('图' + _0x4e33ff["slot"]));
      }
    }), _0x93f1fc = resolvePromptTextWithTextRefs({
      'promptEl': _0x6e17b8,
      'assetInputRefs': _0x151d35,
      'assetMediaCounts': {
        'image': promptPackage["referenceImages"]?.["length"] || 0x0,
        'video': 0x0,
        'audio': 0x0
      },
      'allowedAssetTypes': ["image"],
      'resolveAssetMentionRef': _0x403043 => resolvePersonReplacementPromptMentionRef(_0x403043, {
        'project': project,
        'promptPackage': promptPackage,
        'shot': shot
      }),
      'dedupeAssetMentions': !![]
    }));
    return {
      'savedPrompt': _0x412447,
      'requestPrompt': composePersonReplacementImagePrompt(promptPackage, _0x93f1fc),
      'promptAssetRefs': _0x151d35
    };
  };
}
export function createPersonReplacementImageGenerationMappingRevision({
  project = {},
  shot = {}
} = {}) {
  const _0x5c0628 = buildPersonReplacementPromptPackage({
    'project': project,
    'shot': shot
  });
  return stableSerialize({
    'shot': {
      'id': normalizeText(shot['id']),
      'keyframeRef': normalizeText(shot["keyframeRef"]),
      'imageSourceRef': resolvePersonReplacementImageSourceRef(shot),
      'frame': shot['frame'],
      'sceneReference': shot["sceneReference"],
      'people': (Array["isArray"](shot["people"]) ? shot["people"] : [])["map"](_0x438ec7 => ({
        'id': normalizeText(_0x438ec7['id']),
        'sourceCharacterId': normalizeText(_0x438ec7["sourceCharacterId"]),
        'targetCharacterId': normalizeText(_0x438ec7["targetCharacterId"]),
        'targetAppearanceId': normalizeText(_0x438ec7['targetAppearanceId']),
        'label': normalizeText(_0x438ec7['label']),
        'replacementScope': normalizeText(_0x438ec7["replacementScope"]),
        'bbox': _0x438ec7['locator']?.["bbox"] || _0x438ec7["bbox"]
      }))
    },
    'prompt': {
      'mode': _0x5c0628["promptMode"],
      'bindingPrompt': _0x5c0628["bindingPrompt"],
      'references': _0x5c0628["referenceImages"]['map'](_0x4ee864 => ({
        'role': normalizeText(_0x4ee864['role']),
        'ref': normalizeText(_0x4ee864["ref"]),
        'targetCharacterId': normalizeText(_0x4ee864["targetCharacterId"]),
        'targetAppearanceId': normalizeText(_0x4ee864["targetAppearanceId"]),
        'targetSceneId': normalizeText(_0x4ee864["targetSceneId"]),
        'targetSceneAppearanceId': normalizeText(_0x4ee864["targetSceneAppearanceId"])
      })),
      'unmappedPersonIds': _0x5c0628["unmappedPersonIds"],
      'missingLocatorPersonIds': _0x5c0628["missingLocatorPersonIds"],
      'unresolvedOrientationPersonIds': _0x5c0628["unresolvedOrientationPersonIds"],
      'overflowPersonIds': _0x5c0628["overflowPersonIds"]
    }
  });
}
export function createPersonReplacementImageGenerationRequestRevision({
  project = {},
  shot = {},
  payload = {},
  sourceImageSize = {}
} = {}) {
  const _0x2c6bb4 = shot["replacementPromptMode"] === "positioning" ? buildPersonReplacementPromptPackage({
    'project': project,
    'shot': shot
  }) : null;
  const _0x2c1c2a = _0x2c6bb4?.['locationGuideSlot'] || 0x0;
  const _0x32729f = _0x2c6bb4?.["referenceImages"][_0x2c1c2a - 0x1]?.["ref"] || '';
  return stableSerialize({
    'mappingRevision': createPersonReplacementImageGenerationMappingRevision({
      'project': project,
      'shot': shot
    }),
    'payload': shot["replacementPromptMode"] === PERSON_REPLACEMENT_PROMPT_MODE_TEST && payload["inputUrls"]?.["length"] ? {
      ...payload,
      'inputUrls': [resolvePersonReplacementImageSourceRef(shot), ...payload['inputUrls']["slice"](0x1)]
    } : _0x2c1c2a && payload["inputUrls"]?.["length"] ? {
      ...payload,
      'inputUrls': payload["inputUrls"]["map"]((_0x18d68c, _0x3fa751) => _0x3fa751 === _0x2c1c2a - 0x1 ? _0x32729f : _0x18d68c)
    } : payload,
    'sourceImageSize': getPositiveSize(sourceImageSize)
  });
}
export function appendPersonReplacementImageResult(_0x527d70 = {}, _0x2739 = {}) {
  const _0x642982 = getPersonReplacementImageResults(_0x527d70);
  const _0x1a373a = resolvePersonReplacementImageResultRef(_0x2739);
  const _0x4f06ec = _0x642982["findIndex"](_0x52dc98 => resolvePersonReplacementImageResultRef(_0x52dc98) === _0x1a373a);
  if (_0x4f06ec >= 0x0) {
    return {
      'results': _0x642982,
      'activeIndex': _0x4f06ec
    };
  }
  return {
    'results': [..._0x642982, {
      ..._0x2739
    }],
    'activeIndex': _0x642982["length"]
  };
}
export function normalizePersonReplacementAssetPromptPresetId(_0x1cb87e = '') {
  const _0x2961ac = PERSON_REPLACEMENT_CHARACTER_ASSET_PROMPT_PRESETS['find'](_0x2bd13c => _0x2bd13c['id'] === normalizeText(_0x1cb87e));
  return _0x2961ac?.['id'] || PERSON_REPLACEMENT_DEFAULT_ASSET_PROMPT_PRESET_ID;
}
export function applyPersonReplacementCharacterAssetPromptPreset(_0x3f60f6 = '', _0x48a93f = '') {
  const _0x7e6901 = normalizeText(_0x48a93f);
  const _0xadd81f = normalizeText(_0x3f60f6);
  if (!PERSON_REPLACEMENT_CHARACTER_ASSET_PROMPT_PRESETS["some"](_0x61fd63 => _0x61fd63['id'] === _0xadd81f)) {
    return _0x7e6901;
  }
  return applyWorkspaceCharacterAssetPromptPreset(_0xadd81f, _0x7e6901, {
    'hasImageInput': !![]
  });
}
export function resolveGeneratedPersonReplacementAppearanceName(_0x1e6e39 = '', _0x54a935 = 0x1) {
  const _0x5a324 = PERSON_REPLACEMENT_CHARACTER_ASSET_PROMPT_PRESETS["find"](_0x1468ed => _0x1468ed['id'] === normalizeText(_0x1e6e39));
  const _0x37aa3e = "形象 " + Math["max"](0x1, Number(_0x54a935) || 0x1);
  return _0x5a324?.["template"] ? normalizeText(_0x5a324['label']) || _0x37aa3e : _0x37aa3e;
}
export function normalizePersonReplacementImageGenerationState(_0x57d687 = {}, _0x3b3e1f = '') {
  const _0x259538 = _0x57d687 && typeof _0x57d687 === "object" && !Array['isArray'](_0x57d687) ? _0x57d687 : {};
  const _0x10d050 = normalizeText(_0x259538["status"])["toLowerCase"]();
  const _0x5b9c51 = normalizeText(_0x259538['requestId']);
  const _0x11ad14 = normalizePersonReplacementGenerationTaskIdentity(_0x259538);
  const _0x555985 = normalizePromptEnhancementSnapshot(_0x259538["promptEnhancement"]);
  return {
    'status': PERSON_REPLACEMENT_IMAGE_GENERATION_STATUSES["has"](_0x10d050) ? _0x10d050 : "idle",
    'shotId': normalizeText(_0x259538["shotId"]) || normalizeText(_0x3b3e1f),
    'error': normalizeText(_0x259538["error"]),
    ...(_0x5b9c51 ? {
      'requestId': _0x5b9c51
    } : {}),
    ...(_0x555985 ? {
      'promptEnhancement': _0x555985
    } : {}),
    ..._0x11ad14
  };
}
export function getRecoverablePersonReplacementImageTask(_0x4a5d6 = {}) {
  const _0x1fcb0b = normalizePersonReplacementImageGenerationState(_0x4a5d6);
  const _0x1c18b4 = getRecoverablePersonReplacementGenerationTask(_0x1fcb0b);
  return _0x1c18b4 && _0x1fcb0b["promptEnhancement"] ? {
    ..._0x1c18b4,
    'promptEnhancement': _0x1fcb0b["promptEnhancement"]
  } : _0x1c18b4;
}
export function normalizePersonReplacementImageGenerationsByShotId(_0x32d21c = {}, _0x564546 = [], _0x611912 = {}) {
  const _0x1044a5 = new Set((Array['isArray'](_0x564546) ? _0x564546 : [])["map"](_0x1659ca => normalizeText(_0x1659ca?.['id']))["filter"](Boolean));
  const _0x58d522 = _0x32d21c && typeof _0x32d21c === 'object' && !Array["isArray"](_0x32d21c) ? _0x32d21c : {};
  const _0x588558 = Object['fromEntries'](Object["entries"](_0x58d522)["flatMap"](([_0xb77bf0, _0x1c3c74]) => {
    const _0x113d71 = normalizeText(_0xb77bf0);
    if (!_0x1044a5["has"](_0x113d71)) {
      return [];
    }
    return [[_0x113d71, normalizePersonReplacementImageGenerationState(_0x1c3c74, _0x113d71)]];
  }));
  const _0x4017e0 = normalizePersonReplacementImageGenerationState(_0x611912);
  _0x1044a5["has"](_0x4017e0["shotId"]) && !_0x588558[_0x4017e0["shotId"]] && (_0x588558[_0x4017e0['shotId']] = _0x4017e0);
  return _0x588558;
}
export function resolvePersonReplacementImageGenerationState(_0x5adea9 = {}, _0xd4a393 = '') {
  const _0x53d06b = normalizeText(_0xd4a393);
  const _0x8ce622 = _0x5adea9?.['imageGenerationsByShotId']?.[_0x53d06b];
  if (_0x8ce622 && typeof _0x8ce622 === "object") {
    return normalizePersonReplacementImageGenerationState(_0x8ce622, _0x53d06b);
  }
  const _0x5dd233 = normalizePersonReplacementImageGenerationState(_0x5adea9?.['imageGeneration']);
  return _0x5dd233["shotId"] === _0x53d06b ? _0x5dd233 : normalizePersonReplacementImageGenerationState({}, _0x53d06b);
}
export function updatePersonReplacementImageGenerationState(_0x3b3c03 = {}, _0x2704ff = {}) {
  const _0x19dad8 = normalizePersonReplacementImageGenerationState(_0x2704ff);
  if (!_0x19dad8['shotId']) {
    return {
      ..._0x3b3c03
    };
  }
  const _0x2a3b6c = {
    ...(_0x3b3c03?.["imageGenerationsByShotId"] && typeof _0x3b3c03['imageGenerationsByShotId'] === "object" && !Array["isArray"](_0x3b3c03['imageGenerationsByShotId']) ? _0x3b3c03['imageGenerationsByShotId'] : {}),
    [_0x19dad8["shotId"]]: _0x19dad8
  };
  const _0x5e3929 = normalizePersonReplacementImageGenerationState(_0x3b3c03?.["imageGeneration"]);
  const _0x38676e = isPersonReplacementGenerationTaskActive(_0x5e3929) && isPersonReplacementGenerationTaskActive(_0x2a3b6c[_0x5e3929["shotId"]]) ? _0x2a3b6c[_0x5e3929["shotId"]] : null;
  const _0x1a0537 = Object["values"](_0x2a3b6c)["find"](isPersonReplacementGenerationTaskActive);
  const _0x20e6e6 = isPersonReplacementGenerationTaskActive(_0x19dad8) ? _0x19dad8 : _0x38676e || _0x1a0537 || _0x19dad8;
  return {
    ..._0x3b3c03,
    'imageGeneration': _0x20e6e6,
    'imageGenerationsByShotId': _0x2a3b6c
  };
}
function createImageGenerationUiRevision(_0x318b95 = {}, _0x1a5783 = '') {
  const _0x2a683d = normalizeText(_0x1a5783);
  const _0x5f027f = (Array['isArray'](_0x318b95?.["shots"]) ? _0x318b95["shots"] : [])["find"](_0x455ac0 => normalizeText(_0x455ac0?.['id']) === _0x2a683d);
  return JSON["stringify"]({
    'shotId': _0x2a683d,
    'replacementImageRef': normalizeText(_0x5f027f?.["replacementImageRef"]),
    'replacementImage': _0x5f027f?.["replacementImage"] || null,
    'error': normalizeText(_0x5f027f?.["error"]),
    'generation': resolvePersonReplacementImageGenerationState(_0x318b95?.["workspace"], _0x2a683d)
  });
}
function createImageGenerationTimelineRevision(_0x2090c8 = {}) {
  return JSON["stringify"]((Array["isArray"](_0x2090c8?.["shots"]) ? _0x2090c8["shots"] : [])['map'](_0x4e69eb => createImageGenerationUiRevision(_0x2090c8, _0x4e69eb?.['id'])));
}
export function resolvePersonReplacementImageGenerationUiRefreshScope(_0x5bf79c = {}, _0x58f9c5 = {}) {
  const _0xfe48b = normalizeText(_0x58f9c5?.["workspace"]?.["selectedShotId"]);
  if (createImageGenerationUiRevision(_0x5bf79c, _0xfe48b) !== createImageGenerationUiRevision(_0x58f9c5, _0xfe48b)) {
    return "selected-shot";
  }
  return createImageGenerationTimelineRevision(_0x5bf79c) !== createImageGenerationTimelineRevision(_0x58f9c5) ? "timeline" : '';
}
export function resolvePersonReplacementImageGenerationParams({
  modelId = '',
  provider = '',
  generationParams = {},
  sourceImageSize = {},
  shot = {}
} = {}) {
  const _0x2a9c6f = normalizeText(modelId);
  const _0x116a96 = resolveModelProvider(_0x2a9c6f, provider);
  const _0x2131f = normalizeCharacterAssetImageGenerationParams(_0x2a9c6f, generationParams);
  const _0x56ee5f = _0x2131f["aspectRatio"];
  if (!isAdaptiveRatioLabel(_0x56ee5f)) {
    return {
      'provider': _0x116a96,
      'generationParams': _0x2131f,
      'requestedAspectRatio': _0x56ee5f,
      'resolvedAspectRatio': _0x56ee5f,
      'adaptiveSource': "explicit"
    };
  }
  const _0x27d242 = getPositiveSize(sourceImageSize) || getPositiveSize(shot?.['frame']) || {
    'width': 0x0,
    'height': 0x0
  };
  const _0x3c2c2a = resolveAdaptiveSourceSize({
    'inputWidth': _0x27d242["width"],
    'inputHeight': _0x27d242["height"]
  });
  const _0x3f9505 = pickClosestRatioForProviderModel({
    'provider': _0x116a96,
    'model': _0x2a9c6f,
    'width': _0x3c2c2a["width"],
    'height': _0x3c2c2a["height"],
    'imageSize': _0x2131f["imageSize"]
  });
  return {
    'provider': _0x116a96,
    'generationParams': {
      ..._0x2131f,
      'aspectRatio': _0x3f9505
    },
    'requestedAspectRatio': _0x56ee5f,
    'resolvedAspectRatio': _0x3f9505,
    'adaptiveSource': _0x3c2c2a["source"]
  };
}