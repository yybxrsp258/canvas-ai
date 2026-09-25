import { getWorkspaceProjectHomeEntries, normalizeWorkspaceProjectSortOrder } from '../workspaceProjectHome.js';
import { canEnterStoryWorkspaceStep, normalizeStoryWorkspaceStep } from './storyWorkspaceNavigationTransaction.js';
import { normalizeStoryAssetDetailSplitRatio, normalizeStoryAssetSplitRatio, normalizeStoryEpisodePanelRatios } from './storyWorkspaceInteractions.js';
import { settleInterruptedStoryVideoReplication } from './storyVideoReplication.js';
export const STORY_ASSET_TAB_LABELS = Object["freeze"]({
  'character': '角色',
  'scene': '场景',
  'prop': '道具',
  'library': "总素材"
});
const STORY_EPISODE_ASSET_RAIL_TABS = new Set(['assets', "frames", "library"]);
function normalizeText(_0x37686c) {
  return String(_0x37686c || '')['trim']();
}
export function normalizeStoryEpisodeAssetRailTab(_0x54171d) {
  const _0x2d53f4 = normalizeText(_0x54171d);
  return STORY_EPISODE_ASSET_RAIL_TABS['has'](_0x2d53f4) ? _0x2d53f4 : "assets";
}
export function removeStoryProjectEntry(_0x38052a = [], _0x39031 = '') {
  const _0x4daff3 = normalizeText(_0x39031);
  if (!_0x4daff3 || !Array["isArray"](_0x38052a)) {
    return Array['isArray'](_0x38052a) ? [..._0x38052a] : [];
  }
  return _0x38052a["filter"](_0x5f48ef => normalizeText(_0x5f48ef?.['id'] || _0x5f48ef?.["data"]?.["project"]?.['id']) !== _0x4daff3);
}
export function normalizeStoryProjectSortOrder(_0x3aca42) {
  return normalizeWorkspaceProjectSortOrder(_0x3aca42);
}
export function getStoryProjectHomeEntries(_0x3c34bb = [], {
  query = '',
  sortOrder = "updated-desc",
  showArchived = ![]
} = {}) {
  return getWorkspaceProjectHomeEntries(_0x3c34bb, {
    'query': query,
    'sortOrder': sortOrder,
    'showArchived': showArchived
  });
}
function hasStoryProjectClipVideoResult(_0x120dfe = {}) {
  if (normalizeText(_0x120dfe?.["result"]?.["videoUrl"] || _0x120dfe?.["videoUrl"] || _0x120dfe?.["resultUrl"])) {
    return !![];
  }
  return (Array['isArray'](_0x120dfe?.["video"]?.["results"]) ? _0x120dfe["video"]["results"] : [])['some'](_0x3f5972 => normalizeText(_0x3f5972?.["videoUrl"] || _0x3f5972?.['url'] || _0x3f5972?.["displayUrl"] || _0x3f5972?.['localPath'] || _0x3f5972?.["displayLocalPath"]));
}
function resetStoryProjectCopyClipRuntime(_0x543851 = {}) {
  const _0x503afa = {
    ..._0x543851
  };
  const _0x195afc = hasStoryProjectClipVideoResult(_0x503afa);
  const _0x25bbeb = _0x503afa["generation"] && typeof _0x503afa["generation"] === "object" ? {
    ..._0x503afa["generation"]
  } : null;
  if (_0x25bbeb) {
    const _0x2049d6 = normalizeText(_0x25bbeb["status"])["toLowerCase"]();
    const _0x369fff = ['pending', 'queued', "recovering", "running", "submitting"]["includes"](_0x2049d6);
    _0x503afa['generation'] = {
      ..._0x25bbeb,
      ...(_0x369fff ? {
        'status': _0x195afc ? 'succeeded' : 'idle'
      } : {}),
      'taskId': '',
      'remoteTaskId': '',
      'startedAt': 0x0
    };
  }
  if (_0x503afa["result"] && typeof _0x503afa["result"] === "object") {
    const _0x1fd36a = {
      ..._0x503afa["result"]
    };
    const _0x2a5c81 = normalizeText(_0x1fd36a['status'])['toLowerCase']();
    const _0x4543cb = ['pending', "queued", "recovering", "running", "submitting"]["includes"](_0x2a5c81);
    _0x503afa["result"] = {
      ..._0x1fd36a,
      ...(_0x4543cb ? {
        'status': _0x195afc ? "succeeded" : "idle"
      } : {}),
      'taskId': ''
    };
  }
  return _0x503afa;
}
export function duplicateStoryProjectEntry(_0x5b8fb0 = {}, {
  projectId = '',
  now = Date["now"]()
} = {}) {
  const _0x15ee33 = _0x5b8fb0 && typeof _0x5b8fb0 === "object" && !Array['isArray'](_0x5b8fb0) ? _0x5b8fb0 : null;
  const _0x3cd26e = _0x15ee33?.['data'];
  if (!_0x3cd26e?.["project"]) {
    return null;
  }
  const _0x26f1bb = normalizeText(projectId) || "story-" + Math["max"](0x1, Number(now) || Date["now"]()) + "-copy";
  const _0x2e0aaa = JSON["parse"](JSON["stringify"](_0x15ee33));
  const _0x271fda = (normalizeText(_0x3cd26e["project"]["title"] || _0x15ee33["title"]) || "未命名故事") + '\x20副本';
  const _0x26f742 = _0x2e0aaa["data"];
  _0x26f742["project"] = {
    ..._0x26f742["project"],
    'id': _0x26f1bb,
    'title': _0x271fda,
    'backgroundTasks': []
  };
  _0x26f742["project"]['summaryStatus'] === "generating" && (_0x26f742['project']["summaryStatus"] = normalizeText(_0x26f742["project"]["summary"]) ? "completed" : 'pending');
  _0x26f742["project"]["outlineStatus"] === 'generating' && (_0x26f742['project']["outlineStatus"] = Array['isArray'](_0x26f742["episodes"]) && _0x26f742["episodes"]["length"] ? "completed" : "pending");
  _0x26f742['episodes'] = (Array["isArray"](_0x26f742["episodes"]) ? _0x26f742["episodes"] : [])['map'](_0x928036 => ({
    ..._0x928036,
    'clips': (Array["isArray"](_0x928036?.['clips']) ? _0x928036["clips"] : [])['map'](resetStoryProjectCopyClipRuntime)
  }));
  settleInterruptedStoryVideoReplication(_0x26f742, {
    'message': "副本不会继续原项目中的视频解析任务，请点击重试。"
  });
  return {
    ..._0x2e0aaa,
    'id': _0x26f1bb,
    'title': _0x271fda,
    'createdAt': Number(now) || Date["now"](),
    'updatedAt': Number(now) || Date["now"](),
    'archivedAt': 0x0,
    'projectTitleEdited': !![],
    'data': _0x26f742
  };
}
function cloneStoryProjectUiValue(_0x56068b, _0x3147e8) {
  if (!_0x56068b || typeof _0x56068b !== "object") {
    return _0x3147e8;
  }
  try {
    return JSON["parse"](JSON["stringify"](_0x56068b));
  } catch {
    return _0x3147e8;
  }
}
export function normalizeStoryProjectVoiceEditor(_0x337ff1, _0xfc67c3) {
  const _0x3a5906 = cloneStoryProjectUiValue(_0x337ff1, null);
  if (!_0x3a5906 || Array["isArray"](_0x3a5906)) {
    return null;
  }
  const _0x499afd = normalizeText(_0x3a5906['assetId']);
  const _0x483803 = (Array["isArray"](_0xfc67c3?.["assets"]) ? _0xfc67c3["assets"] : [])["find"](_0x38f758 => normalizeText(_0x38f758?.['id']) === _0x499afd && _0x38f758?.['kind'] === "character");
  if (!_0x483803) {
    return null;
  }
  return {
    ..._0x3a5906,
    'assetId': _0x499afd,
    'isGenerating': ![]
  };
}
export function createStoryProjectUiState(_0x371b5d = {}) {
  return {
    'view': _0x371b5d['view'] === "episode" ? "episode" : "project",
    'step': normalizeStoryWorkspaceStep(_0x371b5d['step']),
    'assetFilter': Object['hasOwn'](STORY_ASSET_TAB_LABELS, _0x371b5d["assetFilter"]) ? _0x371b5d["assetFilter"] : "character",
    'assetSplitRatio': normalizeStoryAssetSplitRatio(_0x371b5d["assetSplitRatio"]),
    'assetDetailSplitRatio': normalizeStoryAssetDetailSplitRatio(_0x371b5d["assetDetailSplitRatio"]),
    'episodeAssetPanelRatio': normalizeStoryEpisodePanelRatios(_0x371b5d["episodeAssetPanelRatio"], _0x371b5d["episodeEditorPanelRatio"])['left'],
    'episodeEditorPanelRatio': normalizeStoryEpisodePanelRatios(_0x371b5d["episodeAssetPanelRatio"], _0x371b5d["episodeEditorPanelRatio"])["center"],
    'episodeAssetRailTab': normalizeStoryEpisodeAssetRailTab(_0x371b5d["episodeAssetRailTab"]),
    'assetAppearanceIndexes': cloneStoryProjectUiValue(_0x371b5d["assetAppearanceIndexes"], {}),
    'outlineSectionOpenState': cloneStoryProjectUiValue(_0x371b5d["outlineSectionOpenState"], {}),
    'pageScrollPositions': cloneStoryProjectUiValue(_0x371b5d["pageScrollPositions"], {}),
    'selectedAssetId': normalizeText(_0x371b5d["selectedAssetId"]),
    'selectedEpisodeId': normalizeText(_0x371b5d["selectedEpisodeId"]),
    'selectedClipId': normalizeText(_0x371b5d["selectedClipId"]),
    'characterVoiceEditor': _0x371b5d["characterVoiceEditor"] ? {
      ...cloneStoryProjectUiValue(_0x371b5d['characterVoiceEditor'], {}),
      'isGenerating': ![]
    } : null,
    'assetBreakdownVisibleCount': Math["max"](0x0, Math["trunc"](Number(_0x371b5d["assetBreakdownVisibleCount"]) || 0x0))
  };
}
export function applyStoryLibraryAdditionUiState(_0xfacef3 = {}, {
  targetAssetId = '',
  selectedAppearanceIndex = 0x0
} = {}) {
  if (!_0xfacef3 || typeof _0xfacef3 !== 'object' || Array["isArray"](_0xfacef3)) {
    return _0xfacef3;
  }
  const _0x53e7c5 = normalizeText(targetAssetId);
  _0x53e7c5 && (_0xfacef3["assetAppearanceIndexes"] = {
    ...(_0xfacef3["assetAppearanceIndexes"] || {}),
    [_0x53e7c5]: Math["max"](0x0, Math["trunc"](Number(selectedAppearanceIndex) || 0x0))
  });
  _0xfacef3["assetSelectionMode"] = ![];
  _0xfacef3['selectedAssetIds'] = [];
  return _0xfacef3;
}
export function applyStoryProjectUiState(_0x242d6d = {}, _0x4b35b1 = {}, _0x25238b = _0x242d6d['data']) {
  if (!_0x242d6d || typeof _0x242d6d !== "object") {
    return _0x242d6d;
  }
  const _0x50b816 = _0x4b35b1 && typeof _0x4b35b1 === "object" && !Array["isArray"](_0x4b35b1) ? _0x4b35b1 : {};
  const _0x43f397 = Array["isArray"](_0x25238b?.["episodes"]) ? _0x25238b['episodes'] : [];
  const _0x537b09 = Array["isArray"](_0x25238b?.["assets"]) ? _0x25238b["assets"] : [];
  const _0x5012b7 = normalizeStoryWorkspaceStep(_0x50b816["step"]);
  _0x242d6d["step"] = (_0x5012b7 === 0x0 || _0x25238b?.["project"]?.["outlineStatus"] !== 'stale') && canEnterStoryWorkspaceStep(_0x25238b, _0x5012b7) ? _0x5012b7 : _0x25238b?.["project"]?.["collaboration"]?.['stage'] === 'writing' ? 0x0 : 0x1;
  _0x242d6d["assetFilter"] = Object['hasOwn'](STORY_ASSET_TAB_LABELS, _0x50b816["assetFilter"]) ? _0x50b816["assetFilter"] : "character";
  _0x242d6d["assetSplitRatio"] = normalizeStoryAssetSplitRatio(_0x50b816["assetSplitRatio"]);
  _0x242d6d["assetDetailSplitRatio"] = normalizeStoryAssetDetailSplitRatio(_0x50b816["assetDetailSplitRatio"]);
  const _0x3ba16b = normalizeStoryEpisodePanelRatios(_0x50b816["episodeAssetPanelRatio"], _0x50b816['episodeEditorPanelRatio']);
  _0x242d6d["episodeAssetPanelRatio"] = _0x3ba16b["left"];
  _0x242d6d["episodeEditorPanelRatio"] = _0x3ba16b["center"];
  _0x242d6d["episodeAssetRailTab"] = normalizeStoryEpisodeAssetRailTab(_0x50b816["episodeAssetRailTab"]);
  _0x242d6d["assetAppearanceIndexes"] = cloneStoryProjectUiValue(_0x50b816["assetAppearanceIndexes"], {});
  _0x242d6d['outlineSectionOpenState'] = cloneStoryProjectUiValue(_0x50b816["outlineSectionOpenState"], {});
  _0x242d6d['pageScrollPositions'] = cloneStoryProjectUiValue(_0x50b816["pageScrollPositions"], {});
  const _0x51f8d6 = normalizeText(_0x50b816["selectedAssetId"]);
  _0x242d6d["selectedAssetId"] = _0x242d6d["assetFilter"] === "library" || _0x537b09["some"](_0x47d294 => normalizeText(_0x47d294?.['id']) === _0x51f8d6) ? _0x51f8d6 : normalizeText(_0x537b09["find"](_0x2f1a7c => _0x2f1a7c?.["kind"] === _0x242d6d['assetFilter'])?.['id'] || _0x537b09[0x0]?.['id']);
  const _0x568f37 = normalizeText(_0x50b816["selectedEpisodeId"]);
  const _0x33b625 = _0x43f397["find"](_0x5cf186 => normalizeText(_0x5cf186?.['id']) === _0x568f37) || _0x43f397[0x0] || null;
  _0x242d6d["selectedEpisodeId"] = normalizeText(_0x33b625?.['id']);
  const _0x52541c = normalizeText(_0x50b816["selectedClipId"]);
  const _0x14fb0c = Array["isArray"](_0x33b625?.["clips"]) ? _0x33b625["clips"] : [];
  _0x242d6d['selectedClipId'] = normalizeText(_0x14fb0c["find"](_0xfc9c24 => normalizeText(_0xfc9c24?.['id']) === _0x52541c)?.['id'] || _0x14fb0c[0x0]?.['id']);
  _0x242d6d["characterVoiceEditor"] = normalizeStoryProjectVoiceEditor(_0x50b816["characterVoiceEditor"], _0x25238b);
  _0x242d6d["view"] = _0x50b816["view"] === "episode" && canEnterStoryWorkspaceStep(_0x25238b, 0x3) && Boolean(_0x33b625) ? "episode" : "project";
  if (_0x242d6d["view"] === 'episode') {
    _0x242d6d['step'] = 0x3;
  }
  _0x242d6d["assetBreakdownVisibleCount"] = Math["max"](0x0, Math["trunc"](Number(_0x50b816["assetBreakdownVisibleCount"]) || 0x0));
  return _0x242d6d;
}