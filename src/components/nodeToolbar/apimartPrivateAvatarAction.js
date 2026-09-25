import { submitApimartSeedance2PrivateAvatar } from '../../../api/apimartPrivateAvatarApi.js';
import { APIMART_PRIVATE_AVATAR_ASSET_KEY, buildApimartPrivateAvatarPatch, readApimartPrivateAvatarAsset } from '../../modules/apimartPrivateAvatarAssets.js';
import { DEFAULT_APIMART_API_URL } from '../../modules/providers.js';
import { showProviderApiKeyMissingToast } from '../../modules/providerApiKeyMissingToast.js';
import { t } from '../../i18n/index.js';
const ACTION_CLASS = ".act-apimart-face-detect";
function faceDetectText(_0x48b7de, _0xb1fc1b = {}) {
  return t("nodeToolbar.faceDetect." + _0x48b7de, _0xb1fc1b);
}
function getNodeId(_0x2b7a30 = {}) {
  return String(_0x2b7a30['nodeId'] || _0x2b7a30["nodeData"]?.['id'] || '')["trim"]();
}
function getLatestNodeData(_0x1a6ee4 = {}) {
  const _0x5ef2fb = getNodeId(_0x1a6ee4);
  const _0x352f10 = typeof _0x1a6ee4["getStateSnapshot"] === 'function' ? _0x1a6ee4['getStateSnapshot']() : {};
  return _0x352f10?.["nodes"]?.[_0x5ef2fb] || _0x1a6ee4['getNodeData']?.() || _0x1a6ee4["nodeData"] || {};
}
function basenameFromUrl(_0x410196) {
  const _0x4bba8d = String(_0x410196 || '')["split"](/[?#]/, 0x1)[0x0];
  const _0x24a1cb = _0x4bba8d["split"](/[\\/]/)["filter"](Boolean);
  return _0x24a1cb[_0x24a1cb["length"] - 0x1] || '';
}
function resolveLocalPathUrl(_0x1ea02a, _0x55bb9b) {
  const _0x5d2ca0 = String(_0x55bb9b || '')["trim"]();
  if (!_0x5d2ca0) {
    return '';
  }
  if (/^(https?:|blob:|data:|asset:\/\/)/i["test"](_0x5d2ca0)) {
    return _0x5d2ca0;
  }
  if (_0x5d2ca0['startsWith']('/')) {
    return _0x5d2ca0;
  }
  return _0x1ea02a["localPathToUrl"]?.(_0x5d2ca0) || _0x5d2ca0;
}
function resolveImageSourceUrl(_0x2f425f, _0x2c2cbb = {}) {
  const _0x2d1445 = [_0x2f425f['resolveCanvasImagePreviewUrl']?.(_0x2c2cbb), _0x2c2cbb["originalLocalPath"], _0x2c2cbb["displayLocalPath"], _0x2c2cbb["localPath"], _0x2c2cbb["imageUrl"], _0x2c2cbb["sourceUrl"], _0x2c2cbb["src"], _0x2c2cbb["url"]];
  for (const _0x49e03d of _0x2d1445) {
    const _0x2f31ad = resolveLocalPathUrl(_0x2f425f, _0x49e03d);
    if (_0x2f31ad) {
      return _0x2f31ad;
    }
  }
  return '';
}
function resolveVideoSourceUrl(_0x53fced, _0x4e9a03 = {}) {
  const _0x1da1e7 = _0x53fced["_getCurrentVideoUrl"]?.();
  if (_0x1da1e7) {
    return _0x1da1e7;
  }
  const _0x1f0af5 = Array["isArray"](_0x4e9a03["videos"]) ? _0x4e9a03["videos"] : [];
  const _0x1bd148 = Number["isFinite"](Number(_0x4e9a03["mainVideoIndex"])) ? Math["max"](0x0, Math["trunc"](Number(_0x4e9a03["mainVideoIndex"]))) : 0x0;
  const _0x3cc2c3 = _0x1f0af5[_0x1bd148] || _0x1f0af5[0x0] || {};
  const _0x1a8e9b = [_0x3cc2c3["originalLocalPath"], _0x3cc2c3["displayLocalPath"], _0x3cc2c3['localPath'], _0x3cc2c3['videoUrl'], _0x4e9a03["originalLocalPath"], _0x4e9a03["displayLocalPath"], _0x4e9a03['localPath'], _0x4e9a03['videoLocalPath'], _0x4e9a03['videoUrl'], _0x4e9a03["sourceUrl"], _0x4e9a03["src"], _0x4e9a03["url"]];
  for (const _0x10ed91 of _0x1a8e9b) {
    const _0x28c410 = resolveLocalPathUrl(_0x53fced, _0x10ed91);
    if (_0x28c410) {
      return _0x28c410;
    }
  }
  return '';
}
function resolveSource(_0x241df4, _0x50bb8d = {}) {
  const _0x354e40 = String(_0x241df4["mediaKind"] || '')["toLowerCase"]();
  if (_0x354e40 === "video") {
    const _0x319299 = resolveVideoSourceUrl(_0x241df4, _0x50bb8d);
    return {
      'url': _0x319299,
      'assetType': "Video",
      'sourceKind': 'video'
    };
  }
  const _0x397aa1 = resolveImageSourceUrl(_0x241df4, _0x50bb8d);
  return {
    'url': _0x397aa1,
    'assetType': "Image",
    'sourceKind': 'image'
  };
}
function applyButtonState(_0x4937c1, _0x1415f5) {
  const _0x414d75 = String(_0x1415f5?.['status'] || '')["trim"]()['toLowerCase']();
  const _0x5ef480 = _0x414d75 === "processing";
  const _0x5e03cc = _0x4937c1['querySelector']?.("svg");
  _0x4937c1["classList"]["toggle"]("is-provider-asset-pass", _0x414d75 === 'passed');
  _0x4937c1['classList']['toggle']('is-provider-asset-fail', _0x414d75 === "failed");
  _0x4937c1['classList']["toggle"]("is-provider-asset-running", _0x5ef480);
  _0x5e03cc?.['classList']?.["toggle"]?.("v2-spinning", _0x5ef480);
  _0x4937c1["dataset"]["loading"] = _0x5ef480 ? 'true' : "false";
  _0x4937c1["disabled"] = _0x5ef480;
  _0x4937c1["setAttribute"]("aria-busy", _0x5ef480 ? "true" : "false");
  if (_0x414d75 === "passed") {
    _0x4937c1['dataset']['tooltip'] = faceDetectText('passedTooltip');
  } else {
    if (_0x414d75 === "failed") {
      _0x4937c1["dataset"]["tooltip"] = _0x1415f5?.["error"] ? faceDetectText('failedTooltipWithError', {
        'error': _0x1415f5["error"]
      }) : faceDetectText('failedTooltip');
    } else {
      _0x414d75 === 'processing' ? _0x4937c1["dataset"]["tooltip"] = faceDetectText("processingTooltip") : _0x4937c1["dataset"]["tooltip"] = faceDetectText('defaultTooltip');
    }
  }
}
function persistAsset(_0xd2b5a8, _0x394129, _0x207322) {
  const _0x2ae61a = getNodeId(_0xd2b5a8);
  if (!_0x2ae61a) {
    return;
  }
  const _0x3476bc = buildApimartPrivateAvatarPatch(_0x394129, _0x207322);
  _0xd2b5a8["store"]?.["updateNodeData"]?.(_0x2ae61a, _0x3476bc);
  _0x394129 && typeof _0x394129 === "object" && (_0x394129["providerAssetRefs"] = _0x3476bc["providerAssetRefs"]);
}
export function bindApimartPrivateAvatarAction(_0x3b0601 = {}) {
  const _0x3e7835 = _0x3b0601['toolbarEl']?.["querySelector"]?.(ACTION_CLASS);
  if (!_0x3e7835) {
    return () => {};
  }
  const _0x4cf39c = getNodeId(_0x3b0601);
  if (!_0x4cf39c) {
    return () => {};
  }
  const _0x3dde68 = () => {
    applyButtonState(_0x3e7835, readApimartPrivateAvatarAsset(getLatestNodeData(_0x3b0601)));
  };
  _0x3dde68();
  const _0x469668 = typeof _0x3b0601["store"]?.["subscribeSelector"] === "function" ? _0x3b0601["store"]["subscribeSelector"](_0x472251 => _0x472251["nodes"]?.[_0x4cf39c]?.["providerAssetRefs"]?.[APIMART_PRIVATE_AVATAR_ASSET_KEY], () => _0x3dde68()) : null;
  _0x3e7835["_cleanupApimartPrivateAvatarState"]?.();
  _0x3e7835["_cleanupApimartPrivateAvatarState"] = () => _0x469668?.();
  _0x3e7835["addEventListener"]("click", async _0x2fdbc6 => {
    _0x2fdbc6['preventDefault']();
    _0x2fdbc6["stopPropagation"]();
    if (_0x3e7835['dataset']["loading"] === 'true') {
      return;
    }
    const _0x375d75 = getLatestNodeData(_0x3b0601);
    const {
      url: _0x1b22d7,
      assetType: _0x2f016d,
      sourceKind: _0x6f0304
    } = resolveSource(_0x3b0601, _0x375d75);
    if (!_0x1b22d7) {
      persistAsset(_0x3b0601, _0x375d75, {
        'provider': "apimart",
        'capability': 'seedance2PrivateAvatar',
        'status': 'failed',
        'error': faceDetectText("missingUrlError")
      });
      window["showToast"]?.(faceDetectText('missingUrlToast'), 'error');
      _0x3dde68();
      return;
    }
    persistAsset(_0x3b0601, _0x375d75, {
      'provider': "apimart",
      'capability': "seedance2PrivateAvatar",
      'status': "processing",
      'sourceUrl': _0x1b22d7,
      'sourceKind': _0x6f0304,
      'assetType': _0x2f016d,
      'checkedAt': new Date()["toISOString"]()
    });
    _0x3dde68();
    const _0x11fa15 = _0x3b0601["ensureConfig"];
    const _0x40d327 = _0x3b0601["getProviderConfig"];
    try {
      await _0x11fa15?.();
      const _0x49502e = _0x40d327?.("apimart") || {};
      const _0x2832a1 = _0x40d327?.("runninghub") || {};
      const _0x21a833 = String(_0x49502e["apiKey"] || '')['trim']();
      const _0x3cd294 = String(_0x49502e["apiUrl"] || DEFAULT_APIMART_API_URL)["trim"]();
      const _0x38e306 = String(_0x2832a1["modelApiKey"] || _0x2832a1['apiKey'] || '')["trim"]();
      const _0x9e9d02 = String(_0x2832a1["apiUrl"] || '')["trim"]();
      if (!_0x21a833) {
        throw new Error(faceDetectText("apiKeyMissing"));
      }
      window["showToast"]?.(faceDetectText('running'), 'info');
      const _0xb4b67a = await submitApimartSeedance2PrivateAvatar({
        'apiKey': _0x21a833,
        'apiUrl': _0x3cd294,
        'runningHubApiKey': _0x38e306,
        'runningHubApiUrl': _0x9e9d02,
        'url': _0x1b22d7,
        'assetType': _0x2f016d,
        'name': basenameFromUrl(_0x1b22d7) || _0x6f0304 + "-asset"
      });
      persistAsset(_0x3b0601, getLatestNodeData(_0x3b0601), {
        'provider': "apimart",
        'capability': "seedance2PrivateAvatar",
        'status': 'passed',
        'assetUrl': _0xb4b67a["assetUrl"],
        'sourceUrl': _0x1b22d7,
        'uploadedSourceUrl': _0xb4b67a['sourceUrl'] || '',
        'sourceKind': _0x6f0304,
        'assetType': _0xb4b67a['assetType'] || _0x2f016d,
        'taskId': _0xb4b67a["taskId"] || '',
        'checkedAt': new Date()["toISOString"]()
      });
      window["showToast"]?.(faceDetectText("passedToast"), "success");
    } catch (_0x136242) {
      const _0x146834 = _0x136242?.["message"] || faceDetectText("failedFallback");
      persistAsset(_0x3b0601, getLatestNodeData(_0x3b0601), {
        'provider': "apimart",
        'capability': "seedance2PrivateAvatar",
        'status': "failed",
        'sourceUrl': _0x1b22d7,
        'sourceKind': _0x6f0304,
        'assetType': _0x2f016d,
        'checkedAt': new Date()["toISOString"](),
        'error': _0x146834
      });
      _0x146834 === faceDetectText("apiKeyMissing") ? showProviderApiKeyMissingToast(_0x146834, {
        'providerId': "apimart",
        'type': "error"
      }) : window["showToast"]?.(faceDetectText("failedToastWithError", {
        'error': _0x146834
      }), "error");
    } finally {
      _0x3dde68();
    }
  });
  return _0x3e7835["_cleanupApimartPrivateAvatarState"];
}