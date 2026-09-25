import { renderRequestDebugButton } from '../debugRequestWindow.js';
import { renderAIGenTextModelSelectorMarkup } from '../../components/aigenText/modelSelector.js';
import { getDisplayModelName } from '../providers.js';
import { getStorySurfaceProjects } from './storyWorkspaceSurface.js';
import { renderWorkspaceProjectCard, renderWorkspaceProjectSortControl } from '../workspaceProjectHome.js';
import { getStoryAssetAppearances } from './storyAssetAppearances.js';
import { getStoryBackgroundTaskSummary } from './storyBackgroundTasks.js';
import { renderStoryGenerationSpinner } from './storyAsyncButtonPresentation.js';
import { STORY_HOME_REWRITE_SOURCE_HINT, canStartStoryHomeGeneration, hasStoryHomeReferenceScript } from './storyHomeRewrite.js';
import { STORY_STYLE_CATEGORIES, STORY_STYLE_PRESETS, resolveStoryStyleSelection } from './storyStyleCatalog.js';
import { STORY_ASPECT_RATIO_OPTIONS, STORY_CUSTOM_STYLE_MAX_CHARACTERS, STORY_DEVELOPER_EPISODE_COUNT_OPTIONS, STORY_EPISODE_COUNT_MAX, STORY_EPISODE_COUNT_OPTIONS, STORY_IDEA_MAX_CHARACTERS, STORY_PROMPT_MODE_OPTIONS, STORY_PUBLIC_EPISODE_COUNT_OPTIONS, STORY_SCRIPT_MAX_CHARACTERS, getStoryPromptModeLabel, getStoryScriptModeHint, normalizeStoryAspectRatio, normalizeStoryEpisodeCount, normalizeStoryPromptMode, normalizeStoryScriptMode } from './storyProjectPlanning.js';
import { getStoryProjectHomeEntries } from './storyProjectSession.js';
import { getStoryVideoInputTextModelOptions } from './storyWorkspaceModelCatalog.js';
import { STORY_REPLICATION_LOCALES, getStoryReplicationLocale, isStoryVideoReplicationHomeAvailable, resolveStoryVideoReplicationHomeTab } from './storyVideoReplication.js';
function escapeHtml(_0x57ee02) {
  return String(_0x57ee02 ?? '')["replaceAll"]('&', "&amp;")["replaceAll"]('<', "&lt;")["replaceAll"]('>', "&gt;")["replaceAll"]('\x22', '&quot;')["replaceAll"]('\x27', "&#39;");
}
function normalizeText(_0x1144d9) {
  return String(_0x1144d9 ?? '')["trim"]();
}
export function getStoryHomeModeDescription(_0x201b91) {
  return {
    'upload': "导入已有剧本，按原稿进入制作",
    'generate': '输入故事想法，AI\x20帮你生成剧本',
    'collaborate': "与 AI 讨论方向，自定设定，逐段打磨剧本"
  }[_0x201b91] || '';
}
function getStoryDocumentExtension(_0xd3e074 = '') {
  const _0x10e70d = normalizeText(_0xd3e074)['split']('.')['pop']();
  return _0x10e70d && _0x10e70d !== _0xd3e074 ? '.' + _0x10e70d["toLowerCase"]() : '.txt';
}
function renderStoryReplicationVideoIcon() {
  return "<svg class=\"story-replication-upload-video-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"14\" height=\"14\" rx=\"3\"/><path d=\"m17 10 4-2v8l-4-2\"/></svg>";
}
function renderStoryHomeTabIcon(_0x17c246) {
  if (_0x17c246 === "upload") {
    return '<span\x20class=\x22story-home-tab-icon\x20story-home-tab-icon--upload\x22\x20aria-hidden=\x22true\x22><svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22><path\x20d=\x22M12\x2015V4M7.5\x208.5\x2012\x204l4.5\x204.5\x22/><path\x20d=\x22M4\x2014.5v3.75A1.75\x201.75\x200\x200\x200\x205.75\x2020h12.5A1.75\x201.75\x200\x200\x200\x2020\x2018.25V14.5\x22/></svg></span>';
  }
  if (_0x17c246 === "replication") {
    return "<span class=\"story-home-tab-icon story-home-tab-icon--replication\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" fill=\"none\"><rect x=\"3.5\" y=\"5\" width=\"13\" height=\"14\" rx=\"2\"/><path d=\"m16.5 9 4-2v10l-4-2z\"/><path d=\"m8.5 9 4 3-4 3z\"/></svg></span>";
  }
  return "<span class=\"story-home-tab-icon story-home-tab-icon--generate\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"m11.5 3 .9 3.1a4.7 4.7 0 0 0 3.2 3.2l3.1.9-3.1.9a4.7 4.7 0 0 0-3.2 3.2l-.9 3.1-.9-3.1a4.7 4.7 0 0 0-3.2-3.2l-3.1-.9 3.1-.9a4.7 4.7 0 0 0 3.2-3.2z\"/><path d=\"m18.5 15.5.35 1.15a2.2 2.2 0 0 0 1.5 1.5l1.15.35-1.15.35a2.2 2.2 0 0 0-1.5 1.5l-.35 1.15-.35-1.15a2.2 2.2 0 0 0-1.5-1.5l-1.15-.35 1.15-.35a2.2 2.2 0 0 0 1.5-1.5z\"/></svg></span>";
}
function renderHomeTabs(_0x259ad6) {
  if (_0x259ad6["workspaceSurface"] === 'replication') {
    return '';
  }
  const _0x591b53 = isStoryVideoReplicationHomeAvailable(_0x259ad6);
  const _0x3905c7 = [['upload', "上传剧本"], ['generate', "快速创作"], ["collaborate", "AI 协作创作"]];
  return "<div class=\"story-home-tabs\" data-story-home-tabs data-active-tab=\"" + escapeHtml(_0x259ad6["homeTab"]) + '\x22\x20role=\x22tablist\x22>\x0a\x20\x20\x20\x20<span\x20class=\x22story-home-tab-indicator\x22\x20aria-hidden=\x22true\x22></span>\x0a\x20\x20\x20\x20' + _0x3905c7['map'](([_0x32eb0b, _0x4f850b]) => {
    const _0x1ba6a9 = _0x32eb0b === "replication" && !_0x591b53 || _0x32eb0b === 'collaborate' && _0x259ad6["developerModeAvailable"] !== !![];
    const _0x3757e6 = _0x259ad6["homeTab"] === _0x32eb0b && !_0x1ba6a9;
    return "<button type=\"button\" class=\"story-home-tab " + (_0x3757e6 ? 'is-active' : '') + "\" data-story-home-tab=\"" + _0x32eb0b + "\" role=\"tab\" aria-selected=\"" + _0x3757e6 + "\" aria-disabled=\"" + _0x1ba6a9 + '\x22\x20tabindex=\x22' + (_0x3757e6 ? '0' : '-1') + '\x22\x20' + (_0x1ba6a9 ? "disabled" : '') + "><span class=\"story-home-tab-content\">" + renderStoryHomeTabIcon(_0x32eb0b) + "<span>" + _0x4f850b + "</span></span></button>";
  })['join']('') + "\n  </div>";
}
export function renderStoryHomeComposerBody(_0xfaa8a) {
  if (_0xfaa8a['homeTab'] === "collaborate") {
    return "<div class=\"story-home-composer-panel story-home-input-wrap story-home-story-input\">\n      <label for=\"storyIdeaInput\">输入故事想法</label>\n      <textarea id=\"storyIdeaInput\" data-story-idea-input maxlength=\"" + STORY_IDEA_MAX_CHARACTERS + '\x22\x20placeholder=\x22写下一段故事、人物设定或一个灵感，和\x20AI\x20一起把它展开……\x22>' + escapeHtml(_0xfaa8a["idea"] || '') + "</textarea>\n      <div class=\"story-home-input-meta\"><p>先讨论方向，再由你决定如何写成正文。</p><span data-story-idea-count>" + (_0xfaa8a['idea'] || '')["length"] + " / " + STORY_IDEA_MAX_CHARACTERS + "</span></div>\n    </div>";
  }
  if (_0xfaa8a["homeTab"] === "replication") {
    const _0x1a3493 = Array["isArray"](_0xfaa8a["replicationSourceFiles"]) ? _0xfaa8a["replicationSourceFiles"] : [];
    const _0x2ea056 = Array['isArray'](_0xfaa8a['replicationSourcePreviewUrls']) ? _0xfaa8a["replicationSourcePreviewUrls"] : [];
    const _0x1b9b9f = '<div\x20class=\x22story-replication-upload-list\x20workspace-video-import-grid\x22\x20data-story-replication-upload-list\x20' + (_0x1a3493["length"] ? '' : "hidden") + ">\n          " + _0x1a3493["map"]((_0x1c349d, _0x119628) => {
      const _0x589e69 = _0x1c349d["name"] || "视频 " + (_0x119628 + 0x1);
      const _0x3150e6 = normalizeText(_0x2ea056[_0x119628]);
      return "<article class=\"story-replication-upload-item workspace-video-import-item\" data-replication-source-key=\"" + escapeHtml(_0x3150e6 || _0x589e69 + ':' + _0x1c349d["size"] + ':' + _0x1c349d["lastModified"]) + "\">\n              <button type=\"button\" class=\"story-replication-upload-thumbnail workspace-video-import-thumbnail\" data-story-action=\"choose-replication-videos\" aria-label=\"" + escapeHtml(_0x589e69) + "，点击继续上传参考视频\">\n                " + (_0x3150e6 ? "<video src=\"" + escapeHtml(_0x3150e6) + "\" preload=\"metadata\" muted playsinline aria-label=\"" + escapeHtml(_0x589e69) + " 视频缩略图\" draggable=\"false\"></video>" : "<span class=\"workspace-video-import-placeholder\">" + renderStoryReplicationVideoIcon() + "</span>") + "\n              </button>\n              <button type=\"button\" class=\"story-replication-upload-remove workspace-video-import-remove\" data-story-action=\"remove-replication-video\" data-story-replication-file-index=\"" + _0x119628 + "\" aria-label=\"移除 " + escapeHtml(_0x589e69) + "\">×</button>\n              <div class=\"workspace-video-import-copy\"><strong>" + escapeHtml(_0x589e69) + "</strong></div>\n            </article>";
    })["join"]('') + "\n        </div>";
    return "<div class=\"story-home-composer-panel story-upload-drop workspace-video-import-panel story-replication-upload " + (_0x1a3493["length"] ? "has-sources" : '') + "\" data-story-replication-drop>\n      " + _0x1b9b9f + "\n      <div class=\"story-replication-upload-empty\" " + (_0x1a3493["length"] ? "hidden" : '') + ">\n        <strong>上传原视频，复刻原剧情</strong>\n        <p>支持多选 MP4、MOV、AVI，每条不超过 50MB。</p>\n        <div class=\"story-upload-actions\"><button type=\"button\" class=\"story-secondary-button\" data-story-action=\"choose-replication-videos\">选择视频</button></div>\n      </div>\n    </div>";
  }
  if (_0xfaa8a["homeTab"] === "generate") {
    const _0x3c718e = hasStoryHomeReferenceScript(_0xfaa8a);
    const _0x143ad0 = normalizeText(_0xfaa8a["scriptFileName"]);
    const _0x193203 = _0x3c718e ? '描述你希望如何改写这份剧本，例如：改成海外爆款短剧风格，强化冲突与集尾钩子。' : "输入你想创作的剧本内容，或上传参考剧本进行改编……";
    return '<div\x20class=\x22story-home-composer-panel\x20story-home-input-wrap\x20story-home-story-input\x20story-home-creation-input\x20' + (_0x3c718e ? "has-reference-script" : '') + '\x22\x20data-story-rewrite-drop>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-home-reference-source\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22story-home-reference-upload\x22\x20data-story-action=\x22choose-rewrite-script\x22\x20aria-label=\x22' + (_0x3c718e ? "替换参考剧本（改写模式）" : "上传参考剧本") + '\x22\x20' + (_0xfaa8a["isParsingDocument"] ? 'disabled' : '') + " aria-busy=\"" + Boolean(_0xfaa8a["isParsingDocument"]) + "\">\n          <span class=\"story-home-reference-upload-icon\" aria-hidden=\"true\">" + (_0xfaa8a["isParsingDocument"] ? renderStoryGenerationSpinner({
      'button': !![]
    }) : "<span class=\"story-home-reference-document-icon\"></span><span class=\"story-home-reference-add-icon\"></span><span class=\"story-home-reference-extension\">" + escapeHtml(getStoryDocumentExtension(_0x143ad0)) + '</span>') + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (_0xfaa8a['isParsingDocument'] ? "<span class=\"story-home-reference-status\">解析中</span>" : '') + "\n        </button>\n        " + (_0x3c718e ? "<span class=\"story-home-reference-file-name\">" + escapeHtml(_0x143ad0) + "</span>\n          <button type=\"button\" class=\"story-home-reference-remove\" data-story-action=\"remove-rewrite-script\" aria-label=\"移除参考剧本\">×</button>" : '') + "\n      </div>\n      <div class=\"story-home-creation-copy\">\n        <label for=\"storyIdeaInput\">" + (_0x3c718e ? "填写改写要求" : "输入故事设定") + "</label>\n        <textarea id=\"storyIdeaInput\" data-story-idea-input maxlength=\"" + STORY_IDEA_MAX_CHARACTERS + "\" placeholder=\"" + _0x193203 + '\x22>' + escapeHtml(_0xfaa8a["idea"]) + "</textarea>\n        <div class=\"story-home-input-meta\">\n          <p data-story-script-mode-hint>" + (_0x3c718e ? STORY_HOME_REWRITE_SOURCE_HINT : escapeHtml(getStoryScriptModeHint(_0xfaa8a["scriptMode"]))) + "</p>\n          <span data-story-idea-count>" + _0xfaa8a["idea"]["length"] + " / " + STORY_IDEA_MAX_CHARACTERS + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20</div>';
  }
  if (_0xfaa8a["uploadInputMode"] === "paste") {
    return '<div\x20class=\x22story-home-composer-panel\x20story-home-input-wrap\x20story-home-story-input\x20story-home-paste-input\x22\x20data-story-script-drop>\x0a\x20\x20\x20\x20\x20\x20<label\x20for=\x22storyPasteInput\x22>粘贴剧本文本</label>\x0a\x20\x20\x20\x20\x20\x20<textarea\x20id=\x22storyPasteInput\x22\x20data-story-paste-input\x20maxlength=\x22' + STORY_SCRIPT_MAX_CHARACTERS + '\x22\x20placeholder=\x22在这里粘贴完整剧本……\x22>' + escapeHtml(_0xfaa8a["scriptText"]) + "</textarea>\n      <div class=\"story-home-input-meta\">\n        <p>支持最多 " + STORY_SCRIPT_MAX_CHARACTERS + " 字，将按原稿导入，不扩写、不重新分集。</p>\n        <span data-story-paste-count>" + _0xfaa8a["scriptText"]["length"] + " / " + STORY_SCRIPT_MAX_CHARACTERS + "</span>\n      </div>\n      <div class=\"story-upload-actions\">\n        <button type=\"button\" class=\"story-secondary-button button-press-feedback\" data-story-action=\"choose-script\"><span>上传剧本</span></button>\n        <button type=\"button\" class=\"story-secondary-button button-press-feedback is-active\" data-story-action=\"paste-script\" aria-pressed=\"true\"><span>粘贴文本</span></button>\n      </div>\n    </div>";
  }
  return "<div class=\"story-home-composer-panel story-upload-drop\" data-story-script-drop>\n    <strong>" + (_0xfaa8a["isParsingDocument"] ? "正在解析文档…" : _0xfaa8a["scriptFileName"] ? escapeHtml(_0xfaa8a["scriptFileName"]) : "上传剧本文件") + "</strong>\n    <p>" + (_0xfaa8a["scriptFileName"] ? "剧本已就绪，将按原稿结构导入并直接提取素材。" : '支持\x20TXT、Markdown、DOCX、文本型\x20PDF，文本内容不超过\x20' + STORY_SCRIPT_MAX_CHARACTERS + " 字。") + "</p>\n    <div class=\"story-upload-actions\">\n      <button type=\"button\" class=\"story-secondary-button button-press-feedback\" data-story-action=\"choose-script\" " + (_0xfaa8a['isParsingDocument'] ? "disabled" : '') + " aria-busy=\"" + Boolean(_0xfaa8a["isParsingDocument"]) + '\x22>' + (_0xfaa8a["isParsingDocument"] ? renderStoryGenerationSpinner({
    'button': !![]
  }) : '') + "<span>" + (_0xfaa8a["isParsingDocument"] ? "解析中" : '上传剧本') + "</span></button>\n      <button type=\"button\" class=\"story-secondary-button button-press-feedback\" data-story-action=\"paste-script\" aria-pressed=\"false\"><span>粘贴文本</span></button>\n    </div>\n  </div>";
}
export function renderStoryScriptModeControl(_0x208bc7 = "plot", {
  hidden = ![]
} = {}) {
  const _0x501657 = normalizeStoryScriptMode(_0x208bc7);
  const _0x126272 = _0x501657 === "narration" ? "解说模式" : "剧情模式";
  const _0x457fed = _0x501657 === "narration" ? "剧情模式" : "解说模式";
  return "<button type=\"button\" class=\"story-home-param-trigger story-script-mode-toggle " + (_0x501657 === "narration" ? 'is-narration' : '') + "\" data-story-script-mode-control data-story-script-mode=\"" + _0x501657 + "\" aria-pressed=\"" + (_0x501657 === 'narration') + "\" aria-label=\"当前" + _0x126272 + "，点击切换为" + _0x457fed + '\x22\x20' + (hidden ? "hidden" : '') + ">\n    <span class=\"story-home-param-icon story-script-mode-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 7h10l-2.5-2.5M17 17H7l2.5 2.5\"/><path d=\"M17 7l-2.5 2.5M7 17l2.5-2.5\"/></svg></span>\n    <span data-story-script-mode-label>" + _0x126272 + '</span>\x0a\x20\x20</button>';
}
export function getStoryHomeGenerateButtonLabel(_0x4266f1) {
  if (_0x4266f1["homeTab"] === "collaborate") {
    return "开始协作";
  }
  if (_0x4266f1["isGeneratingStory"]) {
    return _0x4266f1["generationStatus"] || "正在创建剧情";
  }
  if (_0x4266f1["homeTab"] === "replication") {
    return "导入视频";
  }
  if (_0x4266f1["homeTab"] === "upload") {
    return "导入剧本";
  }
  if (hasStoryHomeReferenceScript(_0x4266f1)) {
    return '开始改写';
  }
  return '生成剧本';
}
export function renderStoryHomeParamChevron() {
  return '<svg\x20width=\x2210\x22\x20height=\x2210\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20class=\x22story-home-param-chevron\x20node-menu-caret\x22\x20aria-hidden=\x22true\x22><polyline\x20points=\x226\x209\x2012\x2015\x2018\x209\x22></polyline></svg>';
}
function renderStoryAspectRatioPicker(_0x41eb18, {
  placement = "above",
  compact = ![]
} = {}) {
  const _0x19a872 = normalizeStoryAspectRatio(_0x41eb18["data"]?.["project"]?.["aspectRatio"]);
  const _0x4d85a1 = placement === "below" ? '\x20story-ratio-picker--below' : '';
  const _0x285043 = compact ? " story-home-param-picker--compact" : '';
  return "<div class=\"story-home-param-picker story-ratio-picker" + _0x4d85a1 + _0x285043 + "\">\n    <button type=\"button\" class=\"story-home-param-trigger story-menu-trigger\" data-story-home-param-trigger=\"ratio\" aria-haspopup=\"listbox\" aria-expanded=\"false\">\n      <span class=\"story-home-param-icon\" aria-hidden=\"true\">▭</span>\n      <span>" + escapeHtml(_0x19a872) + "</span>\n      " + renderStoryHomeParamChevron() + "\n    </button>\n    <div class=\"story-home-param-popover story-ratio-popover\" role=\"listbox\" aria-label=\"画面比例\">\n      <strong>画面比例</strong>\n      <div class=\"story-ratio-options\">\n        " + STORY_ASPECT_RATIO_OPTIONS["map"](_0x430e5e => "<button type=\"button\" class=\"story-ratio-option " + (_0x430e5e["value"] === _0x19a872 ? "is-selected" : '') + "\" data-story-aspect-ratio-option=\"" + escapeHtml(_0x430e5e["value"]) + "\" role=\"option\" aria-selected=\"" + (_0x430e5e['value'] === _0x19a872) + '\x22>' + escapeHtml(_0x430e5e["selectedLabel"] || _0x430e5e["label"]) + "</button>")["join"]('') + '\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20</div>\x0a\x20\x20</div>';
}
function renderStoryPlanningPicker({
  field: _0xacb3b5,
  label: _0x4212a4,
  icon: _0x154cc5,
  value: _0x519068,
  options: _0x3d97c9,
  disabledOptions = [],
  customOption = null,
  formatOption: _0x168727,
  singleColumn = ![],
  hidden = ![]
} = {}) {
  const _0xf57287 = new Set(disabledOptions);
  return "<div class=\"story-home-param-picker story-ratio-picker story-planning-picker\" data-story-planning-picker=\"" + escapeHtml(_0xacb3b5) + '\x22\x20' + (hidden ? "hidden" : '') + ">\n    <button type=\"button\" class=\"story-home-param-trigger story-menu-trigger\" data-story-home-param-trigger=\"" + escapeHtml(_0xacb3b5) + "\" aria-haspopup=\"listbox\" aria-expanded=\"false\">\n      <span class=\"story-home-param-icon\" aria-hidden=\"true\">" + escapeHtml(_0x154cc5) + "</span>\n      <span data-story-planning-trigger-label>" + escapeHtml(_0x168727(_0x519068)) + "</span>\n      " + renderStoryHomeParamChevron() + "\n    </button>\n    <div class=\"story-home-param-popover story-ratio-popover story-planning-popover\" role=\"listbox\" aria-label=\"" + escapeHtml(_0x4212a4) + "\">\n      <strong>" + escapeHtml(_0x4212a4) + '</strong>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-ratio-options\x20story-planning-options' + (singleColumn ? " story-planning-options--single-column" : '') + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + _0x3d97c9["map"](_0x5cfba4 => {
    const _0x43783c = _0xf57287["has"](_0x5cfba4);
    return "<button type=\"button\" class=\"story-ratio-option " + (_0x5cfba4 === _0x519068 ? 'is-selected' : '') + '\x20' + (_0x43783c ? "is-disabled" : '') + "\" data-story-planning-field=\"" + escapeHtml(_0xacb3b5) + "\" data-story-planning-option=\"" + _0x5cfba4 + '\x22\x20role=\x22option\x22\x20aria-selected=\x22' + (_0x5cfba4 === _0x519068) + '\x22\x20aria-disabled=\x22' + _0x43783c + '\x22\x20' + (_0x43783c ? "disabled" : '') + '>' + escapeHtml(_0x168727(_0x5cfba4)) + "</button>";
  })["join"]('') + "\n        " + (customOption?.["visible"] ? "<label class=\"story-ratio-option story-episode-count-custom-editor " + (customOption["selected"] ? "is-selected" : '') + "\" data-story-custom-episode-count role=\"option\" aria-selected=\"" + customOption["selected"] + "\" aria-label=\"自定义分集数，最多 " + STORY_EPISODE_COUNT_MAX + '\x20集\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<input\x20type=\x22number\x22\x20min=\x221\x22\x20max=\x22' + STORY_EPISODE_COUNT_MAX + '\x22\x20step=\x221\x22\x20inputmode=\x22numeric\x22\x20autocomplete=\x22off\x22\x20data-story-custom-episode-count-input\x20aria-label=\x22输入自定义分集数，1\x20到\x20' + STORY_EPISODE_COUNT_MAX + " 集\" placeholder=\"输入集数\" value=\"" + (customOption["selected"] ? escapeHtml(_0x519068) : '') + "\">\n          <span>集</span>\n        </label>" : '') + "\n      </div>\n    </div>\n  </div>";
}
function renderStoryStylePicker(_0x3e0bfb, {
  placement = 'overlay',
  compact = ![]
} = {}) {
  const _0x5d0eec = _0x3e0bfb['data']?.["project"] || {};
  const _0x17d85d = resolveStoryStyleSelection({
    'styleId': _0x5d0eec["videoStyleId"],
    'stylePrompt': _0x5d0eec['videoStylePrompt'],
    'videoStyle': _0x5d0eec["videoStyle"]
  });
  const _0x2a0a17 = _0x17d85d['isCustom'] ? _0x17d85d["stylePrompt"] : normalizeText(_0x5d0eec["customVideoStylePrompt"]);
  const _0x47fb40 = placement === "below" ? " story-style-picker--below" : '';
  const _0x2c1cc6 = compact ? " story-home-param-picker--compact" : '';
  return "<div class=\"story-home-param-picker story-style-picker" + _0x47fb40 + _0x2c1cc6 + "\">\n    <button type=\"button\" class=\"story-home-param-trigger story-menu-trigger story-style-trigger\" data-story-home-param-trigger=\"style\" aria-haspopup=\"dialog\" aria-expanded=\"false\">\n      " + (_0x17d85d["thumbnail"] ? "<img src=\"" + escapeHtml(_0x17d85d["thumbnail"]) + "\" alt=\"\" draggable=\"false\">" : "<span class=\"story-home-param-icon story-style-custom-icon\" aria-hidden=\"true\">✦</span>") + "\n      <span class=\"story-style-trigger-label\">" + escapeHtml(_0x17d85d['label']) + "</span>\n      " + renderStoryHomeParamChevron() + "\n    </button>\n    <section class=\"story-home-param-popover story-style-popover\" role=\"dialog\" aria-label=\"风格库\">\n      <div class=\"story-style-library\" data-story-style-library>\n        <div class=\"story-style-header\">\n          <div>\n            <strong>风格库</strong>\n            <small>为后续角色、场景、道具和分集画面统一视觉方向</small>\n          </div>\n          <label class=\"story-style-search\">\n            <span aria-hidden=\"true\">⌕</span>\n            <input type=\"search\" data-story-style-search-input placeholder=\"搜索风格\" autocomplete=\"off\">\n          </label>\n        </div>\n        <div class=\"story-style-tabs\" role=\"tablist\">\n          " + STORY_STYLE_CATEGORIES['map'](_0x9ecac => '<button\x20type=\x22button\x22\x20class=\x22story-style-tab\x20' + (_0x9ecac['id'] === "all" ? 'is-active' : '') + "\" data-story-style-category=\"" + _0x9ecac['id'] + "\" role=\"tab\" aria-selected=\"" + (_0x9ecac['id'] === 'all') + '\x22>' + _0x9ecac['label'] + "</button>")["join"]('') + "\n        </div>\n        <div class=\"story-style-grid\" data-story-style-grid>\n          <button type=\"button\" class=\"story-style-card story-style-card--custom " + (_0x17d85d["isCustom"] ? "is-selected" : '') + "\" data-story-style-custom data-story-style-search=\"自定义风格提示词\" data-story-style-card-category=\"custom\">\n            <span class=\"story-style-custom-mark\" aria-hidden=\"true\">✦</span>\n            <span>自定义风格提示词</span>\n          </button>\n          " + STORY_STYLE_PRESETS["map"](_0x4c3e41 => "<button type=\"button\" class=\"story-style-card " + (_0x4c3e41['id'] === _0x17d85d["styleId"] ? 'is-selected' : '') + "\" data-story-style-option=\"" + escapeHtml(_0x4c3e41['id']) + "\" data-story-style-search=\"" + escapeHtml(_0x4c3e41['label']["toLowerCase"]()) + '\x22\x20data-story-style-card-category=\x22' + escapeHtml(_0x4c3e41["category"]) + "\">\n            <img src=\"" + escapeHtml(_0x4c3e41["thumbnail"]) + '\x22\x20alt=\x22\x22\x20loading=\x22lazy\x22\x20decoding=\x22async\x22\x20draggable=\x22false\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span>' + escapeHtml(_0x4c3e41["label"]) + "</span>\n          </button>")["join"]('') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<p\x20class=\x22story-style-empty\x22\x20data-story-style-empty\x20hidden>没有匹配的风格</p>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-style-custom-editor\x22\x20data-story-style-custom-editor\x20hidden>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-style-custom-editor-heading\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20data-story-style-custom-back\x20aria-label=\x22返回风格库\x22>←</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>自定义风格提示词</strong>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<small>描述画面媒介、光线、色调、质感与时代气质</small>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<textarea\x20data-story-style-custom-input\x20maxlength=\x22' + STORY_CUSTOM_STYLE_MAX_CHARACTERS + "\" placeholder=\"例如：真人写实，90 年代港片胶片质感，暖黄色街灯，低饱和色调\">" + escapeHtml(_0x2a0a17) + "</textarea>\n        <div class=\"story-style-custom-footer\">\n          <span data-story-style-custom-count>" + _0x2a0a17['length'] + " / " + STORY_CUSTOM_STYLE_MAX_CHARACTERS + "</span>\n          <button type=\"button\" class=\"story-style-custom-confirm\" data-story-style-custom-confirm aria-label=\"确认自定义风格\">✓</button>\n        </div>\n      </div>\n    </section>\n  </div>";
}
function renderStoryHomeEmptyIcon() {
  return '<span\x20class=\x22workspace-mode-icon\x20workspace-mode-icon--story\x22\x20aria-hidden=\x22true\x22><svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22><path\x20d=\x22M7\x203.75h8.5L19\x207.25v13H7z\x22/><path\x20d=\x22M15.5\x203.75v3.5H19M10\x2011h6M10\x2014.5h6M10\x2018h4\x22/></svg></span>';
}
export function renderStoryHomeModelBar(_0x175bef) {
  const _0x5da6bb = _0x175bef["data"]?.['project']?.["planning"] || {};
  const _0x2edfa9 = normalizeStoryEpisodeCount(_0x5da6bb["episodeCount"]);
  const _0x3a5731 = normalizeStoryPromptMode(_0x5da6bb["promptMode"], {
    'allowDeveloperModes': _0x175bef["developerModeAvailable"] === !![]
  });
  const _0x4e4318 = _0x175bef["homeTab"] === "collaborate" ? Boolean(_0x175bef["idea"]?.["trim"]()) : canStartStoryHomeGeneration(_0x175bef);
  const _0x26c390 = getStoryVideoInputTextModelOptions()['map'](_0x1c3fb9 => _0x1c3fb9["modelId"]);
  const _0x4827dc = _0x175bef['homeTab'] === "replication" && !_0x26c390["includes"](_0x175bef['models']['text']) ? _0x26c390[0x0] || _0x175bef["models"]["text"] : _0x175bef['models']["text"];
  const _0x4111f2 = getStoryReplicationLocale(_0x175bef["hasCreatedProject"] && _0x175bef["data"]?.["project"]?.["sourceMode"] === 'video-replication' ? _0x175bef["data"]["project"]["replication"]?.["targetLocale"] : _0x175bef["replicationTargetLocale"]);
  return '<div\x20class=\x22story-home-model-bar\x22>\x0a\x20\x20\x20\x20<div\x20class=\x22story-home-model-controls\x22>\x0a\x20\x20\x20\x20\x20\x20' + renderAIGenTextModelSelectorMarkup({
    'modelId': _0x4827dc,
    'provider': _0x175bef["textProvider"],
    'providerProfileId': _0x175bef['textProviderProfileId'],
    'includeRunningHubInternational': !![],
    'getDisplayModelName': getDisplayModelName,
    'className': 'story-home-text-model-selector',
    'allowedModelIds': _0x175bef['homeTab'] === "replication" ? _0x26c390 : undefined
  }) + "\n      " + (_0x175bef["homeTab"] === "replication" ? '' : renderStoryStylePicker(_0x175bef)) + "\n      " + renderStoryPlanningPicker({
    'field': "promptMode",
    'label': "单片段提示词模式",
    'icon': '✦',
    'value': _0x3a5731,
    'options': STORY_PROMPT_MODE_OPTIONS["map"](_0x47c974 => _0x47c974["value"]),
    'disabledOptions': STORY_PROMPT_MODE_OPTIONS['filter'](_0x9c94b4 => !_0x9c94b4["enabled"] && !_0x175bef["developerModeAvailable"])["map"](_0x39ad00 => _0x39ad00["value"]),
    'formatOption': getStoryPromptModeLabel,
    'singleColumn': !![],
    'hidden': ![]
  }) + "\n      " + renderStoryPlanningPicker({
    'field': 'targetLocale',
    'label': '语种与地区',
    'icon': '文',
    'value': _0x4111f2["value"],
    'options': STORY_REPLICATION_LOCALES['map'](_0x330610 => _0x330610["value"]),
    'formatOption': _0x44e4f1 => getStoryReplicationLocale(_0x44e4f1)['shortLabel'],
    'hidden': _0x175bef["homeTab"] !== "replication"
  }) + "\n      " + renderStoryPlanningPicker({
    'field': "episodeCount",
    'label': "目标分集数",
    'icon': '≡',
    'value': _0x2edfa9,
    'options': _0x175bef["developerModeAvailable"] ? [...STORY_PUBLIC_EPISODE_COUNT_OPTIONS, ...STORY_DEVELOPER_EPISODE_COUNT_OPTIONS] : STORY_PUBLIC_EPISODE_COUNT_OPTIONS,
    'customOption': {
      'visible': _0x175bef["developerModeAvailable"] === !![],
      'selected': !STORY_EPISODE_COUNT_OPTIONS["includes"](_0x2edfa9)
    },
    'formatOption': _0x107db0 => _0x107db0 + '集',
    'singleColumn': !![],
    'hidden': !["generate", "collaborate"]['includes'](_0x175bef["homeTab"])
  }) + "\n      " + renderStoryScriptModeControl(_0x175bef['scriptMode'], {
    'hidden': !['generate', "collaborate"]["includes"](_0x175bef["homeTab"])
  }) + '\x0a\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20' + (["replication", "collaborate"]["includes"](_0x175bef["homeTab"]) ? '' : renderRequestDebugButton("data-story-action=\"debug-story-home\"")) + "<button type=\"button\" class=\"story-primary-button story-home-generate story-main-action-button\" " + (_0x175bef["homeTab"] === "collaborate" ? "data-collaboration-start" : "data-story-action=\"generate-story\"") + '\x20' + (_0x4e4318 && !_0x175bef["isGeneratingStory"] ? '' : 'disabled') + " aria-busy=\"" + Boolean(_0x175bef["isGeneratingStory"]) + '\x22>' + (_0x175bef["isGeneratingStory"] ? renderStoryGenerationSpinner({
    'button': !![]
  }) : '') + '<span\x20data-story-generate-label>' + escapeHtml(getStoryHomeGenerateButtonLabel(_0x175bef)) + "</span>" + (_0x175bef['isGeneratingStory'] ? '' : "<span class=\"story-generate-arrow\" aria-hidden=\"true\">→</span>") + '</button>\x0a\x20\x20</div>';
}
export function renderStoryHomeProjectResults(_0xfd6ea7) {
  _0xfd6ea7 = {
    ..._0xfd6ea7,
    'projects': getStorySurfaceProjects(_0xfd6ea7)
  };
  const _0x2ce27d = _0xfd6ea7["workspaceSurface"] === "replication" ? "复刻项目" : "剧本项目";
  const _0x462425 = _0xfd6ea7['showArchivedProjects'] === !![];
  const _0x5e8384 = getStoryProjectHomeEntries(_0xfd6ea7["projects"], {
    'query': _0xfd6ea7["projectSearchQuery"],
    'sortOrder': _0xfd6ea7["projectSortOrder"],
    'showArchived': _0x462425
  });
  return _0xfd6ea7["projects"]["length"] ? "<div class=\"story-project-grid\">\n        " + _0x5e8384["map"](_0x2b9e05 => renderStoryProjectCard(_0x2b9e05, {
    'itemLabel': _0xfd6ea7["workspaceSurface"] === 'replication' ? "条视频" : '集',
    'isDeleteConfirming': normalizeText(_0xfd6ea7["pendingDeleteProjectId"]) === normalizeText(_0x2b9e05?.['id'] || _0x2b9e05?.['data']?.["project"]?.['id']),
    'isMenuOpen': normalizeText(_0xfd6ea7['openProjectMenuId']) === normalizeText(_0x2b9e05?.['id'] || _0x2b9e05?.["data"]?.["project"]?.['id'])
  }))["join"]('') + "\n        " + (_0x5e8384['length'] ? '' : "<div class=\"story-project-filter-empty\"><strong>" + (_0x462425 ? "没有匹配的归档项目" : '没有匹配的' + _0x2ce27d) + '</strong><span>可以尝试其他搜索词，或清空搜索条件。</span></div>') + "\n        " + (_0x462425 ? '' : "<button type=\"button\" class=\"story-project-create-tile\" data-story-action=\"new-story\" aria-label=\"新建" + _0x2ce27d + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20aria-hidden=\x22true\x22>+</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>新建' + _0x2ce27d + "</strong>\n        </button>") + "\n      </div>" : '<div\x20class=\x22story-project-empty\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-project-empty-icon\x22\x20aria-hidden=\x22true\x22>' + renderStoryHomeEmptyIcon() + "</div>\n        <strong>还没有" + _0x2ce27d + "</strong>\n        <span>创建项目后，它会保存在当前用户项目数据中。</span>\n        <button type=\"button\" class=\"story-primary-button story-project-empty-action\" data-story-action=\"new-story\">创建第一个项目</button>\n      </div>";
}
export function renderStoryHome(_0x2bc38c) {
  _0x2bc38c = {
    ..._0x2bc38c,
    'projects': getStorySurfaceProjects(_0x2bc38c)
  };
  const _0x6dd98f = {
    ..._0x2bc38c,
    'homeTab': resolveStoryVideoReplicationHomeTab(_0x2bc38c, _0x2bc38c["homeTab"])
  };
  const _0x186481 = _0x2bc38c["showArchivedProjects"] === !![];
  const _0x25198c = _0x2bc38c["projects"]["filter"](_0x20488b => Number(_0x20488b?.["archivedAt"] || 0x0) > 0x0)["length"];
  return '<div\x20class=\x22story-home-page' + (_0x6dd98f["homeTab"] === "replication" ? " story-home-page--replication" : '') + '\x22>\x0a\x20\x20\x20\x20<section\x20class=\x22story-home-hero\x22>\x0a\x20\x20\x20\x20\x20\x20<span\x20class=\x22story-eyebrow\x22>Canvas\x20AI\x20·\x20' + (_0x2bc38c['workspaceSurface'] === "replication" ? "Replication Studio" : "Story Studio") + "</span>\n      <h1>" + (_0x2bc38c['workspaceSurface'] === "replication" ? "复刻工作室" : "从一个想法到完整的AI视频") + '</h1>\x0a\x20\x20\x20\x20\x20\x20' + (_0x2bc38c["workspaceSurface"] === "replication" ? '' : "<p class=\"story-home-mode-description\" data-story-home-mode-description aria-live=\"polite\">" + escapeHtml(getStoryHomeModeDescription(_0x6dd98f["homeTab"])) + "</p>") + '\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-home-composer\x20' + (_0x2bc38c["isGeneratingStory"] ? "is-generating" : '') + "\" aria-busy=\"" + (_0x2bc38c["isGeneratingStory"] ? "true" : "false") + "\">\n        " + renderHomeTabs(_0x6dd98f) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-home-composer-body\x22>' + renderStoryHomeComposerBody(_0x6dd98f) + "</div>\n        " + renderStoryHomeModelBar(_0x6dd98f) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-home-generation-loading\x20storyboard-script-loading-overlay\x22\x20data-story-generation-loading\x20role=\x22status\x22\x20aria-live=\x22polite\x22\x20' + (_0x2bc38c["isGeneratingStory"] ? '' : 'hidden') + ">\n          <div class=\"storyboard-script-loading-spinner\"></div>\n          <div class=\"storyboard-script-loading-label\" data-story-generation-loading-label>" + escapeHtml(_0x2bc38c["generationStatus"] || "正在创建剧情") + "</div>\n          <div class=\"storyboard-script-loading-bar\"><div class=\"storyboard-script-loading-bar-fill\"></div></div>\n        </div>\n      </div>\n    </section>\n    <section class=\"story-projects-section\">\n      <div class=\"story-section-heading\">\n        <div>\n          <h2>" + (_0x186481 ? "已归档项目" : _0x2bc38c["workspaceSurface"] === 'replication' ? "我的复刻项目" : "我的剧本项目") + "</h2>\n        </div>\n        <div class=\"story-project-list-controls\">\n          <button type=\"button\" class=\"story-project-import-button\" data-story-action=\"import-project\">导入项目</button>\n          <label class=\"story-project-search\">\n            <span aria-hidden=\"true\">⌕</span>\n            <input type=\"search\" data-story-project-search value=\"" + escapeHtml(_0x2bc38c["projectSearchQuery"] || '') + "\" placeholder=\"搜索项目名称\" autocomplete=\"off\" aria-label=\"搜索" + (_0x2bc38c['workspaceSurface'] === 'replication' ? "复刻项目" : '剧本项目') + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</label>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + renderStoryProjectSortControl(_0x2bc38c["projectSortOrder"]) + "\n          <button type=\"button\" class=\"story-project-archive-toggle " + (_0x186481 ? "is-active" : '') + '\x22\x20data-story-action=\x22toggle-archived-projects\x22\x20aria-pressed=\x22' + _0x186481 + '\x22>' + (_0x186481 ? '返回项目' : "已归档 " + _0x25198c) + '</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20' + renderStoryHomeProjectResults(_0x2bc38c) + '\x0a\x20\x20\x20\x20</section>\x0a\x20\x20</div>';
}
export function renderStoryProjectSortControl(_0x53d274 = "updated-desc") {
  return renderWorkspaceProjectSortControl(_0x53d274);
}
export function getStoryProjectTypeLabel(_0x49039e = {}) {
  const _0xa15f4c = normalizeText(_0x49039e?.["data"]?.["project"]?.["sourceMode"]);
  if (_0xa15f4c === "upload-original") {
    return "个人剧本";
  }
  if (_0xa15f4c === 'upload-rewrite') {
    return "AI改写";
  }
  if (_0xa15f4c === "video-replication") {
    return "复刻视频";
  }
  return "AI剧本";
}
export function renderStoryProjectCard(_0x2a4dfe, {
  isDeleteConfirming = ![],
  isMenuOpen = ![],
  fallbackTitle = "未命名故事",
  itemCount = null,
  itemLabel = '集',
  coverImageUrls = null,
  emptyCoverLabel = "剧本项目",
  coverAltPrefix = "项目角色封面"
} = {}) {
  const _0x274066 = Array['isArray'](_0x2a4dfe?.["data"]?.["episodes"]) ? _0x2a4dfe["data"]["episodes"]['length'] : 0x0;
  const _0x3c8c5c = itemCount !== null && itemCount !== undefined && Number["isFinite"](Number(itemCount)) ? Math['max'](0x0, Math["trunc"](Number(itemCount))) : _0x274066;
  const _0x509145 = getStoryBackgroundTaskSummary(_0x2a4dfe?.["data"]);
  return renderWorkspaceProjectCard(_0x2a4dfe, {
    'isDeleteConfirming': isDeleteConfirming,
    'isMenuOpen': isMenuOpen,
    'fallbackTitle': fallbackTitle,
    'itemCount': _0x3c8c5c,
    'itemLabel': itemLabel,
    'coverImageUrls': resolveStoryProjectCoverImageUrls(_0x2a4dfe, coverImageUrls),
    'emptyCoverLabel': emptyCoverLabel,
    'coverAltPrefix': coverAltPrefix,
    'projectTypeLabel': getStoryProjectTypeLabel(_0x2a4dfe),
    'taskSummary': _0x509145
  });
}
function resolveStoryProjectCoverImageUrls(_0x19a889, _0x41db8d = null) {
  return (Array["isArray"](_0x41db8d) ? _0x41db8d : (Array["isArray"](_0x19a889?.["data"]?.["assets"]) ? _0x19a889["data"]["assets"] : [])['filter'](_0x352f65 => _0x352f65?.["kind"] === 'character')["flatMap"](_0x2daba5 => getStoryAssetAppearances(_0x2daba5))["map"](_0x427d93 => _0x427d93?.['imageUrl']))["map"](normalizeText)['filter']((_0x1834de, _0xa30640, _0x22178d) => _0x1834de && _0x22178d["indexOf"](_0x1834de) === _0xa30640)['slice'](0x0, 0x3);
}