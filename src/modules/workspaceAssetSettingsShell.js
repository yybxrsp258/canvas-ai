function escapeHtml(_0x15a279) {
  return String(_0x15a279 ?? '')['replaceAll']('&', '&amp;')['replaceAll']('<', "&lt;")["replaceAll"]('>', '&gt;')['replaceAll']('\x22', "&quot;")["replaceAll"]('\x27', "&#039;");
}
export const WORKSPACE_ASSET_SPLIT_RATIO_MIN = 0x1c;
export const WORKSPACE_ASSET_SPLIT_RATIO_MAX = 0x48;
export const WORKSPACE_ASSET_SPLIT_RATIO_DEFAULT = 0x32;
export const WORKSPACE_ASSET_DETAIL_SPLIT_RATIO_MIN = 0x20;
export const WORKSPACE_ASSET_DETAIL_SPLIT_RATIO_MAX = 0x44;
export const WORKSPACE_ASSET_DETAIL_SPLIT_RATIO_DEFAULT = 0x32;
export function normalizeWorkspaceAssetSplitRatio(_0x141148) {
  const _0xe569f9 = Number(_0x141148);
  return Math["max"](WORKSPACE_ASSET_SPLIT_RATIO_MIN, Math["min"](WORKSPACE_ASSET_SPLIT_RATIO_MAX, Number["isFinite"](_0xe569f9) ? _0xe569f9 : WORKSPACE_ASSET_SPLIT_RATIO_DEFAULT));
}
export function normalizeWorkspaceAssetDetailSplitRatio(_0x58a5a2) {
  const _0xa7b90c = Number(_0x58a5a2);
  return Math['max'](WORKSPACE_ASSET_DETAIL_SPLIT_RATIO_MIN, Math["min"](WORKSPACE_ASSET_DETAIL_SPLIT_RATIO_MAX, Number["isFinite"](_0xa7b90c) ? _0xa7b90c : WORKSPACE_ASSET_DETAIL_SPLIT_RATIO_DEFAULT));
}
export function applyWorkspaceAssetSplitRatioToLayout(_0x20a627, _0x4bd662, _0x871d, {
  styleProperty = "--story-assets-left"
} = {}) {
  const _0x2726db = normalizeWorkspaceAssetSplitRatio(_0x871d);
  _0x20a627?.["style"]?.["setProperty"]?.(styleProperty, _0x2726db + '%');
  _0x4bd662?.['setAttribute']?.('aria-valuenow', String(Math['round'](_0x2726db)));
  return _0x2726db;
}
export function applyWorkspaceAssetDetailSplitRatioToLayout(_0x1cd4db, _0x50fe58, _0x1df4b8, {
  styleProperty = '--workspace-asset-detail-top'
} = {}) {
  const _0x5f0f6c = normalizeWorkspaceAssetDetailSplitRatio(_0x1df4b8);
  _0x1cd4db?.["style"]?.["setProperty"]?.(styleProperty, _0x5f0f6c + '%');
  _0x50fe58?.["setAttribute"]?.("aria-valuenow", String(Math["round"](_0x5f0f6c)));
  return _0x5f0f6c;
}
export function renderWorkspaceAssetSettingsShell({
  className = '',
  tabsHtml = '',
  tablistLabel = "素材分类",
  calloutTitle = '',
  calloutDescription = '',
  calloutActionsHtml = '',
  cardsHtml = '',
  emptyText = "暂无素材",
  detailHtml = '',
  footerHtml = '',
  splitRatio = 0x32,
  activeTab = '',
  tabCount = 0x1
} = {}) {
  const _0x4b8ac5 = normalizeWorkspaceAssetSplitRatio(splitRatio);
  const _0x5796d6 = Math["max"](0x1, Math["trunc"](Number(tabCount) || 0x1));
  const _0x1bd539 = activeTab === "library" ? "story-asset-grid story-asset-grid--workspace-library" : "story-asset-grid workspace-project-asset-grid";
  return "<div class=\"story-assets-page story-content-page" + (className ? '\x20' + escapeHtml(className) : '') + '\x22\x20data-story-marquee-page-surface=\x22assets\x22\x20data-workspace-marquee-page-surface=\x22assets\x22>\x0a\x20\x20\x20\x20<header\x20class=\x22story-page-heading\x22>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-asset-tabs\x22\x20role=\x22tablist\x22\x20aria-label=\x22' + escapeHtml(tablistLabel) + "\" data-active-tab=\"" + escapeHtml(activeTab) + '\x22\x20data-tab-count=\x22' + _0x5796d6 + "\">\n        " + tabsHtml + "\n      </div>\n    </header>\n    <div class=\"story-assets-switch-region\" data-story-assets-switch-region data-workspace-assets-switch-region>\n      <div class=\"story-assets-layout\" style=\"--story-assets-left: " + _0x4b8ac5 + '%;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<section\x20class=\x22story-assets-list\x22\x20data-story-marquee-surface=\x22assets\x22\x20data-workspace-marquee-surface=\x22assets\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-assets-callout\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>' + escapeHtml(calloutTitle) + "</strong>\n              <p>" + escapeHtml(calloutDescription) + "</p>\n            </div>\n            <div class=\"story-assets-callout-actions\">" + calloutActionsHtml + "</div>\n          </div>\n          <div class=\"" + _0x1bd539 + "\">\n            " + (cardsHtml || "<div class=\"story-inline-empty\">" + escapeHtml(emptyText) + "</div>") + "\n          </div>\n        </section>\n        <div class=\"story-assets-splitter panel-resize-handle panel-resize-handle--transient\" data-story-assets-splitter data-workspace-assets-splitter role=\"separator\" aria-orientation=\"vertical\" aria-label=\"调整素材列表与详情区域宽度\" aria-valuemin=\"28\" aria-valuemax=\"72\" aria-valuenow=\"" + Math["round"](_0x4b8ac5) + "\" tabindex=\"0\"></div>\n        " + detailHtml + "\n      </div>\n      " + footerHtml + "\n    </div>\n  </div>";
}