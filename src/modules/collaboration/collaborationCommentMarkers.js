import { worldToScreen } from '../../core/math.js';
import { readNodeGeometryPreview } from '../../core/nodeGeometryPreview.js';
import { createContextMenuIcon } from '../../components/contextMenuIcon.js';
export function drawCollaborationCommentMarkers({
  state: _0x38a6d4,
  nodes: _0x101dc4,
  selected: _0x4e9de7,
  viewport: _0x11a6eb,
  bounds: _0x53d2a8,
  entryFor: _0x518da2,
  comments: _0x41d6be
}) {
  if (!_0x38a6d4) {
    return;
  }
  const _0x55bc8d = new Map((_0x38a6d4["review"]?.["summaries"] || [])['map'](_0x5304c7 => [_0x5304c7["node"], _0x5304c7]));
  const _0x109505 = new Set([..._0x55bc8d["keys"](), ...(_0x4e9de7 || [])]);
  if (_0x41d6be["nodeId"]()) {
    _0x109505["add"](_0x41d6be["nodeId"]());
  }
  for (const _0x2cb747 of _0x109505) {
    const _0x165343 = readNodeGeometryPreview(_0x2cb747, _0x101dc4[_0x2cb747]);
    if (!_0x165343) {
      continue;
    }
    const _0xa68b32 = worldToScreen(_0x165343['x'] + (_0x165343["width"] || 0xc8), _0x165343['y'], _0x11a6eb);
    if (_0x41d6be["nodeId"]() === _0x2cb747) {
      _0x41d6be['position'](_0xa68b32);
    }
    if (_0xa68b32['x'] < _0x53d2a8["left"] || _0xa68b32['x'] > _0x53d2a8["left"] + _0x53d2a8["width"] || _0xa68b32['y'] < _0x53d2a8["top"] || _0xa68b32['y'] > _0x53d2a8["top"] + _0x53d2a8["height"]) {
      continue;
    }
    const _0x4c1b9e = _0x518da2("comment:" + _0x2cb747, "collaboration-comment-marker");
    if (!_0x4c1b9e["firstChild"]) {
      const _0x56a837 = document["createElement"]("button");
      _0x56a837["type"] = "button";
      _0x56a837["className"] = "collaboration-button";
      _0x56a837['append'](createContextMenuIcon("comment"), document["createElement"]("span"));
      _0x56a837['addEventListener']('pointerdown', _0xc1c6d6 => _0xc1c6d6["stopPropagation"]());
      _0x56a837['addEventListener']("click", _0x3cbc88 => {
        _0x3cbc88["stopPropagation"]();
        _0x41d6be["open"](_0x4c1b9e["dataset"]["nodeId"], _0x56a837);
      });
      _0x4c1b9e["append"](_0x56a837);
    }
    _0x4c1b9e['dataset']["nodeId"] = _0x2cb747;
    const _0x58f0d5 = _0x55bc8d["get"](_0x2cb747)?.["unresolved"] || 0x0;
    const _0x383489 = _0x58f0d5 ? "unresolved" : _0x55bc8d["get"](_0x2cb747)?.["count"] ? "resolved" : 'empty';
    if (_0x4c1b9e["dataset"]["status"] !== _0x383489) {
      _0x4c1b9e["dataset"]['status'] = _0x383489;
    }
    const _0x23cac4 = _0x58f0d5 ? String(_0x58f0d5) : '';
    if (_0x4c1b9e["firstChild"]["lastChild"]["textContent"] !== _0x23cac4) {
      _0x4c1b9e['firstChild']["lastChild"]["textContent"] = _0x23cac4;
    }
    _0x4c1b9e["firstChild"]["setAttribute"]('aria-label', (_0x165343["name"] || _0x2cb747) + "的评论，" + _0x58f0d5 + " 条未解决");
    _0x4c1b9e["style"]["transform"] = 'translate(' + _0xa68b32['x'] + "px, " + _0xa68b32['y'] + "px)";
  }
}