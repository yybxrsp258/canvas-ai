import { getAssetInputRefsFromPromptAndNode } from './promptAssetInputRefs.js';
import { getModelManifest, resolveModelExecution } from '../manifests/index.js';
const FIXED_ASSET_INPUT_KINDS = new Set(['image', "video", "audio"]);
export const RH_V54_ASSET_SLOT_ORDER = Object['freeze']({
  'video': Object['freeze'](['sourceVideo', "videoMask"]),
  'image': Object["freeze"](["refImage", 'firstFrame'])
});
export const RH_BASIC_ASSET_SLOT_ORDER = Object['freeze']({
  'video': Object["freeze"](['sourceVideo']),
  'image': Object['freeze'](['refImage'])
});
export const RH_LTX_ASSET_SLOT_ORDER = Object['freeze']({
  'image': Object["freeze"](["refImage"]),
  'audio': Object["freeze"](["audio"])
});
export const RH_LIPSYNC_ASSET_SLOT_ORDER = Object['freeze']({
  'video': Object["freeze"](["sourceVideo"]),
  'image': Object['freeze'](["refImage"]),
  'audio': Object["freeze"](["audio"])
});
export const RH_LIPSYNC_VISUAL_EXCLUSIVE_GROUPS = Object["freeze"]([Object["freeze"]({
  'id': "lipsyncVisualInput",
  'slots': Object["freeze"](["sourceVideo", 'refImage']),
  'min': 0x1,
  'max': 0x1
})]);
export function getRhV54VisibleSlots({
  hideExtraSlots = ![]
} = {}) {
  return hideExtraSlots ? ["sourceVideo", "refImage"] : ["sourceVideo", 'refImage', "firstFrame", "videoMask"];
}
function normalizeFixedSlotId(_0x177dfb) {
  const _0x2a1770 = String(_0x177dfb || '')["trim"]();
  if (_0x2a1770 === "maskVideo") {
    return 'videoMask';
  }
  return _0x2a1770;
}
export function normalizeFixedInputExclusiveGroups(_0x5752a7 = [], _0x461217 = null) {
  const _0x202be7 = Array["isArray"](_0x461217) && _0x461217["length"] ? new Set(_0x461217["map"](_0x14ddd6 => normalizeFixedSlotId(_0x14ddd6))) : null;
  return (Array["isArray"](_0x5752a7) ? _0x5752a7 : [])["map"]((_0x1f9daa, _0x2ec049) => {
    const _0x5bd405 = Array["isArray"](_0x1f9daa?.["slots"]) ? _0x1f9daa['slots'] : Array["isArray"](_0x1f9daa) ? _0x1f9daa : [];
    const _0x190264 = Array["from"](new Set(_0x5bd405['map'](_0x286ead => normalizeFixedSlotId(_0x286ead))['filter'](_0x9ba51b => _0x9ba51b && (!_0x202be7 || _0x202be7['has'](_0x9ba51b)))));
    if (_0x190264["length"] < 0x2) {
      return null;
    }
    return {
      'id': String(_0x1f9daa?.['id'] || "exclusive:" + _0x2ec049)["trim"]() || "exclusive:" + _0x2ec049,
      'slots': _0x190264,
      'min': Number['isFinite'](Number(_0x1f9daa?.["min"])) ? Number(_0x1f9daa["min"]) : 0x0,
      'max': Number["isFinite"](Number(_0x1f9daa?.["max"])) ? Number(_0x1f9daa["max"]) : 0x1,
      'required': _0x1f9daa?.['required'] === !![]
    };
  })["filter"](Boolean);
}
export function getExclusiveSlotsForFixedSlot(_0x19ace8 = [], _0x16d65d = '') {
  const _0x396cbb = normalizeFixedSlotId(_0x16d65d);
  if (!_0x396cbb) {
    return [];
  }
  const _0x9adde3 = normalizeFixedInputExclusiveGroups(_0x19ace8);
  const _0xe110e6 = _0x9adde3["find"](_0x4f462e => _0x4f462e["slots"]["includes"](_0x396cbb));
  return _0xe110e6 ? _0xe110e6["slots"]["slice"]() : [_0x396cbb];
}
function resolveManifestForFixedInputNode(_0x1d795a = {}) {
  const _0x1ee9e1 = [_0x1d795a?.['audioWorkflowKey'], _0x1d795a?.["workflowKey"], _0x1d795a?.["model"]]["map"](_0x1e609f => String(_0x1e609f || '')['trim']())['filter'](Boolean);
  for (const _0x149889 of _0x1ee9e1) {
    const _0x16425f = getModelManifest(_0x149889) || resolveModelExecution(_0x149889, {
      'providerHint': _0x1d795a?.["provider"]
    })?.["modelManifest"] || resolveModelExecution(_0x149889)?.["modelManifest"];
    if (_0x16425f) {
      return _0x16425f;
    }
  }
  return null;
}
function getNodeFieldValue(_0x4569f9 = {}, _0x2a7fbf = '') {
  const _0x37ae66 = String(_0x2a7fbf || '')['trim']();
  if (!_0x37ae66) {
    return undefined;
  }
  const _0x5a66f1 = _0x4569f9?.["generationParams"] && typeof _0x4569f9["generationParams"] === "object" ? _0x4569f9['generationParams'] : {};
  if (Object['prototype']["hasOwnProperty"]["call"](_0x5a66f1, _0x37ae66)) {
    return _0x5a66f1[_0x37ae66];
  }
  if (Object["prototype"]["hasOwnProperty"]['call'](_0x4569f9 || {}, _0x37ae66)) {
    return _0x4569f9[_0x37ae66];
  }
  const _0x183d1b = _0x37ae66["split"]('.')["filter"](Boolean);
  if (_0x183d1b["length"] <= 0x1) {
    return undefined;
  }
  let _0x613060 = _0x4569f9;
  for (const _0x172fcf of _0x183d1b) {
    if (!_0x613060 || typeof _0x613060 !== "object") {
      return undefined;
    }
    _0x613060 = _0x613060[_0x172fcf];
  }
  return _0x613060;
}
function fixedSlotConditionMatches(_0x2a7945, _0xb6cbbb = {}) {
  if (Array['isArray'](_0x2a7945)) {
    return _0x2a7945['some'](_0x5aec92 => fixedSlotConditionMatches(_0x5aec92, _0xb6cbbb));
  }
  if (!_0x2a7945 || typeof _0x2a7945 !== "object") {
    return ![];
  }
  if (Array["isArray"](_0x2a7945['any'])) {
    return _0x2a7945['any']['some'](_0x21eacf => fixedSlotConditionMatches(_0x21eacf, _0xb6cbbb));
  }
  if (Array['isArray'](_0x2a7945["all"])) {
    return _0x2a7945["all"]["every"](_0x4a1f83 => fixedSlotConditionMatches(_0x4a1f83, _0xb6cbbb));
  }
  const _0x18f020 = String(_0x2a7945["field"] || '')['trim']();
  if (!_0x18f020) {
    return ![];
  }
  const _0xaf77b4 = getNodeFieldValue(_0xb6cbbb, _0x18f020);
  const _0x2b100d = Array['isArray'](_0x2a7945['values']) ? _0x2a7945["values"] : Object['prototype']['hasOwnProperty']["call"](_0x2a7945, "value") ? [_0x2a7945['value']] : [];
  if (_0x2b100d["length"] === 0x0) {
    return Boolean(_0xaf77b4);
  }
  return _0x2b100d["some"](_0x1f23f0 => _0xaf77b4 === _0x1f23f0 || String(_0xaf77b4 ?? '') === String(_0x1f23f0 ?? ''));
}
function getConditionFieldIds(_0xe3c7ac, _0x5a6415 = new Set()) {
  if (Array['isArray'](_0xe3c7ac)) {
    _0xe3c7ac["forEach"](_0x354e46 => getConditionFieldIds(_0x354e46, _0x5a6415));
    return _0x5a6415;
  }
  if (!_0xe3c7ac || typeof _0xe3c7ac !== "object") {
    return _0x5a6415;
  }
  Array["isArray"](_0xe3c7ac['any']) && _0xe3c7ac["any"]["forEach"](_0x5afc29 => getConditionFieldIds(_0x5afc29, _0x5a6415));
  Array["isArray"](_0xe3c7ac["all"]) && _0xe3c7ac["all"]['forEach'](_0x47ada0 => getConditionFieldIds(_0x47ada0, _0x5a6415));
  const _0x2551d3 = String(_0xe3c7ac['field'] || '')["trim"]();
  if (_0x2551d3) {
    _0x5a6415["add"](_0x2551d3);
  }
  return _0x5a6415;
}
function getHiddenFixedSlotReasonFields(_0x13c8e0, _0x419702 = {}, _0x83aa03 = null, {
  useRhVisibilityFlags = ![]
} = {}) {
  const _0x269630 = new Set();
  useRhVisibilityFlags && _0x419702?.['rhSpecialMode'] === "cameraMove" && (_0x13c8e0 === "firstFrame" || _0x13c8e0 === "videoMask") && _0x269630['add']("rhSpecialMode");
  useRhVisibilityFlags && _0x419702?.['rhSubtractSubject'] === !![] && (_0x13c8e0 === "firstFrame" || _0x13c8e0 === "videoMask") && _0x269630["add"]("rhSubtractSubject");
  _0x83aa03?.["showWhen"] && !fixedSlotConditionMatches(_0x83aa03['showWhen'], _0x419702) && getConditionFieldIds(_0x83aa03["showWhen"], _0x269630);
  _0x83aa03?.["hideWhen"] && fixedSlotConditionMatches(_0x83aa03["hideWhen"], _0x419702) && getConditionFieldIds(_0x83aa03["hideWhen"], _0x269630);
  return Array["from"](_0x269630);
}
export function getFixedInputSlotConfigFromManifest(_0x919029 = {}, {
  manifest = null,
  includeHiddenSlots = ![]
} = {}) {
  const _0x19c074 = manifest || resolveManifestForFixedInputNode(_0x919029);
  const _0x3a9fd7 = _0x19c074?.['inputSlots']?.["fixedSlots"];
  if (!Array['isArray'](_0x3a9fd7) || _0x3a9fd7["length"] === 0x0) {
    return null;
  }
  const _0x2ea586 = {};
  const _0x1029a0 = {};
  const _0x54a0c7 = {};
  const _0x20c0a8 = {};
  const _0x4383bb = [];
  let _0x20b033 = ![];
  const _0x4c8ded = new Set(_0x3a9fd7["map"](_0x290541 => normalizeFixedSlotId(_0x290541?.['id']))["filter"](Boolean));
  const _0x4ccb8f = _0x4c8ded["has"]('sourceVideo') && _0x4c8ded["has"]('refImage') && _0x4c8ded["has"]("videoMask");
  _0x3a9fd7['forEach']((_0x42aa3a, _0x298212) => {
    const _0x3b7c55 = normalizeFixedSlotId(_0x42aa3a?.['id']);
    const _0x15cffb = String(_0x42aa3a?.["kind"] || '')["trim"]();
    if (!_0x3b7c55 || !FIXED_ASSET_INPUT_KINDS["has"](_0x15cffb)) {
      return;
    }
    if (_0x42aa3a?.['showWhen'] || _0x42aa3a?.["hideWhen"]) {
      _0x20b033 = !![];
    }
    if (!Array['isArray'](_0x2ea586[_0x15cffb])) {
      _0x2ea586[_0x15cffb] = [];
    }
    _0x2ea586[_0x15cffb]['push'](_0x3b7c55);
    _0x1029a0[_0x3b7c55] = _0x15cffb;
    const _0x4c7fd8 = Number(_0x42aa3a?.["displayOrder"]);
    _0x54a0c7[_0x3b7c55] = {
      ..._0x42aa3a,
      'id': _0x3b7c55,
      'kind': _0x15cffb,
      'displayOrder': Number['isFinite'](_0x4c7fd8) ? _0x4c7fd8 : _0x298212
    };
    const _0x3a3a76 = getHiddenFixedSlotReasonFields(_0x3b7c55, _0x919029, _0x42aa3a, {
      'useRhVisibilityFlags': _0x4ccb8f
    });
    _0x3a3a76["length"] > 0x0 && (_0x20c0a8[_0x3b7c55] = _0x3a3a76);
    (includeHiddenSlots || _0x3a3a76['length'] === 0x0) && _0x4383bb["push"](_0x3b7c55);
  });
  if (_0x4383bb["length"] === 0x0) {
    return null;
  }
  const _0x1c2ea9 = (_0x4f6076, _0x29fcc0) => Number(_0x54a0c7[_0x4f6076]?.["displayOrder"] ?? 0x0) - Number(_0x54a0c7[_0x29fcc0]?.['displayOrder'] ?? 0x0);
  _0x4383bb["sort"](_0x1c2ea9);
  const _0x4a5ad7 = normalizeFixedInputExclusiveGroups(_0x19c074?.["inputSlots"]?.["exclusiveGroups"], _0x4383bb);
  return {
    'manifest': _0x19c074,
    'inputSurfaceHidden': shouldHideFixedInputSlots(_0x19c074, _0x919029),
    'fixedSlots': Object["values"](_0x54a0c7),
    'slotById': _0x54a0c7,
    'slotKindById': _0x1029a0,
    'hiddenReasonFieldsBySlot': _0x20c0a8,
    'slotOrderByType': _0x2ea586,
    'visibleSlots': _0x4383bb,
    'visibilityLayoutKey': _0x20b033 ? _0x4383bb["join"]('|') : '',
    'exclusiveGroups': _0x4a5ad7
  };
}
export function shouldHideFixedInputSlots(_0x25c29b = null, _0x57d5b3 = {}) {
  if (_0x25c29b?.["inputSurfaceHidden"] === !![]) {
    return !![];
  }
  const _0x478c84 = _0x25c29b?.["manifest"] || _0x25c29b;
  const _0x589b3a = _0x478c84?.["extensions"]?.['videoInputSurface'];
  if (_0x589b3a?.["hideFixedInputSlots"] === !![]) {
    return !![];
  }
  return fixedSlotConditionMatches(_0x589b3a?.["hideFixedInputSlotsWhen"], _0x57d5b3);
}
function getSlotsFromOrder(_0x2058f3 = {}) {
  return Array['from'](new Set(Object['values'](_0x2058f3)['flat']()["map"](_0x36ff78 => String(_0x36ff78 || ''))["filter"](Boolean)));
}
function normalizeOccupiedSlots(_0xb7536b = null) {
  const _0x1ef393 = (_0x1fd5c9 = []) => new Set(_0x1fd5c9["map"](_0x547618 => normalizeFixedSlotId(_0x547618))["filter"](Boolean));
  if (_0xb7536b instanceof Set) {
    return _0x1ef393(Array["from"](_0xb7536b));
  }
  if (Array["isArray"](_0xb7536b)) {
    return _0x1ef393(_0xb7536b);
  }
  if (_0xb7536b && typeof _0xb7536b === "object") {
    return _0x1ef393(Object["entries"](_0xb7536b)['filter'](([, _0x67e55]) => !!_0x67e55)["map"](([_0xae6dbb]) => _0xae6dbb));
  }
  return new Set();
}
export function createFixedSlotOccupancyTracker({
  exclusiveGroups = [],
  occupiedSlots = null
} = {}) {
  const _0x165be5 = new Set(normalizeOccupiedSlots(occupiedSlots));
  const _0x283cf3 = normalizeFixedInputExclusiveGroups(exclusiveGroups);
  const _0x398c1f = new Map();
  _0x283cf3['forEach'](_0x456f5a => {
    _0x456f5a["slots"]["forEach"](_0x2e1f8f => {
      _0x398c1f["set"](_0x2e1f8f, _0x456f5a);
    });
  });
  const _0x28189e = new Set();
  _0x165be5["forEach"](_0x339f58 => {
    const _0x2f0101 = _0x398c1f["get"](_0x339f58);
    if (_0x2f0101) {
      _0x28189e["add"](_0x2f0101['id']);
    }
  });
  return {
    'isSlotAvailable'(_0xbed35b) {
      const _0x267891 = normalizeFixedSlotId(_0xbed35b);
      if (!_0x267891 || _0x165be5["has"](_0x267891)) {
        return ![];
      }
      const _0xca129f = _0x398c1f["get"](_0x267891);
      return !_0xca129f || !_0x28189e["has"](_0xca129f['id']);
    },
    'occupySlot'(_0x23f943) {
      const _0x5a5294 = normalizeFixedSlotId(_0x23f943);
      if (!_0x5a5294) {
        return;
      }
      _0x165be5["add"](_0x5a5294);
      const _0x2c427b = _0x398c1f['get'](_0x5a5294);
      if (_0x2c427b) {
        _0x28189e["add"](_0x2c427b['id']);
      }
    },
    'getExclusiveSlots'(_0x575b97) {
      const _0x314418 = normalizeFixedSlotId(_0x575b97);
      const _0x5dc8e1 = _0x398c1f["get"](_0x314418);
      return _0x5dc8e1 ? _0x5dc8e1["slots"]['slice']() : _0x314418 ? [_0x314418] : [];
    }
  };
}
function getFixedInputSlotKind(_0x563ae4 = {}, _0x1dcd12 = '') {
  const _0xc90ac9 = normalizeFixedSlotId(_0x1dcd12);
  if (!_0xc90ac9) {
    return '';
  }
  const _0x5236aa = String(_0x563ae4?.["slotKindById"]?.[_0xc90ac9] || '')["trim"]();
  if (_0x5236aa) {
    return _0x5236aa;
  }
  const _0x8b2007 = _0x563ae4?.["slotOrderByType"] && typeof _0x563ae4['slotOrderByType'] === "object" ? _0x563ae4["slotOrderByType"] : {};
  for (const [_0x35ba28, _0x1e91ef] of Object["entries"](_0x8b2007)) {
    if ((Array["isArray"](_0x1e91ef) ? _0x1e91ef : [])["includes"](_0xc90ac9)) {
      return String(_0x35ba28 || '')['trim']();
    }
  }
  return '';
}
function isKnownFixedInputSlot(_0x5eaa64 = {}, _0x3c8dba = '') {
  const _0x1d81e8 = normalizeFixedSlotId(_0x3c8dba);
  if (!_0x1d81e8) {
    return ![];
  }
  if (_0x5eaa64?.["slotById"]?.[_0x1d81e8]) {
    return !![];
  }
  return !!getFixedInputSlotKind(_0x5eaa64, _0x1d81e8);
}
function sourceHasMaskImage(_0x26ad9f = null) {
  const _0x5cb537 = _0x26ad9f?.["nodeData"] && typeof _0x26ad9f["nodeData"] === "object" ? _0x26ad9f["nodeData"] : _0x26ad9f;
  return !!String(_0x5cb537?.["mask"] || _0x5cb537?.['maskImageDataUrl'] || _0x5cb537?.["maskImageUrl"] || _0x5cb537?.["maskUrl"] || _0x5cb537?.["maskLocalPath"] || '')["trim"]();
}
export function fixedInputSlotAcceptsSource(_0x552e7b = {}, _0x2a98fe = '', _0x3b08d9 = null) {
  const _0x277301 = normalizeFixedSlotId(_0x2a98fe);
  if (!_0x277301) {
    return ![];
  }
  const _0x310dfe = _0x552e7b?.["slotById"]?.[_0x277301] || {};
  if (_0x310dfe?.["requiresMask"] === !![]) {
    return _0x3b08d9 ? sourceHasMaskImage(_0x3b08d9) : ![];
  }
  return !![];
}
export function resolveFixedInputSlotForRef({
  fixedInputConfig = null,
  refSlot = '',
  kind = '',
  occupiedSlots = null,
  sourceNode = null,
  source = null
} = {}) {
  const _0x17cfd1 = fixedInputConfig || {};
  const _0x2ac9b6 = String(kind || '')['trim']();
  const _0x1528a2 = sourceNode || source || null;
  if (!_0x2ac9b6 || _0x2ac9b6 === 'text') {
    return {
      'slot': '',
      'reason': 'unsupported'
    };
  }
  const _0x34c330 = new Set(Array["isArray"](_0x17cfd1["visibleSlots"]) && _0x17cfd1["visibleSlots"]["length"] ? _0x17cfd1["visibleSlots"]["map"](_0x6244f7 => normalizeFixedSlotId(_0x6244f7))["filter"](Boolean) : getSlotsFromOrder(_0x17cfd1['slotOrderByType'])["map"](_0x5d2fea => normalizeFixedSlotId(_0x5d2fea)));
  if (_0x34c330["size"] === 0x0) {
    return {
      'slot': '',
      'reason': "noVisibleSlots"
    };
  }
  const _0x4350e3 = createFixedSlotOccupancyTracker({
    'exclusiveGroups': _0x17cfd1['exclusiveGroups'],
    'occupiedSlots': occupiedSlots
  });
  const _0x1dad4e = normalizeFixedSlotId(refSlot);
  if (_0x1dad4e && _0x34c330["has"](_0x1dad4e)) {
    const _0xaa2af2 = getFixedInputSlotKind(_0x17cfd1, _0x1dad4e);
    if (_0xaa2af2 !== _0x2ac9b6) {
      return {
        'slot': '',
        'reason': "kindMismatch",
        'explicitSlot': _0x1dad4e
      };
    }
    if (!fixedInputSlotAcceptsSource(_0x17cfd1, _0x1dad4e, _0x1528a2)) {
      return {
        'slot': '',
        'reason': "slotConstraint",
        'explicitSlot': _0x1dad4e
      };
    }
    if (!_0x4350e3['isSlotAvailable'](_0x1dad4e)) {
      return {
        'slot': '',
        'reason': 'occupied',
        'explicitSlot': _0x1dad4e
      };
    }
    return {
      'slot': _0x1dad4e,
      'reason': "explicit",
      'explicitSlot': _0x1dad4e
    };
  }
  if (_0x1dad4e && isKnownFixedInputSlot(_0x17cfd1, _0x1dad4e)) {
    const _0x516db8 = getFixedInputSlotKind(_0x17cfd1, _0x1dad4e);
    const _0x46d177 = Array["isArray"](_0x17cfd1?.['manifest']?.["inputSlots"]?.['preserveHiddenInputsByKindFields']) ? _0x17cfd1["manifest"]["inputSlots"]["preserveHiddenInputsByKindFields"] : [];
    const _0x427e21 = new Set(_0x46d177['map'](_0x919f50 => String(_0x919f50 || '')["trim"]())["filter"](Boolean));
    const _0x4dff6d = Array["isArray"](_0x17cfd1?.["hiddenReasonFieldsBySlot"]?.[_0x1dad4e]) ? _0x17cfd1["hiddenReasonFieldsBySlot"][_0x1dad4e] : [];
    const _0x305365 = _0x427e21['size'] === 0x0 || _0x4dff6d['length'] > 0x0 && _0x4dff6d["every"](_0x5db115 => _0x427e21["has"](String(_0x5db115 || '')['trim']()));
    const _0x4aa9d6 = (Array['isArray'](_0x17cfd1["slotOrderByType"]?.[_0x2ac9b6]) ? _0x17cfd1['slotOrderByType'][_0x2ac9b6] : [])["some"](_0x21dcc7 => _0x34c330["has"](normalizeFixedSlotId(_0x21dcc7)) && fixedInputSlotAcceptsSource(_0x17cfd1, _0x21dcc7, _0x1528a2));
    const _0x550ecd = _0x17cfd1?.["manifest"]?.['inputSlots']?.["preserveHiddenInputsByKind"] === !![] && _0x516db8 === _0x2ac9b6 && _0x305365 && _0x4aa9d6;
    if (!_0x550ecd) {
      return {
        'slot': '',
        'reason': "hidden",
        'explicitSlot': _0x1dad4e,
        'hidden': !![],
        'knownSlot': !![]
      };
    }
  }
  const _0x733720 = Array['isArray'](_0x17cfd1["slotOrderByType"]?.[_0x2ac9b6]) ? _0x17cfd1["slotOrderByType"][_0x2ac9b6]["map"](_0x2bb148 => normalizeFixedSlotId(_0x2bb148)) : [];
  const _0x302cac = _0x733720["find"](_0x328a1e => _0x34c330["has"](_0x328a1e) && _0x4350e3["isSlotAvailable"](_0x328a1e) && fixedInputSlotAcceptsSource(_0x17cfd1, _0x328a1e, _0x1528a2)) || '';
  return {
    'slot': _0x302cac,
    'reason': _0x302cac ? _0x1dad4e ? "stale" : "auto" : "overflow",
    'explicitSlot': _0x1dad4e
  };
}
export function buildFixedInputAssetSlotMapFromRefs(_0xdf4ddd = [], {
  slotOrderByType = {},
  visibleSlots = null,
  occupiedSlots = null,
  exclusiveGroups = [],
  slotById = {}
} = {}) {
  const _0x162e44 = new Set(Array['isArray'](visibleSlots) && visibleSlots['length'] ? visibleSlots["map"](String) : getSlotsFromOrder(slotOrderByType));
  const _0x27c279 = normalizeOccupiedSlots(occupiedSlots);
  const _0x50e5b7 = {};
  _0x162e44["forEach"](_0x525012 => {
    _0x50e5b7[_0x525012] = null;
  });
  (Array['isArray'](_0xdf4ddd) ? _0xdf4ddd : [])["forEach"](_0x1a5e31 => {
    const _0x46a698 = String(_0x1a5e31?.["type"] || '')["trim"]();
    const _0x54db72 = new Set(_0x27c279);
    Object['entries'](_0x50e5b7)["forEach"](([_0x48be92, _0x5c8486]) => {
      if (_0x5c8486) {
        _0x54db72["add"](_0x48be92);
      }
    });
    const _0x52b3d6 = resolveFixedInputSlotForRef({
      'fixedInputConfig': {
        'slotOrderByType': slotOrderByType,
        'visibleSlots': Array["from"](_0x162e44),
        'exclusiveGroups': exclusiveGroups,
        'slotById': slotById
      },
      'refSlot': _0x1a5e31?.["refSlot"],
      'kind': _0x46a698,
      'occupiedSlots': _0x54db72,
      'sourceNode': _0x1a5e31?.["nodeData"] || _0x1a5e31
    });
    const _0x228a23 = _0x52b3d6["slot"];
    if (!_0x228a23) {
      return;
    }
    _0x50e5b7[_0x228a23] = {
      ..._0x1a5e31,
      'refSlot': _0x228a23,
      'virtual': !![]
    };
  });
  return _0x50e5b7;
}
export function buildFixedInputAssetSlotMap(_0xe66fb1 = null, {
  slotOrderByType = {},
  visibleSlots = null,
  occupiedSlots = null,
  exclusiveGroups = [],
  slotById = {},
  nodeData = null
} = {}) {
  const _0x21fbbc = getAssetInputRefsFromPromptAndNode(_0xe66fb1, {
    'nodeData': nodeData,
    'allowedTypes': Object['keys'](slotOrderByType)
  });
  return buildFixedInputAssetSlotMapFromRefs(_0x21fbbc, {
    'slotOrderByType': slotOrderByType,
    'visibleSlots': visibleSlots,
    'occupiedSlots': occupiedSlots,
    'exclusiveGroups': exclusiveGroups,
    'slotById': slotById
  });
}
export function buildRhV54AssetSlotMapFromRefs(_0x36b756 = [], {
  hideExtraSlots = ![],
  occupiedSlots = null
} = {}) {
  return buildFixedInputAssetSlotMapFromRefs(_0x36b756, {
    'slotOrderByType': RH_V54_ASSET_SLOT_ORDER,
    'visibleSlots': getRhV54VisibleSlots({
      'hideExtraSlots': hideExtraSlots
    }),
    'occupiedSlots': occupiedSlots
  });
}
export function buildRhV54AssetSlotMap(_0x509c0d = null, {
  hideExtraSlots = ![],
  occupiedSlots = null,
  nodeData = null
} = {}) {
  return buildFixedInputAssetSlotMap(_0x509c0d, {
    'slotOrderByType': RH_V54_ASSET_SLOT_ORDER,
    'visibleSlots': getRhV54VisibleSlots({
      'hideExtraSlots': hideExtraSlots
    }),
    'occupiedSlots': occupiedSlots,
    'nodeData': nodeData
  });
}
export function buildRhBasicAssetSlotMap(_0x5c774d = null, _0x42dc83 = {}) {
  return buildFixedInputAssetSlotMap(_0x5c774d, {
    'slotOrderByType': RH_BASIC_ASSET_SLOT_ORDER,
    'visibleSlots': ["sourceVideo", 'refImage'],
    'occupiedSlots': _0x42dc83["occupiedSlots"],
    'nodeData': _0x42dc83["nodeData"]
  });
}
export function buildRhLtxAssetSlotMap(_0x79a617 = null, _0x2853ec = {}) {
  return buildFixedInputAssetSlotMap(_0x79a617, {
    'slotOrderByType': RH_LTX_ASSET_SLOT_ORDER,
    'visibleSlots': ["refImage", "audio"],
    'occupiedSlots': _0x2853ec["occupiedSlots"],
    'nodeData': _0x2853ec['nodeData']
  });
}
export function buildRhLipSyncAssetSlotMap(_0x484de4 = null, _0x154463 = {}) {
  return buildFixedInputAssetSlotMap(_0x484de4, {
    'slotOrderByType': RH_LIPSYNC_ASSET_SLOT_ORDER,
    'visibleSlots': ["sourceVideo", "refImage", 'audio'],
    'occupiedSlots': _0x154463['occupiedSlots'],
    'exclusiveGroups': RH_LIPSYNC_VISUAL_EXCLUSIVE_GROUPS,
    'nodeData': _0x154463["nodeData"]
  });
}