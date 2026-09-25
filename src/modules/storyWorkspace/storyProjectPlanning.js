import { ASPECT_RATIO_FIELD } from '../../manifests/image/modelApi/sharedImageModelApiFields.js';
import { normalizeRunningHubModelApiProfileId } from '../runningHubProviderProfiles.js';
import { normalizeStoryWorkspaceAssetData } from './storyAssetAppearances.js';
import { invalidateStoryEpisodeScriptsFrom } from './storyPlanningData.js';
import { parseUploadedStoryScript } from './storyScriptImport.js';
import { normalizeStoryScriptMode } from '../../domain/storyGeneration/planningContract.js';
export { normalizeStoryScriptMode } from '../../domain/storyGeneration/planningContract.js';
export { STORY_PROMPT_MODE_OPTIONS, getStoryPromptModeLabel, normalizeStoryPromptMode } from './storyPromptModes.js';
import { normalizeStoryPromptMode } from './storyPromptModes.js';
import { STORY_STYLE_CUSTOM_ID, resolveStoryStyleSelection } from './storyStyleCatalog.js';
import { createDemoStoryWorkspaceData } from './storyWorkspaceData.js';
export const STORY_SCRIPT_MAX_CHARACTERS = 0x186a0;
export const STORY_IDEA_MAX_CHARACTERS = 0x1388;
export const STORY_CUSTOM_STYLE_MAX_CHARACTERS = 0x1f4;
export const STORY_EPISODE_COUNT_MIN = 0x1;
export const STORY_EPISODE_COUNT_MAX = 0x64;
export const STORY_PUBLIC_EPISODE_COUNT_OPTIONS = Object['freeze']([0x3, 0x5, 0xa, 0x14]);
export const STORY_DEVELOPER_EPISODE_COUNT_OPTIONS = Object['freeze']([0x1e, 0x32]);
export const STORY_EPISODE_COUNT_OPTIONS = Object["freeze"]([...STORY_PUBLIC_EPISODE_COUNT_OPTIONS, ...STORY_DEVELOPER_EPISODE_COUNT_OPTIONS]);
export const STORY_SCENE_MAX_SECONDS_OPTIONS = Object["freeze"]([0xf, 0x1e]);
export const STORY_ASPECT_RATIO_OPTIONS = Object["freeze"](ASPECT_RATIO_FIELD["options"]["map"](_0x3849f0 => Object["freeze"]({
  ..._0x3849f0
})));
function normalizeText(_0xec21c8) {
  return String(_0xec21c8 || '')["trim"]();
}
export function normalizeStoryEpisodeCount(_0x9e2d48) {
  const _0x20c559 = Math['trunc'](Number(_0x9e2d48));
  return Number["isFinite"](_0x20c559) && _0x20c559 >= STORY_EPISODE_COUNT_MIN && _0x20c559 <= STORY_EPISODE_COUNT_MAX ? _0x20c559 : STORY_PUBLIC_EPISODE_COUNT_OPTIONS[0x0];
}
export function normalizeStorySceneMaxSeconds(_0x1d6f79) {
  const _0x442063 = Math["trunc"](Number(_0x1d6f79));
  return STORY_SCENE_MAX_SECONDS_OPTIONS["includes"](_0x442063) ? _0x442063 : 0xf;
}
export function normalizeStoryProjectPlanning(_0x2beacd = {}, {
  allowDeveloperPromptModes = ![]
} = {}) {
  const _0x47cf34 = _0x2beacd?.["planning"] && typeof _0x2beacd['planning'] === 'object' ? _0x2beacd["planning"] : {};
  return {
    'episodeCount': normalizeStoryEpisodeCount(_0x47cf34["episodeCount"]),
    'sceneMaxSeconds': normalizeStorySceneMaxSeconds(_0x47cf34["sceneMaxSeconds"]),
    'promptMode': normalizeStoryPromptMode(_0x47cf34["promptMode"], {
      'allowDeveloperModes': allowDeveloperPromptModes
    })
  };
}
export function normalizeStoryAspectRatio(_0x33fa1f) {
  const _0x27685b = normalizeText(_0x33fa1f);
  return STORY_ASPECT_RATIO_OPTIONS["some"](_0x5aac36 => _0x5aac36['value'] === _0x27685b) ? _0x27685b : "16:9";
}
export const STORY_HOME_GENERATION_PROMPTS = Object["freeze"]({
  'upload': "按原稿结构导入上传剧本，不扩写、不重新分集，直接提取角色、场景与道具。",
  'generate': "根据用户提供的一段故事设定，扩写为人物动机完整、冲突清晰、可继续拆分分集的故事剧情。",
  'rewrite': '根据用户的改写要求重构参考剧本，生成新的故事蓝图、世界设定与分集规划。'
});
export function getNextStoryScriptMode(_0x2f31f2) {
  return normalizeStoryScriptMode(_0x2f31f2) === "narration" ? "plot" : 'narration';
}
export function getStoryScriptModeHint(_0x213f08) {
  return normalizeStoryScriptMode(_0x213f08) === "narration" ? '以第三人称旁白推进，保留少量关键对白，适合单人口播与快速画面切换。' : "以人物行动和对白推进，生成标准剧情短剧。";
}
export function resolveStoryTextProviderProfileId(_0x2bcd62, _0x240a52 = '') {
  return normalizeText(_0x2bcd62)["toLowerCase"]() === "runninghub" ? normalizeRunningHubModelApiProfileId(_0x240a52) : '';
}
export function buildStoryHomeGenerationRequest({
  mode = "upload",
  scriptMode = "plot",
  modelId = '',
  provider = '',
  providerProfileId = '',
  scriptFileName = '',
  scriptText = '',
  idea = '',
  rewriteInstruction = '',
  aspectRatio = "16:9",
  styleId = STORY_STYLE_CUSTOM_ID,
  stylePrompt = '',
  videoStyle = '',
  episodeCount = 0x3,
  sceneMaxSeconds = 0xf,
  promptMode = "seedance-2.0",
  allowDeveloperPromptModes = ![]
} = {}) {
  if (mode === "collaborate") {
    return {
      'ok': ![],
      'error': '请先在\x20AI\x20协作创作中确认正文，再进入制作。'
    };
  }
  const _0x165034 = mode === "generate" || mode === "rewrite" ? mode : "upload";
  const _0x1131de = normalizeText(idea)["slice"](0x0, STORY_IDEA_MAX_CHARACTERS);
  const _0x1c4c06 = normalizeText(rewriteInstruction)["slice"](0x0, STORY_IDEA_MAX_CHARACTERS);
  const _0x4126e5 = normalizeText(scriptFileName);
  const _0x2d8943 = String(scriptText || '')["slice"](0x0, STORY_SCRIPT_MAX_CHARACTERS);
  if (_0x165034 === "upload" && !_0x4126e5) {
    return {
      'ok': ![],
      'error': '请先上传剧本或粘贴文本。'
    };
  }
  if (_0x165034 === 'upload' && !normalizeText(_0x2d8943)) {
    return {
      'ok': ![],
      'error': '当前文件尚未解析出可用文本，请使用\x20TXT、Markdown、DOCX、文本型\x20PDF\x20或粘贴文本。'
    };
  }
  if (_0x165034 === "generate" && !_0x1131de) {
    return {
      'ok': ![],
      'error': "请先写下一段故事设定。"
    };
  }
  if (_0x165034 === "rewrite" && !_0x4126e5) {
    return {
      'ok': ![],
      'error': '请先上传参考剧本。'
    };
  }
  if (_0x165034 === "rewrite" && !normalizeText(_0x2d8943)) {
    return {
      'ok': ![],
      'error': "当前参考剧本尚未解析出可用文本，请使用 TXT、DOCX 或文本型 PDF。"
    };
  }
  if (_0x165034 === "rewrite" && !_0x1c4c06) {
    return {
      'ok': ![],
      'error': "请先填写改写要求。"
    };
  }
  const _0x18da87 = resolveStoryStyleSelection({
    'styleId': styleId,
    'stylePrompt': stylePrompt,
    'videoStyle': videoStyle
  });
  const _0x42a3fd = normalizeText(provider);
  const _0x5c4479 = resolveStoryTextProviderProfileId(_0x42a3fd, providerProfileId);
  return {
    'ok': !![],
    'mode': _0x165034,
    'scriptMode': _0x165034 !== "upload" ? normalizeStoryScriptMode(scriptMode) : "plot",
    'prompt': STORY_HOME_GENERATION_PROMPTS[_0x165034],
    'modelId': normalizeText(modelId),
    'provider': _0x42a3fd,
    ...(_0x5c4479 ? {
      'providerProfileId': _0x5c4479
    } : {}),
    'scriptFileName': _0x165034 !== "generate" ? _0x4126e5 : '',
    'sourceText': _0x165034 !== "generate" ? _0x2d8943 : '',
    'idea': _0x165034 === "generate" ? _0x1131de : '',
    'rewriteInstruction': _0x165034 === 'rewrite' ? _0x1c4c06 : '',
    'aspectRatio': normalizeStoryAspectRatio(aspectRatio),
    'styleId': _0x18da87["styleId"],
    'visualStyle': _0x18da87["stylePrompt"]['slice'](0x0, STORY_CUSTOM_STYLE_MAX_CHARACTERS),
    ...(_0x165034 !== "upload" ? {
      'episodeCount': normalizeStoryEpisodeCount(episodeCount)
    } : {}),
    'sceneMaxSeconds': normalizeStorySceneMaxSeconds(sceneMaxSeconds),
    'promptMode': normalizeStoryPromptMode(promptMode, {
      'allowDeveloperModes': allowDeveloperPromptModes
    }),
    'maxScriptCharacters': STORY_SCRIPT_MAX_CHARACTERS
  };
}
export function buildStorySummaryRegenerationRequest(_0x1441a5 = {}, {
  modelId = '',
  provider = '',
  providerProfileId = '',
  allowDeveloperPromptModes = ![]
} = {}) {
  const _0x12b26d = String(_0x1441a5?.["sourceDocument"]?.["text"] || '');
  const _0x3bf966 = normalizeText(_0x1441a5?.['originalCreative']);
  const _0x4bd3b7 = normalizeText(_0x1441a5?.['rewriteInstruction']);
  const _0x25bfb8 = _0x1441a5?.["sourceMode"] === "upload-rewrite" ? "rewrite" : normalizeText(_0x12b26d) ? 'upload' : "generate";
  if (_0x25bfb8 === 'generate' && !_0x3bf966) {
    return {
      'ok': ![],
      'error': "当前项目没有可用于重新生成的原始创意。"
    };
  }
  if (_0x25bfb8 === "rewrite" && !_0x4bd3b7) {
    return {
      'ok': ![],
      'error': "当前项目没有可用于重新生成的改写要求。"
    };
  }
  const _0x34b707 = resolveStoryStyleSelection({
    'styleId': _0x1441a5?.["videoStyleId"],
    'stylePrompt': _0x1441a5?.["videoStylePrompt"],
    'videoStyle': _0x1441a5?.["videoStyle"]
  });
  const _0xedd2e3 = normalizeStoryProjectPlanning(_0x1441a5, {
    'allowDeveloperPromptModes': allowDeveloperPromptModes
  });
  const _0x54417f = normalizeText(provider);
  const _0x331c2a = resolveStoryTextProviderProfileId(_0x54417f, providerProfileId);
  return {
    'ok': !![],
    'mode': _0x25bfb8,
    'scriptMode': normalizeStoryScriptMode(_0x1441a5?.["scriptMode"]),
    'idea': _0x25bfb8 === "generate" ? _0x3bf966 : '',
    'sourceText': _0x25bfb8 !== 'generate' ? _0x12b26d : '',
    'fileName': _0x25bfb8 !== "generate" ? normalizeText(_0x1441a5?.["sourceDocument"]?.['fileName']) : '',
    'rewriteInstruction': _0x25bfb8 === "rewrite" ? _0x4bd3b7 : '',
    'model': normalizeText(modelId),
    'provider': _0x54417f,
    ...(_0x331c2a ? {
      'providerProfileId': _0x331c2a
    } : {}),
    'aspectRatio': normalizeStoryAspectRatio(_0x1441a5?.["aspectRatio"]),
    'visualStyle': _0x34b707["stylePrompt"],
    'planning': {
      'episodeCount': _0xedd2e3["episodeCount"],
      'sceneMaxSeconds': _0xedd2e3["sceneMaxSeconds"],
      'promptMode': _0xedd2e3['promptMode']
    }
  };
}
export function resolveGeneratedProjectTitle({
  currentTitle = '',
  generatedTitle = '',
  userEdited = ![]
} = {}) {
  const _0x40c003 = normalizeText(currentTitle);
  const _0x1335d8 = normalizeText(generatedTitle);
  if (userEdited && _0x40c003) {
    return _0x40c003;
  }
  return _0x1335d8 || _0x40c003 || '未命名故事';
}
export function normalizeGeneratedStoryContract(_0x39d5bd = {}) {
  const _0x4632dc = _0x39d5bd && typeof _0x39d5bd === "object" && !Array["isArray"](_0x39d5bd) ? _0x39d5bd : {};
  return {
    'protagonistGoal': normalizeText(_0x4632dc["protagonistGoal"]),
    'centralConflict': normalizeText(_0x4632dc["centralConflict"]),
    'stakes': normalizeText(_0x4632dc["stakes"]),
    'progressionDriver': normalizeText(_0x4632dc['progressionDriver']),
    'constraints': normalizeText(_0x4632dc["constraints"]),
    'climax': normalizeText(_0x4632dc["climax"]),
    'ending': normalizeText(_0x4632dc["ending"])
  };
}
function normalizeGeneratedStoryPlotBeats(_0x540373 = []) {
  return (Array['isArray'](_0x540373) ? _0x540373 : [])["map"]((_0x101b7a, _0x4e4bcb) => ({
    'ref': normalizeText(_0x101b7a?.["ref"]) || "plot-beat-" + (_0x4e4bcb + 0x1),
    'stage': normalizeText(_0x101b7a?.["stage"]),
    'event': normalizeText(_0x101b7a?.['event']),
    'consequence': normalizeText(_0x101b7a?.["consequence"])
  }))["filter"](_0x305408 => _0x305408["stage"] || _0x305408['event'] || _0x305408["consequence"]);
}
export function normalizeGeneratedStoryContinuityFacts(_0x5cd5a3 = []) {
  return [...new Set((Array['isArray'](_0x5cd5a3) ? _0x5cd5a3 : [])["map"](normalizeText)["filter"](Boolean))];
}
export function applyGeneratedStoryResult(_0x4e196a, _0x4760fd = {}, _0x139e02 = {}) {
  const _0x139240 = _0x4e196a && typeof _0x4e196a === 'object' ? _0x4e196a : createDemoStoryWorkspaceData();
  const _0x55cb96 = Array['isArray'](_0x4760fd["chapters"]) ? _0x4760fd["chapters"]["map"]((_0x3d6147, _0x241bfe) => ({
    'id': normalizeText(_0x3d6147?.['id']) || 'chapter-' + (_0x241bfe + 0x1),
    'title': normalizeText(_0x3d6147?.['title']) || '第\x20' + (_0x241bfe + 0x1) + '\x20章',
    'content': normalizeText(_0x3d6147?.['content'])
  }))["filter"](_0x558454 => _0x558454["content"]) : [];
  const _0x2ec3e8 = _0x55cb96["map"](_0x146e33 => _0x146e33["title"] + '\x0a' + _0x146e33["content"])["join"]('\x0a\x0a');
  return {
    ..._0x139240,
    'project': {
      ...(_0x139240["project"] || {}),
      'title': resolveGeneratedProjectTitle({
        'currentTitle': _0x139240["project"]?.["title"],
        'generatedTitle': _0x4760fd['title'],
        'userEdited': _0x139e02['projectTitleEdited'] === !![]
      }),
      'storyType': normalizeText(_0x4760fd["storyType"]),
      'targetAudience': normalizeText(_0x4760fd['targetAudience']),
      'summary': normalizeText(_0x4760fd['storySummary']),
      'background': normalizeText(_0x4760fd["storyBackground"]),
      'setting': normalizeText(_0x4760fd['storySetting']),
      'coreHook': normalizeText(_0x4760fd['coreHook']),
      'logline': normalizeText(_0x4760fd["logline"]),
      'storyContract': _0x4760fd['storyContract'] ? normalizeGeneratedStoryContract(_0x4760fd["storyContract"]) : normalizeGeneratedStoryContract(_0x139240['project']?.["storyContract"]),
      'plotBeats': Array["isArray"](_0x4760fd["plotBeats"]) ? normalizeGeneratedStoryPlotBeats(_0x4760fd['plotBeats']) : normalizeGeneratedStoryPlotBeats(_0x139240['project']?.['plotBeats']),
      'continuityFacts': Array["isArray"](_0x4760fd["continuityFacts"]) ? normalizeGeneratedStoryContinuityFacts(_0x4760fd['continuityFacts']) : normalizeGeneratedStoryContinuityFacts(_0x139240["project"]?.["continuityFacts"]),
      'summaryRevision': Math['max'](0x0, Math["trunc"](Number(_0x139240["project"]?.["summaryRevision"]) || 0x0)) + 0x1,
      'characters': Array["isArray"](_0x4760fd["characters"]) ? _0x4760fd['characters']["map"](_0x2b9011 => ({
        ..._0x2b9011
      })) : [],
      'sourceChapters': _0x55cb96["map"](_0x28d455 => ({
        ..._0x28d455
      })),
      'chapters': _0x55cb96,
      'plotScript': _0x2ec3e8,
      'narrationScript': _0x2ec3e8
    }
  };
}
export function invalidateStoryPlanningDownstream(_0x316612 = {}, {
  clearEpisodeOutlines = ![],
  episodeScriptStartIndex = 0x0
} = {}) {
  const _0x450a16 = _0x316612 && typeof _0x316612 === "object" ? _0x316612 : {};
  const _0x4c3c23 = {
    ..._0x450a16
  };
  delete _0x4c3c23["assetExtractionDraft"];
  delete _0x4c3c23["experimentalAssetExtractionDraft"];
  const _0x21b461 = _0x450a16["project"] && typeof _0x450a16["project"] === "object" ? _0x450a16['project'] : {};
  const _0x4ef239 = Array["isArray"](_0x21b461["sourceChapters"]) && _0x21b461["sourceChapters"]["length"] ? _0x21b461['sourceChapters'] : !_0x21b461["compiledScript"] && Array["isArray"](_0x21b461["chapters"]) ? _0x21b461["chapters"] : [];
  return {
    ..._0x4c3c23,
    'project': {
      ..._0x21b461,
      ...(clearEpisodeOutlines ? {
        'outlineStatus': "pending",
        'outlineSourceSummaryRevision': 0x0,
        'storyFacts': []
      } : {}),
      'sourceChapters': _0x4ef239["map"](_0x282f6a => ({
        ..._0x282f6a
      })),
      'chapters': [],
      'plotScript': '',
      'narrationScript': '',
      'compiledScript': null
    },
    'assets': [],
    'episodes': clearEpisodeOutlines ? [] : invalidateStoryEpisodeScriptsFrom(_0x450a16['episodes'], episodeScriptStartIndex)
  };
}
export function markStorySummaryDownstreamStale(_0x5e2a22 = {}) {
  if (!_0x5e2a22?.["project"] || typeof _0x5e2a22["project"] !== "object") {
    return ![];
  }
  const _0x1db979 = _0x5e2a22["project"];
  _0x1db979["summaryRevision"] = Math["max"](0x0, Math["trunc"](Number(_0x1db979["summaryRevision"]) || 0x0)) + 0x1;
  const _0x804f67 = Array['isArray'](_0x5e2a22["episodes"]) && _0x5e2a22["episodes"]["length"] > 0x0 || Array["isArray"](_0x5e2a22['assets']) && _0x5e2a22["assets"]['length'] > 0x0 || normalizeText(_0x1db979["outlineStatus"]) === "completed";
  if (_0x804f67 && _0x1db979["outlineStatus"] !== "generating") {
    _0x1db979["outlineStatus"] = "stale";
    return !![];
  }
  return ![];
}
export function createGeneratedStoryProjectData(_0x1b81da = {}, {
  projectId = "story-" + Date["now"](),
  request = {},
  allowDeveloperPromptModes = ![]
} = {}) {
  const _0xa178ef = resolveStoryStyleSelection({
    'styleId': request["styleId"],
    'stylePrompt': request["visualStyle"]
  });
  const _0x212a9f = normalizeStoryWorkspaceAssetData(createDemoStoryWorkspaceData());
  _0x212a9f['project'] = {
    ..._0x212a9f["project"],
    'id': normalizeText(projectId) || 'story-' + Date["now"](),
    'title': "未命名故事",
    'scriptMode': normalizeStoryScriptMode(request["scriptMode"]),
    'storyType': '',
    'targetAudience': '',
    'summary': '',
    'background': '',
    'setting': '',
    'coreHook': '',
    'logline': '',
    'storyContract': normalizeGeneratedStoryContract(),
    'plotBeats': [],
    'continuityFacts': [],
    'summaryRevision': 0x0,
    'outlineSourceSummaryRevision': 0x0,
    'characters': [],
    'sourceChapters': [],
    'chapters': [],
    'plotScript': '',
    'narrationScript': '',
    'aspectRatio': normalizeStoryAspectRatio(request["aspectRatio"]),
    'videoStyleId': _0xa178ef["styleId"],
    'videoStylePrompt': _0xa178ef["stylePrompt"],
    'customVideoStylePrompt': _0xa178ef["isCustom"] ? _0xa178ef["stylePrompt"] : '',
    'videoStyle': _0xa178ef["label"] || _0xa178ef["stylePrompt"],
    'planning': {
      'episodeCount': normalizeStoryEpisodeCount(request["episodeCount"]),
      'sceneMaxSeconds': normalizeStorySceneMaxSeconds(request["sceneMaxSeconds"]),
      'promptMode': normalizeStoryPromptMode(request['promptMode'], {
        'allowDeveloperModes': allowDeveloperPromptModes
      })
    },
    ...(request["mode"] === "rewrite" ? {
      'sourceMode': "upload-rewrite"
    } : {}),
    'sourceDocument': request["mode"] === "upload" || request["mode"] === "rewrite" ? {
      'fileName': normalizeText(request['scriptFileName']),
      'text': String(request["sourceText"] || ''),
      'characterCount': String(request["sourceText"] || '')["length"]
    } : null,
    'originalCreative': request["mode"] === "upload" || request["mode"] === "rewrite" ? String(request["sourceText"] || '') : String(request["idea"] || ''),
    'rewriteInstruction': request['mode'] === "rewrite" ? normalizeText(request["rewriteInstruction"]) : '',
    'summaryStatus': "pending",
    'outlineStatus': "pending",
    'compiledScript': null
  };
  _0x212a9f["assets"] = [];
  _0x212a9f["episodes"] = [];
  return normalizeStoryWorkspaceAssetData(applyGeneratedStoryResult(_0x212a9f, _0x1b81da, {
    'projectTitleEdited': ![]
  }));
}
export function createUploadedStoryProjectData({
  projectId = "story-" + Date["now"](),
  request = {},
  allowDeveloperPromptModes = ![]
} = {}) {
  const _0x5a7aad = parseUploadedStoryScript({
    'sourceText': request["sourceText"],
    'fileName': request["scriptFileName"]
  });
  const _0x5bf28e = createGeneratedStoryProjectData({}, {
    'projectId': projectId,
    'request': request,
    'allowDeveloperPromptModes': allowDeveloperPromptModes
  });
  _0x5bf28e['project'] = {
    ..._0x5bf28e["project"],
    'title': _0x5a7aad["title"],
    'sourceMode': 'upload-original',
    'summaryStatus': "skipped",
    'outlineStatus': "completed",
    'sourceChapters': _0x5a7aad["chapters"]["map"](_0x53f5db => ({
      ..._0x53f5db
    })),
    'chapters': _0x5a7aad["chapters"],
    'plotScript': _0x5a7aad["sourceText"],
    'narrationScript': _0x5a7aad["sourceText"],
    'compiledScript': {
      'revision': 0x1,
      'episodeIds': _0x5a7aad["episodes"]["map"](_0x5b3bf3 => _0x5b3bf3['id']),
      'fullText': _0x5a7aad["episodes"]["map"](_0x1e1948 => _0x1e1948["script"]["fullText"])["join"]('\x0a\x0a'),
      'confirmedAt': Date["now"]()
    }
  };
  _0x5bf28e['episodes'] = _0x5a7aad["episodes"];
  return normalizeStoryWorkspaceAssetData(_0x5bf28e);
}