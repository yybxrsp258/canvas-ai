import { buildApiUrl } from './apiBase.js';
import { post as a53_0x7e1460, get as a53_0x96749e } from './requester.js';
import { isCustomProviderAssetUploadProvider, isReusableCustomProviderAssetUrl, uploadToCustomProviderAsset } from './customProviderAssetUploadApi.js';
import { createRunningHubMediaUploadApiKeyMissingError } from './mediaUploadErrors.js';
import { isConfiguredObjectStorageEnabled, isConfiguredObjectStoragePublicUrl, OBJECT_STORAGE_UPLOAD_PROVIDER, uploadPublicMediaToConfiguredObjectStorage } from './objectStorageApi.js';
import { getRunningHubUploadErrorMessage, getRunningHubUploadUrl, hasRunningHubUploadFailureCode } from './runningHubUploadResponse.js';
function resolveObjectStorageKindForAudioSource(_0x262ba8) {
  const _0x5114a2 = String(_0x262ba8?.["type"] || '')["trim"]()["toLowerCase"]()["split"]('/', 0x1)[0x0];
  return _0x5114a2 === "video" ? "video" : "audio";
}
export async function uploadAudioToRunningHub(_0x441006, _0x96f190, _0x4e838e = {}) {
  if (isConfiguredObjectStorageEnabled()) {
    return await uploadPublicMediaToConfiguredObjectStorage(resolveObjectStorageKindForAudioSource(_0x441006), _0x441006, _0x4e838e);
  }
  if (!_0x96f190) {
    throw createRunningHubMediaUploadApiKeyMissingError("audio");
  }
  if (!_0x441006) {
    throw new Error("音频文件不能为空");
  }
  const _0xdef05a = String(_0x4e838e["apiUrl"] || 'https://www.runninghub.cn')["trim"]()["replace"](/\/+$/, '');
  const _0x5e2afb = _0xdef05a + "/openapi/v2/media/upload/binary";
  const _0x2da7bf = buildApiUrl('/api/v2/proxy/upload?apiUrl=' + encodeURIComponent(_0x5e2afb));
  const _0x2b48dd = new FormData();
  const _0x218fed = _0x441006["name"] || _0x4e838e["filename"] || "audio.mp3";
  _0x2b48dd["append"]('file', _0x441006, _0x218fed);
  const _0x4f01af = await a53_0x7e1460(_0x2da7bf, _0x2b48dd, {
    'headers': {
      'Authorization': 'Bearer\x20' + _0x96f190
    },
    'provider': 'runninghub',
    'buildUrl': ![]
  });
  if (hasRunningHubUploadFailureCode(_0x4f01af)) {
    throw new Error("RunningHUB 音频上传失败: " + getRunningHubUploadErrorMessage(_0x4f01af));
  }
  const _0x189ad3 = getRunningHubUploadUrl(_0x4f01af);
  if (!_0x189ad3) {
    throw new Error("RunningHUB 返回的音频URL为空");
  }
  return _0x189ad3;
}
const HTTP_URL_RE = /^https?:\/\//i;
const INLINE_MEDIA_URL_RE = /^(?:blob|data):/i;
function isHttpUrl(_0x5d019b) {
  return HTTP_URL_RE["test"](String(_0x5d019b || ''));
}
function isProviderAssetIdentifier(_0xdda3d0) {
  return /^asset:\/\//i["test"](String(_0xdda3d0 || '')['trim']());
}
function isLocalAudioPath(_0x5085eb) {
  const _0x45ea49 = String(_0x5085eb || '')["trim"]();
  return !!_0x45ea49 && !isHttpUrl(_0x45ea49) && !INLINE_MEDIA_URL_RE["test"](_0x45ea49);
}
function encodeLocalPathSegment(_0x270e6e) {
  if (!_0x270e6e) {
    return '';
  }
  try {
    return encodeURIComponent(decodeURIComponent(_0x270e6e));
  } catch {
    return encodeURIComponent(_0x270e6e);
  }
}
function splitLocalPathQuery(_0x3c231a) {
  const _0x2cb280 = _0x3c231a['indexOf']('?');
  if (_0x2cb280 < 0x0) {
    return {
      'pathname': _0x3c231a,
      'suffix': ''
    };
  }
  return {
    'pathname': _0x3c231a['slice'](0x0, _0x2cb280),
    'suffix': _0x3c231a['slice'](_0x2cb280)
  };
}
function buildInputAudioFetchUrl(_0x569acf) {
  const _0x8d1611 = String(_0x569acf || '')["trim"]();
  if (!isLocalAudioPath(_0x8d1611)) {
    return _0x8d1611;
  }
  const {
    pathname: _0xa6e32,
    suffix: _0x7aac0e
  } = splitLocalPathQuery(_0x8d1611);
  const _0x434d6b = _0xa6e32["startsWith"]('/') ? _0xa6e32 : '/' + _0xa6e32;
  const _0x41ce8d = _0x434d6b["split"]('/')["map"]((_0x3be676, _0x5d3162) => _0x5d3162 === 0x0 ? '' : encodeLocalPathSegment(_0x3be676))['join']('/');
  return buildApiUrl('' + _0x41ce8d + _0x7aac0e);
}
function getErrorStatus(_0xb7088a) {
  const _0x4b889b = _0xb7088a?.["status"] ?? _0xb7088a?.["statusCode"] ?? _0xb7088a?.["httpStatus"];
  const _0x2f53ff = Number(_0x4b889b);
  return Number["isFinite"](_0x2f53ff) ? _0x2f53ff : 0x0;
}
function isNotFoundAudioFetchError(_0x161b7f) {
  const _0x177ea1 = String(_0x161b7f?.['message'] || _0x161b7f || '');
  return getErrorStatus(_0x161b7f) === 0x194 || /\b404\b/["test"](_0x177ea1) || /File not found/i["test"](_0x177ea1);
}
function wrapInputAudioFetchError(_0x2bb7e7, _0x4e27ff, _0x76c6a4, _0x24c644) {
  if (!isLocalAudioPath(_0x76c6a4) || !isNotFoundAudioFetchError(_0x2bb7e7)) {
    return _0x2bb7e7;
  }
  const _0x4014d4 = new Error('第\x20' + (_0x4e27ff + 0x1) + '\x20个参考音频本地文件不存在或无法访问，请重新选择或重新上传该音频：' + _0x76c6a4);
  _0x4014d4['name'] = "InputAudioFetchError";
  _0x4014d4["status"] = 0x194;
  _0x4014d4['fetchUrl'] = _0x24c644;
  _0x4014d4["cause"] = _0x2bb7e7;
  return _0x4014d4;
}
async function fetchInputAudioBlob(_0x21c7a2, _0x49f295) {
  const _0x375321 = buildInputAudioFetchUrl(_0x21c7a2);
  try {
    return await a53_0x96749e(_0x375321, {
      'provider': "remote",
      'buildUrl': ![],
      'responseType': "blob"
    });
  } catch (_0x159dd2) {
    throw wrapInputAudioFetchError(_0x159dd2, _0x49f295, _0x21c7a2, _0x375321);
  }
}
function guessAudioExtension(_0x22ee11, _0x181346 = "mp3") {
  try {
    const _0x387fb0 = String(_0x22ee11 || '');
    const _0x3eb300 = new URL(isHttpUrl(_0x387fb0) ? _0x387fb0 : buildInputAudioFetchUrl(_0x387fb0), "https://local.invalid");
    const _0x3b5739 = String(_0x3eb300["pathname"] || '')['split']('/')["pop"]() || '';
    const _0x139ff6 = _0x3b5739["includes"]('.') ? _0x3b5739['split']('.')["pop"]()["toLowerCase"]() : '';
    if (/^(mp3|wav|m4a|aac|ogg|flac|webm|mp4)$/["test"](_0x139ff6)) {
      return _0x139ff6;
    }
  } catch {}
  return _0x181346;
}
function isReusableRunningHubMediaUrl(_0x2804ae, _0x394a14 = '') {
  try {
    const _0x47c5ce = new URL(String(_0x2804ae || '')["trim"]())["hostname"];
    const _0x1d4db4 = new URL(String(_0x394a14 || "https://www.runninghub.cn")["trim"]())["hostname"];
    return _0x47c5ce === _0x1d4db4;
  } catch {
    return ![];
  }
}
async function processInputAudiosOrdered(_0x2a66e2, _0x1f13f8, _0x31b29b = {}) {
  if (!_0x2a66e2 || _0x2a66e2['length'] === 0x0) {
    return [];
  }
  const _0x1b1d46 = String(_0x31b29b['provider'] || "runninghub")['trim']()['toLowerCase']();
  const _0x3e9712 = _0x31b29b["forceProviderUpload"] === !![];
  const _0x148427 = isConfiguredObjectStorageEnabled() && !_0x3e9712;
  const _0x5a1bb0 = _0x31b29b['strictUpload'] === !![];
  const _0x55ba92 = Number(_0x31b29b["maxBytes"]);
  const _0x18d38b = Number['isFinite'](_0x55ba92) && _0x55ba92 > 0x0;
  const _0x57c225 = new Array(_0x2a66e2["length"])['fill']('');
  for (let _0x5045a6 = 0x0; _0x5045a6 < _0x2a66e2["length"]; _0x5045a6++) {
    const _0x257b25 = String(_0x2a66e2[_0x5045a6] || '')["trim"]();
    if (!_0x257b25) {
      continue;
    }
    try {
      if (isProviderAssetIdentifier(_0x257b25)) {
        _0x57c225[_0x5045a6] = _0x257b25;
        continue;
      }
      if (!_0x3e9712 && isConfiguredObjectStoragePublicUrl(_0x257b25)) {
        _0x57c225[_0x5045a6] = _0x257b25;
        continue;
      }
      if (!_0x148427 && _0x1b1d46 === "apimart") {
        throw new Error("APIMART 不提供音频上传，请使用 RunningHub 上传或启用对象存储");
      }
      if (!_0x148427 && isCustomProviderAssetUploadProvider(_0x1b1d46) && isReusableCustomProviderAssetUrl(_0x257b25, _0x31b29b["apiUrl"])) {
        _0x57c225[_0x5045a6] = _0x257b25;
        continue;
      }
      if (!_0x148427 && _0x1b1d46 === 'runninghub' && isReusableRunningHubMediaUrl(_0x257b25, _0x31b29b["apiUrl"])) {
        _0x57c225[_0x5045a6] = _0x257b25;
        continue;
      }
      const _0x129917 = await fetchInputAudioBlob(_0x257b25, _0x5045a6);
      if (_0x18d38b && Number(_0x129917?.["size"] || 0x0) > _0x55ba92) {
        const _0x542e8c = Math["round"](_0x55ba92 / 0x400 / 0x400);
        throw new Error(_0x31b29b['maxBytesMessage'] || "音频文件不能超过 " + _0x542e8c + "MB，请压缩后再上传");
      }
      const _0x3bca3f = guessAudioExtension(_0x257b25);
      const _0x409969 = _0x148427 || _0x1b1d46 === OBJECT_STORAGE_UPLOAD_PROVIDER ? await uploadPublicMediaToConfiguredObjectStorage(resolveObjectStorageKindForAudioSource(_0x129917), _0x129917, {
        ..._0x31b29b,
        'fileName': _0x31b29b["filename"] || "audio." + _0x3bca3f
      }) : isCustomProviderAssetUploadProvider(_0x1b1d46) ? await uploadToCustomProviderAsset(_0x129917, _0x1f13f8, {
        ..._0x31b29b,
        'filename': _0x31b29b["filename"] || "audio." + _0x3bca3f
      }) : await uploadAudioToRunningHub(_0x129917, _0x1f13f8, {
        ..._0x31b29b,
        'filename': _0x31b29b["filename"] || "audio." + _0x3bca3f
      });
      _0x57c225[_0x5045a6] = _0x409969;
    } catch (_0x35b59b) {
      if (_0x5a1bb0) {
        throw _0x35b59b;
      }
    }
  }
  return _0x57c225;
}
export async function processInputAudios(_0x548bae, _0x46eaa7, _0x45152f = {}) {
  const _0x4a1189 = await processInputAudiosOrdered(_0x548bae, _0x46eaa7, _0x45152f);
  return _0x4a1189['filter'](Boolean);
}
export async function processInputAudiosPreserveOrder(_0x103594, _0x1745e3, _0xa03def = {}) {
  return await processInputAudiosOrdered(_0x103594, _0x1745e3, _0xa03def);
}