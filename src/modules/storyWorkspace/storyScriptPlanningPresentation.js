import { renderRequestDebugButton } from '../debugRequestWindow.js';
function escapeHtml(_0x368353) {
  return String(_0x368353 ?? '')['replaceAll']('&', "&amp;")['replaceAll']('<', "&lt;")['replaceAll']('>', "&gt;")["replaceAll"]('\x22', '&quot;')["replaceAll"]('\x27', "&#39;");
}
function normalizeText(_0x10c131) {
  return String(_0x10c131 ?? '')["trim"]();
}
const STORY_CONTRACT_FIELD_LABELS = Object["freeze"]({
  'protagonistGoal': "主角目标",
  'centralConflict': "核心冲突",
  'stakes': "失败代价",
  'progressionDriver': "推进动力",
  'constraints': "约束条件",
  'climax': "高潮事件",
  'ending': '明确结局'
});
function renderWorkflowLoading(_0x1666e8) {
  return "<div class=\"story-script-workflow-loading\" role=\"status\" aria-live=\"polite\">\n    <span class=\"storyboard-script-loading-spinner\" aria-hidden=\"true\"></span>\n    <span>" + escapeHtml(_0x1666e8) + "</span>\n  </div>";
}
function renderOutlineField(_0x188058, _0xd35c84, _0x644849, {
  singleLine = ![]
} = {}) {
  const _0x328d3b = singleLine ? "<input type=\"text\" value=\"" + escapeHtml(_0xd35c84 || '') + "\" data-story-outline-field=\"" + escapeHtml(_0x644849) + '\x22>' : "<textarea data-story-outline-field=\"" + escapeHtml(_0x644849) + '\x22>' + escapeHtml(_0xd35c84 || '') + '</textarea>';
  return "<label class=\"story-outline-field\"><span>" + escapeHtml(_0x188058) + '</span>' + _0x328d3b + "</label>";
}
function renderSummaryCharacterField(_0x56fa85, _0xb1371d, _0x676124, _0x4f05d4, {
  multiline = !![],
  value = _0x56fa85?.[_0x676124] || ''
} = {}) {
  const _0x158eb3 = 'data-story-summary-character-index=\x22' + _0xb1371d + "\" data-story-summary-character-field=\"" + escapeHtml(_0x676124) + '\x22\x20aria-label=\x22' + escapeHtml(_0x4f05d4) + '\x22';
  const _0x2255c5 = multiline ? "<textarea " + _0x158eb3 + '>' + escapeHtml(value) + "</textarea>" : '<input\x20type=\x22text\x22\x20value=\x22' + escapeHtml(value) + '\x22\x20' + _0x158eb3 + '>';
  return "<label><b>" + escapeHtml(_0x4f05d4) + "：</b>" + _0x2255c5 + "</label>";
}
function renderSummaryCharacters(_0x270d60 = []) {
  if (!_0x270d60["length"]) {
    return '';
  }
  return "<div class=\"story-summary-characters\">\n    <span class=\"story-summary-label\">人物小传</span>\n    " + _0x270d60["map"]((_0x1c2f9f, _0x22a9c3) => '<article\x20class=\x22story-summary-character\x22>\x0a\x20\x20\x20\x20\x20\x20<input\x20class=\x22story-summary-character-name\x22\x20type=\x22text\x22\x20value=\x22' + escapeHtml(_0x1c2f9f["name"] || '') + "\" placeholder=\"未命名角色\" data-story-summary-character-index=\"" + _0x22a9c3 + "\" data-story-summary-character-field=\"name\" aria-label=\"角色姓名\">\n      <div class=\"story-summary-character-fields\">\n        " + renderSummaryCharacterField(_0x1c2f9f, _0x22a9c3, "roleType", '角色类型', {
    'multiline': ![],
    'value': _0x1c2f9f["roleType"] || "其他角色"
  }) + "\n        " + renderSummaryCharacterField(_0x1c2f9f, _0x22a9c3, "fixedTraits", "剧情固定特征", {
    'value': _0x1c2f9f["fixedTraits"] || _0x1c2f9f["visualAppearance"] || ''
  }) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + renderSummaryCharacterField(_0x1c2f9f, _0x22a9c3, "coreTags", "核心标签", {
    'multiline': ![],
    'value': Array["isArray"](_0x1c2f9f["coreTags"]) ? _0x1c2f9f["coreTags"]['join']('、') : ''
  }) + "\n        " + renderSummaryCharacterField(_0x1c2f9f, _0x22a9c3, "profile", "身份背景") + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + renderSummaryCharacterField(_0x1c2f9f, _0x22a9c3, "motivation", "核心动机") + "\n        " + renderSummaryCharacterField(_0x1c2f9f, _0x22a9c3, 'personality', "性格特点") + "\n        " + renderSummaryCharacterField(_0x1c2f9f, _0x22a9c3, "relationships", "角色关系") + "\n        " + renderSummaryCharacterField(_0x1c2f9f, _0x22a9c3, 'arc', "成长弧线") + "\n      </div>\n    </article>")["join"]('') + "\n  </div>";
}
function renderStoryContract(_0x1a6a7c = {}) {
  return '<div\x20class=\x22story-summary-characters\x22>\x0a\x20\x20\x20\x20<span\x20class=\x22story-summary-label\x22>故事契约</span>\x0a\x20\x20\x20\x20<article\x20class=\x22story-summary-character\x22>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-summary-character-fields\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + Object["entries"](STORY_CONTRACT_FIELD_LABELS)["map"](([_0x2eae79, _0x78e412]) => "<label><b>" + escapeHtml(_0x78e412) + "：</b><textarea data-story-contract-field=\"" + escapeHtml(_0x2eae79) + '\x22>' + escapeHtml(_0x1a6a7c?.[_0x2eae79] || '') + "</textarea></label>")["join"]('') + "\n      </div>\n    </article>\n  </div>";
}
function renderPlotBeats(_0x1b8570 = []) {
  if (!Array["isArray"](_0x1b8570) || !_0x1b8570["length"]) {
    return '';
  }
  return "<div class=\"story-summary-characters\">\n    <span class=\"story-summary-label\">因果剧情节点</span>\n    " + _0x1b8570["map"]((_0x1e5d22, _0x1d76ad) => '<article\x20class=\x22story-summary-character\x22>\x0a\x20\x20\x20\x20\x20\x20<input\x20class=\x22story-summary-character-name\x22\x20type=\x22text\x22\x20value=\x22' + escapeHtml(_0x1e5d22?.["stage"] || '') + '\x22\x20data-story-plot-beat-index=\x22' + _0x1d76ad + '\x22\x20data-story-plot-beat-field=\x22stage\x22\x20aria-label=\x22剧情阶段\x22>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-summary-character-fields\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<label><b>关键事件：</b><textarea\x20data-story-plot-beat-index=\x22' + _0x1d76ad + "\" data-story-plot-beat-field=\"event\">" + escapeHtml(_0x1e5d22?.["event"] || '') + "</textarea></label>\n        <label><b>造成结果：</b><textarea data-story-plot-beat-index=\"" + _0x1d76ad + "\" data-story-plot-beat-field=\"consequence\">" + escapeHtml(_0x1e5d22?.["consequence"] || '') + "</textarea></label>\n      </div>\n    </article>")['join']('') + '\x0a\x20\x20</div>';
}
function renderContinuityFacts(_0x1d7e28 = []) {
  return '<label\x20class=\x22story-outline-field\x22>\x0a\x20\x20\x20\x20<span>连续性事实</span>\x0a\x20\x20\x20\x20<textarea\x20data-story-continuity-facts\x20placeholder=\x22每行一条，例如关系阶段、承诺、秘密、身份、线索、能力或物品归属\x22>' + escapeHtml((Array["isArray"](_0x1d7e28) ? _0x1d7e28 : [])['join']('\x0a')) + "</textarea>\n  </label>";
}
function renderSummary(_0xea009 = {}) {
  if (_0xea009['status'] === "generating") {
    return renderWorkflowLoading(_0xea009["loadingMessage"] || "正在根据原始创意生成剧本摘要...");
  }
  if (!normalizeText(_0xea009["synopsis"])) {
    return "<div class=\"story-inline-empty\">剧本摘要尚未生成。</div>";
  }
  return "<div class=\"story-summary-content\">\n    " + (_0xea009["isStale"] ? "<div class=\"story-inline-empty\">故事蓝图已修改，现有分集大纲和正文仍然保留；点击“重新运行”后更新下游内容。</div>" : '') + "\n    <div class=\"story-summary-meta-grid\">\n      <label><span>分集目标</span><strong>" + Math["max"](0x1, Math["trunc"](Number(_0xea009['episodeCount']) || 0x1)) + '\x20集</strong></label>\x0a\x20\x20\x20\x20\x20\x20<label><span>故事类型</span><input\x20type=\x22text\x22\x20value=\x22' + escapeHtml(_0xea009['storyType'] || '') + "\" data-story-outline-field=\"story-type\"></label>\n      <label><span>目标受众</span><input type=\"text\" value=\"" + escapeHtml(_0xea009["targetAudience"] || '') + "\" data-story-outline-field=\"story-target-audience\"></label>\n    </div>\n    " + renderOutlineField('一句话故事', _0xea009["logline"], "story-logline") + "\n    " + renderOutlineField("核心梗", _0xea009["coreHook"], "story-core-hook", {
    'singleLine': !![]
  }) + '\x0a\x20\x20\x20\x20' + renderOutlineField("故事梗概", _0xea009["synopsis"], "story-summary") + "\n    <div class=\"story-summary-secondary-fields\">\n      " + renderOutlineField('故事背景', _0xea009['background'], 'story-background') + '\x0a\x20\x20\x20\x20\x20\x20' + renderOutlineField("故事设定", _0xea009["setting"], "story-setting") + "\n    </div>\n    " + renderStoryContract(_0xea009['contract']) + "\n    " + renderPlotBeats(_0xea009["plotBeats"]) + '\x0a\x20\x20\x20\x20' + renderContinuityFacts(_0xea009["continuityFacts"]) + "\n    " + renderSummaryCharacters(_0xea009['characters']) + "\n  </div>";
}
function renderInlineRegenerationControl({
  target = '',
  prompt = '',
  confirmLabel = '',
  episodeId = '',
  placement = "heading",
  isConfirming = ![],
  disabled = ![]
} = {}) {
  const _0x42c7f7 = normalizeText(target);
  if (!_0x42c7f7) {
    return '';
  }
  const _0x1ee173 = escapeHtml(_0x42c7f7);
  const _0x3e9c4f = normalizeText(episodeId) ? " data-story-episode-id=\"" + escapeHtml(episodeId) + '\x22' : '';
  if (!isConfirming) {
    return "<span class=\"story-inline-regeneration-control is-" + escapeHtml(placement) + "\">\n      <button type=\"button\" class=\"story-inline-regeneration-button story-regenerate-button\" data-story-action=\"request-inline-regeneration\" data-story-regeneration-target=\"" + _0x1ee173 + '\x22' + _0x3e9c4f + " aria-label=\"" + escapeHtml(confirmLabel) + '\x22\x20' + (disabled ? 'disabled' : '') + '>' + escapeHtml(confirmLabel) + "</button>\n    </span>";
  }
  return "<span class=\"story-inline-regeneration-control is-" + escapeHtml(placement) + " is-confirming\" data-story-regeneration-confirm=\"" + _0x1ee173 + "\" role=\"group\" aria-label=\"" + escapeHtml(prompt) + '\x22>\x0a\x20\x20\x20\x20<span\x20class=\x22story-inline-regeneration-prompt\x22>' + escapeHtml(prompt) + "</span>\n    <button type=\"button\" class=\"story-inline-regeneration-button story-regenerate-button is-confirm\" data-story-action=\"confirm-inline-regeneration\" data-story-regeneration-target=\"" + _0x1ee173 + '\x22' + _0x3e9c4f + " aria-label=\"" + escapeHtml(confirmLabel) + '\x22\x20' + (disabled ? "disabled" : '') + ">确认</button>\n    <button type=\"button\" class=\"story-inline-regeneration-button story-regenerate-button is-cancel\" data-story-action=\"cancel-inline-regeneration\" aria-label=\"取消重新生成\">取消</button>\n  </span>";
}
function renderEpisodeScriptBody(_0x4bc0c1 = {}, _0x7ce5f4 = 0x1) {
  if (!_0x4bc0c1["scriptFullText"]) {
    return '';
  }
  return "<label class=\"story-episode-full-script\">\n    <span>完整分场剧本</span>\n    <textarea data-story-episode-script=\"" + escapeHtml(_0x4bc0c1['id']) + '\x22>' + escapeHtml(_0x4bc0c1["scriptFullText"]) + "</textarea>\n  </label>\n  " + (_0x4bc0c1["allowRegeneration"] ? "<div class=\"story-episode-completed-actions\">\n    " + renderInlineRegenerationControl({
    'target': "episode-script:" + _0x4bc0c1['id'],
    'prompt': "是否重新生成第 " + _0x7ce5f4 + " 集正文？本集及后续正文、素材将清空",
    'confirmLabel': '重新生成第\x20' + _0x7ce5f4 + " 集正文",
    'episodeId': _0x4bc0c1['id'],
    'placement': "episode",
    ..._0x4bc0c1["regeneration"]
  }) + '\x0a\x20\x20</div>' : '');
}
function renderEpisodeItem(_0x36b17c = {}) {
  const _0x3f826b = Math["max"](0x0, Math["trunc"](Number(_0x36b17c['index']) || 0x0));
  const _0xbd97e0 = Math['max'](0x1, Math["trunc"](Number(_0x36b17c["number"]) || _0x3f826b + 0x1));
  const _0x5dc478 = _0x36b17c["isGenerating"] ? {
    'className': "is-generating",
    'label': '正在生成'
  } : _0x36b17c["isComplete"] ? {
    'className': "is-complete",
    'label': "已生成"
  } : null;
  const _0x5e17cf = _0x36b17c['canSelect'] ? " data-story-select-script-episode=\"" + escapeHtml(_0x36b17c['id']) + '\x22' : '';
  return "<details class=\"story-episode-outline-item " + (_0x36b17c["isComplete"] ? 'is-complete' : "is-pending") + "\" data-story-outline-section=\"episode-" + escapeHtml(_0x36b17c['id']) + '\x22\x20' + (_0x36b17c["isOpen"] ? "open" : '') + '>\x0a\x20\x20\x20\x20<summary' + _0x5e17cf + ">\n      " + (_0x36b17c["selectionMode"] && !_0x36b17c['isComplete'] ? "<button type=\"button\" class=\"story-script-select " + (_0x36b17c["isSelected"] ? "is-selected" : '') + "\" data-story-action=\"select-script-episode\" data-story-episode-id=\"" + escapeHtml(_0x36b17c['id']) + "\" aria-label=\"" + (_0x36b17c['isSelected'] ? "取消选择" : '选择') + '第\x20' + _0xbd97e0 + " 集\" aria-pressed=\"" + Boolean(_0x36b17c["isSelected"]) + '\x22\x20' + (_0x36b17c["canSelect"] ? '' : 'disabled') + '></button>' : "<span class=\"story-episode-outline-number\">" + (_0x3f826b + 0x1) + '.</span>') + "\n      <strong>第 " + _0xbd97e0 + '\x20集' + (_0x36b17c["isComplete"] && _0x36b17c["title"] ? " · " + escapeHtml(_0x36b17c["title"]) : '') + "</strong>\n      " + (_0x5dc478 ? "<span class=\"story-episode-script-status " + _0x5dc478["className"] + '\x22>' + _0x5dc478["label"] + "</span>" : '') + '\x0a\x20\x20\x20\x20</summary>\x0a\x20\x20\x20\x20<div\x20class=\x22story-episode-outline-body\x22>\x0a\x20\x20\x20\x20\x20\x20' + (_0x36b17c["isGenerating"] ? renderWorkflowLoading(_0x36b17c["generationMessage"] || '正在生成第\x20' + _0xbd97e0 + " 集完整剧本") : _0x36b17c['isComplete'] ? renderEpisodeScriptBody(_0x36b17c, _0xbd97e0) : '<label\x20class=\x22story-episode-synopsis-field\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span>分集简介</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<textarea\x20data-story-episode-synopsis=\x22' + escapeHtml(_0x36b17c['id']) + '\x22>' + escapeHtml(_0x36b17c["synopsis"] || '') + '</textarea>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</label>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x36b17c["hook"] ? '<label\x20class=\x22story-episode-synopsis-field\x20story-episode-hook-field\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span>结尾钩子</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<textarea\x20rows=\x221\x22\x20data-story-episode-hook=\x22' + escapeHtml(_0x36b17c['id']) + '\x22>' + escapeHtml(_0x36b17c["hook"]) + '</textarea>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</label>' : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x36b17c["canGenerate"] ? "<div class=\"story-episode-script-action\">\n              <button type=\"button\" class=\"story-secondary-button\" data-story-action=\"generate-episode-script\" data-story-episode-id=\"" + escapeHtml(_0x36b17c['id']) + '\x22\x20' + (_0x36b17c["disabled"] ? 'disabled' : '') + ">生成此集</button>\n            </div>" : '')) + "\n    </div>\n  </details>";
}
function renderEpisodeSection(_0x4c7ddc = {}) {
  if (_0x4c7ddc["isOutlineGenerating"]) {
    return renderWorkflowLoading(_0x4c7ddc["loadingMessage"] || "正在生成所有分集大纲...");
  }
  const _0x4f0a66 = Array["isArray"](_0x4c7ddc["episodes"]) ? _0x4c7ddc["episodes"] : [];
  if (!_0x4f0a66["length"]) {
    return '';
  }
  const _0x3acf23 = _0x4c7ddc["isUploadedOriginal"] ? "已按原剧本结构导入，正文未扩写" : _0x4c7ddc['isStale'] ? '故事蓝图已修改；当前内容保留为旧版本，请先重新运行分集规划' : _0x4c7ddc['complete'] ? "完整分集剧本已全部完成" : "分集大纲已完成，请按顺序生成正文";
  return "<section class=\"story-script-episodes-section\">\n    <header class=\"story-script-episodes-heading\">\n      <div><h2>共 " + _0x4f0a66['length'] + " 集</h2><p>" + _0x3acf23 + "</p></div>\n      " + (_0x4c7ddc["complete"] || _0x4c7ddc["isStale"] ? '' : _0x4c7ddc["selectionMode"] ? "<div class=\"story-script-selection-actions\">\n            <button type=\"button\" class=\"story-secondary-button\" data-story-action=\"cancel-script-selection\">" + (_0x4c7ddc["batchGenerating"] ? '退出多选' : '取消') + "</button>\n            <button type=\"button\" class=\"story-secondary-button\" data-story-action=\"select-all-script-episodes\"" + (_0x4c7ddc['batchGenerating'] ? " disabled" : '') + ">全选</button>\n            " + (_0x4c7ddc["batchGenerating"] ? "<button type=\"button\" class=\"story-primary-button\" data-story-action=\"cancel-episode-scripts-batch\" aria-label=\"取消尚未开始的分集\" " + (_0x4c7ddc["batchCancelRequested"] ? "disabled" : '') + '>' + (_0x4c7ddc["batchCancelRequested"] ? "已取消排队" : '取消') + "</button>" : "<button type=\"button\" class=\"story-primary-button\" data-story-action=\"generate-episode-scripts-batch\" data-story-script-batch-scope=\"selected\" " + (_0x4c7ddc["busy"] || !_0x4c7ddc["batchCount"] ? 'disabled' : '') + ">批量生成" + (_0x4c7ddc['batchCount'] ? '\x20(' + _0x4c7ddc['batchCount'] + ')' : '') + "</button>") + "\n          </div>" : "<button type=\"button\" class=\"story-secondary-button\" data-story-action=\"toggle-script-selection\">批量选择</button>") + '\x0a\x20\x20\x20\x20</header>\x0a\x20\x20\x20\x20<div\x20class=\x22story-episode-outline-list\x22>\x0a\x20\x20\x20\x20\x20\x20' + _0x4f0a66["map"](renderEpisodeItem)["join"]('') + "\n    </div>\n  </section>";
}
function renderOutlineNavigation(_0x37db82 = {}) {
  const _0x571835 = Array["isArray"](_0x37db82["episodeSection"]?.["episodes"]) ? _0x37db82["episodeSection"]["episodes"] : [];
  const _0x30982d = _0x571835["length"] || _0x37db82['episodeSection']?.["isOutlineGenerating"];
  return "<aside class=\"story-outline-nav-shell\" data-story-outline-nav aria-label=\"剧本目录\">\n    <button type=\"button\" class=\"story-outline-nav-trigger\" data-story-outline-nav-toggle aria-expanded=\"false\">目录</button>\n    <nav class=\"story-outline-nav-panel\" aria-label=\"剧本内容导航\">\n      <strong>剧本目录</strong>\n      " + (_0x37db82["isUploadedOriginal"] ? '' : "<button type=\"button\" class=\"story-outline-nav-section\" data-story-outline-nav-target=\"summary\">剧本摘要</button>") + "\n      " + (_0x30982d ? "<div class=\"story-outline-nav-group\">\n        <button type=\"button\" class=\"story-outline-nav-section\" data-story-outline-nav-target=\"episodes\">分集剧本</button>\n        " + (_0x571835["length"] ? '<div\x20class=\x22story-outline-nav-episodes\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + _0x571835["map"](_0x29a045 => {
    const _0x1771e5 = _0x29a045["isComplete"] && _0x29a045["title"] ? '第\x20' + _0x29a045['number'] + " 集 · " + _0x29a045["title"] : '第\x20' + _0x29a045["number"] + '\x20集';
    return "<button type=\"button\" data-story-outline-nav-target=\"episode-" + escapeHtml(_0x29a045['id']) + "\"><span>" + _0x29a045["number"] + ".</span><span>" + escapeHtml(_0x1771e5) + '</span></button>';
  })["join"]('') + "\n        </div>" : '') + "\n      </div>" : '') + "\n    </nav>\n  </aside>";
}
function renderPlanningPage(_0x5354b4 = {}) {
  const _0x547f83 = _0x5354b4["episodeSection"] || {};
  const _0x55f2eb = _0x5354b4["isUploadedOriginal"] ? '原始剧本' : _0x5354b4["isUploadedRewrite"] ? "参考剧本" : "原始创意";
  const _0xf040d3 = Array['isArray'](_0x547f83['episodes']) && _0x547f83["episodes"]["length"] > 0x0 || _0x547f83['isOutlineGenerating'];
  return "<div class=\"story-outline-page story-content-page story-script-workflow-page\">\n    " + renderOutlineNavigation(_0x5354b4) + "\n    <div class=\"story-script-workflow-card\">\n      <details class=\"story-script-accordion\" data-story-outline-section=\"original\" " + (_0x5354b4["originalOpen"] ? "open" : '') + ">\n        <summary><span class=\"story-script-accordion-summary-row\"><span class=\"story-script-accordion-title\">" + _0x55f2eb + "</span></span></summary>\n        <div class=\"story-original-creative\">" + escapeHtml(_0x5354b4["originalCreative"] || "未记录原始创意") + "</div>\n        " + (_0x5354b4['isUploadedRewrite'] ? "<div class=\"story-rewrite-instruction\"><strong>改写要求</strong><p>" + escapeHtml(_0x5354b4["rewriteInstruction"] || "未记录改写要求") + '</p></div>' : '') + "\n      </details>\n      " + (_0x5354b4["isUploadedOriginal"] ? '' : '<details\x20class=\x22story-script-accordion\x22\x20data-story-outline-section=\x22summary\x22\x20' + (_0x5354b4["summaryOpen"] ? "open" : '') + ">\n        <summary><span class=\"story-script-accordion-summary-row\">\n          <span class=\"story-script-accordion-title\">剧本摘要</span>\n          " + renderRequestDebugButton("data-story-action=\"debug-story-summary\"") + "\n          " + (normalizeText(_0x5354b4["summary"]?.["synopsis"]) && _0x5354b4['summary']?.["status"] !== "generating" ? renderInlineRegenerationControl({
    'target': "summary",
    'prompt': "是否重新生成剧本摘要？分集大纲、分集正文和素材将全部清空",
    'confirmLabel': "重新生成剧本摘要",
    ..._0x5354b4['summaryRegeneration']
  }) : '') + "\n        </span></summary>\n        " + renderSummary(_0x5354b4['summary']) + "\n      </details>") + "\n      " + (_0xf040d3 ? '<details\x20class=\x22story-script-accordion\x22\x20data-story-outline-section=\x22episodes\x22\x20' + (_0x5354b4["episodesOpen"] ? "open" : '') + '>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<summary><span\x20class=\x22story-script-accordion-summary-row\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22story-script-accordion-title\x22>分集剧本</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (!_0x5354b4["isUploadedOriginal"] && _0x547f83["episodes"]?.["length"] && ["completed", "stale"]['includes'](_0x5354b4["outlineStatus"]) ? renderInlineRegenerationControl({
    'target': "episode-outlines",
    'prompt': _0x5354b4["outlineStatus"] === "stale" ? "是否按修改后的故事蓝图重新运行？分集正文和素材将全部清空" : '是否重新生成分集大纲？分集正文和素材将全部清空',
    'confirmLabel': _0x5354b4["outlineStatus"] === "stale" ? "重新运行" : "重新生成分集大纲",
    ..._0x5354b4["outlineRegeneration"]
  }) : '') + "\n        </span></summary>\n        " + renderEpisodeSection(_0x547f83) + "\n      </details>" : '') + '\x0a\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20' + (_0x5354b4['footerMarkup'] || '') + "\n  </div>";
}
function renderPlanning(_0x3d87c9 = {}) {
  if (_0x3d87c9["kind"] === "episode-item") {
    return renderEpisodeItem(_0x3d87c9["item"]);
  }
  if (_0x3d87c9["kind"] === "episode-section") {
    return renderEpisodeSection(_0x3d87c9["section"]);
  }
  return renderPlanningPage(_0x3d87c9["page"]);
}
function renderAssetBreakdown(_0x5b984c = {}) {
  const _0x5f0e1b = Array["isArray"](_0x5b984c["episodes"]) ? _0x5b984c["episodes"] : [];
  return "<div class=\"story-asset-breakdown-page story-content-page\" data-story-asset-breakdown>\n    <header class=\"story-asset-breakdown-heading\">\n      <h1>剧本素材拆解</h1>\n    </header>\n    <section class=\"story-asset-breakdown-card\" aria-busy=\"true\">\n      <div class=\"story-asset-breakdown-list\">\n        " + _0x5f0e1b["map"]((_0x1f187c, _0x517bce) => "<article class=\"story-asset-breakdown-episode\" data-story-asset-breakdown-episode=\"" + escapeHtml(_0x1f187c['id']) + "\">\n          <h2 class=\"story-asset-breakdown-episode-heading\">\n            <span>第 " + _0x1f187c["number"] + " 集</span>\n            " + (_0x517bce === 0x0 ? "<span class=\"story-asset-breakdown-inline-status\" data-story-asset-breakdown-inline-status role=\"status\" aria-live=\"polite\">\n              <span class=\"storyboard-script-loading-spinner\" aria-hidden=\"true\"></span>\n              <span>剧情解析中</span>\n            </span>" : '') + "\n          </h2>\n          <p>" + escapeHtml(_0x1f187c["synopsis"] || "本集剧情大纲待补充。") + "</p>\n        </article>")["join"]('') + "\n      </div>\n      <div class=\"story-asset-breakdown-status\" data-story-asset-breakdown-status role=\"status\" aria-live=\"polite\">\n        <span class=\"storyboard-script-loading-spinner\" aria-hidden=\"true\"></span>\n        <span>剧情解析中</span>\n      </div>\n    </section>\n  </div>";
}
export function createStoryScriptPlanningPresentation() {
  return Object['freeze']({
    'renderAssetBreakdown': renderAssetBreakdown,
    'renderPlanning': renderPlanning
  });
}