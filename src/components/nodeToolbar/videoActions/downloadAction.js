import { t } from '../../../i18n/index.js';
import { showMediaSaveSuccessToast } from '../mediaDownloadFeedback.js';
import { resolveNodeMediaDownloadFilename } from '../mediaDownloadFilename.js';
function toolbarText(_0x62fb7f) {
  return t("nodeToolbar.common." + _0x62fb7f);
}
export function bindVideoDownloadAction(_0x538db7) {
  const {
    toolbarEl: _0x10d4a3,
    fetchRemoteBlob: _0x10d420,
    _triggerHrefDownload: _0x2d88bf,
    _isProbablyLocalUrl: _0x192f1d,
    _getCurrentVideoUrl: _0x4fbb59,
    _getCurrentVideoLocalPath: _0x224f48,
    _getLatestNodeData: _0x2519e1,
    saveMediaFile: _0x6fb619,
    showToast = globalThis["window"]?.["showToast"]
  } = _0x538db7;
  const _0x180ba5 = _0x10d4a3["querySelector"](".act-download");
  _0x180ba5 && _0x180ba5["addEventListener"]('click', async _0x3bb661 => {
    _0x3bb661['stopPropagation']();
    const _0x4953d4 = _0x4fbb59();
    if (!_0x4953d4) {
      alert(toolbarText("noDownloadableVideo"));
      return;
    }
    const _0x1a2dd4 = _0x2519e1?.() || {};
    const _0x3490a7 = resolveNodeMediaDownloadFilename({
      'nodeName': _0x1a2dd4["name"],
      'fileName': _0x1a2dd4['fileName'],
      'kind': "video",
      'sources': [_0x4953d4],
      'fallbackBase': "video_" + Date['now']()
    });
    if (typeof _0x6fb619 === "function") {
      try {
        const _0x11de4e = await _0x6fb619({
          'kind': "video",
          'localPath': _0x224f48?.() || '',
          'url': _0x4953d4,
          'filename': _0x3490a7
        });
        if (_0x11de4e?.["canceled"]) {
          return;
        }
        if (_0x11de4e?.["success"] !== ![]) {
          showMediaSaveSuccessToast({
            'result': _0x11de4e,
            'kind': "video",
            'showToast': showToast
          });
          return;
        }
        throw new Error(_0x11de4e?.["error"] || "视频保存失败");
      } catch (_0x4e399b) {
        const _0x31f83c = String(_0x4e399b?.["message"] || _0x4e399b || "视频保存失败");
        typeof showToast === 'function' ? showToast(_0x31f83c, "error") : alert(_0x31f83c);
        return;
      }
    }
    if (_0x192f1d(_0x4953d4)) {
      _0x2d88bf(_0x4953d4, _0x3490a7);
      return;
    }
    try {
      const _0x46e82a = new AbortController();
      const _0x179264 = setTimeout(() => _0x46e82a["abort"](), 0x4e20);
      const _0x4277fd = await _0x10d420(_0x4953d4, {
        'signal': _0x46e82a["signal"]
      });
      clearTimeout(_0x179264);
      const _0x119e59 = window["URL"]['createObjectURL'](_0x4277fd);
      _0x2d88bf(_0x119e59, _0x3490a7);
      setTimeout(() => window["URL"]['revokeObjectURL'](_0x119e59), 0x5dc);
    } catch {
      _0x2d88bf(_0x4953d4, _0x3490a7);
    }
  });
}