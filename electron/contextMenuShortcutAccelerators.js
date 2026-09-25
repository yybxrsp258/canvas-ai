import { CONTEXT_MENU_SHORTCUTS } from '../src/utils/contextMenuShortcutCatalog.js';
const WEB_PREVIEW_ACTION_IDS = new Set(Object['keys'](CONTEXT_MENU_SHORTCUTS)["filter"](_0x30eaaa => _0x30eaaa["startsWith"]("context-web-")));
function normalizeShortcutToken(_0xa958a6) {
  const _0x5e5818 = String(_0xa958a6 || '')["trim"]();
  if (!_0x5e5818) {
    return '';
  }
  const _0x1eff9e = _0x5e5818['toLowerCase']();
  if (["ctrl", 'control', "meta", 'cmd', 'command', "cmdorctrl", 'commandorcontrol']["includes"](_0x1eff9e)) {
    return "CommandOrControl";
  }
  if (_0x1eff9e === 'shift') {
    return 'Shift';
  }
  if (_0x1eff9e === "alt" || _0x1eff9e === "option") {
    return "Alt";
  }
  if (_0x1eff9e === "space") {
    return "Space";
  }
  if (/^f(?:[1-9]|1[0-9]|2[0-4])$/i["test"](_0x5e5818)) {
    return _0x5e5818['toUpperCase']();
  }
  if (/^[a-z0-9]$/i["test"](_0x5e5818)) {
    return _0x5e5818["toUpperCase"]();
  }
  const _0x2246e8 = new Map([['enter', "Enter"], ["return", "Enter"], ["tab", "Tab"], ["escape", "Escape"], ["esc", "Escape"], ['backspace', 'Backspace'], ['delete', "Delete"], ["del", 'Delete'], ['insert', 'Insert'], ["home", 'Home'], ["end", 'End'], ["pageup", "PageUp"], ["pagedown", "PageDown"], ['up', 'Up'], ["arrowup", 'Up'], ["down", 'Down'], ['arrowdown', "Down"], ["left", 'Left'], ['arrowleft', "Left"], ["right", "Right"], ["arrowright", "Right"], ['+', "Plus"], ['=', "Plus"], ['-', "Minus"], [',', "Comma"], ['.', "Period"], ['/', "Slash"], ['\x5c', 'Backslash'], [';', "Semicolon"], ['\x27', "Quote"], ['[', "BracketLeft"], [']', 'BracketRight'], ['`', '`'], ['~', '`']]);
  return _0x2246e8["get"](_0x1eff9e) || '';
}
export function normalizeContextMenuAccelerator(_0x102341) {
  const _0x35241f = Array["isArray"](_0x102341) ? _0x102341 : [];
  if (_0x35241f["length"] === 0x0 || _0x35241f["length"] > 0x4) {
    return '';
  }
  const _0x33b83b = _0x35241f['map'](normalizeShortcutToken);
  if (_0x33b83b["some"](_0x404d4e => !_0x404d4e)) {
    return '';
  }
  const _0x1a4835 = [];
  if (_0x33b83b["includes"]("CommandOrControl")) {
    _0x1a4835["push"]('CommandOrControl');
  }
  if (_0x33b83b["includes"]("Shift")) {
    _0x1a4835['push']("Shift");
  }
  if (_0x33b83b["includes"]("Alt")) {
    _0x1a4835["push"]("Alt");
  }
  const _0x4b4056 = _0x33b83b["filter"](_0x503bce => !["CommandOrControl", 'Shift', 'Alt']["includes"](_0x503bce));
  if (_0x4b4056["length"] !== 0x1) {
    return '';
  }
  return [..._0x1a4835, _0x4b4056[0x0]]["join"]('+');
}
export function normalizeWebPreviewContextMenuShortcuts(_0x31179c = {}) {
  if (!_0x31179c || typeof _0x31179c !== "object") {
    return {};
  }
  const _0x1a5672 = {};
  for (const [_0x4bfc4a, _0x44e7bd] of Object["entries"](_0x31179c)) {
    if (!WEB_PREVIEW_ACTION_IDS["has"](_0x4bfc4a)) {
      continue;
    }
    const _0x5685f0 = normalizeContextMenuAccelerator(_0x44e7bd);
    if (_0x5685f0) {
      _0x1a5672[_0x4bfc4a] = _0x5685f0;
    }
  }
  return _0x1a5672;
}