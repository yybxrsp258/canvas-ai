import { isStoryContinuousTimelinePromptMode, isStoryMinimaxH3PromptMode, isStorySeedance25PromptMode, isStoryWan30PromptMode, normalizeStoryPromptMode } from './storyPromptModes.js';
import { buildStoryMinimaxH3Prompt } from './storyMinimaxH3Prompt.js';
import { syncStoryClipPromptReferences } from './storyClipPromptReferences.js';
import { syncStoryReplicationPromptReferences } from './storyReplicationPromptReferences.js';
import { sanitizeStoryAssetPublicPromptText } from '../../../api/utils/storyAssetPublicText.js';
const MEDIA_FIELDS = Object["freeze"](["baseAppearanceId", 'voiceReference', "voiceReferenceHistory", "imageUrl", 'generatedImage', "videoUrl", "resultUrl", "taskId", "task", "result", 'outputs', "video", 'generation', 'inputs', "videoGenerationDurationSec", "canvasBinding", 'canvasId']);
export const STORY_CHARACTER_ASSET_PROMPT_PREFIX = "生成水平正视全身立绘，纯灰色背景";
function normalizeText(_0x474d49) {
  return String(_0x474d49 || '')['trim']();
}
function stripStoryCharacterAssetPromptPrefix(_0x454fc3 = '') {
  const _0xc62ee7 = normalizeText(_0x454fc3);
  if (!_0xc62ee7["startsWith"](STORY_CHARACTER_ASSET_PROMPT_PREFIX)) {
    return _0xc62ee7;
  }
  return _0xc62ee7["slice"](STORY_CHARACTER_ASSET_PROMPT_PREFIX["length"])["replace"](/^[\s,，。；;:：|/-]+/u, '')["trim"]();
}
function ensureStoryCharacterAssetPromptPrefix(_0x69a58c = '') {
  const _0x484332 = stripStoryCharacterAssetPromptPrefix(_0x69a58c);
  return _0x484332 ? STORY_CHARACTER_ASSET_PROMPT_PREFIX + '\x0a' + _0x484332 : '';
}
function applyStoryCharacterAssetPromptPrefix(_0x514b5b = {}) {
  if (_0x514b5b?.['kind'] !== "character") {
    return _0x514b5b;
  }
  const _0x217988 = Array["isArray"](_0x514b5b['appearances']) ? _0x514b5b["appearances"]["map"](_0x5d1af2 => ({
    ..._0x5d1af2,
    'prompt': ensureStoryCharacterAssetPromptPrefix(_0x5d1af2?.["prompt"])
  })) : [];
  return {
    ..._0x514b5b,
    'appearances': _0x217988,
    'prompt': _0x217988[0x0]?.["prompt"] || ensureStoryCharacterAssetPromptPrefix(_0x514b5b?.["prompt"])
  };
}
function removeStoryCharacterAssetPromptPrefix(_0x4fc08b = {}) {
  if (_0x4fc08b?.['kind'] !== "character") {
    return _0x4fc08b;
  }
  return {
    ..._0x4fc08b,
    'prompt': stripStoryCharacterAssetPromptPrefix(_0x4fc08b?.["prompt"]),
    'appearances': Array["isArray"](_0x4fc08b['appearances']) ? _0x4fc08b["appearances"]["map"](_0xb23325 => ({
      ..._0xb23325,
      'prompt': stripStoryCharacterAssetPromptPrefix(_0xb23325?.["prompt"])
    })) : _0x4fc08b["appearances"]
  };
}
export function normalizeStoryAssetDisplayName(_0x2d76a3, _0x32ddf3, _0xc237ba) {
  const _0x203d9d = _0x32ddf3 === "scene" ? "场景 " + (_0xc237ba + 0x1) : _0x32ddf3 === 'prop' ? '道具\x20' + (_0xc237ba + 0x1) : "角色 " + (_0xc237ba + 0x1);
  const _0x1f997d = normalizeText(_0x2d76a3)["replace"](/^(?:角色名|人物名|姓名|名称)\s*[:：]\s*/u, '')["replace"](/^[“”"'‘’]+|[“”"'‘’]+$/gu, '');
  const _0x589c30 = _0x1f997d["split"](/[，,。；;\n]/u)[0x0]?.["trim"]() || '';
  if (!_0x589c30) {
    return _0x203d9d;
  }
  const _0x4d9834 = _0x32ddf3 === "character" ? 0xc : 0x14;
  return [..._0x589c30]["slice"](0x0, _0x4d9834)['join']('');
}
export function normalizeStoryCharacterRole(_0x567046, _0xe41155 = '') {
  const _0x48c46a = normalizeText(_0x567046);
  const _0x131b67 = normalizeText(_0xe41155);
  if (/反派|敌对|反面人物|幕后黑手|宿敌|仇敌|反派首领/u["test"](_0x48c46a)) {
    return '反派';
  }
  if (/主角|男主|女主|主人公/u['test'](_0x48c46a)) {
    return '主角';
  }
  if (/^(?:路人|群众|群演|背景人物|无名角色)(?:$|[甲乙丙丁\d\s，,：:])/u['test'](_0x48c46a)) {
    return '路人';
  }
  if (/^(?:路人|群众|群演|背景人物|无名角色)(?:$|[甲乙丙丁\d\s])/u["test"](_0x131b67) || /^(?:追兵|守卫|弟子)[甲乙丙丁\d]+$/u["test"](_0x131b67)) {
    return '路人';
  }
  if (/反派|敌对|反面人物|幕后黑手|宿敌|仇敌/u['test'](_0x131b67)) {
    return '反派';
  }
  return '配角';
}
export function ensureStoryVisualStylePrefix(_0x25ccab, _0x2ad96f = '') {
  const _0xdd273 = normalizeText(_0x25ccab);
  const _0x2ecbd6 = normalizeText(_0x2ad96f);
  if (!_0x2ecbd6) {
    return _0xdd273;
  }
  if (!_0xdd273 || _0xdd273["startsWith"](_0x2ecbd6)) {
    return _0xdd273 || _0x2ecbd6;
  }
  return _0x2ecbd6 + '\x0a' + _0xdd273;
}
function replaceStoryVisualStylePrefix(_0x555848, {
  previousStyle = '',
  visualStyle = ''
} = {}) {
  const _0x23c5ce = normalizeText(previousStyle);
  let _0x555999 = normalizeText(_0x555848);
  _0x23c5ce && _0x555999["startsWith"](_0x23c5ce) && (_0x555999 = _0x555999['slice'](_0x23c5ce["length"])["replace"](/^[\s,，。；;:：|/-]+/, '')["trim"]());
  return ensureStoryVisualStylePrefix(_0x555999, visualStyle);
}
function normalizeTextArray(_0x1d5a3f) {
  return Array["isArray"](_0x1d5a3f) ? [...new Set(_0x1d5a3f["map"](normalizeText)['filter'](Boolean))] : [];
}
function normalizePositiveNumber(_0x4b430e) {
  const _0x51d744 = Number(_0x4b430e);
  return Number["isFinite"](_0x51d744) && _0x51d744 > 0x0 ? _0x51d744 : 0x0;
}
export function normalizeDurationSeconds(_0x11c4f5) {
  const _0x1e9eeb = normalizePositiveNumber(_0x11c4f5);
  if (_0x1e9eeb) {
    return _0x1e9eeb;
  }
  const _0x3d922a = Number['parseFloat'](normalizeText(_0x11c4f5));
  return Number["isFinite"](_0x3d922a) && _0x3d922a > 0x0 ? _0x3d922a : 0x0;
}
function stableHash(_0x40f590) {
  const _0x145ce2 = String(_0x40f590 || '');
  let _0x4ae2bc = 0x811c9dc5;
  for (let _0x1f0bd6 = 0x0; _0x1f0bd6 < _0x145ce2["length"]; _0x1f0bd6 += 0x1) {
    _0x4ae2bc ^= _0x145ce2['charCodeAt'](_0x1f0bd6);
    _0x4ae2bc = Math["imul"](_0x4ae2bc, 0x1000193);
  }
  return (_0x4ae2bc >>> 0x0)['toString'](0x24);
}
function normalizeIdPart(_0x196e29) {
  return normalizeText(_0x196e29)['toLowerCase']()["replace"](/[^a-z0-9]+/g, '-')["replace"](/^-+|-+$/g, '')["slice"](0x0, 0x28);
}
export function createStableStoryPlanningId(_0xb9dd3c, ..._0x39f5c6) {
  const _0x30f7ac = normalizeIdPart(_0xb9dd3c) || "story";
  const _0x4ef908 = _0x39f5c6['map'](normalizeText)["filter"](Boolean)["join"]('|') || _0x30f7ac;
  const _0x460214 = normalizeIdPart(_0x39f5c6['find'](_0x3f4170 => normalizeIdPart(_0x3f4170)) || '');
  return [_0x30f7ac, _0x460214, stableHash(_0x4ef908)]["filter"](Boolean)['join']('-');
}
export function formatStoryClockDuration(_0x380f4e) {
  const _0x201c05 = Math["max"](0x0, Math["round"](Number(_0x380f4e) || 0x0));
  const _0x35638e = Math["floor"](_0x201c05 / 0xe10);
  const _0x430f97 = Math["floor"](_0x201c05 % 0xe10 / 0x3c);
  const _0x128a1d = _0x201c05 % 0x3c;
  const _0x4730a1 = String(_0x430f97)["padStart"](0x2, '0');
  const _0x4c3b9c = String(_0x128a1d)["padStart"](0x2, '0');
  return _0x35638e > 0x0 ? String(_0x35638e)["padStart"](0x2, '0') + ':' + _0x4730a1 + ':' + _0x4c3b9c : _0x4730a1 + ':' + _0x4c3b9c;
}
export function formatStoryClipDuration(_0xd2567a) {
  const _0x4bdd6f = Math["max"](0x0, Number(_0xd2567a) || 0x0);
  return _0x4bdd6f["toFixed"](0x1) + 's';
}
function formatGeneratedStoryClipTitle(_0xb36a75 = 0x0) {
  return '片段' + String(_0xb36a75 + 0x1)["padStart"](0x2, '0');
}
function normalizeStoryAssetUsages(_0x282372, _0x4534cd = []) {
  const _0x216336 = Array["isArray"](_0x282372) ? _0x282372 : normalizeTextArray(_0x4534cd)["map"](_0xebc061 => ({
    'assetRef': _0xebc061
  }));
  const _0x4dfacb = new Set();
  const _0x1c045f = [];
  _0x216336['forEach'](_0x5defe7 => {
    if (!_0x5defe7 || typeof _0x5defe7 !== "object" || Array['isArray'](_0x5defe7)) {
      return;
    }
    const _0x3d2346 = normalizeText(_0x5defe7["assetRef"]);
    const _0x4080fc = normalizeText(_0x5defe7["appearanceRef"]);
    if (!_0x3d2346) {
      return;
    }
    const _0x2fbfba = _0x3d2346 + '\x00' + _0x4080fc;
    if (_0x4dfacb["has"](_0x2fbfba)) {
      return;
    }
    _0x4dfacb['add'](_0x2fbfba);
    _0x1c045f['push']({
      'assetRef': _0x3d2346,
      'appearanceRef': _0x4080fc
    });
  });
  return _0x1c045f;
}
function deriveStoryAssetRefs(_0x481c80 = []) {
  return normalizeTextArray(_0x481c80['map'](_0x96471 => _0x96471?.["assetRef"]));
}
function normalizeStoryEpisodeShot(_0x4ba47b = {}) {
  const _0x38d6e6 = normalizeStoryAssetUsages(_0x4ba47b?.['assetUsages'], _0x4ba47b?.["assetRefs"]);
  return {
    'durationSec': normalizeDurationSeconds(_0x4ba47b?.["durationSec"] || _0x4ba47b?.["durationSeconds"]),
    ...(Object['prototype']["hasOwnProperty"]["call"](_0x4ba47b, "startSec") ? {
      'startSec': Number(_0x4ba47b["startSec"])
    } : {}),
    ...(Object["prototype"]['hasOwnProperty']["call"](_0x4ba47b, "endSec") ? {
      'endSec': Number(_0x4ba47b["endSec"])
    } : {}),
    'time': normalizeText(_0x4ba47b?.["time"]),
    'assetUsages': _0x38d6e6,
    'assetRefs': deriveStoryAssetRefs(_0x38d6e6),
    'visual': normalizeText(_0x4ba47b?.['visual']),
    'camera': normalizeText(_0x4ba47b?.['camera']),
    'transitionFromPrevious': normalizeText(_0x4ba47b?.["transitionFromPrevious"]),
    'dialogue': normalizeText(_0x4ba47b?.["dialogue"]),
    'voiceover': normalizeText(_0x4ba47b?.["voiceover"]),
    'audio': normalizeText(_0x4ba47b?.["audio"])
  };
}
function normalizeStoryMinimaxH3ClipShots(_0x4313c0 = [], _0xba076 = '') {
  if (!isStoryMinimaxH3PromptMode(_0xba076) || !_0x4313c0['length']) {
    return _0x4313c0;
  }
  const _0x223f8c = Number(_0x4313c0["reduce"]((_0x4450bc, _0x5b65b1) => _0x4450bc + _0x5b65b1["durationSec"], 0x0)["toFixed"](0x3));
  if (_0x223f8c <= 0x0 || _0x223f8c > 0xf || Number['isInteger'](_0x223f8c) && _0x223f8c >= 0x4) {
    return _0x4313c0;
  }
  const _0x483076 = Math["max"](0x4, Math["ceil"](_0x223f8c));
  if (_0x483076 > 0xf) {
    return _0x4313c0;
  }
  const _0x14168d = _0x4313c0["length"] - 0x1;
  const _0x1e139f = _0x4313c0["slice"](0x0, _0x14168d)['reduce']((_0x3181ee, _0x3bfaf9) => _0x3181ee + _0x3bfaf9['durationSec'], 0x0);
  return _0x4313c0["map"]((_0x4fe413, _0x1fb31f) => _0x1fb31f === _0x14168d ? {
    ..._0x4fe413,
    'durationSec': Number((_0x483076 - _0x1e139f)['toFixed'](0x3))
  } : _0x4fe413);
}
function ensurePromptSentence(_0x39d774) {
  const _0x50d462 = normalizeText(_0x39d774);
  if (!_0x50d462 || /[。！？!?；;：:]$/u["test"](_0x50d462)) {
    return _0x50d462;
  }
  return _0x50d462 + '。';
}
function addStrictLookupEntry(_0x481bd8, _0x2ff465, _0x119836) {
  const _0x500460 = normalizeText(_0x2ff465);
  if (!_0x500460) {
    return;
  }
  if (_0x481bd8["has"](_0x500460) && _0x481bd8["get"](_0x500460) !== _0x119836) {
    _0x481bd8['set'](_0x500460, null);
    return;
  }
  _0x481bd8['set'](_0x500460, _0x119836);
}
function buildStoryAssetUsageLookup(_0x2ac0f6 = []) {
  const _0x20bca3 = new Map();
  (Array['isArray'](_0x2ac0f6) ? _0x2ac0f6 : [])["forEach"](_0x287a3d => {
    addStrictLookupEntry(_0x20bca3, getPlanningRef(_0x287a3d), _0x287a3d);
    addStrictLookupEntry(_0x20bca3, _0x287a3d?.['id'], _0x287a3d);
  });
  return _0x20bca3;
}
function resolveStoryAssetUsage(_0x48203f, _0x5800bc) {
  const _0x5daf84 = normalizeText(_0x48203f?.["assetRef"]);
  const _0x2f6e1c = normalizeText(_0x48203f?.['appearanceRef']);
  const _0x249446 = _0x5800bc["get"](_0x5daf84) || null;
  if (!_0x249446) {
    return {
      'assetRef': _0x5daf84,
      'appearanceRef': _0x2f6e1c,
      'asset': null,
      'appearance': null
    };
  }
  const _0x3d9ba4 = Array["isArray"](_0x249446?.['appearances']) ? _0x249446["appearances"] : [];
  const _0x1675b9 = new Map();
  _0x3d9ba4["forEach"](_0x2c46fc => {
    addStrictLookupEntry(_0x1675b9, getPlanningRef(_0x2c46fc), _0x2c46fc);
    addStrictLookupEntry(_0x1675b9, _0x2c46fc?.['id'], _0x2c46fc);
  });
  const _0x3d7e94 = _0x2f6e1c || normalizeText(_0x249446?.["baseAppearanceId"]);
  const _0xb0a739 = _0x3d7e94 ? _0x1675b9["get"](_0x3d7e94) || null : _0x3d9ba4[0x0] || null;
  return {
    'assetRef': _0x5daf84,
    'appearanceRef': _0x3d7e94,
    'asset': _0x249446,
    'appearance': _0xb0a739
  };
}
function buildStoryShotAssetReferenceText(_0xdf24cd = [], _0x5593ec = [], {
  kinds = ["scene", "character", "prop", "unknown"],
  mentionKinds = kinds
} = {}) {
  const _0x363650 = buildStoryAssetUsageLookup(_0x5593ec);
  const _0x22f6fa = new Set(kinds);
  const _0x23d419 = new Set(mentionKinds);
  const _0x1d2a3a = {
    'scene': [],
    'character': [],
    'prop': [],
    'unknown': []
  };
  const _0x34662a = [];
  normalizeStoryAssetUsages(_0xdf24cd)["forEach"](_0x2eafe5 => {
    const {
      assetRef: _0x11fc9b,
      appearanceRef: _0x4db568,
      asset: _0x4cf4b0,
      appearance: _0x184b70
    } = resolveStoryAssetUsage(_0x2eafe5, _0x363650);
    if (!_0x4cf4b0) {
      _0x22f6fa["has"]("unknown") && _0x11fc9b && !_0x1d2a3a["unknown"]['includes'](_0x11fc9b) && _0x1d2a3a["unknown"]["push"](_0x11fc9b);
      return;
    }
    const _0x253bfc = normalizeText(_0x4cf4b0?.['name']) || _0x11fc9b;
    const _0x52189e = ['scene', "character", "prop"]["includes"](_0x4cf4b0?.["kind"]) ? _0x4cf4b0["kind"] : "unknown";
    if (!_0x22f6fa["has"](_0x52189e)) {
      return;
    }
    if (_0x4db568 && !_0x184b70) {
      const _0x3637c7 = _0x253bfc + " · " + _0x4db568;
      if (!_0x34662a["includes"](_0x3637c7)) {
        _0x34662a["push"](_0x3637c7);
      }
      return;
    }
    if (!_0x23d419["has"](_0x52189e)) {
      return;
    }
    const _0x39462b = normalizeText(_0x184b70?.['name']);
    const _0x460359 = '@' + _0x253bfc + (_0x39462b ? '\x20·\x20' + _0x39462b : '');
    if (!_0x1d2a3a[_0x52189e]["includes"](_0x460359)) {
      _0x1d2a3a[_0x52189e]["push"](_0x460359);
    }
  });
  return [_0x1d2a3a["scene"]["length"] ? "场景图片：" + _0x1d2a3a["scene"]["join"]('、') : '', _0x1d2a3a["character"]["length"] ? "人物形象：" + _0x1d2a3a['character']['join']('、') : '', _0x1d2a3a["prop"]["length"] ? "道具参考：" + _0x1d2a3a["prop"]['join']('、') : '', _0x34662a["length"] ? "未解析形象：" + _0x34662a["join"]('、') : '', _0x1d2a3a['unknown']["length"] ? "未解析素材：" + _0x1d2a3a['unknown']["join"]('、') : '']["filter"](Boolean)["map"](ensurePromptSentence)["join"]('\x20');
}
const STORY_SUBJECT_FEATURE_NOISE_PATTERN = /(?:角色设定|人物设定|设定图|全身立绘|半身立绘|角色立绘|纯色背景|灰色背景|白色背景|画幅|镜头|构图|景深|光线|光影|色调|风格|写实|电影|高清|画质|分辨率|4k|8k|16\s*[:：]\s*9|9\s*[:：]\s*16|24fps|单人角色|独立人物|正视立绘|侧视立绘|标准站姿)/iu;
const STORY_SCENE_TIME_PATTERN = /(?:深夜|夜晚|夜间|午夜|清晨|黎明|早晨|上午|中午|午后|下午|黄昏|傍晚|日间|白日|白天)/u;
function stripStoryPromptPrefix(_0x57dec5 = '', _0x12c39e = '') {
  const _0x2c1327 = normalizeText(_0x57dec5);
  const _0x933bc9 = normalizeText(_0x12c39e);
  if (!_0x933bc9 || !_0x2c1327['startsWith'](_0x933bc9)) {
    return _0x2c1327;
  }
  return _0x2c1327["slice"](_0x933bc9["length"])["replace"](/^[\s,，。；;:：|/-]+/u, '')["trim"]();
}
function getStoryCharacterSubjectFeatures(_0x380fca, _0x478ad2, _0x287eb6 = '') {
  if (_0x478ad2?.["sourceOrigin"] === "library" && _0x478ad2?.["imageUrl"]) {
    return [];
  }
  const _0x13c532 = [_0x478ad2?.["prompt"], _0x478ad2?.["description"], _0x380fca?.["prompt"], _0x380fca?.["description"]];
  for (const _0x48dc05 of _0x13c532) {
    const _0x1ee65a = stripStoryPromptPrefix(stripStoryCharacterAssetPromptPrefix(sanitizeStoryAssetPublicPromptText(_0x48dc05)), _0x287eb6);
    const _0x27be38 = [...new Set(_0x1ee65a["split"](/[，,。；;\n]+/u)["map"](normalizeText)["filter"](_0x47c9de => _0x47c9de && !STORY_SUBJECT_FEATURE_NOISE_PATTERN["test"](_0x47c9de)))]['slice'](0x0, 0x3);
    if (_0x27be38["length"]) {
      return _0x27be38;
    }
  }
  return [];
}
function buildStoryClipCharacterSubjectDefinitions(_0x17d9fb = [], _0x1fff94 = [], _0x115f28 = '') {
  const _0x1ff11c = buildStoryAssetUsageLookup(_0x1fff94);
  const _0x31d62a = new Set();
  const _0xb181ee = [];
  const _0x1ef681 = [];
  normalizeStoryAssetUsages((Array["isArray"](_0x17d9fb) ? _0x17d9fb : [])["flatMap"](_0xeb52df => _0xeb52df?.["assetUsages"] || []))["forEach"](_0xadbf5a => {
    const {
      assetRef: _0x46da72,
      appearanceRef: _0x5565ff,
      asset: _0x247c37,
      appearance: _0x200c51
    } = resolveStoryAssetUsage(_0xadbf5a, _0x1ff11c);
    if (_0x247c37?.['kind'] !== 'character') {
      return;
    }
    if (_0x31d62a['has'](_0x46da72)) {
      return;
    }
    _0x31d62a['add'](_0x46da72);
    const _0x382a47 = normalizeText(_0x247c37?.["name"]) || _0x46da72;
    if (!_0x382a47) {
      return;
    }
    if (_0x5565ff && !_0x200c51) {
      _0x1ef681["push"](_0x382a47 + '\x20·\x20' + _0x5565ff);
      return;
    }
    const _0xbc6e32 = normalizeText(_0x200c51?.["name"]);
    const _0x109a51 = '@' + _0x382a47 + (_0xbc6e32 ? " · " + _0xbc6e32 : '');
    const _0x316306 = getStoryCharacterSubjectFeatures(_0x247c37, _0x200c51, _0x115f28);
    _0xb181ee["push"](_0x316306['length'] ? '将<' + _0x109a51 + ">中的" + _0x316306["join"]('、') + '定义为<' + _0x382a47 + '>。' : '将<' + _0x109a51 + ">定义为<" + _0x382a47 + '>。');
  });
  return [..._0xb181ee, _0x1ef681['length'] ? "未解析形象：" + _0x1ef681["join"]('、') + '。' : '']["filter"](Boolean)["join"]('\x0a');
}
function extractStorySceneTimeLabel(_0x1afa4a = '') {
  return normalizeText(_0x1afa4a)["match"](STORY_SCENE_TIME_PATTERN)?.[0x0] || '';
}
function resolveStoryClipSceneTimeLabel(_0x57a14c = [], _0x245cca = []) {
  const _0x305306 = buildStoryAssetUsageLookup(_0x245cca);
  const _0x4b4349 = normalizeStoryAssetUsages((Array["isArray"](_0x57a14c) ? _0x57a14c : [])['flatMap'](_0x23a553 => _0x23a553?.["assetUsages"] || []));
  for (const _0x459762 of _0x4b4349) {
    const {
      asset: _0x4d9a75,
      appearance: _0x55532c
    } = resolveStoryAssetUsage(_0x459762, _0x305306);
    if (_0x4d9a75?.["kind"] !== "scene") {
      continue;
    }
    const _0x417a60 = [_0x55532c?.['name'], _0x55532c?.["description"], _0x55532c?.["prompt"], _0x4d9a75?.["name"], _0x4d9a75?.["description"], _0x4d9a75?.["prompt"]];
    for (const _0x3cf846 of _0x417a60) {
      const _0x500eaf = extractStorySceneTimeLabel(_0x3cf846);
      if (_0x500eaf) {
        return _0x500eaf;
      }
    }
  }
  return '';
}
function stripStoryDialogueOuterQuotes(_0x33d428 = '') {
  let _0x97cd66 = normalizeText(_0x33d428);
  const _0x6fe102 = [['“', '”'], ['\x22', '\x22']];
  _0x6fe102["forEach"](([_0x17a5d6, _0x1e4d00]) => {
    _0x97cd66["startsWith"](_0x17a5d6) && _0x97cd66['endsWith'](_0x1e4d00) && (_0x97cd66 = _0x97cd66['slice'](_0x17a5d6['length'], -_0x1e4d00["length"])["trim"]());
  });
  return _0x97cd66;
}
const STORY_DIALOGUE_SPEAKER_PATTERN = /(^|[\n。！？!?；;][”"]?)\s*([^：:\n。！？!?；;“”"()（）]{1,80}(?:[（(][^）)\n]*[)）])?)[：:]\s*/gu;
function getStoryDialogueSpeakerLabels(_0x235466 = '') {
  const _0x1fa39f = normalizeText(_0x235466);
  if (!_0x1fa39f) {
    return [];
  }
  const _0x46d64b = [..._0x1fa39f["matchAll"](STORY_DIALOGUE_SPEAKER_PATTERN)];
  if (!_0x46d64b["length"] || normalizeText(_0x1fa39f["slice"](0x0, _0x46d64b[0x0]['index']))) {
    return [];
  }
  return _0x46d64b["map"](_0x4428e0 => normalizeText(_0x4428e0[0x2]))['filter'](Boolean);
}
function resolveStoryDialogueSpeakerCandidate(_0x12616e = '', _0x357e9d = [], _0x523f8b = []) {
  const _0x28e313 = normalizeText(_0x12616e);
  if (!_0x28e313) {
    return null;
  }
  const _0x3cb2e1 = buildStoryAssetUsageLookup(_0x523f8b);
  const _0x5005c1 = normalizeStoryAssetUsages(_0x357e9d)["map"](_0xd328a4 => {
    const _0x3e1548 = resolveStoryAssetUsage(_0xd328a4, _0x3cb2e1);
    const _0x184530 = normalizeText(_0x3e1548['asset']?.["name"]);
    if (_0x3e1548["asset"]?.["kind"] !== "character" || !_0x184530) {
      return null;
    }
    let _0x18e1b0 = 0x0;
    let _0x36cd4b = '';
    if (_0x28e313 === _0x184530) {
      _0x18e1b0 = 0x3;
    } else {
      if (_0x28e313['startsWith'](_0x184530)) {
        _0x18e1b0 = 0x2;
        _0x36cd4b = _0x28e313["slice"](_0x184530["length"]);
      } else {
        _0x28e313['length'] >= 0x2 && _0x184530['endsWith'](_0x28e313) && (_0x18e1b0 = 0x1);
      }
    }
    return _0x18e1b0 ? {
      ..._0x3e1548,
      'assetName': _0x184530,
      'score': _0x18e1b0,
      'suffix': _0x36cd4b
    } : null;
  })["filter"](Boolean)["sort"]((_0x90f05b, _0x73e2dd) => _0x73e2dd["score"] - _0x90f05b["score"]);
  if (!_0x5005c1['length'] || _0x5005c1[0x1] && _0x5005c1[0x1]["score"] === _0x5005c1[0x0]["score"]) {
    return null;
  }
  return _0x5005c1[0x0];
}
function resolveStoryDialogueSpeakerMention(_0x181065 = '', _0x445904 = [], _0x1689fc = []) {
  const _0x3427b8 = normalizeText(_0x181065);
  if (!_0x3427b8) {
    return '';
  }
  const _0x41fdde = resolveStoryDialogueSpeakerCandidate(_0x3427b8, _0x445904, _0x1689fc);
  if (!_0x41fdde) {
    return _0x3427b8;
  }
  const _0x50a9a0 = normalizeText(_0x41fdde['appearance']?.['name']);
  const _0x2d3c41 = '@' + _0x41fdde['assetName'] + (_0x50a9a0 ? '\x20·\x20' + _0x50a9a0 : '');
  const _0x338bf2 = _0x41fdde["suffix"]["trim"]()["replace"](/^[(（]\s*|\s*[)）]$/gu, '');
  return '' + _0x2d3c41 + (_0x338bf2 ? '（' + _0x338bf2 + '）' : '');
}
function formatStoryClipDialogue(_0x3a2f34 = '', {
  assetUsages = [],
  assets = []
} = {}) {
  const _0x3dcb07 = normalizeText(_0x3a2f34);
  if (!_0x3dcb07) {
    return '';
  }
  const _0x13ad0b = [..._0x3dcb07["matchAll"](STORY_DIALOGUE_SPEAKER_PATTERN)];
  if (!_0x13ad0b['length'] || normalizeText(_0x3dcb07["slice"](0x0, _0x13ad0b[0x0]["index"]))) {
    return '“' + stripStoryDialogueOuterQuotes(_0x3dcb07) + '”';
  }
  return _0x13ad0b["map"]((_0x53be0d, _0xa7e038) => {
    const _0x3db104 = _0x13ad0b[_0xa7e038 + 0x1];
    const _0x3cb75e = Number(_0x53be0d["index"] || 0x0) + _0x53be0d[0x0]['length'];
    const _0x2480c2 = _0x3db104 ? Number(_0x3db104["index"] || 0x0) + String(_0x3db104[0x1] || '')["length"] : _0x3dcb07["length"];
    const _0x52bc1b = resolveStoryDialogueSpeakerMention(_0x53be0d[0x2], assetUsages, assets);
    const _0x5a0206 = stripStoryDialogueOuterQuotes(_0x3dcb07["slice"](_0x3cb75e, _0x2480c2));
    return _0x52bc1b + '：“' + _0x5a0206 + '”';
  })["filter"](Boolean)["join"]('\x0a');
}
export function getStoryClipDialogueSpeakerAssetIds(_0x21a5ac = {}, _0x17a2d0 = []) {
  const _0x19380b = [];
  const _0x14b974 = new Set();
  const _0x2d6bd5 = Array["isArray"](_0x21a5ac?.["shots"]) ? _0x21a5ac['shots']['map'](normalizeStoryEpisodeShot) : [];
  _0x2d6bd5["forEach"](_0x523ce2 => {
    getStoryDialogueSpeakerLabels(_0x523ce2['dialogue'])["forEach"](_0xde5e53 => {
      const _0x1e192c = resolveStoryDialogueSpeakerCandidate(_0xde5e53, _0x523ce2["assetUsages"], _0x17a2d0);
      const _0x280fee = normalizeText(_0x1e192c?.["asset"]?.['id']);
      if (!_0x280fee || _0x14b974['has'](_0x280fee)) {
        return;
      }
      _0x14b974["add"](_0x280fee);
      _0x19380b["push"](_0x280fee);
    });
  });
  return _0x19380b;
}
function normalizeStoryDialogueVoiceDescription(_0x62cc25 = '') {
  return [...normalizeText(_0x62cc25)["replace"](/\s+/gu, '\x20')]['slice'](0x0, 0x258)["join"]('');
}
function buildStoryClipDialogueVoiceGuidanceLines(_0x3246fb = {}, _0x5bd4c6 = []) {
  const _0x2989b9 = [];
  const _0x4b750b = new Set();
  getStoryDialogueSpeakerLabels(_0x3246fb["dialogue"])['forEach'](_0x167fbb => {
    const _0x75f087 = resolveStoryDialogueSpeakerCandidate(_0x167fbb, _0x3246fb["assetUsages"], _0x5bd4c6);
    const _0x1504dc = normalizeText(_0x75f087?.['assetName']) || _0x167fbb;
    const _0x521399 = normalizeText(_0x75f087?.["asset"]?.['id']) || _0x1504dc;
    if (!_0x1504dc || _0x4b750b["has"](_0x521399)) {
      return;
    }
    _0x4b750b['add'](_0x521399);
    _0x2989b9["push"]({
      'name': _0x1504dc,
      'asset': _0x75f087?.["asset"] || null
    });
  });
  if (!_0x2989b9["length"]) {
    return [];
  }
  const _0x57dd76 = buildStoryAssetUsageLookup(_0x5bd4c6);
  const _0x20346c = [];
  const _0x58a0a3 = new Set();
  normalizeStoryAssetUsages(_0x3246fb['assetUsages'])['forEach'](_0x2a9ae7 => {
    const {
      asset: _0x316607
    } = resolveStoryAssetUsage(_0x2a9ae7, _0x57dd76);
    const _0x2fcc9d = normalizeText(_0x316607?.['id']);
    const _0xa9d0cc = normalizeText(_0x316607?.["name"]);
    const _0x59d839 = _0x2fcc9d || _0xa9d0cc;
    if (_0x316607?.["kind"] !== "character" || !_0xa9d0cc || _0x58a0a3["has"](_0x59d839)) {
      return;
    }
    _0x58a0a3["add"](_0x59d839);
    _0x20346c["push"]({
      'key': _0x59d839,
      'name': _0xa9d0cc
    });
  });
  const _0x2e2e9b = new Set(_0x2989b9['map'](({
    asset: _0x2afb10,
    name: _0x4848c9
  }) => normalizeText(_0x2afb10?.['id']) || _0x4848c9));
  const _0x2cfede = _0x20346c["filter"](({
    key: _0x457ac6
  }) => !_0x2e2e9b["has"](_0x457ac6))["map"](({
    name: _0x31bee9
  }) => _0x31bee9);
  const _0x2923ee = _0x2989b9['flatMap'](({
    name: _0x3d7f4a,
    asset: _0x7aedf3
  }) => {
    const _0x4b4fb4 = normalizeStoryDialogueVoiceDescription(_0x7aedf3?.["voiceDescription"]);
    return _0x4b4fb4 ? ['声音设定（' + _0x3d7f4a + '）：' + ensurePromptSentence(_0x4b4fb4)] : [];
  });
  const _0x206a04 = _0x2989b9["length"] === 0x1 ? "发声与口型约束：本分镜仅" + _0x2989b9[0x0]["name"] + "发声并同步口型；" + (_0x2cfede['length'] ? _0x2cfede["join"]('、') + '及' : '') + '其他画面角色保持静默，不张嘴、不做说话口型。' : "发声与口型约束：本分镜对白按标注顺序轮流发声；每句仅当前标注的说话人发声并同步口型；其余角色保持静默，不张嘴、不做说话口型。";
  return [..._0x2923ee, _0x206a04];
}
function buildStoryClipDialoguePromptBlock(_0x238250 = '', {
  assetUsages = [],
  assets = [],
  includeDialogueVoiceGuidance = ![]
} = {}) {
  const _0x44cc77 = formatStoryClipDialogue(_0x238250, {
    'assetUsages': assetUsages,
    'assets': assets
  });
  if (!_0x44cc77) {
    return '';
  }
  const _0x4d621f = [];
  includeDialogueVoiceGuidance && _0x4d621f["push"](...buildStoryClipDialogueVoiceGuidanceLines({
    'dialogue': _0x238250,
    'assetUsages': assetUsages
  }, assets));
  _0x4d621f["push"](_0x44cc77);
  return _0x4d621f["join"]('\x0a');
}
function removeStoryClipDialoguePrefix(_0x3a4fbf = '') {
  return String(_0x3a4fbf)["replace"](/(^|\n|<div>|<p>|<br\s*\/?>)[ \t]*对白：[ \t]*/gu, '$1');
}
export function applyStoryClipDialogueVoiceGuidance(_0x1b94bd = '', _0x4c9f86 = {}, _0x41d742 = []) {
  if (_0x4c9f86["promptLanguage"]) {
    return String(_0x1b94bd || '');
  }
  const _0x2ec0ff = removeStoryClipDialoguePrefix(_0x1b94bd || '');
  if (!_0x2ec0ff || !Array["isArray"](_0x4c9f86?.["shots"])) {
    return _0x2ec0ff;
  }
  const _0x3a71e9 = _0x2ec0ff["split"]('\x0a')["filter"](_0x5152aa => !/^(?:声音设定（.+?）|发声与口型约束)：/u["test"](_0x5152aa["trim"]()))["join"]('\x0a');
  const _0x2d9137 = _0x4c9f86["shots"]["map"](normalizeStoryEpisodeShot)['flatMap'](_0x198ab2 => {
    if (!normalizeText(_0x198ab2["dialogue"])) {
      return [];
    }
    const _0x15f8fe = buildStoryClipDialogueVoiceGuidanceLines(_0x198ab2, _0x41d742);
    return _0x15f8fe["length"] ? [_0x15f8fe] : [];
  });
  const _0x2b0923 = _0x3a71e9["split"]('\x0a');
  const _0x2a4807 = _0x2b0923["map"](_0x35f9f5 => {
    const _0xd3065c = _0x35f9f5["replace"](/<[^>]+>/gu, '')["trim"]();
    return !/^(?:画外音|音效)：/u['test'](_0xd3065c) && /^(?:[^：:\n“”"()（）]+(?:[（(][^）)\n]*[)）])?[：:]\s*)?[“"]/u["test"](_0xd3065c);
  });
  const _0x1b3f8a = _0x2a4807["map"]((_0x4bfade, _0xa4e33b) => _0x4bfade && !_0x2a4807[_0xa4e33b - 0x1]);
  if (_0x1b3f8a['filter'](Boolean)["length"] !== _0x2d9137["length"]) {
    return _0x2ec0ff;
  }
  let _0x5af0b2 = 0x0;
  return _0x2b0923["flatMap"]((_0x283781, _0x5df926) => {
    if (!_0x1b3f8a[_0x5df926]) {
      return [_0x283781];
    }
    const _0x5e1b26 = _0x2d9137[_0x5af0b2];
    _0x5af0b2 += 0x1;
    return [..._0x5e1b26, _0x283781];
  })["join"]('\x0a');
}
export function syncStoryEpisodeClipDialogueMentions(_0x61a5a7 = {}, _0x57e090 = [], {
  includeDialogueVoiceGuidance = ![],
  sourceMode = ''
} = {}) {
  if (_0x61a5a7['promptLanguage']) {
    return _0x61a5a7;
  }
  const _0x1be89c = String(_0x61a5a7?.['prompt'] || '');
  if (!_0x1be89c || !Array['isArray'](_0x61a5a7?.["shots"])) {
    return _0x61a5a7;
  }
  let _0x41362e = removeStoryClipDialoguePrefix(_0x1be89c);
  const _0x2b9943 = _0x61a5a7['shots']['map'](normalizeStoryEpisodeShot);
  _0x2b9943["forEach"](_0x4f7a7d => {
    const _0x2b1705 = normalizeText(_0x4f7a7d["dialogue"]);
    if (!_0x2b1705) {
      return;
    }
    const _0x246a01 = formatStoryClipDialogue(_0x2b1705);
    const _0x5e1e2b = formatStoryClipDialogue(_0x2b1705, {
      'assetUsages': _0x4f7a7d["assetUsages"],
      'assets': _0x57e090
    });
    if (!_0x246a01) {
      return;
    }
    const _0x72969a = _0x246a01;
    const _0x69d89e = _0x5e1e2b;
    if (_0x41362e['includes'](_0x69d89e)) {
      return;
    } else {
      _0x41362e['includes'](_0x72969a) && (_0x41362e = _0x41362e["replace"](_0x72969a, _0x69d89e));
    }
  });
  includeDialogueVoiceGuidance && (_0x41362e = applyStoryClipDialogueVoiceGuidance(_0x41362e, _0x61a5a7, _0x57e090));
  _0x41362e = syncStoryClipPromptReferences(_0x41362e, _0x57e090);
  if (sourceMode === "video-replication") {
    _0x41362e = syncStoryReplicationPromptReferences(_0x41362e, {
      ..._0x61a5a7,
      'shots': _0x2b9943
    }, _0x57e090);
  }
  return _0x41362e === _0x1be89c ? _0x61a5a7 : {
    ..._0x61a5a7,
    'prompt': _0x41362e
  };
}
function buildStoryClipSceneSettingText(_0x20eec9 = [], _0x62d9bb = []) {
  const _0x3504de = resolveStoryClipSceneTimeLabel(_0x20eec9, _0x62d9bb);
  const _0x2df292 = buildStoryShotAssetReferenceText(_0x20eec9['flatMap'](_0xd0e72f => _0xd0e72f?.['assetUsages'] || []), _0x62d9bb, {
    'kinds': ["scene"]
  })["replace"](/^场景图片：/u, '');
  const _0x414304 = [_0x2df292, _0x3504de ? ensurePromptSentence("时间：" + _0x3504de) : '']["filter"](Boolean)['join']('\x20');
  return _0x2df292 ? "本片段场景设定在：" + _0x414304 : '';
}
function buildStoryClipPropSettingText(_0x113e72 = [], _0x42a9ee = []) {
  const _0x13087a = buildStoryShotAssetReferenceText(_0x113e72["flatMap"](_0x492a46 => _0x492a46?.["assetUsages"] || []), _0x42a9ee, {
    'kinds': ["prop", 'unknown']
  });
  return _0x13087a ? "本片段道具设定：" + _0x13087a : '';
}
function buildStoryClipSeedance25ReferenceBindings(_0x2407c9 = [], _0x458345 = []) {
  const _0x30c040 = buildStoryAssetUsageLookup(_0x458345);
  const _0x22acc1 = [];
  const _0x2d7b39 = [];
  normalizeStoryAssetUsages((Array['isArray'](_0x2407c9) ? _0x2407c9 : [])['flatMap'](_0x15a47d => _0x15a47d?.["assetUsages"] || []))['forEach'](_0x232eed => {
    const {
      assetRef: _0x249af4,
      appearanceRef: _0x47ca05,
      asset: _0x581e05,
      appearance: _0x14b7fc
    } = resolveStoryAssetUsage(_0x232eed, _0x30c040);
    if (!_0x581e05) {
      if (_0x249af4) {
        _0x2d7b39['push'](_0x249af4);
      }
      return;
    }
    const _0xd0b709 = normalizeText(_0x581e05?.["name"]) || _0x249af4;
    if (!_0xd0b709) {
      return;
    }
    if (_0x47ca05 && !_0x14b7fc) {
      _0x2d7b39["push"](_0xd0b709 + " · " + _0x47ca05);
      return;
    }
    const _0x3388a8 = normalizeText(_0x14b7fc?.["name"]);
    const _0x272277 = '@' + _0xd0b709 + (_0x3388a8 ? '\x20·\x20' + _0x3388a8 : '');
    if (_0x581e05?.["kind"] === "character") {
      _0x22acc1["push"](_0x272277 + '：定义为' + _0xd0b709 + "，仅参考身份、五官、发型、体型与服装；不采用图中背景、表情、动作或构图。");
    } else {
      if (_0x581e05?.["kind"] === "scene") {
        _0x22acc1["push"](_0x272277 + '：作为本片段场景，仅参考空间布局、材质、固定地标、出入口与光线；不采用图中人物或前景。');
      } else {
        _0x581e05?.["kind"] === "prop" && _0x22acc1['push'](_0x272277 + '：作为本片段道具，仅参考外观、结构、材质与开场状态；不采用图中背景或构图。');
      }
    }
  });
  return [_0x22acc1['length'] ? "参考素材绑定：\n" + [...new Set(_0x22acc1)]["join"]('\x0a') : '', _0x2d7b39['length'] ? "未解析素材：" + [...new Set(_0x2d7b39)]['join']('、') + '。' : '']["filter"](Boolean)["join"]('\x0a');
}
function buildStoryClipWan30ReferenceBindings(_0x25cbee = [], _0x2b138e = []) {
  const _0x283367 = buildStoryAssetUsageLookup(_0x2b138e);
  const _0x49d0ac = [];
  const _0x998b7f = [];
  normalizeStoryAssetUsages((Array["isArray"](_0x25cbee) ? _0x25cbee : [])["flatMap"](_0x4382f7 => _0x4382f7?.["assetUsages"] || []))["forEach"](_0x25e5ed => {
    const {
      assetRef: _0x36b10e,
      appearanceRef: _0x30010c,
      asset: _0x108bbd,
      appearance: _0x5e966d
    } = resolveStoryAssetUsage(_0x25e5ed, _0x283367);
    if (!_0x108bbd) {
      if (_0x36b10e) {
        _0x998b7f['push'](_0x36b10e);
      }
      return;
    }
    const _0x122bd4 = normalizeText(_0x108bbd?.['name']) || _0x36b10e;
    if (!_0x122bd4) {
      return;
    }
    if (_0x30010c && !_0x5e966d) {
      _0x998b7f["push"](_0x122bd4 + " · " + _0x30010c);
      return;
    }
    const _0x25ad27 = normalizeText(_0x5e966d?.['name']);
    const _0x4a97a3 = '@' + _0x122bd4 + (_0x25ad27 ? " · " + _0x25ad27 : '');
    if (_0x108bbd?.["kind"] === "character") {
      _0x49d0ac["push"](_0x4a97a3 + "：定义为" + _0x122bd4 + '，图像锁定身份、五官、发型、体型与服装；如包含声音素材，则作为' + _0x122bd4 + "的声线与说话方式参考。");
    } else {
      if (_0x108bbd?.['kind'] === "scene") {
        _0x49d0ac["push"](_0x4a97a3 + "：定义为本片段场景，锁定空间布局、固定地标、出入口与光线方向。");
      } else {
        _0x108bbd?.["kind"] === 'prop' && _0x49d0ac["push"](_0x4a97a3 + '：定义为' + _0x122bd4 + "，锁定外观与开场状态。");
      }
    }
  });
  return [_0x49d0ac['length'] ? '参考素材绑定：\x0a' + [...new Set(_0x49d0ac)]['join']('\x0a') : '', _0x998b7f["length"] ? '未解析素材：' + [...new Set(_0x998b7f)]["join"]('、') + '。' : '']['filter'](Boolean)['join']('\x0a');
}
function replaceStoryClipBoundMentionsWithNames(_0x7396e7 = '', _0x4ce6ac = [], _0x10314b = []) {
  let _0x3f6dea = normalizeText(_0x7396e7);
  if (!_0x3f6dea) {
    return '';
  }
  const _0x1b58dd = buildStoryAssetUsageLookup(_0x10314b);
  const _0x1cc2a8 = normalizeStoryAssetUsages(_0x4ce6ac)['flatMap'](_0x2926ca => {
    const {
      assetRef: _0x54de69,
      asset: _0x29658d,
      appearance: _0x16ed82
    } = resolveStoryAssetUsage(_0x2926ca, _0x1b58dd);
    const _0x6d7f2a = normalizeText(_0x29658d?.["name"]) || _0x54de69;
    if (!_0x6d7f2a) {
      return [];
    }
    const _0x451e51 = normalizeText(_0x16ed82?.["name"]);
    return [_0x451e51 ? '@' + _0x6d7f2a + " · " + _0x451e51 : '', '@' + _0x6d7f2a]["filter"](Boolean)["map"](_0xdea8d0 => ({
      'mention': _0xdea8d0,
      'assetName': _0x6d7f2a
    }));
  })["sort"]((_0x2f8dbd, _0x118829) => _0x118829["mention"]["length"] - _0x2f8dbd["mention"]['length']);
  _0x1cc2a8["forEach"](({
    mention: _0x3c9fa7,
    assetName: _0x331778
  }) => {
    _0x3f6dea = _0x3f6dea["split"](_0x3c9fa7)['join'](_0x331778);
  });
  return _0x3f6dea;
}
function formatStoryContinuousTimelineRange(_0x3e34e0 = {}, _0x29c46e = 0x0, _0x3e8026 = 0x0, _0x2399df = "视频模型") {
  const _0x507024 = Number(_0x3e34e0?.["startSec"]);
  const _0x35d45c = Number(_0x3e34e0?.["endSec"]);
  const _0x3c1546 = Number(_0x3e34e0?.["durationSec"]);
  if (!Number['isInteger'](_0x507024) || !Number["isInteger"](_0x35d45c) || _0x507024 !== _0x3e8026 || _0x35d45c <= _0x507024 || _0x35d45c - _0x507024 !== _0x3c1546 || _0x35d45c > 0x1e) {
    throw new Error(_0x2399df + '\x20的分镜\x20' + (_0x29c46e + 0x1) + '\x20缺少模型返回的连续整数时间区间。');
  }
  return _0x507024 + '-' + _0x35d45c + '秒';
}
function splitStoryClipOpeningPosition(_0x169e69 = '') {
  const _0x4d5d6e = normalizeText(_0x169e69);
  if (!_0x4d5d6e["startsWith"]("人物站位：")) {
    return {
      'position': '',
      'visual': _0x4d5d6e
    };
  }
  const _0x28bfc2 = _0x4d5d6e["search"](/[。！？\n]/u);
  if (_0x28bfc2 < 0x0) {
    return {
      'position': _0x4d5d6e,
      'visual': _0x4d5d6e
    };
  }
  const _0x34e01e = _0x4d5d6e['slice'](0x0, _0x28bfc2 + 0x1)["trim"]();
  const _0x51163c = _0x4d5d6e["slice"](_0x28bfc2 + 0x1)["trim"]();
  return {
    'position': _0x34e01e,
    'visual': _0x51163c || _0x4d5d6e
  };
}
export function buildStoryEpisodeClipPrompt({
  clip = {},
  assets = [],
  visualStyle = '',
  promptMode = clip?.["promptMode"],
  includeDialogueVoiceGuidance = ![],
  sourceMode = ''
} = {}) {
  if (clip["promptLanguage"] && clip["prompt"]) {
    return String(clip['prompt']);
  }
  const _0x208a63 = normalizeStoryPromptMode(promptMode, {
    'allowDeveloperModes': !![]
  });
  const _0x3f5849 = isStorySeedance25PromptMode(_0x208a63);
  const _0x57f0e1 = isStoryWan30PromptMode(_0x208a63);
  const _0x28cde1 = isStoryMinimaxH3PromptMode(_0x208a63);
  const _0x4a84be = isStoryContinuousTimelinePromptMode(_0x208a63);
  const _0x53bf2b = Array["isArray"](clip?.['shots']) ? clip['shots']["map"](normalizeStoryEpisodeShot)["filter"](_0x28f36a => _0x28f36a["durationSec"] > 0x0) : [];
  if (!_0x53bf2b["length"]) {
    const _0x420262 = ensureStoryVisualStylePrefix(clip?.["prompt"], visualStyle);
    return sourceMode === "video-replication" ? syncStoryReplicationPromptReferences(_0x420262, {
      ...clip,
      'promptMode': _0x208a63
    }, assets) : _0x420262;
  }
  const _0x2517fb = Number(_0x53bf2b['reduce']((_0x5b99fc, _0x5924fc) => _0x5b99fc + _0x5924fc['durationSec'], 0x0)['toFixed'](0x3));
  if (_0x28cde1 && (!Number["isInteger"](_0x2517fb) || _0x2517fb < 0x4 || _0x2517fb > 0xf)) {
    throw new Error("MiniMax H3 的单个片段总时长必须是 4 至 15 秒的整数。");
  }
  if (_0x28cde1) {
    const _0x5c945b = buildStoryMinimaxH3Prompt({
      'clip': clip,
      'shots': _0x53bf2b,
      'assets': assets
    });
    return sourceMode === "video-replication" ? syncStoryReplicationPromptReferences(syncStoryClipPromptReferences(_0x5c945b, assets), {
      ...clip,
      'shots': _0x53bf2b,
      'promptMode': _0x208a63
    }, assets) : _0x5c945b;
  }
  const _0x49f387 = clip?.['directorContinuityTest'] === !![];
  const _0x3da095 = clip?.["continuityHandoff"] && typeof clip["continuityHandoff"] === "object" ? clip['continuityHandoff'] : {};
  const _0x5659e3 = Boolean(normalizeText(_0x3da095['previousExitState']));
  const _0x86b7a5 = normalizeText(clip?.['creativeIntent']) === "准确呈现当前剧情动作与情绪变化。" ? '' : normalizeText(clip?.["creativeIntent"]);
  const _0x27e09b = normalizeText(clip?.['transition']) === "镜头按动作与视线连续衔接。" ? '' : normalizeText(clip?.["transition"]);
  const _0x1676de = [normalizeText(visualStyle), _0x4a84be ? _0x57f0e1 ? buildStoryClipWan30ReferenceBindings(_0x53bf2b, assets) : buildStoryClipSeedance25ReferenceBindings(_0x53bf2b, assets) : buildStoryClipCharacterSubjectDefinitions(_0x53bf2b, assets, visualStyle), _0x4a84be ? '' : buildStoryClipSceneSettingText(_0x53bf2b, assets), _0x4a84be ? '' : buildStoryClipPropSettingText(_0x53bf2b, assets), _0x57f0e1 ? '视频目标：生成\x20' + (Number(_0x53bf2b['at'](-0x1)?.["endSec"]) || 0x0) + '\x20秒' + (_0x53bf2b['length'] === 0x1 ? '单镜头一镜到底' : "多镜头连续叙事") + "视频；严格按下方时间轴执行。" : '', _0x3f5849 || _0x49f387 ? '场景空间连续性参考锚点：同一连续时空内，除非剧情通过可见事件明确改变，场景参考图中的建筑、家具、出入口、固定地标和光线方向的相对关系保持连续；镜头变化只改变观察方式，不得整体镜像或重排世界空间布局。' : '', _0x3f5849 || _0x49f387 ? "人物空间连续性：人物站位优先用场景固定地标或主体相对关系描述，画面左/右只作当前机位补充；位置、朝向、视线与动作方向、左右手持物和动作落点按时间轴连续变化，换位或持物变化必须通过可观察动作完成，不得瞬移或无动作位置重置；不得在无人移动时对调人物相对场景地标的世界位置，仅由机位变化产生的屏幕左右变化不算换位。除非剧情通过可见事件明确改变，人物面部、发型和服装沿用已选参考形象。" : '', _0x49f387 ? "镜头执行：严格按每镜的衔接说明判断切镜或连续长镜；不要把所有分镜自动合并为一镜到底，也不要机械套用固定角度、固定正反打或固定镜头数量。" : '', _0x5659e3 ? ['连续场景技术切片：本段不是独立开场，必须从上一片段的结束状态直接续演；不得重置人物位置、朝向、动作进度、道具、车辆、设备或场景。', "上一片段结束状态为" + ensurePromptSentence(_0x3da095["previousExitState"]), normalizeText(_0x3da095["currentEntryState"]) ? "本段开场状态为" + ensurePromptSentence(_0x3da095["currentEntryState"]) : '', _0x49f387 && normalizeText(_0x3da095['previousEndCamera']) ? "上一片段结束镜头为" + ensurePromptSentence(_0x3da095["previousEndCamera"]) : '', _0x49f387 ? "本段开场镜头为" + ensurePromptSentence(_0x3da095["currentOpeningCamera"] || _0x53bf2b[0x0]?.["camera"]) : '', "只有当前分镜明确表现出移动、操作、状态变化、换场或时间跳跃时，才允许改变交接状态。"]["filter"](Boolean)["join"]('\x20') : '', _0x86b7a5 ? (_0x4a84be ? "核心故事" : "这一幕想要呈现的感觉") + '：' + ensurePromptSentence(_0x86b7a5) : '', _0x27e09b ? "分镜过渡：" + ensurePromptSentence(_0x27e09b) : '']["filter"](Boolean);
  const _0x392f2d = _0x53bf2b['flatMap'](_0x1bd852 => _0x1bd852['assetUsages'] || []);
  let _0x24feab = 0x0;
  _0x53bf2b["forEach"]((_0x3baa05, _0x16958a) => {
    const _0x2fd4ec = replaceStoryClipBoundMentionsWithNames(_0x3baa05["camera"], _0x392f2d, assets);
    const _0x61877e = replaceStoryClipBoundMentionsWithNames(_0x3baa05['visual'], _0x392f2d, assets);
    const _0x2e9cf3 = _0x16958a === 0x0 && !_0x3f5849 ? splitStoryClipOpeningPosition(_0x61877e) : {
      'position': '',
      'visual': _0x61877e
    };
    const _0x139770 = _0x2e9cf3['visual'];
    const _0x444c99 = replaceStoryClipBoundMentionsWithNames(_0x3baa05["dialogue"], _0x392f2d, assets);
    const _0x13271d = replaceStoryClipBoundMentionsWithNames(_0x3baa05['voiceover'], _0x392f2d, assets);
    const _0x1ea3ab = replaceStoryClipBoundMentionsWithNames(_0x3baa05['audio'], _0x392f2d, assets);
    const _0x20d331 = normalizeText(_0x3baa05["transitionFromPrevious"]);
    if (_0x2e9cf3["position"]) {
      _0x1676de["push"](_0x2e9cf3["position"]);
    }
    const _0x4b9ba5 = [_0x2fd4ec ? ensurePromptSentence(_0x2fd4ec) : '', _0x139770 ? ensurePromptSentence(_0x139770) : '']["filter"](Boolean)["join"]('\x20');
    _0x49f387 && _0x20d331 && _0x1676de["push"]((_0x16958a === 0x0 ? "开场衔接" : "镜头衔接") + '：' + ensurePromptSentence(_0x20d331));
    if (_0x4a84be) {
      const _0x2ef88b = formatStoryContinuousTimelineRange(_0x3baa05, _0x16958a, _0x24feab, _0x57f0e1 ? "Wan 3.0" : "Seedance 2.5");
      _0x24feab = Number(_0x3baa05["endSec"]);
      _0x1676de["push"](_0x57f0e1 ? '镜头' + (_0x16958a + 0x1) + '\x20[' + _0x2ef88b + ']：' + _0x4b9ba5 : _0x2ef88b + '：' + _0x4b9ba5);
    } else {
      _0x1676de['push']('分镜' + (_0x16958a + 0x1) + '\x20⏱\x20' + formatStoryClipDuration(_0x3baa05["durationSec"]) + '：' + _0x4b9ba5);
    }
    _0x444c99 && _0x1676de["push"](buildStoryClipDialoguePromptBlock(_0x444c99, {
      'assetUsages': _0x3baa05["assetUsages"],
      'assets': assets,
      'includeDialogueVoiceGuidance': includeDialogueVoiceGuidance
    }));
    if (_0x13271d) {
      _0x1676de['push']("画外音：" + ensurePromptSentence(_0x13271d));
    }
    if (_0x1ea3ab) {
      _0x1676de["push"]("音效：" + ensurePromptSentence(_0x1ea3ab));
    }
  });
  if (_0x3f5849) {
    _0x1676de["push"]('全局要求：角色、场景与道具严格沿用开头绑定；人物位置、朝向、持物和状态连续变化；对白口型与说话人一致，不新增人物、道具、字幕或水印。');
  } else {
    _0x57f0e1 && _0x1676de["push"]("全局要求：角色、场景与道具严格沿用开头绑定；保持人物位置、朝向、持物、服装、情绪和场景方向连续；多人对白始终使用唯一角色名，不用他或她代替说话人；对白口型、动作与说话人一致；不新增人物、道具、对白、旁白、字幕、标识或水印。");
  }
  const _0x5eb97d = syncStoryClipPromptReferences(_0x1676de["join"]('\x0a'), assets);
  return sourceMode === "video-replication" ? syncStoryReplicationPromptReferences(_0x5eb97d, {
    ...clip,
    'shots': _0x53bf2b,
    'promptMode': _0x208a63
  }, assets) : _0x5eb97d;
}
function hasMeaningfulMediaValue(_0x4511e0) {
  if (Array["isArray"](_0x4511e0)) {
    return _0x4511e0["length"] > 0x0;
  }
  if (_0x4511e0 && typeof _0x4511e0 === "object") {
    return Object["keys"](_0x4511e0)['length'] > 0x0;
  }
  return normalizeText(_0x4511e0) !== '';
}
function preserveMediaFields(_0x47a73d, _0x5e1962, _0x3ef78c) {
  if (!_0x3ef78c || !_0x5e1962 || typeof _0x5e1962 !== 'object') {
    return _0x47a73d;
  }
  const _0x50e462 = {
    ..._0x47a73d
  };
  for (const _0x123729 of MEDIA_FIELDS) {
    if (hasMeaningfulMediaValue(_0x5e1962[_0x123729])) {
      _0x50e462[_0x123729] = _0x5e1962[_0x123729];
    }
  }
  return _0x50e462;
}
function buildStoryEpisodeClipGenerationSignature(_0x22c744 = {}) {
  const _0x1d5508 = (Array["isArray"](_0x22c744?.['shots']) ? _0x22c744["shots"] : [])["map"](_0xe9e27c => ({
    'durationSec': normalizeDurationSeconds(_0xe9e27c?.['durationSec'] || _0xe9e27c?.["durationSeconds"]),
    'startSec': Number['isFinite'](Number(_0xe9e27c?.["startSec"])) ? Number(_0xe9e27c["startSec"]) : null,
    'endSec': Number["isFinite"](Number(_0xe9e27c?.["endSec"])) ? Number(_0xe9e27c["endSec"]) : null,
    'time': normalizeText(_0xe9e27c?.["time"]),
    'visual': normalizeText(_0xe9e27c?.["visual"]),
    'camera': normalizeText(_0xe9e27c?.["camera"]),
    'dialogue': normalizeText(_0xe9e27c?.["dialogue"]),
    'voiceover': normalizeText(_0xe9e27c?.["voiceover"]),
    'audio': normalizeText(_0xe9e27c?.['audio']),
    'assetRefs': normalizeTextArray(_0xe9e27c?.["assetRefs"]),
    'assetUsages': normalizeStoryAssetUsages(_0xe9e27c?.["assetUsages"])["map"](_0x535647 => ({
      'assetRef': normalizeText(_0x535647?.["assetRef"]),
      'appearanceRef': normalizeText(_0x535647?.['appearanceRef'])
    }))
  }));
  return JSON["stringify"]({
    'promptMode': normalizeStoryPromptMode(_0x22c744?.["promptMode"], {
      'allowDeveloperModes': !![]
    }),
    'durationSec': normalizeDurationSeconds(_0x22c744?.['durationSec'] || _0x22c744?.['durationSeconds'] || _0x22c744?.["duration"]),
    'script': normalizeText(_0x22c744?.["script"]),
    'creativeIntent': normalizeText(_0x22c744?.['creativeIntent']),
    'transition': normalizeText(_0x22c744?.["transition"]),
    'prompt': normalizeText(_0x22c744?.["prompt"]),
    'shots': _0x1d5508
  });
}
function canPreserveStoryEpisodeClipMedia(_0x4f00fb, _0x3c50c5, _0xb50db2) {
  if (!_0xb50db2 || !_0x3c50c5 || typeof _0x3c50c5 !== "object") {
    return ![];
  }
  return buildStoryEpisodeClipGenerationSignature(_0x4f00fb) === buildStoryEpisodeClipGenerationSignature(_0x3c50c5);
}
function getPlanningRef(_0xccb44e = {}, _0x5a328b = '') {
  return normalizeText(_0xccb44e["planningRef"] || _0xccb44e['ref'] || _0x5a328b);
}
function getAssetIdentity(_0x3ee2ff = {}) {
  const _0x1fd773 = ['scene', "prop"]["includes"](_0x3ee2ff['kind']) ? _0x3ee2ff["kind"] : 'character';
  return _0x1fd773 + ':' + normalizeText(_0x3ee2ff["name"])["toLowerCase"]();
}
function findMatchingAsset(_0x43737, _0x27e93a, _0x3a2bab) {
  const _0x21e3c7 = getPlanningRef(_0x27e93a);
  const _0x206945 = normalizeText(_0x27e93a?.['id']);
  const _0x576e21 = getAssetIdentity(_0x27e93a);
  return _0x43737["find"](_0x49bc1d => _0x206945 && normalizeText(_0x49bc1d?.['id']) === _0x206945 || _0x21e3c7 && getPlanningRef(_0x49bc1d) === _0x21e3c7 || normalizeText(_0x49bc1d?.['id']) === "story-asset-" + (_0x3a2bab + 0x1) && !normalizeText(_0x49bc1d?.['name']) || getAssetIdentity(_0x49bc1d) === _0x576e21) || null;
}
function findMatchingAppearance(_0xb23a7a, _0x14db1a) {
  const _0x41c8fd = getPlanningRef(_0x14db1a);
  const _0x4a606e = normalizeText(_0x14db1a?.["name"])["toLowerCase"]();
  return _0xb23a7a['find'](_0x26eceb => _0x41c8fd && getPlanningRef(_0x26eceb) === _0x41c8fd || _0x4a606e && normalizeText(_0x26eceb?.["name"])["toLowerCase"]() === _0x4a606e) || null;
}
function normalizeStoryPlanningAppearance(_0x10a4ee = {}, {
  assetId: _0x46f170,
  assetRef: _0x1ca811,
  assetOccurrences: _0x298d33,
  fallbackPrompt: _0x37e4ed,
  index: _0x4ebf06,
  existingAppearance: _0x4114f9,
  preserveMedia: _0x4e6e23,
  visualStyle: _0x13c22c
} = {}) {
  const _0x5fc838 = getPlanningRef(_0x10a4ee, _0x1ca811 + "-appearance-" + (_0x4ebf06 + 0x1));
  const _0x102dd2 = normalizeText(_0x4114f9?.['id']) || createStableStoryPlanningId("appearance", _0x46f170, _0x5fc838, _0x10a4ee?.['name'], String(_0x4ebf06 + 0x1));
  const _0x32b1b4 = {
    ..._0x10a4ee,
    'id': _0x102dd2,
    'planningRef': _0x5fc838,
    'name': normalizeText(_0x10a4ee?.['name']) || (_0x4ebf06 === 0x0 ? "基础形象" : "形象 " + (_0x4ebf06 + 0x1)),
    'description': normalizeText(_0x10a4ee?.["description"]),
    'occurrences': normalizeText(_0x10a4ee?.["occurrences"] || _0x298d33) || "当前项目",
    'sourceChapterIds': normalizeTextArray(_0x10a4ee?.["sourceChapterIds"]),
    'prompt': ensureStoryVisualStylePrefix(_0x10a4ee?.["prompt"] || _0x37e4ed, _0x13c22c),
    'imageUrl': normalizeText(_0x10a4ee?.['imageUrl']),
    'error': normalizeText(_0x10a4ee?.["error"])
  };
  return preserveMediaFields(_0x32b1b4, _0x4114f9, _0x4e6e23);
}
export function normalizeStoryPlanningAsset(_0x4e1faa = {}, _0x44f367 = 0x0, {
  existingAsset = null,
  preserveMedia = !![],
  visualStyle = ''
} = {}) {
  const _0x4fee4e = ["scene", "prop"]['includes'](_0x4e1faa?.["kind"]) ? _0x4e1faa["kind"] : "character";
  const _0x2229f8 = normalizeStoryAssetDisplayName(_0x4e1faa?.["name"], _0x4fee4e, _0x44f367);
  const _0x4dde94 = getPlanningRef(_0x4e1faa, "asset-" + (_0x44f367 + 0x1));
  const _0x59a8c9 = normalizeText(existingAsset?.['id']) || createStableStoryPlanningId(_0x4fee4e, _0x4dde94, _0x2229f8, String(_0x44f367 + 0x1));
  const _0x468982 = Array["isArray"](_0x4e1faa?.['appearances']) && _0x4e1faa["appearances"]['length'] ? _0x4e1faa['appearances'] : [{
    'planningRef': _0x4dde94 + '-base',
    'name': "基础形象",
    'occurrences': _0x4e1faa?.['occurrences'],
    'sourceChapterIds': _0x4e1faa?.["sourceChapterIds"],
    'prompt': _0x4e1faa?.["prompt"] || _0x4e1faa?.['description'],
    'imageUrl': _0x4e1faa?.['imageUrl']
  }];
  const _0x1343c2 = Array['isArray'](existingAsset?.["appearances"]) ? existingAsset["appearances"] : [];
  const _0x4fc97e = _0x468982["map"]((_0x4d0193, _0xf39557) => {
    const _0x175def = findMatchingAppearance(_0x1343c2, _0x4d0193);
    return normalizeStoryPlanningAppearance(_0x4d0193, {
      'assetId': _0x59a8c9,
      'assetRef': _0x4dde94,
      'assetOccurrences': _0x4e1faa?.["occurrences"],
      'fallbackPrompt': _0xf39557 === 0x0 ? _0x4e1faa?.['prompt'] || _0x4e1faa?.["description"] : '',
      'index': _0xf39557,
      'existingAppearance': _0x175def,
      'preserveMedia': preserveMedia,
      'visualStyle': visualStyle
    });
  });
  const _0x8f02e8 = {
    ..._0x4e1faa,
    'id': _0x59a8c9,
    'planningRef': _0x4dde94,
    'kind': _0x4fee4e,
    'name': _0x2229f8,
    'role': _0x4fee4e === "character" ? normalizeStoryCharacterRole(_0x4e1faa?.["role"], _0x2229f8) : normalizeText(_0x4e1faa?.["role"]),
    'description': normalizeText(_0x4e1faa?.["description"]),
    'voiceDescription': _0x4fee4e === "character" ? normalizeText(_0x4e1faa?.["voiceDescription"]) : '',
    'occurrences': normalizeText(_0x4e1faa?.["occurrences"]) || "当前项目",
    'sourceChapterIds': normalizeTextArray(_0x4e1faa?.["sourceChapterIds"]),
    'prompt': normalizeText(_0x4fc97e[0x0]?.["prompt"] || _0x4e1faa?.["prompt"]),
    'imageUrl': normalizeText(_0x4e1faa?.["imageUrl"]),
    'appearances': _0x4fc97e
  };
  const _0xc88d45 = preserveMediaFields(_0x8f02e8, existingAsset, preserveMedia);
  const _0x37ef12 = normalizeText(_0xc88d45["baseAppearanceId"]);
  const _0x2b6433 = _0x4fc97e["find"](_0x2ba0d5 => _0x2ba0d5['id'] === _0x37ef12) || _0x4fc97e[0x0];
  _0xc88d45["baseAppearanceId"] = _0x4fee4e === "character" && _0x4fc97e["length"] > 0x1 ? _0x2b6433?.['id'] || '' : '';
  return _0xc88d45;
}
export function clearStoryPlanningForRebuild(_0x20dd92 = {}) {
  const _0x37bb84 = _0x20dd92 && typeof _0x20dd92 === "object" && !Array["isArray"](_0x20dd92) ? _0x20dd92 : {};
  return {
    ..._0x37bb84,
    'assets': [],
    'episodes': (Array["isArray"](_0x37bb84["episodes"]) ? _0x37bb84["episodes"] : [])["map"](_0x3b912b => {
      const _0x535d4c = normalizeDurationSeconds(_0x3b912b?.["estimatedDurationSeconds"]);
      return {
        ..._0x3b912b,
        'assetRefs': [],
        'assetIds': [],
        'characterCount': 0x0,
        'sceneCount': 0x0,
        'propCount': 0x0,
        'coverUrl': '',
        'clips': [],
        'clipCount': 0x0,
        'durationSec': _0x535d4c,
        'duration': _0x535d4c ? formatStoryClockDuration(_0x535d4c) : "--:--",
        'status': "待拆分"
      };
    })
  };
}
export function mergeStoryPlanningAssets(_0x44da41 = [], _0x57a664 = [], {
  preserveMedia = !![],
  visualStyle = ''
} = {}) {
  const _0x5f415f = Array["isArray"](_0x44da41) ? _0x44da41 : [];
  const _0x39f21e = Array["isArray"](_0x57a664) ? _0x57a664 : [];
  return _0x39f21e['map']((_0x599438, _0x19c40b) => {
    const _0x235888 = removeStoryCharacterAssetPromptPrefix(_0x599438);
    return applyStoryCharacterAssetPromptPrefix(normalizeStoryPlanningAsset(_0x235888, _0x19c40b, {
      'existingAsset': findMatchingAsset(_0x5f415f, _0x599438, _0x19c40b),
      'preserveMedia': preserveMedia,
      'visualStyle': visualStyle
    }));
  });
}
export function syncStoryPlanningVisualStyle(_0x35de93 = {}, {
  previousStyle = '',
  visualStyle = ''
} = {}) {
  if (!_0x35de93 || typeof _0x35de93 !== 'object' || Array["isArray"](_0x35de93)) {
    return _0x35de93;
  }
  const _0x22b803 = Array["isArray"](_0x35de93['assets']) ? _0x35de93['assets']['map'](_0x32fe99 => {
    const _0x2b6770 = _0xafe1f => {
      const _0x61a08b = _0x32fe99?.["kind"] === "character" && normalizeText(_0xafe1f)["startsWith"](STORY_CHARACTER_ASSET_PROMPT_PREFIX);
      const _0x5a8e4a = _0x61a08b ? stripStoryCharacterAssetPromptPrefix(_0xafe1f) : _0xafe1f;
      const _0x858e22 = replaceStoryVisualStylePrefix(_0x5a8e4a, {
        'previousStyle': previousStyle,
        'visualStyle': visualStyle
      });
      return _0x61a08b ? ensureStoryCharacterAssetPromptPrefix(_0x858e22) : _0x858e22;
    };
    const _0x1d6d28 = Array['isArray'](_0x32fe99?.["appearances"]) ? _0x32fe99["appearances"]['map'](_0x5c23a5 => ({
      ..._0x5c23a5,
      'prompt': _0x2b6770(_0x5c23a5?.['prompt'])
    })) : [];
    return {
      ..._0x32fe99,
      'appearances': _0x1d6d28,
      'prompt': _0x1d6d28[0x0]?.["prompt"] || _0x2b6770(_0x32fe99?.["prompt"])
    };
  }) : [];
  const _0x55a6e7 = Array["isArray"](_0x35de93['episodes']) ? _0x35de93['episodes']['map'](_0x4b2d6f => ({
    ..._0x4b2d6f,
    'clips': Array["isArray"](_0x4b2d6f?.["clips"]) ? _0x4b2d6f["clips"]['map'](_0x2f5088 => ({
      ..._0x2f5088,
      'prompt': replaceStoryVisualStylePrefix(_0x2f5088?.["prompt"], {
        'previousStyle': previousStyle,
        'visualStyle': visualStyle
      })
    })) : []
  })) : [];
  return {
    ..._0x35de93,
    'assets': _0x22b803,
    'episodes': _0x55a6e7
  };
}
function buildAssetLookup(_0x136546 = []) {
  const _0x4a3772 = new Map();
  for (const _0x1f7d99 of Array['isArray'](_0x136546) ? _0x136546 : []) {
    const _0x1294e4 = normalizeText(_0x1f7d99?.['id']);
    const _0x1db05f = getPlanningRef(_0x1f7d99);
    if (_0x1294e4) {
      _0x4a3772['set'](_0x1294e4, _0x1f7d99);
    }
    if (_0x1db05f) {
      _0x4a3772["set"](_0x1db05f, _0x1f7d99);
    }
  }
  return _0x4a3772;
}
function resolveAssetIds(_0x184499, _0x4d1368) {
  return normalizeTextArray(_0x184499)["map"](_0x3b0d57 => normalizeText(_0x4d1368["get"](_0x3b0d57)?.['id'] || _0x3b0d57))["filter"](Boolean);
}
function countEpisodeAssets(_0x1f6604, _0x756372, _0x113777) {
  return _0x1f6604["filter"](_0xa5ee51 => _0x756372["get"](_0xa5ee51)?.['kind'] === _0x113777)["length"];
}
function collectStoryEpisodeAssetRefs(_0x763d43 = {}) {
  const _0x495abe = [...(Array["isArray"](_0x763d43?.["assetIds"]) ? _0x763d43["assetIds"] : []), ...(Array['isArray'](_0x763d43?.["assetRefs"]) ? _0x763d43['assetRefs'] : [])];
  for (const _0x1e0038 of Array["isArray"](_0x763d43?.["clips"]) ? _0x763d43["clips"] : []) {
    _0x495abe["push"](...(Array['isArray'](_0x1e0038?.["assetIds"]) ? _0x1e0038["assetIds"] : []), ...(Array['isArray'](_0x1e0038?.["assetRefs"]) ? _0x1e0038['assetRefs'] : []), ...(Array["isArray"](_0x1e0038?.["assetUsages"]) ? _0x1e0038["assetUsages"]["map"](_0x4d96e6 => _0x4d96e6?.["assetRef"]) : []));
    for (const _0x25a860 of Array["isArray"](_0x1e0038?.["shots"]) ? _0x1e0038['shots'] : []) {
      _0x495abe['push'](...(Array["isArray"](_0x25a860?.["assetRefs"]) ? _0x25a860["assetRefs"] : []), ...(Array["isArray"](_0x25a860?.["assetUsages"]) ? _0x25a860['assetUsages']['map'](_0x6c9f99 => _0x6c9f99?.["assetRef"]) : []));
    }
  }
  return normalizeTextArray(_0x495abe);
}
export function deriveStoryEpisodeAssetSummary(_0x5d470e = {}, _0x21418b = []) {
  const _0x13bc90 = buildAssetLookup(_0x21418b);
  const _0x182354 = normalizeTextArray(resolveAssetIds(collectStoryEpisodeAssetRefs(_0x5d470e), _0x13bc90));
  const _0x3bbdf3 = _0x182354["map"](_0x254d7e => _0x13bc90["get"](_0x254d7e))['filter']((_0x367820, _0x37d93c, _0x2150eb) => _0x367820 && ["character", 'scene', "prop"]["includes"](_0x367820["kind"]) && _0x2150eb["indexOf"](_0x367820) === _0x37d93c);
  return {
    'assetRefs': normalizeTextArray(_0x182354["map"](_0xccf6b6 => {
      const _0x2abdd6 = _0x13bc90["get"](_0xccf6b6);
      return _0x2abdd6 ? getPlanningRef(_0x2abdd6, _0xccf6b6) : _0xccf6b6;
    })),
    'assetIds': _0x182354,
    'assets': _0x3bbdf3,
    'characterCount': _0x3bbdf3["filter"](_0x4b0835 => _0x4b0835["kind"] === 'character')["length"],
    'sceneCount': _0x3bbdf3["filter"](_0x3d20c4 => _0x3d20c4['kind'] === "scene")['length'],
    'propCount': _0x3bbdf3["filter"](_0x9756a0 => _0x9756a0["kind"] === "prop")["length"]
  };
}
function findMatchingEpisode(_0x385f26, _0x5228e1, _0x4a8f73) {
  const _0x4d5c9e = normalizeText(_0x5228e1?.['id']);
  const _0x4bbaf1 = getPlanningRef(_0x5228e1);
  const _0x44544e = Math["max"](0x1, Math["trunc"](Number(_0x5228e1?.['number']) || _0x4a8f73 + 0x1));
  return _0x385f26["find"]((_0x526e5b, _0x3756b0) => _0x4d5c9e && normalizeText(_0x526e5b?.['id']) === _0x4d5c9e || _0x4bbaf1 && getPlanningRef(_0x526e5b) === _0x4bbaf1 || Math["max"](0x1, Math["trunc"](Number(_0x526e5b?.["number"]) || _0x3756b0 + 0x1)) === _0x44544e) || null;
}
function normalizeExistingClips(_0x3efffc = []) {
  return Array["isArray"](_0x3efffc) ? _0x3efffc["map"](_0x95977e => ({
    ..._0x95977e
  })) : [];
}
function hasStoryClipVideoResult(_0x43b170 = {}) {
  if (normalizeText(_0x43b170?.['result']?.["videoUrl"] || _0x43b170?.['videoUrl'] || _0x43b170?.['resultUrl'])) {
    return !![];
  }
  const _0x5b6cfc = Array["isArray"](_0x43b170?.["video"]?.["results"]) ? _0x43b170["video"]["results"] : [];
  return _0x5b6cfc['some'](_0x2c6a96 => _0x2c6a96 && !normalizeText(_0x2c6a96["error"]) && normalizeText(_0x2c6a96["videoUrl"] || _0x2c6a96['url'] || _0x2c6a96["displayUrl"] || _0x2c6a96["localPath"] || _0x2c6a96["displayLocalPath"]));
}
export function deriveStoryEpisodeStatus(_0x1f1918 = []) {
  const _0x70aca6 = Array["isArray"](_0x1f1918) ? _0x1f1918 : [];
  if (!_0x70aca6["length"]) {
    return "待拆分";
  }
  const _0x2827fa = _0x70aca6["map"](_0x10acf5 => normalizeText(_0x10acf5?.["generation"]?.["status"] || _0x10acf5?.["result"]?.['status'])["toLowerCase"]());
  if (_0x70aca6['every']((_0x5660a7, _0x546fa9) => ["succeeded", "success", "completed", 'done']["includes"](_0x2827fa[_0x546fa9]) || hasStoryClipVideoResult(_0x5660a7))) {
    return '已完成';
  }
  if (_0x2827fa["some"](_0x338e12 => ["running", "pending", "queued", "submitting", "recovering"]["includes"](_0x338e12))) {
    return "生成中";
  }
  if (_0x2827fa['some'](_0x2a05f4 => ['failed', "error"]['includes'](_0x2a05f4))) {
    return '失败';
  }
  return "待生成";
}
export function normalizeStoryEpisodePlan(_0x91fdf4 = {}, _0x1eb644 = 0x0, {
  assets = [],
  existingEpisode = null,
  preserveMedia = !![]
} = {}) {
  const _0x313a3c = Math["max"](0x1, Math['trunc'](Number(_0x91fdf4?.["number"]) || _0x1eb644 + 0x1));
  const _0x36530e = getPlanningRef(_0x91fdf4, "episode-" + _0x313a3c);
  const _0x281e05 = normalizeText(existingEpisode?.['id']) || "episode-" + _0x313a3c;
  const _0x9fcba2 = buildAssetLookup(assets);
  const _0xfd9515 = normalizeTextArray(_0x91fdf4?.['assetRefs'] || _0x91fdf4?.["assetIds"]);
  const _0x54edcb = resolveAssetIds(_0xfd9515, _0x9fcba2);
  const _0x3023f3 = normalizeDurationSeconds(_0x91fdf4?.['estimatedDurationSeconds'] || _0x91fdf4?.["durationSec"]);
  const _0x88779a = preserveMedia ? normalizeExistingClips(existingEpisode?.["clips"]) : [];
  const _0x21f4a3 = Array['isArray'](_0x91fdf4?.["clips"]) && _0x91fdf4["clips"]["length"] ? normalizeExistingClips(_0x91fdf4['clips']) : _0x88779a;
  const _0x57e778 = _0x21f4a3["reduce"]((_0x545cfa, _0x2386f1) => _0x545cfa + normalizeDurationSeconds(_0x2386f1?.['durationSec'] || _0x2386f1?.["durationSeconds"] || _0x2386f1?.["duration"]), 0x0);
  const _0x59eb9b = _0x57e778 || _0x3023f3;
  const _0x17dc9e = {
    ..._0x91fdf4,
    'id': _0x281e05,
    'planningRef': _0x36530e,
    'number': _0x313a3c,
    'title': normalizeText(_0x91fdf4?.["title"]) || '第\x20' + _0x313a3c + '\x20集',
    'synopsis': normalizeText(_0x91fdf4?.["synopsis"] || _0x91fdf4?.['content']),
    'sourceChapterIds': normalizeTextArray(_0x91fdf4?.["sourceChapterIds"]),
    'assetRefs': _0xfd9515,
    'assetIds': _0x54edcb,
    'characterCount': countEpisodeAssets(_0x54edcb, _0x9fcba2, "character"),
    'sceneCount': countEpisodeAssets(_0x54edcb, _0x9fcba2, "scene"),
    'propCount': countEpisodeAssets(_0x54edcb, _0x9fcba2, "prop"),
    'estimatedDurationSeconds': _0x3023f3,
    'durationSec': _0x59eb9b,
    'duration': _0x59eb9b ? formatStoryClockDuration(_0x59eb9b) : '--:--',
    'coverUrl': normalizeText(_0x91fdf4?.["coverUrl"]),
    'clips': _0x21f4a3,
    'clipCount': _0x21f4a3["length"],
    'status': deriveStoryEpisodeStatus(_0x21f4a3)
  };
  return preserveMediaFields(_0x17dc9e, existingEpisode, preserveMedia);
}
export function mergeStoryEpisodePlans(_0x15edc3 = [], _0x13b5a0 = [], {
  assets = [],
  preserveMedia = !![]
} = {}) {
  const _0x55bd07 = Array["isArray"](_0x15edc3) ? _0x15edc3 : [];
  const _0x1204f1 = Array['isArray'](_0x13b5a0) ? _0x13b5a0 : [];
  return _0x1204f1["map"]((_0x42e966, _0x4518ce) => normalizeStoryEpisodePlan(_0x42e966, _0x4518ce, {
    'assets': assets,
    'existingEpisode': findMatchingEpisode(_0x55bd07, _0x42e966, _0x4518ce),
    'preserveMedia': preserveMedia
  }));
}
export function isStoryEpisodeScriptComplete(_0x6b4841 = {}) {
  return normalizeText(_0x6b4841?.["script"]?.['fullText']) !== '' && Array["isArray"](_0x6b4841?.["script"]?.["scenes"]) && _0x6b4841["script"]["scenes"]["length"] > 0x0;
}
export function getNextStoryEpisodeScriptIndex(_0x4e20d2 = []) {
  const _0x1e1815 = Array['isArray'](_0x4e20d2) ? _0x4e20d2 : [];
  const _0x174e0f = _0x1e1815["findIndex"](_0x4f4c07 => !isStoryEpisodeScriptComplete(_0x4f4c07));
  return _0x174e0f < 0x0 ? _0x1e1815["length"] : _0x174e0f;
}
export function canGenerateStoryEpisodeScript(_0x223fae = [], _0x257c99 = 0x0) {
  const _0xc0135e = Array['isArray'](_0x223fae) ? _0x223fae : [];
  const _0x1ed550 = Math["trunc"](Number(_0x257c99));
  return _0x1ed550 >= 0x0 && _0x1ed550 < _0xc0135e['length'] && getNextStoryEpisodeScriptIndex(_0xc0135e) === _0x1ed550;
}
export function saveStoryEpisodeScriptDraft(_0x1ae9e7 = {}, _0x2c694b = null) {
  if (!_0x2c694b || typeof _0x2c694b !== "object" || Array["isArray"](_0x2c694b)) {
    return _0x1ae9e7;
  }
  return {
    ..._0x1ae9e7,
    'scriptStatus': 'error',
    'scriptDraft': JSON['parse'](JSON["stringify"](_0x2c694b))
  };
}
export function mergeStoryEpisodeScript(_0x1a4bbf = {}, _0x43a9b7 = {}) {
  const {
    scriptDraft: _0x2a529d,
    ..._0x1d5b2e
  } = _0x1a4bbf;
  const _0x530cd0 = Array["isArray"](_0x43a9b7?.["scenes"]) ? _0x43a9b7["scenes"]["map"](_0x1b4f5c => ({
    'ref': normalizeText(_0x1b4f5c?.["ref"]),
    'heading': normalizeText(_0x1b4f5c?.["heading"]),
    'characters': normalizeTextArray(_0x1b4f5c?.["characters"]),
    'body': normalizeText(_0x1b4f5c?.["body"])
  }))["filter"](_0x3dc5b8 => _0x3dc5b8["heading"] && _0x3dc5b8["body"]) : [];
  const _0x34d7b9 = normalizeText(_0x43a9b7?.["fullText"]);
  if (!_0x530cd0["length"] || !_0x34d7b9) {
    throw new Error("完整分集剧本缺少场次或正文。");
  }
  const _0x17148b = normalizeTextArray([...normalizeTextArray(_0x1a4bbf?.['continuityFacts']), ...normalizeTextArray(_0x43a9b7?.['continuityFacts'])]);
  const _0xc1be60 = _0x43a9b7?.['endingState'] && typeof _0x43a9b7["endingState"] === 'object' ? {
    'characters': normalizeTextArray(_0x43a9b7["endingState"]["characters"]),
    'props': normalizeTextArray(_0x43a9b7['endingState']["props"]),
    'unresolvedThreads': normalizeTextArray(_0x43a9b7["endingState"]['unresolvedThreads'])
  } : _0x1a4bbf?.["endingState"];
  return {
    ..._0x1d5b2e,
    'title': normalizeText(_0x43a9b7?.["title"]) || normalizeText(_0x1a4bbf?.['title']),
    'continuityFacts': _0x17148b,
    'endingState': _0xc1be60,
    'scriptStatus': "completed",
    'script': {
      'schemaVersion': Number(_0x43a9b7?.['schemaVersion']) || 0x1,
      'episodeRef': normalizeText(_0x43a9b7?.['episodeRef']) || getPlanningRef(_0x1a4bbf),
      'scenes': _0x530cd0,
      'fullText': _0x34d7b9,
      ...(_0x43a9b7?.["timingReview"] && typeof _0x43a9b7["timingReview"] === "object" ? {
        'timingReview': JSON["parse"](JSON["stringify"](_0x43a9b7['timingReview']))
      } : {}),
      'generatedAt': Date["now"]()
    }
  };
}
export function compileStoryEpisodeScripts(_0x48410b = []) {
  const _0x2c11a4 = Array["isArray"](_0x48410b) ? _0x48410b : [];
  const _0x29d2c1 = _0x2c11a4["filter"](isStoryEpisodeScriptComplete);
  const _0x1cc0d5 = _0x29d2c1["map"]((_0x2aa61d, _0x164fa2) => ({
    'id': normalizeText(_0x2aa61d?.['id']) || "episode-" + (_0x164fa2 + 0x1),
    'title': '第\x20' + Math["max"](0x1, Math["trunc"](Number(_0x2aa61d?.['number']) || _0x164fa2 + 0x1)) + '\x20集：' + (normalizeText(_0x2aa61d?.["title"]) || '第\x20' + (_0x164fa2 + 0x1) + '\x20集'),
    'content': normalizeText(_0x2aa61d?.["script"]?.["fullText"])
  }));
  return {
    'completedCount': _0x29d2c1["length"],
    'totalCount': _0x2c11a4["length"],
    'complete': _0x2c11a4['length'] > 0x0 && _0x29d2c1["length"] === _0x2c11a4["length"],
    'chapters': _0x1cc0d5,
    'fullText': _0x1cc0d5["map"](_0x42186d => _0x42186d['content'])["join"]('\x0a\x0a')
  };
}
export function invalidateStoryEpisodeScriptsFrom(_0x371624 = [], _0x23be70 = 0x0) {
  const _0x580cb8 = Array["isArray"](_0x371624) ? _0x371624 : [];
  const _0x15b130 = Math["max"](0x0, Math["trunc"](Number(_0x23be70) || 0x0));
  return _0x580cb8["map"]((_0x5f3b11, _0x2b3a14) => {
    if (_0x2b3a14 < _0x15b130) {
      return _0x5f3b11;
    }
    const {
      scriptDraft: _0x4fdc38,
      ..._0x30088b
    } = _0x5f3b11;
    return {
      ..._0x30088b,
      'scriptStatus': "pending",
      'script': null,
      'clips': [],
      'clipCount': 0x0,
      'status': "待生成剧本"
    };
  });
}
export function getStoryEpisodeScriptBatchTargets(_0x552b97 = [], _0x152df3 = []) {
  const _0x1e11a3 = Array['isArray'](_0x552b97) ? _0x552b97 : [];
  const _0x4ba3fb = getNextStoryEpisodeScriptIndex(_0x1e11a3);
  if (_0x4ba3fb >= _0x1e11a3["length"]) {
    return [];
  }
  const _0x5e839d = new Set(normalizeTextArray(_0x152df3));
  if (!_0x5e839d["size"]) {
    return _0x1e11a3["slice"](_0x4ba3fb);
  }
  const _0x53258e = [];
  for (let _0xdaea1 = _0x4ba3fb; _0xdaea1 < _0x1e11a3["length"]; _0xdaea1 += 0x1) {
    const _0x3f334b = _0x1e11a3[_0xdaea1];
    if (!_0x5e839d['has'](normalizeText(_0x3f334b?.['id']))) {
      break;
    }
    _0x53258e["push"](_0x3f334b);
  }
  return _0x53258e;
}
function findMatchingClip(_0x53676e, _0xdf538b, _0x456f0d, _0x13eb92 = new Set()) {
  const _0x1a7d4c = normalizeText(_0xdf538b?.['id']);
  const _0x6e7722 = getPlanningRef(_0xdf538b);
  const _0xd684cf = Math["max"](0x1, Math["trunc"](Number(_0xdf538b?.["number"]) || _0x456f0d + 0x1));
  return _0x53676e['find']((_0x13c73b, _0x58799b) => !_0x13eb92['has'](_0x13c73b) && (_0x1a7d4c && normalizeText(_0x13c73b?.['id']) === _0x1a7d4c || _0x6e7722 && getPlanningRef(_0x13c73b) === _0x6e7722 || Math['max'](0x1, Math['trunc'](Number(_0x13c73b?.["number"]) || _0x58799b + 0x1)) === _0xd684cf)) || null;
}
export function ensureUniqueStoryEpisodeClipIds(_0x3aea7d = {}) {
  const _0x116c9b = Array['isArray'](_0x3aea7d?.["clips"]) ? _0x3aea7d['clips'] : [];
  const _0x189202 = normalizeText(_0x3aea7d?.['id']) || "episode-1";
  const _0x32771d = new Set();
  let _0x1decc0 = ![];
  const _0x39e547 = _0x116c9b["map"]((_0x49580d, _0x5173c9) => {
    const _0x466b68 = normalizeText(_0x49580d?.['id']);
    if (_0x466b68 && !_0x32771d['has'](_0x466b68)) {
      _0x32771d['add'](_0x466b68);
      return _0x49580d;
    }
    const _0x4dd427 = _0x189202 + "-clip-" + (_0x5173c9 + 0x1);
    let _0x3ba985 = _0x4dd427;
    let _0x5e19d = 0x2;
    while (_0x32771d["has"](_0x3ba985)) {
      _0x3ba985 = _0x4dd427 + '-' + _0x5e19d;
      _0x5e19d += 0x1;
    }
    _0x32771d["add"](_0x3ba985);
    _0x1decc0 = !![];
    const _0x2e5ed4 = {
      ..._0x49580d,
      'id': _0x3ba985
    };
    if (_0x466b68) {
      for (const _0x34f379 of MEDIA_FIELDS) {
        delete _0x2e5ed4[_0x34f379];
      }
    }
    return _0x2e5ed4;
  });
  return _0x1decc0 ? {
    ..._0x3aea7d,
    'clips': _0x39e547
  } : _0x3aea7d;
}
function resolveStoryClipContinuitySceneKey(_0x2164f3 = {}, _0x1dd117 = new Map()) {
  const _0x1c10b6 = normalizeText(_0x2164f3?.["continuitySceneKey"] || _0x2164f3?.["sourceSceneRef"]);
  if (_0x1c10b6) {
    return _0x1c10b6;
  }
  const _0x439ae8 = normalizeStoryAssetUsages((Array["isArray"](_0x2164f3?.["shots"]) ? _0x2164f3["shots"] : [])["flatMap"](_0x1362d6 => _0x1362d6?.['assetUsages'] || []));
  const _0x40a28a = [...new Set(_0x439ae8["flatMap"](_0x13a453 => {
    const {
      assetRef: _0x40b670,
      appearanceRef: _0x26b765,
      asset: _0x4a0d08
    } = resolveStoryAssetUsage(_0x13a453, _0x1dd117);
    if (_0x4a0d08?.["kind"] !== "scene") {
      return [];
    }
    return [getPlanningRef(_0x4a0d08, _0x40b670) + '|' + _0x26b765];
  }))];
  return _0x40a28a["length"] === 0x1 ? _0x40a28a[0x0] : '';
}
function addStoryEpisodeClipContinuityHandoffs(_0x4d3750 = [], _0x130dd2 = []) {
  const _0x516a57 = Array['isArray'](_0x4d3750) ? _0x4d3750 : [];
  const _0x21da3c = buildStoryAssetUsageLookup(_0x130dd2);
  const _0x3528bb = _0x516a57["map"](_0x228800 => resolveStoryClipContinuitySceneKey(_0x228800, _0x21da3c));
  return _0x516a57['map']((_0x49634f, _0x7cef15) => {
    const _0x989abc = _0x7cef15 > 0x0 ? _0x516a57[_0x7cef15 - 0x1] : null;
    const _0x1413a5 = Boolean(_0x989abc && _0x3528bb[_0x7cef15] && _0x3528bb[_0x7cef15] === _0x3528bb[_0x7cef15 - 0x1]);
    if (!_0x1413a5) {
      if (!_0x49634f?.['continuityHandoff']) {
        return _0x49634f;
      }
      const _0x23a135 = {
        ..._0x49634f
      };
      delete _0x23a135['continuityHandoff'];
      return _0x23a135;
    }
    const _0x4392d0 = Array["isArray"](_0x989abc?.['shots']) ? _0x989abc["shots"]['at'](-0x1) : null;
    const _0xacd9ea = Array["isArray"](_0x49634f?.["shots"]) ? _0x49634f["shots"][0x0] : null;
    return {
      ..._0x49634f,
      'continuityHandoff': {
        'previousExitState': normalizeText(_0x4392d0?.["visual"]),
        'previousEndCamera': normalizeText(_0x4392d0?.["camera"]),
        'currentEntryState': normalizeText(_0xacd9ea?.["visual"]),
        'currentOpeningCamera': normalizeText(_0xacd9ea?.['camera']),
        'transitionFromPrevious': normalizeText(_0xacd9ea?.["transitionFromPrevious"])
      }
    };
  });
}
export function normalizeStoryEpisodeClip(_0x5a9f66 = {}, _0x29d3b8 = 0x0, {
  episodeId = 'episode-1',
  assets = [],
  existingClip = null,
  preserveMedia = !![],
  visualStyle = '',
  promptMode = _0x5a9f66?.['promptMode'],
  includeDialogueVoiceGuidance = ![],
  sourceMode = ''
} = {}) {
  const _0x1758a9 = normalizeStoryPromptMode(promptMode, {
    'allowDeveloperModes': !![]
  });
  const _0x47a5e0 = Math["max"](0x1, Math['trunc'](Number(_0x5a9f66?.["number"]) || _0x29d3b8 + 0x1));
  const _0x53799f = getPlanningRef(_0x5a9f66, 'clip-' + _0x47a5e0);
  const _0x41dd83 = normalizeText(existingClip?.['id']) || episodeId + '-clip-' + _0x47a5e0;
  const _0x478338 = Array["isArray"](_0x5a9f66?.['shots']) ? _0x5a9f66['shots']['map'](normalizeStoryEpisodeShot)["filter"](_0x42f72b => _0x42f72b["durationSec"] > 0x0) : [];
  const _0x381cce = normalizeStoryMinimaxH3ClipShots(_0x478338, _0x1758a9);
  const _0x5e1aa2 = _0x381cce["length"] ? _0x381cce['reduce']((_0x4d9756, _0x15bc70) => _0x4d9756 + _0x15bc70['durationSec'], 0x0) : normalizeDurationSeconds(_0x5a9f66?.["durationSec"] || _0x5a9f66?.["durationSeconds"] || _0x5a9f66?.["duration"]);
  const _0x332139 = buildAssetLookup(assets);
  const _0x3d3ca7 = _0x381cce["length"] ? normalizeStoryAssetUsages(_0x381cce["flatMap"](_0x3390e9 => _0x3390e9["assetUsages"])) : normalizeStoryAssetUsages(_0x5a9f66?.["assetUsages"], _0x5a9f66?.["assetRefs"] || _0x5a9f66?.["assetIds"]);
  const _0x4aafa1 = deriveStoryAssetRefs(_0x3d3ca7);
  const _0x282079 = normalizeText(_0x5a9f66?.["creativeIntent"]);
  const _0x3048bb = normalizeText(_0x5a9f66?.["transition"]);
  const _0xd03b58 = {
    ..._0x5a9f66,
    'id': _0x41dd83,
    'planningRef': _0x53799f,
    'number': _0x47a5e0,
    'title': normalizeText(_0x5a9f66?.['title']) || "片段 " + _0x47a5e0,
    'script': normalizeText(_0x5a9f66?.['script']),
    'promptMode': _0x1758a9,
    'creativeIntent': _0x282079,
    'transition': _0x3048bb,
    'shots': _0x381cce,
    'prompt': buildStoryEpisodeClipPrompt({
      'clip': {
        ..._0x5a9f66,
        'creativeIntent': _0x282079,
        'transition': _0x3048bb,
        'shots': _0x381cce
      },
      'assets': assets,
      'visualStyle': visualStyle,
      'promptMode': _0x1758a9,
      'includeDialogueVoiceGuidance': includeDialogueVoiceGuidance,
      'sourceMode': sourceMode
    }),
    'durationSec': _0x5e1aa2,
    'duration': formatStoryClipDuration(_0x5e1aa2),
    'assetUsages': _0x3d3ca7,
    'assetRefs': _0x4aafa1,
    'assetIds': resolveAssetIds(_0x4aafa1, _0x332139),
    'result': _0x5a9f66?.['result'] && typeof _0x5a9f66["result"] === 'object' ? {
      ..._0x5a9f66['result']
    } : {
      'status': "idle",
      'taskId': '',
      'videoUrl': '',
      'error': ''
    }
  };
  return preserveMediaFields(_0xd03b58, existingClip, canPreserveStoryEpisodeClipMedia(_0xd03b58, existingClip, preserveMedia));
}
export function insertStoryEpisodeClip(_0xd53b9f = {}, _0x51aec8 = '', {
  durationSec: _0x3ebb8f = 0x5,
  promptMode = _0xd53b9f?.["promptMode"]
} = {}) {
  const _0x39aa7b = Array["isArray"](_0xd53b9f?.["clips"]) ? _0xd53b9f["clips"] : [];
  const _0xd79f1c = _0x39aa7b['findIndex'](_0x3df2c5 => normalizeText(_0x3df2c5?.['id']) === normalizeText(_0x51aec8));
  if (_0xd79f1c < 0x0) {
    return null;
  }
  const _0xea576e = normalizeText(_0xd53b9f?.['id']) || "episode-1";
  const _0xecaf0d = new Set(_0x39aa7b["map"](_0x561008 => normalizeText(_0x561008?.['id']))["filter"](Boolean));
  let _0xdf4cc8 = _0x39aa7b["length"] + 0x1;
  let _0xd728cd = _0xea576e + "-clip-manual-" + _0xdf4cc8;
  while (_0xecaf0d["has"](_0xd728cd)) {
    _0xdf4cc8 += 0x1;
    _0xd728cd = _0xea576e + "-clip-manual-" + _0xdf4cc8;
  }
  const _0x4fa78a = normalizeDurationSeconds(_0x3ebb8f) || 0x5;
  const _0x261770 = {
    'id': _0xd728cd,
    'planningRef': 'manual-clip-' + _0xdf4cc8,
    'number': _0xd79f1c + 0x2,
    'title': "新片段",
    'script': '',
    'promptMode': normalizeText(promptMode) ? normalizeStoryPromptMode(promptMode, {
      'allowDeveloperModes': !![]
    }) : '',
    'creativeIntent': '',
    'transition': '',
    'shots': [],
    'prompt': '',
    'durationSec': _0x4fa78a,
    'duration': formatStoryClipDuration(_0x4fa78a),
    'assetUsages': [],
    'assetRefs': [],
    'assetIds': [],
    'result': {
      'status': "idle",
      'taskId': '',
      'videoUrl': '',
      'error': ''
    }
  };
  const _0x38d665 = [..._0x39aa7b["slice"](0x0, _0xd79f1c + 0x1), _0x261770, ..._0x39aa7b['slice'](_0xd79f1c + 0x1)]["map"]((_0x2629f6, _0x6a479b) => ({
    ..._0x2629f6,
    'number': _0x6a479b + 0x1
  }));
  const _0x3dceaa = _0x38d665['reduce']((_0x43586b, _0x8f6231) => _0x43586b + normalizeDurationSeconds(_0x8f6231?.['durationSec'] || _0x8f6231?.["durationSeconds"] || _0x8f6231?.["duration"]), 0x0);
  return {
    'episode': {
      ..._0xd53b9f,
      'clips': _0x38d665,
      'clipCount': _0x38d665["length"],
      'durationSec': _0x3dceaa,
      'duration': formatStoryClockDuration(_0x3dceaa),
      'status': deriveStoryEpisodeStatus(_0x38d665)
    },
    'clip': _0x38d665[_0xd79f1c + 0x1]
  };
}
export function removeStoryEpisodeClip(_0xb080b1 = {}, _0x273a64 = '') {
  const _0x4679fd = Array['isArray'](_0xb080b1?.["clips"]) ? _0xb080b1['clips'] : [];
  const _0x209804 = _0x4679fd['findIndex'](_0x5c6e75 => normalizeText(_0x5c6e75?.['id']) === normalizeText(_0x273a64));
  if (_0x209804 < 0x0) {
    return null;
  }
  const _0x274a0e = _0x4679fd[_0x209804];
  const _0x5bce70 = _0x4679fd["filter"]((_0x2b9db1, _0x297286) => _0x297286 !== _0x209804)["map"]((_0x45336e, _0x1dc5a9) => ({
    ..._0x45336e,
    'number': _0x1dc5a9 + 0x1
  }));
  const _0x108727 = _0x5bce70["reduce"]((_0x1e332e, _0x57dfbe) => _0x1e332e + normalizeDurationSeconds(_0x57dfbe?.["durationSec"] || _0x57dfbe?.["durationSeconds"] || _0x57dfbe?.["duration"]), 0x0);
  return {
    'episode': {
      ..._0xb080b1,
      'clips': _0x5bce70,
      'clipCount': _0x5bce70["length"],
      'durationSec': _0x108727,
      'duration': formatStoryClockDuration(_0x108727),
      'status': deriveStoryEpisodeStatus(_0x5bce70)
    },
    'removedClip': _0x274a0e,
    'nextClip': _0x5bce70[Math["min"](_0x209804, _0x5bce70['length'] - 0x1)] || null
  };
}
export function mergeStoryEpisodeSplit(_0x15124b = {}, _0xc40fbd = {}, {
  assets = [],
  preserveMedia = !![],
  visualStyle = '',
  promptMode = _0x15124b?.["promptMode"] || 'seedance-2.0',
  videoModelId = '',
  includeContinuityHandoffs = ![],
  includeDialogueVoiceGuidance = ![],
  sourceMode = ''
} = {}) {
  const _0x539e64 = normalizeStoryPromptMode(promptMode, {
    'allowDeveloperModes': !![]
  });
  const _0x3d266b = Array["isArray"](_0x15124b?.["clips"]) ? _0x15124b['clips'] : [];
  const _0x258cee = Array["isArray"](_0xc40fbd?.["clips"]) ? _0xc40fbd["clips"] : [];
  const _0x2f0709 = includeContinuityHandoffs ? addStoryEpisodeClipContinuityHandoffs(_0x258cee, assets) : _0x258cee;
  const _0x4538ed = normalizeText(_0x15124b?.['id']) || "episode-1";
  const _0x456e93 = new Set();
  const _0x3a0fe1 = _0x2f0709["map"]((_0x419739, _0x24c4b9) => {
    const _0x5415c7 = findMatchingClip(_0x3d266b, _0x419739, _0x24c4b9, _0x456e93);
    if (_0x5415c7) {
      _0x456e93["add"](_0x5415c7);
    }
    return normalizeStoryEpisodeClip({
      ..._0x419739,
      'title': formatGeneratedStoryClipTitle(_0x24c4b9)
    }, _0x24c4b9, {
      'episodeId': _0x4538ed,
      'assets': assets,
      'existingClip': _0x5415c7,
      'preserveMedia': preserveMedia,
      'visualStyle': visualStyle,
      'promptMode': _0x539e64,
      'includeDialogueVoiceGuidance': includeDialogueVoiceGuidance,
      'sourceMode': sourceMode
    });
  });
  const _0x5c125f = ensureUniqueStoryEpisodeClipIds({
    'id': _0x4538ed,
    'clips': _0x3a0fe1
  })["clips"];
  const _0x56c625 = _0x5c125f["reduce"]((_0x192ae0, _0x31d9dd) => _0x192ae0 + _0x31d9dd["durationSec"], 0x0);
  const _0x356bc1 = deriveStoryEpisodeAssetSummary({
    ..._0x15124b,
    'clips': _0x5c125f
  }, assets);
  const _0x2a4c30 = {
    ..._0x15124b,
    'promptMode': _0x539e64,
    ...(normalizeText(videoModelId) ? {
      'videoModelId': normalizeText(videoModelId)
    } : {}),
    'assetRefs': _0x356bc1["assetRefs"],
    'assetIds': _0x356bc1["assetIds"],
    'characterCount': _0x356bc1['characterCount'],
    'sceneCount': _0x356bc1["sceneCount"],
    'propCount': _0x356bc1['propCount'],
    'clips': _0x5c125f,
    'clipCount': _0x5c125f["length"],
    'durationSec': _0x56c625,
    'duration': formatStoryClockDuration(_0x56c625),
    'status': deriveStoryEpisodeStatus(_0x5c125f),
    ...(typeof _0xc40fbd?.["rawResponse"] === 'string' ? {
      'splitRawResponse': _0xc40fbd["rawResponse"]
    } : {})
  };
  return preserveMediaFields(_0x2a4c30, _0x15124b, preserveMedia);
}
function isStoryEpisodeSplitTransportErrorEnvelope(_0x701275) {
  const _0x2b1263 = normalizeText(_0x701275);
  if (!_0x2b1263) {
    return ![];
  }
  let _0x575feb;
  try {
    _0x575feb = JSON["parse"](_0x2b1263);
  } catch {
    return ![];
  }
  if (!_0x575feb || typeof _0x575feb !== "object" || Array['isArray'](_0x575feb)) {
    return ![];
  }
  const _0xeccdaf = Object['keys'](_0x575feb);
  const _0x34b105 = new Set(["error", "code", "message", "status", "statusCode", "details"]);
  return Object["prototype"]["hasOwnProperty"]["call"](_0x575feb, 'error') && _0xeccdaf["length"] > 0x0 && _0xeccdaf['every'](_0xf0f386 => _0x34b105["has"](_0xf0f386));
}
export function discardStaleStoryEpisodeSplitTransportDraft(_0x168064 = {}) {
  const _0x397d3f = Array['isArray'](_0x168064?.['clips']) ? _0x168064["clips"] : [];
  const _0x1fb462 = _0x168064?.["splitDraft"];
  if (!_0x397d3f["length"] || !_0x1fb462 || typeof _0x1fb462 !== "object" || Array['isArray'](_0x1fb462)) {
    return _0x168064;
  }
  const _0x3b77d3 = Array["isArray"](_0x1fb462["clips"]) && _0x1fb462["clips"]['length'] > 0x0 || Array['isArray'](_0x1fb462['items']) && _0x1fb462["items"]["some"](_0x1d146b => Array["isArray"](_0x1d146b?.["clips"]) && _0x1d146b["clips"]["length"] > 0x0 || Array["isArray"](_0x1d146b?.["rawClips"]) && _0x1d146b["rawClips"]["length"] > 0x0);
  if (_0x3b77d3 || !isStoryEpisodeSplitTransportErrorEnvelope(_0x1fb462["rawResponse"])) {
    return _0x168064;
  }
  const {
    splitDraft: _0x24ff37,
    ..._0x26112f
  } = _0x168064;
  return _0x26112f;
}