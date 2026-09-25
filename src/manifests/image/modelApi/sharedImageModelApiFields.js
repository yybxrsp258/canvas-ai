export const IMAGE_SIZE_FIELD = Object["freeze"]({
  'id': "imageSize",
  'type': "segmented",
  'placement': "resolution",
  'label': 'Quality',
  'defaultValue': '2K',
  'options': Object["freeze"]([Object["freeze"]({
    'value': '1K',
    'label': '1K'
  }), Object["freeze"]({
    'value': '2K',
    'label': '2K'
  }), Object["freeze"]({
    'value': '3K',
    'label': '3K'
  }), Object['freeze']({
    'value': '4K',
    'label': '4K'
  })])
});
export const APIMART_SEEDREAM_IMAGE_SIZE_FIELD = Object["freeze"]({
  ...IMAGE_SIZE_FIELD,
  'options': Object["freeze"]([Object["freeze"]({
    'value': '2K',
    'label': '2K'
  }), Object["freeze"]({
    'value': '3K',
    'label': '3K'
  })])
});
export const APIMART_SEEDREAM_4_IMAGE_SIZE_FIELD = Object["freeze"]({
  ...IMAGE_SIZE_FIELD,
  'options': Object["freeze"]([Object["freeze"]({
    'value': '1K',
    'label': '1K'
  }), Object["freeze"]({
    'value': '2K',
    'label': '2K'
  }), Object["freeze"]({
    'value': '4K',
    'label': '4K'
  })])
});
export const APIMART_SEEDREAM_4_5_IMAGE_SIZE_FIELD = Object['freeze']({
  ...IMAGE_SIZE_FIELD,
  'options': Object["freeze"]([Object["freeze"]({
    'value': '2K',
    'label': '2K'
  }), Object["freeze"]({
    'value': '4K',
    'label': '4K'
  })])
});
export const APIMART_SEEDREAM_5_LITE_IMAGE_SIZE_FIELD = APIMART_SEEDREAM_IMAGE_SIZE_FIELD;
export const APIMART_SEEDREAM_5_PRO_IMAGE_SIZE_FIELD = Object["freeze"]({
  ...IMAGE_SIZE_FIELD,
  'defaultValue': '2K',
  'options': Object["freeze"]([Object["freeze"]({
    'value': '1K',
    'label': '1K'
  }), Object["freeze"]({
    'value': '2K',
    'label': '2K'
  })])
});
export const GPT_IMAGE_2_IMAGE_SIZE_FIELD = Object["freeze"]({
  ...IMAGE_SIZE_FIELD,
  'options': Object["freeze"]([Object["freeze"]({
    'value': '1K',
    'label': '1K'
  }), Object["freeze"]({
    'value': '2K',
    'label': '2K'
  }), Object["freeze"]({
    'value': '4K',
    'label': '4K'
  })])
});
export const APIMART_NANO_BANANA_2_MODE_FIELD = Object['freeze']({
  'id': 'mode',
  'type': "segmented",
  'placement': "mode",
  'label': "Mode",
  'menuTitle': "模式选择",
  'defaultValue': "standard",
  'options': Object['freeze']([Object["freeze"]({
    'value': 'standard',
    'label': "标准版",
    'selectedLabel': "标准版"
  }), Object["freeze"]({
    'value': "official",
    'label': "官方版",
    'selectedLabel': '官方版'
  })])
});
export const APIMART_NANO_BANANA_2_IMAGE_SIZE_FIELD = Object["freeze"]({
  ...IMAGE_SIZE_FIELD,
  'options': Object["freeze"]([Object["freeze"]({
    'value': '1K',
    'label': '1K'
  }), Object['freeze']({
    'value': '2K',
    'label': '2K'
  }), Object["freeze"]({
    'value': '4K',
    'label': '4K'
  })])
});
export const APIMART_NANO_BANANA_PRO_MODE_FIELD = APIMART_NANO_BANANA_2_MODE_FIELD;
export const APIMART_NANO_BANANA_PRO_IMAGE_SIZE_FIELD = APIMART_NANO_BANANA_2_IMAGE_SIZE_FIELD;
export const APIMART_NANO_BANANA_MODE_FIELD = APIMART_NANO_BANANA_2_MODE_FIELD;
export const APIMART_NANO_BANANA_IMAGE_SIZE_FIELD = Object['freeze']({
  ...IMAGE_SIZE_FIELD,
  'defaultValue': '1K',
  'options': Object["freeze"]([Object["freeze"]({
    'value': '1K',
    'label': '1K'
  })])
});
export const APIMART_GPT_IMAGE_2_MODE_FIELD = APIMART_NANO_BANANA_2_MODE_FIELD;
export const APIMART_GPT_IMAGE_2_IMAGE_SIZE_FIELD = Object["freeze"]({
  ...GPT_IMAGE_2_IMAGE_SIZE_FIELD,
  'defaultValue': '1K'
});
const APIMART_GPT_IMAGE_2_QUALITY_DESCRIPTION = 'quality\x0a图片质量\x0alow\x20-\x20快速省钱，轮廓够用\x0amedium\x20-\x20平衡\x0ahigh\x20-\x20最高精度（4K\x20+\x20high\x20耗时\x20>120s）';
export const APIMART_GPT_IMAGE_2_QUALITY_FIELD = Object["freeze"]({
  'id': "quality",
  'type': "segmented",
  'placement': "resolution",
  'variant': "pillMenu",
  'standaloneInResolution': !![],
  'label': '质量',
  'defaultValue': 'medium',
  'showWhen': Object["freeze"]({
    'field': "mode",
    'value': "official"
  }),
  'showMenuTitle': !![],
  'showInfoTip': !![],
  'menuTooltip': APIMART_GPT_IMAGE_2_QUALITY_DESCRIPTION,
  'description': APIMART_GPT_IMAGE_2_QUALITY_DESCRIPTION,
  'options': Object['freeze']([Object['freeze']({
    'value': 'low',
    'label': '低'
  }), Object["freeze"]({
    'value': "medium",
    'label': '中'
  }), Object['freeze']({
    'value': 'high',
    'label': '高'
  })])
});
export const APIMART_QWEN_IMAGE_MODE_FIELD = Object['freeze']({
  'id': "mode",
  'type': 'segmented',
  'placement': "mode",
  'label': "Mode",
  'menuTitle': '模式选择',
  'defaultValue': 'standard',
  'options': Object["freeze"]([Object['freeze']({
    'value': 'standard',
    'label': "标准版",
    'selectedLabel': "标准版"
  }), Object["freeze"]({
    'value': "pro",
    'label': "Pro版",
    'selectedLabel': "Pro版"
  })])
});
export const APIMART_QWEN_IMAGE_SIZE_FIELD = Object["freeze"]({
  ...IMAGE_SIZE_FIELD,
  'defaultValue': '1K',
  'options': Object["freeze"]([Object['freeze']({
    'value': '1K',
    'label': '1K'
  }), Object['freeze']({
    'value': '2K',
    'label': '2K'
  })])
});
export const APIMART_QWEN_IMAGE_RATIO_FIELD = Object["freeze"]({
  'id': "aspectRatio",
  'type': "segmented",
  'placement': "resolution",
  'label': 'Ratio',
  'defaultValue': "自适应",
  'options': Object['freeze']([Object["freeze"]({
    'value': "自适应",
    'label': "Auto",
    'selectedLabel': "自适应"
  }), Object['freeze']({
    'value': "1:1",
    'label': "1:1"
  }), Object["freeze"]({
    'value': "4:3",
    'label': "4:3"
  }), Object["freeze"]({
    'value': "3:4",
    'label': '3:4'
  }), Object["freeze"]({
    'value': "16:9",
    'label': "16:9"
  }), Object['freeze']({
    'value': "9:16",
    'label': "9:16"
  }), Object['freeze']({
    'value': "3:2",
    'label': '3:2'
  }), Object["freeze"]({
    'value': "2:3",
    'label': '2:3'
  })])
});
export const APIMART_Z_IMAGE_TURBO_IMAGE_SIZE_FIELD = APIMART_QWEN_IMAGE_SIZE_FIELD;
export const APIMART_Z_IMAGE_TURBO_RATIO_FIELD = APIMART_QWEN_IMAGE_RATIO_FIELD;
export const APIMART_Z_IMAGE_TURBO_PROMPT_EXTEND_FIELD = Object["freeze"]({
  'id': "prompt_extend",
  'type': "toggle",
  'placement': "advanced",
  'label': "智能改写提示词",
  'description': "开启后，AI 会自动优化提示词，生成效果更好，费用会有所增加。",
  'defaultValue': ![]
});
export const APIMART_WAN_IMAGE_MODE_FIELD = Object["freeze"]({
  'id': "mode",
  'type': 'segmented',
  'placement': 'mode',
  'label': "Mode",
  'menuTitle': "模式选择",
  'defaultValue': "standard",
  'options': Object["freeze"]([Object['freeze']({
    'value': "standard",
    'label': "标准版",
    'selectedLabel': "标准版"
  }), Object["freeze"]({
    'value': "pro",
    'label': "专业版",
    'selectedLabel': "专业版"
  })])
});
const APIMART_WAN_4K_DISABLE = Object["freeze"]({
  'any': Object['freeze']([Object["freeze"]({
    'field': "mode",
    'values': Object["freeze"](["standard"])
  }), Object["freeze"]({
    'field': 'hasInputImages',
    'values': Object["freeze"]([!![]])
  })])
});
export const APIMART_WAN_IMAGE_SIZE_FIELD = Object["freeze"]({
  ...IMAGE_SIZE_FIELD,
  'defaultValue': '2K',
  'options': Object['freeze']([Object["freeze"]({
    'value': '1K',
    'label': '1K'
  }), Object["freeze"]({
    'value': '2K',
    'label': '2K'
  }), Object['freeze']({
    'value': '4K',
    'label': '4K',
    'disableWhen': APIMART_WAN_4K_DISABLE,
    'tooltip': '4K\x20only\x20supports\x20pro\x20text-to-image'
  })])
});
export const APIMART_WAN_IMAGE_RATIO_FIELD = APIMART_QWEN_IMAGE_RATIO_FIELD;
export const APIMART_WAN_THINKING_MODE_FIELD = Object["freeze"]({
  'id': "thinking_mode",
  'type': "toggle",
  'placement': 'advanced',
  'label': "思考模式",
  'description': '开启后模型增强推理能力，提升画面质量，但耗时增加。',
  'defaultValue': !![]
});
export const APIMART_GPT_IMAGE_2_RATIO_FIELD = Object["freeze"]({
  'id': "aspectRatio",
  'type': "segmented",
  'placement': "resolution",
  'label': "Ratio",
  'defaultValue': "自适应",
  'options': Object['freeze']([Object["freeze"]({
    'value': '自适应',
    'label': "Auto"
  }), Object["freeze"]({
    'value': "1:1",
    'label': "1:1"
  }), Object["freeze"]({
    'value': '3:2',
    'label': '3:2'
  }), Object["freeze"]({
    'value': '2:3',
    'label': "2:3"
  }), Object["freeze"]({
    'value': "4:3",
    'label': "4:3"
  }), Object['freeze']({
    'value': "3:4",
    'label': '3:4'
  }), Object['freeze']({
    'value': '5:4',
    'label': '5:4'
  }), Object["freeze"]({
    'value': "4:5",
    'label': "4:5"
  }), Object["freeze"]({
    'value': '16:9',
    'label': "16:9"
  }), Object["freeze"]({
    'value': '9:16',
    'label': "9:16"
  }), Object['freeze']({
    'value': "2:1",
    'label': "2:1"
  }), Object["freeze"]({
    'value': '1:2',
    'label': "1:2"
  }), Object["freeze"]({
    'value': '21:9',
    'label': "21:9"
  }), Object['freeze']({
    'value': "9:21",
    'label': "9:21"
  }), Object["freeze"]({
    'value': '3:1',
    'label': "3:1"
  }), Object["freeze"]({
    'value': "1:3",
    'label': "1:3"
  })])
});
export const APIMART_NANO_BANANA_2_GOOGLE_SEARCH_FIELD = Object["freeze"]({
  'id': "google_search",
  'type': "toggle",
  'placement': "advanced",
  'label': 'Google\x20文字搜索',
  'description': "启用 Google 文字搜索增强，适合需要真实信息的场景。",
  'defaultValue': ![]
});
export const APIMART_NANO_BANANA_2_GOOGLE_IMAGE_SEARCH_FIELD = Object["freeze"]({
  'id': "google_image_search",
  'type': "toggle",
  'placement': 'advanced',
  'label': "Google 图片搜索",
  'description': "启用 Google 图片搜索增强，需要同时开启 Google 文字搜索。",
  'defaultValue': ![]
});
export const GRSAI_GPT_IMAGE_2_MODE_FIELD = Object["freeze"]({
  'id': "mode",
  'type': 'segmented',
  'placement': "mode",
  'label': "Mode",
  'menuTitle': "模式选择",
  'defaultValue': 'normal',
  'options': Object['freeze']([Object["freeze"]({
    'value': "normal",
    'label': '常规',
    'selectedLabel': '常规'
  }), Object["freeze"]({
    'value': "vip",
    'label': "VIP",
    'selectedLabel': 'VIP'
  })])
});
export const GRSAI_GPT_IMAGE_2_IMAGE_SIZE_FIELD = Object["freeze"]({
  ...GPT_IMAGE_2_IMAGE_SIZE_FIELD,
  'defaultValue': '1K',
  'options': Object["freeze"]([Object["freeze"]({
    'value': '1K',
    'label': '1K'
  }), Object['freeze']({
    'value': '2K',
    'label': '2K',
    'disableWhen': Object["freeze"]({
      'field': "mode",
      'values': ["normal"]
    }),
    'tooltip': "VIP"
  }), Object["freeze"]({
    'value': '4K',
    'label': '4K',
    'disableWhen': Object['freeze']({
      'field': "mode",
      'values': ['normal']
    }),
    'tooltip': "VIP"
  })])
});
export const GRSAI_NANO_BANANA_IMAGE_SIZE_FIELD = Object["freeze"]({
  ...IMAGE_SIZE_FIELD,
  'options': Object["freeze"]([Object["freeze"]({
    'value': '1K',
    'label': '1K'
  }), Object["freeze"]({
    'value': '2K',
    'label': '2K'
  }), Object["freeze"]({
    'value': '4K',
    'label': '4K',
    'disabled': !![],
    'tooltip': "1K/2K only"
  })])
});
export const GRSAI_NANO_BANANA_1K_IMAGE_SIZE_FIELD = Object["freeze"]({
  ...IMAGE_SIZE_FIELD,
  'defaultValue': '1K',
  'options': Object["freeze"]([Object['freeze']({
    'value': '1K',
    'label': '1K'
  }), Object["freeze"]({
    'value': '2K',
    'label': '2K',
    'disabled': !![],
    'tooltip': "1K only"
  }), Object["freeze"]({
    'value': '4K',
    'label': '4K',
    'disabled': !![],
    'tooltip': '1K\x20only'
  })])
});
export const GRSAI_NANO_BANANA_2K_IMAGE_SIZE_FIELD = Object['freeze']({
  ...IMAGE_SIZE_FIELD,
  'defaultValue': '2K',
  'options': Object["freeze"]([Object["freeze"]({
    'value': '1K',
    'label': '1K',
    'disabled': !![],
    'tooltip': '2K\x20only'
  }), Object['freeze']({
    'value': '2K',
    'label': '2K'
  }), Object["freeze"]({
    'value': '4K',
    'label': '4K',
    'disabled': !![],
    'tooltip': "2K only"
  })])
});
export const GRSAI_NANO_BANANA_2_IMAGE_SIZE_FIELD = Object["freeze"]({
  ...IMAGE_SIZE_FIELD,
  'options': Object["freeze"]([Object["freeze"]({
    'value': '1K',
    'label': '1K'
  }), Object["freeze"]({
    'value': '2K',
    'label': '2K'
  }), Object["freeze"]({
    'value': '4K',
    'label': '4K'
  })])
});
export const GRSAI_NANO_BANANA_PRO_IMAGE_SIZE_FIELD = Object["freeze"]({
  ...IMAGE_SIZE_FIELD,
  'options': Object['freeze']([Object["freeze"]({
    'value': '1K',
    'label': '1K'
  }), Object['freeze']({
    'value': '2K',
    'label': '2K',
    'disableWhen': Object["freeze"]({
      'field': "mode",
      'values': ['cl']
    }),
    'tooltip': "CL supports 1K only"
  }), Object["freeze"]({
    'value': '4K',
    'label': '4K',
    'disableWhen': Object["freeze"]({
      'field': "mode",
      'values': ['cl']
    }),
    'tooltip': 'CL\x20supports\x201K\x20only'
  })])
});
export const GRSAI_NANO_BANANA_4K_IMAGE_SIZE_FIELD = Object["freeze"]({
  ...IMAGE_SIZE_FIELD,
  'defaultValue': '4K',
  'options': Object['freeze']([Object["freeze"]({
    'value': '1K',
    'label': '1K',
    'disabled': !![],
    'tooltip': "4K only"
  }), Object["freeze"]({
    'value': '2K',
    'label': '2K',
    'disabled': !![],
    'tooltip': '4K\x20only'
  }), Object['freeze']({
    'value': '4K',
    'label': '4K'
  })])
});
export const RUNNINGHUB_GPT_IMAGE_2_OFFICIAL_IMAGE_SIZE_FIELD = Object["freeze"]({
  ...IMAGE_SIZE_FIELD,
  'options': Object["freeze"]([Object['freeze']({
    'value': '1K',
    'label': '1K'
  }), Object['freeze']({
    'value': '2K',
    'label': '2K'
  }), Object["freeze"]({
    'value': '4K',
    'label': '4K'
  })])
});
export const ASPECT_RATIO_FIELD = Object["freeze"]({
  'id': "aspectRatio",
  'type': "segmented",
  'placement': "resolution",
  'label': "Ratio",
  'defaultValue': '自适应',
  'options': Object["freeze"]([Object["freeze"]({
    'value': '自适应',
    'label': "Auto"
  }), Object["freeze"]({
    'value': '1:1',
    'label': "1:1"
  }), Object["freeze"]({
    'value': "9:16",
    'label': '9:16'
  }), Object["freeze"]({
    'value': "16:9",
    'label': "16:9"
  }), Object['freeze']({
    'value': "3:4",
    'label': "3:4"
  }), Object["freeze"]({
    'value': "4:3",
    'label': "4:3"
  }), Object['freeze']({
    'value': "3:2",
    'label': "3:2"
  }), Object["freeze"]({
    'value': "2:3",
    'label': "2:3"
  }), Object["freeze"]({
    'value': "5:4",
    'label': "5:4"
  }), Object["freeze"]({
    'value': "4:5",
    'label': "4:5"
  }), Object["freeze"]({
    'value': '21:9',
    'label': "21:9"
  })])
});
export const APIMART_SEEDREAM_RATIO_FIELD = Object['freeze']({
  ...ASPECT_RATIO_FIELD,
  'defaultValue': "auto",
  'options': Object["freeze"]([Object["freeze"]({
    'value': '1:1',
    'label': "1:1"
  }), Object["freeze"]({
    'value': "4:3",
    'label': "4:3"
  }), Object["freeze"]({
    'value': "3:4",
    'label': "3:4"
  }), Object['freeze']({
    'value': "16:9",
    'label': "16:9"
  }), Object["freeze"]({
    'value': "9:16",
    'label': "9:16"
  }), Object["freeze"]({
    'value': "3:2",
    'label': "3:2"
  }), Object["freeze"]({
    'value': '2:3',
    'label': "2:3"
  }), Object["freeze"]({
    'value': '21:9',
    'label': "21:9"
  }), Object['freeze']({
    'value': "9:21",
    'label': "9:21"
  }), Object["freeze"]({
    'value': "auto",
    'label': "Auto",
    'selectedLabel': "自适应"
  })])
});
export const APIMART_SEEDREAM_5_LITE_RATIO_FIELD = Object['freeze']({
  ...APIMART_SEEDREAM_RATIO_FIELD,
  'options': Object['freeze'](APIMART_SEEDREAM_RATIO_FIELD["options"]["filter"](_0x5632d4 => String(_0x5632d4?.["value"] ?? _0x5632d4) !== "9:21"))
});
export const NANO_BANANA_2_RATIO_FIELD = Object["freeze"]({
  ...ASPECT_RATIO_FIELD,
  'options': Object['freeze']([...ASPECT_RATIO_FIELD["options"], Object["freeze"]({
    'value': "1:4",
    'label': "1:4"
  }), Object['freeze']({
    'value': "4:1",
    'label': "4:1"
  }), Object["freeze"]({
    'value': "1:8",
    'label': '1:8'
  }), Object["freeze"]({
    'value': "8:1",
    'label': "8:1"
  })])
});
export const GRSAI_NANO_BANANA_RATIO_FIELD = Object['freeze']({
  ...ASPECT_RATIO_FIELD,
  'defaultValue': 'auto',
  'options': Object["freeze"]([Object["freeze"]({
    'value': "auto",
    'label': "Auto",
    'selectedLabel': "自适应"
  }), Object["freeze"]({
    'value': "1:1",
    'label': "1:1"
  }), Object["freeze"]({
    'value': '16:9',
    'label': "16:9"
  }), Object["freeze"]({
    'value': "9:16",
    'label': "9:16"
  }), Object["freeze"]({
    'value': "4:3",
    'label': "4:3"
  }), Object["freeze"]({
    'value': "3:4",
    'label': "3:4"
  }), Object["freeze"]({
    'value': '3:2',
    'label': '3:2'
  }), Object["freeze"]({
    'value': '2:3',
    'label': "2:3"
  }), Object['freeze']({
    'value': "5:4",
    'label': "5:4"
  }), Object["freeze"]({
    'value': "4:5",
    'label': "4:5"
  }), Object['freeze']({
    'value': "21:9",
    'label': "21:9"
  })])
});
export const GRSAI_NANO_BANANA_2_RATIO_FIELD = Object["freeze"]({
  ...GRSAI_NANO_BANANA_RATIO_FIELD,
  'options': Object['freeze']([...GRSAI_NANO_BANANA_RATIO_FIELD["options"], Object["freeze"]({
    'value': "1:4",
    'label': "1:4"
  }), Object["freeze"]({
    'value': '4:1',
    'label': "4:1"
  }), Object['freeze']({
    'value': "1:8",
    'label': "1:8"
  }), Object["freeze"]({
    'value': "8:1",
    'label': "8:1"
  })])
});
export const GPT_IMAGE_2_RATIO_FIELD = Object['freeze']({
  ...ASPECT_RATIO_FIELD,
  'options': Object["freeze"]([Object['freeze']({
    'value': "自适应",
    'label': "Auto"
  }), Object["freeze"]({
    'value': '1:1',
    'label': "1:1"
  }), Object["freeze"]({
    'value': "3:2",
    'label': "3:2"
  }), Object['freeze']({
    'value': "2:3",
    'label': "2:3"
  }), Object["freeze"]({
    'value': "4:3",
    'label': '4:3'
  }), Object["freeze"]({
    'value': '3:4',
    'label': "3:4"
  }), Object['freeze']({
    'value': "5:4",
    'label': "5:4"
  }), Object["freeze"]({
    'value': "4:5",
    'label': '4:5'
  }), Object["freeze"]({
    'value': "16:9",
    'label': "16:9"
  }), Object["freeze"]({
    'value': "9:16",
    'label': '9:16'
  }), Object["freeze"]({
    'value': "2:1",
    'label': "2:1"
  }), Object["freeze"]({
    'value': "1:2",
    'label': "1:2"
  }), Object["freeze"]({
    'value': "21:9",
    'label': "21:9"
  }), Object["freeze"]({
    'value': "9:21",
    'label': "9:21"
  })])
});
export const GRSAI_GPT_IMAGE_2_RATIO_FIELD = Object["freeze"]({
  ...ASPECT_RATIO_FIELD,
  'defaultValue': "auto",
  'options': Object['freeze']([Object["freeze"]({
    'value': 'auto',
    'label': "Auto",
    'selectedLabel': "自适应"
  }), Object['freeze']({
    'value': "1:1",
    'label': "1:1"
  }), Object["freeze"]({
    'value': "16:9",
    'label': '16:9'
  }), Object["freeze"]({
    'value': "9:16",
    'label': '9:16'
  }), Object["freeze"]({
    'value': "4:3",
    'label': '4:3'
  }), Object["freeze"]({
    'value': '3:4',
    'label': "3:4"
  }), Object["freeze"]({
    'value': '3:2',
    'label': "3:2"
  }), Object['freeze']({
    'value': "2:3",
    'label': "2:3"
  }), Object["freeze"]({
    'value': "5:4",
    'label': "5:4"
  }), Object["freeze"]({
    'value': "4:5",
    'label': "4:5"
  }), Object['freeze']({
    'value': "21:9",
    'label': '21:9'
  }), Object["freeze"]({
    'value': '9:21',
    'label': "9:21"
  }), Object["freeze"]({
    'value': "1:3",
    'label': "1:3"
  }), Object["freeze"]({
    'value': "3:1",
    'label': '3:1'
  }), Object['freeze']({
    'value': "2:1",
    'label': "2:1"
  }), Object['freeze']({
    'value': "1:2",
    'label': "1:2"
  })])
});
export const MODE_NORMAL_FIELD = Object['freeze']({
  'id': "mode",
  'type': "segmented",
  'placement': 'mode',
  'label': 'Mode',
  'menuTitle': "模式选择",
  'defaultValue': "normal",
  'options': Object['freeze']([Object["freeze"]({
    'value': "normal",
    'label': '常规'
  })])
});
export const MODE_NORMAL_FAST_FIELD = Object['freeze']({
  ...MODE_NORMAL_FIELD,
  'options': Object["freeze"]([Object["freeze"]({
    'value': "normal",
    'label': '正常'
  }), Object["freeze"]({
    'value': "fast",
    'label': '快速'
  })])
});
export const MODE_NORMAL_CL_FIELD = Object['freeze']({
  ...MODE_NORMAL_FIELD,
  'options': Object['freeze']([Object["freeze"]({
    'value': "normal",
    'label': '常规'
  }), Object['freeze']({
    'value': 'cl',
    'label': 'CL'
  })])
});
export const MODE_CL_FIELD = Object['freeze']({
  ...MODE_NORMAL_FIELD,
  'defaultValue': 'cl',
  'options': Object["freeze"]([Object['freeze']({
    'value': 'cl',
    'label': 'CL'
  })])
});
export const MODE_VIP_FIELD = Object["freeze"]({
  ...MODE_NORMAL_FIELD,
  'defaultValue': "vip",
  'options': Object["freeze"]([Object["freeze"]({
    'value': "vip",
    'label': "VIP"
  })])
});
export const MODE_NORMAL_VT_CL_VIP_FIELD = Object["freeze"]({
  ...MODE_NORMAL_FIELD,
  'options': Object["freeze"]([Object['freeze']({
    'value': 'normal',
    'label': '常规'
  }), Object["freeze"]({
    'value': 'vt',
    'label': 'VT'
  }), Object["freeze"]({
    'value': 'cl',
    'label': 'CL'
  }), Object['freeze']({
    'value': "vip",
    'label': "VIP"
  })])
});
export const RUNNINGHUB_MODEL_ROUTE_FIELD = Object["freeze"]({
  'id': "rhModelRoute",
  'type': "segmented",
  'placement': "mode",
  'label': 'Route',
  'menuTitle': "模式选择",
  'defaultValue': 'low',
  'options': Object['freeze']([Object["freeze"]({
    'value': "low",
    'label': "低价版",
    'selectedLabel': "低价版"
  }), Object["freeze"]({
    'value': "official",
    'label': "官方版",
    'selectedLabel': "官方版"
  })])
});
export const BATCH_SIZE_FIELD = Object["freeze"]({
  'id': "batchSize",
  'type': "segmented",
  'placement': "batch",
  'label': "Batch",
  'menuTitle': "生成批次",
  'defaultValue': 0x1,
  'options': Object["freeze"]([Object["freeze"]({
    'value': 0x1,
    'label': '1x',
    'selectedLabel': '1x'
  }), Object["freeze"]({
    'value': 0x2,
    'label': '2x',
    'selectedLabel': '2x'
  }), Object["freeze"]({
    'value': 0x4,
    'label': '4x',
    'selectedLabel': '4x'
  })])
});
export const APIMART_QWEN_IMAGE_BATCH_SIZE_FIELD = Object["freeze"]({
  ...BATCH_SIZE_FIELD,
  'options': Object['freeze']([Object["freeze"]({
    'value': 0x1,
    'label': '1x',
    'selectedLabel': '1x'
  }), Object["freeze"]({
    'value': 0x2,
    'label': '2x',
    'selectedLabel': '2x'
  }), Object["freeze"]({
    'value': 0x4,
    'label': '4x',
    'selectedLabel': '4x'
  }), Object["freeze"]({
    'value': 0x6,
    'label': '6x',
    'selectedLabel': '6x'
  })])
});
export function withDefaultValue(_0x13a231, _0x59de6c) {
  return Object["freeze"]({
    ..._0x13a231,
    'defaultValue': _0x59de6c
  });
}
function freezeFields(_0x8ab58c) {
  return Object["freeze"](_0x8ab58c['map'](_0x400b53 => Object["freeze"](_0x400b53)));
}
const DEFAULT_IMAGE_MODEL_API_INPUT_SLOTS = Object["freeze"]({
  'allowedKinds': Object['freeze'](["text", 'image']),
  'minByKind': Object["freeze"]({
    'image': 0x0
  }),
  'maxByKind': Object["freeze"]({
    'image': 0x8,
    'video': 0x0,
    'audio': 0x0
  })
});
export const IMAGE_MODEL_API_10_IMAGE_INPUT_SLOTS = Object["freeze"]({
  'allowedKinds': Object["freeze"](['text', 'image']),
  'minByKind': Object['freeze']({
    'image': 0x0
  }),
  'maxByKind': Object['freeze']({
    'image': 0xa,
    'video': 0x0,
    'audio': 0x0
  })
});
export const IMAGE_MODEL_API_14_IMAGE_INPUT_SLOTS = Object["freeze"]({
  'allowedKinds': Object["freeze"](['text', "image"]),
  'minByKind': Object["freeze"]({
    'image': 0x0
  }),
  'maxByKind': Object['freeze']({
    'image': 0xe,
    'video': 0x0,
    'audio': 0x0
  })
});
export const IMAGE_MODEL_API_16_IMAGE_INPUT_SLOTS = Object["freeze"]({
  'allowedKinds': Object["freeze"](["text", "image"]),
  'minByKind': Object["freeze"]({
    'image': 0x0
  }),
  'maxByKind': Object["freeze"]({
    'image': 0x10,
    'video': 0x0,
    'audio': 0x0
  })
});
const DEFAULT_RATIO_POLICY_BY_PROVIDER = Object['freeze']({
  'agnes': Object["freeze"]({
    'capability': "size"
  }),
  'apimart': Object["freeze"]({
    'capability': "size"
  }),
  'grsai': Object["freeze"]({
    'capability': "aspectRatio"
  }),
  'ppio': Object["freeze"]({
    'capability': 'size'
  }),
  'runninghub': Object["freeze"]({
    'capability': "aspectRatio"
  }),
  'volcengine': Object["freeze"]({
    'capability': 'dimensions'
  })
});
function normalizeProviderId(_0x1d796d) {
  return String(_0x1d796d || '')['trim']()['toLowerCase']();
}
function freezeRatioPolicyValue(_0x53dd1b) {
  if (Array['isArray'](_0x53dd1b)) {
    return Object['freeze']([..._0x53dd1b]);
  }
  if (_0x53dd1b && typeof _0x53dd1b === "object") {
    return Object['freeze'](Object['fromEntries'](Object['entries'](_0x53dd1b)["map"](([_0x1b827b, _0x411da0]) => [_0x1b827b, freezeRatioPolicyValue(_0x411da0)])));
  }
  return _0x53dd1b;
}
function freezeRatioPolicy(_0xa86326) {
  if (!_0xa86326 || typeof _0xa86326 !== "object") {
    return null;
  }
  return Object['freeze'](Object["fromEntries"](Object["entries"](_0xa86326)["map"](([_0x411912, _0x164b46]) => [_0x411912, freezeRatioPolicyValue(_0x164b46)])));
}
function mergeRatioPolicyExtension(_0x421494, _0x4fa817, _0x21960e) {
  const _0x533bf1 = _0x421494 && typeof _0x421494 === "object" ? {
    ..._0x421494
  } : {};
  const _0x1b77d2 = _0x21960e || _0x533bf1['ratioPolicy'] || DEFAULT_RATIO_POLICY_BY_PROVIDER[normalizeProviderId(_0x4fa817)] || null;
  if (_0x1b77d2) {
    _0x533bf1["ratioPolicy"] = freezeRatioPolicy(_0x1b77d2);
  }
  return Object['keys'](_0x533bf1)["length"] > 0x0 ? Object['freeze'](_0x533bf1) : null;
}
function freezeInputSlots(_0x26bcaf = DEFAULT_IMAGE_MODEL_API_INPUT_SLOTS) {
  const _0x5acfe3 = _0x26bcaf || DEFAULT_IMAGE_MODEL_API_INPUT_SLOTS;
  const _0x285d31 = Array["isArray"](_0x5acfe3["fixedSlots"]) ? {
    'fixedSlots': Object["freeze"](_0x5acfe3['fixedSlots']["map"](_0x52b301 => Object["freeze"]({
      ...(_0x52b301 || {})
    })))
  } : {};
  return Object["freeze"]({
    'allowedKinds': Object["freeze"]([...(_0x5acfe3['allowedKinds'] || [])]),
    'minByKind': Object["freeze"]({
      ...(_0x5acfe3["minByKind"] || {})
    }),
    'maxByKind': Object["freeze"]({
      ...(_0x5acfe3['maxByKind'] || {})
    }),
    ..._0x285d31
  });
}
export function createImageModelApiManifest({
  modelId: _0x3cdd28,
  executionId: _0x101477,
  provider: _0xec44f2,
  displayName: _0x40b1c6,
  icon: _0x392cf1,
  description: _0x50b6e2,
  fields: _0x254fcb,
  extensions: _0x5b1936,
  ratioPolicy: _0x25d577,
  inputSlots: _0x285555,
  nanoBanana: _0x4b2ffd,
  prompt: _0x5ecd10,
  vip = ![]
}) {
  const _0x4633d1 = _0x4b2ffd ? Object["freeze"]({
    ...(_0x5b1936 || {}),
    'nanoBanana': Object["freeze"]({
      ..._0x4b2ffd
    })
  }) : _0x5b1936;
  const _0x32f902 = mergeRatioPolicyExtension(_0x4633d1, _0xec44f2, _0x25d577);
  return Object["freeze"]({
    'schemaVersion': '1.0',
    'modelId': _0x3cdd28,
    'provider': _0xec44f2,
    'kind': "image",
    'adapterType': 'modelApi',
    'executionId': _0x101477,
    'displayName': _0x40b1c6,
    'icon': _0x392cf1,
    'description': _0x50b6e2,
    ...(_0x5ecd10 ? {
      'prompt': Object["freeze"]({
        ..._0x5ecd10
      })
    } : {}),
    ...(_0x32f902 ? {
      'extensions': _0x32f902
    } : {}),
    'inputSlots': freezeInputSlots(_0x285555),
    'uiSchema': Object["freeze"]({
      'fields': freezeFields(_0x254fcb)
    }),
    ...(vip === !![] ? {
      'vip': !![]
    } : {}),
    'async': !![],
    'cancellable': ![],
    'outputType': "image"
  });
}
export function createModelApiExecutionManifest({
  id: _0x5d72ad,
  provider: _0x3f6591,
  model: _0x57e38c,
  endpoint: _0x32e844,
  endpointMode: _0x84be2d,
  bodyMapping: _0x1e7523,
  responseMapping: _0x27bb50,
  extensions: _0x242f6c,
  taskPolling: _0x394760,
  modeModels: _0x3e298f,
  imageSizeModels: _0x261e33,
  routeModels: _0x55969a
}) {
  const _0x4d49b4 = Object['freeze'](["data.result.images[].url", "result.images[].url", 'results[].url', "results[].imageUrl", "url"]);
  const _0xe5dbf4 = _0x394760 && typeof _0x394760 === 'object' ? Object['freeze']({
    ..._0x394760
  }) : null;
  const _0x134463 = _0x242f6c || _0xe5dbf4 ? Object['freeze']({
    ...(_0x242f6c || {}),
    ...(_0xe5dbf4 ? {
      'taskPolling': _0xe5dbf4
    } : {})
  }) : null;
  return Object["freeze"]({
    'schemaVersion': "1.0",
    'id': _0x5d72ad,
    'provider': _0x3f6591,
    'kind': "image",
    'adapterType': "modelApi",
    'endpoint': _0x32e844,
    ...(_0x84be2d ? {
      'endpointMode': _0x84be2d
    } : {}),
    'method': 'POST',
    'model': _0x57e38c,
    ...(_0x3e298f ? {
      'modeModels': Object["freeze"](_0x3e298f)
    } : {}),
    ...(_0x261e33 ? {
      'imageSizeModels': Object["freeze"](_0x261e33)
    } : {}),
    ...(_0x55969a ? {
      'routeModels': Object['freeze'](_0x55969a)
    } : {}),
    ...(_0x134463 ? {
      'extensions': _0x134463
    } : {}),
    'headers': Object["freeze"]({
      'Content-Type': 'application/json'
    }),
    'bodyMapping': Object["freeze"](_0x1e7523 || []),
    'responseMapping': Object["freeze"]({
      'taskIdPath': "taskId",
      'statusPath': 'status',
      'errorPath': "error",
      ...(_0x27bb50 || {}),
      'resultPaths': Object['freeze'](_0x27bb50?.['resultPaths'] || _0x4d49b4)
    }),
    'result': Object["freeze"]({
      'taskIdPath': "taskId",
      'urlFields': Object['freeze'](["url", "imageUrl"])
    })
  });
}