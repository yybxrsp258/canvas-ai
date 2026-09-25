import { getCanvasMediaSchedulerStats } from '../modules/canvasMediaScheduler.js';
import { getPerfProbeSnapshot } from '../modules/perf/perfProbe.js';
import { getDiagnosticOperationsSnapshot } from './operationDiagnostics.js';
const REPORT_SCHEMA_VERSION = 0x1;
const MAX_DIAGNOSTIC_NODES = 0xc;
const MAX_LIST_ITEMS = 0x6;
const MAX_DOM_MEDIA = 0x8;
function toText(_0x25c930) {
  return String(_0x25c930 || '')["trim"]();
}
function toNumber(_0x2378e1, _0xd439c5 = 0x0) {
  const _0x5a9c39 = Number(_0x2378e1);
  return Number["isFinite"](_0x5a9c39) ? _0x5a9c39 : _0xd439c5;
}
function normalizeIndex(_0x455ab5, _0x30af64 = Infinity) {
  const _0x27e81d = Math["max"](0x0, Math["trunc"](toNumber(_0x455ab5, 0x0)));
  if (!Number['isFinite'](_0x30af64)) {
    return _0x27e81d;
  }
  return Math["min"](Math["max"](0x0, _0x30af64 - 0x1), _0x27e81d);
}
function hashText(_0x492a09) {
  const _0x44d886 = toText(_0x492a09);
  let _0x54963e = 0x811c9dc5;
  for (let _0x1500a8 = 0x0; _0x1500a8 < _0x44d886["length"]; _0x1500a8 += 0x1) {
    _0x54963e ^= _0x44d886["charCodeAt"](_0x1500a8);
    _0x54963e = Math['imul'](_0x54963e, 0x1000193);
  }
  return (_0x54963e >>> 0x0)["toString"](0x24);
}
function normalizeComparableRef(_0x1bdb29) {
  let _0x18c8b1 = toText(_0x1bdb29)["replace"](/\\/g, '/');
  if (!_0x18c8b1) {
    return '';
  }
  try {
    _0x18c8b1 = decodeURIComponent(_0x18c8b1);
  } catch {}
  _0x18c8b1 = _0x18c8b1["split"]('#')[0x0]["split"]('?')[0x0]["replace"](/\\/g, '/')["toLowerCase"]();
  _0x18c8b1 = _0x18c8b1["replace"](/^https?:\/\/[^/]+\//, '');
  _0x18c8b1 = _0x18c8b1['replace'](/^file:\/\/\/?/, '');
  _0x18c8b1 = _0x18c8b1["replace"](/^\/+/, '');
  return _0x18c8b1;
}
function getRefKind(_0x1fa5ce) {
  const _0x43a178 = toText(_0x1fa5ce);
  if (!_0x43a178) {
    return "empty";
  }
  if (/^data:/i['test'](_0x43a178)) {
    return 'data';
  }
  if (/^blob:/i["test"](_0x43a178)) {
    return "blob";
  }
  if (/^aic-local-preview:/i["test"](_0x43a178)) {
    return "localPreview";
  }
  if (/^https?:/i["test"](_0x43a178)) {
    return "remote";
  }
  if (/^file:/i["test"](_0x43a178)) {
    return "file";
  }
  return 'local';
}
function getRefExtension(_0x5bec5b) {
  const _0x38e335 = normalizeComparableRef(_0x5bec5b);
  const _0x872dde = _0x38e335["match"](/\.([a-z0-9]{1,8})$/i);
  return _0x872dde ? '.' + _0x872dde[0x1]['toLowerCase']() : '';
}
function sanitizeMediaRef(_0x4e6a1c) {
  const _0x542711 = toText(_0x4e6a1c);
  if (!_0x542711) {
    return {
      'present': ![]
    };
  }
  const _0x32041f = getRefExtension(_0x542711);
  return {
    'present': !![],
    'kind': getRefKind(_0x542711),
    'ext': _0x32041f,
    'hash': hashText(normalizeComparableRef(_0x542711) || _0x542711),
    'isImage': /\.(?:png|jpe?g|webp|gif|avif|bmp)$/i["test"](_0x32041f),
    'isVideo': /\.(?:mp4|mov|webm|m4v|avi|mkv)$/i["test"](_0x32041f),
    'length': _0x542711["length"]
  };
}
function getPrimaryListItem(_0x5e5e59, _0x2f8573 = 0x0) {
  if (!Array['isArray'](_0x5e5e59) || _0x5e5e59["length"] === 0x0) {
    return null;
  }
  const _0x329bee = normalizeIndex(_0x2f8573, _0x5e5e59['length']);
  return _0x5e5e59[_0x329bee] || _0x5e5e59[0x0] || null;
}
function pushCandidate(_0x4639cc, _0x429606, _0x1e1cbf) {
  const _0x4f6cf4 = toText(_0x1e1cbf);
  if (!_0x4f6cf4) {
    return;
  }
  const _0x50289d = normalizeComparableRef(_0x4f6cf4);
  _0x4639cc['push']({
    'label': _0x429606,
    'comparable': _0x50289d,
    'ref': sanitizeMediaRef(_0x4f6cf4)
  });
}
function collectVideoPosterCandidates(_0x228cac = {}) {
  const _0x9142dc = Array["isArray"](_0x228cac['videos']) ? _0x228cac['videos'] : [];
  const _0x36bf7f = normalizeIndex(_0x228cac["mainVideoIndex"], _0x9142dc["length"] || 0x1);
  const _0xe416a4 = getPrimaryListItem(_0x9142dc, _0x36bf7f);
  const _0x2dff5a = [];
  const _0x5b6b68 = (_0x4ca471, _0x55d0d4) => {
    if (!_0x4ca471 || typeof _0x4ca471 !== "object") {
      return;
    }
    pushCandidate(_0x2dff5a, _0x55d0d4 + ".posterLocalPath", _0x4ca471["posterLocalPath"]);
    pushCandidate(_0x2dff5a, _0x55d0d4 + ".thumbLocalPath", _0x4ca471["thumbLocalPath"]);
    pushCandidate(_0x2dff5a, _0x55d0d4 + ".previewLocalPath", _0x4ca471["previewLocalPath"]);
    pushCandidate(_0x2dff5a, _0x55d0d4 + '.thumbnailLocalPath', _0x4ca471["thumbnailLocalPath"]);
    pushCandidate(_0x2dff5a, _0x55d0d4 + ".posterUrl", _0x4ca471['posterUrl']);
    pushCandidate(_0x2dff5a, _0x55d0d4 + ".thumbUrl", _0x4ca471['thumbUrl']);
    pushCandidate(_0x2dff5a, _0x55d0d4 + ".previewUrl", _0x4ca471["previewUrl"]);
    pushCandidate(_0x2dff5a, _0x55d0d4 + ".thumbnailUrl", _0x4ca471["thumbnailUrl"]);
  };
  if (_0xe416a4) {
    _0x5b6b68(_0xe416a4, "videos[" + _0x36bf7f + ']');
  }
  _0x5b6b68(_0x228cac, 'node');
  _0x9142dc['slice'](0x0, MAX_LIST_ITEMS)['forEach']((_0x1e985f, _0x339e2e) => {
    if (_0x339e2e === _0x36bf7f) {
      return;
    }
    _0x5b6b68(_0x1e985f, "videos[" + _0x339e2e + ']');
  });
  return _0x2dff5a;
}
function collectVideoSourceCandidates(_0x48d7e1 = {}) {
  const _0xfb96b2 = Array["isArray"](_0x48d7e1["videos"]) ? _0x48d7e1["videos"] : [];
  const _0x1aed40 = normalizeIndex(_0x48d7e1["mainVideoIndex"], _0xfb96b2["length"] || 0x1);
  const _0x3ddff = getPrimaryListItem(_0xfb96b2, _0x1aed40);
  const _0x4150b9 = [];
  const _0x418665 = (_0x179f3d, _0x377d8e) => {
    if (!_0x179f3d || typeof _0x179f3d !== 'object') {
      return;
    }
    pushCandidate(_0x4150b9, _0x377d8e + ".displayLocalPath", _0x179f3d["displayLocalPath"]);
    pushCandidate(_0x4150b9, _0x377d8e + ".localPath", _0x179f3d["localPath"]);
    pushCandidate(_0x4150b9, _0x377d8e + ".videoLocalPath", _0x179f3d['videoLocalPath']);
    pushCandidate(_0x4150b9, _0x377d8e + ".videoUrl", _0x179f3d['videoUrl']);
    pushCandidate(_0x4150b9, _0x377d8e + ".src", _0x179f3d["src"]);
    pushCandidate(_0x4150b9, _0x377d8e + '.url', _0x179f3d["url"]);
    pushCandidate(_0x4150b9, _0x377d8e + ".resultUrl", _0x179f3d['resultUrl']);
  };
  if (_0x3ddff) {
    _0x418665(_0x3ddff, "videos[" + _0x1aed40 + ']');
  }
  _0x418665(_0x48d7e1, 'node');
  _0xfb96b2["slice"](0x0, MAX_LIST_ITEMS)['forEach']((_0x1c4761, _0x1a2afb) => {
    if (_0x1a2afb === _0x1aed40) {
      return;
    }
    _0x418665(_0x1c4761, "videos[" + _0x1a2afb + ']');
  });
  return _0x4150b9;
}
function matchCandidateLabels(_0x4e66e5, _0x1ac2bb = []) {
  const _0x2ad85a = normalizeComparableRef(_0x4e66e5);
  if (!_0x2ad85a) {
    return [];
  }
  const _0x24c22e = [];
  for (const _0x301535 of _0x1ac2bb) {
    _0x301535["comparable"] && _0x301535["comparable"] === _0x2ad85a && _0x24c22e['push'](_0x301535["label"]);
  }
  return _0x24c22e;
}
function getElementSrc(_0x5512e7) {
  return toText(_0x5512e7?.["currentSrc"] || _0x5512e7?.["src"] || _0x5512e7?.["getAttribute"]?.('src') || _0x5512e7?.["getAttribute"]?.('poster') || '');
}
function getVideoSrc(_0x1611d6) {
  return toText(_0x1611d6?.["currentSrc"] || _0x1611d6?.["src"] || _0x1611d6?.['getAttribute']?.("src") || _0x1611d6?.["querySelector"]?.("source")?.["src"] || _0x1611d6?.['querySelector']?.("source")?.['getAttribute']?.('src') || '');
}
function escapeAttr(_0x36f0ae) {
  return String(_0x36f0ae || '')["replace"](/\\/g, '\x5c\x5c')["replace"](/"/g, '\x5c\x22');
}
function queryNodeDom(_0x1fab1d, _0x3a01c5) {
  if (!_0x1fab1d || !_0x3a01c5) {
    return {};
  }
  const _0x331d5b = escapeAttr(_0x3a01c5);
  const _0x58265f = _0x1fab1d["getElementById"]?.(_0x3a01c5) || _0x1fab1d["querySelector"]?.(".v2-node[data-node-id=\"" + _0x331d5b + '\x22]') || null;
  const _0x547644 = _0x1fab1d["querySelector"]?.('.v2-fast-preview-node[data-node-id=\x22' + _0x331d5b + '\x22]') || null;
  return {
    'wrapper': _0x58265f,
    'fastPreview': _0x547644
  };
}
function summarizeImageElement(_0x59ca40, _0x4fd28a = []) {
  const _0x2ab344 = getElementSrc(_0x59ca40);
  return {
    'className': toText(_0x59ca40?.['className']),
    'src': {
      ...sanitizeMediaRef(_0x2ab344),
      'matches': matchCandidateLabels(_0x2ab344, _0x4fd28a)
    },
    'complete': _0x59ca40?.['complete'] !== ![],
    'naturalWidth': toNumber(_0x59ca40?.["naturalWidth"] ?? _0x59ca40?.["width"], 0x0),
    'display': toText(_0x59ca40?.["style"]?.["display"]),
    'visibility': toText(_0x59ca40?.["style"]?.['visibility']),
    'opacity': toText(_0x59ca40?.["style"]?.["opacity"])
  };
}
function summarizeVideoElement(_0x5c8586, _0x5c23b2 = [], _0x54ee77 = []) {
  const _0x1907f8 = getVideoSrc(_0x5c8586);
  const _0x224f08 = toText(_0x5c8586?.["poster"] || _0x5c8586?.["getAttribute"]?.("poster"));
  return {
    'src': {
      ...sanitizeMediaRef(_0x1907f8),
      'matches': matchCandidateLabels(_0x1907f8, _0x5c23b2)
    },
    'poster': {
      ...sanitizeMediaRef(_0x224f08),
      'matches': matchCandidateLabels(_0x224f08, _0x54ee77)
    },
    'readyState': toNumber(_0x5c8586?.['readyState'], 0x0),
    'networkState': toNumber(_0x5c8586?.["networkState"], 0x0),
    'mediaErrorCode': toNumber(_0x5c8586?.["error"]?.['code'], 0x0),
    'preload': toText(_0x5c8586?.["preload"] || _0x5c8586?.["getAttribute"]?.("preload")),
    'paused': _0x5c8586?.["paused"] !== ![],
    'display': toText(_0x5c8586?.['style']?.["display"]),
    'visibility': toText(_0x5c8586?.["style"]?.['visibility']),
    'opacity': toText(_0x5c8586?.['style']?.["opacity"])
  };
}
function summarizeNodeData(_0x5b5083 = {}) {
  const _0x1286da = Array["isArray"](_0x5b5083["videos"]) ? _0x5b5083['videos'] : [];
  const _0x8a0ae2 = Array['isArray'](_0x5b5083["images"]) ? _0x5b5083['images'] : [];
  return {
    'id': toText(_0x5b5083['id']),
    'type': toText(_0x5b5083["type"]),
    'selected': ![],
    'geometry': {
      'x': toNumber(_0x5b5083['x'], 0x0),
      'y': toNumber(_0x5b5083['y'], 0x0),
      'width': toNumber(_0x5b5083["width"], 0x0),
      'height': toNumber(_0x5b5083["height"], 0x0)
    },
    'mediaIndexes': {
      'mainVideoIndex': normalizeIndex(_0x5b5083["mainVideoIndex"], _0x1286da["length"] || 0x1),
      'mainImageIndex': normalizeIndex(_0x5b5083['mainImageIndex'], _0x8a0ae2['length'] || 0x1),
      'videosLength': _0x1286da["length"],
      'imagesLength': _0x8a0ae2["length"]
    },
    'taskState': {
      'isGenerating': _0x5b5083["isGenerating"] === !![],
      'jobStatus': toText(_0x5b5083["jobStatus"]),
      'rhTaskStatus': toText(_0x5b5083["rhTaskStatus"]),
      'dreaminaTaskStatus': toText(_0x5b5083['dreaminaTaskStatus']),
      'asyncTaskStatus': toText(_0x5b5083['asyncTaskStatus']),
      'mediaUnavailable': _0x5b5083['mediaUnavailable'] === !![]
    }
  };
}
function summarizeNodeDom(_0x344b0a, _0x55e845) {
  const _0x2c45dd = toText(_0x344b0a?.['id']);
  const {
    wrapper: _0x1056bc,
    fastPreview: _0x10ddb0
  } = queryNodeDom(_0x55e845, _0x2c45dd);
  const _0x3fd386 = collectVideoPosterCandidates(_0x344b0a);
  const _0x168aa1 = collectVideoSourceCandidates(_0x344b0a);
  const _0x1e0f31 = _0x10ddb0?.['querySelector']?.(".v2-fast-preview-media") || _0x10ddb0?.["querySelector"]?.("img") || null;
  const _0x46fa5e = getElementSrc(_0x1e0f31);
  const _0x5e9b09 = _0x1056bc?.["querySelector"]?.(".source-video-poster-frame") || _0x1056bc?.["querySelector"]?.(".ai-video-deferred-poster") || null;
  const _0xee497c = getElementSrc(_0x5e9b09);
  const _0x4e246e = Array["from"](_0x1056bc?.['querySelectorAll']?.("img") || [])["slice"](0x0, MAX_DOM_MEDIA)["map"](_0x3fb129 => summarizeImageElement(_0x3fb129, _0x3fd386));
  const _0x4b79d8 = Array["from"](_0x1056bc?.['querySelectorAll']?.("video") || [])['slice'](0x0, MAX_DOM_MEDIA)['map'](_0x4d1346 => summarizeVideoElement(_0x4d1346, _0x168aa1, _0x3fd386));
  return {
    'mounted': !!_0x1056bc,
    'hasFastPreview': !!_0x10ddb0,
    'detailStage': toText(_0x1056bc?.['dataset']?.["detailStage"]),
    'mediaLod': toText(_0x1056bc?.['dataset']?.["mediaLod"]),
    'className': toText(_0x1056bc?.["className"])['slice'](0x0, 0xf0),
    'actual': {
      'fastPreviewSrc': {
        ...sanitizeMediaRef(_0x46fa5e),
        'matches': matchCandidateLabels(_0x46fa5e, _0x3fd386)
      },
      'posterFrameSrc': {
        ...sanitizeMediaRef(_0xee497c),
        'matches': matchCandidateLabels(_0xee497c, _0x3fd386)
      },
      'imageElements': _0x4e246e,
      'videoElements': _0x4b79d8
    },
    'expected': {
      'posterCandidates': _0x3fd386["slice"](0x0, MAX_LIST_ITEMS)['map'](_0x460c8e => ({
        'label': _0x460c8e["label"],
        'ref': _0x460c8e['ref']
      })),
      'videoSourceCandidates': _0x168aa1['slice'](0x0, MAX_LIST_ITEMS)['map'](_0x5963b1 => ({
        'label': _0x5963b1["label"],
        'ref': _0x5963b1['ref']
      }))
    }
  };
}
function getProblemLayer(_0x331a38) {
  const _0x118d29 = _0x331a38?.["type"] || '';
  if (!_0x118d29["includes"]("video")) {
    return null;
  }
  const _0x2537f8 = _0x331a38['mediaIndexes']?.['mainVideoIndex'] ?? 0x0;
  const _0x2e2877 = "videos[" + _0x2537f8 + ']';
  const _0x54a086 = _0x331a38["dom"]?.["actual"]?.["fastPreviewSrc"]?.["matches"] || [];
  const _0x4dd92d = _0x331a38["dom"]?.["actual"]?.["posterFrameSrc"]?.['matches'] || [];
  const _0x4a1553 = _0x1faabd => _0x1faabd["find"](_0x4ac251 => /^videos\[\d+\]\./["test"](_0x4ac251) && !_0x4ac251['startsWith'](_0x2e2877));
  if (_0x54a086['length'] > 0x0 && !_0x54a086['some'](_0x48b92f => _0x48b92f["startsWith"](_0x2e2877))) {
    return {
      'code': 'fast_preview_poster_mismatch',
      'severity': 'warn',
      'message': "Fast preview poster does not match videos[mainVideoIndex].",
      'likelyLayer': "fastPreviewLayer",
      'evidence': {
        'mainVideoIndex': _0x2537f8,
        'actualFastPreviewMatches': _0x54a086,
        'unexpectedMatch': _0x4a1553(_0x54a086) || ''
      }
    };
  }
  if (_0x4dd92d["length"] > 0x0 && !_0x4dd92d["some"](_0x5f00c3 => _0x5f00c3["startsWith"](_0x2e2877))) {
    return {
      'code': 'poster_frame_mismatch',
      'severity': "warn",
      'message': "Poster frame does not match videos[mainVideoIndex].",
      'likelyLayer': "nodePosterResolver",
      'evidence': {
        'mainVideoIndex': _0x2537f8,
        'actualPosterMatches': _0x4dd92d,
        'unexpectedMatch': _0x4a1553(_0x4dd92d) || ''
      }
    };
  }
  return null;
}
function getDocumentBodyClasses(_0x2afc9b) {
  const _0x590e73 = toText(_0x2afc9b?.["body"]?.["className"]);
  if (_0x590e73) {
    return _0x590e73["split"](/\s+/)["filter"](Boolean)["slice"](0x0, 0x14);
  }
  const _0x162edc = _0x2afc9b?.["body"]?.["classList"];
  if (!_0x162edc || typeof _0x162edc[Symbol['iterator']] !== "function") {
    return [];
  }
  return Array['from'](_0x162edc)["slice"](0x0, 0x14);
}
function collectCandidateNodeIds(_0x5c6833 = {}, _0x3d7454) {
  const _0x3962dd = Array['isArray'](_0x5c6833["selectedNodeIds"]) ? _0x5c6833["selectedNodeIds"] : [];
  const _0x24748d = [];
  const _0x59e8f0 = _0x3068da => {
    const _0x14f0e6 = toText(_0x3068da);
    if (_0x14f0e6 && !_0x24748d["includes"](_0x14f0e6)) {
      _0x24748d['push'](_0x14f0e6);
    }
  };
  _0x3962dd["forEach"](_0x59e8f0);
  for (const _0x338a20 of _0x3d7454?.["querySelectorAll"]?.('#v2-canvas\x20.v2-node,\x20#v2-canvas\x20.v2-fast-preview-node') || []) {
    _0x59e8f0(_0x338a20?.['id'] || _0x338a20?.["dataset"]?.['nodeId']);
    if (_0x24748d["length"] >= MAX_DIAGNOSTIC_NODES) {
      break;
    }
  }
  for (const _0x517f4b of Object["values"](_0x5c6833['nodes'] || {})) {
    const _0x5e8622 = toText(_0x517f4b?.["type"])["toLowerCase"]();
    if (_0x5e8622["includes"]("video") || _0x5e8622["includes"]('image')) {
      _0x59e8f0(_0x517f4b?.['id']);
    }
    if (_0x24748d['length'] >= MAX_DIAGNOSTIC_NODES) {
      break;
    }
  }
  return _0x24748d["slice"](0x0, MAX_DIAGNOSTIC_NODES);
}
function buildAiAnalysis(_0x1006da = []) {
  const _0x4eeca1 = [];
  for (const _0x44e790 of _0x1006da) {
    const _0xcc6db9 = getProblemLayer(_0x44e790);
    _0xcc6db9 && _0x4eeca1["push"]({
      'nodeId': _0x44e790['id'],
      'nodeType': _0x44e790["type"],
      ..._0xcc6db9
    });
    const _0x3246c9 = _0x44e790["dom"]?.['actual']?.["imageElements"] || [];
    const _0x295a0e = _0x44e790["dom"]?.["actual"]?.["videoElements"] || [];
    const _0x4ad5b7 = _0x3246c9["filter"](_0x4474ce => _0x4474ce["src"]["present"] && _0x4474ce["complete"] && _0x4474ce["naturalWidth"] === 0x0)["length"];
    const _0x422f2c = _0x295a0e['map'](_0x3cf7a0 => _0x3cf7a0["mediaErrorCode"])["filter"](Boolean);
    (_0x4ad5b7 || _0x422f2c["length"]) && _0x4eeca1["push"]({
      'nodeId': _0x44e790['id'],
      'nodeType': _0x44e790["type"],
      'code': "media_load_failed",
      'severity': "warn",
      'message': "Mounted media reports an image load or video playback error.",
      'likelyLayer': "mediaLoading",
      'evidence': {
        'brokenImageCount': _0x4ad5b7,
        'mediaErrorCodes': _0x422f2c
      }
    });
  }
  return {
    'detection': "rules",
    'summary': _0x4eeca1["length"] > 0x0 ? "Potential media resolution issues were detected. See findings for the likely layer." : "No supported media issue was detected in the sampled nodes; this does not rule out other failures.",
    'findings': _0x4eeca1,
    'nextChecks': _0x4eeca1["length"] > 0x0 ? ["Compare actualFastPreviewMatches with videos[mainVideoIndex].", 'Check\x20whether\x20top-level\x20node\x20poster\x20fields\x20are\x20stale\x20mirrors\x20of\x20another\x20result.', "For media_load_failed, inspect resource_load_failed events and browser media error codes."] : ["If the user still sees a mismatch, ask them to select the problematic node and generate a new diagnostics package."]
  };
}
export function createAiDiagnosticsReport({
  graphStore = null,
  state = null,
  documentRef = typeof document !== "undefined" ? document : null,
  reason = "settings_diagnostics_package"
} = {}) {
  const _0x229c28 = state || graphStore?.["getStateRaw"]?.() || graphStore?.["getState"]?.() || {};
  const _0x369303 = _0x229c28['nodes'] || {};
  const _0x12c0ea = collectCandidateNodeIds(_0x229c28, documentRef);
  const _0x5ae09d = new Set(Array["isArray"](_0x229c28["selectedNodeIds"]) ? _0x229c28["selectedNodeIds"]["map"](String) : []);
  const _0x578167 = _0x12c0ea["map"](_0x112eaa => _0x369303[_0x112eaa])["filter"](Boolean)["map"](_0x17adc2 => {
    const _0x3b5798 = summarizeNodeData(_0x17adc2);
    _0x3b5798["selected"] = _0x5ae09d['has'](_0x3b5798['id']);
    _0x3b5798["dom"] = summarizeNodeDom(_0x17adc2, documentRef);
    return _0x3b5798;
  });
  const _0x4f0231 = {
    'schemaVersion': REPORT_SCHEMA_VERSION,
    'generatedAt': new Date()['toISOString'](),
    'reason': toText(reason) || "settings_diagnostics_package",
    'privacy': "No project JSON, asset files, prompts, API keys, or raw media paths are included. Media references are represented by kind/ext/hash only.",
    'canvas': {
      'nodeCount': Object["keys"](_0x369303)["length"],
      'edgeCount': Object["keys"](_0x229c28["edges"] || {})["length"],
      'selectedNodeIds': Array["from"](_0x5ae09d)['slice'](0x0, MAX_DIAGNOSTIC_NODES),
      'viewport': {
        'x': toNumber(_0x229c28["viewport"]?.['x'], 0x0),
        'y': toNumber(_0x229c28['viewport']?.['y'], 0x0),
        'zoom': toNumber(_0x229c28["viewport"]?.["zoom"], 0x1)
      },
      'bodyClasses': getDocumentBodyClasses(documentRef),
      'mountedNodeCount': documentRef?.["querySelectorAll"]?.("#v2-canvas .v2-node")?.['length'] || 0x0,
      'fastPreviewCount': documentRef?.["querySelectorAll"]?.("#v2-canvas .v2-fast-preview-node")?.["length"] || 0x0,
      'videoElementCount': documentRef?.["querySelectorAll"]?.("#v2-canvas video")?.['length'] || 0x0
    },
    'mediaScheduler': getCanvasMediaSchedulerStats(),
    'operations': getDiagnosticOperationsSnapshot(),
    'coverage': {
      'sampledNodes': _0x578167["length"],
      'totalNodes': Object['keys'](_0x369303)['length'],
      'maxNodes': MAX_DIAGNOSTIC_NODES,
      'sampledOnly': _0x578167["length"] < Object["keys"](_0x369303)["length"],
      'limitations': ["Current canvas only; selected nodes are sampled first.", "A snapshot cannot prove UI responsiveness or that a save reached disk."]
    },
    'performance': getPerfProbeSnapshot(),
    'nodes': _0x578167
  };
  return {
    ..._0x4f0231,
    'aiAnalysis': buildAiAnalysis(_0x578167)
  };
}