import { canUseLocalAssetCleanup, formatCleanupBytes, scanLocalAssetCleanup, summarizeLocalAssetCleanupScan, trashLocalAssetCleanup } from '../../services/localAssetCleanupService.js';
import { t } from '../../i18n/index.js';
import { showError, showSuccess } from '../../services/toastService.js';
import { createLocalAssetCleanupList } from './localAssetCleanupList.js';
const text = (_0x423365, _0x2d78da = {}) => t("settings.fileSave.localCleanup." + _0x423365, _0x2d78da);
const runtimeText = (_0x11e1c3, _0x2144a8 = {}) => t("settings.fileSave.cleanupRuntime." + _0x11e1c3, _0x2144a8);
export function initLocalAssetCleanupSettings() {
  const _0x47a167 = document["getElementById"]("localAssetCleanupCard");
  const _0x52a1eb = document["getElementById"]("btnLocalAssetCleanupScan");
  const _0x3db1a0 = document["getElementById"]("btnLocalAssetCleanupTrash");
  if (!_0x47a167 || !_0x52a1eb || !_0x3db1a0) {
    return;
  }
  _0x47a167["hidden"] = !canUseLocalAssetCleanup();
  if (_0x47a167["hidden"] || _0x47a167["dataset"]["cleanupInitialized"]) {
    return;
  }
  _0x47a167["dataset"]["cleanupInitialized"] = "true";
  const _0x501d13 = document["getElementById"]("localAssetCleanupStatus");
  const _0x1581d2 = document["getElementById"]("localAssetCleanupCount");
  const _0x2d2fff = document["getElementById"]("localAssetCleanupSize");
  let _0x2d2d75 = null;
  let _0x2ffadf = ![];
  const _0x15ffaa = createLocalAssetCleanupList({
    'list': document["getElementById"]("localAssetCleanupList"),
    'toolbar': document["getElementById"]("localAssetCleanupToolbar"),
    'details': document["getElementById"]('localAssetCleanupDetails'),
    'onSelectionChange': _0x2e0381 => {
      _0x3db1a0["disabled"] = _0x2ffadf || !_0x2e0381['length'];
    }
  });
  function _0x2f545d(_0x20e1d1, _0x57dad2 = '') {
    _0x501d13["textContent"] = _0x20e1d1;
    _0x501d13["classList"]["toggle"]("is-error", _0x57dad2 === "error");
    _0x501d13["classList"]["toggle"]("is-success", _0x57dad2 === "success");
  }
  function _0x2c6224(_0x1ef6ce, _0x23a588) {
    _0x2ffadf = _0x1ef6ce;
    _0x52a1eb['disabled'] = _0x1ef6ce;
    for (const [_0x30f1dd, _0x4589e5] of [[_0x52a1eb, "scan"], [_0x3db1a0, 'trash']]) {
      _0x30f1dd["setAttribute"]('aria-busy', String(_0x1ef6ce && _0x23a588 === _0x4589e5));
      _0x30f1dd['textContent'] = text(_0x1ef6ce && _0x23a588 === _0x4589e5 ? _0x4589e5 + "Busy" : _0x4589e5);
    }
    _0x15ffaa['setBusy'](_0x1ef6ce);
  }
  function _0x127ee8(_0x3d3403) {
    _0x2d2d75 = _0x3d3403 ? {
      ..._0x3d3403,
      'items': Array["isArray"](_0x3d3403["items"]) ? _0x3d3403["items"] : []
    } : null;
    _0x1581d2["textContent"] = String(_0x2d2d75?.["items"]["length"] || 0x0);
    _0x2d2fff["textContent"] = formatCleanupBytes(_0x2d2d75?.["orphanBytes"]);
    _0x15ffaa["setScan"](_0x2d2d75);
    if (_0x2d2d75) {
      _0x2f545d(summarizeLocalAssetCleanupScan(_0x2d2d75), _0x2d2d75['ok'] ? '' : "error");
    }
  }
  _0x127ee8(null);
  _0x2f545d(text("idle"));
  _0x52a1eb["addEventListener"]("click", async () => {
    if (_0x2ffadf) {
      return;
    }
    _0x127ee8(null);
    _0x2c6224(!![], "scan");
    _0x2f545d(text('scanning'));
    try {
      _0x127ee8(await scanLocalAssetCleanup());
    } catch (_0x16c00b) {
      _0x2f545d(_0x16c00b?.["message"] || runtimeText("scanFailed"), "error");
      showError(runtimeText("scanFailedDetail", {
        'error': _0x16c00b?.['message'] || runtimeText('scanFailed')
      }));
    } finally {
      _0x2c6224(![]);
    }
  });
  _0x3db1a0["addEventListener"]('click', async () => {
    if (_0x2ffadf || !_0x2d2d75?.['ok'] || _0x2d2d75["canTrash"] === ![]) {
      return;
    }
    const _0x5073c2 = _0x15ffaa['selectedItems']();
    if (!_0x5073c2["length"]) {
      return;
    }
    const _0x469939 = window['confirm']?.(runtimeText("confirmTrash", {
      'count': _0x5073c2["length"],
      'bytes': formatCleanupBytes(_0x5073c2["reduce"]((_0x5743cb, _0x32141b) => _0x5743cb + Number(_0x32141b["size"] || 0x0), 0x0))
    }));
    if (!_0x469939) {
      return;
    }
    _0x2c6224(!![], "trash");
    _0x2f545d(text('trashing'));
    try {
      const _0xb45f53 = await trashLocalAssetCleanup(_0x2d2d75, _0x5073c2["map"](_0x41e6a2 => _0x41e6a2['localPath']));
      const _0x36855a = _0xb45f53?.["skipped"]?.["length"] || 0x0;
      const _0x100fae = _0xb45f53?.["errors"]?.["length"] || 0x0;
      const _0x1d13f2 = runtimeText("trashedMessage", {
        'count': _0xb45f53?.["trashedCount"] || 0x0,
        'bytes': formatCleanupBytes(_0xb45f53?.["trashedBytes"])
      });
      const _0x43e3b9 = _0x36855a || _0x100fae ? runtimeText("trashPartial", {
        'message': _0x1d13f2,
        'skipped': _0x36855a,
        'failed': _0x100fae
      }) : _0x1d13f2;
      _0x127ee8(null);
      try {
        const _0x24b84a = await scanLocalAssetCleanup();
        _0x127ee8(_0x24b84a);
        _0x2f545d(_0x24b84a['ok'] ? _0x43e3b9 : _0x43e3b9 + '；' + runtimeText("scanIncomplete"), _0x100fae || !_0x24b84a['ok'] ? 'error' : "success");
      } catch (_0x2013cb) {
        _0x2f545d(runtimeText('refreshFailed', {
          'message': _0x43e3b9,
          'error': _0x2013cb?.["message"] || runtimeText("scanFailed")
        }), "error");
      }
      if (_0x100fae) {
        showError(runtimeText("trashPartialToast"));
      } else {
        showSuccess(_0x43e3b9);
      }
    } catch (_0x3fdc2e) {
      _0x127ee8(null);
      _0x2f545d(_0x3fdc2e?.["message"] || runtimeText("trashFailed"), "error");
      showError(runtimeText('trashFailedDetail', {
        'error': _0x3fdc2e?.["message"] || runtimeText("trashFailed")
      }));
    } finally {
      _0x2c6224(![]);
    }
  });
}