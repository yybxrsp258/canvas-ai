import { generateText } from './aiTextApi.js';
import { buildTextStructuredOutputSystemPrompt } from './adapters/textStructuredOutput.js';
import { buildVideoReplicationSourcePrompt, createVideoReplicationSourceOutput, parseVideoReplicationSourceResult } from '../src/domain/storyGeneration/videoReplicationSourceAnalysis.js';
import { VIDEO_REPLICATION_PROMPT_MODEL_ID } from '../src/domain/storyGeneration/videoReplicationPromptAnalysis.js';
import { assertVideoAnalysisModel } from '../src/manifests/textVideoUnderstanding.js';
export async function analyzeVideoReplicationClip({
  videoRef = '',
  durationSec = 0x0,
  modelId = VIDEO_REPLICATION_PROMPT_MODEL_ID,
  provider = '',
  providerProfileId = '',
  sourceAnalysis = null,
  onSourceAnalysis: _0x57855f,
  onProgress: _0x14f180,
  isActive = () => !![],
  request = generateText
} = {}) {
  if (!String(videoRef || '')['trim']()) {
    throw new Error("待分析片段缺少视频地址");
  }
  if (!isActive()) {
    throw new Error("视频分析所属项目已失效。");
  }
  if (!sourceAnalysis) {
    assertVideoAnalysisModel(modelId);
    _0x14f180?.("正在分析原片故事、人物、镜头和对白");
    const _0x31e6ad = createVideoReplicationSourceOutput();
    const _0x3856cb = await request({
      'model': modelId,
      'provider': provider,
      ...(providerProfileId ? {
        'providerProfileId': providerProfileId
      } : {}),
      'prompt': buildVideoReplicationSourcePrompt({
        'durationSec': durationSec
      }),
      'systemPrompt': buildTextStructuredOutputSystemPrompt("Observe the source video faithfully. Do not translate, adapt, or generate video prompts.", _0x31e6ad, {
        'mode': "prompt"
      }),
      'inputVideoUrls': [String(videoRef)["trim"]()],
      'mediaPolicy': "image-video",
      'allowVideo': !![],
      'structuredOutput': _0x31e6ad,
      'thinking': {
        'type': "disabled"
      },
      'temperature': 0.2,
      'maxOutputTokens': 0x4000,
      'timeoutMs': 0x5 * 0x3c * 0x3e8
    });
    if (!isActive()) {
      throw new Error('视频分析所属项目已失效。');
    }
    sourceAnalysis = parseVideoReplicationSourceResult(_0x3856cb, {
      'durationSec': durationSec
    });
    await _0x57855f?.(sourceAnalysis);
  }
  if (!isActive()) {
    throw new Error("视频分析所属项目已失效。");
  }
  return {
    'sourceAnalysis': sourceAnalysis
  };
}