import { discardStaleStoryEpisodeSplitTransportDraft, ensureUniqueStoryEpisodeClipIds, normalizeStoryAssetDisplayName, normalizeStoryCharacterRole, syncStoryEpisodeClipDialogueMentions } from './storyPlanningData.js';
import { normalizeStoryClipFrames } from './storyClipFrames.js';
import { buildCanvasLocalImageFields, resolveCanvasImagePreviewUrl } from '../../services/canvasMediaLocalService.js';
import { sanitizeStoryAssetPublicDescriptionText, sanitizeStoryAssetPublicPromptText, stripStoryAssetInternalEvidenceMetadata } from '../../../api/utils/storyAssetPublicText.js';
import { getWorkspaceAssetAppearance, getWorkspaceAssetAppearances, getWorkspaceAssetAppearanceStats, getWorkspaceAssetBaseAppearance } from '../workspaceAssetAppearance.js';
import { readStorySerialExecution } from './storySerialExecutionPreference.js';
function normalizeText(_0xdfabe3) {
  return String(_0xdfabe3 || '')["trim"]();
}
export const STORY_ASSET_STYLE_REFERENCE_MENTION = "@风格参考";
export const STORY_ASSET_REFERENCE_PROMPT_SUFFIX = '参考' + STORY_ASSET_STYLE_REFERENCE_MENTION + "的图片风格生成形象";
export function appendStoryAssetReferencePrompt(_0x22ec52 = '') {
  const _0x251606 = normalizeText(_0x22ec52);
  const _0x4471b4 = normalizeText(_0x251606["split"](STORY_ASSET_REFERENCE_PROMPT_SUFFIX)["join"](''));
  return [_0x4471b4, STORY_ASSET_REFERENCE_PROMPT_SUFFIX]['filter'](Boolean)['join']('\x0a');
}
export function compileStoryAssetReferencePrompt(_0x129bac = '') {
  return normalizeText(_0x129bac)["split"](STORY_ASSET_STYLE_REFERENCE_MENTION)['join']("@图片2");
}
export function setStoryAssetAppearanceReferenceImage(_0x1a4989 = null, _0x44391f = '') {
  const _0x481627 = _0x44391f && typeof _0x44391f === 'object' ? buildCanvasLocalImageFields(_0x44391f) : null;
  const _0x307432 = normalizeText(_0x481627 ? _0x481627["imageUrl"] : _0x44391f);
  if (!_0x1a4989 || typeof _0x1a4989 !== "object" || !_0x307432) {
    return ![];
  }
  _0x1a4989["referenceImage"] = _0x481627;
  _0x1a4989['referenceImageUrl'] = _0x307432;
  _0x1a4989['prompt'] = appendStoryAssetReferencePrompt(_0x1a4989['prompt']);
  _0x1a4989["error"] = '';
  return !![];
}
export function clearStoryAssetAppearanceReferenceImage(_0x3ed49e = null) {
  if (!_0x3ed49e || typeof _0x3ed49e !== 'object') {
    return ![];
  }
  const _0x5bb2be = Boolean(normalizeText(_0x3ed49e["referenceImageUrl"]));
  const _0x27c829 = normalizeText(normalizeText(_0x3ed49e["prompt"])["split"](STORY_ASSET_REFERENCE_PROMPT_SUFFIX)["join"]('')['split'](STORY_ASSET_STYLE_REFERENCE_MENTION)["join"](''));
  const _0x56aa3e = _0x27c829 !== normalizeText(_0x3ed49e["prompt"]);
  _0x3ed49e['referenceImageUrl'] = '';
  _0x3ed49e['referenceImage'] = null;
  _0x3ed49e['prompt'] = _0x27c829;
  return _0x5bb2be || _0x56aa3e;
}
function buildLegacyPrompt(_0x142f57 = {}) {
  return [sanitizeStoryAssetPublicPromptText(_0x142f57["description"]), sanitizeStoryAssetPublicPromptText(_0x142f57["prompt"])]["filter"](Boolean)['join']('\x0a');
}
export function normalizeStoryAssetAppearance(_0x2a9ac6 = {}, _0x2d8b49 = {}) {
  const _0x18343f = normalizeText(_0x2d8b49["assetId"]) || "asset";
  const _0x8b64b5 = Math['max'](0x0, Math["trunc"](Number(_0x2d8b49["index"]) || 0x0));
  const _0x33d210 = sanitizeStoryAssetPublicPromptText(_0x2a9ac6["prompt"]) || sanitizeStoryAssetPublicPromptText(_0x2d8b49["fallbackPrompt"]);
  return {
    ..._0x2a9ac6,
    'id': normalizeText(_0x2a9ac6['id']) || _0x18343f + '-appearance-' + (_0x8b64b5 + 0x1),
    'name': normalizeText(_0x2a9ac6["name"]) || (_0x8b64b5 === 0x0 ? "基础形象" : '形象\x20' + (_0x8b64b5 + 0x1)),
    'occurrences': normalizeText(_0x2a9ac6['occurrences']) || normalizeText(_0x2d8b49["occurrences"]) || "当前项目",
    'description': sanitizeStoryAssetPublicDescriptionText(_0x2a9ac6['description']),
    'scriptFacts': stripStoryAssetInternalEvidenceMetadata(_0x2a9ac6["scriptFacts"]),
    'visualDesign': stripStoryAssetInternalEvidenceMetadata(_0x2a9ac6["visualDesign"]),
    'prompt': _0x33d210,
    'imageUrl': normalizeText(_0x2a9ac6["imageUrl"]),
    'referenceImageUrl': normalizeText(_0x2a9ac6["referenceImageUrl"]),
    'error': normalizeText(_0x2a9ac6['error'])
  };
}
export function normalizeStoryAsset(_0xcb29ce = {}, _0x5df776 = 0x0) {
  const _0x1583a1 = normalizeText(_0xcb29ce['id']) || "story-asset-" + (_0x5df776 + 0x1);
  const _0x5b7d45 = ["scene", "prop"]["includes"](_0xcb29ce["kind"]) ? _0xcb29ce["kind"] : 'character';
  const _0x3f23e3 = normalizeStoryAssetDisplayName(_0xcb29ce['name'], _0x5b7d45, _0x5df776);
  const _0x1bed53 = Array["isArray"](_0xcb29ce["appearances"]) && _0xcb29ce['appearances']["length"] ? _0xcb29ce['appearances'] : [{
    'id': _0x1583a1 + "-appearance-1",
    'name': "基础形象",
    'occurrences': _0xcb29ce["occurrences"],
    'prompt': buildLegacyPrompt(_0xcb29ce),
    'imageUrl': _0xcb29ce["imageUrl"],
    'generatedImage': _0xcb29ce["generatedImage"]
  }];
  const _0x4de425 = _0x1bed53['map']((_0x5d6284, _0x9b0509) => normalizeStoryAssetAppearance(_0x5d6284, {
    'assetId': _0x1583a1,
    'index': _0x9b0509,
    'occurrences': _0xcb29ce['occurrences'],
    'fallbackPrompt': _0x9b0509 === 0x0 ? buildLegacyPrompt(_0xcb29ce) : ''
  }));
  const _0x5e29c7 = normalizeText(_0xcb29ce['baseAppearanceId']);
  const _0x162944 = _0x5b7d45 === "character" && _0x4de425["length"] > 0x1 ? _0x4de425["find"](_0x586ba9 => _0x586ba9['id'] === _0x5e29c7) || _0x4de425["find"](_0x520733 => _0x520733["isBaseAppearance"] === !![]) || _0x4de425["find"](_0x32dc81 => normalizeText(_0x32dc81["name"]) === "基础形象") || _0x4de425[0x0] : null;
  return {
    ..._0xcb29ce,
    'id': _0x1583a1,
    'kind': _0x5b7d45,
    'name': _0x3f23e3,
    'description': sanitizeStoryAssetPublicDescriptionText(_0xcb29ce["description"]),
    'scriptFacts': stripStoryAssetInternalEvidenceMetadata(_0xcb29ce["scriptFacts"]),
    'visualDesign': stripStoryAssetInternalEvidenceMetadata(_0xcb29ce["visualDesign"]),
    'prompt': sanitizeStoryAssetPublicPromptText(_0xcb29ce['prompt']),
    'role': _0x5b7d45 === "character" ? normalizeStoryCharacterRole(_0xcb29ce["role"], _0x3f23e3) : normalizeText(_0xcb29ce['role']),
    'baseAppearanceId': _0x162944?.['id'] || '',
    'appearances': _0x4de425
  };
}
export function normalizeStoryWorkspaceAssetData(_0xf86a3c = {}) {
  const _0x57897f = _0xf86a3c && typeof _0xf86a3c === 'object' ? _0xf86a3c : {};
  const _0x4517fe = _0x57897f['project']?.['sourceMode'] === 'video-replication';
  const _0x56fc2b = Array['isArray'](_0x57897f["assets"]) ? _0x57897f["assets"]["map"]((_0x1264ef, _0x1cc427) => normalizeStoryAsset(_0x1264ef, _0x1cc427)) : [];
  const _0xb1ef1a = Array['isArray'](_0x57897f['episodes']) ? _0x57897f["episodes"]["map"](_0x5c2d85 => {
    const _0x43f9df = discardStaleStoryEpisodeSplitTransportDraft(ensureUniqueStoryEpisodeClipIds(_0x5c2d85));
    return {
      ..._0x43f9df,
      'clips': Array["isArray"](_0x43f9df?.['clips']) ? _0x43f9df["clips"]["map"](_0x723840 => syncStoryEpisodeClipDialogueMentions(_0x723840, _0x56fc2b, {
        'includeDialogueVoiceGuidance': _0x4517fe,
        'sourceMode': _0x57897f["project"]?.["sourceMode"]
      })) : []
    };
  }) : [];
  return {
    ..._0x57897f,
    'assets': _0x56fc2b,
    'episodes': _0xb1ef1a,
    'clipFrames': normalizeStoryClipFrames(_0x57897f['clipFrames'])
  };
}
export function getStoryAssetAppearances(_0x363215 = {}) {
  return getWorkspaceAssetAppearances(_0x363215);
}
export function getStoryAssetAppearance(_0x4a8926 = {}, _0x477d35 = 0x0) {
  return getWorkspaceAssetAppearance(_0x4a8926, _0x477d35);
}
export function getStoryAssetBaseAppearance(_0x4516ab = {}) {
  return getWorkspaceAssetBaseAppearance(_0x4516ab);
}
export function getPreferredStoryAssetBaseAppearance(_0x1680ad = {}) {
  const _0x2f9b45 = getStoryAssetAppearances(_0x1680ad);
  return getStoryAssetBaseAppearance(_0x1680ad) || _0x2f9b45["find"](_0x39c0d0 => normalizeText(_0x39c0d0["name"]) === "基础形象") || _0x2f9b45[0x0] || null;
}
export function isStoryAssetBaseAppearance(_0x5e04eb = {}, _0x3e859f = null) {
  if (_0x5e04eb["kind"] !== "character" || !_0x3e859f) {
    return ![];
  }
  const _0x5870ed = getStoryAssetAppearances(_0x5e04eb);
  if (_0x5870ed["length"] === 0x1) {
    return normalizeText(_0x5870ed[0x0]?.['id']) === normalizeText(_0x3e859f['id']);
  }
  const _0x450b2a = getStoryAssetBaseAppearance(_0x5e04eb);
  return Boolean(_0x450b2a && normalizeText(_0x450b2a['id']) === normalizeText(_0x3e859f['id']));
}
export function isStoryAssetStyleReferenceSupported(_0x3f2a01 = {}) {
  return ["character", "scene", "prop"]['includes'](_0x3f2a01?.["kind"]);
}
export function canEditStoryAssetStyleReference(_0x5c1b2e = {}, _0x2d7f90 = null) {
  if (!_0x5c1b2e || _0x5c1b2e["isLibraryAsset"] || !_0x2d7f90) {
    return ![];
  }
  if (!isStoryAssetStyleReferenceSupported(_0x5c1b2e)) {
    return ![];
  }
  if (_0x5c1b2e["kind"] === "character") {
    return isStoryAssetBaseAppearance(_0x5c1b2e, _0x2d7f90);
  }
  return !![];
}
export function setStoryAssetBaseAppearance(_0x22369e = {}, _0x492e9a = '') {
  if (_0x22369e["kind"] !== "character" || getStoryAssetAppearances(_0x22369e)['length'] < 0x2) {
    return ![];
  }
  const _0x48bc35 = getStoryAssetAppearances(_0x22369e)["find"](_0x409fd1 => normalizeText(_0x409fd1['id']) === normalizeText(_0x492e9a));
  if (!_0x48bc35) {
    return ![];
  }
  _0x22369e["baseAppearanceId"] = _0x48bc35['id'];
  return !![];
}
export function ensureStoryAssetBaseAppearance(_0x3b1e02 = {}) {
  if (_0x3b1e02["kind"] !== "character" || getStoryAssetAppearances(_0x3b1e02)["length"] < 0x2) {
    return ![];
  }
  if (getStoryAssetBaseAppearance(_0x3b1e02)) {
    return ![];
  }
  const _0x18c603 = getPreferredStoryAssetBaseAppearance(_0x3b1e02);
  if (!_0x18c603) {
    return ![];
  }
  _0x3b1e02['baseAppearanceId'] = _0x18c603['id'];
  return !![];
}
export function shouldGenerateStoryAssetBaseAppearanceFirst(_0x4a332e = {}, _0x5e8c9c = null) {
  const _0x38392e = getStoryAssetAppearances(_0x4a332e);
  if (_0x4a332e["kind"] !== "character" || _0x38392e["length"] < 0x2) {
    return ![];
  }
  const _0x2914b4 = getPreferredStoryAssetBaseAppearance(_0x4a332e);
  if (!_0x2914b4 || normalizeText(_0x2914b4['imageUrl'])) {
    return ![];
  }
  return normalizeText(_0x2914b4['id']) !== normalizeText(_0x5e8c9c?.['id']);
}
export function resolveStoryAssetAppearanceOriginalUrl(_0x350d90 = {}) {
  const _0x36b83c = _0x350d90["generatedImages"]?.[Math["max"](0x0, Number(_0x350d90["activeIndex"]) || 0x0)] || _0x350d90["generatedImage"] || {};
  return resolveCanvasImagePreviewUrl(_0x36b83c) || normalizeText(_0x350d90['imageUrl']);
}
export function getStoryAssetAppearanceReferenceUrls(_0x25cde7 = {}, _0x2a647d = null) {
  const _0x412c00 = getStoryAssetAppearances(_0x25cde7);
  if (!isStoryAssetStyleReferenceSupported(_0x25cde7) || _0x412c00["length"] === 0x0) {
    return [];
  }
  if (_0x25cde7["kind"] !== "character") {
    const _0x2b7c1e = resolveCanvasImagePreviewUrl(_0x2a647d?.["referenceImage"] || {}) || normalizeText(_0x2a647d?.["referenceImageUrl"]);
    if (!normalizeText(_0x2a647d?.['id']) || !_0x2b7c1e) {
      return [];
    }
    return [resolveStoryAssetAppearanceOriginalUrl(_0x2a647d), _0x2b7c1e]["filter"](Boolean);
  }
  const _0x4cbbdf = _0x412c00['length'] === 0x1 ? _0x412c00[0x0] : getStoryAssetBaseAppearance(_0x25cde7);
  if (!_0x4cbbdf || !normalizeText(_0x2a647d?.['id'])) {
    return [];
  }
  if (normalizeText(_0x4cbbdf['id']) === normalizeText(_0x2a647d['id'])) {
    const _0x4c8338 = resolveCanvasImagePreviewUrl(_0x4cbbdf["referenceImage"] || {}) || normalizeText(_0x4cbbdf["referenceImageUrl"]);
    if (!_0x4c8338) {
      return [];
    }
    return [resolveStoryAssetAppearanceOriginalUrl(_0x4cbbdf), _0x4c8338]["filter"](Boolean);
  }
  if (!normalizeText(_0x4cbbdf["imageUrl"])) {
    return [];
  }
  return [resolveStoryAssetAppearanceOriginalUrl(_0x4cbbdf), resolveCanvasImagePreviewUrl(_0x2a647d["referenceImage"] || {}) || normalizeText(_0x2a647d["referenceImageUrl"])]["filter"](Boolean);
}
export function buildStoryAssetAppearanceGenerationTasks(_0x3785df = [], {
  includeExisting = ![]
} = {}) {
  return (Array["isArray"](_0x3785df) ? _0x3785df : [])['flatMap'](_0x56241d => {
    const _0x4c04fd = getStoryAssetAppearances(_0x56241d);
    const _0x5d6d52 = includeExisting ? _0x4c04fd : _0x4c04fd['filter'](_0x2713b2 => !normalizeText(_0x2713b2["imageUrl"]));
    if (_0x56241d['kind'] !== "character" || _0x4c04fd["length"] < 0x2) {
      return _0x5d6d52["map"](_0x45c97f => ({
        'asset': _0x56241d,
        'appearance': _0x45c97f
      }));
    }
    const _0x4b8787 = getPreferredStoryAssetBaseAppearance(_0x56241d);
    if (!_0x4b8787 || !includeExisting && normalizeText(_0x4b8787["imageUrl"])) {
      return _0x5d6d52["map"](_0x898dad => ({
        'asset': _0x56241d,
        'appearance': _0x898dad
      }));
    }
    return [..._0x5d6d52]["sort"]((_0x293e1f, _0x36b0af) => Number(_0x36b0af['id'] === _0x4b8787?.['id']) - Number(_0x293e1f['id'] === _0x4b8787?.['id']))["map"](_0x1326f6 => ({
      'asset': _0x56241d,
      'appearance': _0x1326f6
    }));
  });
}
export async function runStoryAssetAppearanceGenerationTasks(_0x233b95 = [], _0x2e95a9 = null, {
  shouldStop = () => ![]
} = {}) {
  if (typeof _0x2e95a9 !== "function") {
    return [];
  }
  const _0x285727 = new Map();
  (Array["isArray"](_0x233b95) ? _0x233b95 : [])["forEach"]((_0x766eae, _0x5aea72) => {
    const _0x4a8c28 = _0x766eae?.["asset"];
    const _0x3d76af = normalizeText(_0x4a8c28?.['id']) || _0x4a8c28 || 'story-asset-task-' + _0x5aea72;
    if (!_0x285727["has"](_0x3d76af)) {
      _0x285727['set'](_0x3d76af, []);
    }
    _0x285727["get"](_0x3d76af)["push"]({
      'task': _0x766eae,
      'taskIndex': _0x5aea72
    });
  });
  const _0x2d8b64 = new Array(Array["isArray"](_0x233b95) ? _0x233b95["length"] : 0x0);
  const _0x4a1ce8 = async _0x4f6632 => {
    for (let _0x4bcbe7 = 0x0; _0x4bcbe7 < _0x4f6632["length"]; _0x4bcbe7 += 0x1) {
      const {
        task: _0xef4ea1,
        taskIndex: _0x2c8e6b
      } = _0x4f6632[_0x4bcbe7];
      if (shouldStop({
        'task': _0xef4ea1,
        'taskIndex': _0x2c8e6b,
        'laneIndex': _0x4bcbe7,
        'laneLength': _0x4f6632["length"]
      })) {
        break;
      }
      _0x2d8b64[_0x2c8e6b] = await _0x2e95a9(_0xef4ea1, {
        'taskIndex': _0x2c8e6b,
        'laneIndex': _0x4bcbe7,
        'laneLength': _0x4f6632["length"],
        'remainingTasks': _0x4f6632["slice"](_0x4bcbe7 + 0x1)["map"](_0x4e529f => _0x4e529f["task"])
      });
    }
  };
  const _0x5d9a17 = [..._0x285727["values"]()];
  if (readStorySerialExecution()) {
    for (const _0x3b7f2d of _0x5d9a17) {
      await _0x4a1ce8(_0x3b7f2d);
    }
  } else {
    await Promise["all"](_0x5d9a17["map"](_0x4a1ce8));
  }
  return _0x2d8b64;
}
export function getStoryAssetAppearanceStats(_0x4859e1 = {}) {
  return getWorkspaceAssetAppearanceStats(_0x4859e1);
}