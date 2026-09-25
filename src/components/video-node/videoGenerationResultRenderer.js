import { buildGenerationCollectionResultPatch, firstNonEmptyString, getFirstGenerationResultError, normalizeGenerationResultItems } from '../../core/generationResultRenderer.js';
import { localPathToUrl, normalizeLocalPath, pickResultLocalPath } from '../../utils/localMediaPath.js';
import { t } from '../../i18n/index.js';
const VIDEO_LOCALIZATION_REQUIRED_MESSAGE = "视频已返回，但保存到本地失败";
const VIDEO_GENERATION_MEDIA_CLEAR_PATCH = Object['freeze']({
  'src': '',
  'url': '',
  'sourceUrl': '',
  'resultUrl': '',
  'videoUrl': '',
  'videoLocalPath': '',
  'localPath': '',
  'originalLocalPath': '',
  'displayLocalPath': '',
  'thumbId': '',
  'thumbUrl': '',
  'posterUrl': '',
  'posterLocalPath': '',
  'thumbLocalPath': '',
  'previewUrl': '',
  'previewLocalPath': '',
  'thumbnailUrl': '',
  'thumbnailLocalPath': '',
  'videoThumbSrc': '',
  'videoMetaSrc': '',
  'capturePreviewUrl': '',
  'videoProxyStatus': '',
  'videoProxyVersion': '',
  'pendingVideoProxyLocalPath': '',
  'pendingVideoProxyVersion': '',
  'videoCodec': '',
  'remoteFallbackUrl': '',
  'localSaveError': '',
  'mediaUnavailable': ![],
  'mediaUnavailableSource': '',
  'videoThumbUnavailableSource': ''
});
function videoGenerationResultText(_0xb7af37, _0x2923be = {}) {
  return t("videoGenerationResult." + _0xb7af37, _0x2923be);
}
function asObject(_0x3b1c6a) {
  return _0x3b1c6a && typeof _0x3b1c6a === "object" && !Array["isArray"](_0x3b1c6a) ? _0x3b1c6a : null;
}
function firstLocalPath(..._0x8b3c2a) {
  for (const _0x36fd6b of _0x8b3c2a) {
    const _0x5d90ea = normalizeLocalPath(_0x36fd6b);
    if (_0x5d90ea) {
      return _0x5d90ea;
    }
  }
  return '';
}
function normalizeVideoGenerationResultItem(_0x466241) {
  const _0x5bfca1 = asObject(_0x466241);
  if (!_0x5bfca1) {
    throw new Error("[videoGenerationResult] item must be an object");
  }
  const _0x5c6852 = firstLocalPath(_0x5bfca1["localPath"], _0x5bfca1["originalLocalPath"], _0x5bfca1["displayLocalPath"], _0x5bfca1['videoUrl'], _0x5bfca1['localUrl'], _0x5bfca1['url'], _0x5bfca1["resultUrl"], pickResultLocalPath(_0x5bfca1));
  const _0x33e5f6 = localPathToUrl(_0x5c6852);
  let _0x4afb47 = firstNonEmptyString(_0x5bfca1["error"]);
  !_0x4afb47 && !_0x5c6852 && (_0x4afb47 = firstNonEmptyString(_0x5bfca1["localSaveError"], _0x5bfca1["saveError"], VIDEO_LOCALIZATION_REQUIRED_MESSAGE));
  const _0x467042 = {
    ..._0x5bfca1,
    'outputType': "video",
    'videoUrl': _0x33e5f6,
    'url': _0x33e5f6,
    'src': _0x33e5f6,
    'resultUrl': _0x33e5f6,
    'localUrl': _0x33e5f6,
    'displayUrl': _0x33e5f6,
    'sourceUrl': _0x33e5f6,
    'localPath': _0x5c6852,
    'remoteFallbackUrl': '',
    'localSaveError': '',
    'thumbUrl': localPathToUrl(normalizeLocalPath(_0x5bfca1["thumbLocalPath"] || _0x5bfca1['posterLocalPath'] || _0x5bfca1["thumbUrl"] || _0x5bfca1["posterUrl"])),
    'thumbId': firstNonEmptyString(_0x5bfca1["thumbId"], _0x5bfca1["assetId"]),
    'metadata': _0x5bfca1["metadata"] && typeof _0x5bfca1["metadata"] === "object" ? {
      ..._0x5bfca1["metadata"]
    } : {}
  };
  _0x467042["posterUrl"] = _0x467042["thumbUrl"];
  _0x467042["previewUrl"] = _0x467042['thumbUrl'];
  _0x467042["thumbnailUrl"] = _0x467042["thumbUrl"];
  if (_0x4afb47) {
    _0x467042['error'] = _0x4afb47;
  }
  return _0x467042;
}
function removeMediaFieldPatch(_0x1df68c) {
  if (!_0x1df68c || typeof _0x1df68c !== "object") {
    return _0x1df68c;
  }
  for (const _0x2a1d88 of Object["keys"](VIDEO_GENERATION_MEDIA_CLEAR_PATCH)) {
    delete _0x1df68c[_0x2a1d88];
  }
  return _0x1df68c;
}
export function normalizeVideoGenerationResult(_0x5222c8) {
  const _0x1acba9 = normalizeGenerationResultItems(_0x5222c8, {
    'collectionField': "videos",
    'singleItemFields': ["videoUrl", 'url', "localUrl", "localPath", 'thumbUrl']
  });
  if (_0x1acba9["length"] === 0x0) {
    return {
      'outputType': "video",
      'items': []
    };
  }
  return {
    'outputType': "video",
    'items': _0x1acba9["map"](_0x2c9e96 => normalizeVideoGenerationResultItem(_0x2c9e96))
  };
}
export function getVideoGenerationResultError(_0x4c35d1) {
  const _0x2e205a = _0x4c35d1?.["outputType"] === "video" && Array["isArray"](_0x4c35d1["items"]) ? _0x4c35d1 : normalizeVideoGenerationResult(_0x4c35d1);
  if (getSuccessfulVideoGenerationItems(_0x2e205a)["length"] > 0x0) {
    return '';
  }
  return firstNonEmptyString(_0x2e205a["items"]["find"](_0x3760e0 => _0x3760e0?.["error"])?.["error"], getFirstGenerationResultError(_0x4c35d1, {
    'collectionField': 'videos',
    'singleItemFields': ["videoUrl", "url", "localUrl", 'localPath', "thumbUrl"]
  }));
}
export function getSuccessfulVideoGenerationItems(_0x117d40) {
  const _0x190d24 = _0x117d40?.["outputType"] === "video" && Array["isArray"](_0x117d40["items"]) ? _0x117d40 : normalizeVideoGenerationResult(_0x117d40);
  return _0x190d24["items"]["filter"](_0x47bafb => _0x47bafb && !_0x47bafb["error"]);
}
export function buildVideoGenerationResultPatch(_0x3f416a, {
  startedAt = 0x0,
  duration = null
} = {}) {
  const _0x5bc608 = _0x3f416a?.['outputType'] === "video" && Array['isArray'](_0x3f416a["items"]) ? _0x3f416a : normalizeVideoGenerationResult(_0x3f416a);
  return buildGenerationCollectionResultPatch(_0x5bc608, {
    'collectionField': "videos",
    'mainIndexField': "mainVideoIndex",
    'expandedField': "isVideosExpanded",
    'startedAt': startedAt,
    'duration': duration,
    'buildFirstItemPatch': _0x563013 => ({
      'videoUrl': _0x563013["videoUrl"],
      'localPath': _0x563013['localPath'],
      'displayLocalPath': _0x563013["displayLocalPath"] || '',
      'posterLocalPath': _0x563013["posterLocalPath"] || '',
      'videoProxyStatus': _0x563013["videoProxyStatus"] || '',
      'videoCodec': _0x563013["videoCodec"] || '',
      'remoteFallbackUrl': '',
      'localSaveError': '',
      'thumbId': _0x563013["thumbId"],
      'thumbUrl': _0x563013['thumbUrl']
    }),
    'extraPatch': {
      'rhStatusMessage': null,
      'rhStatusCode': null
    }
  });
}
export function buildVideoGenerationFailurePatch({
  error = '',
  startedAt = 0x0,
  duration = null,
  clearMediaFields = !![]
} = {}) {
  const _0x2363a6 = firstNonEmptyString(error, videoGenerationResultText('failed'));
  const _0x582cf9 = buildGenerationCollectionResultPatch({
    'outputType': "video",
    'items': [{
      'error': _0x2363a6,
      'thumbUrl': '',
      'videoUrl': '',
      'localPath': ''
    }]
  }, {
    'collectionField': 'videos',
    'mainIndexField': "mainVideoIndex",
    'startedAt': startedAt,
    'duration': duration,
    'buildFirstItemPatch': () => ({
      ...VIDEO_GENERATION_MEDIA_CLEAR_PATCH
    })
  });
  return clearMediaFields ? _0x582cf9 : removeMediaFieldPatch(_0x582cf9);
}