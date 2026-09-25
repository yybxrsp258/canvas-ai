import { getRunningHubModelApiProfileIds } from '../../../modules/runningHubProviderProfiles.js';
import { AGNES_MODEL_API_PROFILE_IDS } from '../../../modules/agnesProviderProfiles.js';
import { apimartQwenTextModelManifests, apimartQwenTextExecutionManifests } from './apimartQwenTextManifests.js';
import { apimartAdditionalTextModels } from './apimartTextModelCatalog.js';
import { bailianTextModelManifests, bailianTextExecutionManifests } from './bailianTextModelApiManifests.js';
import { bailianPartnerTextModelManifests, bailianPartnerTextExecutionManifests } from './bailianPartnerTextModelApiManifests.js';
import { deepseekTextModelManifests, deepseekTextExecutionManifests } from './deepseekTextModelApiManifests.js';
function createTextModelApiManifest({
  modelId: _0x2bc7fb,
  executionId: _0x119d30,
  displayName: _0x494344,
  aliases = null,
  provider = 'runninghub',
  icon = "images/RH.png",
  description = "RunningHub image-to-text model API",
  inputSlots = null,
  extensions = null
}) {
  const _0x5c2f36 = {
    'schemaVersion': "1.0",
    'modelId': _0x2bc7fb,
    ...(Array["isArray"](aliases) ? {
      'aliases': aliases
    } : {}),
    'provider': provider,
    'kind': "text",
    'adapterType': "modelApi",
    'executionId': _0x119d30,
    'displayName': _0x494344,
    'icon': icon,
    'description': description,
    'inputSlots': Object["freeze"](inputSlots || {
      'allowedKinds': Object["freeze"](['image', "text"]),
      'minByKind': Object['freeze']({
        'image': 0x1
      }),
      'maxByKind': Object["freeze"]({
        'image': 0x8,
        'video': 0x0,
        'audio': 0x0
      })
    }),
    'uiSchema': Object["freeze"]({
      'fields': Object["freeze"]([])
    }),
    'async': !![],
    'cancellable': ![],
    'outputType': "text"
  };
  extensions && typeof extensions === 'object' && (_0x5c2f36['extensions'] = Object["freeze"](extensions));
  return Object["freeze"](_0x5c2f36);
}
function createRunningHubTextModelApiManifest(_0x336ee1) {
  return Object["freeze"]({
    'schemaVersion': "1.0",
    'modelId': _0x336ee1["modelId"],
    'provider': 'runninghub',
    'kind': 'text',
    'adapterType': "modelApi",
    'executionId': _0x336ee1["executionId"],
    'displayName': _0x336ee1["displayName"],
    'icon': 'images/RH.png',
    'description': "RunningHub image-to-text model API",
    'inputSlots': Object["freeze"]({
      'allowedKinds': Object["freeze"](["image", "text"]),
      'minByKind': Object["freeze"]({
        'image': 0x1
      }),
      'maxByKind': Object["freeze"]({
        'image': 0x8,
        'video': 0x0,
        'audio': 0x0
      })
    }),
    'uiSchema': Object["freeze"]({
      'fields': Object["freeze"]([])
    }),
    ...(_0x336ee1["extensions"] && typeof _0x336ee1['extensions'] === "object" ? {
      'extensions': Object["freeze"](_0x336ee1['extensions'])
    } : {}),
    'async': !![],
    'cancellable': ![],
    'outputType': 'text'
  });
}
function createTextExecutionManifest({
  id: _0x35489f,
  model: _0x352d98,
  provider = "runninghub",
  endpoint = "/openapi/v2",
  endpointMode = "image-to-text",
  bodyMapping = null,
  responseMapping = null,
  result = null,
  extensions = null
}) {
  return Object["freeze"]({
    'schemaVersion': "1.0",
    'id': _0x35489f,
    'provider': provider,
    'kind': "text",
    'adapterType': "modelApi",
    'endpoint': endpoint,
    'endpointMode': endpointMode,
    'method': "POST",
    'model': _0x352d98,
    ...(extensions && typeof extensions === 'object' ? {
      'extensions': Object["freeze"](extensions)
    } : {}),
    'headers': Object["freeze"]({
      'Content-Type': 'application/json'
    }),
    'bodyMapping': Object["freeze"](bodyMapping || {
      'promptField': "prompt",
      'inputImageField': "imageUrl"
    }),
    'responseMapping': Object["freeze"](responseMapping || {
      'taskIdPath': "taskId",
      'resultPaths': Object['freeze'](["results[].text", "text", "output"])
    }),
    'result': Object["freeze"](result || {
      'taskIdPath': 'taskId',
      'textFields': Object["freeze"](["text", 'output', "content"])
    })
  });
}
const RUNNINGHUB_IMAGE_TO_TEXT_MODELS = Object["freeze"]([Object["freeze"]({
  'modelId': 'runninghub-model/rhart-text-g-3-flash-preview-cv/image-to-text',
  'executionId': "runninghub.model-api.rhart-text-g-3-flash-cv.v1",
  'displayName': "RunningHub G-3 Flash CV",
  'model': "rhart-text-g-3-flash-preview-cv/image-to-text"
}), Object["freeze"]({
  'modelId': "runninghub-model/rhart-text-g-3-pro-preview-cv/image-to-text",
  'executionId': 'runninghub.model-api.rhart-text-g-3-pro-cv.v1',
  'displayName': 'RunningHub\x20G-3\x20Pro\x20CV',
  'model': 'rhart-text-g-3-pro-preview-cv/image-to-text'
})]);
const CHAT_COMPLETION_TEXT_INPUT_SLOTS = Object['freeze']({
  'allowedKinds': Object["freeze"](["text", "image"]),
  'minByKind': Object['freeze']({
    'text': 0x0,
    'image': 0x0
  }),
  'maxByKind': Object["freeze"]({
    'image': 0x8,
    'video': 0x0,
    'audio': 0x0
  })
});
const CHAT_COMPLETION_TEXT_IMAGE_VIDEO_INPUT_SLOTS = Object["freeze"]({
  'allowedKinds': Object["freeze"](["text", "image", 'video']),
  'minByKind': Object["freeze"]({
    'text': 0x0,
    'image': 0x0,
    'video': 0x0
  }),
  'maxByKind': Object["freeze"]({
    'image': 0x8,
    'video': 0x3,
    'audio': 0x0
  })
});
const CHAT_COMPLETION_TEXT_IMAGE_SINGLE_VIDEO_INPUT_SLOTS = Object["freeze"]({
  'allowedKinds': Object['freeze'](['text', "image", "video"]),
  'minByKind': Object["freeze"]({
    'text': 0x0,
    'image': 0x0,
    'video': 0x0
  }),
  'maxByKind': Object["freeze"]({
    'image': 0x8,
    'video': 0x1,
    'audio': 0x0
  })
});
const CHAT_COMPLETION_TEXT_IMAGE_VIDEO_AUDIO_INPUT_SLOTS = Object['freeze']({
  'allowedKinds': Object["freeze"](['text', "image", "video", 'audio']),
  'minByKind': Object["freeze"]({
    'text': 0x0,
    'image': 0x0,
    'video': 0x0,
    'audio': 0x0
  }),
  'maxByKind': Object["freeze"]({
    'image': 0x8,
    'video': 0x3,
    'audio': 0x3
  })
});
const CHAT_COMPLETION_TEXT_ONLY_INPUT_SLOTS = Object["freeze"]({
  'allowedKinds': Object["freeze"](["text"]),
  'minByKind': Object["freeze"]({
    'text': 0x0
  }),
  'maxByKind': Object["freeze"]({
    'image': 0x0,
    'video': 0x0,
    'audio': 0x0
  })
});
function resolveRunningHubTextMenuTitle(_0x74326) {
  const _0x277019 = String(_0x74326 || '')["trim"]();
  return _0x277019["split"]('/')["filter"](Boolean)['at'](-0x1) || _0x277019;
}
const RUNNINGHUB_LLM_TEXT_MODELS = Object["freeze"]([Object["freeze"]({
  'modelId': "qwen/qwen3.6-plus",
  'executionId': "runninghub.model-api.text.qwen3-6-plus.v1",
  'displayName': "Qwen3.6 Plus",
  'model': "qwen/qwen3.6-plus",
  'title': "qwen3.6-plus",
  'subtitle': '阿里旗舰模型，支持长上下文与文本推理',
  'icon': "qwen",
  'inputSlots': CHAT_COMPLETION_TEXT_INPUT_SLOTS,
  'order': 0x1e
}), Object["freeze"]({
  'modelId': "qwen/qwen3-vl-235b-a22b-instruct",
  'executionId': "runninghub.model-api.text.qwen3-vl-235b-a22b-instruct.v1",
  'displayName': "Qwen3-VL 235B A22B Instruct",
  'model': 'qwen/qwen3-vl-235b-a22b-instruct',
  'title': "qwen3-vl-235b-a22b-instruct",
  'subtitle': "视觉语言模型，适合图片识别与图文理解",
  'icon': 'qwen',
  'inputSlots': CHAT_COMPLETION_TEXT_INPUT_SLOTS,
  'order': 0x28
}), Object["freeze"]({
  'modelId': "deepseek/deepseek-v4-flash",
  'executionId': 'runninghub.model-api.text.deepseek-v4-flash.v1',
  'displayName': "DeepSeek V4 Flash",
  'model': "deepseek/deepseek-v4-flash",
  'title': 'deepseek-v4-flash',
  'subtitle': "DeepSeek V4 快速版，适合高频文本任务",
  'icon': "deepseek",
  'order': 0x32,
  'structuredOutputMode': "json_object"
}), Object["freeze"]({
  'modelId': "deepseek/deepseek-v4-pro",
  'executionId': 'runninghub.model-api.text.deepseek-v4-pro.v1',
  'displayName': "DeepSeek V4 Pro",
  'model': "deepseek/deepseek-v4-pro",
  'title': "deepseek-v4-pro",
  'subtitle': 'DeepSeek\x20V4\x20专业版，适合复杂推理与代码任务',
  'icon': 'deepseek',
  'order': 0x3c,
  'structuredOutputMode': "json_object"
}), Object['freeze']({
  'modelId': "bytedance/doubao-seed-2.0-lite",
  'executionId': "runninghub.model-api.text.doubao-seed-2-lite.v1",
  'displayName': 'Doubao\x20Seed\x202.0\x20Lite',
  'model': "bytedance/doubao-seed-2.0-lite",
  'title': "doubao-seed-2.0-lite",
  'subtitle': "豆包 Seed 2.0 轻量版，适合低成本文本任务",
  'icon': 'runninghub',
  'inputSlots': CHAT_COMPLETION_TEXT_INPUT_SLOTS,
  'order': 0x46
}), Object["freeze"]({
  'modelId': "bytedance/doubao-seed-2.0-pro",
  'executionId': "runninghub.model-api.text.doubao-seed-2-pro.v1",
  'displayName': "Doubao Seed 2.0 Pro",
  'model': 'bytedance/doubao-seed-2.0-pro',
  'title': "doubao-seed-2.0-pro",
  'subtitle': "豆包 Seed 2.0 旗舰版，适合复杂推理和文本生成",
  'icon': "runninghub",
  'inputSlots': CHAT_COMPLETION_TEXT_INPUT_SLOTS,
  'order': 0x50
}), Object['freeze']({
  'modelId': 'glm-5.2',
  'executionId': "runninghub.model-api.text.glm-5-2.v1",
  'displayName': 'GLM-5.2',
  'model': "glm-5.2",
  'title': "glm-5.2",
  'subtitle': "RunningHub GLM 文本生成模型",
  'icon': "runninghub",
  'order': 0x5a
}), Object["freeze"]({
  'modelId': 'qwen/qwen3.7-max',
  'executionId': "runninghub.model-api.text.qwen3-7-max.v1",
  'displayName': "Qwen3.7 Max",
  'model': "qwen/qwen3.7-max",
  'title': 'qwen/qwen3.7-max',
  'subtitle': "RunningHub Qwen3.7 Max 文本生成模型",
  'icon': "qwen",
  'order': 0x64
}), Object["freeze"]({
  'modelId': "qwen/qwen3.7-plus",
  'executionId': "runninghub.model-api.text.qwen3-7-plus.v1",
  'displayName': "Qwen3.7 Plus",
  'model': "qwen/qwen3.7-plus",
  'title': "qwen/qwen3.7-plus",
  'subtitle': "RunningHub Qwen3.7 Plus 文本生成模型",
  'icon': "qwen",
  'inputSlots': CHAT_COMPLETION_TEXT_INPUT_SLOTS,
  'order': 0x6e
}), Object["freeze"]({
  'modelId': 'bytedance/doubao-seed-2.1-pro',
  'executionId': "runninghub.model-api.text.doubao-seed-2-1-pro.v1",
  'displayName': "Doubao Seed 2.1 Pro",
  'model': "bytedance/doubao-seed-2.1-pro",
  'title': "bytedance/doubao-seed-2.1-pro",
  'subtitle': "RunningHub Doubao Seed 2.1 Pro 文本生成模型",
  'icon': 'runninghub',
  'inputSlots': CHAT_COMPLETION_TEXT_INPUT_SLOTS,
  'order': 0x78
}), Object['freeze']({
  'modelId': "bytedance/doubao-seed-2.1-turbo",
  'executionId': "runninghub.model-api.text.doubao-seed-2-1-turbo.v1",
  'displayName': "Doubao Seed 2.1 Turbo",
  'model': "bytedance/doubao-seed-2.1-turbo",
  'title': "bytedance/doubao-seed-2.1-turbo",
  'subtitle': 'RunningHub\x20Doubao\x20Seed\x202.1\x20Turbo\x20文本生成模型',
  'icon': 'runninghub',
  'inputSlots': CHAT_COMPLETION_TEXT_INPUT_SLOTS,
  'order': 0x82
}), Object['freeze']({
  'modelId': "google/gemini-3.1-flash-lite-preview",
  'executionId': 'runninghub.model-api.text.gemini-3-1-flash-lite-preview.v1',
  'displayName': "Gemini 3.1 Flash Lite Preview",
  'model': "google/gemini-3.1-flash-lite-preview",
  'subtitle': "RunningHub Gemini 3.1 Flash Lite Preview 文本生成模型",
  'icon': "gemini",
  'inputSlots': CHAT_COMPLETION_TEXT_IMAGE_SINGLE_VIDEO_INPUT_SLOTS,
  'videoInput': !![],
  'order': 0x8c
}), Object["freeze"]({
  'modelId': "google/gemini-3.5-flash",
  'executionId': "runninghub.model-api.text.gemini-3-5-flash.v1",
  'displayName': 'Gemini\x203.5\x20Flash',
  'model': "google/gemini-3.5-flash",
  'subtitle': 'RunningHub\x20Gemini\x203.5\x20Flash\x20文本生成模型',
  'icon': "gemini",
  'inputSlots': CHAT_COMPLETION_TEXT_IMAGE_SINGLE_VIDEO_INPUT_SLOTS,
  'videoInput': !![],
  'order': 0x96
}), Object['freeze']({
  'modelId': "openai/gpt-5.6-sol",
  'executionId': "runninghub.model-api.text.gpt-5-6-sol.v1",
  'displayName': "GPT-5.6 Sol",
  'model': "openai/gpt-5.6-sol",
  'subtitle': "RunningHub GPT-5.6 Sol 文本生成模型",
  'icon': 'oa',
  'order': 0xa0
}), Object["freeze"]({
  'modelId': "openai/gpt-5.6-terra",
  'executionId': "runninghub.model-api.text.gpt-5-6-terra.v1",
  'displayName': "GPT-5.6 Terra",
  'model': "openai/gpt-5.6-terra",
  'subtitle': 'RunningHub\x20GPT-5.6\x20Terra\x20文本生成模型',
  'icon': 'oa',
  'order': 0xaa
}), Object["freeze"]({
  'modelId': "openai/gpt-5.5",
  'executionId': "runninghub.model-api.text.gpt-5-5.v1",
  'displayName': 'GPT-5.5',
  'model': "openai/gpt-5.5",
  'subtitle': "RunningHub GPT-5.5 文本生成模型",
  'icon': 'oa',
  'order': 0xb4
}), Object["freeze"]({
  'modelId': "openai/gpt-5.5-pro",
  'executionId': "runninghub.model-api.text.gpt-5-5-pro.v1",
  'displayName': "GPT-5.5 Pro",
  'model': "openai/gpt-5.5-pro",
  'subtitle': "RunningHub GPT-5.5 Pro 文本生成模型",
  'icon': 'oa',
  'order': 0xbe
}), Object["freeze"]({
  'modelId': "anthropic/claude-fable-5",
  'executionId': "runninghub.model-api.text.claude-fable-5.v1",
  'displayName': 'Claude\x20Fable\x205',
  'model': "anthropic/claude-fable-5",
  'subtitle': "RunningHub Claude Fable 5 文本生成模型",
  'icon': "runninghub",
  'order': 0xc8
}), Object["freeze"]({
  'modelId': "anthropic/claude-opus-4.8",
  'executionId': 'runninghub.model-api.text.claude-opus-4-8.v1',
  'displayName': "Claude Opus 4.8",
  'model': 'anthropic/claude-opus-4.8',
  'subtitle': "RunningHub Claude Opus 4.8 文本生成模型",
  'icon': "runninghub",
  'order': 0xdc
}), Object['freeze']({
  'modelId': "anthropic/claude-opus-4.7",
  'executionId': 'runninghub.model-api.text.claude-opus-4-7.v1',
  'displayName': "Claude Opus 4.7",
  'model': "anthropic/claude-opus-4.7",
  'subtitle': "RunningHub Claude Opus 4.7 文本生成模型",
  'icon': "runninghub",
  'order': 0xe6
})]);
const VOLCENGINE_TEXT_MODELS = Object["freeze"]([Object['freeze']({
  'modelId': "volcengine/doubao-seed-2-1-pro-260915",
  'executionId': 'volcengine.model-api.text.doubao-seed-2-1-pro-260915.v1',
  'displayName': "Doubao Seed 2.1 Pro",
  'model': "doubao-seed-2-1-pro-260915",
  'title': "Doubao Seed 2.1 Pro",
  'subtitle': '火山方舟\x20Doubao\x20Seed\x202.1\x20Pro，面向复杂文本生成、深度推理与多模态理解',
  'icon': "volcengine",
  'order': 0xa
}), Object['freeze']({
  'modelId': 'volcengine/doubao-seed-2-1-turbo-260628',
  'executionId': "volcengine.model-api.text.doubao-seed-2-1-turbo-260628.v1",
  'displayName': "Doubao Seed 2.1 Turbo",
  'model': "doubao-seed-2-1-turbo-260628",
  'title': "Doubao Seed 2.1 Turbo",
  'subtitle': "火山方舟 Doubao Seed 2.1 Turbo，平衡效果、成本与响应速度",
  'icon': "volcengine",
  'order': 0x14
}), Object["freeze"]({
  'modelId': 'volcengine/doubao-seed-evolving',
  'executionId': "volcengine.model-api.text.doubao-seed-evolving.v1",
  'displayName': 'Doubao\x20Seed\x20Evolving',
  'model': "doubao-seed-evolving",
  'title': "Doubao Seed Evolving",
  'subtitle': "火山方舟 Doubao Seed Evolving，Seed 系列持续进化模型",
  'icon': "volcengine",
  'order': 0x1e
}), Object["freeze"]({
  'modelId': "volcengine/glm-5-3-flash-260828",
  'executionId': "volcengine.model-api.text.glm-5-3-flash-260828.v1",
  'displayName': 'GLM\x205.3\x20Flash',
  'model': "glm-5-3-flash-260828",
  'title': 'GLM\x205.3\x20Flash',
  'subtitle': '火山方舟\x20GLM\x205.3\x20Flash，支持深度思考、文本生成与图片理解',
  'icon': "volcengine",
  'inputSlots': CHAT_COMPLETION_TEXT_INPUT_SLOTS,
  'mediaPolicy': "image-only",
  'order': 0x28
}), Object['freeze']({
  'modelId': "volcengine/deepseek-v4-1-flash-260910",
  'executionId': "volcengine.model-api.text.deepseek-v4-1-flash-260910.v1",
  'displayName': "DeepSeek V4.1 Flash",
  'model': 'deepseek-v4-1-flash-260910',
  'title': "DeepSeek V4.1 Flash",
  'subtitle': "火山方舟 DeepSeek V4.1 Flash，支持深度思考、图片理解与工具调用",
  'icon': "volcengine",
  'inputSlots': CHAT_COMPLETION_TEXT_INPUT_SLOTS,
  'mediaPolicy': 'image-only',
  'structuredOutputMode': "json_object",
  'order': 0x32
}), Object["freeze"]({
  'modelId': "volcengine/doubao-seed-2-0-pro-260215",
  'executionId': "volcengine.model-api.text.doubao-seed-2-0-pro-260215.v1",
  'displayName': "Doubao Seed 2.0 Pro",
  'model': 'doubao-seed-2-0-pro-260215',
  'title': "Doubao Seed 2.0 Pro",
  'subtitle': '火山方舟\x20Doubao\x20Seed\x202.0\x20Pro，适合复杂文本生成与推理',
  'icon': "volcengine",
  'order': 0x3c
}), Object["freeze"]({
  'modelId': "volcengine/doubao-seed-2-0-mini-260428",
  'executionId': "volcengine.model-api.text.doubao-seed-2-0-mini-260428.v1",
  'displayName': "Doubao Seed 2.0 Mini",
  'model': 'doubao-seed-2-0-mini-260428',
  'title': 'Doubao\x20Seed\x202.0\x20Mini',
  'subtitle': "火山方舟 Doubao Seed 2.0 Mini，平衡效果与响应速度",
  'icon': "volcengine",
  'inputSlots': CHAT_COMPLETION_TEXT_IMAGE_VIDEO_AUDIO_INPUT_SLOTS,
  'order': 0x46
}), Object['freeze']({
  'modelId': "volcengine/doubao-seed-2-0-lite-260428",
  'executionId': 'volcengine.model-api.text.doubao-seed-2-0-lite-260428.v1',
  'displayName': 'Doubao\x20Seed\x202.0\x20Lite',
  'model': "doubao-seed-2-0-lite-260428",
  'title': "Doubao Seed 2.0 Lite",
  'subtitle': '火山方舟\x20Doubao\x20Seed\x202.0\x20Lite，适合高频文本任务',
  'icon': "volcengine",
  'inputSlots': CHAT_COMPLETION_TEXT_IMAGE_VIDEO_AUDIO_INPUT_SLOTS,
  'order': 0x50
})]);
const AGNES_TEXT_MODELS = Object["freeze"]([Object['freeze']({
  'modelId': "agnes/agnes-3.0-flash",
  'executionId': "agnes.model-api.text.agnes-3-0-flash.v1",
  'displayName': "Agnes 3.0 Flash",
  'model': "agnes-3.0-flash",
  'title': "Agnes 3.0 Flash",
  'subtitle': "Agnes 新一代文本模型，支持文本生成与图像理解",
  'icon': "agnes",
  'order': 0x0
}), Object['freeze']({
  'modelId': 'agnes/agnes-2.5-flash',
  'executionId': 'agnes.model-api.text.agnes-2-5-flash.v1',
  'displayName': 'Agnes\x202.5\x20Flash',
  'model': "agnes-2.5-flash",
  'title': "Agnes 2.5 Flash",
  'subtitle': 'Agnes\x20AI\x20text\x20generation\x20model',
  'icon': "agnes",
  'order': 0xa
}), Object['freeze']({
  'modelId': 'agnes/agnes-2.5-pro',
  'executionId': "agnes.model-api.text.agnes-2-5-pro.v1",
  'displayName': 'Agnes\x202.5\x20Pro',
  'model': 'agnes-2.5-pro',
  'title': "Agnes 2.5 Pro",
  'subtitle': "Agnes AI production reasoning model",
  'icon': 'agnes',
  'order': 0x14
}), Object["freeze"]({
  'modelId': "agnes/agnes-2.5-pro-beta",
  'executionId': "agnes.model-api.text.agnes-2-5-pro-beta.v1",
  'displayName': "Agnes 2.5 Pro Beta",
  'model': "agnes-2.5-pro-beta",
  'title': 'Agnes\x202.5\x20Pro\x20Beta',
  'subtitle': "Agnes AI advanced reasoning and multimodal model",
  'icon': "agnes",
  'order': 0x1e
})]);
const CHAT_COMPLETION_TEXT_RESPONSE_MAPPING = Object["freeze"]({
  'resultPaths': Object["freeze"](['choices[].message.content', 'choices[].delta.content', "choices[].message.reasoning_content", 'choices[].delta.reasoning_content', "data.choices[].message.content", "data.choices[].delta.content", "data.choices[].message.reasoning_content", "data.choices[].delta.reasoning_content", "text", "output"])
});
const VOLCENGINE_RESPONSES_TEXT_RESPONSE_MAPPING = Object["freeze"]({
  'resultPaths': Object['freeze'](["output_text", 'data.output_text', "output[].content[].text", "output[].content[].content", "data.output[].content[].text", "data.output[].content[].content", "text", "output"])
});
const APIMART_TEXT_RESULT = Object['freeze']({
  'textFields': Object["freeze"](["choices[].message.content", "choices[].message.reasoning_content", "text", "output"])
});
const APIMART_TEXT_EXECUTION_EXTENSIONS = Object["freeze"]({
  'chatCompletionInputPolicy': "image-only"
});
const VOLCENGINE_TEXT_EXECUTION_EXTENSIONS = Object["freeze"]({
  'chatCompletionInputPolicy': 'image-video',
  'thinkingControlMode': "thinking",
  'volcengineFiles': Object["freeze"]({
    'videoFps': 0.3
  })
});
const VOLCENGINE_TEXT_IMAGE_INPUT_EXECUTION_EXTENSIONS = Object['freeze']({
  'chatCompletionInputPolicy': "image-only",
  'thinkingControlMode': "thinking"
});
const VOLCENGINE_TEXT_AUDIO_INPUT_EXECUTION_EXTENSIONS = Object["freeze"]({
  'chatCompletionInputPolicy': "image-video-audio",
  'thinkingControlMode': "thinking",
  'volcengineFiles': Object["freeze"]({
    'videoFps': 0.3
  })
});
function buildVolcengineTextExecutionExtensions(_0x494844) {
  const _0x3e80b8 = _0x494844["mediaPolicy"] === "image-only" ? VOLCENGINE_TEXT_IMAGE_INPUT_EXECUTION_EXTENSIONS : _0x494844["inputSlots"] ? VOLCENGINE_TEXT_AUDIO_INPUT_EXECUTION_EXTENSIONS : VOLCENGINE_TEXT_EXECUTION_EXTENSIONS;
  return Object['freeze']({
    ..._0x3e80b8,
    ...(_0x494844["structuredOutputMode"] ? {
      'structuredOutputMode': _0x494844["structuredOutputMode"]
    } : {})
  });
}
const AGNES_TEXT_EXECUTION_EXTENSIONS = Object["freeze"]({
  'chatCompletionInputPolicy': "image-only"
});
const RUNNINGHUB_LLM_TEXT_EXECUTION_EXTENSIONS = Object['freeze']({
  'endpointResolver': "runninghubLlmChatEndpoint",
  'chatCompletionInputPolicy': "image-only",
  'reasoningEffortMode': "openai"
});
const APIMART_GEMINI_NATIVE_VIDEO_EXTENSION = Object["freeze"]({
  'endpointTemplate': '/v1beta/models/{model}:generateContent',
  'imageUploadProvider': "apimart",
  'videoInputEncoding': "base64",
  'mediaPolicy': "image-video"
});
const APIMART_GEMINI_DISABLE_THINKING_CONTROL = Object["freeze"]({
  'disabledBudget': 0x0,
  'includeThoughts': ![]
});
const APIMART_GEMINI_REQUIRED_THINKING_CONTROL = Object["freeze"]({
  'disabledUnsupported': !![]
});
function buildApimartTextExecutionExtensions(_0x36b23b) {
  return Object["freeze"]({
    ...APIMART_TEXT_EXECUTION_EXTENSIONS,
    'strictUpload': !![],
    ...(_0x36b23b['mediaPolicy'] ? {
      'chatCompletionInputPolicy': _0x36b23b["mediaPolicy"]
    } : {}),
    ...(_0x36b23b["mediaInputEncoding"] ? {
      'mediaInputEncoding': _0x36b23b["mediaInputEncoding"]
    } : {}),
    ...(_0x36b23b["reasoningEffortMode"] ? {
      'reasoningEffortMode': _0x36b23b["reasoningEffortMode"]
    } : {}),
    ...(_0x36b23b["thinkingControlMode"] ? {
      'thinkingControlMode': _0x36b23b["thinkingControlMode"]
    } : {}),
    ...(_0x36b23b['structuredOutputMode'] ? {
      'structuredOutputMode': _0x36b23b["structuredOutputMode"]
    } : {}),
    ...(_0x36b23b["videoInput"] ? {
      'geminiNativeVideo': Object["freeze"]({
        ...APIMART_GEMINI_NATIVE_VIDEO_EXTENSION,
        'thinkingControl': _0x36b23b["geminiNativeThinkingControl"] || APIMART_GEMINI_DISABLE_THINKING_CONTROL
      })
    } : {})
  });
}
const GRSAI_TEXT_MODELS = Object["freeze"]([Object["freeze"]({
  'modelId': 'gpt-6-astra',
  'executionId': 'grsai.model-api.text.gpt-6-astra.v1',
  'displayName': "gpt-6-astra",
  'model': "gpt-6-astra",
  'subtitle': "GRSAI chat completion model API",
  'icon': "grsai",
  'order': 0x5
}), Object["freeze"]({
  'modelId': "gpt-5.6-sol",
  'executionId': 'grsai.model-api.text.gpt-5-6-sol.v1',
  'displayName': "gpt-5.6-sol",
  'model': 'gpt-5.6-sol',
  'subtitle': 'GRSAI\x20chat\x20completion\x20model\x20API',
  'icon': "grsai",
  'order': 0xa
}), Object['freeze']({
  'modelId': 'gpt-5.6-terra',
  'executionId': "grsai.model-api.text.gpt-5-6-terra.v1",
  'displayName': "gpt-5.6-terra",
  'model': 'gpt-5.6-terra',
  'subtitle': "GRSAI chat completion model API",
  'icon': 'grsai',
  'order': 0x1e
}), Object['freeze']({
  'modelId': "gpt-5.5",
  'executionId': 'grsai.model-api.text.gpt-5-5.v1',
  'displayName': "gpt-5.5",
  'model': "gpt-5.5",
  'subtitle': "GRSAI chat completion model API",
  'icon': "grsai",
  'order': 0x28
}), Object['freeze']({
  'modelId': "gemini-3-flash",
  'executionId': "grsai.model-api.text.gemini-3-flash.v1",
  'displayName': 'gemini-3-flash',
  'model': 'gemini-3-flash',
  'subtitle': "GRSAI Gemini 视频理解模型",
  'icon': "grsai",
  'inputSlots': CHAT_COMPLETION_TEXT_IMAGE_SINGLE_VIDEO_INPUT_SLOTS,
  'videoInput': !![],
  'order': 0x32
}), Object["freeze"]({
  'modelId': "gemini-3.1-pro",
  'executionId': 'grsai.model-api.text.gemini-3-1-pro.v1',
  'displayName': "gemini-3.1-pro",
  'model': 'gemini-3.1-pro',
  'subtitle': 'Gemini\x203.1\x20多模态理解与推理模型',
  'icon': "grsai",
  'order': 0x3c
}), Object["freeze"]({
  'modelId': "gemini-3-pro",
  'executionId': 'grsai.model-api.text.gemini-3-pro.v1',
  'displayName': 'gemini-3-pro',
  'model': "gemini-3-pro",
  'subtitle': "Gemini 3.0 多模态理解与推理模型",
  'icon': "grsai",
  'order': 0x46
}), Object['freeze']({
  'modelId': "gemini-3.1-flash-lite",
  'executionId': "grsai.model-api.text.gemini-3-1-flash-lite.v1",
  'displayName': "gemini-3.1-flash-lite",
  'model': "gemini-3.1-flash-lite",
  'subtitle': "Gemini 3.1 轻量多模态模型",
  'icon': "grsai",
  'order': 0x50
}), Object["freeze"]({
  'modelId': "gemini-3.5-flash",
  'executionId': "grsai.model-api.text.gemini-3-5-flash.v1",
  'displayName': "gemini-3.5-flash",
  'model': "gemini-3.5-flash",
  'subtitle': "Gemini 多模态理解与推理模型",
  'icon': 'grsai',
  'order': 0x5a
}), Object["freeze"]({
  'modelId': "gemini-3.5-flash-lite",
  'executionId': 'grsai.model-api.text.gemini-3-5-flash-lite.v1',
  'displayName': "gemini-3.5-flash-lite",
  'model': "gemini-3.5-flash-lite",
  'subtitle': 'GRSAI\x20chat\x20completion\x20model\x20API',
  'icon': "grsai",
  'order': 0x5b
}), Object["freeze"]({
  'modelId': "gemini-3.7-flash",
  'executionId': "grsai.model-api.text.gemini-3-7-flash.v1",
  'displayName': 'gemini-3.7-flash',
  'model': "gemini-3.7-flash",
  'subtitle': "GRSAI chat completion model API",
  'icon': "grsai",
  'order': 0x5c
}), Object["freeze"]({
  'modelId': "gemini-3.8-flash",
  'executionId': 'grsai.model-api.text.gemini-3-8-flash.v1',
  'displayName': "gemini-3.8-flash",
  'model': "gemini-3.8-flash",
  'subtitle': "GRSAI chat completion model API",
  'icon': "grsai",
  'order': 0x5d
}), Object["freeze"]({
  'modelId': "gemini-2.5-flash",
  'executionId': "grsai.model-api.text.gemini-2-5-flash.v1",
  'displayName': 'gemini-2.5-flash',
  'model': "gemini-2.5-flash",
  'subtitle': 'Gemini\x202.5\x20多模态理解模型',
  'icon': 'grsai',
  'order': 0x64
}), Object["freeze"]({
  'modelId': 'gemini-2.5-pro',
  'executionId': "grsai.model-api.text.gemini-2-5-pro.v1",
  'displayName': 'gemini-2.5-pro',
  'model': "gemini-2.5-pro",
  'subtitle': "Gemini 2.5 多模态理解与推理模型",
  'icon': 'grsai',
  'order': 0x6e
})]);
const PPIO_TEXT_MODELS = Object["freeze"]([Object['freeze']({
  'modelId': "minimax/minimax-m2.5-highspeed",
  'executionId': "ppio.model-api.text.minimax-m2-5-highspeed.v1",
  'displayName': 'MiniMax\x20M2.5-highspeed',
  'model': "minimax/minimax-m2.5-highspeed",
  'title': "minimax-m2.5-highspeed",
  'subtitle': '更低延迟、更高性价比的领先模型',
  'icon': "ppio",
  'order': 0xa
}), Object["freeze"]({
  'modelId': 'qwen/qwen3.5-397b-a17b',
  'executionId': "ppio.model-api.text.qwen3-5-397b-a17b.v1",
  'displayName': "Qwen3.5-397B-A17B",
  'model': "qwen/qwen3.5-397b-a17b",
  'title': "qwen3.5-397b",
  'subtitle': "阿里最强开源模型Qwen2.5",
  'icon': "qwen",
  'order': 0x14
}), Object["freeze"]({
  'modelId': "deepseek/deepseek-v3.2",
  'executionId': "ppio.model-api.text.deepseek-v3-2.v1",
  'displayName': "DeepSeek-V3.2",
  'model': "deepseek/deepseek-v3.2",
  'title': 'deepseek-v3',
  'subtitle': "面向未来的新一代大模型",
  'icon': "deepseek",
  'order': 0x1e
}), Object["freeze"]({
  'modelId': 'moonshotai/kimi-k2.5',
  'executionId': "ppio.model-api.text.kimi-k2-5.v1",
  'displayName': 'Kimi\x20K2.5',
  'model': "moonshotai/kimi-k2.5",
  'title': "kimi-k2.5",
  'subtitle': "月之暗面最新版，超长上下文",
  'icon': 'moonshot',
  'order': 0x28
})]);
const APIMART_TEXT_MODELS = Object["freeze"]([Object["freeze"]({
  'modelId': "apimart/kimi-k2-instruct",
  'executionId': "apimart.model-api.text.kimi-k2-instruct.v1",
  'displayName': "Kimi K2 Instruct",
  'model': "kimi-k2-instruct",
  'subtitle': "APIMart text model",
  'order': 0xa
}), Object['freeze']({
  'modelId': 'apimart/deepseek-v4-pro',
  'executionId': "apimart.model-api.text.deepseek-v4-pro.v1",
  'displayName': "DeepSeek V4 Pro",
  'model': 'deepseek-v4-pro',
  'subtitle': 'APIMart\x20text\x20model',
  'order': 0x14,
  'structuredOutputMode': "json_object",
  'thinkingControlMode': "thinking"
}), Object["freeze"]({
  'modelId': "apimart/deepseek-v4-flash",
  'executionId': "apimart.model-api.text.deepseek-v4-flash.v1",
  'displayName': "DeepSeek V4 Flash",
  'model': "deepseek-v4-flash",
  'subtitle': "APIMart text model",
  'order': 0x1e,
  'structuredOutputMode': 'json_object',
  'thinkingControlMode': "thinking"
}), Object["freeze"]({
  'modelId': "apimart/gpt-5.5",
  'executionId': "apimart.model-api.text.gpt-5-5.v1",
  'displayName': 'GPT-5.5',
  'model': "gpt-5.5",
  'subtitle': "OpenAI-compatible text model",
  'order': 0x28,
  'reasoningEffortMode': "openai"
}), Object["freeze"]({
  'modelId': "apimart/gpt-5.6-luna",
  'executionId': 'apimart.model-api.text.gpt-5-6-luna.v1',
  'displayName': 'GPT-5.6\x20Luna',
  'model': 'gpt-5.6-luna',
  'title': "gpt-5.6-luna",
  'subtitle': "APIMart text model",
  'order': 0x29,
  'reasoningEffortMode': "openai"
}), Object['freeze']({
  'modelId': "apimart/gpt-5.6-terra",
  'executionId': "apimart.model-api.text.gpt-5-6-terra.v1",
  'displayName': "GPT-5.6 Terra",
  'model': 'gpt-5.6-terra',
  'title': "gpt-5.6-terra",
  'subtitle': 'APIMart\x20text\x20model',
  'order': 0x2a,
  'reasoningEffortMode': "openai"
}), Object["freeze"]({
  'modelId': "apimart/gpt-5.6-sol",
  'executionId': "apimart.model-api.text.gpt-5-6-sol.v1",
  'displayName': "GPT-5.6 Sol",
  'model': 'gpt-5.6-sol',
  'title': "gpt-5.6-sol",
  'subtitle': "APIMart text model",
  'order': 0x2b,
  'reasoningEffortMode': "openai"
}), Object["freeze"]({
  'modelId': "apimart/claude-sonnet-5",
  'executionId': "apimart.model-api.text.claude-sonnet-5.v1",
  'displayName': "Claude Sonnet 5",
  'model': "claude-sonnet-5",
  'title': "claude-sonnet-5",
  'subtitle': "APIMart text model",
  'order': 0x2c
}), Object["freeze"]({
  'modelId': "apimart/claude-fable-5",
  'executionId': "apimart.model-api.text.claude-fable-5.v1",
  'displayName': "Claude Fable 5",
  'model': 'claude-fable-5',
  'title': "claude-fable-5",
  'subtitle': "APIMart text model",
  'order': 0x2d
}), Object["freeze"]({
  'modelId': "apimart/gemini-3.1-pro-preview",
  'executionId': "apimart.model-api.text.gemini-3-1-pro-preview.v1",
  'displayName': "Gemini 3.1 Pro Preview",
  'model': 'gemini-3.1-pro-preview',
  'title': "gemini-3.1-pro-preview",
  'subtitle': "旗舰级多模态模型，支持超长文本与深度分析",
  'icon': "gemini",
  'videoInput': !![],
  'order': 0x45
}), Object['freeze']({
  'modelId': "apimart/gemini-3-flash-preview-nothinking",
  'executionId': "apimart.model-api.text.gemini-3-flash-nothinking.v1",
  'displayName': "Gemini 3 Flash",
  'model': "gemini-3-flash-preview-nothinking",
  'title': "gemini-3-flash-preview-nothinking",
  'subtitle': "闪电级响应速度，适用于高频率对话与实时任务",
  'icon': "gemini",
  'videoInput': !![],
  'order': 0x3f
}), Object["freeze"]({
  'modelId': "apimart/gemini-3.5-flash",
  'executionId': 'apimart.model-api.text.gemini-3-5-flash.v1',
  'displayName': "Gemini 3.5 Flash",
  'model': 'gemini-3.5-flash',
  'title': 'gemini-3.5-flash',
  'subtitle': "APIMart Gemini flash text model",
  'icon': "gemini",
  'videoInput': !![],
  'order': 0x47
}), Object["freeze"]({
  'modelId': 'apimart/gemini-2.5-flash',
  'executionId': "apimart.model-api.text.gemini-2-5-flash.v1",
  'displayName': "Gemini 2.5 Flash",
  'model': "gemini-2.5-flash",
  'subtitle': "APIMart Gemini 原生视频理解模型",
  'icon': "gemini",
  'videoInput': !![],
  'order': 0x38
}), Object["freeze"]({
  'modelId': "apimart/gemini-2.5-flash-lite",
  'executionId': "apimart.model-api.text.gemini-2-5-flash-lite.v1",
  'displayName': "Gemini 2.5 Flash Lite",
  'model': 'gemini-2.5-flash-lite',
  'subtitle': "APIMart Gemini 原生视频理解模型",
  'icon': "gemini",
  'videoInput': !![],
  'order': 0x39
}), Object['freeze']({
  'modelId': "apimart/gemini-2.5-flash-nothinking",
  'executionId': "apimart.model-api.text.gemini-2-5-flash-nothinking.v1",
  'displayName': 'Gemini\x202.5\x20Flash\x20No\x20Thinking',
  'model': 'gemini-2.5-flash-nothinking',
  'subtitle': "APIMart Gemini 原生视频理解模型",
  'icon': "gemini",
  'videoInput': !![],
  'order': 0x3a
}), Object["freeze"]({
  'modelId': "apimart/gemini-2.5-flash-thinking",
  'executionId': "apimart.model-api.text.gemini-2-5-flash-thinking.v1",
  'displayName': "Gemini 2.5 Flash Thinking",
  'model': "gemini-2.5-flash-thinking",
  'subtitle': 'APIMart\x20Gemini\x20原生视频理解模型',
  'icon': "gemini",
  'videoInput': !![],
  'order': 0x3b
}), Object["freeze"]({
  'modelId': "apimart/gemini-2.5-pro",
  'executionId': "apimart.model-api.text.gemini-2-5-pro.v1",
  'displayName': "Gemini 2.5 Pro",
  'model': "gemini-2.5-pro",
  'subtitle': "APIMart Gemini 原生视频理解模型",
  'icon': "gemini",
  'videoInput': !![],
  'geminiNativeThinkingControl': APIMART_GEMINI_REQUIRED_THINKING_CONTROL,
  'order': 0x3c
}), Object["freeze"]({
  'modelId': "apimart/gemini-2.5-pro-nothinking",
  'executionId': 'apimart.model-api.text.gemini-2-5-pro-nothinking.v1',
  'displayName': "Gemini 2.5 Pro No Thinking",
  'model': "gemini-2.5-pro-nothinking",
  'subtitle': "APIMart Gemini 原生视频理解模型",
  'icon': "gemini",
  'videoInput': !![],
  'geminiNativeThinkingControl': APIMART_GEMINI_REQUIRED_THINKING_CONTROL,
  'order': 0x3d
}), Object['freeze']({
  'modelId': "apimart/gemini-2.5-pro-thinking",
  'executionId': "apimart.model-api.text.gemini-2-5-pro-thinking.v1",
  'displayName': "Gemini 2.5 Pro Thinking",
  'model': "gemini-2.5-pro-thinking",
  'subtitle': "APIMart Gemini 原生视频理解模型",
  'icon': 'gemini',
  'videoInput': !![],
  'geminiNativeThinkingControl': APIMART_GEMINI_REQUIRED_THINKING_CONTROL,
  'order': 0x3e
}), Object["freeze"]({
  'modelId': "apimart/gemini-3-flash-preview",
  'executionId': 'apimart.model-api.text.gemini-3-flash-preview.v1',
  'displayName': 'Gemini\x203\x20Flash\x20Preview',
  'model': "gemini-3-flash-preview",
  'subtitle': "APIMart Gemini 原生视频理解模型",
  'icon': 'gemini',
  'videoInput': !![],
  'order': 0x40
}), Object['freeze']({
  'modelId': 'apimart/gemini-3-flash-preview-thinking',
  'executionId': "apimart.model-api.text.gemini-3-flash-preview-thinking.v1",
  'displayName': "Gemini 3 Flash Preview Thinking",
  'model': 'gemini-3-flash-preview-thinking',
  'subtitle': "APIMart Gemini 原生视频理解模型",
  'icon': "gemini",
  'videoInput': !![],
  'order': 0x41
}), Object['freeze']({
  'modelId': "apimart/gemini-3-pro-preview",
  'executionId': "apimart.model-api.text.gemini-3-pro-preview.v1",
  'displayName': "Gemini 3 Pro Preview",
  'model': "gemini-3-pro-preview",
  'subtitle': "APIMart Gemini 原生视频理解模型",
  'icon': "gemini",
  'videoInput': !![],
  'order': 0x42
}), Object['freeze']({
  'modelId': 'apimart/gemini-3-pro-preview-thinking',
  'executionId': "apimart.model-api.text.gemini-3-pro-preview-thinking.v1",
  'displayName': "Gemini 3 Pro Preview Thinking",
  'model': "gemini-3-pro-preview-thinking",
  'subtitle': "APIMart Gemini 原生视频理解模型",
  'icon': "gemini",
  'videoInput': !![],
  'order': 0x43
}), Object['freeze']({
  'modelId': "apimart/gemini-3.1-pro-preview-thinking",
  'executionId': "apimart.model-api.text.gemini-3-1-pro-preview-thinking.v1",
  'displayName': 'Gemini\x203.1\x20Pro\x20Preview\x20Thinking',
  'model': "gemini-3.1-pro-preview-thinking",
  'subtitle': "APIMart Gemini 原生视频理解模型",
  'icon': 'gemini',
  'videoInput': !![],
  'order': 0x46
}), Object["freeze"]({
  'modelId': "apimart/gemini-3.5-flash-lite",
  'executionId': "apimart.model-api.text.gemini-3-5-flash-lite.v1",
  'displayName': "Gemini 3.5 Flash Lite",
  'model': 'gemini-3.5-flash-lite',
  'subtitle': "APIMart Gemini 原生视频理解模型",
  'icon': 'gemini',
  'videoInput': !![],
  'order': 0x48
}), Object['freeze']({
  'modelId': 'apimart/gemini-3.6-flash',
  'executionId': "apimart.model-api.text.gemini-3-6-flash.v1",
  'displayName': "Gemini 3.6 Flash",
  'model': "gemini-3.6-flash",
  'subtitle': "APIMart Gemini 原生视频理解模型",
  'icon': "gemini",
  'videoInput': !![],
  'order': 0x49
}), ...apimartAdditionalTextModels]);
export const vendorTextModelApiModelManifests = Object["freeze"]([...apimartQwenTextModelManifests, ...bailianTextModelManifests, ...bailianPartnerTextModelManifests, ...deepseekTextModelManifests, ...RUNNINGHUB_IMAGE_TO_TEXT_MODELS['map'](_0xa821a5 => createRunningHubTextModelApiManifest({
  'modelId': _0xa821a5["modelId"],
  'executionId': _0xa821a5['executionId'],
  'displayName': _0xa821a5["displayName"],
  'extensions': Object['freeze']({
    'providerProfiles': getRunningHubModelApiProfileIds(_0xa821a5["modelId"])
  })
})), ...RUNNINGHUB_LLM_TEXT_MODELS["map"](_0x2d92b9 => createTextModelApiManifest({
  'modelId': _0x2d92b9['modelId'],
  'executionId': _0x2d92b9["executionId"],
  'displayName': resolveRunningHubTextMenuTitle(_0x2d92b9["model"]),
  'provider': 'runninghub',
  'icon': "images/RH.png",
  'description': 'RunningHub\x20LLM\x20chat\x20completion\x20model\x20API',
  'inputSlots': _0x2d92b9["inputSlots"] || CHAT_COMPLETION_TEXT_ONLY_INPUT_SLOTS,
  'extensions': Object['freeze']({
    'providerProfiles': getRunningHubModelApiProfileIds(_0x2d92b9["modelId"]),
    'textMenu': Object["freeze"]({
      'group': "runninghub",
      'order': _0x2d92b9['order'],
      'title': resolveRunningHubTextMenuTitle(_0x2d92b9["model"]),
      'subtitle': _0x2d92b9["subtitle"],
      'icon': _0x2d92b9["icon"]
    })
  })
})), ...VOLCENGINE_TEXT_MODELS['map'](_0x1f598d => createTextModelApiManifest({
  'modelId': _0x1f598d["modelId"],
  'executionId': _0x1f598d['executionId'],
  'displayName': _0x1f598d["displayName"],
  'aliases': Object["freeze"]([_0x1f598d["model"]]),
  'provider': "volcengine",
  'icon': "images/volcengine.svg",
  'description': "Volcengine Ark chat completion model API",
  'inputSlots': _0x1f598d["inputSlots"] || CHAT_COMPLETION_TEXT_IMAGE_VIDEO_INPUT_SLOTS,
  'extensions': Object["freeze"]({
    'textMenu': Object["freeze"]({
      'group': "volcengine",
      'order': _0x1f598d["order"],
      'title': _0x1f598d['title'] || _0x1f598d["displayName"],
      'subtitle': _0x1f598d["subtitle"],
      'icon': _0x1f598d['icon']
    })
  })
})), ...GRSAI_TEXT_MODELS['map'](_0x12da51 => createTextModelApiManifest({
  'modelId': _0x12da51["modelId"],
  'executionId': _0x12da51["executionId"],
  'displayName': _0x12da51["displayName"],
  'provider': "grsai",
  'icon': "images/grsai.png",
  'description': "GRSAI chat completion model API",
  'inputSlots': _0x12da51["inputSlots"] || CHAT_COMPLETION_TEXT_INPUT_SLOTS,
  'extensions': Object['freeze']({
    'textMenu': Object["freeze"]({
      'group': "grsai",
      'order': _0x12da51["order"],
      'title': _0x12da51["title"] || _0x12da51["displayName"],
      'subtitle': _0x12da51["subtitle"],
      'icon': _0x12da51['icon']
    })
  })
})), ...PPIO_TEXT_MODELS["map"](_0x215238 => createTextModelApiManifest({
  'modelId': _0x215238['modelId'],
  'executionId': _0x215238["executionId"],
  'displayName': _0x215238["displayName"],
  'provider': "ppio",
  'icon': "images/ppio.png",
  'description': "PPIO chat completion model API",
  'inputSlots': CHAT_COMPLETION_TEXT_INPUT_SLOTS,
  'extensions': Object['freeze']({
    'textMenu': Object['freeze']({
      'group': "ppio",
      'order': _0x215238['order'],
      'title': _0x215238["title"] || _0x215238["displayName"],
      'subtitle': _0x215238["subtitle"],
      'icon': _0x215238["icon"]
    })
  })
})), ...APIMART_TEXT_MODELS["map"](_0x3b0370 => createTextModelApiManifest({
  'modelId': _0x3b0370["modelId"],
  'executionId': _0x3b0370["executionId"],
  'displayName': _0x3b0370["displayName"],
  'aliases': _0x3b0370["aliases"],
  'provider': "apimart",
  'icon': 'AM',
  'description': "APIMart chat completion model API",
  'inputSlots': _0x3b0370["mediaPolicy"] === 'text-only' ? CHAT_COMPLETION_TEXT_ONLY_INPUT_SLOTS : _0x3b0370['videoInput'] || _0x3b0370["mediaPolicy"] === "image-video" ? CHAT_COMPLETION_TEXT_IMAGE_SINGLE_VIDEO_INPUT_SLOTS : CHAT_COMPLETION_TEXT_INPUT_SLOTS,
  'extensions': Object["freeze"]({
    'textMenu': Object['freeze']({
      'group': 'apimart',
      'order': _0x3b0370["order"],
      'title': _0x3b0370["title"] || _0x3b0370["displayName"],
      'subtitle': _0x3b0370["subtitle"],
      ...(_0x3b0370["icon"] ? {
        'icon': _0x3b0370["icon"]
      } : {})
    })
  })
})), ...AGNES_TEXT_MODELS["map"](_0xfb2351 => createTextModelApiManifest({
  'modelId': _0xfb2351["modelId"],
  'executionId': _0xfb2351["executionId"],
  'displayName': _0xfb2351["displayName"],
  'provider': "agnes",
  'icon': 'AG',
  'description': "Agnes AI chat completion model API",
  'inputSlots': CHAT_COMPLETION_TEXT_INPUT_SLOTS,
  'extensions': Object['freeze']({
    'providerProfiles': AGNES_MODEL_API_PROFILE_IDS,
    'textMenu': Object["freeze"]({
      'group': "agnes",
      'order': _0xfb2351["order"],
      'title': _0xfb2351["title"] || _0xfb2351["displayName"],
      'subtitle': _0xfb2351["subtitle"],
      'icon': _0xfb2351['icon'],
      ...(_0xfb2351["badge"] ? {
        'badge': _0xfb2351["badge"]
      } : {})
    })
  })
}))]);
export const vendorTextModelApiExecutionManifests = Object["freeze"]([...apimartQwenTextExecutionManifests, ...bailianTextExecutionManifests, ...bailianPartnerTextExecutionManifests, ...deepseekTextExecutionManifests, ...RUNNINGHUB_IMAGE_TO_TEXT_MODELS["map"](_0x33ad58 => createTextExecutionManifest({
  'id': _0x33ad58['executionId'],
  'model': _0x33ad58["model"]
})), ...RUNNINGHUB_LLM_TEXT_MODELS["map"](_0x35cbef => createTextExecutionManifest({
  'id': _0x35cbef["executionId"],
  'provider': "runninghub",
  'model': _0x35cbef['model'],
  'endpoint': "/v1/chat/completions",
  'endpointMode': "chat-completion",
  'bodyMapping': Object["freeze"]({
    'modelField': "model",
    'messagesField': "messages"
  }),
  'responseMapping': CHAT_COMPLETION_TEXT_RESPONSE_MAPPING,
  'result': APIMART_TEXT_RESULT,
  'extensions': Object['freeze']({
    ...RUNNINGHUB_LLM_TEXT_EXECUTION_EXTENSIONS,
    ...(_0x35cbef['videoInput'] ? {
      'chatCompletionInputPolicy': "image-video"
    } : {}),
    ...(_0x35cbef["structuredOutputMode"] ? {
      'structuredOutputMode': _0x35cbef['structuredOutputMode']
    } : {})
  })
})), ...VOLCENGINE_TEXT_MODELS["map"](_0x4f9207 => createTextExecutionManifest({
  'id': _0x4f9207["executionId"],
  'provider': "volcengine",
  'model': _0x4f9207["model"],
  'endpoint': "/responses",
  'endpointMode': 'responses',
  'bodyMapping': Object["freeze"]({
    'modelField': "model",
    'inputField': "input"
  }),
  'responseMapping': VOLCENGINE_RESPONSES_TEXT_RESPONSE_MAPPING,
  'result': APIMART_TEXT_RESULT,
  'extensions': buildVolcengineTextExecutionExtensions(_0x4f9207)
})), ...GRSAI_TEXT_MODELS["map"](_0xca2c6a => createTextExecutionManifest({
  'id': _0xca2c6a["executionId"],
  'provider': "grsai",
  'model': _0xca2c6a["model"],
  'endpoint': "/v1",
  'endpointMode': "chat-completion",
  'bodyMapping': Object["freeze"]({
    'modelField': "model",
    'messagesField': "messages"
  }),
  'responseMapping': CHAT_COMPLETION_TEXT_RESPONSE_MAPPING,
  'result': APIMART_TEXT_RESULT,
  ...(_0xca2c6a['videoInput'] ? {
    'extensions': Object["freeze"]({
      'chatCompletionInputPolicy': "image-video"
    })
  } : {})
})), ...PPIO_TEXT_MODELS['map'](_0x39b42a => createTextExecutionManifest({
  'id': _0x39b42a["executionId"],
  'provider': "ppio",
  'model': _0x39b42a["model"],
  'endpoint': "/openai/v1",
  'endpointMode': "chat-completion",
  'bodyMapping': Object["freeze"]({
    'modelField': "model",
    'messagesField': 'messages'
  }),
  'responseMapping': CHAT_COMPLETION_TEXT_RESPONSE_MAPPING,
  'result': APIMART_TEXT_RESULT
})), ...APIMART_TEXT_MODELS['map'](_0x3b15b2 => createTextExecutionManifest({
  'id': _0x3b15b2["executionId"],
  'provider': "apimart",
  'model': _0x3b15b2["model"],
  'endpoint': "/v1/chat/completions",
  'endpointMode': 'chat-completion',
  'bodyMapping': Object["freeze"]({
    'modelField': "model",
    'messagesField': 'messages'
  }),
  'responseMapping': CHAT_COMPLETION_TEXT_RESPONSE_MAPPING,
  'result': APIMART_TEXT_RESULT,
  'extensions': buildApimartTextExecutionExtensions(_0x3b15b2)
})), ...AGNES_TEXT_MODELS["map"](_0x5a237b => createTextExecutionManifest({
  'id': _0x5a237b["executionId"],
  'provider': "agnes",
  'model': _0x5a237b["model"],
  'endpoint': "/v1/chat/completions",
  'endpointMode': "chat-completion",
  'bodyMapping': Object["freeze"]({
    'modelField': "model",
    'messagesField': 'messages'
  }),
  'responseMapping': CHAT_COMPLETION_TEXT_RESPONSE_MAPPING,
  'result': APIMART_TEXT_RESULT,
  'extensions': AGNES_TEXT_EXECUTION_EXTENSIONS
}))]);