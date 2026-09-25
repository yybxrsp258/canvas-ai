import { t } from '../../../i18n/index.js';
import { showMediaSaveSuccessToast } from '../mediaDownloadFeedback.js';
import { resolveNodeMediaDownloadFilename } from '../mediaDownloadFilename.js';
function toolbarText(_0x1438e9) {
  return t("nodeToolbar.common." + _0x1438e9);
}
export function bindImageDownloadAction(_0x330ea6) {
  const {
    toolbarEl: _0x1c04e9,
    getNodeData: _0x4c4aa5,
    getImage: _0x57ff34,
    localPathToUrl: _0x1d7ba9,
    fetchRemoteBlob: _0xf06da9,
    saveMediaFile: _0xe9f85f,
    showToast = globalThis['window']?.['showToast']
  } = _0x330ea6;
  const _0x1ec5c2 = _0x1c04e9["querySelector"](".act-download");
  _0x1ec5c2 && _0x1ec5c2["addEventListener"]('click', async _0x5c9523 => {
    _0x5c9523['stopPropagation']();
    const _0x216a29 = _0x4c4aa5();
    if (!_0x216a29) {
      alert(toolbarText('nodeMissing'));
      return;
    }
    const _0x122818 = _0x2dbcb9 => {
      const _0x482882 = String(_0x2dbcb9 || '')['trim']();
      if (!_0x482882) {
        return '';
      }
      if (_0x482882['startsWith']("http://") || _0x482882["startsWith"]('https://') || _0x482882['startsWith']("blob:") || _0x482882["startsWith"]("data:")) {
        return _0x482882;
      }
      if (_0x482882["startsWith"]('/')) {
        return _0x482882;
      }
      return _0x1d7ba9(_0x482882) || '/' + _0x482882["replace"](/^\/+/, '');
    };
    const _0x41a959 = _0x27ec69 => {
      const _0x2b5c85 = String(_0x27ec69 || '')["trim"]();
      if (!_0x2b5c85) {
        return ![];
      }
      if (_0x2b5c85["startsWith"]('/') && !_0x2b5c85["startsWith"]('//')) {
        return !![];
      }
      try {
        const _0x2c1557 = new URL(_0x2b5c85, window["location"]["href"]);
        return _0x2c1557["origin"] === window["location"]["origin"];
      } catch {
        return ![];
      }
    };
    const _0x3115af = _0x42b366 => {
      const _0x30dcd5 = String(_0x42b366 || '')['trim']();
      if (!_0x30dcd5) {
        return '';
      }
      try {
        const _0x4463f9 = new URL(_0x30dcd5, window["location"]['href']);
        return _0x4463f9["protocol"] === "http:" || _0x4463f9["protocol"] === 'https:' ? _0x4463f9["href"] : '';
      } catch {
        return '';
      }
    };
    const _0x214efb = _0x4e186 => {
      return resolveNodeMediaDownloadFilename({
        'nodeName': _0x216a29['name'],
        'fileName': _0x216a29['fileName'],
        'kind': 'image',
        'sources': [_0x4e186],
        'fallbackBase': 'image_' + Date["now"]()
      });
    };
    const _0x4b3063 = (_0x12a417, _0x2f4c1b) => {
      const _0x54052a = document["createElement"]('a');
      _0x54052a["href"] = _0x12a417;
      _0x54052a["download"] = _0x2f4c1b;
      _0x54052a["rel"] = "noopener";
      document["body"]["appendChild"](_0x54052a);
      _0x54052a["click"]();
      _0x54052a['remove']();
    };
    const _0x3afb22 = _0x122818(_0x216a29['localPath']);
    const _0x33619c = (_0x41a959(_0x3afb22) ? _0x3afb22 : '') || (_0x41a959(_0x216a29["src"]) ? _0x216a29["src"] : '');
    const _0x547442 = _0x216a29['sourceUrl'] || _0x216a29["src"] || _0x216a29["resultUrl"] || _0x216a29["imageUrl"] || _0x216a29["thumbUrl"];
    const _0x42c975 = String(_0x216a29['type'] || '')["trim"]() === "ai-image" && !_0x41a959(_0x547442) ? '' : _0x547442;
    const _0x2b5187 = _0x214efb(_0x33619c || _0x42c975);
    if (!_0x33619c && !_0x42c975 && !_0x216a29["sourceId"]) {
      if (String(_0x216a29["type"] || '')["trim"]() === 'ai-image') {
        const _0x5298e2 = "生成图片尚未成功保存到本地，请重新生成后再下载。";
        if (typeof showToast === "function") {
          showToast(_0x5298e2, "error");
        } else {
          alert(_0x5298e2);
        }
        return;
      }
      alert(toolbarText("noDownloadableImage"));
      return;
    }
    const _0x1e90c9 = _0x33619c ? _0x216a29['localPath'] || _0x33619c : _0x41a959(_0x42c975) ? _0x42c975 : '';
    const _0x1f225f = _0x1e90c9 ? _0x33619c || _0x42c975 : _0x3115af(_0x42c975);
    if (typeof _0xe9f85f === "function" && (_0x1e90c9 || _0x1f225f)) {
      try {
        const _0xc63af0 = await _0xe9f85f({
          'kind': "image",
          'localPath': _0x1e90c9,
          'url': _0x1f225f,
          'filename': _0x2b5187
        });
        if (_0xc63af0?.["canceled"]) {
          return;
        }
        if (_0xc63af0?.["success"] !== ![]) {
          showMediaSaveSuccessToast({
            'result': _0xc63af0,
            'kind': "image",
            'showToast': showToast
          });
          return;
        }
        throw new Error(_0xc63af0?.["error"] || '图片保存失败');
      } catch (_0x5e13a1) {
        const _0x1cd1c2 = String(_0x5e13a1?.["message"] || _0x5e13a1 || '图片保存失败');
        typeof showToast === "function" ? showToast(_0x1cd1c2, 'error') : alert(_0x1cd1c2);
        return;
      }
    }
    if (_0x33619c) {
      _0x4b3063(_0x33619c, _0x2b5187);
      return;
    }
    if (_0x216a29["sourceId"]) {
      let _0x471262 = null;
      try {
        _0x471262 = await _0x57ff34(_0x216a29['sourceId']);
      } catch {}
      if (_0x471262) {
        if (typeof _0xe9f85f === "function") {
          try {
            const _0x46204e = await _0xe9f85f({
              'kind': 'image',
              'blob': _0x471262,
              'filename': _0x2b5187
            });
            if (_0x46204e?.['canceled']) {
              return;
            }
            if (_0x46204e?.["success"] !== ![]) {
              showMediaSaveSuccessToast({
                'result': _0x46204e,
                'kind': "image",
                'showToast': showToast
              });
              return;
            }
            throw new Error(_0x46204e?.["error"] || '图片保存失败');
          } catch (_0xb053c7) {
            const _0xd1b949 = String(_0xb053c7?.["message"] || _0xb053c7 || "图片保存失败");
            typeof showToast === "function" ? showToast(_0xd1b949, "error") : alert(_0xd1b949);
            return;
          }
        }
        const _0x5b808f = window["URL"]["createObjectURL"](_0x471262);
        _0x4b3063(_0x5b808f, _0x2b5187);
        setTimeout(() => window['URL']["revokeObjectURL"](_0x5b808f), 0x3e8);
        return;
      }
    }
    if (!_0x42c975) {
      alert(toolbarText("noDownloadableImage"));
      return;
    }
    if (_0x41a959(_0x42c975)) {
      _0x4b3063(_0x42c975, _0x2b5187);
      return;
    }
    try {
      const _0x2fd813 = new AbortController();
      const _0x2feab5 = setTimeout(() => _0x2fd813["abort"](), 0x3a98);
      const _0x4eae0b = await _0xf06da9(_0x42c975, {
        'signal': _0x2fd813['signal']
      });
      clearTimeout(_0x2feab5);
      const _0x666572 = window["URL"]['createObjectURL'](_0x4eae0b);
      _0x4b3063(_0x666572, _0x2b5187);
      setTimeout(() => window["URL"]['revokeObjectURL'](_0x666572), 0x3e8);
    } catch {
      _0x4b3063(_0x42c975, _0x2b5187);
    }
  });
}