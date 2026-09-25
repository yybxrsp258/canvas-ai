import { getStoryReplicationSubjects } from './storyReplicationReplacement.js';
import { getStoryAssetAppearances } from './storyAssetAppearances.js';
import { getSelectedAppearanceIndex } from './storyAssetSettingsProjection.js';
import { STORY_REPLICATION_LOCALES } from './storyVideoReplication.js';
import { REPLICATION_CHARACTER_ROLES } from '../../domain/storyGeneration/videoReplicationCharacters.js';
import { isStoryReplicationPromptStale } from './storyReplicationPromptFreshness.js';
const escape = _0x1fa136 => String(_0x1fa136 ?? '')["replace"](/[&<>"']/gu, _0x5e7615 => ({
  '&': "&amp;",
  '<': "&lt;",
  '>': '&gt;',
  '\x22': "&quot;",
  '\x27': '&#39;'
})[_0x5e7615]);
export function renderStoryReplicationReplacementTrigger(_0x58beb6) {
  return _0x58beb6["data"]["project"]?.["sourceMode"] === 'video-replication' && _0x58beb6['assetFilter'] === 'character' ? '<button\x20type=\x22button\x22\x20class=\x22story-secondary-button\x22\x20data-replication-toggle-settings\x20aria-expanded=\x22false\x22>替换设置</button>' : '';
}
export function renderStoryReplicationReplacementSettings(_0x2ada55) {
  const _0x5ae4ff = _0x2ada55["data"];
  if (_0x5ae4ff["project"]?.["sourceMode"] !== 'video-replication' || _0x2ada55["assetFilter"] !== "character") {
    return '';
  }
  const _0x195ed9 = _0x5ae4ff["project"]["replication"];
  const _0x4bb8ab = _0x5ae4ff["assets"]['filter'](_0x538a54 => _0x538a54["kind"] === 'character');
  return "<section class=\"story-replacement-settings\" data-replication-replacements aria-label=\"替换设置\" hidden>\n    <strong>替换设置</strong>\n    <p>为原片人物指定对应角色，可上传或生成角色形象。保留原剧情、人物关系、场景、道具和结局。</p>\n    <div class=\"story-replacement-bindings\">" + getStoryReplicationSubjects(_0x5ae4ff)["map"](({
    key: _0x2001da,
    character: _0x366626,
    episodeTitle: _0x43fb5e
  }) => {
    const _0x59d57d = _0x4bb8ab["find"](_0x2326af => _0x2326af['id'] === _0x195ed9["characterBindings"]?.[_0x2001da]);
    const _0x438377 = _0x366626["portrait"]?.["url"] || _0x366626["frame"]?.["url"];
    return "<label class=\"story-replacement-binding\">" + (_0x438377 ? "<img src=\"" + escape(_0x438377) + '\x22\x20alt=\x22' + escape(_0x366626['name']) + "原片截图\" loading=\"lazy\">" : '<span\x20class=\x22story-replacement-missing\x22>原片暂无清晰截图</span>') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20<span>' + escape(_0x43fb5e) + '\x20·\x20' + escape(_0x366626["name"]) + "<small>" + escape(_0x366626['id']) + " · " + (REPLICATION_CHARACTER_ROLES[_0x366626["role"]] || "待确认") + "</small></span><span aria-hidden=\"true\">→</span>\n        <select data-replication-replacement=\"characterBinding\" data-source-key=\"" + escape(_0x2001da) + "\" aria-label=\"" + escape(_0x366626["name"]) + "替换为\"><option value=\"\">请选择对应的新角色</option>" + _0x4bb8ab["map"](_0x25bee5 => "<option value=\"" + escape(_0x25bee5['id']) + '\x22' + (_0x59d57d?.['id'] === _0x25bee5['id'] ? " selected" : '') + '>' + escape(_0x25bee5["name"]) + '</option>')['join']('') + "</select>\n      </label>";
  })["join"]('') + "</div>\n    <label>目标对白语言<select data-replication-replacement=\"targetLocale\">" + STORY_REPLICATION_LOCALES['map'](_0x406c32 => "<option value=\"" + _0x406c32["value"] + '\x22' + (_0x195ed9['targetLocale'] === _0x406c32["value"] ? " selected" : '') + '>' + _0x406c32['shortLabel'] + "</option>")["join"]('') + "</select></label>\n    <p>确认人物后生成分段提示词；翻译保持原意和说话人对应，分段不增删剧情。</p><span role=\"status\" data-replication-replacement-status>" + (_0x5ae4ff["episodes"]["some"](_0x25ae5e => isStoryReplicationPromptStale(_0x5ae4ff, _0x25ae5e)) ? "替换设置已变更，已有分段提示词待更新。" : '') + "</span>\n  </section>";
}
export function renderStoryReplicationAssetComparison(_0x462e7e, _0x3be4ab) {
  if (_0x462e7e["data"]["project"]?.["sourceMode"] !== "video-replication" || _0x3be4ab["kind"] !== 'character' || !_0x3be4ab['replicationSource']) {
    return '';
  }
  const _0x288441 = _0x3be4ab["replicationSource"];
  const _0xb89dd3 = getStoryReplicationSubjects(_0x462e7e["data"])['filter'](({
    key: _0x1a0924
  }) => _0x462e7e["data"]["project"]["replication"]["characterBindings"]?.[_0x1a0924] === _0x3be4ab['id']);
  const _0x4f0e49 = _0xb89dd3['find'](({
    character: _0x1bc028
  }) => _0x1bc028['portrait']?.['url'] || _0x1bc028['frame']?.["url"])?.["character"];
  const _0x3b3f04 = _0x4f0e49?.["portrait"] || _0x4f0e49?.["frame"];
  const _0x459f1a = getStoryAssetAppearances(_0x3be4ab)[getSelectedAppearanceIndex(_0x462e7e, _0x3be4ab)];
  const _0x170df6 = _0x459f1a ? _0x459f1a["imageUrl"] : _0x3be4ab["imageUrl"];
  return "<span class=\"story-replacement-comparison\"><span>" + (_0x3b3f04?.["url"] ? "<img src=\"" + escape(_0x3b3f04["url"]) + "\" alt=\"原片" + escape(_0x288441['name']) + "\" loading=\"lazy\">" : '<span\x20class=\x22story-replacement-missing\x22>' + escape(_0x288441["description"] || "原片元素记录") + "</span>") + "<small>原：" + escape(_0xb89dd3["map"](({
    character: _0x4f5f08
  }) => _0x4f5f08["name"])["join"]('、') || _0x288441['name']) + "</small></span><span>" + (_0x170df6 ? "<img src=\"" + escape(_0x170df6) + '\x22\x20alt=\x22新角色' + escape(_0x3be4ab['name']) + "\" loading=\"lazy\">" : "<span class=\"story-replacement-missing\">上传或生成新形象</span>") + "<small>新：" + escape(_0x3be4ab["name"]) + "</small></span></span>";
}