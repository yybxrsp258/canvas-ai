export function bindImageCropAction(_0x74395a) {
  const {
    toolbarEl: _0x25dc03,
    nodeId: _0x429eb1,
    ImageCropController: _0x475d79
  } = _0x74395a;
  const _0x371ab5 = _0x25dc03['querySelector'](".act-crop");
  _0x371ab5 && _0x371ab5['addEventListener']("click", _0x27086a => {
    _0x27086a["stopPropagation"]();
    window["v2FocusOnNode"] && window["v2FocusOnNode"](_0x429eb1, 0x78, 0x320);
    _0x475d79["init"](_0x429eb1);
  });
}