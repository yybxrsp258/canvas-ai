import a385_0x56f43f from '../core/stores/appStore.js';
import { generateId, screenToWorld } from '../core/math.js';
import { commit } from '../modules/history.js';
import { onLocaleChange, t } from '../i18n/index.js';
import { calcSafeSpawnPosNearNode } from '../modules/nodeSpawn.js';
import { saveOutputBlob } from '../modules/project.js';
import { buildCanvasLocalImageFields } from '../services/canvasMediaLocalService.js';
import { buildSourceMediaNodePayload, getAutoMediaSizeByShortSide } from '../services/fileService.js';
import { buildCollageAspectRatioPatch, buildCollageCollapsePatch, buildCollageDividerDragPatch, buildCollageItemSwapPatch, buildCollageLayoutPatch, COLLAGE_ASPECT_RATIO_OPTIONS, COLLAGE_BACKGROUND_OPTIONS, COLLAGE_EXPORT_RESOLUTIONS, COLLAGE_TEMPLATE_GROUPS, getCollageAspectRatioOption, getCollageBackgroundOption, getCollageExportResolution, getCollageLayoutStyle, getCollageLayoutPreset, isCollageBackgroundTransparent, isCollageItemEmpty, normalizeCollageImageScale, normalizeCollageBackgroundColor, normalizeEmptyCollageItem, normalizeCollageStyleValue, resolveCollageExportSize, resolveCollageEditableDividers, resolveCollageItemFrames, resolveCollageItemPreviewUrl, resolveCollageSizeByShortSide, resolveCollageItemSourceImage } from '../modules/collage/collageFactory.js';
const COLLAGE_IMAGE_DRAG_OUT_THRESHOLD_PX = 0x8;
const COLLAGE_IMAGE_LOAD_CACHE_LIMIT = 0x30;
const collageImageLoadCache = new Map();
function collageText(_0x1a6906, _0x3d7c98 = {}) {
  return t("collageNode." + _0x1a6906, _0x3d7c98);
}
function collageTextOrFallback(_0x27d0d4, _0x344dd3, _0xe79970 = {}) {
  const _0x36dc8c = 'collageNode.' + _0x27d0d4;
  const _0x5cb40a = t(_0x36dc8c, _0xe79970);
  return _0x5cb40a === _0x36dc8c ? _0x344dd3 : _0x5cb40a;
}
function getCollagePresetLabel(_0x240ea8) {
  if (!_0x240ea8) {
    return '';
  }
  return collageTextOrFallback("layouts." + _0x240ea8['id'], _0x240ea8["label"] || '');
}
function getCollageBackgroundLabel(_0x27accb) {
  if (!_0x27accb) {
    return '';
  }
  return collageTextOrFallback("backgrounds." + _0x27accb['id'], _0x27accb["label"] || '');
}
function toPositiveNumber(_0x4ddf46, _0x1a9962 = 0x0) {
  const _0x5be2bc = Number(_0x4ddf46);
  return Number["isFinite"](_0x5be2bc) && _0x5be2bc > 0x0 ? _0x5be2bc : _0x1a9962;
}
function clamp01(_0x3f06ee, _0x41a2b8 = 0.5) {
  const _0x4bdbcd = Number(_0x3f06ee);
  if (!Number["isFinite"](_0x4bdbcd)) {
    return _0x41a2b8;
  }
  return Math["min"](0x1, Math["max"](0x0, _0x4bdbcd));
}
function createSvgIcon(_0x90a7f2) {
  const _0x34b162 = 'http://www.w3.org/2000/svg';
  const _0x3f0ccb = document['createElementNS'](_0x34b162, "svg");
  _0x3f0ccb['setAttribute']('width', '16');
  _0x3f0ccb['setAttribute']("height", '16');
  _0x3f0ccb["setAttribute"]('viewBox', "0 0 24 24");
  _0x3f0ccb["setAttribute"]('fill', "none");
  _0x3f0ccb["setAttribute"]("stroke", "currentColor");
  _0x3f0ccb["setAttribute"]("stroke-width", '2');
  _0x3f0ccb["setAttribute"]("stroke-linecap", "round");
  _0x3f0ccb["setAttribute"]("stroke-linejoin", "round");
  for (const _0x510673 of _0x90a7f2) {
    const _0x352fc7 = document["createElementNS"](_0x34b162, "path");
    _0x352fc7['setAttribute']('d', _0x510673);
    _0x3f0ccb['appendChild'](_0x352fc7);
  }
  return _0x3f0ccb;
}
function canvasToBlob(_0x4c57e5, _0x4a113a, _0x61519e) {
  return new Promise((_0x5e6739, _0x231c22) => {
    _0x4c57e5["toBlob"](_0x2f2f93 => {
      if (_0x2f2f93) {
        _0x5e6739(_0x2f2f93);
      } else {
        _0x231c22(new Error(collageText('errors.exportBlobFailed')));
      }
    }, _0x4a113a, _0x61519e);
  });
}
function loadImage(_0x3aa0b2) {
  const _0x53a1ad = String(_0x3aa0b2 || '')["trim"]();
  if (!_0x53a1ad) {
    return Promise["reject"](new Error(collageText("errors.emptyImageUrl")));
  }
  const _0x3b1a3f = collageImageLoadCache["get"](_0x53a1ad);
  if (_0x3b1a3f) {
    collageImageLoadCache["delete"](_0x53a1ad);
    collageImageLoadCache["set"](_0x53a1ad, _0x3b1a3f);
    return _0x3b1a3f;
  }
  const _0x1781d3 = new Promise((_0x271459, _0x5a03c0) => {
    const _0x2c2738 = new Image();
    _0x2c2738["crossOrigin"] = "anonymous";
    _0x2c2738["onload"] = () => {
      typeof _0x2c2738["decode"] === "function" ? _0x2c2738["decode"]()["catch"](() => {})["finally"](() => _0x271459(_0x2c2738)) : _0x271459(_0x2c2738);
    };
    _0x2c2738["onerror"] = () => {
      collageImageLoadCache['delete'](_0x53a1ad);
      _0x5a03c0(new Error(collageText("errors.imageLoadFailed")));
    };
    _0x2c2738["src"] = _0x53a1ad;
  });
  collageImageLoadCache['set'](_0x53a1ad, _0x1781d3);
  while (collageImageLoadCache["size"] > COLLAGE_IMAGE_LOAD_CACHE_LIMIT) {
    const _0x124aef = collageImageLoadCache["keys"]()['next']()["value"];
    collageImageLoadCache["delete"](_0x124aef);
  }
  return _0x1781d3;
}
function drawImageCover(_0x56ed55, _0x4458c7, _0x28a06c, _0x1a2865, _0x4ae9ca, _0x10181f, _0x329b43, _0x2710c8, _0x3a1ff7 = 0x1) {
  const _0x4d708b = _0x4458c7["naturalWidth"] || _0x4458c7['width'];
  const _0x1db54a = _0x4458c7["naturalHeight"] || _0x4458c7["height"];
  if (!(_0x4d708b > 0x0 && _0x1db54a > 0x0 && _0x4ae9ca > 0x0 && _0x10181f > 0x0)) {
    return ![];
  }
  const _0x6dd68 = _0x4ae9ca / _0x10181f;
  const _0x1d8fbe = _0x4d708b / _0x1db54a;
  const _0x13c8e2 = normalizeCollageImageScale(_0x3a1ff7);
  let _0x48ee88 = 0x0;
  let _0x4b9388 = 0x0;
  let _0x1d02e1 = _0x4d708b;
  let _0x5debbc = _0x1db54a;
  _0x1d8fbe > _0x6dd68 ? (_0x1d02e1 = _0x1db54a * _0x6dd68 / _0x13c8e2, _0x5debbc = _0x1db54a / _0x13c8e2, _0x48ee88 = (_0x4d708b - _0x1d02e1) * clamp01(_0x329b43), _0x4b9388 = (_0x1db54a - _0x5debbc) * clamp01(_0x2710c8)) : (_0x1d02e1 = _0x4d708b / _0x13c8e2, _0x5debbc = _0x4d708b / _0x6dd68 / _0x13c8e2, _0x48ee88 = (_0x4d708b - _0x1d02e1) * clamp01(_0x329b43), _0x4b9388 = (_0x1db54a - _0x5debbc) * clamp01(_0x2710c8));
  _0x56ed55['drawImage'](_0x4458c7, _0x48ee88, _0x4b9388, _0x1d02e1, _0x5debbc, _0x28a06c, _0x1a2865, _0x4ae9ca, _0x10181f);
  return !![];
}
function drawRoundedRectPath(_0xe772f3, _0x5c1c66, _0x273247, _0x135d3, _0x1b6054, _0x350188) {
  const _0x5eb8b9 = Math["max"](0x0, Math["min"](_0x350188, _0x135d3 / 0x2, _0x1b6054 / 0x2));
  _0xe772f3["beginPath"]();
  if (typeof _0xe772f3["roundRect"] === 'function') {
    _0xe772f3["roundRect"](_0x5c1c66, _0x273247, _0x135d3, _0x1b6054, _0x5eb8b9);
    return;
  }
  _0xe772f3['moveTo'](_0x5c1c66 + _0x5eb8b9, _0x273247);
  _0xe772f3['lineTo'](_0x5c1c66 + _0x135d3 - _0x5eb8b9, _0x273247);
  _0xe772f3["quadraticCurveTo"](_0x5c1c66 + _0x135d3, _0x273247, _0x5c1c66 + _0x135d3, _0x273247 + _0x5eb8b9);
  _0xe772f3["lineTo"](_0x5c1c66 + _0x135d3, _0x273247 + _0x1b6054 - _0x5eb8b9);
  _0xe772f3['quadraticCurveTo'](_0x5c1c66 + _0x135d3, _0x273247 + _0x1b6054, _0x5c1c66 + _0x135d3 - _0x5eb8b9, _0x273247 + _0x1b6054);
  _0xe772f3["lineTo"](_0x5c1c66 + _0x5eb8b9, _0x273247 + _0x1b6054);
  _0xe772f3["quadraticCurveTo"](_0x5c1c66, _0x273247 + _0x1b6054, _0x5c1c66, _0x273247 + _0x1b6054 - _0x5eb8b9);
  _0xe772f3["lineTo"](_0x5c1c66, _0x273247 + _0x5eb8b9);
  _0xe772f3["quadraticCurveTo"](_0x5c1c66, _0x273247, _0x5c1c66 + _0x5eb8b9, _0x273247);
}
function drawRoundedImageCover(_0x4b38d7, _0x193b07, _0x26f6bd, _0x211113, _0x338095, _0x3f1429, _0x5750ad) {
  _0x211113 > 0x0 && (_0x4b38d7["save"](), drawRoundedRectPath(_0x4b38d7, _0x26f6bd['x'], _0x26f6bd['y'], _0x26f6bd['width'], _0x26f6bd['height'], _0x211113), _0x4b38d7["clip"]());
  const _0x4c5edb = drawImageCover(_0x4b38d7, _0x193b07, _0x26f6bd['x'], _0x26f6bd['y'], _0x26f6bd["width"], _0x26f6bd["height"], _0x338095, _0x3f1429, _0x5750ad);
  if (_0x211113 > 0x0) {
    _0x4b38d7["restore"]();
  }
  return _0x4c5edb;
}
function getDocumentCssVar(_0x7725c0) {
  try {
    return getComputedStyle(document["documentElement"])["getPropertyValue"](_0x7725c0)["trim"]();
  } catch {
    return '';
  }
}
function resolveCssColorValue(_0x2b16b5) {
  const _0x202225 = normalizeCollageBackgroundColor(_0x2b16b5);
  if (isCollageBackgroundTransparent(_0x202225)) {
    return "transparent";
  }
  const _0x1e7c7d = _0x202225["match"](/^var\(\s*(--[\w-]+)\s*\)$/);
  if (_0x1e7c7d) {
    return getDocumentCssVar(_0x1e7c7d[0x1]);
  }
  return _0x202225;
}
function createBlobObjectUrl(_0x4ab9eb) {
  const _0x1609b8 = globalThis["URL"] || globalThis["window"]?.['URL'];
  if (!_0x4ab9eb || typeof _0x1609b8?.["createObjectURL"] !== "function") {
    return '';
  }
  try {
    return _0x1609b8["createObjectURL"](_0x4ab9eb);
  } catch (_0x13ca97) {
    return '';
  }
}
function revokeBlobObjectUrl(_0x3c3c06) {
  if (!_0x3c3c06 || !String(_0x3c3c06)["startsWith"]("blob:")) {
    return;
  }
  const _0x15efae = globalThis["URL"] || globalThis["window"]?.["URL"];
  if (typeof _0x15efae?.["revokeObjectURL"] !== "function") {
    return;
  }
  try {
    _0x15efae['revokeObjectURL'](_0x3c3c06);
  } catch (_0x6904eb) {}
}
export class CollageNode {
  constructor(_0x4be0a0) {
    this["_data"] = _0x4be0a0 && typeof _0x4be0a0 === "object" ? _0x4be0a0 : {};
    this['id'] = this["_data"]['id'];
    this['el'] = document["createElement"]("div");
    this['el']["className"] = 'v2-node-component\x20collage-node';
    this["_isEditing"] = !!this["_data"]["isEditing"];
    this['_isCollapsed'] = !!this["_data"]['isCollapsed'];
    this["_isExporting"] = ![];
    this["_isCompositing"] = ![];
    this['_openMenuKey'] = '';
    this["_menuOutsideListeners"] = [];
    this["_activeImageDrag"] = null;
    this["_activeDividerDrag"] = null;
    this['_itemsCommitTimer'] = null;
    this["_previewSignature"] = '';
    this["_highlightedSlotIndex"] = -0x1;
    this["_unsubscribeLocale"] = null;
  }
  ["mount"]() {
    this["_subscribeLocaleChanges"]();
    this["_removeMenuOutsideListeners"]();
    this['el']['replaceChildren']();
    this["_isEditing"] = !!this["_data"]['isEditing'];
    this['_isCollapsed'] = !!this["_data"]["isCollapsed"];
    this["_syncRootState"]();
    this["_toolbarEl"] = this["_createToolbar"]();
    this['el']["appendChild"](this["_toolbarEl"]);
    const _0x4d9335 = document["createElement"]("div");
    _0x4d9335["className"] = "collage-board";
    const _0x26d699 = getCollageBackgroundOption(this["_data"]['backgroundColor']);
    _0x4d9335['dataset']["collageBackground"] = _0x26d699['id'];
    _0x4d9335["addEventListener"]("dblclick", _0x396e1e => {
      _0x396e1e["preventDefault"]();
      _0x396e1e['stopPropagation']();
      this["_toggleEdit"](!![]);
    });
    _0x4d9335["appendChild"](this["_createPreviewLayer"]());
    this['el']["appendChild"](_0x4d9335);
    this["_boardEl"] = _0x4d9335;
    this["_previewSignature"] = this["_getPreviewSignature"]();
    return this['el'];
  }
  ['update'](_0x36755b) {
    this['_data'] = _0x36755b && typeof _0x36755b === "object" ? _0x36755b : {};
    this['_isEditing'] = !!this["_data"]['isEditing'];
    this["_isCollapsed"] = !!this["_data"]['isCollapsed'];
    if (!this["_boardEl"] || !this['_toolbarEl']) {
      this["mount"]();
      return;
    }
    this['_syncBoardBackground']();
    this['_syncToolbarState']();
    const _0x559619 = this["_getPreviewSignature"]();
    _0x559619 !== this["_previewSignature"] ? this["_syncPreviewLayer"]() : this["_syncEditingState"]();
  }
  ["unmount"]() {
    this["_unsubscribeLocale"]?.();
    this['_unsubscribeLocale'] = null;
    this["_endImageDrag"]({
      'shouldCommit': ![]
    });
    this["_endDividerDrag"]({
      'shouldCommit': ![]
    });
    this['_removeMenuOutsideListeners']();
    this["_itemsCommitTimer"] && (clearTimeout(this["_itemsCommitTimer"]), this['_itemsCommitTimer'] = null);
    this['_openMenuKey'] = '';
  }
  ["_subscribeLocaleChanges"]() {
    if (this["_unsubscribeLocale"]) {
      return;
    }
    this['_unsubscribeLocale'] = onLocaleChange(() => {
      this["mount"]();
    });
  }
  ["highlightSlot"](_0x5258c8) {
    const _0x19bef1 = Number(_0x5258c8);
    const _0x3c2869 = Number["isInteger"](_0x19bef1) && _0x19bef1 >= 0x0 ? _0x19bef1 : -0x1;
    if (this["_highlightedSlotIndex"] === _0x3c2869) {
      return;
    }
    const _0x30bb92 = this["_highlightedSlotIndex"];
    this['_highlightedSlotIndex'] = _0x3c2869;
    _0x30bb92 >= 0x0 ? this['_getTileByIndex'](_0x30bb92)?.['classList']["remove"]("is-drop-highlight") : this['el']['querySelectorAll']('.collage-item.is-drop-highlight')["forEach"](_0xbfb0ea => _0xbfb0ea["classList"]["remove"]("is-drop-highlight"));
    if (_0x3c2869 < 0x0) {
      return;
    }
    this['_getTileByIndex'](_0x3c2869)?.["classList"]['add']("is-drop-highlight");
  }
  ["previewItems"](_0x27b1ec) {
    if (!Array["isArray"](_0x27b1ec)) {
      return;
    }
    this["_data"] = {
      ...this["_data"],
      'items': _0x27b1ec
    };
    this["_syncPreviewLayer"]();
  }
  ["_getPreviewSignature"](_0x5490eb = this["_data"]) {
    const _0x47b031 = getCollageLayoutStyle(_0x5490eb);
    const _0x4bcb2f = (Array["isArray"](_0x5490eb?.["items"]) ? _0x5490eb['items'] : [])["map"](_0x5a2a7f => ({
      'id': _0x5a2a7f?.['id'] || '',
      'slotIndex': _0x5a2a7f?.["slotIndex"] ?? null,
      'x': Number(_0x5a2a7f?.['x']) || 0x0,
      'y': Number(_0x5a2a7f?.['y']) || 0x0,
      'width': Number(_0x5a2a7f?.['width']) || 0x0,
      'height': Number(_0x5a2a7f?.["height"]) || 0x0,
      'url': String(_0x5a2a7f?.['url'] || ''),
      'localPath': String(_0x5a2a7f?.["localPath"] || ''),
      'thumbLocalPath': String(_0x5a2a7f?.["thumbLocalPath"] || ''),
      'sourceLocalPath': String(_0x5a2a7f?.["sourceLocalPath"] || ''),
      'sourceUrl': String(_0x5a2a7f?.["sourceUrl"] || ''),
      'sourceDisplayWidth': Number(_0x5a2a7f?.["sourceDisplayWidth"]) || 0x0,
      'sourceDisplayHeight': Number(_0x5a2a7f?.["sourceDisplayHeight"]) || 0x0,
      'label': String(_0x5a2a7f?.["label"] || ''),
      'fit': String(_0x5a2a7f?.["fit"] || ''),
      'focusX': clamp01(_0x5a2a7f?.['focusX']),
      'focusY': clamp01(_0x5a2a7f?.['focusY']),
      'imageScale': normalizeCollageImageScale(_0x5a2a7f?.["imageScale"]),
      'isEmpty': !!_0x5a2a7f?.["isEmpty"]
    }));
    return JSON["stringify"]({
      'width': toPositiveNumber(_0x5490eb?.['width'], 0x1),
      'height': toPositiveNumber(_0x5490eb?.['height'], 0x1),
      'outerPadding': _0x47b031["outerPadding"],
      'gap': _0x47b031['gap'],
      'cornerRadius': _0x47b031['cornerRadius'],
      'items': _0x4bcb2f
    });
  }
  ['_createToolbar']() {
    const _0x5df683 = document['createElement']("div");
    _0x5df683['className'] = "node-floating-toolbar collage-toolbar";
    _0x5df683["appendChild"](this['_createAspectRatioPicker']());
    _0x5df683["appendChild"](this["_createTemplatePicker"]());
    _0x5df683["appendChild"](this["_createToolbarDivider"]());
    _0x5df683['appendChild'](this["_createEditButton"]());
    _0x5df683['appendChild'](this["_createBackgroundColorPicker"]());
    _0x5df683["appendChild"](this['_createRangeControl']({
      'field': "outerPadding",
      'label': collageText("toolbar.outerPadding"),
      'icon': ["M4 4h16v16H4z", 'M8\x208h8v8H8z']
    }));
    _0x5df683["appendChild"](this["_createRangeControl"]({
      'field': "gap",
      'label': collageText("toolbar.gap"),
      'icon': ["M4 4h6v16H4z", "M14 4h6v16h-6z"]
    }));
    _0x5df683["appendChild"](this['_createRangeControl']({
      'field': "cornerRadius",
      'label': collageText("toolbar.cornerRadius"),
      'icon': ["M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"]
    }));
    _0x5df683["appendChild"](this["_createCompositeButton"]());
    _0x5df683["appendChild"](this['_createExportButton']());
    _0x5df683['appendChild'](this["_createCollapseButton"]());
    return _0x5df683;
  }
  ['_createToolbarDivider']() {
    const _0x280195 = document["createElement"]("span");
    _0x280195["className"] = "collage-toolbar-divider";
    _0x280195["textContent"] = '|';
    _0x280195["setAttribute"]('aria-hidden', "true");
    return _0x280195;
  }
  ["_createEditButton"]() {
    const _0x2bf533 = document["createElement"]("button");
    _0x2bf533["type"] = "button";
    _0x2bf533["className"] = 'ftb-btn\x20icon-only\x20act-edit\x20collage-edit-btn';
    _0x2bf533["classList"]["toggle"]("active", this["_isEditing"]);
    const _0xfbb3e4 = this["_isEditing"] ? collageText("toolbar.exitEdit") : collageText('toolbar.edit');
    _0x2bf533["dataset"]["tooltip"] = _0xfbb3e4;
    _0x2bf533["setAttribute"]("aria-label", _0xfbb3e4);
    _0x2bf533["appendChild"](createSvgIcon(["M12 20h9", "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"]));
    _0x2bf533["addEventListener"]("pointerdown", _0x3d0d13 => _0x3d0d13["stopPropagation"]());
    _0x2bf533['addEventListener']("dblclick", _0x46af5a => _0x46af5a["stopPropagation"]());
    _0x2bf533["addEventListener"]("click", _0x49a3c9 => {
      _0x49a3c9['stopPropagation']();
      this["_toggleEdit"](!this["_isEditing"]);
    });
    return _0x2bf533;
  }
  ['_createAspectRatioPicker']() {
    const _0x2b86e2 = getCollageAspectRatioOption(this['_data']["aspectRatio"]);
    const _0x921e52 = document['createElement']("div");
    _0x921e52["className"] = "collage-ratio-wrap";
    _0x921e52["addEventListener"]("pointerdown", _0x38bb0a => _0x38bb0a["stopPropagation"]());
    const _0x44667b = document['createElement']("button");
    _0x44667b["type"] = "button";
    _0x44667b['className'] = "ftb-btn collage-ratio-trigger";
    _0x44667b["dataset"]['tooltip'] = collageText("ratio.tooltip");
    _0x44667b["setAttribute"]("aria-label", collageText('ratio.tooltip'));
    _0x44667b["appendChild"](createSvgIcon(["M4 6h16v12H4z"]));
    const _0x18505b = document["createElement"]('span');
    _0x18505b["textContent"] = _0x2b86e2?.["label"] || collageText("ratio.fallback");
    _0x44667b["appendChild"](_0x18505b);
    const _0xe392a8 = document["createElement"]("div");
    _0xe392a8["className"] = 'collage-menu\x20collage-ratio-menu';
    for (const _0x5027d4 of COLLAGE_ASPECT_RATIO_OPTIONS) {
      const _0x519f67 = document['createElement']("button");
      _0x519f67['type'] = 'button';
      _0x519f67["className"] = "collage-ratio-option";
      _0x519f67["dataset"]["collageRatio"] = _0x5027d4["label"];
      _0x519f67["classList"]["toggle"]("is-active", _0x5027d4["label"] === _0x2b86e2?.["label"]);
      _0x519f67["setAttribute"]("aria-label", collageText("ratio.optionAria", {
        'label': _0x5027d4["label"]
      }));
      const _0x98ca11 = document['createElement']('span');
      _0x98ca11["className"] = 'collage-ratio-mark';
      _0x98ca11["dataset"]["collageRatio"] = _0x5027d4["label"];
      _0x519f67["appendChild"](_0x98ca11);
      const _0x2b2cee = document['createElement']("span");
      _0x2b2cee["textContent"] = _0x5027d4['label'];
      _0x519f67['appendChild'](_0x2b2cee);
      _0x519f67['addEventListener']("click", _0x4b44bf => {
        _0x4b44bf["stopPropagation"]();
        const _0x5d3a7d = buildCollageAspectRatioPatch(this["_data"], _0x5027d4["value"]);
        a385_0x56f43f["updateNodeData"](this['id'], _0x5d3a7d);
        commit();
      });
      _0xe392a8['appendChild'](_0x519f67);
    }
    _0x44667b["addEventListener"]('click', _0x2ec386 => {
      _0x2ec386["stopPropagation"]();
      this['_toggleMenu'](_0xe392a8);
    });
    this["_registerMenu"](_0xe392a8, _0x921e52, "ratio");
    _0x921e52["appendChild"](_0x44667b);
    _0x921e52["appendChild"](_0xe392a8);
    return _0x921e52;
  }
  ['_createTemplatePicker']() {
    const _0x4044f9 = document["createElement"]("div");
    _0x4044f9['className'] = "collage-grid-wrap";
    _0x4044f9['addEventListener']("pointerdown", _0x4abefa => _0x4abefa["stopPropagation"]());
    const _0x1ab41e = document['createElement']("button");
    _0x1ab41e["type"] = "button";
    _0x1ab41e["className"] = "ftb-btn collage-grid-trigger";
    _0x1ab41e["dataset"]['tooltip'] = collageText('templates.tooltip');
    _0x1ab41e["setAttribute"]("aria-label", collageText("templates.tooltip"));
    _0x1ab41e["appendChild"](createSvgIcon(["M3 3h18v18H3z", "M3 11h18", "M11 3v18"]));
    const _0x49f7ba = document['createElement']("span");
    _0x49f7ba["textContent"] = collageText("templates.label");
    _0x1ab41e["appendChild"](_0x49f7ba);
    const _0x20541e = document['createElement']('div');
    _0x20541e["className"] = "collage-menu collage-grid-menu";
    const _0x4556ba = document['createElement']("div");
    _0x4556ba["className"] = "collage-grid-count-list";
    const _0x295842 = document["createElement"]("div");
    _0x295842['className'] = 'collage-template-panel';
    _0x20541e["appendChild"](_0x4556ba);
    _0x20541e["appendChild"](_0x295842);
    let _0x3abf6c = getCollageLayoutPreset(this["_data"]["layoutPresetId"])["slotCount"] || 0x2;
    if (![0x2, 0x3, 0x4]["includes"](_0x3abf6c)) {
      _0x3abf6c = 0x2;
    }
    const _0x51560d = _0x3be7a4 => {
      _0x3abf6c = _0x3be7a4;
      _0x4556ba["querySelectorAll"]('.collage-grid-count-btn')["forEach"](_0x1d789f => _0x1d789f["classList"]['toggle']('is-active', Number(_0x1d789f["dataset"]["slotCount"]) === _0x3be7a4));
      _0x295842["replaceChildren"]();
      const _0x4fa40f = COLLAGE_TEMPLATE_GROUPS["find"](_0x12eb99 => _0x12eb99["slotCount"] === _0x3be7a4);
      for (const _0x1419e3 of _0x4fa40f?.["presets"] || []) {
        const _0x1b750f = document["createElement"]('button');
        _0x1b750f["type"] = "button";
        _0x1b750f["className"] = "collage-template-option";
        _0x1b750f["dataset"]["collagePresetId"] = _0x1419e3['id'];
        _0x1b750f['classList']["toggle"]("is-active", _0x1419e3['id'] === this["_data"]["layoutPresetId"]);
        const _0x2d239d = getCollagePresetLabel(_0x1419e3);
        _0x1b750f["title"] = _0x2d239d;
        _0x1b750f["setAttribute"]("aria-label", _0x2d239d);
        _0x1b750f["appendChild"](this['_createTemplatePreview'](_0x1419e3));
        _0x1b750f['addEventListener']('click', _0x3a4259 => {
          _0x3a4259["stopPropagation"]();
          const _0x2e853c = buildCollageLayoutPatch(this["_data"], _0x1419e3['id']);
          a385_0x56f43f["updateNodeData"](this['id'], _0x2e853c);
          commit();
        });
        _0x295842["appendChild"](_0x1b750f);
      }
    };
    for (const _0x3e8417 of COLLAGE_TEMPLATE_GROUPS) {
      const _0xa9c564 = document['createElement']('button');
      _0xa9c564["type"] = "button";
      _0xa9c564["className"] = "collage-grid-count-btn";
      _0xa9c564['dataset']["slotCount"] = String(_0x3e8417['slotCount']);
      _0xa9c564["textContent"] = _0x3e8417["label"];
      _0xa9c564['setAttribute']("aria-label", collageText("templates.countAria", {
        'count': _0x3e8417["label"]
      }));
      _0xa9c564["addEventListener"]('pointerenter', () => _0x51560d(_0x3e8417["slotCount"]));
      _0xa9c564["addEventListener"]("focus", () => _0x51560d(_0x3e8417["slotCount"]));
      _0xa9c564["addEventListener"]('click', _0x436596 => {
        _0x436596["stopPropagation"]();
        _0x51560d(_0x3e8417["slotCount"]);
      });
      _0x4556ba["appendChild"](_0xa9c564);
    }
    _0x51560d(_0x3abf6c);
    _0x1ab41e["addEventListener"]("click", _0x2ebe27 => {
      _0x2ebe27["stopPropagation"]();
      this['_toggleMenu'](_0x20541e);
    });
    this["_registerMenu"](_0x20541e, _0x4044f9, "grid");
    _0x4044f9["appendChild"](_0x1ab41e);
    _0x4044f9['appendChild'](_0x20541e);
    return _0x4044f9;
  }
  ["_createTemplatePreview"](_0x35e97e) {
    const _0x3b540f = document["createElement"]("span");
    _0x3b540f["className"] = 'collage-template-preview';
    for (const _0x38ea9f of _0x35e97e["slots"] || []) {
      const _0x2ad1cb = document["createElement"]("span");
      _0x2ad1cb['className'] = "collage-template-preview-slot";
      _0x2ad1cb["style"]["left"] = _0x38ea9f['x'] / _0x35e97e['width'] * 0x64 + '%';
      _0x2ad1cb['style']["top"] = _0x38ea9f['y'] / _0x35e97e['height'] * 0x64 + '%';
      _0x2ad1cb["style"]['width'] = _0x38ea9f["width"] / _0x35e97e["width"] * 0x64 + '%';
      _0x2ad1cb['style']["height"] = _0x38ea9f["height"] / _0x35e97e["height"] * 0x64 + '%';
      _0x3b540f["appendChild"](_0x2ad1cb);
    }
    return _0x3b540f;
  }
  ["_createBackgroundColorPicker"]() {
    const _0x4e88ba = getCollageBackgroundOption(this["_data"]["backgroundColor"]);
    const _0x1c9e48 = document["createElement"]('div');
    _0x1c9e48["className"] = "collage-bg-wrap";
    _0x1c9e48["addEventListener"]("pointerdown", _0x5b2669 => _0x5b2669["stopPropagation"]());
    const _0x221bf8 = document["createElement"]('button');
    _0x221bf8['type'] = "button";
    _0x221bf8["className"] = "ftb-btn icon-only collage-bg-btn";
    _0x221bf8["dataset"]["tooltip"] = collageText('background.tooltip');
    _0x221bf8["setAttribute"]('aria-label', collageText('background.tooltip'));
    const _0x12fa36 = document["createElement"]("span");
    _0x12fa36["className"] = "collage-bg-dot";
    _0x12fa36["dataset"]["collageBackground"] = _0x4e88ba['id'];
    _0x221bf8["appendChild"](_0x12fa36);
    const _0x4ec6ad = document["createElement"]('div');
    _0x4ec6ad['className'] = 'collage-menu\x20collage-bg-menu';
    _0x221bf8["addEventListener"]("click", _0xb8e5d3 => {
      _0xb8e5d3["stopPropagation"]();
      this["_toggleMenu"](_0x4ec6ad);
    });
    for (const _0x2531ec of COLLAGE_BACKGROUND_OPTIONS) {
      const _0x17f7d7 = document["createElement"]("button");
      _0x17f7d7['type'] = "button";
      _0x17f7d7["className"] = "collage-bg-option";
      _0x17f7d7["dataset"]['collageBackground'] = _0x2531ec['id'];
      _0x17f7d7["dataset"]["collageBackgroundValue"] = _0x2531ec['value'];
      _0x17f7d7["classList"]["toggle"]('is-active', _0x2531ec['id'] === _0x4e88ba['id']);
      const _0x32e832 = getCollageBackgroundLabel(_0x2531ec);
      _0x17f7d7['title'] = _0x32e832;
      _0x17f7d7['setAttribute']("aria-label", collageText("background.optionAria", {
        'label': _0x32e832
      }));
      _0x17f7d7["addEventListener"]("click", _0x5ef252 => {
        _0x5ef252["stopPropagation"]();
        this["_setBackgroundColor"](_0x2531ec["value"]);
      });
      _0x4ec6ad["appendChild"](_0x17f7d7);
    }
    this['_registerMenu'](_0x4ec6ad, _0x1c9e48, "background");
    _0x1c9e48['appendChild'](_0x221bf8);
    _0x1c9e48['appendChild'](_0x4ec6ad);
    return _0x1c9e48;
  }
  ['_createRangeControl']({
    field: _0xff62f,
    label: _0x30bcb9,
    icon: _0x37d7f3
  }) {
    const _0x1ff96f = getCollageLayoutStyle(this["_data"]);
    const _0x27d2a7 = document["createElement"]("div");
    _0x27d2a7["className"] = "collage-range-wrap";
    _0x27d2a7["dataset"]['collageRangeField'] = _0xff62f;
    _0x27d2a7['addEventListener']("pointerdown", _0x26ade3 => _0x26ade3["stopPropagation"]());
    const _0x3fca9f = document['createElement']('button');
    _0x3fca9f["type"] = "button";
    _0x3fca9f['className'] = "ftb-btn icon-only collage-range-btn";
    _0x3fca9f["dataset"]["tooltip"] = _0x30bcb9;
    _0x3fca9f['setAttribute']('aria-label', _0x30bcb9);
    _0x3fca9f["appendChild"](createSvgIcon(_0x37d7f3));
    const _0x30848e = document["createElement"]("div");
    _0x30848e["className"] = "collage-menu collage-range-menu";
    const _0x2b41b8 = document["createElement"]("span");
    _0x2b41b8["className"] = 'collage-range-value';
    _0x2b41b8["textContent"] = String(_0x1ff96f[_0xff62f]);
    const _0x1f7894 = document["createElement"]("input");
    _0x1f7894["type"] = 'range';
    _0x1f7894["min"] = '0';
    _0x1f7894["max"] = '100';
    _0x1f7894["step"] = '1';
    _0x1f7894["value"] = String(_0x1ff96f[_0xff62f]);
    _0x1f7894['setAttribute']('aria-label', _0x30bcb9);
    _0x1f7894["addEventListener"]("input", () => {
      const _0x31ac35 = normalizeCollageStyleValue(_0x1f7894["value"], _0x1ff96f[_0xff62f]);
      _0x2b41b8["textContent"] = String(_0x31ac35);
      this['_data'] = {
        ...this["_data"],
        [_0xff62f]: _0x31ac35
      };
      this["_syncPreviewLayoutStyle"]({
        'updateSignature': ![]
      });
    });
    _0x1f7894["addEventListener"]('change', () => {
      const _0x5757e7 = normalizeCollageStyleValue(_0x1f7894["value"], _0x1ff96f[_0xff62f]);
      this["_data"] = {
        ...this["_data"],
        [_0xff62f]: _0x5757e7
      };
      this["_syncPreviewLayoutStyle"]();
      a385_0x56f43f["updateNodeData"](this['id'], {
        [_0xff62f]: _0x5757e7
      });
      commit();
    });
    _0x30848e["appendChild"](_0x2b41b8);
    _0x30848e["appendChild"](_0x1f7894);
    _0x3fca9f["addEventListener"]("click", _0x190746 => {
      _0x190746['stopPropagation']();
      this["_toggleMenu"](_0x30848e);
    });
    this["_registerMenu"](_0x30848e, _0x27d2a7, "range:" + _0xff62f);
    _0x27d2a7["appendChild"](_0x3fca9f);
    _0x27d2a7["appendChild"](_0x30848e);
    return _0x27d2a7;
  }
  ["_createCompositeButton"]() {
    const _0x5d5720 = document['createElement']("div");
    _0x5d5720["className"] = "collage-compose-wrap";
    _0x5d5720["addEventListener"]("pointerdown", _0x27135b => _0x27135b['stopPropagation']());
    const _0x4d52a0 = document['createElement']("button");
    _0x4d52a0["type"] = "button";
    _0x4d52a0["className"] = 'ftb-btn\x20icon-only\x20act-compose\x20collage-compose-btn';
    const _0x4c1e8c = this["_isExporting"] || this["_isCompositing"];
    const _0x24b9b9 = this["_isCompositing"] ? collageText("toolbar.composeBusy") : collageText("toolbar.compose");
    _0x4d52a0['dataset']["tooltip"] = _0x24b9b9;
    _0x4d52a0["setAttribute"]("aria-label", _0x24b9b9);
    _0x4d52a0["disabled"] = _0x4c1e8c;
    _0x4d52a0["appendChild"](createSvgIcon(["M12 3v18", "M21 12H3"]));
    const _0x33ddbf = document["createElement"]("div");
    _0x33ddbf["className"] = 'collage-menu\x20collage-export-menu';
    for (const _0x23d249 of COLLAGE_EXPORT_RESOLUTIONS) {
      const _0x533f4e = document["createElement"]("button");
      _0x533f4e["type"] = 'button';
      _0x533f4e["className"] = "collage-export-option";
      _0x533f4e['textContent'] = _0x23d249['label'];
      _0x533f4e["setAttribute"]("aria-label", collageText("compose.optionAria", {
        'label': _0x23d249["label"]
      }));
      _0x533f4e["addEventListener"]("click", _0xe657e6 => {
        _0xe657e6["stopPropagation"]();
        this["_composeCollage"](_0x23d249["longSide"], _0x4d52a0);
      });
      _0x33ddbf["appendChild"](_0x533f4e);
    }
    _0x4d52a0["addEventListener"]("click", _0x289763 => {
      _0x289763["stopPropagation"]();
      this['_toggleMenu'](_0x33ddbf);
    });
    this["_registerMenu"](_0x33ddbf, _0x5d5720, "compose");
    _0x5d5720["appendChild"](_0x4d52a0);
    _0x5d5720["appendChild"](_0x33ddbf);
    return _0x5d5720;
  }
  ["_createExportButton"]() {
    const _0x25165f = document["createElement"]('div');
    _0x25165f["className"] = "collage-export-wrap";
    _0x25165f["addEventListener"]("pointerdown", _0x528501 => _0x528501['stopPropagation']());
    const _0x51be3b = document["createElement"]("button");
    _0x51be3b["type"] = 'button';
    _0x51be3b["className"] = "ftb-btn icon-only collage-export-btn";
    const _0xaad6d5 = this["_isExporting"] ? collageText("toolbar.exportBusy") : collageText("toolbar.export");
    _0x51be3b["dataset"]["tooltip"] = _0xaad6d5;
    _0x51be3b["setAttribute"]("aria-label", _0xaad6d5);
    _0x51be3b['disabled'] = this["_isExporting"] || this["_isCompositing"];
    _0x51be3b["appendChild"](createSvgIcon(["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", 'M12\x2015V3']));
    const _0x4aa5c0 = document["createElement"]("div");
    _0x4aa5c0["className"] = "collage-menu collage-export-menu";
    for (const _0x2892c7 of COLLAGE_EXPORT_RESOLUTIONS) {
      const _0x3e00e1 = document["createElement"]("button");
      _0x3e00e1['type'] = 'button';
      _0x3e00e1["className"] = "collage-export-option";
      _0x3e00e1['textContent'] = _0x2892c7["label"];
      _0x3e00e1["setAttribute"]("aria-label", collageText("export.optionAria", {
        'label': _0x2892c7["label"]
      }));
      _0x3e00e1['addEventListener']("click", _0x2a5edc => {
        _0x2a5edc['stopPropagation']();
        this["_exportCollage"](_0x2892c7['longSide']);
      });
      _0x4aa5c0['appendChild'](_0x3e00e1);
    }
    _0x51be3b["addEventListener"]("click", _0xa76f04 => {
      _0xa76f04['stopPropagation']();
      this["_toggleMenu"](_0x4aa5c0);
    });
    this["_registerMenu"](_0x4aa5c0, _0x25165f, "export");
    _0x25165f["appendChild"](_0x51be3b);
    _0x25165f["appendChild"](_0x4aa5c0);
    return _0x25165f;
  }
  ["_getCollapseIconPath"]() {
    return this["_isCollapsed"] ? "M6 9l6 6 6-6" : "M18 15l-6-6-6 6";
  }
  ['_createCollapseButton']() {
    const _0x11b514 = document["createElement"]("button");
    _0x11b514["type"] = "button";
    _0x11b514["className"] = 'ftb-btn\x20icon-only\x20collage-collapse-btn';
    const _0x23373c = this["_isCollapsed"] ? collageText('toolbar.expand') : collageText("toolbar.collapse");
    _0x11b514["dataset"]["tooltip"] = _0x23373c;
    _0x11b514["setAttribute"]('aria-label', _0x23373c);
    _0x11b514["appendChild"](createSvgIcon([this["_getCollapseIconPath"]()]));
    _0x11b514["addEventListener"]("pointerdown", _0x33059f => _0x33059f["stopPropagation"]());
    _0x11b514["addEventListener"]("dblclick", _0x2e5a62 => _0x2e5a62["stopPropagation"]());
    _0x11b514["addEventListener"]("click", _0x36d4b6 => {
      _0x36d4b6['stopPropagation']();
      _0x36d4b6["currentTarget"]?.['blur']?.();
      this["_toggleCollapse"](!this["_isCollapsed"]);
    });
    return _0x11b514;
  }
  ["_registerMenu"](_0x123e6d, _0x144907, _0x4d181c) {
    _0x123e6d["dataset"]["collageMenuKey"] = _0x4d181c;
    if (this['_openMenuKey'] === _0x4d181c) {
      _0x123e6d["classList"]["add"]("show");
    }
    this["_addOutsideMenuListener"](_0x123e6d, _0x144907);
  }
  ["_addOutsideMenuListener"](_0x4747f4, _0x185b5c) {
    const _0xa51d80 = _0x5bbfeb => {
      if (_0x4747f4['contains'](_0x5bbfeb["target"]) || _0x185b5c["contains"](_0x5bbfeb["target"])) {
        return;
      }
      if (!_0x4747f4['classList']['contains']("show")) {
        return;
      }
      _0x4747f4["classList"]["remove"]('show');
      this['_openMenuKey'] === _0x4747f4["dataset"]['collageMenuKey'] && (this["_openMenuKey"] = '');
    };
    window["addEventListener"]("pointerdown", _0xa51d80);
    this["_menuOutsideListeners"]['push'](_0xa51d80);
  }
  ["_removeMenuOutsideListeners"]() {
    for (const _0x43bebd of this['_menuOutsideListeners']) {
      window['removeEventListener']("pointerdown", _0x43bebd);
    }
    this["_menuOutsideListeners"] = [];
  }
  ["_closeMenus"]({
    clearKey = !![]
  } = {}) {
    this['el']["querySelectorAll"](".collage-menu.show")["forEach"](_0x1a0107 => _0x1a0107['classList']['remove']("show"));
    if (clearKey) {
      this["_openMenuKey"] = '';
    }
  }
  ["_toggleMenu"](_0x258da8) {
    const _0x320949 = _0x258da8["classList"]["contains"]("show");
    this["_closeMenus"]({
      'clearKey': ![]
    });
    if (_0x320949) {
      this["_openMenuKey"] = '';
      return;
    }
    this["_openMenuKey"] = _0x258da8['dataset']['collageMenuKey'] || '';
    _0x258da8["classList"]["add"]("show");
  }
  ["_syncBoardBackground"]() {
    const _0x9a703 = getCollageBackgroundOption(this["_data"]["backgroundColor"]);
    this["_boardEl"] && (this['_boardEl']["dataset"]["collageBackground"] = _0x9a703['id']);
  }
  ["_syncRootState"]() {
    this['el']["classList"]["toggle"]("is-editing-mode", this["_isEditing"]);
    this['el']['classList']["toggle"]("is-collapsed", this["_isCollapsed"]);
  }
  ["_syncToolbarState"]() {
    const _0xad7624 = this["_toolbarEl"] || this['el']["querySelector"](".collage-toolbar");
    if (!_0xad7624) {
      return;
    }
    const _0x2be5b9 = _0xad7624["querySelector"](".collage-edit-btn");
    if (_0x2be5b9) {
      _0x2be5b9['classList']["toggle"]("active", this["_isEditing"]);
      const _0x492be1 = this['_isEditing'] ? collageText('toolbar.exitEdit') : collageText("toolbar.edit");
      _0x2be5b9["dataset"]["tooltip"] = _0x492be1;
      _0x2be5b9["setAttribute"]("aria-label", _0x492be1);
    }
    const _0x19df82 = getCollageAspectRatioOption(this['_data']["aspectRatio"]);
    const _0x5b8893 = _0xad7624["querySelector"](".collage-ratio-trigger span");
    _0x5b8893 && (_0x5b8893['textContent'] = _0x19df82?.["label"] || collageText("ratio.fallback"));
    _0xad7624["querySelectorAll"]('.collage-ratio-option')["forEach"](_0x1cc2f9 => {
      _0x1cc2f9["classList"]["toggle"]('is-active', _0x1cc2f9["dataset"]['collageRatio'] === _0x19df82?.["label"]);
    });
    _0xad7624["querySelectorAll"](".collage-template-option")["forEach"](_0x4789c6 => {
      _0x4789c6["classList"]["toggle"]('is-active', _0x4789c6['dataset']["collagePresetId"] === this["_data"]["layoutPresetId"]);
    });
    const _0x172ebc = getCollageBackgroundOption(this["_data"]["backgroundColor"]);
    const _0x464770 = _0xad7624["querySelector"](".collage-bg-dot");
    if (_0x464770) {
      _0x464770["dataset"]["collageBackground"] = _0x172ebc['id'];
    }
    _0xad7624["querySelectorAll"](".collage-bg-option")["forEach"](_0x32a288 => {
      _0x32a288["classList"]["toggle"]("is-active", _0x32a288["dataset"]["collageBackground"] === _0x172ebc['id']);
    });
    const _0x3cd6ca = getCollageLayoutStyle(this["_data"]);
    _0xad7624['querySelectorAll'](".collage-range-wrap")["forEach"](_0x1adb0f => {
      const _0x522c61 = _0x1adb0f["dataset"]['collageRangeField'];
      if (!_0x522c61 || !(_0x522c61 in _0x3cd6ca)) {
        return;
      }
      const _0x63933a = _0x3cd6ca[_0x522c61];
      const _0x5d44e1 = _0x1adb0f["querySelector"](".collage-range-value");
      const _0x38fdee = _0x1adb0f['querySelector']('input[type=\x22range\x22]');
      if (_0x5d44e1) {
        _0x5d44e1["textContent"] = String(_0x63933a);
      }
      if (_0x38fdee && _0x38fdee['value'] !== String(_0x63933a)) {
        _0x38fdee["value"] = String(_0x63933a);
      }
    });
    const _0x5e58d7 = _0xad7624['querySelector']('.collage-compose-btn');
    if (_0x5e58d7) {
      _0x5e58d7['disabled'] = this['_isExporting'] || this["_isCompositing"];
      const _0x45461c = this["_isCompositing"] ? collageText('toolbar.composeBusy') : collageText("toolbar.compose");
      _0x5e58d7['dataset']["tooltip"] = _0x45461c;
      _0x5e58d7["setAttribute"]("aria-label", _0x45461c);
    }
    const _0x4a3609 = _0xad7624["querySelector"](".collage-export-btn");
    if (_0x4a3609) {
      _0x4a3609["disabled"] = this["_isExporting"] || this["_isCompositing"];
      const _0x40b8f5 = this["_isExporting"] ? collageText("toolbar.exportBusy") : collageText("toolbar.export");
      _0x4a3609["dataset"]["tooltip"] = _0x40b8f5;
      _0x4a3609["setAttribute"]('aria-label', _0x40b8f5);
    }
    const _0x4fd091 = _0xad7624["querySelector"]('.collage-collapse-btn');
    if (_0x4fd091) {
      const _0x507360 = this["_isCollapsed"] ? collageText("toolbar.expand") : collageText('toolbar.collapse');
      _0x4fd091['dataset']["tooltip"] = _0x507360;
      _0x4fd091['setAttribute']('aria-label', _0x507360);
      const _0x212e14 = _0x4fd091["querySelector"]("svg path");
      _0x212e14?.['setAttribute']('d', this['_getCollapseIconPath']());
    }
  }
  ["_syncDividerLayer"]() {
    const _0x420cb0 = this["_boardEl"]?.["querySelector"]?.(".collage-preview-layer");
    if (!_0x420cb0) {
      return;
    }
    _0x420cb0["querySelectorAll"]('.collage-divider-layer')["forEach"](_0x371bf6 => _0x371bf6["remove"]());
    if (!this["_isEditing"]) {
      return;
    }
    _0x420cb0['appendChild'](this['_createDividerLayer'](toPositiveNumber(this['_data']['width'], 0x1), toPositiveNumber(this['_data']['height'], 0x1)));
  }
  ["_syncDividerGeometry"]() {
    const _0x3915c8 = this["_boardEl"]?.['querySelector']?.(".collage-preview-layer");
    if (!_0x3915c8) {
      return;
    }
    if (!this["_isEditing"]) {
      _0x3915c8["querySelectorAll"]('.collage-divider-layer')["forEach"](_0x38bb56 => _0x38bb56["remove"]());
      return;
    }
    const _0x6974de = _0x3915c8["querySelector"]('.collage-divider-layer');
    if (!_0x6974de) {
      this["_syncDividerLayer"]();
      return;
    }
    const _0x535768 = resolveCollageEditableDividers(this["_data"]);
    const _0x5ee114 = Array["from"](_0x6974de["querySelectorAll"](".collage-divider-handle"));
    if (_0x535768["length"] !== _0x5ee114['length']) {
      this["_syncDividerLayer"]();
      return;
    }
    const _0x38ba96 = toPositiveNumber(this["_data"]["width"], 0x1);
    const _0x358701 = toPositiveNumber(this["_data"]["height"], 0x1);
    _0x535768['forEach']((_0x1da455, _0x41a470) => {
      this['_applyDividerHandleGeometry'](_0x5ee114[_0x41a470], _0x1da455, _0x38ba96, _0x358701);
    });
  }
  ["_syncEditingState"]() {
    this["_syncRootState"]();
    this['el']["querySelectorAll"]('.collage-item')["forEach"](_0x210688 => _0x210688["classList"]["toggle"]("is-editable", this["_isEditing"]));
    this["_syncDividerLayer"]();
    this["_syncToolbarState"]();
  }
  ["_setComposeButtonBusy"](_0x52ef35) {
    if (!_0x52ef35) {
      return null;
    }
    const _0x1018bc = Array["from"](_0x52ef35["childNodes"])['map'](_0x26f51c => _0x26f51c["cloneNode"](!![]));
    const _0x3a7007 = _0x52ef35["dataset"]["tooltip"];
    const _0x4a25c8 = _0x52ef35["getAttribute"]("aria-label");
    _0x52ef35['replaceChildren']();
    _0x52ef35["dataset"]["tooltip"] = collageText("toolbar.composeBusyEllipsis");
    _0x52ef35["setAttribute"]("aria-label", collageText("toolbar.composeBusy"));
    _0x52ef35['disabled'] = !![];
    const _0x50b148 = createSvgIcon(['M21\x2012a9\x209\x200\x201\x201-6.219-8.56']);
    _0x50b148["classList"]["add"]("v2-spinning");
    _0x50b148['setAttribute']("width", '14');
    _0x50b148['setAttribute']('height', '14');
    _0x52ef35["appendChild"](_0x50b148);
    return () => {
      _0x52ef35["replaceChildren"](..._0x1018bc["map"](_0x119e90 => _0x119e90["cloneNode"](!![])));
      _0x52ef35["dataset"]["tooltip"] = _0x3a7007 || collageText("toolbar.compose");
      _0x52ef35["setAttribute"]('aria-label', _0x4a25c8 || collageText("toolbar.compose"));
      _0x52ef35["disabled"] = ![];
    };
  }
  ['_toggleEdit'](_0x2f4958) {
    const _0x25d7d7 = !!_0x2f4958;
    if (_0x25d7d7 && this["_isCollapsed"]) {
      this["_toggleCollapse"](![]);
      return;
    }
    this["_isEditing"] = _0x25d7d7;
    this['_data'] = {
      ...this['_data'],
      'isEditing': _0x25d7d7
    };
    this["_syncEditingState"]();
    a385_0x56f43f["updateNodeData"](this['id'], {
      'isEditing': _0x25d7d7
    });
  }
  ["_toggleCollapse"](_0x57fea8) {
    const _0x26eccb = buildCollageCollapsePatch(this["_data"], _0x57fea8);
    this["_data"] = {
      ...this["_data"],
      ..._0x26eccb
    };
    this["_isCollapsed"] = !!_0x26eccb['isCollapsed'];
    this["_isEditing"] = !!this["_data"]["isEditing"];
    this["_syncRootState"]();
    this['_syncToolbarState']();
    a385_0x56f43f["updateNodeData"](this['id'], _0x26eccb);
  }
  ['_setBackgroundColor'](_0x12725b) {
    const _0x491c9f = normalizeCollageBackgroundColor(_0x12725b);
    this["_data"] = {
      ...this["_data"],
      'backgroundColor': _0x491c9f
    };
    this['_syncBoardBackground']();
    this['_syncToolbarState']();
    a385_0x56f43f['updateNodeData'](this['id'], {
      'backgroundColor': _0x491c9f
    });
    commit();
  }
  ["_refreshPreviewLayer"]() {
    if (!this['_boardEl']) {
      return;
    }
    this['_highlightedSlotIndex'] = -0x1;
    this['_boardEl']["querySelectorAll"](".collage-preview-layer")["forEach"](_0x4ea8c6 => _0x4ea8c6["remove"]());
    this["_boardEl"]['appendChild'](this["_createPreviewLayer"]());
    this["_previewSignature"] = this['_getPreviewSignature']();
    this["_syncEditingState"]();
  }
  ["_applyTileFrame"](_0x211c1c, _0x45e4e9, _0x1f1933, _0x3b89ad, _0x4db61b) {
    if (!_0x211c1c || !_0x45e4e9) {
      return;
    }
    _0x211c1c["style"]["left"] = _0x45e4e9['x'] / _0x1f1933 * 0x64 + '%';
    _0x211c1c["style"]['top'] = _0x45e4e9['y'] / _0x3b89ad * 0x64 + '%';
    _0x211c1c['style']["width"] = _0x45e4e9["width"] / _0x1f1933 * 0x64 + '%';
    _0x211c1c['style']["height"] = _0x45e4e9['height'] / _0x3b89ad * 0x64 + '%';
    _0x211c1c["style"]['borderRadius'] = _0x4db61b + 'px';
  }
  ["_syncTileContent"](_0x32875c, _0x441528, _0x5a7126, _0x2a1e26, _0x425e9a) {
    if (!_0x32875c) {
      return;
    }
    _0x32875c['dataset']["collageSlotIndex"] = String(_0x5a7126);
    _0x32875c["classList"]['toggle']("is-empty", _0x2a1e26);
    _0x32875c['classList']["toggle"]("is-editable", this["_isEditing"]);
    const _0x53dfea = resolveCollageItemPreviewUrl(_0x441528);
    if (_0x53dfea && !_0x2a1e26) {
      let _0x2fb291 = _0x32875c['querySelector'](".collage-item-img");
      !_0x2fb291 ? (_0x32875c["replaceChildren"](), _0x2fb291 = document['createElement']("img"), _0x2fb291["className"] = "collage-item-img", _0x2fb291["decoding"] = "async", _0x2fb291["loading"] = "eager", _0x32875c["appendChild"](_0x2fb291)) : _0x32875c["querySelectorAll"]('.collage-slot-empty')['forEach'](_0x1c47c1 => _0x1c47c1['remove']());
      _0x2fb291["alt"] = _0x441528["label"] || collageText("preview.imageAlt");
      _0x2fb291["dataset"]['collagePreviewUrl'] !== _0x53dfea && (_0x2fb291["dataset"]['collagePreviewUrl'] = _0x53dfea, _0x2fb291["src"] = _0x53dfea);
      this['_applyImagePlacement'](_0x2fb291, _0x441528);
      _0x2fb291["style"]["borderRadius"] = _0x425e9a + 'px';
      return;
    }
    const _0x417b4f = !!_0x32875c["querySelector"]('.collage-slot-empty');
    if (!_0x417b4f || _0x32875c["querySelector"](".collage-item-img")) {
      const _0xf776f9 = document["createElement"]("div");
      _0xf776f9["className"] = "collage-slot-empty";
      _0x32875c["replaceChildren"](_0xf776f9);
    }
  }
  ["_createPreviewTile"]({
    item: _0x58b171,
    index: _0x577cf8,
    frame: _0x2eac85,
    isEmpty: _0x513a83,
    nodeWidth: _0x54398a,
    nodeHeight: _0x1c247f,
    cornerRadius: _0x3a6e21
  }) {
    const _0x59886c = document["createElement"]("div");
    _0x59886c["className"] = "collage-item";
    this["_applyTileFrame"](_0x59886c, _0x2eac85, _0x54398a, _0x1c247f, _0x3a6e21);
    _0x59886c["addEventListener"]("pointerdown", _0x193936 => this['_beginImageDrag'](_0x193936, _0x577cf8));
    _0x59886c["addEventListener"]('wheel', _0x26463b => this["_handleItemWheel"](_0x26463b, _0x577cf8), {
      'passive': ![]
    });
    this["_syncTileContent"](_0x59886c, _0x58b171, _0x577cf8, _0x513a83, _0x3a6e21);
    return _0x59886c;
  }
  ['_syncPreviewLayer']({
    updateSignature = !![]
  } = {}) {
    const _0x4cda9c = this['_boardEl']?.["querySelector"]?.(".collage-preview-layer");
    if (!_0x4cda9c) {
      this["_refreshPreviewLayer"]();
      return;
    }
    const _0x3bde72 = resolveCollageItemFrames(this["_data"]);
    if (_0x3bde72["length"] === 0x0) {
      this["_refreshPreviewLayer"]();
      return;
    }
    const _0x3ad246 = toPositiveNumber(this["_data"]['width'], 0x1);
    const _0x3fc813 = toPositiveNumber(this['_data']["height"], 0x1);
    const {
      cornerRadius: _0x2817a0
    } = getCollageLayoutStyle(this['_data']);
    const _0x303a06 = new Map(Array["from"](_0x4cda9c["querySelectorAll"](".collage-item"))['map'](_0x325e76 => [Number(_0x325e76["dataset"]["collageSlotIndex"]), _0x325e76]));
    const _0x3afd49 = new Set();
    _0x4cda9c["querySelectorAll"](".collage-empty, .collage-divider-layer, .collage-collapsed-badge")["forEach"](_0x1d3b38 => _0x1d3b38["remove"]());
    for (const {
      item: _0x44aa65,
      index: _0x3db2c2,
      frame: _0x5cd9b6,
      isEmpty: _0x2894ff
    } of _0x3bde72) {
      _0x3afd49['add'](_0x3db2c2);
      let _0x2c726a = _0x303a06["get"](_0x3db2c2);
      !_0x2c726a ? _0x2c726a = this["_createPreviewTile"]({
        'item': _0x44aa65,
        'index': _0x3db2c2,
        'frame': _0x5cd9b6,
        'isEmpty': _0x2894ff,
        'nodeWidth': _0x3ad246,
        'nodeHeight': _0x3fc813,
        'cornerRadius': _0x2817a0
      }) : (this['_applyTileFrame'](_0x2c726a, _0x5cd9b6, _0x3ad246, _0x3fc813, _0x2817a0), this["_syncTileContent"](_0x2c726a, _0x44aa65, _0x3db2c2, _0x2894ff, _0x2817a0));
      _0x4cda9c["appendChild"](_0x2c726a);
    }
    for (const [_0x265b0a, _0x1a317c] of _0x303a06) {
      if (!_0x3afd49["has"](_0x265b0a)) {
        _0x1a317c["remove"]();
      }
    }
    this['_isEditing'] && _0x4cda9c["appendChild"](this["_createDividerLayer"](_0x3ad246, _0x3fc813));
    this['_appendCollapsedBadge'](_0x4cda9c);
    this["_highlightedSlotIndex"] >= 0x0 && this["_getTileByIndex"](this['_highlightedSlotIndex'])?.["classList"]["add"]("is-drop-highlight");
    if (updateSignature) {
      this["_previewSignature"] = this["_getPreviewSignature"]();
    }
    this["_syncRootState"]();
    this['_syncToolbarState']();
  }
  ["_syncPreviewLayoutStyle"]({
    updateSignature = !![]
  } = {}) {
    const _0x2fca75 = this["_boardEl"]?.["querySelector"]?.(".collage-preview-layer");
    if (!_0x2fca75) {
      this["_refreshPreviewLayer"]();
      return;
    }
    const _0x407df7 = resolveCollageItemFrames(this["_data"]);
    const _0x4e539b = Array["from"](_0x2fca75['querySelectorAll']('.collage-item'));
    if (_0x407df7['length'] !== _0x4e539b["length"]) {
      this["_refreshPreviewLayer"]();
      return;
    }
    const _0x5b12db = toPositiveNumber(this["_data"]["width"], 0x1);
    const _0x3531cc = toPositiveNumber(this["_data"]["height"], 0x1);
    const {
      cornerRadius: _0x11f2cc
    } = getCollageLayoutStyle(this['_data']);
    const _0x12900a = new Map(_0x407df7["map"](_0x48b7cc => [Number(_0x48b7cc['index']), _0x48b7cc["frame"]]));
    for (const _0x5edd78 of _0x4e539b) {
      const _0x102b8e = Number(_0x5edd78['dataset']['collageSlotIndex']);
      const _0x20ec3d = _0x12900a['get'](_0x102b8e);
      if (!_0x20ec3d) {
        this["_refreshPreviewLayer"]();
        return;
      }
      this['_applyTileFrame'](_0x5edd78, _0x20ec3d, _0x5b12db, _0x3531cc, _0x11f2cc);
      const _0x480641 = _0x5edd78["querySelector"]('.collage-item-img');
      if (_0x480641) {
        _0x480641['style']['borderRadius'] = _0x11f2cc + 'px';
      }
    }
    this["_syncDividerGeometry"]();
    if (updateSignature) {
      this["_previewSignature"] = this["_getPreviewSignature"]();
    }
  }
  ["_createPreviewLayer"]() {
    const _0x16f216 = document["createElement"]('div');
    _0x16f216["className"] = "collage-preview-layer";
    const _0xa6013b = resolveCollageItemFrames(this["_data"]);
    if (_0xa6013b["length"] === 0x0) {
      const _0x4e0a7c = document['createElement']('div');
      _0x4e0a7c["className"] = "collage-empty";
      _0x4e0a7c["textContent"] = collageText("preview.empty");
      _0x16f216["appendChild"](_0x4e0a7c);
      this["_appendCollapsedBadge"](_0x16f216);
      return _0x16f216;
    }
    const _0x3a7aa0 = toPositiveNumber(this["_data"]['width'], 0x1);
    const _0x2c9403 = toPositiveNumber(this['_data']["height"], 0x1);
    const {
      cornerRadius: _0x3a8271
    } = getCollageLayoutStyle(this['_data']);
    for (const {
      item: _0xc45f3b,
      index: _0x14abd7,
      frame: _0x145a6e,
      isEmpty: _0x191baf
    } of _0xa6013b) {
      const _0x37e9b2 = this["_createPreviewTile"]({
        'item': _0xc45f3b,
        'index': _0x14abd7,
        'frame': _0x145a6e,
        'isEmpty': _0x191baf,
        'nodeWidth': _0x3a7aa0,
        'nodeHeight': _0x2c9403,
        'cornerRadius': _0x3a8271
      });
      _0x16f216["appendChild"](_0x37e9b2);
    }
    this['_isEditing'] && _0x16f216["appendChild"](this["_createDividerLayer"](_0x3a7aa0, _0x2c9403));
    this["_appendCollapsedBadge"](_0x16f216);
    return _0x16f216;
  }
  ['_appendCollapsedBadge'](_0x4865b2) {
    if (!this["_isCollapsed"] || !_0x4865b2) {
      return;
    }
    _0x4865b2["appendChild"](this['_createCollapsedBadge']());
  }
  ["_createCollapsedBadge"]() {
    const _0x34867a = document["createElement"]("button");
    _0x34867a['type'] = "button";
    _0x34867a["className"] = 'collage-collapsed-badge';
    _0x34867a["dataset"]["tooltip"] = collageText('toolbar.expand');
    _0x34867a["setAttribute"]('aria-label', collageText("preview.expandAria"));
    _0x34867a['appendChild'](createSvgIcon(['M3\x203h7v7H3z', "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"]));
    const _0x1eada6 = document["createElement"]("span");
    const _0x196d3d = Array["isArray"](this['_data']["items"]) ? this["_data"]["items"]["length"] : 0x0;
    _0x1eada6["textContent"] = String(_0x196d3d);
    _0x34867a["appendChild"](_0x1eada6);
    _0x34867a["addEventListener"]("pointerdown", _0x50266c => _0x50266c['stopPropagation']());
    _0x34867a["addEventListener"]("dblclick", _0x57c18f => _0x57c18f["stopPropagation"]());
    _0x34867a["addEventListener"]("click", _0xc343cb => {
      _0xc343cb["stopPropagation"]();
      this["_toggleCollapse"](![]);
    });
    return _0x34867a;
  }
  ["_applyImagePlacement"](_0x186a03, _0x16ee65) {
    if (!_0x186a03) {
      return;
    }
    const _0x3e1466 = clamp01(_0x16ee65?.['focusX']);
    const _0x3a92a8 = clamp01(_0x16ee65?.['focusY']);
    const _0xa3bbe8 = normalizeCollageImageScale(_0x16ee65?.['imageScale']);
    _0x186a03["style"]["objectPosition"] = _0x3e1466 * 0x64 + '%\x20' + _0x3a92a8 * 0x64 + '%';
    _0x186a03['style']["transform"] = 'scale(' + _0xa3bbe8 + ')';
    _0x186a03['style']['transformOrigin'] = _0x3e1466 * 0x64 + '%\x20' + _0x3a92a8 * 0x64 + '%';
  }
  ["_createDividerLayer"](_0x32a5cc, _0x300aaa) {
    const _0x4000bd = document["createElement"]("div");
    _0x4000bd["className"] = "collage-divider-layer";
    for (const _0x1f2322 of resolveCollageEditableDividers(this['_data'])) {
      const _0x25c981 = document['createElement']('button');
      _0x25c981['type'] = "button";
      _0x25c981["className"] = "collage-divider-handle " + (_0x1f2322["axis"] === 'x' ? "is-vertical" : "is-horizontal");
      _0x25c981["setAttribute"]('aria-label', collageText("preview.dividerAria"));
      _0x25c981["addEventListener"]("pointerdown", _0x381415 => this["_beginDividerDrag"](_0x381415, _0x1f2322));
      this["_applyDividerHandleGeometry"](_0x25c981, _0x1f2322, _0x32a5cc, _0x300aaa);
      _0x4000bd["appendChild"](_0x25c981);
    }
    return _0x4000bd;
  }
  ["_applyDividerHandleGeometry"](_0x3f638f, _0x4d69a9, _0x3ac951 = toPositiveNumber(this['_data']["width"], 0x1), _0x327bf8 = toPositiveNumber(this['_data']["height"], 0x1)) {
    if (!_0x3f638f || !_0x4d69a9) {
      return;
    }
    const {
      outerPadding: _0x58be0e
    } = getCollageLayoutStyle(this["_data"]);
    const _0x2b0a36 = Math["min"](_0x58be0e, Math["max"](0x0, _0x3ac951 * 0.45), Math["max"](0x0, _0x327bf8 * 0.45));
    const _0xb2cd5b = Math["max"](0x1, _0x3ac951 - _0x2b0a36 * 0x2);
    const _0x336a99 = Math["max"](0x1, _0x327bf8 - _0x2b0a36 * 0x2);
    const _0x3d6909 = _0xb2cd5b / _0x3ac951;
    const _0x371d39 = _0x336a99 / _0x327bf8;
    if (_0x4d69a9["axis"] === 'x') {
      const _0x36cabc = _0x2b0a36 + (Number(_0x4d69a9["position"]) || 0x0) * _0x3d6909;
      const _0x61ca4f = _0x2b0a36 + (Number(_0x4d69a9["spanStart"]) || 0x0) * _0x371d39;
      const _0x570bf9 = _0x2b0a36 + (Number(_0x4d69a9["spanEnd"]) || 0x0) * _0x371d39;
      _0x3f638f['style']["left"] = "calc(" + _0x36cabc / _0x3ac951 * 0x64 + '%\x20-\x20var(--collage-divider-hit-offset))';
      _0x3f638f["style"]["top"] = _0x61ca4f / _0x327bf8 * 0x64 + '%';
      _0x3f638f["style"]['width'] = "var(--collage-divider-hit-size)";
      _0x3f638f['style']['height'] = Math['max'](0x1, _0x570bf9 - _0x61ca4f) / _0x327bf8 * 0x64 + '%';
    } else {
      const _0x839543 = _0x2b0a36 + (Number(_0x4d69a9["position"]) || 0x0) * _0x371d39;
      const _0x1bca86 = _0x2b0a36 + (Number(_0x4d69a9["spanStart"]) || 0x0) * _0x3d6909;
      const _0x5e7be5 = _0x2b0a36 + (Number(_0x4d69a9["spanEnd"]) || 0x0) * _0x3d6909;
      _0x3f638f["style"]["left"] = _0x1bca86 / _0x3ac951 * 0x64 + '%';
      _0x3f638f["style"]["top"] = 'calc(' + _0x839543 / _0x327bf8 * 0x64 + '%\x20-\x20var(--collage-divider-hit-offset))';
      _0x3f638f["style"]["width"] = Math['max'](0x1, _0x5e7be5 - _0x1bca86) / _0x3ac951 * 0x64 + '%';
      _0x3f638f["style"]["height"] = "var(--collage-divider-hit-size)";
    }
  }
  ["_getItemsCopy"]() {
    return (Array['isArray'](this["_data"]["items"]) ? this['_data']["items"] : [])['map'](_0x3f1cbd => ({
      ..._0x3f1cbd
    }));
  }
  ["_setItemAt"](_0x1ce81a, _0x1acc77) {
    const _0x18caf2 = this['_getItemsCopy']();
    if (_0x1ce81a < 0x0 || _0x1ce81a >= _0x18caf2["length"]) {
      return null;
    }
    _0x18caf2[_0x1ce81a] = _0x1acc77;
    this["_data"] = {
      ...this["_data"],
      'items': _0x18caf2
    };
    return _0x18caf2;
  }
  ["_commitItems"]({
    commitHistory = !![]
  } = {}) {
    this["_itemsCommitTimer"] && (clearTimeout(this['_itemsCommitTimer']), this["_itemsCommitTimer"] = null);
    const _0x40e11e = this["_getItemsCopy"]();
    this["_previewSignature"] = this["_getPreviewSignature"]();
    a385_0x56f43f["updateNodeData"](this['id'], {
      'items': _0x40e11e
    });
    if (commitHistory) {
      commit();
    }
  }
  ["_scheduleItemsCommit"]() {
    if (this["_itemsCommitTimer"]) {
      clearTimeout(this["_itemsCommitTimer"]);
    }
    this["_itemsCommitTimer"] = setTimeout(() => {
      this["_itemsCommitTimer"] = null;
      this["_commitItems"]();
    }, 0xa0);
  }
  ["_getTileByIndex"](_0x5aebeb) {
    return this['el']["querySelector"](".collage-item[data-collage-slot-index=\"" + _0x5aebeb + '\x22]');
  }
  ['_applyTileGeometry'](_0x124794, _0x1f19d7 = null) {
    const _0x15028b = this["_getTileByIndex"](_0x124794);
    if (!_0x15028b) {
      return;
    }
    const _0x3c62b7 = Array["isArray"](_0x1f19d7) ? _0x1f19d7 : resolveCollageItemFrames(this['_data']);
    const _0x3d6962 = _0x3c62b7["find"](_0x3b9b4f => _0x3b9b4f["index"] === _0x124794);
    if (!_0x3d6962) {
      return;
    }
    const _0x1f4159 = toPositiveNumber(this['_data']["width"], 0x1);
    const _0x1cc040 = toPositiveNumber(this["_data"]["height"], 0x1);
    const {
      frame: _0xa988fe
    } = _0x3d6962;
    _0x15028b["style"]["left"] = _0xa988fe['x'] / _0x1f4159 * 0x64 + '%';
    _0x15028b["style"]["top"] = _0xa988fe['y'] / _0x1cc040 * 0x64 + '%';
    _0x15028b["style"]["width"] = _0xa988fe["width"] / _0x1f4159 * 0x64 + '%';
    _0x15028b["style"]["height"] = _0xa988fe['height'] / _0x1cc040 * 0x64 + '%';
  }
  ["_applyTileImagePlacement"](_0x31e03e) {
    const _0x5059fd = this["_getTileByIndex"](_0x31e03e);
    const _0x2fef71 = _0x5059fd?.["querySelector"]?.(".collage-item-img");
    const _0x40fe59 = (this["_data"]['items'] || [])[_0x31e03e];
    this['_applyImagePlacement'](_0x2fef71, _0x40fe59);
  }
  ["_collectSlotHitRects"]({
    excludeIndex = -0x1
  } = {}) {
    const _0x4ee68d = Array["from"](this['el']["querySelectorAll"](".collage-item"));
    return _0x4ee68d["map"](_0x2bbbbb => {
      const _0x261e96 = Number(_0x2bbbbb['dataset']["collageSlotIndex"]);
      if (!Number["isInteger"](_0x261e96) || _0x261e96 === excludeIndex) {
        return null;
      }
      const _0x1263a7 = _0x2bbbbb["getBoundingClientRect"]?.();
      if (!_0x1263a7) {
        return null;
      }
      return {
        'slotIndex': _0x261e96,
        'left': _0x1263a7["left"],
        'top': _0x1263a7["top"],
        'right': _0x1263a7["right"],
        'bottom': _0x1263a7["bottom"]
      };
    })["filter"](Boolean);
  }
  ["_getSlotIndexAtClientPoint"](_0x4afe41, _0x3d6b70, {
    excludeIndex = -0x1,
    slotHitRects = null
  } = {}) {
    if (!Number["isFinite"](_0x4afe41) || !Number["isFinite"](_0x3d6b70)) {
      return -0x1;
    }
    const _0x5895b4 = Array["isArray"](slotHitRects) ? slotHitRects : this["_collectSlotHitRects"]({
      'excludeIndex': excludeIndex
    });
    for (let _0x92bdcc = _0x5895b4["length"] - 0x1; _0x92bdcc >= 0x0; _0x92bdcc -= 0x1) {
      const _0x2e7d46 = _0x5895b4[_0x92bdcc];
      if (!_0x2e7d46 || _0x2e7d46["slotIndex"] === excludeIndex) {
        continue;
      }
      if (_0x4afe41 >= _0x2e7d46["left"] && _0x4afe41 <= _0x2e7d46["right"] && _0x3d6b70 >= _0x2e7d46["top"] && _0x3d6b70 <= _0x2e7d46["bottom"]) {
        return _0x2e7d46["slotIndex"];
      }
    }
    return -0x1;
  }
  ["_swapImageItemIntoSlot"](_0x4144ff, _0x5d9269) {
    const _0x2ef21e = buildCollageItemSwapPatch(this["_data"], _0x4144ff, _0x5d9269);
    if (!_0x2ef21e) {
      return ![];
    }
    this["_data"] = {
      ...this["_data"],
      'items': _0x2ef21e["items"]
    };
    this["_syncPreviewLayer"]();
    this["_commitItems"]();
    return !![];
  }
  ['_createImageDragGhost'](_0x28e5eb, _0x4b0054, _0x1fe81b, _0x50ba6d, {
    hidden = ![]
  } = {}) {
    if (typeof document === 'undefined' || !document["body"] || !_0x28e5eb) {
      return null;
    }
    const _0x4431e4 = _0x28e5eb["getBoundingClientRect"]?.();
    const _0x4dd210 = resolveCollageItemSourceImage(_0x4b0054);
    const _0x359834 = _0x28e5eb["querySelector"](".collage-item-img");
    const _0x484d83 = toPositiveNumber(_0x359834?.['naturalWidth'], 0x0);
    const _0xe9170 = toPositiveNumber(_0x359834?.["naturalHeight"], 0x0);
    const _0xb24b45 = (_0x4dd210["hasIntrinsicSize"] ? _0x4dd210['width'] : 0x0) || _0x484d83;
    const _0x54002d = (_0x4dd210["hasIntrinsicSize"] ? _0x4dd210["height"] : 0x0) || _0xe9170;
    const _0x3a2454 = _0xb24b45 > 0x0 && _0x54002d > 0x0 ? _0xb24b45 / _0x54002d : 0x0;
    const _0xd373be = Math["max"](0x1, Math['round'](Number(_0x4431e4?.["width"]) || 0x1));
    const _0x371cbc = Math["max"](0x1, Math["round"](Number(_0x4431e4?.["height"]) || 0x1));
    const _0x8123a2 = typeof a385_0x56f43f["getStateRaw"] === 'function' ? a385_0x56f43f['getStateRaw']() : a385_0x56f43f["getState"]();
    const _0x23e445 = toPositiveNumber(_0x8123a2?.["viewport"]?.["zoom"], 0x1);
    const _0x27c193 = toPositiveNumber(_0x4b0054?.["sourceDisplayWidth"], 0x0);
    const _0x29e8af = toPositiveNumber(_0x4b0054?.["sourceDisplayHeight"], 0x0);
    let _0x53be07 = _0xd373be;
    let _0x3390ac = _0x371cbc;
    if (_0x27c193 > 0x0 && _0x29e8af > 0x0) {
      _0x53be07 = Math["max"](0x1, Math["round"](_0x27c193 * _0x23e445));
      _0x3390ac = Math['max'](0x1, Math["round"](_0x29e8af * _0x23e445));
    } else {
      if (_0x3a2454 > 0x0) {
        const _0x3ca95d = resolveCollageSizeByShortSide({
          'width': _0xb24b45,
          'height': _0x54002d,
          'shortSide': Math['min'](_0xd373be, _0x371cbc)
        });
        _0x53be07 = _0x3ca95d["width"];
        _0x3390ac = _0x3ca95d['height'];
      }
    }
    const _0x41b9dc = document['createElement']("div");
    _0x41b9dc["className"] = "v2-ghost-image collage-drag-ghost";
    Object["assign"](_0x41b9dc["style"], {
      'position': "fixed",
      'left': '0',
      'top': '0',
      'width': _0x53be07 + 'px',
      'height': _0x3390ac + 'px',
      'transform': "translate(" + _0x1fe81b + "px, " + _0x50ba6d + "px) translate(-50%, -50%)",
      'opacity': hidden ? '0' : "0.9",
      'visibility': hidden ? "hidden" : 'visible',
      'pointerEvents': "none",
      'zIndex': "10000",
      'borderRadius': "8px",
      'border': "none",
      'boxShadow': '0\x200\x200\x202px\x20var(--white-80),\x200\x200\x2030px\x200\x20var(--white-40),\x200\x2012px\x2040px\x20var(--black-60)',
      'overflow': "hidden",
      'willChange': "transform, opacity",
      'transition': "none",
      'background': "var(--bg-node)"
    });
    const _0x1b9a65 = _0x4dd210["src"] || _0x4dd210["localPath"] ? document['createElement']("img") : _0x359834?.["cloneNode"](![]) || document["createElement"]("img");
    const _0x3f5ad0 = _0x4dd210["src"] || (_0x4dd210['localPath'] ? '/' + String(_0x4dd210["localPath"])["replace"](/^\/+/, '') : '') || String(_0x4b0054?.["url"] || '')['trim']() || (_0x4b0054?.["localPath"] ? '/' + String(_0x4b0054["localPath"])["replace"](/^\/+/, '') : '') || String(_0x4b0054?.["sourceUrl"] || '')['trim']();
    _0x3f5ad0 && _0x1b9a65["setAttribute"]("src", _0x3f5ad0);
    Object['assign'](_0x1b9a65['style'], {
      'width': '100%',
      'height': '100%',
      'objectFit': _0x4dd210["isOriginalSource"] ? "contain" : 'cover',
      'display': "block",
      'pointerEvents': "none",
      'transition': "none"
    });
    _0x41b9dc["appendChild"](_0x1b9a65);
    document["body"]["appendChild"](_0x41b9dc);
    return _0x41b9dc;
  }
  ["_ensureImageDragGhost"](_0x4d196e, _0x3933e7, _0x3e5202 = {}) {
    if (!_0x4d196e || _0x4d196e['ghostEl']) {
      return _0x4d196e?.["ghostEl"] || null;
    }
    const _0x5c0f8c = (this["_data"]["items"] || [])[_0x4d196e['index']];
    _0x4d196e["ghostEl"] = this["_createImageDragGhost"](_0x4d196e["tile"], _0x5c0f8c, Number(_0x3933e7?.["clientX"]) || _0x4d196e["startClientX"], Number(_0x3933e7?.["clientY"]) || _0x4d196e["startClientY"], _0x3e5202);
    return _0x4d196e['ghostEl'];
  }
  ["_activateImageDragGhost"](_0xe80b05, _0x314307, {
    markSource = ![]
  } = {}) {
    const _0x66ab22 = this["_ensureImageDragGhost"](_0xe80b05, _0x314307);
    if (!_0x66ab22) {
      return null;
    }
    _0xe80b05['ghostActive'] = !![];
    _0x66ab22["style"]["visibility"] = "visible";
    _0x66ab22["style"]["opacity"] = "0.9";
    _0x66ab22["style"]['transition'] = "none";
    _0xe80b05["tile"]?.["classList"]?.['toggle']("is-drag-source", markSource);
    return _0x66ab22;
  }
  ["_moveImageDragGhost"](_0x53e1ee, _0x1929c2, _0x48c8b3) {
    if (!_0x53e1ee?.["ghostEl"]) {
      return;
    }
    _0x53e1ee['ghostEl']['style']["transform"] = 'translate(' + _0x1929c2 + 'px,\x20' + _0x48c8b3 + "px) translate(-50%, -50%)";
  }
  ["_removeImageDragGhost"](_0x466c3e, {
    fade = ![]
  } = {}) {
    const _0x335a38 = _0x466c3e?.["ghostEl"] || null;
    if (!_0x335a38) {
      return;
    }
    fade ? (_0x335a38["style"]["transition"] = "opacity 0.16s cubic-bezier(0.4, 0, 0.2, 1)", _0x335a38["style"]['opacity'] = '0', setTimeout(() => _0x335a38['remove'](), 0xa0)) : _0x335a38["remove"]();
    _0x466c3e && (_0x466c3e['ghostEl'] = null, _0x466c3e["ghostActive"] = ![], _0x466c3e['tile']?.['classList']?.["remove"]("is-drag-source"));
  }
  ["_removeImageDragGhostWhenSourceReady"](_0x14d95e, _0x328d05) {
    if (!_0x14d95e) {
      return;
    }
    const _0x8a108e = () => this["_removeImageDragGhost"]({
      'ghostEl': _0x14d95e
    });
    if (typeof document === 'undefined' || !_0x328d05) {
      _0x8a108e();
      return;
    }
    const _0x18c19d = typeof requestAnimationFrame === "function" ? requestAnimationFrame : _0x4a39c4 => setTimeout(_0x4a39c4, 0x10);
    const _0x51d2c0 = () => typeof performance !== "undefined" && typeof performance["now"] === "function" ? performance['now']() : Date["now"]();
    const _0x102e2f = _0x51d2c0();
    let _0x41c0d9 = 0x0;
    const _0x27efe5 = () => {
      const _0x10f55d = document["getElementById"]?.(_0x328d05);
      const _0x33c577 = _0x10f55d?.["querySelector"]?.("img.node-img");
      const _0x18cd10 = !!_0x33c577 && _0x33c577["style"]['display'] !== "none" && _0x33c577["complete"] === !![] && Number(_0x33c577["naturalWidth"] || 0x0) > 0x0;
      if (_0x18cd10) {
        _0x41c0d9 += 0x1;
        if (_0x41c0d9 >= 0x2) {
          _0x8a108e();
          return;
        }
      } else {
        _0x41c0d9 = 0x0;
      }
      if (_0x51d2c0() - _0x102e2f > 0x4b0) {
        _0x8a108e();
        return;
      }
      _0x18c19d(_0x27efe5);
    };
    _0x18c19d(_0x27efe5);
  }
  ["_beginImageDrag"](_0x4be24c, _0x1dd5f5) {
    if (!this["_isEditing"]) {
      return;
    }
    if (_0x4be24c["target"]?.["closest"]?.(".collage-divider-handle")) {
      return;
    }
    _0x4be24c["preventDefault"]();
    _0x4be24c["stopPropagation"]();
    const _0x41073d = (this["_data"]["items"] || [])[_0x1dd5f5];
    if (!_0x41073d || isCollageItemEmpty(_0x41073d)) {
      return;
    }
    this['_endImageDrag']({
      'shouldCommit': ![]
    });
    const _0x5ede64 = this["_getTileByIndex"](_0x1dd5f5);
    const _0x20ab93 = this["_boardEl"]?.["getBoundingClientRect"]?.();
    const _0x500aa9 = _0x5ede64?.['getBoundingClientRect']?.();
    if (!_0x5ede64 || !_0x20ab93 || !_0x500aa9) {
      return;
    }
    const _0x446909 = _0x1f8ab => this["_updateImageDrag"](_0x1f8ab);
    const _0x3a3477 = _0x149eb4 => this["_endImageDrag"]({
      'event': _0x149eb4
    });
    this['_activeImageDrag'] = {
      'index': _0x1dd5f5,
      'tile': _0x5ede64,
      'boardRect': _0x20ab93,
      'tileRect': _0x500aa9,
      'startClientX': Number(_0x4be24c["clientX"]) || 0x0,
      'startClientY': Number(_0x4be24c["clientY"]) || 0x0,
      'startFocusX': clamp01(_0x41073d['focusX']),
      'startFocusY': clamp01(_0x41073d["focusY"]),
      'imageScale': normalizeCollageImageScale(_0x41073d["imageScale"]),
      'slotHitRects': this["_collectSlotHitRects"]({
        'excludeIndex': _0x1dd5f5
      }),
      'moved': ![],
      'ghostEl': this['_createImageDragGhost'](_0x5ede64, _0x41073d, Number(_0x4be24c["clientX"]) || 0x0, Number(_0x4be24c['clientY']) || 0x0, {
        'hidden': !![]
      }),
      'ghostActive': ![],
      'onMove': _0x446909,
      'onEnd': _0x3a3477
    };
    _0x5ede64['classList']["add"]("is-image-editing");
    try {
      _0x5ede64["setPointerCapture"]?.(_0x4be24c["pointerId"]);
    } catch (_0x56af38) {}
    document["addEventListener"]("pointermove", _0x446909);
    document["addEventListener"]("pointerup", _0x3a3477, {
      'once': !![]
    });
    document["addEventListener"]("pointercancel", _0x3a3477, {
      'once': !![]
    });
  }
  ['_updateImageDrag'](_0x17190e) {
    const _0x1d4f7f = this["_activeImageDrag"];
    if (!_0x1d4f7f) {
      return;
    }
    _0x17190e["preventDefault"]?.();
    const _0x52f896 = Number(_0x17190e["clientX"]) || _0x1d4f7f['startClientX'];
    const _0x341239 = Number(_0x17190e["clientY"]) || _0x1d4f7f['startClientY'];
    const _0x43a722 = _0x52f896 - _0x1d4f7f["startClientX"];
    const _0x45b632 = _0x341239 - _0x1d4f7f["startClientY"];
    if (Math["hypot"](_0x43a722, _0x45b632) > 0x3) {
      _0x1d4f7f["moved"] = !![];
    }
    const _0x5050a6 = Math["hypot"](_0x43a722, _0x45b632);
    const _0x5d2816 = this["_isOutsideRect"](_0x52f896, _0x341239, _0x1d4f7f["tileRect"], 0x2);
    if (_0x1d4f7f["ghostActive"] || _0x1d4f7f["moved"] && _0x5050a6 > COLLAGE_IMAGE_DRAG_OUT_THRESHOLD_PX && _0x5d2816) {
      this["_activateImageDragGhost"](_0x1d4f7f, _0x17190e, {
        'markSource': !![]
      });
      this["_moveImageDragGhost"](_0x1d4f7f, _0x52f896, _0x341239);
      const _0x13cd6b = this["_getSlotIndexAtClientPoint"](_0x52f896, _0x341239, {
        'excludeIndex': _0x1d4f7f["index"],
        'slotHitRects': _0x1d4f7f['slotHitRects']
      });
      this["highlightSlot"](_0x13cd6b);
      return;
    }
    this["highlightSlot"](-0x1);
    const _0x22a959 = Math["max"](0.35, _0x1d4f7f["imageScale"]);
    const _0x456cc8 = clamp01(_0x1d4f7f["startFocusX"] - _0x43a722 / Math["max"](0x1, _0x1d4f7f["tileRect"]["width"]) / _0x22a959);
    const _0x3ea933 = clamp01(_0x1d4f7f["startFocusY"] - _0x45b632 / Math["max"](0x1, _0x1d4f7f["tileRect"]["height"]) / _0x22a959);
    const _0x4b9052 = Array['isArray'](this["_data"]["items"]) ? [...this["_data"]["items"]] : [];
    const _0x53ccd5 = _0x4b9052[_0x1d4f7f["index"]];
    if (!_0x53ccd5) {
      return;
    }
    _0x4b9052[_0x1d4f7f["index"]] = {
      ..._0x53ccd5,
      'focusX': _0x456cc8,
      'focusY': _0x3ea933
    };
    this["_data"] = {
      ...this["_data"],
      'items': _0x4b9052
    };
    this["_applyTileImagePlacement"](_0x1d4f7f["index"]);
    this['_applyImagePlacement'](_0x1d4f7f["ghostEl"]?.["querySelector"]?.(".collage-item-img, img"), _0x4b9052[_0x1d4f7f['index']]);
  }
  ["_endImageDrag"]({
    event = null,
    shouldCommit = !![]
  } = {}) {
    const _0x835416 = this["_activeImageDrag"];
    if (!_0x835416) {
      return;
    }
    document["removeEventListener"]('pointermove', _0x835416["onMove"]);
    document["removeEventListener"]("pointerup", _0x835416['onEnd']);
    document["removeEventListener"]("pointercancel", _0x835416["onEnd"]);
    _0x835416["tile"]?.['classList']?.["remove"]("is-image-editing");
    _0x835416["tile"]?.["classList"]?.["remove"]("is-drag-source");
    this["highlightSlot"](-0x1);
    this["_activeImageDrag"] = null;
    if (!shouldCommit) {
      this["_removeImageDragGhost"](_0x835416);
      return;
    }
    const _0x47a3cf = Number(event?.["clientX"]);
    const _0x5308fb = Number(event?.["clientY"]);
    const _0x31a41d = Math["hypot"]((Number["isFinite"](_0x47a3cf) ? _0x47a3cf : _0x835416["startClientX"]) - _0x835416["startClientX"], (Number["isFinite"](_0x5308fb) ? _0x5308fb : _0x835416["startClientY"]) - _0x835416['startClientY']);
    const _0x3552ae = Number["isFinite"](_0x47a3cf) && Number['isFinite'](_0x5308fb) && this["_isOutsideBoard"](_0x47a3cf, _0x5308fb);
    const _0x142bff = _0x835416["ghostActive"] && Number['isFinite'](_0x47a3cf) && Number["isFinite"](_0x5308fb) ? this["_getSlotIndexAtClientPoint"](_0x47a3cf, _0x5308fb, {
      'excludeIndex': _0x835416["index"],
      'slotHitRects': _0x835416["slotHitRects"]
    }) : -0x1;
    if (_0x142bff >= 0x0 && _0x142bff !== _0x835416["index"]) {
      this["_removeImageDragGhost"](_0x835416);
      if (this["_swapImageItemIntoSlot"](_0x835416['index'], _0x142bff)) {
        return;
      }
    }
    if (_0x835416["moved"] && _0x31a41d > COLLAGE_IMAGE_DRAG_OUT_THRESHOLD_PX && _0x3552ae) {
      this["_activateImageDragGhost"](_0x835416, event, {
        'markSource': !![]
      });
      this['_moveImageDragGhost'](_0x835416, _0x47a3cf, _0x5308fb);
      _0x835416["tile"]?.["classList"]?.["remove"]("is-drag-source");
      this["_extractItemToSourceNode"](_0x835416["index"], _0x47a3cf, _0x5308fb, _0x835416["ghostEl"]);
      return;
    }
    this['_removeImageDragGhost'](_0x835416);
    this['_commitItems']();
  }
  ["_isOutsideRect"](_0xd98004, _0x2f7844, _0xc50e46, _0x5db99e = 0x0) {
    if (!_0xc50e46) {
      return ![];
    }
    const _0x5f5c1d = Math["max"](0x0, Number(_0x5db99e) || 0x0);
    return _0xd98004 < _0xc50e46["left"] - _0x5f5c1d || _0xd98004 > _0xc50e46['right'] + _0x5f5c1d || _0x2f7844 < _0xc50e46["top"] - _0x5f5c1d || _0x2f7844 > _0xc50e46["bottom"] + _0x5f5c1d;
  }
  ["_isOutsideBoard"](_0x1bd991, _0xb8fb36) {
    const _0xbc0d23 = this["_boardEl"]?.["getBoundingClientRect"]?.();
    return this["_isOutsideRect"](_0x1bd991, _0xb8fb36, _0xbc0d23);
  }
  ["_handleItemWheel"](_0x139824, _0x3965d4) {
    if (!this['_isEditing']) {
      return;
    }
    const _0x1fab65 = (this['_data']["items"] || [])[_0x3965d4];
    if (!_0x1fab65 || isCollageItemEmpty(_0x1fab65)) {
      return;
    }
    _0x139824['preventDefault']();
    _0x139824["stopPropagation"]();
    const _0x2f6d39 = normalizeCollageImageScale(_0x1fab65["imageScale"]);
    const _0x46764c = Math["exp"](-(Number(_0x139824["deltaY"]) || 0x0) * 0.0015);
    const _0x4d3bb0 = normalizeCollageImageScale(_0x2f6d39 * _0x46764c);
    if (Math["abs"](_0x4d3bb0 - _0x2f6d39) < 0.001) {
      return;
    }
    const _0x255151 = Array['isArray'](this["_data"]["items"]) ? [...this["_data"]['items']] : [];
    _0x255151[_0x3965d4] = {
      ..._0x255151[_0x3965d4],
      'imageScale': _0x4d3bb0
    };
    this["_data"] = {
      ...this["_data"],
      'items': _0x255151
    };
    this["_applyTileImagePlacement"](_0x3965d4);
    this["_scheduleItemsCommit"]();
  }
  ["_beginDividerDrag"](_0x412147, _0x34d892) {
    if (!this["_isEditing"]) {
      return;
    }
    _0x412147["preventDefault"]();
    _0x412147["stopPropagation"]();
    if (!_0x34d892) {
      return;
    }
    this["_endDividerDrag"]({
      'shouldCommit': ![]
    });
    const _0x361d30 = this["_boardEl"]?.["getBoundingClientRect"]?.();
    if (!_0x361d30) {
      return;
    }
    const _0x412012 = _0x412147["currentTarget"];
    const _0x5d1c3a = _0x34c656 => this["_updateDividerDrag"](_0x34c656);
    const _0x189f5c = () => this["_endDividerDrag"]();
    this["_activeDividerDrag"] = {
      'divider': _0x34d892,
      'handle': _0x412012,
      'startClientX': Number(_0x412147["clientX"]) || 0x0,
      'startClientY': Number(_0x412147["clientY"]) || 0x0,
      'startItems': this["_getItemsCopy"](),
      'boardRect': _0x361d30,
      'onMove': _0x5d1c3a,
      'onEnd': _0x189f5c
    };
    _0x412012?.['classList']?.["add"]('is-active');
    try {
      _0x412147['currentTarget']?.["setPointerCapture"]?.(_0x412147["pointerId"]);
    } catch (_0x14a047) {}
    document['addEventListener']('pointermove', _0x5d1c3a);
    document['addEventListener']('pointerup', _0x189f5c, {
      'once': !![]
    });
    document["addEventListener"]("pointercancel", _0x189f5c, {
      'once': !![]
    });
  }
  ["_updateDividerDrag"](_0x2849e2) {
    const _0x1aa750 = this["_activeDividerDrag"];
    if (!_0x1aa750) {
      return;
    }
    _0x2849e2['preventDefault']?.();
    const _0x29a5bd = toPositiveNumber(this["_data"]['width'], 0x1);
    const _0x5e819a = toPositiveNumber(this["_data"]["height"], 0x1);
    const _0x4ca2f2 = ((Number(_0x2849e2["clientX"]) || 0x0) - _0x1aa750["startClientX"]) / Math["max"](0x1, _0x1aa750["boardRect"]['width']) * _0x29a5bd;
    const _0x52f100 = ((Number(_0x2849e2["clientY"]) || 0x0) - _0x1aa750['startClientY']) / Math["max"](0x1, _0x1aa750['boardRect']["height"]) * _0x5e819a;
    const _0x42e1cf = _0x1aa750["divider"]["axis"] === 'x' ? _0x4ca2f2 : _0x52f100;
    const _0x15887f = buildCollageDividerDragPatch({
      ...this["_data"],
      'items': _0x1aa750["startItems"]
    }, _0x1aa750["divider"], _0x42e1cf);
    this["_data"] = {
      ...this["_data"],
      'items': _0x15887f["items"]
    };
    const _0x110822 = resolveCollageItemFrames(this['_data']);
    const _0x1e795b = Array["isArray"](_0x15887f["moveIndexes"]) ? _0x15887f["moveIndexes"] : _0x15887f["items"]["map"]((_0x5acb54, _0x39ac57) => _0x39ac57);
    for (const _0xda7fd5 of _0x1e795b) {
      this["_applyTileGeometry"](_0xda7fd5, _0x110822);
    }
    this["_applyDividerHandleGeometry"](_0x1aa750["handle"], {
      ..._0x1aa750["divider"],
      'position': (Number(_0x1aa750["divider"]["position"]) || 0x0) + _0x15887f["delta"]
    }, _0x29a5bd, _0x5e819a);
  }
  ['_endDividerDrag']({
    shouldCommit = !![]
  } = {}) {
    const _0x1d56e3 = this['_activeDividerDrag'];
    if (!_0x1d56e3) {
      return;
    }
    document["removeEventListener"]("pointermove", _0x1d56e3["onMove"]);
    document['removeEventListener']("pointerup", _0x1d56e3["onEnd"]);
    document['removeEventListener']("pointercancel", _0x1d56e3["onEnd"]);
    _0x1d56e3["handle"]?.["classList"]?.["remove"]("is-active");
    this["_activeDividerDrag"] = null;
    if (shouldCommit) {
      this["_commitItems"]();
    }
  }
  ["_extractItemToSourceNode"](_0x445129, _0x346fc8, _0x24073a, _0x54239e = null) {
    const _0x362e1a = (this['_data']["items"] || [])[_0x445129];
    if (!_0x362e1a || isCollageItemEmpty(_0x362e1a)) {
      this["_commitItems"]();
      return;
    }
    const _0x4999ed = typeof a385_0x56f43f["getStateRaw"] === "function" ? a385_0x56f43f["getStateRaw"]() : a385_0x56f43f["getState"]();
    const _0x46fabc = _0x4999ed?.["viewport"] || {
      'x': 0x0,
      'y': 0x0,
      'zoom': 0x1
    };
    const _0x412e86 = screenToWorld(_0x346fc8, _0x24073a, _0x46fabc);
    const _0x571a9b = resolveCollageItemFrames(this["_data"])['find'](_0x4d6991 => _0x4d6991["index"] === _0x445129);
    const _0x44d473 = resolveCollageItemSourceImage(_0x362e1a);
    const _0x2f0126 = this["_getTileByIndex"](_0x445129)?.["querySelector"](".collage-item-img");
    const _0x224cdc = _0x54239e?.["querySelector"]?.("img");
    const _0x54eab1 = toPositiveNumber(_0x2f0126?.["naturalWidth"], 0x0);
    const _0x5f1b78 = toPositiveNumber(_0x2f0126?.["naturalHeight"], 0x0);
    const _0x868b1b = toPositiveNumber(_0x224cdc?.["naturalWidth"], 0x0);
    const _0x5de0cb = toPositiveNumber(_0x224cdc?.["naturalHeight"], 0x0);
    const _0x2a2135 = (_0x44d473["hasIntrinsicSize"] ? toPositiveNumber(_0x44d473["width"], 0x0) : 0x0) || _0x54eab1 || _0x868b1b || toPositiveNumber(_0x44d473["width"], 0x0) || toPositiveNumber(_0x571a9b?.["frame"]?.["width"], _0x362e1a["width"] || 0x1);
    const _0x546fc0 = (_0x44d473['hasIntrinsicSize'] ? toPositiveNumber(_0x44d473["height"], 0x0) : 0x0) || _0x5f1b78 || _0x5de0cb || toPositiveNumber(_0x44d473["height"], 0x0) || toPositiveNumber(_0x571a9b?.['frame']?.['height'], _0x362e1a['height'] || 0x1);
    const _0x25eee7 = toPositiveNumber(_0x362e1a?.["sourceDisplayWidth"], 0x0);
    const _0x5dc2a1 = toPositiveNumber(_0x362e1a?.["sourceDisplayHeight"], 0x0);
    const _0x425dd5 = _0x25eee7 > 0x0 && _0x5dc2a1 > 0x0 ? {
      'width': Math["max"](0x1, Math["round"](_0x25eee7)),
      'height': Math["max"](0x1, Math['round'](_0x5dc2a1))
    } : getAutoMediaSizeByShortSide(_0x2a2135, _0x546fc0);
    const _0x2a5c60 = generateId("source-image");
    const _0x1f27d5 = _0x44d473['localPath'];
    const _0x518f9b = _0x44d473['src'] || (_0x1f27d5 ? '/' + _0x1f27d5['replace'](/^\/+/, '') : '');
    if (!_0x518f9b && !_0x1f27d5) {
      return;
    }
    const _0x183546 = this["_getItemsCopy"]();
    _0x183546[_0x445129] = normalizeEmptyCollageItem(_0x362e1a, _0x445129);
    this["_data"] = {
      ...this["_data"],
      'items': _0x183546
    };
    const _0x28736 = () => {
      a385_0x56f43f["addNode"](buildSourceMediaNodePayload({
        'id': _0x2a5c60,
        'type': 'source-image',
        'src': _0x518f9b,
        'localPath': _0x1f27d5,
        'thumbLocalPath': _0x44d473["isOriginalSource"] ? '' : _0x362e1a['thumbLocalPath'] || '',
        'sourceLocalPath': '',
        'sourceUrl': '',
        'sourceWidth': null,
        'sourceHeight': null,
        'imageWidth': _0x2a2135,
        'imageHeight': _0x546fc0,
        'x': _0x412e86['x'] - _0x425dd5["width"] / 0x2,
        'y': _0x412e86['y'] - _0x425dd5['height'] / 0x2,
        'width': _0x425dd5["width"],
        'height': _0x425dd5["height"],
        'fileName': _0x362e1a["fileName"] || '',
        'name': _0x362e1a["label"] || collageText("preview.imageAlt"),
        'fixedSize': !![],
        'needsAutoResize': ![]
      }));
      a385_0x56f43f["updateNodeData"](this['id'], {
        'items': _0x183546
      });
      a385_0x56f43f["setSelectedNodes"]([_0x2a5c60]);
    };
    if (typeof a385_0x56f43f['batch'] === "function") {
      a385_0x56f43f['batch'](_0x28736);
    } else {
      _0x28736();
    }
    commit();
    window['_triggerLocalCacheSave']?.();
    this["_removeImageDragGhostWhenSourceReady"](_0x54239e, _0x2a5c60);
  }
  ["_resolveItemLocalPath"](_0x387874) {
    const _0x2f84e8 = String(_0x387874?.['localPath'] || '')["trim"]() || String(_0x387874?.["sourceLocalPath"] || '')["trim"]() || String(_0x387874?.['thumbLocalPath'] || '')["trim"]() || (String(_0x387874?.["url"] || '')["startsWith"]('/') ? String(_0x387874['url'])["trim"]() : '');
    if (!_0x2f84e8 || /^(?:https?:|blob:|data:)/i['test'](_0x2f84e8)) {
      return '';
    }
    return _0x2f84e8['replace'](/^\/+/, '');
  }
  async ['_renderCollageOutput'](_0x5d6fc2) {
    const _0x2afb0d = resolveCollageItemFrames(this["_data"])["filter"](({
      item: _0x1ae166
    }) => !isCollageItemEmpty(_0x1ae166));
    if (_0x2afb0d["length"] === 0x0) {
      throw new Error(collageText("errors.emptyCollage"));
    }
    const _0x5bfdb4 = getCollageExportResolution(_0x5d6fc2);
    const _0xa101d4 = resolveCollageExportSize(this['_data'], _0x5bfdb4["longSide"]);
    const _0x265935 = document["createElement"]("canvas");
    _0x265935["width"] = _0xa101d4["width"];
    _0x265935["height"] = _0xa101d4["height"];
    const _0x52467f = _0x265935['getContext']('2d');
    if (!_0x52467f) {
      throw new Error(collageText("errors.canvasCreateFailed"));
    }
    const _0x36101b = normalizeCollageBackgroundColor(this["_data"]["backgroundColor"]);
    const _0x1cb29a = isCollageBackgroundTransparent(_0x36101b);
    const _0x5c6b47 = _0x1cb29a ? '' : resolveCssColorValue(_0x36101b) || getDocumentCssVar("--white");
    !_0x1cb29a && _0x5c6b47 && (_0x52467f["fillStyle"] = _0x5c6b47, _0x52467f["fillRect"](0x0, 0x0, _0x265935["width"], _0x265935["height"]));
    const _0x1fadf7 = toPositiveNumber(this['_data']["width"], 0x1);
    const _0x554f52 = toPositiveNumber(this["_data"]['height'], 0x1);
    const _0x268556 = _0x265935["width"] / _0x1fadf7;
    const _0x5cf789 = _0x265935["height"] / _0x554f52;
    const _0x5c762a = Math["min"](_0x268556, _0x5cf789);
    const {
      cornerRadius: _0x53a119
    } = getCollageLayoutStyle(this["_data"]);
    let _0x97e294 = 0x0;
    const _0x46c18f = await Promise["all"](_0x2afb0d["map"](async ({
      item: _0x42e2ee,
      frame: _0x39115b,
      index: _0x1d49b8
    }) => {
      try {
        const _0x59edf5 = resolveCollageItemPreviewUrl(_0x42e2ee);
        const _0x31551f = this["_getTileByIndex"](_0x1d49b8)?.["querySelector"]?.('.collage-item-img');
        if (_0x31551f?.["complete"] === !![] && Number(_0x31551f['naturalWidth'] || 0x0) > 0x0) {
          return {
            'item': _0x42e2ee,
            'frame': _0x39115b,
            'img': _0x31551f
          };
        }
        if (!_0x59edf5) {
          return null;
        }
        const _0x21423a = await loadImage(_0x59edf5);
        return {
          'item': _0x42e2ee,
          'frame': _0x39115b,
          'img': _0x21423a
        };
      } catch (_0x4f4e68) {
        console['warn']('[CollageNode]\x20skip\x20image:', _0x4f4e68);
        return null;
      }
    }));
    for (const _0x22e7fd of _0x46c18f) {
      if (!_0x22e7fd) {
        continue;
      }
      const {
        item: _0x53ca18,
        frame: _0x5f1925,
        img: _0x215a56
      } = _0x22e7fd;
      const _0x449cca = {
        'x': Math["round"](_0x5f1925['x'] * _0x268556),
        'y': Math['round'](_0x5f1925['y'] * _0x5cf789),
        'width': Math["max"](0x1, Math['round'](_0x5f1925['width'] * _0x268556)),
        'height': Math['max'](0x1, Math["round"](_0x5f1925['height'] * _0x5cf789))
      };
      drawRoundedImageCover(_0x52467f, _0x215a56, _0x449cca, _0x53a119 * _0x5c762a, _0x53ca18['focusX'], _0x53ca18['focusY'], _0x53ca18["imageScale"]) && (_0x97e294 += 0x1);
    }
    if (_0x97e294 === 0x0) {
      throw new Error(collageText("errors.nothingDrawn"));
    }
    const _0x10c2f4 = _0x1cb29a ? "image/png" : "image/jpeg";
    const _0x419ffa = _0x1cb29a ? "png" : "jpg";
    const _0x4d8eba = await canvasToBlob(_0x265935, _0x10c2f4, _0x1cb29a ? undefined : 0.92);
    const _0x42821b = generateId("collage");
    const _0x4f1994 = "collage_" + _0x42821b + '.' + _0x419ffa;
    return {
      'blob': _0x4d8eba,
      'mimeType': _0x10c2f4,
      'extension': _0x419ffa,
      'fileName': _0x4f1994,
      'resolution': _0x5bfdb4,
      'width': _0x265935['width'],
      'height': _0x265935['height']
    };
  }
  async ["_saveCollageOutput"](_0x407f31) {
    const _0x43bccc = new File([_0x407f31['blob']], _0x407f31["fileName"], {
      'type': _0x407f31['mimeType']
    });
    const _0x5b091d = await saveOutputBlob(_0x43bccc, {
      'ext': _0x407f31["extension"]
    });
    const _0x5972b2 = buildCanvasLocalImageFields(_0x5b091d, {
      'includeSrc': !![]
    });
    return {
      'saved': _0x5b091d,
      'fields': _0x5972b2,
      'localPath': _0x5972b2["localPath"],
      'srcUrl': _0x5972b2["src"]
    };
  }
  ["_resolveCompositeNodePosition"](_0x48f6a1) {
    const _0x7aaaa7 = typeof a385_0x56f43f["getStateRaw"] === "function" ? a385_0x56f43f['getStateRaw']() : a385_0x56f43f["getState"]();
    const _0x1b81f8 = _0x7aaaa7?.["nodes"] || {};
    const _0x3d3bb3 = _0x1b81f8[this['id']] || this["_data"];
    return calcSafeSpawnPosNearNode(_0x1b81f8, _0x3d3bb3, _0x48f6a1["width"], _0x48f6a1['height']);
  }
  ["_createCompositeSourceNode"](_0x37013e, _0x257ee5) {
    const _0x55953e = getAutoMediaSizeByShortSide(_0x37013e["width"], _0x37013e["height"]);
    const _0x49f465 = this['_resolveCompositeNodePosition'](_0x55953e);
    const _0x2e30d3 = generateId("node");
    return buildSourceMediaNodePayload({
      'id': _0x2e30d3,
      'type': 'source-image',
      'x': _0x49f465['x'],
      'y': _0x49f465['y'],
      'width': _0x55953e["width"],
      'height': _0x55953e["height"],
      'naturalWidth': _0x37013e['width'],
      'naturalHeight': _0x37013e["height"],
      'src': _0x257ee5['srcUrl'],
      'localPath': _0x257ee5["localPath"],
      ..._0x257ee5["fields"],
      'fileName': _0x257ee5["saved"]?.["filename"] || _0x37013e["fileName"],
      'name': collageText("output.name", {
        'resolution': _0x37013e["resolution"]["label"]
      }),
      'needsAutoResize': ![]
    });
  }
  ["_addCompositeSourceNode"](_0x14e006, _0xa522f2) {
    const _0x5bf774 = this["_createCompositeSourceNode"](_0x14e006, _0xa522f2);
    const _0x3f978e = () => {
      a385_0x56f43f['addNode'](_0x5bf774);
      a385_0x56f43f['setSelectedNodes']([_0x5bf774['id']]);
    };
    if (typeof a385_0x56f43f["batch"] === "function") {
      a385_0x56f43f["batch"](_0x3f978e);
    } else {
      _0x3f978e();
    }
    commit();
    window['_triggerLocalCacheSave']?.();
    window["v2FocusOnNodes"] && requestAnimationFrame(() => window["v2FocusOnNodes"]([this['id'], _0x5bf774['id']]));
    return _0x5bf774;
  }
  async ["_composeCollage"](_0x1012bf, _0x52d98e = null) {
    if (this['_isExporting'] || this['_isCompositing']) {
      return;
    }
    this['_isCompositing'] = !![];
    this["_closeMenus"]();
    const _0x88af57 = this['_setComposeButtonBusy'](_0x52d98e || this['el']["querySelector"](".collage-compose-btn"));
    const _0x3ab697 = _0x202a80 => {
      if (!_0x202a80) {
        return;
      }
      setTimeout(() => revokeBlobObjectUrl(_0x202a80), 0xfa0);
    };
    try {
      const _0x491390 = await this["_renderCollageOutput"](_0x1012bf);
      const _0x2cdb23 = createBlobObjectUrl(_0x491390["blob"]);
      if (_0x2cdb23) {
        const _0x48b462 = this['_addCompositeSourceNode'](_0x491390, {
          'saved': {
            'filename': _0x491390["fileName"]
          },
          'localPath': '',
          'srcUrl': _0x2cdb23
        });
        try {
          const _0x3d6c92 = await this['_saveCollageOutput'](_0x491390);
          a385_0x56f43f["updateNodeData"](_0x48b462['id'], {
            ..._0x3d6c92["fields"],
            'fileName': _0x3d6c92["saved"]?.['filename'] || _0x491390['fileName']
          });
          window["_triggerLocalCacheSave"]?.();
          _0x3ab697(_0x2cdb23);
          window["showToast"]?.(collageText("compose.created"), 'success');
        } catch (_0xdee586) {
          console['error']("[CollageNode] compose save failed:", _0xdee586);
          window["showToast"]?.(collageText("compose.saveFailed"), "warning");
        }
        return;
      }
      const _0x53ec3a = await this["_saveCollageOutput"](_0x491390);
      this["_addCompositeSourceNode"](_0x491390, _0x53ec3a);
      window["showToast"]?.(collageText("compose.created"), "success");
    } catch (_0x589162) {
      console["error"]("[CollageNode] compose failed:", _0x589162);
      window["showToast"]?.(_0x589162?.["message"] || collageText("errors.composeFailed"), "error");
    } finally {
      this["_isCompositing"] = ![];
      _0x88af57?.();
      this["_syncToolbarState"]();
    }
  }
  async ['_exportCollage'](_0x464f60) {
    if (this["_isExporting"] || this["_isCompositing"]) {
      return;
    }
    this["_isExporting"] = !![];
    this["_closeMenus"]();
    this["_syncToolbarState"]();
    try {
      const _0x2e83b6 = await this["_renderCollageOutput"](_0x464f60);
      await this["_saveCollageOutput"](_0x2e83b6);
      window['showToast']?.(collageText("export.exported"), 'success');
    } catch (_0x457d7b) {
      console["error"]("[CollageNode] export failed:", _0x457d7b);
      window['showToast']?.(_0x457d7b?.["message"] || collageText("errors.exportFailed"), 'error');
    } finally {
      this["_isExporting"] = ![];
      this["_syncToolbarState"]();
    }
  }
}