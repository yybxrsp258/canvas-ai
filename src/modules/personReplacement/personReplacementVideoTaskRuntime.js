import { buildPersonReplacementVideoRequest } from './personReplacementVideoRequest.js';
import { PERSON_REPLACEMENT_DEFAULT_VIDEO_MODEL_ID, PERSON_REPLACEMENT_VIDEO_INPUT_MODE_CHARACTER_REFERENCE, resolvePersonReplacementVideoImageInput, resolvePersonReplacementVideoResultRef } from './personReplacementProject.js';
import { appendPersonReplacementVideoResults, resolvePersonReplacementVideoSlotState } from './personReplacementVideoInputs.js';
import { isPersonReplacementVideoGenerationActive, getRecoverablePersonReplacementVideoTask, resolvePersonReplacementVideoGenerationState, updatePersonReplacementVideoGenerationState } from './personReplacementVideoGeneration.js';
import { hasPersonReplacementGenerationTaskIdentityChanged, projectPersonReplacementGenerationTaskIdentity } from './personReplacementGenerationTaskIdentity.js';
import { PERSON_REPLACEMENT_OUTPUT_TRANSITIONS, transitionPersonReplacementOutput } from './personReplacementOutputLineage.js';
import { getSuccessfulVideoGenerationItems, getVideoGenerationResultError } from '../../components/video-node/videoGenerationResultRenderer.js';
import { resolveModelExecution, resolveModelProvider } from '../../manifests/index.js';
import { cancelRunningHubVideoTask, resumeAsyncVideoTask, resumeRunningHubVideoTask } from '../../../api/aiVideoApi.js';
import { resolveRunningHubWorkflowAccess } from '../../../api/configApi.js';
import { normalizeLocalPath } from '../../utils/localMediaPath.js';
function normalizeText(_0x1b6e9f) {
  return String(_0x1b6e9f ?? '')["trim"]();
}
function resolveLocalVideoResultRef(_0x272dce = {}) {
  return [_0x272dce?.["localPath"], _0x272dce?.['displayLocalPath'], _0x272dce?.["videoUrl"], _0x272dce?.["url"], typeof _0x272dce === 'string' ? _0x272dce : '']["map"](normalizeLocalPath)["find"](Boolean) || '';
}
function cloneJson(_0x53f5e5) {
  return _0x53f5e5 && typeof _0x53f5e5 === "object" ? JSON['parse'](JSON['stringify'](_0x53f5e5)) : _0x53f5e5;
}
function createRequestId() {
  const _0x3655b4 = globalThis["crypto"]?.["randomUUID"]?.();
  return "replacement-video-request-" + (_0x3655b4 || Date['now']() + '-' + Math['round'](Math["random"]() * 0x186a0));
}
function normalizeStableRevisionValue(_0x2a5293) {
  if (Array["isArray"](_0x2a5293)) {
    return _0x2a5293['map'](normalizeStableRevisionValue);
  }
  if (_0x2a5293 && typeof _0x2a5293 === "object") {
    return Object["fromEntries"](Object['entries'](_0x2a5293)["sort"](([_0x55953a], [_0x5eb81c]) => _0x55953a["localeCompare"](_0x5eb81c))["map"](([_0x25568a, _0x5c742c]) => [_0x25568a, normalizeStableRevisionValue(_0x5c742c)]));
  }
  return _0x2a5293;
}
function normalizeSlotRevision(_0x5cd668 = {}) {
  return normalizeStableRevisionValue(Object['fromEntries'](Object['entries'](_0x5cd668 && typeof _0x5cd668 === "object" ? _0x5cd668 : {})["map"](([_0x579b88, _0x52d8ba]) => [_0x579b88, {
    'kind': normalizeText(_0x52d8ba?.["kind"]),
    'url': normalizeText(_0x52d8ba?.["url"]),
    'modelId': normalizeText(_0x52d8ba?.["modelId"])
  }])));
}
export function createPersonReplacementVideoGenerationRevision({
  project = {},
  shot = {},
  imageInput = resolvePersonReplacementVideoImageInput(project, shot)
} = {}) {
  return JSON["stringify"]({
    'projectId': normalizeText(project?.['id']),
    'shotId': normalizeText(shot?.['id']),
    'videoRef': normalizeText(shot?.["videoRef"]),
    'videoIterationReferenceRef': normalizeText(shot?.["videoIterationReferenceRef"]),
    'videoIterationInputRef': normalizeText(shot?.['videoIterationInputRef']),
    'videoPrompt': normalizeText(shot?.['videoPrompt']),
    'imageMode': normalizeText(imageInput?.["mode"]),
    'imageRef': normalizeText(imageInput?.["imageRef"]),
    'referenceKind': normalizeText(imageInput?.["referenceKind"]),
    'outputFps': Number(shot?.["outputFps"]) || 0x0,
    'subjectCount': imageInput?.['mode'] === PERSON_REPLACEMENT_VIDEO_INPUT_MODE_CHARACTER_REFERENCE ? 0x1 : (Array["isArray"](shot?.["people"]) ? shot["people"] : [])['filter'](_0x327f72 => normalizeText(_0x327f72?.["targetCharacterId"]))["length"],
    'slotEntries': normalizeSlotRevision(shot?.["replacementVideoInputsBySlot"])
  });
}
function resolveImageInputWarning(_0x1cb0d2 = {}) {
  if (_0x1cb0d2["mode"] === PERSON_REPLACEMENT_VIDEO_INPUT_MODE_CHARACTER_REFERENCE) {
    return normalizeText(_0x1cb0d2["message"]) || '请先在图像替换中为当前片段绑定一个人物参考图。';
  }
  return "请先生成对应的替换首帧。";
}
async function resumePersonReplacementVideoTask(_0x29b8ac, _0x184ed8, _0x5aaec6 = {}) {
  const _0x446173 = resolveModelExecution(_0x184ed8?.["model"]) || resolveModelExecution(_0x184ed8?.["model"], {
    'providerHint': _0x184ed8?.["provider"]
  });
  if (_0x446173?.["executionManifest"]?.["adapterType"] === 'workflow') {
    return resumeRunningHubVideoTask(_0x29b8ac, _0x184ed8, _0x5aaec6);
  }
  return resumeAsyncVideoTask(_0x29b8ac, _0x184ed8, _0x5aaec6);
}
async function cancelPersonReplacementVideoTask({
  taskId: _0x17d29c,
  providerProfileId = ''
} = {}) {
  const _0x25033d = await resolveRunningHubWorkflowAccess(providerProfileId);
  if (!_0x25033d["apiKey"]) {
    throw new Error('未配置\x20RunningHub\x20API\x20Key，无法取消远端任务');
  }
  return cancelRunningHubVideoTask({
    'apiKey': _0x25033d["apiKey"],
    'taskId': _0x17d29c,
    'providerProfileId': providerProfileId || _0x25033d['providerProfileId']
  });
}
export function createPersonReplacementVideoTaskRuntime({
  getProject: _0x1584bb,
  getProjectById = null,
  setProject: _0x2cfef4,
  setProjectById = null,
  runPreparation: _0x1df657,
  generateReplacementVideo: _0x3f3143,
  resumeReplacementVideo = resumePersonReplacementVideoTask,
  cancelReplacementVideo = cancelPersonReplacementVideoTask,
  resolveInstallId = async () => '',
  persistNow = async () => {},
  showToast = () => {},
  notifyGenerationCompleted = () => {},
  now = () => new Date()['toISOString'](),
  createId = createRequestId
} = {}) {
  if (typeof _0x1584bb !== "function" || typeof _0x2cfef4 !== 'function') {
    throw new Error("Person replacement video task runtime requires project access");
  }
  let _0x589466 = ![];
  let _0x42d8ae = null;
  let _0x3abb1f = '';
  const _0x49246f = [];
  const _0x333d4d = new Map();
  const _0x4c9170 = (_0x1a6d41 = '') => {
    const _0x1d7cad = normalizeText(_0x1a6d41);
    return _0x1d7cad && typeof getProjectById === "function" ? getProjectById(_0x1d7cad) : _0x1584bb();
  };
  const _0x3ce9b7 = _0x39c680 => typeof setProjectById === "function" ? setProjectById(_0x39c680?.['id'], _0x39c680, {
    'renderWorkspace': ![]
  }) : _0x2cfef4(_0x39c680, {
    'renderWorkspace': ![]
  });
  const _0x50add6 = ({
    shotId = '',
    videoRef = '',
    playbackVideoRef = '',
    posterRef = '',
    assetId = '',
    derivativeStatus = '',
    videoProxyStatus = '',
    fileName = '',
    createdAt = now(),
    expectedProjectId = '',
    expectedShotRevision = ''
  } = {}) => {
    if (_0x589466) {
      return null;
    }
    const _0x5a60b6 = _0x1584bb();
    const _0xe62c2e = normalizeText(shotId);
    const _0x337578 = normalizeText(videoRef);
    const _0x1cc34e = normalizeText(playbackVideoRef) || _0x337578;
    if (!normalizeText(expectedProjectId) || normalizeText(_0x5a60b6?.['id']) !== normalizeText(expectedProjectId)) {
      return null;
    }
    const _0x258253 = _0x5a60b6?.["shots"]?.['find'](_0xfecaa => normalizeText(_0xfecaa?.['id']) === _0xe62c2e);
    if (!_0x258253 || !_0x337578) {
      return null;
    }
    if (!normalizeText(expectedShotRevision) || createPersonReplacementVideoGenerationRevision({
      'project': _0x5a60b6,
      'shot': _0x258253
    }) !== normalizeText(expectedShotRevision)) {
      return null;
    }
    const _0x31c959 = appendPersonReplacementVideoResults(_0x258253, [{
      'videoUrl': _0x337578,
      'localPath': _0x337578,
      ...(_0x1cc34e !== _0x337578 ? {
        'displayLocalPath': _0x1cc34e
      } : {}),
      ...(normalizeText(posterRef) ? {
        'thumbnailUrl': normalizeText(posterRef),
        'posterLocalPath': normalizeText(posterRef)
      } : {}),
      ...(normalizeText(assetId) ? {
        'assetId': normalizeText(assetId)
      } : {}),
      ...(normalizeText(derivativeStatus) ? {
        'derivativeStatus': normalizeText(derivativeStatus)
      } : {}),
      ...(normalizeText(videoProxyStatus) ? {
        'videoProxyStatus': normalizeText(videoProxyStatus)
      } : {}),
      'source': "upload",
      'fileName': normalizeText(fileName) || '上传替换视频',
      'createdAt': createdAt
    }]);
    const _0x2d2dbf = resolvePersonReplacementVideoResultRef(_0x31c959['results'][_0x31c959["activeIndex"]]);
    return _0x3ce9b7(transitionPersonReplacementOutput({
      ..._0x5a60b6,
      'shots': _0x5a60b6["shots"]["map"](_0x585446 => normalizeText(_0x585446?.['id']) === _0xe62c2e ? {
        ..._0x585446,
        'replacementVideo': _0x31c959,
        'resultVideoRef': _0x2d2dbf,
        'generationStatus': "succeeded",
        'error': ''
      } : _0x585446),
      'workspace': {
        ..._0x5a60b6["workspace"],
        'selectedShotId': _0xe62c2e
      }
    }, {
      'type': PERSON_REPLACEMENT_OUTPUT_TRANSITIONS["INVALIDATE"]
    }));
  };
  const _0x43e446 = ({
    projectId: _0x1fd6db,
    shotId: _0x1ed4c5,
    requestId: _0x86f258,
    revision: _0x116cf1
  }, _0x3d6055 = {}, {
    persistIdentity = ![]
  } = {}) => {
    if (!_0x3fb701({
      'projectId': _0x1fd6db,
      'shotId': _0x1ed4c5,
      'requestId': _0x86f258,
      'revision': _0x116cf1
    })) {
      return ![];
    }
    const _0x38a809 = _0x4c9170(_0x1fd6db);
    const _0x26eb41 = _0x38a809["workspace"]?.["videoGenerationsByShotId"]?.[_0x1ed4c5] || {};
    const _0x421079 = {
      ..._0x26eb41,
      ..._0x3d6055,
      'shotId': _0x1ed4c5,
      'requestId': _0x86f258
    };
    const _0x5264cd = Object["keys"](_0x421079)["some"](_0x3575e4 => !Object['is'](_0x421079[_0x3575e4], _0x26eb41[_0x3575e4])) || Object["keys"](_0x26eb41)["some"](_0xad836c => !Object["hasOwn"](_0x421079, _0xad836c));
    if (!_0x5264cd) {
      return !![];
    }
    _0x3ce9b7({
      ..._0x38a809,
      'shots': _0x38a809["shots"]['map'](_0x98a1dc => _0x98a1dc['id'] === _0x1ed4c5 ? {
        ..._0x98a1dc,
        'generationStatus': _0x421079['status'] === "failed" ? "failed" : _0x421079["status"] === 'succeeded' ? 'succeeded' : "running",
        ...(_0x421079["status"] === 'failed' ? {
          'error': normalizeText(_0x421079["error"])
        } : {})
      } : _0x98a1dc),
      'workspace': updatePersonReplacementVideoGenerationState(_0x38a809["workspace"], _0x421079)
    });
    persistIdentity && normalizeText(_0x421079["taskId"]) && hasPersonReplacementGenerationTaskIdentityChanged(_0x26eb41, _0x421079) && void Promise["resolve"](persistNow())["catch"](() => {});
    return !![];
  };
  const _0x3fb701 = ({
    projectId: _0x41e964,
    shotId: _0x2f9fbc,
    requestId: _0x3d9053,
    revision: _0x44670b
  }) => {
    if (_0x589466) {
      return ![];
    }
    const _0x102b60 = _0x4c9170(_0x41e964);
    if (normalizeText(_0x102b60?.['id']) !== _0x41e964) {
      return ![];
    }
    const _0x3ccd51 = _0x102b60?.["shots"]?.["find"](_0x265227 => normalizeText(_0x265227?.['id']) === _0x2f9fbc);
    if (!_0x3ccd51) {
      return ![];
    }
    const _0x3d9d7a = _0x102b60["workspace"]?.["videoGenerationsByShotId"]?.[_0x2f9fbc];
    if (normalizeText(_0x3d9d7a?.["requestId"]) !== _0x3d9053) {
      return ![];
    }
    return createPersonReplacementVideoGenerationRevision({
      'project': _0x102b60,
      'shot': _0x3ccd51
    }) === _0x44670b;
  };
  const _0x5ef3c6 = ({
    projectId: _0x148afb,
    shotId: _0x5795a6,
    requestId: _0x4c0542
  }) => {
    if (_0x589466) {
      return ![];
    }
    const _0x4f9076 = _0x4c9170(_0x148afb);
    if (normalizeText(_0x4f9076?.['id']) !== _0x148afb) {
      return ![];
    }
    const _0x36796b = _0x4f9076["workspace"]?.["videoGenerationsByShotId"]?.[_0x5795a6];
    if (normalizeText(_0x36796b?.["requestId"]) !== _0x4c0542 || !['queued', "submitting", "running"]["includes"](normalizeText(_0x36796b?.["status"])["toLowerCase"]())) {
      return ![];
    }
    _0x3ce9b7({
      ..._0x4f9076,
      'shots': _0x4f9076["shots"]["map"](_0x1573cd => _0x1573cd['id'] === _0x5795a6 && _0x1573cd['generationStatus'] === 'running' ? {
        ..._0x1573cd,
        'generationStatus': 'pending'
      } : _0x1573cd),
      'workspace': updatePersonReplacementVideoGenerationState(_0x4f9076["workspace"], {
        'status': "idle",
        'shotId': _0x5795a6,
        'error': ''
      })
    });
    return !![];
  };
  const _0x968b08 = (_0x507289 = '') => ({
    'ok': ![],
    'stale': !![],
    'failures': [],
    'project': cloneJson(_0x4c9170(_0x507289))
  });
  const _0x5a9549 = () => {
    if (_0x42d8ae) {
      return _0x42d8ae;
    }
    _0x42d8ae = (async () => {
      while (_0x49246f["length"]) {
        const _0x1aec6d = _0x49246f["shift"]();
        _0x3abb1f = _0x1aec6d["projectId"];
        if (_0x589466 || !_0x4c9170(_0x1aec6d["projectId"])) {
          _0x1aec6d["resolve"](_0x968b08(_0x1aec6d["projectId"]));
          _0x3abb1f = '';
          continue;
        }
        try {
          const _0x7b0adc = typeof _0x1df657 === "function" ? await _0x1df657({
            'projectId': _0x1aec6d['projectId'],
            'shotIds': _0x1aec6d["prepareAll"] ? null : [..._0x1aec6d["shotIds"]],
            'notify': _0x1aec6d['notify'],
            'renderWorkspace': _0x1aec6d["renderWorkspace"]
          }) : {
            'ok': !![],
            'failures': [],
            'project': cloneJson(_0x4c9170(_0x1aec6d["projectId"]))
          };
          _0x1aec6d["resolve"](_0x589466 ? _0x968b08(_0x1aec6d["projectId"]) : _0x7b0adc);
        } catch (_0x3b2c27) {
          _0x1aec6d["reject"](_0x3b2c27);
        } finally {
          _0x3abb1f === _0x1aec6d["projectId"] && (_0x3abb1f = '');
        }
      }
    })()["finally"](() => {
      _0x42d8ae = null;
    });
    return _0x42d8ae;
  };
  const _0x4a6afc = (_0x557506 = {}) => {
    if (_0x589466) {
      return Promise['resolve'](_0x968b08(_0x557506?.["projectId"]));
    }
    const _0x10db0d = normalizeText(_0x557506?.['projectId'] || _0x1584bb()?.['id']);
    const _0x30d979 = Array["isArray"](_0x557506?.["shotIds"]) ? _0x557506["shotIds"]["map"](normalizeText)["filter"](Boolean) : [];
    const _0x5b7cb7 = _0x49246f['at'](-0x1);
    if (_0x5b7cb7 && _0x5b7cb7['projectId'] === _0x10db0d) {
      if (!_0x30d979["length"]) {
        _0x5b7cb7["prepareAll"] = !![];
      }
      _0x30d979["forEach"](_0xa76a54 => _0x5b7cb7["shotIds"]["add"](_0xa76a54));
      _0x5b7cb7["notify"] = _0x5b7cb7["notify"] || _0x557506?.["notify"] !== ![];
      _0x5b7cb7['renderWorkspace'] = _0x5b7cb7["renderWorkspace"] || _0x557506?.["renderWorkspace"] !== ![];
      const _0x4396ff = new Promise((_0x469027, _0x477a0f) => {
        _0x5b7cb7['listeners']['push']({
          'resolve': _0x469027,
          'reject': _0x477a0f
        });
      });
      _0x5a9549();
      return _0x4396ff;
    }
    let _0x37c244;
    let _0x40704b;
    const _0x195acb = new Promise((_0x5d6b5b, _0x53fa63) => {
      _0x37c244 = _0x5d6b5b;
      _0x40704b = _0x53fa63;
    });
    const _0x4690f7 = {
      'projectId': _0x10db0d,
      'prepareAll': !_0x30d979['length'],
      'shotIds': new Set(_0x30d979),
      'notify': _0x557506?.["notify"] !== ![],
      'renderWorkspace': _0x557506?.["renderWorkspace"] !== ![],
      'listeners': [],
      'resolve'(_0x44f571) {
        _0x37c244(_0x44f571);
        this["listeners"]["forEach"](_0x282b64 => _0x282b64["resolve"](_0x44f571));
      },
      'reject'(_0x52d9b0) {
        _0x40704b(_0x52d9b0);
        this["listeners"]["forEach"](_0xab88d2 => _0xab88d2["reject"](_0x52d9b0));
      }
    };
    _0x49246f["push"](_0x4690f7);
    _0x5a9549();
    return _0x195acb;
  };
  const _0x2045e1 = async ({
    projectId: _0x14c3ea = '',
    shotId: _0x18f450,
    notifyCompletion = !![],
    recoveryTask = null
  } = {}) => {
    const _0x407bfc = normalizeText(_0x18f450);
    let _0x191e36 = _0x4c9170(_0x14c3ea);
    let _0x4cffc0 = _0x191e36?.["shots"]?.['find'](_0x2f7ede => normalizeText(_0x2f7ede?.['id']) === _0x407bfc);
    if (!_0x4cffc0 || _0x589466) {
      return null;
    }
    const _0x10191d = getRecoverablePersonReplacementVideoTask(_0x191e36["workspace"]?.['videoGenerationsByShotId']?.[_0x407bfc]);
    const _0x871212 = recoveryTask ? {
      ..._0x10191d,
      ...recoveryTask
    } : null;
    if (!_0x871212 && _0x10191d) {
      return null;
    }
    let _0x3cea0c = resolvePersonReplacementVideoImageInput(_0x191e36, _0x4cffc0);
    if (_0x3cea0c['status'] !== 'ready') {
      showToast(resolveImageInputWarning(_0x3cea0c), "warn");
      return null;
    }
    let _0x2ea95d = resolvePersonReplacementVideoSlotState(_0x191e36, _0x4cffc0);
    if (!_0x2ea95d['slotEntries']["sourceVideo"]?.["url"]) {
      const _0x593d2a = await _0x4a6afc({
        'projectId': _0x191e36?.['id'],
        'shotIds': [_0x407bfc]
      });
      if (_0x593d2a?.["stale"] || _0x589466) {
        return {
          'ok': ![],
          'stale': !![],
          'shotId': _0x407bfc
        };
      }
      _0x191e36 = _0x4c9170(_0x191e36?.['id']);
      _0x4cffc0 = _0x191e36?.["shots"]?.["find"](_0x34ab71 => normalizeText(_0x34ab71?.['id']) === _0x407bfc);
      _0x2ea95d = resolvePersonReplacementVideoSlotState(_0x191e36, _0x4cffc0);
    }
    if (!_0x2ea95d["slotEntries"]['sourceVideo']?.['url']) {
      showToast(_0x4cffc0?.['error'] || "对应镜头尚未完成切片。", "warn");
      return null;
    }
    _0x3cea0c = resolvePersonReplacementVideoImageInput(_0x191e36, _0x4cffc0);
    if (_0x3cea0c["status"] !== 'ready') {
      showToast(_0x3cea0c["message"] || "当前图片入参不可用。", "warn");
      return null;
    }
    if (_0x871212 ? typeof resumeReplacementVideo !== "function" : typeof _0x3f3143 !== 'function') {
      showToast("视频生成服务尚未初始化。", "error");
      return null;
    }
    const _0x17217c = normalizeText(_0x191e36?.['id']);
    const _0x272bdf = _0x17217c + ":video:" + _0x407bfc;
    if (_0x333d4d["has"](_0x272bdf)) {
      return null;
    }
    const _0x31371d = normalizeText(_0x871212?.["requestId"]) || normalizeText(createId());
    const _0x3e91f8 = createPersonReplacementVideoGenerationRevision({
      'project': _0x191e36,
      'shot': _0x4cffc0,
      'imageInput': _0x3cea0c
    });
    const _0x3e00b5 = normalizeText(_0x871212?.["modelId"]) || _0x191e36["settings"]["replacementModelId"] || PERSON_REPLACEMENT_DEFAULT_VIDEO_MODEL_ID;
    const _0x5953c0 = resolveModelExecution(_0x3e00b5) || resolveModelExecution(_0x3e00b5, {
      'providerHint': _0x871212?.["provider"]
    });
    const _0x250605 = normalizeText(_0x871212?.["provider"]) || normalizeText(_0x5953c0?.["modelManifest"]?.['provider']) || resolveModelProvider(_0x3e00b5);
    const _0x34bacf = normalizeText(_0x871212?.["providerProfileId"]) || normalizeText(_0x191e36['settings']['replacementVideoProviderProfileId']);
    const _0x34eea4 = normalizeText(_0x871212?.["executionId"]) || normalizeText(_0x5953c0?.['executionManifest']?.['id']);
    const _0x13365b = Number(_0x871212?.["startedAt"]) || Date["now"]();
    const _0x113407 = new AbortController();
    const _0x542810 = {
      'projectId': _0x17217c,
      'shotId': _0x407bfc,
      'requestId': _0x31371d,
      'revision': _0x3e91f8,
      'abortController': _0x113407,
      'taskId': normalizeText(_0x871212?.["taskId"])
    };
    _0x333d4d['set'](_0x272bdf, _0x542810);
    _0x3ce9b7({
      ..._0x191e36,
      'workspace': updatePersonReplacementVideoGenerationState(_0x191e36["workspace"], {
        'status': _0x871212 ? "running" : "submitting",
        'shotId': _0x407bfc,
        'requestId': _0x31371d,
        'taskId': normalizeText(_0x871212?.["taskId"]),
        'modelId': _0x3e00b5,
        'provider': _0x250605,
        'providerProfileId': _0x34bacf,
        'executionId': _0x34eea4,
        'startedAt': _0x13365b,
        'useOpenapiQuery': _0x871212?.["useOpenapiQuery"] === !![],
        'error': ''
      }),
      'shots': _0x191e36['shots']["map"](_0x5d343f => _0x5d343f['id'] === _0x407bfc ? {
        ..._0x5d343f,
        'generationStatus': 'running'
      } : _0x5d343f)
    });
    try {
      const _0x434857 = await resolveInstallId(_0x3e00b5);
      if (!_0x3fb701({
        'projectId': _0x17217c,
        'shotId': _0x407bfc,
        'requestId': _0x31371d,
        'revision': _0x3e91f8
      })) {
        _0x5ef3c6({
          'projectId': _0x17217c,
          'shotId': _0x407bfc,
          'requestId': _0x31371d
        });
        return {
          'ok': ![],
          'stale': !![],
          'shotId': _0x407bfc
        };
      }
      const _0x5ead05 = buildPersonReplacementVideoRequest({
        'currentProject': _0x191e36,
        'shot': _0x4cffc0,
        'modelId': _0x3e00b5,
        'provider': _0x250605,
        'providerProfileId': _0x34bacf,
        'resolvedExecution': _0x5953c0,
        'installId': _0x434857,
        'imageInput': _0x3cea0c,
        'slotState': _0x2ea95d
      });
      const _0x5da454 = (_0x1771f7, _0xc51e54 = {}) => {
        const _0x822b5 = _0x4c9170(_0x17217c)?.["workspace"]?.["videoGenerationsByShotId"]?.[_0x407bfc] || {};
        const _0x1a6581 = projectPersonReplacementGenerationTaskIdentity({
          'taskId': _0x1771f7,
          'meta': _0xc51e54,
          'defaults': {
            'modelId': _0x3e00b5,
            'provider': _0x250605,
            'providerProfileId': _0x34bacf,
            'executionId': _0x34eea4,
            'startedAt': _0x13365b,
            ..._0x822b5
          }
        });
        if (!_0x1a6581['taskId']) {
          return;
        }
        _0x542810['taskId'] = _0x1a6581["taskId"];
        _0x43e446(_0x542810, {
          'status': 'running',
          ..._0x1a6581,
          'error': ''
        }, {
          'persistIdentity': !![]
        });
      };
      const _0x21187a = {
        'signal': _0x113407["signal"],
        'useOpenapiQuery': _0x871212?.["useOpenapiQuery"] === !![],
        'onTaskId': _0x26ee0a => _0x5da454(_0x26ee0a),
        'onTaskMeta': (_0x5660d2 = {}) => _0x5da454(_0x5660d2["taskId"], _0x5660d2),
        'onRunningHubWorkflowQueueChange': (_0x5b59e7 = {}) => {
          const _0x2f0e12 = normalizeText(_0x5b59e7['status'])['toLowerCase']() === 'queued' ? 'queued' : "running";
          _0x43e446(_0x542810, {
            'status': _0x2f0e12,
            'error': ''
          });
        }
      };
      const _0x9ca10 = _0x871212 ? await resumeReplacementVideo(_0x871212["taskId"], _0x5ead05, _0x21187a) : await _0x3f3143(_0x5ead05, _0x21187a);
      if (!_0x3fb701({
        'projectId': _0x17217c,
        'shotId': _0x407bfc,
        'requestId': _0x31371d,
        'revision': _0x3e91f8
      })) {
        _0x5ef3c6({
          'projectId': _0x17217c,
          'shotId': _0x407bfc,
          'requestId': _0x31371d
        });
        return {
          'ok': ![],
          'stale': !![],
          'shotId': _0x407bfc
        };
      }
      const _0x335d5e = now();
      const _0x412a8f = getSuccessfulVideoGenerationItems(_0x9ca10);
      const _0x561264 = _0x412a8f['map'](_0x240cb1 => ({
        ..._0x240cb1,
        'localPath': resolveLocalVideoResultRef(_0x240cb1),
        'createdAt': normalizeText(_0x240cb1?.["createdAt"]) || _0x335d5e
      }))["filter"](_0x567491 => _0x567491["localPath"]);
      if (!_0x561264["length"]) {
        throw new Error(_0x412a8f["map"](_0x451b9a => normalizeText(_0x451b9a?.["localSaveError"] || _0x451b9a?.["saveError"]))["find"](Boolean) || getVideoGenerationResultError(_0x9ca10) || "视频生成结果缺少可用地址");
      }
      const _0x539494 = _0x4c9170(_0x17217c);
      const _0x8d0008 = _0x539494["shots"]['find'](_0x2c2108 => _0x2c2108['id'] === _0x407bfc);
      const _0x5540da = appendPersonReplacementVideoResults(_0x8d0008, _0x561264);
      const _0x184cf8 = resolvePersonReplacementVideoResultRef(_0x5540da["results"][_0x5540da["activeIndex"]]);
      const _0x4f3d21 = {
        ..._0x539494,
        'shots': _0x539494["shots"]["map"](_0x4ba963 => _0x4ba963['id'] === _0x407bfc ? {
          ..._0x4ba963,
          'replacementVideo': _0x5540da,
          'resultVideoRef': _0x184cf8,
          'generationStatus': "succeeded",
          'error': ''
        } : _0x4ba963),
        'workspace': updatePersonReplacementVideoGenerationState(_0x539494['workspace'], {
          'status': "succeeded",
          'shotId': _0x407bfc,
          'requestId': _0x31371d,
          'error': ''
        })
      };
      _0x3ce9b7(transitionPersonReplacementOutput(_0x4f3d21, {
        'type': PERSON_REPLACEMENT_OUTPUT_TRANSITIONS["INVALIDATE"]
      }));
      let _0x1bc56d = !![];
      try {
        await persistNow();
      } catch {
        _0x1bc56d = ![];
      }
      if (!_0x3fb701({
        'projectId': _0x17217c,
        'shotId': _0x407bfc,
        'requestId': _0x31371d,
        'revision': _0x3e91f8
      })) {
        _0x5ef3c6({
          'projectId': _0x17217c,
          'shotId': _0x407bfc,
          'requestId': _0x31371d
        });
        return {
          'ok': ![],
          'stale': !![],
          'shotId': _0x407bfc
        };
      }
      (!_0x1bc56d || notifyCompletion === ![]) && showToast(_0x1bc56d ? '视频替换已生成。' : '视频替换已生成，项目数据正在重试保存，请暂时不要刷新。', _0x1bc56d ? "success" : "warn");
      notifyCompletion !== ![] && notifyGenerationCompleted({
        'kind': "video",
        'mediaRef': _0x184cf8,
        'projectId': _0x17217c
      });
      return {
        'project': cloneJson(_0x4c9170(_0x17217c)),
        'ok': !![],
        'shotId': _0x407bfc
      };
    } catch (_0x4b4c00) {
      if (!_0x3fb701({
        'projectId': _0x17217c,
        'shotId': _0x407bfc,
        'requestId': _0x31371d,
        'revision': _0x3e91f8
      })) {
        _0x5ef3c6({
          'projectId': _0x17217c,
          'shotId': _0x407bfc,
          'requestId': _0x31371d
        });
        return {
          'ok': ![],
          'stale': !![],
          'shotId': _0x407bfc
        };
      }
      const _0x5dc4e6 = _0x4b4c00?.["getUserMessage"]?.() || _0x4b4c00?.["message"] || '视频替换生成失败';
      const _0x494c9d = _0x4c9170(_0x17217c);
      const _0x352d85 = _0x3ce9b7({
        ..._0x494c9d,
        'shots': _0x494c9d["shots"]['map'](_0x185d4d => _0x185d4d['id'] === _0x407bfc ? {
          ..._0x185d4d,
          'generationStatus': "failed",
          'error': _0x5dc4e6
        } : _0x185d4d),
        'workspace': updatePersonReplacementVideoGenerationState(_0x494c9d["workspace"], {
          'status': "failed",
          'shotId': _0x407bfc,
          'requestId': _0x31371d,
          'error': _0x5dc4e6
        })
      });
      showToast(_0x5dc4e6, "error");
      return {
        'project': cloneJson(_0x352d85),
        'ok': ![],
        'shotId': _0x407bfc,
        'error': _0x5dc4e6
      };
    } finally {
      _0x333d4d["get"](_0x272bdf)?.["requestId"] === _0x31371d && _0x333d4d["delete"](_0x272bdf);
    }
  };
  const _0xe0c9bc = async ({
    projectId: _0x1905f9 = '',
    shotId: _0x25006e,
    notifyCompletion = !![]
  } = {}) => {
    const _0x54eb40 = normalizeText(_0x25006e);
    const _0x4569a7 = _0x4c9170(_0x1905f9);
    const _0x314cd2 = getRecoverablePersonReplacementVideoTask(_0x4569a7?.['workspace']?.["videoGenerationsByShotId"]?.[_0x54eb40]);
    if (!_0x314cd2 || _0x589466) {
      return null;
    }
    return _0x2045e1({
      'projectId': _0x4569a7?.['id'],
      'shotId': _0x54eb40,
      'notifyCompletion': notifyCompletion,
      'recoveryTask': _0x314cd2
    });
  };
  const _0xe81caa = async ({
    projectId: _0x49c446 = '',
    shotId: _0x559d39
  } = {}) => {
    const _0x54e87b = normalizeText(_0x559d39);
    const _0x38208c = _0x4c9170(_0x49c446);
    const _0x475d48 = _0x38208c?.["shots"]?.["find"](_0x417b1e => normalizeText(_0x417b1e?.['id']) === _0x54e87b);
    const _0x1091aa = resolvePersonReplacementVideoGenerationState(_0x38208c?.["workspace"], _0x54e87b);
    if (!_0x475d48 || _0x589466 || !isPersonReplacementVideoGenerationActive(_0x1091aa)) {
      return null;
    }
    const _0x53eec5 = normalizeText(_0x38208c['id']) + ':video:' + _0x54e87b;
    const _0x4bae42 = _0x333d4d['get'](_0x53eec5);
    const _0x26e295 = normalizeText(_0x1091aa["requestId"]);
    const _0x480961 = _0x4bae42 && (!_0x26e295 || normalizeText(_0x4bae42["requestId"]) === _0x26e295) ? _0x4bae42 : null;
    const _0x6cc0b9 = normalizeText(_0x1091aa['taskId'] || _0x480961?.['taskId']);
    const _0x3c4486 = normalizeText(_0x1091aa["providerProfileId"] || _0x38208c["settings"]?.["replacementVideoProviderProfileId"]);
    const _0x3c909a = Boolean(normalizeText(_0x475d48["resultVideoRef"]) || Array["isArray"](_0x475d48["replacementVideo"]?.['results']) && _0x475d48["replacementVideo"]['results']["length"]);
    _0x3ce9b7({
      ..._0x38208c,
      'shots': _0x38208c["shots"]["map"](_0x313a30 => _0x313a30['id'] === _0x54e87b ? {
        ..._0x313a30,
        'generationStatus': _0x3c909a ? 'succeeded' : "pending",
        'error': ''
      } : _0x313a30),
      'workspace': updatePersonReplacementVideoGenerationState(_0x38208c["workspace"], {
        'status': "idle",
        'shotId': _0x54e87b,
        'error': ''
      })
    });
    _0x480961 && (_0x333d4d["delete"](_0x53eec5), _0x480961["abortController"]?.["abort"]?.());
    let _0x56cab8 = !_0x6cc0b9;
    if (_0x6cc0b9 && typeof cancelReplacementVideo === "function") {
      try {
        await cancelReplacementVideo({
          'taskId': _0x6cc0b9,
          'providerProfileId': _0x3c4486,
          'modelId': normalizeText(_0x1091aa['modelId']),
          'provider': normalizeText(_0x1091aa["provider"])
        });
        _0x56cab8 = !![];
      } catch (_0x778aa4) {
        const _0x5b29f2 = normalizeText(_0x778aa4?.["getUserMessage"]?.() || _0x778aa4?.["message"]) || "RunningHub 远端任务取消失败";
        showToast("已停止本地等待，但" + _0x5b29f2, "warn");
      }
    }
    if (_0x56cab8) {
      showToast("视频替换已取消。", 'info');
    }
    return {
      'ok': !![],
      'shotId': _0x54e87b,
      'taskId': _0x6cc0b9,
      'remoteCancelled': _0x56cab8
    };
  };
  const _0x1e41b5 = async () => {
    if (_0x589466) {
      return [];
    }
    const _0x438272 = _0x1584bb();
    const _0x196901 = normalizeText(_0x438272?.['id']);
    const _0x39d18b = Object["entries"](_0x438272?.['workspace']?.["videoGenerationsByShotId"] || {})["flatMap"](([_0x16bec1, _0x32ec6f]) => getRecoverablePersonReplacementVideoTask(_0x32ec6f) ? [normalizeText(_0x16bec1)] : []);
    const _0x567acc = await Promise["allSettled"](_0x39d18b['map'](_0x191e9c => _0xe0c9bc({
      'shotId': _0x191e9c
    })));
    if (_0x589466 || !_0x4c9170(_0x196901)) {
      return [];
    }
    return _0x567acc;
  };
  return {
    'acceptUploadedResult': _0x50add6,
    'prepare': _0x4a6afc,
    'generate': _0x2045e1,
    'cancel': _0xe81caa,
    'resume': _0xe0c9bc,
    'resumeRecoverable': _0x1e41b5,
    'hasActiveTasks': () => Boolean(_0x42d8ae || _0x49246f["length"] || _0x333d4d["size"]),
    'getActiveGenerationCount': () => _0x333d4d["size"],
    'hasActiveTasksForProject': _0x5b3bf0 => {
      const _0x529594 = normalizeText(_0x5b3bf0);
      if (!_0x529594) {
        return ![];
      }
      return _0x49246f["some"](_0x54dd0f => _0x54dd0f["projectId"] === _0x529594) || _0x3abb1f === _0x529594 || [..._0x333d4d["values"]()]['some'](_0x16bd66 => _0x16bd66['projectId'] === _0x529594);
    },
    'destroy': () => {
      if (_0x589466) {
        return;
      }
      _0x333d4d["forEach"](_0x4878a0 => {
        _0x4878a0["abortController"]?.['abort']?.();
        !normalizeText(_0x4878a0["taskId"]) && _0x5ef3c6(_0x4878a0);
      });
      _0x333d4d["clear"]();
      _0x49246f["splice"](0x0)['forEach'](_0x48f382 => {
        _0x48f382['resolve'](_0x968b08());
      });
      _0x589466 = !![];
    }
  };
}