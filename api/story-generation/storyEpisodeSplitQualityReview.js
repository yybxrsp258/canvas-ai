import { generateText } from '../aiTextApi.js';
import { buildVideoReplicationTimingGuidance } from '../../src/domain/storyGeneration/videoReplicationSourceAnalysis.js';
import { getVideoReplicationAudioLanguage, buildVideoReplicationAudioLanguageRule } from '../../src/domain/storyGeneration/videoReplicationLanguage.js';
import { parseStrictJson } from '../utils/strictJson.js';
import { getStoryEpisodeClipGroupingRequirements } from '../../src/domain/storyGeneration/promptModeRules.js';
import { invokeStoryGenerationRequest } from './storyInvocationEvidence.js';
import { buildStoryTextProviderProfilePayload, getResultText } from './storyTextRequest.js';
import { STORY_MAX_SPOKEN_UNITS_PER_SECOND, countStorySpokenUnits, normalizeStoryEpisodeSpokenTiming } from './storyEpisodeSpokenTiming.js';
export const STORY_EPISODE_SPLIT_QUALITY_SCHEMA_VERSION = 0x4;
export const STORY_EPISODE_SPLIT_QUALITY_BATCH_SIZE = 0xa;
const MAX_SOURCE_CHARACTERS = 0x8ca0;
const MAX_OUTPUT_TOKENS = 0x2ee0;
const REQUEST_TIMEOUT_MS = 0x8 * 0x3c * 0x3e8;
const MAX_SPOKEN_UNITS_PER_SECOND = STORY_MAX_SPOKEN_UNITS_PER_SECOND;
const BLOCKING_LOCAL_SIGNAL_CODES = new Set(["duration_sum_mismatch", "dialogue_timing_suspicious"]);
const REVIEW_SYSTEM_PROMPT = ["你是短剧分镜成片前的独立审片员。你的任务是发现具体片段的问题，不是重新规划整集。", '片段数量和整集总时长没有固定正确值，绝不能因为片段多、片段少、整集长或整集短而判失败。', "时长必须按当前剧本内容判断：对白能否自然说完、动作是否能完成、情绪停顿和镜头调度是否有足够时间。", "只根据给出的原剧本、候选片段和邻接关系判定；没有明确问题就通过。只返回严格 JSON。"]["join"]('\x0a');
function normalizeText(_0x275f2b) {
  return String(_0x275f2b || '')["trim"]();
}
function cloneJson(_0x1e8a45) {
  if (_0x1e8a45 == null) {
    return _0x1e8a45;
  }
  return JSON['parse'](JSON["stringify"](_0x1e8a45));
}
function stableSerialize(_0x146926) {
  if (Array["isArray"](_0x146926)) {
    return '[' + _0x146926["map"](stableSerialize)['join'](',') + ']';
  }
  if (_0x146926 && typeof _0x146926 === "object") {
    return '{' + Object["keys"](_0x146926)["sort"]()["map"](_0x15b0b0 => JSON["stringify"](_0x15b0b0) + ':' + stableSerialize(_0x146926[_0x15b0b0]))["join"](',') + '}';
  }
  return JSON["stringify"](_0x146926 ?? null);
}
function fingerprint(_0x51087e) {
  const _0x2726dd = stableSerialize(_0x51087e);
  let _0x14e3e7 = 0x811c9dc5;
  for (let _0x4c08e5 = 0x0; _0x4c08e5 < _0x2726dd['length']; _0x4c08e5 += 0x1) {
    _0x14e3e7 ^= _0x2726dd['charCodeAt'](_0x4c08e5);
    _0x14e3e7 = Math["imul"](_0x14e3e7, 0x1000193);
  }
  return "fnv1a-" + (_0x14e3e7 >>> 0x0)['toString'](0x10)["padStart"](0x8, '0');
}
function getEpisodeRef(_0x2efc82 = {}, _0x3e8061 = {}) {
  return normalizeText(_0x3e8061?.['episodeRef'] || _0x2efc82?.["ref"] || _0x2efc82?.["planningRef"] || _0x2efc82?.['id']) || "episode-1";
}
function getEpisodeSource(_0xf59fb5 = {}) {
  const _0x37e411 = normalizeText(_0xf59fb5?.['script']?.["fullText"]);
  if (_0x37e411) {
    return _0x37e411["slice"](0x0, MAX_SOURCE_CHARACTERS);
  }
  return (Array["isArray"](_0xf59fb5?.['script']?.["scenes"]) ? _0xf59fb5['script']["scenes"] : [])["map"](_0x3c3999 => [_0x3c3999?.["heading"], _0x3c3999?.["body"]]['map'](normalizeText)["filter"](Boolean)["join"]('\x0a'))["filter"](Boolean)["join"]('\x0a\x0a')["slice"](0x0, MAX_SOURCE_CHARACTERS);
}
function getSpokenText(_0x20f1d3 = {}) {
  return [_0x20f1d3?.["dialogue"], _0x20f1d3?.['voiceover']]["map"](normalizeText)["filter"](Boolean)["join"]('\x0a');
}
export function inspectStoryEpisodeSplitLocalSignals({
  clips = []
} = {}) {
  const _0x271942 = [];
  (Array["isArray"](clips) ? clips : [])["forEach"](_0xc995fc => {
    const _0x1368ec = normalizeText(_0xc995fc?.["ref"]);
    const _0x1811be = Array["isArray"](_0xc995fc?.["shots"]) ? _0xc995fc['shots'] : [];
    const _0x143d7c = _0x1811be['reduce']((_0x25a0da, _0x1c0ccb) => _0x25a0da + Math['max'](0x0, Number(_0x1c0ccb?.["durationSec"]) || 0x0), 0x0);
    const _0x1a111a = Math["max"](0x0, Number(_0xc995fc?.["durationSec"]) || 0x0);
    Math["abs"](_0x143d7c - _0x1a111a) > 0.11 && _0x271942['push']({
      'clipRef': _0x1368ec,
      'code': "duration_sum_mismatch",
      'message': "片段时长 " + _0x1a111a + '\x20秒与镜头合计\x20' + Number(_0x143d7c["toFixed"](0x1)) + " 秒不一致"
    });
    _0x1811be['forEach']((_0x302271, _0x44350b) => {
      const _0x978ebe = getSpokenText(_0x302271);
      const _0x53d0c1 = countStorySpokenUnits(_0x978ebe);
      const _0x352d48 = Math["max"](0x0, Number(_0x302271?.["durationSec"]) || 0x0);
      const _0x1cc9ba = _0x352d48 ? _0x53d0c1 / _0x352d48 : 0x0;
      _0x53d0c1 >= 0x8 && _0x1cc9ba > MAX_SPOKEN_UNITS_PER_SECOND && _0x271942["push"]({
        'clipRef': _0x1368ec,
        'shotIndex': _0x44350b,
        'code': "dialogue_timing_suspicious",
        'message': "镜头 " + (_0x44350b + 0x1) + " 约 " + Number(_0x1cc9ba['toFixed'](0x1)) + " 字/词每秒，需结合语气与表演复核"
      });
    });
  });
  return _0x271942;
}
function getBlockingStoryEpisodeSplitLocalSignals(_0x37db12 = []) {
  return (Array['isArray'](_0x37db12) ? _0x37db12 : [])["filter"](_0x7e2e15 => BLOCKING_LOCAL_SIGNAL_CODES["has"](normalizeText(_0x7e2e15?.["code"])));
}
function getStoryEpisodeSplitLocalRepairInstruction(_0x80f46 = {}) {
  return _0x80f46?.["code"] === "dialogue_timing_suspicious" ? "拆成足够多个连续片段或镜头，为完整对白保留自然说话时间；禁止删改对白或依靠高速口播。" : "修正片段与镜头的时长分项，使片段总时长等于全部镜头时长之和。";
}
function applyBlockingLocalSignalsToAssessments(_0x13d204 = [], _0x3677c5 = []) {
  const _0x4b8bc7 = new Map();
  getBlockingStoryEpisodeSplitLocalSignals(_0x3677c5)['forEach'](_0x4883e5 => {
    const _0x36bf01 = normalizeText(_0x4883e5?.["clipRef"]);
    if (!_0x36bf01) {
      return;
    }
    const _0x4acf0e = _0x4b8bc7["get"](_0x36bf01) || [];
    _0x4acf0e["push"](_0x4883e5);
    _0x4b8bc7['set'](_0x36bf01, _0x4acf0e);
  });
  return _0x13d204["map"](_0x2135cf => {
    const _0x349695 = _0x4b8bc7["get"](normalizeText(_0x2135cf?.['clipRef'])) || [];
    if (!_0x349695["length"]) {
      return _0x2135cf;
    }
    const _0x25600c = Array['isArray'](_0x2135cf?.["issues"]) ? [..._0x2135cf["issues"]] : [];
    _0x349695["forEach"](_0x185c5f => {
      const _0x44e8fb = normalizeText(_0x185c5f?.["message"]);
      if (_0x25600c['some'](_0x489237 => _0x489237?.["code"] === _0x185c5f["code"] && _0x489237?.['reason'] === _0x44e8fb)) {
        return;
      }
      _0x25600c["push"]({
        'code': normalizeText(_0x185c5f?.['code']),
        'reason': _0x44e8fb,
        'repairInstruction': getStoryEpisodeSplitLocalRepairInstruction(_0x185c5f)
      });
    });
    return {
      ..._0x2135cf,
      'verdict': "repair",
      'issues': _0x25600c
    };
  });
}
function assertStoryEpisodeSplitLocalTiming(_0x14ea87 = []) {
  const _0xb5285a = getBlockingStoryEpisodeSplitLocalSignals(inspectStoryEpisodeSplitLocalSignals({
    'clips': _0x14ea87
  }));
  if (!_0xb5285a["length"]) {
    return _0x14ea87;
  }
  throw new Error(_0xb5285a["map"](_0x3a4092 => normalizeText(_0x3a4092?.["message"]))["filter"](Boolean)["join"]('；'));
}
function getStoryEpisodeSplitSpokenTimingBudget(_0x493eb4 = {}, _0x270e14 = 0x0) {
  const _0x51c344 = (Array['isArray'](_0x493eb4?.["shots"]) ? _0x493eb4['shots'] : [])["reduce"]((_0x2927fb, _0x19184e) => _0x2927fb + countStorySpokenUnits([normalizeText(_0x19184e?.["dialogue"]), normalizeText(_0x19184e?.["voiceover"])]['filter'](Boolean)['join']('\x0a')), 0x0);
  if (!_0x51c344) {
    return null;
  }
  const _0x43a975 = Math['ceil'](_0x51c344 / MAX_SPOKEN_UNITS_PER_SECOND * 0xa) / 0xa;
  return {
    'spokenUnits': _0x51c344,
    'maxSpokenUnitsPerSecond': MAX_SPOKEN_UNITS_PER_SECOND,
    'minimumSpokenDurationSeconds': _0x43a975,
    'minimumClipCountForSpokenContent': _0x270e14 ? Math["max"](0x1, Math["ceil"](_0x43a975 / _0x270e14)) : 0x1
  };
}
function compactClip(_0xfe8f2f = {}) {
  return {
    'ref': normalizeText(_0xfe8f2f['ref']),
    'script': normalizeText(_0xfe8f2f["script"]),
    'durationSec': Number(_0xfe8f2f["durationSec"]) || 0x0,
    'shots': (Array["isArray"](_0xfe8f2f["shots"]) ? _0xfe8f2f["shots"] : [])["map"]((_0x1a715c, _0x891fc3) => ({
      'index': _0x891fc3 + 0x1,
      'durationSec': Number(_0x1a715c?.["durationSec"]) || 0x0,
      'assetUsages': Array["isArray"](_0x1a715c?.['assetUsages']) ? _0x1a715c['assetUsages'] : [],
      'assetRefs': Array["isArray"](_0x1a715c?.['assetRefs']) ? _0x1a715c['assetRefs'] : [],
      'visual': normalizeText(_0x1a715c?.["visual"]),
      'camera': normalizeText(_0x1a715c?.['camera']),
      'dialogue': normalizeText(_0x1a715c?.["dialogue"]),
      'voiceover': normalizeText(_0x1a715c?.['voiceover']),
      'audio': normalizeText(_0x1a715c?.["audio"])
    }))
  };
}
function compactAssets(_0x580e40 = [], _0x5d4954 = [], _0x54c5e7 = '') {
  const _0x556de8 = new Set(_0x5d4954["flatMap"](_0x1a1e18 => Array["isArray"](_0x1a1e18?.['assetRefs']) ? _0x1a1e18['assetRefs'] : []));
  const _0x24c4f5 = normalizeText(_0x54c5e7);
  return (Array["isArray"](_0x580e40) ? _0x580e40 : [])["filter"](_0x1b296d => _0x556de8['has'](normalizeText(_0x1b296d?.["ref"])) || _0x24c4f5['includes'](normalizeText(_0x1b296d?.["ref"])) || _0x24c4f5["includes"](normalizeText(_0x1b296d?.["name"])))["map"](_0x2b360b => ({
    'ref': normalizeText(_0x2b360b?.["ref"]),
    'name': normalizeText(_0x2b360b?.["name"]),
    'kind': normalizeText(_0x2b360b?.['kind']),
    'description': normalizeText(_0x2b360b?.["description"]),
    'occurrences': normalizeText(_0x2b360b?.["occurrences"]),
    'sourceChapterIds': (Array['isArray'](_0x2b360b?.["sourceChapterIds"]) ? _0x2b360b["sourceChapterIds"] : [])["map"](normalizeText)["filter"](Boolean),
    'appearances': (Array["isArray"](_0x2b360b?.["appearances"]) ? _0x2b360b["appearances"] : [])["map"](_0xfec208 => ({
      'ref': normalizeText(_0xfec208?.["ref"]),
      'name': normalizeText(_0xfec208?.["name"]),
      'description': normalizeText(_0xfec208?.['description']),
      'occurrences': normalizeText(_0xfec208?.["occurrences"]),
      'sourceChapterIds': (Array['isArray'](_0xfec208?.['sourceChapterIds']) ? _0xfec208["sourceChapterIds"] : [])["map"](normalizeText)["filter"](Boolean)
    }))
  }));
}
function createBatches(_0x100cb3, _0x3756b4) {
  const _0x25780c = [];
  for (let _0x546b31 = 0x0; _0x546b31 < _0x100cb3["length"]; _0x546b31 += _0x3756b4) {
    const _0xe6685e = _0x100cb3["slice"](_0x546b31, _0x546b31 + _0x3756b4);
    _0x25780c['push']({
      'ref': "quality-batch-" + (_0x25780c["length"] + 0x1),
      'startIndex': _0x546b31,
      'clipRefs': _0xe6685e["map"](_0x58b0c2 => _0x58b0c2["ref"])
    });
  }
  return _0x25780c;
}
function normalizeAssessment(_0x4fa3c9, _0x583d2a) {
  const _0x33c83f = (Array["isArray"](_0x4fa3c9?.["issues"]) ? _0x4fa3c9["issues"] : [])["map"](_0x1aea7f => ({
    'code': normalizeText(_0x1aea7f?.["code"]) || 'other',
    'reason': normalizeText(_0x1aea7f?.['reason']),
    'repairInstruction': normalizeText(_0x1aea7f?.["repairInstruction"])
  }))["filter"](_0x219baf => _0x219baf["reason"] || _0x219baf['repairInstruction']);
  const _0x41015f = _0x4fa3c9?.["verdict"] === "repair" && _0x33c83f["length"] ? "repair" : "pass";
  return {
    'clipRef': _0x583d2a,
    'verdict': _0x41015f,
    'issues': _0x41015f === "repair" ? _0x33c83f : []
  };
}
function parseReviewResponse(_0x16348c, {
  episodeRef: _0x433880,
  batchRef: _0x1b976c,
  clipRefs: _0x224cf7
}) {
  const _0x5769cd = parseStrictJson(getResultText(_0x16348c), "审片 Agent 未返回有效 JSON。");
  if (normalizeText(_0x5769cd?.["episodeRef"]) !== _0x433880) {
    throw new Error("审片结果与当前分集不一致。");
  }
  if (normalizeText(_0x5769cd?.['batchRef']) !== _0x1b976c) {
    throw new Error("审片结果与当前批次不一致。");
  }
  const _0x20f5db = new Map((Array["isArray"](_0x5769cd?.["assessments"]) ? _0x5769cd["assessments"] : [])["map"](_0x3f3fb0 => [normalizeText(_0x3f3fb0?.["clipRef"]), _0x3f3fb0]));
  const _0x1ab07f = [..._0x20f5db["keys"]()]['find'](_0x46880f => !_0x224cf7['includes'](_0x46880f));
  if (_0x1ab07f) {
    throw new Error("审片结果包含当前批次之外的片段 " + _0x1ab07f + '。');
  }
  return _0x224cf7["map"](_0x4075f8 => {
    if (!_0x20f5db["has"](_0x4075f8)) {
      throw new Error("审片结果遗漏片段 " + _0x4075f8 + '。');
    }
    return normalizeAssessment(_0x20f5db["get"](_0x4075f8), _0x4075f8);
  });
}
function buildReviewPrompt({
  episodeRef: _0x1db7d5,
  episode: _0x11cb4a,
  batchRef: _0x3cbb9e,
  clips: _0xb15ad2,
  neighboringClips: _0x187b24,
  assets: _0x2d0785,
  localSignals: _0x286e38,
  phase: _0x18801a,
  constraints: _0x1d55c2
}) {
  const _0x58c6f5 = Math["max"](0x0, Number(_0x1d55c2?.["sceneMaxSeconds"]) || 0x0);
  return JSON["stringify"]({
    'task': "review_story_episode_split_quality",
    'schemaVersion': STORY_EPISODE_SPLIT_QUALITY_SCHEMA_VERSION,
    'phase': _0x18801a,
    'episodeRef': _0x1db7d5,
    'batchRef': _0x3cbb9e,
    'episode': {
      'title': normalizeText(_0x11cb4a?.["title"]),
      'synopsis': normalizeText(_0x11cb4a?.["synopsis"]),
      'sourceScript': getEpisodeSource(_0x11cb4a)
    },
    'clips': _0xb15ad2["map"](compactClip),
    'neighboringClips': _0x187b24['map'](compactClip),
    'assets': compactAssets(_0x2d0785, [..._0xb15ad2, ..._0x187b24]),
    'localSignals': _0x286e38,
    'productionLimits': {
      'maxClipDurationSeconds': _0x58c6f5
    },
    'criteria': ["逐项核对原剧本信息是否遗漏、重复、乱序或被改写成相反含义。", "对白必须与原文一致；按人物语气、停顿和表演判断镜头时间是否足够，不使用固定字数公式直接定罪。", "动作、情绪反应和运镜必须能在各镜头 durationSec 内自然完成；一个镜头需要 15 秒时，15 秒就是正确的。", '检查相邻片段的地点、人物状态、道具、动作起止和视线是否连续。', "检查画面、摄影、声音和资产引用是否与当前剧情一致且可执行。", "人物资产只应绑定画面中实际可见的角色；仅在对白、语音、电话、名单、记录、照片文字或他人口述中被提及的人物，不得作为出镜人物资产绑定。", "人物已在前一片段或前一镜头明确离场时，后续镜头不得继续绑定其人物资产，除非原剧本明确让其重新入镜。", "选择 appearanceRef 时必须核对形象的 description、occurrences 与 sourceChapterIds，尤其区分回忆、当前时间、受伤和换装状态。", _0x58c6f5 ? '单个片段不得超过\x20' + _0x58c6f5 + '\x20秒；需要更多时间时，修复建议必须要求拆成多个连续片段，禁止建议把单片段延长到上限之外。' : '如果当前任务没有单片段时长上限，按剧情实际需要判断。', "禁止以片段数量或整集总时长作为问题；只点名有明确证据的片段。"],
    'outputContract': "episodeRef,batchRef,assessments[{clipRef,verdict:'pass'|'repair',issues[{code,reason,repairInstruction}]}]；每个输入片段恰好返回一次"
  });
}
function getNeighboringClips(_0x1ae538, _0x6c97d2, _0x27c0f9, _0x50ca1f = new Map()) {
  const _0x3a6a15 = (_0x3b08f6, _0x22f48a) => {
    if (!_0x3b08f6) {
      return null;
    }
    const _0x5db5c0 = _0x50ca1f["get"](normalizeText(_0x3b08f6["ref"]));
    if (!Array["isArray"](_0x5db5c0) || !_0x5db5c0["length"]) {
      return _0x3b08f6;
    }
    return _0x22f48a === "left" ? _0x5db5c0['at'](-0x1) : _0x5db5c0[0x0];
  };
  return [_0x3a6a15(_0x6c97d2 > 0x0 ? _0x1ae538[_0x6c97d2 - 0x1] : null, "left"), _0x3a6a15(_0x6c97d2 + _0x27c0f9 < _0x1ae538["length"] ? _0x1ae538[_0x6c97d2 + _0x27c0f9] : null, 'right')]["filter"](Boolean);
}
function buildRepairPrompt({
  episodeRef: _0x3544a8,
  episode: _0x8a2920,
  failedClips: _0x24b9d5,
  assessments: _0x34c633,
  neighbors: _0x2caa1b,
  assets: _0x56613b,
  constraints: _0x1017b1,
  repairRound = 0x1,
  previousErrorsByRef = {},
  previousClipsByRef = {}
}) {
  const _0x3bcbc5 = new Map(_0x34c633['map'](_0x592027 => [_0x592027["clipRef"], _0x592027]));
  const _0x206de3 = getStoryEpisodeClipGroupingRequirements(_0x1017b1?.['promptMode']);
  const _0x5e15cc = Math["max"](0x0, Number(_0x1017b1?.["sceneMaxSeconds"]) || 0x0);
  const _0x5fdbe3 = Object["values"](previousClipsByRef || {})["flatMap"](_0x46a340 => Array['isArray'](_0x46a340) ? _0x46a340 : []);
  return JSON['stringify']({
    'task': "repair_story_episode_split_quality",
    'schemaVersion': STORY_EPISODE_SPLIT_QUALITY_SCHEMA_VERSION,
    'episodeRef': _0x3544a8,
    'repairRound': repairRound,
    'episode': {
      'title': normalizeText(_0x8a2920?.["title"]),
      'sourceScript': getEpisodeSource(_0x8a2920)
    },
    'failedClips': _0x24b9d5["map"](_0x1f2e98 => {
      const _0x56bf96 = getStoryEpisodeSplitSpokenTimingBudget(_0x1f2e98, _0x5e15cc);
      return {
        'sourceClipRef': _0x1f2e98["ref"],
        'issues': _0x3bcbc5['get'](_0x1f2e98["ref"])?.["issues"] || [],
        ...(_0x56bf96 ? {
          'timingBudget': _0x56bf96
        } : {}),
        ...(normalizeText(previousErrorsByRef?.[_0x1f2e98['ref']]) ? {
          'previousAttemptError': normalizeText(previousErrorsByRef[_0x1f2e98["ref"]])
        } : {}),
        ...(Array['isArray'](previousClipsByRef?.[_0x1f2e98["ref"]]) ? {
          'previousAttemptClips': previousClipsByRef[_0x1f2e98["ref"]]["map"](compactClip)
        } : {}),
        'clip': compactClip(_0x1f2e98)
      };
    }),
    'readOnlyNeighboringClips': _0x2caa1b["map"](compactClip),
    'assets': compactAssets(_0x56613b, [..._0x24b9d5, ..._0x5fdbe3, ..._0x2caa1b], JSON['stringify'](_0x34c633)),
    'productionLimits': {
      'maxClipDurationSeconds': _0x5e15cc,
      'maxSpokenUnitsPerSecond': MAX_SPOKEN_UNITS_PER_SECOND
    },
    'instruction': ['只修复\x20failedClips，禁止返回或改写已经通过的片段。', '修复依据是原剧本与审片问题；时长按对白、动作、情绪和镜头实际需要重新分配。', "完整保留原片段中仍然有效的 assetUsages 与 appearanceRef；新增人物时必须从 assets.appearances 选择其具体形象。", "只给画面中实际可见的人物绑定人物资产；仅通过语音、电话、名单、记录、文字或他人口述被提及，或已经明确离场的人物，必须移除其人物资产引用。", "必须根据 assets.appearances 的 description、occurrences 与 sourceChapterIds 选择符合当前时间线和状态的 appearanceRef，禁止猜测不存在的形象 ID。", "一个失败片段可重写为一个或多个片段；若拆分，使用 sourceClipRef-part-1、sourceClipRef-part-2 等唯一 ref。", ..._0x206de3, ...(_0x206de3["length"] ? ["修复结果的每个 clip 用 startsNewNarrativeBeat 标记是否开始新的独立叙事阶段：换场、时间跳跃或剧情阶段结束后开始新阶段时为 true；同一段连续对话中的换说话人、切镜头或因时长上限续段为 false。"] : []), repairRound > 0x1 ? "这是定点重试。必须先解决 failedClips.previousAttemptError 指出的上一轮校验或复审错误，禁止原样重复上一轮结果。" : "这是第一轮定点修复。", _0x5e15cc ? "每个修复后片段不得超过 " + _0x5e15cc + " 秒；内容需要更长时间时必须拆分，禁止用超限延长解决。" : "当前任务未设置单片段时长上限。", '对白与旁白必须满足每个镜头不超过\x20' + MAX_SPOKEN_UNITS_PER_SECOND + " 字/词每秒。failedClips.timingBudget 是只计算说话内容得到的最低时间与最低片段数；动作、停顿和反应还应在此基础上增加时间。", "保留原对白文字、剧情顺序和资产真实性。只返回严格 JSON。"],
    'outputContract': "episodeRef,repairs[{sourceClipRef,clips[{ref," + (_0x206de3["length"] ? "startsNewNarrativeBeat," : '') + 'script,creativeIntent,transition,shots[{durationSec,assetUsages,assetRefs,visual,camera,dialogue,voiceover,audio}],durationSec,assetRefs}]}]'
  });
}
function parseRepairResponse(_0x4553b7, {
  episodeRef: _0x1e580e,
  failedClipRefs: _0x4b35a5
}) {
  const _0x466f2e = parseStrictJson(getResultText(_0x4553b7), "修复 Agent 未返回有效 JSON。");
  if (normalizeText(_0x466f2e?.["episodeRef"]) !== _0x1e580e) {
    throw new Error("修复结果与当前分集不一致。");
  }
  const _0x407016 = new Map();
  (Array["isArray"](_0x466f2e?.['repairs']) ? _0x466f2e["repairs"] : [])["forEach"](_0x59b639 => {
    const _0x1aef9b = normalizeText(_0x59b639?.['sourceClipRef']);
    if (!_0x4b35a5["includes"](_0x1aef9b) || _0x407016["has"](_0x1aef9b)) {
      return;
    }
    _0x407016["set"](_0x1aef9b, Array['isArray'](_0x59b639?.["clips"]) ? _0x59b639["clips"] : []);
  });
  return _0x407016;
}
function normalizeResumeDraft(_0x403e56, {
  episodeRef: _0x240800,
  candidateFingerprint: _0x9a8b6a,
  batches: _0x4563d8
}) {
  if (!_0x403e56 || Number(_0x403e56["schemaVersion"]) !== STORY_EPISODE_SPLIT_QUALITY_SCHEMA_VERSION || normalizeText(_0x403e56['episodeRef']) !== _0x240800 || normalizeText(_0x403e56["candidateFingerprint"]) !== _0x9a8b6a) {
    return null;
  }
  const _0x28758c = new Map((Array["isArray"](_0x403e56["batches"]) ? _0x403e56["batches"] : [])["map"](_0x527833 => [_0x527833["ref"], _0x527833]));
  return {
    ...cloneJson(_0x403e56),
    'batches': _0x4563d8["map"](_0x75cd5d => ({
      ..._0x75cd5d,
      ...(cloneJson(_0x28758c["get"](_0x75cd5d["ref"])) || {})
    }))
  };
}
function createDraft({
  episodeRef: _0x4f430a,
  candidateFingerprint: _0x153349,
  batches: _0x1870f1
}) {
  const _0x42c12e = Date["now"]();
  return {
    'schemaVersion': STORY_EPISODE_SPLIT_QUALITY_SCHEMA_VERSION,
    'episodeRef': _0x4f430a,
    'candidateFingerprint': _0x153349,
    'status': "reviewing",
    'batches': _0x1870f1["map"](_0x5f1a1e => ({
      ..._0x5f1a1e,
      'status': 'pending'
    })),
    'requestCount': 0x0,
    'unresolvedClipRefs': [],
    'completedClips': null,
    'createdAt': _0x42c12e,
    'updatedAt': _0x42c12e
  };
}
function createQualityReviewSummary(_0x5af553 = {}) {
  const _0x3e58df = Array["isArray"](_0x5af553['unresolvedClipRefs']) ? _0x5af553["unresolvedClipRefs"] : [];
  const _0x24f4ca = new Set(_0x3e58df);
  const _0x15947d = (Array['isArray'](_0x5af553['batches']) ? _0x5af553["batches"] : [])["flatMap"](_0xf1bb6c => (Array["isArray"](_0xf1bb6c?.['clipRefs']) ? _0xf1bb6c["clipRefs"] : [])['filter'](_0x1587c1 => _0x24f4ca["has"](_0x1587c1))['map'](_0x53063e => ({
    'clipRef': _0x53063e,
    'issues': cloneJson((Array["isArray"](_0xf1bb6c?.["assessments"]) ? _0xf1bb6c['assessments'] : [])["find"](_0x241eb7 => _0x241eb7?.["clipRef"] === _0x53063e)?.["issues"] || []),
    'error': normalizeText(_0xf1bb6c?.["repairErrors"]?.[_0x53063e] || _0xf1bb6c?.["repairError"] || _0xf1bb6c?.["error"])
  })));
  return {
    'status': _0x3e58df['length'] ? "completed_with_unresolved" : 'passed',
    'requestCount': Math["max"](0x0, Number(_0x5af553["requestCount"]) || 0x0),
    'unresolvedClipRefs': cloneJson(_0x3e58df),
    'unresolvedItems': _0x15947d
  };
}
export async function reviewStoryEpisodeSplitQuality({
  project = {},
  episode = {},
  result = {},
  assets = [],
  constraints = {},
  model = '',
  provider = '',
  providerProfileId = '',
  request = generateText,
  validateClips = ({
    clips: _0x4a77ff
  }) => _0x4a77ff,
  onProgress = null,
  onCheckpoint = null,
  onInvocation = null,
  resumeDraft = null,
  batchSize = STORY_EPISODE_SPLIT_QUALITY_BATCH_SIZE
} = {}) {
  const _0x487068 = Array['isArray'](result?.["clips"]) ? result["clips"] : [];
  if (!_0x487068["length"]) {
    throw new Error("没有可审片的分镜片段。");
  }
  const _0xd3af78 = new Map(_0x487068["map"]((_0x2d3690, _0x5cac84) => [normalizeText(_0x2d3690?.["ref"]), _0x5cac84]));
  const _0x5597ab = _0x1e858d => [..._0x1e858d]["sort"]((_0xb3b6e, _0x23dee6) => (_0xd3af78["get"](_0xb3b6e) ?? Number['MAX_SAFE_INTEGER']) - (_0xd3af78["get"](_0x23dee6) ?? Number["MAX_SAFE_INTEGER"]));
  const _0x22cb65 = getEpisodeRef(episode, result);
  const _0x225a9f = Math["max"](0x1, Math["min"](0x14, Math["trunc"](Number(batchSize) || 0xa)));
  const _0x1652f6 = createBatches(_0x487068, _0x225a9f);
  const _0x314e0f = buildVideoReplicationTimingGuidance(episode);
  const _0xa935c = fingerprint({
    'episodeRef': _0x22cb65,
    'clips': _0x487068,
    'timingGuidance': _0x314e0f
  });
  let _0x1e2608 = normalizeResumeDraft(resumeDraft, {
    'episodeRef': _0x22cb65,
    'candidateFingerprint': _0xa935c,
    'batches': _0x1652f6
  }) || createDraft({
    'episodeRef': _0x22cb65,
    'candidateFingerprint': _0xa935c,
    'batches': _0x1652f6
  });
  if (_0x1e2608["status"] === "completed" && Array["isArray"](_0x1e2608["completedClips"])) {
    return {
      ...result,
      'clips': cloneJson(_0x1e2608['completedClips']),
      'qualityReview': createQualityReviewSummary(_0x1e2608)
    };
  }
  const _0x9ddb61 = new Map();
  _0x1e2608["batches"]["forEach"](_0x41b161 => {
    Object['entries'](_0x41b161?.['replacements'] || {})["forEach"](([_0x4a6b04, _0x98f223]) => {
      _0x9ddb61["set"](_0x4a6b04, cloneJson(_0x98f223));
    });
  });
  const _0x37b43e = new Set(_0x1e2608["unresolvedClipRefs"] || []);
  let _0x5c0584 = Math['max'](0x0, Number(_0x1e2608['requestCount']) || 0x0);
  const _0x3d2623 = async () => {
    _0x1e2608['updatedAt'] = Date["now"]();
    _0x1e2608["requestCount"] = _0x5c0584;
    _0x1e2608['unresolvedClipRefs'] = _0x5597ab(_0x37b43e);
    await onCheckpoint?.(cloneJson(_0x1e2608));
  };
  const _0x1bd5de = async (_0x138b91, _0x4660d6) => {
    _0x5c0584 += 0x1;
    return invokeStoryGenerationRequest({
      'request': request,
      'requestPayload': {
        'model': normalizeText(model),
        'provider': normalizeText(provider),
        ...buildStoryTextProviderProfilePayload(providerProfileId),
        ..._0x138b91,
        'systemPrompt': [_0x138b91["systemPrompt"], _0x314e0f, buildVideoReplicationAudioLanguageRule(getVideoReplicationAudioLanguage(episode, project))]['filter'](Boolean)["join"]('\x0a'),
        'thinking': {
          'type': "disabled"
        },
        'temperature': 0.1,
        'maxOutputTokens': MAX_OUTPUT_TOKENS,
        'timeoutMs': REQUEST_TIMEOUT_MS
      },
      'stepId': _0x4660d6,
      'attempt': _0x5c0584,
      'onInvocation': onInvocation,
      'serializeResponse': getResultText
    });
  };
  for (let _0x27e6f2 = 0x0; _0x27e6f2 < _0x1e2608["batches"]['length']; _0x27e6f2 += 0x1) {
    const _0x144dfd = _0x1e2608['batches'][_0x27e6f2];
    if (_0x144dfd['status'] === "completed") {
      continue;
    }
    const _0x568bff = _0x487068["slice"](_0x144dfd['startIndex'], _0x144dfd["startIndex"] + _0x144dfd["clipRefs"]["length"]);
    const _0x4798a0 = getNeighboringClips(_0x487068, _0x144dfd["startIndex"], _0x568bff["length"], _0x9ddb61);
    const _0x33cd5a = inspectStoryEpisodeSplitLocalSignals({
      'clips': _0x568bff
    });
    onProgress?.({
      'stage': "reviewing-episode-split-quality",
      'current': _0x27e6f2 + 0x1,
      'total': _0x1e2608['batches']["length"],
      'message': "正在审片 " + (_0x27e6f2 + 0x1) + '/' + _0x1e2608["batches"]["length"] + '，检查剧情、时长与连续性'
    });
    let _0x22de57 = _0x144dfd["status"] === "reviewed" && Array['isArray'](_0x144dfd['assessments']) ? _0x144dfd['assessments'] : null;
    try {
      if (!_0x22de57) {
        const _0x3bc28b = await _0x1bd5de({
          'prompt': buildReviewPrompt({
            'episodeRef': _0x22cb65,
            'episode': episode,
            'batchRef': _0x144dfd["ref"],
            'clips': _0x568bff,
            'neighboringClips': _0x4798a0,
            'assets': assets,
            'localSignals': _0x33cd5a,
            'phase': "initial-review",
            'constraints': constraints
          }),
          'systemPrompt': REVIEW_SYSTEM_PROMPT
        }, "quality-review:" + _0x144dfd["ref"]);
        _0x22de57 = applyBlockingLocalSignalsToAssessments(parseReviewResponse(_0x3bc28b, {
          'episodeRef': _0x22cb65,
          'batchRef': _0x144dfd["ref"],
          'clipRefs': _0x144dfd["clipRefs"]
        }), _0x33cd5a);
        _0x144dfd["assessments"] = _0x22de57;
        _0x144dfd["status"] = "reviewed";
        await _0x3d2623();
      }
    } catch (_0x3b1419) {
      _0x144dfd["status"] = "completed";
      _0x144dfd["error"] = normalizeText(_0x3b1419?.['message'] || _0x3b1419);
      _0x144dfd['clipRefs']['forEach'](_0x12c72d => _0x37b43e['add'](_0x12c72d));
      await _0x3d2623();
      continue;
    }
    const _0x429cea = _0x22de57["filter"](_0x1a98bb => _0x1a98bb["verdict"] === "repair")["map"](_0x4364b4 => _0x4364b4["clipRef"]);
    if (!_0x429cea["length"]) {
      _0x144dfd['status'] = "completed";
      _0x144dfd["replacements"] = {};
      await _0x3d2623();
      continue;
    }
    const _0x24d3aa = _0x568bff['filter'](_0xbc1e02 => _0x429cea["includes"](_0xbc1e02['ref']));
    onProgress?.({
      'stage': 'repairing-episode-split-quality',
      'current': _0x27e6f2 + 0x1,
      'total': _0x1e2608["batches"]['length'],
      'message': "正在定点修复 " + _0x24d3aa["length"] + " 个未通过片段"
    });
    try {
      const _0x1dd8c6 = await _0x1bd5de({
        'prompt': buildRepairPrompt({
          'episodeRef': _0x22cb65,
          'episode': episode,
          'failedClips': _0x24d3aa,
          'assessments': _0x22de57,
          'neighbors': _0x4798a0,
          'assets': assets,
          'constraints': constraints
        }),
        'systemPrompt': '你是分镜定点修复师。只处理被点名的失败片段，绝不改写已通过片段。只返回严格\x20JSON。'
      }, 'quality-repair:' + _0x144dfd["ref"]);
      const _0x4942bd = parseRepairResponse(_0x1dd8c6, {
        'episodeRef': _0x22cb65,
        'failedClipRefs': _0x429cea
      });
      const _0x595d07 = new Map();
      const _0x190ddf = {};
      const _0x3df8a1 = {};
      const _0x3f441e = async (_0x34afc0, _0x1fc7f0) => {
        for (const _0x461bcf of _0x1fc7f0) {
          try {
            const _0x3adfc4 = _0x34afc0["get"](_0x461bcf);
            if (!Array["isArray"](_0x3adfc4) || !_0x3adfc4["length"]) {
              throw new Error('修复结果遗漏片段\x20' + _0x461bcf + '。');
            }
            _0x3df8a1[_0x461bcf] = cloneJson(_0x3adfc4);
            const _0x450a15 = await validateClips({
              'episodeRef': _0x22cb65,
              'sourceClipRef': _0x461bcf,
              'clips': _0x3adfc4,
              'project': project,
              'episode': episode,
              'assets': assets,
              'constraints': constraints
            });
            if (!Array["isArray"](_0x450a15) || !_0x450a15["length"]) {
              throw new Error("片段 " + _0x461bcf + '\x20的修复结果未通过本地结构校验。');
            }
            assertStoryEpisodeSplitLocalTiming(_0x450a15);
            _0x595d07["set"](_0x461bcf, _0x450a15);
            delete _0x190ddf[_0x461bcf];
            _0x37b43e["delete"](_0x461bcf);
          } catch (_0x155414) {
            _0x190ddf[_0x461bcf] = normalizeText(_0x155414?.["message"] || _0x155414);
            _0x37b43e['add'](_0x461bcf);
          }
        }
      };
      const _0x14750c = {};
      const _0x4b98c4 = [];
      let _0x62343d = [..._0x429cea];
      let _0x3315c5 = _0x4942bd;
      let _0x1e719c = "initial";
      const _0x52a7dd = 0x3;
      for (let _0xdfd3f2 = 0x1; _0xdfd3f2 <= _0x52a7dd && _0x62343d["length"]; _0xdfd3f2 += 0x1) {
        if (_0xdfd3f2 > 0x1) {
          const _0x3529ad = _0x24d3aa["filter"](_0x13b916 => _0x62343d["includes"](_0x13b916["ref"]));
          onProgress?.({
            'stage': 'repairing-episode-split-quality',
            'current': _0x27e6f2 + 0x1,
            'total': _0x1e2608["batches"]['length'],
            'message': "正在定点修复 " + _0x3529ad["length"] + " 个未通过片段（第 " + _0xdfd3f2 + " 轮）"
          });
          try {
            const _0x1a3e0d = await _0x1bd5de({
              'prompt': buildRepairPrompt({
                'episodeRef': _0x22cb65,
                'episode': episode,
                'failedClips': _0x3529ad,
                'assessments': _0x22de57,
                'neighbors': _0x4798a0,
                'assets': assets,
                'constraints': constraints,
                'repairRound': _0xdfd3f2,
                'previousErrorsByRef': _0x190ddf,
                'previousClipsByRef': _0x3df8a1
              }),
              'systemPrompt': "你是分镜定点修复师。根据上一轮精确错误只重修被点名的失败片段，绝不改写已通过片段。只返回严格 JSON。"
            }, 'quality-repair:' + _0x144dfd["ref"] + ':round-' + _0xdfd3f2 + ':' + _0x1e719c);
            _0x3315c5 = parseRepairResponse(_0x1a3e0d, {
              'episodeRef': _0x22cb65,
              'failedClipRefs': _0x62343d
            });
          } catch (_0x24fd49) {
            const _0x2e962a = normalizeText(_0x24fd49?.["message"] || _0x24fd49);
            _0x62343d['forEach'](_0x1347d3 => {
              _0x190ddf[_0x1347d3] = _0x2e962a;
              _0x37b43e['add'](_0x1347d3);
            });
            break;
          }
        }
        _0x62343d["forEach"](_0xd6197 => _0x595d07["delete"](_0xd6197));
        await _0x3f441e(_0x3315c5, _0x62343d);
        const _0x48503e = _0x62343d["filter"](_0x24781d => !_0x595d07["has"](_0x24781d));
        const _0x5b005e = _0x62343d["filter"](_0x16fbc7 => _0x595d07['has'](_0x16fbc7));
        const _0x1e1d23 = [..._0x48503e];
        let _0x381adb = ![];
        if (_0x5b005e['length']) {
          const _0x551760 = _0x5b005e["flatMap"](_0x5b59b3 => _0x595d07["get"](_0x5b59b3) || []);
          const _0x5ea649 = _0x144dfd["ref"] + '-repair-recheck' + (_0xdfd3f2 > 0x1 ? '-' + _0xdfd3f2 : '');
          onProgress?.({
            'stage': 'reviewing-episode-split-quality',
            'current': _0x27e6f2 + 0x1,
            'total': _0x1e2608["batches"]['length'],
            'message': "正在审片 " + (_0x27e6f2 + 0x1) + '/' + _0x1e2608["batches"]["length"] + '，复核修复后的 ' + _0x551760["length"] + ' 个片段'
          });
          try {
            const _0x51906b = await _0x1bd5de({
              'prompt': buildReviewPrompt({
                'episodeRef': _0x22cb65,
                'episode': episode,
                'batchRef': _0x5ea649,
                'clips': _0x551760,
                'neighboringClips': [..._0x4798a0, ..._0x568bff["filter"](_0x9e818d => !_0x429cea["includes"](_0x9e818d["ref"]))],
                'assets': assets,
                'localSignals': inspectStoryEpisodeSplitLocalSignals({
                  'clips': _0x551760
                }),
                'phase': "repair-recheck",
                'constraints': constraints
              }),
              'systemPrompt': REVIEW_SYSTEM_PROMPT
            }, "quality-recheck:" + _0x144dfd["ref"] + (_0xdfd3f2 > 0x1 ? ":round-" + _0xdfd3f2 : ''));
            const _0x5a097e = applyBlockingLocalSignalsToAssessments(parseReviewResponse(_0x51906b, {
              'episodeRef': _0x22cb65,
              'batchRef': _0x5ea649,
              'clipRefs': _0x551760["map"](_0x43d878 => _0x43d878['ref'])
            }), inspectStoryEpisodeSplitLocalSignals({
              'clips': _0x551760
            }));
            _0x4b98c4["push"](cloneJson(_0x5a097e));
            if (_0xdfd3f2 === 0x1) {
              _0x144dfd["recheck"] = cloneJson(_0x5a097e);
            }
            const _0x36fe15 = new Map(_0x5a097e['map'](_0x4a6314 => [_0x4a6314['clipRef'], _0x4a6314]));
            _0x5b005e["forEach"](_0x7e2ed => {
              const _0xdab579 = _0x595d07['get'](_0x7e2ed) || [];
              _0x3df8a1[_0x7e2ed] = cloneJson(_0xdab579);
              const _0x3c053a = _0xdab579['map'](_0x7cc614 => _0x36fe15["get"](normalizeText(_0x7cc614?.["ref"])))["filter"](_0x50ca90 => _0x50ca90?.['verdict'] === "repair");
              if (_0x3c053a["length"]) {
                _0x190ddf[_0x7e2ed] = _0x3c053a["flatMap"](_0x44c174 => _0x44c174['issues'])["map"](_0x45aaa1 => _0x45aaa1["reason"] || _0x45aaa1["repairInstruction"])["filter"](Boolean)['join']('；') || '定点修复结果复审仍未通过。';
                _0x37b43e["add"](_0x7e2ed);
                _0x1e1d23["push"](_0x7e2ed);
                _0x381adb = !![];
                return;
              }
              _0x14750c[_0x7e2ed] = cloneJson(_0xdab579);
              _0x9ddb61['set'](_0x7e2ed, cloneJson(_0xdab579));
              delete _0x190ddf[_0x7e2ed];
              _0x37b43e["delete"](_0x7e2ed);
            });
          } catch (_0x4d1918) {
            const _0x582c1c = normalizeText(_0x4d1918?.["message"] || _0x4d1918);
            _0x5b005e["forEach"](_0x326b0c => {
              _0x190ddf[_0x326b0c] = _0x582c1c;
              _0x37b43e["add"](_0x326b0c);
              _0x1e1d23["push"](_0x326b0c);
            });
            _0x381adb = !![];
          }
        }
        _0x62343d = [...new Set(_0x1e1d23)];
        _0x1e719c = _0x48503e["length"] && _0x381adb ? "mixed" : _0x48503e["length"] ? "validation" : "recheck";
      }
      _0x4b98c4["length"] > 0x1 && (_0x144dfd['recheckRounds'] = _0x4b98c4);
      _0x144dfd["replacements"] = _0x14750c;
      _0x144dfd["repairErrors"] = _0x190ddf;
      _0x144dfd["status"] = 'completed';
      await _0x3d2623();
    } catch (_0x586e4b) {
      _0x144dfd["status"] = "completed";
      _0x144dfd["repairError"] = normalizeText(_0x586e4b?.["message"] || _0x586e4b);
      _0x429cea["forEach"](_0x4a684d => _0x37b43e["add"](_0x4a684d));
      await _0x3d2623();
    }
  }
  let _0x47eb66 = _0x487068["flatMap"](_0x45fd80 => _0x9ddb61["has"](_0x45fd80["ref"]) ? _0x9ddb61["get"](_0x45fd80["ref"]) : [_0x45fd80]);
  const _0x7b1603 = _0x47eb66["map"](_0x2ef13e => normalizeText(_0x2ef13e?.["ref"]));
  if (_0x7b1603["some"](_0x287654 => !_0x287654) || new Set(_0x7b1603)["size"] !== _0x7b1603["length"]) {
    throw new Error("审片修复后出现空片段引用或重复片段引用，未提交修复结果。");
  }
  let _0x4d02c1 = getBlockingStoryEpisodeSplitLocalSignals(inspectStoryEpisodeSplitLocalSignals({
    'clips': _0x47eb66
  }));
  if (_0x4d02c1["length"]) {
    const _0x11e57d = normalizeStoryEpisodeSpokenTiming(_0x47eb66, {
      'maxClipDurationSeconds': Math["max"](0x0, Number(constraints?.["sceneMaxSeconds"]) || 0x0),
      'maxSpokenUnitsPerSecond': MAX_SPOKEN_UNITS_PER_SECOND
    });
    const _0x3baf0d = getBlockingStoryEpisodeSplitLocalSignals(inspectStoryEpisodeSplitLocalSignals({
      'clips': _0x11e57d
    }));
    !_0x3baf0d['length'] && (_0x47eb66 = _0x11e57d, _0x4d02c1 = [], _0x37b43e["clear"]());
  }
  if (_0x4d02c1['length']) {
    const _0xb3db47 = new Set(_0x4d02c1['map'](_0x271038 => normalizeText(_0x271038?.['clipRef']))['filter'](Boolean));
    _0xb3db47["forEach"](_0x41837c => _0x37b43e["add"](_0x41837c));
    _0x1e2608["status"] = "failed_retryable";
    _0x1e2608["completedClips"] = null;
    _0x1e2608['batches'] = _0x1e2608['batches']["map"](_0x5bddac => (Array['isArray'](_0x5bddac?.["clipRefs"]) ? _0x5bddac["clipRefs"] : [])["some"](_0x4302d4 => _0xb3db47["has"](_0x4302d4)) ? {
      ..._0x5bddac,
      'status': "pending"
    } : _0x5bddac);
    await _0x3d2623();
    throw new Error('片段\x20' + [..._0xb3db47]["join"]('、') + " 的对白或镜头时长仍无法自然说完，未提交分镜结果。");
  }
  _0x1e2608['status'] = 'completed';
  _0x1e2608["completedClips"] = cloneJson(_0x47eb66);
  await _0x3d2623();
  return {
    ...result,
    'clips': _0x47eb66,
    'totalDurationSeconds': _0x47eb66["reduce"]((_0x27df1f, _0x43470e) => _0x27df1f + Math["max"](0x0, Number(_0x43470e?.['durationSec']) || 0x0), 0x0),
    'qualityReview': createQualityReviewSummary(_0x1e2608)
  };
}