import { formatStoryVideoPlaybackTime } from './storyVideoPlayback.js';
import { renderStoryGenerationSpinner } from './storyAsyncButtonPresentation.js';
import { getVideoReplicationDialogueSummary } from '../../domain/storyGeneration/videoReplicationSourceAnalysis.js';
import { renderStoryReplicationCharacters, renderStoryReplicationCharacterSummary } from './storyReplicationCharacterPresentation.js';
const escape = _0x1d5b66 => String(_0x1d5b66 ?? '')["replace"](/[&<>"']/gu, _0x4722d4 => ({
  '&': "&amp;",
  '<': "&lt;",
  '>': "&gt;",
  '\x22': "&quot;",
  '\x27': "&#39;"
})[_0x4722d4]);
const time = _0x3685d5 => formatStoryVideoPlaybackTime(_0x3685d5);
const seek = (_0x20476a, _0xaf0978, _0x399282 = ![]) => '<button\x20type=\x22button\x22\x20data-replication-seek=\x22' + Number(_0x20476a) + '\x22' + (_0x399282 ? " data-replication-listen" : '') + '>' + escape(_0xaf0978 || time(_0x20476a)) + '</button>';
const field = (_0x6f7fb6, _0x1c6a57, _0x43e99b, _0x35991c, _0x470735, _0x570b59 = '') => "<label>" + escape(_0x6f7fb6) + '<textarea\x20rows=\x222\x22\x20data-replication-edit=\x22' + _0x1c6a57 + "\" data-id=\"" + escape(_0x43e99b) + "\" data-field=\"" + _0x35991c + "\" data-index=\"" + _0x570b59 + '\x22>' + escape(_0x470735) + '</textarea></label>';
export function renderStoryReplicationTimeRail(_0x57810d) {
  return _0x57810d["events"]["map"](_0xc2bef7 => seek(_0xc2bef7["startSec"]))["join"]('');
}
export function renderStoryReplicationEvidenceSummary(_0x48c855) {
  return renderStoryReplicationCharacterSummary(_0x48c855) + " · " + getVideoReplicationDialogueSummary(_0x48c855)["label"];
}
export function renderStoryReplicationReviewTab(_0x342f75, _0x4f25ae = "story") {
  const _0x5a2722 = _0x342f75['replication']["sourceAnalysis"];
  if (_0x4f25ae === "characters") {
    return renderStoryReplicationCharacters(_0x342f75, {
      'field': field,
      'seek': seek
    });
  }
  if (_0x4f25ae === 'dialogue' && !_0x5a2722['events']["some"](_0x2eb34e => _0x2eb34e['dialogue']["length"])) {
    return "<p class=\"story-source-empty-frame\">本次分析未返回对白。可先回听原片，再用支持音画理解的模型重新分析。</p>";
  }
  return (_0x4f25ae === 'story' ? field("原片故事", "story", '', "synopsis", _0x5a2722["synopsis"]) : _0x4f25ae === "dialogue" ? '<p>按原片顺序核对台词与说话人；点击时间回听。</p>' : "<p>时间为回看参考，不要求逐秒对应。</p>") + '\x0a\x20\x20\x20\x20' + _0x5a2722['events']['filter'](_0x398147 => _0x4f25ae !== 'dialogue' || _0x398147["dialogue"]["length"])['map'](_0xc01a1b => "<article class=\"story-source-event\" data-replication-event=\"" + escape(_0xc01a1b['id']) + "\">\n      <header>" + seek(_0xc01a1b["startSec"], time(_0xc01a1b["startSec"]) + '–' + time(_0xc01a1b["endSec"])) + (_0x4f25ae === "dialogue" ? '' : "<span>" + (_0xc01a1b["characterIds"]["map"](_0x201e76 => escape(_0x5a2722['characters']["find"](_0x71b159 => _0x71b159['id'] === _0x201e76)?.["name"] || _0x201e76))['join']('、') || "无人出镜") + "</span>") + "</header>\n      " + (_0x4f25ae === 'dialogue' ? '' : field("画面与动作", "event", _0xc01a1b['id'], 'visual', _0xc01a1b["visual"])) + '\x0a\x20\x20\x20\x20\x20\x20' + (_0x4f25ae === "shots" ? "<p>原片镜头：" + escape(_0xc01a1b["camera"]) + "</p><p>声音描述：" + escape(_0xc01a1b["sound"]) + "</p>" : _0x4f25ae !== "dialogue" ? '' : _0xc01a1b['dialogue']['map']((_0x7073ec, _0x44a5ee) => '<div\x20class=\x22story-source-dialogue\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-source-dialogue-heading\x22>' + seek(_0x7073ec['startSec'] ?? _0xc01a1b['startSec'], '回听', !![]) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20<select\x20aria-label=\x22说话人\x22\x20data-replication-edit=\x22dialogue\x22\x20data-id=\x22' + escape(_0xc01a1b['id']) + "\" data-index=\"" + _0x44a5ee + "\" data-field=\"speakerId\"><option value=\"\">说话人待核对</option>" + _0x5a2722["characters"]["map"](_0x4c73e4 => "<option value=\"" + escape(_0x4c73e4['id']) + '\x22' + (_0x4c73e4['id'] === _0x7073ec['speakerId'] ? '\x20selected' : '') + '>' + escape(_0x4c73e4['name']) + "</option>")["join"]('') + "</select>\n        <label class=\"story-source-check\"><input type=\"checkbox\" data-replication-edit=\"dialogue\" data-id=\"" + escape(_0xc01a1b['id']) + "\" data-index=\"" + _0x44a5ee + '\x22\x20data-field=\x22uncertain\x22' + (_0x7073ec["uncertain"] ? " checked" : '') + '>待核对</label>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div><textarea\x20aria-label=\x22原语言对白\x22\x20rows=\x221\x22\x20data-replication-edit=\x22dialogue\x22\x20data-id=\x22' + escape(_0xc01a1b['id']) + '\x22\x20data-index=\x22' + _0x44a5ee + "\" data-field=\"text\">" + escape(_0x7073ec["text"]) + "</textarea>\n      </div>")["join"]('')) + '\x0a\x20\x20\x20\x20\x20\x20' + (_0x4f25ae !== "dialogue" && _0xc01a1b["uncertainties"]["length"] ? "<details class=\"story-source-doubt\"><summary>识别备注</summary><p>" + _0xc01a1b["uncertainties"]['map'](escape)["join"]('；') + "</p></details>" : '') + "\n    </article>")['join']('');
}
export function renderStoryReplicationReview(_0x290300) {
  return '<section\x20class=\x22story-source-review\x22\x20data-replication-review\x20aria-label=\x22原视频分析详情\x22>\x0a\x20\x20\x20\x20<header\x20class=\x22story-source-review-heading\x22><div><span\x20class=\x22story-source-eyebrow\x22>原片核对</span><strong>' + escape(_0x290300["title"]) + '</strong><small\x20data-replication-review-summary>' + renderStoryReplicationEvidenceSummary(_0x290300["replication"]["sourceAnalysis"]) + "</small></div><div class=\"story-source-actions\"><button type=\"button\" data-replication-reanalyze>重新分析</button><button type=\"button\" data-replication-close>返回视频列表</button></div></header>\n    <div class=\"story-source-review-layout\">\n      <div class=\"story-source-player\"><video controls playsinline preload=\"metadata\" aria-label=\"原视频核对播放器\"" + (_0x290300["sourceVideo"]["posterUrl"] ? '\x20poster=\x22' + escape(_0x290300["sourceVideo"]["posterUrl"]) + '\x22' : '') + "></video><div data-replication-seeking hidden role=\"status\">" + renderStoryGenerationSpinner({
    'button': !![]
  }) + "正在定位原片画面</div><div class=\"story-source-time-rail\" aria-label=\"原片时间索引\">" + renderStoryReplicationTimeRail(_0x290300["replication"]["sourceAnalysis"]) + "</div><div class=\"story-source-cast\" data-replication-cast>" + renderStoryReplicationCast(_0x290300) + "</div></div>\n      <div class=\"story-source-details\"><nav class=\"story-source-tabs\" aria-label=\"分析内容\">" + [["story", '剧情'], ["dialogue", '对白'], ["characters", '人物'], ["shots", '镜头']]["map"](([_0x1902c9, _0x5c6ac8], _0x45e05f) => '<button\x20type=\x22button\x22\x20data-replication-tab=\x22' + _0x1902c9 + '\x22\x20aria-pressed=\x22' + (_0x45e05f === 0x0) + '\x22>' + _0x5c6ac8 + "</button>")['join']('') + "</nav>\n      <fieldset class=\"story-source-fields\" data-replication-fields>" + renderStoryReplicationReviewTab(_0x290300) + "</fieldset></div>\n    </div>\n    <footer class=\"story-source-review-footer\"><span role=\"status\" data-replication-status></span></footer>\n  </section>";
}
export function renderStoryReplicationCast(_0x24bce3) {
  return _0x24bce3["replication"]["sourceAnalysis"]["characters"]['map'](_0x5e930e => {
    const _0x4033eb = _0x5e930e["portrait"]?.["url"] || _0x5e930e["frame"]?.["url"];
    return '<button\x20type=\x22button\x22\x20class=\x22story-source-cast-card\x22\x20data-replication-character-link=\x22' + escape(_0x5e930e['id']) + '\x22>' + (_0x4033eb ? "<img src=\"" + escape(_0x4033eb) + "\" alt=\"" + escape(_0x5e930e["name"]) + '\x22\x20loading=\x22lazy\x22>' : '<span\x20class=\x22story-source-cast-placeholder\x22>待选代表帧</span>') + "<span><strong>" + escape(_0x5e930e["name"]) + "</strong><small>" + (_0x5e930e["role"] === "main" ? '主角' : _0x5e930e["role"] === "supporting" ? '配角' : "待核对") + "</small></span></button>";
  })["join"]('');
}
export function syncStoryReplicationReviewStatus(_0xc90125, _0x53d9a0, {
  busy = ![],
  message = ''
} = {}) {
  const _0x27a259 = _0x53d9a0['clips']?.["length"] > 0x0;
  _0xc90125["querySelector"]('[data-replication-reanalyze]')['disabled'] = busy || _0x27a259;
  _0xc90125["querySelector"]("[data-replication-fields]")["disabled"] = busy || _0x27a259;
  _0xc90125['querySelector']("[data-replication-review]")["setAttribute"]("aria-busy", String(busy));
  const _0x7312e9 = message || (_0x27a259 ? "本集已有分镜，原片分析仅供核对；保留现有提示词与生成结果。" : "修正自动保存。原片编号、时间与镜头记录只读；确认后指定替换人物。");
  _0xc90125['querySelector']('[data-replication-status]')["innerHTML"] = '' + (busy ? renderStoryGenerationSpinner({
    'button': !![]
  }) : '') + escape(_0x7312e9);
}