import { renderWorkspaceEpisodeRail } from '../workspaceEpisodeRailPresentation.js';
import { formatStoryClockDuration } from './storyPlanningData.js';
import { getVideoReplicationDialogueSummary } from '../../domain/storyGeneration/videoReplicationSourceAnalysis.js';
function getSourceDurationLabel(_0x411277) {
  const _0x2f3a8a = Number(_0x411277["sourceVideo"]?.['durationSec']);
  return Number['isFinite'](_0x2f3a8a) && _0x2f3a8a > 0x0 ? formatStoryClockDuration(_0x2f3a8a) : "--:--";
}
function escapeHtml(_0xf60de2) {
  return String(_0xf60de2 ?? '')['replaceAll']('&', "&amp;")["replaceAll"]('<', '&lt;')["replaceAll"]('>', "&gt;")["replaceAll"]('\x22', "&quot;")["replaceAll"]('\x27', '&#39;');
}
export function renderStoryVideoReplicationEpisodeRail(_0x285fed = [], _0x4022ad = '') {
  return renderWorkspaceEpisodeRail({
    'items': (Array["isArray"](_0x285fed) ? _0x285fed : [])["map"](_0x45f9a7 => ({
      ..._0x45f9a7,
      'meta': String(_0x45f9a7?.["clips"]?.["length"] || 0x0)
    })),
    'selectedId': _0x4022ad,
    'listData': {
      'data-story-replication-episode-rail-list': !![]
    },
    'getButtonData': _0x191f3c => ({
      'data-story-open-episode': _0x191f3c['id']
    })
  });
}
function getEvidenceSummary(_0xe318b3) {
  if (_0xe318b3['replication']?.["error"]) {
    return _0xe318b3["replication"]["error"];
  }
  const _0x5e7238 = _0xe318b3["replication"]?.["sourceAnalysis"];
  if (!_0x5e7238) {
    return _0xe318b3["replication"]?.['error'] || _0xe318b3['replication']?.["message"] || "待分析";
  }
  const _0x445824 = _0x5e7238['characters']["filter"](_0x3e17ec => _0x3e17ec["role"] === "main")['length'];
  return _0x5e7238["characters"]["length"] + '\x20个角色' + (_0x445824 ? " · " + _0x445824 + '\x20位主角' : '') + '\x20·\x20' + getVideoReplicationDialogueSummary(_0x5e7238)["label"];
}
function syncStoryReplicationCardSelection(_0x52921f, _0x520127, _0x5cb71b, _0x539095 = ![]) {
  const _0x1c9abf = ["pending", 'failed']["includes"](_0x520127["replication"]?.["status"]);
  const _0x21da6a = Boolean(_0x5cb71b && _0x1c9abf && _0x520127["replication"]?.["selectedForAnalysis"]);
  _0x52921f["classList"]['toggle']("is-selection-mode", _0x5cb71b);
  _0x52921f["classList"]["toggle"]("is-checked", _0x21da6a);
  const _0x17bbe1 = _0x52921f["querySelector"]('[data-replication-card-action]');
  if (!_0x17bbe1) {
    return;
  }
  _0x17bbe1["disabled"] = getStatusView(_0x520127)['busy'] || _0x5cb71b && (!_0x1c9abf || _0x539095) || !_0x520127["replication"]?.['sourceAnalysis'] && (_0x539095 || !_0x520127["sourceVideo"]?.["videoRef"]);
  if (_0x5cb71b) {
    _0x17bbe1["setAttribute"]('aria-pressed', String(_0x21da6a));
  } else {
    _0x17bbe1["removeAttribute"]("aria-pressed");
  }
  if (!_0x5cb71b && _0x520127['replication']?.['sourceAnalysis']) {
    _0x17bbe1["dataset"]["replicationOpen"] = _0x520127['id'];
  } else {
    _0x17bbe1["removeAttribute"]("data-replication-open");
  }
  const _0x3d6bd5 = _0x17bbe1["querySelector"]("[data-replication-selection-indicator]");
  _0x3d6bd5["hidden"] = !_0x5cb71b || !_0x1c9abf;
  _0x3d6bd5["textContent"] = _0x21da6a ? '✓' : '';
  const _0x3c8106 = _0x17bbe1['querySelector']("[data-replication-action-label]");
  _0x3c8106["hidden"] = _0x5cb71b;
  _0x3c8106["textContent"] = getStatusView(_0x520127)['busy'] ? "处理中…" : _0x520127["replication"]?.["sourceAnalysis"] ? "查看分析 →" : _0x520127["replication"]?.['status'] === "failed" ? "重试分析 →" : "开始分析 →";
}
export function syncStoryReplicationSelection(_0x444126, _0x10b23c) {
  const _0x4f0f58 = _0x10b23c["data"]["episodes"];
  const _0x28200f = _0x10b23c["replicationSelectionMode"] === !![];
  const _0xe3f0e5 = _0x4f0f58["filter"](_0x412c51 => ["pending", "failed"]["includes"](_0x412c51["replication"]?.['status']));
  const _0x219e10 = _0xe3f0e5["filter"](_0x4e6938 => _0x4e6938["replication"]['selectedForAnalysis'])["length"];
  const _0x4989d7 = _0x4f0f58["some"](_0x8d82c4 => getStatusView(_0x8d82c4)["busy"]);
  _0x444126["querySelectorAll"]("article[data-story-replication-episode-id]")["forEach"](_0x43a7ee => {
    const _0x362c4d = _0x4f0f58["find"](_0x350752 => _0x350752['id'] === _0x43a7ee["dataset"]["storyReplicationEpisodeId"]);
    if (_0x362c4d) {
      syncStoryReplicationCardSelection(_0x43a7ee, _0x362c4d, _0x28200f, _0x4989d7);
    }
  });
  _0x444126['querySelectorAll']('[data-replication-selection]')["forEach"](_0x26a05c => {
    const _0x4402be = _0x26a05c["dataset"]['replicationSelection'];
    _0x26a05c["hidden"] = _0x4402be === "enter" ? _0x28200f : !_0x28200f;
    _0x26a05c["disabled"] = _0x4402be !== "cancel" && (_0x4989d7 || !_0xe3f0e5['length']);
    if (_0x4402be === "all") {
      _0x26a05c["textContent"] = _0x219e10 && _0x219e10 === _0xe3f0e5["length"] ? "取消全选" : '全选';
    }
  });
  _0x444126["querySelectorAll"]("[data-replication-analyze]")["forEach"](_0xbd0ddc => {
    const _0x4172ad = _0xbd0ddc["dataset"]["replicationAnalyze"] === "selected";
    _0xbd0ddc["hidden"] = _0x4172ad ? !_0x28200f : _0x28200f;
    _0xbd0ddc["disabled"] = _0x4989d7 || !(_0x4172ad ? _0x219e10 : _0xe3f0e5['length']);
    _0xbd0ddc["setAttribute"]("aria-busy", String(_0x4989d7));
    if (_0x4172ad) {
      _0xbd0ddc["textContent"] = '分析选中' + (_0x219e10 ? '\x20(' + _0x219e10 + ')' : '');
    }
  });
}
function getStatusView(_0x45602b = {}) {
  const _0x469a1c = _0x45602b?.["replication"]?.["status"] || "queued";
  if (_0x469a1c === "uploading") {
    return {
      'label': '上传中',
      'busy': !![]
    };
  }
  if (_0x469a1c === "analyzing") {
    return {
      'label': "解析中",
      'busy': !![]
    };
  }
  if (_0x469a1c === "ready") {
    return {
      'label': "解析完成",
      'busy': ![]
    };
  }
  if (_0x469a1c === 'failed') {
    return {
      'label': "解析失败",
      'busy': ![]
    };
  }
  if (_0x469a1c === "pending") {
    return {
      'label': "待分析",
      'busy': ![]
    };
  }
  return {
    'label': "等待解析",
    'busy': !![]
  };
}
function renderVideoCard(_0x255f15 = {}, _0x39ce03 = 0x0, _0x45ff5a = ![]) {
  const _0x3d56a8 = _0x255f15["sourceVideo"] || {};
  const _0x57b34f = getStatusView(_0x255f15);
  const _0x40f0ae = String(_0x3d56a8['posterUrl'] || _0x255f15["coverUrl"] || '')['trim']();
  const _0x502739 = ['pending', 'failed']["includes"](_0x255f15["replication"]?.["status"]);
  const _0x562f2c = _0x45ff5a && _0x502739 && _0x255f15["replication"]?.['selectedForAnalysis'];
  const _0x2f7416 = _0x255f15?.["replication"]?.["status"] === "failed" && !_0x3d56a8['videoRef'];
  return "<article class=\"story-episode-card story-replication-card is-" + escapeHtml(_0x255f15?.["replication"]?.["status"] || "queued") + (_0x45ff5a ? " is-selection-mode" : '') + (_0x562f2c ? " is-checked" : '') + "\" data-story-replication-episode-id=\"" + escapeHtml(_0x255f15['id']) + "\" draggable=\"false\" aria-busy=\"" + _0x57b34f["busy"] + "\">\n    <span class=\"story-replication-drag-handle\" data-story-replication-drag-handle draggable=\"true\" role=\"button\" tabindex=\"0\" aria-label=\"拖动调整第 " + (_0x39ce03 + 0x1) + " 条视频顺序\" title=\"拖动调整顺序\"><span></span><span></span><span></span><span></span><span></span><span></span></span>\n    <button type=\"button\" class=\"story-replication-preview\" data-story-action=\"preview-replication-video\" data-story-replication-episode-id=\"" + escapeHtml(_0x255f15['id']) + "\" aria-label=\"播放第 " + (_0x39ce03 + 0x1) + " 条原视频\" " + (_0x3d56a8['videoRef'] ? '' : "disabled") + ">\n      <img" + (_0x40f0ae ? '\x20src=\x22' + escapeHtml(_0x40f0ae) + '\x22' : '') + " alt=\"第 " + (_0x39ce03 + 0x1) + " 条视频首帧\" draggable=\"false\" " + (_0x40f0ae ? '' : "hidden") + ">\n      <span class=\"story-replication-poster-placeholder\" " + (_0x40f0ae ? 'hidden' : '') + " aria-hidden=\"true\">▶</span>\n      <span class=\"story-replication-play\" aria-hidden=\"true\">▶</span>\n    </button>\n    <button type=\"button\" class=\"story-episode-copy story-replication-copy\" data-replication-card-action=\"" + escapeHtml(_0x255f15['id']) + '\x22\x20' + (!_0x45ff5a && _0x255f15["replication"]?.["sourceAnalysis"] ? "data-replication-open=\"" + escapeHtml(_0x255f15['id']) + '\x22' : '') + '\x20' + (_0x45ff5a ? 'aria-pressed=\x22' + Boolean(_0x562f2c) + '\x22' : '') + '\x20' + (_0x57b34f["busy"] || _0x45ff5a && !_0x502739 || _0x2f7416 ? "disabled" : '') + ">\n      <span class=\"story-asset-select-indicator\" data-replication-selection-indicator " + (_0x45ff5a && _0x502739 ? '' : "hidden") + '\x20aria-hidden=\x22true\x22>' + (_0x562f2c ? '✓' : '') + '</span>\x0a\x20\x20\x20\x20\x20\x20<span\x20class=\x22story-replication-title-row\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22story-replication-status\x22\x20data-story-replication-status>' + escapeHtml(_0x57b34f["label"]) + "</span>\n      </span>\n      <span class=\"story-episode-title\"><span data-story-replication-number>视频 " + (_0x39ce03 + 0x1) + "：</span><span data-story-replication-title>" + escapeHtml(_0x255f15['title'] || _0x3d56a8["fileName"] || "未命名视频") + "</span></span>\n      <span class=\"story-replication-meta\"><span data-story-replication-duration>" + escapeHtml(getSourceDurationLabel(_0x255f15)) + "</span><span data-story-replication-synopsis>" + escapeHtml(getEvidenceSummary(_0x255f15)) + '</span></span>\x0a\x20\x20\x20\x20\x20\x20<span\x20class=\x22story-episode-enter\x22\x20data-replication-action-label\x20' + (_0x45ff5a ? 'hidden' : '') + '>' + (_0x57b34f["busy"] ? "处理中…" : _0x255f15["replication"]?.["sourceAnalysis"] ? "查看分析 →" : _0x502739 ? _0x255f15['replication']["status"] === "failed" ? "重试分析 →" : "开始分析 →" : '') + "</span>\n    </button>\n      <div class=\"story-replication-card-actions\" data-story-replication-card-actions " + (_0x2f7416 ? '' : 'hidden') + '>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20data-story-action=\x22reupload-replication-video\x22\x20data-story-replication-episode-id=\x22' + escapeHtml(_0x255f15['id']) + '\x22>重新上传该视频</button>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20</article>';
}
export function renderStoryVideoReplicationPage({
  episodes = [],
  targetLabel = "原语言",
  styleLabel = '',
  selectionMode = ![],
  footerMarkup = ''
} = {}) {
  const _0x36f9b0 = episodes["some"](_0x15739e => getStatusView(_0x15739e)["busy"]);
  const _0x54300a = episodes["filter"](_0x5e3f33 => ['pending', "failed"]["includes"](_0x5e3f33['replication']?.["status"]));
  const _0x3ecaaa = _0x54300a["filter"](_0x3f2665 => _0x3f2665["replication"]['selectedForAnalysis'])["length"];
  return "<section class=\"story-replication-page story-content-page\" data-story-replication-page>\n    <header class=\"story-replication-heading story-page-heading\">\n      <div>\n        <span class=\"story-eyebrow\">原片分析 · " + episodes["length"] + " 条视频</span>\n        <h2>视频解析</h2>\n      </div>\n      <div class=\"story-heading-actions story-replication-analysis-actions\">\n        <button type=\"button\" class=\"story-secondary-button workspace-selection-trigger\" data-replication-selection=\"enter\" " + (selectionMode ? 'hidden' : '') + '\x20' + (_0x36f9b0 || !_0x54300a['length'] ? "disabled" : '') + ">多选</button>\n        <button type=\"button\" class=\"story-secondary-button\" data-replication-selection=\"all\" " + (selectionMode ? '' : "hidden") + '\x20' + (_0x36f9b0 || !_0x54300a['length'] ? "disabled" : '') + '>' + (_0x3ecaaa && _0x3ecaaa === _0x54300a['length'] ? "取消全选" : '全选') + "</button>\n        <button type=\"button\" class=\"story-secondary-button\" data-replication-selection=\"cancel\" " + (selectionMode ? '' : "hidden") + ">取消多选</button>\n        <button type=\"button\" class=\"story-primary-button story-main-action-button\" data-replication-analyze=\"selected\" " + (selectionMode ? '' : "hidden") + '\x20' + (_0x36f9b0 || !_0x3ecaaa ? "disabled" : '') + ">分析选中" + (_0x3ecaaa ? '\x20(' + _0x3ecaaa + ')' : '') + "</button>\n        <button type=\"button\" class=\"story-primary-button story-main-action-button\" data-replication-analyze=\"all\" " + (selectionMode ? "hidden" : '') + '\x20' + (_0x36f9b0 || !_0x54300a['length'] ? 'disabled' : '') + ">批量分析</button>\n      </div>\n    </header>\n    <div class=\"story-episode-grid story-replication-grid\" data-story-replication-grid>\n      " + episodes["map"]((_0xf1ce4f, _0x387e51) => renderVideoCard(_0xf1ce4f, _0x387e51, selectionMode))["join"]('') + "\n    </div>\n    <div data-replication-review-host hidden></div>\n    " + footerMarkup + "\n  </section>";
}
export function syncStoryVideoReplicationCardElement(_0x2529f4, _0x444efb = {}, _0x4f2247 = 0x0) {
  if (!_0x2529f4 || !_0x444efb) {
    return ![];
  }
  const _0x594e56 = _0x444efb["sourceVideo"] || {};
  const _0x3bac84 = getStatusView(_0x444efb);
  const _0x2e23b6 = _0x444efb?.["replication"]?.['status'] || 'queued';
  ['pending', "queued", "uploading", 'analyzing', "ready", "failed"]["forEach"](_0x2543f2 => {
    _0x2529f4["classList"]?.["toggle"]?.("is-" + _0x2543f2, _0x2543f2 === _0x2e23b6);
  });
  _0x2529f4["setAttribute"]?.("aria-busy", String(_0x3bac84['busy']));
  const _0x15b119 = _0x2529f4['querySelector']?.("[data-story-replication-number]");
  const _0x22911c = _0x2529f4["querySelector"]?.("[data-story-replication-title]");
  const _0x589dab = _0x2529f4["querySelector"]?.('[data-story-replication-duration]');
  const _0xf80576 = _0x2529f4["querySelector"]?.('[data-story-replication-status]');
  const _0x4d6447 = _0x2529f4["querySelector"]?.("[data-story-replication-synopsis]");
  const _0x14c999 = _0x2529f4["querySelector"]?.("[data-story-replication-card-actions]");
  const _0x39b9c5 = _0x2529f4["querySelector"]?.(".story-replication-preview");
  const _0x111af0 = _0x39b9c5?.['querySelector']?.("img");
  const _0x3dc82d = _0x39b9c5?.["querySelector"]?.('.story-replication-poster-placeholder');
  const _0x1d8a93 = String(_0x594e56["posterUrl"] || _0x444efb["coverUrl"] || '')['trim']();
  if (_0x15b119) {
    _0x15b119["textContent"] = "视频 " + (_0x4f2247 + 0x1) + '：';
  }
  if (_0x22911c) {
    _0x22911c['textContent'] = _0x444efb["title"] || "视频 " + (_0x4f2247 + 0x1);
  }
  if (_0x589dab) {
    _0x589dab["textContent"] = getSourceDurationLabel(_0x444efb);
  }
  if (_0xf80576) {
    _0xf80576["textContent"] = _0x3bac84["label"];
  }
  const _0xb270de = _0x2529f4["querySelector"]?.("[data-replication-select-analysis]");
  if (_0xb270de) {
    _0xb270de["disabled"] = !['pending', "failed"]['includes'](_0x2e23b6);
  }
  _0x4d6447 && (_0x4d6447["textContent"] = getEvidenceSummary(_0x444efb));
  syncStoryReplicationCardSelection(_0x2529f4, _0x444efb, _0x2529f4['classList']["contains"]("is-selection-mode"));
  if (_0x14c999) {
    _0x14c999["hidden"] = !(_0x2e23b6 === 'failed' && !String(_0x594e56['videoRef'] || '')["trim"]());
    const _0x4ee4b9 = _0x14c999["querySelector"]?.("[data-story-action=\"reupload-replication-video\"]");
    if (_0x4ee4b9) {
      _0x4ee4b9["dataset"]["storyReplicationEpisodeId"] = _0x444efb['id'];
    }
  }
  _0x39b9c5 && (_0x39b9c5['disabled'] = !String(_0x594e56['videoRef'] || '')["trim"](), _0x39b9c5["dataset"]["storyReplicationEpisodeId"] = _0x444efb['id'], _0x39b9c5["setAttribute"]("aria-label", "播放第 " + (_0x4f2247 + 0x1) + '\x20条原视频'));
  if (_0x111af0) {
    if (_0x1d8a93 && _0x111af0['getAttribute']("src") !== _0x1d8a93) {
      _0x111af0['setAttribute']("src", _0x1d8a93);
    }
    _0x111af0["hidden"] = !_0x1d8a93;
    _0x111af0['alt'] = '第\x20' + (_0x4f2247 + 0x1) + " 条视频首帧";
  }
  if (_0x3dc82d) {
    _0x3dc82d['hidden'] = Boolean(_0x1d8a93);
  }
  const _0x2ff490 = _0x2529f4["querySelector"]?.("[data-story-replication-drag-handle]");
  _0x2ff490 && _0x2ff490["setAttribute"]("aria-label", "拖动调整第 " + (_0x4f2247 + 0x1) + " 条视频顺序");
  return !![];
}