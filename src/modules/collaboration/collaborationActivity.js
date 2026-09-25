import { reviewElement as a1012_0x39b21a, reviewTime } from './collaborationReviewDom.js';
const LABELS = {
  'create': "新增了",
  'update': '修改了',
  'delete': "删除了",
  'generating': "开始生成",
  'generationEnd': "结束生成",
  'comment': "评论了",
  'resolve': "解决了评论：",
  'reopen': "重新打开评论："
};
export function createCollaborationActivity({
  root: _0x55c883,
  getState: _0x407bfb,
  actions: _0x4e8259
}) {
  const _0x5f1cd0 = a1012_0x39b21a("details", "collaboration-activity");
  const _0x5236be = a1012_0x39b21a("summary", '', "协作动态");
  _0x5236be["tabIndex"] = 0x0;
  const _0x333733 = a1012_0x39b21a('p', 'collaboration-feedback');
  _0x333733["setAttribute"]("role", "status");
  const _0x5e26cd = a1012_0x39b21a("button", 'collaboration-button', "重试加载");
  _0x5e26cd['addEventListener']("click", () => _0x4e8259["refreshReview"]?.());
  const _0x27632b = a1012_0x39b21a("div", 'collaboration-activity-list');
  _0x27632b["setAttribute"]('aria-label', "最近协作动态");
  _0x5f1cd0['append'](_0x5236be, _0x333733, _0x5e26cd, _0x27632b);
  _0x55c883["append"](_0x5f1cd0);
  let _0x6cdc72 = '';
  let _0xfa8912 = '';
  const _0x1f8359 = new Map();
  _0x5f1cd0["addEventListener"]('toggle', () => {
    if (_0x5f1cd0["open"]) {
      _0x421f3a();
    }
  });
  function _0x421f3a() {
    const _0x411b2e = _0x407bfb();
    const _0x512b39 = _0x411b2e['session']?.["review"];
    _0xfa8912 !== _0x411b2e["session"]?.["roomId"] && (_0xfa8912 = _0x411b2e["session"]?.["roomId"], _0x6cdc72 = '', _0x5f1cd0["open"] = ![], _0x1f8359["clear"](), _0x27632b["replaceChildren"]());
    if (!_0x5f1cd0["open"]) {
      return;
    }
    const _0x3b1cc0 = !!_0x512b39?.["loading"] && _0x512b39['revision'] < 0x0;
    const _0x441537 = _0x512b39?.["error"] || (_0x3b1cc0 ? '正在加载动态…' : "最近 100 条操作");
    if (_0x333733['textContent'] !== _0x441537) {
      _0x333733['textContent'] = _0x441537;
    }
    _0x333733['classList']["toggle"]("is-pending", _0x3b1cc0);
    _0x5e26cd['hidden'] = !_0x512b39?.["error"];
    _0x5e26cd["disabled"] = !!_0x512b39?.["loading"];
    const _0x415480 = JSON["stringify"](_0x512b39?.["activities"] || []);
    if (_0x6cdc72 !== _0x415480) {
      _0x6cdc72 = _0x415480;
      const _0x5ddd76 = _0x27632b["scrollTop"];
      const _0x296bf1 = _0x27632b["getBoundingClientRect"]()['top'];
      const _0x3b0d23 = _0x5ddd76 > 0x0 ? [..._0x27632b['children']]['find'](_0x1c0f48 => _0x1c0f48["getBoundingClientRect"]()["bottom"] > _0x296bf1) : null;
      const _0x4731e7 = _0x3b0d23?.["getBoundingClientRect"]()["top"];
      const _0x37c68f = new Set();
      let _0x3a4755 = _0x27632b['firstChild'];
      for (const _0x44e0a9 of _0x512b39?.["activities"] || []) {
        _0x37c68f["add"](_0x44e0a9['seq']);
        let _0x5293ac = _0x1f8359["get"](_0x44e0a9["seq"]);
        if (!_0x5293ac) {
          _0x5293ac = a1012_0x39b21a("div", 'collaboration-activity-item');
          _0x5293ac["classList"]["toggle"]("is-mentioned", _0x44e0a9["mentions"]?.["includes"](_0x411b2e['actorId']));
          _0x5293ac["append"](a1012_0x39b21a('span', '', _0x44e0a9["name"] + '\x20' + (LABELS[_0x44e0a9["kind"]] || "操作了")));
          for (const _0x4df009 of _0x44e0a9['nodes']) {
            const _0x3e49b6 = a1012_0x39b21a("button", "collaboration-button collaboration-text-action", _0x4df009["name"]);
            _0x3e49b6["dataset"]["nodeId"] = _0x4df009['id'];
            _0x3e49b6['disabled'] = _0x4e8259["hasReviewNode"] ? !_0x4e8259['hasReviewNode'](_0x4df009['id']) : !![];
            _0x3e49b6["addEventListener"]("click", () => _0x4e8259["openReviewNode"]?.(_0x4df009['id'], ["comment", "resolve", "reopen"]["includes"](_0x44e0a9["kind"])));
            _0x5293ac["append"](_0x3e49b6);
          }
          _0x5293ac["append"](a1012_0x39b21a("time", 'collaboration-subtle', reviewTime(_0x44e0a9['created'])));
          _0x1f8359['set'](_0x44e0a9['seq'], _0x5293ac);
        }
        if (_0x5293ac !== _0x3a4755) {
          _0x27632b["insertBefore"](_0x5293ac, _0x3a4755);
        }
        _0x3a4755 = _0x5293ac["nextSibling"];
      }
      while (_0x3a4755) {
        const _0x3c8538 = _0x3a4755['nextSibling'];
        _0x3a4755["remove"]();
        _0x3a4755 = _0x3c8538;
      }
      for (const _0x59d697 of _0x1f8359["keys"]()) {
        if (!_0x37c68f["has"](_0x59d697)) {
          _0x1f8359['delete'](_0x59d697);
        }
      }
      if (!_0x27632b["childElementCount"]) {
        _0x27632b["append"](a1012_0x39b21a('p', "collaboration-subtle", "还没有协作动态"));
      }
      _0x27632b["scrollTop"] = _0x3b0d23?.["isConnected"] ? _0x27632b["scrollTop"] + _0x3b0d23['getBoundingClientRect']()["top"] - _0x4731e7 : _0x5ddd76;
    }
    for (const _0x564903 of _0x27632b["querySelectorAll"]("button[data-node-id]")) {
      const _0x14336e = !_0x4e8259["hasReviewNode"]?.(_0x564903["dataset"]['nodeId']);
      if (_0x564903["disabled"] !== _0x14336e) {
        _0x564903["disabled"] = _0x14336e;
      }
    }
  }
  return {
    'render': _0x421f3a
  };
}