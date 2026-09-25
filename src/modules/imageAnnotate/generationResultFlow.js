import a1075_0x3eb709 from '../../core/stores/appStore.js';
import { generateId } from '../../core/math.js';
import { getModelDisplayName, getModelProvider } from '../../config/modelConfig.js';
import { buildSourceMediaNodePayload, getAutoMediaSizeByShortSide } from '../../services/fileService.js';
import { OUTPUT_RATIO_SWITCH_THRESHOLD, calcDisplaySizeByMedia, resolveInputRatioBasis, resolveOutputMediaSize, shouldSwitchToOutputRatio } from '../../services/mediaRatioService.js';
import { calcSafeSpawnPosNearNode } from '../nodeSpawn.js';
import { generateImage } from '../../../api/aiImageApi.js';
import { buildAsyncTaskPatch, buildDreaminaTaskPatch, buildRunningHubTaskPatch, isDreaminaTaskModel, isRunningHubModelApiTaskModel, isRunningHubTaskModel, persistRunningHubResumeCache } from './taskPatch.js';
import { buildImageGenerationFailurePatch, buildImageGenerationResultPatch } from '../../components/aigenImage/imageGenerationResultRenderer.js';
import { buildGenerationStartPatch } from '../../core/generationTaskLifecycle.js';
import { isTaskCancelled } from '../../core/generationTaskUiState.js';
const SCENE_CONFIG = {
  'erase': {
    'idPrefix': "source-image-erase",
    'pendingName': '消除生成中...',
    'resultName': "消除结果",
    'failureName': "消除生成失败",
    'successToast': '消除生成成功'
  },
  'repaint': {
    'idPrefix': 'source-image-repaint',
    'pendingName': "重绘生成中...",
    'resultName': "重绘结果",
    'failureName': "重绘生成失败",
    'successToast': '重绘生成成功'
  }
};
export const resolveGenerationRuntime = ({
  model: _0x2b0ef0,
  provider: _0x3c730b
} = {}) => {
  const _0x499aba = String(_0x2b0ef0 || '')["trim"]();
  const _0x14ea11 = String(_0x3c730b || getModelProvider(_0x499aba) || '')["trim"]();
  const _0x156b4d = isRunningHubTaskModel(_0x499aba, _0x14ea11);
  const _0x29f34c = isDreaminaTaskModel(_0x499aba, _0x14ea11);
  return {
    'model': _0x499aba,
    'provider': _0x14ea11,
    'isRunningHubTask': _0x156b4d,
    'isDreaminaTask': _0x29f34c,
    'isAsyncTask': !_0x156b4d && !_0x29f34c,
    'asyncProvider': _0x14ea11["toLowerCase"](),
    'useOpenapiByModel': isRunningHubModelApiTaskModel(_0x499aba, _0x14ea11)
  };
};
export const buildGenerationOutputText = ({
  model: _0x53e005,
  prompt: _0x134714,
  errorMessage = ''
} = {}) => {
  const _0x407882 = ["模型: " + getModelDisplayName(_0x53e005), "提示词: " + String(_0x134714 || '')["trim"]()];
  errorMessage && _0x407882["push"]('错误:\x20' + (String(errorMessage || '')["trim"]() || "未知错误"));
  return _0x407882["join"]('\x0a');
};
const persistGenerationRuntimeIfNeeded = _0x1bb4e7 => {
  (_0x1bb4e7?.["isRunningHubTask"] || _0x1bb4e7?.["isDreaminaTask"] || _0x1bb4e7?.['isAsyncTask']) && persistRunningHubResumeCache();
};
export const buildGenerationRuntimePatch = ({
  phase: _0x2ee59d,
  runtime: _0x3956db,
  latestNode: _0x7dc436,
  startTime: _0x2df97d,
  taskId = '',
  taskProvider = '',
  useOpenapiQuery = ![],
  errorMessage = ''
} = {}) => {
  const _0x3944df = String(taskId || _0x7dc436?.["rhTaskId"] || _0x7dc436?.["dreaminaSubmitId"] || _0x7dc436?.['asyncTaskId'] || '')["trim"]();
  if (_0x3956db?.["isRunningHubTask"]) {
    return buildRunningHubTaskPatch({
      'taskId': _0x3944df,
      'status': _0x2ee59d,
      'startedAt': _0x2df97d,
      'recovering': ![],
      'useOpenapiQuery': _0x2ee59d === "pending" ? _0x3956db["useOpenapiByModel"] : _0x2ee59d === "running" ? useOpenapiQuery === !![] || _0x7dc436?.["rhTaskUseOpenapiQuery"] === !![] || _0x3956db['useOpenapiByModel'] : _0x7dc436?.["rhTaskUseOpenapiQuery"] === !![] || _0x3956db["useOpenapiByModel"]
    });
  }
  if (_0x3956db?.["isDreaminaTask"]) {
    return buildDreaminaTaskPatch({
      'submitId': _0x3944df,
      'status': _0x2ee59d === "running" ? "pending" : _0x2ee59d,
      'phase': _0x2ee59d === "success" ? 'done' : _0x2ee59d === "failed" ? "failed" : "generating",
      'label': _0x2ee59d === "success" ? '已完成' : _0x2ee59d === "failed" ? errorMessage || "生成失败" : _0x2ee59d === 'running' ? "生成中" : "提交中",
      'startedAt': _0x2df97d,
      'recovering': ![]
    });
  }
  if (_0x3956db?.["isAsyncTask"]) {
    return buildAsyncTaskPatch({
      'provider': String(taskProvider || _0x7dc436?.["asyncTaskProvider"] || _0x3956db['asyncProvider'] || '')["trim"](),
      'kind': 'image',
      'taskId': _0x3944df,
      'status': _0x2ee59d,
      'startedAt': _0x2df97d,
      'recovering': ![]
    });
  }
  return {};
};
const updateGenerationRuntimeNode = ({
  nodeId: _0x30138a,
  runtime: _0x298e32,
  startTime: _0x3eb1e2,
  phase: _0x5b8cd2,
  taskId = '',
  taskProvider = '',
  useOpenapiQuery = ![],
  errorMessage = ''
} = {}) => {
  const _0x1d7bec = String(taskId || '')['trim']();
  if (!_0x1d7bec && _0x5b8cd2 === "running") {
    return;
  }
  const _0x5af3dd = a1075_0x3eb709["getState"]()['nodes']?.[_0x30138a];
  if (!_0x5af3dd) {
    return;
  }
  if (isTaskCancelled(_0x5af3dd)) {
    return;
  }
  a1075_0x3eb709['updateNodeData'](_0x30138a, {
    ...buildGenerationRuntimePatch({
      'phase': _0x5b8cd2,
      'runtime': _0x298e32,
      'latestNode': _0x5af3dd,
      'startTime': _0x3eb1e2,
      'taskId': _0x1d7bec || _0x5af3dd?.['rhTaskId'] || _0x5af3dd?.['dreaminaSubmitId'] || _0x5af3dd?.["asyncTaskId"] || '',
      'taskProvider': taskProvider,
      'useOpenapiQuery': useOpenapiQuery,
      'errorMessage': errorMessage
    })
  });
  persistGenerationRuntimeIfNeeded(_0x298e32);
};
export const runGenerationResultFlow = async ({
  scene: _0x3f9299,
  built: _0x3d6ed,
  sourceNode: _0x47d67a,
  fallbackModel: _0x5e8458,
  fallbackProvider: _0x56b366,
  exitController: _0x1a07a3,
  notify = (_0x3f47d7, _0x2c388c) => window['showToast']?.(_0x3f47d7, _0x2c388c)
} = {}) => {
  if (!_0x3d6ed?.["payload"]) {
    return;
  }
  const _0x312f80 = SCENE_CONFIG[_0x3f9299];
  if (!_0x312f80) {
    throw new Error("未知生成场景: " + _0x3f9299);
  }
  const _0x49f24a = resolveGenerationRuntime({
    'model': _0x3d6ed?.["payload"]?.['model'] || _0x5e8458,
    'provider': _0x3d6ed?.["payload"]?.["provider"] || _0x56b366
  });
  const _0x49fed1 = String(_0x3d6ed?.['payload']?.["prompt"] || '')["trim"]();
  const _0x536e73 = Date['now']();
  const _0x2e789e = _0x3d6ed['inputUrl'];
  let _0x3f5b0e = null;
  const _0x50b1c4 = () => {
    if (!_0x3f5b0e) {
      return ![];
    }
    return isTaskCancelled(a1075_0x3eb709['getState']()["nodes"]?.[_0x3f5b0e]);
  };
  try {
    const _0x16be20 = Number(_0x3d6ed?.["naturalWidth"]) || _0x47d67a?.["width"] || 0x1;
    const _0x17416c = Number(_0x3d6ed?.["naturalHeight"]) || _0x47d67a?.["height"] || 0x1;
    const {
      width: _0x4032c8,
      height: _0x4a1ed9
    } = getAutoMediaSizeByShortSide(_0x16be20, _0x17416c);
    const {
      x: _0x2dfcd2,
      y: _0x4a6059
    } = calcSafeSpawnPosNearNode(a1075_0x3eb709["getState"]()["nodes"], _0x47d67a, _0x4032c8, _0x4a1ed9);
    _0x3f5b0e = generateId(_0x312f80["idPrefix"]);
    a1075_0x3eb709["addNode"](buildSourceMediaNodePayload({
      'id': _0x3f5b0e,
      'type': "source-image",
      'x': _0x2dfcd2,
      'y': _0x4a6059,
      'width': _0x4032c8,
      'height': _0x4a1ed9,
      'needsAutoResize': ![],
      'name': _0x312f80["pendingName"],
      'src': '',
      ...buildGenerationStartPatch({
        'startedAt': _0x536e73
      }),
      'provider': _0x49f24a["provider"],
      'model': _0x49f24a["model"],
      ...(_0x49f24a['isRunningHubTask'] ? {
        'rhSourceNodeId': _0x47d67a?.['id'] || '',
        'rhToolbarTaskType': "image-" + _0x3f9299
      } : {}),
      ...buildGenerationRuntimePatch({
        'phase': "pending",
        'runtime': _0x49f24a,
        'startTime': _0x536e73
      }),
      'outputText': buildGenerationOutputText({
        'model': _0x49f24a['model'],
        'prompt': _0x49fed1
      })
    }));
    persistGenerationRuntimeIfNeeded(_0x49f24a);
    a1075_0x3eb709["setSelectedNodes"]([_0x3f5b0e]);
    _0x1a07a3?.({
      'silent': !![]
    });
    const _0x5c153d = await generateImage(_0x3d6ed["payload"], {
      'onTaskMeta': ({
        taskId: _0x535e9b,
        useOpenapiQuery: _0x411010,
        provider: _0xc8b3e6
      }) => {
        updateGenerationRuntimeNode({
          'nodeId': _0x3f5b0e,
          'runtime': _0x49f24a,
          'startTime': _0x536e73,
          'phase': "running",
          'taskId': _0x535e9b,
          'taskProvider': _0xc8b3e6,
          'useOpenapiQuery': _0x411010
        });
      },
      'onTaskId': _0xd5bd4e => {
        updateGenerationRuntimeNode({
          'nodeId': _0x3f5b0e,
          'runtime': _0x49f24a,
          'startTime': _0x536e73,
          'phase': "running",
          'taskId': _0xd5bd4e
        });
      }
    });
    if (_0x50b1c4()) {
      return;
    }
    if (_0x5c153d?.["error"]) {
      throw new Error(_0x5c153d['error']);
    }
    const _0x1a0504 = a1075_0x3eb709["getState"]()['nodes']?.[_0x3f5b0e];
    const _0x49beee = _0x1a0504?.["generationStartTime"] ? Date["now"]() - _0x1a0504["generationStartTime"] : 0x0;
    const _0x38b778 = resolveInputRatioBasis({
      'width': _0x3d6ed?.["naturalWidth"],
      'height': _0x3d6ed?.["naturalHeight"]
    }, {
      'width': _0x47d67a?.['width'],
      'height': _0x47d67a?.["height"]
    });
    const _0x1ee48b = await resolveOutputMediaSize({
      'localPath': _0x5c153d["localPath"],
      'imageUrl': _0x5c153d["imageUrl"],
      'sourceUrl': _0x5c153d["sourceUrl"],
      'thumbUrl': _0x5c153d["thumbUrl"],
      'src': _0x5c153d["imageUrl"] || _0x5c153d["sourceUrl"] || _0x5c153d["thumbUrl"] || ''
    });
    const _0x24affb = _0x1ee48b && shouldSwitchToOutputRatio(_0x38b778["width"], _0x38b778['height'], _0x1ee48b["width"], _0x1ee48b["height"], OUTPUT_RATIO_SWITCH_THRESHOLD) ? calcDisplaySizeByMedia(_0x1ee48b["width"], _0x1ee48b["height"]) : calcDisplaySizeByMedia(_0x38b778['width'], _0x38b778['height']);
    a1075_0x3eb709["updateNodeData"](_0x3f5b0e, {
      ...buildImageGenerationResultPatch(_0x5c153d, {
        'startedAt': _0x536e73,
        'duration': _0x49beee
      }),
      'name': _0x312f80["resultName"],
      'width': _0x24affb["width"],
      'height': _0x24affb['height'],
      ...buildGenerationRuntimePatch({
        'phase': "success",
        'runtime': _0x49f24a,
        'latestNode': _0x1a0504,
        'startTime': _0x536e73
      }),
      'outputText': buildGenerationOutputText({
        'model': _0x49f24a["model"],
        'prompt': _0x49fed1
      })
    });
    persistGenerationRuntimeIfNeeded(_0x49f24a);
    notify(_0x312f80["successToast"], "success");
  } catch (_0x3897c3) {
    if (!_0x3f5b0e) {
      throw _0x3897c3;
    }
    if (_0x50b1c4()) {
      return;
    }
    const _0x1caaff = a1075_0x3eb709["getState"]()["nodes"]?.[_0x3f5b0e];
    const _0x2cb1fe = _0x1caaff?.["generationStartTime"] ? Date["now"]() - _0x1caaff["generationStartTime"] : 0x0;
    const _0x2560d6 = _0x3897c3?.["message"] || '未知错误';
    a1075_0x3eb709["updateNodeData"](_0x3f5b0e, {
      ...buildImageGenerationFailurePatch({
        'error': _0x2560d6,
        'startedAt': _0x536e73,
        'duration': _0x2cb1fe
      }),
      'name': _0x312f80['failureName'],
      ...buildGenerationRuntimePatch({
        'phase': "failed",
        'runtime': _0x49f24a,
        'latestNode': _0x1caaff,
        'startTime': _0x536e73,
        'errorMessage': _0x2560d6
      }),
      'outputText': buildGenerationOutputText({
        'model': _0x49f24a["model"],
        'prompt': _0x49fed1,
        'errorMessage': _0x2560d6
      })
    });
    persistGenerationRuntimeIfNeeded(_0x49f24a);
  } finally {
    _0x2e789e && URL["revokeObjectURL"](_0x2e789e);
  }
};