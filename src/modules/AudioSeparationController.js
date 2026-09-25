import { resumeAudioSeparationTask, runAudioSeparation } from '../../api/aiAudioApi.js';
import { resolveRunningHubWorkflowAccess } from '../../api/configApi.js';
import { cancelRunningHubTask } from '../../api/runninghubTaskApi.js';
import { t } from '../i18n/index.js';
import { normalizeRunningHubInstanceType } from './runningHubInstanceTypes.js';
import { buildGenerationStartPatch } from '../core/generationTaskLifecycle.js';
import { buildRunningHubOpenapiTaskPatch } from '../core/generationTaskProtocolState.js';
import { findAvailablePosition, generateId } from '../core/math.js';
import a941_0x94f236 from '../core/stores/appStore.js';
import { buildCanvasLocalAudioFields, resolveCanvasAudioUrl } from '../services/canvasMediaLocalService.js';
import { buildSourceAudioNodePayload, getNodeDefaultSize } from '../services/fileService.js';
import { saveRemoteAudioLocallyDetailed } from '../services/projectService.js';
import { normalizeLocalPath, pickResultLocalPath } from '../utils/localMediaPath.js';
import { RH_AUDIO_SEPARATION_MODEL_ID, resolveModelExecution } from '../manifests/index.js';
import { buildLocalAudioGenerationResultPatch } from '../components/audio-node/audioGenerationResultRenderer.js';
import { getNodeSpawnPrefs } from './nodeSpawn.js';
const AUDIO_SPLIT_MODEL_ID = RH_AUDIO_SEPARATION_MODEL_ID;
const AUDIO_SPLIT_ROLE_VOCALS = "vocals";
const AUDIO_SPLIT_ROLE_BACKGROUND = "background";
function _resolveAudioSplitModelId() {
  const _0x1afaf2 = resolveModelExecution(AUDIO_SPLIT_MODEL_ID);
  const _0x29d75b = String(_0x1afaf2?.["modelManifest"]?.["modelId"] || '')["trim"]();
  if (!_0x29d75b) {
    throw new Error("RunningHub audio workflow manifest missing: " + AUDIO_SPLIT_MODEL_ID);
  }
  return _0x29d75b;
}
const AUDIO_SPLIT_MODEL = _resolveAudioSplitModelId();
let _runAudioSeparationImpl = runAudioSeparation;
let _resumeAudioSeparationTaskImpl = resumeAudioSeparationTask;
let _saveRemoteAudioLocallyDetailedImpl = saveRemoteAudioLocallyDetailed;
const _runtimeByLeaderId = new Map();
function audioSeparationText(_0x239624, _0x531b2b = {}) {
  return t("mediaProcessing.audioSeparation." + _0x239624, _0x531b2b);
}
function _getState() {
  return typeof a941_0x94f236["getStateRaw"] === "function" ? a941_0x94f236['getStateRaw']() : a941_0x94f236['getState']();
}
function _getNode(_0x28eb4d) {
  return _getState()["nodes"]?.[_0x28eb4d] || null;
}
function _isAudioNodeType(_0x82d215) {
  const _0x358257 = String(_0x82d215 || '')['trim']()["toLowerCase"]();
  return _0x358257 === "source-audio" || _0x358257 === "ai-audio" || _0x358257 === "audio";
}
function _fileNameFromPath(_0xabf27b) {
  const _0x5b3dce = normalizeLocalPath(_0xabf27b);
  if (!_0x5b3dce) {
    return '';
  }
  const _0x2fe7e5 = _0x5b3dce['split']('/');
  return String(_0x2fe7e5[_0x2fe7e5["length"] - 0x1] || '')['trim']();
}
function _isAudioSplitLeader(_0x5b4792) {
  if (!_0x5b4792 || typeof _0x5b4792 !== "object") {
    return ![];
  }
  return String(_0x5b4792['type'] || '')['trim']()["toLowerCase"]() === 'source-audio' && String(_0x5b4792["audioSplitRole"] || '')["trim"]()["toLowerCase"]() === AUDIO_SPLIT_ROLE_VOCALS && String(_0x5b4792["provider"] || '')["trim"]()["toLowerCase"]() === "runninghubwf" && String(_0x5b4792["model"] || '')["trim"]() === AUDIO_SPLIT_MODEL && !!String(_0x5b4792["audioSplitPeerId"] || '')["trim"]();
}
function _isRunningTaskStatus(_0x2e3caa) {
  const _0x291b29 = String(_0x2e3caa || '')['trim']()["toLowerCase"]();
  return !["success", "failed", "idle", 'cancelled']["includes"](_0x291b29);
}
function _resolveAudioSplitLeaderId(_0x5ebee0) {
  const _0x341760 = String(_0x5ebee0 || '')["trim"]();
  if (!_0x341760) {
    return '';
  }
  const _0x4e51d5 = _getNode(_0x341760);
  if (_isAudioSplitLeader(_0x4e51d5)) {
    return _0x341760;
  }
  const _0x644927 = String(_0x4e51d5?.["audioSplitPeerId"] || '')["trim"]();
  if (_0x644927 && _isAudioSplitLeader(_getNode(_0x644927))) {
    return _0x644927;
  }
  const _0x4d009c = _getState()["nodes"] || {};
  const _0xd77daa = Object['values'](_0x4d009c)['find'](_0x27e6d4 => _isAudioSplitLeader(_0x27e6d4) && (String(_0x27e6d4['audioSplitPeerId'] || '') === _0x341760 || String(_0x27e6d4["rhSourceNodeId"] || '') === _0x341760));
  return String(_0xd77daa?.['id'] || '');
}
function _getSpawnLayout(_0x42d09f) {
  const _0x17fba4 = getNodeDefaultSize("source-audio");
  const _0x40c2cd = Number(_0x42d09f?.["width"]) > 0x0 ? Number(_0x42d09f["width"]) : _0x17fba4["width"];
  const _0x56fce6 = Number(_0x42d09f?.['height']) > 0x0 ? Number(_0x42d09f["height"]) : _0x17fba4['height'];
  const {
    spacing: _0x2dabef,
    direction: _0x1e8af5,
    avoidOverlap: _0x109de7
  } = getNodeSpawnPrefs();
  const _0x527bba = _0x1e8af5 === 'down' ? "down" : "right";
  const _0x1ed42c = Math['max'](0x18, Math["min"](0x50, Math['round'](_0x2dabef / 0x2)));
  const _0x6723ff = Number(_0x42d09f?.['x']) || 0x0;
  const _0x1b47db = Number(_0x42d09f?.['y']) || 0x0;
  const _0x18d69d = Number(_0x42d09f?.['width']) || _0x17fba4["width"];
  const _0x359237 = Number(_0x42d09f?.["height"]) || _0x17fba4['height'];
  let _0x5c64e1 = _0x527bba === "right" ? _0x6723ff + _0x18d69d + _0x2dabef : _0x6723ff + Math["round"]((_0x18d69d - _0x40c2cd) / 0x2);
  let _0x199dec = _0x527bba === "down" ? _0x1b47db + _0x359237 + _0x2dabef : _0x1b47db + Math["round"]((_0x359237 - _0x56fce6) / 0x2);
  const _0x147b60 = _0x527bba === "right" ? _0x40c2cd * 0x2 + _0x1ed42c : _0x40c2cd;
  const _0x365ed9 = _0x527bba === "down" ? _0x56fce6 * 0x2 + _0x1ed42c : _0x56fce6;
  if (_0x109de7) {
    const _0x4dca5e = findAvailablePosition(_getState()['nodes'] || {}, _0x5c64e1, _0x199dec, _0x147b60, _0x365ed9, _0x2dabef, _0x527bba);
    _0x5c64e1 = _0x4dca5e['x'];
    _0x199dec = _0x4dca5e['y'];
  }
  return {
    'width': _0x40c2cd,
    'height': _0x56fce6,
    'resolvedDirection': _0x527bba,
    'innerGap': _0x1ed42c,
    'vocals': {
      'x': _0x5c64e1,
      'y': _0x199dec
    },
    'background': _0x527bba === 'right' ? {
      'x': _0x5c64e1 + _0x40c2cd + _0x1ed42c,
      'y': _0x199dec
    } : {
      'x': _0x5c64e1,
      'y': _0x199dec + _0x56fce6 + _0x1ed42c
    }
  };
}
async function _persistAudioResult(_0x15e2b8) {
  const _0x56303e = await _saveRemoteAudioLocallyDetailedImpl(_0x15e2b8);
  const _0xcf8f67 = pickResultLocalPath(_0x56303e);
  const _0x3f8d6f = String(_0x56303e?.["localUrl"] || _0x56303e?.["audioUrl"] || '')['trim']();
  const _0x1c9798 = buildCanvasLocalAudioFields({
    'localPath': _0xcf8f67,
    'audioUrl': _0x3f8d6f
  });
  if (!_0x1c9798["audioUrl"] || !_0x1c9798["localPath"]) {
    throw new Error(audioSeparationText("localSaveFailed"));
  }
  return {
    ..._0x1c9798,
    'fileName': _fileNameFromPath(_0x1c9798["localPath"])
  };
}
function _updateNodeIfExists(_0x4bfa91, _0x6cc1f7) {
  if (!String(_0x4bfa91 || '')['trim']()) {
    return;
  }
  if (!_getNode(_0x4bfa91)) {
    return;
  }
  a941_0x94f236['updateNodeData'](_0x4bfa91, _0x6cc1f7);
}
function _focusCreatedNodes(_0x4d38a0, _0xbb3aa8) {
  const _0x927fbf = Array["isArray"](_0xbb3aa8) ? _0xbb3aa8["map"](_0x285a84 => String(_0x285a84 || '')["trim"]())["filter"](Boolean) : [];
  if (!_0x927fbf["length"]) {
    return;
  }
  a941_0x94f236["setSelectedNodes"](_0x927fbf);
  if (typeof window['v2FocusOnNodes'] === "function") {
    window["v2FocusOnNodes"]([_0x4d38a0, ..._0x927fbf]);
  } else {
    typeof window["v2FocusOnNode"] === "function" && window['v2FocusOnNode'](_0x927fbf[0x0]);
  }
}
function _persistLocalCache() {
  try {
    window["_triggerLocalCacheSave"]?.();
  } catch {}
}
function _resolveSeparationResultUrls(_0x38b145) {
  const _0x2ea3c3 = Array["isArray"](_0x38b145?.["audios"]) ? _0x38b145["audios"] : [];
  const _0x19aeb4 = String(_0x38b145?.["vocalsAudioUrl"] || _0x2ea3c3['find'](_0x51512a => String(_0x51512a?.['role'] || '')["trim"]()["toLowerCase"]() === "vocals" || String(_0x51512a?.["nodeId"] || '')["trim"]() === '5')?.["audioUrl"] || _0x2ea3c3[0x0]?.['audioUrl'] || '')["trim"]();
  const _0x3076dc = String(_0x38b145?.["backgroundAudioUrl"] || _0x2ea3c3["find"](_0x35a895 => String(_0x35a895?.["role"] || '')["trim"]()["toLowerCase"]() === "background" || String(_0x35a895?.["nodeId"] || '')["trim"]() === '7')?.['audioUrl'] || _0x2ea3c3[0x1]?.["audioUrl"] || '')["trim"]();
  return {
    'vocalsUrl': _0x19aeb4,
    'backgroundUrl': _0x3076dc
  };
}
function _createPlaceholderPair(_0x31cc05) {
  const _0x4a37cc = _getSpawnLayout(_0x31cc05);
  const _0x4ad117 = Date['now']();
  const _0x1b817e = generateId("source-audio-split-vocals");
  const _0x1b08c9 = generateId("source-audio-split-background");
  const _0x2df6a9 = buildSourceAudioNodePayload({
    'id': _0x1b817e,
    'x': _0x4a37cc["vocals"]['x'],
    'y': _0x4a37cc['vocals']['y'],
    'width': _0x4a37cc["width"],
    'height': _0x4a37cc["height"],
    'name': audioSeparationText("nodeNames.vocalsProcessing"),
    'audioSplitRole': AUDIO_SPLIT_ROLE_VOCALS,
    'audioSplitPeerId': _0x1b08c9,
    'rhSourceNodeId': _0x31cc05['id'],
    'rhToolbarTaskType': "audio-separation",
    'provider': 'runninghubwf',
    'model': AUDIO_SPLIT_MODEL,
    'rhInstanceType': normalizeRunningHubInstanceType(_0x31cc05?.["rhInstanceType"]),
    ...buildGenerationStartPatch({
      'startedAt': _0x4ad117
    }),
    ...buildRunningHubOpenapiTaskPatch({
      'taskId': '',
      'status': "pending",
      'startedAt': _0x4ad117,
      'recovering': ![],
      'useOpenapiQuery': !![]
    })
  });
  const _0x110692 = buildSourceAudioNodePayload({
    'id': _0x1b08c9,
    'x': _0x4a37cc['background']['x'],
    'y': _0x4a37cc['background']['y'],
    'width': _0x4a37cc["width"],
    'height': _0x4a37cc["height"],
    'name': audioSeparationText("nodeNames.backgroundProcessing"),
    'audioSplitRole': AUDIO_SPLIT_ROLE_BACKGROUND,
    'audioSplitPeerId': _0x1b817e,
    'rhSourceNodeId': _0x31cc05['id'],
    'rhToolbarTaskType': 'audio-separation',
    ...buildGenerationStartPatch({
      'startedAt': _0x4ad117
    })
  });
  a941_0x94f236['batch'](() => {
    a941_0x94f236["addNode"](_0x2df6a9);
    a941_0x94f236["addNode"](_0x110692);
  });
  _focusCreatedNodes(_0x31cc05['id'], [_0x1b817e, _0x1b08c9]);
  _persistLocalCache();
  return {
    'leaderId': _0x1b817e,
    'peerId': _0x1b08c9,
    'startedAt': _0x4ad117
  };
}
async function _applySuccessResult({
  leaderId: _0x44e639,
  peerId: _0x119199,
  result: _0x4c6740,
  startedAt: _0x4d452a
}) {
  const {
    vocalsUrl: _0x248747,
    backgroundUrl: _0x2d8517
  } = _resolveSeparationResultUrls(_0x4c6740);
  if (!_0x248747 || !_0x2d8517) {
    throw new Error(audioSeparationText("missingResultUrls"));
  }
  const [_0x585acf, _0x5a7412] = await Promise["all"]([_persistAudioResult(_0x248747), _persistAudioResult(_0x2d8517)]);
  const _0x1f5548 = _getNode(_0x44e639);
  const _0x28d233 = String(_0x1f5548?.["rhTaskId"] || _0x4c6740?.["taskId"] || '')["trim"]();
  a941_0x94f236["batch"](() => {
    _updateNodeIfExists(_0x44e639, {
      'name': audioSeparationText("nodeNames.vocals"),
      ...buildLocalAudioGenerationResultPatch(_0x585acf, {
        'startedAt': _0x4d452a
      }),
      ...buildRunningHubOpenapiTaskPatch({
        'taskId': _0x28d233,
        'status': 'success',
        'startedAt': _0x4d452a,
        'recovering': ![],
        'useOpenapiQuery': !![]
      })
    });
    _updateNodeIfExists(_0x119199, {
      'name': audioSeparationText("nodeNames.background"),
      ...buildLocalAudioGenerationResultPatch(_0x5a7412, {
        'startedAt': _0x4d452a
      })
    });
  });
  _persistLocalCache();
  window["showToast"]?.(audioSeparationText("success"), 'success');
}
function _buildEmptyAudioFields() {
  return buildCanvasLocalAudioFields({
    'localPath': '',
    'audioUrl': '',
    'fileName': ''
  });
}
function _applyFailureResult({
  leaderId: _0x1b61bc,
  peerId: _0xef7346,
  startedAt: _0x3e3013,
  message: _0x4e675b
}) {
  const _0xf25e31 = String(_0x4e675b || audioSeparationText("fallback"))["trim"]() || audioSeparationText('fallback');
  const _0x3417eb = _getNode(_0x1b61bc);
  const _0x4f1cc0 = _buildEmptyAudioFields();
  a941_0x94f236['batch'](() => {
    _updateNodeIfExists(_0x1b61bc, {
      'name': audioSeparationText("nodeNames.vocalsFailed"),
      ...buildLocalAudioGenerationResultPatch({
        'error': _0xf25e31
      }, {
        'startedAt': _0x3e3013
      }),
      ..._0x4f1cc0,
      'rhStatusMessage': _0xf25e31,
      'rhStatusCode': null,
      ...buildRunningHubOpenapiTaskPatch({
        'taskId': String(_0x3417eb?.["rhTaskId"] || '')['trim'](),
        'status': "failed",
        'startedAt': _0x3e3013,
        'recovering': ![],
        'useOpenapiQuery': !![]
      })
    });
    _updateNodeIfExists(_0xef7346, {
      'name': audioSeparationText("nodeNames.backgroundFailed"),
      ...buildLocalAudioGenerationResultPatch({
        'error': _0xf25e31
      }, {
        'startedAt': _0x3e3013
      }),
      ..._0x4f1cc0
    });
  });
  _persistLocalCache();
  window["showToast"]?.(audioSeparationText("failedWithMessage", {
    'message': _0xf25e31
  }), "error");
}
async function _executeTask({
  leaderId: _0x29a364,
  peerId: _0x42aff3,
  sourceAudioUrl: _0x49e9b7,
  rhInstanceType = 'default',
  startedAt: _0x35dae1,
  resume = ![],
  runtime: _0x295ec6
}) {
  const _0x3a6fb0 = (_0x46e3cd, _0x345f3d = '') => {
    const _0x2772da = _runtimeByLeaderId["get"](_0x29a364) || {};
    _runtimeByLeaderId["set"](_0x29a364, {
      ..._0x2772da,
      'taskId': String(_0x46e3cd || '')["trim"](),
      ...(_0x345f3d ? {
        'providerProfileId': String(_0x345f3d)["trim"]()
      } : {})
    });
  };
  try {
    let _0x3c6250 = null;
    if (resume) {
      const _0x5b63ab = _getNode(_0x29a364);
      const _0x3208cf = String(_0x5b63ab?.["rhTaskId"] || _0x295ec6["taskId"] || '')["trim"]();
      if (!_0x3208cf) {
        throw new Error(audioSeparationText('missingTaskId'));
      }
      _0x3c6250 = await _resumeAudioSeparationTaskImpl(_0x3208cf, {
        'rhInstanceType': rhInstanceType,
        'providerProfileId': _0x5b63ab?.["taskProviderProfileId"] || _0x5b63ab?.["providerProfileId"] || _0x5b63ab?.["rhProviderProfileId"] || ''
      }, {
        'signal': _0x295ec6['abortController']?.["signal"]
      });
    } else {
      window["showToast"]?.(audioSeparationText("submitting"), 'info');
      _0x3c6250 = await _runAudioSeparationImpl({
        'nodeId': _0x29a364,
        'audioUrl': _0x49e9b7,
        'rhInstanceType': rhInstanceType
      }, {
        'signal': _0x295ec6["abortController"]?.['signal'],
        'onTaskMeta': ({
          taskId: _0x117d96,
          useOpenapiQuery: _0x28dc74,
          providerProfileId: _0xdf32d6
        }) => {
          _0x3a6fb0(_0x117d96, _0xdf32d6);
          _updateNodeIfExists(_0x29a364, {
            ...(_0xdf32d6 ? {
              'taskProviderProfileId': _0xdf32d6,
              'rhProviderProfileId': _0xdf32d6
            } : {}),
            ...buildRunningHubOpenapiTaskPatch({
              'taskId': _0x117d96,
              'status': 'pending',
              'startedAt': _0x35dae1,
              'recovering': ![],
              'useOpenapiQuery': _0x28dc74 === !![]
            })
          });
          _persistLocalCache();
        },
        'onTaskId': _0x2898f4 => {
          _0x3a6fb0(_0x2898f4);
          _updateNodeIfExists(_0x29a364, {
            ...buildRunningHubOpenapiTaskPatch({
              'taskId': _0x2898f4,
              'status': "pending",
              'startedAt': _0x35dae1,
              'recovering': ![],
              'useOpenapiQuery': !![]
            })
          });
          _persistLocalCache();
        }
      });
    }
    await _applySuccessResult({
      'leaderId': _0x29a364,
      'peerId': _0x42aff3,
      'result': _0x3c6250,
      'startedAt': _0x35dae1
    });
  } catch (_0x591efb) {
    if (_0x295ec6["abortController"]?.["signal"]?.["aborted"]) {
      return;
    }
    const _0x57c939 = _0x591efb instanceof Error ? _0x591efb['message'] : String(_0x591efb || audioSeparationText('fallback'));
    _applyFailureResult({
      'leaderId': _0x29a364,
      'peerId': _0x42aff3,
      'startedAt': _0x35dae1,
      'message': _0x57c939
    });
  } finally {
    const _0x499441 = _runtimeByLeaderId["get"](_0x29a364);
    _0x499441?.['promise'] === _0x295ec6["promise"] && _runtimeByLeaderId["delete"](_0x29a364);
  }
}
export async function runAudioSeparationFromNode(_0x2d5266) {
  const _0x52a561 = _getNode(_0x2d5266);
  if (!_0x52a561 || !_isAudioNodeType(_0x52a561['type'])) {
    window["showToast"]?.(audioSeparationText("unsupportedNode"), "warn");
    return null;
  }
  if (_0x52a561['isGenerating']) {
    window['showToast']?.(audioSeparationText('busy'), "info");
    return null;
  }
  const _0x12a35b = resolveCanvasAudioUrl(_0x52a561);
  if (!_0x12a35b) {
    window['showToast']?.(audioSeparationText("missingAudio"), "warn");
    return null;
  }
  const {
    leaderId: _0x22ee7c,
    peerId: _0x56aa17,
    startedAt: _0x3aef10
  } = _createPlaceholderPair(_0x52a561);
  const _0xfc279a = {
    'abortController': new AbortController(),
    'promise': null,
    'taskId': ''
  };
  _runtimeByLeaderId['set'](_0x22ee7c, _0xfc279a);
  const _0x2be25e = _executeTask({
    'leaderId': _0x22ee7c,
    'peerId': _0x56aa17,
    'sourceAudioUrl': _0x12a35b,
    'rhInstanceType': _0x52a561?.["rhInstanceType"] || "default",
    'startedAt': _0x3aef10,
    'resume': ![],
    'runtime': _0xfc279a
  });
  _0xfc279a["promise"] = _0x2be25e;
  _runtimeByLeaderId["set"](_0x22ee7c, _0xfc279a);
  await _0x2be25e;
  return {
    'leaderId': _0x22ee7c,
    'peerId': _0x56aa17
  };
}
export function getRunningAudioSeparationTaskForNode(_0x5ae7f5) {
  const _0x2e416c = _resolveAudioSplitLeaderId(_0x5ae7f5);
  if (!_0x2e416c) {
    return null;
  }
  const _0x5c6555 = _getNode(_0x2e416c);
  if (!_isAudioSplitLeader(_0x5c6555)) {
    return null;
  }
  if (!_isRunningTaskStatus(_0x5c6555?.["rhTaskStatus"])) {
    return null;
  }
  return {
    'sourceNodeId': String(_0x5c6555["rhSourceNodeId"] || ''),
    'outId': _0x2e416c,
    'peerId': String(_0x5c6555['audioSplitPeerId'] || ''),
    'taskId': String(_0x5c6555["rhTaskId"] || _runtimeByLeaderId["get"](_0x2e416c)?.["taskId"] || ''),
    'mode': 'audio-separation'
  };
}
export function hasRunningAudioSeparationTaskForNode(_0x5a6210) {
  return !!getRunningAudioSeparationTaskForNode(_0x5a6210);
}
export async function cancelAudioSeparationTaskForNode(_0x52b239, {
  notify = ![]
} = {}) {
  const _0x5b7fe8 = getRunningAudioSeparationTaskForNode(_0x52b239);
  if (!_0x5b7fe8?.["outId"]) {
    return ![];
  }
  const _0x5684cd = _0x5b7fe8["outId"];
  const _0xcfcf2b = _0x5b7fe8["peerId"];
  const _0x10781b = _runtimeByLeaderId['get'](_0x5684cd);
  try {
    _0x10781b?.['abortController']?.["abort"]?.();
  } catch {}
  _runtimeByLeaderId["delete"](_0x5684cd);
  const _0x4a9852 = _getNode(_0x5684cd);
  const _0xf57243 = Number(_0x4a9852?.['generationStartTime'] || _0x4a9852?.["rhTaskStartedAt"] || 0x0) || Date["now"]();
  const _0x58dc9f = Date["now"]() - _0xf57243;
  const _0x4110f1 = _buildEmptyAudioFields();
  a941_0x94f236['batch'](() => {
    _updateNodeIfExists(_0x5684cd, {
      'name': audioSeparationText("nodeNames.vocalsCancelled"),
      ..._0x4110f1,
      'isGenerating': ![],
      'jobStatus': null,
      'jobError': null,
      'generationDuration': _0x58dc9f,
      'rhTaskStatus': 'cancelled',
      'rhTaskRecovering': ![],
      'rhStatusMessage': null
    });
    _updateNodeIfExists(_0xcfcf2b, {
      'name': audioSeparationText("nodeNames.backgroundCancelled"),
      ..._0x4110f1,
      'isGenerating': ![],
      'jobStatus': null,
      'jobError': null,
      'generationDuration': _0x58dc9f
    });
  });
  _persistLocalCache();
  const _0x54a086 = String(_0x4a9852?.["taskProviderProfileId"] || _0x4a9852?.["providerProfileId"] || _0x4a9852?.["rhProviderProfileId"] || '')["trim"]();
  let _0x177c7e = '';
  let _0x523934 = _0x54a086;
  try {
    const _0x2c024e = await resolveRunningHubWorkflowAccess(_0x54a086);
    _0x177c7e = _0x2c024e["apiKey"];
    _0x523934 = _0x523934 || _0x2c024e['providerProfileId'];
  } catch {}
  if (_0x177c7e && _0x5b7fe8["taskId"]) {
    try {
      await cancelRunningHubTask({
        'apiKey': _0x177c7e,
        'taskId': _0x5b7fe8["taskId"],
        'providerProfileId': _0x523934
      });
    } catch (_0x555dbe) {
      console["warn"]("[AudioSeparationController] cancel request failed:", _0x555dbe);
    }
  }
  if (notify) {
    window["showToast"]?.(audioSeparationText('cancelled'), "info");
  }
  return !![];
}
export function maybeResumeAudioSeparationLeader(_0x3a23e0) {
  const _0x9d6682 = _getNode(_0x3a23e0);
  if (!_isAudioSplitLeader(_0x9d6682)) {
    return null;
  }
  if (!_isRunningTaskStatus(_0x9d6682?.["rhTaskStatus"])) {
    return null;
  }
  const _0x322b7a = String(_0x9d6682?.['rhTaskId'] || '')["trim"]();
  if (!_0x322b7a) {
    return null;
  }
  const _0x239aa8 = _runtimeByLeaderId["get"](_0x3a23e0);
  if (_0x239aa8?.["promise"] && _0x239aa8["taskId"] === _0x322b7a) {
    return _0x239aa8["promise"];
  }
  const _0x32faa9 = Number(_0x9d6682?.["rhTaskStartedAt"] || _0x9d6682?.['generationStartTime'] || 0x0) || Date['now']();
  a941_0x94f236["batch"](() => {
    _updateNodeIfExists(_0x3a23e0, {
      ...buildGenerationStartPatch({
        'startedAt': _0x32faa9
      }),
      ...buildRunningHubOpenapiTaskPatch({
        'taskId': _0x322b7a,
        'status': String(_0x9d6682?.['rhTaskStatus'] || '')["trim"]()["toLowerCase"]() === 'pending' ? 'pending' : "running",
        'startedAt': _0x32faa9,
        'recovering': !![],
        'useOpenapiQuery': _0x9d6682?.['rhTaskUseOpenapiQuery'] === !![]
      })
    });
    _updateNodeIfExists(_0x9d6682?.['audioSplitPeerId'], {
      ...buildGenerationStartPatch({
        'startedAt': _0x32faa9
      }),
      'jobError': null
    });
  });
  _persistLocalCache();
  const _0x39582c = {
    'abortController': new AbortController(),
    'promise': null,
    'taskId': _0x322b7a
  };
  _runtimeByLeaderId["set"](_0x3a23e0, _0x39582c);
  const _0x36f007 = _executeTask({
    'leaderId': _0x3a23e0,
    'peerId': _0x9d6682["audioSplitPeerId"],
    'sourceAudioUrl': '',
    'rhInstanceType': _0x9d6682?.["rhInstanceType"] || "default",
    'startedAt': _0x32faa9,
    'resume': !![],
    'runtime': _0x39582c
  });
  _0x39582c["promise"] = _0x36f007;
  _runtimeByLeaderId["set"](_0x3a23e0, _0x39582c);
  return _0x36f007;
}
export function __setAudioSeparationDepsForTest({
  runAudioSeparationImpl: _0x432754,
  resumeAudioSeparationTaskImpl: _0x2e33e9,
  saveRemoteAudioLocallyDetailedImpl: _0x436caf
} = {}) {
  _runAudioSeparationImpl = typeof _0x432754 === "function" ? _0x432754 : runAudioSeparation;
  _resumeAudioSeparationTaskImpl = typeof _0x2e33e9 === "function" ? _0x2e33e9 : resumeAudioSeparationTask;
  _saveRemoteAudioLocallyDetailedImpl = typeof _0x436caf === "function" ? _0x436caf : saveRemoteAudioLocallyDetailed;
}
export function __resetAudioSeparationDepsForTest() {
  _runAudioSeparationImpl = runAudioSeparation;
  _resumeAudioSeparationTaskImpl = resumeAudioSeparationTask;
  _saveRemoteAudioLocallyDetailedImpl = saveRemoteAudioLocallyDetailed;
  _runtimeByLeaderId["forEach"](_0x2656f8 => {
    try {
      _0x2656f8?.['abortController']?.["abort"]?.();
    } catch {}
  });
  _runtimeByLeaderId["clear"]();
}