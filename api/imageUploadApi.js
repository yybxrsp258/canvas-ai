import { compressImage } from '../src/modules/imageUtils.js';
import { getProviderConfig } from './configApi.js';
import { post as a90_0x527cea, get as a90_0x3fc654 } from './requester.js';
import { resolveImageInputUploadQualityOptions } from '../src/services/imageInputUploadQualityService.js';
import { convertImageBlobToPngBlob, resolveImageMimeType } from '../src/services/imagePngConversionService.js';
import { isApimartReusableUrl, uploadImageToApimart } from './apimartUploadApi.js';
import { isCustomProviderAssetUploadProvider, isReusableCustomProviderAssetUrl, uploadToCustomProviderAsset } from './customProviderAssetUploadApi.js';
import { uploadToFreeImageHost } from './freeImageHostApi.js';
import { isConfiguredObjectStorageEnabled, isConfiguredObjectStoragePublicUrl, OBJECT_STORAGE_UPLOAD_PROVIDER, uploadPublicMediaToConfiguredObjectStorage } from './objectStorageApi.js';
import { getRunningHubUploadErrorMessage, getRunningHubUploadUrl, hasRunningHubUploadFailureCode } from './runningHubUploadResponse.js';
function _createLimiter(_0x334e71) {
  let _0x4cd86d = 0x0;
  const _0x289453 = [];
  return function _0x46a7aa(_0xfec14d) {
    return new Promise((_0x245c99, _0x2a7c3d) => {
      const _0x22bc49 = () => {
        _0x4cd86d++;
        Promise['resolve']()["then"](_0xfec14d)["then"](_0x3cc25e => {
          _0x4cd86d--;
          if (_0x289453["length"] && _0x4cd86d < _0x334e71) {
            _0x289453["shift"]()();
          }
          _0x245c99(_0x3cc25e);
        }, _0x373bc3 => {
          _0x4cd86d--;
          if (_0x289453["length"] && _0x4cd86d < _0x334e71) {
            _0x289453["shift"]()();
          }
          _0x2a7c3d(_0x373bc3);
        });
      };
      if (_0x4cd86d < _0x334e71) {
        _0x22bc49();
      } else {
        _0x289453["push"](_0x22bc49);
      }
    });
  };
}
const _runLimited = _createLimiter(0x3);
const _inflight = new Map();
const DEFAULT_IMAGE_UPLOAD_RETRIES = 0x1;
const DEFAULT_IMAGE_UPLOAD_RETRY_DELAY_MS = 0x1f4;
const DEFAULT_IMAGE_UPLOAD_PROVIDER = "freeImageHost";
function sleep(_0x5064b6) {
  const _0x537fb3 = Number(_0x5064b6);
  return _0x537fb3 > 0x0 ? new Promise(_0x3a9375 => setTimeout(_0x3a9375, _0x537fb3)) : Promise['resolve']();
}
function normalizeRetryCount(_0x4c4dbe, _0x18fda9 = DEFAULT_IMAGE_UPLOAD_RETRIES) {
  const _0x3be6ce = Number(_0x4c4dbe);
  return Number['isFinite'](_0x3be6ce) && _0x3be6ce >= 0x0 ? Math['min'](0x5, Math["trunc"](_0x3be6ce)) : _0x18fda9;
}
function normalizeDelayMs(_0x590700, _0x26791d = DEFAULT_IMAGE_UPLOAD_RETRY_DELAY_MS) {
  const _0x4f317a = Number(_0x590700);
  return Number["isFinite"](_0x4f317a) && _0x4f317a >= 0x0 ? Math["trunc"](_0x4f317a) : _0x26791d;
}
function getErrorStatus(_0x50650a) {
  const _0x5f14a1 = _0x50650a?.['status'] ?? _0x50650a?.['statusCode'] ?? _0x50650a?.['httpStatus'];
  const _0x24d85f = Number(_0x5f14a1);
  return Number['isFinite'](_0x24d85f) ? _0x24d85f : 0x0;
}
function isMissingUploadUrlError(_0x27dfa4) {
  const _0x3a3b48 = String(_0x27dfa4?.["message"] || _0x27dfa4 || '');
  return /未返回可用.*(?:URL|链接)/i['test'](_0x3a3b48) || /(?:URL|链接).*(?:为空|缺失)/i["test"](_0x3a3b48) || /返回格式异常/i["test"](_0x3a3b48) || /(?:empty|missing).*(?:url|link)/i["test"](_0x3a3b48);
}
function isRetryableImageUploadError(_0x3c3502) {
  if (_0x3c3502?.["retryable"] === !![] || isMissingUploadUrlError(_0x3c3502)) {
    return !![];
  }
  const _0x4349e8 = getErrorStatus(_0x3c3502);
  return _0x4349e8 === 0x198 || _0x4349e8 === 0x1a9 || _0x4349e8 === 0x1ad || _0x4349e8 >= 0x1f4;
}
function _buildKey(_0x312fa8, _0x4d4d05, _0x30522b) {
  const {
    compress = !![],
    maxDim = 0x800,
    quality = 0.9,
    provider = DEFAULT_IMAGE_UPLOAD_PROVIDER,
    preferFree = ![],
    apiUrl = '',
    multipartField = '',
    responsePath = '',
    uploadRetries = DEFAULT_IMAGE_UPLOAD_RETRIES,
    retryDelayMs = DEFAULT_IMAGE_UPLOAD_RETRY_DELAY_MS
  } = _0x30522b || {};
  const _0x40dd9b = Math["round"](quality * 0x3e8);
  const _0x3d1f28 = _0x4d4d05 ? 0x1 : 0x0;
  const _0x16fe96 = compress ? 0x1 : 0x0;
  const _0x23df90 = preferFree ? 0x1 : 0x0;
  const _0x467799 = _0x30522b?.["forceProviderUpload"] === !![] ? 0x1 : 0x0;
  const _0x563df9 = isConfiguredObjectStorageEnabled() && !_0x467799 ? 0x1 : 0x0;
  return [_0x312fa8, provider, _0x16fe96, maxDim, _0x40dd9b, _0x3d1f28, _0x23df90, _0x563df9, _0x467799, apiUrl, multipartField, responsePath, normalizeRetryCount(uploadRetries), normalizeDelayMs(retryDelayMs)]["join"]('|');
}
function _getUploadPromise(_0x4d6a18, _0x2c77b1, _0x596ef7) {
  const _0x2e5b7a = _buildKey(_0x4d6a18, _0x2c77b1, _0x596ef7);
  let _0x20ba92 = _inflight['get'](_0x2e5b7a);
  !_0x20ba92 && (_0x20ba92 = _runLimited(() => _processSingle(_0x4d6a18, _0x2c77b1, _0x596ef7)), _inflight["set"](_0x2e5b7a, _0x20ba92), _0x20ba92["finally"](() => {
    _inflight["delete"](_0x2e5b7a);
  })["catch"](() => {}));
  return _0x20ba92;
}
function isReusableRunningHubUrl(_0x5da6a8, _0xc44fd4 = '') {
  try {
    const _0x2471ff = new URL(String(_0x5da6a8 || '')["trim"]())["hostname"];
    const _0x1f525a = new URL(String(_0xc44fd4 || "https://www.runninghub.cn")['trim']())["hostname"];
    return _0x2471ff === _0x1f525a;
  } catch {
    return ![];
  }
}
function isProviderAssetIdentifier(_0x55d671) {
  return /^asset:\/\//i["test"](String(_0x55d671 || '')["trim"]());
}
function guessImageExtension(_0x3280c1, _0x4b155f = 'png') {
  try {
    const _0x158ab8 = new URL(String(_0x3280c1 || '')['trim'](), "https://local.invalid");
    const _0x41e9b9 = String(_0x158ab8["pathname"] || '')["split"]('/')['pop']() || '';
    const _0x2db48b = _0x41e9b9['includes']('.') ? _0x41e9b9['split']('.')["pop"]()["toLowerCase"]() : '';
    if (/^(?:jpe?g|png|webp)$/["test"](_0x2db48b)) {
      return _0x2db48b === "jpeg" ? "jpg" : _0x2db48b;
    }
  } catch {}
  return _0x4b155f;
}
function normalizeImageExtension(_0x59811c) {
  const _0x45dcef = String(_0x59811c || '')["trim"]()["toLowerCase"]()["replace"](/^\./, '');
  return _0x45dcef === 'jpeg' ? 'jpg' : _0x45dcef;
}
function resolveImageExtension(_0x44d48d, _0x14e174) {
  const _0x4aeaa3 = resolveImageMimeType(_0x44d48d, _0x14e174);
  return {
    'image/jpeg': "jpg",
    'image/jpg': "jpg",
    'image/png': 'png',
    'image/webp': "webp",
    'image/gif': "gif",
    'image/bmp': "bmp",
    'image/x-ms-bmp': "bmp",
    'image/avif': "avif",
    'image/svg+xml': "svg"
  }[_0x4aeaa3] || '';
}
async function normalizeCustomProviderImageBlob(_0x1d8959, _0x39042e, _0x1709aa = {}) {
  if (!isCustomProviderAssetUploadProvider(_0x1709aa["provider"])) {
    return _0x1d8959;
  }
  const _0x422efa = new Set((Array["isArray"](_0x1709aa["allowedExtensions"]) ? _0x1709aa["allowedExtensions"] : [])["map"](normalizeImageExtension)["filter"](Boolean));
  if (!_0x422efa["size"] || !_0x422efa["has"]("png")) {
    return _0x1d8959;
  }
  const _0x4899b9 = resolveImageExtension(_0x1d8959, _0x39042e);
  if (!_0x4899b9 || _0x422efa['has'](_0x4899b9)) {
    return _0x1d8959;
  }
  const _0x3b089d = await convertImageBlobToPngBlob(_0x1d8959);
  if (!_0x3b089d) {
    throw new Error("中转站素材上传失败：无法将 ." + _0x4899b9 + " 图片转换为支持的 PNG 格式");
  }
  return _0x3b089d;
}
async function _processSingle(_0x431de5, _0x1d909b, _0x1d4dfa) {
  const {
    compress = !![],
    maxDim = 0x800,
    quality = 0.9,
    provider = DEFAULT_IMAGE_UPLOAD_PROVIDER,
    fallbackCompressOnError = ![],
    fallbackMaxDim = 0x800,
    fallbackQuality = 0.9
  } = _0x1d4dfa || {};
  if (isProviderAssetIdentifier(_0x431de5)) {
    return _0x431de5;
  }
  const _0x121f18 = _0x1d4dfa?.['forceProviderUpload'] === !![];
  if (!_0x121f18 && isConfiguredObjectStoragePublicUrl(_0x431de5)) {
    return _0x431de5;
  }
  const _0x1e65eb = isConfiguredObjectStorageEnabled() && !_0x121f18;
  if (!_0x1e65eb && provider === "runninghub" && isReusableRunningHubUrl(_0x431de5, _0x1d4dfa?.['apiUrl'])) {
    return _0x431de5;
  }
  if (!_0x1e65eb && provider === "apimart" && isApimartReusableUrl(_0x431de5)) {
    return _0x431de5;
  }
  const _0x4b62e8 = async _0x1169d0 => {
    if (_0x1e65eb || provider === OBJECT_STORAGE_UPLOAD_PROVIDER) {
      return await uploadPublicMediaToConfiguredObjectStorage('image', _0x1169d0, {
        ...(_0x1d4dfa || {}),
        'fileName': _0x1d4dfa?.['filename'] || _0x1d4dfa?.["fileName"] || "image.png"
      });
    }
    if (provider === "runninghub") {
      return await uploadToRunningHub(_0x1169d0, _0x1d909b, _0x1d4dfa || {});
    }
    if (isCustomProviderAssetUploadProvider(provider)) {
      const _0x44b57c = await normalizeCustomProviderImageBlob(_0x1169d0, _0x431de5, _0x1d4dfa);
      return await uploadToCustomProviderAsset(_0x44b57c, _0x1d909b, {
        ...(_0x1d4dfa || {}),
        'filename': _0x1d4dfa?.["filename"] || 'image.' + guessImageExtension(_0x431de5)
      });
    }
    if (provider === 'apimart') {
      return await uploadImageToApimart(_0x1169d0, {
        ...(_0x1d4dfa || {}),
        'apiKey': _0x1d909b
      });
    }
    if (provider === 'grsai') {
      return await uploadImageToBed(_0x1169d0, _0x1d909b, {
        ...(_0x1d4dfa || {}),
        'preferFree': ![]
      });
    }
    if (isFreeImageHostProvider(provider)) {
      return await uploadImageToBed(_0x1169d0, '', {
        ...(_0x1d4dfa || {}),
        'preferFree': !![]
      });
    }
    return await uploadImageToBed(_0x1169d0, '', {
      ...(_0x1d4dfa || {}),
      'preferFree': !![]
    });
  };
  const _0xf642cd = async _0x15357b => {
    const _0x2f52ff = normalizeRetryCount(_0x1d4dfa?.["uploadRetries"]);
    const _0x3a72e0 = normalizeDelayMs(_0x1d4dfa?.['retryDelayMs']);
    for (let _0x2cd5ba = 0x0;; _0x2cd5ba++) {
      try {
        const _0x1cc525 = String((await _0x4b62e8(_0x15357b)) || '')["trim"]();
        if (!_0x1cc525) {
          const _0x380c5b = new Error(provider + " 图片上传失败: 未返回可用文件 URL，请重试");
          _0x380c5b['retryable'] = !![];
          throw _0x380c5b;
        }
        return _0x1cc525;
      } catch (_0x25e98c) {
        if (_0x2cd5ba >= _0x2f52ff || !isRetryableImageUploadError(_0x25e98c)) {
          throw _0x25e98c;
        }
        await sleep(_0x3a72e0 * (_0x2cd5ba + 0x1));
      }
    }
  };
  if (compress) {
    let _0x382520;
    try {
      _0x382520 = await compressImage(_0x431de5, maxDim, quality);
    } catch (_0x18b3bb) {
      _0x382520 = await a90_0x3fc654(_0x431de5, {
        'provider': 'remote',
        'buildUrl': ![],
        'responseType': "blob"
      });
    }
    return await _0xf642cd(_0x382520);
  }
  if (fallbackCompressOnError) {
    try {
      const _0xbe0a63 = await a90_0x3fc654(_0x431de5, {
        'provider': "remote",
        'buildUrl': ![],
        'responseType': 'blob'
      });
      return await _0xf642cd(_0xbe0a63);
    } catch (_0x27e3af) {
      const _0xaed5a1 = await compressImage(_0x431de5, fallbackMaxDim, fallbackQuality);
      return await _0xf642cd(_0xaed5a1);
    }
  }
  const _0x888ae6 = await a90_0x3fc654(_0x431de5, {
    'provider': "remote",
    'buildUrl': ![],
    'responseType': 'blob'
  });
  return await _0xf642cd(_0x888ae6);
}
async function uploadToTelegraph(_0x28ce9a) {
  const _0x4204d7 = new FormData();
  _0x4204d7["append"]('file', _0x28ce9a, "image.png");
  const _0x10d9cd = "https://telegra.ph/upload";
  const _0x112e79 = "/api/v2/proxy/upload?apiUrl=" + encodeURIComponent(_0x10d9cd);
  const _0x11c295 = await a90_0x527cea(_0x112e79, _0x4204d7, {
    'provider': "telegraph"
  });
  if (Array['isArray'](_0x11c295) && _0x11c295[0x0]?.["src"]) {
    return "https://telegra.ph" + _0x11c295[0x0]["src"];
  }
  throw new Error("Telegraph 返回格式异常");
}
function isFreeImageHostProvider(_0x28b341) {
  const _0x186d32 = String(_0x28b341 || '')["trim"]();
  const _0x5805ba = _0x186d32["toLowerCase"]()["replace"](/[\s_-]+/g, '');
  return _0x186d32 === "免费图床" || _0x5805ba === "freeimagehost";
}
async function uploadToQiniu(_0x5068d4, _0x275b6b) {
  const _0x325356 = {
    'Content-Type': "application/json"
  };
  if (_0x275b6b) {
    _0x325356['Authorization'] = "Bearer " + _0x275b6b;
  }
  const _0x59b7e4 = await a90_0x527cea(getProviderConfig('grsai')["apiUrl"]['replace'](/\/v1\/?$/i, '') + '/client/resource/newUploadTokenZH', {
    'sux': 'png'
  }, {
    'provider': "grsai",
    'buildUrl': ![],
    'headers': _0x325356
  });
  if (!_0x59b7e4['data']) {
    throw new Error("GRSAI 返回了无效的上传凭证");
  }
  const {
    token: _0x5c4358,
    key: _0x522121,
    url: _0x5b966e,
    domain: _0x30e626
  } = _0x59b7e4['data'];
  const _0x44e44c = new FormData();
  _0x44e44c["append"]("token", _0x5c4358);
  _0x44e44c["append"]("key", _0x522121);
  _0x44e44c["append"]("file", _0x5068d4, 'image.png');
  await a90_0x527cea(_0x5b966e, _0x44e44c, {
    'provider': "qiniu",
    'buildUrl': ![]
  });
  return _0x30e626 + '/' + _0x522121;
}
export async function uploadImageToBed(_0x51f2ae, _0x5c3909, _0x5d8e45 = {}) {
  const {
    preferFree = ![]
  } = _0x5d8e45;
  if (isConfiguredObjectStorageEnabled()) {
    return await uploadPublicMediaToConfiguredObjectStorage("image", _0x51f2ae, _0x5d8e45);
  }
  if (!preferFree && _0x5c3909) {
    try {
      return await uploadToQiniu(_0x51f2ae, _0x5c3909);
    } catch {
      return await uploadToTelegraph(_0x51f2ae);
    }
  }
  try {
    return await uploadToFreeImageHost(_0x51f2ae, _0x5d8e45);
  } catch (_0x5e284f) {
    try {
      return await uploadToTelegraph(_0x51f2ae);
    } catch (_0x169f3f) {
      throw new Error("免费图床上传失败：" + (_0x169f3f?.["message"] || _0x5e284f?.['message'] || "未知错误"));
    }
  }
}
export async function uploadToRunningHub(_0x25ac51, _0x17f46c, _0x5d0ce1 = {}) {
  if (isConfiguredObjectStorageEnabled()) {
    return await uploadPublicMediaToConfiguredObjectStorage("image", _0x25ac51, _0x5d0ce1);
  }
  if (!_0x17f46c) {
    throw new Error("RunningHUB API Key 未配置，无法上传图片");
  }
  const _0x18c041 = String(_0x5d0ce1?.["apiUrl"] || "https://www.runninghub.cn")["trim"]()["replace"](/\/+$/, '');
  const _0x4f3f9f = _0x18c041 + "/openapi/v2/media/upload/binary";
  const _0x1e5deb = "/api/v2/proxy/upload?apiUrl=" + encodeURIComponent(_0x4f3f9f);
  const _0x5610f0 = new FormData();
  _0x5610f0['append']("file", _0x25ac51, 'image.png');
  const _0xc1b892 = await a90_0x527cea(_0x1e5deb, _0x5610f0, {
    'headers': {
      'Authorization': "Bearer " + _0x17f46c
    },
    'provider': "runninghub"
  });
  if (hasRunningHubUploadFailureCode(_0xc1b892)) {
    throw new Error("RunningHUB 上传失败: " + getRunningHubUploadErrorMessage(_0xc1b892));
  }
  const _0x372c89 = getRunningHubUploadUrl(_0xc1b892);
  if (!_0x372c89) {
    throw new Error('RunningHUB\x20上传失败:\x20未返回可用文件\x20URL，请重试');
  }
  return _0x372c89;
}
async function _processInputImagesOrdered(_0x4f3c10, _0x37fafe, _0x293eb0 = {}) {
  const _0x2e2366 = _0x293eb0?.["applyInputQualityProfile"] === !![] ? resolveImageInputUploadQualityOptions(_0x293eb0) : _0x293eb0 || {};
  const {
    compress = !![],
    maxDim = 0x800,
    quality = 0.9,
    provider = DEFAULT_IMAGE_UPLOAD_PROVIDER
  } = _0x2e2366;
  if (!_0x4f3c10 || _0x4f3c10["length"] === 0x0) {
    return [];
  }
  const _0x530508 = {
    ..._0x2e2366,
    'compress': compress,
    'maxDim': maxDim,
    'quality': quality,
    'provider': provider
  };
  const _0x5090e4 = _0x530508["strictUpload"] === !![];
  const _0x23a59c = _0x530508['forceProviderUpload'] === !![];
  const _0x350c76 = isConfiguredObjectStorageEnabled() && !_0x23a59c;
  const _0x5118b3 = new Array(_0x4f3c10['length'])['fill']('');
  const _0x1a1b4f = [];
  for (let _0x26f0c8 = 0x0; _0x26f0c8 < _0x4f3c10["length"]; _0x26f0c8++) {
    const _0x4c341f = String(_0x4f3c10[_0x26f0c8] || '')["trim"]();
    if (!_0x4c341f) {
      continue;
    }
    if (isProviderAssetIdentifier(_0x4c341f)) {
      _0x5118b3[_0x26f0c8] = _0x4c341f;
      continue;
    }
    if (!_0x23a59c && isConfiguredObjectStoragePublicUrl(_0x4c341f)) {
      _0x5118b3[_0x26f0c8] = _0x4c341f;
      continue;
    }
    if (!_0x350c76 && provider === "runninghub" && isReusableRunningHubUrl(_0x4c341f, _0x530508["apiUrl"])) {
      _0x5118b3[_0x26f0c8] = _0x4c341f;
      continue;
    }
    if (!_0x350c76 && provider === 'apimart' && isApimartReusableUrl(_0x4c341f)) {
      _0x5118b3[_0x26f0c8] = _0x4c341f;
      continue;
    }
    if (!_0x350c76 && isCustomProviderAssetUploadProvider(provider) && isReusableCustomProviderAssetUrl(_0x4c341f, _0x530508["apiUrl"])) {
      _0x5118b3[_0x26f0c8] = _0x4c341f;
      continue;
    }
    const _0x376bb9 = _getUploadPromise(_0x4c341f, _0x37fafe, _0x530508);
    const _0x6043fd = _0x376bb9["then"](_0x25da8e => {
      _0x5118b3[_0x26f0c8] = String(_0x25da8e || '')['trim']();
    });
    _0x1a1b4f["push"](_0x5090e4 ? _0x6043fd : _0x6043fd['catch'](() => {
      _0x5118b3[_0x26f0c8] = '';
    }));
  }
  if (_0x1a1b4f["length"] > 0x0) {
    if (_0x5090e4) {
      await Promise['all'](_0x1a1b4f);
    } else {
      await Promise["allSettled"](_0x1a1b4f);
    }
  }
  return _0x5118b3;
}
export async function processInputImages(_0x1b082f, _0x22daf5, _0x5c0e03 = {}) {
  const _0x3c5523 = await _processInputImagesOrdered(_0x1b082f, _0x22daf5, {
    ..._0x5c0e03,
    'strictUpload': _0x5c0e03["strictUpload"] !== ![]
  });
  return _0x3c5523["filter"](Boolean);
}
export async function processInputImagesPreserveOrder(_0xb666b7, _0x356d93, _0x21aab8 = {}) {
  return await _processInputImagesOrdered(_0xb666b7, _0x356d93, _0x21aab8);
}