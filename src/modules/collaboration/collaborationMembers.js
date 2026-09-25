import { collaborationMemberColor } from './collaborationMemberColor.js';
import { createCollaborationSelect } from './collaborationSelect.js';
import { createCollaborationNicknameEditor } from './collaborationNicknameEditor.js';
const ROLES = {
  'owner': '房主',
  'admin': "管理员",
  'editor': "可编辑",
  'viewer': '只读'
};
export function onlineCollaborationActors(_0x3811f8, _0x4a64fd) {
  const _0x1bf8ee = new Set((_0x3811f8?.["presence"] || [])["filter"](_0x1cf900 => !_0x1cf900["expiresAt"] || _0x1cf900['expiresAt'] * 0x3e8 > Date["now"]())["map"](_0x34b824 => _0x34b824["actorId"]));
  if (_0x3811f8 && _0x4a64fd && !['offline', "blocked"]['includes'](_0x3811f8["status"])) {
    _0x1bf8ee["add"](_0x4a64fd);
  }
  return _0x1bf8ee;
}
export function createCollaborationMembers({
  root: _0x510cde,
  element: _0x2b8873,
  button: _0x3199c7,
  run: _0x12e840,
  actions: _0x5c12b0,
  confirmAction: _0x12c8c8,
  getState: _0x2ad4b2
}) {
  let _0x26e328 = '';
  const _0x450600 = new Map();
  function _0x12dac4(_0x250396) {
    const _0x153bd7 = _0x250396['session'];
    const _0x35bddc = JSON["stringify"]([_0x153bd7?.["roomId"], _0x250396["actorId"], _0x153bd7?.["role"], _0x153bd7?.["members"]]);
    if (_0x35bddc !== _0x26e328) {
      _0x26e328 = _0x35bddc;
      const _0x3b86fe = new Set((_0x153bd7?.['members'] || [])["map"](_0x3a9703 => _0x3a9703['id']));
      for (const [_0x4e3e8e, _0x1d3c53] of _0x450600) {
        !_0x3b86fe["has"](_0x4e3e8e) && (_0x1d3c53["nickname"]?.["destroy"](), _0x1d3c53["permission"]?.["destroy"](), _0x1d3c53['row']["remove"](), _0x450600["delete"](_0x4e3e8e));
      }
      for (const _0x2b9562 of _0x153bd7?.['members'] || []) {
        const _0x16aca9 = JSON["stringify"]([_0x153bd7["roomId"], _0x250396["actorId"], _0x153bd7["role"], _0x2b9562['id'] === _0x250396["actorId"] ? {
          ..._0x2b9562,
          'name': undefined
        } : _0x2b9562]);
        const _0x229a2c = _0x450600["get"](_0x2b9562['id']);
        if (_0x229a2c?.["key"] === _0x16aca9) {
          _0x229a2c['name'] !== _0x2b9562["name"] && (_0x229a2c['label']["textContent"] = _0x2b9562["name"] + "（你）", _0x229a2c['label']["title"] = _0x229a2c["label"]['textContent'], _0x229a2c['avatar']["textContent"] = _0x2b9562["name"]['slice'](0x0, 0x1), _0x229a2c["name"] = _0x2b9562['name'], _0x229a2c['nickname']?.["update"](_0x2b9562["name"]));
          continue;
        }
        _0x229a2c?.['nickname']?.["destroy"]();
        _0x450600["get"](_0x2b9562['id'])?.['permission']?.["destroy"]();
        _0x450600["get"](_0x2b9562['id'])?.["row"]["remove"]();
        const _0x51c0a3 = _0x2b8873('div', "collaboration-member");
        _0x51c0a3['style']['setProperty']('--member-color', collaborationMemberColor(_0x2b9562));
        const _0x197f96 = _0x2b9562['id'] === _0x250396["actorId"];
        const _0x575d6d = _0x2b8873('span', "collaboration-member-name", '' + _0x2b9562["name"] + (_0x197f96 ? "（你）" : ''));
        _0x575d6d["title"] = _0x575d6d["textContent"];
        const _0xb028a8 = _0x2b8873("span", 'collaboration-member-online');
        _0xb028a8["setAttribute"]("role", "img");
        const _0xacbfe1 = _0x2b8873("div", "collaboration-member-actions");
        const _0x229c9c = _0x2b8873("span", "collaboration-avatar", _0x2b9562['name']["slice"](0x0, 0x1));
        _0x51c0a3["append"](_0x229c9c, _0x575d6d, _0xb028a8, _0xacbfe1);
        const _0x20db49 = !_0x197f96 && _0x2b9562["role"] !== "owner" && (_0x153bd7["role"] === 'owner' || _0x153bd7["role"] === 'admin' && _0x2b9562['role'] !== "admin");
        if (!_0x20db49) {
          _0xacbfe1["append"](_0x2b8873("span", "collaboration-member-role", ROLES[_0x2b9562["role"]]));
        }
        let _0x1fe9ea;
        let _0x2c1099;
        if (!_0x197f96) {
          _0x1fe9ea = _0x3199c7('跟随', () => _0x5c12b0["follow"](_0x2ad4b2()['session']?.["followActorId"] === _0x2b9562['id'] ? '' : _0x2b9562['id']), _0xacbfe1, ![]);
          _0x1fe9ea["setAttribute"]('aria-label', "跟随 " + _0x2b9562['name']);
          if (_0x20db49) {
            const _0x2a9542 = _0x2b8873("select", 'collaboration-input');
            _0x2a9542["setAttribute"]("aria-label", _0x2b9562['name'] + "的权限");
            for (const _0x29732e of _0x153bd7["role"] === "owner" ? ['admin', 'editor', "viewer"] : ["editor", "viewer"]) {
              const _0x84ea7b = _0x2b8873("option", '', ROLES[_0x29732e]);
              _0x84ea7b["value"] = _0x29732e;
              _0x2a9542["append"](_0x84ea7b);
            }
            _0x2a9542["value"] = _0x2b9562["role"];
            _0xacbfe1["append"](_0x2a9542);
            _0x2c1099 = createCollaborationSelect(_0x2a9542, _0x2b9562["name"] + '的权限');
            _0x2a9542['addEventListener']("change", async () => {
              const _0x237a01 = await _0x12e840(_0x2c1099["trigger"], async () => {
                try {
                  await _0x5c12b0["member"](_0x2b9562['id'], _0x2a9542['value']);
                } catch (_0x4e5597) {
                  _0x2a9542['value'] = _0x2b9562['role'];
                  _0x2c1099["sync"]();
                  throw _0x4e5597;
                }
              });
              _0x237a01 === ![] && (_0x2a9542["value"] = _0x2b9562['role'], _0x2c1099["sync"]());
            });
            const _0x4d46a9 = _0x3199c7('移除', () => _0x12c8c8("移除 " + _0x2b9562["name"] + '\x20并使现有邀请信息失效？', () => _0x5c12b0["remove"](_0x2b9562['id'])), _0xacbfe1);
            _0x4d46a9["classList"]["add"]("collaboration-danger");
            _0x4d46a9["setAttribute"]("aria-label", "移除 " + _0x2b9562["name"]);
          }
        }
        const _0x4dc65f = _0x197f96 ? createCollaborationNicknameEditor({
          'row': _0x51c0a3,
          'controls': _0xacbfe1,
          'element': _0x2b8873,
          'button': _0x3199c7,
          'run': _0x12e840,
          'actions': _0x5c12b0,
          'getState': _0x2ad4b2,
          'person': _0x2b9562
        }) : null;
        _0x450600["set"](_0x2b9562['id'], {
          'online': _0xb028a8,
          'follow': _0x1fe9ea,
          'permission': _0x2c1099,
          'nickname': _0x4dc65f,
          'avatar': _0x229c9c,
          'label': _0x575d6d,
          'row': _0x51c0a3,
          'key': _0x16aca9,
          'name': _0x2b9562["name"]
        });
      }
      (_0x153bd7?.["members"] || [])['forEach']((_0x48d755, _0xafa7d9) => {
        const _0x6c6943 = _0x450600["get"](_0x48d755['id'])['row'];
        if (_0x510cde["children"][_0xafa7d9] !== _0x6c6943) {
          _0x510cde["insertBefore"](_0x6c6943, _0x510cde["children"][_0xafa7d9] || null);
        }
      });
    }
    const _0x1af56a = onlineCollaborationActors(_0x153bd7, _0x250396["actorId"]);
    for (const [_0x1a495d, _0x465c86] of _0x450600) {
      const _0x3b9f2e = _0x1af56a['has'](_0x1a495d);
      const _0x203c12 = _0x153bd7['followActorId'] === _0x1a495d;
      _0x465c86["isOnline"] !== _0x3b9f2e && (_0x465c86["online"]["dataset"]["online"] = String(_0x3b9f2e), _0x465c86["online"]["setAttribute"]("aria-label", _0x3b9f2e ? '在线' : '离线'), _0x465c86["online"]["title"] = _0x3b9f2e ? '在线' : '离线');
      _0x465c86["follow"] && (_0x465c86['isOnline'] !== _0x3b9f2e || _0x465c86['following'] !== _0x203c12) && (_0x465c86["follow"]["disabled"] = !_0x203c12 && !_0x3b9f2e, _0x465c86["follow"]['textContent'] = _0x203c12 ? "中止跟随" : '跟随', _0x465c86["follow"]["setAttribute"]("aria-pressed", String(_0x203c12)), _0x465c86["follow"]["setAttribute"]('aria-label', _0x465c86["follow"]['textContent'] + '\x20' + _0x465c86["name"]));
      _0x465c86["isOnline"] = _0x3b9f2e;
      _0x465c86["following"] = _0x203c12;
    }
    return _0x1af56a["size"];
  }
  return {
    'render': _0x12dac4,
    'close'() {
      for (const _0x215bef of _0x450600["values"]()) {
        _0x215bef["permission"]?.["close"]();
        _0x215bef['nickname']?.["close"]();
      }
    },
    'destroy'() {
      for (const _0x251cb9 of _0x450600["values"]()) {
        _0x251cb9["permission"]?.["destroy"]();
        _0x251cb9["nickname"]?.["destroy"]();
      }
      _0x450600['clear']();
    }
  };
}