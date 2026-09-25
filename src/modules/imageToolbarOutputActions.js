import { buildCanvasLocalImageFields } from '../services/canvasMediaLocalService.js';
import { buildImageNodeStorageFields } from '../services/imageDerivativeService.js';
import { saveRemoteImageLocallyDetailed } from './project.js';
export function buildToolbarImageFields({
  localPath = '',
  resultUrl = '',
  thumbUrl = '',
  includeSrc = ![]
}) {
  const _0x2a339b = {
    'localPath': localPath,
    'imageUrl': resultUrl,
    'sourceUrl': resultUrl,
    'thumbUrl': thumbUrl
  };
  if (includeSrc) {
    _0x2a339b["src"] = thumbUrl || resultUrl;
  }
  return buildCanvasLocalImageFields(_0x2a339b, {
    'includeSrc': includeSrc
  });
}
export async function saveRemoteImageResultLocally(_0x15a1b2, _0x2321c8 = {}) {
  const _0x30f759 = _0x2321c8["projectId"] || "default_v2_project";
  const _0x2dc773 = await saveRemoteImageLocallyDetailed(_0x15a1b2, _0x30f759, _0x2321c8);
  const _0x10281c = {
    ...buildImageNodeStorageFields(_0x2dc773),
    ...buildCanvasLocalImageFields(_0x2dc773, {
      'includeSrc': _0x2321c8["includeSrc"]
    })
  };
  return {
    'localPath': _0x10281c["localPath"] || '',
    'thumbUrl': _0x10281c["thumbUrl"] || _0x10281c["imageUrl"] || '',
    'fields': _0x10281c
  };
}
export async function saveOutputImageResult(_0x3754b0, _0x590f0c = {}) {
  const _0x5c45b9 = _0x590f0c['resumedImage'] || null;
  if (_0x5c45b9) {
    const _0x188617 = buildCanvasLocalImageFields(_0x5c45b9, {
      'includeSrc': _0x590f0c["includeSrc"] ?? !![]
    });
    const _0x289aa7 = String(_0x188617["localPath"] || '')["trim"]();
    const _0x1f2859 = String(_0x188617["thumbUrl"] || _0x188617['imageUrl'] || _0x188617['src'] || '')['trim']();
    return {
      'localPath': _0x289aa7,
      'thumbUrl': _0x1f2859,
      'fields': _0x188617
    };
  }
  const {
    resumedImage: _0x4d011f,
    includeSrc: _0x10316f,
    ..._0x4d513b
  } = _0x590f0c;
  return await saveRemoteImageResultLocally(_0x3754b0, {
    ..._0x4d513b,
    'ext': _0x590f0c["ext"] || 'png',
    'includeSrc': _0x10316f ?? !![],
    'dedupeKey': _0x590f0c['dedupeKey'] || (_0x590f0c['taskKey'] ? _0x590f0c["taskKey"] + ':' + _0x3754b0 : undefined)
  });
}