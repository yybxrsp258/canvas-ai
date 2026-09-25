import { reviewElement as a1019_0x3eed32, reviewTime } from './collaborationReviewDom.js';
export function renderCommentThreads({
  list: _0x3c8590,
  comments: _0x1bb9bb,
  session: _0x57c814,
  reply: _0x30c85c,
  resolve: _0x1d7418
}) {
  const _0x15933b = _0x3c8590["scrollTop"];
  _0x3c8590["replaceChildren"]();
  const _0x535789 = new Map(_0x57c814["state"]["members"]["map"](_0x323212 => [_0x323212['id'], _0x323212["name"]]));
  for (const _0x4c708c of _0x1bb9bb['filter'](_0x27eb22 => _0x27eb22['id'] === _0x27eb22["thread"])) {
    const _0x1955f2 = a1019_0x3eed32("section", "collaboration-comment-thread");
    _0x1955f2["classList"]["toggle"]("is-resolved", !!_0x4c708c["resolved"]);
    for (const _0x18e25a of [_0x4c708c, ..._0x1bb9bb['filter'](_0x48e4b2 => _0x48e4b2['thread'] === _0x4c708c['id'] && _0x48e4b2['id'] !== _0x4c708c['id'])]) {
      const _0x9c88d7 = a1019_0x3eed32("div", "collaboration-comment-message");
      _0x9c88d7['classList']["toggle"]("is-mentioned", _0x18e25a["mentions"]["includes"](_0x57c814["state"]["actorId"]));
      _0x9c88d7["append"](a1019_0x3eed32("strong", '', _0x535789["get"](_0x18e25a["actor"]) || _0x18e25a["name"]), a1019_0x3eed32("time", "collaboration-subtle", reviewTime(_0x18e25a["created"])), a1019_0x3eed32('p', '', _0x18e25a["body"]));
      _0x1955f2["append"](_0x9c88d7);
    }
    const _0x3c3bf8 = a1019_0x3eed32("div", "collaboration-actions");
    if (!_0x4c708c["resolved"]) {
      const _0x4336ae = a1019_0x3eed32("button", "collaboration-button", '回复');
      _0x4336ae["addEventListener"]("click", () => _0x30c85c(_0x4c708c));
      _0x3c3bf8['append'](_0x4336ae);
    } else {
      _0x3c3bf8["append"](a1019_0x3eed32("span", 'collaboration-subtle', "已解决"));
    }
    if (_0x4c708c["actor"] === _0x57c814["state"]['actorId'] || ['owner', "admin"]["includes"](_0x57c814["state"]["role"])) {
      const _0x4e95a8 = a1019_0x3eed32('button', "collaboration-button", _0x4c708c['resolved'] ? '重新打开' : '标记解决');
      _0x4e95a8["addEventListener"]('click', () => _0x1d7418(_0x4c708c, _0x4e95a8));
      _0x3c3bf8["append"](_0x4e95a8);
    }
    _0x1955f2['append'](_0x3c3bf8);
    _0x3c8590["append"](_0x1955f2);
  }
  if (!_0x1bb9bb["length"]) {
    _0x3c8590["append"](a1019_0x3eed32('p', "collaboration-subtle", '还没有评论，写下你的建议吧'));
  }
  _0x3c8590["scrollTop"] = _0x15933b;
}