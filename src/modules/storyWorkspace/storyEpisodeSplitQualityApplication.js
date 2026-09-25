import { buildVideoReplicationGenerationAssets } from '../../domain/storyGeneration/videoReplicationGenerationAssets.js';
export async function runStoryEpisodeSplitQualityReview({
  reviewEpisodeSplit: _0xbefab8,
  result: _0x35c7e2,
  episode: _0x3bca5a,
  context: _0x4acee1,
  projectData: _0x2d9ee6,
  splitRun: _0x12e1b3,
  clipDurationConstraints = null,
  onProgress = null
} = {}) {
  if (typeof _0xbefab8 !== 'function' || !_0x35c7e2) {
    return _0x35c7e2;
  }
  return _0xbefab8({
    'project': _0x4acee1?.["project"],
    'episode': _0x3bca5a,
    'result': _0x35c7e2,
    'assets': buildVideoReplicationGenerationAssets(_0x2d9ee6?.["assets"], _0x4acee1?.["project"]),
    'constraints': _0x4acee1?.['project']?.["planning"],
    'model': _0x12e1b3["execution"]["modelId"],
    'provider': _0x12e1b3['execution']["provider"],
    'providerProfileId': _0x12e1b3["execution"]["providerProfileId"],
    'clipDurationConstraints': clipDurationConstraints,
    'resumeDraft': _0x12e1b3['qualityReview'],
    'onCheckpoint': _0x12e1b3["saveQualityReview"],
    'onInvocation': _0x12e1b3["onInvocation"],
    'onProgress': onProgress
  });
}