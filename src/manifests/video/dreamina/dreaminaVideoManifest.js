import { SEEDANCE2_INPUT_MAX_BY_KIND, SEEDANCE2_MAX_TOTAL_DURATION_SECONDS_BY_KIND, SEEDANCE25_INPUT_MAX_BY_KIND, SEEDANCE25_MAX_TOTAL_DURATION_SECONDS_BY_KIND } from '../../../modules/modelMediaInputLimits.js';
const DREAMINA_DEFAULT_VIDEO_EXECUTION_ID = "dreamina.local-runtime.video.seedance-2-0-fast.v1";
export const DREAMINA_VIDEO_VIP_GATE_ID = "dreamina/video_vip";
const VIDEO_ROUTE_MODE_FIELD = Object["freeze"]({
  'id': "dreaminaRouteMode",
  'type': "segmented",
  'placement': "mode",
  'label': "Mode",
  'menuTitle': '模式选择',
  'defaultValue': 'multimodal2video',
  'options': Object["freeze"]([Object['freeze']({
    'value': "multimodal2video",
    'label': "全能参考"
  }), Object['freeze']({
    'value': "frames2video",
    'label': "首尾帧"
  })])
});
const VIDEO_RESOLUTION_FIELD = Object["freeze"]({
  'id': 'resolution',
  'type': "segmented",
  'placement': "resolution",
  'label': "Resolution",
  'defaultValue': "720p",
  'options': Object["freeze"]([Object["freeze"]({
    'value': '480p',
    'label': "480p"
  }), Object["freeze"]({
    'value': "720p",
    'label': "720p"
  }), Object["freeze"]({
    'value': '1080p',
    'label': '1080p'
  }), Object["freeze"]({
    'value': '4k',
    'label': '4K'
  })])
});
const VIDEO_RATIO_FIELD = Object['freeze']({
  'id': 'aspectRatio',
  'displayRole': "aspectRatio",
  'type': 'segmented',
  'placement': 'resolution',
  'label': "Ratio",
  'defaultValue': "自适应",
  'options': Object["freeze"]([Object["freeze"]({
    'value': "自适应",
    'label': "自适应"
  }), Object['freeze']({
    'value': "1:1",
    'label': "1:1"
  }), Object["freeze"]({
    'value': "3:4",
    'label': "3:4"
  }), Object["freeze"]({
    'value': "16:9",
    'label': "16:9"
  }), Object["freeze"]({
    'value': "4:3",
    'label': '4:3'
  }), Object["freeze"]({
    'value': "9:16",
    'label': "9:16"
  }), Object["freeze"]({
    'value': "21:9",
    'label': '21:9'
  })])
});
const VIDEO_DURATION_FIELD = Object["freeze"]({
  'id': "duration",
  'type': "slider",
  'placement': "duration",
  'label': "Duration",
  'defaultValue': 0x5,
  'min': 0x4,
  'max': 0xf,
  'step': 0x1
});
const DREAMINA_VIDEO_UI_SCHEMA = Object["freeze"]({
  'fields': Object["freeze"]([VIDEO_ROUTE_MODE_FIELD, VIDEO_RESOLUTION_FIELD, VIDEO_RATIO_FIELD, VIDEO_DURATION_FIELD])
});
const DREAMINA_VIDEO_INPUT_SLOTS = Object["freeze"]({
  'allowedKinds': Object['freeze'](["text", "image", "video", "audio"]),
  'minByKind': Object['freeze']({
    'text': 0x0
  }),
  'maxByKind': SEEDANCE2_INPUT_MAX_BY_KIND
});
const DREAMINA_SEEDANCE2_VIDEO_INPUT_SLOTS = Object['freeze']({
  ...DREAMINA_VIDEO_INPUT_SLOTS,
  'maxTotalDurationSecondsByKind': SEEDANCE2_MAX_TOTAL_DURATION_SECONDS_BY_KIND
});
const DREAMINA_SEEDANCE25_VIDEO_INPUT_SLOTS = Object["freeze"]({
  ...DREAMINA_VIDEO_INPUT_SLOTS,
  'maxByKind': SEEDANCE25_INPUT_MAX_BY_KIND,
  'maxTotalDurationSecondsByKind': SEEDANCE25_MAX_TOTAL_DURATION_SECONDS_BY_KIND
});
const DREAMINA_SEEDANCE_TASK_TYPES = Object["freeze"](["text2video", 'image2video', "frames2video", "multimodal2video"]);
const DREAMINA_SEEDANCE_RESOLUTION_BY_TASK = Object["freeze"]({
  'text2video': Object["freeze"](['720p']),
  'image2video': Object['freeze'](['720p']),
  'frames2video': Object["freeze"](['720p']),
  'multimodal2video': Object["freeze"](["720p"])
});
const DREAMINA_SEEDANCE_VIP_RESOLUTION_BY_TASK = Object['freeze']({
  'text2video': Object['freeze'](["720p", '1080p', '4k']),
  'image2video': Object["freeze"](["720p", "1080p", '4k']),
  'frames2video': Object['freeze'](["720p", "1080p", '4k']),
  'multimodal2video': Object['freeze'](["720p", '1080p', '4k'])
});
const DREAMINA_SEEDANCE25_RESOLUTION_BY_TASK = Object["freeze"]({
  'text2video': Object["freeze"](['480p', '720p', "1080p"]),
  'image2video': Object["freeze"](["480p", "720p", '1080p']),
  'frames2video': Object["freeze"](["480p", "720p", "1080p"]),
  'multimodal2video': Object["freeze"](["480p", "720p", '1080p'])
});
const DREAMINA_DEFAULT_DURATION_BY_TASK = Object["freeze"]({
  'text2video': Object['freeze']({
    'min': 0x4,
    'max': 0xf,
    'step': 0x1
  }),
  'image2video': Object["freeze"]({
    'min': 0x4,
    'max': 0xf,
    'step': 0x1
  }),
  'frames2video': Object["freeze"]({
    'min': 0x4,
    'max': 0xf,
    'step': 0x1
  }),
  'multimodal2video': Object["freeze"]({
    'min': 0x4,
    'max': 0xf,
    'step': 0x1
  })
});
const DREAMINA_SEEDANCE25_DURATION_BY_TASK = Object["freeze"]({
  'text2video': Object['freeze']({
    'min': 0x4,
    'max': 0x1e,
    'step': 0x1
  }),
  'image2video': Object["freeze"]({
    'min': 0x4,
    'max': 0x1e,
    'step': 0x1
  }),
  'frames2video': Object["freeze"]({
    'min': 0x4,
    'max': 0x1e,
    'step': 0x1
  }),
  'multimodal2video': Object["freeze"]({
    'min': 0x4,
    'max': 0x1e,
    'step': 0x1
  })
});
const DREAMINA_VIDEO_MODEL_MENU_ENTRIES = Object['freeze']([Object["freeze"]({
  'modelId': "dreamina/seedance2.0fast_vip",
  'executionId': "dreamina.local-runtime.video.seedance-2-0-fast-vip.v1",
  'modelVersion': "seedance2.0fast_vip",
  'displayName': "Seedance 2.0 Fast VIP",
  'counterpartKey': "seedance2-fast",
  'order': 0xa,
  'title': 'Seedance\x202.0\x20Fast\x20VIP',
  'subtitle': "高速高阶版，支持全能参考与首尾帧链路",
  'taskTypes': DREAMINA_SEEDANCE_TASK_TYPES,
  'resolutionOptionsByTaskType': DREAMINA_SEEDANCE_RESOLUTION_BY_TASK,
  'durationRangeByTaskType': DREAMINA_DEFAULT_DURATION_BY_TASK,
  'vip': !![]
}), Object["freeze"]({
  'modelId': "dreamina/seedance2.0_vip",
  'executionId': "dreamina.local-runtime.video.seedance-2-0-vip.v1",
  'modelVersion': "seedance2.0_vip",
  'displayName': 'Seedance\x202.0\x20VIP',
  'counterpartKey': "seedance2-standard",
  'order': 0x14,
  'title': "Seedance 2.0 VIP",
  'subtitle': "质量优先，支持 4K 全能参考与首尾帧链路",
  'taskTypes': DREAMINA_SEEDANCE_TASK_TYPES,
  'resolutionOptionsByTaskType': DREAMINA_SEEDANCE_VIP_RESOLUTION_BY_TASK,
  'durationRangeByTaskType': DREAMINA_DEFAULT_DURATION_BY_TASK,
  'vip': !![]
}), Object["freeze"]({
  'modelId': 'dreamina/seedance2.0fast',
  'executionId': DREAMINA_DEFAULT_VIDEO_EXECUTION_ID,
  'modelVersion': "seedance2.0fast",
  'displayName': "Seedance 2.0 Fast",
  'counterpartKey': 'seedance2-fast',
  'order': 0x1e,
  'title': "Seedance 2.0 Fast",
  'subtitle': "默认推荐，支持文生、图生、首尾帧、全能参考",
  'taskTypes': DREAMINA_SEEDANCE_TASK_TYPES,
  'aliases': Object["freeze"](['seedance-2.0-fast']),
  'defaultForTaskTypes': DREAMINA_SEEDANCE_TASK_TYPES,
  'resolutionOptionsByTaskType': DREAMINA_SEEDANCE_RESOLUTION_BY_TASK,
  'durationRangeByTaskType': DREAMINA_DEFAULT_DURATION_BY_TASK
}), Object["freeze"]({
  'modelId': "dreamina/seedance2.0",
  'executionId': "dreamina.local-runtime.video.seedance-2-0.v1",
  'modelVersion': 'seedance2.0',
  'displayName': "Seedance 2.0",
  'counterpartKey': "seedance2-standard",
  'order': 0x28,
  'title': "Seedance 2.0",
  'subtitle': "质量更稳，支持文生、图生、首尾帧、全能参考",
  'taskTypes': DREAMINA_SEEDANCE_TASK_TYPES,
  'aliases': Object["freeze"](["seedance-2.0"]),
  'resolutionOptionsByTaskType': DREAMINA_SEEDANCE_RESOLUTION_BY_TASK,
  'durationRangeByTaskType': DREAMINA_DEFAULT_DURATION_BY_TASK
}), Object["freeze"]({
  'modelId': "dreamina/seedance2.0mini",
  'executionId': "dreamina.local-runtime.video.seedance-2-0-mini.v1",
  'modelVersion': "seedance2.0mini",
  'displayName': 'Seedance\x202.0\x20Mini',
  'counterpartKey': "seedance2-mini",
  'order': 0x2d,
  'title': "Seedance 2.0 Mini",
  'subtitle': 'Mini\x20版，参数同\x20Seedance\x202.0',
  'taskTypes': DREAMINA_SEEDANCE_TASK_TYPES,
  'aliases': Object["freeze"](["seedance-2.0-mini"]),
  'resolutionOptionsByTaskType': DREAMINA_SEEDANCE_RESOLUTION_BY_TASK,
  'durationRangeByTaskType': DREAMINA_DEFAULT_DURATION_BY_TASK
}), Object["freeze"]({
  'modelId': 'dreamina/seedance2.5',
  'executionId': "dreamina.local-runtime.video.seedance-2-5.v1",
  'modelVersion': "seedance2.5",
  'displayName': "Seedance 2.5",
  'counterpartKey': "seedance2.5-standard",
  'order': 0x2f,
  'title': "Seedance 2.5",
  'segmentRetakeSupported': !![],
  'subtitle': "Supports text/image/frames/multimodal video with 480p/720p/1080p and 4-30s output.",
  'taskTypes': DREAMINA_SEEDANCE_TASK_TYPES,
  'aliases': Object["freeze"](["seedance-2.5"]),
  'resolutionOptionsByTaskType': DREAMINA_SEEDANCE25_RESOLUTION_BY_TASK,
  'durationRangeByTaskType': DREAMINA_SEEDANCE25_DURATION_BY_TASK,
  'inputSlots': DREAMINA_SEEDANCE25_VIDEO_INPUT_SLOTS
})]);
function createDreaminaVideoUiSchema(_0x2babd8 = {}) {
  const _0xf1f881 = Array["from"](new Set(Object["values"](_0x2babd8["resolutionOptionsByTaskType"] || {})["flatMap"](_0x233501 => Array['isArray'](_0x233501) ? _0x233501 : [])));
  if (_0xf1f881["length"] === 0x0) {
    return DREAMINA_VIDEO_UI_SCHEMA;
  }
  const _0x2def2c = new Set(_0xf1f881);
  const _0xf25625 = VIDEO_RESOLUTION_FIELD["options"]['filter'](_0x364b05 => _0x2def2c['has'](_0x364b05['value']));
  if (_0xf25625["length"] === 0x0) {
    return DREAMINA_VIDEO_UI_SCHEMA;
  }
  const _0x594fdb = Object['freeze']({
    ...VIDEO_RESOLUTION_FIELD,
    'defaultValue': _0x2def2c['has'](VIDEO_RESOLUTION_FIELD["defaultValue"]) ? VIDEO_RESOLUTION_FIELD["defaultValue"] : _0xf25625[0x0]["value"],
    'options': Object["freeze"](_0xf25625)
  });
  return Object["freeze"]({
    'fields': Object["freeze"](DREAMINA_VIDEO_UI_SCHEMA["fields"]["map"](_0x43aa60 => _0x43aa60['id'] === 'resolution' ? _0x594fdb : _0x43aa60))
  });
}
function createDreaminaVideoModelManifest(_0x78c19b) {
  return Object["freeze"]({
    'schemaVersion': "1.0",
    'modelId': _0x78c19b["modelId"],
    ...(Array["isArray"](_0x78c19b["aliases"]) ? {
      'aliases': _0x78c19b["aliases"]
    } : {}),
    'provider': 'dreamina',
    'kind': "video",
    'adapterType': 'localRuntime',
    'executionId': _0x78c19b["executionId"],
    'displayName': _0x78c19b["displayName"],
    'icon': "images/jimeng.png",
    'inputSlots': _0x78c19b["inputSlots"] || (String(_0x78c19b["counterpartKey"] || '')["startsWith"]("seedance2-") ? DREAMINA_SEEDANCE2_VIDEO_INPUT_SLOTS : DREAMINA_VIDEO_INPUT_SLOTS),
    'uiSchema': createDreaminaVideoUiSchema(_0x78c19b),
    'vip': _0x78c19b["vip"] === !![],
    'async': !![],
    'cancellable': !![],
    'outputType': 'video',
    'extensions': Object["freeze"]({
      'ratioPolicy': Object["freeze"]({
        'capability': "aspectRatio"
      }),
      'dreaminaStyleVideo': Object['freeze']({
        'order': _0x78c19b['order'],
        'title': _0x78c19b["title"],
        'subtitle': _0x78c19b["subtitle"],
        'subtitleByTaskType': _0x78c19b['subtitleByTaskType'] || Object["freeze"]({}),
        'counterpartKey': _0x78c19b['counterpartKey'] || '',
        'taskTypes': _0x78c19b['taskTypes'],
        'defaultForTaskTypes': _0x78c19b['defaultForTaskTypes'] || Object["freeze"]([]),
        'resolutionOptionsByTaskType': _0x78c19b["resolutionOptionsByTaskType"] || Object['freeze']({}),
        'durationRangeByTaskType': _0x78c19b["durationRangeByTaskType"] || Object["freeze"]({})
      }),
      ...(_0x78c19b["segmentRetakeSupported"] === !![] ? {
        'segmentRetake': Object['freeze']({
          'supported': !![],
          'parameterPolicy': Object["freeze"]({
            'mode': Object["freeze"]({
              'fieldId': "dreaminaRouteMode",
              'value': "multimodal2video"
            }),
            'duration': Object["freeze"]({
              'fieldId': "duration",
              'value': -0x1
            })
          })
        })
      } : {})
    })
  });
}
export const dreaminaOfficialVideoModelManifest = Object["freeze"]({
  'schemaVersion': "1.0",
  'modelId': "dreamina/text2video",
  'provider': "dreamina",
  'kind': "video",
  'adapterType': "localRuntime",
  'executionId': DREAMINA_DEFAULT_VIDEO_EXECUTION_ID,
  'displayName': "即梦官方",
  'icon': "images/jimeng.png",
  'inputSlots': DREAMINA_VIDEO_INPUT_SLOTS,
  'uiSchema': DREAMINA_VIDEO_UI_SCHEMA,
  'vip': !![],
  'async': !![],
  'cancellable': !![],
  'outputType': "video",
  'extensions': Object["freeze"]({
    'ratioPolicy': Object["freeze"]({
      'capability': "aspectRatio"
    }),
    'videoMenu': Object["freeze"]({
      'role': "dreaminaOfficial",
      'order': 0xa,
      'label': "即梦官方",
      'subtitle': "无图文生视频，单图图生视频",
      'iconAlt': "dreamina"
    })
  })
});
export const dreaminaVideoModelManifests = Object["freeze"]([dreaminaOfficialVideoModelManifest, ...DREAMINA_VIDEO_MODEL_MENU_ENTRIES["map"](createDreaminaVideoModelManifest)]);
function createDreaminaVideoExecutionManifest(_0x374e4a) {
  return Object["freeze"]({
    'schemaVersion': '1.0',
    'id': _0x374e4a["executionId"],
    'provider': 'dreamina',
    'kind': "video",
    'adapterType': "localRuntime",
    'runtime': 'dreaminaVideo',
    'extensions': Object['freeze']({
      'dreaminaVideo': Object["freeze"]({
        'modelVersion': _0x374e4a["modelVersion"]
      })
    }),
    'result': Object["freeze"]({
      'urlFields': Object['freeze'](['url', "videoUrl"])
    })
  });
}
export const dreaminaVideoExecutionManifests = Object["freeze"]([...DREAMINA_VIDEO_MODEL_MENU_ENTRIES['map'](createDreaminaVideoExecutionManifest)]);
export const dreaminaVideoExecutionManifest = dreaminaVideoExecutionManifests["find"](_0x21253a => _0x21253a['id'] === DREAMINA_DEFAULT_VIDEO_EXECUTION_ID);