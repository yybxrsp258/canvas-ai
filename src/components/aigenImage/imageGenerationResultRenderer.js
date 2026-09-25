import { buildGenerationCollectionResultPatch, firstNonEmptyString, normalizeGenerationResultItems } from '../../core/generationResultRenderer.js';
import { buildImageNodeStorageFields } from '../../services/imageDerivativeService.js';
import { t } from '../../i18n/index.js';
import { localPathToUrl, normalizeLocalPath } from '../../utils/localMediaPath.js';
const IMAGE_LOCALIZATION_REQUIRED_MESSAGE = "图片已返回，但保存到本地失败";
function asObject(_0x303730) {
  return _0x303730 && typeof _0x303730 === "object" && !Array["isArray"](_0x303730) ? _0x303730 : null;
}
function firstString(..._0x4baab4) {
  return firstNonEmptyString(..._0x4baab4);
}
function normalizeLegacyResultItems(_0x4aed60) {
  return normalizeGenerationResultItems(_0x4aed60, {
    'collectionField': "images",
    'singleItemFields': ["sourceUrl", 'imageUrl', "thumbUrl", "localPath", 'remoteFallbackUrl']
  });
}
function normalizeImageResultItem(_0x100960) {
  const _0x11502f = asObject(_0x100960);
  if (!_0x11502f) {
    throw new Error("[imageGenerationResult] item must be an object");
  }
  const _0x943de2 = buildImageNodeStorageFields(_0x11502f);
  const _0x3eb1c9 = normalizeLocalPath(_0x943de2["localPath"] || _0x943de2["originalLocalPath"] || _0x943de2['displayLocalPath'] || _0x11502f["localPath"] || _0x11502f["originalLocalPath"] || _0x11502f["displayLocalPath"] || _0x11502f["imageUrl"] || _0x11502f["url"] || _0x11502f['sourceUrl']);
  const _0x4b4e98 = normalizeLocalPath(_0x943de2['originalLocalPath'] || _0x11502f['originalLocalPath'] || _0x3eb1c9);
  const _0x1f911f = normalizeLocalPath(_0x943de2["displayLocalPath"] || _0x11502f['displayLocalPath'] || _0x3eb1c9);
  const _0x358d34 = normalizeLocalPath(_0x943de2['thumbLocalPath'] || _0x11502f["thumbLocalPath"] || _0x11502f["thumbUrl"]);
  const _0x48fac0 = localPathToUrl(_0x4b4e98 || _0x3eb1c9);
  const _0x5310b1 = localPathToUrl(_0x1f911f || _0x3eb1c9);
  const _0x35240d = localPathToUrl(_0x358d34) || _0x5310b1;
  let _0x517a11 = firstString(_0x11502f['error']);
  !_0x517a11 && !_0x3eb1c9 && (_0x517a11 = firstString(_0x11502f['localSaveError'], IMAGE_LOCALIZATION_REQUIRED_MESSAGE));
  const _0x310e20 = {
    ..._0x11502f,
    ..._0x943de2,
    'outputType': "image",
    'url': _0x5310b1,
    'src': _0x5310b1,
    'resultUrl': _0x5310b1,
    'localUrl': _0x5310b1,
    'displayUrl': _0x5310b1,
    'sourceUrl': _0x48fac0,
    'imageUrl': _0x5310b1,
    'thumbUrl': _0x35240d,
    'remoteFallbackUrl': '',
    'localSaveError': '',
    'localPath': _0x3eb1c9,
    'originalLocalPath': _0x4b4e98,
    'displayLocalPath': _0x1f911f,
    'thumbLocalPath': _0x358d34,
    'metadata': _0x11502f["metadata"] && typeof _0x11502f['metadata'] === "object" ? {
      ..._0x11502f['metadata']
    } : {}
  };
  if (_0x517a11) {
    _0x310e20['error'] = _0x517a11;
  }
  return _0x310e20;
}
function removeMediaFieldPatch(_0x4c2005) {
  if (!_0x4c2005 || typeof _0x4c2005 !== "object") {
    return _0x4c2005;
  }
  for (const _0x5c6fa1 of ["imageUrl", "sourceUrl", "thumbUrl", "sourceId", "thumbId", "localPath", "originalLocalPath", "displayLocalPath", "thumbLocalPath", "remoteFallbackUrl", 'localSaveError', 'originalWidth', "originalHeight"]) {
    delete _0x4c2005[_0x5c6fa1];
  }
  return _0x4c2005;
}
export function normalizeImageGenerationResult(_0x90c45b) {
  const _0xa0871d = normalizeLegacyResultItems(_0x90c45b);
  if (_0xa0871d["length"] === 0x0) {
    return {
      'outputType': "image",
      'items': []
    };
  }
  return {
    'outputType': "image",
    'items': _0xa0871d["map"](_0x4ca98b => normalizeImageResultItem(_0x4ca98b))
  };
}
export function getImageGenerationResultError(_0x1003c3) {
  const _0x5734c0 = normalizeImageGenerationResult(_0x1003c3);
  const _0x167fba = getSuccessfulImageGenerationItems(_0x5734c0);
  if (_0x167fba["length"] > 0x0) {
    return '';
  }
  const _0xddbe86 = _0x5734c0['items']["find"](_0x179e26 => _0x179e26?.["error"])?.["error"];
  return String(_0xddbe86 || '')['trim']();
}
export function getSuccessfulImageGenerationItems(_0xd93515) {
  const _0x584425 = _0xd93515?.["outputType"] === 'image' && Array["isArray"](_0xd93515["items"]) ? _0xd93515 : normalizeImageGenerationResult(_0xd93515);
  return _0x584425["items"]["filter"](_0x181d8c => _0x181d8c && !_0x181d8c['error']);
}
export function buildImageGenerationResultPatch(_0x14a193, {
  startedAt = 0x0,
  duration = null
} = {}) {
  const _0x35b307 = _0x14a193?.['outputType'] === "image" && Array['isArray'](_0x14a193["items"]) ? _0x14a193 : normalizeImageGenerationResult(_0x14a193);
  return buildGenerationCollectionResultPatch(_0x35b307, {
    'collectionField': "images",
    'mainIndexField': "mainImageIndex",
    'expandedField': 'isImagesExpanded',
    'startedAt': startedAt,
    'selectMainIndex': _0xd1a083 => {
      const _0x46dd32 = _0xd1a083["findIndex"](_0x3792c4 => _0x3792c4 && !_0x3792c4["error"]);
      return _0x46dd32 >= 0x0 ? _0x46dd32 : 0x0;
    },
    'buildFirstItemPatch': _0x4b0476 => ({
      'imageUrl': _0x4b0476["imageUrl"],
      'sourceUrl': _0x4b0476['sourceUrl'],
      'thumbUrl': _0x4b0476['thumbUrl'],
      'sourceId': _0x4b0476["sourceId"],
      'thumbId': _0x4b0476["thumbId"],
      'remoteFallbackUrl': '',
      'localSaveError': '',
      ...buildImageNodeStorageFields(_0x4b0476)
    }),
    'duration': duration,
    'extraPatch': {
      'rhStatusMessage': null,
      'rhStatusCode': null
    }
  });
}
export function buildImageGenerationFailurePatch({
  error = '',
  startedAt = 0x0,
  duration = null,
  clearMediaFields = !![]
} = {}) {
  const _0x41e3bd = firstString(error, t("aigenImage.result.generationFailed"));
  const _0x103811 = buildImageGenerationResultPatch({
    'error': _0x41e3bd,
    'thumbUrl': '',
    'imageUrl': ''
  }, {
    'startedAt': startedAt,
    'duration': duration
  });
  return clearMediaFields ? _0x103811 : removeMediaFieldPatch(_0x103811);
}