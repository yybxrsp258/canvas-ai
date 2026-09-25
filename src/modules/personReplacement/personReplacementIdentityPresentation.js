import { renderWorkspaceActionIcon } from '../workspaceActionIcons.js';
import { renderVideoReferenceBarMarkup } from '../../components/video-node/promptInputSurface.js';
import { localPathToUrl } from '../../utils/localMediaPath.js';
import { resolvePersonReplacementLocationGuidePreview } from './personReplacementLocationGuideSvg.js';
import { getWorkspaceAssetAppearances, getWorkspaceAssetBaseAppearance } from '../workspaceAssetAppearance.js';
import { buildPersonReplacementAssetViewState, renderPersonReplacementAssetCard, renderPersonReplacementPreviewArrow } from './personReplacementAssetPresentation.js';
import { PERSON_REPLACEMENT_ORIENTATIONS, PERSON_REPLACEMENT_VIDEO_INPUT_MODE_CHARACTER_REFERENCE, PERSON_REPLACEMENT_VIDEO_REFERENCE_KIND_CHARACTER_IMAGE, formatPersonReplacementScopeLabel, normalizePersonReplacementScope } from './personReplacementProject.js';
import { PERSON_REPLACEMENT_ORIENTATION_ENABLED } from './personReplacementCapabilities.js';
import { getPersonReplacementIdentityCorrectionDraftKey, resolvePersonReplacementDetectionLabel } from './personReplacementSourceIdentity.js';
const PERSON_REPLACEMENT_ORIENTATION_LABELS = Object["freeze"]({
  'front': '正面',
  'back': '背面',
  'side': '侧面',
  'left_profile': "左侧面",
  'right_profile': "右侧面",
  'three_quarter_left': "左前侧",
  'three_quarter_right': "右前侧",
  'over_shoulder_left': "左过肩",
  'over_shoulder_right': '右过肩',
  'unknown': "待确认"
});
function escapeHtml(_0x56153b) {
  return String(_0x56153b ?? '')["replaceAll"]('&', "&amp;")["replaceAll"]('<', "&lt;")["replaceAll"]('>', "&gt;")["replaceAll"]('\x22', "&quot;")["replaceAll"]('\x27', "&#39;");
}
function normalizeText(_0x2473ef, _0x4e9427 = '') {
  const _0x4e7036 = String(_0x2473ef ?? '')['trim']();
  return _0x4e7036 || _0x4e9427;
}
function normalizeMediaUrl(_0x2c25bf) {
  const _0x31ca8b = normalizeText(_0x2c25bf);
  return _0x31ca8b ? localPathToUrl(_0x31ca8b) || _0x31ca8b : '';
}
function formatPersonOrientation(_0x39f9dc) {
  return PERSON_REPLACEMENT_ORIENTATION_LABELS[normalizeText(_0x39f9dc)] || PERSON_REPLACEMENT_ORIENTATION_LABELS['unknown'];
}
function getCharacterAppearance(_0x16c333, _0x51e2d5 = '') {
  const _0x2ebe5a = getWorkspaceAssetAppearances(_0x16c333);
  return _0x2ebe5a["find"](_0x56bc19 => _0x56bc19['id'] === _0x51e2d5) || getWorkspaceAssetBaseAppearance(_0x16c333) || _0x2ebe5a[0x0] || null;
}
function normalizeProjectAssetMediaForRender(_0x100fee = {}) {
  return {
    ..._0x100fee,
    'appearances': getWorkspaceAssetAppearances(_0x100fee)['map'](_0x5eb6de => ({
      ..._0x5eb6de,
      'imageUrl': normalizeMediaUrl(_0x5eb6de["imageUrl"]),
      'referenceImageUrl': normalizeMediaUrl(_0x5eb6de["referenceImageUrl"])
    }))
  };
}
function renderPersonReplacementVoiceReferenceStatus(_0x1a2e14 = {}, _0x174bba = '') {
  const _0x31b074 = normalizeMediaUrl(_0x1a2e14["voiceReference"]?.["audioUrl"] || _0x1a2e14["voiceReference"]?.["localPath"] || _0x1a2e14["voiceRef"]);
  const _0x475eb3 = Boolean(_0x31b074);
  return "<span class=\"person-replacement-target-voice-status" + (_0x174bba ? '\x20' + escapeHtml(_0x174bba) : '') + '\x20' + (_0x475eb3 ? "has-reference" : 'is-missing') + "\"><i aria-hidden=\"true\"></i>" + (_0x475eb3 ? "有声音参考" : '无声音参考') + '</span>';
}
function renderPersonDetectionPicker({
  kind: _0xa2b797,
  value: _0x44f283,
  label: _0x2e66c6,
  ariaLabel: _0x3038dd,
  customInputValue = '',
  sourceCharacterId = ''
} = {}) {
  const _0xa3366f = normalizeText(_0x44f283);
  const _0x3ae57f = normalizeText(_0x2e66c6, "请选择");
  const _0x543398 = _0xa2b797 === "label";
  const _0x1231a9 = _0x543398 ? "data-person-replacement-person-label" : _0xa2b797 === "scope" ? "data-person-replacement-person-scope" : "data-person-replacement-person-orientation";
  return '<span\x20class=\x22person-replacement-detection-picker\x20is-' + escapeHtml(_0xa2b797) + "\" data-person-replacement-detection-picker=\"" + escapeHtml(_0xa2b797) + '\x22>\x0a\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22person-replacement-detection-picker-trigger\x22\x20data-person-replacement-action=\x22toggle-detection-picker\x22\x20data-person-replacement-detection-picker-trigger=\x22' + escapeHtml(_0xa2b797) + '\x22\x20' + _0x1231a9 + " value=\"" + escapeHtml(_0xa3366f) + '\x22' + (_0x543398 ? " data-person-replacement-selected-source-character-id=\"" + escapeHtml(sourceCharacterId) + '\x22' : '') + " aria-label=\"" + escapeHtml(_0x3038dd) + "\" aria-haspopup=\"listbox\" aria-expanded=\"false\">\n      <span data-person-replacement-detection-picker-value>" + escapeHtml(_0x3ae57f) + '</span><span\x20class=\x22story-project-sort-chevron\x22\x20aria-hidden=\x22true\x22></span>\x0a\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20' + (_0x543398 ? "<input type=\"text\" class=\"person-replacement-detection-name-input\" value=\"" + escapeHtml(customInputValue || _0x3ae57f) + "\" maxlength=\"24\" placeholder=\"输入人物名称\" aria-label=\"自定义人物名称\" data-person-replacement-person-custom-label hidden>" : '') + "\n    <div class=\"story-project-sort-menu person-replacement-detection-picker-menu\" data-person-replacement-detection-picker-menu data-person-replacement-picker-options-lazy=\"true\" role=\"listbox\" aria-label=\"" + escapeHtml(_0x3038dd) + "选项\" aria-hidden=\"true\"></div>\n  </span>";
}
function renderPersonDetectionPickerOptions(_0x31e21b = [], _0x472236 = '') {
  const _0x5ea8c5 = normalizeText(_0x472236);
  return (Array["isArray"](_0x31e21b) ? _0x31e21b : [])["map"](_0x285559 => {
    const _0x554df9 = normalizeText(_0x285559?.['value']);
    const _0x53f297 = normalizeText(_0x285559?.["label"], _0x554df9);
    const _0x5791f7 = _0x554df9 === _0x5ea8c5;
    const _0x29108d = _0x285559?.["deletable"] ? "<button type=\"button\" class=\"person-replacement-detection-picker-option-delete\" data-person-replacement-action=\"delete-detection-custom-label\" data-person-replacement-custom-label=\"" + escapeHtml(_0x554df9) + "\" aria-label=\"删除自定义名称" + escapeHtml(_0x53f297) + '\x22>' + renderWorkspaceActionIcon('delete') + "</button>" : '';
    const _0x22c5c3 = _0x285559?.['sourceCharacterId'] ? '\x20data-person-replacement-source-character-id=\x22' + escapeHtml(_0x285559['sourceCharacterId']) + '\x22' : '';
    return '<span\x20class=\x22person-replacement-detection-picker-option-row' + (_0x285559?.["deletable"] ? " is-deletable" : '') + "\"><button type=\"button\" class=\"story-project-sort-option" + (_0x5791f7 ? " is-selected" : '') + "\" data-person-replacement-action=\"select-detection-picker-option\" data-person-replacement-detection-picker-option=\"" + escapeHtml(_0x554df9) + '\x22' + _0x22c5c3 + " role=\"option\" aria-selected=\"" + _0x5791f7 + "\"><span>" + escapeHtml(_0x53f297) + '</span></button>' + _0x29108d + "</span>";
  })['join']('');
}
function renderPersonMappingScopeMenu({
  personLabel = "当前人物",
  targetName = "目标人物",
  appearanceName = "当前形象"
} = {}) {
  return "<div class=\"person-replacement-mapping-scope-menu\" data-person-replacement-mapping-scope-menu role=\"menu\" aria-label=\"选择人物形象应用范围\">\n    <div class=\"person-replacement-mapping-scope-heading\">\n      <strong>" + escapeHtml(personLabel) + " 已有绑定</strong>\n      <small>" + escapeHtml(targetName) + '\x20·\x20' + escapeHtml(appearanceName) + "</small>\n    </div>\n    <button type=\"button\" class=\"person-replacement-mapping-scope-option\" data-person-replacement-action=\"confirm-person-mapping-scope\" data-person-replacement-mapping-scope=\"current\" role=\"menuitem\">\n      <span class=\"person-replacement-mapping-scope-option-copy\">\n        <span class=\"person-replacement-mapping-scope-option-title\">仅当前片段</span>\n        <small class=\"person-replacement-mapping-scope-option-subtitle\">只替换这个片段中的人物形象</small>\n      </span>\n    </button>\n    <button type=\"button\" class=\"person-replacement-mapping-scope-option\" data-person-replacement-action=\"confirm-person-mapping-scope\" data-person-replacement-mapping-scope=\"all\" role=\"menuitem\">\n      <span class=\"person-replacement-mapping-scope-option-copy\">\n        <span class=\"person-replacement-mapping-scope-option-title\">应用全部片段</span>\n        <small class=\"person-replacement-mapping-scope-option-subtitle\">同步替换该人物在所有片段中的形象</small>\n      </span>\n    </button>\n  </div>";
}
function hasTargetAssetBinding(_0x50e66f, _0x510fdb) {
  const _0xc8e4ab = Array["isArray"](_0x510fdb?.["referenceImages"]) ? _0x510fdb["referenceImages"] : [];
  return _0xc8e4ab['some'](_0x2fad17 => _0x2fad17["role"] === 'target-character' && _0x2fad17["targetCharacterId"] === _0x50e66f['id']);
}
function renderTargetAssetGroup(_0x342642, _0x4be4e5, _0x1a19e8) {
  const _0x24614e = _0x4be4e5 === "scene";
  const _0x399238 = _0x24614e ? _0x342642["scenes"] : _0x342642["characters"];
  const _0xc0e469 = _0x399238["map"](normalizeProjectAssetMediaForRender);
  const _0x1228f9 = {
    ...buildPersonReplacementAssetViewState({
      ..._0x342642,
      'characters': _0x24614e ? _0x342642['characters'] : _0xc0e469,
      'scenes': _0x24614e ? _0xc0e469 : _0x342642["scenes"],
      'workspace': {
        ..._0x342642["workspace"],
        'characterAssetTab': _0x4be4e5
      }
    }),
    'allowDeleteAssetCard': ![],
    'allowAssetRename': ![],
    'assetSelectionMode': ![],
    'selectedAssetIds': []
  };
  const _0x3858b6 = _0xc0e469["map"](_0x429d54 => {
    const _0x1b5ef5 = getWorkspaceAssetAppearances(_0x429d54);
    const _0x64eff2 = _0x1b5ef5["filter"](_0x4b4062 => _0x4b4062['imageUrl']);
    const _0x139048 = Math["max"](0x0, Math["min"](_0x1b5ef5['length'] - 0x1, Math["trunc"](Number(_0x342642["workspace"]['assetAppearanceIndexes']?.[_0x429d54['id']]) || 0x0)));
    const _0x8f1202 = _0x1b5ef5[_0x139048]?.['id'];
    const _0x99ebf2 = Math["max"](0x0, _0x64eff2["findIndex"](_0x531e42 => _0x531e42['id'] === _0x8f1202));
    return {
      'asset': _0x429d54,
      'appearances': _0x64eff2,
      'appearance': _0x64eff2[_0x99ebf2] || null,
      'selectedIndex': _0x99ebf2
    };
  })["filter"](_0x7ffd15 => _0x7ffd15["appearance"]);
  const _0x4154fc = _0x3858b6["map"](({
    asset: _0x63557a,
    appearances: _0x1c1dec,
    appearance: _0x3dfe58,
    selectedIndex: _0x1350b6
  }) => {
    if (_0x24614e) {
      return renderPersonReplacementAssetCard(_0x1228f9, _0x63557a, {
        'previewAppearance': _0x3dfe58,
        'statusText': '场景图\x20' + (_0x1350b6 + 0x1) + '/' + _0x1c1dec['length'],
        'draggable': !![],
        'cardClassName': "person-replacement-target-asset person-replacement-scene-reference-asset",
        'cardAttributes': "data-person-replacement-replacement-asset-kind=\"scene\" data-person-replacement-target-scene-id=\"" + escapeHtml(_0x63557a['id']) + "\" data-person-replacement-target-scene-appearance-id=\"" + escapeHtml(_0x3dfe58['id']) + "\" aria-label=\"" + escapeHtml('拖拽' + _0x63557a["name"] + '到首帧画面作为场景参考') + '\x22',
        'shellClassName': 'person-replacement-target-asset-shell'
      });
    }
    const _0x5b283f = _0x1c1dec["length"] > 0x1;
    const _0x2035fe = _0x5b283f ? "<span class=\"person-replacement-target-appearance-controls\" data-person-replacement-target-controls=\"" + escapeHtml(_0x63557a['id']) + "\" data-story-asset-hover-id=\"" + escapeHtml(_0x63557a['id']) + '\x22>' + renderPersonReplacementPreviewArrow("previous", {
      'action': "target-previous-appearance",
      'label': _0x63557a["name"] + '上一个形象',
      'className': "person-replacement-target-appearance-arrow"
    }) + renderPersonReplacementPreviewArrow('next', {
      'action': "target-next-appearance",
      'label': _0x63557a['name'] + "下一个形象",
      'className': "person-replacement-target-appearance-arrow"
    }) + '</span>' : '';
    const _0xec1a4a = hasTargetAssetBinding(_0x63557a, _0x1a19e8);
    return renderPersonReplacementAssetCard(_0x1228f9, _0x63557a, {
      'previewAppearance': _0x3dfe58,
      'statusText': '形象\x20' + (_0x1350b6 + 0x1) + '/' + _0x1c1dec["length"],
      'cardMetaHtml': renderPersonReplacementVoiceReferenceStatus(_0x63557a),
      'draggable': !![],
      'cardClassName': "person-replacement-target-asset" + (_0xec1a4a ? " has-person-replacement-input" : ''),
      'cardAttributes': "data-person-replacement-target-character-id=\"" + escapeHtml(_0x63557a['id']) + "\" data-person-replacement-target-appearance-id=\"" + escapeHtml(_0x3dfe58['id']) + "\" data-person-replacement-target-appearance-index=\"" + _0x1350b6 + "\" data-person-replacement-target-appearance-count=\"" + _0x1c1dec["length"] + "\" data-person-replacement-target-appearance-wheel=\"" + _0x5b283f + "\" aria-label=\"拖拽" + escapeHtml(_0x63557a["name"]) + '的' + escapeHtml(_0x3dfe58["name"]) + "到视频人物框\"",
      'shellClassName': "person-replacement-target-asset-shell",
      'accessoryHtml': _0x2035fe
    });
  })["join"]('');
  if (_0x24614e && !_0x4154fc) {
    return '';
  }
  const _0x566b8a = _0x24614e ? '场景' : '角色';
  const _0xceb22b = '请先在素材设定上传基础形象';
  return "<div class=\"person-replacement-target-asset-group\" data-person-replacement-target-asset-group=\"" + _0x4be4e5 + '\x22\x20role=\x22group\x22\x20aria-labelledby=\x22person-replacement-target-asset-group-' + _0x4be4e5 + "\">\n    <h3 class=\"person-replacement-target-asset-group-heading\" id=\"person-replacement-target-asset-group-" + _0x4be4e5 + '\x22>' + _0x566b8a + "：</h3>\n    <div class=\"person-replacement-target-asset-group-items\">" + (_0x4154fc || "<p class=\"person-replacement-inline-empty\">" + _0xceb22b + '</p>') + "</div>\n  </div>";
}
function renderTargetAssetRail(_0x2dfdb9, _0x14bb9f) {
  const _0x5bf4ed = _0x14bb9f?.["promptPackage"] || null;
  return "<aside class=\"person-replacement-target-assets\">\n    <div class=\"person-replacement-target-assets-heading\">\n      <strong>替换素材</strong>\n      <small>拖拽角色到首帧人物框；拖拽场景到首帧画面</small>\n    </div>\n    <div class=\"person-replacement-target-asset-list\">\n      " + renderTargetAssetGroup(_0x2dfdb9, "character", _0x5bf4ed) + '\x0a\x20\x20\x20\x20\x20\x20' + renderTargetAssetGroup(_0x2dfdb9, "scene", _0x5bf4ed) + "\n    </div>\n  </aside>";
}
function renderVideoReplacementReferenceRail(_0x2c04db, _0xe2f53e) {
  const _0x3952f5 = _0xe2f53e?.["shot"] || null;
  const _0x395d57 = _0xe2f53e?.['imageInput'] || {};
  const _0x196e1d = Array['isArray'](_0x395d57['referenceOptions']) ? _0x395d57["referenceOptions"] : [];
  const _0x48f322 = Math["trunc"](Number(_0x395d57['activeReferenceIndex']));
  const _0x9fd810 = _0x395d57["mode"] === PERSON_REPLACEMENT_VIDEO_INPUT_MODE_CHARACTER_REFERENCE;
  const _0x1c4b9c = _0x9fd810 ? "包含上一轮全部图像替换结果与当前镜头的角色绑定图" : '来自上一轮图像替换的全部片段结果';
  const _0x2bdeb3 = _0x196e1d["map"]((_0x5858aa, _0x437b0e) => {
    const _0x5d0ea8 = _0x5858aa["kind"] === PERSON_REPLACEMENT_VIDEO_REFERENCE_KIND_CHARACTER_IMAGE;
    const _0x54284c = _0x5858aa['reference'] || {};
    const _0x41eb43 = normalizeText(_0x5858aa['sourceShotId']);
    const _0x4e00b9 = Math["max"](0x0, Math["trunc"](Number(_0x5858aa["sourceShotIndex"]) || 0x0));
    const _0x28eba8 = Math["max"](0x0, Math["trunc"](Number(_0x5858aa["resultIndex"]) || 0x0));
    const _0x4f3c69 = Math['max'](0x1, Math['trunc'](Number(_0x5858aa["resultCount"]) || 0x1));
    const _0x43a044 = _0x5d0ea8 ? normalizeText(_0x54284c['characterName']) || "人物参考图" : '片段' + (_0x4e00b9 + 0x1) + ".图片" + (_0x28eba8 + 0x1);
    const _0x3cdd96 = _0x5d0ea8 ? "角色绑定图 · " + (normalizeText(_0x54284c["appearanceName"]) || "基础形象") : "图像替换结果";
    const _0x200cf7 = _0x5d0ea8 ? "<small>" + escapeHtml(_0x3cdd96) + "</small>" : "<span class=\"person-replacement-video-reference-status\" aria-label=\"图像替换结果 " + (_0x28eba8 + 0x1) + '/' + _0x4f3c69 + '\x22>' + escapeHtml(_0x3cdd96) + '\x20' + (_0x28eba8 + 0x1) + '/' + _0x4f3c69 + "</span>";
    const _0x1b88e1 = normalizeMediaUrl(_0x5858aa["imageRef"]);
    const _0x1ba8d2 = _0x437b0e === _0x48f322;
    const _0x2390af = _0x1b88e1 ? " data-story-asset-hover-id=\"" + escapeHtml(_0x41eb43 || _0x3952f5?.['id'] || '') + "\" data-person-replacement-video-reference-hover-preview=\"true\"" : '';
    const _0x5a69c2 = _0x5d0ea8 ? normalizeText(_0x54284c["personId"] || _0x54284c["characterId"] + ':' + _0x54284c['appearanceId']) : '';
    const _0x12a716 = _0x5d0ea8 ? "character:" + _0x5a69c2 : "shot:" + _0x41eb43;
    const _0xbc5e3d = _0x5d0ea8 ? '' : " data-person-replacement-video-reference-source-shot-id=\"" + escapeHtml(_0x41eb43) + '\x22\x20data-person-replacement-video-reference-result-index=\x22' + _0x28eba8 + "\" data-person-replacement-video-reference-result-count=\"" + _0x4f3c69 + '\x22' + (_0x4f3c69 > 0x1 ? " data-person-replacement-video-reference-wheel=\"true\"" : '');
    const _0x512e6a = !_0x5d0ea8 && _0x4f3c69 > 0x1 ? "<span class=\"person-replacement-target-appearance-controls person-replacement-video-reference-controls\" data-person-replacement-video-reference-controls=\"" + escapeHtml(_0x41eb43) + '\x22\x20data-person-replacement-video-reference-result-index=\x22' + _0x28eba8 + '\x22>' + renderPersonReplacementPreviewArrow("previous", {
      'action': "video-reference-previous-result",
      'label': _0x43a044 + '的上一张图片',
      'className': "person-replacement-target-appearance-arrow person-replacement-video-reference-arrow"
    }) + renderPersonReplacementPreviewArrow("next", {
      'action': "video-reference-next-result",
      'label': _0x43a044 + "的下一张图片",
      'className': "person-replacement-target-appearance-arrow person-replacement-video-reference-arrow"
    }) + "</span>" : '';
    const _0x50847a = "<span class=\"story-asset-card-shell person-replacement-target-asset-shell person-replacement-video-reference-shell\">\n      <button type=\"button\" class=\"person-replacement-video-reference-card " + (_0x1ba8d2 ? "is-selected" : '') + "\" data-story-action=\"select-video-shot-reference\" data-shot-id=\"" + escapeHtml(_0x3952f5?.['id'] || '') + '\x22\x20data-person-replacement-video-reference-index=\x22' + _0x437b0e + "\" data-person-replacement-video-reference-key=\"" + escapeHtml(_0x12a716) + "\" data-person-replacement-video-reference-kind=\"" + escapeHtml(_0x5858aa['kind']) + '\x22' + (_0x5d0ea8 ? " data-person-replacement-video-character-reference=\"" + escapeHtml(_0x5a69c2) + '\x22' : '') + _0xbc5e3d + _0x2390af + '\x20aria-pressed=\x22' + _0x1ba8d2 + "\" aria-label=\"" + escapeHtml('选择' + _0x43a044 + "作为视频替换参考图" + (_0x4f3c69 > 0x1 && !_0x5d0ea8 ? '，可滚动鼠标滚轮切换图片' : '')) + "\">\n      <span class=\"person-replacement-video-reference-media\">" + (_0x1b88e1 ? "<img src=\"" + escapeHtml(_0x1b88e1) + "\" alt=\"" + escapeHtml(_0x43a044) + "\" loading=\"lazy\" decoding=\"async\" draggable=\"false\">" : '') + "</span>\n      <span class=\"person-replacement-video-reference-copy" + (_0x5d0ea8 ? '' : " has-result-status") + "\"><strong>" + escapeHtml(_0x43a044) + "</strong>" + _0x200cf7 + "</span>\n      <span class=\"person-replacement-video-reference-selection\" aria-hidden=\"true\"" + (_0x1ba8d2 ? '' : " hidden") + '>当前</span>\x0a\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20' + _0x512e6a + "\n    </span>";
    return {
      'cardHtml': _0x50847a,
      'characterReferenceId': _0x5a69c2,
      'isCharacterReference': _0x5d0ea8
    };
  });
  const _0x2d758a = _0x2bdeb3["filter"](({
    isCharacterReference: _0x442b08
  }) => !_0x442b08)["map"](({
    cardHtml: _0x47fba2
  }) => _0x47fba2)["join"]('');
  const _0x3c7ccb = new Map(_0x2bdeb3["filter"](({
    isCharacterReference: _0x4f6c99
  }) => _0x4f6c99)["map"](_0x2dec7f => [_0x2dec7f['characterReferenceId'], _0x2dec7f["cardHtml"]]));
  const _0x30521e = Array["isArray"](_0x395d57["references"]) ? _0x395d57["references"]['filter'](_0x556804 => normalizeText(_0x556804?.['imageRef'])) : [];
  const _0x5c6826 = _0x30521e["map"](_0x3554f2 => {
    const _0x1e864b = normalizeText(_0x3554f2["personId"] || _0x3554f2["characterId"] + ':' + _0x3554f2["appearanceId"]);
    const _0x4a94bf = _0x3c7ccb["get"](_0x1e864b);
    return _0x4a94bf || '';
  })['join']('');
  const _0x24e6eb = _0x9fd810 && _0x30521e['length'] > 0x1 ? "<p class=\"person-replacement-reference-note\">每次生成使用一张人物参考图，请选择本次入参。</p>" : '';
  const _0xe53b21 = ({
    kind: _0x5efa1e,
    label: _0x5cdaf6,
    cardsHtml: _0x450f4a,
    emptyText: _0x4cdd61,
    noteHtml = ''
  }) => "<section class=\"person-replacement-target-asset-group person-replacement-video-reference-group\" data-person-replacement-video-reference-group=\"" + escapeHtml(_0x5efa1e) + "\" role=\"group\" aria-label=\"" + escapeHtml(_0x5cdaf6) + '\x22>\x0a\x20\x20\x20\x20\x20\x20<h3\x20class=\x22person-replacement-target-asset-group-heading\x22>' + escapeHtml(_0x5cdaf6) + "：</h3>\n      <div class=\"person-replacement-target-asset-group-items\">" + (_0x450f4a || "<p class=\"person-replacement-inline-empty\">" + escapeHtml(_0x4cdd61) + '</p>') + noteHtml + "</div>\n    </section>";
  const _0x5242b8 = _0x9fd810 ? _0xe53b21({
    'kind': "character",
    'label': "人物参考",
    'cardsHtml': _0x5c6826,
    'emptyText': "当前片段没有已绑定的人物参考图",
    'noteHtml': _0x24e6eb
  }) : '';
  const _0x5bba10 = _0xe53b21({
    'kind': "first-frame",
    'label': "首帧参考",
    'cardsHtml': _0x2d758a,
    'emptyText': "请先在图像替换中生成替换首帧"
  });
  return '<aside\x20class=\x22person-replacement-target-assets\x20person-replacement-video-reference-assets\x22>\x0a\x20\x20\x20\x20<div\x20class=\x22person-replacement-target-assets-heading\x22><strong>替换参考图</strong><small>' + escapeHtml(_0x1c4b9c) + "</small></div>\n    <div class=\"person-replacement-target-asset-list person-replacement-video-reference-list\" data-person-replacement-video-reference-list tabindex=\"0\">" + _0x5242b8 + _0x5bba10 + "</div>\n  </aside>";
}
function renderDetectionBox(_0x98b1fa, _0x2074be, _0x2e46e5, {
  duplicateRoleLabels = new Set()
} = {}) {
  const _0x45317e = _0x98b1fa['locator']?.["bbox"] || _0x98b1fa["bbox"];
  if (!_0x45317e) {
    return '';
  }
  const _0x27d569 = _0x98b1fa["detectionMethod"] === "manual";
  const _0x156f90 = normalizeText(_0x2e46e5["workspace"]["selectedShotId"]);
  const _0xa0165e = getPersonReplacementIdentityCorrectionDraftKey(_0x156f90, _0x98b1fa['id']);
  const _0x4e1b34 = _0x2e46e5["workspace"]["identityCorrectionDrafts"][_0xa0165e] || {};
  const _0x2f18c7 = _0x2e46e5["characters"]["find"](_0x4ebb6b => _0x4ebb6b['id'] === _0x98b1fa["targetCharacterId"]);
  const _0x5000ae = _0x2f18c7 ? getCharacterAppearance(_0x2f18c7, _0x98b1fa['targetAppearanceId']) : null;
  const _0x43fdc5 = _0x98b1fa["identityReviewStatus"] === "needs_review" || _0x98b1fa['identityReviewRequired'] === !![];
  const _0x3d6792 = Object["keys"](_0x4e1b34)["length"] > 0x0;
  const _0x4059cf = normalizeText(_0x4e1b34["orientation"], normalizeText(_0x98b1fa['orientation']));
  const _0xb8b6c6 = formatPersonOrientation(_0x4059cf);
  const _0x1366bf = resolvePersonReplacementDetectionLabel(_0x98b1fa, _0x2074be, _0x2e46e5, _0x156f90);
  const _0x1ff27e = duplicateRoleLabels["has"](_0x1366bf);
  const _0x234993 = normalizeText(_0x4e1b34["sourceCharacterId"], normalizeText(_0x98b1fa["sourceCharacterId"]));
  const _0x41229e = _0x1ff27e ? '角色名重复' : _0x2f18c7 ? "已绑定" : "未绑定";
  const _0x29a26e = PERSON_REPLACEMENT_ORIENTATIONS["includes"](_0x4059cf) && _0x4059cf !== "unknown" ? _0x4059cf : '';
  const _0x5f2390 = normalizePersonReplacementScope(_0x98b1fa["replacementScope"]);
  const _0x3390fb = formatPersonReplacementScopeLabel(_0x5f2390);
  const _0x45fa79 = _0x43fdc5 || _0x3d6792 || PERSON_REPLACEMENT_ORIENTATION_ENABLED && !_0x29a26e;
  const _0xf0d2b5 = PERSON_REPLACEMENT_ORIENTATION_ENABLED ? "<span class=\"person-replacement-detection-separator\" aria-hidden=\"true\">·</span>" + renderPersonDetectionPicker({
    'kind': "orientation",
    'value': _0x29a26e,
    'label': _0x29a26e ? _0xb8b6c6 : "选择朝向",
    'ariaLabel': "人物朝向：" + (_0x29a26e ? _0xb8b6c6 : "待选择")
  }) : '';
  const _0x204d08 = "<span class=\"person-replacement-detection-separator\" aria-hidden=\"true\">·</span>" + renderPersonDetectionPicker({
    'kind': "scope",
    'value': _0x5f2390,
    'label': _0x3390fb,
    'ariaLabel': "替换范围：" + _0x3390fb
  });
  const _0x524d90 = !_0x2f18c7 ? "is-unready" : _0x45fa79 ? "is-partially-ready" : "is-ready";
  const _0x3cb2b2 = '' + renderPersonDetectionPicker({
    'kind': "label",
    'value': _0x1366bf,
    'label': _0x1366bf,
    'ariaLabel': "人物名称：" + _0x1366bf,
    'customInputValue': _0x1366bf,
    'sourceCharacterId': _0x234993
  }) + _0x204d08 + _0xf0d2b5 + '<span\x20class=\x22person-replacement-detection-separator\x22\x20aria-hidden=\x22true\x22>·</span><span\x20class=\x22person-replacement-detection-binding-status\x20' + (_0x1ff27e ? 'is-conflict' : _0x2f18c7 ? "is-bound" : "is-unbound") + '\x22>' + _0x41229e + "</span>";
  const _0x39c47b = _0x2f18c7 && _0x5000ae?.["imageUrl"] ? " data-story-asset-hover-id=\"" + escapeHtml(_0x2f18c7['id']) + "\" data-story-asset-hover-appearance-id=\"" + escapeHtml(_0x5000ae['id']) + '\x22' : '';
  const _0x489fa4 = "<button type=\"button\" class=\"story-action-icon-button is-danger person-replacement-detection-delete-action\" data-person-replacement-action=\"delete-person\" data-shot-id=\"" + escapeHtml(_0x2e46e5["workspace"]['selectedShotId']) + '\x22\x20data-person-id=\x22' + escapeHtml(_0x98b1fa['id']) + "\" aria-label=\"删除" + escapeHtml(_0x1366bf) + "检测框\">" + renderWorkspaceActionIcon("delete") + "</button>";
  const _0x5f00e4 = ['n', 'e', 's', 'w', 'nw', 'ne', 'sw', 'se']["map"](_0x147b54 => "<span class=\"person-replacement-manual-resize-handle is-" + _0x147b54 + "\" data-person-replacement-manual-resize=\"" + _0x147b54 + "\" aria-hidden=\"true\"></span>")["join"]('');
  const _0x404d6a = _0x27d569 ? " data-person-replacement-manual-person tabindex=\"0\" aria-keyshortcuts=\"Delete D\"" : " tabindex=\"0\" aria-keyshortcuts=\"Delete D\"";
  const _0x351071 = '<svg\x20class=\x22person-replacement-detection-readiness-border\x22\x20width=\x22100%\x22\x20height=\x22100%\x22\x20aria-hidden=\x22true\x22\x20focusable=\x22false\x22><rect\x20class=\x22person-replacement-detection-readiness-stroke\x22></rect></svg>';
  return "<div class=\"person-replacement-detection-box has-identity-controls is-movable " + (_0x2f18c7 ? "is-mapped" : '') + '\x20' + (_0x43fdc5 ? "needs-identity-review" : '') + '\x20' + (_0x45fa79 ? "is-identity-editing" : '') + '\x20' + _0x524d90 + '\x20' + (_0x27d569 ? "is-manual" : '') + '\x20' + (_0x1ff27e ? "has-role-conflict" : '') + '\x22\x20style=\x22--box-x:' + _0x45317e['x'] * 0x64 + "%;--box-y:" + _0x45317e['y'] * 0x64 + "%;--box-width:" + _0x45317e['width'] * 0x64 + "%;--box-height:" + _0x45317e["height"] * 0x64 + "%\" data-person-replacement-person-drop" + _0x39c47b + _0x404d6a + " data-person-id=\"" + escapeHtml(_0x98b1fa['id']) + "\" data-shot-id=\"" + escapeHtml(_0x156f90) + "\" aria-label=\"" + escapeHtml(_0x1ff27e ? _0x1366bf + "，角色名重复" : _0x1366bf) + '\x22' + (_0x1ff27e ? '\x20aria-invalid=\x22true\x22' : '') + '>' + _0x351071 + "<div class=\"person-replacement-detection-label\"><span class=\"person-replacement-detection-summary\">" + _0x3cb2b2 + "</span><span class=\"person-replacement-detection-actions\">" + _0x489fa4 + "</span></div>" + (_0x2f18c7 ? '<div\x20class=\x22person-replacement-mapping-badge\x22><span\x20class=\x22person-replacement-mapping-badge-text\x22>→\x20' + escapeHtml(_0x2f18c7['name']) + '\x20·\x20' + escapeHtml(_0x5000ae?.['name'] || "基础形象") + "</span><button type=\"button\" class=\"story-action-icon-button is-danger story-project-delete-trigger person-replacement-mapping-remove person-replacement-detection-delete-action\" data-person-replacement-action=\"clear-person-mapping\" data-shot-id=\"" + escapeHtml(_0x156f90) + "\" data-person-id=\"" + escapeHtml(_0x98b1fa['id']) + "\" aria-label=\"解除" + escapeHtml(_0x1366bf) + '的人物绑定\x22>' + renderWorkspaceActionIcon('unlink') + '</button></div>' : "<div class=\"person-replacement-mapping-badge\">拖入目标形象</div>") + _0x5f00e4 + "</div>";
}
function renderVideoReplacementReferenceInputs(_0x1d12a8) {
  const _0x53636a = _0x1d12a8?.["slotState"] || {};
  const {
    fixedInputConfig: _0x194013
  } = _0x53636a;
  if (!_0x194013?.["visibleSlots"]?.['length']) {
    return '';
  }
  const _0x196d85 = Object["fromEntries"](Object["entries"](_0x53636a["inputsBySlot"])["map"](([_0x4982c7, _0x2a7f3f]) => [_0x4982c7, {
    ..._0x2a7f3f,
    'url': normalizeMediaUrl(_0x2a7f3f["url"]),
    'thumbUrl': normalizeMediaUrl(_0x2a7f3f["thumbUrl"]),
    'previewVideoUrl': _0x2a7f3f["kind"] === "video" ? normalizeMediaUrl(_0x2a7f3f['url']) : ''
  }]));
  return renderVideoReferenceBarMarkup({
    'fixedInputConfig': _0x194013,
    'inputsBySlot': _0x196d85,
    'readOnlyFixedInputSlots': _0x53636a['readOnlySlots'],
    'showItemTitles': ![],
    'attachmentButtonHtml': ''
  });
}
function renderPromptReferenceInputs(_0x2d4903, _0x685893) {
  const _0x3139b7 = Array["isArray"](_0x685893?.["referenceImages"]) ? _0x685893["referenceImages"] : [];
  if (!_0x3139b7['length']) {
    return '';
  }
  const _0x2f6292 = new Map(_0x2d4903["characters"]["map"](_0x42625c => [_0x42625c['id'], _0x42625c]));
  const _0x3470c7 = new Map(_0x2d4903["scenes"]["map"](_0x336d1d => [_0x336d1d['id'], _0x336d1d]));
  const _0x43cf37 = _0x3139b7["map"](_0x1f3eec => {
    const _0x45d354 = Math["max"](0x1, Number(_0x1f3eec["slot"]) || 0x1);
    const _0x4b97ed = _0x2f6292['get'](_0x1f3eec["targetCharacterId"]);
    const _0xebd542 = _0x3470c7["get"](_0x1f3eec["targetSceneId"]);
    const _0x16b6ea = _0x1f3eec["role"] === 'source-keyframe' ? '图' + _0x45d354 + " · 当前首帧" + (_0x685893["annotatedSource"] ? "（提交时叠加人物框）" : '') : _0x1f3eec['role'] === "person-location-guide" ? '图' + _0x45d354 + " · A–H 定位图" : _0x1f3eec["role"] === 'target-scene' ? '图' + _0x45d354 + " · 场景 · " + (_0xebd542?.["name"] || '场景参考') : '图' + _0x45d354 + " · " + (_0x4b97ed?.['name'] || "目标形象");
    const _0x4cbd8f = _0x1f3eec["role"] === "target-character";
    const _0x5dfe93 = _0x1f3eec["role"] === 'target-scene';
    return {
      'kind': "image",
      'slotId': "image-" + _0x45d354,
      'name': _0x16b6ea,
      'url': _0x1f3eec['role'] === 'person-location-guide' ? resolvePersonReplacementLocationGuidePreview(_0x1f3eec["ref"]) : normalizeMediaUrl(_0x1f3eec["ref"]),
      'removeAction': _0x4cbd8f ? "clear-person-replacement-target" : _0x5dfe93 ? "clear-person-replacement-scene-reference" : '',
      'removeValue': _0x4cbd8f ? JSON["stringify"]({
        'shotId': _0x2d4903["workspace"]["selectedShotId"],
        'targetCharacterId': _0x1f3eec["targetCharacterId"],
        'targetAppearanceId': _0x1f3eec["targetAppearanceId"]
      }) : _0x5dfe93 ? JSON["stringify"]({
        'shotId': _0x2d4903['workspace']["selectedShotId"]
      }) : ''
    };
  });
  return "<div class=\"person-replacement-prompt-reference-inputs\" aria-label=\"图像生成入参\">" + renderVideoReferenceBarMarkup({
    'readOnlyInputs': _0x43cf37,
    'showItemTitles': ![],
    'attachmentButtonHtml': ''
  }) + "</div>";
}
export function syncPersonReplacementPromptReferenceInputs(_0x30613c, _0x3d8f0f, _0x4e4457) {
  const _0x10e0c0 = _0x30613c?.['querySelector']?.(".person-replacement-prompt-reference-inputs");
  if (!_0x10e0c0?.["ownerDocument"]?.['createElement']) {
    return;
  }
  const _0x51964b = _0x10e0c0["ownerDocument"]["createElement"]('template');
  _0x51964b["innerHTML"] = renderPromptReferenceInputs(_0x3d8f0f, _0x4e4457);
  const _0x149f3f = _0x51964b["content"]["firstElementChild"];
  if (!_0x149f3f || _0x10e0c0["innerHTML"] === _0x149f3f['innerHTML']) {
    return;
  }
  const _0x264c11 = _0x10e0c0["querySelector"](".ref-thumb-container--readonly");
  const _0x9676e2 = _0x149f3f["querySelector"](".ref-thumb-container--readonly");
  if (!_0x264c11 || !_0x9676e2) {
    _0x10e0c0['querySelectorAll']("img")["forEach"](_0x4bff2d => _0x4bff2d["removeAttribute"]("src"));
    _0x10e0c0["replaceChildren"](..._0x149f3f["childNodes"]);
    return;
  }
  const _0x2a5019 = [..._0x10e0c0['querySelectorAll']("[data-ref-readonly-key]")];
  let _0x3d78ac = _0x264c11['firstElementChild'];
  for (const _0x17754d of _0x9676e2["querySelectorAll"]('[data-ref-readonly-key]')) {
    const _0x1e1c19 = _0x2a5019["findIndex"](_0x359fe0 => _0x359fe0["dataset"]["refReadonlyKey"] === _0x17754d["dataset"]["refReadonlyKey"]);
    const _0x4a41ad = _0x1e1c19 < 0x0 ? _0x17754d : _0x2a5019['splice'](_0x1e1c19, 0x1)[0x0];
    if (_0x4a41ad !== _0x17754d) {
      for (const {
        name: _0x44439a,
        value: _0x32e0da
      } of _0x17754d['attributes']) {
        if (_0x4a41ad["getAttribute"](_0x44439a) !== _0x32e0da) {
          _0x4a41ad["setAttribute"](_0x44439a, _0x32e0da);
        }
      }
    }
    if (_0x4a41ad !== _0x3d78ac) {
      _0x264c11["insertBefore"](_0x4a41ad, _0x3d78ac);
    }
    _0x3d78ac = _0x4a41ad["nextElementSibling"];
  }
  for (const _0x5dd261 of _0x2a5019) {
    _0x5dd261["querySelectorAll"]('img')["forEach"](_0x1644ac => _0x1644ac["removeAttribute"]("src"));
    _0x5dd261["remove"]();
  }
}
export function createPersonReplacementIdentityPresentation() {
  return Object["freeze"]({
    'buildImage'(_0x5585d1, _0x47f7ee, {
      people = [],
      duplicateRoleLabels = new Set()
    } = {}) {
      const _0x11ab87 = Array["isArray"](people) ? people : [];
      return Object["freeze"]({
        'targetAssetRailHtml': renderTargetAssetRail(_0x5585d1, _0x47f7ee),
        'detectionBoxesHtml': _0x11ab87["map"]((_0x549b32, _0x3302f2) => renderDetectionBox(_0x549b32, _0x3302f2, _0x5585d1, {
          'duplicateRoleLabels': duplicateRoleLabels
        }))['join'](''),
        'promptReferenceInputsHtml': renderPromptReferenceInputs(_0x5585d1, _0x47f7ee?.["promptPackage"])
      });
    },
    'buildVideo'(_0x15262a, _0x45f3f5) {
      return Object["freeze"]({
        'referenceRailHtml': renderVideoReplacementReferenceRail(_0x15262a, _0x45f3f5),
        'referenceInputsHtml': renderVideoReplacementReferenceInputs(_0x45f3f5)
      });
    },
    'renderOverlay'(_0x51cd04, _0x174535 = {}) {
      if (_0x51cd04 === "picker-options") {
        return renderPersonDetectionPickerOptions(_0x174535["options"], _0x174535['selectedValue']);
      }
      if (_0x51cd04 === "mapping-scope") {
        return renderPersonMappingScopeMenu(_0x174535);
      }
      return '';
    }
  });
}