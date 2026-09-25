import { BATCH_SIZE_FIELD, GPT_IMAGE_2_IMAGE_SIZE_FIELD, GRSAI_GPT_IMAGE_2_IMAGE_SIZE_FIELD, GRSAI_GPT_IMAGE_2_MODE_FIELD, GRSAI_GPT_IMAGE_2_RATIO_FIELD, GRSAI_NANO_BANANA_2_RATIO_FIELD, GRSAI_NANO_BANANA_1K_IMAGE_SIZE_FIELD, GRSAI_NANO_BANANA_2K_IMAGE_SIZE_FIELD, GRSAI_NANO_BANANA_2_IMAGE_SIZE_FIELD, GRSAI_NANO_BANANA_4K_IMAGE_SIZE_FIELD, GRSAI_NANO_BANANA_IMAGE_SIZE_FIELD, GRSAI_NANO_BANANA_PRO_IMAGE_SIZE_FIELD, GRSAI_NANO_BANANA_RATIO_FIELD, IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS, IMAGE_MODEL_API_16_IMAGE_INPUT_SLOTS, MODE_CL_FIELD, MODE_NORMAL_CL_FIELD, MODE_NORMAL_VT_CL_VIP_FIELD, MODE_VIP_FIELD, createImageModelApiManifest, createModelApiExecutionManifest, withDefaultValue } from './sharedImageModelApiFields.js';
import { GPT_IMAGE_2_5_MODE_FIELD } from './gptImage25Fields.js';
function freezeExtensionValue(_0x44bdc3) {
  if (Array["isArray"](_0x44bdc3)) {
    return Object["freeze"]([..._0x44bdc3]);
  }
  if (_0x44bdc3 && typeof _0x44bdc3 === "object") {
    return Object["freeze"](Object["fromEntries"](Object["entries"](_0x44bdc3)["map"](([_0x3fc06c, _0x36b9e6]) => [_0x3fc06c, freezeExtensionValue(_0x36b9e6)])));
  }
  return _0x44bdc3;
}
function createImageModelExtensions({
  imageMenu: _0x41036c,
  imageFunctionMenu: _0x2ebb2e,
  imageSizePolicy: _0x4ce483,
  gptImage2: _0x1a689d,
  nanoBanana: _0x4cf53b
} = {}) {
  const _0x1b3847 = {};
  if (_0x41036c) {
    _0x1b3847["imageMenu"] = freezeExtensionValue(_0x41036c);
  }
  if (_0x2ebb2e) {
    _0x1b3847["imageFunctionMenu"] = freezeExtensionValue(_0x2ebb2e);
  }
  _0x4ce483 && (_0x1b3847["imageSizePolicy"] = freezeExtensionValue(_0x4ce483));
  if (_0x1a689d) {
    _0x1b3847["gptImage2"] = freezeExtensionValue(_0x1a689d);
  }
  if (_0x4cf53b) {
    _0x1b3847["nanoBanana"] = freezeExtensionValue(_0x4cf53b);
  }
  return Object["freeze"](_0x1b3847);
}
function createImageMenuExtension(_0xc763cb) {
  return createImageModelExtensions({
    'imageMenu': _0xc763cb
  });
}
const GRSAI_IMAGE_BODY_MAPPING = Object['freeze']([]);
const GRSAI_IMAGE_RESPONSE_MAPPING = Object["freeze"]({
  'taskIdPath': Object["freeze"](["task_id", "taskId", "data.task_id", 'data.taskId', 'id']),
  'statusPath': "status",
  'errorPath': "error",
  'resultPaths': Object['freeze'](['data.result.images[].url', 'result.images[].url', 'data[].url', "data[].image", "results[].url", "results[].imageUrl", "url"])
});
const GRSAI_IMAGE_TASK_POLLING = Object["freeze"]({
  'method': "GET",
  'mode': "task-proxy",
  'urlTemplate': "{baseUrl}/v1/api/result?id={taskId}",
  'headersMode': "bearer"
});
const GRSAI_IMAGE_BODY_RESOLVER = Object["freeze"]({
  'bodyResolver': "grsaiImage"
});
const GRSAI_GPT_IMAGE_2_BODY_RESOLVER = Object["freeze"]({
  'bodyResolver': "grsaiGptImage2Image"
});
const GRSAI_GPT_IMAGE_2_NORMAL_PIXEL_SIZES_BY_RATIO = Object["freeze"]({
  '1:1': Object["freeze"]({
    '1K': "1024x1024"
  }),
  '16:9': Object["freeze"]({
    '1K': '1672x941'
  }),
  '9:16': Object["freeze"]({
    '1K': '941x1672'
  }),
  '4:3': Object["freeze"]({
    '1K': "1443x1090"
  }),
  '3:4': Object['freeze']({
    '1K': "1090x1443"
  }),
  '3:2': Object["freeze"]({
    '1K': '1536x1024'
  }),
  '2:3': Object["freeze"]({
    '1K': "1024x1536"
  }),
  '5:4': Object["freeze"]({
    '1K': '1408x1120'
  }),
  '4:5': Object["freeze"]({
    '1K': "1120x1408"
  }),
  '21:9': Object["freeze"]({
    '1K': '1920x832'
  }),
  '9:21': Object["freeze"]({
    '1K': "832x1920"
  }),
  '1:2': Object["freeze"]({
    '1K': "896x1792"
  }),
  '2:1': Object["freeze"]({
    '1K': '1792x896'
  })
});
const GRSAI_GPT_IMAGE_2_VIP_PIXEL_SIZES_BY_RATIO = Object['freeze']({
  '1:1': Object['freeze']({
    '1K': "1024x1024",
    '2K': "2048x2048",
    '4K': "2880x2880"
  }),
  '16:9': Object["freeze"]({
    '1K': "1280x720",
    '2K': '2048x1152',
    '4K': "3840x2160"
  }),
  '9:16': Object['freeze']({
    '1K': '720x1280',
    '2K': '1152x2048',
    '4K': "2160x3840"
  }),
  '4:3': Object["freeze"]({
    '1K': "1152x864",
    '2K': '2304x1728',
    '4K': "3264x2448"
  }),
  '3:4': Object["freeze"]({
    '1K': '864x1152',
    '2K': "1728x2304",
    '4K': "2448x3264"
  }),
  '3:2': Object["freeze"]({
    '1K': "1536x1024",
    '2K': "2048x1360",
    '4K': '3504x2336'
  }),
  '2:3': Object["freeze"]({
    '1K': "1024x1536",
    '2K': "1360x2048",
    '4K': "2336x3504"
  }),
  '5:4': Object["freeze"]({
    '1K': '1120x896',
    '2K': '2240x1792',
    '4K': "3200x2560"
  }),
  '4:5': Object['freeze']({
    '1K': "896x1120",
    '2K': "1792x2240",
    '4K': "2560x3200"
  }),
  '21:9': Object['freeze']({
    '1K': "1456x624",
    '2K': "2912x1248",
    '4K': '3840x1648'
  }),
  '9:21': Object["freeze"]({
    '1K': '624x1456',
    '2K': '1248x2912',
    '4K': '1648x3840'
  }),
  '1:3': Object["freeze"]({
    '2K': "688x2048",
    '4K': "1280x3840"
  }),
  '3:1': Object['freeze']({
    '2K': "2048x688",
    '4K': "3840x1280"
  }),
  '2:1': Object["freeze"]({
    '1K': "1536x768",
    '2K': '3072x1536',
    '4K': "3840x1920"
  }),
  '1:2': Object['freeze']({
    '1K': "768x1536",
    '2K': "1536x3072",
    '4K': "1920x3840"
  })
});
function getRatioLabelsForImageSize(_0x134fd2, _0x4ebc3f) {
  return Object["freeze"](Object["entries"](_0x134fd2)["filter"](([, _0x42b7fa]) => Object["prototype"]["hasOwnProperty"]["call"](_0x42b7fa || {}, _0x4ebc3f))["map"](([_0x531dbb]) => _0x531dbb));
}
const GRSAI_GPT_IMAGE_2_1K_RATIO_LABELS = getRatioLabelsForImageSize(GRSAI_GPT_IMAGE_2_NORMAL_PIXEL_SIZES_BY_RATIO, '1K');
const GRSAI_GPT_IMAGE_2_2K_RATIO_LABELS = getRatioLabelsForImageSize(GRSAI_GPT_IMAGE_2_VIP_PIXEL_SIZES_BY_RATIO, '2K');
const GRSAI_GPT_IMAGE_2_4K_RATIO_LABELS = getRatioLabelsForImageSize(GRSAI_GPT_IMAGE_2_VIP_PIXEL_SIZES_BY_RATIO, '4K');
const GRSAI_GPT_IMAGE_2_RATIO_POLICY = Object["freeze"]({
  'capability': 'aspectRatio',
  'ratiosByImageSize': Object["freeze"]({
    '1K': GRSAI_GPT_IMAGE_2_1K_RATIO_LABELS,
    '2K': GRSAI_GPT_IMAGE_2_2K_RATIO_LABELS,
    '4K': GRSAI_GPT_IMAGE_2_4K_RATIO_LABELS
  })
});
const GRSAI_GPT_IMAGE_2_IMAGE_SIZE_POLICY = Object["freeze"]({
  'omitRequestParam': !![],
  'defaultLabelSize': '1K'
});
const GRSAI_GPT_IMAGE_2_NORMAL_EXTENSION = Object["freeze"]({
  'defaultSize': '1K',
  'allowedSizes': Object["freeze"](['1K']),
  'pixelSizesByRatio': GRSAI_GPT_IMAGE_2_NORMAL_PIXEL_SIZES_BY_RATIO
});
const GRSAI_GPT_IMAGE_2_VIP_EXTENSION = Object["freeze"]({
  'defaultSize': '2K',
  'allowedSizes': Object["freeze"](['1K', '2K', '4K']),
  'pixelSizesByRatio': GRSAI_GPT_IMAGE_2_VIP_PIXEL_SIZES_BY_RATIO
});
const GRSAI_NANO_BANANA_SELECTOR_4K_IMAGE_SIZE_POLICY = Object["freeze"]({
  'allow4KSelection': !![]
});
const GRSAI_NANO_BANANA_FIXED_1K_IMAGE_SIZE_POLICY = Object["freeze"]({
  'fixedSize': '1K'
});
const GRSAI_NANO_BANANA_FIXED_2K_IMAGE_SIZE_POLICY = Object["freeze"]({
  'fixedSize': '2K'
});
const GRSAI_NANO_BANANA_FIXED_4K_IMAGE_SIZE_POLICY = Object["freeze"]({
  'fixedSize': '4K'
});
const GPT_IMAGE_2_PROMPT = Object["freeze"]({
  'placeholder': "例：马斯克在抖音直播的截图 人气爆棚 很多网友送礼物 ，比例9比16"
});
const GRSAI_GPT_IMAGE_2_5_MODE_FIELD = Object["freeze"]({
  ...GPT_IMAGE_2_5_MODE_FIELD,
  'menuTooltip': '原版仅支持\x201K；Flare\x20侧重生成速度，Sunburst\x20侧重编辑精度，均支持\x201K/2K/4K。',
  'options': Object["freeze"]([Object['freeze']({
    'value': "original",
    'label': "原版（仅 1K）",
    'selectedLabel': '原版',
    'description': "gpt-image-2.5 原版，分辨率限定为 1K。"
  }), ...GPT_IMAGE_2_5_MODE_FIELD["options"]])
});
const GRSAI_GPT_IMAGE_2_5_IMAGE_SIZE_FIELD = Object["freeze"]({
  ...GPT_IMAGE_2_IMAGE_SIZE_FIELD,
  'defaultValue': '1K',
  'options': Object["freeze"](GPT_IMAGE_2_IMAGE_SIZE_FIELD["options"]["map"](_0x4a524b => _0x4a524b["value"] === '1K' ? _0x4a524b : Object["freeze"]({
    ..._0x4a524b,
    'disableWhen': Object["freeze"]({
      'field': 'mode',
      'value': "original"
    }),
    'tooltip': "原版仅支持 1K；请选择 Flare 或 Sunburst 使用 2K/4K。"
  })))
});
export const grsaiImageModelApiModelManifests = Object["freeze"]([createImageModelApiManifest({
  'modelId': "grsai/gpt-image-2.5",
  'executionId': "grsai.model-api.gpt-image-2-5.v1",
  'provider': "grsai",
  'displayName': "gpt-image-2.5",
  'icon': "images/grsai.png",
  'description': "GRSAI GPT Image 2.5 图像生成与编辑，支持原版 / Flare / Sunburst。",
  'inputSlots': IMAGE_MODEL_API_16_IMAGE_INPUT_SLOTS,
  'fields': [GRSAI_GPT_IMAGE_2_5_MODE_FIELD, GRSAI_GPT_IMAGE_2_5_IMAGE_SIZE_FIELD, GRSAI_GPT_IMAGE_2_RATIO_FIELD, BATCH_SIZE_FIELD],
  'ratioPolicy': GRSAI_GPT_IMAGE_2_RATIO_POLICY,
  'extensions': createImageModelExtensions({
    'imageFunctionMenu': {
      'enabled': !![]
    },
    'imageMenu': {
      'group': "grsaiModel",
      'role': 'directModel',
      'order': 0x1,
      'title': "gpt-image-2.5",
      'subtitle': "原版仅 1K / Flare 快速生成 / Sunburst 精细编辑"
    },
    'imageSizePolicy': GRSAI_GPT_IMAGE_2_IMAGE_SIZE_POLICY
  })
}), createImageModelApiManifest({
  'modelId': "nano-banana-fast",
  'executionId': 'grsai.model-api.nano-banana-fast.v1',
  'provider': "grsai",
  'displayName': "nano-banana-fast",
  'icon': 'images/grsai.png',
  'description': "GRSAI image model API",
  'inputSlots': IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
  'fields': [GRSAI_NANO_BANANA_IMAGE_SIZE_FIELD, GRSAI_NANO_BANANA_RATIO_FIELD, BATCH_SIZE_FIELD],
  'extensions': createImageMenuExtension({
    'group': "grsaiModel",
    'role': "directModel",
    'order': 0x14,
    'title': "nano-banana-fast",
    'subtitle': "快速模型"
  }),
  'nanoBanana': Object['freeze']({
    'family': "nanobanana",
    'mode': "fast"
  })
}), createImageModelApiManifest({
  'modelId': 'nano-banana-2-lite',
  'executionId': 'grsai.model-api.nano-banana-2-lite.v1',
  'provider': 'grsai',
  'displayName': "nano-banana-2-lite",
  'icon': "images/grsai.png",
  'description': "GRSAI image model API",
  'inputSlots': IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
  'fields': [GRSAI_NANO_BANANA_IMAGE_SIZE_FIELD, GRSAI_NANO_BANANA_RATIO_FIELD, BATCH_SIZE_FIELD],
  'extensions': createImageMenuExtension({
    'group': "grsaiModel",
    'role': "directModel",
    'order': 0x28,
    'title': "nano-banana-2-lite",
    'subtitle': "轻量快速模型"
  }),
  'nanoBanana': Object["freeze"]({
    'family': 'nanobanana',
    'mode': "fast"
  })
}), createImageModelApiManifest({
  'modelId': "nano-banana-2",
  'executionId': "grsai.model-api.nano-banana-2.v1",
  'provider': "grsai",
  'displayName': "nano-banana-2",
  'icon': "images/grsai.png",
  'description': "GRSAI image model API",
  'inputSlots': IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
  'fields': [MODE_NORMAL_CL_FIELD, GRSAI_NANO_BANANA_2_IMAGE_SIZE_FIELD, GRSAI_NANO_BANANA_2_RATIO_FIELD, BATCH_SIZE_FIELD],
  'extensions': createImageModelExtensions({
    'imageMenu': {
      'group': "grsaiModel",
      'role': "family",
      'family': 'nanobanana-2',
      'order': 0x1e,
      'title': "nano-banana-2",
      'subtitle': "第二代模型"
    },
    'imageSizePolicy': GRSAI_NANO_BANANA_SELECTOR_4K_IMAGE_SIZE_POLICY,
    'nanoBanana': {
      'family': "nanobanana-2",
      'mode': "normal"
    }
  })
}), createImageModelApiManifest({
  'modelId': "nano-banana-2-cl",
  'executionId': 'grsai.model-api.nano-banana-2.v1',
  'provider': 'grsai',
  'displayName': 'nano-banana-2-cl',
  'icon': "images/grsai.png",
  'description': "GRSAI image model API",
  'inputSlots': IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
  'fields': [MODE_CL_FIELD, GRSAI_NANO_BANANA_1K_IMAGE_SIZE_FIELD, GRSAI_NANO_BANANA_2_RATIO_FIELD, BATCH_SIZE_FIELD],
  'extensions': createImageModelExtensions({
    'imageSizePolicy': GRSAI_NANO_BANANA_FIXED_1K_IMAGE_SIZE_POLICY,
    'nanoBanana': {
      'family': "nanobanana-2",
      'mode': 'cl'
    }
  })
}), createImageModelApiManifest({
  'modelId': 'nano-banana-2-2k-cl',
  'executionId': "grsai.model-api.nano-banana-2.v1",
  'provider': "grsai",
  'displayName': "nano-banana-2-2k-cl",
  'icon': 'images/grsai.png',
  'description': 'GRSAI\x20image\x20model\x20API',
  'inputSlots': IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
  'fields': [MODE_CL_FIELD, GRSAI_NANO_BANANA_2K_IMAGE_SIZE_FIELD, GRSAI_NANO_BANANA_2_RATIO_FIELD, BATCH_SIZE_FIELD],
  'extensions': createImageModelExtensions({
    'imageSizePolicy': GRSAI_NANO_BANANA_FIXED_2K_IMAGE_SIZE_POLICY,
    'nanoBanana': {
      'family': "nanobanana-2",
      'mode': 'cl'
    }
  })
}), createImageModelApiManifest({
  'modelId': "nano-banana-2-4k-cl",
  'executionId': 'grsai.model-api.nano-banana-2.v1',
  'provider': 'grsai',
  'displayName': "nano-banana-2-4k-cl",
  'icon': "images/grsai.png",
  'description': "GRSAI image model API",
  'inputSlots': IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
  'fields': [MODE_CL_FIELD, GRSAI_NANO_BANANA_4K_IMAGE_SIZE_FIELD, GRSAI_NANO_BANANA_2_RATIO_FIELD, BATCH_SIZE_FIELD],
  'extensions': createImageModelExtensions({
    'imageSizePolicy': GRSAI_NANO_BANANA_FIXED_4K_IMAGE_SIZE_POLICY,
    'nanoBanana': {
      'family': "nanobanana-2",
      'mode': 'cl'
    }
  })
}), createImageModelApiManifest({
  'modelId': "nano-banana-pro",
  'executionId': 'grsai.model-api.nano-banana-pro.v1',
  'provider': "grsai",
  'displayName': "nano-banana-pro",
  'icon': "images/grsai.png",
  'description': 'GRSAI\x20image\x20model\x20API',
  'inputSlots': IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
  'fields': [MODE_NORMAL_VT_CL_VIP_FIELD, GRSAI_NANO_BANANA_PRO_IMAGE_SIZE_FIELD, GRSAI_NANO_BANANA_RATIO_FIELD, BATCH_SIZE_FIELD],
  'extensions': createImageModelExtensions({
    'imageMenu': {
      'group': "grsaiModel",
      'role': "family",
      'family': "nanobanana-pro",
      'order': 0xa,
      'title': 'nano-banana-pro',
      'subtitle': '专业增强模型'
    },
    'imageSizePolicy': GRSAI_NANO_BANANA_SELECTOR_4K_IMAGE_SIZE_POLICY,
    'nanoBanana': {
      'family': 'nanobanana-pro',
      'mode': "normal"
    }
  })
}), createImageModelApiManifest({
  'modelId': 'nano-banana-pro-vt',
  'executionId': "grsai.model-api.nano-banana-pro.v1",
  'provider': "grsai",
  'displayName': "nano-banana-pro-vt",
  'icon': "images/grsai.png",
  'description': "GRSAI image model API",
  'inputSlots': IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
  'fields': [withDefaultValue(MODE_NORMAL_VT_CL_VIP_FIELD, 'vt'), GRSAI_NANO_BANANA_PRO_IMAGE_SIZE_FIELD, GRSAI_NANO_BANANA_RATIO_FIELD, BATCH_SIZE_FIELD],
  'extensions': createImageModelExtensions({
    'imageSizePolicy': GRSAI_NANO_BANANA_SELECTOR_4K_IMAGE_SIZE_POLICY,
    'nanoBanana': {
      'family': "nanobanana-pro",
      'mode': 'vt'
    }
  })
}), createImageModelApiManifest({
  'modelId': "nano-banana-pro-cl",
  'executionId': "grsai.model-api.nano-banana-pro.v1",
  'provider': 'grsai',
  'displayName': "nano-banana-pro-cl",
  'icon': 'images/grsai.png',
  'description': 'GRSAI\x20image\x20model\x20API',
  'inputSlots': IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
  'fields': [withDefaultValue(MODE_NORMAL_VT_CL_VIP_FIELD, 'cl'), GRSAI_NANO_BANANA_1K_IMAGE_SIZE_FIELD, GRSAI_NANO_BANANA_RATIO_FIELD, BATCH_SIZE_FIELD],
  'extensions': createImageModelExtensions({
    'imageSizePolicy': GRSAI_NANO_BANANA_FIXED_1K_IMAGE_SIZE_POLICY,
    'nanoBanana': {
      'family': 'nanobanana-pro',
      'mode': 'cl'
    }
  })
}), createImageModelApiManifest({
  'modelId': 'nano-banana-pro-vip',
  'executionId': 'grsai.model-api.nano-banana-pro.v1',
  'provider': "grsai",
  'displayName': "nano-banana-pro-vip",
  'icon': 'images/grsai.png',
  'description': "GRSAI image model API",
  'inputSlots': IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
  'fields': [MODE_VIP_FIELD, GRSAI_NANO_BANANA_IMAGE_SIZE_FIELD, GRSAI_NANO_BANANA_RATIO_FIELD, BATCH_SIZE_FIELD],
  'nanoBanana': Object["freeze"]({
    'family': 'nanobanana-pro',
    'mode': "vip"
  })
}), createImageModelApiManifest({
  'modelId': "nano-banana-pro-4k-vip",
  'executionId': "grsai.model-api.nano-banana-pro.v1",
  'provider': "grsai",
  'displayName': "nano-banana-pro-4k-vip",
  'icon': 'images/grsai.png',
  'description': 'GRSAI\x20image\x20model\x20API',
  'inputSlots': IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS,
  'fields': [MODE_VIP_FIELD, GRSAI_NANO_BANANA_4K_IMAGE_SIZE_FIELD, GRSAI_NANO_BANANA_RATIO_FIELD, BATCH_SIZE_FIELD],
  'extensions': createImageModelExtensions({
    'imageSizePolicy': GRSAI_NANO_BANANA_FIXED_4K_IMAGE_SIZE_POLICY,
    'nanoBanana': {
      'family': "nanobanana-pro",
      'mode': 'vip'
    }
  })
}), createImageModelApiManifest({
  'modelId': "gpt-image-2",
  'executionId': "grsai.model-api.gpt-image-2.v1",
  'provider': "grsai",
  'displayName': 'gpt-image-2',
  'icon': "images/grsai.png",
  'description': 'GRSAI\x20image\x20model\x20API',
  'prompt': GPT_IMAGE_2_PROMPT,
  'inputSlots': IMAGE_MODEL_API_16_IMAGE_INPUT_SLOTS,
  'fields': [GRSAI_GPT_IMAGE_2_MODE_FIELD, withDefaultValue(GRSAI_GPT_IMAGE_2_IMAGE_SIZE_FIELD, '1K'), GRSAI_GPT_IMAGE_2_RATIO_FIELD, BATCH_SIZE_FIELD],
  'ratioPolicy': GRSAI_GPT_IMAGE_2_RATIO_POLICY,
  'extensions': createImageModelExtensions({
    'imageMenu': {
      'group': "grsaiModel",
      'role': 'directModel',
      'order': 0x0,
      'title': "gpt-image-2",
      'subtitle': "OpenAI 图像生成模型"
    },
    'imageSizePolicy': GRSAI_GPT_IMAGE_2_IMAGE_SIZE_POLICY,
    'gptImage2': GRSAI_GPT_IMAGE_2_NORMAL_EXTENSION,
    'nanoBanana': {
      'family': "gpt-image-2",
      'mode': "normal"
    }
  })
}), createImageModelApiManifest({
  'modelId': "gpt-image-2-vip",
  'executionId': "grsai.model-api.gpt-image-2.v1",
  'provider': "grsai",
  'displayName': "gpt-image-2-vip",
  'icon': 'images/grsai.png',
  'description': "GRSAI image model API",
  'prompt': GPT_IMAGE_2_PROMPT,
  'inputSlots': IMAGE_MODEL_API_16_IMAGE_INPUT_SLOTS,
  'fields': [withDefaultValue(GRSAI_GPT_IMAGE_2_MODE_FIELD, "vip"), withDefaultValue(GRSAI_GPT_IMAGE_2_IMAGE_SIZE_FIELD, '2K'), GRSAI_GPT_IMAGE_2_RATIO_FIELD, BATCH_SIZE_FIELD],
  'ratioPolicy': GRSAI_GPT_IMAGE_2_RATIO_POLICY,
  'extensions': createImageModelExtensions({
    'imageSizePolicy': GRSAI_GPT_IMAGE_2_IMAGE_SIZE_POLICY,
    'gptImage2': GRSAI_GPT_IMAGE_2_VIP_EXTENSION,
    'nanoBanana': {
      'family': "gpt-image-2",
      'mode': "vip"
    }
  })
})]);
export const grsaiImageModelApiExecutionManifests = Object["freeze"]([createModelApiExecutionManifest({
  'id': "grsai.model-api.gpt-image-2-5.v1",
  'provider': "grsai",
  'model': 'gpt-image-2.5-flare',
  'endpoint': "/v1/api/generate",
  'bodyMapping': Object["freeze"]([Object['freeze']({
    'path': "quality",
    'from': "constant",
    'value': "auto"
  }), Object["freeze"]({
    'path': "replyType",
    'from': "constant",
    'value': 'async'
  })]),
  'responseMapping': GRSAI_IMAGE_RESPONSE_MAPPING,
  'taskPolling': GRSAI_IMAGE_TASK_POLLING,
  'extensions': Object["freeze"]({
    ...GRSAI_GPT_IMAGE_2_BODY_RESOLVER,
    'gptImage2': GRSAI_GPT_IMAGE_2_VIP_EXTENSION,
    'gptImage2ByMode': Object["freeze"]({
      'original': GRSAI_GPT_IMAGE_2_NORMAL_EXTENSION
    })
  }),
  'modeModels': Object["freeze"]({
    'original': "gpt-image-2.5",
    'flare': "gpt-image-2.5-flare",
    'sunburst': 'gpt-image-2.5-sunburst'
  })
}), createModelApiExecutionManifest({
  'id': "grsai.model-api.nano-banana-fast.v1",
  'provider': "grsai",
  'model': 'nano-banana-fast',
  'endpoint': "/v1/api/generate",
  'bodyMapping': GRSAI_IMAGE_BODY_MAPPING,
  'responseMapping': GRSAI_IMAGE_RESPONSE_MAPPING,
  'taskPolling': GRSAI_IMAGE_TASK_POLLING,
  'extensions': GRSAI_IMAGE_BODY_RESOLVER
}), createModelApiExecutionManifest({
  'id': "grsai.model-api.nano-banana-2-lite.v1",
  'provider': "grsai",
  'model': "nano-banana-2-lite",
  'endpoint': "/v1/api/generate",
  'bodyMapping': GRSAI_IMAGE_BODY_MAPPING,
  'responseMapping': GRSAI_IMAGE_RESPONSE_MAPPING,
  'taskPolling': GRSAI_IMAGE_TASK_POLLING,
  'extensions': GRSAI_IMAGE_BODY_RESOLVER
}), createModelApiExecutionManifest({
  'id': "grsai.model-api.nano-banana-2.v1",
  'provider': "grsai",
  'model': 'nano-banana-2',
  'endpoint': '/v1/api/generate',
  'bodyMapping': GRSAI_IMAGE_BODY_MAPPING,
  'responseMapping': GRSAI_IMAGE_RESPONSE_MAPPING,
  'taskPolling': GRSAI_IMAGE_TASK_POLLING,
  'extensions': GRSAI_IMAGE_BODY_RESOLVER,
  'modeModels': Object["freeze"]({
    'normal': "nano-banana-2",
    'cl': Object["freeze"]({
      'byImageSize': Object['freeze']({
        '2K': "nano-banana-2-2k-cl",
        '4K': "nano-banana-2-4k-cl"
      }),
      'default': 'nano-banana-2-cl'
    })
  })
}), createModelApiExecutionManifest({
  'id': "grsai.model-api.nano-banana-pro.v1",
  'provider': "grsai",
  'model': "nano-banana-pro",
  'endpoint': '/v1/api/generate',
  'bodyMapping': GRSAI_IMAGE_BODY_MAPPING,
  'responseMapping': GRSAI_IMAGE_RESPONSE_MAPPING,
  'taskPolling': GRSAI_IMAGE_TASK_POLLING,
  'extensions': GRSAI_IMAGE_BODY_RESOLVER,
  'modeModels': Object['freeze']({
    'normal': 'nano-banana-pro',
    'vt': "nano-banana-pro-vt",
    'cl': "nano-banana-pro-cl",
    'vip': Object["freeze"]({
      'byImageSize': Object['freeze']({
        '4K': "nano-banana-pro-4k-vip"
      }),
      'default': "nano-banana-pro-vip"
    })
  })
}), createModelApiExecutionManifest({
  'id': "grsai.model-api.gpt-image-2.v1",
  'provider': "grsai",
  'model': "gpt-image-2",
  'endpoint': '/v1/api/generate',
  'bodyMapping': GRSAI_IMAGE_BODY_MAPPING,
  'responseMapping': GRSAI_IMAGE_RESPONSE_MAPPING,
  'taskPolling': GRSAI_IMAGE_TASK_POLLING,
  'extensions': GRSAI_GPT_IMAGE_2_BODY_RESOLVER,
  'modeModels': Object["freeze"]({
    'normal': "gpt-image-2",
    'vip': 'gpt-image-2-vip'
  }),
  'imageSizeModels': Object["freeze"]({
    '1K': "gpt-image-2",
    '2K': 'gpt-image-2-vip',
    '4K': 'gpt-image-2-vip',
    'default': "gpt-image-2"
  })
})]);