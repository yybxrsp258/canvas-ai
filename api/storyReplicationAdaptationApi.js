import { generateText } from './aiTextApi.js';
import { buildTextStructuredOutputSystemPrompt } from './adapters/textStructuredOutput.js';
import { invokeStoryGenerationRequest } from './story-generation/storyInvocationEvidence.js';
import { buildVideoReplicationSourceEvidence } from '../src/domain/storyGeneration/videoReplicationSourceAnalysis.js';
import { parseStrictJson } from './utils/strictJson.js';
export function buildStoryReplicationAdaptationInput({
  project: _0x50e401,
  episode: _0x2cce6b,
  assets: _0x777364
}) {
  return {
    'source': buildVideoReplicationSourceEvidence(_0x2cce6b, _0x50e401, _0x777364)
  };
}
export async function prepareStoryReplicationGenerationScript({
  input: _0x2f6328,
  model: _0x4b0a7e,
  provider: _0x147c43,
  providerProfileId: _0x3f89fb,
  onInvocation: _0x52f3ad,
  request = generateText
} = {}) {
  const _0x1c07d2 = {
    'name': "story_replication_adapted_script",
    'strict': !![],
    'fallback': 'prompt',
    'schema': {
      'type': "object",
      'additionalProperties': ![],
      'required': ['title', 'fullScript'],
      'properties': {
        'title': {
          'type': "string"
        },
        'fullScript': {
          'type': 'string',
          'minLength': 0x1
        }
      }
    }
  };
  const _0x166c1a = await invokeStoryGenerationRequest({
    'request': request,
    'onInvocation': _0x52f3ad,
    'stepId': "replication-adaptation",
    'attempt': 0x1,
    'requestPayload': {
      'model': _0x4b0a7e,
      'provider': _0x147c43,
      ...(_0x3f89fb ? {
        'providerProfileId': _0x3f89fb
      } : {}),
      'mediaPolicy': "text-only",
      'structuredOutput': _0x1c07d2,
      'systemPrompt': buildTextStructuredOutputSystemPrompt("忠实复刻原剧情，只执行用户确认的人物对应替换和对白语言选择。targetLocale 为 source 时保持原语言、原对白；其他语言逐句翻译，保持原意、信息量、语气、说话顺序和说话人对应。角色称呼使用绑定的目标人物名称，这些名称仅用于角色对应，不作为参考图的性别、年龄或外貌设定；已选替换图的角色，动作和镜头描述不得沿用原演员外貌、发型和服装，不根据图片猜测新的人物关系。对白中的亲属称呼和身份表述仍保留原话。替换物种时只调整完成同一动作所需的身体表现，不改变动作目的或结果。保留原片人物关系、事件顺序、关键动作、场景、道具、冲突和结局，禁止新增、删减或改写剧情。原镜头时间用于核对，不输出时间标签或视频提示词。说话人未知和听不清的内容保留疑点。场景标题使用原片场景，正文写明实际出场的目标人物。只返回完整剧本 JSON。", _0x1c07d2, {
        'mode': "prompt"
      }) + (_0x2f6328?.["source"]?.['timingGuidance'] ? '\x0a' + _0x2f6328["source"]["timingGuidance"] : '') + (_0x2f6328?.['source']?.["adaptation"]?.['audioLanguage'] ? '\x0a' + _0x2f6328["source"]["adaptation"]["audioLanguage"] : ''),
      'prompt': JSON["stringify"](_0x2f6328),
      'thinking': {
        'type': "disabled"
      },
      'temperature': 0.2,
      'maxOutputTokens': 0x4000,
      'timeoutMs': 0x5 * 0x3c * 0x3e8
    }
  });
  const _0x4f9609 = parseStrictJson(_0x166c1a?.["text"] ?? _0x166c1a);
  if (typeof _0x4f9609?.["fullScript"] !== "string" || !_0x4f9609['fullScript']["trim"]()) {
    throw new Error('复刻剧本未返回完整正文；原片分析与替换设置已保留。');
  }
  return {
    'title': String(_0x4f9609["title"] || '')['trim'](),
    'fullScript': _0x4f9609['fullScript']['trim']()
  };
}