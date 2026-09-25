import { beginModalInteraction } from '../../services/modalInteractionScope.js';
import { createCollaborationSelect } from './collaborationSelect.js';
import { reviewElement as a1018_0x259adf } from './collaborationReviewDom.js';
import { renderCommentThreads } from './collaborationCommentThreads.js';
export function createCollaborationComments({
  store: _0x57de23,
  getSession: _0x49d9e4
}) {
  const _0x108995 = a1018_0x259adf("div", "collaboration-comments");
  _0x108995['setAttribute']("popover", "manual");
  _0x108995['setAttribute']("role", 'dialog');
  _0x108995["setAttribute"]("aria-label", '节点评论');
  const _0x2bd5f3 = a1018_0x259adf('div', "collaboration-heading");
  const _0x2b6e20 = a1018_0x259adf('h3', '', "节点评论");
  const _0x29ce6b = a1018_0x259adf("button", "collaboration-button", '关闭');
  _0x2bd5f3["append"](_0x2b6e20, _0x29ce6b);
  const _0x3ff8e5 = a1018_0x259adf('p', "collaboration-feedback");
  _0x3ff8e5['setAttribute']("role", "status");
  const _0x347081 = a1018_0x259adf("div", 'collaboration-comment-list');
  _0x347081["setAttribute"]("aria-label", "评论内容");
  const _0x3d3d16 = a1018_0x259adf("button", "collaboration-button", "重新加载评论");
  _0x3d3d16["hidden"] = !![];
  const _0x5ded1f = a1018_0x259adf("form", "collaboration-comment-composer");
  const _0x569db0 = a1018_0x259adf('div', "collaboration-actions");
  const _0x3a774d = a1018_0x259adf('span');
  const _0x235217 = a1018_0x259adf('button', "collaboration-button", "取消回复");
  _0x569db0["append"](_0x3a774d, _0x235217);
  _0x569db0["hidden"] = !![];
  const _0x3b5146 = a1018_0x259adf('textarea', "collaboration-input");
  _0x3b5146["maxLength"] = 0x7d0;
  _0x3b5146["rows"] = 0x3;
  _0x3b5146["setAttribute"]("aria-label", "评论内容输入");
  _0x3b5146["placeholder"] = "写下建议，可 @成员";
  const _0x3f728a = a1018_0x259adf("div", "collaboration-actions");
  const _0x5cba87 = a1018_0x259adf("select");
  _0x3f728a["append"](_0x5cba87);
  const _0x3d9cc4 = a1018_0x259adf("button", "collaboration-button collaboration-primary", '发送');
  _0x3d9cc4['type'] = "submit";
  _0x3f728a["append"](_0x3d9cc4);
  _0x5ded1f['append'](_0x569db0, _0x3b5146, _0x3f728a);
  _0x108995["append"](_0x2bd5f3, _0x3ff8e5, _0x3d3d16, _0x347081, _0x5ded1f);
  document["body"]["append"](_0x108995);
  const _0x4eea61 = createCollaborationSelect(_0x5cba87, "提及成员");
  let _0x5c58b5 = null;
  let _0x254010 = '';
  let _0x8f468e = 0x0;
  let _0x12935f = -0x1;
  let _0xa35252 = ![];
  let _0x993315 = ![];
  let _0x39f9fc = [];
  let _0x598ab0 = '';
  let _0x516dbf = () => {};
  let _0x255324 = null;
  let _0x34c71c = null;
  let _0x400ac8 = -0x1;
  let _0x226072 = {
    'x': 0x0,
    'y': 0x0
  };
  let _0x1ead52 = null;
  const _0x4988fb = new Map();
  const _0x381220 = () => !!_0x254010 && _0x108995["matches"](':popover-open');
  function _0x3b8f8c(_0x1889cf) {
    return _0x1889cf === _0x8f468e && _0x381220() && _0x49d9e4() === _0x5c58b5;
  }
  function _0x54d4f1() {
    _0x34c71c && (_0x34c71c["body"] = _0x3b5146['value'], _0x34c71c["requestId"] = null);
  }
  function _0x4d87ff() {
    _0x3b5146["value"] = _0x34c71c["body"];
    _0x569db0['hidden'] = !_0x34c71c['threadId'];
    _0x3a774d["textContent"] = _0x34c71c['threadId'] ? '回复\x20' + _0x34c71c['replyName'] : '';
  }
  function _0x47508a(_0x4fd12f = !![]) {
    _0x1ead52 = null;
    _0x8f468e++;
    _0x4eea61['close']();
    _0x516dbf({
      'restoreFocus': _0x4fd12f
    });
    _0x516dbf = () => {};
    if (_0x108995["matches"](":popover-open")) {
      _0x108995["hidePopover"]();
    }
    _0x254010 = '';
    _0xa35252 = ![];
    _0x993315 = ![];
  }
  function _0x107c73(_0x7a5398 = _0x226072) {
    _0x226072 = {
      'x': _0x7a5398['x'],
      'y': _0x7a5398['y']
    };
    _0x108995["style"]["setProperty"]("--comment-left", Math["max"](0x8, Math["min"](_0x7a5398['x'] + 0xa, window["innerWidth"] - _0x108995['offsetWidth'] - 0x8)) + 'px');
    _0x108995["style"]["setProperty"]('--comment-top', Math["max"](0x8, Math["min"](_0x7a5398['y'], window["innerHeight"] - _0x108995["offsetHeight"] - 0x8)) + 'px');
  }
  function _0x287b13() {
    const _0x1e980c = JSON["stringify"]([_0x39f9fc, _0x5c58b5["state"]["members"], _0x5c58b5["state"]["role"]]);
    _0x1e980c !== _0x598ab0 && (_0x598ab0 = _0x1e980c, renderCommentThreads({
      'list': _0x347081,
      'comments': _0x39f9fc,
      'session': _0x5c58b5,
      'reply'(_0x54186f) {
        if (_0x993315) {
          return;
        }
        _0x34c71c['threadId'] = _0x54186f['id'];
        _0x34c71c["replyName"] = _0x5c58b5['state']["members"]['find'](_0x1bfdff => _0x1bfdff['id'] === _0x54186f["actor"])?.["name"] || _0x54186f["name"];
        _0x34c71c["requestId"] = null;
        _0x4d87ff();
        _0x3b5146["focus"]();
      },
      'resolve'(_0x4ac389, _0x18e378) {
        void _0x101425(_0x18e378, () => _0x5c58b5["review"]["write"]("commentResolve", {
          'nodeId': _0x254010,
          'threadId': _0x4ac389['id'],
          'resolved': !_0x4ac389['resolved']
        }));
      }
    }));
    _0x107c73();
  }
  async function _0x52759b() {
    if (!_0x381220() || _0xa35252 || !_0x5c58b5?.["review"]) {
      return;
    }
    const _0x3928a4 = _0x8f468e;
    const _0x316c0e = _0x254010;
    const _0x329859 = _0x5c58b5;
    _0xa35252 = !![];
    _0x3d3d16['hidden'] = !![];
    !_0x993315 && (_0x3ff8e5["textContent"] = "正在加载评论…", _0x3ff8e5["classList"]['add']("is-pending"));
    try {
      const _0x356112 = await _0x329859["review"]["readNode"](_0x316c0e);
      if (!_0x3b8f8c(_0x3928a4)) {
        return;
      }
      _0x39f9fc = _0x356112['comments'];
      _0x12935f = _0x356112["revision"];
      _0x287b13();
      if (!_0x993315) {
        _0x3ff8e5["textContent"] = '';
      }
    } catch (_0x308303) {
      _0x3b8f8c(_0x3928a4) && (_0x3ff8e5["textContent"] = _0x308303['message'], _0x3d3d16["hidden"] = ![]);
    } finally {
      if (_0x3b8f8c(_0x3928a4)) {
        _0xa35252 = ![];
        if (!_0x993315) {
          _0x3ff8e5['classList']["remove"]('is-pending');
        }
        if (_0x3d3d16["hidden"] && _0x12935f < _0x5c58b5["review"]["snapshot"]()["revision"]) {
          void _0x52759b();
        }
      }
    }
  }
  async function _0x101425(_0x3e0a39, _0x53fd6d) {
    if (_0x993315 || !_0x381220()) {
      return;
    }
    const _0x23732a = _0x8f468e;
    _0x993315 = !![];
    _0x3e0a39["disabled"] = !![];
    _0x3e0a39["setAttribute"]("aria-busy", "true");
    _0x3b5146['disabled'] = !![];
    _0x3d9cc4["disabled"] = !![];
    _0x4eea61['trigger']['disabled'] = !![];
    _0x3ff8e5["textContent"] = "正在保存评论…";
    _0x3ff8e5["classList"]["add"]("is-pending");
    try {
      await _0x53fd6d();
      if (_0x3b8f8c(_0x23732a)) {
        _0x4d87ff();
        await _0x52759b();
        if (_0x3b8f8c(_0x23732a) && _0x3d3d16['hidden']) {
          _0x3ff8e5["textContent"] = "已保存";
        }
      }
    } catch (_0x43d1a3) {
      if (_0x3b8f8c(_0x23732a)) {
        _0x3ff8e5["textContent"] = _0x43d1a3["message"] || "保存失败，请重试";
      }
    } finally {
      _0x3b8f8c(_0x23732a) && (_0x993315 = ![], _0x3e0a39["disabled"] = ![], _0x3e0a39["removeAttribute"]("aria-busy"), _0x3b5146["disabled"] = !_0x57de23["getStateRaw"]()["nodes"][_0x254010], _0x3d9cc4["disabled"] = _0x3b5146["disabled"], _0x4eea61['trigger']["disabled"] = _0x3b5146['disabled'], _0x3ff8e5['classList']['remove']("is-pending"));
    }
  }
  _0x3b5146["addEventListener"]("input", _0x4bf4a1 => {
    _0x54d4f1();
    _0x1ead52 = null;
    !_0x4bf4a1["isComposing"] && _0x3b5146["value"][_0x3b5146["selectionStart"] - 0x1] === '@' && _0x3b5146["selectionStart"] === _0x3b5146["selectionEnd"] && (_0x1ead52 = _0x3b5146["selectionStart"] - 0x1, _0x4eea61["open"]());
  });
  _0x4eea61['trigger']['addEventListener']('pointerdown', () => {
    _0x1ead52 = null;
  });
  _0x3b5146["addEventListener"]('keydown', _0x5192b0 => {
    _0x5192b0["key"] === "Enter" && (_0x5192b0["ctrlKey"] || _0x5192b0['metaKey']) && !_0x5192b0["isComposing"] && (_0x5192b0["preventDefault"](), _0x5ded1f["requestSubmit"]());
  });
  _0x235217["addEventListener"]("click", () => {
    if (_0x993315) {
      return;
    }
    _0x34c71c['threadId'] = '';
    _0x34c71c['requestId'] = null;
    _0x4d87ff();
    _0x3b5146["focus"]();
  });
  _0x5cba87["addEventListener"]("change", () => {
    const _0x1c6ff8 = _0x5cba87["value"] === "@all";
    const _0x52579c = _0x1c6ff8 ? {
      'name': "所有人"
    } : _0x5c58b5?.["state"]["members"]["find"](_0x2793cb => _0x2793cb['id'] === _0x5cba87["value"]);
    if (!_0x52579c || _0x993315) {
      return;
    }
    const _0x2a4e69 = '@' + _0x52579c["name"] + '\x20';
    const _0x28a3e4 = _0x1ead52 ?? _0x3b5146['selectionStart'];
    const _0x403843 = _0x3b5146["selectionEnd"];
    _0x1ead52 = null;
    if (_0x3b5146["value"]["length"] - (_0x403843 - _0x28a3e4) + _0x2a4e69["length"] > 0x7d0) {
      return;
    }
    _0x3b5146['setRangeText'](_0x2a4e69, _0x28a3e4, _0x403843, 'end');
    if (_0x1c6ff8) {
      _0x34c71c["mentions"]["@all"] = "所有人";
    } else {
      _0x34c71c["mentions"][_0x52579c['id']] = _0x52579c["name"];
    }
    _0x54d4f1();
    _0x5cba87["value"] = '';
    _0x4eea61["sync"]();
    _0x3b5146["focus"]();
  });
  _0x5ded1f["addEventListener"]("submit", _0x51bf46 => {
    _0x51bf46["preventDefault"]();
    if (!_0x34c71c["body"]["trim"]() || _0x993315) {
      return;
    }
    const _0x2d8b3b = _0x5c58b5;
    const _0x5803fd = _0x254010;
    const _0x5343fb = _0x34c71c;
    const _0x202c85 = _0x5343fb["requestId"] ||= crypto["randomUUID"]();
    const _0x2c1cfa = {
      'nodeId': _0x5803fd,
      'commentId': _0x202c85,
      'body': _0x5343fb['body'],
      'threadId': _0x5343fb["threadId"],
      'mentions': [...new Set(Object['entries'](_0x5343fb["mentions"])["filter"](([, _0x242312]) => _0x5343fb["body"]["includes"]('@' + _0x242312))["flatMap"](([_0x3bb3b5]) => _0x3bb3b5 === "@all" ? _0x2d8b3b["state"]["members"]["map"](_0x4db559 => _0x4db559['id']) : [_0x3bb3b5]))]
    };
    void _0x101425(_0x3d9cc4, async () => {
      await _0x2d8b3b["review"]["write"]("commentAdd", _0x2c1cfa);
      if (_0x5343fb["requestId"] === _0x202c85) {
        Object["assign"](_0x5343fb, {
          'body': '',
          'threadId': '',
          'mentions': {},
          'requestId': null
        });
      }
    });
  });
  _0x3d3d16['addEventListener']("click", () => void _0x52759b());
  _0x29ce6b["addEventListener"]('click', () => _0x47508a());
  const _0x2dfd58 = _0x1d1a32 => {
    if (_0x381220() && !_0x108995["contains"](_0x1d1a32["target"]) && !_0x255324?.["contains"](_0x1d1a32["target"])) {
      _0x47508a(![]);
    }
  };
  document['addEventListener']("pointerdown", _0x2dfd58, !![]);
  function _0x7180c() {
    _0x49d9e4() !== _0x5c58b5 && (_0x47508a(![]), _0x5c58b5 = _0x49d9e4(), _0x4988fb["clear"](), _0x400ac8 = -0x1);
    if (!_0x381220()) {
      return;
    }
    const _0xc3dea5 = _0x57de23['getStateRaw']()['nodes'][_0x254010];
    _0x2b6e20['textContent'] = _0xc3dea5 ? (_0xc3dea5["name"] || _0x254010) + '\x20·\x20评论' : "节点已删除 · 评论";
    if (!_0x993315) {
      _0x3b5146["disabled"] = _0x3d9cc4["disabled"] = _0x4eea61['trigger']["disabled"] = !_0xc3dea5;
    }
    const _0x5bdfe7 = JSON['stringify'](_0x5c58b5["state"]["members"]['map'](_0x2f3d1b => [_0x2f3d1b['id'], _0x2f3d1b['name']]));
    if (_0x5cba87["dataset"]["members"] !== _0x5bdfe7) {
      _0x5cba87["dataset"]["members"] = _0x5bdfe7;
      _0x5cba87["replaceChildren"]();
      const _0x531852 = a1018_0x259adf('option', '', "@成员");
      _0x531852["value"] = '';
      _0x531852['hidden'] = !![];
      _0x5cba87["append"](_0x531852);
      const _0x16e639 = a1018_0x259adf("option", '', "@所有人");
      _0x16e639["value"] = "@all";
      _0x5cba87["append"](_0x16e639);
      for (const _0x167b02 of _0x5c58b5["state"]["members"]) {
        const _0x4c7dfc = a1018_0x259adf("option", '', _0x167b02['name']);
        _0x4c7dfc["value"] = _0x167b02['id'];
        _0x5cba87["append"](_0x4c7dfc);
      }
      _0x4eea61['sync']();
    }
    const _0x122dd9 = _0x5c58b5["review"]["snapshot"]()["revision"];
    if (_0x122dd9 !== _0x400ac8) {
      _0x400ac8 = _0x122dd9;
      if (_0x122dd9 > _0x12935f) {
        void _0x52759b();
      }
    }
    _0x287b13();
  }
  return {
    'open'(_0x298c06, _0x2c16b8) {
      _0x47508a(![]);
      if (_0x5c58b5 !== _0x49d9e4()) {
        _0x4988fb["clear"]();
      }
      _0x5c58b5 = _0x49d9e4();
      if (!_0x5c58b5?.["review"]) {
        return;
      }
      _0x254010 = _0x298c06;
      _0x255324 = _0x2c16b8;
      _0x12935f = -0x1;
      _0x400ac8 = -0x1;
      _0x39f9fc = [];
      _0x598ab0 = '';
      if (!_0x4988fb["has"](_0x298c06)) {
        _0x4988fb['set'](_0x298c06, {
          'body': '',
          'threadId': '',
          'mentions': {},
          'requestId': null
        });
      }
      _0x34c71c = _0x4988fb['get'](_0x298c06);
      _0x4d87ff();
      _0x3d9cc4["removeAttribute"]("aria-busy");
      _0x3ff8e5['classList']["remove"]("is-pending");
      _0x108995["showPopover"]();
      if (_0x2c16b8) {
        const _0x174c58 = _0x2c16b8["getBoundingClientRect"]();
        _0x107c73({
          'x': _0x174c58['right'],
          'y': _0x174c58['bottom']
        });
      } else {
        _0x107c73({
          'x': window["innerWidth"] / 0x2,
          'y': window["innerHeight"] / 0x3
        });
      }
      _0x516dbf = beginModalInteraction({
        'root': _0x108995,
        'onClose': _0x47508a,
        'returnFocus': _0x2c16b8,
        'preferredSelector': "textarea"
      });
      _0x7180c();
      void _0x52759b();
    },
    'update': _0x7180c,
    'position': _0x107c73,
    'nodeId': () => _0x254010,
    'destroy'() {
      _0x47508a(![]);
      _0x4eea61["destroy"]();
      _0x108995["remove"]();
      document['removeEventListener']("pointerdown", _0x2dfd58, !![]);
    }
  };
}