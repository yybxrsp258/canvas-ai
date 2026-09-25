import { RUNNINGHUB_INSTANCE_OPTIONS } from '../../modules/runningHubInstanceTypes.js';
function freezeField(_0x537705) {
  return Object["freeze"](_0x537705);
}
function freezeSlotGroup(_0x3ea649) {
  return Object["freeze"]({
    ..._0x3ea649,
    'slots': Object['freeze'](_0x3ea649?.["slots"] || [])
  });
}
function freezeDisplayAspectRatioSource(_0x7b356d) {
  return _0x7b356d && typeof _0x7b356d === "object" && !Array["isArray"](_0x7b356d) ? Object['freeze']({
    ..._0x7b356d
  }) : undefined;
}
function freezeInputPolicyCondition(_0x78bf40) {
  if (Array['isArray'](_0x78bf40)) {
    return Object["freeze"](_0x78bf40["map"](freezeInputPolicyCondition));
  }
  if (!_0x78bf40 || typeof _0x78bf40 !== "object") {
    return _0x78bf40;
  }
  return Object["freeze"]({
    ..._0x78bf40,
    ...(Array["isArray"](_0x78bf40["any"]) ? {
      'any': freezeInputPolicyCondition(_0x78bf40["any"])
    } : {}),
    ...(Array['isArray'](_0x78bf40['all']) ? {
      'all': freezeInputPolicyCondition(_0x78bf40["all"])
    } : {}),
    ...(Array["isArray"](_0x78bf40["values"]) ? {
      'values': Object['freeze']([..._0x78bf40["values"]])
    } : {})
  });
}
function freezeInputPolicyVariant(_0x4e91e7 = {}) {
  return Object['freeze']({
    ..._0x4e91e7,
    'when': freezeInputPolicyCondition(_0x4e91e7['when']),
    'allowedKinds': Object['freeze']([...(_0x4e91e7["allowedKinds"] || [])]),
    'minByKind': Object["freeze"]({
      ...(_0x4e91e7["minByKind"] || {})
    }),
    'maxByKind': Object['freeze']({
      ...(_0x4e91e7["maxByKind"] || {})
    })
  });
}
function freezeMediaConstraintsByKind(_0x31c45e) {
  if (!_0x31c45e || typeof _0x31c45e !== 'object' || Array["isArray"](_0x31c45e)) {
    return undefined;
  }
  return Object["freeze"](Object["fromEntries"](Object["entries"](_0x31c45e)['map'](([_0x23bc0b, _0x3a560b]) => [_0x23bc0b, Object["freeze"]({
    ...(_0x3a560b || {}),
    ...(Array["isArray"](_0x3a560b?.["allowedExtensions"]) ? {
      'allowedExtensions': Object['freeze']([..._0x3a560b["allowedExtensions"]])
    } : {})
  })])));
}
export function createRunningHubVideoModelManifest({
  modelId: _0x1a8a97,
  executionId: _0x3ced7a,
  displayName: _0x373f5e,
  description: _0x3ae0f2,
  inputSlots: _0x4efd8c,
  uiFields: _0x12e3c5,
  vip = ![],
  fixedAssetSlots: _0x28f925,
  uiPlacement: _0x36f25a,
  prompt: _0x46b632,
  help: _0xe09c01,
  extensions: _0x2541a1,
  subscriptionAliases = []
}) {
  const _0x2b5c88 = freezeDisplayAspectRatioSource(_0x4efd8c["displayAspectRatioSource"]);
  const _0x579feb = freezeMediaConstraintsByKind(_0x4efd8c["mediaConstraintsByKind"]);
  return Object["freeze"]({
    'schemaVersion': "1.0",
    'modelId': _0x1a8a97,
    'provider': "runninghubwf",
    'kind': 'video',
    'adapterType': "workflow",
    'executionId': _0x3ced7a,
    'displayName': _0x373f5e,
    'icon': 'images/RH.png',
    'description': _0x3ae0f2,
    ...(_0x46b632 && typeof _0x46b632 === "object" ? {
      'prompt': Object["freeze"](_0x46b632)
    } : {}),
    'help': Object["freeze"](_0xe09c01 || {}),
    ...(_0x2541a1 ? {
      'extensions': Object["freeze"](_0x2541a1)
    } : {}),
    'subscriptionAliases': Object["freeze"](subscriptionAliases),
    'vip': vip,
    ...(_0x36f25a ? {
      'uiPlacement': Object["freeze"](_0x36f25a)
    } : {}),
    'capabilities': Object["freeze"]({
      'inputKinds': Object['freeze'](_0x4efd8c["allowedKinds"] || []),
      'outputType': "video",
      'fixedAssetSlots': _0x28f925 ? Object["freeze"](_0x28f925) : undefined
    }),
    'inputSlots': Object["freeze"]({
      'allowedKinds': Object["freeze"](_0x4efd8c["allowedKinds"] || []),
      'minByKind': Object['freeze'](_0x4efd8c["minByKind"] || {}),
      'maxByKind': Object["freeze"](_0x4efd8c["maxByKind"] || {}),
      ...(_0x2b5c88 ? {
        'displayAspectRatioSource': _0x2b5c88
      } : {}),
      ...(_0x4efd8c["cycleFixedInputWhenFull"] === !![] ? {
        'cycleFixedInputWhenFull': !![]
      } : {}),
      ...(_0x4efd8c["maxTotalDurationSecondsByKind"] && typeof _0x4efd8c["maxTotalDurationSecondsByKind"] === 'object' && !Array["isArray"](_0x4efd8c["maxTotalDurationSecondsByKind"]) ? {
        'maxTotalDurationSecondsByKind': Object['freeze']({
          ..._0x4efd8c["maxTotalDurationSecondsByKind"]
        })
      } : {}),
      ...(_0x579feb ? {
        'mediaConstraintsByKind': _0x579feb
      } : {}),
      ...(Array['isArray'](_0x4efd8c["policyVariants"]) && _0x4efd8c["policyVariants"]["length"] > 0x0 ? {
        'policyVariants': Object["freeze"](_0x4efd8c["policyVariants"]["map"](freezeInputPolicyVariant))
      } : {}),
      'fixedSlots': Object['freeze'](_0x4efd8c["fixedSlots"] || []),
      'exclusiveGroups': Object["freeze"]((_0x4efd8c["exclusiveGroups"] || [])["map"](freezeSlotGroup))
    }),
    'uiSchema': Object["freeze"]({
      'fields': Object["freeze"]((_0x12e3c5 || [])["map"](freezeField))
    }),
    'async': !![],
    'cancellable': !![],
    'outputType': "video"
  });
}
export function createRunningHubVideoExecutionManifest({
  id: _0x2e97f3,
  label: _0x4c4ae9,
  workflowId: _0x7dd38c,
  submitMode: _0x26fe0f,
  queryMode: _0x1630af,
  mapping = {},
  preset: _0x16cbd8,
  extensions = {}
}) {
  return Object["freeze"]({
    'schemaVersion': "1.0",
    'id': _0x2e97f3,
    'provider': "runninghubwf",
    'kind': "video",
    'adapterType': "workflow",
    'label': _0x4c4ae9,
    'workflowId': _0x7dd38c,
    'appId': _0x7dd38c,
    'submitMode': _0x26fe0f,
    'queryMode': _0x1630af,
    'instanceType': Object["freeze"]({
      'field': "rhInstanceType",
      'defaultValue': "default"
    }),
    'mapping': Object["freeze"]({
      ...(_0x16cbd8 ? {
        'preset': _0x16cbd8
      } : {}),
      ...mapping
    }),
    'extensions': Object["freeze"](extensions || {}),
    'result': Object["freeze"]({
      'taskIdPath': "taskId",
      'videoPaths': Object["freeze"](["results[].videoUrl", 'results[].url'])
    })
  });
}
export const RH_VIDEO_RESOLUTION_FIELD = Object['freeze']({
  'id': 'rhVideoResolution',
  'type': 'slider',
  'placement': "videoParams",
  'label': '分辨率',
  'defaultValue': 0x340,
  'options': Object["freeze"]([0x340, 0x400, 0x500, 0x5a0, 0x640, 0x6e0, 0x780])
});
export const RH_VIDEO_FPS_FIELD = Object["freeze"]({
  'id': 'rhVideoFps',
  'type': "segmented",
  'placement': 'videoParams',
  'label': '帧率',
  'defaultValue': 0x18,
  'options': Object["freeze"]([Object["freeze"]({
    'value': 0x10,
    'label': "16帧"
  }), Object["freeze"]({
    'value': 0x18,
    'label': "24帧"
  })])
});
export const RH_VIDEO_FPS_30_FIELD = Object["freeze"]({
  ...RH_VIDEO_FPS_FIELD,
  'options': Object["freeze"]([Object["freeze"]({
    'value': 0x10,
    'label': '16帧'
  }), Object["freeze"]({
    'value': 0x18,
    'label': "24帧"
  }), Object['freeze']({
    'value': 0x1e,
    'label': '30帧'
  })])
});
export const RH_INSTANCE_FIELD = Object["freeze"]({
  'id': 'rhInstanceType',
  'type': "segmented",
  'placement': "instance",
  'label': '显存',
  'defaultValue': 'default',
  'options': RUNNINGHUB_INSTANCE_OPTIONS
});