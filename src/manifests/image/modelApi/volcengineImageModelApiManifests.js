import { APIMART_SEEDREAM_4_5_IMAGE_SIZE_FIELD, APIMART_SEEDREAM_4_IMAGE_SIZE_FIELD, APIMART_SEEDREAM_5_LITE_IMAGE_SIZE_FIELD, APIMART_SEEDREAM_5_LITE_RATIO_FIELD, APIMART_SEEDREAM_RATIO_FIELD, BATCH_SIZE_FIELD, createImageModelApiManifest, createModelApiExecutionManifest } from './sharedImageModelApiFields.js';
export const VOLCENGINE_SEEDREAM_5_PRO_MODEL_ID = "volcengine/seedream-5.0-pro";
export const VOLCENGINE_SEEDREAM_5_PRO_EXECUTION_ID = "volcengine.model-api.seedream-5-pro.v1";
export const VOLCENGINE_SEEDREAM_5_MODEL_ID = "volcengine/seedream-5.0";
export const VOLCENGINE_SEEDREAM_5_EXECUTION_ID = 'volcengine.model-api.seedream-5.v1';
export const VOLCENGINE_SEEDREAM_4_5_MODEL_ID = "volcengine/seedream-4.5";
export const VOLCENGINE_SEEDREAM_4_5_EXECUTION_ID = "volcengine.model-api.seedream-4-5.v1";
export const VOLCENGINE_SEEDREAM_4_MODEL_ID = 'volcengine/seedream-4.0';
export const VOLCENGINE_SEEDREAM_4_EXECUTION_ID = "volcengine.model-api.seedream-4.v1";
const VOLCENGINE_IMAGE_RESPONSE_MAPPING = Object["freeze"]({
  'statusPath': 'status',
  'errorPath': Object['freeze'](["error.message", "data.error.message", "message"]),
  'resultPaths': Object['freeze'](["data.data[].url", 'data.images[].url', "data.result.images[].url", "data.output[].url", "data[].url", 'images[].url', "output[].url", "data.url", 'result.images[].url', "results[].url", 'results[].imageUrl', "image_url", "url"])
});
const VOLCENGINE_SEEDREAM_2K_DIMENSIONS = Object["freeze"]({
  '1:1': '2048x2048',
  '4:3': "2304x1728",
  '3:4': "1728x2304",
  '16:9': "2848x1600",
  '9:16': "1600x2848",
  '3:2': "2496x1664",
  '2:3': '1664x2496',
  '21:9': "3136x1344"
});
const VOLCENGINE_SEEDREAM_3K_DIMENSIONS = Object["freeze"]({
  '1:1': '3072x3072',
  '4:3': "3456x2592",
  '3:4': "2592x3456",
  '16:9': "4096x2304",
  '9:16': "2304x4096",
  '3:2': '3744x2496',
  '2:3': "2496x3744",
  '21:9': "4704x2016"
});
const VOLCENGINE_SEEDREAM_5_PRO_IMAGE_SIZE_FIELD = Object["freeze"]({
  ...APIMART_SEEDREAM_4_IMAGE_SIZE_FIELD,
  'options': Object["freeze"]([Object["freeze"]({
    'value': '1K',
    'label': '1K'
  }), Object["freeze"]({
    'value': '2K',
    'label': '2K'
  })])
});
const VOLCENGINE_SEEDREAM_5_PRO_POLICY = Object["freeze"]({
  'allowedResolutions': Object["freeze"](['1K', '2K']),
  'defaultResolution': '2K',
  'maxBatchSize': 0x1,
  'preserveAdaptiveInputRatio': !![],
  'supportsAdaptiveSize': !![]
});
const VOLCENGINE_SEEDREAM_5_POLICY = Object["freeze"]({
  'allowedResolutions': Object["freeze"](['2K', '3K']),
  'defaultResolution': '2K',
  'maxBatchSize': 0x4,
  'preserveAdaptiveInputRatio': !![],
  'supportsAdaptiveSize': !![],
  'dimensionMapByResolution': Object['freeze']({
    '2K': VOLCENGINE_SEEDREAM_2K_DIMENSIONS,
    '3K': VOLCENGINE_SEEDREAM_3K_DIMENSIONS
  })
});
const VOLCENGINE_SEEDREAM_4_5_POLICY = Object["freeze"]({
  'allowedResolutions': Object["freeze"](['2K', '4K']),
  'defaultResolution': '2K',
  'maxBatchSize': 0x4,
  'preserveAdaptiveInputRatio': !![]
});
const VOLCENGINE_SEEDREAM_4_POLICY = Object["freeze"]({
  'allowedResolutions': Object["freeze"](['1K', '2K', '4K']),
  'defaultResolution': '2K',
  'maxBatchSize': 0x4,
  'preserveAdaptiveInputRatio': !![]
});
const VOLCENGINE_SEEDREAM_INPUT_SLOTS = Object["freeze"]({
  'allowedKinds': Object["freeze"](['text', "image"]),
  'minByKind': Object["freeze"]({
    'image': 0x0
  }),
  'maxByKind': Object["freeze"]({
    'image': 0xe,
    'video': 0x0,
    'audio': 0x0
  })
});
const VOLCENGINE_SEEDREAM_5_PRO_INPUT_SLOTS = Object["freeze"]({
  'allowedKinds': Object["freeze"](["text", 'image']),
  'minByKind': Object["freeze"]({
    'image': 0x0
  }),
  'maxByKind': Object["freeze"]({
    'image': 0xa,
    'video': 0x0,
    'audio': 0x0
  })
});
const VOLCENGINE_IMAGE_INPUT_UPLOAD_POLICY = Object["freeze"]({
  'provider': "freeImageHost",
  'inputKinds': Object['freeze'](["image"]),
  'applyInputQualityProfile': !![],
  'strictUpload': !![]
});
const VOLCENGINE_SEEDREAM_SINGLE_IMAGE_BODY_MAPPING = Object["freeze"]([Object["freeze"]({
  'path': "model",
  'from': "model"
}), Object["freeze"]({
  'path': "prompt",
  'from': "prompt"
}), Object["freeze"]({
  'path': "size",
  'from': "param",
  'field': Object["freeze"](["resolvedRatioLabel", "aspectRatio"]),
  'transform': "volcengineSeedreamSize"
}), Object["freeze"]({
  'path': "response_format",
  'from': "constant",
  'value': "url"
}), Object['freeze']({
  'path': "watermark",
  'from': "constant",
  'value': ![]
}), Object['freeze']({
  'path': "image",
  'from': "inputImages",
  'omitWhenEmpty': !![]
})]);
const VOLCENGINE_SEEDREAM_BODY_MAPPING = Object["freeze"]([...VOLCENGINE_SEEDREAM_SINGLE_IMAGE_BODY_MAPPING, Object["freeze"]({
  'path': "sequential_image_generation",
  'from': "param",
  'field': "batchSize",
  'defaultValue': 0x1,
  'transform': 'volcengineSeedreamSequentialMode'
}), Object["freeze"]({
  'path': "sequential_image_generation_options.max_images",
  'from': 'param',
  'field': "batchSize",
  'defaultValue': 0x1,
  'transform': 'volcengineSeedreamImageCount',
  'omitWhenEmpty': !![]
})]);
function createImageMenuExtension(_0x3d2bed) {
  return Object["freeze"]({
    'imageMenu': Object['freeze'](_0x3d2bed)
  });
}
export const volcengineImageModelApiModelManifests = Object['freeze']([createImageModelApiManifest({
  'modelId': VOLCENGINE_SEEDREAM_5_PRO_MODEL_ID,
  'executionId': VOLCENGINE_SEEDREAM_5_PRO_EXECUTION_ID,
  'provider': "volcengine",
  'displayName': "Seedream 5.0 Pro",
  'icon': "images/volcengine.svg",
  'description': "Volcengine Ark Seedream image generation API",
  'inputSlots': VOLCENGINE_SEEDREAM_5_PRO_INPUT_SLOTS,
  'fields': [VOLCENGINE_SEEDREAM_5_PRO_IMAGE_SIZE_FIELD, APIMART_SEEDREAM_5_LITE_RATIO_FIELD, BATCH_SIZE_FIELD],
  'extensions': createImageMenuExtension({
    'group': "volcengine",
    'order': 0x5,
    'title': "Seedream 5.0 Pro",
    'subtitle': "火山方舟专业生图，支持 1K/2K 单图输出",
    'iconAlt': "volcengine",
    'gap': 0x9
  })
}), createImageModelApiManifest({
  'modelId': VOLCENGINE_SEEDREAM_5_MODEL_ID,
  'executionId': VOLCENGINE_SEEDREAM_5_EXECUTION_ID,
  'provider': "volcengine",
  'displayName': "Seedream 5.0",
  'icon': "images/volcengine.svg",
  'description': 'Volcengine\x20Ark\x20Seedream\x20image\x20generation\x20API',
  'inputSlots': VOLCENGINE_SEEDREAM_INPUT_SLOTS,
  'fields': [APIMART_SEEDREAM_5_LITE_IMAGE_SIZE_FIELD, APIMART_SEEDREAM_5_LITE_RATIO_FIELD, BATCH_SIZE_FIELD],
  'extensions': createImageMenuExtension({
    'group': "volcengine",
    'order': 0xa,
    'title': "Seedream 5.0",
    'subtitle': '火山方舟原生生图，支持\x202K/3K\x20输出',
    'iconAlt': "volcengine",
    'gap': 0x9
  })
}), createImageModelApiManifest({
  'modelId': VOLCENGINE_SEEDREAM_4_5_MODEL_ID,
  'executionId': VOLCENGINE_SEEDREAM_4_5_EXECUTION_ID,
  'provider': "volcengine",
  'displayName': "Seedream 4.5",
  'icon': 'images/volcengine.svg',
  'description': "Volcengine Ark Seedream image generation API",
  'inputSlots': VOLCENGINE_SEEDREAM_INPUT_SLOTS,
  'fields': [APIMART_SEEDREAM_4_5_IMAGE_SIZE_FIELD, APIMART_SEEDREAM_RATIO_FIELD, BATCH_SIZE_FIELD],
  'extensions': createImageMenuExtension({
    'group': "volcengine",
    'order': 0x14,
    'title': "Seedream 4.5",
    'subtitle': "高画质图像生成与多图参考",
    'iconAlt': "volcengine",
    'gap': 0x9
  })
}), createImageModelApiManifest({
  'modelId': VOLCENGINE_SEEDREAM_4_MODEL_ID,
  'executionId': VOLCENGINE_SEEDREAM_4_EXECUTION_ID,
  'provider': 'volcengine',
  'displayName': "Seedream 4.0",
  'icon': "images/volcengine.svg",
  'description': "Volcengine Ark Seedream image generation API",
  'inputSlots': VOLCENGINE_SEEDREAM_INPUT_SLOTS,
  'fields': [APIMART_SEEDREAM_4_IMAGE_SIZE_FIELD, APIMART_SEEDREAM_RATIO_FIELD, BATCH_SIZE_FIELD],
  'extensions': createImageMenuExtension({
    'group': "volcengine",
    'order': 0x1e,
    'title': "Seedream 4.0",
    'subtitle': "经典 Seedream 生图，支持 1K/2K/4K",
    'iconAlt': "volcengine",
    'gap': 0xa
  })
})]);
export const volcengineImageModelApiExecutionManifests = Object['freeze']([createModelApiExecutionManifest({
  'id': VOLCENGINE_SEEDREAM_5_PRO_EXECUTION_ID,
  'provider': "volcengine",
  'model': "doubao-seedream-5-0-pro-260628",
  'endpoint': "/images/generations",
  'bodyMapping': VOLCENGINE_SEEDREAM_SINGLE_IMAGE_BODY_MAPPING,
  'responseMapping': VOLCENGINE_IMAGE_RESPONSE_MAPPING,
  'extensions': Object["freeze"]({
    'volcengineSeedream': VOLCENGINE_SEEDREAM_5_PRO_POLICY,
    'imageInputUpload': VOLCENGINE_IMAGE_INPUT_UPLOAD_POLICY
  })
}), createModelApiExecutionManifest({
  'id': VOLCENGINE_SEEDREAM_5_EXECUTION_ID,
  'provider': "volcengine",
  'model': "doubao-seedream-5-0-260128",
  'endpoint': "/images/generations",
  'bodyMapping': VOLCENGINE_SEEDREAM_BODY_MAPPING,
  'responseMapping': VOLCENGINE_IMAGE_RESPONSE_MAPPING,
  'extensions': Object["freeze"]({
    'volcengineSeedream': VOLCENGINE_SEEDREAM_5_POLICY,
    'imageInputUpload': VOLCENGINE_IMAGE_INPUT_UPLOAD_POLICY
  })
}), createModelApiExecutionManifest({
  'id': VOLCENGINE_SEEDREAM_4_5_EXECUTION_ID,
  'provider': "volcengine",
  'model': "doubao-seedream-4-5-251128",
  'endpoint': "/images/generations",
  'bodyMapping': VOLCENGINE_SEEDREAM_BODY_MAPPING,
  'responseMapping': VOLCENGINE_IMAGE_RESPONSE_MAPPING,
  'extensions': Object["freeze"]({
    'volcengineSeedream': VOLCENGINE_SEEDREAM_4_5_POLICY,
    'imageInputUpload': VOLCENGINE_IMAGE_INPUT_UPLOAD_POLICY
  })
}), createModelApiExecutionManifest({
  'id': VOLCENGINE_SEEDREAM_4_EXECUTION_ID,
  'provider': 'volcengine',
  'model': "doubao-seedream-4-0-250828",
  'endpoint': "/images/generations",
  'bodyMapping': VOLCENGINE_SEEDREAM_BODY_MAPPING,
  'responseMapping': VOLCENGINE_IMAGE_RESPONSE_MAPPING,
  'extensions': Object['freeze']({
    'volcengineSeedream': VOLCENGINE_SEEDREAM_4_POLICY,
    'imageInputUpload': VOLCENGINE_IMAGE_INPUT_UPLOAD_POLICY
  })
})]);