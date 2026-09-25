import { canvasCommandRegistry } from '../canvasCommands/index.js';
import { buildAgentCanvasSummary } from './agentCanvasSummary.js';
import { buildAgentReferenceContext } from './agentReferenceContext.js';
import { routeAgentCapabilities } from './agentCapabilityRouter.js';
import { defaultAgentSkillRegistry, listAgentSkillCatalog, selectAgentSkills } from './agentSkillCatalog.js';
export const DEFAULT_AGENT_CONTEXT_BUDGET_CHARS = 0x8ca0;
export const MAX_EMPTY_CANVAS_CONTEXT_CHARS = 0x9c40;
const AGENT_INPUT_REF_CONTEXT_LIMIT = 0xc;
const AGENT_SELECTED_NODE_DETAIL_LIMIT = 0xc;
function estimateJsonChars(_0x5c0189) {
  try {
    return JSON["stringify"](_0x5c0189)['length'];
  } catch {
    return 0x0;
  }
}
function normalizeContextBudget(_0x5a5ba7) {
  const _0x497f40 = Number(_0x5a5ba7);
  if (!Number["isFinite"](_0x497f40) || _0x497f40 <= 0x0) {
    return DEFAULT_AGENT_CONTEXT_BUDGET_CHARS;
  }
  return Math["trunc"](_0x497f40);
}
function getModelLimitForBudget(_0x3d8e1d) {
  if (_0x3d8e1d <= 0x61a8) {
    return 0x6;
  }
  if (_0x3d8e1d <= 0x7d00) {
    return 0x8;
  }
  return 0xa;
}
function summarizeWorkflowsFromModels(_0xa67e5b = []) {
  return _0xa67e5b["filter"](_0x390178 => _0x390178?.["adapterType"] === 'workflow')["map"](_0x9e1391 => ({
    'modelId': _0x9e1391["modelId"],
    'provider': _0x9e1391["provider"],
    'kind': _0x9e1391["kind"],
    'adapterType': _0x9e1391["adapterType"],
    'executionId': _0x9e1391["executionId"],
    'displayName': _0x9e1391["displayName"]
  }));
}
function markCanvasCatalogTruncated(_0x1c3222 = {}) {
  if (!_0x1c3222["modelCatalog"]) {
    _0x1c3222['modelCatalog'] = {};
  }
  _0x1c3222["modelCatalog"]["truncated"] = !![];
  _0x1c3222['modelCatalog']['includedModels'] = Array["isArray"](_0x1c3222["availableModels"]) ? _0x1c3222["availableModels"]["length"] : 0x0;
}
function truncatePreviewText(_0x3d4869, _0x149619) {
  const _0x101b83 = String(_0x3d4869 || '');
  if (_0x101b83['length'] <= _0x149619) {
    return _0x101b83;
  }
  return _0x101b83['slice'](0x0, Math["max"](0x0, _0x149619 - 0x3)) + "...";
}
function normalizeInputKind(_0x2505ff = '') {
  const _0x53528c = String(_0x2505ff || '')["trim"]();
  if (_0x53528c["includes"]("image")) {
    return "image";
  }
  if (_0x53528c["includes"]("video")) {
    return "video";
  }
  if (_0x53528c['includes']("audio")) {
    return 'audio';
  }
  if (_0x53528c["includes"]("text")) {
    return "text";
  }
  return _0x53528c || "node";
}
function normalizeAgentInputRefs(_0x2e63c1 = []) {
  if (!Array["isArray"](_0x2e63c1)) {
    return [];
  }
  const _0x1fb6ce = new Set();
  return _0x2e63c1["map"]((_0x5ad3f4 = {}) => {
    const _0xf227e2 = String(_0x5ad3f4["nodeId"] || _0x5ad3f4['id'] || '')['trim']();
    if (!_0xf227e2 || _0x1fb6ce["has"](_0xf227e2)) {
      return null;
    }
    _0x1fb6ce["add"](_0xf227e2);
    const _0x3dbe6e = String(_0x5ad3f4["type"] || '')["trim"]();
    const _0x3f595c = Number(_0x5ad3f4["width"]);
    const _0x1ea2be = Number(_0x5ad3f4["height"]);
    const _0x2864fd = {
      'nodeId': _0xf227e2,
      'id': _0xf227e2,
      'type': _0x3dbe6e,
      'kind': String(_0x5ad3f4["kind"] || normalizeInputKind(_0x3dbe6e))["trim"](),
      'label': truncatePreviewText(_0x5ad3f4["label"] || _0x5ad3f4["name"] || _0xf227e2, 0x50),
      'source': String(_0x5ad3f4["source"] || "agent-panel")["trim"]()
    };
    if (Number["isFinite"](_0x3f595c) && _0x3f595c > 0x0) {
      _0x2864fd["width"] = Math['round'](_0x3f595c);
    }
    if (Number["isFinite"](_0x1ea2be) && _0x1ea2be > 0x0) {
      _0x2864fd["height"] = Math['round'](_0x1ea2be);
    }
    return _0x2864fd;
  })["filter"](Boolean)["slice"](0x0, AGENT_INPUT_REF_CONTEXT_LIMIT);
}
function updateBudgetMetadata(_0x51f85a, _0x29ddb9, _0x46b412 = ![]) {
  const _0x3fb873 = Array['isArray'](_0x51f85a["commands"]) ? _0x51f85a["commands"]["every"](_0x951ebe => _0x951ebe?.["argsSchema"] && typeof _0x951ebe['argsSchema'] === "object" && _0x951ebe["argsSchema"]["properties"] && typeof _0x951ebe["argsSchema"]["properties"] === "object") : !![];
  _0x51f85a["contextBudget"] = {
    'maxChars': _0x29ddb9,
    'estimatedChars': 0x0,
    'truncated': _0x46b412 === !![] || _0x51f85a["canvas"]?.["modelCatalog"]?.["truncated"] === !![],
    'availableModels': Array["isArray"](_0x51f85a["canvas"]?.["availableModels"]) ? _0x51f85a["canvas"]["availableModels"]["length"] : 0x0,
    'commandSchemasRetained': _0x3fb873,
    'schemaIntegrity': _0x3fb873,
    'budgetExceeded': ![]
  };
  for (let _0x3656a9 = 0x0; _0x3656a9 < 0x3; _0x3656a9 += 0x1) {
    _0x51f85a["contextBudget"]["estimatedChars"] = estimateJsonChars(_0x51f85a);
  }
  _0x51f85a["contextBudget"]["budgetExceeded"] = _0x51f85a["contextBudget"]["estimatedChars"] > _0x29ddb9;
  _0x51f85a['contextBudget']["estimatedChars"] = estimateJsonChars(_0x51f85a);
  return _0x51f85a["contextBudget"]["estimatedChars"];
}
function compactCommandDescription(_0x2f3b5a = {}) {
  return {
    'id': _0x2f3b5a['id'],
    'riskLevel': _0x2f3b5a['riskLevel'],
    'argsSchema': _0x2f3b5a["argsSchema"],
    'capabilitySchema': _0x2f3b5a["capabilitySchema"],
    'returnSchema': _0x2f3b5a["returnSchema"],
    'returnAliasFields': _0x2f3b5a["returnAliasFields"]
  };
}
function compactSelectedSkill(_0x57e8ec = {}, _0x2ee37d = 0xfa0, _0x2bbdcc = 0xfa0) {
  const _0x1804ff = truncatePreviewText(_0x57e8ec['instructions'], _0x2ee37d);
  return {
    ..._0x57e8ec,
    'instructions': _0x1804ff,
    'resourceNames': Array["isArray"](_0x57e8ec['resourceNames']) ? _0x57e8ec["resourceNames"]["slice"](0x0, 0xc) : [],
    'resources': (Array['isArray'](_0x57e8ec["resources"]) ? _0x57e8ec["resources"] : [])["slice"](0x0, 0x8)["map"]((_0x1d836c = {}) => ({
      'name': truncatePreviewText(_0x1d836c["name"], 0xa0),
      'content': truncatePreviewText(_0x1d836c["content"], _0x2bbdcc)
    }))
  };
}
function getPinnedCanvasNodeIds(_0x6327a9 = {}) {
  const _0x2ce24d = new Set();
  const _0x49c832 = _0x2652db => {
    const _0x31a2eb = String(_0x2652db || '')["trim"]();
    if (_0x31a2eb) {
      _0x2ce24d["add"](_0x31a2eb);
    }
  };
  (_0x6327a9["selectedNodes"] || [])["slice"](0x0, AGENT_SELECTED_NODE_DETAIL_LIMIT)['forEach'](_0x1c44ee => _0x49c832(_0x1c44ee?.['id'] || _0x1c44ee?.["nodeId"]));
  (_0x6327a9["inputRefs"] || [])["forEach"](_0x318a8d => _0x49c832(_0x318a8d?.["nodeId"] || _0x318a8d?.['id']));
  (_0x6327a9["referenceContext"]?.["referencedNodes"] || [])["forEach"](_0x677f54 => _0x49c832(_0x677f54?.["nodeId"] || _0x677f54?.['id']));
  (_0x6327a9["referenceContext"]?.['neighborNodes'] || [])["forEach"](_0x5f40f4 => _0x49c832(_0x5f40f4?.['nodeId'] || _0x5f40f4?.['id']));
  (_0x6327a9["referenceContext"]?.["relatedEdges"] || [])["forEach"](_0x58ed90 => {
    _0x49c832(_0x58ed90?.["sourceId"]);
    _0x49c832(_0x58ed90?.["targetId"]);
  });
  (_0x6327a9["runningTasks"] || [])["forEach"](_0x54c639 => _0x49c832(_0x54c639?.['nodeId']));
  (_0x6327a9["agentReferences"]?.["recentCreatedNodeIds"] || [])["forEach"](_0x49c832);
  return _0x2ce24d;
}
function pruneCanvasGraph(_0x2a6f0c = {}, _0x5a85e5 = 0x1e) {
  const _0x55d995 = Array['isArray'](_0x2a6f0c["nodes"]) ? _0x2a6f0c["nodes"] : [];
  const _0x4b559c = Array["isArray"](_0x2a6f0c["edges"]) ? _0x2a6f0c["edges"] : [];
  const _0x5131fc = Array["isArray"](_0x2a6f0c["selectedNodes"]) ? _0x2a6f0c["selectedNodes"] : [];
  const _0x16a34f = _0x5131fc["slice"](0x0, AGENT_SELECTED_NODE_DETAIL_LIMIT);
  const _0x54302a = getPinnedCanvasNodeIds(_0x2a6f0c);
  const _0x528b8f = _0x55d995["filter"](_0x2dd5f5 => _0x54302a['has'](String(_0x2dd5f5?.['id'] || '')));
  const _0x3c8c9c = _0x55d995["filter"](_0x5b8b8c => !_0x54302a["has"](String(_0x5b8b8c?.['id'] || '')));
  const _0x51ae55 = Math["max"](_0x5a85e5, _0x528b8f["length"]);
  const _0x323b4a = [..._0x528b8f, ..._0x3c8c9c["slice"](0x0, Math["max"](0x0, _0x51ae55 - _0x528b8f["length"]))];
  const _0x44242a = new Set(_0x323b4a["map"](_0x2975d1 => String(_0x2975d1?.['id'] || ''))["filter"](Boolean));
  const _0xa7bb8a = _0x4b559c["filter"](_0x1bffcb => _0x44242a['has'](String(_0x1bffcb?.["sourceId"] || '')) && _0x44242a['has'](String(_0x1bffcb?.["targetId"] || '')));
  const _0xe597ea = Math["max"](0x18, _0x51ae55 * 0x3);
  const _0x444427 = _0xa7bb8a["slice"](0x0, _0xe597ea);
  const _0xf20cac = Number(_0x2a6f0c['graphCatalog']?.["totalNodes"] ?? _0x55d995["length"]);
  const _0x4c2b24 = Number(_0x2a6f0c["graphCatalog"]?.['totalEdges'] ?? _0x4b559c["length"]);
  const _0x27beb0 = _0x323b4a["length"] < _0x55d995["length"] || _0x444427["length"] < _0x4b559c["length"] || _0x16a34f["length"] < _0x5131fc["length"];
  if (!_0x27beb0) {
    return ![];
  }
  _0x2a6f0c["nodes"] = _0x323b4a;
  _0x2a6f0c["edges"] = _0x444427;
  _0x2a6f0c["selectedNodes"] = _0x16a34f;
  _0x16a34f["length"] < _0x5131fc["length"] && (_0x2a6f0c["selectionCatalog"] = {
    'totalSelected': _0x5131fc["length"],
    'includedSelectedNodeDetails': _0x16a34f['length'],
    'selectedNodeIdsRetained': Array["isArray"](_0x2a6f0c['selectedNodeIds']) ? _0x2a6f0c["selectedNodeIds"]["length"] : 0x0,
    'truncated': !![]
  });
  _0x2a6f0c["graphCatalog"] = {
    'totalNodes': _0xf20cac,
    'totalEdges': _0x4c2b24,
    'includedNodes': _0x323b4a['length'],
    'includedEdges': _0x444427["length"],
    'pinnedNodes': _0x528b8f['length'],
    'truncated': !![]
  };
  return !![];
}
function enforceContextBudget(_0x52dd41, _0x21a3ed) {
  let _0x4e0c96 = updateBudgetMetadata(_0x52dd41, _0x21a3ed);
  let _0x17b224 = _0x52dd41['contextBudget']['truncated'];
  const _0x2347dc = _0x52dd41["canvas"] || {};
  for (const _0x3eef71 of [0x3c, 0x1e, 0xc]) {
    if (_0x4e0c96 <= _0x21a3ed) {
      break;
    }
    if (!pruneCanvasGraph(_0x2347dc, _0x3eef71)) {
      continue;
    }
    _0x17b224 = !![];
    _0x4e0c96 = updateBudgetMetadata(_0x52dd41, _0x21a3ed, _0x17b224);
  }
  for (const _0x4951ca of [0xe, 0xa, 0x6]) {
    if (_0x4e0c96 <= _0x21a3ed) {
      break;
    }
    if (!Array['isArray'](_0x2347dc["availableModels"]) || _0x2347dc["availableModels"]["length"] <= _0x4951ca) {
      continue;
    }
    _0x2347dc['availableModels'] = _0x2347dc['availableModels']["slice"](0x0, _0x4951ca);
    _0x2347dc['availableWorkflows'] = summarizeWorkflowsFromModels(_0x2347dc["availableModels"]);
    markCanvasCatalogTruncated(_0x2347dc);
    _0x17b224 = !![];
    _0x4e0c96 = updateBudgetMetadata(_0x52dd41, _0x21a3ed, _0x17b224);
  }
  for (const _0x33e089 of [0xa, 0x5, 0x0]) {
    if (_0x4e0c96 <= _0x21a3ed) {
      break;
    }
    if (!Array['isArray'](_0x2347dc['recentCommands']) || _0x2347dc["recentCommands"]["length"] <= _0x33e089) {
      continue;
    }
    _0x2347dc["recentCommands"] = _0x2347dc['recentCommands']["slice"](-_0x33e089);
    _0x17b224 = !![];
    _0x4e0c96 = updateBudgetMetadata(_0x52dd41, _0x21a3ed, _0x17b224);
  }
  for (const _0x40463d of [0xf0, 0x78, 0x3c]) {
    if (_0x4e0c96 <= _0x21a3ed) {
      break;
    }
    if (!Array["isArray"](_0x2347dc["nodes"]) || _0x2347dc['nodes']["length"] === 0x0) {
      continue;
    }
    _0x2347dc["nodes"] = _0x2347dc["nodes"]["map"](_0x165c80 => ({
      ..._0x165c80,
      'promptPreview': truncatePreviewText(_0x165c80["promptPreview"], _0x40463d),
      'contentPreview': truncatePreviewText(_0x165c80["contentPreview"], _0x40463d)
    }));
    _0x17b224 = !![];
    _0x4e0c96 = updateBudgetMetadata(_0x52dd41, _0x21a3ed, _0x17b224);
  }
  for (const [_0x376074, _0x38cf47] of [[0x1770, 0x1770], [0xbb8, 0xbb8], [0x4b0, 0x4b0]]) {
    if (_0x4e0c96 <= _0x21a3ed) {
      break;
    }
    if (!Array["isArray"](_0x52dd41['skills']) || _0x52dd41['skills']["length"] === 0x0) {
      continue;
    }
    _0x52dd41["skills"] = _0x52dd41["skills"]["map"](_0xdb4100 => compactSelectedSkill(_0xdb4100, _0x376074, _0x38cf47));
    _0x17b224 = !![];
    _0x4e0c96 = updateBudgetMetadata(_0x52dd41, _0x21a3ed, _0x17b224);
  }
  _0x4e0c96 > _0x21a3ed && Array["isArray"](_0x52dd41['commands']) && (_0x52dd41['commands'] = _0x52dd41["commands"]["map"](compactCommandDescription), _0x17b224 = !![], _0x4e0c96 = updateBudgetMetadata(_0x52dd41, _0x21a3ed, _0x17b224));
  for (const _0x1f25fb of [0x3, 0x1, 0x0]) {
    if (_0x4e0c96 <= _0x21a3ed) {
      break;
    }
    if (!Array['isArray'](_0x2347dc["availableModels"]) || _0x2347dc["availableModels"]["length"] <= _0x1f25fb) {
      continue;
    }
    _0x2347dc["availableModels"] = _0x2347dc["availableModels"]["slice"](0x0, _0x1f25fb);
    _0x2347dc["availableWorkflows"] = summarizeWorkflowsFromModels(_0x2347dc["availableModels"]);
    markCanvasCatalogTruncated(_0x2347dc);
    _0x17b224 = !![];
    _0x4e0c96 = updateBudgetMetadata(_0x52dd41, _0x21a3ed, _0x17b224);
  }
  _0x4e0c96 > _0x21a3ed && Array["isArray"](_0x52dd41["skillCatalog"]?.["available"]) && (_0x52dd41["skillCatalog"]["available"] = _0x52dd41["skillCatalog"]["available"]['map'](_0x26a51c => ({
    'id': _0x26a51c['id'],
    'title': _0x26a51c["title"],
    'category': _0x26a51c["category"]
  })), _0x17b224 = !![], _0x4e0c96 = updateBudgetMetadata(_0x52dd41, _0x21a3ed, _0x17b224));
  updateBudgetMetadata(_0x52dd41, _0x21a3ed, _0x17b224);
  return _0x52dd41;
}
export function buildAgentContext({
  store: _0x3812c8,
  commandRegistry = canvasCommandRegistry,
  sessionStore = null,
  recentCommands = undefined,
  userMessage = '',
  intent = null,
  targetKind = '',
  inputRefs = [],
  contextBudgetChars = DEFAULT_AGENT_CONTEXT_BUDGET_CHARS,
  modelLimit = undefined,
  disclosedCommandIds = [],
  disclosedModelIds = [],
  selectedSkillIds = [],
  skillRegistry = defaultAgentSkillRegistry
} = {}) {
  const _0x170af4 = normalizeContextBudget(contextBudgetChars);
  const _0x2d4bec = normalizeAgentInputRefs(inputRefs);
  const _0x3f4b04 = typeof commandRegistry?.['list'] === "function" ? commandRegistry["list"]() : [];
  const _0x1ee620 = recentCommands !== undefined ? recentCommands : sessionStore?.["getRecentCommands"]?.() || [];
  const _0x1b6696 = buildAgentCanvasSummary({
    'store': _0x3812c8,
    'recentCommands': _0x1ee620,
    'userMessage': userMessage,
    'intent': intent,
    'targetKind': targetKind,
    'inputRefs': _0x2d4bec,
    'modelLimit': modelLimit ?? getModelLimitForBudget(_0x170af4),
    'disclosedModelIds': disclosedModelIds
  });
  _0x1b6696['agentReferences'] = buildAgentReferenceContext({
    'canvas': _0x1b6696,
    'operationLedger': sessionStore?.['getOperationLedger']?.() || []
  });
  const _0x236509 = selectAgentSkills({
    'userMessage': userMessage,
    'targetKind': _0x1b6696["modelCatalog"]?.["targetKind"],
    'selectedInputKinds': _0x1b6696["modelCatalog"]?.["selectedInputKinds"],
    'selectedSkillIds': selectedSkillIds,
    'registry': skillRegistry
  });
  const _0x758e6 = new Set(_0x3f4b04["map"](_0xb41785 => String(_0xb41785?.['id'] || '')["trim"]())['filter'](Boolean));
  const _0x272d02 = _0x236509["filter"](_0x29989a => _0x29989a['commands']["every"](_0x4cc8a3 => _0x758e6['has'](_0x4cc8a3)));
  const _0x141fee = routeAgentCapabilities({
    'commands': _0x3f4b04,
    'skills': _0x272d02,
    'userMessage': userMessage,
    'intent': intent,
    'targetKind': _0x1b6696["modelCatalog"]?.["targetKind"],
    'requiredCommandIds': disclosedCommandIds
  });
  const _0x3eb03b = _0x141fee["catalog"]["selectedNamespaces"]["includes"]("generation") || Boolean(_0x1b6696['modelCatalog']?.["targetKind"]) && _0x141fee['commands']["some"](_0x501c6e => ['node.setModel', "node.changeModel", "node.setParams", "generation.run"]['includes'](_0x501c6e['id']));
  !_0x3eb03b && (_0x1b6696["availableModels"] = [], _0x1b6696["availableWorkflows"] = [], _0x1b6696["modelCatalog"] && (_0x1b6696["modelCatalog"]["includedModels"] = 0x0, _0x1b6696["modelCatalog"]["truncated"] = _0x1b6696["modelCatalog"]["totalMatched"] > 0x0));
  const _0x5841fd = listAgentSkillCatalog({
    'registry': skillRegistry
  });
  const _0x58fac2 = skillRegistry?.['getState']?.() || {};
  const _0x6e8c0d = _0x272d02["map"](_0x3beffd => _0x3beffd['id']);
  const _0x1427d3 = new Set(_0x6e8c0d);
  const _0x1f4357 = {
    'schemaVersion': 0x1,
    'canvas': _0x1b6696,
    'commands': _0x141fee["commands"],
    'skills': _0x272d02,
    'capabilityRouting': _0x141fee["catalog"],
    'skillCatalog': {
      'mode': "progressive",
      'includedSkillIds': _0x6e8c0d,
      'deferredSkillIds': _0x5841fd["map"](_0x357e94 => _0x357e94['id'])["filter"](_0x92dd80 => !_0x1427d3['has'](_0x92dd80)),
      'available': _0x5841fd,
      'totalAvailable': _0x5841fd["length"],
      'installedCount': Number(_0x58fac2['installedCount'] || 0x0),
      'diagnosticCount': Array["isArray"](_0x58fac2["diagnostics"]) ? _0x58fac2['diagnostics']["length"] : 0x0
    },
    'policies': {
      'actionPlanOnly': !![],
      'skillsProduceActionPlansOnly': !![],
      'progressiveCapabilityDisclosure': !![],
      'commandSchemasProtected': !![],
      'noDomAccess': !![],
      'noArbitraryStoreWrites': !![],
      'noDirectNetwork': !![],
      'noElectronAccess': !![],
      'batchConfirmThreshold': 0x5
    }
  };
  _0x1f4357["canvas"]['inputRefs'] = _0x2d4bec;
  return enforceContextBudget(_0x1f4357, _0x170af4);
}