import { localPathToUrl } from '../../utils/localMediaPath.js';
import { renderWorkspaceAssetLoadingOverlay } from '../workspaceAssetPresentation.js';
import { renderPersonReplacementAssetCard, renderPersonReplacementPreviewArrow } from './personReplacementAssetPresentation.js';
import { PERSON_REPLACEMENT_COMPOSITE_SIDEBAR_WIDTH_RANGE, normalizePersonReplacementCompositeSidebarWidth } from './personReplacementProjectSession.js';
import { getPersonReplacementShotDurationSec } from './personReplacementShotCutModel.js';
function escapeHtml(_0xb33df1) {
  return String(_0xb33df1 ?? '')['replaceAll']('&', "&amp;")["replaceAll"]('<', '&lt;')["replaceAll"]('>', "&gt;")["replaceAll"]('\x22', "&quot;")["replaceAll"]('\x27', "&#39;");
}
function normalizeText(_0x1d97cd, _0x5891c5 = '') {
  const _0x21cbd7 = String(_0x1d97cd ?? '')["trim"]();
  return _0x21cbd7 || _0x5891c5;
}
function normalizeMediaUrl(_0x2fa250) {
  const _0x1a1579 = normalizeText(_0x2fa250);
  return _0x1a1579 ? localPathToUrl(_0x1a1579) || _0x1a1579 : '';
}
function formatClock(_0x56caa0) {
  const _0x10e97c = Math["max"](0x0, Number(_0x56caa0) || 0x0);
  const _0x2a26ea = Math["floor"](_0x10e97c / 0x3c);
  const _0x2793ae = Math["floor"](_0x10e97c % 0x3c);
  return String(_0x2a26ea)["padStart"](0x2, '0') + ':' + String(_0x2793ae)["padStart"](0x2, '0');
}
function renderVideoIcon() {
  return "<svg class=\"person-replacement-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"14\" height=\"14\" rx=\"3\"/><path d=\"m17 10 4-2v8l-4-2\"/></svg>";
}
function renderCompositePreviewShotList(_0x1e9f9e) {
  const _0x17b6a6 = _0x1e9f9e["previewMode"] === "full" ? '' : normalizeText(_0x1e9f9e["selectedShot"]?.['id']);
  const _0x803f78 = {
    'data': {
      'assets': [],
      'project': {}
    },
    'assetFilter': "scene",
    'selectedAssetId': _0x17b6a6,
    'selectedAssetIds': _0x1e9f9e['selectedShotIds'],
    'assetSelectionMode': _0x1e9f9e["selectionMode"],
    'assetAppearanceIndexes': {},
    'generatingAppearanceKeys': [],
    'isBatchGenerating': ![],
    'batchGeneratingAssetIds': [],
    'allowDeleteAssetCard': ![],
    'allowAssetRename': ![],
    'hideAssetRoleTag': !![],
    'hideAssetNameTooltip': !![]
  };
  return _0x1e9f9e["shots"]['map']((_0x1c1cc4, _0x523b08) => {
    const _0x2f9c88 = normalizeText(_0x1c1cc4?.['id']);
    const _0x4c3eb7 = _0x2f9c88 === _0x17b6a6;
    const _0x417505 = Boolean(_0x1c1cc4?.['resultVideoRef']);
    const _0x31b0c0 = getPersonReplacementShotDurationSec(_0x1c1cc4);
    const _0x2e6c10 = "镜头片段" + String(_0x523b08 + 0x1)["padStart"](0x2, '0');
    const _0x4b3162 = normalizeMediaUrl(_0x1c1cc4?.['replacementImageRef'] || _0x1c1cc4?.["keyframeRef"]);
    const _0x5fefb = (_0x31b0c0 > 0x0 ? formatClock(_0x31b0c0) : "00:00") + " · " + (_0x417505 ? '替换视频已就绪' : "等待替换视频");
    const _0x456800 = _0x4b3162 ? "data-person-replacement-composite-shot-hover-preview=\"true\"" : '';
    return renderPersonReplacementAssetCard(_0x803f78, {
      'id': _0x2f9c88,
      'kind': 'scene',
      'name': _0x2e6c10,
      'description': '',
      'imageUrl': _0x4b3162,
      'appearances': [{
        'id': "composite-thumbnail",
        'name': "片段缩略图",
        'imageUrl': _0x4b3162
      }]
    }, {
      'statusText': _0x5fefb,
      'cardClassName': 'person-replacement-shot-card\x20person-replacement-preview-shot-card',
      'cardAttributes': "data-person-replacement-shot-card=\"true\" data-shot-id=\"" + escapeHtml(_0x2f9c88) + '\x22\x20' + _0x456800 + " aria-current=\"" + _0x4c3eb7 + '\x22\x20aria-label=\x22' + escapeHtml(_0x2e6c10 + '，' + _0x5fefb + (_0x4c3eb7 ? '，当前片段' : '')) + '\x22'
    });
  })["join"]('');
}
function renderCompositeFullVideoEntry(_0x29df4a) {
  if (!_0x29df4a["fullAvailable"]) {
    return '';
  }
  const _0x42d890 = _0x29df4a["composedShots"]["reduce"]((_0x57061f, _0x38dd0c) => _0x57061f + getPersonReplacementShotDurationSec(_0x38dd0c), 0x0);
  const _0x15fd03 = _0x29df4a["previewMode"] === "full";
  const _0x481974 = _0x29df4a["composedShots"]["length"] + " 个片段 · " + formatClock(_0x42d890);
  const _0x59d6d6 = _0x29df4a['compositionStale'] ? "旧合成视频" : "完整视频";
  const _0x3e5bd7 = _0x29df4a["compositionStale"] ? _0x481974 + " · 需重新合成" : _0x481974;
  return "<div class=\"person-replacement-composite-full-entry\">\n    <button type=\"button\" class=\"person-replacement-composite-full-button" + (_0x15fd03 ? " is-selected" : '') + "\" data-person-replacement-action=\"select-composite-full-video\" aria-current=\"" + _0x15fd03 + "\" aria-label=\"" + escapeHtml(_0x59d6d6) + '，' + escapeHtml(_0x3e5bd7) + "\">\n      <span class=\"person-replacement-composite-full-icon\" aria-hidden=\"true\">" + renderVideoIcon() + '</span>\x0a\x20\x20\x20\x20\x20\x20<span\x20class=\x22person-replacement-composite-full-copy\x22><strong>' + escapeHtml(_0x59d6d6) + '</strong><small>' + escapeHtml(_0x3e5bd7) + "</small></span>\n    </button>\n  </div>";
}
function renderCompositePreviewShotRail(_0xfc0396) {
  const _0x1846aa = _0xfc0396['shots']["length"] > 0x0 && _0xfc0396['shots']["every"](_0x1f65fb => _0xfc0396['selectedShotIds']["includes"](_0x1f65fb['id']));
  const _0x2aafdb = _0xfc0396['selectionMode'] ? "<button type=\"button\" class=\"story-secondary-button\" data-story-action=\"toggle-all-shots\" aria-pressed=\"" + _0x1846aa + '\x22>' + (_0x1846aa ? "取消全选" : '全选') + "</button><button type=\"button\" class=\"story-secondary-button\" data-story-action=\"cancel-shot-selection\">取消</button>" : "<button type=\"button\" class=\"story-secondary-button story-clip-selection-trigger workspace-selection-trigger\" data-story-action=\"toggle-shot-selection\" " + (_0xfc0396['shots']["length"] ? '' : "disabled") + ">多选</button>";
  const _0x201330 = _0xfc0396["selectionMode"] ? "已选 " + _0xfc0396['selectedShotIds']["length"] : _0xfc0396['completed'] + '/' + _0xfc0396["shots"]["length"];
  return "<aside class=\"person-replacement-preview-shot-rail" + (_0xfc0396["fullAvailable"] ? " has-complete-video" : '') + '\x22\x20aria-label=\x22待检查片段\x22>\x0a\x20\x20\x20\x20' + renderCompositeFullVideoEntry(_0xfc0396) + "\n    <header class=\"" + (_0xfc0396["selectionMode"] ? "is-selection-mode" : '') + "\">\n      <div class=\"person-replacement-preview-shot-heading\"><strong>镜头片段</strong><small>" + (_0xfc0396["selectionMode"] ? "拖拽空白区域可框选" : "逐段检查替换结果") + "</small></div>\n      <div class=\"person-replacement-preview-shot-actions\"><span>" + _0x201330 + "</span>" + _0x2aafdb + '</div>\x0a\x20\x20\x20\x20</header>\x0a\x20\x20\x20\x20<div\x20class=\x22person-replacement-preview-shot-list\x22\x20data-story-marquee-surface=\x22shots\x22\x20tabindex=\x220\x22>' + renderCompositePreviewShotList(_0xfc0396) + "</div>\n  </aside>";
}
function renderCompositePreviewMediaCard({
  kind: _0x64e8c5,
  label: _0x4ba429,
  description: _0x187e6e,
  mediaRef: _0xd17050,
  posterRef = '',
  playable = ![],
  loading = ![],
  showShotNavigation = ![],
  footerDetail = ''
} = {}) {
  const _0x2f1022 = normalizeText(_0xd17050);
  const _0x520aec = normalizeText(posterRef);
  const _0x2e0c84 = _0x64e8c5 === "replacement";
  const _0x5cc4b0 = showShotNavigation ? '' + renderPersonReplacementPreviewArrow("previous", {
    'action': "previous-shot",
    'label': '上一个片段',
    'className': "person-replacement-shot-navigation-arrow person-replacement-composite-shot-navigation-arrow"
  }) + renderPersonReplacementPreviewArrow('next', {
    'action': "next-shot",
    'label': "下一个片段",
    'className': "person-replacement-shot-navigation-arrow person-replacement-composite-shot-navigation-arrow"
  }) : '';
  const _0x4144e0 = showShotNavigation ? " data-person-replacement-shot-wheel=\"true\" aria-label=\"滚动鼠标滚轮或使用左右按钮切换片段\"" : '';
  return "<article class=\"person-replacement-compare-card is-" + escapeHtml(_0x64e8c5) + "\" data-person-replacement-compare-card=\"" + escapeHtml(_0x64e8c5) + "\">\n    <header class=\"person-replacement-compare-card-heading\">\n      <span class=\"person-replacement-compare-card-label\"><i aria-hidden=\"true\"></i>" + escapeHtml(_0x4ba429) + "</span>\n      <small>" + escapeHtml(_0x187e6e) + "</small>\n    </header>\n    <div class=\"person-replacement-compare-media-frame" + (loading ? " img-preview-loading" : '') + '\x22' + _0x4144e0 + (loading ? " aria-busy=\"true\" inert" : '') + ">\n      <button type=\"button\" class=\"person-replacement-compare-media\" data-person-replacement-compare-playback=\"" + escapeHtml(_0x64e8c5) + "\" data-person-replacement-action=\"toggle-comparison-playback\" aria-label=\"播放原视频和替换视频\" aria-pressed=\"false\" " + (playable && _0x2f1022 ? '' : "disabled") + '>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x2f1022 ? '<video\x20data-person-replacement-compare-video=\x22' + escapeHtml(_0x64e8c5) + "\" data-person-replacement-compare-video-url=\"" + escapeHtml(normalizeMediaUrl(_0x2f1022)) + "\" playsinline preload=\"metadata\" muted" + (_0x520aec ? '\x20poster=\x22' + escapeHtml(normalizeMediaUrl(_0x520aec)) + '\x22' : '') + '\x20aria-label=\x22' + escapeHtml(_0x4ba429) + "\"></video>" : '<div\x20class=\x22person-replacement-compare-empty\x22><span\x20aria-hidden=\x22true\x22>' + (_0x2e0c84 ? '↗' : '□') + "</span><strong>" + (_0x2e0c84 ? '等待替换视频' : '原视频尚未准备') + "</strong><small>" + (_0x2e0c84 ? "返回视频替换生成当前片段后，可在这里同步对比。" : "完成视频切片后即可预览。") + "</small></div>") + '\x0a\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20' + _0x5cc4b0 + "\n      " + (loading ? renderWorkspaceAssetLoadingOverlay({
    'title': "视频合成中",
    'description': "正在合成替换片段，完成后会自动显示完整视频。"
  }) : '') + '\x0a\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20<footer><span>' + (_0x2f1022 ? "已载入" : "未载入") + "</span><small>" + escapeHtml(footerDetail || (_0x2e0c84 ? "生成结果" : "原始片段")) + '</small></footer>\x0a\x20\x20</article>';
}
function renderCompositeSidebarSplitter(_0x18338b) {
  const _0x44b626 = normalizePersonReplacementCompositeSidebarWidth(_0x18338b);
  return "<div class=\"person-replacement-composite-sidebar-splitter panel-resize-handle panel-resize-handle--transient\" data-person-replacement-composite-sidebar-splitter role=\"separator\" aria-orientation=\"vertical\" aria-label=\"调整镜头片段侧栏与显示区域宽度\" aria-valuemin=\"" + PERSON_REPLACEMENT_COMPOSITE_SIDEBAR_WIDTH_RANGE["min"] + "\" aria-valuemax=\"" + PERSON_REPLACEMENT_COMPOSITE_SIDEBAR_WIDTH_RANGE['max'] + '\x22\x20aria-valuenow=\x22' + Math['round'](_0x44b626) + "\" tabindex=\"0\"></div>";
}
function renderCompositePreview(_0x5c4bdf, {
  composeActionHtml = '',
  playbackControlsHtml = '',
  composeOutputPending = ![]
} = {}) {
  const _0x59db81 = _0x5c4bdf["previewMode"] === "full";
  const _0x3709fd = _0x5c4bdf["media"]["replacementAudioRef"] ? '声音克隆音轨' : "替换视频内音轨";
  const _0xa9a6c3 = _0x59db81 ? _0x5c4bdf["compositionStale"] ? "<span>旧合成视频</span><small>图像或视频已更新 · 需重新合成</small>" : "<span>完整视频</span><small>" + _0x5c4bdf["composedShots"]["length"] + " 个片段 · 对比已就绪</small>" : '<span>' + String(_0x5c4bdf["selectedShotIndex"] + 0x1)["padStart"](0x2, '0') + " / " + String(Math["max"](_0x5c4bdf['total'], 0x1))["padStart"](0x2, '0') + "</span><small>" + (_0x5c4bdf["composeSucceeded"] ? "全部视频已合成" : "已替换 " + _0x5c4bdf["completed"] + '/' + _0x5c4bdf["total"] + '，其余保留原片') + '</small>';
  return '<div\x20class=\x22person-replacement-preview-page\x22\x20data-person-replacement-composite-preview\x20data-preview-track=\x22' + escapeHtml(_0x5c4bdf["previewTrack"]) + "\">\n    <div class=\"person-replacement-preview-workbench\" style=\"--person-replacement-composite-sidebar-width:" + _0x5c4bdf["sidebarWidth"] + "px;\">\n      " + renderCompositePreviewShotRail(_0x5c4bdf) + '\x0a\x20\x20\x20\x20\x20\x20' + renderCompositeSidebarSplitter(_0x5c4bdf["sidebarWidth"]) + "\n      <section class=\"person-replacement-compare-workspace\" aria-label=\"原视频与替换视频对比\">\n        <header class=\"person-replacement-compare-heading\">\n          <div><span class=\"person-replacement-eyebrow\">合成视频</span><h2><input type=\"text\" class=\"person-replacement-composite-project-title\" data-person-replacement-composite-project-title value=\"" + escapeHtml(_0x5c4bdf["title"]) + "\" maxlength=\"120\" autocomplete=\"off\" spellcheck=\"false\" aria-label=\"项目名称，点击修改\"></h2><p>同步检查动作、构图与声音，确认后再生成最终合成。</p></div>\n          <div class=\"person-replacement-compare-heading-actions\">\n            " + composeActionHtml + "\n            <div class=\"person-replacement-compare-summary\">" + _0xa9a6c3 + '</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</header>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22person-replacement-compare-grid\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + renderCompositePreviewMediaCard({
    'kind': "original",
    'label': "原视频",
    'description': _0x59db81 ? "全部原片按时间轴合成" : "动作与镜头基准",
    'mediaRef': _0x5c4bdf["media"]["originalRef"],
    'posterRef': _0x59db81 ? '' : _0x5c4bdf['selectedShot']?.["keyframeRef"],
    'playable': _0x5c4bdf["canCompare"],
    'showShotNavigation': !_0x59db81 && _0x5c4bdf["total"] > 0x1,
    'footerDetail': _0x59db81 ? '原片完整对照' : "原始片段"
  }) + "\n          " + renderCompositePreviewMediaCard({
    'kind': "replacement",
    'label': "替换视频",
    'description': _0x59db81 ? "替换片段优先，未替换片段保留原片" : '人物替换结果',
    'mediaRef': _0x5c4bdf["media"]["replacementRef"],
    'posterRef': _0x59db81 ? '' : _0x5c4bdf["selectedShot"]?.["replacementImageRef"],
    'playable': _0x5c4bdf["canCompare"],
    'loading': composeOutputPending,
    'showShotNavigation': !_0x59db81 && _0x5c4bdf['total'] > 0x1,
    'footerDetail': _0x59db81 ? "替换完整结果" : "生成结果"
  }) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22person-replacement-compare-controls\x22\x20data-person-replacement-compare-footer>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + playbackControlsHtml + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22person-replacement-compare-control-row\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22person-replacement-track-setting\x22><span>播放音轨</span><div\x20class=\x22person-replacement-track-options\x22\x20role=\x22group\x22\x20aria-label=\x22播放音轨\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22' + (_0x5c4bdf['previewTrack'] === "original" ? 'is-selected' : '') + "\" data-person-replacement-action=\"set-preview-track\" data-preview-track=\"original\" aria-pressed=\"" + (_0x5c4bdf["previewTrack"] === 'original') + "\"><strong>原视频音轨</strong><small>保留现场原声</small></button>\n              <button type=\"button\" class=\"" + (_0x5c4bdf['previewTrack'] === "replacement" ? 'is-selected' : '') + "\" data-person-replacement-action=\"set-preview-track\" data-preview-track=\"replacement\" aria-pressed=\"" + (_0x5c4bdf["previewTrack"] === 'replacement') + '\x22><strong>替换音轨</strong><small>' + escapeHtml(_0x3709fd) + "</small></button>\n            </div></div>\n          </div>\n        </div>\n        " + (_0x59db81 && _0x5c4bdf["media"]["originalAudioRef"] ? "<audio data-person-replacement-compare-original-audio data-person-replacement-compare-original-audio-url=\"" + escapeHtml(normalizeMediaUrl(_0x5c4bdf["media"]["originalAudioRef"])) + "\" preload=\"none\"></audio>" : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x5c4bdf["media"]['replacementAudioRef'] ? "<audio data-person-replacement-compare-replacement-audio data-person-replacement-compare-replacement-audio-url=\"" + escapeHtml(normalizeMediaUrl(_0x5c4bdf["media"]["replacementAudioRef"])) + '\x22\x20preload=\x22none\x22></audio>' : '') + "\n      </section>\n    </div>\n  </div>";
}
export function createPersonReplacementCompositePreviewPresentation() {
  return Object["freeze"]({
    'render': renderCompositePreview,
    'renderRail': renderCompositePreviewShotRail
  });
}