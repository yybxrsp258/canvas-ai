import { buildManifestDraftBundle } from '../../manifests/index.js';
export const COMFYUI_WORKFLOW_DISPLAY_NAME = "ComfyUI 工作流";
const MEDIA_COMPONENT_KINDS = new Set(['image', "video", 'audio']);
const COMPONENT_KINDS = new Set(["image", "video", "audio", "prompt", "param"]);
const CONTROL_TYPES = new Set(['text', "textarea", 'stepper', "float", "toggle", 'prompt']);
const OUTPUT_KINDS = new Set(["image", "video", "audio"]);
const BASE_URL_MODES = new Set(["local", "cloud"]);
const COMPONENT_SELECTION_MODES = new Set(["auto", "manual"]);
const SCALAR_INPUT_TYPES = new Set(['string', 'number', "boolean"]);
const TEXT_CONTROL_OPTIONS = Object["freeze"](['text', "textarea", "prompt"]);
const AMBIGUOUS_ZERO_CONTROL_OPTIONS = Object['freeze'](['text', "stepper", "float"]);
const TEXT_COMPONENT_KIND_OPTIONS = Object["freeze"](["param", "prompt"]);
export const COMFYUI_GENERATION_COUNT_FIELD_ID = "batchSize";
export const COMFYUI_GENERATION_COUNT_OPTIONS = Object["freeze"]([0x1, 0x2, 0x4, 0x6, 0x8, 0xa, 0xc]);
const COMFYUI_GENERATION_COUNT_FIELD = Object['freeze']({
  'id': COMFYUI_GENERATION_COUNT_FIELD_ID,
  'type': "segmented",
  'placement': "batch",
  'label': "生成数量",
  'defaultValue': 0x1,
  'options': Object['freeze'](COMFYUI_GENERATION_COUNT_OPTIONS["map"](_0x329924 => Object['freeze']({
    'value': _0x329924,
    'label': _0x329924 + 'x',
    'selectedLabel': _0x329924 + 'x'
  }))),
  'comfyUiSystemField': !![]
});
function normalizeText(_0x3b7e50, _0x23c148 = '') {
  const _0x1aacdc = String(_0x3b7e50 ?? '')["trim"]();
  return _0x1aacdc || _0x23c148;
}
function normalizeOutputKind(_0x5e037d) {
  const _0x1f9ebe = String(_0x5e037d || '')["trim"]()["toLowerCase"]();
  return OUTPUT_KINDS["has"](_0x1f9ebe) ? _0x1f9ebe : "image";
}
function normalizeBaseUrlMode(_0x51bc52) {
  const _0x14c24a = String(_0x51bc52 || '')["trim"]()['toLowerCase']();
  return BASE_URL_MODES["has"](_0x14c24a) ? _0x14c24a : "local";
}
function normalizeComponentSelectionMode(_0x4d0300) {
  const _0x65d77e = String(_0x4d0300 || '')["trim"]()["toLowerCase"]();
  return COMPONENT_SELECTION_MODES['has'](_0x65d77e) ? _0x65d77e : "auto";
}
function sanitizeIdentifierPart(_0x51a7a5, _0x2cfaa4 = "field") {
  const _0x30da0c = String(_0x51a7a5 || '')["trim"]()["toLowerCase"]()["replace"](/[^a-z0-9_-]+/g, '_')['replace'](/^_+|_+$/g, '');
  return _0x30da0c || _0x2cfaa4;
}
function createStableHash(_0x1b33de) {
  const _0x1e7365 = String(_0x1b33de || '');
  let _0xb21894 = 0x811c9dc5;
  for (let _0x14b131 = 0x0; _0x14b131 < _0x1e7365["length"]; _0x14b131 += 0x1) {
    _0xb21894 ^= _0x1e7365["charCodeAt"](_0x14b131);
    _0xb21894 = Math["imul"](_0xb21894, 0x1000193);
  }
  return (_0xb21894 >>> 0x0)["toString"](0x24)["padStart"](0x7, '0')["slice"](0x0, 0x8);
}
function extractFirstJsonObject(_0x58c64b) {
  const _0x56c864 = String(_0x58c64b || '');
  const _0x69e890 = _0x56c864['indexOf']('{');
  if (_0x69e890 < 0x0) {
    return '';
  }
  let _0x5c59ac = 0x0;
  let _0x126090 = ![];
  let _0x305452 = '';
  let _0x2d7e96 = ![];
  for (let _0x16944c = _0x69e890; _0x16944c < _0x56c864["length"]; _0x16944c += 0x1) {
    const _0x4e8f67 = _0x56c864[_0x16944c];
    if (_0x126090) {
      if (_0x2d7e96) {
        _0x2d7e96 = ![];
        continue;
      }
      if (_0x4e8f67 === '\x5c') {
        _0x2d7e96 = !![];
        continue;
      }
      _0x4e8f67 === _0x305452 && (_0x126090 = ![], _0x305452 = '');
      continue;
    }
    if (_0x4e8f67 === '\x22' || _0x4e8f67 === '\x27') {
      _0x126090 = !![];
      _0x305452 = _0x4e8f67;
      continue;
    }
    if (_0x4e8f67 === '{') {
      _0x5c59ac += 0x1;
    }
    if (_0x4e8f67 === '}') {
      _0x5c59ac -= 0x1;
      if (_0x5c59ac === 0x0) {
        return _0x56c864["slice"](_0x69e890, _0x16944c + 0x1);
      }
    }
  }
  return '';
}
function parseJsonPayload(_0x187d7b) {
  try {
    return JSON['parse'](_0x187d7b);
  } catch (_0x9f715f) {
    throw new Error("ComfyUI 工作流 JSON 解析失败：" + (_0x9f715f?.["message"] || "格式错误"));
  }
}
function isComfyUiApiNode(_0x28622f) {
  return Boolean(_0x28622f && typeof _0x28622f === "object" && !Array["isArray"](_0x28622f) && _0x28622f["inputs"] && typeof _0x28622f['inputs'] === "object" && !Array["isArray"](_0x28622f["inputs"]));
}
function normalizeComfyUiWorkflowGraph(_0x40ca42) {
  const _0x29e05d = _0x40ca42?.["prompt"] && typeof _0x40ca42["prompt"] === "object" && !Array["isArray"](_0x40ca42["prompt"]) ? _0x40ca42['prompt'] : _0x40ca42?.["workflow"] && typeof _0x40ca42["workflow"] === 'object' && !Array["isArray"](_0x40ca42["workflow"]) ? _0x40ca42['workflow'] : _0x40ca42;
  if (!_0x29e05d || typeof _0x29e05d !== "object" || Array["isArray"](_0x29e05d)) {
    throw new Error("ComfyUI 工作流 API JSON 必须是节点对象");
  }
  const _0x58fc02 = Object["entries"](_0x29e05d)['filter'](([, _0x30db8b]) => isComfyUiApiNode(_0x30db8b));
  if (_0x58fc02['length'] === 0x0) {
    throw new Error('未找到\x20ComfyUI\x20API\x20格式节点，请导出\x20API\x20format\x20workflow\x20JSON');
  }
  return _0x58fc02["reduce"]((_0x4a477e, [_0x2dc39b, _0x3003f2]) => {
    _0x4a477e[String(_0x2dc39b)] = {
      ..._0x3003f2,
      'inputs': {
        ...(_0x3003f2["inputs"] || {})
      }
    };
    return _0x4a477e;
  }, {});
}
export function parseComfyUiWorkflowApiInput(_0x5d9370) {
  const _0x588c5f = String(_0x5d9370 || '')["trim"]();
  if (!_0x588c5f) {
    throw new Error("请粘贴 ComfyUI API workflow JSON");
  }
  const _0x50782e = _0x588c5f["startsWith"]('{') ? _0x588c5f : extractFirstJsonObject(_0x588c5f);
  if (!_0x50782e) {
    throw new Error("未找到 ComfyUI workflow JSON");
  }
  const _0x4f5864 = parseJsonPayload(_0x50782e);
  const _0x53ca44 = normalizeComfyUiWorkflowGraph(_0x4f5864);
  return {
    'body': _0x4f5864,
    'workflow': _0x53ca44,
    'sourceText': _0x588c5f
  };
}
function isConnectionValue(_0x37a783) {
  return Array["isArray"](_0x37a783) && _0x37a783["length"] >= 0x2 && (typeof _0x37a783[0x0] === "string" || typeof _0x37a783[0x0] === "number") && typeof _0x37a783[0x1] === "number";
}
function isScalarValue(_0x10f516) {
  return SCALAR_INPUT_TYPES["has"](typeof _0x10f516) || _0x10f516 === null;
}
function isComfyUiMediaUiInputName(_0x56fef5) {
  const _0x1b57d4 = String(_0x56fef5 || '')["trim"]()["toLowerCase"]();
  return _0x1b57d4 === 'imageui' || _0x1b57d4 === "videoui" || _0x1b57d4 === "audioui";
}
function sortNodeEntries(_0x184f21) {
  return Object["entries"](_0x184f21)["sort"](([_0x36ef3b], [_0x54c779]) => {
    const _0x4f2ceb = Number(_0x36ef3b);
    const _0x54f154 = Number(_0x54c779);
    if (Number["isFinite"](_0x4f2ceb) && Number["isFinite"](_0x54f154) && _0x4f2ceb !== _0x54f154) {
      return _0x4f2ceb - _0x54f154;
    }
    return String(_0x36ef3b)['localeCompare'](String(_0x54c779));
  });
}
function isMediaInput(_0x4201d5, _0x4c420f) {
  const _0x580bc8 = String(_0x4201d5 || '')['toLowerCase']();
  const _0x2654d8 = String(_0x4c420f || '')["toLowerCase"]();
  if (isComfyUiMediaUiInputName(_0x2654d8)) {
    return '';
  }
  if (_0x580bc8["includes"]("loadimage") && _0x2654d8 === "image") {
    return "image";
  }
  if ((_0x580bc8["includes"]("loadvideo") || _0x580bc8["includes"]("videoload")) && _0x2654d8["includes"]("video")) {
    return 'video';
  }
  if ((_0x580bc8["includes"]("loadaudio") || _0x580bc8["includes"]("audioload")) && _0x2654d8['includes']("audio")) {
    return "audio";
  }
  if (_0x2654d8 === "image" || _0x2654d8["endsWith"]("_image")) {
    return "image";
  }
  if (_0x2654d8 === "video" || _0x2654d8['endsWith']("_video")) {
    return "video";
  }
  if (_0x2654d8 === "audio" || _0x2654d8["endsWith"]('_audio')) {
    return "audio";
  }
  return '';
}
function isPromptInput(_0x49fe78, _0x5d07da, _0x2da273) {
  const _0x209792 = String(_0x49fe78 || '')['toLowerCase']();
  const _0xcc36ae = String(_0x5d07da || '')["toLowerCase"]();
  if (typeof _0x2da273 !== "string") {
    return ![];
  }
  if (_0x209792["includes"]("cliptextencode") && _0xcc36ae === 'text') {
    return !![];
  }
  return /prompt|positive|negative|text|caption|description/["test"](_0xcc36ae) && looksLikeStructuredText(_0x2da273);
}
function containsCjkText(_0x1c63e8) {
  return /[\u3400-\u9fff]/u["test"](String(_0x1c63e8 ?? ''));
}
function looksLikeLongEnglishText(_0x2a7766) {
  const _0x2b6dab = String(_0x2a7766 ?? '')["trim"]();
  const _0x205d48 = _0x2b6dab['match'](/[A-Za-z][A-Za-z'-]*/g) || [];
  const _0x379d17 = (_0x2b6dab["match"](/[A-Za-z]/g) || [])["length"];
  return _0x205d48["length"] >= 0x4 || _0x379d17 >= 0x1c;
}
function looksLikeStructuredText(_0x56af5a) {
  const _0x3cee8f = String(_0x56af5a ?? '')['trim']();
  if (!_0x3cee8f) {
    return !![];
  }
  return containsCjkText(_0x3cee8f) || looksLikeLongEnglishText(_0x3cee8f) || _0x3cee8f["length"] > 0x2a || /[\s,.;:!?，。；：！？、]/['test'](_0x3cee8f);
}
function isBooleanLiteral(_0x12bc93) {
  const _0x5c98a0 = String(_0x12bc93 ?? '')["trim"]()["toLowerCase"]();
  return _0x5c98a0 === 'true' || _0x5c98a0 === "false";
}
function isIntegerLiteral(_0x498244) {
  return /^[+-]?\d+$/["test"](String(_0x498244 ?? '')["trim"]());
}
function isDecimalLiteral(_0x2a9211) {
  return /^[+-]?(?:\d+\.\d+|\.\d+)$/['test'](String(_0x2a9211 ?? '')["trim"]());
}
function isAmbiguousZeroLiteral(_0x415dc2) {
  return /^[+-]?0+$/["test"](String(_0x415dc2 ?? '')['trim']());
}
function inferTextControlType(_0x1b199b, _0x4fd7c4) {
  const _0x5ae440 = String(_0x4fd7c4 || '')["toLowerCase"]();
  if (/prompt|positive|negative|text|caption|description/["test"](_0x5ae440)) {
    return "textarea";
  }
  return looksLikeStructuredText(_0x1b199b) ? "textarea" : "text";
}
function inferComponentConfig({
  classType: _0x1fd128,
  inputName: _0x295ce5,
  value: _0x433482
}) {
  const _0x64f0f = isMediaInput(_0x1fd128, _0x295ce5);
  if (_0x64f0f) {
    return {
      'componentKind': _0x64f0f,
      'componentKindLocked': !![],
      'componentKindOptions': [_0x64f0f],
      'controlType': "text",
      'controlTypeLocked': !![],
      'controlTypeOptions': []
    };
  }
  if (isPromptInput(_0x1fd128, _0x295ce5, _0x433482)) {
    return {
      'componentKind': "prompt",
      'componentKindLocked': ![],
      'componentKindOptions': TEXT_COMPONENT_KIND_OPTIONS['slice'](),
      'controlType': "prompt",
      'controlTypeLocked': ![],
      'controlTypeOptions': TEXT_CONTROL_OPTIONS["slice"]()
    };
  }
  if (typeof _0x433482 === "boolean" || isBooleanLiteral(_0x433482)) {
    return {
      'componentKind': 'param',
      'componentKindLocked': !![],
      'componentKindOptions': ["param"],
      'controlType': "toggle",
      'controlTypeLocked': !![],
      'controlTypeOptions': ["toggle"]
    };
  }
  if (typeof _0x433482 === "number" && Number['isInteger'](_0x433482)) {
    return {
      'componentKind': 'param',
      'componentKindLocked': !![],
      'componentKindOptions': ["param"],
      'controlType': 'stepper',
      'controlTypeLocked': _0x433482 !== 0x0,
      'controlTypeOptions': _0x433482 === 0x0 ? AMBIGUOUS_ZERO_CONTROL_OPTIONS['slice']() : ['stepper']
    };
  }
  if (typeof _0x433482 === "number" || isDecimalLiteral(_0x433482)) {
    return {
      'componentKind': "param",
      'componentKindLocked': !![],
      'componentKindOptions': ["param"],
      'controlType': "float",
      'controlTypeLocked': !![],
      'controlTypeOptions': ['float']
    };
  }
  if (isIntegerLiteral(_0x433482)) {
    return {
      'componentKind': "param",
      'componentKindLocked': !![],
      'componentKindOptions': ["param"],
      'controlType': "stepper",
      'controlTypeLocked': !isAmbiguousZeroLiteral(_0x433482),
      'controlTypeOptions': isAmbiguousZeroLiteral(_0x433482) ? AMBIGUOUS_ZERO_CONTROL_OPTIONS["slice"]() : ['stepper']
    };
  }
  return {
    'componentKind': "param",
    'componentKindLocked': ![],
    'componentKindOptions': TEXT_COMPONENT_KIND_OPTIONS["slice"](),
    'controlType': inferTextControlType(_0x433482, _0x295ce5),
    'controlTypeLocked': ![],
    'controlTypeOptions': TEXT_CONTROL_OPTIONS["slice"]()
  };
}
export function formatComfyUiComponentLabel(_0x551cd2 = {}) {
  const _0x5aaf60 = normalizeText(_0x551cd2?.["inputName"], "value");
  const _0x27b63a = normalizeText(_0x551cd2?.['nodeTitle']) || normalizeText(_0x551cd2?.["classType"]) || normalizeText(_0x551cd2?.['nodeId']);
  return _0x27b63a ? _0x27b63a + '.' + _0x5aaf60 : _0x5aaf60;
}
function createComponentLabel({
  nodeId: _0x25fbb7,
  nodeTitle: _0xbe4bf1,
  classType: _0x2a3747,
  inputName: _0x5559fd
} = {}) {
  return formatComfyUiComponentLabel({
    'nodeId': _0x25fbb7,
    'nodeTitle': _0xbe4bf1,
    'classType': _0x2a3747,
    'inputName': _0x5559fd
  });
}
function createComponentKey(_0x1b772f, _0x3ada83, _0x172f70) {
  return [_0x1b772f, _0x3ada83, _0x172f70]["map"](_0x5a8e6b => normalizeText(_0x5a8e6b)["toLowerCase"]())["join"]('::');
}
function getComfyUiNodeTitle(_0x34fbb1 = {}) {
  return normalizeText(_0x34fbb1?.["_meta"]?.['title'] || _0x34fbb1?.["_meta"]?.['name'] || _0x34fbb1?.["title"] || _0x34fbb1?.["name"] || _0x34fbb1?.["label"]);
}
function createComponentId(_0x292cdb, _0x2e774e) {
  const _0xf7a190 = sanitizeIdentifierPart(_0x292cdb?.["nodeId"], 'node_' + _0x2e774e);
  const _0x2dc739 = sanitizeIdentifierPart(_0x292cdb?.['inputName'], "value");
  return "comfyui_" + _0xf7a190 + '_' + _0x2dc739 + '_' + _0x2e774e;
}
function createSlotId(_0x10cc67, _0x2a71e3, _0x3a4a05) {
  const _0x1b9b13 = sanitizeIdentifierPart(_0x2a71e3?.["nodeId"], "node_" + _0x3a4a05);
  const _0x4f0be6 = sanitizeIdentifierPart(_0x2a71e3?.['inputName'], _0x10cc67);
  return "comfyui_" + _0x10cc67 + '_' + _0x1b9b13 + '_' + _0x4f0be6 + '_' + _0x3a4a05;
}
function normalizeComponentKind(_0x1becea, _0x50ea98 = "param") {
  const _0x95f0fd = String(_0x1becea || '')["trim"]()["toLowerCase"]();
  return COMPONENT_KINDS['has'](_0x95f0fd) ? _0x95f0fd : _0x50ea98;
}
function normalizeControlType(_0x2a14c7, _0xb4b12b = "text") {
  const _0x1d7262 = String(_0x2a14c7 || '')["trim"]()["toLowerCase"]();
  if (_0x1d7262 === "integer" || _0x1d7262 === "number") {
    return "stepper";
  }
  if (_0x1d7262 === 'decimal') {
    return "float";
  }
  if (_0x1d7262 === 'boolean' || _0x1d7262 === "bool") {
    return "toggle";
  }
  return CONTROL_TYPES['has'](_0x1d7262) ? _0x1d7262 : _0xb4b12b;
}
function normalizeBooleanDefault(_0x2cd796) {
  const _0x4f2761 = String(_0x2cd796 ?? '')["trim"]()["toLowerCase"]();
  return _0x2cd796 === !![] || _0x4f2761 === 'true' || _0x4f2761 === '1' || _0x4f2761 === "yes" || _0x4f2761 === 'on';
}
function normalizeIntegerDefault(_0x224652) {
  const _0x285d73 = Number(_0x224652);
  return Number["isFinite"](_0x285d73) ? Math["trunc"](_0x285d73) : 0x0;
}
function normalizeFloatDefault(_0x333f3e) {
  const _0x33f218 = Number(_0x333f3e);
  return Number['isFinite'](_0x33f218) ? _0x33f218 : 0x0;
}
function normalizeDefaultValueForControl(_0x1bf284, _0x4dbd8b) {
  const _0x261e6a = normalizeControlType(_0x1bf284);
  if (_0x261e6a === 'toggle') {
    return normalizeBooleanDefault(_0x4dbd8b);
  }
  if (_0x261e6a === 'stepper') {
    return normalizeIntegerDefault(_0x4dbd8b);
  }
  if (_0x261e6a === 'float') {
    return normalizeFloatDefault(_0x4dbd8b);
  }
  return String(_0x4dbd8b ?? '');
}
function normalizeOrderValue(_0x3b9c34, _0x465438) {
  const _0x21a453 = Number(_0x3b9c34);
  return Number["isFinite"](_0x21a453) ? _0x21a453 : _0x465438;
}
function normalizePreviewPlacement(_0xfa7b2a) {
  return String(_0xfa7b2a || '')["trim"]() === 'home' ? "home" : 'advanced';
}
function getNodeTransformForControl(_0x51434c) {
  const _0x3cc9c2 = normalizeControlType(_0x51434c);
  if (_0x3cc9c2 === 'toggle') {
    return "boolean";
  }
  if (_0x3cc9c2 === "stepper") {
    return 'integer';
  }
  if (_0x3cc9c2 === "float") {
    return "number";
  }
  return '';
}
function getUiSchemaTypeForControl(_0x254060) {
  const _0x4a8460 = normalizeControlType(_0x254060);
  return _0x4a8460 === "float" ? "stepper" : _0x4a8460;
}
function getFloatStep(_0x1ffa42) {
  const _0x4952b9 = String(_0x1ffa42 ?? '')["trim"]();
  const _0x3409b3 = _0x4952b9['match'](/\.(\d+)/);
  const _0x54fad8 = _0x3409b3 ? Math["max"](0x1, _0x3409b3[0x1]["length"]) : 0x2;
  return Number('0.' + '0'["repeat"](Math['max'](0x0, _0x54fad8 - 0x1)) + '1');
}
function normalizeOptionList(_0x278bd4 = [], _0x38b129 = null) {
  if (!Array["isArray"](_0x278bd4)) {
    return [];
  }
  return _0x278bd4["map"](_0x2ef056 => String(_0x2ef056 || '')['trim']()["toLowerCase"]())["filter"]((_0x117f49, _0x312f2b, _0x3bfea6) => {
    if (!_0x117f49 || _0x3bfea6['indexOf'](_0x117f49) !== _0x312f2b) {
      return ![];
    }
    return !_0x38b129 || _0x38b129['has'](_0x117f49);
  });
}
function pickAllowedValue(_0x4eda63, _0x27f080, _0x21ecf5) {
  const _0x5dba1c = String(_0x4eda63 || '')['trim']()["toLowerCase"]();
  return _0x27f080['includes'](_0x5dba1c) ? _0x5dba1c : _0x21ecf5;
}
function normalizeComponentOverride(_0x3196f6, _0xfdc533) {
  const _0x3c3495 = inferComponentConfig(_0xfdc533);
  const _0x23607e = normalizeOptionList(_0x3c3495["componentKindOptions"], COMPONENT_KINDS);
  const _0x1b43e4 = normalizeOptionList(_0x3c3495["controlTypeOptions"], CONTROL_TYPES);
  const _0x3596e8 = _0x3c3495["componentKind"] || 'param';
  const _0x183d03 = normalizeControlType(_0x3c3495["controlType"]);
  const _0x2856cd = normalizeComponentKind(_0x3196f6?.["componentKind"], _0x3596e8);
  let _0x273237 = _0x3c3495["componentKindLocked"] === !![] ? _0x3596e8 : pickAllowedValue(_0x2856cd, _0x23607e["length"] ? _0x23607e : [_0x2856cd], _0x3596e8);
  const _0x168d05 = normalizeControlType(_0x3196f6?.["controlType"], _0x183d03);
  let _0x7a8158 = _0x273237 === "prompt" ? "prompt" : _0x3c3495['controlTypeLocked'] === !![] ? _0x183d03 : pickAllowedValue(_0x168d05, _0x1b43e4["length"] ? _0x1b43e4 : [_0x183d03], _0x183d03);
  _0x7a8158 === "prompt" && !_0x3c3495["componentKindLocked"] && _0x23607e["includes"]("prompt") && (_0x273237 = 'prompt');
  return {
    'label': normalizeText(_0x3196f6?.["label"], _0xfdc533["label"]),
    'description': normalizeText(_0x3196f6?.["description"], _0xfdc533["label"]),
    'componentKind': _0x273237,
    'componentKindLocked': _0x3c3495["componentKindLocked"] === !![],
    'componentKindOptions': _0x23607e["length"] ? _0x23607e : [_0x273237],
    'controlType': _0x7a8158,
    'controlTypeLocked': _0x3c3495["controlTypeLocked"] === !![],
    'controlTypeOptions': _0x1b43e4,
    'inputOrder': normalizeOrderValue(_0x3196f6?.["inputOrder"], _0xfdc533["index"]),
    'homeParamOrder': normalizeOrderValue(_0x3196f6?.["homeParamOrder"], _0xfdc533['index']),
    'advancedParamOrder': normalizeOrderValue(_0x3196f6?.["advancedParamOrder"], _0xfdc533["index"]),
    'previewPlacement': normalizePreviewPlacement(_0x3196f6?.["previewPlacement"]),
    'required': _0x3196f6?.["required"] !== ![],
    'defaultValue': normalizeDefaultValueForControl(_0x7a8158, _0x3196f6?.["defaultValue"] === undefined ? _0xfdc533["value"] : _0x3196f6['defaultValue'])
  };
}
function buildComponentOverrideMap(_0x3833ae = []) {
  const _0x5080f9 = new Map();
  if (!Array["isArray"](_0x3833ae)) {
    return _0x5080f9;
  }
  _0x3833ae["forEach"](_0x310e13 => {
    const _0x2dc411 = Number(_0x310e13?.["index"]);
    if (!Number["isInteger"](_0x2dc411) || _0x2dc411 < 0x0) {
      return;
    }
    _0x5080f9["set"](_0x2dc411, _0x310e13);
  });
  return _0x5080f9;
}
function collectComponentDraftItems(_0x17939b) {
  const _0x24095a = [];
  sortNodeEntries(_0x17939b)["forEach"](([_0x1180ac, _0xa80514]) => {
    const _0x1eeeeb = normalizeText(_0xa80514?.["class_type"] || _0xa80514?.["classType"]);
    const _0x420de2 = getComfyUiNodeTitle(_0xa80514);
    Object["entries"](_0xa80514['inputs'] || {})["forEach"](([_0x25e744, _0x4ee66e]) => {
      if (isComfyUiMediaUiInputName(_0x25e744)) {
        return;
      }
      if (isConnectionValue(_0x4ee66e) || !isScalarValue(_0x4ee66e)) {
        return;
      }
      const _0x4ed315 = _0x24095a["length"];
      const _0x5d4dde = {
        'index': _0x4ed315,
        'nodeId': String(_0x1180ac),
        'nodeTitle': _0x420de2,
        'classType': _0x1eeeeb,
        'inputName': _0x25e744,
        'value': _0x4ee66e,
        'componentKey': createComponentKey(_0x1180ac, _0x1eeeeb, _0x25e744),
        'label': createComponentLabel({
          'nodeId': _0x1180ac,
          'nodeTitle': _0x420de2,
          'classType': _0x1eeeeb,
          'inputName': _0x25e744
        })
      };
      const _0x2147f8 = inferComponentConfig(_0x5d4dde);
      _0x24095a["push"]({
        ..._0x5d4dde,
        'componentKind': _0x2147f8["componentKind"],
        'componentKindLocked': _0x2147f8["componentKindLocked"] === !![],
        'componentKindOptions': _0x2147f8["componentKindOptions"] || ["param"],
        'controlType': _0x2147f8["controlType"],
        'controlTypeLocked': _0x2147f8["controlTypeLocked"] === !![],
        'controlTypeOptions': _0x2147f8["controlTypeOptions"] || [],
        'defaultValue': String(_0x4ee66e ?? '')
      });
    });
  });
  return _0x24095a;
}
export function createComfyUiWorkflowComponentDrafts(_0x32db3d) {
  const _0x48090c = parseComfyUiWorkflowApiInput(_0x32db3d);
  return {
    'parsed': _0x48090c,
    'components': collectComponentDraftItems(_0x48090c["workflow"])
  };
}
function buildInputSlotCounts(_0x11d5d3) {
  return _0x11d5d3["reduce"]((_0x5d8535, _0x4b1f1b) => {
    const _0x56e7f9 = String(_0x4b1f1b?.['kind'] || '')['trim']();
    if (!_0x56e7f9) {
      return _0x5d8535;
    }
    _0x5d8535[_0x56e7f9] = (_0x5d8535[_0x56e7f9] || 0x0) + 0x1;
    return _0x5d8535;
  }, {});
}
export function compileComfyUiWorkflowComponents(_0x200482, _0x1f664f, _0x1a4498 = [], _0x248ec7 = {}) {
  const _0x3dc346 = normalizeComponentSelectionMode(_0x248ec7['componentSelectionMode']);
  const _0x5c15f1 = _0x3dc346 === "manual" ? new Set((Array["isArray"](_0x1a4498) ? _0x1a4498 : [])['map'](_0x5c0997 => Number(_0x5c0997?.["index"]))["filter"](_0x295635 => Number["isInteger"](_0x295635) && _0x295635 >= 0x0)) : null;
  const _0x282b13 = buildComponentOverrideMap(_0x1a4498);
  const _0x58d668 = [];
  const _0x3db641 = [];
  const _0x1677f2 = [];
  let _0xe9375 = ![];
  let _0x20da6d = '';
  collectComponentDraftItems(_0x200482['workflow'])['forEach']((_0x4f22b4, _0x3f5ad9) => {
    if (_0x5c15f1 && !_0x5c15f1["has"](Number(_0x4f22b4["index"]))) {
      return;
    }
    const _0x183163 = normalizeComponentOverride(_0x282b13["get"](_0x4f22b4["index"]), _0x4f22b4);
    const _0x4338f8 = _0x183163['label'];
    const _0x3c1fb4 = _0x183163["description"] || _0x4338f8;
    const _0x63dff1 = _0x183163["componentKind"];
    if (MEDIA_COMPONENT_KINDS["has"](_0x63dff1)) {
      const _0x2d494e = createSlotId(_0x63dff1, _0x4f22b4, _0x3f5ad9);
      _0x58d668['push']({
        'id': _0x2d494e,
        'kind': _0x63dff1,
        'label': _0x4338f8,
        'description': _0x3c1fb4,
        'required': _0x183163['required'],
        'displayOrder': _0x183163['inputOrder'],
        'customAiAppComponentIndex': _0x4f22b4["index"],
        'comfyUiComponentIndex': _0x4f22b4['index']
      });
      _0x1677f2['push']({
        'nodeId': _0x4f22b4["nodeId"],
        'inputName': _0x4f22b4['inputName'],
        'source': _0x63dff1 + "Input",
        'field': _0x2d494e,
        'slot': _0x2d494e,
        'required': _0x183163["required"],
        'missingMessage': "请接入" + _0x4338f8,
        'description': _0x3c1fb4
      });
      return;
    }
    if (_0x63dff1 === "prompt") {
      _0xe9375 = !![];
      !_0x20da6d && (_0x20da6d = normalizeText(_0x282b13['get'](_0x4f22b4["index"])?.['description']));
      _0x1677f2["push"]({
        'nodeId': _0x4f22b4["nodeId"],
        'inputName': _0x4f22b4["inputName"],
        'source': "prompt",
        'defaultValue': _0x183163["defaultValue"],
        'includeEmpty': !![],
        'description': _0x3c1fb4
      });
      return;
    }
    const _0x185772 = createComponentId(_0x4f22b4, _0x3f5ad9);
    const _0x192acb = normalizeControlType(_0x183163["controlType"]);
    const _0x67c7b = getUiSchemaTypeForControl(_0x192acb);
    const _0xb7cca3 = normalizeDefaultValueForControl(_0x192acb, _0x183163["defaultValue"]);
    const _0x4ad688 = getNodeTransformForControl(_0x192acb);
    _0x3db641["push"]({
      'id': _0x185772,
      'type': _0x67c7b,
      'placement': _0x183163["previewPlacement"] === "home" ? "mode" : 'advanced',
      ...(_0x183163['previewPlacement'] === 'home' ? {
        'variant': 'rhAiAppFooterParam',
        'displayOrder': _0x183163["homeParamOrder"]
      } : {
        'displayOrder': _0x183163["advancedParamOrder"]
      }),
      'label': _0x4338f8,
      'defaultValue': _0xb7cca3,
      'description': _0x3c1fb4,
      'customAiAppComponentIndex': _0x4f22b4["index"],
      'comfyUiComponentIndex': _0x4f22b4["index"],
      ...(_0x67c7b === "stepper" ? {
        'step': _0x192acb === "float" ? getFloatStep(_0xb7cca3) : 0x1,
        ...(_0x192acb === 'float' ? {
          'valueType': "float"
        } : {})
      } : {})
    });
    _0x1677f2["push"]({
      'nodeId': _0x4f22b4["nodeId"],
      'inputName': _0x4f22b4["inputName"],
      'source': 'param',
      'field': _0x185772,
      'defaultValue': _0xb7cca3,
      ...(_0x4ad688 ? {
        'transform': _0x4ad688
      } : {}),
      'description': _0x3c1fb4
    });
  });
  const _0x215299 = buildInputSlotCounts(_0x58d668);
  const _0x34e82f = Array['from'](new Set([...(_0xe9375 ? ["text"] : []), ..._0x58d668["map"](_0xd4a458 => _0xd4a458["kind"])]));
  const _0x3a725f = _0x58d668["map"]((_0x3373b9, _0x549401) => ({
    ..._0x3373b9,
    '_sourceOrder': _0x549401
  }))['sort']((_0x2508d2, _0x4a103d) => {
    const _0x502cba = normalizeOrderValue(_0x2508d2['displayOrder'], _0x2508d2['_sourceOrder']) - normalizeOrderValue(_0x4a103d["displayOrder"], _0x4a103d['_sourceOrder']);
    if (_0x502cba !== 0x0) {
      return _0x502cba;
    }
    return _0x2508d2['_sourceOrder'] - _0x4a103d["_sourceOrder"];
  })["map"](({
    _sourceOrder: _0x5005d0,
    ..._0x53c159
  }, _0x5e0714) => ({
    ..._0x53c159,
    'displayOrder': _0x5e0714
  }));
  const _0x1b2505 = _0x3db641["sort"]((_0x21f1ef, _0x48a602) => {
    const _0x536e76 = String(_0x21f1ef?.["placement"] || '')["localeCompare"](String(_0x48a602?.["placement"] || ''));
    if (_0x536e76 !== 0x0) {
      return _0x536e76;
    }
    return normalizeOrderValue(_0x21f1ef?.["displayOrder"], Number["MAX_SAFE_INTEGER"]) - normalizeOrderValue(_0x48a602?.["displayOrder"], Number["MAX_SAFE_INTEGER"]);
  });
  const _0x1792e6 = normalizeText(_0x248ec7["promptHelpTooltip"]);
  return {
    'fixedSlots': _0x3a725f,
    'uiFields': _0x1b2505,
    'inputSlots': {
      'allowedKinds': _0x34e82f["slice"](),
      'minByKind': {
        ..._0x215299
      },
      'maxByKind': {
        ..._0x215299
      },
      'fixedSlots': _0x3a725f
    },
    'capabilities': {
      'inputKinds': _0x34e82f["slice"](),
      'outputType': _0x1f664f,
      'fixedAssetSlots': _0x3a725f["map"](_0x2f07fc => _0x2f07fc['id'])
    },
    'mapping': {
      'workflow': _0x200482["workflow"],
      'inputs': _0x1677f2
    },
    'help': _0x1792e6 || _0x20da6d ? {
      'tooltip': _0x1792e6 || _0x20da6d
    } : null,
    'prompt': {
      'emptyPolicy': "allow"
    }
  };
}
function classTypeLooksLikeOutput(_0x4766bc, _0x3c9131) {
  const _0x221b1d = String(_0x3c9131 || '')["toLowerCase"]();
  if (_0x4766bc === "video") {
    return _0x221b1d["includes"]("video") || _0x221b1d["includes"]("vhs") || _0x221b1d["includes"]('webp') || _0x221b1d["includes"]("gif");
  }
  if (_0x4766bc === 'audio') {
    return _0x221b1d["includes"]('audio') || _0x221b1d['includes']("sound");
  }
  return _0x221b1d["includes"]("saveimage") || _0x221b1d['includes']("previewimage") || _0x221b1d["includes"]("image");
}
function inferOutputNodes(_0x51ec0b, _0x41816c) {
  return sortNodeEntries(_0x51ec0b)["filter"](([, _0x145089]) => classTypeLooksLikeOutput(_0x41816c, _0x145089?.['class_type'] || _0x145089?.['classType']))["map"](([_0x9256f1]) => String(_0x9256f1));
}
function buildResultConfig(_0x38a4a8, _0x4178da) {
  const _0x3270b7 = inferOutputNodes(_0x38a4a8, _0x4178da);
  if (_0x4178da === "video") {
    return {
      'outputType': "video",
      'taskIdPath': "prompt_id",
      'resultPaths': ["videos[].url", "video_urls[]", 'results[].videoUrl', 'results[].url'],
      ...(_0x3270b7['length'] ? {
        'outputNodes': _0x3270b7
      } : {})
    };
  }
  if (_0x4178da === "audio") {
    return {
      'outputType': "audio",
      'taskIdPath': 'prompt_id',
      'resultPaths': ['audios[].url', "audio_urls[]", "results[].audioUrl", "results[].url"],
      ...(_0x3270b7["length"] ? {
        'outputNodes': _0x3270b7
      } : {})
    };
  }
  return {
    'outputType': "image",
    'taskIdPath': "prompt_id",
    'resultPaths': ["images[].url", "image_urls[]", 'results[].imageUrl', "results[].url"],
    ...(_0x3270b7["length"] ? {
      'outputNodes': _0x3270b7
    } : {})
  };
}
function buildComfyUiSystemUiFields(_0x139c14) {
  if (_0x139c14 !== "image") {
    return [];
  }
  return [COMFYUI_GENERATION_COUNT_FIELD];
}
function isComfyUiSystemUiField(_0x22ef3c) {
  return _0x22ef3c?.['comfyUiSystemField'] === !![];
}
function getComfyUiWorkflowImageMenuGroup(_0x3c77cf) {
  return _0x3c77cf === "cloud" ? 'comfyUiCloudWorkflow' : 'comfyUiLocalWorkflow';
}
function getComfyUiWorkflowImageMenuIconKind(_0x30056b) {
  return _0x30056b === "cloud" ? 'comfyUiCloudWorkflowBadge' : "comfyUiLocalWorkflowBadge";
}
function getComfyUiWorkflowImageMenuSubtitle(_0x3985f1, _0x3f70e4 = '') {
  const _0xf5ced5 = normalizeText(_0x3f70e4);
  if (_0xf5ced5 && _0xf5ced5 !== 'ComfyUI\x20cloud\x20workflow' && _0xf5ced5 !== "ComfyUI local workflow") {
    return _0xf5ced5;
  }
  return _0x3985f1 === "cloud" ? 'ComfyUI\x20云端工作流' : 'ComfyUI\x20本地工作流';
}
function buildModelExtensions(_0x3ba78f, _0x2127b8, _0x58c48c, _0x3621fb = '', _0x55f95c = '', _0x43392d = {}) {
  const _0x4bf1c7 = normalizeText(_0x3621fb);
  const _0x8a8d = Boolean(_0x4bf1c7);
  const _0x1a126f = normalizeBaseUrlMode(_0x43392d["baseUrlMode"]);
  const _0x26511d = normalizeComponentSelectionMode(_0x43392d["componentSelectionMode"]);
  const _0x3dc6d6 = {
    'comfyUiWorkflow': {
      'workflowId': _0x2127b8,
      'kind': _0x3ba78f,
      'appKey': _0x4bf1c7,
      'name': _0x58c48c,
      'description': normalizeText(_0x55f95c),
      'baseUrlMode': _0x1a126f,
      'componentSelectionMode': _0x26511d,
      'isSavedApp': _0x8a8d
    }
  };
  _0x8a8d && _0x3ba78f === "image" && (_0x3dc6d6["imageMenu"] = {
    'group': getComfyUiWorkflowImageMenuGroup(_0x1a126f),
    'order': 0x3e7,
    'title': _0x58c48c,
    'subtitle': getComfyUiWorkflowImageMenuSubtitle(_0x1a126f, _0x55f95c),
    'iconKind': getComfyUiWorkflowImageMenuIconKind(_0x1a126f)
  });
  _0x8a8d && _0x3ba78f === "video" && (_0x3dc6d6["videoMenu"] = {
    'role': "comfyUiWorkflow",
    'group': getComfyUiWorkflowImageMenuGroup(_0x1a126f),
    'order': 0x3e7,
    'label': _0x58c48c,
    'subtitle': getComfyUiWorkflowImageMenuSubtitle(_0x1a126f, _0x55f95c),
    'iconKind': getComfyUiWorkflowImageMenuIconKind(_0x1a126f)
  });
  _0x8a8d && _0x3ba78f === "audio" && (_0x3dc6d6["audioMenu"] = {
    'group': getComfyUiWorkflowImageMenuGroup(_0x1a126f),
    'order': 0x3e7,
    'label': _0x58c48c,
    'subtitle': getComfyUiWorkflowImageMenuSubtitle(_0x1a126f, _0x55f95c),
    'iconKind': getComfyUiWorkflowImageMenuIconKind(_0x1a126f)
  });
  return _0x3dc6d6;
}
export function buildComfyUiWorkflowManifestBundle({
  input: _0x1dcc10,
  kind = "image",
  components = [],
  displayName = COMFYUI_WORKFLOW_DISPLAY_NAME,
  description = '',
  appKey = '',
  baseUrlMode = "local",
  componentSelectionMode = "auto",
  promptHelpTooltip = ''
} = {}) {
  const _0x33fcb7 = parseComfyUiWorkflowApiInput(_0x1dcc10);
  const _0x1f826f = normalizeOutputKind(kind);
  const _0x56cc0c = normalizeBaseUrlMode(baseUrlMode);
  const _0x9d14fe = normalizeComponentSelectionMode(componentSelectionMode);
  const _0x1a393f = normalizeText(displayName, COMFYUI_WORKFLOW_DISPLAY_NAME);
  const _0x144072 = normalizeText(description) || (_0x56cc0c === "cloud" ? "ComfyUI cloud workflow" : 'ComfyUI\x20local\x20workflow');
  const _0x8480d8 = normalizeText(promptHelpTooltip);
  const _0x157c3f = createStableHash(JSON["stringify"]({
    'kind': _0x1f826f,
    'appKey': normalizeText(appKey),
    'description': _0x144072,
    'promptHelpTooltip': _0x8480d8,
    'baseUrlMode': _0x56cc0c,
    'componentSelectionMode': _0x9d14fe,
    'workflow': _0x33fcb7['workflow'],
    'components': components
  }));
  const _0x43da96 = "comfyui-" + _0x1f826f + '-' + _0x157c3f;
  const _0x25dd24 = 'comfyui/workflow-' + _0x1f826f + '-' + _0x157c3f;
  const _0x20faf1 = "comfyui.workflow." + _0x1f826f + '.' + _0x157c3f + '.v1';
  const _0x36d2f2 = compileComfyUiWorkflowComponents(_0x33fcb7, _0x1f826f, components, {
    'componentSelectionMode': _0x9d14fe,
    'promptHelpTooltip': _0x8480d8
  });
  const _0x3420f4 = [...buildComfyUiSystemUiFields(_0x1f826f), ..._0x36d2f2["uiFields"]];
  return buildManifestDraftBundle({
    'sourceId': "comfyui-workflow:" + _0x1f826f + ':' + _0x157c3f,
    'modelId': _0x25dd24,
    'executionId': _0x20faf1,
    'provider': "comfyui",
    'adapterType': 'workflow',
    'kind': _0x1f826f,
    'outputType': _0x1f826f,
    'displayName': _0x1a393f,
    'description': _0x144072,
    'workflowId': _0x43da96,
    'submitMode': "comfyui-prompt",
    'queryMode': "comfyui-history",
    'mapping': _0x36d2f2["mapping"],
    'uiFields': _0x3420f4,
    'inputSlots': _0x36d2f2["inputSlots"],
    'help': _0x36d2f2["help"],
    'prompt': _0x36d2f2['prompt'],
    'capabilities': _0x36d2f2["capabilities"],
    'modelExtensions': buildModelExtensions(_0x1f826f, _0x43da96, _0x1a393f, appKey, _0x144072, {
      'baseUrlMode': _0x56cc0c,
      'componentSelectionMode': _0x9d14fe
    }),
    'executionExtensions': {
      'comfyui': {
        'baseUrlMode': _0x56cc0c,
        'componentSelectionMode': _0x9d14fe
      }
    },
    'result': buildResultConfig(_0x33fcb7["workflow"], _0x1f826f)
  });
}
export function summarizeComfyUiWorkflowBundle(_0x59e326) {
  const _0x2296b1 = _0x59e326?.["models"]?.[0x0] || {};
  const _0x20a955 = _0x59e326?.["executions"]?.[0x0] || {};
  const _0x58c356 = Array["isArray"](_0x2296b1?.["inputSlots"]?.["fixedSlots"]) ? _0x2296b1["inputSlots"]["fixedSlots"] : [];
  const _0x438c38 = Array["isArray"](_0x2296b1?.["uiSchema"]?.["fields"]) ? _0x2296b1['uiSchema']["fields"] : [];
  const _0x2a96aa = _0x438c38["filter"](_0x573dc6 => !isComfyUiSystemUiField(_0x573dc6));
  const _0x47e0ff = Array["isArray"](_0x20a955?.['mapping']?.['inputs']) ? _0x20a955["mapping"]["inputs"] : [];
  return {
    'workflowId': _0x20a955['workflowId'] || '',
    'kind': _0x2296b1['kind'] || _0x20a955["kind"] || '',
    'modelId': _0x2296b1["modelId"] || '',
    'displayName': _0x2296b1['displayName'] || '',
    'baseUrlMode': _0x20a955["extensions"]?.["comfyui"]?.["baseUrlMode"] || _0x2296b1["extensions"]?.['comfyUiWorkflow']?.["baseUrlMode"] || "local",
    'componentSelectionMode': _0x20a955["extensions"]?.["comfyui"]?.['componentSelectionMode'] || _0x2296b1["extensions"]?.['comfyUiWorkflow']?.["componentSelectionMode"] || "auto",
    'slotCount': _0x58c356["length"],
    'paramCount': _0x2a96aa["length"],
    'mappingCount': _0x47e0ff['length'],
    'slots': _0x58c356['map'](_0x2df17d => ({
      'id': _0x2df17d['id'],
      'kind': _0x2df17d['kind'],
      'label': _0x2df17d["label"] || _0x2df17d['id'],
      'required': _0x2df17d["required"] === !![]
    })),
    'params': _0x2a96aa["map"](_0x8173a => ({
      'id': _0x8173a['id'],
      'label': _0x8173a["label"] || _0x8173a['id'],
      'type': _0x8173a['type'] || "text",
      'placement': _0x8173a["placement"] || 'advanced',
      'variant': _0x8173a["variant"] || ''
    }))
  };
}