import { buildManifestDraftBundle } from '../../manifests/index.js';
import { inferRunningHubFieldMetadata, getRunningHubFieldOptions } from './rhAiAppFieldMetadata.js';
import { resolveRunningHubSiteProfileIdFromUrl } from '../runningHubProviderProfiles.js';
import { RUNNINGHUB_INSTANCE_OPTIONS, normalizeRunningHubInstanceType } from '../runningHubInstanceTypes.js';
export const RH_AI_APP_DISPLAY_NAME = "RH AI应用";
export const RH_AI_APP_FOOTER_PARAM_LIMIT = 0x3;
const RUNNINGHUB_AI_APP_URL_RE = /https?:\/\/(?:www\.)?runninghub\.(?:cn|ai)\/openapi\/v2\/run\/ai-app\/([^'"`\s\\]+)/i;
const DATA_FLAG_RE = /--data(?:-raw|-binary)?\s+/i;
const MEDIA_FIELD_KINDS = new Set(["image", 'video', "audio"]);
const OUTPUT_KINDS = new Set(["image", "video", 'audio']);
const COMPONENT_KINDS = new Set(["image", "video", 'audio', 'prompt', "param"]);
const CONTROL_TYPES = new Set(['text', "textarea", "stepper", 'float', "toggle", "prompt", "select"]);
const TEXT_CONTROL_OPTIONS = Object["freeze"](["text", "textarea", "prompt"]);
const AMBIGUOUS_ZERO_CONTROL_OPTIONS = Object["freeze"](["text", 'stepper', "float"]);
const TEXT_COMPONENT_KIND_OPTIONS = Object["freeze"](["param", "prompt"]);
const INSTANCE_FIELD = Object["freeze"]({
  'id': 'rhInstanceType',
  'type': 'segmented',
  'placement': 'instance',
  'label': '显存',
  'defaultValue': "default",
  'options': RUNNINGHUB_INSTANCE_OPTIONS
});
function normalizeText(_0x42061a, _0x57103d = '') {
  const _0xc59847 = String(_0x42061a ?? '')["trim"]();
  return _0xc59847 || _0x57103d;
}
function normalizeOutputKind(_0x3ff3f6) {
  const _0x5f1021 = String(_0x3ff3f6 || '')["trim"]()["toLowerCase"]();
  return OUTPUT_KINDS["has"](_0x5f1021) ? _0x5f1021 : 'image';
}
function normalizeInstanceType(_0x1fec87) {
  return normalizeRunningHubInstanceType(_0x1fec87);
}
function sanitizeIdentifierPart(_0x14b110, _0x56ea76 = "field") {
  const _0x4a00cf = String(_0x14b110 || '')["trim"]()["toLowerCase"]()["replace"](/[^a-z0-9_-]+/g, '_')['replace'](/^_+|_+$/g, '');
  return _0x4a00cf || _0x56ea76;
}
function createStableHash(_0x3d3f2d) {
  const _0x4470a7 = String(_0x3d3f2d || '');
  let _0x31ab5c = 0x811c9dc5;
  for (let _0x5d30f5 = 0x0; _0x5d30f5 < _0x4470a7["length"]; _0x5d30f5 += 0x1) {
    _0x31ab5c ^= _0x4470a7["charCodeAt"](_0x5d30f5);
    _0x31ab5c = Math['imul'](_0x31ab5c, 0x1000193);
  }
  return (_0x31ab5c >>> 0x0)["toString"](0x24)['padStart'](0x7, '0')["slice"](0x0, 0x8);
}
function stripCurlLineContinuations(_0x469cf1) {
  return String(_0x469cf1 || '')["replace"](/\\\r?\n/g, '\x0a');
}
function readQuotedCurlValue(_0x1bd7dd, _0x2b11b6) {
  let _0x19a3c7 = _0x2b11b6;
  while (_0x19a3c7 < _0x1bd7dd["length"] && /\s/["test"](_0x1bd7dd[_0x19a3c7])) {
    _0x19a3c7 += 0x1;
  }
  const _0x21a0e3 = _0x1bd7dd[_0x19a3c7];
  if (_0x21a0e3 !== '\x27' && _0x21a0e3 !== '\x22') {
    const _0x404bf1 = _0x1bd7dd["slice"](_0x19a3c7);
    const _0x1e615f = _0x404bf1["split"](/\r?\n/)[0x0] || _0x404bf1;
    return _0x1e615f['trim']();
  }
  _0x19a3c7 += 0x1;
  let _0x23e3b4 = '';
  for (; _0x19a3c7 < _0x1bd7dd["length"]; _0x19a3c7 += 0x1) {
    const _0x24381c = _0x1bd7dd[_0x19a3c7];
    if (_0x24381c === _0x21a0e3) {
      const _0x5f593e = _0x1bd7dd[_0x19a3c7 - 0x1] === '\x5c';
      if (!_0x5f593e || _0x21a0e3 === '\x27') {
        return _0x23e3b4;
      }
    }
    _0x23e3b4 += _0x24381c;
  }
  return _0x23e3b4["trim"]();
}
function extractCurlDataPayload(_0x387e2f) {
  const _0x12d41d = stripCurlLineContinuations(_0x387e2f);
  const _0x367454 = DATA_FLAG_RE["exec"](_0x12d41d);
  if (!_0x367454) {
    return '';
  }
  return readQuotedCurlValue(_0x12d41d, _0x367454['index'] + _0x367454[0x0]["length"]);
}
function extractFirstJsonObject(_0x5aa358) {
  const _0x1c494a = String(_0x5aa358 || '');
  const _0x93c9f6 = _0x1c494a["indexOf"]('{');
  if (_0x93c9f6 < 0x0) {
    return '';
  }
  let _0x3ab9dd = 0x0;
  let _0x4daa6c = ![];
  let _0x37a0f0 = '';
  let _0x11a596 = ![];
  for (let _0x2ebd1a = _0x93c9f6; _0x2ebd1a < _0x1c494a["length"]; _0x2ebd1a += 0x1) {
    const _0x4f1e2c = _0x1c494a[_0x2ebd1a];
    if (_0x4daa6c) {
      if (_0x11a596) {
        _0x11a596 = ![];
        continue;
      }
      if (_0x4f1e2c === '\x5c') {
        _0x11a596 = !![];
        continue;
      }
      _0x4f1e2c === _0x37a0f0 && (_0x4daa6c = ![], _0x37a0f0 = '');
      continue;
    }
    if (_0x4f1e2c === '\x22' || _0x4f1e2c === '\x27') {
      _0x4daa6c = !![];
      _0x37a0f0 = _0x4f1e2c;
      continue;
    }
    if (_0x4f1e2c === '{') {
      _0x3ab9dd += 0x1;
    }
    if (_0x4f1e2c === '}') {
      _0x3ab9dd -= 0x1;
      if (_0x3ab9dd === 0x0) {
        return _0x1c494a["slice"](_0x93c9f6, _0x2ebd1a + 0x1);
      }
    }
  }
  return '';
}
function extractAiAppId(_0x7d8949, _0x2913c3 = {}, _0x4654a1 = '') {
  const _0x58c5fb = normalizeText(_0x4654a1);
  if (_0x58c5fb) {
    return _0x58c5fb;
  }
  const _0x5f5d3c = String(_0x7d8949 || '');
  const _0x5491cc = _0x5f5d3c['match'](RUNNINGHUB_AI_APP_URL_RE);
  const _0x31e398 = normalizeText(_0x5491cc?.[0x1]);
  if (_0x31e398) {
    return _0x31e398;
  }
  return normalizeText(_0x2913c3["appId"] || _0x2913c3["workflowId"] || _0x2913c3["aiAppId"]);
}
function parseJsonPayload(_0x5e64ed) {
  try {
    return JSON["parse"](_0x5e64ed);
  } catch (_0x533979) {
    throw new Error("RH AI应用 JSON 解析失败：" + (_0x533979?.['message'] || "格式错误"));
  }
}
export function parseRunningHubAiAppInput(_0x5d7220, {
  appId: _0x2b5399 = ''
} = {}) {
  const _0x3a574e = String(_0x5d7220 || '')["trim"]();
  if (!_0x3a574e) {
    throw new Error('请粘贴\x20RunningHub\x20AI\x20App\x20的\x20curl\x20或\x20JSON');
  }
  const _0x5905af = (_0x3a574e['startsWith']('{') ? _0x3a574e : '') || extractCurlDataPayload(_0x3a574e) || extractFirstJsonObject(_0x3a574e);
  if (!_0x5905af) {
    throw new Error('未找到\x20--data-raw\x20JSON\x20请求体');
  }
  const _0xca5f63 = parseJsonPayload(_0x5905af);
  const _0x23dc98 = extractAiAppId(_0x3a574e, _0xca5f63, _0x2b5399);
  if (!_0x23dc98) {
    throw new Error('未找到\x20RunningHub\x20AI\x20App\x20的\x20appId');
  }
  if (!Array["isArray"](_0xca5f63["nodeInfoList"]) || _0xca5f63["nodeInfoList"]['length'] === 0x0) {
    throw new Error("JSON 中缺少 nodeInfoList");
  }
  return {
    'appId': _0x23dc98,
    'body': _0xca5f63,
    'nodeInfoList': _0xca5f63["nodeInfoList"],
    'providerProfileId': _0xca5f63["providerProfileId"] || resolveRunningHubSiteProfileIdFromUrl(_0x3a574e),
    'sourceText': _0x3a574e
  };
}
function normalizeFieldName(_0x3dcac2) {
  return String(_0x3dcac2 || '')["trim"]();
}
function getFieldKind(_0x9c6896) {
  const _0x5a1a24 = normalizeFieldName(_0x9c6896)["toLowerCase"]();
  return MEDIA_FIELD_KINDS["has"](_0x5a1a24) ? _0x5a1a24 : '';
}
function getDefaultComponentKind(_0x277929) {
  const _0x25dbd8 = getFieldKind(_0x277929);
  if (_0x25dbd8) {
    return _0x25dbd8;
  }
  return String(_0x277929 || '')["trim"]()["toLowerCase"]() === 'prompt' ? "prompt" : 'param';
}
function createLabelFromDescription(_0x37e321, _0x465ae0, _0x879740) {
  const _0x249075 = normalizeText(_0x37e321);
  const _0x33fad5 = normalizeFieldName(_0x465ae0);
  if (!_0x249075) {
    return _0x879740;
  }
  if (_0x33fad5 && _0x249075['toLowerCase']()["startsWith"](_0x33fad5["toLowerCase"]())) {
    return normalizeText(_0x249075['slice'](_0x33fad5['length']), _0x249075);
  }
  return _0x249075;
}
function isBooleanLiteral(_0x4018bd) {
  const _0x79aba1 = String(_0x4018bd ?? '')['trim']()["toLowerCase"]();
  return _0x79aba1 === "true" || _0x79aba1 === "false";
}
function isIntegerLiteral(_0x56e55e) {
  return /^[+-]?\d+$/["test"](String(_0x56e55e ?? '')['trim']());
}
function isDecimalLiteral(_0x38f15e) {
  return /^[+-]?(?:\d+\.\d+|\.\d+)$/["test"](String(_0x38f15e ?? '')["trim"]());
}
function isAmbiguousZeroLiteral(_0x144fa9) {
  return /^[+-]?0+$/["test"](String(_0x144fa9 ?? '')["trim"]());
}
function containsCjkText(_0x3792ca) {
  return /[\u3400-\u9fff]/u['test'](String(_0x3792ca ?? ''));
}
function looksLikeLongEnglishText(_0x1b9df7) {
  const _0x3de178 = String(_0x1b9df7 ?? '')["trim"]();
  const _0x58b63f = _0x3de178["match"](/[A-Za-z][A-Za-z'-]*/g) || [];
  const _0x26fdb9 = (_0x3de178['match'](/[A-Za-z]/g) || [])["length"];
  return _0x58b63f["length"] >= 0x4 || _0x26fdb9 >= 0x1c;
}
function looksLikeStructuredText(_0x52edb2) {
  const _0x207f95 = String(_0x52edb2 ?? '')['trim']();
  if (!_0x207f95) {
    return !![];
  }
  return containsCjkText(_0x207f95) || looksLikeLongEnglishText(_0x207f95) || _0x207f95["length"] > 0x2a || /[\s,.;:!?，。；：！？、]/["test"](_0x207f95) || /^[\[{]/["test"](_0x207f95);
}
function labelSuggestsPrompt(_0x453004, _0x5e287d) {
  const _0x45ee7c = String(_0x453004 || '');
  const _0x5b86cb = String(_0x5e287d || '')["toLowerCase"]();
  return _0x5b86cb === 'prompt' || /prompt|提示词|描述|文案|动作|内容|台词|歌词/i["test"](_0x45ee7c);
}
function inferTextControlType(_0x25e132, _0x376974, _0x119c6a) {
  if (labelSuggestsPrompt(_0x376974, _0x119c6a) || looksLikeStructuredText(_0x25e132)) {
    return "textarea";
  }
  return "text";
}
function inferComponentConfig(_0x3da996, _0x41276b, _0x334685, _0x56c5b8 = {}) {
  const _0x29cf76 = inferRunningHubFieldMetadata(_0x56c5b8);
  if (_0x29cf76) {
    return _0x29cf76;
  }
  const _0x957770 = String(_0x334685 || '')["trim"]()["toLowerCase"]();
  const _0x55ec81 = getFieldKind(_0x334685);
  if (_0x55ec81) {
    return {
      'componentKind': _0x55ec81,
      'componentKindLocked': !![],
      'componentKindOptions': [_0x55ec81],
      'controlType': "text",
      'controlTypeLocked': !![],
      'controlTypeOptions': []
    };
  }
  if (_0x957770 === "prompt") {
    return {
      'componentKind': "prompt",
      'componentKindLocked': !![],
      'componentKindOptions': ["prompt"],
      'controlType': 'prompt',
      'controlTypeLocked': !![],
      'controlTypeOptions': []
    };
  }
  if (_0x957770 === "index") {
    return {
      'componentKind': "param",
      'componentKindLocked': !![],
      'componentKindOptions': ["param"],
      'controlType': "stepper",
      'controlTypeLocked': !![],
      'controlTypeOptions': ['stepper']
    };
  }
  if (isBooleanLiteral(_0x3da996)) {
    return {
      'componentKind': "param",
      'componentKindLocked': !![],
      'componentKindOptions': ["param"],
      'controlType': 'toggle',
      'controlTypeLocked': !![],
      'controlTypeOptions': ['toggle']
    };
  }
  if (isDecimalLiteral(_0x3da996)) {
    return {
      'componentKind': "param",
      'componentKindLocked': !![],
      'componentKindOptions': ["param"],
      'controlType': "float",
      'controlTypeLocked': !![],
      'controlTypeOptions': ["float"]
    };
  }
  if (isIntegerLiteral(_0x3da996)) {
    return {
      'componentKind': "param",
      'componentKindLocked': !![],
      'componentKindOptions': ["param"],
      'controlType': "stepper",
      'controlTypeLocked': !isAmbiguousZeroLiteral(_0x3da996),
      'controlTypeOptions': isAmbiguousZeroLiteral(_0x3da996) ? AMBIGUOUS_ZERO_CONTROL_OPTIONS["slice"]() : ['stepper']
    };
  }
  return {
    'componentKind': "param",
    'componentKindLocked': ![],
    'componentKindOptions': TEXT_COMPONENT_KIND_OPTIONS["slice"](),
    'controlType': inferTextControlType(_0x3da996, _0x41276b, _0x334685),
    'controlTypeLocked': ![],
    'controlTypeOptions': TEXT_CONTROL_OPTIONS["slice"]()
  };
}
function normalizeComponentKind(_0xf93f5, _0x4ce71f = 'param') {
  const _0xde2e1b = String(_0xf93f5 || '')["trim"]()["toLowerCase"]();
  return COMPONENT_KINDS['has'](_0xde2e1b) ? _0xde2e1b : _0x4ce71f;
}
function normalizeControlType(_0x1ac6d5, _0x234251 = "text") {
  const _0x48c631 = String(_0x1ac6d5 || '')["trim"]()["toLowerCase"]();
  if (_0x48c631 === "integer" || _0x48c631 === "number") {
    return "stepper";
  }
  if (_0x48c631 === "decimal") {
    return "float";
  }
  if (_0x48c631 === "boolean" || _0x48c631 === 'bool') {
    return "toggle";
  }
  return CONTROL_TYPES["has"](_0x48c631) ? _0x48c631 : _0x234251;
}
function normalizeBooleanDefault(_0x4afa55) {
  const _0x46bb95 = String(_0x4afa55 ?? '')['trim']()["toLowerCase"]();
  return _0x4afa55 === !![] || _0x46bb95 === "true" || _0x46bb95 === '1' || _0x46bb95 === "yes" || _0x46bb95 === 'on';
}
function normalizeIntegerDefault(_0x464655) {
  const _0x286680 = Number(_0x464655);
  return Number["isFinite"](_0x286680) ? Math["trunc"](_0x286680) : 0x0;
}
function normalizeFloatDefault(_0x4dbc8e) {
  const _0x51523a = Number(_0x4dbc8e);
  return Number['isFinite'](_0x51523a) ? _0x51523a : 0x0;
}
function normalizeDefaultValueForControl(_0x51151f, _0x59c950) {
  const _0x28cdc0 = normalizeControlType(_0x51151f);
  if (_0x28cdc0 === "toggle") {
    return normalizeBooleanDefault(_0x59c950);
  }
  if (_0x28cdc0 === "stepper") {
    return normalizeIntegerDefault(_0x59c950);
  }
  if (_0x28cdc0 === "float") {
    return normalizeFloatDefault(_0x59c950);
  }
  return String(_0x59c950 ?? '');
}
function normalizeOrderValue(_0x447587, _0x53fafd) {
  const _0x161b57 = Number(_0x447587);
  return Number["isFinite"](_0x161b57) ? _0x161b57 : _0x53fafd;
}
function normalizePreviewPlacement(_0x46009c) {
  return String(_0x46009c || '')["trim"]() === "home" ? 'home' : "advanced";
}
function getNodeTransformForControl(_0x4bff3b) {
  const _0xc4ac3 = normalizeControlType(_0x4bff3b);
  if (_0xc4ac3 === 'toggle') {
    return "booleanString";
  }
  if (_0xc4ac3 === "stepper") {
    return "integer";
  }
  if (_0xc4ac3 === "float") {
    return "number";
  }
  return '';
}
function getUiSchemaTypeForControl(_0x285b2f) {
  const _0x52ead7 = normalizeControlType(_0x285b2f);
  return _0x52ead7 === 'float' ? "stepper" : _0x52ead7;
}
function getFloatStep(_0x1aa95d) {
  const _0x365bfb = String(_0x1aa95d ?? '')["trim"]();
  const _0x216f20 = _0x365bfb["match"](/\.(\d+)/);
  const _0xc996f9 = _0x216f20 ? Math['max'](0x1, _0x216f20[0x1]['length']) : 0x2;
  return Number('0.' + '0'["repeat"](Math['max'](0x0, _0xc996f9 - 0x1)) + '1');
}
function createParamFieldId(_0x9834e6, _0x478173) {
  const _0x47c358 = sanitizeIdentifierPart(_0x9834e6?.["nodeId"], "node_" + _0x478173);
  const _0x2a55d8 = sanitizeIdentifierPart(_0x9834e6?.['fieldName'], "value");
  return "rh_aiapp_" + _0x47c358 + '_' + _0x2a55d8 + '_' + _0x478173;
}
function createSlotId(_0xc00e41, _0x3f8155, _0x433d41) {
  const _0x1a654d = sanitizeIdentifierPart(_0x3f8155?.["nodeId"], "node_" + _0x433d41);
  return 'rh_aiapp_' + _0xc00e41 + '_' + _0x1a654d + '_' + _0x433d41;
}
function buildInputSlotCounts(_0x5f5bd3) {
  return _0x5f5bd3["reduce"]((_0x1b4348, _0x47d4e9) => {
    const _0x5c0e86 = String(_0x47d4e9?.["kind"] || '')['trim']();
    if (!_0x5c0e86) {
      return _0x1b4348;
    }
    _0x1b4348[_0x5c0e86] = (_0x1b4348[_0x5c0e86] || 0x0) + 0x1;
    return _0x1b4348;
  }, {});
}
function buildResultConfig(_0x4da05c) {
  if (_0x4da05c === "video") {
    return {
      'outputType': "video",
      'taskIdPath': 'taskId',
      'videoPaths': ['results[].videoUrl', "results[].url", 'videoUrl', "url"]
    };
  }
  if (_0x4da05c === "audio") {
    return {
      'outputType': "audio",
      'taskIdPath': "taskId",
      'audioPaths': ["results[].audioUrl", "results[].url", 'audioUrl', "url"]
    };
  }
  return {
    'outputType': 'image',
    'taskIdPath': "taskId",
    'imagePaths': ["results[].imageUrl", "results[].url", "imageUrl", 'url']
  };
}
export function buildRunningHubCustomAppExtensions(_0x8a618d, _0x28e105, _0x261dcd, _0x2419b1 = '', _0x2b3ec8 = '') {
  const _0x281ede = normalizeText(_0x2b3ec8) || "AI App " + _0x28e105;
  const _0x127aeb = normalizeText(_0x2419b1);
  const _0x56b491 = Boolean(_0x127aeb);
  const _0x3a954c = {
    'rhAiApp': {
      'appId': _0x28e105,
      'kind': _0x8a618d,
      'appKey': _0x127aeb,
      'name': _0x261dcd,
      'description': normalizeText(_0x2b3ec8),
      'isSavedApp': _0x56b491
    }
  };
  _0x56b491 && _0x8a618d === "image" && (_0x3a954c['imageMenu'] = {
    'group': "rhAiApp",
    'order': 0x3e7,
    'title': _0x261dcd,
    'subtitle': _0x281ede,
    'icon': "images/RH.png",
    'iconAlt': 'runninghub'
  });
  _0x56b491 && _0x8a618d === 'video' && (_0x3a954c["videoMenu"] = {
    'role': "rhAiApp",
    'group': "rhAiApp",
    'order': 0x3e7,
    'label': _0x261dcd,
    'subtitle': _0x281ede
  });
  _0x56b491 && _0x8a618d === "audio" && (_0x3a954c["audioMenu"] = {
    'group': "rhAiApp",
    'order': 0x3e7
  });
  return _0x3a954c;
}
function normalizeNodeInfoItem(_0x1a5ded, _0x50b5c0) {
  if (!_0x1a5ded || typeof _0x1a5ded !== "object" || Array["isArray"](_0x1a5ded)) {
    return null;
  }
  const _0x138ea5 = normalizeText(_0x1a5ded["nodeId"]);
  const _0x5405e9 = normalizeFieldName(_0x1a5ded["fieldName"]);
  if (!_0x138ea5 || !_0x5405e9) {
    return null;
  }
  return {
    'nodeId': _0x138ea5,
    'fieldName': _0x5405e9,
    'fieldValue': _0x1a5ded['fieldValue'] ?? '',
    'fieldType': _0x1a5ded['fieldType'],
    'fieldData': _0x1a5ded["fieldData"],
    'description': normalizeText(_0x1a5ded['description']),
    'index': _0x50b5c0
  };
}
export function createRunningHubAiAppComponentDrafts(_0x1b7058, {
  appId = ''
} = {}) {
  const _0x4067c0 = parseRunningHubAiAppInput(_0x1b7058, {
    'appId': appId
  });
  return {
    'parsed': _0x4067c0,
    'components': _0x4067c0['nodeInfoList']['map'](normalizeNodeInfoItem)["filter"](Boolean)["map"](_0x79c21e => {
      const _0x1aafd3 = getDefaultComponentKind(_0x79c21e["fieldName"]);
      const _0x491110 = createLabelFromDescription(_0x79c21e["description"], _0x79c21e["fieldName"], _0x79c21e['fieldName']);
      const _0x47702c = inferComponentConfig(_0x79c21e['fieldValue'], _0x491110, _0x79c21e["fieldName"], _0x79c21e);
      const _0x7367a4 = _0x47702c['componentKind'] || _0x1aafd3;
      const _0x58894c = {
        'index': _0x79c21e['index'],
        'nodeId': _0x79c21e["nodeId"],
        'fieldName': _0x79c21e["fieldName"],
        'description': _0x79c21e["description"],
        'label': _0x491110,
        'componentKind': _0x7367a4,
        'componentKindLocked': _0x47702c["componentKindLocked"] === !![],
        'componentKindOptions': _0x47702c['componentKindOptions'] || [_0x1aafd3],
        'controlType': _0x47702c["controlType"],
        'controlTypeLocked': _0x47702c["controlTypeLocked"] === !![],
        'controlTypeOptions': _0x47702c['controlTypeOptions'] || [],
        'defaultValue': String(_0x79c21e["fieldValue"] ?? ''),
        'options': getRunningHubFieldOptions(_0x79c21e)
      };
      _0x7367a4 === "param" && (_0x58894c["previewPlacement"] = 'advanced', _0x58894c['advancedParamOrder'] = _0x79c21e["index"]);
      return _0x58894c;
    })
  };
}
function normalizeOptionList(_0x3a0bce = [], _0x2bb64b = null) {
  if (!Array['isArray'](_0x3a0bce)) {
    return [];
  }
  return _0x3a0bce["map"](_0x450c1d => String(_0x450c1d || '')['trim']()['toLowerCase']())["filter"]((_0x4b7a2c, _0x32dd27, _0x33a007) => {
    if (!_0x4b7a2c || _0x33a007["indexOf"](_0x4b7a2c) !== _0x32dd27) {
      return ![];
    }
    return !_0x2bb64b || _0x2bb64b["has"](_0x4b7a2c);
  });
}
function pickAllowedValue(_0x49d6a2, _0x97ca08, _0x173389) {
  const _0x37a9d3 = String(_0x49d6a2 || '')["trim"]()["toLowerCase"]();
  return _0x97ca08['includes'](_0x37a9d3) ? _0x37a9d3 : _0x173389;
}
function normalizeComponentOverride(_0x21d157, _0x502a8b, _0xb35ebc) {
  const _0x31f2c6 = getDefaultComponentKind(_0x502a8b["fieldName"]);
  const _0x108510 = inferComponentConfig(_0x502a8b['fieldValue'], _0xb35ebc, _0x502a8b["fieldName"], _0x502a8b);
  const _0x36a988 = normalizeOptionList(_0x108510["componentKindOptions"], COMPONENT_KINDS);
  const _0x207c17 = normalizeOptionList(_0x108510['controlTypeOptions'], CONTROL_TYPES);
  const _0x4e69fd = normalizeControlType(_0x108510["controlType"]);
  const _0x1846c1 = normalizeComponentKind(_0x21d157?.["componentKind"], _0x108510["componentKind"] || _0x31f2c6);
  let _0x1c3241 = _0x108510["componentKindLocked"] === !![] ? _0x108510['componentKind'] : pickAllowedValue(_0x1846c1, _0x36a988["length"] ? _0x36a988 : [_0x1846c1], _0x108510["componentKind"] || _0x31f2c6);
  const _0x5920d1 = normalizeControlType(_0x21d157?.["controlType"], _0x4e69fd);
  let _0x287736 = _0x1c3241 === "prompt" ? "prompt" : _0x108510["controlTypeLocked"] === !![] ? _0x4e69fd : pickAllowedValue(_0x5920d1, _0x207c17["length"] ? _0x207c17 : [_0x4e69fd], _0x4e69fd);
  _0x287736 === 'prompt' && !_0x108510["componentKindLocked"] && _0x36a988["includes"]("prompt") && (_0x1c3241 = "prompt");
  return {
    'label': normalizeText(_0x21d157?.['label'], _0xb35ebc),
    'description': normalizeText(_0x21d157?.["description"], _0x502a8b["description"] || _0xb35ebc),
    'componentKind': _0x1c3241,
    'componentKindLocked': _0x108510["componentKindLocked"] === !![],
    'componentKindOptions': _0x36a988['length'] ? _0x36a988 : [_0x1c3241],
    'controlType': _0x287736,
    'controlTypeLocked': _0x108510["controlTypeLocked"] === !![],
    'controlTypeOptions': _0x207c17,
    'inputOrder': normalizeOrderValue(_0x21d157?.["inputOrder"], _0x502a8b["index"]),
    'homeParamOrder': normalizeOrderValue(_0x21d157?.["homeParamOrder"], _0x502a8b['index']),
    'advancedParamOrder': normalizeOrderValue(_0x21d157?.['advancedParamOrder'], _0x502a8b['index']),
    'previewPlacement': normalizePreviewPlacement(_0x21d157?.["previewPlacement"]),
    'defaultValue': normalizeDefaultValueForControl(_0x287736, _0x21d157?.["defaultValue"] === undefined ? _0x502a8b["fieldValue"] : _0x21d157["defaultValue"])
  };
}
function buildComponentOverrideMap(_0x276d7b = []) {
  const _0x120fd9 = new Map();
  if (!Array["isArray"](_0x276d7b)) {
    return _0x120fd9;
  }
  _0x276d7b['forEach'](_0x3cd6ad => {
    const _0x22c70e = Number(_0x3cd6ad?.["index"]);
    if (!Number["isInteger"](_0x22c70e) || _0x22c70e < 0x0) {
      return;
    }
    _0x120fd9['set'](_0x22c70e, _0x3cd6ad);
  });
  return _0x120fd9;
}
function buildManifestParts(_0x2662da, _0x43b9df, _0xe95861 = [], _0x119407 = {}) {
  const _0x55042e = [];
  const _0x44dda9 = [{
    ...INSTANCE_FIELD,
    'defaultValue': normalizeInstanceType(_0x2662da["body"]?.["instanceType"])
  }];
  const _0x4f4bc3 = [];
  let _0x281ab0 = ![];
  let _0x4ae3e6 = '';
  const _0x2d5dec = buildComponentOverrideMap(_0xe95861);
  const _0x5c53ce = _0x2662da["nodeInfoList"]["map"](normalizeNodeInfoItem)["filter"](Boolean)["map"]((_0x2af1d4, _0x49f744) => {
    const _0x9918a9 = createLabelFromDescription(_0x2af1d4["description"], _0x2af1d4['fieldName'], _0x2af1d4["fieldName"]);
    return {
      'item': _0x2af1d4,
      'index': _0x49f744,
      'component': normalizeComponentOverride(_0x2d5dec["get"](_0x2af1d4["index"]), _0x2af1d4, _0x9918a9)
    };
  });
  const _0x2f4c8f = new Set(_0x5c53ce['filter'](({
    component: _0x109aad
  }) => _0x109aad["componentKind"] === "param" && _0x109aad["previewPlacement"] === "home")["sort"]((_0x310f93, _0x55f09c) => {
    const _0x2a4382 = normalizeOrderValue(_0x310f93['component']['homeParamOrder'], _0x310f93["item"]["index"]) - normalizeOrderValue(_0x55f09c["component"]["homeParamOrder"], _0x55f09c["item"]['index']);
    if (_0x2a4382 !== 0x0) {
      return _0x2a4382;
    }
    return _0x310f93["index"] - _0x55f09c["index"];
  })["slice"](0x0, RH_AI_APP_FOOTER_PARAM_LIMIT)["map"](({
    item: _0x5ef85c
  }) => _0x5ef85c['index']));
  _0x5c53ce["forEach"](({
    item: _0x5904a8,
    index: _0x50b896,
    component: _0x5a4d7c
  }) => {
    const _0x1a3d3b = _0x5a4d7c["label"];
    const _0x404a92 = _0x5a4d7c["description"] || _0x5904a8["description"] || _0x1a3d3b;
    const _0x1614f9 = _0x5a4d7c['componentKind'];
    if (MEDIA_FIELD_KINDS["has"](_0x1614f9)) {
      const _0x3dcf15 = createSlotId(_0x1614f9, _0x5904a8, _0x50b896);
      _0x55042e["push"]({
        'id': _0x3dcf15,
        'kind': _0x1614f9,
        'label': _0x1a3d3b,
        'description': _0x404a92,
        'required': !![],
        'displayOrder': _0x5a4d7c['inputOrder'],
        'customAiAppComponentIndex': _0x5904a8["index"],
        'rhAiAppComponentIndex': _0x5904a8['index']
      });
      _0x4f4bc3['push']({
        'nodeId': _0x5904a8['nodeId'],
        'fieldName': _0x5904a8["fieldName"],
        'source': _0x1614f9 + 'Input',
        'field': _0x3dcf15,
        'slot': _0x3dcf15,
        'urlField': _0x3dcf15,
        'required': !![],
        'missingMessage': "请接入" + _0x1a3d3b,
        'description': _0x404a92
      });
      return;
    }
    if (_0x1614f9 === "prompt") {
      _0x281ab0 = !![];
      !_0x4ae3e6 && (_0x4ae3e6 = normalizeText(_0x2d5dec['get'](_0x5904a8["index"])?.["description"] || _0x5904a8['description']));
      _0x4f4bc3["push"]({
        'nodeId': _0x5904a8["nodeId"],
        'fieldName': _0x5904a8["fieldName"],
        'source': "prompt",
        'defaultValue': _0x5a4d7c["defaultValue"],
        'description': _0x404a92 || '提示词'
      });
      return;
    }
    const _0x1e5cfa = createParamFieldId(_0x5904a8, _0x50b896);
    const _0x3d82a4 = normalizeControlType(_0x5a4d7c["controlType"]);
    const _0x5d87f5 = getUiSchemaTypeForControl(_0x3d82a4);
    const _0x2fa8fe = normalizeDefaultValueForControl(_0x3d82a4, _0x5a4d7c["defaultValue"]);
    const _0x43d7da = getNodeTransformForControl(_0x3d82a4);
    const _0x223dca = _0x5a4d7c["previewPlacement"] === "home" && _0x2f4c8f["has"](_0x5904a8["index"]);
    _0x44dda9["push"]({
      'id': _0x1e5cfa,
      'type': _0x5d87f5,
      'placement': _0x223dca ? "mode" : "advanced",
      ...(_0x223dca ? {
        'variant': 'rhAiAppFooterParam',
        'displayOrder': _0x5a4d7c["homeParamOrder"]
      } : {
        'displayOrder': _0x5a4d7c["advancedParamOrder"]
      }),
      'label': _0x1a3d3b,
      'defaultValue': _0x2fa8fe,
      'description': _0x404a92,
      ...(_0x3d82a4 === "select" ? {
        'options': getRunningHubFieldOptions(_0x5904a8)
      } : {}),
      'customAiAppComponentIndex': _0x5904a8["index"],
      'rhAiAppComponentIndex': _0x5904a8["index"],
      ...(_0x5d87f5 === 'stepper' ? {
        'step': _0x3d82a4 === 'float' ? getFloatStep(_0x2fa8fe) : 0x1,
        ...(_0x3d82a4 === "float" ? {
          'valueType': "float"
        } : {})
      } : {})
    });
    _0x4f4bc3["push"]({
      'nodeId': _0x5904a8["nodeId"],
      'fieldName': _0x5904a8["fieldName"],
      'source': "param",
      'field': _0x1e5cfa,
      'defaultValue': _0x2fa8fe,
      ...(_0x43d7da ? {
        'transform': _0x43d7da
      } : {}),
      'description': _0x404a92
    });
  });
  const _0x1ffe7e = buildInputSlotCounts(_0x55042e);
  const _0x218e2f = Array["from"](new Set([...(_0x281ab0 ? ["text"] : []), ..._0x55042e["map"](_0x2cd150 => _0x2cd150['kind'])]));
  const _0x5ad441 = _0x55042e['map']((_0x4ed5d7, _0x45b331) => ({
    ..._0x4ed5d7,
    '_sourceOrder': _0x45b331
  }))["sort"]((_0xcf2c1c, _0x37a160) => {
    const _0xe71ae1 = normalizeOrderValue(_0xcf2c1c['displayOrder'], _0xcf2c1c['_sourceOrder']) - normalizeOrderValue(_0x37a160["displayOrder"], _0x37a160['_sourceOrder']);
    if (_0xe71ae1 !== 0x0) {
      return _0xe71ae1;
    }
    return _0xcf2c1c['_sourceOrder'] - _0x37a160['_sourceOrder'];
  })['map'](({
    _sourceOrder: _0x1c9dec,
    ..._0x109ffb
  }, _0x3f3cbd) => ({
    ..._0x109ffb,
    'displayOrder': _0x3f3cbd
  }));
  const _0x2da743 = [_0x44dda9[0x0], ..._0x44dda9["slice"](0x1)['sort']((_0x414810, _0x51473a) => {
    const _0x4cd73e = String(_0x414810?.['placement'] || '')["localeCompare"](String(_0x51473a?.['placement'] || ''));
    if (_0x4cd73e !== 0x0) {
      return _0x4cd73e;
    }
    return normalizeOrderValue(_0x414810?.['displayOrder'], Number["MAX_SAFE_INTEGER"]) - normalizeOrderValue(_0x51473a?.["displayOrder"], Number["MAX_SAFE_INTEGER"]);
  })];
  const _0x5abbab = normalizeText(_0x119407["promptHelpTooltip"]);
  return {
    'fixedSlots': _0x5ad441,
    'uiFields': _0x2da743,
    'nodeInfoList': _0x4f4bc3,
    'inputSlots': {
      'allowedKinds': _0x218e2f["slice"](),
      'minByKind': {
        ..._0x1ffe7e
      },
      'maxByKind': {
        ..._0x1ffe7e
      },
      'fixedSlots': _0x5ad441
    },
    'capabilities': {
      'inputKinds': _0x218e2f["slice"](),
      'outputType': _0x43b9df,
      'fixedAssetSlots': _0x5ad441["map"](_0x1cb2d0 => _0x1cb2d0['id'])
    },
    'help': _0x5abbab || _0x4ae3e6 ? {
      'tooltip': _0x5abbab || _0x4ae3e6
    } : null,
    'prompt': {
      'emptyPolicy': "allow",
      'visible': _0x281ab0
    }
  };
}
export function buildRunningHubAiAppManifestBundle({
  input: _0x4b9175,
  appId = '',
  kind = "image",
  components = [],
  displayName = RH_AI_APP_DISPLAY_NAME,
  description = '',
  promptHelpTooltip = '',
  appKey = ''
} = {}) {
  const _0xbabc41 = parseRunningHubAiAppInput(_0x4b9175, {
    'appId': appId
  });
  const _0x263abb = normalizeOutputKind(kind);
  const _0x10c1fc = normalizeText(displayName, RH_AI_APP_DISPLAY_NAME);
  const _0x1c4bf9 = normalizeText(description) || "RunningHub AI App " + _0xbabc41["appId"];
  const _0x1d815f = normalizeText(promptHelpTooltip);
  const _0x215368 = createStableHash(JSON['stringify']({
    'appId': _0xbabc41["appId"],
    'appKey': normalizeText(appKey),
    ...(_0xbabc41["body"]["providerProfileId"] ? {
      'providerProfileId': _0xbabc41["body"]["providerProfileId"]
    } : {}),
    'kind': _0x263abb,
    'description': _0x1c4bf9,
    'promptHelpTooltip': _0x1d815f,
    'nodeInfoList': _0xbabc41["nodeInfoList"],
    'components': components
  }));
  const _0x23b75d = "runninghub/ai-app-" + _0x263abb + '-' + _0xbabc41['appId'] + '-' + _0x215368;
  const _0x3d86ee = "runninghub.workflow." + _0x263abb + ".ai-app-" + _0xbabc41['appId'] + '-' + _0x215368 + '.v1';
  const _0x1ed4d2 = buildManifestParts(_0xbabc41, _0x263abb, components, {
    'promptHelpTooltip': _0x1d815f
  });
  return buildManifestDraftBundle({
    'sourceId': "runninghub-ai-app:" + _0x263abb + ':' + _0xbabc41["appId"] + ':' + _0x215368,
    'modelId': _0x23b75d,
    'executionId': _0x3d86ee,
    'provider': "runninghubwf",
    'adapterType': "workflow",
    'kind': _0x263abb,
    'outputType': _0x263abb,
    'displayName': _0x10c1fc,
    'description': _0x1c4bf9,
    'icon': "images/RH.png",
    'vip': !![],
    'appId': _0xbabc41["appId"],
    'submitMode': 'openapi-v2-ai-app',
    'queryMode': "openapi-v2-query",
    'mapping': {
      'nodeInfoList': _0x1ed4d2["nodeInfoList"]
    },
    'instanceType': {
      'field': "rhInstanceType",
      'defaultValue': normalizeInstanceType(_0xbabc41["body"]?.["instanceType"])
    },
    'uiFields': _0x1ed4d2['uiFields'],
    'inputSlots': _0x1ed4d2["inputSlots"],
    'help': _0x1ed4d2['help'],
    'prompt': _0x1ed4d2["prompt"],
    'modelExtensions': {
      ...buildRunningHubCustomAppExtensions(_0x263abb, _0xbabc41['appId'], _0x10c1fc, appKey, _0x1c4bf9),
      ...(_0xbabc41["body"]["providerProfileId"] ? {
        'providerProfiles': [_0xbabc41["body"]['providerProfileId']]
      } : {})
    },
    'result': buildResultConfig(_0x263abb)
  });
}
export function summarizeRunningHubAiAppBundle(_0xaaa76a) {
  const _0x1867c7 = _0xaaa76a?.["models"]?.[0x0] || {};
  const _0x5a6904 = _0xaaa76a?.['executions']?.[0x0] || {};
  const _0x3dedbb = Array["isArray"](_0x1867c7?.["inputSlots"]?.["fixedSlots"]) ? _0x1867c7["inputSlots"]['fixedSlots'] : [];
  const _0x3e24c7 = Array["isArray"](_0x1867c7?.["uiSchema"]?.["fields"]) ? _0x1867c7["uiSchema"]["fields"] : [];
  return {
    'appId': _0x5a6904['appId'] || _0x5a6904["workflowId"] || '',
    'kind': _0x1867c7["kind"] || _0x5a6904["kind"] || '',
    'modelId': _0x1867c7["modelId"] || '',
    'displayName': _0x1867c7["displayName"] || '',
    'slotCount': _0x3dedbb["length"],
    'paramCount': _0x3e24c7['filter'](_0x1347c9 => _0x1347c9?.['id'] !== "rhInstanceType")['length'],
    'slots': _0x3dedbb["map"](_0x29d572 => ({
      'id': _0x29d572['id'],
      'kind': _0x29d572["kind"],
      'label': _0x29d572["label"] || _0x29d572['id'],
      'required': _0x29d572["required"] === !![]
    })),
    'params': _0x3e24c7["filter"](_0x1b5a88 => _0x1b5a88?.['id'] !== "rhInstanceType")["map"](_0x4fa378 => ({
      'id': _0x4fa378['id'],
      'label': _0x4fa378["label"] || _0x4fa378['id'],
      'type': _0x4fa378["type"] || "text",
      'placement': _0x4fa378["placement"] || 'advanced',
      'variant': _0x4fa378['variant'] || ''
    }))
  };
}