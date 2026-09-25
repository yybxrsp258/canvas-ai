import { t } from '../i18n/index.js';
import { insertPlainTextAtSelection } from '../utils/editableText.js';
import { showContextMenu } from './interaction/contextMenuPresenter.js';
const MENU_SELECTOR = ".v2-text-input-context-menu";
export const TEXT_CONTEXT_MENU_TARGET_SELECTOR = "input, textarea, [contenteditable]:not([contenteditable='false'])";
let activeTextInputContextMenuSession = null;
const TEXT_INPUT_TYPES = new Set(['', "text", 'search', "url", "tel", "email", 'password']);
function getWindow() {
  return globalThis["window"] || null;
}
function getDocument() {
  return globalThis["document"] || null;
}
function textInputContextMenuText(_0x399177, _0x82ab7 = {}) {
  return t('textInputContextMenu.' + _0x399177, _0x82ab7);
}
function isInputElement(_0x17de90) {
  return String(_0x17de90?.["tagName"] || '')["toUpperCase"]() === "INPUT";
}
function isTextAreaElement(_0x1f828e) {
  return String(_0x1f828e?.["tagName"] || '')["toUpperCase"]() === "TEXTAREA";
}
function isContentEditableElement(_0x3b1769) {
  if (_0x3b1769?.['isContentEditable'] === !![]) {
    return !![];
  }
  const _0x3345b8 = _0x3b1769?.["getAttribute"]?.("contenteditable");
  if (_0x3345b8 !== null && _0x3345b8 !== undefined) {
    return String(_0x3345b8)["toLowerCase"]() !== 'false';
  }
  const _0x49e2f9 = String(_0x3b1769?.["contentEditable"] || '')["toLowerCase"]();
  return _0x49e2f9 === "true" || _0x49e2f9 === 'plaintext-only';
}
function isWritableTextInput(_0x1929b0) {
  if (!isInputElement(_0x1929b0)) {
    return ![];
  }
  const _0x534d28 = String(_0x1929b0["type"] || '')['toLowerCase']();
  return TEXT_INPUT_TYPES['has'](_0x534d28) && !_0x1929b0["disabled"] && !_0x1929b0["readOnly"];
}
function isWritableTextArea(_0x40314c) {
  return isTextAreaElement(_0x40314c) && !_0x40314c["disabled"] && !_0x40314c['readOnly'];
}
function isSupportedTextInput(_0x31f330) {
  if (!isInputElement(_0x31f330) || _0x31f330['disabled']) {
    return ![];
  }
  return TEXT_INPUT_TYPES["has"](String(_0x31f330["type"] || '')["toLowerCase"]());
}
function isSupportedTextArea(_0xed55f0) {
  return isTextAreaElement(_0xed55f0) && !_0xed55f0['disabled'];
}
function getTextContextMenuTarget(_0x5850df) {
  if (!_0x5850df) {
    return null;
  }
  const _0x596914 = _0x5850df["closest"]?.(TEXT_CONTEXT_MENU_TARGET_SELECTOR) || _0x5850df;
  if (isSupportedTextInput(_0x596914) || isSupportedTextArea(_0x596914) || isContentEditableElement(_0x596914)) {
    return _0x596914;
  }
  return null;
}
function isSensitiveTextTarget(_0x15c52d) {
  if (String(_0x15c52d?.["type"] || '')["toLowerCase"]() === "password") {
    return !![];
  }
  const _0x449089 = [_0x15c52d?.['id'], _0x15c52d?.["name"], _0x15c52d?.["autocomplete"], _0x15c52d?.["getAttribute"]?.("aria-label"), _0x15c52d?.["getAttribute"]?.("title"), _0x15c52d?.["getAttribute"]?.('placeholder'), _0x15c52d?.["dataset"]?.['sensitive']]["filter"](Boolean)["join"]('\x20');
  return /(?:api[\s_-]*key|secret|access[\s_-]*token|password|密码|密钥|令牌)/iu["test"](_0x449089);
}
export function getEditableTextTarget(_0x424b4f) {
  if (!_0x424b4f) {
    return null;
  }
  const _0x29f859 = _0x424b4f['closest']?.(TEXT_CONTEXT_MENU_TARGET_SELECTOR) || _0x424b4f;
  if (isWritableTextInput(_0x29f859) || isWritableTextArea(_0x29f859) || isContentEditableElement(_0x29f859)) {
    return _0x29f859;
  }
  return null;
}
export function isEditableTextTargetInGroupedNode(_0x33bce5, _0x4b5ef9 = {}) {
  const _0x79bd0d = getEditableTextTarget(_0x33bce5);
  if (!_0x79bd0d) {
    return ![];
  }
  const _0x441bca = _0x79bd0d['closest']?.('.v2-node');
  const _0x18dcaa = String(_0x441bca?.["dataset"]?.['nodeId'] || _0x441bca?.['id'] || '')["trim"]();
  if (!_0x18dcaa) {
    return ![];
  }
  const _0x38a505 = _0x4b5ef9?.[_0x18dcaa];
  const _0x199b76 = String(_0x38a505?.["parentId"] || '')['trim']();
  if (!_0x199b76) {
    return ![];
  }
  return _0x4b5ef9?.[_0x199b76]?.["type"] === "group";
}
function closeTextInputContextMenu() {
  activeTextInputContextMenuSession?.["close"]?.();
  activeTextInputContextMenuSession = null;
  getDocument()?.["querySelectorAll"]?.(MENU_SELECTOR)?.["forEach"](_0x191a27 => _0x191a27["remove"]());
}
function dispatchInputEvent(_0x19a7f3) {
  const _0xe88c27 = _0x19a7f3?.["ownerDocument"]?.["defaultView"] || getWindow();
  const _0x331bb2 = _0xe88c27?.["InputEvent"] || _0xe88c27?.["Event"] || globalThis['Event'];
  if (typeof _0x331bb2 !== "function" || typeof _0x19a7f3?.['dispatchEvent'] !== "function") {
    return;
  }
  _0x19a7f3["dispatchEvent"](new _0x331bb2("input", {
    'bubbles': !![]
  }));
}
function clampSelection(_0x2a3ea4, _0x43e697) {
  const _0x5cf8fe = Number(_0x2a3ea4);
  if (!Number['isFinite'](_0x5cf8fe)) {
    return _0x43e697;
  }
  return Math["max"](0x0, Math["min"](_0x43e697, _0x5cf8fe));
}
function setFieldSelection(_0x1d0f93, _0x57eca8, _0x5ae384) {
  if (typeof _0x1d0f93?.['setSelectionRange'] !== "function") {
    return;
  }
  try {
    _0x1d0f93['setSelectionRange'](_0x57eca8, _0x5ae384);
  } catch {}
}
export function captureEditableSelection(_0x362e90) {
  if (isSupportedTextInput(_0x362e90) || isSupportedTextArea(_0x362e90)) {
    const _0x43cb55 = String(_0x362e90['value'] || '')["length"];
    return {
      'kind': "field",
      'start': clampSelection(_0x362e90['selectionStart'], _0x43cb55),
      'end': clampSelection(_0x362e90["selectionEnd"], _0x43cb55)
    };
  }
  const _0x5410de = _0x362e90?.["ownerDocument"]?.["defaultView"] || getWindow();
  const _0x39e4b1 = _0x5410de?.['getSelection']?.();
  if (!_0x39e4b1 || _0x39e4b1["rangeCount"] === 0x0) {
    return null;
  }
  const _0x439199 = _0x39e4b1["getRangeAt"](0x0);
  const _0x4355f7 = _0x439199['commonAncestorContainer'];
  if (!_0x362e90['contains']?.(_0x4355f7)) {
    return null;
  }
  return {
    'kind': "contenteditable",
    'range': _0x439199["cloneRange"]()
  };
}
function getSelectedText(_0x366b86, _0xc6282a) {
  if (_0xc6282a?.['kind'] === 'field') {
    return String(_0x366b86?.["value"] || '')["slice"](_0xc6282a["start"], _0xc6282a["end"]);
  }
  if (_0xc6282a?.["kind"] === "contenteditable") {
    return String(_0xc6282a["range"]?.["toString"]?.() || '');
  }
  return '';
}
function getTargetText(_0x156464) {
  if (isSupportedTextInput(_0x156464) || isSupportedTextArea(_0x156464)) {
    return String(_0x156464?.['value'] || '');
  }
  return String(_0x156464?.["textContent"] || '');
}
function deleteEditableSelection(_0x4cbebf, _0x9a7367) {
  const _0x33e193 = getEditableTextTarget(_0x4cbebf);
  if (!_0x33e193 || !_0x9a7367) {
    return ![];
  }
  if (_0x9a7367["kind"] === "field") {
    const _0x2948a5 = String(_0x33e193['value'] || '');
    const _0x38e7d1 = clampSelection(_0x9a7367["start"], _0x2948a5["length"]);
    const _0x5c6d17 = clampSelection(_0x9a7367['end'], _0x2948a5["length"]);
    if (_0x38e7d1 === _0x5c6d17) {
      return ![];
    }
    return insertTextIntoField(_0x33e193, '', {
      'kind': "field",
      'start': _0x38e7d1,
      'end': _0x5c6d17
    });
  }
  if (_0x9a7367["kind"] !== "contenteditable" || !_0x9a7367["range"]) {
    return ![];
  }
  restoreEditableSelection(_0x33e193, _0x9a7367);
  _0x9a7367['range']["deleteContents"]?.();
  dispatchInputEvent(_0x33e193);
  return !![];
}
function selectAllEditableText(_0xd9f001) {
  if (isSupportedTextInput(_0xd9f001) || isSupportedTextArea(_0xd9f001)) {
    _0xd9f001["focus"]?.({
      'preventScroll': !![]
    });
    setFieldSelection(_0xd9f001, 0x0, String(_0xd9f001["value"] || '')['length']);
    return !![];
  }
  if (!isContentEditableElement(_0xd9f001)) {
    return ![];
  }
  const _0x407d80 = _0xd9f001["ownerDocument"] || getDocument();
  const _0x44a080 = _0x407d80?.["defaultView"]?.["getSelection"]?.() || getWindow()?.["getSelection"]?.();
  const _0x4eff9a = _0x407d80?.["createRange"]?.();
  if (!_0x44a080 || !_0x4eff9a) {
    return ![];
  }
  _0xd9f001['focus']?.({
    'preventScroll': !![]
  });
  _0x4eff9a['selectNodeContents'](_0xd9f001);
  _0x44a080["removeAllRanges"]();
  _0x44a080["addRange"](_0x4eff9a);
  return !![];
}
async function writeClipboardText(_0xf2bec4) {
  const _0x14face = globalThis["navigator"]?.["clipboard"]?.["writeText"];
  if (typeof _0x14face !== "function") {
    return ![];
  }
  try {
    await _0x14face["call"](globalThis["navigator"]["clipboard"], _0xf2bec4);
    return !![];
  } catch (_0x3f217b) {
    getWindow()?.["showToast"]?.(textInputContextMenuText('clipboardWriteFailed'), "error");
    return ![];
  }
}
async function copyEditableSelection(_0x3aa78e, _0x56dddb) {
  const _0x4c89ee = getSelectedText(_0x3aa78e, _0x56dddb);
  if (!_0x4c89ee) {
    return ![];
  }
  restoreEditableSelection(_0x3aa78e, _0x56dddb);
  return writeClipboardText(_0x4c89ee);
}
async function cutEditableSelection(_0x190056, _0x348154) {
  if (!(await copyEditableSelection(_0x190056, _0x348154))) {
    return ![];
  }
  return deleteEditableSelection(_0x190056, _0x348154);
}
function undoEditableChange(_0x2ae971, _0x455d1d) {
  const _0x5b498a = _0x2ae971?.['ownerDocument'] || getDocument();
  if (_0x5b498a?.['queryCommandSupported']?.("undo") !== !![]) {
    return ![];
  }
  restoreEditableSelection(_0x2ae971, _0x455d1d);
  try {
    return _0x5b498a["execCommand"]?.("undo") === !![];
  } catch (_0x5a114c) {
    return ![];
  }
}
function restoreEditableSelection(_0x39007e, _0x558401) {
  if (!_0x558401) {
    return;
  }
  if (_0x558401["kind"] === "field") {
    _0x39007e["focus"]?.({
      'preventScroll': !![]
    });
    setFieldSelection(_0x39007e, _0x558401["start"], _0x558401["end"]);
    return;
  }
  if (_0x558401["kind"] !== "contenteditable" || !_0x558401['range']) {
    return;
  }
  _0x39007e["focus"]?.({
    'preventScroll': !![]
  });
  const _0x318e02 = _0x39007e?.["ownerDocument"]?.["defaultView"] || getWindow();
  const _0x4c14d7 = _0x318e02?.["getSelection"]?.();
  if (!_0x4c14d7) {
    return;
  }
  _0x4c14d7['removeAllRanges']();
  _0x4c14d7['addRange'](_0x558401["range"]);
}
function insertTextIntoField(_0x171adb, _0x99d3ae, _0x7a839c) {
  const _0x3544d0 = String(_0x171adb["value"] || '');
  const _0x3b54e2 = clampSelection(_0x7a839c?.["start"] ?? _0x171adb['selectionStart'], _0x3544d0["length"]);
  const _0x2948ef = clampSelection(_0x7a839c?.["end"] ?? _0x171adb['selectionEnd'], _0x3544d0["length"]);
  _0x171adb["focus"]?.({
    'preventScroll': !![]
  });
  if (typeof _0x171adb["setRangeText"] === 'function') {
    try {
      _0x171adb["setRangeText"](_0x99d3ae, _0x3b54e2, _0x2948ef, "end");
    } catch (_0x288bfc) {
      _0x171adb["value"] = _0x3544d0["slice"](0x0, _0x3b54e2) + _0x99d3ae + _0x3544d0["slice"](_0x2948ef);
      const _0x26dfc8 = _0x3b54e2 + _0x99d3ae["length"];
      setFieldSelection(_0x171adb, _0x26dfc8, _0x26dfc8);
    }
  } else {
    _0x171adb["value"] = _0x3544d0["slice"](0x0, _0x3b54e2) + _0x99d3ae + _0x3544d0['slice'](_0x2948ef);
    const _0x47de35 = _0x3b54e2 + _0x99d3ae["length"];
    setFieldSelection(_0x171adb, _0x47de35, _0x47de35);
  }
  dispatchInputEvent(_0x171adb);
  return !![];
}
function insertTextIntoContentEditable(_0x1fe0f1, _0xca8543, _0x3af75e) {
  const _0x168ef4 = _0x1fe0f1?.["ownerDocument"] || getDocument();
  _0x1fe0f1["focus"]?.({
    'preventScroll': !![]
  });
  restoreEditableSelection(_0x1fe0f1, _0x3af75e);
  const _0x5a3a79 = _0x168ef4?.["defaultView"];
  if (_0x5a3a79?.["ClipboardEvent"] && _0x5a3a79?.['DataTransfer']) {
    const _0x1b2820 = new _0x5a3a79["DataTransfer"]();
    _0x1b2820["setData"]("text/plain", _0xca8543);
    const _0x25422f = new _0x5a3a79["ClipboardEvent"]("paste", {
      'bubbles': !![],
      'cancelable': !![],
      'clipboardData': _0x1b2820
    });
    _0x1fe0f1["dispatchEvent"](_0x25422f);
    if (_0x25422f['defaultPrevented']) {
      return !![];
    }
  }
  if (insertPlainTextAtSelection(_0xca8543, {
    'documentObject': _0x168ef4
  })) {
    return !![];
  }
  const _0x57962c = _0x168ef4?.["defaultView"] || getWindow();
  const _0x363a8c = _0x57962c?.["getSelection"]?.();
  if (_0x363a8c && _0x363a8c["rangeCount"] > 0x0) {
    const _0x1a9b17 = _0x363a8c['getRangeAt'](0x0);
    _0x1a9b17['deleteContents']();
    const _0x478b27 = _0x168ef4["createTextNode"](String(_0xca8543 || ''));
    _0x1a9b17["insertNode"](_0x478b27);
    _0x1a9b17["setStartAfter"](_0x478b27);
    _0x1a9b17['collapse'](!![]);
    _0x363a8c["removeAllRanges"]();
    _0x363a8c['addRange'](_0x1a9b17);
  } else {
    typeof _0x1fe0f1["appendChild"] === "function" && _0x168ef4?.['createTextNode'] ? _0x1fe0f1['appendChild'](_0x168ef4['createTextNode'](String(_0xca8543 || ''))) : _0x1fe0f1['textContent'] = '' + (_0x1fe0f1['textContent'] || '') + _0xca8543;
  }
  dispatchInputEvent(_0x1fe0f1);
  return !![];
}
export function insertPlainTextIntoEditable(_0x5d7e57, _0x416633, _0x2c930e = null) {
  const _0x1f6d3b = getEditableTextTarget(_0x5d7e57);
  if (!_0x1f6d3b || typeof _0x416633 !== "string") {
    return ![];
  }
  if (isWritableTextInput(_0x1f6d3b) || isWritableTextArea(_0x1f6d3b)) {
    return insertTextIntoField(_0x1f6d3b, _0x416633, _0x2c930e);
  }
  if (isContentEditableElement(_0x1f6d3b)) {
    return insertTextIntoContentEditable(_0x1f6d3b, _0x416633, _0x2c930e);
  }
  return ![];
}
async function readClipboardText() {
  const _0x1e1cd8 = globalThis["navigator"]?.["clipboard"]?.["readText"];
  if (typeof _0x1e1cd8 !== 'function') {
    return null;
  }
  return _0x1e1cd8['call'](globalThis["navigator"]["clipboard"]);
}
export async function pasteTextIntoEditableFromClipboard(_0x2489da, _0x372be1) {
  let _0x26e888 = null;
  try {
    _0x26e888 = await readClipboardText();
  } catch (_0x110bb1) {
    getWindow()?.["showToast"]?.(textInputContextMenuText("clipboardReadFailed"), 'error');
    return ![];
  }
  if (typeof _0x26e888 !== "string") {
    getWindow()?.["showToast"]?.(textInputContextMenuText("clipboardUnsupported"), "error");
    return ![];
  }
  if (!_0x26e888) {
    getWindow()?.["showToast"]?.(textInputContextMenuText("clipboardEmpty"), 'warn');
    return ![];
  }
  return insertPlainTextIntoEditable(_0x2489da, _0x26e888, _0x372be1);
}
export function showTextInputContextMenu({
  target: _0x31b522,
  screenX: _0x44974c,
  screenY: _0x65a856,
  snapshot: _0x39bad3
}) {
  const _0x4e622c = getDocument();
  if (!_0x4e622c?.["createElement"]) {
    return null;
  }
  const _0x1b6f75 = getTextContextMenuTarget(_0x31b522);
  if (!_0x1b6f75) {
    return null;
  }
  const _0x4596ef = _0x39bad3 === undefined ? captureEditableSelection(_0x31b522) : _0x39bad3;
  closeTextInputContextMenu();
  const _0xc417bd = !!getEditableTextTarget(_0x1b6f75);
  const _0x1ddd3d = isSensitiveTextTarget(_0x1b6f75);
  const _0x690d0d = typeof globalThis["navigator"]?.["clipboard"]?.['writeText'] === 'function';
  const _0x4cfea5 = getSelectedText(_0x1b6f75, _0x4596ef);
  const _0x51d0aa = [];
  _0xc417bd && _0x4e622c["queryCommandSupported"]?.("undo") === !![] && _0x51d0aa["push"]({
    'label': textInputContextMenuText("undo"),
    'icon': 'undo',
    'kbd': 'Ctrl\x20Z',
    'shortcutActionId': "undo",
    'action': () => undoEditableChange(_0x1b6f75, _0x4596ef)
  });
  _0x4cfea5 && !_0x1ddd3d && _0x690d0d && (_0xc417bd && _0x51d0aa["push"]({
    'label': textInputContextMenuText("cut"),
    'icon': "cut",
    'kbd': "Ctrl X",
    'shortcutActionId': 'cut',
    'action': () => void cutEditableSelection(_0x1b6f75, _0x4596ef)
  }), _0x51d0aa['push']({
    'label': textInputContextMenuText("copy"),
    'icon': "copy",
    'kbd': "Ctrl C",
    'shortcutActionId': "copy",
    'action': () => void copyEditableSelection(_0x1b6f75, _0x4596ef)
  }));
  _0xc417bd && (_0x51d0aa['push']({
    'label': textInputContextMenuText("pasteText"),
    'icon': 'paste',
    'kbd': "Ctrl V",
    'shortcutActionId': 'paste',
    'action': () => {
      restoreEditableSelection(_0x1b6f75, _0x4596ef);
      void pasteTextIntoEditableFromClipboard(_0x1b6f75, _0x4596ef);
    }
  }), _0x4cfea5 && _0x51d0aa["push"]({
    'label': textInputContextMenuText("delete"),
    'icon': 'delete',
    'shortcutActionId': 'delete',
    'action': () => deleteEditableSelection(_0x1b6f75, _0x4596ef)
  }));
  if (getTargetText(_0x1b6f75)) {
    if (_0x51d0aa['length'] > 0x0) {
      _0x51d0aa["push"]('sep');
    }
    _0x51d0aa["push"]({
      'label': textInputContextMenuText("selectAll"),
      'icon': "select-all",
      'kbd': "Ctrl A",
      'shortcutActionId': "select-all",
      'action': () => selectAllEditableText(_0x1b6f75)
    });
  }
  if (_0x51d0aa["length"] === 0x0) {
    return null;
  }
  activeTextInputContextMenuSession = showContextMenu(_0x44974c, _0x65a856, _0x51d0aa, {
    'className': "v2-canvas-ctx-menu v2-text-input-context-menu",
    'ensureItemIcons': !![],
    'ownerElement': _0x1b6f75,
    'ownerRoot': _0x1b6f75["parentElement"] || _0x1b6f75,
    'autoFocus': ![]
  });
  return activeTextInputContextMenuSession;
}
export function initTextInputContextMenu(_0x4be070 = getDocument()) {
  if (!_0x4be070?.['addEventListener']) {
    return () => {};
  }
  const _0x2af742 = _0x454722 => {
    if (_0x454722["defaultPrevented"]) {
      return;
    }
    const _0x1d9fd0 = getTextContextMenuTarget(_0x454722["target"]);
    if (!_0x1d9fd0) {
      return;
    }
    _0x454722["preventDefault"]();
    _0x454722["stopPropagation"]();
    const _0x32c6b8 = captureEditableSelection(_0x1d9fd0);
    _0x1d9fd0["focus"]?.({
      'preventScroll': !![]
    });
    showTextInputContextMenu({
      'target': _0x1d9fd0,
      'screenX': _0x454722["clientX"] || 0x0,
      'screenY': _0x454722['clientY'] || 0x0,
      'snapshot': _0x32c6b8
    });
  };
  _0x4be070["addEventListener"]("contextmenu", _0x2af742);
  return () => {
    _0x4be070["removeEventListener"]("contextmenu", _0x2af742);
    closeTextInputContextMenu();
  };
}