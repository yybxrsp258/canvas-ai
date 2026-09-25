import { RH_IMAGE_INSTANCE_FIELD, RUNNINGHUB_INSTANCE_TYPE_ALLOWED_VALUES } from '../../shared/runningHubImageManifestShared.js';
export const ANIME_REAL_MODEL_ID = 'runninghub/1994718111704158209';
export const ANIME_REAL_EXECUTION_ID = 'runninghub.workflow.anime-real.v1';
export const ANIME_REAL_HELP_TOOLTIP = ["漫画转真人V2用法", "接入 [[red:1 张漫画/二次元角色图]]", "提示词补充写实程度、服装、场景和镜头语言", "适合把角色设定转成真人参考图，再继续做海报或视频首帧"]["join"]('\x0a');
export const animeRealModelManifest = Object["freeze"]({
  'schemaVersion': "1.0",
  'modelId': ANIME_REAL_MODEL_ID,
  'aliases': Object["freeze"](['runninghub/1994711386552999938']),
  'provider': "runninghubwf",
  'kind': "image",
  'adapterType': "workflow",
  'executionId': ANIME_REAL_EXECUTION_ID,
  'displayName': "漫画转真人V2",
  'icon': "images/RH.png",
  'description': '基于工作流把二次元角色转写实人像',
  'help': Object["freeze"]({
    'tooltip': ANIME_REAL_HELP_TOOLTIP
  }),
  'extensions': Object["freeze"]({
    'imageMenu': Object["freeze"]({
      'group': "runninghubWorkflow",
      'order': 0x1e
    }),
    'imageNodeUi': Object["freeze"]({
      'alwaysShowRefBar': !![],
      'rootClass': "rh-anime-real-node",
      'workflowBusyButton': !![],
      'inputGate': Object["freeze"]({
        'kind': 'image',
        'max': 0x1,
        'uploadedUrlField': "rhAnimeRealRefUrl",
        'clearFields': Object["freeze"](["rhAnimeRealRefUrl", 'rhAnimeRealRefLocalPath', "rhAnimeRealRefFileName"]),
        'missingMessage': "请先上传一张参考图再生成"
      })
    })
  }),
  'capabilities': Object["freeze"]({
    'inputKinds': Object["freeze"](["image"]),
    'outputType': "image",
    'maxImages': 0x1
  }),
  'inputSlots': Object["freeze"]({
    'allowedKinds': Object["freeze"](['image']),
    'minByKind': Object['freeze']({
      'image': 0x1
    }),
    'maxByKind': Object["freeze"]({
      'text': 0x0,
      'image': 0x1,
      'video': 0x0,
      'audio': 0x0
    })
  }),
  'uiSchema': Object["freeze"]({
    'fields': Object['freeze']([Object['freeze']({
      'id': "rhAnimeRealResolution",
      'type': 'slider',
      'placement': "resolution",
      'label': "分辨率",
      'defaultValue': 0x5a0,
      'options': Object["freeze"]([Object['freeze']({
        'value': 0x500,
        'label': "1280"
      }), Object["freeze"]({
        'value': 0x5a0,
        'label': "1440"
      }), Object["freeze"]({
        'value': 0x640,
        'label': "1600"
      }), Object["freeze"]({
        'value': 0x6e0,
        'label': "1760"
      }), Object['freeze']({
        'value': 0x780,
        'label': "1920"
      })])
    }), RH_IMAGE_INSTANCE_FIELD])
  }),
  'async': !![],
  'cancellable': !![],
  'outputType': "image"
});
export const animeRealExecutionManifest = Object["freeze"]({
  'schemaVersion': '1.0',
  'id': ANIME_REAL_EXECUTION_ID,
  'provider': "runninghubwf",
  'kind': 'image',
  'adapterType': 'workflow',
  'workflowId': "1994718111704158209",
  'appId': "1994718111704158209",
  'aliases': Object["freeze"](['runninghub.workflow.anime-real.legacy.v1']),
  'submitMode': 'openapi-v2-ai-app',
  'queryMode': "openapi-v2-query",
  'instanceType': Object['freeze']({
    'field': "rhInstanceType",
    'defaultValue': "default",
    'allowedValues': RUNNINGHUB_INSTANCE_TYPE_ALLOWED_VALUES
  }),
  'mapping': Object['freeze']({
    'maxInputImages': 0x1,
    'imageNodes': Object["freeze"](["851"]),
    'promptNode': Object["freeze"]({
      'nodeId': "967",
      'fieldName': "value"
    }),
    'valueNodes': Object["freeze"]([Object["freeze"]({
      'nodeId': "945",
      'fieldName': "value",
      'field': "rhAnimeRealResolution",
      'fallbackFields': Object["freeze"](['rhResolution']),
      'defaultValue': 0x5a0
    })])
  }),
  'result': Object["freeze"]({
    'taskIdPath': 'taskId',
    'urlFields': Object["freeze"](["url", "imageUrl"])
  }),
  'validation': Object['freeze']({
    'minInputImages': 0x1,
    'missingInputMessage': '请添加一张参考图片'
  })
});