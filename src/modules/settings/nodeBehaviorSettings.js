import a1357_0x16442f from '../../core/stores/appStore.js';
import { closeSlashMenu } from '../slashMenu.js';
const COMMENT_NOTE_JUMP_FOCUS_X_STORAGE_KEY = "v2-comment-note-jump-focus-x";
const COMMENT_NOTE_JUMP_FOCUS_Y_STORAGE_KEY = "v2-comment-note-jump-focus-y";
const DEFAULT_COMMENT_NOTE_JUMP_FOCUS_X_PERCENT = 0x32;
const DEFAULT_COMMENT_NOTE_JUMP_FOCUS_Y_PERCENT = 0x14;
function getRuntimeRoot() {
  if (typeof window !== "undefined") {
    return window;
  }
  return globalThis;
}
function getRuntimeStorage() {
  const _0x180df0 = getRuntimeRoot();
  try {
    if (_0x180df0?.["localStorage"]) {
      return _0x180df0['localStorage'];
    }
  } catch {}
  try {
    if (typeof localStorage !== "undefined" && localStorage) {
      return localStorage;
    }
  } catch {}
  return null;
}
function normalizePercent(_0x1fe6f9, _0x583538) {
  if (_0x1fe6f9 === null || _0x1fe6f9 === undefined || _0x1fe6f9 === '') {
    return _0x583538;
  }
  const _0xe1c1d1 = Number(_0x1fe6f9);
  if (!Number['isFinite'](_0xe1c1d1)) {
    return _0x583538;
  }
  return Math['max'](0x0, Math["min"](0x64, Math['round'](_0xe1c1d1)));
}
function readPercentPref(_0x4603ba, _0x2fff54) {
  let _0x14312a = null;
  try {
    _0x14312a = getRuntimeStorage()?.["getItem"](_0x4603ba) ?? null;
  } catch {}
  return normalizePercent(_0x14312a, _0x2fff54);
}
function writePercentPref(_0x1b339e, _0x35b44d, _0x32e239) {
  const _0xc7a6e5 = normalizePercent(_0x35b44d, _0x32e239);
  try {
    getRuntimeStorage()?.["setItem"](_0x1b339e, String(_0xc7a6e5));
  } catch {}
  return _0xc7a6e5;
}
export function readCommentNoteJumpFocusPref() {
  return {
    'viewportAlignX': readPercentPref(COMMENT_NOTE_JUMP_FOCUS_X_STORAGE_KEY, DEFAULT_COMMENT_NOTE_JUMP_FOCUS_X_PERCENT) / 0x64,
    'viewportAlignY': readPercentPref(COMMENT_NOTE_JUMP_FOCUS_Y_STORAGE_KEY, DEFAULT_COMMENT_NOTE_JUMP_FOCUS_Y_PERCENT) / 0x64
  };
}
export function applyImageVideoNodeResizePref(_0x11966f) {
  if (typeof document === 'undefined') {
    return;
  }
  const _0x425bda = document['getElementById']("v2-wrap");
  if (!_0x425bda) {
    return;
  }
  _0x425bda["classList"]["toggle"]("v2-media-node-resize-enabled", _0x11966f === !![]);
}
function syncButtonPair(_0x10bc8f, _0x4751a0, _0x52860) {
  if (typeof document === "undefined") {
    return;
  }
  const _0x17e260 = _0x52860 === !![];
  document["getElementById"](_0x10bc8f)?.["classList"]["toggle"]("active", _0x17e260);
  document['getElementById'](_0x4751a0)?.['classList']["toggle"]("active", !_0x17e260);
  document["getElementById"](_0x10bc8f)?.["setAttribute"]?.("aria-pressed", String(_0x17e260));
  document["getElementById"](_0x4751a0)?.["setAttribute"]?.("aria-pressed", String(!_0x17e260));
}
function normalizePromptEnterBehavior(_0x447551) {
  return _0x447551 === "newline" ? 'newline' : "submit";
}
function syncPromptEnterBehaviorButtons(_0x5373bb) {
  if (typeof document === "undefined") {
    return;
  }
  const _0x2ec04e = normalizePromptEnterBehavior(_0x5373bb);
  document["querySelectorAll"]("#promptEnterBehaviorGroup .cursor-size-btn")["forEach"](_0x482fb7 => {
    _0x482fb7["classList"]["toggle"]("active", _0x482fb7["dataset"]['promptEnterBehavior'] === _0x2ec04e);
    _0x482fb7["setAttribute"]?.("aria-pressed", String(_0x482fb7["dataset"]["promptEnterBehavior"] === _0x2ec04e));
  });
}
function syncNodeAvoidOverlapButtons(_0x4cd6e9) {
  if (typeof document === "undefined") {
    return;
  }
  const _0x2e65a3 = _0x4cd6e9 !== ![];
  document["querySelectorAll"]("#nodeAvoidOverlapGroup .cursor-size-btn")["forEach"](_0x2f4c0f => {
    const _0x144cd7 = _0x2f4c0f["dataset"]["avoid"] === 'on';
    _0x2f4c0f["classList"]["toggle"]('active', _0x144cd7 === _0x2e65a3);
    _0x2f4c0f["setAttribute"]?.("aria-pressed", String(_0x144cd7 === _0x2e65a3));
  });
}
export function setSelectionMediaPropertiesPref(_0x19c1dd, _0x4b81b2 = a1357_0x16442f) {
  const _0x2b429d = _0x19c1dd !== ![];
  _0x4b81b2["setShowSelectionMediaProperties"](_0x2b429d);
  syncButtonPair("btnSelectionMediaPropertiesOn", "btnSelectionMediaPropertiesOff", _0x2b429d);
  return _0x2b429d;
}
export function setImageVideoNodeResizePref(_0x1bdbd2, _0x44fc74 = a1357_0x16442f) {
  const _0x3646af = _0x1bdbd2 === !![];
  _0x44fc74['setImageVideoNodeResizeEnabled'](_0x3646af);
  applyImageVideoNodeResizePref(_0x3646af);
  syncButtonPair("btnMediaNodeResizeOn", "btnMediaNodeResizeOff", _0x3646af);
  return _0x3646af;
}
export function setTitleFollowsCanvasZoomPref(_0x1a2ad3, _0x21f80e = a1357_0x16442f) {
  const _0xffa076 = _0x1a2ad3 === !![];
  _0x21f80e["setTitleFollowsCanvasZoom"](_0xffa076);
  syncButtonPair("btnTitleFollowsZoomOn", "btnTitleFollowsZoomOff", _0xffa076);
  return _0xffa076;
}
export function setPromptBoxResizePref(_0x258b2d, _0x3795dd = a1357_0x16442f) {
  const _0xb5bc9e = _0x258b2d !== ![];
  _0x3795dd["setPromptBoxResizeEnabled"](_0xb5bc9e);
  syncButtonPair("btnPromptBoxResizeOn", "btnPromptBoxResizeOff", _0xb5bc9e);
  return _0xb5bc9e;
}
export function setPromptEnterBehaviorPref(_0x5ba016, _0x1c5255 = a1357_0x16442f) {
  const _0x5db222 = normalizePromptEnterBehavior(_0x5ba016);
  _0x1c5255["setPromptEnterBehavior"](_0x5db222);
  syncPromptEnterBehaviorButtons(_0x5db222);
  return _0x5db222;
}
export function applyPromptAttachmentButtonHiddenPref(_0x3deea1) {
  if (typeof document === "undefined") {
    return;
  }
  const _0x46641f = document["getElementById"]("v2-wrap");
  if (!_0x46641f) {
    return;
  }
  _0x46641f['classList']["toggle"]("prompt-attachment-button-hidden", _0x3deea1 === !![]);
}
export function setPromptAttachmentButtonHiddenPref(_0x1dc771, _0x44e61e = a1357_0x16442f) {
  const _0x47d771 = _0x1dc771 === !![];
  _0x44e61e["setPromptAttachmentButtonHidden"](_0x47d771);
  applyPromptAttachmentButtonHiddenPref(_0x47d771);
  syncButtonPair("btnPromptAttachmentButtonHiddenYes", 'btnPromptAttachmentButtonHiddenNo', _0x47d771);
  _0x47d771 && _0x44e61e["getState"]?.()?.['pickConnectMode']?.["active"] && _0x44e61e['setPickConnectMode']?.({
    'active': ![]
  });
  return _0x47d771;
}
export function applyPromptPresetButtonHiddenPref(_0x349484) {
  if (typeof document === "undefined") {
    return;
  }
  const _0x245857 = document["getElementById"]('v2-wrap');
  if (!_0x245857) {
    return;
  }
  _0x245857["classList"]["toggle"]("prompt-preset-button-hidden", _0x349484 === !![]);
}
export function setPromptPresetButtonHiddenPref(_0x43e854, _0x249f50 = a1357_0x16442f) {
  const _0x119588 = _0x43e854 === !![];
  _0x249f50["setPromptPresetButtonHidden"](_0x119588);
  applyPromptPresetButtonHiddenPref(_0x119588);
  syncButtonPair("btnPromptPresetButtonHiddenYes", "btnPromptPresetButtonHiddenNo", _0x119588);
  _0x119588 && document['getElementById']("v2-slash-menu")?.["classList"]["contains"]("open") && closeSlashMenu();
  return _0x119588;
}
export function setVideoAudioDefaultEnabledPref(_0x513b1b, _0x4716ba = a1357_0x16442f) {
  const _0x580cde = _0x513b1b === !![];
  _0x4716ba["setVideoAudioDefaultEnabled"](_0x580cde);
  syncButtonPair("btnVideoAudioDefaultEnabledOn", "btnVideoAudioDefaultEnabledOff", _0x580cde);
  return _0x580cde;
}
export function setNodeAvoidOverlapPref(_0x1222f4) {
  const _0x358780 = _0x1222f4 !== ![];
  const _0x4bec7f = typeof window !== "undefined" ? window : globalThis;
  _0x4bec7f["v2NodeAvoidOverlap"] = _0x358780;
  try {
    _0x4bec7f?.["localStorage"]?.["setItem"]("v2-node-avoid-overlap", _0x358780 ? '1' : '0');
  } catch {}
  syncNodeAvoidOverlapButtons(_0x358780);
  return _0x358780;
}
function initSelectionMediaProperties() {
  const _0x423dca = document["getElementById"]("btnSelectionMediaPropertiesOn");
  const _0x4ba156 = document["getElementById"]('btnSelectionMediaPropertiesOff');
  if (!_0x423dca || !_0x4ba156) {
    return;
  }
  const _0x1b7392 = a1357_0x16442f["getState"]();
  const _0x531c1b = _0x1b7392?.['ui']?.["showSelectionMediaProperties"] !== ![];
  setSelectionMediaPropertiesPref(_0x531c1b);
  _0x423dca["addEventListener"]("click", () => setSelectionMediaPropertiesPref(!![]));
  _0x4ba156["addEventListener"]("click", () => setSelectionMediaPropertiesPref(![]));
}
function initImageVideoNodeResize() {
  const _0x559990 = document["getElementById"]("btnMediaNodeResizeOn");
  const _0x2e77c2 = document['getElementById']("btnMediaNodeResizeOff");
  if (!_0x559990 || !_0x2e77c2) {
    return;
  }
  const _0x331d74 = a1357_0x16442f["getState"]();
  const _0x126702 = _0x331d74?.['ui']?.["imageVideoNodeResizeEnabled"] === !![];
  setImageVideoNodeResizePref(_0x126702);
  _0x559990["addEventListener"]("click", () => setImageVideoNodeResizePref(!![]));
  _0x2e77c2['addEventListener']("click", () => setImageVideoNodeResizePref(![]));
}
function initTitleFollowsCanvasZoom() {
  const _0x37b770 = document["getElementById"]("btnTitleFollowsZoomOn");
  const _0x1ef87b = document["getElementById"]("btnTitleFollowsZoomOff");
  if (!_0x37b770 || !_0x1ef87b) {
    return;
  }
  const _0x1bf401 = a1357_0x16442f["getState"]();
  const _0x32a2b9 = _0x1bf401?.['ui']?.["titleFollowsCanvasZoom"] === !![];
  setTitleFollowsCanvasZoomPref(_0x32a2b9);
  _0x37b770["addEventListener"]("click", () => setTitleFollowsCanvasZoomPref(!![]));
  _0x1ef87b["addEventListener"]("click", () => setTitleFollowsCanvasZoomPref(![]));
}
function initPromptBoxResize() {
  const _0x2a112d = document["getElementById"]('btnPromptBoxResizeOn');
  const _0x449aa3 = document['getElementById']("btnPromptBoxResizeOff");
  if (!_0x2a112d || !_0x449aa3) {
    return;
  }
  const _0xfd54f0 = a1357_0x16442f["getState"]();
  const _0x489031 = _0xfd54f0?.['ui']?.["promptBoxResizeEnabled"] !== ![];
  setPromptBoxResizePref(_0x489031);
  _0x2a112d["addEventListener"]('click', () => setPromptBoxResizePref(!![]));
  _0x449aa3['addEventListener']('click', () => setPromptBoxResizePref(![]));
}
function initPromptEnterBehavior() {
  const _0x176b8a = document["getElementById"]('promptEnterBehaviorGroup');
  if (!_0x176b8a) {
    return;
  }
  const _0x1be12c = a1357_0x16442f["getState"]();
  const _0xee36e = normalizePromptEnterBehavior(_0x1be12c?.['ui']?.["promptEnterBehavior"]);
  setPromptEnterBehaviorPref(_0xee36e);
  document["querySelectorAll"]("#promptEnterBehaviorGroup .cursor-size-btn")["forEach"](_0x28c071 => {
    _0x28c071["addEventListener"]("click", () => setPromptEnterBehaviorPref(_0x28c071["dataset"]["promptEnterBehavior"]));
  });
}
function initPromptAttachmentButtonHidden() {
  const _0x2637ae = document["getElementById"]('btnPromptAttachmentButtonHiddenNo');
  const _0x545dce = document["getElementById"]("btnPromptAttachmentButtonHiddenYes");
  if (!_0x2637ae || !_0x545dce) {
    return;
  }
  const _0x3f01c2 = a1357_0x16442f["getState"]();
  const _0x1acb95 = _0x3f01c2?.['ui']?.['promptAttachmentButtonHidden'] === !![];
  setPromptAttachmentButtonHiddenPref(_0x1acb95);
  _0x2637ae["addEventListener"]("click", () => setPromptAttachmentButtonHiddenPref(![]));
  _0x545dce['addEventListener']("click", () => setPromptAttachmentButtonHiddenPref(!![]));
}
function initPromptPresetButtonHidden() {
  const _0x6395c4 = document["getElementById"]("btnPromptPresetButtonHiddenNo");
  const _0x41be49 = document["getElementById"]("btnPromptPresetButtonHiddenYes");
  if (!_0x6395c4 || !_0x41be49) {
    return;
  }
  const _0x5b8342 = a1357_0x16442f["getState"]()?.['ui']?.['promptPresetButtonHidden'] === !![];
  setPromptPresetButtonHiddenPref(_0x5b8342);
  _0x6395c4["addEventListener"]('click', () => setPromptPresetButtonHiddenPref(![]));
  _0x41be49["addEventListener"]("click", () => setPromptPresetButtonHiddenPref(!![]));
}
function initVideoAudioDefaultEnabled() {
  const _0x41bf40 = document['getElementById']('btnVideoAudioDefaultEnabledOn');
  const _0x186994 = document["getElementById"]("btnVideoAudioDefaultEnabledOff");
  if (!_0x41bf40 || !_0x186994) {
    return;
  }
  const _0x12e816 = a1357_0x16442f["getState"]();
  const _0xbdf100 = _0x12e816?.['ui']?.["videoAudioDefaultEnabled"] === !![];
  setVideoAudioDefaultEnabledPref(_0xbdf100);
  _0x41bf40['addEventListener']("click", () => setVideoAudioDefaultEnabledPref(!![]));
  _0x186994["addEventListener"]("click", () => setVideoAudioDefaultEnabledPref(![]));
}
function initCommentNoteJumpFocus() {
  const _0x4a6909 = ({
    sliderId: _0xd27c0,
    valueId: _0x3d467d,
    storageKey: _0x1f6ee4,
    fallback: _0x2b4eb8
  }) => {
    const _0x6d0660 = document['getElementById'](_0xd27c0);
    const _0x1fe3bc = document['getElementById'](_0x3d467d);
    if (!_0x6d0660) {
      return;
    }
    const _0x4e14a6 = _0x576ce1 => {
      const _0xb5540 = normalizePercent(_0x576ce1, _0x2b4eb8);
      _0x6d0660['value'] = String(_0xb5540);
      if (_0x1fe3bc) {
        _0x1fe3bc["textContent"] = _0xb5540 + '%';
      }
      return _0xb5540;
    };
    _0x4e14a6(readPercentPref(_0x1f6ee4, _0x2b4eb8));
    _0x6d0660["addEventListener"]("input", _0x2145a5 => {
      _0x4e14a6(_0x2145a5['target']?.['value']);
    });
    _0x6d0660['addEventListener']('change', _0x131227 => {
      _0x4e14a6(writePercentPref(_0x1f6ee4, _0x131227["target"]?.['value'], _0x2b4eb8));
    });
  };
  _0x4a6909({
    'sliderId': "commentNoteJumpFocusXSlider",
    'valueId': "commentNoteJumpFocusXValue",
    'storageKey': COMMENT_NOTE_JUMP_FOCUS_X_STORAGE_KEY,
    'fallback': DEFAULT_COMMENT_NOTE_JUMP_FOCUS_X_PERCENT
  });
  _0x4a6909({
    'sliderId': "commentNoteJumpFocusYSlider",
    'valueId': 'commentNoteJumpFocusYValue',
    'storageKey': COMMENT_NOTE_JUMP_FOCUS_Y_STORAGE_KEY,
    'fallback': DEFAULT_COMMENT_NOTE_JUMP_FOCUS_Y_PERCENT
  });
}
function initNodeSpacing() {
  const _0x5c551e = document["getElementById"]("nodeSpacingSlider");
  const _0x531db2 = document["getElementById"]("nodeSpacingValue");
  let _0x1da36d = parseInt(localStorage["getItem"]("v2-node-spacing"), 0xa);
  if (isNaN(_0x1da36d)) {
    _0x1da36d = 0x78;
  }
  window["v2NodeSpacing"] = _0x1da36d;
  if (_0x5c551e) {
    _0x5c551e["value"] = _0x1da36d;
    if (_0x531db2) {
      _0x531db2["textContent"] = _0x1da36d;
    }
  }
  _0x5c551e?.["addEventListener"]('input', _0x598256 => {
    const _0xfbb0ea = parseInt(_0x598256["target"]["value"], 0xa);
    if (_0x531db2) {
      _0x531db2["textContent"] = _0xfbb0ea;
    }
  });
  _0x5c551e?.["addEventListener"]("change", _0x1d844d => {
    const _0x165f7f = parseInt(_0x1d844d["target"]["value"], 0xa);
    window['v2NodeSpacing'] = _0x165f7f;
    localStorage["setItem"]("v2-node-spacing", _0x165f7f);
  });
}
function initNodeDirection() {
  const _0x14afa6 = localStorage["getItem"]('v2-node-direction') || "right";
  window["v2NodeDirection"] = _0x14afa6;
  const _0x2b6a68 = document['querySelectorAll']("#nodeDirectionGroup .cursor-size-btn");
  _0x2b6a68["forEach"](_0x44c1c7 => {
    _0x44c1c7["classList"]["toggle"]("active", _0x44c1c7['dataset']["dir"] === _0x14afa6);
    _0x44c1c7["addEventListener"]('click', () => {
      _0x2b6a68["forEach"](_0x4798ef => _0x4798ef["classList"]["remove"]('active'));
      _0x44c1c7["classList"]['add']("active");
      window['v2NodeDirection'] = _0x44c1c7["dataset"]['dir'];
      localStorage["setItem"]("v2-node-direction", _0x44c1c7['dataset']["dir"]);
    });
  });
}
function initNodeAvoidOverlap() {
  const _0x406f0e = localStorage['getItem']('v2-node-avoid-overlap');
  let _0x47610f = !![];
  _0x406f0e == null ? localStorage["setItem"]("v2-node-avoid-overlap", '1') : _0x47610f = _0x406f0e === '1' || _0x406f0e === "true";
  setNodeAvoidOverlapPref(_0x47610f);
  const _0x326cf4 = document['querySelectorAll']("#nodeAvoidOverlapGroup .cursor-size-btn");
  _0x326cf4['forEach'](_0x41a5e4 => {
    _0x41a5e4["addEventListener"]("click", () => {
      setNodeAvoidOverlapPref(_0x41a5e4["dataset"]["avoid"] === 'on');
    });
  });
}
export function initNodeBehaviorSettings() {
  initSelectionMediaProperties();
  initImageVideoNodeResize();
  initTitleFollowsCanvasZoom();
  initPromptBoxResize();
  initPromptEnterBehavior();
  initPromptAttachmentButtonHidden();
  initPromptPresetButtonHidden();
  initVideoAudioDefaultEnabled();
  initCommentNoteJumpFocus();
  initNodeSpacing();
  initNodeDirection();
  initNodeAvoidOverlap();
}