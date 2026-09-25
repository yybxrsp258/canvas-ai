import { canvasCommandRegistry, hasCanvasCommandPlanVariableReference } from '../canvasCommands/index.js';
import { AGENT_BATCH_CONFIRM_THRESHOLD, normalizeAgentPlan } from './agentActionSchema.js';
import { buildSupportedAgentParamsFromHints, extractAgentDuplicateCountHint, extractAgentParameterHints } from './agentParameterHints.js';
import { normalizeAgentSearchKey } from './agentCapabilityDiscovery.js';
const RISK_ORDER = Object["freeze"]({
  'safe': 0x0,
  'confirm': 0x1,
  'danger': 0x2,
  'blocked': 0x3
});
const CREATE_NODE_TYPE_BY_KIND = Object["freeze"]({
  'text': 'ai-text',
  'image': "ai-image",
  'video': "ai-video",
  'audio': "ai-audio"
});
function maxRisk(_0x491d09, _0x131aee) {
  return (RISK_ORDER[_0x131aee] || 0x0) > (RISK_ORDER[_0x491d09] || 0x0) ? _0x131aee : _0x491d09;
}
function actionSize(_0x6e67f2 = {}) {
  const _0x51035b = _0x6e67f2["args"]?.["ids"];
  const _0x58774f = Array["isArray"](_0x51035b) ? _0x51035b["length"] : _0x6e67f2["args"]?.["nodeId"] ? 0x1 : 0x0;
  if (_0x6e67f2["type"] !== 'node.duplicate') {
    return _0x58774f;
  }
  const _0x223e45 = Math["max"](0x1, Math["trunc"](Number(_0x6e67f2["args"]?.["copies"] || 0x1)));
  return _0x58774f * _0x223e45;
}
function getAliasNodeIdReference(_0xb544fa) {
  const _0x554e00 = /^\$([A-Za-z_][A-Za-z0-9_]*)\.nodeId$/["exec"](String(_0xb544fa || '')['trim']());
  return _0x554e00?.[0x1] || '';
}
function getAliasEdgeIdReference(_0xa7d5fc) {
  const _0x3e769a = /^\$([A-Za-z_][A-Za-z0-9_]*)\.edgeId$/["exec"](String(_0xa7d5fc || '')["trim"]());
  return _0x3e769a?.[0x1] || '';
}
function getPlainObject(_0x20e00a) {
  return _0x20e00a && typeof _0x20e00a === "object" && !Array["isArray"](_0x20e00a) ? _0x20e00a : {};
}
function isSamePlanCreatedNodeReference(_0x6bf9ff, _0x277492 = {}) {
  const _0x474f9e = String(_0x6bf9ff || '')["trim"]();
  if (_0x474f9e && _0x277492['createdNodeIds']?.["has"]?.(_0x474f9e)) {
    return !![];
  }
  const _0x651732 = getAliasNodeIdReference(_0x6bf9ff);
  return !!_0x651732 && _0x277492["createdNodeAliases"]?.["has"]?.(_0x651732);
}
function isSamePlanCreatedEdgeReference(_0x3c0fb2, _0x1a9856 = {}) {
  const _0x4376cf = String(_0x3c0fb2 || '')["trim"]();
  if (_0x4376cf && _0x1a9856['createdEdgeIds']?.['has']?.(_0x4376cf)) {
    return !![];
  }
  const _0x207a86 = getAliasEdgeIdReference(_0x3c0fb2);
  return !!_0x207a86 && _0x1a9856['createdEdgeAliases']?.['has']?.(_0x207a86);
}
function isSamePlanConnectionPreparation(_0x33ac95 = {}, _0x721b40 = {}) {
  if (_0x33ac95["type"] !== "graph.connect") {
    return ![];
  }
  return isSamePlanCreatedNodeReference(_0x33ac95['args']?.["sourceId"], _0x721b40) || isSamePlanCreatedNodeReference(_0x33ac95["args"]?.["targetId"], _0x721b40);
}
function isSamePlanNodePreparation(_0x1bc95e = {}, _0x42bc6d = {}) {
  if (_0x1bc95e["type"] === 'node.setPrompt' || _0x1bc95e["type"] === 'node.appendPrompt' || _0x1bc95e['type'] === "node.setParams" || _0x1bc95e["type"] === "node.setModel" || _0x1bc95e['type'] === 'node.changeModel') {
    return isSamePlanCreatedNodeReference(_0x1bc95e["args"]?.['nodeId'], _0x42bc6d);
  }
  if (_0x1bc95e["type"] === "node.setInputSlot") {
    if (isSamePlanCreatedEdgeReference(_0x1bc95e["args"]?.['edgeId'], _0x42bc6d)) {
      return !![];
    }
    return isSamePlanCreatedNodeReference(_0x1bc95e["args"]?.['sourceId'], _0x42bc6d) || isSamePlanCreatedNodeReference(_0x1bc95e["args"]?.["targetId"], _0x42bc6d);
  }
  return ![];
}
function isExistingNodeMutationAction(_0x51a981 = {}) {
  return _0x51a981['type'] === "graph.connect" || _0x51a981["type"] === "node.setPrompt" || _0x51a981["type"] === 'node.appendPrompt' || _0x51a981["type"] === "node.setParams" || _0x51a981["type"] === 'node.setModel' || _0x51a981["type"] === "node.changeModel" || _0x51a981["type"] === "node.setInputSlot";
}
function getMutationConfirmReason(_0x2c5488 = {}) {
  if (_0x2c5488['type'] === 'graph.connect') {
    return "existing node connection change requires confirmation";
  }
  if (_0x2c5488['type'] === "node.setPrompt" || _0x2c5488["type"] === "node.appendPrompt") {
    return 'existing\x20node\x20prompt\x20change\x20requires\x20confirmation';
  }
  if (_0x2c5488["type"] === 'node.setParams') {
    return 'existing\x20node\x20generation\x20params\x20change\x20requires\x20confirmation';
  }
  if (_0x2c5488["type"] === "node.setModel" || _0x2c5488["type"] === 'node.changeModel') {
    return "existing node model change requires confirmation";
  }
  if (_0x2c5488["type"] === "node.setInputSlot") {
    return 'existing\x20input\x20slot\x20change\x20requires\x20confirmation';
  }
  return '';
}
function getActionRisk(_0x48c60e, _0x5d17a9, _0x4966fe = {}) {
  let _0x554e4e = _0x5d17a9?.["riskLevel"] || "safe";
  let _0x5b3df4 = _0x554e4e !== 'safe' ? "command risk requires confirmation" : '';
  _0x48c60e["type"] === "generation.run" && (_0x554e4e = maxRisk(_0x554e4e, "confirm"), _0x5b3df4 = 'generation\x20run\x20requires\x20confirmation');
  _0x48c60e["type"] === "node.delete" && (_0x554e4e = maxRisk(_0x554e4e, "danger"), _0x5b3df4 = 'node\x20delete\x20requires\x20confirmation');
  isExistingNodeMutationAction(_0x48c60e) && !isSamePlanNodePreparation(_0x48c60e, _0x4966fe) && !isSamePlanConnectionPreparation(_0x48c60e, _0x4966fe) && (_0x554e4e = maxRisk(_0x554e4e, 'confirm'), _0x5b3df4 = getMutationConfirmReason(_0x48c60e));
  actionSize(_0x48c60e) > AGENT_BATCH_CONFIRM_THRESHOLD && (_0x554e4e = maxRisk(_0x554e4e, 'confirm'), _0x5b3df4 = "large batch requires confirmation");
  return {
    'risk': _0x554e4e,
    'reason': _0x5b3df4
  };
}
function buildFailure(_0x20a00c, _0x487c02 = undefined) {
  return {
    'ok': ![],
    'status': 'failed',
    'errorCode': "AGENT_PLAN_INVALID",
    'message': _0x20a00c,
    'details': _0x487c02
  };
}
function isImageNodeType(_0x105542 = '') {
  const _0xab36eb = String(_0x105542 || '');
  return _0xab36eb === "ai-image" || _0xab36eb === "source-image";
}
function findSelectedImageNodeId(_0x40d52e = {}) {
  const _0x273471 = _0x40d52e?.["canvas"] || {};
  const _0x425742 = Array["isArray"](_0x273471["selectedNodes"]) ? _0x273471['selectedNodes'] : [];
  const _0x512b85 = _0x425742['find'](_0x384dcf => isImageNodeType(_0x384dcf?.["type"]));
  if (_0x512b85?.['id']) {
    return String(_0x512b85['id']);
  }
  const _0x587a60 = Array["isArray"](_0x273471["selectedNodeIds"]) ? _0x273471['selectedNodeIds']["map"](_0x584090 => String(_0x584090 || ''))["filter"](Boolean) : [];
  if (_0x587a60["length"] === 0x0) {
    return '';
  }
  const _0x35ad64 = new Set(_0x587a60);
  const _0x6cf41e = Array["isArray"](_0x273471["nodes"]) ? _0x273471['nodes'] : [];
  return String(_0x6cf41e['find'](_0x2d5dc3 => _0x35ad64["has"](String(_0x2d5dc3?.['id'] || '')) && isImageNodeType(_0x2d5dc3?.['type']))?.['id'] || '');
}
function modelAllowsImageInput(_0x4101b3 = {}) {
  const _0x11e6f0 = _0x4101b3?.["inputSlots"] && typeof _0x4101b3["inputSlots"] === "object" ? _0x4101b3["inputSlots"] : {};
  const _0x415051 = Array["isArray"](_0x11e6f0["allowedKinds"]) ? _0x11e6f0["allowedKinds"] : [];
  if (_0x415051["includes"]('image')) {
    return !![];
  }
  const _0x4aa8ba = Number(_0x11e6f0["maxByKind"]?.['image']);
  return Number["isFinite"](_0x4aa8ba) && _0x4aa8ba > 0x0;
}
function modelRequiresMissingMedia(_0x46812f = {}) {
  const _0x5ea603 = _0x46812f?.["inputSlots"] && typeof _0x46812f["inputSlots"] === "object" ? _0x46812f['inputSlots'] : {};
  const _0x1f52a8 = _0x5ea603['minByKind'] || {};
  if (Number(_0x1f52a8["video"]) > 0x0) {
    return !![];
  }
  if (Number(_0x1f52a8["audio"]) > 0x0) {
    return !![];
  }
  const _0x149964 = Array["isArray"](_0x5ea603["fixedSlots"]) ? _0x5ea603["fixedSlots"] : [];
  return _0x149964["some"](_0x51d5ae => _0x51d5ae?.["required"] === !![] && (String(_0x51d5ae?.["kind"] || '') === "video" || String(_0x51d5ae?.["kind"] || '') === "audio"));
}
function getModelFieldIds(_0x67029f = {}) {
  return new Set((Array["isArray"](_0x67029f?.["uiSchema"]?.['fields']) ? _0x67029f['uiSchema']["fields"] : [])["map"](_0x1e25e9 => String(_0x1e25e9?.['id'] || '')["trim"]())["filter"](Boolean));
}
const CREATE_NODE_KINDS = Object["freeze"]({
  'ai-image': 'image',
  'ai-video': "video",
  'ai-audio': "audio",
  'ai-text': "text",
  'storyboard-script': "text"
});
function findImageToVideoModel(_0x311cdb = {}) {
  const _0x5a981b = Array["isArray"](_0x311cdb?.["canvas"]?.["availableModels"]) ? _0x311cdb["canvas"]['availableModels'] : [];
  return _0x5a981b["find"](_0x426bc5 => _0x426bc5?.["kind"] === "video" && _0x426bc5?.["modelId"] && modelAllowsImageInput(_0x426bc5) && !modelRequiresMissingMedia(_0x426bc5)) || null;
}
function findContextModel(_0xdc97eb = {}, _0x59565f = '') {
  const _0x2ecd2c = String(_0x59565f || '')["trim"]();
  if (!_0x2ecd2c) {
    return null;
  }
  const _0x150302 = Array["isArray"](_0xdc97eb?.["canvas"]?.["availableModels"]) ? _0xdc97eb["canvas"]["availableModels"] : [];
  return _0x150302["find"](_0x3833ad => _0x3833ad?.["modelId"] === _0x2ecd2c) || null;
}
function normalizeModelReference(_0x18fd8d = '') {
  return String(_0x18fd8d || '')['trim']()["normalize"]('NFKC')["toLocaleLowerCase"]();
}
function findContextModelByReference(_0x3cbdea = {}, _0x17de25 = '', {
  kind = ''
} = {}) {
  const _0x4b84bc = String(_0x17de25 || '')["trim"]();
  if (!_0x4b84bc) {
    return null;
  }
  const _0x284f9f = findContextModel(_0x3cbdea, _0x4b84bc);
  if (_0x284f9f && (!kind || String(_0x284f9f["kind"] || '') === kind)) {
    return {
      'model': _0x284f9f,
      'source': 'modelId'
    };
  }
  const _0x539fd3 = normalizeModelReference(_0x4b84bc);
  const _0x2ac222 = normalizeAgentSearchKey(_0x4b84bc);
  const _0xad7aa7 = Array["isArray"](_0x3cbdea?.["canvas"]?.["availableModels"]) ? _0x3cbdea["canvas"]["availableModels"] : [];
  const _0x2364bb = _0xad7aa7['filter'](_0x177e8a => _0x177e8a?.['modelId'] && (!kind || String(_0x177e8a["kind"] || '') === kind) && normalizeAgentSearchKey(_0x177e8a['modelId']) === _0x2ac222);
  if (_0x2364bb['length'] === 0x1) {
    return {
      'model': _0x2364bb[0x0],
      'source': "compactModelId"
    };
  }
  const _0x921acf = _0xad7aa7["filter"](_0x381602 => _0x381602?.["modelId"] && (!kind || String(_0x381602["kind"] || '') === kind) && normalizeModelReference(_0x381602['displayName']) === _0x539fd3);
  if (_0x921acf["length"] === 0x1) {
    return {
      'model': _0x921acf[0x0],
      'source': "displayName"
    };
  }
  const _0x1dc857 = _0xad7aa7['filter'](_0x51c2a2 => _0x51c2a2?.["modelId"] && (!kind || String(_0x51c2a2['kind'] || '') === kind) && normalizeAgentSearchKey(_0x51c2a2["displayName"]) === _0x2ac222);
  return _0x1dc857['length'] === 0x1 ? {
    'model': _0x1dc857[0x0],
    'source': "compactDisplayName"
  } : null;
}
function matchExplicitUserModelDirective(_0x171d8c = '') {
  const _0x5d691c = String(_0x171d8c || '')['replace'](/\s+/g, '\x20')["trim"]();
  if (!_0x5d691c) {
    return null;
  }
  const _0x8a609e = [/^(?:(?:请|麻烦)\s*)?(?:(?:帮我|给我)\s*)?(?:(?:使用|用|采用|选择|选用)\s*)?([^，。；;:：\n]{1,80}?)\s*模型\s*(?:来|去|进行)?\s*(?=(?:创建|生成|创作|制作|画|绘制))/i, /^(?:(?:请|麻烦)\s*)?(?:(?:帮我|给我)\s*)?(?:使用|用|采用|选择|选用)\s*([A-Za-z0-9][A-Za-z0-9 ._+\-/]{0,79}?)\s*(?:来|去)?\s*(?=(?:创建|生成|创作|制作|画|绘制))/i, /^(?:please\s+)?(?:use|with|choose|select)\s+(.{1,80}?)\s+(?:model\s+)?(?=(?:to\s+)?(?:create|generate|render|make))/i];
  for (const _0xa8b299 of _0x8a609e) {
    const _0x5badfb = _0xa8b299['exec'](_0x5d691c);
    const _0x4943b7 = String(_0x5badfb?.[0x1] || '')['trim']();
    if (!_0x4943b7) {
      continue;
    }
    return {
      'message': _0x5d691c,
      'reference': _0x4943b7,
      'prefixLength': _0x5badfb[0x0]["length"]
    };
  }
  return null;
}
function applyExplicitUserModelDefaults(_0xa1b245, _0x27c530 = {}, {
  userMessage = ''
} = {}) {
  if (!Array["isArray"](_0xa1b245?.["actions"]) || _0xa1b245["actions"]["length"] === 0x0) {
    return {
      'plan': _0xa1b245,
      'trace': []
    };
  }
  const _0x340bfa = matchExplicitUserModelDirective(userMessage);
  if (!_0x340bfa) {
    return {
      'plan': _0xa1b245,
      'trace': []
    };
  }
  const _0x276953 = [];
  let _0x348198 = ![];
  const _0x5cd9c7 = _0xa1b245["actions"]['map'](_0x1c72ca => {
    if (_0x1c72ca["type"] !== "node.create") {
      return _0x1c72ca;
    }
    const _0x2483c7 = CREATE_NODE_KINDS[String(_0x1c72ca["args"]?.["type"] || '')] || '';
    if (!_0x2483c7) {
      return _0x1c72ca;
    }
    const _0x17bb59 = findContextModelByReference(_0x27c530, _0x340bfa["reference"], {
      'kind': _0x2483c7
    });
    const _0x281c7a = _0x17bb59?.["model"] || null;
    if (!_0x281c7a?.["modelId"]) {
      return _0x1c72ca;
    }
    const _0x1c1124 = String(_0x1c72ca["args"]?.["model"] || _0x1c72ca["args"]?.["modelId"] || '')["trim"]();
    const _0x20fd0b = String(_0x1c72ca["args"]?.['provider'] || '')["trim"]();
    const _0xf42d3f = String(_0x281c7a["provider"] || _0x20fd0b)["trim"]();
    if (_0x1c1124 === _0x281c7a['modelId'] && _0x20fd0b === _0xf42d3f) {
      return _0x1c72ca;
    }
    const _0x48edfe = {
      ..._0x1c72ca["args"],
      'model': _0x281c7a["modelId"],
      'provider': _0xf42d3f
    };
    Object["hasOwn"](_0x1c72ca["args"] || {}, 'modelId') && (_0x48edfe["modelId"] = _0x281c7a["modelId"]);
    _0x348198 = !![];
    _0x276953['push']({
      'type': "explicit_model_default_applied",
      'actionType': _0x1c72ca["type"],
      'alias': String(_0x1c72ca["alias"] || _0x1c72ca['as'] || ''),
      'reference': _0x340bfa["reference"],
      'source': _0x17bb59["source"],
      'modelId': _0x281c7a['modelId'],
      'provider': _0xf42d3f,
      'replacedModelId': _0x1c1124,
      'reason': "explicit user model reference matched one disclosed context model"
    });
    return {
      ..._0x1c72ca,
      'args': _0x48edfe
    };
  });
  return {
    'plan': _0x348198 ? {
      ..._0xa1b245,
      'actions': _0x5cd9c7
    } : _0xa1b245,
    'trace': _0x276953
  };
}
function canonicalizePlanModelReferences(_0x22d946, _0x2e3fcb = {}) {
  if (!Array["isArray"](_0x22d946?.["actions"]) || _0x22d946["actions"]["length"] === 0x0) {
    return {
      'plan': _0x22d946,
      'trace': []
    };
  }
  const _0x908f39 = [];
  let _0x53bae9 = ![];
  const _0x534b26 = _0x22d946["actions"]["map"](_0x5a431c => {
    if (_0x5a431c["type"] !== "node.create" && _0x5a431c['type'] !== "node.setModel" && _0x5a431c["type"] !== "node.changeModel") {
      return _0x5a431c;
    }
    const _0x354b0d = String(_0x5a431c["args"]?.['model'] || _0x5a431c["args"]?.["modelId"] || '')["trim"]();
    if (!_0x354b0d || normalizeModelPlaceholder(_0x354b0d)) {
      return _0x5a431c;
    }
    const _0x2efc28 = _0x5a431c["type"] === "node.create" ? CREATE_NODE_KINDS[String(_0x5a431c['args']?.["type"] || '')] || '' : '';
    const _0x233f7a = findContextModelByReference(_0x2e3fcb, _0x354b0d, {
      'kind': _0x2efc28
    });
    const _0x151a5f = _0x233f7a?.['model'] || null;
    if (!_0x151a5f?.["modelId"] || _0x354b0d === _0x151a5f["modelId"]) {
      return _0x5a431c;
    }
    const _0x16ef95 = {
      ..._0x5a431c['args'],
      'model': _0x151a5f['modelId'],
      'provider': _0x151a5f["provider"] || String(_0x5a431c["args"]?.["provider"] || '')["trim"]()
    };
    Object["hasOwn"](_0x5a431c['args'] || {}, "modelId") && (_0x16ef95["modelId"] = _0x151a5f["modelId"]);
    _0x53bae9 = !![];
    _0x908f39['push']({
      'type': 'model_reference_canonicalized',
      'actionType': _0x5a431c["type"],
      'alias': String(_0x5a431c["alias"] || _0x5a431c['as'] || ''),
      'source': _0x233f7a["source"],
      'modelId': _0x151a5f["modelId"],
      'provider': _0x151a5f["provider"] || '',
      'reason': "planner model display name matched one disclosed context model"
    });
    return {
      ..._0x5a431c,
      'args': _0x16ef95
    };
  });
  return {
    'plan': _0x53bae9 ? {
      ..._0x22d946,
      'actions': _0x534b26
    } : _0x22d946,
    'trace': _0x908f39
  };
}
function isExplicitUserModelSelection(_0x4b4d85, _0x2c0ed0 = {}, {
  userMessage = ''
} = {}) {
  const _0x543517 = matchExplicitUserModelDirective(userMessage);
  if (!_0x543517) {
    return ![];
  }
  const _0x4a696a = CREATE_NODE_KINDS[String(_0x4b4d85["args"]?.['type'] || '')] || '';
  const _0x44d707 = findContextModelByReference(_0x2c0ed0, _0x543517["reference"], {
    'kind': _0x4a696a
  });
  const _0x32bd6b = String(_0x4b4d85["args"]?.["model"] || _0x4b4d85["args"]?.["modelId"] || '')["trim"]();
  return Boolean(_0x32bd6b && _0x44d707?.['model']?.['modelId'] === _0x32bd6b);
}
function removeUnavailableImplicitCreateModels(_0x130b8f, _0x3f2c68 = {}, {
  userMessage = ''
} = {}) {
  if (!Array["isArray"](_0x130b8f?.["actions"]) || _0x130b8f["actions"]["length"] === 0x0) {
    return {
      'plan': _0x130b8f,
      'trace': []
    };
  }
  const _0x43bb91 = getSelectedInputKinds(_0x3f2c68);
  const _0x14169a = [];
  let _0x8fd290 = ![];
  const _0x4620eb = _0x130b8f["actions"]["map"](_0x5e12cc => {
    if (_0x5e12cc["type"] !== 'node.create') {
      return _0x5e12cc;
    }
    const _0x2aa654 = String(_0x5e12cc["args"]?.["model"] || _0x5e12cc['args']?.["modelId"] || '')["trim"]();
    const _0x527e42 = findContextModel(_0x3f2c68, _0x2aa654);
    if (!_0x527e42 || !modelRequiresUnavailableInput(_0x527e42, _0x43bb91) || isExplicitUserModelSelection(_0x5e12cc, _0x3f2c68, {
      'userMessage': userMessage
    })) {
      return _0x5e12cc;
    }
    const _0x25d4bf = {
      ..._0x5e12cc['args']
    };
    delete _0x25d4bf["model"];
    delete _0x25d4bf['modelId'];
    delete _0x25d4bf["provider"];
    _0x8fd290 = !![];
    _0x14169a["push"]({
      'type': "incompatible_implicit_model_removed",
      'actionType': _0x5e12cc["type"],
      'alias': String(_0x5e12cc["alias"] || _0x5e12cc['as'] || ''),
      'modelId': _0x2aa654,
      'reason': "planner-selected model requires a media input unavailable to this create request"
    });
    return {
      ..._0x5e12cc,
      'args': _0x25d4bf
    };
  });
  return {
    'plan': _0x8fd290 ? {
      ..._0x130b8f,
      'actions': _0x4620eb
    } : _0x130b8f,
    'trace': _0x14169a
  };
}
const RUNTIME_GENERATION_NODE_TARGET_ACTIONS = new Set(['node.setPrompt', "node.appendPrompt", "node.setParams", "node.setModel", "node.changeModel", 'generation.run']);
function applyRuntimeNodeTargetDefaults(_0x5433cf, {
  runtimeProvenance = {},
  commandContext = {}
} = {}) {
  if (!Array['isArray'](_0x5433cf?.["actions"]) || _0x5433cf["actions"]['length'] === 0x0) {
    return {
      'plan': _0x5433cf,
      'trace': []
    };
  }
  const _0x400a42 = getCommandState(commandContext);
  const _0x5c48dd = [...new Set((Array["isArray"](runtimeProvenance["createdNodeIds"]) ? runtimeProvenance["createdNodeIds"] : [])['map'](_0x1a5a83 => String(_0x1a5a83 || '')["trim"]())["filter"](_0x5cce2b => _0x5cce2b && isAgentGenerationNode(_0x400a42["nodes"]?.[_0x5cce2b])))];
  if (_0x5c48dd['length'] !== 0x1) {
    return {
      'plan': _0x5433cf,
      'trace': []
    };
  }
  const _0x2fe3cd = _0x5c48dd[0x0];
  const _0x6a6c2d = [];
  let _0x231767 = ![];
  const _0x4d4455 = _0x5433cf["actions"]['map'](_0x4de3b7 => {
    if (!RUNTIME_GENERATION_NODE_TARGET_ACTIONS["has"](String(_0x4de3b7?.["type"] || ''))) {
      return _0x4de3b7;
    }
    const _0x3dabf6 = String(_0x4de3b7?.["args"]?.['nodeId'] || '')["trim"]();
    if (_0x3dabf6 && _0x400a42["nodes"]?.[_0x3dabf6]) {
      return _0x4de3b7;
    }
    _0x231767 = !![];
    _0x6a6c2d["push"]({
      'type': 'runtime_target_default_applied',
      'actionType': _0x4de3b7["type"],
      'nodeId': _0x2fe3cd,
      ...(_0x3dabf6 ? {
        'requestedNodeId': _0x3dabf6
      } : {}),
      'reason': _0x3dabf6 ? "planner target was not found and one runtime-created generation node remains in scope" : "one runtime-created generation node remains in scope"
    });
    return {
      ..._0x4de3b7,
      'args': {
        ...(_0x4de3b7["args"] || {}),
        'nodeId': _0x2fe3cd
      }
    };
  });
  return {
    'plan': _0x231767 ? {
      ..._0x5433cf,
      'actions': _0x4d4455
    } : _0x5433cf,
    'trace': _0x6a6c2d
  };
}
function applyNodeCreateTypeDefaults(_0x41b2a5, _0x5e57c2 = {}) {
  const _0x515575 = String(_0x5e57c2?.["canvas"]?.["modelCatalog"]?.["targetKind"] || '')["trim"]();
  const _0x158103 = CREATE_NODE_TYPE_BY_KIND[_0x515575] || '';
  if (!_0x158103 || !Array['isArray'](_0x41b2a5?.["actions"])) {
    return {
      'plan': _0x41b2a5,
      'trace': []
    };
  }
  let _0x258587 = ![];
  const _0x503aa6 = [];
  const _0x159cb5 = _0x41b2a5['actions']["map"](_0x1d7295 => {
    if (_0x1d7295['type'] !== "node.create" || String(_0x1d7295['args']?.["type"] || '')["trim"]()) {
      return _0x1d7295;
    }
    _0x258587 = !![];
    _0x503aa6["push"]({
      'type': "contextual_default_applied",
      'field': "type",
      'actionType': "node.create",
      'value': _0x158103,
      'reason': "canvas model target kind is " + _0x515575
    });
    return {
      ..._0x1d7295,
      'args': {
        ..._0x1d7295["args"],
        'type': _0x158103
      }
    };
  });
  return {
    'plan': _0x258587 ? {
      ..._0x41b2a5,
      'actions': _0x159cb5
    } : _0x41b2a5,
    'trace': _0x503aa6
  };
}
function normalizeModelPlaceholder(_0xe0f93d = '') {
  const _0x274470 = String(_0xe0f93d || '')["trim"]()['toLowerCase']();
  return !_0x274470 || _0x274470 === "auto" || _0x274470 === "default" || _0x274470 === "unknown";
}
function getSelectedInputKinds(_0x8a4da6 = {}) {
  const _0x33db4e = Array["isArray"](_0x8a4da6?.["canvas"]?.["modelCatalog"]?.['selectedInputKinds']) ? _0x8a4da6["canvas"]["modelCatalog"]["selectedInputKinds"] : [];
  const _0x578705 = Array['isArray'](_0x8a4da6?.["canvas"]?.["selectedNodes"]) ? _0x8a4da6["canvas"]["selectedNodes"] : [];
  const _0x16204e = new Set(_0x33db4e["map"](_0x3104c6 => String(_0x3104c6 || ''))["filter"](Boolean));
  for (const _0x19685c of _0x578705) {
    const _0x1b1742 = String(_0x19685c?.["type"] || '');
    if (_0x1b1742["includes"]('image')) {
      _0x16204e["add"]("image");
    }
    if (_0x1b1742["includes"]("video")) {
      _0x16204e["add"]("video");
    }
    if (_0x1b1742["includes"]("audio")) {
      _0x16204e["add"]("audio");
    }
    if (_0x1b1742["includes"]("text")) {
      _0x16204e["add"]("text");
    }
  }
  return _0x16204e;
}
function modelRequiresUnavailableInput(_0x529f69 = {}, _0x1c310a = new Set()) {
  const _0xaa1289 = _0x529f69?.["inputSlots"] && typeof _0x529f69['inputSlots'] === "object" ? _0x529f69["inputSlots"] : {};
  for (const [_0x31efdc, _0x43a066] of Object["entries"](_0xaa1289["minByKind"] || {})) {
    if (_0x31efdc !== 'text' && Number(_0x43a066) > 0x0 && !_0x1c310a["has"](_0x31efdc)) {
      return !![];
    }
  }
  const _0x1f17f7 = Array["isArray"](_0xaa1289['fixedSlots']) ? _0xaa1289['fixedSlots'] : [];
  return _0x1f17f7["some"](_0x2e2eea => {
    const _0x54deb3 = String(_0x2e2eea?.['kind'] || '');
    return _0x54deb3 && _0x54deb3 !== "text" && _0x2e2eea?.["required"] === !![] && !_0x1c310a["has"](_0x54deb3);
  });
}
function findHintCompatibleModel(_0xf42609 = {}, _0x42f6f2 = '', _0x1cc5d1 = {}) {
  const _0x2e0858 = Array["isArray"](_0xf42609?.["canvas"]?.['availableModels']) ? _0xf42609["canvas"]['availableModels'] : [];
  const _0x22b4d4 = getSelectedInputKinds(_0xf42609);
  return _0x2e0858["filter"](_0x189127 => _0x189127?.["modelId"] && String(_0x189127["kind"] || '') === _0x42f6f2 && !modelRequiresUnavailableInput(_0x189127, _0x22b4d4))["map"](_0x28d64c => {
    const _0x3a70e7 = buildSupportedAgentParamsFromHints(_0x28d64c, _0x1cc5d1);
    return {
      'model': _0x28d64c,
      'supported': _0x3a70e7,
      'score': _0x3a70e7["appliedParamIds"]["length"]
    };
  })["filter"](_0x3618f5 => _0x3618f5["score"] > 0x0)["sort"]((_0x4f65fc, _0x2a8ff7) => {
    if (_0x2a8ff7["score"] !== _0x4f65fc['score']) {
      return _0x2a8ff7['score'] - _0x4f65fc['score'];
    }
    return String(_0x4f65fc["model"]["modelId"])["localeCompare"](String(_0x2a8ff7["model"]["modelId"]));
  })[0x0]?.["model"] || null;
}
function applyContextualPlanDefaults(_0x2fafc5, _0x5a838d = {}) {
  const _0x325751 = findSelectedImageNodeId(_0x5a838d);
  const _0x5e9aaf = _0x325751 ? findImageToVideoModel(_0x5a838d) : null;
  if (!_0x325751 || !_0x5e9aaf) {
    return {
      'plan': _0x2fafc5,
      'trace': []
    };
  }
  const _0x4792dc = new Map();
  const _0x5702e2 = [];
  let _0xa97ed9 = ![];
  const _0x52d2e1 = [];
  for (const _0x35eccd of _0x2fafc5["actions"]) {
    let _0xc17c31 = _0x35eccd;
    if (_0x35eccd["type"] === "node.create" && _0x35eccd['args']?.["type"] === "ai-video") {
      const _0x22d683 = String(_0x35eccd["args"]['model'] || _0x35eccd["args"]["modelId"] || '')["trim"]();
      const _0x4595b0 = _0x22d683 ? findContextModel(_0x5a838d, _0x22d683) : null;
      const _0x3e7669 = _0x4595b0 || _0x5e9aaf;
      (!_0x22d683 || !_0x4595b0) && _0x3e7669?.["modelId"] && (_0xc17c31 = {
        ..._0x35eccd,
        'args': {
          ..._0x35eccd["args"],
          'model': _0x3e7669["modelId"],
          'provider': _0x3e7669["provider"] || ''
        }
      }, _0xa97ed9 = !![], _0x52d2e1['push']({
        'type': "contextual_default_applied",
        'field': 'model',
        'actionType': _0x35eccd["type"],
        'alias': String(_0x35eccd["alias"] || _0x35eccd['as'] || ''),
        'selectedImageId': _0x325751,
        'modelId': _0x3e7669['modelId'],
        'provider': _0x3e7669['provider'] || '',
        'reason': _0x4595b0 ? "requested model was available in context" : 'selected\x20image\x20has\x20compatible\x20image-to-video\x20model'
      }));
      _0x35eccd["alias"] && _0x3e7669 && _0x4792dc["set"](_0x35eccd['alias'], getModelFieldIds(_0x3e7669));
    }
    if (_0xc17c31["type"] === "node.setParams") {
      const _0x179def = getAliasNodeIdReference(_0xc17c31["args"]?.["nodeId"]);
      const _0x19232b = _0x179def ? _0x4792dc["get"](_0x179def) : null;
      const _0x5a6948 = _0xc17c31['args']?.["params"] && typeof _0xc17c31['args']["params"] === 'object' && !Array['isArray'](_0xc17c31["args"]["params"]) ? _0xc17c31["args"]['params'] : null;
      if (_0x19232b && _0x5a6948) {
        const _0x4e0eb9 = {};
        for (const [_0x13ca35, _0x36ca43] of Object["entries"](_0x5a6948)) {
          if (_0x19232b["has"](_0x13ca35)) {
            _0x4e0eb9[_0x13ca35] = _0x36ca43;
          }
        }
        if (Object['keys'](_0x4e0eb9)["length"] !== Object["keys"](_0x5a6948)["length"]) {
          _0xa97ed9 = !![];
          _0x52d2e1['push']({
            'type': "params_filtered",
            'actionType': _0xc17c31["type"],
            'alias': _0x179def,
            'keptParamIds': Object['keys'](_0x4e0eb9),
            'removedParamIds': Object["keys"](_0x5a6948)["filter"](_0x2a753f => !_0x19232b["has"](_0x2a753f)),
            'reason': "target model uiSchema does not declare removed params"
          });
          if (Object['keys'](_0x4e0eb9)["length"] === 0x0) {
            continue;
          }
          _0xc17c31 = {
            ..._0xc17c31,
            'args': {
              ..._0xc17c31["args"],
              'params': _0x4e0eb9
            }
          };
        }
      }
    }
    _0x5702e2["push"](_0xc17c31);
  }
  return {
    'plan': _0xa97ed9 ? {
      ..._0x2fafc5,
      'actions': _0x5702e2
    } : _0x2fafc5,
    'trace': _0x52d2e1
  };
}
function getActionParamAlias(_0xafa71e = {}) {
  return _0xafa71e["type"] === 'node.setParams' ? getAliasNodeIdReference(_0xafa71e["args"]?.['nodeId']) : '';
}
function mergeParams(_0x2f455f = {}, _0xe4be9a = {}) {
  return {
    ...getPlainObject(_0x2f455f),
    ...getPlainObject(_0xe4be9a)
  };
}
function applyUserParameterHints(_0x2835fa, _0x11b440 = {}, {
  userMessage = ''
} = {}) {
  const _0x44b7ed = extractAgentParameterHints(userMessage || _0x11b440?.["userMessage"] || _0x11b440?.["message"] || '');
  if (!_0x44b7ed['hasHints'] || !Array['isArray'](_0x2835fa["actions"]) || _0x2835fa['actions']["length"] === 0x0) {
    return {
      'plan': _0x2835fa,
      'trace': []
    };
  }
  const _0x1ac7bb = new Set(_0x2835fa["actions"]["map"](getActionParamAlias)['filter'](Boolean));
  const _0x1f16d8 = new Map();
  const _0x3c6094 = [];
  const _0x53a5f0 = [];
  let _0x445f9b = ![];
  for (const _0x57986c of _0x2835fa["actions"]) {
    let _0x19039c = _0x57986c;
    if (_0x57986c["type"] === "node.create") {
      const _0x4f9e3e = String(_0x57986c["alias"] || '')["trim"]();
      const _0x107dff = CREATE_NODE_KINDS[String(_0x57986c["args"]?.["type"] || '')] || '';
      const _0x13109d = String(_0x57986c["args"]?.["model"] || _0x57986c['args']?.["modelId"] || '')["trim"]();
      let _0x3efffc = normalizeModelPlaceholder(_0x13109d) ? null : findContextModel(_0x11b440, _0x13109d);
      if (!_0x3efffc && _0x107dff) {
        const _0x37d4ce = findHintCompatibleModel(_0x11b440, _0x107dff, _0x44b7ed);
        _0x37d4ce && (_0x3efffc = _0x37d4ce, _0x19039c = {
          ..._0x19039c,
          'args': {
            ..._0x19039c["args"],
            'model': _0x37d4ce["modelId"],
            'provider': _0x37d4ce['provider'] || ''
          }
        }, _0x445f9b = !![], _0x3c6094["push"]({
          'type': "parameter_hints_model_applied",
          'actionType': _0x57986c["type"],
          'alias': _0x4f9e3e,
          'modelId': _0x37d4ce["modelId"],
          'provider': _0x37d4ce["provider"] || '',
          'reason': "user requested params selected compatible model"
        }));
      }
      if (_0x3efffc) {
        const _0x4fbe73 = buildSupportedAgentParamsFromHints(_0x3efffc, _0x44b7ed);
        const _0x13eb71 = getPlainObject(_0x4fbe73['params']);
        Object["keys"](_0x13eb71)["length"] > 0x0 && (_0x4f9e3e && _0x1ac7bb["has"](_0x4f9e3e) ? _0x1f16d8['set'](_0x4f9e3e, _0x13eb71) : (_0x19039c = {
          ..._0x19039c,
          'args': {
            ..._0x19039c["args"],
            'params': mergeParams(_0x19039c["args"]?.["params"], _0x13eb71)
          }
        }, _0x445f9b = !![]), _0x3c6094["push"]({
          'type': "parameter_hints_applied",
          'actionType': _0x57986c["type"],
          'alias': _0x4f9e3e,
          'appliedParamIds': Object["keys"](_0x13eb71),
          'params': _0x13eb71,
          'reason': "user requested supported generation params"
        }));
        _0x4fbe73["unsupportedParamIds"]["length"] > 0x0 && _0x4fbe73["appliedParamIds"]['length'] > 0x0 && _0x3c6094["push"]({
          'type': 'parameter_hints_unsupported',
          'actionType': _0x57986c["type"],
          'alias': _0x4f9e3e,
          'unsupportedParamIds': _0x4fbe73["unsupportedParamIds"],
          'reason': "user requested params unsupported by target model"
        });
      }
      _0x53a5f0['push'](_0x19039c);
      continue;
    }
    if (_0x57986c["type"] === "node.setParams") {
      const _0x433953 = getActionParamAlias(_0x57986c);
      const _0x2a4534 = _0x433953 ? _0x1f16d8["get"](_0x433953) : null;
      _0x2a4534 && (_0x19039c = {
        ..._0x57986c,
        'args': {
          ..._0x57986c['args'],
          'params': mergeParams(_0x57986c["args"]?.['params'], _0x2a4534)
        }
      }, _0x445f9b = !![]);
    }
    _0x53a5f0["push"](_0x19039c);
  }
  return {
    'plan': _0x445f9b ? {
      ..._0x2835fa,
      'actions': _0x53a5f0
    } : _0x2835fa,
    'trace': _0x3c6094
  };
}
function applyActionCountHints(_0x4e6fb6, {
  userMessage = ''
} = {}) {
  const _0xf174b6 = extractAgentDuplicateCountHint(userMessage);
  if (!_0xf174b6 || !Array['isArray'](_0x4e6fb6["actions"])) {
    return {
      'plan': _0x4e6fb6,
      'trace': []
    };
  }
  let _0x236c4a = ![];
  const _0x4d3cb1 = [];
  const _0x55492c = _0x4e6fb6["actions"]['map'](_0x2bf4b4 => {
    if (_0x2bf4b4["type"] !== "node.duplicate" || Object["prototype"]["hasOwnProperty"]["call"](_0x2bf4b4["args"] || {}, "copies")) {
      return _0x2bf4b4;
    }
    _0x236c4a = !![];
    _0x4d3cb1['push']({
      'type': "action_count_hint_applied",
      'actionType': _0x2bf4b4['type'],
      'field': "copies",
      'value': _0xf174b6,
      'reason': 'user\x20requested\x20an\x20explicit\x20duplicate\x20count'
    });
    return {
      ..._0x2bf4b4,
      'args': {
        ..._0x2bf4b4['args'],
        'copies': _0xf174b6
      }
    };
  });
  return {
    'plan': _0x236c4a ? {
      ..._0x4e6fb6,
      'actions': _0x55492c
    } : _0x4e6fb6,
    'trace': _0x4d3cb1
  };
}
function getCommandState(_0x3b8a02 = {}) {
  const _0x59624b = _0x3b8a02["store"] || _0x3b8a02["graphStore"];
  return _0x59624b?.["getStateRaw"]?.() || _0x59624b?.['getState']?.() || {};
}
function isAgentGenerationNode(_0x4d6e53 = {}) {
  return ['ai-image', "ai-video", "ai-audio", "ai-text"]['includes'](String(_0x4d6e53?.["type"] || '')["trim"]());
}
function applyCreatedGenerationBatchScope(_0x2c5794, {
  userMessage = '',
  runtimeProvenance = {},
  commandContext = {}
} = {}) {
  const _0x33d58e = extractAgentDuplicateCountHint(userMessage);
  if (!_0x33d58e || !Array['isArray'](_0x2c5794?.["actions"])) {
    return {
      'plan': _0x2c5794,
      'trace': []
    };
  }
  const _0x453224 = getCommandState(commandContext);
  const _0x512475 = Array['isArray'](runtimeProvenance["createdNodeIds"]) ? runtimeProvenance["createdNodeIds"]["map"](_0x395faa => String(_0x395faa || '')["trim"]())['filter'](Boolean) : [];
  const _0x705f83 = _0x512475["filter"](_0x1819fa => isAgentGenerationNode(_0x453224['nodes']?.[_0x1819fa]));
  if (_0x705f83['length'] !== _0x33d58e + 0x1) {
    return {
      'plan': _0x2c5794,
      'trace': []
    };
  }
  const _0x1772a0 = new Set(_0x705f83);
  let _0x439bc3 = ![];
  const _0x42c259 = [];
  const _0x59f4f1 = _0x2c5794['actions']['map'](_0x102ba9 => {
    if (_0x102ba9["type"] !== "generation.runBatch") {
      return _0x102ba9;
    }
    const _0x190e85 = Array["isArray"](_0x102ba9["args"]?.["nodeIds"]) ? [...new Set(_0x102ba9["args"]['nodeIds']['map'](_0x366f7f => String(_0x366f7f || '')["trim"]())["filter"](Boolean))] : [];
    if (_0x190e85['length'] !== _0x33d58e || !_0x190e85['every'](_0x1418ac => _0x1772a0["has"](_0x1418ac))) {
      return _0x102ba9;
    }
    _0x439bc3 = !![];
    _0x42c259["push"]({
      'type': "generation_scope_expanded",
      'actionType': _0x102ba9["type"],
      'requestedNodeIds': _0x190e85,
      'nodeIds': _0x705f83,
      'reason': "created source and requested copies belong to one generation batch"
    });
    return {
      ..._0x102ba9,
      'args': {
        ..._0x102ba9["args"],
        'nodeIds': _0x705f83
      }
    };
  });
  return {
    'plan': _0x439bc3 ? {
      ..._0x2c5794,
      'actions': _0x59f4f1
    } : _0x2c5794,
    'trace': _0x42c259
  };
}
function isExplicitBlankNodeRequest(_0x2de8a5 = '') {
  return /(?:空白?|空的)(?:图片|图像|视频|音频|文本)?节点|\b(?:empty|blank)\s+(?:image|video|audio|text)?\s*node\b/i['test'](String(_0x2de8a5 || ''));
}
function hasCreativeOutputIntent(_0xcb1b42 = '') {
  return /(?:创建|生成|创作|制作|画).*(?:图片|图像|视频|音频|文本|产品图|商品图|海报|封面|插画|效果图|宣传图|拼贴)|生成|创作|制作|做成|产品图|商品图|海报|封面|插画|效果图|宣传图|拼贴|\b(?:generate|render|create|make)\b.*\b(?:image|video|audio|text|poster|cover|collage)\b/i["test"](String(_0xcb1b42 || ''));
}
function buildCreativePromptDefault(_0x1438cb = '', _0x9d0ef9 = '') {
  const _0x3ec964 = String(_0x1438cb || '')["replace"](/\s+/g, '\x20')['trim']();
  const _0x39d85c = matchExplicitUserModelDirective(_0x3ec964);
  const _0x4f009c = _0x39d85c ? _0x39d85c["message"]["slice"](_0x39d85c["prefixLength"])["trim"]() : _0x3ec964;
  if (/产品图|商品图|product\s+(?:image|photo)/i["test"](_0x4f009c)) {
    return '极简高级棚拍产品图，主体居中，干净背景，柔和轮廓光，商业摄影质感';
  }
  const _0x4b2260 = _0x4f009c["replace"](/^(?:请|麻烦)?(?:帮我|给我)?(?:创建|生成|制作|创作|画)(?:一张|一个|一幅|一段)?\s*/i, '')["replace"](/[，,]?(?:然后|再|并)?(?:复制|拷贝).*$/i, '')["replace"](/[，,]?(?:然后|再|并)?做成拼贴.*$/i, '')['replace'](/[，,]?(?:然后|再|并)?(?:把|将)?(?:比例|宽高比|尺寸|时长|模型|分辨率).*$/i, '')['replace'](/[。！？!?]+$/g, '')["trim"]();
  const _0x376f0d = _0x4b2260 || "符合当前创作需求的内容";
  const _0x2898ea = {
    'ai-image': "主体明确，构图完整，光线自然，细节清晰",
    'ai-video': "画面连贯，主体稳定，运镜自然，细节清晰",
    'ai-audio': "层次清晰，音质干净，节奏自然",
    'ai-text': '结构清晰，表达准确，内容完整'
  };
  return _0x376f0d + '，' + (_0x2898ea[_0x9d0ef9] || _0x2898ea["ai-image"]);
}
function applyCreativePromptDefaults(_0x5d5944, {
  userMessage = ''
} = {}) {
  const _0x4295fd = String(userMessage || '')["trim"]();
  if (!_0x4295fd || !Array["isArray"](_0x5d5944?.["actions"]) || isExplicitBlankNodeRequest(_0x4295fd) || !hasCreativeOutputIntent(_0x4295fd)) {
    return {
      'plan': _0x5d5944,
      'trace': []
    };
  }
  let _0x1db870 = ![];
  const _0x2a2321 = [];
  const _0x20adfc = _0x5d5944['actions']['map'](_0x480ee6 => {
    if (_0x480ee6["type"] !== 'node.create') {
      return _0x480ee6;
    }
    const _0x327094 = String(_0x480ee6["args"]?.["type"] || '')["trim"]();
    if (!["ai-image", "ai-video", 'ai-audio', "ai-text"]['includes'](_0x327094)) {
      return _0x480ee6;
    }
    const _0x235311 = String(_0x480ee6["args"]?.["prompt"] || _0x480ee6["args"]?.['nodeData']?.['prompt'] || _0x480ee6["args"]?.["data"]?.["prompt"] || '')["trim"]();
    if (_0x235311) {
      return _0x480ee6;
    }
    _0x1db870 = !![];
    _0x2a2321['push']({
      'type': 'creative_prompt_default_applied',
      'actionType': _0x480ee6["type"],
      'nodeType': _0x327094,
      'reason': 'planner\x20omitted\x20prompt\x20for\x20an\x20explicit\x20creative\x20request'
    });
    return {
      ..._0x480ee6,
      'args': {
        ..._0x480ee6["args"],
        'prompt': buildCreativePromptDefault(_0x4295fd, _0x327094)
      }
    };
  });
  return {
    'plan': _0x1db870 ? {
      ..._0x5d5944,
      'actions': _0x20adfc
    } : _0x5d5944,
    'trace': _0x2a2321
  };
}
function buildRiskContext(_0x4af6e8 = {}) {
  return {
    'createdNodeAliases': new Set(),
    'createdEdgeAliases': new Set(),
    'createdNodeIds': new Set(Array["isArray"](_0x4af6e8['createdNodeIds']) ? _0x4af6e8["createdNodeIds"]["map"](_0x5f1ccb => String(_0x5f1ccb || '')['trim']())["filter"](Boolean) : []),
    'createdEdgeIds': new Set(Array["isArray"](_0x4af6e8["createdEdgeIds"]) ? _0x4af6e8["createdEdgeIds"]['map'](_0x6a1366 => String(_0x6a1366 || '')["trim"]())["filter"](Boolean) : [])
  };
}
function rememberActionAlias(_0x43d597 = {}, _0x1bd672 = {}) {
  const _0x483d47 = String(_0x43d597["alias"] || '')['trim']();
  if (!_0x483d47) {
    return;
  }
  _0x43d597["type"] === 'node.create' && _0x1bd672["createdNodeAliases"]["add"](_0x483d47);
  isSamePlanConnectionPreparation(_0x43d597, _0x1bd672) && _0x1bd672["createdEdgeAliases"]["add"](_0x483d47);
}
export function validateAgentPlan(_0x510941, {
  commandRegistry = canvasCommandRegistry,
  commandContext = {},
  agentContext = {},
  userMessage = '',
  traceRecorder = null,
  runtimeProvenance = {}
} = {}) {
  const _0x25bb8e = applyNodeCreateTypeDefaults(normalizeAgentPlan(_0x510941), agentContext);
  const _0x3ae56d = applyRuntimeNodeTargetDefaults(_0x25bb8e["plan"], {
    'runtimeProvenance': runtimeProvenance,
    'commandContext': commandContext
  });
  const _0x30f62a = applyExplicitUserModelDefaults(_0x3ae56d['plan'], agentContext, {
    'userMessage': userMessage
  });
  const _0x50ad1e = canonicalizePlanModelReferences(_0x30f62a['plan'], agentContext);
  const _0x1abac3 = removeUnavailableImplicitCreateModels(_0x50ad1e["plan"], agentContext, {
    'userMessage': userMessage
  });
  const _0xf9cc44 = applyContextualPlanDefaults(_0x1abac3["plan"], agentContext);
  const _0x186416 = applyUserParameterHints(_0xf9cc44["plan"], agentContext, {
    'userMessage': userMessage
  });
  const _0x3afe86 = applyActionCountHints(_0x186416["plan"], {
    'userMessage': userMessage
  });
  const _0x40c9e7 = applyCreativePromptDefaults(_0x3afe86["plan"], {
    'userMessage': userMessage
  });
  const _0x23cb89 = applyCreatedGenerationBatchScope(_0x40c9e7["plan"], {
    'userMessage': userMessage,
    'runtimeProvenance': runtimeProvenance,
    'commandContext': commandContext
  });
  const _0x3e4d79 = _0x23cb89["plan"];
  for (const _0x1df5c5 of _0x25bb8e['trace']) {
    traceRecorder?.(_0x1df5c5);
  }
  for (const _0x5e0292 of _0x3ae56d["trace"]) {
    traceRecorder?.(_0x5e0292);
  }
  for (const _0x5a691a of _0x30f62a["trace"]) {
    traceRecorder?.(_0x5a691a);
  }
  for (const _0x39f803 of _0x50ad1e["trace"]) {
    traceRecorder?.(_0x39f803);
  }
  for (const _0x5233bb of _0x1abac3["trace"]) {
    traceRecorder?.(_0x5233bb);
  }
  for (const _0x36e63a of _0xf9cc44["trace"]) {
    traceRecorder?.(_0x36e63a);
  }
  for (const _0x11e051 of _0x186416['trace']) {
    traceRecorder?.(_0x11e051);
  }
  for (const _0x4e494d of _0x3afe86["trace"]) {
    traceRecorder?.(_0x4e494d);
  }
  for (const _0x2faeef of _0x40c9e7["trace"]) {
    traceRecorder?.(_0x2faeef);
  }
  for (const _0x153661 of _0x23cb89["trace"]) {
    traceRecorder?.(_0x153661);
  }
  if (_0x3e4d79["status"] === "failed") {
    return {
      'ok': ![],
      'status': "failed",
      'errorCode': 'AGENT_PLAN_FAILED',
      'message': _0x3e4d79['reply'] || "Agent planner failed.",
      'plan': _0x3e4d79
    };
  }
  if (_0x3e4d79["status"] === "chat") {
    return {
      'ok': !![],
      'status': 'chat',
      'riskLevel': "safe",
      'plan': {
        ..._0x3e4d79,
        'status': "chat",
        'actions': [],
        'requiresConfirmation': ![]
      }
    };
  }
  if (_0x3e4d79['status'] === 'need_clarification') {
    const _0x478ecb = String(_0x3e4d79["question"] || _0x3e4d79["reply"] || '')["trim"]();
    if (!_0x478ecb) {
      return buildFailure("Clarification plans require question.", {
        'plan': _0x3e4d79
      });
    }
    return {
      'ok': !![],
      'status': "need_clarification",
      'plan': {
        ..._0x3e4d79,
        'question': _0x478ecb
      },
      'riskLevel': "safe"
    };
  }
  if (_0x3e4d79["actions"]['length'] === 0x0) {
    return buildFailure("Ready or confirmation plans require at least one action.", {
      'plan': _0x3e4d79
    });
  }
  let _0xdee308 = 'safe';
  const _0x4dc1a2 = [];
  const _0xde2230 = buildRiskContext(runtimeProvenance);
  const _0x5eff1 = Array['isArray'](agentContext?.["commands"]) ? new Set(agentContext['commands']['map'](_0x436f03 => String(_0x436f03?.['id'] || _0x436f03 || '')["trim"]())["filter"](Boolean)) : null;
  for (const _0x259e15 of _0x3e4d79["actions"]) {
    const _0x1a3efe = commandRegistry?.["get"]?.(_0x259e15["type"]);
    if (!_0x1a3efe) {
      return {
        'ok': ![],
        'status': 'failed',
        'errorCode': "UNKNOWN_AGENT_ACTION",
        'message': "Unknown canvas command in agent plan: " + _0x259e15["type"],
        'plan': _0x3e4d79
      };
    }
    if (_0x5eff1 && !_0x5eff1['has'](_0x259e15["type"])) {
      return {
        'ok': ![],
        'status': "failed",
        'errorCode': 'DEFERRED_AGENT_ACTION',
        'message': "Canvas command was not disclosed for this agent turn: " + _0x259e15["type"],
        'plan': _0x3e4d79
      };
    }
    const {
      risk: _0x1c412b,
      reason: _0x32f7c1
    } = getActionRisk(_0x259e15, _0x1a3efe, _0xde2230);
    if (_0x1c412b === "blocked") {
      return {
        'ok': ![],
        'status': "failed",
        'errorCode': "BLOCKED_AGENT_ACTION",
        'message': "Blocked canvas command in agent plan: " + _0x259e15["type"],
        'plan': _0x3e4d79
      };
    }
    const _0x66a4fe = hasCanvasCommandPlanVariableReference(_0x259e15["args"]);
    if (!_0x66a4fe && typeof _0x1a3efe["validate"] === "function") {
      const _0x381217 = _0x1a3efe["validate"](_0x259e15["args"], commandContext);
      if (_0x381217?.['ok'] === ![]) {
        return {
          'ok': ![],
          'status': "failed",
          'errorCode': _0x381217['errorCode'] || "ACTION_ARGS_INVALID",
          'message': _0x381217["message"] || "Invalid args for " + _0x259e15["type"],
          'details': _0x381217["details"],
          'plan': _0x3e4d79
        };
      }
    }
    _0xdee308 = maxRisk(_0xdee308, _0x1c412b);
    _0x1c412b !== "safe" && _0x32f7c1 && traceRecorder?.({
      'type': 'action_risk_elevated',
      'actionType': _0x259e15["type"],
      'riskLevel': _0x1c412b,
      'reason': _0x32f7c1
    });
    const _0x27e086 = {
      ..._0x259e15,
      'riskLevel': _0x1c412b,
      ...(_0x32f7c1 ? {
        'riskReason': _0x32f7c1
      } : {})
    };
    _0x4dc1a2["push"](_0x27e086);
    rememberActionAlias(_0x259e15, _0xde2230);
  }
  const _0x11f6e8 = _0xdee308 === 'confirm' || _0xdee308 === "danger";
  if (_0x11f6e8) {
    const _0x3e49a0 = _0x4dc1a2["find"](_0x2e9122 => String(_0x2e9122["riskLevel"] || "safe") !== 'safe') || _0x4dc1a2[0x0] || null;
    traceRecorder?.({
      'type': "confirmation_required",
      'actionType': String(_0x3e49a0?.['type'] || ''),
      'riskLevel': _0xdee308,
      'reason': _0x3e49a0?.['riskReason'] || "action risk requires confirmation"
    });
    return {
      'ok': !![],
      'status': "need_confirmation",
      'riskLevel': _0xdee308,
      'plan': {
        ..._0x3e4d79,
        'status': "need_confirmation",
        'requiresConfirmation': !![],
        'riskLevel': _0xdee308,
        'actions': _0x4dc1a2
      }
    };
  }
  return {
    'ok': !![],
    'status': 'ready',
    'riskLevel': _0xdee308,
    'plan': {
      ..._0x3e4d79,
      'status': "ready",
      'requiresConfirmation': ![],
      'riskLevel': _0xdee308,
      'actions': _0x4dc1a2
    }
  };
}