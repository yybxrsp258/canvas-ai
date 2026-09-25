import { beginModalInteraction } from '../../services/modalInteractionScope.js';
import { createCollaborationLobby } from './collaborationLobby.js';
import { createCollaborationMembers } from './collaborationMembers.js';
import { createCollaborationInvitation } from './collaborationInvitation.js';
import { createCollaborationActivity } from './collaborationActivity.js';
import { createContextMenuIcon } from '../../components/contextMenuIcon.js';
import { ADVANCED_SETTINGS_TUNE_ICON_MARKUP } from '../../components/sharedIconMarkup.js';
const ROLE_NAMES = {
  'owner': '房主',
  'admin': "管理员",
  'editor': '可编辑',
  'viewer': '只读'
};
const QUIET_SYNC_MESSAGES = new Set(['已同步', '正在同步修改', '房主已接收修改\x20·\x20项目文件由房主保存']);
function element(_0x49cf09, _0x353cf6 = '', _0x458c84 = '') {
  const _0x3aab78 = document["createElement"](_0x49cf09);
  _0x3aab78["className"] = _0x353cf6;
  _0x3aab78["textContent"] = _0x458c84;
  if (_0x49cf09 === "summary") {
    _0x3aab78["tabIndex"] = 0x0;
  }
  return _0x3aab78;
}
export function createCollaborationPanel({
  actions: _0x157096,
  getState: _0x6bf9fe,
  anchor = null,
  keepOpenOnOutside = () => ![]
}) {
  const _0x507f1b = element("dialog", "collaboration-dialog");
  _0x507f1b["setAttribute"]("aria-labelledby", "collaboration-title");
  const _0x4042f7 = element('div', 'collaboration-heading');
  const _0x7f322b = element('h2', '', "画布协作");
  _0x7f322b['id'] = 'collaboration-title';
  const _0x1bdc16 = element("button", "collaboration-button collaboration-quiet collaboration-close");
  _0x1bdc16["type"] = "button";
  _0x1bdc16["setAttribute"]("aria-label", '关闭');
  _0x1bdc16["title"] = '关闭';
  _0x1bdc16["append"](createContextMenuIcon("cancel"));
  _0x4042f7["append"](_0x7f322b, _0x1bdc16);
  const _0x5c6dff = element('p', "collaboration-feedback");
  _0x5c6dff['setAttribute']("role", "status");
  _0x5c6dff["setAttribute"]("aria-live", "polite");
  _0x4042f7["insertBefore"](_0x5c6dff, _0x1bdc16);
  const _0x5dbb8a = element("div", "collaboration-body");
  const _0x33d030 = {};
  let _0x38c40c = () => {};
  let _0x2b36ec = ![];
  function _0x139bce() {
    !_0x2b36ec && (_0x2b36ec = !![], _0x38c40c = beginModalInteraction({
      'root': _0x507f1b,
      'onClose': _0x2ffee6,
      'returnFocus': anchor || undefined
    }));
  }
  let _0x3d8ff7 = ![];
  let _0x5d4c58 = ![];
  let _0x2f1d26 = '';
  let _0x743587 = '';
  let _0x13cf42 = '';
  function _0x35c41e(_0x1fb4fe) {
    const _0xe76283 = element('section', 'collaboration-section');
    _0x5dbb8a['append'](_0xe76283);
    _0x33d030[_0x1fb4fe] = _0xe76283;
    return _0xe76283;
  }
  function _0x37c024(_0xb85116, _0x415f68, _0x5b984d, _0x45dd0a) {
    const _0x3f0c93 = element("button", "collaboration-button", _0xb85116);
    _0x3f0c93["type"] = "button";
    _0x3f0c93["addEventListener"]("click", () => {
      if (_0x45dd0a !== ![]) {
        return _0x40821f(_0x3f0c93, _0x415f68, _0x45dd0a);
      }
      try {
        _0x415f68();
      } catch (_0x2e881d) {
        _0x5d4c58 = !![];
        _0x5c6dff['hidden'] = ![];
        _0x5c6dff["textContent"] = _0x2e881d['message'];
      }
    });
    _0x5b984d["append"](_0x3f0c93);
    return _0x3f0c93;
  }
  function _0x2d7337(_0x298b45, _0x2e57d3, {
    type = "text",
    placeholder = ''
  } = {}) {
    const _0x509bc1 = element("label", "collaboration-field", _0x298b45);
    const _0x35afab = element("input", "collaboration-input");
    _0x35afab["type"] = type;
    _0x35afab["placeholder"] = placeholder;
    _0x35afab['autocomplete'] = "off";
    _0x509bc1["append"](_0x35afab);
    _0x2e57d3['append'](_0x509bc1);
    return _0x35afab;
  }
  async function _0x40821f(_0x529774, _0x3dcd63, _0x21276a = "正在处理…") {
    if (_0x3d8ff7) {
      return ![];
    }
    _0x3d8ff7 = !![];
    _0x5d4c58 = ![];
    _0x529774["disabled"] = !![];
    _0x529774["setAttribute"]("aria-busy", "true");
    _0x3b4652["setBusy"](!![]);
    _0x5c6dff['hidden'] = ![];
    _0x5c6dff['classList']["add"]("is-pending");
    _0x5c6dff["textContent"] = _0x21276a;
    try {
      await _0x3dcd63();
      if (_0x5c6dff['textContent'] === _0x21276a) {
        _0x5c6dff["textContent"] = _0x6bf9fe()['session']?.['message'] || "操作完成";
      }
    } catch (_0x3214f7) {
      _0x5d4c58 = !![];
      _0x5c6dff["textContent"] = _0x3214f7["name"] === "AbortError" ? "操作已取消" : _0x3214f7["message"] || "操作失败，请重试";
    } finally {
      _0x3d8ff7 = ![];
      _0x529774['disabled'] = ![];
      _0x3b4652["setBusy"](![]);
      _0x529774['removeAttribute']('aria-busy');
      _0x5c6dff["classList"]["remove"]("is-pending");
      _0xebe542();
    }
    return !![];
  }
  const _0x4e9537 = _0x35c41e('auth');
  _0x4e9537["append"](element('p', '', "协作无需激活，配置好协作服务后即可使用。"));
  const _0x35fbe5 = _0x37c024("重新验证", () => _0x157096["authenticate"](), _0x4e9537);
  const _0x4ad48e = _0x37c024("激活画布", () => {
    _0x5363dc();
    _0x157096["activate"]();
  }, _0x4e9537);
  const _0x5f45aa = _0x35c41e("lobby");
  const _0x1d8fcf = createCollaborationLobby({
    'root': _0x5f45aa,
    'head': _0x4042f7,
    'actions': _0x157096,
    'element': element,
    'button': _0x37c024,
    'input': _0x2d7337,
    'run': _0x40821f,
    'isBusy': () => _0x3d8ff7
  });
  const _0x5adfba = _0x35c41e("active");
  _0x1d8fcf["mountSession"](_0x5adfba);
  const _0x370011 = element("div", 'collaboration-room-header');
  _0x5adfba['append'](_0x370011);
  _0x370011["append"](createContextMenuIcon("source", {
    'size': 0x1c
  }));
  const _0x47f93e = element("div", "collaboration-room-info");
  _0x370011["append"](_0x47f93e);
  const _0x27b72d = element('h3');
  const _0x50a134 = element('span', "collaboration-room-role-badge");
  const _0x4ac821 = element('p', "collaboration-subtle collaboration-room-status");
  _0x47f93e["append"](_0x27b72d, _0x50a134, _0x4ac821);
  const _0x470ac9 = element("div", "collaboration-session-footer");
  _0x470ac9['append'](element("span", "collaboration-subtle", '项目由房主保存'));
  const _0x27e84f = element('div', "collaboration-disconnect-slot");
  _0x470ac9["append"](_0x27e84f);
  const _0x4515bd = element("button", 'collaboration-button', "结束本次联机");
  _0x4515bd["type"] = 'button';
  const _0x131425 = element("div", 'collaboration-disconnect-confirm');
  _0x131425["hidden"] = !![];
  _0x131425['setAttribute']('role', "group");
  _0x131425["setAttribute"]("aria-label", "确定结束本次联机");
  _0x27e84f['append'](_0x4515bd, _0x131425);
  let _0x126c90 = '';
  let _0x54be6d = null;
  function _0x5495e1(_0x396198 = ![]) {
    _0x126c90 = '';
    _0x4515bd['hidden'] = ![];
    _0x131425['hidden'] = !![];
    _0x470ac9["classList"]['remove']("is-confirming");
    if (_0x396198 && _0x507f1b["open"] && _0x6bf9fe()['session']) {
      _0x4515bd["focus"]();
    }
  }
  async function _0x363d76(_0x353803 = ![]) {
    if (!_0x126c90 || _0x6bf9fe()["session"]?.['roomId'] !== _0x126c90) {
      _0x5495e1();
      return;
    }
    _0x54be6d = new AbortController();
    try {
      if (_0x353803) {
        _0x38c40c({
          'restoreFocus': ![]
        });
        _0x2b36ec = ![];
        await _0x157096['saveAndDisconnect']({
          'signal': _0x54be6d["signal"]
        });
      } else {
        await _0x157096["disconnect"]({
          'signal': _0x54be6d["signal"],
          'preserveDraft': !![]
        });
      }
    } finally {
      _0x54be6d = null;
      _0x5495e1(!![]);
    }
  }
  const _0x212086 = _0x37c024('确定', () => _0x363d76(), _0x131425, "正在结束联机…");
  _0x212086["classList"]['add']("collaboration-danger");
  const _0x1597f5 = _0x37c024("保存并确定", () => _0x363d76(!![]), _0x131425, "正在保存项目并结束联机…");
  _0x1597f5["classList"]["add"]("collaboration-primary");
  const _0x4fdd06 = element("button", "collaboration-button", '取消');
  _0x4fdd06['type'] = 'button';
  _0x4fdd06["addEventListener"]("click", () => {
    if (_0x54be6d) {
      _0x54be6d["abort"]();
    } else {
      if (!_0x3d8ff7) {
        _0x5495e1(!![]);
      }
    }
  });
  _0x131425["prepend"](_0x4fdd06);
  _0x4515bd["addEventListener"]('click', () => {
    if (_0x3d8ff7 || !_0x6bf9fe()["session"]) {
      return;
    }
    _0x126c90 = _0x6bf9fe()["session"]["roomId"];
    _0x4515bd["hidden"] = !![];
    _0x131425['hidden'] = ![];
    _0x4fdd06["focus"]();
    _0x470ac9['classList']['add']("is-confirming");
  });
  _0x131425["addEventListener"]("keydown", _0x44c707 => {
    if (_0x44c707['key'] === "Escape") {
      _0x44c707["preventDefault"]();
      _0x44c707["stopPropagation"]();
      if (_0x54be6d) {
        _0x54be6d["abort"]();
      } else {
        if (!_0x3d8ff7) {
          _0x5495e1(!![]);
        }
      }
    }
  });
  const _0x3a31f1 = element("div", "collaboration-invite-section");
  _0x5adfba["append"](_0x3a31f1);
  const _0x3b4652 = createCollaborationInvitation({
    'root': _0x3a31f1,
    'element': element,
    'button': _0x37c024,
    'input': _0x2d7337,
    'actions': _0x157096,
    'getState': _0x6bf9fe,
    'feedback': _0x4b0977 => {
      _0x5c6dff["textContent"] = _0x4b0977;
    }
  });
  const _0x545a2e = element('div', "collaboration-member-heading");
  _0x5adfba['append'](_0x545a2e);
  const _0x2b4ffe = element('h4');
  _0x545a2e['append'](_0x2b4ffe);
  const _0xee0177 = element("div", 'collaboration-list\x20collaboration-members');
  _0xee0177["setAttribute"]('aria-label', "协作成员");
  _0x5adfba["append"](_0xee0177);
  const _0x12817d = _0x37c024("召集成员到我的视角", () => _0x157096["summon"](), _0x5adfba);
  _0x12817d["classList"]['add']("collaboration-text-action", "collaboration-summon");
  _0x12817d['prepend'](createContextMenuIcon('select-all'));
  const _0x3d7264 = createCollaborationMembers({
    'root': _0xee0177,
    'element': element,
    'button': _0x37c024,
    'run': _0x40821f,
    'actions': _0x157096,
    'confirmAction': _0x529503,
    'getState': _0x6bf9fe
  });
  const _0xa88eb = element('details', 'collaboration-management');
  const _0x364d1f = element("summary", '', "房间设置");
  const _0x2bd42d = element('span');
  _0x2bd42d["innerHTML"] = ADVANCED_SETTINGS_TUNE_ICON_MARKUP;
  _0x364d1f["prepend"](_0x2bd42d);
  _0xa88eb["append"](_0x364d1f);
  const _0x52ad91 = element("div", "collaboration-actions");
  _0xa88eb["append"](_0x52ad91);
  const _0x43530a = _0x37c024("使所有邀请信息失效", async () => {
    await _0x157096["revokeInvites"]();
    _0x3b4652["invalidate"]();
  }, _0x52ad91);
  const _0x3903a9 = _0x37c024('关闭协作', () => _0x529503("关闭后所有成员将无法访问此房间，本机内容保留。确认关闭？", () => _0x157096["closeRoom"]()), _0x52ad91);
  const _0x30af13 = _0x37c024('退出成员列表', () => _0x529503("退出后需要使用有效邀请重新加入，确认退出？", () => _0x157096["leaveRoom"]()), _0x52ad91);
  const _0xa5ccba = element("div", "collaboration-task-list");
  _0x5adfba['append'](_0xa5ccba);
  const _0x2a255f = createCollaborationActivity({
    'root': _0x5adfba,
    'getState': _0x6bf9fe,
    'actions': _0x157096
  });
  const _0x4eb9d5 = element("div", 'collaboration-section');
  _0x5adfba['append'](_0x4eb9d5);
  const _0x4a5d22 = element('p');
  _0x4eb9d5["append"](_0x4a5d22);
  _0x37c024('使用房主版本', () => _0x529503("放弃这些冲突节点的本机修改，使用房主版本？", () => _0x157096["resolveConflicts"](![])), _0x4eb9d5);
  _0x37c024("提交本机版本", () => _0x529503('用本机内容重新提交这些冲突节点？房主会再次检查权限和节点占用。', () => _0x157096["resolveConflicts"](!![])), _0x4eb9d5);
  const _0xea2826 = element('p', "collaboration-subtle");
  _0x5adfba["append"](_0xea2826);
  _0x1d8fcf["mountSessionControls"](_0xa88eb, _0x470ac9);
  const _0x5b4208 = _0x35c41e('confirmation');
  _0x5b4208["hidden"] = !![];
  const _0x648b49 = element('p');
  _0x5b4208["append"](_0x648b49);
  let _0x392816 = null;
  let _0x192c79 = '';
  _0x37c024('确认', async () => {
    const _0x564d2e = _0x392816;
    _0x392816 = null;
    _0x5b4208['hidden'] = !![];
    if (_0x6bf9fe()['session']?.["roomId"] === _0x192c79) {
      await _0x564d2e?.();
    }
  }, _0x5b4208);
  _0x37c024('取消', () => {
    _0x392816 = null;
    _0x5b4208["hidden"] = !![];
  }, _0x5b4208);
  function _0x529503(_0x33b02c, _0x1b1df8) {
    _0x192c79 = _0x6bf9fe()['session']?.["roomId"];
    _0x648b49["textContent"] = _0x33b02c;
    _0x392816 = _0x1b1df8;
    _0x5b4208["hidden"] = ![];
    _0x5b4208["querySelector"]('button')["focus"]();
  }
  _0x507f1b['append'](_0x4042f7, _0x5dbb8a);
  document['body']["append"](_0x507f1b);
  let _0x16a33e = 0x0;
  let _0x123390 = '';
  function _0x5363dc(_0x155c4f = !![]) {
    cancelAnimationFrame(_0x16a33e);
    _0x3b4652["close"]();
    _0x3d7264["close"]();
    _0x1d8fcf["resetHostChoice"]();
    _0x5495e1();
    _0x392816 = null;
    _0x5b4208['hidden'] = !![];
    _0x38c40c({
      'restoreFocus': _0x155c4f
    });
    _0x2b36ec = ![];
    _0x507f1b["close"]();
    anchor?.["setAttribute"]("aria-expanded", "false");
  }
  function _0x2ffee6() {
    _0x5363dc();
  }
  _0x1bdc16["addEventListener"]("click", _0x2ffee6);
  _0x507f1b['addEventListener']("cancel", _0x221831 => {
    _0x221831['preventDefault']();
    _0x2ffee6();
  });
  const _0x4c6e3b = _0x239c66 => {
    if (!_0x507f1b['open']) {
      return;
    }
    if (_0x507f1b["contains"](_0x239c66["target"])) {
      _0x139bce();
      return;
    }
    if (anchor?.["contains"](_0x239c66["target"])) {
      return;
    }
    if (keepOpenOnOutside(_0x239c66["target"])) {
      _0x3b4652["close"]();
      _0x3d7264["close"]();
      _0x38c40c({
        'restoreFocus': ![]
      });
      _0x2b36ec = ![];
    } else {
      _0x5363dc(![]);
    }
  };
  document["addEventListener"]("pointerdown", _0x4c6e3b, !![]);
  function _0x206f7e() {
    const _0xda1612 = anchor?.['getBoundingClientRect']();
    const _0x18bfc7 = Math['min'](_0xda1612?.["bottom"] || 0x30, window['innerHeight'] / 0x3) + 0xa;
    const _0x224ab2 = Math['max'](0xc, Math["min"](window["innerWidth"] - (_0xda1612?.["right"] || window["innerWidth"] - 0x10), window["innerWidth"] - _0x507f1b['offsetWidth'] - 0xc));
    const _0x1f0100 = _0x18bfc7 + ':' + _0x224ab2;
    _0x1f0100 !== _0x123390 && (_0x123390 = _0x1f0100, _0x507f1b["style"]["setProperty"]('--collaboration-top', _0x18bfc7 + 'px'), _0x507f1b["style"]["setProperty"]("--collaboration-right", _0x224ab2 + 'px'));
    if (_0x507f1b["open"]) {
      _0x16a33e = requestAnimationFrame(_0x206f7e);
    }
  }
  function _0xebe542() {
    const _0x14d1d3 = _0x6bf9fe();
    _0x1597f5['hidden'] = !_0x14d1d3["session"]?.["hosting"];
    const _0x41d466 = _0x14d1d3["session"]?.["roomId"] || '';
    _0x41d466 !== _0x2f1d26 && (_0x2f1d26 = _0x41d466, _0x5d4c58 = ![]);
    if (_0x126c90 && _0x14d1d3["session"]?.['roomId'] !== _0x126c90) {
      _0x5495e1();
    }
    _0x192c79 && _0x14d1d3["session"]?.["roomId"] !== _0x192c79 && (_0x392816 = null, _0x5b4208["hidden"] = !![]);
    _0x33d030["auth"]["hidden"] = !!_0x14d1d3['authenticated'] && !_0x14d1d3["authenticating"];
    _0x33d030["lobby"]["hidden"] = (!_0x14d1d3['authenticated'] || !!_0x14d1d3["authenticating"]) && !_0x14d1d3["session"];
    _0x33d030['active']["hidden"] = !_0x14d1d3['session'];
    _0x1d8fcf["render"](_0x14d1d3);
    _0x3b4652['render'](_0x14d1d3);
    _0x2a255f['render']();
    const _0x3063d4 = _0x3d7264["render"](_0x14d1d3);
    _0x507f1b["classList"]["toggle"]("is-lobby", !_0x33d030["lobby"]["hidden"]);
    _0x507f1b["classList"]['toggle']('is-session', !!_0x14d1d3["session"]);
    _0x35fbe5["hidden"] = !!_0x14d1d3['authenticating'];
    _0x4ad48e["hidden"] = _0x14d1d3['authError']?.['code'] !== "ACTIVATION_REQUIRED";
    const _0x503a0f = _0x14d1d3["session"]?.["status"] === 'connecting';
    _0x507f1b['setAttribute']('aria-busy', String(_0x3d8ff7 || !!_0x14d1d3["authenticating"] || _0x503a0f));
    if (!_0x3d8ff7) {
      _0x5c6dff["classList"]["toggle"]('is-pending', !!_0x14d1d3["authenticating"] || _0x503a0f);
      if (_0x14d1d3['authenticating']) {
        _0x5c6dff["textContent"] = "正在验证当前设备的画布授权…";
      } else {
        if (_0x14d1d3["authError"]) {
          _0x5c6dff["textContent"] = _0x14d1d3["authError"]["message"];
        } else {
          if (_0x5c6dff["textContent"] === "正在验证当前设备的画布授权…") {
            _0x5c6dff["textContent"] = '';
          }
        }
      }
    }
    const _0x2e5116 = _0x14d1d3["session"]?.["message"] || '';
    if (!_0x3d8ff7 && !_0x5d4c58 && _0x2e5116 && _0x2e5116 !== _0x743587) {
      _0x5c6dff['textContent'] = _0x2e5116;
    }
    _0x743587 = _0x2e5116;
    _0x5c6dff["hidden"] = !_0x3d8ff7 && !_0x14d1d3['authenticating'] && QUIET_SYNC_MESSAGES["has"](_0x5c6dff["textContent"]);
    _0x5c6dff["title"] = _0x5c6dff['textContent'];
    !_0x14d1d3["session"] && (_0x5b4208["hidden"] = !![], _0x392816 = null);
    if (_0x14d1d3["session"]) {
      _0x27b72d["textContent"] = _0x14d1d3["session"]['name'];
      _0x50a134['textContent'] = ROLE_NAMES[_0x14d1d3["session"]["role"]];
      _0x4ac821["textContent"] = (_0x14d1d3["session"]["hosting"] ? "本机开房" : '已加入房间') + " · " + _0x3063d4 + " 人在线";
      _0x4ac821["dataset"]['status'] = _0x14d1d3["session"]['status'] || "connecting";
      _0x2b4ffe["textContent"] = '成员\x20·\x20' + (_0x14d1d3['session']['members']?.["length"] || 0x0);
      _0x12817d['hidden'] = _0x14d1d3['session']["role"] !== "owner";
      _0x4eb9d5["hidden"] = !_0x14d1d3["session"]["conflicts"]?.['length'];
      _0x4a5d22['textContent'] = "以下节点或连线存在冲突，其他内容可继续协作：" + (_0x14d1d3["session"]['conflicts'] || [])["map"](_0x3d89e1 => _0x3d89e1['id'])["join"]('、');
      _0xea2826["textContent"] = _0x14d1d3["session"]["recoveryError"] || '';
      _0xea2826["hidden"] = !_0x14d1d3["session"]['recoveryError'];
      const _0x59591b = ["owner", 'admin']["includes"](_0x14d1d3['session']["role"]);
      _0x43530a["hidden"] = !_0x59591b;
      _0x3903a9["hidden"] = _0x14d1d3["session"]["role"] !== "owner";
      _0x30af13["hidden"] = _0x14d1d3["session"]['role'] === 'owner';
      const _0x38c9ac = JSON["stringify"]([_0x14d1d3["session"]['jobs'], _0x14d1d3["session"]["role"]]);
      if (_0x38c9ac !== _0x13cf42) {
        _0x13cf42 = _0x38c9ac;
        _0xa5ccba['replaceChildren']();
        for (const _0x138711 of (_0x14d1d3["session"]['jobs'] || [])['filter'](_0x13edfd => _0x13edfd["status"] === "running")) {
          _0xa5ccba['append'](element('p', '', "节点 " + _0x138711["node"] + '\x20正在由' + (_0x14d1d3["session"]["members"]["find"](_0x25b174 => _0x25b174['id'] === _0x138711["actor"])?.["name"] || '成员') + '生成'));
          if (_0x138711["actor"] === _0x14d1d3["actorId"] || _0x14d1d3["session"]["role"] === "owner") {
            _0x37c024("处理离线任务", () => _0x529503("请先确认模型服务中的任务已停止或结束。此操作只解除协作占用，不会取消模型服务中的任务，确认已结束？", () => _0x157096["resolveTask"](_0x138711)), _0xa5ccba);
          }
        }
      }
    }
  }
  return {
    'show'() {
      if (!_0x507f1b["open"]) {
        _0x5c6dff["textContent"] = _0x6bf9fe()['session']?.["message"] || '';
      }
      _0xebe542();
      if (_0x507f1b["open"]) {
        return;
      }
      _0x507f1b["show"]();
      _0x206f7e();
      anchor?.["setAttribute"]("aria-expanded", "true");
      _0x139bce();
    },
    'toggle'() {
      if (_0x507f1b['open']) {
        _0x2ffee6();
      } else {
        this["show"]();
      }
    },
    'render': _0xebe542,
    'renderPresence'() {
      if (!_0x507f1b["open"]) {
        return;
      }
      const _0x2da71c = _0x6bf9fe();
      const _0x56dc66 = _0x3d7264["render"](_0x2da71c);
      if (_0x2da71c['session']) {
        const _0x386f07 = (_0x2da71c["session"]["hosting"] ? "本机开房" : '已加入房间') + " · " + _0x56dc66 + '\x20人在线';
        if (_0x4ac821["textContent"] !== _0x386f07) {
          _0x4ac821["textContent"] = _0x386f07;
        }
      }
    },
    'feedback'(_0x1a06a0) {
      !_0x3d8ff7 && !_0x5d4c58 && (_0x5c6dff["hidden"] = ![], _0x5c6dff["textContent"] = _0x1a06a0);
    },
    'destroy'() {
      cancelAnimationFrame(_0x16a33e);
      _0x3b4652["close"]();
      _0x3d7264["destroy"]();
      _0x38c40c();
      document['removeEventListener']("pointerdown", _0x4c6e3b, !![]);
      _0x507f1b['remove']();
    }
  };
}