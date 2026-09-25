export const VIDEO_REPLICATION_PROMPT_MODEL_ID = "apimart/gemini-3.8-flash";
function normalizeText(_0x151cdb, _0x154e2c = '') {
  const _0x3964d2 = String(_0x151cdb ?? '')['trim']();
  return _0x3964d2 || _0x154e2c;
}
function extractJsonObject(_0x4d1393) {
  const _0x89a308 = normalizeText(_0x4d1393?.["text"] ?? _0x4d1393);
  if (!_0x89a308) {
    return null;
  }
  const _0x227143 = _0x89a308["match"](/```(?:json)?\s*([\s\S]*?)```/iu)?.[0x1] || _0x89a308;
  const _0x266b68 = _0x227143['indexOf']('{');
  const _0x1ae1f9 = _0x227143['lastIndexOf']('}');
  if (_0x266b68 < 0x0 || _0x1ae1f9 <= _0x266b68) {
    return null;
  }
  try {
    return JSON['parse'](_0x227143["slice"](_0x266b68, _0x1ae1f9 + 0x1));
  } catch {
    return null;
  }
}
export function createVideoReplicationPromptStructuredOutput() {
  return {
    'name': "video_replication_clip_analysis",
    'strict': !![],
    'fallback': "prompt",
    'schema': {
      'type': "object",
      'additionalProperties': ![],
      'required': ["title", "synopsis", "fullScript", "seedancePrompt", "camera", "sound", "segments"],
      'properties': {
        'title': {
          'type': "string",
          'minLength': 0x1
        },
        'synopsis': {
          'type': "string",
          'minLength': 0x1
        },
        'fullScript': {
          'type': "string",
          'minLength': 0x1
        },
        'seedancePrompt': {
          'type': 'string',
          'minLength': 0x1
        },
        'camera': {
          'type': "string"
        },
        'sound': {
          'type': "string"
        },
        'segments': {
          'type': "array",
          'minItems': 0x1,
          'items': {
            'type': 'object',
            'additionalProperties': ![],
            'required': ["title", 'startSec', "endSec", "script", "prompt", "visual", "camera", "dialogue", "sound"],
            'properties': {
              'title': {
                'type': "string",
                'minLength': 0x1
              },
              'startSec': {
                'type': "number",
                'minimum': 0x0
              },
              'endSec': {
                'type': "number",
                'exclusiveMinimum': 0x0
              },
              'script': {
                'type': "string"
              },
              'prompt': {
                'type': 'string',
                'minLength': 0x1
              },
              'visual': {
                'type': 'string'
              },
              'camera': {
                'type': "string"
              },
              'dialogue': {
                'type': "string"
              },
              'sound': {
                'type': "string"
              }
            }
          }
        }
      }
    }
  };
}
export function buildVideoReplicationPromptAnalysisPrompt({
  durationSec = 0x0,
  targetLocale = "zh-CN",
  targetLocaleLabel = '中国\x20·\x20中文',
  visualStyle = ''
} = {}) {
  const _0x12221b = Math["max"](0x1, Number(durationSec) || 0xf);
  const _0x108287 = normalizeText(visualStyle, '保持原视频的画面媒介与质感');
  return ["你是专业短剧导演、分镜分析师和 Seedance 2.0 提示词工程师。", "依据已确认的原片分析，整理可复刻的剧情节拍、主体关系、动作顺序、场景、景别、运镜、光影、台词和声音。", "不要保留或猜测原人物真实身份、姓名、明星信息或可识别的真实脸部特征；保留角色在故事中的身份、关系、年龄层、性格、服装功能和连续性，人物外观改为目标地区的虚构角色。", '目标地区与语种：' + normalizeText(targetLocaleLabel, targetLocale) + '（' + normalizeText(targetLocale) + "）。所有标题、梗概、完整剧本、台词与提示词必须使用该目标语种；台词保持原意、信息量、说话顺序和戏剧功能，不新增或删改剧情。", "目标创作风格：" + _0x108287 + "。这是复刻故事与视频生成的正式创作约束，不是只加在 seedancePrompt 开头的风格前缀。", '在不改变原视频剧情事实、因果、动作节拍、镜头顺序与台词含义的前提下，把该风格贯穿\x20synopsis、fullScript\x20和\x20segments.script\x20的叙事语气、场景表达、情绪节奏与动作呈现，并贯穿各级视频提示词的主体、环境、光影和镜头描述。若所选风格只描述视觉媒介，则只调整适用的表现方式，不要据此编造新剧情。', "只本地化人物外观、环境文化细节、文字语言和视觉媒介；保留原故事中角色的功能身份、关系、目标、冲突与结局。", "目标生成时长约 " + _0x12221b["toFixed"](0x2) + " 秒，提示词复杂度必须与时长匹配。", _0x12221b > 0x8 ? "seedancePrompt 必须使用清晰的分时段描述，每段时间连续且覆盖完整时长。" : 'seedancePrompt\x20按发生顺序描述动作，不要塞入无法在当前时长完成的额外剧情。', "seedancePrompt 必须包含：主体与场景、动作编排、景别与运镜、情绪、光影风格、台词（如有）、背景音乐与关键音效；通过具体内容体现目标风格，不要仅在开头复述风格名称。", "seedancePrompt 中不要写 @视频、@图片等素材引用；引用语句由系统根据生成路线统一添加。", 'fullScript\x20必须按原视频时间顺序写成可用于后续角色/场景/道具提取的完整分集剧本；保留每句对白的角色归属。角色称呼保留稳定编号，如\x20person-1（目标角色称呼）；听不清处保留[听不清]，说话人未知处保留[说话人待核对]，禁止补写。', 'segments\x20按可独立生成的视频片段划分并覆盖完整时间轴；每段写明\x20startSec/endSec、局部剧本、画面、运镜、对白、声音及可直接生成的\x20prompt。', "准确复刻结构与节奏，但不要逐字照抄画面内受版权保护的长文本。", '只返回指定\x20JSON\x20对象，不要附加解释。']['join']('\x0a');
}
export function parseVideoReplicationPromptAnalysisResult(_0xd06a75, {
  durationSec = 0x0,
  requireScriptJson = ![]
} = {}) {
  const _0x439d34 = extractJsonObject(_0xd06a75);
  if (requireScriptJson) {
    if (!_0x439d34 || typeof _0x439d34 !== "object" || Array["isArray"](_0x439d34)) {
      throw new Error("模型未返回有效的创作剧本 JSON");
    }
    for (const _0x105122 of ["fullScript", "seedancePrompt"]) {
      if (typeof _0x439d34[_0x105122] !== 'string' || !_0x439d34[_0x105122]["trim"]()) {
        throw new Error("模型返回的创作剧本缺少 " + _0x105122);
      }
    }
  }
  const _0x2fe75d = normalizeText(_0xd06a75?.["text"] ?? _0xd06a75);
  const _0xfe55a7 = normalizeText(_0x439d34?.["seedancePrompt"], _0x439d34 ? '' : _0x2fe75d);
  if (!_0xfe55a7) {
    throw new Error("视频理解模型未返回可用的 Seedance 提示词");
  }
  return {
    'title': normalizeText(_0x439d34?.["title"], '未命名片段'),
    'synopsis': normalizeText(_0x439d34?.["synopsis"], _0xfe55a7['slice'](0x0, 0x78)),
    'fullScript': normalizeText(_0x439d34?.["fullScript"], _0x439d34?.["synopsis"] || _0xfe55a7),
    'seedancePrompt': _0xfe55a7,
    'camera': normalizeText(_0x439d34?.["camera"]),
    'sound': normalizeText(_0x439d34?.['sound']),
    'segments': Array['isArray'](_0x439d34?.["segments"]) ? _0x439d34["segments"]["map"](_0x82abf6 => ({
      'title': normalizeText(_0x82abf6?.['title']),
      'startSec': Math["max"](0x0, Number(_0x82abf6?.["startSec"]) || 0x0),
      'endSec': Math["max"](0x0, Number(_0x82abf6?.["endSec"]) || 0x0),
      'script': normalizeText(_0x82abf6?.['script']),
      'prompt': normalizeText(_0x82abf6?.["prompt"]),
      'visual': normalizeText(_0x82abf6?.["visual"]),
      'camera': normalizeText(_0x82abf6?.["camera"]),
      'dialogue': normalizeText(_0x82abf6?.["dialogue"]),
      'sound': normalizeText(_0x82abf6?.["sound"])
    }))['filter'](_0x4373a9 => _0x4373a9["prompt"] || _0x4373a9["script"]) : [],
    'durationSec': Math["max"](0x0, Number(durationSec) || 0x0)
  };
}