const QWEN_MODELS = Object["freeze"]([["qwen3.8-max", 'Qwen\x203.8\x20Max', !![]], ['qwen3.8-max-0902', 'Qwen\x203.8\x20Max\x200902'], ["qwen3.8-flash", 'Qwen\x203.8\x20Flash'], ["qwen3.8-27b", "Qwen 3.8 27B"], ["qwen3.8-2.4t-a95b", "Qwen 3.8 2.4T A95B"]]);
const executionId = _0x4a50e3 => "apimart.model-api.text." + _0x4a50e3['replaceAll']('.', '-') + ".v1";
const CHAT_RESPONSE_MAPPING = Object["freeze"]({
  'resultPaths': Object["freeze"](['choices[].message.content'])
});
const CHAT_EXTENSIONS = Object["freeze"]({
  'chatCompletionInputPolicy': "image-video",
  'strictUpload': !![],
  'structuredOutputMode': "json_object"
});
export const apimartQwenTextModelManifests = Object["freeze"](QWEN_MODELS["map"](([_0x535918, _0x4d120d, _0x469f5b]) => Object['freeze']({
  'schemaVersion': "1.0",
  'modelId': "apimart/" + _0x535918,
  'executionId': executionId(_0x535918),
  'provider': 'apimart',
  'kind': "text",
  'adapterType': 'modelApi',
  'displayName': _0x4d120d,
  'icon': "images/qwen.svg",
  'description': _0x469f5b ? "支持图文理解、联网搜索和网页读取；推理始终开启" : "APIMart chat completion model API",
  'inputSlots': Object['freeze']({
    'allowedKinds': Object["freeze"](["text", "image", "video"]),
    'minByKind': Object["freeze"]({
      'text': 0x0,
      'image': 0x0
    }),
    'maxByKind': Object["freeze"]({
      'image': 0x8,
      'video': 0x1,
      'audio': 0x0
    })
  }),
  'uiSchema': _0x469f5b ? Object["freeze"]({
    'fields': Object["freeze"]([Object['freeze']({
      'id': "webSearch",
      'type': 'segmented',
      'placement': "mode",
      'variant': "pillMenu",
      'label': '联网',
      'defaultValue': ![],
      'menuDescription': "开启后允许模型搜索和读取网页，工具按实际调用次数额外计费。",
      'options': Object['freeze']([Object["freeze"]({
        'value': ![],
        'label': '关闭',
        'selectedLabel': '联网：关'
      }), Object["freeze"]({
        'value': !![],
        'label': "搜索与读取网页",
        'selectedLabel': "联网：开",
        'subtitle': '工具按实际调用次数额外计费'
      })])
    }), Object['freeze']({
      'id': "imageSearch",
      'type': 'segmented',
      'placement': "mode",
      'variant': "pillMenu",
      'label': '搜图',
      'defaultValue': "off",
      'menuDescription': "搜索网上已有图片，工具按实际调用次数额外计费；以图搜图需要参考图，耗时较长。",
      'options': Object["freeze"]([Object["freeze"]({
        'value': 'off',
        'label': '关闭',
        'selectedLabel': "搜图：关"
      }), Object["freeze"]({
        'value': "text",
        'label': "文字搜图",
        'selectedLabel': '文字搜图'
      }), Object["freeze"]({
        'value': 'image',
        'label': '以图搜图',
        'selectedLabel': "以图搜图"
      })])
    }), Object["freeze"]({
      'id': "maxOutputTokens",
      'type': "segmented",
      'placement': "mode",
      'variant': "pillMenu",
      'label': "输出上限",
      'defaultValue': 0x2000,
      'menuDescription': '上限包含思考与正文；本模型的思考不可关闭。',
      'options': Object['freeze']([0x1000, 0x2000, 0x4000, 0x8000, 0x10000, 0x20000]["map"](_0x29902e => Object["freeze"]({
        'value': _0x29902e,
        'label': _0x29902e["toLocaleString"]("en-US") + " tokens",
        'selectedLabel': "上限：" + _0x29902e / 0x400 + 'K'
      })))
    })])
  }) : Object["freeze"]({
    'fields': Object["freeze"]([])
  }),
  'extensions': Object["freeze"]({
    'textMenu': Object["freeze"]({
      'group': "apimart",
      'title': _0x4d120d,
      'subtitle': _0x469f5b ? "图文理解 · 可选联网搜索 / 网页读取" : "APIMart chat completion model API",
      'icon': "qwen"
    })
  }),
  'async': ![],
  'cancellable': ![],
  'outputType': "text"
})));
export const apimartQwenTextExecutionManifests = Object['freeze'](QWEN_MODELS["map"](([_0x1eea07,, _0x365ccc]) => Object['freeze']({
  'schemaVersion': "1.0",
  'id': executionId(_0x1eea07),
  'provider': "apimart",
  'kind': 'text',
  'adapterType': "modelApi",
  'endpoint': _0x365ccc ? "/v1/responses" : "/v1/chat/completions",
  'endpointMode': _0x365ccc ? "responses" : "chat-completion",
  'method': "POST",
  'model': _0x1eea07,
  'headers': Object["freeze"]({
    'Content-Type': 'application/json'
  }),
  'bodyMapping': Object["freeze"](_0x365ccc ? {
    'modelField': "model",
    'promptField': "input"
  } : {
    'modelField': "model",
    'messagesField': "messages"
  }),
  'responseMapping': _0x365ccc ? Object["freeze"]({
    'resultPaths': Object["freeze"](["output_text", "output[].content[].text"]),
    'includeSources': !![],
    'imageResults': "markdown"
  }) : CHAT_RESPONSE_MAPPING,
  'result': Object["freeze"]({
    'textFields': _0x365ccc ? Object['freeze'](["output_text", 'output[].content[].text']) : CHAT_RESPONSE_MAPPING['resultPaths']
  }),
  'extensions': _0x365ccc ? Object['freeze']({
    'chatCompletionInputPolicy': 'image-video',
    'strictUpload': !![],
    'videoChatCompletion': Object['freeze']({
      'endpoint': "/v1/chat/completions",
      'structuredOutputMode': "json_object",
      'responseMapping': CHAT_RESPONSE_MAPPING
    }),
    'responsesInputFormat': 'image-url',
    'maxOutputTokens': 0x20000,
    'webSearchTools': Object['freeze']([Object['freeze']({
      'type': "web_search"
    }), Object["freeze"]({
      'type': "web_extractor"
    })]),
    'imageSearchTools': Object["freeze"]({
      'text': Object["freeze"]({
        'type': "web_search_image"
      }),
      'image': Object["freeze"]({
        'type': "image_search",
        'requiresImage': !![]
      })
    }),
    'imageSearchInstructions': "When presenting image search results, use only actual image URLs returned by the search tool. Format each image as [![short description](<image URL>)](<source page URL>), or ![short description](<image URL>) if no source page is provided. Do not invent URLs. If the tool returns no usable image URLs, explain that no images were found. Return at most 24 images."
  }) : CHAT_EXTENSIONS
})));