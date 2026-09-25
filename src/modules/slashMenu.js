import { getPromptPresetCollectionLabel, getPromptPresetThumbSrc, getSlashPromptPresetEntries, isPromptPresetNodeTypeSupported, openCustomPresetsManager, shouldInsertPromptForPreset } from './promptPresets.js';
import a1367_0x2c50a3 from '../core/stores/appStore.js';
import { t } from '../i18n/index.js';
import { createSafeSvg, sanitizePromptHtml } from '../utils/dom.js';
import { deferPromptTriggerUntilCompositionEnd, shouldSkipPromptTriggerForBulkInput } from './promptTriggerComposition.js';
function slashMenuText(_0x4a713f, _0xa1ca26 = {}) {
  return t("promptPresets.slash." + _0x4a713f, _0xa1ca26);
}
let _slashMenuEl = null;
export function getSlashMenu() {
  !_slashMenuEl && (_slashMenuEl = document['getElementById']("v2-slash-menu"), !_slashMenuEl && (_slashMenuEl = document['createElement']("div"), _slashMenuEl['id'] = "v2-slash-menu", _slashMenuEl["className"] = "preset-slash-menu", document['body']["appendChild"](_slashMenuEl)));
  return _slashMenuEl;
}
let _subMenuState = {
  'activeSubmenu': null,
  'parentItem': null,
  'subItems': [],
  'subIndex': -0x1,
  'stack': []
};
let _slashViewportUnsubscribe = null;
let _slashOutsideDocClick = null;
let _slashOutsideDocClickTimer = 0x0;
let _slashPositionState = null;
let _slashCoverPreviewEl = null;
let _slashNestedItemSequence = 0x0;
const _slashCoverPreloadCache = new Map();
const _slashSubmenuHideTimers = new Map();
function resetSubMenuState() {
  _subMenuState = {
    'activeSubmenu': null,
    'parentItem': null,
    'subItems': [],
    'subIndex': -0x1,
    'stack': []
  };
}
function _appendPresetIcon(_0x5e4469, _0xfaa495) {
  if (!_0x5e4469 || !_0xfaa495) {
    return;
  }
  const _0x188155 = String(_0xfaa495)["trim"]();
  if (_0x188155["startsWith"]("<svg")) {
    const _0x53c3a2 = createSafeSvg(_0x188155);
    if (_0x53c3a2) {
      _0x5e4469['appendChild'](_0x53c3a2);
      _0x5e4469["appendChild"](document["createTextNode"]('\x20'));
      return;
    }
  }
  _0x5e4469['appendChild'](document["createTextNode"](String(_0xfaa495) + '\x20'));
}
function _getSlashPresetTriggerModeLabel(_0x11264c = {}) {
  return shouldInsertPromptForPreset(_0x11264c) ? t('promptPresets.triggerModes.insertPrompt') : t("promptPresets.triggerModes.direct");
}
function _isSelectableSlashPreset(_0x285a91 = {}) {
  return _0x285a91 && Object['prototype']["hasOwnProperty"]['call'](_0x285a91, 'template');
}
function _appendSlashPresetTriggerBadge(_0xf2edaf, _0x393451 = {}) {
  if (!_0xf2edaf) {
    return;
  }
  const _0x5a8563 = document["createElement"]("span");
  _0x5a8563["className"] = "preset-slash-trigger-badge";
  _0x5a8563["textContent"] = _getSlashPresetTriggerModeLabel(_0x393451);
  _0xf2edaf["appendChild"](_0x5a8563);
}
function _getSlashCoverPreview() {
  if (_slashCoverPreviewEl?.["isConnected"]) {
    return _slashCoverPreviewEl;
  }
  const _0x1bfec2 = document["createElement"]("div");
  _0x1bfec2['className'] = "preset-slash-cover-preview";
  const _0x22e09d = document["createElement"]("img");
  _0x22e09d["className"] = "preset-slash-cover-preview-img";
  _0x22e09d['alt'] = '';
  _0x1bfec2['appendChild'](_0x22e09d);
  document["body"]["appendChild"](_0x1bfec2);
  _slashCoverPreviewEl = _0x1bfec2;
  return _0x1bfec2;
}
function _hideSlashCoverPreview() {
  const _0xf019e = _slashCoverPreviewEl;
  if (!_0xf019e) {
    return;
  }
  _0xf019e["classList"]["remove"]("is-visible");
}
function _removeSlashCoverPreview() {
  _slashCoverPreviewEl?.["remove"]?.();
  _slashCoverPreviewEl = null;
}
function _preloadSlashCoverPreviewSrc(_0x3ae12e) {
  const _0x5b68c0 = String(_0x3ae12e || '')['trim']();
  if (!_0x5b68c0 || _slashCoverPreloadCache["has"](_0x5b68c0)) {
    return;
  }
  if (typeof Image !== "function") {
    return;
  }
  let _0x1a6510 = null;
  try {
    _0x1a6510 = new Image();
    _0x1a6510["decoding"] = "async";
    _0x1a6510["loading"] = 'eager';
    _slashCoverPreloadCache["set"](_0x5b68c0, _0x1a6510);
    _0x1a6510["src"] = _0x5b68c0;
    if (typeof _0x1a6510['decode'] === "function") {
      const _0x1b3fb5 = _0x1a6510["decode"]();
      void _0x1b3fb5?.["catch"]?.(() => {});
    }
  } catch {
    _slashCoverPreloadCache['delete'](_0x5b68c0);
  }
}
function _positionSlashCoverPreview(_0x4f3754, _0x382b44) {
  if (!_0x4f3754 || !_0x382b44 || typeof _0x4f3754["getBoundingClientRect"] !== "function") {
    return;
  }
  const _0x1ab226 = _0x4f3754['getBoundingClientRect']();
  const _0x14d669 = window['innerWidth'] || document["documentElement"]?.["clientWidth"] || 0x0;
  const _0x325cce = window["innerHeight"] || document["documentElement"]?.["clientHeight"] || 0x0;
  const _0x20b169 = _0x382b44["offsetWidth"] || _0x382b44['getBoundingClientRect']?.()["width"] || 0xdc;
  const _0x1f0d7e = _0x382b44['offsetHeight'] || _0x382b44["getBoundingClientRect"]?.()["height"] || 0xdc;
  const _0x507bb3 = 0xc;
  let _0x3e73e6 = _0x1ab226['right'] + _0x507bb3;
  _0x14d669 > 0x0 && _0x3e73e6 + _0x20b169 + 0x8 > _0x14d669 && (_0x3e73e6 = _0x1ab226["left"] - _0x20b169 - _0x507bb3);
  let _0x18ae66 = _0x1ab226["top"];
  _0x325cce > 0x0 && _0x1f0d7e > 0x0 && (_0x18ae66 = Math["min"](_0x18ae66, _0x325cce - _0x1f0d7e - 0x8), _0x18ae66 = Math["max"](0x8, _0x18ae66));
  _0x382b44["style"]['left'] = Math['max'](0x8, _0x3e73e6) + 'px';
  _0x382b44["style"]["top"] = _0x18ae66 + 'px';
}
function _showSlashCoverPreviewForItem(_0x483a9f, _0x48c051) {
  const _0x2aadcd = String(_0x48c051?.["dataset"]?.["coverSrc"] || '')["trim"]();
  if (!_0x2aadcd) {
    _hideSlashCoverPreview();
    return;
  }
  _preloadSlashCoverPreviewSrc(_0x2aadcd);
  const _0x5bcdb8 = _getSlashCoverPreview();
  const _0x486c65 = _0x5bcdb8?.['querySelector']?.(".preset-slash-cover-preview-img");
  if (!_0x5bcdb8 || !_0x486c65) {
    return;
  }
  if (_0x486c65["src"] !== _0x2aadcd) {
    _0x486c65["src"] = _0x2aadcd;
  }
  _positionSlashCoverPreview(_0x48c051, _0x5bcdb8);
  _0x5bcdb8["classList"]['add']("is-visible");
}
function _getSlashSubmenuPresetItems(_0x5b3f63) {
  const _0x1ec499 = Array["from"](_0x5b3f63?.["children"] || [])["find"](_0xd4e36c => _0xd4e36c["classList"]?.["contains"]("preset-slash-submenu-list"));
  return Array["from"](_0x1ec499?.["children"] || [])["filter"](_0x251172 => _0x251172["classList"]?.["contains"]('preset-slash-item'));
}
function _getSlashRootPresetItems() {
  const _0x19a5e2 = _slashPositionState?.["menu"] || _slashMenuEl;
  return Array["from"](_0x19a5e2?.["children"] || [])['filter'](_0x35bcf4 => _0x35bcf4["classList"]?.['contains']("preset-slash-item"));
}
function _getAllSlashSubmenus() {
  return Array["from"](document["querySelectorAll"]?.(".preset-slash-submenu") || []);
}
function _findSlashItemById(_0x39f893) {
  const _0x81f455 = String(_0x39f893 || '');
  if (!_0x81f455) {
    return null;
  }
  const _0xa0e0bf = [..._getSlashRootPresetItems(), ..._getAllSlashSubmenus()["flatMap"](_getSlashSubmenuPresetItems)];
  return _0xa0e0bf["find"](_0x53528d => _0x53528d["dataset"]?.['itemId'] === _0x81f455) || null;
}
function _getSlashChildSubmenu(_0x35aafa) {
  const _0x3d51e4 = String(_0x35aafa?.["dataset"]?.['itemId'] || '');
  if (!_0x3d51e4) {
    return null;
  }
  return _getAllSlashSubmenus()['find'](_0xc1d017 => _0xc1d017["dataset"]?.["parentItem"] === _0x3d51e4) || null;
}
function _getContainingSlashSubmenu(_0x235994) {
  let _0x28e051 = _0x235994?.["parentElement"] || _0x235994?.["parentNode"] || null;
  while (_0x28e051) {
    if (_0x28e051["classList"]?.['contains']('preset-slash-submenu')) {
      return _0x28e051;
    }
    _0x28e051 = _0x28e051["parentElement"] || _0x28e051["parentNode"] || null;
  }
  return null;
}
function _getSlashParentSubmenu(_0x4701ac) {
  const _0x3063e9 = _findSlashItemById(_0x4701ac?.["dataset"]?.["parentItem"]);
  return _getContainingSlashSubmenu(_0x3063e9);
}
function _clearSlashSubmenuHideTimer(_0x2e82ee) {
  const _0x4ab9fd = _slashSubmenuHideTimers['get'](_0x2e82ee);
  if (_0x4ab9fd) {
    clearTimeout(_0x4ab9fd);
  }
  _slashSubmenuHideTimers["delete"](_0x2e82ee);
}
function _clearAllSlashSubmenuHideTimers() {
  _slashSubmenuHideTimers['forEach'](_0x5dbb3d => clearTimeout(_0x5dbb3d));
  _slashSubmenuHideTimers["clear"]();
}
function _closeSlashSubmenuBranch(_0x3433d1) {
  if (!_0x3433d1) {
    return;
  }
  _getSlashSubmenuPresetItems(_0x3433d1)["forEach"](_0x47421a => {
    _closeSlashSubmenuBranch(_getSlashChildSubmenu(_0x47421a));
    _0x47421a["classList"]?.["remove"]("active");
  });
  _clearSlashSubmenuHideTimer(_0x3433d1);
  _0x3433d1["classList"]?.['remove']("open");
  _hideSlashCoverPreview();
}
function _scheduleSlashSubmenuClose(_0x478deb) {
  if (!_0x478deb) {
    return;
  }
  _clearSlashSubmenuHideTimer(_0x478deb);
  _slashSubmenuHideTimers['set'](_0x478deb, setTimeout(() => {
    _slashSubmenuHideTimers["delete"](_0x478deb);
    _closeSlashSubmenuBranch(_0x478deb);
  }, 0x64));
}
function _clearSlashSubmenuPathTimers(_0x151f02) {
  let _0x1c545 = _0x151f02;
  while (_0x1c545) {
    _clearSlashSubmenuHideTimer(_0x1c545);
    _0x1c545 = _getSlashParentSubmenu(_0x1c545);
  }
}
function _scheduleSlashSubmenuPathClose(_0x441cac) {
  let _0x1c3f9d = _0x441cac;
  while (_0x1c3f9d) {
    _scheduleSlashSubmenuClose(_0x1c3f9d);
    _0x1c3f9d = _getSlashParentSubmenu(_0x1c3f9d);
  }
}
function _getSlashSiblingItems(_0x4a470d) {
  const _0x10c13b = _getContainingSlashSubmenu(_0x4a470d);
  return _0x10c13b ? _getSlashSubmenuPresetItems(_0x10c13b) : _getSlashRootPresetItems();
}
function _activateSlashItem(_0x464e07, _0x624151 = null) {
  _getSlashSiblingItems(_0x464e07)['forEach'](_0x3c9a23 => {
    _0x3c9a23["classList"]?.["toggle"]("active", _0x3c9a23 === _0x464e07);
    const _0x3ef95e = _getSlashChildSubmenu(_0x3c9a23);
    _0x3ef95e && _0x3ef95e !== _0x624151 && _closeSlashSubmenuBranch(_0x3ef95e);
  });
}
function _openSlashSubmenu(_0xc3cb3c, _0x41a3a8) {
  if (!_0xc3cb3c || !_0x41a3a8) {
    return;
  }
  _activateSlashItem(_0xc3cb3c, _0x41a3a8);
  _clearSlashSubmenuPathTimers(_0x41a3a8);
  _0x41a3a8["classList"]["add"]('open');
  _positionSlashSubmenu(_0xc3cb3c, _0x41a3a8);
}
function _bindSlashSubmenuHover(_0x2d931b) {
  _0x2d931b['addEventListener']("mouseenter", () => {
    _clearSlashSubmenuPathTimers(_0x2d931b);
  });
  _0x2d931b["addEventListener"]("mouseleave", () => {
    _hideSlashCoverPreview();
    _scheduleSlashSubmenuPathClose(_0x2d931b);
  });
}
function _createSlashSubmenuItem({
  submenu: _0x2314cf,
  sub: _0x158d16,
  promptEl: _0x4e3797,
  nodeId: _0x32d430,
  range: _0xb84cc2,
  selection: _0x3024c1,
  onGenerate: _0x15e466,
  onPromptCommit: _0x37601d
}) {
  const _0xd6d3ea = document["createElement"]("div");
  _0xd6d3ea['className'] = "preset-slash-item has-desc";
  _0xd6d3ea["dataset"]["itemId"] = "slash-item-nested-" + _slashNestedItemSequence++;
  const _0x15a2f0 = Array["isArray"](_0x158d16?.["subItems"]) && _0x158d16["subItems"]["length"] > 0x0;
  const _0x5bd65c = _0x15a2f0 ? '' : getPromptPresetThumbSrc(_0x158d16);
  _0x5bd65c && (_0xd6d3ea["classList"]["add"]('has-cover-preview'), _0xd6d3ea["dataset"]["coverSrc"] = _0x5bd65c, _preloadSlashCoverPreviewSrc(_0x5bd65c));
  !_0x15a2f0 && _isSelectableSlashPreset(_0x158d16) && _0xd6d3ea["classList"]['add']("has-trigger-badge");
  const _0x229b4d = document['createElement']("div");
  _0x229b4d["className"] = "preset-slash-title-wrap";
  const _0x2e9db0 = document["createElement"]('div');
  _0x2e9db0["className"] = "preset-slash-title";
  _0x158d16["icon"] && _appendPresetIcon(_0x2e9db0, _0x158d16["icon"]);
  _0x2e9db0["appendChild"](document['createTextNode'](_0x158d16['title'] || ''));
  if (_0x15a2f0) {
    const _0x125efd = document["createElement"]("span");
    _0x125efd["className"] = 'preset-slash-title-arrow';
    _0x125efd["textContent"] = '>';
    _0x2e9db0["appendChild"](_0x125efd);
  }
  const _0x4fc59a = document["createElement"]("div");
  _0x4fc59a['className'] = 'preset-slash-desc';
  _0x4fc59a['textContent'] = _0x158d16["desc"] || _0x158d16['template'] || '';
  _0x229b4d["appendChild"](_0x2e9db0);
  _0x229b4d['appendChild'](_0x4fc59a);
  _0xd6d3ea["appendChild"](_0x229b4d);
  !_0x15a2f0 && _isSelectableSlashPreset(_0x158d16) && _appendSlashPresetTriggerBadge(_0xd6d3ea, _0x158d16);
  if (_0x15a2f0) {
    const _0x282828 = _createSlashSubmenu({
      'parentItem': _0xd6d3ea,
      'items': _0x158d16["subItems"],
      'promptEl': _0x4e3797,
      'nodeId': _0x32d430,
      'range': _0xb84cc2,
      'selection': _0x3024c1,
      'onGenerate': _0x15e466,
      'onPromptCommit': _0x37601d
    });
    _0xd6d3ea["addEventListener"]("mouseenter", () => {
      _hideSlashCoverPreview();
      _openSlashSubmenu(_0xd6d3ea, _0x282828);
    });
    _0xd6d3ea["addEventListener"]("mouseleave", () => {
      _scheduleSlashSubmenuClose(_0x282828);
    });
    _0xd6d3ea['addEventListener']("mousedown", _0x2d0a2b => {
      _0x2d0a2b["preventDefault"]();
      _0x2d0a2b["stopPropagation"]();
    });
    return _0xd6d3ea;
  }
  _0xd6d3ea["addEventListener"]("mouseenter", () => {
    _activateSlashItem(_0xd6d3ea);
    _showSlashCoverPreviewForItem(_0x2314cf, _0xd6d3ea);
  });
  _0xd6d3ea['addEventListener']("mouseleave", () => {
    _hideSlashCoverPreview(_0x2314cf);
  });
  _0xd6d3ea["addEventListener"]("mousedown", _0x36c9ce => {
    _0x36c9ce["preventDefault"]();
    _0x36c9ce["stopPropagation"]();
    _selectPromptPreset({
      'promptEl': _0x4e3797,
      'nodeId': _0x32d430,
      'preset': _0x158d16,
      'range': _0xb84cc2,
      'selection': _0x3024c1,
      'onGenerate': _0x15e466,
      'onPromptCommit': _0x37601d
    });
  });
  return _0xd6d3ea;
}
function _createSlashSubmenu({
  parentItem: _0x4b9134,
  items: _0x5abcc1,
  promptEl: _0x1c24ea,
  nodeId: _0x230d5a,
  range: _0x5de353,
  selection: _0x314443,
  onGenerate: _0x3937d1,
  onPromptCommit: _0x6f9f5f
}) {
  const _0x22250 = document['createElement']("div");
  _0x22250["className"] = "preset-slash-submenu";
  _0x22250["dataset"]["parentItem"] = _0x4b9134['dataset']["itemId"];
  const _0x33a20e = document["createElement"]("div");
  _0x33a20e["className"] = 'preset-slash-submenu-list';
  _0x22250["appendChild"](_0x33a20e);
  _0x33a20e["addEventListener"]('scroll', _syncOpenSlashSubmenus, {
    'passive': !![]
  });
  document["body"]['appendChild'](_0x22250);
  (Array['isArray'](_0x5abcc1) ? _0x5abcc1 : [])["forEach"](_0x12bb8d => {
    _0x33a20e["appendChild"](_createSlashSubmenuItem({
      'submenu': _0x22250,
      'sub': _0x12bb8d,
      'promptEl': _0x1c24ea,
      'nodeId': _0x230d5a,
      'range': _0x5de353,
      'selection': _0x314443,
      'onGenerate': _0x3937d1,
      'onPromptCommit': _0x6f9f5f
    }));
  });
  _bindSlashSubmenuHover(_0x22250);
  return _0x22250;
}
function _isSlashNodeConnected(_0x564260) {
  if (!_0x564260) {
    return ![];
  }
  if (_0x564260["isConnected"] === !![]) {
    return !![];
  }
  if (typeof document === "undefined") {
    return !![];
  }
  return typeof document['body']?.["contains"] === "function" ? document["body"]['contains'](_0x564260) : !![];
}
function _clearSlashOutsideDocClick() {
  _slashOutsideDocClickTimer && (clearTimeout(_slashOutsideDocClickTimer), _slashOutsideDocClickTimer = 0x0);
  _slashOutsideDocClick && typeof document !== "undefined" && document["removeEventListener"]?.("mousedown", _slashOutsideDocClick);
  _slashOutsideDocClick = null;
}
function _cleanupSlashMenuLifecycle() {
  const _0x486302 = _slashPositionState?.["onOpenChange"];
  _clearSlashOutsideDocClick();
  _slashViewportUnsubscribe && (_slashViewportUnsubscribe(), _slashViewportUnsubscribe = null);
  _slashPositionState = null;
  _0x486302?.(![]);
}
function _getSlashAnchorRect(_0xb82107) {
  if (!_0xb82107 || typeof _0xb82107['getBoundingClientRect'] !== "function" || !_isSlashNodeConnected(_0xb82107)) {
    return null;
  }
  return _0xb82107['getBoundingClientRect']();
}
function _positionSlashSubmenu(_0x562dac, _0x24ec70) {
  if (!_0x562dac || !_0x24ec70 || typeof _0x562dac["getBoundingClientRect"] !== 'function') {
    return;
  }
  const _0x4549b1 = _0x562dac["getBoundingClientRect"]();
  const _0x13ca09 = window['innerWidth'] || document["documentElement"]?.['clientWidth'] || 0x0;
  const _0xd4d24a = _0x24ec70['offsetWidth'] || _0x24ec70['getBoundingClientRect']?.()["width"] || 0x118;
  let _0x479ac5 = _0x4549b1['right'] + 0x6;
  _0x13ca09 > 0x0 && _0x479ac5 + _0xd4d24a + 0x8 > _0x13ca09 && (_0x479ac5 = _0x4549b1['left'] - _0xd4d24a - 0x6);
  _0x24ec70["style"]['left'] = Math["max"](0x8, _0x479ac5) + 'px';
  const _0x2ccedc = window["innerHeight"] || document["documentElement"]?.["clientHeight"] || 0x0;
  const _0x3b2a76 = _0x24ec70["offsetHeight"] || _0x24ec70["getBoundingClientRect"]?.()["height"] || 0x0;
  let _0x3eed60 = _0x4549b1["top"];
  _0x2ccedc > 0x0 && _0x3b2a76 > 0x0 && (_0x3eed60 = Math["min"](_0x3eed60, _0x2ccedc - _0x3b2a76 - 0x8), _0x3eed60 = Math["max"](0x8, _0x3eed60));
  _0x24ec70["style"]['top'] = _0x3eed60 + 'px';
  const _0x44a267 = _0x24ec70["querySelector"]?.('.preset-slash-item.active.has-cover-preview');
  _0x44a267 && _showSlashCoverPreviewForItem(_0x24ec70, _0x44a267);
}
function _syncOpenSlashSubmenus() {
  if (!(_slashPositionState?.["menu"] || _slashMenuEl)) {
    return;
  }
  document["querySelectorAll"]?.(".preset-slash-submenu")['forEach'](_0x3d2d3f => {
    if (!_0x3d2d3f["classList"]?.["contains"]("open")) {
      return;
    }
    const _0x28aab2 = _0x3d2d3f["dataset"]?.["parentItem"] || '';
    if (!_0x28aab2) {
      return;
    }
    const _0xa3f520 = _findSlashItemById(_0x28aab2);
    _positionSlashSubmenu(_0xa3f520, _0x3d2d3f);
  });
}
function _positionSlashMenu() {
  const _0x2ef23e = _slashPositionState;
  const _0x2de6a7 = _0x2ef23e?.["menu"];
  if (!_0x2ef23e || !_0x2de6a7 || !_0x2de6a7["classList"]?.["contains"]("open")) {
    return;
  }
  const _0x20e3ad = _getSlashAnchorRect(_0x2ef23e["anchorEl"]);
  if (!_0x20e3ad) {
    closeSlashMenu();
    return;
  }
  const _0x49e460 = _0x2de6a7["scrollTop"];
  _0x2de6a7["style"]["maxHeight"] = '';
  const _0x5a3bfb = _0x2de6a7['offsetHeight'] || _0x2ef23e['menuHeight'] || 0x118;
  _0x2ef23e['menuHeight'] = _0x5a3bfb;
  _0x2de6a7['style']["visibility"] = "visible";
  const _0xfc5af7 = window["innerWidth"] || document["documentElement"]?.["clientWidth"] || 0x0;
  const _0x4d9319 = window["innerHeight"] || document['documentElement']?.["clientHeight"] || 0x0;
  if (_0x2ef23e["placement"] === 'expanded-panel') {
    const _0x590271 = _getSlashAnchorRect(_0x2ef23e["containerEl"]);
    if (!_0x590271) {
      closeSlashMenu();
      return;
    }
    const _0x39190d = _0xfc5af7 <= 0x320 || _0x590271['width'] < 0x2f8;
    _0x2de6a7["classList"]["toggle"]("is-bottom-sheet", _0x39190d);
    _0x2de6a7["style"]["width"] = _0x39190d ? Math['max'](0x0, _0x590271['width'] - 0x18) + 'px' : '';
    const _0x4e959f = _0x2de6a7["offsetWidth"] || Math["min"](0x154, _0x590271['width'] - 0x18);
    const _0x2a71f3 = _0x39190d ? _0x590271["left"] + 0xc : _0x590271["right"] - _0x4e959f - 0x10;
    const _0x4e3e85 = _0x39190d ? _0x590271["top"] + Math['max'](0x40, _0x590271["height"] * 0.48) : _0x590271['top'] + 0x34;
    const _0x18dd4a = _0x590271['bottom'] - (_0x39190d ? 0x44 : 0x4c);
    const _0x2c30fc = Math["max"](0x50, _0x18dd4a - _0x4e3e85);
    _0x2de6a7["style"]["left"] = Math["max"](0x8, _0x2a71f3) + 'px';
    _0x2de6a7["style"]["top"] = Math["max"](0x8, _0x4e3e85) + 'px';
    _0x2de6a7["style"]["height"] = _0x2c30fc + 'px';
    _0x2de6a7["style"]['maxHeight'] = _0x2c30fc + 'px';
    _0x2de6a7["style"]["transformOrigin"] = _0x39190d ? 'bottom\x20center' : "top right";
    _0x2de6a7["scrollTop"] = _0x49e460;
    _syncOpenSlashSubmenus();
    return;
  }
  _0x2de6a7["classList"]["remove"]('is-bottom-sheet');
  _0x2de6a7['style']['width'] = '';
  _0x2de6a7["style"]["height"] = '';
  const _0x377570 = _0x2de6a7["offsetWidth"] || 0x118;
  const _0x253d79 = _0x2ef23e['placement'] === "above-end";
  const _0x277944 = _0x253d79 ? _0x20e3ad["right"] - _0x377570 : _0x20e3ad["left"];
  const _0x3810d2 = _0xfc5af7 > 0x0 ? _0xfc5af7 - _0x377570 - 0x8 : _0x277944;
  const _0x17f85b = Math["max"](0x0, _0x20e3ad["top"] - 0x10);
  const _0x3e3245 = Math["max"](0x0, _0x4d9319 - _0x20e3ad["bottom"] - 0x10);
  const _0x2ff119 = _0x5a3bfb <= _0x17f85b || _0x5a3bfb > _0x3e3245 && _0x17f85b >= _0x3e3245;
  _0x2de6a7['style']["maxHeight"] = (_0x2ff119 ? _0x17f85b : _0x3e3245) + 'px';
  _0x2de6a7["scrollTop"] = _0x49e460;
  const _0x2ca4e7 = Math['min'](_0x2de6a7["offsetHeight"] || _0x5a3bfb, _0x2ff119 ? _0x17f85b : _0x3e3245);
  _0x2de6a7["style"]["left"] = Math["max"](0x8, Math["min"](_0x277944, _0x3810d2)) + 'px';
  _0x2de6a7['style']["top"] = (_0x2ff119 ? Math["max"](0x8, _0x20e3ad['top'] - _0x2ca4e7 - 0x8) : _0x20e3ad["bottom"] + 0x8) + 'px';
  _0x2de6a7["style"]["transformOrigin"] = (_0x2ff119 ? "bottom" : "top") + '\x20' + (_0x253d79 ? "right" : "left");
  _syncOpenSlashSubmenus();
}
function _watchSlashViewport() {
  if (_slashViewportUnsubscribe) {
    _slashViewportUnsubscribe();
  }
  const _0x2d6fd0 = a1367_0x2c50a3["subscribeSelector"]?.(_0x21ff92 => _0x21ff92["viewport"], () => _positionSlashMenu());
  const _0x555516 = _slashPositionState?.["menu"];
  _0x555516?.["addEventListener"]?.("scroll", _syncOpenSlashSubmenus, {
    'passive': !![]
  });
  globalThis["window"]?.["addEventListener"]?.('resize', _positionSlashMenu);
  _slashViewportUnsubscribe = () => {
    _0x2d6fd0?.();
    _0x555516?.["removeEventListener"]?.('scroll', _syncOpenSlashSubmenus);
    globalThis["window"]?.["removeEventListener"]?.("resize", _positionSlashMenu);
  };
}
function _bindSlashOutsideDocClick(_0x2d4b1d) {
  _clearSlashOutsideDocClick();
  _slashOutsideDocClick = _0x341451 => {
    const _0x46a8e3 = Array['from'](document["querySelectorAll"]?.(".preset-slash-submenu") || [])["some"](_0x1ec5c3 => _0x1ec5c3["contains"]?.(_0x341451["target"]));
    !_0x2d4b1d['contains'](_0x341451["target"]) && !_0x46a8e3 && closeSlashMenu();
  };
  _slashOutsideDocClickTimer = setTimeout(() => {
    _slashOutsideDocClickTimer = 0x0;
    _slashOutsideDocClick && document["addEventListener"]?.('mousedown', _slashOutsideDocClick);
  }, 0xa);
}
export function closeSlashMenu() {
  _cleanupSlashMenuLifecycle();
  _clearAllSlashSubmenuHideTimers();
  if (typeof document === 'undefined') {
    resetSubMenuState();
    return;
  }
  const _0x3b102a = getSlashMenu();
  _0x3b102a["classList"]["remove"]("open");
  document["querySelectorAll"]('.preset-slash-submenu')["forEach"](_0x36378f => _0x36378f["remove"]());
  _removeSlashCoverPreview();
  _slashCoverPreloadCache["clear"]();
  _0x3b102a['replaceChildren']();
  resetSubMenuState();
}
function _removeSlashTriggerText(_0x4e762c, _0x5ea4df) {
  const _0x591902 = _0x4e762c?.["startContainer"];
  if (!_0x591902 || _0x591902["nodeType"] !== Node["TEXT_NODE"]) {
    return;
  }
  const _0x235720 = _0x591902["textContent"];
  const _0x2327bc = _0x4e762c["startOffset"];
  const _0xd886d6 = Math["max"](_0x235720["lastIndexOf"]('/', _0x2327bc - 0x1), _0x235720["lastIndexOf"]('／', _0x2327bc - 0x1));
  if (_0xd886d6 === -0x1) {
    return;
  }
  _0x591902['textContent'] = _0x235720["substring"](0x0, _0xd886d6) + _0x235720['substring'](_0x2327bc);
  _0x4e762c["setStart"](_0x591902, _0xd886d6);
  _0x4e762c["setEnd"](_0x591902, _0xd886d6);
  _0x5ea4df["removeAllRanges"]();
  _0x5ea4df["addRange"](_0x4e762c);
}
function _selectPromptPreset({
  promptEl: _0x569d0b,
  nodeId: _0x2d8946,
  preset: _0x5e3d3a,
  range: _0x47d7a5,
  selection: _0x2f3a2e,
  onGenerate: _0x2b8626,
  onPromptCommit: _0x4c282f
}) {
  closeSlashMenu();
  _removeSlashTriggerText(_0x47d7a5, _0x2f3a2e);
  _0x569d0b['querySelectorAll'](".preset-pill")["forEach"](_0x4d2b2e => _0x4d2b2e["remove"]());
  const _0xf02dbd = sanitizePromptHtml(_0x569d0b["innerHTML"]);
  typeof _0x4c282f === "function" ? _0x4c282f(_0xf02dbd) : a1367_0x2c50a3["updateNodeData"](_0x2d8946, {
    'prompt': _0xf02dbd
  });
  setTimeout(() => {
    _0x2b8626?.(_0x5e3d3a?.['template'], {
      'insertPrompt': shouldInsertPromptForPreset(_0x5e3d3a)
    });
  }, 0x32);
}
export function checkSlashTrigger(_0x299108, {
  promptEl: _0x87fbb2,
  nodeType: _0x5ac8e5,
  nodeId: _0x301904,
  onGenerate: _0x3b1af1,
  explicit = ![],
  anchorEl = null,
  containerEl = null,
  placement = "auto-start",
  onOpenChange: _0x59aa4e,
  onPromptCommit: _0x417576
}) {
  const _0x26d94c = {
    'promptEl': _0x87fbb2,
    'nodeType': _0x5ac8e5,
    'nodeId': _0x301904,
    'onGenerate': _0x3b1af1,
    'explicit': explicit,
    'anchorEl': anchorEl,
    'containerEl': containerEl,
    'placement': placement,
    'onOpenChange': _0x59aa4e,
    'onPromptCommit': _0x417576
  };
  if (deferPromptTriggerUntilCompositionEnd({
    'event': _0x299108,
    'promptEl': _0x87fbb2,
    'triggerKey': "slash",
    'onCompositionEnd': () => checkSlashTrigger({}, _0x26d94c)
  })) {
    return;
  }
  if (shouldSkipPromptTriggerForBulkInput(_0x299108)) {
    closeSlashMenu();
    return;
  }
  let _0x519a3e = null;
  let _0x512833 = null;
  if (!explicit) {
    _0x519a3e = window["getSelection"]();
    if (!_0x519a3e["rangeCount"]) {
      return;
    }
    _0x512833 = _0x519a3e["getRangeAt"](0x0);
    if (_0x512833["startContainer"]["nodeType"] !== Node["TEXT_NODE"]) {
      closeSlashMenu();
      return;
    }
    const _0x101545 = _0x512833['startContainer']["textContent"]["slice"](0x0, _0x512833["startOffset"]);
    const _0x4d8097 = Math['max'](_0x101545["lastIndexOf"]('/'), _0x101545["lastIndexOf"]('／'));
    if (_0x4d8097 === -0x1 || _0x4d8097 !== _0x101545["length"] - 0x1) {
      closeSlashMenu();
      return;
    }
  }
  const _0x506257 = getSlashPromptPresetEntries(_0x5ac8e5);
  const _0x17e014 = getSlashMenu();
  _cleanupSlashMenuLifecycle();
  _clearAllSlashSubmenuHideTimers();
  _slashNestedItemSequence = 0x0;
  document["querySelectorAll"](".preset-slash-submenu")["forEach"](_0x5c4f17 => _0x5c4f17["remove"]());
  _0x17e014["replaceChildren"]();
  if (_0x506257['length'] > 0x0) {
    const _0xd6e5fa = document["createElement"]("div");
    _0xd6e5fa['className'] = "preset-slash-header";
    _0xd6e5fa['textContent'] = placement === "expanded-panel" ? getPromptPresetCollectionLabel(_0x5ac8e5) : slashMenuText("header");
    _0x17e014["appendChild"](_0xd6e5fa);
  }
  _0x506257["forEach"]((_0x30fc17, _0x32c882) => {
    const _0x1f8757 = document["createElement"]("div");
    _0x1f8757['className'] = "preset-slash-item has-desc" + (_0x32c882 === 0x0 ? " active" : '');
    const _0x20bc0f = "slash-item-" + _0x32c882;
    _0x1f8757['dataset']["itemId"] = _0x20bc0f;
    const _0x2eca54 = document["createElement"]("div");
    _0x2eca54["className"] = "preset-slash-title-wrap";
    const _0x523aa4 = document["createElement"]("div");
    _0x523aa4["className"] = 'preset-slash-title';
    _0x30fc17["icon"] && _appendPresetIcon(_0x523aa4, _0x30fc17["icon"]);
    _0x523aa4['appendChild'](document["createTextNode"](_0x30fc17["title"] || ''));
    if (_0x30fc17['subItems']) {
      const _0xd6d051 = document["createElement"]('span');
      _0xd6d051["className"] = "preset-slash-title-arrow";
      _0xd6d051["textContent"] = '>';
      _0x523aa4["appendChild"](_0xd6d051);
    }
    const _0x29a5bf = document['createElement']("div");
    _0x29a5bf["className"] = "preset-slash-desc";
    _0x29a5bf["textContent"] = _0x30fc17["desc"] || _0x30fc17['template'] || slashMenuText('subItemsDesc');
    _0x2eca54["appendChild"](_0x523aa4);
    _0x2eca54["appendChild"](_0x29a5bf);
    _0x1f8757["appendChild"](_0x2eca54);
    if (_0x30fc17["subItems"] && _0x30fc17["subItems"]["length"] > 0x0) {
      _0x1f8757["style"]["overflow"] = "visible";
      const _0x5984ef = _createSlashSubmenu({
        'parentItem': _0x1f8757,
        'items': _0x30fc17['subItems'],
        'promptEl': _0x87fbb2,
        'nodeId': _0x301904,
        'range': _0x512833,
        'selection': _0x519a3e,
        'onGenerate': _0x3b1af1,
        'onPromptCommit': _0x417576
      });
      _0x1f8757['addEventListener']("mouseenter", () => {
        _hideSlashCoverPreview();
        _openSlashSubmenu(_0x1f8757, _0x5984ef);
      });
      _0x1f8757["addEventListener"]("mouseleave", () => {
        _scheduleSlashSubmenuClose(_0x5984ef);
      });
      _0x1f8757["addEventListener"]("mousedown", _0x460c90 => {
        _0x460c90["preventDefault"]();
        _0x460c90["stopPropagation"]();
      });
    } else {
      _isSelectableSlashPreset(_0x30fc17) && (_0x1f8757["classList"]["add"]("has-trigger-badge"), _appendSlashPresetTriggerBadge(_0x1f8757, _0x30fc17));
      _0x1f8757["addEventListener"]('mouseenter', () => {
        _activateSlashItem(_0x1f8757);
      });
      _0x1f8757['addEventListener']("mousedown", _0xb9c069 => {
        _0xb9c069['preventDefault']();
        _selectPromptPreset({
          'promptEl': _0x87fbb2,
          'nodeId': _0x301904,
          'preset': _0x30fc17,
          'range': _0x512833,
          'selection': _0x519a3e,
          'onGenerate': _0x3b1af1,
          'onPromptCommit': _0x417576
        });
      });
    }
    _0x17e014["appendChild"](_0x1f8757);
  });
  if (isPromptPresetNodeTypeSupported(_0x5ac8e5)) {
    const _0x14303c = document['createElement']("div");
    _0x14303c["className"] = "preset-slash-item preset-slash-custom has-desc";
    _0x506257["length"] === 0x0 && _0x14303c["classList"]["add"]('preset-slash-custom-first');
    const _0x15ca29 = document["createElement"]("div");
    _0x15ca29['className'] = 'preset-slash-title-wrap';
    const _0x58820a = document["createElement"]("div");
    _0x58820a["className"] = "preset-slash-title preset-slash-custom-header";
    const _0x568e54 = document["createElement"]('span');
    _0x568e54["className"] = 'preset-slash-custom-title';
    _0x568e54["textContent"] = slashMenuText("customTitle");
    const _0x673a88 = document["createElement"]("span");
    _0x673a88["className"] = "preset-slash-badge";
    _0x673a88["textContent"] = slashMenuText("customBadge");
    _0x58820a["appendChild"](_0x568e54);
    _0x58820a["appendChild"](_0x673a88);
    const _0x5d7423 = document["createElement"]("div");
    _0x5d7423['className'] = "preset-slash-desc";
    _0x5d7423["textContent"] = slashMenuText("customDesc");
    _0x15ca29["appendChild"](_0x58820a);
    _0x15ca29['appendChild'](_0x5d7423);
    _0x14303c['appendChild'](_0x15ca29);
    _0x14303c["addEventListener"]("mousedown", _0x79f4 => {
      _0x79f4["preventDefault"]();
      closeSlashMenu();
      openCustomPresetsManager({
        'nodeType': _0x5ac8e5,
        'sourceNodeId': _0x301904
      });
    });
    _0x17e014['appendChild'](_0x14303c);
  }
  _0x17e014["style"]['left'] = "-9999px";
  _0x17e014["style"]["top"] = "-9999px";
  _0x17e014["style"]["width"] = '';
  _0x17e014["style"]["height"] = '';
  _0x17e014["classList"]["toggle"]("preset-slash-menu--expanded", placement === "expanded-panel");
  _0x17e014["classList"]["remove"]("is-bottom-sheet");
  _0x17e014['classList']["add"]("open");
  _0x17e014['style']['visibility'] = 'hidden';
  _slashPositionState = {
    'menu': _0x17e014,
    'anchorEl': anchorEl || _0x87fbb2['parentNode'] || _0x87fbb2,
    'containerEl': containerEl,
    'placement': ["above-end", 'expanded-panel']["includes"](placement) ? placement : 'auto-start',
    'menuHeight': _0x17e014['offsetHeight'] || 0x118,
    'onOpenChange': _0x59aa4e
  };
  _positionSlashMenu();
  _watchSlashViewport();
  _bindSlashOutsideDocClick(_0x17e014);
  _0x59aa4e?.(!![]);
}
export function openPromptPresetMenu(_0x4d90c4 = {}) {
  return checkSlashTrigger({}, {
    ..._0x4d90c4,
    'explicit': !![]
  });
}
function activateSubMenu(_0x5df299, _0x330a18) {
  if (!_0x5df299 || !_0x330a18) {
    return;
  }
  const _0x33a936 = _subMenuState["activeSubmenu"] ? {
    'activeSubmenu': _subMenuState["activeSubmenu"],
    'parentItem': _subMenuState['parentItem'],
    'subItems': _subMenuState["subItems"],
    'subIndex': _subMenuState["subIndex"]
  } : null;
  const _0x38ae91 = _0x33a936 ? [..._subMenuState["stack"], _0x33a936] : [];
  _openSlashSubmenu(_0x5df299, _0x330a18);
  const _0x60e9b7 = _getSlashSubmenuPresetItems(_0x330a18);
  _subMenuState = {
    'activeSubmenu': _0x330a18,
    'parentItem': _0x5df299,
    'subItems': _0x60e9b7,
    'subIndex': 0x0,
    'stack': _0x38ae91
  };
  _0x60e9b7['forEach']((_0x175f05, _0x10d31c) => _0x175f05["classList"]["toggle"]("active", _0x10d31c === 0x0));
  if (_0x60e9b7[0x0]) {
    _0x60e9b7[0x0]['scrollIntoView']({
      'block': "nearest"
    });
  }
  _showSlashCoverPreviewForItem(_0x330a18, _0x60e9b7[0x0]);
}
function deactivateSubMenu() {
  if (!_subMenuState["activeSubmenu"]) {
    return;
  }
  const _0x204489 = _subMenuState["parentItem"];
  const _0x40ce05 = _subMenuState["stack"]['at'](-0x1) || null;
  const _0x383e9b = _subMenuState['stack']["slice"](0x0, -0x1);
  _closeSlashSubmenuBranch(_subMenuState["activeSubmenu"]);
  if (_0x40ce05) {
    _subMenuState = {
      ..._0x40ce05,
      'stack': _0x383e9b
    };
    _0x40ce05["subItems"]["forEach"]((_0x339b43, _0x18858a) => _0x339b43['classList']["toggle"]("active", _0x18858a === _0x40ce05["subIndex"]));
    _0x40ce05["subItems"][_0x40ce05["subIndex"]]?.["scrollIntoView"]?.({
      'block': "nearest"
    });
    _showSlashCoverPreviewForItem(_0x40ce05["activeSubmenu"], _0x40ce05["subItems"][_0x40ce05["subIndex"]]);
    return;
  }
  _activateSlashItem(_0x204489);
  resetSubMenuState();
}
export function handleSlashKeyboardNavigation(_0x48f99d) {
  const _0x2e9c8c = getSlashMenu();
  if (!_0x2e9c8c["classList"]["contains"]("open")) {
    return ![];
  }
  if (_subMenuState["activeSubmenu"]) {
    const {
      subItems: _0x4d31bd,
      subIndex: _0xe89ce4
    } = _subMenuState;
    if (_0x48f99d["key"] === "ArrowLeft") {
      _0x48f99d['preventDefault']();
      deactivateSubMenu();
      return !![];
    }
    if (_0x48f99d['key'] === "ArrowDown") {
      _0x48f99d["preventDefault"]();
      const _0x56d98a = _0xe89ce4 < _0x4d31bd["length"] - 0x1 ? _0xe89ce4 + 0x1 : 0x0;
      _subMenuState["subIndex"] = _0x56d98a;
      _0x4d31bd["forEach"]((_0x5e3473, _0x5ddc11) => _0x5e3473['classList']["toggle"]("active", _0x5ddc11 === _0x56d98a));
      if (_0x4d31bd[_0x56d98a]) {
        _0x4d31bd[_0x56d98a]['scrollIntoView']({
          'block': 'nearest'
        });
      }
      _showSlashCoverPreviewForItem(_subMenuState["activeSubmenu"], _0x4d31bd[_0x56d98a]);
      return !![];
    }
    if (_0x48f99d["key"] === 'ArrowUp') {
      _0x48f99d['preventDefault']();
      const _0x1a9090 = _0xe89ce4 > 0x0 ? _0xe89ce4 - 0x1 : _0x4d31bd["length"] - 0x1;
      _subMenuState["subIndex"] = _0x1a9090;
      _0x4d31bd["forEach"]((_0x14452a, _0x1a565e) => _0x14452a["classList"]["toggle"]("active", _0x1a565e === _0x1a9090));
      if (_0x4d31bd[_0x1a9090]) {
        _0x4d31bd[_0x1a9090]["scrollIntoView"]({
          'block': 'nearest'
        });
      }
      _showSlashCoverPreviewForItem(_subMenuState['activeSubmenu'], _0x4d31bd[_0x1a9090]);
      return !![];
    }
    if (_0x48f99d["key"] === "ArrowRight") {
      _0x48f99d['preventDefault']();
      const _0xf7c1c4 = _0x4d31bd[_0xe89ce4];
      const _0x5d72bb = _getSlashChildSubmenu(_0xf7c1c4);
      if (_0x5d72bb) {
        activateSubMenu(_0xf7c1c4, _0x5d72bb);
      }
      return !![];
    }
    if (_0x48f99d["key"] === "Enter") {
      _0x48f99d["preventDefault"]();
      if (_0xe89ce4 >= 0x0 && _0x4d31bd[_0xe89ce4]) {
        const _0x51fdb7 = _0x4d31bd[_0xe89ce4];
        const _0x25d18d = _getSlashChildSubmenu(_0x51fdb7);
        if (_0x25d18d) {
          activateSubMenu(_0x51fdb7, _0x25d18d);
          return !![];
        }
        _0x51fdb7["dispatchEvent"](new MouseEvent("mousedown"));
      }
      resetSubMenuState();
      return !![];
    }
    if (_0x48f99d['key'] === "Escape") {
      _0x48f99d["preventDefault"]();
      deactivateSubMenu();
      return !![];
    }
    return ![];
  }
  const _0x278580 = Array["from"](_0x2e9c8c['children'])["filter"](_0x102339 => _0x102339["classList"] && _0x102339['classList']["contains"]('preset-slash-item'));
  let _0x34081c = _0x278580['findIndex'](_0x5c1d8d => _0x5c1d8d['classList']["contains"]("active"));
  if (_0x48f99d["key"] === "ArrowDown") {
    _0x48f99d["preventDefault"]();
    _0x34081c = _0x34081c < _0x278580['length'] - 0x1 ? _0x34081c + 0x1 : 0x0;
    _0x278580["forEach"]((_0x2f8015, _0x5c6c5d) => _0x2f8015['classList']["toggle"]('active', _0x5c6c5d === _0x34081c));
    if (_0x278580[_0x34081c]) {
      _0x278580[_0x34081c]["scrollIntoView"]({
        'block': "nearest"
      });
    }
    return !![];
  }
  if (_0x48f99d["key"] === "ArrowUp") {
    _0x48f99d["preventDefault"]();
    _0x34081c = _0x34081c > 0x0 ? _0x34081c - 0x1 : _0x278580["length"] - 0x1;
    _0x278580["forEach"]((_0x176b8e, _0x781bb4) => _0x176b8e["classList"]['toggle']("active", _0x781bb4 === _0x34081c));
    if (_0x278580[_0x34081c]) {
      _0x278580[_0x34081c]['scrollIntoView']({
        'block': "nearest"
      });
    }
    return !![];
  }
  if (_0x48f99d["key"] === 'ArrowRight') {
    _0x48f99d["preventDefault"]();
    if (_0x34081c >= 0x0 && _0x278580[_0x34081c]) {
      const _0x23c580 = _getSlashChildSubmenu(_0x278580[_0x34081c]);
      if (_0x23c580) {
        activateSubMenu(_0x278580[_0x34081c], _0x23c580);
      }
    }
    return !![];
  }
  if (_0x48f99d["key"] === "Enter") {
    _0x48f99d["preventDefault"]();
    if (_0x34081c >= 0x0) {
      const _0x37b722 = _getSlashChildSubmenu(_0x278580[_0x34081c]);
      if (_0x37b722) {
        activateSubMenu(_0x278580[_0x34081c], _0x37b722);
      } else {
        _0x278580[_0x34081c]["dispatchEvent"](new MouseEvent("mousedown"));
      }
    }
    return !![];
  }
  if (_0x48f99d["key"] === "Escape") {
    _0x48f99d["preventDefault"]();
    closeSlashMenu();
    return !![];
  }
  return ![];
}