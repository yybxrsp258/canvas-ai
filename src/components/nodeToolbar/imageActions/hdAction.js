import { openImageHdEditor } from './imageHdEditor.js';
import { imageHdText, imageHdOutputText, submitImageHdTask } from './imageHdTask.js';
import { getImageHdModelIds } from '../../../modules/imageHdModelMenu.js';
export function bindImageHdAction(_0x2aff59) {
  const {
    toolbarEl: _0xdafbcf,
    nodeId: _0xb1933a,
    store: _0x234dd5,
    _hdTaskMachine: _0x40bbce,
    _hdState: _0x561d35,
    bindRunningHubToolbarTaskButton: _0x3112ce,
    findRunningHubToolbarTaskForNode: _0x43c331,
    cancelRunningHubResultTask: _0x44d594,
    closeToolbarMoreMenu: _0x26ce61,
    openHdPanel = openImageHdEditor,
    submitHdTask = submitImageHdTask
  } = _0x2aff59;
  const _0x209957 = _0x3b296a => {
    const _0x8927cf = (_0x234dd5["getStateRaw"]?.() || _0x234dd5["getState"]())["nodes"]?.[_0x3b296a]?.["outputText"];
    return _0x8927cf ? imageHdText("outputTextWithStatus", {
      'outputText': _0x8927cf,
      'status': imageHdText("status.cancelled")
    }) : imageHdOutputText({
      'status': imageHdText("status.cancelled")
    });
  };
  let _0x3e320a = ![];
  const _0x5c5da6 = _0xdafbcf['querySelector']('.act-hd');
  _0x5c5da6 && (_0x40bbce["bindButton"](_0x5c5da6), _0x3112ce({
    'button': _0x5c5da6,
    'getTask': () => _0x43c331(_0xb1933a, {
      'models': getImageHdModelIds(),
      'taskTypes': ["image-hd"],
      'outputTextIncludes': [imageHdText('modelLabel'), "RH高清放大"]
    }),
    'cancelTask': async _0x361651 => {
      try {
        if (_0x561d35["active"] && String(_0x561d35['outNodeId'] || '') === _0x361651['outId']) {
          try {
            await _0x40bbce["cancel"]();
          } catch (_0x4df892) {
            console['warn']('[ImageHD]\x20cancel\x20request\x20failed:', _0x4df892);
          }
        }
        return await _0x44d594(_0x361651, {
          'name': imageHdText('cancelledName'),
          'outputText': _0x209957(_0x361651["outId"]),
          'notifyMessage': imageHdText("cancelledToast")
        });
      } finally {
        _0x561d35["active"] && String(_0x561d35['outNodeId'] || '') === _0x361651['outId'] && _0x40bbce['reset'](_0x5c5da6);
      }
    },
    'cancelTooltip': imageHdText("cancelTooltip")
  }), _0x5c5da6["addEventListener"]('click', async _0x29f0e3 => {
    _0x29f0e3["stopPropagation"]();
    _0x29f0e3["preventDefault"]();
    if (_0x561d35['active']) {
      (async () => {
        let _0xf5fb27 = null;
        try {
          const _0x54f057 = _0x561d35["outNodeId"] ? {
            'outId': _0x561d35["outNodeId"],
            'targetNodeId': _0x561d35["outNodeId"],
            'taskId': _0x561d35["taskId"],
            'apiKey': _0x561d35['apiKey'],
            'sourceNodeId': _0xb1933a
          } : null;
          _0x54f057 ? await _0x44d594(_0x54f057, {
            'name': imageHdText('cancelledName'),
            'outputText': _0x209957(_0x54f057['outId']),
            'notifyMessage': imageHdText("cancelledToast")
          }) : (await _0x40bbce["cancel"](), window["showToast"]?.(imageHdText("taskCancelled"), "info"));
        } catch (_0x227471) {
          _0xf5fb27 = _0x227471;
        }
        try {
          _0xf5fb27 && console['warn']("[ImageHD] cancel request failed:", _0xf5fb27);
        } finally {
          _0x40bbce["reset"](_0x5c5da6);
        }
      })();
      return;
    }
    if (_0x3e320a) {
      return;
    }
    _0x3e320a = !![];
    const _0x587cf0 = window["currentProjectId"];
    let _0x38e52e = ![];
    const _0x26422e = () => {
      _0x38e52e = !![];
    };
    const _0x3a5e0f = () => !_0x38e52e && window['currentProjectId'] === _0x587cf0 && !!(_0x234dd5["getStateRaw"]?.() || _0x234dd5['getState']())["nodes"]?.[_0xb1933a];
    window["addEventListener"]("aicanvas:active-canvas-changed", _0x26422e);
    try {
      _0x26ce61?.();
      const _0x4982b9 = await openHdPanel({
        'store': _0x234dd5,
        'sourceNodeId': _0xb1933a,
        'returnFocus': _0x5c5da6
      });
      if (!_0x4982b9 || !_0x3a5e0f()) {
        return;
      }
      await submitHdTask(_0x2aff59, _0x4982b9, _0x3a5e0f);
    } catch (_0x284710) {
      window["showToast"]?.(_0x284710?.["message"] || String(_0x284710), 'error');
    } finally {
      _0x3e320a = ![];
      window['removeEventListener']('aicanvas:active-canvas-changed', _0x26422e);
    }
  }));
}