import { t } from '../../../i18n/index.js';
import { VIDEO_KEYING_TASK_CHANGE_EVENT, cancelVideoKeyingTaskForNode, hasRunningVideoKeyingTaskForNode } from '../../../modules/videoKeyingTaskRuntime.js';
function videoToolbarText(_0x45c226) {
  return t("nodeToolbar.video." + _0x45c226);
}
export function bindVideoKeyingAction(_0x3dacc3) {
  const {
    toolbarEl: _0xd7caf8,
    nodeData: _0x20cae6,
    getStateSnapshot: _0x21e6f2,
    VideoClipController: _0x544ebc,
    VideoKeyingController: _0x245e1a,
    VIDEO_TOOLBAR_FOCUS_PADDING: _0x949878,
    VIDEO_TOOLBAR_FOCUS_DURATION_MS: _0x1d1d41,
    VIDEO_TOOLBAR_FOCUS_MAX_ZOOM: _0x31cc2d,
    KEYING_CANCEL_ICON_HTML: _0x4e91e2
  } = _0x3dacc3;
  const _0x5857a0 = _0xd7caf8["querySelector"]('.act-keying');
  if (_0x5857a0) {
    const _0x23fc7c = {
      'html': _0x5857a0['innerHTML'],
      'tooltip': _0x5857a0['dataset']["tooltip"] || '',
      'aria': _0x5857a0['getAttribute']("aria-label") || '',
      'title': _0x5857a0["title"] || ''
    };
    const _0x2d2df1 = () => String(_0x20cae6?.['id'] || '')["trim"]();
    let _0x45657d = null;
    const _0x5213f5 = () => {
      if (_0xd7caf8['isConnected'] === ![]) {
        window["removeEventListener"]?.(VIDEO_KEYING_TASK_CHANGE_EVENT, _0x5213f5);
        return;
      }
      const _0x1e671c = hasRunningVideoKeyingTaskForNode(_0x2d2df1(), {
        'mode': "keying"
      });
      if (_0x45657d === _0x1e671c) {
        return;
      }
      _0x45657d = _0x1e671c;
      _0x5857a0['classList']["toggle"]("is-task-cancel", _0x1e671c);
      if (_0x1e671c) {
        _0x5857a0["innerHTML"] = _0x4e91e2;
        _0x5857a0['dataset']['tooltip'] = videoToolbarText('cancelKeyingTask');
        _0x5857a0['setAttribute']("aria-label", videoToolbarText("cancelKeyingTask"));
        _0x5857a0["title"] = videoToolbarText('cancelKeyingTask');
        return;
      }
      _0x5857a0["innerHTML"] = _0x23fc7c["html"];
      _0x23fc7c["tooltip"] ? _0x5857a0['dataset']["tooltip"] = _0x23fc7c["tooltip"] : delete _0x5857a0["dataset"]["tooltip"];
      _0x23fc7c['aria'] ? _0x5857a0["setAttribute"]('aria-label', _0x23fc7c["aria"]) : _0x5857a0['removeAttribute']("aria-label");
      _0x5857a0["title"] = _0x23fc7c["title"];
    };
    window["addEventListener"]?.(VIDEO_KEYING_TASK_CHANGE_EVENT, _0x5213f5);
    _0x5857a0['_cleanupKeyingButtonState'] = () => {
      window["removeEventListener"]?.(VIDEO_KEYING_TASK_CHANGE_EVENT, _0x5213f5);
    };
    _0x5213f5();
    _0x5857a0["addEventListener"]("click", _0x3bae3c => {
      _0x3bae3c["preventDefault"]();
      _0x3bae3c["stopPropagation"]();
      if (hasRunningVideoKeyingTaskForNode(_0x2d2df1(), {
        'mode': "keying"
      })) {
        void cancelVideoKeyingTaskForNode(_0x2d2df1(), {
          'mode': 'keying',
          'notify': !![]
        })["finally"](_0x5213f5);
        return;
      }
      const _0x37cc76 = _0x21e6f2();
      if (_0x37cc76["videoKeying"]?.["active"]) {
        window["showToast"]?.(videoToolbarText('exitKeyingMode'), 'info');
        return;
      }
      if (_0x37cc76["videoClip"]?.['active']) {
        window['showToast']?.(videoToolbarText("exitClipMode"), "info");
        return;
      }
      _0x544ebc["exit"]({
        'silent': !![]
      });
      window["v2FocusOnNode"] ? (window['v2FocusOnNode'](_0x20cae6['id'], _0x949878, _0x1d1d41, _0x31cc2d), setTimeout(() => {
        _0x245e1a["init"](_0x20cae6['id']);
      }, _0x1d1d41)) : _0x245e1a["init"](_0x20cae6['id']);
    });
    return _0x5857a0["_cleanupKeyingButtonState"];
  }
  return () => {};
}