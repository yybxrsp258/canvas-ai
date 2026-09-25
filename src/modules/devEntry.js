import { onLocaleChange, t } from '../i18n/index.js';
import { isPreviewModeEnabled, setPreviewMode } from './previewMode.js';
import { bindPreviewUploadEntry } from './previewUploadEntry.js';
import { canManageCanvasShortcuts } from './canvasShortcuts/shortcutCatalog.js';
const DEV_ENTRY_WRAP_ID = 'devEntryWrap';
const LEGACY_DEV_HELPER_ID = 'dev-shortcut-btn';
let syncBound = ![];
let localeUnsubscribe = null;
function devEntryText(_0x2f190a, _0x48c012 = {}) {
  return t("devEntry." + _0x2f190a, _0x48c012);
}
function setToggleButtonState(_0x104c0e, _0x4e3895, _0x476b89) {
  if (!_0x104c0e) {
    return;
  }
  _0x104c0e['classList']["toggle"]('is-active', _0x4e3895 === !![]);
  _0x104c0e["setAttribute"]("aria-pressed", _0x4e3895 === !![] ? 'true' : "false");
  _0x104c0e["title"] = _0x4e3895 === !![] ? _0x476b89['on'] : _0x476b89['off'];
}
function setDevButtonState(_0x24ac67, _0x1bb487) {
  setToggleButtonState(_0x24ac67, _0x1bb487, {
    'on': devEntryText("titles.devOn"),
    'off': devEntryText("titles.devOff")
  });
}
function setPreviewButtonState(_0x542970, _0x39dfdd) {
  setToggleButtonState(_0x542970, _0x39dfdd, {
    'on': devEntryText('titles.previewOn'),
    'off': devEntryText("titles.previewOff")
  });
}
function broadcastDevMode(_0x23af52) {
  try {
    window["dispatchEvent"](new CustomEvent('dev-mode-changed', {
      'detail': {
        'enabled': _0x23af52 === !![]
      }
    }));
  } catch {}
}
function setDevMode(_0x1fa6d2, _0x543879) {
  const _0x2ad12c = _0x1fa6d2 === !![];
  window["DEV_MODE"] = _0x2ad12c;
  document["body"]?.["classList"]?.["toggle"]('dev-mode', _0x2ad12c);
  setDevButtonState(_0x543879, _0x2ad12c);
  broadcastDevMode(_0x2ad12c);
}
export function toggleDevMode() {
  if (window["LOCAL_DEV_BUILD"] !== !![]) {
    return null;
  }
  const _0xfbba1a = !Boolean(window['DEV_MODE']);
  setDevMode(_0xfbba1a, document["getElementById"]('devEntryModeBtn'));
  window["showToast"]?.(_0xfbba1a ? devEntryText("toasts.devOn") : devEntryText("toasts.devOff"));
  return _0xfbba1a;
}
function createEntryButton({
  id: _0x5d58d1,
  label: _0x36a92d,
  title: _0x15c312,
  className = ''
}) {
  const _0x42bcc9 = document["createElement"]('button');
  _0x42bcc9['type'] = "button";
  _0x42bcc9['id'] = _0x5d58d1;
  _0x42bcc9["className"] = ("dev-entry-btn " + className)['trim']();
  _0x42bcc9['title'] = _0x15c312;
  _0x42bcc9["setAttribute"]("aria-label", _0x15c312);
  _0x42bcc9["textContent"] = _0x36a92d;
  return _0x42bcc9;
}
function setButtonTextAndTitle(_0x17b7d7, _0x4bab8e, _0x4b6d88) {
  if (!_0x17b7d7) {
    return;
  }
  _0x17b7d7["textContent"] = _0x4bab8e;
  _0x17b7d7["title"] = _0x4b6d88;
  _0x17b7d7["setAttribute"]("aria-label", _0x4b6d88);
}
function syncDevEntryTexts() {
  const _0x418cb7 = document["getElementById"]("devEntryModeBtn");
  setButtonTextAndTitle(_0x418cb7, devEntryText('buttons.dev'), devEntryText("titles.devOff"));
  setDevButtonState(_0x418cb7, Boolean(window["DEV_MODE"]));
  const _0x2f55b3 = document["getElementById"]("devEntryPreviewModeBtn");
  setButtonTextAndTitle(_0x2f55b3, devEntryText("buttons.preview"), devEntryText("titles.previewOff"));
  setPreviewButtonState(_0x2f55b3, isPreviewModeEnabled());
  setButtonTextAndTitle(document["getElementById"]("devEntryPreviewUploadBtn"), devEntryText("buttons.upload"), devEntryText("titles.upload"));
}
function bindLocaleSync() {
  if (localeUnsubscribe) {
    return;
  }
  localeUnsubscribe = onLocaleChange(syncDevEntryTexts);
}
function bindExternalModeSync() {
  if (syncBound) {
    return;
  }
  syncBound = !![];
  window["addEventListener"]("dev-mode-changed", _0x5007da => {
    const _0x4b70fc = Boolean(_0x5007da?.['detail']?.["enabled"] ?? window['DEV_MODE']);
    setDevButtonState(document["getElementById"]("devEntryModeBtn"), _0x4b70fc);
    const _0x251e11 = document["getElementById"]("devEntryShortcutsBtn");
    if (_0x251e11) {
      _0x251e11["hidden"] = !canManageCanvasShortcuts();
    }
  });
  window['addEventListener']("preview-mode-changed", _0x38c0de => {
    const _0x2e2a6a = Boolean(_0x38c0de?.["detail"]?.["enabled"] ?? globalThis["window"]?.["PREVIEW_MODE"]);
    setPreviewButtonState(document["getElementById"]("devEntryPreviewModeBtn"), _0x2e2a6a);
  });
}
function removeDevEntries() {
  localeUnsubscribe?.();
  localeUnsubscribe = null;
  document['getElementById'](DEV_ENTRY_WRAP_ID)?.['remove']();
  document['getElementById'](LEGACY_DEV_HELPER_ID)?.["remove"]();
}
export function initDevEntries({
  isDevBuild: _0x4c1c0e
} = {}) {
  document["getElementById"](LEGACY_DEV_HELPER_ID)?.["remove"]();
  const _0x1436aa = Boolean(_0x4c1c0e);
  window["LOCAL_DEV_BUILD"] = _0x1436aa;
  document["body"]?.["classList"]?.['toggle']('dev-build', _0x1436aa);
  if (!_0x1436aa) {
    setPreviewMode(![]);
    removeDevEntries();
    return;
  }
  bindExternalModeSync();
  if (document['getElementById'](DEV_ENTRY_WRAP_ID)) {
    return;
  }
  const _0x87bdef = document["createElement"]('div');
  _0x87bdef['id'] = DEV_ENTRY_WRAP_ID;
  _0x87bdef["className"] = "dev-entry-wrap";
  const _0x26a2b5 = createEntryButton({
    'id': 'devEntryModeBtn',
    'label': devEntryText("buttons.dev"),
    'title': devEntryText("titles.devOff"),
    'className': "dev-entry-btn-mode"
  });
  setDevButtonState(_0x26a2b5, Boolean(window["DEV_MODE"]));
  _0x26a2b5['addEventListener']("click", () => {
    toggleDevMode();
  });
  const _0x1832b3 = createEntryButton({
    'id': "devEntryPreviewModeBtn",
    'label': devEntryText("buttons.preview"),
    'title': devEntryText("titles.previewOff"),
    'className': "dev-entry-btn-preview-mode"
  });
  setPreviewButtonState(_0x1832b3, isPreviewModeEnabled());
  _0x1832b3["addEventListener"]('click', () => {
    const _0x403a8f = !isPreviewModeEnabled();
    setPreviewMode(_0x403a8f);
    window["showToast"]?.(_0x403a8f ? devEntryText("toasts.previewOn") : devEntryText("toasts.previewOff"));
  });
  const _0x2e493c = createEntryButton({
    'id': 'devEntryPreviewUploadBtn',
    'label': devEntryText("buttons.upload"),
    'title': devEntryText("titles.upload"),
    'className': "dev-entry-btn-preview-upload"
  });
  const _0xd8e20c = document["createElement"]("input");
  _0xd8e20c["type"] = 'file';
  _0xd8e20c['id'] = "devEntryPreviewUploadInput";
  _0xd8e20c['hidden'] = !![];
  bindPreviewUploadEntry({
    'button': _0x2e493c,
    'input': _0xd8e20c
  });
  _0x87bdef['appendChild'](_0x26a2b5);
  _0x87bdef["appendChild"](_0x1832b3);
  _0x87bdef['appendChild'](_0x2e493c);
  _0x87bdef["appendChild"](_0xd8e20c);
  const _0x24139a = createEntryButton({
    'id': "devEntryShortcutsBtn",
    'label': "快捷模板",
    'title': "管理空白画布快捷方式"
  });
  _0x24139a['hidden'] = !canManageCanvasShortcuts();
  _0x24139a["addEventListener"]("click", () => {
    if (canManageCanvasShortcuts()) {
      window["dispatchEvent"](new CustomEvent("canvas-shortcuts:manage"));
    }
  });
  _0x87bdef["appendChild"](_0x24139a);
  const _0x1876ca = document['querySelector'](".header-right");
  if (_0x1876ca) {
    _0x1876ca["prepend"](_0x87bdef);
  } else {
    document["body"]["appendChild"](_0x87bdef);
  }
  bindLocaleSync();
}