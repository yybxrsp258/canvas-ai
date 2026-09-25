import { publishTaskCenterSnapshot } from '../generationTaskCenterEvents.js';
import { normalizeTaskCenterStatus } from '../taskCenterModel.js';
import { getModelManifest } from '../../manifests/index.js';
import { resolveTaskCenterThumbnail } from '../taskCenterThumbnail.js';
function latestBatch(_0xed307 = []) {
  const _0x1a1a27 = _0xed307['at'](-0x1);
  if (!_0x1a1a27) {
    return [];
  }
  return _0x1a1a27['createdAt'] ? _0xed307['filter'](_0x46d994 => _0x46d994["createdAt"] === _0x1a1a27["createdAt"]) : [_0x1a1a27];
}
export function reportReplacementTaskCenter(_0x5ae4b4 = {}) {
  if (!_0x5ae4b4['id']) {
    return;
  }
  const _0x50ae86 = _0x5ae4b4["workspace"] || {};
  const _0x228698 = [];
  const _0x1d3276 = (_0x30d0f2, _0x3d8946, _0x1c8e2e = {}, _0x5dfa99 = {}, _0x174e27 = null) => {
    const _0x28e24d = normalizeTaskCenterStatus(_0x1c8e2e["status"]);
    if (!_0x28e24d) {
      return;
    }
    const _0x2b6885 = getModelManifest(_0x1c8e2e["modelId"]);
    _0x228698["push"]({
      'taskId': "replacement:" + _0x5ae4b4['id'] + ':' + _0x30d0f2 + ':' + (_0x1c8e2e['requestId'] || _0x1c8e2e["startedAt"] || "current"),
      'source': 'replacement-studio',
      'kind': _0x30d0f2['split'](':')[0x0],
      'title': _0x3d8946,
      'projectId': _0x5ae4b4['id'],
      'projectTitle': _0x5ae4b4["name"] || _0x5ae4b4["title"] || '',
      'modelId': _0x1c8e2e["modelId"] || '',
      'provider': _0x1c8e2e["provider"] || _0x2b6885?.["provider"] || '',
      'providerProfileId': _0x1c8e2e['providerProfileId'] || '',
      'adapterType': _0x2b6885?.["adapterType"] || '',
      'remoteTaskId': _0x1c8e2e['taskId'] || '',
      'status': _0x28e24d,
      'message': _0x1c8e2e['message'] || '',
      'error': _0x1c8e2e["error"] || '',
      'progress': Number["isFinite"](_0x1c8e2e["progress"]) ? _0x1c8e2e["progress"] / 0x64 : null,
      'createdAt': Number(_0x1c8e2e["startedAt"]) || 0x0,
      'startedAt': Number(_0x1c8e2e["startedAt"]) || 0x0,
      'finishedAt': Number(_0x1c8e2e["finishedAt"]) || 0x0,
      'cancellable': ![],
      'thumbnail': _0x28e24d === "complete" ? resolveTaskCenterThumbnail(_0x174e27, _0x30d0f2["split"](':')[0x0]) : null,
      'navigation': {
        'source': 'replacement-studio',
        'projectId': _0x5ae4b4['id'],
        ..._0x5dfa99
      }
    });
  };
  for (const [_0xfba7f, _0xc4eb3c] of [['image', _0x50ae86["imageGenerationsByShotId"]], ["video", _0x50ae86["videoGenerationsByShotId"]]]) {
    for (const [_0x54ffaf, _0x2ef99e] of Object['entries'](_0xc4eb3c || {})) {
      const _0x42be8e = _0x5ae4b4["shots"]?.['find'](_0x1297ea => _0x1297ea['id'] === _0x54ffaf);
      const _0x4afe8d = latestBatch(_0x42be8e?.[_0xfba7f === "image" ? "replacementImage" : "replacementVideo"]?.["results"]);
      _0x1d3276(_0xfba7f + ':' + _0x54ffaf, (_0x42be8e?.["name"] || _0x42be8e?.["title"] || _0x54ffaf) + '\x20·\x20' + (_0xfba7f === "image" ? "图片生成" : "视频生成"), _0x2ef99e, {
        'shotId': _0x54ffaf,
        'step': _0xfba7f === 'image' ? 0x2 : 0x3
      }, _0x4afe8d["length"] ? {
        [_0xfba7f === "image" ? "images" : "videos"]: _0x4afe8d
      } : null);
    }
  }
  _0x1d3276("analysis", "原片分析", _0x50ae86["sourceAnalysis"]);
  _0x1d3276('identity', "人物识别", _0x50ae86["identityAnalysis"]);
  _0x1d3276("preparation", "镜头准备", _0x50ae86["videoPreparation"]);
  for (const _0x255ce4 of _0x5ae4b4['characters'] || []) {
    for (const _0x678805 of _0x255ce4["appearances"] || []) {
      _0x1d3276("appearance:" + _0x255ce4['id'] + ':' + _0x678805['id'], (_0x255ce4['name'] || '角色') + " · " + (_0x678805["name"] || "形象生成"), {
        'status': _0x678805["generationStatus"],
        'error': _0x678805["error"]
      }, {
        'characterId': _0x255ce4['id'],
        'appearanceId': _0x678805['id']
      }, _0x678805["generatedImage"] || _0x678805);
    }
  }
  publishTaskCenterSnapshot({
    'source': "replacement-studio",
    'projectId': _0x5ae4b4['id']
  }, _0x228698);
}