export const STORY_WORKSPACE_PERSISTENCE_VERSION = 0x1;
function cloneJson(_0x19ce56) {
  if (!_0x19ce56 || typeof _0x19ce56 !== 'object') {
    return _0x19ce56;
  }
  return JSON["parse"](JSON['stringify'](_0x19ce56));
}
function normalizeText(_0x5abb99) {
  return String(_0x5abb99 || '')["trim"]();
}
function normalizeEpisodeAssetRailTab(_0x249c5e) {
  const _0x568031 = normalizeText(_0x249c5e);
  return ["assets", "frames", 'library']["includes"](_0x568031) ? _0x568031 : "assets";
}
function clonePersistableStoryData(_0x2dbca3) {
  return filterPersistableStoryData(cloneJson(_0x2dbca3));
}
function filterPersistableStoryData(_0x188f42) {
  if (!_0x188f42 || typeof _0x188f42 !== "object") {
    return _0x188f42;
  }
  if (_0x188f42["project"]?.['sourceMode'] === "video-replication") {
    if (_0x188f42["project"]["replication"]) {
      delete _0x188f42["project"]["replication"]['requirements'];
    }
    for (const _0x1b067f of _0x188f42["episodes"] || []) {
      if (_0x1b067f["replication"]) {
        delete _0x1b067f['replication']['requirements'];
      }
    }
  }
  Array["isArray"](_0x188f42['clipFrames']) && (_0x188f42["clipFrames"] = _0x188f42["clipFrames"]["filter"](_0x3c7935 => _0x3c7935?.['captureSavePending'] !== !![] && _0x3c7935?.["isTransient"] !== !![] && ![_0x3c7935?.["imageUrl"], _0x3c7935?.["videoUrl"], _0x3c7935?.['thumbUrl'], _0x3c7935?.["posterUrl"]]["some"](_0x219226 => normalizeText(_0x219226)["startsWith"]("blob:"))));
  return _0x188f42;
}
function clonePersistableProjects(_0x892311) {
  return (Array['isArray'](_0x892311) ? _0x892311 : [])["map"](_0x62c7c0 => {
    const _0x41b3f1 = cloneJson(_0x62c7c0);
    if (_0x41b3f1?.["data"]) {
      _0x41b3f1['data'] = filterPersistableStoryData(_0x41b3f1["data"]);
    }
    return _0x41b3f1;
  });
}
export function createStoryWorkspaceSnapshot(_0x372672 = {}) {
  const _0x454841 = Array['isArray'](_0x372672["projects"]) ? _0x372672["projects"] : [];
  return {
    'schemaVersion': STORY_WORKSPACE_PERSISTENCE_VERSION,
    'savedAt': Date["now"](),
    'activeProjectId': normalizeText(_0x372672['data']?.["project"]?.['id']),
    'hasCreatedProject': _0x372672["hasCreatedProject"] === !![],
    'projectTitleEdited': _0x372672["projectTitleEdited"] === !![],
    'projects': clonePersistableProjects(_0x454841),
    'currentData': clonePersistableStoryData(_0x372672["data"]),
    'models': cloneJson(_0x372672["models"] || {}),
    'modelProviders': {
      'text': normalizeText(_0x372672["textProvider"]),
      'image': normalizeText(_0x372672["imageProvider"]),
      'video': normalizeText(_0x372672["videoProvider"])
    },
    'modelProviderProfiles': {
      'text': normalizeText(_0x372672["textProviderProfileId"]),
      'video': normalizeText(_0x372672["videoProviderProfileId"]),
      'videoByModel': cloneJson(_0x372672["videoProviderProfileIdByModel"] || {})
    },
    'splitTextModel': _0x372672["splitTextModel"]?.["modelId"] ? {
      'modelId': normalizeText(_0x372672["splitTextModel"]["modelId"]),
      'provider': normalizeText(_0x372672["splitTextModel"]["provider"]),
      'providerProfileId': normalizeText(_0x372672["splitTextModel"]["providerProfileId"])
    } : null,
    'modelParams': {
      'image': cloneJson(_0x372672['imageGenerationParams'] || {}),
      'imageByModel': cloneJson(_0x372672["imageGenerationParamsByModel"] || {}),
      'video': cloneJson(_0x372672["videoGenerationParams"] || {}),
      'videoByModel': cloneJson(_0x372672['videoGenerationParamsByModel'] || {})
    },
    'ui': {
      'view': normalizeText(_0x372672["view"]) || "home",
      'step': _0x372672["step"] === 0x0 ? 0x0 : Number(_0x372672['step']) || 0x1,
      'homeTab': ['upload', "generate", "collaborate", "replication"]["includes"](_0x372672['homeTab']) ? _0x372672["homeTab"] : "upload",
      'replicationTargetLocale': normalizeText(_0x372672["replicationTargetLocale"]) || "zh-CN",
      'scriptMode': _0x372672['scriptMode'] === "narration" ? "narration" : "plot",
      'uploadInputMode': _0x372672["uploadInputMode"] === 'paste' ? "paste" : "file",
      'idea': String(_0x372672["idea"] || ''),
      'scriptFileName': String(_0x372672["scriptFileName"] || ''),
      'scriptText': String(_0x372672["scriptText"] || ''),
      'scriptCharacterCount': Number['isFinite'](_0x372672["scriptCharacterCount"]) ? _0x372672["scriptCharacterCount"] : null,
      'assetFilter': normalizeText(_0x372672["assetFilter"]) || "character",
      'assetSplitRatio': Number(_0x372672["assetSplitRatio"]) || 0x32,
      'assetDetailSplitRatio': Number(_0x372672['assetDetailSplitRatio']) || 0x32,
      'episodeAssetPanelRatio': Number(_0x372672["episodeAssetPanelRatio"]) || 0x16,
      'episodeEditorPanelRatio': Number(_0x372672['episodeEditorPanelRatio']) || 0x22,
      'episodeAssetRailTab': normalizeEpisodeAssetRailTab(_0x372672["episodeAssetRailTab"]),
      'assetAppearanceIndexes': cloneJson(_0x372672["assetAppearanceIndexes"] || {}),
      'outlineSectionOpenState': cloneJson(_0x372672["outlineSectionOpenState"] || {}),
      'pageScrollPositions': cloneJson(_0x372672["pageScrollPositions"] || {}),
      'experimentalSplitMode': _0x372672["experimentalSplitMode"] === !![],
      'selectedAssetId': normalizeText(_0x372672['selectedAssetId']),
      'selectedEpisodeId': normalizeText(_0x372672['selectedEpisodeId']),
      'selectedClipId': normalizeText(_0x372672["selectedClipId"]),
      'characterVoiceEditor': _0x372672['characterVoiceEditor'] ? {
        ...cloneJson(_0x372672['characterVoiceEditor']),
        'isGenerating': ![]
      } : null
    }
  };
}
export function normalizeStoryWorkspaceSnapshot(_0x76efa5) {
  if (!_0x76efa5 || typeof _0x76efa5 !== "object" || Array["isArray"](_0x76efa5)) {
    return null;
  }
  if (Number(_0x76efa5["schemaVersion"]) !== STORY_WORKSPACE_PERSISTENCE_VERSION) {
    return null;
  }
  if (!_0x76efa5["currentData"]?.["project"] || !Array["isArray"](_0x76efa5["currentData"]?.["episodes"])) {
    return null;
  }
  const _0xb0d731 = _0x76efa5['ui'] && typeof _0x76efa5['ui'] === "object" ? cloneJson(_0x76efa5['ui']) : {};
  delete _0xb0d731["replicationRequirements"];
  return {
    ..._0x76efa5,
    'projects': clonePersistableProjects(_0x76efa5['projects']),
    'currentData': clonePersistableStoryData(_0x76efa5["currentData"]),
    'models': _0x76efa5["models"] && typeof _0x76efa5["models"] === 'object' ? cloneJson(_0x76efa5["models"]) : {},
    'modelProviders': _0x76efa5["modelProviders"] && typeof _0x76efa5["modelProviders"] === "object" ? cloneJson(_0x76efa5["modelProviders"]) : {},
    'modelProviderProfiles': _0x76efa5['modelProviderProfiles'] && typeof _0x76efa5["modelProviderProfiles"] === "object" ? cloneJson(_0x76efa5["modelProviderProfiles"]) : {},
    'modelParams': _0x76efa5["modelParams"] && typeof _0x76efa5["modelParams"] === "object" ? cloneJson(_0x76efa5['modelParams']) : {},
    'ui': _0xb0d731
  };
}
export function isEmptyStoryWorkspaceSnapshotPayload(_0x3644ab) {
  return _0x3644ab == null || typeof _0x3644ab === "object" && !Array['isArray'](_0x3644ab) && Object['keys'](_0x3644ab)["length"] === 0x0;
}
export function parseStoryWorkspaceSnapshotPayload(_0x38cd4e) {
  const _0x1141a6 = normalizeStoryWorkspaceSnapshot(_0x38cd4e);
  if (!_0x1141a6 && !isEmptyStoryWorkspaceSnapshotPayload(_0x38cd4e)) {
    throw new Error('剧本工作室存档格式无效');
  }
  return _0x1141a6;
}
export function mergeStoryWorkspaceHydratedProjects(_0x1527a5 = [], _0x342f11 = []) {
  const _0x1511d3 = Array['isArray'](_0x1527a5) ? [..._0x1527a5] : [];
  const _0x18a26f = _0x41650b => String(_0x41650b?.['id'] || _0x41650b?.["data"]?.["project"]?.['id'] || '')["trim"]();
  const _0x27b2dd = new Set(_0x1511d3["map"](_0x18a26f));
  (Array["isArray"](_0x342f11) ? _0x342f11 : [])["forEach"](_0x52e23f => {
    const _0x4795d6 = _0x18a26f(_0x52e23f);
    if (!_0x4795d6 || _0x27b2dd["has"](_0x4795d6)) {
      return;
    }
    _0x1511d3["push"](_0x52e23f);
    _0x27b2dd['add'](_0x4795d6);
  });
  return _0x1511d3;
}
export function hasStoryWorkspaceSnapshotChanged(_0x5b59bc, _0x2387ec) {
  if (_0x5b59bc === _0x2387ec) {
    return ![];
  }
  if (!_0x5b59bc || !_0x2387ec) {
    return !![];
  }
  try {
    const _0x482c58 = cloneJson(_0x5b59bc);
    const _0x3d002d = cloneJson(_0x2387ec);
    delete _0x482c58['savedAt'];
    delete _0x3d002d["savedAt"];
    return JSON["stringify"](_0x482c58) !== JSON["stringify"](_0x3d002d);
  } catch {
    return !![];
  }
}