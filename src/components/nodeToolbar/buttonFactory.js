export function createToolbarIconButton({
  action: _0x38663c,
  tooltip: _0x1b8d2f,
  label: _0x5ff27b,
  iconSvg: _0x126096,
  extraClass = ''
}) {
  const _0x52c639 = ['ftb-btn', "icon-only", extraClass, "act-" + _0x38663c]["filter"](Boolean)["join"]('\x20');
  return "<button class=\"" + _0x52c639 + "\" data-tooltip=\"" + _0x1b8d2f + '\x22\x20aria-label=\x22' + _0x5ff27b + '\x22>' + _0x126096 + "</button>";
}
export function createToolbarDivider() {
  return '<div\x20class=\x22ftb-divider\x22></div>';
}
export function createToolbarHtml({
  toolbarClass: _0x12e274,
  items: _0x41cab2
}) {
  return "<div class=\"node-floating-toolbar " + _0x12e274 + "\">\n    " + _0x41cab2["join"]("\n    ") + "\n</div>";
}