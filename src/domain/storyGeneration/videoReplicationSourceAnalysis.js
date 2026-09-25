import { REPLICATION_CHARACTER_ROLES, REPLICATION_SUBJECT_TYPES } from './videoReplicationCharacters.js';
import { getVideoReplicationAudioLanguage, buildVideoReplicationAudioLanguageRule } from './videoReplicationLanguage.js';
import { buildVideoReplicationGenerationAssets, REPLICATION_IMAGE_APPEARANCE_GUIDANCE } from './videoReplicationGenerationAssets.js';
const text = _0x230c4b => String(_0x230c4b ?? '')["trim"]();
const string = {
  'type': 'string'
};
const seconds = {
  'type': 'number',
  'minimum': 0x0
};
const strings = {
  'type': "array",
  'items': string
};
const object = _0x4e9fdf => ({
  'type': "object",
  'additionalProperties': ![],
  'required': Object["keys"](_0x4e9fdf),
  'properties': _0x4e9fdf
});
export function getVideoReplicationDialogueSummary(_0x157a9b) {
  const _0x92975b = (_0x157a9b?.["events"] || [])["flatMap"](_0x5383b5 => _0x5383b5['dialogue'] || []);
  const _0x59d0ab = _0x92975b["filter"](_0x139766 => text(_0x139766["text"]) && !/^\[?\s*(?:听不清|无法听清|无法辨认|不可辨认)/u["test"](text(_0x139766["text"])));
  const _0x2faeee = _0x59d0ab["filter"](_0x280ef9 => _0x280ef9["uncertain"] || !_0x280ef9["speakerId"])["length"];
  return {
    'total': _0x59d0ab['length'],
    'pending': _0x2faeee,
    'label': _0x59d0ab["length"] ? '对白\x20' + _0x59d0ab["length"] + '\x20句' + (_0x2faeee ? " · " + _0x2faeee + '\x20句待核对' : '') : "本次分析未返回可用对白"
  };
}
export function createVideoReplicationSourceOutput() {
  return {
    'name': "video_replication_source_analysis",
    'strict': !![],
    'fallback': "prompt",
    'schema': object({
      'videoObserved': {
        'type': "boolean"
      },
      'observationError': string,
      'title': string,
      'synopsis': string,
      'sourceLanguage': string,
      'characters': {
        'type': "array",
        'items': object({
          'id': string,
          'name': string,
          'description': string,
          'identityNotes': string,
          'role': {
            'type': "string",
            'enum': Object["keys"](REPLICATION_CHARACTER_ROLES)
          },
          'subjectType': {
            'type': "string",
            'enum': Object["keys"](REPLICATION_SUBJECT_TYPES)
          },
          'roleEvidence': string,
          'representativeTimeSec': seconds
        })
      },
      'events': {
        'type': "array",
        'minItems': 0x1,
        'items': object({
          'id': string,
          'startSec': seconds,
          'endSec': seconds,
          'visual': string,
          'camera': string,
          'sound': string,
          'characterIds': strings,
          'dialogue': {
            'type': "array",
            'items': object({
              'speakerId': string,
              'text': string,
              'uncertain': {
                'type': "boolean"
              }
            })
          },
          'uncertainties': strings
        })
      }
    })
  };
}
export function buildVideoReplicationSourcePrompt({
  durationSec = 0x0
} = {}) {
  return ["必须实际读取所附视频的画面后才能设置 videoObserved=true。未收到视频、链接无法读取或接口不支持视频时，设置 videoObserved=false，并在 observationError 说明原因；禁止把无法读取视频当成无人场景或成功分析。", '先理解整段原视频，再按时间顺序整理完整故事、可区分的主体、动作、镜头和对白。只记录原片事实，不翻译、不本地化、不换人物、不编写生成提示词。', "原片时长 " + (Number(durationSec) || 0x0) + '\x20秒。events\x20按剧情顺序记录关键动作、镜头和完整对白，时间用原片绝对秒数的大致范围，不按固定15秒截断。时间只用于定位和核对，不要求逐秒对齐或首尾精确衔接，允许事件间有空隙或时间范围重叠。', "完整观看原片，重点识别人物、剧情因果和结局。无剧情变化的停顿、黑场或片尾字幕无需单独凑成事件；不要为填满时长虚构事件或拉长时间。未看清、听不清或无法确认的内容写入疑点供用户核对。", "说明性文字用简体中文；对白原语言逐句保留。听不清的对白写[听不清]并标记 uncertain；禁止补写猜测的台词。", "characters 记录画面中可区分的人物或动物，使用稳定 id（如 person-1）。不认识姓名可用红衣人物等可观察称呼；不得猜测真实身份或无依据的亲属关系。", '同一主体跨镜头沿用\x20id。服装变化不等于新人，衣服相同不证明同一人；无法确认的保持分开，在\x20identityNotes\x20和相关事件\x20uncertainties\x20写清疑点。', "先通看全片建立角色名单，再逐镜头核对是否漏人或把同一角色重复计数。characters 是全片去重后的可区分角色，不是单帧人数；背景人群无法逐个辨认时在 uncertainties 说明，不虚构个人。镜子、照片和屏幕中的同一主体不重复计数。", "role 根据全片故事功能标为 main（主角，可有多位）、supporting（配角）、background（背景人物）或 uncertain（待确认）；roleEvidence 写明推动哪些事件或承担什么叙事作用，不能仅按出场时间或画面中心判断。subjectType 区分 person、animal、uncertain。", '主角和配角需逐个写清可观察的外观差异、画面位置及跨镜头连续性依据。若存在遮挡、背影、换装或相似人物，保留身份疑点；不要把无法确认的人强行合并。返回前逐项核对人物名单、每个事件出场角色和对白说话人。', "每个角色 representativeTimeSec 选择其实际出现且尽量清晰的画面时刻，description 明确外观及在该帧中的位置，便于自动截图后核对。不要虚构边框坐标。", 'events.characterIds\x20只列当前画面实际可见主体；dialogue.speakerId\x20记录有证据的说话人，无法确认用空字符串并标记\x20uncertain。画外音不能默认归给画面中的人。', "保持全部关键动作、事件因果、道具变化、对白顺序与结局；visual 描述谁对谁做什么，camera 记录原片可观察的景别和运动。", "只返回指定 JSON。没有人物或对白时返回空数组，不能为了填字段编造。"]['join']('\x0a');
}
export function parseVideoReplicationSourceResult(_0x43a6bf, {
  durationSec = 0x0
} = {}) {
  const _0x273e66 = text(_0x43a6bf?.["text"] ?? _0x43a6bf)["replace"](/^```(?:json)?\s*|\s*```$/gu, '');
  let _0x10cf50;
  try {
    _0x10cf50 = JSON['parse'](_0x273e66);
  } catch {
    throw new Error('原视频分析未返回有效\x20JSON，请重试分析。');
  }
  if (_0x10cf50?.["videoObserved"] !== !![]) {
    throw new Error("模型未确认读取到原视频，不能确定人物数量。" + (text(_0x10cf50?.["observationError"]) || '请检查视频地址或更换支持视频理解的模型后重新分析。'));
  }
  return normalizeVideoReplicationSource(_0x10cf50, {
    'durationSec': durationSec
  });
}
export function normalizeVideoReplicationSource(_0x59b34f, {
  durationSec = 0x0
} = {}) {
  if (!_0x59b34f || !Array['isArray'](_0x59b34f["events"]) || !_0x59b34f["events"]["length"]) {
    throw new Error("原视频分析缺少事件时间轴。");
  }
  const _0x2b1f4d = Number(durationSec) > 0x0 ? Number(durationSec) : Infinity;
  const _0x305087 = new Set();
  const _0x34f656 = (Array["isArray"](_0x59b34f["characters"]) ? _0x59b34f["characters"] : [])["map"](_0xad8d0c => {
    const _0x1fcb9c = text(_0xad8d0c['id']);
    const _0x1e641f = Number(_0xad8d0c["representativeTimeSec"]);
    if (!_0x1fcb9c || _0x305087['has'](_0x1fcb9c) || !Number['isFinite'](_0x1e641f) || _0x1e641f < 0x0 || _0x1e641f >= _0x2b1f4d) {
      throw new Error('原视频人物编号或代表帧时间无效。');
    }
    _0x305087["add"](_0x1fcb9c);
    const _0x5b6fd5 = text(_0xad8d0c["role"]) || "uncertain";
    const _0x542e0a = text(_0xad8d0c["subjectType"]) || "uncertain";
    if (!Object["hasOwn"](REPLICATION_CHARACTER_ROLES, _0x5b6fd5) || !Object['hasOwn'](REPLICATION_SUBJECT_TYPES, _0x542e0a)) {
      throw new Error("原视频角色类型无效，请重新分析。");
    }
    return {
      'id': _0x1fcb9c,
      'name': text(_0xad8d0c["name"]) || _0x1fcb9c,
      'description': text(_0xad8d0c['description']),
      'role': _0x5b6fd5,
      'subjectType': _0x542e0a,
      'roleEvidence': text(_0xad8d0c["roleEvidence"]),
      'identityNotes': text(_0xad8d0c["identityNotes"]),
      'representativeTimeSec': _0x1e641f
    };
  });
  const _0x4c5ef5 = new Set();
  const _0x337647 = _0x59b34f['events']["map"](_0xc5cda6 => {
    const _0xb6ff7c = text(_0xc5cda6['id']);
    const _0x2ce64c = Number(_0xc5cda6["startSec"]);
    const _0x285318 = Number(_0xc5cda6["endSec"]);
    const _0xf6adb2 = Math["min"](_0x285318, _0x2b1f4d);
    if (!_0xb6ff7c || _0x4c5ef5["has"](_0xb6ff7c) || !Number["isFinite"](_0x2ce64c) || !Number['isFinite'](_0x285318) || _0x2ce64c < 0x0 || _0xf6adb2 <= _0x2ce64c) {
      throw new Error("原视频事件编号或时间范围无效，请重试分析。");
    }
    _0x4c5ef5["add"](_0xb6ff7c);
    const _0x5f4a68 = [...new Set((_0xc5cda6['characterIds'] || [])["map"](text))];
    const _0x3a50b9 = (_0xc5cda6["dialogue"] || [])["map"](_0x81223f => ({
      'speakerId': text(_0x81223f["speakerId"]),
      'text': text(_0x81223f["text"]),
      'uncertain': _0x81223f['uncertain'] === !![] || !text(_0x81223f["speakerId"])
    }));
    if (_0x5f4a68["some"](_0x3369c5 => !_0x305087['has'](_0x3369c5)) || _0x3a50b9["some"](_0x43cd9c => _0x43cd9c['speakerId'] && !_0x305087["has"](_0x43cd9c["speakerId"]))) {
      throw new Error("原视频分析引用了未登记的人物。");
    }
    return {
      'id': _0xb6ff7c,
      'startSec': _0x2ce64c,
      'endSec': _0xf6adb2,
      'visual': text(_0xc5cda6['visual']),
      'camera': text(_0xc5cda6['camera']),
      'sound': text(_0xc5cda6["sound"]),
      'characterIds': _0x5f4a68,
      'dialogue': _0x3a50b9,
      'uncertainties': [...(_0xc5cda6["uncertainties"] || [])["map"](text)['filter'](Boolean), ...(_0x285318 > _0x2b1f4d ? ["模型估计的结束时间超出视频时长，已限制到视频结尾，请核对内容。"] : [])]
    };
  });
  for (const _0x29eaaf of _0x34f656) {
    !_0x337647["some"](_0x424717 => _0x424717["characterIds"]["includes"](_0x29eaaf['id']) && _0x29eaaf["representativeTimeSec"] >= _0x424717["startSec"] && _0x29eaaf['representativeTimeSec'] < _0x424717["endSec"]) && (_0x29eaaf["identityNotes"] = [_0x29eaaf["identityNotes"], "代表帧时间与事件标注未对齐，请核对人物截图。"]["filter"](Boolean)["join"]('\x0a'));
  }
  return {
    'schemaVersion': 0x1,
    'title': text(_0x59b34f["title"]),
    'synopsis': text(_0x59b34f["synopsis"]),
    'sourceLanguage': text(_0x59b34f["sourceLanguage"]),
    'characters': _0x34f656,
    'events': _0x337647,
    'revision': 0x1
  };
}
export function buildVideoReplicationSourceTranscript(_0x26ff56) {
  return [_0x26ff56["synopsis"], ..._0x26ff56["events"]['map'](_0x1088ec => ['[' + _0x1088ec['startSec'] + '–' + _0x1088ec["endSec"] + "秒] " + _0x1088ec["visual"], ..._0x1088ec["dialogue"]["map"](_0xbb16b1 => {
    const _0x25fccf = _0x26ff56['characters']["find"](_0x4c6580 => _0x4c6580['id'] === _0xbb16b1["speakerId"]);
    return (_0x25fccf ? _0x25fccf['id'] + '（' + _0x25fccf["name"] + '）' : "[说话人待核对]") + '：' + _0xbb16b1["text"] + (_0xbb16b1["uncertain"] ? " [待核对]" : '');
  })]["join"]('\x0a'))]['filter'](Boolean)["join"]('\x0a\x0a');
}
export function buildVideoReplicationTimingGuidance(_0xbdb556 = {}) {
  const _0x2598f0 = Number(_0xbdb556["sourceVideo"]?.["durationSec"]);
  if (!_0xbdb556["replication"]?.["sourceAnalysis"] || !Number["isFinite"](_0x2598f0) || _0x2598f0 <= 0x0) {
    return '';
  }
  return "原片时长为 " + Number(_0x2598f0['toFixed'](0x3)) + " 秒，整片总时长和叙事节奏应尽量接近原片。原片时间线是节奏参考，保留动作、反应、停顿和运镜，不要求逐秒对应，不得仅按对白长度压缩整片。换语言后按译后对白的自然语速、断句和情绪重新估时；英文单词不能按中文字数等速处理。译后对白需要更久时允许总时长超过原片，应延长镜头或增加连续片段，禁止加速口播、吞字、删对白来挤进原时长。先估算每段对白和不能同步完成的动作，再核对所有片段时长合计；若明显短于原片，检查是否漏掉内容或压缩了表演时间。不要为凑秒数增加无关剧情、空镜或重复动作。单片段受模型时长上限约束，整片不受单片段上限约束。";
}
export function buildVideoReplicationSourceEvidence(_0x4ce22c = {}, _0xee041c = {}, _0x371024 = []) {
  const _0x1b4814 = _0x4ce22c["replication"]?.['sourceAnalysis'];
  if (!_0x1b4814) {
    return null;
  }
  const _0x594841 = Number(_0x4ce22c["sourceVideo"]?.["durationSec"]);
  return {
    ...(Number["isFinite"](_0x594841) && _0x594841 > 0x0 ? {
      'sourceDurationSec': _0x594841,
      'timingGuidance': buildVideoReplicationTimingGuidance(_0x4ce22c)
    } : {}),
    'sourceLanguage': _0x1b4814["sourceLanguage"],
    'synopsis': _0x1b4814["synopsis"],
    'characters': _0x1b4814["characters"]["map"](({
      id: _0x37cbba,
      name: _0x2e876b,
      description: _0x171063,
      identityNotes: _0xa1f043,
      role: _0x1fe1cd,
      subjectType: _0x5488e7,
      roleEvidence: _0x20729e
    }) => ({
      'id': _0x37cbba,
      'name': _0x2e876b,
      'description': _0x171063,
      'identityNotes': _0xa1f043,
      'role': _0x1fe1cd,
      'subjectType': _0x5488e7,
      'roleEvidence': _0x20729e
    })),
    'events': _0x1b4814["events"],
    ...(_0xee041c["sourceMode"] === "video-replication" ? {
      'adaptation': {
        'targetLocale': _0x4ce22c["replication"]?.["targetLocale"] || _0xee041c["replication"]?.["targetLocale"] || "source",
        'audioLanguage': buildVideoReplicationAudioLanguageRule(getVideoReplicationAudioLanguage(_0x4ce22c, _0xee041c)),
        'characterBindings': _0x1b4814['characters']["map"](_0x4689df => ({
          'sourceCharacterId': _0x4689df['id'],
          'targetAssetId': _0xee041c["replication"]?.['characterBindings']?.[_0x4ce22c['id'] + ':' + _0x4689df['id']] || ''
        })),
        'replacements': buildVideoReplicationGenerationAssets(_0x371024, _0xee041c)["filter"](_0x4cf6ef => _0x4cf6ef["kind"] === "character")["map"](_0x3d4a65 => ({
          'assetId': _0x3d4a65['id'],
          'assetRef': _0x3d4a65["ref"],
          'kind': _0x3d4a65['kind'],
          'original': _0x3d4a65['replicationSource'] || null,
          'targetName': _0x3d4a65["name"],
          'targetDescription': (_0x3d4a65["appearances"] || [])["some"](_0x1d9c89 => _0x1d9c89["sourceOrigin"] === "library" && _0x1d9c89["imageUrl"]) ? "人物外貌以选定图片为准；targetName 仅用于对应故事角色，不限定性别、年龄和服装。" : _0x3d4a65['description'],
          'appearances': (_0x3d4a65["appearances"] || [])["map"](({
            id: _0x8da7de,
            name: _0x4e8d48,
            description: _0x3f9903,
            prompt: _0x91e226,
            sourceOrigin: _0x30347a,
            sourceAssetId: _0x11f8b8,
            sourceItemIndex: _0x468add,
            imageUrl: _0x1486b0
          }) => _0x30347a === 'library' && _0x1486b0 ? {
            'id': _0x8da7de,
            'name': _0x4e8d48,
            'sourceAssetId': _0x11f8b8,
            'sourceItemIndex': _0x468add,
            'imageUrl': _0x1486b0,
            'description': '外貌以用户选定的参考图为准；这里只用角色名编排动作，不沿用原人物外貌，也不猜测参考图内容。',
            'prompt': ''
          } : {
            'id': _0x8da7de,
            'name': _0x4e8d48,
            'description': _0x3f9903,
            'prompt': _0x91e226
          })
        }))
      }
    } : {}),
    'instructions': "忠实复刻原剧情，只按 characterBindings 替换人物，并处理对白语言。保留原片人物关系、事件顺序、关键动作、场景、道具、冲突和结局，禁止增加、删减或改写剧情。不确定项不得猜测为事实。targetLocale 为 source 时保留原语言和原对白；其他语言逐句翻译，保持原意、信息量、语气、说话顺序和说话人对应。按当前 promptMode 与时长限制分段，允许调整片段边界但不得增删剧情。" + REPLICATION_IMAGE_APPEARANCE_GUIDANCE,
    ...(_0x4ce22c["replication"]["generationPrepared"] ? {
      'instructions': "当前正文已按人物替换关系和对白语言整理。严格使用当前正文的目标角色与对白；原片 events 用于核对动作、镜头、顺序和因果，保留原场景、道具、人物关系和结局，不得把译文或新角色改回原片。按当前 promptMode 与时长限制分段，禁止增加、删减或改写剧情。" + REPLICATION_IMAGE_APPEARANCE_GUIDANCE
    } : {})
  };
}