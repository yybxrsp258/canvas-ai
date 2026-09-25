import { buildGenerationFailurePatch, buildGenerationSuccessPatch } from './generationTaskLifecycle.js';
function asObject(_0x51e364) {
  return _0x51e364 && typeof _0x51e364 === "object" && !Array["isArray"](_0x51e364) ? _0x51e364 : null;
}
export function firstNonEmptyString(..._0x4c9fc1) {
  for (const _0x5a0cfd of _0x4c9fc1) {
    const _0x1a9210 = String(_0x5a0cfd || '')["trim"]();
    if (_0x1a9210) {
      return _0x1a9210;
    }
  }
  return '';
}
export function resolveGenerationResultSelection(_0x43a687 = [], _0xaf63d1 = 0x0) {
  const _0xe0b48c = Number(_0xaf63d1);
  const _0x21147c = Number["isFinite"](_0xe0b48c) ? Math["trunc"](_0xe0b48c) : 0x0;
  return {
    'items': _0x43a687,
    'activeIndex': Math["max"](0x0, Math["min"](_0x43a687["length"] - 0x1, _0x21147c))
  };
}
export function normalizeGenerationResultItems(_0x751a6a, {
  collectionField = '',
  singleItemFields = []
} = {}) {
  if (_0x751a6a?.['outputType'] && Array["isArray"](_0x751a6a["items"])) {
    return _0x751a6a["items"];
  }
  if (collectionField && Array['isArray'](_0x751a6a?.[collectionField])) {
    return _0x751a6a[collectionField];
  }
  if (Array["isArray"](_0x751a6a)) {
    return _0x751a6a;
  }
  const _0x4ea522 = asObject(_0x751a6a);
  if (!_0x4ea522) {
    return [];
  }
  if (firstNonEmptyString(_0x4ea522["error"])) {
    return [_0x4ea522];
  }
  for (const _0x2f5ebd of singleItemFields) {
    if (firstNonEmptyString(_0x4ea522[_0x2f5ebd])) {
      return [_0x4ea522];
    }
  }
  return [];
}
export function getFirstGenerationResultError(_0x1275d8, {
  collectionField = '',
  singleItemFields = []
} = {}) {
  const _0x3aaef3 = normalizeGenerationResultItems(_0x1275d8, {
    'collectionField': collectionField,
    'singleItemFields': singleItemFields
  });
  const _0x4f58e3 = _0x3aaef3["find"](_0x81ada0 => firstNonEmptyString(_0x81ada0?.['error']));
  return firstNonEmptyString(_0x4f58e3?.['error']);
}
export function buildGenerationCollectionResultPatch(_0x559549, {
  collectionField: _0x3341cc,
  mainIndexField: _0x5a452d,
  expandedField = '',
  startedAt = 0x0,
  duration = null,
  normalizeItem = _0x17fb08 => _0x17fb08,
  buildFirstItemPatch = () => ({}),
  selectMainIndex = null,
  extraPatch = {},
  singleItemFields = []
} = {}) {
  if (!_0x3341cc || !_0x5a452d) {
    throw new Error("[generationResultRenderer] collection and main index fields are required");
  }
  const _0x1f5431 = normalizeGenerationResultItems(_0x559549, {
    'collectionField': _0x3341cc,
    'singleItemFields': singleItemFields
  });
  const _0x133531 = _0x1f5431['map'](_0x112e50 => normalizeItem(_0x112e50));
  if (_0x133531['length'] === 0x0) {
    return null;
  }
  const _0x3f2e9d = typeof selectMainIndex === "function" ? Number(selectMainIndex(_0x133531)) : 0x0;
  const _0x3611a3 = Number["isFinite"](_0x3f2e9d) && _0x3f2e9d >= 0x0 ? Math["min"](_0x133531["length"] - 0x1, Math["trunc"](_0x3f2e9d)) : 0x0;
  const _0x25afec = _0x133531[_0x3611a3] || {};
  const _0x4804e3 = firstNonEmptyString(_0x25afec['error']);
  const _0x50a7c1 = _0x4804e3 ? buildGenerationFailurePatch({
    'error': _0x4804e3,
    'startedAt': startedAt,
    'duration': duration
  }) : buildGenerationSuccessPatch({
    'startedAt': startedAt,
    'duration': duration
  });
  const _0x23f21b = typeof extraPatch === "function" ? extraPatch(_0x25afec, _0x133531) : extraPatch;
  return {
    [_0x3341cc]: _0x133531,
    [_0x5a452d]: _0x3611a3,
    ...(expandedField ? {
      [expandedField]: ![]
    } : {}),
    ..._0x50a7c1,
    ...buildFirstItemPatch(_0x25afec, _0x133531),
    ...(_0x23f21b && typeof _0x23f21b === "object" ? _0x23f21b : {})
  };
}
export function buildGenerationSingleResultPatch(_0x1d8caa, {
  collectionField = '',
  startedAt = 0x0,
  duration = null,
  normalizeItem = _0x290be8 => _0x290be8,
  buildItemPatch = () => ({}),
  extraPatch = {},
  singleItemFields = []
} = {}) {
  const _0x1a32db = normalizeGenerationResultItems(_0x1d8caa, {
    'collectionField': collectionField,
    'singleItemFields': singleItemFields
  });
  if (_0x1a32db["length"] === 0x0) {
    return null;
  }
  const _0x29f445 = normalizeItem(_0x1a32db[0x0]);
  const _0x4cfd75 = firstNonEmptyString(_0x29f445?.["error"]);
  const _0x4bcead = _0x4cfd75 ? buildGenerationFailurePatch({
    'error': _0x4cfd75,
    'startedAt': startedAt,
    'duration': duration
  }) : buildGenerationSuccessPatch({
    'startedAt': startedAt,
    'duration': duration
  });
  const _0x3e491a = typeof extraPatch === "function" ? extraPatch(_0x29f445) : extraPatch;
  return {
    ..._0x4bcead,
    ...buildItemPatch(_0x29f445),
    ...(_0x3e491a && typeof _0x3e491a === "object" ? _0x3e491a : {})
  };
}