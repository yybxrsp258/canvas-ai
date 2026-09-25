import { getImageGenerationResultError, getSuccessfulImageGenerationItems, normalizeImageGenerationResult } from '../../components/aigenImage/imageGenerationResultRenderer.js';
import { buildCharacterAssetImageGenerationPayload } from '../characterAssets/characterAssetImageGeneration.js';
import { PERSON_REPLACEMENT_DEFAULT_IMAGE_MODEL_ID } from './personReplacementProject.js';
import { resolveModelExecution } from '../../manifests/index.js';
import { buildPersonReplacementImageGate } from './personReplacementImageGate.js';
import { buildPersonReplacementPromptPackage } from './personReplacementPromptCompiler.js';
import { applyPersonReplacementPromptEnhancement } from './personReplacementPromptEnhancement.js';
import { appendPersonReplacementImageResult, createPersonReplacementImageGenerationMappingRevision, createPersonReplacementImageGenerationRequestRevision, getRecoverablePersonReplacementImageTask, resolvePersonReplacementImageGenerationParams, resolvePersonReplacementImageGenerationState, updatePersonReplacementImageGenerationState } from './personReplacementImageGeneration.js';
import { hasPersonReplacementGenerationTaskIdentityChanged, projectPersonReplacementGenerationTaskIdentity } from './personReplacementGenerationTaskIdentity.js';
import { resumeAsyncImageTask, resumeDreaminaImageTask, resumeRunningHubImageTask } from '../../../api/aiImageApi.js';
import { normalizeLocalPath } from '../../utils/localMediaPath.js';
import { composePersonReplacementImagePrompt } from './personReplacementPromptMode.js';
import { buildPersonReplacementLocationGuide, applyPersonReplacementLocationGuide } from './personReplacementLocationGuide.js';
import { buildPersonReplacementAnnotatedSource, applyPersonReplacementAnnotatedSource } from './personReplacementAnnotatedSource.js';
function normalizeText(_0x582273) {
  return String(_0x582273 ?? '')['trim']();
}
function resolveGeneratedImages(_0x3046ae) {
  const _0xf2dcc7 = normalizeImageGenerationResult(_0x3046ae);
  const _0xe65bef = getSuccessfulImageGenerationItems(_0xf2dcc7)['map'](_0xf2e54 => ({
    ..._0xf2e54,
    'localPath': [_0xf2e54['localPath'], _0xf2e54["originalLocalPath"], _0xf2e54["displayLocalPath"], _0xf2e54["imageUrl"], _0xf2e54["url"]]["map"](normalizeLocalPath)['find'](Boolean) || ''
  }))["filter"](_0x2ae379 => _0x2ae379["localPath"]);
  if (!_0xe65bef['length']) {
    throw new Error(normalizeText(_0xf2dcc7["items"][0x0]?.['localSaveError'] || _0xf2dcc7?.["localSaveError"]) || getImageGenerationResultError(_0xf2dcc7) || "图像生成结果缺少可用图片");
  }
  return _0xe65bef;
}
function resolveDefaultPromptRequest({
  shot: _0x38f2e4,
  promptPackage: _0x586c20
}) {
  const _0x252bf2 = normalizeText(_0x38f2e4?.['imagePrompt']);
  return {
    'savedPrompt': _0x252bf2,
    'requestPrompt': composePersonReplacementImagePrompt(_0x586c20, _0x252bf2),
    'promptAssetRefs': []
  };
}
async function resumePersonReplacementImageTask(_0x29cbb3, _0xd4fefd, _0x277908 = {}) {
  const _0x2e6c45 = resolveModelExecution(_0xd4fefd?.["model"]) || resolveModelExecution(_0xd4fefd?.["model"], {
    'providerHint': _0xd4fefd?.["provider"]
  });
  const _0x59c531 = normalizeText(_0x2e6c45?.["modelManifest"]?.["provider"] || _0xd4fefd?.["provider"]);
  if (_0x59c531 === 'dreamina') {
    return resumeDreaminaImageTask(_0x29cbb3, _0xd4fefd, _0x277908);
  }
  if (_0x59c531 === 'runninghub' || _0x59c531 === "runninghubwf" || _0x2e6c45?.["executionManifest"]?.["adapterType"] === "workflow") {
    return resumeRunningHubImageTask(_0x29cbb3, _0xd4fefd, _0x277908);
  }
  return resumeAsyncImageTask(_0x29cbb3, _0xd4fefd, _0x277908);
}
export function createPersonReplacementImageTaskRuntime({
  getProject: _0x4be9ce,
  getProjectById = null,
  commitProject: _0x592d33,
  commitProjectById = null,
  generateImage: _0x3ab1ee,
  enhancePrompt = null,
  createLocationGuide = buildPersonReplacementLocationGuide,
  createAnnotatedSource = buildPersonReplacementAnnotatedSource,
  getPromptEnhancementModel = () => ({}),
  resumeImageTask = resumePersonReplacementImageTask,
  createRequestId = () => globalThis["crypto"]?.["randomUUID"]?.() || '' + Date["now"](),
  showToast = () => {},
  resolvePromptRequest = resolveDefaultPromptRequest,
  now = () => new Date()["toISOString"](),
  notifyCompletion = () => {},
  persistNow = () => Promise["resolve"](null)
} = {}) {
  const _0x12df5c = new Map();
  const _0x5eeeec = new Map();
  let _0x4a36bc = ![];
  const _0x4ccade = (_0x3c7f53 = '') => {
    const _0x444afe = normalizeText(_0x3c7f53);
    return _0x444afe && typeof getProjectById === "function" ? getProjectById(_0x444afe) : _0x4be9ce?.();
  };
  const _0x24ec98 = _0x43c9b0 => typeof commitProjectById === 'function' ? commitProjectById(_0x43c9b0?.['id'], _0x43c9b0) : _0x592d33?.(_0x43c9b0);
  const _0x902e1b = ({
    currentProject: _0x153068,
    projectId: _0x1c4487,
    shotId: _0x207f2f,
    requestId: _0x5679d6
  }) => {
    if (_0x4a36bc || _0x153068?.['id'] !== _0x1c4487) {
      return null;
    }
    const _0x5501e3 = resolvePersonReplacementImageGenerationState(_0x153068["workspace"], _0x207f2f);
    if (_0x5501e3["requestId"] !== _0x5679d6) {
      return null;
    }
    const _0x5b7e0d = _0x24ec98({
      ..._0x153068,
      'workspace': updatePersonReplacementImageGenerationState(_0x153068['workspace'], {
        'status': 'idle',
        'shotId': _0x207f2f,
        'error': ''
      })
    });
    showToast("生成期间检测框或生成设置已变化，旧结果未应用，请重新生成。", "warn");
    return {
      'project': _0x5b7e0d,
      'ok': ![],
      'stale': !![],
      'shotId': _0x207f2f
    };
  };
  const _0x22a1c7 = ({
    shotId = '',
    imageRef = '',
    fileName = '',
    createdAt = now(),
    expectedProjectId = '',
    expectedShotRevision = ''
  } = {}) => {
    if (_0x4a36bc) {
      return null;
    }
    const _0x2cfa52 = _0x4be9ce?.();
    const _0xdb1482 = normalizeText(shotId);
    const _0x16e918 = normalizeText(imageRef);
    const _0x15d8f6 = normalizeText(expectedProjectId);
    const _0x4c2371 = normalizeText(expectedShotRevision);
    if (!_0x15d8f6 || _0x2cfa52?.['id'] !== _0x15d8f6) {
      return null;
    }
    const _0x59bddb = _0x2cfa52?.['shots']?.["find"]?.(_0x3fadb3 => _0x3fadb3['id'] === _0xdb1482);
    if (!_0x59bddb || !_0x16e918) {
      return null;
    }
    if (!_0x4c2371 || createPersonReplacementImageGenerationMappingRevision({
      'project': _0x2cfa52,
      'shot': _0x59bddb
    }) !== _0x4c2371) {
      return null;
    }
    const _0x1e5865 = appendPersonReplacementImageResult(_0x59bddb, {
      'imageUrl': _0x16e918,
      'source': "upload",
      'fileName': normalizeText(fileName) || '上传替换图片',
      'userPrompt': normalizeText(_0x59bddb['imagePrompt']),
      'createdAt': createdAt
    });
    return _0x592d33?.({
      ..._0x2cfa52,
      'shots': _0x2cfa52["shots"]['map'](_0x5d7632 => _0x5d7632['id'] === _0xdb1482 ? {
        ..._0x5d7632,
        'replacementImage': _0x1e5865,
        'replacementImageRef': _0x16e918,
        'error': ''
      } : _0x5d7632),
      'workspace': {
        ..._0x2cfa52['workspace'],
        'selectedShotId': _0xdb1482
      }
    });
  };
  const _0x109703 = ({
    project: _0x8cba99,
    shot: _0x5473f3,
    promptPackage = buildPersonReplacementPromptPackage({
      'project': _0x8cba99,
      'shot': _0x5473f3
    }),
    promptEnhancement = null,
    sourceImageSize: _0x2303be,
    taskIdentity = {}
  }) => {
    const _0x42e94b = promptEnhancement ? applyPersonReplacementPromptEnhancement(promptPackage, promptEnhancement) : promptPackage;
    const {
      savedPrompt = '',
      requestPrompt = _0x42e94b['prompt'],
      promptAssetRefs = []
    } = resolvePromptRequest({
      'project': _0x8cba99,
      'shot': _0x5473f3,
      'promptPackage': _0x42e94b
    }) || {};
    const _0x3f2846 = normalizeText(taskIdentity["modelId"]) || _0x8cba99["settings"]?.["replacementImageModelId"] || PERSON_REPLACEMENT_DEFAULT_IMAGE_MODEL_ID;
    const _0x331cc3 = resolvePersonReplacementImageGenerationParams({
      'modelId': _0x3f2846,
      'provider': normalizeText(taskIdentity["provider"]) || _0x8cba99["settings"]?.["replacementImageProvider"],
      'generationParams': _0x8cba99['settings']?.["replacementImageGenerationParams"],
      'sourceImageSize': _0x2303be,
      'shot': _0x5473f3
    });
    const _0x5c40d1 = buildCharacterAssetImageGenerationPayload({
      'prompt': requestPrompt,
      'modelId': _0x3f2846,
      'provider': _0x331cc3["provider"],
      'providerProfileId': normalizeText(taskIdentity["providerProfileId"]) || _0x8cba99["settings"]?.["replacementImageProviderProfileId"],
      'generationParams': _0x331cc3['generationParams'],
      'referenceImageUrls': [..._0x42e94b['referenceImages']["filter"](_0xd5edb0 => !_0x42e94b["annotatedSource"] || _0xd5edb0["role"] !== "source-keyframe")["map"](_0x4d62b4 => _0x4d62b4["ref"]), ...(Array["isArray"](promptAssetRefs) ? promptAssetRefs : [])["map"](_0x1eb267 => _0x1eb267?.["url"])]
    });
    if (_0x42e94b["annotatedSource"]) {
      _0x5c40d1["inputUrls"]["unshift"](_0x42e94b["referenceImages"][0x0]["ref"]);
    }
    _0x5c40d1["adaptiveSource"] = _0x331cc3["adaptiveSource"];
    _0x5c40d1["resolvedRatioLabel"] = _0x331cc3['resolvedAspectRatio'];
    return {
      'modelId': _0x3f2846,
      'payload': _0x5c40d1,
      'promptPackage': _0x42e94b,
      'ratioResolution': _0x331cc3,
      'requestPrompt': requestPrompt,
      'savedPrompt': savedPrompt
    };
  };
  const _0xa05885 = ({
    currentProject: _0x9347cf,
    currentShot: _0x582c00,
    requestRevision: _0x3eb1c5,
    savedPrompt: _0x73dc56,
    promptEnhancement = null,
    sourceImageSize: _0x416449,
    taskIdentity = {}
  }) => {
    try {
      const _0x397919 = _0x109703({
        'project': _0x9347cf,
        'shot': {
          ..._0x582c00,
          'imagePrompt': _0x73dc56
        },
        'sourceImageSize': _0x416449,
        'taskIdentity': taskIdentity,
        'promptEnhancement': promptEnhancement
      });
      return createPersonReplacementImageGenerationRequestRevision({
        'project': _0x9347cf,
        'shot': _0x582c00,
        'payload': _0x397919['payload'],
        'sourceImageSize': _0x416449
      }) === _0x3eb1c5;
    } catch {
      return ![];
    }
  };
  const _0x197ee5 = ({
    projectId: _0x1e8e0c,
    shotId: _0x1354ed,
    requestId: _0x13907c,
    requestRevision = '',
    savedPrompt = '',
    promptEnhancement = null,
    sourceImageSize: _0x21a8b2,
    taskIdentity = {}
  } = {}) => {
    if (_0x4a36bc) {
      return ![];
    }
    const _0x4a2c14 = _0x4ccade(_0x1e8e0c);
    if (normalizeText(_0x4a2c14?.['id']) !== normalizeText(_0x1e8e0c)) {
      return ![];
    }
    const _0x4585e6 = _0x4a2c14?.["shots"]?.["find"]?.(_0x5be356 => normalizeText(_0x5be356?.['id']) === normalizeText(_0x1354ed));
    if (!_0x4585e6) {
      return ![];
    }
    const _0x7799b7 = resolvePersonReplacementImageGenerationState(_0x4a2c14['workspace'], _0x1354ed);
    if (normalizeText(_0x7799b7['requestId']) !== normalizeText(_0x13907c)) {
      return ![];
    }
    return !requestRevision || _0xa05885({
      'currentProject': _0x4a2c14,
      'currentShot': _0x4585e6,
      'requestRevision': requestRevision,
      'savedPrompt': savedPrompt,
      'promptEnhancement': promptEnhancement,
      'sourceImageSize': _0x21a8b2,
      'taskIdentity': taskIdentity
    });
  };
  const _0x2c0ef4 = (_0x156f34, _0x5803c2 = {}, {
    persistIdentity = ![]
  } = {}) => {
    if (!_0x197ee5(_0x156f34)) {
      return ![];
    }
    const _0x5ab52b = _0x4ccade(_0x156f34["projectId"]);
    const _0x1930b0 = resolvePersonReplacementImageGenerationState(_0x5ab52b["workspace"], _0x156f34["shotId"]);
    const _0x5cdf97 = {
      ..._0x1930b0,
      ..._0x5803c2,
      'shotId': _0x156f34["shotId"],
      'requestId': _0x156f34["requestId"]
    };
    const _0x13aa70 = Object["keys"](_0x5cdf97)["some"](_0x2b55d8 => !Object['is'](_0x5cdf97[_0x2b55d8], _0x1930b0[_0x2b55d8])) || Object["keys"](_0x1930b0)["some"](_0xafa889 => !Object['hasOwn'](_0x5cdf97, _0xafa889));
    if (!_0x13aa70) {
      return !![];
    }
    _0x24ec98({
      ..._0x5ab52b,
      'workspace': updatePersonReplacementImageGenerationState(_0x5ab52b["workspace"], _0x5cdf97)
    });
    persistIdentity && normalizeText(_0x5cdf97["taskId"]) && hasPersonReplacementGenerationTaskIdentityChanged(_0x1930b0, _0x5cdf97) && void Promise["resolve"](persistNow())["catch"](() => {});
    return !![];
  };
  const _0x1064bc = async ({
    projectId: _0x1806e2 = '',
    shotId = '',
    sourceImageSize: _0x41dd51,
    notifyCompletion: _0x2ea49b = !![],
    recoveryTask = null
  } = {}) => {
    if (_0x4a36bc) {
      return null;
    }
    const _0x4ae4b8 = _0x4ccade(_0x1806e2);
    const _0x32780a = normalizeText(shotId);
    const _0x9b744d = _0x4ae4b8?.["shots"]?.['find']?.(_0x3aeb96 => _0x3aeb96['id'] === _0x32780a);
    const _0x43ca3b = getRecoverablePersonReplacementImageTask(_0x4ae4b8?.["workspace"]?.["imageGenerationsByShotId"]?.[_0x32780a]);
    const _0x198ac2 = recoveryTask ? {
      ..._0x43ca3b,
      ...recoveryTask
    } : null;
    if (!_0x198ac2 && _0x43ca3b) {
      return null;
    }
    if (!_0x4ae4b8?.['id'] || !_0x9b744d || (_0x198ac2 ? typeof resumeImageTask !== 'function' : typeof _0x3ab1ee !== "function")) {
      return null;
    }
    let _0x230c33 = buildPersonReplacementPromptPackage({
      'project': _0x4ae4b8,
      'shot': _0x9b744d
    });
    const _0x210676 = buildPersonReplacementImageGate({
      'project': _0x4ae4b8,
      'shot': _0x9b744d,
      'promptPackage': _0x230c33,
      'recovering': Boolean(_0x198ac2)
    });
    if (!_0x210676["eligible"]) {
      showToast(_0x210676["message"], "warn");
      return null;
    }
    if (!_0x198ac2 && _0x210676["enforceImageLimit"]) {
      try {
        const _0x5e08ee = _0x109703({
          'project': _0x4ae4b8,
          'shot': _0x9b744d,
          'promptPackage': _0x230c33,
          'sourceImageSize': _0x41dd51
        });
        const _0xb8fdad = buildPersonReplacementImageGate({
          'project': _0x4ae4b8,
          'shot': _0x9b744d,
          'promptPackage': _0x230c33,
          'inputUrls': _0x5e08ee["payload"]["inputUrls"],
          'modelId': _0x5e08ee['modelId']
        });
        if (!_0xb8fdad["eligible"]) {
          showToast(_0xb8fdad['message'], "warn");
          return null;
        }
      } catch (_0x4ac61a) {
        showToast(_0x4ac61a?.["message"] || '无法校验生成输入', "warn");
        return null;
      }
    }
    const _0x263b92 = _0x4ae4b8['id'] + ":image:" + _0x32780a;
    if (_0x12df5c["has"](_0x263b92)) {
      return null;
    }
    const _0x1ad4d0 = _0x4ae4b8['id'];
    const _0x71885f = normalizeText(_0x198ac2?.["requestId"]) || normalizeText(createRequestId());
    const _0x578812 = new AbortController();
    const _0x1b7baa = {
      'projectId': _0x1ad4d0,
      'requestId': _0x71885f,
      'shotId': _0x32780a,
      'abortController': _0x578812,
      'taskId': normalizeText(_0x198ac2?.["taskId"]),
      'taskIdentity': _0x198ac2 || {},
      'promptEnhancement': null
    };
    _0x12df5c['set'](_0x263b92, _0x1b7baa);
    const _0x4fb2a9 = createPersonReplacementImageGenerationMappingRevision({
      'project': _0x4ae4b8,
      'shot': _0x9b744d
    });
    let _0x113125 = '';
    let _0xe1843a = '';
    _0x24ec98({
      ..._0x4ae4b8,
      'workspace': updatePersonReplacementImageGenerationState(_0x4ae4b8["workspace"], {
        'status': "running",
        'shotId': _0x32780a,
        'requestId': _0x71885f,
        ...(_0x198ac2 || {}),
        'error': ''
      })
    });
    try {
      if (_0x230c33["annotatedSource"] && !_0x198ac2) {
        const _0x276089 = await createAnnotatedSource({
          ..._0x230c33['annotatedSource'],
          'signal': _0x578812["signal"]
        });
        _0x230c33 = applyPersonReplacementAnnotatedSource(_0x230c33, _0x276089);
        if (_0x578812["signal"]["aborted"] || _0x4a36bc) {
          return null;
        }
      }
      if (_0x230c33["locationGuide"] && !_0x198ac2) {
        const _0x52f4f9 = await createLocationGuide({
          ..._0x230c33["locationGuide"],
          'signal': _0x578812['signal']
        });
        _0x230c33 = applyPersonReplacementLocationGuide(_0x230c33, _0x52f4f9);
        if (_0x578812['signal']["aborted"] || _0x4a36bc) {
          return null;
        }
      }
      let _0x12916b = _0x210676['manual'] ? null : _0x198ac2?.['promptEnhancement'] || null;
      if (!_0x210676["manual"] && !_0x12916b && _0x4ae4b8['settings']?.["replacementPromptEnhancementEnabled"] === !![]) {
        if (typeof enhancePrompt !== "function") {
          throw new Error('AI\x20提示词增强服务尚未初始化');
        }
        const _0x2b0973 = getPromptEnhancementModel?.() || {};
        const _0x17150 = JSON["stringify"]({
          'mappingRevision': _0x4fb2a9,
          'modelId': normalizeText(_0x2b0973['modelId']),
          'provider': normalizeText(_0x2b0973["provider"]),
          'providerProfileId': normalizeText(_0x2b0973['providerProfileId'])
        });
        _0x12916b = _0x5eeeec["get"](_0x17150);
        if (!_0x12916b) {
          const _0x2de3a2 = await enhancePrompt({
            'project': _0x4ae4b8,
            'promptPackage': _0x230c33,
            'shot': _0x9b744d,
            'signal': _0x578812["signal"]
          });
          _0x12916b = {
            ..._0x2de3a2,
            'createdAt': normalizeText(_0x2de3a2?.['createdAt']) || now()
          };
          if (!normalizeText(_0x12916b['prompt'])) {
            throw new Error('AI\x20提示词增强未返回可用提示词');
          }
          _0x5eeeec["set"](_0x17150, _0x12916b);
        }
        _0x1b7baa['promptEnhancement'] = _0x12916b;
        _0x2c0ef4(_0x1b7baa, {
          'status': 'running',
          'promptEnhancement': _0x12916b,
          'error': ''
        });
      }
      const {
        modelId: _0x33eece,
        payload: _0x396473,
        ratioResolution: _0x552f63,
        requestPrompt: _0x4fb164,
        savedPrompt: _0x4a17b9
      } = _0x109703({
        'project': _0x4ae4b8,
        'shot': _0x9b744d,
        'promptPackage': _0x230c33,
        'promptEnhancement': _0x12916b,
        'sourceImageSize': _0x41dd51,
        'taskIdentity': _0x198ac2 || {}
      });
      if (_0x210676["manual"] && !normalizeText(_0x4fb164)) {
        throw new Error('手动模式请先填写提示词。');
      }
      _0xe1843a = _0x4a17b9;
      _0x113125 = createPersonReplacementImageGenerationRequestRevision({
        'project': _0x4ae4b8,
        'shot': _0x9b744d,
        'payload': _0x396473,
        'sourceImageSize': _0x41dd51
      });
      Object["assign"](_0x1b7baa, {
        'requestRevision': _0x113125,
        'savedPrompt': _0x4a17b9,
        'promptEnhancement': _0x12916b,
        'sourceImageSize': _0x41dd51
      });
      const _0x3fd036 = resolveModelExecution(_0x33eece) || resolveModelExecution(_0x33eece, {
        'providerHint': _0x552f63["provider"]
      });
      const _0x63228d = Number(_0x198ac2?.["startedAt"]) || Date["now"]();
      const _0x3da75f = {
        'taskId': normalizeText(_0x198ac2?.["taskId"]),
        'modelId': _0x33eece,
        'provider': _0x552f63['provider'],
        'providerProfileId': _0x396473["providerProfileId"],
        'executionId': normalizeText(_0x198ac2?.["executionId"]) || normalizeText(_0x3fd036?.["executionManifest"]?.['id']),
        'startedAt': _0x63228d,
        'useOpenapiQuery': _0x198ac2?.["useOpenapiQuery"] === !![]
      };
      const _0x3d524f = (_0x2a4385, _0x13f816 = {}) => {
        const _0x16f4c9 = resolvePersonReplacementImageGenerationState(_0x4ccade(_0x1ad4d0)?.['workspace'], _0x32780a);
        const _0x382efe = projectPersonReplacementGenerationTaskIdentity({
          'taskId': _0x2a4385,
          'meta': _0x13f816,
          'defaults': {
            ..._0x3da75f,
            ..._0x16f4c9
          }
        });
        if (!_0x382efe["taskId"]) {
          return;
        }
        _0x1b7baa["taskId"] = _0x382efe["taskId"];
        _0x2c0ef4(_0x1b7baa, {
          'status': "running",
          ..._0x382efe,
          'error': ''
        }, {
          'persistIdentity': !![]
        });
      };
      const _0x36206b = {
        'signal': _0x578812["signal"],
        'useOpenapiQuery': _0x198ac2?.["useOpenapiQuery"] === !![],
        'onTaskId': _0x4fd056 => _0x3d524f(_0x4fd056),
        'onTaskMeta': (_0x3da962 = {}) => _0x3d524f(_0x3da962["taskId"], _0x3da962),
        'onRunningHubWorkflowQueueChange': (_0x174bc2 = {}) => {
          const _0x133841 = normalizeText(_0x174bc2['status'])["toLowerCase"]() === "queued" ? "queued" : "running";
          _0x2c0ef4(_0x1b7baa, {
            'status': _0x133841,
            'error': ''
          });
        }
      };
      const _0x54f388 = _0x4ccade(_0x1ad4d0);
      const _0x2ca80c = _0x54f388?.["shots"]?.["find"](_0x3055ca => _0x3055ca['id'] === _0x32780a);
      if (_0x578812["signal"]['aborted'] || createPersonReplacementImageGenerationMappingRevision({
        'project': _0x54f388,
        'shot': _0x2ca80c
      }) !== _0x4fb2a9 || !_0x197ee5({
        'projectId': _0x1ad4d0,
        'shotId': _0x32780a,
        'requestId': _0x71885f,
        'requestRevision': _0x113125,
        'savedPrompt': _0x4a17b9,
        'promptEnhancement': _0x12916b,
        'sourceImageSize': _0x41dd51,
        'taskIdentity': _0x198ac2 || {}
      })) {
        return _0x902e1b({
          'currentProject': _0x4ccade(_0x1ad4d0),
          'projectId': _0x1ad4d0,
          'shotId': _0x32780a,
          'requestId': _0x71885f
        });
      }
      const _0x56b59a = _0x198ac2 ? await resumeImageTask(_0x198ac2["taskId"], _0x396473, _0x36206b) : await _0x3ab1ee(_0x396473, _0x36206b);
      if (_0x4a36bc) {
        return null;
      }
      const _0xde96fd = resolveGeneratedImages(_0x56b59a);
      const _0x55ce21 = _0xde96fd[0x0]["localPath"];
      const _0x374a63 = _0x4ccade(_0x1ad4d0);
      if (_0x374a63?.['id'] !== _0x1ad4d0) {
        return null;
      }
      const _0xb684a3 = _0x374a63["shots"]?.["find"]?.(_0x3dad2a => _0x3dad2a['id'] === _0x32780a);
      if (!_0xb684a3) {
        return null;
      }
      const _0x235582 = resolvePersonReplacementImageGenerationState(_0x374a63["workspace"], _0x32780a);
      if (_0x235582["requestId"] !== _0x71885f) {
        return null;
      }
      if (!_0xa05885({
        'currentProject': _0x374a63,
        'currentShot': _0xb684a3,
        'requestRevision': _0x113125,
        'savedPrompt': _0x4a17b9,
        'promptEnhancement': _0x12916b,
        'sourceImageSize': _0x41dd51,
        'taskIdentity': _0x198ac2 || {}
      })) {
        return _0x902e1b({
          'currentProject': _0x374a63,
          'projectId': _0x1ad4d0,
          'shotId': _0x32780a,
          'requestId': _0x71885f
        });
      }
      let _0x366bd4 = _0xb684a3["replacementImage"];
      const _0x16c04a = now();
      let _0x22f8d5 = 0x0;
      for (const [_0x8f0c10, _0x41a84a] of _0xde96fd["entries"]()) {
        _0x366bd4 = appendPersonReplacementImageResult({
          'replacementImage': _0x366bd4
        }, {
          ..._0x41a84a,
          'imageUrl': _0x41a84a["localPath"],
          'prompt': _0x4fb164,
          'userPrompt': _0x4a17b9,
          'modelId': _0x33eece,
          'provider': _0x552f63["provider"],
          ...(_0x12916b ? {
            'promptEnhancement': _0x12916b
          } : {}),
          'createdAt': _0x16c04a
        });
        if (_0x8f0c10 === 0x0) {
          _0x22f8d5 = _0x366bd4["activeIndex"];
        }
      }
      _0x366bd4["activeIndex"] = _0x22f8d5;
      const _0x5d8680 = normalizeText(_0xb684a3["imagePrompt"]) !== normalizeText(_0x4a17b9);
      const _0x198cb1 = _0x24ec98({
        ..._0x374a63,
        'shots': _0x374a63['shots']["map"](_0x3305f8 => _0x3305f8['id'] === _0x32780a ? {
          ..._0x3305f8,
          'replacementImage': _0x366bd4,
          'replacementImageRef': _0x55ce21,
          'error': '',
          'imagePrompt': _0x5d8680 ? _0xb684a3["imagePrompt"] : _0x4a17b9
        } : _0x3305f8),
        'workspace': updatePersonReplacementImageGenerationState(_0x374a63["workspace"], {
          'status': 'succeeded',
          'shotId': _0x32780a,
          'requestId': _0x71885f,
          'error': ''
        })
      });
      let _0xce1b24 = !![];
      try {
        await persistNow();
      } catch {
        _0xce1b24 = ![];
      }
      if (_0x4a36bc) {
        return null;
      }
      const _0x40e1b3 = _0x4ccade(_0x1ad4d0);
      if (_0x40e1b3?.['id'] !== _0x1ad4d0) {
        return null;
      }
      const _0x5acf78 = _0x40e1b3["shots"]?.["find"]?.(_0x476c73 => _0x476c73['id'] === _0x32780a);
      if (!_0x5acf78) {
        return null;
      }
      const _0x32ed9b = resolvePersonReplacementImageGenerationState(_0x40e1b3['workspace'], _0x32780a);
      if (_0x32ed9b["requestId"] !== _0x71885f) {
        return null;
      }
      (!_0xce1b24 || _0x2ea49b === ![]) && showToast(_0xce1b24 ? '替换首帧已生成。' : '替换首帧已生成，项目数据正在重试保存，请暂时不要刷新。', _0xce1b24 ? "success" : 'warn');
      _0x2ea49b !== ![] && notifyCompletion({
        'kind': "image",
        'mediaRef': _0x55ce21,
        'projectId': _0x1ad4d0
      });
      return {
        'project': _0x40e1b3 || _0x198cb1,
        'ok': !![],
        'shotId': _0x32780a
      };
    } catch (_0x12f264) {
      if (_0x4a36bc) {
        return null;
      }
      const _0x33c96d = _0x4ccade(_0x1ad4d0);
      if (_0x33c96d?.['id'] !== _0x1ad4d0) {
        return null;
      }
      const _0x1106b5 = _0x33c96d["shots"]?.["find"]?.(_0x401e69 => _0x401e69['id'] === _0x32780a);
      if (!_0x1106b5) {
        return null;
      }
      const _0x43606f = resolvePersonReplacementImageGenerationState(_0x33c96d["workspace"], _0x32780a);
      if (_0x43606f["requestId"] !== _0x71885f) {
        return null;
      }
      const _0x23209c = _0x113125 ? !_0xa05885({
        'currentProject': _0x33c96d,
        'currentShot': _0x1106b5,
        'requestRevision': _0x113125,
        'savedPrompt': _0xe1843a,
        'promptEnhancement': _0x1b7baa['promptEnhancement'],
        'sourceImageSize': _0x41dd51,
        'taskIdentity': _0x198ac2 || {}
      }) : createPersonReplacementImageGenerationMappingRevision({
        'project': _0x33c96d,
        'shot': _0x1106b5
      }) !== _0x4fb2a9;
      if (_0x23209c) {
        return _0x902e1b({
          'currentProject': _0x33c96d,
          'projectId': _0x1ad4d0,
          'shotId': _0x32780a,
          'requestId': _0x71885f
        });
      }
      const _0x1d82e3 = _0x12f264?.['getUserMessage']?.() || _0x12f264?.["message"] || "替换首帧生成失败";
      const _0x3822ab = _0x24ec98({
        ..._0x33c96d,
        'workspace': updatePersonReplacementImageGenerationState(_0x33c96d["workspace"], {
          'status': "failed",
          'shotId': _0x32780a,
          'requestId': _0x71885f,
          'error': _0x1d82e3
        })
      });
      showToast(_0x1d82e3, 'error');
      return {
        'project': _0x3822ab,
        'ok': ![],
        'shotId': _0x32780a,
        'error': _0x1d82e3
      };
    } finally {
      _0x12df5c["delete"](_0x263b92);
    }
  };
  const _0x32233f = async ({
    projectId: _0x53aee7 = '',
    shotId = '',
    notifyCompletion = !![]
  } = {}) => {
    const _0x4508ac = normalizeText(shotId);
    const _0x37570c = _0x4ccade(_0x53aee7);
    const _0x5c8b91 = getRecoverablePersonReplacementImageTask(_0x37570c?.["workspace"]?.["imageGenerationsByShotId"]?.[_0x4508ac]);
    if (!_0x5c8b91 || _0x4a36bc) {
      return null;
    }
    return _0x1064bc({
      'projectId': _0x37570c?.['id'],
      'shotId': _0x4508ac,
      'notifyCompletion': notifyCompletion,
      'recoveryTask': _0x5c8b91
    });
  };
  const _0x1a8973 = ({
    projectId: _0x50f3e1 = '',
    shotId: _0x36ba1c
  } = {}) => {
    const _0x3521ab = normalizeText(_0x36ba1c);
    const _0x3f54aa = _0x4ccade(_0x50f3e1);
    const _0x41b63c = normalizeText(_0x3f54aa?.['id']);
    const _0x661767 = _0x41b63c + ":image:" + _0x3521ab;
    const _0x438c5d = _0x12df5c['get'](_0x661767);
    if (!_0x438c5d || _0x4a36bc) {
      return null;
    }
    _0x12df5c['delete'](_0x661767);
    _0x438c5d['abortController']?.["abort"]?.();
    const _0x28183d = resolvePersonReplacementImageGenerationState(_0x3f54aa?.["workspace"], _0x3521ab);
    if (normalizeText(_0x28183d["requestId"]) !== normalizeText(_0x438c5d["requestId"])) {
      return {
        'ok': !![],
        'shotId': _0x3521ab
      };
    }
    const _0x55778 = _0x24ec98({
      ..._0x3f54aa,
      'workspace': updatePersonReplacementImageGenerationState(_0x3f54aa["workspace"], {
        'status': 'idle',
        'shotId': _0x3521ab,
        'error': ''
      })
    });
    return {
      'ok': !![],
      'shotId': _0x3521ab,
      'project': _0x55778
    };
  };
  const _0x4c59d3 = async () => {
    if (_0x4a36bc) {
      return [];
    }
    const _0x35ffee = _0x4be9ce?.();
    const _0x2670df = normalizeText(_0x35ffee?.['id']);
    const _0x4ba98 = Object["entries"](_0x35ffee?.['workspace']?.["imageGenerationsByShotId"] || {})["flatMap"](([_0x190a87, _0xce1090]) => getRecoverablePersonReplacementImageTask(_0xce1090) ? [normalizeText(_0x190a87)] : []);
    const _0x246e6d = await Promise['allSettled'](_0x4ba98["map"](_0x4d731e => _0x32233f({
      'shotId': _0x4d731e
    })));
    if (_0x4a36bc || !_0x4ccade(_0x2670df)) {
      return [];
    }
    return _0x246e6d;
  };
  const _0x57947b = () => {
    if (_0x4a36bc) {
      return null;
    }
    _0x4a36bc = !![];
    const _0x490b18 = _0x4be9ce?.();
    let _0xc192ab = _0x490b18?.['workspace'];
    let _0x383781 = ![];
    _0x490b18?.['id'] && _0x12df5c['forEach'](_0x498e70 => {
      if (_0x498e70["projectId"] !== _0x490b18['id']) {
        return;
      }
      const _0x27b396 = resolvePersonReplacementImageGenerationState(_0xc192ab, _0x498e70["shotId"]);
      if (_0x27b396["requestId"] !== _0x498e70["requestId"]) {
        return;
      }
      _0x498e70["abortController"]?.['abort']?.();
      if (getRecoverablePersonReplacementImageTask(_0x27b396)) {
        return;
      }
      if (_0x27b396["status"] !== 'running') {
        return;
      }
      _0xc192ab = updatePersonReplacementImageGenerationState(_0xc192ab, {
        'status': 'idle',
        'shotId': _0x498e70['shotId'],
        'error': ''
      });
      _0x383781 = !![];
    });
    _0x12df5c['clear']();
    _0x5eeeec["clear"]();
    if (!_0x383781) {
      return null;
    }
    return _0x592d33?.({
      ..._0x490b18,
      'workspace': _0xc192ab
    });
  };
  return Object["freeze"]({
    'preview': ({
      projectId = '',
      shotId: _0x4c80ab,
      sourceImageSize: _0x1bd4af
    } = {}) => {
      const _0x573631 = _0x4ccade(projectId);
      const _0x284ecb = _0x573631?.["shots"]?.["find"](_0xbd1535 => _0xbd1535['id'] === _0x4c80ab);
      if (!_0x284ecb) {
        throw new Error('请先选择镜头');
      }
      const _0x275a52 = buildPersonReplacementPromptPackage({
        'project': _0x573631,
        'shot': _0x284ecb
      });
      if (_0x275a52["annotatedSource"]) {
        const _0x367f6d = buildPersonReplacementImageGate({
          'project': _0x573631,
          'shot': _0x284ecb,
          'promptPackage': _0x275a52
        });
        if (!_0x367f6d["eligible"]) {
          throw new Error(_0x367f6d["message"]);
        }
        return createAnnotatedSource(_0x275a52["annotatedSource"])["then"](_0xcbf9b7 => _0x109703({
          'project': _0x573631,
          'shot': _0x284ecb,
          'sourceImageSize': _0x1bd4af,
          'promptPackage': applyPersonReplacementAnnotatedSource(_0x275a52, _0xcbf9b7)
        }));
      }
      return _0x109703({
        'project': _0x573631,
        'shot': _0x284ecb,
        'sourceImageSize': _0x1bd4af
      });
    },
    'acceptUploadedResult': _0x22a1c7,
    'cancel': _0x1a8973,
    'destroy': _0x57947b,
    'generate': _0x1064bc,
    'resume': _0x32233f,
    'resumeRecoverable': _0x4c59d3,
    'hasActiveTasks': () => _0x12df5c["size"] > 0x0,
    'hasActiveTasksForProject': _0x408543 => {
      const _0x999277 = normalizeText(_0x408543);
      return Boolean(_0x999277) && [..._0x12df5c['values']()]['some'](_0x173bca => _0x173bca['projectId'] === _0x999277);
    }
  });
}