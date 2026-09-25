import { finishStoryBackgroundTask, startStoryBackgroundTask, updateStoryBackgroundTask, updateStoryBackgroundTaskBatch } from './storyBackgroundTasks.js';
import { deriveStoryProjectTaskState, reconcileStoryClipVideoBackgroundTasks } from './storyProjectTaskState.js';
import { advanceStoryProjectSession, createStoryProjectTaskToken, isStoryProjectTaskTokenCurrent, isStoryProjectTaskTokenLive } from './storyProjectTaskToken.js';
import { isStoryAssetVoiceLoading } from './storyAssetGenerationState.js';
import { reportStoryTaskCenter } from './storyTaskCenterProjection.js';
import { getProviderConfig } from '../../../api/configApi.js';
function normalizeText(_0x38d0eb) {
  return String(_0x38d0eb || '')["trim"]();
}
function cloneData(_0x31194e) {
  return JSON["parse"](JSON['stringify'](_0x31194e));
}
export function createStoryProjectTaskWorkspaceController({
  state: _0xd57a40,
  activeClipGenerationControllers: _0x289e85,
  activeBackgroundExecutions: _0x3bb59f,
  activeBackgroundRecoveries: _0x314b4b,
  replicationAnalysisPromises: _0x57d11e,
  replicationSourceFileByEpisodeKey: _0x297834,
  projectData: _0x3c7ab9,
  getWorkspaceDestroyed = () => ![],
  stopAssetBreakdownProgress = () => {},
  schedulePersistence = () => {},
  render = () => {}
} = {}) {
  if (!_0xd57a40 || typeof _0xd57a40 !== "object") {
    throw new TypeError("Story project tasks require workspace state.");
  }
  for (const [_0x44ae86, _0x3ed2da] of Object["entries"]({
    'activeClipGenerationControllers': _0x289e85,
    'activeBackgroundExecutions': _0x3bb59f,
    'activeBackgroundRecoveries': _0x314b4b,
    'replicationAnalysisPromises': _0x57d11e,
    'replicationSourceFileByEpisodeKey': _0x297834,
    'projectData': _0x3c7ab9
  })) {
    if (!_0x3ed2da || typeof _0x3ed2da !== "object") {
      throw new TypeError('Story\x20project\x20tasks\x20require\x20' + _0x44ae86 + '.');
    }
  }
  let _0x13a199 = 0x0;
  const _0x5e91e8 = () => getWorkspaceDestroyed() === !![];
  const _0x228611 = () => {
    Object['assign'](_0xd57a40, deriveStoryProjectTaskState());
    _0xd57a40['exportingAssetAppearanceKey'] = '';
  };
  const _0x445117 = (_0x1ba571 = _0xd57a40["data"]) => {
    reconcileStoryClipVideoBackgroundTasks(_0x1ba571);
    reportStoryTaskCenter(_0x1ba571);
    _0x228611();
    Object["assign"](_0xd57a40, deriveStoryProjectTaskState(_0x1ba571));
    _0xd57a40["characterVoiceEditor"] && (_0xd57a40["characterVoiceEditor"]["isGenerating"] = isStoryAssetVoiceLoading(_0xd57a40, _0xd57a40["characterVoiceEditor"]["assetId"]));
  };
  const _0x5c0263 = _0x2636d7 => {
    const _0x7b2e8 = normalizeText(_0x2636d7);
    if (!_0x7b2e8) {
      return ![];
    }
    for (const [_0x20a2ad, _0x17e5c4] of _0x289e85) {
      if (!_0x20a2ad["startsWith"](_0x7b2e8 + ':')) {
        continue;
      }
      _0x17e5c4["pause"]();
      _0x289e85['delete'](_0x20a2ad);
    }
    for (const _0x35ecb5 of _0x3bb59f) {
      _0x35ecb5["startsWith"](_0x7b2e8 + ':') && _0x3bb59f['delete'](_0x35ecb5);
    }
    for (const _0x491041 of _0x314b4b) {
      _0x491041["startsWith"](_0x7b2e8 + ':') && _0x314b4b["delete"](_0x491041);
    }
    _0x57d11e["delete"](_0x7b2e8);
    for (const _0x470065 of _0x297834['keys']()) {
      _0x470065["startsWith"](_0x7b2e8 + ':') && _0x297834["delete"](_0x470065);
    }
    _0x3c7ab9["releaseData"](_0x7b2e8);
    advanceStoryProjectSession(_0xd57a40, _0x7b2e8);
    return !![];
  };
  const _0x4bf76b = ({
    invalidateCurrentProject = ![]
  } = {}) => {
    const _0x16d650 = normalizeText(_0xd57a40["data"]?.["project"]?.['id']);
    if (invalidateCurrentProject) {
      _0x5c0263(_0x16d650);
    }
    stopAssetBreakdownProgress({
      'clearState': !![]
    });
    _0x228611();
    return createStoryProjectTaskToken(_0xd57a40);
  };
  const _0x1cf399 = (_0x3d05d0 = _0xd57a40["data"]) => {
    const _0x1e075b = _0x3c7ab9["getEntry"](_0x3d05d0?.["project"]?.['id']);
    const _0x5bf322 = createStoryProjectTaskToken({
      ..._0xd57a40,
      'data': _0x3d05d0
    });
    _0x5bf322["projectTitleEdited"] = _0x3d05d0 === _0xd57a40["data"] ? _0xd57a40["projectTitleEdited"] === !![] : _0x1e075b?.["projectTitleEdited"] === !![];
    return _0x5bf322;
  };
  const _0x28d86a = _0x45dfd8 => isStoryProjectTaskTokenCurrent(_0xd57a40, _0x45dfd8) && !_0x5e91e8();
  const _0x5d1566 = _0x291153 => isStoryProjectTaskTokenLive(_0xd57a40, _0x291153) && !_0x5e91e8();
  const _0x501786 = _0x2e7279 => _0x5d1566(_0x2e7279) && _0x3c7ab9["registerTaskData"](_0x2e7279);
  const _0x2dbc48 = (_0x146a5c, _0x1acbcd) => {
    const _0x4e4005 = normalizeText(_0x146a5c?.["projectId"]);
    const _0x59bac5 = normalizeText(_0x1acbcd);
    return _0x4e4005 && _0x59bac5 ? _0x4e4005 + ':' + _0x59bac5 : '';
  };
  const _0x6e6ced = _0x118f3a => _0x5d1566(_0x118f3a) && _0x3c7ab9['syncTaskEntry'](_0x118f3a);
  const _0x1082e5 = (_0x2fdf90, {
    refreshHome = ![]
  } = {}) => {
    _0x6e6ced(_0x2fdf90);
    reportStoryTaskCenter(_0x2fdf90?.["data"]);
    schedulePersistence({
      'immediate': !![]
    });
    refreshHome && _0xd57a40["view"] === "home" && !_0x5e91e8() && render({
      'capturePageState': ![]
    });
  };
  const _0x4b8c53 = (_0x4bc397, _0x3dc77f = {}, {
    refreshHome = !![]
  } = {}) => {
    if (!_0x4bc397?.['data']?.["project"]) {
      return null;
    }
    _0x501786(_0x4bc397);
    const _0x1e2116 = startStoryBackgroundTask(_0x4bc397['data'], {
      ..._0x3dc77f,
      'providerProfileId': _0x3dc77f['providerProfileId'] || (_0x3dc77f["provider"] ? getProviderConfig(_0x3dc77f["provider"])?.['providerProfileId'] : '')
    });
    const _0x5b5869 = _0x2dbc48(_0x4bc397, _0x1e2116?.['id'] || _0x3dc77f['id']);
    if (_0x5b5869) {
      _0x3bb59f["add"](_0x5b5869);
    }
    _0x1082e5(_0x4bc397, {
      'refreshHome': refreshHome
    });
    return _0x1e2116;
  };
  const _0x37907c = (_0x2a5d55, _0x37b064, _0x706aff = {}, {
    refreshHome = !![]
  } = {}) => {
    if (!_0x2a5d55?.["data"]?.["project"]) {
      return null;
    }
    const _0x2df7bf = updateStoryBackgroundTask(_0x2a5d55["data"], _0x37b064, _0x706aff);
    if (_0x2df7bf) {
      _0x1082e5(_0x2a5d55, {
        'refreshHome': refreshHome
      });
    }
    return _0x2df7bf;
  };
  const _0x37aab8 = (_0x25cdd2, _0x49d138, _0x495a2 = {}) => {
    if (!_0x25cdd2?.["data"]?.["project"]) {
      return 0x0;
    }
    const _0x155ec7 = updateStoryBackgroundTaskBatch(_0x25cdd2['data'], _0x49d138, _0x495a2);
    if (_0x155ec7) {
      _0x1082e5(_0x25cdd2, {
        'refreshHome': !![]
      });
    }
    return _0x155ec7;
  };
  const _0x26b7b9 = (_0x30a275, _0x45c8cc = {}) => {
    const _0x569b51 = normalizeText(_0xd57a40["data"]?.['project']?.['id']) || 'project';
    _0x13a199 += 0x1;
    return {
      ...cloneData(_0x45c8cc),
      'id': (normalizeText(_0x30a275) || 'batch') + ':' + _0x569b51 + ':' + Date['now']() + ':' + _0x13a199,
      'type': normalizeText(_0x30a275) || "batch",
      'total': Math["max"](0x0, Math['trunc'](Number(_0x45c8cc["total"]) || 0x0)),
      'completed': Math['max'](0x0, Math["trunc"](Number(_0x45c8cc['completed']) || 0x0)),
      'label': normalizeText(_0x45c8cc["label"])
    };
  };
  const _0x691120 = (_0x3727db, _0x2ed000, _0x5b3639 = {}) => {
    if (!_0x2ed000?.['id']) {
      return null;
    }
    Object['assign'](_0x2ed000, cloneData(_0x5b3639));
    _0x37aab8(_0x3727db, _0x2ed000['id'], _0x2ed000);
    return _0x2ed000;
  };
  const _0x3ed8e7 = (_0x28197b, _0x1dfcda, _0x11a2bb = {}, {
    refreshHome = !![]
  } = {}) => {
    if (!_0x28197b?.["data"]?.["project"]) {
      return null;
    }
    const _0xd71b80 = finishStoryBackgroundTask(_0x28197b["data"], _0x1dfcda, _0x11a2bb);
    if (_0xd71b80) {
      _0x1082e5(_0x28197b, {
        'refreshHome': refreshHome
      });
    }
    const _0x4974bd = _0x2dbc48(_0x28197b, _0x1dfcda);
    if (_0x4974bd) {
      _0x3bb59f["delete"](_0x4974bd);
    }
    return _0xd71b80;
  };
  return Object['freeze']({
    'advanceProjectSession': advanceStoryProjectSession,
    'beginSession': _0x4bf76b,
    'createProjectToken': createStoryProjectTaskToken,
    'createTaskBatch': _0x26b7b9,
    'createTokenForData': _0x1cf399,
    'finishBackgroundTask': _0x3ed8e7,
    'getBackgroundExecutionKey': _0x2dbc48,
    'invalidateRuntime': _0x5c0263,
    'isCurrent': _0x28d86a,
    'isLive': _0x5d1566,
    'persistChange': _0x1082e5,
    'registerProjectData': _0x501786,
    'resetTaskState': _0x228611,
    'restoreTaskState': _0x445117,
    'startBackgroundTask': _0x4b8c53,
    'syncProjectEntry': _0x6e6ced,
    'syncTaskBatch': _0x691120,
    'updateBackgroundTask': _0x37907c,
    'updateBackgroundTaskBatch': _0x37aab8
  });
}