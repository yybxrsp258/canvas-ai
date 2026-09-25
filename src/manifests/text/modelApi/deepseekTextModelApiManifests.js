const MODELS = Object["freeze"]([{
  'model': "deepseek-chat",
  'title': "DeepSeek\x20Chat",
  'description': "DeepSeek 官方 · 通用文本生成"
}, {
  'model': "deepseek-reasoner",
  'title': "DeepSeek\x20Reasoner",
  'description': "DeepSeek 官方 · 文本推理"
}]);
const executionId = _0x1a2b3c => "deepseek.model-api.text." + _0x1a2b3c + ".v1";
const responseMapping = Object["freeze"]({
  'resultPaths': Object["freeze"](["choices[].message.content"])
});
const DEEPSEEK_TEXT_OUTPUT_TOKENS_FIELD = Object['freeze']({
  'id': "maxOutputTokens",
  'type': "segmented",
  'placement': "mode",
  'variant': "pillMenu",
  'label': "输出上限",
  'defaultValue': 0x2000,
  'options': [0x1000, 0x2000, 0x4000, 0x8000]["map"](_0x4d5e6f => ({
    'value': _0x4d5e6f,
    'label': _0x4d5e6f / 0x400 + 'K'
  }))
});
export const deepseekTextModelManifests = Object["freeze"](MODELS['map'](_0x2c3d4e => Object["freeze"]({
  'schemaVersion': "1.0",
  'modelId': "deepseek/" + _0x2c3d4e["model"],
  'executionId': executionId(_0x2c3d4e["model"]),
  'provider': "deepseek",
  'kind': "text",
  'adapterType': "modelApi",
  'displayName': _0x2c3d4e["title"],
  'icon': "images/deepseek.svg",
  'description': _0x2c3d4e["description"],
  'inputSlots': Object["freeze"]({
    'allowedKinds': Object['freeze'](["text"]),
    'minByKind': Object["freeze"]({
      'text': 0x0
    }),
    'maxByKind': Object["freeze"]({
      'image': 0x0,
      'video': 0x0,
      'audio': 0x0
    })
  }),
  'uiSchema': Object["freeze"]({
    'fields': Object["freeze"]([DEEPSEEK_TEXT_OUTPUT_TOKENS_FIELD])
  }),
  'extensions': Object["freeze"]({
    'textMenu': Object['freeze']({
      'group': "deepseek",
      'title': _0x2c3d4e["title"],
      'subtitle': _0x2c3d4e["description"],
      'icon': "deepseek"
    })
  }),
  'async': ![],
  'cancellable': ![],
  'outputType': "text"
})));
export const deepseekTextExecutionManifests = Object["freeze"](MODELS['map'](_0x3e4f50 => Object["freeze"]({
  'schemaVersion': "1.0",
  'id': executionId(_0x3e4f50["model"]),
  'provider': "deepseek",
  'kind': "text",
  'adapterType': "modelApi",
  'endpoint': "/v1/chat/completions",
  'endpointMode': "chat-completion",
  'method': "POST",
  'model': _0x3e4f50["model"],
  'headers': Object["freeze"]({
    'Content-Type': "application/json"
  }),
  'bodyMapping': Object['freeze']({
    'modelField': "model",
    'messagesField': "messages"
  }),
  'responseMapping': responseMapping,
  'result': Object["freeze"]({
    'textFields': responseMapping["resultPaths"]
  }),
  'extensions': Object["freeze"]({
    'chatCompletionInputPolicy': "text-only",
    'strictUpload': !![],
    'streaming': !![]
  })
})));
