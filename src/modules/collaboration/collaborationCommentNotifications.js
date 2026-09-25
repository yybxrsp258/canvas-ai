import { showToast } from '../../services/toastService.js';
export function createCollaborationCommentNotifications({
  getSession: _0x27d17d,
  hasNode: _0xaca4a,
  openNode: _0x5501bb,
  notify = showToast
}) {
  return _0x3bb28c => {
    const _0x155e12 = _0x27d17d();
    const _0x5830fe = _0x3bb28c["nodes"]?.[0x0];
    if (!_0x155e12 || !_0x5830fe) {
      return;
    }
    const _0x4c5f76 = _0x3bb28c["name"] + " 评论了「" + _0x5830fe['name'] + '」：' + (_0x3bb28c["preview"] || '新评论');
    notify(_0x4c5f76, 'ok', 0x1770, {
      'ariaLabel': _0x4c5f76 + "，点击定位节点并查看评论",
      'onClick'() {
        if (_0x27d17d() !== _0x155e12) {
          return;
        }
        if (!_0xaca4a(_0x5830fe['id'])) {
          notify("该节点已删除", 'ok');
          return;
        }
        _0x5501bb(_0x5830fe['id'], !![]);
      }
    });
  };
}