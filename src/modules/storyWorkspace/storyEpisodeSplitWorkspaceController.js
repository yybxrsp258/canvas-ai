import { buildStoryBackgroundTaskId, getStoryBackgroundTasks, isStoryBackgroundTaskActive } from './storyBackgroundTasks.js';
import { cancelStoryEpisodeSplitBatch, finalizeStoryEpisodeSplitBatch, resetStoryEpisodeSplitBatchState, runStoryEpisodeSplitBatchQueue } from './storyEpisodeSplitBatchExecution.js';
import { createStoryEpisodeSplitRunRecorder } from './storyEpisodeSplitRun.js';
import { prepareStoryReplicationGenerationEpisode, assertStoryReplicationGenerationCurrent } from './storyReplicationGenerationPreparation.js';
import { runStoryEpisodeSplitQualityReview } from './storyEpisodeSplitQualityApplication.js';
import { buildVideoReplicationGenerationAssets } from '../../domain/storyGeneration/videoReplicationGenerationAssets.js';
import { mergeStoryEpisodeSplit } from './storyPlanningData.js';
import { getStoryEpisodeBatchControlState, getStoryEpisodeBatchTargets, setStoryEpisodeSplitRunning } from './storyPlanningTaskState.js';
import { normalizeStoryPromptMode, resolveStoryPromptModeDefaultVideoModelId } from './storyPromptModes.js';
import { createStoryTaskBatchCancellationRegistry } from './storyTaskBatchCancellation.js';
import { initializeStoryEpisodeVideoGenerationDurations, resolveStoryVideoClipDurationConstraints } from './storyVideoGenerationSettings.js';
import { resolveStoryWorkspaceModelId } from './storyWorkspaceModelCatalog.js';
import { createStoryEpisodeSplitDeveloperDiagnostics } from './storyWorkspaceDeveloperDiagnostics.js';
import { isStoryEpisodeExperimentalSplitAvailable, shouldUseStoryEpisodeExperimentalSplit, resolveStoryEpisodeExperimentalErrorMessage } from './storyEpisodeSplitPresentationPolicy.js';
export { isStoryEpisodeExperimentalSplitAvailable, shouldUseStoryEpisodeExperimentalSplit, resolveStoryEpisodeExperimentalErrorMessage } from './storyEpisodeSplitPresentationPolicy.js';
function normalizeText(_0x11ad56) {
  return String(_0x11ad56 ?? '')["trim"]();
}
function cloneData(_0x13f3d4) {
  return JSON['parse'](JSON['stringify'](_0x13f3d4));
}
function requireFunctions(_0x5c7a6c, _0x22cebb) {
  for (const [_0x5cc7b3, _0x5036ca] of Object['entries'](_0x22cebb)) {
    if (typeof _0x5036ca !== 'function') {
      throw new TypeError(_0x5c7a6c + " requires " + _0x5cc7b3 + '.');
    }
  }
}
export function createStoryEpisodeSplitWorkspaceController({
  state: _0x1c45f2,
  windowObject = globalThis["window"] || globalThis,
  operations = {},
  projectTasks = {},
  persistence = {},
  presentation = {},
  getPlanningContext: _0x1592bb
} = {}) {
  if (!_0x1c45f2 || typeof _0x1c45f2 !== "object") {
    throw new TypeError("Story episode split requires workspace state.");
  }
  requireFunctions("Story episode split project tasks", {
    'createProjectToken': projectTasks["createProjectToken"],
    'createTaskBatch': projectTasks["createTaskBatch"],
    'finishBackgroundTask': projectTasks["finishBackgroundTask"],
    'isCurrent': projectTasks["isCurrent"],
    'isLive': projectTasks["isLive"],
    'startBackgroundTask': projectTasks["startBackgroundTask"],
    'syncProjectEntry': projectTasks["syncProjectEntry"],
    'syncTaskBatch': projectTasks["syncTaskBatch"],
    'updateBackgroundTask': projectTasks["updateBackgroundTask"],
    'updateBackgroundTaskBatch': projectTasks["updateBackgroundTaskBatch"]
  });
  requireFunctions("Story episode split persistence", {
    'isDurableRequired': persistence['isDurableRequired'],
    'persistNow': persistence["persistNow"],
    'schedule': persistence['schedule']
  });
  requireFunctions("Story episode split presentation", {
    'getGenerationControl': presentation["getGenerationControl"],
    'notifyComplete': presentation['notifyComplete'],
    'notifyGenerationResult': presentation["notifyGenerationResult"],
    'openEpisode': presentation['openEpisode'],
    'render': presentation["render"],
    'requestChoice': presentation["requestChoice"],
    'showTaskResult': presentation['showTaskResult'],
    'showToast': presentation["showToast"]
  });
  if (typeof _0x1592bb !== 'function') {
    throw new TypeError("Story episode split requires getPlanningContext.");
  }
  const _0xda6fc0 = createStoryTaskBatchCancellationRegistry();
  function _0x4bfbc3() {
    return projectTasks["createProjectToken"](_0x1c45f2);
  }
  function _0x10c8e7(_0x2d55ff, _0x44ea3e, _0x4a9f3b, _0x371b1c = {}) {
    const _0x1db9ec = normalizeStoryPromptMode(_0x371b1c["promptMode"] || _0x4a9f3b?.["data"]?.["project"]?.["planning"]?.["promptMode"], {
      'allowDeveloperModes': !![]
    });
    const _0x46768b = resolveStoryPromptModeDefaultVideoModelId(_0x1db9ec);
    const _0x2b9095 = resolveStoryWorkspaceModelId("video", _0x46768b || _0x4a9f3b?.['modelSettings']?.['models']?.["video"] || _0x1c45f2['models']['video']);
    const _0xb5b2da = mergeStoryEpisodeSplit(_0x2d55ff, _0x44ea3e, {
      ..._0x371b1c,
      'promptMode': _0x1db9ec,
      'videoModelId': _0x2b9095,
      'sourceMode': _0x4a9f3b?.['data']?.['project']?.["sourceMode"],
      'includeDialogueVoiceGuidance': _0x4a9f3b?.["data"]?.['project']?.['sourceMode'] === "video-replication"
    });
    initializeStoryEpisodeVideoGenerationDurations(_0xb5b2da, _0x2b9095);
    return _0xb5b2da;
  }
  function _0x299a39({
    episode: _0x2b37da,
    projectToken: _0x33fe5a,
    backgroundTaskId: _0x3fcf56,
    context: _0xf8bc75,
    mode: _0x451040,
    promptExperiment = ![]
  }) {
    const _0x514f41 = getStoryBackgroundTasks(_0x33fe5a['data'])["find"](_0x49d95f => _0x49d95f['id'] === _0x3fcf56);
    const _0x5d3c85 = _0x1c45f2["splitTextModel"];
    return createStoryEpisodeSplitRunRecorder({
      'project': _0xf8bc75["project"],
      'episode': _0x2b37da,
      'assets': _0x33fe5a['data']["assets"],
      'constraints': _0xf8bc75["project"]['planning'],
      'execution': _0x5d3c85?.["modelId"] ? {
        'modelId': normalizeText(_0x5d3c85["modelId"]),
        'provider': normalizeText(_0x5d3c85["provider"]),
        'providerProfileId': normalizeText(_0x5d3c85["providerProfileId"])
      } : {
        'modelId': _0xf8bc75["model"],
        'provider': _0xf8bc75["provider"],
        'providerProfileId': _0xf8bc75['providerProfileId']
      },
      'mode': _0x451040,
      'promptExperiment': promptExperiment,
      'resumePayload': _0x514f41?.["resumePayload"],
      'onChange': async _0x30959d => {
        projectTasks['updateBackgroundTask'](_0x33fe5a, _0x3fcf56, {
          'resumable': !![],
          'modelId': _0x30959d["input"]["execution"]["modelId"],
          'provider': _0x30959d["input"]['execution']["provider"],
          'resumePayload': {
            'kind': _0x30959d['kind'],
            'run': _0x30959d
          }
        });
        projectTasks["syncProjectEntry"](_0x33fe5a);
        const _0x5f26a3 = await persistence["persistNow"]();
        if (persistence["isDurableRequired"]() && !_0x5f26a3) {
          throw new Error("分镜运行记录保存失败，已停止模型请求。");
        }
      }
    });
  }
  async function _0x144ce1(_0x176dea, _0x114c2e) {
    if (!_0x176dea["requiresPaidRetry"]) {
      return !![];
    }
    const _0x493a97 = await presentation["requestChoice"]({
      'overlayId': 'story-episode-split-paid-retry-' + _0x114c2e['id'],
      'title': '第\x20' + (_0x114c2e["number"] || '') + " 集上次请求尚未安全提交",
      'message': "上次请求可能已经计费，或原始响应尚未完成本地提交。确认后才会再次调用模型。",
      'fallbackValue': null,
      'choices': [{
        'label': "暂不重试",
        'value': null,
        'autofocus': !![]
      }, {
        'label': "确认重新请求",
        'value': "retry",
        'primary': !![]
      }]
    });
    if (_0x493a97 !== 'retry') {
      return ![];
    }
    await _0x176dea["authorizePaidRetry"]();
    return !![];
  }
  function _0xb408fe({
    episode: _0x50c670,
    projectToken: _0xfdf858,
    context: _0x479ba6,
    splitRun: _0x3f5bc9,
    repairDraft: _0x2a7b7e,
    onProgress: _0x4766fe
  }) {
    return {
      'project': _0x479ba6["project"],
      'episode': _0x50c670,
      'assets': buildVideoReplicationGenerationAssets(_0xfdf858["data"]["assets"], _0x479ba6["project"]),
      'constraints': _0x479ba6["project"]["planning"],
      'clipDurationConstraints': resolveStoryVideoClipDurationConstraints(resolveStoryWorkspaceModelId('video', _0xfdf858['modelSettings']?.["models"]?.["video"] || _0x1c45f2['models']["video"])),
      'model': _0x3f5bc9["execution"]["modelId"],
      'provider': _0x3f5bc9["execution"]['provider'],
      'providerProfileId': _0x3f5bc9["execution"]['providerProfileId'],
      'repairDraft': _0x2a7b7e,
      'onInvocation': _0x3f5bc9["onInvocation"],
      'diagnostics': createStoryEpisodeSplitDeveloperDiagnostics(windowObject),
      'onProgress': _0x4766fe
    };
  }
  function _0x1f763a({
    episode: _0x4dd70b,
    projectToken: _0x17f81d,
    context: _0x19b395,
    splitRun: _0x8740de,
    promptExperiment: _0x867123,
    onProgress: _0x46a59a
  }) {
    const _0x14fb5a = _0x17f81d["data"];
    const _0x41e2b7 = _0x14fb5a["episodes"]["findIndex"](_0x27cf41 => _0x27cf41['id'] === _0x4dd70b['id']);
    const _0x11cd11 = _0x8740de["checkpoint"] || _0x4dd70b?.["experimentalSplitDraft"];
    return {
      'project': _0x19b395['project'],
      'episode': _0x4dd70b,
      'previousEpisode': _0x41e2b7 > 0x0 ? _0x14fb5a['episodes'][_0x41e2b7 - 0x1] : null,
      'nextEpisode': _0x41e2b7 >= 0x0 ? _0x14fb5a["episodes"][_0x41e2b7 + 0x1] || null : null,
      'assets': buildVideoReplicationGenerationAssets(_0x14fb5a["assets"], _0x19b395["project"]),
      'constraints': _0x19b395["project"]["planning"],
      'model': _0x8740de["execution"]['modelId'],
      'provider': _0x8740de["execution"]["provider"],
      'providerProfileId': _0x8740de['execution']["providerProfileId"],
      'promptExperiment': _0x867123 === !![],
      'resumeDraft': _0x11cd11?.["status"] === "completed" ? null : _0x11cd11 || null,
      'onInvocation': _0x8740de["onInvocation"],
      'diagnostics': createStoryEpisodeSplitDeveloperDiagnostics(windowObject),
      'onCheckpoint': async _0x9db9a2 => {
        if (!projectTasks['isLive'](_0x17f81d)) {
          return;
        }
        const _0x16c5cb = _0x14fb5a['episodes']['findIndex'](_0x36d099 => _0x36d099['id'] === _0x4dd70b['id']);
        if (_0x16c5cb < 0x0) {
          return;
        }
        _0x14fb5a["episodes"][_0x16c5cb] = {
          ..._0x14fb5a["episodes"][_0x16c5cb],
          'experimentalSplitDraft': cloneData(_0x9db9a2)
        };
        await _0x8740de['saveCheckpoint'](_0x9db9a2);
      },
      'onProgress': _0x46a59a
    };
  }
  async function _0x42579c(_0x673b20, _0x22f3bd, {
    batch = null,
    experimental = ![],
    experimentalLabel = ![],
    promptExperiment = ![],
    repairDraft = null
  } = {}) {
    if (!projectTasks["isLive"](_0x22f3bd)) {
      return null;
    }
    const _0x626f3c = _0x22f3bd['data'];
    const _0x18420f = _0x1592bb(_0x626f3c, _0x22f3bd);
    const _0x1f90a1 = experimental ? "episode-split-experimental" : 'episode-split';
    const _0x2fe7f9 = buildStoryBackgroundTaskId(_0x1f90a1, {
      'episodeId': _0x673b20['id']
    });
    const _0x32440f = _0x299a39({
      'episode': _0x673b20,
      'projectToken': _0x22f3bd,
      'backgroundTaskId': _0x2fe7f9,
      'context': _0x18420f,
      'mode': experimental ? "experimental" : "standard",
      'promptExperiment': promptExperiment
    });
    if (!(await _0x144ce1(_0x32440f, _0x673b20))) {
      return null;
    }
    projectTasks['startBackgroundTask'](_0x22f3bd, {
      'id': _0x2fe7f9,
      'modelId': _0x32440f["execution"]["modelId"],
      'provider': _0x32440f['execution']['provider'],
      'providerProfileId': _0x32440f["execution"]["providerProfileId"],
      'type': _0x1f90a1,
      'scope': {
        'episodeId': _0x673b20['id']
      },
      'label': experimentalLabel ? "实验分批拆分第 " + (_0x673b20["number"] || '') + '\x20集' : "拆分第 " + (_0x673b20["number"] || '') + " 集分镜",
      'message': experimental ? "正在规划整集分镜蓝图" : "正在生成分镜脚本",
      'batch': batch,
      'resumable': !![],
      'resumePayload': _0x32440f["payload"]()
    });
    const _0x3cdfa1 = ({
      message: _0x2d2670
    } = {}) => {
      if (!projectTasks["isLive"](_0x22f3bd)) {
        return;
      }
      projectTasks['updateBackgroundTask'](_0x22f3bd, _0x2fe7f9, {
        'status': "running",
        'message': normalizeText(_0x2d2670) || '正在生成分镜脚本'
      });
    };
    let _0x24ceb6 = null;
    try {
      await _0x32440f["start"]();
      const _0x503757 = await prepareStoryReplicationGenerationEpisode({
        'episode': _0x673b20,
        'projectData': _0x626f3c,
        'execution': _0x32440f["execution"],
        'onInvocation': _0x32440f["onInvocation"],
        'onProgress': _0x3cdfa1,
        'isActive': () => projectTasks["isLive"](_0x22f3bd),
        'persist': async () => {
          projectTasks["syncProjectEntry"](_0x22f3bd);
          const _0x578ffc = await persistence["persistNow"]();
          if (persistence["isDurableRequired"]() && !_0x578ffc) {
            throw new Error('复刻正文保存失败，已停止分镜请求。');
          }
        },
        ...(operations["prepareReplication"] ? {
          'request': operations["prepareReplication"]
        } : {})
      });
      if (_0x32440f['candidateArtifact']) {
        _0x24ceb6 = _0x32440f["candidateArtifact"];
      } else {
        experimental ? _0x24ceb6 = await operations['splitExperimental'](_0x1f763a({
          'episode': _0x503757,
          'projectToken': _0x22f3bd,
          'context': _0x18420f,
          'splitRun': _0x32440f,
          'promptExperiment': promptExperiment,
          'onProgress': _0x3cdfa1
        })) : _0x24ceb6 = await operations["splitStandard"](_0xb408fe({
          'episode': _0x503757,
          'projectToken': _0x22f3bd,
          'context': _0x18420f,
          'splitRun': _0x32440f,
          'repairDraft': repairDraft,
          'onProgress': _0x3cdfa1
        }));
      }
      assertStoryReplicationGenerationCurrent(_0x626f3c, _0x503757);
      _0x24ceb6 = await runStoryEpisodeSplitQualityReview({
        'reviewEpisodeSplit': operations["review"],
        'result': _0x24ceb6,
        'episode': _0x503757,
        'context': _0x18420f,
        'projectData': _0x626f3c,
        'splitRun': _0x32440f,
        'onProgress': _0x3cdfa1
      });
      if (!_0x32440f["candidateArtifact"]) {
        await _0x32440f["ready"](_0x24ceb6);
      }
      assertStoryReplicationGenerationCurrent(_0x626f3c, _0x503757);
    } catch (_0x4d6a1f) {
      await _0x32440f["failed"](_0x4d6a1f)['catch'](() => {});
      if (projectTasks["isLive"](_0x22f3bd)) {
        if (experimental && _0x4d6a1f?.['experimentalDraft']) {
          const _0x33c006 = _0x626f3c["episodes"]['findIndex'](_0x3160ee => _0x3160ee['id'] === _0x673b20['id']);
          _0x33c006 >= 0x0 && (_0x626f3c["episodes"][_0x33c006] = {
            ..._0x626f3c["episodes"][_0x33c006],
            'experimentalSplitDraft': cloneData(_0x4d6a1f["experimentalDraft"])
          }, projectTasks["syncProjectEntry"](_0x22f3bd), persistence["schedule"]({
            'immediate': !![]
          }));
        } else {
          if (!experimental && _0x4d6a1f?.["partialResult"]) {
            const _0x514916 = _0x626f3c["episodes"]['findIndex'](_0x46d013 => _0x46d013['id'] === _0x673b20['id']);
            _0x514916 >= 0x0 && (_0x626f3c["episodes"][_0x514916] = {
              ..._0x626f3c["episodes"][_0x514916],
              'splitDraft': _0x4d6a1f["partialResult"]
            }, persistence['schedule']({
              'immediate': !![]
            }));
          }
        }
        const _0x1be9de = experimental ? resolveStoryEpisodeExperimentalErrorMessage(_0x4d6a1f, {
          'retryActionLabel': experimentalLabel ? "开发测试" : "生成分镜脚本"
        }) : _0x4d6a1f?.['message'] || "分集拆分失败。";
        projectTasks["finishBackgroundTask"](_0x22f3bd, _0x2fe7f9, {
          'status': 'failed',
          'message': experimentalLabel ? '第\x20' + (_0x673b20["number"] || '') + " 集实验分批拆分失败" : _0x4d6a1f?.["partialResult"] ? '第\x20' + (_0x673b20['number'] || '') + " 集本次返回未完全通过，已保存原始结果" : '第\x20' + (_0x673b20["number"] || '') + " 集分镜拆分失败",
          'error': _0x1be9de,
          'resumable': !![],
          'resumePayload': _0x32440f["payload"]()
        });
      }
      throw _0x4d6a1f;
    }
    if (!projectTasks['isLive'](_0x22f3bd)) {
      return null;
    }
    const _0x3ec031 = _0x10c8e7(_0x673b20, _0x24ceb6, _0x22f3bd, {
      'assets': _0x626f3c['assets'],
      'preserveMedia': !![],
      'visualStyle': _0x18420f["visualStyle"],
      'promptMode': _0x18420f['project']["planning"]?.["promptMode"],
      ...(experimental ? {
        'includeContinuityHandoffs': !![]
      } : {})
    });
    delete _0x3ec031['splitDraft'];
    delete _0x3ec031['experimentalSplitDraft'];
    _0x3ec031["splitQualityReview"] = _0x24ceb6["qualityReview"];
    if (_0x673b20["replication"]?.["sourceAnalysis"]) {
      _0x3ec031['replication'] = {
        ..._0x3ec031['replication'],
        'promptInputKey': _0x673b20["replication"]["adaptedScript"]?.["inputKey"],
        'promptsStale': ![]
      };
    }
    const _0x4b8b4b = _0x626f3c["episodes"]["findIndex"](_0x5436d8 => _0x5436d8['id'] === _0x673b20['id']);
    if (_0x4b8b4b >= 0x0) {
      _0x626f3c["episodes"][_0x4b8b4b] = _0x3ec031;
    }
    await _0x32440f["succeeded"]();
    projectTasks['finishBackgroundTask'](_0x22f3bd, _0x2fe7f9, {
      'status': "succeeded",
      'message': _0x24ceb6["qualityReview"]?.["unresolvedClipRefs"]?.["length"] ? "已拆分为 " + _0x3ec031['clips']['length'] + " 个片段；" + _0x24ceb6["qualityReview"]["unresolvedClipRefs"]['length'] + '\x20个审片问题保留原片段待处理' : '已拆分为\x20' + _0x3ec031["clips"]["length"] + " 个片段，审片已通过",
      'resumable': ![],
      'resumePayload': _0x32440f["payload"]()
    });
    return _0x3ec031;
  }
  function _0x238256(_0x207007) {
    if (typeof operations["recoverDraft"] !== 'function') {
      presentation["showToast"]('分镜本地恢复能力尚未初始化。', "error");
      return ![];
    }
    const _0x42b762 = _0x4bfbc3();
    const _0x4cf6c7 = _0x42b762["data"];
    const _0x389315 = _0x4cf6c7["episodes"]["findIndex"](_0x23ad98 => _0x23ad98['id'] === _0x207007);
    if (_0x389315 < 0x0) {
      return ![];
    }
    const _0x3e32fe = _0x4cf6c7["episodes"][_0x389315];
    if (!_0x3e32fe?.["splitDraft"]) {
      presentation["showToast"]("当前分集没有已保存的返回可供恢复。", "info");
      return ![];
    }
    try {
      const _0x36c692 = _0x1592bb(_0x4cf6c7, _0x42b762);
      const _0x1f3090 = operations["recoverDraft"]({
        'project': _0x36c692["project"],
        'episode': _0x3e32fe,
        'assets': _0x4cf6c7['assets'],
        'constraints': _0x36c692["project"]["planning"],
        'draft': _0x3e32fe["splitDraft"]
      });
      const _0x393bd9 = _0x10c8e7(_0x3e32fe, _0x1f3090, _0x42b762, {
        'assets': _0x4cf6c7['assets'],
        'preserveMedia': !![],
        'visualStyle': _0x36c692["visualStyle"],
        'promptMode': _0x36c692["project"]["planning"]?.["promptMode"]
      });
      delete _0x393bd9["splitDraft"];
      delete _0x393bd9["experimentalSplitDraft"];
      _0x4cf6c7["episodes"][_0x389315] = _0x393bd9;
      persistence["schedule"]({
        'immediate': !![]
      });
      presentation["render"]();
      presentation['showToast']('第\x20' + (_0x393bd9["number"] || '') + '\x20集已在本地恢复为\x20' + _0x393bd9["clips"]["length"] + " 个片段；未调用模型。", "success");
      return !![];
    } catch (_0x1f81d5) {
      presentation["showTaskResult"]((normalizeText(_0x1f81d5?.['message']) || "已保存结果仍无法在本地恢复。") + "（未调用模型。）", "error", _0x1f81d5);
      return ![];
    }
  }
  async function _0x2c0e94(_0x108f05, {
    explicitExperimental = ![],
    openAfter = ![],
    repairDraft = ![]
  } = {}) {
    if (explicitExperimental && !isStoryEpisodeExperimentalSplitAvailable(windowObject)) {
      return ![];
    }
    const _0x5cf193 = presentation['getGenerationControl'](_0x108f05);
    if (_0x5cf193['disabled']) {
      return ![];
    }
    const _0x47bc10 = explicitExperimental || shouldUseStoryEpisodeExperimentalSplit(_0x1c45f2);
    const _0x29dda5 = _0x47bc10 ? operations["splitExperimental"] : operations["splitStandard"];
    if (typeof _0x29dda5 !== 'function') {
      presentation["showToast"](explicitExperimental ? '实验分批拆分\x20Agent\x20尚未初始化。' : "分镜拆分 Agent 尚未初始化。", 'error');
      return ![];
    }
    const _0x392ff6 = _0x1c45f2["data"]["episodes"]["find"](_0x111b2f => _0x111b2f['id'] === _0x108f05);
    if (!_0x392ff6) {
      return ![];
    }
    setStoryEpisodeSplitRunning(_0x1c45f2, _0x392ff6['id'], !![]);
    const _0x5f46af = _0x4bfbc3();
    presentation["render"]();
    try {
      const _0x499ac0 = await _0x42579c(_0x392ff6, _0x5f46af, {
        'experimental': _0x47bc10,
        'experimentalLabel': explicitExperimental,
        'promptExperiment': explicitExperimental,
        'repairDraft': repairDraft === !![] ? _0x392ff6['splitDraft'] : null
      });
      if (!_0x499ac0 || !projectTasks["isLive"](_0x5f46af)) {
        return ![];
      }
      persistence["schedule"]({
        'immediate': !![]
      });
      explicitExperimental ? presentation["notifyComplete"]('第\x20' + _0x499ac0["number"] + " 集实验分批拆分完成，共 " + _0x499ac0["clips"]["length"] + '\x20个片段。', _0x5f46af, {
        'episodeId': _0x499ac0['id'],
        'clipId': _0x499ac0["clips"][0x0]?.['id']
      }, {
        'notificationMessage': '第\x20' + _0x499ac0["number"] + " 集实验分批分镜生成完成。"
      }) : presentation["notifyComplete"]('第\x20' + _0x499ac0['number'] + '\x20集已拆分为\x20' + _0x499ac0["clips"]["length"] + " 个片段。", _0x5f46af, {
        'episodeId': _0x499ac0['id'],
        'clipId': _0x499ac0["clips"][0x0]?.['id']
      }, {
        'notificationMessage': '第\x20' + _0x499ac0["number"] + " 集分镜脚本生成完成。"
      });
      openAfter && projectTasks["isCurrent"](_0x5f46af) && (setStoryEpisodeSplitRunning(_0x1c45f2, _0x392ff6['id'], ![]), await presentation["openEpisode"](_0x499ac0['id'], _0x499ac0['clips'][0x0]?.['id']));
      return !![];
    } catch (_0x375c93) {
      if (!projectTasks["isLive"](_0x5f46af)) {
        return ![];
      }
      presentation["showTaskResult"](_0x47bc10 ? resolveStoryEpisodeExperimentalErrorMessage(_0x375c93, {
        'retryActionLabel': explicitExperimental ? "开发测试" : '生成分镜脚本'
      }) : _0x375c93?.['message'] || "分集拆分失败。", 'error', _0x375c93);
      return ![];
    } finally {
      projectTasks["isCurrent"](_0x5f46af) && (setStoryEpisodeSplitRunning(_0x1c45f2, _0x392ff6['id'], ![]), presentation["render"]());
    }
  }
  async function _0x580779({
    selectionMode = ![],
    experimental = !![]
  } = {}) {
    if (getStoryEpisodeBatchControlState(_0x1c45f2)['disabled']) {
      return ![];
    }
    if (experimental && typeof operations["splitExperimental"] !== "function" || !experimental && typeof operations["splitStandard"] !== "function") {
      presentation["showToast"]("分镜拆分 Agent 尚未初始化。", "error");
      return ![];
    }
    const _0x18709c = new Set((Array["isArray"](_0x1c45f2["splittingEpisodeIds"]) ? _0x1c45f2["splittingEpisodeIds"] : [])["map"](_0xf6cb67 => normalizeText(_0xf6cb67))["filter"](Boolean));
    const _0x6142c7 = getStoryEpisodeBatchTargets(_0x1c45f2["data"]["episodes"], _0x1c45f2["selectedEpisodeIds"], selectionMode)["filter"](_0x1b6cea => !_0x18709c["has"](normalizeText(_0x1b6cea?.['id'])));
    if (!_0x6142c7["length"]) {
      presentation["showToast"]("请先选择需要拆分的分集。", "info");
      return ![];
    }
    const _0x2b1965 = selectionMode ? "splitting-selected" : "splitting-all";
    const _0x46e0d4 = selectionMode ? "正在拆分选中分集" : "正在批量拆分";
    const _0x16e493 = _0x6142c7['map'](_0x16b49e => normalizeText(_0x16b49e['id']))["filter"](Boolean);
    _0x16e493["forEach"](_0x38dba3 => setStoryEpisodeSplitRunning(_0x1c45f2, _0x38dba3, !![]));
    _0x1c45f2["episodeBatchSplitOperation"] = _0x2b1965;
    _0x1c45f2['episodeBatchSplitStatus'] = _0x46e0d4 + " 1/" + _0x6142c7["length"];
    _0x1c45f2["episodeBatchSplitCancelRequested"] = ![];
    const _0x3d6d65 = _0x4bfbc3();
    const _0x16a6b9 = _0x3d6d65['data'];
    const _0x5e292 = projectTasks["createTaskBatch"]("episode-splits", {
      'operation': _0x2b1965,
      'total': _0x6142c7['length'],
      'completed': 0x0,
      'targetEpisodeIds': _0x16e493,
      'pendingEpisodeIds': _0x16e493,
      'cancelRequested': ![],
      'label': _0x1c45f2["episodeBatchSplitStatus"]
    });
    _0x1c45f2['episodeBatchSplitId'] = _0x5e292['id'];
    presentation["render"]();
    try {
      const _0x2e9dec = await runStoryEpisodeSplitBatchQueue({
        'targets': _0x6142c7,
        'batchId': _0x5e292['id'],
        'isLive': () => projectTasks["isLive"](_0x3d6d65),
        'isCancellationRequested': _0xda6fc0['isRequested'],
        'resolveTarget': _0x3e2d66 => _0x16a6b9["episodes"]["find"](_0x20cbcf => normalizeText(_0x20cbcf?.['id']) === normalizeText(_0x3e2d66?.['id'])),
        'createMissingTargetError': _0x347d36 => new Error('第\x20' + (_0x347d36?.['number'] || '') + " 集不存在，无法拆分。"),
        'runTarget': _0x39ebfe => _0x42579c(_0x39ebfe, _0x3d6d65, {
          'batch': _0x5e292,
          'experimental': experimental
        }),
        'onTargetSettled': ({
          target: _0x3add5b,
          index: _0x50f78e,
          completed: _0x1c3e44,
          pendingTargets: _0x26bef0
        }) => {
          const _0x10a8df = normalizeText(_0x3add5b?.['id']);
          const _0x23970a = _0x46e0d4 + '\x20' + (_0x50f78e + 0x1) + '/' + _0x6142c7["length"];
          projectTasks["syncTaskBatch"](_0x3d6d65, _0x5e292, {
            'completed': _0x1c3e44,
            'pendingEpisodeIds': _0x26bef0["map"](_0x2631e4 => normalizeText(_0x2631e4?.['id']))["filter"](Boolean),
            'label': _0x23970a
          });
          if (projectTasks["isCurrent"](_0x3d6d65)) {
            if (_0x10a8df) {
              setStoryEpisodeSplitRunning(_0x1c45f2, _0x10a8df, ![]);
            }
            _0x1c45f2['episodeBatchSplitStatus'] = _0x23970a;
            presentation["render"]();
          }
          persistence["schedule"]();
        }
      });
      if (_0x2e9dec['status'] === 'interrupted') {
        return ![];
      }
      return finalizeStoryEpisodeSplitBatch({
        'result': {
          ..._0x2e9dec,
          'pendingTargets': _0x2e9dec["pendingTargets"]["map"](_0x2a9f9a => normalizeText(_0x2a9f9a?.['id']))['filter'](Boolean)
        },
        'batch': _0x5e292,
        'projectToken': _0x3d6d65,
        'experimental': experimental,
        'selectionMode': selectionMode,
        'syncBatch': _0x14a359 => projectTasks["syncTaskBatch"](_0x3d6d65, _0x5e292, _0x14a359),
        'persist': () => persistence["schedule"]({
          'immediate': !![]
        }),
        'showToast': presentation["showToast"],
        'resolveErrorMessage': _0x39333c => experimental ? resolveStoryEpisodeExperimentalErrorMessage(_0x39333c, {
          'retryActionLabel': "批量拆分"
        }) : normalizeText(_0x39333c?.["message"]) || "分镜拆分失败。",
        'notifyFailure': (_0x20c1fd, _0x4ae116) => presentation['notifyGenerationResult'](_0x20c1fd, _0x3d6d65, {
          'step': 0x3
        }, _0x4ae116),
        'notifySuccess': (_0x44191b, _0x1c5009) => presentation["notifyComplete"](_0x44191b, _0x3d6d65, {
          'step': 0x3
        }, _0x1c5009)
      });
    } finally {
      _0xda6fc0["clear"](_0x5e292['id']);
      projectTasks["isCurrent"](_0x3d6d65) && (_0x16e493["forEach"](_0x13bbf5 => setStoryEpisodeSplitRunning(_0x1c45f2, _0x13bbf5, ![])), resetStoryEpisodeSplitBatchState(_0x1c45f2), presentation["render"]());
    }
  }
  function _0xb7f502() {
    const _0x4104f9 = _0x4bfbc3();
    return cancelStoryEpisodeSplitBatch({
      'state': _0x1c45f2,
      'tasks': getStoryBackgroundTasks(_0x1c45f2['data']),
      'isTaskActive': isStoryBackgroundTaskActive,
      'requestCancellation': _0xda6fc0["request"],
      'updateBatch': (_0x58b0dd, _0x54abb6) => projectTasks["updateBackgroundTaskBatch"](_0x4104f9, _0x58b0dd, _0x54abb6),
      'setEpisodeRunning': (_0x263e15, _0x52479c) => setStoryEpisodeSplitRunning(_0x1c45f2, _0x263e15, _0x52479c),
      'showToast': presentation["showToast"],
      'render': presentation['render']
    });
  }
  return Object['freeze']({
    'cancelBatch': _0xb7f502,
    'recoverDraft': _0x238256,
    'splitBatch': ({
      selectionMode = ![]
    } = {}) => _0x580779({
      'selectionMode': selectionMode,
      'experimental': shouldUseStoryEpisodeExperimentalSplit(_0x1c45f2)
    }),
    'splitEpisode': (_0x1b014a, _0x3b1464 = {}) => _0x2c0e94(_0x1b014a, _0x3b1464),
    'splitEpisodeExperimental': _0x4a19e2 => _0x2c0e94(_0x4a19e2, {
      'explicitExperimental': !![]
    })
  });
}