import { generateId } from '../../core/math.js';
import { stripImageGenerationResultStateForDerivedNode, stripImageGenerationRuntimeState } from '../../core/imageTaskRuntimeState.js';
import { calcSafeSpawnPosNearNode, createDuplicateSpawnOffsets } from '../nodeSpawn.js';
import { listModelManifests, resolveModelExecution, sanitizeModelUiSchemaParams } from '../../manifests/index.js';
import { sanitizePromptHtmlForCommit } from '../nodePromptShared.js';
import { createCanvasCommandError } from './commandRegistry.js';
import { buildGenerationParamDisplayPatch } from './generationParamDisplay.js';
const SUPPORTED_CREATE_TYPES = new Set(["ai-text", "ai-image", "ai-video", "ai-audio", "source-text", "source-image", "source-video", "source-audio", "comment-note", "storyboard", 'storyboard-script', 'panorama-scene', "panorama-360", "collage", 'whiteboard', "media-clip", "debug"]);
const PROMPT_NODE_TYPES = new Set(['ai-text', "ai-image", "ai-video", "ai-audio", 'storyboard-script']);
const CONNECTED_CREATE_TYPES = new Set(['ai-text', "ai-image", "ai-video", "ai-audio"]);
const CREATE_TYPE_MODEL_KINDS = Object['freeze']({
  'ai-text': "text",
  'ai-image': "image",
  'ai-video': "video",
  'ai-audio': 'audio',
  'storyboard-script': "text"
});
const DEFAULT_NODE_SIZES = Object["freeze"]({
  'ai-text': Object["freeze"]({
    'width': 0x180,
    'height': 0x120
  }),
  'ai-image': Object["freeze"]({
    'width': 0x120,
    'height': 0x120
  }),
  'ai-video': Object["freeze"]({
    'width': 0x120,
    'height': 0x120
  }),
  'ai-audio': Object["freeze"]({
    'width': 0x140,
    'height': 0xf0
  }),
  'source-text': Object["freeze"]({
    'width': 0x140,
    'height': 0xb4
  }),
  'comment-note': Object["freeze"]({
    'width': 0x104,
    'height': 0x78
  }),
  'storyboard-script': Object["freeze"]({
    'width': 0x2d0,
    'height': 0x1a4
  }),
  'panorama-scene': Object["freeze"]({
    'width': 0x400,
    'height': 0x240
  })
});
const MEDIA_PREVIEW_KEYS = new Set(["base64", "dataUrl", "imageBase64", 'videoBase64', 'audioBase64', "thumbnailBase64", 'blob', "file", "frames", "images", 'videos', 'audios']);
function getState(_0x1d7685) {
  return _0x1d7685["store"]?.["getStateRaw"]?.() || _0x1d7685["store"]?.["getState"]?.() || {};
}
function getStore(_0x26d1ae) {
  return _0x26d1ae["graphStore"] || _0x26d1ae["store"];
}
function clonePlain(_0x5cfda2) {
  if (typeof structuredClone === "function") {
    return structuredClone(_0x5cfda2);
  }
  return JSON['parse'](JSON['stringify'](_0x5cfda2));
}
function normalizeNodeType(_0x3c36c8) {
  return String(_0x3c36c8 || '')['trim']();
}
function toFinitePositiveNumber(_0x567019, _0x1f9edd) {
  const _0x16f1b9 = Number(_0x567019);
  return Number["isFinite"](_0x16f1b9) && _0x16f1b9 > 0x0 ? _0x16f1b9 : _0x1f9edd;
}
function toFiniteNumber(_0x192e8f, _0x864859 = 0x0) {
  const _0x1ef518 = Number(_0x192e8f);
  return Number['isFinite'](_0x1ef518) ? _0x1ef518 : _0x864859;
}
function getNode(_0xd409ae, _0xc168bb) {
  const _0x62e9cf = String(_0xc168bb || '')["trim"]();
  return _0x62e9cf ? getState(_0xd409ae)["nodes"]?.[_0x62e9cf] || null : null;
}
function getNodes(_0x540a34) {
  return getState(_0x540a34)["nodes"] || {};
}
function getEdges(_0x104d8e) {
  return getState(_0x104d8e)["edges"] || {};
}
function getInitialText(_0x248198 = {}) {
  if (Object["prototype"]['hasOwnProperty']["call"](_0x248198, "prompt")) {
    return _0x248198["prompt"];
  }
  if (Object['prototype']["hasOwnProperty"]["call"](_0x248198, "text")) {
    return _0x248198["text"];
  }
  if (Object["prototype"]['hasOwnProperty']["call"](_0x248198, "content")) {
    return _0x248198['content'];
  }
  return undefined;
}
function sanitizeInitialPrompt(_0x4260d6) {
  const _0x5d9e2d = String(_0x4260d6 ?? '');
  if (!_0x5d9e2d['trim']()) {
    return '';
  }
  return /[<&]/["test"](_0x5d9e2d) ? sanitizePromptHtmlForCommit(_0x5d9e2d) : _0x5d9e2d;
}
function truncateText(_0x41b2a6, _0x4ce8a5 = 0x1f4) {
  const _0x5e1d6a = String(_0x41b2a6 || '')["replace"](/<[^>]*>/g, '\x20')["replace"](/\s+/g, '\x20')["trim"]();
  if (_0x5e1d6a['length'] <= _0x4ce8a5) {
    return _0x5e1d6a;
  }
  return _0x5e1d6a['slice'](0x0, Math['max'](0x0, _0x4ce8a5 - 0x3)) + "...";
}
function omitLargeMedia(_0x4a2483, _0x31fff7 = 0x0) {
  if (_0x4a2483 == null) {
    return _0x4a2483;
  }
  if (typeof _0x4a2483 !== "object") {
    return _0x4a2483;
  }
  if (_0x31fff7 > 0x2) {
    return "[omitted]";
  }
  if (Array['isArray'](_0x4a2483)) {
    return "[array:" + _0x4a2483["length"] + ']';
  }
  const _0x898297 = {};
  for (const [_0x2876b4, _0x2bb616] of Object["entries"](_0x4a2483)) {
    if (MEDIA_PREVIEW_KEYS["has"](_0x2876b4)) {
      _0x898297[_0x2876b4] = "[omitted]";
    } else {
      if (typeof _0x2bb616 === 'string' && _0x2bb616['length'] > 0x1f4) {
        _0x898297[_0x2876b4] = _0x2bb616["slice"](0x0, 0x78) + "...";
      } else {
        _0x2bb616 && typeof _0x2bb616 === "object" ? _0x898297[_0x2876b4] = omitLargeMedia(_0x2bb616, _0x31fff7 + 0x1) : _0x898297[_0x2876b4] = _0x2bb616;
      }
    }
  }
  return _0x898297;
}
function normalizeNodeIds(_0x49efe3 = {}, _0x25707c = {}, {
  min = 0x1,
  allowSelection = !![]
} = {}) {
  const _0x1143f9 = getNodes(_0x25707c);
  const _0x24e09e = getState(_0x25707c);
  const _0x197420 = Array["isArray"](_0x49efe3['ids']) && _0x49efe3['ids']["length"] > 0x0 ? _0x49efe3["ids"] : _0x49efe3["nodeId"] ? [_0x49efe3["nodeId"]] : allowSelection ? _0x24e09e["selectedNodeIds"] || [] : [];
  const _0x1429c5 = [];
  const _0x2b6925 = new Set();
  for (const _0x6513ba of _0x197420) {
    const _0x1e75d1 = String(_0x6513ba || '')["trim"]();
    if (!_0x1e75d1 || _0x2b6925["has"](_0x1e75d1)) {
      continue;
    }
    if (!_0x1143f9[_0x1e75d1]) {
      throw createCanvasCommandError("NODE_NOT_FOUND", "Canvas node not found: " + _0x1e75d1, {
        'nodeId': _0x1e75d1
      });
    }
    _0x1429c5["push"](_0x1e75d1);
    _0x2b6925['add'](_0x1e75d1);
  }
  if (_0x1429c5["length"] < min) {
    throw createCanvasCommandError("INSUFFICIENT_NODES", "At least " + min + '\x20canvas\x20node\x20id(s)\x20are\x20required.');
  }
  return _0x1429c5;
}
function hasOwn(_0x8da710, _0x15026a) {
  return Object["prototype"]['hasOwnProperty']["call"](_0x8da710 || {}, _0x15026a);
}
function normalizeRenameOrder(_0xd9b728 = '') {
  const _0x5c7824 = String(_0xd9b728 || '')["trim"]()["toLowerCase"]();
  if (_0x5c7824 === "top-to-bottom" || _0x5c7824 === "top" || _0x5c7824 === "vertical" || _0x5c7824 === 'y' || _0x5c7824 === "y-asc") {
    return "top-to-bottom";
  }
  if (_0x5c7824 === "bottom-to-top" || _0x5c7824 === "bottom" || _0x5c7824 === 'y-desc') {
    return "bottom-to-top";
  }
  if (_0x5c7824 === "left-to-right" || _0x5c7824 === "left" || _0x5c7824 === "horizontal" || _0x5c7824 === 'x' || _0x5c7824 === "x-asc") {
    return "left-to-right";
  }
  if (_0x5c7824 === "right-to-left" || _0x5c7824 === "right" || _0x5c7824 === 'x-desc') {
    return "right-to-left";
  }
  return "selection";
}
function sortRenameIds(_0x38be2d = [], _0x5ec9fd = {}, _0x307ef0 = "selection") {
  const _0xe21d51 = normalizeRenameOrder(_0x307ef0);
  if (_0xe21d51 === 'selection' || _0x38be2d["length"] <= 0x1) {
    return _0x38be2d;
  }
  const _0x44bb2d = getNodes(_0x5ec9fd);
  const _0x3e8684 = new Map(_0x38be2d["map"]((_0x24bb49, _0x4a1fe2) => [_0x24bb49, _0x4a1fe2]));
  const _0x5eef55 = _0xe21d51 === 'top-to-bottom' || _0xe21d51 === "bottom-to-top" ? 'y' : 'x';
  const _0x598277 = _0x5eef55 === 'y' ? 'x' : 'y';
  const _0x174e4b = _0xe21d51 === 'bottom-to-top' || _0xe21d51 === 'right-to-left' ? -0x1 : 0x1;
  return [..._0x38be2d]['sort']((_0x2fbb70, _0x3217c5) => {
    const _0xb48cf5 = _0x44bb2d[_0x2fbb70] || {};
    const _0x12c1a3 = _0x44bb2d[_0x3217c5] || {};
    const _0x106625 = (toFiniteNumber(_0xb48cf5[_0x5eef55]) - toFiniteNumber(_0x12c1a3[_0x5eef55])) * _0x174e4b;
    if (_0x106625 !== 0x0) {
      return _0x106625;
    }
    const _0x441cbe = toFiniteNumber(_0xb48cf5[_0x598277]) - toFiniteNumber(_0x12c1a3[_0x598277]);
    if (_0x441cbe !== 0x0) {
      return _0x441cbe;
    }
    return (_0x3e8684["get"](_0x2fbb70) || 0x0) - (_0x3e8684['get'](_0x3217c5) || 0x0);
  });
}
function normalizeRenameNodeIds(_0x5d7300 = {}, _0x4a5c9e = {}) {
  const _0x561bfd = Array["isArray"](_0x5d7300['ids']) && _0x5d7300['ids']['length'] > 0x0;
  const _0x35a9ab = Boolean(String(_0x5d7300["nodeId"] || '')["trim"]());
  const _0x3b5891 = getState(_0x4a5c9e)["selectedNodeIds"];
  const _0x24f793 = Array["isArray"](_0x3b5891) && _0x3b5891["length"] > 0x0;
  if (!_0x561bfd && !_0x35a9ab && !_0x24f793) {
    throw createCanvasCommandError('MISSING_NODE_ID', "node.rename requires nodeId or ids.");
  }
  return normalizeNodeIds(_0x5d7300, _0x4a5c9e, {
    'min': 0x1,
    'allowSelection': !![]
  });
}
function getNodeKindFromType(_0x355784 = '') {
  const _0x24c1d1 = String(_0x355784 || '');
  if (_0x24c1d1["includes"]("video")) {
    return 'video';
  }
  if (_0x24c1d1["includes"]("image")) {
    return "image";
  }
  if (_0x24c1d1["includes"]('audio')) {
    return "audio";
  }
  if (_0x24c1d1["includes"]("text")) {
    return 'text';
  }
  return _0x24c1d1 || "node";
}
function formatRenameTemplate(_0x2380d6 = '', _0x7f348b = {}, {
  index = 0x1,
  zeroIndex = 0x0,
  nodeId = ''
} = {}) {
  const _0x1e2077 = String(_0x7f348b['type'] || '');
  const _0x35254b = {
    'index': String(index),
    'n': String(index),
    'i': String(index),
    'zeroIndex': String(zeroIndex),
    'id': nodeId,
    'nodeId': nodeId,
    'type': _0x1e2077,
    'kind': getNodeKindFromType(_0x1e2077),
    'name': String(_0x7f348b['name'] || ''),
    'originalName': String(_0x7f348b["name"] || '')
  };
  return String(_0x2380d6)["replace"](/\{(index|n|i|zeroIndex|id|nodeId|type|kind|name|originalName)\}/g, (_0xb62f43, _0x206d9c) => _0x35254b[_0x206d9c] ?? '');
}
function getRenameStartIndex(_0x31fabb = {}) {
  const _0x2fff0e = Number(_0x31fabb["startIndex"] ?? _0x31fabb["start"] ?? 0x1);
  return Number["isFinite"](_0x2fff0e) ? Math["trunc"](_0x2fff0e) : 0x1;
}
function buildNumberedRenameName(_0x203fcc = {}, _0x55038e = 0x0) {
  const _0x1421ec = getRenameStartIndex(_0x203fcc);
  const _0x5f5689 = _0x1421ec + _0x55038e;
  const _0x4cee62 = String(_0x203fcc["separator"] ?? '\x20');
  const _0x37f8c1 = String(_0x203fcc["prefix"] ?? '');
  const _0xf6f08e = hasOwn(_0x203fcc, "name") ? String(_0x203fcc["name"] ?? '')["trim"]() : '';
  const _0x2eeb33 = String(_0x203fcc['suffix'] ?? '');
  const _0x11c290 = [String(_0x5f5689), _0xf6f08e]['filter'](_0x182dc8 => _0x182dc8 !== '')['join'](_0x4cee62);
  return ('' + _0x37f8c1 + _0x11c290 + _0x2eeb33)['trim']();
}
function hasRenameNameInput(_0x157993 = {}) {
  return hasOwn(_0x157993, 'name') || Array['isArray'](_0x157993["names"]) && _0x157993["names"]['length'] > 0x0 || hasOwn(_0x157993, "nameTemplate") || hasOwn(_0x157993, 'template') || hasOwn(_0x157993, "pattern") || _0x157993["numbered"] === !![] || hasOwn(_0x157993, "startIndex") || hasOwn(_0x157993, "start");
}
function resolveRenameNames(_0x2e156f = {}, _0x23eb70 = [], _0x579051 = {}) {
  if (!hasRenameNameInput(_0x2e156f)) {
    throw createCanvasCommandError("MISSING_NODE_NAME", "node.rename requires name.");
  }
  if (Array["isArray"](_0x2e156f["names"]) && _0x2e156f["names"]['length'] > 0x0) {
    if (_0x2e156f['names']['length'] !== _0x23eb70["length"]) {
      throw createCanvasCommandError("RENAME_NAME_COUNT_MISMATCH", "node.rename names length must match target ids length.", {
        'ids': _0x23eb70,
        'names': _0x2e156f["names"]
      });
    }
    return _0x2e156f['names']["map"](_0xebd41b => String(_0xebd41b ?? '')['trim']());
  }
  const _0x40b1ca = String(_0x2e156f["nameTemplate"] ?? _0x2e156f["template"] ?? _0x2e156f['pattern'] ?? '');
  if (_0x40b1ca) {
    const _0x2a0130 = getRenameStartIndex(_0x2e156f);
    return _0x23eb70['map']((_0x48c409, _0x2bd519) => formatRenameTemplate(_0x40b1ca, getNode(_0x579051, _0x48c409) || {}, {
      'index': _0x2a0130 + _0x2bd519,
      'zeroIndex': _0x2bd519,
      'nodeId': _0x48c409
    })['trim']());
  }
  const _0x5be9a9 = _0x2e156f["numbered"] === !![] || hasOwn(_0x2e156f, "startIndex") || hasOwn(_0x2e156f, "start") || hasOwn(_0x2e156f, "separator");
  if (_0x5be9a9) {
    return _0x23eb70["map"]((_0x64e78e, _0x16d8ed) => buildNumberedRenameName(_0x2e156f, _0x16d8ed));
  }
  const _0x32144c = String(_0x2e156f["name"] ?? '')["trim"]();
  return _0x23eb70["map"](() => _0x32144c);
}
function buildRenameEntries(_0x15e326 = {}, _0x4134ee = {}) {
  const _0x3c3320 = sortRenameIds(normalizeRenameNodeIds(_0x15e326, _0x4134ee), _0x4134ee, _0x15e326["orderBy"] ?? _0x15e326["order"]);
  const _0x58cc11 = resolveRenameNames(_0x15e326, _0x3c3320, _0x4134ee);
  return _0x3c3320['map']((_0x58138c, _0x15df48) => ({
    'nodeId': _0x58138c,
    'name': _0x58cc11[_0x15df48]
  }));
}
function normalizeEdgeId(_0x4521ab) {
  return String(_0x4521ab || '')["trim"]();
}
function normalizeEdgeArgs(_0x125f33 = {}) {
  return {
    'edgeId': normalizeEdgeId(_0x125f33["edgeId"] || _0x125f33['id']),
    'sourceId': String(_0x125f33['sourceId'] || _0x125f33["source"] || '')["trim"](),
    'targetId': String(_0x125f33["targetId"] || _0x125f33["target"] || '')['trim'](),
    'refSlot': String(_0x125f33["refSlot"] || _0x125f33["slot"] || '')["trim"]()
  };
}
function findEdgesByEndpoints(_0x1310a6, {
  sourceId: _0x1ea529,
  targetId: _0x2f1c89,
  refSlot = ''
}) {
  return Object["values"](getEdges(_0x1310a6))["filter"](_0x1fd6e0 => {
    if (!_0x1fd6e0) {
      return ![];
    }
    if (_0x1ea529 && _0x1fd6e0["sourceId"] !== _0x1ea529) {
      return ![];
    }
    if (_0x2f1c89 && _0x1fd6e0["targetId"] !== _0x2f1c89) {
      return ![];
    }
    if (refSlot && String(_0x1fd6e0["refSlot"] || '') !== refSlot) {
      return ![];
    }
    return !![];
  });
}
function resolveCreateSize(_0x301919, _0x589b1e = {}, _0x2b91b6 = {}) {
  const _0x491021 = DEFAULT_NODE_SIZES[_0x301919] || {
    'width': 0x12c,
    'height': 0x12c
  };
  let _0x17a9c6 = null;
  if (PROMPT_NODE_TYPES['has'](_0x301919) && typeof _0x2b91b6["getAIGenerationDefaultSizeByType"] === "function") {
    _0x17a9c6 = _0x2b91b6["getAIGenerationDefaultSizeByType"](_0x301919);
  } else {
    typeof _0x2b91b6["getNodeDefaultSize"] === "function" && (_0x17a9c6 = _0x2b91b6['getNodeDefaultSize'](_0x301919));
  }
  const _0xcfaa23 = _0x17a9c6 && typeof _0x17a9c6 === "object" ? _0x17a9c6 : _0x491021;
  return {
    'width': toFinitePositiveNumber(_0x589b1e['width'], toFinitePositiveNumber(_0xcfaa23["width"], _0x491021["width"])),
    'height': toFinitePositiveNumber(_0x589b1e['height'], toFinitePositiveNumber(_0xcfaa23["height"], _0x491021["height"]))
  };
}
function hasExplicitCreatePosition(_0x272665 = {}) {
  return Number["isFinite"](Number(_0x272665['x'])) && Number['isFinite'](Number(_0x272665['y']));
}
function buildConnectedNodeData(_0x5ef088 = {}, _0x3018c9 = {}) {
  const _0x2ad420 = getNode(_0x3018c9, _0x5ef088["sourceId"]);
  const _0x36d987 = resolveCreateSize(_0x5ef088["type"], _0x5ef088, _0x3018c9);
  const _0x4da9bd = (_0x5ef088["type"] === "ai-image" || _0x5ef088["type"] === 'ai-video') && toFinitePositiveNumber(_0x2ad420?.["width"], 0x0) > 0x0 && toFinitePositiveNumber(_0x2ad420?.["height"], 0x0) > 0x0 && typeof _0x3018c9["getAIGenerationNodeSize"] === 'function';
  const _0x1c63d8 = _0x4da9bd ? _0x3018c9["getAIGenerationNodeSize"](_0x2ad420["width"], _0x2ad420["height"]) : _0x36d987;
  const _0x294bd9 = toFinitePositiveNumber(_0x1c63d8?.["width"], _0x36d987['width']);
  const _0x212b9e = toFinitePositiveNumber(_0x1c63d8?.["height"], _0x36d987["height"]);
  const _0x37d8a2 = calcSafeSpawnPosNearNode(getNodes(_0x3018c9), _0x2ad420, _0x294bd9, _0x212b9e);
  const _0x162416 = generateId(_0x5ef088['type']);
  let _0x2a81e1 = {
    'id': _0x162416,
    'type': _0x5ef088["type"],
    'x': _0x37d8a2['x'],
    'y': _0x37d8a2['y'],
    'width': _0x294bd9,
    'height': _0x212b9e,
    'name': String(_0x5ef088["name"] || _0x5ef088["label"] || '')
  };
  (_0x5ef088['type'] === "ai-image" || _0x5ef088['type'] === 'ai-video') && !Object['prototype']["hasOwnProperty"]["call"](_0x2a81e1, "aspectRatio") && (_0x2a81e1["aspectRatio"] = "自适应");
  if (_0x5ef088['inheritSource'] !== ![] && _0x2ad420?.["type"] === _0x5ef088['type']) {
    const _0x44286a = clonePlain(_0x2ad420);
    delete _0x44286a['id'];
    delete _0x44286a['x'];
    delete _0x44286a['y'];
    delete _0x44286a['width'];
    delete _0x44286a["height"];
    delete _0x44286a["name"];
    delete _0x44286a["prompt"];
    delete _0x44286a['outputText'];
    stripImageGenerationResultStateForDerivedNode(_0x44286a);
    _0x2a81e1 = {
      ..._0x44286a,
      ..._0x2a81e1
    };
  }
  return _0x2a81e1;
}
function applyInitialNodeText(_0x13bfde, _0x412531, _0x3c8cd1) {
  const _0xbe0931 = getInitialText(_0x412531);
  if (_0xbe0931 === undefined || _0xbe0931 === null) {
    return _0x13bfde;
  }
  const _0x26475e = String(_0x13bfde?.['id'] || '')["trim"]();
  const _0x3f7d47 = String(_0x13bfde?.['type'] || '')['trim']();
  if (!_0x26475e) {
    return _0x13bfde;
  }
  let _0x3b294b = null;
  if (PROMPT_NODE_TYPES["has"](_0x3f7d47)) {
    _0x3b294b = {
      'prompt': sanitizeInitialPrompt(_0xbe0931)
    };
  } else {
    (_0x3f7d47 === "source-text" || _0x3f7d47 === "comment-note") && (_0x3b294b = {
      'content': String(_0xbe0931 || '')
    });
  }
  if (!_0x3b294b) {
    return _0x13bfde;
  }
  getStore(_0x3c8cd1)?.['updateNodeData']?.(_0x26475e, _0x3b294b);
  _0x3c8cd1["commit"]?.();
  return getNode(_0x3c8cd1, _0x26475e) || {
    ..._0x13bfde,
    ..._0x3b294b
  };
}
function isImageNodeType(_0x118a3c = '') {
  const _0x252e2d = String(_0x118a3c || '');
  return _0x252e2d === "ai-image" || _0x252e2d === "source-image";
}
function hasSelectedImageInput(_0x365760 = {}) {
  const _0x5ed050 = getState(_0x365760);
  const _0x5303c6 = Array["isArray"](_0x5ed050['selectedNodeIds']) ? _0x5ed050['selectedNodeIds'] : [];
  return _0x5303c6["some"](_0x40cb5a => isImageNodeType(_0x5ed050["nodes"]?.[_0x40cb5a]?.['type']));
}
function manifestAllowsImageInput(_0x36b601 = {}) {
  const _0x58f15c = _0x36b601?.["inputSlots"] && typeof _0x36b601["inputSlots"] === "object" ? _0x36b601["inputSlots"] : {};
  const _0x1a1a09 = Array['isArray'](_0x58f15c["allowedKinds"]) ? _0x58f15c["allowedKinds"] : [];
  if (_0x1a1a09['includes']("image")) {
    return !![];
  }
  const _0x33980f = Number(_0x58f15c["maxByKind"]?.["image"]);
  return Number["isFinite"](_0x33980f) && _0x33980f > 0x0;
}
function manifestAllowsTextInput(_0x35ffe0 = {}) {
  const _0x415e03 = _0x35ffe0?.["inputSlots"] && typeof _0x35ffe0['inputSlots'] === "object" ? _0x35ffe0["inputSlots"] : {};
  const _0x396bb9 = Array['isArray'](_0x415e03["allowedKinds"]) ? _0x415e03["allowedKinds"] : [];
  return _0x396bb9['length'] === 0x0 || _0x396bb9['includes']('text');
}
function manifestRequiresMissingMedia(_0x2e50f4 = {}, {
  hasImageInput = ![]
} = {}) {
  const _0x166d2d = _0x2e50f4?.["inputSlots"] && typeof _0x2e50f4["inputSlots"] === 'object' ? _0x2e50f4["inputSlots"] : {};
  const _0x166850 = _0x166d2d["minByKind"] || {};
  if (!hasImageInput && Number(_0x166850["image"]) > 0x0) {
    return !![];
  }
  if (Number(_0x166850["video"]) > 0x0) {
    return !![];
  }
  if (Number(_0x166850['audio']) > 0x0) {
    return !![];
  }
  const _0x43e099 = Array['isArray'](_0x166d2d["fixedSlots"]) ? _0x166d2d['fixedSlots'] : [];
  return _0x43e099["some"](_0xfcf51e => {
    if (_0xfcf51e?.["required"] !== !![]) {
      return ![];
    }
    const _0xa838d2 = String(_0xfcf51e?.['kind'] || '');
    if (_0xa838d2 === "image") {
      return !hasImageInput;
    }
    return _0xa838d2 === "video" || _0xa838d2 === "audio";
  });
}
function getManifestFieldIds(_0x1d300c = {}) {
  return new Set((Array["isArray"](_0x1d300c?.['uiSchema']?.['fields']) ? _0x1d300c["uiSchema"]["fields"] : [])["map"](_0x49f435 => String(_0x49f435?.['id'] || '')["trim"]())['filter'](Boolean));
}
function findAutoCreateModel(_0x4e02f5 = {}, _0x2b662b = '', _0x4826ca = {}) {
  const _0x5bc3c8 = _0x2b662b === "ai-video";
  const _0x413f89 = _0x2b662b === "ai-image";
  if (!_0x5bc3c8 && !_0x413f89) {
    return null;
  }
  const _0x18651e = _0x4e02f5['params'] && typeof _0x4e02f5["params"] === "object" && !Array["isArray"](_0x4e02f5["params"]) ? Object["keys"](_0x4e02f5['params']) : [];
  if (_0x413f89 && _0x18651e["length"] === 0x0) {
    return null;
  }
  const _0x52a1cf = _0x5bc3c8 ? "video" : "image";
  const _0x527d0a = _0x5bc3c8 && hasSelectedImageInput(_0x4826ca);
  const _0x4e2650 = listModelManifests()["filter"](_0x49ba9c => {
    if (_0x49ba9c?.['kind'] !== _0x52a1cf || !_0x49ba9c?.['modelId']) {
      return ![];
    }
    const _0x43fdbd = _0x5bc3c8 ? _0x527d0a ? manifestAllowsImageInput(_0x49ba9c) : manifestAllowsTextInput(_0x49ba9c) : manifestAllowsTextInput(_0x49ba9c);
    if (!_0x43fdbd) {
      return ![];
    }
    if (manifestRequiresMissingMedia(_0x49ba9c, {
      'hasImageInput': _0x5bc3c8 ? _0x527d0a : ![]
    })) {
      return ![];
    }
    if (!_0x413f89) {
      return !![];
    }
    const _0xe36aa0 = getManifestFieldIds(_0x49ba9c);
    return _0x18651e['every'](_0x239845 => _0xe36aa0["has"](_0x239845));
  })["map"](_0x56db60 => {
    const _0x4bd97f = getManifestFieldIds(_0x56db60);
    let _0x79e5e7 = _0x56db60["vip"] === !![] ? 0x0 : 0xa;
    _0x5bc3c8 && !_0x527d0a && !manifestAllowsImageInput(_0x56db60) && (_0x79e5e7 += 0x8);
    for (const _0x48d656 of _0x18651e) {
      if (_0x4bd97f["has"](_0x48d656)) {
        _0x79e5e7 += 0x14;
      }
    }
    if (_0x5bc3c8 && _0x4bd97f['has']("duration")) {
      _0x79e5e7 += 0x8;
    }
    if (_0x4bd97f["has"]('aspectRatio')) {
      _0x79e5e7 += 0x4;
    }
    const _0x2a9a9 = Number(_0x5bc3c8 ? _0x56db60['extensions']?.["videoMenu"]?.["order"] : _0x56db60['extensions']?.["imageMenu"]?.["order"]) || 0x0;
    _0x79e5e7 += Math["max"](0x0, 0x64 - _0x2a9a9) / 0x64;
    return {
      'manifest': _0x56db60,
      'score': _0x79e5e7
    };
  })['sort']((_0x1f9cbc, _0x10e6ae) => {
    if (_0x10e6ae["score"] !== _0x1f9cbc["score"]) {
      return _0x10e6ae["score"] - _0x1f9cbc["score"];
    }
    return String(_0x1f9cbc["manifest"]['modelId'])["localeCompare"](String(_0x10e6ae["manifest"]["modelId"]));
  });
  return _0x4e2650[0x0]?.["manifest"] || null;
}
function isAutoModelPlaceholder(_0x36cabb = '') {
  const _0x1de491 = String(_0x36cabb || '')['trim']()['toLowerCase']();
  return !_0x1de491 || _0x1de491 === "auto" || _0x1de491 === "default" || _0x1de491 === 'unknown';
}
function validateCreateModelArgs(_0x20cad8 = {}, _0x44d5ef = '', _0x5dcaa3 = {}) {
  const _0x406e59 = String(_0x20cad8["model"] || _0x20cad8["modelId"] || '')['trim']();
  if (isAutoModelPlaceholder(_0x406e59)) {
    const _0x5bbb9d = findAutoCreateModel(_0x20cad8, _0x44d5ef, _0x5dcaa3);
    if (_0x5bbb9d) {
      return {
        'args': {
          'model': _0x5bbb9d['modelId'],
          'provider': _0x5bbb9d['provider'] || ''
        }
      };
    }
    const _0x4d489f = _0x20cad8['params'] && typeof _0x20cad8["params"] === "object" && !Array["isArray"](_0x20cad8['params']) && Object['keys'](_0x20cad8["params"])["length"] > 0x0;
    if (CREATE_TYPE_MODEL_KINDS[_0x44d5ef] && _0x4d489f) {
      return {
        'ok': ![],
        'errorCode': "MODEL_REQUIRED_FOR_PARAMS",
        'message': "node.create requires a resolvable model when params are provided."
      };
    }
    return {
      'args': {}
    };
  }
  const _0x59ae06 = String(_0x20cad8["provider"] || '')["trim"]();
  const _0x3fa244 = resolveModelExecution(_0x406e59, {
    'providerHint': _0x59ae06
  });
  const _0x527e0a = _0x3fa244?.['modelManifest'];
  if (!_0x527e0a) {
    return {
      'ok': ![],
      'errorCode': "MODEL_MANIFEST_NOT_FOUND",
      'message': "Model manifest not found: " + _0x406e59
    };
  }
  const _0x5155c1 = CREATE_TYPE_MODEL_KINDS[_0x44d5ef] || '';
  if (_0x5155c1 && String(_0x527e0a['kind'] || '') !== _0x5155c1) {
    return {
      'ok': ![],
      'errorCode': "MODEL_KIND_MISMATCH",
      'message': 'Model\x20' + _0x406e59 + '\x20is\x20' + (_0x527e0a["kind"] || "(unknown)") + ", not " + _0x5155c1 + '.'
    };
  }
  return {
    'args': {
      'model': _0x527e0a["modelId"] || _0x406e59,
      'provider': _0x527e0a["provider"] || _0x59ae06
    }
  };
}
function applyInitialNodeModel(_0x56372f, _0x3bb485, _0x4dc75f) {
  const _0xaac54e = String(_0x3bb485["model"] || '')["trim"]();
  if (!_0xaac54e) {
    return _0x56372f;
  }
  const _0x44da66 = String(_0x56372f?.['id'] || '')["trim"]();
  if (!_0x44da66) {
    return _0x56372f;
  }
  const _0x175f75 = resolveModelExecution(_0xaac54e, {
    'providerHint': String(_0x3bb485["provider"] || '')["trim"]()
  });
  const _0x36edbd = _0x175f75?.["modelManifest"] || null;
  const _0x51c129 = _0x56372f?.['generationParams'] && typeof _0x56372f["generationParams"] === "object" && !Array['isArray'](_0x56372f["generationParams"]) ? _0x56372f['generationParams'] : {};
  const _0x3f9c62 = _0x3bb485["params"] && typeof _0x3bb485["params"] === "object" && !Array["isArray"](_0x3bb485["params"]) ? _0x3bb485["params"] : {};
  const _0x2ec305 = _0x36edbd ? sanitizeModelUiSchemaParams(_0x36edbd["modelId"], {
    ..._0x51c129,
    ..._0x3f9c62
  }, {
    'includeDefaults': !![]
  }) : {};
  const _0x2862cf = getStore(_0x4dc75f);
  const _0x12ba99 = {
    'model': _0xaac54e,
    'provider': String(_0x3bb485["provider"] || '')["trim"](),
    'generationParams': _0x2ec305,
    ...buildGenerationParamDisplayPatch({
      'store': _0x2862cf,
      'nodeId': _0x44da66,
      'nodeData': _0x56372f,
      'modelId': _0xaac54e,
      'generationParams': _0x2ec305,
      'force': !![],
      'respectManualDisplaySize': ![]
    })
  };
  _0x2862cf?.["updateNodeData"]?.(_0x44da66, _0x12ba99);
  _0x4dc75f["commit"]?.();
  return getNode(_0x4dc75f, _0x44da66) || {
    ..._0x56372f,
    ..._0x12ba99
  };
}
function buildNodeSummary(_0x4ce310, _0x57f7d2, {
  includeData = ![]
} = {}) {
  const _0x3a7dbc = getNode(_0x4ce310, _0x57f7d2);
  if (!_0x3a7dbc) {
    return null;
  }
  const _0x47f844 = resolveModelExecution(_0x3a7dbc["model"], {
    'providerHint': _0x3a7dbc["provider"]
  });
  const _0x58e474 = {
    'id': String(_0x3a7dbc['id'] || _0x57f7d2),
    'type': String(_0x3a7dbc["type"] || ''),
    'name': String(_0x3a7dbc["name"] || ''),
    'promptPreview': truncateText(_0x3a7dbc["prompt"] || _0x3a7dbc['storyboardScript']?.['prompt'] || ''),
    'contentPreview': truncateText(_0x3a7dbc['content'] || ''),
    'model': String(_0x3a7dbc["model"] || ''),
    'provider': String(_0x3a7dbc['provider'] || ''),
    'adapterType': String(_0x47f844?.["modelManifest"]?.["adapterType"] || _0x47f844?.['executionManifest']?.['adapterType'] || ''),
    'x': toFiniteNumber(_0x3a7dbc['x']),
    'y': toFiniteNumber(_0x3a7dbc['y']),
    'width': toFiniteNumber(_0x3a7dbc["width"]),
    'height': toFiniteNumber(_0x3a7dbc["height"]),
    'jobStatus': String(_0x3a7dbc['jobStatus'] || _0x3a7dbc["storyboardScript"]?.['jobStatus'] || (_0x3a7dbc["isGenerating"] ? "running" : "idle"))
  };
  if (includeData) {
    _0x58e474['data'] = omitLargeMedia(_0x3a7dbc);
  }
  return _0x58e474;
}
function buildCanvasSummary(_0x1b66db) {
  const _0x1462f5 = getState(_0x1b66db);
  const _0x14fa2b = Object["keys"](_0x1462f5["nodes"] || {})["map"](_0x594be4 => buildNodeSummary(_0x1b66db, _0x594be4));
  const _0x3337df = Object['values'](_0x1462f5["edges"] || {})["map"](_0x4331d1 => ({
    'id': String(_0x4331d1?.['id'] || ''),
    'sourceId': String(_0x4331d1?.["sourceId"] || ''),
    'targetId': String(_0x4331d1?.["targetId"] || ''),
    'refSlot': String(_0x4331d1?.["refSlot"] || ''),
    'type': String(_0x4331d1?.['type'] || '')
  }));
  return {
    'selectedNodeIds': Array['isArray'](_0x1462f5['selectedNodeIds']) ? [..._0x1462f5["selectedNodeIds"]] : [],
    'nodes': _0x14fa2b,
    'edges': _0x3337df,
    'viewport': {
      'x': toFiniteNumber(_0x1462f5["viewport"]?.['x']),
      'y': toFiniteNumber(_0x1462f5['viewport']?.['y']),
      'zoom': toFiniteNumber(_0x1462f5["viewport"]?.["zoom"], 0x1)
    },
    'nodeCount': _0x14fa2b["length"],
    'edgeCount': _0x3337df["length"]
  };
}
function validateNodeIds(_0x25a2d2, _0x166135, _0x459af5) {
  try {
    return {
      'args': {
        ..._0x25a2d2,
        'ids': normalizeNodeIds(_0x25a2d2, _0x166135, _0x459af5)
      }
    };
  } catch (_0x4407fc) {
    return {
      'ok': ![],
      'errorCode': _0x4407fc["errorCode"] || "INVALID_NODE_IDS",
      'message': _0x4407fc['message'],
      'details': _0x4407fc["details"]
    };
  }
}
function validateDeleteNodeIds(_0x251025 = {}, _0x457281 = {}) {
  if (String(_0x251025["nodeId"] || '')["trim"]()) {
    return validateNodeIds(_0x251025, _0x457281, {
      'min': 0x1,
      'allowSelection': !![]
    });
  }
  const _0x10d866 = getState(_0x457281);
  const _0x46913e = Array["isArray"](_0x251025['ids']) && _0x251025["ids"]["length"] > 0x0 ? _0x251025["ids"] : _0x10d866["selectedNodeIds"] || [];
  const _0x3c05fb = [];
  const _0x3fa0d5 = new Set();
  for (const _0xe14e40 of _0x46913e) {
    const _0x1c994d = String(_0xe14e40 || '')["trim"]();
    if (!_0x1c994d || _0x3fa0d5["has"](_0x1c994d) || !_0x10d866['nodes']?.[_0x1c994d]) {
      continue;
    }
    _0x3fa0d5["add"](_0x1c994d);
    _0x3c05fb["push"](_0x1c994d);
  }
  if (_0x3c05fb['length'] === 0x0) {
    return {
      'ok': ![],
      'errorCode': 'INSUFFICIENT_NODES',
      'message': 'node.delete\x20requires\x20at\x20least\x20one\x20existing\x20node.'
    };
  }
  return {
    'args': {
      ..._0x251025,
      'ids': _0x3c05fb
    }
  };
}
export function registerGraphCommands(_0x25dc72) {
  _0x25dc72["register"]({
    'id': "node.create",
    'description': "Create a canvas node.",
    'riskLevel': "safe",
    'argsSchema': {
      'required': ["type"],
      'properties': {
        'type': {
          'type': "string",
          'enum': Array['from'](SUPPORTED_CREATE_TYPES)
        },
        'name': {
          'type': "string"
        },
        'prompt': {
          'type': "string"
        },
        'text': {
          'type': "string"
        },
        'content': {
          'type': "string"
        },
        'model': {
          'type': 'string'
        },
        'modelId': {
          'type': "string"
        },
        'provider': {
          'type': "string"
        },
        'params': {
          'type': 'object'
        },
        'width': {
          'type': 'number'
        },
        'height': {
          'type': "number"
        },
        'x': {
          'type': 'number'
        },
        'y': {
          'type': "number"
        },
        'placement': {
          'type': "string"
        },
        'sequenceKey': {
          'type': 'string'
        }
      },
      'defaults': {
        'width': 'node\x20default',
        'height': "node default",
        'placement': "viewport-center-sequence"
      }
    },
    'capabilitySchema': {
      'reads': ["cursor", "selection", "modelRegistry"],
      'writes': ["nodes", "selection"]
    },
    'returnSchema': {
      'aliasFields': ['nodeId', "node"]
    },
    'validate'(_0x1b2e8a = {}, _0xfec1a5 = {}) {
      const _0x3030e8 = normalizeNodeType(_0x1b2e8a["type"]);
      if (!SUPPORTED_CREATE_TYPES["has"](_0x3030e8)) {
        return {
          'ok': ![],
          'errorCode': "UNSUPPORTED_NODE_TYPE",
          'message': "Unsupported node.create type: " + (_0x3030e8 || '(empty)')
        };
      }
      const _0x264310 = hasExplicitCreatePosition(_0x1b2e8a) && typeof _0xfec1a5['buildNodeData'] === "function";
      if (!_0x264310 && typeof _0xfec1a5["createNodeAtCursor"] !== "function") {
        return {
          'ok': ![],
          'errorCode': "NODE_CREATE_UNAVAILABLE",
          'message': "Canvas node creation flow is unavailable."
        };
      }
      const _0xeb09cc = validateCreateModelArgs(_0x1b2e8a, _0x3030e8, _0xfec1a5);
      if (_0xeb09cc['ok'] === ![]) {
        return _0xeb09cc;
      }
      return {
        'args': {
          ..._0x1b2e8a,
          ..._0xeb09cc["args"],
          'type': _0x3030e8
        }
      };
    },
    'execute'(_0x1c25e4, _0x3e312a) {
      const {
        width: _0x54e37d,
        height: _0x5930a6
      } = resolveCreateSize(_0x1c25e4["type"], _0x1c25e4, _0x3e312a);
      const _0xaff048 = String(_0x1c25e4["name"] || _0x1c25e4["label"] || '');
      const _0x3ff79f = _0x1c25e4["agentReservation"] === !![];
      const _0xd98c54 = _0x3ff79f ? [...(Array['isArray'](getState(_0x3e312a)["selectedNodeIds"]) ? getState(_0x3e312a)["selectedNodeIds"] : [])] : [];
      const _0x2baee0 = String(_0x1c25e4["reuseNodeId"] || '')['trim']();
      const _0x4cea57 = _0x2baee0 ? getNode(_0x3e312a, _0x2baee0) : null;
      if (_0x4cea57 && String(_0x4cea57["type"] || '')["trim"]() === _0x1c25e4['type']) {
        const _0x1d0908 = getStore(_0x3e312a);
        const _0x5cb9c2 = {
          ..._0x3e312a,
          'commit': null
        };
        (Object["prototype"]["hasOwnProperty"]['call'](_0x1c25e4, 'name') || _0x1c25e4["label"] != null) && _0x1d0908?.["updateNodeData"]?.(_0x2baee0, {
          'name': _0xaff048
        });
        const _0x2ce34a = applyInitialNodeModel(getNode(_0x3e312a, _0x2baee0) || _0x4cea57, _0x1c25e4, _0x5cb9c2);
        const _0xfd4956 = applyInitialNodeText(_0x2ce34a, _0x1c25e4, _0x5cb9c2);
        _0x1d0908?.["setSelectedNodes"]?.([_0x2baee0]);
        _0x3e312a["commit"]?.();
        return {
          'nodeId': _0x2baee0,
          'node': getNode(_0x3e312a, _0x2baee0) || _0xfd4956 || _0x4cea57,
          'reused': !![]
        };
      }
      if (hasExplicitCreatePosition(_0x1c25e4) && typeof _0x3e312a['buildNodeData'] === "function") {
        const _0x47d206 = generateId(_0x1c25e4["type"]);
        const _0x429d97 = _0x3e312a["buildNodeData"]({
          ..._0x1c25e4,
          'id': _0x47d206,
          'type': _0x1c25e4['type'],
          'name': _0xaff048,
          'width': _0x54e37d,
          'height': _0x5930a6,
          'x': Number(_0x1c25e4['x']),
          'y': Number(_0x1c25e4['y'])
        });
        if (!_0x429d97 || typeof _0x429d97 !== "object") {
          throw createCanvasCommandError('NODE_CREATE_FAILED', "Canvas node factory did not return data for type: " + _0x1c25e4["type"]);
        }
        getStore(_0x3e312a)?.["addNode"]?.(_0x429d97);
        getStore(_0x3e312a)?.["setSelectedNodes"]?.(_0x3ff79f ? _0xd98c54 : [_0x47d206]);
        const _0x4c7f17 = {
          ..._0x3e312a,
          'commit': null
        };
        const _0x1cc2d8 = applyInitialNodeModel(_0x429d97, _0x1c25e4, _0x4c7f17);
        const _0x26f868 = applyInitialNodeText(_0x1cc2d8, _0x1c25e4, _0x4c7f17);
        _0x3e312a["commit"]?.();
        return {
          'nodeId': _0x26f868?.['id'] || _0x47d206,
          'node': _0x26f868 || _0x429d97
        };
      }
      const _0x537841 = String(_0x1c25e4["placement"] || "viewport-center-sequence")["trim"]();
      const _0x513c09 = String(_0x1c25e4["sequenceKey"] || _0x3e312a["createNodeSequenceKey"] || '')['trim']();
      const _0x48e365 = _0x3e312a["createNodeAtCursor"](_0x1c25e4["type"], _0x54e37d, _0x5930a6, _0xaff048, {
        'placement': _0x537841,
        'sequenceKey': _0x513c09
      });
      if (_0x3ff79f) {
        getStore(_0x3e312a)?.["setSelectedNodes"]?.(_0xd98c54);
      }
      const _0x332660 = applyInitialNodeModel(_0x48e365, _0x1c25e4, _0x3e312a);
      const _0x218b1a = applyInitialNodeText(_0x332660, _0x1c25e4, _0x3e312a);
      return {
        'nodeId': _0x218b1a?.['id'] || _0x48e365?.['id'] || '',
        'node': _0x218b1a || _0x48e365
      };
    }
  });
  _0x25dc72["register"]({
    'id': "node.createConnected",
    'description': "Create a generation node next to a source node and connect them.",
    'riskLevel': 'safe',
    'argsSchema': {
      'required': ["sourceId", 'type'],
      'properties': {
        'sourceId': {
          'type': 'string'
        },
        'type': {
          'type': 'string',
          'enum': Array["from"](CONNECTED_CREATE_TYPES)
        },
        'name': {
          'type': 'string'
        },
        'label': {
          'type': "string"
        },
        'width': {
          'type': "number"
        },
        'height': {
          'type': "number"
        },
        'inheritSource': {
          'type': "boolean"
        }
      },
      'defaults': {
        'inheritSource': !![],
        'placement': "right-of-source"
      }
    },
    'capabilitySchema': {
      'reads': ["nodes", 'edges'],
      'writes': ["nodes", "edges", "selection"]
    },
    'returnSchema': {
      'aliasFields': ["nodeId", "node", 'edgeId', "sourceId"]
    },
    'validate'(_0x1dfaae = {}, _0x5c6ed3 = {}) {
      const _0x4f39ab = String(_0x1dfaae['sourceId'] || '')["trim"]();
      const _0x5a529c = normalizeNodeType(_0x1dfaae["type"]);
      if (!_0x4f39ab) {
        return {
          'ok': ![],
          'errorCode': 'MISSING_SOURCE_NODE_ID',
          'message': "node.createConnected requires sourceId."
        };
      }
      if (!getNode(_0x5c6ed3, _0x4f39ab)) {
        return {
          'ok': ![],
          'errorCode': "NODE_NOT_FOUND",
          'message': "Canvas node not found: " + _0x4f39ab
        };
      }
      if (!CONNECTED_CREATE_TYPES["has"](_0x5a529c)) {
        return {
          'ok': ![],
          'errorCode': "UNSUPPORTED_NODE_TYPE",
          'message': "Unsupported node.createConnected type: " + (_0x5a529c || "(empty)")
        };
      }
      return {
        'args': {
          ..._0x1dfaae,
          'sourceId': _0x4f39ab,
          'type': _0x5a529c
        }
      };
    },
    'execute'(_0x9cc2dd, _0x588702) {
      const _0x5692d7 = getStore(_0x588702);
      const _0x5b7b89 = buildConnectedNodeData(_0x9cc2dd, _0x588702);
      const _0x17744c = new Set(Object["keys"](getEdges(_0x588702)));
      _0x5692d7?.["addNode"]?.(_0x5b7b89);
      const _0x4809f5 = typeof _0x588702['connectNodes'] === "function" ? _0x588702["connectNodes"]({
        'sourceId': _0x9cc2dd["sourceId"],
        'targetId': _0x5b7b89['id']
      }) : ![];
      let _0x245623 = '';
      if (_0x4809f5) {
        _0x245623 = Object["keys"](getEdges(_0x588702))["find"](_0x539756 => !_0x17744c['has'](_0x539756)) || '';
      } else {
        const _0x560fbc = {
          'id': generateId("edge"),
          'sourceId': _0x9cc2dd['sourceId'],
          'targetId': _0x5b7b89['id'],
          'createdAt': Date['now']()
        };
        _0x5692d7?.["addEdge"]?.(_0x560fbc);
        _0x245623 = _0x560fbc['id'];
      }
      _0x5692d7?.["setSelectedNodes"]?.([_0x5b7b89['id']]);
      _0x588702["commit"]?.();
      return {
        'nodeId': _0x5b7b89['id'],
        'node': _0x5b7b89,
        'edgeId': _0x245623,
        'sourceId': _0x9cc2dd["sourceId"]
      };
    }
  });
  _0x25dc72["register"]({
    'id': "node.delete",
    'description': "Delete canvas nodes.",
    'riskLevel': 'danger',
    'argsSchema': {
      'properties': {
        'nodeId': {
          'type': "string"
        },
        'ids': {
          'type': "array",
          'items': {
            'type': "string"
          }
        }
      },
      'selectionFallback': !![]
    },
    'capabilitySchema': {
      'reads': ['nodes', "selection"],
      'writes': ["nodes", "edges", "selection"],
      'selectionFallback': !![]
    },
    'returnSchema': {
      'aliasFields': ["ids"]
    },
    'validate'(_0x3cd90c = {}, _0x186de5 = {}) {
      return validateDeleteNodeIds(_0x3cd90c, _0x186de5);
    },
    'execute'(_0x56a5bd, _0x5823cf) {
      const _0x43ec19 = getStore(_0x5823cf);
      _0x43ec19?.['deleteNodes']?.(_0x56a5bd["ids"]);
      typeof _0x43ec19?.['clearSelection'] === "function" ? _0x43ec19['clearSelection']() : _0x43ec19?.["setSelectedNodes"]?.([]);
      _0x5823cf["commit"]?.();
      return {
        'ids': _0x56a5bd["ids"]
      };
    }
  });
  _0x25dc72["register"]({
    'id': 'node.rename',
    'description': "Rename one or more canvas nodes.",
    'riskLevel': "safe",
    'argsSchema': {
      'properties': {
        'nodeId': {
          'type': "string"
        },
        'ids': {
          'type': 'array',
          'items': {
            'type': "string"
          }
        },
        'name': {
          'type': "string"
        },
        'names': {
          'type': "array",
          'items': {
            'type': "string"
          }
        },
        'nameTemplate': {
          'type': "string"
        },
        'template': {
          'type': "string"
        },
        'pattern': {
          'type': "string"
        },
        'numbered': {
          'type': "boolean"
        },
        'startIndex': {
          'type': "number"
        },
        'start': {
          'type': "number"
        },
        'separator': {
          'type': 'string'
        },
        'prefix': {
          'type': 'string'
        },
        'suffix': {
          'type': "string"
        },
        'orderBy': {
          'type': "string"
        },
        'order': {
          'type': "string"
        }
      },
      'defaults': {
        'selectionFallback': !![],
        'orderBy': "selection",
        'startIndex': 0x1
      },
      'selectionFallback': !![]
    },
    'capabilitySchema': {
      'reads': ["nodes", "selection"],
      'writes': ["nodes"],
      'selectionFallback': !![]
    },
    'returnSchema': {
      'aliasFields': ["nodeId", 'name', "ids", "names", "renamed"]
    },
    'validate'(_0x5b020a = {}, _0x4ed30b = {}) {
      try {
        const _0x5b4c68 = buildRenameEntries(_0x5b020a, _0x4ed30b);
        const _0x1de4d2 = _0x5b4c68[0x0] || {};
        return {
          'args': {
            ..._0x5b020a,
            'entries': _0x5b4c68,
            'nodeId': _0x1de4d2["nodeId"] || '',
            'name': _0x1de4d2['name'] ?? '',
            'ids': _0x5b4c68['map'](_0x3de97d => _0x3de97d["nodeId"]),
            'names': _0x5b4c68["map"](_0x4759e3 => _0x4759e3["name"])
          }
        };
      } catch (_0x4c360d) {
        return {
          'ok': ![],
          'errorCode': _0x4c360d['errorCode'] || "INVALID_RENAME_ARGS",
          'message': _0x4c360d["message"] || "Invalid node.rename args.",
          'details': _0x4c360d['details']
        };
      }
    },
    'execute'(_0x4e1766, _0x8d1b84) {
      const _0x3258fb = getStore(_0x8d1b84);
      const _0xa2f1f0 = Array["isArray"](_0x4e1766["entries"]) ? _0x4e1766["entries"] : [];
      const _0x409815 = () => {
        for (const _0x33e84d of _0xa2f1f0) {
          typeof _0x3258fb?.["renameNode"] === "function" ? _0x3258fb["renameNode"](_0x33e84d["nodeId"], _0x33e84d["name"]) : _0x3258fb?.["updateNodeData"]?.(_0x33e84d["nodeId"], {
            'name': _0x33e84d['name']
          });
        }
      };
      if (_0xa2f1f0["length"] > 0x1 && typeof _0x3258fb?.["batch"] === "function") {
        _0x3258fb["batch"](_0x409815);
      } else {
        _0x409815();
      }
      _0x8d1b84["commit"]?.();
      return {
        'nodeId': _0x4e1766['nodeId'],
        'name': _0x4e1766["name"],
        'ids': _0xa2f1f0["map"](_0x27b019 => _0x27b019["nodeId"]),
        'names': _0xa2f1f0["map"](_0x5afe14 => _0x5afe14["name"]),
        'renamed': _0xa2f1f0
      };
    }
  });
  _0x25dc72['register']({
    'id': "node.duplicate",
    'description': "Duplicate canvas nodes.",
    'riskLevel': "safe",
    'argsSchema': {
      'properties': {
        'nodeId': {
          'type': "string"
        },
        'ids': {
          'type': 'array',
          'items': {
            'type': "string"
          }
        },
        'copies': {
          'type': 'integer',
          'minimum': 0x1,
          'maximum': 0xc
        },
        'dx': {
          'type': 'number'
        },
        'dy': {
          'type': "number"
        },
        'placement': {
          'type': "string",
          'enum': ["offset", "spawn-preferences"]
        },
        'edgePolicy': {
          'type': 'string',
          'enum': ["internal", "all-touching"]
        }
      },
      'defaults': {
        'copies': 0x1,
        'dx': 0x28,
        'dy': 0x28,
        'placement': "offset",
        'edgePolicy': "internal"
      },
      'selectionFallback': !![]
    },
    'capabilitySchema': {
      'reads': ["nodes", 'edges', "selection"],
      'writes': ["nodes", "edges", "selection"],
      'selectionFallback': !![]
    },
    'returnSchema': {
      'aliasFields': ["ids", 'sourceIds']
    },
    'validate'(_0x130a93 = {}, _0x14f2bc = {}) {
      const _0x4380fc = validateNodeIds(_0x130a93, _0x14f2bc, {
        'min': 0x1,
        'allowSelection': !![]
      });
      if (_0x4380fc['ok'] === ![]) {
        return _0x4380fc;
      }
      const _0xda5016 = Number(_0x130a93["copies"] ?? 0x1);
      if (!Number["isInteger"](_0xda5016) || _0xda5016 < 0x1 || _0xda5016 > 0xc) {
        return {
          'ok': ![],
          'errorCode': "INVALID_DUPLICATE_COPIES",
          'message': "node.duplicate copies must be an integer between 1 and 12."
        };
      }
      return {
        'args': {
          ..._0x4380fc["args"],
          'copies': _0xda5016,
          'placement': _0x130a93["placement"] === "spawn-preferences" ? "spawn-preferences" : 'offset'
        }
      };
    },
    'execute'(_0x521115, _0x454f51) {
      const _0x7672f5 = getState(_0x454f51);
      const _0x481819 = getStore(_0x454f51);
      const _0x5d81ae = Math["max"](0x1, Math["min"](0xc, Math['trunc'](Number(_0x521115["copies"] || 0x1))));
      const _0x22ccde = toFiniteNumber(_0x521115['dx'], 0x28);
      const _0x51279b = toFiniteNumber(_0x521115['dy'], 0x28);
      const _0x10e128 = _0x521115["placement"] === "spawn-preferences" ? createDuplicateSpawnOffsets({
        'nodes': _0x7672f5["nodes"] || {},
        'sourceNodes': _0x521115["ids"]["map"](_0x32ede4 => _0x7672f5["nodes"]?.[_0x32ede4])["filter"](Boolean),
        'copies': _0x5d81ae
      }) : [];
      const _0x21e290 = String(_0x521115['edgePolicy'] || "internal") === "all-touching" ? "all-touching" : "internal";
      const _0x3034be = Object["values"](_0x7672f5['edges'] || {})['map'](_0x534c9d => clonePlain(_0x534c9d));
      const _0x5a4963 = [];
      const _0x1a87e9 = [];
      const _0x446ff9 = [];
      const _0x1d9fc6 = () => {
        for (let _0x69f1b2 = 0x1; _0x69f1b2 <= _0x5d81ae; _0x69f1b2 += 0x1) {
          const _0x2e2927 = _0x10e128[_0x69f1b2 - 0x1] || {
            'dx': _0x22ccde * _0x69f1b2,
            'dy': _0x51279b * _0x69f1b2
          };
          const _0x452e92 = new Map();
          for (const _0x12f761 of _0x521115['ids']) {
            const _0x1440a9 = _0x7672f5["nodes"]?.[_0x12f761];
            if (!_0x1440a9) {
              continue;
            }
            const _0x33336f = generateId(String(_0x1440a9["type"] || "node"));
            _0x452e92['set'](_0x12f761, _0x33336f);
            const _0x10ca57 = {
              ...clonePlain(_0x1440a9),
              'id': _0x33336f,
              'x': toFiniteNumber(_0x1440a9['x']) + _0x2e2927['dx'],
              'y': toFiniteNumber(_0x1440a9['y']) + _0x2e2927['dy'],
              '_bizRev': undefined
            };
            delete _0x10ca57['_bizRev'];
            stripImageGenerationRuntimeState(_0x10ca57);
            _0x481819?.["addNode"]?.(_0x10ca57);
            _0x1a87e9["push"](_0x33336f);
          }
          _0x5a4963["push"](_0x452e92);
          for (const _0x4485c0 of _0x3034be) {
            const _0x21422e = _0x452e92["has"](_0x4485c0?.["sourceId"]);
            const _0x367e92 = _0x452e92["has"](_0x4485c0?.['targetId']);
            const _0x29d064 = _0x21e290 === 'all-touching' ? _0x21422e || _0x367e92 : _0x21422e && _0x367e92;
            if (!_0x29d064) {
              continue;
            }
            _0x446ff9["push"]({
              ..._0x4485c0,
              'id': generateId("edge"),
              'sourceId': _0x21422e ? _0x452e92["get"](_0x4485c0['sourceId']) : _0x4485c0["sourceId"],
              'targetId': _0x367e92 ? _0x452e92["get"](_0x4485c0["targetId"]) : _0x4485c0["targetId"]
            });
          }
        }
        _0x446ff9["length"] > 0x0 && (typeof _0x481819?.["updateEdgesBatch"] === 'function' ? _0x481819["updateEdgesBatch"]([], _0x446ff9) : _0x446ff9["forEach"](_0x6a9843 => _0x481819?.["addEdge"]?.(_0x6a9843)));
        _0x481819?.["setSelectedNodes"]?.(_0x1a87e9);
      };
      if (typeof _0x481819?.["batch"] === "function") {
        _0x481819["batch"](_0x1d9fc6);
      } else {
        _0x1d9fc6();
      }
      _0x454f51["commit"]?.();
      return {
        'ids': _0x1a87e9,
        'sourceIds': _0x521115["ids"],
        'copies': _0x5d81ae,
        'idMap': Object["fromEntries"](_0x5a4963[0x0] || []),
        'idMaps': _0x5a4963["map"](_0x4ad938 => Object["fromEntries"](_0x4ad938)),
        'edgeIds': _0x446ff9['map'](_0x57d0e5 => _0x57d0e5['id'])
      };
    }
  });
  _0x25dc72["register"]({
    'id': 'node.getSummary',
    'description': "Get a canvas node summary.",
    'riskLevel': "safe",
    'argsSchema': {
      'required': ["nodeId"],
      'properties': {
        'nodeId': {
          'type': 'string'
        },
        'includeData': {
          'type': "boolean"
        }
      },
      'defaults': {
        'includeData': ![]
      }
    },
    'capabilitySchema': {
      'reads': ["nodes"],
      'writes': []
    },
    'returnSchema': {
      'aliasFields': ['id', "type", "name", "model", "provider"]
    },
    'validate'(_0x4cae9a = {}, _0x281642 = {}) {
      const _0x2ef466 = String(_0x4cae9a["nodeId"] || '')["trim"]();
      if (!_0x2ef466) {
        return {
          'ok': ![],
          'errorCode': "MISSING_NODE_ID",
          'message': "node.getSummary requires nodeId."
        };
      }
      if (!getNode(_0x281642, _0x2ef466)) {
        return {
          'ok': ![],
          'errorCode': 'NODE_NOT_FOUND',
          'message': "Canvas node not found: " + _0x2ef466
        };
      }
      return {
        'args': {
          'nodeId': _0x2ef466,
          'includeData': _0x4cae9a["includeData"] === !![]
        }
      };
    },
    'execute'(_0x42ec59, _0xf1d407) {
      return buildNodeSummary(_0xf1d407, _0x42ec59["nodeId"], {
        'includeData': _0x42ec59["includeData"]
      });
    }
  });
  _0x25dc72["register"]({
    'id': 'graph.connect',
    'description': "Connect two canvas nodes.",
    'riskLevel': "safe",
    'argsSchema': {
      'required': ["sourceId", 'targetId'],
      'properties': {
        'sourceId': {
          'type': "string"
        },
        'targetId': {
          'type': 'string'
        },
        'refSlot': {
          'type': "string"
        },
        'edgeId': {
          'type': "string"
        },
        'type': {
          'type': "string"
        }
      }
    },
    'capabilitySchema': {
      'reads': ["nodes", 'edges'],
      'writes': ['edges']
    },
    'returnSchema': {
      'aliasFields': ['edgeId', "edge"]
    },
    'validate'(_0x342a6e = {}, _0x15dbfd = {}) {
      const _0x15ec92 = normalizeEdgeArgs(_0x342a6e);
      if (!_0x15ec92['sourceId'] || !_0x15ec92["targetId"]) {
        return {
          'ok': ![],
          'errorCode': "MISSING_EDGE_ENDPOINTS",
          'message': "graph.connect requires sourceId and targetId."
        };
      }
      if (_0x15ec92["sourceId"] === _0x15ec92['targetId']) {
        return {
          'ok': ![],
          'errorCode': "INVALID_EDGE_ENDPOINTS",
          'message': "graph.connect cannot connect a node to itself."
        };
      }
      if (!getNode(_0x15dbfd, _0x15ec92["sourceId"])) {
        return {
          'ok': ![],
          'errorCode': "NODE_NOT_FOUND",
          'message': "Canvas node not found: " + _0x15ec92["sourceId"]
        };
      }
      if (!getNode(_0x15dbfd, _0x15ec92["targetId"])) {
        return {
          'ok': ![],
          'errorCode': "NODE_NOT_FOUND",
          'message': "Canvas node not found: " + _0x15ec92["targetId"]
        };
      }
      return {
        'args': {
          ..._0x15ec92,
          'edgeId': _0x15ec92['edgeId'] || generateId("edge"),
          'type': _0x342a6e["type"] ?? null
        }
      };
    },
    'execute'(_0x3ac849, _0x125a9d) {
      const _0x5d03c7 = findEdgesByEndpoints(_0x125a9d, _0x3ac849)[0x0];
      if (_0x5d03c7) {
        return {
          'edgeId': _0x5d03c7['id'],
          'edge': _0x5d03c7,
          'reused': !![]
        };
      }
      const _0x567d24 = {
        'id': _0x3ac849['edgeId'],
        'sourceId': _0x3ac849["sourceId"],
        'targetId': _0x3ac849['targetId'],
        'type': _0x3ac849['type']
      };
      if (_0x3ac849["refSlot"]) {
        _0x567d24["refSlot"] = _0x3ac849['refSlot'];
      }
      getStore(_0x125a9d)?.["addEdge"]?.(_0x567d24);
      _0x125a9d["commit"]?.();
      return {
        'edgeId': _0x567d24['id'],
        'edge': _0x567d24,
        'reused': ![]
      };
    }
  });
  _0x25dc72["register"]({
    'id': "node.setInputSlot",
    'description': "Set or clear the input slot/refSlot on an existing edge.",
    'riskLevel': "safe",
    'argsSchema': {
      'required': ["refSlot"],
      'properties': {
        'edgeId': {
          'type': 'string'
        },
        'sourceId': {
          'type': "string"
        },
        'targetId': {
          'type': "string"
        },
        'refSlot': {
          'type': 'string'
        },
        'slot': {
          'type': "string"
        },
        'inputSlot': {
          'type': "string"
        }
      }
    },
    'capabilitySchema': {
      'reads': ["edges"],
      'writes': ["edges"]
    },
    'returnSchema': {
      'aliasFields': ["edgeId", "refSlot", "edge"]
    },
    'validate'(_0x5e5ab3 = {}, _0x236a83 = {}) {
      const _0x250746 = normalizeEdgeArgs(_0x5e5ab3);
      const _0x220e1c = Object["prototype"]["hasOwnProperty"]['call'](_0x5e5ab3, "refSlot") || Object['prototype']['hasOwnProperty']['call'](_0x5e5ab3, "slot") || Object['prototype']["hasOwnProperty"]["call"](_0x5e5ab3, "inputSlot");
      if (!_0x220e1c) {
        return {
          'ok': ![],
          'errorCode': "MISSING_REF_SLOT",
          'message': "node.setInputSlot requires refSlot, slot, or inputSlot."
        };
      }
      const _0xf03e33 = String(_0x5e5ab3['refSlot'] ?? _0x5e5ab3["slot"] ?? _0x5e5ab3["inputSlot"] ?? '')["trim"]();
      let _0x4f47ec = null;
      if (_0x250746["edgeId"]) {
        _0x4f47ec = getEdges(_0x236a83)[_0x250746["edgeId"]] || null;
        if (!_0x4f47ec) {
          return {
            'ok': ![],
            'errorCode': "EDGE_NOT_FOUND",
            'message': "Canvas edge not found: " + _0x250746['edgeId']
          };
        }
      } else {
        if (!_0x250746["sourceId"] || !_0x250746["targetId"]) {
          return {
            'ok': ![],
            'errorCode': "MISSING_EDGE_SELECTOR",
            'message': "node.setInputSlot requires edgeId or sourceId/targetId."
          };
        }
        _0x4f47ec = findEdgesByEndpoints(_0x236a83, _0x250746)[0x0] || null;
        if (!_0x4f47ec) {
          return {
            'ok': ![],
            'errorCode': "EDGE_NOT_FOUND",
            'message': 'No\x20canvas\x20edge\x20matched\x20node.setInputSlot.'
          };
        }
      }
      return {
        'args': {
          'edgeId': String(_0x4f47ec['id'] || ''),
          'refSlot': _0xf03e33
        }
      };
    },
    'execute'(_0xb2faae, _0x4b5dba) {
      const _0x173d5c = getEdges(_0x4b5dba)[_0xb2faae['edgeId']];
      if (!_0x173d5c) {
        throw createCanvasCommandError("EDGE_NOT_FOUND", "Canvas edge not found: " + _0xb2faae["edgeId"], {
          'edgeId': _0xb2faae['edgeId']
        });
      }
      const _0x206144 = {
        ..._0x173d5c
      };
      if (_0xb2faae['refSlot']) {
        _0x206144["refSlot"] = _0xb2faae['refSlot'];
      } else {
        delete _0x206144["refSlot"];
      }
      const _0x486926 = getStore(_0x4b5dba);
      typeof _0x486926?.['updateEdgesBatch'] === "function" ? _0x486926["updateEdgesBatch"]([_0xb2faae["edgeId"]], [_0x206144]) : (_0x486926?.["removeEdge"]?.(_0xb2faae["edgeId"]), _0x486926?.["addEdge"]?.(_0x206144));
      _0x4b5dba["commit"]?.();
      return {
        'edgeId': _0xb2faae["edgeId"],
        'refSlot': _0xb2faae["refSlot"],
        'edge': _0x206144
      };
    }
  });
  _0x25dc72["register"]({
    'id': "graph.disconnect",
    'description': "Disconnect canvas nodes.",
    'riskLevel': "safe",
    'argsSchema': {
      'properties': {
        'edgeId': {
          'type': "string"
        },
        'sourceId': {
          'type': "string"
        },
        'targetId': {
          'type': "string"
        },
        'refSlot': {
          'type': 'string'
        }
      }
    },
    'capabilitySchema': {
      'reads': ["edges"],
      'writes': ["edges"]
    },
    'returnSchema': {
      'aliasFields': ["edgeIds"]
    },
    'validate'(_0x4a1342 = {}, _0x4e245c = {}) {
      const _0x25a175 = normalizeEdgeArgs(_0x4a1342);
      if (_0x25a175["edgeId"]) {
        const _0x5ea399 = getEdges(_0x4e245c)[_0x25a175["edgeId"]];
        if (!_0x5ea399) {
          return {
            'ok': ![],
            'errorCode': "EDGE_NOT_FOUND",
            'message': "Canvas edge not found: " + _0x25a175["edgeId"]
          };
        }
        return {
          'args': {
            'edgeIds': [_0x25a175['edgeId']]
          }
        };
      }
      if (!_0x25a175["sourceId"] && !_0x25a175["targetId"]) {
        return {
          'ok': ![],
          'errorCode': "MISSING_EDGE_SELECTOR",
          'message': "graph.disconnect requires edgeId or endpoint selectors."
        };
      }
      const _0x39877b = findEdgesByEndpoints(_0x4e245c, _0x25a175);
      if (_0x39877b["length"] === 0x0) {
        return {
          'ok': ![],
          'errorCode': "EDGE_NOT_FOUND",
          'message': "No canvas edge matched graph.disconnect."
        };
      }
      return {
        'args': {
          'edgeIds': _0x39877b["map"](_0x3442f2 => _0x3442f2['id'])
        }
      };
    },
    'execute'(_0x246441, _0x178b51) {
      const _0x135df8 = getStore(_0x178b51);
      for (const _0x59163b of _0x246441['edgeIds']) {
        _0x135df8?.["removeEdge"]?.(_0x59163b);
      }
      _0x178b51["commit"]?.();
      return {
        'edgeIds': _0x246441["edgeIds"]
      };
    }
  });
  _0x25dc72["register"]({
    'id': "graph.getCanvasSummary",
    'description': "Get a safe canvas summary.",
    'riskLevel': "safe",
    'argsSchema': {},
    'capabilitySchema': {
      'reads': ["nodes", "edges", "selection", "viewport"],
      'writes': []
    },
    'returnSchema': {
      'aliasFields': ["selectedNodeIds", "nodes", "edges", "nodeCount", "edgeCount"]
    },
    'execute'(_0x48497c, _0x5b5cd8) {
      return buildCanvasSummary(_0x5b5cd8);
    }
  });
}
export { buildCanvasSummary, buildNodeSummary, normalizeNodeIds };