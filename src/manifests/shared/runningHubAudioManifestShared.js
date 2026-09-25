import { RUNNINGHUB_INSTANCE_OPTIONS } from '../../modules/runningHubInstanceTypes.js';
function freezeField(_0x55f573) {
  return Object["freeze"](_0x55f573);
}
export function createRunningHubAudioModelManifest({
  modelId: _0x363384,
  executionId: _0x2298db,
  displayName: _0x46e800,
  description: _0x219711,
  inputSlots: _0x33d45e,
  uiFields: _0x31e994,
  help: _0x4e5a61,
  uiPlacement: _0x5bfff0,
  extensions: _0x26f4eb,
  vip = ![],
  subscriptionAliases = []
}) {
  return Object["freeze"]({
    'schemaVersion': "1.0",
    'modelId': _0x363384,
    'provider': "runninghubwf",
    'kind': "audio",
    'adapterType': "workflow",
    'executionId': _0x2298db,
    'displayName': _0x46e800,
    'icon': 'images/RH.png',
    'description': _0x219711,
    ...(_0x26f4eb ? {
      'extensions': _0x26f4eb
    } : {}),
    'help': Object['freeze'](_0x4e5a61 || {}),
    'uiPlacement': Object["freeze"](_0x5bfff0 || ["modelMenu"]),
    'vip': vip,
    'subscriptionAliases': Object['freeze'](subscriptionAliases),
    'capabilities': Object["freeze"]({
      'inputKinds': Object['freeze'](_0x33d45e["allowedKinds"] || []),
      'outputType': "audio",
      'fixedAssetSlots': Object["freeze"]((_0x33d45e["fixedSlots"] || [])["map"](_0x321771 => _0x321771['id']))
    }),
    'inputSlots': Object["freeze"]({
      'allowedKinds': Object["freeze"](_0x33d45e['allowedKinds'] || []),
      'minByKind': Object["freeze"](_0x33d45e["minByKind"] || {}),
      'maxByKind': Object["freeze"](_0x33d45e["maxByKind"] || {}),
      'fixedSlots': Object["freeze"](_0x33d45e["fixedSlots"] || [])
    }),
    'uiSchema': Object['freeze']({
      'fields': Object["freeze"]((_0x31e994 || [])["map"](freezeField))
    }),
    'async': !![],
    'cancellable': !![],
    'outputType': "audio"
  });
}
export function createRunningHubAudioExecutionManifest({
  id: _0x4cdd8b,
  label: _0x4cad9b,
  workflowId: _0x550d75,
  preset: _0x57374c,
  mapping = {},
  extensions = {}
}) {
  return Object["freeze"]({
    'schemaVersion': '1.0',
    'id': _0x4cdd8b,
    'provider': "runninghubwf",
    'kind': "audio",
    'adapterType': "workflow",
    'label': _0x4cad9b,
    'workflowId': _0x550d75,
    'appId': _0x550d75,
    'submitMode': "openapi-v2-ai-app",
    'queryMode': 'openapi-v2-query',
    'instanceType': Object['freeze']({
      'field': 'rhInstanceType',
      'defaultValue': "default"
    }),
    'mapping': Object["freeze"]({
      'preset': _0x57374c,
      ...mapping
    }),
    'extensions': Object["freeze"](extensions || {}),
    'result': Object["freeze"]({
      'taskIdPath': 'taskId',
      'audioPaths': Object["freeze"](["results[].audioUrl", "results[].url", 'audioUrl'])
    })
  });
}
export const RH_AUDIO_INSTANCE_FIELD = Object["freeze"]({
  'id': "rhInstanceType",
  'type': "segmented",
  'placement': "instance",
  'label': '显存',
  'defaultValue': "default",
  'options': RUNNINGHUB_INSTANCE_OPTIONS
});