import a935_0x5aa396 from '../core/stores/appStore.js';
import { MATERIAL_FOLDER_ICON_MARKUP, MATERIAL_TREE_CHEVRON_ICON_SVG } from '../components/sharedIconMarkup.js';
import { findAvailablePosition, generateId, screenToWorld } from '../core/math.js';
import { getImage } from './storage.js';
import { fetchAssetsFromServer, fetchAssetCategorySettingsFromServer, saveAssetToServer, saveAssetCategoriesToServer, deleteAssetFromServer, saveAssetThumbToServer } from '../../api/projectsV2Api.js';
import { registerSidebarSubmenu } from './sidebarSubmenuController.js';
import { createMaterialLibraryContextMenuController } from './materialLibraryContextMenu.js';
import { removeAssetMentionAsset, setAssetMentionLibrarySettings, setAssetMentionAssets, upsertAssetMentionAsset } from './assetMentionRegistry.js';
import { createReferenceFallbackThumbHtml } from './referenceThumbnailFallback.js';
import { localPathToUrl } from '../utils/localMediaPath.js';
import { attachMediaElementPlaybackSource } from '../services/desktopMediaBlobSource.js';
import { prepareAssetNodeForRestore, prepareAssetNodesForRestore } from './assetRestoreLayout.js';
import { getLocale, t } from '../i18n/index.js';
import { preloadCanvasImage } from './canvasMediaScheduler.js';
import { playAssetCreateFly } from './assetCreateFly.js';
import { fitAssetMaterialVideoThumbnail, getAssetMaterialVideoThumbnailKey, isAssetMaterialThumbnailUrl, isAssetMaterialVideoThumbnailUrl, resolveAssetMaterialVideoSourceUrl, resolveAssetNodeCoverThumbId, resolveAssetNodeCoverUrl, resolveAssetNodePreviewAspectRatio, resolveAssetNodePreviewUrl, resolveMaterialItemPreviewUrl, resolveMaterialItemThumbUrl } from './assetCoverResolver.js';
import { upsertMediaAssetPackage } from './assetPackageMedia.js';
import { saveMediaFilesDownload } from '../services/downloadSaveService.js';
import { getShortcutLabel, resolveShortcutActionForEvent } from './shortcuts.js';
import { buildMaterialCategoryRenamePlan, buildMaterialDownloadFiles, buildMaterialDuplicate, DEFAULT_MATERIAL_LIBRARY_CATEGORIES, deleteMaterialFolderParent, getMaterialAssetItems, getMaterialFolderAssetCounts, getMaterialLibraryGroups, isMaterialAssetFavorite, MATERIAL_LIBRARY_CATEGORY_LIMIT, normalizeMaterialFolderParents, renameMaterialFolderParent } from './materialLibraryPolicy.js';
const DEFAULT_ASSET_CATEGORIES = DEFAULT_MATERIAL_LIBRARY_CATEGORIES;
const REPLACEMENT_STUDIO_CATEGORY = "替换工作室";
const REPLACEMENT_STUDIO_CATEGORY_ALIASES = Object["freeze"]([REPLACEMENT_STUDIO_CATEGORY, '替换工作室资产', "替换工作室入参"]);
const PROTECTED_ASSET_CATEGORIES = Object["freeze"]([...DEFAULT_ASSET_CATEGORIES, "剧本资产", ...REPLACEMENT_STUDIO_CATEGORY_ALIASES]);
const ASSET_CATEGORY_LIMIT = MATERIAL_LIBRARY_CATEGORY_LIMIT;
const HIDDEN_ASSET_CATEGORIES = ["出图历史"];
const HIDDEN_ASSET_KINDS = ["generation-history"];
const ASSET_CATEGORY_I18N_KEYS = Object["freeze"]({
  '人物': "people",
  '场景': "scenes",
  '物品': 'objects',
  '风格': "styles",
  '音效': "soundEffects",
  'Others': "others",
  '剧本资产': "storyWorkspace",
  '替换工作室': 'replacementStudio',
  '替换工作室资产': 'replacementStudio',
  '替换工作室入参': "replacementStudio",
  '出图历史': "history",
  '自定义': "custom"
});
function assetManagerText(_0x2076e6, _0x4b1c18 = {}) {
  return t("assetManager." + _0x2076e6, _0x4b1c18);
}
function _formatAssetCategoryLabel(_0x3f2fe9) {
  const _0x55882f = String(_0x3f2fe9 || '')["trim"]();
  const _0x209104 = ASSET_CATEGORY_I18N_KEYS[_0x55882f];
  return _0x209104 ? assetManagerText("categories." + _0x209104) : _0x55882f;
}
function _escapeHtml(_0x122a91) {
  return String(_0x122a91 ?? '')['replaceAll']('&', "&amp;")["replaceAll"]('<', "&lt;")["replaceAll"]('>', "&gt;")["replaceAll"]('\x22', '&quot;')["replaceAll"]('\x27', '&#39;');
}
function _clonePlain(_0x6bd22d, _0x393759) {
  if (_0x6bd22d == null) {
    return _0x393759;
  }
  try {
    return JSON['parse'](JSON["stringify"](_0x6bd22d));
  } catch (_0x5eef2e) {
    return _0x393759;
  }
}
function _normalizeAssetType(_0x1aa175) {
  const _0x219673 = String(_0x1aa175 || '');
  if (_0x219673 === "text" || _0x219673 === "source-text" || _0x219673 === "ai-text") {
    return 'text';
  }
  if (_0x219673 === "audio" || _0x219673 === "source-audio" || _0x219673 === "ai-audio") {
    return "audio";
  }
  if (_0x219673 === "video" || _0x219673 === "source-video" || _0x219673 === "ai-video") {
    return 'video';
  }
  if (_0x219673 === 'image' || _0x219673 === 'source-image' || _0x219673 === "ai-image") {
    return "image";
  }
  return "other";
}
function _formatAssetTypeLabel(_0x1897a5) {
  const _0x19cf18 = _normalizeAssetType(_0x1897a5);
  return assetManagerText("types." + _0x19cf18);
}
function _resolveNodeStableThumbSrc(_0x19ca1f) {
  if (!_0x19ca1f) {
    return '';
  }
  const _0x2f585b = _0x19ca1f["thumbLocalPath"] || _0x19ca1f['displayLocalPath'] || _0x19ca1f["localPath"] || _0x19ca1f["originalLocalPath"];
  if (_0x2f585b) {
    return localPathToUrl(_0x2f585b) || (String(_0x2f585b)['startsWith']('/') ? String(_0x2f585b) : '/' + String(_0x2f585b)["replace"](/^\/+/, ''));
  }
  if (_0x19ca1f["thumbUrl"] && typeof _0x19ca1f["thumbUrl"] === 'string') {
    return _0x19ca1f["thumbUrl"];
  }
  return String(_0x19ca1f["src"] || _0x19ca1f["imageUrl"] || '');
}
function _renderAssetIcon(_0x380949) {
  const _0x190707 = _normalizeAssetType(_0x380949);
  if (_0x190707 === "text") {
    return createReferenceFallbackThumbHtml("text", 'v2-asset-icon');
  }
  if (_0x190707 === "audio") {
    return createReferenceFallbackThumbHtml("audio", "v2-asset-icon");
  }
  if (_0x190707 === "video") {
    return '<div\x20class=\x22v2-asset-icon\x20v2-asset-icon--video\x22\x20aria-hidden=\x22true\x22>\x0a\x20\x20\x20\x20\x20\x20<svg\x20class=\x22v2-asset-icon-svg\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22currentColor\x22\x20opacity=\x220.5\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<polygon\x20points=\x225\x203\x2019\x2012\x205\x2021\x205\x203\x22\x20/>\x0a\x20\x20\x20\x20\x20\x20</svg>\x0a\x20\x20\x20\x20</div>';
  }
  return "<div class=\"v2-asset-icon v2-asset-icon--other\" aria-hidden=\"true\">\n    <svg class=\"v2-asset-icon-svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"var(--text-muted)\" stroke-width=\"1.5\">\n      <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" />\n    </svg>\n  </div>";
}
function _buildAssetItem(_0x33e211) {
  const _0x20f11a = _0x33e211?.["type"] || 'other';
  const _0x5bdd4d = resolveAssetNodeCoverUrl(_0x33e211) || _resolveNodeStableThumbSrc(_0x33e211);
  return {
    'type': _0x20f11a,
    'name': _0x33e211?.["name"] || '',
    'thumbSrc': _0x5bdd4d || '',
    'nodeData': _0x33e211
  };
}
function _resolveMaterialItemThumbSrc(_0x59ba13) {
  return String(resolveMaterialItemThumbUrl(_0x59ba13) || _resolveNodeStableThumbSrc(_0x59ba13?.["nodeData"]) || '');
}
function _resolveMaterialItemPreviewSrc(_0x33d32d) {
  return String(resolveMaterialItemPreviewUrl(_0x33d32d) || _resolveMaterialItemThumbSrc(_0x33d32d));
}
function _sortAssetsByUpdatedTime(_0x179f3f) {
  return [...(Array["isArray"](_0x179f3f) ? _0x179f3f : [])]["sort"]((_0x4ee726, _0x105342) => {
    const _0x35e3f6 = Number(_0x4ee726?.['updatedAt'] || _0x4ee726?.["createdAt"] || 0x0);
    const _0x59f0b2 = Number(_0x105342?.["updatedAt"] || _0x105342?.["createdAt"] || 0x0);
    return _0x59f0b2 - _0x35e3f6;
  });
}
function _formatAssetDateTime(_0x48369c) {
  const _0x2d6462 = Number(_0x48369c);
  if (!Number["isFinite"](_0x2d6462) || _0x2d6462 <= 0x0) {
    return assetManagerText("unknownTime");
  }
  return new Date(_0x2d6462)["toLocaleString"](getLocale(), {
    'year': "numeric",
    'month': "2-digit",
    'day': "2-digit",
    'hour': "2-digit",
    'minute': "2-digit"
  });
}
class AssetManager {
  constructor() {
    this["createPanel"] = null;
    this["createPanelBackdrop"] = null;
    this['_createPanelKeydownHandler'] = null;
    this["_createPanelDropdownOutsideHandler"] = null;
    this["_createPanelDropdownEl"] = null;
    this["_createPanelCoverObjectUrl"] = '';
    this["_createPanelState"] = null;
    this["sidebarPanel"] = null;
    this["_openAssetId"] = null;
    this['_thumbPreloadSet'] = new Set();
    this['_thumbDecodePromiseMap'] = new Map();
    this["_videoThumbInFlight"] = new Set();
    this["_videoThumbTimer"] = 0x0;
    this["_sidebarRenderRaf"] = 0x0;
    this["_pendingDeleteAssetId"] = '';
    this["_renamingAssetId"] = '';
    this["_renamingMaterialItemKey"] = '';
    this["_savingMaterialItemKey"] = '';
    this["_newAssetPulseId"] = '';
    this["_sidebarTabsLayoutRaf"] = 0x0;
    this['_assetPackageUpsertByKey'] = new Map();
    this["_materialSearchQuery"] = '';
    this["_materialFavoritesOnly"] = ![];
    this["_expandedMaterialCategories"] = new Set();
    this['_expandedMaterialAssets'] = new Set();
    this["_pendingMaterialFolderDeleteKey"] = '';
    this['_deletingMaterialFolderKey'] = '';
    this["_renamingMaterialCategoryKey"] = '';
    this["_savingMaterialCategoryKey"] = '';
    this["_materialMenuEl"] = null;
    this["_materialMenuState"] = null;
    this["_materialMenuOutsideHandler"] = null;
    this["_materialMenuKeydownHandler"] = null;
    this['_materialAssetRowClickTimer'] = 0x0;
    this["_materialAssetRowClickToggle"] = null;
    this['_materialPreviewEl'] = null;
    this["_materialPreviewRow"] = null;
    this["_materialDropTarget"] = null;
    this["_materialLoadingCount"] = 0x0;
    this["activeTab"] = '人物';
    this["_materialCurrentFolderCategory"] = this["activeTab"];
    this["tabs"] = [...DEFAULT_ASSET_CATEGORIES];
    this["userCategories"] = [];
    this["materialCategoryDisplayNames"] = {};
    this["materialCategoryParents"] = {};
    this['_materialCategorySaveQueue'] = Promise["resolve"]();
    this["assets"] = [];
    this["_materialContextMenuController"] = createMaterialLibraryContextMenuController({
      'getPanel': () => this['sidebarPanel'],
      'getText': _0x596ffd => assetManagerText(_0x596ffd),
      'closeAssetMenu': () => this["_closeMaterialMenu"](),
      'openAssetMenu': (_0x17ccd1, _0x25b4ec) => this["_openMaterialMenu"](_0x17ccd1, _0x25b4ec),
      'restoreAssetSubItem': (_0x39cae2, _0x2c962b) => this["_restoreAssetSubItem"](_0x39cae2, _0x2c962b)
    });
    this['initSidebarPanel']();
    this["loadAssetCategoriesFromServer"]();
    this["_assetLoadPromise"] = this["loadAssetsFromServer"]();
  }
  ["_getSortedAssets"]() {
    return _sortAssetsByUpdatedTime((this['assets'] || [])["filter"](_0x102e6d => this["_isManagedAsset"](_0x102e6d)));
  }
  ["_normalizeCategoryName"](_0x611689) {
    return String(_0x611689 || '')["trim"]();
  }
  ['_canonicalCategoryName'](_0x2bfb73) {
    const _0x1c59dd = this['_normalizeCategoryName'](_0x2bfb73);
    if (REPLACEMENT_STUDIO_CATEGORY_ALIASES["some"](_0x371ffc => _0x371ffc["toLocaleLowerCase"]() === _0x1c59dd["toLocaleLowerCase"]())) {
      return REPLACEMENT_STUDIO_CATEGORY;
    }
    return _0x1c59dd;
  }
  ['_categoryKey'](_0x5a71a1) {
    return this["_canonicalCategoryName"](_0x5a71a1)["toLocaleLowerCase"]();
  }
  ["_isDefaultCategory"](_0x3f8427) {
    return !!this['_findCategoryByName'](_0x3f8427, DEFAULT_ASSET_CATEGORIES);
  }
  ["_isProtectedCategory"](_0x2d2cb3) {
    return !!this["_findCategoryByName"](_0x2d2cb3, PROTECTED_ASSET_CATEGORIES);
  }
  ["_isHiddenAssetCategory"](_0x5205e2) {
    return !!this["_findCategoryByName"](_0x5205e2, HIDDEN_ASSET_CATEGORIES);
  }
  ['_isManagedAsset'](_0x4927ab) {
    if (!_0x4927ab || typeof _0x4927ab !== "object") {
      return ![];
    }
    if (HIDDEN_ASSET_KINDS["includes"](String(_0x4927ab?.['kind'] || '')['trim']()["toLowerCase"]())) {
      return ![];
    }
    return !this["_isHiddenAssetCategory"](_0x4927ab?.["category"]);
  }
  ["_findCategoryByName"](_0x157530, _0x2d81ef = this["tabs"]) {
    const _0x2a49bd = this["_categoryKey"](_0x157530);
    if (!_0x2a49bd) {
      return '';
    }
    return (_0x2d81ef || [])["find"](_0x191c3f => this["_categoryKey"](_0x191c3f) === _0x2a49bd) || '';
  }
  ["_normalizeUserCategories"](_0x5b6872 = []) {
    const _0x483d06 = [];
    const _0x23ff88 = _0x24268f => {
      const _0x491ead = this["_normalizeCategoryName"](_0x24268f);
      if (!_0x491ead) {
        return;
      }
      if (this["_isProtectedCategory"](_0x491ead) || this["_isHiddenAssetCategory"](_0x491ead)) {
        return;
      }
      if (this["_findCategoryByName"](_0x491ead, _0x483d06)) {
        return;
      }
      if (DEFAULT_ASSET_CATEGORIES['length'] + _0x483d06['length'] >= ASSET_CATEGORY_LIMIT) {
        return;
      }
      _0x483d06["push"](_0x491ead);
    };
    (Array["isArray"](_0x5b6872) ? _0x5b6872 : [])["forEach"](_0x23ff88);
    return _0x483d06;
  }
  ["_normalizeCategoryDisplayNames"](_0xce8168 = {}) {
    const _0x42b656 = {};
    if (!_0xce8168 || typeof _0xce8168 !== "object") {
      return _0x42b656;
    }
    for (const [_0x35c054, _0x7d5154] of Object["entries"](_0xce8168)) {
      const _0x5191f8 = this["_canonicalCategoryName"](_0x35c054);
      const _0x2980d6 = this["_normalizeCategoryName"](_0x7d5154);
      if (!_0x5191f8 || !_0x2980d6 || !this["_isProtectedCategory"](_0x5191f8)) {
        continue;
      }
      if (_0x2980d6 === _formatAssetCategoryLabel(_0x5191f8)) {
        continue;
      }
      _0x42b656[_0x5191f8] = _0x2980d6;
    }
    return _0x42b656;
  }
  ["_normalizeMaterialCategoryParents"](_0xa65ccb = this["materialCategoryParents"], _0xffaba = this['userCategories']) {
    return normalizeMaterialFolderParents({
      'parents': _0xa65ccb,
      'userCategories': _0xffaba,
      'allCategories': this['_getAssetCategories'](),
      'categoryKey': _0x215971 => this["_categoryKey"](_0x215971)
    });
  }
  ["_getMaterialParentCategory"](_0x4141b6) {
    const _0xfab35a = this["_categoryKey"](_0x4141b6);
    if (!_0xfab35a) {
      return '';
    }
    return Object["entries"](this['materialCategoryParents'] || {})["find"](([_0x3c8378]) => this["_categoryKey"](_0x3c8378) === _0xfab35a)?.[0x1] || '';
  }
  ["_createUniqueMaterialFolderName"]() {
    const _0x284e26 = this["_normalizeCategoryName"](assetManagerText('newFolder'));
    if (!this['_findCategoryByName'](_0x284e26, this["_getAssetCategories"]())) {
      return _0x284e26;
    }
    for (let _0xaa05bd = 0x2; _0xaa05bd <= ASSET_CATEGORY_LIMIT; _0xaa05bd += 0x1) {
      const _0x14b506 = _0x284e26 + '\x20' + _0xaa05bd;
      if (!this["_findCategoryByName"](_0x14b506, this["_getAssetCategories"]())) {
        return _0x14b506;
      }
    }
    return '';
  }
  ["_createMaterialFolder"]({
    parentCategory: _0x6b9f5,
    surface = "sidebar"
  } = {}) {
    const _0x50dae2 = this["_normalizeCategoryName"](_0x6b9f5);
    const _0x1321b3 = this['_findCategoryByName'](_0x50dae2, this["_getAssetCategories"]());
    const _0x12ccf0 = this['_createUniqueMaterialFolderName']();
    if (_0x50dae2 && !_0x1321b3 || !_0x12ccf0) {
      window["showToast"]?.(assetManagerText("categoryLimit", {
        'limit': ASSET_CATEGORY_LIMIT
      }), "warn");
      return '';
    }
    const _0x3c742f = this["_addUserCategory"](_0x12ccf0, {
      'parentCategory': _0x1321b3
    });
    if (!_0x3c742f) {
      return '';
    }
    const _0x26c6ba = this['_categoryKey'](_0x1321b3);
    const _0x4e96fe = this["_categoryKey"](_0x3c742f);
    this["_materialCurrentFolderCategory"] = _0x3c742f;
    this['_renamingMaterialCategoryKey'] = _0x4e96fe;
    if (_0x26c6ba) {
      this['_expandedMaterialCategories']['add'](_0x26c6ba);
    }
    if (surface === "create-panel" && this["_createPanelState"]) {
      const _0x24489c = new Set(this["_createPanelState"]["expandedFolderKeys"] || []);
      if (_0x26c6ba) {
        _0x24489c["add"](_0x26c6ba);
      }
      const _0xede160 = [...(this["_createPanelState"]["customCategories"] || [])];
      !this["_findCategoryByName"](_0x3c742f, _0xede160) && _0xede160['push'](_0x3c742f);
      this['_setCreatePanelState']({
        'draft': {
          'category': _0x3c742f
        },
        'selectedFolderCategory': _0x3c742f,
        'customCategories': _0xede160,
        'expandedFolderKeys': _0x24489c,
        'editingFolderCategory': _0x3c742f,
        'editingFolderDraft': _0x3c742f,
        'pendingFolderDeleteKey': '',
        'error': ''
      });
      this["_renderCreatePanelFolderTree"]({
        'focusRename': !![]
      });
      return _0x3c742f;
    }
    this["renderSidebarContent"]();
    this["_focusMaterialCategoryRenameInput"](_0x4e96fe, {
      'select': !![]
    });
    return _0x3c742f;
  }
  ['_formatCategoryLabel'](_0x28e342) {
    const _0x4f982a = this["_canonicalCategoryName"](_0x28e342);
    return this["materialCategoryDisplayNames"]?.[_0x4f982a] || _formatAssetCategoryLabel(_0x4f982a);
  }
  ["_isUserCategory"](_0x4da948) {
    return !!this["_findCategoryByName"](_0x4da948, this['userCategories']);
  }
  ['_getAssetCategories'](_0x177211 = '') {
    const _0x5ef382 = [];
    const _0x3137ee = _0x5d44df => {
      const _0x37f20b = this['_canonicalCategoryName'](_0x5d44df);
      if (!_0x37f20b) {
        return;
      }
      if (this["_isHiddenAssetCategory"](_0x37f20b)) {
        return;
      }
      if (this['_findCategoryByName'](_0x37f20b, _0x5ef382)) {
        return;
      }
      if (_0x5ef382["length"] >= ASSET_CATEGORY_LIMIT) {
        return;
      }
      _0x5ef382["push"](_0x37f20b);
    };
    DEFAULT_ASSET_CATEGORIES["forEach"](_0x3137ee);
    for (const _0x2f904d of this['userCategories'] || []) {
      _0x3137ee(_0x2f904d);
    }
    for (const _0x4ee2ec of this["_getSortedAssets"]()) {
      _0x3137ee(_0x4ee2ec?.['category']);
    }
    _0x3137ee(_0x177211);
    return _0x5ef382;
  }
  ["_syncTabsFromAssets"]() {
    this['tabs'] = this["_getAssetCategories"]();
    setAssetMentionLibrarySettings({
      'categories': this["tabs"],
      'displayNames': this["materialCategoryDisplayNames"],
      'parents': this["materialCategoryParents"]
    });
    !this["_findCategoryByName"](this["activeTab"], this['tabs']) && (this["activeTab"] = DEFAULT_ASSET_CATEGORIES[0x0], this["_openAssetId"] = null);
  }
  ['_renderSidebarTabsHtml']() {
    return (this["tabs"] || [])["map"](_0x2cda10 => {
      const _0x1acb2b = this["_categoryKey"](_0x2cda10) === this["_categoryKey"](this["activeTab"]) ? '\x20active' : '';
      const _0x48f7ae = _escapeHtml(_0x2cda10);
      const _0x23b42b = _escapeHtml(this["_formatCategoryLabel"](_0x2cda10));
      const _0x35e03f = this["_isUserCategory"](_0x2cda10) ? "<button\n              type=\"button\"\n              class=\"v2-asset-category-delete\"\n              data-ui-action=\"asset-category-delete\"\n              data-cat=\"" + _0x48f7ae + "\"\n              aria-label=\"" + _escapeHtml(assetManagerText("deleteCategoryAria", {
        'category': this['_formatCategoryLabel'](_0x2cda10)
      })) + "\"\n            >×</button>" : '';
      return '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22v2-asset-sidebar-tab' + _0x1acb2b + "\" data-cat=\"" + _0x48f7ae + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22v2-asset-sidebar-tab-text\x22>' + _0x23b42b + "</span>\n            " + _0x35e03f + "\n          </div>\n        ";
    })["join"]('');
  }
  ['_renderSidebarTabs']() {
    const _0x43e9c2 = this["sidebarPanel"]?.["querySelector"]("#asset-sidebar-tabs");
    if (!_0x43e9c2) {
      this["sidebarPanel"]?.["classList"]['contains']("show") && this["renderSidebarContent"]();
      return;
    }
    _0x43e9c2["innerHTML"] = this["_renderSidebarTabsHtml"]();
    this["_queueSidebarTabsLayoutSync"]();
  }
  ['_queueSidebarTabsLayoutSync']() {
    if (!this['sidebarPanel']) {
      return;
    }
    this['_sidebarTabsLayoutRaf'] && window['cancelAnimationFrame']?.(this["_sidebarTabsLayoutRaf"]);
    this["_sidebarTabsLayoutRaf"] = window["requestAnimationFrame"](() => {
      this['_sidebarTabsLayoutRaf'] = 0x0;
      this["_syncSidebarTabsViewport"]();
    });
  }
  ["_syncSidebarTabsViewport"]() {
    const _0x4df59a = this["sidebarPanel"]?.['querySelector']("#asset-sidebar-tabs");
    if (!_0x4df59a) {
      return;
    }
    const _0x5ecf80 = _0x4df59a["querySelector"](".v2-asset-sidebar-tab.active");
    if (_0x5ecf80 && _0x4df59a["clientWidth"] > 0x0) {
      if (this["_isDefaultCategory"](this['activeTab'])) {
        _0x4df59a['scrollLeft'] = 0x0;
      } else {
        const _0x27562f = _0x5ecf80['offsetLeft'];
        const _0x3dcd70 = _0x27562f + _0x5ecf80['offsetWidth'];
        const _0x4d153f = _0x4df59a["scrollLeft"];
        const _0x9bff26 = _0x4d153f + _0x4df59a["clientWidth"];
        if (_0x27562f < _0x4d153f) {
          _0x4df59a["scrollLeft"] = _0x27562f;
        } else {
          _0x3dcd70 > _0x9bff26 && (_0x4df59a["scrollLeft"] = _0x3dcd70 - _0x4df59a['clientWidth']);
        }
      }
    }
    this["_updateSidebarTabsOverflowHint"]();
  }
  ['_updateSidebarTabsOverflowHint']() {
    const _0x2f4774 = this["sidebarPanel"]?.["querySelector"]("#asset-sidebar-tabs-shell");
    const _0x219c0b = this['sidebarPanel']?.["querySelector"]("#asset-sidebar-tabs");
    if (!_0x2f4774 || !_0x219c0b) {
      return;
    }
    const _0xa70ffa = Math["max"](0x0, _0x219c0b["scrollWidth"] - _0x219c0b["clientWidth"]);
    const _0x183306 = _0xa70ffa > 0x2;
    const _0x1f7676 = !_0x183306 || _0x219c0b["scrollLeft"] <= 0x2;
    const _0x20b359 = !_0x183306 || _0x219c0b["scrollLeft"] >= _0xa70ffa - 0x2;
    _0x2f4774["classList"]["toggle"]('has-overflow', _0x183306);
    _0x2f4774['classList']["toggle"]("is-at-start", _0x1f7676);
    _0x2f4774["classList"]["toggle"]('is-at-end', _0x20b359);
    const _0x3c5dfc = _0x2f4774["querySelector"]('.v2-asset-sidebar-tabs-nav--prev');
    const _0x5b2098 = _0x2f4774["querySelector"](".v2-asset-sidebar-tabs-nav--next");
    if (_0x3c5dfc) {
      _0x3c5dfc["hidden"] = !_0x183306 || _0x1f7676;
    }
    if (_0x5b2098) {
      _0x5b2098["hidden"] = !_0x183306 || _0x20b359;
    }
  }
  ["_scrollSidebarTabs"](_0x358d44 = 0x1) {
    const _0xec3cbf = this["sidebarPanel"]?.["querySelector"]('#asset-sidebar-tabs');
    if (!_0xec3cbf) {
      return;
    }
    const _0x74dbe5 = Math["max"](0x1, Math["floor"](_0xec3cbf["clientWidth"] * 0.75));
    const _0x55269a = _0xec3cbf["scrollLeft"] + _0x74dbe5 * (_0x358d44 < 0x0 ? -0x1 : 0x1);
    typeof _0xec3cbf["scrollTo"] === "function" ? _0xec3cbf['scrollTo']({
      'left': _0x55269a,
      'behavior': "smooth"
    }) : _0xec3cbf['scrollLeft'] = _0x55269a;
    window["setTimeout"](() => this["_updateSidebarTabsOverflowHint"](), 0xdc);
  }
  ['_getCreatePanelCategories']() {
    const _0x25a7c9 = this["_getAssetCategories"]();
    const _0x487400 = _0x19d225 => {
      const _0x2a8bda = this['_normalizeCategoryName'](_0x19d225);
      if (!_0x2a8bda) {
        return;
      }
      if (this["_findCategoryByName"](_0x2a8bda, _0x25a7c9)) {
        return;
      }
      _0x25a7c9["push"](_0x2a8bda);
    };
    for (const _0x553f4c of this["_createPanelState"]?.["customCategories"] || []) {
      _0x487400(_0x553f4c);
    }
    _0x487400(this["_createPanelState"]?.["draft"]?.["category"] || this["activeTab"]);
    return _0x25a7c9;
  }
  ["_canAddCustomCategory"]() {
    return this["_getCreatePanelCategories"]()['length'] < ASSET_CATEGORY_LIMIT;
  }
  async ["loadAssetCategoriesFromServer"]() {
    try {
      const _0x561776 = await fetchAssetCategorySettingsFromServer();
      this["userCategories"] = this["_normalizeUserCategories"](_0x561776["categories"]);
      this["materialCategoryDisplayNames"] = this["_normalizeCategoryDisplayNames"](_0x561776["displayNames"]);
      this["materialCategoryParents"] = this["_normalizeMaterialCategoryParents"](_0x561776["parents"], this["userCategories"]);
      this["_syncTabsFromAssets"]();
      this["_renderSidebarTabs"]();
      this["sidebarPanel"]?.['classList']['contains']('show') && this["renderSidebarContent"]();
    } catch (_0x39290e) {
      console["error"]("加载素材分类失败", _0x39290e);
    }
  }
  async ["_saveUserCategories"]() {
    const _0x48bbe0 = this['_normalizeUserCategories'](this['userCategories']);
    this['userCategories'] = _0x48bbe0;
    this["materialCategoryParents"] = this["_normalizeMaterialCategoryParents"](this["materialCategoryParents"], _0x48bbe0);
    await this["_saveMaterialCategorySettings"](_0x48bbe0, this["materialCategoryDisplayNames"], this["materialCategoryParents"]);
  }
  async ["_saveMaterialCategorySettings"](_0x55faeb = this['userCategories'], _0x363df9 = this["materialCategoryDisplayNames"], _0x4f38d0 = this['materialCategoryParents']) {
    const _0x536f53 = [..._0x55faeb];
    const _0x27f1ed = {
      ...(_0x363df9 || {})
    };
    const _0x3ec689 = {
      ...(_0x4f38d0 || {})
    };
    const _0x1fce92 = () => saveAssetCategoriesToServer(_0x536f53, {
      'displayNames': _0x27f1ed,
      'parents': _0x3ec689
    });
    const _0x4ba6ef = this["_materialCategorySaveQueue"]["catch"](() => {})["then"](_0x1fce92);
    this['_materialCategorySaveQueue'] = _0x4ba6ef;
    await _0x4ba6ef;
  }
  ["_addUserCategory"](_0x2f8490, {
    parentCategory = ''
  } = {}) {
    const _0x19e180 = this["_normalizeCategoryName"](_0x2f8490);
    if (!_0x19e180 || this['_isProtectedCategory'](_0x19e180) || this['_isHiddenAssetCategory'](_0x19e180)) {
      return '';
    }
    const _0x56b7a7 = this['_findCategoryByName'](_0x19e180, this['userCategories']);
    if (_0x56b7a7) {
      return _0x56b7a7;
    }
    if (DEFAULT_ASSET_CATEGORIES["length"] + this['userCategories']["length"] >= ASSET_CATEGORY_LIMIT) {
      window["showToast"]?.(assetManagerText("categoryLimit", {
        'limit': ASSET_CATEGORY_LIMIT
      }), "warn");
      return '';
    }
    this["userCategories"] = this["_normalizeUserCategories"]([...this["userCategories"], _0x19e180]);
    const _0x1f356b = this['_findCategoryByName'](parentCategory, this["_getAssetCategories"]());
    _0x1f356b && this["_categoryKey"](_0x1f356b) !== this["_categoryKey"](_0x19e180) && (this["materialCategoryParents"] = this["_normalizeMaterialCategoryParents"]({
      ...this["materialCategoryParents"],
      [_0x19e180]: _0x1f356b
    }, this['userCategories']));
    this['_syncTabsFromAssets']();
    this["_renderSidebarTabs"]();
    void this["_saveUserCategories"]()["catch"](_0xda95ab => {
      console["error"]("保存素材分类失败", _0xda95ab);
      window["showToast"]?.(assetManagerText('categorySaveFailed'), "error");
    });
    return _0x19e180;
  }
  ['_getMentionEligibleAssets']() {
    return this["_getSortedAssets"]()["filter"](_0xdef513 => this["_findCategoryByName"](_0xdef513?.["category"], this["tabs"]));
  }
  ["_normalizeAssetEntity"](_0x207812) {
    if (!_0x207812 || typeof _0x207812 !== 'object') {
      return null;
    }
    const _0x11e28c = {
      ..._0x207812
    };
    const _0x37942c = Number(_0x11e28c["createdAt"] || 0x0);
    const _0x33c0b4 = Number(_0x11e28c["updatedAt"] || _0x37942c || 0x0);
    _0x37942c > 0x0 ? _0x11e28c["createdAt"] = _0x37942c : delete _0x11e28c["createdAt"];
    if (_0x33c0b4 > 0x0) {
      _0x11e28c["updatedAt"] = _0x33c0b4;
    } else {
      _0x37942c > 0x0 && (_0x11e28c['updatedAt'] = _0x37942c);
    }
    Array['isArray'](_0x11e28c["nodes"]) && _0x11e28c['nodes'][0x0] && !isAssetMaterialThumbnailUrl(_0x11e28c["coverUrl"]) && (_0x11e28c["coverUrl"] = resolveAssetNodeCoverUrl(_0x11e28c['nodes'][0x0]) || _0x11e28c["coverUrl"] || '');
    const _0x291d59 = getMaterialAssetItems(_0x11e28c);
    _0x291d59['length'] > 0x0 && (_0x11e28c['items'] = _0x291d59["map"](_0x14bb82 => ({
      ..._0x14bb82,
      'thumbSrc': _resolveMaterialItemThumbSrc(_0x14bb82)
    })));
    return _0x11e28c;
  }
  ["_upsertLocalAsset"](_0x378101) {
    const _0x1dae44 = this["_normalizeAssetEntity"](_0x378101);
    if (!_0x1dae44?.['id']) {
      return;
    }
    const _0x2af08a = Array["isArray"](this['assets']) ? this["assets"] : [];
    const _0x13012f = _0x2af08a["filter"](_0x383020 => String(_0x383020?.['id'] || '') !== String(_0x1dae44['id']));
    this["assets"] = _sortAssetsByUpdatedTime([_0x1dae44, ..._0x13012f]);
    this["_syncTabsFromAssets"]();
    this["_renderSidebarTabs"]();
    this['_findCategoryByName'](_0x1dae44["category"], this["tabs"]) ? upsertAssetMentionAsset(_0x1dae44) : removeAssetMentionAsset(_0x1dae44['id']);
  }
  ['_getSelectedAssetNodes'](_0x494fa4) {
    const _0xe68a0d = Array["isArray"](_0x494fa4) ? _0x494fa4 : [];
    const _0x1f4e70 = a935_0x5aa396["getState"]();
    return _0xe68a0d["map"](_0x43d5d9 => _0x1f4e70["nodes"][_0x43d5d9])["filter"](Boolean);
  }
  ["_getSelectedAssetEdges"](_0x575a0c) {
    const _0x452f37 = Array["isArray"](_0x575a0c) ? _0x575a0c : [];
    const _0x53a496 = new Set(_0x452f37);
    const _0x581796 = a935_0x5aa396["getState"]();
    return Object['values'](_0x581796['edges'] || {})["filter"](_0x30efc1 => _0x53a496["has"](_0x30efc1?.["sourceId"]) && _0x53a496['has'](_0x30efc1?.["targetId"]));
  }
  ["_buildCreatePanelCoverInfo"](_0x5646a9, _0x757381 = '') {
    const _0x4d4e93 = String(_0x757381 || '')['trim']();
    const _0x2d07ed = _0x5646a9?.['type'] || "other";
    return {
      'coverUrl': _0x4d4e93,
      'coverType': _0x2d07ed,
      'aspectRatio': resolveAssetNodePreviewAspectRatio(_0x5646a9),
      'coverHtml': _0x4d4e93 ? "<img src=\"" + _escapeHtml(_0x4d4e93) + '\x22\x20alt=\x22' + _escapeHtml(assetManagerText('coverAlt')) + "\" id=\"asset-create-cover-img\" draggable=\"false\" />" : _renderAssetIcon(_0x2d07ed)
    };
  }
  async ['_resolveCreatePanelCover'](_0xaf8d7c, _0x2112fb = {}) {
    const _0x59b38d = _0x2112fb['preferPreview'] === !![] ? resolveAssetNodePreviewUrl(_0xaf8d7c) : resolveAssetNodeCoverUrl(_0xaf8d7c);
    if (_0x59b38d) {
      return {
        ...this["_buildCreatePanelCoverInfo"](_0xaf8d7c, _0x59b38d),
        'objectUrl': ''
      };
    }
    let _0xd0f808 = '';
    let _0x7a6f2d = '';
    const _0x47c521 = resolveAssetNodeCoverThumbId(_0xaf8d7c);
    if (_0x47c521) {
      try {
        const _0x5b7458 = await getImage(_0x47c521);
        const _0x48645a = String(_0x5b7458?.['type'] || '')["trim"]()['toLowerCase']();
        _0x5b7458 && (!_0x48645a || _0x48645a["startsWith"]("image/")) && (_0x7a6f2d = URL["createObjectURL"](_0x5b7458), _0xd0f808 = _0x7a6f2d);
      } catch (_0x1f3116) {}
    }
    return {
      ...this["_buildCreatePanelCoverInfo"](_0xaf8d7c, _0xd0f808),
      'objectUrl': _0x7a6f2d
    };
  }
  ["_applyCreatePanelCoverAspect"](_0x3d20ab, _0x3c2ed1) {
    if (!_0x3d20ab) {
      return;
    }
    const _0x3ec828 = Number(_0x3c2ed1) > 0x0 ? Number(_0x3c2ed1) : 0x4 / 0x3;
    _0x3d20ab["style"]["setProperty"]("--asset-create-cover-aspect", String(_0x3ec828));
    _0x3d20ab["style"]["setProperty"]("--asset-create-cover-width-limit", _0x3ec828 * 0x64 + "cqh");
    _0x3d20ab['style']["setProperty"]("--asset-create-cover-height-limit", 0x64 / _0x3ec828 + 'cqw');
  }
  ["_applyCreatePanelCoverInfo"](_0x25e2c7, _0x183d90) {
    const _0xe60d44 = String(_0x183d90?.["objectUrl"] || '');
    if (!_0x25e2c7 || this['createPanel'] !== _0x25e2c7 || !this["_createPanelState"]) {
      if (_0xe60d44["startsWith"]("blob:")) {
        URL["revokeObjectURL"](_0xe60d44);
      }
      return ![];
    }
    this["_createPanelCoverObjectUrl"] && this['_createPanelCoverObjectUrl'] !== _0xe60d44 && this['_createPanelCoverObjectUrl']["startsWith"]("blob:") && URL["revokeObjectURL"](this["_createPanelCoverObjectUrl"]);
    this["_createPanelCoverObjectUrl"] = _0xe60d44;
    const _0xa16ac7 = {
      'coverUrl': String(_0x183d90?.["coverUrl"] || ''),
      'coverType': _0x183d90?.["coverType"] || "other",
      'aspectRatio': Number(_0x183d90?.["aspectRatio"]) > 0x0 ? Number(_0x183d90['aspectRatio']) : Number(this["_createPanelState"]?.["coverInfo"]?.["aspectRatio"]) || 0x4 / 0x3,
      'coverHtml': _0x183d90?.['coverHtml'] || _renderAssetIcon(_0x183d90?.["coverType"] || 'other')
    };
    this['_setCreatePanelState']({
      'coverInfo': _0xa16ac7
    });
    const _0x53faf1 = _0x25e2c7["querySelector"](".v2-asset-create-cover");
    _0x53faf1 && (_0x53faf1["innerHTML"] = _0xa16ac7["coverHtml"], this["_applyCreatePanelCoverAspect"](_0x53faf1, _0xa16ac7["aspectRatio"]));
    return !![];
  }
  ["_buildAssetPayloadFromSelection"](_0x2ba10d, _0xf88158 = {}) {
    const _0xfcf3d1 = this['_getSelectedAssetNodes'](_0x2ba10d);
    const _0x19db47 = _0xfcf3d1[0x0] || null;
    const _0x224e6b = Date['now']();
    const _0x220d8f = String(_0xf88158["name"] || '')["trim"]() || assetManagerText("unnamedAsset");
    const _0x3cdd63 = String(_0xf88158['category'] || '')["trim"]() || this["activeTab"];
    const _0x20ac15 = _0x19db47?.["type"] || "other";
    const _0x2fef48 = resolveAssetNodeCoverUrl(_0x19db47);
    const _0x64c83 = String(_0xf88158['id'] || '')["trim"]();
    const _0x436a41 = Number(_0xf88158["createdAt"] || _0x224e6b) || _0x224e6b;
    const _0x2dff12 = Number(_0xf88158["updatedAt"] || _0x224e6b) || _0x224e6b;
    return {
      'id': _0x64c83 || generateId("asset"),
      'name': _0x220d8f,
      'category': _0x3cdd63,
      'coverUrl': _0x2fef48,
      'coverType': _0x20ac15,
      'items': _0xfcf3d1["map"](_0x40f85f => _buildAssetItem(_0x40f85f)),
      'nodes': _0xfcf3d1,
      'edges': this["_getSelectedAssetEdges"](_0x2ba10d),
      'createdAt': _0x436a41,
      'updatedAt': _0x2dff12
    };
  }
  ["_buildAssetAppendPayload"](_0x2a060b, _0x4f49eb, _0x5c68d5 = {}) {
    const _0x5e4ee6 = this["_getSelectedAssetNodes"](_0x4f49eb);
    const _0x2717b0 = this['_getSelectedAssetEdges'](_0x4f49eb);
    const _0x113fac = Date["now"]();
    const _0x39a9db = {};
    const _0x4b690f = _0x5e4ee6["map"](_0x53cd3d => {
      const _0x1444a7 = _clonePlain(_0x53cd3d, {
        ..._0x53cd3d
      });
      const _0x16f8e7 = String(_0x1444a7['id'] || '');
      const _0x56f35e = generateId(_0x1444a7["type"]);
      if (_0x16f8e7) {
        _0x39a9db[_0x16f8e7] = _0x56f35e;
      }
      _0x1444a7['id'] = _0x56f35e;
      return _0x1444a7;
    });
    const _0x382e8b = _0x2717b0["map"](_0x37e645 => {
      const _0x51b14d = _clonePlain(_0x37e645, {
        ..._0x37e645
      });
      _0x51b14d['id'] = generateId("edge");
      if (_0x39a9db[_0x51b14d["sourceId"]]) {
        _0x51b14d["sourceId"] = _0x39a9db[_0x51b14d["sourceId"]];
      }
      if (_0x39a9db[_0x51b14d["targetId"]]) {
        _0x51b14d["targetId"] = _0x39a9db[_0x51b14d["targetId"]];
      }
      return _0x51b14d;
    });
    const _0x1b0017 = Array["isArray"](_0x2a060b?.["nodes"]) ? _clonePlain(_0x2a060b["nodes"], []) : [];
    const _0x218dc6 = Array["isArray"](_0x2a060b?.["items"]) ? _clonePlain(_0x2a060b["items"], []) : _0x1b0017["map"](_0x50b9b7 => _buildAssetItem(_0x50b9b7));
    const _0x5d9024 = Array["isArray"](_0x2a060b?.['edges']) ? _clonePlain(_0x2a060b["edges"], []) : [];
    const _0x541353 = _0x4b690f[0x0] || null;
    const _0x2e2fe9 = _0x541353 ? resolveAssetNodeCoverUrl(_0x541353) : '';
    const _0x5072a6 = _0x2a060b?.["coverUrl"] || _0x2e2fe9;
    const _0x31ee63 = _0x2a060b?.['coverType'] || _0x541353?.['type'] || "other";
    return {
      ...(_0x2a060b || {}),
      'id': _0x2a060b?.['id'],
      'name': String(_0x5c68d5["name"] || '')['trim']() || assetManagerText("unnamedAsset"),
      'category': String(_0x5c68d5["category"] || '')["trim"]() || this['activeTab'],
      'coverUrl': _0x5072a6,
      'coverType': _0x31ee63,
      'items': [..._0x218dc6, ..._0x4b690f["map"](_0x29de2a => _buildAssetItem(_0x29de2a))],
      'nodes': [..._0x1b0017, ..._0x4b690f],
      'edges': [..._0x5d9024, ..._0x382e8b],
      'createdAt': Number(_0x2a060b?.["createdAt"] || _0x2a060b?.["updatedAt"] || _0x113fac) || _0x113fac,
      'updatedAt': Number(_0x5c68d5["updatedAt"] || _0x113fac) || _0x113fac
    };
  }
  ['_createDefaultPanelState'](_0x433a2b, _0x41ad43, _0x2c7d38 = {}) {
    const _0x40b625 = String(_0x2c7d38["defaultName"] || '')["trim"]();
    return {
      'selectedIds': [..._0x433a2b],
      'presentation': _0x2c7d38['presentation'] === "library-save" ? "library-save" : "default",
      'mode': "create",
      'selectedAssetId': '',
      'updateSearchKeyword': '',
      'updateConfirmOpen': ![],
      'expandedFolderKeys': new Set(),
      'selectedFolderCategory': '',
      'editingFolderCategory': '',
      'editingFolderDraft': '',
      'folderActionBusyKey': '',
      'pendingFolderDeleteKey': '',
      'deletingFolderKey': '',
      'customCategoryEditing': ![],
      'customCategoryDraft': '',
      'customCategories': [],
      'error': '',
      'saving': ![],
      'savingAction': '',
      'draft': {
        'name': _0x40b625 || assetManagerText("newAsset"),
        'category': this["activeTab"]
      },
      'coverInfo': _0x41ad43 || {
        'coverUrl': '',
        'coverType': "other",
        'aspectRatio': 0x4 / 0x3,
        'coverHtml': _renderAssetIcon('other')
      }
    };
  }
  ["_setCreatePanelState"](_0x397ff7 = {}) {
    if (!this["_createPanelState"]) {
      return;
    }
    const _0x37864e = this["_createPanelState"];
    const _0x58d753 = _0x397ff7["draft"] ? {
      ...(_0x37864e['draft'] || {}),
      ..._0x397ff7["draft"]
    } : _0x37864e["draft"];
    this['_createPanelState'] = {
      ..._0x37864e,
      ..._0x397ff7,
      'draft': _0x58d753
    };
  }
  ["_getUpdateListCategory"]() {
    const _0x52ed45 = this["_normalizeCategoryName"](this['_createPanelState']?.["draft"]?.["category"]);
    if (this['_createPanelState']?.["mode"] === "update" && _0x52ed45) {
      return _0x52ed45;
    }
    return this["_findCategoryByName"](this["activeTab"], this["tabs"]) || this["activeTab"];
  }
  ["_getFilteredUpdateAssets"](_0x259992 = '') {
    const _0x60603f = String(_0x259992 || '')["trim"]()['toLowerCase']();
    const _0x80ae7c = this["_categoryKey"](this['_getUpdateListCategory']());
    const _0x42520c = this["_getSortedAssets"]()['filter'](_0x533eef => this["_categoryKey"](_0x533eef?.["category"]) === _0x80ae7c);
    if (!_0x60603f) {
      return _0x42520c;
    }
    return _0x42520c["filter"](_0x3616c1 => String(_0x3616c1?.["name"] || '')["toLowerCase"]()["includes"](_0x60603f));
  }
  ["_syncCreatePanelDraftFromTarget"](_0x1c42ba) {
    this['_setCreatePanelState']({
      'draft': {
        'name': String(_0x1c42ba?.["name"] || '')["trim"]() || assetManagerText("unnamedAsset"),
        'category': String(_0x1c42ba?.["category"] || '')['trim']() || this['activeTab']
      },
      'selectedAssetId': String(_0x1c42ba?.['id'] || ''),
      'updateConfirmOpen': ![],
      'customCategoryEditing': ![],
      'customCategoryDraft': '',
      'error': ''
    });
  }
  ["_syncUpdateSelectionForCategory"](_0x2f4d7d) {
    if (this['_createPanelState']?.["mode"] !== "update") {
      return;
    }
    const _0x39e1e4 = this["_normalizeCategoryName"](_0x2f4d7d) || this["activeTab"];
    this['_setCreatePanelState']({
      'draft': {
        'category': _0x39e1e4
      },
      'selectedAssetId': '',
      'updateSearchKeyword': '',
      'updateConfirmOpen': ![],
      'error': ''
    });
    const _0x48ce19 = this["_getFilteredUpdateAssets"]()[0x0] || null;
    if (!_0x48ce19) {
      return;
    }
    this["_setCreatePanelState"]({
      'draft': {
        'name': String(_0x48ce19?.["name"] || '')["trim"]() || assetManagerText("unnamedAsset"),
        'category': String(_0x48ce19?.['category'] || '')['trim']() || _0x39e1e4
      },
      'selectedAssetId': String(_0x48ce19?.['id'] || '')
    });
  }
  ["_getCreatePanelFolderEntries"]() {
    const _0x4f06a3 = this["_getSortedAssets"]();
    const _0x41c9c2 = this["_getCreatePanelCategories"]()["map"](_0x52956d => {
      const _0x233b13 = _0x4f06a3["filter"](_0x25d6ac => this["_categoryKey"](_0x25d6ac?.["category"]) === this["_categoryKey"](_0x52956d));
      return {
        'category': _0x52956d,
        'assets': _0x233b13
      };
    });
    const _0x5dba53 = getMaterialFolderAssetCounts({
      'groups': _0x41c9c2,
      'parents': this['materialCategoryParents'],
      'categoryKey': _0x4946e0 => this["_categoryKey"](_0x4946e0)
    });
    return _0x41c9c2["map"](_0x58c986 => ({
      ..._0x58c986,
      'count': _0x5dba53["get"](this["_categoryKey"](_0x58c986['category'])) ?? _0x58c986["assets"]['length']
    }));
  }
  ["_renderCreatePanelFolderAssetHtml"](_0x22feb2) {
    const _0xf5894e = getMaterialAssetItems(_0x22feb2);
    const _0x2f707e = _0xf5894e[0x0] || null;
    const _0x21d116 = _resolveMaterialItemThumbSrc(_0x2f707e) || String(_0x22feb2?.["coverUrl"] || '');
    const _0x969df8 = _0x2f707e?.['type'] || _0x22feb2?.["coverType"] || 'other';
    const _0x555b45 = _0x21d116 && !this['_isNonImageMediaSrc'](_0x21d116) ? '<img\x20src=\x22' + _escapeHtml(_0x21d116) + "\" alt=\"\" loading=\"lazy\" decoding=\"async\" draggable=\"false\" />" : _renderAssetIcon(_0x969df8);
    return "\n      <div class=\"v2-material-asset-row\" role=\"treeitem\">\n        <button type=\"button\" class=\"v2-material-asset-toggle\" disabled aria-hidden=\"true\" tabindex=\"-1\"></button>\n        <div class=\"v2-material-asset-use\">\n          <span class=\"v2-material-row-thumb\" aria-hidden=\"true\">" + _0x555b45 + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22v2-material-asset-name\x22>' + _escapeHtml(_0x22feb2?.["name"] || assetManagerText("unnamedAsset")) + "</span>\n        </div>\n      </div>\n    ";
  }
  ['_createMaterialFolderSection']({
    category: _0x22276e,
    count = 0x0,
    expanded = ![],
    canManageFolder = ![],
    isRenamingFolder = ![],
    isSavingFolder = ![],
    isDeleteConfirming = ![],
    isDeletingFolder = ![],
    isDeleteRequested = ![],
    actionPrefix = "material-folder",
    renameValue = ''
  } = {}) {
    const _0x535420 = this["_normalizeCategoryName"](_0x22276e);
    const _0x2d6440 = this['_categoryKey'](_0x535420);
    const _0x4c2f58 = this['_formatCategoryLabel'](_0x535420);
    const _0x5a655e = _0x47f291 => actionPrefix + '-' + _0x47f291;
    const _0x3111f1 = document["createElement"]("section");
    _0x3111f1['className'] = "v2-material-folder";
    _0x3111f1["dataset"]["category"] = _0x535420;
    _0x3111f1['setAttribute']("role", "treeitem");
    _0x3111f1["setAttribute"]("aria-expanded", expanded ? "true" : "false");
    _0x3111f1["classList"]["toggle"]("is-delete-shaking", canManageFolder && isDeleteRequested);
    const _0x2de8f5 = document["createElement"]("div");
    _0x2de8f5["className"] = 'v2-material-folder-row';
    _0x2de8f5["classList"]["toggle"]("has-delete-actions", canManageFolder);
    _0x2de8f5["classList"]["toggle"]("is-renaming", isRenamingFolder);
    _0x2de8f5['classList']["toggle"]("is-saving", isSavingFolder);
    const _0x4ab292 = document["createElement"]("button");
    _0x4ab292["type"] = "button";
    _0x4ab292["className"] = "v2-material-folder-toggle";
    _0x4ab292["dataset"]["uiAction"] = _0x5a655e("toggle");
    _0x4ab292["dataset"]["category"] = _0x535420;
    _0x4ab292["setAttribute"]("aria-expanded", expanded ? "true" : 'false');
    _0x4ab292["setAttribute"]("aria-label", assetManagerText(expanded ? "collapseFolder" : "expandFolder", {
      'name': _0x4c2f58
    }));
    _0x4ab292['disabled'] = isRenamingFolder || isDeletingFolder;
    _0x4ab292["innerHTML"] = "\n      <span class=\"v2-material-tree-chevron" + (expanded ? '\x20is-open' : '') + "\" aria-hidden=\"true\">\n        " + MATERIAL_TREE_CHEVRON_ICON_SVG + "\n      </span>\n      <span class=\"v2-material-folder-icon\" aria-hidden=\"true\">\n        " + MATERIAL_FOLDER_ICON_MARKUP + "\n      </span>\n    ";
    _0x2de8f5['appendChild'](_0x4ab292);
    if (isRenamingFolder) {
      const _0x1f3ac8 = document["createElement"]("input");
      _0x1f3ac8["type"] = 'text';
      _0x1f3ac8["className"] = "v2-material-folder-name-input";
      _0x1f3ac8["dataset"]['category'] = _0x535420;
      _0x1f3ac8['dataset']['categoryKey'] = _0x2d6440;
      _0x1f3ac8["value"] = String(renameValue || _0x4c2f58);
      _0x1f3ac8["maxLength"] = 0x20;
      _0x1f3ac8["disabled"] = isSavingFolder;
      _0x1f3ac8["setAttribute"]("aria-label", assetManagerText('renameCategoryAria', {
        'category': _0x4c2f58
      }));
      if (isSavingFolder) {
        _0x1f3ac8["setAttribute"]("aria-busy", "true");
      }
      _0x2de8f5["appendChild"](_0x1f3ac8);
    } else {
      if (canManageFolder) {
        const _0x193438 = document['createElement']('button');
        _0x193438['type'] = "button";
        _0x193438["className"] = "v2-material-folder-name is-renameable";
        _0x193438["dataset"]['uiAction'] = _0x5a655e('rename');
        _0x193438["dataset"]["category"] = _0x535420;
        _0x193438['setAttribute']('aria-label', assetManagerText('renameCategoryAria', {
          'category': _0x4c2f58
        }));
        _0x193438["textContent"] = _0x4c2f58;
        _0x2de8f5["appendChild"](_0x193438);
      } else {
        const _0x2aac5e = document['createElement']("span");
        _0x2aac5e["className"] = 'v2-material-folder-name';
        _0x2aac5e['textContent'] = _0x4c2f58;
        _0x2de8f5["appendChild"](_0x2aac5e);
      }
    }
    if (canManageFolder) {
      const _0x11563d = document["createElement"]("div");
      _0x11563d["className"] = 'v2-material-folder-delete-actions';
      _0x11563d["classList"]['toggle']("is-confirming", isDeleteConfirming);
      _0x11563d["classList"]["toggle"]("is-busy", isDeletingFolder);
      _0x11563d['setAttribute']("aria-busy", isDeletingFolder ? "true" : "false");
      if (isDeletingFolder) {
        const _0x15bd35 = document["createElement"]('span');
        _0x15bd35["className"] = 'v2-material-folder-delete-pending';
        _0x15bd35['setAttribute']("role", 'status');
        _0x15bd35["setAttribute"]("aria-live", 'polite');
        _0x15bd35['setAttribute']("aria-label", assetManagerText("menu.processing"));
        _0x15bd35['innerHTML'] = "<span aria-hidden=\"true\"></span>";
        _0x11563d["appendChild"](_0x15bd35);
      } else {
        if (isDeleteConfirming) {
          const _0xbb3579 = document["createElement"]("button");
          _0xbb3579["type"] = "button";
          _0xbb3579['className'] = "v2-material-folder-delete-choice is-confirm";
          _0xbb3579["dataset"]["uiAction"] = _0x5a655e("delete-confirm");
          _0xbb3579["dataset"]["category"] = _0x535420;
          _0xbb3579["textContent"] = assetManagerText("confirm");
          _0xbb3579['setAttribute']('aria-label', assetManagerText("confirm") + '\x20' + _0x4c2f58);
          const _0x114917 = document["createElement"]('button');
          _0x114917["type"] = 'button';
          _0x114917["className"] = "v2-material-folder-delete-choice is-cancel";
          _0x114917["dataset"]["uiAction"] = _0x5a655e("delete-cancel");
          _0x114917['dataset']["category"] = _0x535420;
          _0x114917["textContent"] = assetManagerText('cancel');
          _0x114917["setAttribute"]("aria-label", assetManagerText("cancel") + '\x20' + _0x4c2f58);
          _0x11563d["append"](_0xbb3579, _0x114917);
        } else {
          const _0x2cb8fe = document['createElement']("button");
          _0x2cb8fe["type"] = "button";
          _0x2cb8fe["className"] = "v2-material-folder-delete-trigger";
          _0x2cb8fe["dataset"]["uiAction"] = _0x5a655e("delete-request");
          _0x2cb8fe["dataset"]["category"] = _0x535420;
          _0x2cb8fe['setAttribute']("aria-label", assetManagerText("deleteCategoryAria", {
            'category': _0x4c2f58
          }));
          _0x2cb8fe["innerHTML"] = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20aria-hidden=\x22true\x22\x20fill=\x22none\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<path\x20d=\x22M4\x207h16M9\x203h6l1\x204H8l1-4Zm-2\x204\x201\x2014h8l1-14M10\x2011v6m4-6v6\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x221.7\x22\x20stroke-linecap=\x22round\x22\x20stroke-linejoin=\x22round\x22/>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</svg>\x0a\x20\x20\x20\x20\x20\x20\x20\x20';
          _0x11563d["appendChild"](_0x2cb8fe);
        }
      }
      _0x2de8f5['appendChild'](_0x11563d);
    }
    const _0x376bca = document["createElement"]("span");
    _0x376bca['className'] = "v2-material-folder-count";
    _0x376bca['textContent'] = String(count);
    _0x2de8f5["appendChild"](_0x376bca);
    _0x3111f1["appendChild"](_0x2de8f5);
    const _0x4b0fd7 = document["createElement"]('div');
    _0x4b0fd7["className"] = "v2-material-folder-content";
    _0x4b0fd7["setAttribute"]("role", 'group');
    _0x4b0fd7["hidden"] = !expanded;
    _0x3111f1["appendChild"](_0x4b0fd7);
    return {
      'section': _0x3111f1,
      'folderRow': _0x2de8f5,
      'folderContent': _0x4b0fd7,
      'folderToggle': _0x4ab292
    };
  }
  ["_nestMaterialFolderSections"](_0x2831c4) {
    if (!_0x2831c4) {
      return;
    }
    const _0x1a5e36 = Array["from"](_0x2831c4["querySelectorAll"](":scope > .v2-material-folder"));
    const _0x36636b = new Map(_0x1a5e36["map"](_0x44a5d8 => [this['_categoryKey'](_0x44a5d8["dataset"]["category"]), _0x44a5d8]));
    for (const _0x1bb35d of _0x1a5e36) {
      const _0x2da094 = _0x1bb35d['dataset']["category"];
      const _0x1c0b7b = this['_getMaterialParentCategory'](_0x2da094);
      const _0x81a189 = _0x36636b["get"](this["_categoryKey"](_0x1c0b7b));
      if (!_0x81a189 || _0x81a189 === _0x1bb35d) {
        continue;
      }
      const _0x5e6b85 = _0x81a189["querySelector"](":scope > .v2-material-folder-content");
      if (!_0x5e6b85) {
        continue;
      }
      _0x5e6b85["querySelector"](":scope > .v2-material-folder-empty")?.["remove"]();
      _0x1bb35d["classList"]["add"]('is-nested');
      const _0x45b7d = Array["from"](_0x5e6b85["children"])["find"](_0x3548a7 => !_0x3548a7["classList"]['contains']('v2-material-folder'));
      _0x5e6b85["insertBefore"](_0x1bb35d, _0x45b7d || null);
    }
  }
  ['_renderCreatePanelFolderTree'](_0x1b2d67 = {}) {
    const _0x5f1dc1 = this["createPanel"]?.['querySelector']("[data-asset-create-folder-tree]");
    const _0x90eb22 = this['_createPanelState'];
    if (!_0x5f1dc1 || !_0x90eb22) {
      return;
    }
    const _0x27b6f4 = _0x5f1dc1["scrollTop"];
    const _0x4d44b2 = this["_normalizeCategoryName"](_0x90eb22["selectedFolderCategory"]);
    const _0x26a4cf = this['_categoryKey'](_0x4d44b2);
    const _0x53bcff = _0x90eb22["expandedFolderKeys"] instanceof Set ? _0x90eb22["expandedFolderKeys"] : new Set();
    const _0x169fb1 = this["_categoryKey"](_0x90eb22['editingFolderCategory']);
    const _0x15fd82 = String(_0x90eb22["folderActionBusyKey"] || '');
    const _0x49c6ba = String(_0x90eb22["pendingFolderDeleteKey"] || '');
    const _0x62c86a = String(_0x90eb22["deletingFolderKey"] || '');
    const _0x315ded = document["createDocumentFragment"]();
    this["_getCreatePanelFolderEntries"]()['forEach'](({
      category: _0x2889be,
      count: _0x39f4a9,
      assets: _0x163e6e
    }) => {
      const _0x413141 = this["_categoryKey"](_0x2889be);
      const _0x10ed7b = this['_isUserCategory'](_0x2889be);
      const _0x2e02ee = _0x53bcff["has"](_0x413141);
      const _0x3343ee = _0x10ed7b && _0x169fb1 === _0x413141;
      const _0x120ee5 = _0x10ed7b && _0x62c86a === _0x413141;
      const {
        section: _0x2a8006,
        folderContent: _0x52690f
      } = this['_createMaterialFolderSection']({
        'category': _0x2889be,
        'count': _0x39f4a9,
        'expanded': _0x2e02ee,
        'canManageFolder': _0x10ed7b,
        'isRenamingFolder': _0x3343ee,
        'isSavingFolder': _0x3343ee && _0x15fd82 === _0x413141,
        'isDeleteConfirming': _0x10ed7b && (_0x49c6ba === _0x413141 || _0x120ee5),
        'isDeletingFolder': _0x120ee5,
        'isDeleteRequested': _0x49c6ba === _0x413141,
        'actionPrefix': "asset-create-folder",
        'renameValue': _0x90eb22["editingFolderDraft"]
      });
      _0x2a8006["dataset"]['assetCreateFolder'] = '';
      _0x2a8006["setAttribute"]('aria-selected', _0x413141 === _0x26a4cf ? "true" : "false");
      _0x52690f["innerHTML"] = _0x163e6e["length"] ? _0x163e6e['map'](_0x22ede0 => this['_renderCreatePanelFolderAssetHtml'](_0x22ede0))["join"]('') : "<div class=\"v2-material-folder-empty\">" + _escapeHtml(assetManagerText("emptyFolder")) + '</div>';
      _0x315ded["appendChild"](_0x2a8006);
    });
    _0x5f1dc1["replaceChildren"](_0x315ded);
    this['_nestMaterialFolderSections'](_0x5f1dc1);
    _0x5f1dc1["scrollTop"] = _0x27b6f4;
    this['_syncCreatePanelError']();
    _0x1b2d67["focusRename"] === !![] && window["requestAnimationFrame"](() => {
      const _0x1f4121 = _0x5f1dc1["querySelector"](".v2-material-folder-name-input");
      _0x1f4121?.["focus"]();
      _0x1f4121?.['select']?.();
    });
  }
  ["_syncCreatePanelError"]() {
    const _0x4167f5 = this["createPanel"]?.["querySelector"](".v2-asset-create-error");
    if (!_0x4167f5) {
      return;
    }
    const _0xea9b71 = String(this["_createPanelState"]?.["error"] || '');
    _0x4167f5["textContent"] = _0xea9b71;
    _0x4167f5["hidden"] = !_0xea9b71;
  }
  ['_renderLibrarySavePanelContent']() {
    const _0x2f8ae6 = this["createPanel"];
    const _0x1e61ec = this['_createPanelState'];
    if (!_0x2f8ae6 || !_0x1e61ec) {
      return;
    }
    const _0x82757c = Array["isArray"](_0x1e61ec["selectedIds"]) ? _0x1e61ec["selectedIds"]["length"] : 0x0;
    const _0x1cfb57 = _0x1e61ec["coverInfo"] || {};
    const _0x5b9930 = _0x1cfb57['coverHtml'] || _renderAssetIcon(_0x1cfb57["coverType"] || 'other');
    const _0x32befe = Number(_0x1cfb57["aspectRatio"]) > 0x0 ? Number(_0x1cfb57['aspectRatio']) : 0x4 / 0x3;
    const _0xd5805d = _0x1e61ec['saving'] ? assetManagerText('createPanel.saving') : assetManagerText("createPanel.save");
    _0x2f8ae6["innerHTML"] = "\n      <div class=\"v2-asset-create-header v2-asset-create-header--library-save\">\n        <div class=\"v2-asset-create-title\">\n          <span class=\"v2-asset-create-header-text\">" + assetManagerText("createPanel.saveTitle") + "</span>\n        </div>\n        <button\n          type=\"button\"\n          class=\"v2-asset-create-new-folder\"\n          data-ui-action=\"asset-create-new-folder\"\n        >\n          <svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\">\n            <path d=\"M12 5v14M5 12h14\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\"/>\n          </svg>\n          <span>" + assetManagerText("newFolder") + "</span>\n        </button>\n      </div>\n      <div class=\"v2-asset-create-modal-body v2-asset-create-modal-body--library-save\">\n        <div class=\"v2-asset-create-library-layout\">\n          <section class=\"v2-asset-create-source-panel\">\n            <div class=\"v2-asset-create-source-header\">\n              <div class=\"v2-asset-create-source-title\">" + assetManagerText("createPanel.currentSelection") + "</div>\n              <div class=\"v2-asset-create-source-scope\">" + assetManagerText('createPanel.selectedNodes', {
      'count': _0x82757c
    }) + "</div>\n            </div>\n            <div class=\"v2-asset-create-preview-stage\">\n              <div class=\"v2-asset-create-cover\">\n                " + _0x5b9930 + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<label\x20class=\x22v2-asset-create-field\x22\x20for=\x22asset-create-name\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22v2-asset-create-label\x22>' + assetManagerText('createPanel.assetName') + "</span>\n              <input\n                type=\"text\"\n                id=\"asset-create-name\"\n                placeholder=\"" + _escapeHtml(assetManagerText("createPanel.assetNamePlaceholder")) + "\"\n                value=\"" + _escapeHtml(_0x1e61ec["draft"]?.["name"] || '') + '\x22\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20autocomplete=\x22off\x22\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20/>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</label>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22v2-asset-create-error\x22\x20role=\x22alert\x22' + (_0x1e61ec["error"] ? '' : " hidden") + '>' + _escapeHtml(_0x1e61ec["error"] || '') + "</div>\n          </section>\n          <section class=\"v2-asset-create-library-pane\">\n            <div\n              class=\"v2-asset-create-folder-list v2-material-library-tree\"\n              data-asset-create-folder-tree\n              role=\"tree\"\n              aria-label=\"" + _escapeHtml(assetManagerText("createPanel.folderListAria")) + "\"\n            >\n            </div>\n          </section>\n        </div>\n      </div>\n      <div class=\"v2-asset-create-footer v2-asset-create-footer--library-save\">\n        <button\n          type=\"button\"\n          class=\"v2-asset-create-btn v2-asset-create-btn--secondary\"\n          data-ui-action=\"asset-create-cancel\"\n          " + (_0x1e61ec['saving'] ? 'disabled' : '') + "\n        >" + assetManagerText("cancel") + "</button>\n        <button\n          type=\"button\"\n          class=\"v2-asset-create-btn\"\n          id=\"asset-create-submit\"\n          aria-busy=\"" + (_0x1e61ec['saving'] ? 'true' : "false") + "\"\n          " + (_0x1e61ec['saving'] ? "disabled" : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22v2-asset-create-submit-spinner\x22\x20aria-hidden=\x22true\x22' + (_0x1e61ec["saving"] ? '' : " hidden") + "></span>\n          <span>" + _0xd5805d + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20';
    this["_applyCreatePanelCoverAspect"](_0x2f8ae6['querySelector'](".v2-asset-create-cover"), _0x32befe);
    this["_renderCreatePanelFolderTree"]();
    this["_bindLibrarySavePanelEvents"]();
  }
  ["_bindLibrarySavePanelEvents"]() {
    const _0x55b645 = this["createPanel"];
    const _0x49f0b0 = this['_createPanelState'];
    if (!_0x55b645 || !_0x49f0b0) {
      return;
    }
    _0x55b645["querySelector"]('[data-ui-action=\x27asset-create-cancel\x27]')?.["addEventListener"]('click', () => this["closeCreatePanel"]());
    _0x55b645["querySelector"]('[data-ui-action=\x27asset-create-new-folder\x27]')?.["addEventListener"]("click", () => {
      this["_createMaterialFolder"]({
        'parentCategory': this["_createPanelState"]?.["selectedFolderCategory"] || '',
        'surface': "create-panel"
      });
    });
    const _0x984f70 = _0x55b645["querySelector"]("[data-asset-create-folder-tree]");
    _0x984f70?.['addEventListener']('click', _0x4265f9 => {
      const _0x43f080 = _0x4265f9['target']["closest"]('[data-ui-action]');
      const _0x10de91 = String(_0x43f080?.["dataset"]?.["uiAction"] || '');
      const _0x3982fd = this["_normalizeCategoryName"](_0x43f080?.["dataset"]?.["category"]);
      if (_0x10de91 === "asset-create-folder-rename" && _0x3982fd) {
        this["_beginCreatePanelFolderRename"](_0x3982fd);
        return;
      }
      if (_0x10de91 === 'asset-create-folder-delete-request' && _0x3982fd) {
        if (!this['_isUserCategory'](_0x3982fd)) {
          return;
        }
        this["_setCreatePanelState"]({
          'pendingFolderDeleteKey': this['_categoryKey'](_0x3982fd),
          'error': ''
        });
        this['_renderCreatePanelFolderTree']();
        return;
      }
      if (_0x10de91 === "asset-create-folder-delete-cancel") {
        this["_setCreatePanelState"]({
          'pendingFolderDeleteKey': ''
        });
        this["_renderCreatePanelFolderTree"]();
        return;
      }
      if (_0x10de91 === "asset-create-folder-delete-confirm" && _0x3982fd) {
        void this["_deleteCreatePanelFolder"](_0x3982fd);
        return;
      }
      if (_0x10de91 === "asset-create-folder-toggle" && _0x3982fd) {
        this["_toggleCreatePanelFolderDisclosure"](_0x3982fd);
        return;
      }
      if (_0x10de91 || _0x4265f9["target"]["closest"]("input, button, [contenteditable='true'], .v2-material-folder-delete-actions")) {
        return;
      }
      const _0x335be9 = _0x4265f9['target']["closest"](".v2-material-folder-row");
      const _0x275922 = _0x335be9?.['querySelector']("[data-ui-action='asset-create-folder-toggle']");
      if (_0x275922 && !_0x275922["disabled"] && _0x4265f9["detail"] <= 0x1) {
        this['_toggleCreatePanelFolderDisclosure'](_0x275922["dataset"]["category"]);
        return;
      }
      _0x4265f9["target"] === _0x984f70 && this['_createPanelState']?.['selectedFolderCategory'] && (this["_setCreatePanelState"]({
        'selectedFolderCategory': ''
      }), this["_renderCreatePanelFolderTree"]());
    });
    _0x984f70?.["addEventListener"]("input", _0x4837de => {
      const _0x187fb9 = _0x4837de["target"]["closest"](".v2-material-folder-name-input");
      if (!_0x187fb9) {
        return;
      }
      this["_setCreatePanelState"]({
        'editingFolderDraft': _0x187fb9["value"] || '',
        'error': ''
      });
      this['_syncCreatePanelError']();
    });
    _0x984f70?.["addEventListener"]("keydown", _0x4de2e7 => {
      const _0x172576 = _0x4de2e7["target"]["closest"]('.v2-material-folder-name-input');
      if (!_0x172576) {
        return;
      }
      if (_0x4de2e7["key"] === "Enter" && !_0x4de2e7["isComposing"]) {
        _0x4de2e7["preventDefault"]();
        _0x4de2e7["stopPropagation"]();
        _0x172576["dataset"]['submitted'] = '1';
        void this["_commitCreatePanelFolderRename"](_0x172576["dataset"]["category"], _0x172576["value"]);
        return;
      }
      _0x4de2e7["key"] === "Escape" && (_0x4de2e7["preventDefault"](), _0x4de2e7["stopPropagation"](), _0x172576['dataset']["submitted"] = '1', this["_renamingMaterialCategoryKey"] = '', this["_setCreatePanelState"]({
        'editingFolderCategory': '',
        'editingFolderDraft': '',
        'folderActionBusyKey': '',
        'error': ''
      }), this["_renderCreatePanelFolderTree"]());
    });
    _0x984f70?.["addEventListener"]("focusout", _0x445945 => {
      const _0x35d04c = _0x445945["target"]["closest"](".v2-material-folder-name-input");
      if (!_0x35d04c || _0x35d04c['dataset']["submitted"] === '1') {
        return;
      }
      _0x35d04c["dataset"]['submitted'] = '1';
      void this["_commitCreatePanelFolderRename"](_0x35d04c['dataset']["category"], _0x35d04c['value']);
    });
    const _0x2fe47d = _0x55b645["querySelector"]("#asset-create-name");
    _0x2fe47d?.["addEventListener"]('input', _0x4f5f58 => {
      this["_setCreatePanelState"]({
        'draft': {
          'name': _0x4f5f58["currentTarget"]?.['value'] || ''
        },
        'error': ''
      });
    });
    _0x2fe47d?.['addEventListener']("keydown", _0x588fc3 => {
      if (_0x588fc3["key"] !== "Enter" || _0x588fc3['isComposing']) {
        return;
      }
      _0x588fc3["preventDefault"]();
      void this["_submitCreatePanel"]();
    });
    _0x55b645["querySelector"]("#asset-create-submit")?.["addEventListener"]("click", () => {
      void this["_submitCreatePanel"]();
    });
  }
  ["_toggleCreatePanelFolderDisclosure"](_0x4b3d4f) {
    const _0x138d41 = this["_findCategoryByName"](_0x4b3d4f, this["tabs"]);
    const _0x2e15cc = this['_categoryKey'](_0x138d41);
    if (!_0x138d41 || !_0x2e15cc) {
      return;
    }
    this["_materialCurrentFolderCategory"] = _0x138d41;
    const _0x36d7fd = new Set(this["_createPanelState"]?.["expandedFolderKeys"] || []);
    _0x36d7fd["has"](_0x2e15cc) ? _0x36d7fd["delete"](_0x2e15cc) : _0x36d7fd["add"](_0x2e15cc);
    this["_setCreatePanelState"]({
      'draft': {
        'category': _0x138d41
      },
      'selectedFolderCategory': _0x138d41,
      'expandedFolderKeys': _0x36d7fd,
      'error': ''
    });
    this["_renderCreatePanelFolderTree"]();
  }
  ['_beginCreatePanelFolderRename'](_0x421545) {
    const _0x16a550 = this['_findCategoryByName'](_0x421545, this['tabs']);
    const _0x54333b = this["_categoryKey"](_0x16a550);
    if (!_0x16a550 || !_0x54333b || !this['_isUserCategory'](_0x16a550) || this['_createPanelState']?.["folderActionBusyKey"]) {
      return;
    }
    this["_materialCurrentFolderCategory"] = _0x16a550;
    this['_renamingMaterialCategoryKey'] = _0x54333b;
    this['_setCreatePanelState']({
      'editingFolderCategory': _0x16a550,
      'editingFolderDraft': this['_formatCategoryLabel'](_0x16a550),
      'pendingFolderDeleteKey': '',
      'error': ''
    });
    this["_renderCreatePanelFolderTree"]({
      'focusRename': !![]
    });
  }
  async ["_deleteCreatePanelFolder"](_0x256fdf) {
    const _0x238c52 = this["_findCategoryByName"](_0x256fdf, this["tabs"]);
    const _0x277eec = this['_categoryKey'](_0x238c52);
    if (!_0x238c52 || !_0x277eec || !this["_isUserCategory"](_0x238c52) || this['_createPanelState']?.["pendingFolderDeleteKey"] !== _0x277eec || this["_createPanelState"]?.["deletingFolderKey"]) {
      return ![];
    }
    const _0xd29795 = this["_categoryKey"](this["_createPanelState"]["draft"]?.["category"]) === _0x277eec;
    const _0x59c45c = this['_categoryKey'](this["_createPanelState"]['selectedFolderCategory']) === _0x277eec;
    this["_setCreatePanelState"]({
      'pendingFolderDeleteKey': '',
      'deletingFolderKey': _0x277eec,
      'folderActionBusyKey': _0x277eec,
      'error': ''
    });
    this["_renderCreatePanelFolderTree"]();
    const _0x3d0f9c = await this["_deleteUserCategory"](_0x238c52);
    if (!this["createPanel"] || !this["_createPanelState"]) {
      return _0x3d0f9c;
    }
    if (!_0x3d0f9c) {
      this["_setCreatePanelState"]({
        'deletingFolderKey': '',
        'folderActionBusyKey': ''
      });
      this['_renderCreatePanelFolderTree']();
      return ![];
    }
    const _0x13b7a3 = this["_findCategoryByName"]("Others", this["tabs"]) || this["tabs"][0x0] || DEFAULT_ASSET_CATEGORIES[0x0];
    const _0x3a962f = new Set(this['_createPanelState']["expandedFolderKeys"] || []);
    _0x3a962f["delete"](_0x277eec);
    const _0x3cd86e = (this["_createPanelState"]["customCategories"] || [])["filter"](_0x418edd => this["_categoryKey"](_0x418edd) !== _0x277eec);
    this['_setCreatePanelState']({
      'draft': _0xd29795 ? {
        'category': _0x13b7a3
      } : undefined,
      'selectedFolderCategory': _0x59c45c ? '' : this["_createPanelState"]["selectedFolderCategory"],
      'customCategories': _0x3cd86e,
      'expandedFolderKeys': _0x3a962f,
      'editingFolderCategory': '',
      'editingFolderDraft': '',
      'pendingFolderDeleteKey': '',
      'deletingFolderKey': '',
      'folderActionBusyKey': '',
      'error': ''
    });
    this['_renderCreatePanelFolderTree']();
    return !![];
  }
  async ["_commitCreatePanelFolderRename"](_0x20694e, _0xeb07a3) {
    const _0x3f9f65 = this["_findCategoryByName"](_0x20694e, this['tabs']);
    const _0x1545e5 = this["_categoryKey"](_0x3f9f65);
    if (!_0x3f9f65 || !_0x1545e5 || !this['_isUserCategory'](_0x3f9f65) || !this['createPanel'] || this["_createPanelState"]?.["folderActionBusyKey"]) {
      return ![];
    }
    const _0x4229df = this["_isUserCategory"](_0x3f9f65);
    const _0x3baed8 = this["_categoryKey"](this["_createPanelState"]?.["draft"]?.["category"]) === _0x1545e5;
    const _0x4e87f9 = this["_categoryKey"](this["_createPanelState"]?.['selectedFolderCategory']) === _0x1545e5;
    const _0x1a3212 = new Set(this["_createPanelState"]?.['expandedFolderKeys'] || []);
    this["_renamingMaterialCategoryKey"] = _0x1545e5;
    this['_setCreatePanelState']({
      'editingFolderDraft': String(_0xeb07a3 || ''),
      'folderActionBusyKey': _0x1545e5,
      'error': ''
    });
    this["_renderCreatePanelFolderTree"]();
    const _0x31c603 = await this["_commitRenameMaterialCategory"](_0x3f9f65, _0xeb07a3);
    if (!this["createPanel"] || !this["_createPanelState"]) {
      return _0x31c603;
    }
    if (!_0x31c603) {
      this['_renamingMaterialCategoryKey'] === _0x1545e5 && (this["_renamingMaterialCategoryKey"] = '');
      this["_setCreatePanelState"]({
        'folderActionBusyKey': '',
        'error': assetManagerText("categoryRenameFailed")
      });
      this["_renderCreatePanelFolderTree"]({
        'focusRename': !![]
      });
      return ![];
    }
    const _0x57a5b4 = _0x4229df ? this['_findCategoryByName'](_0xeb07a3, this["tabs"]) || this["_normalizeCategoryName"](_0xeb07a3) : _0x3f9f65;
    const _0x580e65 = this["_categoryKey"](_0x57a5b4);
    _0x1a3212["delete"](_0x1545e5) && _0x1a3212["add"](_0x580e65);
    const _0x2ad77f = (this["_createPanelState"]['customCategories'] || [])["map"](_0x5a4305 => this['_categoryKey'](_0x5a4305) === _0x1545e5 ? _0x57a5b4 : _0x5a4305);
    this["_setCreatePanelState"]({
      'draft': _0x3baed8 ? {
        'category': _0x57a5b4
      } : undefined,
      'selectedFolderCategory': _0x4e87f9 ? _0x57a5b4 : this["_createPanelState"]["selectedFolderCategory"],
      'customCategories': _0x2ad77f,
      'expandedFolderKeys': _0x1a3212,
      'editingFolderCategory': '',
      'editingFolderDraft': '',
      'folderActionBusyKey': '',
      'error': ''
    });
    this['_renderCreatePanelFolderTree']();
    return !![];
  }
  ['_renderCreatePanelContent']() {
    const _0x47a4d4 = this["createPanel"];
    const _0x5fb7a1 = this['_createPanelState'];
    if (!_0x47a4d4 || !_0x5fb7a1) {
      return;
    }
    if (_0x5fb7a1["presentation"] === 'library-save') {
      this["_renderLibrarySavePanelContent"]();
      return;
    }
    const _0x196fb2 = _0x5fb7a1['coverInfo']?.['coverHtml'] || _renderAssetIcon(_0x5fb7a1["coverInfo"]?.["coverType"] || "other");
    const _0x175a3a = _0x5fb7a1["mode"] === "update" ? assetManagerText("createPanel.updateTitle") : assetManagerText('createPanel.createTitle');
    const _0x438eab = Array['isArray'](_0x5fb7a1['selectedIds']) ? _0x5fb7a1['selectedIds']['length'] : 0x0;
    const _0x3efc4d = _0x5fb7a1['saving'] ? _0x5fb7a1["mode"] === "update" && _0x5fb7a1["savingAction"] === "join" ? assetManagerText('createPanel.overwrite') : _0x5fb7a1["mode"] === "update" ? assetManagerText("createPanel.saving") : assetManagerText("createPanel.creating") : _0x5fb7a1["mode"] === "update" ? _0x5fb7a1["updateConfirmOpen"] ? assetManagerText('createPanel.confirmOverwrite') : assetManagerText("createPanel.overwrite") : assetManagerText("createPanel.create");
    const _0x8adda8 = _0x5fb7a1["saving"] && _0x5fb7a1["savingAction"] === "join" ? assetManagerText("createPanel.joining") : assetManagerText('createPanel.join');
    const _0x52716e = this['_getFilteredUpdateAssets'](_0x5fb7a1['updateSearchKeyword']);
    const _0x495460 = _0x52716e["find"](_0x3fbfb2 => String(_0x3fbfb2?.['id'] || '') === _0x5fb7a1['selectedAssetId']) || null;
    const _0x2feff3 = this["_getUpdateListCategory"]();
    const _0x6ffa46 = _0x5fb7a1["error"] ? "<div class=\"v2-asset-create-error\" role=\"alert\">" + _escapeHtml(_0x5fb7a1["error"]) + "</div>" : '';
    const _0x115553 = _0x5fb7a1["mode"] === "update" && _0x5fb7a1['updateConfirmOpen'] && _0x495460 ? "<div class=\"v2-asset-create-confirm\">" + _escapeHtml(assetManagerText("createPanel.confirmOverwriteAsset", {
      'name': _0x495460['name'] || assetManagerText('unnamedAsset')
    })) + "</div>" : '';
    const _0x5366c1 = _0x5fb7a1["mode"] === "update" ? "\n          <div class=\"v2-asset-update-layout\">\n            <div class=\"v2-asset-update-picker\">\n              <input\n                type=\"search\"\n                class=\"v2-asset-update-search\"\n                id=\"asset-update-search\"\n                placeholder=\"" + _escapeHtml(assetManagerText("createPanel.searchAssets", {
      'category': this["_formatCategoryLabel"](_0x2feff3)
    })) + "\"\n                value=\"" + _escapeHtml(_0x5fb7a1['updateSearchKeyword'] || '') + '\x22\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20/>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22v2-asset-update-list\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x52716e["length"] === 0x0 ? "<div class=\"v2-asset-update-empty\">" + (String(_0x5fb7a1["updateSearchKeyword"] || '')['trim']() ? _escapeHtml(assetManagerText("createPanel.noMatchedAssets")) : _escapeHtml(assetManagerText("createPanel.noCategoryAssets", {
      'category': this["_formatCategoryLabel"](_0x2feff3)
    }))) + "</div>" : _0x52716e["map"](_0x2506f7 => {
      const _0x13d624 = String(_0x2506f7?.['id'] || '') === _0x5fb7a1["selectedAssetId"] ? " active" : '';
      const _0x4f73a9 = _0x2506f7?.["coverUrl"] ? "<img src=\"" + _escapeHtml(_0x2506f7["coverUrl"]) + "\" alt=\"" + _escapeHtml(_0x2506f7?.['name'] || assetManagerText("assetAlt")) + "\" draggable=\"false\" />" : _renderAssetIcon(_0x2506f7?.['coverType'] || "other");
      return '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20type=\x22button\x22\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20class=\x22v2-asset-update-item' + _0x13d624 + "\"\n                              data-asset-id=\"" + _escapeHtml(_0x2506f7['id']) + "\"\n                            >\n                              <div class=\"v2-asset-update-thumb\">" + _0x4f73a9 + "</div>\n                              <div class=\"v2-asset-update-info\">\n                                <span>" + _escapeHtml(_0x2506f7["name"] || assetManagerText("unnamedAsset")) + "</span>\n                                <small>" + _formatAssetDateTime(_0x2506f7['updatedAt'] || _0x2506f7["createdAt"]) + "</small>\n                              </div>\n                            </button>\n                          ";
    })["join"]('')) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22v2-asset-update-editor\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' : '';
    const _0x15a1d3 = _0x5fb7a1['mode'] === "update" ? "</div></div>" : '';
    const _0x3c6503 = _0x5fb7a1["mode"] === 'update';
    const _0x569f60 = _0x3c6503 ? "v2-asset-create-body v2-asset-create-body--update" : 'v2-asset-create-body';
    const _0x361cce = _0x3c6503 ? '' : '\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22v2-asset-create-source-panel\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22v2-asset-create-source-header\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22v2-asset-create-source-title\x22>' + assetManagerText('createPanel.currentSelection') + "</div>\n            <div class=\"v2-asset-create-source-scope\">" + assetManagerText('createPanel.selectedNodes', {
      'count': _0x438eab
    }) + '</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22v2-asset-create-cover\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + _0x196fb2 + "\n          </div>\n        </div>\n      ";
    _0x47a4d4['innerHTML'] = "\n      <div class=\"v2-asset-create-header\">\n        <div class=\"v2-asset-create-title\">\n          <span class=\"v2-asset-create-header-text\">" + _0x175a3a + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22v2-asset-create-close\x22\x20data-ui-action=\x22asset-create-close\x22\x20aria-label=\x22' + _escapeHtml(assetManagerText("close")) + "\">×</button>\n      </div>\n      <div class=\"v2-asset-create-tabs\">\n        <button\n          type=\"button\"\n          class=\"v2-asset-create-tab" + (_0x5fb7a1["mode"] === "create" ? " active" : '') + "\"\n          data-mode=\"create\"\n        >" + assetManagerText("createPanel.createTab") + "</button>\n        <button\n          type=\"button\"\n          class=\"v2-asset-create-tab" + (_0x5fb7a1["mode"] === "update" ? " active" : '') + "\"\n          data-mode=\"update\"\n        >" + assetManagerText('createPanel.updateTab') + "</button>\n      </div>\n      <div class=\"v2-asset-create-modal-body\">\n        " + _0x5366c1 + "\n        <div class=\"" + _0x569f60 + "\">\n          " + _0x361cce + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22v2-asset-create-right\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22v2-asset-create-field\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22v2-asset-create-label\x22>' + assetManagerText("createPanel.assetName") + "</div>\n              <input\n                type=\"text\"\n                id=\"asset-create-name\"\n                placeholder=\"" + _escapeHtml(assetManagerText('createPanel.assetNamePlaceholder')) + '\x22\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value=\x22' + _escapeHtml(_0x5fb7a1["draft"]?.["name"] || '') + "\"\n              />\n            </div>\n            <div class=\"v2-asset-create-field\">\n              <div class=\"v2-asset-create-label\">" + assetManagerText("createPanel.category") + '</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22v2-asset-create-select-trigger\x22\x20id=\x22asset-create-category-trigger\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20id=\x22asset-create-category-val\x22>' + _escapeHtml(this["_formatCategoryLabel"](_0x5fb7a1["draft"]?.["category"] || this["activeTab"])) + "</span>\n                <svg width=\"12\" height=\"8\" viewBox=\"0 0 12 8\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                  <path d=\"M1 1.5L6 6.5L11 1.5\" stroke=\"var(--white-40)\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                </svg>\n              </button>\n            </div>\n            " + _0x6ffa46 + "\n            " + _0x115553 + "\n          </div>\n        </div>\n        " + _0x15a1d3 + "\n      </div>\n      <div class=\"v2-asset-create-footer" + (_0x3c6503 ? '\x20v2-asset-create-footer--update' : '') + "\">\n        <button\n          type=\"button\"\n          class=\"v2-asset-create-btn\"\n          id=\"asset-create-submit\"\n          " + (_0x5fb7a1["saving"] ? "disabled" : '') + "\n        >" + _0x3efc4d + "</button>\n        " + (_0x3c6503 ? "<button\n                type=\"button\"\n                class=\"v2-asset-create-btn v2-asset-create-btn--secondary\"\n                id=\"asset-join-submit\"\n                " + (_0x5fb7a1['saving'] ? "disabled" : '') + "\n              >" + _0x8adda8 + '</button>' : '') + '\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20';
    this["_bindCreatePanelEvents"]();
  }
  ["_bindCreatePanelEvents"]() {
    const _0x50a195 = this['createPanel'];
    const _0x6febf6 = this["_createPanelState"];
    if (!_0x50a195 || !_0x6febf6) {
      return;
    }
    _0x50a195['querySelector']("[data-ui-action='asset-create-close']")?.["addEventListener"]("click", () => {
      this["closeCreatePanel"]();
    });
    const _0x42743b = _0x50a195['querySelector']("#asset-create-category-trigger");
    const _0x2c9258 = _0x50a195['querySelector']("#asset-create-category-val");
    this['_createPanelDropdownOutsideHandler'] && (document['removeEventListener']("pointerdown", this["_createPanelDropdownOutsideHandler"]), this['_createPanelDropdownOutsideHandler'] = null);
    this["_createPanelDropdownEl"] && (this["_createPanelDropdownEl"]["remove"](), this["_createPanelDropdownEl"] = null);
    if (_0x42743b && _0x2c9258) {
      const _0x267361 = document['createElement']("div");
      _0x267361['className'] = 'v2-asset-select-dropdown';
      const _0x563062 = () => {
        const _0x398aef = this["_createPanelState"]?.["draft"]?.["category"] || this["activeTab"];
        const _0x3e862f = this['_getCreatePanelCategories']()["map"](_0x531182 => {
          const _0x4aa476 = this["_categoryKey"](_0x531182) === this["_categoryKey"](_0x398aef) ? " selected" : '';
          const _0x1e5fd6 = _escapeHtml(_0x531182);
          const _0x3bf5f1 = _escapeHtml(this['_formatCategoryLabel'](_0x531182));
          return "<div class=\"v2-asset-select-item" + _0x4aa476 + "\" data-val=\"" + _0x1e5fd6 + '\x22>' + _0x3bf5f1 + "</div>";
        })["join"]('');
        const _0x313733 = this["_canAddCustomCategory"]() ? this["_createPanelState"]?.["customCategoryEditing"] ? "<div class=\"v2-asset-select-custom-row\">\n                <input\n                  type=\"text\"\n                  class=\"v2-asset-select-custom-input\"\n                  id=\"asset-category-custom-input\"\n                  placeholder=\"" + _escapeHtml(assetManagerText('createPanel.categoryNamePlaceholder')) + "\"\n                  value=\"" + _escapeHtml(this['_createPanelState']?.["customCategoryDraft"] || '') + "\"\n                />\n              </div>" : '<div\x20class=\x22v2-asset-select-item\x20v2-asset-select-item--custom\x22\x20data-custom-category=\x221\x22>' + assetManagerText('categories.custom') + "</div>" : '';
        _0x267361["innerHTML"] = _0x3e862f + _0x313733;
      };
      const _0x7cabbf = () => {
        const _0x6eca9b = _0x267361['querySelector']("#asset-category-custom-input");
        const _0xb7a83f = _0x6eca9b?.["value"] ?? this['_createPanelState']?.["customCategoryDraft"] ?? '';
        const _0x17375d = this["_normalizeCategoryName"](_0xb7a83f);
        if (!_0x17375d) {
          this["_setCreatePanelState"]({
            'customCategoryEditing': ![],
            'customCategoryDraft': ''
          });
          _0x563062();
          return;
        }
        const _0x1a609f = this["_getCreatePanelCategories"]();
        const _0x4c1344 = this["_findCategoryByName"](_0x17375d, _0x1a609f);
        if (!_0x4c1344 && _0x1a609f["length"] >= ASSET_CATEGORY_LIMIT) {
          window['showToast']?.(assetManagerText("categoryLimit", {
            'limit': ASSET_CATEGORY_LIMIT
          }), "warn");
          return;
        }
        const _0x195fb6 = _0x4c1344 || this['_addUserCategory'](_0x17375d);
        if (!_0x195fb6) {
          return;
        }
        const _0x3d25b4 = [...(this["_createPanelState"]?.["customCategories"] || [])];
        !_0x4c1344 && !this['_findCategoryByName'](_0x195fb6, _0x3d25b4) && _0x3d25b4['push'](_0x195fb6);
        this['_setCreatePanelState']({
          'draft': {
            'category': _0x195fb6
          },
          'customCategoryEditing': ![],
          'customCategoryDraft': '',
          'customCategories': _0x3d25b4,
          'updateConfirmOpen': ![],
          'error': ''
        });
        this["_createPanelState"]?.["mode"] === "update" && this["_syncUpdateSelectionForCategory"](_0x195fb6);
        _0x2c9258["textContent"] = this["_formatCategoryLabel"](_0x195fb6);
        if (this['_createPanelState']?.["mode"] === "update") {
          _0x58435e();
          this["_renderCreatePanelContent"]();
          return;
        }
        _0x563062();
      };
      _0x563062();
      document["body"]['appendChild'](_0x267361);
      this["_createPanelDropdownEl"] = _0x267361;
      const _0x58435e = () => {
        _0x267361['classList']["remove"]("show");
        _0x42743b["classList"]["remove"]("active");
      };
      _0x42743b["addEventListener"]("click", _0x546120 => {
        _0x546120['stopPropagation']();
        if (_0x267361['classList']['contains']("show")) {
          _0x58435e();
          return;
        }
        const _0x1d834c = _0x42743b["getBoundingClientRect"]();
        _0x267361["style"]["left"] = _0x1d834c["left"] + 'px';
        _0x267361["style"]["top"] = _0x1d834c['bottom'] + 0x4 + 'px';
        _0x267361['style']["width"] = _0x1d834c["width"] + 'px';
        _0x267361["classList"]["add"]('show');
        _0x42743b["classList"]["add"]("active");
      });
      _0x267361["addEventListener"]("click", _0x189b23 => {
        const _0x553046 = _0x189b23["target"]["closest"]("[data-custom-category='1']");
        if (_0x553046) {
          this["_setCreatePanelState"]({
            'customCategoryEditing': !![],
            'customCategoryDraft': '',
            'error': ''
          });
          _0x563062();
          window["requestAnimationFrame"](() => {
            _0x267361['querySelector']("#asset-category-custom-input")?.["focus"]();
          });
          return;
        }
        const _0x1d67a5 = _0x189b23["target"]['closest'](".v2-asset-select-item[data-val]");
        if (!_0x1d67a5) {
          return;
        }
        const _0x3ee371 = this["_normalizeCategoryName"](_0x1d67a5["dataset"]['val']) || this["activeTab"];
        this['_createPanelState']?.["mode"] === "update" ? (this["_setCreatePanelState"]({
          'customCategoryEditing': ![],
          'customCategoryDraft': ''
        }), this["_syncUpdateSelectionForCategory"](_0x3ee371)) : this["_setCreatePanelState"]({
          'draft': {
            'category': _0x3ee371
          },
          'customCategoryEditing': ![],
          'customCategoryDraft': '',
          'updateConfirmOpen': ![],
          'error': ''
        });
        _0x58435e();
        this["_renderCreatePanelContent"]();
      });
      _0x267361["addEventListener"]("input", _0x3393b9 => {
        if (!_0x3393b9["target"]['matches']("#asset-category-custom-input")) {
          return;
        }
        this['_setCreatePanelState']({
          'customCategoryDraft': _0x3393b9["target"]["value"] || ''
        });
      });
      _0x267361["addEventListener"]("keydown", _0x12bdc9 => {
        if (!_0x12bdc9["target"]["matches"]("#asset-category-custom-input")) {
          return;
        }
        if (_0x12bdc9["key"] === "Enter") {
          _0x12bdc9['preventDefault']();
          _0x7cabbf();
          return;
        }
        _0x12bdc9['key'] === 'Escape' && (_0x12bdc9['preventDefault'](), this['_setCreatePanelState']({
          'customCategoryEditing': ![],
          'customCategoryDraft': ''
        }), _0x563062());
      });
      _0x267361["addEventListener"]('focusout', _0x948517 => {
        if (!_0x948517["target"]["matches"]('#asset-category-custom-input')) {
          return;
        }
        _0x7cabbf();
      });
      const _0x3849af = _0x4cfc63 => {
        !_0x267361["contains"](_0x4cfc63["target"]) && !_0x42743b["contains"](_0x4cfc63["target"]) && _0x58435e();
      };
      this["_createPanelDropdownOutsideHandler"] = _0x3849af;
      document['addEventListener']("pointerdown", _0x3849af);
    }
    _0x50a195['querySelectorAll'](".v2-asset-create-tab")['forEach'](_0xf8d22b => {
      _0xf8d22b['addEventListener']("click", () => {
        const _0x261c3e = _0xf8d22b["dataset"]["mode"] === 'update' ? "update" : "create";
        if (_0x261c3e === this["_createPanelState"]?.['mode']) {
          return;
        }
        this["_setCreatePanelState"]({
          'mode': _0x261c3e,
          'updateConfirmOpen': ![],
          'customCategoryEditing': ![],
          'customCategoryDraft': '',
          'error': ''
        });
        if (_0x261c3e === 'update' && !this["_createPanelState"]?.["selectedAssetId"]) {
          const _0x27aa55 = this['_getFilteredUpdateAssets']()[0x0] || null;
          _0x27aa55 && this['_syncCreatePanelDraftFromTarget'](_0x27aa55);
        }
        this["_renderCreatePanelContent"]();
      });
    });
    const _0x42320d = _0x50a195['querySelector']('#asset-create-name');
    _0x42320d && _0x42320d["addEventListener"]("input", _0x467028 => {
      this["_setCreatePanelState"]({
        'draft': {
          'name': _0x467028["target"]["value"] || ''
        },
        'updateConfirmOpen': ![],
        'error': ''
      });
    });
    const _0x5acde2 = _0x50a195["querySelector"]("#asset-update-search");
    _0x5acde2 && _0x5acde2["addEventListener"]("input", _0x37b65b => {
      this["_setCreatePanelState"]({
        'updateSearchKeyword': _0x37b65b["target"]["value"] || '',
        'updateConfirmOpen': ![],
        'error': ''
      });
      this["_renderCreatePanelContent"]();
    });
    _0x50a195["querySelectorAll"]('.v2-asset-update-item')["forEach"](_0x334e45 => {
      _0x334e45["addEventListener"]("click", () => {
        const _0x38bfb2 = String(_0x334e45["dataset"]["assetId"] || '');
        const _0x4e27c3 = this["_getSortedAssets"]()["find"](_0x3144aa => String(_0x3144aa?.['id'] || '') === _0x38bfb2);
        if (!_0x4e27c3) {
          return;
        }
        this["_syncCreatePanelDraftFromTarget"](_0x4e27c3);
        this["_renderCreatePanelContent"]();
      });
    });
    const _0x22a632 = _0x50a195["querySelector"]("#asset-create-submit");
    _0x22a632 && _0x22a632["addEventListener"]("click", () => {
      this["_submitCreatePanel"]();
    });
    const _0x19faf1 = _0x50a195["querySelector"]("#asset-join-submit");
    _0x19faf1 && _0x19faf1["addEventListener"]('click', () => {
      this['_joinCreatePanelToAsset']();
    });
  }
  async ['_submitCreatePanel']() {
    const _0x1bd4fb = this["_createPanelState"];
    const _0x211024 = this['createPanel'];
    if (!_0x1bd4fb || !_0x211024 || _0x1bd4fb["saving"]) {
      return;
    }
    const _0x28587d = Array["isArray"](_0x1bd4fb["selectedIds"]) ? _0x1bd4fb["selectedIds"] : [];
    const _0x1a69d6 = this["_getSelectedAssetNodes"](_0x28587d);
    if (!_0x1a69d6['length']) {
      this['_setCreatePanelState']({
        'error': assetManagerText('errors.noSavableNodes')
      });
      this['_renderCreatePanelContent']();
      return;
    }
    const _0x213d1b = String(this['_createPanelState']?.["draft"]?.["name"] || '')["trim"]() || assetManagerText('unnamedAsset');
    const _0x42f68e = String(this['_createPanelState']?.["draft"]?.["category"] || '')["trim"]() || this["activeTab"];
    if (_0x1bd4fb['mode'] === "update") {
      const _0x433eaf = this['_getFilteredUpdateAssets']()['find'](_0x4511a8 => String(_0x4511a8?.['id'] || '') === String(_0x1bd4fb['selectedAssetId'] || ''));
      if (!_0x433eaf) {
        this['_setCreatePanelState']({
          'error': assetManagerText('errors.selectAssetToUpdate')
        });
        this['_renderCreatePanelContent']();
        return;
      }
      if (!_0x1bd4fb["updateConfirmOpen"]) {
        this["_setCreatePanelState"]({
          'updateConfirmOpen': !![],
          'error': ''
        });
        this['_renderCreatePanelContent']();
        return;
      }
      const _0x5731b4 = this["_buildAssetPayloadFromSelection"](_0x28587d, {
        'id': _0x433eaf['id'],
        'name': _0x213d1b,
        'category': _0x42f68e,
        'createdAt': _0x433eaf['createdAt'] || _0x433eaf['updatedAt'] || Date["now"](),
        'updatedAt': Date['now']()
      });
      this["_setCreatePanelState"]({
        'saving': !![],
        'savingAction': "overwrite",
        'error': ''
      });
      this["_renderCreatePanelContent"]();
      try {
        await saveAssetToServer(_0x5731b4);
        this["_upsertLocalAsset"](_0x5731b4);
        this["_scheduleVideoThumbJobs"]();
        this['_openAssetId'] = String(_0x5731b4['id'] || '') === this["_openAssetId"] ? _0x5731b4['id'] : this["_openAssetId"];
        window['showToast']?.(assetManagerText("toasts.assetUpdated"), "success");
        this["closeCreatePanel"]();
        this["sidebarPanel"]?.["classList"]["contains"]("show") && this["renderSidebarContent"]();
      } catch (_0x3f2c5e) {
        this["_setCreatePanelState"]({
          'saving': ![],
          'savingAction': '',
          'error': assetManagerText("errors.assetUpdateFailed")
        });
        this["_renderCreatePanelContent"]();
        console["error"](_0x3f2c5e);
        window["showToast"]?.(assetManagerText('errors.assetUpdateFailed'), "error");
      }
      return;
    }
    const _0x21d0d0 = this["_buildAssetPayloadFromSelection"](_0x28587d, {
      'name': _0x213d1b,
      'category': _0x42f68e,
      'createdAt': Date["now"](),
      'updatedAt': Date["now"]()
    });
    this["_setCreatePanelState"]({
      'saving': !![],
      'savingAction': 'create',
      'error': ''
    });
    this["_renderCreatePanelContent"]();
    try {
      await saveAssetToServer(_0x21d0d0);
      this["_upsertLocalAsset"](_0x21d0d0);
      this["_scheduleVideoThumbJobs"]();
      window["showToast"]?.(assetManagerText("toasts.assetCreated"), 'success');
      this["_playCreateAssetFly"](_0x211024);
      this["closeCreatePanel"]();
      this["sidebarPanel"]?.["classList"]["contains"]('show') && (this["_newAssetPulseId"] = String(_0x21d0d0['id'] || ''), this['renderSidebarContent']());
    } catch (_0x1260dc) {
      this['_setCreatePanelState']({
        'saving': ![],
        'savingAction': '',
        'error': assetManagerText("errors.assetCreateFailed")
      });
      this["_renderCreatePanelContent"]();
      console["error"](_0x1260dc);
      window['showToast']?.(assetManagerText("errors.assetCreateFailed"), "error");
    }
  }
  async ["_joinCreatePanelToAsset"]() {
    const _0x43110e = this["_createPanelState"];
    const _0x4ddf18 = this["createPanel"];
    if (!_0x43110e || !_0x4ddf18 || _0x43110e["saving"]) {
      return;
    }
    const _0x1c1693 = Array["isArray"](_0x43110e["selectedIds"]) ? _0x43110e["selectedIds"] : [];
    const _0x1743ab = this["_getSelectedAssetNodes"](_0x1c1693);
    if (!_0x1743ab["length"]) {
      this["_setCreatePanelState"]({
        'error': assetManagerText("errors.noJoinableNodes")
      });
      this["_renderCreatePanelContent"]();
      return;
    }
    const _0x44b561 = this["_getFilteredUpdateAssets"]()['find'](_0x45ce2d => String(_0x45ce2d?.['id'] || '') === String(_0x43110e["selectedAssetId"] || ''));
    if (!_0x44b561) {
      this["_setCreatePanelState"]({
        'error': assetManagerText("errors.selectAssetToJoin")
      });
      this["_renderCreatePanelContent"]();
      return;
    }
    const _0x5da584 = String(this["_createPanelState"]?.["draft"]?.['name'] || '')["trim"]() || assetManagerText("unnamedAsset");
    const _0x10b368 = String(this["_createPanelState"]?.["draft"]?.["category"] || '')['trim']() || this["activeTab"];
    const _0x5c327f = this["_buildAssetAppendPayload"](_0x44b561, _0x1c1693, {
      'name': _0x5da584,
      'category': _0x10b368,
      'updatedAt': Date["now"]()
    });
    this["_setCreatePanelState"]({
      'saving': !![],
      'savingAction': "join",
      'updateConfirmOpen': ![],
      'error': ''
    });
    this["_renderCreatePanelContent"]();
    try {
      await saveAssetToServer(_0x5c327f);
      this["_upsertLocalAsset"](_0x5c327f);
      this["_scheduleVideoThumbJobs"]();
      this["_openAssetId"] = String(_0x5c327f['id'] || '') === this["_openAssetId"] ? _0x5c327f['id'] : this["_openAssetId"];
      window["showToast"]?.(assetManagerText("toasts.assetJoined"), "success");
      this["closeCreatePanel"]();
      this['sidebarPanel']?.["classList"]["contains"]('show') && this['renderSidebarContent']();
    } catch (_0x110af6) {
      this["_setCreatePanelState"]({
        'saving': ![],
        'savingAction': '',
        'error': assetManagerText("errors.assetJoinFailed")
      });
      this['_renderCreatePanelContent']();
      console["error"](_0x110af6);
      window["showToast"]?.(assetManagerText("errors.assetJoinFailed"), "error");
    }
  }
  ["_getCanvasCenterWorld"]() {
    const {
      viewport: _0x585ae2
    } = a935_0x5aa396['getState']();
    const _0xc6457c = window["innerWidth"] / 0x2;
    const _0x4e98 = window["innerHeight"] / 0x2;
    const _0xcd38cc = document["documentElement"]?.['clientWidth'] || window["innerWidth"] || 0x0;
    const _0x4605ef = document["documentElement"]?.["clientHeight"] || window["innerHeight"] || 0x0;
    if (!_0xcd38cc || !_0x4605ef) {
      return screenToWorld(_0xc6457c, _0x4e98, _0x585ae2);
    }
    let _0x51d664 = 0x0;
    let _0x3291fd = 0x0;
    let _0x5a73b1 = _0xcd38cc;
    let _0x3ebded = _0x4605ef;
    const _0x53ccec = [];
    const _0x1a4fc7 = document['querySelector']("header");
    if (_0x1a4fc7) {
      _0x53ccec["push"](_0x1a4fc7);
    }
    const _0x1b2dda = document["querySelector"]('.sidebar-floating');
    if (_0x1b2dda) {
      _0x53ccec["push"](_0x1b2dda);
    }
    if (this["sidebarPanel"]?.["classList"]?.['contains']("show")) {
      _0x53ccec['push'](this['sidebarPanel']);
    }
    const _0x571ad3 = 0x8;
    for (const _0x330157 of _0x53ccec) {
      if (!_0x330157?.["isConnected"]) {
        continue;
      }
      const _0xa42f14 = _0x330157["getBoundingClientRect"]();
      const _0x51e916 = Math["max"](_0x51d664, _0xa42f14["left"]);
      const _0x364b6a = Math["max"](_0x3291fd, _0xa42f14['top']);
      const _0x3973d4 = Math["min"](_0x5a73b1, _0xa42f14['right']);
      const _0x19cfb0 = Math["min"](_0x3ebded, _0xa42f14['bottom']);
      if (_0x3973d4 <= _0x51e916 || _0x19cfb0 <= _0x364b6a) {
        continue;
      }
      if (_0xa42f14["left"] <= _0x51d664 + _0x571ad3 && _0xa42f14['right'] > _0x51d664 + _0x571ad3) {
        _0x51d664 = Math["max"](_0x51d664, _0xa42f14["right"]);
        continue;
      }
      if (_0xa42f14["right"] >= _0x5a73b1 - _0x571ad3 && _0xa42f14["left"] < _0x5a73b1 - _0x571ad3) {
        _0x5a73b1 = Math["min"](_0x5a73b1, _0xa42f14["left"]);
        continue;
      }
      if (_0xa42f14["top"] <= _0x3291fd + _0x571ad3 && _0xa42f14["bottom"] > _0x3291fd + _0x571ad3) {
        _0x3291fd = Math["max"](_0x3291fd, _0xa42f14["bottom"]);
        continue;
      }
      if (_0xa42f14['bottom'] >= _0x3ebded - _0x571ad3 && _0xa42f14["top"] < _0x3ebded - _0x571ad3) {
        _0x3ebded = Math["min"](_0x3ebded, _0xa42f14["top"]);
        continue;
      }
    }
    const _0x262884 = _0x5a73b1 - _0x51d664;
    const _0x179e6a = _0x3ebded - _0x3291fd;
    const _0x1e1631 = _0x262884 > 0x28 ? _0x51d664 + _0x262884 / 0x2 : _0xc6457c;
    const _0x24a00d = _0x179e6a > 0x28 ? _0x3291fd + _0x179e6a / 0x2 : _0x4e98;
    return screenToWorld(_0x1e1631, _0x24a00d, _0x585ae2);
  }
  ["_calcNodesBBox"](_0x296966) {
    let _0x3715bd = Infinity;
    let _0x5bc73b = Infinity;
    let _0x59a9fc = -Infinity;
    let _0x1c86b5 = -Infinity;
    for (const _0x5718c7 of _0x296966 || []) {
      if (!_0x5718c7) {
        continue;
      }
      const _0xfafcc2 = Number(_0x5718c7['x']) || 0x0;
      const _0xd93939 = Number(_0x5718c7['y']) || 0x0;
      const _0x406dbc = Number(_0x5718c7["width"] ?? _0x5718c7['w']) || 0x64;
      const _0x129f1e = Number(_0x5718c7['height'] ?? _0x5718c7['h']) || 0x64;
      _0x3715bd = Math["min"](_0x3715bd, _0xfafcc2);
      _0x5bc73b = Math['min'](_0x5bc73b, _0xd93939);
      _0x59a9fc = Math["max"](_0x59a9fc, _0xfafcc2 + _0x406dbc);
      _0x1c86b5 = Math['max'](_0x1c86b5, _0xd93939 + _0x129f1e);
    }
    if (!Number['isFinite'](_0x3715bd) || !Number["isFinite"](_0x5bc73b)) {
      return {
        'minX': 0x0,
        'minY': 0x0,
        'maxX': 0x0,
        'maxY': 0x0,
        'w': 0x0,
        'h': 0x0,
        'cx': 0x0,
        'cy': 0x0
      };
    }
    const _0x57c44e = Math["max"](0x0, _0x59a9fc - _0x3715bd);
    const _0x2de956 = Math["max"](0x0, _0x1c86b5 - _0x5bc73b);
    return {
      'minX': _0x3715bd,
      'minY': _0x5bc73b,
      'maxX': _0x59a9fc,
      'maxY': _0x1c86b5,
      'w': _0x57c44e,
      'h': _0x2de956,
      'cx': _0x3715bd + _0x57c44e / 0x2,
      'cy': _0x5bc73b + _0x2de956 / 0x2
    };
  }
  ["_preloadThumb"](_0x49efaf) {
    const _0x552487 = String(_0x49efaf || '')["trim"]();
    if (!_0x552487) {
      return ![];
    }
    if (_0x552487["startsWith"]("data:")) {
      return ![];
    }
    if (this["_isNonImageMediaSrc"](_0x552487)) {
      return ![];
    }
    if (this["_thumbPreloadSet"]['has'](_0x552487)) {
      return ![];
    }
    this["_thumbPreloadSet"]["add"](_0x552487);
    this["_ensureThumbDecoded"](_0x552487);
    return !![];
  }
  ['_isSidebarOpen']() {
    return this["sidebarPanel"]?.["classList"]?.["contains"]("show") === !![];
  }
  ['_renderMaterialLoadingState']() {
    const _0x4c9c6d = this["sidebarPanel"]?.["querySelector"]("[data-material-loading]");
    if (!_0x4c9c6d) {
      return;
    }
    _0x4c9c6d["hidden"] = this["_materialLoadingCount"] <= 0x0;
  }
  ["_warmVisibleAssetMedia"]() {
    if (!this['_isSidebarOpen']()) {
      return ![];
    }
    let _0x3cc776 = 0x0;
    for (const _0x25c891 of this["_getSortedAssets"]()) {
      if (_0x3cc776 >= 0x20) {
        break;
      }
      _0x25c891?.['coverUrl'] && (this["_preloadThumb"](_0x25c891["coverUrl"]), _0x3cc776 += 0x1);
      const _0x558cf7 = Array["isArray"](_0x25c891?.['items']) ? _0x25c891['items'] : [];
      for (const _0x585bef of _0x558cf7) {
        if (_0x3cc776 >= 0x20) {
          break;
        }
        _0x585bef?.['thumbSrc'] && (this["_preloadThumb"](_0x585bef["thumbSrc"]), _0x3cc776 += 0x1);
      }
    }
    this['_scheduleVideoThumbJobs']();
    return _0x3cc776 > 0x0;
  }
  ["_ensureThumbDecoded"](_0x22582e) {
    const _0x5c1fe5 = String(_0x22582e || '')["trim"]();
    if (!_0x5c1fe5) {
      return Promise['resolve'](![]);
    }
    if (_0x5c1fe5["startsWith"]("data:")) {
      return Promise['resolve'](!![]);
    }
    if (this['_isNonImageMediaSrc'](_0x5c1fe5)) {
      return Promise["resolve"](![]);
    }
    const _0x14df8e = this['_thumbDecodePromiseMap']["get"](_0x5c1fe5);
    if (_0x14df8e) {
      return _0x14df8e;
    }
    const _0x271dd5 = preloadCanvasImage(_0x5c1fe5, {
      'priority': 0x14,
      'fetchPriority': "auto"
    })["then"](() => !![], () => ![]);
    this["_thumbDecodePromiseMap"]["set"](_0x5c1fe5, _0x271dd5);
    return _0x271dd5;
  }
  ["_isVideoMediaSrc"](_0x1a997c) {
    const _0x32fb72 = String(_0x1a997c || '')["trim"]()['toLowerCase']();
    return /^data:video\//["test"](_0x32fb72) || /\.(?:mp4|webm|mov|mkv|m4v)(?:[?#].*)?$/["test"](_0x32fb72);
  }
  ["_isAudioMediaSrc"](_0x34ef95) {
    const _0x2a7d2e = String(_0x34ef95 || '')["trim"]()["toLowerCase"]();
    return /^data:audio\//["test"](_0x2a7d2e) || /\.(?:mp3|wav|m4a|aac|flac|ogg|opus|wma)(?:[?#].*)?$/["test"](_0x2a7d2e);
  }
  ['_isNonImageMediaSrc'](_0x277012) {
    return this["_isVideoMediaSrc"](_0x277012) || this["_isAudioMediaSrc"](_0x277012);
  }
  async ["_captureVideoFirstFrameDataUrl"](_0xf6c93d) {
    const _0x471c10 = String(_0xf6c93d || '');
    if (!_0x471c10) {
      return '';
    }
    return await new Promise(_0x250bcd => {
      const _0x163479 = document["createElement"]('video');
      _0x163479['preload'] = "auto";
      _0x163479["muted"] = !![];
      _0x163479["playsInline"] = !![];
      _0x163479["crossOrigin"] = "anonymous";
      const _0x5e6506 = () => {
        _0x163479['removeAttribute']('src');
        _0x163479["load"]();
      };
      const _0x3ef588 = () => {
        _0x5e6506();
        _0x250bcd('');
      };
      const _0xe8b17d = async () => {
        try {
          const _0x5a7fc6 = Number["isFinite"](_0x163479["duration"]) ? _0x163479["duration"] : 0x0;
          const _0x29bacb = _0x5a7fc6 > 0x0 ? Math["min"](0.08, Math["max"](0x0, _0x5a7fc6 - 0.08)) : 0x0;
          const _0x14abb6 = () => {
            try {
              const _0x391605 = _0x163479["videoWidth"] || 0x0;
              const _0x5d47d5 = _0x163479["videoHeight"] || 0x0;
              if (!_0x391605 || !_0x5d47d5) {
                return _0x3ef588();
              }
              const {
                width: _0x585439,
                height: _0x172562
              } = fitAssetMaterialVideoThumbnail(_0x391605, _0x5d47d5);
              const _0x453755 = document["createElement"]('canvas');
              _0x453755['width'] = _0x585439;
              _0x453755["height"] = _0x172562;
              const _0x1568df = _0x453755["getContext"]('2d');
              _0x1568df["drawImage"](_0x163479, 0x0, 0x0, _0x585439, _0x172562);
              const _0x28c2a1 = _0x453755["toDataURL"]("image/jpeg", 0.9);
              _0x5e6506();
              _0x250bcd(_0x28c2a1);
            } catch (_0xeaf905) {
              _0x3ef588();
            } finally {
              _0x163479["removeEventListener"]("seeked", _0x14abb6);
            }
          };
          _0x163479['addEventListener']("seeked", _0x14abb6, {
            'once': !![]
          });
          _0x163479['currentTime'] = _0x29bacb;
        } catch (_0x380918) {
          _0x3ef588();
        }
      };
      _0x163479["addEventListener"]('error', _0x3ef588, {
        'once': !![]
      });
      _0x163479['addEventListener']("loadeddata", _0xe8b17d, {
        'once': !![]
      });
      attachMediaElementPlaybackSource(_0x163479, _0x471c10, {
        'preload': 'auto'
      })["catch"](() => {
        if (!String(_0x163479["getAttribute"]("src") || _0x163479["src"] || '')["trim"]()) {
          _0x163479["src"] = _0x471c10;
          try {
            _0x163479["load"]?.();
          } catch {}
        }
      });
    });
  }
  ['_scheduleVideoThumbJobs']() {
    if (!this['_isSidebarOpen']()) {
      return;
    }
    if (this["_videoThumbTimer"]) {
      return;
    }
    this["_videoThumbTimer"] = window["setTimeout"](() => {
      this["_videoThumbTimer"] = 0x0;
      if (!this['_isSidebarOpen']()) {
        return;
      }
      this["_runVideoThumbJobs"]();
    }, 0x0);
  }
  ["_scheduleSidebarRender"]() {
    if (!this["_isSidebarOpen"]()) {
      return;
    }
    if (this["_renamingAssetId"] || this["_renamingMaterialItemKey"] || this["_renamingMaterialCategoryKey"]) {
      return;
    }
    if (this['_sidebarRenderRaf']) {
      return;
    }
    this["_sidebarRenderRaf"] = window["requestAnimationFrame"](() => {
      this['_sidebarRenderRaf'] = 0x0;
      if (!this["_isSidebarOpen"]()) {
        return;
      }
      if (this['_renamingAssetId'] || this["_renamingMaterialItemKey"] || this["_renamingMaterialCategoryKey"]) {
        return;
      }
      this["renderSidebarContent"]();
    });
  }
  ['_beginRenameAsset'](_0x413f6a) {
    const _0x4c6e69 = String(_0x413f6a || '');
    if (!_0x4c6e69) {
      return;
    }
    if (this["_savingMaterialCategoryKey"] || this["_savingMaterialItemKey"]) {
      return;
    }
    if (this["_pendingDeleteAssetId"]) {
      this["_pendingDeleteAssetId"] = '';
    }
    this["_renamingMaterialCategoryKey"] = '';
    this["_renamingMaterialItemKey"] = '';
    this["_renamingAssetId"] = _0x4c6e69;
    this["_closeMaterialMenu"]();
    this['_hideMaterialPreview']();
    this["renderSidebarContent"]();
  }
  ["_cancelRenameAsset"]() {
    if (!this['_renamingAssetId']) {
      return;
    }
    this["_renamingAssetId"] = '';
    this["renderSidebarContent"]();
  }
  async ['_commitRenameAsset'](_0xc6e040, _0x38630d) {
    const _0x47fbe1 = String(_0xc6e040 || '');
    const _0x240471 = String(_0x38630d || '')['trim']();
    if (!_0x47fbe1) {
      return;
    }
    if (!_0x240471) {
      window["showToast"]?.(assetManagerText("errors.nameRequired"), "error");
      return;
    }
    const _0x5966a2 = (this["assets"] || [])['find'](_0x6c7f37 => String(_0x6c7f37?.['id'] || '') === _0x47fbe1);
    if (!_0x5966a2) {
      return;
    }
    const _0x417b5c = String(_0x5966a2?.["name"] || '');
    const _0x1cf52a = _0x5966a2?.['updatedAt'];
    if (_0x417b5c === _0x240471) {
      this["_renamingAssetId"] = '';
      this['renderSidebarContent']();
      return;
    }
    _0x5966a2['name'] = _0x240471;
    _0x5966a2["updatedAt"] = Date["now"]();
    const _0x3d00ea = this['sidebarPanel']?.["querySelector"](".v2-material-name-input[data-asset-id=\"" + CSS["escape"](_0x47fbe1) + '\x22]');
    _0x3d00ea?.["setAttribute"]("aria-busy", "true");
    if (_0x3d00ea) {
      _0x3d00ea["disabled"] = !![];
    }
    _0x3d00ea?.["closest"](".v2-material-asset-row, .v2-material-project-row")?.["classList"]["add"]("is-saving");
    try {
      await saveAssetToServer(_0x5966a2);
      this["_upsertLocalAsset"](_0x5966a2);
      window["showToast"]?.(assetManagerText("toasts.renamed"), "success");
    } catch (_0x4d3e61) {
      _0x5966a2['name'] = _0x417b5c;
      _0x5966a2["updatedAt"] = _0x1cf52a;
      window["showToast"]?.(assetManagerText('errors.renameFailed'), "error");
    } finally {
      this["_renamingAssetId"] = '';
      this["renderSidebarContent"]();
    }
  }
  ["_materialItemKey"](_0x2fd76c, _0x3eca39) {
    const _0xeda185 = String(_0x2fd76c || '');
    const _0x259b9e = Number(_0x3eca39);
    return _0xeda185 && Number['isInteger'](_0x259b9e) && _0x259b9e >= 0x0 ? _0xeda185 + ':' + _0x259b9e : '';
  }
  ['_beginRenameMaterialItem'](_0x5de69c, _0x154128) {
    const _0x57a1d4 = this["_materialItemKey"](_0x5de69c, _0x154128);
    const _0x4f1d96 = this["_getMaterialAsset"](_0x5de69c);
    if (!_0x57a1d4 || !getMaterialAssetItems(_0x4f1d96)[Number(_0x154128)] || this["_savingMaterialCategoryKey"] || this['_savingMaterialItemKey']) {
      return;
    }
    this["_renamingAssetId"] = '';
    this['_renamingMaterialCategoryKey'] = '';
    this["_renamingMaterialItemKey"] = _0x57a1d4;
    this['_closeMaterialMenu']();
    this["_hideMaterialPreview"]();
    this["renderSidebarContent"]();
  }
  ["_cancelRenameMaterialItem"]() {
    if (!this['_renamingMaterialItemKey'] || this["_savingMaterialItemKey"]) {
      return;
    }
    this['_renamingMaterialItemKey'] = '';
    this["renderSidebarContent"]();
  }
  async ["_commitRenameMaterialItem"](_0x322ef1, _0x17605a, _0x3afdf4) {
    const _0x10455e = String(_0x322ef1 || '');
    const _0x20ecd2 = Number(_0x17605a);
    const _0xf38296 = this["_materialItemKey"](_0x10455e, _0x20ecd2);
    const _0x58ae97 = String(_0x3afdf4 || '')["trim"]();
    if (!_0xf38296 || _0xf38296 !== this["_renamingMaterialItemKey"] || this["_savingMaterialItemKey"]) {
      return ![];
    }
    if (!_0x58ae97) {
      window["showToast"]?.(assetManagerText('errors.nameRequired'), 'error');
      this["sidebarPanel"]?.["querySelector"](".v2-material-item-name-input[data-item-key=\"" + CSS["escape"](_0xf38296) + '\x22]')?.["focus"]();
      return ![];
    }
    const _0x5f2030 = this["_getMaterialAsset"](_0x10455e);
    const _0x4d2079 = getMaterialAssetItems(_0x5f2030)[_0x20ecd2];
    if (!_0x5f2030 || !_0x4d2079) {
      return ![];
    }
    const _0x3f11d4 = String(_0x4d2079?.["name"] || _0x4d2079?.["nodeData"]?.["name"] || '');
    if (_0x3f11d4 === _0x58ae97) {
      this["_renamingMaterialItemKey"] = '';
      this["renderSidebarContent"]();
      return !![];
    }
    const _0x291ebf = {
      ..._0x5f2030,
      'updatedAt': Date["now"](),
      'nodes': Array["isArray"](_0x5f2030['nodes']) ? _0x5f2030["nodes"]['map']((_0x164590, _0x12e9ab) => _0x12e9ab === _0x20ecd2 ? {
        ..._0x164590,
        'name': _0x58ae97
      } : _0x164590) : _0x5f2030['nodes'],
      'items': Array['isArray'](_0x5f2030['items']) ? _0x5f2030["items"]["map"]((_0x30445f, _0x204f99) => _0x204f99 === _0x20ecd2 ? {
        ..._0x30445f,
        'name': _0x58ae97,
        'nodeData': _0x30445f?.["nodeData"] ? {
          ..._0x30445f['nodeData'],
          'name': _0x58ae97
        } : _0x30445f?.["nodeData"]
      } : _0x30445f) : _0x5f2030["items"]
    };
    this["_savingMaterialItemKey"] = _0xf38296;
    const _0x5b2f17 = this["sidebarPanel"]?.["querySelector"]('.v2-material-item-name-input[data-item-key=\x22' + CSS["escape"](_0xf38296) + '\x22]');
    _0x5b2f17?.["setAttribute"]('aria-busy', 'true');
    if (_0x5b2f17) {
      _0x5b2f17["disabled"] = !![];
    }
    _0x5b2f17?.["closest"](".v2-material-item-row")?.["classList"]["add"]("is-saving");
    try {
      await saveAssetToServer(_0x291ebf);
      this["_upsertLocalAsset"](_0x291ebf);
      window["showToast"]?.(assetManagerText("toasts.renamed"), "success");
      return !![];
    } catch (_0xd07242) {
      console['error'](_0xd07242);
      window["showToast"]?.(assetManagerText('errors.renameFailed'), 'error');
      return ![];
    } finally {
      this["_renamingMaterialItemKey"] = '';
      this['_savingMaterialItemKey'] = '';
      this['renderSidebarContent']();
    }
  }
  ["_getMaterialCategoryRenameInput"](_0x57c3fc) {
    return Array["from"](this['sidebarPanel']?.["querySelectorAll"]?.(".v2-material-folder-name-input[data-category-key]") || [])["find"](_0x1af521 => _0x1af521["dataset"]['categoryKey'] === _0x57c3fc) || null;
  }
  ["_focusMaterialCategoryRenameInput"](_0x21e0e7, {
    select = ![]
  } = {}) {
    window["requestAnimationFrame"](() => {
      const _0x9ed58d = this['_getMaterialCategoryRenameInput'](_0x21e0e7);
      if (!_0x9ed58d || _0x9ed58d["disabled"] || !_0x9ed58d['isConnected']) {
        return;
      }
      _0x9ed58d['dataset']['submitted'] = '';
      _0x9ed58d["focus"]();
      if (select) {
        _0x9ed58d["select"]?.();
      }
    });
  }
  ['_beginRenameMaterialCategory'](_0x57e346) {
    const _0x335fa3 = this["_findCategoryByName"](_0x57e346, this['tabs']);
    const _0x330009 = this["_categoryKey"](_0x335fa3);
    if (!_0x335fa3 || !_0x330009 || !this["_isUserCategory"](_0x335fa3)) {
      return;
    }
    if (this["_savingMaterialCategoryKey"] || this["_savingMaterialItemKey"]) {
      return;
    }
    this["_materialCurrentFolderCategory"] = _0x335fa3;
    this["_pendingMaterialFolderDeleteKey"] = '';
    this["_renamingAssetId"] = '';
    this["_renamingMaterialItemKey"] = '';
    this['_renamingMaterialCategoryKey'] = _0x330009;
    this["_closeMaterialMenu"]();
    this['_hideMaterialPreview']();
    this['renderSidebarContent']();
    this["_focusMaterialCategoryRenameInput"](_0x330009, {
      'select': !![]
    });
  }
  ["_cancelRenameMaterialCategory"]() {
    if (!this["_renamingMaterialCategoryKey"] || this["_savingMaterialCategoryKey"]) {
      return;
    }
    this["_renamingMaterialCategoryKey"] = '';
    this['renderSidebarContent']();
  }
  ["_rejectMaterialCategoryRename"](_0x256c5e, _0x4f0e8b) {
    window['showToast']?.(_0x4f0e8b, "error");
    this['_focusMaterialCategoryRenameInput'](_0x256c5e);
  }
  async ["_commitRenameMaterialCategory"](_0xef8b8b, _0x2f8703) {
    const _0x1550c0 = this['_findCategoryByName'](_0xef8b8b, this["tabs"]);
    const _0x1beb2a = this["_categoryKey"](_0x1550c0);
    const _0x23788a = this["_normalizeCategoryName"](_0x2f8703);
    if (!_0x1550c0 || !_0x1beb2a || !this["_isUserCategory"](_0x1550c0) || this['_renamingMaterialCategoryKey'] !== _0x1beb2a || this["_savingMaterialCategoryKey"]) {
      return ![];
    }
    if (!_0x23788a) {
      this["_rejectMaterialCategoryRename"](_0x1beb2a, assetManagerText("errors.nameRequired"));
      return ![];
    }
    if (this['_isHiddenAssetCategory'](_0x23788a)) {
      this["_rejectMaterialCategoryRename"](_0x1beb2a, assetManagerText("categoryNameUnavailable"));
      return ![];
    }
    const _0x982ff2 = this["_formatCategoryLabel"](_0x1550c0);
    if (_0x982ff2 === _0x23788a) {
      this["_renamingMaterialCategoryKey"] = '';
      this["renderSidebarContent"]();
      return !![];
    }
    const _0x19f4b2 = _0x23788a["toLocaleLowerCase"]();
    const _0x5c631b = this["tabs"]['some'](_0x3fb199 => this['_categoryKey'](_0x3fb199) !== _0x1beb2a && this["_formatCategoryLabel"](_0x3fb199)["toLocaleLowerCase"]() === _0x19f4b2);
    if (_0x5c631b) {
      this["_rejectMaterialCategoryRename"](_0x1beb2a, assetManagerText("categoryNameExists"));
      return ![];
    }
    if (this["_isProtectedCategory"](_0x23788a)) {
      this['_rejectMaterialCategoryRename'](_0x1beb2a, assetManagerText("categoryNameUnavailable"));
      return ![];
    }
    const _0x2a3a21 = [...this["userCategories"]];
    const _0x16c6a9 = {
      ...this["materialCategoryParents"]
    };
    const _0x48f3c6 = buildMaterialCategoryRenamePlan({
      'assets': this["_getSortedAssets"](),
      'userCategories': _0x2a3a21,
      'allCategories': this["tabs"],
      'currentCategory': _0x1550c0,
      'nextCategory': _0x23788a,
      'categoryKey': _0x12c05e => this['_categoryKey'](_0x12c05e),
      'now': Date['now']()
    });
    if (_0x48f3c6["status"] === "unchanged") {
      this["_renamingMaterialCategoryKey"] = '';
      this['renderSidebarContent']();
      return !![];
    }
    if (_0x48f3c6['status'] === "duplicate") {
      this["_rejectMaterialCategoryRename"](_0x1beb2a, assetManagerText("categoryNameExists"));
      return ![];
    }
    if (_0x48f3c6["status"] !== 'ready') {
      this["_rejectMaterialCategoryRename"](_0x1beb2a, assetManagerText('categoryRenameFailed'));
      return ![];
    }
    const _0x2f9ea0 = renameMaterialFolderParent({
      'parents': _0x16c6a9,
      'currentCategory': _0x1550c0,
      'nextCategory': _0x48f3c6["nextCategory"],
      'categoryKey': _0x1efe5f => this["_categoryKey"](_0x1efe5f)
    });
    this['_savingMaterialCategoryKey'] = _0x1beb2a;
    const _0x15829a = this["_getMaterialCategoryRenameInput"](_0x1beb2a);
    _0x15829a?.["setAttribute"]('aria-busy', "true");
    if (_0x15829a) {
      _0x15829a["disabled"] = !![];
    }
    _0x15829a?.["closest"](".v2-material-folder-row")?.["classList"]["add"]('is-saving');
    const _0x783532 = [];
    let _0x5186fc = ![];
    try {
      for (let _0x2e30be = 0x0; _0x2e30be < _0x48f3c6["renamedAssets"]["length"]; _0x2e30be += 0x1) {
        _0x783532["push"](_0x48f3c6["originalAssets"][_0x2e30be]);
        await saveAssetToServer(_0x48f3c6["renamedAssets"][_0x2e30be]);
      }
      _0x5186fc = !![];
      await this['_saveMaterialCategorySettings'](_0x48f3c6["nextUserCategories"], this["materialCategoryDisplayNames"], _0x2f9ea0);
      this["userCategories"] = _0x48f3c6["nextUserCategories"];
      this['materialCategoryParents'] = _0x2f9ea0;
      _0x48f3c6['renamedAssets']["forEach"](_0x46abf8 => this['_upsertLocalAsset'](_0x46abf8));
      this["_categoryKey"](this["activeTab"]) === _0x1beb2a && (this["activeTab"] = _0x48f3c6["nextCategory"]);
      this["_expandedMaterialCategories"]["delete"](_0x1beb2a) && this['_expandedMaterialCategories']['add'](_0x48f3c6["nextKey"]);
      this["_categoryKey"](this["_materialCurrentFolderCategory"]) === _0x1beb2a && (this["_materialCurrentFolderCategory"] = _0x48f3c6["nextCategory"]);
      this["_syncTabsFromAssets"]();
      this["_renderSidebarTabs"]();
      window["showToast"]?.(assetManagerText("categoryRenamed"), 'success');
      return !![];
    } catch (_0x50d0bf) {
      const _0x51de83 = [];
      for (const _0x18cfbc of _0x783532["reverse"]()) {
        try {
          await saveAssetToServer(_0x18cfbc);
        } catch (_0x20f83f) {
          _0x51de83["push"](_0x20f83f);
        }
      }
      if (_0x5186fc) {
        try {
          await this["_saveMaterialCategorySettings"](_0x2a3a21, this["materialCategoryDisplayNames"], _0x16c6a9);
        } catch (_0x116972) {
          _0x51de83["push"](_0x116972);
        }
      }
      _0x51de83["length"] && console["error"]("回滚素材文件夹重命名失败", _0x51de83);
      console["error"](_0x50d0bf);
      window["showToast"]?.(assetManagerText('categoryRenameFailed'), 'error');
      return ![];
    } finally {
      this["_renamingMaterialCategoryKey"] = '';
      this["_savingMaterialCategoryKey"] = '';
      this["renderSidebarContent"]();
    }
  }
  async ["_runVideoThumbJobs"]() {
    if (!this['_isSidebarOpen']()) {
      return;
    }
    let _0x123c57 = 0x2;
    for (const _0x5e469c of this["_getSortedAssets"]()) {
      if (!this["_isSidebarOpen"]()) {
        break;
      }
      if (_0x123c57 <= 0x0) {
        break;
      }
      const _0x1edf88 = String(_0x5e469c?.['id'] || '')['trim']();
      if (!_0x1edf88) {
        continue;
      }
      const _0x563fe2 = Array["isArray"](_0x5e469c?.["items"]) ? _0x5e469c["items"] : [];
      for (let _0x2fb383 = 0x0; _0x2fb383 < _0x563fe2["length"]; _0x2fb383++) {
        if (_0x123c57 <= 0x0) {
          break;
        }
        const _0x4f422a = _0x563fe2[_0x2fb383];
        const _0x46087b = _normalizeAssetType(_0x4f422a?.["type"]);
        if (_0x46087b !== 'video') {
          continue;
        }
        const _0x47f098 = String(_0x4f422a?.["thumbSrc"] || '');
        if (isAssetMaterialVideoThumbnailUrl(_0x47f098)) {
          continue;
        }
        const _0x500aeb = _0x1edf88 + ':' + _0x2fb383;
        if (this["_videoThumbInFlight"]['has'](_0x500aeb)) {
          continue;
        }
        const _0x62fa85 = resolveAssetMaterialVideoSourceUrl(_0x4f422a?.["nodeData"]) || (this["_isVideoMediaSrc"](_0x47f098) ? _0x47f098 : '');
        if (!_0x62fa85) {
          continue;
        }
        this["_videoThumbInFlight"]["add"](_0x500aeb);
        _0x123c57 -= 0x1;
        this["_captureVideoFirstFrameDataUrl"](_0x62fa85)["then"](async _0x138587 => {
          if (!String(_0x138587 || '')["startsWith"]("data:image/")) {
            return;
          }
          const _0x421cfb = await saveAssetThumbToServer({
            'assetId': _0x1edf88,
            'key': getAssetMaterialVideoThumbnailKey(_0x2fb383),
            'dataUrl': _0x138587
          });
          const _0x3c8967 = String(_0x421cfb?.["url"] || '');
          if (!_0x3c8967) {
            return;
          }
          _0x4f422a['thumbSrc'] = _0x3c8967;
          if (_0x2fb383 === 0x0) {
            _0x5e469c["coverUrl"] = _0x3c8967;
          }
          await saveAssetToServer(_0x5e469c);
          upsertAssetMentionAsset(_0x5e469c);
          this["sidebarPanel"]?.["classList"]["contains"]('show') && this["_scheduleSidebarRender"]();
        })["catch"](() => {})['finally'](() => {
          this["_videoThumbInFlight"]["delete"](_0x500aeb);
        });
      }
    }
  }
  async ["loadAssetsFromServer"]() {
    this['_materialLoadingCount'] += 0x1;
    this["_renderMaterialLoadingState"]();
    try {
      const _0x385a4b = await fetchAssetsFromServer();
      this["assets"] = _sortAssetsByUpdatedTime((Array["isArray"](_0x385a4b) ? _0x385a4b : [])["map"](_0x41138b => this["_normalizeAssetEntity"](_0x41138b))["filter"](Boolean));
      this["_syncTabsFromAssets"]();
      this["_renderSidebarTabs"]();
      this["assets"]["forEach"](_0x3bfda6 => {
        _0x3bfda6["nodes"] && _0x3bfda6["nodes"][0x0] && !isAssetMaterialThumbnailUrl(_0x3bfda6["coverUrl"]) && (_0x3bfda6['coverUrl'] = resolveAssetNodeCoverUrl(_0x3bfda6["nodes"][0x0]) || _0x3bfda6['coverUrl'] || '');
        if (Array["isArray"](_0x3bfda6["items"])) {
          _0x3bfda6["items"] = getMaterialAssetItems(_0x3bfda6)["map"](_0xad4498 => ({
            ..._0xad4498,
            'thumbSrc': _resolveMaterialItemThumbSrc(_0xad4498)
          }));
        } else {
          Array["isArray"](_0x3bfda6["nodes"]) && (_0x3bfda6["items"] = _0x3bfda6["nodes"]["map"](_0x4a1da6 => _buildAssetItem(_0x4a1da6)));
        }
      });
      setAssetMentionAssets(this["_getMentionEligibleAssets"]());
      this['_warmVisibleAssetMedia']();
      this["sidebarPanel"] && this['sidebarPanel']["classList"]['contains']("show") && this["renderSidebarContent"]();
    } catch (_0x4c2422) {
      console["error"]("加载全局素材失败", _0x4c2422);
    } finally {
      this['_materialLoadingCount'] = Math["max"](0x0, this["_materialLoadingCount"] - 0x1);
      this["_renderMaterialLoadingState"]();
    }
  }
  ["refreshAssetsFromServer"]() {
    const _0x57bc55 = Promise['resolve'](this['_assetLoadPromise'])["catch"](() => {})["then"](() => this['loadAssetsFromServer']());
    this['_assetLoadPromise'] = _0x57bc55;
    return _0x57bc55;
  }
  async ["upsertMediaAssetPackage"](_0xdb5bc5 = {}) {
    const _0x255a5c = String(_0xdb5bc5?.["packageKey"] || '')["trim"]();
    if (!_0x255a5c) {
      throw new Error('加入素材包失败：缺少素材包标识。');
    }
    const _0x207f4f = this['_assetPackageUpsertByKey']["get"](_0x255a5c) || Promise["resolve"]();
    const _0x34c8ad = _0x207f4f["catch"](() => {})["then"](async () => {
      await this["_assetLoadPromise"];
      const _0x56c6db = (this["assets"] || [])["find"](_0x59e138 => String(_0x59e138?.['packageKey'] || '')['trim']() === _0x255a5c) || null;
      const _0x45d0ec = upsertMediaAssetPackage(_0x56c6db, _0xdb5bc5, {
        'createId': _0x4c4a09 => generateId(_0x4c4a09),
        'now': Date['now']()
      });
      await saveAssetToServer(_0x45d0ec["asset"]);
      this["_upsertLocalAsset"](_0x45d0ec["asset"]);
      this["_scheduleVideoThumbJobs"]();
      this["sidebarPanel"]?.["classList"]["contains"]("show") && (this["_newAssetPulseId"] = String(_0x45d0ec["asset"]['id'] || ''), this['renderSidebarContent']());
      return {
        'assetId': _0x45d0ec['asset']['id'],
        'asset': _0x45d0ec["asset"],
        'itemIndex': _0x45d0ec["itemIndex"],
        'itemCreated': _0x45d0ec["itemCreated"],
        'packageCreated': _0x45d0ec["packageCreated"],
        'imageUrl': String(_0x45d0ec["item"]?.["nodeData"]?.["imageUrl"] || (_0x45d0ec["item"]?.["type"] !== "source-audio" ? _0x45d0ec["item"]?.["nodeData"]?.["src"] : '') || '')["trim"](),
        'audioUrl': String(_0x45d0ec["item"]?.['nodeData']?.["audioUrl"] || (_0x45d0ec['item']?.["type"] === "source-audio" ? _0x45d0ec['item']?.["nodeData"]?.["src"] : '') || '')["trim"]()
      };
    });
    this["_assetPackageUpsertByKey"]["set"](_0x255a5c, _0x34c8ad);
    try {
      return await _0x34c8ad;
    } finally {
      this['_assetPackageUpsertByKey']["get"](_0x255a5c) === _0x34c8ad && this['_assetPackageUpsertByKey']["delete"](_0x255a5c);
    }
  }
  ['showCreatePanel'](_0x59b2b8, _0x507bef, _0x1e493a = {}) {
    if (!_0x59b2b8 || _0x59b2b8["length"] === 0x0) {
      return;
    }
    void _0x507bef;
    this["closeCreatePanel"]();
    const _0x54464a = _0x1e493a['presentation'] === "library-save" ? "library-save" : "default";
    const _0xd77891 = document["createElement"]('div');
    _0xd77891["className"] = "v2-asset-create-backdrop show";
    const _0x283dd1 = document["createElement"]("div");
    _0x283dd1['className'] = "v2-asset-create-panel" + (_0x54464a === 'library-save' ? " v2-asset-create-panel--library-save" : '');
    _0x283dd1["setAttribute"]("role", "dialog");
    _0x283dd1['setAttribute']("aria-modal", "true");
    _0x283dd1['setAttribute']('aria-label', _0x54464a === "library-save" ? assetManagerText("createPanel.saveTitle") : assetManagerText("title"));
    const _0x427d34 = a935_0x5aa396['getState']();
    const _0x2031d9 = _0x427d34["nodes"][_0x59b2b8[0x0]];
    _0xd77891["appendChild"](_0x283dd1);
    document["body"]["appendChild"](_0xd77891);
    this["createPanelBackdrop"] = _0xd77891;
    this["createPanel"] = _0x283dd1;
    const _0x5a2981 = _0x54464a === "library-save" ? resolveAssetNodePreviewUrl(_0x2031d9) : resolveAssetNodeCoverUrl(_0x2031d9);
    const _0x5c622f = this['_buildCreatePanelCoverInfo'](_0x2031d9, _0x5a2981);
    this['_createPanelState'] = this["_createDefaultPanelState"](_0x59b2b8, _0x5c622f, {
      'presentation': _0x54464a,
      'defaultName': _0x54464a === 'library-save' ? _0x2031d9?.["name"] : ''
    });
    this['_renderCreatePanelContent']();
    _0xd77891["addEventListener"]("pointerdown", _0x1acd25 => {
      if (_0x1acd25["target"] === _0xd77891) {
        this["closeCreatePanel"]();
      }
    });
    this["_createPanelKeydownHandler"] = _0x43d49c => {
      if (_0x43d49c['key'] !== "Escape") {
        return;
      }
      if (this["_createPanelDropdownEl"]?.["contains"](_0x43d49c["target"])) {
        return;
      }
      this["closeCreatePanel"]();
    };
    document['addEventListener']("keydown", this["_createPanelKeydownHandler"]);
    !_0x5c622f["coverUrl"] && resolveAssetNodeCoverThumbId(_0x2031d9) && void this["_resolveCreatePanelCover"](_0x2031d9, {
      'preferPreview': _0x54464a === "library-save"
    })["then"](_0x3e47ab => {
      this['_applyCreatePanelCoverInfo'](_0x283dd1, _0x3e47ab);
    })['catch'](() => {});
  }
  ["showLibrarySavePanel"](_0x1b7d17, _0x175104 = null, _0x5cfac1 = {}) {
    this["showCreatePanel"](_0x1b7d17, _0x175104, {
      ..._0x5cfac1,
      'placement': "center",
      'presentation': "library-save"
    });
  }
  ["_playCreateAssetFly"](_0x45bad8) {
    const _0x43e72e = _0x45bad8 && _0x45bad8["isConnected"] ? _0x45bad8 : this["createPanel"];
    if (!_0x43e72e?.["isConnected"]) {
      return;
    }
    const _0x6e9cb3 = _0x43e72e["querySelector"](".v2-asset-create-cover");
    const _0x1c2975 = _0x6e9cb3?.["firstElementChild"];
    if (!_0x1c2975) {
      return;
    }
    const _0x1e7df7 = document["getElementById"]("btnAssets");
    playAssetCreateFly({
      'fromElement': _0x1c2975,
      'toElement': _0x1e7df7
    });
  }
  ["closeCreatePanel"]() {
    const _0x463eef = this["_categoryKey"](this['_createPanelState']?.['editingFolderCategory']);
    _0x463eef && !this["_createPanelState"]?.["folderActionBusyKey"] && this["_renamingMaterialCategoryKey"] === _0x463eef && (this["_renamingMaterialCategoryKey"] = '');
    this["_createPanelDropdownOutsideHandler"] && (document["removeEventListener"]("pointerdown", this["_createPanelDropdownOutsideHandler"]), this["_createPanelDropdownOutsideHandler"] = null);
    this["_createPanelDropdownEl"] && (this['_createPanelDropdownEl']["remove"](), this["_createPanelDropdownEl"] = null);
    this['_createPanelKeydownHandler'] && (document["removeEventListener"]("keydown", this["_createPanelKeydownHandler"]), this['_createPanelKeydownHandler'] = null);
    this["_createPanelCoverObjectUrl"] && (String(this['_createPanelCoverObjectUrl'])["startsWith"]("blob:") && URL["revokeObjectURL"](this["_createPanelCoverObjectUrl"]), this["_createPanelCoverObjectUrl"] = '');
    this["createPanel"] && (this["createPanel"]["remove"](), this["createPanel"] = null);
    this["createPanelBackdrop"] && (this["createPanelBackdrop"]['remove'](), this["createPanelBackdrop"] = null);
    this["_createPanelState"] = null;
  }
  ["initSidebarPanel"]() {
    this["sidebarPanel"] = document['createElement']("div");
    this["sidebarPanel"]['className'] = 'v2-asset-sidebar-panel\x20canvas-toolbar-panel-surface';
    this["sidebarPanel"]["setAttribute"]('aria-label', assetManagerText("libraryTitle"));
    this['sidebarPanel']["innerHTML"] = "\n      <div class=\"v2-asset-sidebar-header\">\n        <button type=\"button\" class=\"v2-material-library-close\" data-ui-action=\"material-library-close\" aria-label=\"" + _escapeHtml(assetManagerText("back")) + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20aria-hidden=\x22true\x22><path\x20d=\x22m15\x2018-6-6\x206-6\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x221.8\x22\x20stroke-linecap=\x22round\x22\x20stroke-linejoin=\x22round\x22/></svg>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22v2-asset-sidebar-title\x22\x20id=\x22asset-sidebar-title\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22v2-asset-sidebar-title-text\x22\x20id=\x22asset-sidebar-title-text\x22>' + assetManagerText('libraryTitle') + "</span>\n          <span class=\"v2-material-library-loading\" data-material-loading role=\"status\" aria-live=\"polite\" hidden>\n            <span class=\"v2-material-library-loading-spinner\" aria-hidden=\"true\"></span>\n            <span class=\"v2-material-library-loading-label\">" + _escapeHtml(assetManagerText('loading')) + "</span>\n          </span>\n        </div>\n        <button type=\"button\" class=\"v2-material-library-add\" data-ui-action=\"material-new-folder\" aria-label=\"" + _escapeHtml(assetManagerText('newFolder')) + "\">\n          <svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M12 5v14M5 12h14\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\"/></svg>\n        </button>\n      </div>\n      <div class=\"v2-material-library-tools\">\n        <label class=\"v2-material-library-search\">\n          <svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><circle cx=\"11\" cy=\"11\" r=\"7\" stroke=\"currentColor\" stroke-width=\"1.7\"/><path d=\"m16.5 16.5 4 4\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\"/></svg>\n          <input type=\"search\" data-material-search placeholder=\"" + _escapeHtml(assetManagerText("searchPlaceholder")) + "\" aria-label=\"" + _escapeHtml(assetManagerText("searchAria")) + "\" autocomplete=\"off\" />\n        </label>\n        <button type=\"button\" class=\"v2-material-library-favorites\" data-ui-action=\"material-favorites-toggle\" aria-pressed=\"false\">\n          <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z\" fill=\"currentColor\"/></svg>\n          <span>" + assetManagerText("favorites") + "</span>\n        </button>\n        <div class=\"v2-material-library-divider\"></div>\n        <div class=\"v2-material-library-section-label\">" + assetManagerText('folders') + "</div>\n      </div>\n      <div class=\"v2-asset-sidebar-content\" id=\"asset-sidebar-content\">\n        <div class=\"v2-material-library-tree\" role=\"tree\" aria-label=\"" + _escapeHtml(assetManagerText("folders")) + "\"></div>\n      </div>\n    ";
    const _0x21f0d5 = document["querySelector"](".sidebar-floating");
    _0x21f0d5 ? _0x21f0d5["appendChild"](this["sidebarPanel"]) : document['body']["appendChild"](this["sidebarPanel"]);
    const _0xa2e0e6 = this["sidebarPanel"]["querySelector"]('[data-material-search]');
    _0xa2e0e6?.['addEventListener']("input", _0x131e90 => {
      this["_materialSearchQuery"] = String(_0x131e90["currentTarget"]?.['value'] || '');
      this['_closeMaterialMenu']();
      this['_hideMaterialPreview']();
      this["renderSidebarContent"]();
    });
    this["sidebarPanel"]['querySelector']("#asset-sidebar-content")?.['addEventListener']("scroll", () => {
      this['_closeMaterialMenu']();
      const _0x2b487d = this["_materialPreviewRow"];
      _0x2b487d?.["isConnected"] ? window["requestAnimationFrame"](() => {
        _0x2b487d === this["_materialPreviewRow"] && this['_showMaterialPreview'](_0x2b487d);
      }) : this['_hideMaterialPreview']();
    }, {
      'passive': !![]
    });
    this["sidebarPanel"]["addEventListener"]("click", _0x54da2d => {
      const _0x588df2 = _0x54da2d['target']["closest"]("[data-ui-action]");
      const _0x1bc291 = _0x588df2?.["dataset"]?.["uiAction"] || '';
      if (_0x1bc291) {
        this["_cancelPendingMaterialAssetRowToggle"]();
      }
      if (_0x1bc291 === 'material-library-close') {
        this["hideSidebarPanel"]();
        return;
      }
      if (_0x1bc291 === "material-new-folder") {
        this["_createMaterialFolder"]({
          'parentCategory': this["_materialCurrentFolderCategory"] || this["activeTab"],
          'surface': "sidebar"
        });
        return;
      }
      if (_0x1bc291 === "material-favorites-toggle") {
        this["_materialFavoritesOnly"] = !this["_materialFavoritesOnly"];
        this["_closeMaterialMenu"]();
        this["_hideMaterialPreview"]();
        this["renderSidebarContent"]();
        return;
      }
      if (_0x1bc291 === 'material-folder-rename') {
        this["_beginRenameMaterialCategory"](_0x588df2?.["dataset"]?.["category"]);
        return;
      }
      if (_0x1bc291 === 'material-rename') {
        this['_beginRenameAsset'](_0x588df2?.['dataset']?.['assetId']);
        return;
      }
      if (_0x1bc291 === "material-item-rename") {
        this["_beginRenameMaterialItem"](_0x588df2?.["dataset"]?.["assetId"], _0x588df2?.['dataset']?.["itemIndex"]);
        return;
      }
      if (_0x1bc291 === "material-folder-delete-request") {
        const _0x169b7a = this['_normalizeCategoryName'](_0x588df2?.["dataset"]?.["category"]);
        if (!_0x169b7a || !this["_isUserCategory"](_0x169b7a)) {
          return;
        }
        this["_pendingMaterialFolderDeleteKey"] = this["_categoryKey"](_0x169b7a);
        this["_closeMaterialMenu"]();
        this["_hideMaterialPreview"]();
        this["renderSidebarContent"]();
        return;
      }
      if (_0x1bc291 === "material-folder-delete-cancel") {
        this["_pendingMaterialFolderDeleteKey"] = '';
        this["renderSidebarContent"]();
        return;
      }
      if (_0x1bc291 === "material-folder-delete-confirm") {
        const _0x27d379 = this["_normalizeCategoryName"](_0x588df2?.["dataset"]?.["category"]);
        const _0x284c4d = this["_categoryKey"](_0x27d379);
        if (!_0x27d379 || !this["_isUserCategory"](_0x27d379) || this["_pendingMaterialFolderDeleteKey"] !== _0x284c4d || this["_deletingMaterialFolderKey"]) {
          return;
        }
        this["_pendingMaterialFolderDeleteKey"] = '';
        this["_deletingMaterialFolderKey"] = _0x284c4d;
        this['renderSidebarContent']();
        void this["_deleteUserCategory"](_0x27d379)["finally"](() => {
          this["_deletingMaterialFolderKey"] === _0x284c4d && (this["_deletingMaterialFolderKey"] = '');
          this['renderSidebarContent']();
        });
        return;
      }
      if (_0x1bc291 === "material-folder-toggle") {
        this["_toggleMaterialFolderDisclosure"](_0x588df2);
        return;
      }
      if (_0x1bc291 === "material-asset-toggle") {
        this["_toggleMaterialAssetDisclosure"](_0x588df2);
        return;
      }
      if (_0x1bc291 === "material-menu-open") {
        _0x54da2d["preventDefault"]();
        _0x54da2d["stopPropagation"]();
        const _0x129581 = String(_0x588df2?.["dataset"]?.["assetId"] || '');
        if (_0x129581) {
          this["_openMaterialMenu"](_0x129581, _0x588df2);
        }
        return;
      }
      if (_0x1bc291 || _0x54da2d["target"]["closest"]("input, button, [contenteditable='true'], .v2-material-folder-delete-actions")) {
        return;
      }
      const _0x1df12b = _0x54da2d['target']['closest'](".v2-material-folder-row");
      if (_0x1df12b) {
        const _0x39a71e = _0x1df12b["querySelector"]("[data-ui-action=\"material-folder-toggle\"]");
        _0x39a71e && !_0x39a71e["disabled"] && _0x54da2d['detail'] <= 0x1 && this["_toggleMaterialFolderDisclosure"](_0x39a71e);
        return;
      }
      const _0x1aff8c = _0x54da2d["target"]["closest"](".v2-material-project-row");
      if (_0x1aff8c) {
        const _0x338439 = _0x1aff8c["querySelector"]('[data-ui-action=\x22material-asset-toggle\x22]');
        _0x338439 && !_0x338439["disabled"] && _0x54da2d["detail"] <= 0x1 && this["_toggleMaterialAssetDisclosure"](_0x338439);
        return;
      }
      const _0x5a3505 = _0x54da2d["target"]["closest"](".v2-material-asset-row");
      if (_0x5a3505) {
        const _0x46556d = _0x5a3505["querySelector"]('[data-ui-action=\x22material-asset-toggle\x22]');
        if (!_0x46556d || _0x46556d["disabled"]) {
          return;
        }
        if (_0x54da2d['detail'] > 0x1) {
          this["_cancelPendingMaterialAssetRowToggle"]();
          return;
        }
        this["_scheduleMaterialAssetRowToggle"](_0x46556d);
      }
    });
    this["sidebarPanel"]['addEventListener']("contextmenu", _0x2dc656 => {
      this["_materialContextMenuController"]["handleContextMenu"](_0x2dc656);
    });
    this['sidebarPanel']["addEventListener"]('dblclick', _0x59209f => {
      _0x59209f["stopPropagation"]();
      if (_0x59209f["target"]["closest"](".v2-material-name-input, .v2-material-item-name-input, .v2-material-folder-name-input, [data-ui-action]")) {
        return;
      }
      const _0x4cef6c = _0x59209f["target"]["closest"]("[data-material-use]");
      const _0x4a9872 = String(_0x4cef6c?.["dataset"]?.["assetId"] || '');
      if (!_0x4cef6c || !_0x4a9872) {
        return;
      }
      this['_cancelPendingMaterialAssetRowToggle']();
      _0x59209f['preventDefault']();
      _0x59209f['stopPropagation']();
      const _0x2edb07 = Number(_0x4cef6c["dataset"]['itemIndex']);
      _0x4cef6c["dataset"]["itemIndex"] !== undefined && Number["isFinite"](_0x2edb07) ? this['_restoreAssetSubItem'](_0x4a9872, _0x2edb07) : this['restoreAssetToCanvas'](_0x4a9872);
    });
    this['sidebarPanel']['addEventListener']("keydown", _0x50af3c => {
      const _0x47f256 = _0x50af3c["target"]["closest"](".v2-material-item-name-input");
      if (_0x47f256) {
        if (_0x50af3c["key"] === "Enter") {
          _0x50af3c["preventDefault"]();
          _0x50af3c["stopPropagation"]();
          _0x47f256["dataset"]["submitted"] = '1';
          void this["_commitRenameMaterialItem"](_0x47f256["dataset"]["assetId"], _0x47f256["dataset"]["itemIndex"], _0x47f256["value"]);
        } else {
          _0x50af3c["key"] === "Escape" && (_0x50af3c['preventDefault'](), _0x50af3c["stopPropagation"](), _0x47f256["dataset"]['submitted'] = '1', this["_cancelRenameMaterialItem"]());
        }
        return;
      }
      const _0x54539e = _0x50af3c["target"]["closest"]('.v2-material-folder-name-input');
      if (_0x54539e) {
        if (_0x50af3c["key"] === "Enter") {
          _0x50af3c["preventDefault"]();
          _0x50af3c["stopPropagation"]();
          _0x54539e["dataset"]["submitted"] = '1';
          void this['_commitRenameMaterialCategory'](_0x54539e["dataset"]["category"], _0x54539e["value"]);
        } else {
          _0x50af3c["key"] === "Escape" && (_0x50af3c["preventDefault"](), _0x50af3c["stopPropagation"](), _0x54539e["dataset"]["submitted"] = '1', this['_cancelRenameMaterialCategory']());
        }
        return;
      }
      const _0x68ecc2 = _0x50af3c['target']['closest']('.v2-material-name-input');
      if (!_0x68ecc2) {
        return;
      }
      const _0xf18dac = String(_0x68ecc2["dataset"]["assetId"] || '');
      if (_0x50af3c["key"] === "Enter") {
        _0x50af3c["preventDefault"]();
        _0x68ecc2["dataset"]["submitted"] = '1';
        void this["_commitRenameAsset"](_0xf18dac, _0x68ecc2['value']);
      } else {
        _0x50af3c["key"] === "Escape" && (_0x50af3c["preventDefault"](), _0x68ecc2["dataset"]["submitted"] = '1', this['_cancelRenameAsset']());
      }
    });
    this["sidebarPanel"]["addEventListener"]('focusout', _0x5bcaf6 => {
      const _0x2a7bc6 = _0x5bcaf6["target"]["closest"](".v2-material-item-name-input");
      if (_0x2a7bc6) {
        if (_0x2a7bc6["dataset"]["submitted"] === '1') {
          return;
        }
        _0x2a7bc6['dataset']["submitted"] = '1';
        void this['_commitRenameMaterialItem'](_0x2a7bc6["dataset"]["assetId"], _0x2a7bc6["dataset"]["itemIndex"], _0x2a7bc6["value"]);
        return;
      }
      const _0xa2e1cb = _0x5bcaf6['target']['closest'](".v2-material-folder-name-input");
      if (_0xa2e1cb) {
        if (_0xa2e1cb["dataset"]["submitted"] === '1') {
          return;
        }
        _0xa2e1cb["dataset"]['submitted'] = '1';
        void this["_commitRenameMaterialCategory"](_0xa2e1cb["dataset"]['category'], _0xa2e1cb["value"]);
        return;
      }
      const _0x29cbeb = _0x5bcaf6["target"]["closest"](".v2-material-name-input");
      if (!_0x29cbeb || _0x29cbeb["dataset"]["submitted"] === '1') {
        return;
      }
      _0x29cbeb["dataset"]["submitted"] = '1';
      void this["_commitRenameAsset"](_0x29cbeb["dataset"]['assetId'], _0x29cbeb["value"]);
    });
    this["sidebarPanel"]["addEventListener"]("pointerover", _0x494554 => {
      const _0x647e8d = _0x494554["target"]["closest"]("[data-material-preview]");
      if (!_0x647e8d || _0x647e8d['contains'](_0x494554["relatedTarget"])) {
        return;
      }
      this["_showMaterialPreview"](_0x647e8d);
    });
    this["sidebarPanel"]["addEventListener"]("pointerout", _0xa8d573 => {
      const _0x2969c8 = _0xa8d573["target"]['closest']("[data-material-preview]");
      if (!_0x2969c8 || _0x2969c8['contains'](_0xa8d573["relatedTarget"])) {
        return;
      }
      this["_hideMaterialPreview"]();
    });
    this["sidebarPanel"]["addEventListener"]("dragstart", _0x4193da => {
      const _0x2c86a0 = _0x4193da["target"]["closest"]('[data-material-drag]');
      const _0x11974e = String(_0x2c86a0?.["dataset"]?.["assetId"] || '');
      if (!_0x2c86a0 || !_0x11974e || !_0x4193da["dataTransfer"]) {
        _0x4193da["preventDefault"]();
        return;
      }
      const _0x21228d = {
        'assetId': _0x11974e,
        'itemIndex': _0x2c86a0["dataset"]["itemIndex"] === undefined ? null : Number(_0x2c86a0["dataset"]['itemIndex'])
      };
      _0x4193da["dataTransfer"]["setData"]('application/x-aicanvas-material', JSON["stringify"](_0x21228d));
      _0x4193da["dataTransfer"]["effectAllowed"] = "copy";
      _0x2c86a0["classList"]["add"]("is-dragging");
      this["_hideMaterialPreview"]();
      this["_closeMaterialMenu"]();
    });
    this["sidebarPanel"]['addEventListener']('dragend', _0x42721a => {
      _0x42721a["target"]["closest"]("[data-material-drag]")?.['classList']['remove']("is-dragging");
    });
    this["_installMaterialDropTarget"]();
    const _0x42ba91 = document["getElementById"]("btnAssets");
    if (_0x42ba91) {
      let _0x539857 = ![];
      const _0x10333a = () => {
        !this["sidebarPanel"]["classList"]["contains"]("show") && this["showSidebarPanel"]();
        if (!_0x539857) {
          _0x539857 = !![];
          const _0x14a657 = this["_materialLoadingCount"] > 0x0 ? this['_assetLoadPromise'] : this['loadAssetsFromServer']();
          this["_assetLoadPromise"] = Promise["resolve"](_0x14a657);
          this['_assetLoadPromise']["finally"](() => {
            _0x539857 = ![];
          });
        }
      };
      registerSidebarSubmenu({
        'key': "assets",
        'button': _0x42ba91,
        'panel': this["sidebarPanel"],
        'open': _0x10333a,
        'close': () => this["hideSidebarPanel"](),
        'isOpen': () => this["sidebarPanel"]['classList']["contains"]("show"),
        'ignorePointerDown': _0x4efb74 => this['_materialMenuEl']?.["contains"]?.(_0x4efb74["target"]) === !![]
      });
    }
  }
  ["showSidebarPanel"]() {
    this["_expandedMaterialCategories"]["clear"]();
    this['_expandedMaterialAssets']["clear"]();
    this['_pendingMaterialFolderDeleteKey'] = '';
    this["_deletingMaterialFolderKey"] = '';
    this["sidebarPanel"]["classList"]['add']("show");
    this['renderSidebarContent']();
    this["_warmVisibleAssetMedia"]();
  }
  ["hideSidebarPanel"]() {
    this["_materialContextMenuController"]['close']();
    this['_closeMaterialMenu']();
    this["_hideMaterialPreview"]();
    this['sidebarPanel']["classList"]["remove"]("show");
    const _0x2ce8bc = document['getElementById']("btnAssets");
    _0x2ce8bc?.["classList"]["remove"]('active');
    _0x2ce8bc?.["setAttribute"]("aria-expanded", "false");
  }
  ["_installMaterialDropTarget"]() {
    if (this['_materialDropTarget']) {
      return;
    }
    const _0x32a2da = document['getElementById']("v2-wrap");
    if (!_0x32a2da) {
      return;
    }
    this["_materialDropTarget"] = _0x32a2da;
    const _0x1ddb88 = _0x5e5209 => Array["from"](_0x5e5209['dataTransfer']?.["types"] || [])["includes"]('application/x-aicanvas-material');
    _0x32a2da["addEventListener"]('dragover', _0x5d8e0c => {
      if (!_0x1ddb88(_0x5d8e0c)) {
        return;
      }
      if (_0x5d8e0c["target"]["closest"](".v2-asset-sidebar-panel") || _0x5d8e0c["target"]["closest"](".v2-material-context-menu")) {
        return;
      }
      _0x5d8e0c['preventDefault']();
      _0x5d8e0c["dataTransfer"]["dropEffect"] = "copy";
    });
    _0x32a2da["addEventListener"]("drop", _0x181b29 => {
      const _0x5f4509 = _0x181b29["dataTransfer"]?.["getData"]("application/x-aicanvas-material");
      if (!_0x5f4509 || _0x181b29['target']["closest"](".v2-asset-sidebar-panel")) {
        return;
      }
      _0x181b29["preventDefault"]();
      let _0x524590 = null;
      try {
        _0x524590 = JSON["parse"](_0x5f4509);
      } catch (_0x53fd9a) {
        return;
      }
      const _0x15753b = String(_0x524590?.["assetId"] || '');
      if (!_0x15753b) {
        return;
      }
      const _0x16f80c = screenToWorld(_0x181b29["clientX"], _0x181b29["clientY"], a935_0x5aa396["getState"]()["viewport"]);
      Number['isFinite'](_0x524590?.["itemIndex"]) ? this["_restoreAssetSubItem"](_0x15753b, _0x524590['itemIndex'], _0x16f80c) : this["restoreAssetToCanvas"](_0x15753b, _0x16f80c);
    });
  }
  ["_getMaterialAsset"](_0x36169b) {
    const _0xd38b59 = String(_0x36169b || '');
    return (this["assets"] || [])['find'](_0xb04ddc => String(_0xb04ddc?.['id'] || '') === _0xd38b59);
  }
  ["_materialMenuIcon"](_0x2c955a) {
    const _0x41dbe2 = {
      'favorite': "<path d=\"m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/>",
      'rename': "<path d=\"m4 16-.8 4 4-.8L18.4 8 15.9 5.6 4 16Z\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linejoin=\"round\"/><path d=\"m13.8 7.7 2.5 2.5\" stroke=\"currentColor\" stroke-width=\"1.7\"/>",
      'move': "<path d=\"M3.5 7.5h6l2-2h9v13h-17v-11Z\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linejoin=\"round\"/>",
      'duplicate': "<rect x=\"7\" y=\"7\" width=\"12\" height=\"12\" rx=\"2\" stroke=\"currentColor\" stroke-width=\"1.7\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\" stroke=\"currentColor\" stroke-width=\"1.7\"/>",
      'download': '<path\x20d=\x22M12\x203v12m0\x200\x204-4m-4\x204-4-4M5\x2018v3h14v-3\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x221.7\x22\x20stroke-linecap=\x22round\x22\x20stroke-linejoin=\x22round\x22/>',
      'cancel': '<path\x20d=\x22m6\x206\x2012\x2012M18\x206\x206\x2018\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x221.8\x22\x20stroke-linecap=\x22round\x22/>',
      'delete': "<path d=\"M4 7h16M9 3h6l1 2H8l1-2Zm-3 4 1 14h10l1-14M10 11v6m4-6v6\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>"
    };
    return "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\">" + (_0x41dbe2[_0x2c955a] || '') + "</svg>";
  }
  ["_materialMenuButton"](_0x6e7069, _0x10b223, _0xdcc548, _0x1cb516 = '', _0x1e3b9c = '') {
    const _0x20b80a = String(_0x1e3b9c || '')["trim"]();
    const _0x24df3e = _0x20b80a ? getShortcutLabel(_0x20b80a) : '';
    const _0x4c56d7 = _0x20b80a ? " data-shortcut-action=\"" + _escapeHtml(_0x20b80a) + '\x22' : '';
    const _0x50df36 = _0x24df3e ? '<span\x20class=\x22v2-menu-kbd\x22>' + _escapeHtml(_0x24df3e) + "</span>" : '';
    return "<button type=\"button\" role=\"menuitem\" data-material-menu-action=\"" + _0x6e7069 + '\x22' + _0x4c56d7 + '\x20' + _0x1cb516 + ">\n      " + this['_materialMenuIcon'](_0x10b223) + "\n      <span>" + _escapeHtml(_0xdcc548) + "</span>\n      " + _0x50df36 + '\x0a\x20\x20\x20\x20</button>';
  }
  ["_openMaterialMenu"](_0x488162, _0x16ff45) {
    const _0x5cd74f = this["_getMaterialAsset"](_0x488162);
    if (!_0x5cd74f || !_0x16ff45) {
      return;
    }
    this['_hideMaterialPreview']();
    this["_closeMaterialMenu"]();
    this["_materialMenuState"] = {
      'assetId': String(_0x488162),
      'anchorEl': _0x16ff45,
      'showMove': ![],
      'confirmDelete': ![],
      'busy': ![]
    };
    const _0x8d7743 = document["createElement"]("div");
    _0x8d7743["className"] = 'v2-material-context-menu';
    _0x8d7743["setAttribute"]('role', "menu");
    _0x8d7743['setAttribute']("aria-label", assetManagerText("menu.aria"));
    _0x8d7743["addEventListener"]("click", _0x2dfddb => {
      const _0xc93c26 = _0x2dfddb["target"]['closest']("[data-material-menu-action]");
      const _0x184580 = String(_0xc93c26?.["dataset"]?.["materialMenuAction"] || '');
      if (!_0x184580 || this["_materialMenuState"]?.["busy"]) {
        return;
      }
      _0x2dfddb["preventDefault"]();
      _0x2dfddb["stopPropagation"]();
      this["_handleMaterialMenuAction"](_0x184580, _0xc93c26);
    });
    document['body']["appendChild"](_0x8d7743);
    this['_materialMenuEl'] = _0x8d7743;
    this["_renderMaterialMenu"]();
    this["_materialMenuOutsideHandler"] = _0x3772c7 => {
      if (this["_materialMenuEl"]?.["contains"](_0x3772c7["target"]) || this['_materialMenuState']?.['anchorEl']?.["contains"]?.(_0x3772c7["target"])) {
        return;
      }
      this["_closeMaterialMenu"]();
    };
    this["_materialMenuKeydownHandler"] = _0x3917c9 => {
      const _0x217c49 = Array["from"](this["_materialMenuEl"]?.["querySelectorAll"]?.('[data-shortcut-action]') || []);
      const _0x25974a = resolveShortcutActionForEvent(_0x3917c9, _0x217c49["map"](_0x532afa => _0x532afa["dataset"]["shortcutAction"]));
      if (_0x25974a && _0x3917c9["repeat"] !== !![]) {
        const _0x4af44b = _0x217c49["find"](_0x25c1be => _0x25c1be["dataset"]["shortcutAction"] === _0x25974a);
        const _0x3c578b = String(_0x4af44b?.["dataset"]?.['materialMenuAction'] || '');
        if (_0x3c578b) {
          _0x3917c9["preventDefault"]();
          _0x3917c9['stopImmediatePropagation']();
          this['_handleMaterialMenuAction'](_0x3c578b, _0x4af44b);
          return;
        }
      }
      if (_0x3917c9["key"] !== "Escape") {
        return;
      }
      _0x3917c9["preventDefault"]();
      _0x3917c9["stopImmediatePropagation"]();
      const _0x325177 = this["_materialMenuState"]?.['anchorEl'];
      this['_closeMaterialMenu']();
      _0x325177?.["focus"]?.({
        'preventScroll': !![]
      });
    };
    document["addEventListener"]("pointerdown", this["_materialMenuOutsideHandler"]);
    document["addEventListener"]("keydown", this['_materialMenuKeydownHandler'], !![]);
  }
  ["_positionMaterialMenu"]() {
    const _0x448370 = this["_materialMenuEl"];
    const _0x3bfdc6 = this["_materialMenuState"]?.['anchorEl'];
    if (!_0x448370) {
      return;
    }
    if (!_0x3bfdc6?.["isConnected"]) {
      this["_closeMaterialMenu"]();
      return;
    }
    const _0x2544fc = _0x3bfdc6["getBoundingClientRect"]();
    const _0x2e4dd6 = _0x448370["getBoundingClientRect"]();
    const _0x266e17 = document["documentElement"]?.["clientWidth"] || window["innerWidth"] || 0x0;
    const _0x15784d = document["documentElement"]?.["clientHeight"] || window["innerHeight"] || 0x0;
    const _0x141cc9 = 0x8;
    let _0xd7ffd1 = _0x2544fc['right'] + _0x141cc9;
    _0xd7ffd1 + _0x2e4dd6["width"] > _0x266e17 - 0xc && (_0xd7ffd1 = Math["max"](0xc, _0x2544fc['left'] - _0x2e4dd6['width'] - _0x141cc9));
    const _0x8b6b30 = Math["max"](0xc, Math["min"](_0x2544fc['top'] - 0x8, _0x15784d - _0x2e4dd6['height'] - 0xc));
    _0x448370["style"]["left"] = Math['round'](_0xd7ffd1) + 'px';
    _0x448370['style']["top"] = Math["round"](_0x8b6b30) + 'px';
  }
  ["_renderMaterialMenu"]() {
    const _0x37e4ba = this["_materialMenuEl"];
    const _0x21d864 = this["_materialMenuState"];
    const _0x58a914 = this["_getMaterialAsset"](_0x21d864?.['assetId']);
    if (!_0x37e4ba || !_0x21d864 || !_0x58a914) {
      this["_closeMaterialMenu"]();
      return;
    }
    if (_0x21d864["busy"]) {
      _0x37e4ba["innerHTML"] = '<div\x20class=\x22v2-material-menu-pending\x22\x20role=\x22status\x22><span></span>' + _escapeHtml(assetManagerText('menu.processing')) + "</div>";
      this["_positionMaterialMenu"]();
      return;
    }
    if (_0x21d864['confirmDelete']) {
      _0x37e4ba["innerHTML"] = "\n        <div class=\"v2-material-menu-confirm\">" + _escapeHtml(assetManagerText('menu.confirmDelete', {
        'name': _0x58a914['name'] || assetManagerText("unnamedAsset")
      })) + '</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22v2-material-menu-confirm-actions\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + this["_materialMenuButton"]('delete-cancel', "cancel", assetManagerText("cancel"), '', 'context-material-cancel-delete') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + this["_materialMenuButton"]("delete-confirm", "delete", assetManagerText('menu.delete'), "class=\"is-danger\"", "context-material-confirm-delete") + "\n        </div>\n      ";
      this["_positionMaterialMenu"]();
      return;
    }
    const _0x4365d1 = this["_categoryKey"](_0x58a914["category"]);
    const _0x44a741 = (this["tabs"] || [])["filter"](_0x3ea540 => this["_categoryKey"](_0x3ea540) !== _0x4365d1);
    const _0x247910 = _0x21d864["showMove"] ? "<div class=\"v2-material-move-submenu\" role=\"menu\" aria-label=\"" + _escapeHtml(assetManagerText("menu.moveTo")) + "\">\n          " + (_0x44a741["length"] ? _0x44a741["map"](_0x16cb71 => "<button type=\"button\" role=\"menuitem\" data-material-menu-action=\"move-target\" data-category=\"" + _escapeHtml(_0x16cb71) + '\x22>' + this["_materialMenuIcon"]("move") + "<span>" + _escapeHtml(this["_formatCategoryLabel"](_0x16cb71)) + "</span></button>")['join']('') : "<div class=\"v2-material-menu-empty\">" + _escapeHtml(assetManagerText("menu.noMoveTarget")) + '</div>') + "\n        </div>" : '';
    _0x37e4ba["innerHTML"] = "\n      " + this["_materialMenuButton"]('favorite', "favorite", isMaterialAssetFavorite(_0x58a914) ? assetManagerText("menu.unfavorite") : assetManagerText('menu.favorite'), '', isMaterialAssetFavorite(_0x58a914) ? "context-material-unfavorite" : "context-material-favorite") + "\n      " + this["_materialMenuButton"]("rename", "rename", assetManagerText('menu.rename'), '', 'context-material-rename') + '\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22v2-material-menu-submenu-wrap\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + this["_materialMenuButton"]('move', 'move', assetManagerText('menu.moveTo'), "aria-haspopup=\"menu\" aria-expanded=\"" + (_0x21d864['showMove'] ? 'true' : "false") + '\x22', "context-material-open-move-menu") + "\n        " + _0x247910 + "\n      </div>\n      " + this["_materialMenuButton"]("duplicate", "duplicate", assetManagerText('menu.duplicate'), '', "context-material-duplicate") + '\x0a\x20\x20\x20\x20\x20\x20' + this['_materialMenuButton']("download", "download", assetManagerText("menu.download"), '', 'context-material-download') + "\n      <div class=\"v2-material-menu-separator\"></div>\n      " + this["_materialMenuButton"]("delete", 'delete', assetManagerText('menu.delete'), "class=\"is-danger\"", "context-material-delete") + "\n    ";
    this["_positionMaterialMenu"]();
  }
  ["_closeMaterialMenu"]() {
    this['_materialMenuOutsideHandler'] && (document["removeEventListener"]('pointerdown', this["_materialMenuOutsideHandler"]), this["_materialMenuOutsideHandler"] = null);
    this["_materialMenuKeydownHandler"] && (document["removeEventListener"]("keydown", this["_materialMenuKeydownHandler"], !![]), this["_materialMenuKeydownHandler"] = null);
    this["_materialMenuEl"]?.["remove"]();
    this["_materialMenuEl"] = null;
    this["_materialMenuState"] = null;
  }
  async ["_runMaterialMenuTask"](_0x4d2647, _0x1f5f81, _0x20967f) {
    const _0x4e21ff = this["_materialMenuState"];
    if (!_0x4e21ff || _0x4e21ff['busy']) {
      return;
    }
    _0x4e21ff['busy'] = !![];
    this["_renderMaterialMenu"]();
    try {
      const _0x490ec4 = await _0x4d2647();
      this['_closeMaterialMenu']();
      this["renderSidebarContent"]();
      _0x1f5f81 && _0x490ec4 !== ![] && _0x490ec4?.['canceled'] !== !![] && window["showToast"]?.(_0x1f5f81, "success");
    } catch (_0x1c560e) {
      this['_materialMenuState'] === _0x4e21ff && (_0x4e21ff["busy"] = ![], this["_renderMaterialMenu"]());
      window["showToast"]?.(_0x1c560e?.['message'] || _0x20967f || assetManagerText('menu.actionFailed'), "error");
    }
  }
  ["_handleMaterialMenuAction"](_0x562b7e, _0x12734c) {
    const _0x5208da = this["_materialMenuState"];
    const _0x2d6f51 = String(_0x5208da?.["assetId"] || '');
    if (!_0x2d6f51) {
      return;
    }
    if (_0x562b7e === 'rename') {
      this['_closeMaterialMenu']();
      this["_beginRenameAsset"](_0x2d6f51);
      return;
    }
    if (_0x562b7e === "move") {
      _0x5208da["showMove"] = !_0x5208da['showMove'];
      this['_renderMaterialMenu']();
      return;
    }
    if (_0x562b7e === "delete") {
      _0x5208da['confirmDelete'] = !![];
      this["_renderMaterialMenu"]();
      return;
    }
    if (_0x562b7e === "delete-cancel") {
      _0x5208da["confirmDelete"] = ![];
      this['_renderMaterialMenu']();
      return;
    }
    if (_0x562b7e === "favorite") {
      void this["_runMaterialMenuTask"](() => this["_toggleMaterialFavorite"](_0x2d6f51), assetManagerText('toasts.favoriteUpdated'), assetManagerText("menu.actionFailed"));
      return;
    }
    if (_0x562b7e === 'move-target') {
      void this["_runMaterialMenuTask"](() => this["_moveMaterialAsset"](_0x2d6f51, _0x12734c?.['dataset']?.["category"]), assetManagerText("toasts.moved"), assetManagerText('menu.actionFailed'));
      return;
    }
    if (_0x562b7e === "duplicate") {
      void this["_runMaterialMenuTask"](() => this['_duplicateMaterialAsset'](_0x2d6f51), assetManagerText("toasts.duplicated"), assetManagerText("menu.actionFailed"));
      return;
    }
    if (_0x562b7e === 'download') {
      void this['_runMaterialMenuTask'](() => this["_downloadMaterialAsset"](_0x2d6f51), '', assetManagerText("menu.downloadFailed"));
      return;
    }
    _0x562b7e === 'delete-confirm' && void this["_runMaterialMenuTask"](() => this["_deleteAsset"](_0x2d6f51), assetManagerText('toasts.deleted'), assetManagerText('deleteFailed'));
  }
  async ["_toggleMaterialFavorite"](_0x2c47b4) {
    const _0x3e26dc = this["_getMaterialAsset"](_0x2c47b4);
    if (!_0x3e26dc) {
      throw new Error(assetManagerText("menu.actionFailed"));
    }
    const _0xb4b1f7 = {
      ..._0x3e26dc,
      'favorite': !isMaterialAssetFavorite(_0x3e26dc),
      'updatedAt': Date['now']()
    };
    delete _0xb4b1f7["isFavorite"];
    await saveAssetToServer(_0xb4b1f7);
    this["_upsertLocalAsset"](_0xb4b1f7);
    return _0xb4b1f7;
  }
  async ["_moveMaterialAsset"](_0x3db952, _0x20b9af) {
    const _0x278cf4 = this['_getMaterialAsset'](_0x3db952);
    const _0x351e3f = this["_findCategoryByName"](_0x20b9af, this["tabs"]);
    if (!_0x278cf4 || !_0x351e3f) {
      throw new Error(assetManagerText("menu.actionFailed"));
    }
    const _0x1fd7a9 = {
      ..._0x278cf4,
      'category': _0x351e3f,
      'updatedAt': Date["now"]()
    };
    await saveAssetToServer(_0x1fd7a9);
    this['_upsertLocalAsset'](_0x1fd7a9);
    this["_expandedMaterialCategories"]['add'](this["_categoryKey"](_0x351e3f));
    return _0x1fd7a9;
  }
  async ["_duplicateMaterialAsset"](_0x488cdc) {
    const _0x40de2b = this["_getMaterialAsset"](_0x488cdc);
    const _0x167c9b = buildMaterialDuplicate(_0x40de2b, {
      'id': generateId("asset"),
      'now': Date["now"](),
      'nameSuffix': assetManagerText("copySuffix")
    });
    if (!_0x167c9b) {
      throw new Error(assetManagerText("menu.actionFailed"));
    }
    await saveAssetToServer(_0x167c9b);
    this["_upsertLocalAsset"](_0x167c9b);
    this["_newAssetPulseId"] = _0x167c9b['id'];
    return _0x167c9b;
  }
  async ["_downloadMaterialAsset"](_0x1b2f9d) {
    const _0x4fafee = this["_getMaterialAsset"](_0x1b2f9d);
    const _0x41c305 = buildMaterialDownloadFiles(_0x4fafee);
    if (!_0x41c305["length"]) {
      throw new Error(assetManagerText("menu.noDownloadableMedia"));
    }
    return await saveMediaFilesDownload({
      'title': assetManagerText("menu.downloadTitle", {
        'name': _0x4fafee?.['name'] || assetManagerText("unnamedAsset")
      }),
      'files': _0x41c305
    });
  }
  ["_ensureMaterialPreview"]() {
    if (this['_materialPreviewEl']?.["isConnected"]) {
      return this['_materialPreviewEl'];
    }
    const _0x30abc9 = document["createElement"]("div");
    _0x30abc9['className'] = "v2-material-hover-preview";
    _0x30abc9["setAttribute"]("role", "tooltip");
    _0x30abc9['hidden'] = !![];
    document['body']["appendChild"](_0x30abc9);
    this["_materialPreviewEl"] = _0x30abc9;
    return _0x30abc9;
  }
  ["_showMaterialPreview"](_0x2e4b7a) {
    if (!this["sidebarPanel"]?.["classList"]["contains"]("show")) {
      return;
    }
    const _0x35d2ef = this["_getMaterialAsset"](_0x2e4b7a?.["dataset"]?.['assetId']);
    if (!_0x35d2ef) {
      return;
    }
    this["_materialPreviewRow"] = _0x2e4b7a;
    const _0x51ded1 = _0x2e4b7a['dataset']['itemIndex'] === undefined ? null : Number(_0x2e4b7a['dataset']['itemIndex']);
    const _0x59d6b6 = getMaterialAssetItems(_0x35d2ef)["map"](_0x2ef52d => ({
      ..._0x2ef52d,
      'thumbSrc': _resolveMaterialItemThumbSrc(_0x2ef52d),
      'previewSrc': _resolveMaterialItemPreviewSrc(_0x2ef52d),
      'previewAspectRatio': resolveAssetNodePreviewAspectRatio(_0x2ef52d?.["nodeData"])
    }));
    const _0x47281d = Number['isFinite'](_0x51ded1) ? _0x59d6b6["slice"](_0x51ded1, _0x51ded1 + 0x1) : _0x59d6b6["slice"](0x0, 0x4);
    const _0x17871e = Number["isFinite"](_0x51ded1) ? _0x59d6b6[_0x51ded1] : null;
    const _0x396339 = _0x17871e?.["name"] || _0x17871e?.['nodeData']?.["name"] || _0x35d2ef["name"] || assetManagerText("unnamedAsset");
    const _0x5b517e = this["_ensureMaterialPreview"]();
    const _0x4825ac = _0x47281d["length"] === 0x1 ? _0x47281d[0x0] : null;
    const _0x5b511e = _0x4825ac?.['previewAspectRatio'] || 0x4 / 0x3;
    _0x5b517e["classList"]["toggle"]("is-single", Boolean(_0x4825ac));
    _0x4825ac ? _0x5b517e["style"]["setProperty"]("--material-preview-aspect", String(_0x5b511e)) : _0x5b517e["style"]['removeProperty']("--material-preview-aspect");
    _0x5b517e["innerHTML"] = '\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22v2-material-preview-media\x22></div>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22v2-material-preview-copy\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<strong>' + _escapeHtml(_0x396339) + "</strong>\n      </div>\n    ";
    const _0x54f1c6 = _0x5b517e["querySelector"](".v2-material-preview-media");
    if (!_0x47281d["length"]) {
      this['_setThumbContent'](_0x54f1c6, _0x35d2ef['coverUrl'], _0x35d2ef["coverType"] || "other");
    } else {
      if (_0x4825ac) {
        this["_setThumbContent"](_0x54f1c6, _0x4825ac["previewSrc"], _0x4825ac["type"]);
      } else {
        const _0x8a4781 = document["createElement"]("div");
        _0x8a4781["className"] = "v2-material-preview-grid has-" + Math['min'](0x4, _0x47281d["length"]);
        _0x47281d["forEach"](_0x5e3040 => {
          const _0x303a8f = document["createElement"]("div");
          _0x303a8f["className"] = "v2-material-preview-cell";
          _0x8a4781['appendChild'](_0x303a8f);
          this["_setThumbContent"](_0x303a8f, _0x5e3040["thumbSrc"], _0x5e3040["type"]);
        });
        _0x54f1c6["replaceChildren"](_0x8a4781);
      }
    }
    _0x5b517e["hidden"] = ![];
    const _0x1a2795 = _0x2e4b7a['getBoundingClientRect']();
    const _0x3e24ec = this["sidebarPanel"]['getBoundingClientRect']();
    const _0x5276f5 = _0x5b517e["getBoundingClientRect"]();
    const _0xd5894b = document['documentElement']?.["clientWidth"] || window["innerWidth"] || 0x0;
    const _0x2ecb02 = document["documentElement"]?.['clientHeight'] || window['innerHeight'] || 0x0;
    let _0x11fc64 = _0x3e24ec["right"] + 0xc;
    _0x11fc64 + _0x5276f5["width"] > _0xd5894b - 0xc && (_0x11fc64 = Math['max'](0xc, _0x3e24ec['left'] - _0x5276f5["width"] - 0xc));
    const _0x2456df = Math["max"](0xc, Math['min'](_0x1a2795['top'] - 0x8, _0x2ecb02 - _0x5276f5["height"] - 0xc));
    _0x5b517e['style']["left"] = Math["round"](_0x11fc64) + 'px';
    _0x5b517e["style"]['top'] = Math["round"](_0x2456df) + 'px';
  }
  ["_hideMaterialPreview"]() {
    this["_materialPreviewRow"] = null;
    if (this["_materialPreviewEl"]) {
      this["_materialPreviewEl"]["hidden"] = !![];
    }
  }
  ["_getVisibleAssetCardsInList"]() {
    const _0x579373 = this["sidebarPanel"]?.["querySelector"]('#asset-sidebar-content\x20>\x20.v2-asset-view-list');
    if (!_0x579373) {
      return {
        'listView': null,
        'cards': []
      };
    }
    const _0x1c12f2 = Array['from'](_0x579373["querySelectorAll"](":scope > .v2-asset-item"))["filter"](_0xdaa661 => _0xdaa661["style"]["display"] !== "none");
    return {
      'listView': _0x579373,
      'cards': _0x1c12f2
    };
  }
  ['_captureRectsById'](_0x127466) {
    const _0x485c8c = new Map();
    for (const _0xf55912 of _0x127466) {
      const _0x2b5abb = String(_0xf55912["dataset"]?.['id'] || '');
      if (!_0x2b5abb) {
        continue;
      }
      _0x485c8c['set'](_0x2b5abb, _0xf55912["getBoundingClientRect"]());
    }
    return _0x485c8c;
  }
  ['_playFlip'](_0x19cb2d, _0x17d326) {
    if (!_0x19cb2d || !_0x17d326?.["size"]) {
      return;
    }
    const _0x410e83 = Array['from'](_0x19cb2d["querySelectorAll"](":scope > .v2-asset-item"))["filter"](_0x3b3ced => _0x3b3ced["style"]["display"] !== 'none');
    const _0x3be814 = new Map();
    for (const _0x33e298 of _0x410e83) {
      const _0x55bc47 = String(_0x33e298["dataset"]?.['id'] || '');
      if (!_0x55bc47) {
        continue;
      }
      _0x3be814["set"](_0x55bc47, _0x33e298['getBoundingClientRect']());
    }
    for (const _0xaaf126 of _0x410e83) {
      const _0x3dd174 = String(_0xaaf126['dataset']?.['id'] || '');
      if (!_0x3dd174) {
        continue;
      }
      const _0x29fc70 = _0x17d326["get"](_0x3dd174);
      const _0x2746e8 = _0x3be814["get"](_0x3dd174);
      if (!_0x29fc70 || !_0x2746e8) {
        continue;
      }
      const _0x1b90a0 = _0x29fc70['left'] - _0x2746e8['left'];
      const _0x449e6f = _0x29fc70["top"] - _0x2746e8["top"];
      if (!_0x1b90a0 && !_0x449e6f) {
        continue;
      }
      _0xaaf126["animate"]([{
        'transform': "translate(" + _0x1b90a0 + "px, " + _0x449e6f + "px)"
      }, {
        'transform': "translate(0, 0)"
      }], {
        'duration': 0xdc,
        'easing': 'cubic-bezier(0.2,\x200,\x200,\x201)'
      });
    }
  }
  ["_playDeleteShake"](_0x25ef07) {
    if (!_0x25ef07) {
      return;
    }
    _0x25ef07["classList"]['remove']('is-delete-shaking');
    void _0x25ef07["offsetWidth"];
    _0x25ef07["classList"]['add']("is-delete-shaking");
    window["setTimeout"](() => {
      if (_0x25ef07['isConnected']) {
        _0x25ef07["classList"]["remove"]("is-delete-shaking");
      }
    }, 0xf0);
  }
  async ["_deleteAsset"](_0xdfd08b) {
    const _0x316efd = String(_0xdfd08b || '');
    if (!_0x316efd) {
      return;
    }
    const {
      listView: _0x57ea28,
      cards: _0x24cc41
    } = this["_getVisibleAssetCardsInList"]();
    const _0x579fe2 = this["_captureRectsById"](_0x24cc41);
    try {
      const _0x5ba7e8 = await deleteAssetFromServer(_0x316efd);
      if (_0x5ba7e8 !== !![]) {
        throw new Error(assetManagerText("deleteFailed"));
      }
    } catch (_0x1fffc9) {
      window["showToast"]?.(assetManagerText("deleteFailed"), 'error');
      return ![];
    }
    this["assets"] = (this['assets'] || [])["filter"](_0x4db027 => String(_0x4db027?.['id'] || '') !== _0x316efd);
    this['_syncTabsFromAssets']();
    this['_renderSidebarTabs']();
    removeAssetMentionAsset(_0x316efd);
    if (this["_openAssetId"] === _0x316efd) {
      this["_openAssetId"] = null;
    }
    const _0x30bc67 = this["_assetCardPool"]?.["get"]?.(_0x316efd);
    if (_0x30bc67?.["isConnected"]) {
      _0x30bc67["remove"]();
    }
    this["_assetCardPool"]?.["delete"]?.(_0x316efd);
    this["renderSidebarContent"]();
    window["requestAnimationFrame"](() => {
      window["requestAnimationFrame"](() => {
        const {
          listView: _0x2ca9c6
        } = this["_getVisibleAssetCardsInList"]();
        this["_playFlip"](_0x2ca9c6, _0x579fe2);
      });
    });
    return !![];
  }
  async ["_deleteUserCategory"](_0x4c3eca) {
    const _0x36d5b3 = this["_normalizeCategoryName"](_0x4c3eca);
    if (!_0x36d5b3 || !this["_isUserCategory"](_0x36d5b3)) {
      return ![];
    }
    const _0x19aca7 = this["_getSortedAssets"]()["filter"](_0x5583ea => this["_categoryKey"](_0x5583ea?.['category']) === this["_categoryKey"](_0x36d5b3));
    const _0x5e6c9a = [...this["userCategories"]];
    const _0x45fa29 = {
      ...this["materialCategoryParents"]
    };
    const _0x1ebe58 = this["_getMaterialParentCategory"](_0x36d5b3);
    const _0x1f7702 = this["_findCategoryByName"]("Others", this['tabs']) || "Others";
    const _0x18b0b1 = this["_normalizeUserCategories"](_0x5e6c9a["filter"](_0x1e2581 => this["_categoryKey"](_0x1e2581) !== this["_categoryKey"](_0x36d5b3)));
    const _0x1d2438 = deleteMaterialFolderParent({
      'parents': _0x45fa29,
      'category': _0x36d5b3,
      'categoryKey': _0x59d8ff => this["_categoryKey"](_0x59d8ff)
    });
    const _0x2cefbb = Date['now']();
    const _0x3ccdea = _0x19aca7["map"]((_0x16ecc4, _0x5809e) => ({
      ..._0x16ecc4,
      'category': _0x1f7702,
      'updatedAt': _0x2cefbb + _0x5809e
    }));
    const _0x5d0550 = [];
    let _0x483772 = ![];
    try {
      for (let _0x20ab0f = 0x0; _0x20ab0f < _0x3ccdea["length"]; _0x20ab0f += 0x1) {
        _0x5d0550["push"](_0x19aca7[_0x20ab0f]);
        await saveAssetToServer(_0x3ccdea[_0x20ab0f]);
      }
      _0x483772 = !![];
      await this["_saveMaterialCategorySettings"](_0x18b0b1, this["materialCategoryDisplayNames"], _0x1d2438);
      this["userCategories"] = _0x18b0b1;
      this["materialCategoryParents"] = _0x1d2438;
      _0x3ccdea["forEach"](_0xa5c582 => this["_upsertLocalAsset"](_0xa5c582));
      this['_categoryKey'](this["activeTab"]) === this['_categoryKey'](_0x36d5b3) && (this['activeTab'] = DEFAULT_ASSET_CATEGORIES[0x0], this["_openAssetId"] = null);
      this["_expandedMaterialCategories"]['delete'](this["_categoryKey"](_0x36d5b3));
      this["_categoryKey"](this["_materialCurrentFolderCategory"]) === this["_categoryKey"](_0x36d5b3) && (this["_materialCurrentFolderCategory"] = _0x1ebe58 || DEFAULT_ASSET_CATEGORIES[0x0]);
      this["_syncTabsFromAssets"]();
      this["_renderSidebarTabs"]();
      this["renderSidebarContent"]();
      window['showToast']?.(assetManagerText('categoryDeleted'), "success");
      return !![];
    } catch (_0x3f437e) {
      const _0x453944 = [];
      for (const _0x59c191 of _0x5d0550["reverse"]()) {
        try {
          await saveAssetToServer(_0x59c191);
        } catch (_0x4cde68) {
          _0x453944["push"](_0x4cde68);
        }
      }
      if (_0x483772) {
        try {
          await this["_saveMaterialCategorySettings"](_0x5e6c9a, this['materialCategoryDisplayNames'], _0x45fa29);
        } catch (_0x1326b3) {
          _0x453944["push"](_0x1326b3);
        }
      }
      _0x453944['length'] && console['error']("回滚素材文件夹删除失败", _0x453944);
      console["error"](_0x3f437e);
      window["showToast"]?.(assetManagerText("categoryDeleteFailed"), "error");
      return ![];
    }
  }
  ["_setThumbContent"](_0x57f1d9, _0x58b36c, _0x667d8b) {
    if (!_0x57f1d9) {
      return;
    }
    const _0x2eced5 = String(_0x58b36c || '');
    if (_0x2eced5 && !this["_isNonImageMediaSrc"](_0x2eced5)) {
      const _0x2a4083 = _0x57f1d9["dataset"]['thumbSrc'] || '';
      if (_0x57f1d9["dataset"]["thumbKind"] === "img" && _0x2a4083 === _0x2eced5 && _0x57f1d9["querySelector"](':scope\x20>\x20img')) {
        return;
      }
      const _0x37adf7 = document["createElement"]('img');
      _0x37adf7['alt'] = assetManagerText("thumbnailAlt");
      _0x37adf7['draggable'] = ![];
      _0x37adf7["decoding"] = "async";
      _0x37adf7["loading"] = "eager";
      _0x37adf7['className'] = "v2-asset-thumb-img";
      _0x37adf7["addEventListener"]("error", () => {
        if (_0x57f1d9["dataset"]["thumbSrc"] !== _0x2eced5) {
          return;
        }
        _0x57f1d9["dataset"]["thumbKind"] = "icon";
        _0x57f1d9["dataset"]["thumbType"] = String(_0x667d8b || "other");
        _0x57f1d9["dataset"]["thumbSrc"] = '';
        _0x57f1d9["innerHTML"] = _renderAssetIcon(_0x667d8b);
      }, {
        'once': !![]
      });
      _0x57f1d9["dataset"]["thumbKind"] = "img";
      _0x57f1d9["dataset"]["thumbType"] = '';
      _0x57f1d9['dataset']["thumbSrc"] = _0x2eced5;
      _0x57f1d9['dataset']["pendingSrc"] = '';
      _0x57f1d9["replaceChildren"](_0x37adf7);
      _0x37adf7["src"] = _0x2eced5;
      void this["_ensureThumbDecoded"](_0x2eced5)["catch"](() => {});
      return;
    }
    const _0x1429e0 = String(_0x667d8b || "other");
    if (_0x57f1d9['dataset']["thumbKind"] === "icon" && _0x57f1d9["dataset"]["thumbType"] === _0x1429e0) {
      return;
    }
    _0x57f1d9['dataset']["thumbKind"] = 'icon';
    _0x57f1d9['dataset']["thumbType"] = _0x1429e0;
    _0x57f1d9["dataset"]["thumbSrc"] = '';
    _0x57f1d9["dataset"]['pendingSrc'] = '';
    _0x57f1d9['innerHTML'] = _renderAssetIcon(_0x1429e0);
  }
  ["_createMaterialMenuButton"](_0x1482cc, _0x506cba) {
    const _0x54d5e7 = document["createElement"]("button");
    _0x54d5e7["type"] = 'button';
    _0x54d5e7["className"] = 'v2-material-more';
    _0x54d5e7["dataset"]["uiAction"] = "material-menu-open";
    _0x54d5e7["dataset"]["assetId"] = _0x506cba;
    _0x54d5e7['setAttribute']("aria-label", assetManagerText("menu.open", {
      'name': _0x1482cc["name"] || assetManagerText("unnamedAsset")
    }));
    _0x54d5e7["setAttribute"]("aria-haspopup", "menu");
    _0x54d5e7["innerHTML"] = "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"5\" cy=\"12\" r=\"1.5\" fill=\"currentColor\"/><circle cx=\"12\" cy=\"12\" r=\"1.5\" fill=\"currentColor\"/><circle cx=\"19\" cy=\"12\" r=\"1.5\" fill=\"currentColor\"/></svg>";
    return _0x54d5e7;
  }
  ["_createMaterialItemGroup"](_0x2bfd5e, _0x52ac05, _0x38e419) {
    const _0x3ca888 = document["createElement"]('div');
    _0x3ca888["className"] = "v2-material-asset-children";
    _0x3ca888["dataset"]["assetId"] = _0x52ac05;
    _0x3ca888["setAttribute"]("role", "group");
    _0x38e419["forEach"]((_0x68f4fa, _0x68560e) => {
      const _0x3b1fe2 = this["_materialItemKey"](_0x52ac05, _0x68560e);
      const _0x256150 = this["_renamingMaterialItemKey"] === _0x3b1fe2;
      const _0x5b292f = this["_savingMaterialItemKey"] === _0x3b1fe2;
      const _0x5cd3ad = document["createElement"]("div");
      _0x5cd3ad["className"] = "v2-material-item-row";
      _0x5cd3ad['classList']["toggle"]('is-renaming', _0x256150);
      _0x5cd3ad['classList']["toggle"]("is-saving", _0x5b292f);
      _0x5cd3ad["dataset"]["materialUse"] = '';
      _0x5cd3ad["dataset"]['assetId'] = _0x52ac05;
      _0x5cd3ad["dataset"]["itemIndex"] = String(_0x68560e);
      _0x5cd3ad["dataset"]['materialDrag'] = '';
      _0x5cd3ad['dataset']["materialPreview"] = '';
      _0x5cd3ad["draggable"] = !_0x256150;
      _0x5cd3ad["setAttribute"]("role", "treeitem");
      const _0x38a700 = _0x68f4fa?.["name"] || _0x68f4fa?.["nodeData"]?.['name'] || assetManagerText("detail.childAssetName", {
        'index': _0x68560e + 0x1
      });
      _0x5cd3ad["setAttribute"]("aria-label", assetManagerText("doubleClickMaterial", {
        'name': _0x38a700
      }));
      const _0x26e98f = document['createElement']("span");
      _0x26e98f['className'] = "v2-material-row-thumb is-child";
      this["_setThumbContent"](_0x26e98f, _resolveMaterialItemThumbSrc(_0x68f4fa), _0x68f4fa?.["type"] || "other");
      _0x5cd3ad["appendChild"](_0x26e98f);
      if (_0x256150) {
        const _0x2dda55 = document["createElement"]('input');
        _0x2dda55["type"] = "text";
        _0x2dda55["className"] = "v2-material-item-name-input";
        _0x2dda55["dataset"]["assetId"] = _0x52ac05;
        _0x2dda55["dataset"]["itemIndex"] = String(_0x68560e);
        _0x2dda55["dataset"]["itemKey"] = _0x3b1fe2;
        _0x2dda55['value'] = _0x38a700;
        _0x2dda55['disabled'] = _0x5b292f;
        _0x2dda55['setAttribute']("aria-label", assetManagerText("renameMaterialAria", {
          'name': _0x38a700
        }));
        if (_0x5b292f) {
          _0x2dda55["setAttribute"]('aria-busy', "true");
        }
        _0x5cd3ad["appendChild"](_0x2dda55);
      } else {
        const _0x7585c4 = document["createElement"]("button");
        _0x7585c4['type'] = 'button';
        _0x7585c4['className'] = "v2-material-item-name is-renameable";
        _0x7585c4['dataset']["uiAction"] = 'material-item-rename';
        _0x7585c4["dataset"]["assetId"] = _0x52ac05;
        _0x7585c4["dataset"]['itemIndex'] = String(_0x68560e);
        _0x7585c4["textContent"] = _0x38a700;
        _0x7585c4["setAttribute"]("aria-label", assetManagerText("renameMaterialAria", {
          'name': _0x38a700
        }));
        _0x5cd3ad['appendChild'](_0x7585c4);
      }
      _0x3ca888["appendChild"](_0x5cd3ad);
    });
    return _0x3ca888;
  }
  ['_toggleMaterialFolderDisclosure'](_0x49298b) {
    if (this["_materialSearchQuery"] || this["_materialFavoritesOnly"]) {
      return;
    }
    const _0x454d27 = this["_categoryKey"](_0x49298b?.['dataset']?.["category"]);
    const _0x242a94 = _0x49298b?.['closest']?.('.v2-material-folder');
    const _0x3c9ca4 = _0x242a94?.["querySelector"]?.(":scope > .v2-material-folder-content");
    if (!_0x454d27 || !_0x242a94 || !_0x3c9ca4) {
      return;
    }
    this["_materialCurrentFolderCategory"] = this["_findCategoryByName"](_0x49298b?.["dataset"]?.["category"], this['tabs']) || this["activeTab"];
    const _0x19c74b = _0x242a94["getAttribute"]("aria-expanded") !== "true";
    _0x19c74b ? this["_expandedMaterialCategories"]["add"](_0x454d27) : (this["_expandedMaterialCategories"]["delete"](_0x454d27), this['_hideMaterialPreview'](), this["_closeMaterialMenu"]());
    _0x242a94["setAttribute"]("aria-expanded", _0x19c74b ? "true" : "false");
    _0x49298b["setAttribute"]("aria-expanded", _0x19c74b ? "true" : 'false');
    _0x49298b["setAttribute"]('aria-label', assetManagerText(_0x19c74b ? 'collapseFolder' : "expandFolder", {
      'name': this["_formatCategoryLabel"](_0x49298b?.["dataset"]?.["category"])
    }));
    _0x49298b["querySelector"](".v2-material-tree-chevron")?.['classList']['toggle']("is-open", _0x19c74b);
    _0x3c9ca4["hidden"] = !_0x19c74b;
  }
  ["_cancelPendingMaterialAssetRowToggle"]() {
    this['_materialAssetRowClickTimer'] && window["clearTimeout"](this["_materialAssetRowClickTimer"]);
    this['_materialAssetRowClickTimer'] = 0x0;
    this["_materialAssetRowClickToggle"] = null;
  }
  ["_scheduleMaterialAssetRowToggle"](_0x54ea8e) {
    this["_cancelPendingMaterialAssetRowToggle"]();
    if (!_0x54ea8e || _0x54ea8e['disabled']) {
      return;
    }
    this["_materialAssetRowClickToggle"] = _0x54ea8e;
    this["_materialAssetRowClickTimer"] = window["setTimeout"](() => {
      const _0x3568f5 = this["_materialAssetRowClickToggle"];
      this["_materialAssetRowClickTimer"] = 0x0;
      this['_materialAssetRowClickToggle'] = null;
      _0x3568f5?.["isConnected"] && !_0x3568f5["disabled"] && this["_toggleMaterialAssetDisclosure"](_0x3568f5);
    }, 0x104);
  }
  ["_toggleMaterialAssetDisclosure"](_0x3d1fd2) {
    if (this["_materialSearchQuery"] || this['_materialFavoritesOnly']) {
      return;
    }
    const _0x523f38 = String(_0x3d1fd2?.["dataset"]?.["assetId"] || '');
    const _0x34e083 = this["_getMaterialAsset"](_0x523f38);
    const _0x1963c6 = getMaterialAssetItems(_0x34e083);
    if (!_0x523f38 || !_0x34e083 || _0x1963c6["length"] < 0x1) {
      return;
    }
    const _0x22b5ea = _0x3d1fd2["closest"](".v2-material-project-folder");
    const _0xa3f190 = _0x3d1fd2['closest'](".v2-material-project-row, .v2-material-asset-row");
    const _0x352aed = _0x22b5ea || _0xa3f190;
    if (!_0xa3f190 || !_0x352aed) {
      return;
    }
    const _0x124a07 = _0x352aed['getAttribute']("aria-expanded") !== 'true';
    _0x124a07 ? this["_expandedMaterialAssets"]["add"](_0x523f38) : (this["_expandedMaterialAssets"]['delete'](_0x523f38), this["_hideMaterialPreview"](), this['_closeMaterialMenu']());
    _0x352aed['setAttribute']('aria-expanded', _0x124a07 ? 'true' : 'false');
    _0x3d1fd2["setAttribute"]("aria-expanded", _0x124a07 ? "true" : "false");
    _0x3d1fd2["setAttribute"]("aria-label", assetManagerText(_0x124a07 ? "collapseMaterial" : "expandMaterial", {
      'name': _0x34e083['name'] || assetManagerText('unnamedAsset')
    }));
    _0x3d1fd2["querySelector"]('.v2-material-tree-chevron,\x20svg')?.["classList"]["toggle"]('is-open', _0x124a07);
    let _0xc54fb1 = _0x22b5ea ? _0x22b5ea["querySelector"](':scope\x20>\x20.v2-material-asset-children[data-asset-id=\x22' + CSS["escape"](_0x523f38) + '\x22]') : _0xa3f190["nextElementSibling"]?.["matches"]?.(".v2-material-asset-children[data-asset-id=\"" + CSS['escape'](_0x523f38) + '\x22]') ? _0xa3f190["nextElementSibling"] : null;
    _0x124a07 && !_0xc54fb1 && (_0xc54fb1 = this["_createMaterialItemGroup"](_0x34e083, _0x523f38, _0x1963c6), _0x22b5ea ? _0x22b5ea["appendChild"](_0xc54fb1) : _0xa3f190["insertAdjacentElement"]('afterend', _0xc54fb1));
    if (_0xc54fb1) {
      _0xc54fb1["hidden"] = !_0x124a07;
    }
  }
  ["_renderReplacementStudioProjectFolder"](_0x134871, _0x42d3a6, {
    forceExpanded = ![]
  } = {}) {
    const _0x594235 = String(_0x134871?.['id'] || '');
    if (!_0x594235) {
      return;
    }
    const _0x1289b1 = getMaterialAssetItems(_0x134871);
    const _0x7ad376 = forceExpanded || this['_expandedMaterialAssets']['has'](_0x594235);
    const _0x385f1b = document["createElement"]('div');
    _0x385f1b["className"] = 'v2-material-project-folder';
    _0x385f1b["dataset"]["assetId"] = _0x594235;
    _0x385f1b["setAttribute"]("role", 'treeitem');
    _0x385f1b['setAttribute']("aria-expanded", _0x7ad376 ? "true" : "false");
    this["_newAssetPulseId"] === _0x594235 && _0x385f1b["classList"]["add"]("is-new");
    const _0x3e0215 = document['createElement']("div");
    _0x3e0215["className"] = "v2-material-project-row";
    const _0x556ff6 = document["createElement"]('button');
    _0x556ff6["type"] = "button";
    _0x556ff6["className"] = "v2-material-project-toggle";
    _0x556ff6["dataset"]["uiAction"] = "material-asset-toggle";
    _0x556ff6["dataset"]['assetId'] = _0x594235;
    _0x556ff6["setAttribute"]("aria-expanded", _0x7ad376 ? "true" : "false");
    _0x556ff6["setAttribute"]("aria-label", assetManagerText(_0x7ad376 ? 'collapseMaterial' : "expandMaterial", {
      'name': _0x134871["name"] || assetManagerText("unnamedAsset")
    }));
    const _0x4993ac = document["createElement"]("span");
    _0x4993ac["className"] = 'v2-material-tree-chevron' + (_0x7ad376 ? " is-open" : '');
    _0x4993ac["setAttribute"]('aria-hidden', "true");
    _0x4993ac["innerHTML"] = MATERIAL_TREE_CHEVRON_ICON_SVG;
    const _0x1c0811 = document['createElement']("span");
    _0x1c0811["className"] = "v2-material-project-icon";
    _0x1c0811["setAttribute"]("aria-hidden", "true");
    _0x1c0811['innerHTML'] = MATERIAL_FOLDER_ICON_MARKUP;
    _0x556ff6["append"](_0x4993ac, _0x1c0811);
    _0x3e0215["appendChild"](_0x556ff6);
    if (this["_renamingAssetId"] === _0x594235) {
      _0x3e0215["classList"]["add"]("is-renaming");
      const _0x3ea166 = document['createElement']("input");
      _0x3ea166["type"] = "text";
      _0x3ea166['className'] = "v2-material-name-input";
      _0x3ea166["dataset"]['assetId'] = _0x594235;
      _0x3ea166["value"] = String(_0x134871["name"] || '');
      _0x3ea166['setAttribute']("aria-label", assetManagerText("createPanel.assetName"));
      _0x3e0215["appendChild"](_0x3ea166);
    } else {
      const _0x16823f = document["createElement"]('button');
      _0x16823f['type'] = "button";
      _0x16823f["className"] = "v2-material-project-name is-renameable";
      _0x16823f["dataset"]["uiAction"] = "material-rename";
      _0x16823f["dataset"]['assetId'] = _0x594235;
      _0x16823f["textContent"] = _0x134871["name"] || assetManagerText("unnamedAsset");
      _0x16823f["setAttribute"]("aria-label", assetManagerText("renameMaterialAria", {
        'name': _0x134871["name"] || assetManagerText('unnamedAsset')
      }));
      if (isMaterialAssetFavorite(_0x134871)) {
        const _0x36ef2c = document["createElement"]("span");
        _0x36ef2c["className"] = "v2-material-favorite-indicator";
        _0x36ef2c["textContent"] = '★';
        _0x36ef2c["setAttribute"]("aria-label", assetManagerText("favorites"));
        _0x16823f['appendChild'](_0x36ef2c);
      }
      _0x3e0215["appendChild"](_0x16823f);
    }
    const _0x399319 = document["createElement"]("span");
    _0x399319["className"] = "v2-material-project-count";
    _0x399319["textContent"] = String(_0x1289b1["length"]);
    _0x3e0215['append'](_0x399319, this['_createMaterialMenuButton'](_0x134871, _0x594235));
    _0x385f1b["appendChild"](_0x3e0215);
    _0x7ad376 && _0x385f1b["appendChild"](this['_createMaterialItemGroup'](_0x134871, _0x594235, _0x1289b1));
    _0x42d3a6['appendChild'](_0x385f1b);
  }
  ["renderSidebarContent"]() {
    this['_materialContextMenuController']["close"]();
    const _0x29c588 = this["sidebarPanel"]?.["querySelector"]('#asset-sidebar-content');
    const _0x9d01e3 = _0x29c588?.["querySelector"]('.v2-material-library-tree');
    if (!_0x29c588 || !_0x9d01e3) {
      return;
    }
    const _0x55265a = _0x29c588["scrollTop"];
    const _0x2f0bc7 = this["sidebarPanel"]["querySelector"]('[data-material-search]');
    _0x2f0bc7 && _0x2f0bc7["value"] !== this['_materialSearchQuery'] && (_0x2f0bc7["value"] = this["_materialSearchQuery"]);
    const _0x22110f = this["sidebarPanel"]["querySelector"]("[data-ui-action='material-favorites-toggle']");
    _0x22110f?.["classList"]['toggle']("is-active", this["_materialFavoritesOnly"]);
    _0x22110f?.['setAttribute']("aria-pressed", this["_materialFavoritesOnly"] ? "true" : "false");
    const _0x5e02e9 = this["_getSortedAssets"]();
    const _0x596316 = getMaterialLibraryGroups({
      'assets': _0x5e02e9,
      'categories': this["tabs"],
      'query': this["_materialSearchQuery"],
      'favoritesOnly': this['_materialFavoritesOnly'],
      'categoryKey': _0x203b4b => this["_categoryKey"](_0x203b4b)
    });
    const _0x193a3b = getMaterialFolderAssetCounts({
      'groups': _0x596316,
      'parents': this["materialCategoryParents"],
      'categoryKey': _0x5e07d1 => this['_categoryKey'](_0x5e07d1)
    });
    const _0x41f4b2 = this["_materialMenuState"]?.["anchorEl"];
    _0x41f4b2 && _0x9d01e3["contains"](_0x41f4b2) && this['_closeMaterialMenu']();
    this["_materialPreviewRow"] && _0x9d01e3["contains"](this['_materialPreviewRow']) && this["_hideMaterialPreview"]();
    _0x9d01e3["replaceChildren"]();
    if (!_0x596316['length']) {
      const _0xbcc211 = document["createElement"]('div');
      _0xbcc211["className"] = 'v2-material-library-empty';
      _0xbcc211["innerHTML"] = "<strong>" + _escapeHtml(this["_materialFavoritesOnly"] ? assetManagerText("emptyFavorites") : this["_materialSearchQuery"] ? assetManagerText('emptySearch') : assetManagerText('emptyLibrary')) + "</strong>";
      _0x9d01e3["appendChild"](_0xbcc211);
      _0x29c588['scrollTop'] = 0x0;
      return;
    }
    for (const _0x5bc797 of _0x596316) {
      const _0x1faeab = this["_categoryKey"](_0x5bc797["category"]);
      const _0x5d87da = this["_isUserCategory"](_0x5bc797["category"]);
      const _0x4289ab = _0x5d87da && this["_renamingMaterialCategoryKey"] === _0x1faeab;
      const _0x9c2dae = _0x4289ab && this["_savingMaterialCategoryKey"] === _0x1faeab;
      const _0x555bf5 = _0x5d87da && (this['_pendingMaterialFolderDeleteKey'] === _0x1faeab || this["_deletingMaterialFolderKey"] === _0x1faeab);
      const _0x457d68 = _0x5d87da && this["_deletingMaterialFolderKey"] === _0x1faeab;
      const _0x4bbff7 = Boolean(this["_materialSearchQuery"] || this["_materialFavoritesOnly"]);
      const _0x37790d = !_0x4bbff7 && !this["_expandedMaterialCategories"]['has'](_0x1faeab);
      const {
        section: _0x21fc0e,
        folderContent: _0x53bc7b
      } = this['_createMaterialFolderSection']({
        'category': _0x5bc797["category"],
        'count': _0x193a3b["get"](this["_categoryKey"](_0x5bc797["category"])) ?? _0x5bc797["assets"]["length"],
        'expanded': !_0x37790d,
        'canManageFolder': _0x5d87da,
        'isRenamingFolder': _0x4289ab,
        'isSavingFolder': _0x9c2dae,
        'isDeleteConfirming': _0x555bf5,
        'isDeletingFolder': _0x457d68,
        'isDeleteRequested': this["_pendingMaterialFolderDeleteKey"] === _0x1faeab,
        'actionPrefix': "material-folder"
      });
      if (!_0x5bc797["assets"]["length"]) {
        const _0x4ba2f3 = document["createElement"]("div");
        _0x4ba2f3['className'] = "v2-material-folder-empty";
        _0x4ba2f3["textContent"] = assetManagerText("emptyFolder");
        _0x53bc7b["appendChild"](_0x4ba2f3);
      }
      for (const _0x47d094 of _0x5bc797["assets"]) {
        if (this['_categoryKey'](_0x5bc797["category"]) === this["_categoryKey"](REPLACEMENT_STUDIO_CATEGORY)) {
          this["_renderReplacementStudioProjectFolder"](_0x47d094, _0x53bc7b, {
            'forceExpanded': _0x4bbff7
          });
          continue;
        }
        const _0x3b670a = String(_0x47d094?.['id'] || '');
        if (!_0x3b670a) {
          continue;
        }
        const _0x2e085e = getMaterialAssetItems(_0x47d094);
        const _0x1ba842 = _0x2e085e["length"] > 0x1;
        const _0x47c475 = _0x1ba842 && this["_expandedMaterialAssets"]["has"](_0x3b670a);
        const _0x5ec5e3 = document['createElement']("div");
        _0x5ec5e3["className"] = "v2-material-asset-row";
        _0x5ec5e3['dataset']['assetId'] = _0x3b670a;
        _0x5ec5e3["dataset"]["materialPreview"] = '';
        _0x5ec5e3['setAttribute']("role", "treeitem");
        _0x1ba842 && _0x5ec5e3["setAttribute"]("aria-expanded", _0x47c475 ? "true" : "false");
        this["_newAssetPulseId"] === _0x3b670a && _0x5ec5e3["classList"]["add"]("is-new");
        const _0x46799b = document["createElement"]('button');
        _0x46799b["type"] = 'button';
        _0x46799b['className'] = "v2-material-asset-toggle";
        _0x46799b["dataset"]["uiAction"] = "material-asset-toggle";
        _0x46799b["dataset"]["assetId"] = _0x3b670a;
        _0x46799b["disabled"] = !_0x1ba842;
        _0x1ba842 && _0x46799b['setAttribute']('aria-expanded', _0x47c475 ? "true" : "false");
        _0x46799b["setAttribute"]("aria-label", _0x1ba842 ? assetManagerText(_0x47c475 ? "collapseMaterial" : "expandMaterial", {
          'name': _0x47d094['name'] || assetManagerText('unnamedAsset')
        }) : '');
        _0x46799b["innerHTML"] = _0x1ba842 ? "<svg class=\"" + (_0x47c475 ? 'is-open' : '') + '\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20aria-hidden=\x22true\x22><path\x20d=\x22m9\x206\x206\x206-6\x206\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x221.8\x22\x20stroke-linecap=\x22round\x22\x20stroke-linejoin=\x22round\x22/></svg>' : '';
        _0x5ec5e3['appendChild'](_0x46799b);
        const _0x14a1ce = document["createElement"]("div");
        _0x14a1ce['className'] = "v2-material-asset-use";
        _0x14a1ce["dataset"]['materialUse'] = '';
        _0x14a1ce["dataset"]["assetId"] = _0x3b670a;
        _0x14a1ce["dataset"]["materialDrag"] = '';
        _0x14a1ce["draggable"] = this['_renamingAssetId'] !== _0x3b670a;
        _0x14a1ce["setAttribute"]("aria-label", assetManagerText("doubleClickMaterial", {
          'name': _0x47d094['name'] || assetManagerText("unnamedAsset")
        }));
        const _0x16aeea = document["createElement"]('span');
        _0x16aeea["className"] = "v2-material-row-thumb";
        const _0x2ae341 = _0x2e085e[0x0];
        const _0x1394c4 = _resolveMaterialItemThumbSrc(_0x2ae341) || _0x47d094["coverUrl"];
        this["_setThumbContent"](_0x16aeea, _0x1394c4, _0x2ae341?.["type"] || _0x47d094["coverType"] || "other");
        _0x14a1ce['appendChild'](_0x16aeea);
        if (this["_renamingAssetId"] === _0x3b670a) {
          _0x5ec5e3["classList"]["add"]("is-renaming");
          const _0xe5c296 = document["createElement"]("input");
          _0xe5c296["type"] = "text";
          _0xe5c296["className"] = "v2-material-name-input";
          _0xe5c296["dataset"]["assetId"] = _0x3b670a;
          _0xe5c296["value"] = String(_0x47d094['name'] || '');
          _0xe5c296["setAttribute"]('aria-label', assetManagerText("createPanel.assetName"));
          _0x14a1ce['appendChild'](_0xe5c296);
          _0x5ec5e3["appendChild"](_0x14a1ce);
        } else {
          const _0x2ab7f1 = document['createElement']('button');
          _0x2ab7f1["type"] = "button";
          _0x2ab7f1["className"] = "v2-material-asset-name is-renameable";
          _0x2ab7f1["dataset"]['uiAction'] = "material-rename";
          _0x2ab7f1["dataset"]["assetId"] = _0x3b670a;
          _0x2ab7f1["textContent"] = _0x47d094["name"] || assetManagerText("unnamedAsset");
          _0x2ab7f1["setAttribute"]("aria-label", assetManagerText("renameMaterialAria", {
            'name': _0x47d094["name"] || assetManagerText('unnamedAsset')
          }));
          _0x14a1ce["appendChild"](_0x2ab7f1);
          if (isMaterialAssetFavorite(_0x47d094)) {
            const _0x1f4684 = document['createElement']("span");
            _0x1f4684['className'] = 'v2-material-favorite-indicator';
            _0x1f4684["textContent"] = '★';
            _0x1f4684["setAttribute"]("aria-label", assetManagerText("favorites"));
            _0x14a1ce["appendChild"](_0x1f4684);
          }
          _0x5ec5e3['appendChild'](_0x14a1ce);
        }
        const _0x57d8a5 = this["_createMaterialMenuButton"](_0x47d094, _0x3b670a);
        _0x5ec5e3["appendChild"](_0x57d8a5);
        _0x53bc7b['appendChild'](_0x5ec5e3);
        _0x47c475 && _0x53bc7b["appendChild"](this["_createMaterialItemGroup"](_0x47d094, _0x3b670a, _0x2e085e));
      }
      _0x9d01e3['appendChild'](_0x21fc0e);
    }
    this["_nestMaterialFolderSections"](_0x9d01e3);
    _0x29c588['scrollTop'] = _0x55265a;
    if (this['_newAssetPulseId']) {
      const _0x9ce204 = this["_newAssetPulseId"];
      this["_newAssetPulseId"] = '';
      window["setTimeout"](() => {
        _0x9d01e3["querySelector"]("[data-asset-id=\"" + CSS['escape'](_0x9ce204) + '\x22]')?.["classList"]["remove"]('is-new');
      }, 0x28a);
    }
    if (this["_renamingAssetId"]) {
      window["requestAnimationFrame"](() => {
        const _0x1178da = _0x9d01e3['querySelector'](".v2-material-name-input");
        _0x1178da?.["focus"]();
        _0x1178da?.["select"]?.();
      });
    } else {
      this["_renamingMaterialItemKey"] && window["requestAnimationFrame"](() => {
        const _0x45e770 = _0x9d01e3["querySelector"](".v2-material-item-name-input[data-item-key=\"" + CSS['escape'](this["_renamingMaterialItemKey"]) + '\x22]');
        _0x45e770?.['focus']();
        _0x45e770?.["select"]?.();
      });
    }
  }
  ["_renderLegacySidebarContent"]() {
    const _0x1ae652 = this["sidebarPanel"]?.["querySelector"]("#asset-sidebar-content");
    if (!_0x1ae652) {
      return;
    }
    const _0x2fcf30 = this["sidebarPanel"]["querySelector"]("#asset-sidebar-title-text");
    const _0x3688ff = this["sidebarPanel"]["querySelector"]('.v2-asset-back');
    this["_renderSidebarTabs"]();
    const _0x4ced1f = () => {
      let _0x1d8535 = _0x1ae652["querySelector"](":scope > .v2-asset-view-list");
      !_0x1d8535 && (_0x1d8535 = document["createElement"]("div"), _0x1d8535["className"] = "v2-asset-view-list", _0x1ae652["appendChild"](_0x1d8535));
      let _0x3dac8c = _0x1ae652["querySelector"](":scope > .v2-asset-view-detail");
      !_0x3dac8c && (_0x3dac8c = document["createElement"]("div"), _0x3dac8c["className"] = 'v2-asset-view-detail', _0x1ae652["appendChild"](_0x3dac8c));
      _0x1ae652['querySelectorAll'](":scope > .v2-asset-item, :scope > .v2-asset-empty")["forEach"](_0x22abd4 => _0x1d8535["appendChild"](_0x22abd4));
      _0x1ae652["querySelectorAll"](":scope > .v2-asset-detail-actions, :scope > .v2-asset-subgrid")["forEach"](_0x1bb3a6 => _0x3dac8c["appendChild"](_0x1bb3a6));
      return {
        'listView': _0x1d8535,
        'detailView': _0x3dac8c
      };
    };
    const {
      listView: _0x595abf,
      detailView: _0x4f4124
    } = _0x4ced1f();
    const _0x1d2561 = (_0x176c4f, _0x37781, _0x1be9be) => this["_setThumbContent"](_0x176c4f, _0x37781, _0x1be9be);
    const _0x1a9cbc = _0xb13d0c => {
      let _0xdae5ab = _0xb13d0c["querySelector"](':scope\x20>\x20.v2-asset-cover-grid');
      if (!_0xdae5ab) {
        _0xdae5ab = document["createElement"]("div");
        _0xdae5ab["className"] = "v2-asset-cover-grid";
        for (let _0x3f44ac = 0x0; _0x3f44ac < 0x4; _0x3f44ac++) {
          const _0x224a0a = document["createElement"]("div");
          _0x224a0a["className"] = 'v2-asset-cover-cell';
          _0xdae5ab["appendChild"](_0x224a0a);
        }
        _0xb13d0c['replaceChildren'](_0xdae5ab);
      } else {
        const _0x2310a3 = _0xdae5ab["querySelectorAll"](":scope > .v2-asset-cover-cell");
        for (let _0x1bc4bd = _0x2310a3['length']; _0x1bc4bd < 0x4; _0x1bc4bd++) {
          const _0x1e1ae4 = document["createElement"]("div");
          _0x1e1ae4["className"] = "v2-asset-cover-cell";
          _0xdae5ab['appendChild'](_0x1e1ae4);
        }
      }
      return _0xdae5ab;
    };
    const _0x567093 = (_0x4c0877, _0x373301) => {
      let _0x4b946f = _0x4c0877['querySelector'](":scope > .v2-asset-item-load");
      let _0x27d6cf = _0x4c0877["querySelector"](":scope > .v2-asset-item-delete");
      let _0x2f644e = _0x4c0877["querySelector"](":scope > .v2-asset-item-delete-confirm");
      let _0x1d9f62 = _0x4c0877['querySelector'](':scope\x20>\x20.v2-asset-item-cover');
      let _0x7aa6fb = _0x4c0877['querySelector'](":scope > .v2-asset-item-name");
      !_0x4b946f && (_0x4b946f = document["createElement"]("button"), _0x4b946f["type"] = "button", _0x4b946f["className"] = "v2-asset-item-load", _0x4b946f["dataset"]["uiAction"] = 'asset-add-all', _0x4b946f["setAttribute"]('aria-label', assetManagerText("loadToCanvas")), _0x4b946f["innerHTML"] = '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20aria-hidden=\x22true\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20stroke-linecap=\x22round\x22\x20stroke-linejoin=\x22round\x22><path\x20d=\x22M16.5\x205.5a7.5\x207.5\x200\x201\x200-1\x2013.5\x22/><path\x20d=\x22M12\x2014h6v6\x22/><path\x20d=\x22m18\x2014-6\x206\x22/></svg>', _0x4c0877["appendChild"](_0x4b946f));
      !_0x27d6cf && (_0x27d6cf = document["createElement"]("button"), _0x27d6cf["type"] = 'button', _0x27d6cf['className'] = 'v2-asset-item-delete', _0x27d6cf["dataset"]['uiAction'] = "asset-delete-open", _0x27d6cf["setAttribute"]('aria-label', assetManagerText("deleteAsset")), _0x27d6cf['innerHTML'] = "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M9 3h6l1 2h5v2H3V5h5l1-2zm1 6h2v10h-2V9zm4 0h2v10h-2V9zM7 9h2v10H7V9z\"/></svg>", _0x4c0877["appendChild"](_0x27d6cf));
      if (!_0x2f644e) {
        _0x2f644e = document['createElement']("div");
        _0x2f644e['className'] = "v2-asset-item-delete-confirm";
        _0x2f644e["hidden"] = !![];
        _0x2f644e["addEventListener"]('click', _0x3a4612 => {
          if (_0x3a4612["target"] !== _0x2f644e) {
            return;
          }
          _0x3a4612["stopPropagation"]();
          this["_pendingDeleteAssetId"] = '';
          this["renderSidebarContent"]();
        });
        const _0xe29f4b = document["createElement"]("button");
        _0xe29f4b['type'] = "button";
        _0xe29f4b["className"] = 'v2-asset-item-delete-confirm-btn\x20v2-asset-item-delete-confirm-btn--danger';
        _0xe29f4b["dataset"]['uiAction'] = 'asset-delete-confirm';
        _0xe29f4b['textContent'] = '✔';
        _0xe29f4b["setAttribute"]("aria-label", assetManagerText('confirm'));
        const _0x32d4c8 = document["createElement"]("button");
        _0x32d4c8["type"] = "button";
        _0x32d4c8["className"] = "v2-asset-item-delete-confirm-btn v2-asset-item-delete-confirm-btn--neutral";
        _0x32d4c8['dataset']["uiAction"] = "asset-delete-cancel";
        _0x32d4c8['textContent'] = '×';
        _0x32d4c8["setAttribute"]('aria-label', assetManagerText("cancel"));
        _0x2f644e["appendChild"](_0xe29f4b);
        _0x2f644e["appendChild"](_0x32d4c8);
        _0x4c0877["appendChild"](_0x2f644e);
      }
      const _0x23d473 = String(_0x373301?.['id'] || '');
      _0x4b946f["dataset"]['assetId'] = _0x23d473;
      _0x4b946f["disabled"] = !Array["isArray"](_0x373301?.["nodes"]) || _0x373301["nodes"]["length"] === 0x0;
      _0x27d6cf["dataset"]["assetId"] = _0x23d473;
      _0x2f644e["querySelectorAll"](":scope > button")["forEach"](_0x5d2edc => {
        _0x5d2edc["dataset"]["assetId"] = _0x23d473;
      });
      const _0x1f8d26 = this["_pendingDeleteAssetId"] === _0x23d473;
      _0x27d6cf['hidden'] = _0x1f8d26;
      _0x2f644e["hidden"] = !_0x1f8d26;
      !_0x1d9f62 && (_0x1d9f62 = document['createElement']('div'), _0x1d9f62["className"] = "v2-asset-item-cover", _0x4c0877["appendChild"](_0x1d9f62));
      !_0x7aa6fb && (_0x7aa6fb = document['createElement']("div"), _0x7aa6fb["className"] = "v2-asset-item-name", _0x7aa6fb["addEventListener"]("click", _0x2113da => {
        _0x2113da["stopPropagation"]();
        const _0x20dbca = _0x2113da["currentTarget"]?.["closest"]?.(".v2-asset-item");
        const _0x1e8e3c = _0x20dbca?.["dataset"]?.['id'] || '';
        this["_beginRenameAsset"](_0x1e8e3c);
      }), _0x4c0877["appendChild"](_0x7aa6fb));
      const _0x1b8881 = String(_0x373301?.["name"] || '');
      if (this["_renamingAssetId"] === _0x23d473) {
        _0x7aa6fb["classList"]["add"]('is-editing');
        let _0x4f252d = _0x7aa6fb['querySelector'](":scope > input.v2-asset-item-name-input");
        !_0x4f252d && (_0x4f252d = document["createElement"]("input"), _0x4f252d["type"] = "text", _0x4f252d['className'] = "v2-asset-item-name-input", _0x4f252d['addEventListener']("click", _0x325a26 => _0x325a26["stopPropagation"]()), _0x4f252d["addEventListener"]('keydown', _0x26e473 => {
          if (_0x26e473['key'] === "Enter") {
            _0x26e473["preventDefault"]();
            _0x26e473["stopPropagation"]();
            _0x4f252d["dataset"]['submitted'] = '1';
            this["_commitRenameAsset"](_0x23d473, _0x4f252d["value"]);
            return;
          }
          _0x26e473['key'] === "Escape" && (_0x26e473["preventDefault"](), _0x26e473["stopPropagation"](), this["_cancelRenameAsset"]());
        }), _0x4f252d["addEventListener"]("blur", () => {
          if (_0x4f252d["dataset"]["submitted"] === '1') {
            return;
          }
          this["_commitRenameAsset"](_0x23d473, _0x4f252d["value"]);
        }), _0x7aa6fb['replaceChildren'](_0x4f252d));
        if (_0x4f252d["value"] !== _0x1b8881) {
          _0x4f252d["value"] = _0x1b8881;
        }
        if (_0x4f252d['getAttribute']("aria-label") !== assetManagerText("createPanel.assetName")) {
          _0x4f252d["setAttribute"]("aria-label", assetManagerText("createPanel.assetName"));
        }
        window["requestAnimationFrame"](() => {
          if (!_0x4f252d["isConnected"]) {
            return;
          }
          try {
            _0x4f252d["focus"]();
            _0x4f252d["select"]?.();
          } catch (_0x1e4a66) {}
        });
      } else {
        if (_0x7aa6fb['classList']["contains"]("is-editing")) {
          _0x7aa6fb["classList"]["remove"]("is-editing");
        }
        const _0x566cb4 = _0x7aa6fb['querySelector'](":scope > input.v2-asset-item-name-input");
        if (_0x566cb4) {
          _0x7aa6fb['replaceChildren']();
        }
        if (_0x7aa6fb['textContent'] !== _0x1b8881) {
          _0x7aa6fb["textContent"] = _0x1b8881;
        }
        if (_0x7aa6fb['getAttribute']("title") !== _0x1b8881) {
          _0x7aa6fb['setAttribute']("title", _0x1b8881);
        }
      }
      const _0x893c16 = Array["isArray"](_0x373301?.['items']) ? _0x373301["items"] : Array["isArray"](_0x373301?.["nodes"]) ? _0x373301['nodes']["map"](_0x39f3e8 => _buildAssetItem(_0x39f3e8)) : [];
      if (_0x893c16["length"] > 0x0) {
        const _0x470e77 = _0x1a9cbc(_0x1d9f62);
        const _0x2155d1 = _0x470e77['querySelectorAll'](":scope > .v2-asset-cover-cell");
        for (let _0x38e8d0 = 0x0; _0x38e8d0 < 0x4; _0x38e8d0++) {
          const _0x4c8261 = _0x893c16[_0x38e8d0];
          if (!_0x4c8261) {
            const _0x4ebcbd = _0x2155d1[_0x38e8d0];
            _0x4ebcbd && (_0x4ebcbd["dataset"]["thumbKind"] = "empty", _0x4ebcbd["dataset"]['thumbType'] = '', _0x4ebcbd['dataset']["thumbSrc"] = '', _0x4ebcbd["dataset"]['pendingSrc'] = '', _0x4ebcbd["replaceChildren"]());
            continue;
          }
          _0x1d2561(_0x2155d1[_0x38e8d0], _0x4c8261["thumbSrc"], _0x4c8261["type"]);
        }
        return;
      }
      _0x373301?.["coverUrl"] ? _0x1d2561(_0x1d9f62, _0x373301["coverUrl"], _0x373301['coverType']) : _0x1d2561(_0x1d9f62, '', _0x373301?.["coverType"] || "other");
    };
    const _0x3562ab = this["_getSortedAssets"]()["filter"](_0x501605 => this["_categoryKey"](_0x501605?.["category"]) === this["_categoryKey"](this["activeTab"]));
    if (this["_openAssetId"]) {
      const _0x5173c1 = _0x3562ab["find"](_0x5603a3 => _0x5603a3['id'] === this['_openAssetId']);
      if (!_0x5173c1) {
        this['_openAssetId'] = null;
        this["renderSidebarContent"]();
        return;
      }
      if (_0x2fcf30) {
        _0x2fcf30["textContent"] = _0x5173c1["name"] || assetManagerText("title");
      }
      if (_0x3688ff) {
        _0x3688ff["classList"]["add"]("show");
      }
      this["sidebarPanel"]["classList"]["add"]("is-detail-view");
      _0x595abf["style"]["display"] = "none";
      _0x4f4124["style"]["display"] = '';
      const _0x13611e = Array['isArray'](_0x5173c1?.["items"]) ? _0x5173c1["items"] : Array["isArray"](_0x5173c1?.['nodes']) ? _0x5173c1["nodes"]["map"](_0x15f99f => _buildAssetItem(_0x15f99f)) : [];
      _0x4f4124['replaceChildren']();
      const _0x4b99bd = document["createElement"]('div');
      _0x4b99bd["className"] = "v2-asset-detail";
      const _0x5de356 = document["createElement"]('div');
      _0x5de356["className"] = "v2-asset-detail-cover";
      _0x4b99bd["appendChild"](_0x5de356);
      if (_0x13611e["length"] > 0x0) {
        const _0x4fb59d = _0x1a9cbc(_0x5de356);
        const _0x5b2d4d = _0x4fb59d['querySelectorAll'](':scope\x20>\x20.v2-asset-cover-cell');
        for (let _0x15a936 = 0x0; _0x15a936 < 0x4; _0x15a936++) {
          const _0x23d4d7 = _0x13611e[_0x15a936];
          if (_0x23d4d7) {
            _0x1d2561(_0x5b2d4d[_0x15a936], _0x23d4d7["thumbSrc"], _0x23d4d7["type"]);
          } else {
            _0x5b2d4d[_0x15a936] && _0x5b2d4d[_0x15a936]["replaceChildren"]();
          }
        }
      } else {
        _0x1d2561(_0x5de356, _0x5173c1?.["coverUrl"], _0x5173c1?.['coverType'] || "other");
      }
      const _0x28eb08 = document['createElement']("div");
      _0x28eb08["className"] = "v2-asset-detail-title";
      _0x28eb08["textContent"] = _0x5173c1["name"] || assetManagerText("unnamedAsset");
      _0x4b99bd['appendChild'](_0x28eb08);
      const _0x26e3cb = document['createElement']("div");
      _0x26e3cb["className"] = 'v2-asset-detail-meta';
      const _0x3e42f8 = Array['isArray'](_0x5173c1?.["nodes"]) ? _0x5173c1['nodes']["length"] : _0x13611e["length"];
      _0x26e3cb['textContent'] = assetManagerText("detail.meta", {
        'category': _0x5173c1["category"] ? this['_formatCategoryLabel'](_0x5173c1["category"]) : assetManagerText('uncategorized'),
        'count': _0x3e42f8,
        'time': _formatAssetDateTime(_0x5173c1["updatedAt"] || _0x5173c1["createdAt"])
      });
      _0x4b99bd['appendChild'](_0x26e3cb);
      const _0x22a78e = document["createElement"]("section");
      _0x22a78e["className"] = "v2-asset-detail-section";
      const _0x9c7529 = document["createElement"]('div');
      _0x9c7529["className"] = "v2-asset-detail-section-title";
      _0x9c7529['textContent'] = assetManagerText("detail.content");
      _0x22a78e["appendChild"](_0x9c7529);
      const _0x5d130e = document["createElement"]("div");
      _0x5d130e["className"] = 'v2-asset-subgrid';
      if (_0x13611e["length"] === 0x0) {
        const _0x3d97f7 = document["createElement"]("div");
        _0x3d97f7['className'] = "v2-asset-empty";
        _0x3d97f7['textContent'] = assetManagerText('detail.empty');
        _0x5d130e["appendChild"](_0x3d97f7);
      } else {
        for (let _0x5ca916 = 0x0; _0x5ca916 < _0x13611e['length']; _0x5ca916++) {
          const _0x166ad5 = _0x13611e[_0x5ca916];
          const _0x56c764 = document["createElement"]('button');
          _0x56c764["type"] = "button";
          _0x56c764["className"] = "v2-asset-subitem";
          _0x56c764["dataset"]["assetId"] = _0x5173c1['id'];
          _0x56c764['dataset']['idx'] = String(_0x5ca916);
          const _0x13632f = document["createElement"]("div");
          _0x13632f["className"] = "v2-asset-subitem-thumb";
          _0x1d2561(_0x13632f, _0x166ad5?.['thumbSrc'], _0x166ad5?.["type"]);
          const _0x21d74b = document["createElement"]("div");
          _0x21d74b["className"] = "v2-asset-subitem-info";
          const _0x379238 = document["createElement"]("span");
          _0x379238["className"] = "v2-asset-subitem-type";
          _0x379238["textContent"] = _formatAssetTypeLabel(_0x166ad5?.['type']);
          const _0x1fc7d1 = document["createElement"]("div");
          _0x1fc7d1["className"] = 'v2-asset-subitem-name';
          const _0x46c104 = String(_0x166ad5?.["name"] || _0x166ad5?.["type"] || assetManagerText("detail.childAssetName", {
            'index': _0x5ca916 + 0x1
          }));
          _0x1fc7d1["textContent"] = _0x46c104;
          _0x21d74b['append'](_0x379238, _0x1fc7d1);
          _0x56c764["append"](_0x13632f, _0x21d74b);
          _0x5d130e['appendChild'](_0x56c764);
        }
      }
      _0x22a78e["appendChild"](_0x5d130e);
      _0x4b99bd["appendChild"](_0x22a78e);
      const _0x211784 = document['createElement']("div");
      _0x211784['className'] = 'v2-asset-detail-actions';
      const _0x4375ac = document["createElement"]("button");
      _0x4375ac["type"] = "button";
      _0x4375ac['className'] = "v2-asset-detail-btn";
      _0x4375ac['dataset']["uiAction"] = "asset-add-all";
      _0x4375ac['dataset']['assetId'] = _0x5173c1['id'];
      _0x4375ac["textContent"] = assetManagerText("loadToCanvas");
      _0x211784["appendChild"](_0x4375ac);
      _0x4b99bd["appendChild"](_0x211784);
      _0x4f4124['appendChild'](_0x4b99bd);
      return;
    }
    if (_0x2fcf30) {
      _0x2fcf30["textContent"] = assetManagerText("title");
    }
    if (_0x3688ff) {
      _0x3688ff['classList']["remove"]("show");
    }
    this['sidebarPanel']['classList']['remove']("is-detail-view");
    _0x595abf["style"]['display'] = '';
    _0x4f4124["style"]['display'] = 'none';
    _0x4f4124["replaceChildren"]();
    let _0x44c489 = _0x595abf['querySelector'](":scope > .v2-asset-empty");
    !_0x44c489 && (_0x44c489 = document['createElement']("div"), _0x44c489['className'] = "v2-asset-empty", _0x595abf["appendChild"](_0x44c489));
    const _0x4f7473 = this["_getSortedAssets"]();
    let _0x12d10 = 0x0;
    let _0x296b92 = 0x0;
    for (const _0x3e7d7d of _0x4f7473) {
      const _0xcfd4a3 = String(_0x3e7d7d?.['id'] || '');
      if (!_0xcfd4a3) {
        continue;
      }
      let _0x611300 = this["_assetCardPool"]?.["get"]?.(_0xcfd4a3);
      if (!_0x611300) {
        _0x611300 = document["createElement"]('div');
        _0x611300["className"] = 'v2-asset-item';
        _0x611300["dataset"]['id'] = _0xcfd4a3;
        if (!this["_assetCardPool"]) {
          this["_assetCardPool"] = new Map();
        }
        this["_assetCardPool"]["set"](_0xcfd4a3, _0x611300);
      }
      if (_0x611300["parentElement"] !== _0x595abf) {
        _0x595abf["appendChild"](_0x611300);
      }
      const _0x196946 = this["_categoryKey"](_0x3e7d7d?.['category']) === this["_categoryKey"](this["activeTab"]);
      _0x611300['style']["display"] = _0x196946 ? '' : "none";
      _0x196946 && (_0x611300["style"]["order"] = String(_0x296b92++), _0x567093(_0x611300, _0x3e7d7d), this["_newAssetPulseId"] && this['_newAssetPulseId'] === _0xcfd4a3 && (this["_newAssetPulseId"] = '', window["requestAnimationFrame"](() => {
        if (!_0x611300["isConnected"]) {
          return;
        }
        _0x611300["classList"]["add"]('is-new');
        const _0x499904 = window["setTimeout"](() => {
          if (_0x611300["isConnected"]) {
            _0x611300["classList"]["remove"]("is-new");
          }
        }, 0x28a);
        _0x611300['dataset']['_pulseTimer'] = String(_0x499904);
      })), _0x12d10 += 0x1);
    }
    _0x44c489["style"]["display"] = _0x12d10 === 0x0 ? '' : "none";
    _0x12d10 === 0x0 && (_0x44c489["textContent"] = assetManagerText('emptyCategory', {
      'category': this['_formatCategoryLabel'](this['activeTab'])
    }), _0x44c489["style"]['order'] = '0');
  }
  ['_restoreAssetSubItem'](_0x801ee4, _0x4a9ab7, _0x5dd037 = null) {
    const _0x1f1f80 = (this["assets"] || [])["find"](_0x56ba20 => _0x56ba20['id'] === _0x801ee4);
    if (!_0x1f1f80 || !Array["isArray"](_0x1f1f80["nodes"])) {
      return;
    }
    const _0x4ce74c = prepareAssetNodeForRestore(_0x1f1f80, _0x1f1f80['nodes'][_0x4a9ab7]);
    if (!_0x4ce74c) {
      return;
    }
    const _0x3fac68 = Number["isFinite"](_0x5dd037?.['x']) && Number["isFinite"](_0x5dd037?.['y']);
    const _0x4ef016 = _0x3fac68 ? _0x5dd037 : this["_getCanvasCenterWorld"]();
    const _0xc0fb50 = Number(_0x4ce74c['width'] ?? _0x4ce74c['w']) || 0xf0;
    const _0x617ffa = Number(_0x4ce74c['height'] ?? _0x4ce74c['h']) || 0xf0;
    const _0x2d5cc6 = _0x4ef016['x'] - _0xc0fb50 / 0x2;
    const _0x1d7c0a = _0x4ef016['y'] - _0x617ffa / 0x2;
    const _0x4fdc4e = _0x3fac68 ? {
      'x': _0x2d5cc6,
      'y': _0x1d7c0a
    } : findAvailablePosition(a935_0x5aa396["getState"]()["nodes"], _0x2d5cc6, _0x1d7c0a, _0xc0fb50, _0x617ffa, 0x18, "right");
    a935_0x5aa396['batch'](() => {
      const _0x502a1c = JSON['parse'](JSON["stringify"](_0x4ce74c));
      _0x502a1c['id'] = generateId(_0x502a1c["type"]);
      _0x502a1c['x'] = _0x4fdc4e['x'];
      _0x502a1c['y'] = _0x4fdc4e['y'];
      a935_0x5aa396["addNode"](_0x502a1c);
      a935_0x5aa396["setSelectedNodes"]([_0x502a1c['id']]);
    });
    window['showToast']?.(assetManagerText('toasts.subAssetAdded'), 'success');
  }
  ["restoreAssetToCanvas"](_0x22d084, _0xa41aea = null) {
    const _0x368204 = (this['assets'] || [])["find"](_0x4ce1e7 => _0x4ce1e7['id'] === _0x22d084);
    if (!_0x368204 || !_0x368204["nodes"]) {
      return;
    }
    const _0x597381 = prepareAssetNodesForRestore(_0x368204, 0x18);
    const _0x46cc07 = Number["isFinite"](_0xa41aea?.['x']) && Number["isFinite"](_0xa41aea?.['y']);
    const _0xd7d179 = _0x46cc07 ? _0xa41aea : this['_getCanvasCenterWorld']();
    const _0x1009db = this["_calcNodesBBox"](_0x597381);
    const _0x4ee3db = _0xd7d179['x'] - _0x1009db['cx'];
    const _0x353398 = _0xd7d179['y'] - _0x1009db['cy'];
    const _0x251a3f = _0x1009db["minX"] + _0x4ee3db;
    const _0x5c183a = _0x1009db["minY"] + _0x353398;
    const _0x4f4daa = _0x46cc07 ? {
      'x': _0x251a3f,
      'y': _0x5c183a
    } : findAvailablePosition(a935_0x5aa396["getState"]()['nodes'], _0x251a3f, _0x5c183a, Math['max'](0x1, _0x1009db['w']), Math['max'](0x1, _0x1009db['h']), 0x18, "right");
    const _0x5a42d2 = _0x4ee3db + (_0x4f4daa['x'] - _0x251a3f);
    const _0x188d01 = _0x353398 + (_0x4f4daa['y'] - _0x5c183a);
    a935_0x5aa396['batch'](() => {
      const _0xd5ec94 = {};
      _0x597381["forEach"](_0x2709f6 => {
        const _0x2d1ecc = JSON['parse'](JSON["stringify"](_0x2709f6));
        const _0xa95101 = _0x2d1ecc['id'];
        const _0x2b084c = generateId(_0x2d1ecc["type"]);
        _0xd5ec94[_0xa95101] = _0x2b084c;
        _0x2d1ecc['id'] = _0x2b084c;
        _0x2d1ecc['x'] = (Number(_0x2d1ecc['x']) || 0x0) + _0x5a42d2;
        _0x2d1ecc['y'] = (Number(_0x2d1ecc['y']) || 0x0) + _0x188d01;
        a935_0x5aa396["addNode"](_0x2d1ecc);
      });
      _0x368204["edges"] && _0x368204['edges']["forEach"](_0x24813b => {
        const _0x58d556 = JSON["parse"](JSON["stringify"](_0x24813b));
        _0x58d556['id'] = generateId('edge');
        if (_0xd5ec94[_0x58d556["sourceId"]]) {
          _0x58d556["sourceId"] = _0xd5ec94[_0x58d556["sourceId"]];
        }
        if (_0xd5ec94[_0x58d556['targetId']]) {
          _0x58d556['targetId'] = _0xd5ec94[_0x58d556["targetId"]];
        }
        a935_0x5aa396["addEdge"](_0x58d556);
      });
      a935_0x5aa396["setSelectedNodes"](Object['values'](_0xd5ec94));
    });
    window["showToast"]?.(assetManagerText("toasts.assetAdded"), "success");
  }
}
export const assetManager = new AssetManager();