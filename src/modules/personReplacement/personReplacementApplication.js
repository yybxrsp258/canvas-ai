import { buildPersonReplacementVideoRequest } from './personReplacementVideoRequest.js';
import { getPersonReplacementDetectionFeedback, recordPersonReplacementDetectionFailure } from './personReplacementDetectionFeedback.js';
import { createPersonReplacementCompletionNavigation } from './personReplacementCompletionNavigation.js';
import { PERSON_REPLACEMENT_DEFAULT_IMAGE_MODEL_ID, PERSON_REPLACEMENT_DEFAULT_VIDEO_MODEL_ID, PERSON_REPLACEMENT_VIDEO_INPUT_MODE_FIRST_FRAME, createPersonReplacementProject, confirmPersonReplacementSourceCharacter, formatPersonReplacementPersonLabel, getPersonReplacementVideoResults, getPersonReplacementCharacterBaseImageRef, mergePersonReplacementSourceCharacters, normalizePersonReplacementOrientation, normalizePersonReplacementScope, splitPersonReplacementSourceCharacter } from './personReplacementProject.js';
import { resolvePersonReplacementVideoSlotState } from './personReplacementVideoInputs.js';
import { applyPersonReplacementCharacterAssetPromptPreset, createPersonReplacementImageGenerationMappingRevision, createPersonReplacementImagePromptRequestResolver, resolveGeneratedPersonReplacementAppearanceName as a1190_0x100dfd } from './personReplacementImageGeneration.js';
import { createPersonReplacementImageTaskRuntime } from './personReplacementImageTaskRuntime.js';
import { getFirstSuccessfulImageRef } from './personReplacementCharacterAppearanceLocalization.js';
import { updatePersonReplacementVideoGenerationState } from './personReplacementVideoGeneration.js';
import { runPersonReplacementSmartClip } from './personReplacementSmartClipService.js';
import { createReplacementStudioWorkspace } from './personReplacementWorkspace.js';
import { PERSON_REPLACEMENT_WORKSPACE_INTENTS, createPersonReplacementWorkspaceIntentPort } from './personReplacementWorkspaceIntentPort.js';
import { createReplacementStudioProjectSession, normalizeReplacementStudioApplicationProject, settleInterruptedReplacementStudioProjectTasks } from './personReplacementProjectSession.js';
import { PERSON_REPLACEMENT_STEP_GATE_REASONS } from './personReplacementWorkflow.js';
import { createPersonReplacementOutputCoordinator } from './personReplacementOutputCoordinator.js';
import { createPersonReplacementVoiceSeparationRuntime } from './personReplacementVoiceSeparation.js';
import { PERSON_REPLACEMENT_OUTPUT_TRANSITIONS, transitionPersonReplacementOutput } from './personReplacementOutputLineage.js';
import { PERSON_REPLACEMENT_CUT_EPSILON_SEC as a1190_0x360da3, buildPersonReplacementDetectedShotCutRanges, normalizePersonReplacementShotCutRanges } from './personReplacementShotCutModel.js';
import { materializePersonReplacementShotPlayback } from './personReplacementShotReverse.js';
import { hydratePersonReplacementSourcePlaybackRefs } from './personReplacementSourcePlayback.js';
import { createPersonReplacementShotCutMutationCoordinator, createPersonReplacementShotReverseOperation } from './personReplacementShotCutMutationCoordinator.js';
import { createPersonReplacementVideoPreparationRunner } from './personReplacementVideoPreparation.js';
import { createPersonReplacementVideoTaskRuntime } from './personReplacementVideoTaskRuntime.js';
import { uploadPersonReplacementVideoResult } from './personReplacementVideoResultUpload.js';
import { resolvePersonReplacementCharacterImageBatchConcurrency } from './personReplacementBatchConcurrency.js';
import { buildPersonReplacementSourceCharacters as a1190_0x50f84a, normalizePersonReplacementBoundingBox, orderAndRelabelPersonReplacementPeople } from './personReplacementSourceIdentity.js';
import { REPLACEMENT_STUDIO_NAME } from './replacementStudioTerminology.js';
import { normalizePersonReplacementProjectLibrary, removePersonReplacementProject, upsertPersonReplacementProject } from './personReplacementProjectLibrary.js';
import { createPersonReplacementProjectLibraryWorkspaceController } from './personReplacementProjectLibraryWorkspaceController.js';
import { detectPersonReplacementPeople, identifyPersonReplacementPeople } from '../../../api/personReplacementModelPackApi.js';
import { fetchVideoFirstFrameThumbFromServer } from '../../../api/videoThumbApi.js';
import { fetchVideoMetaFromServer } from '../../../api/videoMetaApi.js';
import { enqueueElectronMediaTask } from '../../../api/localMediaTaskApi.js';
import { initAudioVoicePanel } from '../audioVoicePanel.js';
import { localPathToUrl, normalizeLocalPath, pickResultLocalPath } from '../../utils/localMediaPath.js';
import { createTrackedMediaObjectUrl, revokeTrackedMediaObjectUrl } from '../../services/mediaObjectUrlRegistry.js';
import { buildCharacterAssetImageGenerationPayload } from '../characterAssets/characterAssetImageGeneration.js';
import { getModelManifest } from '../../manifests/index.js';
import { createWorkspacePersistenceCoordinator } from '../workspacePersistenceCoordinator.js';
import { buildPersonReplacementWorkspaceSnapshot } from './personReplacementWorkspaceSnapshot.js';
import { saveMediaDownload, saveMediaFilesDownload } from '../../services/downloadSaveService.js';
import { checkLocalMediaExists as a1190_0x5c612c } from '../../services/projectService.js';
import { playCompletionSound } from '../../services/completionSoundService.js';
import { prepareImportedVideoAsset } from '../../services/importedVideoAssetService.js';
import { showGenerationCompleteNotification } from '../../services/completionNotificationService.js';
import { createPersonReplacementAppearanceAssetLibraryOperation, readPersonReplacementLibraryAssets } from './personReplacementAssetPackage.js';
import { buildPersonReplacementLibraryVoiceReference, getPersonReplacementAudioSavedName, getPersonReplacementLibraryAudioRef } from './personReplacementVoiceLibrary.js';
function normalizeText(_0xdec188) {
  return String(_0xdec188 ?? '')['trim']();
}
function resolveSmartClipFailureMessage(_0x1442a6) {
  const _0x43cf89 = _0x1442a6?.["stages"]?.["keyframes"]?.["error"] || _0x1442a6?.["error"];
  if (normalizeText(_0x43cf89?.["code"]) === "no_results") {
    return "视频无法读取有效时长或提取关键帧";
  }
  return normalizeText(_0x43cf89?.['message'] || _0x43cf89) || "视频未检测到可用片段";
}
function cloneJson(_0x48fb08) {
  return _0x48fb08 && typeof _0x48fb08 === 'object' ? JSON["parse"](JSON["stringify"](_0x48fb08)) : _0x48fb08;
}
function nowIso() {
  return new Date()["toISOString"]();
}
function createId(_0x572f60) {
  const _0xa9b17e = globalThis['crypto']?.["randomUUID"]?.();
  return _0x572f60 + '-' + (_0xa9b17e || Date["now"]() + '-' + Math['round'](Math["random"]() * 0x186a0));
}
function resolveMediaRef(_0x39392e) {
  if (typeof _0x39392e === 'string') {
    return normalizeText(_0x39392e);
  }
  return normalizeText(pickResultLocalPath(_0x39392e) || _0x39392e?.["displayUrl"] || _0x39392e?.["videoUrl"] || _0x39392e?.["imageUrl"] || _0x39392e?.['url'] || _0x39392e?.["originalUrl"] || _0x39392e?.['path']);
}
function resolveMediaUrl(_0x5f1108) {
  const _0x11b56d = resolveMediaRef(_0x5f1108);
  return _0x11b56d ? localPathToUrl(_0x11b56d) || _0x11b56d : '';
}
function resolveDurationSec(_0x147231) {
  const _0x4385e9 = Number(_0x147231?.["durationSec"] ?? _0x147231?.['videoDuration'] ?? _0x147231?.["duration"] ?? _0x147231?.["metadata"]?.['duration']);
  return Number["isFinite"](_0x4385e9) && _0x4385e9 > 0x0 ? _0x4385e9 : 0x0;
}
function resolveVideoThumbnailRef(_0x50383f) {
  return normalizeText(_0x50383f?.["posterLocalPath"] || _0x50383f?.["thumbLocalPath"] || _0x50383f?.['posterUrl'] || _0x50383f?.["thumbUrl"]);
}
function resolveVideoPlaybackRef(_0x2a0189) {
  return normalizeText(normalizeLocalPath(_0x2a0189?.["displayLocalPath"] || _0x2a0189?.["displayUrl"]) || _0x2a0189?.["displayUrl"]);
}
function createProjectTitle(_0x2e5f12) {
  return normalizeText(_0x2e5f12)["replace"](/^.*[\\/]/u, '')["replace"](/\.[^.]+$/u, '') || "未命名人物替换项目";
}
function createUploadedAssetName(_0x4f63d0, _0x5ca57f) {
  return normalizeText(_0x4f63d0)["replace"](/^.*[\\/]/u, '')['replace'](/\.[^.]+$/u, '') || _0x5ca57f;
}
const createApplicationProject = normalizeReplacementStudioApplicationProject;
function createInitialProject() {
  const _0x509b6b = nowIso();
  return createApplicationProject(createPersonReplacementProject({
    'id': createId('person-replacement'),
    'title': '未命名人物替换项目',
    'status': "draft",
    'settings': {
      'characterImageModelId': PERSON_REPLACEMENT_DEFAULT_IMAGE_MODEL_ID,
      'characterImageProvider': "apimart",
      'replacementImageModelId': PERSON_REPLACEMENT_DEFAULT_IMAGE_MODEL_ID,
      'replacementImageProvider': "apimart",
      'replacementModelId': PERSON_REPLACEMENT_DEFAULT_VIDEO_MODEL_ID,
      'replacementVideoInputMode': PERSON_REPLACEMENT_VIDEO_INPUT_MODE_FIRST_FRAME,
      'automationMode': 'review'
    },
    'sources': [],
    'characters': [],
    'shots': [],
    'workspace': {
      'view': "home",
      'step': 0x1
    },
    'createdAt': _0x509b6b,
    'updatedAt': _0x509b6b
  }));
}
function isPersistable(_0x1e2812) {
  return Boolean(_0x1e2812?.["characters"]?.["length"] || _0x1e2812?.['shots']?.["length"] || _0x1e2812?.["status"] && _0x1e2812["status"] !== "draft");
}
export function createReplacementStudioApplication({
  documentObject = globalThis['document'],
  windowObject = globalThis["window"],
  mountTarget = "#v2-wrap",
  uploadFile: _0x1ada41,
  prepareUploadedVideoAsset = prepareImportedVideoAsset,
  checkMediaExists = a1190_0x5c612c,
  generateCharacterImage: _0x311137,
  generateReplacementImage = _0x311137,
  promptEnhancement = {},
  resumeReplacementImage: _0x5413ce,
  createLocationGuide: _0x45792a,
  generateReplacementVideo: _0x3403ce,
  resolveInstallId: _0x4c3401,
  loadWorkspace: _0x2ede86,
  saveWorkspace: _0x526e0b,
  runSmartClip = runPersonReplacementSmartClip,
  fetchFirstFrame = fetchVideoFirstFrameThumbFromServer,
  fetchVideoMeta = fetchVideoMetaFromServer,
  detectPeople = detectPersonReplacementPeople,
  identifyPeople = identifyPersonReplacementPeople,
  createWorkspace = createReplacementStudioWorkspace,
  createVoicePanel = initAudioVoicePanel,
  enqueueMediaTask = enqueueElectronMediaTask,
  playCompletion = playCompletionSound,
  showCompletionNotification = showGenerationCompleteNotification,
  saveMedia = saveMediaDownload,
  saveMediaFiles = saveMediaFilesDownload,
  saveAssetPackageItem = null,
  persistOutputFromUrl = null,
  createOutputCanvas = null,
  listLibraryAssets = () => [],
  subscribeLibraryAssets = null,
  projectPackages = null,
  onRequestClose = () => {},
  showToast = windowObject?.['showToast']?.["bind"]?.(windowObject) || (() => {})
} = {}) {
  let _0x239c02 = createInitialProject();
  const _0x1149ad = createReplacementStudioProjectSession({
    'initialProject': _0x239c02,
    'now': nowIso
  });
  const _0xdd6eff = _0x1149ad['subscribe'](_0x2747f5 => {
    _0x239c02 = _0x2747f5['project'];
    _0x2747f5['source'] === "workspace" && _0x2747f5["reason"] === "step-change" && _0x2747f5["previousProject"]?.["workspace"]?.["step"] !== 0x3 && _0x2747f5["project"]["workspace"]?.["step"] === 0x3 && void _0x174c74();
  });
  let _0x509713 = normalizePersonReplacementProjectLibrary();
  let _0x570baa = "home";
  let _0x21af85 = null;
  let _0x1c7532 = ![];
  let _0x1d9865 = ![];
  let _0x1ded1a = {
    'status': typeof _0x526e0b === "function" ? "saved" : 'idle',
    'error': '',
    'retryAttempt': 0x0
  };
  let _0x534757 = null;
  let _0x524bb8 = null;
  let _0x38250f = null;
  let _0x742181 = null;
  let _0x1bfe3f = () => {};
  const _0x584375 = new Set();
  const _0x35b7ea = new Set();
  const _0x2cb1d4 = createPersonReplacementShotCutMutationCoordinator();
  const _0x5c27d4 = new Map();
  const _0x3dfb54 = (_0x165bad = {}) => {
    void Promise['allSettled']([Promise['resolve']()['then'](() => playCompletion?.('generation-success')), Promise["resolve"]()["then"](() => showCompletionNotification?.(_0x165bad))])['then'](_0x7e59d => {
      _0x7e59d["forEach"](_0x190531 => {
        if (_0x190531["status"] !== "rejected") {
          return;
        }
        console["warn"]("[replacementStudio] completion feedback failed", _0x190531["reason"]);
      });
    });
  };
  const _0x5bca43 = ({
    kind = "image",
    mediaRef = '',
    projectId = _0x239c02['id']
  } = {}) => {
    const _0x321849 = kind === 'video';
    const _0x43ac05 = kind === "asset";
    _0x3dfb54({
      'navigation': {
        'source': "replacement-studio",
        'projectId': projectId,
        'step': _0x321849 ? 0x3 : _0x43ac05 ? 0x1 : 0x2
      },
      'body': _0x321849 ? '人物替换视频生成完成。' : _0x43ac05 ? '人物形象生成完成。' : "人物替换首帧生成完成。",
      'mediaKind': _0x321849 ? "video" : "image",
      'node': {
        'name': _0x321849 ? "人物替换视频" : _0x43ac05 ? "人物形象" : "人物替换首帧",
        ...(_0x321849 ? {
          'videoUrl': mediaRef
        } : {
          'imageUrl': mediaRef
        })
      }
    });
  };
  const _0x20ca05 = ({
    kind = "image",
    projectId = _0x239c02['id'],
    totalCount = 0x0,
    successCount = 0x0
  } = {}) => {
    const _0x48f008 = Math['max'](0x0, Math["trunc"](Number(totalCount) || 0x0));
    if (!_0x48f008) {
      return ![];
    }
    const _0x1cfe75 = Math["max"](0x0, Math['min'](_0x48f008, Math["trunc"](Number(successCount) || 0x0)));
    const _0x55fd64 = _0x48f008 - _0x1cfe75;
    const _0x764086 = kind === "asset" ? "人物形象" : kind === 'video' ? '替换视频' : "替换首帧";
    _0x3dfb54({
      'body': _0x55fd64 > 0x0 ? '批量' + _0x764086 + "生成已结束：成功 " + _0x1cfe75 + " 个，失败 " + _0x55fd64 + " 个。" : _0x48f008 + '\x20个' + _0x764086 + "已全部生成完成。",
      'navigation': {
        'source': 'replacement-studio',
        'projectId': projectId,
        'step': kind === 'video' ? 0x3 : kind === 'asset' ? 0x1 : 0x2
      }
    });
    return !![];
  };
  async function _0x331565(_0x3d6523) {
    const _0x2ebdf3 = normalizeText(windowObject?.["__aicInstallId"] || globalThis["__aicInstallId"]);
    if (getModelManifest(_0x3d6523)?.["vip"] !== !![]) {
      return _0x2ebdf3;
    }
    try {
      const _0x52d016 = typeof _0x4c3401 === "function" ? await _0x4c3401() : typeof windowObject?.["ensureSubscriptionInstallId"] === 'function' ? await windowObject["ensureSubscriptionInstallId"]() : '';
      return normalizeText(_0x52d016) || _0x2ebdf3;
    } catch {
      return _0x2ebdf3;
    }
  }
  const _0x2318fb = () => Boolean(_0x534757 || _0x584375["size"] || _0x35b7ea["size"]);
  const _0x33c589 = (_0x3d5697 = _0x239c02['id']) => {
    const _0x4d844b = normalizeText(_0x3d5697);
    const _0x33c59 = _0x4d844b === normalizeText(_0x239c02['id']);
    return Boolean(_0x33c59 && _0x534757 || _0x33c59 && _0x584375['size'] || _0x524bb8?.['hasActiveTasksForProject']?.(_0x4d844b) || _0x38250f?.["hasActiveTasksForProject"]?.(_0x4d844b) || _0x33c59 && _0x35b7ea["size"]);
  };
  const _0x4b0493 = () => _0x239c02['sources']["some"](_0x53dc75 => normalizeText(_0x53dc75?.["processingStatus"])['toLowerCase']() === "uploading");
  const _0x3c724d = (_0x11d6e1, _0x5ed558) => normalizeText(_0x11d6e1) + '\x1f' + normalizeText(_0x5ed558);
  const _0x318c30 = (_0x37dede, _0x1514bd = _0x239c02['id']) => {
    const _0x4837bc = _0x3c724d(_0x1514bd, _0x37dede);
    const _0x4d69d7 = _0x5c27d4["get"](_0x4837bc) || '';
    _0x5c27d4['delete'](_0x4837bc);
    return _0x4d69d7;
  };
  const _0x47e176 = (_0x2f7fc7, _0x2d10b8 = _0x239c02['id']) => {
    const _0x2196d5 = _0x318c30(_0x2f7fc7, _0x2d10b8);
    if (_0x2196d5) {
      revokeTrackedMediaObjectUrl(_0x2196d5);
    }
  };
  const _0x21e35d = (_0x179e94 = '') => {
    const _0x3d0f02 = normalizeText(_0x179e94);
    [..._0x5c27d4["entries"]()]["forEach"](([_0x4596d4, _0xae1471]) => {
      if (_0x3d0f02 && !_0x4596d4["startsWith"](_0x3d0f02 + '\x1f')) {
        return;
      }
      _0x5c27d4["delete"](_0x4596d4);
      if (_0xae1471) {
        revokeTrackedMediaObjectUrl(_0xae1471);
      }
    });
  };
  const _0x1e2d3d = (_0x4bce5e, _0x5727b9) => {
    const _0x359fb4 = normalizeText(_0x5727b9);
    if (!_0x4bce5e || !_0x359fb4) {
      return '';
    }
    _0x47e176(_0x359fb4);
    try {
      const _0x54cc9b = createTrackedMediaObjectUrl(_0x4bce5e, {
        'kind': "video",
        'ownerId': 'person-replacement:' + _0x239c02['id'] + ':' + _0x359fb4,
        'sourceUrl': normalizeText(_0x4bce5e["name"])
      });
      _0x54cc9b && _0x5c27d4["set"](_0x3c724d(_0x239c02['id'], _0x359fb4), _0x54cc9b);
      return _0x54cc9b;
    } catch {
      return '';
    }
  };
  const _0x2186e9 = (_0x49f135 = _0x239c02) => {
    isPersistable(_0x49f135) && (_0x509713 = upsertPersonReplacementProject(_0x509713, _0x49f135));
  };
  const _0xe6501d = () => readPersonReplacementLibraryAssets(listLibraryAssets);
  const _0x12e469 = (_0x259431 = !![]) => buildPersonReplacementWorkspaceSnapshot({
    'project': _0x239c02,
    'sourcePreviewUrls': _0x5c27d4,
    'persistenceState': _0x1ded1a,
    'workspaceView': _0x570baa,
    'libraryProjects': _0x259431 ? _0x509713["projects"] : undefined,
    'libraryAssets': _0xe6501d()
  });
  const _0x1b1cf3 = (_0x53f314, {
    error = '',
    retryAttempt = _0x1ded1a["retryAttempt"]
  } = {}) => {
    _0x1ded1a = {
      'status': _0x53f314,
      'error': normalizeText(error),
      'retryAttempt': Math["max"](0x0, Math["trunc"](Number(retryAttempt) || 0x0))
    };
    _0x21af85?.["setPersistenceState"]?.(cloneJson(_0x1ded1a));
    return _0x1ded1a;
  };
  const _0x962d37 = createWorkspacePersistenceCoordinator({
    'ready': ![],
    'debounceMs': 0x15e,
    'save': _0x526e0b,
    'getSnapshot': () => {
      _0x2186e9();
      return cloneJson(_0x509713);
    },
    'setTimeoutFn': windowObject?.['setTimeout']?.["bind"]?.(windowObject),
    'clearTimeoutFn': windowObject?.["clearTimeout"]?.['bind']?.(windowObject),
    'onStateChange': ({
      status: _0x1aca14,
      error: _0x45a3b5,
      retryAttempt: _0x1b94a6
    }) => {
      _0x1b1cf3(_0x1aca14, {
        'error': _0x45a3b5,
        'retryAttempt': _0x1b94a6
      });
    },
    'onError': _0x4f36eb => {
      console['warn']("[replacementStudio] persist failed", _0x4f36eb);
    }
  });
  const _0x57a6c0 = ({
    force = ![]
  } = {}) => _0x1c7532 ? Promise["resolve"](null) : _0x962d37['flush']({
    'force': force
  });
  const _0x40d326 = () => {
    if (_0x1c7532) {
      return;
    }
    _0x962d37["schedule"]();
  };
  const _0x5535e1 = () => _0x21af85?.["setProject"]?.(_0x12e469());
  const _0x55cda6 = () => {
    if (typeof _0x21af85?.['syncProjectState'] === "function") {
      return _0x21af85["syncProjectState"](_0x12e469(_0x570baa !== "project"), {
        'returnSnapshot': ![]
      });
    }
    return _0x5535e1();
  };
  _0x1149ad['connect']({
    'rememberProject': _0x2186e9,
    'presentProject': ({
      presentation: _0x34b2af
    }) => {
      if (_0x34b2af === "state") {
        return _0x55cda6();
      }
      return _0x5535e1();
    },
    'schedulePersistence': _0x40d326
  });
  const _0x5a31bd = (_0x16ebc1, {
    persist = !![],
    sync = !![],
    renderWorkspace = !![]
  } = {}) => _0x1149ad["replace"](_0x16ebc1, {
    'persist': persist,
    'presentation': !sync ? "none" : renderWorkspace ? 'render' : 'state'
  });
  const _0x557120 = async ({
    expectedProjectId = _0x239c02['id'],
    renderWorkspace = !![]
  } = {}) => {
    const _0x47c671 = normalizeText(expectedProjectId);
    const _0x29d2c8 = cloneJson(_0x239c02);
    const _0x5802bc = await hydratePersonReplacementSourcePlaybackRefs(_0x29d2c8, {
      'checkMediaExists': checkMediaExists
    });
    if (_0x1c7532 || !_0x5802bc["changed"] || normalizeText(_0x239c02['id']) !== _0x47c671) {
      return ![];
    }
    const _0x276590 = new Map(_0x5802bc["project"]["sources"]['map'](_0xfa7746 => [normalizeText(_0xfa7746?.['id']), _0xfa7746]));
    let _0xeaaba5 = ![];
    const _0x10e1b4 = _0x239c02["sources"]["map"](_0x110853 => {
      const _0xec55fe = _0x276590["get"](normalizeText(_0x110853?.['id']));
      if (!_0xec55fe || normalizeText(_0xec55fe["videoRef"]) !== normalizeText(_0x110853["videoRef"]) || normalizeText(_0xec55fe['playbackVideoRef']) === normalizeText(_0x110853["playbackVideoRef"])) {
        return _0x110853;
      }
      _0xeaaba5 = !![];
      return {
        ..._0x110853,
        ...(_0xec55fe["assetId"] ? {
          'assetId': _0xec55fe["assetId"]
        } : {}),
        'playbackVideoRef': _0xec55fe["playbackVideoRef"]
      };
    });
    if (!_0xeaaba5) {
      return ![];
    }
    _0x5a31bd({
      ..._0x239c02,
      'sources': _0x10e1b4
    }, {
      'renderWorkspace': renderWorkspace
    });
    return !![];
  };
  const _0x2fd56d = _0x2d90f4 => {
    const _0x5b3a33 = normalizeText(_0x2d90f4);
    if (!_0x5b3a33) {
      return null;
    }
    if (normalizeText(_0x239c02['id']) === _0x5b3a33) {
      return cloneJson(_0x239c02);
    }
    const _0x2c58dd = _0x509713["projects"]["find"](_0x34de08 => normalizeText(_0x34de08?.['id']) === _0x5b3a33);
    return _0x2c58dd ? createApplicationProject(_0x2c58dd, _0x2c58dd) : null;
  };
  const _0x10aa36 = (_0x269dde, _0xb32d1b, {
    persist = !![],
    renderWorkspace = ![]
  } = {}) => {
    const _0x5d04ee = normalizeText(_0x269dde || _0xb32d1b?.['id']);
    if (!_0x5d04ee || normalizeText(_0xb32d1b?.['id']) !== _0x5d04ee) {
      return null;
    }
    if (normalizeText(_0x239c02['id']) === _0x5d04ee) {
      return _0x5a31bd(_0xb32d1b, {
        'persist': persist,
        'renderWorkspace': renderWorkspace
      });
    }
    const _0x3ed840 = _0x509713["projects"]['find'](_0x4c7e90 => normalizeText(_0x4c7e90?.['id']) === _0x5d04ee);
    if (!_0x3ed840) {
      return null;
    }
    const _0xcfdefb = normalizeText(_0x239c02['id']);
    const _0x2da3fd = createApplicationProject(_0xb32d1b, _0x3ed840);
    _0x509713 = upsertPersonReplacementProject(_0x509713, _0x2da3fd);
    _0x509713 = {
      ..._0x509713,
      'currentProjectId': _0xcfdefb || _0x509713["currentProjectId"]
    };
    if (persist) {
      _0x40d326();
    }
    if (_0x570baa === "home") {
      _0x55cda6();
    }
    return cloneJson(_0x2da3fd);
  };
  _0x524bb8 = createPersonReplacementImageTaskRuntime({
    'getProject': () => _0x239c02,
    'getProjectById': _0x2fd56d,
    'commitProject': _0x1f80a8 => _0x5a31bd(_0x1f80a8, {
      'renderWorkspace': ![]
    }),
    'commitProjectById': (_0x807f16, _0x191d51) => _0x10aa36(_0x807f16, _0x191d51, {
      'renderWorkspace': ![]
    }),
    'generateImage': generateReplacementImage,
    ...promptEnhancement,
    'createLocationGuide': _0x45792a,
    'resumeImageTask': _0x5413ce,
    'createRequestId': () => createId("replacement-image-request"),
    'resolvePromptRequest': createPersonReplacementImagePromptRequestResolver(),
    'showToast': showToast,
    'now': nowIso,
    'notifyCompletion': _0x5bca43,
    'persistNow': _0x57a6c0
  });
  const _0x36d006 = createPersonReplacementAppearanceAssetLibraryOperation({
    'getProject': () => _0x239c02,
    'setProject': _0x5a31bd,
    'saveAssetPackageItem': saveAssetPackageItem,
    'persistOutputFromUrl': persistOutputFromUrl,
    'showToast': showToast
  });
  const _0x2bdbf2 = () => {
    isPersistable(_0x239c02) && (_0x2186e9(), _0x1149ad["replace"](createInitialProject(), {
      'persist': ![],
      'presentation': 'none',
      'reason': "fresh-import",
      'touchUpdatedAt': ![]
    }));
  };
  const _0x424b5c = _0x5e7209 => {
    const _0x4e9f2c = _0x509713["projects"]["find"](_0x224d16 => _0x224d16['id'] === normalizeText(_0x5e7209));
    if (!_0x4e9f2c) {
      return null;
    }
    const _0x46ce13 = normalizeText(_0x4e9f2c['id']) !== normalizeText(_0x239c02['id']);
    if (_0x4b0493() && _0x46ce13) {
      showToast("素材正在上传，请等待上传完成或取消上传后再打开其他项目。", "info");
      return null;
    }
    if (_0x2318fb() && _0x46ce13) {
      showToast(_0x534757 ? "当前项目正在后台处理，请完成后再打开其他项目。" : "当前项目仍有任务处理中，请完成后再打开其他项目。", 'info');
      return null;
    }
    _0x1149ad["replace"](_0x4e9f2c, {
      'persist': ![],
      'presentation': 'none',
      'reason': "open-project",
      'touchUpdatedAt': ![]
    });
    _0x570baa = 'project';
    _0x5535e1();
    void _0x557120({
      'expectedProjectId': _0x239c02['id']
    });
    void _0x524bb8?.["resumeRecoverable"]?.();
    void _0x38250f?.["resumeRecoverable"]?.();
    if (_0x239c02['workspace']["step"] === 0x3) {
      void _0x174c74();
    }
    return cloneJson(_0x239c02);
  };
  const _0x41aea8 = () => {
    _0x2186e9();
    if (_0x33c589(_0x239c02['id'])) {
      _0x570baa = "home";
      _0x5535e1();
      _0x40d326();
      return _0x12e469();
    }
    _0x21e35d(_0x239c02['id']);
    _0x1149ad["replace"](createInitialProject(), {
      'persist': ![],
      'presentation': 'none',
      'reason': 'show-project-home',
      'touchUpdatedAt': ![]
    });
    _0x570baa = "home";
    _0x5535e1();
    _0x40d326();
    return _0x12e469();
  };
  const _0x21b1b9 = createPersonReplacementProjectLibraryWorkspaceController({
    'getProject': () => _0x239c02,
    'getLibrary': () => _0x509713,
    'setLibrary': _0x5b9fe6 => {
      _0x509713 = _0x5b9fe6;
    },
    'getProjectById': _0x2fd56d,
    'rememberProject': _0x2186e9,
    'hasActiveProjectTask': _0x33c589,
    'isProcessing': () => Boolean(_0x534757),
    'replaceProject': (..._0x49e802) => _0x1149ad["replace"](..._0x49e802),
    'createApplicationProject': createApplicationProject,
    'createInitialProject': createInitialProject,
    'createId': createId,
    'now': nowIso,
    'cloneJson': cloneJson,
    'syncWorkspace': _0x5535e1,
    'schedulePersistence': _0x40d326,
    'snapshot': _0x12e469,
    'releaseAllSourcePreviews': _0x21e35d,
    'openProject': _0x424b5c,
    'projectPackages': projectPackages,
    'showToast': showToast
  });
  const {
    archiveProject: _0x27d7d0,
    collectProject: _0x2e06ef,
    deleteProject: _0x235b3f,
    duplicateProject: _0x21daf4,
    importProjectPackage: _0x2bdb12,
    importProjectPackageResult: _0x444967,
    renameProject: _0x41609c
  } = _0x21b1b9;
  const _0x4173a8 = ({
    sourceId: _0x32f0ac
  } = {}) => {
    const _0x526e78 = normalizeText(_0x32f0ac);
    const _0x5efeb6 = _0x239c02["sources"]["find"](_0x24cdb2 => _0x24cdb2['id'] === _0x526e78);
    if (!_0x5efeb6) {
      return null;
    }
    _0x47e176(_0x526e78);
    const _0x439e2f = _0x239c02["sources"]['filter'](_0x1d09be => _0x1d09be['id'] !== _0x526e78)['map']((_0x4e1f17, _0x53d6ba) => ({
      ..._0x4e1f17,
      'order': _0x53d6ba
    }));
    const _0x4c5b85 = _0x239c02["shots"]["filter"](_0x5c03e3 => _0x5c03e3["sourceId"] !== _0x526e78);
    const _0x1c3876 = new Set(_0x4c5b85["flatMap"](_0x3ef90 => _0x3ef90["people"]["map"](_0x3d8f69 => normalizeText(_0x3d8f69["sourceCharacterId"]))["filter"](Boolean)));
    const _0x258be3 = _0x239c02["audio"]["selectedSourceId"] === _0x526e78;
    const _0x5b1fa2 = Boolean(_0x5efeb6['videoRef']) && _0x239c02["audio"]["originalAudioRef"] === _0x5efeb6["videoRef"];
    const _0x1fdea9 = _0x258be3 ? _0x439e2f[0x0]?.['id'] || '' : _0x239c02['audio']["selectedSourceId"];
    const _0x4ea60e = _0x439e2f["find"](_0x5397e7 => _0x5397e7['id'] === _0x1fdea9) || _0x439e2f[0x0] || null;
    const _0x39c3e1 = Boolean(_0x239c02["output"]['originalMasterRef']) && _0x239c02["audio"]["originalAudioRef"] === _0x239c02["output"]["originalMasterRef"];
    const _0x33736e = _0x5b1fa2 || _0x39c3e1 ? _0x4ea60e?.["videoRef"] || '' : _0x239c02["audio"]['originalAudioRef'];
    const _0x19dfba = {
      ..._0x239c02,
      'title': _0x439e2f["length"] ? _0x239c02['title'] : "未命名人物替换项目",
      'status': _0x439e2f["length"] ? _0x239c02["status"] : "draft",
      'source': _0x439e2f[0x0] || {},
      'sources': _0x439e2f,
      'shots': _0x4c5b85,
      'sourceCharacters': a1190_0x50f84a(_0x4c5b85, _0x239c02['sourceCharacters']),
      'mappings': _0x239c02["mappings"]["filter"](_0x5e326f => _0x1c3876["has"](normalizeText(_0x5e326f["sourceCharacterId"]))),
      'audio': {
        ..._0x239c02["audio"],
        'originalAudioRef': _0x33736e,
        'selectedSourceId': _0x1fdea9
      }
    };
    const _0x1c2c75 = _0x4c5b85["length"] === _0x239c02["shots"]['length'] ? _0x19dfba : transitionPersonReplacementOutput(_0x19dfba, {
      'type': PERSON_REPLACEMENT_OUTPUT_TRANSITIONS["SOURCE_GRAPH_CHANGED"],
      'nextOriginalAudioRef': _0x33736e
    });
    const _0x56e19a = !_0x439e2f["length"] && !_0x4c5b85["length"] && !_0x239c02["characters"]["length"];
    _0x56e19a ? (_0x509713 = removePersonReplacementProject(_0x509713, _0x239c02['id']), _0x1149ad["replace"]({
      ..._0x1c2c75,
      'updatedAt': nowIso()
    }, {
      'persist': ![],
      'presentation': "none",
      'reason': "remove-final-source",
      'touchUpdatedAt': ![]
    }), _0x5535e1(), _0x40d326()) : _0x5a31bd(_0x1c2c75);
    return _0x12e469();
  };
  async function _0x30aa56(_0x1bc255 = []) {
    const _0x40298f = (Array["isArray"](_0x1bc255) ? _0x1bc255 : [_0x1bc255])["filter"](Boolean);
    if (!_0x40298f["length"]) {
      return {
        'ok': ![],
        'reason': "missing-file"
      };
    }
    if (_0x534757) {
      showToast("当前项目正在后台处理，请完成后再新建项目。", "info");
      return {
        'ok': ![],
        'reason': "already-running"
      };
    }
    if (typeof _0x1ada41 !== "function") {
      throw new Error(REPLACEMENT_STUDIO_NAME + '缺少素材上传服务');
    }
    if (_0x570baa !== 'home') {
      _0x570baa = "home";
    }
    _0x2bdbf2();
    const _0x309428 = [..._0x239c02["sources"]];
    const _0x4d0f73 = _0x40298f["map"]((_0x573e3e, _0x57ab49) => ({
      'id': createId("source"),
      'fileName': normalizeText(_0x573e3e['name']) || "视频 " + (_0x309428['length'] + _0x57ab49 + 0x1),
      'videoRef': '',
      'processingStatus': 'uploading',
      'processingProgress': 0x0,
      'order': _0x309428["length"] + _0x57ab49
    }));
    _0x4d0f73["forEach"]((_0x9b8e53, _0x17d3a4) => {
      _0x1e2d3d(_0x40298f[_0x17d3a4], _0x9b8e53['id']);
    });
    _0x5a31bd({
      ..._0x239c02,
      'title': _0x239c02['title'] === '未命名人物替换项目' ? createProjectTitle(_0x40298f[0x0]?.["name"]) : _0x239c02["title"],
      'sources': [..._0x309428, ..._0x4d0f73],
      'source': _0x309428[0x0] || _0x4d0f73[0x0],
      'workspace': {
        ..._0x239c02["workspace"],
        'view': "home",
        'step': 0x1
      }
    });
    const _0x593313 = [];
    for (let _0x2c0bca = 0x0; _0x2c0bca < _0x40298f["length"]; _0x2c0bca += 0x1) {
      const _0x56208c = _0x40298f[_0x2c0bca];
      const _0x4584e9 = _0x4d0f73[_0x2c0bca];
      try {
        const _0x56799b = await _0x1ada41(_0x56208c, _0x239c02['id']);
        const _0x3425e6 = resolveMediaRef(_0x56799b);
        if (!_0x3425e6) {
          throw new Error('源视频保存结果缺少可用地址');
        }
        const _0x327439 = resolveVideoPlaybackRef(_0x56799b);
        const _0x474ceb = resolveDurationSec(_0x56799b);
        const _0x18b8f6 = resolveVideoThumbnailRef(_0x56799b);
        if (!_0x239c02["sources"]['some'](_0x27593b => _0x27593b['id'] === _0x4584e9['id'])) {
          continue;
        }
        _0x593313["push"](_0x56799b);
        const _0x20e906 = _0x18b8f6 ? _0x318c30(_0x4584e9['id']) : '';
        _0x5a31bd({
          ..._0x239c02,
          'sources': _0x239c02["sources"]["map"](_0x2db252 => _0x2db252['id'] === _0x4584e9['id'] ? {
            ..._0x2db252,
            'assetId': normalizeText(_0x56799b?.["assetId"]),
            'videoRef': _0x3425e6,
            'playbackVideoRef': _0x327439,
            'thumbnailRef': _0x18b8f6,
            'durationSec': _0x474ceb || _0x2db252["durationSec"],
            'processingStatus': "ready-to-start",
            'processingProgress': 0x0
          } : _0x2db252),
          'audio': _0x239c02["audio"]["originalAudioRef"] ? _0x239c02["audio"] : {
            ..._0x239c02["audio"],
            'originalAudioRef': _0x3425e6,
            'selectedSourceId': _0x4584e9['id']
          }
        });
        if (_0x20e906) {
          revokeTrackedMediaObjectUrl(_0x20e906);
        }
      } catch (_0x34742f) {
        _0x5a31bd({
          ..._0x239c02,
          'sources': _0x239c02["sources"]["map"](_0xdd407c => _0xdd407c['id'] === _0x4584e9['id'] ? {
            ..._0xdd407c,
            'processingStatus': "failed",
            'error': _0x34742f?.["message"] || "视频上传失败"
          } : _0xdd407c)
        });
        showToast(_0x34742f?.["message"] || '视频上传失败', "error");
      }
    }
    const _0x3e23f2 = _0x239c02["sources"]["filter"](_0x29f397 => _0x29f397["videoRef"])["length"];
    if (_0x3e23f2) {
      showToast('已加入\x20' + _0x3e23f2 + " 个视频。", "success");
    }
    return {
      'ok': _0x3e23f2 > 0x0,
      'project': _0x12e469(),
      'sources': _0x593313
    };
  }
  async function _0x184ba1(_0xe598ef) {
    const {
      personDetection: _0x29e654,
      ..._0x599990
    } = _0xe598ef;
    if (!_0xe598ef["keyframeRef"]) {
      recordPersonReplacementDetectionFailure(_0xe598ef, new Error("人物检测缺少首帧图片"));
      return {
        ..._0x599990,
        'error': "人物检测缺少首帧图片",
        'analysisStatus': 'failed',
        'reviewRequired': !![]
      };
    }
    try {
      const _0x4815e6 = _0x29e654 && typeof _0x29e654 === "object" && Array["isArray"](_0x29e654["people"]) ? _0x29e654 : await detectPeople(_0xe598ef["keyframeRef"], {
        'maxPeople': 0x20
      });
      const _0x5f5180 = [..._0x4815e6['people']]["sort"]((_0x362794, _0x3e0b9d) => {
        const _0x3da8d9 = Number(_0x362794?.['bbox']?.['x']) || 0x0;
        const _0x117369 = Number(_0x3e0b9d?.["bbox"]?.['x']) || 0x0;
        const _0x4aa625 = Number(_0x362794?.['bbox']?.['y']) || 0x0;
        const _0x599fa6 = Number(_0x3e0b9d?.["bbox"]?.['y']) || 0x0;
        return _0x3da8d9 - _0x117369 || _0x4aa625 - _0x599fa6;
      });
      const _0xefe0ba = _0x5f5180['map']((_0xa4a79e, _0x44128d) => ({
        'id': _0xe598ef['id'] + "-person-" + (_0x44128d + 0x1),
        'sourceCharacterId': _0xe598ef["sourceId"] + '-' + _0xe598ef['id'] + "-person-" + (_0x44128d + 0x1),
        'targetCharacterId': '',
        'targetAppearanceId': '',
        'label': formatPersonReplacementPersonLabel(_0x44128d),
        'detectionClass': !normalizeText(_0xa4a79e["className"]) || normalizeText(_0xa4a79e["className"])['toLowerCase']() === 'person' ? "person" : "character",
        'detectionMethod': "automatic",
        'bbox': _0xa4a79e["bbox"],
        'detectionConfidence': _0xa4a79e["confidence"],
        'identityConfidence': 0x0,
        'identityMatchSimilarity': 0x0,
        'identityReviewStatus': "confirmed",
        'identityReviewRequired': ![],
        'identityMethod': "fallback",
        'ambiguousIdentityIds': [],
        'orientationConfidence': Number(_0xa4a79e["orientationConfidence"]) || 0x0,
        'orientation': _0xa4a79e['orientation'] || "unknown",
        'orientationModelId': _0xa4a79e["orientationModelId"] || '',
        'occlusion': "none"
      }));
      return {
        ..._0x599990,
        'frame': _0x4815e6["frame"],
        'people': _0xefe0ba,
        'analysisStatus': "succeeded",
        'reviewRequired': _0xefe0ba["length"] === 0x0
      };
    } catch (_0x3b232f) {
      recordPersonReplacementDetectionFailure(_0xe598ef, _0x3b232f);
      return {
        ..._0x599990,
        'people': [],
        'analysisStatus': "failed",
        'reviewRequired': !![],
        'error': [_0xe598ef["error"], _0x3b232f?.["message"] || "人物检测失败"]["filter"](Boolean)['join']('；')
      };
    }
  }
  async function _0x2b6647(_0x3a9fb5) {
    const _0xaafab4 = (Array["isArray"](_0x3a9fb5) ? _0x3a9fb5 : [])["filter"](_0x413079 => _0x413079["keyframeRef"] && _0x413079["people"]['length']);
    if (!_0xaafab4["length"] || typeof identifyPeople !== 'function') {
      return {
        'shots': _0x3a9fb5,
        'sourceCharacters': a1190_0x50f84a(_0x3a9fb5, _0x239c02["sourceCharacters"]),
        'analysis': {
          'status': _0xaafab4['length'] ? "failed" : "succeeded",
          'modelId': '',
          'stats': {
            'identityCount': 0x0,
            'reviewCount': 0x0
          },
          'error': _0xaafab4["length"] ? '人物身份分析服务尚未初始化' : ''
        }
      };
    }
    try {
      const _0x42ae17 = new Map(_0x239c02["sources"]['map']((_0x2b5d57, _0x3e7aa4) => [_0x2b5d57['id'], _0x2b5d57["order"] ?? _0x3e7aa4]));
      const _0x32d3bd = await identifyPeople(_0xaafab4["map"]((_0x22b718, _0x57dfe8) => ({
        'shotId': _0x22b718['id'],
        'sourceId': _0x22b718["sourceId"],
        'sourceOrder': _0x42ae17["get"](_0x22b718["sourceId"]) ?? 0x0,
        'shotIndex': _0x22b718["index"] ?? _0x57dfe8,
        'shotTimeSec': _0x22b718["keyframeTimeSec"] ?? _0x22b718["startTimeSec"],
        'imageRef': _0x22b718["keyframeRef"],
        'people': _0x22b718["people"]["map"](_0x4e4356 => ({
          'personId': _0x4e4356['id'],
          'bbox': _0x4e4356["locator"]?.["bbox"] || _0x4e4356["bbox"],
          'detectionConfidence': _0x4e4356['detectionConfidence']
        }))
      })), {
        'autoThreshold': _0x239c02['settings']["identityAutoThreshold"],
        'reviewThreshold': _0x239c02["settings"]["identityReviewThreshold"],
        'ambiguityMargin': _0x239c02["settings"]["identityAmbiguityMargin"],
        'maxShotGap': 0x2
      });
      const _0x2de694 = new Map((_0x32d3bd['assignments'] || [])["map"](_0x2bae60 => [_0x2bae60["shotId"] + ':' + _0x2bae60['personId'], _0x2bae60]));
      const _0x23399d = _0x3a9fb5["map"](_0x4a8c7c => ({
        ..._0x4a8c7c,
        'people': _0x4a8c7c['people']['map'](_0x1e3171 => {
          const _0x315ed9 = _0x2de694["get"](_0x4a8c7c['id'] + ':' + _0x1e3171['id']);
          if (!_0x315ed9) {
            return {
              ..._0x1e3171,
              'identityReviewStatus': "confirmed",
              'identityReviewRequired': ![],
              'identityMethod': "fallback"
            };
          }
          return {
            ..._0x1e3171,
            'sourceCharacterId': _0x315ed9['sourceCharacterId'],
            'label': _0x1e3171["label"] || _0x315ed9["label"],
            'identityConfidence': _0x315ed9["identityConfidence"],
            'identityMatchSimilarity': _0x315ed9["matchSimilarity"],
            'identityReviewStatus': 'confirmed',
            'identityReviewRequired': ![],
            'identityMethod': 'osnet',
            'ambiguousIdentityIds': _0x315ed9["ambiguousIdentityIds"] || [],
            'notes': _0x315ed9["notes"] || _0x1e3171["notes"]
          };
        })
      }));
      const _0x19a197 = new Map((_0x32d3bd["identities"] || [])["map"](_0x5bc009 => [_0x5bc009['id'], _0x5bc009]));
      const _0x18c357 = a1190_0x50f84a(_0x23399d, _0x239c02["sourceCharacters"])["map"](_0x177b59 => {
        const _0x54f814 = _0x19a197["get"](_0x177b59['id']);
        return _0x54f814 ? {
          ..._0x177b59,
          'name': _0x54f814["name"] || _0x177b59["name"],
          'confidence': _0x54f814["confidence"],
          'reviewRequired': ![],
          'identityReviewStatus': 'confirmed',
          'memberCount': _0x54f814["memberCount"] || _0x177b59["memberCount"],
          'exemplarShotId': _0x54f814["exemplarShotId"] || _0x177b59["exemplarShotId"],
          'exemplarPersonId': _0x54f814["exemplarPersonId"] || _0x177b59["exemplarPersonId"],
          'ambiguousIdentityIds': _0x54f814["ambiguousIdentityIds"] || [],
          'notes': _0x54f814["notes"] || _0x177b59["notes"]
        } : _0x177b59;
      });
      return {
        'shots': _0x23399d,
        'sourceCharacters': _0x18c357,
        'analysis': {
          'status': "succeeded",
          'modelId': _0x32d3bd["modelId"],
          'stats': {
            ...(_0x32d3bd["stats"] || {}),
            'reviewCount': 0x0
          },
          'error': ''
        }
      };
    } catch (_0x3df6e5) {
      const _0x4910dc = _0x3a9fb5["map"](_0x133233 => ({
        ..._0x133233,
        'people': _0x133233["people"]["map"](_0x179d91 => ({
          ..._0x179d91,
          'identityReviewStatus': "confirmed",
          'identityReviewRequired': ![],
          'identityMethod': 'fallback'
        }))
      }));
      const _0x4e4467 = _0x3df6e5?.['message'] || '跨镜头人物身份分析失败';
      showToast(_0x4e4467 + "；已保留逐镜头人物，可按需拆分纠正。", "warn");
      return {
        'shots': _0x4910dc,
        'sourceCharacters': a1190_0x50f84a(_0x4910dc, _0x239c02["sourceCharacters"]),
        'analysis': {
          'status': "failed",
          'modelId': '',
          'stats': {
            'identityCount': _0x4910dc["reduce"]((_0x59c4ee, _0x447bc2) => _0x59c4ee + _0x447bc2['people']["length"], 0x0),
            'reviewCount': 0x0
          },
          'error': _0x4e4467
        }
      };
    }
  }
  async function _0x2e4fa0(_0x44f310, _0x5576dc, _0x17798c, _0x3ebe75) {
    const _0x2751e8 = await runSmartClip({
      'source': _0x44f310["videoRef"],
      'options': {
        'mode': _0x239c02['settings']['smartClipMode'],
        'fps': _0x239c02["settings"]["smartClipFps"],
        'unlimitedSegments': !![],
        ...(_0x5576dc === 'skip' ? {
          'preserveWholeVideo': !![]
        } : {})
      },
      'signal': _0x17798c,
      'onProgress': _0x50bfbf => {
        const _0x41dc5f = Number(_0x50bfbf?.["progress"]);
        const _0x4e080a = Number(_0x50bfbf?.["pct"]);
        const _0x3e26ab = Number["isFinite"](_0x41dc5f) ? _0x41dc5f : Number["isFinite"](_0x4e080a) ? _0x4e080a / 0x64 : 0x0;
        const _0x4fb756 = _0x50bfbf?.['phase'] === "keyframes" ? 0x2d : 0x5;
        const _0x4b42b7 = Math['min'](0x58, Math['round'](_0x4fb756 + _0x3e26ab * 0x28));
        const _0x1a25aa = Math["round"]((_0x3ebe75 + _0x4b42b7 / 0x64) / _0x239c02['sources']["length"] * 0x5a);
        _0x5a31bd({
          ..._0x239c02,
          'sources': _0x239c02['sources']["map"](_0x5ac871 => _0x5ac871['id'] === _0x44f310['id'] ? {
            ..._0x5ac871,
            'processingStatus': _0x50bfbf?.["phase"] === "keyframes" ? "extracting-keyframes" : "cutting",
            'processingProgress': _0x4b42b7
          } : _0x5ac871),
          'workspace': {
            ..._0x239c02['workspace'],
            'sourceAnalysis': {
              'status': "cutting",
              'progress': _0x1a25aa
            }
          }
        }, {
          'persist': ![],
          'renderWorkspace': ![]
        });
      }
    });
    if (!_0x2751e8?.["shotBundles"]?.["length"]) {
      throw new Error(resolveSmartClipFailureMessage(_0x2751e8));
    }
    return _0x2751e8["shotBundles"]['map']((_0x90dd86, _0x50f1bc) => {
      const _0x286820 = normalizeText(_0x90dd86["clipRef"]);
      return {
        'id': _0x44f310['id'] + '-' + (_0x90dd86['id'] || "shot-" + (_0x50f1bc + 0x1)),
        'sourceId': _0x44f310['id'],
        'index': _0x50f1bc,
        'startTimeSec': _0x90dd86['start'],
        'endTimeSec': _0x90dd86['end'],
        'durationSec': _0x90dd86["duration"],
        'sourceVideoRef': _0x44f310['videoRef'],
        'videoRef': _0x286820,
        'keyframeRef': _0x90dd86["keyframeRef"],
        'keyframeIndex': _0x90dd86["keyframeIndex"],
        'keyframeTimeSec': _0x90dd86['keyframeTimeSec'],
        'personDetection': _0x90dd86['personDetection'],
        'outputFps': _0x90dd86['fps'] || 0x18,
        'materializationStatus': _0x286820 ? "succeeded" : "pending",
        'materializationProgress': _0x286820 ? 0x64 : 0x0,
        'people': [],
        'analysisStatus': _0x90dd86["keyframeRef"] ? "running" : 'failed',
        'reviewRequired': !![],
        'generationStatus': 'pending',
        'error': (_0x90dd86["errors"] || [])["map"](_0x486a1a => _0x486a1a?.["message"])["filter"](Boolean)["join"]('；')
      };
    });
  }
  async function _0xe6ea10({
    mode = "cut"
  } = {}) {
    const _0x39cd98 = _0x239c02["sources"]["filter"](_0x3e2962 => _0x3e2962["videoRef"]);
    if (!_0x39cd98['length']) {
      showToast("请先加入视频。", "warn");
      return {
        'ok': ![],
        'reason': "missing-source"
      };
    }
    if (_0x534757) {
      return {
        'ok': ![],
        'reason': "already-running"
      };
    }
    _0x570baa = "project";
    _0x534757 = new AbortController();
    const _0xaa835f = _0x534757["signal"];
    _0x5a31bd({
      ..._0x239c02,
      'status': "analyzing",
      'settings': {
        ..._0x239c02["settings"],
        'processingMode': mode
      },
      'workspace': {
        ..._0x239c02['workspace'],
        'view': "project",
        'step': 0x1,
        'sourceAnalysis': {
          'status': mode === "skip" ? "extracting-keyframes" : 'cutting',
          'progress': 0x3
        }
      },
      'sources': _0x239c02["sources"]["map"](_0x42c219 => _0x42c219["videoRef"] ? {
        ..._0x42c219,
        'processingStatus': mode === "skip" ? 'extracting-keyframes' : 'cutting',
        'processingProgress': 0x3,
        'error': ''
      } : _0x42c219)
    });
    showToast(mode === 'skip' ? "已进入素材设定，正在后台扫描完整视频并检测人物关键帧。" : "已进入素材设定，正在后台分析镜头并检测人物关键帧。", "info");
    try {
      const _0x1a8e82 = [];
      for (let _0x17642c = 0x0; _0x17642c < _0x39cd98["length"]; _0x17642c += 0x1) {
        if (_0xaa835f["aborted"]) {
          return {
            'ok': ![],
            'reason': "cancelled"
          };
        }
        const _0x34d45b = _0x39cd98[_0x17642c];
        const _0x4b7283 = await _0x2e4fa0(_0x34d45b, mode, _0xaa835f, _0x17642c);
        for (const _0x558513 of _0x4b7283) {
          const _0x5948d3 = await _0x184ba1(_0x558513);
          _0x1a8e82["push"](_0x5948d3);
        }
        _0x5a31bd({
          ..._0x239c02,
          'shots': [..._0x1a8e82],
          'sources': _0x239c02["sources"]['map'](_0x149332 => _0x149332['id'] === _0x34d45b['id'] ? {
            ..._0x149332,
            'processingStatus': "ready",
            'processingProgress': 0x64,
            'error': ''
          } : _0x149332),
          'sourceCharacters': a1190_0x50f84a(_0x1a8e82, _0x239c02["sourceCharacters"]),
          'workspace': {
            ..._0x239c02["workspace"],
            'selectedShotId': _0x1a8e82[0x0]?.['id'] || '',
            'sourceAnalysis': {
              'status': 'detecting',
              'progress': Math['round']((_0x17642c + 0x1) / _0x39cd98["length"] * 0x64)
            }
          }
        }, {
          'renderWorkspace': ![]
        });
      }
      _0x5a31bd({
        ..._0x239c02,
        'shots': _0x1a8e82,
        'workspace': {
          ..._0x239c02['workspace'],
          'sourceAnalysis': {
            'status': "identifying",
            'progress': 0x5e
          },
          'identityAnalysis': {
            'status': "running",
            'modelId': '',
            'stats': {},
            'error': ''
          }
        }
      }, {
        'persist': ![],
        'renderWorkspace': ![]
      });
      const _0x3380f8 = await _0x2b6647(_0x1a8e82);
      const _0x468cd4 = _0x3380f8["shots"];
      _0x5a31bd({
        ..._0x239c02,
        'shots': _0x468cd4,
        'sourceCharacters': _0x3380f8["sourceCharacters"],
        'workspace': {
          ..._0x239c02['workspace'],
          'step': 0x1,
          'selectedShotId': _0x468cd4[0x0]?.['id'] || '',
          'sourceAnalysis': {
            'status': "identifying",
            'progress': 0x60
          },
          'identityAnalysis': _0x3380f8["analysis"]
        }
      }, {
        'persist': ![],
        'renderWorkspace': ![]
      });
      const _0x33f655 = await _0x174c74({
        'notify': ![],
        'renderWorkspace': ![]
      });
      if (!_0x33f655['ok']) {
        throw new Error(_0x33f655['failures']?.['map'](_0x4a8901 => _0x4a8901["message"])["filter"](Boolean)['join']('；') || "镜头固定帧率处理失败");
      }
      await _0x557120({
        'expectedProjectId': _0x239c02['id'],
        'renderWorkspace': ![]
      });
      _0x5a31bd({
        ..._0x239c02,
        'status': "character_mapping",
        'workspace': {
          ..._0x239c02["workspace"],
          'sourceAnalysis': {
            'status': "ready",
            'progress': 0x64
          },
          'identityAnalysis': _0x3380f8["analysis"]
        }
      }, {
        'renderWorkspace': ![]
      });
      const _0x461bd3 = Number(_0x3380f8["analysis"]?.['stats']?.["identityCount"]) || 0x0;
      const _0x2e1d9e = getPersonReplacementDetectionFeedback(_0x468cd4, _0x461bd3);
      showToast(_0x2e1d9e["message"], _0x2e1d9e["level"]);
      return {
        'ok': !![],
        'project': _0x12e469()
      };
    } catch (_0xf95322) {
      if (_0xaa835f["aborted"]) {
        return {
          'ok': ![],
          'reason': "cancelled"
        };
      }
      const _0x39ce6b = normalizeText(_0xf95322?.["message"]) || "视频处理失败";
      _0x5a31bd({
        ..._0x239c02,
        'workspace': {
          ..._0x239c02["workspace"],
          'sourceAnalysis': {
            'status': "failed",
            'progress': 0x64
          }
        },
        'sources': _0x239c02['sources']["map"](_0x22201b => _0x22201b["videoRef"] && _0x22201b["processingStatus"] !== "ready" ? {
          ..._0x22201b,
          'processingStatus': "failed",
          'processingProgress': 0x64,
          'error': _0x39ce6b
        } : _0x22201b)
      }, {
        'renderWorkspace': ![]
      });
      showToast(_0x39ce6b, "error");
      throw _0xf95322;
    } finally {
      if (_0x534757?.["signal"] === _0xaa835f) {
        _0x534757 = null;
      }
    }
  }
  async function _0x3b4768({
    mode = _0x239c02["settings"]["smartClipMode"],
    fps = _0x239c02["settings"]["smartClipFps"]
  } = {}) {
    const _0x12f313 = 'shot-cut-detection';
    if (_0x35b7ea['has'](_0x12f313)) {
      throw new Error("智能检测正在运行，请稍候");
    }
    const _0x1fa108 = _0x239c02["sources"]["filter"](_0x51725a => normalizeText(_0x51725a?.["videoRef"]) && _0x239c02["shots"]["some"](_0x3a1bd7 => normalizeText(_0x3a1bd7?.['sourceId']) === normalizeText(_0x51725a?.['id'])));
    if (!_0x1fa108["length"]) {
      throw new Error('当前时间轴缺少可重新检测的原视频');
    }
    const _0x3d0575 = cloneJson(_0x239c02["shots"]);
    _0x35b7ea["add"](_0x12f313);
    try {
      const _0x1b31f3 = [];
      for (const _0x160ed6 of _0x1fa108) {
        const _0x1af12d = await runSmartClip({
          'source': _0x160ed6["videoRef"],
          'options': {
            'mode': mode,
            'fps': fps,
            'unlimitedSegments': !![]
          }
        });
        if (!_0x1af12d?.["shotBundles"]?.["length"]) {
          throw new Error("视频「" + (_0x160ed6["fileName"] || _0x160ed6['id']) + "」未检测到可用片段");
        }
        _0x1b31f3["push"](...buildPersonReplacementDetectedShotCutRanges({
          'source': _0x160ed6,
          'shots': _0x3d0575,
          'shotBundles': _0x1af12d['shotBundles'],
          'fps': fps
        }));
      }
      return {
        'ranges': _0x1b31f3
      };
    } finally {
      _0x35b7ea['delete'](_0x12f313);
    }
  }
  function _0x8ee242({
    shotId: _0x461b75,
    bbox: _0x19f64d
  } = {}, {
    renderWorkspace = !![]
  } = {}) {
    const _0x2c7c06 = normalizeText(_0x461b75);
    const _0x1f2294 = _0x239c02["shots"]["find"](_0x42b0b9 => _0x42b0b9['id'] === _0x2c7c06);
    const {
      x: _0x411c75,
      y: _0x280a37,
      width: _0x4aa168,
      height: _0x2e7c05
    } = normalizePersonReplacementBoundingBox(_0x19f64d && typeof _0x19f64d === 'object' ? _0x19f64d : {});
    if (!_0x1f2294 || _0x4aa168 <= 0x0 || _0x2e7c05 <= 0x0) {
      return null;
    }
    const _0x18cfa8 = createId(_0x2c7c06 + '-manual-person');
    const _0xd310ac = createId("source-character-manual");
    const _0x41911d = Math["max"](-0x1, ..._0x1f2294['people']["map"](_0x570a35 => _0x570a35['promptMarkerIndex'])) + 0x1;
    const _0x54b3c4 = {
      'id': _0x18cfa8,
      'sourceCharacterId': _0xd310ac,
      'targetCharacterId': '',
      'targetAppearanceId': '',
      'promptMarkerIndex': _0x41911d,
      'label': formatPersonReplacementPersonLabel(_0x41911d),
      'detectionClass': 'character',
      'detectionMethod': "manual",
      'bbox': {
        'x': _0x411c75,
        'y': _0x280a37,
        'width': _0x4aa168,
        'height': _0x2e7c05
      },
      'detectionConfidence': 0x0,
      'identityConfidence': 0x1,
      'identityMatchSimilarity': 0x1,
      'identityReviewStatus': 'confirmed',
      'identityReviewRequired': ![],
      'identityMethod': "manual",
      'ambiguousIdentityIds': [],
      'orientation': "front",
      'orientationConfidence': 0x1,
      'orientationModelId': '',
      'occlusion': "none",
      'notes': "用户手动画框的可替换主体"
    };
    const _0x423b68 = _0x239c02["shots"]['map'](_0x1ea149 => _0x1ea149['id'] === _0x2c7c06 ? {
      ..._0x1ea149,
      'people': orderAndRelabelPersonReplacementPeople([..._0x1ea149["people"], _0x54b3c4]),
      'reviewRequired': !![]
    } : _0x1ea149);
    const _0x4484d0 = _0x5a31bd({
      ..._0x239c02,
      'shots': _0x423b68,
      'sourceCharacters': a1190_0x50f84a(_0x423b68, _0x239c02["sourceCharacters"])
    }, {
      'renderWorkspace': renderWorkspace
    });
    showToast("已添加可替换主体，请将目标形象拖入框内。", 'success');
    return {
      'project': _0x4484d0
    };
  }
  function _0x5b9404({
    shotId: _0x24c88d,
    updates = []
  } = {}, {
    renderWorkspace = !![]
  } = {}) {
    const _0x501545 = normalizeText(_0x24c88d);
    const _0x2dd1dc = _0x239c02['shots']["find"](_0xdd9628 => _0xdd9628['id'] === _0x501545);
    if (!_0x2dd1dc) {
      return null;
    }
    const _0x3c58c9 = new Map(_0x2dd1dc["people"]["map"](_0x1e4ac5 => [_0x1e4ac5['id'], _0x1e4ac5]));
    const _0x143715 = new Map();
    (Array["isArray"](updates) ? updates : [])['forEach'](_0x23a9a4 => {
      const _0x5b1a32 = normalizeText(_0x23a9a4?.["personId"]);
      if (!_0x3c58c9["has"](_0x5b1a32)) {
        return;
      }
      const _0x46c279 = {};
      const _0x4caf8c = normalizePersonReplacementBoundingBox(_0x23a9a4?.["bbox"] && typeof _0x23a9a4["bbox"] === 'object' ? _0x23a9a4['bbox'] : {});
      _0x4caf8c['width'] > 0x0 && _0x4caf8c["height"] > 0x0 && (_0x46c279["bbox"] = _0x4caf8c);
      Object["hasOwn"](_0x23a9a4 || {}, "replacementScope") && (_0x46c279["replacementScope"] = normalizePersonReplacementScope(_0x23a9a4['replacementScope']));
      Object["keys"](_0x46c279)["length"] && _0x143715['set'](_0x5b1a32, _0x46c279);
    });
    if (!_0x143715["size"]) {
      return null;
    }
    const _0xb79180 = _0x239c02["shots"]['map'](_0x382845 => _0x382845['id'] === _0x501545 ? {
      ..._0x382845,
      'people': orderAndRelabelPersonReplacementPeople(_0x382845["people"]['map'](_0x39b46f => {
        const _0x10e81b = _0x143715["get"](_0x39b46f['id']);
        if (!_0x10e81b) {
          return _0x39b46f;
        }
        return {
          ..._0x39b46f,
          ...(_0x10e81b['replacementScope'] ? {
            'replacementScope': _0x10e81b["replacementScope"]
          } : {}),
          ...(_0x10e81b["bbox"] ? {
            'bbox': _0x10e81b['bbox'],
            'locator': {
              ..._0x39b46f["locator"],
              'bbox': _0x10e81b["bbox"]
            }
          } : {})
        };
      }))
    } : _0x382845);
    const _0x1f13e8 = _0x5a31bd({
      ..._0x239c02,
      'shots': _0xb79180,
      'sourceCharacters': a1190_0x50f84a(_0xb79180, _0x239c02["sourceCharacters"])
    }, {
      'renderWorkspace': renderWorkspace
    });
    return {
      'project': _0x1f13e8
    };
  }
  function _0x4c59b5({
    shotId: _0x2c6ac5,
    personIds = []
  } = {}, {
    renderWorkspace = !![]
  } = {}) {
    const _0x4d560d = normalizeText(_0x2c6ac5);
    const _0x8771 = _0x239c02["shots"]["find"](_0x1eb9a5 => _0x1eb9a5['id'] === _0x4d560d);
    const _0x545f28 = new Set((Array["isArray"](personIds) ? personIds : [])["map"](normalizeText)['filter'](Boolean));
    const _0x264d2f = _0x8771?.["people"]["filter"](_0xc2306a => _0x545f28['has'](_0xc2306a['id'])) || [];
    if (!_0x264d2f["length"]) {
      return null;
    }
    const _0x250679 = new Set(_0x264d2f['map'](_0x5fee68 => _0x5fee68['id']));
    const _0x1c8a98 = new Set(_0x264d2f['map'](_0x35b71e => normalizeText(_0x35b71e['sourceCharacterId']))['filter'](Boolean));
    const _0x3a854d = _0x239c02["shots"]["map"](_0x368b3e => _0x368b3e['id'] === _0x4d560d ? {
      ..._0x368b3e,
      'people': orderAndRelabelPersonReplacementPeople(_0x368b3e['people']['filter'](_0x104d11 => !_0x250679['has'](_0x104d11['id'])))
    } : _0x368b3e);
    const _0x1a5acc = new Set();
    _0x3a854d["forEach"](_0x17da53 => _0x17da53["people"]["forEach"](_0x2d8201 => {
      const _0x46baa8 = normalizeText(_0x2d8201["sourceCharacterId"]);
      if (_0x46baa8) {
        _0x1a5acc["add"](_0x46baa8);
      }
    }));
    const _0x13b309 = _0x239c02["sourceCharacters"]["map"](_0x3e2dbe => _0x250679["has"](normalizeText(_0x3e2dbe['exemplarPersonId'])) ? {
      ..._0x3e2dbe,
      'exemplarShotId': '',
      'exemplarPersonId': ''
    } : _0x3e2dbe);
    const _0x36e732 = _0x5a31bd({
      ..._0x239c02,
      'shots': _0x3a854d,
      'mappings': _0x239c02["mappings"]["filter"](_0x1ddca8 => {
        const _0x139d37 = normalizeText(_0x1ddca8['sourceCharacterId']);
        return !_0x1c8a98["has"](_0x139d37) || _0x1a5acc["has"](_0x139d37);
      }),
      'sourceCharacters': a1190_0x50f84a(_0x3a854d, _0x13b309)
    }, {
      'renderWorkspace': renderWorkspace
    });
    showToast(_0x264d2f['length'] > 0x1 ? "已删除 " + _0x264d2f["length"] + " 个人物框。" : "已删除该人物框。", "success");
    return {
      'project': _0x36e732
    };
  }
  async function _0x315a8a({
    ranges = [],
    replaceTimeline = ![],
    selectedShotId: _0xc6af32 = '',
    renderWorkspace = !![],
    notify = !![],
    revision: _0x9bb03f = 0x0
  } = {}) {
    const _0x3ad5f7 = _0x2cb1d4["acceptRevision"](_0x9bb03f);
    const _0x1cbf6a = 'shot-cut-timeline:' + _0x3ad5f7;
    const _0x1d5c84 = normalizeText(_0x239c02['id']);
    const _0x50984a = normalizePersonReplacementShotCutRanges(_0x239c02["shots"], ranges, {
      'allowTimelineReplacement': replaceTimeline === !![]
    });
    const _0x4409e5 = new Map(_0x239c02["shots"]["map"](_0x1b61ca => [normalizeText(_0x1b61ca['id']), _0x1b61ca]));
    const _0x48fa87 = new Set(_0x50984a["filter"](_0x1683ee => normalizeText(_0x1683ee["originShotId"]) && !_0x4409e5["has"](normalizeText(_0x1683ee["shotId"])))["map"](_0x4e7341 => normalizeText(_0x4e7341['originShotId'])));
    const _0xf06baa = _0x50984a['length'] !== _0x239c02["shots"]['length'] || _0x50984a["some"](_0x4c3a82 => !_0x4409e5['has'](normalizeText(_0x4c3a82["shotId"])));
    const _0x5c632f = _0x50984a["filter"](_0x19d555 => {
      const _0x4aad84 = _0x4409e5["get"](_0x19d555["shotId"]) || _0x4409e5["get"](_0x19d555["originShotId"]);
      const _0x3cf2f9 = normalizeText(_0x19d555["keyframeRef"]);
      const _0x129f32 = Boolean(_0x3cf2f9 && (_0x3cf2f9 !== normalizeText(_0x4aad84?.["keyframeRef"]) || Math['abs'](Number(_0x19d555["keyframeTimeSec"]) - Number(_0x4aad84?.['keyframeTimeSec'])) > a1190_0x360da3));
      const _0x12b97c = Boolean(_0x3cf2f9 && Boolean(_0x19d555["keyframeManuallySelected"]) !== Boolean(_0x4aad84?.["keyframeManuallySelected"]));
      return !_0x4aad84 || !_0x4409e5["has"](_0x19d555["shotId"]) || Math["abs"](_0x19d555["startSec"] - Number(_0x4aad84["startTimeSec"])) > a1190_0x360da3 || Math["abs"](_0x19d555["endSec"] - Number(_0x4aad84['endTimeSec'])) > a1190_0x360da3 || Boolean(_0x19d555["isReversed"]) !== Boolean(_0x4aad84["isReversed"]) || Boolean(_0x19d555["isReversed"]) !== Boolean(_0x4aad84["materializedIsReversed"]) || _0x129f32 || _0x12b97c;
    });
    const _0xb41a6c = new Set(_0x5c632f['map'](_0x491df5 => _0x491df5['shotId']));
    if (!_0x5c632f["length"]) {
      showToast('镜头切口没有变化。', "info");
      return {
        'project': _0x12e469(),
        'changedShotCount': 0x0
      };
    }
    const _0x2a04d8 = new Map();
    _0x239c02["shots"]["forEach"](_0x153aa7 => _0x153aa7['people']["forEach"](_0x45283e => {
      const _0x547420 = normalizeText(_0x45283e["sourceCharacterId"]);
      if (!_0x547420) {
        return;
      }
      const _0x187e1b = normalizeText(_0x45283e["targetCharacterId"]);
      const _0x25e37a = normalizeText(_0x45283e["targetAppearanceId"]);
      (_0x187e1b || _0x25e37a) && _0x2a04d8["set"](_0x547420, {
        'targetCharacterId': _0x187e1b,
        'targetAppearanceId': _0x25e37a
      });
    }));
    _0x35b7ea["add"](_0x1cbf6a);
    notify && showToast("正在更新 " + _0xb41a6c["size"] + " 个相邻片段。", "info");
    try {
      const _0xf8f0b5 = [];
      let _0x4e60b4 = ![];
      for (let _0x4db68c = 0x0; _0x4db68c < _0x50984a["length"]; _0x4db68c += 0x1) {
        const _0x2da081 = _0x50984a[_0x4db68c];
        const _0x4a60a8 = _0x4409e5["get"](_0x2da081["shotId"]) || _0x4409e5["get"](_0x2da081["originShotId"]);
        const _0x5f04e1 = !_0x4409e5['has'](_0x2da081["shotId"]);
        const _0x476526 = _0x48fa87["has"](normalizeText(_0x2da081["originShotId"] || _0x2da081["shotId"]));
        if (!_0x4a60a8) {
          throw new Error("片段 " + (_0x2da081['shotId'] || _0x4db68c + 0x1) + " 缺少原始片段");
        }
        if (!_0xb41a6c["has"](_0x2da081["shotId"])) {
          _0xf8f0b5["push"]({
            ..._0x4a60a8,
            'index': _0x4db68c
          });
          continue;
        }
        const _0x2a2f2e = _0x239c02["sources"]["find"](_0xa854ed => _0xa854ed['id'] === _0x4a60a8['sourceId']);
        const _0x33ffe9 = normalizeText(_0x4a60a8["sourceVideoRef"] || _0x2a2f2e?.["videoRef"]);
        if (!_0x33ffe9) {
          throw new Error('片段\x20' + (_0x4a60a8["title"] || _0x4db68c + 0x1) + " 缺少原始视频");
        }
        const _0x1f0ff3 = [0x10, 0x18, 0x1e]['includes'](Math['round'](Number(_0x4a60a8["outputFps"]))) ? Math["round"](Number(_0x4a60a8["outputFps"])) : 0x18;
        const {
          videoRef: _0x29d9d7,
          reverseChanged: _0x4ad83d,
          videoRefIsCropped: _0x3e3326
        } = await materializePersonReplacementShotPlayback({
          'currentShot': _0x4a60a8,
          'range': _0x2da081,
          'isNewShot': _0x5f04e1,
          'sourceVideoRef': _0x33ffe9,
          'outputFps': _0x1f0ff3,
          'epsilonSec': a1190_0x360da3,
          'enqueueMediaTask': enqueueMediaTask,
          'resolveMediaRef': resolveMediaRef
        });
        const _0xff3ba7 = normalizeText(_0x2da081['keyframeRef']);
        const _0x4a625f = Boolean(_0xff3ba7);
        const _0x268c36 = Number(_0x4a60a8["keyframeTimeSec"]);
        const _0x285f3b = Boolean(!_0x4ad83d && normalizeText(_0x4a60a8['keyframeRef']) && (!Number["isFinite"](_0x268c36) || _0x268c36 >= _0x2da081['startSec'] - a1190_0x360da3 && _0x268c36 < _0x2da081["endSec"] + a1190_0x360da3));
        let _0x5783df = _0x4a625f ? _0xff3ba7 : _0x285f3b ? normalizeText(_0x4a60a8["keyframeRef"]) : '';
        if (!_0x5783df) {
          const _0x4a221f = await fetchFirstFrame(_0x29d9d7, {
            'assetId': _0x239c02['id'],
            'nodeId': _0x2da081["shotId"] || _0x4a60a8['id']
          });
          _0x5783df = resolveMediaRef(_0x4a221f);
        }
        if (!_0x5783df) {
          throw new Error("镜头切口更新后首帧提取失败");
        }
        const _0x37e68b = _0x4a625f && (_0xff3ba7 !== normalizeText(_0x4a60a8["keyframeRef"]) || Math["abs"](Number(_0x2da081["keyframeTimeSec"]) - Number(_0x4a60a8["keyframeTimeSec"])) > a1190_0x360da3);
        const _0x29a9c0 = {
          ..._0x4a60a8,
          'id': _0x2da081["shotId"],
          'title': _0x5f04e1 && _0x4a60a8['title'] ? _0x4a60a8["title"] + " · " + (_0x4db68c + 0x1) : _0x4a60a8["title"],
          'index': _0x4db68c,
          'startTimeSec': _0x2da081["startSec"],
          'endTimeSec': _0x2da081["endSec"],
          'durationSec': _0x2da081["endSec"] - _0x2da081['startSec'],
          'sourceVideoRef': _0x33ffe9,
          'videoRef': _0x29d9d7,
          'videoRefIsCropped': _0x3e3326,
          'isReversed': _0x2da081["isReversed"] === !![],
          'materializedIsReversed': _0x2da081["isReversed"] === !![],
          'keyframeRef': _0x5783df,
          'keyframeIndex': !_0x37e68b && _0x285f3b ? _0x4a60a8['keyframeIndex'] : 0x0,
          'keyframeTimeSec': _0x4a625f ? _0x2da081['keyframeTimeSec'] : _0x285f3b ? _0x4a60a8["keyframeTimeSec"] : _0x2da081["isReversed"] === !![] ? _0x2da081['endSec'] : _0x2da081["startSec"],
          'keyframeManuallySelected': _0x4a625f ? _0x2da081["keyframeManuallySelected"] === !![] : _0x285f3b ? _0x4a60a8["keyframeManuallySelected"] === !![] : ![],
          'frame': _0x4a625f && _0x2da081["frame"] ? {
            ..._0x2da081["frame"]
          } : _0x4a60a8["frame"],
          'outputFps': _0x1f0ff3,
          'materializationStatus': 'succeeded',
          'materializationProgress': 0x64,
          'replacementImage': {
            'results': [],
            'activeIndex': 0x0
          },
          'replacementImageRef': '',
          ...(_0x476526 ? {
            'replacementVideo': {
              'results': [],
              'activeIndex': 0x0
            },
            'resultVideoRef': '',
            'generationStatus': "pending"
          } : {}),
          'error': ''
        };
        !_0x37e68b && _0x285f3b ? _0xf8f0b5["push"]({
          ..._0x29a9c0,
          'people': _0x4a60a8["people"]["map"](_0x3a8553 => ({
            ..._0x3a8553
          })),
          'analysisStatus': _0x4a60a8["analysisStatus"],
          'reviewRequired': _0x4a60a8['reviewRequired']
        }) : (_0x4e60b4 = !![], _0xf8f0b5['push'](await _0x184ba1({
          ..._0x29a9c0,
          'people': [],
          'analysisStatus': 'running',
          'reviewRequired': !![]
        })));
      }
      const _0x86d17f = _0x4e60b4 ? await _0x2b6647(_0xf8f0b5) : {
        'shots': _0xf8f0b5,
        'sourceCharacters': _0x239c02["sourceCharacters"],
        'analysis': _0x239c02["workspace"]["identityAnalysis"]
      };
      const _0x56b384 = _0x86d17f["shots"]["map"](_0x5871e6 => ({
        ..._0x5871e6,
        'people': _0x5871e6["people"]["map"](_0x4a931f => {
          const _0x2a8117 = _0x2a04d8['get'](normalizeText(_0x4a931f["sourceCharacterId"]));
          return _0x2a8117 ? {
            ..._0x4a931f,
            'targetCharacterId': _0x2a8117["targetCharacterId"],
            'targetAppearanceId': _0x2a8117["targetAppearanceId"]
          } : _0x4a931f;
        })
      }));
      const _0x47a668 = normalizeText(_0xc6af32);
      const _0x115b37 = _0x56b384["some"](_0x375d8f => normalizeText(_0x375d8f['id']) === _0x47a668) ? _0x47a668 : _0x56b384["some"](_0x11d301 => normalizeText(_0x11d301['id']) === normalizeText(_0x239c02["workspace"]["selectedShotId"])) ? _0x239c02['workspace']["selectedShotId"] : _0x56b384[0x0]?.['id'] || '';
      if (_0x1c7532 || !_0x2cb1d4["isCurrent"](_0x3ad5f7) || normalizeText(_0x239c02['id']) !== _0x1d5c84) {
        return {
          'project': _0x12e469(),
          'changedShotCount': 0x0,
          'stale': !![]
        };
      }
      const _0x192b2a = {
        ..._0x239c02,
        'shots': _0x56b384,
        'sourceCharacters': a1190_0x50f84a(_0x56b384, _0x86d17f['sourceCharacters']),
        'workspace': {
          ..._0x239c02['workspace'],
          'selectedShotId': _0x115b37,
          'identityAnalysis': _0x86d17f["analysis"],
          'imageGeneration': {
            'status': "idle",
            'shotId': '',
            'error': ''
          },
          'imageGenerationsByShotId': {},
          'videoGeneration': {
            'status': "idle",
            'shotId': '',
            'error': ''
          },
          'videoGenerationsByShotId': {},
          'videoPreparation': {
            'status': 'idle',
            'progress': 0x0,
            'error': ''
          }
        }
      };
      const _0x58841a = _0x5a31bd(_0xf06baa ? transitionPersonReplacementOutput(_0x192b2a, {
        'type': PERSON_REPLACEMENT_OUTPUT_TRANSITIONS['INVALIDATE']
      }) : _0x192b2a, {
        'renderWorkspace': renderWorkspace
      });
      notify && showToast("已更新 " + _0xb41a6c["size"] + " 个片段的切口。", "success");
      return {
        'project': _0x58841a,
        'changedShotCount': _0xb41a6c['size']
      };
    } finally {
      _0x35b7ea["delete"](_0x1cbf6a);
    }
  }
  const _0xfc46af = createPersonReplacementShotReverseOperation({
    'coordinator': _0x2cb1d4,
    'getProject': () => _0x239c02,
    'setProject': _0x5a31bd,
    'snapshot': _0x12e469,
    'showToast': showToast,
    'updateShotCutRanges': _0x315a8a,
    'enqueueMediaTask': enqueueMediaTask,
    'resolveMediaRef': resolveMediaRef,
    'isDestroyed': () => _0x1c7532
  });
  function _0x4b7a9d({
    sourceCharacterIds = []
  } = {}) {
    try {
      const _0x19193e = mergePersonReplacementSourceCharacters(_0x239c02, {
        'sourceCharacterIds': sourceCharacterIds
      });
      const _0x4fa75e = _0x5a31bd({
        ..._0x19193e,
        'sourceCharacters': a1190_0x50f84a(_0x19193e["shots"], _0x19193e['sourceCharacters']),
        'workspace': {
          ..._0x19193e["workspace"],
          'selectedIdentityIds': []
        }
      });
      showToast("所选人物身份已合并。", "success");
      return {
        'project': _0x4fa75e
      };
    } catch (_0x2a27b9) {
      showToast(_0x2a27b9?.['message'] || '人物身份合并失败', "warn");
      return null;
    }
  }
  function _0x473d8e({
    sourceCharacterId: _0x44ea85,
    shotId: _0x55ea06,
    personId: _0xf382f7
  } = {}) {
    try {
      const _0x1e98f7 = splitPersonReplacementSourceCharacter(_0x239c02, {
        'sourceCharacterId': _0x44ea85,
        'occurrences': [{
          'shotId': _0x55ea06,
          'personId': _0xf382f7
        }],
        'newSourceCharacterId': createId("source-character-manual")
      });
      const _0x2c7ba3 = _0x5a31bd({
        ..._0x1e98f7,
        'sourceCharacters': a1190_0x50f84a(_0x1e98f7["shots"], _0x1e98f7["sourceCharacters"]),
        'workspace': {
          ..._0x1e98f7["workspace"],
          'selectedIdentityIds': []
        }
      });
      showToast('当前人物框已拆分为独立人物。', "success");
      return {
        'project': _0x2c7ba3
      };
    } catch (_0x5be81d) {
      showToast(_0x5be81d?.['message'] || "人物身份拆分失败", "warn");
      return null;
    }
  }
  function _0x2c8e63({
    sourceCharacterId: _0x2ec795,
    targetSourceCharacterId: _0x331e39,
    shotId: _0x5f4c8d,
    personId: _0x714b31,
    label: _0x3bb180,
    orientation: _0x134550,
    silent = ![]
  } = {}) {
    try {
      const _0x5618b2 = normalizeText(_0x3bb180);
      const _0x409b8a = normalizePersonReplacementOrientation(_0x134550);
      if (!_0x5618b2) {
        throw new Error('请输入人物名称');
      }
      const _0x49c043 = confirmPersonReplacementSourceCharacter(_0x239c02, {
        'sourceCharacterId': _0x2ec795,
        'targetSourceCharacterId': _0x331e39,
        'shotId': _0x5f4c8d,
        'personId': _0x714b31,
        'label': _0x5618b2,
        'orientation': _0x409b8a === "unknown" ? '' : _0x409b8a
      });
      const _0x4c717a = _0x5a31bd({
        ..._0x49c043,
        'sourceCharacters': a1190_0x50f84a(_0x49c043["shots"], _0x49c043["sourceCharacters"])
      }, {
        'sync': ![]
      });
      if (!silent) {
        showToast("人物身份已确认。", "success");
      }
      return {
        'project': _0x4c717a
      };
    } catch (_0x5ee68c) {
      showToast(_0x5ee68c?.['message'] || "人物身份确认失败", "warn");
      return null;
    }
  }
  function _0x436d41({
    characterId: _0x125df3
  } = {}) {
    const _0x33d913 = normalizeText(_0x125df3);
    if (!_0x33d913 || !_0x239c02["characters"]['some'](_0xce31fd => _0xce31fd['id'] === _0x33d913)) {
      return null;
    }
    const _0x1bfda7 = _0x239c02["characters"]["filter"](_0x3a549e => _0x3a549e['id'] !== _0x33d913);
    const _0x36e2ff = Object["fromEntries"](Object['entries'](_0x239c02["workspace"]['assetAppearanceIndexes'] || {})["filter"](([_0x2b5feb]) => _0x2b5feb !== _0x33d913));
    const _0x57c295 = _0x5a31bd({
      ..._0x239c02,
      'characters': _0x1bfda7,
      'mappings': _0x239c02["mappings"]["filter"](_0x2287cf => _0x2287cf["targetCharacterId"] !== _0x33d913),
      'shots': _0x239c02['shots']["map"](_0x53b752 => ({
        ..._0x53b752,
        'people': _0x53b752["people"]["map"](_0x56572c => _0x56572c["targetCharacterId"] === _0x33d913 ? {
          ..._0x56572c,
          'targetCharacterId': '',
          'targetAppearanceId': ''
        } : _0x56572c)
      })),
      'workspace': {
        ..._0x239c02["workspace"],
        'selectedCharacterId': _0x239c02["workspace"]["selectedCharacterId"] === _0x33d913 ? _0x1bfda7[0x0]?.['id'] || '' : _0x239c02["workspace"]['selectedCharacterId'],
        'selectedAssetIds': _0x239c02['workspace']['selectedAssetIds']["filter"](_0x5aa52f => _0x5aa52f !== _0x33d913),
        'assetAppearanceIndexes': _0x36e2ff
      }
    });
    showToast('人物卡片已删除。', 'success');
    return {
      'project': _0x57c295
    };
  }
  function _0x29c970({
    sceneId: _0x5e8399
  } = {}) {
    const _0x34fe31 = normalizeText(_0x5e8399);
    if (!_0x34fe31 || !_0x239c02["scenes"]["some"](_0x259fc5 => _0x259fc5['id'] === _0x34fe31)) {
      return null;
    }
    const _0x237cf4 = _0x239c02['scenes']['filter'](_0x5b4a0a => _0x5b4a0a['id'] !== _0x34fe31);
    const _0x57d7b4 = Object['fromEntries'](Object["entries"](_0x239c02["workspace"]["assetAppearanceIndexes"] || {})["filter"](([_0x19e7b9]) => _0x19e7b9 !== _0x34fe31));
    const _0x71039b = _0x5a31bd({
      ..._0x239c02,
      'scenes': _0x237cf4,
      'shots': _0x239c02["shots"]['map'](_0x53d408 => normalizeText(_0x53d408["sceneReference"]?.["sceneId"]) === _0x34fe31 ? {
        ..._0x53d408,
        'sceneReference': {
          'sceneId': '',
          'appearanceId': ''
        }
      } : _0x53d408),
      'workspace': {
        ..._0x239c02["workspace"],
        'selectedSceneId': _0x239c02["workspace"]["selectedSceneId"] === _0x34fe31 ? _0x237cf4[0x0]?.['id'] || '' : _0x239c02["workspace"]["selectedSceneId"],
        'selectedAssetIds': _0x239c02["workspace"]["selectedAssetIds"]['filter'](_0x4be119 => _0x4be119 !== _0x34fe31),
        'assetAppearanceIndexes': _0x57d7b4
      }
    });
    showToast('场景卡片已删除。', "success");
    return {
      'project': _0x71039b
    };
  }
  function _0x4b6020({
    audioAssetId: _0x2d9dc0
  } = {}) {
    const _0x212a4b = normalizeText(_0x2d9dc0);
    const _0x351968 = _0x239c02["audioAssets"]["find"](_0x1f1ece => _0x1f1ece['id'] === _0x212a4b);
    if (!_0x351968) {
      return null;
    }
    const _0x190c13 = normalizeText(_0x351968["sourceAssetId"]);
    const _0x5a7daa = Math["max"](0x0, Math["trunc"](Number(_0x351968['sourceItemIndex']) || 0x0));
    const _0x16e144 = _0x239c02["audioAssets"]["filter"](_0x7e7799 => _0x7e7799['id'] !== _0x212a4b);
    const _0x5909fb = _0x239c02['characters']["map"](_0x865418 => {
      const _0x5ee4e5 = _0x865418["voiceReference"];
      const _0xedfd02 = Boolean(_0x5ee4e5 && (normalizeText(_0x5ee4e5["libraryAssetId"]) === _0x212a4b || _0x190c13 && normalizeText(_0x5ee4e5["sourceAssetId"]) === _0x190c13 && Math["max"](0x0, Math["trunc"](Number(_0x5ee4e5["sourceItemIndex"]) || 0x0)) === _0x5a7daa));
      return _0xedfd02 ? {
        ..._0x865418,
        'voiceReference': null,
        'voiceRef': ''
      } : _0x865418;
    });
    const _0xcf04ac = _0x5a31bd({
      ..._0x239c02,
      'audioAssets': _0x16e144,
      'characters': _0x5909fb,
      'workspace': {
        ..._0x239c02["workspace"],
        'selectedAudioAssetId': _0x239c02['workspace']['selectedAudioAssetId'] === _0x212a4b ? _0x16e144[0x0]?.['id'] || '' : _0x239c02["workspace"]["selectedAudioAssetId"]
      }
    });
    showToast("项目音频已移除。", "success");
    return {
      'project': _0xcf04ac
    };
  }
  async function _0x4bb6a4(_0x46c982 = [], _0x2cbdf2 = 'character') {
    const _0x1b9579 = (Array['isArray'](_0x46c982) ? _0x46c982 : [_0x46c982])['filter'](Boolean);
    if (!_0x1b9579["length"] || typeof _0x1ada41 !== "function") {
      return null;
    }
    const _0x16f9a3 = normalizeText(_0x239c02['id']);
    const _0x4b13ea = [];
    for (const _0x2ae75c of _0x1b9579) {
      const _0x2229e1 = await _0x1ada41(_0x2ae75c, _0x239c02['id']);
      const _0x32e4f3 = resolveMediaRef(_0x2229e1);
      if (!_0x32e4f3) {
        throw new Error("素材图片保存结果缺少可用地址");
      }
      if (normalizeText(_0x239c02['id']) !== _0x16f9a3) {
        return null;
      }
      _0x4b13ea["push"]({
        'file': _0x2ae75c,
        'imageRef': _0x32e4f3
      });
    }
    const _0x5d7876 = _0x2cbdf2 === "scene";
    const _0x596d50 = _0x5d7876 ? "scenes" : "characters";
    const _0x14a469 = Array['isArray'](_0x239c02[_0x596d50]) ? _0x239c02[_0x596d50] : [];
    const _0x3666e9 = new Set(_0x14a469['map'](_0x6ca6d2 => _0x6ca6d2['id']));
    const _0x4086cb = _0x4b13ea['map'](({
      file: _0x382286,
      imageRef: _0x37632f
    }, _0x5ba05c) => {
      const _0x5d0f77 = _0x14a469["length"] + _0x5ba05c + 0x1;
      let _0x1ae17b = _0x5d0f77;
      const _0xe0d922 = _0x5d7876 ? "target-scene" : "target";
      while (_0x3666e9["has"](_0xe0d922 + '-' + _0x1ae17b)) {
        _0x1ae17b += 0x1;
      }
      const _0x230923 = _0xe0d922 + '-' + _0x1ae17b;
      const _0x26494c = _0x230923 + '-appearance-1';
      _0x3666e9['add'](_0x230923);
      const _0x1519ef = _0x5d7876 ? '场景' : '人物';
      const _0x298523 = _0x5d7876 ? "目标场景 " + _0x5d0f77 : "目标人物 " + _0x5d0f77;
      const _0x2c2d94 = {
        'id': _0x230923,
        'kind': _0x2cbdf2,
        'role': _0x1519ef,
        'name': createUploadedAssetName(_0x382286["name"], _0x298523),
        'appearances': [{
          'id': _0x26494c,
          'name': _0x5d7876 ? "场景图" : '基础形象',
          'imageUrl': _0x37632f,
          'prompt': '',
          'occurrences': "当前项目"
        }],
        'baseAppearanceId': _0x26494c,
        'description': ''
      };
      if (!_0x5d7876) {
        _0x2c2d94["voiceReference"] = null;
      }
      return _0x2c2d94;
    });
    const _0xd7bceb = _0x4086cb['at'](-0x1);
    return {
      'project': _0x5a31bd({
        ..._0x239c02,
        [_0x596d50]: [..._0x14a469, ..._0x4086cb],
        'workspace': {
          ..._0x239c02["workspace"],
          ...(_0x5d7876 ? {
            'selectedSceneId': _0xd7bceb?.['id'] || _0x239c02["workspace"]["selectedSceneId"]
          } : {
            'selectedCharacterId': _0xd7bceb?.['id'] || _0x239c02["workspace"]['selectedCharacterId']
          })
        }
      })
    };
  }
  function _0x5e076e(_0x1c41e1 = []) {
    return _0x4bb6a4(_0x1c41e1, 'character');
  }
  function _0x43510e(_0x2307ea = []) {
    return _0x4bb6a4(_0x2307ea, 'scene');
  }
  async function _0x438791(_0x1d0119 = []) {
    const _0x4b6333 = (Array['isArray'](_0x1d0119) ? _0x1d0119 : [_0x1d0119])["filter"](Boolean);
    if (!_0x4b6333['length'] || typeof _0x1ada41 !== "function") {
      return null;
    }
    if (typeof saveAssetPackageItem !== "function") {
      throw new Error('总素材服务尚未初始化。');
    }
    const _0x6190cb = normalizeText(_0x239c02['id']);
    const _0x4c9fe5 = [];
    const _0x40cc8b = [];
    for (const _0x1ff2d0 of _0x4b6333) {
      const _0x1c1846 = await _0x1ada41(_0x1ff2d0, _0x6190cb);
      const _0x50cb07 = resolveMediaRef(_0x1c1846);
      if (!_0x50cb07) {
        throw new Error("音频保存结果缺少可用地址");
      }
      if (normalizeText(_0x239c02['id']) !== _0x6190cb) {
        return null;
      }
      const _0xc2f692 = createId("person-replacement-audio");
      const _0x313ef7 = createUploadedAssetName(_0x1ff2d0["name"], "未命名音频");
      const _0x5da54c = await saveAssetPackageItem({
        'packageKey': "person-replacement-audio:" + _0x6190cb,
        'packageName': (normalizeText(_0x239c02["title"]) || "未命名人物替换项目") + " · 音频素材",
        'category': "替换工作室",
        'itemKey': _0xc2f692,
        'itemName': _0x313ef7,
        'audio': {
          ...(_0x1c1846 && typeof _0x1c1846 === 'object' ? _0x1c1846 : {}),
          'audioUrl': _0x50cb07
        },
        'metadata': {
          'sourceKind': 'person-replacement-workspace',
          'sourceProjectId': _0x6190cb
        },
        'itemMetadata': {
          'sourceKind': "person-replacement-workspace",
          'sourceProjectId': _0x6190cb,
          'sourceAudioId': _0xc2f692
        }
      });
      if (normalizeText(_0x239c02['id']) !== _0x6190cb) {
        return null;
      }
      const _0x312a5f = normalizeText(_0x5da54c?.["assetId"]);
      const _0x40fdd8 = Math["max"](0x0, Math["trunc"](Number(_0x5da54c?.["itemIndex"]) || 0x0));
      _0x312a5f && (_0x4c9fe5["push"]({
        'assetId': _0x312a5f,
        'itemIndex': _0x40fdd8
      }), _0x40cc8b["push"]({
        'assetId': _0x312a5f,
        'itemIndex': _0x40fdd8,
        'type': "audio",
        'assetName': (normalizeText(_0x239c02["title"]) || "未命名人物替换项目") + '\x20·\x20音频素材',
        'name': _0x313ef7,
        'savedName': _0x313ef7,
        'url': _0x50cb07,
        'durationSec': Math["max"](0x0, Number(_0x1c1846?.["durationSec"]) || 0x0),
        'waveformLocalPath': normalizeText(_0x1c1846?.["waveformLocalPath"]),
        'waveformUrl': normalizeText(_0x1c1846?.["waveformUrl"])
      }));
    }
    const _0x17610b = _0x1c6393({
      'assetRefs': _0x4c9fe5,
      'targetKind': "audio",
      'notify': ![],
      'sourceAssets': _0x40cc8b
    });
    const _0x33d8da = _0x5a31bd({
      ..._0x239c02,
      'workspace': {
        ..._0x239c02["workspace"],
        'characterAssetTab': "audio",
        'assetSelectionMode': ![],
        'selectedAssetIds': []
      }
    });
    showToast(_0x4b6333["length"] > 0x1 ? '已上传\x20' + _0x4b6333["length"] + " 个音频素材。" : '音频素材已上传。', "success");
    return {
      ..._0x17610b,
      'project': _0x33d8da
    };
  }
  function _0x1c6393({
    assetRefs = [],
    targetKind = "character",
    notify = !![],
    sourceAssets = null
  } = {}) {
    const _0x1345e8 = ["character", "scene", "audio"]["includes"](targetKind) ? targetKind : "character";
    const _0x541857 = _0x1345e8 === "scene" ? "scenes" : _0x1345e8 === 'audio' ? "audioAssets" : "characters";
    const _0x466c88 = Array['isArray'](_0x239c02[_0x541857]) ? _0x239c02[_0x541857] : [];
    const _0x51af72 = _0x1345e8 === "scene" ? '场景' : _0x1345e8 === 'audio' ? '音频' : '人物';
    const _0x463081 = new Set((Array["isArray"](assetRefs) ? assetRefs : [])["map"](_0x405a36 => normalizeText(_0x405a36?.['assetId'] || _0x405a36?.["sourceAssetId"]) + ':' + Math["max"](0x0, Math["trunc"](Number(_0x405a36?.["itemIndex"] ?? _0x405a36?.["sourceItemIndex"]) || 0x0))));
    const _0x3bc284 = new Map(_0x466c88["filter"](_0x4f3a8e => normalizeText(_0x4f3a8e?.['sourceOrigin']) === 'library')["map"](_0x5ebd5d => [normalizeText(_0x5ebd5d["sourceAssetId"]) + ':' + Math["max"](0x0, Math["trunc"](Number(_0x5ebd5d["sourceItemIndex"]) || 0x0)), _0x5ebd5d]));
    const _0x30da5d = [];
    const _0x397291 = [];
    const _0x6bd962 = new Set(_0x466c88["map"](_0x49b666 => _0x49b666['id']));
    const _0x49af98 = Array['isArray'](sourceAssets) ? sourceAssets : _0xe6501d();
    _0x49af98['forEach'](_0x11566c => {
      const _0x2d513b = normalizeText(_0x11566c?.["assetId"] || _0x11566c?.["sourceAssetId"]);
      const _0xb64a9f = Math["max"](0x0, Math["trunc"](Number(_0x11566c?.["itemIndex"] ?? _0x11566c?.["sourceItemIndex"]) || 0x0));
      const _0x3921e3 = _0x2d513b + ':' + _0xb64a9f;
      if (!_0x463081['has'](_0x3921e3)) {
        return;
      }
      const _0x2161db = _0x3bc284["get"](_0x3921e3);
      if (_0x2161db) {
        _0x397291["push"](_0x2161db['id']);
        return;
      }
      const _0x184551 = normalizeText(_0x11566c?.['type'] || _0x11566c?.['mediaKind'])["toLowerCase"]();
      const _0x4afa20 = _0x1345e8 === "audio" ? normalizeText(_0x11566c?.['url'] || _0x11566c?.["sourceUrl"] || _0x11566c?.["audioUrl"]) : normalizeText(_0x11566c?.["url"] || _0x11566c?.['sourceUrl'] || _0x11566c?.["imageUrl"]);
      const _0x158162 = _0x1345e8 === 'audio' ? 'audio' : 'image';
      if (_0x184551 !== _0x158162 || !_0x4afa20) {
        return;
      }
      let _0x4f5561 = _0x466c88["length"] + _0x30da5d["length"] + 0x1;
      const _0xfff63d = _0x1345e8 === 'scene' ? 'target-scene' : _0x1345e8 === "audio" ? "project-audio" : "target";
      while (_0x6bd962["has"](_0xfff63d + '-' + _0x4f5561)) {
        _0x4f5561 += 0x1;
      }
      const _0x29a920 = _0xfff63d + '-' + _0x4f5561;
      const _0x51404e = createUploadedAssetName(_0x11566c["name"] || _0x11566c['assetName'], '');
      const _0x444c63 = _0x1345e8 === 'audio' ? createUploadedAssetName(getPersonReplacementAudioSavedName(_0x11566c), '') : '';
      _0x6bd962["add"](_0x29a920);
      let _0x3c29c8;
      if (_0x1345e8 === 'audio') {
        _0x3c29c8 = {
          'id': _0x29a920,
          'kind': "audio",
          'mediaKind': "audio",
          'role': "音频素材",
          'name': _0x444c63 || "音频 " + _0x4f5561,
          'savedName': _0x444c63 || "音频 " + _0x4f5561,
          'assetName': normalizeText(_0x11566c["assetName"]) || _0x51404e || '音频\x20' + _0x4f5561,
          'sourceOrigin': "library",
          'sourceAssetId': _0x2d513b,
          'sourceItemIndex': _0xb64a9f,
          'sourceUrl': _0x4afa20,
          'audioUrl': _0x4afa20,
          'waveformLocalPath': normalizeText(_0x11566c["waveformLocalPath"]),
          'waveformUrl': normalizeText(_0x11566c["waveformUrl"]),
          'durationSec': Math["max"](0x0, Number(_0x11566c["durationSec"]) || 0x0),
          'occurrences': '当前项目',
          'description': '',
          'isLibraryAsset': ![]
        };
      } else {
        const _0x23ad89 = _0x29a920 + '-appearance-1';
        _0x3c29c8 = {
          'id': _0x29a920,
          'kind': _0x1345e8,
          'role': _0x51af72,
          'name': _0x51404e || '目标' + _0x51af72 + '\x20' + _0x4f5561,
          'sourceOrigin': "library",
          'sourceAssetId': _0x2d513b,
          'sourceItemIndex': _0xb64a9f,
          'appearances': [{
            'id': _0x23ad89,
            'name': _0x1345e8 === "scene" ? "场景图" : "基础形象",
            'imageUrl': _0x4afa20,
            'prompt': '',
            'occurrences': "总素材"
          }],
          'baseAppearanceId': _0x23ad89,
          ...(_0x1345e8 === "character" ? {
            'voiceReference': null
          } : {}),
          'description': ''
        };
      }
      _0x30da5d["push"](_0x3c29c8);
      _0x3bc284["set"](_0x3921e3, _0x3c29c8);
    });
    const _0x4142ed = [..._0x397291, ..._0x30da5d["map"](_0x4709b4 => _0x4709b4['id'])];
    if (!_0x4142ed['length']) {
      notify && showToast(_0x1345e8 === "audio" ? "请选择总素材中的音频后再加入项目。" : "请选择总素材中的图片后再加入" + _0x51af72 + '。', "warn");
      return {
        'project': _0x12e469(),
        'addedCount': 0x0,
        'existingCount': 0x0
      };
    }
    _0x5a31bd({
      ..._0x239c02,
      [_0x541857]: [..._0x466c88, ..._0x30da5d],
      'workspace': {
        ..._0x239c02["workspace"],
        ...(_0x1345e8 === "scene" ? {
          'selectedSceneId': _0x4142ed['at'](-0x1)
        } : _0x1345e8 === "audio" ? {
          'selectedAudioAssetId': _0x4142ed['at'](-0x1)
        } : {
          'selectedCharacterId': _0x4142ed['at'](-0x1)
        }),
        'assetSelectionMode': ![],
        'selectedAssetIds': []
      }
    }, {
      'sync': ![]
    });
    if (notify && _0x30da5d["length"]) {
      showToast("已将 " + _0x30da5d["length"] + '\x20项总素材加入' + _0x51af72 + '。', 'success');
    } else {
      notify && showToast(_0x1345e8 === "audio" ? "所选音频已在当前项目中。" : '所选图片已在' + _0x51af72 + '素材中。', "info");
    }
    return {
      'project': _0x12e469(),
      'addedCount': _0x30da5d["length"],
      'existingCount': _0x397291["length"]
    };
  }
  function _0x217552(_0xc13a87 = {}) {
    return _0x1c6393({
      ..._0xc13a87,
      'targetKind': "character"
    });
  }
  async function _0x2a572f(_0x4a8314, _0x4df8ae = {}) {
    if (!_0x4a8314 || typeof _0x1ada41 !== "function") {
      return null;
    }
    const _0x27c800 = await _0x1ada41(_0x4a8314, _0x239c02['id']);
    const _0x8b162d = resolveMediaRef(_0x27c800);
    if (!_0x8b162d) {
      throw new Error("人物形象保存结果缺少可用地址");
    }
    const _0x41cf8b = _0x239c02["characters"]["map"](_0x3f5137 => _0x3f5137['id'] === _0x4df8ae["characterId"] ? {
      ..._0x3f5137,
      'appearances': _0x3f5137["appearances"]["map"](_0x1a1528 => _0x1a1528['id'] === _0x4df8ae["appearanceId"] ? {
        ..._0x1a1528,
        'imageUrl': _0x8b162d,
        'generationStatus': "succeeded",
        'error': ''
      } : _0x1a1528)
    } : _0x3f5137);
    return {
      'project': _0x5a31bd({
        ..._0x239c02,
        'characters': _0x41cf8b
      })
    };
  }
  async function _0x3f72f3(_0x2642fe, _0x5c95a7 = {}) {
    if (!_0x2642fe || typeof _0x1ada41 !== 'function') {
      return null;
    }
    const _0x5d8ce3 = normalizeText(_0x5c95a7['shotId']);
    const _0x426b3e = _0x239c02['shots']["find"](_0x597daf => _0x597daf['id'] === _0x5d8ce3);
    if (!_0x426b3e) {
      throw new Error("当前片段不可用");
    }
    const _0x39acf5 = _0x239c02['id'];
    const _0x28e84d = createPersonReplacementImageGenerationMappingRevision({
      'project': _0x239c02,
      'shot': _0x426b3e
    });
    const _0x1a8312 = await _0x1ada41(_0x2642fe, _0x39acf5);
    const _0x3e7ab2 = resolveMediaRef(_0x1a8312);
    if (!_0x3e7ab2) {
      throw new Error('替换图片保存结果缺少可用地址');
    }
    const _0x2df78a = _0x524bb8["acceptUploadedResult"]({
      'shotId': _0x5d8ce3,
      'imageRef': _0x3e7ab2,
      'fileName': normalizeText(_0x2642fe["name"]),
      'createdAt': nowIso(),
      'expectedProjectId': _0x39acf5,
      'expectedShotRevision': _0x28e84d
    });
    if (!_0x2df78a) {
      return null;
    }
    showToast("替换图片已加入当前片段。", "success");
    return {
      'project': _0x2df78a
    };
  }
  async function _0x3467b7(_0xf7f52f, _0x15ccfe = {}) {
    return uploadPersonReplacementVideoResult({
      'file': _0xf7f52f,
      'context': _0x15ccfe,
      'project': _0x239c02,
      'uploadFile': _0x1ada41,
      'prepareUploadedVideoAsset': prepareUploadedVideoAsset,
      'videoTaskRuntime': _0x38250f,
      'now': nowIso,
      'showToast': showToast
    });
  }
  function _0x4e89a9({
    shotId = '',
    slotId = '',
    input = null
  } = {}) {
    const _0x1678d7 = normalizeText(shotId);
    const _0x18ca19 = normalizeText(slotId);
    const _0xc22839 = _0x239c02["shots"]["find"](_0x489b77 => _0x489b77['id'] === _0x1678d7);
    if (!_0xc22839 || !_0x18ca19) {
      return null;
    }
    const _0x342701 = {
      ...(_0xc22839["replacementVideoInputsBySlot"] || {})
    };
    if (input) {
      _0x342701[_0x18ca19] = input;
    } else {
      delete _0x342701[_0x18ca19];
    }
    const _0x5aff63 = {
      ..._0x239c02,
      'shots': _0x239c02['shots']["map"](_0x14b7a6 => _0x14b7a6['id'] === _0x1678d7 ? {
        ..._0x14b7a6,
        'replacementVideoInputsBySlot': _0x342701,
        'error': ''
      } : _0x14b7a6),
      'workspace': {
        ...updatePersonReplacementVideoGenerationState(_0x239c02["workspace"], {
          'status': "idle",
          'shotId': _0x1678d7,
          'error': ''
        }),
        'selectedShotId': _0x1678d7
      }
    };
    return _0x5a31bd(_0x5aff63, {
      'renderWorkspace': ![]
    });
  }
  async function _0x445894(_0x2393df, _0x20035a = {}) {
    if (!_0x2393df || typeof _0x1ada41 !== "function") {
      return null;
    }
    try {
      const _0x281531 = normalizeText(_0x20035a["shotId"]);
      const _0x5b5dcd = normalizeText(_0x20035a["slotId"]);
      const _0x18ebe2 = _0x239c02["shots"]["find"](_0x2bf819 => _0x2bf819['id'] === _0x281531);
      if (!_0x18ebe2) {
        throw new Error("当前片段不可用");
      }
      const _0x40066e = resolvePersonReplacementVideoSlotState(_0x239c02, _0x18ebe2);
      if (normalizeText(_0x20035a["modelId"]) && normalizeText(_0x20035a['modelId']) !== _0x40066e['modelId']) {
        throw new Error("视频模型已经切换，请重新选择入参槽");
      }
      if (_0x40066e["readOnlySlots"]["includes"](_0x5b5dcd)) {
        throw new Error("源视频和当前参考图由所选片段自动提供");
      }
      const _0x4d6066 = normalizeText(_0x40066e["fixedInputConfig"]?.['slotKindById']?.[_0x5b5dcd]);
      if (!_0x4d6066) {
        throw new Error("当前模型没有这个入参槽");
      }
      const _0x5b8e2a = normalizeText(_0x2393df["type"])['toLowerCase']();
      const _0x6193b1 = normalizeText(_0x2393df["name"])["toLowerCase"]();
      const _0x3f1bfe = _0x5b8e2a["startsWith"]("image/") || /\.(?:avif|bmp|gif|jpe?g|png|webp)$/i["test"](_0x6193b1) ? "image" : _0x5b8e2a["startsWith"]("video/") || /\.(?:avi|m4v|mkv|mov|mp4|webm)$/i['test'](_0x6193b1) ? 'video' : '';
      if (_0x3f1bfe !== _0x4d6066) {
        throw new Error(_0x4d6066 === "video" ? "请选择视频文件" : '请选择图片文件');
      }
      const _0x4766ff = await _0x1ada41(_0x2393df, _0x239c02['id']);
      const _0x22f9e3 = resolveMediaRef(_0x4766ff);
      if (!_0x22f9e3) {
        throw new Error("视频模型入参保存结果缺少可用地址");
      }
      const _0x2039c5 = _0x4e89a9({
        'shotId': _0x281531,
        'slotId': _0x5b5dcd,
        'input': {
          'kind': _0x4d6066,
          'url': _0x22f9e3,
          'modelId': _0x40066e['modelId'],
          'fileName': normalizeText(_0x2393df['name']),
          'mimeType': normalizeText(_0x2393df['type']),
          'thumbUrl': resolveVideoThumbnailRef(_0x4766ff)
        }
      });
      showToast((_0x40066e['fixedInputConfig']?.["slotById"]?.[_0x5b5dcd]?.['label'] || "模型入参") + '已接入。', "success");
      return _0x2039c5 ? {
        'project': _0x2039c5
      } : null;
    } catch (_0x348c34) {
      showToast(_0x348c34?.["message"] || "视频模型入参上传失败", 'error');
      return null;
    }
  }
  function _0x2c3ed4(_0x536fae = {}) {
    const _0x32f78a = normalizeText(_0x536fae['shotId']);
    const _0xcf4be8 = normalizeText(_0x536fae['slotId']);
    const _0xae1ca1 = _0x239c02["shots"]['find'](_0x27f2ac => _0x27f2ac['id'] === _0x32f78a);
    if (!_0xae1ca1 || !_0xae1ca1["replacementVideoInputsBySlot"]?.[_0xcf4be8]) {
      return null;
    }
    const _0x5ef2e7 = _0x4e89a9({
      'shotId': _0x32f78a,
      'slotId': _0xcf4be8,
      'input': null
    });
    return _0x5ef2e7 ? {
      'project': _0x5ef2e7
    } : null;
  }
  async function _0x55e9ac(_0x589f26, _0x381611 = {}) {
    if (!_0x589f26 || typeof _0x1ada41 !== 'function') {
      return null;
    }
    const _0x266bc9 = await _0x1ada41(_0x589f26, _0x239c02['id']);
    const _0x50c4bb = resolveMediaRef(_0x266bc9);
    if (!_0x50c4bb) {
      throw new Error("关键帧保存结果缺少可用地址");
    }
    return {
      'keyframeRef': _0x50c4bb,
      'keyframeTimeSec': Number(_0x381611["keyframeTimeSec"]) || 0x0,
      'frame': _0x381611["frame"] && typeof _0x381611["frame"] === "object" ? {
        ..._0x381611['frame']
      } : {}
    };
  }
  async function _0x41af99(_0x1e378d, _0x1d44f7 = {}) {
    if (!_0x1e378d || typeof _0x1ada41 !== "function") {
      return null;
    }
    const _0x33ba6b = await _0x1ada41(_0x1e378d, _0x239c02['id']);
    const _0x4f16d4 = resolveMediaRef(_0x33ba6b);
    if (!_0x4f16d4) {
      throw new Error("声音保存结果缺少可用地址");
    }
    const _0x9df238 = _0x239c02["characters"]["map"](_0x294b69 => _0x294b69['id'] === _0x1d44f7['characterId'] ? {
      ..._0x294b69,
      'voiceRef': _0x4f16d4,
      'voiceReference': {
        'audioUrl': resolveMediaUrl(_0x4f16d4),
        'localPath': normalizeLocalPath(_0x4f16d4) || _0x4f16d4,
        'fileName': normalizeText(_0x1e378d["name"]) || "上传声音",
        'source': "upload",
        'updatedAt': Date["now"]()
      }
    } : _0x294b69);
    return {
      'project': _0x5a31bd({
        ..._0x239c02,
        'characters': _0x9df238
      })
    };
  }
  function _0x11c189(_0x4b079a = {}) {
    const _0x56f363 = normalizeText(_0x4b079a['characterId']);
    const _0x13d601 = _0x4b079a["asset"] && typeof _0x4b079a["asset"] === "object" ? _0x4b079a['asset'] : {};
    const _0x3f95cc = _0x239c02['characters']["find"](_0x83d7ba => _0x83d7ba['id'] === _0x56f363);
    if (!_0x3f95cc) {
      showToast("要添加声音的人设不存在。", "warn");
      return null;
    }
    if (normalizeText(_0x13d601["mediaKind"] || _0x13d601["type"])["toLowerCase"]() !== "audio") {
      showToast("请选择音频素材。", "warn");
      return null;
    }
    const _0x58a131 = getPersonReplacementLibraryAudioRef(_0x13d601);
    if (!_0x58a131) {
      showToast('所选音频缺少可用地址。', "warn");
      return null;
    }
    const _0x26df23 = normalizeLocalPath(_0x58a131);
    const _0x4d9528 = buildPersonReplacementLibraryVoiceReference(_0x13d601, {
      'audioUrl': resolveMediaUrl(_0x58a131),
      'localPath': _0x26df23
    });
    const _0x301776 = _0x239c02["characters"]['map'](_0x18e147 => _0x18e147['id'] === _0x56f363 ? {
      ..._0x18e147,
      'voiceRef': _0x26df23 || _0x58a131,
      'voiceReference': _0x4d9528
    } : _0x18e147);
    const _0xd61fe0 = _0x5a31bd({
      ..._0x239c02,
      'characters': _0x301776
    });
    showToast("已为「" + _0x3f95cc["name"] + '」添加声音。', "success");
    return {
      'project': _0xd61fe0
    };
  }
  async function _0xf54942(_0x5ea533 = {}) {
    const _0x1fb636 = _0x239c02["characters"]["find"](_0x5c8f1e => _0x5c8f1e['id'] === _0x5ea533['characterId']);
    if (!_0x1fb636) {
      return null;
    }
    const _0x4ead4d = normalizeText(_0x5ea533['prompt'] || _0x1fb636["description"]);
    const _0x3b9a7c = normalizeText(_0x5ea533["promptPresetId"]) || normalizeText(_0x239c02["workspace"]["assetPromptPresetId"]);
    const _0x119d2a = applyPersonReplacementCharacterAssetPromptPreset(_0x3b9a7c, _0x4ead4d);
    const _0x39ffcf = getPersonReplacementCharacterBaseImageRef(_0x1fb636);
    if (!_0x39ffcf) {
      showToast("请先上传人物基础形象。", "warn");
      return null;
    }
    if (!_0x119d2a) {
      showToast("请先填写新形象提示词。", "warn");
      return null;
    }
    const _0x42c6cc = buildCharacterAssetImageGenerationPayload({
      'prompt': _0x119d2a,
      'modelId': _0x5ea533['modelId'] || _0x239c02['settings']["characterImageModelId"],
      'provider': _0x5ea533["provider"] || _0x239c02["settings"]["characterImageProvider"],
      'providerProfileId': _0x5ea533['providerProfileId'] || _0x239c02['settings']["characterImageProviderProfileId"],
      'generationParams': _0x5ea533["generationParams"] || _0x239c02["settings"]["characterImageGenerationParams"],
      'referenceImageUrls': [_0x39ffcf]
    });
    if (_0x5ea533["preview"] === !![]) {
      return {
        'payload': _0x42c6cc
      };
    }
    if (typeof _0x311137 !== "function") {
      showToast("图像生成服务尚未初始化。", "error");
      return null;
    }
    const _0x24dccb = _0x239c02['id'] + ':' + _0x1fb636['id'];
    if (_0x584375['has'](_0x24dccb)) {
      return null;
    }
    _0x584375["add"](_0x24dccb);
    const _0x3e002d = _0x1fb636['appearances']["length"] + 0x1;
    const _0x40aebe = _0x1fb636['id'] + '-appearance-' + _0x3e002d + '-' + Date['now']();
    const _0x1fa391 = {
      'id': _0x40aebe,
      'name': a1190_0x100dfd(_0x3b9a7c, _0x3e002d),
      'imageUrl': '',
      'prompt': _0x4ead4d,
      'promptPresetId': _0x3b9a7c,
      'occurrences': '当前项目',
      'generationStatus': "running",
      'error': ''
    };
    _0x5a31bd({
      ..._0x239c02,
      'characters': _0x239c02["characters"]["map"](_0x5a12c3 => _0x5a12c3['id'] === _0x1fb636['id'] ? {
        ..._0x5a12c3,
        'appearances': [..._0x5a12c3["appearances"], _0x1fa391]
      } : _0x5a12c3),
      'workspace': {
        ..._0x239c02['workspace'],
        'assetAppearanceIndexes': {
          ..._0x239c02['workspace']["assetAppearanceIndexes"],
          [_0x1fb636['id']]: _0x3e002d - 0x1
        },
        'generatingAppearanceKeys': [..._0x239c02["workspace"]['generatingAppearanceKeys'], _0x1fb636['id'] + ':' + _0x40aebe]
      }
    });
    try {
      const _0x502c10 = await _0x311137(_0x42c6cc);
      const _0x448f00 = getFirstSuccessfulImageRef(_0x502c10);
      const _0x2490ae = _0x239c02["characters"]["map"](_0x29cb0f => _0x29cb0f['id'] === _0x1fb636['id'] ? {
        ..._0x29cb0f,
        'appearances': _0x29cb0f['appearances']["map"](_0x534b73 => _0x534b73['id'] === _0x40aebe ? {
          ..._0x534b73,
          'imageUrl': _0x448f00,
          'generationStatus': "succeeded",
          'error': ''
        } : _0x534b73)
      } : _0x29cb0f);
      const _0x40626f = _0x5a31bd({
        ..._0x239c02,
        'characters': _0x2490ae,
        'workspace': {
          ..._0x239c02["workspace"],
          'generatingAppearanceKeys': _0x239c02["workspace"]["generatingAppearanceKeys"]["filter"](_0x196b3b => _0x196b3b !== _0x1fb636['id'] + ':' + _0x40aebe)
        }
      });
      _0x5ea533["notifyCompletion"] === ![] && showToast("已新增" + _0x1fa391["name"] + '。', 'success');
      _0x5ea533["notifyCompletion"] !== ![] && _0x5bca43({
        'kind': "asset",
        'mediaRef': _0x448f00
      });
      return {
        'project': _0x40626f,
        'ok': !![],
        'characterId': _0x1fb636['id']
      };
    } catch (_0x54130) {
      const _0x4b1ab7 = _0x54130?.['getUserMessage']?.() || _0x54130?.["message"] || '人物形象生成失败';
      const _0x947842 = _0x239c02["characters"]["map"](_0x1cb158 => _0x1cb158['id'] === _0x1fb636['id'] ? {
        ..._0x1cb158,
        'appearances': _0x1cb158["appearances"]["map"](_0x147922 => _0x147922['id'] === _0x40aebe ? {
          ..._0x147922,
          'generationStatus': "failed",
          'error': _0x4b1ab7
        } : _0x147922)
      } : _0x1cb158);
      const _0x5c73e5 = _0x5a31bd({
        ..._0x239c02,
        'characters': _0x947842,
        'workspace': {
          ..._0x239c02["workspace"],
          'generatingAppearanceKeys': _0x239c02['workspace']["generatingAppearanceKeys"]["filter"](_0x19ca5a => _0x19ca5a !== _0x1fb636['id'] + ':' + _0x40aebe)
        }
      });
      showToast(_0x4b1ab7, "error");
      return {
        'project': _0x5c73e5,
        'ok': ![],
        'characterId': _0x1fb636['id'],
        'error': _0x4b1ab7
      };
    } finally {
      _0x584375["delete"](_0x24dccb);
    }
  }
  const _0x210b95 = (_0x4be62c = {}) => _0x524bb8["generate"](_0x4be62c);
  const _0x2198a8 = (_0xbf142f = {}) => _0x524bb8["cancel"](_0xbf142f);
  const _0x34e09b = createPersonReplacementVideoPreparationRunner({
    'getProject': () => _0x239c02,
    'getProjectById': _0x2fd56d,
    'setProject': _0x5a31bd,
    'setProjectById': _0x10aa36,
    'isDestroyed': () => _0x1c7532,
    'waitForActiveReverse': _0x3ebd00 => _0x2cb1d4["waitForActiveReverse"](_0x3ebd00),
    'fetchVideoMeta': fetchVideoMeta,
    'resolveDurationSec': resolveDurationSec,
    'enqueueMediaTask': enqueueMediaTask,
    'resolveMediaRef': resolveMediaRef,
    'showToast': showToast
  });
  _0x38250f = createPersonReplacementVideoTaskRuntime({
    'getProject': () => _0x239c02,
    'getProjectById': _0x2fd56d,
    'setProject': _0x5a31bd,
    'setProjectById': _0x10aa36,
    'runPreparation': _0x34e09b,
    'generateReplacementVideo': _0x3403ce,
    'resolveInstallId': _0x331565,
    'persistNow': _0x57a6c0,
    'showToast': showToast,
    'notifyGenerationCompleted': _0x5bca43,
    'now': nowIso,
    'createId': () => createId("replacement-video-request")
  });
  function _0x174c74(_0x17ade8 = {}) {
    return _0x38250f['prepare'](_0x17ade8);
  }
  function _0x360a90(_0xa24ea7 = {}) {
    return _0x38250f["generate"](_0xa24ea7);
  }
  function _0x18e154(_0x37b754 = {}) {
    return _0x38250f["cancel"](_0x37b754);
  }
  _0x742181 = createPersonReplacementVoiceSeparationRuntime({
    'getProject': () => _0x239c02,
    'setProject': _0x5a31bd,
    'persistNow': _0x57a6c0,
    'showToast': showToast,
    'now': nowIso,
    'createId': () => createId('replacement-voice-separation'),
    'onStateChange': ({
      sourceId: _0x45c7ca,
      state: _0x3e9426
    }) => {
      _0x21af85?.["refreshVoiceSources"]?.({
        'sourceId': _0x45c7ca,
        'remountVoiceStudio': _0x3e9426?.["status"] === 'succeeded'
      });
    }
  });
  const _0x42bb74 = createPersonReplacementOutputCoordinator({
    'documentObject': documentObject,
    'windowObject': windowObject,
    'projectSession': _0x1149ad,
    'getWorkspace': () => _0x21af85,
    'prepareVideoReplacementShots': _0x174c74,
    'createVoicePanel': createVoicePanel,
    'enqueueMediaTask': enqueueMediaTask,
    'playCompletion': playCompletion,
    'showCompletionNotification': showCompletionNotification,
    'saveMedia': saveMedia,
    'saveMediaFiles': saveMediaFiles,
    'createOutputCanvas': createOutputCanvas,
    'onRequestClose': onRequestClose,
    'showToast': showToast
  });
  const _0x1a6e7c = PERSON_REPLACEMENT_WORKSPACE_INTENTS;
  const _0x26fa4d = createPersonReplacementWorkspaceIntentPort({
    'handlers': {
      [_0x1a6e7c['GET_PROMPT_ENHANCEMENT_MODEL']]: (..._0x32f0b2) => promptEnhancement["getPromptEnhancementModel"]?.(..._0x32f0b2) || {},
      [_0x1a6e7c["LIST_LIBRARY_ASSETS"]]: _0xe6501d,
      [_0x1a6e7c["SELECT_SOURCE_VIDEOS"]]: _0x30aa56,
      [_0x1a6e7c["SELECT_SOURCE_VIDEO"]]: _0x4ba78e => _0x30aa56([_0x4ba78e]),
      [_0x1a6e7c["REMOVE_SOURCE"]]: _0x4173a8,
      [_0x1a6e7c['PROCESS_SOURCES']]: _0xe6ea10,
      [_0x1a6e7c['ADD_LIBRARY_ASSETS_TO_PROJECT']]: _0x1c6393,
      [_0x1a6e7c['ADD_LIBRARY_ASSETS_TO_CHARACTERS']]: _0x217552,
      [_0x1a6e7c["ADD_ASSET_APPEARANCE_TO_LIBRARY"]]: _0x36d006,
      [_0x1a6e7c["SELECT_NEW_CHARACTER_IMAGES"]]: _0x5e076e,
      [_0x1a6e7c["SELECT_NEW_CHARACTER_IMAGE"]]: _0x2d8884 => _0x5e076e([_0x2d8884]),
      [_0x1a6e7c["SELECT_NEW_SCENE_IMAGES"]]: _0x43510e,
      [_0x1a6e7c['SELECT_NEW_AUDIO_FILES']]: _0x438791,
      [_0x1a6e7c['SELECT_CHARACTER_REFERENCE']]: _0x2a572f,
      [_0x1a6e7c["SELECT_REPLACEMENT_IMAGE"]]: _0x3f72f3,
      [_0x1a6e7c["SELECT_REPLACEMENT_VIDEO_RESULT"]]: _0x3467b7,
      [_0x1a6e7c["SELECT_REPLACEMENT_VIDEO_INPUT"]]: _0x445894,
      [_0x1a6e7c["REMOVE_REPLACEMENT_VIDEO_INPUT"]]: _0x2c3ed4,
      [_0x1a6e7c['SELECT_SHOT_KEYFRAME']]: _0x55e9ac,
      [_0x1a6e7c["SELECT_CHARACTER_VOICE"]]: _0x41af99,
      [_0x1a6e7c["SELECT_CHARACTER_VOICE_LIBRARY"]]: _0x11c189,
      [_0x1a6e7c["DELETE_CHARACTER"]]: _0x436d41,
      [_0x1a6e7c["DELETE_SCENE"]]: _0x29c970,
      [_0x1a6e7c["DELETE_AUDIO_ASSET"]]: _0x4b6020,
      [_0x1a6e7c["DOWNLOAD_IMAGE"]]: _0x42bb74["downloadImage"],
      [_0x1a6e7c["DOWNLOAD_VIDEO"]]: _0x42bb74["downloadVideo"],
      [_0x1a6e7c["PREVIEW_GENERATION"]]: async _0x3d38b8 => {
        if (globalThis["window"]?.["DEV_MODE"] !== !![]) {
          throw new Error('仅开发者模式可调试请求');
        }
        if (_0x3d38b8["kind"] === "asset") {
          return _0xf54942({
            ..._0x3d38b8,
            'preview': !![]
          });
        }
        if (_0x3d38b8["kind"] === "image") {
          return _0x524bb8["preview"](_0x3d38b8);
        }
        const _0x3edd96 = _0x2fd56d(_0x3d38b8["projectId"]) || _0x239c02;
        const _0xb3038a = _0x3edd96["shots"]["find"](_0x58e71a => _0x58e71a['id'] === _0x3d38b8["shotId"]);
        if (!_0xb3038a) {
          throw new Error("请先选择镜头");
        }
        return {
          'payload': buildPersonReplacementVideoRequest({
            'currentProject': _0x3edd96,
            'shot': _0xb3038a
          })
        };
      },
      [_0x1a6e7c["GENERATE_CHARACTER_IMAGE"]]: _0xf54942,
      [_0x1a6e7c["RESOLVE_CHARACTER_IMAGE_BATCH_CONCURRENCY"]]: resolvePersonReplacementCharacterImageBatchConcurrency,
      [_0x1a6e7c["GENERATE_REPLACEMENT_IMAGE"]]: _0x210b95,
      [_0x1a6e7c["CANCEL_REPLACEMENT_IMAGE"]]: _0x2198a8,
      [_0x1a6e7c["GENERATE_REPLACEMENT_VIDEO"]]: _0x360a90,
      [_0x1a6e7c["CANCEL_REPLACEMENT_VIDEO"]]: _0x18e154,
      [_0x1a6e7c["COMPLETE_GENERATION_BATCH"]]: _0x20ca05,
      [_0x1a6e7c["DETECT_SHOT_CUT_RANGES"]]: _0x3b4768,
      [_0x1a6e7c['UPDATE_SHOT_CUT_RANGES']]: _0x315a8a,
      [_0x1a6e7c["UPDATE_SHOT_REVERSE"]]: _0xfc46af,
      [_0x1a6e7c["SELECT_MANUAL_PERSON"]]: _0x8ee242,
      [_0x1a6e7c["UPDATE_PEOPLE"]]: _0x5b9404,
      [_0x1a6e7c["DELETE_PEOPLE"]]: _0x4c59b5,
      [_0x1a6e7c["MERGE_SOURCE_IDENTITIES"]]: _0x4b7a9d,
      [_0x1a6e7c["SPLIT_SOURCE_IDENTITY"]]: _0x473d8e,
      [_0x1a6e7c['CONFIRM_SOURCE_IDENTITY']]: _0x2c8e63,
      [_0x1a6e7c['MOUNT_VOICE_STUDIO']]: _0x42bb74["mountVoiceStudio"],
      [_0x1a6e7c['EXTRACT_VOICE']]: _0x742181["extract"],
      [_0x1a6e7c["CANCEL_VOICE_EXTRACTION"]]: _0x742181["cancel"],
      [_0x1a6e7c["RESUME_VOICE_EXTRACTION"]]: _0x742181["resume"],
      [_0x1a6e7c["OPEN_PROJECT"]]: _0x424b5c,
      [_0x1a6e7c['RENAME_PROJECT']]: _0x41609c,
      [_0x1a6e7c['DUPLICATE_PROJECT']]: _0x21daf4,
      [_0x1a6e7c["COLLECT_PROJECT"]]: _0x2e06ef,
      [_0x1a6e7c["IMPORT_PROJECT"]]: _0x2bdb12,
      [_0x1a6e7c["ARCHIVE_PROJECT"]]: _0x27d7d0,
      [_0x1a6e7c['DELETE_PROJECT']]: _0x235b3f,
      [_0x1a6e7c["BACK_HOME"]]: _0x41aea8,
      [_0x1a6e7c['COMPOSE_OUTPUT']]: _0x42bb74["composeOutput"],
      [_0x1a6e7c['EXPORT_OUTPUT']]: _0x42bb74['exportOutput'],
      [_0x1a6e7c['ADD_OUTPUT_TO_CANVAS']]: _0x42bb74['addOutputToCanvas'],
      [_0x1a6e7c["REPORT_STEP_NAVIGATION_BLOCKED"]]: ({
        reason: _0x2a61be
      } = {}) => {
        const _0x310f4d = _0x2a61be === PERSON_REPLACEMENT_STEP_GATE_REASONS["ASSET_SETTINGS_INCOMPLETE"] ? '请先在素材设定上传至少一张人物或场景图片。' : _0x2a61be === PERSON_REPLACEMENT_STEP_GATE_REASONS["IMAGE_REPLACEMENT_INCOMPLETE"] ? "请先在图像替换中绑定人物或场景。" : "正在处理片段";
        showToast(_0x310f4d, 'info');
      },
      [_0x1a6e7c["HAS_PROJECT_PACKAGE_DRAG"]]: _0x4c868a => projectPackages?.["hasProjectPackageDrag"]?.(_0x4c868a) === !![],
      [_0x1a6e7c["DROP_PROJECT_PACKAGE"]]: _0x18e934 => projectPackages?.["importProjectFromDrop"]?.(_0x18e934) === !![],
      [_0x1a6e7c["CAN_CLOSE"]]: () => !![],
      [_0x1a6e7c["CLOSE"]]: () => onRequestClose()
    }
  });
  _0x21af85 = createWorkspace({
    'documentObject': documentObject,
    'windowObject': windowObject,
    'mountTarget': mountTarget,
    'initialProject': _0x12e469(),
    'projectSession': _0x1149ad,
    'workspaceIntentPort': _0x26fa4d
  });
  if (typeof subscribeLibraryAssets === 'function') {
    try {
      const _0x52beb5 = subscribeLibraryAssets(() => {
        if (!_0x1c7532) {
          _0x5535e1();
        }
      });
      if (typeof _0x52beb5 === "function") {
        _0x1bfe3f = _0x52beb5;
      }
    } catch (_0x43a479) {
      console['warn']('[replacementStudio]\x20failed\x20to\x20subscribe\x20asset\x20library', _0x43a479);
    }
  }
  const _0x49641 = _0x239c02;
  const _0x4f05bb = _0x570baa;
  let _0x169046 = ![];
  const _0x4fa32f = Promise["resolve"]()["then"](async () => {
    if (typeof _0x2ede86 !== "function") {
      _0x169046 = !![];
      return;
    }
    const _0x9882af = normalizePersonReplacementProjectLibrary(await _0x2ede86());
    const _0x3ab9d8 = _0x9882af["projects"]["filter"](isPersistable);
    _0x1d9865 = _0x3ab9d8["length"] !== _0x9882af["projects"]["length"];
    const _0x44958f = _0x3ab9d8["map"](_0x179cf1 => {
      const _0x54573b = settleInterruptedReplacementStudioProjectTasks(_0x179cf1);
      if (_0x54573b["changed"]) {
        _0x1d9865 = !![];
      }
      return _0x54573b["project"];
    });
    const _0x546a49 = await Promise["all"](_0x44958f["map"](_0x2fd0ff => hydratePersonReplacementSourcePlaybackRefs(_0x2fd0ff, {
      'checkMediaExists': checkMediaExists
    })));
    _0x546a49["some"](_0x141358 => _0x141358["changed"]) && (_0x1d9865 = !![]);
    _0x509713 = normalizePersonReplacementProjectLibrary({
      ..._0x9882af,
      'projects': _0x546a49["map"](_0x5e26de => _0x5e26de["project"])
    });
    const _0x55d55f = _0x239c02 !== _0x49641 || _0x570baa !== _0x4f05bb;
    _0x55d55f ? isPersistable(_0x239c02) && (_0x509713 = upsertPersonReplacementProject(_0x509713, _0x239c02), _0x1d9865 = !![]) : (_0x1149ad['replace'](createInitialProject(), {
      'persist': ![],
      'presentation': 'none',
      'reason': "hydrate-home",
      'touchUpdatedAt': ![]
    }), _0x570baa = "home");
    _0x5535e1();
    _0x169046 = !![];
  })['catch'](_0x47fa85 => {
    console["warn"]("[replacementStudio] hydration failed", _0x47fa85);
    _0x962d37["setHydrationError"](_0x47fa85);
    showToast("人物替换项目加载失败，已暂停自动保存以防覆盖数据。", "error");
  })["finally"](() => {
    if (!_0x169046) {
      return;
    }
    _0x962d37['setReady'](!![]);
    if (_0x1d9865) {
      _0x40d326();
    }
  });
  return Object["freeze"]({
    'open'() {
      _0x21af85["open"]({
        'project': _0x12e469()
      });
      return _0x21af85;
    },
    'close'() {
      return _0x21af85["close"]();
    },
    'getProject'() {
      return cloneJson(_0x239c02);
    },
    'isSourceProcessing'() {
      return Boolean(_0x534757);
    },
    'getProjects'() {
      return cloneJson(_0x509713['projects']);
    },
    'setProject': _0x5a31bd,
    'openProject': _0x424b5c,
    'renameProject': _0x41609c,
    'duplicateProject': _0x21daf4,
    'collectProject': _0x2e06ef,
    'importProjectPackageResult': _0x444967,
    'archiveProject': _0x27d7d0,
    'deleteProject': _0x235b3f,
    'showProjectHome': _0x41aea8,
    'loadSourceFile'(_0x1245dd) {
      return _0x30aa56([_0x1245dd]);
    },
    'loadSourceFiles': _0x30aa56,
    'removeSource': _0x4173a8,
    'uploadReplacementImage': _0x3f72f3,
    'uploadReplacementVideoResult': _0x3467b7,
    'saveShotKeyframe': _0x55e9ac,
    'startSourceProcessing'(_0x1ff2b3 = {}) {
      return _0xe6ea10(_0x1ff2b3);
    },
    'updateShotCutRanges': _0x315a8a,
    'updateShotReverse': _0xfc46af,
    'detectShotCutRanges': _0x3b4768,
    'prepareVideoReplacementShots': _0x174c74,
    async 'analyzeSourceFile'(_0x91f446) {
      const _0x269a3c = await _0x30aa56([_0x91f446]);
      return _0x269a3c?.['ok'] ? await _0xe6ea10({
        'mode': "cut"
      }) : _0x269a3c;
    },
    'whenReady'() {
      return _0x4fa32f;
    },
    'navigateToTaskResult': createPersonReplacementCompletionNavigation({
      'getProject': () => _0x239c02,
      'getProjects': () => _0x509713["projects"],
      'openProject': _0x424b5c,
      'setProject': _0x5a31bd,
      'showToast': showToast,
      'showProject': () => {
        _0x570baa = "project";
        _0x5535e1();
      }
    }),
    async 'persist'() {
      await _0x4fa32f;
      return await _0x57a6c0({
        'force': !_0x962d37["isDirty"]()
      });
    },
    'destroy'() {
      if (_0x1c7532) {
        return;
      }
      _0x2cb1d4["invalidate"]();
      _0x534757?.['abort']?.();
      _0x534757 = null;
      _0x524bb8?.["destroy"]?.();
      _0x38250f?.["destroy"]?.();
      _0x742181?.["destroy"]?.();
      _0x21e35d();
      _0x1bfe3f();
      _0x1bfe3f = () => {};
      void _0x962d37["destroy"]({
        'flush': !![],
        'force': !![]
      })["catch"](() => {});
      _0x1c7532 = !![];
      _0x21af85["destroy"]();
      _0x42bb74["destroy"]();
      _0xdd6eff();
      _0x1149ad["destroy"]();
    }
  });
}