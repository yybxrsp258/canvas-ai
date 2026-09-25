import { buildVideoReplicationSourceEvidence } from '../../domain/storyGeneration/videoReplicationSourceAnalysis.js';
const RUN_KIND = "story-episode-split-run";
const RUN_VERSION = 0x1;
const MAX_INVOCATIONS = 0x20;
const MAX_RAW_RESPONSE_CHARACTERS = 0x27100;
let sequence = 0x0;
function normalizeText(_0x2e5a42) {
  return String(_0x2e5a42 || '')["trim"]();
}
function cloneJson(_0x4fc8e9) {
  if (_0x4fc8e9 == null) {
    return _0x4fc8e9;
  }
  return JSON['parse'](JSON["stringify"](_0x4fc8e9));
}
function stableSerialize(_0x3f83ab) {
  if (Array['isArray'](_0x3f83ab)) {
    return '[' + _0x3f83ab["map"](stableSerialize)["join"](',') + ']';
  }
  if (_0x3f83ab && typeof _0x3f83ab === "object") {
    return '{' + Object['keys'](_0x3f83ab)["sort"]()["map"](_0x43b891 => JSON["stringify"](_0x43b891) + ':' + stableSerialize(_0x3f83ab[_0x43b891]))["join"](',') + '}';
  }
  return JSON["stringify"](_0x3f83ab ?? null);
}
function fingerprint(_0x23b298) {
  const _0x1ec3a6 = stableSerialize(_0x23b298);
  let _0x4d1f78 = 0x811c9dc5;
  for (let _0x208227 = 0x0; _0x208227 < _0x1ec3a6["length"]; _0x208227 += 0x1) {
    _0x4d1f78 ^= _0x1ec3a6["charCodeAt"](_0x208227);
    _0x4d1f78 = Math['imul'](_0x4d1f78, 0x1000193);
  }
  return 'fnv1a-' + (_0x4d1f78 >>> 0x0)["toString"](0x10)["padStart"](0x8, '0');
}
function normalizeExecution(_0x35b996 = {}) {
  return {
    'modelId': normalizeText(_0x35b996["modelId"]),
    'provider': normalizeText(_0x35b996["provider"]),
    'providerProfileId': normalizeText(_0x35b996["providerProfileId"])
  };
}
function createInput({
  project = {},
  episode = {},
  assets = [],
  constraints = {},
  execution = {},
  mode = "standard",
  promptExperiment = ![]
} = {}) {
  return {
    'projectId': normalizeText(project['id']),
    'episodeId': normalizeText(episode['id']),
    'episodeRef': normalizeText(episode["ref"] || episode['planningRef'] || episode['id']),
    'mode': normalizeText(mode) || "standard",
    'promptExperiment': promptExperiment === !![],
    'promptMode': normalizeText(constraints?.["promptMode"]),
    'sourceFingerprint': fingerprint({
      'scriptMode': project["scriptMode"],
      'summaryRevision': project['summaryRevision'],
      'outlineRevision': project["outlineSourceSummaryRevision"],
      ...(project["sourceMode"] === 'video-replication' ? {
        'replication': project["replication"],
        'sourceEvidence': buildVideoReplicationSourceEvidence(episode, project, assets)
      } : {}),
      'episode': {
        'title': episode["title"],
        'synopsis': episode["synopsis"],
        'hook': episode["hook"],
        'script': episode["script"]?.["fullText"],
        'scenes': episode["script"]?.["scenes"]
      },
      'assets': (Array["isArray"](assets) ? assets : [])["map"](_0x3d9f53 => ({
        'id': _0x3d9f53?.['id'],
        'ref': _0x3d9f53?.['ref'],
        'name': _0x3d9f53?.['name'],
        'kind': _0x3d9f53?.['kind'],
        'appearances': _0x3d9f53?.["appearances"]
      })),
      'constraints': constraints
    }),
    'execution': normalizeExecution(execution),
    'promptVersion': mode === 'experimental' ? 'episode-split-experimental/v3' : "episode-split/v2",
    'schemaVersion': "story-episode-split/v2"
  };
}
function normalizeInvocation(_0x1bacec = {}) {
  return {
    'id': normalizeText(_0x1bacec['id']),
    'stepId': normalizeText(_0x1bacec["stepId"]),
    'attempt': Math["max"](0x1, Math["trunc"](Number(_0x1bacec["attempt"]) || 0x1)),
    'state': normalizeText(_0x1bacec["state"]),
    'requestFingerprint': normalizeText(_0x1bacec["requestFingerprint"]),
    'rawResponse': String(_0x1bacec["rawResponse"] || '')["slice"](0x0, MAX_RAW_RESPONSE_CHARACTERS),
    'error': normalizeText(_0x1bacec["error"]),
    'preparedAt': Math["max"](0x0, Number(_0x1bacec["preparedAt"] || 0x0)),
    'completedAt': Math["max"](0x0, Number(_0x1bacec["completedAt"] || 0x0)),
    'retryAuthorizedAt': Math['max'](0x0, Number(_0x1bacec["retryAuthorizedAt"] || 0x0))
  };
}
export function normalizeStoryEpisodeSplitRun(_0x466087) {
  const _0x36f1e7 = _0x466087?.['kind'] === RUN_KIND && _0x466087?.["run"] ? _0x466087["run"] : _0x466087;
  if (!_0x36f1e7 || typeof _0x36f1e7 !== "object" || Array["isArray"](_0x36f1e7) || _0x36f1e7["kind"] !== RUN_KIND || Number(_0x36f1e7["version"]) !== RUN_VERSION) {
    return null;
  }
  return {
    'kind': RUN_KIND,
    'version': RUN_VERSION,
    'id': normalizeText(_0x36f1e7['id']),
    'status': normalizeText(_0x36f1e7["status"]) || "running",
    'inputFingerprint': normalizeText(_0x36f1e7["inputFingerprint"]),
    'input': cloneJson(_0x36f1e7["input"] || {}),
    'checkpoint': cloneJson(_0x36f1e7['checkpoint'] || null),
    'checkpointAt': Math['max'](0x0, Number(_0x36f1e7["checkpointAt"] || 0x0)),
    'qualityReview': cloneJson(_0x36f1e7["qualityReview"] || null),
    'invocations': (Array["isArray"](_0x36f1e7["invocations"]) ? _0x36f1e7['invocations'] : [])['map'](normalizeInvocation)["filter"](_0x375ec1 => _0x375ec1['id'] && _0x375ec1["stepId"])["slice"](-MAX_INVOCATIONS),
    'candidateArtifact': cloneJson(_0x36f1e7["candidateArtifact"] || null),
    'error': normalizeText(_0x36f1e7['error']),
    'createdAt': Math["max"](0x0, Number(_0x36f1e7["createdAt"] || 0x0)) || Date["now"](),
    'updatedAt': Math["max"](0x0, Number(_0x36f1e7["updatedAt"] || 0x0)) || Date['now']()
  };
}
function createRun(_0x5914b2) {
  const _0x17ba9a = createInput(_0x5914b2);
  const _0x42884e = Date['now']();
  sequence += 0x1;
  return {
    'kind': RUN_KIND,
    'version': RUN_VERSION,
    'id': "episode-split:" + (_0x17ba9a['projectId'] || "project") + ':' + (_0x17ba9a["episodeId"] || _0x17ba9a["episodeRef"]) + ':' + _0x42884e + ':' + sequence,
    'status': "running",
    'inputFingerprint': fingerprint(_0x17ba9a),
    'input': _0x17ba9a,
    'checkpoint': null,
    'checkpointAt': 0x0,
    'qualityReview': null,
    'invocations': [],
    'candidateArtifact': null,
    'error': '',
    'createdAt': _0x42884e,
    'updatedAt': _0x42884e
  };
}
function isResumable(_0x4585f7, _0x2e0cfc) {
  if (!_0x4585f7 || !["running", "failed_retryable", 'ready_to_commit']["includes"](_0x4585f7["status"])) {
    return ![];
  }
  const _0x304ac8 = _0x4585f7["status"] === "ready_to_commit" && _0x4585f7["candidateArtifact"];
  return _0x4585f7["inputFingerprint"] === fingerprint(createInput({
    ..._0x2e0cfc,
    ...(_0x304ac8 ? {
      'execution': _0x4585f7["input"]["execution"]
    } : {})
  }));
}
function hasUncommittedPaidCall(_0x27d785) {
  if (_0x27d785["status"] === 'ready_to_commit' && _0x27d785["candidateArtifact"]) {
    return ![];
  }
  return _0x27d785["invocations"]["some"](_0x86b9d9 => {
    if (_0x86b9d9["retryAuthorizedAt"]) {
      return ![];
    }
    if (['prepared', "outcome-unknown"]["includes"](_0x86b9d9["state"])) {
      return !![];
    }
    return _0x86b9d9['state'] === "completed" && _0x86b9d9['completedAt'] > _0x27d785["checkpointAt"];
  });
}
export function createStoryEpisodeSplitRunRecorder({
  resumePayload = null,
  onChange = null,
  ..._0x3afc26
} = {}) {
  const _0x418ee8 = normalizeStoryEpisodeSplitRun(resumePayload);
  let _0x7720e1 = isResumable(_0x418ee8, _0x3afc26) ? _0x418ee8 : createRun(_0x3afc26);
  const _0x2c33e9 = async () => {
    _0x7720e1['updatedAt'] = Date["now"]();
    await onChange?.(cloneJson(_0x7720e1));
  };
  const _0x538a5c = () => ({
    'kind': RUN_KIND,
    'run': cloneJson(_0x7720e1)
  });
  return Object['freeze']({
    get 'execution'() {
      return cloneJson(_0x7720e1["input"]["execution"]);
    },
    get 'checkpoint'() {
      return cloneJson(_0x7720e1["checkpoint"]);
    },
    get 'candidateArtifact'() {
      return _0x7720e1["status"] === "ready_to_commit" ? cloneJson(_0x7720e1["candidateArtifact"]) : null;
    },
    get 'qualityReview'() {
      return cloneJson(_0x7720e1["qualityReview"]);
    },
    get 'requiresPaidRetry'() {
      return hasUncommittedPaidCall(_0x7720e1);
    },
    'payload': _0x538a5c,
    async 'start'() {
      !(_0x7720e1['status'] === "ready_to_commit" && _0x7720e1["candidateArtifact"]) && (_0x7720e1['status'] = "running", _0x7720e1['error'] = '');
      await _0x2c33e9();
    },
    async 'authorizePaidRetry'() {
      const _0x3c0aef = Date["now"]();
      _0x7720e1["invocations"] = _0x7720e1["invocations"]["map"](_0x4d3358 => !_0x4d3358["retryAuthorizedAt"] && (['prepared', 'outcome-unknown']["includes"](_0x4d3358["state"]) || _0x4d3358["state"] === "completed" && _0x4d3358['completedAt'] > _0x7720e1["checkpointAt"]) ? {
        ..._0x4d3358,
        'retryAuthorizedAt': _0x3c0aef
      } : _0x4d3358);
      await _0x2c33e9();
    },
    async 'onInvocation'(_0x4d3dca = {}) {
      const _0x3458ec = Date["now"]();
      if (_0x4d3dca["state"] === "prepared") {
        sequence += 0x1;
        _0x7720e1["invocations"]["push"](normalizeInvocation({
          'id': _0x7720e1['id'] + ':' + normalizeText(_0x4d3dca["stepId"]) + ':' + _0x4d3dca['attempt'] + ':' + sequence,
          'stepId': _0x4d3dca['stepId'],
          'attempt': _0x4d3dca["attempt"],
          'state': "prepared",
          'requestFingerprint': fingerprint({
            'model': _0x4d3dca['requestPayload']?.["model"],
            'provider': _0x4d3dca["requestPayload"]?.["provider"],
            'prompt': _0x4d3dca['requestPayload']?.["prompt"]
          }),
          'preparedAt': _0x3458ec
        }));
      } else {
        const _0x120e33 = [..._0x7720e1["invocations"]]["reverse"]()['find'](_0xc8d9c3 => _0xc8d9c3["stepId"] === normalizeText(_0x4d3dca["stepId"]) && _0xc8d9c3["attempt"] === Math["max"](0x1, Math['trunc'](Number(_0x4d3dca["attempt"]) || 0x1)) && _0xc8d9c3["state"] === "prepared");
        _0x120e33 && (_0x120e33["state"] = normalizeText(_0x4d3dca["state"]), _0x120e33["rawResponse"] = String(_0x4d3dca["rawResponse"] || '')["slice"](0x0, MAX_RAW_RESPONSE_CHARACTERS), _0x120e33["error"] = normalizeText(_0x4d3dca["error"]), _0x120e33['completedAt'] = _0x3458ec);
      }
      _0x7720e1["invocations"] = _0x7720e1["invocations"]["slice"](-MAX_INVOCATIONS);
      await _0x2c33e9();
    },
    async 'saveCheckpoint'(_0x542cdd) {
      _0x7720e1["checkpoint"] = cloneJson(_0x542cdd || null);
      _0x7720e1["checkpointAt"] = Date["now"]();
      await _0x2c33e9();
    },
    async 'saveQualityReview'(_0x581da4) {
      _0x7720e1["qualityReview"] = cloneJson(_0x581da4 || null);
      _0x7720e1["checkpointAt"] = Date['now']();
      await _0x2c33e9();
    },
    async 'ready'(_0x1eb620) {
      _0x7720e1["status"] = "ready_to_commit";
      _0x7720e1["candidateArtifact"] = cloneJson(_0x1eb620);
      _0x7720e1["checkpointAt"] = Date["now"]();
      await _0x2c33e9();
    },
    async 'failed'(_0x513a74) {
      _0x7720e1["status"] = "failed_retryable";
      _0x7720e1["error"] = normalizeText(_0x513a74?.["message"] || _0x513a74);
      const _0x1e080c = _0x513a74?.["experimentalDraft"] || _0x513a74?.["partialResult"];
      _0x1e080c && (_0x7720e1["checkpoint"] = cloneJson(_0x1e080c), _0x7720e1["checkpointAt"] = Date["now"]());
      await _0x2c33e9();
    },
    async 'succeeded'() {
      _0x7720e1["status"] = 'succeeded';
      _0x7720e1['candidateArtifact'] = null;
      _0x7720e1["checkpoint"] = null;
      _0x7720e1["qualityReview"] = null;
      _0x7720e1['checkpointAt'] = Date['now']();
      _0x7720e1['error'] = '';
      await _0x2c33e9();
    }
  });
}