import { getImageGenerationResultError, getSuccessfulImageGenerationItems, normalizeImageGenerationResult } from '../../components/aigenImage/imageGenerationResultRenderer.js';
import { resolveModelExecution } from '../../manifests/index.js';
import { resumeAsyncImageTask, resumeDreaminaImageTask, resumeRunningHubImageTask } from '../../../api/aiImageApi.js';
import { buildStoryBackgroundTaskId, getStoryBackgroundTasks } from './storyBackgroundTasks.js';
import { ensureStoryAssetBaseAppearance, getStoryAssetAppearanceReferenceUrls, getStoryAssetAppearances, shouldGenerateStoryAssetBaseAppearanceFirst } from './storyAssetAppearances.js';
import { buildStoryAssetGenerationPayload, isStoryAssetAppearanceLoading, setStoryAssetAppearanceGenerating, setStoryAssetVoiceGenerating } from './storyAssetGenerationState.js';
import { createStoryAssetImageLocalization } from './storyAssetImageOutputLocalization.js';
import { applyStoryCharacterAssetPromptPreset, applyStorySceneAssetPromptPreset } from './storyAssetPromptPresets.js';
import { replaceStoryCharacterVoiceReference, resumeStoryCharacterVoice } from './storyCharacterVoice.js';
import { sanitizeStoryTaskResumePayload } from './storyProjectTaskToken.js';
function normalizeText(_0x4ef5a7) {
  return String(_0x4ef5a7 ?? '')["trim"]();
}
export function createStoryAssetGenerationController({
  state: _0x3dd7fe,
  activeRecoveries: _0x39530e,
  activeExecutions: _0x472562,
  isWorkspaceDestroyed = () => ![],
  hasImageGenerator = () => ![],
  generateImage: _0x28be91,
  createProjectToken: _0x3cf4e7,
  createProjectTokenForData: _0x332595,
  isProjectTaskLive: _0x11ad47,
  isProjectTaskCurrent: _0x4e4bca,
  registerProjectData = () => {},
  waitForRecoveryManifest: _0x25d5aa,
  startBackgroundTask: _0x14bf72,
  updateBackgroundTask: _0x4d68c2,
  finishBackgroundTask: _0xfd2bd8,
  schedulePersistence = () => {},
  render = () => {},
  findAsset: _0x500484,
  getSelectedAppearance: _0x442f0d,
  showToast = () => {},
  showTaskApiKeyError = () => ![],
  showTaskResultToast = () => {},
  notifyTaskResult = () => {},
  showNavigableTaskResultToast = () => {}
} = {}) {
  if (!_0x3dd7fe || !_0x39530e || !_0x472562) {
    throw new TypeError("Story asset generation requires state and recovery owners.");
  }
  if (typeof _0x28be91 !== "function" || typeof _0x3cf4e7 !== 'function' || typeof _0x332595 !== 'function' || typeof _0x11ad47 !== "function" || typeof _0x4e4bca !== "function" || typeof _0x25d5aa !== "function" || typeof _0x14bf72 !== "function" || typeof _0x4d68c2 !== "function" || typeof _0xfd2bd8 !== "function" || typeof _0x500484 !== "function" || typeof _0x442f0d !== "function") {
    throw new TypeError("Story asset generation requires task and asset adapters.");
  }
  const _0x1ebdd7 = (_0x23caf5, _0x5ee72d, _0x498a22 = {}) => {
    const _0x267455 = normalizeText(_0x498a22["modelId"]) || _0x3dd7fe["models"]["image"];
    const _0x346865 = normalizeText(_0x498a22['provider']) || _0x3dd7fe["imageProvider"];
    const _0x53ae39 = _0x498a22["generationParams"] && typeof _0x498a22["generationParams"] === "object" ? _0x498a22['generationParams'] : _0x3dd7fe['imageGenerationParams'];
    const _0x363b3f = normalizeText(_0x498a22["promptPresetId"]) || _0x3dd7fe['assetPromptPresetId'];
    const _0x471724 = normalizeText(_0x498a22["scenePromptPresetId"]) || _0x3dd7fe["sceneAssetPromptPresetId"];
    const _0xedfea0 = _0x23caf5["kind"] === 'character' ? applyStoryCharacterAssetPromptPreset(_0x363b3f, _0x5ee72d["prompt"]) : _0x23caf5['kind'] === "scene" ? applyStorySceneAssetPromptPreset(_0x471724, _0x5ee72d['prompt']) : _0x5ee72d["prompt"];
    const _0x379fc2 = Boolean(normalizeText(_0x5ee72d['referenceImageUrl']));
    const _0x428c4d = buildStoryAssetGenerationPayload({
      'asset': {
        ..._0x5ee72d,
        'prompt': _0xedfea0
      },
      'modelId': _0x267455,
      'provider': _0x346865,
      'generationParams': _0x53ae39,
      'referenceImageUrls': getStoryAssetAppearanceReferenceUrls(_0x23caf5, _0x5ee72d),
      'mapReferenceImageToImage2': _0x379fc2
    });
    return {
      'payload': _0x428c4d,
      'execution': resolveModelExecution(_0x428c4d["model"], {
        'providerHint': _0x428c4d["provider"]
      })
    };
  };
  const _0x1be361 = (_0xc4e9df, _0x50d256, _0x3753cb) => {
    const _0x3a6b34 = normalizeImageGenerationResult(_0x3753cb);
    const _0x2c07d1 = getSuccessfulImageGenerationItems(_0x3a6b34);
    const _0x5ea0d2 = _0x2c07d1[0x0];
    const _0x4792a6 = normalizeText(_0x5ea0d2?.['imageUrl'] || _0x5ea0d2?.["url"] || _0x5ea0d2?.["sourceUrl"] || _0x5ea0d2?.["thumbUrl"]);
    if (!_0x4792a6) {
      throw new Error(getImageGenerationResultError(_0x3a6b34) || "图像生成结果缺少可用图片");
    }
    _0x50d256['imageUrl'] = _0x4792a6;
    _0x50d256["generatedImage"] = {
      ..._0x5ea0d2
    };
    _0x50d256["generatedImages"] = _0x2c07d1["map"](_0x3a3aa7 => ({
      ..._0x3a3aa7
    }));
    _0x50d256["activeIndex"] = 0x0;
    _0x50d256['error'] = '';
    ensureStoryAssetBaseAppearance(_0xc4e9df);
    return _0x5ea0d2;
  };
  const _0x5a682a = (_0xbf7a52 = {}) => {
    const _0x5486d7 = _0xbf7a52["execution"]?.["modelManifest"];
    const _0xdda918 = _0xbf7a52["execution"]?.["executionManifest"];
    return Boolean(_0xdda918?.["adapterType"] === "workflow" || _0x5486d7?.["async"] === !![] || _0xdda918?.["extensions"]?.["taskPolling"]);
  };
  const _0x4cfda6 = async (_0x4b6c3d, _0x574ed1, _0x5e6044 = {}) => {
    const _0xc0e662 = _0x1ebdd7(_0x4b6c3d, _0x574ed1, _0x5e6044);
    const _0xfa13c6 = _0x5e6044["projectToken"] || _0x3cf4e7();
    const _0x35b66e = createStoryAssetImageLocalization({
      'asset': _0x4b6c3d,
      'appearance': _0x574ed1,
      'projectToken': _0xfa13c6,
      'isLive': _0x11ad47,
      'applyResult': _0x1be361,
      'onLocalized': () => schedulePersistence({
        'immediate': !![]
      })
    });
    const _0x184e88 = buildStoryBackgroundTaskId("asset-image", {
      'assetId': _0x4b6c3d?.['id'],
      'appearanceId': _0x574ed1?.['id']
    });
    _0x14bf72(_0xfa13c6, {
      'id': _0x184e88,
      'type': "asset-image",
      'scope': {
        'assetId': _0x4b6c3d?.['id'],
        'appearanceId': _0x574ed1?.['id']
      },
      'label': '生成' + (normalizeText(_0x4b6c3d?.["name"]) || '素材') + '形象',
      'message': "正在等待图片生成结果",
      'modelId': _0xc0e662['payload']?.["model"],
      'provider': _0xc0e662["payload"]?.["provider"],
      'providerProfileId': _0xc0e662['payload']?.["providerProfileId"] || _0xc0e662["payload"]?.["rhProviderProfileId"],
      'executionId': _0xc0e662['execution']?.["executionManifest"]?.['id'],
      'resumePayload': sanitizeStoryTaskResumePayload(_0xc0e662["payload"]),
      'batch': _0x5e6044['batch']
    });
    try {
      const _0x3c486e = _0x187858 => {
        const _0x27d22d = normalizeText(_0x187858);
        if (!_0x27d22d || !_0x11ad47(_0xfa13c6)) {
          return;
        }
        _0x4d68c2(_0xfa13c6, _0x184e88, {
          'status': "running",
          'message': '图片任务已提交，正在等待结果',
          'resumable': _0x5a682a(_0xc0e662),
          'remoteTaskId': _0x27d22d,
          'resumePayload': sanitizeStoryTaskResumePayload(_0xc0e662["payload"])
        });
      };
      const _0x1fdacf = await _0x28be91(_0xc0e662["payload"], {
        ..._0x35b66e["options"],
        'onTaskId': _0x3c486e,
        'onTaskMeta': ({
          taskId: _0x2ffec8
        } = {}) => _0x3c486e(_0x2ffec8)
      });
      if (!_0x11ad47(_0xfa13c6)) {
        return ![];
      }
      _0x1be361(_0x4b6c3d, _0x574ed1, _0x1fdacf);
      _0x35b66e["commitRemote"]();
      _0xfd2bd8(_0xfa13c6, _0x184e88, {
        'status': "succeeded",
        'message': "素材图片生成完成"
      });
      return !![];
    } catch (_0x4a774c) {
      _0x11ad47(_0xfa13c6) && _0xfd2bd8(_0xfa13c6, _0x184e88, {
        'status': "failed",
        'message': "素材图片生成失败",
        'error': _0x4a774c?.["getUserMessage"]?.() || _0x4a774c?.["message"] || "图像生成失败。"
      });
      _0x4a774c["storyAssetGenerationContext"] = _0xc0e662;
      throw _0x4a774c;
    }
  };
  const _0xc716df = async (_0x44636f, _0x261cd1 = _0x3cf4e7()) => {
    const _0x568f47 = _0x261cd1['projectId'] + ':' + _0x44636f['id'];
    if (_0x39530e['has'](_0x568f47) || _0x472562["has"](_0x568f47) || isWorkspaceDestroyed()) {
      return ![];
    }
    _0x39530e['add'](_0x568f47);
    _0x472562['add'](_0x568f47);
    registerProjectData(_0x261cd1);
    if (_0x4e4bca(_0x261cd1)) {
      setStoryAssetAppearanceGenerating(_0x3dd7fe, _0x44636f["scope"]?.["assetId"], _0x44636f["scope"]?.["appearanceId"], !![]);
      if (_0x3dd7fe['view'] === 'project' && _0x3dd7fe['step'] === 0x2) {
        render();
      }
    }
    try {
      const _0x4a283f = await _0x25d5aa({
        'modelId': _0x44636f["modelId"],
        'provider': _0x44636f["provider"]
      });
      if (!_0x4a283f || !_0x11ad47(_0x261cd1)) {
        return ![];
      }
      const _0x5cad83 = _0x261cd1['data']?.["assets"]?.['find'](_0x6fb4b8 => normalizeText(_0x6fb4b8?.['id']) === normalizeText(_0x44636f["scope"]?.["assetId"]));
      const _0x5cf4f2 = getStoryAssetAppearances(_0x5cad83)["find"](_0x41a7b3 => normalizeText(_0x41a7b3?.['id']) === normalizeText(_0x44636f["scope"]?.['appearanceId']));
      if (!_0x5cad83 || !_0x5cf4f2) {
        throw new Error("素材图片任务对应的角色或形象已不存在。");
      }
      const _0x1381d8 = createStoryAssetImageLocalization({
        'asset': _0x5cad83,
        'appearance': _0x5cf4f2,
        'projectToken': _0x261cd1,
        'isLive': _0x11ad47,
        'applyResult': _0x1be361,
        'onLocalized': () => schedulePersistence({
          'immediate': !![]
        })
      });
      const _0x17b96c = {
        ...(_0x44636f["resumePayload"] && typeof _0x44636f["resumePayload"] === "object" ? _0x44636f['resumePayload'] : {}),
        'model': _0x44636f["modelId"],
        'provider': _0x44636f["provider"]
      };
      const _0x127d25 = resolveModelExecution(_0x44636f["modelId"], {
        'providerHint': _0x44636f["provider"]
      });
      let _0x14bfd0 = null;
      if (_0x44636f["provider"] === "dreamina") {
        _0x14bfd0 = await resumeDreaminaImageTask(_0x44636f["remoteTaskId"], _0x17b96c, _0x1381d8["options"]);
      } else {
        _0x127d25?.["executionManifest"]?.["adapterType"] === "workflow" || ["runninghub", "runninghubwf"]["includes"](_0x44636f["provider"]) ? _0x14bfd0 = await resumeRunningHubImageTask(_0x44636f["remoteTaskId"], _0x17b96c, _0x1381d8["options"]) : _0x14bfd0 = await resumeAsyncImageTask(_0x44636f['remoteTaskId'], _0x17b96c, _0x1381d8["options"]);
      }
      if (!_0x11ad47(_0x261cd1)) {
        return ![];
      }
      _0x1be361(_0x5cad83, _0x5cf4f2, _0x14bfd0);
      _0x1381d8['commitRemote']();
      _0xfd2bd8(_0x261cd1, _0x44636f['id'], {
        'status': "succeeded",
        'message': "素材图片任务已恢复并生成完成"
      });
      schedulePersistence({
        'immediate': !![]
      });
      _0x4e4bca(_0x261cd1) && _0x3dd7fe["view"] === "project" && _0x3dd7fe["step"] === 0x2 && render();
      showNavigableTaskResultToast("素材图片任务已恢复并生成完成。", "success", _0x261cd1, {
        'step': 0x2,
        'assetId': _0x44636f['scope']?.["assetId"]
      });
      return !![];
    } catch (_0x268f36) {
      if (!_0x11ad47(_0x261cd1)) {
        return ![];
      }
      _0xfd2bd8(_0x261cd1, _0x44636f['id'], {
        'status': "failed",
        'message': "素材图片任务恢复失败",
        'error': _0x268f36?.["message"] || "素材图片任务恢复失败。"
      });
      showTaskResultToast(_0x268f36?.['message'] || "素材图片任务恢复失败。", 'error', _0x268f36);
      return ![];
    } finally {
      _0x39530e["delete"](_0x568f47);
      _0x472562["delete"](_0x568f47);
      if (_0x4e4bca(_0x261cd1)) {
        setStoryAssetAppearanceGenerating(_0x3dd7fe, _0x44636f["scope"]?.['assetId'], _0x44636f["scope"]?.["appearanceId"], ![]);
        if (_0x3dd7fe["view"] === 'project' && _0x3dd7fe['step'] === 0x2) {
          render();
        }
      }
    }
  };
  const _0x5b6167 = async (_0x22fd8a, _0x5f3f07 = _0x3cf4e7()) => {
    const _0x30381e = _0x5f3f07["projectId"] + ':' + _0x22fd8a['id'];
    if (_0x39530e['has'](_0x30381e) || _0x472562['has'](_0x30381e) || isWorkspaceDestroyed()) {
      return ![];
    }
    _0x39530e["add"](_0x30381e);
    _0x472562["add"](_0x30381e);
    registerProjectData(_0x5f3f07);
    if (_0x4e4bca(_0x5f3f07)) {
      setStoryAssetVoiceGenerating(_0x3dd7fe, _0x22fd8a["scope"]?.["assetId"], !![]);
      if (_0x3dd7fe["view"] === 'project' && _0x3dd7fe["step"] === 0x2) {
        render();
      }
    }
    try {
      const _0x47b37c = await _0x25d5aa({
        'modelId': _0x22fd8a["modelId"],
        'provider': _0x22fd8a["provider"]
      });
      if (!_0x47b37c || !_0x11ad47(_0x5f3f07)) {
        return ![];
      }
      const _0x45b560 = _0x5f3f07["data"]?.["assets"]?.["find"](_0x959ecb => normalizeText(_0x959ecb?.['id']) === normalizeText(_0x22fd8a['scope']?.["assetId"]));
      if (!_0x45b560) {
        throw new Error('角色声音任务对应的角色已不存在。');
      }
      const _0x2b2874 = await resumeStoryCharacterVoice({
        'asset': _0x45b560,
        'taskId': _0x22fd8a['remoteTaskId'],
        'payload': _0x22fd8a["resumePayload"] || {}
      });
      if (!_0x2b2874 || !_0x11ad47(_0x5f3f07)) {
        return ![];
      }
      replaceStoryCharacterVoiceReference(_0x45b560, _0x2b2874);
      _0xfd2bd8(_0x5f3f07, _0x22fd8a['id'], {
        'status': 'succeeded',
        'message': "角色声音任务已恢复并生成完成"
      });
      schedulePersistence({
        'immediate': !![]
      });
      _0x4e4bca(_0x5f3f07) && _0x3dd7fe["view"] === 'project' && _0x3dd7fe["step"] === 0x2 && render();
      showNavigableTaskResultToast("角色声音任务已恢复并生成完成。", 'success', _0x5f3f07, {
        'step': 0x2,
        'assetId': _0x22fd8a["scope"]?.["assetId"]
      });
      return !![];
    } catch (_0x22b7f9) {
      if (!_0x11ad47(_0x5f3f07)) {
        return ![];
      }
      _0xfd2bd8(_0x5f3f07, _0x22fd8a['id'], {
        'status': "failed",
        'message': "角色声音任务恢复失败",
        'error': _0x22b7f9?.["message"] || "角色声音任务恢复失败。"
      });
      showTaskResultToast(_0x22b7f9?.["message"] || "角色声音任务恢复失败。", "error", _0x22b7f9);
      return ![];
    } finally {
      _0x39530e["delete"](_0x30381e);
      _0x472562['delete'](_0x30381e);
      if (_0x4e4bca(_0x5f3f07)) {
        setStoryAssetVoiceGenerating(_0x3dd7fe, _0x22fd8a['scope']?.["assetId"], ![]);
        normalizeText(_0x3dd7fe['characterVoiceEditor']?.["assetId"]) === normalizeText(_0x22fd8a["scope"]?.["assetId"]) && (_0x3dd7fe["characterVoiceEditor"]["isGenerating"] = ![]);
        if (_0x3dd7fe["view"] === "project" && _0x3dd7fe["step"] === 0x2) {
          render();
        }
      }
    }
  };
  const _0x44e6b5 = (_0x2ba814 = _0x3dd7fe["data"]) => {
    const _0x506af1 = _0x332595(_0x2ba814);
    const _0x4158f0 = getStoryBackgroundTasks(_0x2ba814)["filter"](_0x195aaf => ["asset-image", "asset-voice"]["includes"](_0x195aaf['type']) && _0x195aaf["resumable"] && _0x195aaf["remoteTaskId"] && ['queued', "submitting", 'pending', 'running', "recovering"]["includes"](_0x195aaf["status"]));
    _0x4158f0['forEach'](_0x7c26ec => {
      _0x7c26ec['type'] === "asset-voice" ? void _0x5b6167(_0x7c26ec, _0x506af1) : void _0xc716df(_0x7c26ec, _0x506af1);
    });
    return _0x4158f0["length"];
  };
  const _0x4de423 = (_0x31b51d, {
    showFallbackToast = !![]
  } = {}) => {
    const _0x398213 = _0x31b51d?.['storyAssetGenerationContext'] || {};
    const _0x41d6be = showTaskApiKeyError(_0x31b51d, {
      'providerId': _0x398213['payload']?.['provider'] || _0x3dd7fe['imageProvider'],
      'model': _0x398213['payload']?.['model'] || _0x3dd7fe['models']["image"],
      'adapterType': _0x398213["execution"]?.['executionManifest']?.["adapterType"] || ''
    });
    if (!_0x41d6be && showFallbackToast) {
      showTaskResultToast(_0x31b51d?.["getUserMessage"]?.() || _0x31b51d?.["message"] || '图像生成失败，请稍后重试。', 'error', _0x31b51d);
    } else {
      !_0x41d6be && notifyTaskResult(null, _0x31b51d?.['getUserMessage']?.() || _0x31b51d?.["message"] || "图像生成失败，请稍后重试。", 'error', {
        'details': _0x31b51d
      });
    }
    return _0x41d6be;
  };
  const _0x45a684 = async () => {
    const _0x33fd87 = _0x500484(_0x3dd7fe["selectedAssetId"]);
    const _0x1d87de = _0x33fd87 ? _0x442f0d(_0x3dd7fe, _0x33fd87) : null;
    if (!_0x33fd87 || !_0x1d87de || _0x33fd87['isLibraryAsset'] || isStoryAssetAppearanceLoading(_0x3dd7fe, _0x33fd87['id'], _0x1d87de['id'])) {
      return;
    }
    if (!normalizeText(_0x1d87de['prompt'])) {
      showToast("请先填写提示词。", "warn");
      return;
    }
    if (shouldGenerateStoryAssetBaseAppearanceFirst(_0x33fd87, _0x1d87de)) {
      showToast('请先生成基础形象，再生成其他形象。', "warn");
      return;
    }
    if (!hasImageGenerator()) {
      showToast("图像生成服务尚未初始化。", "error");
      return;
    }
    const _0x36e664 = _0x3cf4e7();
    setStoryAssetAppearanceGenerating(_0x3dd7fe, _0x33fd87['id'], _0x1d87de['id'], !![]);
    _0x1d87de["error"] = '';
    render();
    try {
      await _0x4cfda6(_0x33fd87, _0x1d87de, {
        'projectToken': _0x36e664
      });
      if (!_0x11ad47(_0x36e664)) {
        return ![];
      }
      showNavigableTaskResultToast("当前形象已生成。", "success", _0x36e664, {
        'step': 0x2,
        'assetId': _0x33fd87['id']
      });
      schedulePersistence({
        'immediate': !![]
      });
      return !![];
    } catch (_0x886ef7) {
      if (!_0x11ad47(_0x36e664)) {
        return ![];
      }
      _0x1d87de["error"] = _0x886ef7?.["getUserMessage"]?.() || _0x886ef7?.["message"] || '生成失败';
      _0x4de423(_0x886ef7);
      return ![];
    } finally {
      _0x4e4bca(_0x36e664) && (setStoryAssetAppearanceGenerating(_0x3dd7fe, _0x33fd87['id'], _0x1d87de['id'], ![]), render());
    }
  };
  return Object["freeze"]({
    'previewSelected': () => {
      const _0xec20cf = _0x500484(_0x3dd7fe["selectedAssetId"]);
      const _0x3ce1fc = _0xec20cf ? _0x442f0d(_0x3dd7fe, _0xec20cf) : null;
      if (!_0xec20cf || !_0x3ce1fc) {
        throw new Error("请先选择素材形象");
      }
      return _0x1ebdd7(_0xec20cf, _0x3ce1fc);
    },
    'applyImageResult': _0x1be361,
    'canResumeImageTask': _0x5a682a,
    'generateSelected': _0x45a684,
    'getAppearanceGenerationContext': _0x1ebdd7,
    'requestAppearanceImage': _0x4cfda6,
    'resumeImageTask': _0xc716df,
    'resumePersistedTasks': _0x44e6b5,
    'resumeVoiceTask': _0x5b6167,
    'showGenerationError': _0x4de423
  });
}