import a1711_0x24849b from '../core/stores/appStore.js';
import { hasActiveModalInteraction } from './modalInteractionScope.js';
import { getShortcuts, handleShortcutKeydown, isRecording, resolveShortcutActionForEvent } from '../modules/shortcuts.js';
import { buildJumpShortcutBinding, normalizeCommentNoteJumpShortcut, parseJumpShortcutFromKeydown } from '../modules/commentNoteJumpShortcut.js';
import { hasActiveReadonlyTextSelection } from '../components/aigenText/readonlyTextSelection.js';
import { toggleDevMode } from '../modules/devEntry.js';
import { getSelectedSyncPlayableVideoCount } from '../modules/videoSyncPlayback.js';
import { isCanvasPanShortcutHeld, releaseCanvasPanShortcut, setCanvasPanShortcutHeld } from './canvasPanShortcutState.js';
let _listeners = [];
let _settingsShortcutRoot = null;
const ALIGN_HOLD_TRIGGER_MS = 0xdc;
let _alignHoldTimer = null;
let _alignHoldActive = ![];
let _alignHoldKey = '';
const MODIFIER_ALIAS_MAP = Object['freeze']({
  'CTRL': "Ctrl",
  'CONTROL': "Ctrl",
  'CMD': "Ctrl",
  'COMMAND': 'Ctrl',
  'META': "Ctrl",
  'SHIFT': "Shift",
  'ALT': "Alt",
  'OPTION': "Alt"
});
const NAMED_KEY_ALIAS_MAP = Object["freeze"]({
  'SPACE': "Space",
  'ESC': 'Escape',
  'ESCAPE': "Escape",
  'ENTER': "Enter",
  'TAB': "Tab",
  'DELETE': "Delete",
  'BACKSPACE': 'Backspace'
});
const INTERACTION_MODIFIER_SHORTCUTS = new Set(["cut-edge", "duplicate-with-edges", "multi-select"]);
const ACTIVE_WHITEBOARD_EDITOR_SELECTOR = ".whiteboard-node-component.is-whiteboard-editing";
function normalizeShortcutKeyPart(_0x26e566) {
  const _0xf658da = String(_0x26e566 ?? '')["trim"]();
  if (!_0xf658da) {
    return '';
  }
  if (_0xf658da === '\x20') {
    return "Space";
  }
  const _0x43ea2d = _0xf658da["toUpperCase"]();
  if (MODIFIER_ALIAS_MAP[_0x43ea2d]) {
    return MODIFIER_ALIAS_MAP[_0x43ea2d];
  }
  if (NAMED_KEY_ALIAS_MAP[_0x43ea2d]) {
    return NAMED_KEY_ALIAS_MAP[_0x43ea2d];
  }
  if (_0xf658da["length"] === 0x1) {
    return _0xf658da["toUpperCase"]();
  }
  return _0xf658da[0x0]["toUpperCase"]() + _0xf658da["slice"](0x1)["toLowerCase"]();
}
function getPanShortcutParts() {
  const _0x115ab2 = getShortcuts?.() || {};
  const _0x45b05c = _0x115ab2?.["pan-canvas"]?.["keys"];
  const _0xe567f7 = Array["isArray"](_0x45b05c) && _0x45b05c['length'] > 0x0 ? _0x45b05c : ["Space"];
  return new Set(_0xe567f7["map"](_0x65a5cc => normalizeShortcutKeyPart(_0x65a5cc))["filter"](Boolean));
}
function shouldReleasePanShortcut(_0x506966) {
  if (!isCanvasPanShortcutHeld()) {
    return ![];
  }
  const _0xa6a484 = _0x506966?.["key"] === '\x20' || _0x506966?.['code'] === 'Space' ? "Space" : _0x506966?.["key"];
  const _0x5db0d8 = normalizeShortcutKeyPart(_0xa6a484);
  if (!_0x5db0d8) {
    return ![];
  }
  return getPanShortcutParts()["has"](_0x5db0d8);
}
function isAudioClipModeActive() {
  const _0xe2be2a = document["getElementById"]("v2-wrap");
  return !!_0xe2be2a?.["classList"]["contains"]("is-audio-clip-mode");
}
function isEscFeatureModeActive(_0x1e099d) {
  return !!_0x1e099d?.["matting"]?.["active"] || !!_0x1e099d?.["annotate"]?.["active"] || isAudioClipModeActive();
}
function isCommentNoteShortcutRecording() {
  return window["__commentNoteShortcutRecording"] === !![];
}
function dispatchShortcutAction(_0x48a644) {
  window["dispatchEvent"](new CustomEvent("shortcut-action", {
    'detail': _0x48a644
  }));
}
function isRepeatSuppressedShortcut(_0x29c630) {
  const _0x1cd0e4 = String(_0x29c630 || '');
  return _0x1cd0e4 === "upload-file" || _0x1cd0e4 === "open-settings" || _0x1cd0e4 === "panorama-scene-camera-create" || _0x1cd0e4["startsWith"]("panorama-scene-camera-");
}
function isInteractionModifierShortcut(_0x52d289) {
  return INTERACTION_MODIFIER_SHORTCUTS["has"](String(_0x52d289 || ''));
}
function resolveCommentNoteJumpActionId(_0x30646b, _0x1597db) {
  if (!_0x30646b || _0x1597db?.["repeat"]) {
    return null;
  }
  const _0x1c5a3c = buildJumpShortcutBinding(parseJumpShortcutFromKeydown(_0x1597db));
  if (!_0x1c5a3c) {
    return null;
  }
  const _0x135e21 = _0x30646b["nodes"] || {};
  for (const [_0x306aca, _0x33be33] of Object['entries'](_0x135e21)) {
    if (!_0x33be33 || _0x33be33["type"] !== 'comment-note') {
      continue;
    }
    const _0x331d43 = normalizeCommentNoteJumpShortcut(_0x33be33['jumpShortcut']);
    const _0x41ca05 = buildJumpShortcutBinding(_0x331d43["keys"]);
    if (!_0x41ca05 || _0x41ca05 !== _0x1c5a3c) {
      continue;
    }
    return "comment-note-jump::" + _0x306aca;
  }
  return null;
}
function _clearAlignHoldState() {
  _alignHoldTimer && (clearTimeout(_alignHoldTimer), _alignHoldTimer = null);
  _alignHoldActive = ![];
  _alignHoldKey = '';
}
function isEditingText() {
  const _0x51dd30 = document["activeElement"];
  const _0x53dff8 = _0x51dd30?.["tagName"];
  return _0x53dff8 === 'INPUT' || _0x53dff8 === "TEXTAREA" || _0x51dd30?.["contentEditable"] === "true" || _0x51dd30?.["isContentEditable"] === !![];
}
function handleSettingsKeyDown(_0x47e193) {
  if (_0x47e193["isComposing"] || _0x47e193["repeat"] || isRecording() || isCommentNoteShortcutRecording() || isEditingText()) {
    return;
  }
  if (resolveShortcutActionForEvent(_0x47e193, ["open-settings"]) !== 'open-settings') {
    return;
  }
  _0x47e193["preventDefault"]();
  _0x47e193["stopPropagation"]();
  dispatchShortcutAction("open-settings");
}
function isPlainCopyShortcut(_0x489d4e) {
  return (_0x489d4e?.["ctrlKey"] || _0x489d4e?.["metaKey"]) && !_0x489d4e?.['shiftKey'] && !_0x489d4e?.['altKey'] && (String(_0x489d4e?.['key'] || '')["toLowerCase"]() === 'c' || _0x489d4e?.['code'] === "KeyC");
}
function isActiveWhiteboardEditorTarget(_0x143ad0) {
  const _0x1a7476 = _0x143ad0?.["target"] || document["activeElement"];
  return Boolean(_0x1a7476?.['closest']?.(ACTIVE_WHITEBOARD_EDITOR_SELECTOR));
}
function isDevModeToggleShortcut(_0x15717d) {
  if (window['LOCAL_DEV_BUILD'] !== !![] || _0x15717d?.["repeat"] || _0x15717d?.["ctrlKey"] || _0x15717d?.['metaKey'] || _0x15717d?.["altKey"]) {
    return ![];
  }
  return _0x15717d?.["code"] === "Backslash" || _0x15717d?.["key"] === '\x5c' || _0x15717d?.["key"] === '|' || _0x15717d?.["key"] === '、';
}
function hasExpandedMediaClipNode(_0x4138d6) {
  const _0x65b24 = _0x4138d6?.["nodes"] || {};
  return Object["values"](_0x65b24)["some"](_0x449136 => _0x449136?.["type"] === "media-clip" && _0x449136?.["mediaClip"]?.["expanded"] === !![]);
}
function buildShortcutContext(_0x32747a, {
  audioClipModeActive = ![]
} = {}) {
  const _0x25a844 = Array['isArray'](_0x32747a?.['selectedNodeIds']) ? _0x32747a["selectedNodeIds"] : [];
  const _0x2ada13 = _0x25a844["length"] === 0x1 ? _0x32747a?.["nodes"]?.[_0x25a844[0x0]]?.["type"] || '' : '';
  const _0x3fd0c3 = _0x25a844["length"] === 0x1 ? _0x32747a?.["nodes"]?.[_0x25a844[0x0]] || null : null;
  const _0x4182a2 = _0x2ada13 === "panorama-360" ? _0x3fd0c3?.["panorama360Node"] || null : _0x3fd0c3?.["sceneNode"] || null;
  return {
    'mattingActive': _0x32747a?.["matting"]?.["active"],
    'annotateActive': _0x32747a?.['annotate']?.["active"],
    'videoKeyingActive': _0x32747a?.["videoKeying"]?.["active"],
    'featureModeActive': !!_0x32747a?.['matting']?.["active"] || !!_0x32747a?.["annotate"]?.["active"] || !!_0x32747a?.["videoClip"]?.['active'] || !!_0x32747a?.['videoKeying']?.['active'] || audioClipModeActive,
    'alignFeatureEnabled': _0x32747a?.['ui']?.["alignFeatureEnabled"] !== ![],
    'selectedNodeType': _0x2ada13,
    'selectedSyncPlayableVideoCount': getSelectedSyncPlayableVideoCount(_0x32747a?.["nodes"] || {}, _0x25a844),
    'mediaClipExpandedEditing': hasExpandedMediaClipNode(_0x32747a),
    'panoramaSceneEditing': (_0x2ada13 === "panorama-scene" || _0x2ada13 === "panorama-360") && _0x4182a2?.['ui']?.['isEditing'] === !![],
    'panoramaSceneFlyMode': _0x2ada13 === "panorama-scene" && _0x4182a2?.['ui']?.['isEditing'] === !![] && _0x4182a2?.['ui']?.['navigationMode'] === "fly"
  };
}
function isPanoramaSceneNavigationKey(_0x5ae4dc, _0x582a57) {
  if (!_0x582a57?.["panoramaSceneEditing"] || _0x5ae4dc?.["ctrlKey"] || _0x5ae4dc?.["metaKey"] || _0x5ae4dc?.['altKey']) {
    return ![];
  }
  if (_0x5ae4dc?.['code'] === "KeyF") {
    return !![];
  }
  return _0x582a57["panoramaSceneFlyMode"] === !![] && ['KeyW', "KeyA", 'KeyS', "KeyD", "KeyQ", "KeyE"]["includes"](_0x5ae4dc?.['code']);
}
function handleKeyDown(_0x35e1d1) {
  if (hasActiveModalInteraction()) {
    return;
  }
  if (isRecording()) {
    return;
  }
  if (isCommentNoteShortcutRecording()) {
    return;
  }
  if (_0x35e1d1["target"]?.["closest"]?.(".v2-canvas-ctx-menu") || globalThis["document"]?.["querySelector"]?.('.v2-canvas-ctx-menu,\x20.v2-material-context-menu,\x20.panorama-scene-object-menu.is-visible')) {
    return;
  }
  if (isDevModeToggleShortcut(_0x35e1d1) && !isEditingText() && !isActiveWhiteboardEditorTarget(_0x35e1d1)) {
    _0x35e1d1['preventDefault']();
    toggleDevMode();
    return;
  }
  if (document["body"]?.['classList']?.["contains"]?.("storyboard-3d-editor-open")) {
    return;
  }
  const _0x3c8589 = a1711_0x24849b["getStateRaw"]();
  if (_0x35e1d1['code'] === "Escape" && isEscFeatureModeActive(_0x3c8589)) {
    _0x35e1d1["preventDefault"]();
    _0x35e1d1["stopImmediatePropagation"]();
    dispatchShortcutAction('escape-all');
    return;
  }
  if (isEditingText()) {
    if (_0x35e1d1["code"] === "Escape") {
      const {
        pickConnectMode: _0x2a6b99
      } = a1711_0x24849b["getStateRaw"]();
      _0x2a6b99 && _0x2a6b99["active"] && (a1711_0x24849b["setPickConnectMode"]({
        'active': ![]
      }), _0x35e1d1["preventDefault"](), _0x35e1d1["stopPropagation"]());
    }
    return;
  }
  if (isActiveWhiteboardEditorTarget(_0x35e1d1)) {
    return;
  }
  if (isPlainCopyShortcut(_0x35e1d1) && hasActiveReadonlyTextSelection(document)) {
    return;
  }
  const _0x4796f2 = isAudioClipModeActive();
  if (_0x4796f2) {
    return;
  }
  if ((_0x35e1d1["key"] === '\x20' || _0x35e1d1["code"] === "Space") && !_0x35e1d1["ctrlKey"] && !_0x35e1d1["metaKey"] && !_0x35e1d1["altKey"] && !_0x35e1d1["shiftKey"] && _0x35e1d1["target"]?.["closest"]?.("button")) {
    return;
  }
  if (_0x3c8589["videoKeying"]?.["active"] || _0x3c8589['videoClip']?.['active']) {
    if (_0x35e1d1["code"] === "Escape") {
      return;
    }
    _0x35e1d1['preventDefault']();
    _0x35e1d1["stopPropagation"]();
    return;
  }
  if (_0x3c8589["annotate"]?.['active'] && !_0x35e1d1['ctrlKey'] && !_0x35e1d1["metaKey"] && !_0x35e1d1["altKey"] && String(_0x35e1d1["key"] || '')["toUpperCase"]() === 'T') {
    _0x35e1d1["preventDefault"]();
    _0x35e1d1['stopPropagation']();
    window["dispatchEvent"](new CustomEvent('shortcut-action', {
      'detail': "editor-tool-text"
    }));
    return;
  }
  if (_0x35e1d1['code'] === 'Escape') {
    const {
      pickConnectMode: _0x1d65c8
    } = a1711_0x24849b["getStateRaw"]();
    if (_0x1d65c8 && _0x1d65c8["active"]) {
      a1711_0x24849b["setPickConnectMode"]({
        'active': ![]
      });
      _0x35e1d1["preventDefault"]();
      _0x35e1d1["stopPropagation"]();
      return;
    }
  }
  if (_0x35e1d1['key'] === "Control") {
    const _0x6862cc = document["getElementById"]("pick-connect-overlay");
    _0x6862cc && _0x6862cc["style"]["display"] !== 'none' && (_0x6862cc["style"]["cursor"] = "var(--connect-cursor)");
  }
  const _0x1d0732 = a1711_0x24849b["getStateRaw"]();
  const _0x317b0b = buildShortcutContext(_0x1d0732, {
    'audioClipModeActive': _0x4796f2
  });
  if (isPanoramaSceneNavigationKey(_0x35e1d1, _0x317b0b)) {
    _0x35e1d1["preventDefault"]();
    return;
  }
  const _0x5385c9 = handleShortcutKeydown(_0x35e1d1, _0x317b0b);
  if (_0x35e1d1["repeat"] && isRepeatSuppressedShortcut(_0x5385c9)) {
    _0x35e1d1["preventDefault"]();
    return;
  }
  if (_0x5385c9 === "pan-canvas") {
    _0x35e1d1['preventDefault']();
    !_0x35e1d1["repeat"] && setCanvasPanShortcutHeld(!![]);
    return;
  }
  if (_0x5385c9 === "align-feature") {
    const _0x22099a = String(_0x1d0732['ui']?.["alignFeatureTriggerMode"] || "click");
    const _0x233caa = _0x22099a === "hold" || _0x22099a === "click" || _0x22099a === 'off' ? _0x22099a : 'click';
    if (_0x233caa === "off" || _0x317b0b["alignFeatureEnabled"] === ![]) {
      return;
    }
    _0x35e1d1["preventDefault"]();
    if (_0x233caa === 'click') {
      dispatchShortcutAction('align-feature-toggle');
      return;
    }
    if (_0x35e1d1['repeat']) {
      return;
    }
    _clearAlignHoldState();
    _alignHoldKey = (_0x35e1d1['code'] || '') + '|' + (_0x35e1d1["key"] || '');
    _alignHoldTimer = setTimeout(() => {
      _alignHoldTimer = null;
      _alignHoldActive = !![];
      dispatchShortcutAction("align-feature-hold-start");
    }, ALIGN_HOLD_TRIGGER_MS);
    return;
  }
  if (isInteractionModifierShortcut(_0x5385c9)) {
    return;
  }
  if (_0x5385c9) {
    _0x35e1d1["preventDefault"]();
    window['dispatchEvent'](new CustomEvent("shortcut-action", {
      'detail': _0x5385c9
    }));
    return;
  }
  if (!_0x317b0b['featureModeActive']) {
    const _0x28b6af = resolveCommentNoteJumpActionId(_0x1d0732, _0x35e1d1);
    if (_0x28b6af) {
      _0x35e1d1["preventDefault"]();
      dispatchShortcutAction(_0x28b6af);
      return;
    }
  }
  const _0x178d97 = _0x35e1d1["key"] === "Delete" || _0x35e1d1['key'] === "Del" || _0x35e1d1['key'] === "Backspace" || _0x35e1d1['code'] === "Delete" || _0x35e1d1["code"] === "Backspace";
  !_0x317b0b["featureModeActive"] && _0x178d97 && (_0x35e1d1["preventDefault"](), _0x35e1d1["stopPropagation"](), _0x35e1d1['stopImmediatePropagation']());
}
function handleKeyUp(_0x58c572) {
  if (_alignHoldKey) {
    const _0x9557aa = (_0x58c572['code'] || '') + '|' + (_0x58c572['key'] || '');
    const _0x576bc6 = _0x9557aa === _alignHoldKey || _0x58c572["code"] === "Tab" || String(_0x58c572['key'] || '')["toLowerCase"]() === 'tab';
    if (_0x576bc6) {
      const _0x441f63 = _alignHoldActive;
      _clearAlignHoldState();
      _0x441f63 && dispatchShortcutAction('align-feature-hold-end');
    }
  }
  shouldReleasePanShortcut(_0x58c572) && releaseCanvasPanShortcut();
  if (_0x58c572['key'] === "Control") {
    const _0x310106 = document['getElementById']("pick-connect-overlay");
    _0x310106 && _0x310106["style"]["display"] !== 'none' && (_0x310106['style']['cursor'] = '');
  }
}
export function isSpaceHeld() {
  return isCanvasPanShortcutHeld();
}
function handleWindowBlur() {
  _clearAlignHoldState();
  releaseCanvasPanShortcut();
}
export function addShortcutListener(_0x5a855d) {
  _listeners["push"](_0x5a855d);
  const _0x27edb6 = _0x5d106e => _0x5a855d(_0x5d106e["detail"]);
  window["addEventListener"]('shortcut-action', _0x27edb6);
  return () => {
    const _0xc1aa1a = _listeners["indexOf"](_0x5a855d);
    _0xc1aa1a > -0x1 && _listeners["splice"](_0xc1aa1a, 0x1);
    window["removeEventListener"]("shortcut-action", _0x27edb6);
  };
}
export function initKeyboardService() {
  window["addEventListener"]('keydown', handleKeyDown, !![]);
  window["addEventListener"]("keyup", handleKeyUp, !![]);
  window["addEventListener"]('blur', handleWindowBlur);
  _settingsShortcutRoot = document['querySelector']?.('#settingsOverlay\x20.settings-modal');
  _settingsShortcutRoot?.["addEventListener"]('keydown', handleSettingsKeyDown);
  releaseCanvasPanShortcut();
}
export function destroyKeyboardService() {
  window['removeEventListener']("keydown", handleKeyDown, !![]);
  window["removeEventListener"]("keyup", handleKeyUp, !![]);
  window["removeEventListener"]("blur", handleWindowBlur);
  _settingsShortcutRoot?.['removeEventListener']("keydown", handleSettingsKeyDown);
  _settingsShortcutRoot = null;
  _clearAlignHoldState();
  releaseCanvasPanShortcut();
}