import { emitGenerationTaskCenterUpdate } from '../generationTaskCenterEvents.js';
import { normalizeTaskCenterStatus } from '../taskCenterModel.js';
import { getModelManifest } from '../../manifests/index.js';
import { resolveTaskCenterThumbnail } from '../taskCenterThumbnail.js';
import { getStoryAssetAppearances } from './storyAssetAppearances.js';
function resultThumbnail(_0x2415a1, _0x21c56e) {
  if (_0x21c56e["type"] === "asset-image") {
    const _0x528336 = _0x2415a1["assets"]?.["find"](_0x554203 => _0x554203['id'] === _0x21c56e["scope"]?.["assetId"]);
    const _0x2d0f6b = _0x528336 && getStoryAssetAppearances(_0x528336)["find"](_0x4f6ab4 => _0x4f6ab4['id'] === _0x21c56e["scope"]?.["appearanceId"]);
    return _0x2d0f6b ? resolveTaskCenterThumbnail({
      'images': _0x2d0f6b["generatedImages"]?.['length'] ? _0x2d0f6b["generatedImages"] : [_0x2d0f6b['generatedImage'] || _0x2d0f6b]
    }, 'image') : null;
  }
  if (_0x21c56e["type"] === 'clip-video') {
    const _0x4b9e07 = _0x2415a1["episodes"]?.["find"](_0x2a65c6 => _0x2a65c6['id'] === _0x21c56e["scope"]?.["episodeId"]);
    const _0x2fff80 = _0x4b9e07?.["clips"]?.['find'](_0x5ba94b => _0x5ba94b['id'] === _0x21c56e['scope']?.["clipId"]);
    return resolveTaskCenterThumbnail(_0x2fff80?.["video"]?.['results']?.['at'](-0x1), 'video');
  }
  return null;
}
export function reportStoryTaskCenter(_0x168ed7 = {}) {
  const _0x2c12b8 = _0x168ed7['project'];
  if (!_0x2c12b8?.['id']) {
    return;
  }
  for (const _0x303a03 of _0x2c12b8["backgroundTasks"] || []) {
    const _0x3594cc = normalizeTaskCenterStatus(_0x303a03["status"]);
    if (!_0x3594cc) {
      continue;
    }
    const _0x2cb15c = getModelManifest(_0x303a03["modelId"]);
    emitGenerationTaskCenterUpdate({
      'taskId': "story:" + _0x2c12b8['id'] + ':' + _0x303a03['id'] + ':' + _0x303a03["startedAt"],
      'source': "story-workspace",
      'kind': _0x303a03['type'],
      'title': _0x303a03["label"],
      'projectId': _0x2c12b8['id'],
      'projectTitle': _0x2c12b8['title'] || _0x2c12b8['name'] || '',
      'provider': _0x303a03["provider"] || _0x2cb15c?.["provider"] || '',
      'modelId': _0x303a03["modelId"],
      'providerProfileId': _0x303a03["providerProfileId"] || '',
      'adapterType': _0x2cb15c?.['adapterType'] || '',
      'remoteTaskId': _0x303a03["remoteTaskId"],
      'status': _0x3594cc,
      'message': _0x303a03['message'],
      'error': _0x303a03["error"],
      'startedAt': _0x303a03["startedAt"],
      'createdAt': _0x303a03["startedAt"],
      'finishedAt': _0x303a03["finishedAt"],
      'progress': null,
      'cancellable': ![],
      'thumbnail': _0x3594cc === "complete" ? resultThumbnail(_0x168ed7, _0x303a03) : null,
      'navigation': {
        'source': "story-workspace",
        'projectId': _0x2c12b8['id'],
        ..._0x303a03['scope']
      }
    });
  }
}