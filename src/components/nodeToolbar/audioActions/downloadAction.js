import { saveMediaDownload } from '../../../services/downloadSaveService.js';
import { normalizeLocalPath } from '../../../utils/localMediaPath.js';
import { showMediaSaveSuccessToast } from '../mediaDownloadFeedback.js';
import { resolveNodeMediaDownloadFilename } from '../mediaDownloadFilename.js';
function firstNonEmptyString(..._0x497a35) {
  for (const _0x351eb2 of _0x497a35) {
    const _0x4f5733 = String(_0x351eb2 || '')["trim"]();
    if (_0x4f5733) {
      return _0x4f5733;
    }
  }
  return '';
}
function normalizeAudioDownloadUrl(_0x2c3029) {
  const _0x522ac4 = String(_0x2c3029 || '')['trim']();
  if (!_0x522ac4) {
    return '';
  }
  if (/^(?:https?:|blob:|data:)/i["test"](_0x522ac4)) {
    return _0x522ac4;
  }
  if (_0x522ac4["startsWith"]('/')) {
    return _0x522ac4;
  }
  return '/' + _0x522ac4['replace'](/^\/+/, '');
}
export function resolveAudioDownloadTarget({
  nodeData = {},
  audioElement = null
} = {}) {
  const _0x578b67 = firstNonEmptyString(nodeData["localPath"], nodeData["audioUrl"], nodeData['src'], nodeData["url"], nodeData['resultUrl'], audioElement?.["currentSrc"], audioElement?.["src"]);
  const _0x332de8 = normalizeAudioDownloadUrl(_0x578b67);
  if (!_0x332de8) {
    return null;
  }
  return {
    'url': _0x332de8,
    'filename': resolveNodeMediaDownloadFilename({
      'nodeName': nodeData["name"],
      'fileName': nodeData["fileName"],
      'kind': "audio",
      'sources': [nodeData["localPath"], nodeData["audioUrl"], nodeData["src"], nodeData["url"], nodeData['resultUrl'], _0x332de8],
      'fallbackBase': "audio"
    })
  };
}
export function triggerAudioDownload(_0x4bb847, _0x360760 = globalThis["document"]) {
  if (!_0x4bb847?.["url"] || !_0x360760?.["createElement"] || !_0x360760?.['body']) {
    return ![];
  }
  const _0x52e0cc = _0x360760['createElement']('a');
  _0x52e0cc["href"] = _0x4bb847["url"];
  _0x52e0cc['download'] = _0x4bb847["filename"] || "audio.mp3";
  _0x52e0cc["rel"] = "noopener";
  _0x360760["body"]["appendChild"](_0x52e0cc);
  _0x52e0cc["click"]();
  _0x52e0cc["remove"]?.();
  if (_0x52e0cc['parentNode']) {
    _0x52e0cc["parentNode"]["removeChild"](_0x52e0cc);
  }
  return !![];
}
export function bindAudioDownloadAction({
  button: _0x4f0706,
  getNodeData: _0x544e8c,
  getAudioElement: _0x7a8e94,
  notifyMissing: _0x407be0,
  saveMediaFile = saveMediaDownload,
  documentRef = globalThis["document"],
  showToast = globalThis["window"]?.['showToast']
} = {}) {
  if (!_0x4f0706) {
    return () => {};
  }
  const _0x2adee2 = async _0x13f4f5 => {
    _0x13f4f5?.["preventDefault"]?.();
    _0x13f4f5?.['stopPropagation']?.();
    const _0x6e5ef8 = resolveAudioDownloadTarget({
      'nodeData': typeof _0x544e8c === "function" ? _0x544e8c() : {},
      'audioElement': typeof _0x7a8e94 === "function" ? _0x7a8e94() : null
    });
    if (!_0x6e5ef8) {
      if (typeof _0x407be0 === "function") {
        _0x407be0();
      }
      return;
    }
    if (typeof saveMediaFile !== 'function') {
      triggerAudioDownload(_0x6e5ef8, documentRef);
      return;
    }
    try {
      const _0x5cd759 = await saveMediaFile({
        'kind': "audio",
        'localPath': normalizeLocalPath(_0x6e5ef8["url"]),
        'url': _0x6e5ef8["url"],
        'filename': _0x6e5ef8["filename"]
      });
      if (_0x5cd759?.["canceled"]) {
        return;
      }
      if (_0x5cd759?.["success"] !== ![]) {
        showMediaSaveSuccessToast({
          'result': _0x5cd759,
          'kind': 'audio',
          'showToast': showToast
        });
        return;
      }
      throw new Error(_0x5cd759?.["error"] || "音频保存失败");
    } catch (_0x324821) {
      const _0x287295 = String(_0x324821?.['message'] || _0x324821 || "音频保存失败");
      typeof showToast === "function" && showToast(_0x287295, 'error');
    }
  };
  _0x4f0706['addEventListener']("click", _0x2adee2);
  return () => _0x4f0706["removeEventListener"]('click', _0x2adee2);
}