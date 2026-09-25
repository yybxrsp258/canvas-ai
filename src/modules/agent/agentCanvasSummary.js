import { getExecutionManifest, listModelManifests, resolveModelExecution } from '../../manifests/index.js';
import { buildCanvasSummary } from '../canvasCommands/graphCommands.js';
import { normalizeAgentSearchKey, normalizeAgentSearchText } from './agentCapabilityDiscovery.js';
const DEFAULT_PROMPT_PREVIEW_LIMIT = 0x1f4;
const REFERENCE_PROMPT_PREVIEW_LIMIT = 0xb4;
const DEFAULT_MODEL_LIMIT = 0x16;
const NO_INTENT_MODEL_LIMIT = 0xc;
const MODEL_KINDS = new Set(["image", "video", "audio", "text"]);
const NODE_TYPE_KIND_HINTS = Object["freeze"]({
  'ai-image': "image",
  'source-image': 'image',
  'storyboard': "image",
  'ai-video': 'video',
  'source-video': "video",
  'media-clip': 'video',
  'ai-audio': 'audio',
  'source-audio': "audio",
  'ai-text': 'text',
  'source-text': "text",
  'comment-note': "text",
  'storyboard-script': "text"
});
const MESSAGE_KIND_PATTERNS = Object["freeze"]({
  'image': Object["freeze"]([/\bimage\b/i, /\bpicture\b/i, /\bphoto\b/i, /\bposter\b/i, /\bthumbnail\b/i, /\billustration\b/i, /[\u56fe\u5716]\u7247/, /\u56fe\u50cf/, /\u7167\u7247/, /\u6d77\u62a5/, /\u5c01\u9762/, /(?:\u4ea7\u54c1\u56fe|\u5546\u54c1\u56fe|\u6548\u679c\u56fe|\u6982\u5ff5\u56fe)/, /(?:\u4f5c\u56fe|\u7ed8\u56fe|\u5e2e\u6211\u753b|\u8bf7(?:\u5e2e\u6211)?\u753b|\u753b(?:\u4e00|\u4e2a|\u5f20|\u5e45|\u53ea))/]),
  'video': Object["freeze"]([/\bvideo\b/i, /\bmovie\b/i, /\bfilm\b/i, /\banimation\b/i, /\banimate\b/i, /\bclip\b/i, /\u89c6\u9891/, /\u5f71\u7247/, /\u52a8\u753b/, /\u8fd0\u955c/]),
  'audio': Object["freeze"]([/\baudio\b/i, /\bvoice\b/i, /\bspeech\b/i, /\bsound\b/i, /\bmusic\b/i, /\u97f3\u9891/, /\u58f0\u97f3/, /\u914d\u97f3/, /\u97f3\u4e50/]),
  'text': Object['freeze']([/\btext\b/i, /\bcopy\b/i, /\bscript\b/i, /\bprompt\b/i, /\bstoryboard\b/i, /\u6587\u672c/, /\u6587\u5b57/, /\u811a\u672c/, /\u5206\u955c/, /\u63d0\u793a\u8bcd/, /\u6587\u6848/])
});
const MESSAGE_KIND_PRIORITY = Object["freeze"]({
  'video': 0x4,
  'image': 0x3,
  'audio': 0x2,
  'text': 0x1
});
function truncate(_0x510fe3, _0xde96ec = DEFAULT_PROMPT_PREVIEW_LIMIT) {
  const _0x4179ea = String(_0x510fe3 || '')["replace"](/<[^>]*>/g, '\x20')["replace"](/data:[^\s"'<>)]{20,}/gi, "[omitted-data-url]")["replace"](/[A-Za-z0-9+/]{120,}={0,2}/g, "[omitted-base64]")['replace'](/\s+/g, '\x20')["trim"]();
  if (_0x4179ea["length"] <= _0xde96ec) {
    return _0x4179ea;
  }
  return _0x4179ea["slice"](0x0, Math["max"](0x0, _0xde96ec - 0x3)) + '...';
}
function normalizeKind(_0x2f8a1c) {
  const _0x3ccc16 = String(_0x2f8a1c || '')["trim"]()["toLowerCase"]();
  return MODEL_KINDS["has"](_0x3ccc16) ? _0x3ccc16 : '';
}
function normalizeStringArray(_0x1c1cc0) {
  if (!Array["isArray"](_0x1c1cc0)) {
    return [];
  }
  const _0x4a01ea = [];
  const _0x23ef23 = new Set();
  for (const _0x59c827 of _0x1c1cc0) {
    const _0x2399b2 = String(_0x59c827 || '')["trim"]();
    if (!_0x2399b2 || _0x23ef23["has"](_0x2399b2)) {
      continue;
    }
    _0x4a01ea["push"](_0x2399b2);
    _0x23ef23["add"](_0x2399b2);
  }
  return _0x4a01ea;
}
function nodeTypeToInputKind(_0x4eacc0 = '') {
  return NODE_TYPE_KIND_HINTS[String(_0x4eacc0 || '')['trim']()] || '';
}
function getSelectedInputKinds(_0x5372a0 = []) {
  return new Set(_0x5372a0["map"](_0x189702 => nodeTypeToInputKind(_0x189702?.['type']))["filter"](Boolean));
}
function getManifestUiFieldIds(_0x269d11) {
  return new Set((Array['isArray'](_0x269d11?.['uiSchema']?.['fields']) ? _0x269d11["uiSchema"]["fields"] : [])["map"](_0x2864f5 => String(_0x2864f5?.['id'] || '')["trim"]())["filter"](Boolean));
}
function getManifestInputSlots(_0x637b6c) {
  return _0x637b6c?.["inputSlots"] && typeof _0x637b6c["inputSlots"] === "object" ? _0x637b6c["inputSlots"] : {};
}
function manifestAllowsInputKind(_0x4debda, _0x49c285) {
  const _0x3b6561 = getManifestInputSlots(_0x4debda);
  const _0x11a984 = normalizeStringArray(_0x3b6561["allowedKinds"]);
  if (_0x11a984['includes'](_0x49c285)) {
    return !![];
  }
  const _0x3046b3 = Number(_0x3b6561["maxByKind"]?.[_0x49c285]);
  if (Number['isFinite'](_0x3046b3) && _0x3046b3 > 0x0) {
    return !![];
  }
  const _0x4a2563 = Array["isArray"](_0x3b6561["fixedSlots"]) ? _0x3b6561["fixedSlots"] : [];
  return _0x4a2563["some"](_0xeb9b4 => String(_0xeb9b4?.['kind'] || '') === _0x49c285);
}
function getRequiredInputKinds(_0xb89033) {
  const _0x450c93 = getManifestInputSlots(_0xb89033);
  const _0x52811e = new Set();
  for (const [_0x358e97, _0x3ddfa9] of Object["entries"](_0x450c93["minByKind"] || {})) {
    if (Number(_0x3ddfa9) > 0x0 && _0x358e97 !== 'text') {
      _0x52811e['add'](_0x358e97);
    }
  }
  for (const _0xb65cca of Array["isArray"](_0x450c93["fixedSlots"]) ? _0x450c93['fixedSlots'] : []) {
    const _0x185421 = String(_0xb65cca?.["kind"] || '');
    if (_0x185421 && _0x185421 !== 'text' && _0xb65cca?.["required"] === !![]) {
      _0x52811e["add"](_0x185421);
    }
  }
  return _0x52811e;
}
function manifestSupportsTextOnlyInput(_0x5407dc) {
  if (getRequiredInputKinds(_0x5407dc)["size"] > 0x0) {
    return ![];
  }
  const _0x4f5ea0 = getManifestInputSlots(_0x5407dc);
  const _0x3ecc6a = normalizeStringArray(_0x4f5ea0["allowedKinds"]);
  if (_0x3ecc6a['length'] === 0x0 || _0x3ecc6a["includes"]("text")) {
    return !![];
  }
  if (Number(_0x4f5ea0['maxByKind']?.['text']) > 0x0 || Number(_0x4f5ea0["minByKind"]?.["text"]) > 0x0) {
    return !![];
  }
  return (Array["isArray"](_0x4f5ea0['fixedSlots']) ? _0x4f5ea0["fixedSlots"] : [])["some"](_0x4a0f86 => String(_0x4a0f86?.['kind'] || '') === "text");
}
function manifestHasAvailableRequiredInputs(_0x19891c, _0x5177f5 = new Set()) {
  for (const _0x3b9857 of getRequiredInputKinds(_0x19891c)) {
    if (!_0x5177f5["has"](_0x3b9857)) {
      return ![];
    }
  }
  return !![];
}
function scoreSelectedInputCompatibility(_0x59f7bd, {
  selectedInputKinds = new Set(),
  targetKind = '',
  userMessage = ''
} = {}) {
  if (!targetKind || selectedInputKinds['size'] === 0x0) {
    return 0x0;
  }
  let _0x159169 = 0x0;
  for (const _0x322f17 of selectedInputKinds) {
    _0x159169 += manifestAllowsInputKind(_0x59f7bd, _0x322f17) ? 0xb4 : -0x78;
  }
  for (const _0x551fd1 of getRequiredInputKinds(_0x59f7bd)) {
    if (!selectedInputKinds['has'](_0x551fd1)) {
      _0x159169 -= 0x1a4;
    }
  }
  if (targetKind === "video" && selectedInputKinds['has']("image")) {
    const _0x411e52 = getManifestUiFieldIds(_0x59f7bd);
    _0x411e52["has"]("duration") && /\d+\s*(?:s|sec|second|seconds|\u79d2)/i["test"](userMessage) && (_0x159169 += 0x23);
    _0x411e52["has"]("aspectRatio") && /(?:16:9|9:16|1:1|aspect|ratio|\u6bd4\u4f8b)/i["test"](userMessage) && (_0x159169 += 0x14);
  }
  return _0x159169;
}
function compactObject(_0x337b41, {
  maxKeys = 0xc,
  maxArrayItems = 0x8,
  maxString = 0xa0,
  depth = 0x0
} = {}) {
  if (_0x337b41 == null) {
    return _0x337b41;
  }
  if (typeof _0x337b41 === "string") {
    return truncate(_0x337b41, maxString);
  }
  if (typeof _0x337b41 !== "object") {
    return _0x337b41;
  }
  if (depth >= 0x2) {
    if (Array["isArray"](_0x337b41)) {
      return "[array:" + _0x337b41["length"] + ']';
    }
    return '[object]';
  }
  if (Array["isArray"](_0x337b41)) {
    return _0x337b41["slice"](0x0, maxArrayItems)["map"](_0x44bbbf => compactObject(_0x44bbbf, {
      'maxKeys': maxKeys,
      'maxArrayItems': maxArrayItems,
      'maxString': maxString,
      'depth': depth + 0x1
    }));
  }
  const _0x2452b7 = Object["entries"](_0x337b41)["filter"](([, _0x2707f0]) => _0x2707f0 !== undefined);
  const _0x1a79eb = {};
  for (const [_0x4fda2f, _0xce5892] of _0x2452b7["slice"](0x0, maxKeys)) {
    _0x1a79eb[_0x4fda2f] = compactObject(_0xce5892, {
      'maxKeys': maxKeys,
      'maxArrayItems': maxArrayItems,
      'maxString': maxString,
      'depth': depth + 0x1
    });
  }
  if (_0x2452b7["length"] > maxKeys) {
    _0x1a79eb["_truncatedKeys"] = _0x2452b7["length"] - maxKeys;
  }
  return _0x1a79eb;
}
function normalizeViewport(_0x2dfe1d = {}) {
  return {
    'x': Number["isFinite"](Number(_0x2dfe1d['x'])) ? Number(_0x2dfe1d['x']) : 0x0,
    'y': Number["isFinite"](Number(_0x2dfe1d['y'])) ? Number(_0x2dfe1d['y']) : 0x0,
    'zoom': Number['isFinite'](Number(_0x2dfe1d["zoom"])) ? Number(_0x2dfe1d["zoom"]) : 0x1
  };
}
function compactPlanningValue(_0x492389, {
  key = ''
} = {}) {
  if (_0x492389 == null || typeof _0x492389 === "number" || typeof _0x492389 === "boolean") {
    return _0x492389;
  }
  if (typeof _0x492389 === "string") {
    return truncate(_0x492389, key === "description" ? 0xb4 : 0xf0);
  }
  if (Array['isArray'](_0x492389)) {
    return _0x492389["map"](_0x1b9208 => compactPlanningValue(_0x1b9208, {
      'key': key
    }));
  }
  if (typeof _0x492389 !== 'object') {
    return _0x492389;
  }
  return Object["fromEntries"](Object["entries"](_0x492389)["map"](([_0x27c77d, _0x12e3c8]) => [_0x27c77d, compactPlanningValue(_0x12e3c8, {
    'key': _0x27c77d
  })]));
}
const MODEL_FIELD_PLANNING_KEYS = Object["freeze"](['variant', "description", 'min', "max", "step", "placeholder", "allowEmpty", 'randomSeedMin', "randomSeedMax", 'defaultValueAliases', "showWhen", "hideWhen", "disabled", "readOnly", 'modeField', "defaultModeValue", "customModeValue"]);
function summarizeModelField(_0x332b96 = {}, {
  optionLimit = 0x28
} = {}) {
  const _0x5efafb = {
    'id': String(_0x332b96?.['id'] || ''),
    'type': String(_0x332b96?.["type"] || ''),
    'label': String(_0x332b96?.["label"] || _0x332b96?.['id'] || ''),
    'defaultValue': _0x332b96?.['defaultValue'],
    'displayRole': String(_0x332b96?.["displayRole"] || ''),
    'options': Array["isArray"](_0x332b96?.['options']) ? _0x332b96["options"]['slice'](0x0, optionLimit)["map"](_0x180ab3 => {
      if (!_0x180ab3 || typeof _0x180ab3 !== "object") {
        return {
          'value': _0x180ab3,
          'label': String(_0x180ab3 || '')
        };
      }
      return {
        'value': _0x180ab3['value'],
        'label': String(_0x180ab3["label"] || _0x180ab3["value"] || ''),
        ...(_0x180ab3["selectedLabel"] ? {
          'selectedLabel': String(_0x180ab3["selectedLabel"])
        } : {}),
        ...(_0x180ab3['displayLabel'] ? {
          'displayLabel': String(_0x180ab3["displayLabel"])
        } : {}),
        ...(_0x180ab3['disabled'] === !![] ? {
          'disabled': !![]
        } : {}),
        ...(_0x180ab3["hidden"] === !![] ? {
          'hidden': !![]
        } : {})
      };
    }) : undefined
  };
  for (const _0x405b38 of MODEL_FIELD_PLANNING_KEYS) {
    if (_0x332b96[_0x405b38] === undefined) {
      continue;
    }
    _0x5efafb[_0x405b38] = _0x405b38 === "description" ? truncate(_0x332b96[_0x405b38], 0xb4) : compactObject(_0x332b96[_0x405b38], {
      'maxKeys': 0xc,
      'maxArrayItems': 0x10,
      'maxString': 0xb4
    });
  }
  return _0x5efafb;
}
function summarizeModel(_0x3e5673, {
  fieldLimit = 0x18,
  optionLimit = 0x28
} = {}) {
  const _0x502d06 = getExecutionManifest(_0x3e5673?.['executionId']);
  const _0x4f1b1d = Array["isArray"](_0x3e5673?.["uiSchema"]?.["fields"]) ? _0x3e5673["uiSchema"]["fields"] : [];
  return {
    'modelId': String(_0x3e5673?.['modelId'] || ''),
    'provider': String(_0x3e5673?.["provider"] || ''),
    'kind': String(_0x3e5673?.['kind'] || ''),
    'adapterType': String(_0x3e5673?.["adapterType"] || _0x502d06?.["adapterType"] || ''),
    'displayName': String(_0x3e5673?.['displayName'] || _0x3e5673?.["modelId"] || ''),
    'inputSlots': compactPlanningValue(_0x3e5673?.['inputSlots'] || {}),
    'outputType': String(_0x3e5673?.["outputType"] || ''),
    'vip': _0x3e5673?.["vip"] === !![],
    'async': _0x3e5673?.['async'] === !![],
    'cancellable': _0x3e5673?.["cancellable"] === !![],
    'detailLevel': _0x4f1b1d["length"] <= fieldLimit ? "full" : 'truncated',
    'uiSchema': {
      'fieldCount': _0x4f1b1d["length"],
      'includedFieldCount': Math["min"](_0x4f1b1d["length"], fieldLimit),
      'fields': _0x4f1b1d["slice"](0x0, fieldLimit)["map"](_0x4274aa => summarizeModelField(_0x4274aa, {
        'optionLimit': optionLimit
      }))
    }
  };
}
function summarizeWorkflow(_0x5278d6) {
  return {
    'modelId': _0x5278d6["modelId"],
    'provider': _0x5278d6['provider'],
    'kind': _0x5278d6["kind"],
    'adapterType': _0x5278d6['adapterType'],
    'displayName': _0x5278d6["displayName"]
  };
}
function summarizeTaskNode(_0x49e72a = {}) {
  const _0x16818d = String(_0x49e72a['jobStatus'] || _0x49e72a["storyboardScript"]?.["jobStatus"] || (_0x49e72a['isGenerating'] ? "running" : 'idle'));
  if (_0x16818d !== "running" && _0x16818d !== "pending") {
    return null;
  }
  return {
    'nodeId': String(_0x49e72a['id'] || ''),
    'type': String(_0x49e72a["type"] || ''),
    'model': String(_0x49e72a["model"] || ''),
    'provider': String(_0x49e72a['provider'] || ''),
    'jobStatus': _0x16818d,
    'taskId': String(_0x49e72a["taskId"] || _0x49e72a['rhTaskId'] || _0x49e72a["asyncTaskId"] || '')
  };
}
function getSelectedNodes(_0x417932 = {}, _0x163482 = {}) {
  const _0x221921 = Array["isArray"](_0x163482["selectedNodeIds"]) ? _0x163482["selectedNodeIds"] : Array["isArray"](_0x417932["selectedNodeIds"]) ? _0x417932["selectedNodeIds"] : [];
  return _0x221921["map"](_0x3f3b0c => _0x417932['nodes']?.[_0x3f3b0c])['filter'](Boolean);
}
function getSelectedNodeTypes(_0x9b708b = []) {
  return normalizeStringArray(_0x9b708b["map"](_0x302dfd => _0x302dfd?.["type"]));
}
function getInputRefSelectedNodes(_0x3b45bd = [], _0x4fce2e = {}) {
  if (!Array["isArray"](_0x3b45bd)) {
    return [];
  }
  return _0x3b45bd["map"]((_0x4cb678 = {}) => {
    const _0x2a3a6b = String(_0x4cb678["nodeId"] || _0x4cb678['id'] || '')["trim"]();
    if (!_0x2a3a6b) {
      return null;
    }
    const _0x465f2c = _0x4fce2e["nodes"]?.[_0x2a3a6b];
    if (_0x465f2c) {
      return _0x465f2c;
    }
    const _0x387413 = String(_0x4cb678["type"] || '')["trim"]() || "source-" + String(_0x4cb678["kind"] || 'node');
    return {
      'id': _0x2a3a6b,
      'type': _0x387413,
      'name': String(_0x4cb678["label"] || _0x4cb678["name"] || _0x2a3a6b)["trim"](),
      'width': Number(_0x4cb678["width"]) || undefined,
      'height': Number(_0x4cb678["height"]) || undefined
    };
  })['filter'](Boolean);
}
function resolveNodeKind(_0x1f24c5 = {}) {
  if (!_0x1f24c5 || typeof _0x1f24c5 !== "object") {
    return '';
  }
  return resolveSelectedNodeModelKind(_0x1f24c5) || NODE_TYPE_KIND_HINTS[String(_0x1f24c5?.["type"] || '')['trim']()] || '';
}
function isMaterialNodeSummary(_0x26f27f = {}) {
  return MODEL_KINDS["has"](resolveNodeKind(_0x26f27f));
}
function summarizeReferenceInputRef(_0x6885df = {}) {
  const _0x2981bd = String(_0x6885df["nodeId"] || _0x6885df['id'] || '')["trim"]();
  if (!_0x2981bd) {
    return null;
  }
  const _0x1fd631 = String(_0x6885df["type"] || '')['trim']();
  const _0x5a1410 = normalizeKind(_0x6885df["kind"]) || nodeTypeToInputKind(_0x1fd631);
  const _0x5446e0 = {
    'nodeId': _0x2981bd,
    'id': _0x2981bd,
    'type': _0x1fd631,
    'kind': _0x5a1410,
    'label': truncate(_0x6885df["label"] || _0x6885df["name"] || _0x2981bd, 0x50),
    'source': String(_0x6885df["source"] || "agent-panel")["trim"]()
  };
  const _0x37ec6a = Number(_0x6885df["width"]);
  const _0x58b021 = Number(_0x6885df['height']);
  if (Number['isFinite'](_0x37ec6a) && _0x37ec6a > 0x0) {
    _0x5446e0["width"] = Math["round"](_0x37ec6a);
  }
  if (Number['isFinite'](_0x58b021) && _0x58b021 > 0x0) {
    _0x5446e0["height"] = Math["round"](_0x58b021);
  }
  return _0x5446e0;
}
function summarizeReferenceNode(_0x4aeefe = {}, {
  promptPreviewLimit = REFERENCE_PROMPT_PREVIEW_LIMIT
} = {}) {
  if (!_0x4aeefe || typeof _0x4aeefe !== "object") {
    return null;
  }
  const _0x339f28 = String(_0x4aeefe['id'] || _0x4aeefe["nodeId"] || '')["trim"]();
  if (!_0x339f28) {
    return null;
  }
  const _0x43cb4d = Number(_0x4aeefe["width"]);
  const _0x295a37 = Number(_0x4aeefe["height"]);
  const _0xc13a0d = {
    'nodeId': _0x339f28,
    'id': _0x339f28,
    'type': String(_0x4aeefe["type"] || ''),
    'kind': resolveNodeKind(_0x4aeefe),
    'name': String(_0x4aeefe["name"] || ''),
    'promptPreview': truncate(_0x4aeefe["promptPreview"] || _0x4aeefe['prompt'] || '', promptPreviewLimit),
    'contentPreview': truncate(_0x4aeefe['contentPreview'] || _0x4aeefe['content'] || '', promptPreviewLimit),
    'model': String(_0x4aeefe["model"] || ''),
    'provider': String(_0x4aeefe["provider"] || ''),
    'adapterType': String(_0x4aeefe["adapterType"] || ''),
    'status': String(_0x4aeefe['jobStatus'] || _0x4aeefe["status"] || '')
  };
  if (Number['isFinite'](_0x43cb4d) && _0x43cb4d > 0x0) {
    _0xc13a0d["width"] = Math["round"](_0x43cb4d);
  }
  if (Number['isFinite'](_0x295a37) && _0x295a37 > 0x0) {
    _0xc13a0d["height"] = Math["round"](_0x295a37);
  }
  return _0xc13a0d;
}
function summarizeRelatedEdge(_0x41b85b = {}, _0x4e4383, _0x4645dd) {
  const _0x5e2df1 = String(_0x41b85b["sourceId"] || '')['trim']();
  const _0x137876 = String(_0x41b85b["targetId"] || '')['trim']();
  if (!_0x5e2df1 && !_0x137876) {
    return null;
  }
  const _0x2afab5 = _0x4645dd["has"](_0x5e2df1);
  const _0x200873 = _0x4645dd["has"](_0x137876);
  const _0x1d1f1f = [_0x2afab5 ? _0x5e2df1 : '', _0x200873 ? _0x137876 : '']["filter"](Boolean);
  const _0x47a424 = _0x2afab5 && _0x200873 ? "internal" : _0x2afab5 ? "out" : 'in';
  return {
    'id': String(_0x41b85b['id'] || ''),
    'sourceId': _0x5e2df1,
    'targetId': _0x137876,
    'refSlot': String(_0x41b85b["refSlot"] || ''),
    'type': String(_0x41b85b["type"] || ''),
    'direction': _0x47a424,
    'referenceNodeIds': _0x1d1f1f,
    'sourceNode': summarizeReferenceNode(_0x4e4383["get"](_0x5e2df1) || {}),
    'targetNode': summarizeReferenceNode(_0x4e4383["get"](_0x137876) || {})
  };
}
function buildReferenceContext({
  inputRefs = [],
  nodes = [],
  edges = []
} = {}) {
  const _0x9d464a = Array['isArray'](inputRefs) ? inputRefs['map'](summarizeReferenceInputRef)['filter'](Boolean) : [];
  const _0x5c2ff1 = normalizeStringArray(_0x9d464a["map"](_0x2ff43e => _0x2ff43e['nodeId'] || _0x2ff43e['id']));
  const _0x1aa59b = new Set(_0x5c2ff1);
  const _0x3b59f2 = new Map((Array["isArray"](nodes) ? nodes : [])["map"](_0x147e02 => [String(_0x147e02?.['id'] || _0x147e02?.['nodeId'] || '')["trim"](), _0x147e02])["filter"](([_0x2f0d58]) => Boolean(_0x2f0d58)));
  const _0x4b374e = _0x5c2ff1['map'](_0x37de46 => _0x3b59f2["get"](_0x37de46))["filter"](isMaterialNodeSummary)['map'](_0x3fa3e0 => summarizeReferenceNode(_0x3fa3e0))["filter"](Boolean);
  const _0x20611a = (Array['isArray'](edges) ? edges : [])["filter"](_0x49e3af => _0x1aa59b["has"](String(_0x49e3af?.["sourceId"] || '')) || _0x1aa59b['has'](String(_0x49e3af?.["targetId"] || '')))["map"](_0x5c4302 => summarizeRelatedEdge(_0x5c4302, _0x3b59f2, _0x1aa59b))["filter"](Boolean);
  const _0x2c7b1b = new Set();
  _0x20611a["forEach"](_0x474d7b => {
    _0x1aa59b["has"](_0x474d7b['sourceId']) && _0x474d7b["targetId"] && !_0x1aa59b["has"](_0x474d7b['targetId']) && _0x2c7b1b["add"](_0x474d7b["targetId"]);
    _0x1aa59b["has"](_0x474d7b['targetId']) && _0x474d7b["sourceId"] && !_0x1aa59b["has"](_0x474d7b["sourceId"]) && _0x2c7b1b["add"](_0x474d7b["sourceId"]);
  });
  const _0x2ee707 = Array["from"](_0x2c7b1b)["map"](_0x3bcbcb => _0x3b59f2["get"](_0x3bcbcb))['map'](_0x46854c => summarizeReferenceNode(_0x46854c))["filter"](Boolean);
  return {
    'inputRefs': _0x9d464a,
    'referencedNodes': _0x4b374e,
    'relatedEdges': _0x20611a,
    'neighborNodes': _0x2ee707
  };
}
function inferKindFromMessage(_0x35a19b) {
  const _0x468a94 = String(_0x35a19b || '')["trim"]();
  if (!_0x468a94) {
    return '';
  }
  let _0x9e5dc5 = '';
  let _0x3ab289 = 0x0;
  for (const [_0x351355, _0xbc75d4] of Object["entries"](MESSAGE_KIND_PATTERNS)) {
    let _0x3a7ed9 = 0x0;
    for (const _0x4bf69f of _0xbc75d4) {
      if (_0x4bf69f["test"](_0x468a94)) {
        _0x3a7ed9 += 0x1;
      }
    }
    (_0x3a7ed9 > _0x3ab289 || _0x3a7ed9 === _0x3ab289 && _0x3a7ed9 > 0x0 && (MESSAGE_KIND_PRIORITY[_0x351355] || 0x0) > (MESSAGE_KIND_PRIORITY[_0x9e5dc5] || 0x0)) && (_0x9e5dc5 = _0x351355, _0x3ab289 = _0x3a7ed9);
  }
  return _0x9e5dc5;
}
function inferKindFromSelectedNodes(_0x586c1e = []) {
  const _0x2e9e3e = new Map();
  for (const _0x1833fb of _0x586c1e) {
    const _0x2a8f6e = resolveSelectedNodeModelKind(_0x1833fb);
    const _0x471f3a = _0x2a8f6e || NODE_TYPE_KIND_HINTS[String(_0x1833fb?.["type"] || '')["trim"]()] || '';
    if (!_0x471f3a) {
      continue;
    }
    _0x2e9e3e["set"](_0x471f3a, (_0x2e9e3e["get"](_0x471f3a) || 0x0) + 0x1);
  }
  return Array["from"](_0x2e9e3e["entries"]())['sort']((_0xf16745, _0x399ece) => _0x399ece[0x1] - _0xf16745[0x1])[0x0]?.[0x0] || '';
}
function resolveSelectedNodeModelKind(_0x3d2c4e = {}) {
  const _0x1f6eb2 = String(_0x3d2c4e['model'] || '')['trim']();
  if (!_0x1f6eb2) {
    return '';
  }
  return normalizeKind(resolveModelExecution(_0x1f6eb2, {
    'providerHint': _0x3d2c4e["provider"]
  })?.["modelManifest"]?.["kind"]);
}
function resolveTargetKind({
  targetKind: _0x19a1cb,
  intent = null,
  userMessage = '',
  selectedNodes = []
} = {}) {
  return normalizeKind(_0x19a1cb) || normalizeKind(intent?.["targetKind"]) || normalizeKind(intent?.['kind']) || inferKindFromMessage(userMessage) || inferKindFromSelectedNodes(selectedNodes);
}
function scoreModel(_0x3b2ce7, {
  targetKind = '',
  selectedModelIds = [],
  selectedProviders = [],
  selectedInputKinds = new Set(),
  userMessage = ''
} = {}) {
  let _0x536b49 = 0x0;
  const _0x1eedfb = normalizeKind(_0x3b2ce7?.['kind']);
  if (targetKind && _0x1eedfb === targetKind) {
    _0x536b49 += 0x3e8;
  }
  if (selectedModelIds["includes"](_0x3b2ce7?.['modelId'])) {
    _0x536b49 += 0x1f4;
  }
  if (selectedProviders["includes"](_0x3b2ce7?.["provider"])) {
    _0x536b49 += 0x50;
  }
  if (_0x3b2ce7?.["adapterType"] === "workflow") {
    _0x536b49 += 0x14;
  }
  if (_0x3b2ce7?.['vip'] !== !![]) {
    _0x536b49 += 0x4;
  }
  const _0x530945 = Number(_0x3b2ce7?.['extensions']?.['imageMenu']?.["order"]) || Number(_0x3b2ce7?.['extensions']?.["videoMenu"]?.["order"]) || Number(_0x3b2ce7?.["extensions"]?.["audioMenu"]?.['order']) || Number(_0x3b2ce7?.["extensions"]?.["textMenu"]?.["order"]) || 0x0;
  _0x536b49 += Math["max"](0x0, 0x64 - _0x530945) / 0x64;
  _0x536b49 += scoreSelectedInputCompatibility(_0x3b2ce7, {
    'selectedInputKinds': selectedInputKinds,
    'targetKind': targetKind,
    'userMessage': userMessage
  });
  const _0x2ab936 = [_0x3b2ce7?.["modelId"], _0x3b2ce7?.["provider"], _0x3b2ce7?.["displayName"], _0x3b2ce7?.["description"]]["join"]('\x20')["toLowerCase"]();
  const _0x101f82 = String(userMessage || '')["trim"]()["toLowerCase"]();
  const _0x5dbdbd = normalizeAgentSearchKey(userMessage);
  const _0x43aa00 = [_0x3b2ce7?.['modelId'], _0x3b2ce7?.["displayName"]]["map"](_0x3d0f0b => String(_0x3d0f0b || '')["trim"]()["toLowerCase"]())["filter"](_0xaba802 => _0xaba802["length"] >= 0x3);
  _0x101f82 && _0x43aa00['some'](_0x1f9aeb => _0x101f82["includes"](_0x1f9aeb)) && (_0x536b49 += 0x7d0);
  const _0x53a5db = normalizeAgentSearchKey(_0x3b2ce7?.["modelId"]);
  const _0x623fbb = normalizeAgentSearchKey(_0x3b2ce7?.["displayName"]);
  if (_0x53a5db["length"] >= 0x4 && _0x5dbdbd["includes"](_0x53a5db)) {
    _0x536b49 += 0xa28;
  }
  if (_0x623fbb["length"] >= 0x4 && _0x5dbdbd["includes"](_0x623fbb)) {
    _0x536b49 += 0x898;
  }
  for (const _0x53b748 of _0x101f82["split"](/[\s,，。:：/]+/)) {
    if (_0x53b748["length"] >= 0x3 && _0x2ab936["includes"](_0x53b748)) {
      _0x536b49 += 0xa;
    }
  }
  return _0x536b49;
}
function getExplicitMessageModelIds(_0x1a8d43 = [], _0x41bf8d = '') {
  const _0xc20644 = normalizeAgentSearchText(_0x41bf8d);
  const _0x202a0a = normalizeAgentSearchKey(_0x41bf8d);
  if (!_0xc20644 || !_0x202a0a) {
    return [];
  }
  return _0x1a8d43["filter"](_0x1d9fcb => {
    const _0x4d30dd = [_0x1d9fcb?.["modelId"], _0x1d9fcb?.["displayName"]]["map"](_0x4cb94f => ({
      'text': normalizeAgentSearchText(_0x4cb94f),
      'key': normalizeAgentSearchKey(_0x4cb94f)
    }))["filter"](_0x4a8707 => _0x4a8707['text']);
    return _0x4d30dd['some'](({
      text: _0x1a67fa,
      key: _0x14cd9a
    }) => {
      if (_0x1a67fa["length"] >= 0x4 && _0xc20644['includes'](_0x1a67fa)) {
        return !![];
      }
      if (_0x14cd9a['length'] < 0x4 || !_0x202a0a['includes'](_0x14cd9a)) {
        return ![];
      }
      return /\d/["test"](_0x14cd9a) || _0x14cd9a["length"] >= 0x8;
    });
  })["map"](_0x22bbf0 => _0x22bbf0["modelId"]);
}
function filterModelManifests({
  targetKind = '',
  selectedNodes = [],
  userMessage = '',
  modelLimit = undefined,
  disclosedModelIds = []
} = {}) {
  const _0x2a6178 = listModelManifests();
  const _0x3e253b = getExplicitMessageModelIds(_0x2a6178, userMessage);
  const _0x21f1d0 = normalizeStringArray(_0x2a6178["filter"](_0x2cb9d0 => _0x3e253b["includes"](_0x2cb9d0['modelId']))["map"](_0x62fba6 => normalizeKind(_0x62fba6["kind"])));
  const _0x4ceacc = _0x21f1d0['length'] === 0x1 ? _0x21f1d0[0x0] : targetKind;
  const _0x182ef6 = normalizeStringArray(selectedNodes["map"](_0x1bcbb5 => _0x1bcbb5?.["model"]));
  const _0x167449 = normalizeStringArray(selectedNodes["map"](_0x3e3177 => _0x3e3177?.['provider']));
  const _0x31e512 = normalizeStringArray([..._0x182ef6, ...normalizeStringArray(disclosedModelIds), ..._0x3e253b]);
  const _0x7ae2a5 = getSelectedInputKinds(selectedNodes);
  const _0x2716a2 = Boolean(_0x4ceacc);
  const _0x26851c = Number(modelLimit);
  const _0xe5671e = _0x2716a2 ? DEFAULT_MODEL_LIMIT : NO_INTENT_MODEL_LIMIT;
  const _0xfb3cca = Math["max"](0x0, Math["trunc"](Number["isFinite"](_0x26851c) ? _0x26851c : _0xe5671e));
  const _0x6b8d78 = _0x2a6178["filter"](_0x391c0f => {
    if (!_0x391c0f?.["modelId"]) {
      return ![];
    }
    if (_0x31e512["includes"](_0x391c0f["modelId"])) {
      return !![];
    }
    if (_0x2716a2 && normalizeKind(_0x391c0f["kind"]) !== _0x4ceacc) {
      return ![];
    }
    if (!manifestHasAvailableRequiredInputs(_0x391c0f, _0x7ae2a5)) {
      return ![];
    }
    if (_0x2716a2 && _0x7ae2a5["size"] === 0x0) {
      return manifestSupportsTextOnlyInput(_0x391c0f);
    }
    return !![];
  })['map'](_0x294a5b => ({
    'manifest': _0x294a5b,
    'score': scoreModel(_0x294a5b, {
      'targetKind': _0x4ceacc,
      'selectedModelIds': _0x182ef6,
      'selectedProviders': _0x167449,
      'selectedInputKinds': _0x7ae2a5,
      'userMessage': userMessage
    })
  }))["sort"]((_0x3d8836, _0x30ba1b) => {
    const _0x208cc5 = _0x31e512["includes"](_0x3d8836["manifest"]["modelId"]);
    const _0x497832 = _0x31e512["includes"](_0x30ba1b['manifest']["modelId"]);
    if (_0x208cc5 !== _0x497832) {
      return _0x497832 ? 0x1 : -0x1;
    }
    if (_0x30ba1b['score'] !== _0x3d8836['score']) {
      return _0x30ba1b["score"] - _0x3d8836["score"];
    }
    return String(_0x3d8836["manifest"]["modelId"])['localeCompare'](String(_0x30ba1b["manifest"]["modelId"]));
  });
  const _0x203126 = Math["max"](_0xfb3cca, _0x31e512["length"]);
  const _0x5c9a62 = _0x6b8d78["slice"](0x0, _0x203126)["map"](_0x420fcc => _0x420fcc["manifest"]);
  return {
    'manifests': _0x5c9a62,
    'totalAvailable': _0x2a6178["length"],
    'totalMatched': _0x6b8d78["length"],
    'truncated': _0x6b8d78["length"] > _0x5c9a62["length"],
    'targetKind': _0x4ceacc,
    'selectedModelIds': _0x182ef6,
    'disclosedModelIds': normalizeStringArray(disclosedModelIds),
    'selectedInputKinds': Array['from'](_0x7ae2a5)
  };
}
export function buildAgentCanvasSummary({
  store: _0x2a2634,
  recentCommands = [],
  includeCommands = !![],
  userMessage = '',
  intent = null,
  targetKind = '',
  inputRefs = [],
  modelLimit = undefined,
  disclosedModelIds = [],
  promptPreviewLimit = DEFAULT_PROMPT_PREVIEW_LIMIT
} = {}) {
  const _0xa53943 = _0x2a2634?.["getStateRaw"]?.() || _0x2a2634?.['getState']?.() || {};
  const _0x3a84f1 = buildCanvasSummary({
    'store': _0x2a2634
  });
  const _0x21db81 = (_0x3a84f1["nodes"] || [])["map"](_0x106a71 => ({
    ..._0x106a71,
    'promptPreview': truncate(_0x106a71["promptPreview"], promptPreviewLimit),
    'contentPreview': truncate(_0x106a71["contentPreview"], promptPreviewLimit)
  }));
  const _0x2ea7ed = getSelectedNodes(_0xa53943, _0x3a84f1);
  const _0x509ed7 = new Set(_0x2ea7ed["map"](_0x5c35f2 => String(_0x5c35f2?.['id'] || ''))["filter"](Boolean));
  const _0x1c97c8 = getInputRefSelectedNodes(inputRefs, _0xa53943)["filter"](_0x29809d => !_0x509ed7["has"](String(_0x29809d['id'] || '')));
  const _0x30bb59 = [..._0x2ea7ed, ..._0x1c97c8];
  const _0x508a4e = resolveTargetKind({
    'targetKind': targetKind,
    'intent': intent,
    'userMessage': userMessage,
    'selectedNodes': _0x30bb59
  });
  const _0x36627f = filterModelManifests({
    'targetKind': _0x508a4e,
    'selectedNodes': _0x30bb59,
    'userMessage': userMessage,
    'modelLimit': modelLimit,
    'disclosedModelIds': disclosedModelIds
  });
  const _0x1b5cc5 = _0x36627f["manifests"]["map"](_0x29520d => summarizeModel(_0x29520d));
  const _0x28bbd2 = _0x1b5cc5["filter"](_0x3c2f40 => _0x3c2f40["adapterType"] === "workflow")['map'](summarizeWorkflow);
  const _0xb97fb9 = Array["isArray"](recentCommands) ? recentCommands : [];
  const _0xc7dee0 = new Set((_0x3a84f1['selectedNodeIds'] || [])["map"](_0x45351c => String(_0x45351c || '')));
  const _0x2dfe9f = _0x21db81['filter'](_0x102bf5 => _0xc7dee0['has'](String(_0x102bf5?.['id'] || '')))["map"](_0x3a3bc1 => ({
    'id': _0x3a3bc1['id'],
    'type': _0x3a3bc1['type'],
    'name': _0x3a3bc1["name"],
    'promptPreview': _0x3a3bc1["promptPreview"],
    'contentPreview': _0x3a3bc1["contentPreview"],
    'model': _0x3a3bc1["model"],
    'provider': _0x3a3bc1['provider'],
    'adapterType': _0x3a3bc1["adapterType"],
    'x': _0x3a3bc1['x'],
    'y': _0x3a3bc1['y'],
    'width': _0x3a3bc1["width"],
    'height': _0x3a3bc1["height"],
    'jobStatus': _0x3a3bc1["jobStatus"]
  }));
  const _0x40df2e = _0x3a84f1["edges"] || [];
  const _0x269976 = buildReferenceContext({
    'inputRefs': inputRefs,
    'nodes': _0x21db81,
    'edges': _0x40df2e
  });
  return {
    'selectedNodeIds': _0x3a84f1['selectedNodeIds'] || [],
    'selectedNodes': _0x2dfe9f,
    'nodes': _0x21db81,
    'edges': _0x40df2e,
    'referenceContext': _0x269976,
    'viewport': normalizeViewport(_0x3a84f1["viewport"]),
    'availableModels': _0x1b5cc5,
    'availableWorkflows': _0x28bbd2,
    'modelCatalog': {
      'targetKind': _0x36627f["targetKind"],
      'selectedNodeTypes': getSelectedNodeTypes(_0x30bb59),
      'selectedInputKinds': _0x36627f['selectedInputKinds'],
      'selectedNodeModels': _0x36627f["selectedModelIds"],
      'selectedModelIds': _0x36627f["selectedModelIds"],
      'disclosedModelIds': _0x36627f["disclosedModelIds"],
      'totalAvailable': _0x36627f['totalAvailable'],
      'totalMatched': _0x36627f['totalMatched'],
      'includedModels': _0x1b5cc5["length"],
      'truncated': _0x36627f["truncated"]
    },
    'runningTasks': Object["values"](_0xa53943['nodes'] || {})["map"](summarizeTaskNode)["filter"](Boolean),
    'recentCommands': includeCommands ? _0xb97fb9["slice"](-0x14) : []
  };
}
export const agentCanvasSummaryInternals = Object["freeze"]({
  'inferKindFromMessage': inferKindFromMessage,
  'resolveTargetKind': resolveTargetKind,
  'filterModelManifests': filterModelManifests,
  'buildReferenceContext': buildReferenceContext
});