function isPlainObject(_0x291fea) {
  return _0x291fea && typeof _0x291fea === 'object' && !Array["isArray"](_0x291fea);
}
export function isInlineImageDataUrl(_0x482ed6) {
  return String(_0x482ed6 || '')["trim"]()["startsWith"]('data:image/');
}
export function isBlobObjectUrl(_0x5d3d3e) {
  return String(_0x5d3d3e || '')["trim"]()['startsWith']("blob:");
}
export function isVolatileMediaUrl(_0x399458) {
  return isBlobObjectUrl(_0x399458);
}
function hasMeaningfulValue(_0x160327) {
  return String(_0x160327 || '')["trim"]()["length"] > 0x0;
}
function isStableUrlFallbackValue(_0x38379d) {
  const _0x4867c0 = String(_0x38379d || '')["trim"]();
  if (!_0x4867c0) {
    return ![];
  }
  if (isInlineImageDataUrl(_0x4867c0)) {
    return ![];
  }
  if (isBlobObjectUrl(_0x4867c0)) {
    return ![];
  }
  return !![];
}
function sanitizeCanvasVisualSnapshot(_0x5350b1) {
  if (!isPlainObject(_0x5350b1)) {
    return null;
  }
  const _0x491304 = String(_0x5350b1["src"] || '')["trim"]();
  if (!isInlineImageDataUrl(_0x491304)) {
    return null;
  }
  return {
    'schemaVersion': Number(_0x5350b1['schemaVersion']) || 0x1,
    'src': _0x491304,
    'width': Math['max'](0x1, Math["round"](Number(_0x5350b1["width"]) || 0x1)),
    'height': Math["max"](0x1, Math["round"](Number(_0x5350b1["height"]) || 0x1)),
    'viewport': isPlainObject(_0x5350b1['viewport']) ? {
      'x': Number['isFinite'](Number(_0x5350b1["viewport"]['x'])) ? Number(_0x5350b1['viewport']['x']) : 0x0,
      'y': Number['isFinite'](Number(_0x5350b1["viewport"]['y'])) ? Number(_0x5350b1["viewport"]['y']) : 0x0,
      'zoom': Number["isFinite"](Number(_0x5350b1["viewport"]["zoom"])) && Number(_0x5350b1["viewport"]["zoom"]) > 0x0 ? Number(_0x5350b1["viewport"]["zoom"]) : 0x1
    } : {
      'x': 0x0,
      'y': 0x0,
      'zoom': 0x1
    },
    'capturedAt': Number(_0x5350b1['capturedAt']) || 0x0,
    'visibleNodeCount': Math['max'](0x0, Math["round"](Number(_0x5350b1['visibleNodeCount']) || 0x0)),
    'mediaNodeCount': Math["max"](0x0, Math["round"](Number(_0x5350b1["mediaNodeCount"]) || 0x0)),
    'readyMediaNodeCount': Math['max'](0x0, Math["round"](Number(_0x5350b1["readyMediaNodeCount"]) || 0x0))
  };
}
const INLINE_THUMBNAIL_FIELDS = Object["freeze"](["thumbUrl", "thumbSrc", 'firstFrameThumbUrl']);
const THUMBNAIL_FALLBACK_FIELDS = Object["freeze"](["localPath", 'src', "imageUrl", "sourceUrl", "videoUrl", 'audioUrl', "firstFrameUrl", "thumbUrl", "firstFrameThumbUrl", 'thumbId', "sourceId"]);
const VOLATILE_MEDIA_URL_FIELDS = Object["freeze"](['thumbUrl', "thumbSrc", "firstFrameThumbUrl", "imageUrl", 'videoUrl', "audioUrl", "src"]);
const CAPTURE_PREVIEW_MEDIA_URL_FIELDS = Object["freeze"](['src', "imageUrl", "url"]);
const CAPTURE_TRANSIENT_FIELDS = Object['freeze'](['capturePreviewUrl', "captureSavePending", "captureSaveError"]);
export function hasStableThumbnailFallback(_0x4fc585) {
  if (!_0x4fc585 || typeof _0x4fc585 !== "object") {
    return ![];
  }
  return THUMBNAIL_FALLBACK_FIELDS["some"](_0x42c4b7 => {
    const _0x4737b2 = _0x4fc585[_0x42c4b7];
    if (!hasMeaningfulValue(_0x4737b2)) {
      return ![];
    }
    if ((_0x42c4b7 === 'thumbUrl' || _0x42c4b7 === "firstFrameThumbUrl") && (isInlineImageDataUrl(_0x4737b2) || isBlobObjectUrl(_0x4737b2))) {
      return ![];
    }
    if (_0x42c4b7 === "src" || _0x42c4b7 === "imageUrl" || _0x42c4b7 === 'sourceUrl' || _0x42c4b7 === "videoUrl" || _0x42c4b7 === "audioUrl" || _0x42c4b7 === 'firstFrameUrl') {
      return isStableUrlFallbackValue(_0x4737b2);
    }
    return !![];
  });
}
function sanitizeInlineThumbnailFieldsInPlace(_0x31d292) {
  if (!_0x31d292 || typeof _0x31d292 !== "object") {
    return;
  }
  if (!hasStableThumbnailFallback(_0x31d292)) {
    return;
  }
  for (const _0xeb3d0a of INLINE_THUMBNAIL_FIELDS) {
    isInlineImageDataUrl(_0x31d292[_0xeb3d0a]) && delete _0x31d292[_0xeb3d0a];
  }
}
function sanitizeVolatileMediaUrlFieldsInPlace(_0x2e2efe) {
  if (!_0x2e2efe || typeof _0x2e2efe !== "object") {
    return;
  }
  if (!hasStableThumbnailFallback(_0x2e2efe)) {
    return;
  }
  for (const _0x5ed4f7 of VOLATILE_MEDIA_URL_FIELDS) {
    isVolatileMediaUrl(_0x2e2efe[_0x5ed4f7]) && delete _0x2e2efe[_0x5ed4f7];
  }
}
function sanitizeCapturePreviewMediaUrlFieldsInPlace(_0x2a3586) {
  if (!_0x2a3586 || typeof _0x2a3586 !== 'object') {
    return;
  }
  if (!isInlineImageDataUrl(_0x2a3586["capturePreviewUrl"]) && _0x2a3586["captureSavePending"] !== !![]) {
    return;
  }
  for (const _0x553da2 of CAPTURE_PREVIEW_MEDIA_URL_FIELDS) {
    isInlineImageDataUrl(_0x2a3586[_0x553da2]) && delete _0x2a3586[_0x553da2];
  }
}
function sanitizeRecordForPersistence(_0x402b7b) {
  if (Array["isArray"](_0x402b7b)) {
    return _0x402b7b["map"](_0xd63411 => sanitizeRecordForPersistence(_0xd63411));
  }
  if (!isPlainObject(_0x402b7b)) {
    return _0x402b7b;
  }
  const _0x3294ae = {
    ..._0x402b7b
  };
  sanitizeInlineThumbnailFieldsInPlace(_0x3294ae);
  sanitizeVolatileMediaUrlFieldsInPlace(_0x3294ae);
  Array['isArray'](_0x3294ae['nodes']) && (_0x3294ae["nodes"] = _0x3294ae["nodes"]['map'](_0x5e3b86 => sanitizeNodeForPersistence(_0x5e3b86)));
  Array["isArray"](_0x3294ae['items']) && (_0x3294ae["items"] = _0x3294ae["items"]["map"](_0xa42dfb => sanitizeRecordForPersistence(_0xa42dfb)));
  Array["isArray"](_0x3294ae["edges"]) && (_0x3294ae['edges'] = _0x3294ae['edges']["map"](_0xe70fda => isPlainObject(_0xe70fda) ? {
    ..._0xe70fda
  } : _0xe70fda));
  isPlainObject(_0x3294ae["nodeData"]) && (_0x3294ae['nodeData'] = sanitizeNodeForPersistence(_0x3294ae["nodeData"]));
  for (const [_0xa32229, _0x497b88] of Object["entries"](_0x3294ae)) {
    if (_0xa32229 === "nodes" || _0xa32229 === "items" || _0xa32229 === "edges" || _0xa32229 === 'nodeData') {
      continue;
    }
    if (Array['isArray'](_0x497b88)) {
      _0x3294ae[_0xa32229] = _0x497b88["map"](_0xcad8ac => sanitizeRecordForPersistence(_0xcad8ac));
      continue;
    }
    isPlainObject(_0x497b88) && (_0x3294ae[_0xa32229] = sanitizeRecordForPersistence(_0x497b88));
  }
  return _0x3294ae;
}
export function sanitizeNodeForPersistence(_0x3531a7) {
  if (!isPlainObject(_0x3531a7)) {
    return _0x3531a7;
  }
  const _0x2ab054 = {
    ..._0x3531a7
  };
  sanitizeInlineThumbnailFieldsInPlace(_0x2ab054);
  sanitizeVolatileMediaUrlFieldsInPlace(_0x2ab054);
  sanitizeCapturePreviewMediaUrlFieldsInPlace(_0x2ab054);
  delete _0x2ab054["dreaminaTaskLastRaw"];
  for (const _0x190fbc of CAPTURE_TRANSIENT_FIELDS) {
    delete _0x2ab054[_0x190fbc];
  }
  Array["isArray"](_0x2ab054["images"]) && (_0x2ab054["images"] = _0x2ab054["images"]['map'](_0x216c08 => sanitizeRecordForPersistence(_0x216c08)));
  Array["isArray"](_0x2ab054['videos']) && (_0x2ab054["videos"] = _0x2ab054['videos']["map"](_0x5e7f78 => sanitizeRecordForPersistence(_0x5e7f78)));
  Array["isArray"](_0x2ab054["cells"]) && (_0x2ab054['cells'] = _0x2ab054["cells"]["map"](_0x53e4c4 => sanitizeRecordForPersistence(_0x53e4c4)));
  return _0x2ab054;
}
export function sanitizeSerializedCanvasData(_0x51caba) {
  if (!isPlainObject(_0x51caba)) {
    return _0x51caba;
  }
  const _0x4d2239 = {
    ..._0x51caba
  };
  delete _0x4d2239["_persistRevHint"];
  delete _0x4d2239["_contentPersistRevHint"];
  const _0x4b5e79 = sanitizeCanvasVisualSnapshot(_0x4d2239["visualSnapshot"]);
  _0x4b5e79 ? _0x4d2239['visualSnapshot'] = _0x4b5e79 : delete _0x4d2239["visualSnapshot"];
  if (Array["isArray"](_0x4d2239["nodes"])) {
    _0x4d2239["nodes"] = _0x4d2239["nodes"]["map"](_0x17d415 => sanitizeNodeForPersistence(_0x17d415));
  } else {
    if (isPlainObject(_0x4d2239["nodes"])) {
      const _0x180cb2 = {};
      for (const [_0xda2d6, _0x511c5d] of Object["entries"](_0x4d2239['nodes'])) {
        _0x180cb2[_0xda2d6] = sanitizeNodeForPersistence(_0x511c5d);
      }
      _0x4d2239["nodes"] = _0x180cb2;
    }
  }
  Array["isArray"](_0x4d2239["assets"]) && (_0x4d2239["assets"] = _0x4d2239["assets"]["map"](_0x51119f => sanitizeRecordForPersistence(_0x51119f)));
  Array["isArray"](_0x4d2239["storyboard3dProjects"]) && (_0x4d2239["storyboard3dProjects"] = _0x4d2239["storyboard3dProjects"]["map"](_0x120154 => sanitizeRecordForPersistence(_0x120154)));
  return _0x4d2239;
}
export function sanitizeMultiCanvasDataForPersistence(_0x14f761) {
  if (!isPlainObject(_0x14f761)) {
    return _0x14f761;
  }
  const _0x56a336 = {
    ..._0x14f761
  };
  if (!Array["isArray"](_0x56a336["canvases"])) {
    return _0x56a336;
  }
  _0x56a336["canvases"] = _0x56a336["canvases"]["map"](_0x306c85 => {
    if (!isPlainObject(_0x306c85)) {
      return _0x306c85;
    }
    return sanitizeSerializedCanvasData(_0x306c85);
  });
  return _0x56a336;
}