import { buildStoryReplicationAdaptationInput, prepareStoryReplicationGenerationScript } from '../../../api/storyReplicationAdaptationApi.js';
import { parseUploadedStoryEpisodeScenes } from './storyScriptImport.js';
import { getStoryReplicationBindingError } from './storyReplicationReplacement.js';
export function assertStoryReplicationGenerationCurrent(_0x83ce41, _0x24177b) {
  if (!_0x24177b["replication"]?.["generationPrepared"]) {
    return;
  }
  const _0xed0823 = _0x83ce41["episodes"]["find"](_0x485ede => _0x485ede['id'] === _0x24177b['id']);
  if (!_0xed0823 || JSON["stringify"](buildStoryReplicationAdaptationInput({
    'project': _0x83ce41["project"],
    'episode': _0xed0823,
    'assets': _0x83ce41["assets"]
  })) !== _0x24177b['replication']["adaptedScript"]["inputKey"]) {
    throw new Error("替换设置或原片核对内容已变化，请按最新设置重新生成；本次结果未覆盖原片。");
  }
}
export async function prepareStoryReplicationGenerationEpisode({
  episode: _0xd1f52e,
  projectData: _0x454a96,
  execution: _0x577d8c,
  onInvocation: _0x5ec252,
  onProgress: _0x2c373d,
  isActive: _0x5cfb2a,
  persist: _0x4b12d7,
  request = prepareStoryReplicationGenerationScript
}) {
  if (!_0xd1f52e["replication"]?.["sourceAnalysis"]) {
    return _0xd1f52e;
  }
  const _0x73d3c6 = getStoryReplicationBindingError(_0x454a96);
  if (_0x73d3c6) {
    throw new Error(_0x73d3c6);
  }
  const _0x2665fb = buildStoryReplicationAdaptationInput({
    'project': _0x454a96["project"],
    'episode': _0xd1f52e,
    'assets': _0x454a96["assets"]
  });
  const _0x3b132a = JSON["stringify"](_0x2665fb);
  let _0x1d8d66 = _0xd1f52e['replication']["adaptedScript"];
  if (_0x1d8d66?.['inputKey'] !== _0x3b132a) {
    _0x2c373d?.({
      'message': "正在按人物替换和对白语言整理原剧情分镜正文"
    });
    const _0x33818d = await request({
      'input': _0x2665fb,
      'model': _0x577d8c["modelId"],
      'provider': _0x577d8c["provider"],
      'providerProfileId': _0x577d8c['providerProfileId'],
      'onInvocation': _0x5ec252
    });
    if (!_0x5cfb2a()) {
      throw new Error("视频生成所属项目已失效。");
    }
    if (JSON["stringify"](buildStoryReplicationAdaptationInput({
      'project': _0x454a96["project"],
      'episode': _0xd1f52e,
      'assets': _0x454a96['assets']
    })) !== _0x3b132a) {
      throw new Error("替换设置已变化，请按最新设置重新生成；原片分析已保留。");
    }
    _0x1d8d66 = {
      ..._0x33818d,
      'inputKey': _0x3b132a
    };
    _0xd1f52e["replication"]["adaptedScript"] = _0x1d8d66;
    try {
      await _0x4b12d7();
    } catch (_0x4a662e) {
      delete _0xd1f52e["replication"]["adaptedScript"];
      throw _0x4a662e;
    }
  }
  if (!_0x5cfb2a()) {
    throw new Error("视频生成所属项目已失效。");
  }
  return {
    ..._0xd1f52e,
    'title': _0x1d8d66["title"] || _0xd1f52e["title"],
    'synopsis': _0x1d8d66['fullScript']["slice"](0x0, 0xb4),
    'script': {
      ..._0xd1f52e["script"],
      'fullText': _0x1d8d66["fullScript"],
      'scenes': parseUploadedStoryEpisodeScenes({
        'fullText': _0x1d8d66["fullScript"],
        'episodeRef': _0xd1f52e['id'],
        'fallbackHeading': _0x1d8d66["title"] || _0xd1f52e["title"]
      })
    },
    'replication': {
      ..._0xd1f52e['replication'],
      'generationPrepared': !![]
    }
  };
}