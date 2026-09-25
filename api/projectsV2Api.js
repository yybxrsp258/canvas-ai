import { buildApiUrl } from './apiBase.js';
import { get as a110_0x4d10a7, post as a110_0x35bcab, del as a110_0xd30763, requester } from './requester.js';
import { normalizeLocalPath, localPathToUrl } from '../src/utils/localMediaPath.js';
import { assertLocalAssetUploadSize, parseLocalAssetUploadError } from './localAssetUploadPolicy.js';
const WORKFLOWS_FALLBACK_USER_FILE = "/api/v2/user/workflows.json";
const ASSET_CATEGORIES_USER_FILE = '/api/v2/user/asset-categories.json';
const PROJECT_FILE_EXTENSION_RE = /\.(?:aicanvas|json)$/i;
const _saveOutputFromUrlInflight = new Map();
const _saveOutputFromUrlCache = new Map();
const SAVE_OUTPUT_FROM_URL_CACHE_LIMIT = 0x1f4;
export const SAVE_OUTPUT_FROM_URL_TIMEOUT_MS = 0x5 * 0x3c * 0x3e8;
export const ASSET_STAGE_UPLOAD_TIMEOUT_MS = 0x1e * 0x3c * 0x3e8;
const _localMediaStatInflight = new Map();
const _localMediaStatCache = new Map();
const LOCAL_MEDIA_EXISTS_CACHE_LIMIT = 0x3e8;
const LOCAL_MEDIA_EXISTS_TRUE_CACHE_TTL_MS = 0x1e * 0x3e8;
const LOCAL_MEDIA_EXISTS_FALSE_CACHE_TTL_MS = 0x3 * 0x3e8;
function isLocalRelativeUrl(_0x33bf0b) {
  const _0x1c5ce9 = String(_0x33bf0b || '')["trim"]();
  return _0x1c5ce9["startsWith"]('/') && !_0x1c5ce9["startsWith"]('//');
}
function normalizePositiveTimeoutMs(_0x4e6db4, _0x123f3c) {
  const _0x3ca3f4 = Number(_0x4e6db4);
  return Number['isFinite'](_0x3ca3f4) && _0x3ca3f4 > 0x0 ? _0x3ca3f4 : _0x123f3c;
}
function _rememberSavedOutput(_0x1cc5e6, _0x312e09) {
  if (!_0x1cc5e6 || !_0x312e09 || typeof _0x312e09 !== "object") {
    return;
  }
  _saveOutputFromUrlCache["set"](_0x1cc5e6, _0x312e09);
  if (_saveOutputFromUrlCache["size"] > SAVE_OUTPUT_FROM_URL_CACHE_LIMIT) {
    const _0x245b31 = _saveOutputFromUrlCache['keys']()["next"]()["value"];
    if (_0x245b31) {
      _saveOutputFromUrlCache["delete"](_0x245b31);
    }
  }
}
function _collectNormalizedLocalPaths(_0xd502e9) {
  const _0x1c1446 = new Set();
  for (const _0x8b2a66 of Array["isArray"](_0xd502e9) ? _0xd502e9 : []) {
    const _0x4c8f33 = normalizeLocalPath(_0x8b2a66);
    if (_0x4c8f33) {
      _0x1c1446['add'](_0x4c8f33);
    }
  }
  return _0x1c1446;
}
function _evictSavedOutputCacheByLocalPaths(_0x329a3a) {
  const _0xe48b45 = _collectNormalizedLocalPaths(_0x329a3a);
  if (_0xe48b45["size"] === 0x0) {
    return;
  }
  for (const [_0x4d5049, _0x5a0845] of _saveOutputFromUrlCache["entries"]()) {
    const _0x45d52c = normalizeLocalPath(_0x5a0845?.['localPath'] || _0x5a0845?.['path'] || _0x5a0845?.["url"]);
    _0x45d52c && _0xe48b45["has"](_0x45d52c) && _saveOutputFromUrlCache["delete"](_0x4d5049);
  }
}
function _evictLocalMediaExistsCacheByLocalPaths(_0x35fe3f) {
  const _0x3eae5a = _collectNormalizedLocalPaths(_0x35fe3f);
  for (const _0x2225b7 of _0x3eae5a) {
    const _0x556a93 = _localPathToStaticRequestPath(_0x2225b7);
    if (_0x556a93) {
      _localMediaStatCache["delete"](_0x556a93);
    }
  }
}
function _readLocalMediaStatCache(_0x1724bc) {
  const _0x3d20b8 = _localMediaStatCache['get'](_0x1724bc);
  if (!_0x3d20b8) {
    return undefined;
  }
  if (Number(_0x3d20b8["expiresAt"] || 0x0) <= Date['now']()) {
    _localMediaStatCache["delete"](_0x1724bc);
    return undefined;
  }
  return _0x3d20b8["stat"];
}
function _rememberLocalMediaStat(_0x43c91c, _0x4e295d) {
  if (!_0x43c91c) {
    return;
  }
  const _0x51b3eb = {
    'exists': _0x4e295d?.['exists'] === !![],
    'sizeBytes': Number["isSafeInteger"](Number(_0x4e295d?.["sizeBytes"])) && Number(_0x4e295d["sizeBytes"]) >= 0x0 ? Number(_0x4e295d["sizeBytes"]) : 0x0,
    'contentType': String(_0x4e295d?.['contentType'] || '')['trim'](),
    'lastModified': String(_0x4e295d?.['lastModified'] || '')["trim"]()
  };
  const _0x52ce82 = _0x51b3eb['exists'] ? LOCAL_MEDIA_EXISTS_TRUE_CACHE_TTL_MS : LOCAL_MEDIA_EXISTS_FALSE_CACHE_TTL_MS;
  _localMediaStatCache["set"](_0x43c91c, {
    'stat': _0x51b3eb,
    'expiresAt': Date['now']() + _0x52ce82
  });
  if (_localMediaStatCache["size"] > LOCAL_MEDIA_EXISTS_CACHE_LIMIT) {
    const _0x40b677 = _localMediaStatCache["keys"]()["next"]()["value"];
    if (_0x40b677) {
      _localMediaStatCache["delete"](_0x40b677);
    }
  }
  return _0x51b3eb;
}
function _normalizeProjectFilename(_0x59d409) {
  const _0x24b782 = String(_0x59d409 || '')['trim']();
  if (!_0x24b782) {
    return 'default_v2_project.aicanvas';
  }
  return PROJECT_FILE_EXTENSION_RE["test"](_0x24b782) ? _0x24b782 : _0x24b782 + '.aicanvas';
}
function _normalizeLegacyProjectFilename(_0x3be800) {
  const _0x5815ec = String(_0x3be800 || '')["trim"]();
  if (!_0x5815ec) {
    return "default_v2_project.json";
  }
  return PROJECT_FILE_EXTENSION_RE["test"](_0x5815ec) ? _0x5815ec : _0x5815ec + '.json';
}
function _isNotFoundError(_0x59c2e1) {
  return Number(_0x59c2e1?.["status"]) === 0x194 || /not found/i["test"](String(_0x59c2e1?.["message"] || ''));
}
function _extractWorkflowItems(_0x4af6ce) {
  if (Array["isArray"](_0x4af6ce)) {
    return _0x4af6ce;
  }
  if (_0x4af6ce && typeof _0x4af6ce === "object" && Array["isArray"](_0x4af6ce['items'])) {
    return _0x4af6ce['items'];
  }
  return [];
}
function _upsertWorkflowItems(_0x4cccda, _0x13277b) {
  const _0xce2ef6 = Array["isArray"](_0x4cccda) ? [..._0x4cccda] : [];
  const _0x580f0b = String(_0x13277b?.['id'] || '')["trim"]();
  if (!_0x580f0b) {
    return _0xce2ef6;
  }
  const _0x1e102a = _0xce2ef6["findIndex"](_0x5c97f4 => String(_0x5c97f4?.['id'] || '')["trim"]() === _0x580f0b);
  _0x1e102a >= 0x0 ? _0xce2ef6[_0x1e102a] = {
    ..._0xce2ef6[_0x1e102a],
    ...(_0x13277b || {})
  } : _0xce2ef6["unshift"](_0x13277b);
  _0xce2ef6["sort"]((_0x237401, _0x6492d8) => Number(_0x6492d8?.["updatedAt"] || 0x0) - Number(_0x237401?.["updatedAt"] || 0x0));
  return _0xce2ef6;
}
export async function fetchV2ProjectFromServer(_0x3fdd19) {
  const _0x331c6c = _normalizeProjectFilename(_0x3fdd19);
  const _0x498121 = "/api/v2/projects/" + encodeURIComponent(_0x331c6c);
  const _0x4c7924 = await a110_0x4d10a7(_0x498121, {
    'allow404Null': !![],
    'provider': "local"
  });
  if (_0x4c7924 || PROJECT_FILE_EXTENSION_RE["test"](String(_0x3fdd19 || ''))) {
    return _0x4c7924;
  }
  const _0x55d3c4 = _normalizeLegacyProjectFilename(_0x3fdd19);
  if (_0x55d3c4 !== _0x331c6c) {
    return await a110_0x4d10a7("/api/v2/projects/" + encodeURIComponent(_0x55d3c4), {
      'allow404Null': !![],
      'provider': 'local'
    });
  }
  return _0x4c7924;
}
export async function saveV2ProjectToServer(_0x4fdbaf) {
  const _0x392cbf = await a110_0x35bcab('/api/v2/projects/save', _0x4fdbaf || {}, {
    'provider': "local"
  });
  return _0x392cbf;
}
export async function fetchV2ProjectsFromServer() {
  const _0xdadfcc = await a110_0x4d10a7("/api/v2/projects", {
    'provider': 'local'
  });
  return Array["isArray"](_0xdadfcc) ? _0xdadfcc : [];
}
export async function deleteV2ProjectFromServer(_0x4273b2) {
  const _0x2a804b = _normalizeProjectFilename(_0x4273b2);
  try {
    await a110_0xd30763("/api/v2/projects/" + encodeURIComponent(_0x2a804b), {
      'provider': "local"
    });
    return !![];
  } catch {
    const _0x1b52bc = _normalizeLegacyProjectFilename(_0x4273b2);
    if (!PROJECT_FILE_EXTENSION_RE["test"](String(_0x4273b2 || '')) && _0x1b52bc !== _0x2a804b) {
      try {
        await a110_0xd30763('/api/v2/projects/' + encodeURIComponent(_0x1b52bc), {
          'provider': "local"
        });
        return !![];
      } catch {
        return ![];
      }
    }
    return ![];
  }
}
export async function renameV2ProjectOnServer(_0x535b01, _0x1cc162) {
  const _0x153bcc = String(_0x1cc162 || '')["trim"]();
  if (!_0x153bcc) {
    return {
      'success': ![]
    };
  }
  const _0x18102f = _normalizeProjectFilename(_0x535b01);
  return await requester({
    'url': "/api/v2/projects/" + encodeURIComponent(_0x18102f),
    'method': 'PATCH',
    'headers': {
      'Content-Type': "application/json"
    },
    'body': JSON["stringify"]({
      'name': _0x153bcc
    }),
    'provider': 'local'
  });
}
export async function fetchAssetsFromServer(_0x46a0ff = {}) {
  try {
    const _0xb7c038 = new URLSearchParams();
    for (const [_0x4d5248, _0x3bc09b] of Object["entries"](_0x46a0ff || {})) {
      if (_0x3bc09b === undefined || _0x3bc09b === null || _0x3bc09b === '') {
        continue;
      }
      _0xb7c038['set'](_0x4d5248, String(_0x3bc09b));
    }
    const _0x283f7c = _0xb7c038["toString"]() ? '?' + _0xb7c038['toString']() : '';
    const _0x197b0f = await a110_0x4d10a7("/api/v2/assets" + _0x283f7c, {
      'provider': "local"
    });
    if (Array['isArray'](_0x197b0f)) {
      return _0x197b0f;
    }
    if (_0x197b0f && typeof _0x197b0f === "object" && Array["isArray"](_0x197b0f["items"])) {
      return _0x197b0f;
    }
    return [];
  } catch {
    return _0x46a0ff && Object["keys"](_0x46a0ff)["length"] > 0x0 ? {
      'items': [],
      'total': 0x0,
      'nextOffset': null,
      'hasMore': ![]
    } : [];
  }
}
export async function fetchOutputFilesFromServer(_0xe3ad6 = {}) {
  try {
    const _0x539fcf = new URLSearchParams();
    for (const [_0x3220f8, _0x49d148] of Object["entries"](_0xe3ad6 || {})) {
      if (_0x49d148 === undefined || _0x49d148 === null || _0x49d148 === '') {
        continue;
      }
      _0x539fcf["set"](_0x3220f8, String(_0x49d148));
    }
    const _0x5dcedf = _0x539fcf["toString"]() ? '?' + _0x539fcf["toString"]() : '';
    const _0x5f14c0 = await a110_0x4d10a7("/api/v2/output-files" + _0x5dcedf, {
      'provider': "local"
    });
    return _0x5f14c0 && typeof _0x5f14c0 === 'object' ? _0x5f14c0 : {
      'items': []
    };
  } catch {
    return {
      'items': []
    };
  }
}
export async function deleteOutputFilesFromServer(_0x59487e = {}) {
  const _0x23c065 = await a110_0x35bcab('/api/v2/output-files/delete', _0x59487e || {}, {
    'provider': 'local'
  });
  const _0x131d12 = [...(Array['isArray'](_0x59487e?.['localPaths']) ? _0x59487e["localPaths"] : []), ...(Array["isArray"](_0x23c065?.["deleted"]) ? _0x23c065['deleted'] : []), ...(Array["isArray"](_0x23c065?.["deletedDerivatives"]) ? _0x23c065["deletedDerivatives"] : []), ...(Array["isArray"](_0x23c065?.["missing"]) ? _0x23c065["missing"] : [])];
  _evictSavedOutputCacheByLocalPaths(_0x131d12);
  _evictLocalMediaExistsCacheByLocalPaths(_0x131d12);
  return _0x23c065;
}
export async function saveOutputVideoThumbnailToServer(_0x30690f = {}) {
  return await a110_0x35bcab("/api/v2/output-files/video-thumbnail", _0x30690f || {}, {
    'provider': "local"
  });
}
export async function saveAssetToServer(_0x2fd0fb) {
  const _0xd61533 = await a110_0x35bcab("/api/v2/assets/save", _0x2fd0fb || {}, {
    'provider': "local"
  });
  return _0xd61533;
}
export async function deleteAssetFromServer(_0x1d9d49) {
  const _0x1e71cb = _0x1d9d49 + ".json";
  try {
    await a110_0xd30763('/api/v2/assets/' + encodeURIComponent(_0x1e71cb), {
      'provider': "local"
    });
    return !![];
  } catch {
    return ![];
  }
}
export async function fetchAssetCategorySettingsFromServer() {
  try {
    const _0x256dee = await a110_0x4d10a7(ASSET_CATEGORIES_USER_FILE, {
      'provider': "local"
    });
    if (Array['isArray'](_0x256dee)) {
      return {
        'categories': _0x256dee,
        'displayNames': {},
        'parents': {}
      };
    }
    if (_0x256dee && typeof _0x256dee === "object") {
      const _0x3d7357 = Array["isArray"](_0x256dee['categories']) ? _0x256dee["categories"] : Array["isArray"](_0x256dee["items"]) ? _0x256dee["items"] : [];
      const _0x51c54b = _0x256dee["displayNames"] && typeof _0x256dee['displayNames'] === "object" ? _0x256dee["displayNames"] : {};
      const _0x12be99 = _0x256dee["parents"] && typeof _0x256dee["parents"] === "object" ? _0x256dee["parents"] : {};
      return {
        'categories': _0x3d7357,
        'displayNames': _0x51c54b,
        'parents': _0x12be99
      };
    }
    return {
      'categories': [],
      'displayNames': {},
      'parents': {}
    };
  } catch {
    return {
      'categories': [],
      'displayNames': {},
      'parents': {}
    };
  }
}
export async function fetchAssetCategoriesFromServer() {
  const _0x2b1de8 = await fetchAssetCategorySettingsFromServer();
  return _0x2b1de8['categories'];
}
export async function saveAssetCategoriesToServer(_0x111658 = [], {
  displayNames = {},
  parents = {}
} = {}) {
  const _0x10bcaf = Array["isArray"](_0x111658) ? _0x111658 : [];
  const _0x4405f2 = displayNames && typeof displayNames === "object" ? displayNames : {};
  const _0x592406 = parents && typeof parents === "object" ? parents : {};
  const _0x227e34 = await a110_0x35bcab(ASSET_CATEGORIES_USER_FILE, {
    'version': 0x3,
    'categories': _0x10bcaf,
    'displayNames': _0x4405f2,
    'parents': _0x592406
  }, {
    'provider': "local"
  });
  return _0x227e34;
}
export async function saveAssetThumbToServer(_0x5d73a0) {
  const _0x3c0927 = String(_0x5d73a0?.["assetId"] ?? _0x5d73a0?.['id'] ?? '')["trim"]();
  const _0x57264b = String(_0x5d73a0?.["dataUrl"] || '');
  if (!_0x3c0927) {
    throw new Error("保存资产缩略图失败: 缺少 assetId");
  }
  if (!_0x57264b["startsWith"]("data:image/")) {
    throw new Error("保存资产缩略图失败: dataUrl 非法");
  }
  const _0xa21d1f = await a110_0x35bcab("/api/v2/assets/thumb/save", {
    ...(_0x5d73a0 || {}),
    'assetId': _0x3c0927
  }, {
    'provider': "local"
  });
  return _0xa21d1f;
}
export async function fetchWorkflowsFromServer() {
  try {
    const _0x30d3e6 = await a110_0x4d10a7("/api/v2/workflows", {
      'provider': 'local'
    });
    return Array['isArray'](_0x30d3e6) ? _0x30d3e6 : [];
  } catch (_0x32d6a1) {
    if (!_isNotFoundError(_0x32d6a1)) {
      return [];
    }
    try {
      const _0x2c9ad8 = await a110_0x4d10a7(WORKFLOWS_FALLBACK_USER_FILE, {
        'provider': "local"
      });
      return _extractWorkflowItems(_0x2c9ad8);
    } catch {
      return [];
    }
  }
}
async function deleteWorkflowFromFallbackFile(_0x4b05d4) {
  const _0x6a6a9d = await a110_0x4d10a7(WORKFLOWS_FALLBACK_USER_FILE, {
    'provider': "local"
  })["catch"](() => ({}));
  const _0x4a1d5a = String(_0x4b05d4 || '')["trim"]();
  const _0x44f16f = _extractWorkflowItems(_0x6a6a9d)["filter"](_0x4a7995 => String(_0x4a7995?.['id'] || '')["trim"]() !== _0x4a1d5a);
  await a110_0x35bcab(WORKFLOWS_FALLBACK_USER_FILE, {
    'items': _0x44f16f
  }, {
    'provider': "local"
  });
  return !![];
}
async function saveWorkflowToFallbackFile(_0x131be9) {
  const _0x2a790c = await a110_0x4d10a7(WORKFLOWS_FALLBACK_USER_FILE, {
    'provider': 'local'
  })['catch'](() => ({}));
  const _0x11782f = _upsertWorkflowItems(_extractWorkflowItems(_0x2a790c), _0x131be9 || {});
  await a110_0x35bcab(WORKFLOWS_FALLBACK_USER_FILE, {
    'items': _0x11782f
  }, {
    'provider': "local"
  });
  return {
    'success': !![],
    'id': _0x131be9?.['id']
  };
}
export async function saveWorkflowToServer(_0x23718c) {
  try {
    const _0x2a3165 = await a110_0x35bcab("/api/v2/workflows/save", _0x23718c || {}, {
      'provider': "local"
    });
    return _0x2a3165;
  } catch (_0x20316c) {
    if (!_isNotFoundError(_0x20316c)) {
      throw _0x20316c;
    }
    return await saveWorkflowToFallbackFile(_0x23718c);
  }
}
export async function deleteWorkflowFromServer(_0x4592b2) {
  const _0x129d4b = String(_0x4592b2 || '')['trim']();
  if (!_0x129d4b) {
    return ![];
  }
  const _0x529e9a = _0x129d4b + ".json";
  try {
    await a110_0xd30763('/api/v2/workflows/' + encodeURIComponent(_0x529e9a), {
      'provider': "local"
    });
    return !![];
  } catch (_0x59b533) {
    if (!_isNotFoundError(_0x59b533)) {
      return ![];
    }
    try {
      return await deleteWorkflowFromFallbackFile(_0x129d4b);
    } catch {
      return ![];
    }
  }
}
export async function saveWorkflowThumbToServer(_0xc9f87d) {
  const _0x4d983d = String(_0xc9f87d?.['workflowId'] ?? _0xc9f87d?.['id'] ?? '')['trim']();
  const _0x13054d = String(_0xc9f87d?.["dataUrl"] || '');
  if (!_0x4d983d) {
    throw new Error("保存工作流封面失败: 缺少 workflowId");
  }
  if (!_0x13054d["startsWith"]("data:image/")) {
    throw new Error("保存工作流封面失败: dataUrl 非法");
  }
  try {
    const _0x203b8f = await a110_0x35bcab('/api/v2/workflows/thumb/save', {
      ...(_0xc9f87d || {}),
      'workflowId': _0x4d983d
    }, {
      'provider': "local"
    });
    return _0x203b8f;
  } catch (_0x17e6c0) {
    if (!_isNotFoundError(_0x17e6c0)) {
      throw _0x17e6c0;
    }
    return {
      'success': !![],
      'url': _0x13054d,
      'localPath': _0x13054d,
      'filename': _0x4d983d + "_cover.inline"
    };
  }
}
export async function uploadFileToServer(_0x1a278d) {
  assertLocalAssetUploadSize(_0x1a278d);
  const _0x2c6ec3 = _0x1a278d?.["name"] ? String(_0x1a278d['name']) : "file";
  const _0x47e08e = new FormData();
  _0x47e08e["append"]("file", _0x1a278d, _0x2c6ec3);
  const _0x5657c7 = await a110_0x35bcab("/api/upload?filename=" + encodeURIComponent(_0x2c6ec3), _0x47e08e, {
    'provider': 'local',
    'timeout': ASSET_STAGE_UPLOAD_TIMEOUT_MS,
    'errorParser': parseLocalAssetUploadError
  });
  return _0x5657c7;
}
export async function stageAssetUploadToServer(_0x31c5c0) {
  assertLocalAssetUploadSize(_0x31c5c0);
  const _0x30d9d4 = _0x31c5c0?.["name"] ? String(_0x31c5c0['name']) : "file";
  return await a110_0x35bcab("/api/v2/assets/stage?filename=" + encodeURIComponent(_0x30d9d4), _0x31c5c0, {
    'provider': 'local',
    'timeout': ASSET_STAGE_UPLOAD_TIMEOUT_MS,
    'retries': 0x0,
    'headers': {
      'Content-Type': "application/octet-stream"
    },
    'errorParser': parseLocalAssetUploadError
  });
}
export async function discardStagedAssetUploadToServer(_0x406340) {
  const _0x1dadd2 = String(_0x406340 || '')['trim']()["toLowerCase"]();
  if (!/^[a-f0-9]{32}$/["test"](_0x1dadd2)) {
    return {
      'success': ![],
      'removed': ![]
    };
  }
  return await a110_0x35bcab("/api/v2/assets/stage/discard", {
    'stageId': _0x1dadd2
  }, {
    'provider': "local",
    'timeout': 0x1e * 0x3e8,
    'retries': 0x0
  });
}
export async function fetchRemoteBlob(_0x721128, _0xbd137d = {}) {
  const _0x503e05 = String(_0x721128 || '')["trim"]();
  const _0x57d4c9 = isLocalRelativeUrl(_0x503e05);
  const _0x1fd0b7 = await a110_0x4d10a7(_0x503e05, {
    'provider': _0x57d4c9 ? "local" : "remote",
    'buildUrl': _0x57d4c9,
    'responseType': "blob",
    'signal': _0xbd137d?.['signal'],
    'timeout': _0xbd137d?.["timeout"]
  });
  return _0x1fd0b7;
}
export async function saveOutputToServer(_0x487863, _0x1d3b0c = {}) {
  const _0x6985f2 = String(_0x1d3b0c?.["ext"] || '')['trim']()['toLowerCase']() || 'bin';
  const _0x2bb2f9 = String(_0x1d3b0c?.["subDir"] || '')["trim"]();
  const _0x464538 = String(_0x1d3b0c?.["kind"] || '')["trim"]();
  const _0x3a11af = new URLSearchParams({
    'ext': _0x6985f2
  });
  if (_0x2bb2f9) {
    _0x3a11af["set"]("subDir", _0x2bb2f9);
  }
  if (_0x464538) {
    _0x3a11af["set"]('kind', _0x464538);
  }
  const _0x10efef = await a110_0x35bcab("/api/v2/save_output?" + _0x3a11af["toString"](), _0x487863, {
    'provider': "local",
    'headers': {
      'Content-Type': 'application/octet-stream'
    }
  });
  return _0x10efef;
}
export async function saveOutputFromUrlToServer(_0x5dc9b3) {
  const _0x204251 = String(_0x5dc9b3?.["url"] || '')['trim']();
  if (!_0x204251) {
    throw new Error("保存到 output 失败: 缺少 url");
  }
  const _0x24011c = String(_0x5dc9b3?.["dedupeKey"] || (_0x5dc9b3?.["taskKey"] ? _0x5dc9b3['taskKey'] + ':' + _0x204251 : _0x204251))["trim"]();
  const _0x2670c6 = _0x24011c || _0x204251;
  if (_saveOutputFromUrlCache["has"](_0x2670c6)) {
    return _saveOutputFromUrlCache["get"](_0x2670c6);
  }
  if (_saveOutputFromUrlInflight["has"](_0x2670c6)) {
    return _saveOutputFromUrlInflight["get"](_0x2670c6);
  }
  const _0x550853 = {
    'url': _0x204251,
    'ext': _0x5dc9b3?.["ext"],
    'maxBytes': _0x5dc9b3?.["maxBytes"],
    'dedupeKey': _0x24011c
  };
  const _0x40d6c8 = normalizePositiveTimeoutMs(_0x5dc9b3?.["timeoutMs"] ?? _0x5dc9b3?.["timeout"], SAVE_OUTPUT_FROM_URL_TIMEOUT_MS);
  const _0x4165be = a110_0x35bcab("/api/v2/save_output_from_url", _0x550853, {
    'provider': "local",
    'timeout': _0x40d6c8
  })["then"](_0x4fe972 => {
    _rememberSavedOutput(_0x2670c6, _0x4fe972);
    return _0x4fe972;
  });
  _saveOutputFromUrlInflight["set"](_0x2670c6, _0x4165be);
  _0x4165be["finally"](() => {
    _saveOutputFromUrlInflight["get"](_0x2670c6) === _0x4165be && _saveOutputFromUrlInflight["delete"](_0x2670c6);
  })["catch"](() => {});
  return _0x4165be;
}
export async function cropGridTilesToServer(_0x241a72 = {}) {
  const _0x2b55a2 = String(_0x241a72?.["localPath"] || _0x241a72?.["path"] || '')["trim"]();
  if (!_0x2b55a2) {
    throw new Error("宫格裁切失败: 缺少 localPath");
  }
  const _0x5e92c5 = Math["round"](Number(_0x241a72?.["cols"]) || 0x0);
  const _0x41756e = Math["round"](Number(_0x241a72?.["rows"]) || 0x0);
  if (_0x5e92c5 <= 0x0 || _0x41756e <= 0x0) {
    throw new Error('宫格裁切失败:\x20网格尺寸非法');
  }
  const _0x47b9f0 = {
    'localPath': _0x2b55a2,
    'cols': _0x5e92c5,
    'rows': _0x41756e,
    'ext': String(_0x241a72?.["ext"] || "jpg")["trim"]()["toLowerCase"]() || "jpg",
    'quality': Number(_0x241a72?.['quality'] || 0x55)
  };
  const _0x52864f = String(_0x241a72?.["subDir"] || '')["trim"]();
  if (_0x52864f) {
    _0x47b9f0["subDir"] = _0x52864f;
  }
  const _0x9b3ffe = await a110_0x35bcab('/api/v2/grid_tiles/crop', _0x47b9f0, {
    'provider': "local"
  });
  return _0x9b3ffe;
}
export async function ensureImageDerivativesToServer(_0x4bc857) {
  const _0x3ff72c = String(_0x4bc857?.["localPath"] || _0x4bc857?.["path"] || '')["trim"]();
  if (!_0x3ff72c) {
    throw new Error("生成图片派生文件失败: 缺少 localPath");
  }
  try {
    const _0x72f480 = await a110_0x35bcab("/api/v2/images/derivatives/ensure", {
      'localPath': _0x3ff72c
    }, {
      'provider': "local"
    });
    return _0x72f480;
  } catch (_0x2b6e11) {
    // 后端缺派生图路由（如旧冻结包）时，降级为渲染端 Canvas 生成 + 既有缩略图落盘路由。
    return await _ensureImageDerivativesClientSide(_0x3ff72c);
  }
}
const DERIVATIVE_DISPLAY_MAX_SIDE = 0x640;
const DERIVATIVE_THUMB_MAX_SIDE = 0x180;
async function _encodeDerivativeBlob(_0x3d2b1f, _0x1c9a44) {
  const _0x4e8c02 = Math["min"](0x1, _0x1c9a44 / Math["max"](_0x3d2b1f["width"], _0x3d2b1f["height"]));
  const _0x2f6b51 = Math["max"](0x1, Math["round"](_0x3d2b1f["width"] * _0x4e8c02));
  const _0x51a3c4 = Math["max"](0x1, Math["round"](_0x3d2b1f["height"] * _0x4e8c02));
  const _0x9d4e77 = new OffscreenCanvas(_0x2f6b51, _0x51a3c4);
  _0x9d4e77["getContext"]('2d')["drawImage"](_0x3d2b1f, 0x0, 0x0, _0x2f6b51, _0x51a3c4);
  return await _0x9d4e77["convertToBlob"]({
    'type': 'image/webp',
    'quality': 0.86
  });
}
function _blobToDataUrl(_0x4b7d22) {
  return new Promise((_0x1f6c69, _0x3c1a85) => {
    const _0x2a9e04 = new FileReader();
    _0x2a9e04["onload"] = () => _0x1f6c69(_0x2a9e04["result"]);
    _0x2a9e04["onerror"] = () => _0x3c1a85(new Error('派生图转 data URL 失败'));
    _0x2a9e04["readAsDataURL"](_0x4b7d22);
  });
}
async function _ensureImageDerivativesClientSide(_0x50a91c) {
  const _0x47d15b = await fetch(localPathToUrl(_0x50a91c));
  if (!_0x47d15b["ok"]) {
    throw new Error('读取原图失败: ' + _0x47d15b["status"]);
  }
  const _0x2c9f36 = await _0x47d15b["blob"]();
  const _0x1b5f12 = await createImageBitmap(_0x2c9f36);
  try {
    const _0x38e577 = Date["now"]()["toString"](0x24);
    const _0x54b21d = await _encodeDerivativeBlob(_0x1b5f12, DERIVATIVE_DISPLAY_MAX_SIDE);
    const _0x40d69a = await _encodeDerivativeBlob(_0x1b5f12, DERIVATIVE_THUMB_MAX_SIDE);
    const _0x37c8f2 = await a110_0x35bcab('/api/v2/assets/thumb/save', {
      'assetId': 'aicderiv-' + _0x38e577 + '-d',
      'dataUrl': await _blobToDataUrl(_0x54b21d)
    }, {
      'provider': 'local'
    });
    const _0x1e2d4b = await a110_0x35bcab('/api/v2/assets/thumb/save', {
      'assetId': 'aicderiv-' + _0x38e577 + '-t',
      'dataUrl': await _blobToDataUrl(_0x40d69a)
    }, {
      'provider': 'local'
    });
    if (!_0x37c8f2?.["localPath"] || !_0x1e2d4b?.["localPath"]) {
      throw new Error('派生图落盘失败');
    }
    return {
      'success': !![],
      'localPath': _0x50a91c,
      'originalLocalPath': _0x50a91c,
      'displayLocalPath': _0x37c8f2["localPath"],
      'thumbLocalPath': _0x1e2d4b["localPath"],
      'originalWidth': _0x1b5f12["width"],
      'originalHeight': _0x1b5f12["height"]
    };
  } finally {
    _0x1b5f12["close"]?.();
  }
}
function _localPathToStaticRequestPath(_0x483ce3) {
  const _0x57b4c1 = normalizeLocalPath(_0x483ce3);
  if (!_0x57b4c1) {
    return '';
  }
  return '/' + _0x57b4c1["split"]('/')['map'](encodeURIComponent)["join"]('/');
}
export async function statLocalMediaOnServer(_0x45abbc) {
  const _0x2e96d7 = typeof _0x45abbc === "string" ? _0x45abbc : String(_0x45abbc?.["localPath"] || _0x45abbc?.['path'] || '')["trim"]();
  const _0xcdf4fd = _localPathToStaticRequestPath(_0x2e96d7);
  if (!_0xcdf4fd) {
    return {
      'exists': ![],
      'sizeBytes': 0x0,
      'contentType': '',
      'lastModified': ''
    };
  }
  const _0x562dcb = _readLocalMediaStatCache(_0xcdf4fd);
  if (_0x562dcb !== undefined) {
    return _0x562dcb;
  }
  if (_localMediaStatInflight["has"](_0xcdf4fd)) {
    return await _localMediaStatInflight['get'](_0xcdf4fd);
  }
  const _0x44b53c = requester({
    'url': _0xcdf4fd,
    'method': "HEAD",
    'provider': "local",
    'responseType': "text",
    'allow404Null': !![],
    'returnMeta': !![],
    'timeout': 0x2710
  })["then"](_0x5847df => {
    const _0xaf6a10 = Number(_0x5847df?.["status"] || 0x0);
    const _0x19b172 = _0xaf6a10 >= 0xc8 && _0xaf6a10 < 0x190;
    const _0x344ebe = Number(_0x5847df?.["headers"]?.["get"]?.('content-length') || 0x0);
    return _rememberLocalMediaStat(_0xcdf4fd, {
      'exists': _0x19b172,
      'sizeBytes': _0x19b172 && Number["isSafeInteger"](_0x344ebe) && _0x344ebe >= 0x0 ? _0x344ebe : 0x0,
      'contentType': _0x19b172 ? String(_0x5847df?.["headers"]?.["get"]?.("content-type") || '')["trim"]() : '',
      'lastModified': _0x19b172 ? String(_0x5847df?.["headers"]?.['get']?.("last-modified") || '')['trim']() : ''
    });
  })["catch"](() => {
    return _rememberLocalMediaStat(_0xcdf4fd, {
      'exists': ![],
      'sizeBytes': 0x0,
      'contentType': '',
      'lastModified': ''
    });
  });
  _localMediaStatInflight["set"](_0xcdf4fd, _0x44b53c);
  _0x44b53c["finally"](() => {
    _localMediaStatInflight["get"](_0xcdf4fd) === _0x44b53c && _localMediaStatInflight["delete"](_0xcdf4fd);
  })['catch'](() => {});
  return await _0x44b53c;
}
export async function checkLocalMediaExistsOnServer(_0x1b7589) {
  const _0x35b4b0 = await statLocalMediaOnServer(_0x1b7589);
  return _0x35b4b0['exists'] === !![];
}