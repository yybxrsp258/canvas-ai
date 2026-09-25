import { parseStoryEpisodeSplitResult } from '../storyGenerationApi.js';
import { reviewStoryEpisodeSplitQuality as a140_0x1e8d4b } from './storyEpisodeSplitQualityReview.js';
import { resolveStoryPromptModeClipMaxSeconds } from '../../src/domain/storyGeneration/promptModeRules.js';
import { groupStoryEpisodeRepairClips } from './storyEpisodeRepairGrouping.js';
function normalizeText(_0x1b9a6a) {
  return String(_0x1b9a6a || '')["trim"]();
}
export function reviewStoryEpisodeSplitQuality(_0x4b83a2 = {}) {
  const _0x1014af = {
    ...(_0x4b83a2['project']?.['planning'] || {}),
    ...(_0x4b83a2['constraints'] || {})
  };
  const _0x581e37 = normalizeText(_0x1014af["promptMode"]) || "seedance-2.0";
  _0x1014af["sceneMaxSeconds"] = resolveStoryPromptModeClipMaxSeconds(_0x581e37, _0x1014af["sceneMaxSeconds"]);
  return a140_0x1e8d4b({
    ..._0x4b83a2,
    'constraints': _0x1014af,
    'validateClips': ({
      episodeRef: _0xf6e2a3,
      clips: _0x59416f
    }) => groupStoryEpisodeRepairClips(parseStoryEpisodeSplitResult({
      'episodeRef': _0xf6e2a3,
      'clips': _0x59416f
    }, {
      'episodeRef': _0xf6e2a3,
      'episode': _0x4b83a2["episode"],
      'scriptMode': normalizeText(_0x4b83a2["project"]?.["scriptMode"]),
      'constraints': _0x1014af,
      'assets': _0x4b83a2['assets'],
      'minimumShotsPerClip': 0x1,
      'maximumShotsPerClip': 0xc,
      'repairMissingShotFields': !![],
      'requireAllPlanCharacters': ![],
      'completeCharacterAssetUsages': ![],
      'clipDurationConstraints': _0x4b83a2['clipDurationConstraints'],
      'rejectUnsupportedClipDuration': Boolean(_0x4b83a2["clipDurationConstraints"]),
      'promptMode': _0x581e37
    })['clips'], {
      'promptMode': _0x581e37,
      'maxSeconds': _0x1014af["sceneMaxSeconds"],
      'assets': _0x4b83a2["assets"],
      'rawClips': _0x59416f
    })
  });
}