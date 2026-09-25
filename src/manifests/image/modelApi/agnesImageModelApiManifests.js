import { APIMART_NANO_BANANA_IMAGE_SIZE_FIELD, APIMART_QWEN_IMAGE_RATIO_FIELD, createImageModelApiManifest, createModelApiExecutionManifest } from './sharedImageModelApiFields.js';
import { AGNES_MODEL_API_PROFILE_IDS } from '../../../modules/agnesProviderProfiles.js';
export const AGNES_IMAGE_SIZE_FIELD = Object["freeze"]({
  'id': 'imageSize',
  'type': 'segmented',
  'placement': 'resolution',
  'label': 'Quality',
  'defaultValue': '1K',
  'options': Object["freeze"]([Object['freeze']({
    'value': '1K',
    'label': '1K'
  }), Object["freeze"]({
    'value': '2K',
    'label': '2K'
  }), Object["freeze"]({
    'value': '3K',
    'label': '3K'
  }), Object["freeze"]({
    'value': '4K',
    'label': '4K'
  })])
});
const AGNES_IMAGE_INPUT_SLOTS = Object['freeze']({
  'allowedKinds': Object["freeze"](["text", 'image']),
  'minByKind': Object["freeze"]({
    'text': 0x0,
    'image': 0x0
  }),
  'maxByKind': Object["freeze"]({
    'image': 0x8,
    'video': 0x0,
    'audio': 0x0
  })
});
const AGNES_IMAGE_20_BODY_MAPPING = Object["freeze"]([Object['freeze']({
  'path': 'model',
  'from': 'model'
}), Object["freeze"]({
  'path': "prompt",
  'from': "prompt"
}), Object["freeze"]({
  'path': 'size',
  'from': "param",
  'field': Object['freeze'](["generationParams.aspectRatio", "resolvedRatioLabel", 'aspectRatio']),
  'defaultValue': "4:3",
  'transform': 'agnesImageSize'
}), Object["freeze"]({
  'path': "extra_body.image",
  'from': "inputImages",
  'omitWhenEmpty': !![]
})]);
const AGNES_IMAGE_TIERED_BODY_MAPPING = Object["freeze"]([Object["freeze"]({
  'path': "model",
  'from': "model"
}), Object["freeze"]({
  'path': 'prompt',
  'from': "prompt"
}), Object["freeze"]({
  'path': "size",
  'from': "param",
  'field': Object['freeze'](["generationParams.imageSize", 'imageSize', "resolution"]),
  'defaultValue': '1K'
}), Object['freeze']({
  'path': 'ratio',
  'from': "param",
  'field': Object["freeze"](["generationParams.aspectRatio", 'resolvedRatioLabel', "aspectRatio"]),
  'defaultValue': '1:1'
}), Object["freeze"]({
  'path': "extra_body.image",
  'from': "inputImages",
  'omitWhenEmpty': !![]
})]);
const AGNES_IMAGE_RESPONSE_MAPPING = Object["freeze"]({
  'statusPath': "status",
  'errorPath': Object['freeze'](["error.message", "message", "error"]),
  'resultPaths': Object["freeze"](["data[].url", "data.url", "results[].url", "results[].imageUrl", "url"]),
  'base64Paths': Object["freeze"](["data[].b64_json"]),
  'base64DefaultMimeType': "image/png"
});
export const AGNES_IMAGE_RATIO_FIELD = Object["freeze"]({
  'id': "aspectRatio",
  'type': "segmented",
  'placement': "resolution",
  'label': 'Ratio',
  'defaultValue': '1:1',
  'options': Object["freeze"]([Object['freeze']({
    'value': "1:1",
    'label': "1:1"
  }), Object['freeze']({
    'value': "3:4",
    'label': '3:4'
  }), Object["freeze"]({
    'value': "4:3",
    'label': '4:3'
  }), Object["freeze"]({
    'value': "16:9",
    'label': "16:9"
  }), Object['freeze']({
    'value': '9:16',
    'label': "9:16"
  }), Object["freeze"]({
    'value': "2:3",
    'label': "2:3"
  }), Object["freeze"]({
    'value': '3:2',
    'label': "3:2"
  }), Object["freeze"]({
    'value': '21:9',
    'label': "21:9"
  })])
});
const AGNES_IMAGE_MODELS = Object["freeze"]([Object["freeze"]({
  'modelId': 'agnes/agnes-image-2.0-flash',
  'executionId': "agnes.model-api.image.agnes-image-2-flash.v1",
  'displayName': "Agnes Image 2.0 Flash",
  'model': "agnes-image-2.0-flash",
  'description': 'Agnes\x20AI\x20text-to-image\x20and\x20image-to-image\x20model\x20API',
  'inputSlots': AGNES_IMAGE_INPUT_SLOTS,
  'bodyMapping': AGNES_IMAGE_20_BODY_MAPPING,
  'imageSizeField': APIMART_NANO_BANANA_IMAGE_SIZE_FIELD,
  'imageRatioField': APIMART_QWEN_IMAGE_RATIO_FIELD,
  'order': 0xa
}), Object["freeze"]({
  'modelId': "agnes/agnes-image-2.1-flash",
  'executionId': 'agnes.model-api.image.agnes-image-2-1-flash.v1',
  'displayName': 'Agnes\x20Image\x202.1\x20Flash',
  'model': 'agnes-image-2.1-flash',
  'description': "Agnes AI text-to-image and image-to-image model API",
  'inputSlots': AGNES_IMAGE_INPUT_SLOTS,
  'bodyMapping': AGNES_IMAGE_TIERED_BODY_MAPPING,
  'imageSizeField': AGNES_IMAGE_SIZE_FIELD,
  'imageRatioField': AGNES_IMAGE_RATIO_FIELD,
  'order': 0x14
}), Object['freeze']({
  'modelId': "agnes/agnes-image-2.5-flash",
  'executionId': "agnes.model-api.image.agnes-image-2-5-flash.v1",
  'displayName': "Agnes Image 2.5 Flash",
  'model': 'agnes-image-2.5-flash',
  'description': "Agnes AI latest-generation image generation and editing model API",
  'inputSlots': AGNES_IMAGE_INPUT_SLOTS,
  'bodyMapping': AGNES_IMAGE_TIERED_BODY_MAPPING,
  'imageSizeField': AGNES_IMAGE_SIZE_FIELD,
  'imageRatioField': AGNES_IMAGE_RATIO_FIELD,
  'order': 0x1e
})]);
export const agnesImageModelApiModelManifests = Object['freeze'](AGNES_IMAGE_MODELS['map'](_0x3d3f2f => createImageModelApiManifest({
  'modelId': _0x3d3f2f["modelId"],
  'executionId': _0x3d3f2f['executionId'],
  'provider': 'agnes',
  'displayName': _0x3d3f2f["displayName"],
  'icon': 'AG',
  'description': _0x3d3f2f["description"],
  'fields': Object["freeze"]([_0x3d3f2f["imageSizeField"], _0x3d3f2f["imageRatioField"]]),
  'inputSlots': _0x3d3f2f["inputSlots"],
  'extensions': Object["freeze"]({
    'providerProfiles': AGNES_MODEL_API_PROFILE_IDS,
    'imageMenu': Object["freeze"]({
      'group': "agnes",
      'order': _0x3d3f2f["order"],
      'title': _0x3d3f2f["displayName"],
      'subtitle': _0x3d3f2f["description"],
      'iconKind': "agnesBadge"
    })
  })
})));
export const agnesImageModelApiExecutionManifests = Object["freeze"](AGNES_IMAGE_MODELS['map'](_0x37f68b => createModelApiExecutionManifest({
  'id': _0x37f68b['executionId'],
  'provider': 'agnes',
  'model': _0x37f68b["model"],
  'endpoint': '/v1/images/generations',
  'endpointMode': "image-generation",
  'bodyMapping': _0x37f68b['bodyMapping'],
  'responseMapping': AGNES_IMAGE_RESPONSE_MAPPING,
  'extensions': Object['freeze']({
    'bodyResolver': 'agnesImage',
    'resolverOwnsInputs': !![]
  })
})));