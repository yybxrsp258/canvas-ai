import { createStoryAssetPaidRerunChoiceGate, getStoryAssetExperimentalDraftDisplay, getStoryAssetModelChangeRerunKinds, getStoryAssetPaidRerunBlockedBatches, getStoryAssetPaidRerunBlockedLanes, isStoryAssetLocalQualityRevalidationDraft, isStoryAssetPlannedContinuationDraft } from './storyAssetExtractionDraft.js';
import { runStoryAssetExtractionToCompletion } from './storyAssetExtractionRunner.js';
import { attachUploadedStoryAssetsToEpisodes } from './storyScriptImport.js';
import { resolveStoryStyleSelection } from './storyStyleCatalog.js';
import { clearStoryPlanningForRebuild, compileStoryEpisodeScripts, mergeStoryPlanningAssets } from './storyPlanningData.js';
import { normalizeStoryAspectRatio, normalizeStoryProjectPlanning, resolveStoryTextProviderProfileId } from './storyProjectPlanning.js';
import { syncStoryPromptModeForVideoModel } from './storyVideoGenerationSettings.js';
import { buildStoryBackgroundTaskId } from './storyBackgroundTasks.js';
import { isStoryAssetExtractionOperation } from './storyPlanningTaskState.js';
import { createStoryAssetExtractionDeveloperDiagnostics } from './storyWorkspaceDeveloperDiagnostics.js';
import { STORY_VIDEO_REPLICATION_UNIFIED_ASSET_MAX_OUTPUT_TOKENS, buildStoryVideoReplicationAssetExtractionProject, markStoryVideoReplicationAssetLocalizationComplete, shouldUseStoryVideoReplicationUnifiedAssetLocalization } from './storyVideoReplication.js';
import { captureStoryReplicationAssetSources, getStoryReplicationBindingError } from './storyReplicationReplacement.js';
import { buildMissingStoryAssetImageWarning, getMissingStoryAssetImages } from './storyAssetSettingsWorkspacePresentation.js';
import { isStoryReplicationPromptStale } from './storyReplicationPromptFreshness.js';
function normalizeText(_0x3d4db9) {
  return String(_0x3d4db9 ?? '')["trim"]();
}
function cloneData(_0x1dba89) {
  return JSON["parse"](JSON["stringify"](_0x1dba89));
}
export function getStoryAssetBreakdownEpisodes(_0x1201c4 = {}) {
  const _0x542198 = Array["isArray"](_0x1201c4["assetBreakdownEpisodes"]) && _0x1201c4["assetBreakdownEpisodes"]['length'] ? _0x1201c4["assetBreakdownEpisodes"] : _0x1201c4["data"]?.['episodes'];
  return (Array["isArray"](_0x542198) ? _0x542198 : [])["map"]((_0x4f212f, _0x58c18e) => ({
    'id': normalizeText(_0x4f212f?.['id']) || "episode-" + (_0x58c18e + 0x1),
    'number': Math["max"](0x1, Math["trunc"](Number(_0x4f212f?.["number"]) || _0x58c18e + 0x1)),
    'synopsis': normalizeText(_0x4f212f?.["synopsis"] || _0x4f212f?.["script"]?.["fullText"])
  }));
}
export function isStoryAssetExperimentalExtractionAvailable(_0x35f899 = globalThis["window"]) {
  return _0x35f899?.["DEV_MODE"] === !![];
}
export function shouldUseStoryAssetBatchedExtraction(_0x392b1e = {}, {
  batchedAgentAvailable = ![],
  forceSingleRequest = ![],
  explicitExperimental = ![]
} = {}) {
  if (forceSingleRequest) {
    return ![];
  }
  if (!explicitExperimental) {
    return ![];
  }
  if (!batchedAgentAvailable) {
    return ![];
  }
  return Array["isArray"](_0x392b1e?.["episodes"]);
}
export function shouldUseStoryAssetParallelExtraction({
  parallelAgentAvailable = ![],
  forceSingleRequest = ![],
  explicitExperimental = ![]
} = {}) {
  return parallelAgentAvailable && !forceSingleRequest && !explicitExperimental;
}
export function createStoryAssetExtractionWorkspaceController({
  state: _0x36a46c,
  windowObject = globalThis['window'] || globalThis,
  extractAssets = null,
  extractAssetsParallel = null,
  extractAssetsExperimental = null,
  host = {}
} = {}) {
  if (!_0x36a46c || typeof _0x36a46c !== "object") {
    throw new TypeError("Story asset extraction requires workspace state.");
  }
  const {
    createStoryProjectTaskToken: _0x1b1277,
    finishStoryProjectBackgroundTask: _0x4a0221,
    goToStep: _0x1f54fd,
    isProjectTaskCurrent: _0xf19d42,
    isProjectTaskLive: _0x59e484,
    notifyNavigableTextTaskComplete: _0x1b8954,
    persistWorkspaceNow: _0x2c9b67,
    refreshStoryAssetExtractionFooterInPlace: _0x4b7a52,
    refreshStoryReplicationFooterInPlace: _0x139ac8,
    registerStoryProjectData: _0x51eb82,
    render: _0x4f9c37,
    reportStoryWorkspaceApiError: _0x28a838,
    requestStoryWorkspaceChoice: _0x41d2ff,
    resetStoryDownstreamUiState: _0x5c25a3,
    scheduleWorkspacePersistence: _0x3986e2,
    showTaskResultToast: _0x555c7d,
    showToast: _0x3d75db,
    startStoryProjectBackgroundTask: _0x8a3e73,
    syncCompiledEpisodeScripts: _0xf8632f,
    syncStoryPlanningLoading: _0x5c8847,
    syncStoryProjectTaskEntry: _0x586830,
    updateStoryProjectBackgroundTask: _0x20595d
  } = host;
  for (const [_0x59c8bd, _0x58caca] of Object['entries']({
    'createStoryProjectTaskToken': _0x1b1277,
    'finishStoryProjectBackgroundTask': _0x4a0221,
    'goToStep': _0x1f54fd,
    'isProjectTaskCurrent': _0xf19d42,
    'isProjectTaskLive': _0x59e484,
    'notifyNavigableTextTaskComplete': _0x1b8954,
    'persistWorkspaceNow': _0x2c9b67,
    'registerStoryProjectData': _0x51eb82,
    'render': _0x4f9c37,
    'reportStoryWorkspaceApiError': _0x28a838,
    'requestStoryWorkspaceChoice': _0x41d2ff,
    'resetStoryDownstreamUiState': _0x5c25a3,
    'scheduleWorkspacePersistence': _0x3986e2,
    'showTaskResultToast': _0x555c7d,
    'showToast': _0x3d75db,
    'startStoryProjectBackgroundTask': _0x8a3e73,
    'syncCompiledEpisodeScripts': _0xf8632f,
    'syncStoryProjectTaskEntry': _0x586830,
    'updateStoryProjectBackgroundTask': _0x20595d
  })) {
    if (typeof _0x58caca !== "function") {
      throw new TypeError("Story asset extraction requires " + _0x59c8bd + '.');
    }
  }
  let _0x5bc922 = null;
  const _0x2a772e = new Set();
  const _0x4333b0 = createStoryAssetPaidRerunChoiceGate();
  function _0x1e17cb({
    title: _0x20043c,
    message: _0x5785d1
  } = {}) {
    return _0x41d2ff({
      'title': _0x20043c,
      'message': _0x5785d1,
      'fallbackValue': 'preserve',
      'choices': [{
        'label': '取消',
        'value': null
      }, {
        'label': "保留已有媒体",
        'value': "preserve",
        'autofocus': !![]
      }, {
        'label': "全部重建",
        'value': "rebuild",
        'primary': !![]
      }]
    });
  }
  function _0x20baa0() {
    return _0x41d2ff({
      'title': "仍有分集正文未完成",
      'message': "当前仍有剧集正文未补充。继续素材拆解后，如果再次生成分集正文，将覆盖已生成的素材内容。是否继续进入人设？",
      'choices': [{
        'label': '取消',
        'value': null
      }, {
        'label': "继续拆解",
        'value': "continue",
        'primary': !![],
        'autofocus': !![]
      }]
    });
  }
  async function _0x4decb7({
    confirmMissingImages = ![]
  } = {}) {
    if (!confirmMissingImages) {
      return _0x1f54fd(0x3);
    }
    const _0xd6dedf = getStoryReplicationBindingError(_0x36a46c["data"]);
    if (_0xd6dedf) {
      _0x3d75db(_0xd6dedf, 'warn');
      return ![];
    }
    const _0x371a57 = _0x36a46c['data']['episodes']["filter"](_0x1df440 => isStoryReplicationPromptStale(_0x36a46c["data"], _0x1df440));
    if (_0x371a57["length"]) {
      const _0x2442e8 = _0x36a46c["data"];
      const _0x38aa31 = await _0x41d2ff({
        'title': "替换设置已变更，分段提示词待更新",
        'message': '有\x20' + _0x371a57["length"] + '\x20条视频仍使用修改前的分段提示词。已有视频结果保留，更新提示词将调用文本模型。',
        'choices': [{
          'label': '返回修改',
          'value': null,
          'autofocus': !![]
        }, {
          'label': '前往更新分段提示词',
          'value': "update",
          'primary': !![]
        }]
      });
      if (_0x38aa31 !== 'update' || _0x36a46c["data"] !== _0x2442e8) {
        return ![];
      }
      return _0x1f54fd(0x3);
    }
    const _0xa83047 = confirmMissingImages ? getMissingStoryAssetImages(_0x36a46c['data']["assets"]) : [];
    if (_0xa83047["length"]) {
      const _0x412e67 = await _0x41d2ff({
        'title': '部分素材图片尚未生成',
        'message': buildMissingStoryAssetImageWarning(_0xa83047),
        'choices': [{
          'label': "返回补图",
          'value': null,
          'autofocus': !![]
        }, {
          'label': "跳过并继续",
          'value': 'skip',
          'primary': !![]
        }]
      });
      if (_0x412e67 !== 'skip') {
        return ![];
      }
    }
    return _0x1f54fd(0x3);
  }
  function _0x348335({
    clearState = ![]
  } = {}) {
    _0x5bc922 && (windowObject['clearTimeout'](_0x5bc922), _0x5bc922 = null);
    clearState && (_0x36a46c["assetBreakdownEpisodes"] = [], _0x36a46c["assetBreakdownVisibleCount"] = 0x0);
  }
  function _0x1d5596() {
    _0x348335();
    if (_0x36a46c["data"]?.["project"]?.['sourceMode'] === "video-replication") {
      return;
    }
    const _0x528cf0 = getStoryAssetBreakdownEpisodes(_0x36a46c)["length"];
    if (!isStoryAssetExtractionOperation(_0x36a46c['storyPlanningOperation']) || _0x36a46c["assetBreakdownVisibleCount"] >= _0x528cf0) {
      return;
    }
    _0x5bc922 = windowObject['setTimeout'](() => {
      _0x5bc922 = null;
      if (!isStoryAssetExtractionOperation(_0x36a46c["storyPlanningOperation"])) {
        return;
      }
      _0x36a46c["assetBreakdownVisibleCount"] = Math['min'](_0x528cf0, Math['max'](0x1, _0x36a46c["assetBreakdownVisibleCount"] + 0x1));
      _0x36a46c["view"] === 'project' && _0x36a46c["step"] === 0x1 && _0x4f9c37({
        'updateToolbar': ![]
      });
      _0x1d5596();
    }, 0x640);
  }
  function _0x4ce2fd() {
    if (_0x36a46c["data"]?.["project"]?.['sourceMode'] === 'video-replication') {
      return ![];
    }
    if (!isStoryAssetExtractionOperation(_0x36a46c["storyPlanningOperation"])) {
      return ![];
    }
    _0x36a46c["assetBreakdownEpisodes"] = cloneData(_0x36a46c["data"]['episodes'] || []);
    const _0x1530fe = _0x36a46c["assetBreakdownEpisodes"]['length'];
    _0x36a46c['assetBreakdownVisibleCount'] = _0x1530fe ? Math['min'](_0x1530fe, Math['max'](0x1, Number(_0x36a46c["assetBreakdownVisibleCount"]) || 0x1)) : 0x0;
    _0x1d5596();
    return !![];
  }
  function _0x2b4af7(_0x1cc72c = '', _0x2fda7b = '') {
    _0x36a46c['storyPlanningOperation'] = _0x1cc72c;
    _0x36a46c["storyPlanningStatus"] = _0x2fda7b;
    if (_0x36a46c["data"]?.["project"]?.["sourceMode"] === "video-replication" && _0x139ac8()) {
      return;
    }
    _0x4f9c37();
  }
  function _0x4d4275({
    projectData = _0x36a46c["data"],
    singleRequest = ![],
    experimental = ![]
  } = {}) {
    const _0x38257a = shouldUseStoryVideoReplicationUnifiedAssetLocalization(projectData);
    const _0x1e2579 = singleRequest || _0x38257a;
    const _0x2ac883 = shouldUseStoryAssetParallelExtraction({
      'parallelAgentAvailable': typeof extractAssetsParallel === 'function',
      'forceSingleRequest': _0x1e2579,
      'explicitExperimental': experimental
    });
    const _0x2624c9 = shouldUseStoryAssetBatchedExtraction(projectData, {
      'batchedAgentAvailable': typeof extractAssetsExperimental === "function",
      'forceSingleRequest': _0x1e2579,
      'explicitExperimental': experimental
    });
    const _0x136de7 = !_0x2ac883 && !_0x2624c9;
    const _0x1055f5 = _0x2ac883 ? extractAssetsParallel : _0x2624c9 ? extractAssetsExperimental : extractAssets;
    return {
      'useParallelExtraction': _0x2ac883,
      'useBatchedExtraction': _0x2624c9,
      'useSingleRequest': _0x136de7,
      'extractionAgent': _0x1055f5
    };
  }
  function _0x107857(_0xa1eb34 = _0x36a46c["data"], _0x242f3d = null) {
    const _0x1b50ad = _0xa1eb34?.["project"] || {};
    const _0x502d3e = _0x242f3d?.["modelSettings"] || {};
    const _0x55c4f1 = _0x502d3e["textProvider"] || _0x36a46c['textProvider'];
    syncStoryPromptModeForVideoModel({
      ..._0x36a46c,
      'data': _0xa1eb34
    }, _0x502d3e["models"]?.["video"] || _0x36a46c["models"]["video"]);
    _0x1b50ad["planning"] = normalizeStoryProjectPlanning(_0x1b50ad, {
      'allowDeveloperPromptModes': _0x36a46c["developerModeAvailable"]
    });
    return {
      'project': _0x1b50ad,
      'model': _0x502d3e["models"]?.["text"] || _0x36a46c['models']["text"],
      'provider': _0x55c4f1,
      'providerProfileId': resolveStoryTextProviderProfileId(_0x55c4f1, _0x502d3e["textProviderProfileId"] || _0x36a46c["textProviderProfileId"]),
      'aspectRatio': normalizeStoryAspectRatio(_0x1b50ad['aspectRatio']),
      'visualStyle': resolveStoryStyleSelection({
        'styleId': _0x1b50ad["videoStyleId"],
        'stylePrompt': _0x1b50ad['videoStylePrompt'],
        'videoStyle': _0x1b50ad["videoStyle"]
      })["stylePrompt"]
    };
  }
  async function _0x39fadf({
    advance = !![],
    allowIncompleteScripts = ![],
    experimental = ![],
    singleRequest = ![]
  } = {}) {
    const _0x313cd5 = normalizeText(_0x36a46c["data"]?.["project"]?.['id']) || "current-project";
    if (_0x36a46c['storyPlanningOperation'] || _0x2a772e["has"](_0x313cd5)) {
      return ![];
    }
    if (experimental && !isStoryAssetExperimentalExtractionAvailable(windowObject)) {
      return ![];
    }
    const _0x1fd9a2 = _0x36a46c["data"]["project"]?.["sourceMode"] === "video-replication";
    if (_0x36a46c['data']["episodes"]["length"]) {
      const _0x54fe67 = _0xf8632f();
      if (!_0x54fe67["complete"] && !allowIncompleteScripts && !_0x1fd9a2) {
        _0x3d75db("请先按顺序生成所有分集剧本。", 'warn');
        return ![];
      }
    }
    const {
      useParallelExtraction: _0x428106,
      useBatchedExtraction: _0x156578,
      useSingleRequest: _0x2af12d,
      extractionAgent: _0x941b98
    } = _0x4d4275({
      'singleRequest': singleRequest,
      'experimental': experimental
    });
    const _0x286827 = _0x428106 ? "extracting-assets" : _0x2af12d ? "extracting-assets-single-request" : "extracting-assets-experimental";
    const _0x575be2 = _0x428106 ? _0x1fd9a2 ? '本地化角色、场景与道具' : "并行提取角色、场景与道具" : _0x2af12d ? _0x1fd9a2 ? '本地化角色、场景与道具' : '单次超长提取角色、场景与道具' : "正在按剧本长度选择三类专用 API 或 PP-UIE + API，并生成最终视觉素材";
    if (typeof _0x941b98 !== "function") {
      _0x3d75db((experimental ? "混合开发测试" : '素材') + '提取尚未初始化。', "error");
      return ![];
    }
    const _0x193172 = _0x36a46c["data"]["project"]?.['sourceMode'] === 'upload-original';
    const _0xdd136f = _0x193172 || _0x1fd9a2;
    const _0x54b074 = experimental ? "experimentalAssetExtractionDraft" : "assetExtractionDraft";
    const _0x344ecc = _0x36a46c["data"];
    const _0x459fd2 = _0x344ecc[_0x54b074];
    const _0x439916 = getStoryAssetPaidRerunBlockedLanes(_0x459fd2);
    const _0x2219cb = getStoryAssetPaidRerunBlockedBatches(_0x459fd2);
    const _0x283b29 = _0x439916["length"] + _0x2219cb['length'];
    const _0x50b923 = getStoryAssetModelChangeRerunKinds(_0x459fd2);
    let _0x34a3f1 = null;
    if (_0x50b923["length"] && !_0x2219cb['length'] && _0x439916["length"] === _0x50b923['length']) {
      _0x34a3f1 = {
        'confirmed': !![],
        'authorizedKinds': _0x50b923
      };
    } else {
      if (_0x283b29) {
        const _0x23833b = await _0x4333b0({
          'draft': _0x459fd2,
          'requestChoice': _0x41d2ff,
          'isCurrent': () => _0x36a46c['data'] === _0x344ecc
        });
        if (!['local-revalidate', "paid-rerun"]['includes'](_0x23833b["action"]) || _0x36a46c["storyPlanningOperation"]) {
          return ![];
        }
        _0x34a3f1 = _0x23833b["paidRerunAuthorization"];
      }
    }
    const _0xfe8d25 = isStoryAssetLocalQualityRevalidationDraft(_0x459fd2);
    const _0x29ebd1 = isStoryAssetPlannedContinuationDraft(_0x459fd2);
    let _0x1ad564 = 'preserve';
    if (_0x36a46c['data']['assets']["length"] && !_0xfe8d25 && !_0x29ebd1 && !_0x283b29) {
      _0x2a772e["add"](_0x313cd5);
      try {
        _0x1ad564 = await _0x1e17cb({
          'title': experimental ? "混合开发测试重新提取角色、场景与道具" : "重新提取角色、场景与道具",
          'message': _0xdd136f ? "保留已有媒体会沿用匹配素材的图片；全部重建会清空素材媒体和下游分镜，不会改写或删除上传的原始剧本。" : "保留已有媒体会沿用匹配角色、场景和道具的图片；全部重建会清空素材媒体和下游分镜，保留已确认的分集正文。"
        });
      } finally {
        _0x2a772e['delete'](_0x313cd5);
      }
      if (!_0x1ad564 || _0x36a46c["data"] !== _0x344ecc) {
        return ![];
      }
    }
    _0x348335({
      'clearState': !![]
    });
    !_0x1fd9a2 && (_0x36a46c["assetBreakdownEpisodes"] = cloneData(_0x36a46c["data"]["episodes"]), _0x36a46c['assetBreakdownVisibleCount'] = _0x36a46c["assetBreakdownEpisodes"]["length"] ? 0x1 : 0x0);
    _0x2b4af7(_0x286827, '正在' + _0x575be2);
    if (!_0x1fd9a2) {
      _0x1d5596();
    }
    const _0x594e11 = _0x36a46c['step'];
    const _0x2c03b5 = _0x1b1277(_0x36a46c);
    const _0x3019a7 = _0x2af12d ? buildStoryBackgroundTaskId("asset-extraction-single-request") : experimental ? buildStoryBackgroundTaskId("asset-extraction-experimental") : buildStoryBackgroundTaskId('asset-extraction');
    _0x8a3e73(_0x2c03b5, {
      'id': _0x3019a7,
      'type': _0x2af12d ? "asset-extraction-single-request" : experimental ? "asset-extraction-experimental" : "asset-extraction",
      'label': _0x575be2,
      'message': _0x36a46c["storyPlanningStatus"],
      'resumable': !_0x2af12d,
      ...(!_0x2af12d ? {
        'resumePayload': {
          'kind': 'story-asset-extraction-run',
          'draftKey': _0x54b074
        }
      } : {})
    });
    const _0xda069f = _0x2c03b5["data"];
    try {
      const _0x452567 = _0x107857(_0xda069f, _0x2c03b5);
      const _0x54e7ea = _0x1fd9a2 ? buildStoryVideoReplicationAssetExtractionProject(_0xda069f) : _0x452567["project"];
      const _0x57cfe0 = async (_0x257ec5 = null) => _0x941b98({
        ..._0x452567,
        'project': _0x54e7ea,
        'episodes': _0x1fd9a2 ? _0xda069f['episodes']['filter'](_0x4828c2 => _0x4828c2["replication"]?.['status'] === "ready") : _0xda069f["episodes"],
        ...(_0x156578 ? {
          'diagnostics': createStoryAssetExtractionDeveloperDiagnostics(windowObject)
        } : {}),
        ...(_0x428106 || _0x156578 ? {
          'resumeDraft': _0x257ec5,
          ...(_0x428106 ? {
            'automaticRecovery': !_0x1fd9a2,
            ...(_0x1fd9a2 ? {
              'resumeSourceAliases': [{
                'project': _0x452567["project"]
              }]
            } : {})
          } : {}),
          ...(_0x34a3f1 ? {
            'paidRerunAuthorization': _0x34a3f1
          } : {}),
          'onCheckpoint': async _0x4fe298 => {
            if (!_0x59e484(_0x2c03b5)) {
              return;
            }
            _0xda069f[_0x54b074] = cloneData(_0x4fe298);
            _0x20595d(_0x2c03b5, _0x3019a7, {
              'resumable': !![],
              'modelId': _0x452567["model"],
              'provider': _0x452567['provider'],
              'resumePayload': {
                'kind': "story-asset-extraction-run",
                'draftKey': _0x54b074
              }
            });
            _0x586830(_0x2c03b5);
            await _0x2c9b67();
          }
        } : _0x2af12d ? {
          'allowOversizedPrompt': !![],
          ...(_0x1fd9a2 ? {
            'maxOutputTokens': STORY_VIDEO_REPLICATION_UNIFIED_ASSET_MAX_OUTPUT_TOKENS,
            'structuredOutputFallback': "prompt"
          } : {})
        } : {}),
        'onProgress': ({
          message: _0x413c3d
        } = {}) => {
          if (!_0x59e484(_0x2c03b5)) {
            return;
          }
          const _0x4dff84 = normalizeText(_0x413c3d) || '正在' + _0x575be2;
          _0x20595d(_0x2c03b5, _0x3019a7, {
            'status': 'running',
            'message': _0x4dff84
          });
          _0xf19d42(_0x2c03b5) && (_0x36a46c['storyPlanningStatus'] = _0x4dff84, _0x5c8847(), _0x4b7a52());
        }
      });
      const _0x39b438 = _0x428106 || _0x156578 ? await runStoryAssetExtractionToCompletion({
        'initialResumeDraft': _0xda069f[_0x54b074],
        'isActive': () => _0x59e484(_0x2c03b5),
        'execute': async _0x3e01aa => _0x57cfe0(_0x3e01aa),
        'onContinuation': async (_0xc27bc4, _0x594f9f) => {
          if (!_0x59e484(_0x2c03b5)) {
            return;
          }
          _0xda069f[_0x54b074] = cloneData(_0xc27bc4);
          const _0x3907ab = getStoryAssetExperimentalDraftDisplay(_0xc27bc4);
          const _0x200512 = _0x3907ab["summary"] || normalizeText(_0x594f9f?.["message"]) || "本轮分批调用已完成，系统正在自动继续剩余内容";
          _0x20595d(_0x2c03b5, _0x3019a7, {
            'status': "running",
            'message': _0x200512 + " · 正在自动继续"
          });
          _0x586830(_0x2c03b5);
          await _0x2c9b67();
          _0xf19d42(_0x2c03b5) && (_0x36a46c['storyPlanningStatus'] = _0x200512 + '\x20·\x20正在自动继续', _0x5c8847());
        }
      }) : await _0x57cfe0();
      if (!_0x59e484(_0x2c03b5)) {
        return ![];
      }
      const _0x425604 = Array['isArray'](_0x39b438?.['assets']) ? _0x39b438["assets"] : [];
      const _0x2db18b = _0x425604["filter"](_0x5a1596 => _0x5a1596?.['designStatus'] === 'baseline')["length"];
      const _0x18cf07 = !_0x1fd9a2 || _0x425604["some"](_0x4de338 => _0x4de338?.["kind"] === "scene");
      if (!_0x425604['length'] || _0x2db18b || !_0x18cf07) {
        const _0x2f9c76 = new Error(_0x2db18b ? "本轮有 " + _0x2db18b + " 个素材没有完成 API 视觉反推；旧素材已保留，未进入下一步。" : !_0x18cf07 ? "本轮没有获得可用场景素材；旧素材已保留，未进入下一步。" : "本轮没有获得可用素材；旧素材已保留，未进入下一步。");
        _0x2f9c76["type"] = "ASSET_VISUAL_RESULT_INCOMPLETE";
        throw _0x2f9c76;
      }
      let _0x5eaff1 = _0xda069f;
      _0x1ad564 === "rebuild" && (_0x5eaff1 = clearStoryPlanningForRebuild(_0xda069f), _0x2c03b5["data"] = _0x5eaff1, _0x51eb82(_0x2c03b5), _0xf19d42(_0x2c03b5) && (_0x36a46c["data"] = _0x5eaff1, _0x5c25a3()));
      delete _0x5eaff1['assetExtractionDraft'];
      delete _0x5eaff1["experimentalAssetExtractionDraft"];
      const _0x449133 = _0x428106 ? "三路并行" : _0x2af12d ? _0x1fd9a2 ? "统一素材本地化" : "单次超长" : _0x39b438?.["extractionMode"] === 'parallel-api' ? "角色、场景、道具三类 API 开发测试" : _0x39b438?.['extractionMode'] === "api-fallback" ? "API 分批降级开发测试" : "PP-UIE + API 混合开发测试";
      const _0x2c262f = _0x1ad564 !== 'rebuild';
      _0x5eaff1['assets'] = mergeStoryPlanningAssets(_0x5eaff1['assets'], _0x39b438?.["assets"], {
        'preserveMedia': _0x2c262f,
        'visualStyle': _0x452567['visualStyle']
      });
      const _0x18bbb8 = _0x39b438?.['candidateLedger']?.['summary']?.["quarantinedCount"] ? "，已隔离 " + Math['max'](0x0, Math["trunc"](Number(_0x39b438["candidateLedger"]["summary"]["quarantinedCount"]) || 0x0)) + " 个未通过证据裁决的候选" : '';
      (_0xdd136f || _0x1fd9a2 || _0x428106 || _0x156578 || _0x2af12d) && (_0x5eaff1["episodes"] = attachUploadedStoryAssetsToEpisodes(_0x5eaff1["episodes"], _0x5eaff1["assets"]));
      _0x1fd9a2 && (captureStoryReplicationAssetSources(_0x5eaff1), markStoryVideoReplicationAssetLocalizationComplete(_0x5eaff1));
      _0x4a0221(_0x2c03b5, _0x3019a7, {
        'status': "succeeded",
        'message': _0x449133 + "已提取 " + _0x5eaff1["assets"]['length'] + '\x20个素材' + _0x18bbb8,
        'resumable': ![]
      });
      _0x3986e2({
        'immediate': !![]
      });
      _0x1b8954(_0x449133 + "已提取 " + _0x5eaff1["assets"]["length"] + " 个角色、场景与道具素材" + _0x18bbb8 + '。', _0x2c03b5, {
        'step': 0x2,
        'assetId': _0x5eaff1["assets"][0x0]?.['id']
      }, {
        'notificationMessage': _0x449133 + "角色、场景与道具素材提取完成。"
      });
      if (_0xf19d42(_0x2c03b5)) {
        _0x36a46c["selectedAssetId"] = _0x5eaff1['assets'][0x0]?.['id'] || '';
        _0x36a46c["assetFilter"] = _0x5eaff1["assets"][0x0]?.["kind"] || "character";
        _0x348335({
          'clearState': !![]
        });
        _0x36a46c['storyPlanningOperation'] = '';
        _0x36a46c['storyPlanningStatus'] = '';
        if (advance && _0x36a46c["view"] === "project" && _0x36a46c["step"] === _0x594e11) {
          _0x1f54fd(0x2);
        } else {
          _0x4f9c37();
        }
      }
      return !![];
    } catch (_0x43c1d3) {
      if (!_0x59e484(_0x2c03b5)) {
        return ![];
      }
      _0x28a838(_0x2af12d ? _0x1fd9a2 ? 'localize-replication-assets' : "extract-assets-single-request" : experimental ? "extract-assets-experimental" : 'extract-assets', _0x43c1d3, {
        'model': _0x36a46c["models"]["text"],
        'provider': _0x36a46c['textProvider']
      });
      _0x4a0221(_0x2c03b5, _0x3019a7, {
        'status': "failed",
        'message': (_0x2af12d ? _0x1fd9a2 ? "素材本地化" : "单次超长" : experimental ? '混合开发测试' : '素材') + "提取失败",
        'error': _0x43c1d3?.["message"] || _0x575be2 + '失败。'
      });
      _0x555c7d(_0x43c1d3?.["message"] || _0x575be2 + '失败。', "error", _0x43c1d3);
      return ![];
    } finally {
      _0xf19d42(_0x2c03b5) && (_0x348335({
        'clearState': !![]
      }), _0x36a46c["storyPlanningOperation"] === _0x286827 && _0x2b4af7());
    }
  }
  async function _0x5f5d59() {
    if (_0x36a46c['storyPlanningOperation']) {
      return ![];
    }
    const _0x59c101 = _0x36a46c['data']["episodes"]['length'] > 0x0 && !compileStoryEpisodeScripts(_0x36a46c["data"]["episodes"])["complete"];
    if (_0x59c101) {
      const _0x28eefc = await _0x20baa0();
      if (_0x28eefc !== "continue") {
        return ![];
      }
    }
    return _0x39fadf({
      'advance': !![],
      'allowIncompleteScripts': _0x59c101
    });
  }
  return Object["freeze"]({
    'preview': async _0x4438e1 => {
      if (windowObject?.['DEV_MODE'] !== !![]) {
        throw new Error('仅开发者模式可调试请求');
      }
      const _0xb67be6 = cloneData(_0x36a46c["data"]);
      const {
        useParallelExtraction: _0x2037fe,
        useBatchedExtraction: _0x47ff82,
        useSingleRequest: _0x1239fa,
        extractionAgent: _0x348ffd
      } = _0x4d4275({
        'projectData': _0xb67be6
      });
      if (typeof _0x348ffd !== 'function') {
        throw new Error("素材提取 Agent 尚未初始化");
      }
      const _0x3e4948 = _0x107857(_0xb67be6);
      const _0x544ce8 = _0xb67be6["project"]?.["sourceMode"] === "video-replication";
      return _0x348ffd({
        ..._0x3e4948,
        'project': _0x544ce8 ? buildStoryVideoReplicationAssetExtractionProject(_0xb67be6) : _0x3e4948["project"],
        'episodes': _0x544ce8 ? _0xb67be6["episodes"]["filter"](_0x107aca => _0x107aca["replication"]?.['status'] === "ready") : _0xb67be6["episodes"],
        ...(_0x2037fe || _0x47ff82 ? {
          'resumeDraft': _0xb67be6["assetExtractionDraft"],
          'automaticRecovery': !_0x544ce8
        } : {}),
        ...(_0x1239fa ? {
          'allowOversizedPrompt': !![],
          ...(_0x544ce8 ? {
            'maxOutputTokens': STORY_VIDEO_REPLICATION_UNIFIED_ASSET_MAX_OUTPUT_TOKENS,
            'structuredOutputFallback': "prompt"
          } : {})
        } : {}),
        'request': _0x4438e1,
        'preferLocal': ![]
      });
    },
    'continueToProjectAssets': _0x5f5d59,
    'extractProjectAssets': _0x39fadf,
    'getStoryPlanningAgentContext': _0x107857,
    'openEpisodeStage': _0x4decb7,
    'requestPlanningRegenerationMode': _0x1e17cb,
    'restoreStoryAssetBreakdownProgress': _0x4ce2fd,
    'setStoryPlanningOperation': _0x2b4af7,
    'stopStoryAssetBreakdownProgress': _0x348335
  });
}