import { createCollaborationApplication } from '../collaboration/collaborationApplication.js';
import { createCollaborationPanel } from '../collaboration/collaborationPanel.js';
import { createCollaborationPresence } from '../collaboration/collaborationPresence.js';
import { isSubscriptionActive } from '../subscriptionAccess.js';
import { createCollaborationConnectionIndicator } from '../collaboration/collaborationConnectionIndicator.js';
import { onlineCollaborationActors } from '../collaboration/collaborationMembers.js';
import { collaborationMemberColor } from '../collaboration/collaborationMemberColor.js';
import { createSharedProjectIcon } from '../../components/sharedProjectIcon.js';
import { showToast } from '../../services/toastService.js';
import { bindCollaborationEditors } from '../collaboration/collaborationEditorBindings.js';
import { createCollaborationComments } from '../collaboration/collaborationComments.js';
import { drawCollaborationCommentMarkers } from '../collaboration/collaborationCommentMarkers.js';
import { createCollaborationCommentNotifications } from '../collaboration/collaborationCommentNotifications.js';
export function initCanvasCollaboration({
  store: _0x1a09ff,
  canvasTabs: _0x1795df,
  ensureInstallId: _0x3948db,
  ensureDeviceId: _0x18478b,
  resetHistory: _0x489a7e,
  focusNode: _0x83b6ed,
  windowObject = window
}) {
  const _0x33a5f2 = document["querySelector"](".header-right");
  if (!_0x33a5f2) {
    return null;
  }
  let _0x203e05 = ![];
  const _0x3943a1 = document["createElement"]("div");
  _0x3943a1['className'] = 'collaboration-controls';
  const _0x53de02 = createCollaborationConnectionIndicator();
  const _0x530390 = document["createElement"]("span");
  _0x530390["className"] = "collaboration-status";
  _0x530390["setAttribute"]("role", "status");
  const _0x4a4bd3 = document['createElement']("button");
  _0x4a4bd3["className"] = "collaboration-button collaboration-people";
  _0x4a4bd3["type"] = "button";
  const _0x4a6a44 = document["createElement"]('button');
  _0x4a6a44["className"] = "collaboration-button collaboration-entry";
  _0x4a6a44["type"] = "button";
  _0x4a6a44["setAttribute"]("aria-haspopup", 'dialog');
  _0x4a6a44["setAttribute"]('aria-expanded', "false");
  const _0x5daec6 = document["createElement"]("span");
  _0x4a6a44["append"](createSharedProjectIcon(), _0x5daec6);
  _0x3943a1["append"](_0x530390, _0x4a4bd3, _0x53de02['element'], _0x4a6a44);
  _0x33a5f2["insertBefore"](_0x3943a1, _0x33a5f2['querySelector']("#canvasVersionBadge"));
  let _0x4c7a2e = '';
  function _0x1a46f9(_0x13d5c4) {
    const _0xdcb0ea = onlineCollaborationActors(_0x13d5c4, _0x215612["getState"]()["actorId"]);
    const _0x43b93d = (_0x13d5c4?.['members'] || [])["filter"](_0x1e4ff4 => _0xdcb0ea["has"](_0x1e4ff4['id']));
    const _0x5b5a6a = JSON["stringify"](_0x43b93d["map"](_0xd4552b => [_0xd4552b['id'], _0xd4552b["name"], _0xd4552b['colorIndex']]));
    _0x4a4bd3["hidden"] = !_0x13d5c4;
    _0x4a4bd3["setAttribute"]("aria-label", "查看协作成员，" + _0x43b93d["length"] + " 人在线");
    if (_0x5b5a6a === _0x4c7a2e) {
      return;
    }
    _0x4c7a2e = _0x5b5a6a;
    _0x4a4bd3['replaceChildren']();
    for (const _0x5b9b0a of _0x43b93d["slice"](0x0, 0x3)) {
      const _0x412af9 = document["createElement"]("span");
      _0x412af9["className"] = "collaboration-avatar";
      _0x412af9['textContent'] = _0x5b9b0a["name"]['slice'](0x0, 0x1);
      _0x412af9['style']['setProperty']("--member-color", collaborationMemberColor(_0x5b9b0a));
      _0x412af9["title"] = _0x5b9b0a["name"];
      _0x4a4bd3['append'](_0x412af9);
    }
    if (_0x43b93d['length'] > 0x3 || !_0x43b93d["length"]) {
      const _0x2a9396 = document["createElement"]("span");
      _0x2a9396["textContent"] = _0x43b93d["length"] ? '+' + (_0x43b93d["length"] - 0x3) : '成员';
      _0x4a4bd3["append"](_0x2a9396);
    }
  }
  const _0x215612 = createCollaborationApplication({
    'store': _0x1a09ff,
    'canvasTabs': _0x1795df,
    'ensureInstallId': _0x3948db,
    'ensureDeviceId': _0x18478b,
    'resetHistory': _0x489a7e,
    'saveProject': () => windowObject['_v2SaveProjectFromShortcut']?.({
      'waitForDialog': !![]
    }),
    'onNotice': _0x33fbc8 => showToast(_0x33fbc8),
    'onComment': _0x44f109 => _0x39e2a0(_0x44f109),
    'onChange'(_0x11e7c5) {
      _0x573343();
      if (["blocked", 'offline']["includes"](_0x11e7c5["session"]?.["status"])) {
        _0x3aa762["feedback"](_0x11e7c5["session"]["message"]);
      }
    },
    'onPresence'(_0x38c7fb) {
      !_0x203e05 && (_0x53de02["update"](_0x38c7fb), _0x1a46f9(_0x38c7fb), _0x3aa762["renderPresence"](), _0x1c9adf['redraw']());
    }
  });
  const _0x5e51d4 = createCollaborationComments({
    'store': _0x1a09ff,
    'getSession': _0x215612['getSession']
  });
  function _0x25069e(_0x45b655, _0x42becc) {
    if (!_0x1a09ff["getStateRaw"]()["nodes"][_0x45b655]) {
      return;
    }
    _0x215612['getSession']()?.['follow']('');
    _0x83b6ed?.(_0x45b655, 0x60, 0x1f4);
    if (_0x42becc) {
      _0x5e51d4["open"](_0x45b655);
    }
  }
  const _0x39e2a0 = createCollaborationCommentNotifications({
    'getSession': _0x215612["getSession"],
    'hasNode': _0x5f0587 => !!_0x1a09ff["getStateRaw"]()["nodes"][_0x5f0587],
    'openNode': _0x25069e
  });
  const _0x1c9adf = createCollaborationPresence({
    'store': _0x1a09ff,
    'getSession': _0x215612['getSession'],
    'drawComments': _0x2740ce => drawCollaborationCommentMarkers({
      ..._0x2740ce,
      'comments': _0x5e51d4
    })
  });
  const _0x2aeffb = bindCollaborationEditors({
    'store': _0x1a09ff,
    'windowObject': windowObject
  });
  function _0x573343() {
    if (_0x203e05) {
      return;
    }
    const _0x31551e = _0x215612["getState"]()["session"];
    _0x53de02["update"](_0x31551e);
    _0x5daec6['textContent'] = _0x31551e ? "协作中 · " + (_0x31551e["hosting"] ? '房主' : '成员') : isSubscriptionActive(_0x1a09ff["getStateRaw"]()["subscription"] || {}) ? "开启协作" : "协作 · 需激活";
    _0x4a6a44['classList']['toggle']("is-active", !!_0x31551e);
    const _0x315980 = _0x31551e?.["status"] === 'connecting';
    _0x4a6a44["setAttribute"]("aria-busy", String(!!_0x315980));
    _0x530390['textContent'] = _0x31551e ? _0x31551e["status"] === 'online' ? '' : _0x31551e["status"] === "offline" ? "连接中断" : _0x31551e["status"] === "blocked" ? '协作已暂停' : "连接中" : '';
    _0x530390["title"] = _0x31551e?.["status"] === "online" ? '' : _0x31551e?.["message"] || '';
    _0x530390["hidden"] = !_0x31551e || _0x31551e["status"] === "online";
    _0x1a46f9(_0x31551e);
    _0x3aa762['render']();
    _0x1c9adf['redraw']();
    _0x5e51d4["update"]();
  }
  const _0x3aa762 = createCollaborationPanel({
    'actions': {
      ..._0x215612["actions"],
      'activate': () => windowObject['openSubscriptionDialog']?.(),
      'copy': _0x28f9a4 => navigator["clipboard"]["writeText"](_0x28f9a4),
      'refreshReview': () => _0x215612["getSession"]()?.['review']["refresh"](undefined, !![]),
      'hasReviewNode': _0x39f3ee => !!_0x1a09ff["getStateRaw"]()["nodes"][_0x39f3ee],
      'openReviewNode': _0x25069e
    },
    'getState': _0x215612["getState"],
    'anchor': _0x4a6a44,
    'keepOpenOnOutside': _0x48a9bb => !!_0x48a9bb['closest']?.("#fabBtn, .agent-sidebar")
  });
  function _0x1e8a53() {
    _0x3aa762["show"]();
    void _0x215612["ensureAuthenticated"]()["catch"](() => {});
  }
  _0x4a6a44["addEventListener"]("click", () => {
    _0x3aa762["toggle"]();
    void _0x215612["ensureAuthenticated"]()["catch"](() => {});
  });
  _0x4a4bd3["addEventListener"]('click', _0x1e8a53);
  const _0x50f404 = document["createElement"]("button");
  _0x50f404['type'] = 'button';
  _0x50f404['className'] = "cpd-new-btn";
  _0x50f404["textContent"] = "协作画布";
  _0x50f404["addEventListener"]("click", _0x1e8a53);
  document['querySelector'](".cpd-footer")?.['append'](_0x50f404);
  const _0x3980e1 = _0x1a09ff["subscribeSelector"](_0x16dfa8 => _0x16dfa8["subscription"], _0x573343);
  windowObject["addEventListener"]("aicanvas:active-canvas-changed", _0x215612["refreshCanvas"]);
  const _0x534de6 = _0x28e602 => {
    const _0x103c05 = _0x215612["getSession"]();
    _0x103c05 && !_0x103c05["canDetach"]() && (_0x28e602["preventDefault"](), _0x28e602["returnValue"] = '');
  };
  windowObject["addEventListener"]('beforeunload', _0x534de6);
  _0x573343();
  return {
    'show': _0x1e8a53,
    'getSession': _0x215612["getSession"],
    'destroy'() {
      _0x203e05 = !![];
      _0x2aeffb();
      const _0x97e5c6 = _0x215612["destroy"]();
      _0x3980e1();
      _0x3aa762["destroy"]();
      _0x1c9adf["destroy"]();
      _0x5e51d4["destroy"]();
      _0x3943a1['remove']();
      _0x50f404["remove"]();
      windowObject["removeEventListener"]('beforeunload', _0x534de6);
      windowObject["removeEventListener"]('aicanvas:active-canvas-changed', _0x215612["refreshCanvas"]);
      return _0x97e5c6;
    }
  };
}