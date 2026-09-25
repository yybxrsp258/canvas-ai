import { renderWorkspaceDeleteIcon } from './workspaceActionIcons.js';
import { getWorkspaceAssetAppearances, getWorkspaceAssetBaseAppearance, getWorkspaceAssetAppearanceStats } from './workspaceAssetAppearance.js';
function normalizeText(_0x3f3dc2) {
  return String(_0x3f3dc2 ?? '')["trim"]();
}
function escapeHtml(_0x2197ae) {
  return String(_0x2197ae ?? '')["replaceAll"]('&', "&amp;")["replaceAll"]('<', '&lt;')["replaceAll"]('>', "&gt;")["replaceAll"]('\x22', "&quot;")["replaceAll"]('\x27', "&apos;");
}
function renderAttributes(_0x4aef59 = {}) {
  return Object["entries"](_0x4aef59 && typeof _0x4aef59 === "object" ? _0x4aef59 : {})["filter"](([_0x7c6efe, _0x2d7eba]) => normalizeText(_0x7c6efe) && _0x2d7eba !== ![] && _0x2d7eba != null)['map'](([_0x110bf2, _0x575370]) => _0x575370 === !![] ? '\x20' + escapeHtml(_0x110bf2) : '\x20' + escapeHtml(_0x110bf2) + '=\x22' + escapeHtml(_0x575370) + '\x22')["join"]('');
}
export function renderWorkspaceCardDeleteControl({
  className = '',
  ariaLabel = '删除',
  actionAttributes = {},
  disabled = ![]
} = {}) {
  const _0x47cdb5 = normalizeText(className);
  return "<button type=\"button\" class=\"story-action-icon-button is-danger story-project-delete-trigger story-card-delete-button story-card-delete-control" + (_0x47cdb5 ? '\x20' + escapeHtml(_0x47cdb5) : '') + '\x22' + renderAttributes(actionAttributes) + " aria-label=\"" + escapeHtml(ariaLabel) + '\x22' + (disabled ? " disabled" : '') + '>' + renderWorkspaceDeleteIcon() + "</button>";
}
export function isWorkspaceAssetHoverLandscape(_0x486619, _0x1800cf) {
  const _0x396171 = Number(_0x486619) || 0x0;
  const _0x2fbb5e = Number(_0x1800cf) || 0x0;
  return _0x396171 > 0x0 && _0x2fbb5e > 0x0 && _0x396171 > _0x2fbb5e;
}
export function resolveWorkspaceWheelDelta(_0x46b290) {
  const _0x5d3c70 = Number(_0x46b290?.["deltaX"] || 0x0);
  const _0x2cf39d = Number(_0x46b290?.["deltaY"] || 0x0);
  const _0xdff23f = Math["abs"](_0x2cf39d) >= Math['abs'](_0x5d3c70) ? _0x2cf39d : _0x5d3c70;
  const _0x2b8fdb = Number(_0x46b290?.["deltaMode"] || 0x0);
  const _0x355a77 = _0x2b8fdb === 0x1 ? 0x10 : _0x2b8fdb === 0x2 ? 0x320 : 0x1;
  return _0xdff23f * _0x355a77;
}
export function consumeWorkspaceWheelDirection(_0x74b05b, _0x3b238c, {
  threshold = 0x18,
  lockDuration = 0xdc,
  now = Date["now"]()
} = {}) {
  if (!_0x3b238c || now < Number(_0x3b238c["lockedUntil"] || 0x0)) {
    return 0x0;
  }
  const _0x534846 = resolveWorkspaceWheelDelta(_0x74b05b);
  if (!_0x534846) {
    return 0x0;
  }
  _0x3b238c['accumulator'] && Math['sign'](_0x3b238c["accumulator"]) !== Math["sign"](_0x534846) && (_0x3b238c["accumulator"] = 0x0);
  _0x3b238c["accumulator"] = Number(_0x3b238c["accumulator"] || 0x0) + _0x534846;
  if (Math["abs"](_0x3b238c["accumulator"]) < threshold) {
    return 0x0;
  }
  const _0x578f1e = _0x3b238c["accumulator"] > 0x0 ? 0x1 : -0x1;
  _0x3b238c["accumulator"] = 0x0;
  _0x3b238c["lockedUntil"] = now + lockDuration;
  return _0x578f1e;
}
export function resolveWorkspaceTabTransitionDirection(_0x361463, _0x202dba, _0x4708bc = []) {
  const _0x1076de = Array["isArray"](_0x4708bc) ? _0x4708bc["map"](normalizeText) : [];
  const _0x922270 = _0x1076de['indexOf'](normalizeText(_0x361463));
  const _0x189c82 = _0x1076de["indexOf"](normalizeText(_0x202dba));
  if (_0x922270 < 0x0 || _0x189c82 < 0x0 || _0x922270 === _0x189c82) {
    return "none";
  }
  return _0x189c82 > _0x922270 ? "forward" : "backward";
}
export function renderWorkspaceAssetTabIcon(_0x242a2a) {
  const _0x3dafef = ["character", 'scene', "prop", 'audio', "library"]["includes"](normalizeText(_0x242a2a)) ? normalizeText(_0x242a2a) : 'character';
  const _0x5a5a54 = _0x3dafef === "scene" ? "<rect x=\"3.5\" y=\"4.5\" width=\"17\" height=\"15\" rx=\"2.5\"/><path d=\"m6 16 4-4 3 3 2.5-2.5L18 15\"/><circle cx=\"15.5\" cy=\"8.5\" r=\"1.5\"/>" : _0x3dafef === "prop" ? "<path d=\"m12 3.5 7.5 4.25v8.5L12 20.5l-7.5-4.25v-8.5z\"/><path d=\"m4.5 7.75 7.5 4.5 7.5-4.5M12 12.25v8.25\"/>" : _0x3dafef === "audio" ? "<path d=\"M5 10v4M8.5 7.5v9M12 4v16M15.5 8.5v7M19 10v4\"/>" : _0x3dafef === "library" ? "<rect x=\"4\" y=\"4\" width=\"6.5\" height=\"6.5\" rx=\"1.5\"/><rect x=\"13.5\" y=\"4\" width=\"6.5\" height=\"6.5\" rx=\"1.5\"/><rect x=\"4\" y=\"13.5\" width=\"6.5\" height=\"6.5\" rx=\"1.5\"/><rect x=\"13.5\" y=\"13.5\" width=\"6.5\" height=\"6.5\" rx=\"1.5\"/>" : "<circle cx=\"12\" cy=\"8\" r=\"3.5\"/><path d=\"M5.5 20c.7-4 3-6 6.5-6s5.8 2 6.5 6\"/>";
  return '<span\x20class=\x22story-asset-tab-icon\x22\x20data-icon=\x22' + _0x3dafef + "\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" fill=\"none\">" + _0x5a5a54 + "</svg></span>";
}
export function renderWorkspaceAssetLoadingOverlay({
  compact = ![],
  title = "图片生成中",
  description = ''
} = {}) {
  const _0x324d6e = compact ? '<span\x20class=\x22generation-loading-label\x22>' + escapeHtml(title) + "</span>" : "<span class=\"story-asset-loading-copy\"><strong>" + escapeHtml(title) + "</strong>" + (description ? "<small>" + escapeHtml(description) + "</small>" : '') + "</span>";
  return "<div class=\"img-loading-overlay story-asset-loading-overlay generation-loading-surface" + (compact ? " is-compact" : '') + "\" role=\"status\" aria-busy=\"true\"><span class=\"generation-loading-shimmer\" aria-hidden=\"true\"></span>" + _0x324d6e + "</div>";
}
export function renderWorkspacePreviewArrow(_0x40d90e, {
  action = '',
  label = '',
  className = '',
  actionAttributes = null
} = {}) {
  const _0x4bb5f3 = _0x40d90e === "previous";
  const _0x18222f = _0x4bb5f3 ? "story-appearance-arrow--previous" : 'story-appearance-arrow--next';
  const _0x2e3686 = _0x4bb5f3 ? "m14.5 6.5-5.5 5.5 5.5 5.5" : 'm9.5\x206.5\x205.5\x205.5-5.5\x205.5';
  const _0x3bec6d = actionAttributes || (action ? {
    'data-workspace-action': action
  } : {});
  return '<button\x20type=\x22button\x22\x20class=\x22story-appearance-arrow\x20' + _0x18222f + (className ? '\x20' + escapeHtml(className) : '') + '\x22' + renderAttributes(_0x3bec6d) + " aria-label=\"" + escapeHtml(label) + "\"><svg class=\"story-appearance-arrow-icon\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"" + _0x2e3686 + "\"/></svg></button>";
}
export function renderWorkspaceCardAppearanceNavigation({
  attributes = {},
  previousAttributes = {},
  nextAttributes = {}
} = {}) {
  return "<span class=\"story-card-appearance-navigation\"" + renderAttributes(attributes) + '>' + renderWorkspacePreviewArrow('previous', {
    'label': "上一个形象",
    'actionAttributes': previousAttributes
  }) + renderWorkspacePreviewArrow("next", {
    'label': "下一个形象",
    'actionAttributes': nextAttributes
  }) + '</span>';
}
export function buildWorkspaceAssetHoverPreviewContent(_0x4263ae, {
  appearanceId = '',
  selectedAssetId = '',
  selectedAppearanceId = '',
  mediaOnly = ![],
  getAppearances = getWorkspaceAssetAppearances,
  hasVoiceReference = () => ![]
} = {}) {
  if (!_0x4263ae) {
    return null;
  }
  const _0x44c4b9 = _0x4263ae['isLibraryAsset'] ? [_0x4263ae] : getAppearances(_0x4263ae);
  const _0x494fa0 = normalizeText(appearanceId);
  const _0x4aacf6 = _0x44c4b9['filter'](_0xcfc7b0 => Boolean(normalizeText(_0xcfc7b0?.["imageUrl"])) && (!_0x494fa0 || normalizeText(_0xcfc7b0?.['id']) === _0x494fa0));
  if (!_0x4aacf6["length"]) {
    return null;
  }
  const _0x5b572e = _0x4263ae["kind"] === "character" && !_0x4263ae['isLibraryAsset'];
  const _0x5efda9 = _0x5b572e && hasVoiceReference(_0x4263ae);
  const _0x120050 = Math["ceil"](Math["sqrt"](Math["max"](0x1, _0x4aacf6["length"])));
  const _0x5bef2a = mediaOnly ? '' : "<div class=\"story-asset-hover-preview-heading\"><strong>" + escapeHtml(_0x4263ae["hoverTitle"] || _0x4263ae["name"] || '素材') + "</strong><span class=\"story-asset-hover-summary\">已生成 " + _0x4aacf6['length'] + '/' + _0x44c4b9['length'] + '</span>' + (_0x5b572e ? '<span\x20class=\x22story-character-voice-hover-status\x20' + (_0x5efda9 ? "has-reference" : 'is-missing') + "\"><i></i>" + (_0x5efda9 ? "有声音参考" : "无声音参考") + '</span>' : '') + "</div>";
  const _0x61122f = _0x5bef2a + '\x0a\x20\x20\x20\x20<div\x20class=\x22story-asset-hover-preview-grid\x22>\x0a\x20\x20\x20\x20\x20\x20' + _0x4aacf6["map"]((_0x3e4530, _0x136e09) => {
    const _0x36a48a = normalizeText(_0x3e4530?.["imageUrl"]);
    const _0x407966 = _0x3e4530?.["name"] || "形象 " + (_0x136e09 + 0x1);
    const _0x254724 = ["story-asset-hover-preview-cell", _0x3e4530?.['id'] === selectedAppearanceId && _0x4263ae['id'] === selectedAssetId ? "is-current" : '', _0x4263ae["baseAppearanceId"] === _0x3e4530?.['id'] ? "is-base" : '']["filter"](Boolean)["join"]('\x20');
    const _0x2b15ca = mediaOnly ? '' : '<span\x20class=\x22story-asset-hover-preview-status\x22>' + escapeHtml(_0x407966) + "</span>";
    const _0x5d231b = mediaOnly ? '\x20title=\x22' + escapeHtml(_0x407966) + '\x22' : '';
    return "<span class=\"story-asset-hover-preview-item\">" + _0x2b15ca + "<span class=\"" + _0x254724 + '\x22' + _0x5d231b + '><img\x20src=\x22' + escapeHtml(_0x36a48a) + "\" alt=\"" + escapeHtml(_0x4263ae["name"] + " · " + _0x407966) + "\" data-story-asset-hover-image loading=\"eager\" decoding=\"async\" draggable=\"false\"></span></span>";
  })["join"]('') + "\n    </div>";
  return {
    'allAppearances': _0x44c4b9,
    'appearances': _0x4aacf6,
    'columns': _0x120050,
    'hasVoice': _0x5efda9,
    'mediaOnly': mediaOnly,
    'html': _0x61122f
  };
}
export function renderWorkspaceAssetCard({
  asset = {},
  appearances = getWorkspaceAssetAppearances(asset),
  previewAppearance = null,
  stats = getWorkspaceAssetAppearanceStats(asset),
  selected = ![],
  selectionMode = ![],
  checked = ![],
  loading = ![],
  draggable = ![],
  promptPreview = '',
  statusText = '',
  cardStatusHtml = '',
  cardClassName = '',
  cardAttributes = '',
  shellClassName = '',
  preserveShell = ![],
  accessoryHtml = '',
  cardMetaHtml = '',
  cardMediaHtml = '',
  fallbackImageUrl = '',
  workspaceAssetLibraryImage = ![],
  nameAttributes = '',
  roleHtml = '',
  deleteControlHtml = ''
} = {}) {
  const _0x28e679 = Array["isArray"](appearances) ? appearances : [];
  const _0x84075d = previewAppearance || getWorkspaceAssetBaseAppearance(asset) || _0x28e679["find"](_0x42c2db => normalizeText(_0x42c2db?.['imageUrl'])) || _0x28e679[0x0] || asset;
  const _0x565b84 = normalizeText(_0x84075d?.["imageUrl"]);
  const _0x11345f = normalizeText(fallbackImageUrl);
  const _0x4dbcca = workspaceAssetLibraryImage ? " data-workspace-asset-library-image" + (_0x11345f && _0x11345f !== _0x565b84 ? " data-workspace-asset-library-fallback-src=\"" + escapeHtml(_0x11345f) + '\x22' : '') : '';
  const _0x24c3cf = cardMediaHtml || (_0x565b84 ? '<img\x20class=\x22story-asset-card-image\x22\x20src=\x22' + escapeHtml(_0x565b84) + "\" alt=\"" + escapeHtml('' + (asset["name"] || '') + (_0x84075d?.["name"] ? " · " + _0x84075d['name'] : '')) + "\" loading=\"lazy\" decoding=\"async\"" + _0x4dbcca + '>' : "<div class=\"story-asset-card-image story-media-empty\" role=\"img\" aria-label=\"" + escapeHtml((asset["name"] || '素材') + "待生成") + "\"><span>待生成</span></div>");
  const _0x1b427b = stats && typeof stats === "object" ? stats : {
    'total': _0x28e679["length"],
    'generated': 0x0,
    'failed': 0x0
  };
  const _0x1b7f6e = "<button type=\"button\" class=\"story-asset-card " + (selected && !selectionMode ? 'is-selected' : '') + '\x20' + (selectionMode ? "is-selection-mode" : '') + '\x20' + (checked ? "is-checked" : '') + (cardClassName ? '\x20' + escapeHtml(cardClassName) : '') + "\" data-workspace-asset-id=\"" + escapeHtml(asset['id']) + "\" data-story-asset-id=\"" + escapeHtml(asset['id']) + "\" data-workspace-marquee-item data-story-marquee-item data-workspace-marquee-id=\"" + escapeHtml(asset['id']) + '\x22\x20data-story-marquee-id=\x22' + escapeHtml(asset['id']) + "\" data-story-appearance-count=\"" + _0x28e679["length"] + "\" aria-pressed=\"" + (selectionMode ? String(checked) : "false") + '\x22' + (draggable ? " draggable=\"true\"" : '') + (cardAttributes ? '\x20' + cardAttributes : '') + '>\x0a\x20\x20\x20\x20' + (selectionMode ? '<span\x20class=\x22story-asset-select-indicator\x22\x20aria-hidden=\x22true\x22>' + (checked ? '✓' : '') + "</span>" : '') + '\x0a\x20\x20\x20\x20<span\x20class=\x22story-asset-card-media\x20' + (loading ? "img-preview-loading" : '') + '\x22\x20aria-busy=\x22' + loading + "\">\n      " + _0x24c3cf + "\n      " + (loading ? renderWorkspaceAssetLoadingOverlay({
    'compact': !![]
  }) : '') + "\n    </span>\n    <span class=\"story-asset-card-copy\">\n      <span class=\"story-asset-card-heading\"><strong" + (nameAttributes ? '\x20' + nameAttributes : '') + '>' + escapeHtml(asset["name"] || "未命名素材") + '</strong>' + roleHtml + "</span>\n      <span class=\"story-asset-card-status\">" + (cardStatusHtml || (statusText ? '<span>' + escapeHtml(statusText) + "</span>" : _0x1b427b["total"] > 0x1 ? "<span>形象 " + _0x1b427b["generated"] + '/' + _0x1b427b["total"] + '</span>' : '')) + (_0x1b427b['failed'] ? "<b>生成失败 " + _0x1b427b['failed'] + "</b>" : '') + "</span>\n      " + cardMetaHtml + "\n      <p>" + escapeHtml(promptPreview) + "</p>\n    </span>\n  </button>";
  if (!preserveShell && !deleteControlHtml && !accessoryHtml) {
    return _0x1b7f6e;
  }
  return '<span\x20class=\x22story-asset-card-shell' + (shellClassName ? '\x20' + escapeHtml(shellClassName) : '') + "\">\n    " + _0x1b7f6e + "\n    " + deleteControlHtml + accessoryHtml + "\n  </span>";
}