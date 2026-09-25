import { normalizeStoryWorkspaceAssetData } from './storyAssetAppearances.js';
import { buildVideoReplicationSourceEvidence, buildVideoReplicationSourceTranscript, getVideoReplicationDialogueSummary } from '../../domain/storyGeneration/videoReplicationSourceAnalysis.js';
import { getStoryClipDialogueSpeakerAssetIds } from './storyPlanningData.js';
import { parseUploadedStoryEpisodeScenes } from './storyScriptImport.js';
import { localPathToUrl, pickResultLocalPath } from '../../utils/localMediaPath.js';
export const STORY_REPLICATION_MAX_VIDEO_BYTES = 0x32 * 0x400 * 0x400;
export const STORY_VIDEO_REPLICATION_UNIFIED_ASSET_MAX_SOURCE_CHARACTERS = 0x7d00;
export const STORY_VIDEO_REPLICATION_UNIFIED_ASSET_MAX_OUTPUT_TOKENS = 0x4000;
export const STORY_REPLICATION_VIDEO_ACCEPT = ".mp4,.mov,.avi,video/mp4,video/quicktime,video/x-msvideo,video/avi,video/msvideo,video/vnd.avi";
export function isStoryVideoReplicationHomeAvailable({
  workspaceSurface = "story"
} = {}) {
  return workspaceSurface === "replication";
}
export function resolveStoryVideoReplicationHomeTab(_0x31b79e = {}, _0x20cda1 = "upload") {
  if (_0x31b79e["workspaceSurface"] === "replication") {
    return "replication";
  }
  if (_0x20cda1 === 'collaborate' && _0x31b79e["developerModeAvailable"] !== !![]) {
    return "generate";
  }
  const _0x217bf6 = ["upload", "generate", "collaborate", 'replication']["includes"](_0x20cda1) ? _0x20cda1 : "upload";
  return _0x217bf6 === "replication" && !isStoryVideoReplicationHomeAvailable(_0x31b79e) ? "upload" : _0x217bf6;
}
export const STORY_REPLICATION_LOCALES = Object["freeze"]([Object["freeze"]({
  'value': "source",
  'label': "保留原语言",
  'shortLabel': '原语言'
}), Object["freeze"]({
  'value': "zh-CN",
  'label': "中国 · 中文",
  'shortLabel': '中文'
}), Object["freeze"]({
  'value': "ja-JP",
  'label': "日本 · 日语",
  'shortLabel': '日语'
}), Object["freeze"]({
  'value': 'ko-KR',
  'label': "韩国 · 韩语",
  'shortLabel': '韩语'
}), Object["freeze"]({
  'value': "en-US",
  'label': "美国 · 英语",
  'shortLabel': '英语'
})]);
const SUPPORTED_VIDEO_EXTENSIONS = new Set(['mp4', 'mov', "avi"]);
function normalizeText(_0x2c4d6a) {
  return String(_0x2c4d6a ?? '')["trim"]();
}
export function resolveStoryVideoReplicationClipVoiceAssetIds(_0xf683ed = {}, _0x20b48d = {}) {
  if (_0xf683ed?.["project"]?.["sourceMode"] !== "video-replication") {
    return null;
  }
  return getStoryClipDialogueSpeakerAssetIds(_0x20b48d, _0xf683ed["assets"]);
}
function normalizePositiveNumber(_0x57db49) {
  const _0x1294f6 = Number(_0x57db49);
  return Number["isFinite"](_0x1294f6) && _0x1294f6 > 0x0 ? _0x1294f6 : 0x0;
}
function stripVideoExtension(_0x14dfbf) {
  return normalizeText(_0x14dfbf)["replace"](/^.*[\\/]/u, '')["replace"](/\.(?:mp4|mov|avi)$/iu, '')['trim']();
}
function getVideoExtension(_0x30e0a4 = {}) {
  return normalizeText(_0x30e0a4["name"])['split']('.')["pop"]()?.['toLowerCase']() || '';
}
function normalizeLocale(_0x210987) {
  const _0x525467 = normalizeText(_0x210987);
  return STORY_REPLICATION_LOCALES["some"](_0x2dd5a9 => _0x2dd5a9['value'] === _0x525467) ? _0x525467 : STORY_REPLICATION_LOCALES[0x0]["value"];
}
function createStableEpisodeId(_0x4a6199 = {}, _0x6a40a1 = 0x0, _0x3987bd = "story") {
  const _0x152543 = [_0x3987bd, normalizeText(_0x4a6199["name"]), Number(_0x4a6199['size']) || 0x0, Number(_0x4a6199["lastModified"]) || 0x0, _0x6a40a1]["join"]('|');
  let _0x41aa1 = 0x811c9dc5;
  for (let _0x4c2a91 = 0x0; _0x4c2a91 < _0x152543["length"]; _0x4c2a91 += 0x1) {
    _0x41aa1 ^= _0x152543["charCodeAt"](_0x4c2a91);
    _0x41aa1 = Math["imul"](_0x41aa1, 0x1000193);
  }
  return "replication-episode-" + (_0x41aa1 >>> 0x0)["toString"](0x24);
}
function normalizeAnalysisSegment(_0x842752 = {}, _0x226e38 = 0x0, _0x3fe22f = 0x0) {
  const _0x34f184 = Math["max"](0x0, Number(_0x842752['startSec']) || 0x0);
  const _0x15bd62 = Number(_0x842752["endSec"]);
  const _0x53f64f = Math["max"](0x1, Number(_0x842752["durationSec"]) || 0x0);
  const _0x481dbc = Number['isFinite'](_0x15bd62) && _0x15bd62 > _0x34f184 ? _0x15bd62 : _0x34f184 + _0x53f64f;
  const _0x58f979 = _0x3fe22f > 0x0 ? Math["min"](Math["max"](_0x34f184 + 0.1, _0x481dbc), _0x3fe22f) : _0x481dbc;
  return {
    'title': normalizeText(_0x842752["title"]) || "片段 " + String(_0x226e38 + 0x1)["padStart"](0x2, '0'),
    'startSec': _0x34f184,
    'endSec': _0x58f979,
    'durationSec': Math["max"](0.1, _0x58f979 - _0x34f184),
    'script': normalizeText(_0x842752["script"] || _0x842752["dialogue"] || _0x842752["visual"]),
    'prompt': normalizeText(_0x842752["prompt"] || _0x842752['seedancePrompt']),
    'visual': normalizeText(_0x842752["visual"] || _0x842752["script"]),
    'camera': normalizeText(_0x842752["camera"]),
    'dialogue': normalizeText(_0x842752["dialogue"]),
    'sound': normalizeText(_0x842752["sound"] || _0x842752["audio"])
  };
}
export function getStoryReplicationLocale(_0x3d3852) {
  const _0x3abc3c = normalizeLocale(_0x3d3852);
  return STORY_REPLICATION_LOCALES["find"](_0x25ffca => _0x25ffca["value"] === _0x3abc3c) || STORY_REPLICATION_LOCALES[0x0];
}
export function resolveStoryReplicationUploadedVideo(_0x3db6d0 = {}) {
  const _0x25ca4e = pickResultLocalPath(_0x3db6d0);
  const _0x57f0c9 = normalizeText(_0x25ca4e ? localPathToUrl(_0x25ca4e) : _0x3db6d0?.['displayUrl'] || _0x3db6d0?.['url'] || _0x3db6d0?.["originalUrl"] || _0x3db6d0?.["videoUrl"]);
  if (!_0x57f0c9) {
    throw new Error("视频上传结果缺少可用地址。");
  }
  return {
    'videoRef': _0x57f0c9,
    'localPath': _0x25ca4e
  };
}
export function findStoryReplicationEpisode(_0x53d102, _0x217776) {
  return (Array["isArray"](_0x53d102?.["episodes"]) ? _0x53d102['episodes'] : [])["find"](_0x4cdcc9 => normalizeText(_0x4cdcc9?.['id']) === normalizeText(_0x217776)) || null;
}
function buildStoryVideoReplicationEpisodeAssetEvidence(_0x1855b6 = {}) {
  const _0x47f20f = _0x1855b6?.["replication"]?.["analysis"] || {};
  const _0x34a9e3 = [];
  const _0x2a302e = buildVideoReplicationSourceEvidence(_0x1855b6);
  if (_0x2a302e) {
    _0x34a9e3["push"]("原片人物与事件证据：" + JSON["stringify"](_0x2a302e));
  }
  const _0x2c797f = normalizeText(_0x47f20f["synopsis"] || _0x1855b6?.["synopsis"]);
  const _0x3a49dd = normalizeText(_0x47f20f["camera"]);
  const _0x28171b = normalizeText(_0x47f20f["seedancePrompt"]);
  if (_0x2c797f) {
    _0x34a9e3['push']("剧情与空间概述：" + _0x2c797f);
  }
  if (_0x3a49dd) {
    _0x34a9e3["push"]("整体运镜：" + _0x3a49dd);
  }
  if (_0x28171b) {
    _0x34a9e3["push"]("整体视觉提示：" + _0x28171b);
  }
  const _0x526efd = (Array["isArray"](_0x47f20f['segments']) ? _0x47f20f["segments"] : [])["map"]((_0x3faad8, _0x18b21a) => {
    const _0x36fc53 = [];
    const _0x74c3db = normalizeText(_0x3faad8?.["visual"]);
    const _0x1d13c0 = normalizeText(_0x3faad8?.["prompt"]);
    const _0x457b67 = normalizeText(_0x3faad8?.["camera"]);
    if (_0x74c3db) {
      _0x36fc53["push"]("画面：" + _0x74c3db);
    }
    if (_0x1d13c0) {
      _0x36fc53["push"]("视觉提示：" + _0x1d13c0);
    }
    if (_0x457b67) {
      _0x36fc53["push"]("运镜：" + _0x457b67);
    }
    if (!_0x36fc53["length"]) {
      return '';
    }
    const _0x33b7fb = normalizeText(_0x3faad8?.["title"]);
    return ["片段 " + (_0x18b21a + 0x1) + (_0x33b7fb ? '「' + _0x33b7fb + '」' : '') + '：', ..._0x36fc53['map'](_0x274e65 => '-\x20' + _0x274e65)]['join']('\x0a');
  })["filter"](Boolean);
  _0x34a9e3["push"](..._0x526efd);
  if (!_0x34a9e3['length']) {
    return '';
  }
  return ['【视频解析视觉证据（仅用于角色、场景与道具识别，不是新增剧情）】', ..._0x34a9e3]["join"]('\x0a');
}
export function buildStoryVideoReplicationAssetExtractionProject(_0x4cfd9d = {}) {
  const _0x580755 = _0x4cfd9d?.['project'] || {};
  if (_0x580755["sourceMode"] !== "video-replication") {
    return _0x580755;
  }
  const _0x3ae314 = Array["isArray"](_0x4cfd9d["episodes"]) ? _0x4cfd9d["episodes"] : [];
  const _0x54e868 = Array["isArray"](_0x580755['chapters']) ? _0x580755["chapters"] : [];
  const _0x323189 = _0x54e868["length"] ? _0x54e868 : _0x3ae314["filter"](_0x47063a => normalizeText(_0x47063a?.["script"]?.["fullText"]))["map"]((_0x34bf6d, _0x355d51) => ({
    'id': _0x34bf6d['id'],
    'title': '第\x20' + (_0x34bf6d["number"] || _0x355d51 + 0x1) + '\x20集：' + (_0x34bf6d["title"] || "未命名分集"),
    'content': _0x34bf6d["script"]["fullText"]
  }));
  const _0x3a5bf6 = _0x323189["map"]((_0x5816a2, _0x4046f0) => {
    const _0x2f2ffb = _0x3ae314['find'](_0x38eccb => normalizeText(_0x38eccb?.['id']) === normalizeText(_0x5816a2?.['id'])) || _0x3ae314[_0x4046f0];
    const _0x13ab9a = normalizeText(_0x5816a2?.["content"] || _0x2f2ffb?.["script"]?.["fullText"]);
    const _0x58339a = buildStoryVideoReplicationEpisodeAssetEvidence(_0x2f2ffb);
    return {
      ..._0x5816a2,
      'content': [_0x13ab9a, _0x58339a]["filter"](Boolean)["join"]('\x0a\x0a')
    };
  });
  return {
    ..._0x580755,
    'chapters': _0x3a5bf6
  };
}
export function shouldUseStoryVideoReplicationUnifiedAssetLocalization(_0x54025f = {}, {
  maxSourceCharacters = STORY_VIDEO_REPLICATION_UNIFIED_ASSET_MAX_SOURCE_CHARACTERS
} = {}) {
  if (_0x54025f?.['project']?.["sourceMode"] !== "video-replication") {
    return ![];
  }
  if (_0x54025f["assetExtractionDraft"] && typeof _0x54025f["assetExtractionDraft"] === "object") {
    return ![];
  }
  const _0x38ecce = buildStoryVideoReplicationAssetExtractionProject(_0x54025f);
  const _0x21ee47 = Array["isArray"](_0x38ecce["chapters"]) ? _0x38ecce['chapters'] : [];
  const _0xf99d4d = _0x21ee47["reduce"]((_0x5a84d1, _0x110540) => _0x5a84d1 + String(_0x110540?.["content"] || '')["length"], 0x0);
  const _0x1d189d = _0xf99d4d || (Array["isArray"](_0x54025f['episodes']) ? _0x54025f["episodes"] : [])["reduce"]((_0x2121cf, _0x25b21e) => _0x2121cf + String(_0x25b21e?.["script"]?.['fullText'] || '')["length"], 0x0);
  const _0x3e2bd0 = Math['max'](0x1, Math['trunc'](Number(maxSourceCharacters) || 0x0));
  return _0x1d189d > 0x0 && _0x1d189d <= _0x3e2bd0;
}
export function validateStoryReplicationVideoFile(_0x1b62a5 = {}) {
  const _0x58d939 = normalizeText(_0x1b62a5["name"]);
  const _0x300cae = getVideoExtension(_0x1b62a5);
  const _0x349ffb = Math["max"](0x0, Number(_0x1b62a5["size"]) || 0x0);
  if (!_0x58d939) {
    return {
      'ok': ![],
      'error': "视频文件缺少文件名。"
    };
  }
  if (!SUPPORTED_VIDEO_EXTENSIONS["has"](_0x300cae)) {
    return {
      'ok': ![],
      'error': '“' + _0x58d939 + '”格式不支持，仅支持\x20MP4、MOV、AVI。'
    };
  }
  if (_0x349ffb > STORY_REPLICATION_MAX_VIDEO_BYTES) {
    return {
      'ok': ![],
      'error': '“' + _0x58d939 + "”超过 50MB，请压缩后重新上传。"
    };
  }
  if (!_0x349ffb) {
    return {
      'ok': ![],
      'error': '“' + _0x58d939 + '”是空文件。'
    };
  }
  return {
    'ok': !![],
    'error': ''
  };
}
export function mergeStoryReplicationSourceFiles(_0x5892c8 = [], _0x2e3022 = []) {
  const _0x40096e = [];
  const _0x21989d = new Set();
  [...(Array['isArray'](_0x5892c8) ? _0x5892c8 : []), ...(Array["isArray"](_0x2e3022) ? _0x2e3022 : [])]["forEach"](_0x219fc6 => {
    if (!validateStoryReplicationVideoFile(_0x219fc6)['ok']) {
      return;
    }
    const _0x46a72a = [_0x219fc6["name"], _0x219fc6["size"], _0x219fc6["lastModified"]]["join"](':');
    if (_0x21989d['has'](_0x46a72a)) {
      return;
    }
    _0x21989d["add"](_0x46a72a);
    _0x40096e["push"](_0x219fc6);
  });
  return _0x40096e;
}
export function createStoryVideoReplicationProjectData({
  projectId = "story-" + Date["now"](),
  files = [],
  modelId = '',
  provider = '',
  providerProfileId = '',
  targetLocale = "zh-CN",
  promptMode = "seedance-2.0",
  aspectRatio = "9:16"
} = {}) {
  const _0x4c29df = Array["isArray"](files) ? files : [];
  if (!_0x4c29df['length']) {
    throw new Error("请先上传至少一条视频。");
  }
  for (const _0x1f1a6f of _0x4c29df) {
    const _0x5a2418 = validateStoryReplicationVideoFile(_0x1f1a6f);
    if (!_0x5a2418['ok']) {
      throw new Error(_0x5a2418["error"]);
    }
  }
  const _0xbca513 = getStoryReplicationLocale(targetLocale);
  const _0x420cf1 = stripVideoExtension(_0x4c29df[0x0]?.['name']) || "未命名复刻视频";
  const _0x2274b7 = _0x4c29df["length"] > 0x1 ? _0x420cf1 + " 等 " + _0x4c29df["length"] + " 条视频" : _0x420cf1;
  const _0x29e384 = _0x4c29df["map"]((_0x1b6bd1, _0x281751) => {
    const _0x363046 = createStableEpisodeId(_0x1b6bd1, _0x281751, projectId);
    return {
      'id': _0x363046,
      'planningRef': _0x363046,
      'number': _0x281751 + 0x1,
      'title': stripVideoExtension(_0x1b6bd1["name"]) || '第\x20' + (_0x281751 + 0x1) + '\x20集',
      'synopsis': '',
      'hook': '',
      'sourceChapterIds': [_0x363046],
      'assetRefs': [],
      'assetIds': [],
      'scriptStatus': 'pending',
      'script': null,
      'clips': [],
      'clipCount': 0x0,
      'characterCount': 0x0,
      'sceneCount': 0x0,
      'propCount': 0x0,
      'durationSec': 0x0,
      'duration': "--:--",
      'coverUrl': '',
      'status': "解析中",
      'sourceVideo': {
        'fileName': normalizeText(_0x1b6bd1["name"]),
        'size': Math["max"](0x0, Number(_0x1b6bd1["size"]) || 0x0),
        'mimeType': normalizeText(_0x1b6bd1["type"]),
        'videoRef': '',
        'posterUrl': '',
        'posterLocalPath': '',
        'durationSec': 0x0
      },
      'replication': {
        'status': "queued",
        'progress': 0x0,
        'error': '',
        'analysis': null
      }
    };
  });
  return normalizeStoryWorkspaceAssetData({
    'project': {
      'id': projectId,
      'title': _0x2274b7,
      'sourceMode': "video-replication",
      'scriptMode': "plot",
      'storyType': "视频复刻",
      'targetAudience': _0xbca513['label'],
      'videoStyleId': '',
      'videoStylePrompt': '保留原视频的视觉风格、场景和道具',
      'customVideoStylePrompt': '',
      'videoStyle': '保留原视频的视觉风格、场景和道具',
      'aspectRatio': normalizeText(aspectRatio) || '9:16',
      'planning': {
        'episodeCount': _0x29e384["length"],
        'sceneMaxSeconds': 0xf,
        'promptMode': promptMode
      },
      'sourceDocument': null,
      'originalCreative': '',
      'summary': '',
      'chapters': [],
      'plotScript': '',
      'narrationScript': '',
      'summaryStatus': "skipped",
      'outlineStatus': "completed",
      'compiledScript': null,
      'replication': {
        'targetLocale': _0xbca513["value"],
        'targetLabel': _0xbca513["label"],
        'modelId': normalizeText(modelId),
        'provider': normalizeText(provider),
        'providerProfileId': normalizeText(providerProfileId),
        'assetLocalizationCompletedAt': 0x0,
        'status': "analyzing",
        'completedCount': 0x0,
        'failedCount': 0x0,
        'totalCount': _0x29e384["length"]
      },
      'backgroundTasks': []
    },
    'assets': [],
    'episodes': _0x29e384,
    'clipFrames': []
  });
}
export function isStoryVideoReplicationAssetLocalizationComplete(_0x4eae79 = {}) {
  return _0x4eae79?.["project"]?.['sourceMode'] === 'video-replication' && Number(_0x4eae79['project']?.['replication']?.["assetLocalizationCompletedAt"]) > 0x0 && Array['isArray'](_0x4eae79["assets"]) && _0x4eae79["assets"]['some'](_0x3133d9 => _0x3133d9?.['kind'] === "scene");
}
export function markStoryVideoReplicationAssetLocalizationComplete(_0x3ff1fb = {}, {
  completedAt = Date["now"]()
} = {}) {
  if (_0x3ff1fb?.["project"]?.["sourceMode"] !== 'video-replication') {
    return ![];
  }
  if (!Array['isArray'](_0x3ff1fb['assets']) || !_0x3ff1fb["assets"]['some'](_0x29054d => _0x29054d?.["kind"] === 'scene')) {
    return ![];
  }
  const _0x13d52b = Math["max"](0x0, Math['trunc'](Number(completedAt) || 0x0));
  if (!_0x13d52b) {
    return ![];
  }
  _0x3ff1fb["project"]["replication"] = {
    ...(_0x3ff1fb["project"]["replication"] || {}),
    'assetLocalizationCompletedAt': _0x13d52b
  };
  return !![];
}
export function invalidateStoryVideoReplicationAssetLocalization(_0x4760be = {}) {
  if (_0x4760be?.["project"]?.["sourceMode"] !== "video-replication") {
    return ![];
  }
  const _0x3c2a4e = _0x4760be["project"]["replication"];
  if (!_0x3c2a4e || !_0x3c2a4e["assetLocalizationCompletedAt"]) {
    return ![];
  }
  _0x4760be["project"]['replication'] = {
    ..._0x3c2a4e,
    'assetLocalizationCompletedAt': 0x0
  };
  return !![];
}
export function applyStoryVideoReplicationUpload(_0x257fcb = {}, {
  file = null,
  videoRef = '',
  durationSec = 0x0,
  posterUrl = '',
  posterLocalPath = ''
} = {}) {
  const _0x5490c1 = normalizePositiveNumber(durationSec);
  _0x257fcb["sourceVideo"] = {
    ...(_0x257fcb["sourceVideo"] || {}),
    ...(file ? {
      'fileName': normalizeText(file["name"]) || _0x257fcb["sourceVideo"]?.["fileName"],
      'size': Math["max"](0x0, Number(file["size"]) || 0x0),
      'mimeType': normalizeText(file['type'])
    } : {}),
    'videoRef': normalizeText(videoRef),
    'durationSec': _0x5490c1,
    'posterUrl': normalizeText(posterUrl),
    'posterLocalPath': normalizeText(posterLocalPath)
  };
  _0x257fcb["coverUrl"] = normalizeText(posterUrl || _0x257fcb['coverUrl']);
  _0x257fcb["durationSec"] = _0x5490c1;
  const _0x373c23 = Math["round"](_0x5490c1);
  _0x257fcb['duration'] = _0x373c23 ? String(Math["floor"](_0x373c23 / 0x3c))["padStart"](0x2, '0') + ':' + String(_0x373c23 % 0x3c)["padStart"](0x2, '0') : '--:--';
  _0x257fcb["replication"] = {
    ...(_0x257fcb["replication"] || {}),
    'status': 'analyzing',
    'progress': 0x2d,
    'error': ''
  };
  _0x257fcb["status"] = "解析中";
  return _0x257fcb;
}
export function applyStoryVideoReplicationAnalysis(_0x3f3e7d = {}, _0x23a52d = {}) {
  if (_0x23a52d["sourceAnalysis"]) {
    const _0x57f8c4 = _0x23a52d["sourceAnalysis"];
    if (_0x3f3e7d["replication"]?.["sourceAnalysis"] && _0x3f3e7d["replication"]['sourceAnalysis'] !== _0x57f8c4) {
      delete _0x3f3e7d["replication"]["transcription"];
    }
    const _0x469a50 = buildVideoReplicationSourceTranscript(_0x57f8c4);
    _0x3f3e7d["title"] = _0x57f8c4["title"] || _0x3f3e7d["title"];
    _0x3f3e7d["synopsis"] = _0x57f8c4['synopsis'];
    _0x3f3e7d["scriptStatus"] = "completed";
    _0x3f3e7d['script'] = {
      'schemaVersion': 0x1,
      'source': "video-replication",
      'episodeRef': _0x3f3e7d['id'],
      'fullText': _0x469a50,
      'scenes': parseUploadedStoryEpisodeScenes({
        'fullText': _0x469a50,
        'episodeRef': _0x3f3e7d['id'],
        'fallbackHeading': _0x3f3e7d["title"]
      }),
      'generatedAt': Date["now"]()
    };
    _0x3f3e7d["replication"] = {
      ..._0x3f3e7d["replication"],
      'sourceAnalysis': _0x57f8c4,
      'status': "ready",
      'progress': 0x64,
      'error': '',
      'message': '',
      'analysis': null
    };
    _0x3f3e7d["status"] = "待核对";
    return _0x3f3e7d;
  }
  const _0x53b194 = normalizePositiveNumber(_0x3f3e7d["sourceVideo"]?.["durationSec"] || _0x23a52d["durationSec"]);
  const _0x3f1af6 = Array["isArray"](_0x23a52d["segments"]) ? _0x23a52d['segments'] : [];
  const _0xb343bf = _0x3f1af6['map']((_0x3995e2, _0x225de5) => normalizeAnalysisSegment(_0x3995e2, _0x225de5, _0x53b194))["filter"](_0x42ea5a => _0x42ea5a["durationSec"] > 0x0 && (_0x42ea5a["script"] || _0x42ea5a['prompt']));
  !_0xb343bf["length"] && _0xb343bf["push"](normalizeAnalysisSegment({
    'title': normalizeText(_0x23a52d['title']) || _0x3f3e7d['title'],
    'startSec': 0x0,
    'endSec': _0x53b194 || 0xf,
    'script': normalizeText(_0x23a52d["fullScript"] || _0x23a52d['synopsis']),
    'prompt': normalizeText(_0x23a52d['seedancePrompt']),
    'camera': normalizeText(_0x23a52d["camera"]),
    'sound': normalizeText(_0x23a52d["sound"])
  }, 0x0, _0x53b194));
  const _0x23e0fe = normalizeText(_0x23a52d["fullScript"]) || _0xb343bf["map"](_0x201c94 => _0x201c94["script"])["filter"](Boolean)['join']('\x0a\x0a') || normalizeText(_0x23a52d["synopsis"] || _0x23a52d["seedancePrompt"]);
  if (!_0x23e0fe) {
    throw new Error("视频理解模型未返回可用的本地化剧本。");
  }
  const _0x5e7f86 = normalizeText(_0x23a52d["title"]) || normalizeText(_0x3f3e7d["title"]) || "未命名分集";
  const _0x4aa304 = parseUploadedStoryEpisodeScenes({
    'fullText': _0x23e0fe,
    'episodeRef': _0x3f3e7d['id'],
    'fallbackHeading': _0x5e7f86
  });
  _0x3f3e7d['title'] = _0x5e7f86;
  _0x3f3e7d["synopsis"] = normalizeText(_0x23a52d["synopsis"]) || _0x23e0fe["slice"](0x0, 0xb4);
  _0x3f3e7d["scriptStatus"] = "completed";
  _0x3f3e7d["script"] = {
    'schemaVersion': 0x1,
    'source': "video-replication",
    'episodeRef': _0x3f3e7d['id'],
    'scenes': _0x4aa304["length"] ? _0x4aa304 : [{
      'ref': _0x3f3e7d['id'] + "-scene-1",
      'heading': _0x5e7f86,
      'characters': [],
      'body': _0x23e0fe,
      'source': 'video-replication'
    }],
    'fullText': _0x23e0fe,
    'generatedAt': Date["now"]()
  };
  _0x3f3e7d["clips"] = [];
  _0x3f3e7d["clipCount"] = 0x0;
  _0x3f3e7d["status"] = '待拆分';
  _0x3f3e7d["replication"] = {
    ...(_0x3f3e7d["replication"] || {}),
    'status': "ready",
    'progress': 0x64,
    'error': '',
    'analysis': {
      'title': _0x5e7f86,
      'synopsis': _0x3f3e7d["synopsis"],
      'camera': normalizeText(_0x23a52d["camera"]),
      'sound': normalizeText(_0x23a52d['sound']),
      'seedancePrompt': normalizeText(_0x23a52d["seedancePrompt"]),
      'segmentCount': _0xb343bf['length'],
      'segments': _0xb343bf
    },
    ...(_0x23a52d['sourceAnalysis'] ? {
      'sourceAnalysis': _0x23a52d['sourceAnalysis']
    } : {}),
    'scriptSourceRevision': _0x23a52d['sourceAnalysis']?.["revision"] || _0x3f3e7d["replication"]?.["sourceAnalysis"]?.["revision"] || 0x0
  };
  return _0x3f3e7d;
}
export function failStoryVideoReplicationEpisode(_0x39cd82 = {}, _0x556abe = '') {
  const _0x5071e1 = normalizeText(_0x556abe) || "视频解析失败，请重试。";
  _0x39cd82["status"] = "解析失败";
  _0x39cd82['replication'] = {
    ...(_0x39cd82["replication"] || {}),
    'status': "failed",
    'progress': 0x0,
    'error': _0x5071e1
  };
  return _0x39cd82;
}
export function settleInterruptedStoryVideoReplication(_0x4ed26e = {}, {
  message = "上次视频解析已中断，请点击重试；已完成结果不会重新生成。"
} = {}) {
  if (_0x4ed26e?.["project"]?.["sourceMode"] !== "video-replication") {
    return 0x0;
  }
  let _0x3f8b2f = 0x0;
  for (const _0x5a7018 of _0x4ed26e["episodes"] || []) {
    if (!["queued", 'uploading', "analyzing"]["includes"](_0x5a7018?.['replication']?.["status"])) {
      continue;
    }
    failStoryVideoReplicationEpisode(_0x5a7018, message);
    _0x3f8b2f += 0x1;
  }
  if (_0x3f8b2f) {
    syncStoryVideoReplicationProject(_0x4ed26e);
  }
  return _0x3f8b2f;
}
export function reorderStoryVideoReplicationEpisodes(_0x17f44f = [], _0x513fa7 = []) {
  const _0x2e66ff = Array["isArray"](_0x17f44f) ? _0x17f44f : [];
  const _0x393586 = new Map(_0x2e66ff["map"](_0x21828c => [normalizeText(_0x21828c?.['id']), _0x21828c]));
  const _0x495f42 = new Set();
  const _0x470df6 = [];
  (Array["isArray"](_0x513fa7) ? _0x513fa7 : [])["forEach"](_0x34599 => {
    const _0x518173 = normalizeText(_0x34599);
    const _0x26a098 = _0x393586["get"](_0x518173);
    if (!_0x26a098 || _0x495f42["has"](_0x518173)) {
      return;
    }
    _0x495f42["add"](_0x518173);
    _0x470df6['push'](_0x26a098);
  });
  _0x2e66ff["forEach"](_0xa5f0f5 => {
    const _0x8bf8c9 = normalizeText(_0xa5f0f5?.['id']);
    if (!_0x8bf8c9 || _0x495f42["has"](_0x8bf8c9)) {
      return;
    }
    _0x495f42["add"](_0x8bf8c9);
    _0x470df6["push"](_0xa5f0f5);
  });
  return _0x470df6["map"]((_0x36ac82, _0x4812b6) => {
    _0x36ac82['number'] = _0x4812b6 + 0x1;
    return _0x36ac82;
  });
}
export function syncStoryVideoReplicationProject(_0x4fbbb1 = {}) {
  const _0x4862bd = Array["isArray"](_0x4fbbb1["episodes"]) ? _0x4fbbb1["episodes"] : [];
  const _0x4c75a7 = _0x4862bd["filter"](_0x1e90c4 => _0x1e90c4?.["replication"]?.["status"] === "ready");
  const _0x2c11e6 = _0x4862bd["filter"](_0x33c786 => _0x33c786?.["replication"]?.["status"] === "failed");
  const _0x2db7a1 = _0x4862bd["filter"](_0x323f04 => ["queued", 'uploading', "analyzing"]["includes"](_0x323f04?.['replication']?.["status"]));
  const _0x54c14d = _0x4c75a7["map"](_0x279950 => normalizeText(_0x279950?.['script']?.['fullText']))["filter"](Boolean)["join"]('\x0a\x0a');
  const _0x33fcb7 = _0x4fbbb1["project"] || (_0x4fbbb1["project"] = {});
  _0x33fcb7["replication"] = {
    ...(_0x33fcb7["replication"] || {}),
    'status': _0x2db7a1["length"] ? 'analyzing' : _0x2c11e6["length"] ? _0x4c75a7["length"] ? "partial" : "failed" : _0x4c75a7["length"] === _0x4862bd['length'] && _0x4862bd["length"] ? "ready" : 'pending',
    'completedCount': _0x4c75a7["length"],
    'failedCount': _0x2c11e6['length'],
    'totalCount': _0x4862bd["length"]
  };
  _0x33fcb7["chapters"] = _0x4c75a7["map"](_0x5d2910 => ({
    'id': _0x5d2910['id'],
    'title': '第\x20' + _0x5d2910["number"] + " 集：" + _0x5d2910['title'],
    'content': _0x5d2910["script"]["fullText"]
  }));
  _0x33fcb7["plotScript"] = _0x54c14d;
  _0x33fcb7['narrationScript'] = _0x54c14d;
  _0x33fcb7['originalCreative'] = _0x54c14d;
  _0x33fcb7['summary'] = _0x4c75a7["map"](_0x1095c4 => _0x1095c4["synopsis"])["filter"](Boolean)['join']('\x0a');
  const _0x4274f1 = _0x4862bd["map"](_0x16caec => _0x16caec['id']);
  const _0x5661f2 = _0x33fcb7['compiledScript'];
  const _0x1df1bc = Boolean(_0x5661f2 && _0x5661f2["fullText"] === _0x54c14d && JSON["stringify"](_0x5661f2["episodeIds"] || []) === JSON["stringify"](_0x4274f1));
  _0x33fcb7["compiledScript"] = _0x4c75a7["length"] === _0x4862bd["length"] && _0x4862bd['length'] ? {
    'revision': 0x1,
    'episodeIds': _0x4274f1,
    'fullText': _0x54c14d,
    'confirmedAt': _0x1df1bc ? _0x5661f2['confirmedAt'] : Date["now"]()
  } : null;
  return _0x4fbbb1;
}
export function getStoryVideoReplicationSummary(_0x2d7f50 = {}) {
  syncStoryVideoReplicationProject(_0x2d7f50);
  const _0x10e21e = _0x2d7f50["project"]?.["replication"] || {};
  return {
    'status': _0x10e21e["status"] || "pending",
    'total': Math['max'](0x0, Number(_0x10e21e["totalCount"]) || 0x0),
    'completed': Math["max"](0x0, Number(_0x10e21e["completedCount"]) || 0x0),
    'failed': Math["max"](0x0, Number(_0x10e21e["failedCount"]) || 0x0),
    'active': (_0x2d7f50["episodes"] || [])["filter"](_0x415628 => ["queued", "uploading", "analyzing"]['includes'](_0x415628?.["replication"]?.["status"]))["length"]
  };
}
export function getStoryVideoReplicationFooterState(_0x54e5c7 = {}, {
  localizing = ![],
  planningStatus = ''
} = {}) {
  const _0x5bb8d8 = getStoryVideoReplicationSummary(_0x54e5c7);
  const _0x1ede55 = (_0x54e5c7["episodes"] || [])["some"](_0x22ae9f => {
    const _0x20b00f = _0x22ae9f["replication"]?.["sourceAnalysis"];
    if (!_0x20b00f) {
      return ![];
    }
    const _0x453590 = getVideoReplicationDialogueSummary(_0x20b00f);
    return _0x453590["total"] === 0x0 || _0x453590["pending"] > 0x0;
  });
  const _0x5b9088 = _0x5bb8d8["active"] > 0x0;
  const _0x419f52 = _0x5b9088 || localizing;
  const _0x2e40a3 = _0x5bb8d8["completed"] > 0x0;
  const _0x4b212b = (_0x54e5c7["episodes"] || [])["some"](_0x4c7495 => _0x4c7495["replication"]?.["status"] === 'pending');
  if (localizing) {
    return {
      'busy': _0x419f52,
      'action': "localize-replication-assets",
      'actionLabel': "提取元素中",
      'actionAttention': ![],
      'actionDisabled': !![],
      'title': normalizeText(planningStatus) || "正在识别角色、场景与道具",
      'hint': "原片分析已保留，提取完成后指定替换人物"
    };
  }
  return {
    'busy': _0x419f52,
    'action': _0x2e40a3 ? "localize-replication-assets" : _0x4b212b ? 'analyze-all-replication' : 'retry-replication-analysis',
    'actionLabel': _0x5b9088 ? '解析中' : _0x2e40a3 ? "确认分析，下一步：替换人物" : _0x4b212b ? "开始分析全部待处理视频" : "重试失败视频",
    'actionAttention': _0x2e40a3,
    'actionDisabled': _0x5b9088 || !_0x2e40a3 && !_0x5bb8d8["failed"] && !_0x4b212b,
    'title': _0x5b9088 ? "正在整理提取素材，请稍后" : _0x2e40a3 ? _0x1ede55 ? '原片画面已分析，对白待核对' : '视频解析完成' : _0x5bb8d8["failed"] ? "已完成 " + _0x5bb8d8["completed"] + '/' + _0x5bb8d8["total"] + " 条，" + _0x5bb8d8["failed"] + " 条解析失败" : "等待视频解析",
    'hint': _0x5b9088 ? "已完成 " + _0x5bb8d8["completed"] + '/' + _0x5bb8d8["total"] + '\x20条，解析期间可调整卡片顺序' : _0x2e40a3 ? "核对故事和对白后，提取原片元素并设置替换；分段提示词在后续生成" : "解析失败的视频可重试，已完成结果不会重新生成"
  };
}